// lc02 · planos 41-80 (188,05 → 394,05 s): el reloj radiocontrolado y la Navidad, el diente (absceso, farmacia, las pinzas),
// el silencio y la regla 3, el lago que nunca se congela, el día 130, el escáner y la voz de Gus, el 3 en el cuaderno.
// Rehechura v2 (26-oct): EscenaNB (sin motion blur), PjM con IK a puntos del mundo, objetos con texto en el mundo
// (nunca espejados), sentados con asiento, la estufa (x 1950) siempre a ≥150 px de cualquiera.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Halo } from "../../anikit/luz";
import { Globo, Pildora, RelojDia, Temporizador } from "../../anikit/pantalla";
import { Lata } from "../../anikit/props";
import { SUPER_PISO, SUPER_PUNTOS } from "../../anikit/sets/super";
import { AMBAR, BORDE_FRIO, GUS, JUNE, JUNE_INV, PAL, ROJO_CENSO, THEO_CASA, THEO_INV } from "../elenco";
import { F_MONO } from "../hud";
import { Panorama } from "../mundo/panorama";
import { Superior, SUP_PISO, SUP_PUNTOS } from "../mundo/superior";
import { CanalPark, CANAL_PISO } from "../mundo/puente";
import { Barrio, BARRIO_PISO, Living, LIV_PISO } from "../mundo/casa";
import { CuadernoGrande, kDe, NotaHeladera } from "./base";
import { RelojRadio } from "./lc02_props";
import {
  AbscesoCorte, aparece, ArcoSol, BarraLuz, BolsaFarm, CieloGus, cl, CuadernoChico, CurvaFrio, EscanerW, EscenaNB, fmt, FrascoW, Garabato,
  GraficoPotencia, InteriorGus, LinternaW, ManoLapiz, MapaCuadras, MapaUSA, OreLab, PARKA_A, PARKA_B, PARKA_C, ParedGus,
  PilaLibros, PinzasW, PjM, Pulso, RelojPared, Rot, rueda, SetAntartida, Silla, TapaVuela, tr, VENT_G,
} from "./lc02_planos2_comp";
import { io } from "./lc02_planos2_comp";
import { POSES as POSES_V3H } from "../../anikit/personaje";
import { ManoLapiz as ManoLapiz1 } from "./lc01_planos2_comp";
import { CalendarioPared, CuerdaVoz, Durmiente, MejillaV3, RelojMano, SenalEntra, SombraPj, VelaW, Ventisca, VeloOscuro } from "./v3g_v3";
import { FilaUltima, pop, SubTomas, TarjetasPop } from "./v4h_v4";
import { BH_PISO, BordeHielo, HieloOrilla, LenoLado, MapaPuertoV3, PilaLena, RayasPared, SilGus, VaporLago } from "./v3h_v3";
import { AvionTachado, GolpeOndas, InfeccionV4, ManosNieveV4, MejillaV4, PilaV4, RelojPulsera, Tomas } from "./v4g_v4";
import { Contador } from "../../anikit/pantalla";
import { SuperSinCarro } from "./v3c_v3";
import { juntas } from "./lc02_planos2_comp";

const P = LIV_PISO;
const B = BARRIO_PISO;
const COL = P - 70; // arriba de los colchones (sentarse ahí: ruta y = COL, asiento 8)
const AS_PISO = [{ f: 0, v: 8 }];
const AS_TAB = [{ f: 0, v: 104 }]; // taburete de la mesa (alto 100)
// el Living propio (no el de planos1): noche de invierno, estufa prendida, mantas en las puertas
const LIVN = { hora: "noche", luces: 0, fuego: 1, lena: 0.45, latas: 0.8, mantas: true, plastico: true, reglas: 2, cae: false };
const OSCURO: React.CSSProperties = { background: "radial-gradient(ellipse at 50% 50%, #2a2236 0%, #0d0b12 85%)" };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });

// reloj radiocontrolado chico, en el mundo (texto legible)
const RelojW: React.FC<{ x: number; y: number; s?: number; f: number; fecha?: string }> = ({ x, y, s = 1, f, fecha = "DEC 19" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-46} y={-32} width={92} height={64} rx={9} fill="#2a2a30" stroke="#4a4a54" strokeWidth={2} />
    <rect x={-38} y={-24} width={76} height={40} rx={4} fill="#a8d890" />
    <text x={0} y={-4} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={17} fill="#16240f">7:41</text>
    <text x={0} y={12} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={12} fill="#16240f">{fecha}</text>
    <g transform="translate(30,-20)" opacity={Math.floor(f / 10) % 2 ? 1 : 0.4}><path d="M0,0 q4,-4 8,0 M-3,-4 q7,-7 14,0" stroke="#16240f" strokeWidth={1.6} fill="none" /></g>
  </g>
);
// arcos de señal que llegan (desde la izquierda arriba = Colorado) hasta el reloj
const Senal: React.FC<{ x: number; y: number; f: number; o: number; dir?: number }> = ({ x, y, f, o, dir = -1 }) => o <= 0 ? null : (
  <g opacity={o}>{[0, 1, 2, 3].map((i) => { const r = 40 + ((f * 3 + i * 40) % 160); return <path key={i} d={`M${x + dir * r * 0.7},${y - r * 0.7} A${r},${r} 0 0 ${dir < 0 ? 0 : 1} ${x + dir * r * 0.95},${y + r * 0.25}`} stroke={AMBAR} strokeWidth={5} fill="none" opacity={1 - r / 200} />; })}</g>
);

// ---------- 41 · Theo encuentra un reloj radiocontrolado (súper sin luz, con linterna) → inserto: el reloj en la mano ----------
export const P41Reloj: React.FC = () => {
  const f = useF();
  const k = kDe(188.05);
  const S = SUPER_PISO, X = SUPER_PUNTOS.pasillo;
  const repisa = { x: X + 130, y: S - 214 };
  const cara = { x: X + 66, y: S - 262 };
  const tom = k(189.4), sube = k(190.0);
  if (f >= k(190.7)) {
    // inserto: la mano de Theo (manga naranja) con el reloj; la señal llega desde arriba a la izquierda (Colorado)
    const s = interpolate(f, [k(190.7), k(194.41)], [1, 1.06], cl);
    const tiembla = Math.sin(f / 7) * 3;
    return (
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 60%, #2a2f3a 0%, #0c0e14 80%)" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {/* góndolas apagadas al fondo */}
          {[0, 1, 2, 3].map((i) => <rect key={i} x={120 + i * 470} y={300} width={380} height={640} rx={8} fill="#141820" />)}
          {[0, 1, 2, 3].map((i) => [0, 1, 2].map((r) => <rect key={`${i}${r}`} x={130 + i * 470} y={420 + r * 160} width={360} height={10} fill="#1f2530" />))}
          <SenalEntra f={f} x={1060} y={560} o={tr(f, k(192.21), k(192.6))} />
          <g transform={`translate(960,600) scale(${s}) translate(-960,-600)`}>
            <RelojMano f={f} x={1000 + tiembla} y={600} s={1} senal={tr(f, k(192.81), k(193.3))} fecha="DEC 19" hora="7:41" />
          </g>
        </svg>
        <Pildora texto="IT KNOWS THE DATE" x={960} y={110} desde={k(190.9)} hasta={k(192.6)} color={AMBAR} tam={44} />
        <Pildora texto="RADIO SIGNAL FROM COLORADO" x={1040} y={110} desde={k(192.81)} color={AMBAR} tam={44} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <EscenaNB Set={SuperSinCarro} pal={PAL} seed={41}
        claves={[mira(0, X - 60, S - 330, 1.5), mira(k(189.5), X + 20, S - 320, 1.6, { curva: "inout" }), mira(k(190.7), X + 50, S - 300, 2.1, { curva: "inout" })]}
        medio={<>
          {/* v4g: súper SIN luz (ciudad apagada): velo fuerte; la única luz es la linterna, que pinta un charco cálido en la góndola */}
          <rect x={X - 1400} y={-400} width={2800} height={1800} fill="#0b0d16" opacity={0.8} />
          <Halo x={repisa.x - 10} y={repisa.y - 30} r={230} color="#ffe6a8" fuerza={0.55 * tr(f, 0, 8)} />
          {/* tabla de la góndola donde está el reloj */}
          <rect x={X + 70} y={S - 200} width={160} height={10} fill="#c9cfd2" />
          {f < tom && <RelojW x={repisa.x} y={repisa.y - 18} f={f} s={0.8} />}
          <PjM look={THEO_INV} ruta={[{ f: 0, x: X - 230, y: S }, { f: k(189.2), x: X }]} dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(188.75), v: "duda" }, { f: k(189.41), v: "sorpresa" }, { f: k(190.09), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(188.9), v: { x: 1, y: 0.5 } }, { f: sube, v: { x: 0.8, y: 0.3 } }]}
            poses={[{ f: 0, v: "parado" }, { f: k(188.9), v: { tronco: 10, cabeza: 10 } }, { f: sube, v: { tronco: 0, cabeza: 4 } }]}
            ik={(q) => ({ D: q < tom ? repisa : lp(repisa, cara, tr(q, tom, sube)), wD: tr(q, k(188.9), tom), I: { x: X + 30 - 230 * (1 - tr(q, 0, k(189.2))), y: S - 170 }, wI: 1 })}
            mundo={(j, q) => <>
              <LinternaW x={j.manoI.x} y={j.manoI.y} ang={q < tom ? -18 : -40} largo={300} abre={60} />
              {q >= tom && <RelojW x={j.manoD.x + 8} y={j.manoD.y - 20} f={q} s={0.8} />}
            </>} />
        </>} />
    </AbsoluteFill>
  );
};

// ---------- 42 · la señal de Colorado sigue sonando (mapa) + Theo en Duluth con el reloj ----------
export const P42Torre: React.FC = () => {
  const f = useF();
  const k = kDe(194.41);
  const ms = interpolate(f, [0, 122], [1, 1.08], cl);
  const du = { x: 960 + (1200 - 960) * ms, y: 560 + (316 - 560) * ms };
  const bo = aparece(f, k(195.3));
  const B0 = { x: 1580, y: 210, r: 112 };
  const llega = tr(f, k(195.5), k(195.8));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 45%, #1e2540 0%, #0b0e1a 85%)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(960,560) scale(${ms}) translate(-960,-560)`}>
          <MapaUSA f={f} onda={tr(f, k(194.6), k(195.6))} respaldo={tr(f, k(196.1), k(196.5))} nadie={tr(f, k(197.3), k(197.9))} />
        </g>
        {bo > 0 && <g opacity={bo}>
          <path d={`M${du.x + 16},${du.y - 10} L${B0.x - B0.r * 0.8},${B0.y + B0.r * 0.55}`} stroke="#f6ecd2" strokeWidth={3} strokeDasharray="6 5" />
          <defs><clipPath id="v3gBurbuja"><circle cx={B0.x} cy={B0.y} r={B0.r} /></clipPath></defs>
          <circle cx={B0.x} cy={B0.y} r={B0.r + 5} fill="#f6ecd2" />
          <g clipPath="url(#v3gBurbuja)">
            <rect x={B0.x - B0.r} y={B0.y - B0.r} width={B0.r * 2} height={B0.r * 2} fill="#2a2433" />
            <rect x={B0.x - B0.r} y={B0.y + 70} width={B0.r * 2} height={60} fill="#3a3040" />
            <g transform={`translate(${B0.x - 20},${B0.y + 250}) scale(0.82)`}>
              <PjM look={THEO_INV} ruta={[{ f: 0, x: 0, y: 0 }]} dir={[{ f: 0, v: 1 }]}
                caras={[{ f: 0, v: "duda" }, { f: k(195.6), v: "sorpresa" }, { f: k(196.5), v: "feliz" }, { f: k(197.42), v: "v3g_serio" }]}
                miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(195.6), v: { x: 0.6, y: -0.6 } }, { f: k(196.5), v: { x: 1, y: 0.2 } }]}
                poses={[{ f: 0, v: { tronco: 6, cabeza: 8 } }, { f: k(195.6), v: { tronco: -4, cabeza: -10 } }, { f: k(197.42), v: { tronco: 4, cabeza: 10 } }]}
                ik={() => ({ D: { x: 66, y: -250 }, wD: 1 })}
                mundo={(j, q) => <><RelojW x={j.manoD.x + 8} y={j.manoD.y - 20} f={q} s={0.8} /><Senal x={j.manoD.x + 8} y={j.manoD.y - 50} f={q} o={llega} /></>} />
            </g>
          </g>
        </g>}
        <Rot x={1180} y={990} t="STILL RUNNING · NOBODY LEFT TO SWITCH IT OFF" o={aparece(f, k(197.3))} tam={36} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 43 · 25 de diciembre ----------
export const P43Fecha: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill style={OSCURO}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Halo x={960} y={540} r={600} color="#ffb060" fuerza={0.25} />
        <RelojRadio x={960} y={540} s={interpolate(f, [0, 34], [1.6, 1.75])} fecha={f < 12 ? "DEC 24" : "DEC 25"} hora="7:42" f={f} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 44 · jamón en lata y duraznos, en la mesa; June lo anota ----------
