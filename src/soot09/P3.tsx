import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Chip, Grande, fontFamily, Emote, cabeza, Moneda, Pergamino } from "./kit";
import { Trampas } from "./kit2";
import { Mundo, K, En, SUELO, AGUA } from "./mundo";
import { Base, FX, flotaX } from "./base";
import { TOM, GENT, COLONO, Poste, Nave, Mosquitos, Anillos, Cruz, Barril, Olla, Tablero, Nieve, FuerteTriangulo, Tinte } from "./kitj";
import { Globo, Tacha } from "./kitj2";

// TRAMPA 3 · LA ISLA (213,7-342,7 s). Río arriba hasta la península, el fuerte en 19 días, el agua del río que vuelve,
// mosquitos y fiebres, las cruces de noche, los anillos del ciprés (la peor sequía en 770 años), "seasoning" y 104 → 38.
export const CAM3: K[] = [
  [213.5, 22820, 550, 0.64], [214.6, 22950, 575, 0.75], [217.5, 22920, 600, 0.76], [218.2, 21000, 600, 0.45], [225.6, 20500, 600, 0.42],
  [226.4, 20800, 600, 0.42], [231.0, 22200, 640, 0.55], [232.6, 22760, 720, 1.0], [235.4, 22800, 720, 1.0], [236.3, 23050, 650, 0.7],
  [237.3, 23400, 640, 0.6], [238.5, 25600, 700, 0.75], [240.0, 24330, 700, 0.85], [246.8, 24350, 690, 0.88], [248.3, 24300, 700, 1.25],
  [251.2, 24350, 700, 1.2], [252.6, 22880, 800, 1.7], [258.9, 22880, 800, 1.75], [259.8, 22880, 800, 1.55], [264.9, 22900, 800, 1.6],
  [266.0, 22450, 1180, 0.85], [273.6, 22550, 1180, 0.9], [275.2, 24250, 700, 1.0], [279.9, 24350, 700, 1.05], [281.2, 25550, 720, 0.9],
  [288.6, 25600, 720, 0.95], [290.2, 25960, 560, 0.85], [295.6, 25960, 520, 0.95], [311.6, 25900, 560, 0.85], [313.4, 24250, 680, 1.0],
  [322.6, 24250, 680, 1.05], [330.4, 22800, 720, 0.75], [338.4, 22900, 720, 0.78], [340.0, 24350, 620, 0.62], [342.8, 24350, 620, 0.65],
];
const CIELO3: [number, string][] = [[213.0, "primavera"], [251.0, "verano"], [280.3, "noche"], [289.0, "verano"], [329.8, "invierno"]];

