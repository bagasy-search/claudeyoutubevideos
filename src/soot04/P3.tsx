import React from "react";
import { interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, fontFamily } from "./kit";
import type { Parte } from "./parte";
import { Svg, Ballenero, Bote, Rata, Cucaracha, Lampara, Galleta, Cachalote } from "./kit3";
import { CartelTrampa, Cuenta, Titulo } from "./hud";
import { Persona, MARINO } from "./persona";
import { Chico, Tripulacion, Marino } from "./reparto";
import { EnBarco, CUBIERTA, bx } from "./estado";

// 266-370 s · TRAMPA 3: EL CASTILLO DE PROA. La cámara entra por el corte del casco al triángulo oscuro de la
// proa (literas, lámpara de aceite, agua, cucarachas, ratas, la comida, el escorbuto). Después sale, sube al
// vigía del palo mayor (semanas sin ver nada) y termina en el gam con otro ballenero.
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const POLI = "440,-200 848,-226 736,22 440,22";
const CAMAS: [number, number][] = [0, 1, 2].flatMap((r) => [0, 1, 2].map((k) => [458 + k * 88, -192 + r * 62] as [number, number]));
const PISO = 18;
const X2 = (t: number) => bx(t) + interpolate(t, [347.0, 352.0, 365.6, 370.5], [5600, 2300, 2300, 5800], cl);