export const P44Cena: React.FC = () => {
  const f = useF();
  const k = kDe(199.6);
  const MT = P - 176; // tapa de la mesa (donde se apoyan las cosas)
  const lataT = { x: 2585, y: MT }, boca = { x: 2652, y: P - 232 };
  const come = (q: number) => { const c = [k(200.3), k(200.95), k(201.7), k(202.5)]; for (const a of c) if (q >= a && q < a + 14) return Math.sin(((q - a) / 14) * Math.PI); return 0; };
  const lataJ = { x: 2470, y: MT };
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={44} setProps={{ ...LIVN, vela: true }}
        claves={[mira(0, 2560, P - 290, 1.6), mira(k(202.6), 2560, P - 280, 1.65, { curva: "inout" }), mira(k(203.4), 2460, P - 230, 2.3, { curva: "inout" })]}
        medio={<>
          <Silla x={2380} piso={P} alto={100} respaldo={false} />
          <Silla x={2700} piso={P} alto={100} respaldo={false} dir={-1} />
          {f < k(200.24) && <Lata x={lataT.x} y={lataT.y - 16} color="#c0352c" s={0.8} />}
          {f < k(201.1) && <Lata x={lataJ.x} y={lataJ.y - 16} color="#e0a23a" s={0.8} />}
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: 2380, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={AS_TAB} poses={[{ f: 0, v: "sentado" }]} seed={2}
            caras={[{ f: 0, v: "feliz" }, { f: k(201.2), v: "risa" }, { f: k(202.7), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(202.8), v: { x: 0.6, y: 0.8 } }]}
            habla={[[k(201.2), k(201.8)]]}
            ik={(q) => ({
              I: q < k(201.1) ? lataJ : { x: 2440, y: P - 226 }, wI: q < k(201.1) ? tr(q, k(200.7), k(201.1)) : 1 - tr(q, k(202.2), k(202.6)),
              D: { x: 2462 + 16 * Math.sin(q * 0.9), y: P - 184 + 3 * Math.cos(q * 1.7) }, wD: tr(q, k(202.7), k(203.0)),
            })}
            mundo={(j, q) => <>{q >= k(201.1) && q < k(202.4) && <Lata x={j.manoI.x} y={j.manoI.y - 6} color="#e0a23a" s={0.8} />}{q >= k(202.8) && <path d={`M${j.manoD.x},${j.manoD.y} l10,-34`} stroke="#e0a23a" strokeWidth={5} strokeLinecap="round" />}</>} />
          <PjM look={THEO_INV} ruta={[{ f: 0, x: 2700, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={AS_TAB} poses={[{ f: 0, v: "sentado" }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(200.6), v: "risa" }, { f: k(202.8), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(202.8), v: { x: 1, y: 0.6 } }]}
            ik={(q) => ({ D: q < k(200.24) ? lataT : lp({ x: 2612, y: P - 190 }, boca, come(q)), wD: tr(q, k(199.7), k(200.2)) })}
            mundo={(j, q) => q >= k(200.24) ? <Lata x={j.manoD.x} y={j.manoD.y - 4} color="#c0352c" s={0.8} /> : null} />
          <CuadernoChico x={2476} y={P - 180} rot={-80} s={0.7} roto={1} />
        </>} />
      <Pildora texto="CANNED HAM & PEACHES" x={1100} y={150} desde={k(200.8)} hasta={k(202.7)} color={AMBAR} tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 45 · no un número: una palabra — CHRISTMAS (la mano la escribe) ----------
const puntaRenglon = (f: number, desde: number, t: string, x: number, y: number, tam: number, vel: number) => {
  const n = Math.min(t.length, Math.max(0, Math.floor((f - desde) / vel) + 1));
  const px = x + n * tam * 0.56, py = y + tam * 0.86;
  const a = (-3 * Math.PI) / 180; // la página está rotada -3° alrededor de (x,y)
  return { x: x + (px - x) * Math.cos(a) - (py - y) * Math.sin(a), y: y + (px - x) * Math.sin(a) + (py - y) * Math.cos(a), n };
};
export const P45Navidad: React.FC = () => {
  const f = useF();
  const k = kDe(204.38);
  const r1 = { t: "NOT A NUMBER.", desde: k(204.6), x: 1100, y: 300, tam: 54, vel: 1.6 };
  const r2 = { t: "CHRISTMAS", desde: k(206.0), x: 1090, y: 420, tam: 104, vel: 3.2 };
  const fin1 = r1.desde + r1.t.length * r1.vel, fin2 = r2.desde + r2.t.length * r2.vel;
  const act = f < fin1 + 6 ? r1 : r2;
  let tip = puntaRenglon(f, act.desde, act.t, act.x, act.y, act.tam, act.vel);
  if (f > fin1 + 6 && f < r2.desde) { const a = puntaRenglon(f, r1.desde, r1.t, r1.x, r1.y, r1.tam, r1.vel), b = { x: r2.x, y: r2.y + r2.tam * 0.86 }; tip = { ...lp(a, b, tr(f, fin1 + 6, r2.desde)), n: 0 }; }
  if (f > fin2) { const a = puntaRenglon(f, r2.desde, r2.t, r2.x, r2.y, r2.tam, r2.vel); tip = { ...lp(a, { x: 1100, y: 600 }, tr(f, fin2 + 8, fin2 + 22)), n: 0 }; }
  const sub = tr(f, fin2 + 4, fin2 + 14);
  const g = Math.max(0, 1 - Math.abs(f - (fin2 + 2)) / 6);
  return (
    <AbsoluteFill>
      <CuadernoGrande renglones={[{ t: "DAY 85", desde: -999, x: 1100, y: 214, tam: 40, color: "#6a7a9a" }, { ...r1 }, { ...r2, color: ROJO_CENSO }]} zoom={[0, 1, 1]} vela />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`rotate(-3 ${r2.x} ${r2.y})`}><path d={`M${r2.x},${r2.y + r2.tam * 1.05} l${560 * sub},-6`} stroke={ROJO_CENSO} strokeWidth={9} strokeLinecap="round" fill="none" /></g>
        <ManoLapiz tx={tip.x} ty={tip.y} manga="#5a7a9a" desdeX={1980} desdeY={1180} />
        {g > 0 && <circle cx={1360} cy={470} r={260 + 60 * (1 - g)} fill="none" stroke="#ffd27a" strokeWidth={6} opacity={0.5 * g} />}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 46 · día 90: Theo despierta con la cara hinchada ----------
export const P46Diente: React.FC = () => {
  const f = useF();
  const k = kDe(208.1);
  // v4g: 3 sub-tomas con fundido de 6 cuadros; leña de verdad; la mejilla hincha la silueta; Theo sentado derecho en el colchón
  const XT = 720, XJ = 1110;
  const hin = interpolate(f, [k(210.44), k(211.0), k(211.84)], [0.4, 0.6, 1], cl);
  const dias = Math.round(interpolate(f, [k(214.84), k(215.6)], [0, 14], cl));
  const mej = { x: XT + 30, y: COL - 112 };
  const molar = aparece(f, k(213.0), k(213.8));
  const SP = { ...LIVN, hora: "alba", fuego: 0.3, lena: 0 };
  const theo = (n: number) => (
    <PjM look={THEO_CASA} ruta={[{ f: 0, x: XT, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
      poses={n === 2
        ? [{ f: 0, v: { tronco: -10, cabeza: -10, pI: 85, rI: 0, pD: 70, rD: 95, hI: 60, cI: 30, hD: 50, cD: 40 } }, { f: k(211.0), v: { tronco: 2, cabeza: 6, pI: 85, rI: 0, pD: 70, rD: 95, hI: 30, cI: 40 } }, { f: k(212.82), v: { tronco: 6, cabeza: 14, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 30 } }]
        : [{ f: 0, v: { tronco: 2, cabeza: 12, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 30, hD: 30, cD: 50 } }, { f: k(214.5), v: { tronco: 0, cabeza: 18, pI: 85, rI: 0, pD: 70, rD: 95, hI: 14, cI: 24, hD: 30, cD: 50 } }, { f: k(215.2), v: { tronco: -4, cabeza: -4, pI: 85, rI: 0, pD: 70, rD: 95, hI: 30, cI: 40, hD: 30, cD: 50 } }]}
      caras={[{ f: 0, v: "sorpresa" }, { f: k(211.16), v: "v3g_dolor" }, { f: k(212.82), v: "miedo" }, { f: k(213.94), v: "triste" }, { f: k(215.2), v: "v3g_dolor" }]}
      miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(211.2), v: { x: 0.2, y: 0.4 } }, { f: k(212.9), v: { x: 1, y: 0.1 } }, { f: k(213.94), v: { x: 0.3, y: 1 } }, { f: k(215.1), v: { x: 1, y: 0 } }]}
      ik={(q) => ({ D: mej, wD: n === 2 ? tr(q, k(210.9), k(211.3)) : 1 - tr(q, k(215.0), k(215.4)) * 0.6 })}
      mundo={(j, q) => <>
        <MejillaV4 j={j} k={hin} f={q} latido={tr(q, k(212.3), k(212.6))} calor={n === 2 ? tr(q, k(211.84), k(212.2)) : 0.6} />
        {n === 2 && molar > 0 && <g opacity={molar}>
          <path d={`M${j.cabeza.x + 52},${j.cabeza.y + 34} Q${j.cabeza.x + 110},${j.cabeza.y - 20} ${j.cabeza.x + 150},${j.cabeza.y - 60}`} stroke="#ffb0a0" strokeWidth={2.5} fill="none" strokeDasharray="5 4" />
          <Rot x={j.cabeza.x + 210} y={j.cabeza.y - 66} t="BACK MOLAR" tam={16} borde="#ff4a3a" />
        </g>}
      </>} />
  );
  const toma1 = (
    <EscenaNB Set={Living} pal={PAL} seed={46} setProps={SP}
      claves={[mira(0, 860, 640, 1.5), mira(k(210.44), 880, 650, 1.56, { curva: "inout" })]}
      medio={<>
        <PilaV4 filas={4} />
        <CalendarioPared x={540} y={400} s={0.85} n={0} />
        <Durmiente pj={{ look: THEO_CASA, ruta: [{ f: 0, x: 880, y: COL - 18 }], caras: [{ f: 0, v: "v3g_dormido" }], seed: 1 }} x={880} y={COL - 18} cab={-1} frazada="#9a3a34" f={f} />
        <Durmiente pj={{ look: JUNE_INV, ruta: [{ f: 0, x: 1215, y: COL - 18 }], caras: [{ f: 0, v: "v3g_dormido" }], seed: 2 }} x={1215} y={COL - 18} cab={-1} frazada="#3a5a7a" f={f + 30} />
      </>} />
  );
  const toma2 = (
    <EscenaNB Set={Living} pal={PAL} seed={46} setProps={SP}
      claves={[mira(k(210.44), XT, 805, 2.3), mira(k(211.7), XT, 805, 2.3), mira(k(212.3), XT + 12, 760, 2.8, { curva: "inout" })]}
      medio={<>
        <PilaV4 filas={4} />
        {theo(2)}
        <path d={`M${XT - 20},0 Q${XT + 30},-46 ${XT + 120},-40 Q${XT + 140},-30 ${XT + 144},0 Z`} transform={`translate(0,${COL})`} fill="#9a3a34" />
      </>} />
  );
  const toma3 = (
    <EscenaNB Set={Living} pal={PAL} seed={46} setProps={SP}
      claves={[mira(k(213.94), 860, 660, 1.6), mira(k(216.08), 870, 665, 1.65, { curva: "inout" })]}
      medio={<>
        <PilaV4 filas={4} />
        <CalendarioPared x={540} y={400} s={0.85} n={dias} />
        <PjM look={JUNE_INV} ruta={[{ f: 0, x: XJ, y: COL }]} dir={[{ f: 0, v: -1 }]} asiento={AS_PISO} seed={2}
          poses={[{ f: 0, v: { tronco: 22, cabeza: 14, pI: 85, rI: 0, pD: 70, rD: 95, hI: 40, cI: 60, hD: 30, cD: 30 } }, { f: k(214.5), v: { tronco: 4, cabeza: -4, pI: 85, rI: 0, pD: 70, rD: 95, hI: 30, cI: 40, hD: 30, cD: 30 } }, { f: k(215.06), v: { tronco: -6, cabeza: -8, pI: 85, rI: 0, pD: 70, rD: 95, hI: 60, cI: 150, hD: 30, cD: 30 } }]}
          caras={[{ f: 0, v: "cansado" }, { f: k(214.4), v: "duda" }, { f: k(215.06), v: "enojo" }]}
          miradas={[{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: k(214.4), v: { x: 1, y: 0.1 } }, { f: k(215.5), v: { x: 1, y: 0.3 } }]}
          ik={(q) => ({ I: { x: XJ - 36, y: COL - 132 }, wI: 1 - tr(q, k(214.2), k(214.5)) })} />
        <path d={`M${XJ + 120},0 Q${XJ + 40},-44 ${XJ - 40},-40 L${XJ - 64},-4 Z`} transform={`translate(0,${COL})`} fill="#3a5a7a" />
        {theo(3)}
        <path d={`M${XT - 20},0 Q${XT + 30},-46 ${XT + 120},-40 Q${XT + 140},-30 ${XT + 144},0 Z`} transform={`translate(0,${COL})`} fill="#9a3a34" />
      </>} />
  );
  return <Tomas cortes={[k(210.44), k(213.94)]} tomas={[toma1, toma2, toma3]} />;
};

// ---------- 47 · caliente, late: June sabe lo que es (con la linterna) ----------
export const P47Sabe: React.FC = () => {
  const k = kDe(216.08);
  const XT = 650, XJ = 862;
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={47} setProps={{ ...LIVN, fuego: 0.6 }}
        claves={[mira(0, 750, 790, 2.45), mira(k(217.1), 740, 790, 2.55, { curva: "inout" }), mira(k(218.0), 740, 790, 2.55), mira(k(218.6), 830, 740, 3.0, { curva: "inout" })]}
        medio={<>
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: XT, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
            poses={[{ f: 0, v: { tronco: -6, cabeza: -18, pI: 85, rI: 0, pD: 70, rD: 95, hI: 30, cI: 30, hD: 30, cD: 60 } }, { f: k(217.22), v: { tronco: -10, cabeza: -22, pI: 85, rI: 0, pD: 70, rD: 95, hI: 50, cI: 120, hD: 30, cD: 60 } }, { f: k(218.6), v: { tronco: 4, cabeza: 0, pI: 85, rI: 0, pD: 70, rD: 95, hI: 30, cI: 60, hD: 30, cD: 60 } }]}
            caras={[{ f: 0, v: "v3g_boca" }, { f: k(217.22), v: "v3g_dolor" }, { f: k(218.6), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 0.6, y: -0.6 } }, { f: k(217.3), v: { x: 0.2, y: -1 } }, { f: k(218.7), v: { x: 1, y: 0 } }]}
            mundo={(j, q) => <MejillaV3 j={j} k={1} f={q} latido={tr(q, k(217.22), k(217.5))} calor={tr(q, k(216.42), k(216.7))} />} />
          <PjM look={JUNE} ruta={[{ f: 0, x: XJ, y: COL }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 0 }]} seed={2}
            poses={[{ f: 0, v: "arrodillado" }, { f: k(218.02), v: { tronco: 6, cabeza: 6 } }, { f: k(219.34), v: { tronco: 10, cabeza: 10 } }]}
            caras={[{ f: 0, v: "duda" }, { f: k(217.3), v: "v3g_serio" }, { f: k(218.02), v: "determinado" }, { f: k(219.4), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(218.1), v: { x: 1, y: 0 } }, { f: k(219.4), v: { x: 1, y: 0.5 } }]}
            ik={(q) => ({ D: { x: XJ - 80, y: COL - 150 + 3 * Math.sin(q / 5) }, wD: 1 - tr(q, k(218.6), k(219.0)) * 0.7, I: { x: XT + 34, y: COL - 100 }, wI: tr(q, k(216.3), k(216.7)) * (1 - tr(q, k(219.3), k(219.7))) })}
            mundo={(j, q) => {
              // la linterna apunta a la BOCA de Theo: el haz termina ahí y hace una mancha de luz
              const bx = XT + 42, by = COL - 118;
              const on = 1 - tr(q, k(218.6), k(219.0));
              const a = (Math.atan2(by - j.manoD.y, bx - j.manoD.x) * 180) / Math.PI;
              const L = Math.hypot(bx - j.manoD.x, by - j.manoD.y);
              return <><LinternaW x={j.manoD.x} y={j.manoD.y} ang={on > 0.5 ? a : 70} largo={L} abre={20} on={on} />{on > 0 && <circle cx={bx} cy={by} r={18} fill="#fff6c8" opacity={0.45 * on} />}</>;
            }} />
        </>} />
    </AbsoluteFill>
  );
};

// ---------- 48 · el absceso: infección en la raíz (corte del diente) → por qué asusta ----------
export const P48Absceso: React.FC = () => {
  const f = useF();
  const k = kDe(220.54);
  if (f < k(223.46)) {
    const sp = tr(f, k(221.76), k(223.2));
    const ramas = [[-150, 430], [330, 470], [60, 540], [300, 280], [-60, 330]];
    return (
      <AbsoluteFill style={{ background: "#3a2a2a" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(960,600) scale(${interpolate(f, [0, k(223.46)], [0.78, 0.84], cl)}) translate(-960,-560)`}>
            <AbscesoCorte f={f} inf={tr(f, k(220.8), k(222.0))} flechas={tr(f, k(221.7), k(222.2))} />
            {/* la infección AVANZA: brazos de pus que se meten en el hueso */}
            <g transform="translate(860,520)">
              {ramas.map(([x, y], i) => {
                const t = cl01(sp * 1.4 - i * 0.12);
                if (t <= 0) return null;
                const ex = 104 + (x - 104) * t, ey = 330 + (y - 330) * t;
                return <g key={i}><path d={`M104,330 Q${(104 + ex) / 2 + 20},${(330 + ey) / 2 - 20} ${ex},${ey}`} stroke="#e2483a" strokeWidth={22 - 8 * t} fill="none" strokeLinecap="round" opacity={0.75} /><circle cx={ex} cy={ey} r={16 + 10 * t} fill="#e8b23a" /></g>;
              })}
            </g>
          </g>
          <Rot x={960} y={170} t="ABSCESS" o={aparece(f, k(220.62))} tam={56} borde="#e8b23a" />
        </svg>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={48} setProps={{ ...LIVN, fuego: 0.6 }}
        claves={[mira(k(223.46), 680, 770, 2.3), mira(k(224.2), 680, 770, 2.3), mira(k(225.1), 672, 760, 2.55, { curva: "inout" })]}
        medio={<PjM look={THEO_CASA} ruta={[{ f: 0, x: 650, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
          poses={[{ f: 0, v: { tronco: 10, cabeza: 10, pI: 85, rI: 0, pD: 70, rD: 95, hI: 30, cI: 40, hD: 30, cD: 40 } }, { f: k(224.04), v: { tronco: -4, pI: 85, rI: 0, pD: 70, rD: 95, hI: 45, cI: 140, hD: 45, cD: 140, cabeza: 4 } }, { f: k(224.44), v: { tronco: -10, pI: 85, rI: 0, pD: 70, rD: 95, hI: 60, cI: 150, hD: 30, cD: 60, cabeza: -6 } }]}
          caras={[{ f: 0, v: "triste" }, { f: k(224.04), v: "duda" }, { f: k(224.44), v: "miedo" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.8 } }, { f: k(224.04), v: { x: 1, y: 0 } }, { f: k(224.5), v: { x: 0.2, y: -0.3 } }]}
          mundo={(j, q) => <MejillaV3 j={j} k={1} f={q} latido={0.6} />} />} />
      <Pildora texto="HERE'S WHY THAT'S TERRIFYING" x={960} y={110} desde={k(223.6)} color="#ff8a6a" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 49 · sin antibióticos: mandíbula → cuello → sangre (v3g: en la mesa, el dato vive en la pared) ----------
export const P49Cabeza: React.FC = () => {
  const f = useF();
  const k = kDe(225.16);
  const XT = 2380;
  const t1 = tr(f, k(227.84), k(228.46)), t2 = tr(f, k(228.46), k(229.16)), t3 = tr(f, k(229.16), k(229.7)), t4 = tr(f, k(229.8), k(230.2));
  // la mano sigue la ruta de la infección: mandíbula → cuello → pecho
  const ruta = (q: number) => q < k(228.9) ? { x: XT + 44, y: P - 262 } : q < k(229.6) ? { x: XT + 26, y: P - 232 } : { x: XT + 30, y: P - 196 };
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={49} setProps={{ ...LIVN, fuego: 0.7, vela: true }}
        claves={[mira(0, 2470, P - 300, 2.05), mira(k(227.5), 2462, P - 300, 2.1), mira(k(228.2), 2452, P - 296, 2.45, { curva: "inout" }), mira(k(229.75), 2452, P - 296, 2.45), mira(k(230.35), 2460, P - 290, 2.6, { curva: "inout" })]}
        medio={<>
          <Silla x={XT} piso={P} alto={100} respaldo={false} />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: XT, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={AS_TAB}
            poses={[{ f: 0, v: "sentado" }, { f: k(226.6), v: { tronco: 14, cabeza: 10, hI: 30, cI: 70, hD: 30, cD: 60 } }, { f: k(228.3), v: { tronco: 2, cabeza: -4, hI: 20, cI: 40 } }, { f: k(229.8), v: { tronco: -12, cabeza: -10, hI: 50, cI: 60 } }]}
            caras={[{ f: 0, v: "duda" }, { f: k(225.74), v: "triste" }, { f: k(228.46), v: "miedo" }, { f: k(229.8), v: "sorpresa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(226.8), v: { x: 0.6, y: 0.6 } }, { f: k(228.5), v: { x: 0.3, y: 0.8 } }, { f: k(229.85), v: { x: 1, y: -0.3 } }]}
            ik={(q) => ({ D: ruta(q), wD: tr(q, k(227.9), k(228.3)) })}
            mundo={(j, q) => <>
              <MejillaV4 j={j} k={1} f={q} latido={0.6} />
              {/* v4g: trazo fino (sin glow sobre la cara) y rótulos pegados a cada punto, del lado de la espalda */}
              <InfeccionV4 j={j} f={q} t1={t1} t2={t2} t3={t3} t4={t4} tam={17} />
            </>} />
          {/* la cápsula tachada en la pared: antes de los antibióticos */}
          <g opacity={aparece(f, k(225.3), k(227.7))}>
            <Rot x={2560} y={P - 440} t="BEFORE ANTIBIOTICS" tam={22} borde="#ff3a2e" />
            <g transform={`translate(2560,${P - 372}) rotate(-20)`}>
              <rect x={-40} y={-15} width={40} height={30} rx={15} fill="#e8e2d8" /><rect x={0} y={-15} width={40} height={30} rx={15} fill="#c0352c" />
            </g>
            <path d={`M2520,${P - 340} L2600,${P - 404}`} stroke="#ff3a2e" strokeWidth={6} strokeLinecap="round" opacity={tr(f, k(225.74), k(226.1))} />
          </g>
        </>} />
    </AbsoluteFill>
  );
};

// ---------- 50 · la gente moría por un diente; ya no hay dentistas ----------
export const P50Dentista: React.FC = () => {
  const f = useF();
  const k = kDe(230.4);
  const X = SUP_PUNTOS.dentista, S = SUP_PISO;
  const n = rueda(f, k(232.5), k(233.5), 202000, 0);
  const XJ = X - 165; // June frena a la izquierda de la puerta (la cabeza no pisa el cartel DENTAL)
  // v4g: dos golpes BIEN visibles (12 cuadros c/u, el puño viaja 46 px) y los arcos del golpe en el vidrio
  const GOLPES = [k(231.75), k(232.2)];
  const golpe = (q: number) => { for (const a of GOLPES) if (q >= a && q < a + 12) return Math.sin(((q - a) / 12) * Math.PI); return 0; };
  return (
    <AbsoluteFill>
      <EscenaNB Set={Superior} pal={PAL} seed={50} setProps={{ hora: "dia", luces: 0, nieve: 1 }}
        claves={[mira(0, X - 260, S - 420, 1.45), mira(k(231.3), X - 200, S - 420, 1.45, { curva: "inout" }), mira(k(232.6), X - 200, S - 420, 1.45), mira(k(233.4), X - 170, S - 390, 1.7, { curva: "inout" })]}
        medio={<>
          <g transform={`translate(${X},${S})`}>
            <rect x={-60} y={-250} width={120} height={250} fill="#2a3440" stroke="#e8e2d8" strokeWidth={8} />
            <rect x={-46} y={-236} width={92} height={150} fill="#141a22" />
            <rect x={-60} y={-130} width={30} height={8} rx={3} fill="#c8ccd4" />
            <g transform={`rotate(${Math.sin(f / 5) * 3 + golpe(f) * 6} 0 -200)`}><line x1={-20} y1={-236} x2={0} y2={-200} stroke="#c8ccd4" strokeWidth={2} /><line x1={20} y1={-236} x2={0} y2={-200} stroke="#c8ccd4" strokeWidth={2} /><rect x={-46} y={-200} width={92} height={36} rx={4} fill="#c0352c" /><text x={0} y={-174} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={22} fill="#fff">CLOSED</text></g>
          </g>
          <GolpeOndas x={X - 58} y={S - 150} f={f} golpes={GOLPES.map((g) => g + 5)} dir={-1} />
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: X - 560, y: S }, { f: k(231.6), x: XJ }]} seed={2} luz={BORDE_FRIO}
            caras={[{ f: 0, v: "determinado" }, { f: k(231.75), v: "v3g_serio" }, { f: k(232.6), v: "duda" }, { f: k(233.45), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(232.0), v: { x: 1, y: -0.2 } }, { f: k(232.6), v: { x: 1, y: -0.5 } }, { f: k(233.45), v: { x: 0.3, y: 0.9 } }]}
            dir={[{ f: 0, v: 1 }]}
            ik={(q) => ({ D: { x: X - 62 - 46 * (1 - golpe(q)), y: S - 158 }, wD: tr(q, k(231.55), k(231.75)) * (1 - tr(q, k(232.5), k(232.7))), I: { x: XJ + 70, y: S - 250 }, wI: tr(q, k(232.6), k(232.9)) * (1 - tr(q, k(233.3), k(233.5))) })}
            poses={[{ f: 0, v: "parado" }, { f: k(231.6), v: { tronco: 8 } }, { f: k(232.6), v: { tronco: 14, cabeza: -10 } }, { f: k(233.45), v: { tronco: 10, cabeza: 24, hI: 6, cI: 10, hD: 6, cD: 10, bajar: 4 } }]} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Rot x={1180} y={150} t="PEOPLE DIED FROM BAD TEETH" o={aparece(f, k(230.5), k(232.3))} tam={42} />
        <g opacity={aparece(f, k(232.4))}>
          <rect x={1220} y={96} width={520} height={140} rx={24} fill="rgba(10,14,30,0.7)" stroke="#e2483a" strokeWidth={3} />
          <text x={1480} y={136} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={24} fill="#f6ecd2">DENTISTS LEFT ON EARTH</text>
          <text x={1480} y={214} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={66} fill={n === 0 ? "#e2483a" : "#f6ecd2"}>{fmt(n)}</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 51 · la farmacia, a tres cuadras (June sale de casa al anochecer, ya pega la tormenta; el mapa traza la ruta) ----------
export const P51Farmacia: React.FC = () => {
  const f = useF();
  const k = kDe(233.98);
  const X = 1900;
  const xj = (q: number) => interpolate(q, [0, k(234.6), k(237.38)], [X, X, X + 470], cl);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Barrio} pal={PAL} seed={51} setProps={{ hora: "tormenta", luces: 0, nieve: 1, cae: false, humo: 0.3 }}
        claves={[mira(0, X + 60, B - 300, 1.6), mira(k(235.0), X + 120, B - 300, 1.6, { curva: "inout" }), mira(k(237.38), X + 300, B - 310, 1.45, { curva: "inout" })]}
        medio={<>
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: X, y: B }, { f: k(234.6), x: X }, { f: k(237.38), x: X + 470 }]} seed={2} luz={BORDE_FRIO}
            dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(234.3), v: { tronco: 8, cabeza: -6 } }, { f: k(234.92), v: { tronco: 20, cabeza: -10 } }, { f: k(236.3), v: { tronco: 24, cabeza: -14 } }]}
            caras={[{ f: 0, v: "duda" }, { f: k(234.92), v: "determinado" }, { f: k(236.3), v: "enojo" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(234.6), v: { x: 1, y: 0 } }, { f: k(236.3), v: { x: 1, y: 0.3 } }]}
            ik={(q) => ({ D: { x: xj(q) + 70, y: B - 180 }, wD: tr(q, k(234.0), k(234.5)) })}
            mundo={(j, q) => <LinternaW x={j.manoD.x} y={j.manoD.y} ang={14} largo={300} abre={54} on={tr(q, k(234.5), k(234.8))} />} />
          <Ventisca f={f} x0={X - 1100} w={2600} y0={B - 1000} h={1080} n={420} viento={-15} rayas={50} seed={51} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <MapaCuadras x={1240} y={150} p={tr(f, k(235.0), k(236.6))} f={f} o={aparece(f, k(234.8))} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 52 · en la tormenta: linterna en los dientes, vuelve con la bolsa (v3g: ventisca de verdad) ----------
export const P52Tormenta: React.FC = () => {
  const f = useF();
  const k = kDe(237.38);
  const X = SUP_PUNTOS.farmacia, S = SUP_PISO;
  const xj = (q: number) => interpolate(q, [0, k(240.86)], [X - 860, X - 250], cl);
  const xv = (q: number) => interpolate(q, [k(240.86), k(242.14)], [X + 60, X - 220], cl);
  // la linterna pasa de la mano a la boca: la mano la LLEVA (239.3→239.9) y recién ahí queda en los dientes
  const enDientes = f >= k(239.92);
  const bufanda = (j: { hombro: { x: number; y: number } }, q: number, lado: number) => {
    const x0 = j.hombro.x, y0 = j.hombro.y - 8;
    const w = Math.sin(q / 2.2) * 10, w2 = Math.sin(q / 1.7 + 1) * 12;
    return <path d={`M${x0},${y0} q${lado * 40},${-6 + w} ${lado * 80},${4 + w2} q${lado * 30},${6 - w} ${lado * 66},${-4 + w}`} stroke="#c0352c" strokeWidth={16} fill="none" strokeLinecap="round" />;
  };
  const SP = { hora: "tormenta", luces: 0, nieve: 1, cae: false };
  // v4g: la ida y la vuelta son 2 sub-tomas con fundido de 6 cuadros (era corte seco: tirón en 240,83)
  const ida = (
    <EscenaNB Set={Superior} pal={PAL} seed={52} setProps={SP}
      claves={[mira(0, X - 800, S - 290, 1.8), mira(k(238.9), X - 560, S - 290, 1.8, { curva: "inout" }), mira(k(239.7), X - 430, S - 260, 2.35, { curva: "inout" }), mira(k(240.85), X - 330, S - 260, 2.35, { curva: "inout" })]}
      medio={<>
        <PjM look={JUNE_INV} ruta={[{ f: 0, x: X - 860, y: S }, { f: k(240.86), x: X - 250 }]} dir={[{ f: 0, v: 1 }]} seed={2} luz={BORDE_FRIO}
          poses={[{ f: 0, v: { tronco: 22, cabeza: -8 } }, { f: k(238.5), v: { tronco: 26, cabeza: -12 } }, { f: k(239.96), v: { tronco: 22, cabeza: -6 } }]}
          caras={[{ f: 0, v: "determinado" }, { f: k(238.5), v: "enojo" }, { f: k(239.96), v: "determinado" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(239.2), v: { x: 1, y: -0.1 } }]}
          ik={(q) => ({
            // el brazo izquierdo le tapa la cara del viento; el derecho lleva la linterna y la sube a la boca
            I: { x: xj(q) + 52, y: S - 268 }, wI: cl01(1 - tr(q, k(239.0), k(239.3)) + tr(q, k(240.1), k(240.4))),
            D: q < k(239.3) ? { x: xj(q) + 74, y: S - 170 } : { x: xj(q) + 40, y: S - 250 }, wD: q < k(239.3) ? 1 : 1 - tr(q, k(239.96), k(240.3)) * 0.85,
          })}
          atras={(j, q) => bufanda(j, q, -1)}
          mundo={(j, q) => enDientes ? <LinternaW x={j.boca.x} y={j.boca.y} ang={6} largo={380} abre={62} /> : <LinternaW x={j.manoD.x} y={j.manoD.y} ang={q < k(239.3) ? 12 : interpolate(q, [k(239.3), k(239.9)], [12, 6], cl)} largo={340} abre={58} on={tr(q, k(239.16), k(239.4))} />} />
        <Ventisca f={f} x0={X - 1500} w={2600} y0={S - 1000} h={1100} n={460} viento={-17} rayas={60} seed={52} />
      </>} />
  );
  const vuelta = (
    <EscenaNB Set={Superior} pal={PAL} seed={52} setProps={SP}
      claves={[mira(k(240.86), X + 120, S - 290, 1.9), mira(k(242.14), X + 100, S - 290, 2.0, { curva: "inout" })]}
      medio={<>
        <PjM look={JUNE_INV} ruta={[{ f: k(240.86), x: X + 60, y: S }, { f: k(242.14), x: X - 220 }]} dir={[{ f: 0, v: -1 }]} seed={3} luz={BORDE_FRIO}
          poses={[{ f: 0, v: { tronco: 12, cabeza: -4 } }, { f: k(241.6), v: { tronco: 14, cabeza: 4 } }]}
          caras={[{ f: 0, v: "determinado" }, { f: k(241.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(241.6), v: { x: 0.6, y: 0.7 } }]}
          ik={(q) => ({ D: { x: xv(q) - 70, y: S - 205 }, wD: tr(q, k(241.45), k(241.8)) })}
          atras={(j, q) => bufanda(j, q, 1)}
          mundo={(j) => <><LinternaW x={j.boca.x} y={j.boca.y} ang={174} largo={360} abre={60} /><BolsaFarm x={j.manoD.x} y={j.manoD.y} s={1.4} /></>} />
        <Ventisca f={f} x0={X - 1500} w={2600} y0={S - 1000} h={1100} n={460} viento={-17} rayas={60} seed={52} />
      </>} />
  );
  return <Tomas cortes={[k(240.86)]} tomas={[ida, vuelta]} />;
};

const cl01 = (v: number) => Math.max(0, Math.min(1, v));

// ---------- 53 · antibióticos en la mesa: todavía sirven (pierden fuerza de a poco) ----------
export const P53Frasco: React.FC = () => {
  const f = useF();
  const k = kDe(242.14);
  const MT = P - 176;
  const bolsa = { x: 2470, y: MT };
  const alto = { x: 2470, y: P - 268 };
  const muestra = { x: 2575, y: P - 250 }; // le acerca el frasco a Theo
  const manoJ = (q: number) => q < k(242.8) ? bolsa : q < k(248.6) ? lp(bolsa, alto, tr(q, k(242.8), k(243.6))) : lp(alto, muestra, tr(q, k(248.6), k(249.2)) - tr(q, k(251.2), k(251.9)));
  // v4g: 2 sub-tomas (fundido 6). Theo actúa: en «still in date» gira hacia el frasco con esperanza; al final estira la mano y lo toma.
  const gente = (
    <>
      <Silla x={2380} piso={P} alto={100} respaldo={false} />
      <Silla x={2700} piso={P} alto={100} respaldo={false} dir={-1} />
      <BolsaFarm x={2430} y={MT - 52} />
      <PjM look={JUNE_INV} ruta={[{ f: 0, x: 2380, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={AS_TAB} seed={2}
        poses={[{ f: 0, v: "sentado" }, { f: k(247.42), v: { tronco: 6, cabeza: 8 } }, { f: k(248.8), v: { tronco: 14, cabeza: 4 } }, { f: k(251.2), v: { tronco: 0, cabeza: -4 } }]}
        caras={[{ f: 0, v: "determinado" }, { f: k(243.9), v: "feliz" }, { f: k(247.42), v: "v3g_serio" }, { f: k(248.8), v: "duda" }, { f: k(250.92), v: "determinado" }, { f: k(251.2), v: "feliz" }]}
        miradas={[{ f: 0, v: { x: 0.8, y: 0.6 } }, { f: k(243.2), v: { x: 0.7, y: -0.3 } }, { f: k(246.3), v: { x: 0.4, y: -0.8 } }, { f: k(248.8), v: { x: 1, y: 0 } }]}
        habla={[[k(250.9), k(251.6)]]}
        ik={(q) => ({ D: manoJ(q), wD: 1 })}
        mundo={(j, q) => q >= k(242.7) && q < k(251.55) ? <FrascoW x={j.manoD.x + 4} y={j.manoD.y - 6} s={1.1} rot={q > k(246.2) && q < k(247.0) ? 14 * Math.sin((q - k(246.2)) / 3) : 0} /> : null} />
      <PjM look={THEO_CASA} ruta={[{ f: 0, x: 2700, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={AS_TAB}
        poses={[{ f: 0, v: "sentado" }, { f: k(244.4), v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 40, cD: 130 } }, { f: k(246.3), v: { tronco: -6, cabeza: -10, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 30, cD: 60 } }, { f: k(248.9), v: { tronco: 16, cabeza: 10, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 40, cD: 130 } }, { f: k(251.2), v: { tronco: -4, cabeza: -6, pI: 88, rI: 88, pD: 92, rD: 92, hI: 20, cI: 40 } }]}
        caras={[{ f: 0, v: "triste" }, { f: k(244.3), v: "duda" }, { f: k(246.3), v: "sorpresa" }, { f: k(246.9), v: "feliz" }, { f: k(248.9), v: "duda" }, { f: k(251.2), v: "feliz" }]}
        miradas={[{ f: 0, v: { x: 1, y: -0.3 } }, { f: k(246.3), v: { x: 1, y: -0.5 } }, { f: k(248.9), v: { x: 1, y: 0.4 } }, { f: k(251.2), v: { x: 1, y: 0.1 } }]}
        ik={(q) => ({ D: { x: 2585, y: P - 250 }, wD: tr(q, k(251.2), k(251.6)) })}
        mundo={(j, q) => <>
          <MejillaV4 j={j} k={1} f={q} latido={0.4} />
          {q >= k(251.55) && <FrascoW x={j.manoD.x - 4} y={j.manoD.y - 6} s={1.1} />}
        </>} />
    </>
  );
  const tomaA = (
    <EscenaNB Set={Living} pal={PAL} seed={53} setProps={{ ...LIVN, vela: true }}
      claves={[mira(0, 2540, P - 290, 1.6), mira(k(243.6), 2520, P - 280, 2.0, { curva: "inout" }), mira(k(245.8), 2520, P - 280, 2.1)]}
      medio={gente} />
  );
  const tomaB = (
    <EscenaNB Set={Living} pal={PAL} seed={53} setProps={{ ...LIVN, vela: true }}
      claves={[mira(k(246.0), 2470, P - 300, 1.65), mira(k(248.5), 2480, P - 300, 1.7, { curva: "inout" }), mira(k(250.9), 2530, P - 285, 1.95, { curva: "inout" })]}
      medio={gente} />
  );
  return (
    <AbsoluteFill>
      <Tomas cortes={[k(246.0)]} tomas={[tomaA, tomaB]} />
      <Pildora texto="ANTIBIOTICS · WHAT DENTISTS PRESCRIBE" x={960} y={110} desde={k(243.9)} hasta={k(246.0)} color={AMBAR} tam={40} />
      {/* el gráfico en la pared libre sobre la mesa: caja completa entre y 95 y 390 (nada cortado arriba) */}
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }} opacity={tr(f, k(246.1), k(246.5))}>
        <g transform="translate(560,138) scale(0.55)">
          <GraficoPotencia x={0} y={0} p={tr(f, k(247.4), k(250.6))} fecha={tr(f, k(246.2), k(246.7))} corte={tr(f, k(250.7), k(251.1))} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 54 · el consultorio dental: la puerta se abre, entra; corte; sale con unas pinzas ----------
export const P54Pinzas: React.FC = () => {
  const f = useF();
  const k = kDe(252.28);
  const X = SUP_PUNTOS.dentista, S = SUP_PISO;
  const C1 = k(254.24), C2 = k(255.46);
  // v4g: 3 sub-tomas con fundido de 6 (antes: corte seco + cámara que saltaba). June sale por DELANTE del marco, la hoja gira, luz fría sobre ella.
  const puerta = (abre: number, interior: number) => (
    <g transform={`translate(${X},${S})`}>
      <rect x={-60} y={-250} width={120} height={250} fill="#0d1016" stroke="#e8e2d8" strokeWidth={8} />
      {interior > 0 && <><circle cx={-6} cy={-150} r={70} fill="#9fd3ff" opacity={0.10 * interior} /><rect x={-40} y={-120} width={36} height={60} rx={6} fill="#2c3a4a" opacity={interior} /><rect x={-34} y={-150} width={24} height={30} rx={4} fill="#3d5266" opacity={interior} /></>}
      <g transform={`translate(56,0) scale(${1 - 0.82 * abre},1) translate(-56,0)`}>
        <rect x={-56} y={-246} width={112} height={246} fill="#2a3440" />
        <rect x={-46} y={-236} width={92} height={150} fill="#141a22" />
        <rect x={-52} y={-130} width={22} height={8} rx={3} fill="#c8ccd4" />
      </g>
    </g>
  );
  const SP = { hora: "dia", luces: 0, nieve: 1 };
  const tomaA = (
    <EscenaNB Set={Superior} pal={PAL} seed={54} setProps={SP}
      claves={[mira(0, X - 330, S - 400, 1.45), mira(k(253.9), X - 170, S - 400, 1.55, { curva: "inout" })]}
      medio={<>
        {puerta(tr(f, k(253.5), k(253.85)), tr(f, k(253.6), k(254.0)))}
        <PjM look={JUNE_INV} seed={2} luz={BORDE_FRIO}
          ruta={[{ f: 0, x: X - 600, y: S }, { f: k(253.4), x: X - 165 }]}
          dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: k(253.4), v: { tronco: 4 } }, { f: k(253.9), v: { tronco: 10, cabeza: 6 } }]}
          caras={[{ f: 0, v: "determinado" }, { f: k(253.66), v: "duda" }, { f: k(253.95), v: "sorpresa" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(253.5), v: { x: 1, y: -0.3 } }, { f: k(253.95), v: { x: 1, y: 0.2 } }]}
          ik={(q) => ({ D: { x: X + 56 - 108 * (1 - 0.82 * tr(q, k(253.5), k(253.85))) + 10, y: S - 126 }, wD: tr(q, k(253.2), k(253.5)) })} />
      </>} />
  );
  // B: plano general quieto del frente, la puerta abierta y el interior oscuro: pasa el tiempo
  const tomaB = (
    <EscenaNB Set={Superior} pal={PAL} seed={54} setProps={SP}
      claves={[mira(C1, X - 230, S - 420, 1.3), mira(C2, X - 200, S - 410, 1.36, { curva: "inout" })]}
      medio={<>
        {puerta(0.85, 1)}
        {/* la linterna de June se mueve adentro */}
        <circle cx={X - 10 + 26 * Math.sin((f - C1) / 9)} cy={S - 150 + 10 * Math.cos((f - C1) / 7)} r={22} fill="#fff4c8" opacity={0.55} />
      </>} />
  );
  const xs = (q: number) => interpolate(q, [C2, k(256.3), k(257.2)], [X + 30, X - 230, X - 330], cl);
  const tomaC = (
    <EscenaNB Set={Superior} pal={PAL} seed={54} setProps={SP}
      claves={[mira(C2, X - 210, S - 360, 1.7), mira(k(256.6), X - 300, S - 360, 1.7, { curva: "inout" }), mira(k(257.9), X - 320, S - 330, 2.2, { curva: "inout" })]}
      medio={<>
        {puerta(1 - tr(f, k(256.4), k(256.9)), 1 - tr(f, k(256.4), k(256.9)))}
        <Halo x={xs(f)} y={S - 200} r={260} color="#dfeaff" fuerza={0.35} />
        <PjM look={JUNE_INV} seed={2} luz={BORDE_FRIO}
          ruta={[{ f: C2, x: X + 30, y: S }, { f: k(256.3), x: X - 230 }, { f: k(257.2), x: X - 330 }]}
          dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: "parado" }, { f: k(256.12), v: { tronco: 10, cabeza: 14 } }, { f: k(257.44), v: { tronco: 4, cabeza: 6 } }, { f: k(258.3), v: { tronco: 8, cabeza: 12 } }]}
          caras={[{ f: 0, v: "determinado" }, { f: k(256.12), v: "triste" }, { f: k(257.44), v: "v3g_serio" }, { f: k(258.0), v: "miedo" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(256.2), v: { x: 0.8, y: 0.6 } }, { f: k(257.5), v: { x: 0.4, y: 0.2 } }, { f: k(258.3), v: { x: 0.9, y: 0.7 } }]}
          ik={(q) => ({ D: { x: xs(q) - 60, y: S - 200 - 20 * tr(q, k(257.4), k(257.9)) }, wD: tr(q, C2, k(255.8)) })}
          mundo={(j) => <PinzasW x={j.manoD.x} y={j.manoD.y} rot={-70} s={1.1} />} />
      </>} />
  );
  return (
    <AbsoluteFill>
      <Tomas cortes={[C1, C2]} tomas={[tomaA, tomaB, tomaC]} />
      <Pildora texto="DENTAL OFFICE · SUPERIOR STREET" x={1250} y={110} desde={k(253.4)} hasta={k(255.3)} color={AMBAR} tam={40} />
      <Pildora texto="DENTAL FORCEPS" x={1300} y={110} desde={k(256.6)} color={AMBAR} tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 55 · a la luz de la vela: cuatro minutos (v3g: los dos grandes, la vela atrás, las sombras en la pared) ----------
export const P55Vela: React.FC = () => {
  const f = useF();
  const k = kDe(259.28);
  const XT = 2400, XJ = 2245;
  const min = interpolate(f, [k(262.0), k(262.9)], [0, 4], cl);
  const tira = (q: number) => q > k(259.9) ? 4 * Math.abs(Math.sin(q * 0.9)) : 0;
  const theo: Parameters<typeof PjM>[0] = {
    look: THEO_CASA, ruta: [{ f: 0, x: XT, y: P }], dir: [{ f: 0, v: -1 }], asiento: AS_TAB,
    poses: [{ f: 0, v: { tronco: -8, cabeza: -16, pI: 88, rI: 88, pD: 92, rD: 92, hI: 30, cI: 80, hD: 30, cD: 80 } }, { f: k(259.98), v: { tronco: -14, cabeza: -22, pI: 88, rI: 88, pD: 92, rD: 92, hI: 70, cI: 60, hD: 60, cD: 60 } }, { f: k(261.06), v: { tronco: -4, cabeza: -10, pI: 88, rI: 88, pD: 92, rD: 92, hI: 20, cI: 90, hD: 20, cD: 90 } }, { f: k(262.6), v: { tronco: -8, cabeza: -14, pI: 88, rI: 88, pD: 92, rD: 92, hI: 60, cI: 40, hD: 20, cD: 90 } }],
    caras: [{ f: 0, v: "miedo" }, { f: k(259.66), v: "v3g_boca" }, { f: k(260.48), v: "v3g_dolor" }, { f: k(262.6), v: "miedo" }],
    miradas: [{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(259.7), v: { x: 0.4, y: -0.8 } }, { f: k(262.6), v: { x: 1, y: 0.2 } }],
  };
  // v4g: las pinzas a la altura de la BOCA (rot 90 = puntas hacia Theo), la mano de June sale de la boca real de Theo cuadro a cuadro
  const bocaDe = (q: number) => juntas(theo, q, 30).boca;
  const june: Parameters<typeof PjM>[0] = {
    look: JUNE, ruta: [{ f: 0, x: XJ, y: P }], dir: [{ f: 0, v: 1 }], seed: 2,
    poses: [{ f: 0, v: { tronco: 8, cabeza: 6 } }, { f: k(259.98), v: { tronco: -6, cabeza: 0 } }, { f: k(261.06), v: { tronco: -12, cabeza: -6 } }, { f: k(262.6), v: { tronco: 4, cabeza: 8 } }],
    caras: [{ f: 0, v: "determinado" }, { f: k(259.98), v: "v3g_serio" }, { f: k(261.06), v: "enojo" }, { f: k(262.4), v: "cansado" }],
    miradas: [{ f: 0, v: { x: 1, y: 0.1 } }, { f: k(261.1), v: { x: 1, y: 0.3 } }, { f: k(262.6), v: { x: 1, y: -0.1 } }],
    ik: (q) => { const b = bocaDe(q); return { D: { x: b.x - 44 - tira(q), y: b.y + 2 }, wD: tr(q, k(259.4), k(259.8)) }; },
  };
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={55} setProps={{ ...LIVN, vela: false, fuego: 0.45 }}
        claves={[mira(0, 2330, 570, 1.85), mira(k(260.4), 2320, 565, 1.9, { curva: "inout" }), mira(k(261.2), 2300, 560, 1.75, { curva: "inout" }), mira(k(263.32), 2305, 570, 1.82, { curva: "inout" })]}
        medio={<>
          {/* las sombras de los dos, grandes en la pared (la vela está atrás, a la derecha) */}
          <SombraPj pj={june} ox={-150} oy={-60} s={1.5} o={0.42} />
          <SombraPj pj={theo} ox={-160} oy={-60} s={1.5} o={0.42} />
          <RelojPared x={2300} y={360} r={50} min={min} hora={10} />
          <Silla x={XT} piso={P} alto={100} respaldo={false} dir={-1} />
          <PjM {...theo} mundo={(j, q) => <MejillaV4 j={j} k={1} f={q} latido={0.7} />} />
          <PjM {...june} mundo={(j) => <PinzasW x={j.manoD.x} y={j.manoD.y} rot={90} s={1.0} />} />
          <VelaW x={2580} y={P - 176} f={f} alto={56} />
        </>} />
      <Pildora texto="WE'LL SKIP THE DETAILS" x={1460} y={110} desde={k(260.7)} hasta={k(262.0)} color="#f6ecd2" tam={40} />
      <Temporizador seg={min * 60} x={1340} y={110} desde={k(262.1)} tam={52} color="#ff8a6a" />
    </AbsoluteFill>
  );
};

// ---------- 56 · los 4 minutos más largos de SU vida; June no dice nada; se lava las manos en la nieve ----------
export const P56Nieve: React.FC = () => {
  const f = useF();
  const k = kDe(263.32);
  // v4g: 3 sub-tomas con fundido de 6 (antes: cortes secos = tirón). Inserto con manos de verdad (manga + puño + dedos).
  const tomaC = (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(960,560) scale(${interpolate(f, [k(267.1), k(269.16)], [1, 1.06], cl)}) translate(-960,-560)`}>
          <ManosNieveV4 f={f} manga="#2f7f86" frota={tr(f, k(267.1), k(267.4))} />
        </g>
      </svg>
    </AbsoluteFill>
  );
  const X = 1700;
  const tomaD = (
      <AbsoluteFill>
        <EscenaNB Set={Barrio} pal={PAL} seed={57} setProps={{ hora: "noche", luces: 0, nieve: 1, cae: true, humo: 0.5 }}
          claves={[mira(k(269.16), X + 30, B - 80, 2.1), mira(k(269.9), X + 30, B - 80, 2.1), mira(k(270.8), X + 10, B - 90, 2.25, { curva: "inout" })]}
          medio={<PjM look={JUNE} ruta={[{ f: 0, x: X, y: B }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 0 }]} seed={2} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "arrodillado" }, { f: k(269.5), v: { tronco: 22, cabeza: 18 } }, { f: k(270.1), v: { tronco: 10, cabeza: -10 } }]}
            caras={[{ f: 0, v: "triste" }, { f: k(269.5), v: "cansado" }, { f: k(270.1), v: "v3g_mirada" }]}
            miradas={[{ f: 0, v: { x: 0.8, y: 1 } }, { f: k(270.1), v: { x: 1, y: -0.2 } }]}
            ik={(q) => { const t = Math.sin(q * 0.55) * (1 - tr(q, k(270.0), k(270.3))); return { D: { x: X + 74 + 12 * t, y: B - 46 - 6 * Math.abs(t) }, I: { x: X + 66 - 12 * t, y: B - 50 }, wD: 1, wI: 1 }; }}
            mundo={(j, q) => <>{[0, 1, 2].map((i) => { const c = ((q / 26 + i / 3) % 1); return <circle key={i} cx={j.boca.x + j.dir * (10 + c * 50)} cy={j.boca.y - c * 30} r={8 + c * 20} fill="#eef2fa" opacity={0.45 * (1 - c)} />; })}{Array.from({ length: 6 }).map((_, i) => <circle key={`n${i}`} cx={j.manoD.x + Math.sin(q / 3 + i) * 20} cy={j.manoD.y + 10 - ((q * 1.5 + i * 7) % 24)} r={3} fill="#fff" opacity={0.8} />)}</>} />} />
      </AbsoluteFill>
  );
  // A + B: en la mesa; Theo con el trapo en la cara habla, June no dice nada
  const XT = 2400, XJ = 2650;
  const tomaAB = (
      <EscenaNB Set={Living} pal={PAL} seed={56} setProps={{ ...LIVN, vela: true, fuego: 0.5 }}
        claves={[mira(0, 2520, 650, 2.0), mira(k(265.6), 2520, 650, 2.0), mira(k(266.3), 2560, 640, 2.25, { curva: "inout" })]}
        medio={<>
          <Silla x={XT} piso={P} alto={100} respaldo={false} />
          <Silla x={XJ} piso={P} alto={100} respaldo={false} dir={-1} />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: XT, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={AS_TAB}
            poses={[{ f: 0, v: { tronco: 16, cabeza: 12 } }, { f: k(264.12), v: { tronco: 6, cabeza: -4 } }, { f: k(265.3), v: { tronco: 14, cabeza: 14 } }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(264.12), v: "v3g_dolor" }, { f: k(265.3), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 0.6, y: 0.8 } }, { f: k(263.6), v: { x: 1, y: 0 } }, { f: k(265.4), v: { x: 0.6, y: 0.7 } }]}
            habla={[[k(263.5), k(265.4)]]}
            ik={() => ({ D: { x: XT + 44, y: P - 224 }, wD: 1 })}
            mundo={(j) => <><MejillaV4 j={j} k={0.85} f={f} /><path d={`M${j.manoD.x - 18},${j.manoD.y - 22} q22,-8 36,6 q-4,26 -30,28 Z`} fill="#e8e2d6" /></>} />
          <PjM look={JUNE} ruta={[{ f: 0, x: XJ, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={AS_TAB} seed={2}
            poses={[{ f: 0, v: { tronco: 4, cabeza: 0, hI: 20, cI: 90, hD: 20, cD: 90 } }, { f: k(266.08), v: { tronco: 10, cabeza: 10, hI: 30, cI: 120, hD: 30, cD: 120 } }, { f: k(266.6), v: { tronco: 14, cabeza: 18, hI: 30, cI: 120, hD: 30, cD: 120 } }]}
            caras={[{ f: 0, v: "v3g_serio" }, { f: k(266.08), v: "cansado" }, { f: k(266.6), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.1 } }, { f: k(266.32), v: { x: 0.5, y: 0.9 } }]} />
        </>} />
  );
  return (
    <AbsoluteFill>
      <Tomas cortes={[k(267.1), k(269.16)]} tomas={[tomaAB, tomaC, tomaD]} />
      <Pildora texto="THE LONGEST 4 MINUTES OF HIS LIFE" x={960} y={110} desde={k(264.1)} hasta={k(265.9)} color={AMBAR} tam={40} />
      <Pildora texto="JUNE SAYS NOTHING" x={960} y={110} desde={k(266.32)} hasta={k(267.1)} color="#cfc8e8" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 57 · diez días después: la hinchazón se fue (día 100) — afuera, de día, cielo libre ----------
export const P57Sonrie: React.FC = () => {
  const f = useF();
  const k = kDe(271.3);
  const XT = 1480, XJ = 1650;
  const nube = tr(f, k(275.58), k(276.2));
  const hin = 0.45 * (1 - tr(f, k(272.0), k(272.9)));
  // v4g: sin giros de dir (eran espejos de 1 cuadro); al final June le apoya la mano en el hombro y Theo baja la mirada hacia otro lado
  const theo: Parameters<typeof PjM>[0] = {
    look: THEO_INV, ruta: [{ f: 0, x: XT, y: B }], dir: [{ f: 0, v: 1 }],
    caras: [{ f: 0, v: "duda" }, { f: k(272.58), v: "sorpresa" }, { f: k(273.04), v: "risa" }, { f: k(274.0), v: "feliz" }, { f: k(275.58), v: "v3g_serio" }, { f: k(276.2), v: "triste" }],
    miradas: [{ f: 0, v: { x: 1, y: 0 } }, { f: k(273.1), v: { x: 0.3, y: -0.3 } }, { f: k(274.0), v: { x: 1, y: 0.1 } }, { f: k(275.6), v: { x: -1, y: 0.5 } }],
    poses: [{ f: 0, v: { cabeza: -8 } }, { f: k(272.6), v: { cabeza: 2 } }, { f: k(273.04), v: "celebrar" }, { f: k(274.0), v: "manosCintura" }, { f: k(275.58), v: { tronco: 6, cabeza: 14, hI: 10, hD: 10 } }],
  };
  const hombro = (q: number) => juntas(theo, q, 30).hombro;
  return (
    <AbsoluteFill>
      <EscenaNB Set={Barrio} pal={PAL} seed={58} setProps={{ hora: "invierno", luces: 0, nieve: 1, cae: false, humo: 0.4 }}
        claves={[mira(0, 1570, B - 250, 1.85), mira(k(272.1), 1565, B - 250, 1.9, { curva: "inout" }), mira(k(272.7), 1530, B - 275, 2.45, { curva: "inout" }), mira(k(273.7), 1530, B - 275, 2.45), mira(k(274.4), 1570, B - 250, 1.9, { curva: "inout" }), mira(k(275.5), 1570, B - 250, 1.9), mira(k(276.84), 1555, B - 265, 2.2, { curva: "inout" })]}
        medio={<>
          <PjM {...theo} mundo={(j, q) => <MejillaV4 j={j} k={hin} f={q} />} />
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: XJ, y: B }]} seed={2}
            caras={[{ f: 0, v: "v3g_serio" }, { f: k(272.7), v: "feliz" }, { f: k(273.82), v: "determinado" }, { f: k(275.58), v: "triste" }, { f: k(276.2), v: "duda" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.1 } }, { f: k(273.9), v: { x: 0.5, y: 0.9 } }, { f: k(275.6), v: { x: 1, y: 0.1 } }, { f: k(276.3), v: { x: 1, y: 0.4 } }]}
            poses={[{ f: 0, v: "parado" }, { f: k(273.82), v: { tronco: 6, cabeza: 14 } }, { f: k(275.58), v: { tronco: 4, cabeza: -4 } }, { f: k(276.2), v: { tronco: 10, cabeza: 8 } }]}
            dir={[{ f: 0, v: -1 }]}
            ik={(q) => {
              if (q >= k(275.6)) { const h = hombro(q); return { D: { x: h.x + 10, y: h.y + 4 }, wD: tr(q, k(275.7), k(276.1)) }; }
              return {
                D: q < k(273.6) ? { x: XT + 40, y: B - 228 } : { x: XJ - 40, y: B - 170 }, wD: q < k(273.6) ? tr(q, k(271.4), k(271.9)) * (1 - tr(q, k(273.0), k(273.3))) : tr(q, k(273.6), k(273.9)) * (1 - tr(q, k(275.4), k(275.6))),
                I: { x: XJ - 60, y: B - 160 }, wI: tr(q, k(273.6), k(273.9)) * (1 - tr(q, k(275.4), k(275.6))),
              };
            }}
            mundo={(j, q) => q >= k(273.6) && q < k(275.6) ? <><CuadernoChico x={j.manoI.x} y={j.manoI.y - 8} rot={-80} s={0.6} roto={1} /><path d={`M${j.manoD.x},${j.manoD.y} l${-8 + 4 * Math.sin(q)},-30`} stroke="#e0a23a" strokeWidth={5} strokeLinecap="round" /></> : null} />
          <VeloOscuro o={0.3 * nube} color="#1a1c2e" />
        </>} />
      {/* píldoras sobre la pared de ladrillo (lejos del farol y de las cabezas); ancho = el del texto */}
      <Pildora texto="10 DAYS LATER" x={1420} y={100} desde={k(271.3)} hasta={k(272.5)} color={AMBAR} tam={40} />
      <Pildora texto="SWELLING: GONE" x={1420} y={100} desde={k(272.6)} hasta={k(273.8)} color="#7ad08a" tam={40} />
      <Pildora texto="THEN THE PROBLEM CHANGES" x={1420} y={100} desde={k(275.6)} color="#cfc8e8" tam={38} />
    </AbsoluteFill>
  );
};

