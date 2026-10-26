// ob05 · «What If You Could See Everyone's Screen Time?» (Owen Upgraded, sesión B). Plan: D:/rtmp/ob05_PLAN_MxM.md
// Igual que ob04: cada plano va de un segundo de la voz al siguiente; k(seg) = cuadro local de ese segundo.
// El cartel de esta semana es un RELOJ verde (icono reloj, «2h 12m») que cuenta desde la medianoche.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Escena } from "../anikit/escena";
import { Montaje } from "../anikit/montaje";
import { Aula, AULA_PISO } from "../anikit/sets/aula";
import { Celular, Taza } from "../anikit/props";
import { F_HUD, F_MANO } from "../anikit/pantalla";
import { PAL, OWEN, OWEN_CASA, ROSA, DEE, LENA, ABRIGO, TEEN, OBRERO, ESTUDIANTE, SCRUBS, SENORA, RUNNER, FUMADOR, NENE, RIM, VERDE } from "../owen/elenco";
import { TRAJE, pasajero } from "../owen/extras_b";
import { HudSerie, CartelM, ROJO } from "../owen/cartel";
import { Persona, PersonaP } from "../owen/b/gente";
import { armar, PlanB, K, sentadoBus, parado, POSE_CELU_SENTADO, Pizarra, GloboM, Vineta, TarjetaSemana, CeluMensaje, NumeroM, FuenteB } from "../owen/b/lib";
import { BusInterior, Bus9, BUS_PISO, BUS_PUNTOS, ASIENTO_X, alVolante, Volante, marchaParadas, kneelEn } from "../owen/mundo/bus";
import { Ashland, ASH_PISO, ASH_CARRIL } from "../owen/mundo/ashland";
import { TwoFlatCorte, TF_PISO, TF_ARRIBA, TF_PUNTOS } from "../owen/mundo/twoflat";
import { Halden, HAL_PISO, HAL_PUNTOS, LogoHalden } from "../owen/mundo/halden";
import { Living, LIV_PISO, LIV_PUNTOS, Descanso, DES_PISO, DES_PUNTOS } from "../owen/mundo/sala";

