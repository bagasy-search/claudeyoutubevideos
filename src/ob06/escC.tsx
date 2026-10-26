// ob06 · escenas 9-14 (vaca y rumen, bacterias y serotonina, el café de Lena, CTA, martes, Monsieur Mangetout)
import React from "react";
import { interpolate } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Escena } from "../anikit/escena";
import { Celular } from "../anikit/props";
import { PAL, OWEN, LENA, RIM, VERDE } from "../owen/elenco";
import { ROJO } from "../owen/cartel";
import { Persona } from "../owen/b/gente";
import { PlanB, Pizarra, GloboM, FuenteB, POSE_CELU_SENTADO } from "../owen/b/lib";
import { Descanso, DES_PISO, DES_PUNTOS, CajaDonas } from "../owen/mundo/sala";
import { AMARILLO, cl, panza, Txt, CeluGrande, F_HUD } from "./comun6";
import { Vaca, Torso, TextoW, Flecha, Charco, Halo, pop, tw, CafeDentro, CAFE_PISO, MostradorCafe, TazaCafe, Pastel, Escenario, Comentario, BotonSub6, Bici, Tele, Avion, Banana, Huevo, Pizza, Taco, Burrito, Dona, Estomago } from "./kit6";

const LOTITO = { estilo: "palo", camisa: "#f2ede0", manga: "larga", pantalon: "#2a2a30", zapatos: "#1d1d22", accesorios: [{ t: "pelo", forma: "corto", color: "#2a1a12" }, { t: "barba", color: "#2a1a12" }] } as unknown as typeof OWEN;
const VERDE_C = "#9ad84a";
const FUENTE_VACA = "Ruminant digestion: microbial fermentation in the rumen (veterinary physiology)";
const pasto = (y = 900) => <>
  <rect x={-2000} y={y} width={6000} height={900} fill="#2f5a22" />
  {Array.from({ length: 70 }).map((_, i) => <path key={i} d={`M${-200 + i * 36},${y + 4} l8,-38 l8,38`} stroke={i % 2 ? "#5aa83a" : "#7ac84a"} strokeWidth={6} fill="none" />)}
  <Charco x={960} y={y + 6} rx={800} color="#c8ff5a" fuerza={0.2} />
</>;
const pisoOsc = (y = 900, color = "#0e160c", luz = "#c8ff5a") => <><rect x={-2000} y={y} width={6000} height={900} fill={color} /><Charco x={960} y={y + 6} rx={700} color={luz} fuerza={0.25} /></>;
// manojo de pasto en la mano o en la boca
const Manojo: React.FC<{ s?: number }> = ({ s = 1 }) => <g transform={`scale(${s})`}>{[-24, -10, 4, 18].map((x, i) => <path key={i} d={`M${x},20 q${-10 + i * 6},-50 ${-4 + i * 4},-90`} stroke={i % 2 ? "#5aa83a" : "#7ac84a"} strokeWidth={8} fill="none" strokeLinecap="round" />)}</g>;
// cadena de celulosa: anillos hexagonales unidos
const Celulosa: React.FC<{ x: number; y: number; s?: number; corte?: number; f: number }> = ({ x, y, s = 1, corte = 0, f }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[0, 1, 2].map((fila) => <g key={fila} transform={`translate(0,${(fila - 1) * 90})`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const sep = corte * (i - 2) * 26;
        const hx = (i - 2) * 80 + sep;
        return <g key={i} transform={`translate(${hx},${Math.sin(f / 10 + i + fila) * 3}) rotate(${corte * (i % 2 ? 14 : -14)})`}>
          <path d="M-30,0 L-15,-26 L15,-26 L30,0 L15,26 L-15,26 Z" fill="#dff7b0" stroke="#5aa83a" strokeWidth={6} />
          {i < 4 && corte < 0.3 && <path d="M30,0 H50" stroke="#5aa83a" strokeWidth={7} />}
        </g>;
      })}
    </g>)}
  </g>
);
// tijera = la enzima
const Tijera: React.FC<{ x: number; y: number; s?: number; no?: number }> = ({ x, y, s = 1, no = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={92} fill="#f4efe4" opacity={0.12} />
    <circle cx={-34} cy={36} r={20} fill="none" stroke="#f4efe4" strokeWidth={9} /><circle cx={34} cy={36} r={20} fill="none" stroke="#f4efe4" strokeWidth={9} />
    <path d="M-22,22 L36,-60 M22,22 L-36,-60" stroke="#f4efe4" strokeWidth={11} strokeLinecap="round" />
    <g opacity={no}><circle r={92} fill="none" stroke={ROJO} strokeWidth={14} /><path d="M-65,65 L65,-65" stroke={ROJO} strokeWidth={14} /></g>
  </g>
);
// bacteria con carita
const Bact: React.FC<{ x: number; y: number; r?: number; tipo?: number; f: number; color?: string; cara?: boolean }> = ({ x, y, r = 0, tipo = 0, f, color = VERDE_C, cara = true }) => {
  const w = tipo === 0 ? 46 : 26;
  return (
    <g transform={`translate(${x},${y + Math.sin(f / 7 + x) * 5}) rotate(${r + Math.sin(f / 11 + y) * 8})`}>
      <rect x={-w} y={-24} width={w * 2} height={48} rx={24} fill={color} stroke="#2a4a1a" strokeWidth={4} />
      {tipo === 0 && [-30, 30].map((k) => <path key={k} d={`M${k},24 q6,16 -2,28`} stroke="#2a4a1a" strokeWidth={3} fill="none" />)}
      {cara && <><circle cx={-9} cy={-4} r={5} fill="#1a2a12" /><circle cx={9} cy={-4} r={5} fill="#1a2a12" /><path d="M-8,8 q8,7 16,0" stroke="#1a2a12" strokeWidth={3} fill="none" /></>}
    </g>
  );
};
const PINTAS = ["#9ad84a", "#efffbf", "#5ac8a8", "#c8ff5a", "#7ad8ff"];

// ====================== r09 · «la ciencia de verdad»: mirá una vaca ======================
export const r09: PlanB = {
  a: 104.46, b: 108.08, trans: { tipo: "cortina", lado: -1 },
  sfx: [[104.5, "whoosh"], [105.0, "step", -8], [105.6, "step", -8], [106.2, "step", -8], [107.1, "farm", -8, { dur: 1.6 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const vx = interpolate(f, [0, k(106.7)], [2500, 1380], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 2) });
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#16301a", luz: "#c8ff5a" }} seed={6090} mano={1.5}
          claves={[mira(0, 1000, 640, 1.2), mira(k(107.0), 1040, 650, 1.25, { curva: "inout" }), mira(k(108.08), 1150, 660, 1.4, { curva: "in" })]}
          detras={pasto()}
          medio={<>
            <Vaca x={vx} y={900} s={0.95} f={f} masca={f > k(106.7)} cabeza={tw(f, k(106.9), k(107.4))} />
            <Persona look={OWEN} seed={47} escala={1.55} luz={RIM.sol} ruta={[{ f: 0, x: 560, y: 900 }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 30, cD: 90, hI: 10, cI: 40, cabeza: -6 } }, { f: k(105.2), v: "pensar" }, { f: k(106.9), v: { hD: 92, cD: 6, hI: 10, cI: 30 } }]}
              caras={[{ f: 0, v: "duda" }, { f: k(106.9), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: -0.4, y: 0 } }, { f: k(105.4), v: { x: 1, y: 0 } }]} />
            <TextoW x={1000} y={380} t={f < k(107.0) ? "THE REAL SCIENCE" : "LOOK AT A COW"} tam={64} color={f < k(107.0) ? "#f4efe4" : VERDE_C} f={f} desde={k(104.7)} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// mastica pasto → celulosa bajo la lupa
export const r09b: PlanB = {
  a: 108.08, b: 113.78, trans: { tipo: "corte" },
  sfx: [[108.3, "eat", -6], [109.1, "eat", -6], [109.9, "eat", -6], [110.3, "whoosh"], [110.6, "pop", -2], [112.0, "pop", -4], [113.0, "eat", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const lupa = pop(f, k(110.4));
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#16301a", luz: "#c8ff5a" }} seed={6091} mano={1.5}
          claves={[mira(0, 800, 620, 2.0), mira(k(110.2), 800, 620, 2.1), mira(k(110.9), 1220, 600, 1.3, { curva: "inout" }), mira(k(113.78), 1230, 600, 1.33)]}
          detras={pasto()}
          medio={<>
            <Vaca x={1000} y={900} s={1.05} f={f} masca />
            {/* el pasto que le cuelga de la boca */}
            <g transform={`translate(${1000 - 360 * 1.05},${900 - 250 * 1.05}) rotate(${Math.sin(f / 4) * 6})`}><Manojo s={1.1} /></g>
            {lupa > 0 && <g>
              <path d={`M${1000 - 360 * 1.05 + 20},${900 - 300 * 1.05} L1330,560`} stroke="#f4efe4" strokeWidth={4} strokeDasharray="10 10" opacity={lupa} />
              <g transform={`translate(1530,500) scale(${0.9 * lupa})`}>
                <circle r={240} fill="#0f2210" stroke="#f4efe4" strokeWidth={14} />
                <Celulosa x={0} y={0} s={0.82} f={f} />
                <rect x={150} y={150} width={40} height={140} rx={16} fill="#7a5a3a" transform="rotate(-45 170 220)" />
              </g>
            </g>}
            <TextoW x={1560} y={810} t={f < k(112.0) ? "CELLULOSE" : "THE FIBER THAT\nKEEPS PLANTS STANDING"} tam={f < k(112.0) ? 66 : 46} color={VERDE_C} f={f} desde={k(110.6)} />
          </>}
          hud={<FuenteB texto={FUENTE_VACA} desde={k(110.6)} hasta={k(113.7)} />} />
      );
    };
    return <Pl />;
  },
};

