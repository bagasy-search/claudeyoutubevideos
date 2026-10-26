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
import { Supermercado, SUPER_PISO, SUPER_PUNTOS } from "../../anikit/sets/super";
import { AMBAR, BORDE_FRIO, GUS, JUNE, JUNE_INV, PAL, ROJO_CENSO, THEO_CASA, THEO_INV } from "../elenco";
import { F_MONO } from "../hud";
import { Panorama } from "../mundo/panorama";
import { Superior, SUP_PISO, SUP_PUNTOS } from "../mundo/superior";
import { CanalPark, CANAL_PISO, CANAL_PUNTOS } from "../mundo/puente";
import { Barrio, BARRIO_PISO, Living, LIV_PISO } from "../mundo/casa";
import { CuadernoGrande, kDe, NotaHeladera } from "./base";
import { RelojRadio } from "./lc02_props";
import {
  AbscesoCorte, aparece, ArcoSol, AvionTachado, BarraLuz, BolsaFarm, CieloGus, cl, CuadernoChico, CurvaFrio, EscanerW, EscenaNB, fmt, FrascoW, Garabato,
  GraficoPotencia, Hinchazon, InteriorGus, LinternaW, ManoLapiz, MapaCuadras, MapaPuerto, MapaUSA, Onda, OreLab, PARKA_A, PARKA_B, PARKA_C, Palitos, ParedGus,
  PilaLibros, PinzasW, PjM, Pulso, RelojPared, Rot, rueda, SetAntartida, SetVacio, Silla, TapaVuela, tr, VENT_G,
} from "./lc02_planos2_comp";

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

// ---------- 41 · Theo encuentra un reloj radiocontrolado ----------
export const P41Reloj: React.FC = () => {
  const f = useF();
  const k = kDe(188.05);
  const S = SUPER_PISO, X = SUPER_PUNTOS.pasillo;
  const repisa = { x: X + 130, y: S - 214 };
  const cara = { x: X + 66, y: S - 262 };
  const tom = k(189.4), sube = k(190.0);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Supermercado} pal={PAL} seed={41}
        claves={[mira(0, X - 60, S - 330, 1.35), mira(k(189.5), X + 20, S - 320, 1.45, { curva: "inout" }), mira(k(190.6), X + 50, S - 300, 2.15, { curva: "inout" }), mira(k(192.6), X + 50, S - 300, 2.15), mira(k(193.4), X + 10, S - 320, 1.8, { curva: "inout" })]}
        medio={<>
          {/* tabla de la góndola donde está el reloj */}
          <rect x={X + 70} y={S - 200} width={160} height={10} fill="#c9cfd2" />
          {f < tom && <RelojW x={repisa.x} y={repisa.y - 18} f={f} s={0.8} />}
          <PjM look={THEO_INV} ruta={[{ f: 0, x: X - 230, y: S }, { f: k(189.2), x: X }]} dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(189.4), v: "duda" }, { f: k(190.79), v: "sorpresa" }, { f: k(192.6), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(189.0), v: { x: 1, y: 0.4 } }, { f: sube, v: { x: 0.8, y: 0.3 } }]}
            ik={(q) => ({ D: q < tom ? repisa : lp(repisa, cara, tr(q, tom, sube)), wD: tr(q, k(188.9), tom), I: q > k(191.2) ? { x: X + 50, y: S - 246 } : null, wI: tr(q, k(191.2), k(191.6)) })}
            mundo={(j, q) => q >= tom ? <><RelojW x={j.manoD.x + 8} y={j.manoD.y - 20} f={q} s={0.8} /><Senal x={j.manoD.x + 8} y={j.manoD.y - 50} f={q} o={tr(q, k(192.7), k(193.0))} /></> : null} />
        </>} />
      <Pildora texto="IT KNOWS THE DATE" x={1140} y={150} desde={k(190.9)} hasta={k(192.7)} color={AMBAR} tam={44} />
      <Pildora texto="RADIO SIGNAL FROM COLORADO" x={1140} y={150} desde={k(193.2)} color={AMBAR} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 42 · la señal de Colorado sigue sonando (mapa) ----------
export const P42Torre: React.FC = () => {
  const f = useF();
  const k = kDe(194.41);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 45%, #1e2540 0%, #0b0e1a 85%)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(960,560) scale(${interpolate(f, [0, 122], [1, 1.08], cl)}) translate(-960,-560)`}>
          <MapaUSA f={f} onda={tr(f, k(194.6), k(195.6))} respaldo={tr(f, k(196.1), k(196.5))} nadie={tr(f, k(197.3), k(197.9))} />
        </g>
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
  const XT = 740;
  const mej = { x: XT + 34, y: COL - 128 };
  const hin = tr(f, k(211.84), k(212.7));
  const dias = Math.round(interpolate(f, [k(214.84), k(215.7)], [0, 14], cl));
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={46} setProps={{ ...LIVN, hora: "alba", fuego: 0.3 }}
        claves={[mira(0, 930, P - 250, 1.55), mira(k(211.6), 900, P - 240, 1.6, { curva: "inout" }), mira(k(212.8), 790, P - 220, 2.4, { curva: "inout" }), mira(k(214.1), 790, P - 220, 2.4), mira(k(214.9), 860, P - 250, 1.75, { curva: "inout" })]}
        medio={<>
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: 1110, y: COL }]} dir={[{ f: 0, v: -1 }]} asiento={AS_PISO} seed={2}
            poses={[{ f: 0, v: { ...{ tronco: 34, cabeza: 30, pI: 85, rI: 0, pD: 70, rD: 95, hI: 50, cI: 90, hD: 55, cD: 100 } } }, { f: k(214.3), v: { tronco: 10, cabeza: 6, pI: 85, rI: 0, pD: 70, rD: 95, hI: 30, cI: 40, hD: 40, cD: 70 } }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(214.4), v: "duda" }]} miradas={[{ f: 0, v: { x: 0, y: 1 } }, { f: k(214.4), v: { x: 1, y: 0 } }]} />
          <path d="M1130,-0 Q1080,-44 1000,-40 L976,-4 Z" transform={`translate(0,${COL})`} fill="#3a5a7a" />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: XT, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
            poses={[{ f: 0, v: { tronco: 36, cabeza: 30, pI: 85, rI: 0, pD: 70, rD: 95, hI: 50, cI: 90, hD: 55, cD: 100 } }, { f: k(210.4), v: { tronco: 36, cabeza: 30, pI: 85, rI: 0, pD: 70, rD: 95, hI: 50, cI: 90, hD: 55, cD: 100 } }, { f: k(211.0), v: "sentadoSuelo" }, { f: k(214.2), v: { ...{ tronco: -6, pI: 85, rI: 0, pD: 70, rD: 95, hI: 40, cI: 120, cabeza: 10 } } }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(210.44), v: "sorpresa" }, { f: k(211.84), v: "triste" }, { f: k(214.2), v: "duda" }, { f: k(215.3), v: "enojo" }]}
            miradas={[{ f: 0, v: { x: 0, y: 1 } }, { f: k(210.5), v: { x: 1, y: -0.2 } }, { f: k(212.0), v: { x: 0.4, y: 0.6 } }, { f: k(214.3), v: { x: 1, y: 0 } }]}
            ik={(q) => ({ D: mej, wD: tr(q, k(211.6), k(212.0)) * (1 - tr(q, k(214.0), k(214.4))) })}
            mundo={(j, q) => <Hinchazon j={j} k={hin} f={q} latido={tr(q, k(212.8), k(213.2))} />} />
          <path d="M720,0 Q770,-46 860,-40 Q880,-30 884,0 Z" transform={`translate(0,${COL})`} fill="#9a3a34" />
        </>} />
      <Pildora texto="DAY 90 · SWOLLEN JAW" x={1350} y={120} desde={k(209.1)} hasta={k(214.7)} color={AMBAR} tam={42} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }} opacity={aparece(f, k(214.7))}>
        <rect x={560} y={96} width={800} height={150} rx={26} fill="rgba(10,14,30,0.66)" stroke={AMBAR} strokeWidth={3} />
        <text x={960} y={140} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={30} fill="#f6ecd2">IGNORED IT FOR 2 WEEKS</text>
        {Array.from({ length: 14 }).map((_, i) => <g key={i}><rect x={600 + i * 52} y={164} width={42} height={58} rx={6} fill="#f6ecd2" />{i < dias && <path d={`M${606 + i * 52},${172} l30,42 M${636 + i * 52},${172} l-30,42`} stroke="#e2483a" strokeWidth={5} strokeLinecap="round" />}</g>)}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 47 · caliente, late: June sabe lo que es (con la linterna) ----------
export const P47Sabe: React.FC = () => {

  const k = kDe(216.08);
  const XT = 690, XJ = 832;
  const boca = { x: XT + 28, y: COL - 128 };
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={47} setProps={{ ...LIVN, fuego: 0.6 }}
        claves={[mira(0, 770, P - 230, 2.0), mira(k(217.1), 750, P - 230, 2.15, { curva: "inout" }), mira(k(218.0), 750, P - 230, 2.15), mira(k(218.6), 820, P - 250, 2.55, { curva: "inout" })]}
        medio={<>
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: XT, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
            poses={[{ f: 0, v: { tronco: -4, cabeza: -14, pI: 85, rI: 0, pD: 70, rD: 95, hI: 30, cI: 30, hD: 30, cD: 60 } }, { f: k(217.2), v: { tronco: -8, cabeza: -18, pI: 85, rI: 0, pD: 70, rD: 95, hI: 40, cI: 120, hD: 30, cD: 60 } }]}
            caras={[{ f: 0, v: "sorpresa" }, { f: k(217.22), v: "miedo" }, { f: k(218.3), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 0.6, y: -0.5 } }, { f: k(218.2), v: { x: 1, y: 0 } }]}
            mundo={(j, q) => <Hinchazon j={j} k={1} f={q} latido={tr(q, k(216.9), k(217.3))} />} />
          <PjM look={JUNE} ruta={[{ f: 0, x: XJ, y: COL }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 0 }]} seed={2}
            poses={[{ f: 0, v: "arrodillado" }]}
            caras={[{ f: 0, v: "duda" }, { f: k(217.3), v: "triste" }, { f: k(218.02), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(218.2), v: { x: 0.2, y: 0 } }]}
            ik={(q) => ({ D: { x: XJ - 56, y: COL - 150 + 4 * Math.sin(q / 5) }, wD: 1, I: { x: XT + 40, y: COL - 112 }, wI: tr(q, k(216.6), k(217.0)) * (1 - tr(q, k(218.0), k(218.4))) })}
            mundo={(j, q) => { const a = (Math.atan2(boca.y - j.manoD.y, boca.x - j.manoD.x) * 180) / Math.PI; return <LinternaW x={j.manoD.x} y={j.manoD.y} ang={a} largo={260} abre={46} />; }} />
        </>} />
      <Pildora texto="HOT · THROBBING" x={1380} y={120} desde={k(216.5)} hasta={k(218.0)} color="#ff8a6a" tam={44} />
      <Pildora texto="JUNE KNOWS EXACTLY WHAT THIS IS" x={1300} y={120} desde={k(218.2)} color={AMBAR} tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 48 · el absceso: infección en la raíz (corte del diente) → por qué asusta ----------
