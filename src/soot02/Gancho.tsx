import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { rnd } from "../soot/lib";
import { Portada } from "./Portada";
import { Persona, APION, LUCIUS } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cam, Chip, Grande, Particulas, Emote, cabeza } from "./kit";
import { Pergamino } from "./kit";
import { Escudo } from "./kit2";
import { Apion } from "./actor";
import { Galera, Corte, Remo, Olas, Nubes, Relampago, Flota, Burbujas, Submarino, IconoTrampa, CuentaN, Flecha, AguaFrente, Playa, Espolon, Salpica } from "./mar";

// soot02 · gancho (0-49,24 s). Mundo continuo: abrimos ADENTRO del casco, caemos al mar, subimos al contrato,
// salimos al costado del barco de noche, entra la tormenta de 255 a. C., y de día la playa del video 1 → la galera → las 7 trampas.

const pp = (h: number, cy: number) => cy + 450 * (h / 560);
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const TINTA = "#2a1530";

// remeritos para las multitudes (100 000 / "como vos")
const Fig: React.FC<{ x: number; y: number; s?: number; c?: string; rot?: number; op?: number; piel?: string }> = ({ x, y, s = 1, c = C.teal, rot = 0, op = 1, piel = "#e8b48a" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    <path d="M -18 6 L -14 -22 Q 0 -30 14 -22 L 18 6 Z" fill={c} />
    <circle cx={0} cy={-40} r={14} fill={piel} />
    <path d="M -14 -42 Q -14 -56 0 -56 Q 14 -56 14 -44 Q 6 -50 -14 -42 Z" fill="#2a1a10" />
  </g>
);

export const Gancho: React.FC<{ t: number }> = ({ t }) => {
  return (
    <>
      {/* 0,00 · "You are 20 years old" — adentro del casco, fila de abajo, a oscuras, el agua de la sentina a los pies */}
      <Escena t={t} t0={0} t1={1.42} entra="nada" sale="baja" quieta>
        {/* cuadro 0 = la miniatura sin texto ni flecha, rehecha en código; después cobra vida */}
        <Portada t={t} />
        <CuentaN t={t} t0={0.12} t1={0.55} a={20} x={900} y={330} size={260} color={C.ambar} />
        <Chip t={t} t0={0.6} text="YEARS OLD" color={C.rojo} x={900} y={500} centro size={60} />
      </Escena>

      {/* 1,42 · "you cannot swim" — la cámara baja: debajo del casco, en el mar, pataleando */}
      <Escena t={t} t0={1.42} t1={2.8} entra="baja" sale="fundido" fondo="#0f3466" quieta>
        <Submarino t={t} />
        <svg style={{ position: "absolute", left: 0, top: -40 }} width={1920} height={200}>
          <path d="M -40 0 L 1960 0 L 1960 60 Q 1500 150 960 150 Q 420 150 -40 60 Z" fill="#3a1a10" />
          {Array.from({ length: 20 }, (_, i) => <line key={i} x1={i * 100} y1={110 + Math.abs(i - 10) * -4} x2={i * 100 - 60 + Math.sin(t * 4 + i) * 20} y2={240} stroke="#c49058" strokeWidth={10} />)}
        </svg>
        <Burbujas t={t} n={34} seed={4} />
        <Persona x={960} y={pp(820, 520) + Math.sin(t * 3) * 14} h={820} t={t} seed={2} ropa={APION} expr="miedo" bI={150 + Math.sin(t * 14) * 30} bD={150 + Math.cos(t * 14) * 30} cI={30} cD={30} inclina={Math.sin(t * 5) * 6} />
        <Emote t={t} t0={1.7} tipo="susto" {...L(960, pp(820, 520), 820)} s={1.5} />
        <Chip t={t} t0={1.6} text="CAN'T SWIM" color={C.rojo} x={1500} y={300} centro size={80} />
        {t > 1.9 && <svg style={{ position: "absolute", left: 1330, top: 380 }} width={340} height={200}><g transform={`scale(${ent(t, 1.9)})`} style={{ transformOrigin: "170px 100px" }}><circle cx={170} cy={100} r={84} fill="none" stroke={C.rojo} strokeWidth={20} /><path d="M 120 120 q 25 -30 50 0 t 50 0" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" /><line x1={110} y1={40} x2={230} y2={160} stroke={C.rojo} strokeWidth={20} strokeLinecap="round" /></g></svg>}
      </Escena>

      {/* 2,80 · "you have just signed a contract to spend the next 26 years" — sale del agua al pergamino, firma */}
      <Escena t={t} t0={2.8} t1={6.32} entra="fundido" sale="fundido" fondo="#2d1b69" golpes={[5.32]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 40% 45%, #6b3fc0, #1b1240 75%)" }} />
        <Burbujas t={t + 3} n={10} seed={8} />
        <Pergamino x={700} y={560} w={720} abre={prog(t, 2.9, 3.4)} lineas={8} firma={prog(t, 3.4, 4.3)} titulo="CLASSIS · NAVY" />
        {t > 3.2 && (() => { const u = prog(t, 3.4, 4.3); return <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}><g transform={`translate(${430 + u * 290} ${820 - Math.sin(u * 22) * 16 - (1 - ent(t, 3.2)) * 260}) rotate(-30)`}><path d="M 0 0 Q -30 -90 10 -170 Q 40 -90 6 0 Z" fill="#fff6e8" /><line x1={3} y1={0} x2={0} y2={30} stroke="#2b2b2b" strokeWidth={5} /></g></svg>; })()}
        <Chip t={t} t0={3.4} text="SIGNED" color={C.teal} tinta={C.noche} x={260} y={180} size={70} />
        <CuentaN t={t} t0={5.32} t1={5.85} a={26} x={1460} y={470} size={360} color={C.crema} />
        <Chip t={t} t0={5.88} text="YEARS" color={C.rojo} x={1460} y={720} centro size={84} />
      </Escena>

      {/* 6,32 · "sitting in the dark, below the waterline" — afuera, de noche: el costado de la galera y la fila sumergida */}
      <Escena t={t} t0={6.32} t1={9.06} entra="fundido" sale="atraviesa" sx={700} sy={680} fondo="none" golpes={[7.48]}>
        <Galera x={960} y={640} s={1.05} t={t} boga={0.55} vela={false} marines={false} agua={null} />
        <AguaFrente t={t} y={652} ola={0.3} color="#16204e" />
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <line x1={0} y1={652} x2={1920 * prog(t, 7.4, 8.0)} y2={652} stroke="#7fd6ff" strokeWidth={6} strokeDasharray="22 14" />
        </svg>
        <Chip t={t} t0={7.14} text="IN THE DARK" color={C.violeta} x={250} y={170} size={60} />
        <Chip t={t} t0={7.6} text="BELOW THE WATERLINE" color="#1d6f8a" x={960} y={930} centro size={70} />
        <Flecha t={t} t0={7.0} x1={520} y1={380} x2={690} y2={640} color={C.ambar} />
        <Chip t={t} t0={6.9} text="YOU" color={C.ambar} tinta={C.noche} x={430} y={330} centro size={76} />
      </Escena>

      {/* 9,06 · "facing backwards, pulling a giant piece of wood" — atravesamos la tronera: adentro de nuevo */}
      <Escena t={t} t0={9.06} t1={12.22} entra="atraviesa" ix={800} iy={740} sale="fundido" quieta>
        <Cam t={t} k={[[9.06, 800, 640, 1.9], [10.2, 800, 610, 1.6], [12.4, 900, 560, 1.15]]}>
          <Corte t={t} boga={0.6} agua={0.1} oscuro={0.35} heroeExpr="cansado" />
        </Cam>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 180, background: "linear-gradient(180deg, rgba(20,12,30,.92) 60%, rgba(20,12,30,0))", opacity: prog(t, 9.1, 9.4) }} />
        <Chip t={t} t0={9.2} text="← YOU FACE THIS WAY" color={C.rojo} x={90} y={90} size={54} />
        <Chip t={t} t0={9.6} text="SHIP GOES THIS WAY →" color={C.teal} tinta={C.noche} x={1830} y={90} size={54} />
        <Remo x={interpolate(t, [10.3, 12.3], [1500, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={560} s={1.6} t={t} t0={10.3} rot={-8} />
        <Chip t={t} t0={10.6} text="GIANT PIECE OF WOOD" color={C.ambar} tinta={C.noche} x={960} y={880} centro size={74} />
        <Flecha t={t} t0={9.7} x1={1250} y1={260} x2={1700} y2={260} color={C.teal} grosor={16} />
        <CuentaN t={t} t0={11.0} t1={11.9} a={170} x={1560} y={420} size={130} color={C.crema} />
        <Chip t={t} t0={11.3} text="OARS PER SIDE" color={C.rojo} x={1560} y={530} centro size={44} />
      </Escena>

      {/* 12,22 · "In the year 255 before Christ" — el mundo se vuelve tormenta: relámpago y la fecha */}
      <Escena t={t} t0={12.22} t1={15.14} entra="fundido" sale="paneo" fondo="none" golpes={[12.66]}>
        <Nubes t={t} n={8} seed={5} color="#2a2d4a" op={0.9} vel={60} alto={260} />
        {[0, 1, 2].map((i) => <Galera key={i} x={300 + i * 650} y={640 + i * 30} s={0.34 + i * 0.04} t={t + i * 1.7} boga={0.8} balanceo={4} agua="#1b1f4c" ola={1} />)}
        <Relampago t={t} ts={[12.6, 14.3]} />
        <Grande t={t} t0={12.66} text="255 BC" y={380} size={260} color={C.crema} />
        <Chip t={t} t0={13.92} text="BEFORE CHRIST" color={C.violeta} x={960} y={570} centro size={56} />
        <Apion t={t} t0={12.3} x={1640} y={1050} h={420} borda={1020} acts={[[12.66, "asombro"], [13.92, "miedo"]]} />
      </Escena>

      {/* 15,14 · "one single storm off the coast of Sicily destroyed..." — la flota en olas gigantes; la primera se da vuelta */}
      <Escena t={t} t0={15.14} t1={18.4} entra="paneo" sale="fundido" fondo="none" golpes={[15.76, 17.64]}>
        <Nubes t={t} n={8} seed={9} color="#24263e" op={0.95} vel={70} alto={240} />
        <Galera x={1020} y={600} s={0.3} t={t + 4} boga={0.9} balanceo={6} agua="#1d2250" ola={1} />
        <Galera x={1400} y={650} s={0.42} t={t + 2} boga={0.9} balanceo={5} hunde={prog(t, 18.0, 19)} agua="#181d48" ola={1} />
        <Galera x={480} y={640} s={0.58} t={t} boga={0.9} balanceo={5} hunde={prog(t, 17.64, 18.6)} agua="#151a40" ola={1} />
        <Salpica t={t} t0={17.7} x={480} y={640} s={1.4} n={24} />
        <Relampago t={t} ts={[15.7, 17.6]} x={900} />
        <Chip t={t} t0={15.34} text="ONE STORM" color={C.rojo} x={150} y={160} size={78} />
        <Chip t={t} t0={17.2} text="SICILY" color={C.oro} tinta={C.noche} x={1500} y={170} size={66} />
        <Apion t={t} t0={15.14} x={1640} y={1050} h={420} borda={1020} desde="nada" acts={[[15.14, "miedo"], [17.64, "asombro"]]} />
      </Escena>

      {/* 18,40 · "284 Roman warships" — la flota entera como grilla: 364 barcos, se dan vuelta 284 */}
      <Escena t={t} t0={18.4} t1={21.14} entra="fundido" sale="baja" fondo="none" golpes={[18.4]}>
        <AbsoluteFill style={{ background: "rgba(16,14,40,.72)" }} />
        <Flota t={t} t0={18.42} n={364} hunde={284} tA={[18.5, 20.7]} y={650} cols={26} s={1.12} mar />
        <CuentaN t={t} t0={18.4} t1={20.0} a={284} x={960} y={190} size={230} color={C.rojo} />
        <Chip t={t} t0={19.64} text="ROMAN WARSHIPS" color={C.violeta} x={960} y={330} centro size={56} />
        <Relampago t={t} ts={[20.1]} x={300} />
      </Escena>

      {/* 21,14 · "By some estimates, close to 100,000 men drowned" — la cámara baja al fondo con ellos */}
      <Escena t={t} t0={21.14} t1={24.64} entra="baja" sale="fundido" fondo="#081a3a" quieta>
        <Submarino t={t} />
        <AbsoluteFill style={{ background: "rgba(5,10,30,.45)" }} />
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          {Array.from({ length: 90 }, (_, i) => {
            const r = rnd(i + 30);
            const x = r() * 1920, y0 = -100 - r() * 600, v = 120 + r() * 160;
            const y = y0 + (t - 21.14) * v;
            return <Fig key={i} x={x} y={y} s={0.9 + r() * 0.8} c={r() < 0.5 ? "#9fc8e8" : "#7aa8d0"} rot={(t - 21.14) * (r() - 0.5) * 120} op={0.85} />;
          })}
        </svg>
        <Burbujas t={t} n={40} seed={11} />
        <Chip t={t} t0={21.3} text="BY SOME ESTIMATES" color={C.violeta} x={960} y={250} centro size={56} />
        <CuentaN t={t} t0={22.5} t1={23.5} a={100000} pre="~" x={960} y={500} size={250} color={C.crema} />
        <Chip t={t} t0={23.72} text="DROWNED" color={C.rojo} x={960} y={720} centro size={86} />
      </Escena>

      {/* 24,64 · "Most of them were people exactly like you" — una multitud, uno se ilumina: vos */}
      <Escena t={t} t0={24.64} t1={27.28} entra="fundido" sale="atraviesa" sx={1180} sy={560} fondo="#1b1240" golpes={[26.28]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 60% 50%, #3a2a7a, #120c30 80%)" }} />
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          {Array.from({ length: 12 * 6 }, (_, i) => {
            const cx = 200 + (i % 12) * 140, cy = 300 + Math.floor(i / 12) * 130;
            const yo = i === 5 + 12 * 2;
            const e = ent(t, 24.7 + (i % 12) * 0.02 + Math.floor(i / 12) * 0.03);
            return <Fig key={i} x={cx} y={cy + 40} s={1.9 * e} c={yo && t > 25.76 ? "#2fb5d8" : ["#9a6a4a", "#7a7a5a", "#8a5a7a", "#6a7a4a", "#a8673f"][i % 5]} piel={["#f2b48a", "#c98b62", "#8d5a3b", "#f5c7a0"][i % 4]} op={yo || t < 25.76 ? 1 : 0.4} />;
          })}
          {t > 25.76 && <circle cx={900} cy={560} r={95 + Math.sin(t * 8) * 6} fill="none" stroke={C.ambar} strokeWidth={10} opacity={ent(t, 25.76)} />}
        </svg>
        <Chip t={t} t0={25.2} text="PEOPLE EXACTLY LIKE" color={C.violeta} x={960} y={150} centro size={60} />
        <Chip t={t} t0={26.28} text="YOU" color={C.ambar} tinta={C.noche} x={1060} y={430} size={70} />
      </Escena>

      {/* 27,28 · "rowers" — vos, en primer plano, con el remo al hombro */}
      <Escena t={t} t0={27.28} t1={28.28} entra="atraviesa" ix={960} iy={420} sale="fundido" fondo="#ff9a4d" golpes={[27.3]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #ffd27a, #ff7a3d 70%, #c2452a)" }} />
        <Persona x={700} y={pp(1150, 470)} h={1150} t={t} seed={2} ropa={APION} expr="orgullo" bD={150} cD={60} mira={0.4} manoD={<g transform="rotate(30)"><rect x={-12} y={-420} width={24} height={600} rx={10} fill="#c49058" /><path d="M -12 -420 L -40 -600 L 40 -600 L 12 -420 Z" fill="#d8a868" stroke="#8a5a2a" strokeWidth={6} /></g>} />
        <Grande t={t} t0={27.3} text="ROWERS" x={1380} y={520} size={210} color={C.crema} />
      </Escena>

      {/* 28,28 · "Last time we joined the Roman legion. Today, we sign up for the navy. If you thought the army was bad..." —
          UN set de dos pantallas: la playa con Lucius (video 1) → paneo al agua, la galera llega → vuelve a Lucius sudando */}
      <Escena t={t} t0={28.28} t1={34.72} entra="fundido" sale="fundido" fondo="none" quieta>
        <Cam t={t} k={[[28.28, 960, 540, 1.0], [30.8, 960, 540, 1.0], [31.5, 2700, 540, 1.0], [32.86, 2700, 540, 1.0], [33.4, 1150, 520, 1.25], [34.8, 1150, 520, 1.3]]}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 3840, height: 1080 }}>
            <div style={{ position: "absolute", left: 1920, top: 0, width: 1920, height: 1080 }}>
              <Olas t={t} y0={760} ola={0.25} capas={4} />
              <Playa t={t} />
              <Galera x={1100 + interpolate(t, [30.8, 32.4], [700, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={640} s={0.62} t={t} boga={0.6} vela agua="#2a74b8" />
              {t >= 31.4 && <Persona x={interpolate(t, [31.4, 32.6], [-480, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={980} h={420} t={t} seed={2} ropa={APION} expr="feliz" camina={t < 32.6 ? 1.8 : 0} salta={32.6} />}
            </div>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
              <Playa t={t} />
              <Persona x={1150} y={1000} h={560} t={t} seed={1} ropa={LUCIUS} casco="legion" expr={t < 32.86 ? "orgullo" : "miedo"} bD={t < 30.6 ? 140 + Math.sin(t * 9) * 20 : 10} cD={30} mira={0.3} />
              <Escudo x={930} y={830} s={0.8} t={t} t0={28.6} />
              <Emote t={t} t0={33.3} tipo="sudor" {...L(1150, 1000, 560)} />
            </div>
          </div>
        </Cam>
        <Chip t={t} t0={28.4} t1={30.7} text="LAST TIME" color={C.violeta} x={150} y={150} size={56} />
        <Chip t={t} t0={29.3} t1={30.7} text="THE LEGION" color={C.rojo} x={150} y={250} size={76} />
        <Chip t={t} t0={31.3} t1={32.8} text="TODAY" color={C.violeta} x={1400} y={150} size={56} />
        <Chip t={t} t0={31.9} t1={32.8} text="THE NAVY" color="#1d6f8a" x={1400} y={250} size={84} />
        <Chip t={t} t0={33.48} text="THE ARMY WAS BAD?" color={C.rojo} x={960} y={160} centro size={62} />
      </Escena>

      {/* 34,72 · "what Rome could build out of wood, bronze, and 300 tired men" — la galera se arma pieza por pieza en el agua */}
      <Escena t={t} t0={34.72} t1={39.76} entra="fundido" sale="fundido" fondo="none" golpes={[36.62, 37.26, 38.08]}>
        {t < 39.76 && <AbsoluteFill style={{ clipPath: `inset(0 ${100 - 100 * prog(t, 35.4, 36.7)}% 0 0)` }}>
          <Galera x={960} y={600} s={0.95} t={t} boga={t < 38.1 ? 0 : 0.6} vela={t > 38.6} marines={false} agua="#1f5c9c" />
        </AbsoluteFill>}
        {t < 37.4 && <Espolon x={interpolate(t, [37.0, 37.3], [2300, 1830], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={662} s={0.25} />}
        <Salpica t={t} t0={37.28} x={1840} y={650} />
        <Chip t={t} t0={35.6} t1={39.4} text="ROME BUILDS" color={C.violeta} x={120} y={150} size={56} />
        <Chip t={t} t0={36.62} t1={39.4} text="WOOD" color="#a8622c" x={420} y={300} centro size={76} />
        <Chip t={t} t0={37.26} t1={39.4} text="BRONZE" color="#d9962e" tinta={C.noche} x={1700} y={480} centro size={76} />
        {t < 39.76 && <CuentaN t={t} t0={38.08} t1={38.6} a={300} x={960} y={250} size={210} color={C.crema} />}
        <Chip t={t} t0={38.6} t1={39.4} text="TIRED MEN" color={C.rojo} x={960} y={400} centro size={64} />
      </Escena>

      {/* 39,76 · "the most dangerous thing on a Roman warship was not the enemy" — llega el enemigo... y se tacha. Al fondo, una nube. */}
      <Escena t={t} t0={39.76} t1={45.08} entra="corte" sale="fundido" fondo="none" golpes={[43.76]}>
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <g opacity={prog(t, 41.5, 43)} transform="translate(1500 260)"><ellipse cx={0} cy={0} rx={260} ry={80} fill="#4a4f78" /><circle cx={-90} cy={-40} r={90} fill="#4a4f78" /><circle cx={60} cy={-60} r={110} fill="#4a4f78" /></g>
        </svg>
        <Relampago t={t} ts={[44.5]} x={1500} />
        <Galera x={760} y={660} s={0.6} t={t} boga={0.7} vela />
        <Galera x={interpolate(t, [39.8, 41.6], [2400, 1560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={670} s={0.6} t={t + 1} boga={0.7} flip color="#3a2a3a" franja="#1a1a1a" />
        <Chip t={t} t0={41.32} text="MOST DANGEROUS THING?" color={C.violeta} x={960} y={150} centro size={62} />
        {t > 43.76 && <svg style={{ position: "absolute", left: 1150, top: 450 }} width={500} height={400}><g opacity={ent(t, 43.76)}><line x1={40} y1={40} x2={40 + 420 * prog(t, 43.76, 43.96)} y2={40 + 320 * prog(t, 43.76, 43.96)} stroke={C.rojo} strokeWidth={40} strokeLinecap="round" /><line x1={460} y1={40} x2={460 - 420 * prog(t, 43.9, 44.1)} y2={40 + 320 * prog(t, 43.9, 44.1)} stroke={C.rojo} strokeWidth={40} strokeLinecap="round" /></g></svg>}
        <Grande t={t} t0={44.0} text="NOT THE ENEMY" x={1100} y={790} size={120} color={C.crema} />
        <Apion t={t} t0={39.9} x={230} y={1050} h={420} borda={1020} desde="nada" acts={[[40.3, "habla"], [41.32, "piensa"], [43.76, "asombro"], [44.5, "senala"]]} flip={false} />
        <Chip t={t} t0={44.6} text="?" color={C.ambar} tinta={C.noche} x={1500} y={300} centro size={90} />
      </Escena>

      {/* 45,08 · "There are seven traps waiting for you on board. Let's find you a bench." — el tablero del viaje: 7 paradas a lo largo del barco */}
      <Escena t={t} t0={45.08} t1={49.24} entra="fundido" sale="atraviesa" sx={960} sy={640} fondo="none" golpes={[45.34]}>
        <Cam t={t} k={[[45.08, 960, 560, 1.0], [47.6, 960, 560, 1.0], [49.3, 760, 640, 2.4]]}>
          <Galera x={960} y={560} s={1.0} t={t} boga={0.5} vela marines={false} balanceo={2.2} ola={0.8} />
          <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
            <path d={`M ${260} 760 C 600 ${700} 1300 ${820} 1700 740`} stroke="#fff" strokeWidth={8} strokeDasharray="4 20" strokeLinecap="round" fill="none" pathLength={1} style={{ strokeDasharray: `${prog(t, 45.3, 46.6)} 1` }} />
            {Array.from({ length: 7 }, (_, i) => {
              const x = 300 + i * 225, y = 760 + Math.sin(i * 1.3) * 40;
              const e = ent(t, 45.4 + i * 0.16, 0, { damping: 9, stiffness: 200 });
              return (
                <g key={i} transform={`translate(${x} ${y}) scale(${e})`}>
                  <circle r={78} fill={["#e8344a", "#ff7a3d", "#ffb020", "#d9962e", "#5b2bb5", "#4a4f78", "#2ec4d6"][i]} stroke="#fff" strokeWidth={8} />
                  <IconoTrampa n={i + 1} s={0.95} />
                  <circle cx={56} cy={-56} r={26} fill="#fff" stroke={TINTA} strokeWidth={5} />
                  <text x={56} y={-44} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={34} fill={TINTA}>{i + 1}</text>
                </g>
              );
            })}
          </svg>
        </Cam>
        <Grande t={t} t0={45.34} text="7 TRAPS" y={170} size={170} color={C.crema} />
        <Chip t={t} t0={46.3} text="ON BOARD" color={C.rojo} x={960} y={300} centro size={58} />
        <Chip t={t} t0={47.9} text="FIND YOU A BENCH" color={C.teal} tinta={C.noche} x={960} y={960} centro size={60} />
      </Escena>
    </>
  );
};
