// lc06 · «Could 100 People Restart Humanity From Zero?» (The Last Census Ep.6, sesión lc-c). Plan: D:/rtmp/lc06_PLAN_MxM.md
// Igual que lc05: cada plano va de un segundo de la voz al siguiente; k(seg) = cuadro local; sfx en segundos absolutos.
// HUD: POPULATION 10 + MADELINE ISLAND 100 (desde el gancho) + 3er contador por bloque (GENERATIONS, YEAR, KCAL, ICE, °F, DAY).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { golpe, mira, useF } from "../anikit/camara";
import { Escena } from "../anikit/escena";
import { Montaje } from "../anikit/montaje";
import { Actor, ActorProps } from "../anikit/actor";
import { Libro } from "../anikit/props";
import { Halo } from "../anikit/luz";
import { AMBAR, PAL, THEO_CASA, JUNE, GUS, BORDE_CALIDO, BORDE_FRIO } from "../census/elenco";
import { Granja, GRANJA_PUNTOS, Tractor } from "../census/lcb/granja";
import { Ore } from "../census/mundo/ore";
import { MARCUS, ROSA, PRIYA, DEV, NAN, BEN, LILY, ABBY, ABBY_ADENTRO, HALVORSEN, CIENTIFICO, ISLENO } from "../census/lcc/elenco_c";
import { GranjaLiving, GL_PUNTOS, RadioGus, RG_PUNTOS, Mural, Tiza, Escrito } from "../census/lcc/sets5";
import { Isla, ISLA_PUNTOS, Velero, Ferry, LagoHelado, enCamino, LH_HZ, HieloCorte, HC_SUP, PX_PULG, EstacionIsla, EI_PUNTOS, IslaLejana, IglesiaDentro, IG_PUNTOS, Bancos, LagoAbierto, LA_SUP, MotoNieve, AutoChico, Windsled, Lobo } from "../census/lcc/sets6";
import { FarolMano, CuadernoCenso, MicMano, Barreno, MapaLago } from "../census/lcc/piezas";
import { armar, PlanB, cl, HudC, POP, LineaC, Txt, Mano, GloboRadio, BotonSub, Proximo, Cl } from "../census/lcc/lib";
import { Cuaderno, Ondas } from "../lc05/Full";

const P = 900;
const L = GL_PUNTOS;
const act = (look: ActorProps["look"], x: number, extra: Partial<ActorProps> = {}): ActorProps => ({ look, ruta: [{ f: 0, x, y: P }], luz: BORDE_CALIDO, seed: Math.round(Math.abs(x)) % 89, ...extra });
const A: React.FC<ActorProps> = (p) => <Actor {...p} />;
const farol = (f: number, s = 0.9) => <FarolMano y={0} s={s} f={f} halo={0.6} />;
const GUS_RADIO = { ...GUS, accesorios: [...(GUS.accesorios ?? []), { t: "auriculares" as const, color: "#2a2a30" }] };
const DIEZ = [JUNE, THEO_CASA, GUS, MARCUS, ROSA, PRIYA, DEV, NAN, BEN, LILY];

type LE = LineaC & { ent?: number; sale?: number };
const isla = (v: Cl | number, ent?: number, et = "MADELINE ISLAND:"): LE => ({ id: "isla", et, v, icono: "radio", ent });
const gen = (v: Cl | number, ent?: number): LE => ({ id: "gen", et: "GENERATIONS", v, ent, color: "#f6ecd2" });
const anio = (v: Cl | number, ent?: number): LE => ({ id: "anio", et: "YEAR", v, fmt: (n) => `${Math.round(n)}`, color: "#f6ecd2", ent });
const kcal = (v: Cl | number, ent?: number): LE => ({ id: "kcal", et: "KCAL / YEAR", v, fmt: (n) => Math.round(n).toLocaleString("en-US"), color: "#ffb08a", ent });
const hielo = (v: Cl | number, ent?: number, color?: string): LE => ({ id: "hielo", et: "ICE", v, fmt: (n) => `${Math.round(n)}"`, icono: "hielo", color: color ?? "#bfe0ff", ent });
const grados = (v: Cl | number, ent?: number): LE => ({ id: "temp", et: "LA POINTE", v, fmt: (n) => `${Math.round(n)}°F`, icono: "temp", color: "#bfe0ff", ent });
const dia = (v: Cl | number, ent?: number): LE => ({ id: "dia", et: "DAY", v, icono: "dia", ent });
const H: React.FC<{ l?: LE[]; sinIsla?: boolean; pop?: LE }> = ({ l = [], sinIsla, pop }) => <HudC lineas={[pop ?? POP(10), ...(sinIsla ? [] : [isla(100)]), ...l]} />;

// figurita mínima (para las multitudes de 50 / 500 / 100): cabeza + cuerpo
const Figu: React.FC<{ x: number; y: number; s: number; color: string; f?: number; i?: number; camina?: boolean }> = ({ x, y, s, color, f = 0, i = 0, camina }) => {
  const b = camina ? Math.abs(Math.sin(f / 4 + i)) * 4 * s : 0;
  return <g transform={`translate(${x},${y - b}) scale(${s})`}><rect x={-14} y={-96} width={28} height={58} rx={12} fill={color} /><rect x={-12} y={-40} width={9} height={40} fill="#2a2a32" /><rect x={3} y={-40} width={9} height={40} fill="#2a2a32" /><circle cy={-118} r={22} fill="#141018" /><circle cx={-7} cy={-120} r={6} fill="#fff" /><circle cx={7} cy={-120} r={6} fill="#fff" /></g>;
};
const COLS = ["#b2342a", "#2f5a7a", "#6a7a3a", "#c9a03a", "#5a3a6a", "#3a6a6a", "#e07a3a", "#7a3a3a", "#3a8ac8"];
// la fila por el camino del hielo (perspectiva de LagoHelado)
const FilaCamino: React.FC<{ n: number; t0?: number; t1?: number; avanza?: number; faroles?: boolean; off?: number }> = ({ n, t0 = 0.08, t1 = 0.97, avanza = 0, faroles, off = 0 }) => {
  const f = useF();
  return <g>{Array.from({ length: n }).map((_, i) => { const t = t1 - ((t1 - t0) * (i / Math.max(1, n - 1)) + avanza) % (t1 - t0); const p = enCamino(t, off); return <g key={i}><Figu x={p.x} y={p.y} s={p.s * 0.9} color={COLS[i % 9]} f={f} i={i} camina={avanza > 0} />{faroles && <><circle cx={p.x + 22 * p.s} cy={p.y - 60 * p.s} r={7 * p.s + 1} fill={AMBAR} /><Halo x={p.x + 22 * p.s} y={p.y - 60 * p.s} r={60 * p.s + 10} color={AMBAR} fuerza={0.6} /></>}</g>; }).reverse()}</g>;
};

// pantalla partida DENTRO del mundo: dos escenas lado a lado unidas por la línea de radio
const Mitades: React.FC<{ izq: React.ReactNode; der: React.ReactNode }> = ({ izq, der }) => {
  const f = useF();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden" }}><div style={{ position: "absolute", left: -480, width: 1920, height: 1080 }}>{izq}</div></div>
      <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, overflow: "hidden" }}><div style={{ position: "absolute", left: -480, width: 1920, height: 1080 }}>{der}</div></div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}><rect x={954} y={0} width={12} height={1080} fill="#141018" /><path d={`M760,420 Q960,${330 + Math.sin(f / 8) * 20} 1160,420`} stroke={AMBAR} strokeWidth={6} strokeDasharray="16 12" strokeDashoffset={-f * 2} fill="none" /></svg>
    </AbsoluteFill>
  );
};

// ============ 0 · cuadro 0 = la miniatura (la fila cruzando el hielo, grieta a la izquierda, Abby con la mano en alto) ============
const Miniatura6: React.FC<{ k: (s: number) => number; sube?: number }> = ({ k, sube = 1e9 }) => {
  const f = useF();
  return (
    <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "ocaso", grieta: 1 }} seed={600} mano={1.4}
      claves={[mira(0, 960, 540, 1), mira(sube, 970, 520, 1.02, { curva: "inout" }), mira(sube + 34, 1100, -200, 0.8, { curva: "inout" })]}
      medio={<>
        <FilaCamino n={46} t0={0.2} t1={0.97} />
        {[[1060, 830, 0.8], [1230, 870, 0.9]].map(([x, y, e], i) => { return <A key={i} {...act(ISLENO(i * 3 + 1), x, { ruta: [{ f: 0, x, y }], escala: e, dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "miedo" }], poses: [{ f: 0, v: "manosCara" }], luz: { lado: 1, color: "#ffb08a", fuerza: 0.9 }, seed: 70 + i })} />; })}
        <g transform={`translate(1450,${P + 130})`}><g transform="rotate(-8) scale(0.9)"><Barreno /></g></g>
        <A {...act(ABBY, 1640, { ruta: [{ f: 0, x: 1600, y: 1040 }], escala: 1.5, dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "saludar" }], caras: [{ f: 0, v: "miedo" }], miradas: [{ f: 0, v: { x: -0.6, y: 0 } }], luz: { lado: 1, color: "#ffb08a", fuerza: 1 }, enManoI: farol(f, 1) })} />
      </>} />
  );
};
const p00: PlanB = {
  a: 0, b: 1.2,
  sfx: [[0.05, "wind_cold", -18, { dur: 1.2 }], [0.3, "ice_crack", -12]],
  el: (k) => <><Miniatura6 k={k} /><H sinIsla /></>,
};

// ============ 1 · Madeline Island en verano, 2,5 millas de la costa ============
const p01: PlanB = {
  a: 1.2, b: 5.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[1.3, "waves", -18, { dur: 3.8 }], [2.2, "cloth", -10], [3.0, "pencil", -10, { dur: 1.4 }], [4.4, "pop", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const u = interpolate(f, [k(2.6), k(4.4)], [0, 1], cl);
      const x0 = -1180, x1 = -40;
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "dia", estacion: "verano" }} seed={601} mano={1.6} zLejos={0.3}
          claves={[mira(0, -1000, 620, 1.1), mira(k(5.0), -820, 610, 1.0, { curva: "inout" })]}
          medio={<g>
            <path d={`M-2600,${P - 14} L-1120,${P - 14} Q-1040,${P + 10} -1000,${P + 60} L-1000,${P + 600} L-2600,${P + 600} Z`} fill="#4f7a3e" /><path d={`M-2600,${P - 14} L-1120,${P - 14} Q-1060,${P - 4} -1040,${P + 20}`} stroke="#3c5e30" strokeWidth={8} fill="none" />
            {[-2200, -1900, -1650].map((x, i) => <path key={i} d={`M${x},${P - 14} l60,-260 l60,260 Z`} fill="#2f5a3a" />)}
            <A {...act(ABBY, -1300, { escala: 1.25, dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "manosCintura" }, { f: k(2.2), v: "señalar" }], caras: [{ f: 0, v: "neutral" }, { f: k(2.4), v: "determinado" }], miradas: [{ f: 0, v: { x: 0.6, y: -0.1 } }], luz: { lado: 1, color: "#ffcf6e", fuerza: 0.9 } })} />
            <path d={`M${x0},${P - 300} H${x0 + (x1 - x0) * u}`} stroke="#f6ecd2" strokeWidth={8} strokeDasharray="22 14" />
            {u > 0.98 && <circle cx={x1} cy={P - 300} r={14} fill={AMBAR} />}
            <text x={(x0 + x1) / 2} y={P - 340} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={84} fill="#f6ecd2" stroke="#141018" strokeWidth={6} paintOrder="stroke">{(2.5 * u).toFixed(1)} MI</text>
          </g>}
          hud={<H sinIsla l={[]} />} />
      );
    };
    return <Pl />;
  },
};

// ============ 2 · un pueblo, un muelle, una iglesia, una escuela (pins a mano) ============
const p02: PlanB = {
  a: 5.0, b: 7.9, trans: { tipo: "corte" },
  sfx: [[5.3, "wood_hit", -10], [5.6, "pop", -6], [6.6, "pop", -6], [6.9, "church_bell", -14, { dur: 1.2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const I = ISLA_PUNTOS;
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "dia", estacion: "verano", ferry: 1, pins: [k(6.6), 1e9, 1e9, k(5.5)] }} seed={602} mano={1.4}
          claves={[mira(0, 420, 620, 1.15), mira(k(7.9), 700, 620, 1.12, { curva: "inout" })]}
          medio={<>
            <A {...act(ISLENO(1), 300, { escala: 1.15, dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "tirarCarga" }, { f: k(6.2), v: "saludar" }], caras: [{ f: 0, v: "determinado" }, { f: k(6.2), v: "feliz" }], seed: 31 })} />
            <A {...act(ISLENO(4), I.iglesia - 300, { escala: 1.15, ruta: [{ f: 0, x: I.iglesia - 620, y: P }, { f: k(7.4), x: I.iglesia - 300, y: P }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "feliz" }], habla: [[k(6.9), k(7.6)]], seed: 32 })} />
          </>}
          hud={<><H sinIsla />
            <Txt t="ONE FERRY DOCK" a={k(5.4)} b={k(6.6)} top={860} tam={56} chip />
            <Txt t="ONE CHURCH" a={k(6.7)} b={k(7.9) + 4} top={860} tam={56} chip /></>} />
      );
    };
    return <Pl />;
  },
};

const p02b: PlanB = {
  a: 7.9, b: 9.7, trans: { tipo: "corte" },
  sfx: [[8.0, "pop", -6], [8.3, "kids_laugh", -22, { dur: 1.2 }], [8.9, "step", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const I = ISLA_PUNTOS;
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "dia", estacion: "verano", pins: [0, 0, k(8.0), 0] }} seed={6021} mano={1.4}
          claves={[mira(0, I.escuela - 120, 620, 1.2), mira(k(9.7), I.escuela - 40, 620, 1.24, { curva: "inout" })]}
          medio={<>
            <A {...act(ISLENO(6), I.escuela - 600, { escala: 0.8, ruta: [{ f: 0, x: I.escuela - 640, y: P }, { f: k(9.6), x: I.escuela - 120, y: P }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "feliz" }], seed: 33, enManoD: <Libro /> })} />
            <A {...act(ISLENO(2), I.escuela + 260, { escala: 1.15, dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(8.4), v: "saludar" }], caras: [{ f: 0, v: "feliz" }], habla: [[k(8.6), k(9.3)]], seed: 34 })} />
          </>}
          hud={<><H sinIsla /><Txt t="ONE SCHOOL" a={k(8.0)} b={k(9.7) + 4} top={860} tam={56} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 3 · de noche: las ventanas = la gente; MADELINE ISLAND rueda a 100 ============
const p03: PlanB = {
  a: 9.7, b: 16.8, trans: { tipo: "fundido", d: 12 },
  sfx: [[9.8, "wind_soft", -20, { dur: 6 }], [11.2, "door", -12], [12.4, "wood_step", -12], [14.9, "riser", -14, { dur: 1.4 }], [15.0, "pop", -6], [15.4, "pop", -6], [15.8, "pop", -6], [16.2, "ding", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const I = ISLA_PUNTOS;
      const sale = interpolate(f, [k(11.0), k(14.6)], [I.casas - 200, I.casas - 700], cl);
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "noche", estacion: "verano", luces: interpolate(f, [k(10.2), k(14.0)], [0, 1], cl) }} seed={603} mano={1.6}
          claves={[mira(0, 2700, 600, 0.9), mira(k(14.6), 3000, 640, 1.1, { curva: "inout" }), mira(k(16.8), 3000, 560, 0.95, { curva: "inout" })]}
          medio={<>
            <A {...act(ISLENO(3), sale, { escala: 1.05, ruta: [{ f: 0, x: I.casas - 200, y: P }, { f: k(11.0), x: I.casas - 200, y: P }, { f: k(14.6), x: I.casas - 700, y: P }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "neutral" }], luz: { lado: 1, color: AMBAR, fuerza: 1 }, enManoD: farol(f, 0.8), seed: 41 })} />
            <A {...act(ISLENO(5), I.casas + 260, { escala: 1.0, dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "brazosCruzados" }, { f: k(12.6), v: "saludar" }], caras: [{ f: 0, v: "feliz" }], luz: { lado: -1, color: AMBAR, fuerza: 0.9 }, seed: 42 })} />
          </>}
          hud={<><H sinIsla={f < k(14.9)} l={[]} />{f >= k(14.9) && <HudC lineas={[POP(10), isla([{ f: 0, v: 0 }, { f: k(15.0), v: 100, d: 40 }], k(14.9))]} marca={false} />}
            <Txt t="THE LARGEST GROUP LEFT ON EARTH" a={k(11.0)} b={k(14.8)} top={170} tam={52} chip />
            <svg width={1920} height={1080} style={{ position: "absolute" }}>
              <rect x={340} y={200} width={1240} height={660} rx={28} fill="#0e1424" opacity={0.78 * interpolate(f, [k(14.9), k(15.3)], [0, 1], cl)} />
              {Array.from({ length: 100 }).map((_, i) => {
                const d = k(14.95) + (i % 10) * 1.2 + Math.floor(i / 10) * 1.6;
                const s = interpolate(f, [d, d + 6], [0, 1], cl);
                if (s <= 0) return null;
                return <Figu key={i} x={420 + (i % 10) * 120} y={300 + Math.floor(i / 10) * 60} s={0.5 * s} color={COLS[(i * 7) % 9]} />;
              })}
            </svg></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 4 · el muelle: siluetas mirando el lago; una se da vuelta ============
const p04: PlanB = {
  a: 16.8, b: 20.0, trans: { tipo: "corte" },
  sfx: [[16.9, "waves", -18, { dur: 3 }], [17.4, "wood_step", -12], [18.2, "cloth", -10], [18.9, "pop", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const q = interpolate(f, [k(18.8), k(19.4)], [0, 1], cl);
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "ocaso", estacion: "verano", luces: 0.6 }} seed={604} mano={1.6}
          claves={[mira(0, -160, 640, 1.55), mira(k(20.0), -160, 620, 1.7, { curva: "inout" })]}
          medio={<>{[-440, -290, -150, -10, 130].map((x, i) => <A key={i} {...act(ISLENO(i + 2), x, { escala: 1.05, dir: [{ f: 0, v: -1 }, { f: k(17.2 + i * 0.35), v: (i % 2 ? 1 : -1) as 1 | -1 }], caras: [{ f: 0, v: "neutral" }, { f: k(17.4 + i * 0.35), v: (["duda", "miedo", "duda", "triste", "duda"] as const)[i] }], poses: [{ f: 0, v: "parado" }, { f: k(17.6 + i * 0.3), v: (["pensar", "brazosCruzados", "manosCara", "pensar", "encogerse"] as const)[i] }], luz: { lado: -1, color: "#ffcf6e", fuerza: 1 }, seed: 20 + i })} />)}
            <g transform={`translate(-160,${P - 470}) scale(${q})`} opacity={q}>
              <circle cx={-60} cy={130} r={14} fill="#fbf8f1" /><circle cx={-30} cy={95} r={22} fill="#fbf8f1" />
              <ellipse cx={40} cy={0} rx={120} ry={90} fill="#fbf8f1" stroke="#221c18" strokeWidth={5} />
              <text x={40} y={40} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={120} fill="#b8382c">?</text>
            </g></>}
          hud={<H />} />
      );
    };
    return <Pl />;
  },
};

// ============ 5 · la isla chiquita en el lago enorme: «Could 100 people restart humanity?» ============
const p05: PlanB = {
  a: 20.0, b: 23.2, trans: { tipo: "fundido", d: 10 },
  sfx: [[20.1, "riser", -14, { dur: 2.6 }], [20.2, "waves", -20, { dur: 3 }], [21.0, "cloth", -12]],
  el: (k) => (
    <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "ocaso", agua: 1, arbolitos: 0 }} seed={605} mano={1.5}
      claves={[mira(0, 1120, 560, 1.6), mira(k(23.2), 1120, 560, 1.0, { curva: "inout" })]}
      frente={<A {...act(ABBY, 640, { ruta: [{ f: 0, x: 780, y: 1040 }], escala: 1.4, dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(21.0), v: "pensar" }], caras: [{ f: 0, v: "determinado" }], miradas: [{ f: 0, v: { x: 0.7, y: -0.2 } }], luz: { lado: 1, color: "#ffb08a", fuerza: 1 } })} />}
      hud={<><H /><Txt t={"COULD 100 PEOPLE\nRESTART HUMANITY?"} a={k(20.2)} b={k(23.2) + 4} top={640} left={980} tam={74} color="#f6ecd2" /></>} />
  ),
};

// ============ 6 · «Let's count it.» el cuaderno: 10 y «100?» al margen ============
const p06: PlanB = {
  a: 23.2, b: 24.6, trans: { tipo: "corte" },
  sfx: [[23.25, "page", -4], [23.4, "pencil", -8, { dur: 1.1 }]],
  el: (k) => <><Cuaderno abre={k(23.25)} lineas={[{ t: "POPULATION 10", desde: k(23.3), tam: 64 }, { t: "island: 100?", desde: k(23.8), tam: 58, color: "#b8382c", y: 470 }]} /><H /></>,
};

// ============ 7 · el altillo: Gus al micrófono; la onda cruza el mapa del lago ============
const p07: PlanB = {
  a: 24.6, b: 30.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[24.7, "static", -16, { dur: 5 }], [25.2, "ptt", -6], [27.6, "paper", -12], [28.2, "radio_ping", -10]],
  el: (k) => {
    const Pl: React.FC = () => { const f = useF(); return (
    <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 1, aguja: 0.62, isla: 1, linea: 1, ruta: interpolate(f, [k(27.4), k(29.6)], [0, 1], cl) }} seed={607} mano={2}
      claves={[mira(0, RG_PUNTOS.silla + 60, 700, 1.75), mira(k(27.0), RG_PUNTOS.silla + 160, 680, 1.6, { curva: "inout" }), mira(k(30.0), RG_PUNTOS.mapa, 440, 1.45, { curva: "inout" })]}
      medio={<A {...act(GUS_RADIO, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 25, cI: 50 } }, { f: k(27.2), v: { tronco: 2, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 95, cI: 10 } }], caras: [{ f: 0, v: "determinado" }, { f: k(26.4), v: "feliz" }], habla: [[k(25.0), k(27.0)]], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 }, enManoD: <MicMano s={0.8} ptt /> })} />}
      hud={<><H /><Txt t="LAST TIME" a={k(24.8)} b={k(26.8)} top={170} tam={44} chip /></>} />
    ); };
    return <Pl />;
  },
};

// ============ 8 · Abby en la radio de la isla ============
const p08: PlanB = {
  a: 30.0, b: 34.9, trans: { tipo: "corte" },
  sfx: [[30.1, "static", -18, { dur: 4.5 }], [31.0, "cloth", -10], [32.4, "ptt", -6]],
  el: (k) => (
    <Escena Set={EstacionIsla} pal={PAL} setProps={{ hora: "noche", temp: 54, afuera: "verano" }} seed={608} mano={2}
      claves={[mira(0, EI_PUNTOS.silla + 40, 700, 1.9), mira(k(34.9), EI_PUNTOS.silla + 120, 690, 1.8, { curva: "inout" })]}
      medio={<A {...act(ABBY_ADENTRO, EI_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hI: 160, cI: 40, hD: 30, cD: 50 } }, { f: k(31.4), v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 25, cI: 50 } }], caras: [{ f: 0, v: "feliz" }], habla: [[k(32.4), k(34.6)]], luz: { lado: 1, color: "#7dffb0", fuerza: 0.8 }, enManoD: (ff: number) => ff > k(31.4) ? <MicMano s={0.8} ptt /> : null })} />}
      hud={<><H /><Txt t={"ABBY LACROIX · 40\nFORMER PARK RANGER"} a={k(30.4)} b={k(33.0)} top={200} left={1180} tam={50} chip /><Txt t="APOSTLE ISLANDS · WISCONSIN" a={k(33.0)} b={k(34.9) + 4} top={200} left={1080} tam={48} chip /></>} />
  ),
};

