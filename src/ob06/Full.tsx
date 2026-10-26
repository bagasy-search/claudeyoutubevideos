// ob06 · «What If Your Stomach Could Digest Anything?» (Owen Upgraded, sesión B). Plan: D:/rtmp/ob06_PLAN_MxM.md
// Igual que ob04/ob05: cada plano va de un segundo de la voz al siguiente; k(seg) = cuadro local de ese segundo.
// Cartel de la semana: PANZA verde «ANYTHING»; desde 312 s aparece el CORAZÓN rojo que late (gancho a ob07).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Escena } from "../anikit/escena";
import { Montaje } from "../anikit/montaje";
import { Celular, Taza } from "../anikit/props";
import { F_HUD, F_MANO } from "../anikit/pantalla";
import { PAL, OWEN, OWEN_CASA, ROSA, DEE, LENA, ABRIGO, TINY, HALE, SENORA, OBRERO, ESTUDIANTE, SCRUBS, RUNNER, FUMADOR, RIM, VERDE } from "../owen/elenco";
import { ENFERMERA, TRAJE, pasajero } from "../owen/extras_b";
import { HudSerie, CartelM, ROJO } from "../owen/cartel";
import { Persona, PersonaP } from "../owen/b/gente";
import { armar, PlanB, K, sentadoBus, parado, POSE_CELU_SENTADO, Pizarra, GloboM, Vineta, TarjetaSemana, CeluMensaje, NumeroM, FuenteB } from "../owen/b/lib";
import { BusInterior, Bus9, BUS_PISO, BUS_PUNTOS, ASIENTO_X, alVolante, Volante, marchaParadas, kneelEn, Auto } from "../owen/mundo/bus";
import { Ashland, ASH_PISO, ASH_CARRIL } from "../owen/mundo/ashland";
import { TwoFlatCorte, TF_PISO, TF_ARRIBA, TF_PUNTOS } from "../owen/mundo/twoflat";
import { Halden, HAL_PISO, HAL_PUNTOS, LogoHalden } from "../owen/mundo/halden";
import { Descanso, DES_PISO, DES_PUNTOS, CajaDonas } from "../owen/mundo/sala";

const A = TF_ARRIBA, P = TF_PISO, BP = BUS_PISO, HP = HAL_PISO;
const ch = BUS_PUNTOS.chofer;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const AMARILLO = "#ffc94a";
const panza = (extra: Record<string, unknown> = {}) => ({ claves: 0, icono: "panza" as const, texto: "ANYTHING", color: AMARILLO, ...extra });
const corazon = (bpm: number, extra: Record<string, unknown> = {}) => ({ claves: bpm, icono: "corazon" as const, fmt: (v: number) => `${Math.round(v)}`, color: ROJO, latido: bpm, ...extra });
const owenVolante = (extra: Partial<PersonaP> = {}): PersonaP => ({
  look: OWEN, ruta: [{ f: 0, x: ch, y: BP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: BUS_PUNTOS.asiento }], poses: [{ f: 0, v: "sentado" }],
  ajuste: alVolante(ch, 1), luz: RIM.tubo, seed: 47, ...extra,
});
const Txt: React.FC<{ t: string; a: number; b: number; f: number; top?: number; left?: number; tam?: number; color?: string; mano?: boolean; rot?: number; chip?: boolean }> = ({ t, a, b, f, top = 150, left, tam = 64, color = "#f4efe4", mano, rot = 0, chip }) => (
  <div style={{ position: "absolute", top, left: left ?? 0, right: left === undefined ? 0 : undefined, textAlign: left === undefined ? "center" : "left", fontFamily: mano ? F_MANO : F_HUD, fontWeight: mano ? 700 : 600, fontSize: tam, color, transform: `rotate(${rot}deg)`, opacity: interpolate(f, [a, a + 6, b - 6, b], [0, 1, 1, 0], cl), textShadow: "0 3px 12px rgba(0,0,0,0.7)", whiteSpace: "pre-line", lineHeight: 1.1 }}>{chip ? <span style={{ background: "rgba(12,16,22,0.72)", padding: "6px 22px", borderRadius: 16 }}>{t}</span> : t}</div>
);
// espejo del baño (igual que ob04)
const Reflejo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <g>
    <defs><clipPath id="ob6espejo"><rect x={TF_PUNTOS.espejo - 74} y={A - 404} width={148} height={168} rx={8} /></clipPath></defs>
    <g clipPath="url(#ob6espejo)"><rect x={TF_PUNTOS.espejo - 80} y={A - 410} width={160} height={180} fill="#9fbfca" />{children}<path d={`M${TF_PUNTOS.espejo - 60},${A - 404} l40,0 l-70,170 l-40,0 Z`} fill="#fff" opacity={0.18} /></g>
  </g>
);
const owenEspejo = (carteles: any[], cara: { f: number; v: string }[]): PersonaP => ({
  look: { ...OWEN_CASA, frontal: true }, ruta: [{ f: 0, x: TF_PUNTOS.espejo, y: A - 150 }], escala: 0.62, seed: 47, luz: { lado: -1, color: "#fff2d8", fuerza: 0.6 },
  caras: cara, carteles, poses: [{ f: 0, v: { hD: 30, cD: 140 } }],
});
// la olla de pozole, las tortillas y el frasco
const Olla: React.FC<{ x: number; y: number; nivel: number; f: number }> = ({ x, y, nivel, f }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-70} y={-90} width={140} height={90} rx={14} fill="#c23a2e" /><rect x={-80} y={-96} width={160} height={14} rx={6} fill="#8a2a22" />
    <ellipse cy={-90 + 70 * (1 - nivel)} rx={64} ry={10} fill="#d98a3a" opacity={nivel > 0.02 ? 1 : 0} />
    {nivel > 0.5 && [0, 1].map((i) => <path key={i} d={`M${-20 + i * 30},-110 q10,-14 0,-28`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.3 + 0.2 * Math.sin(f / 5 + i)} />)}
  </g>
);

const BotonSub: React.FC<{ desde: number; f: number; top?: number }> = ({ desde, f, top = 820 }) => {
  if (f < desde) return null;
  const p = interpolate(f - desde, [0, 5, 9], [0.3, 1.18, 1], cl);
  const clic = interpolate(f - desde, [24, 28, 32], [1, 0.9, 1], cl);
  const hecho = f - desde > 28;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `scale(${p * clic})`, background: hecho ? "#3a3f46" : "#e0262b", color: "#fff", fontFamily: F_HUD, fontWeight: 600, fontSize: 64, letterSpacing: 3, padding: "18px 64px", borderRadius: 60, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>{hecho ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
    </div>
  );
};
// ====================== 1 · recap: «We can help with that.» ======================
const r01: PlanB = {
  a: 0, b: 6.48,
  sfx: [[0.1, "whoosh"], [1.2, "heart", -10, { dur: 3 }], [4.2, "phone_buzz", 0], [5.3, "glitch", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(4.2)) return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "tarde", avance: () => 0 }} seed={601} mano={2.5} claves={[mira(0, ch + 80, 620, 2.0), mira(k(4.2), ch + 60, 600, 2.4)]}
          medio={<><Persona {...owenVolante({ caras: [{ f: 0, v: "triste" }], poses: [{ f: 0, v: { ...POSE_CELU_SENTADO, hD: 30, cD: 140, hI: 30, cI: 140 } }], ajuste: undefined, cartel: { claves: 0, icono: "panza", texto: "1½ DAYS", tam: 32, color: "#ff8a5a" } })} /><Volante /></>}
          hud={<Txt t="LAST WEEK" a={0} b={k(4.2)} f={f} top={140} tam={56} color={VERDE} chip />} />
      );
      return (
        <AbsoluteFill style={{ background: "linear-gradient(#2a2232, #120e16)" }}>
          <CeluMensaje de="HALDEN CLINIC · DR. IMANI HALE" lineas={["We noticed you haven't been eating.", "We can help with that."]} desde={k(4.2)} escribe={k(4.2)} vibra={2} esc={1.05} />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};
