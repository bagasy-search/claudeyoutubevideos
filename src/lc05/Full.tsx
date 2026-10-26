// lc05 · «Could 10 People Rebuild Medicine From Zero?» (The Last Census Ep.5, sesión lc-c). Plan: D:/rtmp/lc05_PLAN_MxM.md
// Cada plano va de un segundo de la voz al siguiente; k(seg) = cuadro local. sfx en segundos absolutos (→ cues → mezcla_c.py).
// HUD: POPULATION 10 fija + 2º contador por bloque (LILY °F, DOSES, DAY, YEAR); al final la 2ª línea MADELINE ISLAND 100.
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
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

// figurita mínima (multitudes / estudios): cabeza + cuerpo
const Figu: React.FC<{ x: number; y: number; s: number; color: string; f?: number; i?: number; camina?: boolean }> = ({ x, y, s, color, f = 0, i = 0, camina }) => {
  const b = camina ? Math.abs(Math.sin(f / 4 + i)) * 4 * s : 0;
  return <g transform={`translate(${x},${y - b}) scale(${s})`}><rect x={-14} y={-96} width={28} height={58} rx={12} fill={color} /><rect x={-12} y={-40} width={9} height={40} fill="#2a2a32" /><rect x={3} y={-40} width={9} height={40} fill="#2a2a32" /><circle cy={-118} r={22} fill="#141018" /><circle cx={-7} cy={-120} r={6} fill="#fff" /><circle cx={7} cy={-120} r={6} fill="#fff" /></g>;
};
const COLS = ["#b2342a", "#2f5a7a", "#6a7a3a", "#c9a03a", "#5a3a6a", "#3a6a6a", "#e07a3a", "#7a3a3a", "#3a8ac8"];
const FONT = "Fredoka, sans-serif";
// inserto circular «zoom a órgano» (coordenadas de pantalla): torso plano, ombligo, el dolor que viaja, el apéndice que se hincha / revienta
const Torso: React.FC<{ x: number; y: number; r?: number; ent: number; sale?: number; viaja?: number; dolor?: number; tripa?: number; apendice?: number; revienta?: number; rotulo?: string }> = ({ x, y, r = 210, ent, sale = 1e9, viaja = 0, dolor = 1, tripa = 0, apendice = 0, revienta = 0, rotulo }) => {
  const f = useF();
  if (f < ent || f > sale + 8) return null;
  const s = interpolate(f, [ent, ent + 7, sale, sale + 8], [0.2, 1, 1, 0.2], cl) * (r / 210);
  const op = interpolate(f, [ent, ent + 5, sale, sale + 8], [0, 1, 1, 0], cl);
  const om = { x: 0, y: 10 }, fid = { x: -62, y: 96 }; // la derecha del paciente = izquierda de la pantalla
  const p = { x: om.x + (fid.x - om.x) * viaja, y: om.y + (fid.y - om.y) * viaja };
  const pul = 16 + 6 * Math.sin(f / 3);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
      <defs><clipPath id={`torso${x}`}><circle r={200} /></clipPath></defs>
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <circle r={210} fill="#f6ecd2" stroke="#141018" strokeWidth={10} />
        <g clipPath={`url(#torso${x})`}>
          <path d="M-150,-220 Q-160,-120 -120,-40 Q-140,80 -130,240 L130,240 Q140,80 120,-40 Q160,-120 150,-220 Z" fill="#e8b48a" stroke="#8a5a3a" strokeWidth={5} />
          {tripa > 0 && <g opacity={tripa}><path d="M-90,-30 Q-100,-60 -40,-60 Q40,-60 90,-30 Q100,30 70,40 Q20,20 -20,40 Q-60,60 -80,40 Q-110,20 -90,-30 Z" fill="#e89a9a" stroke="#a04a4a" strokeWidth={5} /><path d="M-60,0 Q0,-30 60,0 M-50,30 Q0,10 40,30" stroke="#a04a4a" strokeWidth={5} fill="none" /><path d="M-85,50 Q-95,110 -60,130 Q-20,140 20,120" stroke="#a04a4a" strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.6} /></g>}
          {apendice > 0 && <g transform={`translate(${fid.x},${fid.y + 18})`}><path d="M0,0 q-10,30 6,52" stroke={apendice > 0.6 ? "#d0302a" : "#c86a6a"} strokeWidth={14 + 16 * apendice} strokeLinecap="round" fill="none" /></g>}
          {revienta > 0 && Array.from({ length: 26 }).map((_, i) => { const a = i * 2.4, d = 20 + 170 * revienta * (0.5 + (i % 5) / 8); return <circle key={i} cx={fid.x + Math.cos(a) * d} cy={fid.y + 40 + Math.sin(a) * d * 0.8} r={9 - 4 * revienta + (i % 3)} fill="#c0302a" opacity={0.85} />; })}
          <circle cx={om.x} cy={om.y} r={7} fill="#8a5a3a" />
          {dolor > 0 && viaja > 0.02 && <path d={`M${om.x},${om.y} L${p.x},${p.y}`} stroke="#c0302a" strokeWidth={8} strokeDasharray="14 10" fill="none" />}
          {dolor > 0 && <><circle cx={p.x} cy={p.y} r={pul + 14} fill="#ff4a3a" opacity={0.25 * dolor} /><circle cx={p.x} cy={p.y} r={pul} fill="#e0302a" opacity={dolor} /></>}
        </g>
        <circle r={210} fill="none" stroke="#141018" strokeWidth={10} />
        {rotulo && <g><line x1={fid.x - 10} y1={fid.y + 50} x2={-250} y2={250} stroke="#f6ecd2" strokeWidth={5} /><rect x={-460} y={226} width={240} height={56} rx={14} fill="rgba(18,15,24,0.9)" stroke="#ff8a6a" strokeWidth={4} /><text x={-340} y={266} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#ff8a6a">{rotulo}</text></g>}
      </g>
    </svg>
  );
};
// termómetro grande en °F (pantalla)
const TermoF: React.FC<{ v: number; x?: number; y?: number; ent?: number }> = ({ v, x = 1600, y = 230, ent = 0 }) => {
  const f = useF();
  if (f < ent) return null;
  const u = Math.max(0, Math.min(1, (v - 96) / 8));
  const s = interpolate(f, [ent, ent + 6], [0.4, 1], cl);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute" }}><g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-110} y={-40} width={220} height={560} rx={22} fill="rgba(18,15,24,0.85)" stroke="#f6ecd2" strokeWidth={3} />
      <rect x={-18} y={10} width={36} height={380} rx={18} fill="#2a2a32" stroke="#f6ecd2" strokeWidth={3} /><circle cx={0} cy={412} r={36} fill="#d0302a" stroke="#f6ecd2" strokeWidth={3} />
      <rect x={-11} y={10 + 380 * (1 - u)} width={22} height={380 * u + 10} fill="#d0302a" />
      {[98.6, 102].map((t) => <g key={t}><line x1={22} y1={10 + 380 * (1 - (t - 96) / 8)} x2={44} y2={10 + 380 * (1 - (t - 96) / 8)} stroke="#f6ecd2" strokeWidth={3} /><text x={52} y={20 + 380 * (1 - (t - 96) / 8)} fontFamily={FONT} fontSize={26} fill="#f6ecd2">{t}</text></g>)}
      <text x={0} y={500} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={54} fill={v >= 100 ? "#ff8a6a" : "#f6ecd2"} stroke="#141018" strokeWidth={6} paintOrder="stroke">{`${decimal(v)}°F`}</text>
    </g></svg>
  );
};
// tarjeta-ícono que cae con golpe (pantalla) y se tacha
const Tarjeta: React.FC<{ x: number; y: number; ent: number; t: string; ok?: boolean; children: React.ReactNode }> = ({ x, y, ent, t, ok, children }) => {
  const f = useF();
  if (f < ent) return null;
  const c = interpolate(f, [ent, ent + 6], [-260, 0], { ...cl, easing: (q) => q * q });
  const tb = interpolate(f, [ent + 7, ent + 13], [0, 1], cl);
  return (
    <g transform={`translate(${x},${y + c})`}>
      <rect x={-130} y={-130} width={260} height={290} rx={22} fill="#f6ecd2" stroke="#141018" strokeWidth={6} />
      <g transform="translate(0,-20)">{children}</g>
      <text x={0} y={135} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#141018">{t}</text>
      {ok ? <path d={`M-60,0 L-20,40 L${-20 + 90 * tb},${40 - 90 * tb}`} stroke="#3aa05a" strokeWidth={18} fill="none" strokeLinecap="round" opacity={tb > 0 ? 0.9 : 0} />
        : <><line x1={-100} y1={-100} x2={-100 + 200 * tb} y2={-100 + 200 * tb} stroke="#d0302a" strokeWidth={16} strokeLinecap="round" /><line x1={100} y1={-100} x2={100 - 200 * Math.max(0, tb * 2 - 1)} y2={-100 + 200 * Math.max(0, tb * 2 - 1)} stroke="#d0302a" strokeWidth={16} strokeLinecap="round" /></>}
    </g>
  );
};
// planta de huerta: verde → negra/escarcha según `muere` (0..1)
const Planta: React.FC<{ x: number; y: number; muere: number; s?: number; i?: number }> = ({ x, y, muere, s = 1, i = 0 }) => {
  const c = muere > 0.5 ? "#2a2a30" : "#4a8a3a";
  const caida = 30 * muere;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={`M0,0 Q${4 + caida * 0.3},-60 ${caida},${-110 + caida * 1.4}`} stroke={c} strokeWidth={9} fill="none" strokeLinecap="round" />
      {[-1, 1, -1].map((d, j) => <ellipse key={j} cx={d * 30 + caida * 0.6} cy={-40 - j * 28 + caida * (0.6 + j * 0.3)} rx={30} ry={14} fill={c} transform={`rotate(${d * (25 + 40 * muere)},${d * 30 + caida * 0.6},${-40 - j * 28 + caida})`} />)}
      {muere > 0.5 && Array.from({ length: 5 }).map((_, j) => <circle key={j} cx={-30 + j * 15 + caida * 0.5} cy={-30 - ((j * 37 + i * 11) % 80)} r={4} fill="#eaf4ff" opacity={0.9} />)}
    </g>
  );
};

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
  a: 0, b: 1.25,
  sfx: [[0.05, "sparkle", -10], [0.9, "glass", -12]],
  el: (k) => {
    const Pl: React.FC = () => <><Miniatura k={k} apaga={k(1.0)} /></>;
    return <Pl />;
  },
};