// ---------- 58 · no es el frío: es el silencio (la cuerda de la charla se aplana) ----------
export const P58Silencio: React.FC = () => {
  const f = useF();
  const k = kDe(276.84);
  const XT = 700, XJ = 1100;
  const amp = 1 - tr(f, k(278.28), k(279.2));
  const apaga = tr(f, k(280.96), k(281.5));
  const bocaT = { x: XT + 40, y: COL - 118 }, bocaJ = { x: XJ - 40, y: COL - 118 };
  // v4g: sin giros de dir (eran el tirón de 279,7 / 279,93): el silencio se actúa con la mirada que se va y el cuerpo que se cierra
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={59} setProps={{ ...LIVN, hora: "invierno", fuego: 0.8, lena: 0 }}
        claves={[mira(0, 900, 650, 1.8), mira(k(281.4), 900, 650, 1.8), mira(k(282.5), 900, 700, 1.95, { curva: "inout" }), mira(k(284.2), 905, 705, 2.0, { curva: "inout" })]}
        medio={<>
          <PilaV4 filas={4} />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: XT, y: COL }]} asiento={AS_PISO}
            dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(279.56), v: { tronco: 20, cabeza: 18, pI: 85, rI: 0, pD: 70, rD: 95, hI: 40, cI: 110, hD: 45, cD: 115 } }, { f: k(282.82), v: { tronco: 10, cabeza: -6, pI: 85, rI: 0, pD: 70, rD: 95, hI: 45, cI: 140, hD: 45, cD: 140 } }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(278.3), v: "neutral" }, { f: k(279.56), v: "triste" }, { f: k(282.82), v: "v3g_mirada" }]}
            habla={[[k(277.0), k(278.1)]]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(279.6), v: { x: -0.9, y: 0.8 } }, { f: k(282.9), v: { x: 0.2, y: -0.6 } }]}
            mundo={(j, q) => <Garabato x={j.cabeza.x} y={j.cabeza.y - 84} p={tr(q, k(282.82), k(283.8))} f={q} s={1.1} />} />
          <PjM look={JUNE} ruta={[{ f: 0, x: XJ, y: COL }]} asiento={AS_PISO} seed={2}
            dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(279.82), v: { tronco: 14, cabeza: 14, pI: 50, rI: 120, pD: 55, rD: 125, hI: 40, cI: 100, hD: 45, cD: 100 } }, { f: k(281.52), v: { tronco: 22, cabeza: 22, pI: 50, rI: 120, pD: 55, rD: 125, hI: 50, cI: 110, hD: 50, cD: 110 } }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(278.3), v: "neutral" }, { f: k(279.82), v: "triste" }, { f: k(281.52), v: "cansado" }]}
            habla={[[k(277.3), k(278.2)]]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(279.9), v: { x: -0.9, y: 0.5 } }, { f: k(281.6), v: { x: -0.3, y: 1 } }]} />
          <CuerdaVoz a={bocaT} b={bocaJ} amp={amp} f={f} o={1 - tr(f, k(279.4), k(279.7))} corte={tr(f, k(279.0), k(279.4))} />
          <VeloOscuro o={0.32 * apaga} />
        </>} />
      {/* entre la alarma de CO y la ventana */}
      <Pildora texto="IT'S NOT THE COLD" x={1030} y={110} desde={k(276.9)} hasta={k(277.7)} color="#9fd3ff" tam={40} />
      <Pildora texto="THE SILENCE" x={1030} y={110} desde={k(278.28)} hasta={k(281.4)} color="#cfc8e8" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 59 · los investigadores polares de la Antártida (cortes secos a cada síntoma) ----------