// ====================== 2 · el cartel nuevo: ANYTHING ======================
const r02: PlanB = {
  a: 6.48, b: 10.42, trans: { tipo: "luz", d: 10, color: "#fff3d0" },
  sfx: [[6.5, "whoosh_big", -2], [7.4, "slam", -2], [9.0, "boom", -6], [9.1, "roll", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const esc = interpolate(f, [k(9.0), k(9.4)], [1, 1.25], cl);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#20180c", luz: AMARILLO }} seed={602} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(10.42), 960, 520, 1.12)]}
          medio={<g transform={`translate(960,500) scale(${esc})`}><CartelM x={0} y={0} {...panza()} tam={110} f={f} desde={k(7.3)} /></g>}
          hud={<Txt t="This week, his stomach can digest…" a={k(6.6)} b={k(10.42) + 4} f={f} top={760} tam={60} mano chip />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 3 · lunes 5:12: se despierta famélico ======================
const r03: PlanB = {
  a: 10.42, b: 17.04, trans: { tipo: "fundido", d: 14 },
  sfx: [[10.5, "tick", -2], [11.6, "cloth", -2], [13.8, "punch", -10], [14.0, "heart", -12, { dur: 1 }], [15.4, "punch", -8], [16.2, "step", -2]],
  el: (k) => (
    <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={603} mano={2.5}
      claves={[mira(0, 480, 170, 1.8), mira(k(13.8), 420, 140, 2.3, { curva: "inout" }), mira(k(17.04), 600, 160, 1.9, { curva: "inout" })]}
      medio={<Persona look={OWEN_CASA} seed={47} luz={RIM.alba} ruta={[{ f: 0, x: TF_PUNTOS.cama + 60, y: A }, { f: k(15.8), x: TF_PUNTOS.cama + 60, y: A }, { f: k(17.04), x: TF_PUNTOS.cama + 360, y: A }]} dir={[{ f: 0, v: -1 }, { f: k(15.8), v: 1 }]}
        asiento={[{ f: 0, v: 70 }, { f: k(15.6), v: 70 }, { f: k(15.9), v: undefined }]}
        poses={[{ f: 0, v: { tronco: -30, hD: 10, cD: 10, hI: 10, cI: 10, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(11.6), v: { tronco: 0, hD: 10, cD: 10, hI: 10, cI: 10, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(13.8), v: { hD: 20, cD: 120, hI: 20, cI: 120, tronco: 18, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(15.9), v: { hD: 20, cD: 120 } }]}
        caras={[{ f: 0, v: "cansado" }, { f: k(11.6), v: "sorpresa" }, { f: k(13.8), v: "miedo" }]} />}
      hud={<Txt t="not hungry. STARVING." a={k(14.0)} b={k(17.04) + 4} f={useF()} left={1100} top={180} tam={66} mano rot={3} chip />} />
  ),
};
const r03b: PlanB = {
  a: 17.04, b: 25.22, trans: { tipo: "corte" },
  sfx: [[17.1, "water", -10, { dur: 1.5 }], [19.4, "glitch", -6], [20.2, "pop", 0], [22.4, "whoosh"], [24.16, "slam", -2]],
  el: (k) => (
    <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false }} seed={604} mano={2}
      claves={[mira(0, 1040, 120, 2.0), mira(k(19.2), 1100, 70, 2.8, { curva: "inout" }), mira(k(25.22), 1110, 60, 3.1)]}
      medio={<Reflejo><Persona {...owenEspejo([{ claves: 0, icono: "panza", texto: useF() < k(22.6) ? "?" : "ANYTHING", color: AMARILLO, tam: 26, desde: k(20.1) }], [{ f: 0, v: "cansado" }, { f: k(20.2), v: "sorpresa" }, { f: k(24.2), v: "duda" }])} /></Reflejo>}
      hud={<Txt t="one word instead of a number" a={k(22.4)} b={k(25.22) + 4} f={useF()} top={900} tam={56} mano chip />} />
  ),
};
const r04: PlanB = {
  a: 25.22, b: 30.02, trans: { tipo: "luz", d: 10, color: "#d8fff2" },
  sfx: [[25.25, "slam", -2], [27.28, "slam", -4], [28.62, "slam", -2], [29.2, "heart1", -6]],
  el: (k) => (
    <AbsoluteFill style={{ background: "#0e1a20" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(67,224,180,0.18), rgba(0,0,0,0) 60%)" }} />
      <TarjetaSemana hasta={k(30.02)} lineas={[{ t: "WEEK 6", desde: 0, tam: 150 }, { t: "PARTICIPANT 47", desde: k(27.28), tam: 74, color: VERDE }, { t: "42 STILL IN", desde: k(28.62), tam: 74, color: "#ff8a5a" }]} />
    </AbsoluteFill>
  ),
};

// ====================== 5 · el pozole de Rosa, las tortillas, los jalapeños y una cebolla cruda ======================
const r05: PlanB = {
  a: 30.02, b: 45.22, trans: { tipo: "cortina", lado: -1 },
  sfx: [[30.1, "step", -2], [30.6, "step", -2], [31.4, "metal", -6], [35.4, "eat", -4], [36.2, "eat", -4], [37.0, "eat", -4], [37.8, "metal", -6], [38.4, "paper", -4], [39.2, "eat", -4], [40.0, "eat", -4], [40.6, "glass", -4], [41.2, "eat", -4], [42.8, "eat", 0], [43.5, "eat", -2], [44.4, "sparkle", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const nivel = interpolate(f, [k(35.4), k(38.0)], [1, 0], cl);
      const tort = 6 - Math.floor(interpolate(f, [k(38.6), k(40.2)], [0, 6], cl));
      const cocina = TF_PUNTOS.cocina;
      const fase = f < k(38.4) ? 0 : f < k(42.7) ? 1 : 2;
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba" }} seed={605} mano={2.5}
          claves={[mira(0, 640, 680, 1.4), mira(k(33.0), cocina + 60, 640, 2.0, { curva: "inout" }), mira(k(38.4), cocina + 160, 640, 2.2, { curva: "inout" }), mira(k(42.7), cocina + 120, 560, 2.8, { curva: "inout" }), mira(k(45.22), cocina + 120, 570, 2.9)]}
          medio={<>
            <Olla x={cocina - 40} y={P - 300} nivel={nivel} f={f} />
            {/* tortillas y el frasco sobre la mesada */}
            <g transform={`translate(${cocina + 220},${P - 300})`}>{Array.from({ length: Math.max(0, tort) }).map((_, i) => <ellipse key={i} cy={-i * 5} rx={50} ry={10} fill="#e9d2a0" stroke="#c9a66a" strokeWidth={2} />)}</g>
            <g transform={`translate(${cocina + 340},${P - 300})`} opacity={f < k(41.2) ? 1 : 0}><rect x={-26} y={-80} width={52} height={80} rx={8} fill="#cfe6ea" opacity={0.6} /><rect x={-22} y={-60} width={44} height={56} rx={6} fill="#5a9a3a" /><rect x={-28} y={-92} width={56} height={14} rx={4} fill="#c23a2e" /></g>
            <Persona look={OWEN_CASA} seed={47} luz={RIM.cocina} ruta={[{ f: 0, x: 1250, y: P }, { f: k(32.6), x: cocina + 120, y: P }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: {} }, { f: k(35.2), v: { hD: 70, cD: 150, hI: 60, cI: 60, cabeza: 6 } }, { f: k(35.8), v: { hD: 60, cD: 100, hI: 60, cI: 60, cabeza: 10 } }, { f: k(36.4), v: { hD: 70, cD: 150, hI: 60, cI: 60, cabeza: 6 } }, { f: k(37.0), v: { hD: 60, cD: 100, hI: 60, cI: 60, cabeza: 10 } }, { f: k(37.6), v: { hD: 70, cD: 150, hI: 60, cI: 60 } }, { f: k(38.6), v: { hD: 60, cD: 150, cabeza: 4 } }, { f: k(39.4), v: { hD: 60, cD: 110 } }, { f: k(40.2), v: { hD: 60, cD: 150 } }, { f: k(42.7), v: { hD: 50, cD: 150, cabeza: -4 } }]}
              caras={[{ f: 0, v: "determinado" }, { f: k(35.4), v: "risa" }, { f: k(42.8), v: "feliz" }, { f: k(44.4), v: "picaro" }]} habla={[[k(35.4), k(38.0)], [k(39.2), k(41.6)], [k(42.8), k(44.3)]]}
              enManoD={(ff) => fase === 0 && ff > k(35.2) ? <rect x={-6} y={-40} width={12} height={60} rx={5} fill="#c9ced2" /> : fase === 1 ? <ellipse rx={40} ry={9} fill="#e9d2a0" /> : fase === 2 ? <g><circle r={26} fill="#e9dfc8" stroke="#b9a7d8" strokeWidth={3} /><path d={`M18,-12 a26,26 0 0 1 0,24 Z`} fill="#fff" opacity={ff > k(43.0) ? 1 : 0} /></g> : null}
              cartel={panza({ tam: 30 })} />
          </>}
          hud={<>
            <div style={{ position: "absolute", left: 120, top: 160, fontFamily: F_MANO, fontWeight: 700, fontSize: 64, color: "#f4efe4", background: "rgba(12,16,22,0.72)", padding: "4px 22px", borderRadius: 16, transform: "rotate(-3deg)", textShadow: "0 3px 10px rgba(0,0,0,0.6)", opacity: interpolate(f, [k(33.1), k(33.5), k(38.2), k(38.6)], [0, 1, 1, 0], cl) }}>
              <span style={{ textDecoration: f > k(37.6) ? "line-through" : "none", textDecorationColor: ROJO }}>4 days of pozole</span>
            </div>
            <Txt t="5:20 a.m. · cold · standing up" a={k(35.6)} b={k(38.4)} f={f} top={900} tam={60} mano chip />
            <Txt t={"6 tortillas · 1 jar of jalapeños"} a={k(38.6)} b={k(42.6)} f={f} top={900} tam={60} mano chip />
            <Txt t="RAW. like an apple." a={k(42.8)} b={k(45.22) + 4} f={f} left={1150} top={180} tam={66} color={AMARILLO} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 6 · la ciencia: una bolsa de ácido que no se digiere a sí misma ======================
const r06: PlanB = {
  a: 45.22, b: 79.7, trans: { tipo: "barrido", d: 10 },
  sfx: [[45.3, "whoosh"], [49.4, "drop", -2], [50.2, "fire", -12, { dur: 2 }], [52.0, "slam", -2], [52.8, "metal", -4], [53.6, "fire", -14, { dur: 1.4 }], [55.6, "pop"], [57.4, "roll", -4, { dur: 1.6 }], [60.4, "fire", -12, { dur: 2 }], [63.0, "whoosh"], [65.2, "pop"], [67.4, "unroll", -4], [69.6, "sparkle", -6], [72.4, "popcluster", -6, { dur: 2 }], [74.6, "ding", -4], [76.4, "glitch", -4], [77.4, "metal_fall", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const t = f / 30;
      // la panza (bolsa) con el ácido verde-amarillo adentro
      const capa = interpolate(f, [k(67.4), k(69.0)], [0, 1], cl);
      const owen = f >= k(76.4);
      const sinCapa = interpolate(f, [k(77.2), k(78.4)], [0, 1], cl);
      const ph = interpolate(f, [k(57.4), k(58.6)], [0, 1], cl);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#141e14", luz: "#c8ff5a" }} seed={606} mano={2}
          claves={[mira(0, 960, 540, 1.0), mira(k(55.4), 960, 560, 1.03, { curva: "inout" }), mira(k(79.7), 960, 540, 1.05)]}
          medio={<>
            <g transform="translate(560,560) scale(1.35)">
              <path d="M-60,-300 q-20,90 40,120 q170,40 180,180 q10,190 -170,200 q-210,10 -230,-160 q-14,-120 120,-170 q60,-24 40,-170 Z" fill={owen ? "#3a2a1c" : "#5a2a2a"} stroke={owen ? AMARILLO : "#ff8a8a"} strokeWidth={8} />
              {/* el ácido */}
              <clipPath id="ob6acido"><path d="M-60,-300 q-20,90 40,120 q170,40 180,180 q10,190 -170,200 q-210,10 -230,-160 q-14,-120 120,-170 q60,-24 40,-170 Z" /></clipPath>
              <g clipPath="url(#ob6acido)">
                <rect x={-300} y={60 + Math.sin(t * 2) * 8} width={600} height={400} fill="#c8ff5a" opacity={interpolate(f, [k(49.4), k(50.4)], [0, 0.7], cl)} />
                {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={-200 + i * 45} cy={300 - ((t * 60 + i * 37) % 240)} r={6 + (i % 3) * 3} fill="#efffbf" opacity={interpolate(f, [k(49.8), k(50.4)], [0, 0.8], cl)} />)}
              </g>
              {/* capa de moco protectora */}
              <path d="M-60,-300 q-20,90 40,120 q170,40 180,180 q10,190 -170,200 q-210,10 -230,-160 q-14,-120 120,-170 q60,-24 40,-170 Z" fill="none" stroke="#9fdcff" strokeWidth={26 * capa * (1 - sinCapa)} opacity={0.6} strokeDasharray="30 10" />
              {owen && <text x={0} y={60} fontFamily={F_HUD} fontWeight={600} fontSize={64} fill={AMARILLO} textAnchor="middle" opacity={sinCapa}>OWEN</text>}
            </g>
            {f < k(55.4) && <>
              <NumeroM x={1300} y={300} texto="HCl" rotulo="HYDROCHLORIC ACID" desde={k(51.9)} tam={130} color="#c8ff5a" />
              {/* tornillo oxidado que queda limpio */}
              <g transform="translate(1300,620)" opacity={interpolate(f, [k(52.6), k(53.0)], [0, 1], cl)}>
                <rect x={-140} y={-24} width={280} height={48} rx={10} fill={interpolate(f, [k(53.6), k(55.0)], [0, 1], cl) > 0.5 ? "#c9ced2" : "#a3572a"} />
                {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-120 + i * 44} y={-24} width={10} height={48} fill="#7a8288" opacity={0.6} />)}
                <text y={100} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#f4efe4" textAnchor="middle">CLEANS RUST OFF STEEL</text>
              </g>
            </>}
            {f >= k(55.4) && f < k(62.98) && <g transform="translate(920,300)">
              {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={i * 56} y={0} width={52} height={60} fill={`hsl(${i * 18},80%,55%)`} opacity={0.9} />)}
              {Array.from({ length: 14 }).map((_, i) => <text key={i} x={i * 56 + 26} y={96} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#f4efe4" textAnchor="middle">{i + 1}</text>)}
              <rect x={1.5 * 56 - 56 + 4} y={-16} width={(3.5 - 1.5) * 56} height={92} rx={10} fill="none" stroke="#fff" strokeWidth={6} opacity={ph} />
              <text x={140} y={180} fontFamily={F_HUD} fontWeight={600} fontSize={100} fill="#c8ff5a" opacity={ph}>pH 1.5 – 3.5</text>
              <text x={0} y={-50} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#9aa4ac">ACID ← → BASE</text>
            </g>}
            {f >= k(62.98) && f < k(76.4) && <>
              <NumeroM x={1300} y={260} texto={f < k(65.0) ? "WHY DOESN'T IT DIGEST ITSELF?" : "IT PROTECTS ITSELF"} desde={k(62.98)} tam={f < k(65.0) ? 40 : 60} color="#f4efe4" />
              {f > k(67.4) && <CartelM x={1300} y={450} claves={0} texto="THICK MUCUS LAYER" icono="corazon" color="#9fdcff" tam={40} f={f} desde={k(67.6)} />}
              {f > k(69.6) && <CartelM x={1300} y={560} claves={0} texto="NEW CELLS EVERY FEW DAYS" icono="reloj" color={VERDE} tam={40} f={f} desde={k(69.8)} />}
              <NumeroM x={1300} y={760} texto="2 NEW LININGS A WEEK" desde={k(72.5)} tam={66} color={VERDE} />
            </>}
            {owen && <NumeroM x={1300} y={380} texto="NO PROTECTION NEEDED" desde={k(77.0)} tam={60} color={AMARILLO} />}
          </>}
          hud={<FuenteB texto="Physiology of gastric acid and mucosal protection (standard medical texts)" desde={k(50)} hasta={k(76)} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 7 · Tiny y el burrito; la apuesta de las donas ======================
const r07: PlanB = {
  a: 79.7, b: 90.42, trans: { tipo: "cortina", lado: 1 },
  sfx: [[79.8, "bus_engine", -12, { dur: 10 }], [83.0, "paper", -4], [85.7, "eat", 0], [86.2, "eat", 0], [86.7, "eat", 0], [87.2, "eat", 0], [87.6, "gasp", -6], [88.0, "chair", -6], [88.6, "punch", -12]],
  el: (k) => {
    const x1 = ASIENTO_X(1);
    const Pl: React.FC = () => {
      const f = useF();
      const bocado = Math.floor(interpolate(f, [k(85.6), k(87.6)], [0, 4], cl));
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "alba", avance: marchaParadas([[k(84.8), k(88.6)]], 14) }} seed={607} mano={2.5}
          claves={[mira(0, (ch + x1) / 2, 620, 1.2), mira(k(84.6), (ch + x1) / 2 - 60, 600, 1.6, { curva: "inout" }), mira(k(87.6), (ch + x1) / 2 + 40, 620, 1.45, { curva: "inout" }), mira(k(90.42), (ch + x1) / 2 + 40, 620, 1.5)]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "neutral" }, { f: k(85.4), v: "risa" }, { f: k(87.8), v: "picaro" }], habla: [[k(85.7), k(87.6)]], giros: [{ f: 0, v: 0 }, { f: k(84.8), v: 0.8 }, { f: k(88.6), v: 0.3 }],
              poses: [{ f: 0, v: "sentado" }, { f: k(85.4), v: { hD: 60, cD: 100, cabeza: 6 } }],
              enManoD: (ff) => ff > k(85.4) && bocado < 4 ? <g><rect x={-40} y={-14} width={80 - bocado * 18} height={28} rx={14} fill="#e9c27a" /><rect x={-40} y={-14} width={14} height={28} rx={6} fill="#c8c8c8" /></g> : null,
              cartel: panza({ tam: 28 }) })} />
            <Volante />
            <Persona look={TINY} seed={74} luz={RIM.tubo} ruta={[{ f: 0, x: ch + 320, y: BP }, { f: k(87.8), x: ch + 320, y: BP }, { f: k(88.4), x: x1, y: BP }]} dir={[{ f: 0, v: -1 }]}
              asiento={[{ f: 0, v: undefined }, { f: k(88.2), v: undefined }, { f: k(88.6), v: BUS_PUNTOS.asiento }]}
              poses={[{ f: 0, v: { hD: 60, cD: 110, cabeza: 4 } }, { f: k(85.4), v: { hD: 90, cD: 20 } }, { f: k(87.6), v: "manosCara" }, { f: k(88.6), v: "sentado" }]}
              caras={[{ f: 0, v: "feliz" }, { f: k(85.6), v: "sorpresa" }, { f: k(87.3), v: "risa" }]} habla={[[k(87.3), k(90.4)]]}
              enManoD={(ff) => ff < k(85.4) ? <g><rect x={-60} y={-20} width={120} height={40} rx={20} fill="#e9c27a" /><rect x={-60} y={-20} width={30} height={40} rx={8} fill="#c8c8c8" /></g> : null} />
          </>}
          hud={<>
            <Txt t="TINY REED · DISPATCHER, 74TH STREET GARAGE" a={k(80.4)} b={k(84.4)} f={f} left={110} top={150} tam={40} color={VERDE} chip />
            <Txt t="the size of a shoe" a={k(83.0)} b={k(85.6)} f={f} top={880} tam={58} mano />
            <Txt t={`${bocado} / 4 bites`} a={k(85.7)} b={k(87.8)} f={f} left={1240} top={170} tam={64} color={AMARILLO} />
          </>} />
      );
    };
    return <Pl />;
  },
};
const r07b: PlanB = {
  a: 90.42, b: 98.16, trans: { tipo: "barrido", d: 10 },
  sfx: [[90.5, "door", -6], [91.2, "coin", 0], [92.4, "paper", -4], [94.8, "eat", 0], [95.2, "eat", 0], [95.6, "eat", 0], [96.0, "eat", 0], [96.5, "paper", 0], [96.9, "eat", 2], [97.3, "suspense", -8], [97.6, "punch", -12]],
  el: (k) => {
    const mesa = DES_PUNTOS.mesa;
    const Pl: React.FC = () => {
      const f = useF();
      const donas = 6 - Math.floor(interpolate(f, [k(94.8), k(96.2)], [0, 6], cl));
      const caja = interpolate(f, [k(96.5), k(97.1)], [1, 0], cl);
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "alba" }} seed={608} mano={2.5}
          claves={[mira(0, mesa, 640, 1.4), mira(k(94.6), mesa + 40, 620, 1.9, { curva: "inout" }), mira(k(97.3), mesa + 160, 600, 1.7, { curva: "inout" }), mira(k(98.16), mesa + 160, 600, 1.75)]}
          medio={<>
            {caja > 0.05 && <CajaDonas x={mesa - 20} y={DES_PISO - 210} n={Math.max(0, donas)} caja={caja} s={1.1} />}
            <Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: mesa - 220, y: DES_PISO }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: {} }, { f: k(94.7), v: { hD: 60, cD: 150, hI: 50, cI: 60 } }, { f: k(95.1), v: { hD: 70, cD: 60 } }, { f: k(95.5), v: { hD: 60, cD: 150 } }, { f: k(95.9), v: { hD: 70, cD: 60 } }, { f: k(96.4), v: { hD: 60, cD: 150, hI: 60, cI: 150 } }, { f: k(97.3), v: {} }]}
              caras={[{ f: 0, v: "duda" }, { f: k(94.8), v: "risa" }, { f: k(97.3), v: "picaro" }]} habla={[[k(94.8), k(97.2)]]} cartel={panza({ tam: 30 })} />
            <Persona look={TINY} seed={74} luz={RIM.tubo} ruta={[{ f: 0, x: mesa + 260, y: DES_PISO }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 80, cD: 30 } }, { f: k(92.0), v: "brazosCruzados" }, { f: k(97.3), v: { hD: 20, cD: 20, hI: 20, cI: 20 } }]}
              caras={[{ f: 0, v: "risa" }, { f: k(96.5), v: "sorpresa" }, { f: k(97.3), v: "miedo" }]} habla={[[k(90.5), k(92.4)]]}
              enManoD={(ff) => ff < k(92.0) ? <rect x={-30} y={-14} width={60} height={28} rx={3} fill="#7fbf6a" stroke="#3a6a2a" strokeWidth={2} /> : null} />
            <GloboM x={mesa + 300} y={DES_PISO - 380} texto={"$10 says you can't\neat the whole box."} desde={k(90.6)} hasta={k(93.8)} tam={24} lado={-1} />
          </>}
          hud={<>
            <Txt t="week-old donuts" a={k(92.4)} b={k(94.6)} f={f} left={120} top={170} tam={60} mano rot={-3} />
            <Txt t="…and the box." a={k(96.5)} b={k(98.16) + 4} f={f} left={120} top={170} tam={70} color={AMARILLO} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 8 · re-gancho: la parada 30 ======================
const r08: PlanB = {
  a: 98.16, b: 104.46, trans: { tipo: "fundido", d: 14 },
  sfx: [[98.2, "riser", -2, { dur: 5.6 }], [98.6, "bus_engine", -10, { dur: 4.4 }], [103.6, "heart1", -2]],
  el: (k) => {
    const bx = (f: number) => interpolate(f, [0, k(103.4)], [-600, 1500], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 2.4) });
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1400, paradas: [{ x: 1800, num: 30, refugio: true }] }} seed={609} mano={3}
          claves={[mira(0, 1500, 640, 0.85), mira(k(104.46), 1720, 620, 1.4, { curva: "in" })]}
          medio={<Bus9 x={bx(f)} y={ASH_CARRIL} hora="manana" rueda={bx(f) * 0.7} dir={1} gente={0.6} />}
          hud={<>
            <Txt t="STOP 30" a={k(99.2)} b={k(104.46) + 4} f={f} top={160} tam={72} color={VERDE} />
            <Txt t="where the power came from" a={k(100.6)} b={k(104.46) + 4} f={f} top={260} tam={56} mano />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 9 · la vaca y el rumen; tu panza también fermenta ======================
const r09: PlanB = {
  a: 104.46, b: 130.72, trans: { tipo: "cortina", lado: -1 },
  sfx: [[104.5, "whoosh"], [107.1, "farm", -10, { dur: 2 }], [108.6, "wind", -14, { dur: 3 }], [111.2, "pop"], [113.8, "fail", -8], [115.5, "stamp", -2], [117.4, "stamp", -2], [118.4, "whoosh"], [120.4, "popcluster", -6, { dur: 3 }], [124.6, "drop", -4], [125.4, "drop", -4], [126.2, "drop", -4], [127.6, "whoosh"], [128.8, "pop"]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const t = f / 30;
      const rumen = interpolate(f, [k(118.3), k(119.2)], [0, 1], cl);
      const humano = f >= k(127.56);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#14200f", luz: "#9ad84a" }} seed={610} mano={2} claves={[mira(0, 960, 560, 1.0), mira(k(118.3), 960, 560, 1.04, { curva: "inout" }), mira(k(127.5), 960, 540, 1.0, { curva: "inout" }), mira(k(130.72), 960, 540, 1.05)]}
          medio={!humano ? <>
            {/* la vaca comiendo pasto */}
            <g transform="translate(720,620) scale(1.35)">
              <rect x={-260} y={-160} width={520} height={240} rx={110} fill="#f4efe4" stroke="#22303a" strokeWidth={6} />
              {[[-160, -100, 60], [40, -40, 80], [160, -120, 50]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#22303a" opacity={0.85} />)}
              <g transform={`translate(-290,${-40 + Math.sin(t * 3) * 10})`}><rect x={-90} y={-60} width={130} height={110} rx={40} fill="#f4efe4" stroke="#22303a" strokeWidth={6} /><ellipse cx={-70} cy={20} rx={34} ry={26} fill="#e9a3a3" /><circle cx={-20} cy={-24} r={8} fill="#22303a" /></g>
              {[-200, -80, 100, 200].map((x) => <rect key={x} x={x} y={70} width={30} height={130} fill="#f4efe4" stroke="#22303a" strokeWidth={5} />)}
              {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M${-460 + i * 20},200 l6,-40 l6,40`} stroke="#5aa83a" strokeWidth={5} fill="none" />)}
              {/* el rumen: un tanque lleno de microbios */}
              <g opacity={rumen}>
                <ellipse cx={-40} cy={-40} rx={170} ry={100} fill="#9ad84a" opacity={0.35} stroke="#9ad84a" strokeWidth={6} />
                {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={-40 + Math.cos(i * 1.7 + t * (0.6 + (i % 4) * 0.2)) * (40 + (i * 13) % 120)} cy={-40 + Math.sin(i * 2.3 + t * 0.8) * (20 + (i * 7) % 70)} r={6} fill="#efffbf" />)}
                <text x={-40} y={-160} fontFamily={F_HUD} fontWeight={600} fontSize={52} fill="#ffffff" textAnchor="middle">RUMEN</text>
              </g>
            </g>
            {f < k(118.3) && <>
              <NumeroM x={1480} y={280} texto="CELLULOSE" rotulo="THE FIBER THAT MAKES PLANTS STAND UP" desde={k(111.0)} tam={86} color="#9ad84a" />
              <CartelM x={1480} y={520} claves={0} texto="HUMANS: NO ENZYME" icono="panza" color="#ff8a5a" tam={40} f={f} desde={k(113.8)} />
              <CartelM x={1480} y={630} claves={0} texto="COWS: NO ENZYME EITHER" icono="panza" color="#ff8a5a" tam={40} f={f} desde={k(117.4)} />
            </>}
            {f >= k(118.3) && <>
              <NumeroM x={1480} y={300} texto="TRILLIONS OF MICROBES" desde={k(120.4)} tam={52} color="#efffbf" />
              <NumeroM x={1480} y={560} texto="A FERMENTATION TANK" desde={k(124.6)} tam={52} color="#9ad84a" />
            </>}
          </> : <>
            {/* la persona: el mismo tanque, más chico y más abajo */}
            <g transform="translate(960,560)">
              <circle cy={-330} r={70} fill="#22303a" stroke="#f4efe4" strokeWidth={5} />
              <path d="M-90,-250 h180 l20,280 h-220 Z" fill="#22303a" stroke="#f4efe4" strokeWidth={5} />
              <ellipse cy={0} rx={70} ry={50} fill="#9ad84a" opacity={0.4 + 0.2 * Math.sin(t * 3)} stroke="#9ad84a" strokeWidth={5} />
              {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={Math.cos(i * 1.9 + t) * (20 + (i * 9) % 46)} cy={Math.sin(i * 2.1 + t) * (10 + (i * 5) % 30)} r={5} fill="#efffbf" />)}
            </g>
            <NumeroM x={960} y={920} texto="YOU HAVE ONE TOO" rotulo="SMALLER · FURTHER DOWN" desde={k(127.7)} tam={60} color="#9ad84a" />
          </>}
          hud={<FuenteB texto="Ruminant digestion: microbial fermentation in the rumen (veterinary physiology)" desde={k(111)} hasta={k(127.4)} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 10 · 38 billones de bacterias; 90 % de la serotonina ======================
const r10: PlanB = {
  a: 130.72, b: 146.76, trans: { tipo: "luz", d: 10 },
  sfx: [[130.8, "whoosh"], [131.6, "popcluster", -6, { dur: 2 }], [133.4, "roll", -2, { dur: 1.6 }], [134.6, "slam", -2], [136.2, "pop"], [137.4, "pop"], [138.4, "pop"], [140.4, "whoosh"], [142.6, "roll", -2, { dur: 1.6 }], [144.2, "slam", 0], [145.2, "sparkle", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const t = f / 30;
      const sero = f >= k(140.32);
      const n = interpolate(f, [k(133.4), k(135.0)], [0, 38], cl);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#141e14", luz: "#9ad84a" }} seed={611} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(146.76), 960, 540, 1.1)]}
          medio={!sero ? <>
            {Array.from({ length: 90 }).map((_, i) => <ellipse key={i} cx={240 + ((i * 97) % 1440)} cy={640 + ((i * 53) % 340) + Math.sin(t * 2 + i) * 8} rx={18} ry={8} transform={`rotate(${(i * 37) % 180},${240 + ((i * 97) % 1440)},${640 + ((i * 53) % 340)})`} fill={["#9ad84a", "#efffbf", "#5ac8a8"][i % 3]} opacity={interpolate(f, [k(131.6) + i * 0.6, k(131.6) + i * 0.6 + 6], [0, 0.9], cl)} />)}
            <NumeroM x={960} y={260} texto={`${Math.round(n)} TRILLION BACTERIA`} rotulo="≈ AS MANY AS YOUR HUMAN CELLS" desde={k(133.3)} tam={100} color="#9ad84a" />
            {[["BREAK DOWN FIBER", 136.2, "panza"], ["MAKE VITAMINS", 137.4, "corazon"], ["TALK TO YOUR BRAIN", 138.4, "cerebro"]].map(([tx, s, ic], i) => <CartelM key={i} x={480 + i * 480} y={480} claves={0} texto={tx as string} icono={ic as any} color="#efffbf" tam={36} f={f} desde={k(s as number)} />)}
          </> : <>
            {/* cabeza y panza: la serotonina sale de abajo */}
            <g transform="translate(700,560)">
              <circle cy={-300} r={110} fill="#22303a" stroke="#f4efe4" strokeWidth={5} />
              <path d="M-120,-180 h240 l30,380 h-300 Z" fill="#22303a" stroke="#f4efe4" strokeWidth={5} />
              <ellipse cy={60} rx={110} ry={80} fill="#9ad84a" opacity={0.5} />
              <rect x={-10} y={-190} width={20} height={200} fill="#efffbf" opacity={0.5} strokeDasharray="10 10" />
              {Array.from({ length: 8 }).map((_, i) => <circle key={i} cy={60 - ((t * 80 + i * 40) % 330)} r={9} fill="#ffc94a" />)}
              <text x={-260} y={-300} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#9aa4ac" textAnchor="end">10%</text>
              <text x={-180} y={110} fontFamily={F_HUD} fontWeight={600} fontSize={160} fill={AMARILLO} textAnchor="end">90%</text>
            </g>
            <NumeroM x={1340} y={420} texto="SEROTONIN" rotulo="A CHEMICAL TIED TO MOOD" desde={k(140.5)} tam={100} color={AMARILLO} />
            <NumeroM x={1340} y={720} texto="MADE IN YOUR GUT" desde={k(144.2)} tam={66} color="#f4efe4" />
          </>}
          hud={<FuenteB texto={sero ? "Gut serotonin: Yano et al., Cell (2015)" : "Sender, Fuchs & Milo, PLOS Biology (2016)"} desde={k(133)} hasta={k(146.6)} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 11 · el café de Lena: «¿Comés por alguien más?» ======================
const r11: PlanB = {
  a: 146.76, b: 159.66, trans: { tipo: "barrido", d: 10 },
  sfx: [[146.8, "bus_brake", -6], [147.9, "door_bell", -4], [148.6, "step", -2], [149.4, "cup", -4], [149.8, "cup", -4], [150.2, "cup", -4], [150.6, "cup", -4], [151.2, "plates", -8, { dur: 1.4 }], [152.4, "whoosh"], [156.4, "heart1", -6], [158.4, "suspense", -10]],
  el: (k) => {
    const CAFE = 1700;
    const Pl: React.FC = () => {
      const f = useF();
      const tazas = Math.floor(interpolate(f, [k(149.3), k(150.7)], [0, 4], cl));
      const pila = interpolate(f, [k(151.0), k(152.2)], [0, 1], cl);
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1800, cafe: CAFE, paradas: [{ x: 2300, num: 18 }], autos: 2 }} seed={612} mano={3}
          claves={[mira(0, 2000, 800, 1.0), mira(k(149.0), CAFE + 100, 860, 1.6, { curva: "inout" }), mira(k(152.4), CAFE + 60, 900, 2.0, { curva: "inout" }), mira(k(156.4), CAFE + 20, 920, 2.3, { curva: "inout" }), mira(k(159.66), CAFE + 120, 900, 2.0, { curva: "inout" })]}
          medio={<>
            <Bus9 x={3050} y={ASH_CARRIL} hora="manana" puertas={1} kneel={1} dir={1} chofer={false} />
            <Persona look={LENA} seed={18} luz={RIM.sol} ruta={[{ f: 0, x: CAFE - 40, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 80, cD: 30 } }, { f: k(152.4), v: { hD: 40, cD: 120, hI: 40, cI: 120 } }, { f: k(154.6), v: { hD: 70, cD: 50 } }]}
              caras={[{ f: 0, v: "feliz" }, { f: k(152.4), v: "sorpresa" }, { f: k(154.6), v: "duda" }, { f: k(156.4), v: "triste" }]} habla={[[k(154.6), k(158.3)]]} />
            {/* el mostrador con las cuatro tazas y la montaña de facturas */}
            <g transform={`translate(${CAFE + 30},${ASH_CARRIL - 80})`}>
              <rect x={-150} y={-130} width={320} height={130} rx={8} fill="#7a4a2e" /><rect x={-160} y={-142} width={340} height={16} rx={6} fill="#c9864a" />
              {Array.from({ length: tazas }).map((_, i) => <g key={i} transform={`translate(${-120 + i * 46},-160)`}><rect x={-16} y={-24} width={32} height={30} rx={5} fill="#f4efe6" /><path d="M16,-16 a8,8 0 0 1 0,14" stroke="#f4efe6" strokeWidth={4} fill="none" /></g>)}
              <g transform={`translate(110,-142) scale(${pila})`}>{Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={((i * 23) % 60) - 30} cy={-14 - Math.floor(i / 3) * 22} rx={30} ry={14} fill={["#d9a04a", "#e9c27a", "#c9864a", "#f2d39a"][i % 4]} stroke="#8a5a2a" strokeWidth={2} />)}</g>
            </g>
            <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: 2400, y: ASH_CARRIL - 80 }, { f: k(148.8), x: CAFE + 300, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: {} }, { f: k(149.0), v: { hD: 80, cD: 30 } }, { f: k(152.4), v: {} }, { f: k(158.4), v: { hD: 10, cD: 20, hI: 10, cI: 20, cabeza: 14 } }]}
              caras={[{ f: 0, v: "determinado" }, { f: k(149.0), v: "feliz" }, { f: k(156.4), v: "sorpresa" }, { f: k(158.4), v: "triste" }]} habla={[[k(149.0), k(151.0)]]} cartel={panza({ tam: 30 })} />
            <GloboM x={CAFE + 300} y={ASH_CARRIL - 360} texto={"Four coffees.\nAnd… all of that."} desde={k(149.0)} hasta={k(152.2)} tam={24} lado={-1} />
            <GloboM x={CAFE - 40} y={ASH_CARRIL - 360} texto={"Are you okay? You look like\nyou're eating for somebody else."} desde={k(154.6)} hasta={k(158.4)} tam={24} lado={1} />
          </>}
          hud={<Txt t="STOP 18 · LENA'S CAFÉ" a={k(146.9)} b={k(149.6)} f={f} left={110} top={150} tam={48} color={VERDE} chip />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 12 · CTA a mitad ======================
const r12: PlanB = {
  a: 159.66, b: 170.48, trans: { tipo: "fundido", d: 14 },
  sfx: [[159.7, "whoosh"], [161.4, "pop", 0], [162.0, "roll", -4, { dur: 2.4 }], [165.8, "ding", -4], [166.4, "pop", 0], [167.6, "pop", 0], [168.6, "riser", -6, { dur: 1.8 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const comidas = ["PIZZA ×10", "A WHOLE CAKE", "GHOST PEPPERS", "RAW ONIONS", "TACOS ×40", "A TIRE?"];
      const n = Math.floor(f / 5) % comidas.length;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#20180c", luz: AMARILLO }} seed={613} mano={2} claves={[mira(0, 960, 560, 1.0), mira(k(170.48), 960, 560, 1.1)]}
          medio={<>
            <CartelM x={960} y={430} claves={0} icono="panza" color={AMARILLO} texto={f < k(165.7) ? (f > k(162.0) ? comidas[n] : "???") : "YOU?"} tam={70} f={f} desde={k(161.4)} />
          </>}
          hud={<>
            <Txt t={"ONE DAY. ANY FOOD.\nWHAT'S THE FIRST THING YOU'D EAT?"} a={k(161.4)} b={k(170.48) + 6} f={f} top={80} tam={56} />
            <Txt t="TELL US IN THE COMMENTS" a={k(165.8)} b={k(170.48) + 6} f={f} top={620} tam={64} color={VERDE} chip />
            <BotonSub desde={k(167.0)} f={f} top={800} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 13 · martes: lee sobre estómagos en el descanso ======================
const r13: PlanB = {
  a: 170.48, b: 179.32, trans: { tipo: "cortina", lado: 1 },
  sfx: [[170.5, "whoosh"], [171.4, "punch", -12], [172.6, "chair", -6], [174.8, "type", -10, { dur: 3 }], [176.2, "paper", -6], [177.6, "sparkle", -8]],
  el: (k) => {
    const mesa = DES_PUNTOS.mesa;
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "dia" }} seed={614} mano={2.5}
          claves={[mira(0, mesa, 620, 1.2), mira(k(174.6), mesa + 40, 600, 1.9, { curva: "inout" }), mira(k(179.32), mesa + 40, 590, 2.1)]}
          medio={<>
            <CajaDonas x={mesa - 80} y={DES_PISO - 210} n={0} caja={1} s={0.9} />
            <g transform={`translate(${DES_PUNTOS.silla},${DES_PISO})`}><rect x={-56} y={-70} width={112} height={14} rx={5} fill="#4a5560" /><rect x={36} y={-190} width={14} height={134} rx={5} fill="#4a5560" /><rect x={-50} y={-58} width={10} height={58} fill="#3a434c" /><rect x={40} y={-58} width={10} height={58} fill="#3a434c" /></g>
            <Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: DES_PUNTOS.silla, y: DES_PISO }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 62 }]}
              poses={[{ f: 0, v: { hD: 20, cD: 120, hI: 20, cI: 120, tronco: 10, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(174.6), v: { ...POSE_CELU_SENTADO } }]}
              caras={[{ f: 0, v: "cansado" }, { f: k(174.6), v: "duda" }, { f: k(177.6), v: "feliz" }]} enManoD={(ff) => ff > k(174.4) ? <Celular s={0.9} brillo="#7ab8ff" /> : null} cartel={panza({ tam: 30 })} />
          </>}
          hud={<>
            <Txt t="TUESDAY" a={k(170.5)} b={k(172.4)} f={f} top={160} tam={66} color={VERDE} chip />
            <Vineta x={1100} y={170} w={620} desde={k(175.0)} hasta={k(179.32) + 2} rot={3}>
              <AbsoluteFill style={{ background: "#f4f6f8", padding: 80, fontFamily: F_HUD }}>
                <div style={{ fontSize: 96, fontWeight: 600, color: "#1a4fae" }}>can a stomach digest anything?</div>
                {["Stomach acid and pH", "Man who ate an airplane", "Why can't adults drink milk?"].map((t, i) => <div key={i} style={{ marginTop: 60, fontSize: 84, fontWeight: 600, color: "#22303a", opacity: interpolate(f, [k(175.6 + i * 0.8), k(176 + i * 0.8)], [0, 1], cl) }}>▸ {t}</div>)}
              </AbsoluteFill>
            </Vineta>
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 14 · Monsieur Mangetout: bicicletas, televisores y un Cessna 150 ======================
const r14: PlanB = {
  a: 179.32, b: 206.3, trans: { tipo: "luz", d: 12, color: "#fff3d0" },
  sfx: [[179.4, "whoosh"], [181.9, "fanfare", -10], [186.9, "metal", -2], [187.6, "metal", -2], [188.0, "glass", -2], [189.5, "whoosh_big", -4], [191.0, "metal_fall", -6], [193.0, "metal", -4], [194.0, "metal", -4], [195.0, "metal", -4], [197.6, "pop"], [200.9, "stamp", 0], [204.0, "fail", -6], [205.0, "fail", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const t = f / 30;
      const avion = f >= k(189.44) && f < k(197.6);
      const piezas = interpolate(f, [k(192.6), k(196.6)], [0, 1], cl);
      const regla = f >= k(203.98);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1a1622", luz: AMARILLO }} seed={615} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(189.4), 960, 560, 1.05, { curva: "inout" }), mira(k(197.6), 960, 540, 1.0, { curva: "inout" }), mira(k(206.3), 960, 540, 1.08)]}
          medio={<>
            {f < k(189.44) && <>
              <NumeroM x={960} y={240} texto="MICHEL LOTITO" rotulo="FRANCE · 1970s" desde={k(179.4)} tam={96} color="#f4efe4" />
              <NumeroM x={960} y={420} texto="«MONSIEUR MANGETOUT»" rotulo="MR. EATS EVERYTHING" desde={k(182.4)} tam={74} color={AMARILLO} />
              {/* bicicleta y televisor */}
              <g transform="translate(640,760)" opacity={interpolate(f, [k(186.9), k(187.3)], [0, 1], cl)}><circle cx={-90} r={70} fill="none" stroke="#f4efe4" strokeWidth={8} /><circle cx={90} r={70} fill="none" stroke="#f4efe4" strokeWidth={8} /><path d="M-90,0 l60,-90 h100 l20,90 M-30,-90 l40,90 M60,-110 h40" stroke="#c23a2e" strokeWidth={10} fill="none" strokeLinecap="round" /></g>
              <g transform="translate(1280,760)" opacity={interpolate(f, [k(187.9), k(188.3)], [0, 1], cl)}><rect x={-120} y={-100} width={240} height={170} rx={16} fill="#3a3f46" stroke="#f4efe4" strokeWidth={6} /><rect x={-100} y={-82} width={170} height={134} rx={10} fill="#7ab8ff" /><circle cx={98} cy={-40} r={8} fill="#f4efe4" /><path d="M-40,-100 l-40,-50 M40,-100 l40,-50" stroke="#f4efe4" strokeWidth={6} /></g>
            </>}
            {avion && <>
              {/* el Cessna 150 que se desarma en pedacitos */}
              <g transform={`translate(960,520)`}>
                {Array.from({ length: 48 }).map((_, i) => {
                  const fx = ((i % 8) - 3.5) * 80, fy = (Math.floor(i / 8) - 2.5) * 30;
                  const dx = piezas * (((i * 97) % 300) - 150) * 2.4, dy = piezas * (200 + ((i * 53) % 220));
                  return <rect key={i} x={fx + dx - 36} y={fy * 0.5 + dy - 12} width={72} height={24} rx={4} fill={i % 7 === 0 ? "#c23a2e" : "#e9eef2"} stroke="#9aa4ac" strokeWidth={2} transform={`rotate(${piezas * ((i * 31) % 180)},${fx + dx},${fy * 0.5 + dy})`} />;
                })}
                {piezas < 0.1 && <><path d="M-360,-20 h720 v40 h-720 Z" fill="#e9eef2" /><rect x={-60} y={-160} width={120} height={300} rx={20} fill="#e9eef2" stroke="#9aa4ac" strokeWidth={3} transform="rotate(90)" /><path d="M300,-20 l60,-80 h30 l-20,100 Z" fill="#c23a2e" /></>}
              </g>
              <NumeroM x={960} y={200} texto="A CESSNA 150" rotulo="1978 – 1980 · ABOUT TWO YEARS" desde={k(189.6)} tam={90} color={AMARILLO} />
            </>}
            {f >= k(197.6) && !regla && <>
              <NumeroM x={960} y={300} texto="UNUSUALLY THICK LININGS" rotulo="STOMACH AND INTESTINES" desde={k(197.7)} tam={74} color="#9fdcff" />
              <g transform="translate(960,640)" opacity={interpolate(f, [k(200.9), k(201.3)], [0, 1], cl)}><rect x={-300} y={-110} width={600} height={220} rx={20} fill="#0b1820" stroke={AMARILLO} strokeWidth={8} /><text y={-20} fontFamily={F_HUD} fontWeight={600} fontSize={56} fill={AMARILLO} textAnchor="middle">GUINNESS</text><text y={50} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f4efe4" textAnchor="middle">WORLD RECORDS</text></g>
            </>}
            {regla && <>
              <NumeroM x={960} y={240} texto="EVEN HE HAD A RULE" desde={k(203.4)} tam={70} color="#f4efe4" />
              {[0, 1].map((i) => (
                <g key={i} transform={`translate(${720 + i * 480},620)`} opacity={interpolate(f, [k(204.0 + i * 1.0), k(204.3 + i * 1.0)], [0, 1], cl)}>
                  {i === 0 ? <path d="M-90,30 q90,-160 180,-90 q-40,140 -180,90 Z" fill="#f2d33a" stroke="#8a7a1a" strokeWidth={5} /> : <><ellipse rx={80} ry={100} fill="#f4f1e6" stroke="#bdb6a8" strokeWidth={5} /><circle r={40} fill="#f2c94a" /></>}
                  <circle r={150} fill="none" stroke={ROJO} strokeWidth={16} /><path d="M-106,106 L106,-106" stroke={ROJO} strokeWidth={16} />
                  <text y={220} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f4efe4" textAnchor="middle">{i === 0 ? "NO BANANAS" : "NO HARD-BOILED EGGS"}</text>
                </g>
              ))}
            </>}
            <text x={0} y={0} fontSize={1} fill="none">{t}</text>
          </>}
          hud={<FuenteB texto="Guinness World Records: Michel Lotito, «strangest diet»" desde={k(181)} hasta={k(206)} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 15 · la lactosa: la mayoría de los adultos la pierde ======================
const r15: PlanB = {
  a: 206.3, b: 223.1, trans: { tipo: "cortina", lado: -1 },
  sfx: [[206.4, "fail", -8], [207.6, "whoosh"], [208.8, "drop", -2], [209.9, "pop"], [211.9, "pop"], [212.2, "pop"], [212.5, "pop"], [214.0, "fail", -8], [217.6, "pop"], [218.2, "stamp", -2], [220.8, "slam", 0]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const tercio = f >= k(211.9);
      const pierde = interpolate(f, [k(214.0), k(215.4)], [0, 1], cl);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#141c26", luz: "#e9f4f6" }} seed={616} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(223.1), 960, 540, 1.08)]}
          medio={<>
            {/* el vaso de leche */}
            <g transform="translate(420,560)"><path d="M-80,-170 h160 l-16,260 h-128 Z" fill="#e9f4f6" opacity={0.35} stroke="#e9f4f6" strokeWidth={6} /><path d="M-74,-120 h148 l-12,206 h-124 Z" fill="#fbfbf6" /><text y={170} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f4efe4" textAnchor="middle">LACTOSE</text></g>
            {!tercio && <g transform="translate(1100,520)" opacity={interpolate(f, [k(209.9), k(210.3)], [0, 1], cl)}>
              <circle r={110} fill="#f2c9a8" /><circle cx={-36} cy={-10} r={10} fill="#22303a" /><circle cx={36} cy={-10} r={10} fill="#22303a" /><path d="M-30,40 q30,24 60,0" stroke="#22303a" strokeWidth={6} fill="none" />
              <text y={200} fontFamily={F_HUD} fontWeight={600} fontSize={42} fill={VERDE} textAnchor="middle">MOST BABIES ✓</text>
            </g>}
            {tercio && <g transform="translate(980,440)">
              {[0, 1, 2].map((i) => <g key={i} transform={`translate(${i * 220},0)`} opacity={interpolate(f, [k(212.0 + i * 0.3), k(212.3 + i * 0.3)], [0, 1], cl)}>
                <circle cy={-90} r={50} fill={i < 2 ? `rgb(${244 - 120 * pierde},${239 - 140 * pierde},${228 - 140 * pierde})` : "#f4efe4"} /><path d="M-70,60 q0,-110 70,-110 q70,0 70,110 Z" fill={i < 2 ? `rgb(${244 - 120 * pierde},${239 - 140 * pierde},${228 - 140 * pierde})` : "#f4efe4"} />
              </g>)}
              <text x={220} y={180} fontFamily={F_HUD} fontWeight={600} fontSize={50} fill="#ff8a5a" textAnchor="middle" opacity={pierde}>2 OUT OF 3 ADULTS LOSE IT</text>
            </g>}
            {f > k(217.5) && <CartelM x={1200} y={820} claves={0} texto="LACTASE ↓" icono="panza" color="#ff8a5a" tam={44} f={f} desde={k(217.6)} />}
          </>}
          hud={<>
            <Txt t="the EXCEPTION, not the rule" a={k(220.8)} b={k(223.1) + 4} f={f} top={140} tam={66} color={AMARILLO} chip />
            <FuenteB texto="NIH MedlinePlus Genetics: lactose intolerance" desde={k(212)} hasta={k(223)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 16 · un galón de leche: no pasa nada ======================
const r16: PlanB = {
  a: 223.1, b: 226.8, trans: { tipo: "corte" },
  sfx: [[223.2, "step", -4], [223.7, "pour", -2, { dur: 2 }], [225.7, "ding", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const leche = interpolate(f, [k(223.6), k(225.6)], [1, 0], cl);
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "tarde" }} seed={617} mano={2.5} claves={[mira(0, TF_PUNTOS.heladera - 200, 620, 2.0), mira(k(226.8), TF_PUNTOS.heladera - 220, 600, 2.3)]}
          medio={<Persona look={OWEN_CASA} seed={47} luz={RIM.cocina} ruta={[{ f: 0, x: TF_PUNTOS.heladera - 220, y: P }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: { hD: 160, cD: 20, cabeza: -24 } }, { f: k(225.6), v: { hD: 60, cD: 40 } }]} caras={[{ f: 0, v: "determinado" }, { f: k(225.7), v: "duda" }]}
            enManoD={<g transform="rotate(150)"><rect x={-36} y={-60} width={72} height={110} rx={10} fill="#fbfbf6" stroke="#c9d0d6" strokeWidth={3} /><rect x={-36} y={-60 + 110 * (1 - leche)} width={72} height={110 * leche} rx={8} fill="#ffffff" /><rect x={-14} y={-80} width={28} height={22} rx={4} fill="#2a6fd6" /></g>}
            cartel={panza({ tam: 30 })} />}
          hud={<>
            <Txt t="1 GALLON" a={k(223.3)} b={k(225.6)} f={f} left={1200} top={170} tam={70} color="#f4efe4" />
            <Txt t="nothing happens." a={k(225.7)} b={k(226.8) + 4} f={f} left={1200} top={170} tam={64} mano chip />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 17 · miércoles: la llamada, Dee maneja, «20 minutos» ======================
const r17: PlanB = {
  a: 226.8, b: 240.12, trans: { tipo: "barrido", d: 10 },
  sfx: [[226.9, "phone_buzz", 0], [227.6, "phone_buzz", -2], [229.6, "write", -8, { dur: 1 }], [231.4, "car_door", -4], [232.0, "street", -14, { dur: 7 }], [233.1, "car_door", -4], [235.6, "keys", -6], [237.4, "slam", -4], [238.6, "heart1", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(231.4)) return (
        <AbsoluteFill style={{ background: "linear-gradient(#1d2a34,#0b1218)" }}>
          <CeluMensaje hora="3:40" de="HALDEN CLINIC · ROUTINE CHECK-IN" lineas={["Wednesday · Fulton Market · 4 PM", "Fourth floor. Come alone."]} desde={0} escribe={k(227.4)} vibra={2} esc={1.05} />
          <Txt t="WEDNESDAY" a={0} b={k(229.0)} f={f} left={120} top={160} tam={64} color={VERDE} />
        </AbsoluteFill>
      );
      const cx = interpolate(f, [k(231.4), k(233.0)], [300, 1080], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 2) });
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "tarde", centro: () => 1500, autos: 2 }} seed={618} mano={2.5}
          claves={[mira(k(231.4), 1200, 820, 1.1), mira(k(233.2), 1500, 860, 1.3, { curva: "inout" }), mira(k(236.2), 1420, 880, 1.6, { curva: "inout" }), mira(k(240.12), 1460, 880, 1.7)]}
          medio={<>
            {/* el edificio blanco sin cartel */}
            <g transform={`translate(1900,${ASH_PISO + 40})`}><rect x={-420} y={-900} width={840} height={900} fill="#f2f4f4" /><rect x={-420} y={-900} width={840} height={20} fill="#d6dade" />{Array.from({ length: 4 }).map((_, r) => Array.from({ length: 5 }).map((_, c) => <rect key={`${r}${c}`} x={-360 + c * 150} y={-840 + r * 190} width={110} height={130} fill="#bcd0dc" />))}<rect x={-70} y={-200} width={140} height={200} fill="#9aa4ac" /></g>
            <Auto x={cx} y={ASH_CARRIL - 20} color="#3a6a9a" dir={1} rueda={cx * 0.6} />
            {f > k(233.2) && <Persona look={DEE} seed={34} luz={RIM.sol} ruta={[{ f: k(233.2), x: 1330, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 70, cD: 40 } }, { f: k(237.4), v: "señalar" }]} caras={[{ f: 0, v: "determinado" }, { f: k(237.4), v: "enojo" }]} habla={[[k(235.8), k(240.0)]]} />}
            {f > k(233.6) && <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: k(233.6), x: 1500, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "duda" }, { f: k(238.6), v: "feliz" }]} cartel={panza({ tam: 30 })} />}
            <GloboM x={1300} y={ASH_CARRIL - 400} texto={"20 minutes. If you're not back,\nI'm calling the police."} desde={k(235.8)} hasta={k(240.0)} tam={24} lado={1} />
          </>}
          hud={<Txt t="white building · no sign" a={k(233.6)} b={k(235.7)} f={f} left={1150} top={170} tam={56} mano rot={3} chip />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 18 · cuarto piso: la enfermera y la bandeja de barras grises ======================
const BARRAS = (n: number, top: number) => (
  <g>
    <rect x={-150} y={-12} width={300} height={16} rx={6} fill="#c9ced2" />
    {Array.from({ length: n }).map((_, i) => <g key={i} transform={`translate(${-100 + (i % 3) * 100},${-34 - Math.floor(i / 3) * 26})`}><rect x={-44} y={-12} width={88} height={24} rx={4} fill={i === n - 1 ? "#ffc94a" : "#8a8d92"} stroke={i === n - 1 ? "#22303a" : "#e9eef2"} strokeWidth={3} /><text y={8} fontFamily={F_HUD} fontWeight={600} fontSize={20} fill={i === n - 1 ? "#22303a" : "#f4f6f8"} textAnchor="middle">{i === n - 1 ? top : 40 + i}</text></g>)}
  </g>
);
const r18: PlanB = {
  a: 240.12, b: 252.82, trans: { tipo: "fundido", d: 12 },
  sfx: [[240.2, "door", -8], [241.0, "drone", -16, { dur: 6 }], [243.4, "step", -4], [244.6, "pump", -4, { dur: 2 }], [246.2, "beep", -6], [246.8, "step", -4], [247.4, "step", -4], [249.0, "paper", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const mesa = HAL_PUNTOS.mesa;
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={619} mano={2}
          claves={[mira(0, HAL_PUNTOS.recepcion, 640, 0.9), mira(k(243.3), HAL_PUNTOS.silla, 620, 1.5, { curva: "inout" }), mira(k(247.6), mesa, 640, 1.4, { curva: "inout" }), mira(k(250.4), mesa + 60, HP - 300, 2.4, { curva: "inout" }), mira(k(252.82), mesa + 60, HP - 290, 2.6)]}
          medio={<>
            <g transform={`translate(${mesa + 60},${HP - 250})`}>{BARRAS(9, 47)}</g>
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: HAL_PUNTOS.recepcion - 200, y: HP }, { f: k(243.0), x: HAL_PUNTOS.silla - 60, y: HP }]} dir={[{ f: 0, v: 1 }]}
              asiento={[{ f: 0, v: undefined }, { f: k(243.0), v: undefined }, { f: k(243.4), v: 62 }]}
              poses={[{ f: 0, v: {} }, { f: k(243.4), v: "sentado" }, { f: k(244.4), v: { hD: 60, cD: 20, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(246.6), v: "sentado" }]}
              caras={[{ f: 0, v: "duda" }, { f: k(246.6), v: "neutral" }, { f: k(249.0), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(249.0), v: { x: 1, y: 0.6 } }]} cartel={panza({ tam: 30 })} />
            <Persona look={ENFERMERA} seed={98} luz={RIM.clinica} ruta={[{ f: 0, x: HAL_PUNTOS.camilla, y: HP }, { f: k(243.4), x: HAL_PUNTOS.silla + 120, y: HP }, { f: k(246.6), x: HAL_PUNTOS.silla + 120, y: HP }, { f: k(247.6), x: HAL_PUNTOS.camilla + 400, y: HP }]}
              dir={[{ f: 0, v: -1 }, { f: k(246.6), v: 1 }]} poses={[{ f: 0, v: { hD: 60, cD: 100 } }, { f: k(244.4), v: { hD: 70, cD: 40, hI: 60, cI: 90 } }, { f: k(246.6), v: { hD: 60, cD: 100 } }]} caras={[{ f: 0, v: "feliz" }]}
              enManoD={<rect x={-30} y={-40} width={60} height={80} rx={8} fill="#22303a" stroke="#bfe0f2" strokeWidth={3} />} />
          </>}
          hud={<>
            <Txt t="4TH FLOOR · WHITE · VERY QUIET" a={k(240.4)} b={k(243.2)} f={f} top={150} tam={50} color="#f4efe4" chip />
            <Txt t="plain gray bars, each one stamped with a number" a={k(249.0)} b={k(252.82) + 4} f={f} top={900} tam={46} mano chip />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 19 · el 47 arriba; el hombre del abrigo gris come la 9 ======================
const r19: PlanB = {
  a: 252.82, b: 270.8, trans: { tipo: "corte" },
  sfx: [[252.9, "pop", -2], [254.2, "drone", -8, { dur: 6 }], [256.2, "heart1", -4], [260.6, "eat", -10], [262.0, "eat", -10], [263.86, "glitch", -6], [264.4, "pop", 0], [266.2, "paper", -4], [267.4, "write", -6, { dur: 1.4 }], [269.2, "stamp", -2]],
  el: (k) => {
    const mesa = HAL_PUNTOS.mesa;
    const esquina = HAL_PUNTOS.camilla + 260;
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={620} mano={2}
          claves={[mira(0, mesa + 80, HP - 300, 2.8), mira(k(254.0), mesa + 80, HP - 300, 3.3, { curva: "inout" }), mira(k(255.6), esquina - 200, 620, 1.4, { curva: "inout" }), mira(k(260.6), esquina, 600, 2.0, { curva: "inout" }), mira(k(263.86), esquina - 40, HP - 260, 3.2, { curva: "inout" }), mira(k(266.16), (HAL_PUNTOS.silla - 60 + esquina) / 2, 620, 1.2, { curva: "inout" }), mira(k(270.8), (HAL_PUNTOS.silla - 60 + esquina) / 2, 620, 1.22)]}
          medio={<>
            <g transform={`translate(${mesa + 60},${HP - 250})`}>{BARRAS(9, 47)}</g>
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: HAL_PUNTOS.silla - 60, y: HP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]} poses={[{ f: 0, v: "sentado" }]}
              caras={[{ f: 0, v: "sorpresa" }, { f: k(256.2), v: "miedo" }, { f: k(266.2), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(255.6), v: { x: 1, y: 0 } }]} cartel={panza({ tam: 30 })} />
            <Persona look={ABRIGO} seed={9} luz={{ lado: -1, color: "#b8c4cc", fuerza: 0.6 }} ruta={[{ f: 0, x: esquina, y: HP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]}
              poses={[{ f: 0, v: { hD: 60, cD: 130, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(261.0), v: { hD: 50, cD: 150, cabeza: -4, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(261.8), v: { hD: 60, cD: 130, pI: 85, rI: -80, pD: 88, rD: -85 } }]}
              caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]}
              enManoD={<g><rect x={-40} y={-12} width={80} height={24} rx={4} fill="#8a8d92" stroke="#e9eef2" strokeWidth={3} /><text y={7} fontFamily={F_HUD} fontWeight={600} fontSize={16} fill="#f4f6f8" textAnchor="middle">9</text></g>} />
          </>}
          hud={<>
            <Txt t="47" a={k(253.4)} b={k(255.6)} f={f} left={1240} top={200} tam={120} color={VERDE} chip />
            <Txt t="the man from Stop 30" a={k(256.4)} b={k(259.4)} f={f} top={150} tam={56} mano chip />
            <Txt t="He doesn't look at Owen." a={k(259.5)} b={k(263.8)} f={f} top={900} tam={50} mano chip />
            <Txt t="№ 9" a={k(264.2)} b={k(266.16)} f={f} left={1300} top={220} tam={120} color="#f4efe4" />
            <Vineta x={1180} y={180} w={620} desde={k(266.4)} hasta={k(270.8) + 2} rot={3}>
              <AbsoluteFill style={{ background: "#efe8d6", padding: "60px 120px", fontFamily: F_MANO }}>
                {["Part. 3", "Part. 9", "Part. 12", "Part. 21", "Part. 33"].map((t, i) => <div key={i} style={{ fontSize: 150, lineHeight: 1.15, color: "#2a2a2a", textDecoration: "line-through", textDecorationColor: "#c23a2e", textDecorationThickness: 10, fontWeight: i === 1 ? 700 : 400, background: i === 1 ? "rgba(255,201,74,0.5)" : "none" }}>{t}</div>)}
              </AbsoluteFill>
            </Vineta>
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 20 · la panza ruge; come la barra; sabe a papel ======================
const r20: PlanB = {
  a: 270.8, b: 286.34, trans: { tipo: "corte" },
  sfx: [[270.9, "punch", -8], [271.3, "spring", -14], [272.4, "punch", -6], [273.6, "whoosh"], [275.4, "heart", -8, { dur: 4 }], [278.0, "paper", -6], [280.7, "paper", -2], [281.2, "eat", -2], [281.8, "eat", -4], [282.4, "eat", -4], [283.4, "suspense", -10], [284.2, "clock", -6, { dur: 2 }]],
  el: (k) => {
    const mesa = HAL_PUNTOS.mesa;
    const esquina = HAL_PUNTOS.camilla + 260;
    const Pl: React.FC = () => {
      const f = useF();
      const tiembla = f > k(275.3) && f < k(280.6) ? Math.sin(f * 2.4) * 3 : 0;
      const barra = f > k(277.6);
      const comida = interpolate(f, [k(281.0), k(282.8)], [0, 1], cl);
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={621} mano={2}
          claves={[mira(0, (HAL_PUNTOS.silla - 60 + esquina) / 2, 640, 1.22), mira(k(273.2), esquina - 100, 600, 1.8, { curva: "inout" }), mira(k(275.3), HAL_PUNTOS.silla + 40, 660, 2.1, { curva: "inout" }), mira(k(281.0), HAL_PUNTOS.silla + 20, 650, 2.4, { curva: "inout" }), mira(k(286.34), HAL_PUNTOS.silla + 20, 650, 2.6)]}
          medio={<>
            <g transform={`translate(${mesa + 60},${HP - 250})`}>{BARRAS(barra ? 8 : 9, barra ? 46 : 47)}</g>
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: HAL_PUNTOS.silla - 60, y: HP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]}
              poses={[{ f: 0, v: { hD: 20, cD: 110, hI: 20, cI: 110, tronco: 14, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(277.4), v: { hD: 80, cD: 30, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(278.4), v: { hD: 50, cD: 110, hI: 40, cI: 100, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(281.0), v: { hD: 60, cD: 150, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(282.8), v: { hD: 40, cD: 90, pI: 85, rI: -80, pD: 88, rD: -85 } }]}
              ajuste={(p: any) => ({ ...p, cD: (p.cD ?? 0) + tiembla, cI: (p.cI ?? 0) - tiembla })}
              caras={[{ f: 0, v: "miedo" }, { f: k(275.3), v: "determinado" }, { f: k(281.6), v: "asco" }, { f: k(283.4), v: "duda" }]} habla={[[k(281.0), k(282.8)]]}
              enManoD={(ff) => barra && comida < 1 ? <g transform={`scale(${1 - comida * 0.9},1)`}><rect x={-40} y={-12} width={80} height={24} rx={4} fill="#8a8d92" stroke="#e9eef2" strokeWidth={3} /><text y={7} fontFamily={F_HUD} fontWeight={600} fontSize={16} fill="#f4f6f8" textAnchor="middle">47</text></g> : null}
              cartel={panza({ tam: 30 })} />
            <Persona look={ABRIGO} seed={9} luz={{ lado: -1, color: "#b8c4cc", fuerza: 0.6 }} ruta={[{ f: 0, x: esquina, y: HP }]} dir={[{ f: 0, v: 1 }, { f: k(272.6), v: -1 }]} asiento={[{ f: 0, v: 62 }]}
              poses={[{ f: 0, v: { hD: 60, cD: 130, pI: 85, rI: -80, pD: 88, rD: -85 } }]} caras={[{ f: 0, v: "neutral" }]} giros={[{ f: 0, v: 0 }, { f: k(272.6), v: -0.7 }]} />
          </>}
          hud={<>
            <Txt t="GRRRRR" a={k(270.9)} b={k(273.4)} f={f} left={260} top={180} tam={90} color={AMARILLO} rot={-8} chip />
            <Txt t="it's just food." a={k(277.0)} b={k(280.6)} f={f} left={1200} top={180} tam={60} mano rot={3} chip />
            <Txt t="like paper." a={k(282.2)} b={k(283.6)} f={f} left={1200} top={180} tam={62} mano rot={3} chip />
            <div style={{ position: "absolute", right: 120, top: 170, fontFamily: F_HUD, fontWeight: 600, fontSize: 70, color: "#f4efe4", background: "rgba(12,16,22,0.72)", padding: "4px 22px", borderRadius: 16, opacity: interpolate(f, [k(283.4), k(283.7)], [0, 1], cl), textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>{`0:${String(Math.min(10, Math.floor(interpolate(f, [k(283.4), k(286.3)], [0, 10], cl)))).padStart(2, "0")}`}</div>
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 21 · grelina y nervio vago: «enough» ======================
const r21: PlanB = {
  a: 286.34, b: 309.98, trans: { tipo: "luz", d: 12 },
  sfx: [[286.4, "whoosh"], [288.8, "pop"], [291.4, "whoosh"], [293.0, "punch", -10], [294.4, "roll", -4, { dur: 2 }], [297.4, "pop"], [299.4, "unroll", -2], [302.4, "riser", -8, { dur: 2.6 }], [305.4, "ding", -2], [307.4, "slam", 0], [308.2, "sparkle", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const t = f / 30;
      const vuelta = f >= k(297.66);
      const enough = f >= k(305.2);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26", luz: "#7ab8ff" }} seed={622} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(297.6), 960, 540, 1.04, { curva: "inout" }), mira(k(309.98), 960, 540, 1.1)]}
          medio={<>
            <g transform="translate(760,560)">
              <circle cy={-330} r={100} fill="#22303a" stroke="#f4efe4" strokeWidth={5} />
              <ellipse cy={-340} rx={64} ry={46} fill="#ff8ab4" opacity={0.6} />
              <path d="M-120,-220 h240 l30,400 h-300 Z" fill="#22303a" stroke="#f4efe4" strokeWidth={5} />
              <ellipse cx={-20} cy={60} rx={70 + (vuelta ? 26 : 0) * interpolate(f, [k(297.7), k(299)], [0, 1], cl)} ry={56 + (vuelta ? 20 : 0) * interpolate(f, [k(297.7), k(299)], [0, 1], cl)} fill={AMARILLO} opacity={0.6} />
              {/* el nervio vago: una línea larga de la panza a la cabeza */}
              <path d="M-20,30 C60,-60 -60,-160 0,-260" stroke={vuelta ? VERDE : "#4a5a66"} strokeWidth={10} fill="none" strokeDasharray={vuelta ? "24 14" : "0"} strokeDashoffset={vuelta ? -t * 80 : 0} />
              {/* la grelina sube cuando está vacía */}
              {!vuelta && f > k(293.0) && Array.from({ length: 5 }).map((_, i) => <circle key={i} cx={(i % 2 ? 1 : -1) * 20} cy={30 - ((t * 120 + i * 60) % 290)} r={12} fill="#ff8a5a" />)}
            </g>
            {!vuelta && <>
              <NumeroM x={1380} y={280} texto="GHRELIN" rotulo="THE HUNGER HORMONE" desde={k(293.0)} tam={100} color="#ff8a5a" />
              <NumeroM x={1380} y={520} texto="«FIND FOOD.»" desde={k(295.6)} tam={70} color="#f4efe4" />
            </>}
            {vuelta && <>
              <NumeroM x={1380} y={280} texto="STRETCH + NUTRIENTS" desde={k(298.0)} tam={60} color={AMARILLO} />
              <NumeroM x={1380} y={480} texto="VAGUS NERVE" rotulo="A LONG NERVE FROM GUT TO BRAIN" desde={k(301.2)} tam={84} color={VERDE} />
            </>}
            {enough && <g transform={`translate(1380,760) scale(${interpolate(f, [k(305.2), k(305.6)], [0.4, 1], cl)})`}><rect x={-300} y={-70} width={600} height={140} rx={70} fill={VERDE} /><text y={30} fontFamily={F_HUD} fontWeight={600} fontSize={90} fill="#0b1820" textAnchor="middle">ENOUGH.</text></g>}
          </>}
          hud={<>
            <FuenteB texto="Gut–brain signaling: ghrelin and vagal afferents (endocrinology reviews)" desde={k(292)} hasta={k(307)} />
            <Txt t="Owen's body gets the signal." a={k(307.4)} b={k(309.98) + 4} f={f} top={940} tam={56} mano chip />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 22 · lleno; el cuarto cambia: corazones rojos sobre todos ======================
const r22: PlanB = {
  a: 309.98, b: 332.52, trans: { tipo: "corte" },
  sfx: [[310.0, "sparkle", -6], [312.0, "glitch", -2], [312.4, "boom", -4], [313.0, "riser", -8, { dur: 2 }], [315.0, "door", -6], [317.2, "pop", 0], [319.3, "heart1", -2], [320.2, "heart1", -4], [321.0, "heart1", -4], [322.1, "heart", -4, { dur: 5 }], [327.4, "heart1", -6], [329.0, "heart1", -6], [330.6, "heart1", -6], [331.4, "suspense", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const cambia = f >= k(312.0);
      const ab = HAL_PUNTOS.camilla + 260;
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={623} mano={2}
          claves={[mira(0, HAL_PUNTOS.silla + 20, 580, 2.4), mira(k(312.0), HAL_PUNTOS.silla + 20, 580, 2.8, { resorte: { damping: 8, stiffness: 180 } }), mira(k(314.96), HAL_PUNTOS.silla + 400, 620, 1.3, { curva: "inout" }), mira(k(319.26), HAL_PUNTOS.silla + 480, 560, 2.0, { curva: "inout" }), mira(k(327.36), ab - 60, 580, 2.0, { curva: "inout" }), mira(k(332.52), ab - 60, 580, 2.2)]}
          medio={<>
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: HAL_PUNTOS.silla - 60, y: HP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]} poses={[{ f: 0, v: "sentado" }]}
              caras={[{ f: 0, v: "feliz" }, { f: k(312.0), v: "sorpresa" }, { f: k(322.1), v: "miedo" }]} miradas={[{ f: 0, v: { x: 0, y: 0 } }, { f: k(315.0), v: { x: 1, y: 0 } }]}
              cartel={panza({ texto: "FULL", color: VERDE, tam: 30 })} />
            <Persona look={ENFERMERA} seed={98} luz={RIM.clinica} ruta={[{ f: 0, x: HAL_PUNTOS.camilla + 400, y: HP }, { f: k(315.0), x: HAL_PUNTOS.camilla + 400, y: HP }, { f: k(317.4), x: HAL_PUNTOS.silla + 480, y: HP }]} dir={[{ f: 0, v: -1 }]}
              opacidad={(ff) => (ff < k(315.0) ? 0 : 1)} poses={[{ f: 0, v: { hD: 60, cD: 100 } }]} caras={[{ f: 0, v: "feliz" }]} enManoD={<rect x={-30} y={-40} width={60} height={80} rx={8} fill="#22303a" stroke="#bfe0f2" strokeWidth={3} />}
              cartel={cambia ? corazon(98, { tam: 36, desde: k(319.2) }) : undefined} />
            <Persona look={ABRIGO} seed={9} luz={{ lado: -1, color: "#b8c4cc", fuerza: 0.6 }} ruta={[{ f: 0, x: ab, y: HP }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 62 }]}
              poses={[{ f: 0, v: { hD: 60, cD: 130, pI: 85, rI: -80, pD: 88, rD: -85 } }]} caras={[{ f: 0, v: "neutral" }]}
              cartel={cambia ? corazon(41, { tam: 36, desde: k(327.4), color: "#a35a5a" }) : undefined} />
          </>}
          hud={<>
            <Txt t="full." a={k(310.0)} b={k(312.0)} f={f} left={1200} top={180} tam={70} mano color={VERDE} chip />
            <Txt t="thump · thump · thump" a={k(322.1)} b={k(327.2)} f={f} top={900} tam={56} mano chip />
            <Txt t="barely alive · slow as a clock" a={k(328.8)} b={k(332.52) + 4} f={f} top={900} tam={52} mano chip />
            {cambia && f < k(312.6) && <AbsoluteFill style={{ background: "rgba(255,74,90,0.25)" }} />}
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 23 · la Dr. Hale: sonrisa tranquila, 132 lpm ======================
const r23: PlanB = {
  a: 332.52, b: 346.16, trans: { tipo: "corte" },
  sfx: [[332.6, "door", -6], [333.2, "step", -4], [333.8, "step", -4], [334.4, "step", -4], [337.2, "boom", -6], [337.4, "heart", -2, { dur: 4 }], [341.5, "pop", -4], [343.8, "paper", -6], [345.2, "suspense", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={624} mano={2}
          claves={[mira(0, HAL_PUNTOS.silla + 300, 620, 1.3), mira(k(335.0), HAL_PUNTOS.silla + 260, 620, 1.8, { curva: "inout" }), mira(k(337.22), HAL_PUNTOS.silla + 240, 560, 2.3, { curva: "inout" }), mira(k(341.46), HAL_PUNTOS.silla + 160, 640, 1.5, { curva: "inout" }), mira(k(346.16), HAL_PUNTOS.silla + 140, 640, 1.55)]}
          medio={<>
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: HAL_PUNTOS.silla - 60, y: HP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]} poses={[{ f: 0, v: "sentado" }]}
              caras={[{ f: 0, v: "miedo" }, { f: k(343.8), v: "duda" }]} cartel={panza({ texto: "FULL", color: VERDE, tam: 28 })} />
            <Persona look={HALE} seed={66} luz={RIM.clinica} ruta={[{ f: 0, x: HAL_PUNTOS.camilla + 300, y: HP }, { f: k(335.0), x: HAL_PUNTOS.silla + 240, y: HP }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 60, cD: 100 } }, { f: k(343.8), v: { hD: 70, cD: 30 } }]} caras={[{ f: 0, v: "feliz" }]} habla={[[k(341.5), k(346.0)]]}
              enManoI={<rect x={-30} y={-40} width={60} height={80} rx={8} fill="#22303a" stroke="#bfe0f2" strokeWidth={3} />}
              cartel={corazon(132, { tam: 42, desde: k(337.2), rotulo: "DR. HALE" })} />
            <GloboM x={HAL_PUNTOS.silla + 260} y={HP - 420} texto={"Everything looks wonderful.\nParticipant 47, you can go."} desde={k(341.5)} hasta={k(346.0)} tam={24} lado={-1} />
          </>}
          hud={<Txt t="warm smile · perfect calm" a={k(334.4)} b={k(337.2)} f={f} top={900} tam={54} mano chip />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 24 · afuera: Dee, 18 minutos, 112; Ashland llena de corazones ======================
const r24: PlanB = {
  a: 346.16, b: 363.08, trans: { tipo: "barrido", d: 10 },
  sfx: [[346.2, "door", -6], [346.9, "street", -14, { dur: 7 }], [350.3, "pop", 0], [351.6, "heart", -6, { dur: 2 }], [353.9, "car_door", -4], [354.6, "bus_engine", -16, { dur: 8 }], [356.0, "heart1", -6], [356.6, "heart1", -6], [357.2, "heart1", -6], [357.8, "heart1", -6], [358.4, "heart1", -6], [360.7, "heart", -8, { dur: 2.2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(353.84)) return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "ocaso", centro: () => 1500, autos: 2 }} seed={625} mano={2.5}
          claves={[mira(0, 1700, 840, 1.2), mira(k(350.3), 1460, 880, 1.8, { curva: "inout" }), mira(k(353.84), 1460, 880, 1.9)]}
          medio={<>
            <g transform={`translate(1900,${ASH_PISO + 40})`}><rect x={-420} y={-900} width={840} height={900} fill="#eceeee" />{Array.from({ length: 4 }).map((_, r) => Array.from({ length: 5 }).map((_, c) => <rect key={`${r}${c}`} x={-360 + c * 150} y={-840 + r * 190} width={110} height={130} fill="#c9a88a" />))}<rect x={-70} y={-200} width={140} height={200} fill="#9aa4ac" /></g>
            <Auto x={1120} y={ASH_CARRIL - 20} color="#3a6a9a" dir={1} />
            <Persona look={DEE} seed={34} luz={RIM.sol} ruta={[{ f: 0, x: 1420, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "celular" }, { f: k(350.3), v: { hD: 60, cD: 60 } }]} caras={[{ f: 0, v: "miedo" }, { f: k(350.3), v: "feliz" }]}
              enManoD={<Celular s={0.9} brillo="#7ab8ff" />} cartel={corazon(112, { tam: 38, desde: k(351.6), rotulo: "DEE" })} />
            <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: 1800, y: ASH_CARRIL - 80 }, { f: k(349.8), x: 1580, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "cansado" }]} />
          </>}
          hud={<Txt t="18 MINUTES" a={k(350.3)} b={k(353.84) + 4} f={f} left={120} top={170} tam={72} color={VERDE} chip />} />
      );
      const cx = 1200 + (f - k(353.84)) * 18;
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "ocaso", centro: () => cx, paradas: [{ x: 1900, num: 26, refugio: true }, { x: 3300, num: 24, refugio: true }, { x: 4700, num: 22 }] }} seed={626} mano={2.5}
          claves={[mira(k(353.84), 1900, 900, 1.7), mira(k(359.6), 2000, 900, 1.7, { curva: "inout" }), mira(k(360.6), 3300, 880, 1.25, { curva: "inout" }), mira(k(363.08), 3600, 860, 1.1)]}
          medio={<>
            {[[1700, SENORA, 104], [1840, OBRERO, 118], [2000, ESTUDIANTE, 96], [2120, SCRUBS, 122], [3150, RUNNER, 88], [3300, FUMADOR, 131], [3450, TRAJE, 140], [4600, pasajero(6), 109], [4760, pasajero(8), 115]].map(([x, l, b], i) => <Persona key={i} {...parado(l as any, x as number, ASH_CARRIL - 80, { seed: 640 + i, dir: [{ f: 0, v: i % 2 ? 1 : -1 }], cartel: corazon(b as number, { tam: 46, desde: k(356.0) + i * 4 }) })} />)}
            <Auto x={cx} y={ASH_CARRIL - 20} color="#3a6a9a" dir={1} rueda={cx * 0.6} />
          </>}
          hud={<Txt t="almost all of them beating fast" a={k(360.7)} b={k(363.08) + 4} f={f} top={160} tam={56} mano chip />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 25 · 60-100 lpm; la ciudad corre un poco asustada ======================
const r25: PlanB = {
  a: 363.08, b: 377.98, trans: { tipo: "luz", d: 12 },
  sfx: [[363.1, "whoosh"], [364.4, "heart1", -6], [365.4, "roll", -4, { dur: 1.6 }], [369.0, "riser", -8, { dur: 2 }], [371.0, "heart", -4, { dur: 3.6 }], [374.9, "whoosh"], [375.6, "popcluster", -6, { dur: 2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const t = f / 30;
      const ciudad = f >= k(374.92);
      const bpm = f < k(369.04) ? 72 : interpolate(f, [k(369.04), k(372.6)], [72, 128], cl);
      const fase = (t * bpm / 60) % 1;
      const linea = Array.from({ length: 60 }).map((_, i) => { const x = i * 20; const p = ((i / 60 + t * bpm / 60) % 1); const y = p > 0.45 && p < 0.5 ? -120 : p > 0.5 && p < 0.55 ? 60 : 0; return `${i ? "L" : "M"}${x},${y}`; }).join(" ");
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1e1418", luz: ROJO }} seed={627} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(377.98), 960, 540, 1.08)]}
          medio={!ciudad ? <>
            <g transform="translate(360,640)"><path d={linea} stroke={ROJO} strokeWidth={8} fill="none" /></g>
            <g transform={`translate(1500,420) scale(${1 + 0.12 * Math.max(0, Math.cos(fase * Math.PI * 2))})`}><path d="M0,60 C-130,-30 -100,-150 -30,-130 C-6,-124 0,-100 0,-90 C0,-100 6,-124 30,-130 C100,-150 130,-30 0,60 Z" transform="scale(1.6)" fill={ROJO} /></g>
            <NumeroM x={1500} y={760} texto={`${Math.round(bpm)} BPM`} rotulo={f < k(369.04) ? "NORMAL RESTING: 60–100" : "SCARED: STRESS HORMONES"} desde={k(365.3)} tam={96} color={f < k(369.04) ? VERDE : ROJO} />
          </> : <>
            {/* el skyline lleno de corazones que laten */}
            {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={120 + i * 140} y={560 - ((i * 73) % 300)} width={120} height={600} fill="#2a2030" />)}
            {Array.from({ length: 40 }).map((_, i) => { const b = 90 + ((i * 37) % 60); const s = 1 + 0.25 * Math.max(0, Math.cos(((t * b) / 60 + i * 0.13) * Math.PI * 2)); return <g key={i} transform={`translate(${150 + ((i * 131) % 1620)},${380 + ((i * 89) % 520)}) scale(${0.3 * s})`} opacity={interpolate(f, [k(375.2) + i * 1.2, k(375.2) + i * 1.2 + 6], [0, 1], cl)}><path d="M0,60 C-130,-30 -100,-150 -30,-130 C-6,-124 0,-100 0,-90 C0,-100 6,-124 30,-130 C100,-150 130,-30 0,60 Z" fill={ROJO} /></g>; })}
          </>}
          hud={<>
            <FuenteB texto="American Heart Association: resting heart rate" desde={k(364)} hasta={k(374.6)} />
            <Txt t="the whole city is running a little scared" a={k(375.0)} b={k(377.98) + 4} f={f} top={150} tam={58} mano chip />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 26 · viernes 5:12: el mensaje; 41/47 ======================
const r26: PlanB = {
  a: 377.98, b: 391.4, trans: { tipo: "corte" },
  sfx: [[378.0, "tick", -2], [380.3, "phone_buzz", 0], [380.8, "phone_buzz", -2], [381.4, "type", -8, { dur: 6 }], [386.6, "drone", -8, { dur: 4 }], [388.52, "glitch", 0], [388.7, "slam", -2]],
  el: (k) => {
    const f = useF();
    return (
    <AbsoluteFill style={{ background: "linear-gradient(#2a2232, #120e16)" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, rgba(122,184,255,0.25), rgba(0,0,0,0) 55%)" }} />
      <div style={{ position: "absolute", left: 140, top: 150, fontFamily: F_HUD, fontWeight: 600, fontSize: 60, color: "#f4efe4", opacity: interpolate(f, [0, 8, k(380.2), k(380.6)], [0, 1, 1, 0], cl) }}>FRIDAY · 5:12 AM</div>
            <CeluMensaje de="HALDEN CLINIC · DR. IMANI HALE" lineas={["Week 6 complete.", "Your appetite is now stable.", "Your next change has already started."]} desde={k(380.3)} escribe={k(381.4)} vibra={2} esc={1.05} />
      {f >= k(388.4) && <div style={{ position: "absolute", inset: 0, background: "rgba(10,8,14,0.95)", display: "flex", alignItems: "center", justifyContent: "center", gap: 40, fontFamily: F_HUD, fontWeight: 600, fontSize: 150, color: "#f4efe4", zIndex: 5 }}><span style={{ textDecoration: "line-through", textDecorationColor: ROJO, color: "#9aa4ac" }}>42</span><span>→</span><span style={{ color: ROJO, transform: `scale(${interpolate(f, [k(388.52), k(388.7), k(389.0)], [0.4, 1.2, 1], cl)})` }}>41</span><span style={{ fontSize: 90, color: "#9aa4ac" }}>/ 47</span></div>}
    </AbsoluteFill>
    );
  },
};
// ====================== 27 · en el espejo, desde la cama: 104 ======================
const r27: PlanB = {
  a: 391.4, b: 396.68, trans: { tipo: "fundido", d: 10 },
  sfx: [[391.5, "heart", -2, { dur: 5 }], [393.0, "boom", -8], [395.0, "gasp", -6]],
  el: (k) => (
    <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={628} mano={2}
      claves={[mira(0, 520, 170, 1.8), mira(k(396.68), 420, 120, 2.6, { curva: "inout" })]}
      medio={<Persona look={OWEN_CASA} seed={47} luz={RIM.alba} ruta={[{ f: 0, x: TF_PUNTOS.cama + 60, y: A }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 50 }]}
        poses={[{ f: 0, v: { tronco: -40, cabeza: -10, hD: 10, cD: 10, hI: 10, cI: 10, pI: 85, rI: -80, pD: 88, rD: -85 } }]} caras={[{ f: 0, v: "miedo" }]} miradas={[{ f: 0, v: { x: 0, y: -1 } }]}
        carteles={[corazon(104, { tam: 40, desde: k(391.6) }), panza({ tam: 26, dx: 0, dy: -70 })]} />}
      hud={<Txt t="he hasn't even gotten out of bed" a={k(394.9)} b={k(396.68) + 4} f={useF()} top={900} tam={54} mano chip />} />
  ),
};
// ====================== 28 · gancho a ob07: el que más se ríe es el más estresado ======================
const r28: PlanB = {
  a: 396.68, b: 413.46, trans: { tipo: "fundido", d: 14 },
  sfx: [[396.7, "riser", -4, { dur: 3.4 }], [398.0, "heart1", -6], [398.8, "heart1", -6], [399.6, "heart1", -6], [400.4, "punch", -12], [401.0, "boom", -4], [401.4, "heart", -2, { dur: 3 }], [404.2, "pop", 0], [405.2, "ding", -4], [408.4, "pop", 0], [410.2, "whoosh"]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const mesa = DES_PUNTOS.mesa;
      const bpm = interpolate(f, [k(401.0), k(403.4)], [88, 174], cl);
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "tarde" }} seed={629} mano={2.5}
          claves={[mira(0, mesa, 620, 1.1), mira(k(400.3), mesa + 200, 560, 2.0, { curva: "inout" }), mira(k(404.2), mesa + 120, 620, 1.3, { curva: "inout" }), mira(k(413.46), mesa + 140, 600, 1.55, { curva: "inout" })]}
          medio={<>
            {[[mesa - 300, OBRERO, 96], [mesa - 160, SCRUBS, 104]].map(([x, l, b], i) => <Persona key={i} {...parado(l as any, x as number, DES_PISO, { seed: 690 + i, cartel: corazon(b as number, { tam: 28, desde: k(397.4) + i * 6 }) })} />)}
            <Persona look={TINY} seed={74} luz={RIM.tubo} ruta={[{ f: 0, x: mesa + 200, y: DES_PISO }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: "manosCara" }, { f: k(398.0), v: { hD: 30, cD: 120, hI: 30, cI: 120, tronco: -8 } }]} caras={[{ f: 0, v: "risa" }]} habla={[[k(397.0), k(404.0)]]}
              cartel={{ ...corazon(Math.round(bpm), { tam: 40, desde: k(400.4), rotulo: "TINY" }), claves: [{ f: 0, v: 88 }, { f: k(401.0), v: 174, d: 70 }], latido: bpm }} />
            <Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: mesa - 20, y: DES_PISO }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }, { f: k(401.0), v: "sorpresa" }]} cartel={corazon(84, { tam: 30 })} />
          </>}
          hud={<>
            <Txt t="NEXT WEEK: STRESS" a={k(397.0)} b={k(413.46) + 6} f={f} top={150} tam={66} color="#f4efe4" chip />
            <Txt t="the man who laughs the most" a={k(400.4)} b={k(404.0)} f={f} top={880} tam={56} mano chip />
            <Txt t={"WHAT WOULD YOU EAT?\nTELL US IN THE COMMENTS"} a={k(404.2)} b={k(413.46) + 6} f={f} top={250} tam={64} color={VERDE} chip />
            <BotonSub desde={k(408.2)} f={f} top={820} />
          </>} />
      );
    };
    return <Pl />;
  },
};

export const PLANOS_OB06: PlanB[] = [r01, r02, r03, r03b, r04, r05, r06, r07, r07b, r08, r09, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23, r24, r25, r26, r27, r28];
export const OB06 = armar(PLANOS_OB06);

const HORAS: [number, number | null][] = [[0, 17 * 60 + 12], [4.2, null], [10.42, 5 * 60 + 12], [25.22, null], [30.02, 5 * 60 + 20], [45.22, null], [79.7, 6 * 60 + 15], [90.42, 9 * 60 + 40], [98.16, 10 * 60 + 2], [104.46, null], [146.76, 11 * 60 + 5], [159.66, null], [170.48, 12 * 60 + 30], [179.32, null], [223.1, 15 * 60 + 40], [226.8, null], [231.4, 15 * 60 + 52], [240.12, 16 * 60], [286.34, null], [309.98, 16 * 60 + 12], [346.16, 16 * 60 + 18], [363.08, null], [377.98, null], [391.4, 5 * 60 + 12], [396.68, 13 * 60]];
const horaEn = (s: number) => { let h: number | null = null; for (const [t, v] of HORAS) if (s >= t) h = v; return h; };

export const Ob06: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Montaje planos={OB06.planos} />
      <HudSerie part={[{ f: 0, v: 42 }, { f: Math.round(388.52 * 30), v: 41 }]} hora={horaEn(f / 30)} />
    </AbsoluteFill>
  );
};