// colonos alrededor del fuerte
const OBREROS = [23700, 23820, 23960, 24760, 24900, 25040];
// el barco de abastecimiento de enero de 1608
const abastoX = (t: number) => interpolate(t, [330.0, 334.4], [19800, 21900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// salero
const Salero: React.FC<{ t: number; x: number; y: number; s?: number }> = ({ t, x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 120 * s, top: y - 160 * s, overflow: "visible", transform: `rotate(${150 + Math.sin(t * 16) * 18}deg)`, transformOrigin: `${120 * s}px ${160 * s}px` }} width={240 * s} height={320 * s} viewBox="-120 -160 240 320">
    <path d="M -60 -60 L 60 -60 L 70 130 Q 0 150 -70 130 Z" fill="#f4f8ff" stroke="#2a2a34" strokeWidth={8} />
    <path d="M -60 -60 Q 0 -150 60 -60 Z" fill="#b8c0d0" stroke="#2a2a34" strokeWidth={8} />
    {[[-20, -95], [0, -110], [20, -95]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={6} fill="#2a2a34" />)}
  </svg>
);

// mini mapa del río James: de la bahía hasta la península
const MapaRio: React.FC<{ t: number }> = ({ t }) => {
  const e = ent(t, 226.35) * (1 - prog(t, 231.0, 231.5));
  const d = prog(t, 227.0, 230.9);
  const path = "M 120 560 Q 360 520 470 420 T 820 330 Q 980 300 1100 230";
  return (
    <div style={{ position: "absolute", left: 360, top: 170, width: 1200, height: 700, transform: `scale(${e})`, background: "#f4e6c4", border: "10px solid #6b3a1f", borderRadius: 30, boxShadow: "0 14px 0 rgba(20,10,40,.35)" }}>
      <svg width={1180} height={680} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M 0 0 L 1180 0 L 1180 680 L 0 680 Z" fill="#b8cf8a" />
        {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={60 + ((i * 197) % 1080)} cy={60 + ((i * 113) % 300) + (i % 2) * 200} r={26 + (i % 3) * 8} fill="#6a9a4a" opacity={0.8} />)}
        <path d="M 0 580 Q 60 520 120 560 L 120 680 L 0 680 Z" fill="#7ab0d8" />
        <path d={path} stroke="#7ab0d8" strokeWidth={46} fill="none" strokeLinecap="round" />
        <path d={path} stroke="#2a6a9a" strokeWidth={10} fill="none" strokeDasharray="1600" strokeDashoffset={1600 * (1 - d)} />
        <path d="M 1040 245 Q 1080 190 1150 205 Q 1170 245 1120 265 Q 1080 280 1040 245 Z" fill="#c8a040" stroke="#7a4a10" strokeWidth={8} />
        <text x={70} y={650} fontFamily={fontFamily} fontWeight={700} fontSize={50} fill="#1a3a5a">THE BAY</text>
        <text x={500} y={500} fontFamily={fontFamily} fontWeight={700} fontSize={52} fill="#1a3a5a" opacity={prog(t, 227.4, 227.8)}>JAMES RIVER</text>
        <text x={660} y={260} fontFamily={fontFamily} fontWeight={700} fontSize={56} fill={C.rojo} opacity={prog(t, 229.1, 229.4)}>60 KM UPRIVER</text>
        {d > 0 && (() => { const k = d; const x = 120 + k * 980, y = 560 - k * 330 + Math.sin(k * 6) * 20; return <g transform={`translate(${x} ${y})`}><path d="M -30 0 L 30 0 L 20 18 L -20 18 Z" fill="#7a3e1a" /><path d="M 0 0 L 0 -50 L 28 -14 Z" fill="#fff" /></g>; })()}
      </svg>
      {t > 227.7 && <div style={{ position: "absolute", left: 760, top: 70, transform: `scale(${ent(t, 227.74)})`, fontFamily, fontWeight: 700, fontSize: 54, color: "#fff", background: C.violeta, borderRadius: 12, padding: "4px 16px", whiteSpace: "nowrap" }}>ALMOST AN ISLAND</div>}
    </div>
  );
};