const p00b: PlanB = {
  a: 1.25, b: 4.4, trans: { tipo: "corte" },
  sfx: [[1.3, "boom", -10], [1.4, "fire", -18, { dur: 3 }], [2.5, "tick", -8], [3.0, "tick", -2], [3.05, "heart", -10, { dur: 1.4 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const v = interpolate(f, [k(2.3), k(3.1)], [98.6, 102], cl);
      return (
        <Liv claves={[mira(0, 830, 600, 2.1), mira(k(4.4), 840, 610, 2.25, { curva: "inout" })]} sp={{ farol: 1 }}
          medio={<>
            <A {...lily({ caras: [{ f: 0, v: "cansado" }, { f: k(3.0), v: "triste" }], miradas: [{ f: 0, v: { x: 0.2, y: 0.1 } }] })} />
            <MantaLily />
          </>}
          hud={<><H l={[fiebre(v as never, 0)]} /><TermoF v={v} x={1560} y={250} ent={k(1.5)} /><Txt t="12 YEARS OLD" a={k(1.4)} b={k(2.6)} top={150} tam={56} chip /><Txt t="FEVER" a={k(2.6)} b={k(4.4) + 4} top={150} tam={62} mano chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 1 · Lily en el sillón, fiebre 102 ============
const p01: PlanB = {
  a: 4.4, b: 8.2, trans: { tipo: "corte" },
  sfx: [[4.5, "cloth", -10], [5.6, "creak", -12], [6.4, "whoosh", -16], [6.6, "heart", -10, { dur: 1.6 }], [7.1, "dog_tail", -8, { dur: 1 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const temblor = Array.from({ length: 8 }).map((_, i) => ({ f: k(4.6 + i * 0.45), v: { tronco: 22 + (i % 2) * 5, pI: 82, rI: 80, pD: 86, rD: 82, hD: 40, cD: 135, hI: 30 + (i % 2) * 4, cI: 125, cabeza: 20 + (i % 2) * 3 } }));
      return (
        <Liv claves={[mira(0, 860, 650, 1.8), mira(k(8.2), 870, 655, 1.9, { curva: "inout" })]} sp={{ farol: 1 }}
          medio={<>
            <A {...lily({ poses: [{ f: 0, v: { tronco: 18, pI: 80, rI: 70, pD: 86, rD: 74, hD: 30, cD: 120, hI: 20, cI: 110, cabeza: 14 } }, ...temblor], caras: [{ f: 0, v: "triste" }, { f: k(6.3), v: "miedo" }] })} />
            <MantaLily />
            <Ore x={1010} y={P} dir={-1} s={0.8} f={f} echado={f > k(6.8) ? 0.2 : 0.7} cabeza={f > k(6.8) ? -30 : 14} cola={f > k(7.0) ? 1 : 0.2} />
          </>}
          hud={<><H l={[fiebre(102)]} /><Torso x={1500} y={480} ent={k(6.3)} viaja={1} dolor={1} /><Txt t="RIGHT SIDE" a={k(6.6)} b={k(8.2) + 4} top={760} left={1330} tam={52} chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 2 · «antes»: hospital en una hora, a casa en dos días ============
const p02: PlanB = {
  a: 8.2, b: 10.5, trans: { tipo: "corte" },
  sfx: [[8.3, "whoosh", -10], [8.6, "cart", -10, { dur: 1.8 }], [8.9, "ding", -14], [9.6, "tick", -6], [10.3, "tick", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const G = LOBBY_PUNTOS.guardia;
      const xc = interpolate(f, [0, k(10.5)], [G - 700, G - 120], cl);
      const ang = interpolate(f, [k(8.6), k(10.3)], [0, 360], cl);
      return (
        <Escena Set={Lobby} pal={PAL} setProps={{ luces: 1, afuera: "dia", pizarra: "" }} seed={502} mano={2}
          claves={[mira(0, G - 380, 600, 1.2), mira(k(10.5), G - 340, 600, 1.24, { curva: "inout" })]}
          detras={<A {...act(JUNE_QUIRO, G - 900, { ruta: [{ f: 0, x: G + 200, y: P - 30 }, { f: k(10.5), x: G - 300, y: P - 30 }], escala: 0.8, dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "neutral" }], luz: BORDE_FRIO })} />}
          medio={<>
            <g transform={`translate(${G - 380},${P - 470})`}><circle r={70} fill="#f6ecd2" stroke="#3a3a44" strokeWidth={10} /><line x1={0} y1={0} x2={0} y2={-52} stroke="#141018" strokeWidth={8} strokeLinecap="round" transform={`rotate(${ang})`} /><line x1={0} y1={0} x2={30} y2={0} stroke="#141018" strokeWidth={10} strokeLinecap="round" transform={`rotate(${-90 + ang / 12})`} /></g>
            <g transform={`translate(${xc},${P})`}><rect x={-170} y={-200} width={340} height={30} rx={8} fill="#e6eef4" stroke="#5a6a7a" strokeWidth={5} /><line x1={-140} y1={-170} x2={-140} y2={-30} stroke="#5a6a7a" strokeWidth={8} /><line x1={140} y1={-170} x2={140} y2={-30} stroke="#5a6a7a" strokeWidth={8} /><circle cx={-140} cy={-18} r={18} fill="#2a2a32" /><circle cx={140} cy={-18} r={18} fill="#2a2a32" /></g>
            <A {...act(LILY_CAMA, xc, { ruta: [{ f: 0, x: G - 700, y: P }, { f: k(10.5), x: G - 120, y: P }], asiento: [{ f: 0, v: 200 }], poses: [{ f: 0, v: "sentado" }], caras: [{ f: 0, v: "cansado" }, { f: k(9.8), v: "feliz" }], dir: [{ f: 0, v: 1 }], luz: BORDE_FRIO })} />
            <A {...act(CIRUJANO, xc - 260, { ruta: [{ f: 0, x: G - 960, y: P }, { f: k(10.5), x: G - 380, y: P }], poses: [{ f: 0, v: "empujar" }], caras: [{ f: 0, v: "determinado" }], dir: [{ f: 0, v: 1 }], luz: BORDE_FRIO })} />
          </>}
          hud={<><H /><Txt t="THE OLD WORLD" a={k(8.3)} b={k(10.5) + 4} top={150} tam={44} chip /><Txt t="1 HOUR" a={k(10.1)} b={k(10.5) + 4} top={240} tam={64} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

const p02b: PlanB = {
  a: 10.5, b: 12.6, trans: { tipo: "corte" },
  sfx: [[10.6, "door_glass", -10], [11.4, "pop", -6], [11.6, "birds", -18, { dur: 1 }]],
  el: (k) => (
    <Escena Set={Lobby} pal={PAL} setProps={{ luces: 1, afuera: "dia", pizarra: "" }} seed={503} mano={2}
      claves={[mira(0, LOBBY_PUNTOS.puerta + 260, 600, 1.15), mira(k(12.6), LOBBY_PUNTOS.puerta + 200, 600, 1.2, { curva: "inout" })]}
      medio={<><A {...act(LILY, LOBBY_PUNTOS.puerta + 420, { ruta: [{ f: 0, x: LOBBY_PUNTOS.puerta + 520, y: P }, { f: k(12.4), x: LOBBY_PUNTOS.puerta + 160, y: P }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(11.3), v: "saludar" }], caras: [{ f: 0, v: "feliz" }], luz: BORDE_FRIO })} />
        <A {...act(BEN, LOBBY_PUNTOS.puerta + 640, { ruta: [{ f: 0, x: LOBBY_PUNTOS.puerta + 720, y: P }, { f: k(12.4), x: LOBBY_PUNTOS.puerta + 360, y: P }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "risa" }], luz: BORDE_FRIO })} /></>}
      hud={<><H /><Txt t="DAY 2 · HOME" a={k(11.2)} b={k(12.6) + 4} top={150} tam={62} mano chip color={AMBAR} /></>} />
  ),
};

// ============ 3 · «one nurse, no surgeon, no lab, no power» ============
const p03: PlanB = {
  a: 12.6, b: 17.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[12.8, "lantern", -10, { dur: 3 }], [13.9, "wood_hit", -6], [14.9, "wood_hit", -6], [15.8, "wood_hit", -6], [16.6, "wood_hit", -6], [16.8, "candle_out", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const parpadea = f > k(16.6) && f < k(17.0) ? (Math.floor(f / 2) % 2 ? 0.35 : 1) : 1;
      const osc = interpolate(f, [k(13.6), k(14.2)], [0, 0.6], cl);
      return (
        <AbsoluteFill>
          <Liv claves={[mira(0, 820, 620, 1.35), mira(k(17.0), 830, 620, 1.4, { curva: "inout" })]} sp={{ farol: parpadea }}
            medio={<>
              <A {...lily({ caras: [{ f: 0, v: "cansado" }] })} />
              <MantaLily />
              <A {...act(JUNE, 1100, { ruta: [{ f: 0, x: 1300, y: P }, { f: k(14.0), x: 1020, y: P }], poses: [{ f: 0, v: "parado" }, { f: k(14.2), v: "arrodillado" }, { f: k(16.5), v: { tronco: 10, pI: 0, rI: 90, pD: 90, rD: 90, hD: 120, cD: 40, hI: 10, cI: 30 } }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "determinado" }, { f: k(16.6), v: "duda" }], enManoD: farol(f) })} />
            </>} />
          <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(10,8,14,0) 40%, rgba(10,8,14,${osc}) 60%)` }} />
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            <Tarjeta x={1300} y={330} ent={k(13.8)} t="ONE NURSE" ok><circle r={46} fill="#f6ecd2" stroke="#141018" strokeWidth={5} /><rect x={-12} y={-34} width={24} height={68} fill="#d0302a" /><rect x={-34} y={-12} width={68} height={24} fill="#d0302a" /></Tarjeta>
            <Tarjeta x={1640} y={330} ent={k(14.8)} t="SURGEON"><path d="M-70,30 L50,-50 L70,-40 L-40,40 Z" fill="#cfd8e6" stroke="#141018" strokeWidth={5} /><rect x={-90} y={22} width={60} height={22} rx={6} fill="#5a6a7a" transform="rotate(-34,-60,33)" /></Tarjeta>
            <Tarjeta x={1300} y={690} ent={k(15.7)} t="LAB"><rect x={-20} y={-70} width={30} height={90} rx={6} fill="#3a3a44" transform="rotate(-20)" /><rect x={-60} y={40} width={120} height={20} rx={6} fill="#3a3a44" /><circle cx={30} cy={10} r={24} fill="none" stroke="#3a3a44" strokeWidth={10} /></Tarjeta>
            <Tarjeta x={1640} y={690} ent={k(16.5)} t="POWER"><circle cy={-20} r={44} fill="#e8c45a" stroke="#141018" strokeWidth={5} /><rect x={-20} y={22} width={40} height={30} fill="#5a6a7a" /></Tarjeta>
          </svg>
          <H />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

// ============ 4 · la farmacia vacía: «every medicine on earth is quietly getting older» ============
const p04: PlanB = {
  a: 17.0, b: 21.2, trans: { tipo: "fundido", d: 10 },
  sfx: [[17.1, "wind_cold", -20, { dur: 4 }], [18.0, "wood_step", -14, { dur: 2.4 }], [19.3, "tick", -8], [19.6, "tick", -6], [19.9, "tick", -4], [20.2, "boom", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const anioV = Math.round(interpolate(f, [k(19.0), k(20.2)], [2024, 2027], cl));
      const gris = interpolate(f, [k(18.6), k(20.6)], [0, 1], cl);
      const col = (a: string, b: string) => interpolateColors(gris, [0, 1], [a, b]);
      return (
        <AbsoluteFill>
          <Escena Set={Farmacia} pal={PAL} setProps={{ luces: 0, apagar: 0.3, polvo: 1 }} seed={504} mano={2}
            claves={[mira(0, FAR_PUNTOS.gondola2 + 260, 560, 1.0), mira(k(21.2), FAR_PUNTOS.gondola2 + 290, 560, 1.04, { curva: "inout" })]}
            medio={<A {...act(JUNE, FAR_PUNTOS.gondola1, { ruta: [{ f: 0, x: FAR_PUNTOS.gondola1 - 200, y: P }, { f: k(21.2), x: FAR_PUNTOS.gondola3 - 100, y: P }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { hD: 120, cD: 30 } }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 0.4, y: -0.3 } }], luz: { lado: 1, color: "#ffb04a", fuerza: 1 }, enManoD: farol(f) })} />} />
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            <g transform="translate(330,760) rotate(-6)">
              <rect x={-250} y={-170} width={500} height={330} rx={14} fill={col("#f2f4f6", "#9a9890")} stroke="#141018" strokeWidth={8} />
              <rect x={-250} y={-170} width={500} height={90} rx={14} fill={col("#2f6ab0", "#5a6070")} />
              <text x={0} y={-108} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill="#fff">AMOXICILLIN</text>
              <text x={-220} y={20} fontFamily={FONT} fontWeight={600} fontSize={38} fill="#3a3a44">500 mg · 30 caps</text>
              <rect x={-220} y={60} width={300} height={70} rx={10} fill="#fff" stroke="#3a3a44" strokeWidth={4} />
              <text x={-70} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill={anioV > 2024 ? "#d0302a" : "#141018"}>EXP {anioV}</text>
              {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={-240 + ((i * 97) % 480)} cy={-160 + ((i * 53) % 320)} r={3 + (i % 3)} fill="#d8d0c0" opacity={0.7 * gris} />)}
            </g>
            {Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={(i * 397) % 1920} cy={((i * 131) + (f - k(17.0)) * (1 + (i % 3))) % 1080} r={1.5 + (i % 3)} fill="#e8e0d0" opacity={0.45} />)}
          </svg>
          <H />
          <Txt t="GETTING OLDER ON A SHELF" a={k(18.8)} b={k(21.2) + 4} top={150} tam={54} chip />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

const FarmaciaApagando: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useF();
  const u = interpolate(f, [desde, desde + 70], [0, 0.85], cl);
  return <g opacity={u}><rect x={850} y={P - 620} width={1520} height={620} fill="#141626" opacity={0.55} /></g>;
};

// ============ 5 · la granja de noche: «could ten people rebuild medicine from zero?» ============
const p05: PlanB = {
  a: 21.2, b: 25.6, trans: { tipo: "fundido", d: 12 },
  sfx: [[21.3, "wind_cold", -16, { dur: 4 }], [21.6, "door", -10], [21.9, "snow_step", -12, { dur: 3 }], [23.6, "riser", -12, { dur: 2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const X = GRANJA_PUNTOS.porche;
      return (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "noche", estacion: "invierno", humo: 0.8 }} seed={505} mano={2} zLejos={0.3}
          claves={[mira(0, X + 640, 640, 1.2), mira(k(25.6), X + 660, 630, 1.26, { curva: "inout" })]}
          medio={<>{DIEZ.map((l, i) => { const t0 = k(21.5 + i * 0.22); const xf = X + 160 + i * 110; return <A key={i} {...act(l, xf, { ruta: [{ f: 0, x: X - 40, y: P }, { f: t0, x: X - 40, y: P }, { f: t0 + 40, x: xf, y: P }], opacidad: (ff) => (ff > t0 ? 1 : 0), dir: [{ f: 0, v: 1 }, { f: t0 + 40, v: i % 2 ? -1 : 1 }], caras: [{ f: 0, v: i % 3 ? "determinado" : "duda" }], miradas: [{ f: 0, v: { x: 0, y: -0.3 } }], luz: { lado: 1, color: AMBAR, fuerza: 0.9 }, enManoD: i % 3 === 0 ? farol(f) : undefined, seed: 60 + i })} />; })}</>}
          hud={<><H /><Txt t={"COULD TEN PEOPLE\nREBUILD MEDICINE?"} a={k(22.6)} b={k(25.6) + 4} top={140} tam={66} chip color="#f6ecd2" /></>} />
      );
    };
    return <Pl />;
  },
};
const VentanaCasa: React.FC = () => <g><rect x={20} y={P - 330} width={90} height={80} fill={AMBAR} opacity={0.95} /><Halo x={65} y={P - 290} r={260} color={AMBAR} fuerza={0.8} /></g>;

// ============ 6 · «Let's count it.» el cuaderno se abre en 10 ============
// mano con lápiz (en coordenadas del svg): la punta en (x,y)
export const ManoLapiz: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => (
  <g transform={`translate(${x},${y + Math.sin(f / 2.2) * 3}) rotate(${Math.sin(f / 3.1) * 4}) scale(${s})`}>
    <path d="M0,0 L22,-16 L150,-150 L128,-170 L-2,-36 Z" fill="#e8b23a" stroke="#3a2a14" strokeWidth={3} />
    <path d="M0,0 L22,-16 L-2,-36 Z" fill="#f2d9b0" /><path d="M0,0 L6,-6 L2,-12 Z" fill="#222" />
    <rect x={128} y={-182} width={34} height={22} rx={4} transform="rotate(-45 145 -171)" fill="#d86a7a" />
    <path d="M40,-40 C70,-30 120,-20 150,10 C170,40 150,80 110,80 C60,80 30,40 30,10 Z" fill="#141018" />
    <path d="M150,10 C200,0 260,40 300,90 L240,160 C200,110 160,90 120,80 Z" fill="#2f4a6a" />
  </g>
);
export const Cuaderno: React.FC<{ abre?: number; lineas?: { t: string; desde: number; x?: number; y?: number; tam?: number; color?: string }[]; cierra?: number; mano?: boolean }> = ({ abre = 0, lineas = [], cierra, mano = true }) => {
  const f = useF();
  const abierto = f >= abre && (cierra === undefined || f < cierra);
  // la mano va a la punta del renglón que se está escribiendo (o al último escrito)
  let punta: { x: number; y: number } | null = null;
  lineas.forEach((l, i) => {
    if (f < l.desde) return;
    const tam = l.tam ?? 56, x0 = l.x ?? 1010, y0 = l.y ?? 380 + i * 70;
    const n = Math.min(l.t.length, Math.floor((f - l.desde) / 1.4));
    punta = { x: x0 + n * tam * 0.5, y: y0 + 4 };
  });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #5a3a28 0%, #2a1a12 70%)" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ transform: `scale(${1 + Math.min(f, 600) / 600 * 0.06})`, transformOrigin: "55% 45%" }}>
        <Halo x={1300} y={300} r={700} color="#ffcf6e" fuerza={0.32 + 0.05 * Math.sin(f / 5) + 0.03 * Math.sin(f / 2.3)} />
        <CuadernoCenso x={960} y={560} s={abierto ? 2.6 : 2.2} abierto={abierto} rot={-2} />
        {abierto && lineas.map((l, i) => <Escrito key={i} t={l.t} x={l.x ?? 1010} y={l.y ?? 380 + i * 70} f={f} desde={l.desde} tam={l.tam ?? 56} color={l.color ?? "#1d3a8a"} />)}
        {abierto && mano && punta && <ManoLapiz x={(punta as { x: number }).x} y={(punta as { y: number }).y} f={f} />}
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
  sfx: [[26.7, "wind_cold", -14, { dur: 4 }], [28.0, "ice_crack", -8], [28.4, "ice_crack", -12], [28.8, "ice_crack", -14], [29.6, "cloth", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const X0 = GRANJA_PUNTOS.campo;
      const pct = Math.round(interpolate(f, [k(28.0), k(29.2)], [100, 50], cl));
      return (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "alba", estacion: "verano", helada: interpolate(f, [k(27.6), k(29.0)], [0, 1], cl), crec: 1 }} seed={507} mano={2}
          claves={[mira(0, X0 + 160, 690, 1.55), mira(k(30.6), X0 + 180, 690, 1.62, { curva: "inout" })]}
          medio={<>
            {Array.from({ length: 12 }).map((_, i) => <Planta key={i} x={X0 - 360 + i * 80} y={P + 30} s={1.1} i={i} muere={i < 6 ? interpolate(f, [k(27.9) + i * 4, k(27.9) + i * 4 + 8], [0, 1], cl) : 0} />)}
            <A {...act(MARCUS, X0 + 500, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "agacharse" }, { f: k(29.2), v: { hD: 150, cD: 40, hI: 20, cI: 30, cabeza: -6 } }], caras: [{ f: 0, v: "duda" }, { f: k(29.2), v: "triste" }], miradas: [{ f: 0, v: { x: -0.6, y: 0.3 } }, { f: k(29.6), v: { x: 0.2, y: 0 } }], luz: { lado: -1, color: "#ffb08a", fuerza: 0.8 }, enManoD: (ff: number) => ff > k(29.2) ? <Planta x={0} y={0} muere={1} s={0.7} /> : null })} />
          </>}
          hud={<><H l={[dia(330, k(26.8))]} /><Txt t="LAST TIME" a={k(26.7)} b={k(28.0)} top={150} tam={48} chip /><div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", opacity: f > k(28.0) ? 1 : 0 }}><span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 66, color: pct < 100 ? "#bfe0ff" : "#7ad08a", background: "rgba(18,15,24,0.85)", padding: "8px 30px", borderRadius: 20 }}>GARDEN {pct}%</span></div></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 8 · el henil: June encuentra a Lily ardiendo; dolor del ombligo a la derecha ============
const p08: PlanB = {
  a: 30.6, b: 33.0, trans: { tipo: "corte" },
  sfx: [[30.7, "lantern", -12, { dur: 2 }], [31.0, "wood_step", -8], [31.4, "wood_step", -8], [31.8, "wood_step", -8], [32.2, "wood_step", -8], [32.5, "gasp", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const yL = GR_HENIL;
      return (
        <Escena Set={Granero} pal={PAL} setProps={{ farol: 1 }} seed={508} mano={2.2}
          claves={[mira(0, 1100, 620, 1.35), mira(k(33.0), 1040, 560, 1.45, { curva: "inout" })]}
          medio={<>
            <A {...act(LILY_CAMA, GR_PUNTOS.lily, { ruta: [{ f: 0, x: GR_PUNTOS.lily, y: yL }], asiento: [{ f: 0, v: 20 }], poses: [{ f: 0, v: { tronco: -70, pI: 90, rI: 10, pD: 95, rD: 20, hD: 40, cD: 120, hI: 30, cI: 120, cabeza: -10 } }], caras: [{ f: 0, v: "cansado" }], dir: [{ f: 0, v: 1 }], luz: BORDE_CALIDO })} />
            <A {...act(JUNE, GR_PUNTOS.escalera, { ruta: [{ f: 0, x: GR_PUNTOS.escalera, y: P }, { f: k(32.2), x: GR_PUNTOS.escalera - 40, y: yL }, { f: k(33.0), x: GR_PUNTOS.lily + 330, y: yL }], poses: [{ f: 0, v: "agarrarAlto" }, { f: k(32.3), v: "parado" }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "determinado" }, { f: k(32.4), v: "miedo" }], enManoI: farol(f) })} />
          </>}
          hud={<><H l={[fiebre([{ f: 0, v: 101 }], k(31.2))]} /><Txt t="THE HAYLOFT" a={k(30.8)} b={k(32.6)} top={150} tam={48} chip /><Txt t="BURNING UP" a={k(31.6)} b={k(33.0) + 4} top={150} tam={58} mano chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

const p08b: PlanB = {
  a: 33.0, b: 38.6, trans: { tipo: "corte" },
  sfx: [[33.1, "cloth", -10], [33.7, "heart", -12, { dur: 2.4 }], [35.4, "whoosh", -16], [36.4, "glass", -12], [37.0, "cloth", -8], [37.2, "glass", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const yL = GR_HENIL;
      const xP = interpolate(f, [k(36.4), k(36.9), k(37.3), k(37.7)], [GR_PUNTOS.lily + 150, GR_PUNTOS.lily + 60, GR_PUNTOS.lily + 60, GR_PUNTOS.lily + 200], cl);
      return (
        <Escena Set={Granero} pal={PAL} setProps={{ farol: 1 }} seed={518} mano={2}
          claves={[mira(0, GR_PUNTOS.lily + 170, yL - 120, 2.1), mira(k(38.6), GR_PUNTOS.lily + 180, yL - 120, 2.2, { curva: "inout" })]}
          medio={<>
            <A {...act(LILY_CAMA, GR_PUNTOS.lily, { ruta: [{ f: 0, x: GR_PUNTOS.lily, y: yL }], asiento: [{ f: 0, v: 20 }], poses: [{ f: 0, v: { tronco: -70, pI: 90, rI: 10, pD: 95, rD: 20, hD: 70, cD: 100, hI: 30, cI: 120, cabeza: -10 } }, { f: k(37.0), v: { tronco: -60, pI: 90, rI: 10, pD: 95, rD: 20, hD: 120, cD: 20, hI: 30, cI: 120, cabeza: -20 } }, { f: k(37.6), v: { tronco: -70, pI: 90, rI: 10, pD: 95, rD: 20, hD: 70, cD: 100, hI: 30, cI: 120, cabeza: -10 } }], caras: [{ f: 0, v: "cansado" }, { f: k(37.0), v: "enojo" }, { f: k(37.6), v: "triste" }], dir: [{ f: 0, v: 1 }], luz: BORDE_CALIDO })} />
            <A {...act(JUNE, GR_PUNTOS.lily + 210, { ruta: [{ f: 0, x: GR_PUNTOS.lily + 210, y: yL }], poses: [{ f: 0, v: "arrodillado" }, { f: k(36.3), v: { tronco: 20, pI: 0, rI: 90, pD: 90, rD: 90, hD: 80, cD: 20, hI: 10, cI: 30 } }, { f: k(37.4), v: { tronco: 10, pI: 0, rI: 90, pD: 90, rD: 90, hD: 30, cD: 60, hI: 10, cI: 30 } }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "miedo" }, { f: k(37.6), v: "triste" }], luz: BORDE_CALIDO })} />
            {f > k(36.3) && <g transform={`translate(${xP},${yL - 150})`}><ellipse rx={46} ry={12} fill="#e8e4dc" stroke="#8a7a6a" strokeWidth={3} /><ellipse cy={-4} rx={34} ry={7} fill="#d8a85a" />{[0, 1].map((i) => <path key={i} d={`M${-10 + i * 20},-16 q8,-14 0,-28`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.5} />)}</g>}
          </>}
          hud={<><H l={[fiebre([{ f: 0, v: 101 }, { f: k(36.6), v: 102, d: 14 }])]} />
            <Torso x={1660} y={560} r={190} ent={k(33.4)} sale={k(36.2)} viaja={interpolate(useF(), [k(34.4), k(35.9)], [0, 1], cl)} />
            <Txt t="BELLY BUTTON → LOWER RIGHT" a={k(34.2)} b={k(36.2)} top={150} tam={50} chip color="#ff8a6a" />
            <Txt t="FEVER" a={k(36.6)} b={k(37.5)} top={150} tam={60} mano chip color="#ff8a6a" />
            <Txt t="NO APPETITE" a={k(37.5)} b={k(38.6) + 4} top={150} tam={60} mano chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 9 · June presiona y suelta · Lily grita · APPENDICITIS ============
const p09: PlanB = {
  a: 38.6, b: 47.6, trans: { tipo: "corte" },
  sfx: [[39.4, "cloth", -8], [42.3, "cloth", -6], [43.1, "gasp", -4], [44.4, "heart1", -8], [45.6, "tick", -8], [46.5, "boom", -6], [46.6, "riser", -14, { dur: 1 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const g = golpe(f, k(43.1), 7);
      const yL = GR_HENIL;
      return (
        <Escena Set={Granero} pal={PAL} setProps={{ farol: 1 }} seed={509} mano={2}
          claves={[mira(0, 830, 380, 2.2), mira(k(42.0), 820, 390, 2.5, { curva: "inout" }), mira(k(43.1), 820 + g, 380, 2.6), mira(k(44.2), 860, 370, 2.4, { curva: "inout" }), mira(k(47.6), 870, 370, 2.5, { curva: "inout" })]}
          medio={<>
            <A {...act(LILY_CAMA, GR_PUNTOS.lily, { ruta: [{ f: 0, x: GR_PUNTOS.lily, y: yL }], asiento: [{ f: 0, v: 20 }], poses: [{ f: 0, v: { tronco: -70, pI: 90, rI: 10, pD: 95, rD: 20, hD: 40, cD: 120, hI: 30, cI: 120, cabeza: -10 } }, { f: k(43.1), v: { tronco: -40, pI: 100, rI: 60, pD: 105, rD: 70, hD: 50, cD: 130, hI: 40, cI: 130, cabeza: 10 } }], caras: [{ f: 0, v: "cansado" }, { f: k(43.1), v: "miedo" }, { f: k(44.4), v: "triste" }], dir: [{ f: 0, v: 1 }], luz: BORDE_CALIDO })} />
            <A {...act(JUNE, GR_PUNTOS.lily + 150, { ruta: [{ f: 0, x: GR_PUNTOS.lily + 150, y: yL }], poses: [{ f: 0, v: "arrodillado" }, { f: k(39.4), v: { tronco: 30, pI: 0, rI: 90, pD: 90, rD: 90, hD: 70, cD: 30, hI: 60, cI: 30 } }, { f: k(42.3), v: { tronco: 10, pI: 0, rI: 90, pD: 90, rD: 90, hD: 40, cD: 50, hI: 30, cI: 40 } }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "determinado" }, { f: k(44.3), v: "triste" }], miradas: [{ f: 0, v: { x: -1, y: 0.4 } }, { f: k(45.4), v: { x: 0.5, y: 0.1 } }] })} />
          </>}
          hud={<><H l={[fiebre(102)]} />
            <Torso x={1540} y={520} ent={k(44.2)} tripa={1} dolor={0} viaja={1} apendice={interpolate(useF(), [k(44.4), k(46.4)], [0.1, 1], cl)} rotulo={useF() > k(46.6) ? "APPENDIX" : undefined} />
            <Txt t="A HUNDRED TIMES" a={k(45.5)} b={k(46.5)} top={150} tam={54} chip />
            <Txt t="APPENDICITIS" a={k(46.6)} b={k(47.6) + 4} top={150} tam={76} mano chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 10 · por qué asusta: línea de tiempo de velas, el apéndice que revienta, fines de 1800 ============
const p10: PlanB = {
  a: 47.6, b: 55.5, trans: { tipo: "fundido", d: 12 },
  sfx: [[47.7, "whoosh", -10], [49.2, "suspense", -14, { dur: 3 }], [51.3, "heart", -10, { dur: 1.2 }], [52.4, "boom", -2], [52.45, "fall", -8], [53.3, "drop", -10], [54.8, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const z = interpolate(f, [0, k(55.5)], [1, 1.12], cl);
      const sac = golpe(f, k(52.4), 10);
      return (
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #3a2420 0%, #120c0c 80%)" }}>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${z}) translate(${sac}px,0)`, transformOrigin: "50% 50%" }}>
            <Torso x={960} y={560} r={360} ent={k(47.7)} tripa={1} dolor={0} viaja={1} apendice={interpolate(f, [k(50.8), k(52.3)], [0.4, 1], cl)} revienta={interpolate(f, [k(52.4), k(54.4)], [0, 1], cl)} />
          </div>
          <H l={[anio(1700)]} />
          <Txt t="FOR MOST OF HUMAN HISTORY" a={k(49.6)} b={k(51.2)} top={140} tam={54} chip />
          <Txt t="INFLAMED" a={k(51.2)} b={k(52.4)} top={140} tam={62} chip color="#ff8a6a" />
          <Txt t="BURST" a={k(52.4)} b={k(53.3)} top={140} tam={80} mano chip color="#ff4a3a" />
          <Txt t="INFECTION SPREADS" a={k(53.3)} b={k(54.7)} top={140} tam={62} chip color="#ff8a6a" />
          <Txt t="COULD KILL YOU" a={k(54.7)} b={k(55.5) + 4} top={140} tam={70} mano chip color="#ff4a3a" />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

const p10b: PlanB = {
  a: 55.5, b: 60.4, trans: { tipo: "corte" },
  sfx: [[55.6, "whoosh", -12], [56.0, "fire", -20, { dur: 4 }], [57.0, "metal_tool", -10], [58.0, "metal_tool", -12], [58.9, "tick", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const X = 960;
      const velas = [{ x: 380, on: 1 }, { x: 1540, on: 1 }];
      return (
        <Escena Set={Mural} pal={PAL} setProps={{ velas, tono: "#2a2420", luz: "#ffd890" }} seed={510} mano={1.8}
          claves={[mira(0, X, 640, 1.5), mira(k(60.4), X + 20, 630, 1.6, { curva: "inout" })]}
          medio={<>
            <Halo x={X} y={P - 520} r={700} color="#ffe6a8" fuerza={0.7} />
            <g transform={`translate(${X},${P - 470})`}><path d="M-60,-30 L60,-30 L90,20 L-90,20 Z" fill="#3a3a44" /><circle cy={30} r={22} fill="#fff4c8" /></g>
            <rect x={X - 260} y={P - 210} width={520} height={34} rx={8} fill="#cfc4b0" /><rect x={X - 230} y={P - 176} width={20} height={176} fill="#5a4a3a" /><rect x={X + 210} y={P - 176} width={20} height={176} fill="#5a4a3a" />
            <path d={`M${X - 250},${P - 210} Q${X - 120},${P - 290} ${X},${P - 250} Q${X + 140},${P - 230} ${X + 250},${P - 212} Z`} fill="#f2ece0" stroke="#bfb4a0" strokeWidth={4} />
            <circle cx={X - 210} cy={P - 250} r={30} fill="#141018" />
            <A {...act(LEVITA, X - 30, { ruta: [{ f: 0, x: X - 30, y: P }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 28, hD: 70, cD: 50, hI: 60, cI: 60 } }, { f: k(57.0), v: { tronco: 34, hD: 80, cD: 30, hI: 70, cI: 50 } }, { f: k(58.0), v: { tronco: 28, hD: 70, cD: 50, hI: 60, cI: 60 } }], caras: [{ f: 0, v: "determinado" }], luz: { lado: 1, color: "#ffe6a8", fuerza: 0.9 } })} />
            <A {...act(LEVITA_DELANTAL, X + 360, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { tronco: 16, hD: 60, cD: 70, hI: 30, cI: 40 } }], caras: [{ f: 0, v: "neutral" }], luz: { lado: -1, color: "#ffe6a8", fuerza: 0.8 } })} />
            <A {...act(CIENTIFICO, X - 400, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { hD: 150, cD: 30, hI: 20, cI: 30 } }], caras: [{ f: 0, v: "duda" }], luz: { lado: 1, color: "#ffe6a8", fuerza: 0.7 }, enManoD: <FarolMano y={0} s={0.8} f={f} halo={0.6} /> })} />
            <A {...act(LEVITA_DELANTAL, X + 560, { escala: 0.95, dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "brazosCruzados" }], caras: [{ f: 0, v: "duda" }], luz: { lado: -1, color: "#ffe6a8", fuerza: 0.6 }, seed: 77 })} />
          </>}
          hud={<><H l={[anio([{ f: 0, v: 1700 }, { f: k(56.0), v: 1886, d: 40 }])]} /><Txt t="REMOVING THE APPENDIX" a={k(56.6)} b={k(58.8)} top={140} tam={54} chip /><Txt t="ROUTINE · LATE 1800s" a={k(58.8)} b={k(60.4) + 4} top={140} tam={58} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 11 · antes de eso: cruces en la colina; «June is not a surgeon» ============
const p11: PlanB = {
  a: 60.4, b: 63.6, trans: { tipo: "fundido", d: 10 },
  sfx: [[60.5, "wind_cold", -14, { dur: 3 }], [61.4, "wood_hit", -12], [61.8, "wood_hit", -12], [62.2, "wood_hit", -10], [62.6, "wood_hit", -10], [63.0, "wood_hit", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const N = 34;
      return (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "ocaso", estacion: "invierno" }} seed={511} mano={2}
          claves={[mira(0, 2500, 740, 1.5), mira(k(63.6), 2520, 740, 1.42, { curva: "inout" })]}
          medio={<>{Array.from({ length: N }).map((_, i) => { const x = 1940 + ((i * 173) % 1120), y = P + 60 - ((i * 59) % 140); const s = interpolate(f, [k(61.2) + i * 1.9, k(61.2) + i * 1.9 + 5], [0, 1], cl); return s > 0 && <g key={i} transform={`translate(${x},${y}) scale(${s})`}><Cruz x={0} y={0} s={1.3 + (i % 3) * 0.2} /></g>; })}</>}
          hud={<><H /><div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center" }}><span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 56, color: "#f6ecd2", background: "rgba(18,15,24,0.88)", padding: "10px 30px", borderRadius: 20 }}>DIED OF A <span style={{ color: "#ff8a6a" }}>STOMACH ACHE</span></span></div></>} />
      );
    };
    return <Pl />;
  },
};

const p11b: PlanB = {
  a: 63.6, b: 65.4, trans: { tipo: "corte" },
  sfx: [[63.7, "heart", -12, { dur: 1.6 }], [64.4, "breath", -14]],
  el: (k) => {
    const Pl: React.FC = () => {
      const tiembla = Array.from({ length: 8 }).map((_, i) => ({ f: k(63.7 + i * 0.22), v: { tronco: 6, pI: 0, rI: 90, pD: 90, rD: 90, hD: 110 + (i % 2) * 6, cD: 70, hI: 100 + (i % 2) * 6, cI: 70, cabeza: 14 } }));
      return (
        <Escena Set={Granero} pal={PAL} setProps={{ farol: 1 }} seed={521} mano={2}
          claves={[mira(0, GR_PUNTOS.lily + 260, GR_HENIL - 180, 2.3), mira(k(65.4), GR_PUNTOS.lily + 260, GR_HENIL - 180, 2.45, { curva: "inout" })]}
          medio={<A {...act(JUNE, GR_PUNTOS.lily + 260, { ruta: [{ f: 0, x: GR_PUNTOS.lily + 260, y: GR_HENIL }], poses: [{ f: 0, v: "arrodillado" }, ...tiembla], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "triste" }, { f: k(64.4), v: "miedo" }], miradas: [{ f: 0, v: { x: -0.2, y: 0.6 } }] })} />}
          hud={<><H /><Txt t="NOT A SURGEON" a={k(63.9)} b={k(65.4) + 4} top={140} tam={64} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 12 · flashback: June le pasa instrumentos a un cirujano ============
const p12: PlanB = {
  a: 65.4, b: 70.8, trans: { tipo: "luz", d: 10 },
  sfx: [[65.5, "whoosh"], [66.4, "radio_ping", -16], [67.5, "metal_tool", -6], [68.5, "metal_tool", -8], [69.2, "metal", -14]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = LOBBY_PUNTOS.guardia;
      const pase = (a: number) => interpolate(f, [k(a), k(a + 0.45)], [0, 1], { ...cl, easing: (t) => t * t * (3 - 2 * t) });
      const u1 = pase(67.2), u2 = pase(68.2);
      const en = f < k(67.2) || (f > k(67.9) && f < k(68.2)) ? 0 : f < k(67.9) ? u1 : u2;
      const visible = f < k(67.9) || (f > k(68.0) && f < k(68.9));
      const sx = x - 150 + 260 * en, sy = P - 330 - Math.sin(en * Math.PI) * 40;
      return (
        <Escena Set={Lobby} pal={PAL} setProps={{ luces: 1, afuera: "dia" }} seed={512} mano={2}
          claves={[mira(0, x, 600, 1.45), mira(k(70.8), x + 30, 590, 1.55, { curva: "inout" })]}
          medio={<>
            <Halo x={x} y={P - 520} r={600} color="#ffffff" fuerza={0.45} />
            <rect x={x - 200} y={P - 200} width={400} height={30} rx={6} fill="#dfe8ec" /><rect x={x - 20} y={P - 170} width={40} height={170} fill="#8a96a4" />
            <path d={`M${x - 190},${P - 200} Q${x - 60},${P - 270} ${x + 60},${P - 236} Q${x + 140},${P - 220} ${x + 190},${P - 202} Z`} fill="#7aa8c8" />
            <A {...act(CIRUJANO, x + 230, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 60, cD: 60, hI: 50, cI: 60, tronco: 14 } }, { f: k(67.4), v: { hD: 85, cD: 10, hI: 50, cI: 60, tronco: 10 } }, { f: k(67.9), v: { hD: 60, cD: 70, hI: 60, cI: 70, tronco: 30 } }, { f: k(68.4), v: { hD: 85, cD: 10, hI: 50, cI: 60, tronco: 10 } }, { f: k(68.9), v: { hD: 60, cD: 70, hI: 60, cI: 70, tronco: 30 } }], caras: [{ f: 0, v: "determinado" }], luz: { lado: -1, color: "#e6f4ff", fuerza: 0.8 } })} />
            <A {...act(JUNE_QUIRO, x - 250, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(66.9), v: { hD: 85, cD: 10 } }, { f: k(67.8), v: { hD: 30, cD: 40 } }, { f: k(68.0), v: { hD: 85, cD: 10 } }, { f: k(68.8), v: "parado" }], caras: [{ f: 0, v: "neutral" }, { f: k(69.1), v: "duda" }], luz: { lado: 1, color: "#e6f4ff", fuerza: 0.8 } })} />
            {visible && f > k(66.9) && <g transform={`translate(${sx},${sy}) rotate(-10)`}><rect x={-40} y={-5} width={50} height={10} rx={3} fill="#5a6a7a" /><path d="M10,-5 L46,-2 L10,5 Z" fill="#e6eef4" stroke="#5a6a7a" strokeWidth={2} /></g>}
          </>}
          hud={<><H /><Txt t="SHE HANDED THEM INSTRUMENTS" a={k(66.9)} b={k(68.9)} top={140} tam={50} chip /><Txt t="NEVER CUT INTO A PERSON" a={k(69.0)} b={k(70.8) + 4} top={140} tam={58} mano chip color={AMBAR} /></>} />
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
  a: 70.8, b: 77.0, trans: { tipo: "fundido", d: 10 },
  sfx: [[70.9, "chair", -10], [72.0, "wood_step", -12], [73.2, "box", -10], [73.6, "page", -6], [74.6, "page", -8], [75.6, "page", -6], [76.1, "sparkle", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const mesa = L.mesa;
      return (
        <Liv claves={[mira(0, mesa + 20, 620, 1.55), mira(k(77.0), mesa + 30, 610, 1.65, { curva: "inout" })]}
          sp={{ farol: 1, libros: interpolate(f, [k(73.0), k(73.4)], [0, 1], cl) }}
          medio={<>
            <Halo x={mesa - 60} y={P - 300} r={420} color={AMBAR} fuerza={0.45} />
            <A {...act(JUNE, mesa - 140, { asiento: [{ f: 0, v: 60 }], poses: [{ f: 0, v: "sentado" }, { f: k(73.6), v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 75, cD: 30, hI: 60, cI: 40 } }, { f: k(74.6), v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 95, cD: 10, hI: 60, cI: 40 } }, { f: k(75.0), v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 75, cD: 30, hI: 60, cI: 40 } }, { f: k(75.6), v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 95, cD: 10, hI: 60, cI: 40 } }, { f: k(76.0), v: { tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 40, cD: 60, hI: 30, cI: 50 } }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "duda" }, { f: k(76.0), v: "sorpresa" }], miradas: [{ f: 0, v: { x: 0.6, y: 0.5 } }, { f: k(76.0), v: { x: 0.2, y: -0.2 } }] })} />
            {f > k(73.4) && <g transform={`translate(${mesa + 20},${P - 240})`}><rect x={-90} y={-12} width={180} height={14} fill="#f2ece0" stroke="#5a4a3a" strokeWidth={3} /><path d={`M0,-12 L${interpolate(f % 30, [0, 30], [-80, 80])},-30 L0,-12`} stroke="#f2ece0" strokeWidth={4} fill="none" opacity={f > k(73.6) && f < k(76.0) ? 1 : 0} /></g>}
            <A {...act(NAN, mesa + 260, { ruta: [{ f: 0, x: mesa + 600, y: P }, { f: k(73.0), x: mesa + 260, y: P }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 40, cD: 80 } }, { f: k(73.2), v: { hD: 70, cD: 40, tronco: 10 } }, { f: k(74.0), v: "pensar" }], caras: [{ f: 0, v: "feliz" }], enManoD: (ff: number) => ff < k(73.2) ? <g transform="scale(0.6)"><Libro /></g> : null })} />
          </>}
          hud={<><H /><Txt t="WHAT A GOOD NURSE DOES" a={k(71.4)} b={k(73.5)} top={140} tam={52} chip /><Txt t="WHAT HAS CHANGED?" a={k(73.6)} b={k(77.0) + 4} top={140} tam={58} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// el estudio: 100 personas con apendicitis simple; 70 se curan con antibióticos, 30 necesitan cirugía después
const Estudio: React.FC<{ k: (s: number) => number; verde: number; ambar: number }> = ({ k, verde, ambar }) => {
  const f = useF();
  const X0 = 295, Y0 = 330, DX = 70, DY = 135;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #26303e 0%, #0e1218 80%)" }}>
      <svg width={1920} height={1080}>
        <text x={960} y={1010} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#cfe0f0" opacity={interpolate(f, [k(78.4), k(79.2)], [0, 1], cl)}>EUROPE · USA · 100 PATIENTS</text>
        <rect x={X0 - 60} y={Y0 - 70} width={DX * 19 + 120} height={DY * 5 + 40} rx={26} fill="#efe6d2" opacity={interpolate(f, [k(78.2), k(78.6)], [0, 1], cl)} />
        {Array.from({ length: 100 }).map((_, i) => {
          const c = i % 20, r = Math.floor(i / 20);
          const t = interpolate(f, [k(78.5) + (c + r) * 1.2, k(78.5) + (c + r) * 1.2 + 6], [0, 1], cl);
          const esAmbar = (i * 37) % 100 < 30;
          const col = f > ambar && esAmbar ? AMBAR : f > verde + ((i * 13) % 20) ? "#2f9a4a" : "#8a94a4";
          return t > 0 && <Figu key={i} x={X0 + c * DX} y={Y0 + r * DY + 58} s={0.62 * t} color={col} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const p13b: PlanB = {
  a: 77.0, b: 85.2, trans: { tipo: "corte" },
  sfx: [[77.1, "whoosh", -12], [78.5, "popcluster", -10], [79.0, "pop", -12], [79.6, "pop", -12], [80.2, "pop", -12], [83.6, "tick", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const z = interpolate(f, [0, k(85.2)], [1, 1.05], cl);
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${z})` }}><Estudio k={k} verde={1e9} ambar={1e9} /></div>
          <H />
          <Txt t="THE LAST 20 YEARS · BIG STUDIES" a={k(77.2)} b={k(81.6)} top={140} tam={52} chip />
          <Txt t="SIMPLE APPENDICITIS" a={k(81.6)} b={k(83.6)} top={140} tam={58} chip color={AMBAR} />
          <Txt t="(NOT BURST)" a={k(83.6)} b={k(85.2) + 4} top={140} tam={58} mano chip color="#ff8a6a" />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

const p13c: PlanB = {
  a: 85.2, b: 92.6, trans: { tipo: "corte" },
  sfx: [[85.6, "glitter", -8], [85.7, "sparkle", -10], [87.4, "tick", -6], [88.8, "pop", -6], [89.0, "popcluster", -10], [90.6, "ding", -10], [91.6, "ding", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const z = interpolate(f, [0, k(92.6)], [1.05, 1.12], cl);
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${z})` }}><Estudio k={k} verde={k(85.6)} ambar={k(88.8)} /></div>
          <H />
          <Txt t="ANTIBIOTICS ALONE: BETTER" a={k(85.6)} b={k(87.3)} top={140} tam={56} chip color="#7ad08a" />
          <Txt t="NOT EVERYONE" a={k(87.3)} b={k(88.7)} top={140} tam={58} mano chip />
          <Txt t="SOME: SURGERY LATER" a={k(88.7)} b={k(90.4)} top={140} tam={56} chip color={AMBAR} />
          <Txt t="A REAL CHANCE" a={k(90.4)} b={k(92.6) + 4} top={140} tam={70} mano chip color="#7ad08a" />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

const p13d: PlanB = {
  a: 92.6, b: 94.4, trans: { tipo: "corte" },
  sfx: [[92.7, "chalk", -6, { dur: 0.9 }], [93.5, "chalk", -6, { dur: 0.9 }]],
  el: (k) => (
    <Liv claves={[mira(0, GL_PIZARRA.x - 20, GL_PIZARRA.y + 200, 1.6), mira(k(94.4), GL_PIZARRA.x - 10, GL_PIZARRA.y + 200, 1.68, { curva: "inout" })]}
      sp={{ farol: 1, reglas: [{ t: "1. FRESH FIRST", desde: -100 }, { t: "2. NOTHING RISKY ALONE", desde: -100 }, { t: "3. ONE THING…", desde: -100 }, { t: "PLAN A: IV ANTIBIOTICS", desde: k(92.7), color: "#b8382c" }, { t: "PLAN B: THE TABLE", desde: k(93.5), color: "#b8382c" }] }}
      medio={<A {...act(JUNE, GL_PIZARRA.x - 170, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { hD: 120, cD: 40, hI: 20, cI: 30 } }, { f: k(93.3), v: { hD: 105, cD: 50, hI: 20, cI: 30 } }], caras: [{ f: 0, v: "determinado" }], luz: BORDE_CALIDO })} />}
      hud={<><H /><Txt t="TWO PARTS" a={k(92.8)} b={k(94.4) + 4} top={140} tam={58} chip color={AMBAR} /></>} />
  ),
};

// pantalla partida (dos escenas lado a lado)
const Partida: React.FC<{ izq: React.ReactNode; der: React.ReactNode; div?: number }> = ({ izq, der, div = 960 }) => (
  <AbsoluteFill>
    <div style={{ position: "absolute", left: 0, top: 0, width: div, height: 1080, overflow: "hidden" }}><div style={{ position: "absolute", left: (div - 1920) / 2, width: 1920, height: 1080 }}>{izq}</div></div>
    <div style={{ position: "absolute", left: div, top: 0, width: 1920 - div, height: 1080, overflow: "hidden" }}><div style={{ position: "absolute", left: (1920 - div - 1920) / 2, width: 1920, height: 1080 }}>{der}</div></div>
    <svg width={1920} height={1080} style={{ position: "absolute" }}><rect x={div - 6} y={0} width={12} height={1080} fill="#141018" /></svg>
  </AbsoluteFill>
);

// ============ 14 · Plan B: la mesa tapada con un paño, Nan con el libro ============
const p14: PlanB = {
  a: 94.4, b: 97.3, trans: { tipo: "corte" },
  sfx: [[94.5, "whoosh", -12], [95.2, "drip", -8], [95.9, "drip", -10], [96.5, "drip", -10]],
  el: (k) => (
    <Liv claves={[mira(0, L.suero - 120, 600, 1.6), mira(k(97.3), L.suero - 110, 600, 1.7, { curva: "inout" })]} sp={{ farol: 1, suero: 1, sueroNivel: 0.9 }}
      medio={<><A {...lily({ caras: [{ f: 0, v: "cansado" }] })} /><MantaLily /></>}
      hud={<><H /><Txt t="PLAN A" a={k(94.4)} b={k(97.3) + 4} top={140} tam={66} chip color="#7ad08a" /><Txt t="IV ANTIBIOTICS" a={k(95.2)} b={k(97.3) + 4} top={240} tam={52} mano chip /></>} />
  ),
};

const p14b: PlanB = {
  a: 97.3, b: 104.0, trans: { tipo: "corte" },
  sfx: [[97.4, "whoosh", -10], [98.4, "boom", -12], [99.3, "cloth", -6], [99.6, "metal_tool", -10], [100.7, "cloth", -8], [102.1, "page", -6], [103.0, "page", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const dA = interpolate(f, [k(97.4), k(98.0)], [1920, 700], { ...cl, easing: (t) => 1 - (1 - t) * (1 - t) });
      return (
        <AbsoluteFill>
          <Partida div={dA}
            izq={<Liv claves={[mira(0, L.suero - 120, 600, 1.6)]} sp={{ farol: 1, suero: 1, sueroNivel: 0.85 }} medio={<><A {...lily({ caras: [{ f: 0, v: "cansado" }] })} /><MantaLily /></>} />}
            der={<Liv claves={[mira(0, L.mesa + 120, 620, 1.35), mira(k(104.0), L.mesa + 140, 610, 1.45, { curva: "inout" })]} sp={{ farol: 1, pano: interpolate(f, [k(100.5), k(101.2)], [0, 1], cl) }}
              medio={<>
                <Halo x={L.mesa} y={P - 420} r={520} color={AMBAR} fuerza={0.5} />
                <A {...act(JUNE_QUIRO, L.mesa - 200, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(99.2), v: { hD: 150, cD: 30, hI: 150, cI: 30 } }, { f: k(100.0), v: { hD: 80, cD: 60, hI: 70, cI: 60, tronco: 10 } }], caras: [{ f: 0, v: "duda" }, { f: k(99.2), v: "determinado" }], luz: BORDE_CALIDO })} />
                <A {...act(NAN, L.mesa + 380, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 70, cD: 40, hI: 60, cI: 40 } }], caras: [{ f: 0, v: "determinado" }], habla: [[k(102.0), k(104.0)]], luz: BORDE_CALIDO, enManoD: <g transform="scale(0.8)"><Libro abierto /></g> })} />
              </>} />} />
          <H />
          <Txt t="PLAN B · IF IT BURSTS" a={k(97.6)} b={k(99.2)} top={140} left={dA + 40} tam={50} chip color="#ff8a6a" />
          <Txt t="JUNE OPERATES" a={k(99.2)} b={k(100.6)} top={140} left={dA + 40} tam={54} mano chip color="#ff8a6a" />
          <Txt t="ON THE KITCHEN TABLE" a={k(100.6)} b={k(101.9)} top={140} left={dA + 40} tam={50} chip />
          <Txt t="«STEP 1…»" a={k(102.0)} b={k(104.0) + 4} top={140} left={dA + 40} tam={56} mano chip color={AMBAR} />
          <Txt t="PLAN A" a={k(97.6)} b={k(104.0) + 4} top={140} left={60} tam={44} chip color="#7ad08a" />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