export const P59Antartida: React.FC = () => {
  const k = kDe(284.2);
  const S = 900;
  const xs = [620, 960, 1300];
  const C = [k(285.9), k(287.68), k(288.76), k(289.42), k(291.16)];
  // v4g: 6 sub-tomas con fundido de 6 (antes: cortes de cámara de 1 cuadro = tirón); una sola píldora por vez; contador de días a oscuras
  const gente = (
    <>
      <PjM look={PARKA_A} ruta={[{ f: 0, x: xs[0], y: S }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: "parado" }, { f: k(286.6), v: { cabeza: 8 } }, { f: k(287.68), v: "manosCara" }, { f: k(288.3), v: { tronco: 8, cabeza: 14, hI: 10, hD: 10 } }, { f: k(291.16), v: "firme" }]}
        caras={[{ f: 0, v: "neutral" }, { f: k(286.6), v: "cansado" }, { f: k(287.68), v: "v3g_dormido" }, { f: k(288.2), v: "v3g_boca" }, { f: k(288.6), v: "cansado" }, { f: k(291.16), v: "v3g_mirada" }]}
        miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(286.6), v: { x: 0.6, y: 0.6 } }, { f: k(291.16), v: { x: 0, y: 0 } }]}
        extra={(p, q) => q >= k(287.68) && q < k(288.3) ? { ...p, cI: (p.cI ?? 0) + 14 * Math.sin(q * 0.9), cD: (p.cD ?? 0) - 14 * Math.sin(q * 0.9) } : p} />
      <PjM look={PARKA_B} ruta={[{ f: 0, x: xs[1], y: S }]} dir={[{ f: 0, v: -1 }]} seed={2}
        poses={[{ f: 0, v: "parado" }, { f: k(286.9), v: { cabeza: -6 } }, { f: k(288.76), v: "brazosCruzados" }, { f: k(289.1), v: "manosCintura" }, { f: k(291.16), v: "firme" }]}
        caras={[{ f: 0, v: "neutral" }, { f: k(286.9), v: "duda" }, { f: k(288.76), v: "enojo" }, { f: k(291.16), v: "v3g_mirada" }]}
        habla={[[k(288.8), k(289.3)]]}
        miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(286.9), v: { x: -1, y: 0.1 } }, { f: k(288.8), v: { x: 1, y: 0.2 } }, { f: k(291.16), v: { x: 0, y: 0 } }]} />
      <PjM look={PARKA_C} ruta={[{ f: 0, x: xs[2], y: S }]} dir={[{ f: 0, v: -1 }]} seed={3}
        caras={[{ f: 0, v: "neutral" }, { f: k(289.42), v: "duda" }, { f: k(290.1), v: "sorpresa" }, { f: k(290.66), v: "duda" }, { f: k(291.16), v: "v3g_mirada" }]}
        miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(289.5), v: { x: 0.5, y: 0.8 } }, { f: k(290.66), v: { x: -0.4, y: -0.6 } }, { f: k(291.16), v: { x: 0, y: 0 } }]}
        poses={[{ f: 0, v: "parado" }, { f: k(290.66), v: { cabeza: -10, hI: 20, cI: 40 } }, { f: k(291.16), v: "firme" }]}
        ik={(q) => ({ I: { x: xs[2] - 40, y: S - 200 }, wI: tr(q, k(289.4), k(289.8)) * (1 - tr(q, k(290.5), k(290.8))), D: { x: xs[2] - 52, y: S - 222 }, wD: tr(q, k(289.5), k(289.9)) * (1 - tr(q, k(290.5), k(290.8))) })}
        mundo={(j, q) => <RelojPulsera x={j.manoI.x} y={j.manoI.y} f={q} o={tr(q, k(289.5), k(289.8)) * (1 - tr(q, k(290.5), k(290.7)))} loco={tr(q, k(289.8), k(290.1))} s={0.9} />} />
    </>
  );
  const toma = (claves: ReturnType<typeof mira>[]) => <EscenaNB Set={SetAntartida} pal={PAL} seed={60} claves={claves} medio={gente} />;
  const io = { curva: "inout" as const };
  const tomas = [
    toma([mira(0, 960, 540, 1.0), mira(C[0], 960, 560, 1.08, io)]),
    toma([mira(C[0], 960, 690, 1.5), mira(C[1], 960, 690, 1.58, io)]),
    toma([mira(C[1], 660, 700, 2.3), mira(C[2], 650, 700, 2.36, io)]),
    toma([mira(C[2], 960, 700, 2.0), mira(C[3], 960, 700, 2.05, io)]),
    toma([mira(C[3], 1280, 700, 2.3), mira(C[4], 1290, 700, 2.4, io)]),
    toma([mira(C[4], 960, 720, 1.7), mira(k(293.5), 960, 705, 1.88, io)]),
  ];
  const P = (t: string, a: number, b: number | undefined, c: string) => <Pildora texto={t} x={860} y={110} desde={a} hasta={b} color={c} tam={40} />;
  return (
    <AbsoluteFill>
      <Tomas cortes={C} tomas={tomas} />
      {P("POLAR RESEARCHERS · ANTARCTICA", k(284.3), C[1], "#9fd3ff")}
      {P("TROUBLE SLEEPING", C[1], C[2], "#9fd3ff")}
      {P("IRRITABILITY", C[2], C[3], "#e2483a")}
      {P("LOSING TRACK OF TIME", C[3], C[4], AMBAR)}
      {P("STARING FOR HOURS", C[4], undefined, "#cfc8e8")}
      <Contador lineas={[{ etiqueta: "DAYS IN THE DARK", claves: [{ f: 0, v: 0 }, { f: C[0], v: 120, d: k(291.0) - C[0] }], color: "#9fd3ff" }]} x={160} y={96} tam={36} alinear="der" desde={C[0]} />
    </AbsoluteFill>
  );
};

