import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { C, prog } from "./kit";
import { Rayos, Emote, fontFamily } from "./kit";
import { Persona, GRUMETE, CAPITAN, PIRATA, CIVIL, Ropa } from "./persona";
import { Txt, Contador, Lista, en } from "./dsl";
import { Cuenco, Carne, Botella, Libro, Mosquito, Astillas, Sello, Concrecion } from "./obj";
import { Zapato, Buzo, Signo, Sierra, Moneda8, Diente, Nube, Gato9, Cofre, Fruta, Tortuga, Galleta, Balde, Sable, Pistola, Microbio, TINTA } from "./obj";
import { Campana, Fuerte, Ciudad, Craneo, Bolsa, Lluvia, Trampas } from "./kit2";
import { Zzz, Pergamino } from "./kit";
import { Barril, Saco, RelojArena, BarcoLejos } from "./barco";
import { Canon } from "./barco";
import { ROBERTS } from "./S3";
import { CAP_MERC } from "./S1";
import { JOHN } from "./S8";

// PLANOS DE MOLDE (vuelta 5): pantalla llena, fondo iluminado + rayos, personajes GRANDES actuando y UN concepto.
// Reemplazan los generales con gente diminuta, la utilería sola y los cortes sobre cubierta vacía.
const BARBANEGRA: Ropa = { ...CAPITAN, tunica: "#1d1420", tunica2: "#0e0a14", barba: "#0e0a14", pelo: "#0e0a14", gorroCol: "#0e0a14" };
const BELLAMY: Ropa = { ...CAPITAN, tunica: "#2a2a3a", tunica2: "#16161f" };
const MADRE: Ropa = { ...CIVIL(0), tunica: "#c94f8a", tunica2: "#8a2f5e" };
const QM: Ropa = { ...PIRATA(5), tunica: "#3a3a4a", tunica2: "#1d1d28", barba: "#1d1410", parche: true, gorro: "bandana", gorroCol: "#1d1420" };

