// ob06 · escenas 1-5 (recap, ANYTHING, despertar, espejo, semana 6, el pozole)
import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Escena } from "../anikit/escena";
import { PAL, OWEN, OWEN_CASA, RIM, VERDE } from "../owen/elenco";
import { CartelM, ROJO } from "../owen/cartel";
import { Persona } from "../owen/b/gente";
import { PlanB, Pizarra, POSE_CELU_SENTADO } from "../owen/b/lib";
import { BusInterior, Volante } from "../owen/mundo/bus";
import { TwoFlatCorte, TF_PISO, TF_ARRIBA, TF_PUNTOS } from "../owen/mundo/twoflat";
import { Halden, HAL_PISO } from "../owen/mundo/halden";
import { Celular } from "../anikit/props";
import { AMARILLO, ch, BP, cl, panza, owenVolante, CeluGrande, Nota, F_HUD, F_MANO } from "./comun6";
import { BañoEspejo, Reflejo6, ESP, TextoW, Pizza, Taco, Dona, Burrito, Tortilla, Frasco, Cebolla, Charco, Halo, pop, tw } from "./kit6";

const A = TF_ARRIBA, P = TF_PISO;

// ====================== r01 · recap: no come hace un día y medio → «We can help with that.» ======================
export const r01: PlanB = {
  a: 0, b: 6.48,
  sfx: [[0.1, "whoosh"], [0.3, "bus_engine", -16, { dur: 6 }], [1.0, "paper", -6], [1.6, "heart", -12, { dur: 2.4 }], [2.4, "cloth", -6], [3.2, "cloth", -8], [4.2, "phone_buzz", 0], [4.6, "cloth", -8], [5.3, "glitch", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const sandw = (ff: number) => ff < k(2.5) ? <g transform="rotate(-10)"><rect x={-46} y={-26} width={92} height={52} rx={10} fill="#e9c27a" stroke="#a8803a" strokeWidth={3} /><rect x={-46} y={-8} width={92} height={14} fill="#7ab04a" /><rect x={-50} y={-30} width={100} height={60} rx={12} fill="#dfe6ea" opacity={0.45} /></g> : null;
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "tarde", avance: () => 0 }} seed={601} mano={1.5}
          claves={[mira(0, ch + 80, 620, 2.4), mira(k(2.4), ch + 60, 640, 2.8, { curva: "inout" }), mira(k(4.2), ch + 240, 640, 2.5, { curva: "inout" }), mira(k(6.48), ch + 250, 640, 2.6)]}
          medio={<><Persona {...owenVolante({
            ajuste: undefined,
            caras: [{ f: 0, v: "triste" }, { f: k(1.6), v: "asco" }, { f: k(3.0), v: "cansado" }, { f: k(4.25), v: "sorpresa" }, { f: k(5.4), v: "duda" }],
            miradas: [{ f: 0, v: { x: 0.3, y: 0.3 } }, { f: k(1.2), v: { x: 0.6, y: 0.2 } }, { f: k(3.0), v: { x: 0, y: 0.6 } }, { f: k(4.3), v: { x: 0.7, y: 0.3 } }],
            poses: [{ f: 0, v: { hD: 40, cD: 110, hI: 10, cI: 60, cabeza: 4 } }, { f: k(1.1), v: { hD: 62, cD: 140, hI: 10, cI: 60, cabeza: -6 } }, { f: k(2.0), v: { hD: 30, cD: 20, hI: 10, cI: 60, cabeza: 10 } }, { f: k(3.0), v: { hD: 14, cD: 90, hI: 14, cI: 90, cabeza: 18, tronco: 8 } }, { f: k(4.3), v: { ...POSE_CELU_SENTADO, cabeza: 10 } }],
            enManoD: (ff) => ff < k(2.5) ? sandw(ff) : ff > k(4.25) ? <Celular s={1.1} /> : null,
            cartel: f < k(4.2) ? { claves: 0, icono: "panza", texto: "NO FOOD · 1½ DAYS", tam: 30, color: "#ff8a5a", desde: k(0.5), hasta: k(4.2) } : undefined,
          })} /><Volante /></>}
          hud={<CeluGrande x={1150} y={120} desde={k(4.2)} f={f} vibra={k(4.2)} escribe={k(4.4)} vel={2.2} de="HALDEN CLINIC · DR. HALE" lineas={["We noticed you", "haven't been eating.", "We can help", "with that."]} hora="5:12" />} />
      );
    };
    return <Pl />;
  },
};

