import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { C, prog } from "./kit";
import { Rayos, Emote, fontFamily } from "./kit";
import { Persona, GRUMETE, CAPITAN, PIRATA, Ropa } from "./persona";
import { Txt, Contador, en } from "./dsl";
import { Zapato, Buzo, Signo, Sierra, Gato9, Cofre, Fruta, Tortuga, Galleta, Balde, Sable, Pistola, Microbio, TINTA } from "./obj";
import { Campana, Fuerte, Ciudad, Craneo } from "./kit2";
import { Canon } from "./barco";
import { ROBERTS } from "./S3";
import { CAP_MERC } from "./S1";
import { JOHN } from "./S8";

// PLANOS DE MOLDE (vuelta 5): pantalla llena, fondo iluminado + rayos, personajes GRANDES actuando y UN concepto.
// Reemplazan los generales con gente diminuta, la utilería sola y los cortes sobre cubierta vacía.
const BARBANEGRA: Ropa = { ...CAPITAN, tunica: "#1d1420", tunica2: "#0e0a14", barba: "#0e0a14", pelo: "#0e0a14", gorroCol: "#0e0a14" };
const BELLAMY: Ropa = { ...CAPITAN, tunica: "#2a2a3a", tunica2: "#16161f" };
const QM: Ropa = { ...PIRATA(5), tunica: "#3a3a4a", tunica2: "#1d1d28", barba: "#1d1410", parche: true, gorro: "bandana", gorroCol: "#1d1420" };

type Pl = { t0: number; t1: number; c: [string, string]; suelo?: string; luz?: [number, number]; r: (t: number) => React.ReactNode };

const Fondo: React.FC<{ t: number; c: [string, string]; suelo?: string; luz: [number, number]; id: string }> = ({ t, c, suelo, luz, id }) => (
  <>
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <defs><radialGradient id={id} cx={luz[0] / 1920} cy={luz[1] / 1080} r={0.85}><stop offset="0" stopColor={c[0]} /><stop offset="1" stopColor={c[1]} /></radialGradient></defs>
      <rect width={1920} height={1080} fill={`url(#${id})`} />
    </svg>
    <Rayos t={t} x={luz[0]} y={luz[1]} op={0.09} n={16} />
    {suelo && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><path d="M 0 930 Q 960 900 1920 930 L 1920 1080 L 0 1080 Z" fill={suelo} /><path d="M 0 930 Q 960 900 1920 930" stroke="rgba(255,255,255,.18)" strokeWidth={6} fill="none" /></svg>}
  </>
);
// mitad derecha que entra deslizando (pantalla partida bueno/malo)
const Mitad: React.FC<{ t: number; t0: number; c: [string, string]; children: React.ReactNode }> = ({ t, t0, c, children }) => {
  if (t < t0) return null;
  const k = interpolate(t, [t0, t0 + 0.3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 960 + k * 960, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
      <svg style={{ position: "absolute", inset: 0 }} width={960} height={1080}>
        <defs><radialGradient id={`m${t0}`} cx={0.5} cy={0.45} r={0.8}><stop offset="0" stopColor={c[0]} /><stop offset="1" stopColor={c[1]} /></radialGradient></defs>
        <rect width={960} height={1080} fill={`url(#m${t0})`} />
        <path d="M 0 930 L 960 930 L 960 1080 L 0 1080 Z" fill="rgba(20,8,30,.35)" />
        <rect x={0} width={10} height={1080} fill={TINTA} />
      </svg>
      <div style={{ position: "absolute", left: -960, top: 0, width: 1920, height: 1080 }}>{children}</div>
    </div>
  );
};
// svg de pantalla para utilería
const V: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>{children}</svg>;
const Reloj: React.FC<{ gira: number; t: number }> = ({ gira, t }) => (
  <g transform={`rotate(${gira * 180})`}>
    <rect x={-80} y={-140} width={160} height={22} rx={8} fill="#8a4520" /><rect x={-80} y={118} width={160} height={22} rx={8} fill="#8a4520" />
    <path d="M -60 -118 L 60 -118 L 8 0 L 60 118 L -60 118 L -8 0 Z" fill="#cfefff" opacity={0.75} stroke="#fff" strokeWidth={6} />
    <path d={`M ${-50 + (t % 1) * 0} 118 L 50 118 L 0 ${60 - ((t * 20) % 40)} Z`} fill="#f7c548" />
    <path d="M -40 -100 L 40 -100 L 4 -14 L -4 -14 Z" fill="#f7c548" opacity={0.9} />
  </g>
);
const Bandera: React.FC<{ t: number; sube: number }> = ({ t, sube }) => (
  <g>
    <rect x={-10} y={-700} width={20} height={1100} fill="#5a3418" />
    <g transform={`translate(10 ${-680 + (1 - sube) * 520})`}>
      <path d={`M 0 0 Q 160 ${-20 + Math.sin(t * 6) * 18} 360 0 L 360 240 Q 160 ${220 + Math.sin(t * 6 + 1) * 18} 0 240 Z`} fill="#141018" />
      <g transform="translate(180 110) scale(0.9)">
        <path d="M -60 -10 Q -64 -80 0 -80 Q 64 -80 60 -10 Q 60 20 38 28 L 38 56 L -38 56 L -38 28 Q -60 20 -60 -10 Z" fill="#f2ead8" />
        <ellipse cx={-24} cy={-12} rx={17} ry={20} fill="#141018" /><ellipse cx={24} cy={-12} rx={17} ry={20} fill="#141018" />
        <path d="M -110 80 L 110 130 M 110 80 L -110 130" stroke="#f2ead8" strokeWidth={22} strokeLinecap="round" />
      </g>
    </g>
  </g>
);
const cae = (t: number, t0: number) => interpolate(t, [t0, t0 + 0.5], [0, 82], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });

export const PLANOS: Pl[] = [
  // trampa 1: a los oficios los forzaban a venir, «politely, with a pistol nearby»
  { t0: 127.98, t1: 133.44, c: ["#fff0c0", "#d88a3a"], suelo: "#6b3a1f", luz: [700, 300], r: (t) => <>
    <Persona x={620} y={1030} h={700} t={t} seed={21} ropa={PIRATA(6)} expr={t > 129.6 ? "miedo" : "triste"} bD={15} cD={10} manoD={<g transform="rotate(80) scale(0.9)"><Sierra /></g>} ladea={Math.sin(t * 9) * 2} />
    <Persona x={1380} y={1030} h={780} t={t} seed={22} ropa={PIRATA(3)} expr={t > 129.6 ? "feliz" : "enojado"} flip bD={t > 129.6 ? 90 : 40} cD={t > 129.6 ? 0 : 50} habla manoD={<g transform="rotate(-90) scale(1.1)"><Pistola t={t} /></g>} />
    <Txt t={t} t0={128.0} t1={129.5} text="FORCED" y={170} size={140} color={C.rojo} />
    <Txt t={t} t0={129.7} t1={133.3} text="“POLITELY”" y={170} size={130} color={C.oro} />
  </> },
  // giro: abril de 1717, la tormenta; John agarrado del timón
  { t0: 843.56, t1: 848.88, c: ["#4a5a8a", "#0a0e1e"], suelo: "#2a1a1a", luz: [960, 200], r: (t) => <>
    <V>
      <g transform={`translate(780 600) rotate(${t * 40})`}>{Array.from({ length: 8 }, (_, i) => <rect key={i} x={-14} y={-330} width={28} height={330} rx={10} fill="#8a4520" transform={`rotate(${i * 45})`} />)}<circle r={220} fill="none" stroke="#8a4520" strokeWidth={40} /><circle r={50} fill="#5a2d14" /></g>
      {Array.from({ length: 90 }, (_, i) => { const x = (i * 211) % 1920, y = ((t * 1400 + i * 97) % 1200) - 60; return <line key={i} x1={x} y1={y} x2={x - 30} y2={y + 70} stroke="#bcd0ff" strokeWidth={3} opacity={0.5} />; })}
      <rect width={1920} height={1080} fill="#fff" opacity={[844.4, 846.6, 848.0].some((a) => t > a && t < a + 0.14) ? 0.55 : 0} />
    </V>
    <Persona x={760} y={1040} h={720} t={t} seed={330} ropa={JOHN} expr="miedo" bD={95} bI={95} cD={20} cI={20} ladea={Math.sin(t * 7) * 6} inclina={Math.sin(t * 1.6) * 6} />
    <Txt t={t} t0={843.7} t1={848.8} text="APRIL 1717" y={160} size={140} color={C.crema} />
  </> },
  // gancho: «you are the cabin boy» — el chico grande, el capitán lo señala
  { t0: 6.9, t1: 8.95, c: ["#ffe3a0", "#e07a3a"], suelo: "#8a4a20", luz: [700, 380], r: (t) => <>
    <Persona x={1450} y={1010} h={760} t={t} seed={11} ropa={CAPITAN} expr="orgullo" flip bD={95} cD={0} habla />
    <Persona x={620} y={1010} h={620} t={t} seed={7} ropa={GRUMETE} expr={t > 7.6 ? "miedo" : "sorpresa"} bD={20} bI={20} salta={t < 7.4 ? Math.abs(Math.sin(t * 8)) * 16 : 0} />
  </> },
  // premisa: el buzo encuentra el zapato
  { t0: 26.3, t1: 36.1, c: ["#2a8ab8", "#0a2a4a"], luz: [1200, 300], r: (t) => <>
    <V>
      <path d="M 0 960 Q 500 900 1000 950 T 1920 930 L 1920 1080 L 0 1080 Z" fill="#c9a86a" opacity={0.85} />
      <g transform={`translate(${interpolate(t, [26.3, 30], [-200, 420], { extrapolateRight: "clamp" })} 520) scale(1.3)`}><Buzo t={t} luz={prog(t, 28.5, 29.5)} /></g>
      <g transform={`translate(1350 ${900 - prog(t, 31.8, 32.4) * 40}) scale(${1.6 + prog(t, 31.8, 32.3) * 0.5})`}><Zapato brillo={prog(t, 32.1, 32.6)} t={t} /></g>
      {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={300 + i * 160} cy={1000 - ((t * 90 + i * 130) % 1000)} r={8 + (i % 3) * 5} fill="#bfefff" opacity={0.4} />)}
    </V>
    <Txt t={t} t0={32.2} t1={36.0} text="A CHILD'S SHOE" y={200} size={130} color={C.oro} />
  </> },
  // trampa 1: el capitán corta sueldo y comida y pega con la soga
  { t0: 84.7, t1: 89.5, c: ["#ffd9a0", "#b8452a"], suelo: "#6b3a1f", luz: [960, 300], r: (t) => <>
    <Persona x={1400} y={1010} h={820} t={t} seed={12} ropa={CAPITAN} expr="enojado" flip habla bD={en(t, 88.0, 89.5) ? 150 - prog(t, 88.2, 88.5) * 110 : 60} cD={40}
      manoD={<g transform="rotate(30) scale(1.2)"><path d="M 0 0 Q 40 120 10 260" stroke="#c9a06a" strokeWidth={16} fill="none" strokeLinecap="round" /></g>} />
    <Persona x={560} y={1010} h={560} t={t} seed={7} ropa={GRUMETE} expr={t > 88.4 ? "miedo" : "triste"} bD={t > 88.4 ? 160 : 20} bI={t > 88.4 ? 160 : 20} cD={t > 88.4 ? 120 : 0} cI={t > 88.4 ? 120 : 0} ladea={t > 88.4 ? Math.sin(t * 20) * 4 : 0} />
    {t > 88.4 && <Emote t={t} t0={88.4} tipo="susto" x={560} y={560} />}
    <V>
      {[["WAGES", 85.3], ["FOOD", 86.6], ["ROPE", 88.0]].map(([w, a], i) => t > (a as number) && (
        <g key={i} transform={`translate(160 ${170 + i * 120})`}><text x={110} y={26} fontFamily={fontFamily} fontSize={72} fontWeight={700} fill={i === 2 ? C.rojo : C.crema} stroke={TINTA} strokeWidth={14} paintOrder="stroke">{w}</text>{i < 2 ? <Signo k="cross" s={1.1} /> : <Signo k="cross" s={0} />}</g>
      ))}
    </V>
  </> },
  // trampa 1: la bandera negra sube
  { t0: 99.8, t1: 103.0, c: ["#bfe6ff", "#4a8ac8"], luz: [1300, 200], r: (t) => <>
    <V><g transform="translate(1200 950)"><Bandera t={t} sube={prog(t, 100.4, 102.0)} /></g></V>
    <Persona x={480} y={1060} h={700} t={t} seed={7} ropa={GRUMETE} expr={t > 101.6 ? "miedo" : "sorpresa"} mira={6} miraY={-6} bD={t > 101.6 ? 150 : 15} cD={t > 101.6 ? 130 : 0} />
    {t > 101.6 && <Emote t={t} t0={101.6} tipo="excl" x={480} y={520} />}
  </> },
  // trampa 2: el reloj de arena y la campana
  { t0: 183.8, t1: 188.16, c: ["#ffe9b0", "#c87a2a"], suelo: "#6b3a1f", luz: [960, 400], r: (t) => <>
    <Persona x={760} y={1010} h={640} t={t} seed={7} ropa={GRUMETE} expr={t > 186.4 ? "dormido" : "neutro"} bD={en(t, 184.4, 185.6) ? 100 : t > 186.4 && t < 187.3 ? 140 : 30} cD={60} habla={false} />
    <V>
      <g transform={`translate(${960 + 180} 560)`}><Reloj gira={prog(t, 184.6, 185.4)} t={t} /></g>
    </V>
    <Campana x={1560} y={460} s={1.5} t={t} t0b={186.6} />
    {t > 186.6 && t < 187.4 && <Txt t={t} t0={186.6} t1={187.3} text="DING!" x={1560} y={220} size={90} color={C.oro} />}
    <Txt t={t} t0={184.0} t1={186.4} text="½ HOUR" x={1140} y={200} size={100} color={C.crema} />
  </> },
  // trampa 2: «guess who got flogged?»
  { t0: 196.72, t1: 199.68, c: ["#ffc0a0", "#8a1d2a"], luz: [700, 400], r: (t) => <>
    <Persona x={700} y={1060} h={760} t={t} seed={7} ropa={GRUMETE} expr="miedo" mira={10} bD={140} bI={140} cD={130} cI={130} ladea={Math.sin(t * 18) * 3} />
    <Emote t={t} t0={197.0} tipo="sudor" x={700} y={440} />
    <V><g transform={`translate(${interpolate(t, [196.8, 197.6], [2200, 1500], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) })} 400) rotate(-30) scale(1.4)`}><Gato9 t={t} latigo={198.6} /></g></V>
    <Txt t={t} t0={197.4} t1={199.6} text="YOU." x={1380} y={860} size={150} color={C.rojo} />
  </> },
  // trampa 3: las peleas se arreglan en tierra, con sable y pistola
  { t0: 304.1, t1: 308.3, c: ["#fff0c0", "#e0a050"], suelo: "#d8b878", luz: [960, 300], r: (t) => <>
    <Persona x={560} y={1020} h={720} t={t} seed={31} ropa={PIRATA(1)} expr="enojado" bD={95} cD={10} manoD={<g transform="rotate(-80) scale(1.1)"><Sable /></g>} />
    <Persona x={1360} y={1020} h={720} t={t} seed={33} ropa={PIRATA(3)} expr="enojado" flip bD={90} cD={0} manoD={<g transform="rotate(-90) scale(1.1)"><Pistola t={t} /></g>} />
    <Txt t={t} t0={304.3} t1={308.2} text="ON SHORE" y={170} size={120} color={C.oro} />
  </> },
  // trampa 3: «the next port» — el intendente lo baja del barco
  { t0: 366.2, t1: 370.1, c: ["#ffe0b0", "#6a8ab8"], suelo: "#b89a6a", luz: [1500, 300], r: (t) => <>
    <Ciudad x={1560} y={760} s={0.8} t={t} nombre="PORT" />
    <Persona x={980} y={1040} h={800} t={t} seed={40} ropa={QM} expr="enojado" flip={false} bD={100} cD={0} habla />
    <Persona x={420} y={1040} h={560} t={t} seed={7} ropa={GRUMETE} expr="triste" bD={10} bI={10} />
    <Emote t={t} t0={367.0} tipo="lagrimas" x={420} y={600} />
  </> },
  // trampa 4: «40 lashes minus one» — la espalda y el conteo
  { t0: 394.6, t1: 398.3, c: ["#ffd0a0", "#7a1d2a"], luz: [960, 400], r: (t) => <>
    <Persona x={760} y={1060} h={780} t={t} seed={45} ropa={PIRATA(2)} expr="miedo" flip bD={170} bI={170} cD={20} cI={20} ladea={Math.sin(t * 22) * 2} />
    <V>{Array.from({ length: 6 }, (_, i) => t > 395.2 + i * 0.4 && <path key={i} d={`M ${640 + i * 6} ${560 + i * 40} L ${880 + i * 4} ${620 + i * 40}`} stroke={C.rojo} strokeWidth={10} strokeLinecap="round" />)}</V>
    <Contador t={t} t0={395.0} t1={397.6} de={1} a={39} x={1450} y={540} size={240} color={C.rojo} />
    <Txt t={t} t0={394.7} t1={398.2} text="40 − 1" x={1450} y={300} size={110} color={C.crema} />
  </> },
  // trampa 4: los chicos de la marina, boca abajo sobre un cañón
  { t0: 432.54, t1: 438.9, c: ["#ffe0c0", "#3a4a6a"], suelo: "#6b3a1f", luz: [960, 300], r: (t) => <>
    <V><Canon x={900} y={900} s={2.2} t={t} /></V>
    <Persona x={900} y={760} h={520} t={t} seed={7} ropa={GRUMETE} expr="miedo" inclina={-75} bD={150} bI={150} />
    <Persona x={1520} y={1040} h={760} t={t} seed={46} ropa={PIRATA(4)} expr="enojado" flip bD={en(t, 434.5, 438.9) ? 170 - Math.max(0, Math.sin((t - 434.5) * 4)) * 90 : 150} cD={20}
      manoD={<rect x={-8} y={0} width={16} height={260} rx={6} fill="#8a4520" />} />
    <Txt t={t} t0={436.2} t1={438.8} text="KISSING THE GUNNER'S DAUGHTER" y={170} size={78} color={C.oro} />
  </> },
  // trampa 5: semana buena / semana mala
  { t0: 530.14, t1: 538.76, c: ["#fff2b0", "#5ab85a"], suelo: "#8a4a20", luz: [480, 300], r: (t) => <>
    <Persona x={480} y={1020} h={700} t={t} seed={50} ropa={PIRATA(2)} expr="feliz" bD={110} cD={60} habla />
    <V>
      <g transform="translate(200 860) scale(1.3)"><Fruta k="pina" /></g><g transform="translate(760 880) scale(1.1)"><Fruta k="banana" /></g>
      <g transform="translate(820 720) scale(1.2)"><Tortuga t={t} /></g>
    </V>
    <Txt t={t} t0={530.3} t1={538.7} text="GOOD WEEK" x={480} y={170} size={110} color={C.lima} />
    <Mitad t={t} t0={535.44} c={["#b8c8a0", "#3a4a3a"]}>
      <Persona x={1440} y={1020} h={700} t={t} seed={50} ropa={PIRATA(2)} expr="triste" bD={60} cD={90} />
      <V>
        <g transform="translate(1180 880) scale(1.2)"><Galleta t={t} bichos={5} /></g>
        <g transform="translate(1720 860) scale(1.1)"><Balde t={t} agua="#5a8a3a" peste /></g>
      </V>
      <Txt t={t} t0={535.5} t1={538.7} text="BAD WEEK" x={1440} y={170} size={110} color={C.rojo} />
    </Mitad>
  </> },
  // trampa 6: tripulaciones enteras caen en semanas
  { t0: 610.46, t1: 614.98, c: ["#e0f0b0", "#4a6a3a"], suelo: "#6b3a1f", luz: [960, 300], r: (t) => <>
    {[0, 1, 2].map((i) => <Persona key={i} x={480 + i * 480} y={1020} h={640} t={t} seed={60 + i} ropa={PIRATA(i + 1)} expr={t > 611.6 + i * 1.1 ? "dormido" : "triste"} inclina={(i % 2 ? 1 : -1) * cae(t, 611.6 + i * 1.1)} bD={30} bI={30} />)}
    <V>{Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${300 + i * 220 + Math.sin(t * 2 + i) * 30} ${300 + Math.cos(t * 1.7 + i) * 60})`}><Microbio t={t + i} s={0.9} /></g>)}</V>
    <Contador t={t} t0={611.4} t1={614.4} de={3} a={0} x={960} y={170} size={130} color={C.rojo} post=" STANDING" />
  </> },
  // trampa 6: Barbanegra pide medicina, no oro
  { t0: 622.62, t1: 628.08, c: ["#ffe0a0", "#2a3a5a"], suelo: "#5a3418", luz: [1300, 300], r: (t) => <>
    <Persona x={560} y={1050} h={860} t={t} seed={270} ropa={BARBANEGRA} expr="enojado" habla bD={100} cD={0} />
    <V>
      <g transform="translate(1380 820) scale(1.5)"><Cofre t={t} abre={prog(t, 626.5, 627.2)} txt="✚" color="#c81d2e" brillo /></g>
      <text x={1180} y={260} fontFamily={fontFamily} fontSize={84} fontWeight={700} fill={C.oro} stroke={TINTA} strokeWidth={16} paintOrder="stroke">GOLD</text>
      {t > 624.0 && <g transform="translate(1100 236)"><Signo k="cross" s={1.1} /></g>}
      {t > 626.5 && <><text x={1180} y={400} fontFamily={fontFamily} fontSize={84} fontWeight={700} fill={C.lima} stroke={TINTA} strokeWidth={16} paintOrder="stroke">MEDICINE</text><g transform="translate(1100 376)"><Signo k="check" s={1.1} /></g></>}
    </V>
  </> },
  // trampa 7: la bandera era un mensaje: rendite y vivís / resistí y no hay piedad
  { t0: 680.44, t1: 686.88, c: ["#e0f4ff", "#5a9ac8"], suelo: "#8a4a20", luz: [480, 300], r: (t) => <>
    <Persona x={480} y={1020} h={720} t={t} seed={80} ropa={CAP_MERC} expr="miedo" bD={170} bI={170} cD={10} cI={10} />
    <V><g transform="translate(760 330)">{t > 681.5 && <Signo k="check" s={1.4} />}</g></V>
    <Txt t={t} t0={680.6} t1={686.8} text="SURRENDER" x={480} y={170} size={100} color={C.lima} />
    <Mitad t={t} t0={684.34} c={["#ffb0a0", "#5a1020"]}>
      <Persona x={1440} y={1020} h={720} t={t} seed={80} ropa={CAP_MERC} expr="enojado" flip bD={130} cD={20} manoD={<g transform="rotate(-60) scale(1.1)"><Sable /></g>} />
      <Craneo x={1700} y={420} s={1.2} t={t} t0={685.4} />
      <Txt t={t} t0={684.4} t1={686.8} text="RESIST" x={1440} y={170} size={100} color={C.rojo} />
    </Mitad>
  </> },
  // trampa 7: muere Roberts
  { t0: 771.66, t1: 776.2, c: ["#ffd0a0", "#3a2030"], suelo: "#5a3418", luz: [960, 320], r: (t) => <>
    <Persona x={960} y={1040} h={840} t={t} seed={265} ropa={ROBERTS} expr={t > 772.6 ? "sorpresa" : "orgullo"} bD={t > 772.6 ? 160 : 40} cD={t > 772.6 ? 150 : 10} inclina={-cae(t, 774.4) * 0.9} />
    <V>{t > 772.3 && Array.from({ length: 9 }, (_, i) => { const k = Math.min(1, (t - 772.3) * 4); return <circle key={i} cx={1920 - k * (900 - i * 12) + (i % 3) * 20} cy={420 + (i % 4) * 22} r={14} fill="#3a3a4a" />; })}</V>
    <Txt t={t} t0={772.4} t1={776.1} text="GRAPE SHOT" y={170} size={120} color={C.rojo} />
  </> },
  // trampa 7: Cape Coast Castle, 52 colgados (no Londres)
  { t0: 783.02, t1: 789.3, c: ["#fff0c0", "#c8803a"], suelo: "#c8a870", luz: [960, 200], r: (t) => <>
    <Fuerte x={960} y={470} s={1.1} t={t} piedra />
    {[0, 1, 2, 3, 4].map((i) => <Persona key={i} x={300 + i * 330} y={1040} h={520} t={t} seed={90 + i} ropa={PIRATA(i)} expr="triste" bD={15} bI={15} cD={60} cI={60} />)}
    <V><path d={`M 240 ${830} L 1680 830`} stroke="#5a5a6a" strokeWidth={10} strokeDasharray="22 10" /></V>
    <Txt t={t} t0={783.2} t1={787.6} text="CAPE COAST CASTLE" y={150} size={100} color={C.crema} />
    <Txt t={t} t0={787.7} t1={789.2} text="52 HANGED" y={150} size={150} color={C.rojo} />
  </> },
  // giro: Black Sam Bellamy, grande y reconocible
  { t0: 819.7, t1: 822.4, c: ["#ffe9b0", "#2a3a5a"], suelo: "#5a3418", luz: [1100, 300], r: (t) => <>
    <Persona x={1100} y={1050} h={760} t={t} seed={320} ropa={BELLAMY} expr="orgullo" flip bD={60} cD={60} habla />
    <Txt t={t} t0={819.8} t1={822.3} text="BLACK SAM BELLAMY" x={960} y={130} size={110} color={C.oro} />
  </> },
  // 140 a bordo, 2 vivos
  { t0: 854.32, t1: 858.3, c: ["#5a6a9a", "#0e1424"], luz: [960, 200], r: (t) => <>
    <V>{Array.from({ length: 70 }, (_, i) => { const r = (i * 37) % 100; const vivo = i === 20 || i === 49; const off = t > 855.4 + (r / 100) * 2.4 && !vivo; return <g key={i} transform={`translate(${260 + (i % 14) * 100} ${420 + Math.floor(i / 14) * 110})`} opacity={off ? 0.12 : 1}><circle r={26} cy={-40} fill={vivo ? C.oro : "#e8d8c0"} /><rect x={-24} y={-14} width={48} height={60} rx={14} fill={vivo ? C.oro : "#e8d8c0"} /></g>; })}</V>
    <Contador t={t} t0={855.0} t1={857.8} de={140} a={2} x={960} y={190} size={170} color={C.crema} post=" ALIVE" />
  </> },
  // «today, you are going to sail»: el chico listo para zarpar
  { t0: 39.4, t1: 41.5, c: ["#d8f0ff", "#4a8ac8"], suelo: "#8a4a20", luz: [960, 300], r: (t) => <>
    <Persona x={960} y={1040} h={760} t={t} seed={7} ropa={GRUMETE} expr="feliz" bD={160} cD={20} salta={Math.abs(Math.sin(t * 6)) * 18} habla />
    <Txt t={t} t0={39.5} t1={41.4} text="SET SAIL" y={170} size={130} color={C.oro} />
  </> },
];

const UNO: React.FC<{ t: number; p: Pl; k: number }> = ({ t, p, k }) => {
  const pop = interpolate(t, [p.t0, p.t0 + 0.22], [1.07, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ transform: `scale(${pop})`, overflow: "hidden" }}>
      <Fondo t={t} c={p.c} suelo={p.suelo} luz={p.luz ?? [960, 300]} id={`pl${k}`} />
      {p.r(t)}
    </AbsoluteFill>
  );
};

export const Planos: React.FC<{ t: number }> = ({ t }) => (
  <>{PLANOS.map((p, k) => (en(t, p.t0, p.t1) ? <UNO key={k} t={t} p={p} k={k} /> : null))}</>
);
