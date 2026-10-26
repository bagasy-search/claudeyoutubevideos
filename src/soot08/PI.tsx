import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, Particulas, Pergamino, fontFamily } from "./kit";
import { Campana } from "./kit2";
import { AtlanticoMapa, PlantaAlgodon, Carta, Estatua, Velero, Mar } from "./kit3";
import { Espacio, camara, K, CieloHora, Horizonte, Pueblo, Sala, RutaAlgodon, Arbolito, NINO, NINA, OBRERO, DUENO, GenteFab, Gente, FCX } from "./mundo";
import { Gran, Cuenta, Sello, Tilde, Carretes, Flash, sacudon, Velo, Latigo, Lista, Globo } from "./capas";
import { Retrato, Primer } from "./piezas";
import { Persona } from "./persona";

// PARTE I · EL GIRO (718,8-900,6 s). Los chicos hablan ante el comité → la carta de Oastler, «Yorkshire Slavery» →
// la ley de 1833 y sus 4 inspectores → ¿cómo probás que un chico tiene 9? (el cirujano mide y mira los dientes) → la ley
// de las 10 horas, la fiesta en la calle → el algodón viene del Sur esclavista → el bloqueo, las fábricas mudas, la
// hambruna → el Free Trade Hall vota por el Norte con hambre → la carta de Lincoln → donde estaba la fábrica hoy hay una
// estatua y la gente pasa de largo camino al trabajo → CTA (suscribirse + Jamestown + la pregunta).
export const I0 = 718.8, I1 = 900.6;

const KI: K[] = [
  [718.8, 0, -620, 2.0], [720.4, 300, -600, 0.62], [722.4, 350, -540, 0.92], [729.7, 300, -600, 0.7],
  [729.8, -1300, -500, 0.8], [736.4, -1150, -480, 0.85], [744.8, -1300, -400, 1.0], [748.6, -1250, -400, 1.0], [750.3, 2750, -300, 1.2], [755.6, 2800, -300, 1.2], [756.5, 2900, -330, 0.95], [761.6, 2950, -330, 0.97],
  [761.71, 4300, -1450, 0.95], [769.0, 4380, -1400, 1.25], [779.5, 4350, -1420, 1.1],
  [779.6, 2650, -250, 0.85], [790.2, 2800, -250, 0.9], [801.2, 2950, -250, 0.85],
  [801.27, -4700, -420, 0.7], [805.0, -4800, -330, 1.1], [809.7, -4700, -330, 1.15], [813.8, -4500, -460, 0.8], [813.9, -1600, -520, 0.55], [817.4, -200, -520, 0.55],
  [821.75, 3300, -1500, 0.32], [823.9, 3300, -1500, 0.3],
  [823.95, -1900, -480, 0.68], [836.7, -1000, -480, 0.72],
  [836.79, 0, -620, 0.58], [848.4, 0, -600, 0.68],
  [848.47, -1300, -480, 0.72], [870.8, -900, -480, 0.78],
  [870.85, 3600, -1000, 0.42], [877.3, 3600, -480, 0.95], [879.6, 3400, -700, 0.6], [885.7, 3400, -560, 0.8], [900.6, 3450, -560, 0.82],
];
type Z = "sala" | "calle" | "ofi" | "fiesta" | "ruta" | "mapa" | "muda" | "hambre" | "hall" | "carta" | "plaza";
const seg = (t: number): Z =>
  t < 729.8 ? "sala" : t < 761.71 ? "calle" : t < 779.6 ? "ofi" : t < 801.27 ? "fiesta" : t < 817.5 ? "ruta" : t < 821.75 ? "mapa" : t < 823.95 ? "muda" : t < 836.79 ? "hambre" : t < 848.47 ? "hall" : t < 870.85 ? "carta" : "plaza";

const ESCLAVO = (i: number) => ({ ...OBRERO(i), piel: "#6b4430", tunica: "#cfc3ad", tunica2: "#a89a80" });

// cartel de casa de empeño (tres bolas doradas)
const Empeno: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
    <line x1={0} y1={0} x2={160} y2={0} stroke="#2a1530" strokeWidth={10} />
    {[[110, 40], [150, 40], [130, 75]].map(([cx, cy], i) => <g key={i}><line x1={cx} y1={0} x2={cx} y2={cy - 18} stroke="#2a1530" strokeWidth={4} /><circle cx={cx} cy={cy} r={20} fill={C.oro} stroke="#2a1530" strokeWidth={5} /></g>)}
    <rect x={-10} y={-90} width={190} height={70} rx={10} fill="#2a1530" />
    <text x={85} y={-42} textAnchor="middle" fontWeight={700} fontSize={44} fill={C.oro} fontFamily="sans-serif">PAWN</text>
  </svg>
);

