import React from "react";
import { interpolate } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Moneda } from "./kit";
import { Persona, Expr, Ropa } from "./persona";
import { CamP, Llave, aPantalla, Llama, SUELO } from "./mundo";
import { CHICO, GUARDIA, SIERVO, Heno, Pulgas } from "./objetos";
import { TarjetaTrampa, Inserto, Ficha, Yo } from "./comun";
import { Acostado } from "./T3";

// TRAMPA 4 · LA LETRINA (415,5-550,2 s). Te levantás con el junco, cruzás el salón dormido hasta la torrecita;
// asiento, agujero y caño que cae al foso (la mancha que ve todo el mundo); el foso de las pinturas lleno de «esto»;
// la chimenea al revés; con qué te limpiás; garderobe ≈ wardrobe; los gong farmers de noche (Londres 1281);
// y el pago del gancho: Château Gaillard 1204, tomado por el caño de la letrina.
export const T0 = 415.5, T1 = 550.2;
export const CAM: Llave[] = [
  [417.8, 5200, 2850, 1.2], [421.0, 5300, 2800, 1.0], [427.4, 7150, 2700, 1.0], [428.6, 7450, 2400, 1.35], [434.2, 7450, 2420, 1.3],
  [437.2, 7480, 3150, 0.8], [440.5, 7560, 3550, 0.85], [443.0, 7600, 3400, 0.66], [448.6, 7650, 3250, 0.6],
  [456.6, 7450, 2400, 1.3], [459.6, 7450, 2420, 1.3], [461.6, 7480, 3000, 0.7], [464.4, 7480, 2950, 0.7], [465.6, 7450, 2400, 1.6], [474.8, 7450, 2420, 1.45],
  [493.0, 7450, 2600, 1.0], [495.0, 7590, 3620, 1.7], [499.9, 7600, 3620, 1.8],
  [511.3, 7640, 3800, 1.0], [513.8, 7450, 2700, 0.72], [538.6, 7450, 2750, 0.72], [542.4, 7450, 2950, 0.66],
  [544.2, 7450, 2420, 1.3], [546.6, 7250, 2650, 1.0], [549.6, 5350, 2800, 0.95],
];
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PISO = 2965, PISO_L = 2470;
const FELIPE: Ropa = { tunica: "#2d5bb5", tunica2: "#1a347a", cinto: "#f7c548", piel: "#f2b48a", piel2: "#d98d66", pelo: "#6a3a1a" };

// dónde está el chico (x, y del pie) y qué hace
const chico = (t: number) => {
  if (t < 419.2) return { x: 5200, y: PISO, modo: "acostado" as const };
  if (t < 421) return { x: 5200, y: PISO, modo: "parado" as const };
  if (t < 427.5) return { x: interpolate(t, [421, 427.5], [5200, 7300], cl), y: PISO, modo: "camina" as const };
  if (t < 428.3) { const u = prog(t, 427.5, 428.3); return { x: 7300 + u * 120, y: PISO + (PISO_L - PISO) * u - Math.sin(u * Math.PI) * 120, modo: "salta" as const }; }
  if (t < 457.5) return { x: 7420, y: PISO_L, modo: "parado" as const };
  if (t < 544.4) return { x: 7450, y: PISO_L + 70, modo: "sentado" as const };
  if (t < 545.2) { const u = prog(t, 544.4, 545.2); return { x: 7420 - u * 120, y: PISO_L + (PISO - PISO_L) * u - Math.sin(u * Math.PI) * 120, modo: "salta" as const }; }
  return { x: interpolate(t, [545.2, 549.4], [7300, 5300], cl), y: PISO, modo: t < 549.4 ? ("camina" as const) : ("parado" as const) };
};

