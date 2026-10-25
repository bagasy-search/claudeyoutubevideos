import React from "react";
import { interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, fontFamily } from "./kit";
import type { Parte } from "./parte";
import { Svg, Bote, Cachalote, Splash, Humo, Hacha, Lanza, Arpon } from "./kit3";
import { CartelTrampa, Cuenta, Titulo } from "./hud";
import { Tripulacion, Chico } from "./reparto";
import { EnBarco, CUBIERTA } from "./estado";

// 370-486 s · TRAMPA 4: EL BOTE. El barco está quieto (x = XS). Baja el bote del medio, cinco remeros de
// espaldas a la ballena (uno es el chico, gorro rojo), el cachalote enorme, el arpón, la línea que humea, la
// zambullida (cámara bajo el agua), el paseo en trineo de Nantucket, la lanza, y otro bote que el cachalote
// hace astillas.
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const XS = 52400;
const XW = 57600; // donde aparece la ballena
const S = 0.7; // escala del cachalote (≈ 16 m al lado de un bote de 9 m)
const pz = (t: number, ks: [number, number][]) => interpolate(t, ks.map((k) => k[0]), ks.map((k) => k[1]), cl);

const ballena = (t: number) => ({
  x: pz(t, [[425, XW], [449, XW + 700], [459.8, XW + 3600]]),
  y: pz(t, [[425.1, 110], [430, 760], [447, 760], [451.2, 110]]),
  rot: t < 421 ? 0 : t < 425.1 ? Math.sin(t * 9) * 10 : t < 430 ? 32 : t < 447 ? 0 : t < 451.2 ? -26 : t < 459.8 ? Math.sin(t * 6) * 3 : 0,
  flip: t < 448,
});
const bote = (t: number) => {
  const w = ballena(t);
  if (t < 390.4) return { x: XS - 80, y: pz(t, [[389.4, -300], [390.4, 30]]) };
  if (t < 425) return { x: pz(t, [[391, XS - 80], [416.9, XW - 1150]]), y: 30 };
  if (t < 450) return { x: pz(t, [[425, XW - 1150], [450, XW - 700]]), y: 30 };
  if (t < 459.8) return { x: w.x - pz(t, [[450, 1700], [452, 1500]]), y: 30 };
  return { x: w.x - pz(t, [[459.8, 1500], [461.5, 1000]]), y: 30 };
};
const X2B = XW - 2400; // el otro bote (el que se rompe)

const Soga: React.FC<{ t: number }> = ({ t }) => {
  if (t < 421 || t > 470.5) return null;
  const b = bote(t), w = ballena(t);
  const x0 = b.x + 230, y0 = b.y - 50, x1 = w.x + (w.flip ? -260 : 260) * S, y1 = w.y - 90;
  const tensa = t > 427.4 && t < 460;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <path d={`M ${x0} ${y0} Q ${(x0 + x1) / 2} ${tensa ? (y0 + y1) / 2 : Math.max(y0, y1) + 120} ${x1} ${y1}`} stroke="#d8c08a" strokeWidth={6} fill="none" />
      {tensa && <path d={`M ${x0} ${y0} Q ${(x0 + x1) / 2} ${(y0 + y1) / 2} ${x1} ${y1}`} stroke="#fff" strokeWidth={2} fill="none" strokeDasharray="14 40" strokeDashoffset={-t * 900} opacity={0.8} />}
    </svg>
  );
};

