import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Chip, Grande, fontFamily, Emote, cabeza } from "./kit";
import { Trampas } from "./kit2";
import { Mundo, K, En, SUELO, AGUA } from "./mundo";
import { Base, FX } from "./base";
import { GENT, COLONO, POW, Poste, Bicho, Olla, Canasta, Tablero, Nieve, Pez, Tinte } from "./kitj";
import { Tacha, Lupa } from "./kitj2";

// TRAMPA 7 · EL TIEMPO DEL HAMBRE (649,7-741,1 s). Percy presidente; Powhatan corta el comercio, emboscadas y sitio;
// el menú que se va tachando (caballos → ratones → botas → almidón); los que se van; lo que no se cuenta;
// Jane (2012); el río sin peces; de 500 a 60. Sin nada explícito: todo se dice con ausencias.
export const CAM7: K[] = [
  [649.7, 24350, 620, 0.62], [650.6, 24650, 650, 0.95], [651.9, 24650, 650, 0.95], [652.7, 24350, 680, 1.05], [656.6, 24350, 680, 1.05],
  [657.5, 28200, 640, 0.75], [659.0, 28200, 640, 0.75], [659.9, 26100, 640, 0.6], [663.2, 26300, 640, 0.6], [664.0, 24800, 620, 0.55],
  [669.7, 25000, 610, 0.45], [673.4, 25000, 610, 0.45], [674.2, 24350, 680, 0.9], [687.5, 24400, 680, 0.95], [695.4, 24350, 640, 0.7],
  [696.3, 25900, 620, 0.4], [702.5, 26100, 620, 0.42], [703.4, 24350, 600, 0.3], [707.9, 24350, 600, 0.24], [708.6, 24350, 780, 1.1],
  [719.4, 24380, 780, 1.15], [720.3, 21900, 800, 0.85], [727.4, 22050, 800, 0.85], [728.2, 23400, 680, 0.6], [731.0, 23500, 680, 0.6],
  [731.9, 24350, 610, 0.45], [741.1, 24350, 610, 0.48],
];
const CIELO7: [number, string][] = [[649, "invierno"], [652.3, "hambre"], [702.7, "noche"], [708.3, "primavera"], [719.7, "verano"], [725.7, "invierno"], [731.2, "primavera"]];

// el menú del sitio: cada cosa aparece con la palabra y se tacha con la siguiente
const MENU: [Parameters<typeof Bicho>[0]["k"], number, string][] = [
  ["caballo", 675.09, "HORSES"], ["cerdo", 676.37, "HOGS"], ["gallina", 677.15, "CHICKENS"], ["cabra", 677.83, "GOATS"], ["perro", 678.93, "DOGS"],
  ["gato", 680.03, "CATS"], ["raton", 681.33, "RATS & MICE"], ["bota", 684.61, "BOOTS"], ["cinturon", 685.93, "BELTS"], ["almidon", 691.97, "COLLAR STARCH"],
];

const Menu: React.FC<{ t: number }> = ({ t }) => {
  const e = ent(t, 674.2) * (1 - prog(t, 694.9, 695.5));
  return (
    <div style={{ position: "absolute", left: 1150, top: 120, width: 700, height: 820, transform: `scale(${e}) rotate(2deg)`, transformOrigin: "50% 0", background: "#f4e2b8", border: "10px solid #5a3a1a", borderRadius: 24, boxShadow: "0 20px 40px rgba(0,0,0,.4)" }}>
      <div style={{ position: "absolute", left: 0, top: 14, width: 700, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 56, color: "#5a1a0a" }}>WHAT'S LEFT TO EAT</div>
      {MENU.map(([k, t0, label], i) => {
        if (t < t0) return null;
        const col = i % 2, fila = Math.floor(i / 2);
        const x = 180 + col * 340, y = 170 + fila * 128;
        const sig = i < MENU.length - 1 ? MENU[i + 1][1] : 694.0;
        return (
          <div key={k} style={{ position: "absolute", left: 0, top: 0, opacity: t > sig + 0.3 ? 0.55 : 1 }}>
            <Bicho k={k} x={x - 70} y={y} s={0.42} t={t} t0={t0} />
            <div style={{ position: "absolute", left: x - 10, top: y - 18, fontFamily, fontWeight: 700, fontSize: label.length > 10 ? 24 : 30, color: "#3a1a0a", whiteSpace: "nowrap" }}>{label}</div>
            <Tacha t={t} t0={sig} x={x + 10} y={y} r={70} />
          </div>
        );
      })}
    </div>
  );
};

