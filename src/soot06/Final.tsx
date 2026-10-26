import React from "react";
import { interpolate } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza } from "./kit";
import { Campana, Trampas } from "./kit2";
import { Persona, Ropa } from "./persona";
import { CamP, Llave, aPantalla, Vaca, SUELO } from "./mundo";
import { CHICO, SENOR, DAMA, SIERVO, Perro } from "./objetos";
import { Marcador, Inserto, Yo } from "./comun";
import { PINES } from "./Gancho";
import { Acostado } from "./T3";

// FINAL (813,5-911,6 s). Amanece: el recuento de las 7 trampas. ¿Era una trampa mortal? EL GIRO: afuera, la choza de
// una sola pieza con los animales adentro; sin muros, sin guardias, sin médico, sin reservas. Para un chico de 14 sin nada,
// el castillo era un premio. Y el señor ni estaba: viajaba con toda la casa (camas, tapices, arcones, hasta vidrios),
// por eso en francés los muebles son «meubles». CTA: suscribite + campana; la próxima noche, Roma; ¿qué trampa te agarra primero?
export const T0 = 813.5, T1 = 911.6;
export const CAM: Llave[] = [
  [814.6, 5000, 2300, 0.34], [823.4, 4900, 2300, 0.35], [825.2, 4900, 2300, 0.35], [827.2, 560, 3420, 0.95], [839.0, 560, 3440, 0.95], [840.4, 400, 3480, 1.35],
  [846.4, 420, 3480, 1.4], [848.0, 1100, 3450, 1.1], [849.0, 3400, 2700, 0.42], [850.6, 5300, 2850, 1.0], [856.4, 5300, 2850, 1.05],
  [858.2, 4900, 2400, 0.4], [862.0, 4900, 2400, 0.4], [863.2, 5300, 1500, 0.95], [866.6, 5300, 1500, 0.95],
  [884.8, 5300, 1500, 0.9], [886.6, 5300, 1520, 0.8], [892.6, 5300, 1520, 0.86], [894.4, 5300, 2860, 1.45], [897.0, 5300, 2860, 1.55],
  [911.6, 5300, 2860, 1.4],
];
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PISO = 2965;
const MADRE: Ropa = { tunica: "#8a6a4a", tunica2: "#6a4a2a", cinto: "#5a3418", piel: "#f2c6a0", piel2: "#d99a78", pelo: "#6a3a1a" };