export const P48Absceso: React.FC = () => {
  const f = useF();
  const k = kDe(220.54);
  if (f < k(223.46)) {
    return (
      <AbsoluteFill style={{ background: "#3a2a2a" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(960,540) scale(${interpolate(f, [0, k(223.46)], [1, 1.07], cl)}) translate(-960,-540)`}>
            <AbscesoCorte f={f} inf={tr(f, k(220.8), k(222.0))} flechas={tr(f, k(221.7), k(222.2))} />
          </g>
          <Rot x={960} y={130} t="ABSCESS" o={aparece(f, k(220.62))} tam={60} borde="#e8b23a" />
        </svg>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={48} setProps={{ ...LIVN, fuego: 0.6 }}
        claves={[mira(k(223.46), 760, P - 225, 2.2), mira(k(225.16), 760, P - 225, 2.45, { curva: "inout" })]}
        medio={<PjM look={THEO_CASA} ruta={[{ f: 0, x: 730, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
          poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(223.8), v: { tronco: 4, pI: 85, rI: 0, pD: 70, rD: 95, hI: 45, cI: 140, hD: 45, cD: 140, cabeza: 8 } }]}
          caras={[{ f: 0, v: "triste" }, { f: k(224.2), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(224.2), v: { x: 0.3, y: -0.2 } }]}
          mundo={(j, q) => <Hinchazon j={j} k={1} f={q} latido={0.6} />} />} />
      <Pildora texto="HERE'S WHY THAT'S TERRIFYING" x={1300} y={120} desde={k(223.6)} color="#ff8a6a" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 49 · sin antibióticos: mandíbula → cuello → sangre ----------
export const P49Cabeza: React.FC = () => {
  const f = useF();
  const k = kDe(225.16);
  const X = 820, Y = 905, E = 1.5;
  const t1 = tr(f, k(227.84), k(228.5)), t2 = tr(f, k(228.5), k(229.2)), t3 = tr(f, k(229.8), k(230.3));
  return (
    <AbsoluteFill>
      <EscenaNB Set={SetVacio} pal={PAL} seed={49} setProps={{ color: "#3a2232" }}
        claves={[mira(0, 980, 600, 1.0), mira(k(227.6), 980, 600, 1.02), mira(k(228.6), 930, 540, 1.35, { curva: "inout" })]}
        medio={<PjM look={THEO_CASA} ruta={[{ f: 0, x: X, y: Y }]} dir={[{ f: 0, v: 1 }]} escala={E}
          caras={[{ f: 0, v: "duda" }, { f: k(225.74), v: "triste" }, { f: k(228.4), v: "miedo" }, { f: k(229.8), v: "sorpresa" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(228.4), v: { x: 0.4, y: 0.7 } }, { f: k(229.9), v: { x: 0, y: 1 } }]}
          poses={[{ f: 0, v: "parado" }, { f: k(229.8), v: { hI: 30, cI: 40, tronco: 4, cabeza: 14 } }]}
          ik={(q) => ({ D: q < k(229.1) ? { x: X + 34 * E, y: Y - 225 * E } : { x: X + 22 * E, y: Y - 205 * E }, wD: tr(q, k(228.3), k(228.6)) * (1 - tr(q, k(229.9), k(230.2))) })}
          mundo={(j) => {
            const diente = { x: j.cabeza.x + j.dir * 22 * j.esc, y: j.cabeza.y + 22 * j.esc };
            const mand = { x: j.cabeza.x + j.dir * 8 * j.esc, y: j.cabeza.y + 44 * j.esc };
            const cuello = { x: j.hombro.x, y: j.hombro.y - 4 };
            const seg = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => t > 0 ? <path d={`M${a.x},${a.y} L${lerp(a.x, b.x, t)},${lerp(a.y, b.y, t)}`} stroke="#ff3a2e" strokeWidth={14} strokeLinecap="round" opacity={0.9} /> : null;
            return (
              <g>
                <circle cx={diente.x} cy={diente.y} r={16 + 4 * Math.sin(f / 3)} fill="#ff3a2e" opacity={0.8} />
                {seg(diente, mand, t1)}{seg(mand, cuello, t2)}
                {seg(cuello, j.cad, t3)}{seg(cuello, j.manoD, t3 * 0.8)}{seg(cuello, j.manoI, t3 * 0.8)}
                {t3 > 0 && <circle cx={j.cad.x} cy={(j.cad.y + cuello.y) / 2} r={70 * t3} fill="#ff3a2e" opacity={0.25 * t3} />}
              </g>
            );
          }} />} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Rot x={1500} y={300} t="NO ANTIBIOTICS?" o={aparece(f, k(225.74), k(227.6))} tam={52} borde="#ff3a2e" />
        <Rot x={1480} y={330} t="1 · JAW" o={aparece(f, k(228.4))} tam={46} borde="#ff3a2e" anchor="start" />
        <Rot x={1480} y={430} t="2 · NECK" o={aparece(f, k(229.1))} tam={46} borde="#ff3a2e" anchor="start" />
        <Rot x={1480} y={530} t="3 · BLOOD" o={aparece(f, k(229.8))} tam={46} borde="#ff3a2e" anchor="start" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 50 · la gente moría por un diente; ya no hay dentistas ----------
export const P50Dentista: React.FC = () => {
  const f = useF();
  const k = kDe(230.4);
  const X = SUP_PUNTOS.dentista, S = SUP_PISO;
  const manija = { x: X - 22, y: S - 118 };
  const n = rueda(f, k(232.5), k(233.5), 202000, 0);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Superior} pal={PAL} seed={50} setProps={{ hora: "dia", luces: 0, nieve: 1 }}
        claves={[mira(0, X - 160, S - 330, 1.5), mira(k(232.4), X - 120, S - 320, 1.55, { curva: "inout" }), mira(k(233.2), X - 110, S - 300, 1.8, { curva: "inout" })]}
        medio={<>
          <g transform={`translate(${X},${S})`}>
            <rect x={-60} y={-250} width={120} height={250} fill="#2a3440" stroke="#e8e2d8" strokeWidth={8} />
            <rect x={-46} y={-236} width={92} height={150} fill="#141a22" />
            <rect x={-60} y={-130} width={30} height={8} rx={3} fill="#c8ccd4" />
            <g transform={`rotate(${Math.sin(f / 5) * 3} 0 -200)`}><line x1={-20} y1={-236} x2={0} y2={-200} stroke="#c8ccd4" strokeWidth={2} /><line x1={20} y1={-236} x2={0} y2={-200} stroke="#c8ccd4" strokeWidth={2} /><rect x={-46} y={-200} width={92} height={36} rx={4} fill="#c0352c" /><text x={0} y={-174} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={22} fill="#fff">CLOSED</text></g>
          </g>
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: X - 420, y: S }, { f: k(231.6), x: X - 92 }]} seed={2}
            caras={[{ f: 0, v: "determinado" }, { f: k(231.9), v: "duda" }, { f: k(232.6), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(232.6), v: { x: -0.2, y: 0.1 } }]}
            dir={[{ f: 0, v: 1 }, { f: k(232.7), v: -1 }]}
            ik={(q) => ({ D: { x: manija.x + (q > k(231.8) && q < k(232.5) ? 4 * Math.sin(q * 1.6) : 0), y: manija.y }, wD: tr(q, k(231.4), k(231.8)) * (1 - tr(q, k(232.5), k(232.7))) })}
            poses={[{ f: 0, v: "parado" }, { f: k(232.7), v: "encogerse" }]} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Rot x={1180} y={160} t="PEOPLE DIED FROM BAD TEETH" o={aparece(f, k(230.5), k(232.3))} tam={44} />
        <g opacity={aparece(f, k(232.4))}>
          <rect x={860} y={100} width={680} height={170} rx={28} fill="rgba(10,14,30,0.66)" stroke="#e2483a" strokeWidth={3} />
          <text x={1200} y={150} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={30} fill="#f6ecd2">DENTISTS LEFT ON EARTH</text>
          <text x={1200} y={244} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={80} fill={n === 0 ? "#e2483a" : "#f6ecd2"}>{fmt(n)}</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 51 · la farmacia, a tres cuadras (June sale de casa; el mapa traza la ruta) ----------
export const P51Farmacia: React.FC = () => {
  const f = useF();
  const k = kDe(233.98);
  const X = 1900;
  return (
    <AbsoluteFill>
      <EscenaNB Set={Barrio} pal={PAL} seed={51} setProps={{ hora: "invierno", luces: 0, nieve: 1, cae: true, humo: 0.6 }}
        claves={[mira(0, X + 60, B - 300, 1.6), mira(k(235.0), X + 120, B - 300, 1.6, { curva: "inout" }), mira(k(237.38), X + 300, B - 310, 1.45, { curva: "inout" })]}
        medio={<PjM look={JUNE_INV} ruta={[{ f: 0, x: X, y: B }, { f: k(234.5), x: X }, { f: k(237.38), x: X + 470 }]} seed={2} luz={BORDE_FRIO}
          dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: k(234.5), v: { tronco: 10 } }]}
          caras={[{ f: 0, v: "duda" }, { f: k(234.9), v: "determinado" }]}
          miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(234.9), v: { x: 1, y: 0 } }]}
          ik={(q) => ({ D: { x: X + 30, y: B - 190 }, wD: q < k(234.4) ? 1 - tr(q, k(234.1), k(234.4)) : 0 })}
          opacidad={(q) => tr(q, 0, 6)} />} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <MapaCuadras x={1260} y={110} p={tr(f, k(235.0), k(236.6))} f={f} o={aparece(f, k(234.8))} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 52 · en la tormenta: linterna en los dientes, vuelve con la bolsa ----------
export const P52Tormenta: React.FC = () => {
  const f = useF();
  const k = kDe(237.38);
  const X = SUP_PUNTOS.farmacia, S = SUP_PISO;
  const vuelta = f >= k(240.86);
  const enDientes = f >= k(239.96);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Superior} pal={PAL} seed={52} setProps={{ hora: "tormenta", luces: 0, nieve: 1, cae: true }}
        claves={vuelta ? [mira(k(240.86), X - 60, S - 300, 1.7), mira(k(242.14), X - 160, S - 300, 1.75, { curva: "inout" })] : [mira(0, X - 560, S - 300, 1.6), mira(k(239.9), X - 380, S - 280, 1.7, { curva: "inout" }), mira(k(240.6), X - 330, S - 270, 2.1, { curva: "inout" })]}
        medio={vuelta ? (
          <PjM look={JUNE_INV} ruta={[{ f: k(240.86), x: X + 40, y: S }, { f: k(242.14), x: X - 260 }]} dir={[{ f: 0, v: -1 }]} seed={3} luz={BORDE_FRIO}
            poses={[{ f: 0, v: { tronco: 16 } }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]}
            ik={() => ({ D: { x: X - 140, y: S - 150 }, wD: 0 })}
            mundo={(j, q) => <><LinternaW x={j.boca.x} y={j.boca.y} ang={j.dir < 0 ? 172 : 8} largo={330} abre={60} /><BolsaFarm x={j.manoD.x} y={j.manoD.y} s={tr(q, k(241.4), k(241.7))} /></>} />
        ) : (
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: X - 820, y: S }, { f: k(240.86), x: X - 250 }]} dir={[{ f: 0, v: 1 }]} seed={2} luz={BORDE_FRIO}
            poses={[{ f: 0, v: { tronco: 18, cabeza: -6 } }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(238.5), v: "enojo" }, { f: k(239.96), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }]}
            ik={(q) => ({ D: q < k(239.6) ? { x: 0, y: 0 } : null, wD: 0, I: enDientes ? null : { x: 0, y: 0 }, wI: 0 })}
            extra={(p, q) => q >= k(239.16) && q < k(239.96) ? { ...p, hD: 70, cD: 40 } : p}
            mundo={(j, q) => q < k(239.16) ? null : q < k(239.96) ? <LinternaW x={j.manoD.x} y={j.manoD.y} ang={10} largo={330} abre={60} /> : <LinternaW x={j.boca.x} y={j.boca.y} ang={6} largo={360} abre={60} />} />
        )} />
      <Pildora texto="A SNOWSTORM · 3 BLOCKS ON FOOT" x={1250} y={130} desde={k(238.5)} hasta={k(240.7)} color="#cfe0ff" tam={40} />
      <Pildora texto="FLASHLIGHT IN HER TEETH" x={1250} y={130} desde={k(240.0)} hasta={k(240.8)} color={AMBAR} tam={40} />
      <Pildora texto="BACK WITH A BAG" x={1250} y={130} desde={k(241.6)} color={AMBAR} tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 53 · antibióticos en la mesa: todavía sirven (pierden fuerza de a poco) ----------
export const P53Frasco: React.FC = () => {
  const f = useF();
  const k = kDe(242.14);
  const MT = P - 176;
  const bolsa = { x: 2470, y: MT };
  const alto = { x: 2470, y: P - 268 };
  const B2 = f >= k(246.0);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={53} setProps={{ ...LIVN, vela: true }}
        claves={B2 ? [mira(k(246.0), 2540, P - 378, 1.5), mira(k(252.28), 2540, P - 378, 1.58, { curva: "inout" })] : [mira(0, 2540, P - 290, 1.6), mira(k(243.6), 2500, P - 270, 2.0, { curva: "inout" }), mira(k(245.8), 2500, P - 270, 2.1)]}
        medio={<>
          <Silla x={2380} piso={P} alto={100} respaldo={false} />
          <Silla x={2700} piso={P} alto={100} respaldo={false} dir={-1} />
          <BolsaFarm x={2430} y={MT - 52} />
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: 2380, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={AS_TAB} poses={[{ f: 0, v: "sentado" }]} seed={2}
            caras={[{ f: 0, v: "determinado" }, { f: k(243.9), v: "feliz" }, { f: k(247.5), v: "duda" }, { f: k(250.1), v: "determinado" }, { f: k(251.0), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 0.8, y: 0.6 } }, { f: k(243.2), v: { x: 0.7, y: -0.3 } }, { f: k(246.3), v: { x: 1, y: 0 } }]}
            habla={[[k(250.9), k(251.6)]]}
            ik={(q) => ({ D: q < k(242.8) ? bolsa : lp(bolsa, alto, tr(q, k(242.8), k(243.6))), wD: 1 })}
            mundo={(j, q) => q >= k(242.7) ? <FrascoW x={j.manoD.x + 4} y={j.manoD.y - 6} s={1.1} rot={q > k(246.2) && q < k(247.0) ? 14 * Math.sin((q - k(246.2)) / 3) : 0} /> : null} />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: 2700, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={AS_TAB} poses={[{ f: 0, v: "sentado" }, { f: k(244.4), v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 40, cD: 130 } }]}
            caras={[{ f: 0, v: "triste" }, { f: k(244.3), v: "duda" }, { f: k(246.7), v: "sorpresa" }, { f: k(251.2), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.3 } }]}
            mundo={(j, q) => <Hinchazon j={j} k={1} f={q} latido={0.4} />} />
        </>} />
      {!B2 && <Pildora texto="ANTIBIOTICS · WHAT DENTISTS PRESCRIBE" x={1150} y={140} desde={k(243.9)} color={AMBAR} tam={40} />}
      {B2 && <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <GraficoPotencia x={660} y={140} p={tr(f, k(247.4), k(251.0))} fecha={tr(f, k(246.2), k(246.7))} corte={tr(f, k(250.9), k(251.4))} />
      </svg>}
    </AbsoluteFill>
  );
};

// ---------- 54 · el consultorio dental: sale con unas pinzas ----------
export const P54Pinzas: React.FC = () => {
  const f = useF();
  const k = kDe(252.28);
  const X = SUP_PUNTOS.dentista, S = SUP_PISO;
  const dentro = f >= k(254.1) && f < k(255.46);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Superior} pal={PAL} seed={54} setProps={{ hora: "dia", luces: 0, nieve: 1 }}
        claves={[mira(0, X - 260, S - 320, 1.5), mira(k(254.0), X - 60, S - 320, 1.5, { curva: "inout" }), mira(k(256.0), X - 120, S - 320, 1.55, { curva: "inout" }), mira(k(257.6), X - 150, S - 320, 1.6), mira(k(258.3), X - 180, S - 290, 2.4, { curva: "inout" })]}
        medio={<>
          <g transform={`translate(${X},${S})`}>
            <rect x={-60} y={-250} width={120} height={250} fill={dentro || (f > k(253.9) && f < k(255.7)) ? "#0d1016" : "#2a3440"} stroke="#e8e2d8" strokeWidth={8} />
            {!(f > k(253.9) && f < k(255.7)) && <rect x={-46} y={-236} width={92} height={150} fill="#141a22" />}
          </g>
          {!dentro && <PjM look={JUNE_INV} seed={2} luz={BORDE_FRIO}
            ruta={f < k(254.1) ? [{ f: 0, x: X - 520, y: S }, { f: k(254.0), x: X }] : [{ f: k(255.46), x: X, y: S }, { f: k(257.4), x: X - 200 }]}
            dir={f < k(254.1) ? [{ f: 0, v: 1 }] : [{ f: 0, v: -1 }]}
            opacidad={(q) => (q < k(254.1) ? 1 - tr(q, k(253.85), k(254.1)) : tr(q, k(255.46), k(255.7)))}
            caras={[{ f: 0, v: "determinado" }, { f: k(255.5), v: "duda" }, { f: k(256.12), v: "triste" }, { f: k(257.7), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(256.2), v: { x: 0.8, y: 0.5 } }]}
            ik={(q) => ({ D: { x: X - 170 + (q - k(255.46)) * -3.4 - 30, y: S - 210 }, wD: q > k(255.5) ? tr(q, k(255.6), k(256.1)) : 0 })}
            mundo={(j, q) => q > k(255.46) ? <PinzasW x={j.manoD.x} y={j.manoD.y} rot={-70} s={1.4} /> : null} />}
        </>} />
      <Pildora texto="DENTAL OFFICE · SUPERIOR STREET" x={1250} y={130} desde={k(253.4)} hasta={k(255.4)} color={AMBAR} tam={40} />
      <Pildora texto="SOMETHING WORSE" x={1250} y={130} desde={k(256.1)} hasta={k(257.6)} color="#ff8a6a" tam={44} />
      <Pildora texto="EXTRACTION FORCEPS" x={1250} y={130} desde={k(257.8)} color="#ff8a6a" tam={48} />
    </AbsoluteFill>
  );
};

// ---------- 55 · a la luz de la vela: cuatro minutos (el reloj de pared) ----------
export const P55Vela: React.FC = () => {
  const f = useF();
  const k = kDe(259.28);
  const XT = 2700, XJ = 2545;
  const boca = { x: XT - 28, y: P - 226 };
  const min = interpolate(f, [k(260.9), k(262.5)], [0, 4], cl);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={55} setProps={{ ...LIVN, vela: true }}
        claves={[mira(0, 2620, P - 260, 2.0), mira(k(260.6), 2620, P - 260, 2.05, { curva: "inout" }), mira(k(261.3), 2560, P - 420, 1.9, { curva: "inout" }), mira(k(263.32), 2560, P - 420, 1.95)]}
        medio={<>
          <RelojPared x={2480} y={P - 560} r={50} min={min} hora={10} />
          <Silla x={XT} piso={P} alto={100} respaldo={false} dir={-1} />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: XT, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={AS_TAB}
            poses={[{ f: 0, v: { tronco: -10, cabeza: -18, pI: 88, rI: 88, pD: 92, rD: 92, hI: 20, cI: 60, hD: 20, cD: 50 } }]}
            caras={[{ f: 0, v: "miedo" }, { f: k(261.5), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.5, y: -0.6 } }]}
            mundo={(j, q) => <Hinchazon j={j} k={1} f={q} latido={0.5} />} />
          <PjM look={JUNE} ruta={[{ f: 0, x: XJ, y: P }]} dir={[{ f: 0, v: 1 }]} seed={2}
            poses={[{ f: 0, v: { tronco: 14, pI: -10, pD: 14 } }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(262.3), v: "enojo" }]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }]}
            ik={(q) => ({ D: { x: boca.x - 14 + (q > k(261.2) ? 4 * Math.sin(q * 1.3) : 0), y: boca.y + 6 }, wD: tr(q, k(259.5), k(260.2)), I: { x: XT - 30, y: P - 270 }, wI: tr(q, k(259.8), k(260.4)) })}
            mundo={(j) => <PinzasW x={j.manoD.x} y={j.manoD.y} rot={70} s={1.3} />} />
        </>} />
      <Pildora texto="WE'LL SKIP THE DETAILS" x={1250} y={130} desde={k(260.7)} hasta={k(262.2)} color="#f6ecd2" tam={40} />
      <Temporizador seg={min * 60} x={1500} y={130} desde={k(262.3)} tam={52} color="#ff8a6a" />
    </AbsoluteFill>
  );
};

// ---------- 56 · los 4 minutos más largos; June se lava las manos en la nieve ----------
export const P56Nieve: React.FC = () => {
  const f = useF();
  const k = kDe(263.32);
  if (f < k(267.5)) {
    return (
      <AbsoluteFill>
        <EscenaNB Set={Living} pal={PAL} seed={56} setProps={{ ...LIVN, fuego: 0.7 }}
          claves={[mira(0, 930, P - 230, 1.7), mira(k(266.0), 960, P - 230, 1.8, { curva: "inout" }), mira(k(267.5), 1010, P - 250, 1.6, { curva: "inout" })]}
          medio={<>
            <PjM look={THEO_CASA} ruta={[{ f: 0, x: 740, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
              poses={[{ f: 0, v: { tronco: 26, cabeza: 22, pI: 85, rI: 0, pD: 70, rD: 95, hI: 50, cI: 90, hD: 40, cD: 140 } }]}
              caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.3, y: 1 } }]} />
            <PjM look={JUNE} ruta={[{ f: 0, x: 1060, y: COL }, { f: k(266.6), x: 1060 }, { f: k(267.5), x: 1420, y: P }]} asiento={[{ f: 0, v: 8 }, { f: k(266.2), v: undefined }]} seed={2}
              dir={[{ f: 0, v: -1 }, { f: k(266.3), v: 1 }]}
              poses={[{ f: 0, v: { tronco: 20, cabeza: 20, pI: 85, rI: 0, pD: 70, rD: 95, hI: 40, cI: 100, hD: 45, cD: 110 } }, { f: k(266.2), v: "parado" }]}
              caras={[{ f: 0, v: "triste" }, { f: k(264.2), v: "cansado" }, { f: k(266.1), v: "neutral" }]}
              miradas={[{ f: 0, v: { x: 0.6, y: 1 } }, { f: k(266.3), v: { x: 1, y: 0 } }]}
              extra={(p, q) => q < k(266.2) ? { ...p, hD: p.hD + 3 * Math.sin(q * 2.2), hI: p.hI + 3 * Math.sin(q * 2.5) } : p} />
          </>} />
        <Pildora texto="THE LONGEST 4 MINUTES OF HER LIFE" x={1200} y={130} desde={k(264.1)} color={AMBAR} tam={40} />
      </AbsoluteFill>
    );
  }
  const X = 1700;
  return (
    <AbsoluteFill>
      <EscenaNB Set={Barrio} pal={PAL} seed={57} setProps={{ hora: "noche", luces: 0, nieve: 1, cae: true, humo: 0.5 }}
        claves={[mira(k(267.5), X + 40, B - 170, 2.3), mira(k(268.5), X + 40, B - 170, 2.3), mira(k(271.3), X + 120, B - 260, 1.45, { curva: "inout" })]}
        medio={<PjM look={JUNE} ruta={[{ f: 0, x: X, y: B }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "arrodillado" }]} asiento={[{ f: 0, v: 0 }]} seed={2} luz={BORDE_FRIO}
          caras={[{ f: 0, v: "triste" }, { f: k(269.3), v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.8, y: 1 } }]}
          ik={(q) => { const t = Math.sin(q * 0.55); return { D: { x: X + 74 + 12 * t, y: B - 46 - 6 * Math.abs(t) }, I: { x: X + 66 - 12 * t, y: B - 50 }, wD: 1, wI: 1 }; }}
          mundo={(j, q) => <>{[0, 1, 2].map((i) => { const c = ((q / 26 + i / 3) % 1); return <circle key={i} cx={j.boca.x + j.dir * (10 + c * 50)} cy={j.boca.y - c * 30} r={8 + c * 20} fill="#eef2fa" opacity={0.45 * (1 - c)} />; })}{Array.from({ length: 6 }).map((_, i) => <circle key={`n${i}`} cx={j.manoD.x + Math.sin(q / 3 + i) * 20} cy={j.manoD.y + 10 - ((q * 1.5 + i * 7) % 24)} r={3} fill="#fff" opacity={0.8} />)}</>} />} />
      <Pildora texto="SHE WASHES HER HANDS IN THE SNOW" x={1200} y={130} desde={k(267.7)} color="#cfe0ff" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 57 · diez días después: la hinchazón se fue (día 100) ----------
export const P57Sonrie: React.FC = () => {
  const f = useF();
  const k = kDe(271.3);
  const XT = 1150, XJ = 1310;
  const osc = tr(f, k(275.5), k(276.3));
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={58} setProps={{ ...LIVN, hora: "dia", fuego: 0.4 }}
        claves={[mira(0, 1230, P - 250, 1.9), mira(k(272.5), 1200, P - 250, 2.3, { curva: "inout" }), mira(k(274.0), 1200, P - 250, 2.3), mira(k(275.0), 1230, P - 300, 1.6, { curva: "inout" })]}
        medio={<>
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: XT, y: P }]} dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(272.6), v: "risa" }, { f: k(274.0), v: "feliz" }, { f: k(275.6), v: "duda" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(275.6), v: { x: 0.2, y: -0.4 } }]}
            poses={[{ f: 0, v: { cabeza: -12 } }, { f: k(272.6), v: { cabeza: 0, hI: 10 } }, { f: k(273.8), v: "celebrar" }, { f: k(274.6), v: "parado" }]}
            mundo={(j, q) => <Hinchazon j={j} k={1 - tr(q, k(271.6), k(272.9))} f={q} />} />
          <PjM look={JUNE} ruta={[{ f: 0, x: XJ, y: P }]} dir={[{ f: 0, v: -1 }]} seed={2}
            caras={[{ f: 0, v: "duda" }, { f: k(272.7), v: "feliz" }, { f: k(275.6), v: "neutral" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.1 } }, { f: k(275.6), v: { x: -0.2, y: -0.4 } }]}
            ik={(q) => ({ D: { x: XT + 36, y: P - 228 }, wD: tr(q, k(271.4), k(271.9)) * (1 - tr(q, k(272.8), k(273.2))) })} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={1920} height={1080} fill="#0a0814" opacity={0.45 * osc} />
        <Rot x={1250} y={130} t="10 DAYS LATER" o={aparece(f, k(271.3), k(272.4))} tam={44} />
        <Rot x={1250} y={130} t="SWELLING: GONE" o={aparece(f, k(272.6), k(273.7))} tam={44} borde="#7ad08a" />
        <Rot x={1250} y={130} t="DAY 100" o={aparece(f, k(273.8), k(275.4))} tam={56} />
        <Rot x={1250} y={130} t="THEN THE PROBLEM CHANGES" o={aparece(f, k(275.6))} tam={44} borde="#cfc8e8" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 58 · no es el frío: es el silencio ----------
export const P58Silencio: React.FC = () => {
  const f = useF();
  const k = kDe(276.84);
  const amp = 1 - tr(f, k(278.2), k(279.2));
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={59} setProps={{ ...LIVN, hora: "invierno" }}
        claves={[mira(0, 1270, P - 290, 1.6), mira(k(282.1), 1270, P - 290, 1.65, { curva: "inout" }), mira(k(283.3), 1110, P - 250, 2.1, { curva: "inout" })]}
        medio={<>
                    <PjM look={THEO_CASA} ruta={[{ f: 0, x: 1060, y: COL }]} asiento={AS_PISO}
            dir={[{ f: 0, v: 1 }, { f: k(279.5), v: -1 }]}
            poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(279.5), v: { tronco: 20, cabeza: 16, pI: 85, rI: 0, pD: 70, rD: 95, hI: 40, cI: 110, hD: 45, cD: 115 } }, { f: k(282.8), v: { tronco: 10, cabeza: 10, pI: 85, rI: 0, pD: 70, rD: 95, hI: 45, cI: 140, hD: 45, cD: 140 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(278.3), v: "triste" }, { f: k(282.8), v: "duda" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(279.5), v: { x: 1, y: 0.8 } }, { f: k(282.9), v: { x: 0.2, y: -0.6 } }]}
            mundo={(j, q) => <Garabato x={j.cabeza.x} y={j.cabeza.y - 80} p={tr(q, k(282.8), k(283.8))} f={q} s={1.1} />} />
          <PjM look={JUNE} ruta={[{ f: 0, x: 1480, y: P }]} seed={2}
            dir={[{ f: 0, v: -1 }, { f: k(279.6), v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(279.6), v: "brazosCruzados" }, { f: k(281.5), v: { tronco: 6, cabeza: 14, hI: 30, cI: 115, hD: 35, cD: 110 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(278.3), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(279.6), v: { x: 1, y: 0.2 } }]} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g opacity={1 - tr(f, k(282.0), k(282.4))}><Onda x={700} y={190} w={560} amp={amp} f={f} rotulo={amp > 0.5 ? "TALK" : "SILENCE"} /></g>
        <Rot x={1250} y={130} t="ISOLATION" o={aparece(f, k(282.3))} tam={52} borde="#cfc8e8" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 59 · los investigadores polares de la Antártida ----------
export const P59Antartida: React.FC = () => {
  const f = useF();
  const k = kDe(284.2);
  const S = 900;
  const xs = [620, 960, 1300];
  const mira3 = f >= k(291.1);
  return (
    <AbsoluteFill>
      <EscenaNB Set={SetAntartida} pal={PAL} seed={60}
        claves={[mira(0, 960, 520, 1.0), mira(k(287.4), 960, 560, 1.15, { curva: "inout" }), mira(k(287.7), 700, 640, 1.9, { curva: "inout" }), mira(k(288.7), 960, 640, 1.9, { curva: "inout" }), mira(k(289.4), 1260, 640, 1.9, { curva: "inout" }), mira(k(290.9), 1260, 640, 1.9), mira(k(291.8), 960, 600, 1.25, { curva: "inout" }), mira(k(293.5), 960, 610, 1.4, { curva: "inout" })]}
        medio={<>
          <PjM look={PARKA_A} ruta={[{ f: 0, x: xs[0], y: S }]} dir={[{ f: 0, v: 1 }, { f: k(291.2), v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(287.68), v: "manosCara" }, { f: k(288.6), v: { tronco: 8, cabeza: 14, hI: 10, hD: 10 } }, { f: k(291.2), v: "firme" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(287.68), v: "cansado" }, { f: k(291.2), v: "neutral" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(291.2), v: { x: 0, y: 0 } }]} />
          <PjM look={PARKA_B} ruta={[{ f: 0, x: xs[1], y: S }]} dir={[{ f: 0, v: -1 }]} seed={2}
            poses={[{ f: 0, v: "parado" }, { f: k(288.76), v: "brazosCruzados" }, { f: k(289.3), v: "manosCintura" }, { f: k(291.2), v: "firme" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(288.76), v: "enojo" }, { f: k(291.2), v: "neutral" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(291.2), v: { x: 0, y: 0 } }]} />
          <PjM look={PARKA_C} ruta={[{ f: 0, x: xs[2], y: S }]} dir={[{ f: 0, v: -1 }]} seed={3}
            caras={[{ f: 0, v: "neutral" }, { f: k(289.42), v: "duda" }, { f: k(291.2), v: "neutral" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(289.5), v: { x: 0.5, y: 0.8 } }, { f: k(291.2), v: { x: 0, y: 0 } }]}
            poses={[{ f: 0, v: "parado" }, { f: k(291.2), v: "firme" }]}
            ik={(q) => ({ I: { x: xs[2] - 40, y: S - 200 }, wI: tr(q, k(289.4), k(289.8)) * (1 - tr(q, k(290.8), k(291.1))), D: { x: xs[2] - 52, y: S - 222 }, wD: tr(q, k(289.5), k(289.9)) * (1 - tr(q, k(290.8), k(291.1))) })} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Rot x={1180} y={130} t="POLAR RESEARCHERS · ANTARCTICA" o={aparece(f, k(284.3), k(287.4))} tam={42} borde="#9fd3ff" />
        <Rot x={1180} y={130} t="TROUBLE SLEEPING" o={aparece(f, k(287.7), k(288.7))} tam={46} borde="#9fd3ff" />
        <Rot x={1180} y={130} t="IRRITABILITY" o={aparece(f, k(288.8), k(289.4))} tam={46} borde="#e2483a" />
        <Rot x={1180} y={130} t="LOSING TRACK OF TIME" o={aparece(f, k(289.5), k(291.0))} tam={46} borde={AMBAR} />
        <Rot x={1180} y={130} t="STARING FOR HOURS" o={aparece(f, k(291.2))} tam={46} borde="#cfc8e8" />
      </svg>
      {mira3 && null}
    </AbsoluteFill>
  );
};

// ---------- 60 · la mirada: Theo frente a la ventana; ningún avión en primavera ----------
export const P60Mirada: React.FC = () => {
  const f = useF();
  const k = kDe(293.5);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={61} setProps={{ ...LIVN, hora: "invierno", nieveAfuera: 1, cae: true }}
        claves={[mira(0, 1320, P - 270, 2.3), mira(k(294.8), 1320, P - 270, 2.3), mira(k(295.8), 1080, P - 300, 1.45, { curva: "inout" })]}
        medio={<>
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: 1340, y: P }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: "firme" }]} caras={[{ f: 0, v: "neutral" }, { f: k(297.4), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 0, y: 0 } }, { f: k(297.4), v: { x: 1, y: 0.4 } }]} />
          <PjM look={JUNE} ruta={[{ f: 0, x: 760, y: COL }]} asiento={AS_PISO} dir={[{ f: 0, v: 1 }]} seed={2}
            poses={[{ f: 0, v: { tronco: 20, cabeza: 18, pI: 85, rI: 0, pD: 70, rD: 95, hI: 45, cI: 120, hD: 50, cD: 120 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(295.2), v: "triste" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.9 } }, { f: k(295.2), v: { x: 1, y: 0 } }]} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Rot x={1250} y={130} t="IT EVEN HAS A NAME" o={aparece(f, k(293.5), k(294.9))} tam={44} borde="#cfc8e8" />
        <Rot x={1250} y={130} t="BUT NO STATION · NO PLANE IN SPRING" o={aparece(f, k(296.7))} tam={40} borde="#e2483a" />
        <AvionTachado x={1500} y={290} p={tr(f, k(297.2), k(297.8))} tacha={tr(f, k(297.9), k(298.5))} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 61 · nadie viene, nunca (en el mirador, frente a la ciudad vacía) ----------
export const P61Nadie: React.FC = () => {
  const f = useF();
  const k = kDe(298.89);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Panorama} pal={PAL} seed={61} setProps={{ hora: "invierno", luces: 0, ventana: 1, nieve: 1, cae: true, vapor: 0.8 }}
        claves={[mira(0, 640, 640, 1.9), mira(k(300.87), 820, 600, 1.25, { curva: "inout" })]}
        medio={<>
          <PjM look={THEO_INV} ruta={[{ f: 0, x: 560, y: 900 }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "parado" }, { f: k(299.9), v: { cabeza: 12, tronco: 4 } }]}
            caras={[{ f: 0, v: "duda" }, { f: k(299.97), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: -0.1 } }, { f: k(300.0), v: { x: 0.6, y: 0.8 } }]} />
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: 740, y: 900 }]} dir={[{ f: 0, v: 1 }]} seed={2} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "brazosCruzados" }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <text x={1220} y={300} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={60} fill="#f6ecd2" opacity={aparece(f, k(298.95))}>NOBODY IS COMING.</text>
        <text x={1220} y={420} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={110} fill="#e2483a" opacity={aparece(f, k(299.97))}>EVER.</text>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 62 · la tercera regla: una cosa por día, no para sobrevivir (June la escribe) ----------
export const P62Regla3: React.FC = () => {
  const f = useF();
  const k = kDe(300.87);
  if (f < k(302.0)) {
    return (
      <AbsoluteFill>
        <EscenaNB Set={Living} pal={PAL} seed={62} setProps={{ ...LIVN, hora: "dia", fuego: 0.4 }}
          claves={[mira(0, 3060, P - 300, 1.6), mira(k(302.0), 3160, P - 360, 1.95, { curva: "inout" })]}
          medio={<PjM look={JUNE} ruta={[{ f: 0, x: 2860, y: P }, { f: k(301.6), x: 3100 }]} dir={[{ f: 0, v: 1 }]} seed={2}
            caras={[{ f: 0, v: "determinado" }, { f: k(301.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(301.4), v: { x: 1, y: -0.8 } }]}
            ik={(q) => ({ D: { x: 3190, y: P - 300 }, wD: tr(q, k(301.4), k(301.9)) })}
            mundo={(j, q) => q > k(301.3) ? <path d={`M${j.manoD.x},${j.manoD.y} l10,-34`} stroke="#e0a23a" strokeWidth={5} strokeLinecap="round" /> : null} />} />
        <Pildora texto="RULE NUMBER 3" x={1100} y={130} desde={k(301.0)} color={AMBAR} tam={44} />
      </AbsoluteFill>
    );
  }
  const X = 560, Y = 190, T = 60, W = 840;
  const d3 = k(302.95);
  const n = Math.min(20, Math.max(0, Math.floor((f - d3) / 1.6) + 1));
  const tipL = { x: X + 54 + n * T * 0.5, y: Y + 44 + 64 + 2 * T * 1.3 + T * 0.95 };
  const fin = d3 + 20 * 1.6;
  const tip = f > fin ? lp(tipL, { x: X + 620, y: Y + 520 }, tr(f, fin + 6, fin + 20)) : tipL;
  const g = tr(f, k(304.7), k(305.1));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #d8d2c4 0%, #8a8478 90%)" }}>
      <NotaHeladera titulo="JUNE'S RULES" renglones={[{ t: "1. FRESH FOOD FIRST", desde: -999 }, { t: "2. NOTHING RISKY ALONE", desde: -999 }, { t: "3. ONE THING FOR FUN", desde: d3 }]} x={X} y={Y} w={W} tam={T} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`rotate(-2 ${X + W / 2} ${Y + 300})`}><ManoLapiz tx={tip.x} ty={tip.y} manga="#2f7f86" desdeX={1980} desdeY={1200} /></g>
        <Rot x={1560} y={940} t="NOT FOR SURVIVAL" o={g} tam={44} borde="#e2483a" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 63 · Theo lee en voz alta los libros de la biblioteca ----------
export const P63Lee: React.FC = () => {
  const f = useF();
  const k = kDe(305.89);
  const XT = 800;
  const libro = { x: XT + 66, y: COL - 128 };
  const hoja = tr(f, k(307.4), k(307.8));
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={63} setProps={{ ...LIVN, hora: "invierno" }}
        claves={[mira(0, 820, P - 230, 2.0), mira(k(308.35), 800, P - 240, 2.2, { curva: "inout" })]}
        medio={<>
          <PilaLibros x={660} piso={COL} n={6} />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: XT, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
            caras={[{ f: 0, v: "neutral" }, { f: k(306.1), v: "feliz" }, { f: k(307.5), v: "sorpresa" }, { f: k(307.9), v: "risa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.6 } }]} habla={[[k(306.1), k(307.4)], [k(307.9), k(308.35)]]}
            ik={() => ({ D: { x: libro.x + 22, y: libro.y + 8 }, I: { x: libro.x - 18, y: libro.y + 10 }, wD: 1, wI: 1 })}
            mundo={() => (
              <g transform={`translate(${libro.x},${libro.y}) rotate(-12)`}>
                <rect x={-40} y={-30} width={80} height={56} rx={3} fill="#3a5a8a" />
                <rect x={-36} y={-27} width={34} height={50} fill="#f8f2e2" /><rect x={2} y={-27} width={34} height={50} fill="#f8f2e2" />
                {[0, 1, 2, 3].map((i) => <rect key={i} x={-32} y={-18 + i * 10} width={26} height={2} fill="#9a948a" />)}
                {hoja > 0 && hoja < 1 && <rect x={2 - 34 * hoja * 2 + (hoja > 0.5 ? 34 * (hoja - 0.5) * 4 : 0)} y={-27} width={Math.abs(34 * Math.cos(hoja * Math.PI))} height={50} fill="#ffffff" />}
              </g>
            )} />
        </>} />
      <Pildora texto="LIBRARY BOOKS · READ ALOUD" x={1250} y={130} desde={k(306.9)} color={AMBAR} tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 64 · June le enseña a tomar el pulso ----------
export const P64Pulso: React.FC = () => {
  const f = useF();
  const k = kDe(308.35);
  const XT = 760, XJ = 960;
  const mun = { x: 860, y: COL - 100 };
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={64} setProps={{ ...LIVN, hora: "invierno" }}
        claves={[mira(0, 860, P - 220, 2.0), mira(k(309.6), 860, P - 220, 2.3, { curva: "inout" })]}
        medio={<>
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: XT, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
            caras={[{ f: 0, v: "duda" }, { f: k(309.8), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.7 } }]}
            ik={(q) => ({ D: { x: mun.x - 6, y: mun.y }, wD: tr(q, 0, k(308.7)) })} />
          <PjM look={JUNE} ruta={[{ f: 0, x: XJ, y: COL }]} dir={[{ f: 0, v: -1 }]} asiento={AS_PISO} seed={2}
            caras={[{ f: 0, v: "determinado" }, { f: k(309.7), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.7 } }, { f: k(309.9), v: { x: 1, y: -0.1 } }]}
            habla={[[k(308.5), k(309.6)]]}
            ik={(q) => ({ D: { x: mun.x + 10, y: mun.y - 6 }, wD: tr(q, k(308.6), k(309.2)), I: { x: mun.x + 18, y: mun.y + 6 }, wI: tr(q, k(308.8), k(309.4)) })} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Pulso x={1180} y={230} f={f} o={aparece(f, k(309.6))} bpm={72} />
      </svg>
      <Pildora texto="SHE TEACHES HIM TO TAKE A PULSE" x={1150} y={1000} desde={k(308.5)} color={AMBAR} tam={38} />
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
            ik={(q) => ({ D: q < golpe ? { x: 2470, y: P - 250 } : { x: 2520, y: P - 182 }, wD: 1, I: { x: 2440, y: P - 222 }, wI: 1 })}
            mundo={(j) => <><g transform={`translate(${j.manoI.x},${j.manoI.y}) rotate(-20)`}>{[0, 1, 2].map((i) => <rect key={i} x={-12 + i * 8} y={-34} width={24} height={34} rx={3} fill="#f8f2e2" stroke="#2a2228" strokeWidth={1} transform={`rotate(${-14 + i * 14})`} />)}</g><rect x={j.manoD.x - 12} y={j.manoD.y - 18} width={24} height={34} rx={3} fill="#f8f2e2" stroke="#c0352c" strokeWidth={2} /></>} />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: 2700, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={AS_TAB} poses={[{ f: 0, v: "sentado" }, { f: golpe, v: { tronco: -12, pI: 88, rI: 88, pD: 92, rD: 92, hI: 60, cI: 120, hD: 70, cD: 120 } }]}
            caras={[{ f: 0, v: "duda" }, { f: golpe + 2, v: "sorpresa" }, { f: golpe + 14, v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }]}
            ik={(q) => ({ I: { x: 2640, y: P - 222 }, wI: q < golpe ? 1 : 0 })}
            mundo={(j, q) => q < golpe ? <g transform={`translate(${j.manoI.x},${j.manoI.y}) rotate(20)`}>{[0, 1].map((i) => <rect key={i} x={-12 + i * 8} y={-34} width={24} height={34} rx={3} fill="#f8f2e2" stroke="#2a2228" strokeWidth={1} />)}</g> : null} />
        </>} />
      <Pildora texto="CARDS" x={1250} y={130} desde={k(310.6)} color={AMBAR} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 66 · al mediodía, caminan al lago; el hielo crece en la orilla ----------
export const P66Caminan: React.FC = () => {
  const f = useF();
  const k = kDe(311.67);
  const S = CANAL_PISO;
  return (
    <AbsoluteFill>
      <EscenaNB Set={CanalPark} pal={PAL} seed={66} setProps={{ hora: "dia", luces: 0, nieve: 1, vapor: 0.6, hielo: interpolate(f, [k(314.6), k(315.9)], [0.25, 0.85], cl), ventanaGus: 0 }}
        claves={[mira(0, 1050, S - 280, 1.5), mira(k(314.4), 1320, S - 280, 1.5, { curva: "inout" }), mira(k(315.4), 1500, S - 240, 1.35, { curva: "inout" })]}
        medio={<>
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: 820, y: S }, { f: k(314.6), x: 1300 }]} seed={2} dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(313.4), v: "risa" }, { f: k(314.9), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(314.9), v: { x: 1, y: 0.5 } }]}
            poses={[{ f: 0, v: "parado" }, { f: k(314.9), v: "señalar" }]} habla={[[k(313.3), k(314.0)]]} />
          <PjM look={THEO_INV} ruta={[{ f: 0, x: 600, y: S }, { f: k(314.8), x: 1100 }]} dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(312.6), v: "feliz" }, { f: k(315.0), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(315.0), v: { x: 1, y: 0.5 } }]} />
        </>} />
      <RelojDia min={12 * 60} x={1540} y={70} desde={k(312.6)} tam={44} />
      <Pildora texto="NOON · THE WARMEST HOUR" x={1150} y={140} desde={k(312.6)} hasta={k(314.6)} color={AMBAR} tam={42} />
      <Pildora texto="ICE BUILDS UP ON THE SHORE" x={1150} y={140} desde={k(314.8)} color="#cfe0ff" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 67 · el puerto se congela; el lago casi nunca (mapa → ellos en la orilla) ----------
export const P67Hielo: React.FC = () => {
  const f = useF();
  const k = kDe(316.23);
  if (f < k(319.6)) {
    return (
      <AbsoluteFill style={{ background: "#26507a" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <g transform="translate(560,-40)"><MapaPuerto f={f} puerto={tr(f, k(316.35), k(317.2))} lago={tr(f, k(318.9), k(319.4))} zoom={interpolate(f, [0, k(319.6)], [1, 1.08], cl)} /></g>
        </svg>
      </AbsoluteFill>
    );
  }
  const S = CANAL_PISO;
  return (
    <AbsoluteFill>
      <EscenaNB Set={CanalPark} pal={PAL} seed={67} setProps={{ hora: "dia", luces: 0, nieve: 1, vapor: 1, hielo: 0.85, ventanaGus: 0 }}
        claves={[mira(k(319.6), 1420, S - 260, 1.8), mira(k(322.53), 1560, S - 300, 1.4, { curva: "inout" })]}
        medio={<>
          <PjM look={THEO_INV} ruta={[{ f: 0, x: 1280, y: S }]} dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "duda" }, { f: k(321.0), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.1 } }]} poses={[{ f: 0, v: "parado" }, { f: k(320.4), v: "pensar" }]} />
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: 1460, y: S }]} dir={[{ f: 0, v: 1 }, { f: k(320.0), v: -1 }, { f: k(320.6), v: 1 }]} seed={2}
            caras={[{ f: 0, v: "feliz" }, { f: k(320.4), v: "determinado" }]} habla={[[k(319.8), k(320.6)]]}
            poses={[{ f: 0, v: "parado" }, { f: k(320.7), v: "señalar" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
        </>} />
      <Pildora texto="THE LAKE ALMOST NEVER FREEZES" x={1150} y={140} desde={k(320.4)} color="#f6ecd2" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 68 · al borde del hielo: agua abierta, humeando hasta el horizonte ----------
export const P68Lago: React.FC = () => {

  const k = kDe(322.53);
  const S = CANAL_PISO;
  return (
    <AbsoluteFill>
      <EscenaNB Set={CanalPark} pal={PAL} seed={68} setProps={{ hora: "dia", luces: 0, nieve: 1, vapor: 1, hielo: 0.85, ventanaGus: 0 }}
        claves={[mira(0, 1640, S - 245, 2.4), mira(k(324.4), 1640, S - 245, 2.4), mira(k(326.9), 1700, S - 330, 1.0, { curva: "inout" }), mira(k(328.39), 1740, S - 340, 0.95, { curva: "inout" })]}
        medio={<>
          <PjM look={THEO_INV} ruta={[{ f: 0, x: 1560, y: S }]} dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(324.65), v: "sorpresa" }, { f: k(326.0), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(324.6), v: { x: 1, y: -0.1 } }]}
            mundo={(j, q) => <>{[0, 1].map((i) => { const c = ((q / 30 + i / 2) % 1); return <circle key={i} cx={j.boca.x + 12 + c * 40} cy={j.boca.y - c * 24} r={6 + c * 14} fill="#eef2fa" opacity={0.4 * (1 - c)} />; })}</>} />
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: 1720, y: S }]} dir={[{ f: 0, v: 1 }]} seed={2}
            caras={[{ f: 0, v: "duda" }, { f: k(324.7), v: "feliz" }, { f: k(325.7), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(324.6), v: { x: 1, y: -0.1 } }]}
            poses={[{ f: 0, v: "parado" }, { f: k(326.9), v: "señalar" }]} />
        </>} />
      <Pildora texto="THE EDGE OF THE ICE" x={1150} y={140} desde={k(323.4)} hasta={k(324.5)} color="#cfe0ff" tam={42} />
      <Pildora texto="OPEN WATER · STEAMING TO THE HORIZON" x={1150} y={140} desde={k(324.7)} color="#f6ecd2" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 69 · día 130: marzo, más de once horas de luz ----------
export const P69Sol: React.FC = () => {
  const f = useF();
  const k = kDe(328.39);
  const X = 1900;
  const horas = interpolate(f, [k(332.0), k(334.2)], [8.2, 11.2], cl);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Barrio} pal={PAL} seed={69} setProps={{ hora: "dia", luces: 0, nieve: 0.6, humo: 0.4 }}
        lejosExtra={<ArcoSol x={1300} y={640} r={640} p={interpolate(f, [0, k(335.45)], [0.15, 0.55], cl)} f={f} />}
        claves={[mira(0, X + 100, B - 290, 1.6), mira(k(330.6), X + 60, B - 330, 1.25, { curva: "inout" }), mira(k(335.45), X + 40, B - 340, 1.2, { curva: "inout" })]}
        medio={<>
          <PjM look={JUNE_INV} ruta={[{ f: 0, x: X, y: B }, { f: k(330.0), x: X + 260 }]} dir={[{ f: 0, v: 1 }, { f: k(330.2), v: -1 }]} seed={2}
            caras={[{ f: 0, v: "neutral" }, { f: k(330.8), v: "feliz" }, { f: k(333.4), v: "risa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(330.6), v: { x: 0.6, y: -1 } }]}
            ik={(q) => ({ D: { x: X + 228, y: B - 270 }, wD: tr(q, k(330.6), k(331.0)) * (1 - tr(q, k(333.2), k(333.5))) })}
            poses={[{ f: 0, v: "parado" }, { f: k(333.5), v: "celebrar" }]} />
          <PjM look={THEO_INV} ruta={[{ f: 0, x: X - 30, y: B }, { f: k(331.6), x: X - 30 }, { f: k(332.6), x: X - 200 }]} dir={[{ f: 0, v: -1 }, { f: k(332.7), v: 1 }]}
            opacidad={(q) => tr(q, k(331.5), k(331.8))}
            caras={[{ f: 0, v: "neutral" }, { f: k(332.7), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(332.8), v: { x: 0.6, y: -0.9 } }]}
            poses={[{ f: 0, v: "parado" }, { f: k(332.8), v: { hI: 150, cI: 30, hD: 150, cD: 30, tronco: -6, cabeza: -12 } }]} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Rot x={1240} y={130} t="DAY 130 · MARCH" o={aparece(f, k(328.4), k(332.9))} tam={50} />
        <BarraLuz x={1250} y={150} horas={horas} o={aparece(f, k(333.0))} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 70 · la última fila de leña: lo peor del frío ya pasó ----------
export const P70Ultima: React.FC = () => {
  const f = useF();
  const k = kDe(335.45);
  const XT = 760;
  const lena = { x: 600, y: P - 22 };
  const tom = k(336.75);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={70} setProps={{ ...LIVN, hora: "dia", lena: 0.07, fuego: 0.6 }}
        claves={[mira(0, 640, P - 230, 1.9), mira(k(337.6), 700, P - 260, 1.55, { curva: "inout" })]}
        medio={<PjM look={THEO_CASA} ruta={[{ f: 0, x: XT + 120, y: P }, { f: k(336.0), x: XT }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: undefined }, { f: k(336.0), v: 0 }, { f: k(337.4), v: undefined }]}
          poses={[{ f: 0, v: "parado" }, { f: k(336.0), v: "arrodillado" }, { f: k(337.4), v: "parado" }, { f: k(339.2), v: { hI: 140, cI: 20, tronco: -4 } }]}
          caras={[{ f: 0, v: "neutral" }, { f: k(336.75), v: "duda" }, { f: k(338.17), v: "determinado" }, { f: k(339.2), v: "feliz" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0.7 } }, { f: k(337.5), v: { x: 1, y: 0 } }]}
          ik={(q) => ({ D: q < tom ? lena : { x: XT - 60, y: P - 180 }, wD: tr(q, k(336.1), k(336.6)) })}
          mundo={(j, q) => q >= tom ? <g transform={`translate(${j.manoD.x},${j.manoD.y}) rotate(-8)`}><rect x={-50} y={-12} width={100} height={24} rx={11} fill="#8a5a36" /><circle cx={50} cy={0} r={12} fill="#c89a5a" /><circle cx={50} cy={0} r={6} fill="#a07a3a" /></g> : null} />} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Rot x={1250} y={130} t="THE LAST ROW OF WOOD" o={aparece(f, k(336.7), k(337.9))} tam={44} />
        <g opacity={aparece(f, k(337.9))}><CurvaFrio x={1160} y={130} p={tr(f, k(338.0), k(339.0))} marca={tr(f, k(339.1), k(339.5))} /></g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 71 · lo lograron: se abrazan contra la ventana (2 personas · 1 cuarto · 1 invierno) ----------
export const P71Abrazo: React.FC = () => {
  const f = useF();
  const k = kDe(339.97);
  const cerca = k(340.6);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={71} setProps={{ ...LIVN, hora: "dia", fuego: 0.4 }}
        claves={[mira(0, 1300, P - 260, 2.0), mira(k(340.9), 1300, P - 260, 2.05), mira(k(341.9), 1300, P - 300, 1.35, { curva: "inout" })]}
        medio={<>
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: 1130, y: P }, { f: cerca, x: 1256 }]} dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "sorpresa" }, { f: k(340.3), v: "risa" }, { f: k(341.8), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]}
            poses={[{ f: 0, v: "celebrar" }, { f: k(340.4), v: "parado" }]}
            ik={(q) => ({ D: { x: 1330, y: P - 196 }, I: { x: 1320, y: P - 226 }, wD: tr(q, k(340.4), cerca), wI: tr(q, k(340.5), cerca + 3) })} />
          <PjM look={JUNE} ruta={[{ f: 0, x: 1480, y: P }, { f: cerca, x: 1344 }]} dir={[{ f: 0, v: -1 }]} seed={2}
            caras={[{ f: 0, v: "sorpresa" }, { f: k(340.3), v: "risa" }, { f: k(341.8), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]}
            poses={[{ f: 0, v: "celebrar" }, { f: k(340.4), v: "parado" }]}
            ik={(q) => ({ D: { x: 1268, y: P - 206 }, I: { x: 1280, y: P - 236 }, wD: tr(q, k(340.4), cerca), wI: tr(q, k(340.5), cerca + 3) })} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Rot x={1200} y={130} t="THEY DID IT" o={aparece(f, k(340.0), k(340.9))} tam={60} />
        <Rot x={760} y={130} t="2 PEOPLE" o={aparece(f, k(341.07))} tam={46} />
        <Rot x={1140} y={130} t="1 ROOM" o={aparece(f, k(342.01))} tam={46} />
        <Rot x={1520} y={130} t="1 WINTER" o={aparece(f, k(342.85))} tam={46} />
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
      <EscenaNB Set={Living} pal={PAL} seed={72} setProps={{ ...LIVN }}
        claves={[mira(0, 930, P - 240, 1.7), mira(k(346.3), 930, P - 240, 1.75, { curva: "inout" }), mira(k(347.9), 880, COL - 170, 2.7, { curva: "inout" }), mira(k(350.6), 880, COL - 170, 2.75), mira(k(351.5), 880, COL - 180, 3.1, { curva: "inout" })]}
        medio={<>
          {f < tom && <EscanerW f={f} x={piso.x} y={piso.y - 50} on={0} s={0.9} rot={-80} />}
          <PjM look={JUNE} ruta={[{ f: 0, x: 1100, y: COL }]} dir={[{ f: 0, v: -1 }]} asiento={AS_PISO} seed={2}
            poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(346.4), v: { tronco: 22, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 30, hD: 40, cD: 70, cabeza: 6 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(346.4), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }]} />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: ESC_T, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
            caras={[{ f: 0, v: "neutral" }, { f: k(345.3), v: "feliz" }, { f: k(347.9), v: "picaro" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.7 } }]}
            ik={(q) => ({ D: q < tom ? piso : lp(piso, mano, tr(q, tom, tom + 10)), wD: tr(q, 0, k(344.4)) + 0, I: { x: mano.x + 4, y: mano.y - 20 }, wI: tr(q, k(344.9), k(345.2)) * (1 - tr(q, k(345.5), k(345.8))) })}
            mundo={(j, q) => q >= tom ? <EscanerW f={q} x={j.manoD.x + 6} y={j.manoD.y - 32} on={on} alerta={tr(q, k(351.6), k(351.9))} s={0.9} /> : null} />
        </>} />
      <Pildora texto="NOT A NORMAL RADIO" x={1250} y={130} desde={k(346.4)} hasta={k(347.8)} color="#f6ecd2" tam={42} />
      <Pildora texto="A HANDHELD SCANNER" x={1250} y={130} desde={k(347.95)} hasta={k(349.3)} color={AMBAR} tam={44} />
      <Pildora texto="FROM AN OUTDOOR STORE · FOR HUNTERS" x={1200} y={130} desde={k(349.4)} hasta={k(351.5)} color="#f6ecd2" tam={40} />
      <Pildora texto="WEATHER ALERTS" x={1250} y={130} desde={k(351.7)} color={AMBAR} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 73 · cada noche, 130 noches: estática ----------
export const P73Estatica: React.FC = () => {
  const f = useF();
  const k = kDe(352.63);
  const mano = { x: ESC_T + 74, y: COL - 140 };
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={73} setProps={{ ...LIVN, fuego: 0.5 }}
        claves={[mira(0, 900, P - 250, 1.8), mira(k(355.5), 880, P - 240, 1.85, { curva: "inout" }), mira(k(356.6), 860, COL - 170, 2.4, { curva: "inout" })]}
        medio={<PjM look={THEO_CASA} ruta={[{ f: 0, x: ESC_T, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
          poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(355.6), v: { tronco: 14, cabeza: 18, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 30, hD: 40, cD: 70 } }]}
          caras={[{ f: 0, v: "neutral" }, { f: k(354.4), v: "cansado" }, { f: k(356.6), v: "triste" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.7 } }]}
          ik={() => ({ D: mano, wD: 1 })}
          mundo={(j, q) => <><EscanerW f={q} x={j.manoD.x + 6} y={j.manoD.y - 32} on={1} s={0.9} freq={162.4 - ((Math.floor(q / 9) * 0.025) % 4)} />
            {q > k(356.4) && Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${j.manoD.x + 30 + ((i * 37 + q * 5) % 60)},${j.manoD.y - 80 - ((i * 23 + q * 3) % 50)} l6,-4 l-4,-6 l8,-2`} stroke="#cfc8e8" strokeWidth={2} fill="none" opacity={0.7} />)}</>} />} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Palitos x={1400} y={210} n={interpolate(f, [k(353.2), k(354.6)], [0, 130], cl)} o={aparece(f, k(353.0))} />
        <Rot x={1590} y={110} t="130 NIGHTS" o={aparece(f, k(353.9))} tam={40} />
        <Rot x={1250} y={980} t="EVERY NIGHT: STATIC" o={aparece(f, k(356.5))} tam={42} borde="#cfc8e8" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 74 · esta noche, abajo del todo del dial: una voz ----------
