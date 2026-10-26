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
import { Isla, ISLA_PUNTOS, LagoHelado, enCamino, LH_HZ, HieloCorte, HC_SUP, PX_PULG, EstacionIsla, EI_PUNTOS, IslaLejana, IglesiaDentro, IG_PUNTOS, Bancos, LagoAbierto, LA_SUP, MotoNieve, AutoChico, Windsled, Lobo } from "../census/lcc/sets6";
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
  sfx: [[1.3, "waves", -18, { dur: 3.8 }], [3.0, "pencil", -10, { dur: 1.4 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "dia", estacion: "verano" }} seed={601} mano={1.8} zLejos={0.3}
          claves={[mira(0, -600, 200, 0.6), mira(k(5.0), -300, 520, 0.62, { curva: "inout" })]}
          medio={<g>
            <path d={`M-1700,${P - 60} H200`} stroke="#f6ecd2" strokeWidth={6} strokeDasharray="20 14" opacity={interpolate(f, [k(2.8), k(3.4)], [0, 1], cl)} />
            <Escrito t="2.5 MI" x={-900} y={P - 100} f={f} desde={k(3.0)} tam={90} color="#f6ecd2" ancla="middle" />
          </g>}
          hud={<H sinIsla l={[]} />} />
      );
    };
    return <Pl />;
  },
};

// ============ 2 · un pueblo, un muelle, una iglesia, una escuela (pins a mano) ============
const p02: PlanB = {
  a: 5.0, b: 9.7, trans: { tipo: "corte" },
  sfx: [[5.6, "pop", -6], [6.8, "pop", -6], [7.2, "ding", -16], [7.9, "pop", -6], [8.9, "pop", -6]],
  el: (k) => (
    <Escena Set={Isla} pal={PAL} setProps={{ hora: "dia", estacion: "verano", pins: [k(6.6), k(7.0), k(8.1), k(5.5)] }} seed={602} mano={1.8}
      claves={[mira(0, 1500, 500, 0.5), mira(k(9.7), 1900, 520, 0.55, { curva: "inout" })]}
      hud={<H sinIsla />} />
  ),
};

// ============ 3 · de noche: las ventanas = la gente; MADELINE ISLAND rueda a 100 ============
const p03: PlanB = {
  a: 9.7, b: 16.8, trans: { tipo: "fundido", d: 12 },
  sfx: [[9.8, "wind_soft", -20, { dur: 6 }], [14.9, "tick", -2], [16.0, "tick", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "noche", estacion: "verano", luces: interpolate(f, [k(10.2), k(16.0)], [0, 1], cl) }} seed={603} mano={1.8}
          claves={[mira(0, 2400, 520, 0.5), mira(k(16.8), 2700, 600, 0.75, { curva: "inout" })]}
          hud={<><H sinIsla={f < k(14.9)} l={[]} />{f >= k(14.9) && <HudC lineas={[POP(10), isla([{ f: 0, v: 0 }, { f: k(15.0), v: 100, d: 40 }], k(14.9))]} />}
            <Txt t="THE LARGEST GROUP LEFT ON EARTH" a={k(11.0)} b={k(14.8)} top={860} tam={52} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 4 · el muelle: siluetas mirando el lago; una se da vuelta ============
const p04: PlanB = {
  a: 16.8, b: 20.0, trans: { tipo: "corte" },
  sfx: [[16.9, "waves", -18, { dur: 3 }], [17.4, "wood_step", -12], [18.6, "cloth", -10]],
  el: (k) => (
    <Escena Set={Isla} pal={PAL} setProps={{ hora: "ocaso", estacion: "verano", luces: 0.6 }} seed={604} mano={2}
      claves={[mira(0, -150, 620, 1.3), mira(k(20.0), -180, 640, 1.42, { curva: "inout" })]}
      medio={<>{[-420, -300, -160, -40, 80].map((x, i) => <A key={i} {...act(ISLENO(i + 2), x, { ruta: [{ f: 0, x, y: P }], dir: [{ f: 0, v: -1 }, ...(i === 2 ? [{ f: k(18.6), v: 1 as const }] : [])], caras: [{ f: 0, v: "neutral" }, ...(i === 2 ? [{ f: k(18.8), v: "duda" as const }] : [])], luz: { lado: -1, color: "#ffcf6e", fuerza: 1 }, seed: 20 + i })} />)}</>}
      hud={<H />} />
  ),
};

// ============ 5 · la isla chiquita en el lago enorme: «Could 100 people restart humanity?» ============
const p05: PlanB = {
  a: 20.0, b: 23.2, trans: { tipo: "fundido", d: 10 },
  sfx: [[20.1, "riser", -14, { dur: 2.6 }], [20.2, "waves", -20, { dur: 3 }]],
  el: (k) => (
    <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "ocaso", agua: 1, arbolitos: 0 }} seed={605} mano={1.5}
      claves={[mira(0, 1120, 470, 2.4), mira(k(23.2), 1120, 520, 0.9, { curva: "inout" })]}
      hud={<><H /><Txt t={"COULD 100 PEOPLE\nRESTART HUMANITY?"} a={k(20.2)} b={k(23.2) + 4} top={700} tam={74} color="#f6ecd2" /></>} />
  ),
};

// ============ 6 · «Let's count it.» el cuaderno: 10 y «100?» al margen ============
const p06: PlanB = {
  a: 23.2, b: 24.6, trans: { tipo: "corte" },
  sfx: [[23.25, "page", -4], [23.7, "pencil", -8]],
  el: (k) => <><Cuaderno abre={k(23.3)} lineas={[{ t: "POPULATION 10", desde: k(23.3), tam: 52 }, { t: "island: 100?", desde: k(23.7), tam: 46, color: "#b8382c" }]} /><H /></>,
};

// ============ 7 · el altillo: Gus al micrófono; la onda cruza el mapa del lago ============
const p07: PlanB = {
  a: 24.6, b: 30.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[24.7, "static", -16, { dur: 5 }], [25.2, "ptt", -6], [27.6, "paper", -12]],
  el: (k) => (
    <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 1, aguja: 0.62, isla: 1, linea: 1 }} seed={607} mano={2}
      claves={[mira(0, RG_PUNTOS.radio - 80, 680, 2.0), mira(k(27.2), RG_PUNTOS.radio + 200, 560, 1.5, { curva: "inout" }), mira(k(30.0), RG_PUNTOS.mapa, 380, 1.7, { curva: "inout" })]}
      medio={<A {...act(GUS_RADIO, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 25, cI: 50 } }], caras: [{ f: 0, v: "feliz" }], habla: [[k(25.0), k(27.0)]], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 }, enManoD: <MicMano s={0.8} ptt /> })} />}
      hud={<><H /><Txt t="LAST TIME" a={k(24.8)} b={k(26.8)} top={150} tam={44} chip /></>} />
  ),
};