// ---------- 60 · la mirada: Theo frente a la ventana; June le habla y él no contesta ----------
export const P60Mirada: React.FC = () => {
  const f = useF();
  const k = kDe(293.5);
  const XT = 950;
  // v4g: empuje continuo hacia Theo; June le habla (295) y él no contesta; la mano de Theo apenas hacia la ventana; avioneta tachada en el cielo
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={61} setProps={{ ...LIVN, hora: "invierno", nieveAfuera: 1, cae: true, fuego: 0.6, lena: 0 }}
        claves={[mira(0, 860, 640, 1.7), mira(k(298.89), 920, 600, 2.0, { curva: "inout" })]}
        medio={<>
          <PilaV4 />
          <AvionTachado x={1160} y={500} o={tr(f, k(297.33), k(297.6))} tacha={tr(f, k(297.9), k(298.3))} s={0.9} />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: XT, y: P }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: "firme" }, { f: k(295.2), v: { tronco: 2, cabeza: -4, hI: 6, hD: 6 } }, { f: k(296.69), v: { tronco: 4, cabeza: 6, hI: 6, hD: 6 } }, { f: k(298.2), v: { tronco: 8, cabeza: 14, hI: 6, hD: 6 } }]}
            caras={[{ f: 0, v: "v3g_mirada" }, { f: k(295.4), v: "neutral" }, { f: k(296.2), v: "v3g_mirada" }, { f: k(297.85), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(295.3), v: { x: -0.6, y: 0.3 } }, { f: k(295.9), v: { x: 1, y: -0.1 } }, { f: k(297.9), v: { x: 1, y: 0.5 } }]}
            ik={(q) => ({ D: { x: XT + 110, y: P - 300 }, wD: tr(q, k(297.1), k(297.5)) * (1 - tr(q, k(298.2), k(298.6))) })} />
          <PjM look={JUNE} ruta={[{ f: 0, x: 680, y: COL }]} asiento={AS_PISO} dir={[{ f: 0, v: 1 }]} seed={2}
            poses={[{ f: 0, v: { tronco: 10, cabeza: 6, pI: 85, rI: 0, pD: 70, rD: 95, hI: 45, cI: 120, hD: 50, cD: 120 } }, { f: k(294.8), v: { tronco: -4, cabeza: -6, pI: 85, rI: 0, pD: 70, rD: 95, hI: 60, cI: 60, hD: 50, cD: 120 } }, { f: k(295.6), v: { tronco: -8, cabeza: -10, pI: 85, rI: 0, pD: 70, rD: 95, hI: 80, cI: 40, hD: 50, cD: 120 } }, { f: k(296.4), v: { tronco: 22, cabeza: 22, pI: 85, rI: 0, pD: 70, rD: 95, hI: 45, cI: 120, hD: 50, cD: 120 } }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(294.8), v: "duda" }, { f: k(295.6), v: "sorpresa" }, { f: k(296.4), v: "triste" }]}
            habla={[[k(295.0), k(295.9)]]}
            miradas={[{ f: 0, v: { x: 0.4, y: 0.9 } }, { f: k(294.8), v: { x: 1, y: -0.4 } }, { f: k(296.4), v: { x: 0.4, y: 1 } }]} />
        </>} />
      {/* entre la alarma de CO y la ventana, lejos de los dos */}
      <Pildora texto="THE STARE" x={920} y={110} desde={k(294.0)} hasta={k(296.5)} color="#cfc8e8" tam={40} />
      <Pildora texto="NO STATION" x={920} y={110} desde={k(296.69)} color="#e2483a" tam={36} />
      <Pildora texto="NO PLANE IN SPRING" x={920} y={185} desde={k(297.33)} color="#e2483a" tam={36} />
    </AbsoluteFill>
  );
};

// ---------- 61 · nadie viene, nunca: contraplano en el mirador, miran el lago vacío (cielo libre para el texto) ----------
export const P61Nadie: React.FC = () => {
  const f = useF();
  const k = kDe(298.89);
  // v4h: contraplano cerrado (no el general del puente de P04/P09): de perfil, mirando la ciudad muerta (a la derecha),
  // de cintura para arriba; el texto en el cielo de la izquierda, detrás de ellos.
  return (
    <AbsoluteFill>
      <EscenaNB Set={Panorama} pal={PAL} seed={61} setProps={{ hora: "invierno", luces: 0, ventana: 0, nieve: 1, cae: true, vapor: 0.8 }}
        claves={[mira(0, 1010, 640, 2.3), mira(k(300.87), 1030, 630, 2.45, { curva: "inout" })]}
        medio={<>
          <PjM look={THEO_INV} ruta={[{ f: 0, x: 900, y: 900 }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "manosCintura" }, { f: k(299.9), v: { cabeza: 14, tronco: 5, hI: 20, cI: 40, hD: 25, cD: 45 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(299.3), v: "duda" }, { f: k(300.0), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.15 } }, { f: k(299.6), v: { x: -1, y: 0 } }, { f: k(300.1), v: { x: 1, y: 0.8 } }]} />
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: 1090, y: 900 }]} dir={[{ f: 0, v: 1 }]} seed={2} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "brazosCruzados" }, { f: k(299.95), v: "encogerse" }]}
            caras={[{ f: 0, v: "duda" }, { f: k(299.4), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: -0.1 } }, { f: k(299.5), v: { x: -1, y: 0.1 } }, { f: k(300.0), v: { x: 1, y: 0.7 } }]} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Rot x={760} y={170} t="NOBODY IS COMING." o={aparece(f, k(298.95))} tam={52} />
        <Rot x={1330} y={170} t="EVER." o={aparece(f, k(299.97))} tam={60} color="#ff6a5a" borde="#e2483a" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 62 · la tercera regla: una cosa por día, no para sobrevivir (June la escribe y la encierra en un círculo) ----------
export const P62Regla3: React.FC = () => {
  const f = useF();
  const k = kDe(300.87);
  if (f < k(302.0)) {
    return (
      <AbsoluteFill>
        <EscenaNB Set={Living} pal={PAL} seed={62} setProps={{ ...LIVN, hora: "dia", fuego: 0.4 }}
          claves={[mira(0, 3160, P - 360, 1.95)]}
          medio={<PjM look={JUNE} ruta={[{ f: 0, x: 2860, y: P }, { f: k(301.6), x: 3100 }]} dir={[{ f: 0, v: 1 }]} seed={2}
            caras={[{ f: 0, v: "determinado" }, { f: k(301.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(301.4), v: { x: 1, y: -0.8 } }]}
            ik={(q) => ({ D: { x: 3190, y: P - 300 }, wD: tr(q, k(301.4), k(301.9)) })}
            mundo={(j, q) => q > k(301.3) ? <path d={`M${j.manoD.x},${j.manoD.y} l10,-34`} stroke="#e0a23a" strokeWidth={5} strokeLinecap="round" /> : null} />} />
        <Pildora texto="RULE NUMBER 3" x={560} y={220} desde={k(301.0)} color={AMBAR} tam={40} />
      </AbsoluteFill>
    );
  }
  const X = 560, Y = 190, T = 60, W = 840;
  const d3 = k(302.95);
  const n = Math.min(20, Math.max(0, Math.floor((f - d3) / 1.6) + 1));
  const tipL = { x: X + 54 + n * T * 0.5, y: Y + 44 + 64 + 2 * T * 1.3 + T * 0.95 };
  const fin = d3 + 20 * 1.6;
  // después de escribir: la punta da la vuelta a la regla 3 (círculo rojo) y se va
  const E = { x: 890, y: 502, rx: 330, ry: 46 };
  const c0 = fin + 8, c1 = k(305.2);
  const pc = tr(f, c0, c1);
  const ang = -Math.PI * 0.95 + pc * Math.PI * 2;
  const enE = { x: E.x + E.rx * Math.cos(ang), y: E.y + E.ry * Math.sin(ang) };
  let tip = tipL;
  if (f > fin) tip = lp(tipL, { x: E.x + E.rx * Math.cos(-Math.PI * 0.95), y: E.y + E.ry * Math.sin(-Math.PI * 0.95) }, tr(f, fin, c0));
  if (f >= c0) tip = enE;
  if (f > c1) tip = lp(enE, { x: 1500, y: 980 }, tr(f, c1 + 2, c1 + 16));
  const g = tr(f, k(304.7), k(305.1));
  const arco = Array.from({ length: Math.max(2, Math.round(pc * 60)) }).map((_, i, a) => { const t = -Math.PI * 0.95 + (i / (a.length - 1)) * pc * Math.PI * 2; return `${(E.x + E.rx * Math.cos(t)).toFixed(1)},${(E.y + E.ry * Math.sin(t)).toFixed(1)}`; });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #d8d2c4 0%, #8a8478 90%)" }}>
      <NotaHeladera titulo="JUNE'S RULES" renglones={[{ t: "1. FRESH FOOD FIRST", desde: -999 }, { t: "2. NOTHING RISKY ALONE", desde: -999 }, { t: "3. ONE THING FOR FUN", desde: d3 }]} x={X} y={Y} w={W} tam={T} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {pc > 0 && <path d={`M${arco.join(" L")}`} stroke="#e2483a" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.9} transform={`rotate(-2 ${E.x} ${E.y})`} />}
        <ManoLapiz1 x={tip.x} y={tip.y} manga="#2f7f86" />
        <Rot x={760} y={800} t="EVERY DAY · NOT FOR SURVIVAL" o={g} tam={42} borde="#e2483a" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 63 · Theo lee en voz alta los libros de la biblioteca; June escucha ----------
export const P63Lee: React.FC = () => {
  const f = useF();
  const k = kDe(305.89);
  const XT = 800;
  const libro = { x: XT + 70, y: COL - 132 };
  const hoja = tr(f, k(307.2), k(307.75));
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={63} setProps={{ ...LIVN, hora: "invierno", lena: 0 }}
        claves={[mira(0, 900, P - 230, 1.95), mira(k(308.35), 890, P - 235, 2.1, { curva: "inout" })]}
        detras={<PilaLena x={40} piso={P} w={600} filas={7} seed="liv" />}
        medio={<>
          <PilaLibros x={680} piso={COL} n={6} />
          <PjM look={JUNE} ruta={[{ f: 0, x: 1120, y: COL }]} dir={[{ f: 0, v: -1 }]} asiento={AS_PISO} seed={2}
            poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(306.6), v: { ...POSES_V3H.sentadoSuelo, tronco: 10, cabeza: 10, hD: 30, cD: 140 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(306.6), v: "feliz" }, { f: k(307.9), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }]} />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: XT, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
            caras={[{ f: 0, v: "neutral" }, { f: k(306.1), v: "feliz" }, { f: k(307.0), v: "sorpresa" }, { f: k(307.9), v: "risa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.6 } }, { f: k(306.9), v: { x: 1, y: 0 } }, { f: k(307.3), v: { x: 1, y: 0.6 } }]}
            habla={[[k(306.1), k(307.0)], [k(307.8), k(308.35)]]}
            poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(306.9), v: { ...POSES_V3H.sentadoSuelo, tronco: -8, cabeza: -10 } }, { f: k(307.4), v: { ...POSES_V3H.sentadoSuelo, tronco: 2, cabeza: 6 } }]}
            ik={(q) => ({ D: { x: libro.x + 26, y: libro.y + 8 }, wD: 1, I: q > k(306.8) && q < k(307.2) ? { x: XT + 60, y: COL - 290 } : { x: libro.x - 22, y: libro.y + 10 }, wI: 1 })}
            mundo={() => (
              <g transform={`translate(${libro.x},${libro.y}) rotate(-10) scale(1.35)`}>
                <rect x={-42} y={-32} width={84} height={60} rx={3} fill="#3a5a8a" />
                <rect x={-38} y={-29} width={36} height={54} fill="#f8f2e2" /><rect x={2} y={-29} width={36} height={54} fill="#f8f2e2" />
                {[0, 1, 2, 3].map((i) => <rect key={i} x={-34} y={-20 + i * 10} width={28} height={2} fill="#9a948a" />)}
                {[0, 1, 2, 3].map((i) => <rect key={`d${i}`} x={6} y={-20 + i * 10} width={28} height={2} fill="#9a948a" />)}
                {hoja > 0 && hoja < 1 && <g transform={`translate(0,0) scale(${Math.cos(hoja * Math.PI)},1)`}><rect x={0} y={-29} width={36} height={54} fill={hoja < 0.5 ? "#ffffff" : "#efe8d6"} stroke="#c8c0ac" strokeWidth={1} />{[0, 1, 2].map((i) => <rect key={i} x={5} y={-18 + i * 10} width={26} height={2} fill="#b8b0a0" />)}</g>}
                <rect x={-42} y={30} width={84} height={6} rx={2} fill="#2a4a74" />
              </g>
            )} />
        </>} />
      <Pildora texto="LIBRARY BOOKS" x={1010} y={100} desde={k(306.6)} color={AMBAR} tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 64 · June le enseña a tomar el pulso (monitor en la pared libre, arriba de la leña) ----------
