import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { rnd } from "../soot/lib";
import { Persona, APION, CIVIL } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cam, Chip, Grande, Emote, cabeza, Zzz, Estrellas, Astro } from "./kit";
import { Borda, Apion, Sala } from "./actor";
import { Galera, Corte, Remero, Remo, Cojin, Correa, Galleta, Anfora, Pancarta, CuentaN, Flecha, Playa, Nubes, Salpica } from "./mar";

// soot02 · trampa 2, EL BANCO (211,74-341,36 s). Subimos a bordo: el barco por fuera → cuántos son → atravesamos el casco
// al corte de 3 pisos → arriba la luz, abajo vos → la manga de cuero → la sentina → el chiste de Aristófanes → el cojín
// → la marcha de Tucídides → de noche no hay lugar → la playa → «acordate de esto».
const pp = (h: number, cy: number) => cy + 450 * (h / 560);
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const HX = 800, HY = 734; // cara del héroe en el Corte

// puntitos de gente que llenan un rectángulo (los 400 a bordo)
const Gentio: React.FC<{ t: number; grupos: { n: number; color: string; t0: number }[]; x: number; y: number; w: number; cols: number }> = ({ t, grupos, x, y, w, cols }) => {
  let i = 0;
  const paso = w / cols;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
      {grupos.map((g, gi) => Array.from({ length: g.n }, (_, k) => {
        const idx = i++;
        const td = g.t0 + (k / g.n) * 0.9;
        if (t < td) return null;
        const e = Math.min(1, (t - td) * 6);
        const cx = x + (idx % cols) * paso + paso / 2, cy = y + Math.floor(idx / cols) * paso + paso / 2;
        return <g key={gi + "-" + k} transform={`translate(${cx} ${cy}) scale(${e})`}><circle cy={-paso * 0.18} r={paso * 0.2} fill={["#f2b48a", "#c98b62", "#8d5a3b"][idx % 3]} /><rect x={-paso * 0.22} y={-paso * 0.02} width={paso * 0.44} height={paso * 0.32} rx={paso * 0.12} fill={g.color} /></g>;
      }))}
    </svg>
  );
};
// la tronera de abajo, de cerca: adentro madera, afuera el mar, la manga de cuero alrededor del remo
const Tronera: React.FC<{ t: number; fuga: number }> = ({ t, fuga }) => {
  const nivel = 470 + Math.sin(t * 1.7) * 26 + Math.sin(t * 3.1) * 10;
  const k = Math.sin(t * 0.55 * Math.PI * 2);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, #5a3018 0%, #7a4520 58%)" }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {Array.from({ length: 22 }, (_, i) => <line key={i} x1={0} y1={i * 52} x2={1180} y2={i * 52} stroke="#2a1408" strokeOpacity={0.3} strokeWidth={4} />)}
        {/* afuera: el casco cortado y el mar */}
        <rect x={1180} y={0} width={740} height={1080} fill="#8fd0f2" />
        <path d={`M 1180 ${nivel} ${Array.from({ length: 20 }, (_, i) => `L ${1180 + i * 40} ${nivel + Math.sin(i * 0.7 + t * 3) * 14}`).join(" ")} L 1920 ${nivel} L 1920 1080 L 1180 1080 Z`} fill="#1f5c9c" />
        <rect x={1150} y={0} width={70} height={1080} fill="#4a2410" />
        {/* línea de flotación marcada */}
        <line x1={1100} y1={470} x2={1920} y2={470} stroke="#fff" strokeWidth={6} strokeDasharray="22 16" opacity={0.8} />
        {/* la tronera con su manga de cuero */}
        <g transform={`translate(1185 ${560 + k * 10})`}>
          <ellipse cx={0} cy={0} rx={70} ry={86} fill="#2a1408" />
          <path d={`M -10 -70 Q -130 -50 -170 ${-6 + k * 8} Q -130 50 -10 70 Z`} fill="#8a4a22" stroke="#5a2a10" strokeWidth={8} />
          {[-40, -80, -120].map((xx) => <path key={xx} d={`M ${xx} -48 Q ${xx - 10} 0 ${xx} 48`} stroke="#5a2a10" strokeWidth={5} fill="none" />)}
          <rect x={-140} y={-46} width={44} height={92} rx={10} fill="none" stroke="#c9a46a" strokeWidth={10} />
        </g>
        {/* el remo atraviesa */}
        <line x1={420} y1={640 + k * 60} x2={1900} y2={500 - k * 50} stroke="#d8a868" strokeWidth={34} strokeLinecap="round" />
        {/* gotas que se filtran */}
        {fuga > 0 && Array.from({ length: 10 }, (_, i) => { const u = ((t * 1.4 + i * 0.13) % 1); return <path key={i} transform={`translate(${1060 - i * 8} ${600 + u * 420})`} d="M 0 -16 Q 10 0 0 8 Q -10 0 0 -16 Z" fill="#7fd6ff" opacity={fuga * (1 - u)} />; })}
      </svg>
    </AbsoluteFill>
  );
};
// pileta olímpica (50 m) bajo el barco (40 m)
const Pileta: React.FC<{ t: number; t0: number; x: number; y: number; w: number }> = ({ t, t0, x, y, w }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", transform: `scaleY(${e})`, transformOrigin: "0 0" }} width={w} height={150}>
      <rect x={0} y={0} width={w} height={130} rx={10} fill="#5fc8ef" stroke="#fff" strokeWidth={10} />
      {[1, 2, 3, 4].map((i) => <line key={i} x1={10} y1={i * 26} x2={w - 10} y2={i * 26} stroke="#fff" strokeWidth={5} strokeDasharray="14 10" />)}
    </svg>
  );
};
// nubecita verde (para el chiste de Aristófanes)
const Nubecita: React.FC<{ t: number; t0: number; x1: number; y1: number; x2: number; y2: number }> = ({ t, t0, x1, y1, x2, y2 }) => {
  if (t < t0) return null;
  const u = prog(t, t0, t0 + 0.9);
  const x = x1 + (x2 - x1) * u, y = y1 + (y2 - y1) * u;
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={x + Math.cos(i * 1.3 + t * 2) * 50 * (0.4 + u)} cy={y + Math.sin(i * 1.7 + t * 2) * 34 * (0.4 + u)} r={(30 + i * 6) * (0.5 + u)} fill="#9bd05a" opacity={0.55 * (1 - prog(t, t0 + 1.6, t0 + 2.4))} />)}
      {[0, 1, 2].map((i) => <path key={"l" + i} d={`M ${x - 60 + i * 60} ${y - 70 - u * 40} q 14 -20 0 -40 q -14 -20 0 -40`} stroke="#6aa83a" strokeWidth={6} fill="none" opacity={0.7 * u} />)}
    </svg>
  );
};

