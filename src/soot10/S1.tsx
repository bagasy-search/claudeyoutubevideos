import React from "react";
import { interpolate } from "remotion";
import { C, prog, Emote, Chip } from "./kit";
import { Persona, GRUMETE, CAPITAN, PIRATA, CIVIL, Ropa } from "./persona";
import { Key, CUB, ALCA, MAR, BarcoLejos, Barril } from "./barco";
import { G, S, P, arco, Moneda8, Galleta, Tijera, Balde, Cofre, Sierra, Frasco, Pistola, Botella, Sello, Globo, Signo, Cuenco, Libro, TINTA } from "./obj";
import { Txt, Lbl, en } from "./dsl";
import { CartelTrampa, MERCANTE_X, SX } from "./mundo";

// TRAMPA 1 · LA CAPTURA (52,3-152,6): Jamaica 1716, la madre, el mercante de azúcar, la cárcel flotante,
// la vela en el horizonte, la bandera negra, el abordaje, el saqueo, la selección de la tripulación y "begging".
const MX = MERCANTE_X;
export const CAP_MERC: Ropa = { tunica: "#2f4fa8", tunica2: "#1d2f6a", cinto: "#1d1410", piel: "#f2c7a0", piel2: "#d9a07a", pelo: "#8a8a8a", piernas: "#e8e2d0", gorro: "tricornio", gorroCol: "#1d1420" };
const MADRE: Ropa = { tunica: "#9b7bf0", tunica2: "#5b2bb5", cinto: "#fff3d6", piel: "#f2b48a", piel2: "#d98d66", pelo: "#5a2d14", piernas: "#5b2bb5", gorro: "bandana", gorroCol: "#fff3d6" };
const MARINO = (i: number): Ropa => ({ ...CIVIL(i), piernas: ["#3b3b5a", "#6b5a3a", "#2a3a4a"][i % 3], gorro: (["gorra", "no", "bandana"] as const)[i % 3], gorroCol: ["#2f5fa8", "#000", "#c9a06a"][i % 3] });

export const K1: Key[] = [
  [52.3, -13900, 1450, 0.55, 1.5],
  [56.3, -13620, 1700, 1.55, 0.9],
  [61.1, -13560, 1760, 2.1, 0.8],
  [62.6, -12100, 1560, 0.62, 1.4],
  [64.7, -8700, 1560, 0.95, 1.4],
  [66.4, -7500, 1150, 1.15, 1.8],
  [69.9, -6500, 1380, 1.2, 0.9],
  [74.9, -6200, 1450, 0.7, 1.0],
  [79.4, -6250, 1350, 0.85, 0.7],
  [82.5, -7550, 1100, 1.7, 0.9],
  [84.7, -7300, 1090, 1.9, 0.6, "seco"],
  [89.5, -6700, 1390, 1.7, 0.8],
  [93.9, -4600, 1300, 0.36, 1.6],
  [97.2, -3600, 1600, 0.6, 1.8],
  [99.7, -2150, 1720, 1.5, 0.6, "seco"],
  [103.0, -6000, 1380, 1.3, 0.7, "seco"],
  [108.4, -6150, 1300, 1.05, 1.0],
  [112.0, -6150, -250, 1.0, 0.8],
  [113.6, -5300, 1350, 0.85, 1.0],
  [119.6, -6650, 1390, 1.8, 0.9],
  [129.6, -6410, 1380, 1.5, 0.8],
  [134.8, -6950, 1410, 3.0, 0.4, "seco"],
  [138.8, -6650, 1360, 1.5, 0.7],
  [141.6, -1350, 1330, 1.5, 0.8],
  [146.2, -3500 + 2250, 1360, 1.7, 0.7],
  [148.5, -3500 + 600, 1150, 1.3, 0.8],
  [149.6, -3500 + 400, 1000, 1.3, 1.0],
  [151.1, 1900, 1360, -1.5, 1.6],
];