// ============ 9 · antes: 300 todo el año · la mañana del silencio: 4 ============
const Bici: React.FC<{ x: number; y: number; tirada?: boolean; color?: string }> = ({ x, y, tirada, color = "#c0352c" }) => (
  <g transform={`translate(${x},${y}) rotate(${tirada ? -80 : 0})`}><circle cx={-40} cy={-30} r={28} fill="none" stroke="#2a2a30" strokeWidth={5} /><circle cx={40} cy={-30} r={28} fill="none" stroke="#2a2a30" strokeWidth={5} /><path d="M-40,-30 L-5,-70 L30,-70 L40,-30 M-5,-70 L-10,-84 M30,-70 L26,-90" stroke={color} strokeWidth={6} fill="none" /></g>
);
const p09: PlanB = {
  a: 34.9, b: 41.9, trans: { tipo: "fundido", d: 10 },
  sfx: [[35.0, "kids_laugh", -26, { dur: 3.2 }], [35.6, "ding", -14], [38.5, "wind_soft", -16, { dur: 3.4 }], [39.4, "tick", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const antes = f < k(38.4);
      const x0 = ISLA_PUNTOS.almacen - 500;
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "dia", estacion: "verano" }} seed={609} mano={2}
          claves={antes ? [mira(0, x0 + 360, 600, 1.0), mira(k(38.4), x0 + 460, 600, 1.05, { curva: "inout" })] : [mira(0, x0 + 420, 640, 1.35), mira(k(41.9), x0 + 440, 640, 1.5, { curva: "inout" })]}
          medio={antes
            ? <>{Array.from({ length: 12 }).map((_, i) => <A key={i} {...act(ISLENO(i), x0 - 200 + i * 110, { ruta: [{ f: 0, x: x0 - 200 + i * 110, y: P }, { f: k(38.4), x: x0 - 200 + i * 110 + (i % 2 ? 120 : -120), y: P }], escala: 1.0, dir: [{ f: 0, v: i % 2 ? 1 : -1 }], caras: [{ f: 0, v: i % 3 ? "feliz" : "risa" }], seed: i })} />)}<Bici x={x0 + 200} y={P} /></>
            : <>
              <Bici x={x0 + 120} y={P} tirada /><Bici x={x0 + 700} y={P} tirada color="#2f5a7a" />
              <g transform={`translate(${x0 + 420},${P})`}><rect x={-90} y={-60} width={180} height={12} fill="#7a5a3e" /><rect x={-80} y={-48} width={10} height={48} fill="#5a4030" /><rect x={70} y={-48} width={10} height={48} fill="#5a4030" /><rect x={30} y={-84} width={26} height={24} rx={4} fill="#e8e4da" /></g>
              {[0, 1, 2, 3].map((i) => <A key={i} {...act(ISLENO(i + 9), x0 + 200 + i * 150, { escala: 1.1, poses: [{ f: 0, v: "parado" }, { f: k(40.0) + i * 4, v: (["manosCara", "brazosCruzados", "encogerse", "pensar"] as const)[i] }], dir: [{ f: 0, v: i < 2 ? 1 : -1 }], caras: [{ f: 0, v: "miedo" }, { f: k(40.4), v: "triste" }], miradas: [{ f: 0, v: { x: i < 2 ? 1 : -1, y: 0 } }], seed: 40 + i })} />)}
            </>}
          hud={<></>} />
      );
    };
    return <Pl />;
  },
};
// (el contador de la isla muestra 300 → 4: se pone aparte para no duplicar la línea)
const p09h: PlanB["el"] = (k) => <HudC lineas={[POP(10), isla([{ f: 0, v: 300 }, { f: k(39.4), v: 4, d: 26 }], undefined, "MADELINE ISLAND:")]} />;

// ============ 10 · más gente llega: lanchas por tres lados, bajan al muelle ============
const Lancha: React.FC<{ x: number; y: number; s?: number; color?: string; gente?: number }> = ({ x, y, s = 1, color = "#e8e4da", gente = 2 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><path d="M-120,-30 L130,-30 L100,10 L-100,10 Z" fill={color} /><rect x={-120} y={-36} width={250} height={8} fill="#2f4a6a" />{Array.from({ length: gente }).map((_, i) => <Figu key={i} x={-60 + i * 50} y={-30} s={0.5} color={COLS[(i * 3) % 9]} />)}</g>
);
const p10: PlanB = {
  a: 41.9, b: 47.5, trans: { tipo: "corte" },
  sfx: [[42.0, "boat", -14, { dur: 5 }], [43.6, "cloth", -10], [44.6, "wood_step", -10], [45.0, "wood_step", -10], [45.4, "wood_step", -10], [46.4, "tick", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "dia", estacion: "verano" }} seed={610} mano={2}
          claves={[mira(0, -560, 640, 1.05), mira(k(47.5), -260, 640, 1.15, { curva: "inout" })]}
          medio={<>
            {[0, 1, 2].map((i) => <Lancha key={i} x={interpolate(f, [k(42.0) + i * 20, k(44.0) + i * 30], [-2600 - i * 300, -900 + i * 180], cl)} y={P + 40 + i * 60} s={0.9 - i * 0.1} color={["#e8e4da", "#c8382c", "#2f6a5a"][i]} gente={2 + i} />)}
            {Array.from({ length: 6 }).map((_, i) => <A key={i} {...act(ISLENO(i + 13), 0, { ruta: [{ f: 0, x: -620 + i * 75, y: P - 10 }, { f: k(44.4) + i * 8, x: -620 + i * 75, y: P - 10 }, { f: k(47.4), x: -80 + i * 120, y: P }], escala: 1.05, dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: i % 2 ? "cansado" : "feliz" }], seed: 50 + i })} />)}
          </>}
          hud={<><HudC lineas={[POP(10), isla([{ f: 0, v: 4 }, { f: k(43.0), v: 37, d: 30 }, { f: k(46.4), v: 68, d: 26 }])]} /><Txt t="BAYFIELD · ASHLAND · FISHING BOATS · CABINS" a={k(42.4)} b={k(47.5)} top={880} tam={46} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 11 · desde la costa de noche: ven las luces del generador y cruzan a remo ============
const BoteRemo: React.FC<{ x: number; y: number; s?: number; f: number; rema?: boolean }> = ({ x, y, s = 1, f, rema }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><path d="M-110,-24 L110,-24 L84,10 L-84,10 Z" fill="#7a5a3e" />{rema && <path d={`M-10,-40 L${-90 + Math.sin(f / 5) * 30},20`} stroke="#c8a878" strokeWidth={6} />}<Figu x={-50} y={-24} s={0.55} color="#2f5a7a" /><Figu x={20} y={-24} s={0.42} color="#c9a03a" /><Figu x={70} y={-24} s={0.5} color="#b2342a" /></g>
);
const p11: PlanB = {
  a: 47.5, b: 52.3, trans: { tipo: "fundido", d: 12 },
  sfx: [[47.6, "waves", -20, { dur: 4.6 }], [49.8, "row", -12, { dur: 2.4 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const bote = f > k(49.6);
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "noche", agua: 1, arbolitos: 0, islaLuz: 1 }} seed={611} mano={2}
          claves={[mira(0, 1380, 760, 1.25), mira(k(52.3), 1300, 720, 1.5, { curva: "inout" })]}
          medio={<>
            <rect x={-2000} y={1040} width={6000} height={800} fill="#3a3a44" /><rect x={-2000} y={1036} width={6000} height={8} fill="#5a5a64" />
            {!bote ? <A {...act(ISLENO(4), 1500, { ruta: [{ f: 0, x: 1500, y: 1040 }], escala: 1.3, dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "sorpresa" }], miradas: [{ f: 0, v: { x: -0.7, y: -0.3 } }], luz: { lado: -1, color: AMBAR, fuerza: 0.4 } })} />
              : <BoteRemo x={interpolate(f, [k(49.6), k(52.3)], [1500, 1260], cl)} y={interpolate(f, [k(49.6), k(52.3)], [1020, 820], cl)} s={interpolate(f, [k(49.6), k(52.3)], [1.6, 1.1], cl)} f={f} rema />}
          </>}
          hud={<><HudC lineas={[POP(10), isla(68)]} /><Txt t="THE GENERATOR LIGHTS" a={k(48.4)} b={k(50.6)} top={200} tam={44} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 12 · la cartelera de la iglesia se completa: 100 ============
const p12: PlanB = {
  a: 52.3, b: 56.5, trans: { tipo: "corte" },
  sfx: [[52.4, "door", -14], [53.4, "pencil", -10, { dur: 1.5 }], [55.0, "wood_hit", -6], [55.3, "tick", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={IglesiaDentro} pal={PAL} setProps={{ nombres: interpolate(f, [k(52.6), k(55.0)], [0.6, 1], cl) }} seed={612} mano={2}
          claves={[mira(0, IG_PUNTOS.puerta + 300, 600, 1.3), mira(k(56.5), IG_PUNTOS.puerta + 320, 580, 1.45, { curva: "inout" })]}
          medio={<A {...act(ABBY_ADENTRO, IG_PUNTOS.puerta + 440, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(54.4), v: { hD: 120, cD: 30 } }, { f: k(55.4), v: "manosCintura" }], caras: [{ f: 0, v: "determinado" }, { f: k(55.4), v: "feliz" }] })} />}
          hud={<><HudC lineas={[POP(10), isla([{ f: 0, v: 68 }, { f: k(53.0), v: 99, d: 50 }, { f: k(55.3), v: 100, d: 6 }])]} /><Txt t="SEPTEMBER" a={k(52.6)} b={k(56.5)} top={200} tam={44} chip /></>} />
      );
    };
    return <Pl />;
  },
};

const Numeros13: React.FC<{ k: (s: number) => number }> = ({ k }) => {
  const f = useF();
  const u = interpolate(f, [k(61.6), k(62.8)], [0, 1], cl), o = interpolate(f, [k(61.4), k(61.7)], [0, 1], cl);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute" }} opacity={o}>
      <text x={760 + 400 * u} y={330 - Math.sin(u * Math.PI) * 140} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={130} fill={AMBAR} stroke="#141018" strokeWidth={10} paintOrder="stroke">10</text>
      <text x={1160 - 400 * u} y={330 + Math.sin(u * Math.PI) * 170} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={130} fill="#7dffb0" stroke="#141018" strokeWidth={10} paintOrder="stroke">100</text>
    </svg>
  );
};
// ============ 13 · pantalla partida: la granja y la isla hablan cada noche (DAY 352 → 360) ============
const p13: PlanB = {
  a: 56.5, b: 63.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[56.6, "static", -20, { dur: 6.4 }], [57.6, "tick", -8], [58.6, "tick", -8], [59.6, "tick", -8], [60.6, "tick", -8], [61.6, "tick", -8]],
  el: (k) => (
    <>
      <Mitades
        izq={<Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 1, aguja: 0.62 }} seed={613} mano={1.6} claves={[mira(0, RG_PUNTOS.radio - 60, 650, 1.6)]}
          medio={<A {...act(GUS_RADIO, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 25, cI: 50 } }], caras: [{ f: 0, v: "feliz" }, { f: k(60.0), v: "duda" }], habla: [[k(57.0), k(58.4)], [k(59.6), k(61.0)]], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 }, enManoD: <MicMano s={0.8} ptt /> })} />} />}
        der={<Escena Set={EstacionIsla} pal={PAL} setProps={{ hora: "noche", temp: 40 }} seed={614} mano={1.6} claves={[mira(0, EI_PUNTOS.radio + 40, 650, 1.6)]}
          medio={<A {...act(ABBY_ADENTRO, EI_PUNTOS.radio + 260, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 25, cI: 50 } }], caras: [{ f: 0, v: "neutral" }, { f: k(61.0), v: "determinado" }], habla: [[k(58.4), k(59.6)], [k(61.0), k(62.6)]], luz: { lado: -1, color: "#7dffb0", fuerza: 0.8 }, enManoD: <MicMano s={0.8} ptt /> })} />} />}
      />
      <HudC lineas={[POP(10), isla(100), dia([{ f: 0, v: 352 }, { f: k(57.6), v: 354, d: 6 }, { f: k(58.6), v: 356, d: 6 }, { f: k(59.6), v: 357, d: 6 }, { f: k(60.6), v: 359, d: 6 }, { f: k(61.6), v: 360, d: 6 }], k(56.8))]} />
      <Txt t="NOT FOOD. NOT MEDICINE. NUMBERS." a={k(59.8)} b={k(63.0) + 4} top={880} tam={52} chip color={AMBAR} />
      <Numeros13 k={k} />
    </>
  ),
};

