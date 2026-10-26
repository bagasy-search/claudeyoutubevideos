// ob06 · escenas r22–r28 rehechas (corazones, la Dr. Hale, el viaje, 60–100, el mensaje, el espejo, CTA).
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Escena } from "../anikit/escena";
import { Celular } from "../anikit/props";
import { PAL, OWEN, OWEN_CASA, DEE, ABRIGO, TINY, HALE, SENORA, OBRERO, ESTUDIANTE, SCRUBS, RUNNER, FUMADOR, RIM, VERDE } from "../owen/elenco";
import { ENFERMERA, TRAJE, pasajero } from "../owen/extras_b";
import { ROJO } from "../owen/cartel";
import { Persona } from "../owen/b/gente";
import { PlanB, Pizarra, GloboM, parado } from "../owen/b/lib";
import { Auto } from "../owen/mundo/bus";
import { Ashland, ASH_CARRIL } from "../owen/mundo/ashland";
import { TwoFlatCorte, TF_ARRIBA, TF_PUNTOS } from "../owen/mundo/twoflat";
import { Halden, HAL_PISO, HAL_PUNTOS } from "../owen/mundo/halden";
import { Descanso, DES_PISO, DES_PUNTOS } from "../owen/mundo/sala";
import { AMARILLO, cl, panza, corazon, Txt, CeluGrande, F_HUD } from "./comun6";
import { Torso, TextoW, Flecha, pop, tw, Barra, CorazonA, ECG, latido, BañoEspejo, Reflejo6, Comentario, BotonSub6 } from "./kit6";

const HP = HAL_PISO, A = TF_ARRIBA;
const S = HAL_PUNTOS.silla - 60;
const SENT = { pI: 85, rI: -80, pD: 88, rD: -85 };
const ESQ = HAL_PUNTOS.camilla + 260;
const BANDEJA = HAL_PUNTOS.mesa;
const GRIS = "#a35a5a";
const halden = { hora: "tarde" as const, tablet: "42 / 47" };

const Bandeja: React.FC = () => (
  <g transform={`translate(${BANDEJA},${HP - 222})`}>
    <rect x={-160} y={-14} width={320} height={16} rx={6} fill="#c9ced2" />
    {Array.from({ length: 8 }).map((_, i) => { const n = 39 + i; const fila = Math.floor(i / 3); return <g key={i} transform={`translate(${-96 + (i % 3) * 96},${-28 - fila * 34})`}><Barra n={n} s={0.5} /></g>; })}
  </g>
);
const SillaHombre: React.FC = () => (
  <g transform={`translate(${ESQ},${HP})`}><rect x={-60} y={-70} width={120} height={14} rx={5} fill="#8a96a4" /><rect x={-60} y={-200} width={14} height={140} rx={5} fill="#8a96a4" /><rect x={-54} y={-58} width={10} height={58} fill="#6a7684" /><rect x={44} y={-58} width={10} height={58} fill="#6a7684" /></g>
);
const owenSentado = (extra: Record<string, unknown> = {}) => ({
  look: OWEN, seed: 47, luz: RIM.clinica, ruta: [{ f: 0, x: S, y: HP }], dir: [{ f: 0, v: 1 as const }], asiento: [{ f: 0, v: 62 }], ...extra,
});
const hombre = (extra: Record<string, unknown> = {}) => ({
  look: ABRIGO, seed: 9, luz: { lado: -1 as const, color: "#b8c4cc", fuerza: 0.6 }, ruta: [{ f: 0, x: ESQ, y: HP }], dir: [{ f: 0, v: -1 as const }], asiento: [{ f: 0, v: 62 }],
  poses: [{ f: 0, v: { ...SENT, hD: 60, cD: 130 } }], caras: [{ f: 0, v: "neutral" }], ...extra,
});
// cabecitas en las ventanillas del auto (Dee maneja, Owen mira afuera)
const AutoConGente: React.FC<{ x: number; f: number; owenMira?: number }> = ({ x, f, owenMira = 1 }) => (
  <g>
    <g transform={`translate(${x},${ASH_CARRIL - 20})`}>
      <g transform="translate(58,-80)"><circle r={22} fill="#1d1f24" /><path d="M-24,-6 q24,-30 48,0 Z" fill="#7a3a2a" /><circle cx={8} cy={-2} r={6} fill="#fff" /><circle cx={9} cy={-2} r={3} fill="#111" /></g>
      <g transform="translate(-44,-80)"><circle r={22} fill="#1d1f24" /><path d="M-24,-8 q24,-30 48,0 l14,4 l-62,0 Z" fill="#2a3a7a" /><circle cx={-6 + owenMira * 6} cy={0} r={7} fill="#fff" /><circle cx={-6 + owenMira * 8} cy={0} r={3.5} fill="#111" /><circle cx={8 + owenMira * 6} cy={0} r={7} fill="#fff" /><circle cx={8 + owenMira * 8} cy={0} r={3.5} fill="#111" /></g>
    </g>
    <Auto x={x} y={ASH_CARRIL - 20} color="#3a6a9a" dir={1} rueda={x * 0.6} />
  </g>
);
// gente de la calle con corazón (x, look, bpm)
const GENTE: [number, any, number][] = [
  [1700, SENORA, 104], [1900, OBRERO, 118], [2120, ESTUDIANTE, 96], [2320, SCRUBS, 122], [2560, RUNNER, 88], [2780, FUMADOR, 131], [3000, TRAJE, 140],
  [3260, pasajero(6), 109], [3480, pasajero(8), 115], [3700, SENORA, 126], [3920, OBRERO, 112], [4140, ESTUDIANTE, 134], [4360, SCRUBS, 119], [4580, TRAJE, 142], [4800, pasajero(3), 101],
];
const Gente: React.FC<{ desde: number; desdeX?: number; hastaX?: number; tam?: number }> = ({ desde, desdeX = 0, hastaX = 99999, tam = 46 }) => (
  <>{GENTE.filter(([x]) => x >= desdeX && x <= hastaX).map(([x, l, b], i) => <Persona key={x} {...parado(l, x, ASH_CARRIL - 80, { seed: 640 + i, dir: [{ f: 0, v: i % 2 ? 1 : -1 }], cartel: corazon(b, { tam, desde: desde + i * 3 }) })} />)}</>
);

