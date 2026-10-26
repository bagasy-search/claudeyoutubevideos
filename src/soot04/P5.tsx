import React from "react";
import { interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, fontFamily } from "./kit";
import type { Parte } from "./parte";
import { Svg, Bote, Cachalote, Tiburon, Humo, Pala, Galleta } from "./kit3";
import { CartelTrampa, Cuenta, Titulo } from "./hud";
import { Tripulacion, Chico, Marino } from "./reparto";
import { EnBarco, CUBIERTA } from "./estado";

// 486-578 s · TRAMPA 5: EL FUEGO. La ballena muerta amarrada al costado; la plancha de despiece sobre el agua,
// la tira de grasa en espiral subiendo al palo, los tiburones abajo, el horno de ladrillo encendido en la
// cubierta (de día y de noche), el humo negro que se ve desde lejos, el espermaceti y los barriles a la bodega.
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const XS = 52400;
const S = 0.7;
const pz = (t: number, ks: [number, number][]) => interpolate(t, ks.map((k) => k[0]), ks.map((k) => k[1]), cl);
const wx = (t: number) => pz(t, [[488.6, XS + 2600], [491.6, XS + 150]]);
const wy = (t: number) => pz(t, [[569.4, 60], [573, 900]]);
const TABLA_Y = -110;

const Tira: React.FC<{ t: number }> = ({ t }) => {
  if (t < 495.5 || t > 521.5) return null;
  const u = prog(t, 495.6, 503.4);
  const top = interpolate(u, [0, 1], [40, -900]);
  const sw = Math.sin(t * 1.3) * 60 * prog(t, 503, 505);
  const x0 = XS + 250;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: interpolate(t, [520.6, 521.5], [1, 0], cl) }} width={1} height={1}>
      <line x1={XS + 20} y1={-1240} x2={x0 + sw} y2={top - 40} stroke="#3a2a22" strokeWidth={6} />
      <circle cx={XS + 20} cy={-1240} r={22} fill="#6a4a30" />
      <path d={`M ${x0 - 50} 40 Q ${x0 - 60 + sw * 0.5} ${(top + 40) / 2} ${x0 - 60 + sw} ${top} L ${x0 + 60 + sw} ${top} Q ${x0 + 60 + sw * 0.5} ${(top + 40) / 2} ${x0 + 50} 40 Z`} fill="#f4d8c4" stroke="#c88a7a" strokeWidth={6} />
      {Array.from({ length: 8 }, (_, i) => { const yy = 40 + ((top - 40) * (i + 0.5)) / 8; return <line key={i} x1={x0 - 50 + sw * ((40 - yy) / (40 - top))} y1={yy} x2={x0 + 50 + sw * ((40 - yy) / (40 - top))} y2={yy - 20} stroke="#e8a898" strokeWidth={5} />; })}
      {u > 0.98 && <text x={x0 + 130 + sw} y={top + 120} fontFamily={fontFamily} fontWeight={700} fontSize={70} fill="#fff" stroke="#2a1530" strokeWidth={10} paintOrder="stroke">≈1 TON</text>}
    </svg>
  );
};

// plancha de despiece colgada sobre la ballena
const Tabla: React.FC<{ t: number }> = ({ t }) => {
  if (t < 492 || t > 521.5) return null;
  const e = ent(t, 492.2);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: e }} width={1} height={1}>
      <line x1={XS - 260} y1={-230} x2={XS - 230} y2={TABLA_Y} stroke="#3a2a22" strokeWidth={4} />
      <line x1={XS + 520} y1={-220} x2={XS + 500} y2={TABLA_Y} stroke="#3a2a22" strokeWidth={4} />
      <rect x={XS - 260} y={TABLA_Y} width={780} height={22} rx={6} fill="#9a6a3a" stroke="#4a2a10" strokeWidth={4} />
      <line x1={XS - 240} y1={TABLA_Y - 90} x2={XS + 500} y2={TABLA_Y - 90} stroke="#c8b08a" strokeWidth={4} />
    </svg>
  );
};

const Olla: React.FC<{ t: number; x: number }> = ({ t, x }) => (
  <>
    {Array.from({ length: 5 }, (_, i) => { const k = (t * 1.4 + i / 5) % 1; return <Svg key={i} x={x + Math.sin(i * 3) * 30} y={-342 - k * 40}><circle r={6 + k * 10} fill="#f4e2a0" opacity={(1 - k) * 0.9} /></Svg>; })}
  </>
);

