import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Chip, Grande, fontFamily, Pergamino } from "./kit";
import { Trampas } from "./kit2";
import { Mundo, K, En, SUELO, AGUA } from "./mundo";
import { Base, FX } from "./base";
import { GENT, COLONO, POW, Nave, Bote, Bicho, Tortuga, Tabaco, Barril, Tinte, Cruz } from "./kitj";
import { Icono } from "./kitj2";

// EL GIRO (741,1-908,6 s). Deliverance y Patience llegan de Bermudas; 60 sobrevivientes; Gates abandona Jamestown;
// río abajo, el bote del gancho (el de la farola, en la curva) trae a De La Warr; vuelven. Rolfe y el tabaco;
// La Tempestad; 6.000 → 1.200; la lista de lo que salió mal; "un día y un bote chico"; CTA al grumete pirata.
export const CAM8: K[] = [
  [741.1, 24350, 610, 0.48], [742.6, 24350, 610, 0.52], [743.4, 20300, 680, 0.82], [747.3, 22000, 680, 0.9], [752.9, 22150, 680, 0.92],
  [753.6, 13700, 650, 0.62], [758.2, 13700, 650, 0.66], [758.9, 13700, 700, 0.85], [765.8, 13700, 700, 0.9], [766.5, 23200, 640, 0.6],
  [770.8, 23900, 650, 0.72], [776.2, 23900, 650, 0.72], [776.9, 22900, 650, 0.62], [781.3, 23300, 650, 0.62], [782.0, FX, 650, 0.75],
  [787.6, FX, 650, 0.75], [788.4, 21900, 640, 0.6], [794.3, 20900, 640, 0.6], [795.4, 20500, 680, 0.8], [802.6, 20550, 680, 0.85],
  [803.6, 18100, 660, 0.62], [812.4, 18250, 660, 0.64], [813.2, 20600, 680, 0.78], [818.6, 22300, 680, 0.78], [819.5, 23700, 690, 0.75],
  [826.2, 23800, 690, 0.8], [827.0, 13600, 760, 1.45], [832.8, 13600, 760, 1.6], [833.5, 25600, 680, 0.85], [838.2, 25700, 680, 0.88],
  [839.0, 3300, 640, 1.05], [844.9, 3380, 640, 1.1], [845.6, 12900, 660, 0.6], [852.9, 13700, 660, 0.64], [853.6, 3300, 640, 0.85],
  [859.9, 3350, 640, 0.95], [860.6, 24350, 700, 0.7], [872.6, 24400, 700, 0.75], [873.4, 3300, 620, 0.75], [879.8, 3300, 620, 0.78],
  [880.5, 24350, 680, 0.55], [888.2, 24350, 680, 0.58], [889.0, 20900, 680, 0.9], [891.6, 20950, 680, 0.95], [892.4, 23950, 690, 0.75],
  [908.6, 23750, 690, 0.78],
];
const CIELO8: [number, string][] = [
  [741, "primavera"], [753.5, "verano"], [766.3, "primavera"], [776.8, "verano"], [794.8, "amanecer"], [796.5, "verano"],
  [819.4, "hambre"], [826.9, "verano"], [838.9, "londres"], [845.5, "mar"], [853.5, "londres"], [860.5, "invierno"],
  [873.3, "londres"], [880.4, "tormenta"], [888.9, "amanecer"], [891.9, "verano"],
];

// las dos naves de Bermudas: llegan, cargan, bajan el río, se cruzan con el bote, vuelven
const NAVE: number[][] = [[743.3, 18600], [747.3, 22420], [787.7, 22420], [794.3, 20900], [812.8, 20750], [818.6, 22420]];
const naveX = (t: number) => (t < NAVE[0][0] ? 18600 : interpolate(t, NAVE.map((k) => k[0]), NAVE.map((k) => k[1]), { extrapolateRight: "clamp" }));
const rioAbajo = (t: number) => t > 787.6 && t < 813.2;

const Pajaro: React.FC<{ t: number; x: number; y: number; s?: number }> = ({ t, x, y, s = 1 }) => {
  const a = Math.sin(t * 10 + x) * 18;
  return <svg style={{ position: "absolute", left: x - 30 * s, top: y - 20 * s, overflow: "visible" }} width={60 * s} height={40 * s} viewBox="-30 -20 60 40"><path d={`M -28 ${-a / 2} Q -14 -6 0 4 Q 14 -6 28 ${-a / 2}`} stroke="#2a2a3a" strokeWidth={5} fill="none" strokeLinecap="round" /></svg>;
};

const TRAPS = ["THE AD", "THE VOYAGE", "THE ISLAND", "THE GOLD", "THE NEIGHBORS", "THE RESCUE", "THE STARVING TIME"];