export const P64Pulso: React.FC = () => {
  const f = useF();
  const k = kDe(308.35);
  const XT = 640, XJ = 860;
  const mun = { x: 730, y: COL - 100 };
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={64} setProps={{ ...LIVN, hora: "invierno", lena: 0 }}
        claves={[mira(0, 740, P - 220, 2.0), mira(k(309.6), 745, P - 215, 2.2, { curva: "inout" })]}
        detras={<PilaLena x={40} piso={P} w={600} filas={7} seed="liv" />}
        medio={<>
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: XT, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
            poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(309.7), v: { ...POSES_V3H.sentadoSuelo, tronco: 8, cabeza: 12 } }]}
            caras={[{ f: 0, v: "duda" }, { f: k(309.1), v: "determinado" }, { f: k(309.8), v: "sorpresa" }, { f: k(310.15), v: "risa" }]}
            miradas={[{ f: 0, v: { x: 0.8, y: 0.7 } }, { f: k(310.1), v: { x: 1, y: -0.1 } }]}
            ik={(q) => ({ D: { x: mun.x - 6, y: mun.y }, wD: tr(q, 0, k(308.7)) })} />
          <PjM look={JUNE} ruta={[{ f: 0, x: XJ, y: COL }]} dir={[{ f: 0, v: -1 }]} asiento={AS_PISO} seed={2}
            poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(309.6), v: { ...POSES_V3H.sentadoSuelo, tronco: 8, cabeza: 8 } }, { f: k(310.0), v: { ...POSES_V3H.sentadoSuelo, tronco: -4, cabeza: -6 } }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(309.7), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.7 } }, { f: k(309.9), v: { x: 1, y: -0.1 } }]}
            habla={[[k(308.5), k(309.6)]]}
            ik={(q) => ({ D: { x: mun.x + 12, y: mun.y - 6 }, wD: tr(q, k(308.6), k(309.2)) * (1 - tr(q, k(309.6), k(309.9))), I: { x: mun.x + 20, y: mun.y + 6 }, wI: tr(q, k(308.8), k(309.4)) })} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(420,190) scale(0.72)"><Pulso x={30} y={110} f={f} o={aparece(f, k(309.4))} bpm={72} /></g>
      </svg>
      <Pildora texto="TAKING A PULSE" x={1420} y={100} desde={k(308.5)} color={AMBAR} tam={38} />
    </AbsoluteFill>
  );
};

// ---------- 65 · cartas en la mesa ----------
export const P65Cartas: React.FC = () => {

  const k = kDe(310.41);
  const golpe = k(310.95);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={65} setProps={{ ...LIVN, vela: true }} golpeF={golpe}
        claves={[mira(0, 2540, P - 250, 2.0), mira(k(311.67), 2540, P - 250, 2.1, { curva: "inout" })]}
        medio={<>
          <Silla x={2380} piso={P} alto={100} respaldo={false} />
          <Silla x={2700} piso={P} alto={100} respaldo={false} dir={-1} />
          {[0, 1, 2].map((i) => <rect key={i} x={2500 + i * 4} y={P - 180 - i * 2} width={30} height={6} rx={2} fill="#f2ece0" stroke="#c0352c" strokeWidth={1} />)}
          <PjM look={JUNE} ruta={[{ f: 0, x: 2380, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={AS_TAB} poses={[{ f: 0, v: "sentado" }]} seed={2}
            caras={[{ f: 0, v: "picaro" }, { f: golpe, v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: golpe - 4, v: { x: 1, y: 0.7 } }]}
            ik={(q) => ({ D: q < golpe ? { x: 2470, y: P - 214 } : { x: 2520, y: P - 182 }, wD: 1, I: { x: 2448, y: P - 196 }, wI: 1 })}
            mundo={(j) => <><g transform={`translate(${j.manoI.x},${j.manoI.y}) rotate(-8)`}>{[0, 1, 2].map((i) => <rect key={i} x={-12 + i * 8} y={-30} width={22} height={30} rx={3} fill="#f8f2e2" stroke="#2a2228" strokeWidth={1} transform={`rotate(${-12 + i * 12})`} />)}</g><rect x={j.manoD.x - 11} y={j.manoD.y - 16} width={22} height={30} rx={3} fill="#f8f2e2" stroke="#c0352c" strokeWidth={2} /></>} />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: 2700, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={AS_TAB} poses={[{ f: 0, v: "sentado" }, { f: golpe, v: { tronco: -12, pI: 88, rI: 88, pD: 92, rD: 92, hI: 60, cI: 120, hD: 70, cD: 120 } }]}
            caras={[{ f: 0, v: "duda" }, { f: golpe + 2, v: "sorpresa" }, { f: golpe + 14, v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }]}
            ik={(q) => ({ I: { x: 2636, y: P - 196 }, wI: q < golpe ? 1 : 0 })}
            mundo={(j, q) => q < golpe ? <g transform={`translate(${j.manoI.x},${j.manoI.y}) rotate(8)`}>{[0, 1].map((i) => <rect key={i} x={-12 + i * 8} y={-30} width={22} height={30} rx={3} fill="#f8f2e2" stroke="#2a2228" strokeWidth={1} />)}</g> : null} />
        </>} />
      <Pildora texto="CARDS" x={1000} y={110} desde={k(310.6)} color={AMBAR} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 66 · al mediodía, caminan al lago (travelling de costado, el lago humea) → corte: el hielo se amontona en la orilla ----------
export const P66Caminan: React.FC = () => {
  const f = useF();
  const k = kDe(311.67);
  const S = CANAL_PISO;
  const corte = k(314.5);
  const vap = <VaporLago f={f} x0={-600} w={3600} y={612} n={22} H={150} seed="c66" ancho={0.7} />;
  if (f < corte) {
    return (
      <AbsoluteFill>
        <EscenaNB Set={CanalPark} pal={PAL} seed={66} setProps={{ hora: "dia", luces: 0, nieve: 1, vapor: 0.6, hielo: 0.3, ventanaGus: 0 }} lejosExtra={vap}
          claves={[mira(0, 1190, S - 250, 1.6), mira(corte, 1540, S - 250, 1.6, { curva: "inout" })]}
          medio={<>
            <PjM look={THEO_INV} ruta={[{ f: 0, x: 1020, y: S }, { f: corte, x: 1400 }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO}
              caras={[{ f: 0, v: "neutral" }, { f: k(312.9), v: "feliz" }, { f: k(313.9), v: "risa" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(312.9), v: { x: 0.5, y: -1 } }, { f: k(313.7), v: { x: 1, y: 0 } }]} habla={[[k(313.6), k(314.2)]]} />
            <PjM look={JUNE_INV} ruta={[{ f: 0, x: 1230, y: S }, { f: corte, x: 1610 }]} seed={2} dir={[{ f: 0, v: 1 }, { f: k(313.0), v: -1 }, { f: k(313.9), v: 1 }]} luz={BORDE_FRIO}
              caras={[{ f: 0, v: "feliz" }, { f: k(313.0), v: "risa" }, { f: k(313.9), v: "feliz" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(313.0), v: { x: 1, y: 0.1 } }]} habla={[[k(312.4), k(313.4)]]} />
          </>} />
        <RelojDia min={12 * 60} x={1240} y={96} desde={k(312.6)} tam={44} />
        <Pildora texto="NOON · THE WARMEST HOUR" x={760} y={96} desde={k(312.8)} color={AMBAR} tam={40} />
      </AbsoluteFill>
    );
  }
  const hielo = tr(f, k(314.6), k(316.1));
  return (
    <AbsoluteFill>
      <EscenaNB Set={CanalPark} pal={PAL} seed={661} setProps={{ hora: "dia", luces: 0, nieve: 1, vapor: 0.6, hielo: 0.3, ventanaGus: 0 }} lejosExtra={vap}
        claves={[mira(corte, 1800, S - 250, 2.05), mira(k(316.23), 1830, S - 240, 2.15, { curva: "inout" })]}
        detras={<HieloOrilla x={1380} y={S - 44} w={1100} p={0.25 + 0.75 * hielo} f={f} />}
        medio={<>
          <PjM look={THEO_INV} ruta={[{ f: 0, x: 1690, y: S }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "parado" }, { f: k(315.3), v: "agacharse" }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(314.9), v: "sorpresa" }, { f: k(315.6), v: "risa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(315.0), v: { x: 1, y: 0.8 } }]} />
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: 1900, y: S }]} seed={2} dir={[{ f: 0, v: 1 }, { f: k(315.5), v: -1 }]} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "parado" }, { f: k(314.8), v: "señalar" }, { f: k(315.5), v: "hablar" }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(314.8), v: "sorpresa" }, { f: k(315.5), v: "risa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.6 } }, { f: k(315.5), v: { x: 1, y: 0.4 } }]} habla={[[k(315.5), k(316.1)]]} />
        </>} />
      <Pildora texto="ICE BUILDS UP ON THE SHORE" x={960} y={96} desde={k(314.7)} color="#cfe0ff" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 67 · mapa: el puerto se congela entero; más afuera el lago casi nunca → contraplano: June se lo explica a Theo ----------
export const P67Hielo: React.FC = () => {
  const f = useF();
  const k = kDe(316.23);
  const corte = k(320.2);
  // v4h: el paneo del mapa termina ANTES de que entre LAKE SUPERIOR (entra con la cámara quieta y entero en cuadro);
  // corte mapa → orilla con fundido de 6 cuadros; June no se da vuelta de golpe (gira la cabeza con la mirada).
  const tomaA = () => {
    const z = interpolate(f, [0, k(318.3), k(319.2)], [1.25, 1.25, 0.95], { ...cl, easing: io });
    const cx = interpolate(f, [0, k(318.3), k(319.2)], [300, 300, 760], { ...cl, easing: io });
    const cy = interpolate(f, [0, k(318.3), k(319.2)], [610, 610, 560], { ...cl, easing: io });
    return (
      <AbsoluteFill style={{ background: "#21486e" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <MapaPuertoV3 f={f} puerto={tr(f, k(316.5), k(318.2))} lago={tr(f, k(319.25), k(319.6))} vap={tr(f, k(318.9), k(319.5))} flecha={tr(f, k(319.3), k(320.1))} zoom={z} cx={cx} cy={cy} gente={1} />
        </svg>
      </AbsoluteFill>
    );
  };
  const S = CANAL_PISO;
  const tomaB = () => (
    <AbsoluteFill>
      <EscenaNB Set={CanalPark} pal={PAL} seed={67} setProps={{ hora: "dia", luces: 0, nieve: 1, vapor: 0.6, hielo: 0.85, ventanaGus: 0 }}
        lejosExtra={<VaporLago f={f} x0={-900} w={3600} y={612} n={24} H={180} seed="c67" ancho={0.75} />}
        claves={[mira(corte, 1375, S - 225, 2.1), mira(k(322.53), 1370, S - 222, 2.18, { curva: "inout" })]}
        medio={<>
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: 1265, y: S }]} dir={[{ f: 0, v: -1 }]} seed={2} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "señalar" }, { f: k(321.3), v: "hablar" }, { f: k(322.1), v: "manosCintura" }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(321.3), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: -0.1 } }, { f: k(321.3), v: { x: -1, y: 0 } }]}
            habla={[[corte, k(322.4)]]} />
          <PjM look={THEO_INV} ruta={[{ f: 0, x: 1465, y: S }]} dir={[{ f: 0, v: -1 }]} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "parado" }, { f: k(321.0), v: "pensar" }, { f: k(322.0), v: "brazosCruzados" }]}
            caras={[{ f: 0, v: "duda" }, { f: k(321.1), v: "sorpresa" }, { f: k(322.0), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.1 } }, { f: k(321.0), v: { x: 1, y: 0.2 } }]} />
        </>} />
      <Pildora texto="THE LAKE ALMOST NEVER FREEZES" x={1220} y={110} desde={corte + 6} color="#f6ecd2" tam={40} />
    </AbsoluteFill>
  );
  return <SubTomas f={f} corte={corte} antes={tomaA} despues={tomaB} />;
};

// ---------- 68 · al borde del hielo: agua abierta, humeando hasta el horizonte (set propio BordeHielo) ----------
export const P68Lago: React.FC = () => {
  const k = kDe(322.53);
  const S = BH_PISO;
  const XT = 760, XJ = 960;
  const aliento = (j: { boca: { x: number; y: number }; dir: number }, q: number, sd: number) => <>{[0, 1, 2].map((i) => { const c = ((q / 26 + i / 3 + sd) % 1); return <ellipse key={i} cx={j.boca.x + j.dir * (14 + c * 60)} cy={j.boca.y - c * 30} rx={8 + c * 20} ry={6 + c * 12} fill="#f4f8ff" opacity={0.55 * (1 - c)} />; })}</>;
  return (
    <AbsoluteFill>
      <EscenaNB Set={BordeHielo} pal={PAL} seed={68} setProps={{ vapor: 1 }} fondo="#5f7da6"
        claves={[
          mira(0, 860, S - 290, 1.6), mira(k(324.2), 870, S - 285, 1.68, { curva: "inout" }),
          mira(k(325.0), 880, S - 270, 2.15, { curva: "inout" }), mira(k(326.6), 880, S - 270, 2.2),
          mira(k(327.4), 1060, S - 300, 1.78, { curva: "inout" }), mira(k(328.39), 1075, S - 302, 1.74, { curva: "inout" }),
        ]}
        medio={<>
          <PjM look={THEO_INV} ruta={[{ f: 0, x: XT - 120, y: S }, { f: k(323.6), x: XT }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "parado" }, { f: k(324.6), v: { hI: 20, cI: 60, hD: 25, cD: 70, cabeza: -10, tronco: -4 } }, { f: k(326.9), v: "manosCintura" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(324.65), v: "sorpresa" }, { f: k(326.2), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(324.6), v: { x: 1, y: -0.25 } }, { f: k(326.9), v: { x: 1, y: -0.1 } }]}
            mundo={(j, q) => aliento(j, q, 0)} />
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: XJ - 110, y: S }, { f: k(323.6), x: XJ }]} dir={[{ f: 0, v: 1 }]} seed={2} luz={BORDE_FRIO}
            caras={[{ f: 0, v: "duda" }, { f: k(324.7), v: "sorpresa" }, { f: k(325.8), v: "risa" }, { f: k(327.4), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(324.6), v: { x: 1, y: -0.2 } }, { f: k(325.8), v: { x: -1, y: 0 } }, { f: k(326.8), v: { x: 1, y: -0.2 } }]}
            poses={[{ f: 0, v: "parado" }, { f: k(324.7), v: "manosCara" }, { f: k(326.8), v: "señalar" }]}
            mundo={(j, q) => aliento(j, q, 0.5)} />
        </>} />
      <Pildora texto="THE EDGE OF THE ICE" x={1240} y={110} desde={k(323.2)} hasta={k(324.5)} color="#cfe0ff" tam={40} />
      <Pildora texto="OPEN WATER · STEAMING" x={1240} y={110} desde={k(324.8)} hasta={k(327.3)} color="#f6ecd2" tam={40} />
      <Pildora texto="ALL THE WAY TO THE HORIZON" x={1240} y={110} desde={k(327.4)} color={AMBAR} tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 69 · día 130: marzo, más de once horas de luz (June sale al sol → corte: Theo se suma, se estiran al sol) ----------