// ni el humano ni la vaca tienen la enzima
export const r09c: PlanB = {
  a: 113.78, b: 118.28, trans: { tipo: "corte" },
  sfx: [[114.0, "eat", -4], [114.8, "fail", -8], [115.5, "stamp", -2], [117.4, "stamp", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1a2a16", luz: "#c8ff5a" }} seed={6092} mano={1.2}
          claves={[mira(0, 960, 560, 1.0), mira(k(118.28), 960, 560, 1.05)]}
          detras={<>{pasto()}<rect x={954} y={-200} width={12} height={1100} fill="#f4efe4" opacity={0.35} /></>}
          medio={<>
            <Persona look={OWEN} seed={47} escala={1.45} luz={RIM.sol} ruta={[{ f: 0, x: 480, y: 900 }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 74, cD: 150, hI: 10, cI: 40 } }, { f: k(114.7), v: { hD: 40, cD: 60, hI: 30, cI: 90, cabeza: -8, tronco: -6 } }]}
              caras={[{ f: 0, v: "determinado" }, { f: k(114.6), v: "asco" }]} habla={[[0, k(114.6)]]}
              enManoD={(ff: number) => ff < k(114.9) ? <Manojo s={0.7} /> : null} />
            {f > k(114.9) && <g transform={`translate(${640 + (f - k(114.9)) * 6},${780 + Math.pow(f - k(114.9), 2) * 0.4}) rotate(${(f - k(114.9)) * 8})`}><Manojo s={0.7} /></g>}
            <Vaca x={1500} y={900} s={0.72} f={f} masca />
            <g transform={`translate(1380,${900 - 260 * 0.72}) `}><Manojo s={0.8} /></g>
            <g transform={`translate(760,330) scale(${pop(f, k(115.4))})`}><Tijera x={0} y={0} s={0.9} no={tw(f, k(115.5), k(115.8))} /></g>
            <g transform={`translate(1480,330) scale(${pop(f, k(117.3))})`}><Tijera x={0} y={0} s={0.9} no={tw(f, k(117.4), k(117.7))} /></g>
            <TextoW x={640} y={200} t="HUMANS: NO ENZYME" tam={48} color="#ff8a5a" f={f} desde={k(115.5)} />
            <TextoW x={1480} y={200} t="COWS: NONE EITHER" tam={48} color="#ff8a5a" f={f} desde={k(117.4)} />
          </>}
          hud={<FuenteB texto={FUENTE_VACA} desde={0} hasta={k(118.2)} />} />
      );
    };
    return <Pl />;
  },
};

// la vaca por dentro: el rumen, tanque de fermentación
export const r09d: PlanB = {
  a: 118.28, b: 127.56, trans: { tipo: "luz", d: 8, color: "#d6ff9a" },
  sfx: [[118.4, "whoosh_big", -6], [118.9, "beep", -10], [119.5, "popcluster", -6, { dur: 3 }], [121.2, "pop", -4], [124.6, "drop", -4], [125.2, "drop", -6], [125.8, "drop", -6], [126.5, "drop", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const S = 1.4, X = 980, Y = 960;
      const rx = tw(f, k(118.5), k(119.3));
      const rumen = tw(f, k(119.4), k(120.4));
      const rx_ = X + 30 * S, ry_ = Y - 265 * S;
      const tanque = f > k(124.6);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0e1a12", luz: "#9ad84a" }} seed={6093} mano={1.5}
          claves={[mira(0, X, 600, 0.95), mira(k(119.4), X, 600, 1.0), mira(k(120.6), rx_, ry_ + 20, 1.55, { curva: "inout" }), mira(k(124.4), rx_, ry_ + 20, 1.62), mira(k(127.56), rx_ - 10, ry_ + 30, 1.72, { curva: "in" })]}
          detras={pisoOsc(960, "#12200f")}
          medio={<>
            <Vaca x={X} y={Y} s={S} f={f} rayos={rx} rumen={rumen} masca />
            {tanque && Array.from({ length: 14 }).map((_, i) => { const u = ((f - k(124.6)) / 40 + i / 14) % 1; return <circle key={i} cx={rx_ - 140 + (i * 47) % 300} cy={ry_ + 110 - u * 300} r={8 + (i % 3) * 5} fill="none" stroke="#efffbf" strokeWidth={4} opacity={(1 - u) * tw(f, k(124.6), k(125.0))} />; })}
            <TextoW x={rx_} y={ry_ - 185} t="RUMEN" tam={64} color="#efffbf" f={f} desde={k(119.6)} />
            
            <TextoW x={rx_} y={ry_ + 240} t={tanque ? "A FERMENTATION TANK" : "TRILLIONS OF MICROBES"} tam={48} color={tanque ? VERDE_C : "#efffbf"} f={f} desde={k(121.2)} />
          </>}
          hud={<FuenteB texto={FUENTE_VACA} desde={0} hasta={k(127.5)} />} />
      );
    };
    return <Pl />;
  },
};