const Proa: React.FC<{ t: number }> = ({ t }) => {
  if (t < 266.8 || t > 332) return null;
  const op = interpolate(t, [266.8, 268.4, 330.4, 332], [0, 1, 1, 0], cl);
  const oscuro = interpolate(t, [283.6, 284.6, 294.4, 295.2, 300.6, 301.6], [0.2, 0.5, 0.5, 0.72, 0.72, 0.42], cl);
  const nCab = Math.round(interpolate(t, [277.0, 280.2], [4, 18], cl));
  const comida = (a: number, b: number) => (t > a && t < b ? ent(t, a) * interpolate(t, [b - 0.3, b], [1, 0], cl) : 0);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <defs><clipPath id="proa"><polygon points={POLI} /></clipPath></defs>
      <g clipPath="url(#proa)">
        <rect x={430} y={-240} width={430} height={280} fill="#2a1a10" />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={430} y1={-200 + i * 26} x2={860} y2={-206 + i * 26} stroke="#1a0e08" strokeWidth={3} />)}
        {/* literas: tablones y durmientes (cabeza + manta) */}
        {CAMAS.map(([cx, cy], i) => (
          <g key={i}>
            <rect x={cx} y={cy} width={80} height={52} fill="#3a2214" stroke="#6a4224" strokeWidth={4} />
            {[0, 1].map((k) => {
              const n = i * 2 + k;
              if (n >= nCab) return null;
              const s = ent(t, 277.0 + n * 0.17);
              const resp = Math.sin(t * 1.6 + n) * 1.5;
              return (
                <g key={k} transform={`translate(${cx + 20 + k * 40} ${cy + 36}) scale(${s})`}>
                  <ellipse cx={8} cy={4 + resp * 0.3} rx={22} ry={10 + resp} fill={["#6a3a3a", "#3a5a7a", "#5a6a3a", "#7a6a4a"][n % 4]} />
                  <circle cx={-12} cy={-6} r={9} fill={["#f2b48a", "#c98b62", "#8d5a3b", "#f5c7a0"][n % 4]} />
                </g>
              );
            })}
          </g>
        ))}
        {/* ropa colgada que gotea */}
        {t > 289 && t < 300 && <g opacity={ent(t, 289.4)}>
          <line x1={455} y1={-14} x2={760} y2={-20} stroke="#8a7a5a" strokeWidth={2} />
          {[480, 540, 610].map((px, i) => <path key={i} d={`M ${px} -16 l 30 0 l 4 34 l -38 0 Z`} fill={["#3b7fd8", "#d8443a", "#e8e2d0"][i]} />)}
        </g>}
        {/* gotas del techo y charcos */}
        {t > 289 && t < 331 && Array.from({ length: 7 }, (_, i) => {
          const k = ((t - 289) * 0.8 + i * 0.37) % 1;
          return <circle key={i} cx={470 + i * 44} cy={-196 + k * 214} r={3.5} fill="#8ad0ff" opacity={0.8} />;
        })}
        {t > 289.4 && <ellipse cx={600} cy={PISO + 2} rx={110 * ent(t, 289.6)} ry={6} fill="#5aa0d8" opacity={0.45} />}
        {/* oscuridad + luz de la lámpara */}
        <polygon points={POLI} fill="#05030a" opacity={oscuro} />
        <circle cx={640} cy={-150} r={150} fill="#ffcf6a" opacity={0.1 + 0.04 * Math.sin(t * 11)} />
      </g>
      {/* la comida, sobre el baúl */}
      <rect x={570} y={PISO - 36} width={90} height={36} rx={4} fill="#6a4224" stroke="#3a1a08" strokeWidth={3} />
      {comida(308.5, 314.2) > 0 && <g transform={`translate(615 ${PISO - 50}) scale(${comida(308.5, 314.2) * 0.42})`}>
        <path d="M -60 10 Q -70 -40 -10 -44 Q 60 -50 64 0 Q 50 30 0 28 Q -50 30 -60 10 Z" fill="#a8443a" stroke="#5a1a14" strokeWidth={6} />
        <path d="M -30 -12 Q 0 -30 30 -12" stroke="#f4e6c4" strokeWidth={6} fill="none" />
        {t > 311.2 && <path d="M -20 -60 Q -20 -96 0 -96 Q 20 -96 20 -60" stroke="#9aa0aa" strokeWidth={9} fill="none" transform={`scale(${ent(t, 311.2)})`} />}
      </g>}
      {comida(314.4, 321.4) > 0 && <g transform={`translate(615 ${PISO - 48}) scale(${comida(314.4, 321.4) * 0.45})`}>
        <ellipse cx={0} cy={0} rx={56} ry={36} fill="#8a5a2a" stroke="#4a2a10" strokeWidth={6} />
        <path d="M -50 -12 Q 0 -40 50 -12 Q 40 6 20 -2 Q 0 16 -20 -2 Q -40 8 -50 -12 Z" fill="#3a1a08" />
        <circle cx={-14} cy={6} r={5} fill="#5a3418" /><circle cx={18} cy={12} r={5} fill="#5a3418" />
      </g>}
      {t > 321.4 && t < 324.5 && [0, 1, 2].map((i) => {
        const se = interpolate(t, [322.0 + i * 0.6, 322.4 + i * 0.6], [1, 0], cl) * ent(t, 321.5 + i * 0.08);
        return <circle key={i} cx={590 + i * 26} cy={PISO - 48} r={11 * se} fill="#ff9a2a" stroke="#c86a10" strokeWidth={2} />;
      })}
      {t > 327.1 && t < 331 && <ellipse cx={690} cy={PISO - 108 * 0.7} rx={6} ry={3} fill={C.rojo} opacity={ent(t, 327.1)} />}
      </svg>
      <Lampara x={640} y={-178} t={t} s={0.34} />
      {/* el chico de pie en el piso */}
        <Chico x={520} y={PISO} h={112} t={t}
          expr={t < 277 ? "sorpresa" : t < 284 ? "neutro" : t < 294.7 ? "triste" : t < 300.9 ? "miedo" : t < 304.5 ? "neutro" : t < 308.5 ? "sorpresa" : t < 314.3 ? "miedo" : t < 321.5 ? "feliz" : "triste"}
          bD={t > 301 && t < 321 ? 70 : 8} cD={40} mira={0.6} salta={314.6} />
      {t > 323.8 && <Marino i={4} t={t} x={690} y={PISO} h={108} expr={t < 327 ? "triste" : "miedo"} flip />}
      {/* bichos */}
      {t > 294.7 && t < 301 && Array.from({ length: 9 }, (_, i) => {
        const k = ((t - 294.7) * 0.22 + i * 0.11) % 1;
        const x = 450 + k * 280, y = i % 3 === 0 ? -190 + i * 18 : PISO - 2;
        return <Cucaracha key={i} x={x} y={y} t={t + i} s={0.34 * ent(t, 294.8 + i * 0.12)} rot={90} />;
      })}
      {t > 296.6 && t < 301 && [0, 1].map((i) => {
        const k = prog(t, 296.7 + i * 0.6, 300.8);
        return <Rata key={i} x={460 + k * 300 - i * 60} y={PISO} t={t} s={0.34 * ent(t, 296.7 + i * 0.6)} />;
      })}
      {comida(300.9, 308.4) > 0 && <><Galleta x={615} y={PISO - 52} s={0.15 * comida(300.9, 308.4)} rota={t > 303} />
        {t > 304.5 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}><g transform={`translate(${650} ${PISO - 60}) scale(${ent(t, 304.5) * 0.5})`}><rect x={-22} y={-30} width={44} height={50} rx={6} fill="#e8e2d0" stroke="#5a4020" strokeWidth={4} /><rect x={-18} y={-26} width={36} height={12} fill="#5a3418" /><path d="M 22 -16 q 16 4 0 22" stroke="#5a4020" strokeWidth={4} fill="none" /></g></svg>}</>}
    </div>
  );
};