export const P4: Parte = {
  a: 370, b: 486,
  keys: [
    { t: 371.5, x: XS + 200, y: -560, z: 0.42 },
    { t: 374.8, x: XS, y: -520, z: 0.5 },
    { t: 377.4, x: XS + 2600, y: -500, z: 0.2 },
    { t: 379.6, x: XS + 2400, y: -500, z: 0.21 },
    { t: 381.6, x: XS - 80, y: -270, z: 1.35 },
    { t: 389.0, x: XS - 60, y: -270, z: 1.3 },
    { t: 390.8, x: XS - 40, y: -150, z: 0.85 },
    { t: 393.4, x: XS + 60, y: -110, z: 1.25 },
    { t: 396.0, x: XS + 300, y: -110, z: 1.15 },
    { t: 401.2, x: XS + 1500, y: -120, z: 1.2, e: "lin" },
    { t: 406.0, x: XS + 3200, y: -150, z: 1.0, e: "lin" },
    { t: 408.0, x: XW - 300, y: 120, z: 0.42 },
    { t: 412.0, x: XW - 300, y: 160, z: 0.44 },
    { t: 416.6, x: XW - 650, y: 40, z: 0.55 },
    { t: 418.6, x: XW - 850, y: -120, z: 1.05 },
    { t: 421.0, x: XW - 600, y: -60, z: 0.72 },
    { t: 425.0, x: XW - 550, y: -20, z: 0.62 },
    { t: 428.0, x: XW - 300, y: 380, z: 0.42 },
    { t: 431.0, x: XW - 800, y: -40, z: 1.25, e: "o" },
    { t: 437.0, x: XW - 800, y: -20, z: 1.2 },
    { t: 439.5, x: XW - 300, y: 480, z: 0.4 },
    { t: 444.8, x: XW, y: 520, z: 0.38 },
    { t: 446.6, x: XW - 760, y: -60, z: 1.2 },
    { t: 450.0, x: XW - 600, y: -40, z: 0.9 },
    { t: 452.0, x: XW + 600, y: -150, z: 0.5 },
    { t: 459.6, x: XW + 2900, y: -150, z: 0.5, e: "lin" },
    { t: 461.6, x: XW + 3000, y: -120, z: 0.7 },
    { t: 470.4, x: XW + 3100, y: -140, z: 0.66 },
    { t: 473.0, x: X2B, y: -100, z: 0.6 },
    { t: 478.6, x: X2B, y: -120, z: 0.62 },
    { t: 479.4, x: X2B, y: -60, z: 0.82, e: "o" },
    { t: 483.0, x: X2B, y: 20, z: 0.7 },
    { t: 486.3, x: XW - 300, y: -300, z: 0.3 },
  ],
  pal: [[376, "dia", 3], [464.6, "sangre", 1.8], [470.4, "dia", 2.2]],
  mundo: (t) => {
    const w = ballena(t), b = bote(t);
    const arp = pz(t, [[416.9, 0], [418.5, 0.3], [420.4, 0.3], [420.8, 1]]);
    const otro = t > 470.6 ? prog(t, 478.98, 479.4) : 0;
    const w2up = pz(t, [[476.8, 900], [478.98, 60], [481, 260], [484, 900]]);
    return (
      <>
        <EnBarco t={t} x={XS}>
          <Tripulacion t={t} sin={t > 389.4 ? [1, 3, 5, 7] : []} expr={() => (t > 372.2 && t < 389 ? "sorpresa" : "neutro")} />
          {t < 389.4 && <Chico x={-660} y={CUBIERTA} t={t} expr="sorpresa" salta={372.4} mira={1} />}
        </EnBarco>
        {/* la ballena 1 */}
        {t < 486.8 && (
          <>
            <Cachalote x={w.x} y={w.y} t={t} s={S} rot={w.rot} flip={w.flip} chorro={t < 416 ? Math.max(0, Math.sin(t * 0.9)) : t > 464.9 ? 0 : 0} sangre={t > 464.9 ? prog(t, 464.9, 465.6) : 0}
              arpones={t > 420.9 ? (t > 462.6 ? 2 : 1) : 0} nada={t > 459.8 ? 0.25 : t > 450 ? 1.6 : 1} enojo={t > 421} boca={t > 421 && t < 425 ? 0.6 : 0} />
            {t > 401.3 && t < 406.2 && <Svg x={XW - 200} y={-220} s={ent(t, 401.4)}><text textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={110} fill="#eaf8ff" stroke="#1a3a5a" strokeWidth={12} paintOrder="stroke" opacity={0.5 + 0.5 * Math.sin(t * 3)}>PFFFHHH…</text></Svg>}
          </>
        )}
        {t > 421 && t < 425 && <Splash x={XW} y={0} t={t} t0={421.1} s={2.2} />}
        {t > 425.1 && t < 428 && <Splash x={XW + 200} y={0} t={t} t0={425.2} s={3} />}
        {t > 450.6 && t < 453 && <Splash x={XW + 900} y={0} t={t} t0={450.7} s={3} />}
        <Soga t={t} />
        {/* el bote del chico */}
        {t > 389.4 && t < 486.8 && (
          <>
            <Bote x={b.x} y={b.y} t={t} s={1} rema={t < 390.6 ? 0 : t < 416.9 ? 1 : t > 470 ? 0.3 : 0} arponero={t > 389.6 ? arp + 0.001 : 0}
              rot={t > 450 && t < 459.8 ? -6 : 0}
              gente={t > 459.8 && t < 464 ? <g transform={`translate(160 -150) rotate(${-40 + prog(t, 461, 462.6) * 50})`}><line x1={0} y1={0} x2={0} y2={-300} stroke="#6a4a2a" strokeWidth={8} /><path d="M -10 -300 L 0 -350 L 10 -300 Z" fill="#c8ccd4" /></g> : undefined} />
            {/* "VOS" sobre el remero del gorro rojo */}
            {t > 393.6 && t < 396.2 && <Svg x={b.x - 150} y={b.y - 260 + Math.sin(t * 6) * 8} s={ent(t, 393.7)}><path d="M -18 -60 L 18 -60 L 18 -20 L 36 -20 L 0 20 L -36 -20 L -18 -20 Z" fill={C.lima} stroke="#2a1530" strokeWidth={5} /><text y={-80} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={54} fill={C.lima} stroke="#2a1530" strokeWidth={9} paintOrder="stroke">YOU</text></Svg>}
            {/* el arpón en vuelo */}
            {t > 420.4 && t < 421.0 && <Arpon x={interpolate(t, [420.4, 421], [b.x + 230, XW - 200])} y={interpolate(t, [420.4, 420.7, 421], [b.y - 260, b.y - 400, w.y - 100])} s={1} rot={70} />}
            {/* la línea que humea en la tina, y el que le echa agua */}
            {t > 427.4 && t < 437.3 && <>
              <Humo x={b.x - 200} y={b.y - 60} t={t} s={0.5} n={8} col="#d8d0c8" op={0.7} viento={-60} />
              {Array.from({ length: 6 }, (_, i) => { const k = (t * 2 + i / 6) % 1; return <Svg key={i} x={b.x - 230 + k * 30} y={b.y - 150 + k * 90}><circle r={6} fill="#8ad0ff" /></Svg>; })}
            </>}
            {t > 445.2 && t < 450 && <Hacha x={b.x + 120} y={b.y - 150} s={0.7} rot={-30 + Math.sin(t * 4) * 10} />}
            {t > 450 && t < 459.8 && Array.from({ length: 10 }, (_, i) => <Svg key={i} x={b.x - 300 - ((t * 1400 + i * 160) % 1600)} y={10 + (i % 4) * 26}><line x1={0} y1={0} x2={-180} y2={0} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.7} /></Svg>)}
            {t > 461 && t < 462.8 && <Lanza x={interpolate(t, [461, 462.6], [b.x + 300, w.x - 120])} y={-200} s={0.8} rot={20} />}
          </>
        )}
        {/* "y vos, que vas al fondo con la línea": silueta fantasma que baja */}
        {t > 437.3 && t < 445 && <div style={{ position: "absolute", left: 0, top: 0, opacity: 0.55 }}><Chico x={XW - 600 + prog(t, 437.5, 444.5) * 300} y={60 + prog(t, 437.5, 444.5) * 900} h={200} t={t} expr="miedo" inclina={170} /></div>}
        {/* el otro bote y la segunda ballena */}
        {t > 470.4 && t < 486.8 && (
          <>
            <Bote x={X2B} y={30 - otro * 60} t={t} rema={t < 478.9 ? 1 : 0} roto={otro} arponero={1} />
            <Cachalote x={X2B + 80} y={w2up} t={t} s={S} rot={-38} flip={t < 473.2} nada={1.4} enojo />
            {t > 478.98 && <Splash x={X2B} y={0} t={t} t0={478.98} s={3.4} />}
            {t > 480.4 && [-260, -90, 80, 240, 360].map((dx, i) => (
              <Svg key={i} x={X2B + dx * (1 + prog(t, 480.4, 482) * 0.6)} y={22 + Math.sin(t * 2 + i) * 6} s={ent(t, 480.5 + i * 0.1)}>
                <circle cx={0} cy={-18} r={22} fill={["#f2b48a", "#8d5a3b", "#c98b62", "#f5c7a0", "#6e4128"][i]} />
                <path d="M -40 4 L 40 4" stroke="#8a7a66" strokeWidth={14} strokeLinecap="round" />
              </Svg>
            ))}
          </>
        )}
      </>
    );
  },
  hud: (t) => (
    <>
      <CartelTrampa t={t} t0={370.1} t1={372.1} n={4} nombre="THE BOAT" />
      <Titulo t={t} t0={372.3} t1={375.1} text="ALL HANDS!" y={200} size={150} color={C.ambar} />
      <Chip t={t} t0={375.3} t1={379.7} text="THE SHIP DOESN'T HUNT" color={C.violeta} x={960} y={140} centro size={58} />
      <Chip t={t} t0={376.6} t1={379.7} text="TOO BIG · TOO SLOW" color={C.rojo} x={960} y={250} centro size={50} />
      <Chip t={t} t0={379.9} t1={389.2} text="WHALEBOAT · ~30 FEET" color={C.teal} tinta={C.noche} x={960} y={140} centro size={58} />
      <Chip t={t} t0={382.6} t1={389.2} text="THIN CEDAR PLANKS" color={C.tierra} x={560} y={260} centro size={48} />
      <Chip t={t} t0={384.8} t1={389.2} text="LIGHT → IT FLIES" color={C.lima} tinta={C.noche} x={1360} y={260} centro size={48} />
      <Chip t={t} t0={386.8} t1={389.2} text="THIN → IT BREAKS" color={C.rojo} x={1360} y={360} centro size={48} />
      <Chip t={t} t0={389.4} t1={392.4} text="6 MEN JUMP IN" color={C.violeta} x={960} y={140} centro size={62} />
      <Chip t={t} t0={392.5} t1={394.6} text="5 ROW" color={C.teal} tinta={C.noche} x={960} y={140} centro size={66} />
      <Chip t={t} t0={394.8} t1={396.1} text="THE RULE:" color={C.rojo} x={960} y={140} centro size={66} />
      <Chip t={t} t0={396.3} t1={401.2} text="BACKS TO THE WHALE" color={C.rojo} x={960} y={140} centro size={66} />
      <Chip t={t} t0={398.5} t1={401.2} text="YOU CAN'T SEE IT" color={C.violeta} x={560} y={260} centro size={48} />
      <Chip t={t} t0={399.8} t1={401.2} text="NOT ALLOWED TO LOOK" color={C.violeta} x={1360} y={260} centro size={48} />
      <Chip t={t} t0={401.4} t1={406.1} text="YOU ONLY HEAR IT BREATHE" color="#1a3a5a" x={960} y={140} centro size={58} />
      <Cuenta t={t} t0={406.3} t1={408.0} de={0} a={18} x={560} y={200} size={140} color={C.crema} pre="15–" suf=" M" t2={416.6} />
      <Cuenta t={t} t0={409.0} t1={410.8} de={0} a={40} x={1360} y={200} size={140} color={C.ambar} pre="+" suf=" TONS" t2={416.6} />
      <Chip t={t} t0={412.1} t1={416.6} text="HEAD = 1/3 OF THE BODY" color={C.violeta} x={960} y={950} centro size={56} />
      <Chip t={t} t0={414.0} t1={416.6} text="VS. A WOODEN CANOE" color={C.rojo} x={960} y={330} centro size={52} />
      <Chip t={t} t0={416.9} t1={420.9} text="CLOSE ENOUGH TO TOUCH" color={C.violeta} x={960} y={140} centro size={58} />
      <Titulo t={t} t0={421.0} t1={423.2} text="IRON IN!" y={200} size={160} color={C.rojo} />
      <Chip t={t} t0={423.3} t1={425.0} text="…QUITE REASONABLY, IT PANICS" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={52} />
      <Chip t={t} t0={425.1} t1={427.3} text="IT DIVES" color="#1a3a5a" x={960} y={140} centro size={66} />
      <Chip t={t} t0={427.4} t1={431.6} text="HUNDREDS OF METERS OF ROPE" color={C.tierra} x={960} y={140} centro size={56} />
      <Chip t={t} t0={431.7} t1={437.2} text="THE WOOD SMOKES" color={C.rojo} x={960} y={140} centro size={62} />
      <Chip t={t} t0={433.6} t1={437.2} text="POUR WATER ON IT!" color={C.teal} tinta={C.noche} x={960} y={250} centro size={48} />
      <Chip t={t} t0={437.4} t1={445.0} text="A LOOP ON YOUR ANKLE = STRAIGHT DOWN" color={C.rojo} x={960} y={140} centro size={52} />
      <Chip t={t} t0={445.3} t1={448.0} text="A HATCHET, ALWAYS READY" color={C.violeta} x={960} y={140} centro size={58} />
      <Chip t={t} t0={448.1} t1={450.1} text="SOMETIMES NO TIME" color={C.rojo} x={960} y={140} centro size={62} />
      <Chip t={t} t0={450.3} t1={455.7} text="IT RUNS — YOU GET DRAGGED" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={58} />
      <Titulo t={t} t0={455.9} t1={459.6} text="NANTUCKET SLEIGH RIDE" y={200} size={110} color={C.lima} />
      <Chip t={t} t0={459.8} t1={464.7} text="EXHAUSTED → THE LANCE" color={C.violeta} x={960} y={140} centro size={58} />
      <Titulo t={t} t0={468.8} t1={470.4} text={`"CHIMNEY'S ON FIRE"`} y={200} size={110} color={C.rojo} />
      <Chip t={t} t0={470.6} t1={473.1} text="SOMETIMES IT DOESN'T COOPERATE" color={C.violeta} x={960} y={140} centro size={54} />
      <Chip t={t} t0={473.2} t1={478.8} text="IT TURNS AROUND" color={C.rojo} x={960} y={140} centro size={62} />
      <Titulo t={t} t0={479.0} t1={480.4} text="STOVE BOAT!" y={200} size={150} color={C.rojo} />
      <Chip t={t} t0={480.5} t1={483.0} text="HOLD ON TO A PLANK" color={C.teal} tinta={C.noche} x={960} y={140} centro size={58} />
      <Chip t={t} t0={483.1} t1={486.2} text="HAPPENED ALL THE TIME" color={C.violeta} x={960} y={140} centro size={58} />
      <Chip t={t} t0={484.4} t1={486.2} text="…THE EASY PART" color={C.rojo} x={960} y={250} centro size={50} />
      {t > 372.4 && t < 375 && <Emote t={t} t0={372.4} tipo="excl" x={960} y={500} s={1.6} />}
      {t > 421.2 && t < 425 && <Emote t={t} t0={421.2} tipo="susto" x={760} y={500} s={1.5} />}
      {t > 479.1 && t < 482 && <Emote t={t} t0={479.1} tipo="susto" x={960} y={520} s={1.6} />}
    </>
  ),
};