// ============ 15 · Theo y Gus a Duluth de noche ============
const p15: PlanB = {
  a: 104.0, b: 107.8, trans: { tipo: "fundido", d: 10 },
  sfx: [[104.1, "truck", -10, { dur: 3.7 }], [105.0, "car_pass", -16], [106.4, "paper", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = interpolate(f, [0, k(107.8)], [1700, 2500], cl);
      const r = interpolate(f, [k(104.4), k(107.6)], [0, 1], cl);
      const s = 1.7;
      return (
        <Escena Set={Panorama} pal={PAL} setProps={{ hora: "noche", luces: 0, nieve: 0.8, ventana: 0 }} seed={515} mano={2}
          claves={[mira(0, 1760, P - 60, 1.5), mira(k(107.8), 2460, P - 60, 1.5)]}
          medio={<>
            <path d={`M${x + 120 * s},${P + 40} L${x + 900},${P - 40} L${x + 900},${P + 160} Z`} fill="#ffeeb0" opacity={0.25 + 0.05 * Math.sin(f / 3)} />
            <Auto x={x} y={P + 120} color="#7a3a2a" tipo="pickup" s={s} faros nieve={0.3} />
            <circle cx={x + 50 * s} cy={P + 120 - 80 * s} r={13 * s} fill="#141018" /><circle cx={x + 54 * s} cy={P + 120 - 82 * s} r={3 * s} fill="#fff" />
            <circle cx={x + 18 * s} cy={P + 120 - 80 * s} r={13 * s} fill="#141018" /><circle cx={x + 22 * s} cy={P + 120 - 82 * s} r={3 * s} fill="#fff" />
            <rect x={x + 6 * s} y={P + 120 - 74 * s} width={22 * s} height={14 * s} rx={3} fill="#e8dcb8" />
          </>}
          hud={<><H l={[dia(330)]} />
            <svg width={1920} height={1080} style={{ position: "absolute" }}><g transform="translate(1450,560)">
              <rect x={0} y={0} width={400} height={260} rx={18} fill="rgba(18,15,24,0.88)" stroke="#f6ecd2" strokeWidth={3} />
              <path d="M60,200 C140,180 200,120 340,70" stroke="#5a6070" strokeWidth={10} fill="none" />
              <path d="M60,200 C140,180 200,120 340,70" stroke={AMBAR} strokeWidth={10} fill="none" strokeDasharray={340} strokeDashoffset={340 * (1 - r)} />
              <circle cx={60} cy={200} r={14} fill="#7ad08a" /><text x={60} y={244} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#f6ecd2">FARM</text>
              <circle cx={340} cy={70} r={14} fill="#ff8a6a" /><text x={340} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#f6ecd2">DULUTH</text>
            </g></svg>
            <Txt t="THEO & GUS · THAT NIGHT" a={k(104.2)} b={k(107.8) + 4} top={140} tam={52} chip /></>} />
      );
    };
    return <Pl />;
  },
};