export const PI: React.FC<{ t: number }> = ({ t }) => {
  const s = seg(t);
  const cam = s === "mapa" ? { x: -200, y: 350, z: 1.0 } : camara(t, KI);
  const sh = sacudon(t, [749.4, 779.7, 818.0, 842.4, 848.6]);
  // ── gente por segmento
  const gS: GenteFab[] = s === "sala"
    ? [
        ...[-1150, -850, -560, -260].map((x, i) => ({ seed: 70 + i, x, y: -170, h: 470, ropa: DUENO, gorro: "copa" as const, barba: i % 2 === 0, expr: (t > 724 ? "sorpresa" : "neutro") as GenteFab["expr"], mira: 1 })),
        { seed: 76, x: 760, y: -200, h: 290, ropa: NINA, gorro: "cofia", largo: true, flip: true, expr: "triste", habla: t > 722.4 && t < 726.4 && Math.floor(t * 3) % 2 === 0, mira: -1 },
        { seed: 2, x: 980, y: -200, h: 300, ropa: NINO, gorro: "gorra", flip: true, expr: t > 726.5 ? "orgullo" : "triste", habla: t > 726.5 && Math.floor(t * 3) % 2 === 1, mira: -1 },
        { seed: 77, x: 1200, y: -200, h: 260, ropa: NINA, largo: true, flip: true, expr: "triste", aparece: 721 },
      ]
    : s === "hall"
      ? Array.from({ length: 10 }, (_, i) => ({ seed: 150 + i, x: -1350 + i * 300, y: -200, h: 420 + (i % 3) * 40, ropa: OBRERO(i), gorro: (i % 2 ? "cofia" : "gorra") as GenteFab["gorro"], largo: i % 2 === 1, expr: (t > 842.3 ? "orgullo" : "triste") as GenteFab["expr"], bD: t > 842.3 + (i % 4) * 0.12 ? 170 : 0, cD: 10, mira: i < 5 ? 1 : -1, flip: i >= 5 }))
      : [];
  const gP: GenteFab[] = [];
  if (s === "calle") {
    [-2100, -1700, -1350, -950, -550].forEach((x, i) => gP.push({ seed: 160 + i, x, y: 0, h: 460 + (i % 2) * 30, ropa: OBRERO(i), gorro: i % 2 ? "cofia" : "copa", largo: i % 2 === 1, expr: t > 744.8 ? "enojado" : t > 739.2 ? "sorpresa" : "neutro", flip: i % 2 === 0, habla: t > 744.8 && Math.floor(t * 4 + i) % 2 === 0, manoD: <div style={{ position: "absolute", left: -40, top: -50, width: 80, height: 100, background: "#f6ecd0", border: "4px solid #c9a96a" }} />, bD: t < 744.8 ? 60 : 150 + 25 * Math.sin(t * 9 + i * 2), cD: t < 744.8 ? 70 : 20, bI: t > 744.8 && i % 2 ? 140 + 20 * Math.sin(t * 8 + i) : 0, salta: t > 744.9 && t < 747.2 ? 744.9 + (i % 2) * 0.35 + Math.floor((t - 744.9 - (i % 2) * 0.35) / 0.75) * 0.75 : undefined }));
    // los chicos menores de 9 salen por el portón
    if (t > 750.4) for (let i = 0; i < 5; i++) gP.push({ seed: 170 + i, x: FCX - 200 - Math.max(0, t - 750.6 - i * 0.4) * 230, y: 0, h: 330 + (i % 2) * 24, ropa: i % 2 ? NINA : NINO, gorro: i % 2 ? "cofia" : "gorra", largo: i % 2 === 1, camina: 1.3, flip: true, expr: "feliz", opacity: ent(t, 750.6 + i * 0.4) });
    if (t > 755.5) [1800, 2120, 2440, 2760].forEach((x, i) => gP.push({ seed: 180 + i, x, y: 0, h: 440, ropa: DUENO, gorro: "copa", expr: "neutro", aparece: 755.6 + i * 0.4, mira: 1 }));
  }
  if (s === "fiesta") {
    for (let i = 0; i < 9; i++) gP.push({ seed: 190 + i, x: 1700 + i * 260, y: 0, h: i % 3 === 2 ? 260 : 450 + (i % 2) * 40, ropa: i % 3 === 2 ? NINO : OBRERO(i), gorro: i % 2 ? "cofia" : "gorra", largo: i % 2 === 1, expr: t < 788.1 ? "feliz" : "neutro", salta: t > 779.8 && t < 788.1 ? 779.8 + (i % 3) * 0.3 + Math.floor((t - 779.8 - (i % 3) * 0.3) / (t > 786 ? 0.7 : 1.6)) * (t > 786 ? 0.7 : 1.6) : undefined, bD: t > 786 && t < 788.1 ? 160 : t < 788.1 ? 90 + 50 * Math.sin(t * 6 + i) : 20, bI: t > 786 && t < 788.1 ? 160 : t < 788.1 ? 40 + 40 * Math.sin(t * 5 + i * 2) : 20, inclina: t > 788.1 ? 8 + 4 * Math.sin(t * 2 + i) : 0, habla: t > 788.1 && Math.floor(t * 3 + i) % 3 === 0, flip: i % 2 === 1 });
  }
  if (s === "hambre") {
    for (let i = 0; i < 7; i++) gP.push({ seed: 200 + i, x: -2500 + i * 260, y: 0, h: i % 3 === 1 ? 250 : 440, ropa: i % 3 === 1 ? NINA : OBRERO(i), gorro: i % 2 ? "cofia" : undefined, largo: i % 2 === 1, expr: t > 834.8 && t < 836.8 ? "enojado" : "triste", habla: t > 834.8 && t < 836.8 && Math.floor(t * 5 + i) % 2 === 0, bD: 70, cD: 60, manoD: <div style={{ position: "absolute", left: -30, top: -14, width: 60, height: 28, background: "#d8cfc0", borderRadius: "0 0 30px 30px", border: "4px solid #2a1530" }} /> });
    gP.push({ seed: 210, x: -520, y: 0, h: 470, ropa: OBRERO(4), gorro: "cofia", largo: true, flip: true, expr: "triste", bD: 100, cD: 40 });
  }
  if (s === "carta") {
    for (let i = 0; i < 7; i++) gP.push({ seed: 220 + i, x: -2100 + i * 300, y: 0, h: 440 + (i % 2) * 40, ropa: OBRERO(i), gorro: i % 2 ? "cofia" : "gorra", largo: i % 2 === 1, expr: t > 854.7 ? "orgullo" : "sorpresa", mira: 1, flip: i > 3, bD: t > 862 ? 150 + 15 * Math.sin(t * 7 + i) : t > 854.7 ? 60 : 0, salta: i % 2 === 0 ? 864.6 + i * 0.08 : undefined, habla: t > 855 && t < 861 && Math.floor(t * 3 + i) % 4 === 0 });
  }
  const gPf: GenteFab[] = [];
  if (s === "plaza") {
    // al pie de la estatua: dos chicos y una madre la miran (antes de «walk right past»)
    if (t < 879.6) {
      gPf.push({ seed: 240, x: FCX - 520, y: 0, h: 300, ropa: NINO, gorro: "gorra", expr: "sorpresa", mira: 1, miraY: -1 });
      gPf.push({ seed: 241, x: FCX + 500, y: 0, h: 280, ropa: NINA, expr: "orgullo", flip: true, mira: -1, miraY: -1 });
      gPf.push({ seed: 242, x: FCX + 760, y: 0, h: 450, ropa: OBRERO(3), gorro: "cofia", largo: true, flip: true, expr: "orgullo", miraY: -1 });
    }
    // «la mayoría pasa de largo»: caminan POR DELANTE, nunca tapados
    if (t > 879.4 && t < 886.4) for (let i = 0; i < 5; i++) {
      const x = FCX - 2200 + ((t - 879.4) * 230 + i * 700) % 4400;
      gPf.push({ seed: 230 + i, x, y: 40, h: 240 + (i % 3) * 12, ropa: i % 2 ? NINA : NINO, gorro: i % 2 ? "cofia" : "gorra", largo: i % 2 === 1, camina: 1.2, expr: "neutro" });
    }
  }
  const afuera = s === "calle" || s === "fiesta" || s === "hambre" || s === "carta" || s === "plaza";
  const vapor = s === "muda" ? 0 : 1;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {s === "sala" || s === "hall" ? (
        <>
          <AbsoluteFill style={{ background: "#2d1b4a" }} />
          <Espacio cam={cam}><Sala t={t} gente={gS} /></Espacio>
        </>
      ) : s === "ruta" ? (
        <>
          <CieloHora t={t} luz={2} />
          <Espacio cam={cam}>
            <RutaAlgodon t={t}>
              {Array.from({ length: 14 }, (_, i) => <PlantaAlgodon key={i} t={t} seed={i + 3} x={-6200 + i * 260} y={0 + (i % 3) * 30} s={1} />)}
              {[-5400, -4880, -4380, -3880].map((x, i) => { const P = [{ inc: 13, bD: 170, cD: 15 }, { inc: 3, bD: 60, cD: 100 }, { inc: 10, bD: 150, cD: 45 }, { inc: 6, bD: 120, cD: 70 }][i]; const w = Math.sin(t * 2.4 + i * 1.9); return (
                <React.Fragment key={i}>
                  <div style={{ position: "absolute", left: x + (i % 2 ? -150 : 60), top: -95, width: 90, height: 110, background: "#e9dcc0", border: "6px solid #2a1530", borderRadius: "30px 30px 14px 14px" }}><div style={{ position: "absolute", left: 10, top: -18, width: 58, height: 34, borderRadius: "50%", background: "#fff" }} /></div>
                  <Persona t={t} seed={240 + i} x={x} y={10} h={420 + (i % 2) * 30} ropa={ESCLAVO(i)} expr="triste" inclina={P.inc + 2 * w} bD={P.bD + 18 * w} cD={P.cD} flip={i % 2 === 1} />
                </React.Fragment>); })}
              <Velero t={t} x={interpolate(t, [813.5, 815.0], [-2400, -1050], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={60} s={0.9} />
              {/* el bloqueo: la marina del Norte cierra el paso */}
              {t > 814.2 && <Velero t={t} x={interpolate(t, [814.2, 815.0], [900, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={60} s={0.85} fardos={false} />}
              {t > 814.7 && <svg style={{ position: "absolute", left: -560, top: -900, overflow: "visible", opacity: ent(t, 814.75) }} width={1} height={1}><line x1={0} y1={0} x2={0} y2={1000} stroke={C.rojo} strokeWidth={26} strokeDasharray="70 40" /><g transform="translate(0 -10)"><circle r={80} fill={C.rojo} stroke="#fff" strokeWidth={12} /><path d="M -34 -34 L 34 34 M 34 -34 L -34 34" stroke="#fff" strokeWidth={18} strokeLinecap="round" /></g></svg>}
            </RutaAlgodon>
          </Espacio>
        </>
      ) : s === "mapa" ? (
        <>
          <AbsoluteFill style={{ background: "#1d3f7a" }} />
          <Espacio cam={cam}><AtlanticoMapa t={t} ruta={[817.6, 818.6]} bloqueo={818.0} marcas={[{ n: "THE SOUTH", x: -560, y: 500, t0: 817.6, color: C.rojo }, { n: "LANCASHIRE", x: 400, y: 280, t0: 818.3, color: C.oro }]} /></Espacio>
        </>
      ) : (
        <>
          <CieloHora t={t} luz={s === "plaza" ? 2 : 1.8} />
          <Espacio cam={cam} para={0.35}><div style={{ position: "absolute", left: 0, top: -300 }}><Horizonte t={t} humo={s === "plaza" ? 0 : vapor} /></div></Espacio>
          <Espacio cam={cam}>
            <Pueblo t={t} e={{ abre: afuera ? 0 : 1, hora: 12, luz: s === "plaza" ? 2.2 : 1.8, porton: s === "calle" ? 1 : 0, gente: gP, sinFabrica: s === "plaza" }}
              adentro={{ detenida: s === "muda", cartel: s === "ofi" ? "SURGEON · AGE 9+" : undefined, gente1: s === "ofi" ? [
                { seed: 250, x: 4620, y: -1000, h: 480, ropa: DUENO, gorro: "copa", flip: true, expr: "neutro", bD: t > 765.6 ? 90 : 0, cD: 40, habla: t > 769 && t < 771 },
                { seed: 2, x: 4260, y: -1000, h: 290, ropa: NINO, expr: t > 770.5 && t < 772.5 ? "sorpresa" : "triste", habla: t > 770.5 && t < 772.5, mira: 1 },
                { seed: 251, x: 3900, y: -1000, h: 470, ropa: OBRERO(4), gorro: "cofia", largo: true, expr: t > 774.6 ? "feliz" : "triste", habla: t > 774.6 && t < 779 && Math.floor(t * 3) % 2 === 0, mira: 1 },
              ] : [] }} />
            {/* regla de altura del cirujano */}
            {s === "ofi" && t > 769 && (
              <svg style={{ position: "absolute", left: 4140, top: -1000, overflow: "visible", opacity: ent(t, 769) }} width={1} height={1}>
                <rect x={-14} y={-420} width={28} height={420} fill="#e8d4a8" stroke="#2a1530" strokeWidth={5} />
                {Array.from({ length: 9 }, (_, i) => <line key={i} x1={-14} y1={-i * 46} x2={i % 2 ? 0 : 10} y2={-i * 46} stroke="#2a1530" strokeWidth={4} />)}
                <line x1={-20} y1={-300} x2={110} y2={-300} stroke={C.rojo} strokeWidth={6} />
              </svg>
            )}
            {s === "hambre" && (
              <>
                <Empeno x={-2330} y={-430} />
                <svg style={{ position: "absolute", left: -760, top: -150, overflow: "visible" }} width={1} height={1}>
                  <path d="M -90 0 L 90 0 L 70 140 L -70 140 Z" fill="#3b3346" stroke="#2a1530" strokeWidth={6} />
                  {[0, 1, 2].map((i) => <path key={i} d={`M ${-40 + i * 40} -10 q 14 ${-30 - Math.sin(t * 3 + i) * 10} 0 -70`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.5} />)}
                </svg>
                {/* muebles empeñados */}
                <svg style={{ position: "absolute", left: -2700, top: -130, overflow: "visible", opacity: ent(t, 827.1) }} width={1} height={1}>
                  <rect x={0} y={0} width={150} height={130} fill="#8a5a2c" stroke="#2a1530" strokeWidth={6} /><rect x={170} y={-60} width={40} height={190} fill="#8a5a2c" stroke="#2a1530" strokeWidth={6} />
                </svg>
              </>
            )}
            {s === "plaza" && (
              <>
                <Arbolito t={t} x={2700} y={0} s={1} />
                <Arbolito t={t} x={4500} y={0} s={1.1} />
                <Gente t={t} g={gPf} />
                <Estatua t={t} x={FCX} y={0} s={0.85} />
                {t > 877.3 && <div style={{ position: "absolute", left: FCX - 250, top: -225, width: 500, textAlign: "center", fontFamily, fontWeight: 800, color: "#4a443a", opacity: ent(t, 877.4), lineHeight: 1.05 }}>
                  <div style={{ fontSize: 38 }}>“SUBLIME CHRISTIAN HEROISM”</div>
                  <div style={{ fontSize: 24, marginTop: 8, letterSpacing: 3 }}>A. LINCOLN TO THE WORKERS OF MANCHESTER · 1863</div>
                </div>}
                
              </>
            )}
          </Espacio>
        </>
      )}
      {s === "fiesta" && t > 786 && t < 788.6 && <Particulas t={t} tipo="lluviaoro" n={60} seed={11} />}

      {/* ── capas de pantalla ── */}
      <Latigo t={t} at={[729.8, 761.71, 779.6, 801.27, 817.5, 821.75, 823.95, 836.79, 848.47, 870.85]} />
      <Flash t={t} at={[718.85]} color="#fff3d6" />
      <Gran t={t} t0={718.85} t1={720.3} text="THE TWIST" y={200} size={160} color={C.ambar} />
      <Chip t={t} t0={720.45} t1={722.3} text="THE CHILDREN DID NOT STAY SILENT" color={C.violeta} x={960} y={150} centro size={62} />
      <Chip t={t} t0={722.5} t1={726.4} text="THEY DESCRIBED THEIR OWN DAY" color={C.noche} x={960} y={150} centro size={62} />
      <Sello t={t} t0={727.0} t1={729.7} text="IT CHANGED THE LAW" x={960} y={300} size={110} color={C.lima} />
      <Chip t={t} t0={729.4} t1={731.2} text="IT STARTED WITH A LETTER" color={C.noche} x={960} y={150} centro size={64} />
      <Retrato t={t} t0={731.4} t1={739.0} x={1480} y={460} g={{ seed: 260, ropa: DUENO, gorro: "copa", expr: "enojado" }} nombre="RICHARD OASTLER" sub="YORKSHIRE LAND AGENT · 1830" s={0.9} />
      {t > 733 && t < 744.6 && <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${ent(t, 733) * (1 - prog(t, 744.3, 744.6))})`, transformOrigin: "560px 540px" }}><Pergamino x={560} y={560} w={640} abre={prog(t, 733.1, 733.9)} titulo="LEEDS MERCURY" /></div>}
      <Gran t={t} t0={736.5} t1={739.0} text="“YORKSHIRE SLAVERY”" y={200} size={110} color={C.rojo} />
      <Chip t={t} t0={739.2} t1={744.6} text="MILL CHILDREN: TREATED WORSE THAN THE ENSLAVED" color={C.rojo} x={960} y={150} centro size={52} />
      <Velo t={t} t0={744.85} t1={747.0} op={0.35} />
      <Gran t={t} t0={744.9} t1={747.0} text="READERS WERE FURIOUS" y={190} size={120} color={C.rojo} />
      <Chip t={t} t0={747.1} t1={749.1} text="THE LETTER WOULD NOT GO AWAY" color={C.violeta} x={960} y={150} centro size={64} />
      <Velo t={t} t0={749.3} t1={760.4} op={0.6} />
      <Sello t={t} t0={749.4} t1={760.3} text="FACTORY ACT · 1833" x={760} y={190} size={100} color={C.lima} rot={-6} />
      <Lista t={t} t0={750.4} t1={760.3} x={1180} y={230} size={50} items={[{ txt: "UNDER 9: BANNED", t0: 750.6, ok: true }, { txt: "HOURS LIMITED", t0: 753.4, ok: true }, { txt: "FACTORY INSPECTORS", t0: 755.5, ok: true }]} />
      <Cuenta t={t} t0={756.6} t1={757.8} de={0} a={4} suf=" INSPECTORS" x={960} y={930} size={84} color={C.ambar} fuera={760.3} />
      <Chip t={t} t0={757.9} t1={760.3} text="FOR THE WHOLE COUNTRY" color={C.rojo} x={960} y={1030} centro size={44} />
      <Chip t={t} t0={760.5} t1={761.6} text="BUT IT WAS A START" color={C.lima} tinta={C.noche} x={960} y={150} centro size={70} />
      <Chip t={t} t0={761.8} t1={763.4} text="ONE SMALL PROBLEM" color={C.noche} x={960} y={150} centro size={66} />
      <Gran t={t} t0={763.6} t1={765.4} text="HOW DO YOU PROVE A CHILD IS 9?" y={920} size={92} color={C.ambar} />
      <Chip t={t} t0={765.6} t1={768.9} text="NO BIRTH CERTIFICATES UNTIL 1837" color={C.rojo} x={960} y={150} centro size={60} />
      <Chip t={t} t0={769.1} t1={770.4} text="CHECK THE HEIGHT" color={C.violeta} x={960} y={960} centro size={64} />
      <Chip t={t} t0={770.5} t1={772.4} text="CHECK THE TEETH" color={C.violeta} x={960} y={150} centro size={64} />
      <Chip t={t} t0={772.5} t1={774.5} text="SIGN A PAPER: «AGE 9»" color={C.noche} x={960} y={150} centro size={64} />
      <Tilde t={t} t0={773.0} t1={774.5} x={1420} y={150} s={0.6} />
      <Globo t={t} t0={774.7} t1={779.4} x={560} y={300} text="He's just big for his age!" size={48} w={620} />
      <Chip t={t} t0={775.5} t1={779.4} text="PARENTS NEEDED THE MONEY" color={C.rojo} x={1250} y={950} centro size={56} />
      <Velo t={t} t0={779.65} t1={786.0} op={0.25} />
      <Sello t={t} t0={779.7} t1={786.0} text="TEN HOURS ACT · 1847" x={760} y={170} size={96} color={C.lima} rot={-6} />
      <Cuenta t={t} t0={782.6} t1={784.6} de={14} a={10} suf=" HOURS A DAY" x={960} y={960} size={100} color={C.ambar} fuera={786.0} />
      <Chip t={t} t0={786.1} t1={788.0} text="THEY CELEBRATED IN THE STREETS" color={C.oro} tinta={C.noche} x={960} y={150} centro size={62} />
      <Chip t={t} t0={788.2} t1={790.1} text="NOT THE END OF CHILD LABOUR" color={C.rojo} x={960} y={150} centro size={62} />
      <Chip t={t} t0={790.3} t1={796.0} text="½ DAY AT WORK · ½ DAY AT SCHOOL" color={C.teal} tinta={C.noche} x={960} y={150} centro size={62} />
      <Chip t={t} t0={793.0} t1={796.0} text="FOR DECADES" color={C.noche} x={960} y={960} centro size={56} />
      <Chip t={t} t0={796.2} t1={801.1} text="NO MORE 14-HOUR DAYS" color={C.lima} tinta={C.noche} x={960} y={960} centro size={56} />
      <Gran t={t} t0={801.3} t1={804.7} text="ONE MORE CHAPTER" y={200} size={120} color={C.crema} />
      <Chip t={t} t0={803.0} t1={804.7} text="THE STRANGEST ONE" color={C.violeta} x={960} y={330} centro size={60} />
      <Chip t={t} t0={804.8} t1={809.6} text="ALL THAT COTTON CAME FROM SOMEWHERE" color={C.noche} x={960} y={150} centro size={60} />
      <Chip t={t} t0={809.8} t1={813.8} text="THE AMERICAN SOUTH · PICKED BY ENSLAVED PEOPLE" color={C.rojo} x={960} y={150} centro size={52} />
      <Gran t={t} t0={813.95} t1={817.4} text="1861 · CIVIL WAR" y={200} size={120} color={C.crema} />
      <Chip t={t} t0={814.7} t1={817.4} text="THE NAVAL BLOCKADE" color={C.rojo} x={960} y={950} centro size={66} />
      <Chip t={t} t0={818.1} t1={821.6} text="THE NORTH BLOCKADES THE SOUTHERN PORTS" color={C.noche} x={960} y={150} centro size={56} />
      <Chip t={t} t0={819.6} t1={821.6} text="THE COTTON STOPS" color={C.rojo} x={960} y={950} centro size={66} />
      <Gran t={t} t0={821.8} t1={823.9} text="THE MILLS WENT SILENT" y={540} size={120} color={C.crema} />
      <Chip t={t} t0={824.0} t1={826.8} text="HUNDREDS OF THOUSANDS OUT OF WORK" color={C.rojo} x={960} y={150} centro size={58} />
      {/* gráfico: el algodón americano que llega a Inglaterra se derrumba */}
      {t > 824.0 && t < 829.9 && (() => { const e = ent(t, 824.1) * (1 - prog(t, 829.6, 829.9)); const hs = [1, 0.62, 0.04]; return (
        <div style={{ position: "absolute", left: 1240, top: 270, width: 600, height: 560, borderRadius: 26, background: "#fff6dc", border: "8px solid #2a1530", boxShadow: "12px 14px 0 rgba(20,8,40,.35)", transform: `scale(${e})`, transformOrigin: "50% 100%", fontFamily }}>
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 34, color: "#2a1530", marginTop: 18 }}>AMERICAN COTTON → BRITAIN</div>
          {hs.map((h, i) => { const g = prog(t, 824.4 + i * 0.7, 825.0 + i * 0.7); return (
            <div key={i}>
              <div style={{ position: "absolute", left: 70 + i * 170, bottom: 80, width: 120, height: 360 * h * g, background: i === 2 ? C.rojo : "#e9e2cf", border: "6px solid #2a1530", borderRadius: "12px 12px 0 0" }}>
                <div style={{ position: "absolute", left: 18, right: 18, top: 14, height: Math.min(60, 360 * h * g - 20), borderRadius: 30, background: "#fff", opacity: i === 2 ? 0 : 1 }} />
              </div>
              <div style={{ position: "absolute", left: 70 + i * 170, bottom: 28, width: 120, textAlign: "center", fontWeight: 700, fontSize: 36, color: "#2a1530" }}>{1860 + i}</div>
            </div>); })}
          {t > 826.4 && <div style={{ position: "absolute", left: 370, top: 360, fontWeight: 700, fontSize: 40, color: C.rojo, whiteSpace: "nowrap", transform: `rotate(-6deg) scale(${ent(t, 826.4)})` }}>↓ ALMOST 0</div>}
        </div>); })()}
      {/* el atajo: un señor ofrece algodón del Sur, la multitud se niega */}
      {t > 832.3 && t < 836.8 && <Persona t={t} seed={262} x={1620} y={1010} h={560} ropa={DUENO} gorro="copa" flip mira={-1} expr="orgullo" bD={t < 834.8 ? 100 + 10 * Math.sin(t * 6) : 40} cD={t < 834.8 ? 30 : 20} habla={t < 834.6 && Math.floor(t * 4) % 2 === 0} aparece={832.3} manoD={<div style={{ position: "absolute", left: -55, top: -60, width: 110, height: 90, borderRadius: 18, background: "#fff", border: "6px solid #2a1530" }} />} />}
      <Globo t={t} t0={832.6} t1={834.6} x={1180} y={330} text="Back the South. Get your cotton." size={42} w={520} cola="der" />
      <Gran t={t} t0={834.8} t1={836.7} text="“NO.”" y={470} size={170} color={C.rojo} />
      <Chip t={t} t0={827.0} t1={829.8} text="FURNITURE PAWNED · SOUP LINES" color={C.noche} x={960} y={150} centro size={76} />
      <Sello t={t} t0={829.95} t1={832.2} text="LANCASHIRE COTTON FAMINE" x={960} y={330} size={54} rot={0} />
      <Chip t={t} t0={832.3} t1={836.7} text="THE EASY WAY: HELP THE SOUTH, GET THE COTTON" color={C.violeta} x={960} y={150} centro size={52} />
      <Chip t={t} t0={836.9} t1={842.2} text="FREE TRADE HALL · MANCHESTER · END OF 1862" color={C.oro} tinta={C.noche} x={960} y={150} centro size={56} />
      <Gran t={t} t0={842.4} t1={846.6} text="FOR THE NORTH. AGAINST SLAVERY." y={190} size={92} color={C.lima} />
      <Chip t={t} t0={846.8} t1={848.4} text="WHILE GOING HUNGRY" color={C.rojo} x={960} y={950} centro size={68} />
      {t > 848.5 && t < 861.6 && (() => {
        const k = prog(t, 848.6, 850.8);
        return <Carta t={t} t0={848.6} x={1920 - k * 820} y={560} s={0.3 + k * 0.64} abre={prog(t, 853.4, 854.2)} lineas={t > 853.8 ? ["Washington · 19 January 1863", "To the working men of Manchester:", "“…sublime Christian heroism,", "not surpassed in any age…”"] : []} />;
      })()}
      <Chip t={t} t0={848.6} t1={851.6} text="A LETTER FROM WASHINGTON" color={C.violeta} x={960} y={130} centro size={62} />
      <Retrato t={t} t0={851.8} t1={854.6} x={290} y={480} g={{ seed: 261, ropa: DUENO, gorro: "copa", barba: true, expr: "neutro" }} nombre="ABRAHAM LINCOLN" sub="JANUARY 1863" s={0.85} />
      <Chip t={t} t0={851.8} t1={854.6} text="TO THE WORKING MEN OF MANCHESTER" color={C.noche} x={1150} y={130} centro size={54} />
      <Lista t={t} t0={861.8} t1={870.7} x={90} y={170} titulo="THE SAME PEOPLE WHO…" size={52} items={[{ txt: "WORKED THE MILLS AS KIDS", t0: 862.2, ok: true }, { txt: "PAID FOR THE STEAM", t0: 864.6, ok: true }, { txt: "WERE FINED FOR WHISTLING", t0: 866.4, ok: true }]} />
      <Chip t={t} t0={867.5} t1={870.7} text="SOMEONE ELSE'S FREEDOM > THEIR OWN BREAD" color={C.ambar} tinta={C.noche} x={960} y={1000} centro size={54} />
      <Chip t={t} t0={870.9} t1={873.6} text="MANCHESTER · STILL THERE TODAY" color={C.noche} x={960} y={150} centro size={60} />
      <Chip t={t} t0={877.4} t1={879.5} text="CARVED IN THE BASE: THAT LETTER" color={C.oro} tinta={C.noche} x={960} y={150} centro size={60} />
      <Chip t={t} t0={879.7} t1={882.4} text="MOST PEOPLE WALK RIGHT PAST IT · ON THEIR WAY TO WORK" color={C.violeta} x={960} y={150} centro size={48} />
      <Primer t={t} t0={879.8} t1={885.7} lado="izq" h={900} x={300} g={{ expr: t < 882.6 ? "sorpresa" : "orgullo", mira: 1, miraY: -0.8 }} />
      <Gran t={t} t0={882.6} t1={885.6} text="EXACTLY THE POINT" y={200} size={120} color={C.crema} />
      {/* CTA */}
      <Chip t={t} t0={885.8} t1={890.4} text="SURVIVED A FULL SHIFT?" color={C.noche} x={960} y={150} centro size={66} />
      <Velo t={t} t0={886.4} t1={895.6} op={0.5} />
      {t > 886.6 && t < 895.4 && (
        <div style={{ position: "absolute", left: 960 - 400, top: 380, width: 800, height: 150, borderRadius: 75, background: C.rojo, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 76, color: "#fff", letterSpacing: 3, whiteSpace: "nowrap", transform: `scale(${ent(t, 886.7) * (t > 888.4 && t < 888.7 ? 0.9 : 1) * (1 - prog(t, 895.1, 895.4))})`, boxShadow: "0 12px 0 #8a1d2a", fontFamily }}>
          {t > 888.6 ? "SUBSCRIBED ✓" : "SUBSCRIBE"}
        </div>
      )}
      {t > 888.8 && t < 895.4 && <Campana t={t} t0={888.8} t0b={889.3} x={1480} y={455} s={0.6} />}
      {t > 890.6 && t < 895.5 && (
        <div style={{ position: "absolute", left: 960 - 560, top: 600, width: 1120, height: 330, borderRadius: 28, overflow: "hidden", background: "#1d3f7a", border: "8px solid #fff3d6", transform: `scale(${ent(t, 890.7) * (1 - prog(t, 895.2, 895.5))})` }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #8fb6e0, #dfe9f2)" }} />
          <Mar t={t} x={0} y={230} w={1120} h={120} />
          <Velero t={t} x={interpolate(t, [890.6, 895.5], [180, 900])} y={250} s={0.24} fardos={false} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", fontWeight: 800, fontSize: 58, color: "#fff", fontFamily, whiteSpace: "nowrap", textShadow: "0 4px 0 #2a1530, 0 0 12px #2a1530" }}>NEXT: JAMESTOWN</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center", fontWeight: 800, fontSize: 46, color: C.ambar, fontFamily, whiteSpace: "nowrap", textShadow: "0 4px 0 #2a1530" }}>SURVIVE THE FIRST WINTER</div>
        </div>
      )}
      {t > 895.6 && <Velo t={t} t0={895.6} t1={1e9} op={0.55} />}
      <Gran t={t} t0={895.7} t1={1e9} text="WHICH HORROR GETS YOU FIRST?" y={110} size={86} color={C.ambar} />
      <Carretes t={t} t0={896.3} n={7} y={820} s={0.8} />
      <Chip t={t} t0={897.2} t1={1e9} text="TELL ME IN THE COMMENTS" color={C.violeta} x={960} y={1030} centro size={52} />
    </AbsoluteFill>
  );
};
