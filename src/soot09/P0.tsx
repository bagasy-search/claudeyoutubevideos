import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Chip, Grande, fontFamily, Particulas } from "./kit";
import { Mundo, K, camEn, camV, En, SUELO, AGUA } from "./mundo";
import { Base, FX } from "./base";
import { TOM, COLONO, Tablero, Nave, Pez, Cruz, Barril, Poste, Olla, Tinte, Bote } from "./kitj";

// GANCHO 0-51,7 s. Mundo continuo: playa de Jamestown 1610 → el fuerte → flashback del otoño → bajo el río →
// rebobinado volando hasta Londres → vuelo hacia adelante plantando las 7 trampas → el mundo entero → la curva del río → Londres.
export const CAM0: K[] = [
  [0, 23150, 548, 3.1], [0.85, 23150, 552, 2.75], [1.3, 23060, 640, 1.4], [4.1, 23020, 630, 1.3],
  [4.6, FX, 640, 0.95], [5.6, FX, 640, 0.98], [8.0, FX, 600, 1.15], [10.4, FX, 610, 1.06], [13.1, FX - 100, 640, 1.0],
  [14.0, FX - 200, 640, 1.0], [14.7, 22450, 690, 1.0], [17.6, 22650, 680, 1.12], [18.1, 23150, 610, 1.5],
  [20.2, 23150, 600, 1.75], [21.3, 23000, 700, 1.4], [22.1, 22350, 1160, 1.15], [23.3, 22300, 1170, 1.2],
  [24.7, 23900, 520, 0.5], [27.6, FX, 520, 0.56], [29.4, 25100, 600, 0.8], [31.9, 25300, 620, 0.86],
  [32.4, 23150, 590, 2.0], [32.95, 23150, 590, 2.05], [34.75, 3000, 560, 0.55], [35.4, 3000, 600, 0.32],
  [40.7, 28200, 640, 0.32], [42.4, 15400, 860, 0.074], [44.0, 15400, 860, 0.077], [45.0, 21100, 780, 1.25],
  [49.6, 20850, 770, 1.3], [50.15, 20700, 740, 0.9], [50.19, 6300, 600, 0.95], [51.9, 6200, 610, 1.0],
];
export const CIELO0: [number, string][] = [[0, "amanecer"], [6.8, "verano"], [10.6, "amanecer"], [27.6, "invierno"], [32.3, "amanecer"], [33.4, "londres"], [35.4, "mar"], [42.2, "primavera"], [50.3, "londres"]];

const POSTES: [number, number, string][] = [[1, 3000, "THE AD"], [2, 7750, "THE VOYAGE"], [6, 12600, "THE RESCUE"], [4, 21300, "THE GOLD"], [3, 22950, "THE ISLAND"], [7, 24650, "STARVING TIME"], [5, 28200, "THE NEIGHBORS"]];
// segundo en que la cámara pasa por cada cartel durante el vuelo hacia adelante
const tPaso = (x: number) => { for (let k = 35.4; k < 40.7; k += 1 / 30) if (camEn(CAM0, k).x >= x - 900) return k; return 40.7; };

// la multitud del otoño de 1609 (500 colonos) que se va apagando
const MULTI = Array.from({ length: 44 }, (_, i) => ({ x: 23560 + ((i * 97) % 1560), h: 150 + ((i * 41) % 60), sale: i % 7 === 3 ? 1e9 : 11.0 + ((i * 53) % 44) * 0.048, entra: 8.05 + ((i * 29) % 44) * 0.03, seed: 300 + i }));

