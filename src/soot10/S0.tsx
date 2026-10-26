import React from "react";
import { interpolate, Easing } from "remotion";
import { C, prog, Emote } from "./kit";
import { Persona, GRUMETE, CAPITAN, PIRATA } from "./persona";
import { Key, CUB, ALCA, FONDO, BarcoLejos, Burbujas, Canon, Barril, MAR } from "./barco";
import { G, S, P, arco, Moneda8, Galleta, Precio, Sello, Cota, Flecha, Defs, Confeti, Astillas, Zapato, Buzo, Pila, Libro, TINTA } from "./obj";
import { Txt, Lbl, Contador, Flash, en } from "./dsl";
import { Mapa } from "./mapa";

// GANCHO 0-52,3 s: la bala, la felicitación irónica, la paga, la comida, el voto del brazo, los artículos,
// la cámara que se hunde hasta el zapato del naufragio, el mapa con las 7 trampas y la soga.
export const K0: Key[] = [
  [0, 1700, 1385, -2.8],
  [1.9, 1660, 1395, -3.05, 0.3, "lineal"],
  [2.2, 1690, 1380, -3.4, 0.12, "seco"],
  [2.4, 1660, 1390, -2.7, 0.9],
  [3.85, 1640, 1390, -3.1, 0.6],
  [5.55, 1950, 840, -0.4, 1.7],
  [8.85, 1820, 1410, -2.55, 0.6, "seco"],
  [10.0, 1870, 1385, -2.8, 0.45, "seco"],
  [11.3, 1900, 1350, -1.45, 0.8],
  [14.0, 1800, 1390, -2.3, 0.9],
  [16.8, 650, 1360, -2.25, 0.7, "seco"],
  [22.6, 640, 1350, -2.8, 0.35, "seco"],
  [24.8, 900, 1380, -2.0, 0.6],
  [26.2, 760, 1950, 1.05, 1.5],
  [27.9, 1250, 3300, 0.85, 1.6],
  [29.6, 1700, 4430, 1.5, 1.9],
  [31.9, 1950, 4620, 3.3, 1.0],
  [36.25, 1950, 4630, 4.4, 0.3, "seco"],
  [36.8, 1900, 4560, 2.6, 2.0],
  [39.3, 1950, 1380, -1.9, 0.6, "seco"],
  [41.3, 275, 1330, -7, 0.4],
  [50.3, 1720, 1370, -2.3, 0],
];

const PIRATAS = [1360, 1520, 2010, 2160, 2330, 2480];

