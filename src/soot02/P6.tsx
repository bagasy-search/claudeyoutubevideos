import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, APION, CIVIL, CENTURION } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cam, Chip, Grande, Emote, cabeza, Particulas, Pergamino, Pluma } from "./kit";
import { Apion } from "./actor";
import { Galera, Corte, MapaMar, Pancarta, CuentaN, Flecha, Salpica, Playa, Flota, Relampago, Pollo, Volcan, Burbujas, Anfora } from "./mar";
import { Sello } from "./P1";

// soot02 · trampa 6, LA TORMENTA (652,89-797,89 s). Camarina 255 a. C. (364 → 80) vista desde el banco y el puente que tira
// → 253: otros 150 → 249: Claudio Pulcro tira los pollos sagrados al mar → ~700 barcos en una guerra → no sabés nadar
// → año 79: Plinio el Viejo sale de Miseno hacia el Vesubio y no vuelve.
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const PULCRO = { tunica: "#f2ead8", tunica2: "#6a2a8a", cinto: "#4a1a5a", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2214" };
const CAPITAN = { tunica: "#4a6a8a", tunica2: "#2a3a5a", cinto: "#5a3418", piel: "#c98b62", piel2: "#a2643f", pelo: "#6a6a6a" };
const PLINIO = { tunica: "#f2ead8", tunica2: "#a3202f", cinto: "#6a2a1a", piel: "#f2b48a", piel2: "#d98d66", pelo: "#d8d0c4" };
const SOBRINO = { tunica: "#e8dcc4", tunica2: "#5a7a9a", cinto: "#5a3418", piel: "#f2b48a", piel2: "#d98d66", pelo: "#4a2a17" };

// tablones y ánforas en la arena (los restos de Camarina)
const Restos: React.FC<{ t: number; t0: number; n?: number }> = ({ t, t0, n = 40 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={5200} height={1080}>
    {Array.from({ length: n }, (_, i) => {
      const x = 80 + i * 127 + ((i * 53) % 70), y = 820 + ((i * 37) % 160);
      const e = ent(t, t0 + i * 0.03);
      const k = i % 4;
      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${((i * 71) % 60) - 30}) scale(${e})`}>
          {k === 0 && <rect x={-90} y={-12} width={180} height={24} rx={6} fill="#7a4a24" stroke="#4a2a10" strokeWidth={4} />}
          {k === 1 && <><rect x={-60} y={-10} width={120} height={20} rx={5} fill="#8a5a2a" /><rect x={-30} y={-30} width={14} height={60} fill="#6a3a18" /></>}
          {k === 2 && <><path d="M -40 -10 L 120 -10 L 110 10 L -40 10 Z" fill="#5a3418" /><path d="M 110 -14 L 160 0 L 110 14 Z" fill="#b5a080" /></>}
          {k === 3 && <><ellipse cx={0} cy={0} rx={22} ry={40} fill="#c86a3a" /><rect x={-8} y={-56} width={16} height={22} fill="#a8552a" /></>}
        </g>
      );
    })}
  </svg>
);
// pila de barquitos ↔ nube: «no todos al enemigo»
const Nube: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 150 * s, top: y - 100 * s, overflow: "visible" }} width={300 * s} height={200 * s} viewBox="-150 -100 300 200">
    <path d="M -110 40 Q -150 40 -140 0 Q -130 -40 -80 -30 Q -70 -90 0 -80 Q 60 -100 80 -40 Q 140 -50 140 0 Q 140 40 100 40 Z" fill="#4a4f78" />
    {[-60, 0, 60].map((d) => <path key={d} d={`M ${d} 50 L ${d - 14} 90`} stroke="#8fd0f2" strokeWidth={8} strokeLinecap="round" />)}
    <path d="M 10 40 L -10 80 L 10 80 L -6 110" stroke="#ffd27a" strokeWidth={8} fill="none" strokeLinejoin="round" />
  </svg>
);
const Espadas: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 120 * s, top: y - 120 * s, overflow: "visible" }} width={240 * s} height={240 * s} viewBox="-120 -120 240 240">
    {[-1, 1].map((d) => (
      <g key={d} transform={`rotate(${d * 40})`}>
        <path d="M -12 -110 L 12 -110 L 12 40 L -12 40 Z" fill="#d8dce8" stroke="#6a6f92" strokeWidth={5} />
        <path d="M 0 -130 L 12 -110 L -12 -110 Z" fill="#d8dce8" />
        <rect x={-36} y={40} width={72} height={16} rx={6} fill="#d9962e" />
        <rect x={-9} y={56} width={18} height={50} rx={6} fill="#7a4a24" />
      </g>
    ))}
  </svg>
);
// pino (la forma de la nube según Plinio el Joven)
const Pino: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 100 * s, top: y - 140 * s, overflow: "visible" }} width={200 * s} height={280 * s} viewBox="-100 -140 200 280">
    <rect x={-12} y={-40} width={24} height={180} fill="#7a4a24" />
    <ellipse cx={0} cy={-70} rx={100} ry={50} fill="#3f8f3e" />
    <ellipse cx={-40} cy={-90} rx={56} ry={34} fill="#5aae4a" />
    <ellipse cx={40} cy={-96} rx={50} ry={30} fill="#5aae4a" />
  </svg>
);

export const P6: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 652,89 · TRAP #6 · THE STORM — la galera de la trampa 5 escora y atravesamos a la pancarta */}
    <Escena t={t} t0={652.89} t1={655.33} entra="atraviesa" ix={960} iy={520} sale="fundido" fondo="none" golpes={[653.0, 654.3]}>
      <Galera x={960} y={760} s={0.55} t={t} boga={0.4} vela={false} corvus={0} balanceo={9} ola={1} agua="#1b1f4c" />
      <Pancarta t={t} t0={653.0} n={6} titulo="THE STORM" y={360} />
      <Apion t={t} t0={653.1} x={1620} y={1050} h={420} borda={1020} acts={[[653.1, "miedo"]]} />
      <Relampago t={t} ts={[653.1, 654.35]} x={1300} />
    </Escena>

    {/* 655,33 · "Remember the year 255 BC? ... rescued the survivors of a defeat in Africa ... sailing home along the south coast of Sicily" */}
    <Escena t={t} t0={655.33} t1={665.03} entra="fundido" sale="fundido" fondo="#1f5c9c" golpes={[655.4, 658.5, 661.9, 663.5]}>
      <MapaMar t={t} puntos={[{ n: "CARTHAGE", t0: 658.6, color: "#7a5bd1", label: false }, { n: "SICILY", t0: 662.0, color: C.rojo, label: false }, { n: "CAMARINA", t0: 663.6, color: C.oro }]} rutas={[{ de: "ROME", a: "CARTHAGE", t0: 658.5, d: 1.4 }, { de: "CARTHAGE", a: "CAMARINA", t0: 661.9, d: 2.4 }]} zoom={{ n: "SICILY", z: 1.9, t: [662.2, 664.6] }} />
      {t < 662.3 && <Grande t={t} t0={655.4} text="255 BC" x={960} y={170} size={140} color={C.crema} />}
      <Chip t={t} t0={658.5} t1={662.0} text="RESCUE MISSION · AFRICA" color="#7a5bd1" x={960} y={960} centro size={54} />
      <Chip t={t} t0={661.9} text="SAILING HOME" color={C.rojo} x={960} y={150} centro size={60} />
      <Apion t={t} t0={655.5} x={1710} y={1075} h={360} acts={[[655.6, "habla"], [658.5, "senala"], [661.9, "festeja"], [663.4, "piensa"]]} />
      <Chip t={t} t0={663.4} text="SOUTH COAST OF SICILY" color={C.oro} tinta={C.noche} x={960} y={960} centro size={52} />
    </Escena>

    {/* 665,03 · "Polybius says the ship captains warned the consuls. Dangerous season, no safe harbors. The consuls ignored them." */}
    <Escena t={t} t0={665.03} t1={673.57} entra="fundido" sale="baja" fondo="none" quieta golpes={[665.1, 668.1, 669.5, 672.4]}>
      <Galera x={960} y={900} s={1.25} t={t} boga={0.2} vela={false} corvus={0} balanceo={0.6} ola={0.5} marines={false} />
      <Persona x={620} y={760} h={420} t={t} seed={161} ropa={CAPITAN} viejo expr={t < 672.4 ? "miedo" : "triste"} habla={t > 665.3 && t < 672.3} bD={t < 668 ? 120 : 150} cD={t < 668 ? 40 : 90} mira={1} />
      <Persona x={1310} y={760} h={450} t={t} seed={162} ropa={PULCRO} expr={t < 672.3 ? "neutro" : "enojado"} flip bD={t > 672.4 ? 80 : 20} cD={t > 672.4 ? 0 : 20} habla={t > 672.4} />
      <Emote t={t} t0={665.6} tipo="excl" {...L(620, 760, 420)} s={0.9} />
      <Emote t={t} t0={672.5} tipo="enojo" {...L(1310, 760, 450)} s={0.9} />
      <Chip t={t} t0={665.1} t1={668.0} text="POLYBIUS: THE CAPTAINS WARNED" color={C.violeta} x={960} y={130} centro size={52} />
      <Chip t={t} t0={668.07} text="⚠ DANGEROUS SEASON" color={C.rojo} x={420} y={130} size={50} />
      <Chip t={t} t0={669.43} text="⚠ NO SAFE HARBORS" color={C.rojo} x={420} y={220} size={50} />
      <Sello t={t} t0={672.4} text="IGNORED" x={1310} y={250} size={110} />
    </Escena>

    {/* 673,57 · "Now picture it from your bench. You cannot see the sky, you only feel it. Climb... fall... climb again. Water through the oar holes. Oars ripped out of hands" */}
    <Escena t={t} t0={673.57} t1={688.55} entra="baja" sale="fundido" fondo="#120a1a" quieta golpes={[673.7, 675.7, 678.6, 680.0, 680.8, 681.9, 685.5]}>
      {(() => {
        const ola = interpolate(t, [677.2, 678.55, 680.0, 680.77, 681.9, 688.5], [0, -9, 9, -10, 8, -6], cl) + (t > 682 ? Math.sin(t * 2.1) * 7 : 0);
        return (
          <Cam t={t} k={[[673.6, 960, 560, 1.0], [675.6, 820, 720, 1.5], [677.2, 820, 720, 1.5], [678.5, 960, 560, 1.0]]}>
            <Corte t={t} boga={interpolate(t, [673.6, 685.4, 686.5], [0.5, 0.7, 0.2], cl)} caos={interpolate(t, [685.4, 686.4], [0, 1], cl)} agua={interpolate(t, [681.8, 688.5], [0.06, 0.32], cl)} heroeExpr={t < 677 ? "cansado" : "miedo"} luz={0.35} oscuro={0.55} inclina={ola} hortator={false} />
          </Cam>
        );
      })()}
      {[675.8, 679.9, 684.2].map((g) => t > g && t < g + 0.25 ? <AbsoluteFill key={g} style={{ background: "linear-gradient(90deg, transparent 0%, rgba(200,220,255,.22) 15%, transparent 30%, rgba(200,220,255,.22) 50%, transparent 65%, rgba(200,220,255,.22) 85%, transparent 100%)", opacity: 1 - (t - g) / 0.25, pointerEvents: "none" }} /> : null)}
      {t > 681.8 && [360, 960, 1560].map((x, i) => <Salpica key={i} t={t} t0={681.9 + i * 0.25} x={x} y={560 + i * 30} s={1.2} />)}
      {t > 683.8 && [500, 1200].map((x, i) => <Salpica key={"b" + i} t={t} t0={683.8 + i * 0.4} x={x} y={860} s={1.4} />)}
      <Chip t={t} t0={675.71} t1={678.5} text="NO SKY" color={C.violeta} x={960} y={140} centro size={70} />
      <Chip t={t} t0={677.25} t1={678.5} text="YOU ONLY FEEL IT" color={C.rojo} x={960} y={250} centro size={52} />
      {t > 678.55 && t < 681.8 && <Grande t={t} t0={t < 680.01 ? 678.55 : t < 680.77 ? 680.01 : 680.77} text={t < 680.01 ? "CLIMB ↑" : t < 680.77 ? "FALL ↓" : "CLIMB ↑"} y={t > 680.01 && t < 680.77 ? 900 : 200} size={150} color={C.crema} />}
      <Chip t={t} t0={681.81} text="WATER THROUGH THE OAR HOLES" color="#2fb5d8" x={960} y={130} centro size={52} />
      <Chip t={t} t0={685.53} text="OARS RIPPED AWAY" color={C.rojo} x={960} y={230} centro size={58} />
    </Escena>

    {/* 688,49 · "and above you, that heavy crow swings from side to side, pulling the ship over, a little more, with every wave" */}
    <Escena t={t} t0={688.55} t1={693.97} entra="fundido" sale="fundido" fondo="none" quieta golpes={[688.6, 690.95, 692.0, 692.95]}>
      {(() => {
        const sw = Math.sin((t - 688.5) * 2.4);
        const escora = interpolate(t, [690.9, 693.9], [0, 12], cl);
        return (
          <div style={{ position: "absolute", inset: 0, transform: `rotate(${sw * (6 + escora * 0.4) + escora}deg)`, transformOrigin: "960px 820px" }}>
            <Galera x={960} y={700} s={0.9} t={t} boga={0.3} vela={false} corvus={0} balanceo={2} ola={1} agua="#1b1f4c" marines={false} />
          </div>
        );
      })()}
      <Relampago t={t} ts={[689.1, 692.1]} x={700} />
      <Flecha t={t} t0={690.95} x1={1100} y1={300} x2={1300} y2={560} color={C.oro} grosor={16} />
      <Apion t={t} t0={688.6} x={250} y={1050} h={420} borda={1020} flip={false} acts={[[688.7, "senala"], [690.95, "miedo"]]} />
      <Chip t={t} t0={688.6} text="ABOVE YOU: THE CROW" color={C.violeta} x={960} y={130} centro size={56} />
      <Chip t={t} t0={690.95} text="PULLING THE SHIP OVER" color={C.rojo} x={1400} y={250} centro size={48} />
      <Chip t={t} t0={692.03} text="+ A LITTLE MORE" color={C.oro} tinta={C.noche} x={1400} y={340} centro size={42} />
      <Chip t={t} t0={692.93} text="EVERY WAVE" color={C.oro} tinta={C.noche} x={1400} y={420} centro size={42} />
    </Escena>

    {/* 693,99 · "The storm hit near a town called Camarina. Of 364 ships, only 80 survived." */}
    <Escena t={t} t0={693.97} t1={700.51} entra="fundido" sale="fundido" fondo="#1f5c9c" golpes={[694.0, 696.7, 698.9]}>
      {t < 696.69 && <MapaMar t={t} puntos={[{ n: "CAMARINA", t0: 694.2, color: C.rojo }]} zoom={{ n: "CAMARINA", z: 2.6, t: [694.0, 696.0] }} />}
      {t < 696.69 && <Relampago t={t} ts={[695.6]} x={1100} />}
      {t >= 696.4 && <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #2a2d52, #14122a 75%)", opacity: prog(t, 696.4, 696.75) }} />}
      {t >= 696.69 && <Flota t={t} t0={696.69} n={364} hunde={284} tA={[698.9, 700.4]} x={820} y={640} cols={28} s={0.85} />}
      {t >= 696.69 && <Apion t={t} t0={696.7} x={1710} y={1050} h={420} borda={1020} desde="nada" acts={[[696.7, "asombro"], [698.9, "miedo"]]} />}
      {t >= 696.69 && t < 698.87 && <CuentaN t={t} t0={696.69} t1={697.5} de={300} a={364} x={820} y={190} size={140} color={C.crema} suf=" SHIPS" />}
      {t >= 698.87 && <CuentaN t={t} t0={698.87} t1={700.4} de={364} a={80} x={820} y={190} size={140} color="#ff6a6a" suf=" SHIPS LEFT" />}
            {t < 696.69 && <Chip t={t} t0={694.2} text="CAMARINA · 255 BC" color={C.rojo} x={960} y={150} centro size={60} />}
    </Escena>

    {/* 700,51 · "The beaches were covered with wreckage and bodies for miles." → Polybius: "one of the greatest disasters at sea" */}
    <Escena t={t} t0={700.51} t1={707.89} entra="fundido" sale="fundido" fondo="none" quieta golpes={[700.6, 702.3, 704.1, 706.0]}>
      <Cam t={t} k={[[700.5, 960, 540, 1.0], [704.0, 2400, 540, 1.0]]}>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={5200} height={1080}><path d="M 0 760 Q 1300 720 2600 750 Q 3900 780 5200 740 L 5200 1080 L 0 1080 Z" fill="#8a7a7a" /><path d="M 0 800 Q 1300 770 2600 790 Q 3900 810 5200 780 L 5200 1080 L 0 1080 Z" fill="#a8968a" /></svg>
        <Restos t={t} t0={700.6} n={38} />
      </Cam>
      {t >= 704.03 && <AbsoluteFill style={{ background: "rgba(20,18,42,.72)", opacity: prog(t, 704.0, 704.4) }} />}
      <Apion t={t} t0={700.6} x={1640} y={1075} h={440} acts={[[700.8, "triste"], [704.1, "piensa"], [706.0, "asombro"]]} />
      <Chip t={t} t0={700.6} t1={704.0} text="WRECKAGE" color={C.rojo} x={960} y={150} centro size={64} />
      <Chip t={t} t0={702.3} t1={704.0} text="FOR MILES" color={C.oro} tinta={C.noche} x={960} y={260} centro size={56} />
      {t >= 704.03 && <Pergamino x={960} y={560} w={900} abre={prog(t, 704.1, 704.6)} lineas={6} titulo="POLYBIUS · HISTORIES I.37" />}
      <Chip t={t} t0={704.5} text="ONE OF THE GREATEST" color={C.violeta} x={960} y={440} centro size={58} />
      <Chip t={t} t0={705.3} text="DISASTERS AT SEA IN ALL HISTORY" color={C.rojo} x={960} y={540} centro size={52} />
    </Escena>

    {/* 707,89 · "Many historians suspect the heavy crows made it even worse" */}
    <Escena t={t} t0={707.89} t1={711.31} entra="fundido" sale="paneo" fondo="none" quieta golpes={[707.9, 709.5]}>
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${interpolate(t, [707.9, 711.2], [4, 34], cl)}deg)`, transformOrigin: "960px 760px" }}>
        <Galera x={960} y={680} s={0.8} t={t} boga={0} vela={false} corvus={0} balanceo={1} ola={1} agua={null} marines={false} />
      </div>
      <AbsoluteFill style={{ top: 780 }}><svg width={1920} height={300}><path d={`M 0 40 Q 240 ${10 + Math.sin(t * 3) * 20} 480 40 T 960 40 T 1440 40 T 1920 40 L 1920 300 L 0 300 Z`} fill="#1b1f4c" /></svg></AbsoluteFill>
      <Apion t={t} t0={707.9} x={260} y={1050} h={420} borda={1020} flip={false} acts={[[708.0, "piensa"], [709.5, "miedo"]]} />
      <Chip t={t} t0={707.9} text="HISTORIANS SUSPECT" color={C.violeta} x={960} y={130} centro size={52} />
      <Chip t={t} t0={709.5} text="THE CROW MADE IT WORSE" color={C.rojo} x={960} y={230} centro size={58} />
      <Flecha t={t} t0={709.6} x1={1500} y1={320} x2={1180} y2={470} color={C.oro} grosor={16} />
    </Escena>

    {/* 711,31 · "and Rome kept going. Two years later, in 253, another storm sank around 150 ships." */}
    <Escena t={t} t0={711.31} t1={718.63} entra="paneo" sale="fundido" fondo="none" quieta golpes={[711.4, 712.8, 713.8, 715.2, 716.5]}>
      {t < 715.15 && <Galera x={960} y={1040} s={1.5} t={t} boga={0} vela={false} corvus={0} balanceo={0.3} marines={false} />}
      {t < 715.15 && <Persona x={960} y={820} h={480} t={t} seed={163} ropa={CENTURION} casco="centurion" expr="orgullo" camina={1.1} bD={60} cD={40} />}
      {t < 715.15 && <Chip t={t} t0={711.4} text="ROME KEPT GOING" color={C.rojo} x={960} y={140} centro size={64} />}
      {t < 715.15 && <Chip t={t} t0={712.81} text="2 YEARS LATER" color={C.violeta} x={960} y={250} centro size={52} />}
      {t >= 713.81 && t < 715.2 && <Grande t={t} t0={713.81} text="253 BC" x={1450} y={420} size={140} color={C.crema} />}
      {t >= 715.15 && <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #2a2d52, #14122a 75%)", opacity: prog(t, 715.15, 715.5) }} />}
      {t >= 715.15 && <Flota t={t} t0={715.2} n={150} hunde={150} tA={[715.7, 718.3]} x={900} y={620} cols={15} s={1.25} />}
      {t >= 715.15 && <CuentaN t={t} t0={715.75} t1={718.55} de={0} a={150} x={900} y={180} size={130} color={C.crema} pre="~" suf=" SUNK" />}
      {t >= 715.15 && <Apion t={t} t0={715.2} x={1710} y={1050} h={420} borda={1020} desde="nada" acts={[[715.2, "asombro"], [716.3, "miedo"]]} />}
      <Relampago t={t} ts={[715.3, 716.5, 717.6]} x={1380} />
    </Escena>

    {/* 718,63 · 249 BC — Publius Claudius Pulcher y los pollos sagrados */}
    <Escena t={t} t0={718.63} t1={732.33} entra="fundido" sale="fundido" fondo="none" quieta golpes={[718.7, 720.3, 723.9, 726.2, 727.5, 729.7, 731.0]}>
      <Galera x={960} y={1040} s={1.5} t={t} boga={0} vela={false} corvus={0} balanceo={0.3} marines={false} />
      {t < 720.2 && <Grande t={t} t0={718.7} text="249 BC" x={960} y={250} size={150} color={C.crema} />}
      {<Persona x={1240} y={905} h={480} t={t} seed={164} ropa={PULCRO} expr={t < 723.9 ? "orgullo" : t < 727.4 ? "enojado" : "feliz"} habla={t > 729.6 && t < 732.3} bD={t > 727.4 && t < 728.4 ? 160 : 40} cD={t > 727.4 && t < 728.4 ? 10 : 30} flip />}
      <Persona x={560} y={905} h={380} t={t} seed={165} ropa={CIVIL(3)} expr={t < 726 ? "triste" : "sorpresa"} bD={70 + Math.sin(t * 3) * 10} cD={60} camina={t < 720.2 ? 1.2 : 0} />
      {/* jaula con los pollos sagrados y el plato de grano intacto */}
      {t >= 723.0 && (
        <svg style={{ position: "absolute", left: 640, top: 600, overflow: "visible" }} width={360} height={240}>
          <rect x={0} y={0} width={360} height={220} rx={14} fill="none" stroke="#7a4a24" strokeWidth={10} opacity={t < 727.4 ? 1 : 0.4} />
          {Array.from({ length: 7 }, (_, i) => <line key={i} x1={20 + i * 52} y1={0} x2={20 + i * 52} y2={220} stroke="#7a4a24" strokeWidth={6} opacity={t < 727.4 ? 1 : 0.4} />)}
          <ellipse cx={180} cy={226} rx={90} ry={18} fill="#c86a3a" />
          {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={110 + (i * 37) % 140} cy={218 + (i % 3) * 3} r={5} fill="#ffd27a" />)}
        </svg>
      )}
      {t >= 723.0 && <Pollo x={740} y={700} s={0.7} t={t} t0={723.0} cae={727.6} />}
      {t >= 723.0 && <Pollo x={900} y={700} s={0.7} t={t} t0={723.2} cae={727.75} />}
      {t > 723.9 && t < 727.4 && <Emote t={t} t0={724.0} tipo="preg" x={820} y={560} s={0.8} />}
      <Salpica t={t} t0={728.9} x={1250} y={980} s={1.4} />
      <Salpica t={t} t0={729.1} x={1420} y={990} s={1.2} />
      <Chip t={t} t0={720.23} t1={723.8} text="CONSUL P. CLAUDIUS PULCHER" color={C.violeta} x={960} y={140} centro size={52} />
      <Chip t={t} t0={722.87} t1={723.8} text="BEFORE A BATTLE" color={C.oro} tinta={C.noche} x={960} y={240} centro size={46} />
      <Chip t={t} t0={723.91} t1={729.6} text="SACRED CHICKENS: WON'T EAT" color={C.rojo} x={960} y={140} centro size={54} />
      <Chip t={t} t0={726.15} t1={729.6} text="= TERRIBLE OMEN" color={C.oro} tinta={C.noche} x={960} y={240} centro size={48} />
      {t > 729.6 && <div style={{ position: "absolute", left: 960, top: 200, transform: `translateX(-50%) scale(${ent(t, 729.67)})`, background: "#fff", borderRadius: 40, padding: "22px 44px", fontFamily, fontWeight: 700, fontSize: 58, color: C.noche, whiteSpace: "nowrap", boxShadow: "0 10px 0 rgba(0,0,0,.25)" }}>"IF THEY WON'T EAT…{t > 730.99 && <span style={{ color: C.rojo }}> LET THEM DRINK!"</span>}</div>}
    </Escena>

    {/* 732,33 · "He then lost the battle and more than 90 ships. In that same year, yet another Roman fleet was destroyed by a storm." */}
    <Escena t={t} t0={732.33} t1={739.43} entra="fundido" sale="fundido" fondo="none" golpes={[732.4, 733.6, 735.4, 736.3, 737.6]}>
      {t < 735.31 && <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #6a2a1a, #2a1530 75%)" }} />}
      {t < 735.31 && <Flota t={t} t0={732.4} n={120} hunde={93} tA={[733.0, 735.0]} x={960} y={620} cols={15} s={1.25} />}
      {t < 735.31 && <CuentaN t={t} t0={733.0} t1={735.0} de={0} a={90} x={900} y={250} size={104} color={C.crema} pre="+" suf=" SHIPS LOST" />}
      <Apion t={t} t0={732.4} t1={735.3} x={1710} y={1050} h={420} borda={1020} acts={[[732.5, "asombro"], [733.6, "enojado"], [735.4, "miedo"]]} />
      {t < 735.31 && <Chip t={t} t0={732.4} text="BATTLE OF DREPANA: LOST" color={C.rojo} x={960} y={850} centro size={52} />}
      {t >= 735.31 && [[420, 760, 0.5, 0], [1000, 720, 0.6, 0.6], [1560, 780, 0.45, 1.2]].map(([x, y, s, d], i) => (
        <div key={i} style={{ position: "absolute", inset: 0, transform: `rotate(${interpolate(t, [736.5 + d, 739.2], [0, 40 - i * 15], cl)}deg)`, transformOrigin: `${x}px ${y + 40}px` }}>
          <Galera x={x} y={y + interpolate(t, [736.5 + d, 739.4], [0, 160], cl)} s={s} t={t} boga={0.2} vela={false} balanceo={6} ola={1} agua="#1b1f4c" hunde={prog(t, 736.5 + d, 739.4)} marines={false} />
        </div>
      ))}
      {t >= 735.31 && <Relampago t={t} ts={[735.5, 736.4, 737.7, 738.8]} x={960} />}
      {t >= 735.31 && <Apion t={t} t0={735.35} x={1720} y={1050} h={420} borda={1020} desde="nada" acts={[[735.4, "asombro"], [736.4, "miedo"], [738.0, "triste"]]} />}
      {t >= 735.31 && <Chip t={t} t0={735.4} text="SAME YEAR: ANOTHER STORM" color={C.violeta} x={960} y={150} centro size={56} />}
      {t >= 735.31 && <Chip t={t} t0={736.3} text="ANOTHER FLEET GONE" color={C.rojo} x={960} y={250} centro size={52} />}
    </Escena>

    {/* 739,43 · "Polybius adds it all up. In that one war against Carthage, Rome lost around 700 warships, not all to the enemy, a huge number to the weather" */}
    <Escena t={t} t0={739.43} t1={752.81} entra="fundido" sale="fundido" fondo="#14122a" golpes={[739.5, 741.2, 743.2, 745.7, 747.2, 749.1]}>
      {t < 749.13 && <Flota t={t} t0={739.5} n={700} hunde={t > 745.69 ? 700 : 0} tA={[745.8, 748.9]} x={900} y={600} cols={40} s={0.6} />}
      {t < 749.13 && <CuentaN t={t} t0={743.17} t1={745.6} de={0} a={700} x={960} y={160} size={130} color={C.crema} pre="~" suf=" WARSHIPS" />}
      <Chip t={t} t0={739.5} t1={743.1} text="POLYBIUS ADDS IT UP" color={C.violeta} x={960} y={160} centro size={56} />
      <Chip t={t} t0={741.21} t1={743.1} text="ROME vs CARTHAGE" color={C.rojo} x={820} y={930} centro size={50} />
      {t >= 745.69 && t < 749.13 && <Espadas x={560} y={930} s={0.55} />}
      {t >= 745.69 && t < 749.13 && <Chip t={t} t0={745.69} text="SOME: ENEMY" color={C.violeta} x={640} y={905} size={44} />}
      {t >= 747.17 && t < 749.13 && <Nube x={1150} y={930} s={0.55} />}
      {t >= 747.17 && t < 749.13 && <Chip t={t} t0={747.17} text="MANY: WEATHER" color={C.rojo} x={1250} y={905} size={44} />}
      {t >= 749.13 && (
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          {Array.from({ length: 6 * 20 }, (_, i) => {
            const e = ent(t, 749.3 + (i % 20) * 0.03 + Math.floor(i / 20) * 0.08);
            const x = 210 + (i % 20) * 80, y = 360 + Math.floor(i / 20) * 100;
            return <g key={i} transform={`translate(${x} ${y}) scale(${e})`}><circle cx={0} cy={-26} r={14} fill={["#f2b48a", "#c98b62", "#8d5a3b"][i % 3]} /><path d="M -18 20 L -14 -10 L 14 -10 L 18 20 Z" fill={["#9a6a4a", "#7a7a5a", "#8a5a7a", "#2fb5d8"][i % 4]} /></g>;
          })}
        </svg>
      )}
      <Apion t={t} t0={739.6} x={1710} y={1075} h={330} desde="nada" acts={[[739.7, "habla"], [743.2, "asombro"], [745.7, "miedo"], [749.2, "triste"]]} />
      {t >= 749.13 && <CuentaN t={t} t0={750.0} t1={752.0} a={200000} pre="≈ " suf=" MEN" x={900} y={960} size={100} color={C.crema} />}
      {t >= 749.13 && <Chip t={t} t0={749.13} text="EVERY SHIP = A FEW HUNDRED ROWERS" color={C.rojo} x={960} y={190} centro size={56} />}
    </Escena>

    {/* 752,81 · "And remember, you cannot swim. Most people in the ancient world could not. If your ship rolls over far from the beach, your contract is over" */}
    <Escena t={t} t0={752.81} t1={761.37} entra="fundido" sale="fundido" fondo="none" quieta golpes={[752.9, 753.7, 755.0, 757.3, 760.1]}>
      {t < 757.25 && (
        <>
          <Persona x={960} y={1060} h={520} t={t} seed={7} ropa={APION} expr="miedo" bI={150 + Math.sin(t * 9) * 25} bD={150 + Math.cos(t * 9) * 25} cI={40} cD={40} salta={Math.abs(Math.sin(t * 4.5)) * 18} />
          <AbsoluteFill style={{ top: 800 }}><svg width={1920} height={300}><path d={`M 0 40 Q 240 ${10 + Math.sin(t * 3) * 20} 480 40 T 960 40 T 1440 40 T 1920 40 L 1920 300 L 0 300 Z`} fill="#1b1f4c" opacity={0.92} /></svg></AbsoluteFill>
          <Salpica t={t} t0={753.8} x={960} y={820} s={1.6} />
          <Emote t={t} t0={753.8} tipo="susto" {...L(960, 1060, 520)} s={1} />
        </>
      )}
      <Chip t={t} t0={753.71} t1={757.2} text="YOU CANNOT SWIM" color={C.rojo} x={960} y={140} centro size={70} />
      <Chip t={t} t0={755.03} t1={757.2} text="MOST PEOPLE COULDN'T" color={C.violeta} x={960} y={250} centro size={52} />
      {t >= 757.25 && (
        <div style={{ position: "absolute", inset: 0, transform: `rotate(${interpolate(t, [757.6, 759.6], [0, 170], cl)}deg)`, transformOrigin: "960px 700px" }}>
          <Galera x={960} y={660} s={0.6} t={t} boga={0} vela={false} corvus={0} balanceo={3} agua={null} marines={false} />
        </div>
      )}
      {t >= 757.25 && [[420, 0], [700, 0.7], [1240, 0.3], [1520, 1.1]].map(([x, d], i) => (
        <Persona key={i} x={x + Math.sin(t * 2 + i) * 20} y={1010 + Math.sin(t * 5 + i) * 12} h={300} t={t} seed={230 + i} ropa={i === 1 ? APION : CIVIL(i)} expr="miedo" bI={150 + Math.sin(t * 9 + i) * 25} bD={150 + Math.cos(t * 9 + i) * 25} cI={30} cD={30} aparece={757.6 + (d as number)} />
      ))}
      {t >= 757.25 && <AbsoluteFill style={{ top: 760 }}><svg width={1920} height={320}><path d={`M 0 40 Q 240 ${10 + Math.sin(t * 3) * 20} 480 40 T 960 40 T 1440 40 T 1920 40 L 1920 320 L 0 320 Z`} fill="#1b1f4c" /></svg></AbsoluteFill>}
      {t >= 757.25 && <Chip t={t} t0={757.3} text="FAR FROM THE BEACH" color={C.oro} tinta={C.noche} x={960} y={140} centro size={52} />}
      <Sello t={t} t0={760.09} text="CONTRACT: OVER" x={960} y={420} size={110} />
    </Escena>

    {/* 761,37 · "and sometimes the danger was not the weather at all" — el cielo se limpia */}
    <Escena t={t} t0={761.37} t1={764.39} entra="fundido" sale="fundido" fondo="none" golpes={[761.5, 763.0]}>
      <Nube x={960} y={420} s={1.6 * (1 - prog(t, 762.6, 763.3))} />
      {t > 762.6 && <div style={{ position: "absolute", left: 960, top: 420, width: 520, height: 26, background: C.rojo, borderRadius: 13, transform: `translate(-50%,-50%) rotate(-24deg) scaleX(${ent(t, 762.6)})` }} />}
      <Chip t={t} t0={761.5} text="SOMETIMES IT WASN'T" color={C.violeta} x={960} y={150} centro size={56} />
      <Chip t={t} t0={763.0} text="THE WEATHER AT ALL" color={C.rojo} x={960} y={260} centro size={56} />
      <Apion t={t} t0={761.4} x={1640} y={1075} h={420} acts={[[761.5, "piensa"], [762.6, "festeja"], [763.0, "asombro"]]} />
    </Escena>

    {/* 764,39 · "In the year 79, the admiral of the fleet at Misenum was a famous writer, Pliny the Elder." */}
    <Escena t={t} t0={764.39} t1={771.89} entra="fundido" sale="paneo" fondo="none" quieta golpes={[764.4, 765.9, 769.3]}>
      {t < 765.87 && <Grande t={t} t0={764.45} text="AD 79" x={960} y={300} size={170} color={C.crema} />}
      {(
        <>
          <Galera x={420} y={840} s={0.45} t={t} boga={0} vela corvus={null} balanceo={0.4} />
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={640} y={880} width={640} height={200} fill="#b5a080" /><rect x={640} y={880} width={640} height={22} fill="#d8c8a8" />{Array.from({ length: 8 }, (_, i) => <line key={i} x1={640 + i * 80} y1={902} x2={640 + i * 80} y2={1080} stroke="#8a7a60" strokeWidth={4} />)}</svg>
          <Galera x={1560} y={860} s={0.42} t={t} boga={0} vela corvus={null} balanceo={0.4} flip />
          <Persona x={interpolate(t, [764.4, 767.6], [700, 960], cl)} y={890} h={500} t={t} seed={166} ropa={PLINIO} viejo camina={t < 767.6 ? 1.3 : 0} expr={t < 769.2 ? "neutro" : "orgullo"} habla={t > 769.3} bD={110 + Math.sin(t * 2.5) * 12} cD={90} bI={t > 769.3 ? 120 + Math.sin(t * 4) * 20 : 15} cI={20} manoD={<g transform="translate(0 0)"><rect x={-30} y={-60} width={60} height={110} rx={10} fill="#f2ead8" stroke="#c9b8a0" strokeWidth={6} /></g>} />
        </>
      )}
      <Chip t={t} t0={765.87} text="ADMIRAL · FLEET OF MISENUM" color={C.violeta} x={960} y={140} centro size={52} />
      <Chip t={t} t0={767.4} text="+ FAMOUS WRITER" color={C.oro} tinta={C.noche} x={960} y={240} centro size={46} />
      <Chip t={t} t0={769.27} text="PLINY THE ELDER" color={C.rojo} x={560} y={330} centro size={60} />
      {t > 767.4 && <Pergamino x={1380} y={640} w={380} abre={prog(t, 767.5, 768.0)} lineas={5} titulo="NATURAL HISTORY" />}
      {t > 767.4 && <CuentaN t={t} t0={767.6} t1={768.6} a={37} suf=" BOOKS" x={1380} y={480} size={70} color={C.oro} />}
    </Escena>

    {/* 770,47 · "One summer afternoon, he saw a strange cloud rising over the bay, shaped like a pine tree. It was Mount Vesuvius, erupting." */}
    <Escena t={t} t0={771.89} t1={778.17} entra="paneo" sale="fundido" fondo="none" quieta golpes={[771.9, 774.7, 776.1, 777.5]}>
      <Cam t={t} k={[[771.9, 960, 540, 1.0], [776.1, 960, 480, 1.12], [778.2, 960, 460, 1.18]]}>
        <Volcan x={1240} y={720} s={0.75} t={t} erupcion={interpolate(t, [772.0, 777.6], [0.05, 1], cl)} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 960 Q 300 930 640 950 L 760 1080 L 0 1080 Z" fill="#c9a46a" /><path d="M 0 990 Q 300 965 660 985 L 740 1080 L 0 1080 Z" fill="#a8844a" /></svg>
        <Persona x={380} y={1000} h={520} t={t} seed={166} ropa={PLINIO} viejo expr={t < 773 ? "neutro" : "sorpresa"} mira={1} />
      </Cam>
      <Chip t={t} t0={771.9} t1={776.0} text="A STRANGE CLOUD" color={C.violeta} x={420} y={160} size={52} />
      {t >= 774.69 && t < 776.13 && <Pino x={420} y={420} s={0.9 * ent(t, 774.7)} />}
      {t >= 774.69 && t < 776.13 && <Chip t={t} t0={774.69} text="SHAPED LIKE A PINE" color="#3f8f3e" x={420} y={260} size={46} />}
      {t >= 776.13 && <Grande t={t} t0={776.13} text="VESUVIUS" x={620} y={260} size={130} color={C.crema} />}
      {t >= 777.55 && <Chip t={t} t0={777.55} text="ERUPTING" color={C.rojo} x={620} y={390} centro size={60} />}
      {t > 776 && <Particulas t={t} tipo="brasas" n={40} seed={9} />}
    </Escena>

    {/* 778,17 · "And Pliny did what an admiral does. He ordered the warships out, and the rowers pulled straight toward the volcano, to rescue people trapped on the coast." */}
    <Escena t={t} t0={778.17} t1={786.91} entra="fundido" sale="fundido" fondo="none" quieta golpes={[778.2, 780.7, 782.3, 784.9]}>
      <Volcan x={1500} y={640} s={0.6} t={t} erupcion={1} />
      {t < 780.73 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 960 Q 300 930 640 950 L 760 1080 L 0 1080 Z" fill="#c9a46a" /><path d="M 0 990 Q 300 965 660 985 L 740 1080 L 0 1080 Z" fill="#a8844a" /></svg>}
      {t < 780.73 && <Persona x={380} y={990} h={520} t={t} seed={166} ropa={PLINIO} viejo expr="enojado" habla bD={interpolate(t, [778.6, 779.2], [30, 165], cl)} cD={0} mira={1} />}
      {t >= 780.73 && [[300, 800, 0.42], [700, 860, 0.5], [180, 940, 0.55]].map(([x, y, s], i) => (
        <Galera key={i} x={x + (t - 780.7) * (90 + i * 20)} y={y} s={s} t={t} boga={1.1} vela={false} corvus={null} balanceo={1.2} ola={0.6} agua="#2a3a5a" marines={false} />
      ))}
      <Particulas t={t} tipo="brasas" n={50} seed={11} />
      <Chip t={t} t0={778.2} t1={780.7} text="WHAT AN ADMIRAL DOES" color={C.violeta} x={960} y={140} centro size={54} />
      <Chip t={t} t0={780.73} text="ALL SHIPS OUT" color={C.rojo} x={420} y={140} size={56} />
      <Chip t={t} t0={782.27} text="STRAIGHT TOWARD THE VOLCANO" color={C.oro} tinta={C.noche} x={420} y={240} size={46} />
      {t >= 780.73 && (
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <path d="M 260 860 Q 900 700 1420 640" stroke="#fff" strokeWidth={10} strokeDasharray="6 22" strokeLinecap="round" fill="none" pathLength={1} style={{ strokeDasharray: `${prog(t, 780.9, 784.8)} 1` }} />
          <circle cx={1420} cy={640} r={22} fill={C.rojo} opacity={prog(t, 784.6, 784.9)} />
        </svg>
      )}
      {t >= 782.27 && <CuentaN t={t} t0={782.3} t1={784.8} a={30} pre="~" suf=" KM" x={900} y={620} size={100} color={C.crema} />}
      <Chip t={t} t0={784.91} text="TO RESCUE PEOPLE ON THE COAST" color={C.violeta} x={420} y={330} size={42} />
    </Escena>

    {/* 786,91 · "Ash and burning stones fell on the decks. Pliny reached the beach at Stabiae, and he never came back." */}
    <Escena t={t} t0={786.91} t1={793.09} entra="fundido" sale="fundido" fondo="none" quieta golpes={[786.95, 789.8, 791.5]}>
      {t < 789.81 && <Galera x={960} y={760} s={1.0} t={t} boga={0.9} vela={false} corvus={null} balanceo={1.4} ola={0.6} agua="#2a3a5a" marines={false} />}
      {t < 789.81 && (
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          {Array.from({ length: 26 }, (_, i) => {
            const k = ((t - 786.9) * (0.7 + (i % 5) * 0.12) + i * 0.137) % 1;
            const x = 120 + ((i * 263) % 1700) - k * 160, y = -60 + k * 900;
            return <g key={i}><circle cx={x} cy={y} r={10 + (i % 4) * 5} fill={i % 3 ? "#5a4a4a" : "#ff7a3d"} /><line x1={x} y1={y} x2={x + 40} y2={y - 90} stroke={i % 3 ? "#7a6a68" : "#ffb347"} strokeWidth={6} opacity={0.6} strokeLinecap="round" /></g>;
          })}
        </svg>
      )}
      {t < 789.81 && <Chip t={t} t0={786.95} text="ASH + BURNING STONES" color={C.rojo} x={960} y={140} centro size={58} />}
      {t >= 789.81 && (
        <>
          <Playa t={t} noche={1} />
          <Volcan x={1560} y={560} s={0.55} t={t} erupcion={1} />
          <Persona x={760} y={920} h={460} t={t} seed={166} ropa={PLINIO} viejo expr={t < 790.9 ? "miedo" : "triste"} inclina={Math.sin(t * 7) * 5} opacity={1 - prog(t, 791.8, 793.0)} mira={1} />
        </>
      )}
      <Particulas t={t} tipo="brasas" n={50} seed={12} />
      {t >= 789.81 && <Chip t={t} t0={789.81} text="STABIAE" color={C.oro} tinta={C.noche} x={760} y={240} centro size={58} />}
      {t >= 791.51 && <Chip t={t} t0={791.51} text="HE NEVER CAME BACK" color={C.rojo} x={760} y={140} centro size={58} />}
    </Escena>

    {/* 793,09 · "His nephew wrote it all down. We do not know how many of his rowers made it home." */}
    <Escena t={t} t0={793.09} t1={797.89} entra="fundido" sale="fundido" fondo="#2a1530" quieta golpes={[793.1, 795.0, 796.6]}>
      {t < 794.99 && <Persona x={560} y={1000} h={500} t={t} seed={167} ropa={SOBRINO} expr="triste" bD={80 + Math.sin(t * 14) * 6} cD={100} />}
      {t < 794.99 && <Pergamino x={1240} y={560} w={760} abre={prog(t, 793.2, 793.7)} lineas={8} titulo="PLINY THE YOUNGER" />}
      {t < 794.99 && <Chip t={t} t0={793.15} text="HIS NEPHEW WROTE IT DOWN" color={C.violeta} x={960} y={140} centro size={52} />}
      {t >= 794.99 && <Cam t={t} k={[[795.0, 960, 540, 1.0], [797.9, 1060, 560, 1.18]]}><Corte t={t} boga={0} agua={0.06} heroeExpr="miedo" luz={0.45} oscuro={0.4} hortator={false} vacio />{[[330, 880], [760, 600], [1150, 880], [1450, 420]].map(([x, y], i) => <Persona key={i} x={x} y={y} h={300} t={t} seed={180 + i} ropa={CIVIL(i + 2)} expr="triste" opacity={0.42 * (1 - prog(t, 795.6 + i * 0.4, 796.6 + i * 0.4))} />)}</Cam>}
      {t >= 794.99 && <Apion t={t} t0={795.0} x={1600} y={1075} h={460} desde="nada" acts={[[795.0, "piensa"], [796.6, "triste"]]} />}
      {t >= 794.99 && <Chip t={t} t0={795.0} text="HIS ROWERS?" color={C.rojo} x={960} y={160} centro size={70} />}
      {t >= 796.6 && <Grande t={t} t0={796.6} text="?" x={960} y={560} size={260} color={C.crema} />}
    </Escena>
  </>
);