const p15b: PlanB = {
  a: 107.8, b: 111.5, trans: { tipo: "corte" },
  sfx: [[107.9, "wind_cold", -16, { dur: 3.5 }], [108.6, "car_door", -8], [109.4, "pop", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={StMarys} pal={PAL} setProps={{ hora: "noche", luces: 0, nieve: 0.8, ventana: interpolate(f, [k(108.6), k(109.4), k(110.6), k(111.3)], [0, 0.8, 0.8, 0], cl) }} seed={515} mano={2}
          claves={[mira(0, 1150, 520, 0.9), mira(k(111.5), 1190, 480, 1.05, { curva: "inout" })]}
          medio={<><A {...act(THEO, 900, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { hD: 40, cD: 70 } }], caras: [{ f: 0, v: "determinado" }], miradas: [{ f: 0, v: { x: 0.3, y: -0.6 } }], luz: BORDE_FRIO, enManoD: farol(f) })} /><A {...act(GUS, 760, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "brazosCruzados" }], caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: 0.3, y: -0.6 } }], luz: BORDE_FRIO })} /></>}
          hud={<><H l={[dia(330)]} /><Txt t="ST. MARY'S HOSPITAL" a={k(107.9)} b={k(109.4)} top={140} tam={54} chip /><Txt t="JUNE'S FIRST 3 DAYS AFTER THE WORLD WENT QUIET" a={k(109.4)} b={k(111.5) + 4} top={140} tam={42} chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 16 · la puerta con cinta; el pasillo oscuro con linternas ============
const p16: PlanB = {
  a: 111.5, b: 114.0, trans: { tipo: "corte" },
  sfx: [[111.6, "wind_cold", -18, { dur: 2.4 }], [112.6, "tape", -2], [112.8, "tear", -4], [113.3, "door_glass", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const g = golpe(f, k(112.8), 8);
      return (
        <Escena Set={Farmacia} pal={PAL} setProps={{ cinta: interpolate(f, [k(112.7), k(113.0)], [0, 1], cl) }} seed={516} mano={2}
          claves={[mira(0, -150, 560, 1.6), mira(k(112.8), -150 + g, 560, 1.65), mira(k(114.0), -140, 560, 1.7, { curva: "inout" })]}
          medio={<>
            <A {...act(THEO, -40, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 120, cD: 20 } }, { f: k(112.5), v: { hD: 135, cD: 10, tronco: -6 } }, { f: k(112.8), v: { hD: 40, cD: 110, tronco: 14 } }], caras: [{ f: 0, v: "determinado" }, { f: k(112.8), v: "enojo" }], luz: BORDE_FRIO, enManoI: farol(f) })} />
            {[0, 1, 2].map((i) => { const t0 = k(111.6 + i * 0.8); const u = interpolate(f, [t0, t0 + 18], [0, 1], cl); return u > 0 && u < 1 && <circle key={i} cx={-100 - u * 60} cy={P - 400 - u * 40} r={10 + u * 26} fill="#eef4fa" opacity={0.5 * (1 - u)} />; })}
          </>}
          hud={<><H /><Txt t="SHE TAPED THEM SHUT" a={k(111.7)} b={k(114.0) + 4} top={140} tam={52} chip /></>} />
      );
    };
    return <Pl />;
  },
};

const p16b: PlanB = {
  a: 114.0, b: 117.2, trans: { tipo: "corte" },
  sfx: [[114.1, "floor_step", -12], [114.6, "floor_step", -12], [115.1, "floor_step", -12], [115.6, "floor_step", -12], [116.1, "floor_step", -12], [116.2, "wind_cold", -20, { dur: 1 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={PasilloFarmacia} pal={PAL} setProps={{ llenado: 0.55, luzFarol: { x: interpolate(f, [0, k(117.2)], [1100, 820], cl), y: interpolate(f, [0, k(117.2)], [1150, 900], cl), on: 1 } }} seed={516} mano={2}
          claves={[mira(0, 900, 600, 1.0), mira(k(117.2), 820, 600, 1.12, { curva: "inout" })]}
          medio={<>
            <A {...act(THEO, 0, { ruta: [{ f: 0, x: 1150, y: 1180 }, { f: k(117.2), x: 860, y: 960 }], escala: 1.2, poses: [{ f: 0, v: { hD: 40, cD: 70 } }], enManoD: farol(f), luz: { lado: 1, color: "#ffb04a", fuerza: 1 } })} />
            <A {...act(GUS, 0, { ruta: [{ f: 0, x: 1400, y: 1240 }, { f: k(117.2), x: 1060, y: 990 }], escala: 1.25, poses: [{ f: 0, v: { hD: 50, cD: 150, cabeza: 6 } }], caras: [{ f: 0, v: "asco" }], luz: { lado: -1, color: "#ffb04a", fuerza: 0.8 } })} />
            {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={300 + ((i * 197) % 1400)} cy={200 + (((i * 83) + f * (0.6 + (i % 3) * 0.3)) % 900)} r={2 + (i % 3)} fill="#e8e0d0" opacity={0.4} />)}
          </>}
          hud={<><H />{["COLD", "DARK", "DUST"].map((t, i) => <Txt key={t} t={t} a={k([114.7, 115.3, 116.2][i])} b={k(117.2) + 4} top={140} left={620 + i * 260} tam={56} mano chip color="#cfd8ff" />)}</>} />
      );
    };
    return <Pl />;
  },
};

// ============ 17 · la farmacia exacta; la fecha no es un acantilado; el programa militar ============
const p17: PlanB = {
  a: 117.2, b: 122.6, trans: { tipo: "corte" },
  sfx: [[117.3, "lantern", -8, { dur: 1.5 }], [117.6, "riser", -14, { dur: 1.5 }], [118.8, "sparkle", -10], [121.0, "gasp", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const luz = interpolate(f, [k(117.4), k(118.6)], [0.1, 1], cl);
      const xt = interpolate(f, [0, k(121.0)], [1350, 1650], cl);
      return (
        <Escena Set={Farmacia} pal={PAL} setProps={{ cinta: 1 }} seed={517} mano={2}
          claves={[mira(0, 1560, 560, 1.2), mira(k(122.6), 1720, 540, 1.12, { curva: "inout" })]}
          detras={<g opacity={1 - luz}><rect x={-1000} y={-800} width={5500} height={2500} fill="#05060c" opacity={0.6} /></g>}
          medio={<>
            <A {...act(THEO, 1500, { ruta: [{ f: 0, x: 1350, y: P }, { f: k(121.0), x: 1650, y: P }], poses: [{ f: 0, v: "agarrarAlto" }, { f: k(119.0), v: { hD: 40, cD: 70 } }], enManoD: farol(f), caras: [{ f: 0, v: "sorpresa" }, { f: k(121.0), v: "feliz" }], luz: { lado: 1, color: "#ffb04a", fuerza: 1 } })} />
            <A {...act(GUS, 1950, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: k(121.2), v: "manosCara" }], caras: [{ f: 0, v: "sorpresa" }], luz: { lado: -1, color: "#ffb04a", fuerza: 0.8 } })} />
            <Halo x={xt} y={P - 200} r={900} color="#ffc56a" fuerza={0.55 * luz} />
          </>}
          hud={<><H /><Txt t="EXACTLY AS SHE LEFT IT" a={k(118.0)} b={k(120.0)} top={140} tam={54} chip /><Txt t="SURPRISED EVEN JUNE" a={k(120.6)} b={k(122.6) + 4} top={140} tam={54} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// el gráfico: potencia vs años; la fecha NO es un acantilado; el programa militar (SLEP)
const CurvaVence: React.FC<{ k: (s: number) => number; tacha: number; sello: number; linea: [number, number]; sigue?: number }> = ({ k, tacha, sello, linea, sigue = 1e9 }) => {
  const f = useF();
  const X0 = 300, Y0 = 820, W = 1300, HH = 520;
  const xa = (a: number) => X0 + (a / 8) * W, yp = (p: number) => Y0 - (p / 100) * HH;
  const u = interpolate(f, [linea[0], linea[1]], [0, 1], cl);
  const pts = Array.from({ length: 41 }).map((_, i) => { const a = (i / 40) * 8 * u; return `${i ? "L" : "M"}${xa(a)},${yp(100 - a * 1.6)}`; }).join(" ");
  const tb = interpolate(f, [tacha, tacha + 8], [0, 1], cl);
  const sb = interpolate(f, [sello, sello + 6], [2.2, 1], { ...cl, easing: (t) => t * t });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #2a2e3a 0%, #10121a 80%)" }}>
      <svg width={1920} height={1080}>
        <line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke="#f6ecd2" strokeWidth={5} /><line x1={X0} y1={Y0} x2={X0} y2={Y0 - HH - 40} stroke="#f6ecd2" strokeWidth={5} />
        <text x={X0 - 20} y={yp(100) + 10} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#f6ecd2">100%</text>
        <text x={X0 + W} y={Y0 + 56} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#f6ecd2">YEARS →</text>
        <text x={X0 - 20} y={Y0 - HH - 60} fontFamily={FONT} fontWeight={700} fontSize={34} fill="#cfd8e6">POTENCY</text>
        <line x1={xa(2)} y1={Y0} x2={xa(2)} y2={Y0 - HH - 20} stroke="#ff8a6a" strokeWidth={4} strokeDasharray="12 10" />
        <rect x={xa(2) - 80} y={Y0 - HH - 80} width={160} height={56} rx={12} fill="#ff8a6a" /><text x={xa(2)} y={Y0 - HH - 40} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#141018">EXP</text>
        <path d={`M${xa(0)},${yp(100)} L${xa(2)},${yp(100)} L${xa(2) + 10},${yp(0)}`} stroke="#ff6a5a" strokeWidth={10} fill="none" strokeDasharray="20 12" opacity={interpolate(f, [k(122.7), k(123.1)], [0, 1], cl) * (1 - 0.6 * tb)} />
        {tb > 0 && <g><line x1={xa(2) - 120} y1={yp(60)} x2={xa(2) - 120 + 260 * tb} y2={yp(60) + 260 * tb} stroke="#ff4a3a" strokeWidth={18} strokeLinecap="round" /><line x1={xa(2) + 140} y1={yp(60)} x2={xa(2) + 140 - 260 * tb} y2={yp(60) + 260 * tb} stroke="#ff4a3a" strokeWidth={18} strokeLinecap="round" /></g>}
        {u > 0 && <path d={pts} stroke="#5ac87a" strokeWidth={12} fill="none" strokeLinecap="round" />}
        {f > sigue && <g><rect x={xa(5) - 150} y={yp(100) - 120} width={300} height={64} rx={14} fill="#5ac87a" /><text x={xa(5)} y={yp(100) - 76} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#141018">STILL GOOD</text></g>}
        {f > sello && <g transform={`translate(1300,620) rotate(-8) scale(${sb})`} opacity={0.92}><rect x={-260} y={-80} width={520} height={160} rx={16} fill="none" stroke="#c8a24a" strokeWidth={10} /><text x={0} y={-14} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#c8a24a">U.S. MILITARY</text><text x={0} y={42} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#c8a24a">SHELF LIFE PROGRAM</text></g>}
      </svg>
    </AbsoluteFill>
  );
};

const p17b: PlanB = {
  a: 122.6, b: 127.0, trans: { tipo: "corte" },
  sfx: [[122.7, "whoosh", -10], [123.0, "fall", -10], [123.7, "fail", -8], [125.4, "stamp", -2], [126.4, "tick", -8]],
  el: (k) => <><CurvaVence k={k} tacha={k(123.7)} sello={k(125.4)} linea={[1e9, 1e9 + 1]} /><H /><Txt t="THE DATE IS NOT A CLIFF" a={k(123.6)} b={k(127.0) + 4} top={140} tam={58} mano chip color={AMBAR} /></>,
};

const p17c: PlanB = {
  a: 127.0, b: 133.4, trans: { tipo: "corte" },
  sfx: [[127.3, "write", -10, { dur: 2.4 }], [129.1, "tick", -8], [130.4, "tick", -8], [131.3, "ding", -8], [132.6, "pop", -6]],
  el: (k) => <><CurvaVence k={k} tacha={-100} sello={-100} linea={[k(127.3), k(132.9)]} sigue={k(131.2)} /><H /><Txt t="TESTED PAST EXPIRATION" a={k(127.2)} b={k(131.2)} top={140} tam={54} chip /><Txt t="SOMETIMES YEARS LONGER" a={k(132.0)} b={k(133.4) + 4} top={940} tam={54} mano chip color="#7ad08a" /></>,
};

const p17d: PlanB = {
  a: 133.4, b: 135.4, trans: { tipo: "corte" },
  sfx: [[133.5, "box", -12], [134.2, "paper", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Farmacia} pal={PAL} setProps={{ cinta: 1 }} seed={527} mano={2}
          claves={[mira(0, FAR_PUNTOS.gondola2 + 40, 560, 2.0), mira(k(135.4), FAR_PUNTOS.gondola2 + 50, 560, 2.1, { curva: "inout" })]}
          medio={<>
            <Halo x={FAR_PUNTOS.gondola2} y={P - 300} r={600} color="#ffc56a" fuerza={0.6} />
            <A {...act(THEO, FAR_PUNTOS.gondola2, { dir: [{ f: 0, v: 1 }, { f: k(134.3), v: -1 }], poses: [{ f: 0, v: { hD: 110, cD: 40, hI: 60, cI: 60 } }], caras: [{ f: 0, v: "duda" }, { f: k(134.3), v: "feliz" }], miradas: [{ f: 0, v: { x: 0.4, y: -0.3 } }, { f: k(134.3), v: { x: -0.2, y: 0 } }], luz: { lado: 1, color: "#ffb04a", fuerza: 1 }, enManoI: farol(f), enManoD: <g transform="translate(0,-20)"><rect x={-34} y={-24} width={68} height={48} rx={4} fill="#e9ecef" stroke="#3a3a44" strokeWidth={3} /><rect x={-34} y={-24} width={68} height={14} fill="#2f6ab0" /></g> })} />
          </>}
          hud={<><H /><Txt t="STORED WELL" a={k(133.7)} b={k(135.4) + 4} top={140} tam={62} mano chip color="#7ad08a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 18 · líquidos que se rompen · insulina necesita frío ============
const p18: PlanB = {
  a: 135.4, b: 143.0, trans: { tipo: "corte" },
  sfx: [[135.5, "whoosh", -12], [136.4, "pop", -6], [137.5, "fail", -8], [139.2, "pop", -6], [139.7, "fridge_tap", -8], [140.2, "fail", -10], [141.1, "pop", -6], [141.9, "sparkle", -8], [142.2, "ding", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const ent = (a: number) => interpolate(f, [k(a), k(a) + 7], [0, 1], { ...cl, easing: (t) => 1 - (1 - t) * (1 - t) });
      const turbio = interpolate(f, [k(137.4), k(138.4)], [0, 1], cl);
      const tempI = interpolate(f, [k(139.8), k(140.8)], [0.15, 0.85], cl);
      const brillo = 0.5 + 0.5 * Math.sin(f / 4);
      const Col: React.FC<{ x: number; a: number; t: string; c: string; marca: string; mc: string; children: React.ReactNode }> = ({ x, a, t, c, marca, mc, children }) => {
        const e = ent(a);
        return e > 0 ? <g transform={`translate(${x},${560 + (1 - e) * 300})`} opacity={e}>
          <rect x={-250} y={-340} width={500} height={640} rx={28} fill="rgba(18,15,24,0.85)" stroke={c} strokeWidth={5} />
          <text x={0} y={-270} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={52} fill={c}>{t}</text>
          {children}
          {f > k(a + 1.0) && <text x={0} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={80} fill={mc}>{marca}</text>}
        </g> : null;
      };
      return (
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #2a2e3a 0%, #10121a 80%)" }}>
          <svg width={1920} height={1080}>
            <Col x={400} a={136.4} t="LIQUIDS" c="#ff8a6a" marca="✗" mc="#ff4a3a">
              <rect x={-60} y={-180} width={120} height={300} rx={26} fill="#dfe8ec" stroke="#5a6a7a" strokeWidth={5} /><rect x={-30} y={-220} width={60} height={44} rx={8} fill="#5a6a7a" />
              <rect x={-52} y={-100} width={104} height={212} rx={20} fill={interpolateColors(turbio, [0, 1], ["#8ac8f0", "#8a7a4a"])} />
              {turbio > 0.3 && Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={-36 + ((i * 29) % 72)} cy={-80 + ((i * 47) % 180)} r={5} fill="#5a4a2a" opacity={turbio} />)}
              <text x={0} y={180} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={34} fill="#f6ecd2">BREAK DOWN FASTER</text>
            </Col>
            <Col x={960} a={139.2} t="INSULIN" c="#8fd3ff" marca="❄" mc="#8fd3ff">
              <rect x={-110} y={-200} width={220} height={330} rx={16} fill="#e6eef4" stroke="#5a6a7a" strokeWidth={5} /><line x1={-110} y1={-80} x2={110} y2={-80} stroke="#5a6a7a" strokeWidth={4} />
              <rect x={-30} y={-40} width={30} height={60} rx={6} fill="#f4e6c8" stroke="#5a6a7a" strokeWidth={3} /><rect x={10} y={-40} width={30} height={60} rx={6} fill="#f4e6c8" stroke="#5a6a7a" strokeWidth={3} />
              <g transform="translate(160,-40)"><rect x={-12} y={-90} width={24} height={150} rx={12} fill="#2a2a32" stroke="#f6ecd2" strokeWidth={3} /><rect x={-7} y={-86 + 140 * (1 - tempI)} width={14} height={140 * tempI} fill="#d0302a" /><circle cy={74} r={20} fill="#d0302a" /></g>
              <text x={0} y={180} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={34} fill="#f6ecd2">NEEDS COLD</text>
            </Col>
            <Col x={1520} a={141.1} t="PILLS & POWDERS" c="#7ad08a" marca="✓" mc="#5ac87a">
              <Halo x={0} y={-60} r={200} color="#7ad08a" fuerza={0.35 * brillo} />
              <rect x={-80} y={-170} width={160} height={230} rx={22} fill="#e8a83a" opacity={0.9} stroke="#5a4020" strokeWidth={5} /><rect x={-90} y={-200} width={180} height={40} rx={10} fill="#f2f4f6" stroke="#5a6a7a" strokeWidth={4} />
              {Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={-44 + (i % 3) * 44} cy={-110 + Math.floor(i / 3) * 50} rx={18} ry={10} fill="#fff" />)}
              <text x={0} y={180} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={34} fill="#f6ecd2">HOLD UP</text>
            </Col>
          </svg>
          <H />
          <Txt t="NOT ALL OF THEM" a={k(135.5)} b={k(143.0) + 4} top={140} tam={52} chip />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

// ============ 19 · «Doses.» el contador nace; Theo carga la camioneta ============
const p19: PlanB = {
  a: 143.0, b: 146.8, trans: { tipo: "corte" },
  sfx: [[143.1, "lantern", -12, { dur: 2 }], [145.8, "boom", -10], [146.0, "tick", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Farmacia} pal={PAL} setProps={{ cinta: 1 }} seed={519} mano={2}
          claves={[mira(0, 1600, 560, 1.12), mira(k(146.8), 1640, 560, 1.16, { curva: "inout" })]}
          medio={<><Halo x={1400} y={P - 260} r={900} color="#ffc56a" fuerza={0.55} /><A {...act(THEO, 1300, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { hD: 40, cD: 70 } }, { f: k(145.8), v: { hD: 150, cD: 20 } }], caras: [{ f: 0, v: "determinado" }, { f: k(145.8), v: "feliz" }], enManoI: farol(f), luz: { lado: 1, color: "#ffb04a", fuerza: 1 } })} /></>}
          hud={<><H l={[dosis(0, k(145.8))]} /><Txt t="THE MEDICINE COUNTER" a={k(143.3)} b={k(145.7)} top={140} tam={52} chip /><Mano t="DOSES" x={960} y={300} desde={k(145.8)} hasta={k(146.8) + 4} tam={150} /></>} />
      );
    };
    return <Pl />;
  },
};

const p19b: PlanB = {
  a: 146.8, b: 150.3, trans: { tipo: "corte" },
  sfx: [[147.0, "swish", -8], [147.4, "bottle_bin", -6], [148.2, "swish", -8], [148.6, "bottle_bin", -6], [149.4, "swish", -8], [149.7, "bottle_bin", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const X = FAR_PUNTOS.gondola1 + 200;
      const barre = (t: number) => interpolate(f, [k(t), k(t + 0.35)], [0, 1], cl);
      const pasadas = [147.0, 148.2, 149.4];
      return (
        <Escena Set={Farmacia} pal={PAL} setProps={{ cinta: 1, vaciar: interpolate(f, [k(147.0), k(150.0)], [0, 0.35], cl) }} seed={529} mano={2}
          claves={[mira(0, X + 60, 600, 1.7), mira(k(150.3), X + 70, 600, 1.75, { curva: "inout" })]}
          medio={<>
            <Halo x={X} y={P - 260} r={700} color="#ffc56a" fuerza={0.55} />
            <g transform={`translate(${X + 220},${P})`}><path d="M-110,-150 L110,-150 L95,0 L-95,0 Z" fill="#b08a5a" stroke="#5a4020" strokeWidth={6} />{Array.from({ length: Math.floor(pasadas.filter((t) => f > k(t + 0.3)).length * 3) }).map((_, i) => <rect key={i} x={-80 + (i % 4) * 40} y={-176 - Math.floor(i / 4) * 30} width={36} height={30} rx={3} fill={["#e9ecef", "#cfe8f2", "#5a7442"][i % 3]} />)}</g>
            {pasadas.map((t, j) => { const u = barre(t); return u > 0 && u < 1 && Array.from({ length: 5 }).map((_, i) => <rect key={`${j}${i}`} x={X - 120 + i * 40 + 300 * u} y={P - 420 + 260 * u * u + i * 6} width={32} height={26} rx={3} fill={["#e9ecef", "#cfe8f2", "#5a7442"][i % 3]} />); })}
            <A {...act(THEO, X - 80, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { hD: 120, cD: 20, hI: 30, cI: 40 } }, ...pasadas.flatMap((t) => [{ f: k(t), v: { hD: 120, cD: 10, hI: 30, cI: 40, tronco: -6 } }, { f: k(t + 0.35), v: { hD: 60, cD: 10, hI: 30, cI: 40, tronco: 16 } }, { f: k(t + 0.8), v: { hD: 120, cD: 20, hI: 30, cI: 40 } }])], caras: [{ f: 0, v: "determinado" }], luz: { lado: 1, color: "#ffb04a", fuerza: 1 } })} />
          </>}
          hud={<><H l={[dosis([{ f: 0, v: 0 }, { f: k(147.4), v: 40, d: 10 }, { f: k(148.6), v: 90, d: 10 }, { f: k(149.7), v: 140, d: 10 }])]} /><Txt t="EVERY IV ANTIBIOTIC HE CAN FIND" a={k(147.0)} b={k(150.3) + 4} top={140} tam={50} chip /></>} />
      );
    };
    return <Pl />;
  },
};