// ============ 14 · la granja escucha la radio: ¿alcanzan 10 personas? ============
const p14: PlanB = {
  a: 63.0, b: 68.7, trans: { tipo: "corte" },
  sfx: [[63.1, "static", -22, { dur: 3.6 }], [66.8, "tick", -4], [67.0, "heart1", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const mira10 = f > k(66.8);
      return (
        <Escena Set={GranjaLiving} pal={PAL} setProps={{ hora: "noche", farol: 1 }} seed={615} mano={2}
          claves={[mira(0, L.mesa - 60, 640, 1.3), mira(k(66.6), L.mesa, 640, 1.38, { curva: "inout" }), mira(k(68.7), L.mesa + 40, 620, 1.55, { curva: "inout" })]}
          medio={<>
            <Ore x={L.mesa - 700} y={P} dir={1} s={0.8} f={f} echado={0.7} cabeza={mira10 ? -10 : 14} />
            {DIEZ.map((l, i) => <A key={i} {...act(l, L.mesa - 420 + i * 95 + (i > 4 ? 80 : 0), { asiento: [{ f: 0, v: l.alto ? 40 : 60 }], poses: [{ f: 0, v: "sentado" }], dir: [{ f: 0, v: i < 5 ? 1 : -1 }], caras: [{ f: 0, v: "neutral" }, { f: k(66.8), v: i % 2 ? "miedo" : "duda" }], miradas: [{ f: 0, v: { x: 0, y: 0.5 } }, { f: k(66.8) + i * 2, v: { x: i < 5 ? 1 : -1, y: -0.2 } }], seed: 30 + i })} />)}
            <g transform={`translate(${L.mesa + 40},${P - 182})`}><rect x={-60} y={-70} width={120} height={70} rx={8} fill="#3a3a40" /><circle cx={30} cy={-36} r={18} fill="#7dffb0" opacity={0.8} /></g>
          </>}
          hud={<><HudC lineas={[POP(10, { color: mira10 && Math.floor(f / 6) % 2 ? "#ff6a5a" : undefined }), isla(100)]} /><Txt t="IS 10 PEOPLE ENOUGH?" a={k(66.6)} b={k(68.7) + 4} top={190} tam={70} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 15 · la versión que asusta: Nan abre el libro de biología ============
const p15: PlanB = {
  a: 68.7, b: 71.0, trans: { tipo: "fundido", d: 8 },
  sfx: [[68.9, "page", -6], [69.6, "tick", -6]],
  el: (k) => (
    <Escena Set={GranjaLiving} pal={PAL} setProps={{ hora: "noche", farol: 1 }} seed={616} mano={2}
      claves={[mira(0, L.mesa + 320, 640, 1.3), mira(k(71.0), L.mesa + 330, 640, 1.42, { curva: "inout" })]}
      medio={<A {...act(NAN, L.mesa + 320, { asiento: [{ f: 0, v: 60 }], poses: [{ f: 0, v: { tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 60, cD: 80, hI: 50, cI: 80, cabeza: 10 } }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "determinado" }], enManoD: <g transform="scale(0.8)"><Libro abierto /></g> })} />}
      hud={<><H l={[gen(1, k(69.6))]} /><Txt t="THE SCARY VERSION" a={k(69.0)} b={k(71.0) + 4} top={200} tam={56} chip color="#ff8a6a" /></>} />
  ),
};

// ============ 16 · el árbol de las 10 cabecitas: crece, las ramas vuelven a juntarse; los puntos rojos chocan ============
const Cabecita: React.FC<{ x: number; y: number; c: string; u: number; r?: number }> = ({ x, y, c, u, r = 22 }) => u > 0 ? <g transform={`translate(${x},${y}) scale(${u})`}><circle r={r} fill="#141018" stroke={c} strokeWidth={6} /><circle cx={-r * 0.3} cy={-r * 0.1} r={r * 0.22} fill="#fff" /><circle cx={r * 0.3} cy={-r * 0.1} r={r * 0.22} fill="#fff" /></g> : null;
const ArbolFam: React.FC<{ desde: number; gens: number; paso: number; raiz?: number; ancho?: number; rojo?: number; nuevo?: number; x0?: number; y0?: number }> = ({ desde, gens, paso, raiz = 10, ancho = 1, rojo = 1e9, nuevo = 1e9, x0 = 960, y0 = 200 }) => {
  const f = useF();
  const els: React.ReactNode[] = [];
  let fila = Array.from({ length: raiz }).map((_, i) => x0 + (i - (raiz - 1) / 2) * 120);
  for (let g = 0; g < gens; g++) {
    const t0 = desde + g * paso;
    const y = y0 + g * 170;
    const n = Math.round(fila.length * (ancho > 1 ? ancho : 1));
    const sig = Array.from({ length: Math.min(n, 30) }).map((_, i) => x0 + (i - (Math.min(n, 30) - 1) / 2) * Math.min(120, 1500 / Math.min(n, 30)));
    fila.forEach((x, i) => {
      els.push(<Cabecita key={`c${g}${i}`} x={x} y={y} c={f > nuevo && g === gens - 1 && i % 4 === 0 ? AMBAR : COLS[(i + g) % 9]} u={interpolate(f, [t0 + i, t0 + i + 6], [0, 1], cl)} r={raiz > 10 ? 16 : 22} />);
      if (g < gens - 1) [i % sig.length, (i * 3 + 1) % sig.length].forEach((j, q) => els.push(<Tiza key={`l${g}${i}${q}`} d={`M${x},${y + 24} C${x},${y + 90} ${sig[j]},${y + 80} ${sig[j]},${y + 146}`} f={f} desde={t0 + paso * 0.5} dur={paso * 0.4} ancho={3} o={0.7} />));
    });
    fila = sig;
  }
  // los dos puntitos rojos (genes ocultos) que bajan por ramas distintas y se encuentran
  if (f > rojo) {
    const u = interpolate(f, [rojo, rojo + 60], [0, 1], cl);
    const yb = y0 + (gens - 1) * 170;
    [[-1, x0 - 420], [1, x0 + 420]].forEach(([s, x], i) => els.push(<circle key={`r${i}`} cx={x + (x0 - x) * u} cy={y0 + (yb - y0) * u} r={14} fill="#ff3a2a" />));
    if (u >= 1) els.push(<circle key="b" cx={x0} cy={yb} r={interpolate(f, [rojo + 60, rojo + 70], [14, 60], cl)} fill="none" stroke="#ff3a2a" strokeWidth={6} opacity={interpolate(f, [rojo + 60, rojo + 80], [1, 0.3], cl)} />);
  }
  return <g>{els}</g>;
};
const p16: PlanB = {
  a: 71.0, b: 78.3, trans: { tipo: "fundido", d: 10 },
  sfx: [[71.2, "chalk", -6, { dur: 3 }], [72.9, "tick", -6], [74.5, "tick", -6], [76.1, "tick", -6], [77.0, "pop", -8], [77.3, "chalk", -8, { dur: 1.2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const cor = interpolate(f, [k(77.0), k(77.3)], [0, 1], cl);
      return (
        <Escena Set={Mural} pal={PAL} setProps={{ tono: "#1e2a26" }} seed={617} mano={1.6}
          claves={[mira(0, 860, 500, 1.12), mira(k(75.5), 880, 520, 1.0, { curva: "inout" }), mira(k(78.3), 900, 530, 0.98, { curva: "inout" })]}
          detras={<>
            <ArbolFam desde={k(71.3)} gens={4} paso={k(72.9) - k(71.3)} />
            {cor > 0 && <g transform={`translate(960,${200 + 3 * 170 - 70}) scale(${cor * (1 + Math.sin(f / 5) * 0.06)})`}><path d="M0,18 C-40,-12 -24,-44 0,-24 C24,-44 40,-12 0,18 Z" fill="#ff5a6a" stroke="#141018" strokeWidth={5} /></g>}
          </>}
          medio={<A {...act(NAN, 160, { escala: 1.05, dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(71.6), v: "señalar" }, { f: k(77.0), v: "pensar" }], caras: [{ f: 0, v: "determinado" }, { f: k(77.0), v: "duda" }], miradas: [{ f: 0, v: { x: 1, y: -0.4 } }], habla: [[k(71.0), k(78.2)]] })} />}
          hud={<><H l={[gen([{ f: 0, v: 1 }, { f: k(72.9), v: 2, d: 6 }, { f: k(74.5), v: 3, d: 6 }, { f: k(76.1), v: 4, d: 6 }])]} />
            <Txt t="COUSINS MARRY COUSINS" a={k(77.0)} b={k(78.3) + 4} top={880} tam={52} chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

const p16b: PlanB = {
  a: 78.3, b: 85.7, trans: { tipo: "corte" },
  sfx: [[78.5, "step", -10], [79.8, "pop", -6], [80.2, "kids_laugh", -16], [81.6, "suspense", -12, { dur: 1.4 }], [83.0, "heart", -4], [83.1, "boom", -12], [84.1, "chalk", -6, { dur: 1.4 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const u = interpolate(f, [k(81.6), k(83.0)], [0, 1], cl);
      const choque = f >= k(83.0);
      const yk = P - 150;
      const kid = interpolate(f, [k(79.8), k(80.2)], [0, 1], cl);
      return (
        <Escena Set={Mural} pal={PAL} setProps={{ tono: "#1e2a26" }} seed={6162} mano={1.6}
          claves={[mira(0, 960, 680, 1.55), mira(k(83.0), 960, 690, 1.65, { curva: "inout" }), mira(k(85.7), 960, 660, 1.5, { curva: "inout" })]}
          medio={<>
            <A {...act(ISLENO(3), 640, { ruta: [{ f: 0, x: 560, y: P }, { f: k(79.4), x: 690, y: P }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(79.6), v: "hablar" }, { f: k(83.0), v: "manosCara" }], caras: [{ f: 0, v: "feliz" }, { f: k(83.0), v: "sorpresa" }, { f: k(84.0), v: "triste" }] })} />
            <A {...act(ISLENO(4), 1280, { ruta: [{ f: 0, x: 1360, y: P }, { f: k(79.4), x: 1230, y: P }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(79.6), v: "hablar" }, { f: k(83.0), v: "encogerse" }], caras: [{ f: 0, v: "feliz" }, { f: k(83.0), v: "miedo" }, { f: k(84.0), v: "triste" }] })} />
            {kid > 0 && <A {...act(LILY, 960, { escala: 0.8, dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "saludar" }, { f: k(83.0), v: "encogerse" }], caras: [{ f: 0, v: "risa" }, { f: k(83.0), v: "duda" }], opacidad: (ff) => interpolate(ff, [k(79.8), k(80.2)], [0, 1], cl) })} />}
            {f > k(81.4) && !choque && [[700, P - 260], [1220, P - 260]].map(([x, y], i) => <g key={i}><circle cx={x + (960 - x) * u} cy={y + (yk - y) * u} r={16} fill="#ff3a2a" stroke="#141018" strokeWidth={4} /><path d={`M${x},${y} L${x + (960 - x) * u},${y + (yk - y) * u}`} stroke="#ff3a2a" strokeWidth={4} strokeDasharray="10 10" opacity={0.6} /></g>)}
            {choque && <><circle cx={960} cy={yk} r={interpolate(f, [k(83.0), k(83.4)], [16, 90], cl)} fill="none" stroke="#ff3a2a" strokeWidth={8} opacity={interpolate(f, [k(83.0), k(84.0)], [1, 0.2], cl)} /><circle cx={960} cy={yk} r={20} fill="#ff3a2a" stroke="#141018" strokeWidth={4} /></>}
          </>}
          hud={<><H l={[gen(4)]} />
            <Txt t="HIDDEN GENES MEET" a={k(81.6)} b={k(84.0)} top={880} tam={52} chip color="#ff8a6a" />
            <Mano t="INBREEDING" x={960} y={230} desde={k(84.1)} tam={110} vel={2.4} color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 17 · los lobos en la isla nevada: de 6 a 2 ============
const p17: PlanB = {
  a: 85.7, b: 92.3, trans: { tipo: "fundido", d: 10 },
  sfx: [[85.8, "wind_cold", -14, { dur: 6 }], [86.2, "wolf", -10], [88.2, "tick", -6], [88.8, "tick", -6], [89.6, "tick", -6], [90.5, "fall", -12], [91.2, "wind_soft", -16]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const paso = f < k(88.2) ? 0 : f < k(88.8) ? 1 : f < k(89.6) ? 2 : 3;
      const vivos = [9, 6, 4, 2][paso];
      const sw = [1.15, 1.0, 0.9, 0.82][paso];
      return (
        <Escena Set={IslaLejana} pal={PAL} setProps={{ tipo: "lobos", hora: "invierno" }} seed={618} mano={2}
          claves={[mira(0, 1060, 640, 1.0), mira(k(92.3), 1060, 660, 1.12, { curva: "inout" })]}
          medio={<>{Array.from({ length: 9 }).map((_, i) => {
            const orden = [4, 2, 6, 0, 8, 1, 7, 3, 5].indexOf(i);
            const sale = orden >= vivos;
            const t0 = [k(88.2), k(88.8), k(89.6)][orden >= 6 ? 0 : orden >= 4 ? 1 : 2];
            const o = sale ? interpolate(f, [t0, t0 + 8], [1, 0], cl) : 1;
            return o > 0 ? <g key={i} opacity={o}><Lobo x={420 + i * 160 + Math.sin(f / 40 + i) * 18} y={P - 20 + (i % 2) * 30} s={sw} f={f + i * 9} dir={i % 2 ? 1 : -1} echado={!sale ? interpolate(f, [k(90.5), k(90.9)], [0, 1], cl) : 0} /></g> : null;
          })}</>}
          hud={<><H l={[gen([{ f: 0, v: 1 }, { f: k(88.2), v: 2, d: 6 }, { f: k(88.8), v: 3, d: 6 }, { f: k(89.6), v: 4, d: 6 }])]} /><Txt t="WEAKER · SICKER · COLLAPSE" a={k(88.0)} b={k(92.3)} top={200} tam={54} mano chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 18 · el biólogo de campo; «50 / 500» gigante en el cielo ============
const p18: PlanB = {
  a: 92.3, b: 99.6, trans: { tipo: "corte" },
  sfx: [[92.4, "step", -10], [93.4, "page", -8], [95.2, "chalk", -6, { dur: 1 }], [97.8, "chalk", -4, { dur: 1.4 }], [99.0, "ding", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const c50 = Math.round(interpolate(f, [k(97.9), k(99.4)], [0, 5], cl));
      const c500 = Math.round(interpolate(f, [k(98.2), k(99.6)], [0, 12], cl));
      return (
        <Escena Set={Mural} pal={PAL} setProps={{ tono: "#1e2a26" }} seed={619} mano={1.6}
          claves={[mira(0, 820, 560, 1.45), mira(k(97.0), 960, 530, 1.32, { curva: "inout" }), mira(k(99.6), 980, 530, 1.28, { curva: "inout" })]}
          detras={<>
            <Escrito t="RULE OF THUMB" x={760} y={250} f={f} desde={k(95.0)} tam={54} />
            <Escrito t="50" x={880} y={470} f={f} desde={k(97.8)} tam={170} ancla="middle" color="#ffd27a" vel={0.6} />
            <Escrito t="/" x={1080} y={470} f={f} desde={k(98.1)} tam={170} ancla="middle" vel={0.6} />
            <Escrito t="500" x={1320} y={470} f={f} desde={k(98.2)} tam={170} ancla="middle" color="#7ad08a" vel={0.6} />
            {Array.from({ length: c50 }).map((_, i) => <Figu key={`a${i}`} x={800 + (i % 5) * 42} y={640} s={0.5} color={COLS[i % 9]} />)}
            {Array.from({ length: c500 }).map((_, i) => <Figu key={`b${i}`} x={1210 + (i % 6) * 42} y={640 + Math.floor(i / 6) * 62} s={0.5} color={COLS[(i + 3) % 9]} />)}
          </>}
          medio={<A {...act({ ...CIENTIFICO, accesorios: [{ t: "chaleco", color: "#6a7a3a" }, { t: "gorroLana", color: "#b2342a" }] }, 520, { ruta: [{ f: 0, x: 380, y: P }, { f: k(93.6), x: 560, y: P }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(93.8), v: "hablar" }, { f: k(95.0), v: "agarrarAlto" }, { f: k(96.4), v: "hablar" }, { f: k(97.6), v: "señalar" }], caras: [{ f: 0, v: "neutral" }, { f: k(95.0), v: "determinado" }, { f: k(98.4), v: "feliz" }], habla: [[k(92.3), k(99.5)]] })} />}
          hud={<><H l={[gen(4)]} />
            <Txt t="ENDANGERED-SPECIES SCIENTISTS" a={k(92.8)} b={k(96.9)} top={880} tam={48} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 19 · la pizarra sobre el hielo: 50 figuritas = corto plazo ============
const Tablero19: React.FC<{ k: (s: number) => number; n50: number; n500: number }> = ({ n50, n500 }) => (
  <g>
    <rect x={520} y={300} width={16} height={600} fill="#5a3a22" /><rect x={1784} y={300} width={16} height={600} fill="#5a3a22" />
    <rect x={480} y={150} width={1360} height={700} rx={14} fill="#1e2a26" stroke="#7a5230" strokeWidth={14} />
    <line x1={1000} y1={190} x2={1000} y2={820} stroke="#f2ead8" strokeWidth={3} opacity={0.25} strokeDasharray="12 12" />
    {Array.from({ length: n50 }).map((_, i) => <Figu key={`a${i}`} x={600 + (i % 10) * 34} y={420 + Math.floor(i / 10) * 44} s={0.32} color={COLS[i % 9]} />)}
    {Array.from({ length: n500 }).map((_, i) => <Figu key={`b${i}`} x={1040 + (i % 25) * 30} y={250 + Math.floor(i / 25) * 30} s={0.26} color={COLS[(i * 7) % 9]} />)}
  </g>
);

// ============ 19 · 50 en fila sobre el hielo, y después 500 hasta el horizonte ============
const p19: PlanB = {
  a: 99.6, b: 105.1, trans: { tipo: "fundido", d: 10 },
  sfx: [[100.0, "snow_step", -12, { dur: 1.2 }], [100.9, "popcluster", -8, { dur: 1.8 }], [102.8, "chalk", -8, { dur: 1 }], [104.2, "ding", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const n50 = Math.round(interpolate(f, [k(100.9), k(102.8)], [0, 50], cl));
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "ocaso", arbolitos: 0 }} seed={620} mano={1.6}
          claves={[mira(0, 720, 560, 1.4), mira(k(105.1), 740, 560, 1.48, { curva: "inout" })]}
          medio={<>
            <Tablero19 k={k} n50={n50} n500={0} />
            <Escrito t="~50" x={770} y={360} f={f} desde={k(100.9)} tam={80} ancla="middle" color="#ffd27a" />
            <Escrito t="SHORT TERM" x={770} y={690} f={f} desde={k(104.4)} tam={46} ancla="middle" />
            <A {...act(PRIYA, 300, { ruta: [{ f: 0, x: 200, y: P }, { f: k(100.8), x: 330, y: P }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(100.8), v: "señalar" }, { f: k(103.2), v: "hablar" }], caras: [{ f: 0, v: "determinado" }, { f: k(103.2), v: "neutral" }], miradas: [{ f: 0, v: { x: 1, y: -0.3 } }], habla: [[k(99.6), k(105.0)]], luz: BORDE_FRIO })} />
          </>}
          hud={<><H l={[]} /><Txt t="AVOID THE WORST INBREEDING" a={k(102.6)} b={k(105.1) + 4} top={880} tam={48} chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

const p19b: PlanB = {
  a: 105.1, b: 110.4, trans: { tipo: "corte" },
  sfx: [[105.8, "popcluster", -6, { dur: 2.6 }], [106.1, "riser", -14, { dur: 2.2 }], [108.4, "sparkle", -8], [108.8, "chalk", -8, { dur: 1 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const n500 = Math.round(interpolate(f, [k(105.8), k(108.4)], [0, 500], cl));
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "ocaso", arbolitos: 0 }} seed={6202} mano={1.6}
          claves={[mira(0, 820, 540, 1.2), mira(k(108.4), 1100, 520, 0.95, { curva: "inout" }), mira(k(110.4), 1110, 520, 0.92, { curva: "inout" })]}
          medio={<>
            <Tablero19 k={k} n50={50} n500={n500} />
            <text x={770} y={360} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={80} fill="#ffd27a">~50</text>
            <Escrito t="~500" x={1400} y={225} f={f} desde={k(106.0)} tam={70} ancla="middle" color="#7ad08a" />
            <Escrito t="LONG RUN" x={1400} y={830} f={f} desde={k(108.8)} tam={46} ancla="middle" color="#7ad08a" />
            <A {...act(PRIYA, 330, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "señalar" }, { f: k(106.1), v: "agarrarAlto" }, { f: k(108.4), v: "manosCintura" }], caras: [{ f: 0, v: "determinado" }, { f: k(106.4), v: "sorpresa" }, { f: k(108.6), v: "feliz" }], miradas: [{ f: 0, v: { x: 1, y: -0.5 } }], habla: [[k(105.1), k(109.3)]], luz: BORDE_FRIO })} />
          </>}
          hud={<><H l={[]} /><Txt t="ENOUGH GENETIC VARIETY" a={k(107.0)} b={k(110.4) + 4} top={950} tam={44} chip color="#7ad08a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 20 · Priya mide con la regla gigante: es una guía, no una ley ============
const p20: PlanB = {
  a: 110.4, b: 117.7, trans: { tipo: "corte" },
  sfx: [[110.6, "snow_step", -10], [112.2, "cloth", -8], [113.0, "wood_hit", -6], [113.4, "tape", -8, { dur: 1.8 }], [115.4, "ding", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const larg = interpolate(f, [k(113.2), k(115.2)], [0, 1], cl);
      const marcas: [number, string, string][] = [[0.07, "10", "#ff8a6a"], [0.33, "50", "#ffd27a"], [0.52, "100", "#f6ecd2"], [0.96, "500", "#7ad08a"]];
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "ocaso", arbolitos: 0 }} seed={621} mano={2}
          claves={[mira(0, 820, 640, 1.2), mira(k(117.7), 1000, 650, 1.26, { curva: "inout" })]}
          medio={<>
            {Array.from({ length: 16 }).map((_, i) => <Figu key={i} x={1060 + i * 44} y={P - 60 - (i % 2) * 14} s={0.7} color={COLS[i % 9]} />)}
            <g transform={`translate(400,${P + 10})`}><rect x={0} y={-30} width={1300 * larg} height={30} fill="#f2c14a" stroke="#8a6a2a" strokeWidth={3} />{Array.from({ length: Math.floor(26 * larg) }).map((_, i) => <rect key={i} x={i * 50} y={-30} width={3} height={i % 2 ? 14 : 26} fill="#2a1c18" />)}
              {marcas.map(([u, t, c]) => larg >= u ? <g key={t}><rect x={1300 * u - 3} y={-60} width={6} height={60} fill={c} /><text x={1300 * u} y={-72} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={48} fill={c} stroke="#141018" strokeWidth={6} paintOrder="stroke">{t}</text></g> : null)}</g>
            <A {...act(PRIYA, 360, { ruta: [{ f: 0, x: 220, y: P }, { f: k(111.6), x: 360, y: P }], poses: [{ f: 0, v: "parado" }, { f: k(111.9), v: "encogerse" }, { f: k(113.0), v: "agacharse" }, { f: k(115.4), v: "señalar" }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "determinado" }, { f: k(111.9), v: "picaro" }, { f: k(113.0), v: "determinado" }, { f: k(115.4), v: "feliz" }], habla: [[k(110.4), k(117.6)]], luz: BORDE_FRIO })} />
          </>}
          hud={<><H /><Txt t="A GUIDELINE, NOT A LAW" a={k(111.0)} b={k(114.4)} top={200} tam={54} mano chip color={AMBAR} /><Txt t="A FEELING FOR THE SCALE" a={k(115.4)} b={k(117.7) + 4} top={200} tam={54} mano chip color="#7ad08a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 21 · 10 lejos de la marca 50; 100 apenas la pasan; «Barely.» ============
const p21: PlanB = {
  a: 117.7, b: 122.8, trans: { tipo: "corte" },
  sfx: [[117.8, "tick", -4], [118.6, "fail", -12], [119.8, "swish", -8], [120.7, "ding", -8], [121.5, "spring", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const gx = (v: number) => 260 + Math.log10(v) / 3 * 1400;
      const cien = f > k(119.8);
      const mx = cien ? interpolate(f, [k(119.8), k(120.7)], [gx(10), gx(100)], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) }) + (f > k(121.4) ? Math.sin(f * 1.4) * 7 : 0) : gx(10);
      const col = cien ? AMBAR : "#ff6a5a";
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "ocaso", arbolitos: 0 }} seed={622} mano={2}
          claves={[mira(0, 960, 560, 1.0), mira(k(122.8), 980, 560, 1.06, { curva: "inout" })]}
          medio={<>
            <rect x={240} y={430} width={1440} height={230} rx={22} fill="#141018" opacity={0.82} />
            <rect x={260} y={500} width={gx(50) - 260} height={44} fill="#8a2a24" /><rect x={gx(50)} y={500} width={gx(500) - gx(50)} height={44} fill="#b08a2a" /><rect x={gx(500)} y={500} width={1660 - gx(500)} height={44} fill="#3a8a4a" />
            <rect x={260} y={500} width={1400} height={44} rx={8} fill="none" stroke="#f6ecd2" strokeWidth={4} />
            {[[10, "10"], [50, "50"], [100, "100"], [500, "500"]].map(([v, t]) => <g key={t as string}><rect x={gx(v as number) - 3} y={490} width={6} height={64} fill="#f6ecd2" /><text x={gx(v as number)} y={612} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={46} fill={(v as number) === 50 ? "#ff8a6a" : "#f6ecd2"}>{t}</text></g>)}
            <g transform={`translate(${mx},0)`}><path d="M-26,456 L26,456 L0,496 Z" fill={col} stroke="#141018" strokeWidth={4} /><text y={446} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={64} fill={col} stroke="#141018" strokeWidth={8} paintOrder="stroke">{cien ? "100" : "10"}</text></g>
            {!cien && DIEZ.map((l, i) => <A key={i} {...act(l, 300 + i * 70, { escala: 0.6, dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "duda" }, { f: k(118.6), v: "triste" }], miradas: [{ f: 0, v: { x: 1, y: -0.6 } }], seed: 30 + i, luz: BORDE_FRIO })} />)}
            {cien && Array.from({ length: 100 }).map((_, i) => <Figu key={i} x={420 + (i % 50) * 26 + (Math.floor(i / 50) ? 13 : 0)} y={P - 40 + Math.floor(i / 50) * 36} s={0.42} color={COLS[i % 9]} />)}
          </>}
          hud={<><H />
            {!cien && <Txt t="FAR BELOW 50" a={k(118.2)} b={k(119.8)} top={200} tam={58} mano chip color="#ff8a6a" />}
            {f > k(121.5) && <Mano t="BARELY." x={960} y={250} desde={k(121.6)} tam={120} />}</>} />
      );
    };
    return <Pl />;
  },
};
const F_FUENTE = "Arial Black, Arial";

// ============ 22 · la versión con esperanza: amanece, Nan da vuelta la página ============
const p22: PlanB = {
  a: 122.8, b: 127.0, trans: { tipo: "luz", d: 12 },
  sfx: [[122.9, "step", -10], [123.4, "creak", -6], [123.6, "birds", -14, { dur: 3.2 }], [124.6, "wind_soft", -18]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const sol = interpolate(f, [k(123.3), k(124.6)], [0.15, 0.95], cl);
      return (
        <Escena Set={GranjaLiving} pal={PAL} setProps={{ hora: "alba", farol: 0, sol }} seed={623} mano={2}
          claves={[mira(0, L.ventana - 160, 600, 1.45), mira(k(127.0), L.ventana - 100, 600, 1.55, { curva: "inout" })]}
          medio={<A {...act(JUNE, L.ventana - 300, { ruta: [{ f: 0, x: L.ventana - 360, y: P }, { f: k(123.2), x: L.ventana - 200, y: P }], dir: [{ f: 0, v: 1 }, { f: k(124.8), v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(123.3), v: "agarrarAlto" }, { f: k(124.8), v: "celebrar" }], caras: [{ f: 0, v: "neutral" }, { f: k(123.6), v: "sorpresa" }, { f: k(124.6), v: "feliz" }], luz: BORDE_CALIDO })} />}
          hud={<><H /><Txt t="THE HOPEFUL VERSION" a={k(123.2)} b={k(127.0) + 4} top={200} tam={56} chip color="#7ad08a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 23 · Pitcairn, 1790: el Bounty, menos de 30 ============
const p23: PlanB = {
  a: 127.0, b: 132.9, trans: { tipo: "fundido", d: 12 },
  sfx: [[127.1, "waves", -14, { dur: 6 }], [129.3, "tick", -6], [130.6, "creak", -10, { dur: 2.4 }], [131.6, "ship_horn", -18]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const bx = interpolate(f, [0, k(132.9)], [3200, 2620], cl);
      return (
        <Escena Set={IslaLejana} pal={PAL} setProps={{ tipo: "pitcairn" }} seed={624} mano={2}
          claves={[mira(0, 2350, 640, 1.05), mira(k(132.9), 2250, 660, 1.2, { curva: "inout" })]}
          medio={<g><Velero x={bx} y={P + 20 + Math.sin(f / 14) * 6} s={1.15} />
            {[0, 1, 2].map((i) => <Figu key={i} x={bx - 90 + i * 70} y={P - 40 + Math.sin(f / 14) * 6} s={0.55} color={["#efe6d2", "#2f5a7a", "#efe6d2"][i]} />)}</g>}
          hud={<><H l={[anio([{ f: 0, v: 1700 }, { f: k(129.3), v: 1790, d: 30 }], k(129.1))]} /><Txt t="PITCAIRN ISLAND · PACIFIC" a={k(127.3)} b={k(129.6)} top={880} tam={48} chip /><Txt t="HMS BOUNTY · MUTINEERS" a={k(131.0)} b={k(132.9) + 4} top={880} tam={48} chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

const p23b: PlanB = {
  a: 132.9, b: 137.4, trans: { tipo: "corte" },
  sfx: [[133.0, "waves", -16, { dur: 4.4 }], [133.2, "row", -12, { dur: 1.6 }], [134.4, "floor_step", -12], [134.9, "floor_step", -12], [135.8, "tick", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={IslaLejana} pal={PAL} setProps={{ tipo: "pitcairn" }} seed={6242} mano={2}
          claves={[mira(0, 1640, 650, 1.35), mira(k(137.4), 1560, 660, 1.45, { curva: "inout" })]}
          medio={<>{[0, 1, 2, 3, 4, 5].map((i) => <A key={i} {...act(ISLENO(20 + i), 2100, { escala: 1.0, ruta: [{ f: 0, x: 2150 + i * 40, y: P }, { f: k(133.2) + i * 6, x: 2150 + i * 40, y: P }, { f: k(135.6) + i * 6, x: 1260 + i * 120, y: P }], dir: [{ f: 0, v: -1 }, { f: k(135.8) + i * 6, v: i % 2 ? -1 : 1 }], poses: [{ f: 0, v: "parado" }, { f: k(135.8) + i * 6, v: (["saludar", "manosCintura", "señalar", "celebrar", "parado", "pensar"] as const)[i] }], caras: [{ f: 0, v: "determinado" }, { f: k(135.8), v: i % 3 ? "feliz" : "sorpresa" }], seed: 70 + i })} />)}</>}
          hud={<><H l={[anio(1790), { id: "bounty", et: "SETTLERS", v: [{ f: 0, v: 0 }, { f: k(134.0), v: 27, d: 40 }], fmt: (n) => `${Math.round(n)}`, color: AMBAR, ent: k(133.4) }]} />
            <Mano t="FEWER THAN 30" x={960} y={240} desde={k(135.6)} tam={100} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 24 · hoy: sus descendientes siguen ahí (y en Norfolk) ============
const p24: PlanB = {
  a: 137.4, b: 142.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[137.5, "waves", -20, { dur: 4.5 }], [137.6, "door", -10], [138.6, "tick", -6], [139.6, "pencil", -8, { dur: 1 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const u = interpolate(f, [k(139.6), k(140.6)], [0, 1], cl);
      const om = interpolate(f, [k(139.3), k(139.6)], [0, 1], cl);
      return (
        <Escena Set={IslaLejana} pal={PAL} setProps={{ tipo: "hoy", casitas: 1 }} seed={625} mano={2}
          claves={[mira(0, 1000, 660, 1.4), mira(k(142.0), 1060, 660, 1.48, { curva: "inout" })]}
          medio={<>{[NAN, ISLENO(31), LILY].map((l, i) => <A key={i} {...act(l, 900, { escala: i === 2 ? 0.8 : 1, ruta: [{ f: 0, x: 760, y: P }, { f: k(137.6) + i * 8, x: 760, y: P }, { f: k(139.4) + i * 8, x: 700 + i * 170, y: P }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(139.6), v: i === 2 ? "saludar" : "parado" }], caras: [{ f: 0, v: "feliz" }], opacidad: (ff) => interpolate(ff, [k(137.6) + i * 8, k(137.6) + i * 8 + 5], [0, 1], cl), seed: 80 + i })} />)}</>}
          hud={<><H l={[anio([{ f: 0, v: 1790 }, { f: k(138.6), v: 2025, d: 30 }])]} />
            <svg width={1920} height={1080} style={{ position: "absolute" }} opacity={om}>
              <rect x={1260} y={150} width={600} height={360} rx={18} fill="#0f2a3a" stroke="#f6ecd2" strokeWidth={4} />
              <circle cx={1700} cy={420} r={14} fill={AMBAR} /><text x={1700} y={470} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={34} fill="#f6ecd2">PITCAIRN</text>
              <circle cx={1380} cy={250} r={14} fill="#7ad08a" opacity={u >= 1 ? 1 : 0.3} /><text x={1400} y={215} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={34} fill="#f6ecd2">NORFOLK</text>
              <path d="M1700,420 Q1560,250 1380,250" fill="none" stroke={AMBAR} strokeWidth={6} strokeDasharray="14 10" pathLength={1} strokeDashoffset={0} style={{ strokeDasharray: `${u} 1` }} />
            </svg>
            <Txt t="THEIR DESCENDANTS STILL LIVE THERE" a={k(137.8)} b={k(142.0) + 4} top={880} tam={50} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 25 · Tristan da Cunha, principios de 1800 ============
const p25: PlanB = {
  a: 142.0, b: 145.8, trans: { tipo: "fundido", d: 10 },
  sfx: [[142.1, "wind_cold", -16, { dur: 3.6 }], [142.6, "radio_ping", -8], [143.8, "whoosh", -12], [144.6, "ding", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const z = interpolate(f, [0, k(145.8)], [1, 1.25], { ...cl, easing: (t) => t * t * (3 - 2 * t) });
      const r = interpolate(f, [k(143.6), k(144.8)], [0, 330], cl);
      return (
        <AbsoluteFill style={{ background: "#0f2a44" }}>
          <svg width={1920} height={1080}>
            <g transform={`translate(960,560) scale(${z}) translate(-960,-560)`}>
              <path d="M180,90 C330,60 470,140 520,260 C560,380 520,470 470,560 C430,650 380,760 330,900 C300,980 260,1040 230,1080 L0,1080 L0,90 Z" fill="#4a7a4a" stroke="#2a4a2a" strokeWidth={6} />
              <path d="M1340,60 C1500,40 1720,120 1800,260 C1860,380 1790,470 1740,560 C1700,660 1680,780 1600,900 C1560,960 1520,1000 1480,1000 C1440,940 1420,860 1400,760 C1380,640 1300,560 1260,440 C1220,320 1240,140 1340,60 Z" fill="#8a7a4a" stroke="#5a4a2a" strokeWidth={6} />
              <circle cx={960} cy={720} r={r} fill="none" stroke="#f6ecd2" strokeWidth={4} strokeDasharray="14 12" opacity={0.7} />
              <circle cx={960} cy={720} r={16 + Math.sin(f / 5) * 3} fill="#ff6a5a" stroke="#141018" strokeWidth={5} />
              <text x={960} y={680} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={50} fill="#f6ecd2" stroke="#141018" strokeWidth={6} paintOrder="stroke">TRISTAN DA CUNHA</text>
              {f > k(144.6) && <text x={960} y={800} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={40} fill="#ffd27a" stroke="#141018" strokeWidth={6} paintOrder="stroke">~2,400 KM TO THE NEAREST LAND</text>}
            </g>
          </svg>
          <H l={[anio(2025)]} />
          <Txt t="ONE OF THE MOST REMOTE ISLANDS ON EARTH" a={k(143.3)} b={k(145.8) + 4} top={960} tam={44} chip />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

const p25b: PlanB = {
  a: 145.8, b: 149.0, trans: { tipo: "corte" },
  sfx: [[145.9, "wind_cold", -14, { dur: 3 }], [146.2, "tick", -6], [146.8, "hammer", -6], [147.4, "hammer", -6], [148.0, "hammer", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const est = interpolate(f, [k(146.8), k(148.2)], [0, 1], cl);
      return (
        <Escena Set={IslaLejana} pal={PAL} setProps={{ tipo: "tristan" }} seed={626} mano={2}
          claves={[mira(0, 1150, 660, 1.5), mira(k(149.0), 1150, 670, 1.6, { curva: "inout" })]}
          medio={<>
            <rect x={1180} y={P - 150 + est * 60} width={20} height={150 - est * 60} fill="#7a5230" stroke="#3a2418" strokeWidth={3} />
            <A {...act(ISLENO(40), 1080, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "agacharse" }, { f: k(146.8), v: "tirarCarga" }, { f: k(147.1), v: "agacharse" }, { f: k(147.4), v: "tirarCarga" }, { f: k(147.7), v: "agacharse" }, { f: k(148.0), v: "tirarCarga" }], caras: [{ f: 0, v: "determinado" }], luz: BORDE_FRIO })} />
            <A {...act(ISLENO(41), 1420, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "brazosCruzados" }, { f: k(148.3), v: "celebrar" }], caras: [{ f: 0, v: "cansado" }, { f: k(148.3), v: "feliz" }], luz: BORDE_FRIO })} />
            <A {...act(ISLENO(42), 820, { escala: 0.9, dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(148.3), v: "saludar" }], caras: [{ f: 0, v: "neutral" }, { f: k(148.3), v: "feliz" }], luz: BORDE_FRIO })} />
          </>}
          hud={<><H l={[anio([{ f: 0, v: 2025 }, { f: k(146.2), v: 1816, d: 30 }], k(146.0))]} /><Txt t="SETTLED BY A TINY GROUP" a={k(146.2)} b={k(149.0) + 4} top={200} tam={50} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 26 · el árbol de 7 fundadores que se ensancha a ~250 ============
const p26: PlanB = {
  a: 149.0, b: 154.5, trans: { tipo: "corte" },
  sfx: [[149.1, "pop", -8], [149.6, "chalk", -6, { dur: 3 }], [152.6, "tick", -6], [153.4, "tick", -4]],
  el: (k) => (
    <Escena Set={Mural} pal={PAL} setProps={{ tono: "#1e2a30" }} seed={627} mano={1.6}
      claves={[mira(0, 960, 360, 1.35), mira(k(150.6), 960, 380, 1.3, { curva: "inout" }), mira(k(154.5), 960, 540, 0.86, { curva: "inout" })]}
      detras={<ArbolFam desde={1} gens={4} paso={30} raiz={7} ancho={2.2} />}
      hud={<><H l={[{ id: "tristan", et: "TRISTAN", v: [{ f: 0, v: 7 }, { f: k(149.6), v: 250, d: 60 }], fmt: (n) => `~${Math.round(n)}`, color: "#f6ecd2", ent: 2 }]} /><Txt t="7 FOUNDERS → A COUPLE HUNDRED" a={k(151.2)} b={k(154.5) + 4} top={950} tam={48} chip /></>} />
  ),
};

// ============ 27 · lo que tenían y la isla no: barcos, visitas, genes nuevos ============
const p27: PlanB = {
  a: 154.5, b: 159.5, trans: { tipo: "fundido", d: 10 },
  sfx: [[154.6, "waves", -16, { dur: 5 }], [155.0, "wind_soft", -20, { dur: 4 }], [157.6, "drone", -12, { dur: 1.8 }]],
  el: (k) => (
    <Escena Set={IslaLejana} pal={PAL} setProps={{ tipo: "tristan", casitas: 0.6 }} seed={628} mano={2}
      claves={[mira(0, 1300, 660, 1.3), mira(k(159.5), 1500, 660, 1.4, { curva: "inout" })]}
      medio={<>{[0, 1, 2, 3].map((i) => <A key={i} {...act(ISLENO(44 + i), 1100 + i * 150, { escala: i === 3 ? 0.8 : 1, dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(156.5) + i * 4, v: (["brazosCruzados", "pensar", "manosCintura", "parado"] as const)[i] }], caras: [{ f: 0, v: "neutral" }, { f: k(157.2), v: "duda" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }], seed: 90 + i, luz: BORDE_FRIO })} />)}</>}
      hud={<><H /><Txt t="SMALL GROUPS HAVE SURVIVED" a={k(154.8)} b={k(157.2)} top={200} tam={50} chip /><Txt t="BUT THEY HAD SOMETHING…" a={k(157.4)} b={k(159.5) + 4} top={200} tam={50} chip color={AMBAR} /></>} />
  ),
};

const p27b: PlanB = {
  a: 159.5, b: 164.8, trans: { tipo: "corte" },
  sfx: [[159.5, "ship_horn", -8], [160.5, "row", -12, { dur: 1.4 }], [161.6, "wood_step", -12], [162.2, "wood_step", -12], [162.6, "laugh", -16], [163.8, "sparkle", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const nuevo = interpolate(f, [k(163.6), k(164.0)], [0, 1], cl);
      return (
        <Escena Set={IslaLejana} pal={PAL} setProps={{ tipo: "tristan", casitas: 0.6, barco: interpolate(f, [0, k(160.6)], [0.4, 1], cl) }} seed={6282} mano={2}
          claves={[mira(0, 2150, 640, 1.15), mira(k(160.6), 2000, 650, 1.25, { curva: "inout" }), mira(k(164.8), 1820, 650, 1.35, { curva: "inout" })]}
          medio={<>
            <A {...act(ISLENO(44), 1600, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(162.4), v: "saludar" }], caras: [{ f: 0, v: "duda" }, { f: k(162.4), v: "feliz" }], seed: 90, luz: BORDE_FRIO })} />
            <A {...act({ ...CIENTIFICO, accesorios: [{ t: "gorroLana", color: "#3a6ab0" }] }, 2300, { ruta: [{ f: 0, x: 2380, y: P }, { f: k(160.6), x: 2380, y: P }, { f: k(162.4), x: 1840, y: P }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(162.4), v: "saludar" }], caras: [{ f: 0, v: "feliz" }], luz: BORDE_FRIO })} />
            <g transform={`translate(1720,${P - 470}) scale(1.6)`}>
              <Cabecita x={-120} y={0} c={COLS[1]} u={1} /><Cabecita x={0} y={0} c={COLS[2]} u={1} /><Cabecita x={120} y={0} c={AMBAR} u={nuevo} />
              {nuevo > 0 && <text x={120} y={-50} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={36} fill={AMBAR} stroke="#141018" strokeWidth={5} paintOrder="stroke" opacity={nuevo}>NEW</text>}
            </g>
          </>}
          hud={<><H />
            <Mano t="SHIPS." x={960} y={250} desde={k(159.5)} hasta={k(160.6)} tam={130} />
            <Txt t="VISITORS · NEW GENES" a={k(160.6)} b={k(164.8) + 4} top={900} tam={54} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 28 · «There are no more ships.» el muelle vacío, el ferry oxidado ============
const p28: PlanB = {
  a: 164.8, b: 166.5, trans: { tipo: "corte" },
  sfx: [[164.9, "waves", -10, { dur: 1.6 }], [165.4, "boom", -14]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno", nieve: false }} seed={629} mano={1.4}
          claves={[mira(0, -260, 640, 1.35), mira(k(166.5), -250, 645, 1.4, { curva: "inout" })]}
          medio={<>
            <g opacity={interpolate(f, [k(164.9), k(166.0)], [0.8, 0], cl)}><Velero x={-900} y={P - 120} s={0.45} /></g>
            <A {...act(ABBY, 40, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(165.5), v: "brazosCruzados" }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }], luz: BORDE_FRIO })} />
          </>}
          hud={<><H /><Txt t="NO MORE SHIPS" a={k(165.0)} b={k(166.5) + 4} top={200} tam={62} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 29 · la iglesia por dentro: «They make a plan.» · entra el Dr. Halvorsen ============
const fieles = (k: (s: number) => number, extra = 0) => Array.from({ length: 16 }).map((_, i) => <A key={i} {...act(ISLENO(i + extra), 650 + (i % 8) * 220 + Math.floor(i / 8) * 90, { asiento: [{ f: 0, v: 70 }], poses: [{ f: 0, v: "sentado" }], escala: Math.floor(i / 8) ? 0.82 : 0.9, dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }], seed: 60 + i })} />);
const p29: PlanB = {
  a: 166.5, b: 174.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[166.6, "cloth", -28, { dur: 3 }], [168.0, "chalk", -6, { dur: 1.6 }], [169.9, "door", -8], [171.2, "wood_step", -12], [171.6, "wood_step", -12], [172.6, "cloth", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const doc = f > k(169.9);
      return (
        <Escena Set={IglesiaDentro} pal={PAL} setProps={{ plan: interpolate(f, [k(168.0), k(169.4)], [0, 1], cl) }} seed={630} mano={2}
          claves={doc ? [mira(0, IG_PUNTOS.puerta + 300, 560, 1.4), mira(k(174.0), IG_PUNTOS.puerta + 400, 560, 1.6, { curva: "inout" })] : [mira(0, 1500, 560, 0.75), mira(k(169.9), 2000, 560, 0.85, { curva: "inout" })]}
          medio={<>
            {fieles(k)}
            <A {...act(ABBY_ADENTRO, IG_PUNTOS.pizarra - 260, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(168.0), v: { hD: 120, cD: 40, tronco: 8 } }, { f: k(169.4), v: "manosCintura" }], caras: [{ f: 0, v: "determinado" }] })} />
            <A {...act(HALVORSEN, IG_PUNTOS.puerta, { ruta: [{ f: k(169.9), x: IG_PUNTOS.puerta, y: P }, { f: k(172.2), x: IG_PUNTOS.puerta + 380, y: P }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(172.4), v: "saludar" }], caras: [{ f: 0, v: "feliz" }], enManoI: <g><rect x={-34} y={0} width={68} height={50} rx={6} fill="#5a3020" stroke="#2a1410" strokeWidth={4} /><rect x={-12} y={-12} width={24} height={14} rx={4} fill="none" stroke="#2a1410" strokeWidth={4} /></g>, opacidad: (ff) => ff > k(169.9) ? 1 : 0 })} />
          </>}
          frente={<Bancos x0={650} n={8} />}
          hud={<><H /><Txt t="DR. HALVORSEN · RETIRED · ASHLAND" a={k(171.0)} b={k(174.0) + 4} top={200} tam={48} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 30 · Gus: «no relation» (revolea los ojos) ============
const p30: PlanB = {
  a: 174.0, b: 177.4, trans: { tipo: "corte" },
  sfx: [[174.1, "static", -20, { dur: 3 }], [175.4, "breath", -8], [176.0, "cloth", -8]],
  el: (k) => (
    <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 1, aguja: 0.62, lampara: 0.8 }} seed={631} mano={2}
      claves={[mira(0, RG_PUNTOS.silla + 140, 700, 1.45), mira(k(177.4), RG_PUNTOS.silla + 120, 700, 1.55, { curva: "inout" })]}
      medio={<A {...act(GUS_RADIO, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 30, cD: 50, hI: 25, cI: 50 } }, { f: k(175.8), v: "brazosCruzados" }], caras: [{ f: 0, v: "neutral" }, { f: k(174.6), v: "sorpresa" }, { f: k(175.3), v: "enojo" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }, { f: k(175.0), v: { x: 0, y: -1 } }, { f: k(175.8), v: { x: -1, y: 0 } }], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 } })} />}
      hud={<><H /><Txt t="NO RELATION." a={k(174.4)} b={k(177.4) + 4} top={200} tam={66} mano chip color={AMBAR} /><Txt t="(VERY ANNOYING)" a={k(175.9)} b={k(177.4) + 4} top={300} tam={44} chip color="#ff8a6a" /></>} />
  ),
};

// ============ 31 · el registro de familias: tarjetas e hilos ============
const p31: PlanB = {
  a: 177.4, b: 183.7, trans: { tipo: "corte" },
  sfx: [[177.6, "page", -8], [178.6, "stamp", -8], [179.6, "stamp", -8], [180.6, "pencil", -10, { dur: 1.4 }], [181.6, "stamp", -8], [182.6, "stamp", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={IglesiaDentro} pal={PAL} setProps={{ plan: 1, tarjetas: interpolate(f, [k(177.6), k(180.0)], [0.3, 1], cl), hilos: interpolate(f, [k(180.0), k(183.6)], [0, 1], cl) }} seed={632} mano={2}
          claves={[mira(0, IG_PUNTOS.tablero - 180, 600, 1.4), mira(k(183.7), IG_PUNTOS.tablero - 120, 590, 1.5, { curva: "inout" })]}
          medio={<A {...act(HALVORSEN, IG_PUNTOS.tablero - 420, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { hD: 70, cD: 60, hI: 60, cI: 70 } }, { f: k(180.0), v: { hD: 130, cD: 20 } }, { f: k(181.4), v: "señalar" }, { f: k(182.2), v: { hD: 130, cD: 20 } }, { f: k(182.8), v: "señalar" }], caras: [{ f: 0, v: "determinado" }, { f: k(182.8), v: "feliz" }], enManoI: <g transform="scale(1.2)"><Libro /></g> })} />}
          hud={<><H /><Txt t="CAREFUL FAMILY RECORDS" a={k(178.2)} b={k(179.9)} top={200} tam={52} chip /><Txt t="WHO IS RELATED TO WHOM" a={k(179.9)} b={k(181.4)} top={200} tam={52} chip color={AMBAR} /><Txt t="SIBLINGS · COUSINS · PARENTS" a={k(181.4)} b={k(183.7) + 4} top={200} tam={52} chip color="#7ad08a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 32 · la herramienta más importante no es un tractor: es un cuaderno ============
const p32: PlanB = {
  a: 183.7, b: 189.8, trans: { tipo: "fundido", d: 10 },
  sfx: [[183.8, "wind_soft", -20, { dur: 5 }], [185.0, "metal", -10], [187.6, "creak", -8], [188.3, "drop", -4], [188.5, "wood_hit", -4], [188.7, "sparkle", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const X0 = GRANJA_PUNTOS.granero + 300;
      const tr = interpolate(f, [k(184.6), k(185.4)], [0, 1], cl);
      const cae = interpolate(f, [k(188.0), k(188.4)], [0, 1], { ...cl, easing: (t) => t * t });
      const ang = f < k(188.4) ? -14 * tr : interpolate(f, [k(188.4), k(188.8), k(189.1), k(189.4)], [-14, 22, 15, 18], cl);
      const L2 = 380, Y0 = P - 430;
      const rad = (ang * Math.PI) / 180;
      const pi = { x: X0 - L2 * Math.cos(rad), y: Y0 - L2 * Math.sin(rad) };
      const pd = { x: X0 + L2 * Math.cos(rad), y: Y0 + L2 * Math.sin(rad) };
      const Plato: React.FC<{ x: number; y: number; children?: React.ReactNode }> = ({ x, y, children }) => (
        <g><line x1={x} y1={y} x2={x - 120} y2={y + 160} stroke="#2a1c18" strokeWidth={4} /><line x1={x} y1={y} x2={x + 120} y2={y + 160} stroke="#2a1c18" strokeWidth={4} />
          <path d={`M${x - 150},${y + 160} L${x + 150},${y + 160} L${x + 110},${y + 190} L${x - 110},${y + 190} Z`} fill="#b08a3a" stroke="#5a4020" strokeWidth={5} />
          <g transform={`translate(${x},${y + 160})`}>{children}</g></g>
      );
      return (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "ocaso", estacion: "invierno" }} seed={633} mano={2}
          claves={[mira(0, X0 + 120, 620, 1.2), mira(k(189.8), X0 + 160, 610, 1.26, { curva: "inout" })]}
          medio={<>
            <path d={`M${X0 - 120},${P} L${X0 + 120},${P} L${X0 + 20},${Y0} L${X0 - 20},${Y0} Z`} fill="#6a4a2a" stroke="#3a2418" strokeWidth={5} />
            <line x1={pi.x} y1={pi.y} x2={pd.x} y2={pd.y} stroke="#4a3220" strokeWidth={18} strokeLinecap="round" />
            <circle cx={X0} cy={Y0} r={18} fill={AMBAR} stroke="#3a2418" strokeWidth={5} />
            <Plato x={pi.x} y={pi.y}>{tr > 0 && <g opacity={tr}><Tractor x={0} y={0} f={f} s={0.32} /></g>}</Plato>
            <Plato x={pd.x} y={pd.y}>{cae > 0 && <g transform={`translate(0,${(cae - 1) * 500})`}><Halo x={0} y={-40} r={200} color={AMBAR} fuerza={0.5 * cae} /><CuadernoCenso y={-46} s={0.9} rot={-6} /></g>}</Plato>
            <A {...act(JUNE, X0 + 760, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "brazosCruzados" }, { f: k(187.6), v: "encogerse" }, { f: k(188.6), v: "señalar" }], caras: [{ f: 0, v: "neutral" }, { f: k(187.6), v: "duda" }, { f: k(188.6), v: "feliz" }], luz: BORDE_CALIDO })} />
          </>}
          hud={<><H /><Txt t="THE MOST IMPORTANT TOOL?" a={k(184.0)} b={k(187.2)} top={200} tam={56} chip /><Txt t="NOT A TRACTOR" a={k(187.4)} b={k(188.3)} top={200} tam={60} mano chip color="#cfd8ff" /><Txt t="A NOTEBOOK" a={k(188.4)} b={k(189.8) + 4} top={200} tam={70} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 33 · Gus lee en voz alta; June levanta el cuaderno rojo ============
const p33: PlanB = {
  a: 189.8, b: 195.0, trans: { tipo: "corte" },
  sfx: [[189.9, "paper", -8], [192.4, "cloth", -8], [192.8, "sparkle", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const jun = f > k(192.4);
      return (
        <Escena Set={GranjaLiving} pal={PAL} setProps={{ hora: "noche", farol: 1 }} seed={634} mano={2}
          claves={jun ? [mira(0, L.mesa - 280, 640, 1.45), mira(k(195.0), L.mesa - 280, 630, 1.55, { curva: "inout" })] : [mira(0, L.mesa, 600, 1.0), mira(k(192.4), L.mesa + 80, 600, 1.15, { curva: "inout" })]}
          medio={<>
            <A {...act(GUS, L.mesa + 100, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 110, cD: 60, hI: 100, cI: 60 } }], caras: [{ f: 0, v: "determinado" }], habla: [[k(190.0), k(192.4)]], enManoD: <rect x={-40} y={-60} width={80} height={100} fill="#f2ead8" /> })} />
            {DIEZ.filter((l) => l !== GUS && l !== JUNE).map((l, i) => <A key={i} {...act(l, L.mesa - 600 + i * 90 + (i > 3 ? 900 : 0), { asiento: [{ f: 0, v: l.alto ? 40 : 60 }], poses: [{ f: 0, v: "sentado" }], dir: [{ f: 0, v: i > 3 ? -1 : 1 }], caras: [{ f: 0, v: "neutral" }], seed: 30 + i })} />)}
            <A {...act(JUNE, L.mesa - 300, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(192.4), v: "celular" }, { f: k(193.6), v: "celebrar" }], caras: [{ f: 0, v: "neutral" }, { f: k(192.6), v: "feliz" }], enManoD: (ff: number) => ff > k(192.4) ? <g transform="scale(0.55) rotate(-10)"><CuadernoCenso /></g> : null })} />
          </>}
          hud={<H />} />
      );
    };
    return <Pl />;
  },
};

// ============ 34 · la comida: la isla en invierno; tierra fina sobre roca ============
const Suelo: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useF();
  const u = interpolate(f, [desde, desde + 16], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#2a2622" }}>
      <svg width={1920} height={1080}>
        <rect x={0} y={0} width={1920} height={420} fill="#9ab0c8" />
        {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${100 + i * 190},420 l0,-${60 + (i % 3) * 30}`} stroke="#3f6a3a" strokeWidth={10} />)}
        <rect x={0} y={420} width={1920} height={70 * u} fill="#6a4a2a" />
        <rect x={0} y={420 + 70 * u} width={1920} height={700} fill="#6a6a70" />
        {Array.from({ length: 24 }).map((_, i) => <ellipse key={i} cx={(i * 211) % 1920} cy={560 + (i % 4) * 120} rx={90} ry={40} fill="#5a5a62" />)}
        <text x={1500} y={470} fontFamily={F_FUENTE} fontWeight={900} fontSize={36} fill="#f2ead8" opacity={u}>THIN SOIL</text>
        <text x={1500} y={720} fontFamily={F_FUENTE} fontWeight={900} fontSize={36} fill="#c8c8d0" opacity={u}>ROCK</text>
      </svg>
    </AbsoluteFill>
  );
};
const p34: PlanB = {
  a: 195.0, b: 198.7, trans: { tipo: "fundido", d: 10 },
  sfx: [[195.1, "wind_cold", -14, { dur: 3.6 }], [196.4, "cart", -12, { dur: 1.2 }], [197.8, "tick", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const x = ISLA_PUNTOS.casas;
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno" }} seed={635} mano={2}
          claves={[mira(0, x, 640, 1.3), mira(k(198.7), x + 60, 640, 1.38, { curva: "inout" })]}
          medio={<>{[0, 1, 2, 3].map((i) => <A key={i} {...act(ISLENO(50 + i), x - 330 + i * 210, { escala: i === 3 ? 0.8 : 1, dir: [{ f: 0, v: i < 2 ? 1 : -1 }], poses: [{ f: 0, v: "parado" }, { f: k(196.4) + i * 4, v: (["encogerse", "manosCara", "brazosCruzados", "pensar"] as const)[i] }], caras: [{ f: 0, v: "neutral" }, { f: k(197.8), v: i % 2 ? "triste" : "duda" }], enManoD: i === 0 ? <g><path d="M-36,0 L36,0 L28,44 L-28,44 Z" fill="#a8845a" stroke="#5a4020" strokeWidth={4} /><path d="M-30,0 Q0,-40 30,0" fill="none" stroke="#5a4020" strokeWidth={4} /></g> : undefined, seed: 100 + i, luz: BORDE_FRIO })} />)}</>}
          hud={<><H /><Txt t="FOOD" a={k(197.6)} b={k(198.7) + 4} top={200} tam={80} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

const p34b: PlanB = {
  a: 198.7, b: 202.5, trans: { tipo: "corte" },
  sfx: [[198.8, "wind_soft", -18, { dur: 3.6 }], [199.6, "step", -10], [200.4, "metal_tool", -8], [201.6, "metal", -2], [201.7, "punch", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = ISLA_PUNTOS.casas + 600;
      const golpe2 = f > k(201.6);
      const polvo = interpolate(f, [k(201.6), k(202.4)], [0, 1], cl);
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno" }} seed={6352} mano={2}
          claves={[mira(0, x + 40, 760, 1.4), mira(k(202.5), x + 40, 770, 1.5, { curva: "inout" })]}
          medio={<>
            <rect x={x - 700} y={P} width={1400} height={34} fill="#5a3a22" /><rect x={x - 700} y={P + 34} width={1400} height={420} fill="#6a6a70" />
            {Array.from({ length: 12 }).map((_, i) => <ellipse key={i} cx={x - 640 + i * 118} cy={P + 110 + (i % 3) * 90} rx={70} ry={34} fill="#55555e" />)}
            <text x={x + 380} y={P + 26} fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={30} fill="#f2ead8">THIN SOIL</text>
            <text x={x + 380} y={P + 160} fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={30} fill="#d8d8e0">ROCK</text>
            <A {...act(ISLENO(51), x - 120, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(199.6), v: "empujar" }, { f: k(200.4), v: "agacharse" }, { f: k(201.0), v: "empujar" }, { f: k(201.6), v: "agacharse" }, { f: k(202.0), v: "manosCintura" }], caras: [{ f: 0, v: "determinado" }, { f: k(201.7), v: "enojo" }], enManoD: <g transform="rotate(30)"><rect x={-5} y={-10} width={10} height={170} fill="#7a5230" /><path d="M-28,160 L28,160 L22,215 L0,228 L-22,215 Z" fill="#9aa0a8" stroke="#3a3a44" strokeWidth={3} /></g>, luz: BORDE_FRIO })} />
            {golpe2 && Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={x + 20 + Math.cos(i) * 90 * polvo} cy={P - 10 - Math.abs(Math.sin(i * 1.7)) * 80 * polvo} r={14 * (1 - polvo) + 4} fill="#c8b8a0" opacity={1 - polvo} />)}
          </>}
          hud={<><H /><Txt t="BEAUTIFUL · BUT SMALL" a={k(199.0)} b={k(201.0)} top={200} tam={52} chip /><Txt t="THE SOIL IS THIN" a={k(201.4)} b={k(202.5) + 4} top={200} tam={56} mano chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 35 · el almacén vacío para Navidad (DAY 83) ============
const Guirnalda: React.FC<{ x: number; y: number; w: number; f: number }> = ({ x, y, w, f }) => (
  <g><path d={`M${x},${y} q${w / 2},60 ${w},0`} stroke="#2f6a3a" strokeWidth={14} fill="none" />{Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={x + (i + 0.5) * w / 7} cy={y + Math.sin(((i + 0.5) / 7) * Math.PI) * 30} r={8} fill={["#c0352c", AMBAR, "#3a8ac8"][i % 3]} opacity={0.6 + 0.4 * Math.sin(f / 8 + i)} />)}</g>
);
const p35: PlanB = {
  a: 202.5, b: 206.8, trans: { tipo: "corte" },
  sfx: [[202.6, "door", -8], [202.9, "bell_store", -8], [203.6, "floor_step", -12], [204.4, "floor_step", -12], [205.0, "box", -10], [205.8, "tick", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Mural} pal={PAL} setProps={{ tono: "#4a3626", luz: "#ffcf6e" }} seed={636} mano={2}
          claves={[mira(0, 900, 600, 1.25), mira(k(206.8), 980, 600, 1.32, { curva: "inout" })]}
          medio={<>
            <rect x={560} y={210} width={560} height={70} rx={8} fill="#2a1c18" /><text x={840} y={262} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={44} fill="#ffd27a">LA POINTE STORE</text>
            {[0, 1, 2].map((r) => <g key={r}><rect x={420} y={380 + r * 160} width={900} height={18} fill="#8a6a42" stroke="#3a2418" strokeWidth={3} /></g>)}
            <rect x={420} y={380} width={16} height={520} fill="#6a4a2a" /><rect x={1304} y={380} width={16} height={520} fill="#6a4a2a" />
            <rect x={700} y={330} width={40} height={50} rx={5} fill="#b2342a" /><rect x={1080} y={490} width={40} height={50} rx={5} fill="#3a6ab0" />
            <g transform="translate(1480,300)"><rect x={-90} y={-70} width={180} height={190} rx={8} fill="#f2ead8" stroke="#2a1c18" strokeWidth={5} /><rect x={-90} y={-70} width={180} height={50} fill="#c0352c" /><text y={-34} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={34} fill="#fff">DEC</text><text y={80} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={92} fill="#2a1c18">25</text></g>
            <Guirnalda x={1380} y={180} w={200} f={f} />
            <A {...act(ABBY_ADENTRO, 500, { ruta: [{ f: 0, x: 380, y: P }, { f: k(205.0), x: 1180, y: P }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(205.0), v: "encogerse" }], caras: [{ f: 0, v: "duda" }, { f: k(204.6), v: "triste" }], miradas: [{ f: 0, v: { x: -1, y: -0.3 } }] })} />
          </>}
          hud={<><H l={[dia(83, k(205.8))]} /><Txt t="EMPTY BY CHRISTMAS" a={k(204.4)} b={k(206.8) + 4} top={950} tam={52} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 36 · los pescadores: trucha y pescado blanco ============
const BoteRed: React.FC<{ x: number; y: number; f: number; sube: number }> = ({ x, y, f, sube }) => (
  <g transform={`translate(${x},${y + Math.sin(f / 10) * 6})`}>
    <path d="M-220,-40 L220,-40 L180,20 L-180,20 Z" fill="#2f6a8a" /><rect x={-220} y={-46} width={440} height={10} fill="#e8e4da" />
    <path d={`M120,-40 L230,${-20 - sube * 180}`} stroke="#8a7a5a" strokeWidth={6} />
    <g transform={`translate(240,${40 - sube * 220})`}><path d="M-80,-40 Q0,120 80,-40" fill="none" stroke="#c8b890" strokeWidth={4} />{Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${-50 + (i % 3) * 40},${-10 + Math.floor(i / 3) * 30} q20,-12 40,0 q-20,12 -40,0 l-10,-8 l0,16 Z`} fill={i % 2 ? "#c8d0d8" : "#8a9a6a"} />)}</g>
    <Figu x={-80} y={-40} s={0.8} color="#c9a03a" /><Figu x={40} y={-40} s={0.8} color="#2f5a7a" />
  </g>
);
const p36: PlanB = {
  a: 206.8, b: 210.8, trans: { tipo: "corte" },
  sfx: [[206.9, "waves", -16, { dur: 4 }], [207.6, "net", -6], [208.4, "drip", -6], [208.6, "pour", -10], [209.0, "coin", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const t = interpolate(f, [k(208.3), k(209.3)], [0, 1], cl);
      return (
        <Escena Set={LagoAbierto} pal={PAL} setProps={{ hora: "dia", ola: 0.15, costa: false }} seed={637} mano={2}
          claves={[mira(0, 1080, LA_SUP - 60, 1.75), mira(k(210.8), 1120, LA_SUP - 80, 1.85, { curva: "inout" })]}
          medio={<><BoteRed x={1000} y={LA_SUP} f={f} sube={interpolate(f, [k(207.4), k(209.0)], [0, 1], cl)} />
            {t > 0 && t < 1 && <g transform={`translate(${1150 + t * 260},${LA_SUP - 40 - Math.sin(t * Math.PI) * 260}) rotate(${-40 + t * 100})`}><path d="M-60,0 Q-10,-30 40,0 Q-10,30 -60,0 Z M40,0 L70,-22 L70,22 Z" fill="#8a9a6a" stroke="#2a3a2a" strokeWidth={4} /><circle cx={-40} cy={-4} r={4} fill="#141018" /></g>}</>}
          hud={<><H l={[{ id: "pesca", et: "FISH TODAY", v: [{ f: 0, v: 0 }, { f: k(208.6), v: 48, d: 40 }], fmt: (n) => `${Math.round(n)}`, color: "#bfe0ff", ent: k(208.4) }]} /><Txt t="LAKE TROUT · WHITEFISH" a={k(207.9)} b={k(210.8) + 4} top={950} tam={50} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 37 · 73 millones de calorías: la torre junto al campanario; la de la granja, 1/10 ============
const Torre: React.FC<{ x: number; alto: number; ancho?: number }> = ({ x, alto, ancho = 160 }) => {
  const n = Math.floor(alto / 60);
  return <g>{Array.from({ length: n }).map((_, i) => <g key={i}><rect x={x - ancho / 2 + (i % 2) * 10} y={P - 60 * (i + 1)} width={ancho} height={56} rx={4} fill={i % 3 === 2 ? "#a8845a" : "#d8c8a0"} /><path d={`M${x - ancho / 2 + 20},${P - 60 * i - 30} q16,-10 32,0 q-16,10 -32,0`} fill={i % 3 === 2 ? "#6a4a2a" : "#8aa0b0"} /></g>)}</g>;
};
const p37: PlanB = {
  a: 210.8, b: 217.0, trans: { tipo: "corte" },
  sfx: [[211.3, "pop", -8], [212.6, "riser", -12, { dur: 1.6 }], [214.2, "boom", -14], [215.1, "tick", -4], [216.0, "pop", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const hi = interpolate(f, [k(212.4), k(214.2)], [0, 640], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
      const hf = interpolate(f, [k(215.4), k(215.9)], [0, 64], cl);
      const B = 860;
      return (
        <Escena Set={Mural} pal={PAL} setProps={{ tono: "#1e2a30" }} seed={638} mano={1.6}
          claves={[mira(0, 1000, 560, 1.15), mira(k(217.0), 1000, 560, 1.2, { curva: "inout" })]}
          medio={<>
            <line x1={600} y1={B} x2={1560} y2={B} stroke="#f2ead8" strokeWidth={5} />
            <rect x={760} y={B - hi} width={220} height={hi} fill="#c9a03a" stroke="#141018" strokeWidth={5} />
            {Array.from({ length: Math.floor(hi / 64) }).map((_, i) => <line key={i} x1={760} y1={B - (i + 1) * 64} x2={980} y2={B - (i + 1) * 64} stroke="#141018" strokeWidth={3} opacity={0.5} />)}
            <text x={870} y={B + 54} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={44} fill="#f2ead8">ISLAND</text>
            {hi > 40 && <text x={870} y={B - hi - 24} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={56} fill="#ffd27a" stroke="#141018" strokeWidth={6} paintOrder="stroke">73 M</text>}
            {hf > 0 && <><rect x={1200} y={B - hf} width={220} height={hf} fill="#6a9a4a" stroke="#141018" strokeWidth={5} /><text x={1310} y={B + 54} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={44} fill="#f2ead8">FARM</text><text x={1310} y={B - hf - 24} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={48} fill="#7ad08a" stroke="#141018" strokeWidth={6} paintOrder="stroke">7.3 M</text></>}
            <A {...act(NAN, 420, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(212.4), v: "señalar" }, { f: k(214.4), v: "manosCara" }, { f: k(215.6), v: "señalar" }], caras: [{ f: 0, v: "determinado" }, { f: k(214.2), v: "sorpresa" }, { f: k(215.6), v: "determinado" }], miradas: [{ f: 0, v: { x: 1, y: -0.4 } }] })} />
          </>}
          hud={<><H l={[kcal([{ f: 0, v: 0 }, { f: k(212.4), v: 73000000, d: 50 }], k(211.4))]} />
            {f > k(215.0) && <Txt t="10× THE FARM" a={k(215.0)} b={k(217.0) + 4} top={200} tam={64} mano chip color={AMBAR} />}</>} />
      );
    };
    return <Pl />;
  },
};

const p37b: PlanB = {
  a: 217.0, b: 221.1, trans: { tipo: "corte" },
  sfx: [[217.1, "wind_cold", -16, { dur: 4 }], [218.6, "creak", -6], [219.0, "lantern", -10], [220.2, "sad", -14]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = ISLA_PUNTOS.iglesia + 300;
      const abre = interpolate(f, [k(218.6), k(219.1)], [0, 1], cl);
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno" }} seed={6382} mano={2}
          claves={[mira(0, x + 40, 720, 1.55), mira(k(221.1), x + 40, 730, 1.65, { curva: "inout" })]}
          medio={<>
            <g transform={`translate(${x},${P})`}><path d="M-200,0 L-150,-110 L150,-110 L200,0 Z" fill="#5a4030" stroke="#2a1c14" strokeWidth={5} /><rect x={-120} y={-100} width={240} height={90} fill="#1a120c" />
              <g transform={`translate(-120,-100) rotate(${-110 * abre})`}><rect x={0} y={-8} width={240} height={16} fill="#7a5230" stroke="#3a2418" strokeWidth={3} /></g>
              {abre > 0.5 && [0, 1, 2].map((i) => <ellipse key={i} cx={-50 + i * 50} cy={-30} rx={20} ry={14} fill="#b88a4a" stroke="#5a4020" strokeWidth={3} />)}
              {abre > 0.5 && <Halo x={0} y={-50} r={180} color={AMBAR} fuerza={0.5} />}</g>
            <A {...act(ISLENO(52), x - 330, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(218.4), v: "arrodillado" }], caras: [{ f: 0, v: "duda" }, { f: k(219.6), v: "triste" }], enManoI: farol(f), luz: BORDE_FRIO })} />
          </>}
          hud={<><H /><Txt t="FISH ALONE CAN'T DO IT" a={k(217.2)} b={k(218.8)} top={200} tam={58} mano chip color="#ff8a6a" /><Txt t="ROOT CELLARS: NEARLY EMPTY" a={k(219.0)} b={k(221.1) + 4} top={200} tam={56} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 38 · la cuenta por radio: June y el doctor, tres renglones grandes ============
const Columnas: React.FC<{ desde: number; x: number }> = ({ desde, x }) => {
  const f = useF();
  return <g>{["100 × 2,000 kcal × 365", "= 73,000,000", "FARM HAS: 7,300,000"].map((t, i) => <text key={i} x={x} y={866 + i * 68} textAnchor="middle" fontFamily={F_MANO_} fontWeight={700} fontSize={58} fill={i === 2 ? "#7ad08a" : i === 1 ? "#ffd27a" : "#f2ead8"} opacity={interpolate(f, [desde + i * 26, desde + i * 26 + 8], [0, 1], cl)}>{t}</text>)}</g>;
};
const F_MANO_ = "'Patrick Hand', 'Comic Sans MS', cursive";

// ============ 38 · la cuenta por radio: June y el doctor ============
const p38: PlanB = {
  a: 221.1, b: 224.6, trans: { tipo: "corte" },
  sfx: [[221.2, "static", -20, { dur: 3.4 }], [221.6, "pencil", -8, { dur: 2.8 }], [222.4, "radio_ping", -10]],
  el: (k) => (
    <>
      <Mitades
        izq={<Escena Set={GranjaLiving} pal={PAL} setProps={{ hora: "noche", farol: 1 }} seed={639} mano={1.6} claves={[mira(0, L.mesa - 100, 560, 1.15)]}
          medio={<A {...act(JUNE, L.mesa - 140, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "hablar" }, { f: k(222.6), v: "señalar" }], caras: [{ f: 0, v: "determinado" }], habla: [[k(221.4), k(222.6)]], enManoD: <MicMano s={0.8} ptt /> })} />}
/>}
        der={<Escena Set={IglesiaDentro} pal={PAL} setProps={{ plan: 1, tarjetas: 1, hilos: 1 }} seed={640} mano={1.6} claves={[mira(0, IG_PUNTOS.tablero - 300, 560, 1.15)]}
          medio={<A {...act(HALVORSEN, IG_PUNTOS.tablero - 300, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "pensar" }, { f: k(222.8), v: "hablar" }], caras: [{ f: 0, v: "determinado" }], enManoD: <MicMano s={0.8} ptt />, habla: [[k(222.8), k(224.4)]] })} />} />}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}><rect x={460} y={800} width={1000} height={250} rx={18} fill="rgba(18,15,24,0.82)" /><Columnas desde={k(221.4)} x={960} /></svg>
      <H />
    </>
  ),
};

// ============ 39 · la balanza: lo que tiene la granja contra lo que tiene la isla (gente) ============
const Balanza: React.FC<{ x0: number; ang: number; izq?: React.ReactNode; der?: React.ReactNode }> = ({ x0, ang, izq, der }) => {
  const L2 = 380, Y0 = P - 430, rad = (ang * Math.PI) / 180;
  const pi = { x: x0 - L2 * Math.cos(rad), y: Y0 - L2 * Math.sin(rad) }, pd = { x: x0 + L2 * Math.cos(rad), y: Y0 + L2 * Math.sin(rad) };
  const plato = (x: number, y: number, c: React.ReactNode) => (
    <g><line x1={x} y1={y} x2={x - 120} y2={y + 160} stroke="#2a1c18" strokeWidth={4} /><line x1={x} y1={y} x2={x + 120} y2={y + 160} stroke="#2a1c18" strokeWidth={4} />
      <path d={`M${x - 150},${y + 160} L${x + 150},${y + 160} L${x + 110},${y + 190} L${x - 110},${y + 190} Z`} fill="#b08a3a" stroke="#5a4020" strokeWidth={5} />
      <g transform={`translate(${x},${y + 160})`}>{c}</g></g>
  );
  return <g>
    <path d={`M${x0 - 120},${P} L${x0 + 120},${P} L${x0 + 20},${Y0} L${x0 - 20},${Y0} Z`} fill="#6a4a2a" stroke="#3a2418" strokeWidth={5} />
    <line x1={pi.x} y1={pi.y} x2={pd.x} y2={pd.y} stroke="#4a3220" strokeWidth={18} strokeLinecap="round" /><circle cx={x0} cy={Y0} r={18} fill={AMBAR} stroke="#3a2418" strokeWidth={5} />
    {plato(pi.x, pi.y, izq)}{plato(pd.x, pd.y, der)}
  </g>;
};

// ============ 39 · la granja tiene papas, semilla, tractor y tierra; la isla tiene gente ============
const p39: PlanB = {
  a: 224.6, b: 230.8, trans: { tipo: "fundido", d: 10 },
  sfx: [[224.7, "wind_soft", -18, { dur: 4.6 }], [225.9, "pop", -6], [226.8, "pop", -6], [227.6, "pop", -6], [228.3, "pop", -6], [229.6, "popcluster", -6, { dur: 1 }], [229.9, "creak", -6], [230.2, "wood_hit", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const X0 = GRANJA_PUNTOS.granero + 300;
      const it = [k(225.9), k(226.8), k(227.6), k(228.3)].map((t) => interpolate(f, [t, t + 6], [0, 1], cl));
      const gente = Math.round(interpolate(f, [k(229.5), k(230.3)], [0, 18], cl));
      const ang = interpolate(f, [k(225.9), k(228.6), k(229.6), k(230.4)], [0, 16, 16, -18], cl);
      return (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "dia", estacion: "invierno" }} seed={641} mano={2}
          claves={[mira(0, X0, 600, 1.2), mira(k(230.8), X0, 600, 1.26, { curva: "inout" })]}
          medio={<>
            <Balanza x0={X0} ang={-ang} izq={<g>
              {it[0] > 0 && <g transform={`translate(-90,-22) scale(${it[0]})`}><ellipse rx={30} ry={22} fill="#b88a4a" stroke="#5a4020" strokeWidth={4} /></g>}
              {it[1] > 0 && <g transform={`translate(-30,-34) scale(${it[1]})`}><path d="M-24,34 L24,34 L18,-24 L-18,-24 Z" fill="#d8c8a0" stroke="#6a5a3a" strokeWidth={4} /><text y={10} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={18} fill="#6a5a3a">SEED</text></g>}
              {it[2] > 0 && <g transform={`scale(${it[2]})`}><Tractor x={40} y={0} f={f} s={0.2} /></g>}
              {it[3] > 0 && <rect x={-140} y={-10} width={280 * it[3]} height={10} fill="#6a4a2a" />}
            </g>} der={<g>{Array.from({ length: gente }).map((_, i) => <Figu key={i} x={-110 + (i % 9) * 28} y={-Math.floor(i / 9) * 52} s={0.42} color={COLS[i % 9]} />)}</g>} />
            <A {...act(MARCUS, X0 - 700, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(225.6), v: "señalar" }, { f: k(229.6), v: "celebrar" }], caras: [{ f: 0, v: "determinado" }, { f: k(229.8), v: "sorpresa" }], luz: BORDE_FRIO })} />
          </>}
          hud={<><H />{["POTATOES", "SEED", "TRACTOR", "EMPTY LAND"].map((t, i) => <Txt key={t} t={t} a={k([225.9, 226.8, 227.6, 228.3][i])} b={k(229.3)} top={200 + i * 80} left={1340} tam={50} mano chip color={AMBAR} />)}
            <Txt t="THE ISLAND HAS PEOPLE" a={k(229.5)} b={k(230.8) + 4} top={200} tam={60} mano chip color="#7ad08a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 40 · la respuesta es obvia: el mapa del lago en el altillo ============
const p40: PlanB = {
  a: 230.8, b: 238.0, trans: { tipo: "corte" },
  sfx: [[230.9, "chalk", -6], [232.4, "paper", -10], [233.4, "pencil", -8, { dur: 2.4 }], [236.4, "boom", -16]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 0.8, aguja: 0.62, isla: 1, linea: 1, ruta: interpolate(f, [k(233.2), k(236.0)], [0, 1], cl) }} seed={643} mano={2}
          claves={[mira(0, RG_PUNTOS.mapa - 200, 640, 1.12), mira(k(238.0), RG_PUNTOS.mapa - 150, 630, 1.2, { curva: "inout" })]}
          medio={<A {...act(GUS, RG_PUNTOS.mapa - 340, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "manosCintura" }, { f: k(232.4), v: "señalar" }, { f: k(233.2), v: { hD: 120, cD: 10, tronco: 6 } }, { f: k(236.2), v: "brazosCruzados" }], caras: [{ f: 0, v: "determinado" }, { f: k(236.4), v: "duda" }], miradas: [{ f: 0, v: { x: 1, y: -0.5 } }] })} />}
          hud={<><H /><Txt t="THE ANSWER IS OBVIOUS" a={k(231.0)} b={k(232.4)} top={940} tam={52} mano chip color={AMBAR} /><Txt t="ONE GROUP HAS TO MOVE" a={k(232.4)} b={k(236.2)} top={940} tam={52} mano chip color={AMBAR} /><Txt t="…ACROSS LAKE SUPERIOR" a={k(236.2)} b={k(238.0) + 4} top={940} tam={52} mano chip color="#8fd3ff" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 41 · el ferry de antes, sólo con agua abierta ============
const p41: PlanB = {
  a: 238.0, b: 242.2, trans: { tipo: "fundido", d: 10 },
  sfx: [[238.1, "wind_cold", -14, { dur: 4 }], [238.6, "ice_crack", -10], [240.2, "metal", -8], [240.6, "lock", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const cad = interpolate(f, [k(240.0), k(240.6)], [0, 1], cl);
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno", ferry: 1, hielo: interpolate(f, [0, k(242.2)], [0.1, 0.6], cl) }} seed={644} mano={2}
          claves={[mira(0, -60, 640, 1.3), mira(k(242.2), -20, 640, 1.38, { curva: "inout" })]}
          medio={<>
            <rect x={140} y={P - 120} width={16} height={120} fill="#5a3a22" /><rect x={430} y={P - 120} width={16} height={120} fill="#5a3a22" />
            {cad > 0 && <path d={`M156,${P - 100} Q${156 + 137 * cad},${P - 60} ${156 + 274 * cad},${P - 100}`} fill="none" stroke="#8a8a92" strokeWidth={8} strokeDasharray="12 6" />}
            {cad >= 1 && <g transform={`translate(293,${P - 70}) rotate(${Math.sin(f / 8) * 4})`}><rect x={-80} y={0} width={160} height={56} rx={6} fill="#c0352c" stroke="#141018" strokeWidth={4} /><text y={40} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={36} fill="#fff">CLOSED</text></g>}
            <A {...act({ ...ISLENO(55), accesorios: [{ t: "gorroLana", color: "#2f4a6a" }] }, 520, { ruta: [{ f: 0, x: 620, y: P }, { f: k(239.6), x: 470, y: P }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(239.8), v: "tirarCarga" }, { f: k(240.8), v: "brazosCruzados" }], caras: [{ f: 0, v: "cansado" }], luz: BORDE_FRIO })} />
          </>}
          hud={<><H /><Txt t="ONLY WHEN THE WATER IS OPEN" a={k(238.6)} b={k(242.2) + 4} top={200} tam={54} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 42 · el generador tose y se apaga; las ventanas se apagan ============
const p42: PlanB = {
  a: 242.2, b: 246.0, trans: { tipo: "corte" },
  sfx: [[242.3, "generator", -8, { dur: 1.4 }], [243.2, "punch", -6], [243.6, "metal", -4], [244.0, "candle_out", -10], [244.6, "fail", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const gen = interpolate(f, [k(242.3), k(244.0)], [0.9, 0], cl);
      const fuel = interpolate(f, [k(242.6), k(243.9)], [0.15, 0], cl);
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "noche", estacion: "invierno", luces: interpolate(f, [k(243.9), k(244.8)], [1, 0.05], cl), generador: gen }} seed={645} mano={2}
          claves={[mira(0, ISLA_PUNTOS.estacion + 140, 640, 1.45), mira(k(246.0), ISLA_PUNTOS.estacion + 100, 630, 1.55, { curva: "inout" })]}
          medio={<A {...act(ABBY, ISLA_PUNTOS.estacion + 140, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(243.2), v: "empujar" }, { f: k(243.5), v: "parado" }, { f: k(243.6), v: "empujar" }, { f: k(244.2), v: "manosCara" }], caras: [{ f: 0, v: "duda" }, { f: k(243.6), v: "enojo" }, { f: k(244.2), v: "triste" }], luz: BORDE_FRIO, enManoI: farol(f) })} />}
          hud={<><H />
            <svg width={1920} height={1080} style={{ position: "absolute" }}><g transform="translate(1660,300)"><rect x={-170} y={-130} width={340} height={200} rx={18} fill="rgba(18,15,24,0.82)" stroke="#f6ecd2" strokeWidth={3} /><path d="M-120,40 A120,120 0 0 1 120,40" fill="none" stroke="#5a5a62" strokeWidth={20} /><path d="M-120,40 A120,120 0 0 1 -104,-20" fill="none" stroke="#c0352c" strokeWidth={20} />
              <line x1={0} y1={40} x2={-110 * Math.cos(fuel * Math.PI) } y2={40 - 110 * Math.sin(fuel * Math.PI)} stroke="#f6ecd2" strokeWidth={8} strokeLinecap="round" /><text x={0} y={-90} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={32} fill="#f6ecd2">FUEL</text><text x={-120} y={70} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={28} fill="#ff8a6a">E</text><text x={120} y={70} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={28} fill="#f6ecd2">F</text></g></svg>
            <Txt t="OUT OF FUEL" a={k(243.5)} b={k(244.6)} top={200} tam={60} mano chip color="#ff8a6a" /><Txt t="THE BOATS ARE SMALL" a={k(244.6)} b={k(246.0) + 4} top={200} tam={56} mano chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 43 · olas enormes de noviembre; bajo el agua, cientos de barcos hundidos ============
const p43: PlanB = {
  a: 246.0, b: 252.2, trans: { tipo: "corte" },
  sfx: [[246.1, "storm_sea", -10, { dur: 6 }], [247.4, "waves", -8], [248.5, "whoosh_big", -8], [249.8, "boom", -6], [250.4, "metal_fall", -10], [250.9, "metal_fall", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const sube = Math.sin(f / 9);
      const hund = Math.round(interpolate(f, [k(249.8), k(251.2)], [0, 7], cl));
      return (
        <Escena Set={LagoAbierto} pal={PAL} setProps={{ hora: "tormenta", ola: 1 }} seed={646} mano={2.6}
          claves={[mira(0, 1500, LA_SUP - 80, 1.25), mira(k(249.6), 1520, LA_SUP - 60, 1.15, { curva: "inout" }), mira(k(252.2), 1520, LA_SUP - 60, 1.1, { curva: "inout" })]}
          medio={<g transform={`translate(1500,${LA_SUP - 30 + sube * 50}) rotate(${Math.cos(f / 9) * 14}) scale(2.4)`}>
            <path d="M-60,-14 L60,-14 L46,10 L-46,10 Z" fill="#c8382c" stroke="#141018" strokeWidth={2} />
            {[-30, 0, 30].map((x, i) => <Figu key={i} x={x} y={-14} s={0.3} color={["#c9a03a", "#2f5a7a", "#6a7a3a"][i]} />)}</g>}
          hud={<><H />
            <svg width={1920} height={1080} style={{ position: "absolute" }}>{Array.from({ length: hund }).map((_, i) => <g key={i} transform={`translate(${520 + i * 140},880) rotate(${-20 + (i % 3) * 18})`}><path d="M-50,-10 L50,-10 L40,10 L-40,10 Z M-10,-10 L-10,-40 L20,-40 L20,-10 Z" fill="#141018" stroke="#bfe0ff" strokeWidth={3} /></g>)}</svg>
            <Txt t="LATE FALL · MASSIVE WAVES" a={k(246.4)} b={k(249.6)} top={200} tam={50} chip /><Txt t="HUNDREDS OF SHIPS SUNK" a={k(249.9)} b={k(252.2) + 4} top={200} tam={60} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 44 · Gus joven al timón del carguero en la tormenta → Gus viejo en el altillo ============
const GUS_JOVEN = { ...GUS, accesorios: [{ t: "pelo" as const, forma: "corto" as const, color: "#2a1a14" }, { t: "gorroLana" as const, color: "#2f4a6a" }] };

// ============ 44 · Gus 40 años en el lago (laker de mineral) → Gus viejo en el altillo ============
const p44: PlanB = {
  a: 252.2, b: 256.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[252.3, "storm_sea", -14, { dur: 2.2 }], [252.7, "ship_horn", -12], [254.4, "whoosh", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(254.4)) {
        const bal = Math.sin(f / 12) * 3;
        return (
          <Escena Set={LagoAbierto} pal={PAL} setProps={{ hora: "tormenta", ola: 0.6, costa: false }} seed={647} mano={2}
            claves={[mira(0, 1340, LA_SUP - 200, 1.6), mira(k(254.4), 1340, LA_SUP - 200, 1.7, { curva: "inout" })]}
            medio={<g transform={`rotate(${bal},1340,${LA_SUP})`}>
              <rect x={700} y={LA_SUP - 50} width={1100} height={120} fill="#7a2a24" stroke="#141018" strokeWidth={6} />
              <rect x={1180} y={LA_SUP - 330} width={320} height={280} fill="#e8e4da" stroke="#141018" strokeWidth={6} />
              <A {...act(GUS_JOVEN, 1330, { ruta: [{ f: 0, x: 1330, y: LA_SUP - 50 }], escala: 0.62, dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "empujar" }], caras: [{ f: 0, v: "determinado" }] })} />
              <rect x={1180} y={LA_SUP - 330} width={320} height={60} fill="#e8e4da" /><rect x={1180} y={LA_SUP - 120} width={320} height={70} fill="#e8e4da" />
              <g transform={`translate(1430,${LA_SUP - 150}) rotate(${f * 2})`}><circle r={36} fill="none" stroke="#7a5230" strokeWidth={8} />{[0, 1, 2, 3].map((i) => <line key={i} x1={-46} y1={0} x2={46} y2={0} stroke="#7a5230" strokeWidth={6} transform={`rotate(${i * 45})`} />)}</g>
            </g>}
            hud={<><H l={[anio(1975, k(252.4))]} /><Txt t="40 YEARS ON THE LAKE" a={k(252.6)} b={k(254.4)} top={200} tam={58} mano chip color={AMBAR} /></>} />
        );
      }
      return (
        <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 0.8, aguja: 0.62 }} seed={648} mano={2}
          claves={[mira(0, RG_PUNTOS.silla + 80, 720, 1.45), mira(k(256.0), RG_PUNTOS.silla + 80, 710, 1.55, { curva: "inout" })]}
          medio={<A {...act(GUS_RADIO, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "pensar" }], caras: [{ f: 0, v: "triste" }], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 } })} />}
          hud={<><H /><Txt t="HE KNOWS THE STORIES" a={k(254.6)} b={k(256.0) + 4} top={200} tam={58} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

const Termo: React.FC<{ v: number; min?: number; max?: number; x?: number; y?: number }> = ({ v, min = -20, max = 30, x = 1680, y = 260 }) => {
  const u = (v - min) / (max - min);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute" }}><g transform={`translate(${x},${y})`}>
      <rect x={-110} y={-40} width={220} height={520} rx={22} fill="rgba(18,15,24,0.82)" stroke="#f6ecd2" strokeWidth={3} />
      <rect x={-18} y={10} width={36} height={360} rx={18} fill="#2a2a32" stroke="#f6ecd2" strokeWidth={3} /><circle cx={0} cy={392} r={34} fill="#c0352c" stroke="#f6ecd2" strokeWidth={3} />
      <rect x={-11} y={10 + 360 * (1 - u)} width={22} height={360 * u + 10} fill="#c0352c" />
      <text x={0} y={460} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={52} fill={v <= 0 ? "#bfe0ff" : "#f6ecd2"} stroke="#141018" strokeWidth={6} paintOrder="stroke">{`${Math.round(v)}°F`}</text>
    </g></svg>
  );
};
// ============ 45 · el Edmund Fitzgerald: noviembre de 1975, 29 hombres (sólo la luz lejana que se pierde) ============
const p45: PlanB = {
  a: 256.0, b: 262.2, trans: { tipo: "fundido", d: 12 },
  sfx: [[256.1, "storm_sea", -10, { dur: 6 }], [256.4, "ship_horn", -12], [258.1, "metal", -4], [258.3, "boom", -8], [260.2, "candle_out", -14], [261.2, "sad", -16]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const parte = interpolate(f, [k(258.1), k(260.0)], [0, 1], { ...cl, easing: (t) => t * t });
      const bal = Math.sin(f / 10) * 3;
      const luces = Math.round(interpolate(f, [k(260.2), k(261.6)], [29, 0], cl));
      const X = 1000, Y = LA_SUP - 10;
      const casco = (lado: -1 | 1) => (
        <g transform={`translate(${X + lado * 30 * parte},${Y + 160 * parte}) rotate(${bal + lado * 22 * parte},${lado * 10},0)`}>
          <path d={lado < 0 ? "M-460,-70 L0,-70 L0,20 L-430,20 Z" : "M0,-70 L420,-70 L470,-30 L440,20 L0,20 Z"} fill="#7a2a24" stroke="#141018" strokeWidth={6} />
          <rect x={lado < 0 ? -440 : 300} y={-150} width={110} height={80} fill="#e8e4da" stroke="#141018" strokeWidth={5} />
          {Array.from({ length: 29 }).map((_, i) => { const xx = -420 + i * 30; if ((lado < 0) !== (xx < 0)) return null; return <rect key={i} x={xx} y={-52} width={14} height={14} fill={i < luces ? AMBAR : "#2a2a32"} />; })}
        </g>
      );
      return (
        <Escena Set={LagoAbierto} pal={PAL} setProps={{ hora: "tormenta", ola: 0.8, costa: false }} seed={649} mano={2.2}
          claves={[mira(0, X, Y - 80, 1.05), mira(k(262.2), X, Y - 40, 1.12, { curva: "inout" })]}
          detras={<>{casco(-1)}{casco(1)}</>}
          hud={<><H l={[anio(1975)]} /><Txt t="EDMUND FITZGERALD" a={k(256.4)} b={k(259.4)} top={200} tam={54} chip /><Txt t="NOV 10, 1975 · 29 MEN" a={k(259.4)} b={k(262.2) + 4} top={200} tam={58} chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 46 · Gus: de ninguna manera en botes chicos en noviembre (palmada en la mesa) ============
const p46: PlanB = {
  a: 262.2, b: 266.6, trans: { tipo: "corte" },
  sfx: [[262.3, "static", -22, { dur: 4 }], [263.4, "wood_hit", -2], [265.5, "pencil", -6, { dur: 0.6 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const g = golpe(f, k(263.4), 6);
      const tacha = interpolate(f, [k(265.5), k(265.9)], [0, 1], cl);
      const xc = RG_PUNTOS.silla + 330;
      return (
        <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 1, aguja: 0.62 }} seed={650} mano={2}
          claves={[mira(0, RG_PUNTOS.silla + 200 + g, 680, 1.4), mira(k(266.6), RG_PUNTOS.silla + 200, 680, 1.48, { curva: "inout" })]}
          medio={<>
            <g transform={`translate(${xc},500)`}><rect x={-90} y={-70} width={180} height={170} rx={8} fill="#f2ead8" stroke="#2a1c18" strokeWidth={5} /><rect x={-90} y={-70} width={180} height={44} fill="#2f4a6a" /><text y={-38} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={26} fill="#fff">NOVEMBER</text>
              {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-74 + (i % 4) * 38} y={-12 + Math.floor(i / 4) * 34} width={28} height={24} fill="#d8ccb0" />)}
              {tacha > 0 && <><path d={`M-80,-60 L${-80 + 160 * tacha},${-60 + 150 * tacha}`} stroke="#c0352c" strokeWidth={12} strokeLinecap="round" /><path d={`M80,-60 L${80 - 160 * tacha},${-60 + 150 * tacha}`} stroke="#c0352c" strokeWidth={12} strokeLinecap="round" /></>}</g>
            <A {...act(GUS_RADIO, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 25, cI: 50 } }, { f: k(263.0), v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 80, cI: 10 } }, { f: k(263.4), v: { tronco: 16, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 55, cI: 20 } }, { f: k(264.4), v: "señalar" }], caras: [{ f: 0, v: "determinado" }, { f: k(263.4), v: "enojo" }], habla: [[k(262.4), k(266.2)]], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 }, enManoD: <MicMano s={0.8} ptt /> })} />
          </>}
          hud={<><H /><Txt t="NO SMALL BOATS IN NOVEMBER" a={k(263.4)} b={k(266.6) + 4} top={200} tam={58} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 47 · esperan el hielo: el canal se congela en timelapse (°F 25 → 10) ============
const p47: PlanB = {
  a: 266.6, b: 271.3, trans: { tipo: "fundido", d: 10 },
  sfx: [[266.7, "wind_cold", -14, { dur: 4.6 }], [268.0, "ice_crack", -10], [269.4, "ice_crack", -12], [270.1, "ice_crack", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const t = interpolate(f, [k(267.0), k(270.0)], [25, 10], cl);
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno", hielo: interpolate(f, [k(267.0), k(270.4)], [0, 1], cl) }} seed={651} mano={2}
          claves={[mira(0, -300, 650, 1.25), mira(k(271.3), -260, 650, 1.32, { curva: "inout" })]}
          medio={<A {...act(ABBY, 60, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "brazosCruzados" }, { f: k(270.1), v: "señalar" }], caras: [{ f: 0, v: "duda" }, { f: k(270.1), v: "sorpresa" }], miradas: [{ f: 0, v: { x: -1, y: 0.2 } }], luz: BORDE_FRIO, enManoI: farol(f) })} />}
          hud={<><H /><Termo v={t} /><Mano t="ICE." x={760} y={300} desde={k(270.1)} tam={150} color="#bfe0ff" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 48 · el camino de hielo de antes: autos de verdad, marcado con arbolitos de Navidad ============
const p48: PlanB = {
  a: 271.3, b: 278.6, trans: { tipo: "fundido", d: 12 },
  sfx: [[271.4, "wind_cold", -18, { dur: 7 }], [272.6, "car_pass", -10, { dur: 3 }], [275.0, "ice_crack", -16], [276.6, "car_pass", -12, { dur: 2 }], [277.6, "car_door", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const cx = interpolate(f, [k(272.0), k(278.6)], [220, 1500], cl);
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "invierno", arbolitos: 1, autos: interpolate(f, [0, k(278.6)], [0.1, 0.7], cl) }} seed={652} mano={2}
          claves={[mira(0, 960, 700, 1.15), mira(k(278.6), 1000, 700, 1.2, { curva: "inout" })]}
          medio={<g><AutoChico x={cx} y={P + 40} s={1.7} color="#2f4a5e" />
            <g transform={`translate(${cx + 30},${P + 40 - 150})`}><circle r={26} fill="#141018" /><circle cx={-8} cy={-4} r={6} fill="#fff" /><circle cx={8} cy={-4} r={6} fill="#fff" /><path d={`M24,10 L${50 + Math.sin(f / 3) * 14},-30`} stroke="#141018" strokeWidth={10} strokeLinecap="round" /></g></g>}
          hud={<><H /><Txt t="THE OLD WORLD" a={k(271.6)} b={k(275.0)} top={200} tam={50} chip /><Txt t="THE COUNTY OPENED AN ICE ROAD" a={k(275.4)} b={k(278.6) + 4} top={200} tam={50} chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

const p48b: PlanB = {
  a: 278.6, b: 285.3, trans: { tipo: "corte" },
  sfx: [[278.7, "car_pass", -12, { dur: 2 }], [281.9, "pop", -8], [282.5, "pop", -8], [283.1, "pop", -8], [283.6, "pop", -8], [284.1, "pop", -8], [282.8, "snow_step", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const ts = [281.9, 282.5, 283.1, 283.6, 284.1];
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "invierno", arbolitos: 0, autos: interpolate(f, [0, k(285.3)], [0.2, 0.6], cl) }} seed={6522} mano={2}
          claves={[mira(0, 900, 720, 1.3), mira(k(285.3), 940, 720, 1.38, { curva: "inout" })]}
          medio={<>
            {ts.map((t, i) => { const u = interpolate(f, [k(t), k(t) + 6], [0, 1], { ...cl, easing: (x) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2) }); return u > 0 ? <g key={i} transform={`translate(${520 + i * 260},${P + 30}) scale(${u})`}><rect x={-6} y={-30} width={12} height={30} fill="#5a3a22" /><path d="M0,-170 L60,-30 L-60,-30 Z M0,-200 L44,-100 L-44,-100 Z" fill="#2f5a3a" stroke="#1a3a24" strokeWidth={4} /></g> : null; })}
            <A {...act(ISLENO(60), 400, { ruta: [{ f: 0, x: 400, y: P + 30 }, { f: k(281.6), x: 400, y: P + 30 }, { f: k(284.4), x: 1520, y: P + 30, curva: "lineal" }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "señalar" }, { f: k(281.6), v: "tirarCarga" }], caras: [{ f: 0, v: "feliz" }], luz: BORDE_FRIO })} />
          </>}
          hud={<><H /><Txt t="REAL CARS · ACROSS THE FROZEN LAKE" a={k(278.8)} b={k(281.6)} top={200} tam={50} mano chip color={AMBAR} /><Txt t="MARKED BY OLD CHRISTMAS TREES" a={k(281.8)} b={k(285.3) + 4} top={200} tam={52} mano chip color="#7ad08a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 49 · el windsled: bote plano con hélice gigante ============
const p49: PlanB = {
  a: 285.3, b: 289.0, trans: { tipo: "corte" },
  sfx: [[285.4, "wind_cold", -18, { dur: 3.6 }], [286.4, "fail", -12], [288.0, "fail", -12], [288.6, "ding", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const cols: [string, number, string][] = [["CAR", k(286.1), "TOO THIN"], ["FERRY", k(287.8), "TOO THICK"], ["WINDSLED", k(288.6), "✓"]];
      return (
        <AbsoluteFill style={{ background: "#1e2a30" }}>
          <svg width={1920} height={1080}>
            {cols.map(([t, a, m], i) => { const o = interpolate(f, [a - 6, a], [0, 1], cl); const ok = i === 2; return <g key={t} transform={`translate(${380 + i * 580},560)`} opacity={0.35 + 0.65 * o}>
              <rect x={-230} y={-280} width={460} height={500} rx={20} fill="#141018" stroke={ok ? "#7ad08a" : "#f6ecd2"} strokeWidth={ok && o > 0.5 ? 8 : 3} />
              <g transform="translate(0,-70)">{i === 0 ? <AutoChico x={0} y={0} s={1.1} color="#2f4a5e" /> : i === 1 ? <Ferry x={0} y={20} s={0.42} /> : <Windsled x={60} y={0} s={0.7} f={f} />}</g>
              <rect x={-180} y={20} width={360} height={46} fill="#7aa8d0" opacity={0.7} /><rect x={-180} y={66} width={360} height={60} fill="#2a3e5a" />
              <text y={-200} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={52} fill="#f6ecd2">{t}</text>
              {o > 0.5 && <text y={190} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={ok ? 80 : 46} fill={ok ? "#7ad08a" : "#ff8a6a"}>{m}</text>}
            </g>; })}
          </svg>
          <H />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

const p49b: PlanB = {
  a: 289.0, b: 294.3, trans: { tipo: "corte" },
  sfx: [[289.1, "fan_prop", -6, { dur: 5 }], [290.5, "whoosh_big", -10], [292.3, "ice_crack", -14], [293.1, "drip", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = interpolate(f, [k(289.0), k(294.3)], [-300, 2200], cl);
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "invierno", arbolitos: 0, agua: 0.25, lechoso: 0.5 }} seed={653} mano={2}
          claves={[mira(0, 960, 720, 1.05), mira(k(294.3), 980, 720, 1.1, { curva: "inout" })]}
          medio={<g><Windsled x={x} y={P + 40} f={f} s={1.6} />{[0, 1, 2, 3].map((i) => <Figu key={i} x={x - 260 + i * 70} y={P + 40 - 60 * 1.6} s={0.7} color={COLS[i + 2]} />)}</g>}
          hud={<><H /><Txt t="WINDSLEDS" a={k(289.2)} b={k(291.0)} top={200} tam={70} mano chip color={AMBAR} /><Txt t="GIANT FANS · SLIDE OVER ICE AND SLUSH" a={k(291.0)} b={k(294.3) + 4} top={200} tam={48} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 50 · Abby y los mapas viejos; el termómetro cada noche ============
const p50: PlanB = {
  a: 294.3, b: 302.6, trans: { tipo: "corte" },
  sfx: [[294.4, "paper", -8], [295.4, "unroll", -8], [296.2, "pencil", -8, { dur: 1.4 }], [298.6, "wind_cold", -18, { dur: 4 }], [299.6, "clock", -10], [300.6, "clock", -10], [301.6, "clock", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const termo = f > k(298.4);
      const t = interpolate(f, [k(299.4), k(299.8), k(300.4), k(300.8), k(301.4), k(301.8)], [10, 2, 2, -3, -3, -8], cl);
      return (
        <Escena Set={EstacionIsla} pal={PAL} setProps={{ hora: "noche", ruta: interpolate(f, [k(295.2), k(297.6)], [0, 1], cl), temp: t }} seed={654} mano={2}
          claves={termo ? [mira(0, EI_PUNTOS.ventana + 180, 640, 1.3), mira(k(302.6), EI_PUNTOS.ventana + 160, 630, 1.4, { curva: "inout" })] : [mira(0, EI_PUNTOS.mapa - 200, 620, 1.2), mira(k(298.4), EI_PUNTOS.mapa - 160, 610, 1.3, { curva: "inout" })]}
          medio={termo
            ? <A {...act(ABBY_ADENTRO, EI_PUNTOS.ventana + 300, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "brazosCruzados" }, { f: k(300.4), v: "pensar" }], caras: [{ f: 0, v: "duda" }, { f: k(301.4), v: "determinado" }] })} />
            : <A {...act(ABBY_ADENTRO, EI_PUNTOS.mapa - 360, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(295.0), v: { hD: 120, cD: 10, tronco: 6 } }, { f: k(297.6), v: "señalar" }], caras: [{ f: 0, v: "determinado" }] })} />}
          hud={<><H l={termo ? [dia([{ f: 0, v: 356 }, { f: k(299.4), v: 357, d: 4 }, { f: k(300.4), v: 358, d: 4 }, { f: k(301.4), v: 359, d: 4 }], k(298.6))] : []} />{termo && <Termo v={t} />}<Txt t="WHERE THE ICE ROAD USED TO RUN" a={k(295.6)} b={k(298.4)} top={940} tam={50} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 51 · Día 450: −18 °F en La Pointe ============
const p51: PlanB = {
  a: 302.6, b: 309.1, trans: { tipo: "fundido", d: 10 },
  sfx: [[302.7, "wind_cold", -12, { dur: 6.4 }], [302.8, "tick", -2], [304.0, "door", -10], [304.6, "snow_step", -10, { dur: 3 }], [307.8, "ice_crack", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const t = interpolate(f, [k(305.6), k(308.0)], [-8, -18], cl);
      const x = ISLA_PUNTOS.casas;
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno", hielo: 1 }} seed={655} mano={2}
          claves={[mira(0, x - 40, 660, 1.3), mira(k(309.1), x + 260, 660, 1.38, { curva: "inout" })]}
          medio={<A {...act(ABBY, x - 200, { ruta: [{ f: 0, x: x - 200, y: P }, { f: k(304.2), x: x - 200, y: P }, { f: k(309.1), x: x + 360, y: P }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(304.2), v: { hD: 150, cD: 120, hI: 20, cI: 40 } }], caras: [{ f: 0, v: "determinado" }], enManoD: <g transform="rotate(-60)"><Barreno s={0.8} /></g>, luz: BORDE_FRIO })} />}
          hud={<><H l={[dia([{ f: 0, v: 360 }, { f: k(302.8), v: 450, d: 30 }], k(302.7))]} /><Termo v={t} /><Txt t="LATE DECEMBER · YEAR TWO" a={k(303.8)} b={k(309.1) + 4} top={200} tam={52} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 52 · Abby sale al hielo con el barreno y perfora ============
const p52: PlanB = {
  a: 309.1, b: 312.7, trans: { tipo: "corte" },
  sfx: [[309.2, "snow_step", -8], [309.6, "snow_step", -8], [310.0, "snow_step", -8], [310.4, "snow_step", -8], [311.0, "auger", -4, { dur: 1.7 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const perfora = f > k(311.0);
      const u = interpolate(f, [k(310.5), k(311.0)], [0, 1], cl);
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "invierno", arbolitos: 0 }} seed={656} mano={2.4}
          claves={[mira(0, 900, 660, 1.3), mira(k(311.0), 980, 690, 1.5, { curva: "inout" }), mira(k(312.7), 1000, 720, 1.62, { curva: "inout" })]}
          medio={<>
            <A {...act(ABBY, 0, { ruta: [{ f: 0, x: 600, y: P }, { f: k(310.5), x: 940, y: P }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(310.6), v: { tronco: 26, hD: 80, cD: 40, hI: 70, cI: 50 } }], caras: [{ f: 0, v: "determinado" }], luz: BORDE_FRIO, enManoI: f < k(310.5) ? farol(f) : undefined, ajuste: (p, ff) => perfora ? { ...p, tronco: p.tronco + 6 * Math.sin(ff / 2) } : p })} />
            <g transform={`translate(${interpolate(f, [0, k(310.5), k(311.0)], [700, 1000, 1060], cl)},${P - 150 - 20 * u})`}><g transform={`rotate(${-30 - 60 * u})`}><Barreno s={1.1} giro={perfora ? (f * 40) % 360 : 0} /></g></g>
            {perfora && Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={1060 + Math.cos(f / 3 + i) * 50} cy={P - 6 - Math.abs(Math.sin(f / 4 + i)) * 30} r={6} fill="#fff" />)}
          </>}
          hud={<><H l={[grados(-18)]} /><Txt t="DRILLING A HOLE" a={k(311.2)} b={k(312.7) + 4} top={200} tam={50} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 53 · el corte: 8 pulgadas de hielo negro y claro ============
const p53: PlanB = {
  a: 312.7, b: 316.9, trans: { tipo: "luz", d: 8 },
  sfx: [[312.8, "drip", -10], [313.6, "wood_hit", -8], [314.3, "tick", 0], [314.4, "ice_crack", -14], [315.7, "ding", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={HieloCorte} pal={PAL} setProps={{ pulg: 8, agujero: 1, vara: interpolate(f, [k(313.2), k(313.8)], [0, 1], cl) }} seed={657} mano={1.6}
          claves={[mira(0, 1600, HC_SUP - 20, 1.45), mira(k(316.9), 1580, HC_SUP - 10, 1.38, { curva: "inout" })]}
          medio={<A {...act(ABBY, 1560, { ruta: [{ f: 0, x: 1560, y: HC_SUP - 24 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "arrodillado" }, { f: k(314.4), v: "señalar" }], caras: [{ f: 0, v: "determinado" }, { f: k(314.4), v: "feliz" }], luz: BORDE_FRIO })} />}
          hud={<><H l={[hielo([{ f: 0, v: 0 }, { f: k(314.3), v: 8, d: 14 }], k(314.2))]} /><Mano t={'8"'} x={760} y={330} desde={k(313.6)} tam={170} color="#bfe0ff" /><Txt t="CLEAR BLACK ICE" a={k(314.4)} b={k(316.9) + 4} top={200} tam={58} mano chip color="#bfe0ff" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 54 · la regla del hielo: 4" a pie · 5-7" moto · 8-12" auto ============
const p54: PlanB = {
  a: 316.9, b: 327.8, trans: { tipo: "corte" },
  sfx: [[317.0, "whoosh", -12], [320.6, "pop", -6], [321.4, "snow_step", -10, { dur: 1 }], [323.1, "pop", -6], [323.3, "snowmobile", -10, { dur: 2 }], [325.4, "pop", -6], [325.6, "car_pass", -10, { dur: 2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const pops = [k(320.6), k(323.1), k(325.4)].map((t) => interpolate(f, [t, t + 8], [0, 1], { ...cl, easing: (x) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2) }));
      const pulg = f < k(323.1) ? 4 : f < k(325.4) ? 6 : 10;
      const losas: [number, number, string][] = [[480, 4, '4"'], [1060, 6, '5–7"'], [1640, 10, '8–12"']];
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "invierno", arbolitos: 0 }} seed={658} mano={1.6}
          claves={[mira(0, 1060, 760, 1.1), mira(k(327.8), 1060, 760, 1.14, { curva: "inout" })]}
          medio={<>
            {losas.map(([x, p, t], i) => <g key={i} opacity={0.4 + 0.6 * Math.min(1, pops[i] * 2)}><rect x={x - 230} y={P} width={460} height={p * 16} fill="#2a3e5a" stroke="#bfe0ff" strokeWidth={4} /><rect x={x - 230} y={P} width={460} height={p * 16} fill="#7aa8d0" opacity={0.4} /><text x={x} y={P + p * 16 + 64} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={56} fill="#f6ecd2" stroke="#141018" strokeWidth={6} paintOrder="stroke">{t}</text></g>)}
            {pops[0] > 0 && <g transform={`translate(480,${P}) scale(${pops[0]}) translate(-480,${-P})`}><A {...act(ISLENO(3), 480, { escala: 1.0, dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "saludar" }], caras: [{ f: 0, v: "feliz" }], luz: BORDE_FRIO })} /></g>}
            {pops[1] > 0 && <g transform={`translate(1060,${P}) scale(${pops[1]})`}><MotoNieve x={0} y={0} s={1.6} /></g>}
            {pops[2] > 0 && <g transform={`translate(1640,${P}) scale(${pops[2]})`}><AutoChico x={0} y={0} s={1.5} color="#2f4a5e" /></g>}
          </>}
          hud={<><H l={[hielo(pulg)]} />
            <Txt t="RULE OF THUMB · CLEAR SOLID ICE" a={k(317.4)} b={k(320.4)} top={200} tam={50} chip />
            <Txt t="A PERSON ON FOOT" a={k(320.6)} b={k(323.0)} top={200} tam={52} chip />
            <Txt t="A SNOWMOBILE" a={k(323.1)} b={k(325.3)} top={200} tam={52} chip />
            <Txt t="A SMALL CAR" a={k(325.4)} b={k(327.8) + 4} top={200} tam={52} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 55 · 8": cien personas en fila, separadas, nunca amontonadas ============
const p55: PlanB = {
  a: 327.8, b: 335.2, trans: { tipo: "corte" },
  sfx: [[327.9, "snow_step", -8, { dur: 7 }], [331.2, "tick", -6], [332.1, "fail", -16], [333.2, "tick", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const sup = HC_SUP - 24;
      const off = (f * 1.6) % 240;
      const fl = interpolate(f, [k(331.2), k(331.6)], [0, 1], cl);
      return (
        <Escena Set={HieloCorte} pal={PAL} setProps={{ pulg: 8 }} seed={659} mano={1.6}
          claves={[mira(0, 1100, HC_SUP - 120, 1.35), mira(k(335.2), 1180, HC_SUP - 120, 1.3, { curva: "inout" })]}
          medio={<>{Array.from({ length: 14 }).map((_, i) => { const x = -600 + i * 240 + off; return <g key={i}><Figu x={x} y={sup} s={1.25} color={COLS[i % 9]} f={f} i={i} camina />{i > 0 && fl > 0 && <g opacity={fl}><path d={`M${x - 210},${sup - 190} h180`} stroke={AMBAR} strokeWidth={5} /><path d={`M${x - 210},${sup - 190} l14,-10 l0,20 Z M${x - 30},${sup - 190} l-14,-10 l0,20 Z`} fill={AMBAR} /><text x={x - 120} y={sup - 205} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={30} fill={AMBAR} stroke="#141018" strokeWidth={5} paintOrder="stroke">10 FT</text></g>}</g>; })}</>}
          hud={<><H l={[hielo(8)]} /><Txt t="100 PEOPLE · IN A LINE" a={k(328.6)} b={k(331.0)} top={200} tam={54} chip /><Txt t="SPREAD OUT · NEVER BUNCHED" a={k(331.2)} b={k(333.1)} top={200} tam={54} mano chip color={AMBAR} /><Txt t="ONLY IF IT'S CLEAR ICE" a={k(333.1)} b={k(335.2) + 4} top={200} tam={56} mano chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 56 · el hielo blanco lechoso es más débil: la mitad; una grieta fina ============
const p56: PlanB = {
  a: 335.2, b: 339.0, trans: { tipo: "corte" },
  sfx: [[335.3, "wind_cold", -18, { dur: 3.6 }], [336.6, "drop", -4], [336.7, "wood_hit", -6], [337.8, "ice_crack", -4], [338.3, "ice_crack", -8], [338.4, "tick", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const cae = interpolate(f, [k(336.2), k(336.65)], [0, 1], { ...cl, easing: (t) => t * t });
      const rebote = interpolate(f, [k(336.65), k(336.8), k(336.95)], [0, -14, 0], cl);
      const raja = interpolate(f, [k(337.8), k(338.2)], [0, 1], cl);
      const abre = interpolate(f, [k(338.2), k(338.6)], [0, 1], cl);
      const z = interpolate(f, [0, k(339.0)], [1.32, 1.42], cl);
      const Bloque: React.FC<{ x: number; claro: boolean }> = ({ x, claro }) => {
        const roto = !claro;
        const yP = 560 + (cae - 1) * 700 + rebote + (roto ? 40 * abre : 0);
        return (
          <g>
            <g transform={roto ? `rotate(${-5 * abre},${x},800)` : undefined}>
              <path d={roto && abre > 0 ? `M${x},560 L${x + 190},560 L${x + 170},640 L${x + 205},700 L${x + 180},800 L${x},800 Z` : `M${x},560 L${x + 380},560 L${x + 380},800 L${x},800 Z`} fill={claro ? "#1c2a3e" : "#e8eef4"} stroke={claro ? "#5a7aa0" : "#9aa8b8"} strokeWidth={6} />
              {claro && <><path d={`M${x + 40},590 L${x + 120},590`} stroke="#6a8ab0" strokeWidth={6} opacity={0.6} /><path d={`M${x + 260},760 L${x + 340},760`} stroke="#6a8ab0" strokeWidth={6} opacity={0.4} /></>}
              {!claro && Array.from({ length: abre > 0 ? 14 : 28 }).map((_, i) => <circle key={i} cx={x + 20 + ((i * 53) % (abre > 0 ? 160 : 340))} cy={580 + ((i * 37) % 200)} r={6 + (i % 3) * 3} fill="#ffffff" opacity={0.8} />)}
            </g>
            {roto && abre > 0 && <g transform={`rotate(${5 * abre},${x + 380},800)`}>
              <path d={`M${x + 190},560 L${x + 380},560 L${x + 380},800 L${x + 180},800 L${x + 205},700 L${x + 170},640 Z`} fill="#e8eef4" stroke="#9aa8b8" strokeWidth={6} />
              {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={x + 200 + ((i * 47) % 160)} cy={580 + ((i * 41) % 200)} r={6 + (i % 3) * 3} fill="#ffffff" opacity={0.8} />)}
            </g>}
            {roto && raja > 0 && abre === 0 && <path d={`M${x + 190},560 L${x + 170},640 L${x + 205},700 L${x + 180},800`} stroke="#141018" strokeWidth={7} fill="none" strokeDasharray={300} strokeDashoffset={300 * (1 - raja)} />}
            {cae > 0 && <g transform={`translate(${x + 190},${yP})`}>
              <path d="M-120,0 L120,0 L90,-110 L-90,-110 Z" fill="#3a3a44" stroke="#141018" strokeWidth={6} />
              <text x={0} y={-36} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={48} fill="#f6ecd2">1 TON</text>
            </g>}
            <text x={x + 190} y={880} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={54} fill={claro ? "#bfe0ff" : "#f6ecd2"} stroke="#141018" strokeWidth={8} paintOrder="stroke">{claro ? "CLEAR" : "CLOUDY"}</text>
            <text x={x + 190} y={940} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={40} fill="#cfd8e6" stroke="#141018" strokeWidth={6} paintOrder="stroke">8"</text>
            {f > k(338.3) && <text x={x + 190} y={300} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={96} fill={claro ? "#7ad08a" : "#ff6a5a"} stroke="#141018" strokeWidth={10} paintOrder="stroke" transform={`translate(${x + 190},300) scale(${interpolate(f, [k(338.3), k(338.5)], [0.3, 1], cl)}) translate(${-(x + 190)},-300)`}>{claro ? "✓" : "✗"}</text>}
          </g>
        );
      };
      return (
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, #2a3446 0%, #10141c 80%)" }}>
          <svg width={1920} height={1080} style={{ transform: `scale(${z})`, transformOrigin: "50% 68%" }}>
            <rect x={300} y={800} width={1320} height={16} rx={6} fill="#5a6a7a" />
            <Bloque x={460} claro />
            <Bloque x={1080} claro={false} />
          </svg>
          <H l={[hielo([{ f: 0, v: 8 }, { f: k(337.5), v: 4, d: 14 }])]} />
          <Txt t="SAME WEIGHT" a={k(336.3)} b={k(337.4)} top={150} tam={56} chip />
          <Txt t="HALF AS STRONG" a={k(337.5)} b={k(339.0) + 4} top={150} tam={62} mano chip color="#ff8a6a" />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

// ============ 57 · en un lago grande el hielo nunca es parejo (mapa de colores fríos) ============
const p57: PlanB = {
  a: 339.0, b: 343.6, trans: { tipo: "fundido", d: 10 },
  sfx: [[339.1, "wind_cold", -16, { dur: 4.5 }], [339.4, "sparkle", -14], [340.6, "tick", -6], [341.6, "tick", -6], [342.4, "ice_crack", -8], [342.6, "tick", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const CW = 80, X0 = 340, Y0 = 250, NI = 16, NJ = 9;
      const esp = (i: number, j: number) => Math.max(1, Math.min(14, Math.round(7 + 4.5 * Math.sin(i * 0.7 + j * 0.45) + 3 * Math.cos(j * 0.9 - i * 0.35))));
      const col = (t: number) => (t <= 3 ? "#c0352c" : t <= 5 ? "#e07a3a" : t <= 8 ? "#e8c45a" : t <= 11 ? "#6aa0d0" : "#2f5a9a");
      const camino = (u: number) => ({ x: X0 + 60 + u * (NI * CW - 120), y: Y0 + 520 - 260 * Math.sin(u * Math.PI * 0.9) });
      const u = interpolate(f, [k(339.6), k(343.4)], [0, 1], cl);
      const pp = camino(u);
      const ci = Math.floor((pp.x - X0) / CW), cj = Math.floor((pp.y - Y0) / CW);
      const aqui = esp(Math.max(0, Math.min(NI - 1, ci)), Math.max(0, Math.min(NJ - 1, cj)));
      const golpeV = Math.abs(Math.sin(f / 5)) * 18;
      const z = interpolate(f, [0, k(343.6)], [1, 1.1], cl);
      return (
        <AbsoluteFill style={{ background: "linear-gradient(#141a26, #0c1018)" }}>
          <svg width={1920} height={1080} style={{ transform: `scale(${z})`, transformOrigin: `${(pp.x / 1920) * 100}% ${(pp.y / 1080) * 100}%` }}>
            <defs><clipPath id="lago57"><ellipse cx={X0 + (NI * CW) / 2} cy={Y0 + (NJ * CW) / 2} rx={(NI * CW) / 2} ry={(NJ * CW) / 2} /></clipPath></defs>
            <ellipse cx={X0 + (NI * CW) / 2} cy={Y0 + (NJ * CW) / 2} rx={(NI * CW) / 2 + 14} ry={(NJ * CW) / 2 + 14} fill="#3a2e24" />
            <g clipPath="url(#lago57)">
              {Array.from({ length: NI * NJ }).map((_, n) => {
                const i = n % NI, j = Math.floor(n / NI);
                const op = interpolate(f, [k(339.3) + (i + j) * 1.4, k(339.3) + (i + j) * 1.4 + 6], [0, 1], cl);
                return <rect key={n} x={X0 + i * CW} y={Y0 + j * CW} width={CW + 1} height={CW + 1} fill={col(esp(i, j))} opacity={op} />;
              })}
              {[[2, 2], [7, 5], [12, 3], [5, 7], [14, 6]].map(([i, j], n) => f > k(340.4) + n * 4 && <text key={n} x={X0 + i * CW + CW / 2} y={Y0 + j * CW + CW / 2 + 14} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={38} fill="#fff" stroke="#141018" strokeWidth={6} paintOrder="stroke">{esp(i, j)}"</text>)}
            </g>
            <path d={Array.from({ length: 30 }).map((_, n) => { const q = camino(Math.min(u, n / 29)); return `${n ? "L" : "M"}${q.x},${q.y}`; }).join(" ")} stroke="#f6ecd2" strokeWidth={5} strokeDasharray="12 10" fill="none" />
            <g transform={`translate(${pp.x},${pp.y})`}>
              <line x1={34} y1={-90} x2={60} y2={-golpeV} stroke="#8a6a3a" strokeWidth={7} strokeLinecap="round" />
              <Figu x={0} y={0} s={1.1} color="#2f5a7a" f={f} camina />
              <rect x={70} y={-150} width={110} height={64} rx={14} fill="rgba(18,15,24,0.85)" stroke={col(aqui)} strokeWidth={5} />
              <text x={125} y={-104} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={40} fill={col(aqui)}>{aqui}"</text>
            </g>
            <g transform="translate(1720,330)">
              <rect x={-30} y={0} width={60} height={420} rx={10} fill="url(#ley57)" stroke="#f6ecd2" strokeWidth={3} />
              <defs><linearGradient id="ley57" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f5a9a" /><stop offset="0.5" stopColor="#e8c45a" /><stop offset="1" stopColor="#c0352c" /></linearGradient></defs>
              <text x={0} y={-16} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={32} fill="#bfe0ff">THICK</text>
              <text x={0} y={460} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={32} fill="#ff8a6a">THIN</text>
            </g>
          </svg>
          <H />
          <Txt t="NEVER THE SAME THICKNESS" a={k(340.3)} b={k(343.6) + 4} top={140} tam={56} mano chip color="#bfe0ff" />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

// ============ 58 · Abby en la radio: «Gus, the channel's frozen. We're coming.» ============
const p58: PlanB = {
  a: 343.6, b: 348.2, trans: { tipo: "corte" },
  sfx: [[343.7, "static", -16, { dur: 4.5 }], [344.6, "ptt", -4], [347.4, "boom", -8]],
  el: (k) => (
    <Escena Set={EstacionIsla} pal={PAL} setProps={{ hora: "noche", temp: 0 }} seed={662} mano={2}
      claves={[mira(0, EI_PUNTOS.radio - 120, 600, 1.55), mira(k(348.2), EI_PUNTOS.radio - 130, 590, 1.7, { curva: "inout" })]}
      medio={<A {...act(ABBY_ADENTRO, EI_PUNTOS.radio - 150, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(344.4), v: "celular" }, { f: k(347.4), v: "manosCintura" }], caras: [{ f: 0, v: "neutral" }, { f: k(344.4), v: "determinado" }], habla: [[k(345.6), k(348.0)]], luz: { lado: 1, color: "#7dffb0", fuerza: 0.8 }, enManoD: (ff: number) => ff > k(344.4) && ff < k(347.4) ? <MicMano s={0.8} ptt /> : null })} />}
      hud={<><H /><GloboRadio t="Gus, the channel's frozen." x={560} y={340} desde={k(345.4)} hasta={k(347.3)} tam={56} lado={1} color="#f6ecd2" /><GloboRadio t="We're coming." x={560} y={340} desde={k(347.3)} hasta={k(348.2) + 6} tam={72} lado={1} color={AMBAR} /></>} />
  ),
};

// ============ 59 · Gus escucha, baja el micrófono y mira el living ============
const p59: PlanB = {
  a: 348.2, b: 350.5, trans: { tipo: "corte" },
  sfx: [[348.3, "static", -20, { dur: 1 }], [349.3, "tape", -6], [350.2, "chair", -8]],
  el: (k) => (
    <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 0.8, aguja: 0.62 }} seed={663} mano={2}
      claves={[mira(0, RG_PUNTOS.silla + 30, 640, 2.0), mira(k(350.5), RG_PUNTOS.silla + 10, 650, 2.1, { curva: "inout" })]}
      medio={<A {...act(GUS_RADIO, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 25, cI: 50 } }, { f: k(349.2), v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 40, cD: 60, hI: 25, cI: 50 } }, { f: k(349.8), v: { tronco: -6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 20, cD: 30, hI: 20, cI: 40 } }], caras: [{ f: 0, v: "sorpresa" }, { f: k(349.6), v: "duda" }], miradas: [{ f: 0, v: { x: 0.4, y: 0 } }, { f: k(350.0), v: { x: -0.8, y: 0 } }], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 }, enManoD: (ff: number) => ff < k(349.4) ? <MicMano s={0.8} /> : null })} />}
      hud={<H />} />
  ),
};

const p59b: PlanB = {
  a: 350.5, b: 351.9, trans: { tipo: "corte" },
  sfx: [[350.55, "creak", -10], [351.0, "wind_soft", -22, { dur: 0.9 }]],
  el: (k) => (
    <Escena Set={GranjaLiving} pal={PAL} setProps={{ hora: "noche", farol: 1 }} seed={667} mano={2}
      claves={[mira(0, L.mesa - 560, 610, 1.18), mira(k(351.9), L.mesa - 520, 610, 1.06, { curva: "inout" })]}
      medio={<>
        {DIEZ.filter((l) => l !== GUS).map((l, i) => <A key={i} {...act(l, L.mesa - 640 + i * 120, { dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: i % 3 ? "duda" : "neutral" }], miradas: [{ f: 0, v: { x: -0.5, y: 0 } }], seed: 40 + i })} />)}
        <A {...act(GUS, L.mesa - 1080, { escala: 1.2, ruta: [{ f: 0, x: L.mesa - 1080, y: P + 40 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(351.0), v: "manosCintura" }], caras: [{ f: 0, v: "duda" }], luz: BORDE_CALIDO })} />
      </>}
      hud={<H />} />
  ),
};

// ============ 60 · diez personas, un perro, un sótano ============
const p60: PlanB = {
  a: 351.9, b: 355.6, trans: { tipo: "corte" },
  sfx: [[351.95, "tick", -4], [352.4, "tick", -8], [352.8, "tick", -8], [353.6, "dog_tail", -6, { dur: 1.2 }], [354.1, "creak", -6], [354.7, "door", -8], [355.0, "pop", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const X0 = L.mesa - 1200;
      return (
        <Escena Set={GranjaLiving} pal={PAL} setProps={{ hora: "noche", farol: 1 }} seed={664} mano={2}
          claves={[mira(0, L.mesa - 420, 600, 0.95), mira(k(354.0), L.mesa - 420, 610, 0.95), mira(k(355.0), L.mesa - 420, 960, 0.95, { curva: "inout" })]}
          medio={<>
            <rect x={X0 - 400} y={P + 6} width={2400} height={900} fill="#2a1e16" />
            <g transform={`translate(${X0 + 300},${P + 60})`} opacity={interpolate(f, [k(354.2), k(354.8)], [0, 1], cl)}>
              <rect x={0} y={0} width={1100} height={330} rx={10} fill="#4a3424" stroke="#1a120c" strokeWidth={8} />
              <g transform="translate(80,0)">{Array.from({ length: 7 }).map((_, i) => <rect key={i} x={-30} y={30 + i * 44} width={60} height={10} fill="#8a6a3a" />)}<line x1={-30} y1={0} x2={-30} y2={330} stroke="#8a6a3a" strokeWidth={10} /><line x1={30} y1={0} x2={30} y2={330} stroke="#8a6a3a" strokeWidth={10} /></g>
              <rect x={220} y={90} width={330} height={14} fill="#6a4a2a" /><rect x={220} y={190} width={330} height={14} fill="#6a4a2a" />
              {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={234 + i * 40} y={i % 2 ? 48 : 52} width={26} height={40} rx={6} fill={["#c0352c", "#e8c45a", "#7ad08a"][i % 3]} opacity={0.85} />)}
              {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={234 + i * 40} y={148} width={26} height={40} rx={6} fill={["#e07a3a", "#c0352c"][i % 2]} opacity={0.85} />)}
              {Array.from({ length: 6 }).map((_, i) => { const sx = 640 + (i % 3) * 140, sy = 330 - (i < 3 ? 0 : 110); const s = interpolate(f, [k(354.8) + i * 2, k(354.8) + i * 2 + 6], [0, 1], cl); return <g key={i} transform={`translate(${sx},${sy}) scale(${s})`}><path d="M-60,0 Q-70,-90 -30,-120 L30,-120 Q70,-90 60,0 Z" fill="#b08a5a" stroke="#5a4020" strokeWidth={5} /><path d="M-30,-120 Q0,-140 30,-120" stroke="#5a4020" strokeWidth={5} fill="none" /><text x={0} y={-44} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={26} fill="#5a4020">POTATOES</text></g>; })}
              <Halo x={560} y={60} r={260} color={AMBAR} fuerza={0.5} />
              <circle cx={560} cy={60} r={12} fill={AMBAR} />
            </g>
            <Ore x={L.mesa - 960} y={P} dir={1} s={0.85} f={f} echado={0.6} cabeza={f > k(353.4) ? -20 : 14} cola={f > k(353.4) ? 1 : 0.2} />
            {DIEZ.map((l, i) => <A key={i} {...act(l, L.mesa - 760 + i * 120, { dir: [{ f: 0, v: i < 5 ? 1 : -1 }], caras: [{ f: 0, v: i % 3 ? "duda" : "neutral" }], miradas: [{ f: 0, v: { x: 0, y: -0.2 } }], seed: 30 + i })} />)}
            {DIEZ.map((_, i) => { const s = interpolate(f, [k(352.0) + i * 2.4, k(352.0) + i * 2.4 + 5], [0, 1], cl); return s > 0 && <g key={i} transform={`translate(${L.mesa - 760 + i * 120},${P - 480}) scale(${s})`}><circle r={30} fill={AMBAR} stroke="#141018" strokeWidth={5} /><text y={13} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={36} fill="#141018">{i + 1}</text></g>; })}
            {f > k(353.6) && <g transform={`translate(${L.mesa - 960},${P - 200}) scale(${interpolate(f, [k(353.6), k(353.8)], [0, 1], cl)})`}><circle r={30} fill="#7ad08a" stroke="#141018" strokeWidth={5} /><text y={13} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={36} fill="#141018">1</text></g>}
          </>}
          hud={<><H />{["TEN PEOPLE", "ONE DOG", "ONE ROOT CELLAR"].map((t, i) => <Txt key={t} t={t} a={k([351.95, 353.0, 354.1][i])} b={k(355.6) + 4} top={140 + i * 80} left={1300} tam={54} mano chip color={AMBAR} />)}</>} />
      );
    };
    return <Pl />;
  },
};

// ============ 61 · y noventa desconocidos: la fila de faroles saliendo de la isla por el camino de arbolitos ============
const p61: PlanB = {
  a: 355.6, b: 357.3, trans: { tipo: "fundido", d: 10 },
  sfx: [[355.7, "wind_cold", -14, { dur: 1.7 }], [355.9, "snow_step", -12, { dur: 1.4 }], [356.3, "tick", -6], [356.9, "tick", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const n = Math.round(interpolate(f, [k(355.9), k(357.0)], [0, 90], cl));
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "noche", arbolitos: 1, islaLuz: 0.4 }} seed={665} mano={1.6}
          claves={[mira(0, 1150, 540, 1.05), mira(k(357.3), 1170, 560, 0.94, { curva: "inout" })]}
          medio={<FilaCamino n={Math.max(1, Math.round(n * 0.66))} t0={0.3} t1={0.99} avanza={interpolate(f, [0, k(357.3)], [0, 0.03], cl)} faroles />}
          hud={<><H /><div style={{ position: "absolute", left: 0, right: 0, top: 780, textAlign: "center", fontFamily: "Fredoka, sans-serif", fontWeight: 700, fontSize: 110, color: AMBAR, textShadow: "0 6px 20px rgba(0,0,0,0.8)" }}>{n} STRANGERS</div></>} />
      );
    };
    return <Pl />;
  },
};

const p61b: PlanB = {
  a: 357.3, b: 359.1, trans: { tipo: "corte" },
  sfx: [[357.35, "snow_step", -8, { dur: 1.7 }], [357.9, "ice_crack", -18], [358.2, "wind_cold", -16, { dur: 0.9 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "noche", arbolitos: 1, islaLuz: 0.4 }} seed={668} mano={1.6}
          claves={[mira(0, 980, 650, 1.3), mira(k(359.1), 1030, 650, 1.36, { curva: "inout" })]}
          medio={<>
            <FilaCamino n={30} t0={0.35} t1={0.8} avanza={interpolate(f, [0, k(359.1)], [0, 0.02], cl)} faroles />
            {[[700, "miedo", 2], [960, "determinado", 5], [1220, "duda", 8]].map(([x, c, s], i) => <A key={i} {...act(ISLENO(s as number), x as number, { escala: 1.2, ruta: [{ f: 0, x: x as number, y: P + 60 }, { f: k(359.1), x: (x as number) + 110, y: P + 60 }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: c as never }], miradas: [{ f: 0, v: { x: 0.3, y: 0.1 } }], luz: { lado: 1, color: AMBAR, fuerza: 0.9 }, enManoD: farol(f, 1), seed: 90 + i })} />)}
          </>}
          hud={<><H /><Txt t="ACROSS A FROZEN LAKE" a={k(357.4)} b={k(359.1) + 4} top={150} tam={56} chip color="#bfe0ff" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 62 · después, noventa millas por la costa en enero ============
const p62: PlanB = {
  a: 359.1, b: 362.3, trans: { tipo: "corte" },
  sfx: [[359.2, "paper", -10], [359.7, "pencil", -8, { dur: 1.8 }], [359.8, "snow_step", -14, { dur: 2.4 }], [361.6, "tick", -4], [361.7, "wind_cold", -14, { dur: 0.6 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const r = interpolate(f, [k(359.6), k(361.6)], [0, 1], cl);
      const z = interpolate(f, [0, k(362.3)], [1, 1.07], cl);
      return (
        <AbsoluteFill style={{ background: "radial-gradient(circle at 45% 40%, #34384a 0%, #12141c 78%)" }}>
          <svg width={1920} height={1080} style={{ transform: `scale(${z})`, transformOrigin: "40% 40%" }}>
            <g transform="translate(330,170)"><MapaLago x={0} y={0} w={800} isla={1} ruta={r} f={f} /></g>
            <rect x={0} y={900} width={1920} height={180} fill="#dfe6ee" />
            <path d="M0,900 Q480,880 960,895 Q1440,910 1920,890 L1920,905 L0,905 Z" fill="#c8d2de" />
            {Array.from({ length: 14 }).map((_, i) => { const x = ((i * 150 + (f - k(359.1)) * 3.2) % 2200) - 140; return <g key={i}><Figu x={x} y={990} s={0.95} color={COLS[i % 9]} f={f} i={i} camina /><circle cx={x + 22} cy={930} r={8} fill={AMBAR} /><Halo x={x + 22} y={930} r={50} color={AMBAR} fuerza={0.5} /></g>; })}
            {Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={(i * 397 + Math.sin(f / 20 + i) * 30) % 1920} cy={(i * 131 + f * 3) % 1080} r={2 + (i % 3)} fill="#fff" opacity={0.7} />)}
            <g transform="translate(1520,420)">
              <rect x={-200} y={-120} width={400} height={240} rx={26} fill="rgba(18,15,24,0.85)" stroke={AMBAR} strokeWidth={4} />
              <text x={0} y={30} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={120} fill={AMBAR}>{Math.round(90 * r)}</text>
              <text x={0} y={95} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={44} fill="#f6ecd2">MILES</text>
            </g>
          </svg>
          <H />
          <Txt t="JANUARY" a={k(361.4)} b={k(362.3) + 4} top={140} tam={66} mano chip color="#bfe0ff" />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

// ============ 63 · June abre el cuaderno: al lado del 10, «?»; y en letra chiquita, 110 ============
const p63: PlanB = {
  a: 362.3, b: 371.0, trans: { tipo: "corte" },
  sfx: [[362.4, "page", -4], [366.4, "pencil", -6, { dur: 0.8 }], [369.6, "pencil", -8, { dur: 1.2 }], [370.4, "boom", -10], [370.5, "tick", 0]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const z = interpolate(f, [k(362.3), k(369.2), k(370.6)], [1, 1.08, 2.3], { ...cl, easing: (t) => t * t * (3 - 2 * t) });
      const llama = 1 + 0.06 * Math.sin(f / 3) + 0.04 * Math.sin(f / 1.7);
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "70.8% 40.5%" }}>
            <Cuaderno abre={k(362.5)} lineas={[{ t: "POPULATION 10", desde: k(362.6), tam: 52 }, { t: "?", desde: k(366.4), tam: 72, color: "#b8382c", x: 1350, y: 384 }, { t: "110", desde: k(369.8), tam: 30, color: "#b8382c", x: 1360, y: 440 }]} />
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
              <g transform="translate(200,1000)">
                <rect x={-26} y={-150} width={52} height={150} rx={6} fill="#efe4c8" stroke="#8a7a5a" strokeWidth={3} />
                <path d={`M0,-150 Q${-14 * llama},-190 0,${-150 - 60 * llama} Q${14 * llama},-190 0,-150 Z`} fill={AMBAR} />
                <Halo x={0} y={-180} r={420 * llama} color={AMBAR} fuerza={0.55} />
              </g>
            </svg>
          </div>
          <HudC lineas={[POP([{ f: 0, v: 10 }, { f: k(370.5), v: 110, d: 24 }], { fmt: (n) => (f > k(366.4) ? `${Math.round(n)}?` : `${Math.round(n)}`) }), isla(100)]} />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

// ============ 64 · ¿cruzarías el hielo? · la fila de faroles desde arriba · suscribite ============
const p64: PlanB = {
  a: 371.0, b: 376.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[371.1, "wind_cold", -18, { dur: 4.8 }], [373.8, "tick", -8], [375.3, "pop", -4], [375.8, "tick", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "noche", arbolitos: 1, islaLuz: 0.4 }} seed={666} mano={1.4}
          claves={[mira(0, 1520, 720, 1.4), mira(k(376.0), 1540, 730, 1.5, { curva: "inout" })]}
          medio={<>
            <FilaCamino n={60} t0={0.2} t1={0.99} avanza={interpolate(f, [0, k(376.0)], [0.06, 0.1], cl)} faroles />
            <A {...act(ABBY, 1720, { ruta: [{ f: 0, x: 1720, y: 1010 }], escala: 1.45, dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(371.6), v: { hD: 150, cD: 10, hI: 30, cI: 60 } }, { f: k(373.8), v: "señalar" }, { f: k(375.4), v: "celebrar" }], caras: [{ f: 0, v: "determinado" }, { f: k(373.8), v: "picaro" }, { f: k(375.4), v: "feliz" }], miradas: [{ f: 0, v: { x: -0.2, y: 0 } }, { f: k(373.8), v: { x: 0.6, y: 0.1 } }], luz: { lado: -1, color: AMBAR, fuerza: 1 }, enManoI: farol(f, 1) })} />
          </>}
          hud={<><HudC lineas={[POP(110, { fmt: (n) => `${Math.round(n)}?` }), isla(100)]} /><Txt t={"IF YOU WERE ON THAT ISLAND…\nWOULD YOU CROSS THE ICE?"} a={k(371.2)} b={k(373.8)} top={140} tam={56} chip /><Txt t="TELL ME IN THE COMMENTS" a={k(373.8)} b={k(375.3)} top={140} tam={56} mano chip color={AMBAR} /><BotonSub desde={k(375.2)} top={860} /></>} />
      );
    };
    return <Pl />;
  },
};
// set de la represa de Thomson de noche (para poner actores delante)
const RepresaSet: React.FC<{ capa: string; f: number; luz?: number }> = ({ capa, f, luz = 0 }) => {
  if (capa === "lejos") return <g><rect x={-3000} y={-3000} width={9000} height={6000} fill="#121830" />{Array.from({ length: 80 }).map((_, i) => <circle key={i} cx={-400 + (i * 331) % 2800} cy={-200 + (i * 137) % 700} r={1.8} fill="#fff" opacity={0.5 + 0.4 * Math.sin(f / 10 + i)} />)}</g>;
  if (capa !== "medio") return null;
  return (
    <g>
      <path d="M-1000,640 Q500,560 960,600 Q1500,640 3000,580 L3000,2000 L-1000,2000 Z" fill="#1a2030" />
      <rect x={300} y={560} width={1320} height={200} fill="#5a5e6a" />
      {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={330 + i * 120} y={580} width={60} height={180} fill="#4a4e5a" />)}
      {Array.from({ length: 11 }).map((_, i) => <path key={i} d={`M${360 + i * 120},760 q10,${80 + Math.sin(f / 4 + i) * 10} 0,170`} stroke="#8aa8d0" strokeWidth={30} opacity={0.35} fill="none" />)}
      <rect x={-1000} y={930} width={4000} height={1100} fill="#0e121c" />
      <rect x={860} y={470} width={200} height={90} fill="#3a3e4a" /><rect x={930} y={500} width={60} height={40} fill={luz > 0 ? AMBAR : "#20242e"} opacity={0.3 + 0.7 * luz} />
      {luz > 0 && <><Halo x={960} y={520} r={520} color={AMBAR} fuerza={0.45 * luz} /><ellipse cx={960} cy={1000} rx={520} ry={70} fill={AMBAR} opacity={0.18 * luz} /></>}
    </g>
  );
};

// ============ 65 · próximo: la represa de Thomson de noche, una sola luz se prende ============
const p65: PlanB = {
  a: 376.0, b: 381.9, trans: { tipo: "fundido", d: 12 },
  sfx: [[376.1, "riser", -14, { dur: 3 }], [377.9, "lock", -4], [378.0, "drone", -18, { dur: 3.8 }], [378.7, "pop", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const luz = interpolate(f, [k(377.9), k(378.3)], [0, 1], cl);
      const lz = { lado: 1 as const, color: luz > 0 ? AMBAR : "#8aa8d0", fuerza: 0.35 + 0.8 * luz };
      return (
        <Escena Set={RepresaSet} pal={PAL} setProps={{ luz }} seed={669} mano={1.4}
          claves={[mira(0, 960, 560, 1.0), mira(k(381.9), 960, 540, 1.08, { curva: "inout" })]}
          medio={<>
            <A {...act(GUS, 430, { ruta: [{ f: 0, x: 430, y: 1010 }], escala: 1.15, dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "brazosCruzados" }, { f: k(378.2), v: "parado" }], caras: [{ f: 0, v: "neutral" }, { f: k(378.0), v: "sorpresa" }, { f: k(379.2), v: "feliz" }], miradas: [{ f: 0, v: { x: 0.4, y: -0.3 } }], luz: lz })} />
            <A {...act(JUNE, 1490, { ruta: [{ f: 0, x: 1490, y: 1010 }], escala: 1.15, dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(378.4), v: "señalar" }], caras: [{ f: 0, v: "duda" }, { f: k(378.0), v: "sorpresa" }, { f: k(379.0), v: "determinado" }], miradas: [{ f: 0, v: { x: -0.4, y: -0.3 } }], luz: { ...lz, lado: -1 as const }, enManoI: <g transform="scale(0.5) rotate(-10)"><CuadernoCenso /></g> })} />
          </>}
          hud={<><HudC lineas={[POP(110, { fmt: (n) => `${Math.round(n)}?` }), isla(100)]} /><Proximo ep={7} titulo="How Long to Rebuild Electricity?" desde={k(378.5)} /></>} />
      );
    };
    return <Pl />;
  },
};

const p09b: PlanB = { ...p09, el: (k) => { const base = p09.el(k); return <>{base}{p09h(k)}</>; } };

export const PLANOS_LC06: PlanB[] = [p00, p01, p02, p02b, p03, p04, p05, p06, p07, p08, p09b, p10, p11, p12, p13, p14, p15, p16, p16b, p17, p18, p19, p19b, p20, p21, p22, p23, p23b, p24, p25, p25b, p26, p27, p27b, p28, p29, p30, p31, p32, p33, p34, p34b, p35, p36, p37, p37b, p38, p39, p40, p41, p42, p43, p44, p45, p46, p47, p48, p48b, p49, p49b, p50, p51, p52, p53, p54, p55, p56, p57, p58, p59, p59b, p60, p61, p61b, p62, p63, p64, p65];
export const LC06 = armar(PLANOS_LC06);

export const Lc06: React.FC = () => {
  useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Montaje planos={LC06.planos} />
    </AbsoluteFill>
  );
};