export const P74Voz: React.FC = () => {
  const f = useF();
  const k = kDe(357.97);
  const mano = { x: ESC_T + 74, y: COL - 140 };
  const freq = interpolate(f, [k(358.8), k(360.1)], [162.4, 136.0], { ...cl });
  const voz = tr(f, k(361.1), k(361.4));
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={74} setProps={{ ...LIVN, fuego: 0.4 }}
        claves={[mira(0, mano.x + 6, mano.y - 30, 3.4), mira(k(360.8), mano.x + 6, mano.y - 30, 3.45), mira(k(361.6), 840, COL - 160, 2.3, { curva: "inout" })]}
        medio={<PjM look={THEO_CASA} ruta={[{ f: 0, x: ESC_T, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
          poses={[{ f: 0, v: { tronco: 14, cabeza: 18, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 30, hD: 40, cD: 70 } }, { f: k(361.2), v: { tronco: -8, cabeza: -6, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 30, hD: 40, cD: 70 } }]}
          caras={[{ f: 0, v: "cansado" }, { f: k(361.15), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.7 } }]}
          ik={(q) => ({ D: mano, wD: 1, I: { x: mano.x + 16, y: mano.y - 46 }, wI: tr(q, k(358.6), k(358.8)) * (1 - tr(q, k(360.2), k(360.5))) })}
          mundo={(j, q) => <EscanerW f={q} x={j.manoD.x + 6} y={j.manoD.y - 32} on={1} s={0.9} freq={freq} voz={voz} />} />} />
      <Pildora texto="TONIGHT · THE BOTTOM OF THE DIAL" x={1200} y={130} desde={k(359.5)} hasta={k(361.0)} color={AMBAR} tam={42} />
      <Pildora texto="A VOICE" x={1250} y={130} desde={k(361.2)} color="#5aff7a" tam={56} />
    </AbsoluteFill>
  );
};

// ---------- 75 · «Viejo, áspero, cansado… ¿alguien? Me llamo Gus» ----------
export const P75Gus: React.FC = () => {
  const f = useF();
  const k = kDe(362.09);
  const mano = { x: ESC_T + 74, y: COL - 140 };
  if (f < k(366.5)) {
    return (
      <AbsoluteFill>
        <EscenaNB Set={Living} pal={PAL} seed={75} setProps={{ ...LIVN, fuego: 0.4 }}
          claves={[mira(0, 900, P - 260, 1.75), mira(k(364.8), 890, P - 250, 1.9, { curva: "inout" })]}
          medio={<>
            <PjM look={JUNE} ruta={[{ f: 0, x: 1130, y: COL }, { f: k(362.5), x: 1130 }, { f: k(363.2), x: 1000 }]} dir={[{ f: 0, v: -1 }]} seed={2}
              asiento={[{ f: 0, v: 8 }, { f: k(362.4), v: undefined }, { f: k(363.2), v: 0 }]}
              poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(362.4), v: "parado" }, { f: k(363.2), v: { ...{ tronco: 24, pI: 0, rI: 90, pD: 90, rD: 90, hD: 20, cD: 40, hI: 10, cI: 30, cabeza: 8 } } }]}
              caras={[{ f: 0, v: "sorpresa" }, { f: k(363.4), v: "duda" }, { f: k(364.85), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(363.3), v: { x: 1, y: 0.7 } }]} />
            <PjM look={THEO_CASA} ruta={[{ f: 0, x: ESC_T, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
              caras={[{ f: 0, v: "sorpresa" }, { f: k(364.85), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.7 } }, { f: k(363.6), v: { x: 1, y: 0 } }]}
              ik={() => ({ D: mano, wD: 1 })}
              mundo={(j, q) => <EscenaCtx j={j} q={q} />} />
          </>} />
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {["OLD", "ROUGH", "TIRED"].map((t, i) => <Rot key={t} x={760 + i * 360} y={150} t={t} o={aparece(f, k([362.09, 363.03, 363.89][i]))} tam={54} borde="#cfc8e8" />)}
        </svg>
        <Globo texto="Anyone?" x={1180} y={420} desde={k(364.85)} hasta={k(366.5)} tam={56} />
      </AbsoluteFill>
    );
  }
  const G = CANAL_PUNTOS.ventanaGus;
  return (
    <AbsoluteFill>
      <EscenaNB Set={CanalPark} pal={PAL} seed={76} setProps={{ hora: "noche", luces: 0, nieve: 1, cae: true, vapor: 0.5, hielo: 0.4, ventanaGus: 1 }}
        claves={[mira(k(366.5), G.x + 240, G.y + 140, 1.3), mira(k(368.57), G.x - 50, G.y + 110, 2.9, { curva: "inout" })]} />
      <Pildora texto="“MY NAME IS GUS.”" x={1250} y={130} desde={k(367.1)} color={AMBAR} tam={50} />
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
        claves={[mira(0, 960, 520, 0.82), mira(k(369.8), 960, 520, 0.9, { curva: "inout" }), mira(k(371.2), 960, 520, 0.9), mira(k(372.6), 930, 470, 1.15, { curva: "inout" }), mira(k(375.19), 930, 460, 1.22, { curva: "inout" })]}
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
      <Pildora texto="CANAL PARK · BY THE BRIDGE" x={960} y={1000} desde={k(368.85)} color={AMBAR} tam={44} />
      <Globo texto="Me and the dog. Anyone?" x={1000} y={120} desde={k(372.71)} hasta={k(375.19)} tam={46} />
      <Globo texto="There’s a light in my window." x={1000} y={120} desde={k(371.3)} hasta={k(372.6)} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 77 · June agarra el cuaderno y arranca la tapa ----------
export const P77Agarra: React.FC = () => {
  const f = useF();
  const k = kDe(375.19);
  const XJ = 1090;
  const cuad = { x: 1180, y: COL - 8 };
  const pecho = { x: XJ - 70, y: COL - 140 };
  const tom = k(375.6), roto = k(377.4);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={78} setProps={{ ...LIVN }}
        claves={[mira(0, 960, P - 240, 1.75), mira(k(376.3), 970, P - 240, 1.8, { curva: "inout" }), mira(k(377.1), 1030, P - 230, 2.3, { curva: "inout" })]}
        medio={<>
          {f < tom && <CuadernoChico x={cuad.x} y={cuad.y} rot={90} s={0.8} />}
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: ESC_T, y: COL }]} dir={[{ f: 0, v: 1 }]} asiento={AS_PISO}
            caras={[{ f: 0, v: "sorpresa" }, { f: k(377.5), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]}
            ik={() => ({ D: { x: ESC_T + 74, y: COL - 140 }, wD: 1 })}
            mundo={(j, q) => <EscanerW f={q} x={j.manoD.x + 6} y={j.manoD.y - 32} on={1} s={0.9} freq={136.0} voz={1} />} />
          <PjM look={JUNE} ruta={[{ f: 0, x: XJ, y: COL }]} dir={[{ f: 0, v: 1 }, { f: k(375.8), v: -1 }]} seed={2}
            asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(375.2), v: { tronco: 34, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 30, hD: 40, cD: 70 } }, { f: k(375.9), v: "sentadoSuelo" }]}
            caras={[{ f: 0, v: "sorpresa" }, { f: k(375.4), v: "determinado" }, { f: k(377.5), v: "risa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(375.3), v: { x: -1, y: 0.8 } }, { f: k(376.0), v: { x: 1, y: 0.6 } }]}

            ik={(q) => ({ D: q < tom ? cuad : pecho, wD: tr(q, k(375.19), k(375.45)), I: { x: pecho.x + 20, y: pecho.y - 30 + (q > k(377.2) ? -30 * tr(q, k(377.2), roto) : 0) }, wI: tr(q, k(376.3), k(376.7)) })}
            mundo={(j, q) => q >= tom ? <><CuadernoChico x={j.manoD.x} y={j.manoD.y - 20} s={1.1} roto={q >= roto ? 1 : 0} /><TapaVuela x={j.manoD.x} y={j.manoD.y - 20} p={tr(q, roto, roto + 24)} dir={1} /></> : null} />
        </>} golpeF={roto} />
      <Pildora texto="SHE GRABS THE NOTEBOOK" x={1250} y={130} desde={k(375.5)} hasta={k(377.1)} color={AMBAR} tam={42} />
      <Pildora texto="RIPS OFF THE COVER" x={1250} y={130} desde={k(377.3)} color="#ff8a6a" tam={44} />
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
        <Rot x={1500} y={130} t="UNDER THE 2" o={aparece(f, k(378.8), k(380.4))} tam={44} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 79 · CTA: si tuvieras que elegir una regla… ----------
export const P79Cta: React.FC = () => {
  const f = useF();
  const k = kDe(382.59);
  const XJ = 3010;
  const nota = aparece(f, k(382.7), k(386.6));
  const marca = f < k(383.6) ? -1 : f < k(384.3) ? 0 : f < k(385.0) ? 1 : 2;
  return (
    <AbsoluteFill>
      <EscenaNB Set={Living} pal={PAL} seed={79} setProps={{ ...LIVN, hora: "dia", fuego: 0.4, reglas: 3 }}
        claves={[mira(0, 2820, P - 300, 1.75), mira(k(386.7), 2820, P - 300, 1.75), mira(k(387.6), 2860, P - 300, 1.6, { curva: "inout" })]}
        medio={<>
          <PjM look={JUNE} ruta={[{ f: 0, x: XJ, y: P }]} seed={2}
            dir={[{ f: 0, v: 1 }, { f: k(385.5), v: -1 }]}
            poses={[{ f: 0, v: "señalar" }, { f: k(385.5), v: "hablar" }, { f: k(388.4), v: "saludar" }, { f: k(389.6), v: "hablar" }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(385.6), v: "picaro" }, { f: k(387.0), v: "feliz" }, { f: k(388.4), v: "risa" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.6 } }, { f: k(385.6), v: { x: 0, y: 0 } }]}
            habla={[[k(383.0), k(384.0)], [k(385.6), k(386.2)], [k(386.9), k(388.0)], [k(388.4), k(390.2)]]} />
          <PjM look={THEO_CASA} ruta={[{ f: 0, x: 2420, y: P }, { f: k(386.9), x: 2420 }, { f: k(387.8), x: 2700 }]} dir={[{ f: 0, v: 1 }]}
            opacidad={(q) => tr(q, k(386.9), k(387.1))}
            poses={[{ f: 0, v: "parado" }, { f: k(388.4), v: "saludar" }, { f: k(389.6), v: "celebrar" }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(388.4), v: "risa" }]} miradas={[{ f: 0, v: { x: 0, y: 0 } }]} />
        </>} />
      <div style={{ opacity: nota }}>
        <NotaHeladera titulo="JUNE'S RULES" renglones={[{ t: "1. FRESH FOOD FIRST", desde: -999 }, { t: "2. NOTHING RISKY ALONE", desde: -999 }, { t: "3. ONE THING FOR FUN", desde: -999 }]} x={380} y={300} w={760} tam={52} />
      </div>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }} opacity={nota}>
        {marca >= 0 && <rect x={420} y={404 + marca * 68 - marca * 2} width={680} height={62} rx={14} fill="none" stroke="#e2483a" strokeWidth={6} transform="rotate(-2 760 500)" />}
      </svg>
      <Globo texto="Which ONE rule would you pick?" x={1300} y={300} desde={k(383.1)} hasta={k(386.8)} tam={46} />
      <Globo texto="Tell me in the comments!" x={1300} y={300} desde={k(386.99)} hasta={k(391.05)} tam={50} />
      <Pildora texto="SUBSCRIBE · THE CENSUS CONTINUES" x={960} y={1000} desde={k(388.43)} color={AMBAR} tam={50} />
    </AbsoluteFill>
  );
};