const GRUPO = [-900, -760, -600, -480, -260, -140, 20, 160].map((d, i) => ({ x: FX + d - 200, h: 250 + (i % 3) * 30, dy: (i % 2) * 10 }));
// fuego chico del campamento helado
export const Fogata: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => (
  <svg style={{ position: "absolute", left: x - 120, top: y - 240, overflow: "visible" }} width={240} height={240}>
    <circle cx={120} cy={170} r={150 + Math.sin(t * 7) * 8} fill="#ff9a3a" opacity={0.18} />
    {[-40, 0, 40].map((d) => <rect key={d} x={90 + d * 0.6} y={200} width={70} height={18} rx={8} fill="#5a3418" transform={`rotate(${d / 2} 120 210)`} />)}
    {[0, 1, 2].map((i) => { const w = Math.sin(t * (9 + i) + i) * 6; return <path key={i} d={`M ${92 + i * 16} 206 Q ${84 + i * 18 + w} ${150 - i * 10} ${120 + w} ${110 + i * 14} Q ${150 - i * 14 - w} ${160} ${148 - i * 10} 206 Z`} fill={["#ff6a2a", "#ffb23a", "#fff0a0"][i]} />; })}
    {[0, 1, 2, 3].map((i) => { const k = (t * 0.6 + i / 4) % 1; return <circle key={`b${i}`} cx={120 + Math.sin(i * 7 + t) * 30} cy={110 - k * 140} r={4} fill="#ffcf6a" opacity={1 - k} />; })}
  </svg>
);
const Apaga: React.FC<{ t: number; t1: number; children: React.ReactNode; x: number; y: number }> = ({ t, t1, children, x, y }) => {
  if (t > t1 + 0.22) return null;
  const k = t < t1 ? 1 : 1 - (t - t1) / 0.22;
  return <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${x}px ${y}px`, transform: `scale(${k}, ${0.4 + 0.6 * k})`, opacity: k }}>{children}</div>;
};

export const P0: React.FC<{ t: number }> = ({ t }) => {
  if (t > 52.2) return null;
  // el contador sólo aparece cuando la voz dice "500" (5,6 s) y baja a 60 con "there are 60"
  const tabla = t < 10.9 ? 500 : t < 13.14 ? interpolate(t, [10.9, 13.14], [500, 60]) : 60;
  const tablaOp = (t > 0.9 && t < 5.6) || (t > 23.7 && t < 27.8) ? 0 : t < 32.4 ? 1 : Math.max(0, 1 - (t - 32.4) * 3);
  const otono = t > 6.8 && t < 10.7;
  const yo1610 = t < 33.6;
  const flipYo = t > 4.18 && t < 17.9;
  const c = camV(CAM0, t);
  const pant = (wx: number, wy: number) => ({ x: 960 + (wx - c.x) * c.z, y: 540 + (wy - c.y) * c.z });
  const naves = (x0: number) => [x0, x0 - 420];
  const [nD, nP] = t < 42 ? naves(22420) : naves(interpolate(t, [42.8, 49.6], [21650, 20950], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill>
      <Mundo t={t} cam={CAM0} cielo={CIELO0}
        frente={
          <>
            {/* vista del mundo entero: rótulos y la ruta con las 7 trampas en orden */}
            {t > 41.7 && t < 44.9 && (() => {
              const op = Math.min(1, (t - 41.7) * 3, (44.9 - t) * 3);
              const lug: [string, number, number][] = [["LONDON", 2800, 700], ["ATLANTIC OCEAN", 11000, 1500], ["BERMUDA", 13900, 400], ["VIRGINIA", 25500, 300]];
              const orden = [3000, 7750, 22950, 21300, 28200, 12600, 24650];
              return (
                <AbsoluteFill style={{ opacity: op }}>
                  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
                    <path d={orden.map((x, i) => { const p = pant(x, 700 - (i % 2) * 260); return `${i ? "L" : "M"} ${p.x} ${p.y}`; }).join(" ")} stroke="#fff" strokeWidth={8} strokeDasharray="22 16" fill="none" strokeDashoffset={-t * 60} opacity={0.9} />
                  </svg>
                  {orden.map((x, i) => { const p = pant(x, 700 - (i % 2) * 260); const s = ent(t, 41.8 + i * 0.12); return <div key={i} style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%,-50%) scale(${s})`, width: 96, height: 96, borderRadius: 48, background: C.rojo, border: "8px solid #fff", fontFamily, fontWeight: 700, fontSize: 54, color: "#fff", textAlign: "center", lineHeight: "80px", boxShadow: "0 8px 0 rgba(20,10,50,.4)" }}>{i + 1}</div>; })}
                  {lug.map(([n, x, y], i) => { const p = pant(x, y); return <div key={n} style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%,-50%) scale(${ent(t, 41.9 + i * 0.1)})`, fontFamily, fontWeight: 700, fontSize: 40, color: "#fff", letterSpacing: 3, WebkitTextStroke: "8px #1b1240", paintOrder: "stroke fill", whiteSpace: "nowrap" }}>{n}</div>; })}
                </AbsoluteFill>
              );
            })()}
          </>
        }>
        {/* detrás del cabo: la proa misteriosa que asoma en la curva del río */}
        {t > 47.5 && t < 50.4 && (
          <En x={20200} w={400}>
            <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${interpolate(t, [47.6, 49.4], [0, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)` }}>
              <Bote x={20150} y={AGUA - 20} t={t} s={1.3} />
              <svg style={{ position: "absolute", left: 20150 - 60, top: AGUA - 200, overflow: "visible" }} width={120} height={120}><circle cx={60} cy={60} r={30 + Math.sin(t * 9) * 6} fill="#ffe680" opacity={0.85} /><circle cx={60} cy={60} r={70} fill="#ffe680" opacity={0.25} /></svg>
            </div>
          </En>
        )}
        <Base t={t} />
        {/* playa 1610: las dos naves chicas de Bermudas */}
        {(t < 33.6 || t > 42) && (
          <>
            <En x={nD} w={500}><Nave x={nD} y={AGUA - 70} t={t} tam={0.55} vela={t > 42 ? 1 : 0.2} nombre={undefined} /></En>
            <En x={nP} w={500}><Nave x={nP} y={AGUA - 66} t={t + 1} tam={0.5} vela={t > 42 ? 1 : 0.2} casco="#6a3416" nombre={undefined} /></En>
          </>
        )}
        {/* la multitud del otoño (500) y su desaparición */}
        {t > 8.0 && t < 13.6 && MULTI.map((m, i) => (
          <En key={i} x={m.x} w={200}>
            <Apaga t={t} t1={m.sale} x={m.x} y={SUELO}>
              <Persona x={m.x} y={SUELO + (i % 3) * 6} h={m.h} t={t} seed={m.seed} ropa={COLONO(i)} expr={t > 10.6 ? (i % 2 ? "miedo" : "triste") : i % 3 ? "neutro" : "feliz"} aparece={m.entra} gorro={i % 3 === 0 ? "sombrero" : undefined} flip={i % 2 === 0} />
            </Apaga>
          </En>
        ))}
        {/* los 60 sobrevivientes: flacos, envueltos, alrededor del fuego frente al fuerte */}
        {(t < 6.9 || (t > 10.6 && t < 33.5)) && GRUPO.map((g, i) => (
          <En key={`g${i}`} x={g.x} w={200}>
            <Persona x={g.x} y={SUELO + g.dy} h={g.h} t={t} seed={400 + i} ropa={COLONO(i)} expr={i % 3 === 0 ? "miedo" : "triste"} flaco={0.72} flip={g.x > FX - 380} gorro={i % 2 ? "sombrero" : undefined} mira={g.x > FX - 380 ? 0.3 : -0.3} bI={i % 2 ? 60 : 20} cI={i % 2 ? 100 : 40} bD={i % 2 ? 60 : 20} cD={i % 2 ? 100 : 40} inclina={i % 2 ? 6 : -4} />
          </En>
        ))}
        {(t < 6.9 || (t > 10.6 && t < 33.5)) && <En x={FX - 380} w={200}><Fogata t={t} x={FX - 380} y={SUELO + 8} /></En>}
        {/* tumbas: la masacre sin batalla */}
        {t > 30.5 && t < 33.5 && Array.from({ length: 14 }, (_, i) => <En key={i} x={25350 + (i % 7) * 110} w={100}><Cruz x={25350 + (i % 7) * 110 + (i > 6 ? 55 : 0)} y={SUELO - 70 - (i > 6 ? 40 : 0)} s={i > 6 ? 0.75 : 0.9} t={t} t0={30.6 + i * 0.06} /></En>)}
        {/* colonos flacos que cargan los barcos (no festejan) */}
        {t > 13.6 && t < 18.2 && [0, 1, 2].map((i) => {
          const x = interpolate(t, [13.6, 18.2], [23050 - i * 140, 22750 - i * 140]);
          return <En key={i} x={x} w={200}><Persona x={x} y={SUELO} h={330} t={t} seed={60 + i} ropa={COLONO(i + 1)} expr="triste" flaco={0.85} camina={t > 16.2 ? 1.2 : 0} flip bI={150} bD={150} cI={30} cD={30} manoD={i === 1 ? <g transform="translate(-30 -70) scale(0.6)"><rect x={-80} y={-80} width={160} height={150} rx={14} fill="#a0683a" stroke="#4e2a12" strokeWidth={8} /></g> : undefined} /></En>;
        })}
        {t > 16.2 && t < 18.2 && <En x={22900} w={200}><Barril x={22880} y={SUELO - 80} t={t} /></En>}
        {/* VOS en 1610: flaco, en la playa */}
        {yo1610 && (
          <En x={23150} w={300}>
            <Persona x={23150} y={SUELO} h={420} t={t} seed={7} ropa={TOM} expr={t < 2.4 ? "miedo" : t > 20.2 && t < 23 ? "triste" : t > 32.3 ? "orgullo" : "neutro"} flaco={0.8} gorro="sombrero" flip={flipYo} mira={flipYo ? 0.6 : -0.3} habla={t > 32.3} ladea={t > 32.3 ? -8 : 0} bD={t > 32.4 ? 120 : undefined} cD={t > 32.4 ? 40 : undefined} />
          </En>
        )}
        {t > 20.2 && t < 23.4 && <En x={23400} w={300}><Olla x={23420} y={SUELO - 120} s={0.7} t={t} t0={20.25} dentro="nada" /></En>}
        {/* bajo el agua: el río lleno de peces */}
        {t > 21.0 && t < 24.6 && (
          <>
            {Array.from({ length: 16 }, (_, i) => { const y = AGUA + 120 + (i % 5) * 70; const x = 21500 + ((i * 173 + t * (60 + (i % 4) * 30) * (i % 2 ? 1 : -1)) % 1250 + 1250) % 1250; return <Pez key={i} t={t} x={x} y={y} s={0.6 + (i % 3) * 0.2} flip={i % 2 === 0} esturion={i % 4 === 1} seed={i} />; })}
          </>
        )}
        {/* peces que saltan en el río, al lado de los que pasan hambre */}
        {t > 20.6 && t < 23.4 && [0, 1, 2, 3].map((i) => { const u = ((t - 20.7 - i * 0.55) / 1.1); if (u < 0 || u > 1) return null; const x = 22560 + i * 130 + u * 160; return <Pez key={`s${i}`} t={t} x={x} y={AGUA + 10 - Math.sin(u * Math.PI) * 230} s={0.9} flip={i % 2 === 1} seed={i + 30} />; })}
        {/* los 7 carteles: aparecen cuando la cámara pasa en el vuelo hacia adelante */}
        {t > 35.3 && t < 37.0 && POSTES.map(([n, x, txt]) => <En key={n} x={x} w={900}><Poste t={t} t0={tPaso(x)} x={x} y={x > 5600 && x < 22800 ? AGUA + 20 : SUELO + 10} n={n} titulo={txt} s={1.7} /></En>)}
        {/* LONDRES 1606: vos sano, en el muelle, al lado del Susan Constant */}
        {t > 49.8 && (
          <>
            <En x={6600} w={600}><Nave x={6600} y={AGUA - 140} t={t} tam={1.05} vela={0.3} /></En>
            <En x={6050} w={300}><Persona x={6050} y={SUELO - 30} h={430} t={t} seed={8} ropa={TOM} expr="feliz" gorro="sombrero" bD={150} cD={20} habla aparece={50.9} /></En>
          </>
        )}
        {/* hojas del otoño durante el flashback */}
        {otono && <div style={{ position: "absolute", left: c.x - 1100, top: c.y - 700 }}><Particulas t={t} tipo="brasas" n={30} seed={9} /></div>}
      </Mundo>

      {/* ── capa de pantalla: tablero de sobrevivientes, textos y golpes */}
      {t < 33 && <Tablero t={t} valor={tabla} rojo={t > 10.9} op={tablaOp} s={t < 2.6 ? 1.5 : 1.2} x={t < 2.6 ? 1500 : 1680} y={t < 2.6 ? 250 : 170} />}
      {t > 0.9 && t < 2.8 && <Grande t={t} t0={2.45} text="-440" y={420} x={1500} size={120} color="#ff5a6a" />}
      <Chip t={t} t0={1.34} t1={2.25} text="VIRGINIA" color={C.teal} tinta={C.noche} x={420} y={180} centro size={70} />
      <Chip t={t} t0={2.48} t1={4.05} text="MAY 1610" color={C.ambar} tinta={C.noche} x={420} y={180} centro size={84} />
      <Chip t={t} t0={4.72} t1={6.6} text="THE FORT" color={C.violeta} x={960} y={150} centro size={70} />
      <Chip t={t} t0={7.18} t1={10.4} text="LAST AUTUMN" color={C.naranja} x={420} y={170} centro size={66} />
      <Chip t={t} t0={8.4} t1={10.4} text="500 ENGLISH COLONISTS" color={C.rojo} x={960} y={930} centro size={64} />
      <Chip t={t} t0={10.58} t1={13.0} text="TODAY" color={C.ambar} tinta={C.noche} x={420} y={170} centro size={66} />
      {t > 13.1 && t < 14.4 && <Grande t={t} t0={13.14} text="60" y={520} size={330} color="#ff5a6a" />}
      <Chip t={t} t0={14.92} t1={16.1} text="HELP ARRIVED..." color={C.teal} tinta={C.noche} x={960} y={160} centro size={64} />
      <Chip t={t} t0={16.42} t1={17.8} text="PACKING UP TO LEAVE" color={C.rojo} x={960} y={160} centro size={64} />
      {t > 17.9 && t < 20.2 && (() => {
        const u = prog(t, 18.95, 19.4);
        return (
          <svg style={{ position: "absolute", left: 120, top: 150 }} width={400} height={400}>
            <g transform={`translate(200 200) scale(${ent(t, 17.95)})`}>
              {[-1, 1].map((s) => <g key={s} transform={`rotate(${s * 40})`}><rect x={-12} y={-170} width={24} height={250} rx={6} fill="#dfe6f0" stroke="#6a7484" strokeWidth={5} /><rect x={-50} y={70} width={100} height={20} fill="#c9a24a" /><rect x={-10} y={90} width={20} height={60} fill="#6b3a1f" /></g>)}
            </g>
            <path d="M 60 60 L 340 340" stroke={C.rojo} strokeWidth={34} strokeLinecap="round" strokeDasharray={`${u * 400} 400`} />
            <path d="M 340 60 L 60 340" stroke={C.rojo} strokeWidth={34} strokeLinecap="round" strokeDasharray={`${prog(t, 19.1, 19.5) * 400} 400`} />
          </svg>
        );
      })()}
      <Chip t={t} t0={19.16} t1={20.2} text="NOT IN BATTLE" color={C.violeta} x={320} y={600} centro size={60} />
      {t > 20.6 && t < 21.4 && <Grande t={t} t0={20.76} text="HUNGER" y={240} size={170} color={C.ambar} />}
      <Chip t={t} t0={22.28} t1={23.6} text="A RIVER FULL OF FISH" color={C.teal} tinta={C.noche} x={960} y={160} centro size={68} />
      {t > 23.9 && t < 27.6 && <Grande t={t} t0={24.0} text="JAMESTOWN" y={200} size={190} />}
      <Chip t={t} t0={25.06} t1={27.6} text="1st PERMANENT ENGLISH COLONY" color={C.rojo} x={960} y={930} centro size={58} />
      <Chip t={t} t0={29.36} t1={32.2} text="ALMOST EVERY WINTER" color={C.lila} tinta={C.noche} x={960} y={940} centro size={62} />
      {t > 30.6 && t < 32.2 && <Grande t={t} t0={30.64} text="A MASSACRE" y={300} size={150} color="#ff5a6a" />}
      {t > 31.0 && t < 32.2 && <Grande t={t} t0={31.06} text="WITHOUT A BATTLE" y={470} size={100} />}
      {/* rebobinado: banda y año que gira hacia atrás */}
      {t > 32.95 && t < 35.4 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 60, top: 60, fontFamily, fontWeight: 700, fontSize: 90, color: "#fff", WebkitTextStroke: "10px #1b1240", paintOrder: "stroke fill", opacity: Math.sin(t * 18) > -0.3 ? 1 : 0.3 }}>◀◀ REWIND</div>
          <Grande t={t} t0={33.0} text={String(Math.round(interpolate(t, [33.0, 34.8], [1610, 1606], { extrapolateRight: "clamp" })))} y={540} size={260} color={C.ambar} />
        </AbsoluteFill>
      )}
      <Chip t={t} t0={33.82} t1={35.2} text="SAIL THERE" color={C.teal} tinta={C.noche} x={960} y={880} centro size={64} />
      {t > 36.8 && t < 42.6 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 1 - prog(t, 42.2, 42.6) }}>
          <div style={{ position: "absolute", inset: 0, background: "#1b1240", opacity: prog(t, 36.8, 37.1) }} />
          {Array.from({ length: 7 }, (_, i) => {
            const g = prog(t, 37.2 + i * 0.45, 37.5 + i * 0.45);
            return (
              <div key={i} style={{ position: "absolute", left: 130 + i * 240, top: 330, width: 210, height: 300, transform: `scaleX(${Math.abs(1 - 2 * g) || 0.02}) rotate(${(i - 3) * 2}deg)`, background: g > 0.5 ? "#f4e2b8" : "#5a3a1a", border: "8px solid #2a1408", borderRadius: 20, textAlign: "center", fontFamily, fontWeight: 700 }}>
                {g > 0.5 && <><div style={{ fontSize: 44, color: "#7a1a24", marginTop: 26 }}>TRAP</div><div style={{ fontSize: 130, color: C.rojo, lineHeight: 1 }}>{i + 1}</div><div style={{ fontSize: 70, color: C.noche }}>?</div></>}
              </div>
            );
          })}
        </div>
      )}
      <Chip t={t} t0={36.82} t1={40.2} text="STEP BY STEP" color={C.violeta} x={960} y={150} centro size={62} />
      <Chip t={t} t0={39.1} t1={41.4} text="EVERY SINGLE TRAP" color={C.rojo} x={960} y={930} centro size={62} />
      {t > 41.9 && t < 43.0 && <Grande t={t} t0={41.96} text="7 TRAPS" y={170} size={140} color={C.ambar} />}
      <Chip t={t} t0={44.64} t1={47.4} text="THE SURVIVORS... SAILING AWAY" color={C.violeta} x={960} y={150} centro size={56} />
      {t > 47.6 && t < 50.0 && <Grande t={t} t0={47.84} text="?" x={1500} y={330} size={300} color={C.ambar} />}
      <Chip t={t} t0={48.86} t1={50.0} text="THE BEND OF THE RIVER" color={C.teal} tinta={C.noche} x={760} y={150} centro size={56} />
      <Chip t={t} t0={50.26} t1={52.3} text="GET ON BOARD" color={C.rojo} x={960} y={160} centro size={68} />
      {/* frío del invierno / tinte del hambre */}
      <Tinte color="#2a1a40" op={t < 4 ? 0.7 : t > 27.6 && t < 32.3 ? 0.6 : 0.3} />
      {t > 47.6 && t < 50 && <Tinte color="#000" op={0.5} />}
      {/* destello blanco del rebobinado */}
      {t > 32.9 && t < 33.2 && <AbsoluteFill style={{ background: "#ffe6a0", opacity: 0.45 * (1 - (t - 32.9) / 0.3) }} />}
    </AbsoluteFill>
  );
};