const p19c: PlanB = {
  a: 150.3, b: 153.3, trans: { tipo: "corte" },
  sfx: [[150.4, "cart", -8, { dur: 1.4 }], [151.2, "box", -6], [151.9, "box", -6], [152.6, "box", -6], [153.0, "car_door", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const xa = 1500;
      const caja = (t: number) => interpolate(f, [k(t), k(t + 0.4)], [0, 1], cl);
      return (
        <Escena Set={Panorama} pal={PAL} setProps={{ hora: "noche", luces: 0, nieve: 0.8, ventana: 0 }} seed={539} mano={2}
          claves={[mira(0, xa + 60, P - 60, 1.55), mira(k(153.3), xa + 80, P - 60, 1.6, { curva: "inout" })]}
          medio={<>
            <Auto x={xa + 200} y={P + 120} color="#7a3a2a" tipo="pickup" s={1.7} nieve={0.3} />
            {Array.from({ length: Math.floor([151.2, 151.9, 152.6].filter((t) => f > k(t + 0.4)).length * 2 + 2) }).map((_, i) => <rect key={i} x={xa + 200 - 200 + (i % 4) * 46} y={P + 120 - 62 * 1.7 - 40 - Math.floor(i / 4) * 40} width={42} height={40} rx={3} fill={["#e9ecef", "#cfe8f2", "#5a7442"][i % 3]} />)}
            {[151.2, 151.9, 152.6].map((t, i) => { const u = caja(t); return u > 0 && u < 1 && <rect key={i} x={xa - 200 + 260 * u} y={P - 120 - Math.sin(u * Math.PI) * 80} width={42} height={40} rx={3} fill="#cfe8f2" />; })}
            <A {...act(THEO, xa - 260, { ruta: [{ f: 0, x: xa - 260, y: P + 120 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "tirarCarga" }, { f: k(151.6), v: { hD: 110, cD: 20, hI: 110, cI: 20 } }, { f: k(151.9), v: "tirarCarga" }, { f: k(152.3), v: { hD: 110, cD: 20, hI: 110, cI: 20 } }], caras: [{ f: 0, v: "determinado" }], luz: { lado: 1, color: "#ffb04a", fuerza: 0.9 } })} />
          </>}
          hud={<><H l={[dosis([{ f: 0, v: 140 }, { f: k(151.4), v: 160, d: 10 }, { f: k(152.1), v: 172, d: 10 }, { f: k(152.8), v: 184, d: 10 }])]} />{["SALINE", "NEEDLES", "TAPE"].map((t, i) => <Txt key={t} t={t} a={k([151.1, 151.9, 152.6][i])} b={k(153.3) + 4} top={140} left={560 + i * 300} tam={52} mano chip color={AMBAR} />)}</>} />
      );
    };
    return <Pl />;
  },
};

const p19d: PlanB = {
  a: 153.3, b: 156.9, trans: { tipo: "corte" },
  sfx: [[153.4, "paper", -10], [153.6, "write", -8], [153.9, "lantern", -10, { dur: 1.2 }], [155.6, "sad", -16]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const items = ["IV ANTIBIOTICS", "SALINE", "NEEDLES", "TAPE", "LANTERN · OPERATING ROOM"];
      return (
        <AbsoluteFill style={{ background: "radial-gradient(circle at 40% 50%, #3a2a1e 0%, #120c08 80%)" }}>
          <svg width={1920} height={1080}>
            <g transform="translate(560,560) rotate(-3)">
              <rect x={-330} y={-400} width={660} height={800} rx={20} fill="#efe4c8" stroke="#5a4020" strokeWidth={8} /><rect x={-100} y={-430} width={200} height={60} rx={12} fill="#8a96a4" />
              {items.map((t, i) => { const tick = f > k(153.5) + i * 16; return <g key={t} transform={`translate(-280,${-280 + i * 130})`}><rect x={0} y={-40} width={56} height={56} rx={8} fill="#fff" stroke="#3a3a44" strokeWidth={4} />{tick && <path d="M8,-12 L24,6 L50,-34" stroke="#3aa05a" strokeWidth={10} fill="none" strokeLinecap="round" />}<text x={80} y={4} fontFamily={FONT} fontWeight={600} fontSize={i === 4 ? 32 : 40} fill="#1d3a8a">{t}</text></g>; })}
            </g>
            <g transform="translate(1420,640)"><FarolMano s={4.2} f={f} on={interpolate(f, [k(153.9), k(154.4)], [0, 1], cl)} halo={0.9} /></g>
          </svg>
          <H l={[dosis(184)]} />
          <Txt t="THEY HOPE THEY NEVER USE IT" a={k(155.0)} b={k(156.9) + 4} top={140} left={1060} tam={46} chip color={AMBAR} />
        </AbsoluteFill>
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
            <Halo x={1150} y={P - 300} r={760} color="#ffb04a" fuerza={0.55} />
            <g transform={`translate(1150,${P - 200})`}><rect x={-70} y={0} width={140} height={200} fill="#5a3a24" /><rect x={-80} y={-10} width={160} height={16} rx={4} fill="#6a4a30" /><FarolMano y={-10} s={1.4} f={f} halo={1} /></g>
            <Ore x={930} y={P} dir={-1} s={0.85} f={f} cola={f > k(161.0) ? 1 : 0.2} cabeza={-10} />
            <A {...act({ ...JUNE, accesorios: [...(JUNE.accesorios ?? []), { t: "delantal", color: "#e8eef0" }] }, 560, { poses: [{ f: 0, v: "arrodillado" }, { f: k(158.0), v: { tronco: 20, pI: 0, rI: 90, pD: 90, rD: 90, hD: 75, cD: 40, hI: 60, cI: 40 } }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "determinado" }] })} />
          </>}
          hud={<><H l={[fiebre(102), dosis([{ f: 0, v: 184 }, { f: k(159.8), v: 183, d: 10 }])]} /><Txt t="THE IV · BY LANTERN LIGHT" a={k(158.1)} b={k(160.3)} top={140} tam={50} chip color={AMBAR} /><Txt t="LILY DOESN'T EVEN CRY" a={k(160.3)} b={k(161.8)} top={140} tam={50} chip /><Txt t="SHE JUST HOLDS ORR'S EAR" a={k(161.8)} b={k(163.7) + 4} top={140} tam={50} mano chip /></>} />
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
          hud={<><H l={[fiebre(102), dosis([{ f: 0, v: 183 }, { f: k(167.3), v: 182, d: 10 }]), dia([{ f: 0, v: 0 }, { f: k(164.9), v: 1, d: 6 }, { f: k(167.3), v: 2, d: 6 }], k(164.9))]} />
            <GrafFiebre k={k} />
            <Txt t="DAY 1 · FEVER STAYS HIGH" a={k(164.8)} b={k(167.3)} top={140} tam={50} chip color="#ff8a6a" /><Txt t="DAY 2 · THE SAME" a={k(167.3)} b={k(169.5)} top={140} tam={50} chip color="#ff8a6a" /><Txt t="SHE SLEEPS IN THE CHAIR" a={k(169.5)} b={k(173.6) + 4} top={140} tam={50} chip /></>} />
      );
    };
    return <Pl />;
  },
};