// ====================== r22 · lleno ======================
export const r22: PlanB = {
  a: 309.98, b: 312.0, trans: { tipo: "corte" },
  sfx: [[310.0, "sparkle", -6], [310.6, "pop", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Halden} pal={PAL} setProps={halden} seed={6220} mano={1}
          claves={[mira(0, S + 120, 640, 2.3), mira(k(312.0), S + 120, 640, 2.45)]}
          medio={<>
            <Bandeja />
            <Persona {...owenSentado({ poses: [{ f: 0, v: { ...SENT, hD: 20, cD: 110, hI: 20, cI: 110, tronco: -4 } }, { f: k(311.0), v: { ...SENT, hD: 24, cD: 116, hI: 24, cI: 116, tronco: -10, cabeza: -10 } }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.4, y: -0.3 } }],
              cartel: panza({ texto: "FULL", color: VERDE, tam: 30, dy: -10 }) })} />
            <TextoW x={S + 330} y={560} t="FULL." tam={46} color={VERDE} borde="#0f2a26" f={f} desde={k(310.3)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// el cuarto cambia (destello rojo, ondas)
export const r22b: PlanB = {
  a: 312.0, b: 314.96, trans: { tipo: "corte" },
  sfx: [[312.0, "glitch", -2], [312.4, "boom", -4], [313.0, "riser", -8, { dur: 1.8 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const rojo = interpolate(f, [0, 3, 14, k(314.96)], [0, 0.45, 0.16, 0.12], cl);
      return (
        <Escena Set={Halden} pal={PAL} setProps={halden} seed={6221} mano={1}
          claves={[mira(0, S + 120, 640, 2.4), mira(4, S + 120, 640, 2.9, { resorte: { damping: 8, stiffness: 180 } }), mira(k(313.3), S + 380, 620, 1.35, { curva: "inout" }), mira(k(314.96), S + 380, 620, 1.4)]}
          medio={<>
            <Bandeja />
            <Persona {...owenSentado({ poses: [{ f: 0, v: { ...SENT, hD: 20, cD: 110, hI: 20, cI: 110 } }, { f: 6, v: { ...SENT, hD: 60, cD: 40, hI: 60, cI: 40, tronco: -8 } }], caras: [{ f: 0, v: "sorpresa" }],
              miradas: [{ f: 0, v: { x: 0, y: -1 } }, { f: k(312.8), v: { x: -1, y: 0 } }, { f: k(313.6), v: { x: 1, y: 0 } }] })} />
            {[0, 1, 2].map((i) => { const u = ((f - i * 8) % 30) / 30; if (f < i * 8) return null; return <circle key={i} cx={S} cy={700} r={60 + u * 520} fill="none" stroke={ROJO} strokeWidth={8 * (1 - u)} opacity={(1 - u) * 0.8} />; })}
            <TextoW x={S + 380} y={460} t="THE ROOM CHANGES" tam={44} color={ROJO} borde="#ffffff" f={f} desde={k(313.4)} />
          </>}
          hud={<AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, rgba(255,74,90,0) 35%, rgba(255,74,90,${rojo}) 100%)` }} />} />
      );
    };
    return <Pl />;
  },
};
// entra la enfermera: aparece un corazón rojo
export const r22c: PlanB = {
  a: 314.96, b: 319.26, trans: { tipo: "corte" },
  sfx: [[315.0, "door", -6], [315.6, "step", -6], [316.2, "step", -6], [316.8, "step", -6], [317.2, "pop", 0], [317.4, "heart1", -4], [318.4, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Halden} pal={PAL} setProps={halden} seed={6222} mano={1}
          claves={[mira(0, S + 300, 620, 1.45), mira(k(317.2), S + 380, 600, 1.8, { curva: "inout" }), mira(k(319.26), S + 390, 600, 1.85)]}
          medio={<>
            <Bandeja />
            <Persona {...owenSentado({ poses: [{ f: 0, v: { ...SENT, hD: 20, cD: 60 } }], caras: [{ f: 0, v: "sorpresa" }, { f: k(317.3), v: "miedo" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }, { f: k(317.3), v: { x: 1, y: -0.8 } }] })} />
            <Persona look={ENFERMERA} seed={98} luz={RIM.clinica} ruta={[{ f: 0, x: S + 980, y: HP }, { f: k(315.2), x: S + 980, y: HP }, { f: k(317.0), x: S + 440, y: HP }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 30, cD: 70 } }]} caras={[{ f: 0, v: "feliz" }]}
              enManoD={() => <g transform="rotate(-10)"><rect x={-34} y={-46} width={68} height={92} rx={10} fill="#20242c" /><rect x={-28} y={-40} width={56} height={80} rx={5} fill="#eaf2ff" /></g>}
              cartel={f > k(317.2) ? corazon(98, { tam: 36, desde: k(317.2) }) : undefined} />
            <TextoW x={S + 700} y={600} t="A RED HEART" tam={40} color={ROJO} borde="#ffffff" f={f} desde={k(317.5)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// 98, latiendo: primer plano con el electro
export const r22d: PlanB = {
  a: 319.26, b: 322.06, trans: { tipo: "corte" },
  sfx: [[319.3, "heart1", -2], [319.9, "heart1", -4], [320.5, "heart1", -4], [321.1, "heart1", -4], [321.7, "heart1", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Halden} pal={PAL} setProps={halden} seed={6223} mano={1}
          claves={[mira(0, S + 560, 600, 2.3), mira(k(322.06), S + 560, 600, 2.5)]}
          medio={<>
            <Persona look={ENFERMERA} seed={98} luz={RIM.clinica} ruta={[{ f: 0, x: S + 440, y: HP }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 25, cD: 60 } }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.6 } }]}
              enManoD={() => <g transform="rotate(-30)"><rect x={-34} y={-46} width={68} height={92} rx={10} fill="#20242c" /><rect x={-28} y={-40} width={56} height={80} rx={5} fill="#eaf2ff" /></g>}
              cartel={corazon(98, { tam: 36 })} />
            <g transform={`translate(${S + 700},${640})`}>
              <rect x={-110} y={-70} width={220} height={140} rx={16} fill="#0b1014" stroke={ROJO} strokeWidth={5} />
              <ECG x={-96} y={30} w={192} h={30} f={f} bpm={98} grosor={5} />
              <text y={-22} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#ff6a5a" textAnchor="middle" opacity={0.6 + 0.4 * latido(f, 98)}>98 BPM</text>
            </g>
          </>} />
      );
    };
    return <Pl />;
  },
};
// thump · thump · thump en sus oídos, al ritmo del corazón de ella
export const r22e: PlanB = {
  a: 322.06, b: 327.36, trans: { tipo: "corte" },
  sfx: [[322.1, "heart", -4, { dur: 5.2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const dos = f > k(324.7);
      const per = 30 * 60 / 98;
      const beat = Math.floor(f / per);
      const u = (f % per) / per;
      return (
        <Escena Set={Halden} pal={PAL} setProps={halden} seed={6224} mano={1}
          claves={dos ? [mira(k(324.7), S + 220, 640, 1.55), mira(k(327.36), S + 220, 640, 1.62)] : [mira(0, S + 60, 700, 3.0), mira(k(324.7), S + 60, 700, 3.15)]}
          medio={<>
            <Bandeja />
            <Persona {...owenSentado({ poses: [{ f: 0, v: { ...SENT, hD: 150, cD: 150, hI: 20, cI: 40, cabeza: -6 } }], caras: [{ f: 0, v: "miedo" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }] })} />
            <Persona look={ENFERMERA} seed={98} luz={RIM.clinica} ruta={[{ f: 0, x: S + 440, y: HP }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 30, cD: 70 } }]} caras={[{ f: 0, v: "feliz" }]} cartel={corazon(98, { tam: 36 })} />
            {/* anillos en el oído al ritmo de 98 */}
            {[0, 1].map((i) => { const v = (u + i * 0.5) % 1; return <circle key={i} cx={S - 14} cy={704} r={20 + v * 70} fill="none" stroke={ROJO} strokeWidth={5 * (1 - v)} opacity={1 - v} />; })}
            {!dos && <TextoW x={S + 200 + (beat % 3) * 30} y={770 - (beat % 3) * 20} t="thump" tam={26} color={ROJO} borde="#ffffff" mano f={f} desde={beat * per} />}
            {dos && Array.from({ length: 5 }).map((_, i) => { const p = ((f / per) + i / 5) % 1; const x = S + 440 - p * 440, y = 520 + Math.sin(p * Math.PI) * -60 + p * 180; return <path key={i} d="M0,6 C-13,-3 -10,-15 -3,-13 C0,-12 0,-10 0,-9 C0,-10 0,-12 3,-13 C10,-15 13,-3 0,6 Z" transform={`translate(${x},${y}) scale(2)`} fill={ROJO} opacity={0.85} />; })}
            {dos && <TextoW x={S + 220} y={470} t="IN TIME WITH HER HEART" tam={36} color={ROJO} borde="#ffffff" f={f} desde={k(324.8)} />}
          </>} />
      );
    };
    return <Pl />;
  },
};
// el hombre del abrigo: 41, apenas vivo, lento como un reloj
export const r22f: PlanB = {
  a: 327.36, b: 332.52, trans: { tipo: "corte" },
  sfx: [[327.4, "heart1", -6], [328.9, "heart1", -6], [330.0, "tick", -4], [330.4, "heart1", -6], [331.4, "suspense", -8], [331.9, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const cerca = f > k(329.4);
      const pend = Math.sin((f / 30) * Math.PI * (41 / 60)) * 26;
      return (
        <Escena Set={Halden} pal={PAL} setProps={halden} seed={6225} mano={1}
          claves={[mira(0, ESQ - 500, 640, 1.15), mira(k(328.9), ESQ - 480, 640, 1.18), mira(k(329.4), ESQ + 60, 620, 2.1, { curva: "inout" }), mira(k(332.52), ESQ + 60, 620, 2.2)]}
          medio={<>
            <Bandeja />
            <Persona {...owenSentado({ poses: [{ f: 0, v: { ...SENT, hD: 10, cD: 20 } }], caras: [{ f: 0, v: "miedo" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }] })} />
            <SillaHombre />
            <Persona {...hombre({ caras: [{ f: 0, v: "cansado" }], cartel: corazon(41, { tam: 36, desde: k(327.6), color: GRIS }) })} />
            {cerca && <g transform={`translate(${ESQ + 300},${640}) scale(${pop(f, k(329.6))})`}>
              <rect x={-60} y={-90} width={120} height={200} rx={14} fill="#6a4630" stroke="#3a2a1a" strokeWidth={5} />
              <circle cy={-34} r={44} fill="#f4efe4" stroke="#3a2a1a" strokeWidth={4} />
              <path d="M0,-34 L0,-64 M0,-34 L22,-26" stroke="#2a2a2a" strokeWidth={5} strokeLinecap="round" />
              <g transform={`translate(0,20) rotate(${pend})`}><path d="M0,0 L0,60" stroke="#c9a64a" strokeWidth={5} /><circle cy={64} r={14} fill="#c9a64a" /></g>
            </g>}
            {cerca && <ECG x={ESQ + 120} y={800} w={300} h={36} f={f} bpm={41} color={GRIS} grosor={5} />}
            <TextoW x={ESQ + (cerca ? 300 : -260)} y={cerca ? 470 : 480} t={cerca ? "SLOW AS A CLOCK" : "41 · BARELY ALIVE"} tam={cerca ? 32 : 40} color={GRIS} borde="#ffffff" f={f} desde={k(cerca ? 329.6 : 327.8)} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r23 · la Dr. Hale: sonrisa, 132 ======================
export const r23: PlanB = {
  a: 332.52, b: 337.22, trans: { tipo: "corte" },
  sfx: [[332.6, "door", -6], [333.2, "step", -4], [333.8, "step", -4], [334.4, "step", -4], [335.2, "sparkle", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Halden} pal={PAL} setProps={halden} seed={6230} mano={1}
          claves={[mira(0, S + 360, 620, 1.3), mira(k(335.0), S + 400, 600, 1.7, { curva: "inout" }), mira(k(337.22), S + 400, 600, 1.75)]}
          medio={<>
            <Bandeja />
            <Persona {...owenSentado({ poses: [{ f: 0, v: { ...SENT, hD: 10, cD: 20 } }], caras: [{ f: 0, v: "miedo" }], miradas: [{ f: 0, v: { x: 1, y: -0.3 } }] })} />
            <Persona look={HALE} seed={66} luz={RIM.clinica} ruta={[{ f: 0, x: S + 1100, y: HP }, { f: k(335.0), x: S + 560, y: HP }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 30, cD: 80 } }]} caras={[{ f: 0, v: "feliz" }]}
              enManoD={() => <g transform="rotate(-10)"><rect x={-34} y={-46} width={68} height={92} rx={10} fill="#20242c" /><rect x={-28} y={-40} width={56} height={80} rx={5} fill="#eaf2ff" /></g>} />
            <TextoW x={S + 560} y={430} t={f < k(334.4) ? "DR. IMANI HALE" : "WARM SMILE · PERFECT CALM"} tam={36} color="#2a6fd6" borde="#ffffff" f={f} desde={k(333.2)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
export const r23b: PlanB = {
  a: 337.22, b: 341.46, trans: { tipo: "corte" },
  sfx: [[337.2, "boom", -6], [337.4, "heart", -2, { dur: 4 }], [339.6, "gasp", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const owen = f > k(339.6);
      return (
        <Escena Set={Halden} pal={PAL} setProps={halden} seed={6231} mano={1}
          claves={owen ? [mira(k(339.6), S + 140, 640, 2.4), mira(k(341.46), S + 140, 640, 2.55)] : [mira(0, S + 700, 600, 2.2), mira(k(339.6), S + 700, 600, 2.4)]}
          medio={<>
            <Bandeja />
            <Persona {...owenSentado({ poses: [{ f: 0, v: { ...SENT, hD: 20, cD: 120, hI: 20, cI: 120 } }], caras: [{ f: 0, v: "sorpresa" }], miradas: [{ f: 0, v: { x: 1, y: -1 } }] })} />
            <Persona look={HALE} seed={66} luz={RIM.clinica} ruta={[{ f: 0, x: S + 560, y: HP }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 30, cD: 80 } }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: -1, y: 0.4 } }]}
              enManoD={() => <g transform="rotate(-10)"><rect x={-34} y={-46} width={68} height={92} rx={10} fill="#20242c" /><rect x={-28} y={-40} width={56} height={80} rx={5} fill="#eaf2ff" /></g>}
              cartel={corazon(132, { tam: 38, desde: k(337.3) })} />
            {!owen && <g transform={`translate(${S + 820},${640}) scale(${pop(f, k(337.6))})`}>
              <rect x={-120} y={-80} width={240} height={160} rx={16} fill="#0b1014" stroke={ROJO} strokeWidth={5} />
              <ECG x={-104} y={20} w={208} h={44} f={f * 1.6} bpm={132} grosor={5} />
              <text y={-30} fontFamily={F_HUD} fontWeight={600} fontSize={32} fill="#ff6a5a" textAnchor="middle">RACING</text>
            </g>}
            {owen && <TextoW x={S + 330} y={560} t="132?!" tam={44} color={ROJO} borde="#ffffff" f={f} desde={k(339.8)} />}
          </>} />
      );
    };
    return <Pl />;
  },
};
export const r23c: PlanB = {
  a: 341.46, b: 346.16, trans: { tipo: "corte" },
  sfx: [[341.5, "pop", -4], [343.8, "pop", -6], [344.6, "chair", -6], [345.2, "suspense", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const parado = f > k(344.6);
      return (
        <Escena Set={Halden} pal={PAL} setProps={halden} seed={6232} mano={1}
          claves={[mira(0, S + 300, 600, 1.55), mira(k(346.16), S + 300, 600, 1.62)]}
          medio={<>
            <Bandeja />
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: S, y: HP }, { f: k(344.6), x: S, y: HP }, { f: k(345.6), x: S + 120, y: HP }]} dir={[{ f: 0, v: 1 }]}
              asiento={[{ f: 0, v: 62 }, { f: k(344.6), v: 62 }, { f: k(345.0), v: 0 }]}
              poses={parado ? [{ f: 0, v: "encogerse" }] : [{ f: 0, v: { ...SENT, hD: 10, cD: 20 } }]} caras={[{ f: 0, v: "miedo" }, { f: k(343.9), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: -0.4 } }]} />
            <Persona look={HALE} seed={66} luz={RIM.clinica} ruta={[{ f: 0, x: S + 560, y: HP }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 30, cD: 80 } }, { f: k(343.8), v: { hD: 80, cD: 20 } }]} caras={[{ f: 0, v: "feliz" }]} habla={[[k(341.5), k(343.7)], [k(343.8), k(346.0)]]}
              enManoI={<g transform="rotate(-10)"><rect x={-34} y={-46} width={68} height={92} rx={10} fill="#20242c" /><rect x={-28} y={-40} width={56} height={80} rx={5} fill="#eaf2ff" /></g>}
              cartel={corazon(132, { tam: 34 })} />
            <GloboM x={S + 470} y={560} texto={"Everything looks\nwonderful."} desde={k(341.5)} hasta={k(343.75)} tam={28} lado={-1} />
            <GloboM x={S + 470} y={560} texto={"Participant 47,\nyou can go."} desde={k(343.8)} hasta={k(346.16)} tam={28} lado={-1} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r24 · afuera: Dee, 18 minutos, 112; el viaje lleno de corazones ======================
const EDIF = 1500;
const EdificioBlanco: React.FC = () => (
  <g transform={`translate(${EDIF},${ASH_CARRIL - 80})`}>
    <rect x={-330} y={-1100} width={660} height={1100} fill="#f4f6f8" stroke="#c9d0d8" strokeWidth={6} />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-280 + (i % 4) * 150} y={-1040 + Math.floor(i / 4) * 230} width={110} height={150} fill="#cfdce6" />)}
    <rect x={-70} y={-260} width={140} height={260} fill="#9fb0bc" /><rect x={-4} y={-260} width={8} height={260} fill="#f4f6f8" />
  </g>
);
export const r24: PlanB = {
  a: 346.16, b: 350.34, trans: { tipo: "barrido", d: 10 },
  sfx: [[346.2, "door", -6], [346.9, "street", -14, { dur: 3.4 }], [347.4, "step", -6], [348.0, "step", -6], [348.6, "step", -6], [349.2, "step", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "ocaso", centro: () => 1300, autos: 1 }} seed={6240} mano={1.5}
          claves={[mira(0, 1320, 840, 1.25), mira(k(350.34), 1260, 860, 1.5, { curva: "inout" })]}
          medio={<>
            <EdificioBlanco />
            <Persona look={DEE} seed={30} luz={RIM.sol} ruta={[{ f: 0, x: 1060, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: "celular" }]} caras={[{ f: 0, v: "miedo" }]} miradas={[{ f: 0, v: { x: 0.4, y: 1 } }, { f: k(348.6), v: { x: 1, y: 0 } }]}
              enManoD={<Celular s={0.9} brillo="#7ab8ff" />} />
            <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: EDIF, y: ASH_CARRIL - 80 }, { f: k(346.6), x: EDIF, y: ASH_CARRIL - 80 }, { f: k(349.6), x: 1260, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: -1 }]}
              opacidad={(ff: number) => interpolate(ff, [0, 8], [0, 1], cl)} caras={[{ f: 0, v: "cansado" }]} />
            <AutoConGente x={840} f={f} />
            <TextoW x={1060} y={650} t="DEE · ALREADY WAITING" tam={36} color={AMARILLO} borde="#2a1a12" f={f} desde={k(346.8)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
export const r24b: PlanB = {
  a: 350.34, b: 353.84, trans: { tipo: "corte" },
  sfx: [[350.3, "pop", 0], [350.6, "tick", -6], [351.6, "heart", -6, { dur: 2 }], [352.4, "gasp", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "ocaso", centro: () => 1200, autos: 1 }} seed={6241} mano={1.5}
          claves={[mira(0, 1180, 880, 1.85), mira(k(353.84), 1180, 880, 1.95)]}
          medio={<>
            <EdificioBlanco />
            <Persona look={DEE} seed={30} luz={RIM.sol} ruta={[{ f: 0, x: 1060, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 100, cD: 40 } }, { f: k(351.6), v: { hD: 20, cD: 120, hI: 20, cI: 120 } }]} caras={[{ f: 0, v: "miedo" }, { f: k(351.7), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]}
              enManoD={(ff: number) => ff < k(351.6) ? <Celular s={0.9} brillo="#7ab8ff" /> : null}
              cartel={f > k(351.6) ? corazon(112, { tam: 36, desde: k(351.6) }) : undefined} />
            <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: 1290, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "cansado" }, { f: k(351.7), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(351.7), v: { x: -1, y: -0.8 } }]} />
            <g transform={`translate(${1180},${700}) scale(${pop(f, k(350.4)) * (f > k(351.6) ? 0.8 : 1)})`} opacity={f > k(351.6) ? 0.85 : 1}>
              <rect x={-130} y={-56} width={260} height={112} rx={22} fill="#0b1014" stroke={VERDE} strokeWidth={6} />
              <text y={26} fontFamily={F_HUD} fontWeight={600} fontSize={72} fill={VERDE} textAnchor="middle">18 MIN</text>
            </g>
          </>} />
      );
    };
    return <Pl />;
  },
};
// el viaje por Ashland: todos con corazón
const carX = (f: number, x0: number, v: number) => x0 + f * v;
export const r24c: PlanB = {
  a: 353.84, b: 357.3, trans: { tipo: "corte" },
  sfx: [[353.9, "car_door", -4], [354.4, "bus_engine", -16, { dur: 3 }], [355.0, "heart1", -6], [355.6, "heart1", -6], [356.2, "heart1", -6], [356.8, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = carX(f, 1300, 18);
      const fin = carX(k(357.3), 1300, 18);
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "ocaso", centro: () => x, autos: 0, paradas: [{ x: 2400, num: 26, refugio: true }] }} seed={6242} mano={2}
          claves={[mira(0, 1500, 900, 1.3), mira(k(357.3), fin + 220, 900, 1.3)]}
          medio={<>
            <Gente desde={k(354.4)} hastaX={3300} />
            <AutoConGente x={x} f={f} owenMira={-0.2} />
          </>}
          hud={<Txt t="every person they pass" a={k(354.2)} b={k(357.3) + 4} f={f} top={940} tam={52} mano chip />} />
      );
    };
    return <Pl />;
  },
};
export const r24d: PlanB = {
  a: 357.3, b: 360.72, trans: { tipo: "corte" },
  sfx: [[357.4, "heart1", -6], [358.0, "heart1", -6], [358.6, "heart1", -6], [359.2, "heart1", -6], [359.8, "heart1", -6], [360.4, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = carX(f, 3200, 12);
      const fin = carX(k(360.72), 3200, 12);
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "ocaso", centro: () => x, autos: 0, paradas: [{ x: 3900, num: 24, refugio: true }] }} seed={6243} mano={2}
          claves={[mira(0, 3400, 960, 1.65), mira(k(360.72), fin + 200, 960, 1.65)]}
          medio={<>
            <Gente desde={0} desdeX={3000} tam={42} />
            <AutoConGente x={x} f={f} owenMira={-0.4} />
          </>}
          hud={<Txt t="every person at every bus stop" a={k(357.4)} b={k(360.72) + 4} f={f} top={940} tam={52} mano chip />} />
      );
    };
    return <Pl />;
  },
};
export const r24e: PlanB = {
  a: 360.72, b: 363.08, trans: { tipo: "corte" },
  sfx: [[360.7, "heart", -6, { dur: 2.3 }], [361.2, "popcluster", -10, { dur: 1.4 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "ocaso", centro: () => 3800, autos: 0, paradas: [{ x: 3900, num: 24, refugio: true }] }} seed={6244} mano={2}
          claves={[mira(0, 3700, 880, 1.05), mira(k(363.08), 3700, 880, 0.98)]}
          medio={<>
            <Gente desde={0} desdeX={2700} tam={50} />
            <AutoConGente x={2950} f={f} owenMira={1} />
            {f > k(360.9) && <g opacity={tw(f, k(360.9), k(361.1))}><g transform={`translate(3700,520)`}><rect x={-430} y={-52} width={860} height={104} rx={20} fill="#0b1014" stroke={ROJO} strokeWidth={5} opacity={0.92} /><text y={18} fontFamily={F_HUD} fontWeight={600} fontSize={52} fill="#f4efe4" textAnchor="middle">ALMOST ALL OF THEM: FAST</text></g></g>}
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r25 · 60–100; hormonas del estrés; la ciudad asustada ======================
export const r25: PlanB = {
  a: 363.08, b: 369.04, trans: { tipo: "luz", d: 12 },
  sfx: [[363.1, "whoosh"], [364.4, "heart1", -6], [365.4, "roll", -4, { dur: 1.4 }], [366.8, "ding", -6], [367.6, "heart1", -6], [368.4, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const X0 = 240, X1 = 1140, lo = 40, hi = 140;
      const px = (b: number) => X0 + ((b - lo) / (hi - lo)) * (X1 - X0);
      const banda = tw(f, k(365.4), k(366.6));
      const marca = interpolate(f, [k(366.6), k(367.6)], [130, 72], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#141c24", luz: "#7ab8ff" }} seed={6250} mano={1}
          claves={[mira(0, 960, 540, 1.0), mira(k(369.04), 960, 540, 1.04)]}
          medio={<>
            <CorazonA x={600} y={470} s={0.8} f={f} bpm={72} />
            <TextoW x={690} y={190} t={f < k(363.9) ? "WHY IT MATTERS" : "NORMAL RESTING HEART RATE"} tam={46} color="#f4efe4" f={f} desde={2} />
            {f > k(364.0) && <TextoW x={1140} y={460} t="60–100" tam={84} color={VERDE} f={f} desde={k(364.0)} />}
            {f > k(364.0) && <TextoW x={1140} y={540} t="BEATS PER MINUTE" tam={34} color="#9fdcff" f={f} desde={k(364.4)} />}
            {/* la regla de 40 a 140 con la banda verde */}
            <g opacity={tw(f, k(365.0), k(365.4))}>
              <rect x={X0} y={820} width={X1 - X0} height={30} rx={15} fill="#2a3440" />
              <rect x={px(60)} y={820} width={(px(100) - px(60)) * banda} height={30} rx={15} fill={VERDE} />
              {[60, 100].map((b) => <text key={b} x={px(b)} y={900} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#f4efe4" textAnchor="middle">{b}</text>)}
              {f > k(366.6) && <g transform={`translate(${px(marca)},812)`}><path d="M-18,-34 L18,-34 L0,0 Z" fill={AMARILLO} /><text y={-46} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill={AMARILLO} textAnchor="middle">{Math.round(marca)}</text></g>}
            </g>
            <Persona look={OWEN} seed={47} escala={1.5} luz={{ lado: -1, color: "#9fdcff", fuerza: 0.7 }} ruta={[{ f: 0, x: 1600, y: 1000 }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: "saludar" }, { f: k(364.0), v: "señalar" }, { f: k(366.6), v: { hD: 120, cD: 10 } }]} caras={[{ f: 0, v: "determinado" }, { f: k(366.8), v: "feliz" }]} habla={[[2, k(363.9)]]} />
          </>} />
      );
    };
    return <Pl />;
  },
};
const TX = 760, TY = 640, TS = 0.92;
export const r25b: PlanB = {
  a: 369.04, b: 374.92, trans: { tipo: "corte" },
  sfx: [[369.0, "riser", -8, { dur: 2 }], [369.6, "popcluster", -8, { dur: 1.6 }], [371.0, "heart", -4, { dur: 3.8 }], [372.6, "whoosh"]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const bpm = interpolate(f, [k(370.6), k(373.0)], [72, 128], cl);
      const sube = tw(f, k(369.6), k(371.2));
      const corX = TX + 40 * TS, corY = TY - 168 * TS;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1e1418", luz: ROJO }} seed={6251} mano={1}
          claves={[mira(0, 960, 540, 1.0), mira(k(374.92), 960, 540, 1.05)]}
          medio={<>
            <Torso x={TX} y={TY} s={TS} f={f} cara={f < k(369.5) ? "duda" : "miedo"} gorra est={{ acido: 0.2 }} corazon={1} bpm={bpm} />
            {/* las suprarrenales y las hormonas que suben al corazón */}
            {[-1, 1].map((l) => <ellipse key={l} cx={TX + l * 80} cy={TY + 40} rx={34} ry={22} fill={AMARILLO} opacity={0.4 + 0.6 * tw(f, 4, 14)} stroke="#2a1a12" strokeWidth={3} />)}
            {Array.from({ length: 16 }).map((_, i) => {
              const l = i % 2 ? 1 : -1;
              const u = Math.min(1, Math.max(0, sube * 1.5 - (i / 16) * 0.5));
              if (u <= 0) return null;
              const x = TX + l * 80 + (corX - TX - l * 80) * u + Math.sin(f / 6 + i) * 6, y = TY + 40 + (corY - TY - 40) * u;
              return <circle key={i} cx={x} cy={y} r={11} fill={AMARILLO} stroke="#2a1a12" strokeWidth={3} opacity={u < 1 ? 1 : 0.5} />;
            })}
            <CorazonA x={corX} y={corY} s={0.22} f={f} bpm={bpm} />
            <TextoW x={1400} y={260} t={f < k(372.6) ? "STRESS HORMONES" : "READY FOR DANGER"} tam={56} color={AMARILLO} f={f} desde={k(369.5)} />
            <TextoW x={1400} y={560} t={`${Math.round(bpm)} BPM`} tam={110} color={bpm > 100 ? ROJO : VERDE} f={f} desde={k(370.4)} />
            {f > k(370.4) && <ECG x={1110} y={760} w={580} h={70} f={f} bpm={bpm} color={bpm > 100 ? ROJO : VERDE} />}
          </>} />
      );
    };
    return <Pl />;
  },
};
export const r25c: PlanB = {
  a: 374.92, b: 377.98, trans: { tipo: "corte" },
  sfx: [[374.9, "whoosh"], [375.3, "street", -14, { dur: 2.6 }], [375.6, "popcluster", -6, { dur: 2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "ocaso", centro: () => 1500, autos: 1 }} seed={6252} mano={1.5}
          claves={[mira(0, 1400, 900, 1.2), mira(k(377.98), 1400, 900, 1.3)]}
          medio={<>
            {([[760, SENORA, 118], [940, TRAJE, 136], [1110, SCRUBS, 124], [1690, OBRERO, 129], [1860, RUNNER, 141], [2040, ESTUDIANTE, 117]] as [number, any, number][]).map(([x, l, b], i) => <Persona key={x} {...parado(l, x, ASH_CARRIL - 80, { seed: 700 + i, dir: [{ f: 0, v: x < 1400 ? 1 : -1 }], cartel: corazon(b, { tam: 50, desde: 4 + i * 4 }) })} />)}
            <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: 1400, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: 1 }, { f: k(376.2), v: -1 }]} poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: -0.5 } }, { f: k(376.2), v: { x: 1, y: -0.5 } }]} />
            {f > k(375.2) && <g opacity={tw(f, k(375.2), k(375.4))}><g transform={`translate(1250,640)`}><rect x={-380} y={-40} width={760} height={80} rx={20} fill="#0b1014" stroke={ROJO} strokeWidth={5} opacity={0.92} /><text y={15} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f4efe4" textAnchor="middle">THE WHOLE CITY: A LITTLE SCARED</text></g></g>}
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r26 · viernes 5:12: el mensaje; 41 de 47 ======================
const CAMA = TF_PUNTOS.cama;
const owenCama = (extra: Record<string, unknown> = {}) => ({ look: OWEN_CASA, seed: 47, luz: RIM.alba, ruta: [{ f: 0, x: CAMA + 60, y: A }], dir: [{ f: 0, v: 1 as const }], asiento: [{ f: 0, v: 70 }], ...extra });
const PIERNAS = { pI: 85, rI: -80, pD: 88, rD: -85 };
const Reloj512: React.FC<{ f: number }> = ({ f }) => (
  <g transform={`translate(${CAMA + 300},${A - 112})`}>
    <rect x={-58} y={-58} width={116} height={64} rx={12} fill="#1d1f24" stroke="#3a3e46" strokeWidth={4} />
    <text y={-12} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#ff4a3d" textAnchor="middle" opacity={Math.floor(f / 8) % 2 ? 1 : 0.55}>5:12</text>
  </g>
);
export const r26: PlanB = {
  a: 377.98, b: 380.3, trans: { tipo: "fundido", d: 10 },
  sfx: [[378.0, "tick", -2], [378.6, "beep", -6], [379.2, "beep", -6], [379.8, "beep", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={6260} mano={1.5}
          claves={[mira(0, CAMA + 130, A - 130, 2.5), mira(k(380.3), CAMA + 150, A - 120, 2.8)]}
          medio={<>
            <Reloj512 f={f} />
            <Persona {...owenCama({ poses: [{ f: 0, v: { tronco: -62, hD: 10, cD: 10, hI: 10, cI: 10, ...PIERNAS, cabeza: -10 } }], caras: [{ f: 0, v: "cansado" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }] })} />
          </>}
          hud={<Txt t="FRIDAY · 5:12 AM" a={2} b={k(380.3) + 4} f={f} top={170} tam={64} color={VERDE} chip />} />
      );
    };
    return <Pl />;
  },
};
export const r26b: PlanB = {
  a: 380.3, b: 388.52, trans: { tipo: "corte" },
  sfx: [[380.3, "phone_buzz", 0], [380.8, "phone_buzz", -2], [381.4, "type", -8, { dur: 6.4 }], [386.6, "drone", -8, { dur: 1.9 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={6261} mano={1.5}
          claves={[mira(0, CAMA + 260, A - 140, 2.4), mira(k(384.0), CAMA + 230, A - 150, 2.75, { curva: "inout" }), mira(k(388.52), CAMA + 220, A - 155, 2.9)]}
          medio={<>
            <Reloj512 f={f} />
            <Persona {...owenCama({ poses: [{ f: 0, v: { tronco: -40, hD: 30, cD: 125, ...PIERNAS } }, { f: k(380.9), v: { tronco: 6, hD: 30, cD: 125, cabeza: 18, ...PIERNAS } }],
              caras: [{ f: 0, v: "sorpresa" }, { f: k(383.8), v: "duda" }, { f: k(386.7), v: "miedo" }], miradas: [{ f: 0, v: { x: 1, y: 0.6 } }],
              enManoD: <Celular s={0.9} brillo="#7ab8ff" /> })} />
          </>}
          hud={<CeluGrande x={1180} y={130} desde={k(380.3)} f={f} de="HALDEN CLINIC" icono="H" color="#2a6fd6" hora="5:12" vibra={k(380.3)}
            lineas={["Dr. Imani Hale:", "Week 6 complete.", "Your appetite is now stable.", "Your next change has already started."]} escribe={k(381.3)} vel={0.5} />} />
      );
    };
    return <Pl />;
  },
};
export const r26c: PlanB = {
  a: 388.52, b: 391.4, trans: { tipo: "corte" },
  sfx: [[388.52, "glitch", 0], [388.7, "slam", -2], [389.6, "heart1", -6], [390.4, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const cae = tw(f, k(388.7), k(389.4));
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={6262} mano={1.5}
          claves={[mira(0, CAMA + 230, A - 150, 2.9), mira(k(391.4), CAMA + 230, A - 150, 3.0)]}
          medio={<Persona {...owenCama({ poses: [{ f: 0, v: { tronco: 6, hD: 30, cD: 125, cabeza: 18, ...PIERNAS } }, { f: k(389.0), v: { tronco: 0, hD: 10, cD: 40, cabeza: -6, ...PIERNAS } }],
            caras: [{ f: 0, v: "miedo" }], miradas: [{ f: 0, v: { x: 1, y: 0.6 } }, { f: k(389.0), v: { x: 1, y: -0.4 } }], enManoD: <Celular s={0.9} brillo="#7ab8ff" /> })} />}
          hud={<>
            <div style={{ position: "absolute", left: 1040, top: 260, width: 740, padding: "34px 30px", borderRadius: 30, background: "rgba(12,16,22,0.88)", fontFamily: F_HUD, color: "#f4efe4", textAlign: "center", transform: `scale(${pop(f, 2)})` }}>
              <div style={{ fontSize: 46, fontWeight: 600, color: "#9aa4ac", letterSpacing: 2 }}>PARTICIPANTS</div>
              <div style={{ fontSize: 150, fontWeight: 600, lineHeight: 1.05 }}>
                {f < k(388.9) ? <span>42</span> : <><span style={{ color: ROJO }}>41</span><span style={{ fontSize: 90, color: "#9aa4ac" }}> / 47</span></>}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 14 }}>
                {Array.from({ length: 47 }).map((_, i) => { const fuera = i >= 42 || (i === 41 && cae > 0); return <div key={i} style={{ width: 26, height: 26, borderRadius: 13, background: fuera ? "#3a3f46" : VERDE, opacity: i === 41 ? 1 - 0.7 * cae : 1, transform: i === 41 ? `translateY(${cae * 18}px)` : undefined }} />; })}
              </div>
            </div>
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M1030,300 Q760,180 ${580 + 20 * Math.sin(f / 4)},110`} stroke={AMARILLO} strokeWidth={8} fill="none" strokeDasharray="20 14" opacity={tw(f, k(389.2), k(389.6))} /></svg>
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r27 · el espejo: 104; ni salió de la cama ======================
export const r27: PlanB = {
  a: 391.4, b: 394.86, trans: { tipo: "fundido", d: 10 },
  sfx: [[391.5, "heart", -2, { dur: 3.4 }], [393.0, "boom", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={BañoEspejo} pal={PAL} setProps={{}} seed={6270} mano={1.5}
          claves={[mira(0, 960, 540, 1.0), mira(k(393.0), 960, 500, 1.12, { resorte: { damping: 10, stiffness: 160 } }), mira(k(394.86), 960, 500, 1.15)]}
          medio={<Reflejo6 f={f}>
            <Persona look={{ ...OWEN_CASA, frontal: true }} seed={47} escala={3.0} luz={{ lado: -1, color: "#fff2d8", fuerza: 0.7 }} ruta={[{ f: 0, x: 960, y: 1400 }]}
              poses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }, { f: k(392.6), v: { hD: 40, cD: 125, hI: 10, cI: 20, cabeza: -6 } }]}
              caras={[{ f: 0, v: "cansado" }, { f: k(392.0), v: "sorpresa" }, { f: k(393.0), v: "miedo" }]}
              cartel={corazon(104, { tam: 56, desde: k(391.7) })} />
          </Reflejo6>} />
      );
    };
    return <Pl />;
  },
};
export const r27b: PlanB = {
  a: 394.86, b: 396.68, trans: { tipo: "corte" },
  sfx: [[394.9, "gasp", -6], [395.4, "cloth", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={6271} mano={1.5}
          claves={[mira(0, CAMA + 200, A - 150, 2.0), mira(k(396.68), CAMA + 200, A - 150, 2.1)]}
          medio={<>
            <Reloj512 f={f} />
            <Persona {...owenCama({ poses: [{ f: 0, v: { tronco: 6, hD: 40, cD: 125, hI: 10, cI: 20, ...PIERNAS } }, { f: k(395.6), v: { tronco: -30, hD: 40, cD: 125, hI: 10, cI: 20, ...PIERNAS, cabeza: -10 } }],
              caras: [{ f: 0, v: "miedo" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }], cartel: corazon(104, { tam: 36 }) })} />
            <TextoW x={CAMA + 330} y={A - 300} t="STILL IN BED." tam={40} color={ROJO} borde="#ffffff" f={f} desde={k(395.0)} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r28 · la semana que viene: estrés; Tiny; CTA de a uno ======================
export const r28: PlanB = {
  a: 396.68, b: 400.32, trans: { tipo: "fundido", d: 12 },
  sfx: [[396.7, "riser", -4, { dur: 3.4 }], [398.0, "heart1", -6], [398.8, "heart1", -6], [399.6, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "dia", centro: () => 1500, autos: 2, paradas: [{ x: 1560, num: 9, refugio: true }] }} seed={6280} mano={1.5}
          claves={[mira(0, 1400, 860, 1.0), mira(k(400.32), 1420, 860, 1.15)]}
          medio={<>
            {([[760, OBRERO, 122], [930, SENORA, 108], [1100, SCRUBS, 133], [1700, TRAJE, 147], [1870, ESTUDIANTE, 116], [2040, RUNNER, 128]] as [number, any, number][]).map(([x, l, b], i) => <Persona key={x} {...parado(l, x, ASH_CARRIL - 80, { seed: 720 + i, dir: [{ f: 0, v: x < 1400 ? 1 : -1 }], cartel: corazon(b, { tam: 50, desde: k(397.2) + i * 5 }) })} />)}
            <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: 1400, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: -1 }, { f: k(398.6), v: 1 }]} poses={[{ f: 0, v: "pensar" }]} caras={[{ f: 0, v: "duda" }, { f: k(398.6), v: "sorpresa" }]} />
            <g transform={`translate(1300,${620}) scale(${pop(f, 6)})`}>
              <rect x={-330} y={-62} width={660} height={124} rx={24} fill="#0b1014" stroke={ROJO} strokeWidth={6} />
              <text y={24} fontFamily={F_HUD} fontWeight={600} fontSize={66} fill="#f4efe4" textAnchor="middle">NEXT WEEK: STRESS</text>
            </g>
          </>} />
      );
    };
    return <Pl />;
  },
};
export const r28b: PlanB = {
  a: 400.32, b: 404.06, trans: { tipo: "corte" },
  sfx: [[400.4, "punch", -12], [401.0, "boom", -4], [401.4, "heart", -2, { dur: 2.6 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const mesa = DES_PUNTOS.mesa;
      const bpm = interpolate(f, [k(401.0), k(403.0)], [88, 174], cl);
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "tarde" }} seed={6281} mano={1.5}
          claves={[mira(0, mesa + 100, 620, 1.5), mira(k(401.2), mesa + 220, 600, 2.0, { curva: "inout" }), mira(k(404.06), mesa + 220, 600, 2.1)]}
          medio={<>
            <Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: mesa - 60, y: DES_PISO }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }, { f: k(401.2), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }]} />
            <Persona look={TINY} seed={74} luz={RIM.tubo} ruta={[{ f: 0, x: mesa + 220, y: DES_PISO }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 30, cD: 120, hI: 30, cI: 120, tronco: -8 } }, { f: k(401.6), v: { hD: 20, cD: 130, hI: 20, cI: 130, tronco: -14, cabeza: -14 } }]}
              ajuste={(p: any, ff: number) => ({ ...p, tronco: (p.tronco ?? 0) + Math.sin(ff * 1.3) * 3 })}
              caras={[{ f: 0, v: "risa" }]} habla={[[0, k(404.0)]]}
              cartel={{ ...corazon(Math.round(bpm), { tam: 38, desde: k(400.5) }), claves: [{ f: 0, v: 88 }, { f: k(401.0), v: 174, d: 60 }], latido: bpm }} />
            <TextoW x={mesa + 380} y={430} t={"LAUGHS THE MOST.\nMOST STRESSED."} tam={30} color={ROJO} borde="#ffffff" f={f} desde={k(401.6)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
export const r28c: PlanB = {
  a: 404.06, b: 408.18, trans: { tipo: "corte" },
  sfx: [[404.2, "pop", 0], [405.5, "pop", -4], [405.8, "type", -8, { dur: 1.8 }], [407.6, "ding", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const mesa = DES_PUNTOS.mesa;
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "tarde" }} seed={6282} mano={1.5}
          claves={[mira(0, mesa + 200, 600, 1.8), mira(k(408.18), mesa + 200, 600, 1.9)]}
          medio={<>
            <Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: mesa - 20, y: DES_PISO }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: "saludar" }, { f: k(405.5), v: "pensar" }]} caras={[{ f: 0, v: "feliz" }, { f: k(405.5), v: "picaro" }]} habla={[[k(404.1), k(405.4)]]}
              cartel={panza({ tam: 28, dy: -10 })} />
            <GloboM x={mesa + 100} y={540} texto={"What would\nYOU eat?"} desde={k(404.1)} hasta={k(405.5)} tam={30} lado={1} />
          </>}
          hud={f >= k(405.5) ? <Comentario x={1000} y={560} desde={k(405.5)} texto="a whole pizza. box included." nombre="@you" w={780} f={f} /> : null} />
      );
    };
    return <Pl />;
  },
};
export const r28d: PlanB = {
  a: 408.18, b: 413.46, trans: { tipo: "corte" },
  sfx: [[408.4, "pop", 0], [409.4, "ding", -4], [410.6, "whoosh"], [411.0, "heart1", -6], [411.7, "heart1", -6], [412.4, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const mesa = DES_PUNTOS.mesa;
      const sub = f < k(410.6);
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "tarde" }} seed={6283} mano={1.5}
          claves={[mira(0, mesa + 200, 600, 1.8), mira(k(410.6), mesa + 140, 600, 1.8), mira(k(411.4), mesa + 60, 620, 2.2, { curva: "inout" }), mira(k(413.46), mesa + 60, 620, 2.3)]}
          medio={<>
            <Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: mesa - 20, y: DES_PISO }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: "señalar" }, { f: k(410.6), v: { hD: 30, cD: 120, hI: 10, cI: 20 } }]}
              caras={[{ f: 0, v: "feliz" }, { f: k(410.6), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: -0.4 } }, { f: k(410.6), v: { x: 1, y: 0 } }]}
              cartel={f > k(410.8) ? corazon(84, { tam: 34, desde: k(410.8) }) : undefined} />
            {!sub && <TextoW x={mesa + 200} y={470} t={"NEXT WEEK:\nWHAT STRESS DOES TO US"} tam={28} color={ROJO} borde="#ffffff" f={f} desde={k(411.0)} />}
          </>}
          hud={sub ? <BotonSub6 x={1300} y={380} desde={k(408.3)} clic={k(409.4)} f={f} tam={70} /> : null} />
      );
    };
    return <Pl />;
  },
};