export const Mundo: React.FC<{ t: number; c: CamP }> = ({ t }) => {
  if (t < T0 - 1 || t > T1 + 1) return null;
  const b = chico(t);
  const ex: Expr = t < 421 ? "sorpresa" : t < 428 ? "miedo" : t < 457 ? "neutro" : t < 461.7 ? "triste" : t < 467 ? "sorpresa" : t < 474.9 ? "triste" : t < 543.9 ? "neutro" : t < 548.5 ? "feliz" : "miedo";
  const junco = (
    <g transform="translate(0 -40) scale(0.32)">
      <rect x={-6} y={-200} width={12} height={220} rx={6} fill="#c9b26a" />
      {t > 422.8 && <path d={`M 0 -260 Q ${16 + Math.sin(t * 12) * 5} -230 12 -200 Q 0 -192 -12 -200 Q -14 -230 0 -260 Z`} fill="#ff9a3d" />}
    </g>
  );
  const enManos = t > 422.4 && b.modo !== "sentado";
  return (
    <>
      {/* el salón sigue durmiendo (los mismos de la trampa 3) */}
      {[[5850, 1], [6100, 3], [6450, 5], [6700, 6], [5650, 5], [5980, 6]].map(([x, r], i) => <Acostado key={i} x={x} y={PISO - 10} h={260} t={t} seed={80 + i} ropa={SIERVO(r)} flip={i % 2 === 1} />)}
      {/* vos */}
      {b.modo === "acostado" ? (
        <Acostado x={b.x} y={PISO - 10} h={260} t={t} seed={7} ropa={CHICO} expr={t < 418 ? "dormido" : "sorpresa"} />
      ) : (
        <Persona x={b.x} y={b.y} h={b.y === PISO_L || b.modo === "sentado" ? 220 : 270} t={t} seed={7} ropa={CHICO} expr={ex} camina={b.modo === "camina" ? 1.7 : 0} flip={t > 544.4}
          salta={t > 464.5 && t < 466 ? 464.6 : undefined} mira={t > 460 && t < 466 ? 0 : 0.4} miraY={t > 461.8 && t < 466 ? 1 : 0}
          bD={enManos ? 60 : t > 467.5 && t < 474.5 ? 150 : 8} cD={enManos ? 70 : 10} manoD={enManos ? junco : undefined} />
      )}
      {/* frente del asiento: tapa las piernas cuando estás sentado */}
      {b.modo === "sentado" && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <rect x={7360} y={2440} width={180} height={90} fill="#7a4520" />
          <rect x={7360} y={2440} width={180} height={16} fill="#9a5a2a" />
          {t < 544 && <g transform="translate(7395 2420)"><rect x={-4} y={-60} width={8} height={70} fill="#3a3a48" /><rect x={-12} y={-80} width={24} height={30} rx={6} fill="#c9b26a" /><Llama x={0} y={-86} t={t} s={0.55} seed={5} /></g>}
        </svg>
      )}
      {/* la caída por el caño (flecha) */}
      {t > 434.4 && t < 441.2 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          {/* el caño en corte: tubo de piedra y lo que cae por él */}
          <rect x={7380} y={2480} width={140} height={(SUELO - 2480) * prog(t, 434.5, 435.4)} fill="#2a2030" stroke="#8a8098" strokeWidth={14} />
          {[0, 1].map((k) => { const u = prog(t, 436.2 + k * 1.6, 437.4 + k * 1.6); return u > 0 && u < 1 ? <ellipse key={k} cx={7450 + Math.sin(u * 12) * 18} cy={2500 + (SUELO - 2500) * u * u} rx={34} ry={44} fill="#6a4a22" stroke={C.noche} strokeWidth={6} /> : null; })}
          <line x1={7450} y1={2480} x2={7450} y2={2480 + (SUELO - 2480) * prog(t, 435.3, 440.1)} stroke={C.rojo} strokeWidth={24} strokeLinecap="round" strokeDasharray="40 30" strokeDashoffset={-t * 300} />
          {t > 440.1 && [0, 1, 2, 3, 4, 5].map((i) => { const u = prog(t, 440.1, 441.0); return <circle key={i} cx={7450 + Math.cos(i) * 140 * u} cy={SUELO + 30 - Math.sin(i * 0.5 + 0.4) * 160 * u + 300 * u * u} r={22} fill="#6a5a1a" />; })}
        </svg>
      )}
      {/* la mancha en el muro de afuera */}
      {t > 444.6 && t < 449.4 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <path d={`M 7560 2600 Q 7600 ${2600 + 500 * prog(t, 444.8, 446.4)} 7580 ${2600 + 1100 * prog(t, 444.8, 446.4)}`} stroke="#5a4a1a" strokeWidth={70} fill="none" strokeLinecap="round" opacity={0.85} />
        </svg>
      )}
      {/* el viento que sube por el caño: una chimenea al revés */}
      {t > 461.6 && t < 467 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          {[0, 1, 2, 3, 4].map((i) => { const u = ((t - 461.6) * 1.2 + i / 5) % 1; const y = SUELO - u * (SUELO - 2450); return <path key={i} d={`M ${7450 - 30} ${y + 40} l 30 -40 l 30 40`} stroke="#bfefff" strokeWidth={14} fill="none" strokeLinecap="round" opacity={Math.sin(u * Math.PI)} />; })}
        </svg>
      )}
      {/* los gong farmers en el pozo, de noche */}
      {t > 493.5 && t < 512 && [7280, 7640, 7820].map((x, i) => (
        <Persona key={i} x={x} y={SUELO + 30} h={270} t={t} seed={110 + i} ropa={SIERVO(i + 3)} expr={i === 1 ? "enojado" : "triste"} aparece={494.5 + i * 0.2}
          bD={60 + Math.sin(t * 3 + i) * 40} cD={60} manoD={<g transform="translate(0 30) rotate(30)"><rect x={-6} y={-150} width={12} height={180} fill="#7a4a22" /><path d="M -34 30 L 34 30 L 26 90 L -26 90 Z" fill="#8a8a9a" /></g>} />
      ))}
      {t > 493.5 && t < 512 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <rect x={7440} y={SUELO - 40} width={10} height={60} fill="#3a3a48" />
          <Llama x={7445} y={SUELO - 40} t={t} s={0.9} seed={12} />
        </svg>
      )}
      {/* moscas */}
      {t > 493.5 && t < 512 && <Pulgas t={t} x={7550} y={SUELO - 60} n={10} rad={200} seed={6} />}
    </>
  );
};