// ---------- 80 · lo que viene: diez personas, una ciudad entera ----------
const GENTE: any[] = ["#c0352c", "#3a6a9a", "#e0a23a", "#4a7a5a", "#7a4a8a", "#2f7f86", "#8a5a36", "#d06a8a", "#5a5a64", "#a0b0c0"].map((c, i) => ({ estilo: "palo", camisa: c, manga: "larga", pantalon: i % 2 ? "#2a2a32" : "#3a3048", zapatos: "#1a1410", accesorios: [i % 3 === 0 ? { t: "gorroLana", color: "#efe3c8" } : i % 3 === 1 ? { t: "pelo", forma: "bob", color: "#3a2a1a" } : { t: "capucha", color: c }] }));
export const P80Next: React.FC = () => {
  const f = useF();
  const k = kDe(391.05);
  return (
    <AbsoluteFill>
      <EscenaNB Set={Panorama} pal={PAL} seed={80} setProps={{ hora: "ocaso", luces: 0, ventana: 1, nieve: 0.6, vapor: 0.5 }}
        claves={[mira(0, 760, 640, 1.15), mira(k(394.05), 820, 620, 1.05, { curva: "inout" })]}
        medio={<>{GENTE.map((l, i) => {
          const x1 = 120 + i * 120, x0 = x1 - 700 - i * 30;
          return <PjM key={i} look={l} ruta={[{ f: 0, x: x0, y: 900 }, { f: k(392.6) + i * 2, x: x1 }]} seed={10 + i} dir={[{ f: 0, v: 1 }, { f: k(393.0) + i * 2, v: i % 2 ? -1 : 1 }]}
            caras={[{ f: 0, v: ["determinado", "neutral", "duda", "feliz", "cansado"][i % 5] }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(393.0), v: { x: 0, y: 0 } }]} />;
        })}</>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Rot x={1240} y={150} t="NEXT TIME" o={aparece(f, k(391.05))} tam={50} />
        <Rot x={1240} y={250} t="10 PEOPLE · 1 WHOLE CITY" o={aparece(f, k(391.7))} tam={52} />
      </svg>
    </AbsoluteFill>
  );
};