const CREW = [-6800, -6540, -6280, -6020, -5760, -5500];
// mundo: Jamaica, la vela del horizonte, el pirata que salta, el saqueo en el aire, la botella
export const M1: React.FC<{ t: number }> = ({ t }) => {
  if (t < 52 || t > 156) return null;
  const sx = SX(t);
  const lejos = en(t, 93, 103.2);
  const lx = interpolate(t, [94, 103], [-600, -2500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ls = interpolate(t, [94, 103], [0.25, 1.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chicos = en(t, 61.5, 66.5);
  return (
    <>
      {/* Jamaica: la madre, el padre que se va, los chicos que bajan al puerto */}
      {en(t, 52, 70) && (
        <>
          <Persona x={-13460} y={1910} h={250} t={t} seed={41} ropa={MADRE} flip expr={t > 59.5 ? "triste" : "neutro"} habla={en(t, 59.6, 61)} bI={en(t, 59.5, 62) ? 60 : 10} cI={70}
            manoI={en(t, 59.5, 62) ? <g transform="translate(0 20) scale(0.5)"><Cuenco /></g> : undefined} />
          {t < 59.6 && <Persona x={interpolate(t, [56.8, 59.5], [-13820, -14250], { extrapolateLeft: "clamp" })} y={1910} h={250} t={t} seed={42} ropa={MARINO(4)} flip camina={t > 56.8 ? 1.4 : 0} opacity={interpolate(t, [57.6, 59.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}
          <Persona x={t < 62.6 ? -13620 : interpolate(t, [62.6, 66], [-13620, -9800], { extrapolateRight: "clamp" })} y={1910} h={t < 61.1 ? 140 : interpolate(t, [61.1, 62.2], [140, 180], { extrapolateRight: "clamp" })} t={t} seed={7} ropa={{ ...GRUMETE, gorro: "no" }} camina={en(t, 62.6, 66) ? 1.8 : 0}
            expr={t > 59.6 && t < 62.6 ? "triste" : "neutro"} />
          {chicos && Array.from({ length: 9 }, (_, i) => <Persona key={i} x={interpolate(t, [62.4 + i * 0.12, 66.5], [-15600 + i * 340, -10600 + i * 140])} y={1910} h={150 + (i % 3) * 18} t={t} seed={60 + i} ropa={{ ...CIVIL(i), gorro: "no" }} camina={1.7} />)}
          <G>
            <Lbl t={t} t0={57.6} t1={59.6} x={-14000} y={1560} txt="DAD?" size={70} color={C.lila} />
            <Lbl t={t} t0={60.2} t1={62.4} x={-13300} y={1520} txt="EMPTY" size={64} color={C.rojo} />
            <Lbl t={t} t0={61.2} t1={62.5} x={-13620} y={1680} txt="AGE 11-12" size={46} color={C.oro} />
            <S t={57.6} p="step" g={-10} />
            <S t={60.2} p="sad" g={-10} />
            <S t={61.2} p="spring" g={-8} />
            <S t={62.6} p="march" g={-10} d={3.5} />
            {/* azúcar que sube al mercante */}
            {[65.4, 66.2, 67.0, 67.8].map((a, i) => { if (!en(t, a, a + 1.2)) return null; const p = arco(t, a, a + 1.1, [-9450, 1800], [MX + 2400, 1420], 380); return <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.u * 360})`}><path d="M -46 0 Q -58 -55 -46 -110 L 46 -110 Q 58 -55 46 0 Z" fill="#c9a06a" /></g>; })}
            {[65.4, 66.2, 67.0, 67.8].map((a, i) => <S key={i} t={a} p="whoosh" g={-14} />)}
            <Lbl t={t} t0={65.6} t1={69.8} x={-9400} y={1600} txt="SUGAR" size={80} color={C.crema} />
          </G>
        </>
      )}
      {/* la vela en el horizonte que crece y levanta la bandera negra */}
      {lejos && <BarcoLejos x={lx} y={MAR} t={t} s={ls} tipo="pirata" iza={prog(t, 99.8, 100.7)} flip />}
      <S t={94.1} p="birds" g={-14} d={3} />
      <S t={97.3} p="riser" g={-10} d={2.4} />
      <S t={99.8} p="cloth" g={-4} />
      <S t={100.0} p="boom" g={-6} />
      {/* los piratas cruzan colgados de sogas */}
      {en(t, 113.4, 116.5) && (
        <G>
          {[0, 1, 2, 3].map((i) => { const a = 113.5 + i * 0.45; if (t < a || t > a + 1.3) return null; return <line key={i} x1={-4300 + i * 120} y1={200} x2={arco(t, a, a + 1.2, [-3300 + i * 60, 1150], [-5400 - i * 260, 1450], 360).x} y2={arco(t, a, a + 1.2, [-3300 + i * 60, 1150], [-5400 - i * 260, 1450], 360).y - 200} stroke="#c9a06a" strokeWidth={10} />; })}
        </G>
      )}
      {[0, 1, 2, 3].map((i) => { const a = 113.5 + i * 0.45; if (t < a || t > a + 1.25) return null; const p = arco(t, a, a + 1.2, [-3300 + i * 60, 1150], [-5400 - i * 260, 1450], 360); return <Persona key={i} x={p.x} y={p.y + 50} h={250} t={t} seed={80 + i} ropa={PIRATA(i)} flip expr="enojado" bD={170} cD={0} bI={120} manoI={<g transform="scale(0.6) rotate(-40)"><Pistola /></g>} />; })}
      {[0, 1, 2, 3].map((i) => <S key={i} t={113.5 + i * 0.45} p="rope" g={-8} />)}
      <S t={113.6} p="laugh" g={-12} />
      {/* el saqueo vuela del mercante al pirata */}
      <G>
        {([[115.7, "RUM", "barril"], [116.4, "TOOLS", "sierra"], [117.3, "MEDICINE", "cofre"], [118.2, "", "barril"], [118.7, "", "saco"]] as [number, string, string][]).map(([a, txt, k], i) => {
          if (!en(t, a, a + 1.5)) return null;
          const p = arco(t, a, a + 1.4, [-5700 + i * 80, 1400], [-2900 + i * 200, 1420], 520);
          return (
            <g key={i}>
              <g transform={`translate(${p.x} ${p.y}) rotate(${p.u * 200 - 100}) scale(${k === "cofre" ? 0.6 : 0.9})`}>
                {k === "sierra" ? <Sierra /> : k === "cofre" ? <Cofre txt="MEDS" abre={0} /> : <g><path d="M -60 0 Q -74 -70 -60 -140 L 60 -140 Q 74 -70 60 0 Z" fill="#a8682f" /><rect x={-66} y={-100} width={132} height={14} fill="#5a3418" /><rect x={-66} y={-40} width={132} height={14} fill="#5a3418" /></g>}
              </g>
              {txt && <Lbl t={t} t0={a + 0.1} t1={a + 1.4} x={p.x} y={p.y - 150} txt={txt} size={80} color={C.oro} />}
            </g>
          );
        })}
        {[115.7, 116.4, 117.3, 118.2, 118.7].map((a, i) => <S key={i} t={a} p="whoosh" g={-10} pitch={0.9 + i * 0.06} />)}
        {[116.9, 117.6, 118.6, 119.4, 119.9].map((a, i) => <S key={`l${i}`} t={a} p="wood_hit" g={-10} />)}
        {/* la botella con "begging" */}
        {en(t, 148.6, 156) && (() => {
          const p = t < 150.3 ? arco(t, 149.4, 150.3, [-3500 + 520, 1080], [-3500 - 300, MAR + 20], 260) : { x: -3500 - 300 - (t - 150.3) * 60, y: MAR + 10 + Math.sin(t * 2.4) * 14, u: 1 };
          return <g transform={`translate(${p.x} ${p.y}) rotate(${t < 150.3 ? p.u * 540 : 70 + Math.sin(t * 2) * 12}) scale(0.7)`}><Botella c="#7ac8e8" txt="BEGGING" /></g>;
        })()}
        <S t={149.4} p="whoosh" g={-8} />
        <S t={150.3} p="splash" g={-4} />
      </G>
    </>
  );
};

// a bordo del MERCANTE (coordenadas del mercante)
export const Me1: React.FC<{ t: number }> = ({ t }) => {
  if (t < 64 || t > 150) return null;
  const capX = t < 112 ? 700 : 760;
  const lento = en(t, 89.5, 94) ? interpolate(t, [89.5, 94], [1200, 1550]) : 1500;
  const crewOn = t > 70 && t < 148;
  const forzado = (i: number) => (i < 4 && t > 128 ? interpolate(t, [128, 131], [0, 1200 + i * 80], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0);
  const ox = MX;
  return (
    <>
      {/* el grumete sube por la plancha */}
      {en(t, 64.5, 70) && <Persona x={interpolate(t, [64.8, 68.5], [-650, 1300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={interpolate(t, [64.8, 67.6, 68.5], [1880, 1500, 1500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} h={180} t={t} seed={7} ropa={{ ...GRUMETE, gorro: "no" }} camina={t < 68.5 ? 1.8 : 0} />}
      {en(t, 64.5, 70) && <G><line x1={-640} y1={1885} x2={1120} y2={1440} stroke="#8a5a2a" strokeWidth={26} /></G>}
      {crewOn && CREW.map((wx, i) => (
        <Persona key={i} x={wx - ox + forzado(i)} y={CUB} h={240} t={t} seed={90 + i} ropa={MARINO(i)} flip={i > 2}
          expr={en(t, 97, 113) ? "miedo" : en(t, 106.9, 112) ? "neutro" : t > 128 && i < 4 ? "triste" : "neutro"}
          bD={en(t, 97.3, 100) && i > 2 ? 150 : en(t, 104.7, 108) ? 150 : en(t, 108, 112) ? 35 : 10} bI={en(t, 104.7, 108) ? 150 : en(t, 108, 112) ? 35 : 10} cD={en(t, 108, 112) ? 80 : 10} cI={en(t, 108, 112) ? 80 : 10} camina={t > 128 && t < 131 && i < 4 ? 1.4 : 0} />
      ))}
      {/* capitán del mercante */}
      {t < 113 && <Persona x={capX} y={ALCA} h={260} t={t} seed={95} ropa={CAP_MERC} expr={en(t, 84.7, 94) ? "enojado" : "orgullo"} habla={en(t, 82.6, 94)} bD={en(t, 87.6, 89.4) ? 60 + Math.sin(t * 14) * 70 : 20} cD={30}
        manoD={en(t, 87.6, 89.4) ? <path d="M 0 0 Q 60 40 30 140" stroke="#c9a06a" strokeWidth={14} fill="none" /> : undefined} />}
      {/* el grumete lento con el balde */}
      {t > 70 && t < 134 && <Persona x={t < 89.5 ? 1200 : lento} y={CUB} h={180} t={t} seed={7} ropa={{ ...GRUMETE, gorro: "no" }} camina={en(t, 89.5, 94) ? 0.6 : 0}
        expr={en(t, 87.6, 89.6) ? "miedo" : en(t, 97, 120) ? "miedo" : "triste"} salta={88.3} manoD={en(t, 89.5, 94) ? <g transform="translate(0 40) scale(0.45)"><Balde /></g> : undefined} bD={en(t, 89.5, 94) ? 25 : 10} />}
      <Emote t={t} t0={88.3} t1={89.6} tipo="susto" x={1200} y={1335} s={0.33} />
      <Emote t={t} t0={91.2} t1={93.8} tipo="sudor" x={lento} y={1335} s={0.33} />
      {/* el chico escondido detrás de un barril y los que pasan de largo */}
      {t > 134 && t < 145 && <Persona x={1250} y={CUB} h={180} t={t} seed={7} ropa={{ ...GRUMETE, gorro: "no" }} expr={t < 138.8 ? "sorpresa" : "triste"} habla={en(t, 135.5, 138.8)} bD={en(t, 138.8, 141.6) ? 150 + Math.sin(t * 10) * 20 : 10} cD={20}
        manoI={en(t, 137.6, 138.8) ? <g transform="translate(0 10) scale(0.25)"><Galleta /></g> : undefined} />}
      {t > 133 && t < 145 && <Barril x={1170} y={CUB} s={0.7} />}
      {en(t, 138.8, 141.8) && [0, 1, 2].map((i) => <Persona key={i} x={interpolate(t, [138.8 + i * 0.3, 141.8], [2400 + i * 200, 600 + i * 200])} y={CUB} h={250} t={t} seed={80 + i} ropa={PIRATA(i)} flip camina={1.3} expr="neutro" mira={-1} />)}
      <G>
        {/* cárcel flotante: barrotes */}
        {en(t, 79.4, 82.6) && Array.from({ length: 16 }, (_, i) => { const y0 = interpolate(t, [79.6 + i * 0.03, 80.0 + i * 0.03], [-1300, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return <rect key={i} x={200 + i * 230} y={600 + y0} width={34} height={1500} rx={14} fill="#3a3a4a" stroke="#1d1d28" strokeWidth={6} />; })}
        {en(t, 79.4, 82.6) && <rect x={150} y={600 + interpolate(t, [79.6, 80.2], [-1300, 0], { extrapolateRight: "clamp" })} width={3750} height={40} rx={14} fill="#3a3a4a" />}
        <S t={79.8} p="metal" g={-4} />
        <S t={80.3} p="slam" g={-6} />
        <Lbl t={t} t0={80.4} t1={82.5} x={2000} y={560} txt="A FLOATING PRISON" size={150} color={C.crema} />
        {/* paga cortada, comida cortada, el chicotazo */}
        <P t={t} t0={84.9} t1={86.6} x={1000} y={1060} s={0.9}><Moneda8 r={44} t={t} /></P>
        <P t={t} t0={85.3} t1={86.6} x={1000} y={1060} s={0.6}><Tijera t={t} t0={85.3} /></P>
        <P t={t} t0={86.6} t1={87.6} x={1000} y={1060} s={0.5}><Galleta /></P>
        <P t={t} t0={86.7} t1={87.6} x={1000} y={1060} s={0.6}><Tijera t={t} t0={86.7} /></P>
        <S t={85.4} p="tear" g={-6} />
        <S t={86.8} p="tear" g={-6} pitch={1.2} />
        <S t={87.8} p="swish" g={-4} />
        <S t={88.3} p="punch" g={-6} />
        <P t={t} t0={91.0} t1={93.9} x={1150} y={1000} s={0.55}><Globo txt="FASTER!" cola={1} /></P>
        <S t={91.0} p="pop" g={-8} />
        {/* la tripulación: oficios */}
        {([[121.4, "CARPENTER", "sierra"], [122.6, "SURGEON", "frasco"], [124.0, "NAVIGATOR", "brujula"], [125.2, "MUSICIAN", "nota"]] as [number, string, string][]).map(([a, txt, k], i) => (
          <g key={i}>
            <P t={t} t0={a} t1={131} x={CREW[i] - ox} y={1130} s={0.6}>
              {k === "sierra" ? <Sierra /> : k === "frasco" ? <g transform="scale(1.4)"><Frasco c={C.rojo} /></g> : k === "brujula" ? <g><circle r={70} fill="#f7c548" stroke={TINTA} strokeWidth={8} /><path d="M 0 -56 L 14 0 L 0 56 L -14 0 Z" fill={C.rojo} /></g> : <text y={40} textAnchor="middle" fontSize={140} fontWeight={700} fill={TINTA}>♪</text>}
            </P>
            <Lbl t={t} t0={a + 0.1} t1={131} x={CREW[i] - ox} y={1060} txt={txt} size={40} color={C.crema} />
            <S t={a} p="pop" g={-8} pitch={1 + i * 0.08} />
          </g>
        ))}
        {[126.2, 126.4, 126.6, 126.8].map((a, i) => <P key={i} t={t} t0={a} t1={128} x={CREW[i] - ox + 70} y={1240} s={0.5}><Signo k="check" /></P>)}
        <S t={126.2} p="ding" g={-8} />
        <Lbl t={t} t0={128.1} t1={131} x={1800} y={1180} txt="FORCED" size={110} color={C.rojo} />
        <S t={128.1} p="rope" g={-6} />
        <S t={128.4} p="stomp" g={-8} />
        {/* firmar, amablemente, con una pistola cerca */}
        <P t={t} t0={129.9} t1={134.6} x={2200} y={1330} s={0.32}><Libro titulo={["THE", "ARTICLES"]} /></P>
        <P t={t} t0={131.0} t1={134.6} x={2520} y={1290} s={0.5} rot={-20}><Pistola /></P>
        <P t={t} t0={133.4} t1={134.7} x={2200} y={1090} s={0.55}><Globo txt="SIGN?" /></P>
        <S t={129.9} p="paper" g={-8} />
        <S t={131.0} p="metal" g={-10} pitch={1.6} />
        <S t={133.4} p="pop" g={-8} />
        {/* "and you?" */}
        <Lbl t={t} t0={135.6} t1={136.6} x={1250} y={1270} txt="SMALL" size={50} color={C.oro} />
        <Lbl t={t} t0={136.6} t1={137.6} x={1250} y={1270} txt="CAN'T FIGHT" size={50} color={C.rojo} />
        <Lbl t={t} t0={137.6} t1={138.8} x={1250} y={1270} txt="EATS" size={50} color={C.lima} />
        <S t={135.6} p="pop" g={-8} />
        <S t={136.6} p="fail" g={-10} />
        <S t={137.8} p="crunch" g={-6} />
        <Lbl t={t} t0={139.2} t1={141.6} x={1500} y={1180} txt="NO INTEREST" size={70} color={C.crema} />
        <S t={139.0} p="step" g={-10} d={2.5} />
      </G>
    </>
  );
};

// a bordo del PIRATA (coordenadas del pirata): el chico llega forzado, olvidado, rogando; tira la botella
export const A1: React.FC<{ t: number }> = ({ t }) => {
  if (t < 103 || t > 154) return null;
  return (
    <>
      {en(t, 103, 120) && [0, 1, 2, 3, 4].map((i) => <Persona key={i} x={1300 + i * 330} y={CUB} h={250} t={t} seed={100 + i} ropa={PIRATA(i + 2)} flip expr="enojado" bD={150} cD={30} />)}
      {en(t, 141.6, 154) && (
        <>
          <Persona x={t < 144 ? 1600 : 1700} y={CUB} h={250} t={t} seed={81} ropa={PIRATA(1)} flip expr="orgullo" bD={en(t, 141.6, 144) ? 150 : 10} />
          <Persona x={t < 147.4 ? 2250 : t < 148.5 ? 2150 : interpolate(t, [148.5, 149.3], [2150, 520], { extrapolateRight: "clamp" })} y={t < 148.5 ? CUB : ALCA} h={180} t={t} seed={7} ropa={GRUMETE}
            expr={t < 146.2 ? "miedo" : t < 147.4 ? "triste" : t < 149.3 ? "triste" : "neutro"} bD={en(t, 147.4, 148.5) ? 160 : en(t, 149.3, 149.6) ? 160 : 10} bI={en(t, 147.4, 148.5) ? 160 : 10} cD={en(t, 147.4, 148.5) ? 30 : 10}
            inclina={en(t, 147.4, 148.5) ? 10 : 0} />
          <Persona x={2500} y={CUB} h={265} t={t} seed={3} ropa={CAPITAN} flip expr={t > 147.4 ? "sorpresa" : "neutro"} />
        </>
      )}
    </>
  );
};

export const O1: React.FC<{ t: number }> = ({ t }) => {
  if (t < 52 || t > 156) return null;
  return (
    <>
      <CartelTrampa t={t} t0={52.3} n={1} nombre="THE CAPTURE" t1={54.4} />
      <S t={52.3} p="whoosh_big" g={-4} />
      <S t={52.5} p="wood_hit" g={-4} />
      <S t={52.7} p="creak" g={-8} />
      <Txt t={t} t0={54.4} t1={56.3} text="1716" y={330} size={180} color={C.oro} />
      <S t={54.4} p="slam" g={-8} />
      <Txt t={t} t0={62.7} t1={64.6} text="THOUSANDS OF BOYS" y={170} size={110} />
      <Txt t={t} t0={70.0} t1={74.8} text="NOBODY IS BORN A PIRATE" y={170} size={100} palabras={[70, 72.2, 72.9, 73.5, 73.9]} />
      <Txt t={t} t0={75.0} t1={79.2} text="MERCHANT SAILORS" y={170} size={110} color={C.teal} />
      <Txt t={t} t0={82.6} t1={84.6} text="TOTAL POWER" y={170} size={120} color={C.rojo} />
      <Chip t={t} t0={85.4} t1={89.5} text="− WAGES" color={C.rojo} x={1300} y={300} size={64} />
      <Chip t={t} t0={86.6} t1={89.5} text="− FOOD" color={C.rojo} x={1300} y={420} size={64} />
      <Chip t={t} t0={87.9} t1={89.5} text="+ ROPE'S END" color={C.violeta} x={1300} y={540} size={64} />
      <Chip t={t} t0={90.4} t1={93.8} text="ALWAYS «TOO SLOW»" color={C.rojo} x={1080} y={300} size={60} />
      <S t={82.6} p="slam" g={-8} />
      <Txt t={t} t0={94.1} t1={97.2} text="ONE MORNING..." y={170} size={110} />
      <Txt t={t} t0={97.3} t1={99.6} text="FASTER THAN YOU" y={170} size={110} />
      <Txt t={t} t0={100.0} t1={102.9} text="BLACK FLAG" y={170} size={130} color={C.crema} borde="#000" />
      {en(t, 100.0, 102.9) && <Persona x={320} y={1100} h={420} t={t} seed={7} ropa={GRUMETE} expr="sorpresa" bD={150 + Math.sin(t * 5) * 8} cD={10} aparece={100.0} />}
      {en(t, 100.3, 102.9) && <Persona x={620} y={1100} h={470} t={t} seed={240} ropa={PIRATA(1)} expr="miedo" bD={60} cD={-30} aparece={100.3} />}
      <Txt t={t} t0={103.1} t1={106.9} text="MOST DID NOT FIGHT" y={170} size={110} palabras={[103.1, 104.8, 105.4, 106.0]} />
      <Txt t={t} t0={107.0} t1={111.9} text="NOT DYING FOR SUGAR" y={170} size={110} palabras={[107, 110.2, 110.8, 111.2]} />
      <Txt t={t} t0={112.1} t1={113.5} text="FLAG DOWN" y={170} size={120} color={C.crema} />
      <Txt t={t} t0={119.8} t1={121.1} text="THEN THEY LOOK AT THE CREW" y={170} size={90} />
      {(["CARPENTER ✓", "SURGEON ✓", "NAVIGATOR ✓", "MUSICIAN ✓"]).map((x, i) => <Chip key={i} t={t} t0={122.2 + i * 1.2} t1={128.0} text={x} color={C.teal} x={90} y={300 + i * 115} size={58} />)}
      <Txt t={t} t0={134.9} t1={135.5} text="AND YOU?" y={170} size={150} color={C.oro} />
      <S t={134.9} p="zoom" g={-6} />
      {/* forzado, olvidado o rogando */}
      {en(t, 141.8, 148.5) && <div style={{ position: "absolute", left: 600, top: 330 }}>
        <svg width={1} height={1} style={{ overflow: "visible" }}>
          <Sello t={t} t0={141.9} txt="FORCED" size={70} rot={-10} />
          <g transform="translate(0 150)"><Sello t={t} t0={146.3} txt="FORGOTTEN" size={70} rot={6} c={C.violeta} /></g>
          <g transform="translate(0 300)"><Sello t={t} t0={147.4} txt="BEGGING" size={80} rot={-6} c={C.ambar} /></g>
        </svg>
      </div>}
      <S t={141.9} p="stamp" g={-4} />
      <S t={146.3} p="stamp" g={-4} />
      <S t={147.4} p="stamp" g={-3} />
      <Txt t={t} t0={148.6} t1={150.8} text="REMEMBER: BEGGING" y={170} size={110} color={C.ambar} />
      <Txt t={t} t0={150.9} t1={152.4} text="IT COMES BACK..." y={170} size={110} />
      <S t={151.0} p="suspense" g={-10} d={1.5} />
    </>
  );
};
export const _1 = { Cofre };