// fiebre de 2 días, plana en 102 °F (recuadro arriba a la derecha)
const GrafFiebre: React.FC<{ k: (s: number) => number }> = ({ k }) => {
  const f = useF();
  const u = interpolate(f, [k(164.8), k(169.4)], [0, 1], cl);
  const op = interpolate(f, [k(164.6), k(165.0), k(169.4), k(169.8)], [0, 1, 1, 0], cl);
  const X0 = 1300, Y0 = 520, W = 520, yv = (v: number) => Y0 - (v - 97) * 50;
  return op > 0 ? <svg width={1920} height={1080} style={{ position: "absolute", opacity: op }}>
    <rect x={X0 - 40} y={230} width={W + 80} height={340} rx={20} fill="rgba(18,15,24,0.88)" stroke="#f6ecd2" strokeWidth={3} />
    <line x1={X0} y1={yv(98.6)} x2={X0 + W} y2={yv(98.6)} stroke="#7ad08a" strokeWidth={4} strokeDasharray="12 10" /><text x={X0 + W} y={yv(98.6) + 34} textAnchor="end" fontFamily={FONT} fontSize={26} fill="#7ad08a">NORMAL 98.6</text>
    <path d={`M${X0},${yv(102)} L${X0 + W * u},${yv(102) + 6 * Math.sin(u * 20)}`} stroke="#ff6a5a" strokeWidth={10} fill="none" strokeLinecap="round" />
    <text x={X0} y={yv(102) - 24} fontFamily={FONT} fontWeight={700} fontSize={34} fill="#ff8a6a">102°F</text>
    {[0.5, 1].map((d, i) => <text key={i} x={X0 + W * d} y={Y0 + 40} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={28} fill="#f6ecd2" opacity={u >= d - 0.02 ? 1 : 0.3}>{`DAY ${i + 1}`}</text>)}
  </svg> : null;
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
          hud={<><H l={[fiebre([{ f: 0, v: 99.1 }, { f: k(178.9), v: 98.6, d: 12 }]), dia([{ f: 0, v: 3 }, { f: k(178.9), v: 7, d: 10 }])]} /><Txt t="DAY 7 · UP AND WALKING" a={k(179.0)} b={k(182.4)} top={140} tam={52} chip color="#7ad08a" /><Txt t="«THE BEETLE PATROL IS BEHIND!»" a={k(182.4)} b={k(184.6) + 4} top={140} tam={52} mano chip color={AMBAR} /></>} />
      ) : (
        <Liv claves={[mira(0, 900, 600, 1.4), mira(k(176.4), 760, 610, 1.9, { curva: "inout" }), mira(k(178.9), 740, 600, 2.0)]}
          sp={{ farol: 0, hora: "dia", sol: 1, suero: 1, sueroNivel: 0.2, fuego: 0.3 }}
          medio={<>
            <A {...lily({ poses: [{ f: 0, v: { tronco: 18, pI: 80, rI: 70, pD: 86, rD: 74, hD: 30, cD: 120, hI: 20, cI: 110, cabeza: 14 } }, { f: k(174.6), v: { tronco: -2, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 50, hI: 25, cI: 50 } }], caras: [{ f: 0, v: "cansado" }, { f: k(174.6), v: "feliz" }], habla: [[k(175.0), k(176.0)]] })} />
            <A {...act(JUNE, 560, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: -6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 40, cD: 80, hI: 40, cI: 80, cabeza: 26 } }, { f: k(176.6), v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 110, cD: 40 } }], caras: [{ f: 0, v: "cansado" }, { f: k(176.6), v: "sorpresa" }, { f: k(177.6), v: "risa" }] })} />
          </>}
          hud={<><H l={[fiebre([{ f: 0, v: 102 }, { f: k(176.4), v: 99.1, d: 30 }]), dia([{ f: 0, v: 2 }, { f: k(173.8), v: 3, d: 6 }])]} /><Txt t="THIRD MORNING" a={k(173.7)} b={k(175.0)} top={140} tam={50} chip /><GloboRadioMano t="Toast?" desde={k(175.0)} hasta={k(176.6)} /><Txt t="FEVER DOWN" a={k(176.6)} b={k(177.8)} top={140} tam={54} chip color="#7ad08a" /><Txt t="LESS PAIN" a={k(177.8)} b={k(178.9) + 4} top={140} tam={54} chip color="#7ad08a" /></>} />
      );
    };
    return <Pl />;
  },
};
const GloboRadioMano: React.FC<{ t: string; desde: number; hasta: number }> = ({ t, desde, hasta }) => <Txt t={`«${t}»`} a={desde} b={hasta} top={140} tam={70} mano chip color="#f6ecd2" />;

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
        <Liv claves={pizarra ? [mira(0, GL_PIZARRA.x - 20, GL_PIZARRA.y + 200, 1.6)] : [mira(0, L.mesa, 620, 1.3), mira(k(195.4), L.mesa, 600, 1.7, { curva: "inout" })]}
          sp={{ farol: 1, reglas: [{ t: "1. FRESH FIRST", desde: -100 }, { t: "2. NOTHING RISKY ALONE", desde: -100 }, { t: "3. ONE THING…", desde: -100 }, { t: "PLAN A: IV ANTIBIOTICS", desde: -100, color: "#b8382c", tilde: k(185.3) }, { t: "PLAN B: THE TABLE", desde: -100, color: "#b8382c" }] }}
          medio={!pizarra && <>
            <A {...act(JUNE, L.mesa - 140, { asiento: [{ f: 0, v: 60 }], poses: [{ f: 0, v: "sentado" }, { f: k(188.8), v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 80, cD: 20, hI: 25, cI: 50 } }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "duda" }, { f: k(192.0), v: "triste" }], miradas: [{ f: 0, v: { x: 1, y: 0.5 } }] })} />
            {Array.from({ length: 24 }).map((_, i) => { const vx = L.mesa - 60 + (i % 8) * 34, vy = P - 182 - Math.floor(i / 8) * 64; return <g key={i}><g opacity={i < n ? 1 : 0.35}><Vial x={vx} y={vy} s={0.7} /></g>{i >= n && <path d={`M${vx - 14},${vy - 40} L${vx + 14},${vy} M${vx + 14},${vy - 40} L${vx - 14},${vy}`} stroke="#d0302a" strokeWidth={5} strokeLinecap="round" />}</g>; })}
          </>}
          hud={<><H l={[dosis([{ f: 0, v: 182 }, { f: k(190.2), v: 96, d: 110 }])]} />
            <Txt t="PLAN A WORKED" a={k(184.8)} b={k(186.2)} top={140} tam={60} mano chip color="#7ad08a" />
            <Txt t="BUT JUNE ISN'T CELEBRATING" a={k(186.3)} b={k(188.4)} top={140} tam={50} chip />
            <Txt t="SHE DID THE MATH" a={k(188.4)} b={k(190.0)} top={140} tam={54} mano chip color={AMBAR} />
            <Txt t="ONE 12-YEAR-OLD =" a={k(190.0)} b={k(192.0)} top={140} tam={52} chip />
            <Txt t="A BIG CHUNK OF THE STRONGEST ANTIBIOTICS" a={k(192.0)} b={k(195.4) + 4} top={140} tam={44} chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 24 · «not coming back» · Duluth de noche, nadie fabrica ============
const p24: PlanB = {
  a: 195.4, b: 199.2, trans: { tipo: "fundido", d: 10 },
  sfx: [[195.5, "wind_cold", -14, { dur: 3.5 }], [196.3, "creak", -12], [197.6, "metal_fall", -14], [198.5, "tick", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const z = interpolate(f, [0, k(199.2)], [1, 1.08], cl);
      return (
        <AbsoluteFill style={{ background: "linear-gradient(#1a2030 0%, #2a3242 70%, #dfe6ee 70%, #f2f4f8 100%)" }}>
          <svg width={1920} height={1080} style={{ transform: `scale(${z})`, transformOrigin: "50% 70%" }}>
            {[[300, 260], [470, 320]].map(([x, h], i) => <g key={i}><rect x={x} y={756 - h - 200} width={70} height={h} fill="#4a4e5a" /><rect x={x - 6} y={756 - h - 210} width={82} height={18} fill="#3a3e48" /></g>)}
            <rect x={200} y={480} width={1500} height={276} fill="#5a5e6a" /><path d="M200,480 L560,380 L560,480 M560,480 L920,380 L920,480 M920,480 L1280,380 L1280,480 M1280,480 L1700,380 L1700,480 Z" fill="#4a4e5a" />
            {Array.from({ length: 12 }).map((_, i) => <g key={i}><rect x={260 + i * 118} y={540} width={80} height={90} fill="#1a1e26" />{i % 3 === 1 && <path d={`M${265 + i * 118},545 l30,40 l-10,10 l35,30`} stroke="#8a96a4" strokeWidth={3} fill="none" />}</g>)}
            <rect x={760} y={640} width={260} height={116} fill="#2a2e36" /><path d="M760,640 L1020,756 M1020,640 L760,756" stroke="#8a5a3a" strokeWidth={8} />
            <rect x={640} y={420} width={520} height={60} rx={8} fill="#e9ecef" /><text x={900} y={462} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#2f5a7a">PHARMA PLANT · DULUTH</text>
            {Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={(i * 211 + f * (1 + (i % 3))) % 1920} cy={(i * 97 + f * (2 + (i % 4))) % 1080} r={2 + (i % 3)} fill="#fff" opacity={0.7} />)}
            <path d="M0,756 Q500,730 960,760 T1920,750 L1920,1080 L0,1080 Z" fill="#f2f4f8" />
          </svg>
          <H l={[dosis(96)]} />
          <Txt t="NOT COMING BACK" a={k(195.6)} b={k(197.4)} top={140} tam={56} chip />
          <Txt t="FACTORIES RUNNING: 0" a={k(197.5)} b={k(199.2) + 4} top={140} tam={60} mano chip color="#ff8a6a" />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

// ============ 25 · «Every dose is one less on Earth» (eco de la miniatura) ============
const p25: PlanB = {
  a: 199.2, b: 202.0, trans: { tipo: "corte" },
  sfx: [[199.3, "boom", -8], [199.5, "riser", -16, { dur: 1 }], [200.6, "glass", -6], [200.8, "tick", -2], [201.2, "sad", -14]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const rot = f * 0.8;
      const n = f < k(200.8) ? 96 : 95;
      const g = golpe(f, k(200.8), 10);
      return (
        <AbsoluteFill style={{ background: "radial-gradient(circle at 35% 50%, #1e2a40 0%, #080a12 80%)" }}>
          <svg width={1920} height={1080}>
            {Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={(i * 331) % 1920} cy={(i * 173) % 1080} r={1.5 + (i % 3)} fill="#fff" opacity={0.5} />)}
            <defs><clipPath id="glb25"><circle cx={620} cy={560} r={300} /></clipPath></defs>
            <circle cx={620} cy={560} r={300} fill="#2f6ab0" />
            <g clipPath="url(#glb25)">{[[-120, -60, 140, 90], [80, 40, 120, 160], [-40, 150, 90, 60], [190, -110, 110, 70]].map(([x, y, w, h], i) => <ellipse key={i} cx={620 + ((x + rot + 900) % 900) - 450} cy={560 + y} rx={w} ry={h} fill="#5a9a5a" />)}</g>
            <circle cx={620} cy={560} r={300} fill="none" stroke="#cfe0f0" strokeWidth={6} />
            <g transform={`translate(${1340 + g},380)`}>
              <rect x={-300} y={-120} width={600} height={240} rx={26} fill="rgba(18,15,24,0.9)" stroke={AMBAR} strokeWidth={5} />
              <text x={0} y={-50} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#f6ecd2">DOSES ON EARTH</text>
              <text x={0} y={80} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={120} fill={f > k(200.8) ? "#ff8a6a" : AMBAR}>{n}</text>
            </g>
            <g transform="translate(1340,820)">
              <rect x={-300} y={0} width={600} height={20} rx={6} fill="#6a4a30" />
              {Array.from({ length: 8 }).map((_, i) => { const ultima = i === 7; const y = ultima ? interpolate(f, [k(200.0), k(200.6)], [-300, 0], { ...cl, easing: (t) => t * t }) : 0; return <g key={i} opacity={ultima && f < k(200.0) ? 0 : 1}><Vial x={-260 + i * 72} y={y} s={1.2} /></g>; })}
            </g>
          </svg>
          <H l={[dosis([{ f: 0, v: 96 }, { f: k(200.8), v: 95, d: 8 }])]} />
          <Txt t="ONE LESS ON EARTH" a={k(199.6)} b={k(202.0) + 4} top={140} tam={62} mano chip color={AMBAR} />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
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
          hud={<><H l={[dosis(95)]} /><Txt t="CAN THEY SAVE LILY?" a={k(203.6)} b={k(205.0) + 4} top={140} tam={56} chip /></>} />
      );
      return (
        <Escena Set={Farmacia} pal={PAL} setProps={{ cinta: 1, vaciar: interpolate(f, [k(205.2), k(207.6)], [0.5, 1], cl), polvo: 1 }} seed={526} mano={2}
          claves={[mira(0, 1700, 520, 0.85), mira(k(207.8), 1700, 520, 0.7, { curva: "inout" })]}
          hud={<><H l={[dosis([{ f: 0, v: 95 }, { f: k(205.4), v: 0, d: 60 }]), anio([{ f: 0, v: 1 }, { f: k(205.2), v: 10, d: 50 }], k(205.2))]} /><Txt t="IN 10 YEARS, WHEN THE SHELVES ARE EMPTY?" a={k(205.4)} b={k(207.8) + 4} top={140} tam={46} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 27 · los 10 a la mesa: medicina desde abajo ============
const DIEZ = [JUNE, THEO_CASA, GUS, MARCUS, ROSA, PRIYA, DEV, NAN, BEN, LILY];
const p27: PlanB = {
  a: 207.8, b: 211.4, trans: { tipo: "corte" },
  sfx: [[208.0, "chair", -10], [208.6, "chair", -12], [209.4, "page", -10], [210.6, "wood_hit", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Liv claves={[mira(0, 2800, 730, 1.25), mira(k(211.4), 2820, 735, 1.32, { curva: "inout" })]} sp={{ farol: 1, libros: 1 }}
          medio={<>
            <Halo x={2750} y={P - 300} r={900} color={AMBAR} fuerza={0.45} />
            {DIEZ.map((l, i) => i === 0
              ? <A key={i} {...act(l, L.mesa - 480, { poses: [{ f: 0, v: "hablar" }, { f: k(210.6), v: { hD: 60, cD: 30, tronco: 14 } }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "determinado" }], habla: [[k(208.0), k(211.4)]] })} />
              : <A key={i} {...act(l, L.mesa - 300 + i * 85 + (i > 4 ? 120 : 0), { asiento: [{ f: 0, v: l.alto ? 40 : 60 }], poses: [{ f: 0, v: "sentado" }, { f: k(209.0 + i * 0.2), v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 35, cD: 55 } }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: i % 3 ? "neutral" : "duda" }, { f: k(210.6), v: "determinado" }], seed: 30 + i })} />)}
          </>}
          hud={<><H /><Txt t="BUILD MEDICINE FROM THE BOTTOM UP" a={k(209.0)} b={k(211.4) + 4} top={140} tam={50} chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

const p27b: PlanB = {
  a: 211.4, b: 215.9, trans: { tipo: "corte" },
  sfx: [[211.5, "chalk", -6, { dur: 0.8 }], [212.2, "fail", -12], [213.3, "chalk", -6, { dur: 0.6 }], [213.8, "chalk", -6, { dur: 0.6 }], [214.2, "chalk", -6, { dur: 0.6 }], [214.6, "chalk", -6, { dur: 0.6 }], [214.9, "sparkle", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const pisos = [{ t: "SOAP · CLEAN HANDS", c: "#f6ecd2", a: 213.3 }, { t: "CLEAN WATER", c: "#8fd3ff", a: 213.7 }, { t: "ALCOHOL", c: "#ffd27a", a: 214.1 }, { t: "PLANTS", c: "#7ad08a", a: 214.5 }];
      const cima = interpolate(f, [k(211.5), k(212.0)], [0, 1], cl);
      return (
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #2e3a32 0%, #18201a 85%)" }}>
          <svg width={1920} height={1080}>
            <rect x={140} y={110} width={1640} height={880} rx={18} fill="none" stroke="#6a4a30" strokeWidth={22} />
            {pisos.map((p, i) => {
              const u = interpolate(f, [k(p.a), k(p.a) + 9], [0, 1], cl);
              const w = 1100 - i * 220, y = 860 - i * 130;
              return <g key={p.t}>
                <rect x={960 - w / 2} y={y - 110} width={w} height={110} rx={8} fill="none" stroke={p.c} strokeWidth={6} strokeDasharray={2 * (w + 110)} strokeDashoffset={2 * (w + 110) * (1 - u)} />
                <text x={960} y={y - 40} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={p.c} opacity={u}>{p.t}</text>
              </g>;
            })}
            <g opacity={cima}>
              <path d={`M960,190 L1150,340 L770,340 Z`} fill="none" stroke="#8a8a8a" strokeWidth={6} strokeDasharray="14 10" />
              <text x={960} y={316} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#9a9a9a">MODERN DRUGS</text>
              {f > k(212.2) && <path d="M830,230 L1090,330" stroke="#ff6a5a" strokeWidth={10} strokeLinecap="round" />}
            </g>
          </svg>
          <H />
          <Txt t="NOT THE FANCY STUFF" a={k(211.6)} b={k(213.2)} top={140} tam={54} chip color="#ff8a6a" />
          <Txt t="WHAT SAVED THE MOST LIVES IN HISTORY" a={k(213.3)} b={k(215.9) + 4} top={140} tam={46} chip color="#7ad08a" />
        </AbsoluteFill>
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
        <Escena Set={Mural} pal={PAL} setProps={{ tono: "#5a4636", velas: camas }} seed={528} mano={1.8}
          claves={[mira(0, 760, 640, 1.4), mira(k(222.4), 820, 640, 1.45), mira(k(224.2), 1250, 600, 0.95, { curva: "inout" }), mira(k(227.2), 1300, 600, 0.95), mira(k(229.4), 1450, 620, 1.1, { curva: "inout" })]}
          detras={<>
            <Palangana x={700} y={P - 140} espuma={1} f={f} /><rect x={600} y={P - 140} width={200} height={140} fill="#4a3424" />
            <A {...act(LEVITA, 600, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 20, hD: 70, cD: 60, hI: 60, cI: 70 } }], caras: [{ f: 0, v: "determinado" }], luz: BORDE_CALIDO, ajuste: (p, ff) => ({ ...p, cD: p.cD + 10 * Math.sin(ff / 2) }) })} />
            {f > k(227.3) && [0, 1, 2].map((i) => <A key={i} {...act(LEVITA, 1500 + i * 130, { ruta: [{ f: k(227.4), x: 1700 + i * 130, y: P }, { f: k(229.4), x: 1560 + i * 130, y: P }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: i === 1 ? "señalar" : { hD: 40, cD: 150, cabeza: -10 } }], caras: [{ f: 0, v: "risa" }], seed: 40 + i })} />)}
          </>}
          hud={<><H l={[anio([{ f: 0, v: 1820 }, { f: k(218.4), v: 1847, d: 30 }], k(218.4))]} /><Txt t="IGNAZ SEMMELWEIS · VIENNA" a={k(219.4)} b={k(222.2)} top={140} tam={50} chip /><Txt t="DOCTORS WASHED THEIR HANDS" a={k(222.2)} b={k(224.3)} top={140} tam={50} chip color="#8fd3ff" /><Txt t="DEATHS DROPPED DRAMATICALLY" a={k(224.3)} b={k(227.4)} top={140} tam={50} mano chip color="#7ad08a" /><Txt t="NOBODY BELIEVED HIM" a={k(227.6)} b={k(229.4) + 4} top={140} tam={56} mano chip color="#ff8a6a" />
            <BarrasMuertes k={k} /></>} />
      );
    };
    return <Pl />;
  },
};

// muertes de madres en la clínica, antes / después del lavado (barras que caen)
const BarrasMuertes: React.FC<{ k: (s: number) => number }> = ({ k }) => {
  const f = useF();
  const op = interpolate(f, [k(223.6), k(224.0), k(227.2), k(227.6)], [0, 1, 1, 0], cl);
  const caida = interpolate(f, [k(224.3), k(226.3)], [0, 1], { ...cl, easing: (t) => 1 - (1 - t) * (1 - t) });
  const hs = [300, 290, 310, 300].map((h, i) => i < 2 ? h : h - (h - 50) * caida);
  return op > 0 ? <svg width={1920} height={1080} style={{ position: "absolute", opacity: op }}>
    <rect x={1240} y={300} width={560} height={480} rx={20} fill="rgba(18,15,24,0.9)" stroke="#f6ecd2" strokeWidth={3} />
    <text x={1520} y={352} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#f6ecd2">DEATHS AMONG NEW MOTHERS</text>
    {hs.map((h, i) => <rect key={i} x={1300 + i * 120} y={720 - h} width={80} height={h} rx={8} fill={i < 2 ? "#d0302a" : "#5ac87a"} />)}
    <line x1={1280} y1={720} x2={1780} y2={720} stroke="#f6ecd2" strokeWidth={4} />
    <text x={1400} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#ff8a6a">BEFORE</text><text x={1640} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#7ad08a">WASHING</text>
  </svg> : null;
};

// ============ 29 · June hace ley el lavado de manos; Rosa hace jabón de ceniza ============
const p29: PlanB = {
  a: 229.4, b: 242.7, trans: { tipo: "corte" },
  sfx: [[229.6, "chalk", -6, { dur: 2 }], [232.4, "pour", -12], [233.6, "kids_laugh", -14], [235.6, "pop", -8], [237.4, "fire", -12, { dur: 5 }], [238.0, "stir", -6, { dur: 4 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(237.3)) return (
        <Liv claves={f < k(232.0) ? [mira(0, GL_PIZARRA.x - 20, GL_PIZARRA.y + 200, 1.6), mira(k(232.0), GL_PIZARRA.x - 10, GL_PIZARRA.y + 200, 1.66)] : [mira(0, 2680, 620, 1.25), mira(k(237.3), 2640, 620, 1.32, { curva: "inout" })]}
          sp={{ farol: 1, reglas: [{ t: "1. FRESH FIRST", desde: -100 }, { t: "2. NOTHING RISKY ALONE", desde: -100 }, { t: "3. ONE THING…", desde: -100 }, { t: "PLAN A: IV ANTIBIOTICS", desde: -100, color: "#b8382c", tilde: -100 }, { t: "PLAN B: THE TABLE", desde: -100, color: "#b8382c" }, { t: "NEW LAW: WASH HANDS", desde: k(229.8), color: "#2f9a4a" }] }}
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
          hud={<><H /><Txt t="ROSA MAKES SOAP" a={k(237.4)} b={k(242.7) + 4} top={140} tam={52} chip /><Ecuacion k={k} /></>} />
      );
    };
    return <Pl />;
  },
};

// ceniza + grasa → jabón, cada término entra con un golpe
const Ecuacion: React.FC<{ k: (s: number) => number }> = ({ k }) => {
  const f = useF();
  const e = (t: number) => interpolate(f, [k(t), k(t) + 6], [0, 1], { ...cl, easing: (q) => 1 - (1 - q) * (1 - q) });
  const caja = (x: number, t: number, ch: React.ReactNode, rot: string, c: string) => { const u = e(t); return u > 0 && <g transform={`translate(${x},420) scale(${0.4 + 0.6 * u})`} opacity={u}><rect x={-150} y={-110} width={300} height={220} rx={22} fill="rgba(18,15,24,0.9)" stroke={c} strokeWidth={5} />{ch}<text x={0} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={c}>{rot}</text></g>; };
  return <svg width={1920} height={1080} style={{ position: "absolute" }}>
    {caja(900, 238.8, <path d="M-80,40 Q-40,-50 0,-40 Q40,-60 80,40 Z" fill="#8a8a90" />, "WOOD ASH", "#cfd2d8")}
    {e(239.4) > 0 && <text x={1075} y={450} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={90} fill="#f6ecd2" opacity={e(239.4)}>+</text>}
    {caja(1250, 239.4, <g><rect x={-50} y={-70} width={100} height={110} rx={14} fill="#f2e2b0" stroke="#8a7a4a" strokeWidth={4} /><rect x={-56} y={-82} width={112} height={20} rx={6} fill="#8a7a4a" /></g>, "ANIMAL FAT", "#f2d27a")}
    {e(240.6) > 0 && <text x={1425} y={450} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={90} fill="#f6ecd2" opacity={e(240.6)}>=</text>}
    {caja(1600, 240.6, <g><rect x={-70} y={-55} width={140} height={80} rx={22} fill="#e8f0d8" stroke="#6a8a4a" strokeWidth={5} />{[0, 1, 2].map((i) => <circle key={i} cx={-40 + i * 40} cy={-70 - (f % 30) - i * 8} r={10} fill="none" stroke="#cfe8f2" strokeWidth={3} />)}</g>, "SOAP", "#7ad08a")}
  </svg>;
};

// ============ 30 · 2: agua limpia (hervir) ============
const Germen: React.FC<{ x: number; y: number; f: number; vive: number; i: number }> = ({ x, y, f, vive, i }) => (
  <g transform={`translate(${x + Math.sin(f / 7 + i) * 8},${y + Math.cos(f / 9 + i) * 6})`} opacity={vive}>
    {vive < 1 && <circle r={18 + 40 * (1 - vive)} fill="none" stroke="#c8f0a0" strokeWidth={5} />}<circle r={18} fill="#7ad08a" />{Array.from({ length: 6 }).map((_, k) => <rect key={k} x={-2} y={-28} width={4} height={10} fill="#7ad08a" transform={`rotate(${k * 60})`} />)}
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
            <A {...act(MARCUS, x + 190, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 70, cD: 40, tronco: 10 } }], caras: [{ f: 0, v: "determinado" }], enManoD: <rect x={-4} y={-6} width={8} height={150} rx={3} fill="#8a5a36" transform="rotate(-40)" />, ajuste: (p, ff) => ({ ...p, hD: p.hD + 16 * Math.sin(ff / 5), cD: p.cD + 10 * Math.cos(ff / 5) }) })} />
          </>}
          hud={<><H /><Paso n="2" rot="CLEAN WATER" desde={k(242.8)} hasta={k(245.4)} x={1450} y={330} />
            <Txt t="BOILING KILLS CHOLERA · DYSENTERY" a={k(245.4)} b={k(248.2)} top={140} tam={46} mano chip color="#7ad08a" />
            <Txt t="MORE LIVES THAN ALMOST ANY DRUG" a={k(248.2)} b={k(251.6) + 4} top={140} tam={48} chip />
            <BarrasAgua k={k} /></>} />
      );
    };
    return <Pl />;
  },
};

