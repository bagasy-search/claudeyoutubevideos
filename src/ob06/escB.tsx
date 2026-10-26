// ob06 · escenas 6-8 (la ciencia del estómago, Tiny y las apuestas, la parada 30)
import React from "react";
import { interpolate } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Escena } from "../anikit/escena";
import { PAL, OWEN, TINY, ABRIGO, RIM, VERDE } from "../owen/elenco";
import { ROJO } from "../owen/cartel";
import { Persona } from "../owen/b/gente";
import { PlanB, Pizarra, GloboM, FuenteB, NumeroM } from "../owen/b/lib";
import { Bus9 } from "../owen/mundo/bus";
import { Ashland, ASH_CARRIL } from "../owen/mundo/ashland";
import { Descanso, DES_PISO, DES_PUNTOS, CajaDonas } from "../owen/mundo/sala";
import { AMARILLO, cl, panza, Txt, F_HUD, F_MANO } from "./comun6";
import { Estomago, CorteMuro, CaraOrg, TextoW, Flecha, Burrito, Dona, Charco, Halo, pop, tw } from "./kit6";

const ACIDO = "#c8ff4a";
const FUENTE = "Gastric acid & mucosal protection: standard physiology texts";
const piso = (y = 900, color = "#0e160c") => <><rect x={-2000} y={y} width={6000} height={900} fill={color} /><Charco x={960} y={y + 6} rx={700} color="#c8ff5a" fuerza={0.25} /></>;