export const P7: React.FC<{ t: number }> = ({ t }) => {
  if (t < 649.5 || t > 741.3) return null;
  const parte = [25650, 25780, 25910];
  const parteX = (i: number) => interpolate(t, [659.3, 661.8], [parte[i], parte[i] + 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Mundo t={t} cam={CAM7} cielo={CIELO7}>
        <Base t={t} />
        {t < 652.5 && <En x={24650} w={800}><Poste t={t} t0={649.75} x={24650} y={SUELO} n={7} titulo="THE STARVING TIME" s={1.2} /></En>}
        {/* Percy, el nuevo presidente */}
        {t > 652.2 && t < 657.2 && (
          <En x={FX} w={600}>
            <Persona x={FX} y={SUELO} h={330} t={t} seed={77} ropa={GENT(1)} gola gorro="pluma" flaco={0.3} expr="triste" aparece={652.3} />
            <Emote t={t} t0={654.5} tipo="sudor" x={cabeza(FX, SUELO, 330).x} y={cabeza(FX, SUELO, 330).y} s={0.5} />
          </En>
        )}
        {/* Powhatan dice basta */}
        {t > 656.8 && t < 659.6 && (
          <En x={28200} w={600}>
            <Persona x={28200} y={SUELO} h={360} t={t} seed={540} ropa={POW(2)} viejo plumaPelo capa="#6a3a1a" expr="enojado" bD={150} cD={30} />
            {[27900, 28500].map((x, i) => <Persona key={x} x={x} y={SUELO} h={300} t={t} seed={541 + i} ropa={POW(i)} plumaPelo flip={i === 1} expr="enojado" />)}
          </En>
        )}
        {/* la partida que sale a buscar maíz y no vuelve */}
        {t > 659.2 && t < 663.6 && parte.map((_, i) => {
          const x = parteX(i);
          const op = 1 - prog(t, 661.9 + i * 0.3, 662.8 + i * 0.3);
          return <En key={i} x={x} w={200}><div style={{ position: "absolute", left: 0, top: 0, opacity: op }}><Persona x={x} y={SUELO} h={230} t={t} seed={760 + i} ropa={COLONO(i)} camina={t < 661.8 ? 1.4 : 0} expr={t > 660.9 ? "miedo" : "neutro"} flaco={0.2} manoD={i === 1 ? <path d="M -24 -4 L 24 -4 Q 20 22 0 24 Q -20 22 -24 -4 Z" fill="#a0683a" /> : undefined} /></div></En>;
        })}
        {t > 660.8 && t < 662.6 && (
          <svg style={{ position: "absolute", left: 26100, top: SUELO - 300, overflow: "visible" }} width={10} height={10}>
            {[0, 1, 2, 3, 4].map((i) => { const k = prog(t, 660.9 + i * 0.12, 661.5 + i * 0.12); if (k <= 0 || k >= 1) return null; const x = 900 - k * 600 + i * 30, y = 40 + i * 30 + k * 60; return <g key={i}><line x1={x} y1={y} x2={x + 70} y2={y - 8} stroke="#5a3a1a" strokeWidth={5} /><path d={`M ${x} ${y} l 14 -9 l 0 14 Z`} fill="#3a3a3a" /></g>; })}
          </svg>
        )}
        {/* el sitio: ojos en el bosque */}
        {t > 663.8 && t < 674.0 && (
          <>
            {[0, 1, 2, 3, 4].map((i) => { const x = interpolate(t, [663.9, 665.4], [25200 + i * 90, FX - 40 + i * 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return t < 665.6 ? <En key={i} x={x} w={200}><Persona x={x} y={SUELO} h={220} t={t} seed={770 + i} ropa={COLONO(i)} camina={1.4} expr="miedo" flip /></En> : null; })}
            {t > 666.0 && (() => { const x = interpolate(t, [666.2, 667.8, 668.6, 669.6], [FX + 330, FX + 700, FX + 700, FX + 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return <En x={x} w={200}><Persona x={x} y={SUELO} h={220} t={t} seed={775} ropa={COLONO(3)} camina={t < 667.8 || t > 668.6 ? 1.4 : 0} flip={t > 668.6} expr={t > 668 ? "miedo" : "neutro"} flaco={0.25} /></En>; })()}
            {Array.from({ length: 9 }, (_, i) => { const x = 25250 + i * 130, y = SUELO - 120 - (i % 3) * 70; const parp = Math.sin(t * 3 + i * 1.7) > 0.93 ? 0.15 : 1; return <En key={i} x={x} w={60}><svg style={{ position: "absolute", left: x - 30, top: y - 10, opacity: prog(t, 667.9 + i * 0.12, 668.4 + i * 0.12) }} width={60} height={20}><ellipse cx={14} cy={10} rx={10} ry={8 * parp} fill="#fff4a0" /><ellipse cx={44} cy={10} rx={10} ry={8 * parp} fill="#fff4a0" /></svg></En>; })}
            {t > 670.5 && <En x={FX} w={1000}><svg style={{ position: "absolute", left: FX - 560, top: SUELO - 420, overflow: "visible" }} width={1120} height={440}><rect x={0} y={0} width={1120} height={440} rx={60} fill="none" stroke={C.rojo} strokeWidth={10} strokeDasharray="40 24" strokeDashoffset={-t * 60} opacity={ent(t, 670.6)} /></svg></En>}
            {t > 672.6 && <En x={FX + 60} w={300}><Canasta x={FX + 60} y={SUELO - 70} s={0.5} llena={0} /></En>}
          </>
        )}
        {/* adentro: las ollas */}
        {t > 674.0 && t < 695.6 && (
          <>
            <En x={FX - 220} w={300}><Olla x={FX - 220} y={SUELO - 100} s={0.5} t={t} dentro={t > 684 ? "bota" : "agua"} /></En>
            {[FX - 460, FX + 20].map((x, i) => <En key={x} x={x} w={200}><Persona x={x} y={SUELO} h={250} t={t} seed={780 + i} ropa={i ? GENT(2) : COLONO(1)} gola={i === 1} flaco={0.35} expr="triste" flip={i === 1} /></En>)}
          </>
        )}
        {/* los que se van: a los pueblos y al bosque */}
        {t > 695.5 && t < 703.0 && (
          <>
            {[0, 1, 2].map((i) => { const x = interpolate(t, [695.8 + i * 0.4, 699.8 + i * 0.4], [FX + 400, 27200 + i * 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return <En key={i} x={x} w={200}><Persona x={x} y={SUELO} h={220} t={t} seed={790 + i} ropa={COLONO(i)} camina={1.2} flaco={0.35} expr="triste" /></En>; })}
            {t > 699.4 && [0, 1].map((i) => { const x = 25800 + i * 260; return <En key={i} x={x} w={200}><div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - prog(t, 701.4 + i * 0.3, 702.2 + i * 0.3) }}><Persona x={x} y={SUELO} h={210} t={t} seed={795 + i} ropa={COLONO(i + 2)} inclina={30} bD={160 + Math.sin(t * 8 + i) * 20} flaco={0.35} expr="triste" aparece={699.6 + i * 0.2} /></div></En>; })}
          </>
        )}
        {/* 2012: la excavación */}
        {t > 708.2 && t < 719.8 && (
          <En x={FX} w={900}>
            <svg style={{ position: "absolute", left: FX - 360, top: SUELO - 12, overflow: "visible" }} width={720} height={220}>
              <path d="M 0 0 L 720 0 L 680 200 L 40 200 Z" fill="#7a4a24" stroke="#4e2a12" strokeWidth={8} />
              {[50, 100, 150].map((y) => <line key={y} x1={20} y1={y} x2={700} y2={y} stroke="#5a3418" strokeWidth={6} strokeDasharray="30 14" />)}
              {[100, 240, 380, 520, 640].map((x) => <line key={x} x1={x} y1={-30} x2={x} y2={0} stroke="#e0b44a" strokeWidth={6} />)}
              <path d="M 100 -24 L 640 -24" stroke="#e0b44a" strokeWidth={4} />
              <rect x={300} y={150} width={120} height={22} rx={10} fill="#efe6cf" opacity={prog(t, 710.4, 711.5)} />
            </svg>
            {[FX - 420, FX + 420].map((x, i) => <Persona key={x} x={x} y={SUELO} h={240} t={t} seed={800 + i} ropa={{ ...COLONO(i), tunica: i ? "#2a7a9a" : "#c85a2a", tunica2: i ? "#1a5a72" : "#8a3a1a" }} gorro="sombrero" inclina={i ? -24 : 24} flip={i === 1} expr={t > 711.3 ? "sorpresa" : "neutro"} aparece={708.5 + i * 0.3} />)}
          </En>
        )}
        {/* el río: verano lleno de peces, invierno vacío */}
        {t > 719.5 && t < 728.2 && Array.from({ length: 7 }, (_, i) => {
          const base = 21300 + i * 180;
          const huye = prog(t, 726.7 + i * 0.08, 727.7 + i * 0.08);
          const x = base + ((t * 60 + i * 90) % 300) - huye * 1400;
          return <En key={i} x={x} w={300}><Pez t={t} x={x} y={AGUA + 70 + (i % 3) * 40} s={i === 3 ? 2.0 : 1.1} esturion={i === 3} flip seed={i} /></En>;
        })}
        {/* las ostras, afuera de las murallas */}
        {t > 727.6 && t < 731.6 && (
          <En x={23300} w={800}>
            <svg style={{ position: "absolute", left: 22900, top: SUELO - 30, overflow: "visible" }} width={800} height={80}>
              {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={40 + i * 80} cy={40 + (i % 2) * 12} rx={34} ry={18} fill="#a8a8b0" stroke="#5a5a64" strokeWidth={5} transform={`rotate(${(i % 3) * 14 - 14} ${40 + i * 80} 40)`} />)}
              <path d={`M 760 10 Q ${900} -60 ${1100} 0`} stroke={C.rojo} strokeWidth={8} strokeDasharray="22 14" fill="none" opacity={ent(t, 729.8)} />
            </svg>
          </En>
        )}
      </Mundo>

      {/* pantalla */}
      {((t > 660 && t < 703) || (t > 725.7 && t < 731.5)) && <Nieve t={t} n={70} op={0.55} />}
      {t > 696 && t < 708.3 && <Tinte color="#120c30" op={0.35 + 0.4 * prog(t, 702.7, 704)} />}
      {t < 652.5 && <Trampas t={t} t0={649.8} n={7} y={960} />}
      <Chip t={t} t0={652.29} t1={656.8} text="NEW PRESIDENT: GEORGE PERCY" color={C.violeta} x={960} y={140} centro size={54} />
      <Chip t={t} t0={654.53} t1={656.8} text="SICK" color={C.lima} tinta={C.noche} x={420} y={930} size={44} />
      <Chip t={t} t0={655.13} t1={656.8} text="YOUNG" color={C.teal} tinta={C.noche} x={620} y={930} size={44} />
      <Chip t={t} t0={655.91} t1={656.8} text="SON OF AN EARL" color={C.oro} tinta={C.noche} x={880} y={930} size={44} />
      {t > 657.6 && t < 659.4 && <Grande t={t} t0={657.8} text="ENOUGH." y={200} size={150} color={C.rojo} />}
      <Chip t={t} t0={659.23} t1={661.9} text="TRADING PARTY" color={C.tierra} x={960} y={140} centro size={56} />
      <Chip t={t} t0={660.99} t1={663.3} text="AMBUSHED" color={C.rojo} x={960} y={140} centro size={60} />
      <Chip t={t} t0={661.95} t1={663.3} text="MANY NEVER COME BACK" color={C.violeta} x={960} y={930} centro size={52} />
      <Chip t={t} t0={663.43} t1={665.8} text="BEHIND THE WALLS" color={C.tierra} x={960} y={140} centro size={56} />
      <Chip t={t} t0={667.47} t1={669.8} text="GO OUT FOR FOOD?" color={C.naranja} x={960} y={140} centro size={56} />
      {t > 670.6 && t < 673.9 && <Grande t={t} t0={670.97} text="UNDER SIEGE" y={200} size={130} color={C.rojo} />}
      <Chip t={t} t0={672.77} t1={673.9} text="ALMOST NOTHING INSIDE" color="#6a6a7a" x={960} y={930} centro size={52} />
      {t > 674 && t < 695.6 && <Menu t={t} />}
      <Chip t={t} t0={684.11} t1={687.5} text="BOILED" color={C.naranja} x={300} y={140} size={56} />
      {t > 687.6 && t < 690.1 && (
        <div style={{ position: "absolute", left: 120, top: 150, width: 900, transform: `scale(${ent(t, 687.75)})`, transformOrigin: "0 0", background: "#fff3d6", border: "8px solid #2a1408", borderRadius: 20, padding: "18px 30px", fontFamily, fontWeight: 700 }}>
          <div style={{ fontSize: 30, color: C.violeta }}>GEORGE PERCY WROTE:</div>
          <div style={{ fontSize: 64, color: C.noche, lineHeight: 1.05 }}>THEY ATE "ANYTHING AT ALL"</div>
        </div>
      )}
      <Chip t={t} t0={690.45} t1={694.9} text="OTHER ACCOUNTS" color="#6a6a7a" x={300} y={140} size={44} />
      {t > 693.8 && t < 695.6 && <Grande t={t} t0={694.81} text="PASTE" x={560} y={360} size={110} color={C.crema} />}
      <Chip t={t} t0={695.67} t1={699.4} text="RUN TO THE POWHATAN" color={C.tierra} x={960} y={140} centro size={54} />
      <Chip t={t} t0={698.33} t1={699.4} text="HOPING FOR MERCY" color={C.violeta} x={960} y={930} centro size={52} />
      <Chip t={t} t0={699.55} t1={702.6} text="DIG FOR ROOTS" color="#6a4a2a" x={960} y={140} centro size={54} />
      <Chip t={t} t0={701.45} t1={702.6} text="NEVER COME BACK" color={C.rojo} x={960} y={930} centro size={52} />
      {t > 704.4 && t < 708.2 && <Grande t={t} t0={705.31} text="TOO DESPERATE TO DESCRIBE" y={540} size={84} color="#d8c8e0" />}
      <Chip t={t} t0={708.27} t1={711.2} text="2012" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={64} />
      <Chip t={t} t0={709.77} t1={711.2} text="ARCHAEOLOGISTS" color={C.teal} tinta={C.noche} x={960} y={930} centro size={52} />
      {/* Jane */}
      {t > 712.4 && t < 719.6 && (
        <div style={{ position: "absolute", left: 1330, top: 170, transform: `scale(${ent(t, 712.5) * (1 - prog(t, 719.1, 719.6))}) rotate(2deg)`, width: 360, height: 460, background: "#efe2c4", border: "8px solid #2a1408", borderRadius: 18, overflow: "hidden", filter: "sepia(.6)" }}>
          <Persona x={180} y={500} h={400} t={t} seed={812} ropa={{ ...COLONO(2), tunica: "#7a5a7a", tunica2: "#4e3a4e" }} expr="neutro" />
          <div style={{ position: "absolute", left: 0, top: 10, width: 360, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 30, color: "#5a1a0a" }}>ENGLISH GIRL · 14</div>
          {t > 714.9 && <div style={{ position: "absolute", left: 0, bottom: 14, width: 360, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 72, color: "#2a1408", transform: `scale(${ent(t, 714.97)})` }}>"JANE"</div>}
        </div>
      )}
      {t > 715.6 && t < 719.6 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${1 - prog(t, 719.1, 719.6)})`, transformOrigin: "560px 500px" }}>
          <Lupa t={t} t0={715.7} x={560} y={500} r={250}>
            <div style={{ position: "absolute", inset: 0, background: "#7a4a24" }} />
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={500} height={500}>
              <path d="M 120 250 Q 120 220 150 222 L 350 222 Q 380 220 380 250 Q 380 280 350 278 L 150 278 Q 120 280 120 250 Z" fill="#efe6cf" stroke="#b8a888" strokeWidth={5} />
              {[200, 240, 280].map((x, i) => <line key={x} x1={x} y1={232} x2={x + 10} y2={268} stroke="#6a5a4a" strokeWidth={4} opacity={prog(t, 716.0 + i * 0.25, 716.3 + i * 0.25)} />)}
            </svg>
          </Lupa>
        </div>
      )}
      <Chip t={t} t0={716.71} t1={719.6} text="THE RUMORS WERE TRUE" color={C.rojo} x={960} y={930} centro size={54} />
      <Chip t={t} t0={719.69} t1={725.6} text="REMEMBER THE RIVER?" color={C.teal} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={721.87} t1={725.6} text="STURGEON = AS LONG AS A MAN" color={C.lima} tinta={C.noche} x={960} y={930} centro size={50} />
      <Chip t={t} t0={725.97} t1={727.6} text="WINTER: THE FISH LEAVE" color="#6a8ab8" x={960} y={140} centro size={56} />
      <Chip t={t} t0={728.37} t1={731.1} text="OYSTERS" color="#8a8a94" x={960} y={140} centro size={56} />
      <Chip t={t} t0={729.77} t1={731.1} text="= OUTSIDE THE WALLS" color={C.rojo} x={960} y={930} centro size={52} />
      <Chip t={t} t0={731.31} t1={735.9} text="SPRING 1610" color={C.lima} tinta={C.noche} x={960} y={140} centro size={60} />
      {t > 732.6 && t < 739.4 && <Tablero t={t} valor={Math.round(interpolate(t, [733.7, 735.8], [500, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))} titulo="ALIVE" rojo={t > 735.6} x={960} y={430} s={2.2} />}
      {t > 739.5 && <Grande t={t} t0={739.67} text="THE STARVING TIME" y={420} size={140} color={C.ambar} />}
    </AbsoluteFill>
  );
};
