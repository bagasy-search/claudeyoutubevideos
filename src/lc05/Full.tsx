// lc05 · «Could 10 People Rebuild Medicine From Zero?» (The Last Census Ep.5, sesión lc-c). Plan: D:/rtmp/lc05_PLAN_MxM.md
// Cada plano va de un segundo de la voz al siguiente; k(seg) = cuadro local. sfx en segundos absolutos (→ cues → mezcla_c.py).
// HUD: POPULATION 10 fija + 2º contador por bloque (LILY °F, DOSES, DAY, YEAR); al final la 2ª línea MADELINE ISLAND 100.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { golpe, mira, useF } from "../anikit/camara";
import { Escena } from "../anikit/escena";
import { Montaje } from "../anikit/montaje";
import { Actor, ActorProps } from "../anikit/actor";
import { Libro } from "../anikit/props";
import { Halo } from "../anikit/luz";
import { AMBAR, PAL, THEO, THEO_CASA, JUNE, GUS, BORDE_CALIDO, BORDE_FRIO, ROJO_CENSO } from "../census/elenco";
import { Panorama, PANO_PUNTOS } from "../census/mundo/panorama";
import { StMarys, Lobby, LOBBY_PUNTOS } from "../census/mundo/hospital";
import { Auto } from "../census/mundo/comun";
import { Ore } from "../census/mundo/ore";
import { Granja, GRANJA_PUNTOS } from "../census/lcb/granja";
import { MARCUS, ROSA, PRIYA, DEV, NAN, BEN, LILY, LILY_CAMA, LEVITA, LEVITA_DELANTAL, CIENTIFICO, JUNE_QUIRO, CIRUJANO } from "../census/lcc/elenco_c";
import { Farmacia, FAR_PUNTOS, GranjaLiving, GL_PUNTOS, GL_PIZARRA, RadioGus, RG_PUNTOS, Granero, GR_HENIL, GR_PUNTOS, Mural, PasilloFarmacia, Tiza, Escrito } from "../census/lcc/sets5";
import { FarolMano, Vial, CuadernoCenso, MicMano, Cruz, Vela, Palangana } from "../census/lcc/piezas";
import { armar, PlanB, cl, HudC, POP, LineaC, decimal, Txt, Mano, GloboRadio, BotonSub, Proximo, Paso, Cl } from "../census/lcc/lib";

const P = 900;
const L = GL_PUNTOS;
type AP = Partial<ActorProps> & { look: ActorProps["look"] };
const act = (look: AP["look"], x: number, extra: Partial<ActorProps> = {}): ActorProps => ({ look, ruta: [{ f: 0, x, y: P }], luz: BORDE_CALIDO, seed: Math.round(x) % 89, ...extra });
const A: React.FC<ActorProps> = (p) => <Actor {...p} />;
const farol = (f: number) => <FarolMano y={0} s={0.9} f={f} halo={0.6} />;

// contadores (valores en cuadros LOCALES de cada plano: se pasan ya armados)
const fiebre = (v: Cl | number, ent?: number): LineaC & { ent?: number } => ({ id: "lily", et: "LILY", v, fmt: (n) => `${decimal(n)}°F`, icono: "temp", color: "#ff8a6a", ent });
const dosis = (v: Cl | number, ent?: number): LineaC & { ent?: number } => ({ id: "dosis", et: "DOSES", v, icono: "gota", ent });
const dia = (v: Cl | number, ent?: number): LineaC & { ent?: number } => ({ id: "dia", et: "DAY", v, icono: "dia", ent });
const anio = (v: Cl | number, ent?: number): LineaC & { ent?: number } => ({ id: "anio", et: "YEAR", v, fmt: (n) => `${Math.round(n)}`, color: "#f6ecd2", ent });
const isla = (v: Cl | number, ent?: number): LineaC & { ent?: number } => ({ id: "isla", et: "MADELINE ISLAND:", v, icono: "radio", ent });
const H: React.FC<{ l?: (LineaC & { ent?: number })[] }> = ({ l = [] }) => <HudC lineas={[POP(10), ...l]} />;

// el living de la granja con su gente (se usa en muchos planos)
const Liv: React.FC<{ claves: any; sp?: Record<string, unknown>; medio?: React.ReactNode; hud?: React.ReactNode; frente?: React.ReactNode; seed?: number }> = ({ claves, sp = {}, medio, hud, frente, seed = 5 }) => (
  <Escena Set={GranjaLiving} pal={PAL} setProps={{ hora: "noche", ...sp }} claves={claves} medio={medio} hud={hud} frente={frente} seed={seed} mano={2.5} zLejos={0.6} />
);
// Lily en el sillón: sentada de costado, mano en la panza (o dormida)
const lily = (extra: Partial<ActorProps> = {}): ActorProps => act(LILY_CAMA, 760, { asiento: [{ f: 0, v: 118 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { ...{ tronco: 18, pI: 80, rI: 70, pD: 86, rD: 74, hD: 30, cD: 120, hI: 20, cI: 110, cabeza: 14 } } }], caras: [{ f: 0, v: "triste" }], seed: 12, ...extra });
const MantaLily: React.FC<{ x?: number; color?: string }> = ({ x = 690, color = "#b8382c" }) => <path d={`M${x},${P - 120} q90,-70 200,-40 q60,10 70,40 L${x + 270},${P - 70} L${x - 10},${P - 70} Z`} fill={color} opacity={0.95} />;

// ============ 0 · cuadro 0 = la miniatura (pasillo de la farmacia, June con el último frasco) ============
const Miniatura: React.FC<{ k: (s: number) => number; apaga?: number }> = ({ k, apaga = 1e9 }) => {
  const f = useF();
  const br = interpolate(f, [apaga, apaga + 14], [1, 0.15], cl);
  return (
    <Escena Set={PasilloFarmacia} pal={PAL} setProps={{ llenado: 0.3, luzFarol: { x: 430, y: 820, on: 1 } }} seed={500} mano={1.5}
      claves={[mira(0, 960, 540, 1), mira(k(1.0), 990, 560, 1.04, { curva: "inout" })]}
      detras={<A {...act(THEO_CASA.accesorios ? THEO : THEO, 400, { ruta: [{ f: 0, x: 400, y: 850 }], escala: 0.5, luz: { lado: 1, color: "#ffb04a", fuerza: 1 }, poses: [{ f: 0, v: { hD: 30, cD: 60 } }], enManoD: farol(f), caras: [{ f: 0, v: "sorpresa" }] })} />}
      medio={<A {...act({ ...JUNE, accesorios: [...(JUNE.accesorios ?? []), { t: "mochila", color: "#4a3426" }, { t: "parche", color: "#f2ece0", lado: 1 }] }, 1150, {
        ruta: [{ f: 0, x: 1450, y: 1480 }], escala: 3.2, dir: [{ f: 0, v: 1 }], luz: { lado: 1, color: "#ffb04a", fuerza: 1 },
        poses: [{ f: 0, v: { hD: 150, cD: 150, hI: 8, cI: 20, cabeza: -6 } }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 1, y: -0.4 } }],
        enManoD: <g transform="translate(0,-30) scale(0.8)"><Vial brillo={br} s={1} /></g>,
      })} />}
      frente={<Halo x={1500} y={330} r={520} color="#ffcf6e" fuerza={0.55 * br} />} />
  );
};

const p00: PlanB = {
  a: 0, b: 2.6,
  sfx: [[0.05, "sparkle", -10], [0.9, "glass", -12], [1.6, "whoosh", -10]],
  el: (k) => {
    const Pl: React.FC = () => <><Miniatura k={k} apaga={k(1.6)} /></>;
    return <Pl />;
  },
};

// ============ 1 · Lily en el sillón, fiebre 102 ============
const p01: PlanB = {
  a: 2.6, b: 8.2, trans: { tipo: "fundido", d: 14 },
  sfx: [[2.7, "wind_soft", -18, { dur: 5 }], [3.4, "fire", -16, { dur: 5 }], [4.4, "tick", -6], [5.6, "creak", -12], [6.8, "cloth", -10]],
  el: (k) => (
    <Liv claves={[mira(0, 1300, 560, 0.85), mira(k(5.2), 850, 640, 1.7, { curva: "inout" })]} sp={{ farol: 1 }}
      medio={<>
        <A {...lily({ poses: [{ f: 0, v: { tronco: 18, pI: 80, rI: 70, pD: 86, rD: 74, hD: 30, cD: 120, hI: 20, cI: 110, cabeza: 14 } }, { f: k(6.0), v: { tronco: 26, pI: 82, rI: 80, pD: 86, rD: 82, hD: 40, cD: 130, hI: 34, cI: 125, cabeza: 22 } }], caras: [{ f: 0, v: "triste" }, { f: k(6.2), v: "cansado" }] })} />
        <MantaLily />
        <Ore x={1010} y={P} dir={-1} s={0.8} f={useF()} echado={0.7} cabeza={14} />
      </>}
      hud={<H l={[fiebre([{ f: 0, v: 98.6 }, { f: k(4.4), v: 102, d: 20 }], k(4.2))]} />} />
  ),
};