// vidas salvadas: agua limpia vs casi cualquier remedio
const BarrasAgua: React.FC<{ k: (s: number) => number }> = ({ k }) => {
  const f = useF();
  const u = interpolate(f, [k(248.4), k(249.8)], [0, 1], { ...cl, easing: (t) => 1 - (1 - t) * (1 - t) });
  if (f < k(248.3)) return null;
  return <svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={1300} y={300} width={500} height={520} rx={20} fill="rgba(18,15,24,0.9)" stroke="#f6ecd2" strokeWidth={3} />
    <rect x={1380} y={740 - 380 * u} width={140} height={380 * u} rx={10} fill="#5ab0e8" /><rect x={1580} y={740 - 150 * u} width={140} height={150 * u} rx={10} fill="#a08ac8" />
    <line x1={1340} y1={740} x2={1760} y2={740} stroke="#f6ecd2" strokeWidth={4} />
    <text x={1450} y={790} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#8fd3ff">CLEAN WATER</text><text x={1650} y={790} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#c8b8f0">A DRUG</text>
    <text x={1550} y={350} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#f6ecd2">LIVES SAVED</text>
  </svg>;
};

// ============ 31 · 3: alcohol (el alambique de Dev y Marcus; Gus y el manotazo) ============
const p31: PlanB = {
  a: 251.6, b: 260.9, trans: { tipo: "corte" },
  sfx: [[251.7, "whoosh"], [253.4, "metal_tool", -6], [253.9, "hammer", -6], [254.4, "metal_tool", -8], [254.9, "hammer", -6], [255.6, "metal", -10], [255.2, "steam", -10, { dur: 2 }], [257.6, "pop", -4], [258.6, "drip", -6], [259.4, "glass", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const ax = GR_PUNTOS.alambique;
      return (
        <Escena Set={Granero} pal={PAL} setProps={{ farol: 1, alambique: 1, vapor: f > k(255.0) ? 1 : 0 }} seed={531} mano={2}
          claves={[mira(0, ax, 560, 1.2), mira(k(257.4), ax - 60, 600, 1.5, { curva: "inout" }), mira(k(260.9), ax - 30, 640, 1.75, { curva: "inout" })]}
          medio={<>
            <A {...act(DEV, ax - 260, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 16, hD: 70, cD: 50 } }], caras: [{ f: 0, v: "determinado" }], ajuste: (p, ff) => ({ ...p, cD: p.cD + 10 * Math.sin(ff / 3) }) })} />
            <A {...act(MARCUS, ax + 300, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 60, cD: 60 } }, { f: k(257.4), v: { hD: 110, cD: 20, tronco: -6 } }, { f: k(258.0), v: "brazosCruzados" }], caras: [{ f: 0, v: "neutral" }, { f: k(257.4), v: "enojo" }] })} />
            <A {...act(GUS, ax + 520, { ruta: [{ f: 0, x: ax + 700, y: P }, { f: k(256.6), x: ax + 480, y: P }, { f: k(258.2), x: ax + 620, y: P }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 80, cD: 30 } }, { f: k(257.6), v: "encogerse" }], caras: [{ f: 0, v: "picaro" }, { f: k(257.6), v: "sorpresa" }] })} />
            {/* bandeja de instrumentos que brilla con la gota */}
            <g transform={`translate(${ax - 30},${P - 180})`} opacity={f > k(258.4) ? 1 : 0}><rect x={-80} y={-10} width={160} height={14} rx={4} fill="#c8ccd6" />{[0, 1, 2].map((i) => <rect key={i} x={-60 + i * 40} y={-22} width={30} height={6} rx={3} fill="#e8eef6" />)}<Halo x={0} y={-20} r={120} color="#e8f4ff" fuerza={0.6} /></g>
          </>}
          hud={<><H /><Paso n="3" rot="ALCOHOL" desde={k(251.7)} hasta={k(253.6)} x={1450} y={330} />
            <Txt t="COPPER PIPE + PRESSURE COOKER" a={k(253.8)} b={k(257.0)} top={140} tam={48} chip />
            <Txt t="NOT FOR DRINKING" a={k(257.0)} b={k(258.4)} top={140} tam={60} mano chip color="#ff8a6a" />
            <Txt t="CLEANS WOUNDS & TOOLS" a={k(258.4)} b={k(260.9) + 4} top={140} tam={56} mano chip color="#7ad08a" /></>} />
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
            <A {...act(ROSA, 0, { ruta: [{ f: 0, x: 2560, y: P }, { f: k(264.4), x: 2900, y: P }], poses: [{ f: 0, v: "parado" }, { f: k(265.0), v: { hD: 80, cD: 40, tronco: 6 } }, { f: k(268.3), v: { hD: 160, cD: 120, hI: 20, cI: 30 } }], caras: [{ f: 0, v: "neutral" }, { f: k(266.0), v: "sorpresa" }, { f: k(268.6), v: "asco" }, { f: k(270.0), v: "determinado" }], luz: BORDE_FRIO, ajuste: (pp, ff) => ff > k(268.6) && ff < k(271.6) ? { ...pp, cabeza: (pp.cabeza ?? 0) + 4 * Math.sin(ff / 1.5) } : pp, enManoD: (ff: number) => ff > k(265.0) ? <rect x={-6} y={-30} width={12} height={60} rx={4} fill="#8a6a4a" /> : null })} />
            <g transform={`translate(3000,${P - 200})`}>
              <Tiza d="M-60,-40 l30,-20 l30,20 l0,36 l-30,20 l-30,-20 Z M0,-4 l40,0 M-30,-60 l0,-30" f={f} desde={k(266.2)} dur={22} color={AMBAR} ancho={5} o={1} />
              {f > k(269.4) && <g transform="translate(80,-40)"><ellipse rx={30} ry={14} fill="#f2ece0" /><rect x={-2} y={-14} width={4} height={28} fill="#c8c4b8" /></g>}
            </g>
          </>}
          hud={<><H /><Paso n="4" rot="OLD PLANT MEDICINE" desde={k(261.0)} hasta={k(264.4)} x={1400} y={330} />
            <Txt t="WILLOW BARK" a={k(264.6)} b={k(266.2)} top={140} tam={56} chip />
            <Salicina k={k} />
            <Txt t="CHEWED FOR PAIN & FEVER · THOUSANDS OF YEARS" a={k(268.3)} b={k(271.9)} top={140} tam={44} chip /></>} />
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
            <Txt t="HONEY · ANTIBACTERIAL" a={k(272.0)} b={k(274.3)} top={140} tam={56} chip color="#e3a531" />
            <Txt t="ON WOUNDS SINCE ANCIENT EGYPT" a={k(274.3)} b={k(276.6)} top={140} tam={50} chip />
            <Txt t="THEY WORK, A LITTLE" a={k(276.7)} b={k(278.3)} top={140} tam={58} mano chip color="#7ad08a" />
            <Txt t="NOT MIRACLES" a={k(278.3)} b={k(279.7) + 4} top={140} tam={62} mano chip color="#ff8a6a" /></>} />
      );
    };
    return <Pl />;
  },
};

// salicina (corteza) ⇄ aspirina (pastilla): dos hexágonos parientes
const Salicina: React.FC<{ k: (s: number) => number }> = ({ k }) => {
  const f = useF();
  const op = interpolate(f, [k(266.2), k(266.6), k(268.1), k(268.4)], [0, 1, 1, 0], cl);
  const fl = interpolate(f, [k(266.9), k(267.5)], [0, 1], cl);
  const hexa = (x: number, c: string) => <path d={Array.from({ length: 6 }).map((_, i) => `${i ? "L" : "M"}${x + 70 * Math.cos(i * Math.PI / 3)},${420 + 70 * Math.sin(i * Math.PI / 3)}`).join(" ") + "Z"} fill="none" stroke={c} strokeWidth={10} />;
  return op > 0 ? <svg width={1920} height={1080} style={{ position: "absolute", opacity: op }}>
    <rect x={560} y={260} width={800} height={320} rx={24} fill="rgba(18,15,24,0.9)" stroke="#f6ecd2" strokeWidth={3} />
    {hexa(760, "#c8a070")}<text x={760} y={550} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#c8a070">SALICIN</text>
    <g opacity={fl}>{hexa(1160, "#f2f4f6")}<text x={1160} y={550} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#f2f4f6">ASPIRIN</text>
      <text x={960} y={440} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={80} fill={AMBAR}>⇄</text>
      <text x={960} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#f6ecd2">NATURAL RELATIVE</text></g>
  </svg> : null;
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
        <Liv claves={f < k(282.0) ? [mira(0, L.mesa - 40, 610, 1.25), mira(k(282.0), L.mesa - 20, 600, 1.35, { curva: "inout" })] : f < k(285.0) ? [mira(0, L.mesa + 150, 580, 1.9), mira(k(285.0), L.mesa + 150, 570, 2.0, { curva: "inout" })] : [mira(0, L.mesa - 230, 600, 1.8), mira(k(288.7), L.mesa - 200, 600, 1.6, { curva: "inout" })]} sp={{ farol: 1 }}
          medio={<>
            <A {...act(DEV, L.mesa + 150, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(282.2), v: { hD: 130, cD: 30 } }], caras: [{ f: 0, v: "neutral" }, { f: k(282.2), v: "feliz" }], habla: [[k(282.2), k(285.0)]], enManoD: (ff: number) => ff > k(282.2) ? <PanMoho /> : null })} />
            <A {...act(JUNE, L.mesa - 250, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "brazosCruzados" }, { f: k(285.2), v: { hI: 40, cI: 130, hD: 45, cD: 130, tronco: 26, cabeza: 10 } }], caras: [{ f: 0, v: "duda" }, { f: k(285.2), v: "risa" }], ajuste: (p, ff) => ff > k(285.2) && ff < k(287.6) ? { ...p, tronco: p.tronco + 14 * Math.abs(Math.sin(ff / 2.4)), cabeza: (p.cabeza ?? 0) + 8 * Math.abs(Math.sin(ff / 2.4)) } : p })} />
            <A {...act(MARCUS, L.mesa + 450, { dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "neutral" }, { f: k(285.4), v: "risa" }] })} />
          </>}
          hud={<><H /><GloboRadioMano t="Penicillin… from bread?" desde={k(282.2)} hasta={k(285.0)} /><Txt t="THE QUESTION EVERYBODY ASKS" a={k(280.0)} b={k(282.2)} top={140} tam={52} chip /><Txt t="JUNE LAUGHS · FIRST TIME IN A WEEK" a={k(285.2)} b={k(287.6)} top={140} tam={48} chip color="#7ad08a" /><Txt t="HERE'S THE TRUTH" a={k(287.6)} b={k(288.7) + 4} top={140} tam={58} mano chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 34 · Fleming 1928 · diez años · tan poquito · murió cuando se acabó ============
const p34: PlanB = {
  a: 288.7, b: 295.0, trans: { tipo: "luz", d: 10 },
  sfx: [[288.8, "whoosh"], [289.8, "glass", -8], [291.3, "sparkle", -8], [291.8, "pop", -4], [293.0, "tick", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const halo = interpolate(f, [k(291.0), k(292.4)], [30, 120], cl);
      const z = interpolate(f, [0, k(295.0)], [1, 1.06], cl);
      return (
        <AbsoluteFill style={{ transform: `scale(${z})` }}>
          <Linea34 k={k} u={0}>
            <g transform="translate(760,470)">
              <ellipse rx={300} ry={110} fill="#e8f2f6" stroke="#8aa0b0" strokeWidth={6} /><ellipse rx={270} ry={92} fill="#f4ecd0" />
              {Array.from({ length: 22 }).map((_, i) => { const a = i * 2.6, d = 120 + (i % 4) * 30; const lejos = Math.hypot(Math.cos(a) * d, Math.sin(a) * d * 0.34) > halo + 20; return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d * 0.34} r={9} fill={lejos ? "#c8a050" : "#e8dcc0"} opacity={lejos ? 1 : 0.3} />; })}
              <ellipse rx={halo} ry={halo * 0.36} fill="#ffffff" opacity={0.55} />
              <ellipse rx={40 + 4 * Math.sin(f / 6)} ry={18} fill="#5a9a5a" /><circle cx={-12} cy={-4} r={9} fill="#7ac07a" /><circle cx={14} cy={4} r={7} fill="#7ac07a" />
            </g>
            <g transform="translate(1340,600)"><circle cy={-200} r={60} fill="#141018" /><circle cx={-18} cy={-206} r={14} fill="#fff" /><circle cx={18} cy={-206} r={14} fill="#fff" /><circle cx={-14} cy={-204} r={6} fill="#141018" /><circle cx={14} cy={-204} r={6} fill="#141018" /><path d="M-90,-120 Q0,-150 90,-120 L110,80 L-110,80 Z" fill="#f2f4f6" stroke="#8a96a4" strokeWidth={4} /><path d="M-60,-40 L-200,-80" stroke="#f2f4f6" strokeWidth={34} strokeLinecap="round" /><circle cx={-210} cy={-84} r={22} fill="#141018" /></g>
          </Linea34>
          <H />
          <Txt t="ALEXANDER FLEMING" a={k(288.9)} b={k(290.6)} top={140} tam={56} chip />
          <Txt t="PENICILLIN FROM MOLD · 1928" a={k(290.6)} b={k(293.0)} top={140} tam={54} mano chip color="#2f9a4a" />
          <Txt t="MOLD → ACTUAL MEDICINE?" a={k(293.0)} b={k(295.0) + 4} top={140} tam={54} chip color={AMBAR} />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

const Linea34: React.FC<{ k: (s: number) => number; u: number; children?: React.ReactNode }> = ({ k, u, children }) => {
  const f = useF();
  const X0 = 300, X1 = 1620, Y = 820;
  const dib = interpolate(f, [0, 10], [0, 1], cl);
  const anio = Math.round(1928 + 13 * u);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #f6eedc 0%, #e2d4b4 90%)" }}>
      <svg width={1920} height={1080}>
        <line x1={X0} y1={Y} x2={X0 + (X1 - X0) * dib} y2={Y} stroke="#5a4a3a" strokeWidth={8} strokeLinecap="round" />
        <line x1={X0} y1={Y} x2={X0 + (X1 - X0) * u} y2={Y} stroke="#2f9a4a" strokeWidth={14} strokeLinecap="round" />
        {[[X0, "1928"], [X1, "1941"]].map(([x, t]) => <g key={t as string}><circle cx={x as number} cy={Y} r={18} fill="#5a4a3a" /><text x={x as number} y={Y + 70} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill="#5a4a3a">{t}</text></g>)}
        {u > 0.02 && u < 0.98 && <g transform={`translate(${X0 + (X1 - X0) * u},${Y - 50})`}><rect x={-70} y={-40} width={140} height={56} rx={12} fill="#2f9a4a" /><text x={0} y={2} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff">{anio}</text></g>}
        {children}
      </svg>
    </AbsoluteFill>
  );
};

const p34b: PlanB = {
  a: 295.0, b: 299.8, trans: { tipo: "corte" },
  sfx: [[295.2, "page", -10], [295.6, "page", -10], [296.0, "page", -10], [296.4, "page", -10], [296.8, "page", -10], [297.2, "ding", -8], [298.2, "pop", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const u = interpolate(f, [k(295.2), k(297.2)], [0, 1], { ...cl, easing: (t) => t * (2 - t) });
      return (
        <AbsoluteFill>
          <Linea34 k={k} u={u}>
            {[0, 1, 2, 3].map((i) => { const e = interpolate(f, [k(295.4 + i * 0.3), k(295.4 + i * 0.3) + 6], [0, 1], cl); return <g key={i} opacity={e} transform={`translate(${620 + i * 230},${640 + (1 - e) * 60})`}><Figu x={0} y={0} s={1.9} color="#f2f4f6" f={f} i={i} camina /><rect x={-30} y={-150} width={60} height={40} rx={6} fill="#cfe8f2" stroke="#5a6a7a" strokeWidth={3} transform={`rotate(${10 * Math.sin(f / 8 + i)})`} /></g>; })}
            {f > k(298.0) && <g transform="translate(1620,560)"><rect x={-150} y={-60} width={300} height={100} rx={16} fill="#b8382c" /><text x={0} y={6} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#fff">1ST PATIENT</text></g>}
          </Linea34>
          <H />
          <Txt t="A TEAM OF SCIENTISTS" a={k(295.1)} b={k(296.9)} top={140} tam={56} chip />
          <Txt t="MORE THAN 10 YEARS" a={k(296.9)} b={k(299.8) + 4} top={140} tam={60} mano chip color={AMBAR} />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

const p34c: PlanB = {
  a: 299.8, b: 307.2, trans: { tipo: "corte" },
  sfx: [[300.0, "drip", -8], [301.7, "pour", -10], [302.4, "whoosh", -14], [303.2, "drip", -8], [304.0, "candle_out", -6], [304.8, "heart", -10], [305.4, "sad", -14]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const nivel = interpolate(f, [k(300.0), k(305.6)], [0.5, 0], cl);
      const ciclo = interpolate(f, [k(301.8), k(304.0)], [0, 1], cl);
      const muere = interpolate(f, [k(304.6), k(305.8)], [0, 1], cl);
      const oscuro = interpolate(f, [k(304.2), k(306.0)], [0, 0.55], cl);
      return (
        <AbsoluteFill style={{ background: "radial-gradient(circle at 45% 50%, #f2e8d2 0%, #c8b896 90%)" }}>
          <svg width={1920} height={1080}>
            <g transform="translate(620,700)">
              <rect x={-330} y={-40} width={660} height={60} rx={12} fill="#e9ecef" stroke="#6a7a8a" strokeWidth={5} /><rect x={-340} y={20} width={20} height={140} fill="#6a7a8a" /><rect x={320} y={20} width={20} height={140} fill="#6a7a8a" /><rect x={-330} y={-110} width={60} height={80} rx={14} fill="#f4f6f8" stroke="#6a7a8a" strokeWidth={4} />
              <g opacity={1 - muere} transform="translate(-60,-50) rotate(-90)"><Figu x={0} y={0} s={1.8} color="#8aa0c8" /></g>
              {muere > 0.5 && <path d="M-300,-60 Q0,-90 300,-60 L300,-30 L-300,-30 Z" fill="#f4f6f8" opacity={muere} />}
            </g>
            <g transform="translate(1250,420)"><rect x={-55} y={-120} width={110} height={180} rx={18} fill="#e8f2f6" stroke="#5a6a7a" strokeWidth={5} /><rect x={-48} y={60 - 170 * nivel} width={96} height={170 * nivel} rx={12} fill="#f2d27a" /><text x={0} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#5a4a3a">PENICILLIN</text></g>
            <g transform="translate(1250,830)" opacity={interpolate(f, [k(301.6), k(302.0)], [0, 1], cl)}><path d="M-60,-70 L60,-70 L50,60 L-50,60 Z" fill="#f2e2a0" stroke="#5a6a7a" strokeWidth={5} /><text x={0} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#5a4a3a">RECOVERED</text></g>
            {ciclo > 0 && <g fill="none" strokeWidth={10} strokeLinecap="round">
              <path d="M1180,470 Q900,460 760,600" stroke="#2f9a4a" strokeDasharray="30 20" strokeDashoffset={-f * 4} />
              <path d="M760,720 Q900,860 1180,830" stroke="#c8a050" strokeDasharray="30 20" strokeDashoffset={-f * 4} opacity={ciclo} />
              <path d="M1320,800 Q1420,620 1320,470" stroke="#2f9a4a" strokeDasharray="30 20" strokeDashoffset={-f * 4} opacity={ciclo} />
            </g>}
            <rect x={0} y={0} width={1920} height={1080} fill="#0a0810" opacity={oscuro} />
          </svg>
          <H />
          <Txt t="SO LITTLE OF THE DRUG" a={k(300.0)} b={k(301.7)} top={140} tam={56} chip color="#ff8a6a" />
          <Txt t="COLLECTED FROM HIS URINE · TO REUSE IT" a={k(301.7)} b={k(304.4)} top={140} tam={46} mano chip color={AMBAR} />
          <Txt t="THE SUPPLY RAN OUT · HE STILL DIED" a={k(304.4)} b={k(307.2) + 4} top={140} tam={48} chip />
        </AbsoluteFill>
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
          claves={[mira(0, GRANJA_PUNTOS.granero + 560, 640, 1.3), mira(k(314.5), GRANJA_PUNTOS.granero + 760, 300, 0.62, { curva: "inout" })]}
          medio={<>
            {[0, 1, 2].map((i) => <g key={i} transform={`translate(${GRANJA_PUNTOS.granero + 860 + i * 520},${P})`}><rect x={-200} y={-1400} width={400} height={1400} rx={40} fill="#3a3e4c" /><ellipse cy={-1400} rx={200} ry={40} fill="#4a4e5c" />{[0, 1, 2, 3].map((r) => <rect key={r} x={-200} y={-1200 + r * 300} width={400} height={10} fill="#2a2e3a" />)}</g>)}
            <A {...act(DEV, GRANJA_PUNTOS.granero + 520, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { hD: 100, cD: 20 } }, { f: k(311.6), v: "encogerse" }], caras: [{ f: 0, v: "duda" }, { f: k(311.6), v: "triste" }], enManoD: (ff: number) => ff < k(311.6) ? <PanMoho /> : null, luz: { lado: -1, color: "#ffcf6e", fuerza: 0.8 } })} />
          </>}
          hud={<><H /><Txt t="LABS · CHEMISTRY · HUGE TANKS" a={k(307.6)} b={k(311.0)} top={140} tam={52} chip /><Txt t="NOT IN A BARN. NOT YET." a={k(311.0)} b={k(314.5) + 4} top={140} tam={60} mano chip color={AMBAR} /></>} />
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
      ]} /><H /><Txt t="CAN'T REBUILD MODERN MEDICINE" a={k(317.2)} b={k(319.5)} top={140} tam={50} chip color="#ff8a6a" /><Txt t="CAN REBUILD WHAT CAME BEFORE IT" a={k(319.5)} b={k(322.0)} top={140} tam={50} chip color="#7ad08a" /></>;
      return (
        <Escena Set={Farmacia} pal={PAL} setProps={{ cinta: 1, vaciar: 0.5, oro: interpolate(f, [k(326.4), k(327.2)], [0, 1], cl) }} seed={536} mano={2}
          claves={[mira(0, FAR_PUNTOS.oro - 100, 560, 1.4), mira(k(328.2), FAR_PUNTOS.oro, 540, 1.7, { curva: "inout" })]}
          hud={<><H /><Candado k={k} /><Txt t="A PHARMACY TREATED LIKE GOLD" a={k(326.0)} b={k(328.2) + 4} top={140} tam={52} mano chip color="#e8c04a" /></>} />
      );
    };
    return <Pl />;
  },
};

// candado dorado que cae y se cierra
const Candado: React.FC<{ k: (s: number) => number }> = ({ k }) => {
  const f = useF();
  const y = interpolate(f, [k(326.4), k(326.7)], [-200, 0], { ...cl, easing: (t) => t * t });
  const cierra = interpolate(f, [k(326.7), k(326.9)], [30, 0], cl);
  return f > k(326.4) ? <svg width={1920} height={1080} style={{ position: "absolute" }}><g transform={`translate(960,${600 + y})`}>
    <Halo x={0} y={0} r={260} color="#ffd24a" fuerza={0.5} />
    <path d={`M-60,-40 L-60,${-110 - cierra} A60,60 0 0 1 60,${-110 - cierra} L60,-40`} stroke="#c8a030" strokeWidth={24} fill="none" />
    <rect x={-110} y={-50} width={220} height={180} rx={24} fill="#e8c04a" stroke="#8a6a1a" strokeWidth={8} /><circle cy={30} r={22} fill="#5a4010" /><rect x={-8} y={30} width={16} height={50} fill="#5a4010" />
  </g></svg> : null;
};

// ============ 37 · la regla más importante: no lastimarse (Theo baja de la escalera, Gus la sostiene) ============
const p37: PlanB = {
  a: 328.2, b: 335.2, trans: { tipo: "corte" },
  sfx: [[328.4, "chalk", -6], [330.0, "stairs", -10], [330.4, "creak", -6], [330.5, "gasp", -8], [330.8, "punch", -6], [331.0, "cloth", -8], [333.2, "laugh", -14]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Liv claves={f < k(329.8) ? [mira(0, GL_PIZARRA.x - 20, GL_PIZARRA.y + 200, 1.6), mira(k(329.8), GL_PIZARRA.x - 10, GL_PIZARRA.y + 200, 1.66)] : [mira(0, 260, 540, 1.3), mira(k(330.8), 260 + golpe(f, k(330.8), 10), 560, 1.4), mira(k(335.2), 240, 580, 1.5, { curva: "inout" })]}
          sp={{ farol: 1, reglas: [{ t: "1. FRESH FIRST", desde: -100 }, { t: "2. NOTHING RISKY ALONE", desde: -100 }, { t: "3. ONE THING…", desde: -100 }] }}
          medio={<>
            <Tiza d={`M${GL_PIZARRA.x + 10},${GL_PIZARRA.y + 78} h190`} f={f} desde={k(328.4)} dur={10} color="#b8382c" ancho={4} o={1} />
            <A {...act(THEO_CASA, 0, { ruta: [{ f: 0, x: 140, y: P - 380 }, { f: k(330.4), x: 140, y: P - 380 }, { f: k(330.8), x: 230, y: P - 140 }, { f: k(332.4), x: 230, y: P - 140 }, { f: k(333.2), x: 160, y: P }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "agarrarAlto" }, { f: k(330.4), v: { hD: 170, cD: 10, hI: 170, cI: 10, tronco: -20 } }, { f: k(330.8), v: "encogerse" }, { f: k(333.2), v: "parado" }], caras: [{ f: 0, v: "neutral" }, { f: k(330.4), v: "miedo" }, { f: k(333.2), v: "risa" }] })} />
            <A {...act(GUS, 300, { dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: k(330.4), v: { hD: 150, cD: 20, hI: 150, cI: 20, tronco: -10 } }, { f: k(330.8), v: { hD: 110, cD: 40, hI: 110, cI: 40, tronco: 10 } }, { f: k(333.2), v: "manosCintura" }], caras: [{ f: 0, v: "neutral" }, { f: k(330.4), v: "sorpresa" }, { f: k(333.2), v: "enojo" }] })} />
          </>}
          hud={<><H /><Txt t="RULE Nº 1: DON'T GET HURT" a={k(329.0)} b={k(331.6)} top={140} tam={56} mano chip color={AMBAR} /><Txt t="THE BEST MEDICINE LEFT: NOT NEEDING ANY" a={k(331.6)} b={k(335.2) + 4} top={140} tam={46} chip color="#7ad08a" /></>} />
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
          hud={<><H l={[dia(349)]} /><Txt t="DAY 349 · A COLD SEPTEMBER NIGHT" a={k(335.4)} b={k(338.9) + 4} top={140} tam={50} chip /></>} />
      );
      return (
        <Liv claves={[mira(0, 800, 600, 1.6), mira(k(340.8), L.mesa - 100, 600, 1.5, { curva: "inout" }), mira(k(343.0), L.mesa - 60, 590, 1.7, { curva: "inout" })]} sp={{ farol: 0, fuego: 0.4 }}
          medio={<>
            <A {...lily({ poses: [{ f: 0, v: { tronco: 40, pI: 80, rI: 70, pD: 86, rD: 74, hD: 30, cD: 120, hI: 20, cI: 110, cabeza: 30 } }], caras: [{ f: 0, v: "neutral" }] })} /><MantaLily color="#2f7f86" />
            <Ore x={1010} y={P} dir={-1} s={0.8} f={f} echado={0.9} />
            <Vela x={L.mesa + 100} y={P - 180} f={f} s={1.2} />
            <A {...act(JUNE, L.mesa - 140, { asiento: [{ f: 0, v: 60 }], poses: [{ f: 0, v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 80, cD: 20, hI: 25, cI: 50 } }], dir: [{ f: 0, v: 1 }], habla: [[k(341.0), k(343.0)]], caras: [{ f: 0, v: "cansado" }], luz: { lado: 1, color: "#ffc56a", fuerza: 1 } })} />
            {Array.from({ length: 11 }).map((_, i) => <Vial key={i} x={L.mesa - 40 + (i % 6) * 32} y={P - 182 - Math.floor(i / 6) * 60} s={0.65} />)}
            <Vial x={interpolate(f, [k(341.4), k(342.0)], [L.mesa + 120, L.mesa + 200], cl)} y={P - 182 - 60 + 60 * interpolate(f, [k(341.4), k(342.0)], [0, 1], cl)} s={0.65} />
          </>}
          hud={<><H l={[dosis([{ f: 0, v: 95 }, { f: k(341.6), v: 94, d: 8 }, { f: k(342.4), v: 93, d: 8 }]), dia(349)]} /><Txt t="LILY · ASLEEP · HEALTHY" a={k(338.9)} b={k(340.9)} top={140} tam={52} chip color="#7ad08a" /><Txt t="JUNE COUNTS DOSES BY CANDLELIGHT" a={k(340.9)} b={k(343.0) + 4} top={140} tam={48} chip /></>} />
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
          medio={<A {...act({ ...GUS, accesorios: [...(GUS.accesorios ?? []), { t: "auriculares", color: "#2a2a30" }] }, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: 12, pI: 88, rI: 88, pD: 92, rD: 92, hD: 80, cD: 50, hI: 25, cI: 50 } }, { f: k(350.5), v: { tronco: -24, pI: 88, rI: 88, pD: 92, rD: 92, hD: 160, cD: 20, hI: 150, cI: 30 } }, { f: k(351.6), v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 30, cD: 50, hI: 25, cI: 50 } }], caras: [{ f: 0, v: "cansado" }, { f: k(350.5), v: "sorpresa" }], miradas: [{ f: 0, v: { x: 1, y: 0.3 } }], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 } })} />}
          hud={<><H l={[dia(349)]} />
            <Txt t="UPSTAIRS · GUS · EVERY NIGHT" a={k(343.4)} b={k(346.0)} top={140} tam={50} chip />
            <Txt t="CALLING OUT INTO THE DARK" a={k(348.2)} b={k(350.3)} top={140} tam={50} chip />
            <Txt t="THIS TIME, SOMEONE ANSWERS" a={k(350.4)} b={k(352.2)} top={140} tam={54} mano chip color={AMBAR} />
            <Txt t="A WOMAN · CALM · CLEAR" a={k(352.2)} b={k(356.6) + 4} top={140} tam={54} chip color={AMBAR} /></>} />
      );
    };
    return <Pl />;
  },
};