export const A0: React.FC<{ t: number }> = ({ t }) => {
  if (t > 53) return null;
  const bala = t > 1.75 && t < 2.2 ? interpolate(t, [1.75, 2.2], [0, 1]) : -1;
  const susto = t > 2.2 && t < 5.3;
  const voto = (i: number) => (t > 12.3 + i * 0.12 && t < 16.6 ? 168 : 12);
  const gx = interpolate(t, [10.1, 11.3], [1825, 1905], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const nino = en(t, 23.0, 26.3) ? interpolate(t, [23.0, 24.4], [1200, 1010], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <>
      {/* ── cubierta: pelea y grumete */}
      {t < 16.9 && PIRATAS.map((x, i) => (
        <Persona key={i} x={x} y={CUB} h={250} t={t} seed={20 + i} ropa={PIRATA(i)} flip={x > 1720}
          expr={t < 5.5 ? (i % 2 ? "enojado" : "miedo") : t > 12.3 ? "orgullo" : "neutro"} habla={en(t, 12.3, 16) && i === 2}
          bD={t < 5.5 ? 120 + Math.sin(t * 9 + i) * 30 : voto(i)} cD={t < 5.5 ? 40 : 0} bI={t < 5.5 ? 30 : 8} />
      ))}
      {t < 23 && (
        <Persona x={1720} y={CUB} h={180} t={t} seed={7} ropa={GRUMETE} salta={2.2}
          expr={t < 5.35 ? (susto ? "sorpresa" : "miedo") : t < 8.9 ? "sorpresa" : t < 11.3 ? "triste" : "miedo"}
          bD={en(t, 8.8, 10.1) ? 70 : susto ? 150 : 10} cD={en(t, 8.8, 10.1) ? 80 : susto ? 60 : 10} bI={susto ? 150 : 10} cI={susto ? 60 : 10}
          mira={t > 10 && t < 11.3 ? 1 : 0} manoD={en(t, 8.8, 10.1) ? <g transform="translate(0 -10)"><Moneda8 r={7} t={t} /></g> : undefined} />
      )}
      <Emote t={t} t0={2.25} t1={5.3} tipo="susto" x={1720} y={1335} s={0.33} />
      <G>
        <Defs />
        {/* bala de cañón que viene desde popa */}
        {bala >= 0 && (
          <g>
            <line x1={1100 + bala * 460 - 260} y1={1270 + bala * 155 - 80} x2={1100 + bala * 460} y2={1270 + bala * 155} stroke="#fff" strokeWidth={22} strokeLinecap="round" opacity={0.5} />
            <circle cx={1100 + bala * 460} cy={1270 + bala * 155} r={20} fill="#1d1d28" />
          </g>
        )}
        <S t={1.75} p="whoosh_big" g={-6} />
        <S t={2.2} p="explo" g={-2} />
        <S t={2.22} p="wood_hit" g={-3} />
        <Astillas t={t} t0={2.2} n={22} dir={1} vel={700} />
        {t > 2.2 && t < 4.5 && (() => { const d = t - 2.2; return <rect x={1540 + d * 380} y={1410 - d * 520 + d * d * 900} width={110} height={22} rx={6} fill="#5a2d14" transform={`rotate(${d * 500} ${1595 + d * 380} ${1420 - d * 520 + d * d * 900})`} />; })()}
        {t > 2.2 && <g><path d="M 1508 1420 l 20 -14 l 8 20 l 14 -10 l 0 26 Z M 1622 1420 l -16 -12 l -6 18 l -14 -8 l 0 24 Z" fill="#5a2d14" /></g>}
        <Cota t={t} t0={3.86} t1={5.5} x1={1705} y1={1335} x2={1565} y2={1410} txt="1 METER" size={30} c={C.oro} />
        <S t={3.9} p="tick" g={-8} />
        <Confeti t={t} t0={5.34} n={60} x={1720} y={1320} />
        <S t={5.34} p="popcluster" g={-6} />
        <S t={5.6} p="whoosh_big" g={-6} />
        {/* YOU */}
        <Lbl t={t} t0={6.3} t1={8.7} x={1720} y={1080} txt="YOU" size={200} color={C.oro} />
        <Flecha t={t} t0={6.4} t1={8.7} d="M 1720 1110 L 1720 1270" w={40} />
        <S t={6.3} p="pop" g={-6} />
        {/* la paga: una moneda diminuta bajo una lupa */}
        {en(t, 9.1, 10.1) && (
          <g transform={`translate(1778 1400) scale(${prog(t, 9.1, 9.35)})`}>
            <circle r={34} fill="rgba(200,240,255,.25)" stroke={TINTA} strokeWidth={6} />
            <line x1={24} y1={24} x2={60} y2={60} stroke="#6b3a1f" strokeWidth={12} strokeLinecap="round" />
          </g>
        )}
        <S t={9.1} p="ding" g={-10} pitch={1.6} />
        <S t={9.3} p="sad" g={-12} />
        {/* la comida camina */}
        {t > 9.8 && t < 11.6 && <Barril x={1870} y={CUB} s={0.75} />}
        {t > 9.8 && t < 11.6 && <g transform={`translate(${gx} ${1385}) scale(0.32)`}><Galleta t={t} bichos={6} camina={1} /></g>}
        <S t={10.1} p="step" g={-12} pitch={1.8} />
        <S t={10.5} p="step" g={-12} pitch={1.9} />
        <S t={10.9} p="squeak" g={-10} />
        {/* el voto del brazo */}
        <S t={12.3} p="cloth" g={-8} />
        <S t={12.5} p="laugh" g={-14} />
        <P t={t} t0={14.3} t1={16.7} x={1810} y={1330} s={0.55}><Precio txt="ARM 600" t={t} /></P>
        <S t={14.3} p="coin" g={-6} />
        {en(t, 14.6, 16.7) && <circle cx={1752} cy={1405} r={34} fill="none" stroke={C.rojo} strokeWidth={5} strokeDasharray="10 7" transform={`rotate(${t * 90} 1752 1405)`} />}
        <P t={t} t0={14.9} t1={16.7} x={1880} y={1490} s={0.3}><Pila n={6} t={t} t0={14.9} /></P>
        <S t={14.9} p="coin_rain" g={-10} />
      </G>
      {/* ── camarote: los artículos clavados en la pared */}
      {en(t, 16, 27) && (
        <>
          <Persona x={900} y={CUB} h={250} t={t} seed={2} ropa={CAPITAN} flip expr={t > 22.7 ? "enojado" : "orgullo"} habla={en(t, 17, 22)} bI={en(t, 19, 24) ? 100 : 10} cI={20} />
          {nino > 0 && <Persona x={nino} y={CUB} h={180} t={t} seed={7} ropa={GRUMETE} flip camina={t < 24.4 ? 1.8 : 0} expr={t > 24.8 ? "triste" : "miedo"} />}
          <G>
            <Pergamino t={t} />
            <Sello t={t} t0={22.7} txt="NO BOYS ALLOWED" size={30} />
            <S t={22.7} p="stamp" g={-2} />
            <Lbl t={t} t0={24.84} t1={26.4} x={1060} y={1330} txt="?" size={110} color={C.lila} />
            <S t={24.84} p="pop" g={-6} pitch={0.8} />
          </G>
        </>
      )}
      {/* hoy zarpás: el grumete iza la vela tirando del cabo, dos piratas lo ayudan */}
      {en(t, 39.2, 41.5) && (() => {
        const tira = Math.sin(t * 7);
        return <>
          <G><line x1={1950} y1={600} x2={1985} y2={CUB - 150 + tira * 18} stroke="#c9a06a" strokeWidth={9} /></G>
          <Persona x={1950} y={CUB} h={190} t={t} seed={7} ropa={GRUMETE} expr="feliz" bD={165 + tira * 10} bI={160 + tira * 10} cD={10} cI={10} inclina={-8 + tira * 4} />
          <Persona x={1700} y={CUB} h={250} t={t} seed={23} ropa={PIRATA(3)} expr="orgullo" bD={150 + tira * 12} cD={20} habla />
          <Persona x={2230} y={CUB} h={250} t={t} seed={24} ropa={PIRATA(4)} flip expr="feliz" bD={30 + Math.abs(tira) * 120} cD={10} />
          <S t={39.6} p="rope" g={-8} /><S t={40.3} p="rope" g={-8} pitch={1.1} /><S t={40.6} p="cheer" g={-14} />
        </>;
      })()}
      <S t={16.8} p="whoosh" g={-6} />
      <S t={16.9} p="unroll" g={-6} />
    </>
  );
};
// pergamino de los artículos que se desenrolla en la pared del camarote, con firmas
const Pergamino: React.FC<{ t: number }> = ({ t }) => {
  const u = prog(t, 16.9, 17.6);
  const h = 230 * u;
  const firmas = [17.9, 18.4, 18.8, 19.3, 19.6];
  return (
    <g transform="translate(470 1245)">
      <rect x={0} y={0} width={330} height={h} fill="#f4ead2" stroke="#a8946a" strokeWidth={4} />
      <rect x={-12} y={-10} width={354} height={20} rx={10} fill="#c9a06a" />
      <rect x={-12} y={h - 10} width={354} height={20} rx={10} fill="#c9a06a" />
      {u > 0.5 && <text x={165} y={36} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={30} fill={TINTA}>ARTICLES</text>}
      {Array.from({ length: 6 }, (_, i) => u > 0.3 + i * 0.1 && <line key={i} x1={26} y1={60 + i * 20} x2={300 - (i % 3) * 30} y2={60 + i * 20} stroke="#8a7a5a" strokeWidth={5} strokeLinecap="round" />)}
      {firmas.map((f, i) => t > f && <text key={i} x={30 + i * 62} y={210} fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={28} fill="#5a2a1a" transform={`rotate(${-8 + i * 4} ${30 + i * 62} 210)`}>{["X", "J.R.", "X", "W.M", "X"][i]}</text>)}
      {firmas.map((f, i) => <S key={i} t={f} p="write" g={-12} />)}
    </g>
  );
};

// mundo: barco de la marina que dispara, naufragio en el fondo, buzo y zapato
export const M0: React.FC<{ t: number }> = ({ t }) => {
  if (t > 53) return null;
  return (
    <>
      {t < 10 && <BarcoLejos x={-1500} y={MAR} t={t} s={2.4} tipo="marina" fuego={0.6} />}
      {en(t, 25.5, 41) && (
        <G>
          {/* restos del naufragio */}
          {[[1200, -10], [1400, 18], [1650, -24], [2250, 12], [2450, -6]].map(([x, r], i) => <rect key={i} x={x} y={FONDO - 70} width={260} height={34} rx={8} fill="#5a3a2a" transform={`rotate(${r} ${x} ${FONDO - 50})`} />)}
          {[1300, 1460, 1620, 1780, 2140, 2300].map((x, i) => <path key={i} d={`M ${x} ${FONDO - 20} Q ${x - 40} ${FONDO - 260} ${x + 30} ${FONDO - 380 + (i % 2) * 60}`} stroke="#4a2e22" strokeWidth={30} fill="none" strokeLinecap="round" />)}
          <g transform={`translate(1520 ${FONDO - 10}) rotate(-14)`}><Canon x={0} y={0} t={t} /></g>
          <g transform={`translate(2230 ${FONDO - 6}) rotate(10) scale(0.8)`}><Canon x={0} y={0} t={t} flip /></g>
          {[[1700, 5], [1760, 10], [1820, 3], [2050, 8], [2100, 2]].map(([x, d], i) => <g key={i} transform={`translate(${x} ${FONDO - d}) scale(0.35)`}><Moneda8 r={40} oro t={t} /></g>)}
          <g transform={`translate(1950 ${FONDO - 40}) scale(0.42)`}><Zapato brillo={t > 31.5 ? 1 : 0} t={t} /></g>
          {en(t, 28.5, 39.5) && <g transform={`translate(${interpolate(t, [28.5, 33], [1150, 1780], { extrapolateRight: "clamp" })} ${interpolate(t, [28.5, 32.5], [FONDO - 150, FONDO - 70], { extrapolateRight: "clamp" }) + Math.sin(t) * 8}) scale(0.42)`}><Buzo t={t} luz={prog(t, 29.5, 30.5)} /></g>}
          <S t={26.3} p="splash" g={-4} />
          <S t={26.6} p="bubble" g={-6} />
          <S t={28.6} p="bubble" g={-10} />
          <S t={30.2} p="drone" g={-12} d={6} />
          <S t={32.15} p="boom" g={-4} />
          <S t={32.2} p="sparkle" g={-8} />
          <S t={36.3} p="slam" g={-4} />
        </G>
      )}
      {en(t, 26, 31.5) && <G><Peces t={t} /></G>}
      {en(t, 39.3, 41.4) && <Burbujas t={t} x={1800} y={3000} w={900} n={40} />}
      <S t={39.4} p="bubble" g={-6} />
      <S t={40.4} p="splash" g={-6} />
    </>
  );
};

// cardumen y medusas durante el descenso
const Peces: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {Array.from({ length: 18 }, (_, i) => {
      const x = 900 + ((i * 173) % 1300) + Math.sin(t * 0.8 + i) * 80 - (t - 26) * 60 * (i % 2 ? 1 : -1);
      const y = 2600 + ((i * 97) % 1700);
      const c = [C.ambar, C.teal, C.rosa, C.lima][i % 4];
      return <g key={i} transform={`translate(${x} ${y}) scale(${i % 2 ? -1 : 1} 1) scale(${0.8 + (i % 3) * 0.4})`}><ellipse rx={46} ry={22} fill={c} /><path d={`M 40 0 L 80 ${-22 + Math.sin(t * 9 + i) * 6} L 80 ${22 + Math.sin(t * 9 + i) * 6} Z`} fill={c} /><circle cx={-24} cy={-6} r={6} fill="#1b1240" /></g>;
    })}
    {[[1100, 3100], [2100, 3600], [1600, 2900]].map(([x, y], i) => <g key={`m${i}`} transform={`translate(${x} ${y - Math.sin(t * 1.5 + i) * 40})`} opacity={0.75}><path d="M -60 0 Q -60 -70 0 -70 Q 60 -70 60 0 Z" fill="#ff9adf" />{[-40, -15, 15, 40].map((k) => <path key={k} d={`M ${k} 0 q ${Math.sin(t * 3 + k) * 14} 50 0 110`} stroke="#ff9adf" strokeWidth={8} fill="none" />)}</g>)}
  </g>
);
// pantalla: textos del gancho, oscuridad del fondo, el mapa de las 7 trampas y la soga
export const O0: React.FC<{ t: number }> = ({ t }) => {
  if (t > 53) return null;
  const hondo = interpolate(t, [26.5, 29.5, 38.5, 40.5], [0, 0.5, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      {hondo > 0 && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 55% 55%, rgba(10,30,80,0) 35%, rgba(4,10,40,1) 95%)", opacity: hondo }} />}
      <Txt t={t} t0={0.45} t1={5.2} text="AGE: 12" x={330} y={170} size={96} fondo={C.rojo} rot={-4} />
      <S t={0.45} p="pop" g={-6} />
      <Txt t={t} t0={5.34} t1={6.9} text="CONGRATULATIONS!" y={200} size={130} color={C.oro} />
      <Txt t={t} t0={6.2} t1={8.7} text="CABIN BOY" y={170} size={140} />
      <Txt t={t} t0={8.92} t1={10.0} text="THE PAY..." y={170} size={120} />
      <Txt t={t} t0={10.06} t1={11.25} text="THE FOOD..." y={170} size={120} color={C.lima} />
      <Txt t={t} t0={11.6} t1={16.7} text="VOTED. IN WRITING." y={150} size={110} palabras={[11.6, 12.6, 13.0]} />
      <Txt t={t} t0={17.2} t1={22.6} text="THE PIRATE ARTICLES" y={150} size={110} color={C.oro} />
      <Txt t={t} t0={24.84} t1={26.2} text="SO WHY ARE YOU HERE?" y={160} size={110} />
      <Contador t={t} t0={27.3} t1={30.8} de={0} a={300} post=" YEARS LATER" y={170} size={110} tFin={31.9} />
      <S t={27.3} p="riser" g={-10} d={3.5} />
      <Txt t={t} t0={32.15} t1={36.1} text="A CHILD'S SHOE" y={170} size={130} color={C.oro} />
      <Txt t={t} t0={36.3} t1={39.0} text="WHOSE?" y={540} size={260} color={C.rojo} />
      <Txt t={t} t0={39.4} t1={41.3} text="TODAY, YOU SAIL." y={170} size={120} />
      <S t={41.3} p="zoom" g={-8} />
      <Mapa t={t} t0={41.9} t1={50.4} titulo="ONE VOYAGE · 1716"
        cam={[[41.9, -55, 26, 1.9], [45.3, -42, 22, 2.15], [49.3, -38, 18, 2.3]]}
        ruta={[{ lugares: ["jamaica", "isla", "antigua", "p4", "p5", "africa", "capecoast"], t0: 45.4, t1: 49.0 }]}
        pins={[["jamaica", 45.6], ["isla", 46.1], ["antigua", 46.6], ["p4", 47.1], ["p5", 47.6], ["africa", 48.1], ["capecoast", 48.6]].map(([l, t0], i) => ({ lugar: l as string, t0: t0 as number, n: i + 1, icono: "calavera" as const }))} />
      <S t={41.9} p="unroll" g={-4} />
      {[45.6, 46.1, 46.6, 47.1, 47.6, 48.1, 48.6].map((x, i) => <S key={i} t={x} p="stamp" g={-10} pitch={1 + i * 0.05} />)}
      <S t={45.4} p="write" g={-10} d={3.6} />
      <Txt t={t} t0={49.34} t1={50.4} text="7 TRAPS" y={985} size={160} color={C.rojo} />
      <S t={49.34} p="boom" g={-5} />
      <S t={50.4} p="unroll" g={-8} pitch={1.3} />
      <Columpio t={t} />
    </>
  );
};
// "grab a rope": cae una soga y el grumete cruza la pantalla colgado
const Columpio: React.FC<{ t: number }> = ({ t }) => {
  if (t < 50.6 || t > 52.9) return null;
  const caida = interpolate(t, [50.6, 50.95], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) });
  const a = interpolate(t, [51.4, 52.6], [-58, 62], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) }) + (t < 51.4 ? Math.sin(t * 5) * 4 : 0);
  const L = 820 * caida;
  const rad = (a * Math.PI) / 180;
  const hx = 960 + Math.sin(rad) * L, hy = -120 + Math.cos(rad) * L;
  return (
    <>
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
        <line x1={960} y1={-120} x2={hx} y2={hy} stroke="#c9a06a" strokeWidth={22} />
        <line x1={960} y1={-120} x2={hx} y2={hy} stroke="#8a6a3a" strokeWidth={6} strokeDasharray="14 18" />
      </svg>
      {t > 51.3 && <Persona x={hx} y={hy + 380} h={420} t={t} seed={7} ropa={GRUMETE} expr="feliz" bD={176} bI={176} cD={0} cI={0} inclina={a * 0.3} />}
      <S t={50.6} p="rope" g={-4} />
      <S t={51.45} p="whoosh_big" g={-4} />
      <S t={51.5} p="gasp" g={-10} pitch={1.3} />
    </>
  );
};
// aviso: no usar
export const _ = { ALCA, Libro, arco };