// ============ 2 · «antes»: hospital en una hora, a casa en dos días ============
const p02: PlanB = {
  a: 8.2, b: 12.6, trans: { tipo: "barrido", lado: 1 },
  sfx: [[8.3, "whoosh"], [8.9, "ding", -14], [9.6, "radio_ping", -16], [10.6, "door_glass", -10], [11.4, "pop", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const fuera = f > k(10.4);
      return (
        <Escena Set={Lobby} pal={PAL} setProps={{ luces: 1, afuera: "dia", pizarra: "" }} seed={502} mano={2}
          claves={[mira(0, LOBBY_PUNTOS.guardia - 100, 560, 1.2), mira(k(10.3), LOBBY_PUNTOS.guardia - 220, 580, 1.25, { curva: "inout" }), mira(k(10.5), LOBBY_PUNTOS.puerta + 260, 580, 1.1), mira(k(12.6), LOBBY_PUNTOS.puerta + 160, 580, 1.15, { curva: "inout" })]}
          medio={fuera
            ? <><A {...act(LILY, LOBBY_PUNTOS.puerta + 420, { ruta: [{ f: k(10.5), x: LOBBY_PUNTOS.puerta + 460, y: P }, { f: k(12.4), x: LOBBY_PUNTOS.puerta + 120, y: P }], poses: [{ f: 0, v: "saludar" }], caras: [{ f: 0, v: "feliz" }], luz: BORDE_FRIO })} />
              <A {...act(BEN, LOBBY_PUNTOS.puerta + 600, { ruta: [{ f: k(10.5), x: LOBBY_PUNTOS.puerta + 640, y: P }, { f: k(12.4), x: LOBBY_PUNTOS.puerta + 300, y: P }], caras: [{ f: 0, v: "risa" }], luz: BORDE_FRIO })} /></>
            : <A {...act(LILY_CAMA, LOBBY_PUNTOS.guardia - 100, { asiento: [{ f: 0, v: 150 }], poses: [{ f: 0, v: "sentado" }], caras: [{ f: 0, v: "feliz" }], dir: [{ f: 0, v: -1 }], luz: BORDE_FRIO })} />}
          hud={<><H /><Txt t={fuera ? "DAY 2 · HOME" : "1 HOUR"} a={fuera ? k(10.5) : k(8.6)} b={fuera ? k(12.6) + 6 : k(10.4)} top={860} tam={58} chip color={AMBAR} /><Txt t="THE OLD WORLD" a={k(8.3)} b={k(12.6)} top={150} tam={44} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 3 · «one nurse, no surgeon, no lab, no power» ============
const p03: PlanB = {
  a: 12.6, b: 17.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[12.8, "lantern", -10, { dur: 3 }], [13.9, "wood_step", -10], [14.6, "tick", -6], [15.5, "tick", -6], [16.3, "tick", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const nos = [["ONE NURSE", 12.9, AMBAR], ["NO SURGEON", 14.0, "#ff6a5a"], ["NO LAB", 15.1, "#ff6a5a"], ["NO POWER", 15.7, "#ff6a5a"]] as const;
      return (
        <Liv claves={[mira(0, 900, 560, 1.15), mira(k(17.0), 1050, 540, 1.0, { curva: "inout" })]} sp={{ farol: 1 }}
          medio={<>
            <A {...lily({ caras: [{ f: 0, v: "cansado" }] })} />
            <MantaLily />
            <A {...act(JUNE, 1300, { ruta: [{ f: 0, x: 1500, y: P }, { f: k(14.2), x: 1000, y: P }], poses: [{ f: 0, v: "parado" }, { f: k(14.4), v: "arrodillado" }, { f: k(15.2), v: { ...{ tronco: 10, pI: 0, rI: 90, pD: 90, rD: 90, hD: 100, cD: 60, hI: 10, cI: 30 } } }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "determinado" }, { f: k(15.2), v: "triste" }], enManoI: farol(f) })} />
          </>}
          hud={<><H />{nos.map(([t, s, c], i) => <Txt key={t} t={t} a={k(s)} b={k(17.0) + 4} top={250 + i * 90} left={1280} tam={58} mano color={c} />)}</>} />
      );
    };
    return <Pl />;
  },
};

// ============ 4 · la farmacia vacía: «every medicine on earth is quietly getting older» ============
const p04: PlanB = {
  a: 17.0, b: 21.2, trans: { tipo: "cortina", d: 14 },
  sfx: [[17.1, "whoosh"], [17.6, "wind_cold", -20, { dur: 3.5 }], [19.0, "tick", -10], [19.6, "tick", -10], [20.2, "tick", -10]],
  el: (k) => (
    <Escena Set={Farmacia} pal={PAL} setProps={{ luces: 0, apagar: 0, polvo: 1 }} seed={504} mano={2}
      claves={[mira(0, 1300, 520, 0.72), mira(k(21.2), 1800, 520, 0.78, { curva: "inout" })]}
      tiempo={(f) => f}
      detras={<FarmaciaApagando desde={k(18.4)} />}
      hud={<H />} />
  ),
};
// las cajas pierden color de a una (tono por cuadro): truco = una capa del mismo set con `apagar` creciente
const FarmaciaApagando: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useF();
  const u = interpolate(f, [desde, desde + 70], [0, 0.85], cl);
  return <g opacity={u}><rect x={850} y={P - 620} width={1520} height={620} fill="#141626" opacity={0.55} /></g>;
};

// ============ 5 · la granja de noche: «could ten people rebuild medicine from zero?» ============
const p05: PlanB = {
  a: 21.2, b: 25.6, trans: { tipo: "fundido", d: 12 },
  sfx: [[21.3, "wind_cold", -16, { dur: 4 }], [23.6, "riser", -12, { dur: 2 }]],
  el: (k) => (
    <Escena Set={Granja} pal={PAL} setProps={{ hora: "noche", estacion: "invierno", humo: 0.8 }} seed={505} mano={2} zLejos={0.3}
      claves={[mira(0, GRANJA_PUNTOS.casa + 300, 520, 1.1), mira(k(25.6), GRANJA_PUNTOS.casa + 700, 420, 0.7, { curva: "inout" })]}
      medio={<VentanaCasa />}
      hud={<><HudC lineas={[POP([{ f: 0, v: 10 }, { f: k(23.8), v: 10, d: 1 }])]} /><Txt t={"COULD TEN PEOPLE\nREBUILD MEDICINE?"} a={k(22.6)} b={k(25.6) + 4} top={720} tam={70} color="#f6ecd2" /></>} />
  ),
};
const VentanaCasa: React.FC = () => <g><rect x={20} y={P - 330} width={90} height={80} fill={AMBAR} opacity={0.95} /><Halo x={65} y={P - 290} r={260} color={AMBAR} fuerza={0.8} /></g>;

// ============ 6 · «Let's count it.» el cuaderno se abre en 10 ============
const Cuaderno: React.FC<{ abre?: number; lineas?: { t: string; desde: number; y?: number; tam?: number; color?: string }[]; cierra?: number }> = ({ abre = 0, lineas = [], cierra }) => {
  const f = useF();
  const abierto = f >= abre && (cierra === undefined || f < cierra);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #5a3a28 0%, #2a1a12 70%)" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <Halo x={1300} y={300} r={700} color="#ffcf6e" fuerza={0.35} />
        <CuadernoCenso x={960} y={560} s={abierto ? 2.6 : 2.2} abierto={abierto} rot={-2} />
        {abierto && lineas.map((l, i) => <Escrito key={i} t={l.t} x={l.y !== undefined ? 1010 : 1010} y={l.y ?? 380 + i * 70} f={f} desde={l.desde} tam={l.tam ?? 56} color={l.color ?? "#1d3a8a"} />)}
      </svg>
    </AbsoluteFill>
  );
};
const p06: PlanB = {
  a: 25.6, b: 26.6, trans: { tipo: "corte" },
  sfx: [[25.65, "page", -4]],
  el: (k) => <><Cuaderno abre={k(25.8)} lineas={[{ t: "POPULATION 10", desde: k(25.9), tam: 52 }]} /><H /></>,
};

// ============ 7 · última vez: la helada (granja de lc-b) ============
const p07: PlanB = {
  a: 26.6, b: 30.6, trans: { tipo: "fundido", d: 10 },
  sfx: [[26.7, "wind_cold", -18, { dur: 4 }], [28.0, "ice_crack", -8], [28.9, "snow_step", -10]],
  el: (k) => (
    <Escena Set={Granja} pal={PAL} setProps={{ hora: "alba", estacion: "verano", helada: 1, crec: 1 }} seed={507} mano={2}
      claves={[mira(0, 3500, 560, 0.85), mira(k(30.6), 3800, 640, 1.3, { curva: "inout" })]}
      medio={<A {...act(MARCUS, 3800, { poses: [{ f: 0, v: "agacharse" }, { f: k(28.7), v: { ...{ tronco: 30, pI: 70, rI: 115, pD: 80, rD: 120, hD: 100, cD: 40, hI: 35, cI: 25, cabeza: -10 } } }], caras: [{ f: 0, v: "triste" }], luz: { lado: -1, color: "#ffb08a", fuerza: 0.8 } })} />}
      hud={<><H l={[dia(330, k(26.8))]} /><Txt t="LAST TIME" a={k(26.7)} b={k(29.0)} top={150} tam={48} chip /></>} />
  ),
};

// ============ 8 · el henil: June encuentra a Lily ardiendo; dolor del ombligo a la derecha ============
const p08: PlanB = {
  a: 30.6, b: 38.6, trans: { tipo: "corte" },
  sfx: [[30.7, "lantern", -12, { dur: 2 }], [31.0, "wood_step", -8], [31.4, "wood_step", -8], [31.8, "wood_step", -8], [32.2, "wood_step", -8], [33.6, "chalk", -6, { dur: 2 }], [36.6, "tick", -6], [37.2, "glass", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const yL = GR_HENIL;
      return (
        <Escena Set={Granero} pal={PAL} setProps={{ farol: 1 }} seed={508} mano={2.2}
          claves={[mira(0, 1150, 700, 1.0), mira(k(32.4), 900, 380, 1.3, { curva: "inout" }), mira(k(33.4), 760, 360, 2.1, { curva: "inout" }), mira(k(38.6), 760, 380, 2.0)]}
          medio={<>
            <A {...act(LILY_CAMA, GR_PUNTOS.lily, { ruta: [{ f: 0, x: GR_PUNTOS.lily, y: yL }], asiento: [{ f: 0, v: 20 }], poses: [{ f: 0, v: { tronco: -70, pI: 90, rI: 10, pD: 95, rD: 20, hD: 40, cD: 120, hI: 30, cI: 120, cabeza: -10 } }, { f: k(33.2), v: { tronco: -70, pI: 90, rI: 10, pD: 95, rD: 20, hD: 70, cD: 100, hI: 30, cI: 120, cabeza: -10 } }], caras: [{ f: 0, v: "cansado" }], dir: [{ f: 0, v: 1 }], luz: BORDE_CALIDO })} />
            <A {...act(JUNE, GR_PUNTOS.escalera, { ruta: [{ f: 0, x: GR_PUNTOS.escalera, y: P }, { f: k(32.2), x: GR_PUNTOS.escalera - 40, y: yL }, { f: k(33.0), x: GR_PUNTOS.lily + 150, y: yL }], poses: [{ f: 0, v: "agarrarAlto" }, { f: k(32.3), v: "parado" }, { f: k(33.0), v: "arrodillado" }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "miedo" }], enManoI: farol(f) })} />
            {/* el trazo del dolor: del ombligo hacia abajo a la derecha (tiza ámbar sobre la manta) */}
            <Tiza d={`M${GR_PUNTOS.lily + 20},${yL - 70} q20,10 40,30 q10,10 6,24`} f={f} desde={k(33.7)} dur={k(36.0) - k(33.7)} color={AMBAR} ancho={6} o={1} />
            <path d={`M${GR_PUNTOS.lily + 60},${yL - 18} l-14,-4 l6,-12`} stroke={AMBAR} strokeWidth={5} fill="none" opacity={f > k(36.0) ? 1 : 0} />
            {/* plato de sopa intacto con vapor */}
            <g opacity={f > k(36.4) ? 1 : 0}><ellipse cx={GR_PUNTOS.lily - 140} cy={yL - 10} rx={46} ry={12} fill="#e8e4dc" /><ellipse cx={GR_PUNTOS.lily - 140} cy={yL - 14} rx={34} ry={7} fill="#d8a85a" />{[0, 1].map((i) => <path key={i} d={`M${GR_PUNTOS.lily - 150 + i * 20},${yL - 30} q8,-14 0,-28`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.4} />)}</g>
          </>}
          hud={<><H l={[fiebre([{ f: 0, v: 101 }, { f: k(36.6), v: 102, d: 14 }], k(31.2))]} />
            <Txt t="FEVER" a={k(36.6)} b={k(38.6) + 4} top={820} left={1300} tam={60} mano color="#ff8a6a" />
            <Txt t="NO APPETITE" a={k(37.4)} b={k(38.6) + 4} top={900} left={1300} tam={60} mano color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 9 · June presiona y suelta · Lily grita · APPENDICITIS ============
const p09: PlanB = {
  a: 38.6, b: 47.6, trans: { tipo: "corte" },
  sfx: [[39.4, "cloth", -8], [42.3, "cloth", -6], [43.1, "gasp", -4], [44.4, "heart1", -8], [46.5, "boom", -6], [46.6, "riser", -14, { dur: 1 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const g = golpe(f, k(43.1), 7);
      const yL = GR_HENIL;
      return (
        <Escena Set={Granero} pal={PAL} setProps={{ farol: 1 }} seed={509} mano={2}
          claves={[mira(0, 830, 380, 2.2), mira(k(42.0), 820, 390, 2.5, { curva: "inout" }), mira(k(43.1), 820 + g, 380, 2.6), mira(k(44.2), 900, 330, 2.3, { curva: "inout" }), mira(k(47.6), 930, 320, 2.7, { curva: "inout" })]}
          medio={<>
            <A {...act(LILY_CAMA, GR_PUNTOS.lily, { ruta: [{ f: 0, x: GR_PUNTOS.lily, y: yL }], asiento: [{ f: 0, v: 20 }], poses: [{ f: 0, v: { tronco: -70, pI: 90, rI: 10, pD: 95, rD: 20, hD: 40, cD: 120, hI: 30, cI: 120, cabeza: -10 } }, { f: k(43.1), v: { tronco: -40, pI: 100, rI: 60, pD: 105, rD: 70, hD: 50, cD: 130, hI: 40, cI: 130, cabeza: 10 } }], caras: [{ f: 0, v: "cansado" }, { f: k(43.1), v: "miedo" }, { f: k(44.4), v: "triste" }], dir: [{ f: 0, v: 1 }], luz: BORDE_CALIDO })} />
            <A {...act(JUNE, GR_PUNTOS.lily + 150, { ruta: [{ f: 0, x: GR_PUNTOS.lily + 150, y: yL }], poses: [{ f: 0, v: "arrodillado" }, { f: k(39.4), v: { tronco: 30, pI: 0, rI: 90, pD: 90, rD: 90, hD: 70, cD: 30, hI: 60, cI: 30 } }, { f: k(42.3), v: { tronco: 10, pI: 0, rI: 90, pD: 90, rD: 90, hD: 40, cD: 50, hI: 30, cI: 40 } }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "determinado" }, { f: k(44.3), v: "triste" }], miradas: [{ f: 0, v: { x: -1, y: 0.4 } }, { f: k(45.6), v: { x: 0, y: 0 } }] })} />
          </>}
          hud={<><H l={[fiebre(102)]} /><Mano t="APPENDICITIS" x={960} y={230} desde={k(46.6)} tam={130} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 10 · por qué asusta: línea de tiempo de velas, el apéndice que revienta, fines de 1800 ============
const p10: PlanB = {
  a: 47.6, b: 60.4, trans: { tipo: "fundido", d: 12 },
  sfx: [[47.7, "whoosh"], [49.2, "match", -8], [50.0, "match", -10], [50.8, "match", -10], [52.4, "drop", -10], [55.6, "pencil", -8, { dur: 2 }], [58.9, "tick", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const velas = Array.from({ length: 9 }).map((_, i) => ({ x: 200 + i * 230, on: interpolate(f, [k(49.2) + i * 8, k(49.2) + i * 8 + 6], [0, 1], cl) }));
      return (
        <Escena Set={Mural} pal={PAL} setProps={{ velas }} seed={510} mano={1.8}
          claves={[mira(0, 900, 560, 0.85), mira(k(55.0), 1300, 540, 0.95, { curva: "inout" }), mira(k(60.4), 1900, 560, 1.0, { curva: "inout" })]}
          detras={<>
            {/* apéndice de tiza: tubito que se hincha y estalla en un borrón suave (sin anatomía real) */}
            <g transform="translate(960,330)">
              <Tiza d="M-160,0 C-80,-60 80,-60 160,0 C200,30 180,80 120,70" f={f} desde={k(50.8)} dur={20} ancho={8} />
              <circle cx={130} cy={74} r={interpolate(f, [k(51.4), k(52.4)], [14, 44], cl)} fill="none" stroke="#ff8a6a" strokeWidth={6} opacity={interpolate(f, [k(52.4), k(53.0)], [1, 0], cl)} />
              {f > k(52.4) && Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={130 + Math.cos(i) * interpolate(f, [k(52.4), k(54.0)], [10, 120], cl)} cy={74 + Math.sin(i) * interpolate(f, [k(52.4), k(54.0)], [10, 90], cl)} r={8} fill="#ff8a6a" opacity={0.7} />)}
            </g>
            {/* médico de 1880 con delantal */}
            <A {...act(LEVITA_DELANTAL, 1900, { ruta: [{ f: k(55.4), x: 2300, y: P }, { f: k(57.4), x: 1950, y: P }], caras: [{ f: 0, v: "determinado" }], poses: [{ f: 0, v: "parado" }, { f: k(57.6), v: "señalar" }], opacidad: (ff) => interpolate(ff, [k(55.4), k(55.9)], [0, 1], cl) })} />
          </>}
          hud={<><H l={[anio([{ f: 0, v: 1700 }, { f: k(56.0), v: 1886, d: 40 }], k(55.6))]} /><Txt t="BURST · INFECTION" a={k(52.4)} b={k(55.4)} top={760} tam={60} mano color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 11 · antes de eso: cruces en la colina; «June is not a surgeon» ============
const p11: PlanB = {
  a: 60.4, b: 65.4, trans: { tipo: "fundido", d: 10 },
  sfx: [[60.5, "wind_cold", -14, { dur: 3 }], [63.6, "whoosh", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(63.4)) return (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "ocaso", estacion: "invierno" }} seed={511} mano={2}
          claves={[mira(0, 2500, 520, 0.8), mira(k(63.4), 2600, 520, 0.85, { curva: "inout" })]}
          medio={<>{Array.from({ length: 9 }).map((_, i) => <Cruz key={i} x={2200 + i * 80} y={P - 160 - Math.sin(i / 2) * 40} s={0.7 + (i % 3) * 0.1} />)}</>}
          hud={<H />} />
      );
      return (
        <Escena Set={Granero} pal={PAL} setProps={{ farol: 1 }} seed={511} mano={2}
          claves={[mira(0, 900, 360, 2.4), mira(k(65.4), 920, 350, 2.6, { curva: "inout" })]}
          medio={<A {...act(JUNE, GR_PUNTOS.lily + 150, { ruta: [{ f: 0, x: GR_PUNTOS.lily + 150, y: GR_HENIL }], poses: [{ f: 0, v: "arrodillado" }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 0, y: 0.3 } }] })} />}
          hud={<><H /><Txt t="NOT A SURGEON" a={k(63.6)} b={k(65.4) + 4} top={820} tam={64} mano color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 12 · flashback: June le pasa instrumentos a un cirujano ============
const p12: PlanB = {
  a: 65.4, b: 70.8, trans: { tipo: "luz", d: 10 },
  sfx: [[65.5, "whoosh"], [66.4, "radio_ping", -16], [67.4, "metal_tool", -8], [69.0, "metal_tool", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = LOBBY_PUNTOS.guardia;
      return (
        <Escena Set={Lobby} pal={PAL} setProps={{ luces: 1, afuera: "dia" }} seed={512} mano={2}
          claves={[mira(0, x, 560, 1.4), mira(k(70.8), x + 60, 540, 1.6, { curva: "inout" })]}
          medio={<>
            <rect x={x - 200} y={P - 170} width={400} height={30} rx={6} fill="#dfe8ec" /><rect x={x - 20} y={P - 140} width={40} height={140} fill="#8a96a4" />
            <Halo x={x} y={P - 520} r={600} color="#ffffff" fuerza={0.4} />
            <A {...act(CIRUJANO, x + 240, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 60, cD: 60, hI: 50, cI: 60, tronco: 14 } }, { f: k(67.2), v: { hD: 80, cD: 10, hI: 50, cI: 60, tronco: 10 } }], caras: [{ f: 0, v: "determinado" }], luz: { lado: -1, color: "#e6f4ff", fuerza: 0.8 } })} />
            <A {...act(JUNE_QUIRO, x - 260, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(66.6), v: { hD: 85, cD: 10 } }, { f: k(67.8), v: "parado" }], caras: [{ f: 0, v: "neutral" }, { f: k(69.4), v: "duda" }], luz: { lado: 1, color: "#e6f4ff", fuerza: 0.8 } })} />
          </>}
          hud={<><H /><Txt t="BEFORE" a={k(65.6)} b={k(70.8)} top={150} tam={44} chip /><Txt t="NEVER CUT INTO A PERSON" a={k(69.0)} b={k(70.8) + 4} top={860} tam={56} mano color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 13 · lo que cambió: libros con Nan; los estudios; Plan A / Plan B ============
const Figuritas: React.FC<{ x: number; y: number; desde: number; ambar: number }> = ({ x, y, desde, ambar }) => {
  const f = useF();
  return (
    <g>{Array.from({ length: 30 }).map((_, i) => {
      const t = interpolate(f, [desde + i * 2, desde + i * 2 + 10], [0, 1], cl);
      const am = i % 10 === 3 && f > ambar;
      return <g key={i} transform={`translate(${x + (i % 10) * 44},${y + Math.floor(i / 10) * 70 - t * 30})`} opacity={t}><circle cy={-40} r={11} fill={am ? AMBAR : "#7ad08a"} /><rect x={-9} y={-28} width={18} height={30} rx={8} fill={am ? AMBAR : "#7ad08a"} /></g>;
    })}</g>
  );
};
const p13: PlanB = {
  a: 70.8, b: 94.4, trans: { tipo: "fundido", d: 10 },
  sfx: [[70.9, "chair", -10], [73.6, "page", -6], [75.0, "page", -8], [77.2, "paper", -8], [80.0, "pop", -10], [82.0, "pop", -10], [87.4, "tick", -6], [88.5, "tick", -6], [92.8, "chalk", -6, { dur: 1.5 }], [94.5, "chalk", -6, { dur: 1.5 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const mesa = L.mesa;
      const pizarra = f > k(91.6);
      return (
        <Liv claves={pizarra
          ? [mira(0, 2900, 560, 1.05), mira(k(92.6), GL_PIZARRA.x + 105, GL_PIZARRA.y + 90, 2.4, { curva: "inout" }), mira(k(94.4), GL_PIZARRA.x + 105, GL_PIZARRA.y + 110, 2.5)]
          : [mira(0, mesa, 600, 1.2), mira(k(77.0), mesa + 40, 560, 1.5, { curva: "inout" }), mira(k(87.0), mesa + 20, 570, 1.35, { curva: "inout" }), mira(k(91.6), mesa, 560, 1.15, { curva: "inout" })]}
          sp={{ farol: 1, libros: 1, reglas: [{ t: "1. FRESH FIRST", desde: -100 }, { t: "2. NOTHING RISKY ALONE", desde: -100 }, { t: "3. ONE THING…", desde: -100 }, { t: "PLAN A: IV ANTIBIOTICS", desde: k(92.8), color: "#b8382c" }, { t: "PLAN B: THE TABLE", desde: k(94.5), color: "#b8382c" }] }}
          medio={<>
            <A {...act(JUNE, mesa - 140, { asiento: [{ f: 0, v: 60 }], poses: [{ f: 0, v: "sentado" }, { f: k(77.4), v: { tronco: 10, pI: 88, rI: 88, pD: 92, rD: 92, hD: 75, cD: 30, hI: 25, cI: 50 } }, { f: k(88.4), v: "sentado" }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "duda" }, { f: k(88.5), v: "feliz" }], miradas: [{ f: 0, v: { x: 0.6, y: 0.5 } }, { f: k(88.0), v: { x: 1, y: 0 } }] })} />
            <A {...act(NAN, mesa + 200, { ruta: [{ f: 0, x: mesa + 500, y: P }, { f: k(73.0), x: mesa + 200, y: P }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 40, cD: 80 } }, { f: k(73.6), v: { hD: 70, cD: 40, tronco: 10 } }, { f: k(75.0), v: "pensar" }], caras: [{ f: 0, v: "feliz" }], enManoD: (ff: number) => ff < k(73.8) ? <g transform="scale(0.6)"><Libro /></g> : null })} />
            <Figuritas x={mesa + 120} y={P - 520} desde={k(78.0)} ambar={k(87.6)} />
            <text x={mesa + 120} y={P - 640} fontFamily="Arial" fontWeight={700} fontSize={26} fill="#f6ecd2" opacity={f > k(78.0) && f < k(91.6) ? 0.9 : 0}>EUROPE · USA · ANTIBIOTICS ALONE</text>
          </>}
          hud={<><H />
            <Txt t="IN THE LAST 20 YEARS" a={k(77.0)} b={k(80.0)} top={150} tam={44} chip />
            <Txt t="NOT EVERYONE" a={k(87.3)} b={k(88.5)} top={820} tam={60} mano color={AMBAR} />
            <Txt t="A REAL CHANCE" a={k(89.8)} b={k(92.6)} top={820} tam={64} mano color="#7ad08a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 14 · Plan B: la mesa tapada con un paño, Nan con el libro ============
const p14: PlanB = {
  a: 94.4, b: 104.0, trans: { tipo: "corte" },
  sfx: [[97.4, "cloth", -6], [98.2, "chair", -10], [100.6, "page", -6], [101.8, "page", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Liv claves={[mira(0, L.mesa, 600, 1.0), mira(k(104.0), L.mesa + 60, 600, 1.3, { curva: "inout" })]}
          sp={{ farol: 1, pano: interpolate(f, [k(97.2), k(98.2)], [0, 1], cl) }}
          medio={<>
            <A {...act(NAN, L.mesa + 420, { asiento: [{ f: 0, v: 60 }], poses: [{ f: 0, v: { tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 60, cD: 80, hI: 50, cI: 80, cabeza: 10 } }], dir: [{ f: 0, v: -1 }], habla: [[k(100.4), k(104.0)]], caras: [{ f: 0, v: "determinado" }], enManoD: <g transform="scale(0.8)"><Libro /></g> })} />
            <A {...act(JUNE, L.mesa - 380, { ruta: [{ f: 0, x: L.mesa - 380, y: P }], poses: [{ f: 0, v: "brazosCruzados" }, { f: k(98.0), v: "manosCintura" }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "determinado" }] })} />
          </>}
          hud={<><H /><Txt t="PLAN B" a={k(97.4)} b={k(104.0)} top={150} tam={56} chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 15 · Theo y Gus a Duluth de noche ============
const p15: PlanB = {
  a: 104.0, b: 111.5, trans: { tipo: "fundido", d: 12 },
  sfx: [[104.1, "truck", -10, { dur: 4 }], [106.6, "car_pass", -12], [109.0, "wind_cold", -18, { dur: 2.5 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(108.0)) {
        const x = interpolate(f, [0, k(108.0)], [1700, 2900], cl);
        return (
          <Escena Set={Panorama} pal={PAL} setProps={{ hora: "noche", luces: 0, nieve: 0.8, ventana: 0 }} seed={515} mano={2}
            claves={[mira(0, 1800, 560, 0.75), mira(k(108.0), 2500, 560, 0.85, { curva: "inout" })]}
            frente={<Auto x={x} y={P + 120} color="#7a3a2a" tipo="pickup" s={1.2} faros nieve={0.3} />}
            hud={<><H l={[dia(330)]} /><Txt t="DULUTH · ST. MARY'S" a={k(104.6)} b={k(108.0)} top={860} tam={56} chip /></>} />
        );
      }
      return (
        <Escena Set={StMarys} pal={PAL} setProps={{ hora: "noche", luces: 0, nieve: 0.8, ventana: interpolate(f, [k(108.6), k(109.4), k(110.4), k(111.2)], [0, 0.8, 0.8, 0], cl) }} seed={515} mano={2}
          claves={[mira(0, 1150, 560, 0.6), mira(k(111.5), 1215, 380, 1.3, { curva: "inout" })]}
          hud={<><H l={[dia(330)]} /><Txt t="EP. 1" a={k(108.6)} b={k(111.4)} top={150} tam={40} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 16 · la puerta con cinta; el pasillo oscuro con linternas ============
const p16: PlanB = {
  a: 111.5, b: 117.2, trans: { tipo: "corte" },
  sfx: [[112.4, "tape", -4], [113.2, "door_glass", -8], [114.1, "floor_step", -12], [114.6, "floor_step", -12], [115.1, "floor_step", -12], [115.6, "floor_step", -12], [116.1, "floor_step", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(114.0)) return (
        <Escena Set={Farmacia} pal={PAL} setProps={{ cinta: interpolate(f, [k(112.4), k(113.2)], [0, 1], cl) }} seed={516} mano={2}
          claves={[mira(0, -240, 540, 1.4), mira(k(114.0), -200, 560, 1.5, { curva: "inout" })]}
          medio={<A {...act(THEO, 120, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 90, cD: 20 } }], caras: [{ f: 0, v: "determinado" }], luz: BORDE_FRIO, enManoI: farol(f) })} />}
          hud={<H />} />
      );
      return (
        <Escena Set={PasilloFarmacia} pal={PAL} setProps={{ llenado: 0.55, luzFarol: { x: interpolate(f, [k(114), k(117.2)], [1100, 820], cl), y: interpolate(f, [k(114), k(117.2)], [1150, 900], cl), on: 1 } }} seed={516} mano={2}
          claves={[mira(0, 900, 600, 1.0), mira(k(117.2), 820, 600, 1.12, { curva: "inout" })]}
          medio={<>
            <A {...act(THEO, 0, { ruta: [{ f: k(114), x: 1150, y: 1180 }, { f: k(117.2), x: 860, y: 960 }], escala: 1.2, poses: [{ f: 0, v: { hD: 40, cD: 70 } }], enManoD: farol(f), luz: { lado: 1, color: "#ffb04a", fuerza: 1 } })} />
            <A {...act(GUS, 0, { ruta: [{ f: k(114), x: 1400, y: 1240 }, { f: k(117.2), x: 1060, y: 990 }], escala: 1.25, poses: [{ f: 0, v: { hD: 50, cD: 150, cabeza: 6 } }], caras: [{ f: 0, v: "asco" }], luz: { lado: -1, color: "#ffb04a", fuerza: 0.8 } })} />
          </>}
          hud={<><H /><Txt t="COLD · DARK · DUST" a={k(114.4)} b={k(117.2) + 4} top={860} tam={56} mano color="#cfd8ff" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 17 · la farmacia exacta; la fecha no es un acantilado; el programa militar ============
const p17: PlanB = {
  a: 117.2, b: 135.4, trans: { tipo: "corte" },
  sfx: [[117.3, "lantern", -8, { dur: 1.5 }], [117.6, "riser", -14, { dur: 1.5 }], [122.6, "stamp", -6], [126.4, "tick", -8], [127.6, "tick", -8], [128.8, "tick", -8], [130.0, "tick", -8], [131.6, "paper", -10], [132.6, "bottle_bin", -8], [133.4, "bottle_bin", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const luz = interpolate(f, [k(117.4), k(118.6)], [0.1, 1], cl);
      const militar = f > k(125.0);
      return (
        <Escena Set={Farmacia} pal={PAL} setProps={{ cinta: 1, frascosTurbios: interpolate(f, [k(136.4), k(138.0)], [0, 1], cl) }} seed={517} mano={2}
          claves={militar
            ? [mira(0, 2500, 520, 1.0), mira(k(129.0), 2720, 480, 1.3, { curva: "inout" }), mira(k(135.4), 2650, 520, 1.15, { curva: "inout" })]
            : [mira(0, 1500, 560, 1.3), mira(k(119.6), 1600, 470, 0.62, { curva: "inout" }), mira(k(121.5), 1700, 480, 0.7, { curva: "inout" }), mira(k(125.0), 2200, 470, 0.85, { curva: "inout" })]}
          detras={<g opacity={1 - luz}><rect x={-1000} y={-800} width={5500} height={2500} fill="#05060c" opacity={0.6} /></g>}
          medio={<>
            <A {...act(THEO, militar ? 2400 : 1500, { ruta: militar ? [{ f: 0, x: 2340, y: P }] : [{ f: 0, x: 1350, y: P }, { f: k(121.0), x: 1650, y: P }], poses: [{ f: 0, v: "agarrarAlto" }, { f: k(119.0), v: { hD: 40, cD: 70 } }], enManoD: farol(f), caras: [{ f: 0, v: "sorpresa" }, { f: k(121.0), v: "feliz" }], luz: { lado: 1, color: "#ffb04a", fuerza: 1 } })} />
            <A {...act(GUS, militar ? 2850 : 1900, { dir: [{ f: 0, v: militar ? -1 : 1 }], poses: [{ f: 0, v: militar ? { hD: 80, cD: 80, cabeza: 10 } : "parado" }], caras: [{ f: 0, v: militar ? "duda" : "sorpresa" }, { f: k(129.2), v: "feliz" }], luz: { lado: -1, color: "#ffb04a", fuerza: 0.8 } })} />
            <Halo x={militar ? 2400 : interpolate(f, [0, k(121.0)], [1350, 1650], cl)} y={P - 200} r={900} color="#ffc56a" fuerza={0.55 * luz} />
            {/* EXP: el acantilado que se vuelve rampa (dibujo de tiza sobre la pared) */}
            {!militar && <g opacity={interpolate(f, [k(122.4), k(122.8), k(124.6), k(125.0)], [0, 1, 1, 0], cl)}>
              <path d={`M900,${P - 700} H1300 ${f > k(123.6) ? `C1500,${P - 700} 1700,${P - 360} 2000,${P - 340}` : `V${P - 340} H2000`}`} stroke="#f2ead8" strokeWidth={8} fill="none" />
              <text x={950} y={P - 720} fontFamily="Arial Black, Arial" fontWeight={900} fontSize={48} fill="#ff6a5a">EXP</text>
            </g>}
          </>}
          hud={<><H />
            <Txt t="THE DATE IS NOT A CLIFF" a={k(122.6)} b={k(125.0)} top={860} tam={60} mano color={AMBAR} />
            {militar && ["+1 YR", "+2 YRS", "+4 YRS", "+5 YRS"].map((t, i) => <Txt key={t} t={t} a={k(126.4 + i * 1.2)} b={k(134.8)} top={300 + i * 80} left={1450} tam={56} mano color="#7ad08a" />)}
            <Txt t="STORED WELL" a={k(132.0)} b={k(135.4)} top={860} tam={56} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 18 · líquidos que se rompen · insulina necesita frío ============
const p18: PlanB = {
  a: 135.4, b: 143.0, trans: { tipo: "corte" },
  sfx: [[136.4, "glass", -8], [137.2, "bottle_bin", -6], [139.8, "fridge_tap", -6], [141.2, "sparkle", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Farmacia} pal={PAL} setProps={{ cinta: 1, frascosTurbios: interpolate(f, [k(136.0), k(138.4)], [0, 1], cl) }} seed={518} mano={2}
          claves={f < k(139.2) ? [mira(0, 1500, 600, 1.6), mira(k(139.2), 1550, 600, 1.7, { curva: "inout" })] : [mira(0, 3150, 560, 1.2), mira(k(143.0), 3200, 560, 1.3, { curva: "inout" })]}
          medio={<>
            <Halo x={f < k(139.2) ? 1500 : 3000} y={P - 260} r={800} color="#ffc56a" fuerza={0.5} />
            {f < k(139.2)
              ? <A {...act(THEO, 1300, { poses: [{ f: 0, v: { hD: 80, cD: 40 } }, { f: k(137.0), v: { hD: 30, cD: 20 } }], caras: [{ f: 0, v: "asco" }], enManoI: farol(f), luz: { lado: 1, color: "#ffb04a", fuerza: 1 } })} />
              : <A {...act(GUS, 2900, { poses: [{ f: 0, v: "parado" }, { f: k(139.8), v: { hD: 90, cD: 10, tronco: 8 } }, { f: k(140.4), v: "brazosCruzados" }], caras: [{ f: 0, v: "enojo" }, { f: k(140.6), v: "picaro" }], luz: { lado: 1, color: "#ffb04a", fuerza: 1 } })} />}
          </>}
          hud={<><H />
            <Txt t="LIQUIDS BREAK DOWN" a={k(136.4)} b={k(139.2)} top={860} tam={56} mano color="#ff8a6a" />
            <Txt t="INSULIN NEEDS COLD" a={k(139.4)} b={k(141.0)} top={860} tam={56} mano color="#8fd3ff" />
            <Txt t="PILLS & POWDERS HOLD UP" a={k(141.0)} b={k(143.0) + 4} top={860} tam={56} mano color="#7ad08a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 19 · «Doses.» el contador nace; Theo carga la camioneta ============
const p19: PlanB = {
  a: 143.0, b: 156.9, trans: { tipo: "corte" },
  sfx: [[145.8, "boom", -14], [146.0, "tick", -2], [147.0, "cart", -8, { dur: 4 }], [148.6, "box", -8], [150.2, "box", -8], [151.8, "box", -8], [153.4, "pour", -16], [155.4, "lantern", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = interpolate(f, [k(146.8), k(153.0)], [900, 2300], cl);
      const cajas = Math.floor(interpolate(f, [k(147.4), k(155.0)], [0, 8], cl));
      return (
        <Escena Set={Farmacia} pal={PAL} setProps={{ cinta: 1, vaciar: interpolate(f, [k(147.0), k(154.0)], [0, 0.5], cl) }} seed={519} mano={2}
          claves={[mira(0, 1800, 520, 0.8), mira(k(146.8), 900, 600, 1.1, { curva: "inout" }), mira(k(153.0), 2300, 600, 1.1, { curva: "inout" }), mira(k(156.9), 2500, 560, 0.95, { curva: "inout" })]}
          medio={<>
            <Halo x={x} y={P - 260} r={900} color="#ffc56a" fuerza={0.55} />
            <A {...act(THEO, 0, { ruta: [{ f: 0, x: 860, y: P }, { f: k(146.8), x: 860, y: P }, { f: k(153.0), x: 2260, y: P, curva: "lineal" }], poses: [{ f: 0, v: "empujar" }], caras: [{ f: 0, v: "determinado" }], luz: { lado: 1, color: "#ffb04a", fuerza: 1 } })} />
            <g transform={`translate(${x + 60},${P})`}>
              <rect x={0} y={-130} width={180} height={90} fill="none" stroke="#c8ccd6" strokeWidth={6} />
              {[0, 34, 68, 102, 136].map((d) => <rect key={d} x={d} y={-130} width={3} height={90} fill="#c8ccd6" />)}
              {Array.from({ length: cajas }).map((_, i) => <rect key={i} x={6 + (i % 4) * 42} y={-176 - Math.floor(i / 4) * 40} width={38} height={40} rx={3} fill={["#e9ecef", "#cfe8f2", "#5a7442"][i % 3]} />)}
              {[20, 160].map((d) => <circle key={d} cx={d} cy={-12} r={12} fill="#2a2a30" />)}
              {cajas >= 8 && <g transform="translate(90,-260)"><FarolMano s={0.8} f={f} on={0.4} halo={0.3} /></g>}
            </g>
            <A {...act(GUS, 2700, { poses: [{ f: 0, v: { hD: 70, cD: 80 } }], caras: [{ f: 0, v: "feliz" }], dir: [{ f: 0, v: -1 }], luz: { lado: -1, color: "#ffb04a", fuerza: 0.8 } })} />
          </>}
          hud={<><H l={[dosis([{ f: 0, v: 0 }, { f: k(147.4), v: 60, d: 50 }, { f: k(150.0), v: 120, d: 50 }, { f: k(153.0), v: 184, d: 50 }], k(145.8))]} />
            <Mano t="DOSES" x={960} y={300} desde={k(145.8)} hasta={k(148.6)} tam={150} />
            <Txt t={"IV ANTIBIOTICS · SALINE\nNEEDLES · TAPE · LANTERN"} a={k(149.0)} b={k(156.9)} top={820} tam={46} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 20 · la vía a farol · Lily agarra la oreja de Ore ============
const p20: PlanB = {
  a: 156.9, b: 163.7, trans: { tipo: "fundido", d: 12 },
  sfx: [[157.0, "lantern", -10, { dur: 3 }], [158.2, "cloth", -8], [159.0, "drip", -10], [159.8, "tick", -8], [161.0, "dog_tail", -6, { dur: 2 }], [162.4, "breath", -14]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Liv claves={[mira(0, 950, 560, 1.15), mira(k(160.2), 900, 600, 1.45, { curva: "inout" }), mira(k(163.7), 880, 640, 2.0, { curva: "inout" })]}
          sp={{ farol: 1, suero: interpolate(f, [k(157.4), k(158.4)], [0, 1], cl) }}
          medio={<>
            <A {...lily({ caras: [{ f: 0, v: "cansado" }, { f: k(161.8), v: "neutral" }], poses: [{ f: 0, v: { tronco: 18, pI: 80, rI: 70, pD: 86, rD: 74, hD: 30, cD: 120, hI: 20, cI: 110, cabeza: 14 } }, { f: k(161.6), v: { tronco: 20, pI: 80, rI: 70, pD: 86, rD: 74, hD: 85, cD: 30, hI: 20, cI: 110, cabeza: 18 } }] })} />
            <MantaLily />
            <Ore x={1000} y={P} dir={-1} s={0.85} f={f} cola={f > k(161.0) ? 1 : 0.2} cabeza={-10} />
            <A {...act({ ...JUNE, accesorios: [...(JUNE.accesorios ?? []), { t: "delantal", color: "#e8eef0" }] }, 560, { poses: [{ f: 0, v: "arrodillado" }, { f: k(158.0), v: { tronco: 20, pI: 0, rI: 90, pD: 90, rD: 90, hD: 75, cD: 40, hI: 60, cI: 40 } }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "determinado" }] })} />
          </>}
          hud={<H l={[fiebre(102), dosis([{ f: 0, v: 184 }, { f: k(159.8), v: 183, d: 10 }])]} />} />
      );
    };
    return <Pl />;
  },
};

// ============ 21 · la espera: día 1, día 2, June dormida con el libro ============
const p21: PlanB = {
  a: 163.7, b: 173.6, trans: { tipo: "corte" },
  sfx: [[163.8, "drip", -10], [164.9, "tick", -6], [166.2, "clock", -14, { dur: 2 }], [167.3, "tick", -6], [168.0, "tick", -8], [169.6, "clock", -12, { dur: 3 }], [171.0, "snore", -14, { dur: 2.4 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const dia2 = f > k(167.3);
      const duerme = f > k(169.5);
      return (
        <Liv claves={duerme ? [mira(0, 700, 600, 1.4), mira(k(173.6), 640, 610, 1.7, { curva: "inout" })] : [mira(0, 1100, 560, 0.95), mira(k(169.5), 1100, 560, 1.0)]}
          sp={{ farol: dia2 && !duerme ? 0.2 : 1, suero: 1, sueroNivel: dia2 ? 0.4 : 0.7, hora: f > k(164.9) && f < k(166.6) ? "dia" : f > k(167.3) && f < k(168.8) ? "dia" : "noche", sol: (f > k(164.9) && f < k(166.6)) || (f > k(167.3) && f < k(168.8)) ? 0.6 : 0 }}
          medio={<>
            <A {...lily({ caras: [{ f: 0, v: "cansado" }] })} /><MantaLily />
            <Ore x={1010} y={P} dir={-1} s={0.8} f={f} echado={0.7} cabeza={14} />
            <A {...act(JUNE, 420, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: duerme ? [{ f: 0, v: { tronco: -6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 40, cD: 80, hI: 40, cI: 80, cabeza: 26 } }] : [{ f: 0, v: "sentado" }, { f: k(165.2), v: { tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 90, cD: 60 } }, { f: k(166.0), v: "sentado" }], caras: [{ f: 0, v: duerme ? "cansado" : "duda" }], enManoD: duerme ? <g transform="scale(0.7)"><Libro /></g> : undefined })} />
            <g><rect x={380} y={P - 160} width={20} height={160} fill="#5a3a24" /><rect x={300} y={P - 70} width={180} height={16} fill="#6a4a30" /></g>
          </>}
          hud={<H l={[fiebre(102), dosis([{ f: 0, v: 183 }, { f: k(167.3), v: 182, d: 10 }]), dia([{ f: 0, v: 0 }, { f: k(164.9), v: 1, d: 6 }, { f: k(167.3), v: 2, d: 6 }], k(164.9))]} />} />
      );
    };
    return <Pl />;
  },
};

// ============ 22 · tercera mañana: «toast»; baja la fiebre; día 7 caminando ============
const p22: PlanB = {
  a: 173.6, b: 184.6, trans: { tipo: "fundido", d: 10 },
  sfx: [[173.7, "birds", -18, { dur: 3 }], [175.0, "chair", -10], [176.4, "tick", -6], [177.6, "cloth", -8], [178.6, "tick", -6], [179.6, "wood_step", -10], [180.0, "wood_step", -10], [181.4, "kids_laugh", -16]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const d7 = f > k(178.9);
      return d7 ? (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "dia", estacion: "verano", helada: 0.8, crec: 1 }} seed={522} mano={2}
          claves={[mira(0, 3300, 560, 0.9), mira(k(184.6), 3200, 600, 1.3, { curva: "inout" })]}
          medio={<>
            <A {...act(LILY, 3050, { ruta: [{ f: k(178.9), x: 2900, y: P }, { f: k(181.0), x: 3150, y: P }], poses: [{ f: 0, v: "parado" }, { f: k(181.4), v: "manosCintura" }], caras: [{ f: 0, v: "feliz" }, { f: k(181.4), v: "enojo" }], habla: [[k(181.4), k(184.0)]] })} />
            <A {...act(BEN, 3380, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "encogerse" }], caras: [{ f: 0, v: "picaro" }] })} />
            <g transform={`translate(3280,${P - 10})`}>{[0, 1, 2].map((i) => <g key={i}><rect x={i * 30} y={-50} width={24} height={44} rx={5} fill="#cfe8f2" opacity={0.85} /><circle cx={i * 30 + 12} cy={-22} r={5} fill="#3a2a1a" /></g>)}</g>
          </>}
          hud={<><H l={[fiebre([{ f: 0, v: 99.1 }, { f: k(178.9), v: 98.6, d: 12 }]), dia([{ f: 0, v: 3 }, { f: k(178.9), v: 7, d: 10 }])]} /><Txt t="BEETLE PATROL!" a={k(182.4)} b={k(184.6) + 4} top={820} tam={60} mano color={AMBAR} /></>} />
      ) : (
        <Liv claves={[mira(0, 900, 600, 1.4), mira(k(176.4), 760, 610, 1.9, { curva: "inout" }), mira(k(178.9), 740, 600, 2.0)]}
          sp={{ farol: 0, hora: "dia", sol: 1, suero: 1, sueroNivel: 0.2, fuego: 0.3 }}
          medio={<>
            <A {...lily({ poses: [{ f: 0, v: { tronco: 18, pI: 80, rI: 70, pD: 86, rD: 74, hD: 30, cD: 120, hI: 20, cI: 110, cabeza: 14 } }, { f: k(174.6), v: { tronco: -2, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 50, hI: 25, cI: 50 } }], caras: [{ f: 0, v: "cansado" }, { f: k(174.6), v: "feliz" }], habla: [[k(175.0), k(176.0)]] })} />
            <A {...act(JUNE, 560, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: -6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 40, cD: 80, hI: 40, cI: 80, cabeza: 26 } }, { f: k(176.6), v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 110, cD: 40 } }], caras: [{ f: 0, v: "cansado" }, { f: k(176.6), v: "sorpresa" }, { f: k(177.6), v: "risa" }] })} />
          </>}
          hud={<><H l={[fiebre([{ f: 0, v: 102 }, { f: k(176.4), v: 99.1, d: 30 }]), dia([{ f: 0, v: 2 }, { f: k(173.8), v: 3, d: 6 }])]} /><GloboRadioMano t="Toast?" desde={k(175.0)} hasta={k(176.6)} /></>} />
      );
    };
    return <Pl />;
  },
};
const GloboRadioMano: React.FC<{ t: string; desde: number; hasta: number }> = ({ t, desde, hasta }) => <Txt t={t} a={desde} b={hasta} top={300} left={720} tam={80} mano color="#f6ecd2" />;

// ============ 23 · Plan A funcionó · June hace la cuenta: la mitad de lo fuerte se gastó ============
const p23: PlanB = {
  a: 184.6, b: 195.4, trans: { tipo: "corte" },
  sfx: [[185.3, "chalk", -6], [186.4, "chair", -10], [188.8, "tick", -8], [190.2, "tick", -6], [191.0, "tick", -6], [191.8, "tick", -6], [192.6, "tick", -6], [193.4, "drop", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const pizarra = f < k(186.2);
      const n = Math.round(interpolate(f, [k(190.0), k(194.0)], [24, 12], cl));
      return (
        <Liv claves={pizarra ? [mira(0, GL_PIZARRA.x + 105, GL_PIZARRA.y + 120, 2.3)] : [mira(0, L.mesa, 620, 1.3), mira(k(195.4), L.mesa, 600, 1.7, { curva: "inout" })]}
          sp={{ farol: 1, reglas: [{ t: "1. FRESH FIRST", desde: -100 }, { t: "2. NOTHING RISKY ALONE", desde: -100 }, { t: "3. ONE THING…", desde: -100 }, { t: "PLAN A: IV ANTIBIOTICS", desde: -100, color: "#b8382c", tilde: k(185.3) }, { t: "PLAN B: THE TABLE", desde: -100, color: "#b8382c" }] }}
          medio={!pizarra && <>
            <A {...act(JUNE, L.mesa - 140, { asiento: [{ f: 0, v: 60 }], poses: [{ f: 0, v: "sentado" }, { f: k(188.8), v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 80, cD: 20, hI: 25, cI: 50 } }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "duda" }, { f: k(192.0), v: "triste" }], miradas: [{ f: 0, v: { x: 1, y: 0.5 } }] })} />
            {Array.from({ length: 24 }).map((_, i) => <g key={i} opacity={i < n ? 1 : 0.18}><Vial x={L.mesa - 60 + (i % 8) * 34} y={P - 182 - Math.floor(i / 8) * 64} s={0.7} /></g>)}
          </>}
          hud={<><H l={[dosis([{ f: 0, v: 182 }, { f: k(190.2), v: 96, d: 110 }])]} />
            <Txt t="PLAN A WORKED" a={k(184.8)} b={k(186.2)} top={860} tam={60} mano color="#7ad08a" />
            <Txt t="THE STRONGEST ANTIBIOTICS" a={k(192.0)} b={k(195.4) + 4} top={860} tam={52} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 24 · «not coming back» · Duluth de noche, nadie fabrica ============
const p24: PlanB = {
  a: 195.4, b: 199.2, trans: { tipo: "fundido", d: 10 },
  sfx: [[195.5, "wind_cold", -14, { dur: 3.5 }]],
  el: (k) => (
    <Escena Set={Panorama} pal={PAL} setProps={{ hora: "noche", luces: 0, nieve: 0.8, ventana: 0, vapor: 0.4 }} seed={524} mano={2}
      claves={[mira(0, PANO_PUNTOS.centro, 540, 0.7), mira(k(199.2), PANO_PUNTOS.centro + 200, 520, 0.78, { curva: "inout" })]}
      hud={<><H l={[dosis(96)]} /><Txt t="NOBODY IS MAKING NEW ONES" a={k(197.5)} b={k(199.2) + 4} top={820} tam={58} mano color={AMBAR} /></>} />
  ),
};

// ============ 25 · «Every dose is one less on Earth» (eco de la miniatura) ============
const p25: PlanB = {
  a: 199.2, b: 202.0, trans: { tipo: "corte" },
  sfx: [[199.3, "boom", -6], [199.4, "riser", -16, { dur: 1 }], [200.8, "tick", -2]],
  el: (k) => (
    <><Miniatura k={k} />
      <H l={[dosis([{ f: 0, v: 96 }, { f: k(200.8), v: 95, d: 8 }])]} /><Txt t="ONE LESS ON EARTH" a={k(199.6)} b={k(202.0) + 4} top={880} tam={62} mano color={AMBAR} /></>
  ),
};

// ============ 26 · ¿pueden salvar a Lily? · en 10 años los estantes vacíos ============
const p26: PlanB = {
  a: 202.0, b: 207.8, trans: { tipo: "fundido", d: 10 },
  sfx: [[202.1, "breath", -14], [205.2, "tick", -8], [205.8, "tick", -8], [206.4, "tick", -8], [207.0, "wind_cold", -16, { dur: 1 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(205.0)) return (
        <Liv claves={[mira(0, 800, 620, 1.9), mira(k(205.0), 790, 630, 2.1, { curva: "inout" })]} sp={{ farol: 0.6 }}
          medio={<><A {...lily({ poses: [{ f: 0, v: { tronco: 40, pI: 80, rI: 70, pD: 86, rD: 74, hD: 30, cD: 120, hI: 20, cI: 110, cabeza: 30 } }], caras: [{ f: 0, v: "cansado" }] })} /><MantaLily /><Ore x={1010} y={P} dir={-1} s={0.8} f={f} echado={0.9} /></>}
          hud={<H l={[dosis(95)]} />} />
      );
      return (
        <Escena Set={Farmacia} pal={PAL} setProps={{ cinta: 1, vaciar: interpolate(f, [k(205.2), k(207.6)], [0.5, 1], cl), polvo: 1 }} seed={526} mano={2}
          claves={[mira(0, 1700, 520, 0.85), mira(k(207.8), 1700, 520, 0.7, { curva: "inout" })]}
          hud={<><H l={[dosis([{ f: 0, v: 95 }, { f: k(205.4), v: 0, d: 60 }]), anio([{ f: 0, v: 1 }, { f: k(205.2), v: 10, d: 50 }], k(205.2))]} /><Txt t="IN 10 YEARS?" a={k(205.4)} b={k(207.8) + 4} top={820} tam={64} mano color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 27 · los 10 a la mesa: medicina desde abajo ============
const DIEZ = [JUNE, THEO_CASA, GUS, MARCUS, ROSA, PRIYA, DEV, NAN, BEN, LILY];
const p27: PlanB = {
  a: 207.8, b: 215.9, trans: { tipo: "corte" },
  sfx: [[208.0, "chair", -10], [208.6, "chair", -12], [210.2, "page", -10], [212.0, "tick", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Liv claves={[mira(0, 2600, 560, 0.75), mira(k(215.9), 2700, 600, 1.05, { curva: "inout" })]} sp={{ farol: 1, libros: 1 }}
          medio={<>
            <Ore x={2150} y={P} dir={1} s={0.8} f={f} cola={0.5} echado={0.6} />
            {DIEZ.map((l, i) => i === 0
              ? <A key={i} {...act(l, L.mesa - 500, { poses: [{ f: 0, v: "señalar" }, { f: k(212.0), v: "manosCintura" }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "determinado" }], habla: [[k(208.0), k(215.0)]] })} />
              : <A key={i} {...act(l, L.mesa - 300 + i * 85 + (i > 4 ? 120 : 0), { asiento: [{ f: 0, v: l.alto ? 40 : 60 }], poses: [{ f: 0, v: "sentado" }, { f: k(209.0 + i * 0.2), v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 35, cD: 55 } }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: i % 3 ? "neutral" : "duda" }], seed: 30 + i })} />)}
          </>}
          hud={<><H /><Txt t="FROM THE BOTTOM UP" a={k(208.6)} b={k(215.9)} top={150} tam={50} chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 28 · 1: jabón y manos limpias; Semmelweis 1847 ============
const p28: PlanB = {
  a: 215.9, b: 229.4, trans: { tipo: "corte" },
  sfx: [[216.0, "whoosh"], [216.6, "pour", -8, { dur: 1.4 }], [218.2, "whoosh"], [219.0, "pour", -10], [221.2, "candle_out", -10], [222.0, "candle_out", -12], [222.8, "candle_out", -12], [223.6, "candle_out", -12], [227.6, "door", -8], [228.4, "door", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(218.1)) return (
        <Liv claves={[mira(0, 2250, 640, 1.8)]} sp={{ farol: 1 }}
          medio={<><Palangana x={2250} y={P - 180} espuma={interpolate(f, [0, k(217.4)], [0, 1], cl)} f={f} /><rect x={2120} y={P - 180} width={260} height={180} fill="#6a4a30" />
            <A {...act(JUNE, 2420, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { tronco: 20, hD: 70, cD: 60, hI: 60, cI: 70 } }], caras: [{ f: 0, v: "determinado" }], ajuste: (p, ff) => ({ ...p, cD: p.cD + 12 * Math.sin(ff / 2) }) })} /></>}
          hud={<><H /><Paso n="1" rot="SOAP · CLEAN HANDS" desde={k(216.0)} hasta={k(218.1) + 4} x={1300} y={330} /></>} />
      );
      const camas = Array.from({ length: 8 }).map((_, i) => ({ x: 1150 + i * 150, on: f < k(221.2) + i * 3 ? 1 : i % 4 === 0 ? 1 : 0 }));
      return (
        <Escena Set={Mural} pal={PAL} setProps={{ tono: "#2a2420", velas: camas }} seed={528} mano={1.8}
          claves={[mira(0, 1200, 560, 0.85), mira(k(224.4), 1600, 560, 0.95, { curva: "inout" }), mira(k(229.4), 1500, 560, 1.0, { curva: "inout" })]}
          detras={<>
            <Escrito t="VIENNA · 1847" x={300} y={260} f={f} desde={k(218.4)} tam={70} color="#f2ead8" />
            <Palangana x={700} y={P - 140} espuma={1} f={f} /><rect x={600} y={P - 140} width={200} height={140} fill="#4a3424" />
            <A {...act(LEVITA, 600, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 20, hD: 70, cD: 60, hI: 60, cI: 70 } }], caras: [{ f: 0, v: "determinado" }], luz: BORDE_CALIDO, ajuste: (p, ff) => ({ ...p, cD: p.cD + 10 * Math.sin(ff / 2) }) })} />
            {f > k(227.4) && [0, 1, 2].map((i) => <A key={i} {...act(LEVITA, 2150 + i * 130, { ruta: [{ f: k(227.4), x: 2150 + i * 130, y: P }, { f: k(229.4), x: 2550 + i * 130, y: P }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "enojo" }], seed: 40 + i })} />)}
          </>}
          hud={<><H l={[anio([{ f: 0, v: 1820 }, { f: k(218.4), v: 1847, d: 30 }], k(218.4))]} /><Txt t="DEATHS DROPPED" a={k(222.0)} b={k(227.4)} top={860} tam={58} mano color="#7ad08a" /><Txt t="NOBODY BELIEVED HIM" a={k(227.6)} b={k(229.4) + 4} top={860} tam={58} mano color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 29 · June hace ley el lavado de manos; Rosa hace jabón de ceniza ============
const p29: PlanB = {
  a: 229.4, b: 242.7, trans: { tipo: "corte" },
  sfx: [[229.6, "chalk", -6, { dur: 2 }], [232.4, "pour", -12], [233.6, "kids_laugh", -14], [235.6, "pop", -8], [237.4, "fire", -12, { dur: 5 }], [238.0, "stir", -6, { dur: 4 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(237.3)) return (
        <Liv claves={[mira(0, GL_PIZARRA.x + 105, GL_PIZARRA.y + 150, 2.2), mira(k(232.2), 2700, 600, 1.2, { curva: "inout" }), mira(k(237.3), 2600, 600, 1.25)]}
          sp={{ farol: 1, reglas: [{ t: "1. FRESH FIRST", desde: -100 }, { t: "2. NOTHING RISKY ALONE", desde: -100 }, { t: "3. ONE THING…", desde: -100 }, { t: "PLAN A: IV ANTIBIOTICS", desde: -100, color: "#b8382c", tilde: -100 }, { t: "PLAN B: THE TABLE", desde: -100, color: "#b8382c" }, { t: "4. WASH HANDS. ALWAYS.", desde: k(229.8), color: "#2f9a4a" }] }}
          medio={<>
            <Palangana x={2500} y={P - 180} espuma={1} f={f} /><rect x={2380} y={P - 180} width={260} height={180} fill="#6a4a30" />
            <A {...act(BEN, 2380, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 14, hD: 80, cD: 60, hI: 70, cI: 70 } }], caras: [{ f: 0, v: "risa" }], ajuste: (p, ff) => ({ ...p, cD: p.cD + 14 * Math.sin(ff / 2) }) })} />
            <A {...act(LILY, 2640, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { tronco: 14, hD: 80, cD: 60, hI: 70, cI: 70 } }], caras: [{ f: 0, v: "feliz" }], ajuste: (p, ff) => ({ ...p, cD: p.cD + 14 * Math.sin(ff / 2 + 1) }) })} />
            {f > k(232.6) && Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={2440 + i * 26 + Math.sin(f / 6 + i) * 10} cy={P - 220 - ((f - k(232.6)) * 2 + i * 20) % 200} r={6 + (i % 3) * 3} fill="none" stroke="#e8f4ff" strokeWidth={2.5} opacity={0.8} />)}
            <A {...act(PRIYA, 2950, { dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "neutral" }, { f: k(235.6), v: "sorpresa" }], miradas: [{ f: k(235.6), v: { x: -1, y: 0 } }] })} />
            <A {...act(DEV, 3100, { dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "neutral" }, { f: k(235.6), v: "picaro" }], poses: [{ f: 0, v: "parado" }, { f: k(235.8), v: { hD: 40, cD: 140, cabeza: 10 } }] })} />
          </>}
          hud={<><H />
            <Txt t="BEFORE COOKING · BEFORE ANY CUT" a={k(232.4)} b={k(235.4)} top={150} tam={46} chip />
            <Txt t="…BEFORE TOUCHING A BABY?" a={k(235.4)} b={k(237.3)} top={150} tam={46} chip color={AMBAR} /></>} />
      );
      return (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno", humo: 0.6 }} seed={529} mano={2}
          claves={[mira(0, 600, 600, 1.1), mira(k(242.7), 640, 620, 1.4, { curva: "inout" })]}
          medio={<>
            <g transform={`translate(560,${P})`}>
              <path d="M-110,-150 L110,-150 L90,-10 L-90,-10 Z" fill="#2a2a30" /><ellipse cy={-150} rx={110} ry={20} fill="#3a3a42" /><ellipse cy={-148} rx={96} ry={14} fill="#d8c8a0" />
              {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${-60 + i * 24},-6 q-10,-30 0,-56 q10,30 0,56`} fill={i % 2 ? "#ffb04a" : "#ff8a3a"} />)}
              <Halo x={0} y={-40} r={300} color="#ff8a3a" fuerza={0.4} />
              {[0, 1, 2].map((i) => <circle key={i} cx={Math.sin(f / 9 + i) * 20} cy={-200 - ((f * 1.2 + i * 40) % 140)} r={18} fill="#fff" opacity={0.25 * (1 - ((f * 1.2 + i * 40) % 140) / 140)} />)}
            </g>
            <g transform={`translate(330,${P})`}><path d="M-40,-90 L40,-90 L32,0 L-32,0 Z" fill="#8a96a4" /><ellipse cy={-90} rx={40} ry={8} fill="#5a5a60" /></g>
            <A {...act(ROSA, 740, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { tronco: 10, hD: 60, cD: 40, hI: 50, cI: 50 } }], caras: [{ f: 0, v: "determinado" }], enManoD: <rect x={-4} y={-10} width={8} height={170} fill="#8a5a36" transform="rotate(-30)" />, ajuste: (p, ff) => ({ ...p, hD: p.hD + 14 * Math.sin(ff / 8), hI: p.hI + 14 * Math.sin(ff / 8) }) })} />
          </>}
          hud={<><H /><Txt t="WOOD ASH + ANIMAL FAT = SOAP" a={k(238.0)} b={k(242.7) + 4} top={860} tam={52} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 30 · 2: agua limpia (hervir) ============
const Germen: React.FC<{ x: number; y: number; f: number; vive: number; i: number }> = ({ x, y, f, vive, i }) => (
  <g transform={`translate(${x + Math.sin(f / 7 + i) * 8},${y + Math.cos(f / 9 + i) * 6})`} opacity={vive}>
    <circle r={18} fill="#7ad08a" />{Array.from({ length: 6 }).map((_, k) => <rect key={k} x={-2} y={-28} width={4} height={10} fill="#7ad08a" transform={`rotate(${k * 60})`} />)}
    <circle cx={-6} cy={-4} r={4} fill="#fff" /><circle cx={6} cy={-4} r={4} fill="#fff" /><circle cx={-6} cy={-4} r={2} fill="#1a1a1a" /><circle cx={6} cy={-4} r={2} fill="#1a1a1a" />
  </g>
);
const p30: PlanB = {
  a: 242.7, b: 251.6, trans: { tipo: "corte" },
  sfx: [[242.8, "whoosh"], [243.4, "boil", -8, { dur: 5 }], [245.6, "pop", -12], [246.2, "pop", -12], [246.8, "pop", -12], [247.4, "pop", -12], [249.6, "pour", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = L.estufa, y = P - 280;
      return (
        <Liv claves={[mira(0, x, 560, 1.6), mira(k(248.0), x + 50, 540, 1.4, { curva: "inout" }), mira(k(251.6), x + 200, 560, 1.15, { curva: "inout" })]} sp={{ farol: 1, fuego: 1 }}
          medio={<>
            <g transform={`translate(${x},${y})`}>
              <rect x={-90} y={-130} width={180} height={130} rx={12} fill="#4a4a52" /><rect x={-100} y={-138} width={200} height={16} rx={6} fill="#3a3a42" />
              {Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={-70 + i * 20} cy={-140 - ((f * 2 + i * 13) % 30)} r={6} fill="#e8f4ff" opacity={0.7} />)}
              {Array.from({ length: 5 }).map((_, i) => <Germen key={i} x={-200 + i * 100} y={-260 - (i % 2) * 50} f={f} i={i} vive={interpolate(f, [k(245.6) + i * 18, k(245.6) + i * 18 + 8], [1, 0], cl)} />)}
            </g>
            <A {...act(MARCUS, x + 380, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(249.4), v: { hD: 60, cD: 60, tronco: 10 } }], caras: [{ f: 0, v: "determinado" }] })} />
          </>}
          hud={<><H /><Paso n="2" rot="CLEAN WATER" desde={k(242.8)} hasta={k(245.4)} x={1450} y={330} />
            <Txt t="CHOLERA · DYSENTERY" a={k(245.4)} b={k(248.2)} top={860} tam={56} mano color="#7ad08a" />
            <Txt t="MORE LIVES THAN ALMOST ANY DRUG" a={k(248.2)} b={k(251.6) + 4} top={860} tam={50} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 31 · 3: alcohol (el alambique de Dev y Marcus; Gus y el manotazo) ============
const p31: PlanB = {
  a: 251.6, b: 260.9, trans: { tipo: "corte" },
  sfx: [[251.7, "whoosh"], [253.4, "metal_tool", -6], [254.4, "metal_tool", -8], [255.2, "steam", -10, { dur: 2 }], [257.6, "pop", -4], [258.6, "drip", -6], [259.4, "glass", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const ax = GR_PUNTOS.alambique;
      return (
        <Escena Set={Granero} pal={PAL} setProps={{ farol: 1, alambique: 1, vapor: f > k(255.0) ? 1 : 0 }} seed={531} mano={2}
          claves={[mira(0, ax, 560, 1.2), mira(k(257.4), ax - 60, 600, 1.5, { curva: "inout" }), mira(k(258.4), ax - 20, 680, 2.4, { curva: "inout" })]}
          medio={<>
            <A {...act(DEV, ax - 260, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 16, hD: 70, cD: 50 } }], caras: [{ f: 0, v: "determinado" }], ajuste: (p, ff) => ({ ...p, cD: p.cD + 10 * Math.sin(ff / 3) }) })} />
            <A {...act(MARCUS, ax + 300, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 60, cD: 60 } }, { f: k(257.4), v: { hD: 110, cD: 20, tronco: -6 } }, { f: k(258.0), v: "brazosCruzados" }], caras: [{ f: 0, v: "neutral" }, { f: k(257.4), v: "enojo" }] })} />
            <A {...act(GUS, ax + 520, { ruta: [{ f: 0, x: ax + 700, y: P }, { f: k(256.6), x: ax + 480, y: P }, { f: k(258.2), x: ax + 620, y: P }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 80, cD: 30 } }, { f: k(257.6), v: "encogerse" }], caras: [{ f: 0, v: "picaro" }, { f: k(257.6), v: "sorpresa" }] })} />
            {/* bandeja de instrumentos que brilla con la gota */}
            <g transform={`translate(${ax - 30},${P - 180})`} opacity={f > k(258.4) ? 1 : 0}><rect x={-80} y={-10} width={160} height={14} rx={4} fill="#c8ccd6" />{[0, 1, 2].map((i) => <rect key={i} x={-60 + i * 40} y={-22} width={30} height={6} rx={3} fill="#e8eef6" />)}<Halo x={0} y={-20} r={120} color="#e8f4ff" fuerza={0.6} /></g>
          </>}
          hud={<><H /><Paso n="3" rot="ALCOHOL" desde={k(251.7)} hasta={k(253.6)} x={1450} y={330} />
            <Txt t="NOT FOR DRINKING" a={k(257.0)} b={k(258.4)} top={860} tam={60} mano color="#ff8a6a" />
            <Txt t="CLEANS WOUNDS & TOOLS" a={k(258.4)} b={k(260.9) + 4} top={860} tam={56} mano color="#7ad08a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 32 · 4: plantas con límites honestos (sauce, miel, la balanza) ============
const Sauce: React.FC<{ x: number; f: number }> = ({ x, f }) => (
  <g transform={`translate(${x},${P})`}>
    <path d="M-30,0 Q-20,-200 -10,-320 L20,-320 Q30,-200 40,0 Z" fill="#5a4030" />
    {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M${-10 + Math.cos(i) * 40},-320 q${-140 + i * 18},${-40} ${-160 + i * 20 + Math.sin(f / 30 + i) * 6},${200 + (i % 4) * 40}`} stroke="#8a9a6a" strokeWidth={5} fill="none" opacity={0.85} />)}
  </g>
);
const p32: PlanB = {
  a: 260.9, b: 279.7, trans: { tipo: "corte" },
  sfx: [[261.0, "whoosh"], [262.0, "snow_step", -10], [262.6, "snow_step", -10], [265.0, "wood_hit", -8], [266.2, "chalk", -8, { dur: 2 }], [272.4, "glass", -8], [274.0, "pencil", -10], [276.8, "metal", -8], [277.6, "tick", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(271.9)) return (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno" }} seed={532} mano={2}
          claves={[mira(0, 2600, 560, 0.85), mira(k(264.6), 2900, 600, 1.4, { curva: "inout" }), mira(k(271.9), 2900, 560, 1.5, { curva: "inout" })]}
          medio={<>
            <Sauce x={3000} f={f} />
            <A {...act(NAN, 0, { ruta: [{ f: 0, x: 2400, y: P }, { f: k(264.4), x: 2760, y: P }], caras: [{ f: 0, v: "feliz" }], luz: BORDE_FRIO })} />
            <A {...act(PRIYA, 0, { ruta: [{ f: 0, x: 2560, y: P }, { f: k(264.4), x: 2900, y: P }], poses: [{ f: 0, v: "parado" }, { f: k(265.0), v: { hD: 80, cD: 40, tronco: 6 } }, { f: k(268.0), v: "pensar" }], caras: [{ f: 0, v: "neutral" }, { f: k(266.0), v: "sorpresa" }], luz: BORDE_FRIO })} />
            <g transform={`translate(3000,${P - 200})`}>
              <Tiza d="M-60,-40 l30,-20 l30,20 l0,36 l-30,20 l-30,-20 Z M0,-4 l40,0 M-30,-60 l0,-30" f={f} desde={k(266.2)} dur={22} color={AMBAR} ancho={5} o={1} />
              {f > k(269.4) && <g transform="translate(80,-40)"><ellipse rx={30} ry={14} fill="#f2ece0" /><rect x={-2} y={-14} width={4} height={28} fill="#c8c4b8" /></g>}
            </g>
          </>}
          hud={<><H /><Paso n="4" rot="OLD PLANT MEDICINE" desde={k(261.0)} hasta={k(264.4)} x={1400} y={330} />
            <Txt t="WILLOW BARK · SALICIN ≈ ASPIRIN" a={k(266.0)} b={k(271.9)} top={860} tam={52} chip /></>} />
      );
      const caida = interpolate(f, [k(276.8), k(277.6)], [0, 1], cl);
      return (
        <Liv claves={[mira(0, L.mesa, 620, 1.6), mira(k(276.6), L.mesa + 30, 600, 1.9, { curva: "inout" })]} sp={{ farol: 1 }}
          medio={<>
            {f < k(276.6) ? <>
              <g transform={`translate(${L.mesa - 60},${P - 182})`}><rect x={-30} y={-80} width={60} height={80} rx={10} fill="#e3a531" opacity={0.85} /><rect x={-34} y={-92} width={68} height={16} rx={4} fill="#8a5a36" /></g>
              <Escrito t="EGYPT" x={L.mesa + 80} y={P - 420} f={f} desde={k(273.4)} tam={50} color="#f2ead8" />
              <Tiza d={`M${L.mesa + 90},${P - 380} q20,-40 60,0 q20,40 -10,80 h-40 q-30,-40 -10,-80 Z`} f={f} desde={k(273.6)} dur={20} color="#f2ead8" ancho={5} />
              <A {...act(ROSA, L.mesa + 200, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { tronco: 14, hD: 70, cD: 50 } }], caras: [{ f: 0, v: "feliz" }] })} />
            </> : <g transform={`translate(${L.mesa},${P - 182})`}>
              <rect x={-6} y={-200} width={12} height={200} fill="#8a7a5a" />
              <g transform={`rotate(${-18 * caida} 0 -200)`}>
                <rect x={-220} y={-206} width={440} height={12} fill="#8a7a5a" />
                <g transform="translate(-200,-180)"><path d="M-50,0 L50,0 L40,24 L-40,24 Z" fill="#c8b48a" /><path d="M-30,0 q30,-40 60,0" fill="#8a9a6a" /><circle cx={20} cy={-6} r={12} fill="#e3a531" /></g>
                <g transform="translate(200,-180)"><path d="M-50,0 L50,0 L40,24 L-40,24 Z" fill="#c8b48a" /><Vial y={0} s={0.8} brillo={0.5} /></g>
              </g>
            </g>}
          </>}
          hud={<><H />
            <Txt t="HONEY · ANTIBACTERIAL" a={k(272.0)} b={k(276.6)} top={860} tam={56} chip />
            <Txt t="THEY WORK, A LITTLE" a={k(276.7)} b={k(278.3)} top={860} tam={58} mano color="#7ad08a" />
            <Txt t="NOT MIRACLES" a={k(278.3)} b={k(279.7) + 4} top={860} tam={62} mano color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 33 · Dev y el pan mohoso; June se ríe ============
const PanMoho: React.FC = () => (
  <g transform="rotate(-80) scale(0.9)"><rect x={-50} y={-34} width={100} height={68} rx={22} fill="#d8b070" />{[[-20, -10], [15, 8], [-5, 14], [24, -16]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={10 + i * 2} fill="#7aa86a" opacity={0.9} />)}</g>
);
const p33: PlanB = {
  a: 279.7, b: 288.7, trans: { tipo: "corte" },
  sfx: [[282.2, "paper", -8], [283.0, "pop", -10], [285.2, "laugh", -10, { dur: 2.4 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Liv claves={[mira(0, L.mesa - 100, 600, 1.2), mira(k(282.2), L.mesa + 150, 560, 1.9, { curva: "inout" }), mira(k(285.0), L.mesa - 250, 600, 1.7, { curva: "inout" }), mira(k(288.7), L.mesa - 100, 600, 1.3, { curva: "inout" })]} sp={{ farol: 1 }}
          medio={<>
            <A {...act(DEV, L.mesa + 150, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(282.2), v: { hD: 130, cD: 30 } }], caras: [{ f: 0, v: "neutral" }, { f: k(282.2), v: "feliz" }], habla: [[k(282.2), k(285.0)]], enManoD: (ff: number) => ff > k(282.2) ? <PanMoho /> : null })} />
            <A {...act(JUNE, L.mesa - 250, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "brazosCruzados" }, { f: k(285.2), v: { hI: 40, cI: 130, hD: 45, cD: 130, tronco: 26, cabeza: 10 } }], caras: [{ f: 0, v: "duda" }, { f: k(285.2), v: "risa" }], ajuste: (p, ff) => ff > k(285.2) && ff < k(287.6) ? { ...p, tronco: p.tronco + 6 * Math.sin(ff / 1.6) } : p })} />
            <A {...act(MARCUS, L.mesa + 450, { dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "neutral" }, { f: k(285.4), v: "risa" }] })} />
          </>}
          hud={<><H /><GloboRadioMano t="Penicillin… from bread?" desde={k(282.2)} hasta={k(285.0)} /><Txt t="HERE'S THE TRUTH" a={k(287.6)} b={k(288.7) + 4} top={860} tam={58} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 34 · Fleming 1928 · diez años · tan poquito · murió cuando se acabó ============
const p34: PlanB = {
  a: 288.7, b: 307.2, trans: { tipo: "luz", d: 10 },
  sfx: [[288.8, "whoosh"], [291.8, "glass", -8], [295.2, "page", -10], [295.6, "page", -10], [296.0, "page", -10], [296.4, "page", -10], [296.8, "page", -10], [300.6, "drip", -8], [304.0, "candle_out", -6], [305.0, "sad", -16]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const hojas = Math.floor(interpolate(f, [k(295.2), k(297.2)], [0, 10], cl));
      return (
        <Escena Set={Mural} pal={PAL} setProps={{ tono: "#1e2a30", velas: [{ x: 1900, on: f < k(304.0) ? 1 : 0 }] }} seed={534} mano={1.8}
          claves={[mira(0, 800, 560, 1.0), mira(k(295.0), 1100, 560, 0.95, { curva: "inout" }), mira(k(300.0), 1400, 560, 1.05, { curva: "inout" }), mira(k(307.2), 1850, 640, 1.6, { curva: "inout" })]}
          detras={<>
            <Escrito t="LONDON · 1928" x={300} y={240} f={f} desde={k(289.0)} tam={66} />
            {/* placa de Petri con el halo */}
            <g transform="translate(700,520)"><ellipse rx={150} ry={46} fill="#e8f2f6" opacity={0.6} /><ellipse rx={130} ry={36} fill="#f2ead8" opacity={0.5} />{Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={-90 + (i % 5) * 40} cy={-14 + Math.floor(i / 5) * 24} r={6} fill="#c8b070" />)}<circle cx={30} cy={0} r={22} fill="#7aa86a" /><circle cx={30} cy={0} r={interpolate(f, [k(291.6), k(293.0)], [22, 60], cl)} fill="none" stroke="#7aa86a" strokeWidth={4} opacity={0.6} /></g>
            <A {...act(CIENTIFICO, 980, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "pensar" }], caras: [{ f: 0, v: "sorpresa" }], luz: BORDE_CALIDO })} />
            {/* calendario que pasa 10 hojas */}
            <g transform="translate(1250,300)"><rect x={-70} y={-90} width={140} height={160} rx={8} fill="#f2ead8" /><rect x={-70} y={-90} width={140} height={34} fill="#b8382c" /><text x={0} y={30} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={60} fill="#2a2420">{1928 + hojas + (hojas >= 10 ? 3 : 0)}</text></g>
            {[0, 1].map((i) => <A key={i} {...act(CIENTIFICO, 1300 + i * 160, { dir: [{ f: 0, v: i ? -1 : 1 }], poses: [{ f: 0, v: { hD: 70, cD: 60, tronco: 10 } }], caras: [{ f: 0, v: "determinado" }], seed: 60 + i, luz: BORDE_CALIDO, opacidad: (ff) => interpolate(ff, [k(295.0), k(295.6)], [0, 1], cl) })} />)}
            {/* el frasquito casi vacío: RECOVERED */}
            <g transform="translate(1600,640)" opacity={interpolate(f, [k(299.6), k(300.2)], [0, 1], cl)}><Vial s={1.6} color="#e8d8a0" /><rect x={-50} y={-30} width={100} height={22} fill="#f2ead8" /><text x={0} y={-13} textAnchor="middle" fontFamily="Arial" fontWeight={700} fontSize={14} fill="#2a2420">RECOVERED</text></g>
            {/* la ventana del hospital antiguo con su vela */}
            <g transform="translate(1900,560)"><rect x={-120} y={-200} width={240} height={220} fill="#141a24" stroke="#6a5a48" strokeWidth={10} /><rect x={-4} y={-200} width={8} height={220} fill="#6a5a48" /></g>
          </>}
          hud={<><H l={[anio([{ f: 0, v: 1900 }, { f: k(289.4), v: 1928, d: 24 }, { f: k(295.2), v: 1941, d: 60 }], k(289.0))]} />
            <Txt t="FLEMING · PENICILLIN" a={k(290.0)} b={k(293.0)} top={860} tam={56} chip />
            <Txt t="10+ YEARS" a={k(295.4)} b={k(298.0)} top={860} tam={64} mano color={AMBAR} />
            <Txt t="SO LITTLE OF THE DRUG" a={k(300.0)} b={k(304.0)} top={860} tam={56} mano color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 35 · tanques gigantes vs el granero chiquito ============
const p35: PlanB = {
  a: 307.2, b: 314.5, trans: { tipo: "fundido", d: 10 },
  sfx: [[307.3, "metal", -10], [308.6, "drone", -16, { dur: 2.5 }], [311.6, "paper", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "ocaso", estacion: "invierno", humo: 0.4 }} seed={535} mano={2}
          claves={[mira(0, GRANJA_PUNTOS.granero, 560, 1.0), mira(k(314.5), GRANJA_PUNTOS.granero + 900, 380, 0.5, { curva: "inout" })]}
          medio={<>
            {[0, 1, 2].map((i) => <g key={i} transform={`translate(${2700 + i * 600},${P})`}><rect x={-200} y={-1400} width={400} height={1400} rx={40} fill="#3a3e4c" /><ellipse cy={-1400} rx={200} ry={40} fill="#4a4e5c" />{[0, 1, 2, 3].map((r) => <rect key={r} x={-200} y={-1200 + r * 300} width={400} height={10} fill="#2a2e3a" />)}</g>)}
            <A {...act(DEV, GRANJA_PUNTOS.granero + 520, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { hD: 100, cD: 20 } }, { f: k(311.6), v: "encogerse" }], caras: [{ f: 0, v: "duda" }, { f: k(311.6), v: "triste" }], enManoD: (ff: number) => ff < k(311.6) ? <PanMoho /> : null, luz: { lado: -1, color: "#ffcf6e", fuerza: 0.8 } })} />
          </>}
          hud={<><H /><Txt t="LABS · CHEMISTRY · HUGE TANKS" a={k(307.6)} b={k(311.0)} top={860} tam={52} chip /><Txt t="NOT IN A BARN. NOT YET." a={k(311.0)} b={k(314.5) + 4} top={860} tam={60} mano color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 36 · la respuesta honesta en el cuaderno + «a pharmacy treated like gold» ============
const p36: PlanB = {
  a: 314.5, b: 328.2, trans: { tipo: "corte" },
  sfx: [[314.6, "page", -6], [315.0, "pencil", -8, { dur: 2 }], [322.2, "pencil", -8], [323.2, "pencil", -8], [324.2, "pencil", -8], [325.2, "pencil", -8], [326.6, "lock", -4], [326.7, "sparkle", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(325.8)) return <><Cuaderno lineas={[
        { t: "MEDICINE", desde: k(315.0), tam: 64, color: "#b8382c" },
        { t: "· clean hands", desde: k(322.2) }, { t: "· clean water", desde: k(323.0) }, { t: "· clean wounds", desde: k(323.8) }, { t: "· careful surgery", desde: k(324.6) }, { t: "· pharmacy = GOLD", desde: k(325.4), color: "#a8781a" },
      ]} /><H /></>;
      return (
        <Escena Set={Farmacia} pal={PAL} setProps={{ cinta: 1, vaciar: 0.5, oro: interpolate(f, [k(326.4), k(327.2)], [0, 1], cl) }} seed={536} mano={2}
          claves={[mira(0, FAR_PUNTOS.oro - 100, 560, 1.4), mira(k(328.2), FAR_PUNTOS.oro, 540, 1.7, { curva: "inout" })]}
          hud={<H />} />
      );
    };
    return <Pl />;
  },
};

// ============ 37 · la regla más importante: no lastimarse (Theo baja de la escalera, Gus la sostiene) ============
const p37: PlanB = {
  a: 328.2, b: 335.2, trans: { tipo: "corte" },
  sfx: [[328.4, "chalk", -6], [330.2, "stairs", -10], [330.8, "stairs", -10], [331.4, "stairs", -10], [332.0, "stairs", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Liv claves={[mira(0, GL_PIZARRA.x + 105, GL_PIZARRA.y + 80, 2.2), mira(k(329.8), 300, 520, 1.2, { curva: "inout" }), mira(k(335.2), 260, 560, 1.4, { curva: "inout" })]}
          sp={{ farol: 1, reglas: [{ t: "1. FRESH FIRST", desde: -100 }, { t: "2. NOTHING RISKY ALONE", desde: -100 }, { t: "3. ONE THING…", desde: -100 }] }}
          medio={<>
            <Tiza d={`M${GL_PIZARRA.x + 10},${GL_PIZARRA.y + 78} h190`} f={f} desde={k(328.4)} dur={10} color="#b8382c" ancho={4} o={1} />
            <A {...act(THEO_CASA, 0, { ruta: [{ f: 0, x: 140, y: P - 420 }, { f: k(330.0), x: 140, y: P - 420 }, { f: k(332.8), x: 0, y: P }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "agarrarAlto" }, { f: k(332.8), v: "parado" }], caras: [{ f: 0, v: "duda" }, { f: k(333.0), v: "feliz" }] })} />
            <A {...act(GUS, 300, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 120, cD: 20, hI: 110, cI: 20 } }], caras: [{ f: 0, v: "determinado" }, { f: k(333.0), v: "feliz" }] })} />
          </>}
          hud={<><H /><Txt t="DON'T GET HURT" a={k(329.0)} b={k(335.2) + 4} top={150} tam={66} mano color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 38 · Día 349, noche de septiembre: Lily dormida, June cuenta dosis a la vela ============
const p38: PlanB = {
  a: 335.2, b: 343.0, trans: { tipo: "fundido", d: 14 },
  sfx: [[335.3, "wind_soft", -18, { dur: 3 }], [335.4, "tick", -6], [339.0, "breath", -16], [341.0, "glass", -14], [341.8, "glass", -16]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(338.9)) return (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "noche", estacion: "verano", crec: 0.6, helada: 0.5, humo: 0.5 }} seed={538} mano={2}
          claves={[mira(0, GRANJA_PUNTOS.casa + 400, 480, 0.7), mira(k(338.9), GRANJA_PUNTOS.casa + 300, 500, 0.8, { curva: "inout" })]}
          medio={<VentanaCasa />}
          hud={<H l={[dia(349, k(0.3 * 30))]} />} />
      );
      return (
        <Liv claves={[mira(0, 800, 600, 1.6), mira(k(340.8), L.mesa - 100, 600, 1.5, { curva: "inout" }), mira(k(343.0), L.mesa - 60, 590, 1.7, { curva: "inout" })]} sp={{ farol: 0, fuego: 0.4 }}
          medio={<>
            <A {...lily({ poses: [{ f: 0, v: { tronco: 40, pI: 80, rI: 70, pD: 86, rD: 74, hD: 30, cD: 120, hI: 20, cI: 110, cabeza: 30 } }], caras: [{ f: 0, v: "neutral" }] })} /><MantaLily color="#2f7f86" />
            <Ore x={1010} y={P} dir={-1} s={0.8} f={f} echado={0.9} />
            <Vela x={L.mesa + 100} y={P - 180} f={f} s={1.2} />
            <A {...act(JUNE, L.mesa - 140, { asiento: [{ f: 0, v: 60 }], poses: [{ f: 0, v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 80, cD: 20, hI: 25, cI: 50 } }], dir: [{ f: 0, v: 1 }], habla: [[k(341.0), k(343.0)]], caras: [{ f: 0, v: "cansado" }], luz: { lado: 1, color: "#ffc56a", fuerza: 1 } })} />
            {Array.from({ length: 12 }).map((_, i) => <Vial key={i} x={L.mesa - 40 + (i % 6) * 32} y={P - 182 - Math.floor(i / 6) * 60} s={0.65} />)}
          </>}
          hud={<H l={[dosis(95), dia(349)]} />} />
      );
    };
    return <Pl />;
  },
};

// ============ 39 · arriba, Gus gira el dial; alguien contesta ============
const p39: PlanB = {
  a: 343.0, b: 356.6, trans: { tipo: "corte" },
  sfx: [[343.1, "whoosh", -10], [343.6, "static", -14, { dur: 6.5 }], [344.4, "radio_tune", -12, { dur: 5.5 }], [350.3, "radio_ping", -8], [350.4, "static", -20, { dur: 6 }], [352.2, "riser", -16, { dur: 2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const aguja = interpolate(f, [k(344.0), k(350.3)], [0.1, 0.62], cl) + (f < k(350.3) ? 0.01 * Math.sin(f / 3) : 0);
      const luz = interpolate(f, [k(350.3), k(351.0)], [0.5, 1], cl);
      return (
        <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: luz, aguja }} seed={539} mano={2}
          claves={[mira(0, 900, 420, 1.0), mira(k(345.4), 860, 640, 1.4, { curva: "inout" }), mira(k(350.3), RG_PUNTOS.radio, 680, 2.1, { curva: "inout" }), mira(k(352.2), RG_PUNTOS.radio - 80, 680, 2.2, { curva: "inout" }), mira(k(356.6), RG_PUNTOS.radio - 120, 680, 2.2, { curva: "inout" })]}
          medio={<A {...act({ ...GUS, accesorios: [...(GUS.accesorios ?? []), { t: "auriculares", color: "#2a2a30" }] }, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 12, pI: 88, rI: 88, pD: 92, rD: 92, hD: 80, cD: 50, hI: 25, cI: 50 } }, { f: k(350.6), v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 30, cD: 50, hI: 25, cI: 50 } }], caras: [{ f: 0, v: "cansado" }, { f: k(350.6), v: "sorpresa" }], miradas: [{ f: 0, v: { x: 1, y: 0.3 } }], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 } })} />}
          hud={<><H l={[dia(349)]} />
            <Txt t="SOMEONE ANSWERS" a={k(350.6)} b={k(352.2)} top={860} tam={58} mano color={AMBAR} />
            <Txt t="A WOMAN" a={k(352.2)} b={k(356.6) + 4} top={860} tam={62} mano color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 40 · «This is Abby, on Madeline Island» · el mapa · ¿cuántos son? · «One hundred.» ============
const Ondas: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => {
  const f = useF();
  return <g opacity={on}>{[0, 1, 2].map((i) => { const r = 40 + ((f * 3 + i * 40) % 120); return <path key={i} d={`M${x + r * 0.7},${y - r * 0.7} A${r},${r} 0 0 1 ${x + r * 0.7},${y + r * 0.7}`} stroke={AMBAR} strokeWidth={6} fill="none" opacity={1 - r / 160} />; })}</g>;
};
const p40: PlanB = {
  a: 356.6, b: 368.5, trans: { tipo: "corte" },
  sfx: [[356.7, "static", -18, { dur: 5 }], [357.4, "sparkle", -12], [361.6, "cloth", -8], [362.2, "ptt", -4], [365.4, "static", -10, { dur: 1.8 }], [367.2, "boom", -4], [367.3, "tick", 0]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const mapa = f > k(356.8) && f < k(361.6);
      return (
        <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 1, aguja: 0.62, isla: interpolate(f, [k(357.2), k(358.0)], [0, 1], cl), linea: f > k(359.0) ? 1 : 0 }} seed={540} mano={2}
          claves={mapa
            ? [mira(0, RG_PUNTOS.mapa, 360, 1.6), mira(k(361.6), RG_PUNTOS.mapa + 60, 340, 1.8, { curva: "inout" })]
            : [mira(0, RG_PUNTOS.radio - 80, 680, 2.2), mira(k(365.4), RG_PUNTOS.radio - 140, 680, 2.2, { curva: "inout" }), mira(k(367.2), RG_PUNTOS.radio - 150, 680, 2.2, { curva: "inout" }), mira(k(368.5), RG_PUNTOS.radio - 150, 680, 2.2)]}
          medio={<>
            <A {...act({ ...GUS, accesorios: [...(GUS.accesorios ?? []), { t: "auriculares", color: "#2a2a30" }] }, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 30, cD: 50, hI: 25, cI: 50 } }, { f: k(361.6), v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 25, cI: 50 } }], caras: [{ f: 0, v: "sorpresa" }, { f: k(362.0), v: "determinado" }, { f: k(365.4), v: "duda" }, { f: k(367.2), v: "sorpresa" }], habla: [[k(363.7), k(365.4)]], miradas: [{ f: 0, v: { x: 1, y: 0 } }], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 }, enManoD: (ff: number) => ff > k(361.6) ? <MicMano s={0.8} ptt={ff > k(362.2) && ff < k(365.4)} /> : null })} />
            <Ondas x={RG_PUNTOS.radio + 40} y={P - 400} on={f < k(361.6) || f > k(367.2) ? 1 : 0} />
          </>}
          hud={<><HudC lineas={[POP(10), ...(f > k(367.2) ? [isla([{ f: 0, v: 0 }, { f: k(367.3), v: 100, d: 30 }], k(367.2))] : [])]} />
            <GloboRadio t="This is Abby, on Madeline Island." x={1080} y={500} desde={k(356.6)} hasta={k(359.0)} />
            <GloboRadio t="We heard you. We've been counting too." x={1080} y={500} desde={k(359.0)} hasta={k(361.6)} />
            <GloboRadio t="How many of you are there?" x={820} y={420} desde={k(363.7)} hasta={k(365.4)} lado={-1} color="#f6ecd2" />
            <GloboRadio t="One hundred." x={1080} y={500} desde={k(367.2)} hasta={k(368.5) + 8} tam={70} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 41 · cierre: ¿qué remedio salvarías? · suscribite · próximo: Madeline Island ============
const p41: PlanB = {
  a: 368.5, b: 379.74, trans: { tipo: "fundido", d: 10 },
  sfx: [[368.6, "sparkle", -10], [372.6, "page", -8], [373.4, "pop", -4], [376.3, "riser", -14, { dur: 2.5 }], [376.5, "waves", -18, { dur: 3 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(376.3)) return (
        <Escena Set={Farmacia} pal={PAL} setProps={{ cinta: 1, vaciar: 0.5, oro: 1 }} seed={541} mano={2}
          claves={[mira(0, FAR_PUNTOS.oro - 400, 540, 1.1), mira(k(376.3), FAR_PUNTOS.oro - 200, 520, 1.25, { curva: "inout" })]}
          hud={<><HudC lineas={[POP(10), isla(100)]} /><Txt t={"IF YOU COULD SAVE ONLY ONE MEDICINE…\nWHAT WOULD IT BE?"} a={k(368.7)} b={k(372.4)} top={760} tam={54} chip /><BotonSub desde={k(373.2)} top={800} /></>} />
      );
      return (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "ocaso", estacion: "invierno" }} seed={541} mano={1.5}
          claves={[mira(0, 4800, 300, 0.6), mira(k(379.74), 4900, 260, 0.66, { curva: "inout" })]}
          hud={<><HudC lineas={[POP(10), isla(100)]} /><Proximo ep={6} titulo="Could 100 People Restart Humanity?" desde={k(376.5)} /></>} />
      );
    };
    return <Pl />;
  },
};

export const PLANOS_LC05: PlanB[] = [p00, p01, p02, p03, p04, p05, p06, p07, p08, p09, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32, p33, p34, p35, p36, p37, p38, p39, p40, p41];
export const LC05 = armar(PLANOS_LC05);

export const Lc05: React.FC = () => {
  useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Montaje planos={LC05.planos} />
    </AbsoluteFill>
  );
};
export { ROJO_CENSO };