export const Mundo: React.FC<{ t: number; c: CamP }> = ({ t }) => {
  if (t < T0 - 1 || t > T1 + 1) return null;
  return (
    <>
      {/* el salón al amanecer: humo que se va, todos despiertos de a poco */}
      {[[5050, 2], [7000, 4], [5980, 1], [6250, 3], [6550, 5], [6800, 6]].map(([x, r], i) => <Acostado key={i} x={x} y={PISO - 10} h={260} t={t} seed={80 + i} ropa={SIERVO(r)} flip={i % 2 === 1} />)}
      {t < 893 ? <Persona x={5300} y={PISO} h={270} t={t} seed={7} ropa={CHICO} expr={t < 849 ? "triste" : "feliz"} />
        : <Acostado x={5300} y={PISO - 10} h={260} t={t} seed={7} ropa={CHICO} expr="feliz" />}
      {/* la choza cortada: familia + vaca + perro bajo el mismo techo */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <Vaca x={560} y={SUELO} t={t} s={0.6} seed={3} />
        {t > 833.3 && t < 835.2 && <path d={`M 420 ${SUELO - 640} l 0 -60`} stroke={C.oro} strokeWidth={14} />}
      </svg>
      {[[230, SIERVO(2), 300, "triste"], [330, MADRE, 280, "neutro"], [700, SIERVO(5), 190, "neutro"]].map(([x, r, h, e], i) => (
        <Persona key={i} x={(x as number) + (t > 839.2 && t < 846.4 ? Math.sin(t * 60 + i) * 3 : 0)} y={SUELO} h={(h as number) * 0.8} t={t} seed={150 + i} ropa={r as Ropa} expr={t > 839.2 && t < 846.4 ? "miedo" : (e as "triste")} flip={i === 2} bD={t > 839.2 && t < 846.4 ? 120 : 0} cD={t > 839.2 && t < 846.4 ? 130 : 0} bI={t > 839.2 && t < 846.4 ? 120 : 0} cI={t > 839.2 && t < 846.4 ? 130 : 0} />
      ))}
      <Perro x={650} y={SUELO - 40} s={0.45} t={t} duerme />
      {/* el chico de 14 sin nada, en la puerta de la aldea */}
      {t > 846.4 && t < 849.2 && <Persona x={interpolate(t, [846.6, 849], [850, 1500], cl)} y={SUELO} h={270} t={t} seed={7} ropa={CHICO} expr="orgullo" camina={1.6} />}
      {/* el solar vacío: el señor no está */}
      {t > 862 && t < 886 && (
        <>
          <Persona x={interpolate(t, [863.4, 866.6], [5500, 4700], cl)} y={1950} h={330} t={t} seed={40} ropa={SENOR} expr="orgullo" camina={t < 866.6 ? 1.4 : 0} flip opacity={1 - prog(t, 866.2, 866.8)} />
          <Persona x={interpolate(t, [863.6, 866.8], [5650, 4800], cl)} y={1950} h={310} t={t} seed={41} ropa={DAMA} expr="feliz" camina={t < 866.8 ? 1.4 : 0} flip opacity={1 - prog(t, 866.4, 867)} />
        </>
      )}
    </>
  );
};

const Carro: React.FC<{ x: number; y: number; t: number; carga: string[] }> = ({ x, y, t, carga }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 300, height: 220 }}>
    <div style={{ position: "absolute", left: 0, top: 70, width: 300, height: 90, background: "#a8622c", border: `8px solid ${C.noche}`, borderRadius: 12 }} />
    {carga.map((k, i) => <div key={i} style={{ position: "absolute", left: 20 + i * 90, top: 0 - (i % 2) * 20, fontSize: 70 }}>{k}</div>)}
    {[50, 230].map((wx) => <div key={wx} style={{ position: "absolute", left: wx - 36, top: 140, width: 72, height: 72, borderRadius: 36, border: `10px solid ${C.noche}`, background: "#7a4a22", transform: `rotate(${t * 200}deg)`, boxSizing: "border-box" }}><div style={{ position: "absolute", left: 21, top: 0, width: 10, height: 52, background: C.noche }} /></div>)}
  </div>
);