// vos también tenés uno: más chico y más abajo
export const r09e: PlanB = {
  a: 127.56, b: 130.72, trans: { tipo: "barrido", d: 8 },
  sfx: [[127.6, "whoosh"], [128.0, "beep", -10], [128.8, "popcluster", -8, { dur: 1.5 }], [129.6, "pop", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const X = 860, Y = 600, S = 0.95;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1a14", luz: "#7affd4" }} seed={6094} mano={1.2}
          claves={[mira(0, 1000, 470, 0.92), mira(k(130.72), 1060, 620, 1.22, { curva: "inout" })]}
          medio={<>
            <Torso x={X} y={Y} s={S} f={f} cara={f > k(128.6) ? "feliz" : "duda"} gorra tripa={tw(f, k(127.7), k(128.2))} tripaFerm={tw(f, k(128.4), k(129.2))} />
            <Halo x={X} y={Y + 180 * S} r={260} color="#c8ff5a" fuerza={0.35 * tw(f, k(128.4), k(129.2))} />
            <Flecha x1={1200} y1={620} x2={X + 170} y2={Y + 170} p={tw(f, k(128.6), k(129.1))} color={VERDE_C} ancho={10} curva={0.2} />
            <TextoW x={1400} y={560} t="YOU HAVE ONE TOO" tam={56} color={VERDE_C} f={f} desde={k(128.4)} />
            <TextoW x={1400} y={720} t={"SMALLER ·\nFURTHER DOWN"} tam={44} color="#f4efe4" f={f} desde={k(129.5)} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r10 · 38 billones de bacterias ======================
export const r10: PlanB = {
  a: 130.72, b: 136.16, trans: { tipo: "luz", d: 8 },
  sfx: [[130.8, "whoosh_big", -6], [131.6, "popcluster", -6, { dur: 2 }], [132.6, "roll", -2, { dur: 1.8 }], [134.4, "slam", -2], [134.9, "metal", -8], [135.4, "pop", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const n = interpolate(f, [k(132.6), k(134.4)], [0, 38], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
      const lleno = tw(f, k(131.0), k(133.2));
      const bal = pop(f, k(134.6));
      const inc = interpolate(f, [k(134.6), k(135.2), k(135.7), k(136.1)], [-10, 6, -2, 0], cl);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0d1a10", luz: "#9ad84a" }} seed={6100} mano={1}
          claves={[mira(0, 960, 540, 1.0), mira(k(136.16), 960, 540, 1.06)]}
          medio={<>
            {Array.from({ length: 120 }).map((_, i) => {
              const x = 120 + ((i * 197) % 1700), y = 120 + ((i * 113) % 860);
              if (x < 700 && y > 900) return null;
              const ap = interpolate(lleno, [(i % 40) / 40 * 0.8, (i % 40) / 40 * 0.8 + 0.2], [0, 1], cl);
              return <g key={i} opacity={ap * (bal > 0 ? 0.35 : 1)}><Bact x={x} y={y} r={(i * 37) % 180} tipo={i % 3 === 0 ? 1 : 0} f={f} color={PINTAS[i % 5]} cara={i % 4 === 0} /></g>;
            })}
            {n > 0 && <g>
              <rect x={460} y={150} width={1000} height={170} rx={40} fill="#0b140c" opacity={0.85} stroke={VERDE_C} strokeWidth={5} />
              <text x={960} y={276} fontFamily={F_HUD} fontWeight={600} fontSize={110} fill={VERDE_C} textAnchor="middle">{`${Math.round(n)} TRILLION`}</text>
            </g>}
            {bal > 0 && <g transform={`translate(960,760) scale(${bal})`}>
              <path d="M-30,190 L0,0 L30,190 Z" fill="#c9ced2" />
              <g transform={`rotate(${inc})`}>
                <rect x={-430} y={-10} width={860} height={20} rx={10} fill="#c9ced2" />
                {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 400},0)`}>
                  <path d="M-110,90 L0,0 L110,90" stroke="#c9ced2" strokeWidth={4} fill="none" />
                  <path d="M-130,90 h260 q-20,50 -130,50 q-110,0 -130,-50 Z" fill="#9aa0a6" />
                  {sd < 0 ? Array.from({ length: 7 }).map((_, i) => <Bact key={i} x={-90 + (i % 4) * 60} y={60 - Math.floor(i / 4) * 40} tipo={i % 2} f={f} cara={false} color={PINTAS[i % 5]} />)
                    : Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={-80 + (i % 3) * 80} cy={58 - Math.floor(i / 3) * 44} r={26} fill="#e9a28a" stroke="#8a4a3a" strokeWidth={4} />)}
                  <text x={0} y={190} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#f4efe4" textAnchor="middle" stroke="#0b140c" strokeWidth={8} paintOrder="stroke">{sd < 0 ? "BACTERIA" : "YOUR CELLS"}</text>
                </g>)}
              </g>
            </g>}
          </>}
          hud={<FuenteB texto="Sender, Fuchs & Milo, PLOS Biology (2016)" desde={k(132.6)} hasta={k(136.1)} />} />
      );
    };
    return <Pl />;
  },
};

// desarman fibra, hacen vitaminas, le hablan al cerebro
export const r10b: PlanB = {
  a: 136.16, b: 140.32, trans: { tipo: "corte" },
  sfx: [[136.3, "paper", -4], [136.7, "paper", -4], [137.1, "paper", -4], [137.6, "whoosh"], [137.9, "pop", -2], [138.2, "pop", -2], [138.6, "whoosh"], [139.0, "beep", -8], [139.5, "beep", -8], [140.0, "beep", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const fase = f < k(137.6) ? 0 : f < k(138.6) ? 1 : 2;
      const corte = tw(f, k(136.3), k(137.3));
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0d1a10", luz: "#9ad84a" }} seed={6101} mano={1}
          claves={fase < 2 ? [mira(0, 960, 560, 1.15), mira(k(138.6), 960, 560, 1.2)] : [mira(k(138.6), 960, 540, 1.0), mira(k(140.32), 960, 560, 1.06)]}
          medio={<>
            {fase === 0 && <>
              <Celulosa x={960} y={600} s={1.5} corte={corte} f={f} />
              {[[-1, -1], [1, -1], [0, 1], [-1, 1], [1, 1]].map(([a, b], i) => <Bact key={i} x={960 + a * 260 + (1 - corte) * a * 80} y={600 + b * 200} r={a * 20} f={f} color={PINTAS[i]} />)}
            </>}
            {fase === 1 && <>
              {[0, 1, 2].map((i) => <g key={i} transform={`translate(${560 + i * 400},740) scale(2.4)`}><Bact x={0} y={0} f={f} color={PINTAS[i]} /></g>)}
              {["B12", "K", "B7"].map((v, i) => { const p = pop(f, k(137.7 + i * 0.25)); return <g key={v} transform={`translate(${560 + i * 400},${680 - 260 * p}) scale(${1.9 * p})`}><rect x={-60} y={-34} width={120} height={68} rx={34} fill={["#ff8a5a", "#ffc94a", "#7ad8ff"][i]} stroke="#2a2420" strokeWidth={5} /><text y={16} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#1a1a1a" textAnchor="middle">{v}</text></g>; })}
            </>}
            {fase === 2 && <Torso x={960} y={730} s={0.78} f={f} cara="feliz" gorra tripa={1} tripaFerm={1} cerebro={1} vago={tw(f, k(138.7), k(139.1))} vagoPulsos={1} />}
            <TextoW x={960} y={fase === 2 ? 170 : 230} t={["THEY BREAK DOWN FIBER", "THEY MAKE VITAMINS", "THEY TALK TO YOUR BRAIN"][fase]} tam={60} color={VERDE_C} f={f} desde={k([136.2, 137.6, 138.6][fase])} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// 90 % de la serotonina sale de la panza
export const r10c: PlanB = {
  a: 140.32, b: 146.76, trans: { tipo: "corte" },
  sfx: [[140.4, "whoosh"], [141.0, "sparkle", -8], [142.6, "roll", -2, { dur: 1.4 }], [144.0, "slam", -2], [145.2, "pop", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const X = 720, Y = 640, S = 0.88;
      const pct = Math.round(interpolate(f, [k(142.6), k(144.0)], [0, 90], cl));
      const tripaY = Y + 160 * S, cabY = Y - 520 * S;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1a1608", luz: AMARILLO }} seed={6102} mano={1}
          claves={[mira(0, 960, 540, 1.0), mira(k(146.76), 960, 545, 1.06)]}
          medio={<>
            <Torso x={X} y={Y} s={S} f={f} cara={f > k(145.0) ? "feliz" : "duda"} gorra tripa={1} tripaFerm={1} cerebro={1} cerebroColor="#ffb0cf" />
            {/* serotonina: puntos amarillos */}
            {Array.from({ length: 36 }).map((_, i) => { const a = i * 2.4 + f / 18; const r = 30 + (i * 23) % 120; const ap = tw(f, k(141.0) + i, k(141.0) + i + 6); return <circle key={i} cx={X + Math.cos(a) * r * 1.2} cy={tripaY + Math.sin(a) * r * 0.55} r={9} fill={AMARILLO} opacity={ap} />; })}
            {Array.from({ length: 4 }).map((_, i) => { const a = i * 1.6 + f / 14; return <circle key={i} cx={X + Math.cos(a) * 70} cy={cabY + Math.sin(a) * 40} r={9} fill={AMARILLO} opacity={tw(f, k(141.4), k(141.8))} />; })}
            <TextoW x={1420} y={420} t={f < k(144.0) ? "SEROTONIN" : "MADE IN YOUR GUT"} tam={f < k(144.0) ? 76 : 62} color={f < k(144.0) ? AMARILLO : VERDE_C} f={f} desde={k(140.6)} />
            {f < k(144.0) && <TextoW x={1420} y={500} t="A CHEMICAL TIED TO MOOD" tam={40} color="#f4efe4" f={f} desde={k(141.6)} />}
            {pct > 0 && <TextoW x={1420} y={760} t={`${pct}%`} tam={170} color={AMARILLO} f={f} desde={k(142.6)} />}
            {pct > 0 && <Flecha x1={1240} y1={720} x2={X + 190} y2={tripaY} p={tw(f, k(143.4), k(143.9))} color={AMARILLO} ancho={10} curva={0.2} />}
            <TextoW x={X + 150} y={cabY + 60} t="10%" tam={54} color="#c9ced2" f={f} desde={k(144.4)} ancla="start" />
          </>}
          hud={<FuenteB texto="Gut serotonin: Yano et al., Cell (2015)" desde={k(141)} hasta={k(146.6)} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== r11 · el café de Lena ======================
const LENA_X = 900, OWEN_C = 1500;
const Lena: React.FC<{ f: number; k: (s: number) => number; poses?: any[]; caras?: any[]; habla?: [number, number][]; miradas?: any[] }> = ({ poses, caras, habla, miradas }) => (
  <Persona look={LENA} seed={18} luz={RIM.tubo} escala={1.05} ruta={[{ f: 0, x: LENA_X, y: CAFE_PISO - 150 }]} dir={[{ f: 0, v: 1 }]} poses={poses ?? [{ f: 0, v: "parado" }]} caras={caras ?? [{ f: 0, v: "feliz" }]} habla={habla} miradas={miradas} />
);
const Mostrador: React.FC<{ f: number; tazas: number; pila: number; k: (s: number) => number }> = ({ f, tazas, pila }) => (
  <>
    <MostradorCafe x={1100} />
    {Array.from({ length: tazas }).map((_, i) => <g key={i} transform={`translate(${1000 + i * 40},${CAFE_PISO - 316}) scale(${Math.min(1, (tazas - i) * 3)})`}><TazaCafe s={0.62} f={f} /></g>)}
    {/* la montaña de facturas */}
    {Array.from({ length: Math.round(pila * 14) }).map((_, i) => { const fila = i < 5 ? 0 : i < 9 ? 1 : i < 12 ? 2 : 3; const enF = [0, 5, 9, 12][fila]; const nF = [5, 4, 3, 2][fila]; return <g key={i} transform={`translate(${1230 + (i - enF - (nF - 1) / 2) * 50},${CAFE_PISO - 326 - fila * 32})`}><Pastel s={0.75} c={i} /></g>; })}
  </>
);
export const r11: PlanB = {
  a: 146.76, b: 148.92, trans: { tipo: "barrido", d: 10 },
  sfx: [[146.8, "bus_brake", -8], [147.6, "door_bell", -4], [148.0, "step", -6], [148.4, "step", -6], [148.8, "step", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={CafeDentro} pal={PAL} seed={6110} mano={1.5}
          claves={[mira(0, 1120, 540, 1.1), mira(k(148.92), 1180, 540, 1.25, { curva: "inout" })]}
          medio={<>
            <Lena f={f} k={k} poses={[{ f: 0, v: "parado" }, { f: k(147.7), v: "saludar" }]} caras={[{ f: 0, v: "neutral" }, { f: k(147.7), v: "feliz" }]} habla={[[k(147.8), k(148.6)]]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
            <Mostrador f={f} tazas={0} pila={0} k={k} />
            <Persona look={OWEN} seed={47} luz={RIM.tubo} escala={1.05} ruta={[{ f: 0, x: 1950, y: CAFE_PISO }, { f: k(148.3), x: OWEN_C, y: CAFE_PISO }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: {} }]} caras={[{ f: 0, v: "determinado" }]} cartel={panza({ tam: 30, dy: -10 })} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// cuatro cafés y todo lo de la vitrina
export const r11b: PlanB = {
  a: 148.92, b: 152.38, trans: { tipo: "corte" },
  sfx: [[149.3, "cup", -4], [149.7, "cup", -4], [150.1, "cup", -4], [150.5, "cup", -4], [150.9, "plates", -6, { dur: 1.4 }], [151.5, "pop", -6], [152.0, "pop", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const tazas = interpolate(f, [k(149.2), k(150.6)], [0, 4], cl);
      const pila = tw(f, k(150.9), k(152.2));
      return (
        <Escena Set={CafeDentro} pal={PAL} seed={6111} mano={1.5}
          claves={[mira(0, 1220, 560, 1.5), mira(k(152.38), 1230, 560, 1.58)]}
          medio={<>
            <Lena f={f} k={k} poses={[{ f: 0, v: { hD: 60, cD: 40 } }, { f: k(149.2), v: { hD: 80, cD: 20 } }, { f: k(150.9), v: { hD: 100, cD: 30, hI: 60, cI: 60 } }]} caras={[{ f: 0, v: "feliz" }, { f: k(151.4), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(151.4), v: { x: 1, y: 0.5 } }]} />
            <Mostrador f={f} tazas={tazas} pila={pila} k={k} />
            <Persona look={OWEN} seed={47} luz={RIM.tubo} escala={1.05} ruta={[{ f: 0, x: OWEN_C, y: CAFE_PISO }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 95, cD: 10 } }, { f: k(150.8), v: { hD: 120, cD: 10, hI: 90, cI: 10 } }]} caras={[{ f: 0, v: "feliz" }, { f: k(150.8), v: "risa" }]} habla={[[k(149.0), k(151.8)]]} />
            <GloboM x={OWEN_C - 40} y={470} texto={"Four coffees.\nAnd… all of that."} desde={k(149.0)} hasta={k(152.3)} tam={30} lado={-1} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// Lena mira la pila, lo mira a él: «¿estás bien?»
export const r11c: PlanB = {
  a: 152.38, b: 158.36, trans: { tipo: "corte" },
  sfx: [[152.5, "whoosh", -10], [154.5, "chair", -12], [156.4, "heart1", -6], [157.8, "suspense", -10, { dur: 1.5 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={CafeDentro} pal={PAL} seed={6112} mano={1.5}
          claves={[mira(0, 1180, 540, 1.5), mira(k(154.4), 1180, 540, 1.55), mira(k(156.4), 1180, 520, 1.45, { curva: "inout" }), mira(k(158.36), 1190, 520, 1.48)]}
          medio={<>
            <Lena f={f} k={k} poses={[{ f: 0, v: { hD: 20, cD: 40, hI: 20, cI: 40 } }, { f: k(154.4), v: { hD: 40, cD: 120, hI: 40, cI: 120 } }, { f: k(156.4), v: { hD: 70, cD: 50 } }]}
              caras={[{ f: 0, v: "sorpresa" }, { f: k(154.4), v: "duda" }, { f: k(156.4), v: "triste" }]} habla={[[k(154.6), k(158.2)]]}
              miradas={[{ f: 0, v: { x: 1, y: 0.6 } }, { f: k(153.8), v: { x: 1, y: 0 } }]} />
            <Mostrador f={f} tazas={4} pila={1} k={k} />
            <Persona look={OWEN} seed={47} luz={RIM.tubo} escala={1.05} ruta={[{ f: 0, x: OWEN_C, y: CAFE_PISO }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 74, cD: 150 } }, { f: k(156.4), v: { hD: 40, cD: 100, cabeza: 8 } }]} caras={[{ f: 0, v: "risa" }, { f: k(156.4), v: "sorpresa" }]} habla={[[0, k(156.0)]]}
              enManoD={(ff: number) => ff < k(156.4) ? <Pastel s={0.9} c={1} /> : <Pastel s={0.9} c={1} />} />
            <GloboM x={LENA_X + 80} y={400} texto={"Are you okay? You look like\nyou're eating for somebody else."} desde={k(154.6)} hasta={k(158.36)} tam={28} lado={1} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// no tiene respuesta
export const r11d: PlanB = {
  a: 158.36, b: 159.66, trans: { tipo: "corte" },
  sfx: [[158.4, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={CafeDentro} pal={PAL} seed={6113} mano={1}
          claves={[mira(0, OWEN_C - 30, 520, 2.6), mira(k(159.66), OWEN_C - 30, 530, 2.75)]}
          medio={<>
            <Mostrador f={f} tazas={4} pila={1} k={k} />
            <Persona look={OWEN} seed={47} luz={RIM.tubo} escala={1.05} ruta={[{ f: 0, x: OWEN_C, y: CAFE_PISO }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 40, cD: 100, cabeza: 10 } }, { f: k(158.9), v: { hD: 20, cD: 60, cabeza: 18 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(158.7), v: "triste" }]}
              miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(158.9), v: { x: 0, y: 1 } }]} enManoD={() => <Pastel s={0.9} c={1} />} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r12 · CTA: ¿qué comerías primero? ======================
const CTA_SET = { tono: "#22180c", luz: AMARILLO };
const Pensamiento: React.FC<{ x: number; y: number; p: number; children: React.ReactNode }> = ({ x, y, p, children }) => (
  <g transform={`translate(${x},${y}) scale(${p})`}>
    {[[-300, 200, 20], [-250, 150, 30]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#fbf8f1" stroke="#221c18" strokeWidth={4} />)}
    <ellipse rx={260} ry={180} fill="#fbf8f1" stroke="#221c18" strokeWidth={5} />
    {children}
  </g>
);
export const r12: PlanB = {
  a: 159.66, b: 165.82, trans: { tipo: "fundido", d: 12 },
  sfx: [[159.7, "whoosh"], [160.2, "pop", -2], [161.5, "pop", -2], [162.2, "pop", -6], [162.9, "pop", -6], [163.6, "pop", -6], [164.3, "pop", -6], [165.0, "pop", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const comidas = [<Pizza s={1.3} />, <Burrito s={1.4} />, <Taco s={1.4} />, <Dona s={1.5} />, <g><Pastel s={2} /></g>, <Avion s={0.55} />];
      const n = Math.min(comidas.length - 1, Math.max(0, Math.floor((f - k(162.0)) / (0.68 * 30))));
      const piensa = f > k(161.4);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={CTA_SET} seed={6120} mano={1.5}
          claves={[mira(0, 900, 560, 1.15), mira(k(165.82), 920, 560, 1.2)]}
          detras={pisoOsc(900, "#1a1208", AMARILLO)}
          medio={<>
            <Persona look={OWEN} seed={47} escala={1.75} luz={{ lado: 1, color: AMARILLO, fuerza: 0.6 }} ruta={[{ f: 0, x: 520, y: 900 }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 150, cD: 6, hI: 10, cI: 30 } }, { f: k(161.4), v: "pensar" }]}
              caras={[{ f: 0, v: "picaro" }, { f: k(161.4), v: "duda" }, { f: k(163.4), v: "risa" }]} miradas={[{ f: 0, v: { x: 0, y: 0 } }, { f: k(161.4), v: { x: 1, y: -0.6 } }]} />
            {piensa && <Pensamiento x={1180} y={470} p={pop(f, k(161.5))}>
              <g key={n} transform={`scale(${pop(f, k(162.0) + n * 0.68 * 30, 30, 260)})`}>{f > k(162.0) ? comidas[n] : <text y={50} fontFamily={F_HUD} fontWeight={600} fontSize={150} fill="#221c18" textAnchor="middle">?</text>}</g>
            </Pensamiento>}
            <TextoW x={piensa ? 1180 : 960} y={piensa ? 180 : 220} t={piensa ? "ONE DAY. ANY FOOD.\nWHAT'S FIRST?" : "QUICK QUESTION"} tam={piensa ? 52 : 70} color={AMARILLO} f={f} desde={k(159.8)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// comentá + suscribite (uno por vez), y la clínica le va a dar de comer algo
export const r12b: PlanB = {
  a: 165.82, b: 170.48, trans: { tipo: "corte" },
  sfx: [[165.9, "pop", 0], [166.2, "type", -10, { dur: 0.8 }], [167.1, "whoosh"], [167.9, "pop", 0], [168.0, "ding", -4], [168.8, "whoosh"], [169.3, "metal", -6], [169.8, "gasp", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const cloche = f > k(168.8);
      const tapa = tw(f, k(169.4), k(169.9));
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={CTA_SET} seed={6121} mano={1.5}
          claves={[mira(0, 920, 560, 1.2), mira(k(168.8), 920, 560, 1.22), mira(k(170.48), 860, 600, 1.4, { curva: "inout" })]}
          detras={pisoOsc(900, "#1a1208", AMARILLO)}
          medio={<>
            {cloche && <g transform={`translate(1000,900) scale(${pop(f, k(168.8))})`}>
              <rect x={-10} y={-300} width={20} height={300} fill="#5a4a3a" /><rect x={-170} y={-316} width={340} height={20} rx={8} fill="#7a6a5a" />
              <ellipse cx={0} cy={-330} rx={170} ry={18} fill="#e9eef2" stroke="#9aa0a6" strokeWidth={4} />
              <g transform={`translate(0,${-330 - tapa * 160}) rotate(${tapa * 20})`}><path d="M-150,0 A150,130 0 0,1 150,0 Z" fill="#d6dce0" stroke="#9aa0a6" strokeWidth={5} /><circle cy={-136} r={14} fill="#9aa0a6" /></g>
              {tapa > 0.2 && <text x={0} y={-350} fontFamily={F_HUD} fontWeight={600} fontSize={110} fill={ROJO} textAnchor="middle" opacity={tapa}>?</text>}
              <text x={0} y={-440 - tapa * 180} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f4efe4" textAnchor="middle" opacity={1 - tapa}>HALDEN CLINIC</text>
            </g>}
            <Persona look={OWEN} seed={47} escala={1.75} luz={{ lado: 1, color: AMARILLO, fuerza: 0.6 }} ruta={[{ f: 0, x: 520, y: 900 }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 95, cD: 4 } }, { f: k(167.0), v: { hD: 110, cD: 30, hI: 20, cI: 90 } }, { f: k(168.1), v: "celebrar" }, { f: k(168.8), v: { hD: 30, cD: 100, hI: 30, cI: 100, cabeza: 6 } }]}
              caras={[{ f: 0, v: "feliz" }, { f: k(168.1), v: "risa" }, { f: k(169.4), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }, { f: k(168.8), v: { x: 1, y: 0.4 } }]} />
          </>}
          hud={<>
            {f < k(167.0) && <Comentario x={860} y={300} desde={k(165.85)} texto="a whole wedding cake" nombre="@you" w={820} f={f} />}
            {f >= k(167.0) && f < k(168.8) && <BotonSub6 x={1240} y={420} desde={k(167.0)} clic={k(167.9)} f={f} tam={70} />}
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r13 · martes: come sin parar y lee sobre estómagos ======================
const MESA = DES_PUNTOS.mesa, SILLA = DES_PUNTOS.silla;
const Silla: React.FC = () => <g transform={`translate(${SILLA},${DES_PISO})`}><rect x={-56} y={-70} width={112} height={14} rx={5} fill="#4a5560" /><rect x={36} y={-190} width={14} height={134} rx={5} fill="#4a5560" /><rect x={-50} y={-58} width={10} height={58} fill="#3a434c" /><rect x={40} y={-58} width={10} height={58} fill="#3a434c" /></g>;
const SENTADO = { pI: 85, rI: -80, pD: 88, rD: -85 };
export const r13: PlanB = {
  a: 170.48, b: 174.8, trans: { tipo: "cortina", lado: 1 },
  sfx: [[170.5, "whoosh"], [171.4, "chair", -8], [172.6, "eat", -4], [173.1, "eat", -4], [173.5, "paper", -8], [173.9, "eat", -4], [174.3, "eat", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const snacks = [<Dona s={0.55} />, <Banana s={0.5} />, <Pizza s={0.6} />, <Taco s={0.6} />, <Burrito s={0.5} />];
      const i = Math.max(0, Math.min(snacks.length - 1, Math.floor((f - k(172.5)) / 14)));
      const come = f > k(172.5);
      const ciclo = come ? ((f - k(172.5)) % 14) / 14 : 0;
      const env = come ? Math.min(8, Math.floor((f - k(172.5)) / 7)) : 0;
      const piernaR = Math.sin(f * 0.9) * 6;
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "dia" }} seed={6130} mano={1.5}
          claves={[mira(0, 1080, 600, 1.8), mira(k(174.8), 1100, 610, 2.05, { curva: "inout" })]}
          medio={<>
            <CajaDonas x={MESA - 80} y={DES_PISO - 210} n={Math.max(0, 6 - i)} caja={1} s={0.9} />
            {Array.from({ length: env }).map((_, j) => <rect key={j} x={MESA + 30 + (j * 23) % 90} y={DES_PISO - 222 - (j % 3) * 6} width={40} height={14} rx={4} fill={["#e2483a", "#ffc94a", "#7ad8ff"][j % 3]} transform={`rotate(${(j * 37) % 40 - 20},${MESA + 50 + (j * 23) % 90},${DES_PISO - 215})`} />)}
            <Silla />
            <Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: SILLA, y: DES_PISO }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 62 }]}
              poses={come ? [{ f: 0, v: { ...SENTADO, hD: ciclo < 0.5 ? 74 : 50, cD: ciclo < 0.5 ? 150 : 90, hI: 20, cI: 90, tronco: 8 } }] : [{ f: 0, v: { ...SENTADO, hD: 20, cD: 40, hI: 20, cI: 40, tronco: 4, pD: 88 + piernaR } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(171.8), v: "duda" }, { f: k(172.5), v: "determinado" }]} habla={come ? [[k(172.5), k(174.8)]] : undefined}
              miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(171.6), v: { x: 1, y: 0 } }, { f: k(172.1), v: { x: -1, y: 0.4 } }]}
              enManoD={() => come && ciclo < 0.85 ? snacks[i] : null} cartel={panza({ tam: 30, dy: -10 })} />
          </>}
          hud={<Txt t="TUESDAY" a={k(170.6)} b={k(172.4)} f={f} top={150} tam={66} color={VERDE} chip />} />
      );
    };
    return <Pl />;
  },
};
export const r13b: PlanB = {
  a: 174.8, b: 179.32, trans: { tipo: "corte" },
  sfx: [[174.9, "pop", -6], [175.1, "type", -10, { dur: 1.4 }], [176.6, "pop", -8], [177.6, "sparkle", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "dia" }} seed={6131} mano={1.5}
          claves={[mira(0, 1400, 600, 2.3), mira(k(179.32), 1410, 600, 2.4)]}
          medio={<>
            <CajaDonas x={MESA - 80} y={DES_PISO - 210} n={0} caja={1} s={0.9} />
            <Silla />
            <Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: SILLA, y: DES_PISO }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 62 }]}
              poses={[{ f: 0, v: { ...POSE_CELU_SENTADO } }]} caras={[{ f: 0, v: "duda" }, { f: k(176.4), v: "sorpresa" }, { f: k(177.5), v: "feliz" }]}
              enManoD={() => <Celular s={0.9} brillo="#7ab8ff" />} />
          </>}
          hud={<CeluGrande x={1180} y={130} desde={k(174.85)} f={f} de="Search" icono="G" color="#2a6fd6" hora="12:30"
            lineas={["can a stomach", "digest anything?", "▸ man ate a plane", "▸ stomach acid pH 2"]} escribe={k(175.1)} vel={1.4} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== r14 · Monsieur Mangetout ======================
const LOT_X = 820;
const Lotito: React.FC<{ poses: any[]; caras: any[]; habla?: [number, number][]; mano?: (ff: number) => React.ReactNode; x?: number; escala?: number; dir?: 1 | -1; miradas?: any[] }> = ({ poses, caras, habla, mano, x = LOT_X, escala = 1.3, dir = 1, miradas }) => (
  <Persona look={LOTITO} seed={78} escala={escala} luz={{ lado: -1, color: "#ffe0a0", fuerza: 0.7 }} ruta={[{ f: 0, x, y: 900 }]} dir={[{ f: 0, v: dir }]} poses={poses} caras={caras} habla={habla} enManoD={mano} miradas={miradas} />
);
const Mesita: React.FC<{ x: number; children?: React.ReactNode }> = ({ x, children }) => (
  <g transform={`translate(${x},900)`}><rect x={-8} y={-280} width={16} height={280} fill="#3a2a22" /><rect x={-80} y={-12} width={160} height={12} fill="#3a2a22" /><rect x={-210} y={-300} width={420} height={24} rx={6} fill="#f4efe4" /><path d="M-210,-276 h420 l-14,40 h-392 Z" fill="#c23a2e" /><g transform="translate(0,-300)">{children}</g></g>
);
const FUENTE_LOT = "Guinness World Records: Michel Lotito, «strangest diet»";
export const r14: PlanB = {
  a: 179.32, b: 186.98, trans: { tipo: "luz", d: 12, color: "#fff3d0" },
  sfx: [[179.4, "whoosh"], [179.8, "step", -6], [180.3, "step", -6], [180.8, "step", -6], [181.9, "fanfare", -8], [182.4, "cloth", -4], [184.9, "pop", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const lx = interpolate(f, [0, k(181.0)], [-200, 960], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 2) });
      const banner = tw(f, k(182.2), k(182.9));
      return (
        <Escena Set={Escenario} pal={PAL} seed={6140} mano={1.5}
          claves={[mira(0, 960, 600, 1.25), mira(k(181.9), 960, 580, 1.2, { curva: "inout" }), mira(k(186.98), 960, 600, 1.35)]}
          medio={<>
            <Persona look={LOTITO} seed={78} escala={1.2} luz={{ lado: -1, color: "#ffe0a0", fuerza: 0.7 }} ruta={[{ f: 0, x: lx, y: 900 }]} dir={[{ f: 0, v: 1 }, { f: k(181.0), v: -1 }]}
              poses={[{ f: 0, v: {} }, { f: k(181.1), v: "saludar" }, { f: k(182.4), v: "celebrar" }, { f: k(184.9), v: { hD: 60, cD: 120, hI: 60, cI: 120, tronco: 4 } }]}
              caras={[{ f: 0, v: "feliz" }, { f: k(182.4), v: "risa" }, { f: k(184.9), v: "picaro" }]} miradas={[{ f: 0, v: { x: 0, y: 0 } }]} />
            {banner > 0 && <g transform={`translate(960,${400})`}>
              <rect x={-470 * banner} y={-70} width={940 * banner} height={140} rx={14} fill="#c23a2e" stroke="#ffd27a" strokeWidth={6} />
              {banner > 0.9 && <text y={26} fontFamily={F_HUD} fontWeight={600} fontSize={f < k(184.9) ? 74 : 60} fill="#fff3d6" textAnchor="middle">{f < k(184.9) ? "MONSIEUR MANGETOUT" : "= «MR. EATS EVERYTHING»"}</text>}{banner > 0.9 && <text x={0} y={120} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill={AMARILLO} textAnchor="middle">1970s</text>}
            </g>}
            {f < k(182.2) && <TextoW x={960} y={400} t="MICHEL LOTITO · FRANCE" tam={64} color="#f4efe4" f={f} desde={k(179.6)} />}
          </>}
          hud={<FuenteB texto={FUENTE_LOT} desde={k(180)} hasta={k(186.9)} />} />
      );
    };
    return <Pl />;
  },
};
// bicicletas y televisores
export const r14b: PlanB = {
  a: 186.98, b: 189.44, trans: { tipo: "corte" },
  sfx: [[187.0, "metal", -2], [187.4, "metal", -2], [187.8, "metal", -4], [188.2, "glass", -4], [188.6, "glass", -4], [189.0, "eat", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const bici = f < k(188.1);
      const partes = bici ? tw(f, k(187.0), k(188.0), 1, 0.1) : tw(f, k(188.2), k(189.3), 1, 0.15);
      const ciclo = ((f % 12) / 12) < 0.5;
      return (
        <Escena Set={Escenario} pal={PAL} seed={6141} mano={1.5}
          claves={[mira(0, 1000, 530, 1.75), mira(k(189.44), 1010, 530, 1.82)]}
          medio={<>
            <Mesita x={1180}>{bici ? <g transform="translate(0,-75)"><Bici s={0.9} partes={partes} /></g> : <g transform="translate(0,-95)"><Tele s={0.85} partes={partes} f={f} /></g>}</Mesita>
            <Lotito poses={[{ f: 0, v: { hD: ciclo ? 74 : 60, cD: ciclo ? 150 : 60, hI: 20, cI: 40 } }]} caras={[{ f: 0, v: "determinado" }, { f: k(188.0), v: "risa" }]} habla={[[0, k(189.4)]]}
              x={880} mano={() => ciclo ? <rect x={-30} y={-8} width={60} height={16} rx={6} fill={bici ? "#d23a2e" : "#7a5a3a"} /> : null} />
            <TextoW x={900} y={340} t={bici ? "BICYCLES" : "TELEVISIONS"} tam={60} color={AMARILLO} f={f} desde={k(187.0)} />
          </>}
          hud={<FuenteB texto={FUENTE_LOT} desde={0} hasta={k(189.4)} />} />
      );
    };
    return <Pl />;
  },
};
// un Cessna 150 en dos años
export const r14c: PlanB = {
  a: 189.44, b: 197.6, trans: { tipo: "corte" },
  sfx: [[189.5, "whoosh_big", -4], [190.4, "metal", -4], [191.4, "metal_fall", -6], [192.4, "metal", -4], [193.0, "paper", -6], [193.4, "metal", -4], [194.6, "paper", -6], [195.0, "metal", -4], [196.2, "metal", -4], [196.8, "stamp", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const queda = tw(f, k(190.4), k(196.6), 1, 0.06);
      const anio = f < k(192.8) ? 1978 : f < k(194.6) ? 1979 : 1980;
      const ciclo = ((f % 16) / 16) < 0.5;
      const AX = 1260, AY = 720;
      return (
        <Escena Set={Escenario} pal={PAL} seed={6142} mano={1.5}
          claves={[mira(0, 1000, 520, 1.05), mira(k(190.4), 980, 540, 1.1, { curva: "inout" }), mira(k(197.6), 960, 560, 1.18)]}
          medio={<>
            {/* el avión, que se achica de la cola a la nariz */}
            <defs><clipPath id="cl6avion"><rect x={AX - 400} y={AY - 300} width={800 * queda} height={600} /></clipPath></defs>
            <g clipPath="url(#cl6avion)" transform={`translate(${AX},${AY})`}><Avion s={1.05} /></g>
            {/* la pila de pedacitos en la mesa */}
            <Mesita x={680}>{Array.from({ length: Math.round((1 - queda) * 26) }).map((_, i) => <rect key={i} x={-150 + (i * 53) % 300} y={-20 - Math.floor(i / 6) * 14} width={34} height={12} rx={3} fill={i % 5 === 0 ? "#c23a2e" : "#e9eef2"} stroke="#9aa0a6" strokeWidth={2} transform={`rotate(${(i * 41) % 60 - 30},${-133 + (i * 53) % 300},${-14 - Math.floor(i / 6) * 14})`} />)}</Mesita>
            <Lotito x={460} poses={[{ f: 0, v: { hD: ciclo ? 74 : 60, cD: ciclo ? 150 : 50, hI: 30, cI: 60 } }]} caras={[{ f: 0, v: "determinado" }, { f: k(195.5), v: "feliz" }]} habla={[[k(190.2), k(197.4)]]}
              mano={() => ciclo ? <rect x={-20} y={-6} width={40} height={12} rx={3} fill="#e9eef2" stroke="#9aa0a6" strokeWidth={2} /> : null} />
            {/* calendario */}
            <g transform="translate(1340,250)">
              <rect x={-150} y={-90} width={300} height={190} rx={18} fill="#fbf8f1" stroke="#2a2420" strokeWidth={5} />
              <rect x={-150} y={-90} width={300} height={46} rx={18} fill={ROJO} />
              <text y={70} fontFamily={F_HUD} fontWeight={600} fontSize={96} fill="#2a2420" textAnchor="middle">{anio}</text>
            </g>
            <TextoW x={820} y={210} t={f < k(195.4) ? "A CESSNA 150" : "≈ 2 YEARS"} tam={64} color={AMARILLO} f={f} desde={k(189.7)} />
          </>}
          hud={<FuenteB texto={FUENTE_LOT} desde={0} hasta={k(197.5)} />} />
      );
    };
    return <Pl />;
  },
};
// paredes del estómago gruesas + Guinness + «hasta él tenía una regla»
export const r14d: PlanB = {
  a: 197.6, b: 200.96, trans: { tipo: "barrido", d: 8 },
  sfx: [[197.7, "whoosh"], [198.2, "beep", -10], [199.0, "pop", -4], [199.8, "pop", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#141a24", luz: "#9fdcff" }} seed={6143} mano={1}
          claves={[mira(0, 960, 560, 1.0), mira(k(200.96), 960, 560, 1.06)]}
          medio={<>
            <g opacity={tw(f, k(197.8), k(198.2))}><Estomago x={520} y={640} s={0.55} f={f} acido={0.4} moco={0.15} cara="feliz" /></g>
            <g opacity={tw(f, k(198.6), k(199.0))}><Estomago x={1240} y={600} s={0.85} f={f} acido={0.4} moco={1} cara="feliz" /></g>
            <TextoW x={520} y={930} t="NORMAL" tam={50} color="#9aa4ac" f={f} desde={k(198.0)} />
            <TextoW x={1240} y={960} t="LOTITO" tam={56} color={AMARILLO} f={f} desde={k(198.8)} />
            <TextoW x={960} y={200} t="UNUSUALLY THICK LININGS" tam={64} color="#9fdcff" f={f} desde={k(199.6)} />
          </>}
          hud={<FuenteB texto={FUENTE_LOT} desde={0} hasta={k(200.9)} />} />
      );
    };
    return <Pl />;
  },
};
export const r14e: PlanB = {
  a: 200.96, b: 203.98, trans: { tipo: "corte" },
  sfx: [[201.0, "whoosh"], [201.4, "stamp", 0], [202.0, "fanfare", -12], [203.0, "pop", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const libro = pop(f, k(201.0));
      const sello = pop(f, k(201.4), 30, 260);
      return (
        <Escena Set={Escenario} pal={PAL} seed={6144} mano={1.5}
          claves={[mira(0, 960, 560, 1.45), mira(k(202.9), 960, 560, 1.5), mira(k(203.98), 960, 540, 1.55, { curva: "inout" })]}
          medio={<>
            <Lotito x={800} escala={1.5} poses={[{ f: 0, v: { hD: 100, cD: 40, hI: 100, cI: 40 } }, { f: k(202.9), v: { hD: 150, cD: 6, hI: 20, cI: 40 } }]} caras={[{ f: 0, v: "risa" }, { f: k(202.9), v: "picaro" }]} habla={[[k(203.0), k(203.9)]]} />
            {f < k(202.9) && <g transform={`translate(1170,560) scale(${libro}) rotate(-4)`}>
              <rect x={-190} y={-250} width={380} height={480} rx={14} fill="#1a3a8a" stroke="#ffd27a" strokeWidth={8} />
              <text y={-130} fontFamily={F_HUD} fontWeight={600} fontSize={64} fill="#ffd27a" textAnchor="middle">GUINNESS</text>
              <text y={-60} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#fff3d6" textAnchor="middle">WORLD RECORDS</text>
              <g transform={`translate(0,90) rotate(-10) scale(${sello})`}><rect x={-170} y={-60} width={340} height={120} rx={14} fill="none" stroke={ROJO} strokeWidth={10} /><text y={18} fontFamily={F_HUD} fontWeight={600} fontSize={46} fill={ROJO} textAnchor="middle">STRANGEST DIET</text></g>
            </g>}
            {f >= k(202.9) && <TextoW x={1190} y={380} t={"EVEN HE\nHAD A RULE"} tam={60} color="#f4efe4" f={f} desde={k(202.95)} />}
          </>}
          hud={<FuenteB texto={FUENTE_LOT} desde={0} hasta={k(203.9)} />} />
      );
    };
    return <Pl />;
  },
};
export const r14f: PlanB = {
  a: 203.98, b: 206.3, trans: { tipo: "corte" },
  sfx: [[204.1, "fail", -6], [204.3, "stamp", -2], [205.1, "fail", -6], [205.3, "stamp", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Escenario} pal={PAL} seed={6145} mano={1.2}
          claves={[mira(0, 1000, 560, 1.4), mira(k(206.3), 1000, 560, 1.48)]}
          medio={<>
            <Mesita x={1220}><g transform="translate(-100,-60)"><Banana s={0.8} /></g><g transform="translate(100,-80)"><Huevo s={0.7} /></g></Mesita>
            <Lotito x={680} escala={1.4} poses={[{ f: 0, v: { hD: 90, cD: 10, hI: 20, cI: 40, tronco: -6 } }, { f: k(205.0), v: "brazosCruzados" }]} caras={[{ f: 0, v: "asco" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }]} />
            {[0, 1].map((i) => { const p = pop(f, k(204.2 + i * 1.0), 30, 260); return p > 0 ? <g key={i} transform={`translate(${1120 + i * 200},${520}) scale(${p})`}><circle r={100} fill="none" stroke={ROJO} strokeWidth={14} /><path d="M-70,70 L70,-70" stroke={ROJO} strokeWidth={14} /></g> : null; })}
            <TextoW x={1220} y={300} t={f < k(205.1) ? "NO BANANAS" : "NO HARD-BOILED EGGS"} tam={58} color={ROJO} f={f} desde={k(204.2)} />
          </>}
          hud={<FuenteB texto={FUENTE_LOT} desde={0} hasta={k(206.2)} />} />
      );
    };
    return <Pl />;
  },
};