export const P2: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 211,74 · TRAP #2 · THE BENCH */}
    <Escena t={t} t0={211.74} t1={214.4} entra="atraviesa" ix={960} iy={520} sale="nada" fondo="none" golpes={[212.1, 213.1]}>
      <Galera x={interpolate(t, [211.7, 214.6], [500, 780])} y={720} s={0.5} t={t} boga={0.6} vela />
      <Pancarta t={t} t0={211.8} n={2} titulo="THE BENCH" y={400} />
      <Apion t={t} t0={211.9} x={1620} y={1050} h={420} borda={1020} acts={[[211.9, "habla"], [213.1, "piensa"]]} />
    </Escena>

    {/* 214,4 · "Let's go aboard. The quinquereme... 40 meters long... Polybius tells us what it carried. 300 rowers + 120 marines + officers" */}
    <Escena t={t} t0={214.4} t1={236.3} entra="nada" sale="atraviesa" sx={980} sy={640} fondo="none" quieta golpes={[215.6, 219.7, 225.9, 227.0, 231.3]}>
      <Cam t={t} k={[[214.4, 960, 560, 0.55], [216.2, 960, 560, 1.0], [224.5, 960, 560, 1.0], [225.6, 960, 470, 1.0], [235, 960, 470, 1.0], [236.4, 980, 640, 1.5]]}>
        <Galera x={960} y={560} s={1.0} t={t} boga={t < 225.6 ? 0.55 : 0.2} vela={t < 225.6} marines />
        {/* regla de 40 m */}
        {t > 219.6 && t < 225.7 && (() => { const u = prog(t, 219.7, 220.1); return (
          <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
            <line x1={240} y1={700} x2={240 + 1580 * u} y2={700} stroke="#fff" strokeWidth={10} />
            <line x1={240} y1={670} x2={240} y2={730} stroke="#fff" strokeWidth={10} />
            {u > 0.98 && <line x1={1820} y1={670} x2={1820} y2={730} stroke="#fff" strokeWidth={10} />}
          </svg>); })()}
      </Cam>
      <Chip t={t} t0={215.6} t1={225.4} text="QUINQUEREME" color={C.rojo} x={960} y={130} centro size={80} />
      <Chip t={t} t0={217.4} t1={225.4} text="'FIVE-OARED'" color={C.violeta} x={960} y={240} centro size={48} />
      <Chip t={t} t0={220.4} t1={225.4} text="≈ 40 METERS" color={C.oro} tinta={C.noche} x={960} y={745} centro size={76} />
      <Apion t={t} t0={216.0} t1={232.8} x={1700} y={1050} h={400} borda={1020} acts={[[216.3, "habla"], [219.7, "senala"], [222.2, "piensa"], [225.9, "asombro"], [231.3, "miedo"]]} flip />
      <Chip t={t} t0={222.2} t1={225.4} text="POLYBIUS" color="#1d6f8a" x={960} y={850} centro size={56} />
      {/* los 400: barco en sección y gente llenándolo */}
      {t > 225.6 && <div style={{ position: "absolute", left: 300, top: 690, width: 1320, height: 360, borderRadius: 28, background: "linear-gradient(180deg, #3a2590, #241660)", border: "6px solid #7fd6ff", boxShadow: "0 12px 0 rgba(10,5,30,.4)", transform: `scale(${ent(t, 225.6)})` }} />}
      {t > 225.6 && <Gentio t={t} x={330} y={710} w={1260} cols={42} grupos={[{ n: 300, color: "#2fb5d8", t0: 225.9 }, { n: 120, color: C.rojo, t0: 227.0 }, { n: 24, color: C.oro, t0: 229.2 }]} />}
      <Chip t={t} t0={225.94} text="300 ROWERS" color="#1d6f8a" x={120} y={130} size={60} />
      <Chip t={t} t0={227.04} text="+120 MARINES" color={C.rojo} x={640} y={130} size={60} />
      <Chip t={t} t0={229.22} text="+ OFFICERS" color={C.oro} tinta={C.noche} x={1210} y={130} size={60} />
      <CuentaN t={t} t0={231.3} t1={232.4} a={400} pre="" suf="+" x={960} y={300} size={150} color={C.crema} />
      <Pileta t={t} t0={232.9} x={150} y={960} w={1620} />
      <Chip t={t} t0={233.6} text="OLYMPIC POOL = 50 M" color="#1d6f8a" x={960} y={895} centro size={44} />
    </Escena>

    {/* 236,3 · "The rowers sat on three levels, stacked like shelves... lucky = top, near the air, near the light. Unlucky = the bottom" */}
    <Escena t={t} t0={236.3} t1={249.9} entra="atraviesa" ix={980} iy={640} sale="nada" fondo="#3a1c0e" quieta golpes={[236.8, 244.0, 248.7]}>
      <Cam t={t} k={[[236.3, 960, 540, 1.0], [242.6, 960, 540, 1.0], [243.6, 900, 330, 1.7], [246.6, 900, 330, 1.7], [248.0, HX, HY - 40, 1.7], [249.9, HX, HY - 40, 1.7]]}>
        <Corte t={t} boga={0.5} agua={0.06} luz={1} heroeExpr="cansado" />
        {/* aro sobre los 3 niveles */}
        {t < 242.8 && [330, 600, 880].map((y, i) => <div key={i} style={{ position: "absolute", left: 1690, top: y - 120, width: 120, height: 120, borderRadius: 60, background: [C.lima, C.ambar, C.rojo][i], border: "8px solid #fff", fontFamily, fontWeight: 700, fontSize: 70, color: C.noche, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ent(t, 236.8 + i * 0.4)})` }}>{3 - i}</div>)}
      </Cam>
      <Chip t={t} t0={236.4} t1={242.6} text="3 LEVELS" color={C.violeta} x={960} y={150} centro size={74} />
      <Chip t={t} t0={238.3} t1={242.6} text="STACKED LIKE SHELVES" color={C.oro} tinta={C.noche} x={960} y={260} centro size={54} />
      <Chip t={t} t0={240.5} t1={242.6} text="YOUR CAREER IS DECIDED HERE" color={C.rojo} x={960} y={960} centro size={56} />
      <Chip t={t} t0={244.0} t1={247} text="LUCKY: TOP ROW" color={C.lima} tinta={C.noche} x={960} y={160} centro size={66} />
      <Chip t={t} t0={245.2} t1={247} text="AIR + LIGHT" color={C.oro} tinta={C.noche} x={960} y={950} centro size={58} />
      <Chip t={t} t0={247.2} text="UNLUCKY..." color={C.rojo} x={960} y={840} centro size={66} />
      <Chip t={t} t0={248.7} text="THE BOTTOM" color={C.noche} x={960} y={960} centro size={70} />
    </Escena>

    {/* 249,9 · "The bottom row sat almost at the waterline. Your oar went out through a hole... sealed with a leather sleeve. Most of the time it worked." */}
    <Escena t={t} t0={249.9} t1={259.0} entra="fundido" sale="fundido" fondo="#5a3018" golpes={[250.9, 254.9, 257.3]}>
      <Tronera t={t} fuga={prog(t, 257.4, 258.0)} />
      <Chip t={t} t0={250.4} text="AT THE WATERLINE" color="#1d6f8a" x={1550} y={400} centro size={50} />
      <Chip t={t} t0={252.6} text="A HOLE IN THE HULL" color={C.rojo} x={120} y={140} size={60} />
      <Chip t={t} t0={254.9} text="LEATHER SLEEVE" color="#8a4a22" x={120} y={250} size={60} />
      <Flecha t={t} t0={255.1} x1={700} y1={330} x2={1040} y2={500} color={C.ambar} />
      <Chip t={t} t0={257.3} text="MOST OF THE TIME" color={C.violeta} x={120} y={900} size={58} />
    </Escena>

    {/* 259,0 · "Under your feet, in the dark, sloshes the bilge... stinking water. Above your head, two more rows of men, sweating, for hours. And there is no toilet." */}
    <Escena t={t} t0={259.0} t1={271.7} entra="fundido" sale="fundido" fondo="#3a1c0e" quieta golpes={[260.9, 266.5, 270.0]}>
      <Cam t={t} k={[[259, HX, 900, 2.0], [264.6, HX, 860, 2.0], [266.4, 960, 540, 1.0], [271.7, 960, 540, 1.0]]}>
        <Corte t={t} boga={0.45} agua={0.09} luz={0.6} oscuro={interpolate(t, [259, 260, 265, 266.4], [0, 0.75, 0.75, 0.2], cl)} heroeExpr={t < 266 ? "miedo" : "cansado"} />
        {/* moscas sobre la sentina */}
        {t < 266.4 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{Array.from({ length: 9 }, (_, i) => <g key={i} transform={`translate(${640 + i * 40 + Math.sin(t * 7 + i * 2) * 50} ${960 + Math.cos(t * 9 + i) * 30})`}><circle r={6} fill="#1a1a1a" /><ellipse cx={-6} cy={-6} rx={6} ry={3} fill="#cfe8ff" opacity={0.7} /><ellipse cx={6} cy={-6} rx={6} ry={3} fill="#cfe8ff" opacity={0.7} /></g>)}{[0, 1, 2].map((i) => <path key={"o" + i} d={`M ${700 + i * 90} 1000 q 16 -26 0 -52 q -16 -26 0 -52`} stroke="#9bd05a" strokeWidth={6} fill="none" opacity={0.7} transform={`translate(0 ${-((t * 30 + i * 20) % 40)})`} />)}</svg>}
      </Cam>
      <Chip t={t} t0={259.0} t1={265.5} text="UNDER YOUR FEET" color={C.violeta} x={120} y={140} size={56} />
      <Chip t={t} t0={260.96} t1={265.5} text="THE BILGE" color="#5a6a3a" x={120} y={250} size={70} />
      <Chip t={t} t0={262.2} t1={265.5} text="STINKING WATER" color={C.rojo} x={120} y={360} size={52} />
      <Chip t={t} t0={265.8} text="+2 ROWS ABOVE YOU" color={C.oro} tinta={C.noche} x={960} y={160} centro size={60} />
      <Chip t={t} t0={268.6} text="SWEATING. FOR HOURS." color="#1d6f8a" x={960} y={270} centro size={52} />
      <Grande t={t} t0={270.0} text="NO TOILET" y={540} size={190} color={C.crema} />
    </Escena>

    {/* 271,7 · "The ancient Greeks had a joke... Aristophanes, a rower in the top row is mocked for farting straight into the face of the man below" */}
    <Escena t={t} t0={271.7} t1={285.8} entra="fundido" sale="fundido" fondo="#7a4520" golpes={[274.1, 277.2, 280.6]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #8a5228, #5a3018)" }} />
      {/* máscara de comedia griega */}
      {t < 276 && (
        <svg style={{ position: "absolute", left: 760, top: 260, transform: `scale(${ent(t, 272.0)}) rotate(${Math.sin(t * 3) * 4}deg)` }} width={400} height={460} viewBox="-200 -230 400 460">
          <path d="M -150 -150 Q 0 -230 150 -150 Q 190 40 0 210 Q -190 40 -150 -150 Z" fill="#f6e3b4" stroke="#2a1530" strokeWidth={10} />
          <path d="M -100 -60 Q -60 -100 -20 -60 Q -60 -40 -100 -60 Z M 100 -60 Q 60 -100 20 -60 Q 60 -40 100 -60 Z" fill="#2a1530" />
          <path d="M -90 40 Q 0 160 90 40 Q 0 90 -90 40 Z" fill="#2a1530" />
        </svg>
      )}
      {/* dos remeros apilados, de lado: arriba el culpable, abajo la víctima */}
      {t >= 276 && (
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <rect x={0} y={520} width={1920} height={30} fill="#3a1c0e" />
          <g transform={`translate(1060 510) scale(1.5)`}><Remero fase={t * 3.2} ropa="#a8673f" piel="#f2b48a" expr={t < 277.2 ? "neutro" : "feliz"} seed={4} t={t} /></g>
          <g transform={`translate(860 1000) scale(1.5)`}><Remero fase={t * 3.2 + 0.4} ropa="#2fb5d8" piel="#c98b62" pelo="#1d1410" expr={t < 277.5 ? "cansado" : "miedo"} seed={2} t={t} sudor /></g>
        </svg>
      )}
      <Nubecita t={t} t0={277.2} x1={1000} y1={500} x2={780} y2={700} />
      <Chip t={t} t0={271.8} text="A 2,400-YEAR-OLD JOKE" color={C.violeta} x={960} y={90} centro size={58} />
      <Chip t={t} t0={274.1} t1={276} text="ARISTOPHANES" color={C.oro} tinta={C.noche} x={960} y={850} centro size={70} />
      <Chip t={t} t0={276.2} text="TOP ROW" color={C.lima} tinta={C.noche} x={1500} y={380} centro size={50} />
      <Chip t={t} t0={278.6} text="YOU" color="#2fb5d8" tinta={C.noche} x={500} y={700} centro size={60} />
      <Chip t={t} t0={280.6} text="24 CENTURIES LATER..." color={C.rojo} x={960} y={960} centro size={56} />
      <Emote t={t} t0={278.0} tipo="susto" x={860 - 20} y={1000 - 330} s={1.4} />
    </Escena>

    {/* 285,8 · "Your personal space: one bench, less than a meter... bring their own cushion, a small leather pad, because hours on bare wood will destroy you" */}
    <Escena t={t} t0={285.8} t1={297.7} entra="fundido" sale="paneo" fondo="#7a4520" golpes={[287.3, 288.2, 291.1, 293.5]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #8a5228, #5a3018)" }} />
      {/* vista de arriba: hileras de cabezas en sus bancos */}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {Array.from({ length: 5 }, (_, i) => (
          <g key={i} transform={`translate(${260 + i * 360} ${520 + Math.sin(t * 3 + i) * 6})`}>
            <rect x={-150} y={60} width={300} height={44} rx={8} fill="#6b3a1f" />
            <ellipse cx={0} cy={40} rx={110} ry={56} fill={i === 2 ? "#2fb5d8" : ["#9a6a4a", "#7a7a5a", "#8a5a7a", "#6a7a4a", "#a8673f"][i]} />
            <circle cx={0} cy={0} r={58} fill={i === 2 ? "#1d1410" : ["#3a2214", "#1d1410", "#7a4a22", "#3a2214", "#1d1410"][i]} />
          </g>
        ))}
      </svg>
      {t > 288.2 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><line x1={980 + 120} y1={400} x2={980 + 230} y2={400} stroke="#fff" strokeWidth={10} /><path d="M 1090 380 L 1090 420 M 1220 380 L 1220 420" stroke="#fff" strokeWidth={10} /></svg>}
      <Chip t={t} t0={285.8} t1={290.8} text="YOUR PERSONAL SPACE" color={C.violeta} x={960} y={140} centro size={60} />
      <Chip t={t} t0={287.26} t1={290.8} text="1 BENCH" color={C.oro} tinta={C.noche} x={980} y={760} centro size={66} />
      <Chip t={t} t0={288.2} t1={290.8} text="< 1 METER" color={C.rojo} x={1160} y={330} centro size={56} />
      {t > 290.8 && <Cojin x={960} y={interpolate(t, [291.1, 291.7], [-200, 560], cl)} s={1.6} />}
      <Chip t={t} t0={291.1} text="BRING YOUR OWN CUSHION" color={C.oro} tinta={C.noche} x={960} y={140} centro size={66} />
      <Chip t={t} t0={293.5} text="LEATHER PAD" color="#8a4a22" x={960} y={830} centro size={56} />
      <Chip t={t} t0={295.1} text="BARE WOOD = DESTROYED" color={C.rojo} x={960} y={950} centro size={54} />
    </Escena>

    {/* 297,7 · "Thucydides describes sailors marching across the land to a new ship, each carrying three things: his oar, his cushion, and the leather strap" */}
    <Escena t={t} t0={297.7} t1={309.2} entra="paneo" sale="fundido" fondo="none" golpes={[297.9, 302.7, 304.7, 305.5, 306.3]}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d="M 0 700 Q 600 640 1200 690 Q 1600 720 1920 680 L 1920 1080 L 0 1080 Z" fill="#9ac46a" />
        <path d="M 0 800 Q 900 760 1920 790 L 1920 1080 L 0 1080 Z" fill="#c9a46a" />
      </svg>
      {Array.from({ length: 6 }, (_, i) => {
        const x = ((i * 380 + (t - 297.7) * 170) % 2280) - 260;
        const h = i === 3 ? 520 : 440;
        return <Persona key={i} x={x} y={pp(h, 560) + (i === 3 ? 0 : 30)} h={h} t={t} seed={i === 3 ? 2 : 110 + i} ropa={i === 3 ? APION : CIVIL(i)} camina={1.6} expr={i === 3 ? "triste" : "neutro"} bD={150} cD={20} />;
      })}
      {Array.from({ length: 6 }, (_, i) => {
        const x = ((i * 380 + (t - 297.7) * 170) % 2280) - 260;
        const h = i === 3 ? 520 : 440;
        const top = pp(h, 560) + (i === 3 ? 0 : 30) - h * 0.92;
        return <svg key={"r" + i} style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}><line x1={x - 260} y1={top - 40} x2={x + 240} y2={top + 40} stroke="#c49058" strokeWidth={16} strokeLinecap="round" /><path d={`M ${x + 170} ${top + 30} L ${x + 260} ${top + 60} L ${x + 250} ${top + 20} Z`} fill="#d8a868" /></svg>;
      })}
      <Chip t={t} t0={297.9} text="THUCYDIDES" color={C.oro} tinta={C.noche} x={120} y={130} size={62} />
      <Chip t={t} t0={299.6} text="MARCHING TO A NEW SHIP" color={C.violeta} x={120} y={240} size={50} />
      <Chip t={t} t0={302.7} text="EACH CARRIES 3 THINGS" color={C.rojo} x={960} y={960} centro size={58} />
    </Escena>

    {/* 304,7 inventario · 309,2 "That was all you owned on board: a stick, a pillow, and a strap." */}
    <Escena t={t} t0={304.4} t1={313.4} entra="fundido" sale="fundido" fondo="#2d1b69" golpes={[304.74, 305.54, 306.34, 310.6, 311.8, 312.5]}>
      <Sala t={t} tipo="bodega" />
      {t > 304.6 && <Remo x={960} y={420} s={ent(t, 304.74) * 1.4} />}
      {t > 305.4 && <Cojin x={560} y={680} s={ent(t, 305.54) * 1.2} />}
      {t > 306.2 && <Correa x={1360} y={680} s={ent(t, 306.34) * 1.2} />}
      <Chip t={t} t0={304.74} text={t < 310.6 ? "OAR" : "A STICK"} color={C.oro} tinta={C.noche} x={960} y={300} centro size={62} />
      <Chip t={t} t0={305.54} text={t < 311.8 ? "CUSHION" : "A PILLOW"} color="#8a4a22" x={560} y={860} centro size={58} />
      <Chip t={t} t0={306.34} text={t < 312.5 ? "OAR STRAP" : "A STRAP"} color="#1d6f8a" x={1360} y={860} centro size={58} />
      <Persona x={1700} y={1010} h={420} t={t} seed={2} ropa={APION} expr={t < 309.2 ? "orgullo" : "triste"} bI={t > 304.7 ? 100 + Math.sin(t * 4) * 12 : 10} cI={20} mira={-0.8} habla={t > 309.2 && t < 311} />
      <Chip t={t} t0={309.2} text="ALL YOU OWNED ON BOARD" color={C.rojo} x={960} y={160} centro size={58} />
    </Escena>

    {/* 313,4 · "And at night, there was no room to sleep. None. Almost no food, very little water, because every extra kilo made it slower" */}
    <Escena t={t} t0={313.4} t1={322.6} entra="fundido" sale="paneo" fondo="none" golpes={[316.0, 318.0, 320.2]}>
      <Galera x={960} y={680} s={0.7} t={t} boga={t < 317 ? 0.15 : 0.5} vela={false} marines={false} agua="#132a5a" />
      {t < 316.7 && <Zzz x={980} y={420} t={t} />}
      {t > 316.0 && t < 316.7 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><line x1={880} y1={300} x2={1100} y2={480} stroke={C.rojo} strokeWidth={22} strokeLinecap="round" /><line x1={1100} y1={300} x2={880} y2={480} stroke={C.rojo} strokeWidth={22} strokeLinecap="round" /></svg>}
      <Chip t={t} t0={313.6} t1={316.6} text="AT NIGHT..." color={C.violeta} x={960} y={140} centro size={62} />
      <Chip t={t} t0={314.6} t1={316.6} text="NO ROOM TO SLEEP" color={C.rojo} x={960} y={250} centro size={56} />
      <Persona x={1640} y={1050} h={430} t={t} seed={2} ropa={APION} expr={t < 316.7 ? "dormido" : t < 320.2 ? "triste" : "enojado"} bD={t > 316.8 ? 130 + Math.sin(t * 5) * 10 : 10} cD={70} manoD={t > 316.8 ? <circle r={22} fill="#d9a85a" stroke="#8a5a2a" strokeWidth={4} /> : undefined} inclina={t < 316.7 ? 10 : 0} />
      <Borda y={1020} />
      {t > 316.7 && <Galleta x={360} y={330} s={0.8 * ent(t, 316.8)} />}
      {t > 317.6 && <Anfora x={620} y={330} s={0.6 * ent(t, 317.7)} />}
      <Chip t={t} t0={316.8} text="ALMOST NO FOOD" color={C.ambar} tinta={C.noche} x={1400} y={170} centro size={56} />
      <Chip t={t} t0={317.9} text="VERY LITTLE WATER" color="#1d6f8a" x={1400} y={280} centro size={52} />
      <Chip t={t} t0={320.2} text="+1 KG = SLOWER" color={C.rojo} x={960} y={970} centro size={66} />
    </Escena>

    {/* 322,6 · "So almost every evening, the fleet had to find a beach, drag the ships up onto the sand, cook, drink, and sleep on the ground... only where there was a friendly beach" */}
    <Escena t={t} t0={322.6} t1={336.2} entra="paneo" sale="paneo" fondo="none" quieta golpes={[324.4, 326.2, 332.0]}>
      <Cam t={t} k={[[322.6, 960, 540, 1.0], [331.6, 960, 560, 1.06], [332.6, 960, 540, 0.62], [336.2, 960, 540, 0.62]]}>
        <Playa t={t} noche={t > 328 ? 1 : 0} fogatas={t > 328} />
        <svg style={{ position: "absolute", left: -1200, top: 1070, overflow: "visible" }} width={4400} height={900}><rect x={0} y={0} width={4400} height={900} fill={t > 328 ? "#5a4a6a" : "#e8c07a"} /></svg>
        {[0, 1, 2].map((i) => {
          const u = prog(t, 326.2 + i * 0.3, 327.6 + i * 0.3);
          return <Galera key={i} x={300 + i * 620} y={interpolate(u, [0, 1], [690, 760])} s={0.34} t={t + i} boga={u < 0.05 ? 0.4 : 0} vela={false} marines={false} agua={null} />;
        })}
        {t > 328 && Array.from({ length: 7 }, (_, i) => <Persona key={i} x={180 + i * 260} y={980} h={300} t={t} seed={120 + i} ropa={i === 3 ? APION : CIVIL(i)} expr={t > 330.3 && i % 2 ? "dormido" : "feliz"} />)}
        {t > 330.3 && <Zzz x={1060} y={760} t={t} />}
        {/* más allá de la playa: los acantilados donde no se puede parar */}
        {t > 332 && <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
          <path d="M -600 1080 L -600 520 L -400 560 L -300 480 L -200 600 L -40 700 L 0 760 L 0 1080 Z" fill="#5a4a6a" />
          <path d="M 1920 760 L 2000 640 L 2200 520 L 2400 580 L 2520 480 L 2520 1080 L 1920 1080 Z" fill="#5a4a6a" />
          <text x={-300} y={420} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={70} fill="#ff8a9a">CLIFFS ✕</text>
          <text x={2220} y={420} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={70} fill="#ff8a9a">ENEMY ✕</text>
          <text x={960} y={600} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={70} fill={C.lima}>FRIENDLY BEACH ✓</text>
        </svg>}
      </Cam>
      <Chip t={t} t0={322.7} t1={331.6} text="EVERY EVENING" color={C.violeta} x={120} y={130} size={56} />
      <Chip t={t} t0={324.4} t1={331.6} text="FIND A BEACH" color={C.oro} tinta={C.noche} x={120} y={240} size={62} />
      <Chip t={t} t0={326.2} t1={331.6} text="DRAG THE SHIPS UP" color={C.rojo} x={1300} y={130} size={52} />
      <Chip t={t} t0={328.1} t1={331.6} text="COOK · DRINK · SLEEP" color="#1d6f8a" x={1300} y={240} size={46} />
      <Chip t={t} t0={333.0} text="ONLY WHERE THERE WAS A BEACH" color={C.rojo} x={960} y={140} centro size={60} />
    </Escena>

    {/* 336,2 · "And if the weather turned while you were far away from one... well, remember that for later." — presagio de la trampa 6 */}
    <Escena t={t} t0={336.2} t1={341.5} entra="paneo" sale="atraviesa" sx={960} sy={600} fondo="none" golpes={[336.3, 339.7]}>
      <Nubes t={t} n={7} seed={33} color="#3a3d5e" op={0.85 * prog(t, 336.4, 338)} vel={90} alto={300} />
      <Galera x={960} y={700} s={0.32} t={t} boga={0.7} vela={false} balanceo={interpolate(t, [336.2, 339], [1, 5], cl)} agua="#1d2a5a" ola={interpolate(t, [336.2, 339], [0.3, 1], cl)} />
      <Salpica t={t} t0={338.6} x={1100} y={700} />
      <Chip t={t} t0={336.3} text="FAR FROM A BEACH?" color={C.violeta} x={960} y={150} centro size={62} />
      <Chip t={t} t0={339.7} text="REMEMBER THAT." color={C.rojo} x={960} y={270} centro size={70} />
      <Apion t={t} t0={336.3} x={1640} y={1050} h={420} borda={1020} acts={[[336.5, "piensa"], [338.6, "miedo"]]} />
    </Escena>
  </>
);