// SETS ILUMINADOS (vuelta 7): cada panel arma su lugar (cubierta, bodega, camarote, puerto, playa, mástil, Londres, mar)
// con una fuente de luz que se ve (sol, linterna, ventana, fuego) para que no sea un degradé vacío.
type SetK = "cubierta" | "bodega" | "camarote" | "cocina" | "puerto" | "playa" | "mastil" | "londres" | "mar" | "noche";
const tablas = (y0: number, y1: number, c: [string, string], n = 12) => Array.from({ length: n }, (_, i) => <rect key={i} x={(i * 1920) / n} y={y0} width={1920 / n - 5} height={y1 - y0} fill={c[i % 2]} />);
const Glow: React.FC<{ x: number; y: number; r: number; c: string; op: number; id: string }> = ({ x, y, r, c, op, id }) => (
  <><defs><radialGradient id={id}><stop offset="0" stopColor={c} stopOpacity={op} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient></defs><circle cx={x} cy={y} r={r} fill={`url(#${id})`} /></>
);
const Olas: React.FC<{ t: number; y: number; c: string; a?: number; v?: number }> = ({ t, y, c, a = 14, v = 1 }) => (
  <path d={`M 0 ${y} ${Array.from({ length: 13 }, (_, i) => `Q ${i * 160 + 80} ${y + (i % 2 ? a : -a) * Math.sin(t * v + i)} ${(i + 1) * 160} ${y}`).join(" ")} L 1920 1080 L 0 1080 Z`} fill={c} />
);
const Cubierta: React.FC<{ t: number; mastil?: number }> = ({ t, mastil = 1560 }) => (
  <>
    <Olas t={t} y={640} c="#3f86c4" a={8} />
    <path d={`M ${mastil - 620} 40 Q ${mastil - 300} ${120 + Math.sin(t * 1.5) * 14} ${mastil - 40} 60 L ${mastil - 40} 470 Q ${mastil - 320} ${560 + Math.sin(t * 1.5) * 14} ${mastil - 620} 470 Z`} fill="#f6ecd4" opacity={0.92} />
    <rect x={mastil - 30} y={0} width={56} height={760} fill="#7a4520" /><rect x={mastil - 700} y={34} width={760} height={22} rx={10} fill="#6b3a1f" />
    <path d={`M ${mastil} 60 L 140 700 M ${mastil} 60 L 420 700 M ${mastil} 120 L 1900 700`} stroke="#4a2a14" strokeWidth={5} opacity={0.6} />
    <rect x={0} y={690} width={1920} height={30} fill="#6b3a1f" />{Array.from({ length: 25 }, (_, i) => <rect key={i} x={i * 80 + 20} y={720} width={18} height={60} fill="#7a4520" />)}<rect x={0} y={770} width={1920} height={22} fill="#5a3418" />
    {tablas(792, 1080, ["#a8682f", "#9a5e2a"], 9)}
    {Array.from({ length: 5 }, (_, i) => <rect key={i} x={0} y={840 + i * 50} width={1920} height={3} fill="#6b3a1f" opacity={0.5} />)}
  </>
);
const Bodega: React.FC<{ t: number; fuego?: boolean }> = ({ t, fuego }) => (
  <>
    {tablas(0, 1080, ["#4a2a14", "#55311a"], 16)}
    {[260, 960, 1660].map((x, i) => <path key={i} d={`M ${x - 200} 1080 Q ${x - 260} 400 ${x} 90 Q ${x + 260} 400 ${x + 200} 1080`} stroke="#2a160a" strokeWidth={34} fill="none" opacity={0.7} />)}
    <rect x={0} y={0} width={1920} height={90} fill="#2a160a" /><rect x={0} y={940} width={1920} height={140} fill="#3a2010" />
    <Glow x={fuego ? 300 : 960} y={fuego ? 820 : 140} r={fuego ? 760 : 820} c={fuego ? "#ff9a3a" : "#ffd27a"} op={0.5 + Math.sin(t * 9) * 0.04} id={`gb${fuego ? 1 : 0}`} />
    {!fuego && <g transform="translate(960 90)"><rect x={-4} y={0} width={8} height={40} fill="#2a160a" /><rect x={-34} y={40} width={68} height={90} rx={12} fill="#2a160a" /><rect x={-24} y={52} width={48} height={66} rx={8} fill="#ffd27a" /></g>}
  </>
);
const Camarote: React.FC<{ t: number }> = ({ t }) => (
  <>
    {tablas(0, 1080, ["#8a5a2e", "#7e522a"], 14)}
    <rect x={560} y={90} width={800} height={430} rx={30} fill="#2a160a" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={590 + (i % 4) * 188} y={120 + Math.floor(i / 4) * 190} width={176} height={176} fill={i < 4 ? "#bfe6ff" : "#5aa0d8"} />)}
    <polygon points="600,520 1320,520 1700,1080 220,1080" fill="#fff4c8" opacity={0.16 + Math.sin(t * 0.8) * 0.02} />
    <rect x={0} y={940} width={1920} height={140} fill="#5a3418" />
  </>
);
const Puerto: React.FC<{ t: number }> = ({ t }) => (
  <>
    {[[-80, 0.9], [180, 1.1], [520, 0.8], [1380, 1], [1700, 0.9]].map(([x, s], i) => <g key={i} transform={`translate(${x} 700) scale(${s})`}><rect x={0} y={-260} width={220} height={260} fill={["#e8b98a", "#d9a070", "#f0c89a"][i % 3]} /><path d="M -20 -260 L 110 -380 L 240 -260 Z" fill="#b5452c" /><rect x={80} y={-160} width={60} height={70} fill="#ffe08a" /></g>)}
    {[760, 1100].map((x, i) => <g key={i}><rect x={x} y={180} width={18} height={540} fill="#5a3418" /><rect x={x - 120} y={260} width={260} height={10} fill="#5a3418" /></g>)}
    <Olas t={t} y={700} c="#3f86c4" a={6} />
    {tablas(820, 1080, ["#9a6a3a", "#8a5e32"], 10)}
  </>
);
const Playa: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Olas t={t} y={600} c="#2f8ac8" a={10} /><Olas t={t + 1} y={690} c="#5ab0e0" a={8} v={1.4} />
    <path d="M 0 760 Q 960 700 1920 760 L 1920 1080 L 0 1080 Z" fill="#ecd08e" />
    <path d={`M 1640 1000 Q 1600 700 1700 380`} stroke="#8a5a2e" strokeWidth={40} fill="none" />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M 1700 380 Q ${1700 + Math.cos(i * 1.3) * 200} ${300 + Math.sin(i * 1.3) * 80 + Math.sin(t * 2 + i) * 8} ${1700 + Math.cos(i * 1.3) * 330} ${430 + i * 10}`} stroke="#2f8a3a" strokeWidth={36} fill="none" strokeLinecap="round" />)}
  </>
);
const Mastil: React.FC<{ t: number }> = ({ t }) => (
  <g transform={`rotate(${Math.sin(t * 0.9) * 4} 960 1400)`}>
    <rect x={1080} y={-100} width={70} height={1300} fill="#7a4520" /><rect x={500} y={180} width={1200} height={26} rx={12} fill="#6b3a1f" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${300 + i * 20} 1080 L 1080 ${120 + i * 4}`} stroke="#4a2a14" strokeWidth={6} />)}
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${300 + (1080 - 300) * (i / 12)} ${1080 - 960 * (i / 12)} L ${480 + (1080 - 480) * (i / 12)} ${1080 - 960 * (i / 12)}`} stroke="#4a2a14" strokeWidth={5} />)}
    <path d={`M 520 206 Q 900 ${330 + Math.sin(t * 2) * 20} 1680 206 L 1640 560 Q 900 ${640 + Math.sin(t * 2) * 20} 560 560 Z`} fill="#f6ecd4" opacity={0.9} />
  </g>
);
const Londres: React.FC<{ t: number }> = ({ t }) => (
  <>
    {[[0, 380], [220, 300], [430, 420], [700, 260], [1000, 360], [1260, 300], [1500, 400], [1720, 330]].map(([x, h], i) => <rect key={i} x={x} y={760 - h} width={230} height={h} fill={i % 2 ? "#4a4a5e" : "#55556a"} />)}
    <path d="M 760 500 Q 860 360 960 500 Z" fill="#4a4a5e" /><rect x={940} y={330} width={40} height={60} fill="#4a4a5e" />
    <Olas t={t} y={760} c="#4a6a80" a={6} /><rect x={0} y={900} width={1920} height={180} fill="#6b5a48" />
  </>
);
const SetV: React.FC<{ k: SetK; t: number }> = ({ k, t }) => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    {k === "cubierta" && <Cubierta t={t} />}
    {k === "bodega" && <Bodega t={t} />}
    {k === "cocina" && <Bodega t={t} fuego />}
    {k === "camarote" && <Camarote t={t} />}
    {k === "puerto" && <Puerto t={t} />}
    {k === "playa" && <Playa t={t} />}
    {k === "mastil" && <Mastil t={t} />}
    {k === "londres" && <Londres t={t} />}
    {k === "mar" && <><Olas t={t} y={620} c="#2a6aa8" a={30} v={1.6} /><Olas t={t + 2} y={780} c="#1d4f80" a={36} v={2} /></>}
    {k === "noche" && <>{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 397) % 1920} cy={(i * 211) % 600} r={2 + (i % 3)} fill="#fff" opacity={0.5 + 0.5 * Math.sin(t * 2 + i)} />)}<Olas t={t} y={760} c="#16304a" a={14} /></>}
    {(k === "cubierta" || k === "puerto" || k === "playa") && <Glow x={960} y={1020} r={700} c="#fff8e0" op={0.22} id={`gs${k}`} />}
  </svg>
);
const B = (p: any) => <Persona seed={7} ropa={GRUMETE} {...p} />;
const osc = (t: number, f: number, a: number, b = 0) => b + Math.sin(t * f) * a;
const JOHNP = (p: any) => <Persona seed={9} ropa={JOHN} {...p} />;

type Pl = { t0: number; t1: number; c: [string, string]; suelo?: string; luz?: [number, number]; set?: SetK; r: (t: number) => React.ReactNode };

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
  // ── v7 · premisa: el zapato en las manos del chico y la pregunta
  { t0: 32.14, t1: 36.3, c: ["#2a8ab8", "#0a2a4a"], luz: [960, 260], set: "playa", r: (t) => <>
    <V>{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={160 + i * 150} cy={1000 - ((t * 90 + i * 130) % 1000)} r={8 + (i % 3) * 5} fill="#bfefff" opacity={0.4} />)}</V>
    <B x={760} y={1050} h={780} t={t} expr="sorpresa" bD={45} cD={70} bI={45} cI={70} mira={6} miraY={8} manoD={<g transform="scale(0.8)"><Zapato brillo={1} t={t} /></g>} />
    <Txt t={t} t0={32.3} t1={36.2} text="A CHILD'S SHOE" x={1400} y={300} size={100} color={C.oro} />
  </> },
  { t0: 36.3, t1: 39.4, c: ["#fff0c8", "#7a4a6a"], set: "camarote", r: (t) => <>
    <B x={1260} y={1050} h={760} t={t} expr="orgullo" bD={120} cD={40} habla ladea={osc(t, 3, 3)} />
    <V><g transform={`translate(520 ${760 + osc(t, 3, 12)}) scale(2.2) rotate(-12)`}><Zapato t={t} brillo={0.6} /></g></V>
    <Txt t={t} t0={36.5} t1={39.3} text="WHOSE SHOE?" x={620} y={300} size={110} color={C.oro} />
  </> },
  // ── v7 · premisa: un viaje, 7 trampas, agarrá la soga
  { t0: 41.5, t1: 52.26, c: ["#d8f0ff", "#4a8ac8"], set: "cubierta", r: (t) => <>
    <Persona x={1450} y={1050} h={790} t={t} seed={50} ropa={CAPITAN} expr="orgullo" bD={t > 45.4 ? 120 : 30} cD={t > 45.4 ? 20 : 90} habla={en(t, 45.4, 50.5)} flip />
    <B x={600} y={1050} h={700} t={t} expr={t > 49.3 ? "miedo" : t > 45.4 ? "sorpresa" : "feliz"} bD={t > 50.5 ? 165 : 30} cD={t > 50.5 ? 10 : 40} salta={t > 51.4 ? Math.abs(Math.sin(t * 8)) * 26 : 0} mira={4} />
    {t > 50.5 && <V><path d={`M ${600 + 120} 0 L ${600 + 120} ${420 + osc(t, 4, 8)}`} stroke="#c8a060" strokeWidth={16} /></V>}
    <Txt t={t} t0={41.6} t1={45.3} text="ONE VOYAGE" y={150} size={110} color={C.crema} />
    <Contador t={t} t0={45.5} t1={49.3} de={0} a={7} x={960} y={150} size={120} color={C.rojo} post=" WAYS TO DIE" tFin={50.5} />
    <Txt t={t} t0={50.6} t1={52.2} text="GRAB A ROPE!" y={150} size={110} color={C.oro} />
  </> },
  // ── v7 · trampa 1a: la captura, 1716, el pueblo del puerto
  { t0: 52.26, t1: 56.44, c: ["#ffe2b0", "#c87a4a"], set: "puerto", r: (t) => <>
    <B x={960} y={1050} h={780} t={t} expr="neutro" mira={osc(t, 1.5, 6)} bD={20} bI={20} ladea={osc(t, 2, 2)} />
    <Txt t={t} t0={52.4} t1={54.1} text="TRAP 1: THE CAPTURE" y={150} size={100} color={C.oro} />
    <Txt t={t} t0={54.2} t1={56.4} text="1716" y={150} size={140} color={C.crema} />
  </> },
  { t0: 56.44, t1: 64.7, c: ["#ffe8c0", "#6a4a3a"], set: "camarote", r: (t) => <>
    <Persona x={620} y={1050} h={790} t={t} seed={60} ropa={MADRE} expr="triste" bD={60} cD={100} bI={60} cI={100} mira={6} miraY={4} manoD={<g transform="scale(0.45)"><Cuenco t={t} /></g>} />
    <B x={1300} y={1050} h={t > 61.2 ? 640 + Math.min(1, (t - 61.2) * 2) * 100 : 600} t={t} expr="triste" bD={30} cD={60} mira={-6} miraY={2} flip />
    <Txt t={t} t0={56.6} t1={59.5} text="NO FATHER" y={150} size={110} color={C.crema} />
    <Txt t={t} t0={59.6} t1={61.1} text="NO FOOD" y={150} size={120} color={C.rojo} />
    <Txt t={t} t0={61.2} t1={64.6} text="AGE 11-12: GO TO SEA" y={150} size={96} color={C.oro} />
  </> },
  { t0: 64.7, t1: 69.94, c: ["#fff4c8", "#d8904a"], set: "puerto", r: (t) => <>
    <Persona x={1450} y={1050} h={790} t={t} seed={61} ropa={CAP_MERC} expr="orgullo" bD={110} cD={10} flip habla={t > 66.5} />
    <B x={interpolate(t, [64.7, 66.6], [300, 700], { extrapolateRight: "clamp" })} y={1050} h={680} t={t} expr="neutro" camina={t < 66.6 ? 1.6 : 0} bI={120} cI={130} manoI={<g transform="scale(0.7)"><Saco x={0} y={0} /></g>} />
    <Bolsa x={1000} y={830} s={1.1} t={t} t0={67.2} txt="SUGAR" />
    <Txt t={t} t0={64.9} t1={67.0} text="SHIP'S BOY" y={150} size={110} color={C.oro} />
    <Txt t={t} t0={67.1} t1={69.9} text="JAMAICA · SUGAR" y={150} size={110} color={C.crema} />
  </> },
  { t0: 69.94, t1: 74.92, c: ["#d8f0ff", "#4a8ac8"], set: "cubierta", r: (t) => <>
    {[0, 1].map((i) => <Persona key={i} x={420 + i * 1080} y={1050} h={760} t={t} seed={65 + i} ropa={PIRATA(i + 3)} expr="neutro" flip={i === 1} bD={i ? 15 : 100} cD={i ? 0 : 120} habla={i === 0 && t > 72.1} />)}
    <B x={960} y={1050} h={600} t={t} expr="sorpresa" mira={osc(t, 1.2, 8)} bD={40} cD={40} />
    <Txt t={t} t0={70.1} t1={72.0} text="NOBODY WAS BORN" y={150} size={104} color={C.crema} />
    <Txt t={t} t0={72.1} t1={74.8} text="A PIRATE" y={150} size={130} color={C.oro} />
  </> },
  // ── v7 · trampa 1a: el capitán mercante con poder total; el chico siempre lento
  { t0: 82.42, t1: 84.7, c: ["#ffe8c0", "#5a3a2a"], set: "camarote", r: (t) => <>
    <Persona x={960} y={1060} h={790} t={t} seed={61} ropa={CAP_MERC} expr="enojado" bD={140} cD={20} bI={40} cI={110} habla />
    <Txt t={t} t0={82.5} t1={84.6} text="TOTAL POWER" y={130} size={110} color={C.rojo} />
  </> },
  { t0: 89.54, t1: 94.02, c: ["#d8f0ff", "#4a8ac8"], set: "cubierta", r: (t) => <>
    <Persona x={1450} y={1050} h={800} t={t} seed={61} ropa={CAP_MERC} expr="enojado" bD={130} cD={30} flip habla />
    <B x={interpolate(t, [89.54, 94], [260, 760])} y={1050} h={640} t={t} expr="miedo" camina={0.6} inclina={10} bD={25} cD={15} bI={60} cI={20} manoD={<g transform="scale(0.7)"><Balde t={t} /></g>} />
    <Emote t={t} t0={90.5} tipo="sudor" x={560} y={420} />
    <Txt t={t} t0={89.7} t1={93.9} text="ALWAYS TOO SLOW" y={150} size={104} color={C.oro} />
  </> },
  // ── v7 · trampa 1b: casi nadie peleaba; bajan la bandera; se llevan todo; miran a la tripulación
  { t0: 103.02, t1: 106.98, c: ["#e8f4ff", "#5a7aa8"], set: "cubierta", r: (t) => <>
    {[0, 1, 2].map((i) => <Persona key={i} x={420 + i * 540} y={1050} h={700 - (i % 2) * 60} t={t} seed={70 + i} ropa={PIRATA(i)} expr={i === 1 ? "miedo" : "triste"} bD={165} cD={10} bI={165} cI={10} salta={i === 1 ? Math.abs(Math.sin(t * 6)) * 10 : 0} />)}
    <Txt t={t} t0={103.2} t1={104.7} text="SURPRISE:" y={150} size={110} color={C.crema} />
    <Txt t={t} t0={104.8} t1={106.9} text="MOST DID NOT FIGHT" y={150} size={104} color={C.oro} />
  </> },
  { t0: 112.04, t1: 115.6, c: ["#d8f0ff", "#4a8ac8"], set: "cubierta", r: (t) => <>
    <V><rect x={340} y={80} width={18} height={700} fill="#5a3418" /><rect x={358} y={100 + prog(t, 112.2, 113.6) * 420} width={240} height={150} fill="#c81d2e" /></V>
    <Persona x={420} y={1050} h={760} t={t} seed={61} ropa={CAP_MERC} expr="triste" bD={150 - prog(t, 112.2, 113.6) * 70} cD={20} />
    <Persona x={1500} y={1050 + (1 - prog(t, 113.4, 114.4)) * 300} h={760} t={t} seed={80} ropa={PIRATA(2)} expr="feliz" bD={160} cD={10} bI={110} cI={40} flip manoI={<g transform="scale(0.9)"><Sable /></g>} />
    <Txt t={t} t0={113.6} t1={115.5} text="ABOARD!" x={1400} y={170} size={120} color={C.rojo} />
  </> },
  { t0: 115.6, t1: 119.68, c: ["#ffe2a0", "#5a3418"], set: "bodega", r: (t) => <>
    <Persona x={720} y={1050} h={780} t={t} seed={81} ropa={PIRATA(4)} expr="feliz" bD={150} cD={140} bI={150} cI={140} camina={0.5} manoD={<g transform="translate(0 -60) scale(0.7)"><Cofre t={t} txt="MEDICINE" brillo /></g>} />
    <V><Barril x={1500} y={1000} s={1.6} txt="RUM" /></V>
    <Lista t={t} x={1180} y={240} w={600} size={56} items={[{ txt: "CARGO", t0: 115.7 }, { txt: "RUM", t0: 116.6 }, { txt: "TOOLS", t0: 117.4 }, { txt: "MEDICINE", t0: 118.4 }]} />
  </> },
  { t0: 119.68, t1: 127.98, c: ["#fff0c8", "#8a5a3a"], set: "cubierta", r: (t) => <>
    <Persona x={1650} y={1050} h={790} t={t} seed={50} ropa={CAPITAN} expr={t > 121.2 ? "orgullo" : "neutro"} flip bD={100} cD={20} mira={-8} habla={t > 121.2} />
    {[["CARPENTER", 121.3], ["SURGEON", 122.6], ["NAVIGATOR", 123.8], ["MUSICIAN", 125.2]].map(([n, tt], i) => <React.Fragment key={i}>
      <Persona x={230 + i * 330} y={1050} h={660} t={t} seed={90 + i} ropa={PIRATA(i + 1)} expr={t > (tt as number) ? "sorpresa" : "neutro"} bD={t > (tt as number) ? 150 : 15} cD={20} />
      <Txt t={t} t0={tt as number} t1={127.9} text={n as string} x={230 + i * 330} y={330} size={54} color={C.lima} />
    </React.Fragment>)}
    <Txt t={t} t0={119.8} t1={121.1} text="THEN: THE CREW" y={150} size={110} color={C.crema} />
    <Txt t={t} t0={126.0} t1={127.9} text="VALUABLE = TAKEN" y={150} size={100} color={C.oro} />
  </> },
  // ── v7 · trampa 1b: ¿y vos? chico, no pelea y come. No les interesa. Forzado u olvidado
  { t0: 133.44, t1: 138.82, c: ["#ffe8d0", "#6a4a6a"], set: "cubierta", r: (t) => <>
    <Persona x={1450} y={1050} h={800} t={t} seed={80} ropa={PIRATA(2)} expr="enojado" inclina={-10} flip bD={110} cD={60} habla={t < 134.9} />
    <B x={620} y={1050} h={560} t={t} expr={t > 135.6 ? "triste" : "sorpresa"} bD={30} cD={50} miraY={-6} mira={6} />
    <Txt t={t} t0={134.9} t1={135.5} text="AND YOU?" y={150} size={120} color={C.oro} />
    <Lista t={t} x={700} y={130} w={620} size={58} items={[{ txt: "SMALL", t0: 135.7, tacha: 136.3 }, { txt: "CAN'T FIGHT", t0: 136.6, tacha: 137.3 }, { txt: "EATS", t0: 137.9, tacha: 138.4 }]} />
  </> },
  { t0: 138.82, t1: 141.64, c: ["#e8f0ff", "#5a6a8a"], set: "cubierta", r: (t) => <>
    {[0, 1].map((i) => <Persona key={i} x={1200 + i * 420 + (t - 138.8) * 80} y={1050} h={760} t={t} seed={82 + i} ropa={PIRATA(i + 4)} expr="neutro" flip={false} camina={1.4} />)}
    <B x={560} y={1050} h={640} t={t} expr="triste" bD={165 + osc(t, 9, 12)} cD={20} habla />
    <Txt t={t} t0={139.0} t1={141.6} text="NO INTEREST" y={150} size={120} color={C.rojo} />
  </> },
  { t0: 141.64, t1: 146.2, c: ["#ffd8c0", "#7a3a3a"], set: "cubierta", r: (t) => <>
    <Persona x={300 + (t - 141.6) * 40} y={1050} h={760} t={t} seed={84} ropa={PIRATA(5)} expr="enojado" bD={80} cD={20} camina={1} />
    <B x={620 + (t - 141.6) * 40} y={1050} h={620} t={t} expr="miedo" inclina={-16} bI={100} cI={10} />
    <Txt t={t} t0={141.8} t1={146.1} text="FORCED" x={480} y={150} size={110} color={C.rojo} />
    <Mitad t={t} t0={143.6} c={["#d8d8e8", "#4a4a6a"]}>
      <B x={1440} y={1050} h={660} t={t} expr="triste" bD={20} bI={20} miraY={6} ladea={osc(t, 2, 3)} />
      <Txt t={t} t0={143.8} t1={146.1} text="FORGOTTEN" x={1440} y={150} size={100} color={C.crema} />
    </Mitad>
  </> },
  // ── v7 · trampa 2a: las tareas
  { t0: 152.56, t1: 156.48, c: ["#fff0c0", "#b8703a"], set: "cubierta", r: (t) => <>
    <B x={960} y={1050} h={790} t={t} expr="sorpresa" bD={25} cD={15} bI={150} cI={30} salta={Math.abs(Math.sin(t * 4)) * 10} manoD={<g transform="scale(0.7)"><Balde t={t} /></g>} />
    <Txt t={t} t0={152.7} t1={154.7} text="TRAP 2: THE CHORES" y={150} size={100} color={C.oro} />
    <Txt t={t} t0={154.8} t1={156.4} text="YOU'RE ON BOARD" y={150} size={104} color={C.crema} />
  </> },
  { t0: 156.48, t1: 161.04, c: ["#fff4d0", "#8a6a3a"], set: "cubierta", r: (t) => <>
    {[0, 1, 2].map((i) => <Persona key={i} x={1250 + i * 260} y={1050} h={700} t={t} seed={95 + i} ropa={PIRATA(i)} expr="feliz" flip bD={t > 158.7 ? 100 : 15} cD={10} mira={-8} />)}
    <B x={520} y={1050} h={700} t={t} expr={t > 158.7 ? "triste" : "neutro"} inclina={t > 158.7 ? 12 : 0} bD={25} cD={15} manoD={<g transform="scale(0.7)"><Balde t={t} peste /></g>} />
    <Txt t={t} t0={156.6} t1={158.6} text="THE JOB?" y={150} size={120} color={C.crema} />
    <Txt t={t} t0={158.7} t1={161.0} text="EVERYTHING" y={150} size={130} color={C.oro} />
  </> },
  { t0: 161.04, t1: 164.42, c: ["#fff0c8", "#6a4a2a"], set: "camarote", r: (t) => <>
    <Persona x={1450} y={1050} h={790} t={t} seed={50} ropa={CAPITAN} expr="enojado" flip bD={120} cD={30} habla />
    <B x={interpolate(t, [161.04, 162.6], [300, 760], { extrapolateRight: "clamp" })} y={1050} h={640} t={t} expr="miedo" camina={t < 162.6 ? 1.8 : 0} bD={90} cD={90} manoD={<g transform="scale(0.45)"><Cuenco t={t} /></g>} />
    <Txt t={t} t0={161.2} t1={164.3} text="SERVE THE OFFICERS" y={150} size={100} color={C.oro} />
  </> },
  { t0: 170.74, t1: 174.26, c: ["#d8f0ff", "#4a8ac8"], set: "cubierta", r: (t) => <>
    <B x={900} y={1080} h={640} t={t} expr="triste" inclina={30} bD={55 + osc(t, 8, 20)} cD={25} bI={45 + osc(t, 8, -20)} cI={25} miraY={10} />
    <V>{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={760 + ((i * 53 + t * 120) % 360)} cy={1010 + (i % 3) * 14} r={6} fill="#fff" opacity={0.7} />)}</V>
    <Txt t={t} t0={170.9} t1={174.2} text="SAND + SEAWATER" y={150} size={104} color={C.crema} />
  </> },
  { t0: 174.26, t1: 180.44, c: ["#fff2c8", "#9a6a3a"], set: "bodega", r: (t) => <>
    <B x={interpolate(t, [174.26, 180.4], [1600, 300])} y={1050} h={700} t={t} expr={t > 177.5 ? "enojado" : "neutro"} flip camina={2} bD={25} cD={15} manoD={<g transform="scale(0.7)"><Balde t={t} peste={t > 177.5} /></g>} />
    {t > 177.5 && <Nube t={t} t0={177.5} r={110} />}
    <Lista t={t} x={960} y={130} w={760} size={54} items={[{ txt: "MESSAGES", t0: 174.4 }, { txt: "TOOLS", t0: 175.6 }, { txt: "BUCKETS… DON'T ASK", t0: 177.4 }]} />
  </> },
  { t0: 180.44, t1: 183.8, c: ["#ffe8b0", "#7a5a2a"], set: "camarote", r: (t) => <>
    <V><RelojArena x={1300} y={640} t={t} s={2.6} vuelta={[180.5]} /></V>
    <B x={560} y={1050} h={780} t={t} expr="sorpresa" mira={8} bD={110} cD={10} />
    <Txt t={t} t0={180.6} t1={183.7} text="TIME = SAND" y={150} size={120} color={C.oro} />
  </> },
  { t0: 188.16, t1: 191.66, c: ["#c8c8f0", "#1a1a3a"], set: "noche", r: (t) => <>
    <V><RelojArena x={1350} y={600} t={t} s={2.2} vuelta={[188.3, 189.5, 190.7]} /></V>
    <B x={620} y={1050} h={780} t={t} expr="dormido" ladea={osc(t, 3, 5)} bD={130} cD={20} />
    <Contador t={t} t0={188.3} t1={191.2} de={1} a={48} x={620} y={150} size={120} color={C.oro} pre="×" post=" A DAY" tFin={191.6} />
  </> },
  { t0: 191.66, t1: 196.72, c: ["#ffe0c0", "#5a3a5a"], set: "camarote", r: (t) => <>
    <V><RelojArena x={1250} y={620} t={t} s={2.4} vuelta={[193.0]} /></V>
    <B x={640} y={1050} h={760} t={t} expr={t > 195.4 ? "miedo" : "orgullo"} mira={8} bD={100} cD={20} inclina={6} />
    {t < 194.4 && <Emote t={t} t0={192.0} tipo="brillos" x={640} y={330} />}
    <Txt t={t} t0={191.8} t1={194.4} text="A LITTLE EARLY…" y={150} size={104} color={C.crema} />
    <Txt t={t} t0={195.4} t1={196.6} text="FLOGGING THE GLASS" y={150} size={100} color={C.rojo} />
  </> },
  // ── v7 · trampa 2b: la bomba, el aparejo, el sueño
  { t0: 210.14, t1: 217.54, c: ["#e0ffd0", "#2a3a2a"], set: "bodega", r: (t) => <>
    <V><rect x={940} y={420} width={40} height={600} fill="#5a3418" /><rect x={760 + osc(t, 3, 0)} y={420 + osc(t, 3, 50)} width={400} height={30} rx={14} fill="#7a4520" /></V>
    <Persona x={560} y={1050} h={760} t={t} seed={100} ropa={PIRATA(1)} expr="enojado" bD={140 + osc(t, 3, 25)} cD={30} />
    <B x={1360} y={1050} h={640} t={t} expr={t > 214.4 ? "enojado" : "triste"} flip bD={140 + osc(t, 3, -25)} cD={30} />
    {t > 214.4 && <Nube t={t} t0={214.4} r={140} />}
    <Txt t={t} t0={210.3} t1={214.3} text="PUMP. TWICE A DAY." y={150} size={100} color={C.crema} />
    <Txt t={t} t0={214.5} t1={217.4} text="THE SMELL…" y={150} size={120} color={C.lima} />
  </> },
  { t0: 217.54, t1: 227.2, c: ["#d8f0ff", "#4a8ac8"], set: "mastil", r: (t) => <>
    <B x={760} y={1080 - prog(t, 217.6, 226.8) * 420} h={640} t={t} expr={t > 220.4 ? "miedo" : "neutro"} bD={150 + osc(t, 6, 18)} cD={20} bI={150 + osc(t, 6, -18)} cI={20} mira={6} miraY={-6} />
    <Txt t={t} t0={217.7} t1={220.2} text="UP YOU GO" y={150} size={120} color={C.oro} />
    <Txt t={t} t0={220.4} t1={227.1} text="LIGHT + FAST" y={150} size={110} color={C.crema} />
  </> },
  { t0: 227.2, t1: 233.98, c: ["#a8c0d8", "#2a3a5a"], set: "mastil", r: (t) => <>
    <Lluvia t={t} n={140} />
    <B x={900 + osc(t, 1.4, 140)} y={720} h={600} t={t} expr="miedo" ladea={osc(t, 1.4, 10)} inclina={osc(t, 1.4, 14)} bD={160} cD={10} bI={160} cI={10} />
    <Txt t={t} t0={227.4} t1={230.7} text="30 M · NO HARNESS" y={150} size={100} color={C.crema} />
    <Txt t={t} t0={230.8} t1={233.9} text="ROCKING" y={150} size={120} color={C.rojo} rot={osc(t, 1.4, 6)} />
  </> },
  { t0: 233.98, t1: 238.64, c: ["#d8f0ff", "#4a8ac8"], set: "mastil", r: (t) => <>
    <B x={1180} y={900} h={720} t={t} expr="neutro" bD={170} cD={0} bI={60} cI={80} habla mira={-6} />
    <Txt t={t} t0={234.1} t1={236.3} text="ONE HAND FOR YOU" x={700} y={150} size={90} color={C.oro} />
    <Txt t={t} t0={236.4} t1={238.6} text="ONE FOR THE SHIP" x={700} y={150} size={90} color={C.crema} />
  </> },
  { t0: 243.78, t1: 252.38, c: ["#c8c8f0", "#1a1a3a"], set: "bodega", r: (t) => <>
    <V><path d={`M 260 560 Q 960 ${860 + osc(t, 1.2, 14)} 1660 560`} stroke="#d9b98a" strokeWidth={46} fill="none" /></V>
    <B x={960} y={1050} h={700} t={t} expr="dormido" ladea={osc(t, 1.2, 6)} bD={20} bI={20} />
    <Zzz x={1180} y={420} t={t} />
    <Txt t={t} t0={243.9} t1={247.3} text="4 HOURS ON" x={960} y={150} size={110} color={C.oro} />
    <Txt t={t} t0={247.4} t1={252.3} text="4 HOURS OFF" x={960} y={150} size={110} color={C.crema} />
  </> },
  { t0: 252.38, t1: 258.9, c: ["#ffd8a0", "#7a2a2a"], set: "bodega", r: (t) => <>
    <Campana x={1550} y={330} s={1.4} t={t} t0b={252.4} />
    <B x={760} y={1050} h={780} t={t} expr="miedo" salta={Math.abs(Math.sin(t * 7)) * 22} bD={165} cD={10} bI={165} cI={10} />
    <Emote t={t} t0={252.6} tipo="susto" x={760} y={300} />
    <Txt t={t} t0={252.5} t1={258.8} text="ALL HANDS!" y={150} size={130} color={C.rojo} rot={osc(t, 12, 2)} />
  </> },
  { t0: 258.9, t1: 264.64, c: ["#d8e0f0", "#3a4a6a"], set: "cubierta", r: (t) => <>
    <B x={interpolate(t, [258.9, 264.6], [400, 1300])} y={1050} h={760} t={t} expr="dormido" camina={0.5} inclina={14 + osc(t, 1.4, 6)} ladea={osc(t, 1.4, 8)} bD={10} bI={10} />
    <Txt t={t} t0={259.1} t1={264.5} text="PERMANENTLY TIRED" y={150} size={104} color={C.crema} rot={osc(t, 1.4, 3)} />
  </> },
  // ── v7 · trampa 3: los artículos
  { t0: 264.64, t1: 270.12, c: ["#fff0c0", "#8a5a2a"], set: "camarote", r: (t) => <>
    <Pergamino x={1300} y={560} w={600} abre={prog(t, 265, 266.2)} lineas={9} titulo="ARTICLES" />
    <B x={560} y={1050} h={780} t={t} expr="sorpresa" bD={100} cD={40} mira={8} />
    <Txt t={t} t0={264.8} t1={270.0} text="TRAP 3: THE ARTICLES" y={150} size={100} color={C.oro} />
  </> },
  { t0: 270.12, t1: 278.22, c: ["#ffe8b0", "#6a4a2a"], set: "camarote", r: (t) => <>
    <Pergamino x={960} y={760} w={760} abre={1} lineas={7} firma={prog(t, 275, 277.6)} />
    {[0, 1, 2].map((i) => <Persona key={i} x={330 + i * 630} y={1050} h={740} t={t} seed={110 + i} ropa={PIRATA(i + 2)} expr={i === 1 ? "orgullo" : "feliz"} flip={i === 2} bD={i === 1 && t > 274.9 ? 70 + osc(t, 14, 12) : 15} cD={i === 1 ? 90 : 0} />)}
    <Txt t={t} t0={270.3} t1={274.8} text="WRITTEN RULES" y={150} size={110} color={C.crema} />
    <Txt t={t} t0={274.9} t1={278.1} text="SIGN, OR MAKE YOUR MARK" y={150} size={90} color={C.oro} />
  </> },
  { t0: 278.22, t1: 284.78, c: ["#fff0c8", "#5a3a2a"], set: "camarote", r: (t) => <>
    <B x={1400} y={1050} h={760} t={t} expr="sorpresa" flip bD={110} cD={100} bI={110} cI={100} mira={-6} miraY={4} />
    <V><g transform={`translate(640 640) scale(1.6) rotate(${-6 + osc(t, 1, 2)})`}><Libro titulo={["A GENERAL", "HISTORY OF", "THE PIRATES"]} /></g></V>
    <Txt t={t} t0={278.4} t1={284.7} text="1724" x={640} y={980} size={130} color={C.oro} />
  </> },
  { t0: 284.78, t1: 291.1, c: ["#ffe2b0", "#8a2a2a"], set: "cubierta", r: (t) => <>
    <Persona x={960} y={1060} h={880} t={t} seed={120} ropa={ROBERTS} expr="orgullo" bD={60} cD={100} bI={20} habla ladea={osc(t, 1.5, 3)} />
    <Txt t={t} t0={284.9} t1={291.0} text="BARTHOLOMEW ROBERTS" y={130} size={96} color={C.oro} />
  </> },
  // ── v7 · trampa 3a: el reparto en escala fija
  { t0: 308.3, t1: 322.26, c: ["#fff4c8", "#9a6a3a"], set: "camarote", r: (t) => <>
    {[["2", CAPITAN, 760, 310.3], ["1½", PIRATA(3), 660, 312.9], ["1", PIRATA(1), 560, 316.6], ["½", GRUMETE, 450, 318.1]].map(([n, r, h, tt], i) => <React.Fragment key={i}>
      <Persona x={300 + i * 440} y={1050} h={h as number} t={t} seed={i === 3 ? 7 : 130 + i} ropa={r as Ropa} expr={t > (tt as number) ? (i === 3 ? (t > 320.5 ? "feliz" : "sorpresa") : "orgullo") : "neutro"} bD={t > (tt as number) ? 150 : 15} cD={20} />
      <Txt t={t} t0={tt as number} t1={322.2} text={n as string} x={300 + i * 440} y={1050 - (h as number) - 90} size={90} color={C.oro} />
    </React.Fragment>)}
    <Txt t={t} t0={308.4} t1={310.2} text="FIXED SCALE" y={120} size={100} color={C.crema} />
    <Txt t={t} t0={320.6} t1={322.2} text="ALMOST FAIR…" y={120} size={100} color={C.lima} />
  </> },
  // ── v7 · trampa 3b: votado y desvotado, el contramaestre, el artículo VI, por qué no chicos
  { t0: 322.26, t1: 330.56, c: ["#ffe8c0", "#7a4a3a"], set: "cubierta", r: (t) => <>
    <Persona x={960} y={1000} h={700} t={t} seed={50} ropa={CAPITAN} expr={t > 325 ? "miedo" : "orgullo"} bD={t > 325 ? 30 : 150} cD={20} />
    {[0, 1, 2, 3].map((i) => <Persona key={i} x={[260, 620, 1300, 1660][i]} y={1120} h={600} t={t} seed={140 + i} ropa={PIRATA(i)} expr={t > 325 ? "enojado" : "feliz"} flip={i > 1} bD={(t > 325 ? i % 2 === 0 : true) ? 165 + osc(t, 6 + i, 8) : 15} cD={0} habla />)}
    <Txt t={t} t0={322.4} t1={324.9} text="VOTED IN…" y={130} size={110} color={C.lima} />
    <Txt t={t} t0={325.0} t1={330.5} text="…VOTED OUT" y={130} size={110} color={C.rojo} />
  </> },
  { t0: 330.56, t1: 334.52, c: ["#d8c0c0", "#2a1a2a"], set: "bodega", r: (t) => <>
    <Persona x={1150} y={1060} h={900} t={t} seed={150} ropa={QM} expr="enojado" bD={40} cD={110} flip manoD={<g transform="scale(0.5)"><Gato9 t={t} /></g>} />
    <B x={420} y={1050} h={560} t={t} expr="miedo" inclina={-10} ladea={osc(t, 12, 2)} bD={150} cD={150} />
    <Txt t={t} t0={330.7} t1={334.4} text="THE QUARTERMASTER" y={130} size={100} color={C.rojo} />
  </> },
  { t0: 334.52, t1: 344.46, c: ["#fff0c8", "#6a3a3a"], set: "camarote", r: (t) => <>
    <Pergamino x={1330} y={600} w={640} abre={1} lineas={6} titulo="ARTICLE VI" />
    <Txt t={t} t0={335.0} t1={344.4} text="NO BOY ALLOWED" x={1330} y={700} size={60} color={C.rojo} />
    <B x={560} y={1050} h={780} t={t} expr={t > 342.3 ? "miedo" : "sorpresa"} bD={100} cD={60} mira={8} miraY={2} ladea={t > 342.3 ? osc(t, 10, 2) : 0} />
    <Txt t={t} t0={342.4} t1={344.4} text="YOU SHOULDN'T BE HERE" y={130} size={90} color={C.oro} />
  </> },
  { t0: 344.46, t1: 352.7, c: ["#fff0c8", "#8a5a3a"], set: "cubierta", r: (t) => <>
    <Persona x={1450} y={1050} h={800} t={t} seed={160} ropa={PIRATA(4)} expr="enojado" flip bD={120} cD={30} habla={t > 348} manoD={<g transform="scale(0.5)"><Moneda8 r={40} t={t} /></g>} />
    <B x={560} y={1050} h={600} t={t} expr="triste" bD={60} cD={90} mira={8} manoD={<g transform="scale(0.5)"><Moneda8 r={40} t={t} gira={1} /></g>} />
    <Txt t={t} t0={344.6} t1={347.0} text="WHY BAN BOYS?" y={150} size={110} color={C.crema} />
    <Txt t={t} t0={347.1} t1={352.6} text="YOUR SHARE = HIS LOSS" y={150} size={90} color={C.oro} />
  </> },
  { t0: 352.7, t1: 360.48, c: ["#a8a0c0", "#1a1028"], set: "bodega", r: (t) => <>
    {[0, 1].map((i) => <Persona key={i} x={340 + i * 1240} y={1050} h={820} t={t} seed={170 + i} ropa={PIRATA(i + 1)} expr={i ? "triste" : "enojado"} flip={i === 1} bD={i ? 40 : 15} cD={i ? 110 : 0} />)}
    <B x={960} y={1050} h={520} t={t} expr="miedo" ladea={osc(t, 10, 2)} bD={30} bI={30} />
    <Txt t={t} t0={352.9} t1={356.4} text="FAR FROM ANY LAW" y={130} size={100} color={C.crema} />
    <Txt t={t} t0={356.5} t1={360.4} text="NOT SAFE FOR A CHILD" y={130} size={96} color={C.rojo} />
  </> },
  // ── v7 · trampa 4: castigos
  { t0: 369.84, t1: 378.28, c: ["#ffd8c0", "#6a2a3a"], set: "camarote", r: (t) => <>
    <Persona x={1400} y={1050} h={790} t={t} seed={150} ropa={QM} expr="enojado" flip bD={60} cD={110} manoD={<g transform="scale(0.5)"><Gato9 t={t} /></g>} />
    <B x={560} y={1050} h={700} t={t} expr={t > 372.1 ? "neutro" : "miedo"} bD={t > 372.1 ? 100 : 30} cD={40} mira={8} />
    <Txt t={t} t0={370.0} t1={372.0} text="TRAP 4: PUNISHMENT" y={150} size={100} color={C.rojo} />
    <Txt t={t} t0={372.1} t1={378.2} text="LIGHTER THAN THE NAVY" y={150} size={92} color={C.crema} />
  </> },
  { t0: 378.28, t1: 385.08, c: ["#fff0c0", "#8a4a3a"], set: "cubierta", r: (t) => <>
    <Persona x={960} y={1060} h={860} t={t} seed={180} ropa={PIRATA(2)} expr={t > 382.5 ? "enojado" : "feliz"} bD={160} cD={10} bI={160} cI={10} salta={t < 382.5 ? Math.abs(Math.sin(t * 5)) * 14 : 0} />
    
    <Txt t={t} t0={378.4} t1={382.4} text="NO MORE BEATINGS" y={130} size={100} color={C.lima} />
    <Txt t={t} t0={382.5} t1={385.0} text="LIGHTER ≠ LIGHT" y={130} size={110} color={C.rojo} />
  </> },
  { t0: 414.6, t1: 424.68, c: ["#fff4c0", "#3a9ad8"], set: "playa", r: (t) => <>
    <Persona x={760} y={1050} h={780} t={t} seed={190} ropa={PIRATA(3)} expr="triste" bD={20} bI={20} mira={6} ladea={osc(t, 1, 4)} />
    <V>{[["#7ab8d8", 418.4], ["#3a3a3a", 421.4], ["#5a5a5a", 422.6]].map(([c, tt], i) => t > (tt as number) && <g key={i} transform={`translate(${1150 + i * 150} 1000) scale(1.5)`}>{i < 2 ? <Botella c={c as string} txt={i ? "POWDER" : "WATER"} /> : <Pistola t={t} />}</g>)}</V>
    <Txt t={t} t0={414.8} t1={418.3} text="MAROONED" y={150} size={130} color={C.oro} />
    <Txt t={t} t0={418.4} t1={424.6} text="1 PISTOL · 1 SHOT" y={150} size={110} color={C.crema} />
  </> },
  { t0: 424.68, t1: 429.3, c: ["#ffd0a0", "#4a1a1a"], set: "playa", r: (t) => <>
    <Persona x={760} y={1060} h={860} t={t} seed={190} ropa={PIRATA(3)} expr="miedo" bD={20} bI={20} miraY={8} mira={8} />
    <V><g transform="translate(1350 980) scale(2.4)"><Pistola t={t} /></g></V>
    <Txt t={t} t0={424.8} t1={429.2} text="NOT FOR HUNTING" y={130} size={110} color={C.rojo} />
  </> },
  // ── v7 · trampa 4b: la marina; la plancha es un mito; el mar alcanza; keelhaul; la soga
  { t0: 429.3, t1: 432.54, c: ["#d8e0ff", "#1a2a5a"], set: "camarote", r: (t) => <>
    <Persona x={1350} y={1050} h={800} t={t} seed={200} ropa={{ ...CAPITAN, tunica: "#1d3a8a", tunica2: "#0e1d4a" }} expr="enojado" flip bD={150} cD={20} manoD={<rect x={-6} y={-200} width={12} height={240} fill="#c8a060" />} />
    <B x={560} y={1050} h={640} t={t} expr="miedo" inclina={-10} bD={30} bI={30} />
    <Txt t={t} t0={429.4} t1={432.5} text="THE ROYAL NAVY" x={560} y={150} size={96} color={C.crema} />
  </> },
  { t0: 438.9, t1: 446.4, c: ["#d8f0ff", "#3a7ab8"], set: "mar", r: (t) => <>
    <V><rect x={300} y={640} width={900} height={40} rx={10} fill="#a8682f" /><rect x={0} y={560} width={420} height={520} fill="#7a4520" /></V>
    <Persona x={1500} y={1050} h={800} t={t} seed={210} ropa={PIRATA(4)} expr="feliz" flip bD={t > 440.6 ? 100 : 30} cD={30} habla salta={t > 440.6 ? Math.abs(Math.sin(t * 7)) * 10 : 0} />
    <Txt t={t} t0={439.0} t1={440.5} text="WALK THE PLANK?" y={150} size={110} color={C.crema} />
    <V>{t > 440.6 && <g transform="translate(700 420)"><Sello t={t} t0={440.6} txt="MYTH" size={130} /></g>}</V>
    <Txt t={t} t0={442.3} t1={446.3} text="A HANDFUL OF CASES" y={150} size={96} color={C.oro} />
  </> },
  { t0: 446.4, t1: 451.3, c: ["#d8f0ff", "#2a6aa8"], set: "mar", r: (t) => <>
    <Persona x={960} y={1050} h={860} t={t} seed={210} ropa={PIRATA(4)} expr="orgullo" bD={130} cD={40} bI={130} cI={40} ladea={osc(t, 1.4, 4)} />
    <Txt t={t} t0={446.5} t1={448.2} text="NO THEATER" y={130} size={110} color={C.crema} />
    <Txt t={t} t0={448.3} t1={451.2} text="THE SEA IS ENOUGH" y={130} size={104} color={C.oro} />
  </> },
  { t0: 451.3, t1: 458.7, c: ["#2a7ab8", "#0a1a3a"], r: (t) => <>
    <V>
      <path d="M -50 0 L 1970 0 L 1970 260 Q 960 520 -50 260 Z" fill="#6b3a1f" />
      {Array.from({ length: 18 }, (_, i) => <circle key={i} cx={60 + i * 110} cy={262 + Math.sin((i / 17) * Math.PI) * 120} r={18} fill="#d8d0c0" />)}
      <path d={`M 0 300 Q ${interpolate(t, [451.3, 458.6], [100, 1700])} ${560} 1920 300`} stroke="#c8a060" strokeWidth={10} fill="none" />
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={(i * 173 + t * 40) % 1920} cy={1080 - ((t * 80 + i * 97) % 700)} r={8} fill="#bfefff" opacity={0.4} />)}
    </V>
    <Persona x={interpolate(t, [451.3, 458.6], [150, 1750])} y={980} h={700} t={t} seed={220} ropa={PIRATA(5)} expr="miedo" inclina={-70} bD={170} cD={0} bI={170} cI={0} />
    <Txt t={t} t0={451.4} t1={458.6} text="KEELHAULING" y={960} size={110} color={C.oro} />
  </> },
  { t0: 458.7, t1: 466.14, c: ["#fff0c8", "#8a5a3a"], set: "cubierta", r: (t) => <>
    <Persona x={1350} y={1050} h={820} t={t} seed={230} ropa={PIRATA(1)} expr={t > 461.8 ? "orgullo" : "neutro"} flip bD={t > 464.3 ? 150 : 60} cD={40} habla manoD={<path d="M 0 0 Q 40 120 0 240" stroke="#c8a060" strokeWidth={16} fill="none" />} />
    <B x={560} y={1050} h={620} t={t} expr={t > 464.3 ? "miedo" : "neutro"} mira={8} bD={30} cD={40} />
    <Txt t={t} t0={458.8} t1={461.7} text="DUTCH NAVY, 1600s" y={150} size={100} color={C.crema} />
    <Txt t={t} t0={461.8} t1={464.2} text="TOO MUCH TROUBLE" y={150} size={100} color={C.crema} />
    <Txt t={t} t0={464.3} t1={466.1} text="A ROPE: CHEAPER" y={150} size={104} color={C.rojo} />
  </> },
  // ── v7 · trampa 5: comida
  { t0: 466.14, t1: 471.32, c: ["#fff2c0", "#b8703a"], set: "cocina", r: (t) => <>
    <B x={960} y={1050} h={790} t={t} expr="feliz" bD={80} cD={90} habla manoD={<g transform="scale(0.45)"><Cuenco t={t} /></g>} />
    <Txt t={t} t0={466.3} t1={468.5} text="TRAP 5: THE FOOD" y={150} size={104} color={C.oro} />
    <Txt t={t} t0={468.6} t1={471.2} text="DAY 1: FINE" y={150} size={110} color={C.lima} />
  </> },
  { t0: 471.32, t1: 476.06, c: ["#fff2c0", "#8a4a20"], set: "cocina", r: (t) => <>
    <Persona x={1400} y={1050} h={800} t={t} seed={240} ropa={{ ...PIRATA(0), tunica: "#f2ead8", tunica2: "#c8bca0" }} expr="orgullo" flip bD={110} cD={60} habla manoD={<g transform="scale(0.7)"><Carne /></g>} />
    <Lista t={t} x={140} y={200} w={700} size={56} items={[{ txt: "SALT BEEF", t0: 471.4 }, { txt: "SALT PORK", t0: 472.4 }, { txt: "DRIED PEAS", t0: 473.4 }, { txt: "CHEESE", t0: 474.2 }, { txt: "BISCUIT", t0: 475.0 }]} />
  </> },
  { t0: 497.52, t1: 501.46, c: ["#ffb060", "#0a0a1a"], luz: [700, 560], set: "bodega", r: (t) => <>
    <B x={700} y={1050} h={780} t={t} expr="dormido" bD={100} cD={110} habla ladea={osc(t, 1.5, 3)} manoD={<g transform="scale(0.6)"><Galleta t={t} bichos={3} /></g>} />
    <Txt t={t} t0={497.7} t1={501.4} text="EAT IN THE DARK" x={1380} y={300} size={96} color={C.oro} />
  </> },
  { t0: 545.8, t1: 552.36, c: ["#ffe0a0", "#a83a1a"], set: "cocina", r: (t) => <>
    <B x={960} y={1050} h={790} t={t} expr={t > 548.4 ? "enojado" : "sorpresa"} bD={90} cD={100} habla salta={t > 548.4 ? Math.abs(Math.sin(t * 9)) * 16 : 0} manoD={<g transform="scale(0.45)"><Cuenco t={t} /></g>} />
    {t > 548.4 && <Emote t={t} t0={548.4} tipo="sudor" x={960} y={300} />}
    <Txt t={t} t0={545.9} t1={548.3} text="LOTS OF SPICE" y={150} size={110} color={C.rojo} />
    <Txt t={t} t0={548.4} t1={552.3} text="THE MEAT NEEDED IT" y={150} size={100} color={C.oro} />
  </> },
  { t0: 556.02, t1: 562.9, c: ["#c8c8e0", "#2a2a40"], set: "bodega", r: (t) => <>
    <Persona x={620} y={1050} h={800} t={t} seed={250} ropa={PIRATA(2)} expr="dormido" bD={15} />
    <Persona x={1300} y={1050} h={800} t={t} seed={251} ropa={PIRATA(5)} expr="dormido" flip bD={15} />
    <B x={960} y={1050} h={600} t={t} expr="triste" bD={15} bI={15} ladea={osc(t, 2, 3)} />
    <V><path d="M 885 640 L 1035 640" stroke="#fff" strokeWidth={8} /><path d="M 885 620 L 885 660 M 1035 620 L 1035 660" stroke="#fff" strokeWidth={8} /></V>
    <Txt t={t} t0={556.2} t1={560.5} text="14 INCHES" y={150} size={120} color={C.oro} />
    <Txt t={t} t0={560.6} t1={562.8} text="= A SCHOOL DESK" y={150} size={110} color={C.crema} />
  </> },
  { t0: 562.9, t1: 567.58, c: ["#d0e0b0", "#2a3a2a"], set: "bodega", r: (t) => <>
    <B x={960} y={1050} h={800} t={t} expr="enojado" bD={110} cD={140} ladea={osc(t, 8, 3)} />
    <Nube t={t} t0={563.0} r={150} />
    <Txt t={t} t0={563.1} t1={567.5} text="NO BATH FOR WEEKS" y={150} size={100} color={C.lima} />
  </> },
  // ── v7 · trampa 6: fiebre
  { t0: 571.54, t1: 577.26, c: ["#e0ffc0", "#3a5a2a"], set: "bodega", r: (t) => <>
    <B x={960} y={1050} h={790} t={t} expr="triste" inclina={8} ladea={osc(t, 6, 4)} bD={60} cD={120} bI={60} cI={120} />
    <Emote t={t} t0={572.0} tipo="sudor" x={960} y={300} />
    <V>{[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${400 + i * 380 + osc(t, 2 + i, 20)} ${500 + osc(t, 3 + i, 30)})`}><Microbio t={t} s={1.2} /></g>)}</V>
    <Txt t={t} t0={571.7} t1={573.8} text="TRAP 6: THE FEVER" y={150} size={104} color={C.lima} />
    <Txt t={t} t0={573.9} t1={577.2} text="WHAT REALLY KILLED?" y={150} size={96} color={C.crema} />
  </> },
  { t0: 598.38, t1: 601.14, c: ["#fff8c0", "#c8a03a"], set: "cubierta", r: (t) => <>
    <Persona x={620} y={1050} h={790} t={t} seed={260} ropa={PIRATA(1)} expr="triste" bD={20} miraY={6} ladea={osc(t, 3, 3)} />
    <V><g transform={`translate(1350 ${640 + osc(t, 3, 14)}) rotate(${osc(t, 2, 10)})`}><ellipse rx={150} ry={110} fill="#f7e03a" stroke={TINTA} strokeWidth={10} /><path d="M 130 -30 L 175 -50 L 150 0" fill="#f7e03a" stroke={TINTA} strokeWidth={8} /></g></V>
    <Txt t={t} t0={598.5} t1={601.0} text="A LEMON. THAT'S IT." y={150} size={100} color={C.oro} />
  </> },
  { t0: 601.14, t1: 610.46, c: ["#e8ffb0", "#2a6a3a"], set: "playa", r: (t) => <>
    <B x={760} y={1050} h={790} t={t} expr="miedo" bD={160 + osc(t, 9, 10)} cD={150} bI={160 + osc(t, 9, -10)} cI={150} ladea={osc(t, 9, 4)} />
    <V>{Array.from({ length: 8 }, (_, i) => <g key={i} transform={`translate(${1100 + (i % 4) * 160 + osc(t, 3 + i, 50)} ${420 + Math.floor(i / 4) * 160 + osc(t, 4 + i, 40)})`}><Mosquito t={t} s={1.3} /></g>)}</V>
    <Txt t={t} t0={601.3} t1={605.8} text="YELLOW FEVER" y={150} size={110} color={C.oro} />
    <Txt t={t} t0={605.9} t1={610.4} text="MALARIA" y={150} size={120} color={C.rojo} />
  </> },
  { t0: 614.98, t1: 622.62, c: ["#ffd8a0", "#4a1a2a"], set: "puerto", r: (t) => <>
    <Persona x={960} y={1060} h={880} t={t} seed={270} ropa={BARBANEGRA} expr="enojado" bD={140} cD={20} habla ladea={osc(t, 2, 2)} />
    <Txt t={t} t0={615.1} t1={618.6} text="BLACKBEARD" y={130} size={120} color={C.rojo} />
    <Txt t={t} t0={618.7} t1={622.5} text="CHARLESTON, 1718" y={130} size={100} color={C.crema} />
  </> },
  // ── v7 · trampa 6b: el carpintero cirujano, sin anestesia, ¿seguro?
  { t0: 628.08, t1: 636.72, c: ["#ffe0c0", "#5a2a2a"], set: "bodega", r: (t) => <>
    <Persona x={1350} y={1050} h={820} t={t} seed={280} ropa={{ ...PIRATA(3), tunica: "#8a6a3a", tunica2: "#5a4020" }} expr="orgullo" flip bD={120} cD={30} manoD={<g transform="scale(1.1)"><Sierra /></g>} />
    <Persona x={560} y={1050} h={700} t={t} seed={281} ropa={PIRATA(1)} expr="miedo" bD={30} bI={30} ladea={osc(t, 10, 2)} />
    <Txt t={t} t0={628.2} t1={632.0} text="NO SURGEON?" y={150} size={110} color={C.crema} />
    <Txt t={t} t0={632.1} t1={636.6} text="CALL THE CARPENTER" y={150} size={96} color={C.rojo} />
  </> },
  { t0: 636.72, t1: 642.58, c: ["#ffd0a0", "#4a1a1a"], set: "bodega", r: (t) => <>
    <Persona x={700} y={1060} h={860} t={t} seed={281} ropa={PIRATA(1)} expr="miedo" bD={40} cD={60} ladea={osc(t, 10, 2)} manoD={<g transform="scale(1.2)"><Botella c="#8a4a1a" txt="RUM" /></g>} />
    <Lista t={t} x={1120} y={220} w={660} size={56} items={[{ txt: "NO ANESTHETIC", t0: 636.8 }, { txt: "LEATHER STRAP", t0: 637.8 }, { txt: "RUM", t0: 639.3 }, { txt: "HOT TAR", t0: 641.0 }]} />
  </> },
  { t0: 642.58, t1: 646.12, c: ["#fff4c0", "#7a5a2a"], set: "camarote", r: (t) => <>
    <B x={960} y={1050} h={790} t={t} expr="sorpresa" bD={150} cD={30} bI={150} cI={30} salta={Math.abs(Math.sin(t * 6)) * 12} />
    <Txt t={t} t0={642.7} t1={644.5} text="THE STRANGE PART" y={150} size={104} color={C.crema} />
    <Txt t={t} t0={644.6} t1={646.0} text="INSURANCE?!" y={150} size={130} color={C.oro} />
  </> },
  // ── v7 · trampa 7: la batalla
  { t0: 668.48, t1: 674.16, c: ["#ffd0a0", "#7a2a1a"], set: "cubierta", r: (t) => <>
    <B x={960} y={1050} h={790} t={t} expr="miedo" bD={55} cD={30} ladea={osc(t, 9, 3)} manoD={<g transform="scale(1.3)"><Sable /></g>} />
    <Txt t={t} t0={668.6} t1={670.6} text="TRAP 7: THE BATTLE" y={150} size={100} color={C.rojo} />
    <Txt t={t} t0={670.7} t1={674.1} text="ONE LONG SWORD FIGHT?" y={150} size={92} color={C.crema} />
  </> },
  { t0: 674.16, t1: 680.44, c: ["#d8f0ff", "#4a8ac8"], set: "cubierta", r: (t) => <>
    <Persona x={960} y={1060} h={860} t={t} seed={290} ropa={PIRATA(2)} expr={t > 677.8 ? "orgullo" : "dormido"} bD={t > 677.8 ? 120 : 165} cD={t > 677.8 ? 20 : 150} bI={165} cI={150} habla={t > 677.8} />
    <Txt t={t} t0={674.3} t1={677.7} text="AVOID THE FIGHT" y={130} size={110} color={C.lima} />
    <Txt t={t} t0={677.9} t1={680.4} text="THE FLAG = A MESSAGE" y={130} size={96} color={C.oro} />
  </> },
  { t0: 691.72, t1: 697.08, c: ["#fff0c0", "#8a5a3a"], set: "cubierta", r: (t) => <>
    <Persona x={700} y={1060} h={860} t={t} seed={50} ropa={CAPITAN} expr="orgullo" bD={100} cD={10} habla />
    <V><g transform="translate(1450 520) scale(1.6)"><Signo k="check" s={1} /></g></V>
    <Txt t={t} t0={691.9} t1={694.6} text="NO POLITE DUEL" y={130} size={104} color={C.crema} />
    <Txt t={t} t0={694.7} t1={697.0} text="THE SHIP, NOT A WRECK" y={130} size={92} color={C.oro} />
  </> },
  { t0: 697.08, t1: 703.53, c: ["#ffd8a0", "#6a2a1a"], set: "cubierta", r: (t) => <>
    <Persona x={820} y={1060} h={860} t={t} seed={300} ropa={PIRATA(4)} expr="enojado" bD={150 - prog(t, 701.5, 702.2) * 60} cD={5} manoD={<g transform="scale(1.4)"><Botella c="#4a6a3a" mecha={1} t={t} /></g>} />
    {t > 702.2 && <V><Astillas t={t} t0={702.4} n={18} /></V>}
    <Txt t={t} t0={697.2} t1={703.4} text="HOMEMADE GRENADES" x={960} y={130} size={96} color={C.rojo} />
  </> },
  { t0: 707.52, t1: 712.18, c: ["#ffe0a0", "#7a2a1a"], set: "cubierta", r: (t) => <>
    <Persona x={620} y={1060} h={820} t={t} seed={310} ropa={PIRATA(1)} expr="enojado" bD={85 + osc(t, 10, 30)} cD={0} manoD={<g transform="scale(1.2)"><Sable /></g>} />
    <Persona x={1320} y={1060} h={820} t={t} seed={311} ropa={CAP_MERC} expr="miedo" flip bD={85 + osc(t, 10, -30)} cD={0} manoD={<g transform="scale(1.2)"><Sable /></g>} />
    <Txt t={t} t0={707.6} t1={712.1} text="FAST · LOUD · MINUTES" y={130} size={96} color={C.oro} />
  </> },
  { t0: 712.18, t1: 719.5, c: ["#d8e8ff", "#2a4a7a"], set: "mar", r: (t) => <>
    <BarcoLejos x={1500} y={640} t={t} s={1.1 + prog(t, 712.2, 719.4) * 0.4} tipo="marina" />
    <Persona x={620} y={1060} h={860} t={t} seed={50} ropa={CAPITAN} expr={t > 715.6 ? "miedo" : "sorpresa"} bD={100} cD={60} mira={8} />
    <Txt t={t} t0={712.3} t1={715.5} text="IT DOESN'T SURRENDER" y={130} size={96} color={C.crema} />
    <Txt t={t} t0={715.7} t1={719.4} text="A NAVY WARSHIP" y={130} size={110} color={C.rojo} />
  </> },
  { t0: 719.5, t1: 727.22, c: ["#ffd8a0", "#3a1a10"], set: "bodega", r: (t) => <>
    <V>{[0, 1, 2].map((i) => <Barril key={i} x={1300 + i * 200} y={1000} s={1.5} c="#5a3418" txt="POWDER" />)}</V>
    <B x={interpolate(t, [719.5, 727.2], [1100, 500])} y={1050} h={760} t={t} expr="miedo" flip camina={2.2} bD={55} cD={70} bI={55} cI={70} manoD={<rect x={-50} y={-60} width={100} height={70} rx={14} fill="#e8d8b0" stroke={TINTA} strokeWidth={6} />} />
    <Txt t={t} t0={719.6} t1={723.1} text="NEW JOB:" y={150} size={110} color={C.crema} />
    <Txt t={t} t0={723.2} t1={727.1} text="POWDER MONKEY" y={150} size={120} color={C.oro} />
  </> },
  { t0: 727.22, t1: 735.52, c: ["#e8c8a0", "#3a2a2a"], set: "cubierta", r: (t) => <>
    <V><Canon x={1500} y={960} t={t} dispara={731} s={1.6} /><rect x={0} y={0} width={1920} height={1080} fill="#d8d0c0" opacity={0.15 + osc(t, 1, 0.05)} /></V>
    <B x={500 + ((t - 727.2) * 320) % 900} y={1050} h={740} t={t} expr="miedo" camina={2.6} bD={55} cD={70} manoD={<rect x={-50} y={-60} width={100} height={70} rx={14} fill="#e8d8b0" stroke={TINTA} strokeWidth={6} />} ladea={osc(t, 20, 2)} />
    <Contador t={t} t0={727.4} t1={735.3} de={1} a={20} y={150} size={120} color={C.oro} pre="CARTRIDGE ×" />
  </> },
  { t0: 735.52, t1: 741.44, c: ["#ffe0c0", "#6a2a2a"], set: "cubierta", r: (t) => <>
    <B x={600} y={1050} h={790} t={t} expr="triste" bD={20} bI={20} mira={8} ladea={osc(t, 2, 3)} />
    <Lista t={t} x={1120} y={260} w={640} size={60} items={[{ txt: "SMALL", t0: 735.7 }, { txt: "FAST", t0: 736.9 }, { txt: "REPLACEABLE", t0: 738.6 }]} />
  </> },
  // ── v7 · trampa 7b: Roberts y el Swallow
  { t0: 757.38, t1: 767.38, c: ["#ffe0b0", "#5a2a2a"], set: "mar", r: (t) => <>
    <BarcoLejos x={1550} y={640} t={t} s={1 + prog(t, 761.4, 767.3) * 0.6} tipo="marina" />
    <Persona x={700} y={1060} h={880} t={t} seed={120} ropa={ROBERTS} expr={t > 764 ? "sorpresa" : "orgullo"} bD={t > 764 ? 120 : 40} cD={40} mira={t > 764 ? 8 : 0} />
    <Txt t={t} t0={757.5} t1={761.3} text="FEBRUARY 1722" y={130} size={110} color={C.crema} />
    <Txt t={t} t0={761.5} t1={767.3} text="HMS SWALLOW" y={130} size={120} color={C.rojo} />
  </> },
  { t0: 767.38, t1: 771.66, c: ["#fff0c0", "#8a5a3a"], set: "cubierta", r: (t) => <>
    {[0, 1, 2].map((i) => <Persona key={i} x={380 + i * 580} y={1060} h={780} t={t} seed={320 + i} ropa={PIRATA(i + 1)} expr={i === 1 ? "dormido" : "feliz"} flip={i === 2} inclina={osc(t, 1.3 + i * 0.3, 12)} ladea={osc(t, 1.7 + i, 8)} bD={i === 1 ? 20 : 150} cD={30} manoD={i !== 1 ? <g transform="scale(0.9)"><Botella c="#8a4a1a" txt="RUM" /></g> : undefined} />)}
    <Txt t={t} t0={767.5} t1={771.6} text="STILL DRUNK" y={130} size={120} color={C.oro} rot={osc(t, 2, 4)} />
  </> },
  { t0: 776.2, t1: 779.32, c: ["#c8d8e8", "#2a3a5a"], set: "mar", r: (t) => <>
    {[0, 1].map((i) => <Persona key={i} x={620 + i * 680} y={1060} h={820} t={t} seed={330 + i} ropa={PIRATA(i + 2)} expr="triste" flip={i === 1} bD={70} cD={110} miraY={6} />)}
    <Txt t={t} t0={776.3} t1={779.2} text="AS HE HAD WANTED" y={130} size={104} color={C.crema} />
  </> },
  // ── v7 · giro: Execution Dock, carreras cortas, el giro
  { t0: 789.3, t1: 797.9, c: ["#c8c8d0", "#4a4a5a"], set: "londres", r: (t) => <>
    <V><rect x={1500} y={300} width={22} height={620} fill="#3a2a1a" /><rect x={1380} y={300} width={260} height={20} fill="#3a2a1a" /><rect x={1380} y={760 - prog(t, 794.5, 797.8) * 120} width={600} height={400} fill="#4a6a80" opacity={0.85} /></V>
    {[0, 1, 2, 3].map((i) => <Persona key={i} x={180 + i * 330} y={1100} h={700} t={t} seed={340 + i} ropa={CIVIL(i)} expr={i % 2 ? "sorpresa" : "triste"} flip bD={i === 1 ? 150 : 20} cD={20} habla={i === 2} />)}
    <Txt t={t} t0={789.4} t1={794.4} text="EXECUTION DOCK" y={130} size={110} color={C.crema} />
    <Contador t={t} t0={794.5} t1={797.6} de={1} a={3} y={130} size={110} color={C.oro} post=" TIDES" />
  </> },
  { t0: 797.9, t1: 807.86, c: ["#fff0b0", "#8a5a2a"], set: "camarote", r: (t) => <>
    <Persona x={960} y={1060} h={860} t={t} seed={350} ropa={PIRATA(4)} expr={t > 805.9 ? "triste" : "feliz"} bD={150 - prog(t, 805.6, 806.4) * 130} cD={20} bI={150 - prog(t, 805.6, 806.4) * 130} cI={20} salta={en(t, 802.8, 805.9) ? Math.abs(Math.sin(t * 6)) * 12 : 0} ladea={osc(t, 0.8, 3)} inclina={prog(t, 805.9, 807.0) * 8} miraY={prog(t, 805.9, 806.8) * 8} />
    {en(t, 802.8, 805.9) && <V>{Array.from({ length: 10 }, (_, i) => <g key={i} transform={`translate(${400 + i * 120} ${(t - 802.8) * 400 + (i % 3) * 120 - 100})`}><Moneda8 r={36} oro t={t} gira={2} /></g>)}</V>}
    <Txt t={t} t0={798.0} t1={802.7} text="CAREER: 1-2 YEARS" y={130} size={100} color={C.crema} />
    <Txt t={t} t0={802.8} t1={805.8} text="RICH, SOMETIMES" y={130} size={104} color={C.oro} />
    <Txt t={t} t0={806.15} t1={807.8} text="NEVER OLD" y={130} size={120} color={C.rojo} />
    <Emote t={t} t0={806.0} tipo="lagrimas" x={1120} y={360} />
  </> },
  { t0: 807.86, t1: 813.2, c: ["#ffe0c0", "#5a2a5a"], set: "cubierta", r: (t) => <>
    <B x={960} y={1050} h={790} t={t} expr={t > 810.9 ? "sorpresa" : "neutro"} bD={t > 810.9 ? 150 : 60} cD={t > 810.9 ? 10 : 140} mira={osc(t, 1, 4)} />
    <Emote t={t} t0={808.2} t1={810.8} tipo="preg" x={1200} y={300} />
    <Txt t={t} t0={808.0} t1={810.8} text="A DEATH TRAP?" y={150} size={110} color={C.crema} />
    <Txt t={t} t0={810.9} t1={813.1} text="THE TWIST" y={150} size={130} color={C.oro} />
  </> },
  // ── v7 · giro: el Whydah se parte, no John King, el buzo y la campana, el hueso y el zapato
  { t0: 848.88, t1: 854.32, c: ["#8a9ab8", "#0a1020"], set: "mar", r: (t) => <>
    <Lluvia t={t} n={160} angulo={26} />
    <JOHNP x={960} y={1060} h={820} t={t} expr="miedo" bD={160} cD={10} bI={160} cI={10} ladea={osc(t, 3, 8)} inclina={osc(t, 1.2, 10)} />
    <Txt t={t} t0={849.0} t1={852.4} text="CAPE COD" y={130} size={120} color={C.crema} />
    <Txt t={t} t0={852.5} t1={854.2} text="THE SHIP BREAKS" y={130} size={110} color={C.rojo} />
  </> },
  { t0: 858.3, t1: 860.16, c: ["#a0b0c8", "#101828"], set: "mar", r: (t) => <>
    <JOHNP x={960} y={1060} h={780} t={t} expr="triste" bD={20} bI={20} opacity={1 - prog(t, 858.6, 860.1) * 0.8} />
    <Txt t={t} t0={858.4} t1={860.1} text="NOT JOHN KING" y={130} size={120} color={C.crema} />
  </> },
  { t0: 860.16, t1: 869.84, c: ["#2a8ab8", "#0a2a4a"], luz: [960, 240], r: (t) => <>
    <V><path d="M 0 960 Q 500 900 1000 950 T 1920 930 L 1920 1080 L 0 1080 Z" fill="#c9a86a" opacity={0.85} />
      <g transform={`translate(${interpolate(t, [860.2, 863], [-100, 520], { extrapolateRight: "clamp" })} 560) scale(2.4)`}><Buzo t={t} luz={1} /></g></V>
    <Campana x={1400} y={720} s={1.6} t={t} t0b={863.2} />
    <Txt t={t} t0={860.3} t1={863.0} text="1984" y={130} size={140} color={C.oro} />
    <Txt t={t} t0={866.5} t1={869.7} text="WHYDAH GALLY · 1716" y={130} size={96} color={C.crema} />
  </> },
  { t0: 869.84, t1: 873.94, c: ["#ffe8b0", "#6a4a2a"], set: "cubierta", r: (t) => <>
    <Campana x={1350} y={420} s={1.6} t={t} t0b={870.2} />
    <B x={760} y={1050} h={790} t={t} expr="neutro" bD={150 + osc(t, 4, 15)} cD={30} mira={8} miraY={-4} />
    <Txt t={t} t0={870.0} t1={873.8} text="EVERY HALF HOUR" y={150} size={104} color={C.oro} />
  </> },
  { t0: 873.94, t1: 890.16, c: ["#fff0c8", "#5a4a3a"], luz: [960, 300], set: "playa", r: (t) => <>
    {t < 885.1 ? <>
      <Persona x={560} y={1060} h={860} t={t} seed={360} ropa={{ ...CIVIL(2), tunica: "#c8a060", tunica2: "#8a6a3a" }} expr={t > 883.8 ? "sorpresa" : "neutro"} bD={80} cD={90} mira={8} miraY={4} />
      <V><g transform="translate(1400 800) scale(1.2)"><Concrecion rayos={prog(t, 878.4, 880)} t={t} /></g></V>
      <Lista t={t} x={1120} y={180} w={660} size={52} items={[{ txt: "A LEG BONE", t0: 878.5 }, { txt: "A SILK STOCKING", t0: 880.2 }, { txt: "A CHILD'S SHOE", t0: 882.0 }]} />
    </> : <>
      <JOHNP x={960} y={1060} h={860} t={t} expr="orgullo" bD={20} bI={20} ladea={osc(t, 1, 3)} />
      <Txt t={t} t0={885.2} t1={887.6} text="JOHN KING" y={130} size={130} color={C.oro} />
      <Txt t={t} t0={887.7} t1={890.1} text="YOUNGEST PIRATE WE KNOW" y={130} size={84} color={C.crema} />
    </>}
  </> },
  // ── v7 · cierre y CTA con el chico grande
  { t0: 890.16, t1: 903.62, c: ["#ffe8c0", "#6a3a4a"], set: "cubierta", r: (t) => <>
    <B x={600} y={1050} h={790} t={t} expr={t > 898.7 ? "triste" : "neutro"} bD={30} cD={60} mira={8} ladea={osc(t, 1.2, 3)} />
    <Lista t={t} x={1120} y={200} w={680} size={60} titulo="NO BOYS. BUT…" items={[{ txt: "FORCED", t0: 895.4 }, { txt: "FORGOTTEN", t0: 896.4 }, { txt: "SOLD BY POVERTY", t0: 897.4 }, { txt: "ONE BEGGED", t0: 899.0 }]} />
  </> },
  { t0: 907.98, t1: 921.6, c: ["#fff0c0", "#c8703a"], set: "cubierta", r: (t) => <>
    <B x={600} y={1050} h={800} t={t} expr={t > 917.7 ? "sorpresa" : "feliz"} bD={t < 912.2 ? 160 : 60} cD={t < 912.2 ? 10 : 100} habla salta={t < 912.2 ? Math.abs(Math.sin(t * 5)) * 12 : 0} />
    <Campana x={1500} y={420} s={1.4} t={t} t0b={909.5} />
    <Txt t={t} t0={908.1} t1={912.1} text="SUBSCRIBE + BELL" x={1250} y={150} size={96} color={C.oro} />
    <Txt t={t} t0={912.3} t1={917.6} text="NEXT: THE EXECUTIONER" x={1250} y={150} size={84} color={C.crema} />
    <Txt t={t} t0={917.8} t1={921.5} text="WHICH TRAP GOT YOU?" x={1250} y={150} size={88} color={C.oro} />
    <Trampas t={t} t0={917.8} n={7} x={1250} y={760} />
  </> },
  // v6 · trampa 4a: la lista de precios de John Phillips (1723)
  { t0: 385.08, t1: 394.6, c: ["#fff0c8", "#8a4a3a"], suelo: "#5a3418", luz: [700, 300], set: "camarote", r: (t) => <>
    <Persona x={500} y={1050} h={800} t={t} seed={47} ropa={{ ...CAPITAN, tunica: "#3a5a3a", tunica2: "#1d3a1d" }} expr="orgullo" bD={100} cD={20} habla />
    <Lista t={t} x={960} y={300} titulo="J. PHILLIPS · 1723" size={50} w={860} items={[{ txt: "NO STEALING", t0: 386.0 }, { txt: "NO DESERTING", t0: 387.0 }, { txt: "STRIKE A MAN = 39 LASHES", t0: 390.1 }]} />
    <Txt t={t} t0={385.2} t1={389.9} text="THE PRICE LIST" y={150} size={110} color={C.oro} />
  </> },
  // v6 · gancho: «the pay is a joke» — moneda chiquita
  { t0: 8.95, t1: 10.06, c: ["#fff0b0", "#c8803a"], suelo: "#6b3a1f", luz: [960, 380], set: "puerto", r: (t) => <>
    <Persona x={820} y={1040} h={760} t={t} seed={7} ropa={GRUMETE} expr="triste" bD={80} cD={70} mira={8} miraY={4} manoD={<g transform="scale(0.5)"><Moneda8 r={30} oro t={t} gira={1.5} /></g>} />
    <Txt t={t} t0={9.0} t1={10.0} text="THE PAY…" x={1400} y={420} size={120} color={C.oro} />
  </> },
  // v6 · trampa 1a: marineros comunes, el barco mercante era una cárcel
  { t0: 74.92, t1: 82.42, c: ["#d8e8ff", "#3a4a6a"], suelo: "#5a3418", luz: [960, 300], set: "bodega", r: (t) => <>
    {[0, 1, 2].map((i) => <Persona key={i} x={520 + i * 440} y={1030} h={640} t={t} seed={70 + i} ropa={PIRATA(i + 1)} expr={t > 78.6 ? "triste" : "neutro"} bD={t > 78.6 ? 100 : 15} cD={t > 78.6 ? 30 : 0} ladea={Math.sin(t * 2 + i) * 3} />)}
    <V>{t > 78.6 && Array.from({ length: 9 }, (_, i) => <rect key={i} x={160 + i * 200} y={-1080 + Math.min(1, (t - 78.6) * 3) * 1080} width={26} height={1000} rx={10} fill="#3a3a4a" />)}</V>
    <Txt t={t} t0={75.0} t1={78.5} text="ORDINARY SAILORS" y={170} size={110} color={C.crema} />
    <Txt t={t} t0={78.7} t1={82.3} text="A FLOATING PRISON" y={170} size={110} color={C.rojo} />
  </> },
  // v6 · trampa 1b: la tripulación mercante no iba a morir por el azúcar de otro
  { t0: 106.98, t1: 112.04, c: ["#fff0d0", "#6a8ab8"], suelo: "#8a4a20", luz: [700, 300], set: "puerto", r: (t) => <>
    <Persona x={700} y={1030} h={780} t={t} seed={75} ropa={PIRATA(2)} expr={t > 109.2 ? "enojado" : "neutro"} bD={70} bI={70} cD={110} cI={110} habla />
    <Bolsa x={1420} y={800} s={1.5} t={t} t0={107.3} txt="SUGAR" />
    <V>{t > 109.4 && <g transform="translate(1600 600)"><Signo k="cross" s={1.4} /></g>}</V>
    <Txt t={t} t0={109.4} t1={112.0} text="NOT WORTH DYING FOR" y={170} size={100} color={C.oro} />
  </> },
  // v6 · trampa 1b: «forgotten, or begging»
  { t0: 146.2, t1: 152.56, c: ["#ffe0c0", "#7a4a6a"], suelo: "#5a3418", luz: [960, 300], set: "cubierta", r: (t) => <>
    <Persona x={960} y={1050} h={760} t={t} seed={7} ropa={GRUMETE} expr="triste" bD={55} bI={55} cD={115} cI={115} miraY={-8} ladea={Math.sin(t * 3) * 3} habla />
    <Txt t={t} t0={147.4} t1={150.5} text="BEGGING" y={170} size={150} color={C.oro} />
    <Txt t={t} t0={150.6} t1={152.5} text="REMEMBER IT" y={170} size={120} color={C.crema} />
    <Emote t={t} t0={150.7} tipo="excl" x={1240} y={360} />
  </> },
  // v6 · trampa 2b: vértigo arriba del mástil; abajo está la cubierta, no el agua
  { t0: 238.64, t1: 243.78, c: ["#d8f0ff", "#4a8ac8"], luz: [960, 200], r: (t) => <>
    <V>
      <rect x={1180} y={0} width={70} height={1080} fill="#8a4520" />
      <path d="M 1215 380 L 1215 960" stroke="#fff" strokeWidth={10} strokeDasharray="30 20" />
      <path d="M 1185 950 L 1215 1010 L 1245 950" fill="#fff" />
      <rect x={1000} y={1000} width={500} height={80} fill="#8a4520" />
    </V>
    <Persona x={900} y={760} h={620} t={t} seed={7} ropa={GRUMETE} expr="miedo" bD={80} cD={10} mira={10} miraY={14} ladea={Math.sin(t * 9) * 4} />
    <Emote t={t} t0={239.0} tipo="sudor" x={900} y={330} />
    <Txt t={t} t0={238.8} t1={241.5} text="30 M" x={1500} y={520} size={130} color={C.crema} />
    <Txt t={t} t0={241.6} t1={243.7} text="DECK, NOT WATER" y={150} size={110} color={C.rojo} />
  </> },
  // v6 · trampa 3b: hacerse útil para no ser «another mouth»
  { t0: 360.48, t1: 366.2, c: ["#fff0c0", "#b87a3a"], suelo: "#6b3a1f", luz: [960, 300], set: "cubierta", r: (t) => <>
    <Persona x={420} y={1040} h={700} t={t} seed={81} ropa={PIRATA(4)} expr="enojado" bD={35} bI={35} cD={135} cI={135} />
    <Persona x={1500} y={1040} h={700} t={t} seed={82} ropa={PIRATA(1)} expr="enojado" flip bD={35} bI={35} cD={135} cI={135} />
    <Persona x={960} y={1050} h={560} t={t} seed={7} ropa={GRUMETE} expr={t > 363 ? "miedo" : "neutro"} bD={60 + Math.sin(t * 10) * 30} cD={60} inclina={14} />
    <Txt t={t} t0={360.6} t1={362.9} text="USEFUL. VERY USEFUL." y={170} size={100} color={C.lima} />
    <Txt t={t} t0={363.0} t1={366.1} text="JUST ANOTHER MOUTH?" y={170} size={100} color={C.rojo} />
  </> },
  // v6 · trampa 5a: el biscuit rompe un diente
  { t0: 476.06, t1: 483.46, c: ["#fff2c0", "#c8803a"], suelo: "#6b3a1f", luz: [960, 340], set: "bodega", r: (t) => <>
    <Persona x={860} y={1050} h={780} t={t} seed={7} ropa={GRUMETE} expr={t > 480.6 ? "miedo" : t > 479 ? "enojado" : "neutro"} bD={120} cD={110} ladea={en(t, 479, 480.6) ? Math.sin(t * 30) * 3 : 0}
      manoD={<g transform="scale(0.55)"><Galleta t={t} /></g>} />
    <V>{t > 480.6 && <g transform={`translate(${900 + (t - 480.6) * 500} ${380 - Math.sin(Math.min(1, (t - 480.6) * 1.4) * Math.PI) * 220 + Math.max(0, t - 481.3) * 600}) rotate(${(t - 480.6) * 400}) scale(1.6)`}><Diente /></g>}</V>
    <Txt t={t} t0={476.2} t1={480.0} text="HARD FOR MONTHS" y={170} size={100} color={C.crema} />
    <Txt t={t} t0={480.6} t1={483.4} text="CRACK!" x={1400} y={300} size={150} color={C.rojo} />
  </> },
  // v6 · trampa 5b: piratas que asaltan seguido
  { t0: 527.92, t1: 530.14, c: ["#fff4c0", "#e0903a"], suelo: "#8a4a20", luz: [960, 300], set: "playa", r: (t) => <>
    {[0, 1, 2].map((i) => <Persona key={i} x={500 + i * 460} y={1040} h={660} t={t} seed={90 + i} ropa={PIRATA(i + 2)} expr="feliz" bD={150} bI={150} cD={30} cI={30} salta={Math.abs(Math.sin(t * 7 + i)) * 20} habla={i === 1} />)}
    <Txt t={t} t0={528.0} t1={530.1} text="RAID!" y={170} size={150} color={C.oro} />
  </> },
  // v6 · trampa 5b: la sentina, justo debajo
  { t0: 567.58, t1: 571.54, c: ["#c8d8a0", "#2a3a2a"], suelo: "#3a2a1a", luz: [960, 300], set: "bodega", r: (t) => <>
    <Persona x={760} y={1040} h={760} t={t} seed={7} ropa={GRUMETE} expr="enojado" bD={150} cD={150} ladea={Math.sin(t * 4) * 3} />
    <V><g transform="translate(1350 880) scale(1.6)"><Balde t={t} agua="#5a8a3a" peste /></g><g transform="translate(1300 560)"><Nube t={t} t0={567.7} r={170} /></g></V>
    <Txt t={t} t0={567.7} t1={571.5} text="THE BILGE" y={170} size={130} color={C.lima} />
  </> },
  // v6 · trampa 6: no sables, no cañones: la enfermedad
  { t0: 577.26, t1: 581.32, c: ["#e8f8c0", "#3a5a2a"], suelo: "#5a3418", luz: [960, 300], set: "bodega", r: (t) => <>
    <V><g transform={`translate(960 430) scale(${2.2 + Math.sin(t * 3) * 0.1})`} opacity={prog(t, 579.5, 580.2)}><Microbio t={t} s={1.6} /></g></V>
    <V>
      <g transform="translate(330 560) rotate(-30) scale(1.4)"><Sable /></g>{t > 577.8 && <g transform="translate(330 560)"><Signo k="cross" s={1.5} /></g>}
      {t > 578.8 && <g transform="translate(1600 560)"><Signo k="cross" s={1.5} /></g>}
    </V>
    <V><Canon x={1600} y={700} s={1.6} t={t} /></V>
    <Persona x={960} y={1050} h={640} t={t} seed={7} ropa={GRUMETE} expr={t > 579.8 ? "miedo" : "neutro"} mira={t > 579.8 ? -10 : 0} miraY={t > 579.8 ? -10 : 0} bD={20} />
    <Txt t={t} t0={579.6} t1={581.2} text="DISEASE" y={170} size={150} color={C.lima} />
  </> },
  // v6 · trampa 6b: el seguro pirata, $800 por un miembro
  { t0: 646.12, t1: 653.34, c: ["#fff0b0", "#b87a2a"], suelo: "#6b3a1f", luz: [960, 300], set: "camarote", r: (t) => <>
    <Persona x={700} y={1040} h={800} t={t} seed={95} ropa={PIRATA(3)} expr={t > 649 ? "feliz" : "triste"} bD={10} bI={t > 649 ? 150 : 10} cI={20} />
    <Bolsa x={1380} y={760} s={1.6} t={t} t0={647.5} txt="$" />
    <Contador t={t} t0={648.0} t1={651.0} de={0} a={800} x={1380} y={380} size={160} color={C.oro} pre="$" />
    <Txt t={t} t0={646.2} t1={647.9} text="PIRATE INSURANCE" y={150} size={100} color={C.crema} />
  </> },
  // v6 · trampa 7a: abordaje colgado de la soga
  { t0: 703.53, t1: 707.52, c: ["#ffe0b0", "#4a6a9a"], luz: [960, 300], r: (t) => {
    const u = prog(t, 703.6, 706.2); const a = -55 + u * 110; const R = 600;
    const hx = 960 + Math.sin((a * Math.PI) / 180) * R, hy = -60 + Math.cos((a * Math.PI) / 180) * R;
    return <>
      <V><path d={`M 960 -60 L ${hx} ${hy}`} stroke="#c9a06a" strokeWidth={12} /><path d="M 0 900 Q 960 860 1920 900 L 1920 1080 L 0 1080 Z" fill="#2a8ab8" /></V>
      <Persona x={hx} y={hy + 640} h={680} t={t} seed={44} ropa={PIRATA(4)} expr="enojado" habla bD={175} cD={0} bI={120} manoI={<g transform="rotate(-80)"><Sable /></g>} inclina={-a * 0.4} />
      <Txt t={t} t0={703.7} t1={707.4} text="SWING ACROSS!" y={170} size={120} color={C.oro} />
    </>;
  } },
  // v6 · giro: John King quiere unirse
  { t0: 829.9, t1: 842.34, c: ["#ffe9c0", "#3a5a8a"], suelo: "#5a3418", luz: [700, 300], set: "puerto", r: (t) => <>
    <Persona x={1450} y={1040} h={760} t={t} seed={331} ropa={MADRE} expr={t > 839.9 ? "miedo" : "triste"} flip bD={t > 839.9 ? 160 : 40} bI={t > 839.9 ? 160 : 40} cD={140} cI={140} />
    <Persona x={680} y={1050} h={620} t={t} seed={330} ropa={JOHN} expr={t > 834.4 ? "enojado" : t > 832.8 ? "feliz" : "sorpresa"} bD={t > 832.8 ? 165 : 30} bI={t > 834.4 ? 40 : 30} cD={0} habla={t > 832.8} salta={en(t, 832.8, 834.4) ? Math.abs(Math.sin(t * 9)) * 22 : 0} />
    <Txt t={t} t0={830.0} t1={832.7} text="AGE 8 TO 11" y={170} size={110} color={C.crema} />
    <Txt t={t} t0={832.8} t1={842.2} text="I WANT TO JOIN!" y={170} size={120} color={C.oro} />
  </> },
  // v6 · CTA: «except the one who did»
  { t0: 903.62, t1: 907.98, c: ["#ffe9b0", "#2a3a5a"], luz: [1300, 400], set: "playa", r: (t) => <>
    <Persona x={620} y={1050} h={760} t={t} seed={330} ropa={JOHN} expr="orgullo" bD={20} cD={10} />
    <V><g transform="translate(1340 640) scale(2.2)"><Zapato brillo={prog(t, 906.4, 907)} t={t} /></g></V>
    <Txt t={t} t0={906.58} t1={907.9} text="EXCEPT THE ONE WHO DID" y={170} size={100} color={C.oro} />
  </> },
  // trampa 1: a los oficios los forzaban a venir, «politely, with a pistol nearby»
  { t0: 127.98, t1: 133.44, c: ["#fff0c0", "#d88a3a"], suelo: "#6b3a1f", luz: [700, 300], set: "puerto", r: (t) => <>
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
      <rect width={1920} height={1080} fill="#fff" opacity={t > 846.6 && t < 847.4 ? 0.22 * (1 - (t - 846.6) / 0.8) : 0} />
    </V>
    <Persona x={760} y={1040} h={720} t={t} seed={330} ropa={JOHN} expr="miedo" bD={95} bI={95} cD={20} cI={20} ladea={Math.sin(t * 7) * 6} inclina={Math.sin(t * 1.6) * 6} />
    <Txt t={t} t0={843.7} t1={848.8} text="APRIL 1717" y={160} size={140} color={C.crema} />
  </> },
  // gancho: «you are the cabin boy» — el chico grande, el capitán lo señala
  { t0: 6.9, t1: 8.95, c: ["#ffe3a0", "#e07a3a"], suelo: "#8a4a20", luz: [700, 380], set: "cubierta", r: (t) => <>
    <Persona x={1450} y={1010} h={760} t={t} seed={11} ropa={CAPITAN} expr="orgullo" flip bD={95} cD={0} habla />
    <Persona x={620} y={1010} h={620} t={t} seed={7} ropa={GRUMETE} expr={t > 7.6 ? "miedo" : "sorpresa"} bD={20} bI={20} salta={t < 7.4 ? Math.abs(Math.sin(t * 8)) * 16 : 0} />
  </> },
  // premisa: el buzo encuentra el zapato
  { t0: 26.3, t1: 32.14, c: ["#2a8ab8", "#0a2a4a"], luz: [1200, 300], r: (t) => <>
    <V>
      <path d="M 0 960 Q 500 900 1000 950 T 1920 930 L 1920 1080 L 0 1080 Z" fill="#c9a86a" opacity={0.85} />
      <g transform={`translate(${interpolate(t, [26.3, 30], [-200, 420], { extrapolateRight: "clamp" })} 560) scale(2.0)`}><Buzo t={t} luz={prog(t, 28.5, 29.5)} /></g>
      <g transform={`translate(1350 ${900 - prog(t, 31.8, 32.4) * 40}) scale(${1.6 + prog(t, 31.8, 32.3) * 0.5})`}><Zapato brillo={prog(t, 32.1, 32.6)} t={t} /></g>
      {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={300 + i * 160} cy={1000 - ((t * 90 + i * 130) % 1000)} r={8 + (i % 3) * 5} fill="#bfefff" opacity={0.4} />)}
    </V>
      </> },
  // trampa 1: el capitán corta sueldo y comida y pega con la soga
  { t0: 84.7, t1: 89.5, c: ["#ffd9a0", "#b8452a"], suelo: "#6b3a1f", luz: [960, 300], set: "camarote", r: (t) => <>
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
  { t0: 99.8, t1: 103.0, c: ["#bfe6ff", "#4a8ac8"], luz: [1300, 200], set: "cubierta", r: (t) => <>
    <V><g transform="translate(1200 950)"><Bandera t={t} sube={prog(t, 100.4, 102.0)} /></g></V>
    <Persona x={480} y={1060} h={700} t={t} seed={7} ropa={GRUMETE} expr={t > 101.6 ? "miedo" : "sorpresa"} mira={6} miraY={-6} bD={t > 101.6 ? 150 : 15} cD={t > 101.6 ? 130 : 0} />
    {t > 101.6 && <Emote t={t} t0={101.6} tipo="excl" x={480} y={520} />}
  </> },
  // trampa 2: el reloj de arena y la campana
  { t0: 183.8, t1: 188.16, c: ["#ffe9b0", "#c87a2a"], suelo: "#6b3a1f", luz: [960, 400], set: "camarote", r: (t) => <>
    <Persona x={760} y={1010} h={640} t={t} seed={7} ropa={GRUMETE} expr={t > 186.4 ? "dormido" : "neutro"} bD={en(t, 184.4, 185.6) ? 100 : t > 186.4 && t < 187.3 ? 140 : 30} cD={60} habla={false} />
    <V>
      <g transform={`translate(${960 + 180} 560)`}><Reloj gira={prog(t, 184.6, 185.4)} t={t} /></g>
    </V>
    <Campana x={1560} y={460} s={1.5} t={t} t0b={186.6} />
    {t > 186.6 && t < 187.4 && <Txt t={t} t0={186.6} t1={187.3} text="DING!" x={1560} y={220} size={90} color={C.oro} />}
    <Txt t={t} t0={184.0} t1={186.4} text="½ HOUR" x={1140} y={200} size={100} color={C.crema} />
  </> },
  // trampa 2: «guess who got flogged?»
  { t0: 196.72, t1: 200.3, c: ["#ffc0a0", "#8a1d2a"], luz: [700, 400], set: "camarote", r: (t) => <>
    <Persona x={700} y={1060} h={760} t={t} seed={7} ropa={GRUMETE} expr="miedo" mira={10} bD={140} bI={140} cD={130} cI={130} ladea={Math.sin(t * 18) * 3} />
    <Emote t={t} t0={197.0} tipo="sudor" x={700} y={440} />
    <V><g transform={`translate(${interpolate(t, [196.8, 197.6], [2200, 1500], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) })} 400) rotate(-30) scale(1.4)`}><Gato9 t={t} latigo={198.6} /></g></V>
    <Txt t={t} t0={197.4} t1={199.6} text="YOU." x={1380} y={860} size={150} color={C.rojo} />
  </> },
  // trampa 3: las peleas se arreglan en tierra, con sable y pistola
  { t0: 304.1, t1: 308.3, c: ["#fff0c0", "#e0a050"], suelo: "#d8b878", luz: [960, 300], set: "playa", r: (t) => <>
    <Persona x={560} y={1020} h={720} t={t} seed={31} ropa={PIRATA(1)} expr="enojado" bD={95} cD={10} manoD={<g transform="rotate(-80) scale(1.1)"><Sable /></g>} />
    <Persona x={1360} y={1020} h={720} t={t} seed={33} ropa={PIRATA(3)} expr="enojado" flip bD={90} cD={0} manoD={<g transform="rotate(-90) scale(1.1)"><Pistola t={t} /></g>} />
    <Txt t={t} t0={304.3} t1={308.2} text="ON SHORE" y={170} size={120} color={C.oro} />
  </> },
  // trampa 3: «the next port» — el intendente lo baja del barco
  { t0: 366.2, t1: 370.1, c: ["#ffe0b0", "#6a8ab8"], suelo: "#b89a6a", luz: [1500, 300], set: "puerto", r: (t) => <>
    <Ciudad x={1560} y={760} s={0.8} t={t} nombre="PORT" />
    <Persona x={980} y={1040} h={800} t={t} seed={40} ropa={QM} expr="enojado" flip={false} bD={100} cD={0} habla />
    <Persona x={420} y={1040} h={560} t={t} seed={7} ropa={GRUMETE} expr="triste" bD={10} bI={10} />
    <Emote t={t} t0={367.0} tipo="lagrimas" x={420} y={600} />
  </> },
  // trampa 4: «40 lashes minus one» — la espalda y el conteo
  { t0: 394.6, t1: 398.3, c: ["#ffd0a0", "#7a1d2a"], luz: [960, 400], set: "camarote", r: (t) => <>
    <Persona x={760} y={1060} h={780} t={t} seed={45} ropa={PIRATA(2)} expr="miedo" flip bD={170} bI={170} cD={20} cI={20} ladea={Math.sin(t * 22) * 2} />
    <V>{Array.from({ length: 6 }, (_, i) => t > 395.2 + i * 0.4 && <path key={i} d={`M ${640 + i * 6} ${560 + i * 40} L ${880 + i * 4} ${620 + i * 40}`} stroke={C.rojo} strokeWidth={10} strokeLinecap="round" />)}</V>
    <Contador t={t} t0={395.0} t1={397.6} de={1} a={39} x={1450} y={540} size={240} color={C.rojo} />
    <Txt t={t} t0={394.7} t1={398.2} text="40 − 1" x={1450} y={300} size={110} color={C.crema} />
  </> },
  // trampa 4: los chicos de la marina, boca abajo sobre un cañón
  { t0: 432.54, t1: 438.9, c: ["#ffe0c0", "#3a4a6a"], suelo: "#6b3a1f", luz: [960, 300], set: "cubierta", r: (t) => <>
    <V><Canon x={900} y={900} s={2.2} t={t} /></V>
    <Persona x={900} y={760} h={520} t={t} seed={7} ropa={GRUMETE} expr="miedo" inclina={-75} bD={150} bI={150} />
    <Persona x={1520} y={1040} h={760} t={t} seed={46} ropa={PIRATA(4)} expr="enojado" flip bD={en(t, 434.5, 438.9) ? 170 - Math.max(0, Math.sin((t - 434.5) * 4)) * 90 : 150} cD={20}
      manoD={<rect x={-8} y={0} width={16} height={260} rx={6} fill="#8a4520" />} />
    <Txt t={t} t0={436.2} t1={438.5} text="KISSING THE GUNNER'S DAUGHTER" y={170} size={78} color={C.oro} />
  </> },
  // trampa 5: semana buena / semana mala
  { t0: 530.14, t1: 538.76, c: ["#fff2b0", "#5ab85a"], suelo: "#8a4a20", luz: [480, 300], set: "playa", r: (t) => <>
    <Persona x={480} y={1020} h={700} t={t} seed={50} ropa={PIRATA(2)} expr="feliz" bD={110 + osc(t, 1.3, 18)} cD={60} ladea={osc(t, 0.9, 4)} salta={Math.abs(Math.sin(t * 3)) * 8} habla />
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
  { t0: 610.46, t1: 614.98, c: ["#e0f0b0", "#4a6a3a"], suelo: "#6b3a1f", luz: [960, 300], set: "bodega", r: (t) => <>
    {[0, 1, 2].map((i) => <Persona key={i} x={480 + i * 480} y={1020} h={640} t={t} seed={60 + i} ropa={PIRATA(i + 1)} expr={t > 611.6 + i * 1.1 ? "dormido" : "triste"} inclina={(i % 2 ? 1 : -1) * cae(t, 611.6 + i * 1.1)} bD={30} bI={30} />)}
    <V>{Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${300 + i * 220 + Math.sin(t * 2 + i) * 30} ${300 + Math.cos(t * 1.7 + i) * 60})`}><Microbio t={t + i} s={0.9} /></g>)}</V>
    <Contador t={t} t0={611.4} t1={614.4} de={3} a={0} x={960} y={170} size={130} color={C.rojo} post=" STANDING" />
  </> },
  // trampa 6: Barbanegra pide medicina, no oro
  { t0: 622.62, t1: 628.08, c: ["#ffe0a0", "#2a3a5a"], suelo: "#5a3418", luz: [1300, 300], set: "camarote", r: (t) => <>
    <Persona x={560} y={1050} h={860} t={t} seed={270} ropa={BARBANEGRA} expr="enojado" habla bD={100} cD={0} />
    <V>
      <g transform="translate(1380 820) scale(1.5)"><Cofre t={t} abre={prog(t, 626.5, 627.2)} txt="✚" color="#c81d2e" brillo /></g>
      <text x={1180} y={260} fontFamily={fontFamily} fontSize={84} fontWeight={700} fill={C.oro} stroke={TINTA} strokeWidth={16} paintOrder="stroke">GOLD</text>
      {t > 624.0 && <g transform="translate(1100 236)"><Signo k="cross" s={1.1} /></g>}
      {t > 626.5 && <><text x={1180} y={400} fontFamily={fontFamily} fontSize={84} fontWeight={700} fill={C.lima} stroke={TINTA} strokeWidth={16} paintOrder="stroke">MEDICINE</text><g transform="translate(1100 376)"><Signo k="check" s={1.1} /></g></>}
    </V>
  </> },
  // trampa 7: la bandera era un mensaje: rendite y vivís / resistí y no hay piedad
  { t0: 680.44, t1: 691.72, c: ["#e0f4ff", "#5a9ac8"], suelo: "#8a4a20", luz: [480, 300], set: "cubierta", r: (t) => <>
    <Persona x={480} y={1020} h={720} t={t} seed={80} ropa={CAP_MERC} expr="miedo" bD={170} bI={170} cD={10} cI={10} />
    <V><g transform="translate(760 330)">{t > 681.5 && <Signo k="check" s={1.4} />}</g></V>
    <Txt t={t} t0={680.6} t1={686.8} text="SURRENDER" x={480} y={170} size={100} color={C.lima} />
    <Mitad t={t} t0={684.34} c={["#ffb0a0", "#5a1020"]}>
      <Persona x={1440} y={1020} h={720} t={t} seed={80} ropa={CAP_MERC} expr="enojado" flip bD={130} cD={20} manoD={<g transform="rotate(-60) scale(1.1)"><Sable /></g>} />
      <Craneo x={1700} y={420} s={1.2} t={t} t0={685.4} />
      <Txt t={t} t0={684.4} t1={686.8} text="RESIST" x={1440} y={170} size={100} color={C.rojo} />
    </Mitad>
    <Txt t={t} t0={687.0} t1={691.6} text="MOST SURRENDERED" y={170} size={110} color={C.oro} />
  </> },
  // trampa 7: muere Roberts
  { t0: 771.66, t1: 776.2, c: ["#ffd0a0", "#3a2030"], suelo: "#5a3418", luz: [960, 320], set: "cubierta", r: (t) => <>
    <Persona x={960} y={1040} h={840} t={t} seed={265} ropa={ROBERTS} expr={t > 772.0 ? "sorpresa" : "enojado"} bD={t > 772.0 ? 160 : 40} cD={t > 772.0 ? 150 : 10} inclina={-cae(t, 774.4) * 0.9} />
    <V>{t > 771.8 && Array.from({ length: 9 }, (_, i) => { const k = Math.min(1, (t - 771.8) * 4); return <circle key={i} cx={1920 - k * (900 - i * 12) + (i % 3) * 20} cy={420 + (i % 4) * 22} r={14} fill="#3a3a4a" />; })}</V>
    <Txt t={t} t0={772.4} t1={776.1} text="GRAPE SHOT" y={170} size={120} color={C.rojo} />
  </> },
  // trampa 7: Cape Coast Castle, 52 colgados (no Londres)
  { t0: 779.32, t1: 789.3, c: ["#fff0c0", "#c8803a"], suelo: "#c8a870", luz: [960, 200], set: "puerto", r: (t) => <>
    <Fuerte x={960} y={470} s={1.1} t={t} piedra />
    {[0, 1, 2, 3, 4].map((i) => <Persona key={i} x={300 + i * 330} y={1040} h={520} t={t} seed={90 + i} ropa={PIRATA(i)} expr="triste" bD={15} bI={15} cD={60} cI={60} />)}
    <V><path d={`M 240 ${830} L 1680 830`} stroke="#5a5a6a" strokeWidth={10} strokeDasharray="22 10" /></V>
    <Txt t={t} t0={779.4} t1={782.8} text="THE REST OF THE CREW" y={150} size={100} color={C.crema} />
    <Txt t={t} t0={783.2} t1={787.6} text="CAPE COAST CASTLE" y={150} size={100} color={C.crema} />
    <Txt t={t} t0={787.7} t1={789.2} text="52 HANGED" y={150} size={150} color={C.rojo} />
  </> },
  // giro: Black Sam Bellamy, grande y reconocible
  { t0: 819.7, t1: 822.4, c: ["#ffe9b0", "#2a3a5a"], suelo: "#5a3418", luz: [1100, 300], set: "camarote", r: (t) => <>
    <Persona x={1100} y={1050} h={760} t={t} seed={320} ropa={BELLAMY} expr="orgullo" flip bD={60} cD={60} habla />
    <Txt t={t} t0={819.8} t1={822.3} text="BLACK SAM BELLAMY" x={960} y={130} size={110} color={C.oro} />
  </> },
  // 140 a bordo, 2 vivos
  { t0: 854.32, t1: 858.3, c: ["#5a6a9a", "#0e1424"], luz: [960, 200], r: (t) => <>
    <V>{Array.from({ length: 70 }, (_, i) => { const r = (i * 37) % 100; const vivo = i === 20 || i === 49; const off = t > 855.4 + (r / 100) * 2.4 && !vivo; return <g key={i} transform={`translate(${260 + (i % 14) * 100} ${420 + Math.floor(i / 14) * 110})`} opacity={off ? 0.12 : 1}><circle r={26} cy={-40} fill={vivo ? C.oro : "#e8d8c0"} /><rect x={-24} y={-14} width={48} height={60} rx={14} fill={vivo ? C.oro : "#e8d8c0"} /></g>; })}</V>
    <Contador t={t} t0={855.0} t1={857.8} de={140} a={2} x={960} y={190} size={170} color={C.crema} post=" ALIVE" />
  </> },
  // «today, you are going to sail»: el chico listo para zarpar
  { t0: 39.4, t1: 41.5, c: ["#d8f0ff", "#4a8ac8"], suelo: "#8a4a20", luz: [960, 300], set: "puerto", r: (t) => <>
    <Persona x={960} y={1040} h={760} t={t} seed={7} ropa={GRUMETE} expr="feliz" bD={160} cD={20} salta={Math.abs(Math.sin(t * 6)) * 18} habla />
    <Txt t={t} t0={39.5} t1={41.4} text="SET SAIL" y={170} size={130} color={C.oro} />
  </> },
];

const UNO: React.FC<{ t: number; p: Pl; k: number }> = ({ t, p, k }) => {
  const pop = interpolate(t, [p.t0, p.t0 + 0.22], [1.07, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ transform: `scale(${pop})`, overflow: "hidden" }}>
      <Fondo t={t} c={p.c} suelo={p.suelo} luz={p.luz ?? [960, 300]} id={`pl${k}`} />
      {p.set && <SetV k={p.set} t={t} />}
      {p.r(t)}
    </AbsoluteFill>
  );
};

export const Planos: React.FC<{ t: number }> = ({ t }) => (
  <>{PLANOS.map((p, k) => (en(t, p.t0, p.t1) ? <UNO key={k} t={t} p={p} k={k} /> : null))}</>
);