const Vigia: React.FC<{ t: number }> = ({ t }) => {
  if (t < 338.6 || t > 348.4) return null;
  return <Chico x={0} y={-1252} h={130} t={t} expr={t < 346.6 ? "triste" : "sorpresa"} mira={t < 346 ? Math.sin(t * 0.7) * 0.8 : 1} salta={346.7} bD={t > 346.6 ? 160 : 8} cD={t > 346.6 ? 30 : 0} />;
};

// cosas que vuelan entre los dos barcos en el gam
const Vuelo: React.FC<{ t: number; t0: number; ida: boolean; k: "carta" | "tabaco"; x1: number; x2: number }> = ({ t, t0, ida, k, x1, x2 }) => {
  const u = prog(t, t0, t0 + 1.3);
  if (u <= 0 || u >= 1) return null;
  const x = ida ? interpolate(u, [0, 1], [x1, x2]) : interpolate(u, [0, 1], [x2, x1]);
  const y = -420 - Math.sin(u * Math.PI) * 420;
  return (
    <Svg x={x} y={y} rot={u * 200} s={1.3}>
      {k === "carta" ? <g><rect x={-46} y={-30} width={92} height={60} rx={4} fill="#f4f0e8" stroke="#3a2418" strokeWidth={4} /><path d="M -46 -30 L 0 6 L 46 -30" stroke="#3a2418" strokeWidth={4} fill="none" /><circle cx={0} cy={6} r={9} fill={C.rojo} /></g>
        : <g><rect x={-40} y={-26} width={80} height={52} rx={8} fill="#8a5a2a" stroke="#4a2a10" strokeWidth={5} /><text y={9} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={20} fill="#f4e6c4">TOBACCO</text></g>}
    </Svg>
  );
};
const Burbuja: React.FC<{ t: number; t0: number; t1: number; x: number; y: number; text: string; col?: string; nariz?: number }> = ({ t, t0, t1, x, y, text, col = "#fff" }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const e = ent(t, t0) * interpolate(t, [t1, t1 + 0.3], [1, 0], cl);
  return (
    <Svg x={x} y={y} s={e * 1.6}>
      <rect x={-200} y={-80} width={400} height={130} rx={40} fill={col} stroke="#2a1530" strokeWidth={7} />
      <path d="M -30 48 L -60 110 L 20 48 Z" fill={col} stroke="#2a1530" strokeWidth={7} strokeLinejoin="round" />
      <rect x={-26} y={40} width={50} height={12} fill={col} />
      <text y={6} textAnchor="middle" dominantBaseline="middle" fontFamily={fontFamily} fontWeight={700} fontSize={56} fill="#2a1530">{text}</text>
    </Svg>
  );
};