// ============ 8 · Abby en la radio de la isla ============
const p08: PlanB = {
  a: 30.0, b: 34.9, trans: { tipo: "corte" },
  sfx: [[30.1, "static", -18, { dur: 4.5 }], [31.0, "cloth", -10], [32.4, "ptt", -6]],
  el: (k) => (
    <Escena Set={EstacionIsla} pal={PAL} setProps={{ hora: "noche", temp: 54, afuera: "verano" }} seed={608} mano={2}
      claves={[mira(0, EI_PUNTOS.radio - 40, 600, 1.5), mira(k(34.9), EI_PUNTOS.mapa - 300, 520, 1.25, { curva: "inout" })]}
      medio={<A {...act(ABBY_ADENTRO, EI_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hI: 160, cI: 40, hD: 30, cD: 50 } }, { f: k(31.4), v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 25, cI: 50 } }], caras: [{ f: 0, v: "feliz" }], habla: [[k(32.4), k(34.6)]], luz: { lado: 1, color: "#7dffb0", fuerza: 0.8 }, enManoD: (ff: number) => ff > k(31.4) ? <MicMano s={0.8} ptt /> : null })} />}
      hud={<><H /><Txt t={"ABBY LACROIX · 40\nFORMER PARK RANGER"} a={k(30.4)} b={k(33.0)} top={820} tam={50} chip /><Txt t="APOSTLE ISLANDS · WISCONSIN" a={k(33.0)} b={k(34.9) + 4} top={860} tam={48} chip /></>} />
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
          claves={antes ? [mira(0, x0 + 300, 560, 0.85), mira(k(38.4), x0 + 500, 560, 0.9, { curva: "inout" })] : [mira(0, x0 + 400, 600, 1.05), mira(k(41.9), x0 + 450, 620, 1.15, { curva: "inout" })]}
          medio={antes
            ? <>{Array.from({ length: 12 }).map((_, i) => <A key={i} {...act(ISLENO(i), x0 - 200 + i * 110, { ruta: [{ f: 0, x: x0 - 200 + i * 110, y: P }, { f: k(38.4), x: x0 - 200 + i * 110 + (i % 2 ? 120 : -120), y: P }], escala: 0.8, dir: [{ f: 0, v: i % 2 ? 1 : -1 }], caras: [{ f: 0, v: i % 3 ? "feliz" : "risa" }], seed: i })} />)}<Bici x={x0 + 200} y={P} /></>
            : <>
              <Bici x={x0 + 120} y={P} tirada /><Bici x={x0 + 700} y={P} tirada color="#2f5a7a" />
              <g transform={`translate(${x0 + 420},${P})`}><rect x={-90} y={-60} width={180} height={12} fill="#7a5a3e" /><rect x={-80} y={-48} width={10} height={48} fill="#5a4030" /><rect x={70} y={-48} width={10} height={48} fill="#5a4030" /><rect x={30} y={-84} width={26} height={24} rx={4} fill="#e8e4da" /></g>
              {[0, 1, 2, 3].map((i) => <A key={i} {...act(ISLENO(i + 9), x0 + 260 + i * 120, { dir: [{ f: 0, v: i < 2 ? 1 : -1 }], caras: [{ f: 0, v: "miedo" }, { f: k(40.4), v: "triste" }], miradas: [{ f: 0, v: { x: i < 2 ? 1 : -1, y: 0 } }], seed: 40 + i })} />)}
            </>}
          hud={<H l={[]} pop={undefined} />} />
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
          claves={[mira(0, -700, 600, 0.75), mira(k(47.5), -100, 620, 0.95, { curva: "inout" })]}
          medio={<>
            {[0, 1, 2].map((i) => <Lancha key={i} x={interpolate(f, [k(42.0) + i * 20, k(44.0) + i * 30], [-2600 - i * 300, -900 + i * 180], cl)} y={P + 40 + i * 60} s={0.9 - i * 0.1} color={["#e8e4da", "#c8382c", "#2f6a5a"][i]} gente={2 + i} />)}
            {Array.from({ length: 6 }).map((_, i) => <A key={i} {...act(ISLENO(i + 13), 0, { ruta: [{ f: 0, x: -440 + i * 20, y: P - 10 }, { f: k(44.4) + i * 8, x: -440 + i * 20, y: P - 10 }, { f: k(47.4), x: 160 + i * 110, y: P }], escala: 0.85, dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: i % 2 ? "cansado" : "feliz" }], seed: 50 + i })} />)}
          </>}
          hud={<><HudC lineas={[POP(10), isla([{ f: 0, v: 4 }, { f: k(43.0), v: 37, d: 30 }, { f: k(46.4), v: 68, d: 26 }])]} /><Txt t="BAYFIELD · ASHLAND · FISHING BOATS · CABINS" a={k(42.4)} b={k(47.5)} top={150} tam={42} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 11 · desde la costa de noche: ven las luces del generador y cruzan a remo ============
const BoteRemo: React.FC<{ x: number; y: number; s?: number; f: number; rema?: boolean }> = ({ x, y, s = 1, f, rema }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><path d="M-110,-24 L110,-24 L84,10 L-84,10 Z" fill="#7a5a3e" />{rema && <path d={`M-10,-40 L${-90 + Math.sin(f / 5) * 30},20`} stroke="#c8a878" strokeWidth={6} />}<Figu x={0} y={-24} s={0.55} color="#2f5a7a" /></g>
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
          claves={[mira(0, 1300, 700, 0.9), mira(k(52.3), 1150, 560, 1.4, { curva: "inout" })]}
          medio={<>
            <rect x={-2000} y={1040} width={6000} height={800} fill="#3a3a44" /><rect x={-2000} y={1036} width={6000} height={8} fill="#5a5a64" />
            {!bote ? <A {...act(ISLENO(4), 1500, { ruta: [{ f: 0, x: 1500, y: 1040 }], escala: 1.3, dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "sorpresa" }], miradas: [{ f: 0, v: { x: -0.7, y: -0.3 } }], luz: { lado: -1, color: AMBAR, fuerza: 0.4 } })} />
              : <BoteRemo x={interpolate(f, [k(49.6), k(52.3)], [1500, 1260], cl)} y={interpolate(f, [k(49.6), k(52.3)], [1020, 820], cl)} s={interpolate(f, [k(49.6), k(52.3)], [1.2, 0.7], cl)} f={f} rema />}
          </>}
          hud={<><HudC lineas={[POP(10), isla(68)]} /><Txt t="THE GENERATOR LIGHTS" a={k(48.4)} b={k(50.6)} top={150} tam={44} chip /></>} />
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
          claves={[mira(0, IG_PUNTOS.puerta + 260, 480, 1.9), mira(k(56.5), IG_PUNTOS.puerta + 300, 460, 2.2, { curva: "inout" })]}
          medio={<A {...act(ABBY_ADENTRO, IG_PUNTOS.puerta + 440, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(54.4), v: { hD: 120, cD: 30 } }, { f: k(55.4), v: "manosCintura" }], caras: [{ f: 0, v: "determinado" }, { f: k(55.4), v: "feliz" }] })} />}
          hud={<><HudC lineas={[POP(10), isla([{ f: 0, v: 68 }, { f: k(53.0), v: 99, d: 50 }, { f: k(55.3), v: 100, d: 6 }])]} /><Txt t="SEPTEMBER" a={k(52.6)} b={k(56.5)} top={150} tam={44} chip /></>} />
      );
    };
    return <Pl />;
  },
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
          claves={[mira(0, L.mesa - 100, 600, 0.95), mira(k(66.6), L.mesa, 600, 1.05, { curva: "inout" }), mira(k(68.7), L.mesa + 40, 560, 1.4, { curva: "inout" })]}
          medio={<>
            <Ore x={L.mesa - 700} y={P} dir={1} s={0.8} f={f} echado={0.7} cabeza={mira10 ? -10 : 14} />
            {DIEZ.map((l, i) => <A key={i} {...act(l, L.mesa - 420 + i * 95 + (i > 4 ? 80 : 0), { asiento: [{ f: 0, v: l.alto ? 40 : 60 }], poses: [{ f: 0, v: "sentado" }], dir: [{ f: 0, v: i < 5 ? 1 : -1 }], caras: [{ f: 0, v: "neutral" }, { f: k(66.8), v: i % 2 ? "miedo" : "duda" }], miradas: [{ f: 0, v: { x: 0, y: 0.5 } }, { f: k(66.8) + i * 2, v: { x: i < 5 ? 1 : -1, y: -0.2 } }], seed: 30 + i })} />)}
            <g transform={`translate(${L.mesa + 40},${P - 182})`}><rect x={-60} y={-70} width={120} height={70} rx={8} fill="#3a3a40" /><circle cx={30} cy={-36} r={18} fill="#7dffb0" opacity={0.8} /></g>
          </>}
          hud={<><HudC lineas={[POP(10, { color: mira10 && Math.floor(f / 6) % 2 ? "#ff6a5a" : undefined }), isla(100)]} /><Txt t="IS 10 PEOPLE ENOUGH?" a={k(66.6)} b={k(68.7) + 4} top={820} tam={70} mano chip color={AMBAR} /></>} />
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
      claves={[mira(0, L.mesa + 380, 600, 1.45), mira(k(71.0), L.mesa + 390, 590, 1.55, { curva: "inout" })]}
      medio={<A {...act(NAN, L.mesa + 320, { asiento: [{ f: 0, v: 60 }], poses: [{ f: 0, v: { tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 60, cD: 80, hI: 50, cI: 80, cabeza: 10 } }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "determinado" }], enManoD: <g transform="scale(0.8)"><Libro abierto /></g> })} />}
      hud={<><H l={[gen(1, k(69.6))]} /><Txt t="THE SCARY VERSION" a={k(69.0)} b={k(71.0) + 4} top={150} tam={48} chip color="#ff8a6a" /></>} />
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
  a: 71.0, b: 85.7, trans: { tipo: "fundido", d: 10 },
  sfx: [[71.2, "chalk", -6, { dur: 3 }], [75.6, "tick", -6], [77.2, "tick", -6], [78.8, "tick", -6], [80.4, "chalk", -8, { dur: 2 }], [83.2, "pop", -6], [84.2, "boom", -14]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Mural} pal={PAL} setProps={{ tono: "#1e2a26" }} seed={617} mano={1.6}
          claves={[mira(0, 960, 300, 1.15), mira(k(75.5), 960, 440, 0.9, { curva: "inout" }), mira(k(84.0), 960, 660, 0.95, { curva: "inout" }), mira(k(85.7), 960, 640, 1.05, { curva: "inout" })]}
          detras={<>
            <ArbolFam desde={k(71.3)} gens={4} paso={k(77.2) - k(75.6)} rojo={k(81.6)} />
            <A {...act(NAN, 300, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "señalar" }], caras: [{ f: 0, v: "determinado" }, { f: k(82.6), v: "triste" }], opacidad: (ff) => interpolate(ff, [k(71.0), k(71.6), k(75.0), k(75.5)], [0, 1, 1, 0], cl) })} />
          </>}
          hud={<><H l={[gen([{ f: 0, v: 1 }, { f: k(75.6), v: 2, d: 6 }, { f: k(77.2), v: 3, d: 6 }, { f: k(78.8), v: 4, d: 6 }])]} />
            <Mano t="INBREEDING" x={960} y={180} desde={k(84.1)} tam={130} color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 17 · los lobos en la isla nevada: de 6 a 2 ============
const p17: PlanB = {
  a: 85.7, b: 92.3, trans: { tipo: "fundido", d: 10 },
  sfx: [[85.8, "wind_cold", -14, { dur: 6 }], [87.4, "wind_soft", -18], [89.8, "snow_step", -14]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const vivos = Math.round(interpolate(f, [k(87.6), k(91.0)], [6, 2], cl));
      return (
        <Escena Set={IslaLejana} pal={PAL} setProps={{ tipo: "lobos", hora: "invierno" }} seed={618} mano={2}
          claves={[mira(0, 1200, 560, 0.75), mira(k(92.3), 1250, 600, 0.95, { curva: "inout" })]}
          medio={<>{Array.from({ length: 6 }).map((_, i) => <g key={i} opacity={i < vivos ? 1 : interpolate(f, [k(87.6) + (5 - i) * 18, k(87.6) + (5 - i) * 18 + 12], [1, 0], cl)}><Lobo x={700 + i * 150 + Math.sin(f / 40 + i) * 30} y={P - 30} s={0.7} f={f + i * 9} dir={i % 2 ? 1 : -1} echado={i >= 2 ? interpolate(f, [k(88.0) + (5 - i) * 18, k(88.0) + (5 - i) * 18 + 10], [0, 1], cl) : 0} /></g>)}</>}
          hud={<><H l={[gen(4)]} /><Txt t="WEAKER · SICKER · COLLAPSE" a={k(87.6)} b={k(92.3)} top={860} tam={54} mano chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 18 · el biólogo de campo; «50 / 500» gigante en el cielo ============
const p18: PlanB = {
  a: 92.3, b: 99.6, trans: { tipo: "corte" },
  sfx: [[92.4, "birds", -18, { dur: 3 }], [93.4, "cloth", -10], [97.0, "tick", -2], [97.4, "chalk", -6, { dur: 1.6 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={IslaLejana} pal={PAL} setProps={{ tipo: "lobos", hora: "invierno" }} seed={619} mano={2}
          claves={f < k(97.0) ? [mira(0, 2300, 620, 1.3), mira(k(97.0), 2280, 600, 1.45, { curva: "inout" })] : [mira(0, 1500, 300, 0.8), mira(k(99.6), 1500, 280, 0.85, { curva: "inout" })]}
          medio={<A {...act({ ...CIENTIFICO, accesorios: [{ t: "chaleco", color: "#6a7a3a" }, { t: "gorroLana", color: "#b2342a" }] }, 2300, { ruta: [{ f: 0, x: 2300, y: P - 20 }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 140, cD: 140, hI: 140, cI: 140, cabeza: -6 } }], caras: [{ f: 0, v: "determinado" }], luz: BORDE_FRIO })} />}
          hud={<><H l={[gen(4)]} />
            <Txt t="ENDANGERED SPECIES · RULE OF THUMB" a={k(93.0)} b={k(96.9)} top={860} tam={50} chip />
            <Mano t="50 / 500" x={960} y={360} desde={k(97.2)} tam={220} color="#f6ecd2" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 19 · 50 en fila sobre el hielo, y después 500 hasta el horizonte ============
const p19: PlanB = {
  a: 99.6, b: 110.4, trans: { tipo: "fundido", d: 10 },
  sfx: [[100.0, "snow_step", -10, { dur: 3 }], [103.4, "tick", -6], [104.4, "snow_step", -8, { dur: 5 }], [107.6, "tick", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const n50 = Math.round(interpolate(f, [k(100.0), k(103.4)], [0, 50], cl));
      const n500 = Math.round(interpolate(f, [k(104.0), k(108.4)], [0, 500], cl));
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "dia", arbolitos: 0 }} seed={620} mano={1.6}
          claves={[mira(0, 1400, 760, 1.25), mira(k(103.6), 1300, 650, 0.9, { curva: "inout" }), mira(k(110.4), 1120, 520, 0.55, { curva: "inout" })]}
          medio={<>
            {Array.from({ length: n500 }).map((_, i) => { const p = enCamino(0.35 + 0.64 * (i / 500), ((i % 5) - 2) * 40); return <Figu key={`b${i}`} x={p.x} y={p.y} s={p.s * 0.9} color={COLS[(i * 7) % 9]} />; }).reverse()}
            {Array.from({ length: n50 }).map((_, i) => { const p = enCamino(0.32 * (1 - i / 50), ((i % 2) - 0.5) * 120); return <Figu key={`a${i}`} x={p.x} y={p.y} s={p.s * 0.9} color={COLS[i % 9]} />; })}
          </>}
          hud={<><H l={[]} />
            <Txt t="~50 · AVOID THE WORST (SHORT TERM)" a={k(100.4)} b={k(104.0)} top={860} tam={48} chip />
            <Txt t="~500 · ENOUGH VARIETY (LONG RUN)" a={k(105.0)} b={k(110.4)} top={860} tam={48} chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 20 · Priya mide con la regla gigante: es una guía, no una ley ============
const p20: PlanB = {
  a: 110.4, b: 117.7, trans: { tipo: "corte" },
  sfx: [[110.6, "snow_step", -10], [111.4, "wood_hit", -6], [113.2, "wood_hit", -8, { dur: 1.5 }], [115.8, "chalk", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const larg = interpolate(f, [k(112.6), k(115.2)], [0, 1], cl);
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "dia", arbolitos: 0 }} seed={621} mano={2}
          claves={[mira(0, 900, 600, 1.0), mira(k(117.7), 1000, 620, 1.12, { curva: "inout" })]}
          medio={<>
            {Array.from({ length: 30 }).map((_, i) => <Figu key={i} x={1200 + i * 70} y={P - 40} s={0.55} color={COLS[i % 9]} />)}
            <g transform={`translate(400,${P + 10})`}><rect x={0} y={-24} width={1300 * larg} height={24} fill="#f2c14a" stroke="#8a6a2a" strokeWidth={3} />{Array.from({ length: Math.floor(26 * larg) }).map((_, i) => <rect key={i} x={i * 50} y={-24} width={3} height={i % 2 ? 12 : 22} fill="#2a1c18" />)}</g>
            <A {...act(PRIYA, 360, { ruta: [{ f: 0, x: 200, y: P }, { f: k(112.4), x: 360, y: P }], poses: [{ f: 0, v: "parado" }, { f: k(112.6), v: "agacharse" }, { f: k(115.4), v: "señalar" }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "determinado" }, { f: k(115.4), v: "feliz" }], habla: [[k(115.4), k(117.6)]], luz: BORDE_FRIO })} />
          </>}
          hud={<><H /><Txt t="A GUIDELINE, NOT A LAW" a={k(111.0)} b={k(114.4)} top={150} tam={54} mano chip color={AMBAR} /><Txt t="A FEELING FOR THE SCALE" a={k(115.4)} b={k(117.7) + 4} top={150} tam={54} mano chip color="#7ad08a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 21 · 10 lejos de la marca 50; 100 apenas la pasan; «Barely.» ============
const p21: PlanB = {
  a: 117.7, b: 122.8, trans: { tipo: "corte" },
  sfx: [[118.0, "tick", -2], [118.4, "boom", -10], [120.0, "tick", -2], [121.6, "boom", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const cien = f > k(119.8);
      const barely = f > k(121.5);
      const XM = 1700;
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "dia", arbolitos: 0 }} seed={622} mano={2}
          claves={barely ? [mira(0, XM - 30, 820, 2.6), mira(k(122.8), XM - 30, 820, 2.75, { curva: "inout" })] : cien ? [mira(0, XM - 500, 640, 0.75), mira(k(121.5), XM - 300, 660, 0.85, { curva: "inout" })] : [mira(0, 700, 640, 0.85), mira(k(119.8), 800, 640, 0.9, { curva: "inout" })]}
          medio={<>
            <rect x={XM} y={LH_HZ} width={14} height={1200} fill="#c0352c" /><text x={XM + 30} y={P - 220} fontFamily={F_FUENTE} fontWeight={900} fontSize={90} fill="#c0352c">50</text>
            {!cien && DIEZ.map((l, i) => <A key={i} {...act(l, 300 + i * 70, { escala: 0.7, dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "duda" }, { f: k(118.6), v: "triste" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }], seed: 30 + i, luz: BORDE_FRIO })} />)}
            {cien && Array.from({ length: 100 }).map((_, i) => { const x = XM - 4 - (i % 50) * 28 + (i === 0 ? 0 : 0); const y = P - 20 + Math.floor(i / 50) * 60; return <Figu key={i} x={i === 0 ? XM + 10 : x - 20} y={y} s={0.5} color={COLS[i % 9]} />; })}
          </>}
          hud={<><HudC lineas={[POP(10, { color: !cien && f > k(118.0) ? "#ff6a5a" : undefined }), isla(100)]} />
            {!cien && <Txt t="FAR BELOW 50" a={k(118.2)} b={k(119.8)} top={860} tam={60} mano chip color="#ff8a6a" />}
            {barely && <Mano t="BARELY." x={960} y={260} desde={k(121.6)} tam={140} />}</>} />
      );
    };
    return <Pl />;
  },
};
const F_FUENTE = "Arial Black, Arial";

// ============ 22 · la versión con esperanza: amanece, Nan da vuelta la página ============
const p22: PlanB = {
  a: 122.8, b: 127.0, trans: { tipo: "luz", d: 12 },
  sfx: [[122.9, "birds", -18, { dur: 3.5 }], [124.6, "page", -4]],
  el: (k) => (
    <Escena Set={GranjaLiving} pal={PAL} setProps={{ hora: "alba", farol: 0, sol: 0.8 }} seed={623} mano={2}
      claves={[mira(0, L.mesa + 380, 600, 1.45), mira(k(127.0), L.mesa + 380, 600, 1.55, { curva: "inout" })]}
      medio={<A {...act(NAN, L.mesa + 320, { asiento: [{ f: 0, v: 60 }], poses: [{ f: 0, v: { tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 60, cD: 80, hI: 50, cI: 80, cabeza: 10 } }, { f: k(124.6), v: { tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 90, cD: 40, hI: 50, cI: 80, cabeza: 4 } }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "neutral" }, { f: k(124.8), v: "feliz" }], enManoD: <g transform="scale(0.8)"><Libro abierto /></g> })} />}
      hud={<><H /><Txt t="THE HOPEFUL VERSION" a={k(123.2)} b={k(127.0) + 4} top={150} tam={50} chip color="#7ad08a" /></>} />
  ),
};

// ============ 23 · Pitcairn, 1790: el Bounty, menos de 30 ============
const p23: PlanB = {
  a: 127.0, b: 137.4, trans: { tipo: "fundido", d: 12 },
  sfx: [[127.1, "waves", -16, { dur: 10 }], [129.4, "tick", -6], [131.0, "creak", -12, { dur: 3 }], [134.0, "row", -14, { dur: 2.4 }], [135.6, "tick", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={IslaLejana} pal={PAL} setProps={{ tipo: "pitcairn", barco: interpolate(f, [k(129.0), k(133.0)], [0, 1], cl) }} seed={624} mano={2}
          claves={[mira(0, 1200, 500, 0.7), mira(k(133.0), 1900, 620, 0.95, { curva: "inout" }), mira(k(137.4), 1500, 680, 1.1, { curva: "inout" })]}
          medio={<>{f > k(133.6) && Array.from({ length: 8 }).map((_, i) => <Figu key={i} x={interpolate(f, [k(133.6) + i * 4, k(136.6) + i * 4], [2300, 1300 + i * 60], cl)} y={P - 6} s={0.6} color={i % 2 ? "#efe6d2" : "#c8382c"} f={f} i={i} camina />)}</>}
          hud={<><H l={[anio([{ f: 0, v: 1700 }, { f: k(129.4), v: 1790, d: 30 }], k(129.2))]} /><Txt t="PITCAIRN ISLAND · PACIFIC" a={k(127.3)} b={k(131.0)} top={150} tam={48} chip /><Txt t="HMS BOUNTY + TAHITIANS · FEWER THAN 30" a={k(131.6)} b={k(137.4)} top={860} tam={48} chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 24 · hoy: sus descendientes siguen ahí (y en Norfolk) ============
const p24: PlanB = {
  a: 137.4, b: 142.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[137.5, "waves", -18, { dur: 4.5 }], [138.6, "tick", -6], [140.2, "pencil", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={IslaLejana} pal={PAL} setProps={{ tipo: "hoy", casitas: 1 }} seed={625} mano={2}
          claves={[mira(0, 1200, 600, 0.85), mira(k(142.0), 1700, 560, 0.75, { curva: "inout" })]}
          medio={<g><Tiza d={`M1900,${P - 300} q300,-160 600,-40`} f={f} desde={k(140.0)} dur={20} color={AMBAR} ancho={8} o={1} /><Escrito t="NORFOLK ISLAND" x={2400} y={P - 380} f={f} desde={k(140.4)} tam={56} color="#f6ecd2" ancla="middle" /></g>}
          hud={<><H l={[anio([{ f: 0, v: 1790 }, { f: k(138.6), v: 2025, d: 30 }])]} /><Txt t="THEIR DESCENDANTS STILL LIVE THERE" a={k(138.0)} b={k(142.0) + 4} top={860} tam={50} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 25 · Tristan da Cunha, principios de 1800 ============
const p25: PlanB = {
  a: 142.0, b: 149.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[142.1, "wind_cold", -12, { dur: 7 }], [146.2, "tick", -6]],
  el: (k) => (
    <Escena Set={IslaLejana} pal={PAL} setProps={{ tipo: "tristan", casitas: 0.6 }} seed={626} mano={2}
      claves={[mira(0, 1200, 300, 0.8), mira(k(149.0), 1200, 600, 0.7, { curva: "inout" })]}
      hud={<><H l={[anio([{ f: 0, v: 2025 }, { f: k(146.2), v: 1816, d: 30 }], k(146.0))]} /><Txt t="TRISTAN DA CUNHA · SOUTH ATLANTIC" a={k(142.4)} b={k(146.0)} top={150} tam={48} chip /><Txt t="ONE OF THE MOST REMOTE ON EARTH" a={k(146.0)} b={k(149.0) + 4} top={860} tam={48} chip /></>} />
  ),
};

// ============ 26 · el árbol de 7 fundadores que se ensancha a ~250 ============
const p26: PlanB = {
  a: 149.0, b: 154.5, trans: { tipo: "corte" },
  sfx: [[149.2, "chalk", -6, { dur: 3 }], [152.6, "tick", -6], [153.4, "tick", -4]],
  el: (k) => (
    <Escena Set={Mural} pal={PAL} setProps={{ tono: "#1e2a30" }} seed={627} mano={1.6}
      claves={[mira(0, 960, 300, 1.2), mira(k(154.5), 960, 520, 0.8, { curva: "inout" })]}
      detras={<ArbolFam desde={k(149.2)} gens={4} paso={24} raiz={7} ancho={2.2} />}
      hud={<><H l={[{ id: "tristan", et: "TRISTAN", v: [{ f: 0, v: 7 }, { f: k(152.6), v: 250, d: 30 }], fmt: (n) => `~${Math.round(n)}`, color: "#f6ecd2", ent: k(149.4) }]} /><Txt t="A SMALL NUMBER OF FOUNDERS" a={k(151.6)} b={k(154.5) + 4} top={860} tam={52} chip /></>} />
  ),
};

// ============ 27 · lo que tenían y la isla no: barcos, visitas, genes nuevos ============
const p27: PlanB = {
  a: 154.5, b: 164.8, trans: { tipo: "fundido", d: 10 },
  sfx: [[154.6, "waves", -18, { dur: 10 }], [158.0, "drone", -10], [159.6, "boom", -18], [161.6, "wood_step", -12], [162.2, "wood_step", -12], [162.8, "wood_step", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={IslaLejana} pal={PAL} setProps={{ tipo: "tristan", casitas: 0.6, barco: interpolate(f, [k(155.0), k(160.0)], [0, 1], cl) }} seed={628} mano={2}
          claves={[mira(0, 1600, 640, 0.85), mira(k(160.4), 2200, 700, 1.1, { curva: "inout" }), mira(k(164.8), 1700, 720, 1.2, { curva: "inout" })]}
          medio={<>{f > k(160.6) && Array.from({ length: 5 }).map((_, i) => <Figu key={i} x={interpolate(f, [k(160.6) + i * 5, k(164.0) + i * 5], [2350, 1500 + i * 60], cl)} y={P - 6} s={0.65} color={AMBAR} f={f} i={i} camina />)}</>}
          hud={<><H />
            <Mano t="SHIPS." x={960} y={260} desde={k(159.5)} hasta={k(160.6)} tam={140} />
            <Txt t="VISITORS · NEW GENES" a={k(160.6)} b={k(164.8) + 4} top={860} tam={56} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 28 · «There are no more ships.» el muelle vacío, el ferry oxidado ============
const p28: PlanB = {
  a: 164.8, b: 166.5, trans: { tipo: "corte" },
  sfx: [[164.9, "waves", -10, { dur: 1.6 }], [165.0, "boom", -12]],
  el: (k) => (
    <Escena Set={Isla} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno", ferry: 1, ferryOxido: 1, nieve: false }} seed={629} mano={1.4}
      claves={[mira(0, -400, 640, 1.1), mira(k(166.5), -380, 650, 1.14, { curva: "inout" })]}
      hud={<><H /><Txt t="NO MORE SHIPS" a={k(165.0)} b={k(166.5) + 4} top={860} tam={62} mano chip color={AMBAR} /></>} />
  ),
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
            <A {...act(HALVORSEN, IG_PUNTOS.puerta, { ruta: [{ f: k(169.9), x: IG_PUNTOS.puerta, y: P }, { f: k(172.2), x: IG_PUNTOS.puerta + 380, y: P }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(172.4), v: "saludar" }], caras: [{ f: 0, v: "feliz" }], opacidad: (ff) => ff > k(169.9) ? 1 : 0 })} />
          </>}
          frente={<Bancos x0={650} n={8} />}
          hud={<><H /><Txt t="DR. HALVORSEN · RETIRED · ASHLAND" a={k(171.0)} b={k(174.0) + 4} top={860} tam={48} chip /></>} />
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
    <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 1, aguja: 0.62 }} seed={631} mano={2}
      claves={[mira(0, RG_PUNTOS.silla + 20, 620, 2.4), mira(k(177.4), RG_PUNTOS.silla + 20, 610, 2.6, { curva: "inout" })]}
      medio={<A {...act(GUS_RADIO, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 30, cD: 50, hI: 25, cI: 50 } }, { f: k(175.8), v: "brazosCruzados" }], caras: [{ f: 0, v: "neutral" }, { f: k(175.0), v: "enojo" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }, { f: k(175.0), v: { x: 0, y: -1 } }, { f: k(175.8), v: { x: -1, y: 0 } }], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 } })} />}
      hud={<><H /><Txt t="NO RELATION." a={k(174.4)} b={k(177.4) + 4} top={850} tam={66} mano chip color={AMBAR} /></>} />
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
          claves={[mira(0, IG_PUNTOS.tablero - 200, 520, 1.5), mira(k(183.7), IG_PUNTOS.tablero, 420, 2.0, { curva: "inout" })]}
          medio={<A {...act(HALVORSEN, IG_PUNTOS.tablero - 420, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { hD: 70, cD: 60, hI: 60, cI: 70 } }, { f: k(180.0), v: { hD: 130, cD: 20 } }], caras: [{ f: 0, v: "determinado" }], enManoI: <g transform="scale(1.2)"><Libro /></g> })} />}
          hud={<><H /><Txt t="WHO IS RELATED TO WHOM" a={k(178.0)} b={k(183.7) + 4} top={860} tam={52} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 32 · la herramienta más importante no es un tractor: es un cuaderno ============
const p32: PlanB = {
  a: 183.7, b: 189.8, trans: { tipo: "fundido", d: 10 },
  sfx: [[183.8, "wind_soft", -20, { dur: 5 }], [187.4, "sparkle", -10], [188.0, "page", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const luz = interpolate(f, [k(187.0), k(188.0)], [0.2, 1], cl);
      return (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "ocaso", estacion: "invierno" }} seed={633} mano={2}
          claves={[mira(0, GRANJA_PUNTOS.granero - 300, 640, 1.2), mira(k(189.8), GRANJA_PUNTOS.granero + 500, 600, 1.3, { curva: "inout" })]}
          medio={<>
            <g opacity={0.55}><Tractor x={GRANJA_PUNTOS.granero - 300} y={P} f={f} /></g>
            <g transform={`translate(${GRANJA_PUNTOS.granero + 520},${P - 200})`}><Halo x={0} y={0} r={500} color={AMBAR} fuerza={0.6 * luz} /><g transform="rotate(-8)"><CuadernoCenso s={1.4} /></g></g>
          </>}
          hud={<><H /><Txt t="NOT A TRACTOR" a={k(185.0)} b={k(187.2)} top={860} tam={60} mano chip color="#cfd8ff" /><Txt t="A NOTEBOOK" a={k(187.4)} b={k(189.8) + 4} top={860} tam={70} mano chip color={AMBAR} /></>} />
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
          claves={jun ? [mira(0, L.mesa - 300, 560, 1.9), mira(k(195.0), L.mesa - 300, 540, 2.1, { curva: "inout" })] : [mira(0, L.mesa, 600, 1.0), mira(k(192.4), L.mesa + 80, 600, 1.15, { curva: "inout" })]}
          medio={<>
            <A {...act(GUS, L.mesa + 100, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 110, cD: 60, hI: 100, cI: 60 } }], caras: [{ f: 0, v: "determinado" }], habla: [[k(190.0), k(192.4)]], enManoD: <rect x={-40} y={-60} width={80} height={100} fill="#f2ead8" /> })} />
            {DIEZ.filter((l) => l !== GUS && l !== JUNE).map((l, i) => <A key={i} {...act(l, L.mesa - 600 + i * 90 + (i > 3 ? 900 : 0), { asiento: [{ f: 0, v: l.alto ? 40 : 60 }], poses: [{ f: 0, v: "sentado" }], dir: [{ f: 0, v: i > 3 ? -1 : 1 }], caras: [{ f: 0, v: "neutral" }], seed: 30 + i })} />)}
            <A {...act(JUNE, L.mesa - 300, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(192.4), v: { hD: 160, cD: 20 } }], caras: [{ f: 0, v: "neutral" }, { f: k(192.6), v: "feliz" }], enManoD: (ff: number) => ff > k(192.4) ? <g transform="scale(0.6) rotate(-10)"><CuadernoCenso /></g> : null })} />
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
  a: 195.0, b: 202.5, trans: { tipo: "fundido", d: 10 },
  sfx: [[195.1, "wind_cold", -14, { dur: 3.6 }], [199.6, "metal_tool", -8], [200.6, "wood_hit", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(198.7)) return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno" }} seed={635} mano={2}
          claves={[mira(0, 1800, 520, 0.55), mira(k(198.7), 2300, 540, 0.6, { curva: "inout" })]}
          hud={<><H /><Txt t="FOOD" a={k(196.6)} b={k(198.7)} top={860} tam={80} mano chip color={AMBAR} /></>} />
      );
      return <><Suelo desde={k(199.4)} /><H /><Txt t="BEAUTIFUL · BUT SMALL" a={k(198.8)} b={k(200.6)} top={150} tam={52} chip /></>;
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
  sfx: [[202.6, "wind_cold", -16, { dur: 4 }], [204.8, "door", -8], [205.2, "ding", -10], [205.8, "tick", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = ISLA_PUNTOS.almacen;
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno" }} seed={636} mano={2}
          claves={[mira(0, x, 620, 1.5), mira(k(206.8), x + 40, 620, 1.65, { curva: "inout" })]}
          medio={<><Guirnalda x={x - 170} y={P - 214} w={340} f={f} />
            <A {...act(ABBY, x + 70, { ruta: [{ f: 0, x: x + 70, y: P }, { f: k(205.0), x: x + 70, y: P }, { f: k(206.8), x: x + 330, y: P }], dir: [{ f: 0, v: -1 }, { f: k(205.0), v: 1 }], poses: [{ f: 0, v: { hD: 80, cD: 20 } }, { f: k(205.0), v: "parado" }], caras: [{ f: 0, v: "triste" }], luz: BORDE_FRIO })} /></>}
          hud={<><H l={[dia(83, k(205.8))]} /><Txt t="EMPTY BY CHRISTMAS" a={k(203.0)} b={k(206.8) + 4} top={860} tam={58} mano chip color={AMBAR} /></>} />
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
  sfx: [[206.9, "waves", -16, { dur: 4 }], [207.8, "row", -6], [208.6, "pour", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={LagoAbierto} pal={PAL} setProps={{ hora: "dia", ola: 0.15, costa: false }} seed={637} mano={2}
          claves={[mira(0, 1000, 620, 1.3), mira(k(210.8), 1050, 600, 1.45, { curva: "inout" })]}
          medio={<BoteRed x={1000} y={LA_SUP} f={f} sube={interpolate(f, [k(207.4), k(209.0)], [0, 1], cl)} />}
          hud={<><H /><Txt t="LAKE TROUT · WHITEFISH" a={k(207.6)} b={k(210.8) + 4} top={860} tam={56} chip /></>} />
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
  a: 210.8, b: 221.1, trans: { tipo: "corte" },
  sfx: [[211.2, "box", -8], [211.8, "box", -8], [212.4, "box", -8], [213.0, "box", -8], [213.6, "tick", -4], [215.0, "tick", -6], [217.6, "boom", -12], [219.4, "door", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const xi = ISLA_PUNTOS.iglesia;
      const sotano = f > k(219.2);
      const meta = interpolate(f, [k(211.0), k(214.4)], [0, 640], cl);
      const real = Math.min(meta, interpolate(f, [k(217.2), k(217.9)], [640, 240], cl));
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno" }} seed={638} mano={2}
          claves={sotano ? [mira(0, xi + 300, 700, 1.6)] : [mira(0, xi + 260, 700, 1.05), mira(k(214.4), xi + 260, 380, 0.85, { curva: "inout" }), mira(k(217.0), xi + 400, 560, 0.85, { curva: "inout" })]}
          medio={<>
            <Torre x={xi + 300} alto={f < k(217.2) ? meta : real} />
            {f > k(217.2) && <rect x={xi + 210} y={P - 640} width={180} height={400} fill="none" stroke="#c0352c" strokeWidth={6} strokeDasharray="14 10" />}
            {f > k(214.9) && <><Torre x={xi + 600} alto={64} ancho={120} /><text x={xi + 600} y={P - 90} textAnchor="middle" fontFamily={F_FUENTE} fontWeight={900} fontSize={32} fill="#2a1c18">FARM</text></>}
            {sotano && <g transform={`translate(${xi + 300},${P})`}><path d="M-160,0 L-120,-90 L120,-90 L160,0 Z" fill="#5a4030" /><rect x={-100} y={-80} width={200} height={70} fill="#2a1e16" />{[0, 1, 2].map((i) => <ellipse key={i} cx={-40 + i * 40} cy={-24} rx={18} ry={13} fill="#b88a4a" />)}</g>}
          </>}
          hud={<><H l={[kcal([{ f: 0, v: 0 }, { f: k(211.6), v: 73000000, d: 60 }], k(211.2))]} />
            {f > k(214.9) && f < k(217.0) && <Txt t="10× THE FARM" a={k(214.9)} b={k(217.0)} top={860} tam={64} mano chip color={AMBAR} />}
            <Txt t="FISH ALONE CAN'T DO IT" a={k(217.2)} b={k(219.2)} top={860} tam={58} mano chip color="#ff8a6a" />
            <Txt t="ROOT CELLARS: NEARLY EMPTY" a={k(219.4)} b={k(221.1) + 4} top={860} tam={56} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 38 · la cuenta por radio: June y el doctor ============
const Columnas: React.FC<{ desde: number; x: number }> = ({ desde, x }) => {
  const f = useF();
  return <g>{Array.from({ length: 6 }).map((_, i) => <text key={i} x={x} y={260 + i * 60} fontFamily={F_MANO_} fontWeight={700} fontSize={40} fill="#f2ead8" opacity={interpolate(f, [desde + i * 8, desde + i * 8 + 6], [0, 1], cl)}>{["100 × 2,000", "= 200,000/day", "× 365", "= 73 M", "farm: 7.3 M", "→ MOVE?"][i]}</text>)}</g>;
};
const F_MANO_ = "'Patrick Hand', 'Comic Sans MS', cursive";
const p38: PlanB = {
  a: 221.1, b: 224.6, trans: { tipo: "corte" },
  sfx: [[221.2, "static", -20, { dur: 3.4 }], [221.6, "pencil", -8, { dur: 2.8 }]],
  el: (k) => (
    <>
      <Mitades
        izq={<Escena Set={GranjaLiving} pal={PAL} setProps={{ hora: "noche", farol: 1 }} seed={639} mano={1.6} claves={[mira(0, L.mesa - 60, 620, 1.6)]}
          medio={<A {...act(JUNE, L.mesa - 140, { asiento: [{ f: 0, v: 60 }], poses: [{ f: 0, v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 80, cD: 20, hI: 25, cI: 50 } }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "determinado" }], ajuste: (p, ff) => ({ ...p, cD: p.cD + 8 * Math.sin(ff / 2) }) })} />}
/>}
        der={<Escena Set={IglesiaDentro} pal={PAL} setProps={{ plan: 1, tarjetas: 1, hilos: 1 }} seed={640} mano={1.6} claves={[mira(0, IG_PUNTOS.tablero - 300, 620, 1.5)]}
          medio={<A {...act(HALVORSEN, IG_PUNTOS.tablero - 300, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 70, cD: 60, hI: 60, cI: 70 } }], caras: [{ f: 0, v: "determinado" }], enManoD: <MicMano s={0.8} ptt />, habla: [[k(221.4), k(224.4)]] })} />} />}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}><rect x={40} y={210} width={420} height={400} rx={18} fill="rgba(18,15,24,0.7)" /><Columnas desde={k(221.4)} x={70} /></svg>
      <H />
    </>
  ),
};

// ============ 39 · la granja tiene papas, semilla, tractor y tierra; la isla tiene gente ============
const p39: PlanB = {
  a: 224.6, b: 230.8, trans: { tipo: "fundido", d: 10 },
  sfx: [[224.7, "wind_soft", -18, { dur: 4.6 }], [225.4, "pop", -8], [226.2, "pop", -8], [226.9, "pop", -8], [227.6, "pop", -8], [229.4, "tick", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(229.3)) return (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "dia", estacion: "invierno" }} seed={641} mano={2}
          claves={[mira(0, GRANJA_PUNTOS.campo - 400, 560, 0.8), mira(k(229.3), GRANJA_PUNTOS.campo, 560, 0.85, { curva: "inout" })]}
          medio={<><Tractor x={GRANJA_PUNTOS.silo + 300} y={P} f={f} />
            <A {...act(MARCUS, GRANJA_PUNTOS.campo - 700, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(225.0), v: "señalar" }], caras: [{ f: 0, v: "determinado" }], luz: BORDE_FRIO })} /></>}
          hud={<><H />{["POTATOES", "SEED", "TRACTOR", "EMPTY LAND"].map((t, i) => <Txt key={t} t={t} a={k(225.4 + i * 0.75)} b={k(229.3)} top={250 + i * 90} left={1300} tam={58} mano chip color={AMBAR} />)}</>} />
      );
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "noche", estacion: "invierno", luces: 1 }} seed={642} mano={2}
          claves={[mira(0, 2600, 580, 0.6), mira(k(230.8), 2700, 580, 0.65, { curva: "inout" })]}
          hud={<><H /><Txt t="THE ISLAND HAS PEOPLE" a={k(229.4)} b={k(230.8) + 4} top={860} tam={60} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 40 · la respuesta es obvia: el mapa del lago en el altillo ============
const p40: PlanB = {
  a: 230.8, b: 238.0, trans: { tipo: "corte" },
  sfx: [[230.9, "chalk", -6], [232.4, "paper", -10], [233.4, "paper", -10, { dur: 2 }], [236.4, "boom", -16]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 0.8, aguja: 0.62, isla: 1, linea: 1, ruta: interpolate(f, [k(233.2), k(236.0)], [0, 1], cl) }} seed={643} mano={2}
          claves={[mira(0, RG_PUNTOS.mapa, 380, 1.4), mira(k(238.0), RG_PUNTOS.mapa + 40, 360, 1.9, { curva: "inout" })]}
          medio={<A {...act(GUS, RG_PUNTOS.mapa - 340, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(233.0), v: { hD: 120, cD: 10, tronco: 6 } }], caras: [{ f: 0, v: "determinado" }, { f: k(236.4), v: "duda" }] })} />}
          hud={<><H /><Txt t="THE ANSWER IS OBVIOUS" a={k(231.0)} b={k(232.4)} top={860} tam={58} mano chip color={AMBAR} /><Txt t="ONE GROUP HAS TO MOVE" a={k(232.4)} b={k(236.2)} top={860} tam={58} mano chip color={AMBAR} /><Txt t="…ACROSS LAKE SUPERIOR" a={k(236.2)} b={k(238.0) + 4} top={860} tam={58} mano chip color="#8fd3ff" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 41 · el ferry de antes, sólo con agua abierta ============
const p41: PlanB = {
  a: 238.0, b: 242.2, trans: { tipo: "fundido", d: 10 },
  sfx: [[238.1, "boat", -12, { dur: 4 }], [238.4, "waves", -18, { dur: 3.8 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={LagoAbierto} pal={PAL} setProps={{ hora: "dia", ola: 0.1, costa: false, ferry: interpolate(f, [0, k(242.2)], [0.2, 0.55], cl) }} seed={644} mano={2}
          claves={[mira(0, 900, 560, 0.9), mira(k(242.2), 1300, 560, 0.95, { curva: "inout" })]}
          hud={<><H /><Txt t="ONLY WHEN THE WATER IS OPEN" a={k(238.6)} b={k(242.2) + 4} top={860} tam={56} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 42 · el generador tose y se apaga; las ventanas se apagan ============
const p42: PlanB = {
  a: 242.2, b: 246.0, trans: { tipo: "corte" },
  sfx: [[242.3, "truck", -8, { dur: 2.4 }], [243.4, "metal", -4], [244.6, "candle_out", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const gen = interpolate(f, [k(242.3), k(244.6)], [0.9, 0], cl);
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "noche", estacion: "invierno", luces: interpolate(f, [k(244.4), k(245.6)], [1, 0.05], cl), generador: gen }} seed={645} mano={2}
          claves={[mira(0, ISLA_PUNTOS.estacion + 200, 640, 1.3), mira(k(244.4), ISLA_PUNTOS.estacion, 600, 1.2, { curva: "inout" }), mira(k(246.0), ISLA_PUNTOS.estacion - 600, 560, 0.7, { curva: "inout" })]}
          medio={<A {...act(ABBY, ISLA_PUNTOS.estacion + 140, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(243.2), v: { hD: 120, cD: 30, tronco: 10 } }, { f: k(243.6), v: { hD: 60, cD: 40 } }], caras: [{ f: 0, v: "duda" }, { f: k(243.6), v: "enojo" }], luz: BORDE_FRIO, enManoI: farol(f) })} />}
          hud={<><H /><Txt t="OUT OF FUEL" a={k(243.0)} b={k(246.0) + 4} top={860} tam={60} mano chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 43 · olas enormes de noviembre; bajo el agua, cientos de barcos hundidos ============
const p43: PlanB = {
  a: 246.0, b: 252.2, trans: { tipo: "corte" },
  sfx: [[246.1, "storm_sea", -10, { dur: 3.8 }], [247.4, "storm_sea", -8], [249.8, "drone", -12, { dur: 2.4 }], [249.8, "boom", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={LagoAbierto} pal={PAL} setProps={{ hora: "tormenta", ola: 1, hundidos: 1 }} seed={646} mano={2.6}
          claves={[mira(0, 2000, 560, 0.75), mira(k(249.5), 1900, 600, 0.8, { curva: "inout" }), mira(k(250.7), 1500, 2250, 0.72, { curva: "inout" }), mira(k(252.2), 1450, 2300, 0.75, { curva: "inout" })]}
          medio={<g transform={`translate(1500,${LA_SUP - 10 + Math.sin(f / 6) * 40}) rotate(${Math.sin(f / 9) * 8})`}><path d="M-60,-14 L60,-14 L46,10 L-46,10 Z" fill="#c8382c" /></g>}
          hud={<><H /><Txt t="NOVEMBER" a={k(246.2)} b={k(249.6)} top={150} tam={48} chip /><Txt t="HUNDREDS OF SHIPS" a={k(249.9)} b={k(252.2) + 4} top={860} tam={64} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 44 · Gus 40 años en el lago (laker de mineral) → Gus viejo en el altillo ============
const GUS_JOVEN = { ...GUS, accesorios: [{ t: "pelo" as const, forma: "corto" as const, color: "#2a1a14" }, { t: "gorroLana" as const, color: "#2f4a6a" }] };
const p44: PlanB = {
  a: 252.2, b: 256.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[252.3, "boat", -14, { dur: 3 }], [254.4, "whoosh", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(254.4)) return (
        <Escena Set={LagoAbierto} pal={PAL} setProps={{ hora: "dia", ola: 0.25, costa: false, carguero: 0.4 }} seed={647} mano={2}
          claves={[mira(0, 1000, 560, 1.1), mira(k(254.4), 1100, 520, 1.3, { curva: "inout" })]}
          medio={<A {...act(GUS_JOVEN, 880, { ruta: [{ f: 0, x: 880, y: LA_SUP - 90 }], escala: 0.55, dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "feliz" }] })} />}
          hud={<><H l={[anio(1975, k(252.4))]} /><Txt t="40 YEARS ON THE LAKE" a={k(252.6)} b={k(254.4)} top={860} tam={58} mano chip color={AMBAR} /></>} />
      );
      return (
        <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 0.8, aguja: 0.62 }} seed={648} mano={2}
          claves={[mira(0, RG_PUNTOS.silla + 20, 620, 2.2), mira(k(256.0), RG_PUNTOS.silla + 20, 610, 2.4, { curva: "inout" })]}
          medio={<A {...act(GUS_RADIO, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "pensar" }], caras: [{ f: 0, v: "triste" }], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 } })} />}
          hud={<><H /><Txt t="HE KNOWS THE STORIES" a={k(254.6)} b={k(256.0) + 4} top={860} tam={58} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 45 · el Edmund Fitzgerald: noviembre de 1975, 29 hombres (sólo la luz lejana que se pierde) ============
const p45: PlanB = {
  a: 256.0, b: 262.2, trans: { tipo: "fundido", d: 12 },
  sfx: [[256.1, "storm_sea", -10, { dur: 6 }], [258.2, "boom", -14], [260.6, "boom", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={LagoAbierto} pal={PAL} setProps={{ hora: "tormenta", ola: 0.9, costa: false }} seed={649} mano={2.2}
          claves={[mira(0, 1200, 560, 0.7), mira(k(262.2), 1250, 560, 0.75, { curva: "inout" })]}
          detras={<g opacity={interpolate(f, [k(259.2), k(260.4)], [1, 0], cl)}><g transform={`translate(1300,${LA_SUP - 20}) scale(0.35)`}><path d="M-420,-60 L400,-60 L440,-20 L420,10 L-400,10 Z" fill="#141620" /></g></g>}
          medio={<><circle cx={1420} cy={LA_SUP - 50} r={5} fill={AMBAR} opacity={interpolate(f, [k(260.4), k(261.8)], [1, 0], cl)} /><Halo x={1420} y={LA_SUP - 50} r={60} color={AMBAR} fuerza={0.6 * interpolate(f, [k(260.4), k(261.8)], [1, 0], cl)} /></>}
          hud={<><H l={[anio(1975)]} /><Txt t="EDMUND FITZGERALD" a={k(256.4)} b={k(259.4)} top={150} tam={48} chip /><Txt t="NOVEMBER 1975 · 29 MEN" a={k(259.4)} b={k(262.2) + 4} top={860} tam={56} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 46 · Gus: de ninguna manera en botes chicos en noviembre (palmada en la mesa) ============
const p46: PlanB = {
  a: 262.2, b: 266.6, trans: { tipo: "corte" },
  sfx: [[262.3, "static", -22, { dur: 4 }], [263.4, "wood_hit", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const g = golpe(f, k(263.4), 6);
      return (
        <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 1, aguja: 0.62 }} seed={650} mano={2}
          claves={[mira(0, RG_PUNTOS.silla + 60 + g, 640, 2.0), mira(k(266.6), RG_PUNTOS.silla + 60, 630, 2.2, { curva: "inout" })]}
          medio={<A {...act(GUS_RADIO, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 25, cI: 50 } }, { f: k(263.0), v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 80, cI: 10 } }, { f: k(263.4), v: { tronco: 16, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 55, cI: 20 } }], caras: [{ f: 0, v: "determinado" }, { f: k(263.4), v: "enojo" }], habla: [[k(262.4), k(266.2)]], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 }, enManoD: <MicMano s={0.8} ptt /> })} />}
          hud={<><H /><Txt t="NO SMALL BOATS IN NOVEMBER" a={k(263.4)} b={k(266.6) + 4} top={860} tam={58} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 47 · esperan el hielo: el canal se congela en timelapse (°F 25 → 10) ============
const p47: PlanB = {
  a: 266.6, b: 271.3, trans: { tipo: "fundido", d: 10 },
  sfx: [[266.7, "wind_cold", -14, { dur: 4.6 }], [268.0, "ice_crack", -10], [269.4, "ice_crack", -12], [270.6, "tick", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Isla} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno", hielo: interpolate(f, [k(267.0), k(270.4)], [0, 1], cl) }} seed={651} mano={2}
          claves={[mira(0, -400, 560, 0.6), mira(k(271.3), -250, 600, 0.68, { curva: "inout" })]}
          hud={<><H l={[grados([{ f: 0, v: 25 }, { f: k(267.0), v: 10, d: 90 }], k(266.8))]} /><Mano t="ICE." x={960} y={300} desde={k(270.6)} tam={150} color="#bfe0ff" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 48 · el camino de hielo de antes: autos de verdad, marcado con arbolitos de Navidad ============
const p48: PlanB = {
  a: 271.3, b: 285.3, trans: { tipo: "fundido", d: 12 },
  sfx: [[271.4, "car_pass", -14, { dur: 6 }], [276.0, "car_pass", -12], [279.4, "wind_cold", -18, { dur: 5 }], [281.6, "car_pass", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "invierno", arbolitos: interpolate(f, [k(278.8), k(282.0)], [0, 1], cl), autos: (f / 300) % 1 }} seed={652} mano={2}
          claves={[mira(0, 1300, 600, 0.9), mira(k(278.6), 1250, 560, 0.85, { curva: "inout" }), mira(k(285.3), 1150, 500, 1.3, { curva: "inout" })]}
          hud={<><H /><Txt t="THE OLD WORLD · AN ICE ROAD" a={k(271.6)} b={k(276.0)} top={150} tam={46} chip /><Txt t="REAL CARS" a={k(278.6)} b={k(280.0)} top={860} tam={60} mano chip color={AMBAR} /><Txt t="MARKED BY OLD CHRISTMAS TREES" a={k(281.0)} b={k(285.3) + 4} top={860} tam={52} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 49 · el windsled: bote plano con hélice gigante ============
const p49: PlanB = {
  a: 285.3, b: 294.3, trans: { tipo: "corte" },
  sfx: [[285.4, "wind_cold", -18, { dur: 3 }], [288.6, "drone", -8, { dur: 4.6 }], [290.6, "whoosh", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = interpolate(f, [k(288.6), k(293.6)], [-500, 2800], { ...cl, easing: (t) => t * t * (3 - 2 * t) });
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "invierno", arbolitos: 0, agua: 0.25, lechoso: 0.5 }} seed={653} mano={2}
          claves={[mira(0, 900, 760, 1.0), mira(k(288.6), 800, 760, 1.0), mira(k(293.6), 1900, 760, 1.05, { curva: "inout" })]}
          medio={<Windsled x={x} y={P} f={f} s={0.9} />}
          hud={<><H /><Txt t="TOO THIN FOR CARS · TOO THICK FOR THE FERRY" a={k(285.6)} b={k(288.8)} top={150} tam={44} chip /><Txt t="WINDSLEDS" a={k(289.2)} b={k(294.3) + 4} top={860} tam={70} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 50 · Abby y los mapas viejos; el termómetro cada noche ============
const p50: PlanB = {
  a: 294.3, b: 302.6, trans: { tipo: "corte" },
  sfx: [[294.4, "paper", -8], [295.4, "paper", -10, { dur: 1.6 }], [298.6, "wind_cold", -18, { dur: 4 }], [299.4, "tick", -6], [300.4, "tick", -6], [301.4, "tick", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const termo = f > k(298.4);
      return (
        <Escena Set={EstacionIsla} pal={PAL} setProps={{ hora: "noche", ruta: interpolate(f, [k(295.2), k(297.6)], [0, 1], cl), temp: interpolate(f, [k(299.4), k(301.6)], [10, 0], cl) }} seed={654} mano={2}
          claves={termo ? [mira(0, EI_PUNTOS.ventana + 80, 450, 1.7), mira(k(302.6), EI_PUNTOS.termometro, 420, 2.2, { curva: "inout" })] : [mira(0, EI_PUNTOS.mapa - 100, 380, 1.5), mira(k(298.4), EI_PUNTOS.mapa, 340, 2.0, { curva: "inout" })]}
          medio={termo
            ? <A {...act(ABBY_ADENTRO, EI_PUNTOS.ventana + 300, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "brazosCruzados" }], caras: [{ f: 0, v: "duda" }] })} />
            : <A {...act(ABBY_ADENTRO, EI_PUNTOS.mapa - 360, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(295.0), v: { hD: 120, cD: 10, tronco: 6 } }], caras: [{ f: 0, v: "determinado" }] })} />}
          hud={<><H l={termo ? [grados([{ f: 0, v: 10 }, { f: k(299.4), v: 2, d: 10 }, { f: k(300.4), v: -3, d: 10 }, { f: k(301.4), v: -8, d: 10 }], k(298.6))] : []} /><Txt t="WHERE THE ICE ROAD USED TO RUN" a={k(295.6)} b={k(298.4)} top={860} tam={52} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 51 · Día 450: −18 °F en La Pointe ============
const p51: PlanB = {
  a: 302.6, b: 309.1, trans: { tipo: "fundido", d: 10 },
  sfx: [[302.7, "wind_cold", -12, { dur: 6.4 }], [302.8, "tick", -2], [307.6, "tick", -4]],
  el: (k) => (
    <Escena Set={Isla} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno", hielo: 1 }} seed={655} mano={2}
      claves={[mira(0, ISLA_PUNTOS.iglesia, 400, 1.0), mira(k(309.1), ISLA_PUNTOS.iglesia - 100, 520, 0.8, { curva: "inout" })]}
      hud={<><H l={[dia([{ f: 0, v: 360 }, { f: k(302.8), v: 450, d: 30 }], k(302.7)), grados([{ f: 0, v: -8 }, { f: k(307.6), v: -18, d: 14 }], k(305.6))]} /><Txt t="LATE DECEMBER · YEAR TWO" a={k(303.6)} b={k(309.1) + 4} top={860} tam={54} chip /></>} />
  ),
};

// ============ 52 · Abby sale al hielo con el barreno y perfora ============
const p52: PlanB = {
  a: 309.1, b: 312.7, trans: { tipo: "corte" },
  sfx: [[309.2, "snow_step", -8], [309.6, "snow_step", -8], [310.0, "snow_step", -8], [310.4, "snow_step", -8], [311.0, "auger", -4, { dur: 1.7 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const perfora = f > k(311.0);
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "invierno", arbolitos: 0 }} seed={656} mano={2.4}
          claves={[mira(0, 900, 640, 1.2), mira(k(311.0), 1000, 700, 1.6, { curva: "inout" }), mira(k(312.7), 1000, 760, 1.9, { curva: "inout" })]}
          medio={<>
            <A {...act(ABBY, 0, { ruta: [{ f: 0, x: 600, y: P }, { f: k(310.8), x: 940, y: P }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(311.0), v: { tronco: 26, hD: 80, cD: 40, hI: 70, cI: 50 } }], caras: [{ f: 0, v: "determinado" }], luz: BORDE_FRIO, enManoI: perfora ? undefined : farol(f), ajuste: (p, ff) => perfora ? { ...p, tronco: p.tronco + 6 * Math.sin(ff / 2) } : p })} />
            <g transform={`translate(${perfora ? 1060 : interpolate(f, [0, k(310.8)], [700, 1040], cl)},${P - (perfora ? 30 : 120)})`}><g transform={`rotate(${perfora ? 0 : -50})`}><Barreno s={1.1} giro={perfora ? (f * 40) % 360 : 0} /></g></g>
            {perfora && Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={1060 + Math.cos(f / 3 + i) * 40} cy={P - 6 - Math.abs(Math.sin(f / 4 + i)) * 20} r={5} fill="#fff" />)}
          </>}
          hud={<H l={[grados(-18)]} />} />
      );
    };
    return <Pl />;
  },
};

// ============ 53 · el corte: 8 pulgadas de hielo negro y claro ============
const p53: PlanB = {
  a: 312.7, b: 316.9, trans: { tipo: "luz", d: 8 },
  sfx: [[312.8, "drip", -10], [313.6, "wood_hit", -8], [314.3, "tick", 0], [314.4, "ice_crack", -14]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={HieloCorte} pal={PAL} setProps={{ pulg: 8, agujero: 1, vara: interpolate(f, [k(313.2), k(313.8)], [0, 1], cl) }} seed={657} mano={1.6}
          claves={[mira(0, 1600, HC_SUP + 140, 1.6), mira(k(316.9), 1500, HC_SUP + 120, 1.3, { curva: "inout" })]}
          hud={<><H l={[hielo([{ f: 0, v: 0 }, { f: k(314.3), v: 8, d: 14 }], k(314.2))]} /><Txt t="CLEAR BLACK ICE" a={k(314.4)} b={k(316.9) + 4} top={860} tam={58} mano chip color="#bfe0ff" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 54 · la regla del hielo: 4" a pie · 5-7" moto · 8-12" auto ============
const p54: PlanB = {
  a: 316.9, b: 327.8, trans: { tipo: "corte" },
  sfx: [[317.0, "whoosh", -12], [319.6, "snow_step", -10, { dur: 2.6 }], [323.1, "truck", -8, { dur: 2.3 }], [325.4, "car_pass", -8, { dur: 2.4 }], [323.2, "tick", -6], [324.4, "tick", -6], [325.5, "tick", -6], [326.8, "tick", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const pulg = interpolate(f, [k(316.9), k(323.0), k(324.6), k(325.4), k(327.0)], [4, 4, 7, 8, 12], cl);
      const sup = HC_SUP - 24;
      const fase = f < k(323.0) ? 0 : f < k(325.4) ? 1 : 2;
      const x = (a: number, b: number) => interpolate(f, [k(a), k(b)], [300, 2600], cl);
      return (
        <Escena Set={HieloCorte} pal={PAL} setProps={{ pulg }} seed={658} mano={1.6}
          claves={[mira(0, 1000, HC_SUP + 60, 0.95), mira(k(327.8), 1100, HC_SUP + 140, 0.9, { curva: "inout" })]}
          medio={<>
            {fase === 0 && <A {...act(ISLENO(3), 0, { ruta: [{ f: k(318.4), x: 500, y: sup }, { f: k(323.0), x: 1500, y: sup, curva: "lineal" }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "determinado" }], luz: BORDE_FRIO })} />}
            {fase === 1 && <MotoNieve x={x(323.1, 325.4)} y={sup} s={1.1} />}
            {fase === 2 && <AutoChico x={x(325.4, 327.8)} y={sup} s={1.1} color="#2f4a5e" />}
          </>}
          hud={<><H l={[hielo(pulg)]} />
            <Txt t={'4" · A PERSON ON FOOT'} a={k(318.6)} b={k(323.0)} top={150} tam={52} chip />
            <Txt t={'5–7" · A SNOWMOBILE'} a={k(323.1)} b={k(325.4)} top={150} tam={52} chip />
            <Txt t={'8–12" · A SMALL CAR'} a={k(325.4)} b={k(327.8) + 4} top={150} tam={52} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 55 · 8": cien personas en fila, separadas, nunca amontonadas ============
const p55: PlanB = {
  a: 327.8, b: 335.2, trans: { tipo: "corte" },
  sfx: [[327.9, "snow_step", -8, { dur: 7 }], [330.8, "tick", -8], [333.2, "tick", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const sup = HC_SUP - 24;
      const off = (f * 2.2) % 160;
      return (
        <Escena Set={HieloCorte} pal={PAL} setProps={{ pulg: 8 }} seed={659} mano={1.6}
          claves={[mira(0, 1200, HC_SUP + 40, 1.1), mira(k(335.2), 1500, HC_SUP + 60, 0.55, { curva: "inout" })]}
          medio={<>{Array.from({ length: 30 }).map((_, i) => <g key={i}><Figu x={-1200 + i * 160 + off} y={sup} s={0.85} color={COLS[i % 9]} f={f} i={i} camina />{i > 0 && f > k(330.6) && <path d={`M${-1200 + (i - 1) * 160 + off + 20},${sup - 150} h120`} stroke="#c0352c" strokeWidth={3} strokeDasharray="8 6" />}</g>)}</>}
          hud={<><H l={[hielo(8)]} /><Txt t="SPREAD OUT · NEVER BUNCHED" a={k(330.6)} b={k(333.4)} top={150} tam={54} mano chip color={AMBAR} /><Txt t="ONLY IF IT'S CLEAR ICE" a={k(333.4)} b={k(335.2) + 4} top={150} tam={56} mano chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 56 · el hielo blanco lechoso es más débil: la mitad; una grieta fina ============
const p56: PlanB = {
  a: 335.2, b: 339.0, trans: { tipo: "corte" },
  sfx: [[335.6, "ice_crack", -6], [337.0, "tick", -4], [337.8, "ice_crack", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={HieloCorte} pal={PAL} setProps={{ pulg: 8, lechoso: interpolate(f, [k(335.4), k(336.4)], [0, 1], cl), grieta: interpolate(f, [k(337.6), k(338.6)], [0, 1], cl) }} seed={660} mano={1.6}
          claves={[mira(0, 1000, HC_SUP + 140, 1.2), mira(k(339.0), 950, HC_SUP + 130, 1.45, { curva: "inout" })]}
          hud={<><H l={[hielo([{ f: 0, v: 8 }, { f: k(337.0), v: 4, d: 14 }], undefined, f_color(k(337.0)))]} /><Txt t="HALF AS STRONG" a={k(337.0)} b={k(339.0) + 4} top={150} tam={60} mano chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};
// (el color de la línea ICE no se anima: queda blanco desde el inicio de este plano)
const f_color = (_desde: number) => "#ffffff";

// ============ 57 · en un lago grande el hielo nunca es parejo (mapa de colores fríos) ============
const p57: PlanB = {
  a: 339.0, b: 343.6, trans: { tipo: "fundido", d: 10 },
  sfx: [[339.1, "wind_cold", -14, { dur: 4.5 }], [341.2, "ice_crack", -16]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "invierno", arbolitos: 0, calor: interpolate(f, [k(339.4), k(341.0)], [0, 1], cl) }} seed={661} mano={1.6}
          claves={[mira(0, 1100, 560, 0.7), mira(k(343.6), 1100, 520, 0.85, { curva: "inout" })]}
          hud={<><H /><Txt t="NEVER THE SAME THICKNESS" a={k(339.8)} b={k(343.6) + 4} top={860} tam={58} mano chip color="#bfe0ff" /></>} />
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
      claves={[mira(0, EI_PUNTOS.radio - 40, 620, 1.7), mira(k(348.2), EI_PUNTOS.radio - 60, 600, 2.1, { curva: "inout" })]}
      medio={<A {...act(ABBY_ADENTRO, EI_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 25, cI: 50 } }], caras: [{ f: 0, v: "determinado" }], habla: [[k(345.6), k(348.0)]], luz: { lado: 1, color: "#7dffb0", fuerza: 0.8 }, enManoD: <MicMano s={0.8} ptt /> })} />}
      hud={<><H /><GloboRadio t="Gus, the channel's frozen." x={1100} y={420} desde={k(345.4)} hasta={k(347.3)} lado={-1} color="#f6ecd2" /><GloboRadio t="We're coming." x={1100} y={420} desde={k(347.3)} hasta={k(348.2) + 6} tam={64} lado={-1} color="#f6ecd2" /></>} />
  ),
};

// ============ 59 · Gus escucha, baja el micrófono y mira el living ============
const p59: PlanB = {
  a: 348.2, b: 351.9, trans: { tipo: "corte" },
  sfx: [[348.3, "static", -20, { dur: 1 }], [349.2, "tape", -6], [350.4, "chair", -8]],
  el: (k) => (
    <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 0.8, aguja: 0.62 }} seed={663} mano={2}
      claves={[mira(0, RG_PUNTOS.silla + 30, 620, 2.5), mira(k(351.9), RG_PUNTOS.silla + 30, 640, 2.0, { curva: "inout" })]}
      medio={<A {...act(GUS_RADIO, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }, { f: k(350.6), v: -1 }], poses: [{ f: 0, v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 25, cI: 50 } }, { f: k(349.2), v: { tronco: 0, pI: 88, rI: 88, pD: 92, rD: 92, hD: 30, cD: 50, hI: 25, cI: 50 } }], caras: [{ f: 0, v: "sorpresa" }, { f: k(350.6), v: "duda" }], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 }, enManoD: (ff: number) => ff < k(349.2) ? <MicMano s={0.8} /> : null })} />}
      hud={<H />} />
  ),
};

// ============ 60 · diez personas, un perro, un sótano ============
const p60: PlanB = {
  a: 351.9, b: 355.6, trans: { tipo: "corte" },
  sfx: [[351.95, "tick", -4], [353.0, "tick", -4], [353.6, "dog_tail", -8, { dur: 1.2 }], [354.1, "tick", -4], [354.7, "door", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={GranjaLiving} pal={PAL} setProps={{ hora: "noche", farol: 1 }} seed={664} mano={2}
          claves={[mira(0, L.mesa - 300, 600, 0.85), mira(k(355.6), L.mesa - 400, 600, 0.95, { curva: "inout" })]}
          medio={<>
            <Ore x={L.mesa - 900} y={P} dir={1} s={0.85} f={f} echado={0.6} cabeza={f > k(353.4) ? -20 : 14} cola={f > k(353.4) ? 1 : 0.2} />
            {DIEZ.map((l, i) => <A key={i} {...act(l, L.mesa - 760 + i * 120, { dir: [{ f: 0, v: i < 5 ? 1 : -1 }], caras: [{ f: 0, v: i % 3 ? "duda" : "neutral" }], miradas: [{ f: 0, v: { x: 0, y: -0.2 } }], seed: 30 + i })} />)}
          </>}
          hud={<><H />{["TEN PEOPLE", "ONE DOG", "ONE ROOT CELLAR"].map((t, i) => <Txt key={t} t={t} a={k([351.95, 353.0, 354.1][i])} b={k(355.6) + 4} top={250 + i * 90} left={1300} tam={58} mano chip color={AMBAR} />)}</>} />
      );
    };
    return <Pl />;
  },
};

// ============ 61 · y noventa desconocidos: la fila de faroles saliendo de la isla por el camino de arbolitos ============
const p61: PlanB = {
  a: 355.6, b: 359.1, trans: { tipo: "fundido", d: 10 },
  sfx: [[355.7, "wind_cold", -14, { dur: 3.4 }], [356.0, "snow_step", -12, { dur: 3 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "noche", arbolitos: 1, islaLuz: 0.4 }} seed={665} mano={1.6}
          claves={[mira(0, 1150, 520, 1.6), mira(k(359.1), 1200, 600, 0.75, { curva: "inout" })]}
          medio={<FilaCamino n={60} t0={0.35} t1={0.99} avanza={interpolate(f, [0, k(359.1)], [0, 0.06], cl)} faroles />}
          hud={<><H /><Txt t="90 STRANGERS" a={k(356.0)} b={k(359.1) + 4} top={860} tam={64} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 62 · después, noventa millas por la costa en enero ============
const p62: PlanB = {
  a: 359.1, b: 362.3, trans: { tipo: "corte" },
  sfx: [[359.2, "paper", -10], [359.8, "pencil", -8, { dur: 1.6 }], [361.4, "tick", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #3a3a46 0%, #15151c 75%)" }}>
          <svg width={1920} height={1080}><g transform="translate(700,250)"><MapaLago x={0} y={0} w={760} isla={1} ruta={interpolate(f, [k(359.6), k(361.4)], [0, 1], cl)} f={f} /></g></svg>
          <H />
          <Txt t="90 MI · JANUARY" a={k(361.2)} b={k(362.3) + 4} top={860} tam={64} mano chip color={AMBAR} />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

// ============ 63 · June abre el cuaderno: al lado del 10, «?»; y en letra chiquita, 110 ============
const p63: PlanB = {
  a: 362.3, b: 371.0, trans: { tipo: "corte" },
  sfx: [[362.4, "page", -4], [366.4, "pencil", -6, { dur: 0.8 }], [369.8, "pencil", -8, { dur: 1.2 }], [370.4, "boom", -10], [370.5, "tick", 0]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const z = interpolate(f, [k(369.6), k(371.0)], [1, 1.5], cl);
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "62% 52%" }}>
            <Cuaderno abre={k(362.5)} lineas={[{ t: "POPULATION 10", desde: k(362.6), tam: 52 }, { t: "?", desde: k(366.4), tam: 72, color: "#b8382c", x: 1350, y: 384 }, { t: "110", desde: k(370.0), tam: 30, color: "#b8382c", x: 1360, y: 440 }]} />
          </div>
          <HudC lineas={[POP(10, f > k(366.4) ? { fmt: (n) => `${Math.round(n)}?` } : {}), isla(100)]} />
          {f > k(370.4) && <HudC lineas={[POP([{ f: 0, v: 10 }, { f: k(370.5), v: 110, d: 24 }], { fmt: (n) => `${Math.round(n)}?` }), isla(100)]} />}
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

// ============ 64 · ¿cruzarías el hielo? · la fila de faroles desde arriba · suscribite ============
const p64: PlanB = {
  a: 371.0, b: 376.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[371.1, "wind_cold", -18, { dur: 4.8 }], [375.3, "pop", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={LagoHelado} pal={PAL} setProps={{ hora: "noche", arbolitos: 1, islaLuz: 0.4 }} seed={666} mano={1.4}
          claves={[mira(0, 1250, 800, 1.0), mira(k(376.0), 1200, 700, 0.85, { curva: "inout" })]}
          medio={<FilaCamino n={60} t0={0.05} t1={0.99} avanza={interpolate(f, [0, k(376.0)], [0.06, 0.12], cl)} faroles />}
          hud={<><HudC lineas={[POP(110, { fmt: (n) => `${Math.round(n)}?` }), isla(100)]} /><Txt t={"IF YOU WERE ON THAT ISLAND…\nWOULD YOU CROSS THE ICE?"} a={k(371.2)} b={k(375.2)} top={720} tam={58} chip /><BotonSub desde={k(375.2)} top={800} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 65 · próximo: la represa de Thomson de noche, una sola luz se prende ============
const Represa: React.FC<{ luz: number }> = ({ luz }) => {
  const f = useF();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#0f1530, #1d2440 60%, #2a2f48)" }}>
      <svg width={1920} height={1080}>
        {Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={(i * 331) % 1920} cy={(i * 137) % 500} r={1.6} fill="#fff" opacity={0.6 + 0.4 * Math.sin(f / 10 + i)} />)}
        <path d="M0,640 Q500,560 960,600 Q1500,640 1920,580 L1920,1080 L0,1080 Z" fill="#141a2a" />
        <rect x={300} y={560} width={1320} height={200} fill="#5a5e6a" />
        {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={330 + i * 120} y={580} width={60} height={180} fill="#4a4e5a" />)}
        {Array.from({ length: 11 }).map((_, i) => <path key={i} d={`M${360 + i * 120},760 q10,${80 + Math.sin(f / 4 + i) * 10} 0,200`} stroke="#8aa8d0" strokeWidth={30} opacity={0.35} fill="none" />)}
        <rect x={860} y={470} width={200} height={90} fill="#3a3e4a" /><rect x={930} y={500} width={60} height={40} fill={luz > 0 ? AMBAR : "#20242e"} opacity={0.3 + 0.7 * luz} />
        {luz > 0 && <circle cx={960} cy={520} r={220} fill={AMBAR} opacity={0.18 * luz} />}
      </svg>
    </AbsoluteFill>
  );
};
const p65: PlanB = {
  a: 376.0, b: 381.9, trans: { tipo: "fundido", d: 12 },
  sfx: [[376.1, "riser", -14, { dur: 3 }], [377.9, "lock", -4], [378.0, "drone", -18, { dur: 3.8 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return <><Represa luz={interpolate(f, [k(377.9), k(378.3)], [0, 1], cl)} /><HudC lineas={[POP(110, { fmt: (n) => `${Math.round(n)}?` }), isla(100)]} /><Proximo ep={7} titulo="How Long to Rebuild Electricity?" desde={k(377.9)} /></>;
    };
    return <Pl />;
  },
};

// el plano 9 lleva la línea de la isla en 300 → 4 (se superpone al HUD normal)
const p09b: PlanB = { ...p09, el: (k) => { const base = p09.el(k); return <>{base}{p09h(k)}</>; } };

export const PLANOS_LC06: PlanB[] = [p00, p01, p02, p03, p04, p05, p06, p07, p08, p09b, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32, p33, p34, p35, p36, p37, p38, p39, p40, p41, p42, p43, p44, p45, p46, p47, p48, p49, p50, p51, p52, p53, p54, p55, p56, p57, p58, p59, p60, p61, p62, p63, p64, p65];
export const LC06 = armar(PLANOS_LC06);

export const Lc06: React.FC = () => {
  useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Montaje planos={LC06.planos} />
    </AbsoluteFill>
  );
};