const LIVV = { ...LIVN, lena: 0 }; // v3h: la leña de verdad es PilaLena (no la grilla de puntos)
const PILA = (filas = 7, n?: number) => <PilaLena x={40} piso={P} w={600} filas={filas} seed="liv" n={n} />;
export const P69Sol: React.FC = () => {
  const f = useF();
  const k = kDe(328.39);
  const corte = k(331.69);
  const horas = interpolate(f, [k(332.2), k(334.6)], [8.2, 11.2], cl);
  const arco = <ArcoSol x={1300} y={640} r={640} p={interpolate(f, [0, k(335.45)], [0.15, 0.55], cl)} f={f} />;
  // v4h: la barra de luz y el sol viven en el cielo libre (derecha) DESDE EL INI; corte interno con fundido de 6 cuadros
  const barra = <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><g transform="translate(1250,104) scale(0.82)"><BarraLuz x={20} y={58} horas={horas} o={aparece(f, -8)} /></g></svg>;
  const tomaA = () => (
      <AbsoluteFill>
        <EscenaNB Set={Barrio} pal={PAL} seed={69} setProps={{ hora: "dia", luces: 0, nieve: 0.6, humo: 0.4 }} lejosExtra={arco}
          claves={[mira(0, 2000, B - 280, 1.7), mira(corte, 2030, B - 280, 1.74, { curva: "inout" })]}
          medio={<PjM look={JUNE_INV} ruta={[{ f: 0, x: 1906, y: B }, { f: k(329.7), x: 2080 }]} dir={[{ f: 0, v: 1 }, { f: k(330.3), v: -1 }]} seed={2}
            poses={[{ f: 0, v: "parado" }, { f: k(330.3), v: "parado" }, { f: k(331.0), v: "brazosCruzados" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(329.9), v: "feliz" }, { f: k(331.0), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(329.9), v: { x: 1, y: -0.9 } }, { f: k(331.0), v: { x: 0.2, y: -0.2 } }]}
            ik={(q) => ({ D: { x: 2080 - 24, y: B - 262 }, wD: tr(q, k(329.9), k(330.3)) * (1 - tr(q, k(330.8), k(331.0))) })} />} />
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <Rot x={1510} y={290} t="MARCH" o={aparece(f, k(328.6))} tam={46} />
        </svg>
        {barra}
      </AbsoluteFill>
  );
  const tomaB = () => (
    <AbsoluteFill>
      <EscenaNB Set={Barrio} pal={PAL} seed={691} setProps={{ hora: "dia", luces: 0, nieve: 0.6, humo: 0.4 }} lejosExtra={arco}
        claves={[mira(corte, 2250, B - 280, 1.8), mira(k(335.45), 2265, B - 284, 1.86, { curva: "inout" })]}
        medio={<>
          <PjM look={THEO_INV} ruta={[{ f: 0, x: 1640, y: B }, { f: corte, x: 1640 }, { f: k(332.7), x: 2140 }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(332.8), v: "agarrarAlto" }, { f: k(334.0), v: "manosCintura" }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(332.8), v: "feliz" }, { f: k(334.0), v: "risa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(332.8), v: { x: 0.4, y: -1 } }, { f: k(334.0), v: { x: 1, y: -0.1 } }]} />
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: 2350, y: B }]} dir={[{ f: 0, v: -1 }, { f: k(333.3), v: 1 }]} seed={2}
            poses={[{ f: 0, v: "brazosCruzados" }, { f: k(332.4), v: "saludar" }, { f: k(333.3), v: "parado" }, { f: k(334.2), v: "celebrar" }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(332.4), v: "risa" }, { f: k(333.3), v: "feliz" }, { f: k(334.2), v: "risa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(333.3), v: { x: 0.3, y: -1 } }, { f: k(334.2), v: { x: -0.4, y: -0.2 } }]}
            habla={[[k(332.3), k(333.0)]]} />
        </>} />
      {barra}
    </AbsoluteFill>
  );
  return <SubTomas f={f} corte={corte} antes={tomaA} despues={tomaB} />;
};

// ---------- 70 · la última fila de leña: Theo levanta el último leño (lo peor del frío ya pasó) ----------
export const P70Ultima: React.FC = () => {
  const f = useF();
  const k = kDe(335.45);
  // v4h: Theo entra caminando a la última fila (ini con acción), se agacha con resorte (sin asiento: nada de snap),
  // las manos VIAJAN del leño al pecho en 14 cuadros; la curva va a la derecha, lejos de la alarma de CO (x 760).
  const XT = 600;
  const tom = k(336.85);
  const leno = { x: 430, y: P - 38 };
  const pecho = { x: XT - 56, y: P - 168 };
  const sube = tr(f, tom, tom + 14);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={70} setProps={{ ...LIVV, hora: "dia", fuego: 0.6 }}
        claves={[mira(0, 720, P - 230, 1.9), mira(k(336.3), 600, P - 215, 2.05, { curva: "inout" }), mira(k(337.7), 600, P - 220, 2.05), mira(k(338.4), 690, P - 255, 1.72, { curva: "inout" }), mira(k(339.97), 694, P - 256, 1.76, { curva: "inout" })]}
        detras={<FilaUltima x={60} piso={P} quedan={f < tom ? 3 : 2} total={3} />}
        medio={<PjM look={THEO_CASA} ruta={[{ f: 0, x: 960, y: P }, { f: k(336.0), x: XT }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: "parado" }, { f: k(336.1), v: "agacharse" }, { f: tom + 4, v: { tronco: 14, cabeza: -6, pI: 10, rI: 20, pD: 14, rD: 24 } }, { f: k(337.6), v: "parado" }, { f: k(339.2), v: { cabeza: -10, tronco: -6 } }]}
          caras={[{ f: 0, v: "neutral" }, { f: k(336.2), v: "determinado" }, { f: tom + 6, v: "duda" }, { f: k(338.17), v: "feliz" }, { f: k(339.2), v: "risa" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(336.1), v: { x: 1, y: 0.9 } }, { f: k(337.6), v: { x: 1, y: 0.2 } }, { f: k(338.5), v: { x: -0.4, y: -0.3 } }]}
          ik={(q) => ({ D: lp(leno, pecho, tr(q, tom, tom + 14)), wD: tr(q, k(336.15), k(336.65)), I: lp({ x: leno.x + 34, y: leno.y + 4 }, { x: pecho.x + 44, y: pecho.y + 8 }, tr(q, tom, tom + 14)), wI: tr(q, k(336.2), k(336.7)) })}
          mundo={(j, q) => q >= tom ? <g transform={`translate(${(j.manoD.x + j.manoI.x) / 2},${(j.manoD.y + j.manoI.y) / 2 - 6})`}><LenoLado s={0.95} rot={-6 * sube} seed="fu2" /></g> : null} />} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Rot x={680} y={190} t="THE LAST ROW OF WOOD" o={aparece(f, k(335.6), k(337.9))} tam={44} />
        <g opacity={aparece(f, k(338.2))} transform="translate(400,100) scale(0.62)"><CurvaFrio x={40} y={70} p={tr(f, k(338.3), k(339.1))} marca={tr(f, k(339.1), k(339.5))} /></g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 71 · lo lograron: se abrazan frente a la ventana (2 personas · 1 cuarto · 1 invierno) ----------
export const P71Abrazo: React.FC = () => {
  const f = useF();
  const k = kDe(339.97);
  // v4h: abrazo de verdad (cada uno pasa los brazos por la espalda del otro, cabezas alternadas), cierre en 3/4 cerrado;
  // encuadre siempre a la derecha de la alarma de CO (x 760): borde izquierdo ≥ 880 del mundo.
  const cerca = k(340.75);
  const XT = 1282, XJ = 1368;
  const w = (q: number, d = 0) => tr(q, k(340.45) + d, cerca + 4 + d);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={71} setProps={{ ...LIVV, hora: "dia", fuego: 0.4 }}
        claves={[mira(0, 1340, P - 280, 1.85), mira(k(341.0), 1335, P - 280, 1.9, { curva: "inout" }), mira(k(342.0), 1330, P - 300, 2.35, { curva: "inout" }), mira(k(343.93), 1330, P - 302, 2.42, { curva: "inout" })]}
        medio={<>
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: 1080, y: P }, { f: cerca, x: XT }]} dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "sorpresa" }, { f: k(340.3), v: "risa" }, { f: k(341.8), v: "feliz" }, { f: k(342.9), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(341.8), v: { x: 1, y: 0.3 } }, { f: k(342.9), v: { x: 0.2, y: -0.2 } }]}
            poses={[{ f: 0, v: "celebrar" }, { f: k(340.45), v: { tronco: 4, cabeza: 14 } }, { f: k(342.0), v: { tronco: 6, cabeza: 18 } }, { f: k(342.9), v: { tronco: 2, cabeza: 4 } }]}
            ik={(q) => ({ D: { x: XJ + 16, y: P - 236 }, I: { x: XJ + 10, y: P - 196 }, wD: w(q), wI: w(q, 3) })} />
          <PjM look={JUNE} ruta={[{ f: 0, x: 1560, y: P }, { f: cerca, x: XJ }]} dir={[{ f: 0, v: -1 }]} seed={2}
            caras={[{ f: 0, v: "sorpresa" }, { f: k(340.3), v: "risa" }, { f: k(341.6), v: "feliz" }, { f: k(342.9), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(341.6), v: { x: 1, y: 0.4 } }, { f: k(342.9), v: { x: 0.3, y: -0.2 } }]}
            poses={[{ f: 0, v: "celebrar" }, { f: k(340.45), v: { tronco: 10, cabeza: 22, bajar: 40 } }, { f: k(342.0), v: { tronco: 12, cabeza: 26, bajar: 42 } }, { f: k(342.9), v: { tronco: 6, cabeza: 10, bajar: 36 } }]}
            ik={(q) => ({ D: { x: XT - 14, y: P - 196 }, I: { x: XT - 6, y: P - 236 }, wD: w(q, 2), wI: w(q, 5) })} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Rot x={1560} y={200} t="THEY DID IT" o={aparece(f, k(340.0), k(340.9))} tam={44} />
        <Rot x={1560} y={200} t="2 PEOPLE" o={aparece(f, k(341.07))} tam={44} />
        <Rot x={1560} y={290} t="1 ROOM" o={aparece(f, k(342.01))} tam={44} />
        <Rot x={1560} y={380} t="1 WINTER" o={aparece(f, k(342.85))} tam={44} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 72 · Theo prende el escáner (no es una radio común) ----------
const ESC_T = 800; // Theo en el colchón con el escáner
export const P72Escaner: React.FC = () => {
  const f = useF();
  const k = kDe(343.93);
  const piso = { x: ESC_T + 90, y: COL - 14 };
  const mano = { x: ESC_T + 74, y: COL - 140 };
  const tom = k(344.6);
  const on = f >= k(345.2) ? 1 : 0;
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={72} setProps={{ ...LIVV }}
        claves={[mira(0, 950, 660, 2.0), mira(k(346.3), 950, 655, 2.05, { curva: "inout" }), mira(k(347.9), 905, 640, 2.4, { curva: "inout" }), mira(k(351.3), 905, 640, 2.4), mira(k(352.6), 908, 640, 2.45, { curva: "inout" })]}
        detras={PILA()}
        medio={<>
          {f < tom && <EscanerW f={f} x={piso.x} y={piso.y - 50} on={0} s={0.9} rot={-80} />}
          <PjM look={JUNE} ruta={[{ f: 0, x: 1060, y: COL }]} dir={[{ f: 0, v: -1 }]} asiento={AS_PISO} seed={2}
            poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(346.4), v: { ...POSES_V3H.sentadoSuelo, tronco: 6, cabeza: 12, hD: 30, cD: 110 } }, { f: k(348.6), v: { ...POSES_V3H.sentadoSuelo, tronco: -6, cabeza: -8, hD: 20, cD: 60 } }, { f: k(350.2), v: { ...POSES_V3H.sentadoSuelo, tronco: 2, cabeza: 4, hD: 95, cD: 50 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(346.4), v: "duda" }, { f: k(348.6), v: "sorpresa" }, { f: k(350.2), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(346.4), v: { x: 1, y: 0.5 } }, { f: k(348.6), v: { x: 1, y: -0.1 } }, { f: k(351.7), v: { x: 1, y: 0.2 } }]} />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: ESC_T, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
            poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(349.4), v: { ...POSES_V3H.sentadoSuelo, tronco: -6, cabeza: -8 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(345.3), v: "feliz" }, { f: k(347.9), v: "picaro" }, { f: k(351.7), v: "sorpresa" }]}
            miradas={[{ f: 0, v: { x: 0.8, y: 0.7 } }, { f: k(347.9), v: { x: 1, y: 0 } }, { f: k(349.4), v: { x: 0.6, y: -0.5 } }]}
            habla={[[k(348.0), k(349.2)]]}
            ik={(q) => ({ D: q < tom ? piso : lp(piso, mano, tr(q, tom, tom + 10)), wD: tr(q, 0, k(344.4)) + 0, I: { x: mano.x + 4, y: mano.y - 20 }, wI: tr(q, k(344.9), k(345.2)) * (1 - tr(q, k(345.5), k(345.8))) })}
            mundo={(j, q) => q >= tom ? <EscanerW f={q} x={j.manoD.x + 6} y={j.manoD.y - 32} on={on} alerta={tr(q, k(351.6), k(351.9))} s={0.9} /> : null} />
        </>} />
      <Pildora texto="NOT A NORMAL RADIO" x={1160} y={110} desde={k(346.4)} hasta={k(347.8)} color="#f6ecd2" tam={36} />
      <Pildora texto="A HANDHELD SCANNER" x={1160} y={110} desde={k(347.95)} hasta={k(349.3)} color={AMBAR} tam={36} />
      <Pildora texto="FOR HUNTERS" x={1160} y={110} desde={k(349.4)} hasta={k(351.5)} color="#f6ecd2" tam={38} />
      <Pildora texto="WEATHER ALERTS" x={1160} y={110} desde={k(351.7)} color={AMBAR} tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 73 · cada noche, 130 noches: estática (las rayas en la pared, sobre la leña) ----------