export const P3: Parte = {
  a: 266, b: 370,
  keys: [
    { t: 267.4, x: 560, y: -300, z: 0.75, rel: true },
    { t: 270.2, x: 640, y: -95, z: 2.25, rel: true, e: "o" },
    { t: 276.8, x: 640, y: -95, z: 2.25, rel: true },
    { t: 278.4, x: 630, y: -90, z: 2.1, rel: true },
    { t: 300.6, x: 630, y: -80, z: 2.2, rel: true },
    { t: 302.0, x: 610, y: -30, z: 3.4, rel: true },
    { t: 321.3, x: 610, y: -30, z: 3.5, rel: true },
    { t: 322.6, x: 625, y: -80, z: 2.4, rel: true },
    { t: 330.4, x: 625, y: -80, z: 2.5, rel: true },
    { t: 333.4, x: 200, y: -620, z: 0.42, rel: true },
    { t: 338.4, x: 100, y: -700, z: 0.45, rel: true },
    { t: 341.4, x: 0, y: -1310, z: 1.7, rel: true },
    { t: 343.8, x: 0, y: -1320, z: 1.6, rel: true },
    { t: 345.8, x: 600, y: -1000, z: 0.28, rel: true },
    { t: 346.6, x: 200, y: -1280, z: 1.25, rel: true, e: "o" },
    { t: 348.0, x: 200, y: -1250, z: 1.15, rel: true },
    { t: 350.6, x: 1200, y: -620, z: 0.36, rel: true },
    { t: 353.4, x: 1150, y: -600, z: 0.38, rel: true },
    { t: 355.0, x: 1150, y: -300, z: 0.62, rel: true },
    { t: 357.2, x: 1150, y: -460, z: 0.5, rel: true },
    { t: 362.0, x: 1150, y: -560, z: 0.42, rel: true },
    { t: 367.6, x: 1150, y: -560, z: 0.4, rel: true },
    { t: 370.0, x: 1500, y: -480, z: 0.34, rel: true },
  ],
  pal: [[268, "tarde", 2], [294.5, "noche", 1.4], [301, "manana", 2], [331.5, "dia", 2.5],
    [335.0, "noche", 0.5], [335.7, "dia", 0.5], [336.4, "noche", 0.5], [337.1, "dia", 0.5], [337.8, "noche", 0.5], [338.6, "tropico", 0.8],
    [359.5, "tarde", 4], [367.7, "manana", 2.2]],
  mundo: (t) => {
    const x = bx(t), x2 = X2(t);
    const enGam = t > 347 && t < 370.6;
    const bote = prog(t, 353.6, 356.6);
    return (
      <>
        <EnBarco t={t} x={x}>
          <Tripulacion t={t} expr={(i) => (t > 359 && t < 367 ? "feliz" : t > 335 && t < 346 ? "triste" : "neutro")} sin={t > 353.4 ? [] : []} capitan={!(t > 353.4 && t < 368)} />
          {(t < 268.4 || (t > 331 && t < 338.6) || t > 348.4) && <Chico x={-660} y={CUBIERTA} t={t} expr={t > 359 && t < 367 ? "feliz" : "neutro"} mira={0.5} />}
          <Proa t={t} />
          <Vigia t={t} />
        </EnBarco>
        {/* el soplo lejano que sueña el vigía */}
        {t > 346.5 && t < 348.6 && <Cachalote x={x + 3200} y={10} t={t} s={0.3} chorro={prog(t, 346.6, 347.0)} nada={0.3} />}
        {/* el otro ballenero (gam) */}
        {enGam && (
          <>
            <Ballenero x={x2} y={0} t={t + 1.7} velas={interpolate(t, [350, 352, 366, 368], [1, 0.3, 0.3, 1], cl)} nombre="PEARL" botes={[true, true, true]} />
            <EnBarco t={t + 1.7} x={x2}>
              {Array.from({ length: 9 }, (_, i) => <Persona key={i} x={-320 + i * 110} y={CUBIERTA} h={200} t={t} seed={130 + i} ropa={MARINO(i + 4)} casco={i % 2 ? "gorro" : "no"} gorroCol={["#e8a030", "#6a3a8a"][i % 2]} pantalon="#3a3a4a" flip={i % 2 === 1} expr={t > 359 && t < 368 ? "feliz" : "neutro"} />)}
              {t > 356.6 && t < 368 && <Persona x={-470} y={CUBIERTA} h={230} t={t} seed={11} ropa={{ tunica: "#1d2a52", tunica2: "#0f1633", cinto: "#0c0f20", piel: "#e8a982", piel2: "#c4835e", pelo: "#3a2616" }} casco="capitan" barba="#3a2616" pantalon="#141a30" expr="feliz" />}
              <Persona x={-560} y={CUBIERTA} h={230} t={t} seed={150} ropa={{ tunica: "#3a2a5a", tunica2: "#1a1030", cinto: "#0c0f20", piel: "#d8a07a", piel2: "#b07a56", pelo: "#8a8a8a" }} casco="capitan" barba="#9a9a9a" pantalon="#141a30" expr={t > 357 ? "feliz" : "neutro"} />
            </EnBarco>
            {t > 353.6 && t < 356.8 && <Bote x={interpolate(bote, [0, 1], [x + 760, x2 - 860])} y={30} t={t} s={0.9}
              gente={<g transform="translate(-60 -50)"><rect x={-22} y={-90} width={44} height={84} rx={14} fill="#1d2a52" /><circle cx={0} cy={-112} r={24} fill="#e8a982" /><rect x={-28} y={-142} width={56} height={18} rx={6} fill="#141a30" /></g>} />}
            {[[355.3, true, "carta"], [355.7, false, "tabaco"], [356.2, true, "tabaco"], [356.6, false, "carta"], [357.1, true, "carta"], [357.8, false, "carta"]].map(([t0, ida, k], i) => (
              <Vuelo key={i} t={t} t0={t0 as number} ida={ida as boolean} k={k as "carta" | "tabaco"} x1={x + 200} x2={x2 - 200} />
            ))}
            <Burbuja t={t} t0={362.2} t1={364.6} x={x + 300} y={-820} text="HOW MANY?" />
            <Burbuja t={t} t0={364.8} t1={366.3} x={x2 - 300} y={-820} text="YOU FIRST!" />
            <Burbuja t={t} t0={366.4} t1={367.6} x={x + 300} y={-820} text="40 WHALES!" col={C.ambar} />
            <Burbuja t={t} t0={366.6} t1={367.6} x={x2 - 300} y={-820} text="55 WHALES!" col={C.ambar} />
          </>
        )}
      </>
    );
  },
  hud: (t) => (
    <>
      <CartelTrampa t={t} t0={266.1} t1={268.5} n={3} nombre="THE FORECASTLE" />
      <Chip t={t} t0={268.6} t1={270.3} text="WELCOME HOME" color={C.lima} tinta={C.noche} x={960} y={140} centro size={66} />
      <Titulo t={t} t0={270.5} t1={273.4} text="FORECASTLE" y={160} size={110} color={C.crema} />
      <Chip t={t} t0={271.6} t1={276.8} text={`SAY: "FOLKS-UL"`} color={C.violeta} x={960} y={290} centro size={52} />
      <Chip t={t} t0={273.6} t1={276.8} text="FRONT OF THE SHIP · BELOW DECK" color={C.teal} tinta={C.noche} x={960} y={140} centro size={50} />
      <Cuenta t={t} t0={277.0} t1={280.2} de={0} a={20} x={1560} y={220} size={150} color={C.crema} suf=" MEN" t2={283.8} />
      <Chip t={t} t0={280.6} t1={283.8} text="≈ A SMALL KITCHEN" color={C.ambar} tinta={C.noche} x={1560} y={360} centro size={50} />
      <Chip t={t} t0={284.0} t1={285.2} text="NO WINDOWS" color={C.rojo} x={960} y={140} centro size={66} />
      <Chip t={t} t0={285.3} t1={289.3} text="ONE SMOKY LAMP · WHALE OIL" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={289.5} t1={294.5} text="WET FLOOR" color={C.teal} tinta={C.noche} x={460} y={140} centro size={50} />
      <Chip t={t} t0={290.6} t1={294.5} text="WET WALLS" color={C.teal} tinta={C.noche} x={960} y={140} centro size={50} />
      <Chip t={t} t0={291.7} t1={294.5} text="WET CLOTHES · 4 YEARS" color={C.violeta} x={1460} y={140} centro size={50} />
      <Chip t={t} t0={294.8} t1={297.0} text="NIGHT: COCKROACHES" color="#7a3a14" x={960} y={140} centro size={60} />
      <Chip t={t} t0={297.1} t1={299.6} text="THEN THE RATS" color="#6a6470" x={960} y={140} centro size={62} />
      <Chip t={t} t0={299.7} t1={300.8} text="AND THE FOOD" color={C.rojo} x={960} y={140} centro size={62} />
      <Chip t={t} t0={300.9} t1={308.3} text="BREAKFAST: HARDTACK" color={C.tierra} x={960} y={140} centro size={60} />
      <Chip t={t} t0={302.6} t1={304.4} text="FLOUR + WATER" color={C.crema} tinta={C.noche} x={960} y={250} centro size={46} />
      <Chip t={t} t0={304.5} t1={308.3} text="SOAK IT IN COFFEE TO BITE IT" color={C.violeta} x={960} y={250} centro size={46} />
      <Chip t={t} t0={308.5} t1={314.2} text={`LUNCH: "SALT HORSE"`} color={C.rojo} x={960} y={140} centro size={60} />
      <Chip t={t} t0={311.2} t1={314.2} text="…WAS IT A JOKE?" color={C.ambar} tinta={C.noche} x={960} y={250} centro size={46} />
      <Chip t={t} t0={314.4} t1={319.8} text="SUNDAY: DUFF + MOLASSES" color={C.tierra} x={960} y={140} centro size={58} />
      <Chip t={t} t0={319.9} t1={321.4} text="THE HIGHLIGHT OF YOUR WEEK" color={C.lima} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={321.6} t1={324.0} text="FRESH FRUIT: GONE" color={C.rojo} x={960} y={140} centro size={60} />
      <Chip t={t} t0={324.1} t1={327.0} text="TIRED" color={C.violeta} x={460} y={140} centro size={54} />
      <Chip t={t} t0={327.1} t1={330.0} text="BLEEDING GUMS" color={C.rojo} x={760} y={140} centro size={54} />
      <Chip t={t} t0={328.3} t1={330.0} text="OLD WOUNDS REOPEN" color={C.rojo} x={1380} y={250} centro size={50} />
      <Titulo t={t} t0={330.1} t1={331.4} text="SCURVY" y={200} size={170} color={C.rojo} />
      <Chip t={t} t0={331.3} t1={333.7} text="WHAT NOBODY TELLS YOU…" color={C.violeta} x={960} y={140} centro size={58} />
      <Titulo t={t} t0={333.8} t1={335.7} text="NOTHING HAPPENS" y={200} size={130} color={C.crema} />
      <Cuenta t={t} t0={335.8} t1={339.6} de={1} a={97} x={960} y={330} size={120} color={C.crema} pre="DAY " t2={340.2} />
      <Chip t={t} t0={336.4} t1={340.2} text="NOT A SINGLE WHALE" color={C.rojo} x={960} y={460} centro size={50} />
      <Chip t={t} t0={340.2} t1={343.6} text="TOP OF THE MAST · 2 HOURS" color={C.teal} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={343.8} t1={346.4} text="WAITING TO SHOUT 3 WORDS" color={C.violeta} x={960} y={140} centro size={56} />
      <Titulo t={t} t0={346.65} t1={348.0} text="THERE SHE BLOWS!" y={220} size={150} color={C.ambar} />
      <Chip t={t} t0={348.2} t1={351.0} text="ANOTHER WHALER" color={C.violeta} x={960} y={140} centro size={62} />
      <Chip t={t} t0={351.1} t1={353.4} text="BOTH CREWS STOP" color={C.teal} tinta={C.noche} x={960} y={140} centro size={58} />
      <Chip t={t} t0={353.6} t1={355.1} text="CAPTAINS VISIT" color="#1d2a52" x={960} y={140} centro size={58} />
      <Chip t={t} t0={355.2} t1={357.3} text="NEWS · LETTERS · TOBACCO" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={56} />
      <Titulo t={t} t0={357.4} t1={359.2} text="A GAM" y={200} size={170} color={C.lima} />
      <Chip t={t} t0={359.3} t1={362.0} text="YOUR ONLY SOCIAL LIFE FOR MONTHS" color={C.violeta} x={960} y={140} centro size={54} />
      <Titulo t={t} t0={366.45} t1={367.6} text="EVERYBODY LIES" y={200} size={120} color={C.rojo} />
      <Chip t={t} t0={367.8} t1={370.0} text="THEN, ONE MORNING…" color={C.crema} tinta={C.noche} x={960} y={140} centro size={62} />
      {t > 268.7 && t < 270.4 && <Emote t={t} t0={268.7} tipo="susto" x={760} y={600} s={1.3} />}
      {t > 294.9 && t < 297 && <Emote t={t} t0={294.9} tipo="susto" x={760} y={540} s={1.3} />}
      {t > 314.6 && t < 319.6 && <Emote t={t} t0={314.6} tipo="brillos" x={960} y={560} s={1.5} />}
      {t > 324.2 && t < 330 && <Emote t={t} t0={324.2} tipo="sudor" x={1260} y={520} s={1.3} />}
    </>
  ),
};