// ============ 40 · «This is Abby, on Madeline Island» · el mapa · ¿cuántos son? · «One hundred.» ============
const p40: PlanB = {
  a: 356.6, b: 368.5, trans: { tipo: "corte" },
  sfx: [[356.7, "static", -18, { dur: 5 }], [357.4, "sparkle", -12], [359.0, "whoosh", -12], [359.6, "match", -12], [360.4, "match", -14], [361.6, "cloth", -8], [362.2, "ptt", -4], [365.4, "static", -10, { dur: 1.8 }], [367.2, "boom", -4], [367.3, "popcluster", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const partida = (f > k(359.0) && f < k(361.6)) || f > k(367.2);
      const n = f < k(366) ? Math.round(interpolate(f, [k(359.2), k(361.4)], [1, 38], cl)) : Math.round(interpolate(f, [k(367.3), k(368.3)], [38, 100], cl));
      const gus = (zoom: number) => (
        <Escena Set={RadioGus} pal={PAL} setProps={{ luzRadio: 1, aguja: 0.62, isla: interpolate(f, [k(357.2), k(358.0)], [0, 1], cl), linea: f > k(357.6) ? 1 : 0 }} seed={540} mano={2}
          claves={f < k(359.0)
            ? [mira(0, RG_PUNTOS.mapa, 360, 1.5), mira(k(359.0), RG_PUNTOS.mapa + 60, 350, 1.65, { curva: "inout" })]
            : [mira(0, RG_PUNTOS.radio - 100, 680, zoom), mira(k(368.5), RG_PUNTOS.radio - 150, 680, zoom + 0.15, { curva: "inout" })]}
          medio={<>
            <A {...act({ ...GUS, accesorios: [...(GUS.accesorios ?? []), { t: "auriculares", color: "#2a2a30" }] }, RG_PUNTOS.silla, { asiento: [{ f: 0, v: 60 }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 30, cD: 50, hI: 25, cI: 50 } }, { f: k(361.6), v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 25, cI: 50 } }, { f: k(367.3), v: { tronco: -10, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 130, hI: 150, cI: 20 } }], caras: [{ f: 0, v: "sorpresa" }, { f: k(362.0), v: "determinado" }, { f: k(365.4), v: "duda" }, { f: k(367.2), v: "sorpresa" }], habla: [[k(363.7), k(365.4)]], miradas: [{ f: 0, v: { x: 1, y: 0 } }], luz: { lado: 1, color: "#7dffb0", fuerza: 0.9 }, enManoD: (ff: number) => ff > k(361.6) ? <MicMano s={0.8} ptt={ff > k(362.2) && ff < k(365.4)} /> : null })} />
            <Ondas x={RG_PUNTOS.radio + 40} y={P - 400} on={f < k(361.6) || f > k(367.2) ? 1 : 0.3} />
          </>} />
      );
      return (
        <AbsoluteFill>
          {partida ? <Partida izq={gus(1.9)} der={<Isla n={n} />} /> : gus(2.2)}
          <HudC lineas={[POP(10), ...(f > k(357.6) ? [isla(f < k(367.2) ? [{ f: 0, v: 0 }, { f: k(359.2), v: n, d: 1 }] : n, k(357.6))] : [])]} />
          <Txt t="ABBY · MADELINE ISLAND" a={k(356.8)} b={k(359.0)} top={140} tam={52} chip color={AMBAR} />
          <GloboRadio t="We heard you. We've been counting too." x={1180} y={420} desde={k(359.0)} hasta={k(361.6)} />
          <GloboRadio t="How many of you are there?" x={820} y={420} desde={k(363.7)} hasta={k(365.4)} lado={-1} color="#f6ecd2" />
          <Txt t="A PAUSE… STATIC" a={k(365.4)} b={k(367.2)} top={140} tam={52} chip />
          <GloboRadio t="One hundred." x={1240} y={360} desde={k(367.2)} hasta={k(368.5) + 8} tam={70} />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};
export const Ondas: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => {
  const f = useF();
  return <g opacity={on}>{[0, 1, 2].map((i) => { const r = 40 + ((f * 3 + i * 40) % 120); return <path key={i} d={`M${x + r * 0.7},${y - r * 0.7} A${r},${r} 0 0 1 ${x + r * 0.7},${y + r * 0.7}`} stroke={AMBAR} strokeWidth={6} fill="none" opacity={1 - r / 160} />; })}</g>;
};
// la isla de noche: Abby en el muelle y la gente que va prendiendo faroles
const Isla: React.FC<{ n: number }> = ({ n }) => {
  const f = useF();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#0a1222 0%, #1a2a44 58%, #0c1828 58%, #060c16 100%)" }}>
      <svg width={1920} height={1080}>
        {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={480 + ((i * 197) % 960)} cy={60 + ((i * 89) % 480)} r={1.5 + (i % 3)} fill="#fff" opacity={0.4 + 0.3 * Math.sin(f / 10 + i)} />)}
        <g transform="translate(960,600) scale(1.8) translate(-960,-600)">
        <path d="M380,640 Q600,470 960,470 Q1320,470 1540,640 Z" fill="#1c2a24" />
        {Array.from({ length: 100 }).map((_, i) => {
          const x = 520 + (i % 25) * 36 + (Math.floor(i / 25) % 2) * 18, y = 545 + Math.floor(i / 25) * 26;
          const lit = i < n;
          return <g key={i}><Figu x={x} y={y} s={0.26} color="#2a3644" />{lit && <><circle cx={x + 7} cy={y - 26} r={14} fill="#ffc56a" opacity={0.25} /><circle cx={x + 7} cy={y - 26} r={4} fill="#ffd27a" /></>}</g>;
        })}
        </g>
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={560 + i * 70} y={690 + (i % 3) * 30} width={40 + (i % 2) * 30} height={4} fill="#ffc56a" opacity={0.12 * Math.min(1, n / 40)} />)}
        <rect x={920} y={640} width={80} height={240} fill="#4a3424" />
        <Figu x={960} y={860} s={1.3} color="#2f7f86" />
        <circle cx={1010} cy={760} r={46} fill="#ffc56a" opacity={0.3} /><rect x={998} y={748} width={24} height={30} rx={6} fill="#ffd27a" />
      </svg>
    </AbsoluteFill>
  );
};

// ============ 41 · cierre: ¿qué remedio salvarías? · suscribite · próximo: Madeline Island ============
const p41: PlanB = {
  a: 368.5, b: 379.74, trans: { tipo: "fundido", d: 10 },
  sfx: [[368.6, "sparkle", -10], [369.6, "glass", -10], [372.6, "page", -8], [373.4, "pop", -4], [376.3, "riser", -14, { dur: 2.5 }], [376.5, "waves", -18, { dur: 3 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(376.3)) return (
        <Liv claves={[mira(0, L.mesa - 220, 600, 1.9), mira(k(376.3), L.mesa - 210, 590, 2.05, { curva: "inout" })]} sp={{ farol: 0, fuego: 0.3 }}
          medio={<>
            <Halo x={L.mesa - 380} y={P - 330} r={460} color="#ffd27a" fuerza={0.7} />
            <A {...act(JUNE, L.mesa - 420, { dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { hD: 120, cD: 40, hI: 20, cI: 30 } }], caras: [{ f: 0, v: "neutral" }, { f: k(371.3), v: "duda" }, { f: k(373.6), v: "feliz" }], miradas: [{ f: 0, v: { x: 0.5, y: -0.3 } }, { f: k(371.3), v: { x: 0, y: 0 } }], luz: { lado: 1, color: "#ffd27a", fuerza: 1 }, enManoD: <g transform="translate(0,-20)"><Vial s={1.1} brillo={1} /></g> })} />
          </>}
          hud={<><HudC lineas={[POP(10), isla(100)]} />
            <Txt t="SAVE ONLY ONE MEDICINE…" a={k(368.6)} b={k(371.3)} top={140} tam={50} chip />
            <Txt t="WHICH ONE?" a={k(371.3)} b={k(373.6)} top={140} tam={66} mano chip color={AMBAR} />
            <Txt t="TELL ME IN THE COMMENTS" a={k(372.4)} b={k(376.3) + 4} top={240} tam={46} chip />
            <BotonSub desde={k(373.6)} top={860} /></>} />
      );
      return (
        <Escena Set={Granja} pal={PAL} setProps={{ hora: "ocaso", estacion: "invierno" }} seed={541} mano={1.5}
          claves={[mira(0, 4800, 420, 0.75), mira(k(379.74), 4880, 400, 0.8, { curva: "inout" })]}
          medio={<>{Array.from({ length: 100 }).map((_, i) => <Figu key={i} x={4250 + (i % 34) * 32 + (Math.floor(i / 34) % 2) * 16} y={P - 10 + Math.floor(i / 34) * 18} s={0.34} color={COLS[i % COLS.length]} f={f} i={i} />)}</>}
          hud={<><HudC lineas={[POP(10), isla(100)]} /><Proximo ep={6} titulo="Could 100 People Restart Humanity?" desde={k(376.5)} /></>} />
      );
    };
    return <Pl />;
  },
};

export const PLANOS_LC05: PlanB[] = [p00, p00b, p01, p02, p02b, p03, p04, p05, p06, p07, p08, p08b, p09, p10, p10b, p11, p11b, p12, p13, p13b, p13c, p13d, p14, p14b, p15, p15b, p16, p16b, p17, p17b, p17c, p17d, p18, p19, p19b, p19c, p19d, p20, p21, p22, p23, p24, p25, p26, p27, p27b, p28, p29, p30, p31, p32, p33, p34, p34b, p34c, p35, p36, p37, p38, p39, p40, p41];
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