// castillo sobre el acantilado (Château Gaillard) en pantalla
const Gaillard: React.FC<{ t: number; cae: number }> = ({ t, cae }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
    <path d="M 700 1080 L 860 640 Q 1000 560 1240 600 L 1500 640 L 1700 1080 Z" fill="#c9a36a" />
    <path d="M 860 640 Q 1000 560 1240 600 L 1500 640 L 1460 700 L 880 700 Z" fill="#a8823a" />
    <g transform={`translate(0 ${cae * 6 * Math.sin(t * 40)})`}>
      <rect x={940} y={380} width={480} height={240} fill="#d8d0c4" />
      {[940, 1060, 1180, 1300].map((x) => <rect key={x} x={x} y={350} width={60} height={40} fill="#d8d0c4" />)}
      <rect x={1020} y={250} width={140} height={370} fill="#e6dfd2" />
      {[1020, 1070, 1120].map((x) => <rect key={x} x={x} y={225} width={36} height={30} fill="#e6dfd2" />)}
      <rect x={1080} y={470} width={60} height={150} rx={30} fill="#3a2a3a" />
      {/* la torrecita de la letrina y su caño */}
      <rect x={1420} y={420} width={80} height={110} fill="#c9c0b2" />
      <rect x={1452} y={530} width={18} height={150} fill="#5a4a1a" opacity={0.8} />
      {/* ventana de la capilla */}
      <path d="M 1220 450 L 1220 420 Q 1240 395 1260 420 L 1260 450 Z" fill="#6ac0e0" />
      <line x1={1090} y1={250} x2={1090} y2={140} stroke="#3a3a48" strokeWidth={8} />
      <path d={`M 1090 140 L ${1190 - cae * 40} ${170 + cae * 60} L 1090 ${200 + cae * 20} Z`} fill={cae > 0.5 ? "#2d5bb5" : C.rojo} />
    </g>
  </svg>
);