export const P5: Parte = {
  a: 486, b: 578,
  keys: [
    { t: 488.6, x: XS + 1300, y: -350, z: 0.34 },
    { t: 491.6, x: XS + 300, y: -250, z: 0.5 },
    { t: 494.2, x: XS + 150, y: -170, z: 0.85 },
    { t: 496.4, x: XS + 160, y: -190, z: 0.8 },
    { t: 501.0, x: XS + 230, y: -480, z: 0.55 },
    { t: 507.2, x: XS + 230, y: -480, z: 0.56 },
    { t: 509.6, x: XS + 200, y: 360, z: 0.5 },
    { t: 513.6, x: XS + 180, y: 330, z: 0.56 },
    { t: 515.6, x: XS + 80, y: -170, z: 1.35 },
    { t: 520.8, x: XS + 90, y: -160, z: 1.3 },
    { t: 523.2, x: XS + 130, y: -340, z: 1.55 },
    { t: 538.6, x: XS + 130, y: -350, z: 1.45 },
    { t: 540.8, x: XS + 120, y: -560, z: 0.6 },
    { t: 548.8, x: XS + 120, y: -540, z: 0.62 },
    { t: 550.2, x: XS + 120, y: -340, z: 1.2 },
    { t: 553.2, x: XS + 120, y: -340, z: 1.15 },
    { t: 555.8, x: XS + 800, y: -1500, z: 0.13 },
    { t: 557.0, x: XS + 700, y: -1400, z: 0.14 },
    { t: 558.8, x: XS + 480, y: -40, z: 0.95 },
    { t: 564.2, x: XS + 500, y: -60, z: 1.0 },
    { t: 565.6, x: XS + 500, y: -60, z: 1.4 },
    { t: 569.2, x: XS + 480, y: -60, z: 1.35 },
    { t: 571.4, x: XS - 20, y: -60, z: 0.8 },
    { t: 576.0, x: XS, y: -100, z: 0.72 },
    { t: 578.4, x: XS, y: -400, z: 0.5 },
  ],
  pal: [[540.2, "noche", 1.5], [549.0, "humo", 2.5], [556.6, "tarde", 2], [568, "dia", 3]],
  mundo: (t) => {
    const x = wx(t), y = wy(t);
    const pela = t >= 495.5 && t < 521 ? ((t - 495.5) * 140) % 260 : 0;
    const resbala = t >= 519.1 && t < 520.6 ? Math.sin((t - 519.1) * 9) * 18 * (1 - prog(t, 519.1, 520.6)) : 0;
    return (
      <>
        <EnBarco t={t} x={XS}>
          <Tripulacion t={t} sin={t > 492 && t < 521 ? [2, 6] : t > 521 && t < 569.5 ? [3, 4, 5, 6] : []} expr={() => (t > 544 && t < 556 ? "triste" : "neutro")} />
          {/* dos hombres alimentan el horno */}
          {t > 521 && t < 569.5 && [0, 1].map((k) => <Marino key={k} i={k === 0 ? 4 : 8} t={t} x={k === 0 ? -150 : 410} h={190} flip={k === 1} expr={t > 544 && t < 556 ? "triste" : "neutro"} bD={80 + Math.sin(t * 4 + k * 2) * 40} cD={40} />)}
          {/* trozos de grasa que vuelan a las ollas, y los chicharrones al fuego */}
          {t > 530 && t < 540 && Array.from({ length: 4 }, (_, i) => { const u = ((t - 530) * 0.9 + i / 4) % 1; return <Svg key={i} x={interpolate(u, [0, 1], [-20, 70 + (i % 2) * 120])} y={-330 - Math.sin(u * Math.PI) * 140} rot={u * 300}><rect x={-22} y={-14} width={44} height={28} rx={8} fill={t > 535.8 ? "#8a5a2a" : "#f4d8c4"} stroke="#5a3418" strokeWidth={4} /></Svg>; })}
          {t > 521 && t < 578 && <><Olla t={t} x={70} /><Olla t={t} x={190} /></>}
          {t > 521 && t < 578 && <Humo x={130} y={-340} t={t} s={t > 543 && t < 557 ? 1.3 : 0.75} n={16} col="#1a1418" op={0.85} viento={-200} />}
        </EnBarco>
        {/* el bote que la remolca y la cadena */}
        {t >= 486.5 && t < 492 && <Bote x={x - 900} y={30} t={t} rema={1} flip />}
        {t >= 486.5 && t < 569.6 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}><path d={`M ${x - 640 * S} ${y - 10} Q ${x - 640 * S - 200} 40 ${t < 491.6 ? x - 700 : XS - 600} ${t < 491.6 ? 0 : -200}`} stroke="#5a5e6a" strokeWidth={9} strokeDasharray="20 8" fill="none" /></svg>}
        {/* la ballena muerta */}
        {t < 574 && <Cachalote x={x} y={y} t={t} s={S} nada={0} rot={t > 569.4 ? 20 * prog(t, 569.4, 573) : 0} />}
        {/* espiral de la tira (rayas que corren sobre el lomo) */}
        {t >= 495.5 && t < 521 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>{Array.from({ length: 5 }, (_, i) => <path key={i} d={`M ${x - 420 + i * 260 - pela} ${y - 150} q 40 80 0 160`} stroke="#f4d8c4" strokeWidth={14} fill="none" opacity={0.85} />)}</svg>}
        {/* brillo del espermaceti y el hombre dentro de la cabeza */}
        {t >= 557.2 && t < 569.4 && <Svg x={x + 480 * S} y={y - 80} s={ent(t, 557.3)}><ellipse rx={200} ry={90} fill="#fff6c8" opacity={0.25 + 0.12 * Math.sin(t * 5)} /></Svg>}
        {t >= 564.3 && t < 569.4 && (
          <>
            <Svg x={x + 430 * S} y={y - 150 * S} s={1}><ellipse rx={60} ry={16} fill="#2a1a10" /></Svg>
            <Marino i={9} t={t} x={x + 430 * S} y={y - 150 * S + pz(t, [[564.4, -40], [565.8, 60], [567.4, 30], [568.4, 60]])} h={150} expr="sorpresa" bD={150} cD={20} />
            {t >= 566.8 && <Svg x={x + 430 * S + 50} y={y - 150 * S - 60 - Math.abs(Math.sin(t * 3)) * 40}><path d="M -26 -30 L 26 -30 L 20 24 L -20 24 Z" fill="#8a8e98" stroke="#3a3e48" strokeWidth={4} /><ellipse cx={0} cy={-30} rx={26} ry={7} fill="#fff6c8" /></Svg>}
          </>
        )}
        <Tira t={t} />
        <Tabla t={t} />
        {/* dos hombres en la plancha; desde 513.9 uno es el chico */}
        {t >= 492.2 && t < 521.5 && (
          <>
            <Marino i={2} t={t} x={XS - 120} y={TABLA_Y} h={190} expr="neutro" manoD={<Pala x={0} y={0} s={0.5} rot={160 + Math.sin(t * 3) * 14} />} />
            {t < 513.8 ? <Marino i={6} t={t} x={XS + 320} y={TABLA_Y} h={190} flip expr="neutro" manoD={<Pala x={0} y={0} s={0.5} rot={200 + Math.sin(t * 3 + 1) * 14} />} />
              : <Chico x={XS + 100 + resbala} y={TABLA_Y} t={t} h={190} expr={t > 519 ? "miedo" : "neutro"} inclina={resbala * 0.8} mira={0.2} miraY={0.8} manoD={<Pala x={0} y={0} s={0.5} rot={180 + Math.sin(t * 3) * 14} />} />}
          </>
        )}
        {/* tiburones */}
        {t >= 507.4 && t < 521.5 && Array.from({ length: 16 }, (_, i) => {
          const r = 380 + (i % 4) * 160, ang = t * (0.35 + (i % 3) * 0.08) + i * 1.3;
          const dir = Math.cos(ang) > 0;
          const sx = x + Math.sin(ang) * r * 1.6, sy = 380 + Math.cos(ang) * r * 0.4 + (i % 4) * 70;
          return <Tiburon key={i} x={sx} y={sy} t={t + i} s={0.95 * ent(t, 507.6 + i * 0.12)} flip={dir} boca={t > 519 ? 1 : (Math.sin(t * 2 + i) > 0.7 ? 1 : 0)} />;
        })}
      </>
    );
  },
  hud: (t) => (
    <>
      <CartelTrampa t={t} t0={486.3} t1={488.5} n={5} nombre="THE FIRE" />
      <Chip t={t} t0={488.7} t1={492.0} text="CHAINED TO THE SHIP" color="#5a5e6a" x={960} y={140} centro size={62} />
      <Titulo t={t} t0={492.1} t1={493.7} text="CUTTING IN" y={200} size={150} color={C.crema} />
      <Chip t={t} t0={493.8} t1={499.0} text="A NARROW PLANK OVER THE WATER" color={C.tierra} x={960} y={140} centro size={56} />
      <Chip t={t} t0={499.1} t1={503.0} text="ONE LONG SPIRAL · LIKE AN ORANGE" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={54} />
      <Chip t={t} t0={503.1} t1={507.3} text="SWINGING OVER THE DECK" color={C.rojo} x={960} y={140} centro size={58} />
      <Chip t={t} t0={507.5} t1={511.1} text="MEANWHILE, BELOW YOU…" color="#1a3a5a" x={960} y={140} centro size={58} />
      <Cuenta t={t} t0={511.2} t1={512.6} de={0} a={36} x={960} y={260} size={150} color={C.crema} suf=" SHARKS" t2={513.8} />
      <Chip t={t} t0={512.3} t1={513.8} text="EATING THE WHALE TOO" color={C.rojo} x={960} y={390} centro size={50} />
      <Chip t={t} t0={513.9} t1={516.5} text="SLIPPERY PLANK" color={C.teal} tinta={C.noche} x={460} y={140} centro size={50} />
      <Chip t={t} t0={514.9} t1={519.0} text="RAZOR-SHARP SPADE" color="#7a7e88" x={960} y={140} centro size={50} />
      <Chip t={t} t0={516.0} t1={519.0} text="A CLOUD OF SHARKS" color={C.rojo} x={1460} y={140} centro size={50} />
      <Titulo t={t} t0={519.1} t1={520.9} text="SLIP = BUFFET" y={200} size={140} color={C.rojo} />
      <Chip t={t} t0={521.1} t1={523.3} text="INTO THE TRYWORKS" color={C.tierra} x={960} y={140} centro size={62} />
      <Chip t={t} t0={523.4} t1={528.7} text="A BRICK FURNACE · ON A WOODEN SHIP FULL OF OIL" color={C.rojo} x={960} y={140} centro size={48} />
      <Titulo t={t} t0={528.8} t1={530.0} text="ON PURPOSE." y={220} size={140} color={C.ambar} />
      <Chip t={t} t0={530.0} t1={535.7} text="BOIL BLUBBER → OIL" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={58} />
      <Chip t={t} t0={532.6} t1={535.7} text="FUEL?" color={C.violeta} x={960} y={250} centro size={50} />
      <Chip t={t} t0={535.8} t1={538.6} text="THE CRISPY SCRAPS" color="#8a5a2a" x={960} y={140} centro size={62} />
      <Titulo t={t} t0={538.7} t1={540.3} text="THE WHALE BURNS ITSELF" y={220} size={110} color={C.rojo} />
      <Cuenta t={t} t0={540.5} t1={543.6} de={0} a={72} x={960} y={250} size={140} color={C.ambar} suf=" HOURS" t2={544.1} />
      <Chip t={t} t0={540.6} t1={544.1} text="DAY AND NIGHT" color={C.violeta} x={960} y={140} centro size={58} />
      <Chip t={t} t0={544.3} t1={549.2} text="BLACK · GREASY SMOKE" color="#1a1418" x={960} y={140} centro size={58} />
      <Chip t={t} t0={546.0} t1={549.2} text="BURNING MEAT + WET DOG" color={C.tierra} x={960} y={250} centro size={50} />
      <Chip t={t} t0={549.4} t1={553.3} text="HAIR" color="#1a1418" x={360} y={140} centro size={50} />
      <Chip t={t} t0={550.3} t1={553.3} text="SKIN" color="#1a1418" x={760} y={140} centro size={50} />
      <Chip t={t} t0={551.2} t1={553.3} text="BUNK" color="#1a1418" x={1160} y={140} centro size={50} />
      <Chip t={t} t0={552.1} t1={553.3} text="HARDTACK" color="#1a1418" x={1560} y={140} centro size={50} />
      {t >= 552.1 && t < 553.4 && <Galleta x={1560} y={380} s={ent(t, 552.2) * 0.8} />}
      <Chip t={t} t0={553.5} t1={557.0} text="SMELL IT BEFORE YOU SEE IT" color={C.violeta} x={960} y={140} centro size={58} />
      <Chip t={t} t0={557.2} t1={564.2} text="THE TREASURE IN THE HEAD" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={58} />
      <Titulo t={t} t0={559.4} t1={564.2} text="SPERMACETI" y={260} size={130} color={C.crema} />
      <Chip t={t} t0={561.4} t1={564.2} text="THE FINEST CANDLE WAX ON EARTH" color={C.violeta} x={960} y={390} centro size={46} />
      <Chip t={t} t0={564.3} t1={569.4} text="CLIMB INSIDE · SCOOP WITH A BUCKET" color={C.rojo} x={960} y={140} centro size={54} />
      <Chip t={t} t0={569.6} t1={572.8} text="BARRELS → BELOW DECK" color={C.tierra} x={960} y={140} centro size={58} />
      <Chip t={t} t0={572.9} t1={575.6} text="AGAIN · AND AGAIN · AND AGAIN" color={C.violeta} x={960} y={140} centro size={56} />
      <Chip t={t} t0={575.6} t1={578.2} text="4 YEARS · UNTIL THE SHIP IS FULL" color={C.rojo} x={960} y={140} centro size={54} />
      {t >= 528.9 && t < 530 && <Emote t={t} t0={528.9} tipo="excl" x={1200} y={480} s={1.5} />}
      {t >= 519.2 && t < 521 && <Emote t={t} t0={519.2} tipo="susto" x={1100} y={420} s={1.4} />}
      {t > 546 && t < 549 && <Emote t={t} t0={546} tipo="sudor" x={960} y={520} s={1.5} />}
    </>
  ),
};