const A = TF_ARRIBA, P = TF_PISO, BP = BUS_PISO, LP = LIV_PISO;
const ch = BUS_PUNTOS.chofer;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
// minutos → «2h 12m»
const hm = (v: number) => { const m = Math.max(0, Math.round(v)); return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`; };
// cartel reloj (claves en MINUTOS)
const reloj = (claves: number | { f: number; v: number; d?: number }[], extra: Record<string, unknown> = {}) => ({ claves, icono: "reloj" as const, fmt: hm, ...extra });
const owenVolante = (extra: Partial<PersonaP> = {}): PersonaP => ({
  look: OWEN, ruta: [{ f: 0, x: ch, y: BP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: BUS_PUNTOS.asiento }], poses: [{ f: 0, v: "sentado" }],
  ajuste: alVolante(ch, 1), luz: RIM.tubo, seed: 47, ...extra,
});
const Txt: React.FC<{ t: string; a: number; b: number; f: number; top?: number; left?: number; tam?: number; color?: string; mano?: boolean; rot?: number; chip?: boolean }> = ({ t, a, b, f, top = 150, left, tam = 64, color = "#f4efe4", mano, rot = 0, chip }) => (
  <div style={{ position: "absolute", top, left: left ?? 0, right: left === undefined ? 0 : undefined, textAlign: left === undefined ? "center" : "left", fontFamily: mano ? F_MANO : F_HUD, fontWeight: mano ? 700 : 600, fontSize: tam, color, transform: `rotate(${rot}deg)`, opacity: interpolate(f, [a, a + 6, b - 6, b], [0, 1, 1, 0], cl), textShadow: "0 3px 12px rgba(0,0,0,0.7)", whiteSpace: "pre-line", lineHeight: 1.1 }}>{chip ? <span style={{ background: "rgba(12,16,22,0.72)", padding: "6px 22px", borderRadius: 16 }}>{t}</span> : t}</div>
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
// ====================== 1 · recap: $4.7M de la semana pasada ======================
const q01: PlanB = {
  a: 0, b: 6.26,
  sfx: [[0.1, "whoosh"], [0.6, "roll", -2, { dur: 2.4 }], [3.6, "boom", -6], [5.0, "sparkle", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1300, paradas: [{ x: 1100, num: 30, refugio: true }], autos: 3 }} seed={501} mano={3}
          claves={[mira(0, 1250, 700, 1.0), mira(k(6.26), 1330, 680, 1.25, { curva: "inout" })]}
          medio={<>
            {[[SENORA, 760, 310000], [OBRERO, 1000, 180000], [ESTUDIANTE, 1600, 52000], [RUNNER, 1840, 96000]].map(([l, x, v], i) => <Persona key={i} {...parado(l as any, x as number, ASH_CARRIL - 80, { dir: [{ f: 0, v: i < 2 ? 1 : -1 }], cartel: { claves: v as number, tam: 28, desde: k(0.4) + i * 4 }, seed: 520 + i })} />)}
            <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: 1290, y: ASH_CARRIL - 80 }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(4.0), v: "determinado" }]} miradas={[{ f: 0, v: { x: 0, y: -1 } }]}
              cartel={{ claves: [{ f: 0, v: 4700 }, { f: k(1.0), v: 4700000, d: 70 }], fmt: (v: number) => "$" + Math.round(v).toLocaleString("en-US"), tam: 40 }} />
          </>}
          hud={<Txt t="LAST WEEK" a={0} b={k(3.0)} f={f} top={140} tam={56} color={VERDE} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 2 · el cartel cambia de dólar a reloj: la pregunta ======================
const q02: PlanB = {
  a: 6.26, b: 11.34, trans: { tipo: "luz", d: 10, color: "#d8fff2" },
  sfx: [[6.3, "glitch", -4], [6.9, "whoosh"], [7.6, "tick", 0], [8.2, "tick", 0], [8.9, "slam", -4], [9.6, "tick", -2], [10.2, "tick", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const esReloj = f > k(7.0);
      return (
        <Escena Set={Pizarra} pal={PAL} seed={502} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(11.34), 960, 520, 1.12)]}
          medio={<>
            <CartelM x={960} y={500} claves={esReloj ? [{ f: 0, v: 0 }, { f: k(9.0), v: 437, d: 50 }] : 4700000} fmt={esReloj ? hm : (v: number) => "$" + Math.round(v).toLocaleString("en-US")} icono={esReloj ? "reloj" : "dolar"} tam={96} f={f} />
          </>}
          hud={<Txt t={"How many hours of your life\nwent into a screen today?"} a={k(8.9)} b={k(11.34) + 4} f={f} top={720} tam={62} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 3 · lunes 5:12: lo primero que hace es agarrar el celular ======================
const q03: PlanB = {
  a: 11.34, b: 23.8, trans: { tipo: "fundido", d: 14 },
  sfx: [[11.4, "tick", -2], [12.6, "cloth", -4], [14.2, "cloth", -2], [15.6, "cloth", -2], [16.4, "type", -10, { dur: 2.4 }], [19.0, "glitch", -6], [19.6, "pop", 0], [21.4, "tick", -4], [22.4, "tick", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const mesaX = TF_PUNTOS.cama - 150;
      const agarra = f > k(15.4);
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={503} mano={2.5}
          claves={[mira(0, 520, 180, 1.6), mira(k(14.0), 420, 160, 2.0, { curva: "inout" }), mira(k(19.0), 360, 80, 2.4, { curva: "inout" }), mira(k(23.8), 360, 60, 2.7)]}
          medio={<>
            {/* mesita de luz con el celular que se ilumina */}
            <g transform={`translate(${mesaX},${A})`}><rect x={-60} y={-130} width={120} height={130} rx={6} fill="#6a4a36" /><rect x={-70} y={-140} width={140} height={14} rx={4} fill="#7e5a42" /></g>
            {!agarra && <g transform={`translate(${mesaX},${A - 148})`}><rect x={-26} y={-8} width={52} height={14} rx={4} fill="#15151a" /><rect x={-22} y={-12} width={44} height={6} rx={2} fill="#7ab8ff" opacity={0.6 + 0.4 * Math.sin(f / 3)} /></g>}
            <Persona look={OWEN_CASA} seed={47} luz={{ lado: -1, color: "#9fc4ff", fuerza: 0.5 }} ruta={[{ f: 0, x: TF_PUNTOS.cama + 60, y: A }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 70 }]}
              poses={[{ f: 0, v: { tronco: -30, cabeza: -10, hD: 10, cD: 10, hI: 10, cI: 10, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(13.0), v: { tronco: -30, cabeza: -10, hD: 10, cD: 10, hI: 10, cI: 10, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(14.6), v: { tronco: -12, cabeza: 0, hD: 100, cD: 10, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(15.6), v: { ...POSE_CELU_SENTADO, tronco: -6 } }]}
              caras={[{ f: 0, v: "cansado" }, { f: k(12.2), v: "cansado" }, { f: k(19.4), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: -1, y: 0.3 } }, { f: k(19.4), v: { x: -0.2, y: -1 } }]}
              enManoD={(ff) => ff > k(15.4) ? <Celular s={0.9} brillo="#7ab8ff" /> : null}
              cartel={reloj(0, { texto: f < k(23.8) ? "" : undefined, tam: 34, desde: k(19.0) })} />
          </>}
          hud={<Txt t="every single morning" a={k(16.8)} b={k(19.0)} f={f} left={130} top={180} tam={60} mano rot={-3} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 4 · 0h 04m: cuenta desde la medianoche ======================
const q04: PlanB = {
  a: 23.8, b: 33.48, trans: { tipo: "corte" },
  sfx: [[23.85, "roll", 0, { dur: 1.4 }], [25.3, "ding", -4], [26.0, "slam", -4], [27.1, "tick", -2], [28.2, "tick", -2], [28.9, "whoosh"], [30.2, "type", -10, { dur: 2.8 }], [32.6, "fail", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={504} mano={2}
          claves={[mira(0, 390, 40, 3.0), mira(k(27.0), 380, 70, 2.6, { curva: "inout" }), mira(k(33.48), 380, 60, 2.8)]}
          medio={<Persona look={OWEN_CASA} seed={47} luz={{ lado: -1, color: "#9fc4ff", fuerza: 0.5 }} ruta={[{ f: 0, x: TF_PUNTOS.cama + 60, y: A }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 70 }]}
            poses={[{ f: 0, v: { ...POSE_CELU_SENTADO, tronco: -6 } }, { f: k(25.9), v: { ...POSE_CELU_SENTADO, tronco: -6, cabeza: -14 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(27.0), v: "duda" }, { f: k(30.2), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 0, y: -1 } }, { f: k(27), v: { x: -0.4, y: 0.5 } }]} enManoD={<Celular s={0.9} brillo="#7ab8ff" />}
            cartel={reloj([{ f: 0, v: 0 }, { f: k(24.0), v: 4, d: 30 }], { tam: 36 })} />}
          hud={<>
            <Txt t="awake: 30 seconds" a={k(27.0)} b={k(29.9)} f={f} left={120} top={160} tam={62} mano rot={-3} chip />
            <Vineta x={1180} y={180} w={620} desde={k(29.9)} hasta={k(33.48) + 2} rot={3}>
              <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "noche", luzCocina: false, luzDorm: false }} seed={541} mano={1.5} claves={[mira(0, TF_PUNTOS.cama + 40, A - 120, 2.4)]}
                medio={<Persona look={OWEN_CASA} seed={47} luz={{ lado: -1, color: "#7ab8ff", fuerza: 0.9 }} ruta={[{ f: 0, x: TF_PUNTOS.cama + 60, y: A }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 40 }]}
                  poses={[{ f: 0, v: { ...POSE_CELU_SENTADO, tronco: -40, cabeza: -10 } }]} caras={[{ f: 0, v: "cansado" }]} enManoD={<Celular s={0.9} brillo="#7ab8ff" />} />} />
              <div style={{ position: "absolute", left: 18, top: 12, fontFamily: F_HUD, fontWeight: 600, fontSize: 40, color: "#bfe0ff" }}>2:47 AM</div>
            </Vineta>
          </>} />
      );
    };
    return <Pl />;
  },
};
const q05: PlanB = {
  a: 33.48, b: 38.22, trans: { tipo: "luz", d: 10, color: "#d8fff2" },
  sfx: [[33.5, "slam", -2], [35.6, "slam", -4], [36.84, "slam", -2], [37.3, "heart1", -6]],
  el: (k) => (
    <AbsoluteFill style={{ background: "#0e1a20" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(67,224,180,0.18), rgba(0,0,0,0) 60%)" }} />
      <TarjetaSemana hasta={k(38.22)} lineas={[{ t: "WEEK 5", desde: 0, tam: 150 }, { t: "PARTICIPANT 47", desde: k(35.58), tam: 74, color: VERDE }, { t: "43 STILL IN", desde: k(36.84), tam: 74, color: "#ff8a5a" }]} />
    </AbsoluteFill>
  ),
};

// ====================== 6 · Rosa con el diario del domingo: 0h 11m ======================
const q06: PlanB = {
  a: 38.22, b: 51.4, trans: { tipo: "cortina", lado: -1 },
  sfx: [[38.3, "step", -2], [39.4, "paper", 0], [41.6, "paper", -2], [43.3, "roll", -2], [45.4, "ding", -6], [46.5, "pop", -2], [48.6, "pop", -2], [49.4, "phone_buzz", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba" }} seed={506} mano={3}
          claves={[mira(0, 700, 700, 1.3), mira(k(43.2), 560, 640, 1.8, { curva: "inout" }), mira(k(46.4), 640, 680, 1.6, { curva: "inout" }), mira(k(51.4), 620, 690, 1.7)]}
          medio={<>
            <Persona look={ROSA} seed={12} luz={RIM.cocina} ruta={[{ f: 0, x: TF_PUNTOS.sillaRosa, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 60 }]}
              poses={[{ f: 0, v: { hD: 60, cD: 80, hI: 60, cI: 80, cabeza: 14, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(48.4), v: { hD: 20, cD: 30, hI: 60, cI: 80, pI: 85, rI: -80, pD: 88, rD: -85 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(48.4), v: "feliz" }]} habla={[[k(48.4), k(51.3)]]} miradas={[{ f: 0, v: { x: 0.3, y: 0.6 } }, { f: k(46.6), v: { x: 1, y: 0 } }]}
              enManoD={(ff) => ff < k(48.4) ? <g><rect x={-10} y={-70} width={120} height={150} fill="#ece6d6" stroke="#bdb6a8" strokeWidth={2} /><rect x={6} y={-56} width={88} height={14} fill="#4a4a4a" />{[0, 1, 2, 3, 4].map((r) => <rect key={r} x={6} y={-30 + r * 18} width={88} height={6} fill="#bdb6a8" />)}</g> : null}
              cartel={reloj([{ f: 0, v: 0 }, { f: k(43.4), v: 11, d: 40 }], { tam: 36, rotulo: "ROSA", desde: k(43.2) })} />
            <Persona look={OWEN} seed={47} luz={RIM.cocina} ruta={[{ f: 0, x: 1250, y: P }, { f: k(40.6), x: TF_PUNTOS.sillaOwen + 60, y: P }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: {} }, { f: k(46.4), v: { hD: 60, cD: 60 } }]} caras={[{ f: 0, v: "neutral" }, { f: k(46.4), v: "duda" }, { f: k(49), v: "feliz" }]} habla={[[k(46.4), k(48.3)]]}
              cartel={reloj(34, { tam: 30 })} />
            <GloboM x={TF_PUNTOS.sillaOwen + 40} y={P - 330} texto={"What were\nthe 11 minutes?"} desde={k(46.4)} hasta={k(48.4)} tam={26} lado={-1} />
          </>}
          hud={<Vineta x={1180} y={170} w={600} desde={k(48.9)} hasta={k(51.4) + 2} rot={3}>
            <AbsoluteFill style={{ background: "#1d2a34" }}>
              {/* la videollamada con la hermana en Guadalajara */}
              <div style={{ position: "absolute", left: 40, right: 40, top: 30, bottom: 30, borderRadius: 30, background: "linear-gradient(#f2b45a,#e07a3a)" }} />
              <svg viewBox="0 0 600 340" style={{ position: "absolute", inset: 0 }}><circle cx={300} cy={150} r={70} fill="#c99a78" /><path d="M230,140 q70,-110 140,0 q-10,-60 -70,-62 q-60,2 -70,62 Z" fill="#dcd6cc" /><path d="M190,340 q0,-120 110,-120 q110,0 110,120 Z" fill="#2a6fd6" /><circle cx={278} cy={150} r={6} fill="#222" /><circle cx={322} cy={150} r={6} fill="#222" /><path d="M280,180 q20,16 40,0" stroke="#222" strokeWidth={5} fill="none" /></svg>
              <div style={{ position: "absolute", left: 60, bottom: 46, fontFamily: F_HUD, fontWeight: 600, fontSize: 32, color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>GUADALAJARA · 11:02</div>
            </AbsoluteFill>
          </Vineta>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 7 · el bus: los relojes de todos ======================
const q07: PlanB = {
  a: 51.4, b: 70.22, trans: { tipo: "barrido", d: 10 },
  sfx: [[51.45, "bus_engine", -12, { dur: 18 }], [51.8, "pop", -2], [52.0, "pop", -2], [52.2, "pop", -2], [53.4, "bus_brake", -6], [53.9, "bus_door", -4], [55.3, "roll", -2], [58.0, "pop", 0], [59.6, "roll", -2], [61.3, "crowd", -18, { dur: 6 }], [63.0, "pop", 0], [64.2, "roll", -2, { dur: 3 }], [67.1, "tick", -2], [67.6, "tick", -2], [68.1, "tick", -2], [68.6, "tick", -2], [69.1, "tick", -2], [69.6, "tick", -2]],
  el: (k) => {
    const x2 = ASIENTO_X(2), x4 = ASIENTO_X(4), x7 = ASIENTO_X(7);
    const traje = (ff: number) => 180 + Math.max(0, ff - k(63.0)) * 0.05;
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "alba", avance: marchaParadas([[k(53.4), k(55.0)]], 14) }} seed={507} mano={2.5}
          claves={[mira(0, 1500, 600, 0.72), mira(k(53.6), x2 - 40, 600, 1.6, { curva: "inout" }), mira(k(57.9), x4, 600, 1.6, { curva: "inout" }), mira(k(61.2), x7, 600, 1.5, { curva: "inout" }), mira(k(67.0), x7 + 10, 540, 2.3, { curva: "inout" }), mira(k(70.22), x7 + 10, 530, 2.5)]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "duda" }, { f: k(67.1), v: "sorpresa" }], cartel: reloj(72, { tam: 26 }) })} />
            <Volante />
            {[[1, SCRUBS, 48], [5, FUMADOR, 95], [8, SENORA, 22], [9, RUNNER, 37]].map(([fi, l, v], i) => <Persona key={i} {...sentadoBus(l as any, ASIENTO_X(fi as number), { seed: 540 + i, cartel: reloj(v as number, { tam: 26, desde: k(51.8) + i * 5 }) })} />)}
            <Persona {...sentadoBus(OBRERO, x2, { seed: 551, poses: [{ f: 0, v: POSE_CELU_SENTADO }], enManoD: <Celular s={0.9} brillo="#ffd27a" />, cartel: reloj([{ f: 0, v: 0 }, { f: k(55.3), v: 80, d: 30 }], { tam: 32, desde: k(55.2) }) })} />
            <Persona {...sentadoBus(ESTUDIANTE, x4, { seed: 552, poses: [{ f: 0, v: POSE_CELU_SENTADO }], enManoD: <Celular s={0.9} brillo="#ff6ab4" />, cartel: reloj([{ f: 0, v: 0 }, { f: k(59.6), v: 120, d: 30 }], { tam: 32, desde: k(59.5) }) })} />
            <Persona {...sentadoBus(TRAJE, x7, { seed: 553, poses: [{ f: 0, v: { ...POSE_CELU_SENTADO, hD: 50, cD: 110, cabeza: 10 } }], caras: [{ f: 0, v: "risa" }, { f: k(64.4), v: "feliz" }], enManoD: <Celular s={1.1} brillo="#7dff6a" />, cartel: reloj(f < k(63.0) ? 0 : traje(f), { tam: 36, desde: k(62.9) }) })} />
            {f > k(61.2) && <g opacity={0.8}>{[0, 1, 2].map((i) => <path key={i} d={`M${x7 + 70 + i * 22},${BP - 210 - i * 8} q12,-12 0,-24`} stroke="#f4efe4" strokeWidth={4} fill="none" opacity={0.5 + 0.5 * Math.sin(f / 3 + i)} />)}</g>}
          </>}
          hud={<>
            <Txt t="STOP 7" a={k(53.3)} b={k(57.6)} f={f} left={110} top={150} tam={52} color={VERDE} />
            <Txt t="before 6:30 a.m." a={k(56.2)} b={k(58.0)} f={f} left={110} top={220} tam={56} mano />
            <Txt t="maybe 15" a={k(58.0)} b={k(61.1)} f={f} left={110} top={150} tam={58} mano />
            <Txt t="like a taxi meter" a={k(67.1)} b={k(70.22) + 4} f={f} left={110} top={150} tam={64} mano chip />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 8 · re-gancho: parada 30 ======================
const q08: PlanB = {
  a: 70.22, b: 76.0, trans: { tipo: "fundido", d: 14 },
  sfx: [[70.3, "riser", -2, { dur: 5 }], [70.6, "bus_engine", -10, { dur: 4 }], [74.9, "heart1", -2]],
  el: (k) => {
    const bx = (f: number) => interpolate(f, [0, k(74.6)], [-600, 1500], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 2.4) });
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1400, paradas: [{ x: 1800, num: 30, refugio: true }] }} seed={508} mano={3}
          claves={[mira(0, 1500, 640, 0.85), mira(k(76.0), 1720, 620, 1.4, { curva: "in" })]}
          medio={<Bus9 x={bx(f)} y={ASH_CARRIL} hora="manana" rueda={bx(f) * 0.7} dir={1} gente={0.6} />}
          hud={<>
            <Txt t="STOP 30" a={k(71.2)} b={k(76.0) + 4} f={f} top={160} tam={72} color={VERDE} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 60, color: ROJO, opacity: interpolate(f, [k(72.6), k(73)], [0, 1], cl) * (0.6 + 0.4 * Math.sin(f / 2)), textShadow: "0 0 24px rgba(255,74,90,0.6)" }}>?? h ?? m</div>
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 9 · el dato: 7 h los adultos, 8,5 h los adolescentes ======================
const PANTALLAS = [
  { t: "PHONE", d: "M-14,-26 h28 a6,6 0 0 1 6,6 v40 a6,6 0 0 1 -6,6 h-28 a6,6 0 0 1 -6,-6 v-40 a6,6 0 0 1 6,-6 Z M-4,18 h8" },
  { t: "LAPTOP", d: "M-24,-18 h48 v30 h-48 Z M-32,12 h64 l-6,10 h-52 Z" },
  { t: "TV", d: "M-30,-22 h60 v38 h-60 Z M-12,24 h24 M0,16 v8" },
];
const q09: PlanB = {
  a: 76.0, b: 101.94, trans: { tipo: "cortina", lado: 1 },
  sfx: [[76.05, "whoosh"], [78.2, "pop"], [82.4, "slam", -2], [83.0, "roll", -2, { dur: 2 }], [86.2, "pop"], [86.8, "pop"], [87.4, "pop"], [90.7, "whoosh"], [93.6, "roll", -2, { dur: 2 }], [95.6, "slam", 0], [97.4, "snore", -6, { dur: 2 }], [99.2, "slam", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const teens = f >= k(90.66);
      const cifra = teens ? interpolate(f, [k(91.0), k(95.6)], [0, 8.5], cl) : interpolate(f, [k(83.0), k(85.0)], [0, 7], cl);
      const barSueno = interpolate(f, [k(98.0), k(99.2)], [0, 1], cl);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26", luz: VERDE }} seed={509} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(90.6), 960, 560, 1.06, { curva: "inout" }), mira(k(101.94), 960, 540, 1.12)]}
          medio={<>
            {/* lo que la gente dice vs lo que registra el celular: los dos relojes */}
            {!teens && f < k(82.3) && <g>
              <CartelM x={660} y={460} claves={0} texto="WHAT YOU GUESS" icono="cerebro" tam={46} f={f} desde={k(76.3)} color="#ffc94a" />
              <CartelM x={1260} y={460} claves={0} texto="WHAT IT RECORDS" icono="reloj" tam={46} f={f} desde={k(77.3)} />
              <g transform="translate(960,700)" opacity={interpolate(f, [k(80.4), k(80.8)], [0, 1], cl)}><rect x={-30} y={-90} width={60} height={160} rx={14} fill="#15151a" stroke="#7a8288" strokeWidth={5} /><rect x={-22} y={-78} width={44} height={120} rx={6} fill="#7ab8ff" /></g>
            </g>}
            {f >= k(82.3) && <>
              <NumeroM x={960} y={330} texto={`${cifra.toFixed(teens ? 1 : 0)} HOURS A DAY`} rotulo={teens ? "TEENAGERS · ENTERTAINMENT ONLY" : "THE AVERAGE U.S. ADULT · ONLINE SCREENS"} desde={teens ? k(90.8) : k(82.38)} tam={120} color={teens ? "#ff8a5a" : VERDE} />
              {!teens && PANTALLAS.map((p, i) => <g key={i} opacity={interpolate(f, [k(86.2 + i * 0.6), k(86.5 + i * 0.6)], [0, 1], cl)} transform={`translate(${660 + i * 300},700) scale(2.4)`}><path d={p.d} fill="none" stroke={VERDE} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" /><text y={50} fontFamily={F_HUD} fontWeight={600} fontSize={14} fill={VERDE} textAnchor="middle" letterSpacing={2}>{p.t}</text></g>)}
              {teens && <g transform="translate(560,640)">
                <text x={0} y={-20} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#f4efe4">SCREENS (FUN ONLY)</text>
                <rect x={0} y={0} width={800 * interpolate(f, [k(93.6), k(95.6)], [0, 1], cl)} height={60} rx={12} fill="#ff8a5a" />
                <text x={0} y={130} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#f4efe4" opacity={barSueno}>SLEEP</text>
                <rect x={0} y={150} width={720 * barSueno} height={60} rx={12} fill="#7ab8ff" />
              </g>}
            </>}
          </>}
          hud={<>
            <FuenteB texto={teens ? "Common Sense Media census: media use by tweens and teens" : "Device-tracking studies of U.S. adults (e.g. DataReportal / Nielsen)"} desde={teens ? k(91) : k(82.4)} hasta={teens ? k(101.8) : k(90.5)} />
            <Txt t="and most people have no idea" a={k(99.6)} b={k(101.94) + 4} f={f} top={900} tam={56} mano />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 10 · siempre adivinamos de menos · la abuela es la única honesta ======================
const q10: PlanB = {
  a: 101.94, b: 111.56, trans: { tipo: "corte" },
  sfx: [[102.0, "whoosh"], [103.6, "pop"], [105.0, "roll", -2, { dur: 1.6 }], [106.8, "fail", -6], [107.8, "whoosh"], [109.6, "ding", -2], [110.2, "sparkle", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(107.74)) return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26" }} seed={510} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(107.74), 960, 540, 1.08)]}
          medio={<g transform="translate(560,420)">
            <text x={0} y={0} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#ffc94a" opacity={interpolate(f, [k(103.6), k(104)], [0, 1], cl)}>WHAT THEY SAY</text>
            <rect x={0} y={24} width={360 * interpolate(f, [k(103.8), k(104.6)], [0, 1], cl)} height={70} rx={14} fill="#ffc94a" />
            <text x={0} y={190} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill={VERDE} opacity={interpolate(f, [k(105.0), k(105.4)], [0, 1], cl)}>WHAT THE PHONE RECORDS</text>
            <rect x={0} y={214} width={820 * interpolate(f, [k(105.0), k(106.6)], [0, 1], cl)} height={70} rx={14} fill={VERDE} />
            <text x={420} y={-80} fontFamily={F_MANO} fontWeight={700} fontSize={70} fill="#ff8a9a" textAnchor="middle" opacity={interpolate(f, [k(106.8), k(107.1)], [0, 1], cl)}>always low</text>
          </g>} />
      );
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "manana" }} seed={511} mano={2.5} claves={[mira(k(107.74), 540, 640, 1.8), mira(k(111.56), 520, 640, 2.0)]}
          medio={<Persona look={ROSA} seed={12} luz={RIM.cocina} ruta={[{ f: 0, x: TF_PUNTOS.sillaRosa, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 60 }]}
            poses={[{ f: 0, v: { hD: 60, cD: 80, hI: 60, cI: 80, cabeza: 14, pI: 85, rI: -80, pD: 88, rD: -85 } }]} caras={[{ f: 0, v: "feliz" }]}
            enManoD={<g><rect x={-10} y={-70} width={120} height={150} fill="#ece6d6" stroke="#bdb6a8" strokeWidth={2} /><rect x={6} y={-56} width={88} height={14} fill="#4a4a4a" /></g>}
            carteles={[reloj(11, { tam: 36, rotulo: "ROSA" })]} />}
          hud={<Txt t="✓ the only honest number on Paulina Street" a={k(109.4)} b={k(111.56) + 4} f={f} top={870} tam={52} color={VERDE} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 11 · parada 18: Lena detrás del mostrador, 41 minutos en ráfagas ======================
const q11: PlanB = {
  a: 111.56, b: 129.3, trans: { tipo: "barrido", d: 10 },
  sfx: [[111.6, "bus_brake", -6], [112.2, "bus_door", -4], [113.1, "door_bell", -4], [113.6, "step", -2], [114.0, "step", -2], [115.6, "roll", -2], [116.4, "ding", -4], [117.9, "pop", -2], [118.4, "pop", -2], [118.9, "pop", -2], [119.6, "pour", -8, { dur: 2 }], [122.2, "cup", -4], [124.8, "paper", -4], [127.9, "cup", -6]],
  el: (k) => {
    const CAFE = 1700;
    const Pl: React.FC = () => {
      const f = useF();
      // 41 minutos hechos de ráfagas: el número salta de a 1-2 minutos
      const rafagas = [{ f: 0, v: 0 }, { f: k(115.8), v: 38, d: 20 }, { f: k(117.9), v: 39, d: 3 }, { f: k(118.4), v: 40, d: 3 }, { f: k(118.9), v: 41, d: 3 }];
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1800, cafe: CAFE, paradas: [{ x: 2300, num: 18 }], autos: 2 }} seed={511} mano={3}
          claves={[mira(0, 2100, 760, 0.95), mira(k(114.2), CAFE + 80, 760, 1.5, { curva: "inout" }), mira(k(121.9), CAFE + 120, 740, 1.75, { curva: "inout" }), mira(k(129.3), CAFE + 120, 740, 1.85)]}
          medio={<>
            <Bus9 x={3050} y={ASH_CARRIL} hora="manana" puertas={1} kneel={kneelEn(f, 0, k(129.3))} dir={1} chofer={false} />
            <Persona look={LENA} seed={18} luz={RIM.sol} ruta={[{ f: 0, x: CAFE, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 60, cD: 60 } }, { f: k(119.4), v: { hD: 80, cD: 30 } }, { f: k(122.0), v: { hD: 40, cD: 90, hI: 40, cI: 90 } }, { f: k(125.4), v: "manosCara" }, { f: k(127.4), v: { hD: 60, cD: 40 } }]}
              caras={[{ f: 0, v: "feliz" }, { f: k(122.0), v: "neutral" }, { f: k(125.4), v: "miedo" }, { f: k(127.4), v: "feliz" }]} habla={[[k(122.0), k(127.8)]]}
              enManoD={(ff) => ff > k(119.4) && ff < k(125.4) ? <Taza x={0} y={0} color="#f4efe6" vapor={1} f={ff} /> : null}
              cartel={reloj(rafagas, { tam: 34, rotulo: "LENA", desde: k(115.6) })} />
            {/* el mostrador del café 18 */}
            <g transform={`translate(${CAFE},${ASH_CARRIL - 80})`}><rect x={-150} y={-130} width={300} height={130} rx={8} fill="#7a4a2e" /><rect x={-160} y={-142} width={320} height={16} rx={6} fill="#c9864a" /><rect x={60} y={-190} width={60} height={48} rx={6} fill="#3a3f46" /><rect x={-110} y={-176} width={36} height={34} rx={6} fill="#f4efe6" /></g>
            <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: 2200, y: ASH_CARRIL - 80 }, { f: k(114.6), x: CAFE + 240, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: {} }, { f: k(127.9), v: { hD: 80, cD: 30 } }]} caras={[{ f: 0, v: "feliz" }, { f: k(127.84), v: "duda" }]} enManoD={(ff) => ff > k(127.9) ? <Taza x={0} y={0} color="#f4efe6" vapor={1} f={ff} /> : null}
              cartel={reloj(129, { tam: 30 })} />
            <GloboM x={CAFE + 70} y={ASH_CARRIL - 490} texto={"Phone stays in the back.\nChem exam Thursday!"} desde={k(122.2)} hasta={k(127.6)} tam={24} lado={1} />
          </>}
          hud={<Txt t="1 min here · 2 min there" a={k(117.8)} b={k(121.9)} f={f} left={120} top={160} tam={60} mano rot={-3} chip />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 12 · su propio número en el espejo del bus: 2h 12m a las 9 ======================
const q12: PlanB = {
  a: 129.3, b: 133.74, trans: { tipo: "corte" },
  sfx: [[129.4, "whoosh"], [130.6, "roll", -2], [131.9, "slam", -4], [132.8, "tick", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: (ff: number) => ff * 14 }} seed={512} mano={2}
          claves={[mira(0, ch + 40, 560, 2.2), mira(k(133.74), ch + 10, 520, 2.6, { curva: "inout" })]}
          medio={<><Persona {...owenVolante({ caras: [{ f: 0, v: "duda" }, { f: k(131.9), v: "sorpresa" }], miradas: [{ f: 0, v: { x: -1, y: -0.6 } }], cartel: reloj([{ f: 0, v: 129 }, { f: k(130.6), v: 132, d: 20 }], { tam: 36 }) })} /><Volante /></>}
          hud={<Txt t="and it's only 9 a.m." a={k(131.9)} b={k(133.74) + 4} f={f} left={1160} top={170} tam={60} mano rot={3} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 13 · el celular es una tragamonedas ======================
const RODILLOS = ["💬", "♥", "∅", "♥", "💬", "∅", "★", "∅"];
const q13: PlanB = {
  a: 133.74, b: 151.36, trans: { tipo: "luz", d: 12, color: "#fff3d0" },
  sfx: [[133.8, "whoosh"], [135.7, "slam", -2], [137.0, "unroll", -2], [138.4, "spring", -2], [138.6, "roll", -4, { dur: 2 }], [141.1, "ding", -2], [142.2, "pop", 0], [143.0, "fail", -6], [144.0, "coin_rain", -8, { dur: 2.4 }], [146.8, "spring", -2], [147.0, "roll", -4, { dur: 2 }], [149.2, "tick", -2], [150.0, "spring", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const tiros = [k(138.4), k(146.8), k(150.0)];
      const ult = tiros.filter((t) => f >= t).pop();
      const girando = ult !== undefined && f < ult + 30;
      const res = f < k(141.1) ? 0 : f < k(142.2) ? 0 : f < k(143) ? 1 : 2;
      const palanca = ult !== undefined ? interpolate(f - ult, [0, 6, 16], [0, 1, 0], cl) : 0;
      const cas = f >= k(143.74);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1e1418", luz: "#ffc94a" }} seed={513} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(143.7), 960, 560, 1.04, { curva: "inout" }), mira(k(151.36), 960, 540, 1.12)]}
          medio={<>
            {/* un celular gigante que es una tragamonedas: tirar para actualizar = la palanca */}
            <g transform="translate(860,560)">
              <rect x={-260} y={-380} width={520} height={760} rx={60} fill="#15151a" stroke={cas ? "#ffc94a" : "#3a3a44"} strokeWidth={10} />
              <rect x={-220} y={-330} width={440} height={640} rx={24} fill={cas ? "#2a1a0c" : "#0f1e26"} />
              {[0, 1, 2].map((r) => {
                const sim = girando ? RODILLOS[(Math.floor(f / 2) + r * 3) % RODILLOS.length] : ["💬", "♥", "∅"][res === 0 ? 2 : res === 1 ? r === 1 ? 1 : 0 : 2];
                return <g key={r} transform={`translate(${-140 + r * 140},-20)`}><rect x={-60} y={-90} width={120} height={180} rx={16} fill="#f4efe4" /><text y={30} fontSize={86} textAnchor="middle" fill="#c23a2e" fontFamily={F_HUD} fontWeight={600}>{sim}</text></g>;
              })}
              <text y={-230} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f4efe4" textAnchor="middle">{cas ? "JACKPOT?" : "PULL TO REFRESH"}</text>
              <path d="M0,-300 l-20,30 h40 Z" fill="#f4efe4" opacity={0.6 + 0.4 * Math.sin(f / 4)} />
            </g>
            {/* la palanca */}
            <g transform={`translate(1160,${420 + palanca * 160})`}><rect x={-10} y={0} width={20} height={240 - palanca * 160} fill="#c9ced2" /><circle r={46} fill="#c23a2e" /></g>
            {[["A MESSAGE", 141.1, VERDE], ["A LIKE", 142.2, "#ff8a9a"], ["NOTHING", 143.0, "#9aa4ac"]].map(([t, s, c], i) => <text key={i} x={1480} y={360 + i * 120} fontFamily={F_HUD} fontWeight={600} fontSize={54} fill={c as string} opacity={interpolate(f, [k(s as number), k(s as number) + 5], [0, 1], cl)}>{t as string}</text>)}
            <NumeroM x={1520} y={800} texto="VARIABLE REWARD" desde={k(144.4)} tam={64} color="#ffc94a" rotulo="SAME PATTERN AS A CASINO" ancla="middle" />
          </>}
          hud={<Txt t="the not knowing makes you check again" a={k(148.8)} b={k(151.36) + 4} f={f} top={940} tam={50} mano />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 14 · martes, parada 30: el hombre del abrigo gris = 23h 59m ======================
const q14: PlanB = {
  a: 151.36, b: 182.68, trans: { tipo: "fundido", d: 14 },
  sfx: [[151.4, "bus_brake", -6], [152.0, "tick", -2], [154.9, "bus_door", -2], [155.6, "step", -4], [156.2, "step", -4], [156.8, "step", -4], [158.0, "drone", -6, { dur: 12 }], [159.9, "roll", 0, { dur: 2 }], [162.0, "boom", -2], [164.9, "glitch", -4], [168.9, "heart1", -4], [172.7, "glitch", -6], [173.4, "sparkle", -8], [178.1, "bus_door", -2], [179.7, "step", -4], [180.5, "wind", -10, { dur: 2 }]],
  el: (k) => {
    const x9 = ASIENTO_X(9);
    const Pl: React.FC = () => {
      const f = useF();
      const muñeca = f >= k(172.66) && f < k(178.0);
      const pf = (ff: number) => interpolate(ff, [k(154.6), k(155.0), k(157.0), k(157.4), k(177.8), k(178.2), k(179.6), k(180.0)], [0, 1, 1, 0, 0, 1, 1, 0], cl);
      if (muñeca) return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: (ff: number) => ff * 14 }} seed={5141} mano={1.5} claves={[mira(k(172.66), x9 - 30, 640, 2.6), mira(k(178.0), x9 - 40, 660, 3.4)]}
          medio={<>
            <Persona {...sentadoBus(ABRIGO, x9, { seed: 9, dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 40, cD: 80, hI: 40, cI: 80, pI: 85, rI: -80, pD: 88, rD: -85 } }], caras: [{ f: 0, v: "neutral" }],
              enManoD: <g transform="translate(0,-26)"><circle r={22} fill="#7ab8ff" opacity={0.18 + 0.12 * Math.sin(f / 6)} /><rect x={-7} y={-16} width={14} height={32} rx={5} fill="#f4f6f8" stroke="#c9d0d6" strokeWidth={2} /><rect x={-4} y={-6} width={8} height={12} rx={2} fill="#7ab8ff" opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 6))} /></g> })} />
          </>}
          hud={<Txt t="HALDEN CLINIC · glowing on his wristband" a={k(174.4)} b={k(178.0)} f={f} top={160} tam={56} color="#bfe0ff" chip />} />
      );
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: marchaParadas([[0, k(157.6)], [k(177.6), k(180.2)]], 14), puertaF: pf }} seed={514} mano={2.5}
          claves={[mira(0, 760, 620, 1.2), mira(k(158.6), 820, 560, 1.7, { curva: "inout" }), mira(k(162.0), 880, 500, 2.4, { curva: "inout" }), mira(k(167.6), ch + 80, 540, 2.0, { curva: "inout" }), mira(k(170.4), x9 - 60, 600, 1.7, { curva: "inout" }), mira(k(178.0), 700, 620, 1.1, { curva: "inout" }), mira(k(180.4), ch + 60, 580, 2.3, { curva: "inout" }), mira(k(182.68), ch + 60, 590, 2.5)]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "determinado" }, { f: k(162.0), v: "miedo" }, { f: k(169.0), v: "duda" }, { f: k(180.4), v: "miedo" }], giros: [{ f: 0, v: 0 }, { f: k(167.6), v: 0.6 }, { f: k(172), v: 0 }], miradas: [{ f: 0, v: { x: -1, y: 0 } }, { f: k(167.6), v: { x: -1, y: -0.6 } }], cartel: reloj(118, { tam: 26 }) })} />
            <Volante />
            {[[1, SCRUBS, 48], [3, OBRERO, 80], [5, ESTUDIANTE, 140], [7, SENORA, 22]].map(([fi, l, v], i) => <Persona key={i} {...sentadoBus(l as any, ASIENTO_X(fi as number), { seed: 560 + i, poses: [{ f: 0, v: POSE_CELU_SENTADO }], enManoD: <Celular s={0.9} brillo="#7ab8ff" />, cartel: reloj(v as number, { tam: 26 }) })} />)}
            {f < k(179.6) && <Persona look={ABRIGO} seed={9} luz={{ lado: 1, color: "#b8c4cc", fuerza: 0.6 }}
              ruta={[{ f: 0, x: 540, y: BP }, { f: k(155.6), x: 540, y: BP }, { f: k(158.4), x: 900, y: BP }, { f: k(169.4), x: 900, y: BP }, { f: k(171.4), x: x9 + 20, y: BP }, { f: k(177.6), x: x9 + 20, y: BP }, { f: k(179.6), x: 2120, y: BP }]}
              opacidad={(ff) => (ff < k(155.4) ? 0 : 1)} dir={[{ f: 0, v: 1 }, { f: k(171.4), v: -1 }, { f: k(177.8), v: 1 }]}
              asiento={[{ f: 0, v: undefined }, { f: k(171.4), v: undefined }, { f: k(171.8), v: BUS_PUNTOS.asiento }, { f: k(177.4), v: BUS_PUNTOS.asiento }, { f: k(177.8), v: undefined }]}
              poses={[{ f: 0, v: {} }, { f: k(171.8), v: { hD: 40, cD: 80, hI: 40, cI: 80, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(177.8), v: {} }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]}
              cartel={reloj([{ f: 0, v: 0 }, { f: k(159.9), v: 1439, d: 50 }], { tam: 44, desde: k(159.8), color: "#ff6a5a" })} />}
          </>}
          hud={<>
            <Vineta x={1180} y={170} w={620} desde={k(167.6)} hasta={k(170.6)} rot={3} color="#c9d0d6">
              <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: () => 0 }} seed={5142} mano={1} claves={[mira(0, 900, 520, 3.4)]}
                medio={<Persona look={ABRIGO} seed={9} luz={{ lado: 1, color: "#b8c4cc", fuerza: 0.6 }} ruta={[{ f: 0, x: 900, y: BP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }]}
                  cartel={reloj(1439, { tam: 40, color: "#ff6a5a" })} />} />
              <div style={{ position: "absolute", left: 40, top: 30, fontFamily: F_HUD, fontWeight: 600, fontSize: 90, color: "#22303a", background: "rgba(244,246,248,0.8)", padding: "4px 30px", borderRadius: 20 }}>MIRROR</div>
            </Vineta>
            <Txt t="11:00 a.m." a={k(162.4)} b={k(165.6)} f={f} left={120} top={160} tam={62} mano rot={-3} chip />
            <Txt t="no phone in his hands" a={k(169.1)} b={k(172.6)} f={f} top={880} tam={58} mano chip />
            <Txt t="STOP 38" a={k(178.0)} b={k(180.4)} f={f} left={1400} top={160} tam={56} color={VERDE} />
            <Txt t="cold hands on the wheel" a={k(180.5)} b={k(182.68) + 4} f={f} top={880} tam={58} mano chip />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 15 · miércoles: el celular queda en el locker del garaje ======================
const q15: PlanB = {
  a: 182.68, b: 193.32, trans: { tipo: "cortina", lado: -1 },
  sfx: [[182.8, "door", -6], [183.4, "step", -2], [184.0, "step", -2], [185.6, "metal", -4], [186.6, "keys", -4], [187.6, "metal", -2], [188.4, "wood_hit", -4], [189.2, "roll", -2], [190.6, "ding", -4], [192.6, "birds", -10, { dur: 1 }]],
  el: (k) => {
    const L = DES_PUNTOS.lockers - 300 + 3 * 104;
    const Pl: React.FC = () => {
      const f = useF();
      const abre = interpolate(f, [k(185.6), k(186.0), k(187.5), k(187.9)], [0, 1, 1, 0], cl);
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "alba" }} seed={515} mano={2.5}
          claves={[mira(0, 1300, 620, 1.1), mira(k(185.2), L + 60, 600, 1.9, { curva: "inout" }), mira(k(188.8), L, 560, 2.2, { curva: "inout" }), mira(k(193.32), L - 20, 560, 2.3)]}
          medio={<>
            {/* el locker 4 se abre: adentro queda el celular */}
            <g transform={`translate(${L},${DES_PISO - 560})`}>
              <rect x={4} y={4} width={88} height={480} fill="#1d2630" />
              {abre < 0.5 && f > k(187.2) && <g transform="translate(48,220)"><rect x={-14} y={-26} width={28} height={50} rx={5} fill="#15151a" /><rect x={-10} y={-20} width={20} height={36} rx={3} fill="#2a3a4a" /></g>}
              <g transform={`translate(${abre * 4},0) scale(${1 - abre * 0.9},1)`}><rect x={0} y={0} width={96} height={490} fill="#5a7a96" stroke="#2a3a4a" strokeWidth={3} />{[0, 1, 2].map((r) => <rect key={r} x={22} y={30 + r * 14} width={54} height={6} rx={3} fill="#2a3a4a" />)}<text x={48} y={110} fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#f4efe4" textAnchor="middle">47</text></g>
            </g>
            <Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: 900, y: DES_PISO }, { f: k(185.2), x: L - 90, y: DES_PISO }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: "celular" }, { f: k(185.2), v: { hD: 90, cD: 30 } }, { f: k(186.4), v: { hD: 80, cD: 10 } }, { f: k(187.6), v: { hD: 60, cD: 40 } }, { f: k(188.4), v: {} }]}
              caras={[{ f: 0, v: "determinado" }, { f: k(188.6), v: "duda" }, { f: k(191.4), v: "feliz" }]}
              enManoD={(ff) => ff < k(187.0) ? <Celular s={0.9} brillo="#7ab8ff" /> : null}
              cartel={reloj([{ f: 0, v: 17 }, { f: k(189.2), v: 19, d: 20 }], { tam: 36 })} />
          </>}
          hud={<>
            <Txt t="74th Street garage" a={k(183.2)} b={k(186.2)} f={f} left={120} top={160} tam={56} mano rot={-3} chip />
            <Txt t="ALL DAY" a={k(187.8)} b={k(190.4)} f={f} left={1180} top={170} tam={64} color={VERDE} />
            <div style={{ position: "absolute", right: 120, top: 170, fontFamily: F_HUD, fontWeight: 600, fontSize: 56, color: "#ffc94a", opacity: interpolate(f, [k(190.6), k(191)], [0, 1], cl), textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>⏸ STOPPED</div>
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 16 · lo que se veía sin el celular: el skyline, el halcón, el nene que saluda ======================
const q16: PlanB = {
  a: 193.32, b: 209.3, trans: { tipo: "luz", d: 14, color: "#fff3d0" },
  sfx: [[193.4, "bus_engine", -14, { dur: 7 }], [193.9, "sparkle", -6], [196.0, "wind", -12, { dur: 3 }], [200.4, "eagle", -6], [201.4, "flutter", -6], [203.2, "bus_brake", -8], [204.4, "pop", -4], [205.4, "cloth", -4], [206.4, "cloth", -4], [208.4, "sparkle", -2], [208.6, "ding", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const fase = f < k(200.3) ? 0 : f < k(203.06) ? 1 : 2;
      if (fase === 0) {
        const bx = interpolate(f, [0, k(200.3)], [600, 1500], cl);
        return (
          <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1400, autos: 3 }} seed={516} mano={3}
            claves={[mira(0, 900, 760, 1.1), mira(k(195.6), 1200, 420, 0.75, { curva: "inout" }), mira(k(200.3), 1400, 400, 0.72)]}
            medio={<Bus9 x={bx} y={ASH_CARRIL} hora="manana" rueda={bx * 0.7} dir={1} gente={0.5} />}
            hud={<Txt t="a thousand times" a={k(197.9)} b={k(200.3) + 4} f={f} left={1180} top={170} tam={60} mano rot={3} chip />} />
        );
      }
      if (fase === 1) return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1500, paradas: [{ x: 1400, num: 22 }], autos: 1 }} seed={517} mano={2.5}
          claves={[mira(k(200.3), 1640, 320, 2.2), mira(k(203.06), 1640, 300, 2.6)]}
          medio={<>
            {/* el halcón en el poste de luz */}
            <g transform={`translate(1640,${ASH_PISO - 560})`}>
              <rect x={-8} y={0} width={16} height={700} fill="#3a3f46" /><rect x={-70} y={-10} width={140} height={14} rx={6} fill="#3a3f46" />
              <g transform={`translate(30,-14) rotate(${Math.sin(f / 9) * 4})`}>
                <path d="M-30,0 q10,-40 40,-40 q22,0 26,18 l14,4 l-14,6 q-6,30 -36,30 Z" fill="#7a5236" />
                <path d={`M-10,-20 q-50,${-10 - 20 * Math.max(0, Math.sin(f / 5))} -70,10 q40,6 70,0 Z`} fill="#5a3a24" opacity={f > k(201.4) ? 1 : 0} />
                <circle cx={22} cy={-26} r={4} fill="#111" /><path d="M-30,10 l-24,20 l10,-24 Z" fill="#5a3a24" />
              </g>
            </g>
          </>}
          hud={<Txt t="STOP 22" a={k(200.5)} b={k(203.06)} f={f} left={120} top={160} tam={52} color={VERDE} />} />
      );
      const saluda = (ff: number) => ff > k(204.0) ? { hD: 160 + 20 * Math.sin(ff / 2.4), cD: 30 } : {};
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1500, paradas: [{ x: 1700, num: 11 }], autos: 1 }} seed={518} mano={2.5}
          claves={[mira(k(203.06), 1500, 760, 1.2), mira(k(206.2), 1560, 760, 1.5, { curva: "inout" }), mira(k(208.3), 1420, 740, 1.6, { curva: "inout" }), mira(k(209.3), 1420, 740, 1.65)]}
          medio={<>
            <Bus9 x={1250} y={ASH_CARRIL} hora="manana" dir={1} kneel={kneelEn(f, k(203.2), k(209.3))} gente={0.4} />
            <Persona look={NENE} seed={11} luz={RIM.sol} ruta={[{ f: 0, x: 1720, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: {} }]} ajuste={(p: any, ff: number) => ({ ...p, ...saluda(ff) })} caras={[{ f: 0, v: "risa" }, { f: k(206.4), v: "neutral" }, { f: k(208.4), v: "risa" }]} />
            <Persona look={pasajero(4)} seed={575} luz={RIM.sol} ruta={[{ f: 0, x: 1880, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 30, cD: 20 } }]} caras={[{ f: 0, v: "neutral" }]} />
          </>}
          hud={<>
            <Txt t="every bus · every morning · nobody waves back" a={k(205.0)} b={k(208.3)} f={f} top={160} tam={54} mano chip />
            <Txt t="Owen waves back." a={k(208.4)} b={k(209.3) + 6} f={f} top={160} tam={70} color={VERDE} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 17 · Gloria Mark: 2,5 minutos → 47 segundos ======================
const q17: PlanB = {
  a: 209.3, b: 235.36, trans: { tipo: "cortina", lado: 1 },
  sfx: [[209.35, "whoosh"], [211.4, "pop"], [214.0, "type", -10, { dur: 3 }], [217.8, "pop"], [219.6, "roll", -2, { dur: 1.6 }], [222.7, "whoosh"], [224.4, "roll", -2, { dur: 1.6 }], [226.4, "slam", 0], [228.6, "tick", -2, { dur: 2 }], [231.1, "slam", -2], [232.5, "swish", -2], [233.5, "swish", -2], [234.0, "swish", -2], [234.4, "swish", -2], [234.8, "swish", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const final = f >= k(231.14);
      const ventanas = ["MAIL", "CHAT", "NEWS", "VIDEO", "SHOP", "MAPS", "BANK", "PHOTOS"];
      if (final) {
        const n = f < k(232.5) ? 0 : Math.floor((f - k(232.5)) / Math.max(3, 10 - (f - k(232.5)) / 8));
        return (
          <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26" }} seed={5171} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(235.36), 960, 540, 1.2)]}
            medio={<>
              {[0, 1, 2].map((i) => {
                const id = (n + i) % ventanas.length;
                return <g key={i} transform={`translate(${760 + i * 50},${420 + i * 50})`}><rect x={-320} y={-200} width={640} height={400} rx={20} fill="#f4efe4" stroke="#0b1820" strokeWidth={6} /><rect x={-320} y={-200} width={640} height={60} rx={20} fill={["#2a6fd6", "#c23a2e", "#3fa39a", "#ffc94a"][id % 4]} /><text y={30} fontFamily={F_HUD} fontWeight={600} fontSize={80} fill="#22303a" textAnchor="middle">{ventanas[id]}</text></g>;
              })}
              <CartelM x={1500} y={300} claves={0} texto="0:47" icono="reloj" tam={70} f={f} desde={k(231.2)} color="#ff8a5a" />
            </>}
            hud={<Txt t="then something else." a={k(232.5)} b={k(235.36) + 4} f={f} top={900} tam={58} mano chip />} />
        );
      }
      const b1 = interpolate(f, [k(219.6), k(221.2)], [0, 1], cl), b2 = interpolate(f, [k(224.4), k(226.0)], [0, 1], cl);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26" }} seed={517} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(222.6), 960, 560, 1.05, { curva: "inout" }), mira(k(231.14), 960, 520, 1.1)]}
          medio={<>
            <NumeroM x={960} y={230} texto="GLORIA MARK" rotulo="UNIVERSITY OF CALIFORNIA, IRVINE" desde={k(211.3)} tam={84} color="#f4efe4" />
            <g transform="translate(420,460)">
              <text x={0} y={-20} fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#9aa4ac" opacity={interpolate(f, [k(217.8), k(218.2)], [0, 1], cl)}>EARLY 2000s · ONE SCREEN BEFORE SWITCHING</text>
              <rect x={0} y={0} width={1000 * b1} height={80} rx={16} fill={VERDE} />
              <text x={1000 * b1 + 24} y={58} fontFamily={F_HUD} fontWeight={600} fontSize={54} fill={VERDE} opacity={b1}>2½ MIN</text>
              <text x={0} y={190} fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#9aa4ac" opacity={interpolate(f, [k(222.7), k(223.1)], [0, 1], cl)}>RECENT STUDIES</text>
              <rect x={0} y={210} width={313 * b2} height={80} rx={16} fill="#ff8a5a" />
              <text x={313 * b2 + 24} y={268} fontFamily={F_HUD} fontWeight={600} fontSize={64} fill="#ff8a5a" opacity={b2}>47 SEC</text>
            </g>
            <g opacity={interpolate(f, [k(226.4), k(226.8)], [0, 1], cl)} transform="translate(960,900)">
              <rect x={-560} y={-60} width={1120} height={110} rx={55} fill="#0b1820" stroke="#ffc94a" strokeWidth={5} />
              <text y={14} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#ffc94a" textAnchor="middle">AFTER AN INTERRUPTION: 20+ MIN TO GET BACK</text>
            </g>
          </>}
          hud={<FuenteB texto="Gloria Mark, «Attention Span» (2023) and UC Irvine studies" desde={k(212)} hasta={k(231)} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 18 · CTA a mitad: ¿qué diría tu reloj? ======================
const q18: PlanB = {
  a: 235.36, b: 244.36, trans: { tipo: "fundido", d: 14 },
  sfx: [[235.4, "whoosh"], [236.6, "pop", 0], [236.9, "roll", -4, { dur: 2.2 }], [239.2, "ding", -4], [240.2, "pop", 0], [241.2, "pop", 0], [242.2, "riser", -6, { dur: 2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const vals = ["3h 12m", "6h 40m", "1h 05m", "9h 22m", "4h 48m", "2h 31m", "7h 17m"];
      const n = Math.floor(f / 4) % vals.length;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0e1a20" }} seed={518} mano={2} claves={[mira(0, 960, 560, 1.0), mira(k(244.36), 960, 560, 1.1)]}
          medio={<>
            <g transform="translate(960,1000)"><circle cx={0} cy={-420} r={110} fill="#22303a" /><path d="M-200,0 Q-200,-280 0,-280 Q200,-280 200,0 Z" fill="#22303a" /></g>
            <CartelM x={960} y={430} claves={0} icono="reloj" texto={f < k(239.1) ? (f > k(236.9) ? vals[n] : "?h ??m") : "YOU?"} tam={78} f={f} desde={k(236.4)} />
          </>}
          hud={<>
            <Txt t="WHAT WOULD YOURS SAY TODAY?" a={k(236.4)} b={k(244.36) + 6} f={f} top={90} tam={64} />
            <Txt t="BE HONEST  ·  TELL US IN THE COMMENTS" a={k(239.6)} b={k(244.36) + 6} f={f} top={700} tam={44} color={VERDE} chip />
            <BotonSub desde={k(241.1)} f={f} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 19 · miércoles a la noche: Dee, 11h 06m ======================
const q19: PlanB = {
  a: 244.36, b: 268.22, trans: { tipo: "cortina", lado: -1 },
  sfx: [[244.4, "door", -4], [245.2, "step", -2], [245.8, "step", -2], [247.6, "fall", -10], [247.9, "cloth", -2], [251.9, "roll", 0, { dur: 1.6 }], [253.2, "boom", -6], [254.2, "heart", -8, { dur: 2 }], [256.0, "whoosh"], [257.0, "type", -8, { dur: 3 }], [258.6, "beep", -10], [263.2, "step", -4], [263.9, "cloth", -4], [264.4, "type", -6, { dur: 3.6 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const s = LIV_PUNTOS.sofa;
      const OWEN_SOFA = f >= k(263.4);
      return (
        <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={519} mano={2.5}
          claves={[mira(0, 1600, 640, 1.0), mira(k(247.6), s, 640, 1.4, { curva: "inout" }), mira(k(251.8), s - 40, 600, 2.0, { curva: "inout" }), mira(k(255.4), s + 100, 620, 1.5, { curva: "inout" }), mira(k(264.2), s, 640, 1.8, { curva: "inout" }), mira(k(266.6), s - 60, 640, 2.4, { curva: "inout" }), mira(k(268.22), s - 60, 640, 2.5)]}
          medio={<>
            <Persona look={DEE} seed={34} luz={{ lado: -1, color: "#7ab8ff", fuerza: 0.7 }}
              ruta={[{ f: 0, x: LIV_PUNTOS.puerta, y: LP }, { f: k(247.4), x: s - 80, y: LP }]} dir={[{ f: 0, v: -1 }, { f: k(247.5), v: 1 }]}
              asiento={[{ f: 0, v: undefined }, { f: k(247.4), v: undefined }, { f: k(247.8), v: LIV_PUNTOS.asiento }]}
              poses={[{ f: 0, v: "celular" }, { f: k(247.8), v: { ...POSE_CELU_SENTADO, tronco: -10, cabeza: 18 } }]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.7 } }]}
              enManoD={<Celular s={0.9} brillo="#7ab8ff" />}
              cartel={reloj([{ f: 0, v: 0 }, { f: k(251.9), v: 666, d: 24 }], { tam: 44, rotulo: "DEE", desde: k(251.8), color: "#ff8a5a" })} />
            <Persona look={OWEN_CASA} seed={47} luz={RIM.noche} ruta={OWEN_SOFA ? [{ f: 0, x: s + 260, y: LP }, { f: k(264.0), x: s + 90, y: LP }] : [{ f: 0, x: 1480, y: LP }]} dir={[{ f: 0, v: -1 }]}
              asiento={OWEN_SOFA ? [{ f: 0, v: undefined }, { f: k(264.0), v: undefined }, { f: k(264.4), v: LIV_PUNTOS.asiento }] : undefined}
              poses={OWEN_SOFA ? [{ f: 0, v: {} }, { f: k(264.4), v: "sentado" }] : [{ f: 0, v: {} }, { f: k(252.0), v: { hD: 20, cD: 20, hI: 20, cI: 20 } }, { f: k(254.2), v: "manosCara" }, { f: k(255.4), v: {} }]}
              caras={[{ f: 0, v: "feliz" }, { f: k(252.0), v: "sorpresa" }, { f: k(254.2), v: "miedo" }, { f: k(260.8), v: "triste" }]} cartel={reloj(22, { tam: 30, dx: OWEN_SOFA ? 150 : 0 })} />
            {/* los ojos rojos y el pulgar que no para */}
            {f > k(264.8) && <g opacity={0.6 + 0.3 * Math.sin(f / 2)}><circle cx={s - 80 + 18} cy={LP - 300} r={20} fill="#ff4a5a" opacity={0.25} /></g>}
          </>}
          hud={<>
            <Txt t="double shift at Rush" a={k(245.0)} b={k(248.6)} f={f} left={120} top={160} tam={58} mano rot={-3} />
            <Txt t="still in her scrubs" a={k(248.6)} b={k(251.4)} f={f} left={120} top={160} tam={58} mano rot={-3} />
            <Vineta x={1180} y={160} w={620} desde={k(256.0)} hasta={k(263.1)} rot={3}>
              <Escena Set={Halden} pal={PAL} setProps={{ hora: "dia", tablet: "CHART" }} seed={5191} mano={1.5} claves={[mira(0, HAL_PUNTOS.mesa, HAL_PISO - 220, 1.8)]}
                medio={<>
                  <g transform={`translate(${HAL_PUNTOS.mesa + 120},${HAL_PISO - 200})`}><rect x={-120} y={-180} width={240} height={160} rx={10} fill="#22303a" /><rect x={-108} y={-168} width={216} height={136} rx={6} fill="#bfe0f2" />{[0, 1, 2, 3].map((r) => <rect key={r} x={-94} y={-150 + r * 28} width={140 + (r % 2) * 40} height={10} rx={4} fill="#5a7a96" />)}<rect x={-10} y={-20} width={20} height={60} fill="#3a3f46" /></g>
                  <Persona look={DEE} seed={34} luz={RIM.clinica} ruta={[{ f: 0, x: HAL_PUNTOS.mesa - 60, y: HAL_PISO }]} poses={[{ f: 0, v: { hD: 70, cD: 20, hI: 70, cI: 20 } }]} caras={[{ f: 0, v: "cansado" }]} />
                </>} />
              <div style={{ position: "absolute", left: 18, top: 12, fontFamily: F_HUD, fontWeight: 600, fontSize: 34, color: "#22303a", background: "rgba(244,239,228,0.85)", padding: "2px 12px", borderRadius: 10 }}>CHARTING: EVERY PILL, EVERY BP</div>
            </Vineta>
            <Txt t="11 hours is not charting." a={k(260.8)} b={k(263.2)} f={f} top={880} tam={60} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 20 · los ojos: parpadeo a la mitad, 20-20-20 ======================
const OjoM: React.FC<{ x: number; y: number; abre: number; rojo?: number }> = ({ x, y, abre, rojo = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    <path d={`M-200,0 Q0,${-150 * abre} 200,0 Q0,${150 * abre} -200,0 Z`} fill={`rgb(${244},${239 - 120 * rojo},${228 - 120 * rojo})`} stroke="#f4efe4" strokeWidth={8} />
    {abre > 0.15 && <><circle r={70 * Math.min(1, abre * 1.2)} fill="#3a6a8a" /><circle r={32 * Math.min(1, abre * 1.2)} fill="#0b1820" /><circle cx={18} cy={-20} r={10} fill="#fff" /></>}
    {rojo > 0 && [0, 1, 2, 3].map((i) => <path key={i} d={`M${-190 + i * 14},${-6 + i * 4} q30,-10 60,${6 - i * 4}`} stroke="#d84a4a" strokeWidth={3} fill="none" opacity={rojo} />)}
  </g>
);
const q20: PlanB = {
  a: 268.22, b: 291.34, trans: { tipo: "luz", d: 12 },
  sfx: [[268.3, "whoosh"], [270.6, "swish", -8], [271.1, "swish", -8], [271.6, "swish", -8], [272.2, "swish", -8], [273.4, "pop"], [275.8, "roll", -4, { dur: 1.6 }], [277.6, "fail", -8], [278.6, "fire", -14, { dur: 1.6 }], [280.6, "whoosh"], [283.5, "slam", -2], [284.6, "pop"], [285.4, "pop"], [286.3, "pop"], [287.5, "tick", -4, { dur: 2 }], [289.6, "sad", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const regla = f >= k(280.54);
      const ritmo = f < k(273.44) ? 36 : f < k(277.58) ? interpolate(f, [k(273.44), k(275.8)], [36, 90], cl) : 90;
      const ciclo = (f % ritmo) / ritmo;
      const abre = ciclo < 0.08 ? Math.abs(1 - ciclo / 0.04) : 1;
      const rojo = interpolate(f, [k(277.6), k(280.0)], [0, 1], cl);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26" }} seed={520} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(280.5), 960, 540, 1.06, { curva: "inout" }), mira(k(291.34), 960, 560, 1.1)]}
          medio={!regla ? <>
            <OjoM x={960} y={460} abre={abre} rojo={rojo} />
            <NumeroM x={960} y={760} texto={f < k(273.44) ? "15–20 BLINKS / MIN" : "HALF OR LESS"} rotulo={f < k(273.44) ? "NORMAL" : "STARING AT A SCREEN"} desde={k(270.4)} tam={86} color={f < k(273.44) ? VERDE : "#ff8a5a"} />
            {f > k(277.6) && ["DRY", "BURNING", "TIRED"].map((t, i) => <text key={i} x={1460} y={330 + i * 90} fontFamily={F_HUD} fontWeight={600} fontSize={54} fill="#ff8a9a" opacity={interpolate(f, [k(277.6 + i * 0.6), k(277.9 + i * 0.6)], [0, 1], cl)}>{t}</text>)}
          </> : <>
            <NumeroM x={960} y={250} texto="20 · 20 · 20" rotulo="WHAT EYE DOCTORS RECOMMEND" desde={k(281.0)} tam={130} color={VERDE} />
            {[["EVERY 20 MIN", 284.6, "reloj"], ["LOOK 20 FT AWAY", 285.4, "cerebro"], ["FOR 20 SEC", 286.3, "reloj"]].map(([t, s, ic], i) => <CartelM key={i} x={480 + i * 480} y={600} claves={0} texto={t as string} icono={ic as any} tam={40} f={f} desde={k(s as number)} />)}
            <g opacity={interpolate(f, [k(287.5), k(288)], [0, 1], cl)}>
              <CartelM x={960} y={820} claves={666} fmt={hm} icono="reloj" tam={46} f={f} color="#ff8a5a" rotulo="DEE HASN'T LOOKED UP" />
            </g>
          </>}
          hud={<FuenteB texto="American Academy of Ophthalmology; American Optometric Association" desde={k(270.4)} hasta={k(291)} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 21 · la noche: el estudio de Brigham and Women's ======================
const q21: PlanB = {
  a: 291.34, b: 303.94, trans: { tipo: "fundido", d: 12 },
  sfx: [[291.4, "whoosh"], [292.4, "cricket", -16, { dur: 4 }], [294.6, "pop"], [296.4, "tick", -4, { dur: 2 }], [298.6, "roll", -4], [300.6, "snore", -8, { dur: 1.6 }], [302.4, "fail", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const cama = (x: number, tablet: boolean, i: number) => (
        <g transform={`translate(${x},640)`}>
          <rect x={-280} y={0} width={560} height={90} rx={20} fill="#3a4a6a" /><rect x={-300} y={-60} width={40} height={180} rx={10} fill="#5a4a3a" />
          <circle cx={-170} cy={-30} r={44} fill="#e9e4d8" />
          <rect x={-130} y={-50} width={340} height={60} rx={20} fill="#c9d4e8" />
          {tablet ? <g transform="translate(-60,-120)"><rect x={-50} y={-70} width={100} height={130} rx={10} fill="#15151a" /><rect x={-42} y={-62} width={84} height={114} rx={6} fill="#bfe0ff" /><circle r={160} fill="#7ab8ff" opacity={0.12} /></g>
            : <g transform="translate(-60,-120)"><path d="M-60,-40 l60,20 l60,-20 v90 l-60,20 l-60,-20 Z" fill="#f4efe4" stroke="#c9c2b0" strokeWidth={3} /><path d="M0,-20 v90" stroke="#c9c2b0" strokeWidth={3} /></g>}
          <text y={170} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill={tablet ? "#7ab8ff" : "#f2c94a"} textAnchor="middle">{tablet ? "LIGHT-EMITTING TABLET" : "PRINTED BOOK"}</text>
          {[["SLEEP: LATER", 296.4], ["MELATONIN ↓", 298.6], ["GROGGY NEXT DAY", 300.6]].map(([t, s], j) => tablet ? <text key={j} x={300} y={-200 + j * 60} fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#ff8a5a" opacity={interpolate(f, [k(s as number), k(s as number) + 5], [0, 1], cl)} textAnchor="end">{t as string}</text> : null)}
          {!tablet && f > k(300.6) && <text x={140} y={-120} fontFamily={F_MANO} fontWeight={700} fontSize={60} fill="#f2c94a">z z z</text>}
          <text x={0} y={-260} fontSize={1} fill="none">{i}</text>
        </g>
      );
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0b1424", luz: "#7ab8ff" }} seed={521} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(303.94), 960, 560, 1.06)]}
          medio={<>
            <NumeroM x={960} y={200} texto="BRIGHAM AND WOMEN'S HOSPITAL" rotulo="BOSTON · READING BEFORE BED" desde={k(292.2)} tam={60} color="#f4efe4" />
            {cama(560, true, 0)}{cama(1360, false, 1)}
          </>}
          hud={<FuenteB texto="Chang et al., PNAS (2015)" desde={k(293)} hasta={k(303.8)} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 22 · Dee da vuelta el celular: Halden Clinic missing participants ======================
const BUSQUEDAS = [["Halden Clinic", 308.64], ["Halden Clinic complaints", 309.74], ["Halden Clinic missing participants", 311.2], ["Halden Clinic Fulton Market", 313.06]] as const;
const q22: PlanB = {
  a: 303.94, b: 332.72, trans: { tipo: "corte" },
  sfx: [[304.0, "cloth", -4], [306.0, "cloth", -2], [306.6, "whoosh"], [308.7, "type", -8, { dur: 1 }], [309.8, "type", -8, { dur: 1 }], [311.3, "type", -8, { dur: 1.2 }], [311.9, "boom", -8], [313.1, "type", -8, { dur: 1 }], [316.2, "paper", -4], [318.0, "pop", -4], [319.4, "pop", -4], [320.8, "pop", -4], [322.0, "glitch", -6], [325.4, "drone", -8, { dur: 7 }], [328.9, "heart1", -4], [332.2, "cloth", -6]],
  el: (k) => {
    const s = LIV_PUNTOS.sofa;
    const Pl: React.FC = () => {
      const f = useF();
      const celu = f >= k(306.6) && f < k(325.44);
      if (celu) return (
        <AbsoluteFill style={{ background: "linear-gradient(#1d2a34,#0b1218)" }}>
          <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
            <g transform={`translate(960,${600 + interpolate(f, [k(306.6), k(307.4)], [700, 0], cl)}) scale(1.3)`}>
              <rect x={-330} y={-500} width={660} height={1000} rx={60} fill="#15151a" />
              <rect x={-300} y={-460} width={600} height={920} rx={30} fill="#f4f6f8" />
              <rect x={-270} y={-430} width={540} height={70} rx={35} fill="#e2e6ea" />
              <text x={-240} y={-384} fontFamily={F_HUD} fontWeight={500} fontSize={34} fill="#5a6066">{f < k(316.1) ? (BUSQUEDAS.filter(([, t]) => f >= k(t)).pop()?.[0] ?? "Halden Clinic".slice(0, Math.max(0, Math.floor((f - k(306.9)) / 3)))) : "Halden Clinic forum"}</text>
              {f < k(316.1) ? BUSQUEDAS.map(([t, st], i) => (
                <g key={i} opacity={interpolate(f, [k(st), k(st) + 5], [0, 1], cl)} transform={`translate(-260,${-290 + i * 150})`}>
                  <text fontFamily={F_HUD} fontWeight={600} fontSize={i === 2 ? 33 : 36} fill={i === 2 ? "#c23a2e" : "#1a4fae"}>{t}</text>
                  <rect y={24} width={480} height={10} rx={4} fill="#d6dade" /><rect y={46} width={380} height={10} rx={4} fill="#d6dade" />
                </g>
              )) : [0, 1, 2].map((i) => (
                <g key={i} opacity={interpolate(f, [k(318.0 + i * 1.4), k(318.3 + i * 1.4)], [0, 1], cl)} transform={`translate(-260,${-300 + i * 230})`}>
                  <circle cx={30} cy={30} r={30} fill={["#9a8a7a", "#5a7a96", "#a3646a"][i]} />
                  <text x={76} y={26} fontFamily={F_HUD} fontWeight={600} fontSize={32} fill="#22303a">{["my brother signed up…", "wife stopped answering", "paid study, Chicago"][i]}</text>
                  <text x={76} y={64} fontFamily={F_HUD} fontWeight={500} fontSize={30} fill="#c23a2e">{["Haldon Clinic?", "Halden Clinik", "Haldene clinic"][i]}</text>
                  <rect x={76} y={86} width={400} height={8} rx={4} fill="#d6dade" /><rect x={76} y={104} width={320} height={8} rx={4} fill="#d6dade" />
                </g>
              ))}
            </g>
          </svg>
          <Txt t="She's been reading for days." a={k(314.8)} b={k(316.4)} f={f} top={40} tam={52} color="#f4efe4" mano chip />
          <Txt t="never spelled the same way twice" a={k(322.0)} b={k(325.44) + 4} f={f} top={40} tam={52} color="#ff8a5a" mano chip />
        </AbsoluteFill>
      );
      const final = f >= k(325.44);
      return (
        <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={522} mano={2}
          claves={final ? [mira(k(325.44), s + 40, 600, 2.0), mira(k(328.9), s + 60, 580, 2.4, { curva: "inout" }), mira(k(332.72), s + 80, 570, 2.6, { curva: "inout" })] : [mira(0, s + 40, 620, 1.8), mira(k(306.6), s - 20, 560, 2.3, { curva: "inout" })]}
          medio={<>
            <Persona look={DEE} seed={34} luz={{ lado: -1, color: "#7ab8ff", fuerza: 0.7 }} ruta={[{ f: 0, x: s - 80, y: LP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: LIV_PUNTOS.asiento }]}
              poses={final ? [{ f: 0, v: { hD: 30, cD: 40, cabeza: 6, pI: 85, rI: -80, pD: 88, rD: -85 } }] : [{ f: 0, v: { ...POSE_CELU_SENTADO, tronco: -10, cabeza: 18 } }, { f: k(305.8), v: { hD: 90, cD: 20, pI: 85, rI: -80, pD: 88, rD: -85 } }]}
              caras={final ? [{ f: 0, v: "miedo" }] : [{ f: 0, v: "cansado" }, { f: k(305.8), v: "triste" }]} habla={[[k(325.6), k(328.6)]]}
              enManoD={<Celular s={0.9} brillo="#7ab8ff" />} cartel={reloj(final ? [{ f: 0, v: 701 }, { f: k(325.6), v: 726, d: 30 }] : 701, { tam: 34, rotulo: "DEE", color: "#ff8a5a" })} />
            <Persona look={OWEN_CASA} seed={47} luz={RIM.noche} ruta={[{ f: 0, x: s + 90, y: LP }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: LIV_PUNTOS.asiento }]}
              poses={[{ f: 0, v: "sentado" }]} caras={final ? [{ f: 0, v: "miedo" }, { f: k(328.9), v: "triste" }, { f: k(332.2), v: "determinado" }] : [{ f: 0, v: "duda" }]} habla={[[k(303.94), k(306.0)]]}
              ajuste={(p: any, ff: number) => ff > k(332.24) ? { ...p, cabeza: (p.cabeza ?? 0) + 12 * Math.max(0, Math.sin((ff - k(332.24)) / 3)) } : p}
              cartel={reloj(22, { tam: 30, dx: 150 })} />
            <GloboM x={s + 120} y={LP - 330} texto={"What are you\nlooking at?"} desde={k(304.0)} hasta={k(306.4)} tam={24} lado={-1} />
            <GloboM x={s - 100} y={LP - 340} texto={"Owen…\nare you in this?"} desde={k(325.6)} hasta={k(328.9)} tam={26} lado={1} />
          </>}
          hud={<Txt t="for the first time in five weeks, he doesn't lie" a={k(329.0)} b={k(332.72) + 4} f={f} top={900} tam={50} mano chip />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 23 · jueves: el examen de Lena, 6 minutos y fichas de papel ======================
const q23: PlanB = {
  a: 332.72, b: 346.7, trans: { tipo: "cortina", lado: 1 },
  sfx: [[332.8, "whoosh"], [333.4, "bus_brake", -8], [335.4, "bus_door", -4], [336.6, "step", -2], [337.2, "step", -2], [339.4, "roll", -2], [340.4, "ding", -2], [340.6, "paper", -2], [341.2, "paper", -2], [342.4, "write", -6, { dur: 2 }], [345.1, "fanfare", -10], [345.5, "sparkle", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const aula = f >= k(342.3);
      if (!aula) return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "dia", centro: () => 1500, paradas: [{ x: 1700, num: 0 }], autos: 2 }} seed={523} mano={2.5}
          claves={[mira(0, 1500, 760, 1.1), mira(k(339.4), 1700, 740, 1.5, { curva: "inout" }), mira(k(342.3), 1720, 740, 1.6)]}
          medio={<>
            <Bus9 x={1250} y={ASH_CARRIL} hora="dia" puertas={1} kneel={1} dir={1} chofer={false} />
            <Persona look={LENA} seed={18} luz={RIM.sol} ruta={[{ f: 0, x: 1420, y: ASH_CARRIL - 80 }, { f: k(336.4), x: 1420, y: ASH_CARRIL - 80 }, { f: k(338.4), x: 1720, y: ASH_CARRIL - 80 }]} opacidad={(ff) => (ff < k(336.0) ? 0 : 1)}
              poses={[{ f: 0, v: { hD: 60, cD: 80 } }]} caras={[{ f: 0, v: "miedo" }, { f: k(340.4), v: "determinado" }]}
              enManoD={<g><rect x={-30} y={-20} width={60} height={40} rx={4} fill="#f4efe4" stroke="#bdb6a8" strokeWidth={2} transform="rotate(-8)" /><rect x={-26} y={-24} width={60} height={40} rx={4} fill="#fff7c8" stroke="#bdb6a8" strokeWidth={2} /></g>}
              cartel={reloj([{ f: 0, v: 0 }, { f: k(339.4), v: 6, d: 20 }], { tam: 36, rotulo: "LENA", desde: k(339.3) })} />
          </>}
          hud={<>
            <Txt t="CITY COLLEGE" a={k(335.0)} b={k(338.6)} f={f} top={160} tam={60} color="#f4efe4" />
            <Txt t="paper flashcards" a={k(340.5)} b={k(342.3) + 4} f={f} left={1200} top={180} tam={60} mano rot={3} chip />
          </>} />
      );
      return (
        <Escena Set={Aula} pal={PAL} setProps={{ tiza: "CHEM 101 · FINAL" }} seed={524} mano={2.5}
          claves={[mira(k(342.3), 900, AULA_PISO - 230, 2.0), mira(k(344.6), 1080, AULA_PISO - 240, 1.8, { curva: "inout" }), mira(k(346.7), 1150, AULA_PISO - 240, 1.9)]}
          medio={<Persona look={LENA} seed={18} luz={RIM.cocina} ruta={[{ f: 0, x: 900, y: AULA_PISO }, { f: k(344.4), x: 900, y: AULA_PISO }, { f: k(345.4), x: 1200, y: AULA_PISO }]} correr={0.6}
            asiento={[{ f: 0, v: 62 }, { f: k(343.8), v: 62 }, { f: k(344.2), v: undefined }]}
            poses={[{ f: 0, v: { hD: 60, cD: 100, pI: 85, rI: -80, pD: 88, rD: -85, cabeza: 18 } }, { f: k(344.2), v: {} }, { f: k(345.1), v: { hD: 170, cD: 10, hI: 160, cI: 20 } }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(345.1), v: "risa" }]}
            enManoD={(ff) => ff > k(345.0) ? <g transform={`rotate(${Math.sin(ff / 2) * 20})`}><rect x={-30} y={-20} width={60} height={40} rx={4} fill="#fff7c8" stroke="#bdb6a8" strokeWidth={2} /></g> : null}
            enManoI={(ff) => ff > k(345.0) ? <g transform={`rotate(${Math.cos(ff / 2) * 20})`}><rect x={-30} y={-20} width={60} height={40} rx={4} fill="#f4efe4" stroke="#bdb6a8" strokeWidth={2} /></g> : null}
            cartel={reloj(6, { tam: 36, rotulo: "LENA" })} />}
          frente={<g transform={`translate(${900 + 70},${AULA_PISO})`}><rect x={-120} y={-108} width={240} height={18} rx={6} fill="#a8794e" /><rect x={-106} y={-90} width={14} height={90} fill="#6a4a30" /><rect x={92} y={-90} width={14} height={90} fill="#6a4a30" /><rect x={-60} y={-120} width={90} height={12} rx={2} fill="#f4efe4" /></g>}
          hud={<div style={{ position: "absolute", right: 140, top: 170, fontFamily: F_MANO, fontWeight: 700, fontSize: 120, color: VERDE, opacity: interpolate(f, [k(345.4), k(345.8)], [0, 1], cl), transform: "rotate(8deg)", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>A?</div>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 24 · viernes 5:12: el número dice cero ======================
const q24: PlanB = {
  a: 346.7, b: 354.14, trans: { tipo: "luz", d: 14, color: "#fff3d0" },
  sfx: [[346.8, "tick", -2], [347.6, "birds", -12, { dur: 3 }], [348.6, "ding", -2], [349.2, "sparkle", -4], [352.3, "wind", -14, { dur: 1.6 }]],
  el: (k) => (
    <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={524} mano={2}
      claves={[mira(0, 480, 160, 1.8), mira(k(348.6), 400, 80, 2.4, { curva: "inout" }), mira(k(354.14), 400, 70, 2.6)]}
      medio={<Persona look={OWEN_CASA} seed={47} luz={RIM.alba} ruta={[{ f: 0, x: TF_PUNTOS.cama + 60, y: A }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 70 }]}
        poses={[{ f: 0, v: { tronco: -12, hD: 10, cD: 10, hI: 10, cI: 10, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(352.2), v: { hD: 150, cD: 20, hI: 150, cI: 20, pI: 85, rI: -80, pD: 88, rD: -85 } }]}
        caras={[{ f: 0, v: "neutral" }, { f: k(348.6), v: "sorpresa" }, { f: k(352.2), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0, y: -1 } }]}
        cartel={reloj(0, { tam: 40, desde: k(348.4) })} />}
      hud={<Txt t="phone left downstairs" a={k(350.2)} b={k(352.2)} f={useF()} left={1180} top={180} tam={58} mano rot={3} chip />} />
  ),
};
// ====================== 25 · las 7 llamadas perdidas y el mensaje de Dee ======================
const q25: PlanB = {
  a: 354.14, b: 362.72, trans: { tipo: "corte" },
  sfx: [[354.2, "phone_buzz", -2], [355.9, "phone_buzz", -2], [356.4, "pop", -2], [356.6, "pop", -2], [356.8, "pop", -2], [357.0, "pop", -2], [357.9, "phone_buzz", 0], [358.2, "type", -10, { dur: 4 }], [361.4, "heart1", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const llam = Math.min(7, Math.floor(interpolate(f, [k(354.3), k(355.9)], [1, 7.99], cl)));
      return (
        <AbsoluteFill style={{ background: "linear-gradient(#2a2232, #120e16)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: f >= k(357.9) ? 40 : 380, fontFamily: F_HUD, fontWeight: 600, fontSize: f >= k(357.9) ? 58 : 110, color: "#ff6a5a", textShadow: "0 3px 10px rgba(0,0,0,0.6)", opacity: llam > 0 ? 1 : 0 }}>{llam} MISSED CALLS · DEE</div>
          <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 520, fontFamily: F_HUD, fontWeight: 500, fontSize: 56, color: "#f4efe4", opacity: llam > 0 && f < k(357.9) ? 0.85 : 0 }}>FROM 4:02 AM</div>
          {f >= k(357.9) && <CeluMensaje de="DEE" lineas={["They called me. The clinic.", "Asked if I wanted to be a participant.", "I never gave them my number."]} desde={k(357.9)} escribe={k(358.2)} vibra={2} esc={1.0} />}
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};
// ====================== 26 · no puede comer: desayuno y almuerzo intactos ======================
const q26: PlanB = {
  a: 362.72, b: 369.46, trans: { tipo: "fundido", d: 10 },
  sfx: [[362.8, "plates", -8, { dur: 1.4 }], [364.1, "whoosh"], [364.6, "bag", -4], [366.4, "heart", -8, { dur: 3 }], [368.0, "fail", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      if (f < k(364.08)) return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba" }} seed={526} mano={2.5} claves={[mira(0, TF_PUNTOS.mesa + 40, 680, 2.2), mira(k(364.08), TF_PUNTOS.mesa + 40, 690, 2.4)]}
          medio={<>
            <g transform={`translate(${TF_PUNTOS.mesa - 40},${P - 205})`}><ellipse rx={60} ry={14} fill="#f4f1e6" /><ellipse cx={-10} cy={-6} rx={22} ry={10} fill="#f2c94a" /><rect x={10} y={-14} width={34} height={12} rx={5} fill="#c9864a" /></g>
            <Persona look={OWEN} seed={47} luz={RIM.cocina} ruta={[{ f: 0, x: TF_PUNTOS.sillaOwen, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 60 }]}
              poses={[{ f: 0, v: { hD: 40, cD: 150, hI: 40, cI: 150, cabeza: 18, tronco: 14, pI: 85, rI: -80, pD: 88, rD: -85 } }]} caras={[{ f: 0, v: "triste" }]} cartel={reloj(0, { tam: 30 })} />
          </>}
          hud={<Txt t="no breakfast" a={k(362.8)} b={k(364.08)} f={f} left={130} top={170} tam={60} mano rot={-3} />} />
      );
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "tarde", avance: () => 0 }} seed={527} mano={2.5} claves={[mira(k(364.08), ch + 80, 620, 2.0), mira(k(369.46), ch + 60, 600, 2.3)]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "cansado" }, { f: k(366.4), v: "triste" }], poses: [{ f: 0, v: { ...POSE_CELU_SENTADO, hD: 30, cD: 140, hI: 30, cI: 140 } }], ajuste: undefined, cartel: { claves: 0, icono: "panza", texto: "1½ DAYS", tam: 32, color: "#ff8a5a" } })} />
            <g transform={`translate(${ch + 170},${BP - 160})`}><path d="M-40,0 h80 l-8,50 h-64 Z" fill="#c9a36a" /><text y={34} fontFamily={F_HUD} fontWeight={600} fontSize={16} fill="#5a3a24" textAnchor="middle">LUNCH</text></g>
          </>}
          hud={<Txt t="no lunch" a={k(364.2)} b={k(366.3)} f={f} left={1200} top={170} tam={60} mano rot={3} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 27 · el estrés en la panza: la sangre va a los músculos ======================
const q27: PlanB = {
  a: 369.46, b: 379.9, trans: { tipo: "cortina", lado: 1 },
  sfx: [[369.5, "whoosh"], [371.6, "heart", -6, { dur: 4 }], [373.0, "riser", -8, { dur: 2 }], [376.4, "fail", -6], [377.8, "stamp", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const flujo = interpolate(f, [k(372.0), k(375.6)], [0, 1], cl);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1e1418", luz: "#ff6a5a" }} seed={527} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(379.9), 960, 540, 1.1)]}
          medio={<>
            {/* silueta: la panza se apaga, los brazos y piernas se encienden */}
            <g transform="translate(760,560)">
              <circle cy={-330} r={70} fill="#22303a" stroke="#f4efe4" strokeWidth={5} />
              <path d="M-90,-250 h180 l20,280 h-220 Z" fill="#22303a" stroke="#f4efe4" strokeWidth={5} />
              <ellipse cy={-60} rx={70} ry={60} fill="#f2c94a" opacity={1 - 0.85 * flujo} />
              {[[-150, -180, -160, 80], [150, -180, 160, 80], [-60, 30, -80, 360], [60, 30, 80, 360]].map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ff4a5a" strokeWidth={22 + 18 * flujo} strokeLinecap="round" opacity={0.3 + 0.7 * flujo} />)}
              {Array.from({ length: 8 }).map((_, i) => { const t = ((f / 14 + i / 8) % 1); return <circle key={i} cx={(i % 2 ? 1 : -1) * (20 + 130 * t)} cy={-60 + (i % 4 < 2 ? -120 : 260) * t} r={10} fill="#ff4a5a" opacity={flujo} />; })}
            </g>
            <text x={1180} y={360} fontFamily={F_HUD} fontWeight={600} fontSize={48} fill="#f2c94a" opacity={interpolate(f, [k(372.6), k(373)], [0, 1], cl)}>DIGESTION ↓</text>
            <text x={1180} y={460} fontFamily={F_HUD} fontWeight={600} fontSize={48} fill="#ff4a5a" opacity={interpolate(f, [k(374.2), k(374.6)], [0, 1], cl)}>MUSCLES ↑</text>
            <NumeroM x={1440} y={720} texto="APPETITE: OFF" desde={k(376.4)} tam={70} color="#ff8a5a" />
            <text x={1440} y={860} fontFamily={F_MANO} fontWeight={700} fontSize={60} fill="#f4efe4" textAnchor="middle" opacity={interpolate(f, [k(377.8), k(378.2)], [0, 1], cl)}>food can wait</text>
          </>}
          hud={<FuenteB texto="Harvard Health Publishing: the gut–stress connection" desde={k(371)} hasta={k(379.8)} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 28 · el mensaje de la Dr. Hale; 42/47 ======================
const q28: PlanB = {
  a: 379.9, b: 392.36, trans: { tipo: "corte" },
  sfx: [[380.0, "tick", -2], [382.1, "phone_buzz", 0], [382.6, "phone_buzz", -2], [383.2, "type", -8, { dur: 6 }], [386.9, "drone", -8, { dur: 5 }], [389.38, "glitch", 0], [389.5, "slam", -2]],
  el: (k) => (
    <AbsoluteFill style={{ background: "linear-gradient(#2a2232, #120e16)" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, rgba(122,184,255,0.25), rgba(0,0,0,0) 55%)" }} />
      <div style={{ position: "absolute", left: 140, top: 150, fontFamily: F_HUD, fontWeight: 600, fontSize: 60, color: "#f4efe4", opacity: interpolate(useF(), [0, 8, k(382.0), k(382.4)], [0, 1, 1, 0], cl) }}>5:12 PM</div>
      <CeluMensaje de="HALDEN CLINIC · DR. IMANI HALE" lineas={["Week 5 complete, participant 47.", "We noticed you haven't been eating.", "We can help with that."]} desde={k(382.1)} escribe={k(383.4)} vibra={2} esc={1.05} />
    </AbsoluteFill>
  ),
};
// ====================== 29 · gancho a ob06: su panza va a poder digerir cualquier cosa ======================
const q29: PlanB = {
  a: 392.36, b: 405.8, trans: { tipo: "fundido", d: 14 },
  sfx: [[392.4, "riser", -4, { dur: 3.6 }], [393.4, "glitch", -6], [396.0, "boom", -4], [396.4, "heart", -8, { dur: 3 }], [399.4, "pop", 0], [400.4, "ding", -4], [402.2, "pop", 0], [404.0, "whoosh"]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const panza = f >= k(393.4);
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "47 / 47" }} seed={529} mano={2.5}
          claves={[mira(0, HAL_PUNTOS.recepcion + 300, 640, 0.9), mira(k(396.0), HAL_PUNTOS.mesa, 600, 1.5, { curva: "inout" }), mira(k(399.4), HAL_PUNTOS.mesa + 80, 640, 1.2, { curva: "inout" }), mira(k(405.8), HAL_PUNTOS.mesa + 80, 640, 1.25)]}
          medio={<>
            {/* una bandeja tapada sobre la mesa de la clínica */}
            <g transform={`translate(${HAL_PUNTOS.mesa + 60},${HAL_PISO - 250})`}><ellipse rx={110} ry={20} fill="#c9ced2" /><path d="M-90,-4 a90,80 0 0 1 180,0 Z" fill="#e9eef2" stroke="#9aa4ac" strokeWidth={4} /><circle cy={-86} r={10} fill="#9aa4ac" /><LogoHalden x={0} y={-40} s={0.5} /></g>
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: HAL_PUNTOS.recepcion, y: HAL_PISO }, { f: k(396.0), x: HAL_PUNTOS.mesa - 200, y: HAL_PISO }]}
              poses={[{ f: 0, v: { hI: 40, cI: 110 } }, { f: k(396.0), v: { hI: 50, cI: 120, hD: 40, cD: 100 } }]} caras={[{ f: 0, v: "cansado" }, { f: k(396.4), v: "duda" }]}
              cartel={panza ? { claves: 0, icono: "panza", texto: "ANYTHING", tam: 36, color: "#ffc94a", desde: k(393.4) } : reloj(0, { tam: 30 })} />
          </>}
          hud={<>
            <Txt t="NEXT WEEK: HIS STOMACH" a={k(396.0)} b={k(405.8) + 6} f={f} top={150} tam={64} color="#f4efe4" chip />
            <Txt t="WHAT'S YOUR SCREEN TIME TODAY? · TELL US IN THE COMMENTS" a={k(399.4)} b={k(405.8) + 6} f={f} top={690} tam={42} color={VERDE} chip />
            <BotonSub desde={k(402.0)} f={f} top={800} />
          </>} />
      );
    };
    return <Pl />;
  },
};

export const PLANOS_OB05: PlanB[] = [q01, q02, q03, q04, q05, q06, q07, q08, q09, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26, q27, q28, q29];
export const OB05 = armar(PLANOS_OB05);

// reloj del día (minutos desde medianoche); null = sin reloj (pizarras / celulares)
const HORAS: [number, number | null][] = [[0, 8 * 60 + 20], [6.26, null], [11.34, 5 * 60 + 12], [33.48, null], [38.22, 5 * 60 + 40], [51.4, 6 * 60 + 18], [76, null], [111.56, 8 * 60 + 52], [129.3, 9 * 60], [133.74, null], [151.36, 10 * 60 + 58], [182.68, 5 * 60 + 2], [193.32, 10 * 60 + 4], [209.3, null], [244.36, 22 * 60 + 40], [268.22, null], [303.94, 23 * 60 + 15], [306.6, null], [325.44, 23 * 60 + 40], [332.72, 12 * 60 + 30], [346.7, 5 * 60 + 12], [354.14, null], [362.72, 6 * 60 + 5], [364.08, 17 * 60], [369.46, null], [392.36, 17 * 60 + 40]];
const horaEn = (s: number) => { let h: number | null = null; for (const [t, v] of HORAS) if (s >= t) h = v; return h; };

export const Ob05: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Montaje planos={OB05.planos} />
      <HudSerie part={[{ f: 0, v: 43 }, { f: Math.round(389.38 * 30), v: 42 }]} hora={horaEn(f / 30)} />
    </AbsoluteFill>
  );
};
