import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Chip, Grande, fontFamily, Emote, cabeza } from "./kit";
import { Trampas } from "./kit2";
import { Mundo, K, En, SUELO, AGUA } from "./mundo";
import { Base, FX } from "./base";
import { GENT, COLONO, POW, Poste, Bicho, Olla, Canasta, Tablero, Nieve, Pez, Tinte, Bote } from "./kitj";
import { Tacha, Lupa } from "./kitj2";
import { Fogata } from "./P0";
import { Vineta } from "./vineta";

// TRAMPA 7 · EL TIEMPO DEL HAMBRE (649,7-741,1 s). Percy presidente; Powhatan corta el comercio, emboscadas y sitio;
// el menú que se va tachando (caballos → ratones → botas → almidón); los que se van; lo que no se cuenta;
// Jane (2012); el río sin peces; de 500 a 60. Sin nada explícito: todo se dice con ausencias.
export const CAM7: K[] = [
  [649.7, 24350, 620, 0.62], [650.6, 24650, 650, 0.95], [651.9, 24650, 650, 0.95], [652.7, 24350, 680, 1.05], [656.6, 24350, 680, 1.05],
  [657.5, 28200, 640, 0.75], [659.0, 28200, 640, 0.75], [659.9, 26150, 680, 0.82], [663.2, 26350, 680, 0.85], [664.0, 24900, 670, 0.72],
  [669.7, 25150, 660, 0.66], [673.4, 25100, 660, 0.68], [674.2, 24350, 680, 0.9], [687.5, 24400, 680, 0.95], [695.4, 24350, 640, 0.7],
  [696.3, 25500, 680, 0.66], [699.3, 26100, 680, 0.7], [699.7, 25930, 780, 1.25], [702.5, 25960, 780, 1.3], [703.4, 24350, 740, 1.0], [707.9, 24350, 740, 1.08], [708.6, 24350, 780, 1.1],
  [719.4, 24380, 780, 1.15], [720.3, 22000, 780, 0.95], [727.4, 22150, 780, 0.98], [728.2, 23400, 680, 0.6], [731.0, 23500, 680, 0.6],
  [731.9, 24350, 700, 0.85], [741.1, 24350, 700, 0.9],
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
            <div style={{ position: "absolute", left: x - 10, top: y - 18, fontFamily, fontWeight: 700, fontSize: label.length > 12 ? 32 : label.length > 10 ? 38 : 46, color: "#3a1a0a", whiteSpace: "nowrap" }}>{label}</div>
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
          return <En key={i} x={x} w={200}><div style={{ position: "absolute", left: 0, top: 0, opacity: op }}><Persona x={x} y={SUELO} h={230} t={t} seed={760 + i} ropa={COLONO(i)} camina={t < 661.4 ? 1.4 : 0} inclina={-75 * prog(t, 661.4 + i * 0.25, 661.9 + i * 0.25)} expr={t > 660.9 ? "miedo" : "neutro"} flaco={0.2} manoD={i === 1 ? <path d="M -24 -4 L 24 -4 Q 20 22 0 24 Q -20 22 -24 -4 Z" fill="#a0683a" /> : undefined} /></div></En>;
        })}
        {t > 660.8 && t < 662.6 && (
          <svg style={{ position: "absolute", left: 26100, top: SUELO - 300, overflow: "visible" }} width={10} height={10}>
            {[0, 1, 2, 3, 4].map((i) => { const k = prog(t, 660.9 + i * 0.12, 661.5 + i * 0.12); if (k <= 0 || k >= 1) return null; const x = 900 - k * 500 + i * 30, y = 100 + i * 25 + k * 60; return <g key={i}><line x1={x} y1={y} x2={x + 70} y2={y - 8} stroke="#5a3a1a" strokeWidth={5} /><path d={`M ${x} ${y} l 14 -9 l 0 14 Z`} fill="#3a3a3a" /></g>; })}
          </svg>
        )}
        {t > 660.5 && t < 663.6 && [27050, 27250, 27450].map((x, i) => <En key={x} x={x} w={200}><Persona x={x} y={SUELO} h={260} t={t} seed={765 + i} ropa={POW(i)} plumaPelo flip expr="enojado" bD={120} cD={10} bI={110} cI={0} manoD={<path d="M 0 -70 Q 40 0 0 70" stroke="#5a3a1a" strokeWidth={8} fill="none" />} aparece={660.6 + i * 0.15} /></En>)}
        {/* el sitio: ojos en el bosque */}
        {t > 663.8 && t < 674.0 && (
          <>
            {[0, 1, 2, 3, 4].map((i) => { const x = interpolate(t, [663.9, 665.4], [25200 + i * 90, FX - 40 + i * 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return t < 665.6 ? <En key={i} x={x} w={200}><Persona x={x} y={SUELO} h={220} t={t} seed={770 + i} ropa={COLONO(i)} camina={1.4} expr="miedo" flip /></En> : null; })}
            {t > 666.0 && (() => { const x = interpolate(t, [666.2, 667.8, 668.6, 669.6], [FX + 330, FX + 700, FX + 700, FX + 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return <En x={x} w={200}><Persona x={x} y={SUELO} h={220} t={t} seed={775} ropa={COLONO(3)} camina={t < 667.8 || t > 668.6 ? 1.4 : 0} flip={t > 668.6} expr={t > 668 ? "miedo" : "neutro"} flaco={0.25} /></En>; })()}
            {Array.from({ length: 9 }, (_, i) => { const x = 25250 + i * 130, y = SUELO - 120 - (i % 3) * 70; const parp = Math.sin(t * 3 + i * 1.7) > 0.93 ? 0.15 : 1; return <En key={i} x={x} w={60}><svg style={{ position: "absolute", left: x - 30, top: y - 10, opacity: prog(t, 667.9 + i * 0.12, 668.4 + i * 0.12) }} width={60} height={20}><ellipse cx={14} cy={10} rx={10} ry={8 * parp} fill="#fff4a0" /><ellipse cx={44} cy={10} rx={10} ry={8 * parp} fill="#fff4a0" /></svg></En>; })}
            
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
            {t > 699.4 && [0, 1].map((i) => { const x = 25800 + i * 260; return <En key={i} x={x} w={200}><div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - prog(t, 701.4 + i * 0.3, 702.2 + i * 0.3) }}><Persona x={x} y={SUELO} h={210} t={t} seed={795 + i} ropa={COLONO(i + 2)} inclina={14} bD={160 + Math.sin(t * 8 + i) * 20} flaco={0.35} expr="triste" aparece={699.6 + i * 0.2} manoD={<g><rect x={-5} y={-20} width={10} height={130} fill="#6a4a2a" /><path d="M -22 104 L 22 104 L 16 150 Q 0 162 -16 150 Z" fill="#7a7a84" /></g>} /><svg style={{ position: "absolute", left: x + 30, top: SUELO - 30, overflow: "visible" }} width={10} height={10}><ellipse cx={60} cy={30} rx={90} ry={26} fill="#5a3a1a" />{[0, 1, 2].map((j) => <path key={j} d={`M ${20 + j * 40} 20 q 10 ${-30 - j * 6} 30 -${40 * prog(t, 700.2 + j * 0.4 + i * 0.2, 700.8 + j * 0.4 + i * 0.2)}`} stroke="#b08a5a" strokeWidth={9} fill="none" strokeLinecap="round" />)}</svg></div></En>; })}
          </>
        )}
        {t > 702.9 && t < 708.4 && (
          <En x={FX} w={900}>
            <Fogata t={t} x={FX} y={SUELO + 8} />
            {[-330, -200, 190, 320, -60].map((dx, i) => <Persona key={i} x={FX + dx} y={SUELO} h={i === 4 ? 200 : 250} t={t} seed={830 + i} ropa={i % 2 ? GENT(i) : COLONO(i)} flaco={0.5} inclina={dx < 0 ? 14 : -14} flip={dx > 0} expr={i === 4 ? "dormido" : i % 2 ? "miedo" : "triste"} mira={dx < 0 ? 0.6 : -0.6} />)}
          </En>
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
        {t > 719.5 && t < 728.2 && (
          <En x={22150} w={700}>
            {t > 721.6 && t < 725.8 && <div style={{ position: "absolute", left: 0, top: 0, opacity: ent(t, 721.7) * (1 - prog(t, 725.3, 725.8)) }}><Pez t={t} x={22150 + 460 - (t - 721.6) * 60} y={AGUA - 20 - Math.sin(prog(t, 721.9, 724.6) * Math.PI) * 180} s={3.4} esturion flip seed={9} /></div>}
            <Bote x={22150} y={AGUA - 20} t={t} s={1.4} />
            <Persona x={22150} y={AGUA - 30} h={240} t={t} seed={840} ropa={COLONO(1)} flaco={t > 725.7 ? 0.5 : 0.2} expr={t > 725.9 ? "triste" : t > 721.9 ? "sorpresa" : "neutro"} mira={0.4} manoD={<line x1={0} y1={0} x2={260} y2={-260} stroke="#6a4a2a" strokeWidth={8} />} />
            <svg style={{ position: "absolute", left: 22150, top: AGUA - 270, overflow: "visible" }} width={10} height={10}>
              <path d={`M 210 -20 Q 280 ${120 + Math.sin(t * 2) * 10} 300 300`} stroke="#ddd" strokeWidth={3} fill="none" />
            </svg>
          </En>
        )}
        {t > 731.5 && (
          <En x={FX} w={1400}>
            {Array.from({ length: 6 }, (_, i) => { const x = FX - 620 + i * 250 + (i > 2 ? 0 : -40); const vivo = t < 734.2 + i * 0.25 || i % 3 === 0; return <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: vivo ? 1 : 1 - prog(t, 734.2 + i * 0.25, 734.9 + i * 0.25) }}><Persona x={x} y={SUELO} h={260} t={t} seed={850 + i} ropa={i % 2 ? GENT(i) : COLONO(i)} flaco={0.55} expr={vivo ? "triste" : "miedo"} flip={i > 2} aparece={731.6 + i * 0.08} /></div>; })}
          </En>
        )}
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
      {/* plano medio: la partida que sale a cambiar maíz cae en una emboscada */}
      {t > 659.2 && t < 663.5 && (() => {
        const giro = prog(t, 660.95, 661.2), huye = prog(t, 661.1, 663.4);
        const canasta = <path d="M -40 -6 L 40 -6 L 30 40 L -30 40 Z" fill="#a0683a" stroke="#4e2a12" strokeWidth={5} />;
        const flechas: [number, number, number][] = [[660.9, 620, 430], [661.05, 470, 470], [661.2, 840, 400], [661.4, 330, 520], [661.6, 560, 360], [661.8, 760, 540]];
        const xb = 550;
        return <Vineta t={t} t0={659.25} t1={663.45} x={960} y={540} w={1300} h={640} cielo="#9ab88a" cielo2="#d0dcb0" suelo="#5a6a30" sueloY={500} rot={-1} sacude={t > 660.9 && t < 661.5 ? 5 : 0}>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1300} height={640}>
            {[60, 260, 560, 900, 1120].map((x, k) => <g key={x}><rect x={x - 18} y={200} width={36} height={300} fill="#4a3a22" /><circle cx={x} cy={180} r={110 + (k % 2) * 30} fill={k % 2 ? "#3a6a32" : "#2e5a2a"} /></g>)}
          </svg>
          {[0, 1, 2].map((i) => t > 660.6 + i * 0.15 && <Persona key={i} x={1060 + i * 100} y={800} h={500} t={t} seed={1350 + i} ropa={POW(i)} plumaPelo flip expr="enojado" bD={90} cD={0} bI={80} cI={10} manoD={<path d="M 0 -80 Q 46 0 0 80" stroke="#5a3a1a" strokeWidth={8} fill="none" />} aparece={660.6 + i * 0.15} />)}
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1300} height={640}>
            {[1000, 1180, 1320].map((x) => <ellipse key={x} cx={x} cy={600} rx={150} ry={110} fill="#2e5a26" />)}
          </svg>
          {[0, 1, 2].map((i) => { const cae = i === 2 ? prog(t, 661.5, 661.9) : 0; const x = 250 + i * 210 + 90 * prog(t, 659.25, 660.95) - (i === 2 ? 0 : 700 * huye); return <Persona key={i} x={x} y={820} h={480} t={t} seed={1355 + i} ropa={COLONO(i)} flaco={0.25} flip={giro > 0.5} camina={cae > 0 ? 0 : t < 660.95 ? 1.3 : 3.0} inclina={-80 * cae} expr={t > 660.9 ? "miedo" : "neutro"} bD={60} cD={40} manoD={i === 0 || (i === 1 && t < 661.3) ? canasta : undefined} />; })}
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1300} height={640}>
            {t > 661.3 && <g>{[0, 1, 2, 3, 4].map((k) => <ellipse key={k} cx={xb + (k - 2) * 40 * prog(t, 661.3, 661.8)} cy={600 - Math.sin(Math.PI * prog(t, 661.3, 661.8)) * 40} rx={14} ry={20} fill="#f2c230" stroke="#a07a10" strokeWidth={3} />)}<path d={`M ${xb - 40} 570 L ${xb + 40} 570 L ${xb + 30} 616 L ${xb - 30} 616 Z`} fill="#a0683a" stroke="#4e2a12" strokeWidth={5} transform={`rotate(${70 * prog(t, 661.3, 661.6)} ${xb} 600)`} /></g>}
            {flechas.map(([t0, x, y], k) => { if (t < t0) return null; const v = prog(t, t0, t0 + 0.3), d = Math.max(0, t - t0 - 0.3); return <g key={k} transform={`translate(${x + (1 - v) * 700} ${y - (1 - v) * 80}) rotate(${-6 + Math.sin(d * 40) * 6 * Math.exp(-d * 5)})`}><line x1={0} y1={0} x2={150} y2={0} stroke="#3a2412" strokeWidth={8} /><path d="M 0 0 L 18 -10 L 18 10 Z" fill="#3a3a3a" /><path d="M 150 0 L 176 -16 M 150 0 L 176 16 M 136 0 L 162 -16 M 136 0 L 162 16" stroke="#e8e0c8" strokeWidth={6} /></g>; })}
          </svg>
        </Vineta>;
      })()}
      <Chip t={t} t0={659.23} t1={660.95} text="TRADING PARTY" color={C.tierra} x={960} y={140} centro size={56} />
      <Chip t={t} t0={660.99} t1={663.3} text="AMBUSHED" color={C.rojo} x={960} y={140} centro size={60} />
      <Chip t={t} t0={661.95} t1={663.3} text="MANY NEVER COME BACK" color={C.violeta} x={960} y={930} centro size={52} />
      <Chip t={t} t0={663.43} t1={665.8} text="BEHIND THE WALLS" color={C.tierra} x={960} y={140} centro size={56} />
      <Chip t={t} t0={667.47} t1={669.8} text="GO OUT FOR FOOD?" color="#b0400a" x={960} y={140} centro size={66} />
      <Vineta t={t} t0={670.3} t1={674.0} x={960} y={560} w={1300} h={700} cielo="#5a6a7a" cielo2="#8a9aa8" suelo="#5a4a30" sueloY={560} titulo="UNDER SIEGE" colorTitulo={C.rojo}>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1300} height={700}>
          {[100, 300, 520, 760, 980, 1180].map((x, k) => <g key={x}><rect x={x - 18} y={120} width={36} height={200} fill="#1e2a1e" /><circle cx={x} cy={110} r={90 + (k % 2) * 20} fill="#1e3a24" /></g>)}
          {[220, 640, 1080].map((x, k) => { const asoma = prog(t, 670.6 + k * 0.5, 671.2 + k * 0.5); return <g key={x} transform={`translate(${x + 40 * asoma} 300)`} opacity={asoma}><circle cx={0} cy={-60} r={26} fill="#121812" /><path d="M -30 0 Q 0 -40 30 0 L 26 60 L -26 60 Z" fill="#121812" /><path d="M 2 -86 L 12 -130" stroke="#121812" strokeWidth={8} /><path d="M -50 -30 Q -70 20 -50 60" stroke="#121812" strokeWidth={6} fill="none" /></g>; })}
          {Array.from({ length: 26 }, (_, k) => <path key={k} d={`M ${k * 52} 700 L ${k * 52} 380 L ${26 + k * 52} 350 L ${52 + k * 52} 380 L ${52 + k * 52} 700 Z`} fill="#7a5530" stroke="#3a2412" strokeWidth={4} />)}
          {[[420, 470, 671.5], [880, 430, 672.6]].map(([x, y, t0], k) => { const v = prog(t, t0, t0 + 0.25); return t > t0 - 0.3 && <g key={k} transform={`translate(${x - (1 - v) * 500} ${y - (1 - v) * 120}) rotate(${-14 + Math.sin(Math.max(0, t - t0 - 0.25) * 40) * 6 * Math.exp(-Math.max(0, t - t0 - 0.25) * 5)})`}><line x1={-150} y1={0} x2={0} y2={0} stroke="#3a2412" strokeWidth={9} /><path d="M -150 0 L -180 -18 M -150 0 L -180 18 M -136 0 L -166 -18 M -136 0 L -166 18" stroke="#c8c0a8" strokeWidth={6} /></g>; })}
        </svg>
        {[[300, 1200], [620, 1201], [1000, 1202]].map(([x, seed], k) => <Persona key={seed} x={x} y={780} h={460} t={t} seed={seed} ropa={k === 1 ? GENT(3) : COLONO(k)} gola={k === 1} flaco={0.5} expr={t > 671.6 + k * 0.4 ? "miedo" : "triste"} mira={0} miraY={-0.6} salta={k === 0 ? 671.75 : k === 2 ? 672.8 : undefined} bI={30} bD={k === 1 ? 140 : 40} />)}
      </Vineta>
      <Chip t={t} t0={672.77} t1={673.9} text="ALMOST NOTHING INSIDE" color="#6a6a7a" x={960} y={930} centro size={52} />
      {t > 674 && t < 695.6 && <Menu t={t} />}
      <Chip t={t} t0={684.11} t1={687.5} text="BOILED" color={C.naranja} x={300} y={140} size={56} />
      {t > 687.6 && t < 690.1 && (
        <div style={{ position: "absolute", left: 120, top: 150, width: 900, transform: `scale(${ent(t, 687.75)})`, transformOrigin: "0 0", background: "#fff3d6", border: "8px solid #2a1408", borderRadius: 20, padding: "18px 30px", fontFamily, fontWeight: 700 }}>
          <div style={{ fontSize: 30, color: C.violeta }}>GEORGE PERCY WROTE:</div>
          <div style={{ fontSize: 64, color: C.noche, lineHeight: 1.05 }}>THEY ATE "ANYTHING AT ALL"</div>
        </div>
      )}
      <Chip t={t} t0={690.45} t1={694.9} text="OTHER ACCOUNTS" color="#6a6a7a" x={300} y={140} size={56} />
      {/* el almidón de las golas, hervido en la olla */}
      {t > 691.9 && t < 695.6 && (() => { const hunde = prog(t, 692.4, 694.6); const o = ent(t, 691.95) * (1 - prog(t, 695.2, 695.6)); return (
        <svg style={{ position: "absolute", left: 140, top: 480, overflow: "visible", opacity: o }} width={820} height={560}>
          {[0, 1, 2].map((i) => { const k = (t * 0.7 + i / 3) % 1; return <path key={i} d={`M ${300 + i * 110} ${150 - k * 160} q 30 -40 0 -80 q -30 -40 0 -80`} stroke="#fff" strokeWidth={12} fill="none" opacity={0.6 * (1 - k)} strokeLinecap="round" />; })}
          <g transform={`translate(410 ${170 + hunde * 120}) scale(${1 - hunde * 0.3})`}>
            {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * 120} cy={Math.sin(a) * 40} rx={40} ry={26} fill={hunde > 0.6 ? "#e8e2c8" : "#fff"} stroke="#c8c2b0" strokeWidth={4} transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 120} ${Math.sin(a) * 40})`} />; })}
          </g>
          <ellipse cx={410} cy={250} rx={330} ry={70} fill="#e8e0c0" />
          <path d="M 80 250 Q 80 520 410 530 Q 740 520 740 250 Z" fill="#2a2a30" stroke="#111" strokeWidth={10} />
          <ellipse cx={410} cy={250} rx={330} ry={70} fill="none" stroke="#111" strokeWidth={14} />
          {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={260 + i * 70} cy={250 + Math.sin(t * 5 + i) * 10} r={14 + (i % 2) * 6} fill="#f4ecd0" stroke="#c8c0a0" strokeWidth={3} />)}
          <text x={410} y={420} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={54} fill="#f4ecd0">COLLAR STARCH</text>
        </svg>
      ); })()}
      {t > 693.8 && t < 695.6 && <Grande t={t} t0={694.81} text="PASTE" x={560} y={420} size={150} color={C.crema} />}
      <Chip t={t} t0={695.67} t1={699.4} text="RUN TO THE POWHATAN" color={C.tierra} x={960} y={140} centro size={54} />
      <Chip t={t} t0={698.33} t1={699.4} text="HOPING FOR MERCY" color={C.violeta} x={960} y={930} centro size={52} />
      <Chip t={t} t0={699.55} t1={702.6} text="DIG FOR ROOTS" color="#6a4a2a" x={960} y={140} centro size={54} />
      <Chip t={t} t0={701.45} t1={702.6} text="NEVER COME BACK" color={C.rojo} x={960} y={930} centro size={52} />
      {t > 705.2 && t < 708.2 && <div style={{ position: "absolute", left: 0, top: 455, width: 1920, height: 170, background: "rgba(14,10,30,.82)", opacity: ent(t, 705.25) * (1 - prog(t, 707.9, 708.2)) }} />}
      {t > 704.4 && t < 708.2 && <Grande t={t} t0={705.31} text="TOO DESPERATE TO DESCRIBE" y={540} size={84} color="#d8c8e0" />}
      <Chip t={t} t0={708.27} t1={711.2} text="2012" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={64} />
      <Chip t={t} t0={709.77} t1={711.2} text="ARCHAEOLOGISTS" color={C.teal} tinta={C.noche} x={960} y={930} centro size={52} />
      {/* Jane */}
      {t > 712.4 && t < 719.6 && (
        <div style={{ position: "absolute", left: 1330, top: 170, transform: `scale(${ent(t, 712.5) * (1 - prog(t, 719.1, 719.6))}) rotate(2deg)`, width: 360, height: 460, background: "#efe2c4", border: "8px solid #2a1408", borderRadius: 18, overflow: "hidden", filter: "sepia(.6)" }}>
          <Persona x={180} y={500} h={400} t={t} seed={812} ropa={{ ...COLONO(2), tunica: "#7a5a7a", tunica2: "#4e3a4e" }} expr="neutro" />
          <div style={{ position: "absolute", left: 0, top: 10, width: 360, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 40, color: "#5a1a0a", background: "#efe2c4", padding: "4px 0" }}>ENGLISH GIRL · 14</div>
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
      {t > 731.4 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }} />}
      <Vineta t={t} t0={736.1} t1={741.15} x={960} y={620} w={1300} h={620} cielo="#7a8494" cielo2="#a8b0bc" suelo="#6a5a44" sueloY={470}>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1300} height={620}>{Array.from({ length: 26 }, (_, k) => <rect key={k} x={k * 52} y={250} width={46} height={230} fill="#5a4026" stroke="#2a1a0c" strokeWidth={3} />)}<rect x={560} y={420} width={170} height={70} fill="#3a2a1a" /></svg>
        <div style={{ position: "absolute", left: 645, top: 520 }}><Fogata t={t} x={0} y={0} /></div>
        {[[200, 1210, 1, 4], [400, 1211, 0, -6], [890, 1212, 2, 8], [1090, 1213, 3, -4]].map(([x, seed, c, inc], k) => <Persona key={seed} x={x} y={620} h={420} t={t} seed={seed} ropa={{ ...COLONO(c), tunica: "#7a7468", tunica2: "#4e4a42" }} flaco={0.95} expr={k === 2 ? "dormido" : "triste"} flip={k > 1} mira={k > 1 ? -0.5 : 0.5} inclina={inc + Math.sin(t * 1.4 + k) * 3} bI={k % 2 ? 40 : 20} bD={k % 2 ? 60 : 30} cD={80} />)}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1300} height={620}><path d="M 560 560 Q 645 600 730 560" stroke="#5a5a64" strokeWidth={10} fill="#8a8a94" /></svg>
      </Vineta>
      {t > 732.6 && t < 736.2 && <Tablero t={t} valor={Math.round(interpolate(t, [733.7, 735.8], [500, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))} titulo="ALIVE" rojo={t > 735.6} x={960} y={420} s={1.8} />}
      {t > 739.5 && <Grande t={t} t0={739.67} text="THE STARVING TIME" y={200} size={130} color={C.ambar} />}
    </AbsoluteFill>
  );
};