export const P73Estatica: React.FC = () => {
  const f = useF();
  const k = kDe(352.63);
  const mano = { x: ESC_T + 74, y: COL - 140 };
  const n = interpolate(f, [k(353.1), k(354.7)], [0, 130], { ...cl, easing: io });
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={73} setProps={{ ...LIVV, fuego: 0.5 }}
        claves={[mira(0, 700, P - 260, 1.7), mira(k(355.6), 700, P - 260, 1.7), mira(k(356.6), 700, P - 255, 1.8, { curva: "inout" })]}
        detras={<>{PILA(4)}<RayasPared x={360} y={400} n={n} /></>}
        medio={<PjM look={THEO_CASA} ruta={[{ f: 0, x: ESC_T, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
          poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(354.4), v: { ...POSES_V3H.sentadoSuelo, tronco: -6, cabeza: -14, hI: 150, cI: 150 } }, { f: k(355.4), v: { tronco: 14, cabeza: 18, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 30, hD: 40, cD: 70 } }, { f: k(356.9), v: { tronco: 18, cabeza: 24, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 30, hD: 40, cD: 70 } }]}
          caras={[{ f: 0, v: "neutral" }, { f: k(354.4), v: "cansado" }, { f: k(355.4), v: "triste" }, { f: k(356.9), v: "cansado" }]}
          miradas={[{ f: 0, v: { x: 0.8, y: 0.7 } }, { f: k(353.4), v: { x: -1, y: -0.3 } }, { f: k(354.8), v: { x: 0.8, y: 0.7 } }, { f: k(356.9), v: { x: 0.3, y: 1 } }]}
          ik={() => ({ D: mano, wD: 1 })}
          mundo={(j, q) => <><EscanerW f={q} x={j.manoD.x + 6} y={j.manoD.y - 32} on={1} s={0.9} freq={162.4 - ((Math.floor(q / 9) * 0.025) % 4)} />
            {q > k(356.4) && Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${j.manoD.x + 30 + ((i * 37 + q * 5) % 60)},${j.manoD.y - 80 - ((i * 23 + q * 3) % 50)} l6,-4 l-4,-6 l8,-2`} stroke="#cfc8e8" strokeWidth={2} fill="none" opacity={0.7} />)}</>} />} />
      <Pildora texto="130 NIGHTS" x={1360} y={110} desde={k(353.9)} hasta={k(356.3)} color={AMBAR} tam={40} />
      <Pildora texto="EVERY NIGHT: STATIC" x={1360} y={110} desde={k(356.5)} color="#cfc8e8" tam={34} />
    </AbsoluteFill>
  );
};

// ---------- 74 · esta noche, abajo del todo del dial: una voz (alarma de CO siempre entera en cuadro) ----------
export const P74Voz: React.FC = () => {
  const f = useF();
  const k = kDe(357.97);
  const mano = { x: ESC_T + 74, y: COL - 140 };
  const freq = interpolate(f, [k(358.8), k(360.1)], [162.4, 136.0], { ...cl });
  const voz = tr(f, k(361.1), k(361.4));
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={74} setProps={{ ...LIVV, fuego: 0.4 }}
        claves={[mira(0, 880, 640, 2.4), mira(k(360.0), 880, 625, 2.9, { curva: "inout" }), mira(k(361.1), 871, 600, 3.6), mira(k(362.09), 871, 600, 3.66, { curva: "inout" })]}
        detras={PILA()}
        medio={<PjM look={THEO_CASA} ruta={[{ f: 0, x: ESC_T, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
          poses={[{ f: 0, v: { tronco: 14, cabeza: 18, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 30, hD: 40, cD: 70 } }, { f: k(358.6), v: { tronco: 8, cabeza: 10, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 30, hD: 40, cD: 70 } }, { f: k(361.2), v: { tronco: -8, cabeza: -6, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 30, hD: 40, cD: 70 } }]}
          caras={[{ f: 0, v: "cansado" }, { f: k(359.4), v: "duda" }, { f: k(361.15), v: "sorpresa" }]}
          miradas={[{ f: 0, v: { x: 0.8, y: 0.7 } }, { f: k(359.4), v: { x: 1, y: -0.3 } }, { f: k(361.15), v: { x: 1, y: -0.6 } }]}
          ik={(q) => ({ D: mano, wD: 1, I: { x: mano.x + 16, y: mano.y - 46 }, wI: tr(q, k(358.6), k(358.8)) * (1 - tr(q, k(360.2), k(360.5))) })}
          mundo={(j, q) => <EscanerW f={q} x={j.manoD.x + 6} y={j.manoD.y - 32} on={1} s={0.9} freq={freq} voz={voz} />} />} />
      <Pildora texto="THE BOTTOM OF THE DIAL" x={1060} y={100} desde={k(358.6)} hasta={k(361.0)} color={AMBAR} tam={38} />
      <Pildora texto="A VOICE" x={1200} y={110} desde={k(361.2)} color="#5aff7a" tam={56} />
    </AbsoluteFill>
  );
};

// ---------- 75 · «Viejo, áspero, cansado… ¿alguien? Me llamo Gus» → corte: su silueta en la ventana de Canal Park ----------
export const P75Gus: React.FC = () => {
  const f = useF();
  const k = kDe(362.09);
  const mano = { x: ESC_T + 74, y: COL - 140 };
  if (f < k(366.5)) {
    return (
      <AbsoluteFill>
        <EscenaNB Set={Living} pal={PAL} seed={75} setProps={{ ...LIVV, fuego: 0.4 }}
          claves={[mira(0, 900, P - 260, 1.75), mira(k(364.8), 890, P - 250, 1.9, { curva: "inout" })]}
          detras={PILA()}
          medio={<>
            <PjM look={JUNE} ruta={[{ f: 0, x: 1110, y: COL }]} dir={[{ f: 0, v: -1 }]} seed={2} asiento={AS_PISO}
              poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(363.0), v: { ...POSES_V3H.sentadoSuelo, tronco: 22, cabeza: 10 } }, { f: k(363.9), v: { ...POSES_V3H.sentadoSuelo, tronco: 26, cabeza: 12, hD: 150, cD: 150 } }, { f: k(364.85), v: { ...POSES_V3H.sentadoSuelo, tronco: 4, cabeza: -6 } }]}
              caras={[{ f: 0, v: "sorpresa" }, { f: k(363.4), v: "duda" }, { f: k(364.85), v: "sorpresa" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(363.0), v: { x: 1, y: 0.4 } }, { f: k(364.85), v: { x: 0.4, y: 0 } }]} />
            <PjM look={THEO_CASA} ruta={[{ f: 0, x: ESC_T, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
              poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(363.9), v: { ...POSES_V3H.sentadoSuelo, tronco: 10, cabeza: 10 } }]}
              caras={[{ f: 0, v: "sorpresa" }, { f: k(363.03), v: "duda" }, { f: k(364.85), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.7 } }, { f: k(363.6), v: { x: 1, y: 0 } }]}
              ik={() => ({ D: mano, wD: 1 })}
              mundo={(j, q) => <EscenaCtx j={j} q={q} />} />
          </>} />
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {["OLD", "ROUGH", "TIRED"].map((t, i) => <Rot key={t} x={1010} y={150 + i * 86} t={t} o={aparece(f, k([362.09, 363.03, 363.89][i]), k(364.7))} tam={50} borde="#cfc8e8" />)}
        </svg>
        <Globo texto="Anyone?" x={1010} y={330} desde={k(364.85)} hasta={k(366.5)} tam={52} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <EscenaNB Set={CanalPark} pal={PAL} seed={76} setProps={{ hora: "noche", luces: 0, nieve: 1, cae: true, vapor: 0.5, hielo: 0.4, ventanaGus: 1 }}
        claves={[mira(k(366.5), 520, 520, 1.5), mira(k(368.57), 415, 500, 2.9, { curva: "inout" })]}
        medio={<SilGus f={f} o={tr(f, k(366.6), k(366.95))} mic={1} habla={f > k(366.9) ? 1 : 0} perro={1} />} />
    </AbsoluteFill>
  );
};
const EscenaCtx: React.FC<{ j: { manoD: { x: number; y: number } }; q: number }> = ({ j, q }) => <EscanerW f={q} x={j.manoD.x + 6} y={j.manoD.y - 32} on={1} s={0.9} freq={136.0} voz={1} />;

// ---------- 76 · CLÍMAX: Gus en su ventana de Canal Park, con su perro Ore ----------
export const P76Ventana: React.FC = () => {
  const f = useF();
  const k = kDe(368.57);
  const V = VENT_G;
  const lamp = tr(f, k(371.25), k(371.4));
  const XG = 830, YG = 940, E = 1.9;
  const XO = 1150;
  const cadena = { x: V.x + 140, y: V.y + V.h + 120 - 418 };
  const cabOre = { x: XO - 1.9 * 58, y: YG - 1.9 * 166 + 20 };
  return (
    <AbsoluteFill>
      <EscenaNB Set={CieloGus} pal={PAL} seed={77} fondo="#141226"
        claves={[mira(0, 960, 520, 0.82), mira(k(369.8), 960, 520, 0.9, { curva: "inout" }), mira(k(371.2), 960, 520, 0.9), mira(k(372.6), 940, 500, 1.0, { curva: "inout" }), mira(k(375.19), 940, 495, 1.04, { curva: "inout" })]}
        medio={<>
          <InteriorGus f={f} lampara={lamp} />
          <OreLab x={XO} y={YG} dir={-1} s={1.9} f={f} sentado cola={tr(f, k(372.8), k(373.1))} jadea={tr(f, k(372.9), k(373.2))} cabeza={f > k(373.8) ? -10 : 0} orejaArriba={tr(f, k(373.8), k(374.1))} luz={lamp > 0.5 ? "#ffcf6e" : "#5a6a8a"} />
          <PjM look={GUS} ruta={[{ f: 0, x: XG, y: YG }]} escala={E}
            dir={[{ f: 0, v: -1 }, { f: k(372.3), v: 1 }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(369.9), v: "neutral" }, { f: k(371.4), v: "triste" }, { f: k(372.71), v: "feliz" }, { f: k(373.87), v: "duda" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(372.4), v: { x: 1, y: 0.5 } }, { f: k(373.8), v: { x: 0.3, y: -0.1 } }]}
            habla={[[k(368.8), k(370.3)], [k(371.4), k(372.0)], [k(372.71), k(373.1)], [k(373.87), k(374.5)]]}
            poses={[{ f: 0, v: "parado" }, { f: k(373.8), v: { tronco: 8, cabeza: 6 } }]}
            ik={(q) => ({
              D: { x: XG + (q < k(372.3) ? -40 : 40) * 1, y: YG - 238 * E }, wD: 1,
              I: q < k(372.3) ? { x: cadena.x, y: cadena.y + (q > k(371.1) && q < k(371.4) ? 18 : 0) } : cabOre,
              wI: q < k(372.3) ? tr(q, k(370.6), k(371.0)) * (1 - tr(q, k(371.6), k(371.9))) : tr(q, k(372.6), k(372.9)),
            })}
            mundo={(j) => <g transform={`translate(${j.manoD.x},${j.manoD.y})`}><rect x={-12} y={-30} width={24} height={40} rx={8} fill="#1c1a20" /><rect x={-8} y={-26} width={16} height={8} rx={3} fill="#4a4a54" /><path d={`M0,10 Q${-j.dir * 60},120 ${-j.dir * 20},260`} stroke="#1c1a20" strokeWidth={4} fill="none" /></g>} />
          <ParedGus f={f} lampara={lamp} />
        </>} />
      <Pildora texto="CANAL PARK · BY THE BRIDGE" x={960} y={106} desde={k(368.85)} hasta={k(371.1)} color={AMBAR} tam={40} />
      <Globo texto="There’s a light in my window." x={960} y={178} desde={k(371.3)} hasta={k(372.6)} tam={38} />
      <Globo texto="Me and the dog. Anyone?" x={960} y={178} desde={k(372.71)} hasta={k(375.19)} tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 77 · June agarra el cuaderno y arranca la tapa (sin giro: mira a la izquierda todo el plano) ----------
export const P77Agarra: React.FC = () => {
  const f = useF();
  const k = kDe(375.19);
  const XJ = 1100;
  const cuad = { x: 990, y: COL - 8 };
  const pecho = { x: XJ - 92, y: COL - 40 }; // v4h: a la altura del pecho (60 px más abajo): nunca tapa la cara
  const tom = k(375.75), roto = k(377.4);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={78} setProps={{ ...LIVV }}
        claves={[mira(0, 960, P - 240, 1.75), mira(k(376.4), 960, P - 240, 1.75), mira(k(377.0), 1000, P - 230, 2.1, { curva: "inout" })]}
        detras={PILA()}
        medio={<>
          {f < tom && <CuadernoChico x={cuad.x} y={cuad.y} rot={90} s={0.8} />}
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: ESC_T, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
            caras={[{ f: 0, v: "sorpresa" }, { f: k(377.5), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(376.0), v: { x: 1, y: 0.4 } }]}
            ik={() => ({ D: { x: ESC_T + 74, y: COL - 140 }, wD: 1 })}
            mundo={(j, q) => <EscanerW f={q} x={j.manoD.x + 6} y={j.manoD.y - 32} on={1} s={0.9} freq={136.0} voz={1} />} />
          <PjM look={JUNE} ruta={[{ f: 0, x: XJ, y: COL }]} dir={[{ f: 0, v: -1 }]} seed={2}
            asiento={AS_PISO} poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(375.3), v: { ...POSES_V3H.sentadoSuelo, tronco: 30, cabeza: 14 } }, { f: k(375.95), v: "sentadoSuelo" }, { f: k(377.2), v: { ...POSES_V3H.sentadoSuelo, tronco: -8, cabeza: -6 } }]}
            caras={[{ f: 0, v: "sorpresa" }, { f: k(375.4), v: "determinado" }, { f: k(377.5), v: "risa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(375.3), v: { x: 1, y: 0.9 } }, { f: k(376.0), v: { x: 0.6, y: 0.7 } }, { f: k(377.6), v: { x: 1, y: 0 } }]}
            ik={(q) => ({ D: q < tom ? cuad : pecho, wD: tr(q, k(375.2), k(375.6)), I: { x: pecho.x - 18, y: pecho.y - 24 + (q > k(377.2) ? -26 * tr(q, k(377.2), roto) : 0) }, wI: tr(q, k(376.3), k(376.7)) })}
            mundo={(j, q) => q >= tom ? <><CuadernoChico x={j.manoD.x} y={j.manoD.y - 20} s={1.1} roto={q >= roto ? 1 : 0} /><TapaVuela x={j.manoD.x} y={j.manoD.y - 20} p={tr(q, roto, roto + 24)} dir={-1} /></> : null} />
        </>} />
      <Pildora texto="THE NOTEBOOK" x={880} y={110} desde={k(375.5)} hasta={k(377.1)} color={AMBAR} tam={40} />
      <Pildora texto="RIPS OFF THE COVER" x={880} y={110} desde={k(377.3)} color="#ff8a6a" tam={34} />
    </AbsoluteFill>
  );
};

// ---------- 78 · bajo el 2 escribe: 3 ----------
export const P78Tres: React.FC = () => {
  const f = useF();
  const k = kDe(378.75);
  const d3 = k(380.6), golpe = k(381.45);
  const T = 130, X = 1100, Y = 580;
  const punta = (n: number) => { const a = (-3 * Math.PI) / 180, px = n * T * 0.56, py = T * 0.86; return { x: X + px * Math.cos(a) - py * Math.sin(a), y: Y + px * Math.sin(a) + py * Math.cos(a) }; };
  let tip = lp({ x: 1500, y: 860 }, { x: 1150, y: 560 }, tr(f, k(378.9), k(379.4)));
  if (f >= k(379.4)) tip = lp({ x: 1150, y: 560 }, punta(0), tr(f, k(379.9), d3));
  if (f >= d3) { const t = tr(f, d3, golpe - 4); tip = { x: X + 20 + 50 * Math.sin(t * Math.PI * 1.4), y: Y + 30 + 80 * t }; }
  if (f >= golpe) tip = lp(punta(1), { x: 1450, y: 860 }, tr(f, golpe + 4, golpe + 20));
  const g = Math.max(0, 1 - Math.abs(f - golpe) / 8);
  return (
    <AbsoluteFill>
      <CuadernoGrande arrancada renglones={[{ t: "POPULATION", desde: -999, y: 200, tam: 56 }, { t: "1", desde: -999, y: 300, tam: 110 }, { t: "2", desde: -999, y: 440, tam: 110 }, { t: "3", desde: golpe - 2, color: ROJO_CENSO, x: X, y: Y, tam: T }]} zoom={[0, 1, 1]} vela />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {f >= d3 && f < golpe - 2 && <path d={`M${X + 20},${Y + 30} L${tip.x},${tip.y}`} stroke={ROJO_CENSO} strokeWidth={10} strokeLinecap="round" opacity={0.85} />}
        <ManoLapiz tx={tip.x} ty={tip.y} manga="#2f7f86" desdeX={1980} desdeY={1200} />
        {g > 0 && <circle cx={X + 40} cy={Y + 70} r={140 + 120 * (1 - g)} fill="none" stroke="#ffd27a" strokeWidth={8} opacity={0.6 * g} />}
        <Rot x={700} y={1000} t="UNDER THE 2" o={aparece(f, k(378.8), k(380.4))} tam={44} />{/* v4h: abajo, en el fondo oscuro libre (arriba lo cortaba el borde) */}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 79 · CTA: si tuvieras que elegir una regla… (3 tarjetas en la pared libre, sobre la mesa; nada tapa las latas) ----------
export const P79Cta: React.FC = () => {
  const f = useF();
  const k = kDe(382.59);
  const XJ = 2290, XT = 2470;
  const fin = k(386.9);
  const marca = f < k(383.6) ? -1 : f < k(384.3) ? 0 : f < k(385.0) ? 1 : 2;
  // v4h: cada nota entra con resorte de escala (pop), sin fundido cruzado: nunca dos a medio aparecer
  const pp = [pop(f, k(382.7)), pop(f, k(383.0)), pop(f, k(383.3))];
  const sal = interpolate(f, [fin, fin + 8], [1, 0], cl);
  const cartaW = [2129, 2371, 2614];
  const apunta = marca < 0 ? 1 : marca;
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={79} setProps={{ ...LIVV, hora: "dia", fuego: 0.4, reglas: 3 }}
        claves={[mira(0, 2400, P - 300, 1.4), mira(k(391.05), 2410, P - 300, 1.44, { curva: "inout" })]}
        medio={<>
          <PjM look={JUNE} ruta={[{ f: 0, x: XJ, y: P }]} seed={2} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(386.99), v: "hablar" }, { f: k(388.4), v: "saludar" }, { f: k(389.8), v: "celebrar" }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(383.6), v: "picaro" }, { f: k(385.6), v: "feliz" }, { f: k(388.4), v: "risa" }]}
            miradas={[{ f: 0, v: { x: 0.6, y: -1 } }, { f: k(385.6), v: { x: 0, y: 0 } }, { f: k(388.4), v: { x: 0.2, y: -0.1 } }]}
            habla={[[k(383.0), k(384.0)], [k(385.6), k(386.2)], [k(386.9), k(388.0)], [k(388.4), k(390.2)]]}
            ik={(q) => ({ D: { x: XJ + 40 + Math.min(80, (cartaW[apunta] - XJ) * 0.4), y: P - 330 }, wD: tr(q, k(382.9), k(383.3)) * (1 - tr(q, k(386.4), k(386.8))) })} />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: 3160, y: P }, { f: k(386.2), x: 3160 }, { f: k(387.9), x: XT }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(388.4), v: "saludar" }, { f: k(389.6), v: "celebrar" }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(388.4), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(388.2), v: { x: 0, y: 0 } }]} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <TarjetasPop x={430} y={222} p={pp} salida={sal} marca={marca} voto={tr(f, k(385.4), k(385.8))} />
      </svg>
      <Globo texto="Which ONE rule would you pick?" x={960} y={170} desde={k(383.0)} hasta={fin} tam={40} />
      <Globo texto="Tell me in the comments!" x={960} y={300} desde={k(386.99)} hasta={k(391.05)} tam={50} />
      <Pildora texto="SUBSCRIBE · THE CENSUS CONTINUES" x={960} y={340} desde={k(388.43)} color={AMBAR} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 80 · lo que viene: diez personas, una ciudad entera (Superior Street al atardecer, entran de a uno desde los dos lados) ----------
const GENTE: any[] = ["#c0352c", "#3a6a9a", "#e0a23a", "#4a7a5a", "#7a4a8a", "#2f7f86", "#8a5a36", "#d06a8a", "#5a5a64", "#a0b0c0"].map((c, i) => ({ estilo: "palo", camisa: c, manga: "larga", pantalon: i % 2 ? "#2a2a32" : "#3a3048", zapatos: "#1a1410", accesorios: [i % 3 === 0 ? { t: "gorroLana", color: "#efe3c8" } : i % 3 === 1 ? { t: "pelo", forma: "bob", color: "#3a2a1a" } : { t: "capucha", color: c }] }));
export const P80Next: React.FC = () => {
  const f = useF();
  const k = kDe(391.05);
  const S = SUP_PISO, CX = 2558;
  // v4h: dos filas escalonadas sin encimarse (≥110 px entre figuras de la misma fila; la de atrás, más chica y más arriba,
  // cae justo en los huecos de la de adelante). Grupo centrado en CX+250; farol en CX-391 → nadie a menos de 150.
  const G = 250;
  const lugar = [G - 345, G - 115, G + 115, G + 345, G + 575, G - 460, G - 230, G, G + 230, G + 460];
  const caras = ["determinado", "neutral", "duda", "feliz", "cansado", "sorpresa", "picaro", "feliz", "duda", "determinado"];
  return (
    <AbsoluteFill>
      <EscenaNB Set={Superior} pal={PAL} seed={80} setProps={{ hora: "ocaso", luces: 0, nieve: 0.6 }}
        claves={[mira(0, CX + G + 40, 600, 1.3), mira(k(394.05), CX + G + 46, 598, 1.33, { curva: "inout" })]}
        medio={<>{GENTE.map((l, i) => {
          const atras = i < 5;
          const x1 = CX + lugar[i];
          const izq = i % 2 === 0;
          const x0 = izq ? CX - 1000 - i * 40 : CX + 1000 + i * 40;
          const llega = k(391.3) + i * 4 + 26;
          return <PjM key={i} look={l} ruta={[{ f: 0, x: x0, y: atras ? S - 96 : S }, { f: llega, x: x1 }]} escala={atras ? 0.76 : 1} seed={10 + i}
            dir={[{ f: 0, v: izq ? 1 : -1 }, { f: llega + 4, v: x1 < CX ? 1 : -1 }]}
            poses={[{ f: 0, v: "parado" }, { f: llega + 10 + (i % 3) * 6, v: i % 4 === 0 ? "saludar" : i % 4 === 1 ? "brazosCruzados" : i % 4 === 2 ? "manosCintura" : "parado" }]}
            caras={[{ f: 0, v: caras[i] }, { f: llega + 12, v: i % 3 === 0 ? "feliz" : caras[i] }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: llega + 6, v: { x: 0, y: 0 } }]} />;
        })}</>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Rot x={1000} y={140} t="NEXT: 10 PEOPLE · 1 WHOLE CITY" o={aparece(f, k(391.3))} tam={44} />
      </svg>
    </AbsoluteFill>
  );
};