export const Capa: React.FC<{ t: number; c: CamP }> = ({ t, c }) => {
  if (t < T0 - 0.5 || t > T1 + 0.6) return null;
  const P = (x: number, y: number) => aPantalla(c, x, y);
  const b = chico(t);
  const bp = P(b.x, b.y);
  const asiento = P(7450, 2446);
  const pozo = P(7620, 3750);
  return (
    <>
      <TarjetaTrampa t={t} t0={415.46} t1={417.9} n={4} nombre="THE GARDEROBE" hora="10 PM" color={C.rosa} />
      <Chip t={t} t0={418.85} t1={422.3} text="YOU NEED THE TOILET" color={C.rojo} x={960} y={140} centro size={62} />
      <Chip t={t} t0={420.32} t1={422.3} text="(4 LITERS OF ALE)" color={C.ambar} tinta={C.noche} x={960} y={250} centro size={50} />
      {t > 419 && t < 421 && <Emote t={t} t0={419.2} tipo="sudor" {...cabeza(bp.x, bp.y, 270 * c.z)} />}
      <Chip t={t} t0={422.87} t1={426.0} text="LIGHT YOUR RUSH LIGHT" color={C.lima} tinta={C.noche} x={160} y={150} size={54} />
      <Chip t={t} t0={424.43} t1={427.3} text="FIND THE GARDEROBE" color={C.rosa} x={160} y={260} size={54} />
      {/* la letrina */}
      {t >= 427.12 && t < 428.6 && <Grande t={t} t0={427.12} text="THE CASTLE TOILET" y={170} size={110} color={C.crema} />}
      <Chip t={t} t0={428.52} t1={434.3} text="SMALL ROOM" color={C.violeta} x={asiento.x - 520} y={asiento.y - 330} size={50} />
      <Chip t={t} t0={430.32} t1={434.3} text="INSIDE THE THICK WALL" color={C.teal} tinta={C.noche} x={asiento.x - 520} y={asiento.y - 230} size={46} />
      <Chip t={t} t0={432.37} t1={434.3} text="STONE OR WOOD SEAT" color={C.tierra} x={asiento.x + 150} y={asiento.y - 60} size={44} />
      <Chip t={t} t0={433.52} t1={434.3} text="+ A HOLE" color={C.rojo} x={asiento.x + 150} y={asiento.y + 40} size={44} />
      <Chip t={t} t0={435.35} t1={440.0} text="A LONG SHAFT" color={C.rojo} x={P(7450, 3000).x + 60} y={P(7450, 3000).y} size={54} />
      <Chip t={t} t0={438.11} t1={440.0} text="…OUT THE OTHER SIDE" color={C.ambar} tinta={C.noche} x={P(7450, 3300).x + 60} y={P(7450, 3300).y} size={46} />
      {t >= 440.14 && t < 441.3 && <Grande t={t} t0={440.14} text="INTO THE MOAT" y={180} size={120} color={C.lima} />}
      <Chip t={t} t0={441.19} t1={443.2} text="OR A PIT AT THE BOTTOM" color={C.tierra} x={960} y={950} centro size={54} />
      <Chip t={t} t0={443.73} t1={449.0} text="OR STRAIGHT DOWN THE OUTSIDE WALL" color={C.rojo} x={960} y={140} centro size={52} />
      {t > 446.5 && t < 449 && <Chip t={t} t0={446.58} text="EVERYBODY COULD SEE THE STAIN" color={C.crema} tinta={C.noche} x={P(7580, 3300).x - 40} y={P(7580, 3300).y} size={44} />}
      {/* inserto: el foso de las pinturas */}
      <Inserto t={t} t0={449.0} t1={456.85} ix={P(7600, 3800).x} iy={P(7600, 3800).y} fondo="#ffd36b" fondo2="#b8541f">
        {(() => {
          const sucio = prog(t, 455.6, 456.3);
          return (
            <>
              <div style={{ position: "absolute", left: 360, top: 200, width: 1200, height: 680, background: "#c9e6ff", border: "40px solid #a8743a", boxShadow: "inset 0 0 0 10px #7a4a22, 0 20px 0 rgba(14,8,40,.4)", overflow: "hidden" }}>
                <svg width={1120} height={600}>
                  <rect x={0} y={380} width={1120} height={220} fill={sucio > 0 ? `rgb(${Math.round(60 + 30 * sucio)},${Math.round(140 - 60 * sucio)},${Math.round(220 - 190 * sucio)})` : "#3c8cdc"} />
                  <rect x={330} y={130} width={460} height={250} fill="#d8d0c4" />
                  {[330, 450, 570, 690].map((x) => <rect key={x} x={x} y={100} width={60} height={40} fill="#d8d0c4" />)}
                  <rect x={500} y={260} width={120} height={120} rx={60} fill="#5a4a3a" />
                  {sucio < 0.5 && <g transform={`translate(${200 + Math.sin(t) * 20} 420)`}><ellipse rx={50} ry={26} fill="#fff" /><path d="M 30 -10 Q 40 -60 60 -60" stroke="#fff" strokeWidth={14} fill="none" /></g>}
                  {t > 452.3 && t < 455.6 && <g transform="translate(820 450)"><ellipse rx={150} ry={34} fill="#3a8a3a" /><path d="M 120 -10 L 220 -30 L 220 10 Z" fill="#3a8a3a" />{[-90, -40, 10, 60].map((x) => <path key={x} d={`M ${x} -30 l 16 -24 l 16 24`} fill="#2a6a2a" />)}<circle cx={150} cy={-26} r={8} fill="#fff" /></g>}
                  {sucio > 0 && Array.from({ length: 6 }, (_, i) => <text key={i} x={120 + i * 170} y={480 + (i % 2) * 50} fontSize={64} opacity={sucio}>💩</text>)}
                </svg>
              </div>
              <Chip t={t} t0={449.64} text="THE FAMOUS CASTLE MOAT" color={C.violeta} x={960} y={120} centro size={58} />
              <Yo t={t} t0={449.5} x={1770} h={500} y={1070} expr={t > 455.6 ? "miedo" : "feliz"} bD={t > 455.6 ? 150 : 100} cD={t > 455.6 ? 150 : 30} mira={-0.8} flip />
              <Chip t={t} t0={450.76} t1={455.7} text="IN ALL THE PAINTINGS" color={C.teal} tinta={C.noche} x={960} y={960} centro size={50} />
              {t > 452.3 && <div style={{ position: "absolute", left: 1350, top: 680, transform: `rotate(-8deg) scale(${ent(t, 452.46)})`, border: `10px solid ${C.rojo}`, borderRadius: 16, padding: "4px 24px", background: "rgba(255,255,255,.9)", fontFamily, fontWeight: 700, fontSize: 56, color: C.rojo, whiteSpace: "nowrap", opacity: 1 - prog(t, 455.4, 455.6) }}>NO CROCODILES</div>}
              {t >= 455.91 && <Grande t={t} t0={455.91} text="FULL OF THIS." y={960} size={110} color={C.crema} />}
            </>
          );
        })()}
      </Inserto>
      {/* sentate */}
      <Chip t={t} t0={457.63} t1={459.5} text="NOW SIT DOWN" color={C.lima} tinta={C.noche} x={960} y={140} centro size={60} />
      <Chip t={t} t0={458.39} t1={461.5} text="IT IS DECEMBER" color="#bfefff" tinta={C.noche} x={960} y={950} centro size={58} />
      {t >= 460.35 && t < 461.8 && <Grande t={t} t0={460.35} text="A CHIMNEY IN REVERSE" y={180} size={100} color={C.crema} />}
      <Chip t={t} t0={461.85} t1={465.4} text="WIND HOWLING UP THE HOLE" color={C.teal} tinta={C.noche} x={160} y={150} size={54} />
      <Chip t={t} t0={464.57} t1={466.9} text="…RIGHT WHERE YOU LEAST WANT IT" color={C.rojo} x={960} y={950} centro size={54} />
      {t > 465.3 && t < 467 && <Emote t={t} t0={465.4} tipo="susto" {...cabeza(bp.x, bp.y - 70 * c.z, 220 * c.z)} />}
      {/* ¿con qué te limpiás? */}
      {t >= 467.45 && t < 469 && <Grande t={t} t0={467.45} text="…AND WIPE WITH?" y={180} size={110} color={C.oro} />}
      {t > 468.6 && t < 474.9 && (
        <>
          <Ficha t={t} t0={468.95} x={420} y={560} label="PAPER" color={C.rojo} tacha={469.3} icono={<g><rect x={-50} y={-60} width={100} height={120} rx={10} fill="#fff" stroke="#ccc" strokeWidth={6} /><circle r={20} fill="#ddd" /></g>} />
          <div style={{ position: "absolute", left: 0, top: 0 }}><Heno x={820} y={560} s={1.1} t={t} t0={470.21} k="heno" /></div>
          <div style={{ position: "absolute", left: 0, top: 0 }}><Heno x={1180} y={560} s={1.1} t={t} t0={471.35} k="musgo" /></div>
          <div style={{ position: "absolute", left: 0, top: 0 }}><Heno x={1540} y={560} s={1.1} t={t} t0={472.47} k="lana" /></div>
          <Chip t={t} t0={470.21} text="HAY" color={C.oro} tinta={C.noche} x={820} y={720} centro size={50} />
          <Chip t={t} t0={471.35} text="MOSS" color={C.lima} tinta={C.noche} x={1180} y={720} centro size={50} />
          <Chip t={t} t0={472.47} text="OLD WOOL" color={C.crema} tinta={C.noche} x={1540} y={720} centro size={50} />
          <Chip t={t} t0={473.45} text="(IF YOU'RE LUCKY)" color={C.violeta} x={1540} y={820} centro size={40} />
        </>
      )}
      {/* inserto: garderobe ≈ wardrobe */}
      <Inserto t={t} t0={474.9} t1={493.1} ix={asiento.x} iy={asiento.y} fondo="#9b7bf0" fondo2="#2d1b69">
        {t < 484.0 ? (
          <>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
              <rect x={260} y={240} width={1400} height={14} rx={7} fill="#7a4a22" />
              {[0, 1, 2].map((i) => (
                <g key={i} transform={`translate(${520 + i * 440} 254) rotate(${Math.sin(t * 2 + i) * 3})`} opacity={ent(t, 476.6 + i * 0.2)}>
                  <path d="M 0 0 L 0 30 M -130 60 L 0 30 L 130 60" stroke="#3a3a48" strokeWidth={8} fill="none" />
                  <path d="M -140 60 L 140 60 L 180 420 L -180 420 Z" fill={["#b5266a", "#2d5bb5", "#5c9a3e"][i]} />
                  <path d="M -140 60 L -220 200 L -170 230 L -120 130 Z M 140 60 L 220 200 L 170 230 L 120 130 Z" fill={["#7a1446", "#1a347a", "#386a22"][i]} />
                </g>
              ))}
              {t > 478.4 && [0, 1, 2, 3, 4].map((i) => { const u = ((t - 478.4) * 0.6 + i / 5) % 1; return <path key={i} d={`M ${400 + i * 280} ${1000 - u * 400} q 30 -40 0 -80 t 0 -80`} stroke="#c9e04a" strokeWidth={16} fill="none" strokeLinecap="round" opacity={Math.sin(u * Math.PI)} />; })}
            </svg>
            <Yo t={t} t0={475.2} x={1770} h={500} y={1070} expr={t > 479.1 ? "enojado" : "sorpresa"} bD={t > 479.1 ? 160 : 40} cD={t > 479.1 ? 150 : 20} mira={-0.8} flip tiembla={t > 479.1 && t < 480} />
            <Chip t={t} t0={475.35} text="AN OLD STORY" color={C.noche} x={960} y={110} centro size={56} />
            <Chip t={t} t0={476.49} text="CLOTHES HUNG IN THE GARDEROBE" color={C.oro} tinta={C.noche} x={960} y={940} centro size={50} />
            {t >= 479.15 && t < 480.3 && <><div style={{ position: "absolute", left: 960, top: 760, width: 820, height: 190, transform: "translate(-50%,-50%)", borderRadius: 30, background: "rgba(14,8,40,.88)", opacity: ent(t, 479.15) }} /><Grande t={t} t0={479.15} text="AMMONIA" y={760} size={130} color="#d9f04a" /></>}
            {t > 480.3 && ["🦟", "🪲", "🦋", "🦟"].map((k, i) => <div key={i} style={{ position: "absolute", left: 500 + i * 300, top: interpolate(t, [480.4 + i * 0.12, 481.2 + i * 0.12], [500, 900], cl), fontSize: 80, transform: `rotate(${prog(t, 480.4, 481) * 180}deg)` }}>{k}</div>)}
            <Chip t={t} t0={480.31} text="KILLS FLEAS + MOTHS" color={C.rojo} x={960} y={760} centro size={58} />
          </>
        ) : (
          <>
            <div style={{ position: "absolute", left: 960, top: 380, transform: "translate(-50%,-50%)", fontFamily, fontWeight: 700, fontSize: 150, color: "#fff", WebkitTextStroke: `12px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap", lineHeight: 1.1, textAlign: "center" }}>
              <span style={{ display: "inline-block", transform: `scale(${ent(t, 484.1)})` }}>GARDE<span style={{ color: C.oro }}>ROBE</span></span>
              <br />
              <span style={{ display: "inline-block", transform: `scale(${ent(t, 485.79)})`, fontSize: 120 }}>≈ WARD<span style={{ color: C.oro }}>ROBE</span></span>
            </div>
            {t > 487 && <div style={{ position: "absolute", left: 1180, top: 95, transform: `rotate(4deg) scale(${ent(t, 487.01, 0, { damping: 7, stiffness: 260 })})`, border: `10px solid ${C.violeta}`, borderRadius: 16, padding: "4px 24px", background: "rgba(255,255,255,.92)", fontFamily, fontWeight: 700, fontSize: 52, color: C.violeta, whiteSpace: "nowrap" }}>HISTORIANS ARGUE</div>}
            <Chip t={t} t0={489.79} text="BOTH FROM OLD FRENCH" color={C.noche} x={960} y={720} centro size={56} />
            <Chip t={t} t0={491.41} text="« A PLACE TO GUARD YOUR ROBES »" color={C.oro} tinta={C.noche} x={960} y={830} centro size={56} />
          </>
        )}
      </Inserto>
      {/* los gong farmers */}
      <Chip t={t} t0={493.35} t1={495.6} text="SOMEBODY HAD TO CLEAN THE PIT" color={C.tierra} x={960} y={140} centro size={54} />
      {t >= 496.19 && t < 497.8 && <Grande t={t} t0={496.19} text="GONG FARMERS" y={180} size={130} color={C.oro} />}
      <Chip t={t} t0={497.59} t1={500.2} text="WORKED AT NIGHT" color={C.violeta} x={160} y={150} size={56} />
      <Chip t={t} t0={498.71} t1={500.2} text="SO NOBODY HAD TO SEE THEM" color={C.noche} x={160} y={260} size={50} />
      {/* inserto: Londres 1281 — nace del pozo */}
      <Inserto t={t} t0={500.2} t1={511.3} ix={pozo.x} iy={pozo.y} fondo="#c9773a" fondo2="#3a1a10">
        <div style={{ position: "absolute", left: 960, top: 150, transform: `translate(-50%,-50%) scale(${ent(t, 500.39)})`, fontFamily, fontWeight: 700, fontSize: 120, color: C.crema, WebkitTextStroke: `10px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>LONDON · 1281</div>
        {Array.from({ length: 13 }, (_, i) => <Persona key={i} x={260 + i * 108} y={560} h={220} t={t} seed={120 + i} ropa={SIERVO(i)} expr={i % 3 === 0 ? "enojado" : "triste"} aparece={501.9 + i * 0.05} ladea={Math.sin(t * 3 + i) * 5} habla={t > 509.9 && i % 4 === 1} />)}
        <Chip t={t} t0={502.35} text="13 MEN" color={C.ambar} tinta={C.noche} x={260} y={640} size={54} />
        {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 760 + i * 140, top: 640, fontSize: 90, transform: `scale(${ent(t, 502.67 + i * 0.12)})` }}>🌙</div>)}
        <Chip t={t} t0={503.09} text="5 NIGHTS" color={C.violeta} x={1500} y={660} size={54} />
        <Chip t={t} t0={504.89} text="ONE PRISON CESSPIT" color={C.rojo} x={960} y={820} centro size={58} />
        {t > 506.5 && ["MISERABLE", "DANGEROUS", "PAID WELL"].map((k, i) => <Chip key={k} t={t} t0={[507.09, 508.29, 509.11][i]} text={k} color={[C.violeta, C.rojo, C.lima][i]} tinta={i === 2 ? C.noche : C.crema} x={360 + i * 520} y={950} size={54} />)}
        {t > 509.2 && [0, 1, 2, 3].map((i) => <Moneda key={i} x={1540 + i * 70} y={interpolate(t, [509.2 + i * 0.08, 509.6 + i * 0.08], [800, 900], cl)} r={30} t={t} gira={2} />)}
        {t >= 509.91 && <Grande t={t} t0={509.91} text="WHO ELSE WOULD DO IT?" y={300} size={100} color={C.crema} />}
      </Inserto>
      {/* el gancho se paga: el punto débil */}
      {t >= 511.81 && t < 515.2 && <Grande t={t} t0={511.81} text="THE PART THAT SHOULD WORRY" y={170} size={90} color={C.crema} />}
      <Chip t={t} t0={513.57} t1={515.2} text="…THE GUARDS" color={C.rojo} x={960} y={270} centro size={64} />
      {/* inserto: Château Gaillard, 1204 */}
      <Inserto t={t} t0={515.0} t1={538.9} ix={asiento.x} iy={asiento.y} fondo="#8ad0f0" fondo2="#2d5bb5">
        {(() => {
          const cae = prog(t, 537.95, 538.4);
          const subeX = 1461, subeY = interpolate(t, [526.3, 529.2], [720, 520], cl);
          return (
            <>
              <Gaillard t={t} cae={cae} />
              <div style={{ position: "absolute", left: 960, top: 110, transform: `translate(-50%,-50%) scale(${ent(t, 515.23)})`, fontFamily, fontWeight: 700, fontSize: 110, color: C.crema, WebkitTextStroke: `10px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>1204</div>
              {t < 523.3 && (
                <>
                  <Persona x={340} y={1000} h={460} t={t} seed={46} ropa={FELIPE} expr="orgullo" aparece={516.43} habla={t > 517.3 && t < 519} bD={110} cD={10} />
                  <svg style={{ position: "absolute", left: 340 - 80, top: 1000 - 460 * 0.98 - 30, overflow: "visible", transform: `scale(${ent(t, 516.7)})` }} width={160} height={70}><path d="M 14 62 L 8 8 L 44 38 L 80 0 L 116 38 L 152 8 L 146 62 Z" fill={C.oro} stroke={C.noche} strokeWidth={7} /></svg>
                  <Chip t={t} t0={516.75} text="PHILIP II OF FRANCE" color="#2d5bb5" x={110} y={260} size={50} />
                  <Chip t={t} t0={517.71} text="BESIEGES…" color={C.rojo} x={110} y={360} size={50} />
                  <Chip t={t} t0={518.91} text="CHÂTEAU GAILLARD" color={C.oro} tinta={C.noche} x={1180} y={230} centro size={60} />
                  <Chip t={t} t0={520.21} text="NORMANDY" color={C.teal} tinta={C.noche} x={1180} y={320} centro size={46} />
                  {t > 521.1 && <div style={{ position: "absolute", left: 1640, top: 300, transform: `scale(${ent(t, 521.15)})`, fontSize: 110 }}>🦁</div>}
                  <Chip t={t} t0={521.41} text="RICHARD THE LIONHEART'S FAVORITE" color={C.rojo} x={1180} y={960} centro size={46} />
                </>
              )}
              {t > 523.3 && t < 534.6 && (
                <>
                  <Chip t={t} t0={523.43} text="ONE FAMOUS VERSION…" color={C.noche} x={110} y={230} size={50} />
                  <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: "inset(0 0 360px 0)" }} />
                  <Persona x={subeX} y={subeY + 140} h={190} t={t} seed={31} ropa={GUARDIA} casco="medieval" expr="enojado" bI={170} bD={170} cI={10} cD={10} aparece={525.87} />
                  {[0, 1, 2].map((i) => <Persona key={i} x={1360 - i * 110} y={1000} h={240} t={t} seed={32 + i} ropa={GUARDIA} casco="medieval" expr="feliz" aparece={526.8 + i * 0.1} flip />)}
                  <Chip t={t} t0={526.79} text="A SOLDIER + A FEW COMPANIONS" color={C.ambar} tinta={C.noche} x={110} y={330} size={46} />
                  {t >= 528.75 && t < 533.6 && <Grande t={t} t0={528.75} text="UP THE TOILET CHUTE" x={540} y={610} size={66} color={C.oro} />}
                  {t > 530.1 && (
                    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
                      <path d="M 1300 1000 Q 1180 700 1240 455" stroke="#fff" strokeWidth={10} strokeDasharray="24 18" fill="none" pathLength={100} strokeDashoffset={100 - 100 * prog(t, 530.4, 531.9)} />
                    </svg>
                  )}
                  <Chip t={t} t0={530.11} text="ANOTHER VERSION: THE CHAPEL WINDOW" color={C.teal} tinta={C.noche} x={110} y={430} size={42} />
                  {t >= 533.59 && <Grande t={t} t0={533.67} text="EITHER WAY: THEY WERE IN" y={915} size={90} color={C.lima} />}
                </>
              )}
              {t > 534.9 && (
                <>
                  {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 980 + (i % 3) * 140, top: 300 + Math.floor(i / 3) * 120, fontFamily, fontWeight: 700, fontSize: 80, color: C.rojo, transform: `scale(${ent(t, 535.6 + i * 0.08)}) rotate(${(i % 2 ? 1 : -1) * 12}deg)` }}>!</div>)}
                  <Chip t={t} t0={535.57} text="ENOUGH NOISE" color={C.rojo} x={110} y={230} size={54} />
                  <Chip t={t} t0={536.13} text="TO PANIC THE DEFENDERS" color={C.ambar} tinta={C.noche} x={110} y={330} size={50} />
                  {t >= 537.95 && <Grande t={t} t0={537.95} text="THE CASTLE FELL." y={900} size={110} color={C.crema} />}
                </>
              )}
            </>
          );
        })()}
      </Inserto>
      {/* todo castillo tiene un punto débil — el caño, iluminado */}
      {t > 538.9 && t < 543.9 && (() => {
        const a = P(7450, 2480), z = P(7450, SUELO);
        return <div style={{ position: "absolute", left: a.x - 70, top: a.y - 40, width: 140, height: z.y - a.y + 80, borderRadius: 70, border: `12px solid ${C.rojo}`, boxShadow: `0 0 60px ${C.rojo}`, opacity: ent(t, 539.1) * (0.75 + 0.25 * Math.sin(t * 8)) }} />;
      })()}
      {t >= 539.13 && t < 541 && <Grande t={t} t0={539.13} text="EVERY CASTLE HAS A WEAKNESS" y={940} size={86} color={C.crema} />}
      <Chip t={t} t0={541.25} t1={543.9} text="THE ONE PLACE NOBODY WANTS TO LOOK AT" color={C.rojo} x={960} y={170} centro size={50} />
      <Chip t={t} t0={544.01} t1={546.4} text="FINISH VERY, VERY QUICKLY" color={C.lima} tinta={C.noche} x={960} y={140} centro size={56} />
      {t >= 548.23 && t < 550.4 && <Grande t={t} t0={548.23} text="SOMETHING MOVES…" y={190} size={110} color={C.crema} />}
      {t > 548.4 && t < 550.6 && Array.from({ length: 6 }, (_, i) => { const p = P(5450 + i * 30, 2950); return <div key={i} style={{ position: "absolute", left: p.x, top: p.y - 20 - Math.abs(Math.sin(t * 14 + i)) * 26, width: 8, height: 46, borderRadius: 4, background: "#c9b26a", transform: `rotate(${Math.sin(t * 12 + i) * 30}deg)` }} />; })}
    </>
  );
};