export const P8: React.FC<{ t: number }> = ({ t }) => {
  if (t < 741.0) return null;
  const nX = naveX(t);
  const giro = rioAbajo(t) ? -1 : 1;
  const nave = (x: number, i: number, nombre?: string) => (
    <En key={i} x={x} w={500}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `scaleX(${giro})`, transformOrigin: `${x}px ${AGUA}px` }}>
        <Nave x={x} y={AGUA - 70 + i * 4} t={t + i} tam={0.55 - i * 0.05} vela={t > 743.3 && t < 820 ? 1 : 0.3} casco={i ? "#6a3416" : undefined} nombre={nombre} />
      </div>
    </En>
  );
  // el bote del gancho: sale de detrás del cabo con la farola
  const boteX = interpolate(t, [798.8, 802.4], [20150, 20470], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Mundo t={t} cam={CAM8} cielo={CIELO8}>
        {/* los barcos de De La Warr, en la boca del río */}
        {t > 803.4 && t < 813 && [17500, 18000, 18500].map((x, i) => <En key={x} x={x} w={500}><Nave x={x} y={AGUA - 110} t={t + i} tam={0.8} vela={0.6} nombre={i === 1 && t > 804.2 ? "DE LA WARR" : undefined} /></En>)}
        {t > 808.5 && t < 813 && [17300, 17420, 17540, 18750, 18870].map((x, i) => <En key={x} x={x} w={100}><Barril x={x} y={AGUA - 150 - (i % 2) * 40} s={0.22} t={t} t0={809.2 + i * 0.25} /></En>)}
        {/* el bote mensajero (el mismo que asomaba en el gancho) */}
        {t > 798.5 && t < 799.6 && (
          <En x={boteX} w={400}>
            <Bote x={boteX} y={AGUA - 20} t={t} s={1.3} />
            <svg style={{ position: "absolute", left: boteX - 60, top: AGUA - 200, overflow: "visible" }} width={120} height={120}><circle cx={60} cy={60} r={30 + Math.sin(t * 9) * 6} fill="#ffe680" opacity={0.85} /><circle cx={60} cy={60} r={70} fill="#ffe680" opacity={0.25} /></svg>
          </En>
        )}
        <Base t={t} />
        {t > 799.5 && t < 803.6 && (
          <En x={boteX} w={400}>
            <Bote x={boteX} y={AGUA - 20} t={t} s={1.3} />
            <svg style={{ position: "absolute", left: boteX - 60, top: AGUA - 200, overflow: "visible" }} width={120} height={120}><circle cx={60} cy={60} r={30 + Math.sin(t * 9) * 6} fill="#ffe680" opacity={0.85} /><circle cx={60} cy={60} r={70} fill="#ffe680" opacity={0.25} /></svg>
          </En>
        )}
        {/* Deliverance y Patience */}
        {t < 826.5 && [nX, nX - 420 * giro].map((x, i) => nave(x, i, undefined))}
        {/* Bermudas: 10 meses de cerdos, tortugas, pájaros y cedro */}
        {t > 753.3 && t < 766.3 && (
          <>
            {[13350, 13560].map((x, i) => <En key={x} x={x} w={200}><Bicho k="cerdo" x={x + Math.sin(t * 1.5 + i) * 30} y={SUELO - 40} s={0.45} t={t} t0={755.9 + i * 0.2} /></En>)}
            {[13800, 14000].map((x, i) => <En key={x} x={x} w={200}><Tortuga x={x} y={SUELO - 26} s={0.4} t={t} t0={756.9 + i * 0.2} /></En>)}
            {[0, 1, 2, 3].map((i) => <Pajaro key={i} t={t} x={13400 + i * 180 + ((t * 40) % 200)} y={SUELO - 420 - (i % 2) * 60} s={1.2} />)}
            {/* el astillero de cedro */}
            {t > 758.2 && [13450, 13950].map((x, i) => {
              const arma = prog(t, 758.6 + i * 0.5, 761.4 + i * 0.5);
              return (
                <En key={x} x={x} w={600}>
                  <svg style={{ position: "absolute", left: x - 260, top: SUELO - 260, overflow: "visible" }} width={520} height={260}>
                    {Array.from({ length: 9 }, (_, k) => <path key={k} d={`M ${40 + k * 55} 240 Q ${40 + k * 55} 120 ${40 + k * 55 + (k - 4) * 6} 70`} stroke="#b0642a" strokeWidth={14} fill="none" strokeLinecap="round" opacity={arma > k / 9 ? 1 : 0} />)}
                    <path d="M 20 240 L 500 240" stroke="#8a4a1a" strokeWidth={18} strokeLinecap="round" />
                    <path d={`M 30 ${240 - 150 * arma} L 490 ${240 - 150 * arma}`} stroke="#c87a3a" strokeWidth={12} opacity={arma > 0.6 ? 1 : 0} />
                  </svg>
                  <Persona x={x + 300} y={SUELO} h={190} t={t} seed={830 + i} ropa={COLONO(i)} bD={60 + Math.abs(Math.sin(t * 6 + i)) * 100} manoD={<Icono k="martillo" x={0} y={0} s={0.3} />} expr="feliz" flip />
                </En>
              );
            })}
          </>
        )}
        {/* 60 esqueletos andantes en el fuerte en ruinas */}
        {t > 766.3 && t < 781.5 && Array.from({ length: 8 }, (_, i) => { const x = FX - 520 + i * 120; return <En key={i} x={x} w={150}><Persona x={x} y={SUELO + (i % 2) * 6} h={230} t={t} seed={850 + i} ropa={{ ...COLONO(i), tunica: "#7a7468", tunica2: "#5a5650" }} flaco={1} inclina={10 + (i % 3) * 6} camina={i % 3 === 0 ? 0.5 : 0} expr={i % 2 ? "miedo" : "dormido"} aparece={767.6 + i * 0.08} manoD={i % 2 ? <rect x={-5} y={-10} width={10} height={170} fill="#6a4a2a" /> : undefined} /></En>; })}
        {/* los recién llegados: Gates con los suyos en la playa */}
        {t > 766.3 && t < 777 && [23250, 23400, 23550].map((x, i) => <En key={x} x={x} w={200}><Persona x={x} y={SUELO} h={250} t={t} seed={860 + i} ropa={i === 1 ? GENT(1) : COLONO(i + 4)} gola={i === 1} gorro={i === 1 ? "morion" : undefined} expr={t < 767.6 ? "feliz" : t > 770.9 && i === 1 ? "triste" : "sorpresa"} camina={t < 767 ? 1.2 : 0} /></En>)}
        {/* todos a bordo */}
        {t > 778.6 && t < 781.5 && Array.from({ length: 6 }, (_, i) => { const x = interpolate(t, [778.8 + i * 0.15, 780.6 + i * 0.15], [FX - 600 + i * 70, 22700], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return x < 22720 ? null : <En key={i} x={x} w={150}><Persona x={x} y={SUELO} h={220} t={t} seed={870 + i} ropa={COLONO(i)} flaco={0.5} camina={1.2} flip expr="triste" /></En>; })}
        {/* querían quemar el fuerte: Gates dice que no */}
        {t > 781.4 && t < 787.7 && (
          <>
            {[FX + 260, FX + 400].map((x, i) => (
              <En key={x} x={x} w={200}>
                <Persona x={x} y={SUELO} h={240} t={t} seed={880 + i} ropa={COLONO(i + 1)} flaco={0.5} flip expr="enojado" bD={150} cD={20}
                  manoD={<g><rect x={-6} y={-70} width={12} height={80} fill="#6a3a1a" /><path d={`M 0 -110 Q ${-20 + Math.sin(t * 12 + i) * 6} -80 0 -70 Q 20 -80 0 -110 Z`} fill="#ff8a2a" /></g>} />
              </En>
            ))}
            <En x={FX - 60} w={200}><Persona x={FX - 60} y={SUELO} h={260} t={t} seed={861} ropa={GENT(1)} gola gorro="morion" expr="enojado" bI={160} cI={10} /></En>
            {t > 785.9 && <En x={FX - 210} w={200}><Persona x={FX - 210} y={SUELO} h={250} t={t} seed={889} ropa={COLONO(5)} gorro="morion" expr="neutro" aparece={785.95} manoD={<rect x={-5} y={-160} width={10} height={220} fill="#6a6a74" />} /></En>}
          </>
        )}
        {/* Rolfe en el Sea Venture naufragado */}
        {t > 826.8 && t < 833.4 && <En x={13600} w={300}><Persona x={13600} y={SUELO} h={300} t={t} seed={900} ropa={GENT(3)} gorro="sombrero" expr={t > 831.7 ? "orgullo" : "neutro"} aparece={828.9} /></En>}
        {/* el tabaco dulce en Virginia */}
        {t > 833.3 && t < 838.9 && (
          <>
            {Array.from({ length: 7 }, (_, i) => <En key={i} x={25300 + i * 110} w={150}><Tabaco x={25300 + i * 110} y={SUELO - 60} s={0.55} crece={prog(t, 834.3 + i * 0.12, 836.0 + i * 0.12)} /></En>)}
            <En x={25120} w={300}><Persona x={25120} y={SUELO} h={260} t={t} seed={900} ropa={GENT(3)} gorro="sombrero" expr="orgullo" bD={60} /></En>
          </>
        )}
        {/* Londres fuma y aplaude */}
        {t > 838.8 && t < 845.4 && [3100, 3300, 3500].map((x, i) => (
          <En key={x} x={x} w={200}>
            <Persona x={x} y={SUELO} h={330} t={t} seed={910 + i} ropa={GENT(i)} gola gorro="copa" expr={t > 839.4 ? "orgullo" : "sorpresa"} flip={i === 2}
              manoD={<g><path d="M 0 0 L 40 -6" stroke="#5a3a1a" strokeWidth={8} strokeLinecap="round" /><circle cx={44} cy={-10} r={10} fill="#5a3a1a" /></g>} />
            {[0, 1].map((k) => { const u = (t * 0.6 + k / 2 + i / 3) % 1; return <div key={k} style={{ position: "absolute", left: x + 70 + u * 30, top: SUELO - 260 - u * 120, width: 20 + u * 30, height: 20 + u * 30, borderRadius: "50%", background: "#d8d0c8", opacity: 0.5 * (1 - u) }} />; })}
          </En>
        ))}
        {/* el teatro: La Tempestad */}
        {t > 853.4 && t < 860.4 && (
          <En x={3300} w={900}>
            <svg style={{ position: "absolute", left: 2900, top: SUELO - 420, overflow: "visible" }} width={800} height={420}>
              <rect x={0} y={0} width={800} height={420} fill="#5a2a1a" />
              <rect x={40} y={40} width={720} height={340} fill="#1a1230" />
              <path d={`M 40 40 L ${400 - 360 * prog(t, 858.2, 859.0)} 40 L ${400 - 360 * prog(t, 858.2, 859.0)} 380 L 40 380 Z`} fill="#b0263a" />
              <path d={`M 760 40 L ${400 + 360 * prog(t, 858.2, 859.0)} 40 L ${400 + 360 * prog(t, 858.2, 859.0)} 380 L 760 380 Z`} fill="#b0263a" />
              {t > 858.6 && <><path d="M 260 300 L 540 300 Q 520 340 280 340 Z" fill="#7a3e1a" /><path d="M 400 300 L 400 160 L 480 290 Z" fill="#f4ecd8" /><path d="M 120 380 Q 200 330 280 380 Q 360 330 440 380 Q 520 330 600 380 Q 680 330 760 380" stroke="#4a8ad0" strokeWidth={14} fill="none" /></>}
              <rect x={-20} y={-30} width={840} height={50} rx={10} fill="#e0b44a" />
              <text x={400} y={6} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={34} fill="#3a1a0a">THE GLOBE</text>
            </svg>
            <Persona x={2780} y={SUELO} h={320} t={t} seed={920} ropa={GENT(0)} gola barba="#8a5a2a" expr="feliz" bD={110} cD={60} manoD={<path d="M 0 0 L 36 -40" stroke="#fff" strokeWidth={6} />} aparece={855.4} />
          </En>
        )}
        {/* "un día antes": los que se iban, fantasmas de una Jamestown que no fue */}
        {t > 819.4 && t < 826.4 && Array.from({ length: 6 }, (_, i) => { const x = 23250 + i * 190; return <En key={i} x={x} w={200}><div style={{ position: "absolute", left: 0, top: 0, opacity: 0.55 * (1 - prog(t, 821.8 + i * 0.25, 822.6 + i * 0.25)) }}><Persona x={x} y={SUELO} h={250} t={t} seed={940 + i} ropa={COLONO(i)} flaco={0.5} flip expr="triste" camina={1.1} /></div></En>; })}
        {/* el público del Globe */}
        {t > 853.4 && t < 860.4 && Array.from({ length: 7 }, (_, i) => { const x = 2980 + i * 110; return <En key={i} x={x} w={150}><Persona x={x} y={SUELO + 40} h={200} t={t} seed={950 + i} ropa={i % 2 ? GENT(i) : COLONO(i)} gorro={i % 3 === 0 ? "copa" : undefined} expr={t > 858.6 ? "sorpresa" : "neutro"} mira={(3 - i) * 0.15} miraY={-0.6} aparece={853.6 + i * 0.08} /></En>; })}
        {/* 1607-1624: las cruces se suman detrás del conteo */}
        {t > 860.5 && t < 880.5 && Array.from({ length: 14 }, (_, i) => { const x = FX - 1250 + i * 190 + (i > 6 ? 1000 : 0); return <En key={i} x={x} w={150}><Cruz x={x} y={SUELO - 80} s={0.6} t={t} t0={866.0 + i * 0.35} /></En>; })}
        {/* los que sobrevivieron, despidiendo */}
        {t > 892.2 && Array.from({ length: 5 }, (_, i) => { const x = FX - 450 + i * 220; return <En key={i} x={x} w={200}><Persona x={x} y={SUELO} h={260} t={t} seed={960 + i} ropa={i % 2 ? GENT(i) : COLONO(i)} flaco={0.3} expr={i % 2 ? "orgullo" : "neutro"} flip={i > 2} bD={i % 2 ? 150 + Math.sin(t * 7 + i) * 25 : undefined} aparece={892.4 + i * 0.1} /></En>; })}
        {/* el bote del final */}
        {t > 888.8 && t < 892.2 && <En x={20700} w={400}><Bote x={20700} y={AGUA - 20} t={t} s={1.3} /><svg style={{ position: "absolute", left: 20640, top: AGUA - 200, overflow: "visible" }} width={120} height={120}><circle cx={60} cy={60} r={30 + Math.sin(t * 9) * 6} fill="#ffe680" opacity={0.85} /><circle cx={60} cy={60} r={70} fill="#ffe680" opacity={0.25} /></svg></En>}
        {/* CTA: el barco pirata que viene */}
        {t > 896.6 && (() => { const x = interpolate(t, [896.8, 901.8], [22300, 23200], { extrapolateRight: "clamp" }); return <En x={x} w={600}><div style={{ position: "absolute", left: 0, top: 0, filter: "saturate(.6) brightness(.8)" }}><Nave x={x} y={AGUA - 120} t={t} tam={0.9} vela={1} bandera={false} casco="#2a1a14" nombre={t > 898.5 && t < 902.5 ? "NEXT: THE CABIN BOY" : undefined} /></div><svg style={{ position: "absolute", left: x - 30, top: AGUA - 560, overflow: "visible" }} width={10} height={10}><rect x={0} y={0} width={110} height={70} fill="#111" /><circle cx={55} cy={30} r={14} fill="#fff" /><rect x={47} y={40} width={16} height={10} fill="#fff" /></svg></En>; })()}
      </Mundo>

      {/* pantalla */}
      {t > 819.4 && t < 826.4 && <Tinte color="#3a1020" op={0.35} />}
      {t > 741.2 && t < 743.2 && <Grande t={t} t0={741.3} text="THE TWIST" y={420} size={170} color={C.ambar} />}
      <Chip t={t} t0={743.25} t1={747.3} text="MAY 1610" color={C.lima} tinta={C.noche} x={960} y={140} centro size={60} />
      <Chip t={t} t0={744.79} t1={747.3} text="TWO SMALL SHIPS" color={C.teal} tinta={C.noche} x={960} y={930} centro size={54} />
      {t > 748.0 && t < 752.0 && (
        <div style={{ position: "absolute", left: 960, top: 560, width: 1100, height: 640, transform: `translate(-50%,-50%) scale(${ent(t, 748.05) * (1 - prog(t, 751.6, 752.0))}) rotate(1.5deg)`, background: "#cfe0ea", border: "10px solid #2a1408", borderRadius: 28, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 470, width: 1100, height: 170, background: "#8a5a2e" }} />
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1100} height={640}><rect x={530} y={0} width={24} height={480} fill="#5a3a1a" /><path d="M 560 40 Q 760 160 560 330 Z" fill="#f4ecd8" stroke="#8a7a6a" strokeWidth={5} /></svg>
          {[280, 790].map((x, i) => t > 748.1 + i * 1.3 && (
            <div key={x} style={{ position: "absolute", left: 0, top: 0 }}>
              <Persona x={x} y={780} h={600} t={t} seed={660 + i} ropa={GENT(i + 2)} gola gorro={i ? "sombrero" : "morion"} barba={i ? "#d8d0c8" : "#5a3a2a"} expr="feliz" flip={i === 1} mira={i ? -0.3 : 0.3} bD={i ? undefined : 150 + Math.sin(t * 7) * 20} aparece={748.1 + i * 1.3} />
              <div style={{ position: "absolute", left: x - 250, top: 560, width: 500, whiteSpace: "nowrap", textAlign: "center", fontFamily, fontWeight: 700, fontSize: 44, color: "#fff", background: i ? C.teal : C.violeta, border: "5px solid #1b1240", borderRadius: 14, transform: `scale(${ent(t, 748.2 + i * 1.3)})` }}>{i ? "ADM. GEORGE SOMERS" : "SIR THOMAS GATES"}</div>
            </div>
          ))}
        </div>
      )}
      <Chip t={t} t0={750.29} t1={751.9} text="+ THE SEA VENTURE SURVIVORS" color={C.oro} tinta={C.noche} x={960} y={140} centro size={54} />
      {t > 752.0 && t < 753.6 && <Grande t={t} t0={752.41} text="THEY DID NOT DROWN" y={240} size={110} color={C.lima} />}
      <Chip t={t} t0={753.97} t1={758.2} text="10 MONTHS IN BERMUDA" color={C.teal} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={756.15} t1={758.2} text="PIGS" color="#e88a9a" tinta={C.noche} x={300} y={260} size={44} />
      <Chip t={t} t0={757.01} t1={758.2} text="TURTLES" color={C.lima} tinta={C.noche} x={300} y={335} size={44} />
      <Chip t={t} t0={757.43} t1={758.2} text="BIRDS" color="#6a6a7a" x={300} y={410} size={44} />
      <Chip t={t} t0={758.61} t1={761.6} text="TWO NEW SHIPS" color={C.naranja} x={960} y={140} centro size={56} />
      <Chip t={t} t0={760.11} t1={761.6} text="ISLAND CEDAR" color="#b0642a" x={960} y={930} centro size={54} />
      <Chip t={t} t0={762.49} t1={765.9} text="NOT MAKING THIS UP" color={C.rojo} x={960} y={930} centro size={52} />
      {t > 764.0 && t < 766.3 && <Grande t={t} t0={764.17} text="DELIVERANCE" y={200} size={130} color={C.ambar} />}
      {t > 765.0 && t < 766.3 && <Grande t={t} t0={765.11} text="& PATIENCE" y={350} size={110} color={C.crema} />}
      <Chip t={t} t0={766.53} t1={767.9} text="FULL OF HOPE" color={C.lima} tinta={C.noche} x={960} y={140} centro size={56} />
      {t > 767.9 && t < 770.95 && <Grande t={t} t0={768.0} text="60 WALKING SKELETONS" y={200} size={84} color={C.rojo} />}
      <Chip t={t} t0={769.71} t1={770.9} text="A RUINED FORT" color="#6a5a4a" x={960} y={930} centro size={64} />
      <Chip t={t} t0={770.97} t1={774.7} text="GATES DECIDES" color={C.violeta} x={960} y={140} centro size={56} />
      {t > 774.6 && t < 776.5 && <Grande t={t} t0={774.77} text="JAMESTOWN IS FINISHED" y={220} size={104} color={C.rojo} />}
      <Chip t={t} t0={776.47} t1={781.4} text="7 JUNE 1610" color={C.naranja} x={960} y={140} centro size={60} />
      <Chip t={t} t0={778.93} t1={781.4} text="EVERYONE ON BOARD" color={C.teal} tinta={C.noche} x={960} y={930} centro size={54} />
      <Chip t={t} t0={781.57} t1={784.4} text="BURN THE FORT!" color={C.naranja} x={960} y={140} centro size={56} />
      {t > 784.4 && t < 785.9 && <Grande t={t} t0={784.83} text="NO." y={240} size={170} color={C.crema} />}
      <Chip t={t} t0={785.95} t1={787.7} text="A GUARD AT THE GATES" color={C.violeta} x={960} y={930} centro size={52} />
      <Chip t={t} t0={787.81} t1={791.6} text="DOWN THE RIVER" color="#2a7ac8" x={960} y={140} centro size={56} />
      <Chip t={t} t0={789.77} t1={791.6} text="TOWARD HOME" color={C.lima} tinta={C.noche} x={960} y={930} centro size={54} />
      {t > 791.7 && t < 794.7 && <Grande t={t} t0={792.0} text="THE ADVENTURE IS OVER" y={230} size={100} color={C.crema} />}
      <Chip t={t} t0={795.47} t1={798.9} text="THE VERY NEXT DAY" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={799.45} t1={801.3} text="A SMALL BOAT" color={C.oro} tinta={C.noche} x={960} y={140} centro size={60} />
      <Chip t={t} t0={801.69} t1={803.6} text="A MESSENGER" color={C.violeta} x={960} y={930} centro size={54} />
      {/* De La Warr */}
      {t > 803.6 && t < 812.8 && (
        <div style={{ position: "absolute", left: 70, top: 110, transformOrigin: "0 0", transform: `scale(${1.15 * ent(t, 803.75) * (1 - prog(t, 812.3, 812.8))}) rotate(-2deg)`, width: 340, height: 420, background: "#fff3d6", border: "8px solid #2a1408", borderRadius: 18, overflow: "hidden" }}>
          <Persona x={170} y={350} h={270} t={t} seed={930} ropa={GENT(0)} gola capa="#2a1a50" barba="#3a2416" gorro="sombrero" expr="orgullo" />
          <div style={{ position: "absolute", left: 0, top: 8, width: 340, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 34, color: C.violeta }}>LORD DE LA WARR</div>
          {t > 805.0 && <div style={{ position: "absolute", left: 0, bottom: 10, width: 340, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 34, color: C.rojo }}>NEW GOVERNOR</div>}
        </div>
      )}
      <Chip t={t} t0={807.87} t1={812.8} text="3 SHIPS" color={C.teal} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={809.15} t1={812.8} text="~150 MEN" color={C.violeta} x={1440} y={140} centro size={52} />
      <Chip t={t} t0={811.17} t1={812.8} text="A YEAR OF SUPPLIES" color={C.naranja} x={960} y={930} centro size={54} />
      {t > 812.9 && t < 815.2 && <Grande t={t} t0={813.11} text="TURN AROUND!" y={230} size={130} color={C.lima} />}
      <Chip t={t} t0={815.35} t1={819.4} text="BACK TO THE FORT" color={C.tierra} x={960} y={140} centro size={56} />
      <Chip t={t} t0={819.67} t1={823.3} text="ONE DAY EARLIER..." color={C.rojo} x={960} y={140} centro size={56} />
      <Chip t={t} t0={821.71} t1={823.3} text="OR THAT BOAT MISSES THEM" color={C.violeta} x={960} y={930} centro size={52} />
      {t > 823.3 && t < 826.2 && <Grande t={t} t0={823.97} text="NO JAMESTOWN AT ALL" y={240} size={110} color={C.crema} />}
      {t > 826.2 && t < 828.4 && <Grande t={t} t0={826.4} text="ONE MORE TWIST" y={420} size={130} color={C.ambar} />}
      <Chip t={t} t0={828.83} t1={831.6} text="ON THE SEA VENTURE..." color={C.teal} tinta={C.noche} x={960} y={140} centro size={54} />
      <Chip t={t} t0={829.0} t1={833.3} text="JOHN ROLFE" color={C.oro} tinta={C.noche} x={960} y={930} centro size={64} />
      <Chip t={t} t0={835.47} t1={838.3} text="SWEET TOBACCO" color={C.lima} tinta={C.noche} x={960} y={140} centro size={56} />
      <Chip t={t} t0={836.41} t1={838.3} text="SEEDS FROM THE CARIBBEAN" color={C.teal} tinta={C.noche} x={960} y={930} centro size={50} />
      {t > 839.2 && t < 840.8 && <Grande t={t} t0={839.43} text="A SENSATION" y={220} size={120} color={C.ambar} />}
      {t > 840.4 && t < 845.4 && Array.from({ length: 9 }, (_, i) => { const k = prog(t, 840.5 + i * 0.18, 842.6 + i * 0.18); const m = prog(t, 841.6 + i * 0.18, 842.1 + i * 0.18); const x = 220 + i * 185; const y = 360 + k * 520 + Math.sin(t * 3 + i) * 10; return (
        <svg key={i} style={{ position: "absolute", left: x - 60, top: y - 60, overflow: "visible", opacity: 1 - prog(t, 845.0, 845.4) }} width={120} height={120}>
          <g transform={`translate(60 60) rotate(${(1 - m) * Math.sin(t * 4 + i) * 30}) scale(${1 - m}, 1)`}><path d="M 0 -56 Q 40 -20 0 56 Q -40 -20 0 -56 Z" fill="#7a9a3a" stroke="#3a5a1a" strokeWidth={5} /><line x1={0} y1={-50} x2={0} y2={50} stroke="#3a5a1a" strokeWidth={4} /></g>
          {m > 0 && <g transform={`translate(60 60) scale(${m}, 1)`}><circle r={44} fill="#ffd34a" stroke="#b07a10" strokeWidth={7} /><text y={16} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill="#b07a10">£</text></g>}
        </svg>
      ); })}
      {t > 841.0 && t < 845.4 && <Grande t={t} t0={841.89} text="VIRGINIA'S GOLD" y={220} size={120} color={C.oro} />}
      <Chip t={t} t0={843.0} t1={845.4} text="IT GROWS IN THE GROUND" color={C.lima} tinta={C.noche} x={960} y={930} centro size={52} />
      <Chip t={t} t0={847.41} t1={853.1} text="THE HURRICANE" color="#5a5a80" x={300} y={160} size={46} />
      <Chip t={t} t0={848.45} t1={853.1} text="THE SHIPWRECK" color={C.tierra} x={300} y={240} size={46} />
      <Chip t={t} t0={849.27} t1={853.1} text="THE MAGIC ISLAND" color={C.teal} tinta={C.noche} x={300} y={320} size={46} />
      <Chip t={t} t0={851.71} t1={853.1} text="→ LONDON" color={C.violeta} x={960} y={930} centro size={54} />
      {t > 845.2 && t < 853.3 && (() => { const k = prog(t, 845.4, 852.9); const x = 1700 - k * 1500; const y = 520 - Math.sin(k * Math.PI) * 220 + Math.sin(t * 4) * 12; return (
        <div style={{ position: "absolute", left: x - 130, top: y - 90, transform: `rotate(${Math.sin(t * 3) * 8}deg) scale(${ent(t, 845.3) * (1 - prog(t, 852.9, 853.3))})` }}>
          <svg width={260} height={180} style={{ overflow: "visible" }}><rect x={10} y={10} width={240} height={160} rx={10} fill="#f4ecd8" stroke="#6a4a2a" strokeWidth={8} /><path d="M 10 10 L 130 100 L 250 10" stroke="#6a4a2a" strokeWidth={7} fill="none" /><circle cx={130} cy={100} r={22} fill={C.rojo} stroke="#7a1010" strokeWidth={5} />{[0, 1, 2].map((j) => <path key={j} d={`M ${270 + j * 26} ${60 + j * 26} l 40 0`} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.7} />)}</svg>
          <div style={{ position: "absolute", left: -40, top: 190, width: 340, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 44, color: "#fff", WebkitTextStroke: "8px #1b1240", paintOrder: "stroke fill", whiteSpace: "nowrap" }}>TO LONDON</div>
        </div>); })()}
      <Chip t={t} t0={855.37} t1={858.3} text="WILLIAM SHAKESPEARE" color={C.oro} tinta={C.noche} x={960} y={140} centro size={56} />
      {t > 858.9 && t < 860.5 && <Grande t={t} t0={859.15} text="THE TEMPEST" y={200} size={140} color={C.ambar} />}
      <Chip t={t} t0={860.25} t1={862.4} text="NOT A HAPPY ENDING" color={C.rojo} x={960} y={140} centro size={56} />
      {/* 6.000 → 1.200: cada punto, 100 personas */}
      {t > 862.4 && t < 873.0 && (
        <div style={{ position: "absolute", left: 440, top: 200, width: 1040, padding: "20px 0 26px", background: "rgba(27,18,64,.82)", borderRadius: 30, transform: `scale(${ent(t, 862.5) * (1 - prog(t, 872.6, 873.0))})`, transformOrigin: "50% 50%" }}>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 84, color: C.ambar, textAlign: "center", marginBottom: 16, WebkitTextStroke: "12px #1b1240", paintOrder: "stroke fill" }}>1607 - 1624</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            {Array.from({ length: 60 }, (_, i) => {
              const vis = t > 865.5 + i * 0.012;
              const muere = i >= 12 && t > 870.3 + ((i * 37) % 48) * 0.006;
              return <div key={i} style={{ width: 50, height: 50, borderRadius: 25, background: muere ? "#5a5470" : C.lima, border: "5px solid #1b1240", opacity: vis ? (muere ? 0.45 : 1) : 0, transform: `scale(${vis ? 1 : 0})` }} />;
            })}
          </div>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 64, color: t > 871.5 ? C.rojo : C.lima, textAlign: "center", marginTop: 20, WebkitTextStroke: "10px #1b1240", paintOrder: "stroke fill" }}>{t < 870.8 ? (t > 865.7 ? "6,000 SAILED" : "") : "1,200 ALIVE"}</div>
        </div>
      )}
      <Chip t={t} t0={868.57} t1={872.8} text="THE KING TAKES CONTROL" color={C.oro} tinta={C.noche} x={960} y={120} centro size={70} />
      <Chip t={t} t0={872.81} t1={875.2} text="NOT ONE BAD WINTER" color={C.violeta} x={960} y={140} centro size={56} />
      {t > 875.0 && t < 880.2 && (
        <>
          <Pergamino x={960} y={540} w={460} abre={prog(t, 875.4, 876.2) * 0.6} lineas={6} titulo="BUSINESS PLAN" />
          <svg style={{ position: "absolute", left: 760, top: 340, overflow: "visible" }} width={400} height={400}>
            <path d="M 40 40 L 360 360 M 360 40 L 40 360" stroke={C.rojo} strokeWidth={28} strokeLinecap="round" strokeDasharray={460} strokeDashoffset={460 * (1 - prog(t, 877.6, 878.6))} />
          </svg>
          <Chip t={t} t0={876.61} t1={880.2} text="WRITTEN IN LONDON" color={C.rojo} x={960} y={930} centro size={52} />
        </>
      )}
      {/* lo que salió mal */}
      {t > 880.0 && t < 888.8 && (
        <div style={{ position: "absolute", left: 300, top: 150, width: 1320, padding: "30px 40px 10px", background: "rgba(27,18,64,.82)", borderRadius: 30, boxSizing: "border-box" }}>
          {([["THE WRONG PEOPLE", 880.63, C.violeta], ["THE WRONG PLACE", 881.85, C.lima], ["THE WRONG TREASURE", 883.37, C.oro], ["THE WORST DROUGHT IN 7 CENTURIES", 884.71, C.naranja], ["SOMEONE ELSE'S LAND", 886.9, C.teal]] as [string, number, string][]).map(([s, t0, col], i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 22, opacity: t > t0 ? 1 : 0, transform: `translateX(${(1 - prog(t, t0, t0 + 0.3)) * -200}px)` }}>
              <div style={{ width: 84, height: 84, borderRadius: 42, background: col, border: "6px solid #fff", fontFamily, fontWeight: 700, fontSize: 48, color: C.noche, textAlign: "center", lineHeight: "72px" }}>{i + 1}</div>
              <div style={{ fontFamily, fontWeight: 700, fontSize: 58, whiteSpace: "nowrap", color: "#fff", WebkitTextStroke: "10px #1b1240", paintOrder: "stroke fill" }}>{s}</div>
            </div>
          ))}
        </div>
      )}
      <Chip t={t} t0={888.81} t1={891.8} text="AND IT SURVIVED ANYWAY" color={C.lima} tinta={C.noche} x={960} y={140} centro size={56} />
      {t > 889.8 && t < 892.0 && <Grande t={t} t0={890.03} text="ONE DAY. ONE SMALL BOAT." y={930} size={84} color={C.ambar} />}
      {/* CTA */}
      {t > 895.3 && t < 897.6 && (
        <div style={{ position: "absolute", left: 960, top: 820, transform: `translate(-50%,-50%) scale(${ent(t, 895.5) * (t > 896.0 ? 1 + 0.06 * Math.sin((t - 896) * 14) : 1)})`, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ background: t > 895.9 ? "#6a6a74" : "#e02020", borderRadius: 18, padding: "18px 56px", fontFamily, fontWeight: 700, fontSize: 80, color: "#fff" }}>{t > 895.9 ? "SUBSCRIBED" : "SUBSCRIBE"}</div>
          <svg width={120} height={120} viewBox="-50 -50 100 100" style={{ transform: `rotate(${t > 896.1 ? Math.sin(t * 30) * 18 : 0}deg)` }}><path d="M -30 20 L -30 -6 Q -30 -36 0 -38 Q 30 -36 30 -6 L 30 20 L 38 28 L -38 28 Z" fill="#fff" stroke="#1b1240" strokeWidth={6} /><circle cx={0} cy={36} r={9} fill="#fff" stroke="#1b1240" strokeWidth={5} /></svg>
        </div>
      )}
      <Chip t={t} t0={897.27} t1={902.3} text="NEXT TIME: A PIRATE SHIP" color="#2a1a14" x={960} y={140} centro size={56} />
      <Chip t={t} t0={901.49} t1={902.3} text="THE CABIN BOY" color={C.ambar} tinta={C.noche} x={960} y={930} centro size={56} />
      {/* las 7 trampas: ¿cuál te agarraba primero? */}
      {t > 902.3 && (
        <div style={{ position: "absolute", left: 960, top: 530, transform: `translate(-50%,-50%) scale(${ent(t, 902.4)})`, width: 1560, background: "rgba(27,18,64,.88)", border: "8px solid #fff", borderRadius: 30, padding: "20px 36px" }}>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 60, color: C.ambar, textAlign: "center", marginBottom: 14 }}>WHICH TRAP GETS YOU FIRST?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 40px" }}>
            {TRAPS.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, opacity: ent(t, 903.0 + i * 0.12), transform: `scale(${t > 904.5 && Math.floor((t - 904.5) * 3) % 7 === i ? 1.12 : 1})` }}>
                <div style={{ width: 66, height: 66, borderRadius: 33, flexShrink: 0, background: C.rojo, border: "5px solid #fff", fontFamily, fontWeight: 700, fontSize: 40, color: "#fff", textAlign: "center", lineHeight: "56px" }}>{i + 1}</div>
                <div style={{ fontFamily, fontWeight: 700, fontSize: 46, color: "#fff", whiteSpace: "nowrap" }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 46, color: C.lima, textAlign: "center", marginTop: 14 }}>TELL ME IN THE COMMENTS</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