// ====================== r02 · el cartel nuevo: ANYTHING (Owen lo recibe) ======================
const CAEN: { x: number; t: number; el: (s: number) => React.ReactNode; r: number }[] = [
  { x: 470, t: 9.0, el: (s) => <Pizza s={s} />, r: 40 },
  { x: 1460, t: 9.1, el: (s) => <Taco s={s} />, r: -30 },
  { x: 640, t: 9.25, el: (s) => <Dona s={s} />, r: 80 },
  { x: 1300, t: 9.35, el: (s) => <Burrito s={s * 0.8} />, r: -60 },
  { x: 360, t: 9.5, el: (s) => <Dona s={s} color="#7ab8ff" />, r: 20 },
  { x: 1580, t: 9.55, el: (s) => <Pizza s={s} />, r: -50 },
  { x: 760, t: 9.7, el: (s) => <Taco s={s} />, r: 60 },
  { x: 1180, t: 9.8, el: (s) => <Dona s={s} color="#ffd84a" />, r: -20 },
];
export const r02: PlanB = {
  a: 6.48, b: 10.42, trans: { tipo: "luz", d: 8, color: "#fff3d0" },
  sfx: [[6.5, "whoosh_big", -2], [7.3, "slam", -2], [7.6, "gasp", -8], [8.2, "cloth", -6], [9.0, "boom", -6], [9.15, "pop", -4], [9.4, "pop", -4], [9.6, "pop", -4], [9.85, "pop", -4], [10.0, "plates", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#2a1e0a", luz: AMARILLO }} seed={602} mano={1.5}
          claves={[mira(0, 960, 540, 1.3), mira(k(7.3), 960, 520, 1.38, { resorte: { damping: 12, stiffness: 120 } }), mira(k(9.0), 960, 540, 1.22, { curva: "out" }), mira(k(10.42), 960, 540, 1.28)]}
          detras={<><rect x={-2000} y={900} width={6000} height={800} fill="#1a1206" /><Charco x={960} y={905} rx={560} color={AMARILLO} fuerza={0.55} /><Halo x={960} y={520} r={700} color={AMARILLO} fuerza={0.25} /></>}
          medio={<>
            <Persona look={OWEN} seed={47} escala={1.9} luz={{ lado: -1, color: "#ffe6a8", fuerza: 0.7 }} ruta={[{ f: 0, x: 960, y: 900 }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: "parado" }, { f: k(7.3), v: { hD: 30, cD: 60, hI: 30, cI: 60, cabeza: -14 } }, { f: k(8.1), v: { hD: 12, cD: 100, hI: 12, cI: 100, cabeza: 4 } }, { f: k(8.5), v: { hD: 18, cD: 80, hI: 12, cI: 100, cabeza: 4 } }, { f: k(8.9), v: { hD: 12, cD: 100, hI: 12, cI: 100 } }, { f: k(9.1), v: { hD: 118, cD: 8, hI: 104, cI: 12, cabeza: -12, tronco: -4 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(7.35), v: "sorpresa" }, { f: k(8.1), v: "picaro" }, { f: k(9.1), v: "risa" }]}
              miradas={[{ f: 0, v: { x: 0, y: 0 } }, { f: k(7.4), v: { x: 0, y: -1 } }, { f: k(8.1), v: { x: 0.2, y: 0.2 } }, { f: k(9.1), v: { x: 0, y: -0.6 } }]}
              cartel={panza({ tam: 64, desde: k(7.3) })} />
            {CAEN.map((c, i) => {
              const t0 = k(c.t);
              if (f < t0) return null;
              const s = spring({ frame: f - t0, fps: 30, config: { damping: 9, stiffness: 90 } });
              const y = -300 + s * (900 - 60 + 300);
              return <g key={i} transform={`translate(${c.x},${y}) rotate(${c.r * (1 - s)})`}>{c.el(1.1)}</g>;
            })}
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r03 · lunes 5:12 se despierta de golpe ======================
const owenCama = (k: (s: number) => number, extra: Record<string, unknown> = {}) => ({
  look: OWEN_CASA, seed: 47, luz: RIM.alba, ruta: [{ f: 0, x: TF_PUNTOS.cama + 60, y: A }], dir: [{ f: 0, v: 1 as const }], asiento: [{ f: 0, v: 70 }],
  ...extra,
});
export const r03: PlanB = {
  a: 10.42, b: 13.78, trans: { tipo: "fundido", d: 10 },
  sfx: [[10.5, "beep", -6], [11.0, "beep", -6], [11.6, "cloth", 0], [11.7, "gasp", -4], [12.6, "punch", -14], [13.1, "beep", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = TF_PUNTOS.cama;
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={603} mano={1.5}
          claves={[mira(0, x + 150, A - 130, 2.6), mira(k(11.6), x + 120, A - 150, 3.0, { resorte: { damping: 14, stiffness: 140 } }), mira(k(13.78), x + 130, A - 150, 3.1)]}
          medio={<>
            {/* el despertador GRANDE en la mesita: 5:12 que parpadea */}
            <g transform={`translate(${x + 300},${A - 112})`}>
              <rect x={-58} y={-58} width={116} height={64} rx={12} fill="#1d1f24" stroke="#3a3e46" strokeWidth={4} />
              <text y={-12} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#ff4a3d" textAnchor="middle" opacity={Math.floor(f / 8) % 2 ? 1 : 0.55}>5:12</text>
              {f < k(11.5) && [0, 1].map((i) => <path key={i} d={`M${-70 - i * 14},-60 q-10,20 0,40 M${70 + i * 14},-60 q10,20 0,40`} stroke="#ffe27a" strokeWidth={4} fill="none" opacity={Math.floor(f / 4) % 2} />)}
            </g>
            <Persona {...owenCama(k, {
              poses: [{ f: 0, v: { tronco: -62, hD: 10, cD: 10, hI: 10, cI: 10, pI: 85, rI: -80, pD: 88, rD: -85, cabeza: -10 } }, { f: k(11.5), v: { tronco: 4, hD: 30, cD: 40, hI: 30, cI: 40, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(12.5), v: { tronco: 12, hD: 16, cD: 110, hI: 16, cI: 110, pI: 85, rI: -80, pD: 88, rD: -85, cabeza: 10 } }],
              caras: [{ f: 0, v: "cansado" }, { f: k(11.55), v: "sorpresa" }, { f: k(12.5), v: "miedo" }],
              miradas: [{ f: 0, v: { x: 0, y: 0 } }, { f: k(11.8), v: { x: 1, y: 0.3 } }, { f: k(12.5), v: { x: 0, y: 1 } }],
            })} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// la panza que ruge en primer plano
export const r03c: PlanB = {
  a: 13.78, b: 17.04, trans: { tipo: "corte" },
  sfx: [[13.8, "punch", -6], [13.85, "drone", -8, { dur: 1.4 }], [14.6, "punch", -8], [15.4, "punch", -6], [15.5, "gasp", -6], [16.2, "cloth", -4], [16.5, "step", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = TF_PUNTOS.cama + 60;
      const ondas = [k(13.8), k(14.6), k(15.4)];
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={6031} mano={2}
          claves={[mira(0, x + 20, A - 120, 3.6), mira(k(15.3), x + 30, A - 150, 3.2, { curva: "inout" }), mira(k(17.04), x + 40, A - 160, 3.0)]}
          medio={<>
            <Persona {...owenCama(k, {
              ajuste: (p: any, ff: number) => ({ ...p, tronco: p.tronco + Math.sin(ff * 1.7) * (ff < k(15.9) ? 2.5 : 0) }),
              poses: [{ f: 0, v: { tronco: 22, hD: 6, cD: 120, hI: 6, cI: 120, pI: 85, rI: -80, pD: 88, rD: -85, cabeza: 18 } }, { f: k(15.4), v: { tronco: 4, hD: 10, cD: 110, hI: 40, cI: 30, pI: 85, rI: -80, pD: 88, rD: -85, cabeza: -6 } }],
              caras: [{ f: 0, v: "miedo" }, { f: k(15.4), v: "determinado" }],
              miradas: [{ f: 0, v: { x: 0, y: 1 } }, { f: k(15.4), v: { x: 0.4, y: -0.2 } }],
              habla: [[k(15.5), k(16.6)]],
            })} />
            {ondas.map((o, i) => {
              if (f < o) return null;
              const t = (f - o) / 18;
              return [0, 1, 2].map((j) => { const u = t - j * 0.25; if (u < 0 || u > 1) return null; return <ellipse key={`${i}${j}`} cx={x + 18} cy={A - 112} rx={30 + u * 120} ry={22 + u * 80} fill="none" stroke="#ff8a3a" strokeWidth={5 * (1 - u)} opacity={1 - u} />; });
            })}
            {["G", "R", "R", "R"].map((l, i) => <TextoW key={i} x={x + 120 + i * 26} y={A - 160 + Math.sin(f / 2 + i) * 4} t={l} tam={44 - i * 3} color="#ff8a3a" f={f} desde={k(13.85) + i * 3} mano rot={-8 + i * 6} />)}
            <TextoW x={x - 120} y={A - 230} t={"STARVING."} tam={40} color={AMARILLO} f={f} desde={k(15.4)} mano rot={-4} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r03b · el espejo: el cartel de la panza dice una sola palabra ======================
export const r03b: PlanB = {
  a: 17.04, b: 25.22, trans: { tipo: "corte" },
  sfx: [[17.1, "water", -8, { dur: 1.5 }], [18.3, "cloth", -8], [19.4, "glitch", -4], [20.2, "pop", 0], [20.4, "gasp", -6], [21.4, "glitch", -8], [22.4, "whoosh"], [24.16, "slam", -2], [24.4, "sparkle", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const g = f >= k(19.4) && f < k(24.16) ? Math.floor(f / 3) % 3 : -1;
      const txt = f < k(24.16) ? ["8?", "??", "#!"][Math.max(0, g)] : "ANYTHING";
      const esc = 3.3, piso = 1340;
      return (
        <Escena Set={BañoEspejo} pal={PAL} setProps={{}} seed={604} mano={1.5}
          claves={[mira(0, 960, 560, 1.0), mira(k(20.2), 960, 520, 1.06, { curva: "inout" }), mira(k(22.4), 960, 470, 1.18, { curva: "inout" }), mira(k(24.16), 960, 480, 1.12, { resorte: { damping: 12, stiffness: 140 } })]}
          medio={<Reflejo6 f={f}>
            <Persona look={{ ...OWEN_CASA, frontal: true }} seed={47} escala={esc} luz={{ lado: -1, color: "#fff2d8", fuerza: 0.7 }} ruta={[{ f: 0, x: 960, y: piso }]}
              poses={[{ f: 0, v: "manosCara" }, { f: k(18.2), v: { hD: 10, cD: 20, hI: 10, cI: 20 } }, { f: k(20.2), v: { hD: 20, cD: 40, hI: 20, cI: 40, cabeza: -10 } }, { f: k(22.4), v: { hD: 12, cD: 110, hI: 12, cI: 110, cabeza: -4 } }, { f: k(24.2), v: { hD: 12, cD: 110, hI: 40, cI: 150, cabeza: 6 } }]}
              caras={[{ f: 0, v: "cansado" }, { f: k(18.2), v: "neutral" }, { f: k(20.2), v: "sorpresa" }, { f: k(22.4), v: "duda" }, { f: k(24.2), v: "picaro" }]}
              miradas={[{ f: 0, v: { x: 0, y: 0.5 } }, { f: k(18.4), v: { x: 0, y: 0 } }, { f: k(20.3), v: { x: 0, y: -1 } }, { f: k(22.4), v: { x: 0.2, y: 0 } }, { f: k(24.2), v: { x: 0, y: -0.8 } }]}
              cartel={{ claves: 0, icono: "panza", texto: txt, color: f < k(24.16) ? "#ff8a5a" : AMARILLO, tam: 58, desde: k(20.2) }} />
            {f < 0 && Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={860 + ((i * 37) % 200)} cy={420 + ((f * 7 + i * 23) % 220)} r={9} fill="#e6f8ff" opacity={0.9} />)}
          </Reflejo6>}
          hud={<></>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r04 · semana 6 · participante 47 · quedan 42 (pizarra de la clínica) ======================
const FUERA = [3, 9, 12, 21, 33];
export const r04: PlanB = {
  a: 25.22, b: 30.02, trans: { tipo: "luz", d: 8, color: "#d8fff2" },
  sfx: [[25.25, "paper", -2], [25.5, "paper", -4], [25.75, "paper", -4], [26.0, "slam", -4], [27.28, "ding", -4], [27.5, "pop"], [28.62, "slam", -2], [28.8, "stamp", -4], [29.2, "heart1", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const semana = Math.min(6, 1 + Math.floor(interpolate(f, [0, k(26.0)], [0, 5.99], cl)));
      const flip = f < k(26.0) ? (f % 7) / 7 : 1;
      const bx = 900, by = 270; // tablero
      const quedan = Math.round(interpolate(f, [k(28.62), k(29.4)], [47, 42], cl));
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "manana" }} seed={6040} mano={1.5}
          claves={[mira(0, 1170, 590, 1.18), mira(k(27.28), 1230, 580, 1.24, { curva: "inout" }), mira(k(28.62), 1190, 590, 1.2, { curva: "inout" }), mira(k(30.02), 1190, 590, 1.22)]}
          medio={<>
            {/* tablero blanco de la clínica */}
            <g transform={`translate(${bx},${by})`}>
              <rect x={-14} y={-14} width={1028} height={608} rx={18} fill="#c9d2d8" />
              <rect x={0} y={0} width={1000} height={580} rx={12} fill="#fbfcfd" />
              {/* calendario que pasa páginas */}
              <g transform="translate(40,40)">
                <rect x={0} y={0} width={260} height={230} rx={10} fill="#ffffff" stroke="#c9d2d8" strokeWidth={4} />
                <rect x={0} y={0} width={260} height={56} rx={10} fill="#2a6fd6" />
                <text x={130} y={42} fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#fff" textAnchor="middle">WEEK</text>
                <text x={130} y={190} fontFamily={F_HUD} fontWeight={600} fontSize={130} fill="#1a2a3a" textAnchor="middle">{semana}</text>
                {flip < 1 && <path d={`M0,56 H260 V${56 + 174 * (1 - flip)} H0 Z`} fill="#eef3f8" stroke="#c9d2d8" strokeWidth={3} />}
              </g>
              {/* 47 participantes: 5 tachados, el 47 resaltado */}
              <g transform="translate(360,70)">
                {Array.from({ length: 47 }).map((_, i) => {
                  const n = i + 1, cx = (i % 12) * 52, cy = Math.floor(i / 12) * 84;
                  const t = tw(f, i * 0.5, i * 0.5 + 8);
                  const fuera = FUERA.includes(n) && f > k(28.62);
                  const yo = n === 47 && f > k(27.28);
                  const c = fuera ? "#b9c0c6" : yo ? "#2fd16a" : "#3a4a5a";
                  return <g key={i} transform={`translate(${cx},${cy}) scale(${t * (yo ? 1 + 0.25 * pop(f, k(27.28)) : 1)})`}>
                    <circle cy={-30} r={13} fill={c} /><path d="M-19,20 Q-19,-14 0,-14 Q19,-14 19,20 Z" fill={c} />
                    {fuera && <path d="M-20,-46 L20,20 M20,-46 L-20,20" stroke={ROJO} strokeWidth={6} strokeLinecap="round" opacity={tw(f, k(28.62) + FUERA.indexOf(n) * 3, k(28.62) + FUERA.indexOf(n) * 3 + 4)} />}
                  </g>;
                })}
                {f > k(27.28) && <g transform={`translate(${(46 % 12) * 52},${Math.floor(46 / 12) * 84})`}><circle cy={-6} r={44} fill="none" stroke="#2fd16a" strokeWidth={6} opacity={0.6 + 0.4 * Math.sin(f / 4)} /><text x={70} y={2} fontFamily={F_HUD} fontWeight={600} fontSize={48} fill="#2fd16a">#47</text></g>}
              </g>
              {/* contador de los que siguen */}
              {f > k(28.62) && <g transform="translate(40,500)">
                <text x={0} y={0} fontFamily={F_HUD} fontWeight={600} fontSize={110} fill={ROJO}>{quedan}</text>
                <text x={150} y={-18} fontFamily={F_HUD} fontWeight={600} fontSize={52} fill="#1a2a3a">STILL IN</text>
              </g>}
            </g>
            <Persona look={OWEN} seed={47} escala={1.5} luz={RIM.tubo} ruta={[{ f: 0, x: 700, y: HAL_PISO }, { f: k(26.4), x: 760, y: HAL_PISO }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: "parado" }, { f: k(26.6), v: "manosCintura" }, { f: k(27.3), v: "señalar" }, { f: k(28.7), v: { hD: 10, cD: 90, hI: 10, cI: 90 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(27.3), v: "feliz" }, { f: k(28.7), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }]} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r05 · el pozole de Rosa (4 planos) ======================
const COC = TF_PUNTOS.cocina; // 260: la cocina a gas va de 100 a 300
const owenCocina = (extra: Record<string, unknown>): any => ({ look: OWEN_CASA, seed: 47, luz: RIM.cocina, dir: [{ f: 0, v: -1 as const }], ...extra });
const OllaG: React.FC<{ x: number; y: number; nivel: number; f: number; tapa?: number; s?: number }> = ({ x, y, nivel, f, tapa = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-80} y={-100} width={160} height={100} rx={16} fill="#c23a2e" stroke="#8a2a22" strokeWidth={4} />
    <rect x={-96} y={-80} width={18} height={14} rx={5} fill="#8a2a22" /><rect x={78} y={-80} width={18} height={14} rx={5} fill="#8a2a22" />
    {[0, 1, 2].map((i) => <circle key={i} cx={-40 + i * 40} cy={-46} r={8} fill="#f4efe4" opacity={0.85} />)}
    <ellipse cy={-96 + 80 * (1 - nivel)} rx={72} ry={12} fill="#d98a3a" opacity={nivel > 0.02 ? 1 : 0} />
    {nivel > 0.02 && [0, 1, 2].map((i) => <circle key={i} cx={-30 + i * 28} cy={-96 + 80 * (1 - nivel)} r={7} fill="#f2e6c8" />)}
    <g transform={`translate(${tapa * 60},${-104 - tapa * 70}) rotate(${tapa * 25})`}><ellipse rx={88} ry={14} fill="#a8302a" /><rect x={-14} y={-24} width={28} height={14} rx={6} fill="#5a1a14" /></g>
    {tapa > 0.3 && nivel > 0.3 && [0, 1, 2].map((i) => <path key={i} d={`M${-30 + i * 30},-120 q14,-20 0,-40 q-14,-20 0,-40`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.25 + 0.2 * Math.sin(f / 5 + i)} />)}
  </g>
);
export const r05: PlanB = {
  a: 30.02, b: 35.42, trans: { tipo: "fundido", d: 8 },
  sfx: [[30.1, "step", -4], [30.6, "step", -4], [31.2, "step", -6], [32.0, "paper", -4], [33.1, "write", -6], [34.0, "metal", -2], [34.4, "pour", -12, { dur: 1 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const tapa = tw(f, k(34.0), k(34.5));
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba" }} seed={605} mano={1.5}
          claves={[mira(0, 430, 650, 2.0), mira(k(32.0), 300, 610, 2.7, { curva: "inout" }), mira(k(33.9), 330, 640, 2.4, { curva: "inout" }), mira(k(35.42), 330, 640, 2.45)]}
          medio={<>
            <OllaG x={COC - 60} y={P - 270} nivel={1} f={f} tapa={tapa} />
            <Nota x={COC - 60} y={P - 318} t={"for 4 days ♥\n— R."} s={0.42} rot={-5} />
            <Persona {...owenCocina({ ruta: [{ f: 0, x: 760, y: P }, { f: k(32.0), x: COC + 140, y: P }],
              poses: [{ f: 0, v: {} }, { f: k(32.0), v: { hD: 30, cD: 60, cabeza: 14 } }, { f: k(33.9), v: { hD: 60, cD: 40, cabeza: 6 } }, { f: k(34.6), v: { hD: 80, cD: 40, hI: 20, cI: 90, cabeza: -4 } }],
              caras: [{ f: 0, v: "cansado" }, { f: k(32.0), v: "duda" }, { f: k(33.1), v: "triste" }, { f: k(34.5), v: "feliz" }],
              miradas: [{ f: 0, v: { x: -1, y: 0.2 } }, { f: k(32.0), v: { x: -1, y: -0.2 } }, { f: k(34.5), v: { x: -1, y: 0.4 } }] })} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// se lo come todo, parado, frío, 5:20 de la mañana: cucharón de la olla a la boca
export const r05b: PlanB = {
  a: 35.42, b: 38.34, trans: { tipo: "corte" },
  sfx: [[35.45, "metal", -6], [35.7, "eat", -2], [36.2, "metal", -10], [36.4, "eat", -2], [36.9, "metal", -10], [37.1, "eat", -2], [37.6, "metal", -10], [37.8, "eat", -2], [38.1, "metal", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const nivel = interpolate(f, [k(35.5), k(38.0)], [1, 0], cl);
      const dias = Math.ceil(nivel * 4 - 0.01);
      const x = COC + 120;
      const ciclo = (ff: number) => (((ff - k(35.4)) % 20) + 20) % 20 / 20;
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba" }} seed={6051} mano={2}
          claves={[mira(0, x - 60, 640, 2.7), mira(k(38.34), x - 50, 640, 2.85)]}
          medio={<>
            <OllaG x={COC - 60} y={P - 270} nivel={nivel} f={f} tapa={1} />
            <Persona {...owenCocina({ ruta: [{ f: 0, x, y: P }],
              poses: Array.from({ length: 10 }).map((_, i) => ({ f: k(35.4) + i * 10, v: i % 2 ? { hD: 76, cD: 150, hI: 10, cI: 100, cabeza: 6, tronco: 2 } : { hD: 62, cD: 20, hI: 10, cI: 100, cabeza: 16, tronco: 10 } })),
              caras: [{ f: 0, v: "determinado" }, { f: k(35.7), v: "risa" }],
              habla: [[k(35.7), k(38.1)]],
              enManoD: (ff: number) => <g transform="rotate(20)"><rect x={-5} y={-60} width={10} height={80} rx={4} fill="#c9ced2" /><ellipse cy={-62} rx={20} ry={12} fill={ciclo(ff) > 0.4 && ciclo(ff) < 0.8 ? "#d98a3a" : "#c9ced2"} stroke="#9aa0a6" strokeWidth={3} /></g> })} />
            <g transform={`translate(${x + 70},${P - 350})`}>
              <text x={0} y={0} fontFamily={F_HUD} fontWeight={600} fontSize={26} fill="#2a2420" stroke="#fff3d6" strokeWidth={5} paintOrder="stroke">DAYS LEFT</text>
              {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${i * 40 + 16},34)`}><rect x={-16} y={-16} width={32} height={32} rx={7} fill={i < dias ? "#c23a2e" : "#e8e0d0"} stroke="#8a2a22" strokeWidth={2} />{i >= dias && <path d="M-13,-13 L13,13 M13,-13 L-13,13" stroke={ROJO} strokeWidth={5} />}</g>)}
            </g>
          </>} />
      );
    };
    return <Pl />;
  },
};
// seis tortillas, un frasco de jalapeños
export const r05c: PlanB = {
  a: 38.34, b: 42.78, trans: { tipo: "corte" },
  sfx: [[38.5, "paper", -4], [38.9, "eat", -4], [39.3, "paper", -6], [39.6, "eat", -4], [40.0, "eat", -4], [40.4, "eat", -4], [40.7, "glass", -2], [41.0, "eat", -2], [41.4, "eat", -2], [41.8, "eat", -2], [42.2, "glass", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const tort = 6 - Math.floor(interpolate(f, [k(38.5), k(40.5)], [0, 6], cl));
      const jal = interpolate(f, [k(40.7), k(42.5)], [1, 0], cl);
      const x = 470;
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba" }} seed={6052} mano={1.5}
          claves={[mira(0, x + 120, 660, 2.6), mira(k(40.6), x + 160, 660, 2.8, { curva: "inout" }), mira(k(42.78), x + 150, 650, 2.85)]}
          medio={<>
            <rect x={x + 90} y={P - 250} width={330} height={250} fill="#a8754a" /><rect x={x + 80} y={P - 262} width={350} height={20} rx={4} fill="#d9b48a" />
            <g transform={`translate(${x + 190},${P - 268})`}>{Array.from({ length: Math.max(0, tort) }).map((_, i) => <g key={i} transform={`translate(0,${-i * 12})`}><Tortilla s={0.9} /></g>)}</g>
            <g transform={`translate(${x + 340},${P - 262})`}><Frasco s={0.85} nivel={jal} /></g>
            <TextoW x={x + 255} y={P - 150} t={`${Math.max(0, tort)} TORTILLAS`} tam={36} color="#fff3d6" f={f} desde={k(38.4)} />
            <Persona {...owenCocina({ ruta: [{ f: 0, x, y: P }], dir: [{ f: 0, v: 1 as const }],
              poses: [{ f: 0, v: { hD: 40, cD: 90, cabeza: 10 } }, ...Array.from({ length: 8 }).map((_, i) => ({ f: k(38.6) + i * 9, v: i % 2 ? { hD: 74, cD: 150, cabeza: 6 } : { hD: 46, cD: 60, cabeza: 14 } })), { f: k(40.7), v: { hD: 40, cD: 70, hI: 40, cI: 80, cabeza: 12 } }, ...Array.from({ length: 4 }).map((_, i) => ({ f: k(41.0) + i * 9, v: i % 2 ? { hD: 74, cD: 150, hI: 40, cI: 80 } : { hD: 40, cD: 70, hI: 40, cI: 80 } }))],
              caras: [{ f: 0, v: "determinado" }, { f: k(38.8), v: "risa" }, { f: k(40.8), v: "feliz" }],
              habla: [[k(38.8), k(40.4)], [k(41.0), k(42.4)]],
              enManoD: (ff: number) => ff < k(40.6) ? <g transform="rotate(70)"><Tortilla s={0.55} /></g> : <g><circle r={14} fill="#3a7a2a" stroke="#a8d86a" strokeWidth={3} /></g> })} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// una cebolla cruda, como manzana, sin llorar
export const r05d: PlanB = {
  a: 42.78, b: 45.22, trans: { tipo: "corte" },
  sfx: [[42.8, "eat", 0], [43.4, "eat", 0], [44.0, "eat", 0], [44.44, "sparkle", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const mord = f < k(42.95) ? 0 : f < k(43.5) ? 1 : f < k(44.1) ? 2 : 3;
      const x = 470;
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba" }} seed={6053} mano={1.5}
          claves={[mira(0, x + 70, P - 280, 4.0), mira(k(45.22), x + 80, P - 285, 4.2)]}
          medio={<>
            <Persona {...owenCocina({ ruta: [{ f: 0, x, y: P }], dir: [{ f: 0, v: 1 as const }],
              poses: [{ f: 0, v: { hD: 74, cD: 150, cabeza: 4 } }, { f: k(43.2), v: { hD: 60, cD: 120, cabeza: 8 } }, { f: k(43.45), v: { hD: 74, cD: 150 } }, { f: k(43.8), v: { hD: 60, cD: 120 } }, { f: k(44.05), v: { hD: 74, cD: 150 } }, { f: k(44.4), v: { hD: 56, cD: 110, cabeza: -6 } }],
              caras: [{ f: 0, v: "determinado" }, { f: k(42.9), v: "risa" }, { f: k(44.44), v: "picaro" }],
              miradas: [{ f: 0, v: { x: 1, y: 0 } }, { f: k(44.44), v: { x: 0.2, y: 0 } }],
              habla: [[k(42.9), k(44.3)]],
              enManoD: <g transform="rotate(-10)"><Cebolla s={0.42} mordidas={mord} /></g> })} />
            <TextoW x={x + 140} y={P - 330} t={f < k(44.44) ? "RAW." : "0 TEARS"} tam={30} color={f < k(44.44) ? AMARILLO : "#9fdcff"} f={f} desde={f < k(44.44) ? k(42.85) : k(44.44)} ancla="start" />
          </>} />
      );
    };
    return <Pl />;
  },
};