const Apaga: React.FC<{ t: number; t1: number; children: React.ReactNode; x: number; y: number }> = ({ t, t1, children, x, y }) => {
  if (t > t1 + 0.3) return null;
  const k = t < t1 ? 1 : 1 - (t - t1) / 0.3;
  return <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${x}px ${y}px`, transform: `scale(${k}, ${0.4 + 0.6 * k})`, opacity: k }}>{children}</div>;
};

export const P3: React.FC<{ t: number }> = ({ t }) => {
  if (t < 213.6 || t > 342.9) return null;
  const s0 = flotaX(0, t);
  const dia = Math.min(19, Math.max(1, Math.floor(interpolate(t, [239.4, 246.9], [1, 19.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))));
  const obra = t > 238.9 && t < 247.1;
  const enfermos = t > 274.7 && t < 280.5;
  const noche = t > 280.3 && t < 289.0;
  const sedienta = t > 252.4 && t < 265.1;
  // cuántas cruces hay (de noche se suman de a una)
  const cruces = t < 280.6 ? 0 : t < 289 ? Math.floor(interpolate(t, [281.4, 287.0], [1, 9], { extrapolateRight: "clamp" })) : 9;
  return (
    <AbsoluteFill>
      <Mundo t={t} cam={CAM3} cielo={CIELO3}>
        <Base t={t} />
        {t < 218 && <En x={22950} w={900}><Poste t={t} t0={213.8} x={22950} y={SUELO + 10} n={3} titulo="THE ISLAND" s={1.25} /></En>}
        {/* el galeón español que no se anima a subir */}
        {t > 220.5 && t < 226.6 && (() => { const x = interpolate(t, [220.6, 223.6, 226.4], [19300, 20300, 19700], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return <En x={x} w={500}><Nave x={x} y={AGUA - 120} t={t} tam={0.95} casco="#3a2a2a" bandera={false} vela={1} /><svg style={{ position: "absolute", left: x - 60, top: AGUA - 700, overflow: "visible" }} width={120} height={120}><rect x={0} y={0} width={120} height={80} fill="#f4c020" /><rect x={0} y={20} width={120} height={40} fill="#c81d2e" /></svg></En>; })()}
        {/* la soga del barco al árbol */}
        {t > 233.8 && t < 251.5 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
            <path d={`M ${s0 + 440} ${AGUA - 150} Q ${(s0 + 440 + 23360) / 2} ${AGUA - 80 + 40 * (1 - prog(t, 234.0, 235.2))} 23360 ${SUELO - 40}`} stroke="#c8a060" strokeWidth={8} fill="none" strokeDasharray="2200" strokeDashoffset={2200 * (1 - prog(t, 234.0, 235.2))} />
          </svg>
        )}
        {/* agua profunda: la sonda */}
        {t > 232.0 && t < 236.2 && (
          <svg style={{ position: "absolute", left: 22700, top: AGUA, overflow: "visible", opacity: ent(t, 232.18) }} width={10} height={10}>
            <line x1={0} y1={0} x2={0} y2={420 * prog(t, 232.2, 233.2)} stroke="#fff" strokeWidth={10} strokeDasharray="22 14" />
            <path d={`M -26 ${420 * prog(t, 232.2, 233.2) - 30} L 0 ${420 * prog(t, 232.2, 233.2)} L 26 ${420 * prog(t, 232.2, 233.2) - 30}`} stroke="#fff" strokeWidth={10} fill="none" />
          </svg>
        )}
        {/* los mosquitos del pantano */}
        {(t > 237.3 && t < 240.5) && <Mosquitos t={t} x={25700} y={SUELO - 160} n={26} r={220} seed={4} />}
        {/* los que construyen el fuerte */}
        {obra && OBREROS.map((x, i) => (
          <En key={x} x={x} w={200}>
            <Persona x={x} y={SUELO} h={300} t={t} seed={300 + i} ropa={COLONO(i)} expr={i % 3 === 0 ? "enojado" : "neutro"} flip={x > FX} bD={60 + Math.abs(Math.sin(t * 6 + i)) * 70} cD={30}
              manoD={<g transform="rotate(-90)"><rect x={-6} y={-10} width={12} height={90} fill="#8a5a2a" /><rect x={-26} y={70} width={52} height={24} rx={4} fill="#4a4a54" /></g>} />
            <Emote t={t} t0={239.6 + i * 0.3} tipo="sudor" x={cabeza(x, SUELO, 300).x} y={cabeza(x, SUELO, 300).y} s={0.6} />
          </En>
        ))}
        {/* vos en la orilla, con sed */}
        {sedienta && (
          <En x={22900} w={400}>
            <Persona x={22900} y={SUELO} h={260} t={t} seed={8} ropa={TOM} gorro="sombrero" flip expr={t > 261.4 && t < 262.6 ? "sorpresa" : t > 263.5 ? "miedo" : "neutro"} bD={t > 255.3 && t < 263.8 ? 120 : 0} cD={t > 255.3 && t < 263.8 ? 100 : 0}
              manoD={t > 255.3 && t < 263.8 ? <g><path d="M -22 -6 L 22 -6 L 18 30 L -18 30 Z" fill="#a0683a" stroke="#4e2a12" strokeWidth={4} /><rect x={-20} y={-4} width={40} height={10} fill={t > 261.8 ? "#6a8a3a" : "#8ab0c8"} /></g> : undefined} />
            {t > 261.4 && t < 262.8 && <Emote t={t} t0={261.4} t1={262.8} tipo="susto" x={cabeza(22900, SUELO, 260).x} y={cabeza(22900, SUELO, 260).y} s={0.5} />}
          </En>
        )}
        {/* la marea: el agua sube (sal) y baja (barro) en la orilla */}
        {t > 259.4 && t < 265.0 && (() => {
          const alto = interpolate(t, [259.5, 260.4, 261.8, 262.7], [0, -60, -60, 45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <svg style={{ position: "absolute", left: 22300, top: AGUA, overflow: "visible" }} width={10} height={10}>
              <rect x={0} y={alto} width={620} height={200} fill={alto < 0 ? "#2a7ac8" : "#5a6a3a"} opacity={0.9} />
              {alto < 0 && Array.from({ length: 12 }, (_, i) => <rect key={i} x={30 + i * 48} y={alto - 20 - ((t * 120 + i * 37) % 80)} width={10} height={10} fill="#fff" transform={`rotate(45 ${35 + i * 48} ${alto - 15})`} />)}
              {alto > 0 && Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={40 + i * 66} cy={alto + 6} rx={26} ry={9} fill="#8a9a3a" />)}
            </svg>
          );
        })()}
        {/* bajo el agua: agua de mar + agua dulce, y lo que tiran vuelve */}
        {t > 265.0 && t < 274.6 && (
          <>
            <svg style={{ position: "absolute", left: 21300, top: AGUA + 40, overflow: "visible", opacity: ent(t, 265.6) }} width={10} height={10}>
              <defs><linearGradient id="mezcla3" x1="0" x2="1"><stop offset="0" stopColor="#0a3a6a" /><stop offset="1" stopColor="#5a8a6a" /></linearGradient></defs>
              <rect x={0} y={0} width={1500} height={700} fill="url(#mezcla3)" opacity={0.75 * prog(t, 267.6, 268.9)} />
              <text x={240} y={620} fontFamily={fontFamily} fontWeight={700} fontSize={70} fill="#fff" opacity={prog(t, 268.1, 268.4)}>SEAWATER</text>
              <text x={900} y={620} fontFamily={fontFamily} fontWeight={700} fontSize={70} fill="#fff" opacity={prog(t, 268.94, 269.2)}>FRESHWATER</text>
            </svg>
            {/* basura que cae, se va y vuelve */}
            {[0, 1, 2, 3, 4].map((i) => {
              const u = prog(t, 270.1 + i * 0.25, 273.6);
              if (u <= 0) return null;
              const x = 22780 - Math.sin(u * Math.PI) * (420 + i * 60) + u * 40;
              const y = AGUA + 60 + Math.sin(u * Math.PI) * (140 + i * 30) + i * 14;
              return i === 2 ? <Barril key={i} x={x} y={y} s={0.25} rot={u * 300} /> : <svg key={i} style={{ position: "absolute", left: x - 30, top: y - 18, transform: `rotate(${u * 400}deg)` }} width={60} height={36}><ellipse cx={30} cy={18} rx={28} ry={16} fill={["#6a5a2a", "#4a3a1a", "", "#7a6a3a", "#5a4a22"][i]} /></svg>;
            })}
            {t > 271.9 && (
              <svg style={{ position: "absolute", left: 22100, top: AGUA + 40, overflow: "visible" }} width={10} height={10}>
                <path d="M 640 20 Q 100 120 300 320 Q 560 420 660 120" stroke="#ffb020" strokeWidth={14} fill="none" strokeDasharray="1400" strokeDashoffset={1400 * (1 - prog(t, 271.94, 273.0))} strokeLinecap="round" />
                {t > 273.0 && <path d="M 630 150 L 662 112 L 690 156" stroke="#ffb020" strokeWidth={14} fill="none" strokeLinecap="round" />}
              </svg>
            )}
          </>
        )}
        {/* fiebres: colonos enfermos frente al fuerte */}
        {enfermos && [23900, 24080, 24620, 24800].map((x, i) => (
          <En key={x} x={x} w={200}>
            <Persona x={x} y={SUELO} h={230} t={t} seed={310 + i} ropa={COLONO(i + 1)} expr={i % 2 ? "triste" : "miedo"} flaco={0.3} flip={x > FX} inclina={8} />
            <Emote t={t} t0={276.5 + i * 0.2} tipo="sudor" x={cabeza(x, SUELO, 230).x} y={cabeza(x, SUELO, 230).y} s={0.5} />
          </En>
        ))}
        {enfermos && <Mosquitos t={t} x={24350} y={SUELO - 260} n={40} r={420} seed={9} />}
        {/* de noche: las cruces y la camilla */}
        {Array.from({ length: cruces }, (_, i) => <En key={i} x={25350 + (i % 7) * 110} w={100}><Cruz x={25350 + (i % 7) * 110 + (i > 6 ? 55 : 0)} y={SUELO - 70 - (i > 6 ? 40 : 0)} s={i > 6 ? 0.75 : 0.9} t={t} t0={281.4 + i * 0.7} /></En>)}
        {noche && t > 284.4 && (() => {
          const x = interpolate(t, [284.5, 288.4], [25000, 25260], { extrapolateRight: "clamp" });
          return (
            <En x={x} w={400}>
              <Persona x={x - 120} y={SUELO} h={230} t={t} seed={320} ropa={COLONO(2)} expr="triste" camina={1.2} bD={70} cD={-20} />
              <Persona x={x + 120} y={SUELO} h={230} t={t} seed={321} ropa={COLONO(3)} expr="triste" camina={1.2} bI={70} cI={-20} />
              <svg style={{ position: "absolute", left: x - 140, top: SUELO - 128, overflow: "visible" }} width={280} height={40}><rect x={0} y={10} width={280} height={14} fill="#6a4a2a" /><path d="M 40 10 Q 140 -26 240 10 Z" fill="#e8e0d0" /></svg>
            </En>
          );
        })()}
        {/* otros dos con sed: sacan agua del río con el cuenco */}
        {sedienta && [22720, 23090].map((x, i) => (
          <En key={`s${i}`} x={x} w={300}>
            <Persona x={x} y={SUELO + 4} h={240} t={t} seed={340 + i} ropa={COLONO(i + 2)} flip={i === 1} expr={t > 262.4 ? "miedo" : "triste"} inclina={i ? -14 : 14} bD={100 + Math.sin(t * 3 + i) * 30} cD={60}
              manoD={<g><path d="M -20 -6 L 20 -6 L 16 26 L -16 26 Z" fill="#a0683a" stroke="#4e2a12" strokeWidth={4} /><rect x={-18} y={-4} width={36} height={9} fill={t > 261.8 ? "#6a8a3a" : "#8ab0c8"} /></g>} />
            {t > 262.4 && <Mosquitos t={t} x={x} y={SUELO - 260} n={8} r={90} seed={20 + i} />}
          </En>
        ))}
        {/* 1998: los científicos sacan una muestra del ciprés */}
        {t > 289.4 && t < 296.2 && [25700, 26200].map((x, i) => (
          <En key={`c${i}`} x={x} w={300}>
            <Persona x={x} y={SUELO} h={330} t={t} seed={360 + i} ropa={{ tunica: "#f2f4f8", tunica2: "#c4c8d6", cinto: "#3a3a44", piel: i ? "#c98a62" : "#f2b48a", piel2: i ? "#a06a46" : "#d98d66", pelo: i ? "#1d1410" : "#a0602c" }} gorro="gorra" flip={i === 1} expr={t > 293.4 ? "sorpresa" : "neutro"} habla={t > 293.4 && i === 1} aparece={289.6 + i * 0.2}
              bD={i === 0 ? 95 : 0} cD={i === 0 ? 10 : 0} manoD={i === 0 ? <g><rect x={-6} y={-8} width={170} height={16} rx={6} fill="#8a94a4" stroke="#3a3a44" strokeWidth={4} /><rect x={-30} y={-24} width={30} height={48} rx={6} fill="#c81d2e" /></g> : undefined} />
          </En>
        ))}
        {t > 291.2 && t < 296.2 && <En x={25950} w={300}><svg style={{ position: "absolute", left: 25880, top: SUELO - 330, overflow: "visible" }} width={10} height={10}><rect x={0} y={0} width={140 * prog(t, 291.3, 292.6)} height={22} rx={10} fill="#d8a060" stroke="#6a3a1a" strokeWidth={5} />{Array.from({ length: 6 }, (_, k) => <line key={k} x1={14 + k * 20} y1={2} x2={14 + k * 20} y2={20} stroke={k === 2 || k === 3 ? C.rojo : "#6a3a1a"} strokeWidth={k === 2 || k === 3 ? 3 : 5} opacity={prog(t, 291.3 + k * 0.2, 291.5 + k * 0.2)} />)}</svg></En>}
        {/* "seasoning": los recién llegados enfermos frente al fuerte, y vos */}
        {t > 313.3 && t < 330.2 && [23780, 23960, 24720, 24900].map((x, i) => (
          <En key={`e${i}`} x={x} w={250}>
            {i % 2 === 0
              ? <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${x}px ${SUELO}px`, transform: "rotate(-84deg) translateY(30px)" }}><Persona x={x} y={SUELO} h={250} t={t} seed={370 + i} ropa={COLONO(i)} expr="dormido" flaco={0.4} /></div>
              : <Persona x={x} y={SUELO} h={260} t={t} seed={370 + i} ropa={COLONO(i)} expr={t > 321.8 ? "orgullo" : "triste"} flaco={0.4} flip={x > FX} inclina={t > 321.8 ? 0 : 10} />}
            {i % 2 === 0 && <Emote t={t} t0={314 + i * 0.3} tipo="sudor" x={x - 60} y={SUELO - 140} s={0.5} />}
          </En>
        ))}
        {t > 313.3 && t < 330.2 && <En x={24250} w={300}><Persona x={24250} y={SUELO} h={330} t={t} seed={8} ropa={TOM} gorro="sombrero" expr={t > 321.8 && t < 323 ? "sorpresa" : t > 325.7 ? "miedo" : "triste"} mira={t > 322.7 ? 0 : -0.4} miraY={t > 322.7 ? -0.6 : 0} /></En>}
        {/* enero de 1608: los que quedan, en la orilla, mirando llegar el barco */}
        {t > 330.2 && t < 342.9 && [23020, 23140, 23260, 23400, 23540, 23680].map((x, i) => (
          <En key={`o${i}`} x={x} w={200}>
            <Apaga t={t} t1={i < 4 ? 336.0 + i * 0.35 : 1e9} x={x} y={SUELO}>
              <Persona x={x} y={SUELO} h={260} t={t} seed={380 + i} ropa={i === 4 ? TOM : COLONO(i)} gorro={i === 4 ? "sombrero" : undefined} flaco={0.75} flip expr={i % 2 ? "triste" : "miedo"} bD={i % 2 && t > 334 ? 150 + Math.sin(t * 8 + i) * 20 : 0} cD={20} />
            </Apaga>
          </En>
        ))}
        {/* la sequía: tierra rajada */}
        {t > 302.4 && t < 330 && (
          <svg style={{ position: "absolute", left: 22800, top: SUELO + 2, overflow: "visible", opacity: prog(t, 302.4, 304.6) }} width={10} height={10}>
            {Array.from({ length: 40 }, (_, i) => <path key={i} d={`M ${i * 90} 4 l 20 22 l -14 18 l 26 20`} stroke="#3a2a12" strokeWidth={5} fill="none" />)}
          </svg>
        )}
        {/* el barco de abastecimiento, enero de 1608 */}
        {t > 329.9 && t < 342.9 && <En x={abastoX(t)} w={500}><Nave x={abastoX(t)} y={AGUA - 120} t={t} tam={0.9} vela={t < 334.4 ? 1 : 0.3} nombre={t > 333.2 && t < 336 ? "FIRST SUPPLY" : undefined} /></En>}
        {/* invierno: nieve sobre el mundo */}
      </Mundo>

      {/* pantalla */}
      {t < 218 && <Trampas t={t} t0={213.9} n={3} y={960} />}
      {t > 217.9 && t < 226.2 && (
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          <Pergamino x={960} y={440} w={760} abre={prog(t, 218.0, 218.6) * (1 - prog(t, 225.7, 226.2))} lineas={0} titulo="COMPANY INSTRUCTIONS" />
          {t > 218.7 && <div style={{ position: "absolute", left: 960, top: 400, transform: `translate(-50%,0) scale(${ent(t, 218.75) * (1 - prog(t, 225.7, 226.2))})`, fontFamily, fontWeight: 700, fontSize: 64, color: C.noche, whiteSpace: "nowrap" }}>1. EASY TO DEFEND</div>}
          {t > 222.62 && <div style={{ position: "absolute", left: 960, top: 490, transform: `translate(-50%,0) scale(${ent(t, 222.62) * (1 - prog(t, 225.7, 226.2))})`, fontFamily, fontWeight: 700, fontSize: 64, color: C.noche, whiteSpace: "nowrap" }}>2. FAR UPRIVER</div>}
        </div>
      )}
      <Chip t={t} t0={224.1} t1={226.3} text="SPANISH WARSHIP" color={C.rojo} x={420} y={930} centro size={52} />
      {t > 226.3 && t < 231.6 && <MapaRio t={t} />}
      <Chip t={t} t0={232.18} t1={235.3} text="DEEP WATER" color={C.teal} tinta={C.noche} x={960} y={930} centro size={56} />
      <Chip t={t} t0={234.84} t1={235.8} text="TIE UP TO THE TREES" color="#1f6a3a" x={960} y={140} centro size={52} />
      <Chip t={t} t0={236.48} t1={237.6} text="EASY TO DEFEND" color={C.lima} tinta={C.noche} x={960} y={140} centro size={56} />
      {t > 237.8 && t < 239.0 && <Grande t={t} t0={237.94} text="ALSO A SWAMP" y={180} size={120} color="#9be15d" />}
      {/* el fuerte en 19 días */}
      {t > 239.3 && t < 247.2 && (
        <div style={{ position: "absolute", left: 80, top: 80, opacity: ent(t, 239.4) * (1 - prog(t, 246.9, 247.2)), fontFamily, fontWeight: 700, background: "#fff3d6", border: "8px solid #2a1408", borderRadius: 20, padding: "8px 26px", textAlign: "center" }}>
          <div style={{ fontSize: 30, color: C.rojo }}>DAY</div>
          <div style={{ fontSize: 96, color: C.noche, lineHeight: 1 }}>{dia}<span style={{ fontSize: 40 }}> / 19</span></div>
        </div>
      )}
      {t > 239.4 && t < 247.2 && <div style={{ position: "absolute", left: 1160, top: 40, width: 680, height: 600, background: "#cfe3a8", border: "8px solid #2a1408", borderRadius: 26, opacity: ent(t, 239.45) * (1 - prog(t, 246.9, 247.2)) }} />}
      {t > 239.4 && t < 247.2 && <FuerteTriangulo x={1500} y={330} s={0.6} t={t} dibuja={prog(t, 239.5, 246.2)} />}
      <Chip t={t} t0={241.98} t1={243.2} text="A TRIANGLE" color={C.tierra} x={1500} y={590} centro size={44} />
      <Chip t={t} t0={243.24} t1={247.0} text="WALLS · 4 METERS" color="#7a4620" x={960} y={930} centro size={54} />
      <Chip t={t} t0={245.44} t1={247.0} text="3 CANNONS" color="#3a3a44" x={1500} y={590} centro size={44} />
      <Chip t={t} t0={248.3} t1={251.4} text="CHURCH" color={C.violeta} x={910} y={330} centro size={44} />
      <Chip t={t} t0={249.14} t1={251.4} text="STOREHOUSE" color={C.tierra} x={1380} y={380} centro size={44} />
      <Chip t={t} t0={250.2} t1={251.4} text="VERY BAD HOUSES" color={C.rojo} x={520} y={380} centro size={44} />
      {t > 251.5 && t < 252.9 && <Grande t={t} t0={251.6} text="NOW, THE WATER" y={200} size={110} />}
      <Chip t={t} t0={253.22} t1={255.3} text="NO FRESH SPRING" color={C.rojo} x={960} y={140} centro size={56} />
      <Chip t={t} t0={255.34} t1={256.2} text="DRINK THE RIVER" color={C.teal} tinta={C.noche} x={960} y={140} centro size={56} />
      {/* George Percy */}
      {t > 256.7 && t < 265.0 && (
        <div style={{ position: "absolute", left: 1540, top: 120, transform: `scale(${ent(t, 256.8) * (1 - prog(t, 264.5, 265.0))}) rotate(-4deg)`, width: 290, height: 330, background: "#fff3d6", border: "8px solid #2a1408", borderRadius: 18, overflow: "hidden" }}>
          <Persona x={145} y={340} h={340} t={t} seed={44} ropa={GENT(1)} gola gorro="pluma" barba="#3a2416" expr={t > 261.8 ? "enojado" : "neutro"} habla={t > 259.5} />
          <div style={{ position: "absolute", left: 0, top: 268, width: 290, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 36, color: "#fff", background: C.rojo }}>GEORGE PERCY</div>
        </div>
      )}
      <Chip t={t} t0={260.06} t1={261.8} text="HIGH TIDE → SALTY" color="#2a7ac8" x={960} y={930} centro size={56} />
      <Chip t={t} t0={262.42} t1={264.9} text="LOW TIDE → SLIME & FILTH" color="#6a7a2a" x={960} y={930} centro size={56} />
      <Chip t={t} t0={265.56} t1={267.5} text="SUMMER" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={56} />
      {t > 271.9 && t < 274.6 && <Grande t={t} t0={272.28} text="RIGHT BACK" y={180} size={120} color={C.ambar} />}
      <Chip t={t} t0={275.2} t1={276.4} text="MOSQUITOES" color="#3a3a44" x={960} y={140} centro size={56} />
      <Chip t={t} t0={276.52} t1={277.5} text="FEVERS" color={C.rojo} x={960} y={140} centro size={56} />
      <Chip t={t} t0={277.64} t1={280.3} text="THE FLUX" color="#7a5a2a" x={760} y={140} centro size={56} />
      <Chip t={t} t0={279.14} t1={280.3} text="= DYSENTERY" color={C.violeta} x={1160} y={140} centro size={56} />
      {noche && (
        <>
          <Chip t={t} t0={282.2} t1={288.9} text="3 OR 4 IN A NIGHT" color={C.rojo} x={960} y={140} centro size={60} />
          {t > 287.5 && <Grande t={t} t0={287.56} text="NOBODY COULD HAVE KNOWN" y={930} size={84} color={C.ambar} />}
        </>
      )}
      <Chip t={t} t0={289.68} t1={295.8} text="1998 · SCIENTISTS" color={C.teal} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={293.66} t1={295.8} text="BALD CYPRESS" color="#5a8a44" x={960} y={930} centro size={54} />
      {/* los anillos */}
      {t > 295.8 && t < 311.9 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${1 - prog(t, 311.3, 311.9)})`, transformOrigin: "960px 540px" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(27,18,64,.55)", opacity: ent(t, 295.9) }} />
          <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "720px 560px", transform: `scale(${1 + prog(t, 296.5, 303.5) * 0.18})` }}><Anillos t={t} t0={295.96} x={720} y={560} r={360} tMarca={301.36} /></div>
          <Chip t={t} t0={296.36} t1={298.0} text="1 RING = 1 YEAR" color={C.ambar} tinta={C.noche} x={1450} y={300} centro size={50} />
          <Chip t={t} t0={298.1} t1={301.5} text="THIN RING" color={C.rojo} x={1450} y={300} centro size={50} />
          <Chip t={t} t0={299.02} t1={301.5} text="= DRY YEAR" color={C.naranja} x={1450} y={380} centro size={50} />
          <Chip t={t} t0={301.54} t1={311.9} text="1606 – 1612" color={C.rojo} x={1450} y={300} centro size={64} />
          {t > 304.2 && <Grande t={t} t0={304.24} text="WORST DROUGHT" x={1520} y={470} size={80} color={C.ambar} />}
          {t > 306.1 && <Grande t={t} t0={306.14} text="IN 770 YEARS" x={1520} y={600} size={80} />}
          {t > 310.2 && <div style={{ position: "absolute", left: 960, top: 930, transform: `translate(-50%,0) scale(${ent(t, 310.26)})`, fontFamily, fontWeight: 700, fontSize: 56, color: "#fff", background: C.rojo, borderRadius: 12, padding: "4px 16px", whiteSpace: "nowrap" }}>THE RED RINGS: THAT IS WHEN YOU ARRIVE</div>}
        </div>
      )}
      {t > 308.3 && t < 310.0 && <Grande t={t} t0={308.36} text="770 YEARS" y={930} size={130} color="#ff5a6a" />}
      {/* seasoning */}
      {t > 313.5 && t < 322.7 && (
        <>
          <Grande t={t} t0={313.62} text={'"SEASONING"'} y={170} size={120} color={C.ambar} />
          <Salero t={t} x={1240} y={420} s={0.8} />
          {Array.from({ length: 16 }, (_, i) => { const k = ((t - 313.6) * 1.6 + i / 16) % 1; return <div key={i} style={{ position: "absolute", left: 1200 + ((i * 37) % 80), top: 480 + k * 300, width: 10, height: 10, background: "#fff", transform: "rotate(45deg)", opacity: 1 - k }} />; })}
        </>
      )}
      <Chip t={t} t0={316.14} t1={318.4} text="SURVIVE YOUR FIRST SUMMER" color={C.naranja} x={960} y={930} centro size={52} />
      {t > 319.6 && t < 322.7 && <div style={{ position: "absolute", left: 960, top: 600, transform: `translate(-50%,-50%) scale(${ent(t, 321.82, 0, { damping: 9, stiffness: 260 })}) rotate(-10deg)`, fontFamily, fontWeight: 700, fontSize: 80, color: C.lima, border: `10px solid ${C.lima}`, borderRadius: 18, padding: "6px 30px", background: "rgba(27,18,64,.6)", whiteSpace: "nowrap" }}>SEASONED</div>}
      {/* la moneda al aire */}
      {t > 322.7 && t < 330.2 && (() => {
        const fl = prog(t, 328.9, 329.9);
        const y = 560 - Math.sin(fl * Math.PI) * 300;
        const lado = Math.cos((t - 322.7) * (fl > 0 ? 18 : 3));
        return (
          <div style={{ position: "absolute", left: 0, top: 0, opacity: ent(t, 322.8) * (1 - prog(t, 329.9, 330.2)) }}>
            <div style={{ position: "absolute", left: 960, top: y, transform: `translate(-50%,-50%) scaleY(${Math.abs(lado) < 0.08 ? 0.08 : lado})` }}>
              <svg width={300} height={300} viewBox="-150 -150 300 300" style={{ overflow: "visible" }}><circle r={140} fill={lado > 0 ? C.oro : "#b8b8c8"} stroke="#8a6a1a" strokeWidth={12} /><text y={26} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={84} fill={C.noche}>{lado > 0 ? "LIVE" : "DIE"}</text></svg>
            </div>
            <Chip t={t} t0={325.76} t1={330.0} text="SURVIVE YEAR ONE?" color={C.violeta} x={960} y={140} centro size={56} />
            <Chip t={t} t0={328.82} t1={330.0} text="~ A COIN TOSS" color={C.rojo} x={960} y={930} centro size={56} />
          </div>
        );
      })()}
      <Chip t={t} t0={330.66} t1={338.6} text="JANUARY 1608" color="#6a8ab8" x={960} y={140} centro size={60} />
      {t > 329.9 && <Nieve t={t} n={70} op={0.75 * prog(t, 330, 331.5)} />}
      {t > 334.9 && <Tablero t={t} valor={interpolate(t, [335.5, 337.6], [104, 38], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} rojo={t > 336.8} x={1560} y={190} s={t < 339 ? 1.7 : 1} />}
      {t > 341.3 && <Grande t={t} t0={341.72} text="…THE GOOD ONE" y={930} size={110} color={C.ambar} />}
      {noche && <Tinte color="#0a0820" op={0.6} />}
    </AbsoluteFill>
  );
};