// ====================== r06 · rayos X: dentro de Owen hay una bolsa ======================
export const r06: PlanB = {
  a: 45.22, b: 49.32, trans: { tipo: "barrido", d: 10 },
  sfx: [[45.3, "whoosh"], [45.9, "beep", -8], [46.4, "drone", -10, { dur: 1.6 }], [47.6, "whoosh_big", -4], [48.4, "pop", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const rx = tw(f, k(46.2), k(47.4));
      const barre = interpolate(f, [k(45.8), k(47.4)], [250, 900], cl);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1a14", luz: "#7affd4" }} seed={6060} mano={1.5}
          claves={[mira(0, 960, 600, 1.4), mira(k(47.4), 950, 600, 2.0, { curva: "inout" }), mira(k(49.32), 945, 600, 2.9, { curva: "in" })]}
          detras={piso()}
          medio={<>
            <Persona look={OWEN} seed={47} escala={1.9} luz={{ lado: -1, color: "#7affd4", fuerza: 0.8 }} ruta={[{ f: 0, x: 960, y: 900 }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: "parado" }, { f: k(46.0), v: { hD: 20, cD: 60, hI: 20, cI: 60, cabeza: 14 } }]}
              caras={[{ f: 0, v: "duda" }, { f: k(46.4), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0 } }, { f: k(46.4), v: { x: 0, y: 1 } }]}
              opacidad={() => 1 - rx * 0.55} />
            {/* el estómago se ve a través del cuerpo */}
            <g opacity={rx}><Estomago x={950} y={600} s={0.24} f={f} acido={0.35} burb={1} /></g>
            {/* la barra del escáner */}
            {f > k(45.8) && f < k(47.6) && <><rect x={700} y={barre - 4} width={520} height={8} fill="#7affd4" /><rect x={700} y={barre - 40} width={520} height={40} fill="#7affd4" opacity={0.15} /></>}
          </>}
          hud={<FuenteB texto={FUENTE} desde={k(46)} hasta={k(49.4)} />} />
      );
    };
    return <Pl />;
  },
};
// una bolsa llena de ácido · HCl · le saca el óxido al acero
export const r06b: PlanB = {
  a: 49.32, b: 55.48, trans: { tipo: "corte" },
  sfx: [[49.4, "pour", -4, { dur: 1.6 }], [50.4, "fire", -14, { dur: 1.4 }], [51.96, "slam", -2], [52.6, "metal", -4], [52.9, "water", -10, { dur: 1 }], [53.6, "fire", -12, { dur: 1.4 }], [54.8, "sparkle", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const ac = interpolate(f, [k(49.4), k(51.0)], [0, 0.55], cl);
      const limpio = tw(f, k(53.4), k(55.0));
      const baja = interpolate(f, [k(52.6), k(53.2)], [-260, 0], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1a14", luz: ACIDO }} seed={6061} mano={1.5}
          claves={[mira(0, 900, 560, 1.06), mira(k(51.96), 960, 540, 1.0, { curva: "inout" }), mira(k(55.48), 960, 540, 1.03)]}
          medio={<>
            <Estomago x={600} y={600} s={1.0} f={f} acido={ac} cara={f > k(50.4) ? "miedo" : "duda"} />
            {f < k(51.9) && <TextoW x={1250} y={300} t={"A BAG\nOF ACID"} tam={80} color={ACIDO} f={f} desde={k(49.6)} />}
            {/* HCl y el tornillo oxidado dentro del ácido */}
            <g transform="translate(1420,0)">
              <TextoW x={0} y={250} t="HCl" tam={120} color={ACIDO} f={f} desde={k(51.96)} />
              {f > k(52.4) && <g transform="translate(0,640)">
                <path d="M-170,-180 L-170,170 Q-170,200 -140,200 L140,200 Q170,200 170,170 L170,-180" fill="#dff4ff" fillOpacity={0.12} stroke="#dff4ff" strokeWidth={8} />
                <rect x={-162} y={-40} width={324} height={232} rx={20} fill={ACIDO} opacity={0.8} />
                {Array.from({ length: 12 }).map((_, i) => { const u = ((f * 0.04 + i * 0.13) % 1); return <circle key={i} cx={-130 + ((i * 47) % 260)} cy={180 - u * 220} r={5 + (i % 3) * 3} fill="none" stroke="#f4ffd0" strokeWidth={3} opacity={(1 - u) * limpio + 0.2} />; })}
                <g transform={`translate(0,${40 + baja}) rotate(-12)`}>
                  <rect x={-130} y={-22} width={220} height={44} rx={8} fill={interpolate(limpio, [0, 1], [0, 1]) > 0.5 ? "#d4dade" : "#a3572a"} />
                  {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-110 + i * 40} y={-22} width={10} height={44} fill={limpio > 0.5 ? "#9aa4ac" : "#6a3418"} />)}
                  <rect x={90} y={-46} width={60} height={92} rx={10} fill={limpio > 0.5 ? "#c9d0d6" : "#8a4420"} />
                  {limpio < 0.9 && Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={-110 + ((i * 41) % 210)} cy={-14 + ((i * 17) % 28)} r={8} fill="#c46a2a" opacity={1 - limpio} />)}
                  {limpio > 0.6 && <path d="M-100,-12 L60,-12" stroke="#fff" strokeWidth={6} opacity={limpio} strokeLinecap="round" />}
                </g>
                <TextoW x={0} y={-230} t={limpio > 0.5 ? "RUST: GONE" : "RUSTY STEEL"} tam={48} color={limpio > 0.5 ? "#f4efe4" : "#ff9a5a"} f={f} desde={k(52.6)} />
              </g>}
            </g>
          </>}
          hud={<FuenteB texto={FUENTE} desde={0} hasta={k(55.6)} />} />
      );
    };
    return <Pl />;
  },
};
// la escala de pH: 1,5 a 3,5
const PH = ["#d8222c", "#ee4a2a", "#f47a2a", "#f6a62a", "#f6d02a", "#d6e02a", "#9ad83a", "#4ac85a", "#2ab88a", "#2aa8b8", "#2a88d8", "#3a68d8", "#5a4ad0", "#7a3ac0", "#8a2aa8"];
export const r06c: PlanB = {
  a: 55.48, b: 59.92, trans: { tipo: "corte" },
  sfx: [[55.5, "whoosh"], [55.8, "unroll", -4], [56.6, "roll", -2, { dur: 1.2 }], [57.9, "slam", -2], [58.4, "ding", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const barra = tw(f, k(55.6), k(56.4));
      const aguja = interpolate(f, [k(56.6), k(57.9)], [7, 2.5], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
      const banda = tw(f, k(57.9), k(58.3));
      const X0 = 180, W = 1560 / 15;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#101820", luz: "#f6a62a" }} seed={6062} mano={1.2}
          claves={[mira(0, 960, 540, 1.0), mira(k(59.92), 960, 540, 1.04)]}
          medio={<>
            <TextoW x={960} y={230} t="pH SCALE" tam={64} color="#f4efe4" f={f} desde={k(55.5)} />
            <text x={X0} y={330} fontFamily={F_HUD} fontWeight={600} fontSize={46} fill="#ff6a5a" opacity={barra}>ACID</text>
            <text x={X0 + 15 * W} y={330} fontFamily={F_HUD} fontWeight={600} fontSize={46} fill="#9a7aff" textAnchor="end" opacity={barra}>BASE</text>
            {PH.map((c, i) => <g key={i} opacity={tw(f, k(55.6) + i, k(55.6) + i + 5)}><rect x={X0 + i * W} y={370} width={W - 6} height={150} rx={12} fill={c} /><text x={X0 + i * W + W / 2 - 3} y={600} fontFamily={F_HUD} fontWeight={600} fontSize={46} fill="#f4efe4" textAnchor="middle">{i}</text></g>)}
            {/* la banda del estómago */}
            <rect x={X0 + 1.5 * W - 3} y={350} width={2 * W} height={190} rx={16} fill="none" stroke="#ffffff" strokeWidth={10} opacity={banda} />
            {/* aguja */}
            {f > k(56.5) && <g transform={`translate(${X0 + aguja * W + W / 2 - 3},360)`}><path d="M-30,-60 L30,-60 L0,0 Z" fill="#fff" /></g>}
            {/* el estómago abajo, señalando su lugar en la escala */}
            <g opacity={tw(f, k(57.9), k(58.4))}>
              <Estomago x={X0 + 2.5 * W + 40} y={790} s={0.3} f={f} acido={0.5} cara="miedo" />
              <TextoW x={X0 + 4.6 * W} y={820} t="STOMACH: 1.5 – 3.5" tam={58} color={ACIDO} f={f} desde={k(58.0)} ancla="start" />
            </g>
            {/* referencias sin texto: agua en 7 */}
            <g transform={`translate(${X0 + 7 * W + W / 2},860)`} opacity={barra * (1 - banda)}><path d="M0,-80 C30,-30 46,0 46,24 A46,46 0 0,1 -46,24 C-46,0 -30,-30 0,-80 Z" fill="#7ac8ff" /><text y={110} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#9fdcff" textAnchor="middle">water</text></g>
          </>}
          hud={<FuenteB texto={FUENTE} desde={0} hasta={k(60)} />} />
      );
    };
    return <Pl />;
  },
};
// disuelve cosas: la comida se deshace en el ácido
export const r06c2: PlanB = {
  a: 59.92, b: 62.98, trans: { tipo: "corte" },
  sfx: [[60.0, "drop", -2], [60.4, "fire", -12, { dur: 2 }], [61.4, "popcluster", -8, { dur: 1.4 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const d = tw(f, k(60.3), k(62.6));
      const cae = interpolate(f, [k(59.95), k(60.4)], [-400, 0], { ...cl, easing: (t) => t * t });
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1a14", luz: ACIDO }} seed={6063} mano={1.5}
          claves={[mira(0, 960, 560, 1.0), mira(k(62.98), 960, 580, 1.1)]}
          medio={<>
            <Estomago x={940} y={620} s={1.0} f={f} acido={0.55} cara={f > k(60.6) ? "feliz" : "nada"} />
            {/* un bife que se disuelve */}
            <g transform={`translate(860,${700 + cae}) scale(${1 - d * 0.85}) rotate(${d * 40})`} opacity={1 - d * 0.6}>
              <path d="M-110,-30 C-100,-80 40,-90 100,-50 C140,-20 120,50 60,60 C-20,74 -120,40 -110,-30 Z" fill="#b8443a" stroke="#7a2a22" strokeWidth={8} />
              <path d="M-60,-20 C-20,-40 30,-30 60,-10" stroke="#f2c8b8" strokeWidth={12} fill="none" />
            </g>
            {d > 0 && Array.from({ length: 18 }).map((_, i) => { const u = ((f * 0.05 + i * 0.07) % 1); return <circle key={i} cx={800 + ((i * 37) % 160)} cy={700 - u * 160} r={6 + (i % 3) * 3} fill="#b8443a" opacity={(1 - u) * d} />; })}
            <TextoW x={960} y={180} t="IT DISSOLVES FOOD" tam={64} color={ACIDO} f={f} desde={k(60.3)} />
          </>}
          hud={<FuenteB texto={FUENTE} desde={0} hasta={k(63)} />} />
      );
    };
    return <Pl />;
  },
};
// ¿por qué no se digiere a sí mismo? → se protege
export const r06d: PlanB = {
  a: 62.98, b: 67.24, trans: { tipo: "corte" },
  sfx: [[63.0, "whoosh"], [63.4, "pop"], [65.0, "unroll", -4], [65.4, "sparkle", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const moco = tw(f, k(65.0), k(66.2));
      const pq = pop(f, k(63.3));
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1a14", luz: ACIDO }} seed={6064} mano={1.5}
          claves={[mira(0, 900, 560, 1.0), mira(k(65.0), 900, 560, 1.06, { curva: "inout" }), mira(k(67.24), 900, 560, 1.08)]}
          medio={<>
            <Estomago x={760} y={570} s={1.2} f={f} acido={0.5} moco={moco} cara={f < k(65.0) ? "duda" : "feliz"} />
            {f < k(65.0) && <g transform={`translate(1420,520) rotate(${Math.sin(f / 4) * 8}) scale(${0.4 + 0.6 * pq})`}><text fontFamily={F_HUD} fontWeight={600} fontSize={360} fill="#f4efe4" textAnchor="middle" y={120}>?</text></g>}
            {f >= k(65.0) && <>
              <TextoW x={1400} y={420} t={"IT PROTECTS\nITSELF"} tam={70} color="#8fd8ff" f={f} desde={k(65.0)} />
              <Flecha x1={1300} y1={560} x2={1040} y2={480} p={tw(f, k(65.4), k(66.0))} color="#8fd8ff" ancho={10} curva={0.2} />
            </>}
          </>}
          hud={<FuenteB texto={FUENTE} desde={0} hasta={k(67.3)} />} />
      );
    };
    return <Pl />;
  },
};
// corte de la pared: moco, células nuevas cada pocos días, dos revestimientos por semana
const DIAS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
export const r06e: PlanB = {
  a: 67.24, b: 76.4, trans: { tipo: "luz", d: 8, color: "#e9ffb0" },
  sfx: [[67.3, "whoosh_big", -4], [67.6, "drop", -6], [68.4, "drop", -6], [69.6, "pop", -4], [70.4, "sparkle", -6], [71.4, "pop", -4], [72.44, "unroll", -4], [72.9, "stamp", -2], [74.6, "stamp", -2], [75.0, "ding", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const moco = tw(f, k(67.3), k(68.6));
      const cambio = tw(f, k(69.6), k(71.6));
      const cal = tw(f, k(72.44), k(72.9));
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1a14", luz: ACIDO }} seed={6065} mano={1.2}
          claves={[mira(0, 960, 600, 1.25), mira(k(69.4), 960, 560, 1.06, { curva: "inout" }), mira(k(72.44), 960, 520, 1.0, { curva: "inout" }), mira(k(76.4), 960, 520, 1.02)]}
          medio={<>
            <CorteMuro f={f} moco={moco} cambio={cambio} />
            {/* rótulos sobre el diagrama, de a uno */}
            {f < k(69.6) && <TextoW x={1320} y={455} t="MUCUS SHIELD" tam={58} color="#0e3a5a" borde="#d6f2ff" f={f} desde={k(67.6)} />}
            {f >= k(69.6) && f < k(72.44) && <>
              <TextoW x={960} y={330} t="NEW CELLS EVERY FEW DAYS" tam={56} color="#2a4a08" borde="#f4ffd0" f={f} desde={k(69.7)} />
              <Flecha x1={960} y1={370} x2={960} y2={600} p={tw(f, k(70.0), k(70.6))} color="#2a4a08" ancho={9} />
            </>}
            {/* el calendario: un revestimiento nuevo el lunes y otro el jueves */}
            {f >= k(72.44) && <g transform={`translate(400,${190 - (1 - cal) * 60})`} opacity={cal}>
              <rect x={-30} y={-70} width={1180} height={200} rx={24} fill="#fbfcf4" stroke="#4a6a10" strokeWidth={6} />
              {DIAS.map((d, i) => {
                const marca = (i === 0 && f > k(72.9)) || (i === 3 && f > k(74.6));
                const p = i === 0 ? pop(f, k(72.9)) : pop(f, k(74.6));
                return <g key={d} transform={`translate(${30 + i * 160},0)`}>
                  <text x={50} y={-12} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#4a5a3a" textAnchor="middle">{d}</text>
                  <rect x={0} y={10} width={100} height={90} rx={14} fill={marca ? "#f2a0aa" : "#eef0e6"} stroke="#c9ccbc" strokeWidth={3} />
                  {marca && <g transform={`translate(50,55) scale(${p})`}><rect x={-34} y={-22} width={68} height={44} rx={12} fill="#f2a0aa" stroke="#b4566a" strokeWidth={4} /><text y={14} fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#7a1a2a" textAnchor="middle">NEW</text></g>}
                </g>;
              })}
            </g>}
            {f >= k(74.6) && <TextoW x={1640} y={540} t="×2" tam={110} color="#2a4a08" borde="#f4ffd0" f={f} desde={k(74.7)} />}
          </>}
          hud={<FuenteB texto={FUENTE} desde={0} hasta={k(76.5)} />} />
      );
    };
    return <Pl />;
  },
};
// el estómago de Owen no necesita protección
export const r06f: PlanB = {
  a: 76.4, b: 79.7, trans: { tipo: "corte" },
  sfx: [[76.4, "glitch", -4], [76.8, "metal", -2], [77.4, "metal_fall", -6], [78.0, "fire", -12, { dur: 1.4 }], [78.6, "metal", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const acero = tw(f, k(76.6), k(77.6));
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1a1608", luz: AMARILLO }} seed={6066} mano={1.5}
          claves={[mira(0, 920, 540, 1.08), mira(k(79.7), 920, 540, 1.12)]}
          detras={piso(900, "#141006")}
          medio={<>
            <Estomago x={620} y={470} s={0.85} f={f} acido={0.6} acero={acero} cara={acero > 0.5 ? "feliz" : "duda"} />
            {acero > 0.3 && Array.from({ length: 10 }).map((_, i) => { const u = ((f * 0.07 + i * 0.1) % 1); return <path key={i} d={`M${420 + ((i * 53) % 330)},${560 + ((i * 31) % 150)} l${12 - u * 30},${-20 - u * 40}`} stroke="#fff3a0" strokeWidth={5} opacity={(1 - u) * acero} strokeLinecap="round" />; })}
            <Persona look={OWEN} seed={47} escala={1.75} luz={{ lado: -1, color: "#ffe6a8", fuerza: 0.7 }} ruta={[{ f: 0, x: 1380, y: 900 }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: "parado" }, { f: k(77.4), v: { hD: 95, cD: 125, hI: 20, cI: 110, tronco: -4 } }]}
              caras={[{ f: 0, v: "duda" }, { f: k(77.4), v: "picaro" }]} miradas={[{ f: 0, v: { x: -1, y: 0.2 } }]} cartel={panza({ tam: 50, desde: k(77.6) })} />
            <TextoW x={620} y={880} t="NO SHIELD NEEDED" tam={60} color={AMARILLO} f={f} desde={k(77.0)} />
          </>}
          hud={<FuenteB texto={FUENTE} desde={0} hasta={k(79.8)} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== r07 · Tiny, el despachante, y el burrito del tamaño de un zapato ======================
const MESA = DES_PUNTOS.mesa;
const Zapatilla: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><path d="M-100,20 L-100,-30 Q-60,-50 -20,-40 L30,-10 Q90,-6 100,20 Z" fill="#f4f6f8" stroke="#2a2a30" strokeWidth={5} /><rect x={-104} y={14} width={208} height={18} rx={8} fill="#c23a2e" /><path d="M-60,-36 l20,20 M-40,-38 l20,20" stroke="#2a2a30" strokeWidth={4} /></g>
);
const tiny = (extra: Record<string, unknown>): any => ({ look: TINY, seed: 74, luz: RIM.tubo, dir: [{ f: 0, v: -1 }], ...extra });
const owenD = (extra: Record<string, unknown>): any => ({ look: OWEN, seed: 47, luz: RIM.tubo, dir: [{ f: 0, v: 1 }], ...extra });
export const r07: PlanB = {
  a: 79.7, b: 85.68, trans: { tipo: "barrido", d: 10 },
  sfx: [[79.8, "door", -6], [80.2, "step", -4], [80.8, "step", -4], [81.6, "paper", -2], [82.6, "pop", -4], [83.6, "whoosh"], [84.6, "gasp", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const pasa = tw(f, k(83.6), k(84.4));
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "alba" }} seed={607} mano={1.5}
          claves={[mira(0, MESA, 620, 1.7), mira(k(81.6), MESA + 60, 600, 2.1, { curva: "inout" }), mira(k(83.6), MESA - 20, 610, 2.0, { curva: "inout" }), mira(k(85.68), MESA - 20, 610, 2.05)]}
          medio={<>
            <Persona {...owenD({ ruta: [{ f: 0, x: MESA - 220, y: DES_PISO }],
              poses: [{ f: 0, v: "parado" }, { f: k(83.8), v: { hD: 80, cD: 30 } }, { f: k(84.6), v: { hD: 70, cD: 120 } }],
              caras: [{ f: 0, v: "neutral" }, { f: k(81.8), v: "sorpresa" }, { f: k(84.6), v: "picaro" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }, { f: k(81.8), v: { x: 1, y: 0.3 } }],
              enManoD: (ff: number) => ff > k(84.0) ? <g transform="rotate(-20)"><Burrito s={0.55} /></g> : null })} />
            <Persona {...tiny({ ruta: [{ f: 0, x: MESA + 420, y: DES_PISO }, { f: k(81.4), x: MESA + 150, y: DES_PISO }],
              poses: [{ f: 0, v: { hD: 60, cD: 60 } }, { f: k(81.6), v: { hD: 88, cD: 10 } }, { f: k(84.0), v: { hD: 20, cD: 40 } }, { f: k(84.6), v: "brazosCruzados" }],
              caras: [{ f: 0, v: "feliz" }, { f: k(81.6), v: "picaro" }, { f: k(84.6), v: "risa" }], habla: [[k(81.6), k(83.6)]],
              enManoD: (ff: number) => ff < k(84.0) ? <g transform="rotate(-10)"><Burrito s={0.55} /></g> : null })} />
            {/* «del tamaño de un zapato» */}
            {f > k(82.6) && f < k(84.0) && <g transform={`translate(${MESA + 30},${DES_PISO - 440}) scale(${pop(f, k(82.6))})`}>
              <rect x={-190} y={-70} width={380} height={140} rx={24} fill="#fbf8f1" stroke="#221c18" strokeWidth={4} />
              <g transform="translate(-100,0)"><Burrito s={0.6} /></g>
              <text x={6} y={22} fontFamily={F_HUD} fontWeight={600} fontSize={64} fill="#221c18" textAnchor="middle">=</text>
              <g transform="translate(110,0)"><Zapatilla s={0.6} /></g>
            </g>}
          </>}
          hud={<Txt t="TINY · DISPATCHER, 74TH ST GARAGE" a={k(80.0)} b={k(82.4)} f={f} left={110} top={150} tam={46} color={VERDE} chip />} />
      );
    };
    return <Pl />;
  },
};
// cuatro mordiscos; Tiny se ríe y se sienta
export const r07c: PlanB = {
  a: 85.68, b: 90.42, trans: { tipo: "corte" },
  sfx: [[85.7, "eat", 0], [86.2, "eat", 0], [86.7, "eat", 0], [87.15, "eat", 0], [87.3, "gasp", -6], [87.8, "punch", -12], [88.3, "chair", -2], [88.6, "punch", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const mord = Math.min(4, Math.floor(interpolate(f, [k(85.7), k(87.25)], [0, 4], cl)) + (f >= k(87.2) ? 1 : 0));
      const ancho = f >= k(87.26);
      const owenX = MESA - 220;
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "alba" }} seed={6071} mano={1.5}
          claves={ancho ? [mira(0, MESA, 640, 2.05), mira(k(90.42), MESA + 20, 630, 2.15)] : [mira(0, owenX + 40, DES_PISO - 260, 3.4), mira(k(87.2), owenX + 50, DES_PISO - 260, 3.6)]}
          medio={<>
            <g transform={`translate(${DES_PUNTOS.silla + 40},${DES_PISO})`}><rect x={-56} y={-70} width={112} height={14} rx={5} fill="#4a5560" /><rect x={36} y={-190} width={14} height={134} rx={5} fill="#4a5560" /><rect x={-50} y={-58} width={10} height={58} fill="#4a5560" /><rect x={40} y={-58} width={10} height={58} fill="#4a5560" /></g>
            <Persona {...owenD({ ruta: [{ f: 0, x: owenX, y: DES_PISO }],
              poses: [{ f: 0, v: { hD: 72, cD: 150 } }, ...[0, 1, 2, 3].flatMap((i) => [{ f: k(85.7) + i * 11.6 + 5, v: { hD: 60, cD: 110, cabeza: 6 } }, { f: k(85.7) + i * 11.6 + 10, v: { hD: 72, cD: 150 } }]), { f: k(87.4), v: { hD: 20, cD: 30, hI: 20, cI: 30 } }],
              caras: [{ f: 0, v: "determinado" }, { f: k(85.75), v: "risa" }, { f: k(87.4), v: "feliz" }], habla: [[k(85.7), k(87.3)]],
              enManoD: (ff: number) => ff < k(87.25) ? <g transform="rotate(-80)"><Burrito s={0.55} mordida={Math.min(0.95, mord / 4)} /></g> : null })} />
            {!ancho && <TextoW x={owenX + 150} y={DES_PISO - 330} t={`BITE ${Math.max(1, mord)}/4`} tam={26} color={AMARILLO} f={f} desde={k(85.75)} ancla="start" />}
            <Persona {...tiny({ ruta: [{ f: 0, x: MESA + 150, y: DES_PISO }, { f: k(87.9), x: MESA + 150, y: DES_PISO }, { f: k(88.4), x: DES_PUNTOS.silla + 40, y: DES_PISO }],
              asiento: [{ f: 0, v: undefined }, { f: k(88.2), v: undefined }, { f: k(88.4), v: 62 }],
              poses: [{ f: 0, v: "brazosCruzados" }, { f: k(87.3), v: { hD: 30, cD: 150, hI: 30, cI: 140, cabeza: -14, tronco: -8 } }, { f: k(88.4), v: { hD: 90, cD: 20, pI: 85, rI: -80, pD: 88, rD: -85, tronco: -6 } }],
              caras: [{ f: 0, v: "sorpresa" }, { f: k(87.3), v: "risa" }, { f: k(89.0), v: "picaro" }], habla: [[k(87.3), k(90.4)]] })} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// «$10 a que no te comés la caja entera» (donas de una semana)
export const r07b: PlanB = {
  a: 90.42, b: 94.76, trans: { tipo: "corte" },
  sfx: [[90.5, "slam", -4], [90.6, "coin", -2], [91.6, "paper", -4], [92.6, "pop", -4], [93.4, "wind", -16, { dur: 1.2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const billete = pop(f, k(90.5));
      const tapa = tw(f, k(91.6), k(92.2));
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "alba" }} seed={6072} mano={1.5}
          claves={[mira(0, MESA + 60, 640, 2.1), mira(k(92.6), MESA - 20, 660, 2.6, { curva: "inout" }), mira(k(94.76), MESA - 20, 660, 2.7)]}
          medio={<>
            <CajaDonas x={MESA - 30} y={DES_PISO - 210} n={6} caja={1} s={1.15} rot={0} />
            {tapa < 1 && <rect x={MESA - 30 - 120} y={DES_PISO - 290 + tapa * 0} width={240 * (1 - tapa)} height={70} rx={6} fill="#f2ead8" stroke="#c9b48a" strokeWidth={3} />}
            {/* el billete de $10 golpeado sobre la mesa */}
            {f > k(90.5) && <g transform={`translate(${MESA + 170},${DES_PISO - 222}) rotate(-6) scale(${billete})`}><rect x={-80} y={-34} width={160} height={68} rx={6} fill="#a8d88a" stroke="#3a6a2a" strokeWidth={4} /><circle r={22} fill="#7ab86a" /><text y={14} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#1a3a12" textAnchor="middle">$10</text></g>}
            {/* una semana de viejas: rayitas verdes */}
            {f > k(92.6) && [0, 1, 2].map((i) => <path key={i} d={`M${MESA - 90 + i * 60},${DES_PISO - 300} q12,-20 0,-40 q-12,-20 0,-40`} stroke="#8ac83a" strokeWidth={6} fill="none" opacity={0.5 + 0.4 * Math.sin(f / 5 + i)} />)}
            {f > k(92.6) && <g transform={`translate(${MESA + 190},${DES_PISO - 330}) rotate(4) scale(${pop(f, k(92.6))})`}><rect x={-150} y={-40} width={300} height={70} rx={12} fill="#fff3a0" stroke="#c9a83a" strokeWidth={4} /><text y={12} fontFamily={F_MANO} fontWeight={700} fontSize={44} fill="#5a3a12" textAnchor="middle">7 DAYS OLD</text></g>}
            <Persona {...owenD({ ruta: [{ f: 0, x: MESA - 260, y: DES_PISO }], poses: [{ f: 0, v: "parado" }, { f: k(92.6), v: { hD: 20, cD: 120, hI: 20, cI: 110 } }], caras: [{ f: 0, v: "duda" }, { f: k(92.0), v: "picaro" }], miradas: [{ f: 0, v: { x: 1, y: 0.4 } }] })} />
            <Persona {...tiny({ ruta: [{ f: 0, x: MESA + 300, y: DES_PISO }], poses: [{ f: 0, v: { hD: 60, cD: 20 } }, { f: k(90.6), v: { hD: 40, cD: 30 } }, { f: k(92.0), v: "señalar" }], caras: [{ f: 0, v: "picaro" }, { f: k(92.0), v: "risa" }], habla: [[k(90.5), k(92.4)]] })} />
            <GloboM x={MESA + 280} y={DES_PISO - 300} texto={"$10 says you can't eat\nthe whole box."} desde={k(90.6)} hasta={k(92.55)} tam={26} lado={-1} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// se come las donas… y la caja
export const r07d: PlanB = {
  a: 94.76, b: 97.3, trans: { tipo: "corte" },
  sfx: [[94.8, "eat", 0], [95.15, "eat", 0], [95.5, "eat", 0], [95.85, "eat", 0], [96.2, "eat", 0], [96.5, "paper", 0], [96.75, "eat", 2], [97.05, "paper", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const donas = 6 - Math.min(6, Math.floor(interpolate(f, [k(94.8), k(96.3)], [0, 6], cl)));
      const caja = interpolate(f, [k(96.5), k(97.2)], [1, 0.15], cl);
      const ox = MESA - 200;
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "alba" }} seed={6073} mano={2}
          claves={[mira(0, ox + 120, 620, 2.8), mira(k(97.3), ox + 100, 610, 3.0)]}
          medio={<>
            {f < k(96.4) && <CajaDonas x={MESA - 30} y={DES_PISO - 210} n={donas} caja={1} s={1.15} />}
            <Persona {...owenD({ ruta: [{ f: 0, x: ox, y: DES_PISO }],
              poses: Array.from({ length: 14 }).map((_, i) => ({ f: k(94.76) + i * 5.5, v: i % 2 ? { hD: 74, cD: 150, cabeza: 4 } : { hD: 58, cD: 30, cabeza: 14 } })),
              caras: [{ f: 0, v: "risa" }, { f: k(96.5), v: "determinado" }], habla: [[k(94.8), k(97.2)]],
              enManoD: (ff: number) => ff < k(96.4) ? <Dona s={0.38} /> : <g transform={`rotate(-20) scale(${caja})`}><rect x={-70} y={-40} width={140} height={80} rx={6} fill="#f2ead8" stroke="#c9b48a" strokeWidth={4} /><text y={12} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#c23a2e" textAnchor="middle">DONUTS</text></g> })} />
            <TextoW x={ox + 170} y={DES_PISO - 380} t={f < k(96.4) ? `${donas} LEFT` : "…AND THE BOX"} tam={30} color={AMARILLO} f={f} desde={k(94.8)} ancla="start" />
          </>} />
      );
    };
    return <Pl />;
  },
};
// Tiny deja de reírse
export const r07e: PlanB = {
  a: 97.3, b: 98.16, trans: { tipo: "corte" },
  sfx: [[97.3, "suspense", -8], [97.6, "punch", -14]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "alba" }} seed={6074} mano={1}
          claves={[mira(0, DES_PUNTOS.silla + 40, DES_PISO - 230, 3.6), mira(k(98.16), DES_PUNTOS.silla + 40, DES_PISO - 230, 3.9)]}
          medio={<>
            <g transform={`translate(${DES_PUNTOS.silla + 40},${DES_PISO})`}><rect x={-56} y={-70} width={112} height={14} rx={5} fill="#4a5560" /><rect x={36} y={-190} width={14} height={134} rx={5} fill="#4a5560" /></g>
            <Persona {...tiny({ ruta: [{ f: 0, x: DES_PUNTOS.silla + 40, y: DES_PISO }], asiento: [{ f: 0, v: 62 }],
              poses: [{ f: 0, v: { hD: 30, cD: 140, pI: 85, rI: -80, pD: 88, rD: -85, tronco: -4 } }, { f: k(97.6), v: { hD: 10, cD: 30, hI: 10, cI: 30, pI: 85, rI: -80, pD: 88, rD: -85, tronco: 4 } }],
              caras: [{ f: 0, v: "risa" }, { f: k(97.55), v: "neutral" }, { f: k(97.85), v: "miedo" }], miradas: [{ f: 0, v: { x: -1, y: 0.2 } }] })} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r08 · re-gancho: el bus frena en la parada 30 (el abrigo gris espera) ======================
export const r08: PlanB = {
  a: 98.16, b: 104.46, trans: { tipo: "fundido", d: 10 },
  sfx: [[98.2, "riser", -4, { dur: 5.6 }], [98.3, "bus_engine", -8, { dur: 3 }], [100.4, "bus_brake", -2], [101.2, "door", -8], [102.4, "wind", -14, { dur: 2 }], [103.6, "heart1", -2]],
  el: (k) => {
    const PARADA = 1900;
    const parar = k(100.6);
    const bx = (f: number) => interpolate(f, [0, parar], [-1600, PARADA - 1000], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 2.2) });
    const Pl: React.FC = () => {
      const f = useF();
      const cab = f > parar ? -2.2 * Math.exp(-(f - parar) / 7) * Math.cos((f - parar) / 2.4) : 0;
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1500, paradas: [{ x: PARADA, num: 30, refugio: true }] }} seed={609} mano={1.5}
          claves={[mira(0, 1250, 880, 1.05), mira(parar, 1500, 880, 1.12, { curva: "out" }), mira(k(102.2), PARADA + 150, 720, 1.8, { curva: "inout" }), mira(k(104.46), PARADA + 170, 730, 2.0)]}
          medio={<>
            <Persona look={ABRIGO} seed={9} luz={RIM.sol} ruta={[{ f: 0, x: PARADA + 220, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }, { f: k(102.4), v: { hD: 10, cD: 20, hI: 10, cI: 20, cabeza: -6 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(102.4), v: "cansado" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(102.6), v: { x: -0.4, y: -0.1 } }]} />
            <g transform={`rotate(${cab},${bx(f) + 900},${ASH_CARRIL})`}><Bus9 x={bx(f)} y={ASH_CARRIL} hora="manana" rueda={bx(f) * 0.7} dir={1} gente={0.6} puertas={tw(f, k(101.0), k(101.6))} /></g>
            
          </>} />
      );
    };
    return <Pl />;
  },
};