export const Capa: React.FC<{ t: number; c: CamP }> = ({ t, c }) => {
  if (t < T0 - 0.5 || t > T1 + 0.6) return null;
  const P = (x: number, y: number) => aPantalla(c, x, y);
  const choza = P(420, SUELO - 300);
  const yo = P(5300, PISO - 120);
  return (
    <>
      {/* amanecer: el recuento */}
      {t < 815.7 && PINES.map(([x, y, n]) => <div key={n} style={{ position: "absolute", left: 0, top: 0 }}><Marcador t={t} t0={814.4 + n * 0.1} x={P(x, y).x} y={P(x, y).y} n={n} s={0.7} color={C.rojo} /></div>)}
      {t >= 814.13 && t < 815.3 && <Grande t={t} t0={814.13} text="SUNRISE." y={180} size={130} color={C.oro} />}
      {t > 815.6 && t < 823.5 && <div style={{ position: "absolute", left: 70, top: 600, width: 1240, height: 400, borderRadius: 28, background: "rgba(18,10,28,.8)", border: `4px solid ${C.oro}`, opacity: ent(t, 815.7) }} />}
      {[["FROZEN ❄", "#bfefff", 815.73], ["UNDERFED", C.tierra, 816.65], ["HALF DRUNK 🍺", C.ambar, 817.67], ["BITTEN 🐀", C.violeta, 818.63], ["NEARLY BURNED 🔥", C.naranja, 819.31], ["…AND A HOLE IN THE WALL", C.rosa, 821.57]].map(([k, col, t0], i) => (
        <Chip key={i} t={t} t0={t0 as number} t1={823.5} text={k as string} color={col as string} tinta={C.noche} x={110 + (i % 2) * 600} y={640 + Math.floor(i / 2) * 120} size={56} />
      ))}
      {t >= 823.65 && t < 825.3 && <Grande t={t} t0={823.65} text="A DEATH TRAP?" y={540} size={150} color={C.rojo} />}
      {t >= 825.35 && t < 827.1 && <Grande t={t} t0={825.35} text="HERE IS THE TWIST." y={540} size={130} color={C.oro} />}
      {/* la alternativa: la choza */}
      <Chip t={t} t0={826.75} t1={829.5} text="LOOK AT THE ALTERNATIVE" color={C.violeta} x={960} y={140} centro size={56} />
      <Chip t={t} t0={828.01} t1={831.0} text="OUTSIDE THE WALLS: MOST PEOPLE" color={C.teal} tinta={C.noche} x={960} y={240} centro size={48} />
      <Chip t={t} t0={831.21} t1={839.2} text="ONE ROOM" color={C.oro} tinta={C.noche} x={1180} y={180} size={54} />
      <Chip t={t} t0={832.13} t1={839.2} text="TIMBER + MUD" color={C.tierra} x={1180} y={270} size={50} />
      <Chip t={t} t0={833.39} t1={839.2} text="A HOLE IN THE ROOF FOR THE SMOKE" color={C.noche} x={1180} y={350} size={42} />
      <Chip t={t} t0={835.25} t1={839.2} text="ANIMALS UNDER THE SAME ROOF 🐄" color={C.lima} tinta={C.noche} x={1180} y={430} size={42} />
      <Chip t={t} t0={837.79} t1={839.2} text="(TO KEEP EVERYONE WARM)" color={C.rojo} x={1180} y={510} size={42} />
      {t > 839.2 && t < 846.4 && (
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <rect width={1920} height={1080} fill="#2a4a7a" opacity={0.28 * prog(t, 839.2, 839.8)} />
          {Array.from({ length: 70 }, (_, i) => { const x0 = (i * 277) % 2100, y0 = ((i * 151 + t * 1500) % 1200) - 100; return <line key={i} x1={x0} y1={y0} x2={x0 - 22} y2={y0 + 70} stroke="#cfe6ff" strokeWidth={4} opacity={0.55} />; })}
        </svg>
      )}
      {t > 839.2 && t < 846.4 && ["NO STONE WALLS", "NO GUARDS", "NO DOCTOR", "NO FOOD STORED"].map((k, i) => {
        const t0 = [839.31, 840.71, 841.29, 842.67][i];
        return t >= t0 && (
          <div key={k} style={{ position: "absolute", left: 1180, top: 170 + i * 110, transform: `scale(${ent(t, t0)})`, transformOrigin: "left", fontFamily, fontWeight: 700, fontSize: 60, color: "#fff", WebkitTextStroke: `9px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>
            <span style={{ color: C.rojo }}>✕</span> {k}
          </div>
        );
      })}
      {t > 843.9 && t < 846.4 && <Chip t={t} t0={844.0} text="…FOR THE WINTER, BEYOND WHAT THEY GREW" color={C.ambar} tinta={C.noche} x={960} y={980} centro size={42} />}
      {t >= 846.57 && t < 848.5 && <Grande t={t} t0={846.57} text="FOR A 14-YEAR-OLD WITH NOTHING…" y={170} size={78} color={C.crema} />}
      {t >= 848.65 && t < 850.6 && <Grande t={t} t0={848.65} text="A CASTLE JOB = A PRIZE 🏆" y={170} size={96} color={C.oro} />}
      <Chip t={t} t0={850.75} t1={853.2} text="A BED BY THE FIRE" color={C.naranja} tinta={C.noche} x={160} y={150} size={56} />
      <Chip t={t} t0={852.09} t1={853.2} text="(EVEN A BAD ONE)" color={C.violeta} x={160} y={250} size={46} />
      <Chip t={t} t0={853.33} t1={856.4} text="2 MEALS A DAY. EVERY DAY." color={C.lima} tinta={C.noche} x={160} y={150} size={56} />
      <Chip t={t} t0={855.25} t1={856.4} text="EVEN IN A FAMINE YEAR" color={C.rojo} x={160} y={250} size={50} />
      {t > 849.5 && t < 856.4 && <Emote t={t} t0={850.8} tipo="brillos" {...cabeza(yo.x, yo.y + 120 * c.z, 270 * c.z)} />}
      {/* miserable… pero menos */}
      {t > 856.5 && t < 862.2 && (() => {
        const bar = (label: string, v: number, t0: number, y: number, col: string) => (
          <>
            <div style={{ position: "absolute", left: 560, top: y, width: 1100 * v * prog(t, t0, t0 + 0.7), height: 110, background: col, borderRadius: 18, border: `8px solid ${C.noche}`, boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: 540, top: y + 55, transform: "translate(-100%,-50%)", fontFamily, fontWeight: 700, fontSize: 52, color: "#fff", WebkitTextStroke: `8px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap", opacity: ent(t, t0) }}>{label}</div>
          </>
        );
        return (
          <>
            <div style={{ position: "absolute", inset: 0, background: "rgba(14,8,40,.55)" }} />
            <div style={{ position: "absolute", left: 960, top: 300, transform: "translate(-50%,-50%)", fontFamily, fontWeight: 700, fontSize: 70, color: C.crema, WebkitTextStroke: `9px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>MISERY METER</div>
            {bar("🏰 CASTLE", 0.62, 857.41, 430, C.naranja)}
            {bar("🛖 THE VILLAGE HUT", 0.98, 859.55, 600, C.rojo)}
            {t >= 859.45 && <Chip t={t} t0={859.53} text="…JUST A LOT LESS MISERABLE" color={C.lima} tinta={C.noche} x={960} y={820} centro size={56} />}
          </>
        );
      })()}
      {/* el señor ni estaba */}
      {t >= 862.27 && t < 864.0 && <Grande t={t} t0={862.27} text="AND THE LORD HIMSELF?" y={170} size={100} color={C.crema} />}
      <Chip t={t} t0={864.11} t1={866.0} text="THE MAN IT WAS ALL BUILT FOR…" color={C.violeta} x={960} y={140} centro size={52} />
      {t >= 866.03 && t < 867.9 && <Grande t={t} t0={866.21} text="…PROBABLY NOT EVEN THERE." y={940} size={90} color={C.oro} />}
      <Inserto t={t} t0={867.9} t1={884.7} ix={P(5000, 1700).x} iy={P(5000, 1700).y} fondo="#8ad0a0" fondo2="#2a6a4a">
        {(() => {
          const pts: [number, number][] = [[300, 760], [960, 690], [1620, 760]];
          const u = prog(t, 870.4, 873.0);
          return (
            <>
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
                <path d="M 300 700 Q 620 600 960 650 Q 1300 600 1620 700" stroke="#fff" strokeWidth={12} strokeDasharray="30 22" fill="none" pathLength={100} strokeDashoffset={100 - 100 * u} />
                {pts.map(([x, y], i) => (
                  <g key={i} transform={`translate(${x} ${y}) scale(${ent(t, 868.6 + i * 0.25)})`}>
                    <rect x={-90} y={-120} width={180} height={120} fill="#d8d0c4" stroke={C.noche} strokeWidth={8} />
                    {[-90, -30, 30].map((bx) => <rect key={bx} x={bx} y={-150} width={50} height={34} fill="#d8d0c4" stroke={C.noche} strokeWidth={6} />)}
                    <rect x={-20} y={-60} width={40} height={60} rx={20} fill="#3a2a3a" />
                  </g>
                ))}
              </svg>
              <Chip t={t} t0={867.93} text="GREAT LORDS OWNED SEVERAL CASTLES + MANORS" color={C.noche} x={960} y={120} centro size={46} />
              <Chip t={t} t0={870.73} text="TRAVELING ALL YEAR LONG" color={C.oro} tinta={C.noche} x={960} y={210} centro size={50} />
              {t > 868.0 && <Carro x={interpolate(t, [868.1, 884.6], [60, 1360], cl)} y={780} t={t} carga={[
                t > 874.4 ? "🛏️" : "", t > 875.6 ? "🧶" : "", t > 876.6 ? "🧰" : "",
              ]} />}
              {t > 868.0 && <Persona x={interpolate(t, [868.1, 884.6], [60, 1360], cl) + 400} y={1010} h={380} t={t} seed={40} ropa={SENOR} expr="orgullo" camina={1.4} />}
              {t > 877.6 && <div style={{ position: "absolute", left: interpolate(t, [868.1, 884.6], [60, 1360], cl) + 80, top: 660, fontSize: 80, transform: `scale(${ent(t, 877.8)})` }}>🪟</div>}
              <Chip t={t} t0={872.59} t1={879.4} text="WITH THE WHOLE HOUSEHOLD" color={C.violeta} x={960} y={310} centro size={58} />
              <Chip t={t} t0={874.21} t1={879.4} text="BEDS · TAPESTRIES · CHESTS" color={C.rojo} x={960} y={400} centro size={58} />
              <Chip t={t} t0={877.63} t1={879.4} text="…EVEN GLASS WINDOWS" color={C.teal} tinta={C.noche} x={960} y={490} centro size={58} />
              {t >= 879.89 && (
                <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${ent(t, 880.0)})`, textAlign: "center", fontFamily, fontWeight: 700, whiteSpace: "nowrap" }}>
                  <div style={{ fontSize: 56, color: C.noche }}>IN FRENCH, FURNITURE IS STILL…</div>
                  <div style={{ fontSize: 170, color: "#fff", WebkitTextStroke: `14px ${C.noche}`, paintOrder: "stroke fill", transform: `scale(${ent(t, 882.6)})` }}>MEUBLES</div>
                  <div style={{ fontSize: 60, color: C.oro, WebkitTextStroke: `8px ${C.noche}`, paintOrder: "stroke fill", opacity: ent(t, 883.67) }}>= «THE MOVABLE THINGS»</div>
                </div>
              )}
            </>
          );
        })()}
      </Inserto>
      {/* el castillo vacío en la colina */}
      <Chip t={t} t0={885.09} t1={888.5} text="A CASTLE STANDING EMPTY ON A HILL?" color={C.violeta} x={960} y={140} centro size={54} />
      {t >= 888.63 && t < 890.4 && <Grande t={t} t0={889.33} text="IT ALWAYS LOOKED EMPTY" y={170} size={100} color={C.crema} />}
      <Chip t={t} t0={890.45} t1={894.0} text="THE OWNER WAS USUALLY SOMEWHERE ELSE…" color={C.oro} tinta={C.noche} x={960} y={950} centro size={50} />
      <Chip t={t} t0={893.75} t1={897.0} text="…AND THE BOY ON ITS FLOOR" color={C.teal} tinta={C.noche} x={960} y={140} centro size={54} />
      {t >= 895.95 && t < 897.6 && <Grande t={t} t0={895.95} text="WAS JUST HAPPY TO BE INSIDE." y={940} size={90} color={C.oro} />}
      {/* CTA */}
      {t > 897.0 && (() => {
        const k = prog(t, 897.0, 897.5);
        return (
          <>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#4a2f8a, #7a4aa8)", opacity: 0.9 * k }} />
            <Chip t={t} t0={897.75} t1={900.7} text="ENJOYED A NIGHT IN A MEDIEVAL CASTLE?" color={C.violeta} x={960} y={140} centro size={54} />
            {t > 900.6 && t < 905.95 && (
              <div style={{ position: "absolute", left: 420, top: 300, transform: `scale(${ent(t, 900.77, 0, { damping: 8, stiffness: 240 })})`, display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ background: C.rojo, color: "#fff", fontFamily, fontWeight: 700, fontSize: 64, padding: "18px 44px", borderRadius: 20, border: `8px solid ${C.noche}`, boxShadow: "0 12px 0 rgba(14,8,40,.5)", transform: `scale(${1 + 0.05 * Math.sin(t * 6)})` }}>SUBSCRIBE</div>
              </div>
            )}
            {t > 897.7 && t < 905.95 && <Yo t={t} t0={897.8} x={310} y={1080} h={600} expr="neutro" habla bD={112} cD={-10} />}
            {t > 901.4 && t < 905.95 && <div style={{ position: "absolute", left: 0, top: 0 }}><Campana x={940} y={350} s={0.9} t={t} t0={901.5} t0b={901.77} /></div>}
            {t > 902.5 && t < 905.95 && (
              <div style={{ position: "absolute", left: 1150, top: 230, width: 620, height: 380, borderRadius: 30, overflow: "hidden", border: `10px solid ${C.oro}`, background: "linear-gradient(#1c1240, #4a2a6a)", transform: `rotate(3deg) scale(${ent(t, 902.6)})`, boxShadow: "0 16px 0 rgba(14,8,40,.5)" }}>
                <svg width={620} height={380}>
                  <circle cx={500} cy={80} r={44} fill="#f3eec8" />
                  <path d="M 60 340 L 60 200 Q 310 140 560 200 L 560 340 Z" fill="#c9a36a" />
                  {Array.from({ length: 3 }, (_, r) => Array.from({ length: 8 }, (_, i) => <rect key={`${r}-${i}`} x={80 + i * 60} y={210 + r * 42} width={34} height={30} rx={17} fill="#3a2a3a" />))}
                </svg>
                <div style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 40, color: C.oro }}>NEXT TIME:</div>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 52, color: "#fff", WebkitTextStroke: `7px ${C.noche}`, paintOrder: "stroke fill" }}>A NIGHT IN ANCIENT ROME</div>
              </div>
            )}
            {t > 905.95 && (
              <>
                <div style={{ position: "absolute", left: 960, top: 330, transform: `translate(-50%,-50%) scale(${ent(t, 905.95)})`, fontFamily, fontWeight: 700, fontSize: 84, color: "#fff", WebkitTextStroke: `10px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.15 }}>
                  WHICH OF THE <span style={{ color: C.rojo }}>7 TRAPS</span><br />WOULD GET YOU FIRST?
                </div>
                {[["🍲", "SUPPER"], ["🕯️", "DARK"], ["❄️", "COLD"], ["🚽", "TOILET"], ["🐀", "RATS"], ["🛡️", "WATCH"], ["🔥", "FIRE"]].map(([e, k], i) => (
                  <div key={k} style={{ position: "absolute", left: 840 + (i - 3) * 236, top: 640, width: 216, height: 200, transform: `translate(-50%,-50%) scale(${ent(t, 907.4 + i * 0.08)})`, borderRadius: 24, background: Math.floor((t - 908.3) * 2.5) % 7 === i && t > 908.3 ? "#fff3b0" : C.crema, border: `8px solid ${Math.floor((t - 908.3) * 2.5) % 7 === i && t > 908.3 ? C.oro : C.noche}`, boxShadow: Math.floor((t - 908.3) * 2.5) % 7 === i && t > 908.3 ? `0 0 40px ${C.oro}` : "0 10px 0 rgba(14,8,40,.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700 }}>
                    <div style={{ fontSize: 96, lineHeight: 1 }}>{e}</div>
                    <div style={{ fontSize: 38, color: C.noche, marginTop: 8 }}>{k}</div>
                  </div>
                ))}

                <Yo t={t} t0={906.0} x={1745} y={1080} h={360} expr="sorpresa" habla flip bD={115} cD={10} />
                <Chip t={t} t0={906.4} text="🔔 SUBSCRIBE · NEXT: A NIGHT IN ANCIENT ROME" color={C.rojo} x={960} y={145} centro size={44} />
                <Chip t={t} t0={906.11} text="TELL ME IN THE COMMENTS 💬" color={C.lima} tinta={C.noche} x={960} y={900} centro size={60} />
              </>
            )}
          </>
        );
      })()}
    </>
  );
};
