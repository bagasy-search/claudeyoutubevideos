// ob05 · «What If You Could See Everyone's Screen Time?» (Owen Upgraded, sesión B). Plan: D:/rtmp/ob05_PLAN_MxM.md
// Igual que ob04: cada plano va de un segundo de la voz al siguiente; k(seg) = cuadro local de ese segundo.
// El cartel de esta semana es un RELOJ verde (icono reloj, «2h 12m») que cuenta desde la medianoche.
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Halo } from "../anikit/luz";
import { Rot, Acostado, ManoPOV, AppUso, OjoGrande, CuerpoAnat, Flecha, Despertador, CeluPartido, Chispas, FondoCalido, ent } from "./kit";
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
  sfx: [[0.1, "whoosh"], [0.5, "step", -8], [1.0, "roll", -2, { dur: 2.4 }], [2.4, "pop", -4], [3.4, "boom", -6], [4.6, "sparkle", -4], [4.7, "cloth", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const Y = ASH_CARRIL - 80;
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1300, paradas: [{ x: 1040, num: 30, refugio: true }], autos: 3 }} seed={501} mano={3}
          claves={[mira(0, 1250, 870, 1.05), mira(k(1.2), 1270, 880, 1.2, { curva: "inout" }), mira(k(3.4), 1310, 905, 2.05, { curva: "inout" }), mira(k(6.26), 1310, 900, 2.2)]}
          medio={<>
            <Persona {...parado(SENORA, 0, Y, { ruta: [{ f: 0, x: 560, y: Y }, { f: k(1.6), x: 700, y: Y }, { f: k(2.4), x: 700, y: Y }, { f: k(4.4), x: 420, y: Y }], cartel: { claves: 310000, tam: 26 }, caras: [{ f: 0, v: "feliz" }], seed: 520 })} />
            <Persona {...parado(OBRERO, 960, Y, { ruta: [{ f: 0, x: 960, y: Y }, { f: k(2.2), x: 960, y: Y }, { f: k(4.2), x: 640, y: Y }], dir: [{ f: 0, v: 1 }, { f: k(2.2), v: -1 }], poses: [{ f: 0, v: "celular" }], enManoD: <Celular s={0.9} brillo="#ffd27a" />, caras: [{ f: 0, v: "neutral" }, { f: k(3.6), v: "sorpresa" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.6 } }, { f: k(3.6), v: { x: 1, y: -0.3 } }], cartel: { claves: 180000, tam: 26 }, seed: 521 })} />
            <Persona {...parado(ESTUDIANTE, 0, Y, { ruta: [{ f: 0, x: 2050, y: Y }, { f: k(2.0), x: 1720, y: Y }, { f: k(2.6), x: 1720, y: Y }, { f: k(4.4), x: 2120, y: Y }], dir: [{ f: 0, v: -1 }, { f: k(2.6), v: 1 }], poses: [{ f: 0, v: {} }, { f: k(3.0), v: "celular" }], enManoD: (ff) => ff > k(3.0) ? <Celular s={0.9} brillo="#ff6ab4" /> : null, cartel: { claves: 52000, tam: 26 }, seed: 522 })} />
            <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: 1310, y: Y }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: "celular" }, { f: k(2.4), v: { hD: 40, cD: 70 } }, { f: k(3.4), v: "manosCara" }, { f: k(4.6), v: { hI: 150, cI: 20, hD: 40, cD: 80 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(2.4), v: "sorpresa" }, { f: k(4.6), v: "risa" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.7 } }, { f: k(2.4), v: { x: 0.1, y: -1 } }, { f: k(4.6), v: { x: -0.4, y: -0.3 } }]}
              enManoD={<Celular s={0.9} brillo="#7ab8ff" />}
              cartel={{ claves: [{ f: 0, v: 4700 }, { f: k(1.0), v: 4700000, d: 64 }], fmt: (v: number) => "$" + Math.round(v).toLocaleString("en-US"), tam: 44 }} />
          </>}
          hud={<Rot t="LAST WEEK" a={0} b={k(2.3)} tam={60} color={VERDE} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 2 · el cartel cambia de dólar a reloj ======================
const q02: PlanB = {
  a: 6.26, b: 8.92, trans: { tipo: "corte" },
  sfx: [[6.4, "glitch", -4], [6.9, "glitch", -6], [7.3, "whoosh"], [7.35, "sparkle", -4], [7.9, "tick", -2], [8.3, "tick", -2], [8.6, "cloth", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const Y = ASH_CARRIL - 80;
      const esReloj = f >= k(7.3);
      const dig = (n: number) => String(Math.floor(random(`dg${Math.floor(f / 3)}${n}`) * 10));
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1300, paradas: [{ x: 1040, num: 30, refugio: true }], autos: 2 }} seed={502} mano={2.5}
          claves={[mira(0, 1310, 860, 2.5), mira(k(8.92), 1310, 850, 2.8, { curva: "inout" })]}
          medio={<>
            <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: 1310, y: Y }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hI: 150, cI: 20, hD: 40, cD: 80 } }, { f: k(6.6), v: { hD: 30, cD: 40 } }, { f: k(7.6), v: "pensar" }]}
              caras={[{ f: 0, v: "risa" }, { f: k(6.5), v: "duda" }, { f: k(7.4), v: "sorpresa" }, { f: k(8.3), v: "duda" }]} miradas={[{ f: 0, v: { x: -0.4, y: -0.3 } }, { f: k(6.5), v: { x: 0.1, y: -1 } }]}
              enManoD={(ff) => ff < k(7.6) ? <Celular s={0.9} brillo="#7ab8ff" /> : null}
              cartel={esReloj ? { claves: 0, icono: "reloj", texto: `${dig(1)}h ${dig(2)}${dig(3)}m`, tam: 44, desde: k(7.3) } : { claves: 4700000, fmt: (v: number) => "$" + Math.round(v).toLocaleString("en-US"), tam: 44, parpadeo: interpolate(f, [k(6.3), k(7.2)], [0.3, 1.6], cl) }} />
            <Chispas x={1310} y={Y - 400} f={f} desde={k(7.3)} r={170} />
          </>}
          hud={<Rot t="THIS WEEK" a={k(6.4)} b={k(8.92) + 4} tam={60} color={VERDE} pos="izq" top={170} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 2b · la pregunta: la app de Screen Time que trepa ======================
const q02b: PlanB = {
  a: 8.92, b: 11.34, trans: { tipo: "luz", d: 8, color: "#d8fff2" },
  sfx: [[8.95, "whoosh"], [9.2, "roll", -4, { dur: 1.8 }], [9.6, "tick", -6], [10.0, "tick", -6], [10.4, "tick", -6], [10.8, "pop", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const u = interpolate(f, [k(9.1), k(11.0)], [0, 1], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 2) });
      const sube = interpolate(f, [0, 12], [260, 0], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
      return (
        <FondoCalido a="#2a4a50" b="#0c1418">
          <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
            <g transform={`translate(0,${sube}) rotate(${-4 + Math.sin(f / 30) * 1.2},1340,620)`}>
              <ManoPOV x={1240} y={760} s={1.25} />
              <AppUso x={1360} y={560} esc={0.98} min={u * 424} llenar={u} f={f} />
            </g>
          </svg>
          <div style={{ position: "absolute", left: 130, top: 300, width: 860, fontFamily: F_HUD, fontWeight: 600, fontSize: 78, lineHeight: 1.12, color: "#f4efe4", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>
            {["How many hours", "of your life went", "into a screen"].map((l, i) => <div key={i} style={{ opacity: interpolate(f, [4 + i * 6, 10 + i * 6], [0, 1], cl), transform: `translateX(${interpolate(f, [4 + i * 6, 12 + i * 6], [-40, 0], cl)}px)` }}>{l}</div>)}
            <div style={{ color: VERDE, fontSize: 110, opacity: interpolate(f, [k(10.4), k(10.4) + 6], [0, 1], cl), transform: `scale(${interpolate(f, [k(10.4), k(10.4) + 8], [1.4, 1], cl)})`, transformOrigin: "0 50%" }}>today?</div>
          </div>
        </FondoCalido>
      );
    };
    return <Pl />;
  },
};

// ====================== 3 · lunes 5:12: abre los ojos y agarra el celular (acostado, cabeza junto a la mesita) ======================
// Owen acostado con la cabeza a la DERECHA (junto a la mesita y el despertador), pies a la izquierda bajo la frazada.
const PIE_CAMA = { x: 270, y: 238 };
const CAB = -84; // gira la cabeza para que la cara quede derecha aunque el cuerpo esté acostado
const CamaOwen: React.FC<{ f: number; celuEnCama: boolean; luz?: string }> = ({ celuEnCama, f, luz = "#7ab8ff" }) => (
  <g>
    <ellipse cx={538} cy={246} rx={44} ry={20} fill="#f2efe8" stroke="#d6d0c4" strokeWidth={3} />
    {celuEnCama && <g transform="translate(588,262)"><rect x={-22} y={-7} width={44} height={14} rx={4} fill="#15151a" /><rect x={-18} y={-11} width={36} height={6} rx={2} fill={luz} opacity={0.5 + 0.5 * Math.abs(Math.sin(f / 5))} /></g>}
  </g>
);
// frazada de los pies a la cintura (tapa también la almohada del set, que queda a los pies)
const Frazada: React.FC = () => <path d="M96,210 q60,-16 120,-4 q70,12 130,-6 q40,-8 66,4 l6,66 h-326 Z" fill="#4f6fa8" stroke="#3a5288" strokeWidth={4} />;
// despertador grande ENCIMA del chiquito del set (tapa el «5:12» del set)
const Reloj5: React.FC<{ t: string; brillo?: number }> = ({ t, brillo = 1 }) => <Despertador x={640} y={276} t={t} esc={0.95} brillo={brillo} />;
const OWEN_ACOSTADO = (extra: Partial<PersonaP>): PersonaP => ({ look: OWEN_CASA, seed: 47, ruta: [{ f: 0, x: 0, y: 0 }], dir: [{ f: 0, v: -1 }], sombra: 0, luz: { lado: 1, color: "#9fc4ff", fuerza: 0.6 }, ...extra });
const ACOST = (hD: number, cD: number, hI = 4, cI = 6, cab = 0) => ({ hD, cD, hI, cI, cabeza: CAB + cab });
const q03: PlanB = {
  a: 11.34, b: 18.98, trans: { tipo: "fundido", d: 14 },
  sfx: [[11.4, "tick", -2], [12.0, "tick", -6], [12.6, "cloth", -6], [13.9, "cloth", -2], [15.3, "pop", -6], [15.6, "cloth", -4], [16.2, "phone_buzz", -14], [16.6, "type", -12, { dur: 2.2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const agarra = f >= k(15.3);
      const brillo = interpolate(f, [k(15.4), k(16.4)], [0, 1], cl);
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={503} mano={2}
          claves={[mira(0, 400, 225, 2.2), mira(k(12.8), 430, 228, 2.4, { curva: "inout" }), mira(k(14.6), 520, 225, 3.0, { curva: "inout" }), mira(k(18.98), 525, 215, 3.2, { curva: "inout" })]}
          medio={<>
            <CamaOwen f={f} celuEnCama={!agarra} />
            <Acostado x={PIE_CAMA.x} y={PIE_CAMA.y} rot={90}>
              <Persona {...OWEN_ACOSTADO({
                poses: [{ f: 0, v: ACOST(8, 10) }, { f: k(13.9), v: ACOST(8, 10) }, { f: k(14.9), v: ACOST(160, 20, 4, 6, 6) }, { f: k(15.4), v: ACOST(168, 14, 4, 6, 6) }, { f: k(16.3), v: ACOST(12, 72) }],
                caras: [{ f: 0, v: "cansado" }, { f: k(12.6), v: "cansado" }, { f: k(13.0), v: "neutral" }, { f: k(16.2), v: "cansado" }],
                miradas: [{ f: 0, v: { x: 0.2, y: 0 } }, { f: k(13.4), v: { x: 1, y: 0.3 } }, { f: k(16.2), v: { x: -0.6, y: -0.8 } }],
                enManoD: (ff) => ff >= k(15.3) ? <Celular s={1} brillo="#7ab8ff" /> : null,
              })} />
            </Acostado>
            <Frazada />
            {brillo > 0 && <Halo x={470} y={180} r={240} color="#7ab8ff" fuerza={0.45 * brillo} />}
            <Reloj5 t="5:12" brillo={0.5 + 0.5 * Math.abs(Math.sin(f / 8))} />
          </>}
          hud={<Rot t="every single morning" a={k(16.8)} b={k(18.98) + 4} tam={58} mano pos="izq" top={220} rot={-2} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 3b · sobre el celular, en el aire, aparece el cartel verde con el relojito ======================
const q03b: PlanB = {
  a: 18.98, b: 23.8, trans: { tipo: "corte" },
  sfx: [[19.0, "glitch", -6], [19.3, "sparkle", -2], [19.6, "pop", 0], [20.4, "cloth", -6], [21.6, "cloth", -6], [22.6, "pop", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={5031} mano={1.8}
          claves={[mira(0, 520, 200, 3.3), mira(k(20.4), 515, 170, 3.0, { curva: "inout" }), mira(k(23.8), 515, 166, 3.15)]}
          medio={<>
            <CamaOwen f={f} celuEnCama={false} />
            <Acostado x={PIE_CAMA.x} y={PIE_CAMA.y} rot={90}>
              <Persona {...OWEN_ACOSTADO({
                poses: [{ f: 0, v: ACOST(12, 72) }, { f: k(20.0), v: ACOST(16, 80, 4, 6, 6) }, { f: k(21.6), v: ACOST(22, 92, 4, 6, 8) }, { f: k(22.6), v: ACOST(10, 70, 4, 6, 4) }],
                caras: [{ f: 0, v: "cansado" }, { f: k(19.4), v: "sorpresa" }, { f: k(21.6), v: "duda" }, { f: k(22.6), v: "sorpresa" }],
                miradas: [{ f: 0, v: { x: -0.6, y: -0.8 } }, { f: k(19.4), v: { x: -0.3, y: -1 } }],
                enManoD: <Celular s={1} brillo="#7ab8ff" />,
              })} />
            </Acostado>
            <Frazada />
            <Halo x={510} y={190} r={220} color="#7ab8ff" fuerza={0.4} />
            <Reloj5 t="5:12" />
            <CartelM x={420} y={86} claves={0} texto="" icono="reloj" tam={36} f={f} desde={k(19.2)} latido={f > k(22.6) ? 1 : 0} />
            <Chispas x={420} y={62} f={f} desde={k(19.2)} r={60} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 4 · 0h 04m: se sienta en la cama (espalda en el respaldo) y mira el número ======================
const q04: PlanB = {
  a: 23.8, b: 28.78, trans: { tipo: "corte" },
  sfx: [[23.85, "cloth", -4], [23.9, "roll", 0, { dur: 1.4 }], [25.3, "ding", -4], [25.95, "pop", -6], [27.0, "whoosh", -6], [27.3, "tick", -2], [27.9, "tick", -2], [28.5, "tick", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const X = 190;
      const PIER = { pI: 86, rI: 0, pD: 84, rD: 0 };
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={504} mano={2}
          claves={[mira(0, 330, 122, 2.15), mira(k(26.6), 340, 124, 2.15), mira(k(27.4), 410, 130, 2.0, { curva: "inout" }), mira(k(28.78), 415, 130, 2.05)]}
          medio={<>
            <ellipse cx={130} cy={232} rx={40} ry={22} fill="#f2efe8" stroke="#d6d0c4" strokeWidth={3} />
            <Persona look={OWEN_CASA} seed={47} luz={{ lado: 1, color: "#9fc4ff", fuerza: 0.8 }} ruta={[{ f: 0, x: X, y: A }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 122 }]} sombra={0}
              poses={[{ f: 0, v: { ...PIER, hD: 70, cD: 90, cabeza: 14, tronco: -8, hI: 10, cI: 20 } }, { f: k(24.6), v: { ...PIER, hD: 95, cD: 70, cabeza: 0, tronco: -4, hI: 10, cI: 20 } }, { f: k(25.9), v: { ...PIER, hD: 110, cD: 40, cabeza: -8, tronco: 0, hI: 110, cI: 120 } }, { f: k(27.0), v: { ...PIER, hD: 60, cD: 80, cabeza: 4, tronco: 2, hI: 10, cI: 20 } }]}
              caras={[{ f: 0, v: "cansado" }, { f: k(24.3), v: "sorpresa" }, { f: k(25.9), v: "duda" }, { f: k(27.2), v: "sorpresa" }]}
              miradas={[{ f: 0, v: { x: 0.6, y: 0.3 } }, { f: k(24.3), v: { x: 0.4, y: -1 } }, { f: k(27.0), v: { x: 1, y: 0.3 } }]}
              enManoD={<Celular s={1} brillo="#7ab8ff" />}
              cartel={reloj([{ f: 0, v: 0 }, { f: k(23.9), v: 4, d: 36 }], { tam: 44, latido: f > k(25.9) && f < k(26.6) ? 1 : 0 })} />
            <path d="M226,214 q60,-12 120,-2 q80,12 150,-6 q40,-6 62,8 l2,56 h-334 Z" fill="#4f6fa8" stroke="#3a5288" strokeWidth={4} />
            <Reloj5 t="5:12" brillo={interpolate(f, [k(27.2), k(27.6)], [0, 1], cl)} />
          </>}
          hud={<Rot t="awake for 30 seconds" a={k(27.1)} b={k(28.78) + 4} tam={60} mano pos="der" top={330} rot={-2} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 4b · cuenta desde la medianoche: lo que scrolleó a oscuras (2:47 AM) ======================
const q04b: PlanB = {
  a: 28.78, b: 33.48, trans: { tipo: "fundido", d: 10 },
  sfx: [[28.8, "whoosh", -6], [29.4, "cricket", -18, { dur: 3.6 }], [30.2, "type", -12, { dur: 3 }], [31.0, "tick", -6], [31.8, "cloth", -6], [32.6, "fail", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const pulgar = Math.sin(f / 2.2) * 6;
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "noche", luzCocina: false, luzDorm: false }} seed={5041} mano={1.5}
          claves={[mira(0, 470, 215, 2.3), mira(k(33.48), 520, 200, 2.7, { curva: "inout" })]}
          medio={<>
            <CamaOwen f={f} celuEnCama={false} />
            <Acostado x={PIE_CAMA.x} y={PIE_CAMA.y} rot={90}>
              <Persona {...OWEN_ACOSTADO({ luz: { lado: -1, color: "#7ab8ff", fuerza: 1 },
                poses: [{ f: 0, v: ACOST(12 + pulgar * 0.3, 72) }, { f: k(31.6), v: ACOST(18 + pulgar * 0.3, 84) }],
                caras: [{ f: 0, v: "cansado" }, { f: k(31.6), v: "triste" }], miradas: [{ f: 0, v: { x: -0.6, y: -0.8 } }],
                enManoD: <Celular s={1} brillo="#9fd0ff" /> })} />
            </Acostado>
            <Frazada />
            <Halo x={515} y={190} r={300} color="#7ab8ff" fuerza={0.75} />
            <Reloj5 t="2:47" />
            <defs><radialGradient id="noche47" cx={515} cy={185} r={620} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0a1434" stopOpacity={0} /><stop offset="0.35" stopColor="#0a1434" stopOpacity={0.35} /><stop offset="1" stopColor="#0a1434" stopOpacity={0.72} /></radialGradient></defs>
            <rect x={-900} y={-500} width={2400} height={1400} fill="url(#noche47)" />
            <CartelM x={420} y={86} claves={[{ f: 0, v: 0 }, { f: k(29.6), v: 4, d: 80 }]} fmt={hm} icono="reloj" tam={40} f={f} desde={k(29.0)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 5 · semana 5 del estudio · participante 47 · quedan 43 ======================
const BAJAS = [6, 19, 28, 39];
const TableroTrial: React.FC<{ f: number; k: K }> = ({ f, k }) => {
  const x0 = 800, y0 = 330;
  const quedan = Math.round(interpolate(f, [k(36.9), k(37.6)], [47, 43], cl));
  return (
    <g>
      <rect x={760} y={170} width={1090} height={560} rx={22} fill="#20242c" />
      <rect x={772} y={182} width={1066} height={536} rx={14} fill="#f5f8fc" />
      <rect x={772} y={182} width={1066} height={84} rx={14} fill="#2a6fd6" />
      <text x={800} y={238} fontFamily={F_HUD} fontWeight={600} fontSize={42} fill="#ffffff">HALDEN CLINIC · TRIAL HC-12</text>
      <text x={1810} y={240} fontFamily={F_HUD} fontWeight={600} fontSize={52} fill="#ffffff" textAnchor="end" opacity={interpolate(f, [4, 10], [0, 1], cl)}>WEEK 5</text>
      {Array.from({ length: 47 }).map((_, i) => {
        const cx = x0 + (i % 12) * 58 + 20, cy = y0 + Math.floor(i / 12) * 84 + 10;
        const t = interpolate(f, [2 + i * 0.6, 8 + i * 0.6], [0, 1], cl);
        const baja = BAJAS.includes(i) && f >= k(36.84) + BAJAS.indexOf(i) * 4;
        const yo = i === 46;
        const c = baja ? "#c3c8d0" : yo && f >= k(35.58) ? "#3fbf4a" : "#2a6fd6";
        return (
          <g key={i} transform={`translate(${cx},${cy}) scale(${t * (yo && f >= k(35.58) ? interpolate(f, [k(35.58), k(35.58) + 6, k(35.58) + 12], [1, 1.5, 1.25], cl) : 1)})`}>
            {yo && f >= k(35.58) && <circle cy={-4} r={36 + 3 * Math.sin(f / 4)} fill="none" stroke="#3fbf4a" strokeWidth={5} />}
            <circle cy={-24} r={12} fill={c} /><path d="M-17,22 Q-17,-6 0,-6 Q17,-6 17,22 Z" fill={c} />
            {baja && <path d="M-18,-30 L18,20 M18,-30 L-18,20" stroke="#e2483a" strokeWidth={6} strokeLinecap="round" />}
          </g>
        );
      })}
      {f >= k(35.58) && <text x={x0 + 10 * 58 + 20} y={y0 + 3 * 84 + 100} fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#2d8a36" textAnchor="middle" opacity={interpolate(f, [k(35.58), k(35.58) + 6], [0, 1], cl)}>#47 · OWEN</text>}
      <rect x={1560} y={300} width={250} height={340} rx={16} fill="#eaf0f8" />
      <text x={1685} y={360} fontFamily={F_HUD} fontWeight={600} fontSize={32} letterSpacing={2} fill="#6a7280" textAnchor="middle">STILL IN</text>
      <text x={1685} y={520} fontFamily={F_HUD} fontWeight={600} fontSize={160} fill={quedan < 47 ? "#e2483a" : "#2a6fd6"} textAnchor="middle" style={{ fontVariantNumeric: "tabular-nums" }}>{quedan}</text>
      <text x={1685} y={600} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#6a7280" textAnchor="middle">OF 47</text>
    </g>
  );
};
const q05: PlanB = {
  a: 33.48, b: 38.22, trans: { tipo: "luz", d: 10, color: "#d8fff2" },
  sfx: [[33.5, "whoosh"], [33.7, "pop", -6], [34.0, "pop", -8], [35.6, "ding", -2], [36.9, "fail", -6], [37.0, "pop", -4], [37.15, "pop", -4], [37.3, "pop", -4], [37.45, "pop", -4], [37.6, "slam", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "manana" }} seed={505} mano={2}
          claves={[mira(0, 1200, 470, 1.38), mira(k(35.58), 1250, 460, 1.48, { curva: "inout" }), mira(k(38.22), 1250, 462, 1.5)]}
          medio={<>
            <TableroTrial f={f} k={k} />
            <Persona look={OWEN} seed={47} luz={RIM.clinica} escala={1.35} ruta={[{ f: 0, x: 560, y: HAL_PISO + 120 }, { f: k(35.0), x: 640, y: HAL_PISO + 120 }]} dir={[{ f: 0, v: 1 }]} sombra={0}
              poses={[{ f: 0, v: {} }, { f: k(35.6), v: { hD: 125, cD: 10 } }, { f: k(36.9), v: "brazosCruzados" }, { f: k(37.6), v: { hI: 40, cI: 140, hD: 45, cD: 140, cabeza: 6 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(35.6), v: "determinado" }, { f: k(36.9), v: "triste" }, { f: k(37.6), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: -0.6 } }]} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 6 · Rosa con el diario del domingo (diario BAJO: se le ve la cara) ======================
const DIARIO_SENT = { pI: 85, rI: -80, pD: 88, rD: -85 };
const Diario: React.FC<{ hoja: number }> = ({ hoja }) => (
  <g transform={`scale(${hoja},1)`}>
    <rect x={-6} y={-44} width={150} height={92} rx={3} fill="#f3eee2" stroke="#bdb6a8" strokeWidth={2} />
    <text x={69} y={-22} fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#2a2a2a" textAnchor="middle">SUNDAY</text>
    <rect x={6} y={-12} width={60} height={34} fill="#9fb4c8" />
    {[0, 1, 2, 3].map((r) => <rect key={r} x={74} y={-12 + r * 10} width={62} height={4} fill="#bdb6a8" />)}
    {[0, 1].map((r) => <rect key={r} x={6} y={28 + r * 9} width={130} height={4} fill="#bdb6a8" />)}
  </g>
);
const hojaDiario = (f: number, vueltas: number[]) => { let s = 1; for (const v of vueltas) { const t = (f - v) / 8; if (t > 0 && t < 1) s = Math.abs(Math.cos(t * Math.PI)); } return Math.max(0.08, s); };
const RosaLee = (k: K, extra: Partial<PersonaP> = {}): PersonaP => ({
  look: ROSA, seed: 12, luz: RIM.cocina, ruta: [{ f: 0, x: TF_PUNTOS.sillaRosa, y: P }], dir: [{ f: 0, v: 1 }], asiento: [{ f: 0, v: 60 }], ...extra,
});
const q06: PlanB = {
  a: 38.22, b: 43.2, trans: { tipo: "fundido", d: 10 },
  sfx: [[38.3, "paper", -4], [39.4, "paper", 0], [40.2, "step", -6], [40.8, "step", -6], [41.4, "step", -6], [41.6, "paper", -2], [42.4, "cloth", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: true }} seed={506} mano={2.5}
          claves={[mira(0, 590, 735, 2.5), mira(k(40.4), 600, 732, 2.4), mira(k(42.2), 700, 715, 2.0, { curva: "inout" }), mira(k(43.2), 705, 712, 2.0)]}
          medio={<>
            <Persona {...RosaLee(k, {
              poses: [{ f: 0, v: { ...DIARIO_SENT, hD: 48, cD: 48, hI: 50, cI: 44, cabeza: 16, tronco: 4 } }, { f: k(39.3), v: { ...DIARIO_SENT, hD: 48, cD: 48, hI: 70, cI: 70, cabeza: 10, tronco: 4 } }, { f: k(39.9), v: { ...DIARIO_SENT, hD: 48, cD: 48, hI: 50, cI: 44, cabeza: 16, tronco: 4 } }, { f: k(42.2), v: { ...DIARIO_SENT, hD: 48, cD: 48, hI: 50, cI: 44, cabeza: 0, tronco: 0 } }],
              caras: [{ f: 0, v: "feliz" }, { f: k(39.4), v: "sorpresa" }, { f: k(40.2), v: "risa" }, { f: k(42.2), v: "feliz" }],
              miradas: [{ f: 0, v: { x: 0.4, y: 0.8 } }, { f: k(42.2), v: { x: 1, y: -0.2 } }],
              enManoD: (ff) => <Diario hoja={hojaDiario(ff, [k(39.4), k(41.6)])} />,
            })} />
            <Taza x={640} y={680} />
            <Persona look={OWEN} seed={47} luz={RIM.cocina} ruta={[{ f: 0, x: 1250, y: P }, { f: k(40.0), x: 1250, y: P }, { f: k(42.0), x: 860, y: P }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: {} }, { f: k(42.0), v: { hI: 20, cI: 30, hD: 20, cD: 30 } }]} caras={[{ f: 0, v: "neutral" }, { f: k(42.2), v: "feliz" }]} miradas={[{ f: 0, v: { x: -1, y: 0.2 } }]} />
          </>}
          hud={<Rot t="the SUNDAY paper - on Monday" a={k(38.6)} b={k(43.2) + 4} tam={56} mano pos="abajo" rot={-1} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 6b · encima de su cabeza: 0h 11m · Owen pregunta ======================
const q06b: PlanB = {
  a: 43.2, b: 48.4, trans: { tipo: "corte" },
  sfx: [[43.25, "sparkle", -4], [43.3, "pop", 0], [44.2, "roll", -2, { dur: 1.2 }], [45.35, "ding", -4], [46.4, "whoosh", -8], [46.5, "pop", -4], [47.8, "paper", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: true }} seed={5061} mano={2.2}
          claves={[mira(0, 640, 700, 2.2), mira(k(45.3), 620, 690, 2.45, { curva: "inout" }), mira(k(46.3), 690, 700, 2.15, { curva: "inout" }), mira(k(48.4), 700, 700, 2.2)]}
          medio={<>
            <Persona {...RosaLee(k, {
              poses: [{ f: 0, v: { ...DIARIO_SENT, hD: 48, cD: 48, hI: 50, cI: 44, cabeza: 0 } }, { f: k(46.6), v: { ...DIARIO_SENT, hD: 48, cD: 48, hI: 50, cI: 44, cabeza: -6 } }, { f: k(47.6), v: { ...DIARIO_SENT, hD: 30, cD: 30, hI: 110, cI: 60, cabeza: -6 } }],
              caras: [{ f: 0, v: "feliz" }, { f: k(46.6), v: "duda" }, { f: k(47.6), v: "risa" }],
              miradas: [{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(46.6), v: { x: 1, y: -0.5 } }],
              habla: [[k(47.6), k(48.4)]],
              enManoD: <Diario hoja={1} />,
              cartel: reloj([{ f: 0, v: 0 }, { f: k(44.3), v: 11, d: 30 }], { tam: 44, desde: k(43.25), latido: f > k(45.3) && f < k(46.2) ? 1 : 0 }),
            })} />
            <Taza x={640} y={680} />
            <Persona look={OWEN} seed={47} luz={RIM.cocina} ruta={[{ f: 0, x: 860, y: P }, { f: k(46.2), x: 860, y: P }, { f: k(46.9), x: 820, y: P }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hI: 20, cI: 30, hD: 20, cD: 30 } }, { f: k(43.4), v: { hI: 20, cI: 30, hD: 20, cD: 30, cabeza: -10 } }, { f: k(46.4), v: { hD: 110, cD: 20, hI: 30, cI: 60, tronco: 8 } }]}
              caras={[{ f: 0, v: "feliz" }, { f: k(43.4), v: "sorpresa" }, { f: k(46.4), v: "duda" }]} miradas={[{ f: 0, v: { x: -1, y: 0.2 } }, { f: k(43.4), v: { x: -0.7, y: -0.8 } }, { f: k(46.4), v: { x: -1, y: 0 } }]}
              habla={[[k(46.4), k(48.3)]]} />
            <GloboM x={845} y={660} texto={"What were\nthe 11 minutes?"} desde={k(46.45)} hasta={k(48.4) + 2} tam={24} lado={1} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 6c · inserto: la videollamada con la hermana en Guadalajara ======================
const Hermana: React.FC<{ f: number; saluda: number }> = ({ f, saluda }) => {
  const mano = Math.sin(f / 3) * 22 * saluda;
  return (
    <g>
      <rect x={-330} y={-230} width={660} height={460} fill="#f2c14a" />
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${-320 + i * 74},-216 l37,46 l37,-46 Z`} fill={["#e2483a", "#2fa36b", "#2a6fd6", "#ff8ac8", "#ffffff"][i % 5]} />)}
      <path d="M-330,-216 L330,-216" stroke="#7a5a2a" strokeWidth={3} />
      <rect x={150} y={-120} width={140} height={170} rx={8} fill="#7ac8e8" stroke="#fff" strokeWidth={10} />
      <path d="M-170,240 q0,-150 170,-150 q170,0 170,150 Z" fill="#2fa36b" />
      <g transform={`rotate(${mano},140,60)`}><path d="M140,60 l70,-120" stroke="#141418" strokeWidth={22} strokeLinecap="round" /><circle cx={212} cy={-64} r={22} fill="#141418" /></g>
      <circle cx={0} cy={-30} r={112} fill="#141418" />
      <circle cx={0} cy={-150} r={46} fill="#dcd6cc" /><path d="M-104,-60 q0,-108 104,-108 q104,0 104,108 q-30,-62 -104,-62 q-74,0 -104,62 Z" fill="#dcd6cc" />
      <circle cx={-38} cy={-30} r={24} fill="#fff" /><circle cx={38} cy={-30} r={24} fill="#fff" /><circle cx={-34} cy={-26} r={11} fill="#141418" /><circle cx={42} cy={-26} r={11} fill="#141418" />
      <path d={`M-36,30 q36,${28 + 10 * Math.abs(Math.sin(f / 4))} 72,0`} stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />
      <circle cx={-110} cy={0} r={9} fill="#ffc94a" /><circle cx={110} cy={0} r={9} fill="#ffc94a" />
    </g>
  );
};
const q06c: PlanB = {
  a: 48.4, b: 51.4, trans: { tipo: "luz", d: 8, color: "#fff4d8" },
  sfx: [[48.45, "whoosh"], [48.6, "phone_buzz", -8], [49.2, "pop", -4], [50.1, "tick", -8], [50.6, "tick", -8], [51.0, "ding", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const seg = Math.min(660, 640 + Math.floor((f - k(48.6)) / 6));
      const fin = f > k(50.9);
      const sube = interpolate(f, [0, 12], [300, 0], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
      return (
        <FondoCalido a="#6a4a32" b="#24160e">
          <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
            <g transform={`translate(0,${sube}) translate(1000,480) scale(1.22) translate(-1060,-490) rotate(${-3 + Math.sin(f / 26)},1060,560)`}>
              <rect x={640} y={190} width={840} height={600} rx={44} fill="#1d1f24" />
              <svg x={680} y={230} width={760} height={520} viewBox="-380 -260 760 520"><Hermana f={f} saluda={interpolate(f, [k(49.0), k(49.4)], [0, 1], cl)} /></svg>
              <rect x={1240} y={560} width={180} height={150} rx={14} fill="#c0d4e0" stroke="#fff" strokeWidth={5} />
              <circle cx={1330} cy={630} r={42} fill="#141418" /><path d="M1290,604 q40,-50 80,0" fill="#e8e4dc" /><circle cx={1316} cy={628} r={9} fill="#fff" /><circle cx={1344} cy={628} r={9} fill="#fff" />
              <rect x={720} y={262} width={300} height={64} rx={32} fill="rgba(10,12,16,0.7)" />
              <text x={870} y={308} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#fff" textAnchor="middle" style={{ fontVariantNumeric: "tabular-nums" }}>{fin ? "11 min ✓" : `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, "0")}`}</text>
              <circle cx={1060} cy={712} r={34} fill="#e2483a" opacity={fin ? 0.4 : 1} /><path d="M1042,712 h36" stroke="#fff" strokeWidth={8} strokeLinecap="round" />
              <ManoPOV x={600} y={760} s={1.1} rot={-20} />
            </g>
          </svg>
          <div style={{ position: "absolute", left: 120, top: 905, fontFamily: F_HUD, fontWeight: 600, fontSize: 58, color: "#f4efe4", textShadow: "0 4px 14px rgba(0,0,0,0.6)", opacity: interpolate(f, [8, 16], [0, 1], cl) }}>her sister · <span style={{ color: "#ffc94a" }}>Guadalajara</span></div>
        </FondoCalido>
      );
    };
    return <Pl />;
  },
};

// ====================== 7 · el bus: los números están en todos lados ======================
const BUSY = 735; // centro de cámara para planos medios de pasajeros sentados (los anuncios quedan fuera)
const q07: PlanB = {
  a: 51.4, b: 53.32, trans: { tipo: "barrido", d: 10 },
  sfx: [[51.45, "bus_engine", -12, { dur: 18 }], [51.6, "pop", -4], [51.85, "pop", -4], [52.1, "pop", -4], [52.35, "pop", -4], [52.6, "pop", -4], [52.9, "whoosh", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "alba", avance: marchaParadas([], 14) }} seed={507} mano={2.5}
          claves={[mira(0, 1292, 700, 1.52), mira(k(53.32), 1292, 710, 1.62, { curva: "inout" })]}
          medio={<>
            {[[1, SCRUBS, 48, -1], [2, FUMADOR, 95, -1], [3, SENORA, 22, -1], [4, RUNNER, 37, -1], [5, TEEN, 151, -1]].map(([fi, l, v], i) => (
              <Persona key={i} {...sentadoBus(l as any, ASIENTO_X(fi as number), { seed: 540 + i, poses: [{ f: 0, v: i % 2 ? POSE_CELU_SENTADO : "sentado" }], enManoD: i % 2 ? <Celular s={0.9} brillo="#7ab8ff" /> : undefined,
                caras: [{ f: 0, v: "neutral" }, { f: k(51.6) + i * 9 + 6, v: i % 3 === 0 ? "sorpresa" : "neutral" }],
                cartel: reloj(v as number, { tam: 30, desde: k(51.6) + i * 9 }) })} />
            ))}
          </>}
          hud={<Rot t="the numbers are everywhere" a={k(51.6)} b={k(53.32) + 4} tam={56} mano pos="abajo" />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 7b · obrero, parada 7: 1h 20m antes de las 6:30 ======================
const q07b: PlanB = {
  a: 53.32, b: 57.86, trans: { tipo: "corte" },
  sfx: [[53.4, "bus_brake", -6], [53.9, "bus_door", -4], [54.3, "step", -4], [54.8, "step", -4], [55.3, "cloth", -6], [55.4, "roll", -2, { dur: 1.6 }], [57.0, "ding", -4]],
  el: (k) => {
    const x2 = ASIENTO_X(2);
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "alba", avance: marchaParadas([[0, k(54.6)]], 14), puertaF: (ff: number) => interpolate(ff, [k(53.7), k(54.0), k(54.9), k(55.2)], [0, 1, 1, 0], cl) }} seed={5071} mano={2}
          claves={[mira(0, 640, 715, 1.75), mira(k(55.0), x2 - 60, BUSY, 2.35, { curva: "inout" }), mira(k(57.86), x2 - 50, BUSY, 2.45)]}
          medio={<>
            <Persona look={OBRERO} seed={551} luz={{ lado: 1, color: "#d8fff2", fuerza: 0.75 }} ruta={[{ f: 0, x: 520, y: BP }, { f: k(53.9), x: 520, y: BP }, { f: k(54.9), x: x2, y: BP }]} dir={[{ f: 0, v: 1 }, { f: k(54.9), v: -1 }]}
              asiento={[{ f: 0, v: 0 }, { f: k(54.9), v: 0 }, { f: k(55.3), v: BUS_PUNTOS.asiento }]}
              poses={[{ f: 0, v: {} }, { f: k(54.9), v: {} }, { f: k(55.3), v: POSE_CELU_SENTADO }]}
              caras={[{ f: 0, v: "cansado" }, { f: k(55.6), v: "neutral" }, { f: k(57.0), v: "cansado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(55.3), v: { x: -0.3, y: 1 } }]}
              enManoD={(ff) => ff > k(55.2) ? <Celular s={0.9} brillo="#ffd27a" /> : null} enManoI={<g><rect x={-16} y={-4} width={32} height={40} rx={6} fill="#e8b830" stroke="#8a6a1a" strokeWidth={3} /></g>}
              cartel={reloj([{ f: 0, v: 0 }, { f: k(55.4), v: 80, d: 48 }], { tam: 44, desde: k(55.3) })} />
          </>}
          hud={<Rot t="STOP 7 · before 6:30 a.m." a={k(53.5)} b={k(55.2)} tam={54} pos="abajo" color={VERDE} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 7c · una chica de mochila, 15: ya 2 horas ======================
const q07c: PlanB = {
  a: 57.86, b: 61.18, trans: { tipo: "corte" },
  sfx: [[57.9, "whoosh", -8], [58.2, "type", -12, { dur: 1.4 }], [59.45, "roll", -2, { dur: 1.2 }], [60.7, "pop", -2]],
  el: (k) => {
    const x4 = ASIENTO_X(4);
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "alba", avance: marchaParadas([], 14) }} seed={5072} mano={2}
          claves={[mira(0, x4 + 30, BUSY + 10, 2.55), mira(k(61.18), x4 - 10, BUSY, 2.35, { curva: "inout" })]}
          medio={<>
            <Persona {...sentadoBus(ESTUDIANTE, x4, { seed: 552, poses: [{ f: 0, v: { ...POSE_CELU_SENTADO, cabeza: 26 } }, { f: k(59.5), v: { ...POSE_CELU_SENTADO, cabeza: 26, hD: 40, cD: 120 } }, { f: k(60.6), v: { ...POSE_CELU_SENTADO, cabeza: 6, hD: 50, cD: 100 } }],
              caras: [{ f: 0, v: "neutral" }, { f: k(59.5), v: "zombi" }, { f: k(60.6), v: "sorpresa" }], miradas: [{ f: 0, v: { x: -0.4, y: 1 } }, { f: k(60.6), v: { x: 0.2, y: -1 } }],
              enManoD: <Celular s={0.95} brillo="#ff6ab4" />,
              cartel: reloj([{ f: 0, v: 0 }, { f: k(59.45), v: 120, d: 36 }], { tam: 44, desde: k(58.0) }) })} />
          </>}
          hud={<Rot t="maybe 15" a={k(58.1)} b={k(61.18) + 4} tam={58} mano pos="der" top={330} rot={-3} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 7d · el ejecutivo mirando un partido: 3 h y subiendo en tiempo real ======================
const hms = (v: number) => { const s = Math.max(0, Math.floor(v)); return `${Math.floor(s / 3600)}h ${String(Math.floor(s / 60) % 60).padStart(2, "0")}m ${String(s % 60).padStart(2, "0")}s`; };
const q07d: PlanB = {
  a: 61.18, b: 67.08, trans: { tipo: "corte" },
  sfx: [[61.2, "crowd", -16, { dur: 5.8 }], [61.3, "pop", 0], [61.4, "roll", -2, { dur: 1 }], [62.6, "tick", -8], [63.6, "tick", -8], [64.2, "crowd", -8, { dur: 1.2 }], [64.3, "cloth", -4], [64.6, "tick", -8], [65.6, "tick", -8], [66.6, "tick", -8]],
  el: (k) => {
    const x7 = ASIENTO_X(7);
    const Pl: React.FC = () => {
      const f = useF();
      const seg = f < k(61.3) ? 0 : 3 * 3600 + Math.max(0, (f - k(62.2)) / 30) * 1;
      const subeR = interpolate(f, [k(61.3), k(62.2)], [0, 3 * 3600], cl);
      const gol = f > k(64.2) && f < k(65.4);
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "alba", avance: marchaParadas([], 14) }} seed={5073} mano={2}
          claves={[mira(0, x7 + 20, BUSY, 2.3), mira(k(64.2), x7, BUSY - 10, 2.6, { curva: "inout" }), mira(k(67.08), x7, BUSY - 10, 2.55)]}
          medio={<>
            <Persona {...sentadoBus(TRAJE, x7, { seed: 553,
              poses: [{ f: 0, v: { ...POSE_CELU_SENTADO, hD: 50, cD: 110, cabeza: 10 } }, { f: k(64.2), v: { ...POSE_CELU_SENTADO, hD: 60, cD: 100, hI: 150, cI: 20, cabeza: -6 } }, { f: k(65.4), v: { ...POSE_CELU_SENTADO, hD: 50, cD: 110, cabeza: 10 } }],
              caras: [{ f: 0, v: "feliz" }, { f: k(64.2), v: "risa" }, { f: k(65.4), v: "picaro" }], miradas: [{ f: 0, v: { x: -0.5, y: 0.8 } }],
              enManoD: <CeluPartido f={f} s={1.2} />,
              cartel: { claves: 0, texto: hms(f < k(62.2) ? subeR : seg), icono: "reloj", tam: 44, desde: k(61.25), color: f > k(62.2) ? "#ffc94a" : VERDE } })} />
            {[0, 1, 2].map((i) => <path key={i} d={`M${x7 - 120 - i * 22},${BP - 200 - i * 6} q-14,-14 0,-28`} stroke="#f4efe4" strokeWidth={5} fill="none" strokeLinecap="round" opacity={(gol ? 1 : 0.55) * (0.5 + 0.5 * Math.sin(f / 3 + i))} />)}
          </>}
          hud={<Rot t={gol ? "GOOOAL — volume up" : "and climbing · in real time"} a={k(62.4)} b={k(67.08) + 4} tam={52} mano pos="izq" top={300} rot={-2} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 7e · Owen mira el contador como un taxímetro ======================
const q07e: PlanB = {
  a: 67.08, b: 70.22, trans: { tipo: "corte" },
  sfx: [[67.1, "tick", -2], [67.6, "tick", -2], [68.1, "tick", -2], [68.6, "tick", -2], [69.1, "tick", -2], [69.6, "tick", -2], [68.0, "ding", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const seg = 3 * 3600 + (f + k(67.08) - k(62.2)) / 30 + 0 * f;
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "alba", avance: marchaParadas([], 14) }} seed={5074} mano={2}
          claves={[mira(0, 320, 610, 2.0), mira(k(70.22), 300, 600, 2.15, { curva: "inout" })]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "duda" }, { f: k(68.0), v: "sorpresa" }, { f: k(69.2), v: "duda" }], miradas: [{ f: 0, v: { x: 0.6, y: -1 } }, { f: k(68.0), v: { x: 0.8, y: -0.8 } }] })} />
            <Volante />
            {/* el espejo retrovisor: adentro el ejecutivo con su taxímetro amarillo */}
            <g transform="translate(60,590)">
              <rect x={-150} y={-70} width={300} height={140} rx={60} fill="#20242c" />
              <rect x={-138} y={-58} width={276} height={116} rx={52} fill="#c9d6dc" />
              <circle cx={30} cy={10} r={30} fill="#141418" /><path d="M-10,58 q40,-50 80,0" fill="#3a3f4a" /><circle cx={20} cy={6} r={7} fill="#fff" /><circle cx={40} cy={6} r={7} fill="#fff" />
              <path d="M-138,-58 l70,0 l-110,116 Z" fill="#fff" opacity={0.3} />
            </g>
            <CartelM x={60} y={510} claves={0} texto={hms(seg)} icono="reloj" tam={40} f={f} color="#ffc94a" latido={(Math.floor(f / 15) % 2) * 0.6} />
          </>}
          hud={<Rot t="like a taxi meter" a={k(67.4)} b={k(70.22) + 4} tam={60} mano pos="der" top={560} rot={2} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 8 · re-gancho: en la parada 30 espera alguien con un número imposible ======================
const q08: PlanB = {
  a: 70.22, b: 76.0, trans: { tipo: "fundido", d: 12 },
  sfx: [[70.3, "riser", -4, { dur: 4.6 }], [70.4, "bus_engine", -10, { dur: 3 }], [72.4, "bus_brake", -8], [72.9, "glitch", -4], [73.4, "glitch", -6], [74.0, "glitch", -6], [74.94, "heart1", -2], [75.4, "heart1", -6]],
  el: (k) => {
    const bx = (f: number) => interpolate(f, [0, k(72.6)], [-500, 1250], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 2.2) });
    const Pl: React.FC = () => {
      const f = useF();
      const Y = ASH_CARRIL - 80;
      const dig = (n: number) => String(Math.floor(random(`q08${Math.floor(f / 2)}${n}`) * (n === 3 ? 6 : 10)));
      const rojo = f >= k(72.8);
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1500, paradas: [{ x: 1720, num: 30, refugio: true }], autos: 1 }} seed={508} mano={2.5}
          claves={[mira(0, 1250, 760, 1.15), mira(k(72.6), 1450, 790, 1.5, { curva: "inout" }), mira(k(74.9), 1520, 820, 2.3, { curva: "inout" }), mira(k(76.0), 1525, 825, 2.45)]}
          medio={<>
            <Bus9 x={bx(f)} y={ASH_CARRIL} hora="manana" rueda={bx(f) * 0.7} dir={1} gente={0.6} />
            <Persona look={ABRIGO} seed={30} luz={{ lado: -1, color: "#ff4a5a", fuerza: rojo ? 0.9 : 0 }} ruta={[{ f: 0, x: 1560, y: Y }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: "brazosCruzados" }, { f: k(74.9), v: { ...{ hD: 20, cD: 10, hI: 20, cI: 10 }, cabeza: -8 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(74.9), v: "picaro" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(74.9), v: { x: 0.2, y: 0.1 } }]}
              cartel={{ claves: 0, texto: `${dig(1)}${dig(2)}h ${dig(3)}${dig(4)}m`, icono: "reloj", color: "#ff4a5a", tam: 44, desde: k(72.8), parpadeo: 0.8 }} />
          </>}
          hud={<>
            <Rot t="STOP 30" a={k(70.5)} b={k(72.7)} tam={64} color={VERDE} pos="der" top={170} />
            <Rot t="keep that in mind" a={k(74.94)} b={k(76.0) + 4} tam={60} mano pos="izq" top={600} rot={-2} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 9 · el dato real: lo que la gente CREE vs lo que el celular REGISTRA ======================
const SOFA_X = LIV_PUNTOS.sofa;
const q09: PlanB = {
  a: 76.0, b: 82.38, trans: { tipo: "corte" },
  sfx: [[76.05, "whoosh"], [76.3, "stamp", -4], [77.6, "pop", -4], [78.0, "type", -14, { dur: 1.6 }], [79.8, "whoosh", -4], [80.0, "roll", -2, { dur: 1.6 }], [81.6, "ding", -2], [81.8, "cloth", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const u = interpolate(f, [k(80.0), k(81.6)], [0, 1], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 2) });
      const celu = interpolate(f, [k(79.7), k(80.2)], [0, 1], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
      return (
        <Escena Set={Living} pal={PAL} setProps={{ hora: "tarde", tele: false }} seed={509} mano={2}
          claves={[mira(0, SOFA_X + 40, 670, 2.3), mira(k(79.6), SOFA_X + 50, 665, 2.4), mira(k(82.38), SOFA_X + 70, 660, 2.55, { curva: "inout" })]}
          medio={<>
            <Persona look={RUNNER} seed={91} luz={{ lado: 1, color: "#ffd88a", fuerza: 0.7 }} ruta={[{ f: 0, x: SOFA_X - 40, y: LIV_PISO }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: LIV_PUNTOS.asiento }]}
              poses={[{ f: 0, v: POSE_CELU_SENTADO }, { f: k(77.6), v: { ...POSE_CELU_SENTADO, hI: 30, cI: 150, cabeza: -10 } }, { f: k(79.7), v: { ...POSE_CELU_SENTADO, hD: 80, cD: 20, cabeza: 6 } }, { f: k(81.6), v: { pI: 85, rI: -80, pD: 88, rD: -85, hI: 40, cI: 140, hD: 80, cD: 20, cabeza: 6 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(77.6), v: "picaro" }, { f: k(80.4), v: "duda" }, { f: k(81.6), v: "sorpresa" }]}
              miradas={[{ f: 0, v: { x: 0.5, y: 0.8 } }, { f: k(77.6), v: { x: 0.4, y: -1 } }, { f: k(80.2), v: { x: 1, y: 0 } }]}
              enManoD={<Celular s={0.95} brillo="#7ab8ff" />} />
            <GloboM x={SOFA_X - 40} y={592} texto={"about 2 hours,\nmaybe?"} desde={k(77.6)} hasta={k(79.8)} tam={26} lado={1} pensamiento />
            {celu > 0 && <g transform={`translate(${SOFA_X + 290},${650 + (1 - celu) * 200}) scale(${0.3 * celu}) rotate(4)`}><AppUso x={0} y={0} esc={1} min={u * 422} llenar={u} f={f} /></g>}
          </>}
          hud={<>
            <Rot t="THE REAL DATA" a={k(76.1)} b={k(77.5)} tam={64} color={VERDE} />
            <Rot t="what the phone actually records" a={k(80.2)} b={k(82.38) + 4} tam={50} mano pos="abajo" />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 9b · adulto promedio en EE.UU.: ~7 h por día de pantalla conectada (reloj de 24 h) ======================
const Icono: React.FC<{ d: string; x: number; y: number; s: number; t: string; color: string }> = ({ d, x, y, s, t, color }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={46} fill="#0f1e26" stroke={color} strokeWidth={4} />
    <path d={d} fill="none" stroke={color} strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round" />
    <text y={78} fontFamily={F_HUD} fontWeight={600} fontSize={22} fill={color} textAnchor="middle" letterSpacing={2}>{t}</text>
  </g>
);
const PANT = [
  { t: "PHONE", d: "M-12,-24 h24 a5,5 0 0 1 5,5 v38 a5,5 0 0 1 -5,5 h-24 a5,5 0 0 1 -5,-5 v-38 a5,5 0 0 1 5,-5 Z M-4,16 h8", h: 4 },
  { t: "LAPTOP", d: "M-22,-16 h44 v26 h-44 Z M-30,12 h60 l-6,9 h-48 Z", h: 2 },
  { t: "TV", d: "M-28,-20 h56 v34 h-56 Z M-10,22 h20 M0,14 v8", h: 1 },
];
const Fuente: React.FC<{ t: string; a: number; b: number }> = ({ t, a, b }) => {
  const f = useF();
  return <div style={{ position: "absolute", left: 110, bottom: 96, fontFamily: F_HUD, fontWeight: 500, fontSize: 28, color: "#e9e3d6", opacity: ent(f, a, b, 10) * 0.9, textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}>{t}</div>;
};
const arco = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0},${y0} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1},${y1}`;
};
const q09b: PlanB = {
  a: 82.38, b: 90.66, trans: { tipo: "luz", d: 8, color: "#d8fff2" },
  sfx: [[82.4, "slam", -4], [83.0, "roll", -2, { dur: 2 }], [85.1, "ding", -4], [86.2, "pop"], [86.8, "pop"], [87.4, "pop"], [88.4, "whoosh", -8], [89.4, "cloth", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const h = interpolate(f, [k(83.0), k(85.0)], [0, 7], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 2) });
      const CX = 1210, CY = 520, R = 270;
      const ini = interpolate(f, [0, 10], [0, 1], cl);
      let acum = 0;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26", luz: VERDE }} seed={5091} mano={1.5}
          claves={[mira(0, 960, 540, 1.0), mira(k(86.0), 980, 545, 1.04, { curva: "inout" }), mira(k(90.66), 990, 545, 1.06)]}
          medio={<>
            {/* reloj de 24 h: el arco verde son las horas de pantalla */}
            <g opacity={ini}>
              <circle cx={CX} cy={CY} r={R} fill="#13262f" stroke="#2c4450" strokeWidth={44} />
              {Array.from({ length: 24 }).map((_, i) => { const a = (i / 24) * Math.PI * 2; return <line key={i} x1={CX + (R - 40) * Math.sin(a)} y1={CY - (R - 40) * Math.cos(a)} x2={CX + (R - (i % 6 ? 52 : 66)) * Math.sin(a)} y2={CY - (R - (i % 6 ? 52 : 66)) * Math.cos(a)} stroke="#5a7480" strokeWidth={i % 6 ? 3 : 6} />; })}
              {["0", "6", "12", "18"].map((t, i) => { const a = (i / 4) * Math.PI * 2; return <text key={t} x={CX + (R - 100) * Math.sin(a)} y={CY - (R - 100) * Math.cos(a) + 14} fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#7a95a0" textAnchor="middle">{t}</text>; })}
              {h > 0.02 && <path d={arco(CX, CY, R, 0, (h / 24) * Math.PI * 2)} stroke={VERDE} strokeWidth={44} fill="none" strokeLinecap="round" />}
              <text x={CX} y={CY + 30} fontFamily={F_HUD} fontWeight={600} fontSize={150} fill={VERDE} textAnchor="middle" style={{ fontVariantNumeric: "tabular-nums" }}>{h.toFixed(1)}</text>
              <text x={CX} y={CY + 92} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#f4efe4" textAnchor="middle">HOURS A DAY</text>
            </g>
            {PANT.map((p, i) => {
              const t = interpolate(f, [k(86.2 + i * 0.6), k(86.2 + i * 0.6) + 8], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) });
              const a0 = (acum / 24) * Math.PI * 2; acum += p.h; const a1 = (acum / 24) * Math.PI * 2; const am = (a0 + a1) / 2;
              const ix = CX + (R + 150) * Math.sin(am), iy = CY - (R + 150) * Math.cos(am);
              return t > 0 ? <g key={i}><path d={arco(CX, CY, R + 34, a0 + 0.04, a1 - 0.04)} stroke="#f4efe4" strokeWidth={8} fill="none" opacity={t} /><Icono d={p.d} x={ix} y={iy} s={1.2 * t} t={p.t} color="#f4efe4" /></g> : null;
            })}
            <Persona look={OWEN} seed={47} luz={RIM.tubo} escala={2.05} ruta={[{ f: 0, x: 500, y: 1130 }]} dir={[{ f: 0, v: 1 }]} sombra={0}
              poses={[{ f: 0, v: { hD: 120, cD: 10, hI: 10, cI: 20 } }, { f: k(85.2), v: { hD: 125, cD: 6, hI: 10, cI: 20 } }, { f: k(88.4), v: "manosCintura" }]}
              caras={[{ f: 0, v: "determinado" }, { f: k(85.1), v: "sorpresa" }, { f: k(88.4), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }]} habla={[[0, k(85.0)]]} />
          </>}
          hud={<>
            <Rot t="THE AVERAGE U.S. ADULT" a={k(82.5)} b={k(90.66) + 4} tam={54} pos="izq" top={170} color={VERDE} />
            <Fuente t="Source: device-tracking studies of U.S. adults (DataReportal, Nielsen)" a={k(83.0)} b={k(90.5)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 9c · adolescentes: 8 h 30 m de pantalla SÓLO para entretenimiento ======================
const q09c: PlanB = {
  a: 90.66, b: 97.38, trans: { tipo: "corte" },
  sfx: [[90.7, "whoosh"], [91.0, "roll", -2, { dur: 3 }], [92.4, "type", -12, { dur: 2 }], [94.2, "glitch", -10], [95.6, "slam", 0], [96.2, "crowd", -18, { dur: 1.2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: true }} seed={5092} mano={2}
          claves={[mira(0, SOFA_X - 150, 660, 2.1), mira(k(93.6), SOFA_X - 120, 665, 2.35, { curva: "inout" }), mira(k(97.38), SOFA_X - 110, 665, 2.45)]}
          medio={<>
            <Persona look={TEEN} seed={151} luz={{ lado: -1, color: "#8ab0ff", fuerza: 1 }} ruta={[{ f: 0, x: SOFA_X - 60, y: LIV_PISO }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: LIV_PUNTOS.asiento }]}
              poses={[{ f: 0, v: POSE_CELU_SENTADO }, { f: k(94.2), v: { ...POSE_CELU_SENTADO, cabeza: -10, hD: 50, cD: 110 } }, { f: k(95.6), v: { pI: 85, rI: -80, pD: 88, rD: -85, hD: 150, cD: 20, hI: 150, cI: 20, cabeza: -10 } }]}
              caras={[{ f: 0, v: "zombi" }, { f: k(94.2), v: "risa" }, { f: k(95.6), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.8 } }, { f: k(94.2), v: { x: 1, y: -0.2 } }, { f: k(95.6), v: { x: 0, y: -1 } }]}
              enManoD={<Celular s={0.95} brillo="#ff6ab4" />}
              cartel={reloj([{ f: 0, v: 0 }, { f: k(91.0), v: 510, d: 140 }], { tam: 44, desde: k(90.8), color: "#ff8a5a" })} />
            <Halo x={SOFA_X - 140} y={600} r={260} color="#ff6ab4" fuerza={0.35} />
          </>}
          hud={<>
            <Rot t={"TEENAGERS · just for fun"} a={k(91.0)} b={k(97.38) + 4} tam={54} pos="izq" top={330} color="#ff8a5a" />
            <Fuente t="Source: Common Sense Media census, media use by tweens and teens" a={k(91.2)} b={k(97.3)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 9d · más que lo que duermen (barras lado a lado) · y nadie tiene idea ======================
const q09d: PlanB = {
  a: 97.38, b: 101.94, trans: { tipo: "corte" },
  sfx: [[97.4, "whoosh"], [97.6, "snore", -6, { dur: 1.6 }], [98.0, "roll", -4, { dur: 1.2 }], [99.2, "slam", -2], [99.6, "cloth", -6], [100.4, "fail", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const sueno = interpolate(f, [k(97.6), k(98.6)], [0, 1], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 2) });
      const pant = interpolate(f, [k(98.4), k(99.2)], [0, 1], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 2) });
      const Bar: React.FC<{ y: number; w: number; u: number; c: string; t: string; v: string; icon: React.ReactNode }> = ({ y, w, u, c, t, v, icon }) => (
        <g transform={`translate(330,${y})`}>
          <g transform="translate(-100,52) scale(1.3)">{icon}</g>
          <rect x={0} y={0} width={1100} height={104} rx={22} fill="#1a2c36" />
          <rect x={0} y={0} width={w * u} height={104} rx={22} fill={c} />
          <text x={4} y={-22} fontFamily={F_HUD} fontWeight={600} fontSize={52} fill="#f4efe4">{t}</text>
          <text x={w * u + 22} y={74} fontFamily={F_HUD} fontWeight={600} fontSize={64} fill={c} opacity={u}>{v}</text>
        </g>
      );
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26", luz: "#ff8a5a" }} seed={5093} mano={1.5}
          claves={[mira(0, 960, 540, 1.0), mira(k(101.94), 960, 540, 1.05, { curva: "inout" })]}
          medio={<>
            <Bar y={260} w={720} u={sueno} c="#7ab8ff" t="SLEEP" v="~7.5 h" icon={<g><path d="M-44,10 h88 v-24 h-88 Z M-44,-14 v-22 h20 v22" fill="none" stroke="#7ab8ff" strokeWidth={6} strokeLinejoin="round" /><text x={20} y={-30} fontFamily={F_MANO} fontWeight={700} fontSize={34} fill="#7ab8ff">z</text></g>} />
            <Bar y={530} w={816} u={pant} c="#ff8a5a" t="SCREENS (just for fun)" v="8.5 h" icon={<path d="M-14,-30 h28 a6,6 0 0 1 6,6 v48 a6,6 0 0 1 -6,6 h-28 a6,6 0 0 1 -6,-6 v-48 a6,6 0 0 1 6,-6 Z" fill="none" stroke="#ff8a5a" strokeWidth={6} />} />
            {pant > 0.98 && <text x={330 + 1000} y={490} fontFamily={F_MANO} fontWeight={700} fontSize={64} fill="#ff8a9a" textAnchor="middle" transform={`rotate(-4,1330,480)`} opacity={interpolate(f, [k(99.2), k(99.5)], [0, 1], cl)}>MORE!</text>}
            <Persona look={TEEN} seed={151} luz={RIM.tubo} escala={1.9} ruta={[{ f: 0, x: 1640, y: 1190 }]} dir={[{ f: 0, v: -1 }]} sombra={0}
              poses={[{ f: 0, v: "celular" }, { f: k(99.6), v: "encogerse" }]} caras={[{ f: 0, v: "zombi" }, { f: k(99.6), v: "duda" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: k(99.6), v: { x: 0, y: 0 } }]}
              enManoD={(ff) => ff < k(99.6) ? <Celular s={0.9} brillo="#ff6ab4" /> : null} />
          </>}
          hud={<Rot t="and most people have no idea" a={k(99.7)} b={k(101.94) + 4} tam={58} mano pos="izq" top={800} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 10 · lo que DICEN vs lo que REGISTRA el celular: siempre de menos ======================
const q10: PlanB = {
  a: 101.94, b: 107.74, trans: { tipo: "fundido", d: 10 },
  sfx: [[102.0, "whoosh"], [102.4, "write", -6], [103.4, "pop", -2], [104.6, "beep", -6], [105.0, "roll", -2, { dur: 1.6 }], [106.8, "fail", -6], [107.0, "stamp", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const dice = interpolate(f, [k(103.6), k(104.4)], [0, 1], cl);
      const reg = interpolate(f, [k(105.0), k(106.6)], [0, 1], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 2) });
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "manana" }} seed={510} mano={2}
          claves={[mira(0, 1420, 650, 1.6), mira(k(104.6), 1460, 620, 1.45, { curva: "inout" }), mira(k(107.74), 1462, 615, 1.5)]}
          medio={<>
            {/* pantalla de la clínica: SAID vs RECORDED */}
            <g transform="translate(1330,330)">
              <rect x={0} y={0} width={620} height={330} rx={18} fill="#20242c" />
              <rect x={10} y={10} width={600} height={310} rx={12} fill="#f5f8fc" />
              <text x={34} y={86} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#c7952a">SAID</text>
              <rect x={190} y={52} width={84 * dice} height={46} rx={10} fill="#ffc94a" />
              <text x={200 + 84 * dice} y={88} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#c7952a" opacity={dice}>2h</text>
              <text x={34} y={196} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#2d8a36">PHONE</text>
              <rect x={190} y={162} width={260 * reg} height={46} rx={10} fill="#3fbf4a" />
              <text x={200 + 260 * reg} y={198} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#2d8a36" opacity={reg}>{hm(reg * 370)}</text>
              <text x={310} y={290} fontFamily={F_MANO} fontWeight={700} fontSize={56} fill="#e2483a" textAnchor="middle" opacity={interpolate(f, [k(106.8), k(107.1)], [0, 1], cl)} transform="rotate(-3,310,280)">always LOW</text>
            </g>
            <Persona look={SCRUBS} seed={61} luz={RIM.clinica} ruta={[{ f: 0, x: 1010, y: HAL_PISO }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 20, cD: 30, hI: 30, cI: 100 } }, { f: k(102.4), v: { hD: 40, cD: 110, hI: 30, cI: 100 } }, { f: k(104.8), v: { hD: 120, cD: 10, hI: 30, cI: 100 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(104.8), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(104.8), v: { x: 1, y: -0.8 } }]} habla={[[k(102.0), k(103.2)]]}
              enManoI={<g><rect x={-10} y={-50} width={70} height={90} rx={6} fill="#c9a26a" /><rect x={-2} y={-40} width={54} height={70} fill="#fff" /></g>} />
            <Persona look={OBRERO} seed={62} luz={RIM.clinica} ruta={[{ f: 0, x: 1250, y: HAL_PISO }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 30, cD: 40 } }, { f: k(103.4), v: { hD: 100, cD: 60, hI: 10, cI: 20 } }, { f: k(105.4), v: { hD: 20, cD: 20 } }, { f: k(106.8), v: "manosCara" }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(103.4), v: "picaro" }, { f: k(105.4), v: "sorpresa" }, { f: k(106.8), v: "triste" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(105.0), v: { x: -0.6, y: -0.6 } }]} habla={[[k(103.4), k(104.4)]]} />
            <GloboM x={1200} y={590} texto={"2 hours,\ntops"} desde={k(103.4)} hasta={k(105.2)} tam={34} lado={-1} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 10b · la abuela: el único número honesto de Paulina Street ======================
const q10b: PlanB = {
  a: 107.74, b: 111.56, trans: { tipo: "corte" },
  sfx: [[107.8, "whoosh", -6], [108.2, "paper", -6], [109.6, "stamp", 0], [109.7, "ding", -2], [110.2, "sparkle", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const sello = interpolate(f, [k(109.6), k(109.6) + 5], [1.8, 1], cl);
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "manana", luzCocina: true }} seed={511} mano={2.5}
          claves={[mira(0, 600, 700, 2.1), mira(k(111.56), 590, 695, 2.35, { curva: "inout" })]}
          medio={<>
            <Persona {...RosaLee(k, {
              poses: [{ f: 0, v: { ...DIARIO_SENT, hD: 48, cD: 48, hI: 50, cI: 44, cabeza: 10 } }, { f: k(108.8), v: { ...DIARIO_SENT, hD: 48, cD: 48, hI: 150, cI: 30, cabeza: 0 } }],
              caras: [{ f: 0, v: "feliz" }, { f: k(108.8), v: "risa" }], miradas: [{ f: 0, v: { x: 0.4, y: 0.8 } }, { f: k(108.8), v: { x: -0.2, y: -0.1 } }],
              enManoD: <Diario hoja={1} />,
              cartel: reloj(11, { tam: 44 }) })} />
            <Taza x={640} y={680} />
            {f > k(109.6) && <g transform={`translate(700,568) scale(${sello}) rotate(-8)`}>
              <circle r={44} fill="#3fbf4a" stroke="#fff" strokeWidth={6} /><path d="M-20,2 l14,14 l26,-30" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>}
            <Chispas x={700} y={560} f={f} desde={k(109.6)} r={90} />
          </>}
          hud={<Rot t="the only honest number on Paulina Street" a={k(109.8)} b={k(111.56) + 4} tam={52} mano pos="abajo" color="#bfffb0" />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 11 · parada 18: Owen baja al café de Lena ======================
const CAFE = 2350;
const LENA_Y = ASH_CARRIL - 80;
const Mostrador: React.FC = () => (
  <g transform={`translate(${CAFE},${LENA_Y})`}><rect x={-150} y={-130} width={300} height={130} rx={8} fill="#7a4a2e" /><rect x={-160} y={-142} width={320} height={16} rx={6} fill="#c9864a" /><rect x={60} y={-190} width={60} height={48} rx={6} fill="#3a3f46" /><rect x={-110} y={-176} width={36} height={34} rx={6} fill="#f4efe6" /></g>
);
// limpiar el mostrador: el brazo va y viene
const limpiar = (k0: number, k1: number, paso = 9) => {
  const out: { f: number; v: any }[] = [];
  for (let t = k0, i = 0; t < k1; t += paso, i++) out.push({ f: t, v: { hD: i % 2 ? 50 : 70, cD: i % 2 ? 60 : 20, hI: 20, cI: 30, cabeza: 10 } });
  return out;
};
const q11: PlanB = {
  a: 111.56, b: 116.4, trans: { tipo: "barrido", d: 10 },
  sfx: [[111.6, "bus_brake", -6], [112.0, "bus_door", -4], [112.5, "step", -4], [113.0, "step", -4], [113.5, "step", -4], [113.9, "door_bell", -4], [114.2, "cloth", -10], [115.6, "roll", -2, { dur: 0.8 }], [116.0, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 2550, cafe: CAFE, paradas: [{ x: 2950, num: 18 }], autos: 1 }} seed={511} mano={3}
          claves={[mira(0, 2890, 820, 1.25), mira(k(113.4), CAFE + 200, 850, 1.5, { curva: "inout" }), mira(k(116.4), CAFE + 140, 865, 1.85, { curva: "inout" })]}
          medio={<>
            <Bus9 x={3700} y={ASH_CARRIL} hora="manana" puertas={1} kneel={kneelEn(f, 0, k(116.4))} dir={1} chofer={false} />
            <Persona look={LENA} seed={18} luz={RIM.sol} ruta={[{ f: 0, x: CAFE, y: LENA_Y }]} dir={[{ f: 0, v: 1 }]}
              poses={[...limpiar(0, k(114.6)), { f: k(114.6), v: { hD: 60, cD: 60, hI: 20, cI: 30 } }, { f: k(115.6), v: { hD: 120, cD: 30, hI: 20, cI: 30 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(114.4), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.2, y: 0.8 } }, { f: k(114.4), v: { x: 1, y: 0 } }]} habla={[[k(114.6), k(115.4)]]}
              cartel={reloj([{ f: 0, v: 0 }, { f: k(115.6), v: 41, d: 24 }], { tam: 40, rotulo: "LENA", desde: k(115.5) })} />
            <Mostrador />
            <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: 3070, y: LENA_Y }, { f: k(112.3), x: 3070, y: LENA_Y }, { f: k(114.4), x: CAFE + 250, y: LENA_Y }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: {} }, { f: k(114.4), v: { hD: 100, cD: 40 } }, { f: k(115.4), v: {} }]} caras={[{ f: 0, v: "feliz" }, { f: k(116.0), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(115.8), v: { x: -0.8, y: -0.6 } }]} habla={[[k(114.4), k(115.2)]]} />
          </>}
          hud={<Rot t="STOP 18 · Lena's café" a={k(111.7)} b={k(114.0)} tam={58} color={VERDE} pos="der" top={170} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 11b · 41 minutos, todos en ráfagas entre clientes (línea de tiempo de la mañana) ======================
const RAFAGAS: [number, number, string][] = [[117.9, 0.12, "1m"], [118.4, 0.2, "2m"], [118.9, 0.29, "1m"], [119.5, 0.4, "2m"], [120.0, 0.5, "1m"], [120.4, 0.6, "2m"], [120.8, 0.7, "1m"], [121.2, 0.82, "2m"], [121.5, 0.9, "1m"]];
const q11b: PlanB = {
  a: 116.4, b: 121.96, trans: { tipo: "corte" },
  sfx: [[116.45, "whoosh", -6], [117.9, "pop", -2], [118.4, "pop", -2], [118.9, "pop", -2], [119.0, "door_bell", -8], [119.5, "pop", -2], [119.8, "cup", -4], [120.0, "pop", -2], [120.4, "pop", -2], [120.8, "pop", -2], [121.2, "pop", -2], [121.5, "ding", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      // mira el celular un segundo, atiende, vuelve a mirar
      const poses = [{ f: 0, v: { hD: 30, cD: 125, cabeza: 22, tronco: 6, hI: 8, cI: 30 } }, { f: k(118.6), v: { hD: 60, cD: 60, hI: 20, cI: 30 } }, { f: k(119.6), v: { hD: 90, cD: 20, hI: 20, cI: 30 } }, { f: k(120.2), v: { hD: 30, cD: 125, cabeza: 22, tronco: 6, hI: 8, cI: 30 } }, { f: k(120.9), v: { hD: 60, cD: 60, hI: 20, cI: 30 } }];
      const W0 = 240, W1 = 1680, Y = 880;
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 2450, cafe: CAFE, paradas: [], autos: 0 }} seed={5111} mano={2}
          claves={[mira(0, CAFE + 110, 875, 2.25), mira(k(121.96), CAFE + 130, 870, 2.4, { curva: "inout" })]}
          medio={<>
            <Persona look={LENA} seed={18} luz={RIM.sol} ruta={[{ f: 0, x: CAFE, y: LENA_Y }]} dir={[{ f: 0, v: 1 }]} poses={poses}
              caras={[{ f: 0, v: "neutral" }, { f: k(118.6), v: "feliz" }, { f: k(120.2), v: "neutral" }, { f: k(120.9), v: "feliz" }]}
              miradas={[{ f: 0, v: { x: 0.4, y: 0.8 } }, { f: k(118.6), v: { x: 1, y: 0 } }, { f: k(120.2), v: { x: 0.4, y: 0.8 } }, { f: k(120.9), v: { x: 1, y: 0 } }]}
              enManoD={(ff) => (ff < k(118.6) || (ff > k(120.2) && ff < k(120.9))) ? <Celular s={0.95} brillo="#ffd27a" /> : ff > k(119.6) && ff < k(120.2) ? <Taza x={0} y={0} color="#f4efe6" vapor={1} f={ff} /> : null} />
            <Mostrador />
            <Persona look={SENORA} seed={71} luz={RIM.sol} ruta={[{ f: 0, x: CAFE + 760, y: LENA_Y }, { f: k(118.4), x: CAFE + 760, y: LENA_Y }, { f: k(119.5), x: CAFE + 230, y: LENA_Y }, { f: k(120.3), x: CAFE + 230, y: LENA_Y }, { f: k(121.4), x: CAFE + 560, y: LENA_Y }]}
              dir={[{ f: 0, v: -1 }, { f: k(120.3), v: 1 }]} poses={[{ f: 0, v: {} }, { f: k(119.6), v: { hD: 90, cD: 20 } }, { f: k(120.3), v: { hD: 40, cD: 80 } }]} caras={[{ f: 0, v: "feliz" }]}
              enManoD={(ff) => ff > k(120.1) ? <Taza x={0} y={0} color="#f4efe6" vapor={1} f={ff} /> : null} />
          </>}
          hud={<>
            {/* la mañana de Lena: cada barrita verde es una mirada al celular */}
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
              <rect x={W0 - 30} y={Y - 92} width={W1 - W0 + 60} height={190} rx={26} fill="rgba(14,22,28,0.82)" />
              <rect x={W0} y={Y} width={W1 - W0} height={18} rx={9} fill="#3a4a52" />
              <text x={W0} y={Y + 72} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#9aaab2">6 A.M.</text>
              <text x={W1} y={Y + 72} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#9aaab2" textAnchor="end">NOON</text>
              {RAFAGAS.map(([s, p, t], i) => {
                const u = interpolate(f, [k(s), k(s) + 5], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) });
                const x = W0 + (W1 - W0) * p;
                return u > 0 ? <g key={i} transform={`translate(${x},${Y + 9})`}><rect x={-9} y={-34 * u} width={t === "2m" ? 26 : 16} height={68 * u} rx={6} fill={VERDE} /><text y={-46} fontFamily={F_HUD} fontWeight={600} fontSize={42} fill={VERDE} textAnchor="middle" opacity={u}>{t}</text></g> : null;
              })}
            </svg>
            <Rot t="41 minutes · all in short bursts" a={k(116.5)} b={k(121.96) + 4} tam={54} pos="izq" top={170} color={VERDE} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 11c · el celular va atrás: examen de química el jueves, está aterrada ======================
const q11c: PlanB = {
  a: 121.96, b: 127.84, trans: { tipo: "corte" },
  sfx: [[122.0, "whoosh", -8], [122.9, "wood_hit", -4], [123.2, "slam", -8], [124.4, "paper", -2], [124.8, "write", -8], [125.4, "heart1", -2], [126.0, "heart1", -4], [126.6, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const caj = interpolate(f, [k(122.6), k(122.9), k(123.2), k(123.5)], [0, 1, 1, 0], cl);
      const nota = interpolate(f, [k(124.3), k(124.3) + 8], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) });
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 2450, cafe: CAFE, paradas: [], autos: 0 }} seed={5112} mano={2.5}
          claves={[mira(0, CAFE + 60, 860, 2.4), mira(k(124.2), CAFE - 40, 850, 2.3, { curva: "inout" }), mira(k(125.4), CAFE - 10, 860, 2.7, { curva: "inout" }), mira(k(127.84), CAFE - 5, 862, 2.8)]}
          medio={<>
            {/* la nota pegada en la pared: CHEM EXAM · THURSDAY */}
            <g transform={`translate(${CAFE - 210},${LENA_Y - 300}) rotate(-5) scale(${nota})`}>
              <rect x={-80} y={-70} width={160} height={140} rx={6} fill="#fff7a8" stroke="#d8c860" strokeWidth={3} />
              <text y={-30} fontFamily={F_MANO} fontWeight={700} fontSize={30} fill="#c23a2e" textAnchor="middle">CHEM</text>
              <text y={4} fontFamily={F_MANO} fontWeight={700} fontSize={30} fill="#22303a" textAnchor="middle">EXAM</text>
              <text y={40} fontFamily={F_MANO} fontWeight={700} fontSize={30} fill="#22303a" textAnchor="middle">THU!</text>
              <circle cx={0} cy={-62} r={8} fill="#e2483a" />
            </g>
            <Persona look={LENA} seed={18} luz={RIM.sol} ruta={[{ f: 0, x: CAFE, y: LENA_Y }]} dir={[{ f: 0, v: 1 }, { f: k(122.4), v: -1 }, { f: k(123.6), v: 1 }, { f: k(124.2), v: -1 }, { f: k(125.2), v: 1 }]}
              poses={[{ f: 0, v: { hD: 80, cD: 40, hI: 20, cI: 30 } }, { f: k(122.5), v: { hD: 20, cD: 10, hI: 20, cI: 30, tronco: 14 } }, { f: k(123.6), v: { hD: 60, cD: 60, hI: 20, cI: 30 } }, { f: k(124.2), v: { hD: 140, cD: 10, hI: 20, cI: 30 } }, { f: k(125.2), v: "manosCara" }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(123.6), v: "determinado" }, { f: k(125.2), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(122.5), v: { x: 1, y: 0.8 } }, { f: k(124.2), v: { x: 1, y: -0.5 } }, { f: k(125.2), v: { x: 1, y: 0 } }]}
              habla={[[k(122.0), k(122.5)], [k(123.6), k(127.6)]]}
              enManoD={(ff) => ff < k(123.0) ? <Celular s={0.95} brillo="#ffd27a" /> : null} />
            {/* el cajón de atrás donde queda el celular */}
            <g transform={`translate(${CAFE - 60},${LENA_Y - 70})`}><rect x={-60} y={-24 + 0 * caj} width={120} height={48} rx={6} fill="#5a3420" /><rect x={-60 - 70 * caj} y={-20} width={120} height={40} rx={6} fill="#8a5a36" stroke="#5a3420" strokeWidth={3} /><rect x={-14 - 70 * caj} y={-4} width={28} height={8} rx={4} fill="#d8b070" /></g>
            <Mostrador />
            <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: CAFE + 250, y: LENA_Y }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 30, cD: 40 } }, { f: k(125.4), v: { hD: 30, cD: 40, cabeza: -10 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(125.4), v: "duda" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }]} />
            <GloboM x={CAFE + 20} y={LENA_Y - 225} texto={"Phone goes\nin the back."} desde={k(122.0)} hasta={k(124.2)} tam={20} lado={1} />
            <GloboM x={CAFE + 20} y={LENA_Y - 225} texto={"Chem exam\nThursday.\nTerrified!"} desde={k(124.5)} hasta={k(127.7)} tam={20} lado={1} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 11d · Owen piensa en su propio número ======================
const q11d: PlanB = {
  a: 127.84, b: 129.3, trans: { tipo: "corte" },
  sfx: [[127.9, "cup", -6], [128.2, "heart1", -4], [128.7, "tick", -4]],
  el: (k) => (
    <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 2550, cafe: CAFE, paradas: [], autos: 0 }} seed={5113} mano={2}
      claves={[mira(0, CAFE + 250, 850, 2.6), mira(k(129.3), CAFE + 250, 840, 2.9, { curva: "inout" })]}
      medio={<Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: CAFE + 250, y: LENA_Y }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 80, cD: 30 } }, { f: k(128.3), v: { hD: 80, cD: 30, hI: 40, cI: 120, cabeza: -8 } }]}
        caras={[{ f: 0, v: "neutral" }, { f: k(128.2), v: "duda" }]} miradas={[{ f: 0, v: { x: -0.6, y: 0 } }, { f: k(128.2), v: { x: 0.2, y: -1 } }]}
        enManoD={(ff) => <Taza x={0} y={0} color="#f4efe6" vapor={1} f={ff} />}
        cartel={reloj(129, { tam: 40, latido: 0.7, desde: k(128.1) })} />} />
  ),
};
// ====================== 12 · su número en el espejo del bus: 2h 12m y son las 9 ======================
const Espejo: React.FC<{ x: number; y: number; children?: React.ReactNode; s?: number }> = ({ x, y, children, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-70} width={300} height={140} rx={60} fill="#20242c" />
    <clipPath id={`esp${x}${y}`}><rect x={-138} y={-58} width={276} height={116} rx={52} /></clipPath>
    <rect x={-138} y={-58} width={276} height={116} rx={52} fill="#c9d6dc" />
    <g clipPath={`url(#esp${x}${y})`}>{children}</g>
    <path d="M-138,-58 l70,0 l-110,116 Z" fill="#fff" opacity={0.3} />
  </g>
);
// cara del reflejo: gorra de chofer (Owen) o sombrero gris (el del abrigo)
const CaraReflejo: React.FC<{ tipo: "owen" | "abrigo"; f: number; x?: number; abre?: number }> = ({ tipo, f, x = 20, abre = 1 }) => (
  <g transform={`translate(${x},14)`}>
    <path d="M-60,60 q60,-60 120,0" fill={tipo === "owen" ? "#2a3f6a" : "#6a6e74"} />
    <circle r={40} fill="#141418" />
    {[-15, 15].map((dx) => <g key={dx}><ellipse cx={dx} cy={-2} rx={10} ry={11 * abre} fill="#fff" /><circle cx={dx + (tipo === "owen" ? -2 : 0)} cy={0} r={4.5} fill="#141418" /></g>)}
    {tipo === "owen" ? <><path d="M-42,-18 q42,-42 84,0 Z" fill="#22355e" /><rect x={-52} y={-22} width={104} height={10} rx={5} fill="#1a2a4a" /><circle cx={0} cy={-34} r={5} fill="#f2c94c" /></>
      : <><rect x={-62} y={-28} width={124} height={10} rx={5} fill="#5a5e64" /><path d="M-36,-26 q0,-34 36,-34 q36,0 36,34 Z" fill="#6a6e74" /></>}
    {tipo === "owen" && <path d="M-12,22 q12,-6 24,0" stroke="#fff" strokeWidth={3} fill="none" opacity={0.6 + 0 * f} />}
  </g>
);
const q12: PlanB = {
  a: 129.3, b: 133.74, trans: { tipo: "barrido", d: 8 },
  sfx: [[129.4, "bus_engine", -12, { dur: 4 }], [130.6, "roll", -2, { dur: 0.8 }], [131.9, "slam", -4], [132.8, "tick", -2], [133.3, "tick", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const v = interpolate(f, [k(130.6), k(131.4)], [129, 132], cl);
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: (ff: number) => ff * 14 }} seed={512} mano={2}
          claves={[mira(0, 330, 640, 1.9), mira(k(130.4), 300, 590, 2.25, { curva: "inout" }), mira(k(133.74), 290, 585, 2.4)]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "neutral" }, { f: k(130.4), v: "duda" }, { f: k(131.9), v: "sorpresa" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }, { f: k(130.2), v: { x: -0.4, y: -1 } }] })} />
            <Volante />
            <Espejo x={175} y={478} s={0.9}><CaraReflejo tipo="owen" f={f} abre={f > k(131.9) ? 1.25 : 1} /></Espejo>
            <CartelM x={430} y={470} claves={0} texto={hm(v)} icono="reloj" tam={40} f={f} color={f > k(131.9) ? "#ffc94a" : VERDE} latido={f > k(131.9) ? 0.7 : 0} />
          </>}
          hud={<Rot t="and it's only 9 a.m." a={k(131.9)} b={k(133.74) + 4} tam={64} mano pos="der" top={600} rot={-2} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 13 · el celular no es una pantalla: es una tragamonedas ======================
const RODILLOS = ["💬", "♥", "∅", "♥", "💬", "∅", "★", "∅"];
const Tragamonedas: React.FC<{ f: number; sims: string[]; girando: boolean; palanca: number; cas?: boolean; titulo: string; feed?: number; lev?: number }> = ({ f, sims, girando, palanca, cas, titulo, feed = 0, lev = 1 }) => (
  <g>
    <rect x={-260} y={-380} width={520} height={760} rx={60} fill="#15151a" stroke={cas ? "#ffc94a" : "#3a3a44"} strokeWidth={10} />
    <rect x={-220} y={-330} width={440} height={640} rx={24} fill={cas ? "#2a1a0c" : "#0f1e26"} />
    {[0, 1, 2].map((r) => {
      const sim = girando ? RODILLOS[(Math.floor(f / 2) + r * 3) % RODILLOS.length] : sims[r];
      return <g key={r} transform={`translate(${-140 + r * 140},-10)`}><rect x={-60} y={-90} width={120} height={180} rx={16} fill="#f4efe4" /><text y={30} fontSize={86} textAnchor="middle" fill="#c23a2e" fontFamily={F_HUD} fontWeight={600} opacity={girando ? 0.7 : 1} transform={girando ? `translate(0,${((f * 23) % 40) - 20})` : undefined}>{sim}</text></g>;
    })}
    <text y={-230} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#f4efe4" textAnchor="middle">{titulo}</text>
    <path d="M0,-300 l-20,30 h40 Z" fill="#f4efe4" opacity={0.6 + 0.4 * Math.sin(f / 4)} />
    {/* la palanca */}
    {lev > 0 && <g transform={`translate(${260 + 50 * lev},${-150 + palanca * 160}) scale(${lev})`}><rect x={-10} y={0} width={20} height={240 - palanca * 160} fill="#c9ced2" /><circle r={46} fill="#c23a2e" /></g>}
    {feed > 0 && <g opacity={feed} clipPath="url(#feedclip)"><clipPath id="feedclip"><rect x={-220} y={-330} width={440} height={640} rx={24} /></clipPath><rect x={-220} y={-330} width={440} height={640} rx={24} fill="#f4f6f8" />{[0, 1, 2].map((i) => <g key={i} transform={`translate(-190,${-300 + i * 205 - ((f * 3) % 205)})`}><circle cx={26} cy={26} r={22} fill={["#ff8a5a", "#7ab8ff", "#3fbf4a"][i]} /><rect x={60} y={10} width={220} height={16} rx={8} fill="#c9d0d6" /><rect x={0} y={60} width={380} height={110} rx={14} fill="#dde3e8" /></g>)}</g>}
  </g>
);
const q13: PlanB = {
  a: 133.74, b: 138.34, trans: { tipo: "luz", d: 12, color: "#fff3d0" },
  sfx: [[133.8, "whoosh"], [134.4, "type", -12, { dur: 1 }], [135.64, "slam", -2], [135.8, "metal", -4], [136.4, "coin_rain", -12, { dur: 1 }], [137.6, "spring", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const m = interpolate(f, [k(135.64), k(136.3)], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) });
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1e1418", luz: "#ffc94a" }} seed={513} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(138.34), 960, 540, 1.05, { curva: "inout" })]}
          medio={<>
            <Persona look={RUNNER} seed={91} luz={{ lado: 1, color: "#ffc94a", fuerza: 0.8 }} escala={1.9} ruta={[{ f: 0, x: 520, y: 1150 }]} dir={[{ f: 0, v: 1 }]} sombra={0}
              poses={[{ f: 0, v: "celular" }, { f: k(134.4), v: { hD: 90, cD: 10, hI: 10, cI: 20 } }, { f: k(135.64), v: { hD: 60, cD: 60, hI: 10, cI: 20, cabeza: -6 } }]} caras={[{ f: 0, v: "neutral" }, { f: k(135.64), v: "sorpresa" }, { f: k(137.0), v: "picaro" }]}
              miradas={[{ f: 0, v: { x: 0.5, y: 0.8 } }, { f: k(135.64), v: { x: 1, y: -0.3 } }]} enManoD={(ff) => ff < k(135.64) ? <Celular s={1.1} brillo="#7ab8ff" /> : null} />
            <g transform={`translate(1200,${interpolate(f, [k(133.9), k(134.4)], [1300, 560], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) })}) scale(0.9) rotate(${3 - 3 * m})`}>
              <Tragamonedas f={f} sims={["♥", "★", "💬"]} girando={f > k(137.0)} palanca={0} titulo={m > 0.5 ? "PULL TO REFRESH" : "FEED"} feed={1 - m} lev={m} cas={m > 0.5} />
            </g>
          </>}
          hud={<>
            <Rot t="not just a screen…" a={k(134.0)} b={k(135.6)} tam={60} pos="izq" top={170} />
            <Rot t="it's a SLOT MACHINE" a={k(135.7)} b={k(138.34) + 4} tam={64} pos="izq" top={170} color="#ffc94a" />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 13b · tirar para actualizar: un mensaje, un like, nada ======================
const q13b: PlanB = {
  a: 138.34, b: 143.74, trans: { tipo: "corte" },
  sfx: [[138.5, "spring", -2], [138.6, "roll", -4, { dur: 2.3 }], [141.02, "ding", -2], [141.5, "spring", -4], [141.9, "pop", 0], [142.3, "spring", -4], [142.8, "fail", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const tiros = [k(138.5), k(141.5), k(142.3)], stops = [k(141.02), k(141.9), k(142.8)];
      const i = tiros.filter((t) => f >= t).length - 1;
      const girando = i >= 0 && f < stops[i];
      const res = f < k(141.02) ? -1 : f < k(141.9) ? 0 : f < k(142.8) ? 1 : 2;
      const palanca = i >= 0 ? interpolate(f - tiros[i], [0, 5, 14], [0, 1, 0], cl) : 0;
      const SIMS = [["💬", "💬", "💬"], ["♥", "♥", "♥"], ["∅", "★", "♥"]];
      const RES = [["A MESSAGE!", VERDE], ["A LIKE!", "#ff8a9a"], ["…NOTHING", "#9aa4ac"]];
      const pop = res >= 0 ? interpolate(f, [stops[res], stops[res] + 6], [1.4, 1], cl) : 1;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1e1418", luz: "#ffc94a" }} seed={5131} mano={2} claves={[mira(0, 960, 540, 1.04), mira(k(143.74), 960, 545, 1.1, { curva: "inout" })]}
          medio={<>
            <g transform="translate(1060,520) scale(0.95)"><Tragamonedas f={f} sims={res >= 0 ? SIMS[res] : ["?", "?", "?"]} girando={girando} palanca={palanca} titulo="PULL TO REFRESH" cas={res === 0 || res === 1} /></g>
            {/* el que tira: brazo arriba y abajo con la palanca */}
            <Persona look={RUNNER} seed={91} luz={{ lado: 1, color: "#ffc94a", fuerza: 0.8 }} escala={1.9} ruta={[{ f: 0, x: 500, y: 1150 }]} dir={[{ f: 0, v: 1 }]} sombra={0}
              poses={[{ f: 0, v: { hD: 150, cD: 10 } }, { f: k(138.6), v: { hD: 70, cD: 10 } }, { f: k(141.02), v: { hD: 150, cD: 30, hI: 150, cI: 30 } }, { f: k(141.5), v: { hD: 70, cD: 10 } }, { f: k(141.9), v: { hD: 150, cD: 30, hI: 150, cI: 30 } }, { f: k(142.3), v: { hD: 70, cD: 10 } }, { f: k(142.8), v: "encogerse" }]}
              caras={[{ f: 0, v: "determinado" }, { f: k(139.2), v: "duda" }, { f: k(141.02), v: "risa" }, { f: k(141.9), v: "feliz" }, { f: k(142.8), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: -0.2 } }]} />
            {res >= 0 && <text x={1060} y={1000} fontFamily={F_HUD} fontWeight={600} fontSize={80} fill={RES[res][1]} textAnchor="middle" transform={`translate(1060,975) scale(${pop}) translate(-1060,-975)`}>{RES[res][0]}</text>}
          </>}
          hud={<Rot t="you never know what you'll get" a={k(138.5)} b={k(141.0)} tam={56} pos="izq" top={170} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 13c · recompensa variable: el mismo patrón que la palanca del casino ======================
const q13c: PlanB = {
  a: 143.74, b: 148.82, trans: { tipo: "barrido", d: 8 },
  sfx: [[143.8, "whoosh"], [144.4, "stamp", 0], [145.2, "spring", -4], [145.4, "roll", -6, { dur: 1 }], [146.4, "coin_rain", -6, { dur: 2 }], [147.0, "spring", -4], [147.6, "ding", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const ciclo = (t0: number) => interpolate(f, [k(t0), k(t0) + 5, k(t0) + 14], [0, 1, 0], cl);
      const p = Math.max(ciclo(145.2), ciclo(147.0));
      const titulo = interpolate(f, [k(144.4), k(144.4) + 6], [1.6, 1], cl);
      const monedas = f > k(146.4) ? Array.from({ length: 14 }).map((_, i) => ({ x: 1340 + random(`m${i}`) * 360, y: 520 + ((f - k(146.4)) * (6 + random(`v${i}`) * 6)) % 420 })) : [];
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1e1418", luz: "#ffc94a" }} seed={5132} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(148.82), 960, 550, 1.05, { curva: "inout" })]}
          medio={<>
            <text x={960} y={250} fontFamily={F_HUD} fontWeight={600} fontSize={96} fill="#ffc94a" textAnchor="middle" transform={`translate(960,220) scale(${titulo}) translate(-960,-220)`} opacity={f > k(144.4) ? 1 : 0}>VARIABLE REWARD</text>
            {/* izquierda: tirar para actualizar */}
            <g transform="translate(560,660)">
              <rect x={-120} y={-200} width={240} height={400} rx={36} fill="#15151a" stroke="#3a3a44" strokeWidth={8} />
              <rect x={-100} y={-170} width={200} height={330} rx={14} fill="#0f1e26" />
              <path d={`M0,${-130 + p * 70} l-26,-30 h52 Z`} fill={VERDE} />
              <text y={60} fontFamily={F_HUD} fontWeight={600} fontSize={58} fill="#f4efe4" textAnchor="middle">?</text>
              <text y={270} fontFamily={F_HUD} fontWeight={600} fontSize={46} fill="#f4efe4" textAnchor="middle">YOUR PHONE</text>
            </g>
            <text x={960} y={700} fontFamily={F_HUD} fontWeight={600} fontSize={140} fill="#f4efe4" textAnchor="middle">=</text>
            {/* derecha: la máquina del casino */}
            <g transform="translate(1440,660)">
              <rect x={-150} y={-200} width={300} height={400} rx={30} fill="#7a1a1a" stroke="#ffc94a" strokeWidth={8} />
              {[0, 1, 2].map((r) => <g key={r} transform={`translate(${-80 + r * 80},-60)`}><rect x={-34} y={-50} width={68} height={100} rx={10} fill="#f4efe4" /><text y={20} fontSize={52} textAnchor="middle" fill="#c23a2e" fontFamily={F_HUD} fontWeight={600}>{p > 0.05 ? RODILLOS[(Math.floor(f / 2) + r * 3) % RODILLOS.length] : ["7", "7", "★"][r]}</text></g>)}
              <g transform={`translate(190,${-120 + p * 120})`}><rect x={-8} y={0} width={16} height={180 - p * 120} fill="#c9ced2" /><circle r={34} fill="#c23a2e" /></g>
              <text y={270} fontFamily={F_HUD} fontWeight={600} fontSize={46} fill="#f4efe4" textAnchor="middle">CASINO</text>
            </g>
            {monedas.map((m, i) => <circle key={i} cx={m.x} cy={m.y} r={14} fill="#ffc94a" stroke="#c7952a" strokeWidth={3} />)}
            {/* los dos tiran igual */}
            <Persona look={RUNNER} seed={91} luz={{ lado: 1, color: "#ffc94a", fuerza: 0.8 }} escala={1.2} ruta={[{ f: 0, x: 330, y: 960 }]} dir={[{ f: 0, v: 1 }]} sombra={0}
              poses={[{ f: 0, v: { hD: 120, cD: 30 } }, { f: k(145.2), v: { hD: 70, cD: 10 } }, { f: k(146.0), v: { hD: 120, cD: 30 } }, { f: k(147.0), v: { hD: 70, cD: 10 } }, { f: k(147.8), v: { hD: 120, cD: 30 } }]}
              caras={[{ f: 0, v: "determinado" }, { f: k(146.4), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }]} />
            <Persona look={SENORA} seed={72} luz={{ lado: -1, color: "#ffc94a", fuerza: 0.8 }} escala={1.2} ruta={[{ f: 0, x: 1720, y: 960 }]} dir={[{ f: 0, v: -1 }]} sombra={0}
              poses={[{ f: 0, v: { hD: 120, cD: 30 } }, { f: k(145.2), v: { hD: 70, cD: 10 } }, { f: k(146.0), v: { hD: 120, cD: 30 } }, { f: k(147.0), v: { hD: 70, cD: 10 } }, { f: k(147.8), v: { hD: 120, cD: 30 } }]}
              caras={[{ f: 0, v: "determinado" }, { f: k(146.4), v: "risa" }]} miradas={[{ f: 0, v: { x: -1, y: -0.3 } }]} />
          </>}
          hud={<Rot t="the same pattern that keeps people pulling the lever" a={k(145.0)} b={k(148.82) + 4} tam={46} pos="arriba" top={300} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 13d · no saber es lo que te hace volver a mirar (ciclo) ======================
const q13d: PlanB = {
  a: 148.82, b: 151.36, trans: { tipo: "corte" },
  sfx: [[148.9, "whoosh", -4], [149.3, "tick", -2], [149.9, "tick", -2], [150.5, "tick", -2], [151.0, "phone_buzz", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const rot = (f - 0) * 4;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1e1418", luz: "#ffc94a" }} seed={5133} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(151.36), 960, 540, 1.08, { curva: "inout" })]}
          medio={<>
            <g transform="translate(1200,520)">
              <g transform={`rotate(${rot})`}>
                <path d="M0,-260 A260,260 0 1 1 -225,130" fill="none" stroke="#ffc94a" strokeWidth={22} strokeLinecap="round" />
                <path d="M-225,130 l-10,-70 l66,30 Z" fill="#ffc94a" />
              </g>
              <text y={70} fontFamily={F_HUD} fontWeight={600} fontSize={240} fill="#f4efe4" textAnchor="middle" opacity={0.7 + 0.3 * Math.sin(f / 3)}>?</text>
              <text y={-310} fontFamily={F_HUD} fontWeight={600} fontSize={52} fill="#f4efe4" textAnchor="middle">CHECK</text>
              <text y={360} fontFamily={F_HUD} fontWeight={600} fontSize={52} fill="#ffc94a" textAnchor="middle">CHECK AGAIN</text>
            </g>
            <Persona look={RUNNER} seed={91} luz={{ lado: 1, color: "#ffc94a", fuerza: 0.8 }} escala={1.9} ruta={[{ f: 0, x: 480, y: 1150 }]} dir={[{ f: 0, v: 1 }]} sombra={0}
              poses={Array.from({ length: 8 }).map((_, i) => ({ f: i * 10, v: i % 2 ? { hD: 20, cD: 20, cabeza: 0 } : { hD: 30, cD: 125, cabeza: 22, tronco: 6, hI: 8, cI: 30 } }))}
              caras={[{ f: 0, v: "duda" }]} miradas={Array.from({ length: 8 }).map((_, i) => ({ f: i * 10, v: i % 2 ? { x: 1, y: 0 } : { x: 0.5, y: 0.8 } }))}
              enManoD={<Celular s={1.1} brillo="#7ab8ff" />} />
          </>}
          hud={<Rot t="the not knowing makes you check again" a={k(148.9)} b={k(151.36) + 4} tam={54} mano pos="izq" top={170} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 14 · martes, parada 30: Owen lo estaba esperando ======================
const x9 = ASIENTO_X(9);
const q14: PlanB = {
  a: 151.36, b: 154.96, trans: { tipo: "fundido", d: 14 },
  sfx: [[151.4, "bus_brake", -6], [152.0, "tick", -2], [153.0, "heart1", -6], [153.8, "heart1", -4], [154.6, "bus_door", -2]],
  el: (k) => {
    const pf = (ff: number) => interpolate(ff, [k(154.5), k(154.95)], [0, 1], cl);
    return (
      <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: marchaParadas([[0, k(152.4)]], 14), puertaF: pf }} seed={514} mano={2}
        claves={[mira(0, 420, 600, 1.7), mira(k(154.96), 360, 610, 2.2, { curva: "inout" })]}
        medio={<><Persona {...owenVolante({ caras: [{ f: 0, v: "neutral" }, { f: k(153.46), v: "determinado" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }, { f: k(153.4), v: { x: 1, y: 0 } }], giros: [{ f: 0, v: 0 }] })} /><Volante /></>}
        hud={<Rot t="TUESDAY · STOP 30" a={k(151.5)} b={k(154.96) + 4} tam={62} pos="der" top={170} color={VERDE} />} />
    );
  },
};
// ====================== 14b · sube el hombre del abrigo gris ======================
const ABRIGO_RUTA = (k: K) => [{ f: 0, x: 540, y: BP }, { f: k(155.6), x: 540, y: BP }, { f: k(158.4), x: 900, y: BP }];
const q14b: PlanB = {
  a: 154.96, b: 159.88, trans: { tipo: "corte" },
  sfx: [[155.0, "bus_door", -6], [155.6, "step", -4], [156.2, "step", -4], [156.8, "step", -4], [157.4, "step", -4], [158.0, "drone", -6, { dur: 2 }], [159.3, "riser", -4, { dur: 0.6 }]],
  el: (k) => (
    <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: () => 0, puertaF: (ff: number) => interpolate(ff, [k(157.4), k(158.0)], [1, 0], cl) }} seed={5143} mano={2}
      claves={[mira(0, 560, 600, 1.9), mira(k(158.4), 840, 580, 2.05, { curva: "inout" }), mira(k(159.88), 880, 560, 2.3, { curva: "inout" })]}
      medio={<>
        <Persona {...owenVolante({ caras: [{ f: 0, v: "determinado" }, { f: k(157.0), v: "duda" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }] })} /><Volante />
        <Persona look={ABRIGO} seed={9} luz={{ lado: 1, color: "#b8c4cc", fuerza: 0.6 }} ruta={ABRIGO_RUTA(k)} opacidad={(ff) => (ff < k(155.4) ? 0 : 1)} dir={[{ f: 0, v: 1 }, { f: k(158.4), v: -1 }]}
          poses={[{ f: 0, v: {} }, { f: k(158.6), v: { hD: 8, cD: 6, hI: 8, cI: 6 } }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(158.6), v: { x: 0, y: 0 } }]} />
      </>}
      hud={<Rot t="the man in the long gray coat" a={k(155.8)} b={k(159.88) + 4} tam={56} mano pos="abajo" />} />
  ),
};
// ====================== 14c · por primera vez tiene un número: 23h 59m — a las 11 de la mañana ======================
const q14c: PlanB = {
  a: 159.88, b: 164.9, trans: { tipo: "corte" },
  sfx: [[159.9, "roll", 0, { dur: 1.6 }], [161.6, "boom", -2], [162.4, "tick", -2], [163.66, "glitch", -2], [164.0, "glitch", -6], [164.4, "heart1", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const temb = f > k(163.66) ? Math.sin(f * 2.3) * 6 : 0;
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: () => 0 }} seed={5144} mano={1.5}
          claves={[mira(0, 900, 640, 2.4), mira(k(161.6), 905 + temb, 610, 2.75, { curva: "inout" }), mira(k(164.9), 905, 605, 2.85)]}
          medio={<Persona look={ABRIGO} seed={9} luz={{ lado: 1, color: "#ff6a5a", fuerza: f > k(161.6) ? 0.9 : 0.4 }} ruta={[{ f: 0, x: 900, y: BP }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: { hD: 8, cD: 6, hI: 8, cI: 6 } }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 0, y: 0 } }]}
            cartel={reloj([{ f: 0, v: 0 }, { f: k(159.95), v: 1439, d: 48 }], { tam: 42, color: "#ff6a5a", latido: f > k(161.6) ? 0.6 : 0 })} />}
          hud={<>
            <Rot t="it's 11:00 a.m." a={k(162.4)} b={k(163.6)} tam={60} mano pos="izq" top={640} rot={-2} />
            <Rot t="THAT'S NOT POSSIBLE" a={k(163.66)} b={k(164.9) + 4} tam={64} pos="izq" top={640} color="#ff8a7a" />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 14d · salvo que la pantalla nunca se apague: 23 h 59 de 24 ======================
const q14d: PlanB = {
  a: 164.9, b: 167.68, trans: { tipo: "luz", d: 6, color: "#ffd0c8" },
  sfx: [[164.95, "whoosh"], [165.1, "roll", -2, { dur: 1.4 }], [166.6, "drone", -8, { dur: 1 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const u = interpolate(f, [k(165.1), k(166.5)], [0, 1439 / 1440], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 2) });
      const CX = 1180, CY = 540, R = 290;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1a1214", luz: "#ff6a5a" }} seed={5145} mano={1.5} claves={[mira(0, 960, 540, 1.0), mira(k(167.68), 960, 540, 1.05, { curva: "inout" })]}
          medio={<>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#3a2a2e" strokeWidth={50} />
            {u > 0.01 && <path d={arco(CX, CY, R, 0, u * Math.PI * 2 - 0.001)} stroke="#ff6a5a" strokeWidth={50} fill="none" />}
            <text x={CX} y={CY - 10} fontFamily={F_HUD} fontWeight={600} fontSize={120} fill="#ff6a5a" textAnchor="middle">{hm(u * 1440)}</text>
            <text x={CX} y={CY + 60} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#f4efe4" textAnchor="middle">OF 24 HOURS</text>
            <text x={CX} y={CY + 130} fontFamily={F_MANO} fontWeight={700} fontSize={54} fill="#ffc0b0" textAnchor="middle" opacity={interpolate(f, [k(166.5), k(166.8)], [0, 1], cl)}>never turns off</text>
            <Persona look={ABRIGO} seed={9} luz={{ lado: 1, color: "#ff6a5a", fuerza: 0.8 }} escala={1.8} ruta={[{ f: 0, x: 480, y: 1130 }]} dir={[{ f: 0, v: 1 }]} sombra={0}
              poses={[{ f: 0, v: { hD: 10, cD: 10, hI: 10, cI: 10 } }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 0, y: 0 } }]} />
          </>}
          hud={<Rot t="unless the screen never turns off" a={k(165.0)} b={k(167.68) + 4} tam={54} pos="izq" top={170} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 14e · en el espejo: sin celular, los ojos fijos en nada ======================
const q14e: PlanB = {
  a: 167.68, b: 172.66, trans: { tipo: "corte" },
  sfx: [[167.7, "bus_engine", -12, { dur: 5 }], [168.9, "heart1", -4], [169.1, "swish", -4], [170.4, "heart1", -6], [171.4, "drone", -8, { dur: 1.2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: (ff: number) => ff * 14 }} seed={5146} mano={2}
          claves={[mira(0, 260, 600, 2.2), mira(k(169.0), 230, 590, 2.4, { curva: "inout" }), mira(k(169.3), x9 - 40, 640, 2.3, { curva: "inout" }), mira(k(172.66), x9 - 40, 610, 2.7, { curva: "inout" })]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "duda" }, { f: k(168.9), v: "miedo" }], miradas: [{ f: 0, v: { x: -0.4, y: -1 } }] })} /><Volante />
            <Espejo x={110} y={520} s={0.9}><CaraReflejo tipo="abrigo" f={f} x={30} /></Espejo>
            <Persona {...sentadoBus(ABRIGO, x9, { seed: 9, dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20, pI: 85, rI: -80, pD: 88, rD: -85 } }], caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: 0, y: 0 } }] })} />
            {/* manos vacías: un círculo tachado sobre el regazo */}
            {f > k(169.1) && f < k(170.4) && <g transform={`translate(${x9 + 170},${BP - 200}) scale(0.9)`} opacity={interpolate(f, [k(169.1), k(169.3)], [0, 1], cl)}><circle r={52} fill="none" stroke="#ff6a5a" strokeWidth={8} /><path d="M-36,36 L36,-36" stroke="#ff6a5a" strokeWidth={8} /><g transform="scale(1.4)"><Celular s={1} brillo="#7ab8ff" prendido={false} /></g></g>}
          </>}
          hud={<>
            <Rot t="no phone in his hands" a={k(169.1)} b={k(170.4)} tam={58} mano pos="abajo" />
            <Rot t="eyes open · fixed on nothing" a={k(170.42)} b={k(172.66) + 4} tam={58} mano pos="abajo" />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 14f · la pulsera blanca: HALDEN CLINIC brilla como una pantallita ======================
const q14f: PlanB = {
  a: 172.66, b: 178.06, trans: { tipo: "corte" },
  sfx: [[172.7, "glitch", -6], [173.4, "sparkle", -6], [174.6, "beep", -8], [176.2, "beep", -8], [177.4, "drone", -10, { dur: 0.6 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const brillo = 0.45 + 0.4 * Math.abs(Math.sin(f / 7));
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: (ff: number) => ff * 14 }} seed={5141} mano={1.5} claves={[mira(0, x9 + 60, 660, 2.4), mira(k(178.06), x9 + 40, 700, 3.0, { curva: "inout" })]}
          medio={<>
            <Persona {...sentadoBus(ABRIGO, x9, { seed: 9, dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 40, cD: 80, hI: 40, cI: 80, pI: 85, rI: -80, pD: 88, rD: -85 } }], caras: [{ f: 0, v: "neutral" }],
              enManoD: <g transform="translate(0,-14)">
                <circle cx={-14} r={22} fill="#7ab8ff" opacity={brillo * 0.4} />
                <rect x={-22} y={-15} width={14} height={30} rx={5} fill="#f4f6f8" stroke="#c9d0d6" strokeWidth={2} />
                <rect x={-20} y={-6} width={10} height={12} rx={2} fill="#7ab8ff" opacity={brillo} />
              </g> })} />
          </>}
          hud={<><Rot t="glowing, like it has a little screen inside" a={k(173.6)} b={k(178.06) + 4} tam={50} pos="abajo" color="#bfe0ff" />
            <Vineta x={1140} y={170} w={640} desde={k(173.2)} hasta={k(178.0)} rot={3} color="#bfe0ff"><svg width={1920} height={1080}><rect width={1920} height={1080} fill="#2a2f36" /><path d="M0,620 C500,560 1400,560 1920,620 L1920,1080 L0,1080 Z" fill="#8a8e94" /><rect x={420} y={330} width={1080} height={420} rx={90} fill="#f4f6f8" stroke="#c9d0d6" strokeWidth={10} /><rect x={640} y={410} width={640} height={260} rx={40} fill="#0f2a44" /><rect x={640} y={410} width={640} height={260} rx={40} fill="#7ab8ff" opacity={brillo * 0.5} /><text x={960} y={520} fontFamily={F_HUD} fontWeight={600} fontSize={92} fill="#d8ecff" textAnchor="middle">HALDEN</text><text x={960} y={620} fontFamily={F_HUD} fontWeight={600} fontSize={64} fill="#a8d0ff" textAnchor="middle" letterSpacing={10}>CLINIC</text></svg></Vineta></>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 14g · se baja en la 38 · las manos frías en el volante ======================
const q14g: PlanB = {
  a: 178.06, b: 182.68, trans: { tipo: "corte" },
  sfx: [[178.1, "bus_door", -2], [178.8, "step", -4], [179.3, "step", -4], [179.7, "wind", -8, { dur: 2.6 }], [180.6, "heart1", -6], [181.6, "heart1", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const frio = interpolate(f, [k(179.8), k(181.2)], [0, 1], cl);
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: () => 0, puertaF: (ff: number) => interpolate(ff, [0, k(178.3), k(179.4), k(179.8)], [0, 1, 1, 0], cl) }} seed={5147} mano={2}
          claves={[mira(0, 520, 600, 1.8), mira(k(179.5), 300, 640, 2.2, { curva: "inout" }), mira(k(182.68), 170, 700, 3.2, { curva: "inout" })]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "duda" }, { f: k(179.7), v: "miedo" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }, { f: k(179.7), v: { x: -0.4, y: 0.8 } }] })} /><Volante />
            {f < k(179.6) && <Persona look={ABRIGO} seed={9} luz={{ lado: 1, color: "#b8c4cc", fuerza: 0.6 }} ruta={[{ f: 0, x: 900, y: BP }, { f: k(178.3), x: 900, y: BP }, { f: k(179.5), x: 540, y: BP }]} dir={[{ f: 0, v: -1 }]}
              opacidad={(ff) => interpolate(ff, [k(179.2), k(179.5)], [1, 0], cl)} caras={[{ f: 0, v: "neutral" }]} />}
            {/* escarcha en las manos */}
            {frio > 0 && <g opacity={frio}>{Array.from({ length: 9 }).map((_, i) => <path key={i} transform={`translate(${110 + random(`fr${i}`) * 110},${BP - 230 + random(`fy${i}`) * 110}) rotate(${i * 20})`} d="M-10,0 h20 M0,-10 v20 M-7,-7 l14,14 M-7,7 l14,-14" stroke="#cfeaff" strokeWidth={3} />)}<circle cx={160} cy={BP - 175} r={90} fill="#7ab8ff" opacity={0.18} /></g>}
          </>}
          hud={<>
            <Rot t="he gets off at STOP 38" a={k(178.2)} b={k(179.6)} tam={56} pos="der" top={170} color={VERDE} />
            <Rot t="like always: cold hands on the wheel" a={k(179.8)} b={k(182.68) + 4} tam={54} mano pos="der" top={300} color="#cfeaff" />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 15 · miércoles: deja el celular en el locker 47 y lo cierra ======================
const LK = DES_PUNTOS.lockers - 300 + 3 * 104;
const Locker47: React.FC<{ abre: number; celu: boolean }> = ({ abre, celu }) => (
  <g transform={`translate(${LK},${DES_PISO - 560})`}>
    <rect x={4} y={4} width={88} height={480} fill="#1d2630" />
    <rect x={8} y={262} width={80} height={6} fill="#4a5a6a" />
    {celu && <g transform="translate(48,236)"><rect x={-17} y={-28} width={34} height={54} rx={6} fill="#15151a" /><rect x={-13} y={-22} width={26} height={40} rx={3} fill="#2a3a4a" /></g>}
    <g transform={`translate(${abre * 4},0) scale(${1 - abre * 0.88},1)`}>
      <rect x={0} y={0} width={96} height={490} fill="#5a7a96" stroke="#2a3a4a" strokeWidth={3} />
      {[0, 1, 2].map((r) => <rect key={r} x={22} y={30 + r * 14} width={54} height={6} rx={3} fill="#2a3a4a" />)}
      <rect x={74} y={260} width={12} height={40} rx={4} fill="#c9ced2" />
      <text x={48} y={120} fontFamily={F_HUD} fontWeight={600} fontSize={26} fill="#f4efe4" textAnchor="middle">47</text>
    </g>
  </g>
);
const q15: PlanB = {
  a: 182.68, b: 188.8, trans: { tipo: "cortina", lado: -1 },
  sfx: [[182.75, "door", -6], [183.3, "step", -4], [183.9, "step", -4], [184.5, "step", -4], [185.6, "metal", -4], [186.3, "cloth", -4], [186.8, "keys", -6], [187.6, "slam", -4], [188.0, "stamp", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const abre = interpolate(f, [k(185.6), k(185.9), k(187.4), k(187.65)], [0, 1, 1, 0], cl);
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "alba" }} seed={515} mano={2.5}
          claves={[mira(0, 1480, 640, 1.55), mira(k(185.0), LK - 40, 630, 1.85, { curva: "inout" }), mira(k(187.6), LK - 30, 625, 2.0, { curva: "inout" }), mira(k(188.8), LK - 30, 625, 2.05)]}
          medio={<>
            <Locker47 abre={abre} celu={f >= k(186.5)} />
            <Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: 1150, y: DES_PISO }, { f: k(185.1), x: LK - 85, y: DES_PISO }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: "celular" }, { f: k(185.2), v: { hD: 30, cD: 60, hI: 50, cI: 20 } }, { f: k(185.9), v: { hD: 88, cD: 8, hI: 10, cI: 20 } }, { f: k(186.5), v: { hD: 60, cD: 30, hI: 10, cI: 20 } }, { f: k(187.3), v: { hD: 80, cD: 10, hI: 10, cI: 20 } }, { f: k(187.8), v: "manosCintura" }]}
              caras={[{ f: 0, v: "determinado" }, { f: k(186.5), v: "duda" }, { f: k(187.5), v: "determinado" }, { f: k(188.1), v: "feliz" }]}
              miradas={[{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: k(185.1), v: { x: 1, y: 0 } }, { f: k(186.6), v: { x: 1, y: 0.3 } }, { f: k(188.1), v: { x: -0.5, y: 0 } }]}
              enManoD={(ff) => (ff < k(186.5) ? <Celular s={0.9} brillo="#7ab8ff" /> : null)}
              cartel={reloj(17, { tam: 36 })} />
          </>}
          hud={<>
            <Rot t="WEDNESDAY · THE EXPERIMENT" a={k(182.8)} b={k(184.6)} tam={56} pos="der" top={170} color={VERDE} />
            <Rot t="74th Street garage" a={k(184.7)} b={k(187.5)} tam={52} mano pos="der" top={170} />
            <Rot t="ALL DAY" a={k(187.7)} b={k(188.8) + 4} tam={84} pos="der" top={170} color="#ffc94a" />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 15b · el número se frena en 19 minutos ======================
const q15b: PlanB = {
  a: 188.8, b: 193.32, trans: { tipo: "corte" },
  sfx: [[188.85, "step", -4], [189.0, "roll", -2, { dur: 1.2 }], [190.4, "ding", -4], [190.6, "stamp", -2], [191.3, "cloth", -4], [191.9, "step", -4], [192.4, "sparkle", -4], [192.6, "birds", -10, { dur: 1 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const frena = f >= k(190.5);
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "alba" }} seed={5152} mano={2.5}
          claves={[mira(0, LK - 60, 620, 1.95), mira(k(190.6), LK + 60, 610, 2.15, { curva: "inout" }), mira(k(193.32), LK + 230, 600, 2.3, { curva: "inout" })]}
          medio={<>
            <Locker47 abre={0} celu={false} />
            <Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: LK - 85, y: DES_PISO }, { f: k(189.3), x: LK - 85, y: DES_PISO }, { f: k(191.2), x: LK + 190, y: DES_PISO }, { f: k(192.0), x: LK + 190, y: DES_PISO }, { f: k(193.32), x: LK + 340, y: DES_PISO }]}
              dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: "manosCintura" }, { f: k(189.3), v: {} }, { f: k(191.2), v: { hD: 20, cD: 100, hI: 10, cI: 20 } }, { f: k(191.9), v: "encogerse" }, { f: k(192.4), v: {} }]}
              caras={[{ f: 0, v: "feliz" }, { f: k(190.5), v: "sorpresa" }, { f: k(191.2), v: "duda" }, { f: k(191.9), v: "feliz" }]}
              miradas={[{ f: 0, v: { x: 0.2, y: -1 } }, { f: k(191.2), v: { x: 0.3, y: 1 } }, { f: k(191.9), v: { x: 1, y: 0 } }]}
              cartel={reloj([{ f: 0, v: 17 }, { f: k(189.0), v: 19, d: 20 }], { tam: 42, color: frena ? "#ffc94a" : VERDE, latido: frena ? 0 : 60 })} />
          </>}
          hud={<>
            <Rot t="⏸ STOPPED AT 19 MIN" a={k(190.5)} b={k(191.75)} tam={60} pos="der" top={170} color="#ffc94a" />
            <Rot t="and around 10 a.m.…" a={k(191.8)} b={k(193.32) + 4} tam={56} mano pos="abajo" />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 16 · ve el skyline al final de la calle 18 ======================
const q16: PlanB = {
  a: 193.32, b: 195.6, trans: { tipo: "luz", d: 12, color: "#fff3d0" },
  sfx: [[193.4, "bus_engine", -14, { dur: 2.2 }], [194.2, "cloth", -6], [194.8, "sparkle", -6]],
  el: (k) => (
    <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: (ff: number) => ff * 14 }} seed={516} mano={2}
      claves={[mira(0, 330, 620, 2.2), mira(k(195.6), 300, 600, 2.6, { curva: "inout" })]}
      medio={<><Persona {...owenVolante({ caras: [{ f: 0, v: "neutral" }, { f: k(194.2), v: "sorpresa" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }, { f: k(194.1), v: { x: -1, y: -0.9 } }], cartel: reloj(19, { tam: 32 }) })} /><Volante /></>}
      hud={<Rot t="he notices…" a={k(193.9)} b={k(195.6) + 4} tam={58} mano pos="der" top={170} />} />
  ),
};
const TORRES: [number, number, number][] = [[150, 430, 130], [330, 300, 110], [500, 520, 150], [700, 380, 120], [880, 700, 160], [1100, 470, 130], [1280, 600, 150], [1480, 330, 120], [1660, 450, 140], [1830, 280, 110]];
const Skyline: React.FC<{ f: number; sube: number }> = ({ f, sube }) => (
  <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <defs><linearGradient id="cielo16" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#79b2e8" /><stop offset="0.62" stopColor="#ffd9a8" /><stop offset="1" stopColor="#ffb98a" /></linearGradient></defs>
    <rect width={1920} height={1080} fill="url(#cielo16)" />
    <circle cx={1360} cy={600} r={260} fill="#fff2c8" opacity={0.3} /><circle cx={1360} cy={600} r={110} fill="#fff4d0" />
    {[0, 1, 2].map((i) => { const x = (f * 2.2 + i * 260) % 2100 - 100; return <path key={i} d={`M${x},${260 + i * 50} q14,-14 28,0 q14,-14 28,0`} stroke="#3a4a5a" strokeWidth={4} fill="none" />; })}
    <g transform={`translate(0,${(1 - sube) * 420})`}>
      {TORRES.map(([x, h, w], i) => (
        <g key={i} transform={`translate(${x},${780 - h * 0.62})`}>
          <rect x={-w / 2} y={0} width={w} height={h * 0.62 + 40} fill={i % 2 ? "#5d7898" : "#6a86a8"} />
          {i === 4 && <><rect x={-w / 2 + 20} y={-90} width={w - 40} height={100} fill="#5d7898" /><rect x={-w / 2 + 44} y={-170} width={w - 88} height={90} fill="#5d7898" /><rect x={-20} y={-260} width={6} height={100} fill="#3a4a5a" /><rect x={14} y={-260} width={6} height={100} fill="#3a4a5a" /></>}
          {Array.from({ length: Math.floor(h * 0.62 / 34) }).map((_, r) => <rect key={r} x={-w / 2 + 14} y={16 + r * 34} width={w - 28} height={8} fill="#a9c4e0" opacity={0.45} />)}
        </g>
      ))}
    </g>
    {/* techos de los two-flats con tanques de agua */}
    <path d="M0,760 H260 V700 H520 V740 H760 V690 H1040 V730 H1300 V700 H1580 V745 H1920 V1080 H0 Z" fill="#8a4a3a" />
    {[[380, 700], [1440, 700]].map(([x, y], i) => <g key={i} transform={`translate(${x},${y})`}><rect x={-46} y={-110} width={92} height={90} rx={8} fill="#6a4a36" /><path d="M-54,-110 L0,-150 L54,-110 Z" fill="#5a3a2a" /><rect x={-40} y={-20} width={8} height={20} fill="#3a2a22" /><rect x={32} y={-20} width={8} height={20} fill="#3a2a22" /></g>)}
    {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={40 + i * 120} y={800 + (i % 3) * 60} width={56} height={70} fill="#ffd98a" opacity={0.5} />)}
    {/* cartel de la calle */}
    <g transform="translate(260,420)"><rect x={-6} y={0} width={12} height={360} fill="#3a4046" /><rect x={-190} y={-70} width={380} height={96} rx={10} fill="#1f6b3a" stroke="#f4efe4" strokeWidth={5} /><text x={0} y={-6} fontFamily={F_HUD} fontWeight={600} fontSize={58} fill="#f4efe4" textAnchor="middle">W 18TH ST</text></g>
    {/* parabrisas, tablero y volante con las manos de Owen */}
    <rect x={0} y={0} width={1920} height={1080} fill="none" stroke="#1d1f24" strokeWidth={90} rx={60} />
    <path d={`M560,980 L${900 + 120 * Math.sin(f / 30)},740`} stroke="#22252a" strokeWidth={10} strokeLinecap="round" />
    <rect x={0} y={960} width={1920} height={120} fill="#25282e" />
    <circle cx={960} cy={1290} r={340} fill="none" stroke="#15161a" strokeWidth={46} />
    <circle cx={720 + 2 * Math.sin(f / 7)} cy={1040} r={40} fill="#17100d" /><circle cx={1200 - 2 * Math.sin(f / 7)} cy={1040} r={40} fill="#17100d" />
  </svg>
);
const q16b: PlanB = {
  a: 195.6, b: 197.9, trans: { tipo: "corte" },
  sfx: [[195.65, "whoosh", -8], [195.9, "riser", -10, { dur: 1.6 }], [196.4, "wind", -14, { dur: 1.4 }], [197.2, "sparkle", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const sube = interpolate(f, [0, k(197.2)], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) });
      const z = interpolate(f, [0, k(197.9)], [1, 1.06], cl);
      return (
        <AbsoluteFill style={{ background: "#79b2e8" }}>
          <AbsoluteFill style={{ transform: `scale(${z}) translate(${Math.sin(f / 9) * 3}px,${Math.sin(f / 5) * 2}px)` }}><Skyline f={f} sube={sube} /></AbsoluteFill>
          <Rot t="the skyline, over the rooftops" a={k(195.9)} b={k(197.9) + 4} tam={56} mano pos="der" top={180} />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};
// ====================== 16c · pasó por ahí mil veces ======================
const q16c: PlanB = {
  a: 197.9, b: 200.3, trans: { tipo: "corte" },
  sfx: [[197.95, "roll", -2, { dur: 1.6 }], [199.6, "ding", -4], [199.8, "cloth", -6]],
  el: (k) => (
    <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: (ff: number) => 3000 + ff * 14 }} seed={5163} mano={2}
      claves={[mira(0, 300, 600, 2.3), mira(k(200.3), 290, 585, 2.55, { curva: "inout" })]}
      medio={<><Persona {...owenVolante({ caras: [{ f: 0, v: "feliz" }, { f: k(199.6), v: "risa" }], miradas: [{ f: 0, v: { x: -1, y: -0.4 } }],
        ajuste: (p, ff) => ({ ...alVolante(ch, 1)(p, ff), cabeza: 5 * Math.sin(ff / 5) }),
        cartel: { claves: [{ f: 0, v: 1 }, { f: k(198.1), v: 1000, d: 42 }], fmt: (v: number) => `${Math.round(v).toLocaleString("en-US")}×`, rotulo: "TIMES PAST THIS VIEW", icono: "reloj", tam: 44, color: "#ffc94a" } })} /><Volante /></>}
      hud={<Rot t="he's driven past that view a thousand times" a={k(198.0)} b={k(200.3) + 4} tam={50} mano pos="abajo" />} />
  ),
};
// ====================== 16d · un halcón en el poste de la parada 22 ======================
const Halcon: React.FC<{ f: number; alas: number; gira: number }> = ({ f, alas, gira }) => (
  <g>
    {/* cola */}
    <path d="M-50,40 L-120,96 L-96,104 L-40,62 Z" fill="#6a4228" />
    {/* ala de atrás que se abre */}
    <path d={`M-10,-6 Q${-90 - 60 * alas},${-40 - 110 * alas} ${-170 - 40 * alas},${-10 - 80 * alas} Q-110,${30 - 20 * alas} -20,40 Z`} fill="#5a3a24" />
    {/* cuerpo y pecho rayado */}
    <ellipse cx={0} cy={10} rx={62} ry={78} fill="#7a5236" />
    <ellipse cx={14} cy={22} rx={40} ry={56} fill="#f2e6cc" />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-6 + (i % 2) * 14},${-6 + i * 14} q8,4 16,0`} stroke="#8a5a36" strokeWidth={4} fill="none" />)}
    {/* ala de adelante */}
    <path d={`M-30,-10 Q${-40 - 40 * alas},${-20 - 120 * alas} ${-110 - 50 * alas},${-40 - 60 * alas} Q-70,${60 - 40 * alas} -10,70 Z`} fill="#6a4228" />
    {/* cabeza que gira */}
    <g transform={`translate(10,-74) scale(${gira},1)`}>
      <circle r={40} fill="#7a5236" /><path d="M10,6 q20,-6 30,10 l-6,20 Z" fill="#f2e6cc" />
      <path d="M30,-6 q26,0 26,18 l-10,10 q0,-14 -16,-14 Z" fill="#f2c14a" stroke="#3a2a1a" strokeWidth={2} />
      <circle cx={16} cy={-10} r={10} fill="#f2c14a" /><circle cx={18} cy={-10} r={5 * (Math.sin(f / 23) > 0.96 ? 0.2 : 1)} fill="#111" />
      <path d="M2,-22 l26,4" stroke="#3a2a1a" strokeWidth={5} strokeLinecap="round" />
    </g>
    {/* garras en el brazo del poste */}
    <path d="M-14,82 l-6,16 M0,84 l0,16 M14,82 l6,16" stroke="#f2c14a" strokeWidth={6} strokeLinecap="round" />
  </g>
);
const POSTE = 1640;
const q16d: PlanB = {
  a: 200.3, b: 203.06, trans: { tipo: "corte" },
  sfx: [[200.35, "wind", -14, { dur: 1.4 }], [200.6, "eagle", -6], [201.4, "flutter", -4], [202.0, "flutter", -6], [202.5, "pop", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const alas = interpolate(f, [k(201.4), k(201.7), k(202.3), k(202.6)], [0, 1, 1, 0], cl) * (0.7 + 0.3 * Math.sin(f / 2));
      const gira = f < k(200.9) ? 1 : f < k(201.1) ? interpolate(f, [k(200.9), k(201.1)], [1, -1]) : -1;
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1500, paradas: [], autos: 1 }} seed={517} mano={2.5}
          claves={[mira(0, POSTE + 40, 250, 2.5), mira(k(203.06), POSTE + 60, 240, 2.8, { curva: "inout" })]}
          medio={<>
            <g transform={`translate(${POSTE},${ASH_PISO - 560})`}>
              <rect x={-9} y={0} width={18} height={760} fill="#3a3f46" /><rect x={-90} y={-12} width={180} height={16} rx={6} fill="#3a3f46" />
              <path d="M-90,-4 q-20,0 -24,20 h48 q-4,-20 -24,-20 Z" fill="#c9ced2" />
              <g transform={`translate(40,-100) scale(0.95) rotate(${Math.sin(f / 11) * 3})`}><Halcon f={f} alas={alas} gira={gira} /></g>
              {/* cartel de la parada 22 colgado del poste */}
              <g transform="translate(-150,-90)"><rect x={-78} y={0} width={156} height={150} rx={12} fill="#1a4fae" stroke="#f4efe4" strokeWidth={5} /><text x={0} y={46} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#f4efe4" textAnchor="middle">CTA</text><text x={0} y={118} fontFamily={F_HUD} fontWeight={600} fontSize={72} fill="#f4efe4" textAnchor="middle">22</text></g>
            </g>
          </>}
          hud={<>
            <Rot t="a hawk · stop 22" a={k(200.5)} b={k(203.06) + 4} tam={56} mano pos="der" top={180} />
            <Vineta x={1180} y={620} w={600} desde={k(201.5)} hasta={k(203.06) + 2} rot={3}>
              <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: () => 5200 }} seed={5164} mano={1} claves={[mira(0, 290, 700, 3.0)]}
                medio={<><Persona {...owenVolante({ caras: [{ f: 0, v: "risa" }], miradas: [{ f: 0, v: { x: -0.6, y: -1 } }] })} /><Volante /></>} />
            </Vineta>
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 16e · el nene de la parada 11 saluda a todos los buses ======================
const q16e: PlanB = {
  a: 203.06, b: 208.36, trans: { tipo: "corte" },
  sfx: [[203.1, "birds", -12, { dur: 2 }], [203.6, "pop", -6], [204.1, "bus_engine", -6, { dur: 1 }], [204.3, "whoosh", -2], [205.2, "sad", -10], [206.3, "bus_engine", -6, { dur: 1 }], [206.5, "whoosh", -2], [207.4, "sad", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const pasa = (a: number) => interpolate(f, [k(a), k(a) + 30], [800, 4800], cl);
      const b1 = pasa(204.2), b2 = pasa(206.4);
      const enPaso = (f > k(204.2) && f < k(204.2) + 30) || (f > k(206.4) && f < k(206.4) + 30);
      const saluda = (ff: number) => ({ hD: 150 + 28 * Math.sin(ff / 2.2), cD: 10 });
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1500, paradas: [{ x: 2700, num: 11 }], autos: 0 }} seed={518} mano={2.5}
          claves={[mira(0, 2480, 920, 1.9), mira(k(205.4), 2460, 930, 2.1, { curva: "inout" }), mira(k(208.36), 2450, 935, 2.25, { curva: "inout" })]}
          medio={<>
            <Persona look={pasajero(4)} seed={575} luz={RIM.sol} ruta={[{ f: 0, x: 2620, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "celular" }]} caras={[{ f: 0, v: "neutral" }]} enManoD={<Celular s={0.9} brillo="#7ab8ff" />} />
            <Persona look={NENE} seed={11} luz={RIM.sol} ruta={[{ f: 0, x: 2380, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: {} }]}
              ajuste={(p: any, ff: number) => (ff < k(205.0) || (ff > k(205.9) && ff < k(207.2)) ? { ...p, ...saluda(ff) } : p)}
              caras={[{ f: 0, v: "risa" }, { f: k(205.1), v: "triste" }, { f: k(205.9), v: "risa" }, { f: k(207.3), v: "triste" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }]}
              cartel={{ claves: 0, fmt: () => "WAVES BACK: 0", icono: "corazon", tam: 34, color: "#ff8a5a", desde: k(205.3) }} />
            {enPaso && <Bus9 x={f < k(205.5) ? b1 : b2} y={ASH_CARRIL} hora="manana" rueda={(f < k(205.5) ? b1 : b2) * 0.7} dir={1} gente={0.6} />}
          </>}
          hud={<Rot t="every bus · every morning" a={k(203.3)} b={k(205.3)} tam={54} mano pos="izq" top={180} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 16f · Owen le devuelve el saludo ======================
const q16f: PlanB = {
  a: 208.36, b: 209.3, trans: { tipo: "corte" },
  sfx: [[208.4, "sparkle", -2], [208.5, "ding", -4]],
  el: (k) => (
    <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: () => 6100 }} seed={5165} mano={2}
      claves={[mira(0, 300, 590, 2.3), mira(k(209.3), 290, 585, 2.45)]}
      medio={<><Persona {...owenVolante({ caras: [{ f: 0, v: "risa" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }],
        ajuste: (p, ff) => ({ ...alVolante(ch, 1, () => 0, "I")(p, ff), hD: 125 + 15 * Math.sin(ff / 2), cD: 35 + 15 * Math.sin(ff / 2) }) })} /><Volante /></>}
      hud={<Rot t="Owen waves back." a={k(208.4)} b={k(209.3) + 6} tam={70} pos="der" top={170} color={VERDE} />} />
  ),
};

// ====================== 17 · Gloria Mark mide cómo se mueve la atención ======================
const APPS = ["MAIL", "CHAT", "NEWS", "VIDEO", "SHOP", "MAPS", "BANK", "PHOTOS"];
const APP_COL = ["#2a6fd6", "#3fa39a", "#c23a2e", "#ffc94a", "#a35ad6", "#3fbf4a", "#5a7a96", "#ff8a5a"];
const Ventana: React.FC<{ x: number; y: number; w: number; h: number; i: number; s?: number }> = ({ x, y, w, h, i, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={16} fill="#f4efe4" stroke="#0b1820" strokeWidth={6} />
    <rect x={-w / 2} y={-h / 2} width={w} height={64} rx={16} fill={APP_COL[i % 8]} />
    <text x={-w / 2 + 28} y={-h / 2 + 46} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#f4efe4">{APPS[i % 8]}</text>
    {[0, 1, 2, 3].map((r) => <rect key={r} x={-w / 2 + 30} y={-h / 2 + 96 + r * 44} width={(w - 60) * (r % 2 ? 0.7 : 0.92)} height={18} rx={9} fill="#c9d0d6" />)}
  </g>
);
const Monitor: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2 - 22} y={-h / 2 - 22} width={w + 44} height={h + 44} rx={26} fill="#15181c" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="#22303a" />
    {children}
    <rect x={-30} y={h / 2 + 22} width={60} height={70} fill="#15181c" /><rect x={-140} y={h / 2 + 86} width={280} height={18} rx={8} fill="#15181c" />
  </g>
);
const Cronometro: React.FC<{ f: number; corre: boolean }> = ({ f, corre }) => (
  <g><circle r={30} fill="#f4efe4" stroke="#22303a" strokeWidth={6} /><rect x={-7} y={-44} width={14} height={12} fill="#22303a" /><path d="M0,0 V-20" stroke="#c23a2e" strokeWidth={5} strokeLinecap="round" transform={`rotate(${corre ? f * 14 : 0})`} /></g>
);
const q17: PlanB = {
  a: 209.3, b: 217.76, trans: { tipo: "cortina", lado: 1 },
  sfx: [[209.35, "whoosh"], [209.8, "pop", -4], [211.3, "stamp", -4], [213.4, "tick", -2], [213.6, "tick", -6, { dur: 3 }], [214.4, "swish", -8], [215.6, "swish", -8], [216.0, "write", -8, { dur: 1.4 }], [216.8, "swish", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const app = f < k(213.4) ? 0 : Math.floor((f - k(213.4)) / 36) + 1;
      const t = f / 24;
      const ojoX = 1230 + Math.sin(t * 1.3) * 300, ojoY = 610 + Math.sin(t * 2.1) * 140;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26" }} seed={517} mano={1.5}
          claves={[mira(0, 960, 540, 1.0), mira(k(217.76), 975, 548, 1.05, { curva: "inout" })]}
          medio={<>
            <Monitor x={1230} y={600} w={780} h={440}>
              <Ventana x={0} y={0} w={700} h={360} i={app} s={interpolate(f % 36, [0, 6], [0.92, 1], cl)} />
              {/* el rastro de la mirada que salta (eye-tracking) */}
              {f > k(213.4) && <g transform="translate(-1230,-600)">{[0, 1, 2, 3, 4].map((i) => { const tt = t - i * 0.12; return <circle key={i} cx={1230 + Math.sin(tt * 1.3) * 300} cy={610 + Math.sin(tt * 2.1) * 140} r={18 - i * 3} fill="#ff4a5a" opacity={0.8 - i * 0.15} />; })}<circle cx={ojoX} cy={ojoY} r={30} fill="none" stroke="#ff4a5a" strokeWidth={5} /></g>}
            </Monitor>
            <Persona look={SCRUBS} seed={61} luz={RIM.tubo} escala={1.9} ruta={[{ f: 0, x: 430, y: 1130 }]} dir={[{ f: 0, v: 1 }]} sombra={0}
              poses={[{ f: 0, v: { hD: 30, cD: 60, hI: 20, cI: 90 } }, { f: k(213.2), v: { hD: 100, cD: 20, hI: 20, cI: 90 } }, { f: k(215.8), v: { hD: 40, cD: 70, hI: 50, cI: 100 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(213.4), v: "determinado" }, { f: k(215.8), v: "duda" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(215.8), v: { x: 0.6, y: 0.8 } }]} habla={[[k(209.4), k(211.0)]]}
              enManoD={(ff) => <Cronometro f={ff} corre={ff > k(213.4)} />}
              enManoI={<g><rect x={-30} y={-40} width={60} height={80} rx={6} fill="#c99b6a" /><rect x={-24} y={-30} width={48} height={64} fill="#f4efe4" /></g>} />
            <NumeroM x={1230} y={240} texto="GLORIA MARK" rotulo="UNIVERSITY OF CALIFORNIA, IRVINE" desde={k(211.24)} tam={84} color="#f4efe4" />
          </>}
          hud={<>
            <Rot t="there's real research behind this" a={k(209.4)} b={k(211.2)} tam={56} pos="der" top={170} color={VERDE} />
            <Rot t="how attention moves on a work screen" a={k(214.0)} b={k(217.76) + 4} tam={48} mano pos="abajo" />
            <Fuente t="Gloria Mark, «Attention Span» (2023) · UC Irvine studies" a={k(211.4)} b={k(213.9)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// trabajador en un escritorio alto (de pie): el escritorio va en `frente` y le tapa las piernas
const Escritorio: React.FC<{ x: number; w?: number }> = ({ x, w = 700 }) => (
  <g transform={`translate(${x},880)`}><rect x={-w / 2} y={0} width={w} height={26} rx={8} fill="#c9a36a" /><rect x={-w / 2 + 20} y={26} width={w - 40} height={200} fill="#8a6a46" /></g>
);
const CRT: React.FC<{ x: number; f: number }> = ({ x, f }) => (
  <g transform={`translate(${x},880)`}>
    <rect x={-150} y={-270} width={300} height={250} rx={22} fill="#d8cfb4" stroke="#a89a7a" strokeWidth={5} />
    <rect x={-120} y={-244} width={240} height={180} rx={18} fill="#1d3a2a" />
    {[0, 1, 2, 3].map((r) => <rect key={r} x={-104} y={-226 + r * 32} width={r === 3 ? ((f / 3) % 120) + 20 : 190} height={12} rx={4} fill="#7dff6a" opacity={0.8} />)}
    <rect x={-60} y={-20} width={120} height={20} fill="#c9bfa4" />
  </g>
);
const BARRA_X = 1000, BARRA_W = 760;
const q17b: PlanB = {
  a: 217.76, b: 222.66, trans: { tipo: "corte" },
  sfx: [[217.8, "whoosh"], [218.2, "type", -12, { dur: 4 }], [219.6, "roll", -2, { dur: 1.6 }], [221.3, "ding", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const b1 = interpolate(f, [k(219.6), k(221.2)], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 2) });
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#14202a", luz: "#ffc94a" }} seed={5172} mano={1.5}
          claves={[mira(0, 960, 540, 1.0), mira(k(222.66), 970, 545, 1.04, { curva: "inout" })]}
          medio={<>
            <Persona look={TRAJE} seed={23} luz={RIM.tubo} escala={1.8} ruta={[{ f: 0, x: 330, y: 1130 }]} dir={[{ f: 0, v: 1 }]} sombra={0}
              poses={[{ f: 0, v: { hD: 70, cD: 40, hI: 60, cI: 50 } }]} ajuste={(p, ff) => ({ ...p, cD: 40 + 8 * Math.sin(ff / 3), cI: 50 + 8 * Math.cos(ff / 3) })}
              caras={[{ f: 0, v: "neutral" }, { f: k(221.3), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }]} />
            <CRT x={640} f={f} />
            <text x={BARRA_X} y={420} fontFamily={F_HUD} fontWeight={600} fontSize={56} fill="#ffc94a">EARLY 2000s</text>
            <text x={BARRA_X} y={480} fontFamily={F_HUD} fontWeight={500} fontSize={44} fill="#c9d0d6">one screen, before switching</text>
            <rect x={BARRA_X} y={520} width={BARRA_W} height={100} rx={20} fill="#22303a" />
            <rect x={BARRA_X} y={520} width={BARRA_W * b1} height={100} rx={20} fill={VERDE} />
            <text x={BARRA_X + BARRA_W / 2} y={770} fontFamily={F_HUD} fontWeight={600} fontSize={130} fill={VERDE} textAnchor="middle" opacity={b1}>≈ 2½ MIN</text>
          </>}
          frente={<Escritorio x={500} w={620} />} />
      );
    };
    return <Pl />;
  },
};
const q17c: PlanB = {
  a: 222.66, b: 226.4, trans: { tipo: "corte" },
  sfx: [[222.7, "whoosh"], [223.4, "swish", -6], [223.9, "swish", -6], [224.4, "roll", -2, { dur: 1.4 }], [224.9, "swish", -6], [225.4, "swish", -6], [225.9, "fail", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const b2 = interpolate(f, [k(224.4), k(225.8)], [0, 47 / 150], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 2) });
      const salta = Math.floor(f / 15);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1a1820", luz: "#ff8a5a" }} seed={5173} mano={2}
          claves={[mira(0, 960, 540, 1.0), mira(k(226.4), 975, 545, 1.05, { curva: "inout" })]}
          medio={<>
            {[0, 1, 2].map((i) => <Ventana key={i} x={480 + (i - 1) * 190} y={340 + Math.abs(i - 1) * 40} w={260} h={190} i={salta + i * 3} s={0.9} />)}
            <Persona look={TRAJE} seed={23} luz={RIM.tubo} escala={1.8} ruta={[{ f: 0, x: 330, y: 1130 }]} dir={[{ f: 0, v: 1 }]} sombra={0}
              poses={[{ f: 0, v: "celular" }]} caras={[{ f: 0, v: "duda" }, { f: k(225.9), v: "miedo" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0.5 } }]} ajuste={(p, ff) => ({ ...p, cabeza: 12 * Math.sin(Math.floor(ff / 15) * 2.1) })} enManoD={<Celular s={1.1} brillo="#7ab8ff" />} />
            <text x={BARRA_X} y={420} fontFamily={F_HUD} fontWeight={600} fontSize={48} fill="#9aa4ac">EARLY 2000s</text>
            <rect x={BARRA_X} y={440} width={BARRA_W} height={80} rx={18} fill="#5a6a74" />
            <text x={BARRA_X + BARRA_W - 20} y={500} fontFamily={F_HUD} fontWeight={600} fontSize={48} fill="#f4efe4" textAnchor="end">2½ MIN</text>
            <text x={BARRA_X} y={640} fontFamily={F_HUD} fontWeight={600} fontSize={56} fill="#ff8a5a" opacity={interpolate(f, [k(223.0), k(223.4)], [0, 1], cl)}>RECENT STUDIES</text>
            <rect x={BARRA_X} y={660} width={BARRA_W * b2} height={100} rx={20} fill="#ff8a5a" />
            <text x={BARRA_X + BARRA_W * b2 + 30} y={746} fontFamily={F_HUD} fontWeight={600} fontSize={96} fill="#ff8a5a" opacity={b2 > 0.05 ? 1 : 0}>47 SEC</text>
          </>}
          frente={<Escritorio x={430} w={520} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 17d · tras una interrupción: más de 20 minutos para volver ======================
const q17d: PlanB = {
  a: 226.4, b: 231.14, trans: { tipo: "corte" },
  sfx: [[226.5, "phone_buzz", -2], [227.2, "pop", -4], [228.2, "cloth", -6], [228.6, "tick", -2, { dur: 2.4 }], [230.6, "slam", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const u = interpolate(f, [k(228.4), k(230.6)], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 2) });
      const CX = 1320, CY = 560, R = 250;
      const vib = f > k(226.5) && f < k(227.2) ? Math.sin(f * 2.4) * 6 : 0;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1a1820", luz: "#ffc94a" }} seed={5174} mano={2}
          claves={[mira(0, 960, 540, 1.0), mira(k(231.14), 980, 550, 1.06, { curva: "inout" })]}
          medio={<>
            <Persona look={TRAJE} seed={23} luz={RIM.tubo} escala={1.8} ruta={[{ f: 0, x: 380, y: 1130 }]} dir={[{ f: 0, v: 1 }]} sombra={0}
              poses={[{ f: 0, v: { hD: 70, cD: 40, hI: 60, cI: 50 } }, { f: k(227.2), v: "celular" }, { f: k(228.2), v: "manosCara" }]}
              caras={[{ f: 0, v: "determinado" }, { f: k(226.6), v: "sorpresa" }, { f: k(228.2), v: "duda" }, { f: k(230.6), v: "cansado" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(228.2), v: { x: 0.4, y: -0.8 } }]}
              enManoD={(ff) => (ff > k(227.2) && ff < k(228.2) ? <Celular s={1.1} brillo="#7ab8ff" /> : null)} />
            {f < k(227.2) && <g transform={`translate(${640 + vib},850) rotate(90)`}><Celular s={2.2} brillo="#7ab8ff" /></g>}
            <circle cx={CX} cy={CY} r={R} fill="#1f2a33" stroke="#2c3a44" strokeWidth={40} />
            {u > 0.01 && <path d={arco(CX, CY, R, 0, u * Math.PI * 2 * 0.999)} stroke="#ffc94a" strokeWidth={40} fill="none" strokeLinecap="round" />}
            <text x={CX} y={CY + 10} fontFamily={F_HUD} fontWeight={600} fontSize={130} fill="#ffc94a" textAnchor="middle">{Math.round(u * 20)}+</text>
            <text x={CX} y={CY + 80} fontFamily={F_HUD} fontWeight={600} fontSize={48} fill="#f4efe4" textAnchor="middle">MINUTES</text>
            <text x={CX} y={CY + R + 110} fontFamily={F_HUD} fontWeight={600} fontSize={50} fill="#f4efe4" textAnchor="middle" opacity={interpolate(f, [k(228.6), k(229)], [0, 1], cl)}>to get fully back</text>
          </>}
          frente={<Escritorio x={470} w={560} />}
          hud={<Rot t="after ONE interruption" a={k(226.6)} b={k(228.6)} tam={56} pos="der" top={170} color="#ff8a5a" />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 17e · 47 segundos… y otra cosa… y otra cosa… pausa ======================
const q17e: PlanB = {
  a: 231.14, b: 235.36, trans: { tipo: "corte" },
  sfx: [[231.2, "slam", -2], [231.4, "tick", -4, { dur: 1 }], [232.5, "swish", -2], [233.54, "swish", -2], [234.6, "glitch", -6], [234.7, "stamp", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f0 = useF();
      const pausa = f0 >= k(234.6);
      const f = pausa ? k(234.6) : f0;
      const n = f < k(232.5) ? 0 : f < k(233.54) ? 1 : 2;
      const flip = interpolate(f, [k([231.14, 232.5, 233.54][n]), k([231.14, 232.5, 233.54][n]) + 8], [0.6, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) });
      const seg = Math.max(0, 47 - Math.floor((f - k(231.2)) / 30 * 10));
      return (
        <AbsoluteFill>
          <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26" }} seed={5175} mano={pausa ? 0 : 2}
            claves={[mira(0, 960, 540, 1.0), mira(k(234.6), 980, 545, 1.06, { curva: "inout" })]}
            medio={<>
              <Ventana x={1250} y={560} w={860} h={520} i={[1, 3, 4][n]} s={flip} />
              <Persona look={TRAJE} seed={23} luz={RIM.tubo} escala={1.8} ruta={[{ f: 0, x: 330, y: 1130 }]} dir={[{ f: 0, v: 1 }]} sombra={0}
                poses={[{ f: 0, v: "celular" }]} caras={[{ f: 0, v: "cansado" }, { f: k(232.5), v: "duda" }, { f: k(233.54), v: "sorpresa" }]}
                miradas={[{ f: 0, v: { x: 1, y: 0 } }]} ajuste={(p) => ({ ...p, cabeza: [0, -14, 14][n] })} enManoD={<Celular s={1.1} brillo="#7ab8ff" />} />
              <CartelM x={1250} y={170} claves={0} texto={`0:${String(seg).padStart(2, "0")}`} icono="reloj" tam={70} f={f} desde={k(231.2)} color="#ff8a5a" />
            </>}
            hud={<>
              <Rot t="47 seconds." a={k(231.2)} b={k(232.45)} tam={60} mano pos="abajo" />
              <Rot t="then something else." a={k(232.5)} b={k(233.5)} tam={60} mano pos="abajo" />
              <Rot t="then something else…" a={k(233.54)} b={k(234.58)} tam={60} mano pos="abajo" />
            </>} />
          {pausa && <AbsoluteFill style={{ background: "rgba(8,12,16,0.55)", justifyContent: "center", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 40, transform: `scale(${interpolate(f0 - k(234.6), [0, 6], [1.4, 1], cl)})` }}><div style={{ width: 70, height: 240, borderRadius: 18, background: "#f4efe4" }} /><div style={{ width: 70, height: 240, borderRadius: 18, background: "#f4efe4" }} /></div>
            <div style={{ position: "absolute", top: 740, left: 0, right: 0, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 84, color: "#f4efe4" }}>QUICK PAUSE</div>
          </AbsoluteFill>}
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

// ====================== 18 · CTA a mitad: ¿qué diría TU reloj? ======================
const VALS18 = ["3h 12m", "6h 40m", "1h 05m", "9h 22m", "4h 48m", "2h 31m", "7h 17m"];
const OWEN_CTA = (x: number, extra: Partial<PersonaP>): PersonaP => ({ look: OWEN, seed: 47, luz: RIM.tubo, escala: 2.0, ruta: [{ f: 0, x, y: 1130 }], dir: [{ f: 0, v: 1 }], sombra: 0, ...extra });
const q18: PlanB = {
  a: 235.36, b: 239.1, trans: { tipo: "fundido", d: 10 },
  sfx: [[235.4, "whoosh"], [235.8, "pop", -2], [236.6, "pop", 0], [236.9, "roll", -4, { dur: 2.2 }], [238.6, "ding", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const n = Math.floor(f / 4) % VALS18.length;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0e1a20" }} seed={518} mano={2} claves={[mira(0, 960, 560, 1.0), mira(k(239.1), 975, 560, 1.06, { curva: "inout" })]}
          medio={<>
            <Persona {...OWEN_CTA(560, {
              poses: [{ f: 0, v: { hD: 160, cD: 20, hI: 10, cI: 20 } }, { f: k(236.6), v: { hD: 92, cD: 4, hI: 10, cI: 20 } }],
              caras: [{ f: 0, v: "feliz" }, { f: k(236.6), v: "picaro" }], miradas: [{ f: 0, v: { x: 0.2, y: -1 } }, { f: k(236.6), v: { x: 1, y: 0 } }], habla: [[k(235.4), k(239.0)]],
              cartel: reloj(132, { tam: 40 }) })} />
            <CartelM x={1380} y={480} claves={0} icono="reloj" texto={f > k(236.9) && f < k(238.6) ? VALS18[n] : "?h ??m"} rotulo="YOURS · TODAY" tam={84} f={f} desde={k(236.6)} color="#ffc94a" />
          </>}
          hud={<Rot t="what would YOURS say today?" a={k(237.0)} b={k(239.1) + 4} tam={56} mano pos="abajo" />} />
      );
    };
    return <Pl />;
  },
};
const Comentario: React.FC<{ f: number; desde: number; texto: string }> = ({ f, desde, texto }) => {
  const s = interpolate(f, [desde, desde + 8], [0.4, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) });
  if (f < desde) return null;
  const n = Math.max(0, Math.floor((f - desde - 6) * 1.2));
  return (
    <g transform={`translate(1360,520) scale(${s})`}>
      <path d="M-380,-170 h760 a40,40 0 0 1 40,40 v220 a40,40 0 0 1 -40,40 h-560 l-90,80 l10,-80 h-120 a40,40 0 0 1 -40,-40 v-220 a40,40 0 0 1 40,-40 Z" fill="#f4efe4" />
      <circle cx={-300} cy={-80} r={44} fill="#ffc94a" /><text x={-232} y={-64} fontFamily={F_HUD} fontWeight={600} fontSize={48} fill="#22303a">YOU · comment</text>
      <text x={-330} y={40} fontFamily={F_HUD} fontWeight={600} fontSize={56} fill="#c23a2e">{texto.slice(0, n)}{(f % 20) < 10 ? "|" : ""}</text>
    </g>
  );
};
const q18b: PlanB = {
  a: 239.1, b: 241.1, trans: { tipo: "corte" },
  sfx: [[239.15, "stamp", -2], [240.1, "pop", 0], [240.3, "type", -8, { dur: 0.8 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0e1a20", luz: "#ffc94a" }} seed={5182} mano={2} claves={[mira(0, 960, 560, 1.03), mira(k(241.1), 970, 560, 1.07)]}
          medio={<>
            <Persona {...OWEN_CTA(520, { poses: [{ f: 0, v: "brazosCruzados" }, { f: k(240.1), v: { hD: 92, cD: 4, hI: 10, cI: 20 } }], caras: [{ f: 0, v: "picaro" }, { f: k(240.1), v: "feliz" }], miradas: [{ f: 0, v: { x: 0.3, y: 0 } }, { f: k(240.1), v: { x: 1, y: 0 } }], habla: [[k(239.15), k(241.0)]] })} />
            <Comentario f={f} desde={k(240.1)} texto="today: 6h 40m" />
          </>}
          hud={<Rot t={f < k(240.1) ? "BE HONEST." : "put it in the comments"} a={k(239.15)} b={k(241.1) + 4} tam={f < k(240.1) ? 110 : 66} pos="der" top={170} color={f < k(240.1) ? "#ffc94a" : VERDE} />} />
      );
    };
    return <Pl />;
  },
};
const q18c: PlanB = {
  a: 241.1, b: 242.02, trans: { tipo: "corte" },
  sfx: [[241.15, "pop", 0], [241.9, "ding", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#200e10", luz: "#e0262b" }} seed={5183} mano={2} claves={[mira(0, 960, 560, 1.03), mira(k(242.02), 965, 560, 1.06)]}
          medio={<Persona {...OWEN_CTA(380, { poses: [{ f: 0, v: { hD: 60, cD: 20, hI: 10, cI: 20 } }, { f: k(241.5), v: { hD: 88, cD: 0, hI: 10, cI: 20 } }], caras: [{ f: 0, v: "feliz" }, { f: k(241.9), v: "risa" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }], habla: [[k(241.1), k(242.0)]] })} />}
          hud={<BotonSub desde={k(241.0)} f={f} top={560} />} />
      );
    };
    return <Pl />;
  },
};
const q18d: PlanB = {
  a: 242.02, b: 244.36, trans: { tipo: "corte" },
  sfx: [[242.05, "riser", -6, { dur: 2 }], [242.4, "roll", -2, { dur: 1.6 }], [243.4, "heart1", -4], [244.0, "boom", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1e1418", luz: "#ff6a5a" }} seed={5184} mano={2} claves={[mira(0, 960, 560, 1.0), mira(k(244.36), 990, 560, 1.08, { curva: "inout" })]}
          medio={<>
            <Persona {...OWEN_CTA(470, { poses: [{ f: 0, v: {} }, { f: k(243.4), v: "manosCara" }], caras: [{ f: 0, v: "duda" }, { f: k(243.4), v: "miedo" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }], cartel: reloj(132, { tam: 34 }) })} />
            <Persona look={DEE} seed={34} luz={{ lado: -1, color: "#7ab8ff", fuerza: 0.7 }} escala={2.0} ruta={[{ f: 0, x: 2200, y: 1130 }, { f: k(242.8), x: 1400, y: 1130 }]} dir={[{ f: 0, v: -1 }]} sombra={0}
              poses={[{ f: 0, v: "celular" }]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: -0.3, y: 0.8 } }]} enManoD={<Celular s={0.9} brillo="#7ab8ff" />}
              cartel={reloj([{ f: 0, v: 480 }, { f: k(242.4), v: 660, d: 45 }], { tam: 44, rotulo: "DEE", color: "#ff6a5a", latido: 80 })} />
          </>}
          hud={<Rot t="his sister is about to break the record" a={k(242.1)} b={k(244.36) + 4} tam={52} mano pos="abajo" />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 19 · miércoles a la noche: Dee llega del doble turno ======================
const s19 = LIV_PUNTOS.sofa;
const LIBRO = <g><rect x={-28} y={-20} width={56} height={40} rx={3} fill="#c94a3a" /><rect x={-2} y={-20} width={4} height={40} fill="#8a2a22" /></g>;
const OWEN_LEE = (extra: Partial<PersonaP>): PersonaP => ({ look: OWEN_CASA, seed: 47, luz: RIM.noche, ruta: [{ f: 0, x: 1800, y: LP }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { hD: 70, cD: 80, hI: 60, cI: 90, cabeza: 14 } }], caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.3, y: 0.8 } }], enManoD: LIBRO, cartel: reloj(19, { tam: 30 }), ...extra });
const q19: PlanB = {
  a: 244.36, b: 247.42, trans: { tipo: "cortina", lado: -1 },
  sfx: [[244.4, "door", -4], [245.0, "step", -4], [245.7, "step", -4], [246.4, "step", -4], [247.1, "step", -4]],
  el: (k) => (
    <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={519} mano={2.5}
      claves={[mira(0, 1900, 640, 1.65), mira(k(247.42), 1700, 640, 1.65, { curva: "inout" })]}
      medio={<>
        <Persona {...OWEN_LEE({ caras: [{ f: 0, v: "neutral" }, { f: k(246.4), v: "duda" }], miradas: [{ f: 0, v: { x: -0.3, y: 0.8 } }, { f: k(246.2), v: { x: 1, y: 0 } }] })} />
        <Persona look={DEE} seed={34} luz={{ lado: -1, color: "#7ab8ff", fuerza: 0.7 }} ruta={[{ f: 0, x: 2230, y: LP }, { f: k(244.8), x: 2230, y: LP }, { f: k(247.42), x: 1560, y: LP, curva: "lineal" }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: "celular" }]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 0, y: 0.8 } }]} opacidad={(ff) => interpolate(ff, [0, 8], [0, 1], cl)}
          enManoD={<Celular s={0.9} brillo="#7ab8ff" />} enManoI={<g><rect x={-30} y={-6} width={60} height={70} rx={10} fill="#3a5a7a" /><path d="M-18,-6 q18,-30 36,0" stroke="#3a5a7a" strokeWidth={6} fill="none" /></g>} />
      </>}
      hud={<>
        <Rot t="WEDNESDAY NIGHT" a={k(244.45)} b={k(245.8)} tam={58} pos="izq" top={180} color={VERDE} />
        <Rot t="after a double shift at Rush" a={k(245.9)} b={k(247.42) + 4} tam={54} mano pos="izq" top={180} />
      </>} />
  ),
};
const q19b: PlanB = {
  a: 247.42, b: 251.92, trans: { tipo: "corte" },
  sfx: [[247.5, "step", -4], [248.1, "step", -4], [248.7, "fall", -8], [248.9, "cloth", -2], [249.6, "type", -14, { dur: 2 }], [251.1, "cloth", -6]],
  el: (k) => (
    <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={5192} mano={2.5}
      claves={[mira(0, 1380, 640, 1.55), mira(k(249.0), 1320, 645, 1.6, { curva: "inout" }), mira(k(251.92), 1330, 640, 1.68, { curva: "inout" })]}
      medio={<>
        <Persona {...OWEN_LEE({ caras: [{ f: 0, v: "neutral" }, { f: k(251.0), v: "sorpresa" }], miradas: [{ f: 0, v: { x: -0.3, y: 0.8 } }, { f: k(250.9), v: { x: -1, y: 0 } }], poses: [{ f: 0, v: { hD: 70, cD: 80, hI: 60, cI: 90, cabeza: 14 } }, { f: k(250.9), v: { hD: 40, cD: 60, hI: 30, cI: 60, cabeza: 0 } }] })} />
        <Persona look={DEE} seed={34} luz={{ lado: -1, color: "#7ab8ff", fuerza: 0.7 }} ruta={[{ f: 0, x: 1560, y: LP }, { f: k(248.6), x: s19 - 80, y: LP }]} dir={[{ f: 0, v: -1 }, { f: k(248.6), v: 1 }]}
          asiento={[{ f: 0, v: undefined }, { f: k(248.6), v: undefined }, { f: k(248.9), v: LIV_PUNTOS.asiento }]}
          poses={[{ f: 0, v: "celular" }, { f: k(248.9), v: { ...POSE_CELU_SENTADO, tronco: -10, cabeza: 18 } }]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.7 } }]}
          enManoD={<Celular s={0.9} brillo="#7ab8ff" />} />
      </>}
      hud={<Rot t="still in her scrubs · phone in her hand" a={k(249.0)} b={k(251.92) + 4} tam={50} mano pos="abajo" />} />
  ),
};
// ====================== 19c · 11 horas, 6 minutos ======================
const q19c: PlanB = {
  a: 251.92, b: 255.36, trans: { tipo: "corte" },
  sfx: [[251.95, "roll", 0, { dur: 1.2 }], [253.06, "boom", -4], [253.3, "heart", -8, { dur: 2 }], [254.1, "cloth", -4]],
  el: (k) => (
    <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={5193} mano={2}
      claves={[mira(0, s19 - 40, 640, 1.95), mira(k(253.06), s19 - 60, 650, 2.2, { curva: "inout" }), mira(k(255.36), s19 - 60, 655, 2.3)]}
      medio={<Persona look={DEE} seed={34} luz={{ lado: -1, color: "#7ab8ff", fuerza: 0.8 }} ruta={[{ f: 0, x: s19 - 80, y: LP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: LIV_PUNTOS.asiento }]}
        poses={[{ f: 0, v: { ...POSE_CELU_SENTADO, tronco: -10, cabeza: 18 } }]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.7 } }]}
        enManoD={<Celular s={0.9} brillo="#7ab8ff" />}
        cartel={reloj([{ f: 0, v: 0 }, { f: k(252.0), v: 666, d: 26 }], { tam: 52, rotulo: "DEE · TODAY", color: "#ff6a5a", latido: 70 })} />}
      hud={<>
        <Vineta x={1180} y={560} w={600} desde={k(253.9)} hasta={k(255.36) + 2} rot={3}>
          <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={5194} mano={1} claves={[mira(0, 1800, 660, 3.2)]}
            medio={<Persona {...OWEN_LEE({ poses: [{ f: 0, v: "manosCara" }], caras: [{ f: 0, v: "miedo" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }], enManoD: undefined, cartel: undefined })} />} />
        </Vineta>
        <Rot t="he's scared for her" a={k(254.1)} b={k(255.36) + 4} tam={50} mano pos="izq" top={880} />
      </>} />
  ),
};
// ====================== 19d · las enfermeras pasan horas cargando historias clínicas ======================
const FILAS19 = ["08:00 · METOPROLOL ✓", "08:15 · BP 128/82 ✓", "09:00 · INSULIN ✓", "09:30 · BP 141/90 ✓", "10:00 · TYLENOL ✓"];
const q19d: PlanB = {
  a: 255.36, b: 260.82, trans: { tipo: "cortina", lado: 1 },
  sfx: [[255.4, "whoosh"], [255.8, "type", -6, { dur: 5 }], [256.6, "beep", -12], [257.6, "beep", -12], [258.6, "beep", -12], [259.6, "beep", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const M = HAL_PUNTOS.mesa;
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "dia" }} seed={5195} mano={2}
          claves={[mira(0, M + 150, HAL_PISO - 300, 2.0), mira(k(260.82), M + 170, HAL_PISO - 310, 2.25, { curva: "inout" })]}
          medio={<>
            <g transform={`translate(${M + 230},${HAL_PISO - 250})`}>
              <rect x={-12} y={0} width={24} height={250} fill="#3a3f46" /><rect x={-90} y={240} width={180} height={14} rx={6} fill="#3a3f46" />
              <rect x={-130} y={-30} width={200} height={20} rx={6} fill="#c9ced2" />
              <rect x={-210} y={-300} width={420} height={270} rx={14} fill="#22303a" />
              <rect x={-196} y={-286} width={392} height={242} rx={8} fill="#eaf4fb" />
              <text x={-180} y={-252} fontFamily={F_HUD} fontWeight={600} fontSize={24} fill="#1a4fae">PATIENT CHART · BED 12</text>
              {FILAS19.map((t, i) => <text key={i} x={-180} y={-212 + i * 36} fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#22303a" opacity={interpolate(f, [k(256.0 + i * 0.9), k(256.0 + i * 0.9) + 4], [0, 1], cl)}>{t}</text>)}
            </g>
            <Persona look={DEE} seed={34} luz={RIM.clinica} ruta={[{ f: 0, x: M + 20, y: HAL_PISO }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 70, cD: 30, hI: 70, cI: 30 } }]} ajuste={(p, ff) => ({ ...p, cD: 30 + 10 * Math.sin(ff / 1.6), cI: 30 + 10 * Math.cos(ff / 1.4) })}
              caras={[{ f: 0, v: "determinado" }, { f: k(259.0), v: "cansado" }]} miradas={[{ f: 0, v: { x: 1, y: -0.2 } }]} />
          </>}
          hud={<>
            <Rot t="nurses: hours of every shift, typing" a={k(255.5)} b={k(258.3)} tam={50} mano pos="abajo" />
            <Rot t="every pill · every blood pressure" a={k(258.35)} b={k(260.82) + 4} tam={50} mano pos="abajo" />
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 19e · pero 11 horas no es cargar historias ======================
const q19e: PlanB = {
  a: 260.82, b: 263.14, trans: { tipo: "corte" },
  sfx: [[260.85, "whoosh", -6], [261.3, "type", -8, { dur: 1.6 }], [261.6, "stamp", -2]],
  el: (k) => (
    <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={5196} mano={2}
      claves={[mira(0, s19 - 60, 645, 2.2), mira(k(263.14), s19 - 70, 655, 2.4, { curva: "inout" })]}
      medio={<Persona look={DEE} seed={34} luz={{ lado: -1, color: "#7ab8ff", fuerza: 0.8 }} ruta={[{ f: 0, x: s19 - 80, y: LP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: LIV_PUNTOS.asiento }]}
        poses={[{ f: 0, v: { ...POSE_CELU_SENTADO, tronco: -10, cabeza: 18 } }]} ajuste={(p, ff) => ({ ...p, cD: (p.cD ?? 125) + 8 * Math.sin(ff / 1.3) })}
        caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.7 } }]} enManoD={<Celular s={0.9} brillo="#7ab8ff" />}
        cartel={reloj(666, { tam: 50, rotulo: "NOT CHARTING", color: "#ff6a5a" })} />}
      hud={<Rot t="but 11 hours is not charting" a={k(260.9)} b={k(263.14) + 4} tam={60} pos="abajo" color="#ff8a5a" />} />
  ),
};
// ====================== 19f · se sienta al lado: ojos rojos, el pulgar no para ======================
const q19f: PlanB = {
  a: 263.14, b: 268.22, trans: { tipo: "corte" },
  sfx: [[263.2, "step", -4], [263.7, "step", -4], [264.1, "cloth", -2], [264.4, "type", -6, { dur: 3.6 }], [266.2, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const rojo = interpolate(f, [k(265.6), k(266.6)], [0, 1], cl);
      return (
        <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={5197} mano={2}
          claves={[mira(0, s19 + 80, 620, 1.9), mira(k(264.4), s19 + 10, 610, 2.1, { curva: "inout" }), mira(k(265.8), s19 - 30, 690, 2.7, { curva: "inout" }), mira(k(268.22), s19 - 40, 695, 2.9)]}
          medio={<>
            <Persona look={DEE} seed={34} luz={{ lado: -1, color: "#7ab8ff", fuerza: 0.9 }} ruta={[{ f: 0, x: s19 - 80, y: LP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: LIV_PUNTOS.asiento }]}
              poses={[{ f: 0, v: { ...POSE_CELU_SENTADO, tronco: -10, cabeza: 18 } }]} ajuste={(p, ff) => ({ ...p, cD: (p.cD ?? 125) + 10 * Math.sin(ff / 1.0) })}
              caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.7 } }]} enManoD={<Celular s={0.9} brillo="#7ab8ff" prendido={false} />} />
            {rojo > 0 && <Halo x={s19 - 70} y={700} r={60} color="#ff3a4a" fuerza={0.6 * rojo} />}
            <Persona look={OWEN_CASA} seed={47} luz={RIM.noche} ruta={[{ f: 0, x: s19 + 420, y: LP }, { f: k(264.0), x: s19 + 90, y: LP }]} dir={[{ f: 0, v: -1 }]}
              asiento={[{ f: 0, v: undefined }, { f: k(264.0), v: undefined }, { f: k(264.3), v: LIV_PUNTOS.asiento }]}
              poses={[{ f: 0, v: {} }, { f: k(264.3), v: "sentado" }]} caras={[{ f: 0, v: "triste" }, { f: k(265.6), v: "miedo" }]} miradas={[{ f: 0, v: { x: -1, y: 0.3 } }]} />
          </>}
          hud={<>
            <Rot t="her screen is turned away" a={k(264.2)} b={k(265.8)} tam={52} mano pos="der" top={180} />
            <Rot t="eyes red · thumb moving fast" a={k(265.9)} b={k(268.22) + 4} tam={52} mano pos="der" top={180} color="#ff8a9a" />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 20 · los ojos: parpadeo normal 15-20 por minuto ======================
// parpadeo: cada `ritmo` cuadros el ojo se cierra 6 cuadros
const parpadeo = (f: number, ritmo: number, fase = 0) => { const c = (f + fase) % ritmo; return c < 6 ? Math.abs(c - 3) / 3 : 1; };
const q20: PlanB = {
  a: 268.22, b: 273.44, trans: { tipo: "luz", d: 12 },
  sfx: [[268.3, "whoosh"], [268.9, "swish", -10], [270.6, "pop", -4], [271.2, "swish", -10], [272.6, "swish", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const abre = parpadeo(f, 54, 20);
      const n = Math.floor((f + 20) / 54);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26" }} seed={520} mano={1.5} claves={[mira(0, 960, 540, 1.0), mira(k(273.44), 975, 545, 1.05, { curva: "inout" })]}
          medio={<>
            <OjoGrande x={720} y={560} esc={0.78} abre={abre} f={f} mira={0.2 * Math.sin(f / 30)} />
            <text x={1470} y={330} fontFamily={F_HUD} fontWeight={600} fontSize={48} fill="#c9d0d6" textAnchor="middle">BLINKS</text>
            <text x={1470} y={470} fontFamily={F_HUD} fontWeight={600} fontSize={150} fill={VERDE} textAnchor="middle" style={{ fontVariantNumeric: "tabular-nums" }}>{n}</text>
            {f > k(270.5) && <NumeroM x={1470} y={760} texto="15–20" rotulo="BLINKS PER MINUTE · NORMAL" desde={k(270.54)} tam={120} color={VERDE} />}
          </>}
          hud={<Rot t="what 11 hours of screen does to your eyes" a={k(268.4)} b={k(270.5)} tam={52} pos="abajo" />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 20b · mirando una pantalla: la mitad o menos ======================
const q20b: PlanB = {
  a: 273.44, b: 277.58, trans: { tipo: "corte" },
  sfx: [[273.5, "glitch", -10], [273.8, "drone", -14, { dur: 3.6 }], [274.6, "roll", -4, { dur: 1.4 }], [276.2, "fail", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const abre = parpadeo(f, 160, 120);
      const u = interpolate(f, [k(274.6), k(276.1)], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 2) });
      const BX = 1180, BW = 600;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0c1824", luz: "#7ab8ff" }} seed={5202} mano={1.5} claves={[mira(0, 960, 540, 1.02), mira(k(277.58), 990, 545, 1.08, { curva: "inout" })]}
          medio={<>
            <OjoGrande x={600} y={560} esc={0.72} abre={abre} f={f} mira={0} />
            {/* reflejo de la pantalla en el ojo */}
            <Halo x={640} y={560} r={260} color="#7ab8ff" fuerza={0.35 + 0.1 * Math.sin(f / 5)} />
            <rect x={660} y={490} width={44} height={70} rx={8} fill="#cfe6ff" opacity={0.7 * abre} />
            <text x={BX} y={300} fontFamily={F_HUD} fontWeight={600} fontSize={48} fill="#c9d0d6">BLINKS PER MINUTE</text>
            <text x={BX} y={380} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill={VERDE}>NORMAL</text>
            <rect x={BX} y={400} width={BW} height={80} rx={18} fill={VERDE} />
            <text x={BX + BW - 24} y={456} fontFamily={F_HUD} fontWeight={600} fontSize={48} fill="#0f1e26" textAnchor="end">18</text>
            <text x={BX} y={580} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#ff8a5a">ON A SCREEN</text>
            <rect x={BX} y={600} width={BW * (1 - 0.6 * u)} height={80} rx={18} fill="#ff8a5a" />
            <text x={BX + BW * (1 - 0.6 * u) + 24} y={656} fontFamily={F_HUD} fontWeight={600} fontSize={48} fill="#ff8a5a">{Math.round(18 - 11 * u)}</text>
            <text x={BX + BW / 2} y={820} fontFamily={F_HUD} fontWeight={600} fontSize={84} fill="#ff8a5a" textAnchor="middle" opacity={u}>HALF OR LESS</text>
          </>}
          hud={<FuenteB texto="Studies on screen use & blink rate (e.g. Patel et al., 1991; Portello et al., 2013)" desde={k(274.0)} hasta={k(277.58)} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 20c · se secan, arden, se cansan ======================
const q20c: PlanB = {
  a: 277.58, b: 280.54, trans: { tipo: "corte" },
  sfx: [[277.6, "fail", -8], [278.0, "pop", -2], [278.7, "fire", -12, { dur: 1.2 }], [278.8, "pop", -2], [279.6, "pop", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const rojo = interpolate(f, [k(277.6), k(279.6)], [0.1, 1], cl);
      const seco = interpolate(f, [k(277.6), k(278.4)], [0, 1], cl);
      const abre = 0.75 + 0.08 * Math.sin(f / 3) - (f > k(279.6) ? 0.25 : 0);
      const ET: [string, number, number][] = [["DRY", 277.9, 260], ["BURNING", 278.7, 520], ["TIRED", 279.6, 780]];
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1e1418", luz: "#ff6a5a" }} seed={5203} mano={2} claves={[mira(0, 960, 540, 1.04), mira(k(280.54), 940, 545, 1.12, { curva: "inout" })]}
          medio={<>
            <OjoGrande x={640} y={560} esc={0.72} abre={abre} rojo={rojo} seco={seco} f={f} />
            {ET.map(([t, s, y], i) => { const u = interpolate(f, [k(s), k(s) + 8], [0, 1], cl); return u > 0 && <g key={i} opacity={u}>
              <Flecha x1={1250} y1={y - 10} x2={960} y2={460 + i * 70} u={u} color="#ff8a9a" w={10} curva={0.1} />
              <text x={1280} y={y + 20} fontFamily={F_HUD} fontWeight={600} fontSize={84} fill="#ff8a9a" transform={`scale(1)`}>{t}</text>
            </g>; })}
          </>} />
      );
    };
    return <Pl />;
  },
};
// ====================== 20d · la regla 20-20-20 (con Dee) ======================
const Ventanal: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-210} y={-260} width={420} height={520} rx={10} fill="#8fc7ef" stroke="#c9a36a" strokeWidth={18} />
    <rect x={-210} y={120} width={420} height={140} fill="#7fbf6a" />
    <rect x={30} y={-20} width={24} height={200} fill="#6a4a30" />
    <g transform={`rotate(${Math.sin(f / 20) * 2},42,0)`}><circle cx={42} cy={-60} r={110} fill="#3f9a4a" /><circle cx={-20} cy={-10} r={70} fill="#4aaa56" /><circle cx={110} cy={-10} r={70} fill="#3a8a44" /></g>
    <rect x={-4} y={-260} width={8} height={520} fill="#c9a36a" />
  </g>
);
const q20d: PlanB = {
  a: 280.54, b: 287.48, trans: { tipo: "cortina", lado: 1 },
  sfx: [[280.6, "whoosh"], [280.9, "stamp", -2], [283.6, "pop", -2], [283.8, "tick", -4, { dur: 1 }], [284.6, "cloth", -4], [284.8, "swish", -4], [285.3, "write", -8, { dur: 1 }], [286.0, "tick", -4, { dur: 1.4 }], [287.3, "ding", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const titulo = f < k(283.54);
      const mira20 = f >= k(284.6);
      const regla = interpolate(f, [k(285.0), k(285.6)], [0, 1], cl);
      const seg = f < k(286.0) ? 20 : Math.max(0, 20 - Math.floor((f - k(286.0)) / 4));
      const minU = interpolate(f, [k(283.6), k(284.5)], [0, 1], cl);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26", luz: VERDE }} seed={5204} mano={1.5} claves={[mira(0, 960, 540, 1.0), mira(k(287.48), 975, 548, 1.05, { curva: "inout" })]}
          medio={<>
            <Ventanal x={1520} y={600} f={f} />
            <Persona look={DEE} seed={34} luz={RIM.tubo} escala={1.6} ruta={[{ f: 0, x: 420, y: 1110 }]} dir={[{ f: 0, v: 1 }]} sombra={0}
              poses={[{ f: 0, v: "celular" }, { f: k(284.6), v: { hD: 30, cD: 20, hI: 8, cI: 6 } }]}
              caras={[{ f: 0, v: "cansado" }, { f: k(284.7), v: "sorpresa" }, { f: k(285.6), v: "feliz" }]}
              miradas={[{ f: 0, v: { x: 0.3, y: 0.9 } }, { f: k(284.6), v: { x: 1, y: -0.1 } }]}
              enManoD={<Celular s={0.9} brillo="#7ab8ff" prendido={!mira20} />} />
            {titulo && <NumeroM x={960} y={330} texto="20 · 20 · 20" rotulo="WHAT EYE DOCTORS RECOMMEND" desde={k(280.7)} tam={150} color={VERDE} />}
            {!titulo && <g transform="translate(900,300)">
              <circle r={120} fill="#1f2a33" stroke="#2c3a44" strokeWidth={26} />
              <path d={arco(0, 0, 120, 0, (seg < 20 ? seg / 20 : minU) * Math.PI * 2 * 0.999)} stroke={seg < 20 ? "#ffc94a" : VERDE} strokeWidth={26} fill="none" strokeLinecap="round" />
              <text y={30} fontFamily={F_HUD} fontWeight={600} fontSize={92} fill="#f4efe4" textAnchor="middle">20</text>
              <text y={200} fontFamily={F_HUD} fontWeight={600} fontSize={56} fill={seg < 20 ? "#ffc94a" : VERDE} textAnchor="middle">{f < k(286.0) ? "EVERY 20 MIN" : `LOOK ${seg} SEC`}</text>
            </g>}
            {regla > 0 && <g opacity={regla}>
              <Flecha x1={700} y1={820} x2={1280} y2={820} u={regla} color="#ffc94a" w={10} />
              <Flecha x1={1280} y1={820} x2={700} y2={820} u={regla} color="#ffc94a" w={10} />
              <text x={990} y={790} fontFamily={F_HUD} fontWeight={600} fontSize={60} fill="#ffc94a" textAnchor="middle">20 FEET · 6 m</text>
            </g>}
          </>}
          hud={<FuenteB texto="American Academy of Ophthalmology · American Optometric Association" desde={k(281.0)} hasta={k(287.4)} />} />
      );
    };
    return <Pl />;
  },
};
// ====================== 20e · Dee no levantó la vista en 11 horas; de noche, peor ======================
const q20e: PlanB = {
  a: 287.48, b: 291.34, trans: { tipo: "corte" },
  sfx: [[287.5, "whoosh", -6], [287.8, "type", -10, { dur: 3 }], [289.6, "drone", -12, { dur: 1.8 }], [290.4, "heart1", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const osc = interpolate(f, [k(289.4), k(291.2)], [0, 0.42], cl);
      return (
        <AbsoluteFill>
          <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={5205} mano={2}
            claves={[mira(0, s19 - 40, 650, 2.0), mira(k(291.34), s19 - 60, 660, 2.35, { curva: "inout" })]}
            medio={<>
              <Persona look={DEE} seed={34} luz={{ lado: -1, color: "#7ab8ff", fuerza: 0.9 }} ruta={[{ f: 0, x: s19 - 80, y: LP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: LIV_PUNTOS.asiento }]}
                poses={[{ f: 0, v: { ...POSE_CELU_SENTADO, tronco: -14, cabeza: 22 } }]} ajuste={(p, ff) => ({ ...p, cD: (p.cD ?? 125) + 8 * Math.sin(ff / 1.2) })}
                caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.8 } }]} enManoD={<Celular s={0.9} brillo="#7ab8ff" />}
                cartel={reloj([{ f: 0, v: 666 }, { f: k(289.6), v: 671, d: 30 }], { tam: 50, rotulo: "HASN'T LOOKED UP", color: "#ff6a5a", latido: 70 })} />
              <Halo x={s19 - 30} y={720} r={140 + 160 * osc} color="#7ab8ff" fuerza={0.3 + osc} />
            </>} />
          <AbsoluteFill style={{ background: `rgba(6,10,24,${osc})` }} />
          <Rot t="and at night, it gets worse" a={k(289.5)} b={k(291.34) + 4} tam={56} mano pos="abajo" />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

// ====================== 21 · el estudio de Brigham and Women's: tablet vs libro ======================
const Cama21: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-40} y={0} width={720} height={70} rx={14} fill="#e9e2d2" />
    <rect x={-40} y={60} width={720} height={40} rx={6} fill="#8a6a46" />
    <rect x={660} y={-170} width={34} height={270} rx={10} fill="#8a6a46" />
    <rect x={-60} y={-70} width={30} height={170} rx={10} fill="#8a6a46" />
    <rect x={540} y={-44} width={130} height={56} rx={26} fill="#f4efe4" stroke="#d8d0c0" strokeWidth={4} />
  </g>
);
const Manta21: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => <path d={`M${x - 46},${y - 30} q120,-26 240,-6 q120,16 220,-4 l10,104 h-470 Z`} fill={color} stroke="#00000022" strokeWidth={4} />;
const TABLET = <g><rect x={-46} y={-34} width={92} height={68} rx={8} fill="#15151a" /><rect x={-40} y={-28} width={80} height={56} rx={4} fill="#9fd0ff" /></g>;
const DURMIENTE = (look: any, seed: number, extra: Partial<PersonaP>): PersonaP => ({ look, seed, ruta: [{ f: 0, x: 0, y: 0 }], dir: [{ f: 0, v: -1 }], sombra: 0, escala: 1.75, luz: { lado: 1, color: "#9fc4ff", fuerza: 0.5 }, ...extra });
const CAMAS21 = { x: 330, yA: 470, yB: 880 };
const Camas21: React.FC<{ f: number; k: K; dormidoB: boolean; grogui?: number; manana?: boolean }> = ({ f, k, dormidoB, grogui = 0, manana }) => {
  const { x, yA, yB } = CAMAS21;
  return (
    <g>
      <Cama21 x={x} y={yA} />
      <Acostado x={x + 30} y={yA - 6} rot={90}>
        <Persona {...DURMIENTE(ESTUDIANTE, 71, { poses: [{ f: 0, v: manana ? ACOST(8, 10) : ACOST(150, 40) }], caras: [{ f: 0, v: manana ? "cansado" : "neutral" }], miradas: [{ f: 0, v: { x: 0.8, y: -0.5 } }], enManoD: manana ? undefined : TABLET })} />
      </Acostado>
      <Manta21 x={x + 60} y={yA + 10} color="#4f6fa8" />
      {!manana && <Halo x={x + 470} y={yA - 90} r={200} color="#7ab8ff" fuerza={0.55 + 0.1 * Math.sin(f / 4)} />}
      <Cama21 x={x} y={yB} />
      <Acostado x={x + 30} y={yB - 6} rot={90}>
        <Persona {...DURMIENTE(SENORA, 72, { poses: [{ f: 0, v: dormidoB && !manana ? ACOST(20, 60) : manana ? ACOST(170, 10, 170, 10) : ACOST(150, 40) }], caras: [{ f: 0, v: dormidoB && !manana ? "cansado" : manana ? "feliz" : "neutral" }], miradas: [{ f: 0, v: { x: 0.8, y: -0.5 } }], enManoD: dormidoB ? undefined : LIBRO })} />
      </Acostado>
      <Manta21 x={x + 60} y={yB + 10} color="#a85a4a" />
      {dormidoB && !manana && [0, 1, 2].map((i) => { const t = ((f / 30 + i / 3) % 1); return <text key={i} x={x + 640 + t * 80} y={yB - 120 - t * 120} fontFamily={F_MANO} fontWeight={700} fontSize={50 + 20 * t} fill="#c9d0d6" opacity={1 - t}>z</text>; })}
      {grogui > 0 && <g opacity={grogui}>{[0, 1, 2].map((i) => <circle key={i} cx={x + 520 + Math.cos(f / 6 + i * 2.1) * 60} cy={yA - 170 + Math.sin(f / 6 + i * 2.1) * 20} r={12} fill="#c9d0d6" />)}</g>}
    </g>
  );
};
const ROT21 = (t: string, c: string) => <span style={{ color: c }}>{t}</span>;
const Columna21: React.FC<{ f: number; top: number; titulo: React.ReactNode; sub?: string; a: number }> = ({ f, top, titulo, sub, a }) => (
  <div style={{ position: "absolute", left: 1220, width: 600, top, fontFamily: F_HUD, fontWeight: 600, fontSize: 56, color: "#f4efe4", lineHeight: 1.1, opacity: interpolate(f, [a, a + 8], [0, 1], cl), textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>
    {titulo}{sub && <div style={{ fontSize: 44, color: "#c9d0d6", marginTop: 8 }}>{sub}</div>}
  </div>
);
const q21: PlanB = {
  a: 291.34, b: 296.5, trans: { tipo: "fundido", d: 12 },
  sfx: [[291.4, "whoosh", -4], [291.8, "stamp", -4], [293.7, "pop", -4], [294.5, "pop", -4], [295.0, "paper", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0e1626" }} seed={521} mano={1.5} claves={[mira(0, 960, 560, 1.0), mira(k(296.5), 975, 565, 1.04, { curva: "inout" })]}
          medio={<Camas21 f={f} k={k} dormidoB={false} />}
          hud={<>
            <Columna21 f={f} a={k(291.5)} top={170} titulo="BRIGHAM AND WOMEN'S HOSPITAL" sub="Boston · reading before bed" />
            <Columna21 f={f} a={k(293.7)} top={430} titulo={ROT21("▲ LIGHT-EMITTING TABLET", "#9fd0ff")} />
            <Columna21 f={f} a={k(294.5)} top={720} titulo={ROT21("▼ PRINTED BOOK", "#ffc94a")} />
            <Fuente t="Chang et al., PNAS (2015)" a={k(291.6)} b={k(296.5)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
const q21b: PlanB = {
  a: 296.5, b: 298.3, trans: { tipo: "corte" },
  sfx: [[296.55, "snore", -8, { dur: 1.6 }], [296.8, "paper", -6], [297.4, "tick", -6, { dur: 0.9 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0a1220" }} seed={5212} mano={1.5} claves={[mira(0, 975, 565, 1.04), mira(k(298.3), 985, 570, 1.07)]}
          medio={<Camas21 f={f} k={k} dormidoB />}
          hud={<>
            <Columna21 f={f} a={k(296.6)} top={300} titulo={ROT21("STILL AWAKE", "#9fd0ff")} sub="took longer to fall asleep" />
            <Columna21 f={f} a={k(296.8)} top={720} titulo={ROT21("ASLEEP ✓", "#ffc94a")} />
          </>} />
      );
    };
    return <Pl />;
  },
};
const q21c: PlanB = {
  a: 298.3, b: 301.6, trans: { tipo: "corte" },
  sfx: [[298.35, "whoosh"], [298.6, "roll", -4, { dur: 1.4 }], [300.0, "fail", -8], [300.4, "sparkle", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const u = interpolate(f, [k(298.6), k(299.9)], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 2) });
      const H = 520, B = 900;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0c1426" }} seed={5213} mano={1.5} claves={[mira(0, 960, 540, 1.0), mira(k(301.6), 960, 545, 1.04)]}
          medio={<>
            <NumeroM x={960} y={210} texto="MELATONIN" rotulo="THE HORMONE THAT TELLS YOUR BODY IT'S NIGHT" desde={k(298.4)} tam={110} color="#c9b6ff" />
            <g transform="translate(1420,300)"><circle r={70} fill="#f4efe4" /><circle cx={30} cy={-18} r={62} fill="#0c1426" /></g>
            {[["PRINTED BOOK", 1, "#ffc94a", 640], ["TABLET", 0.45, "#9fd0ff", 1180]].map(([t, v, c, x], i) => {
              const h = H * (v as number) * u;
              return <g key={i}>
                <rect x={(x as number) - 120} y={B - h} width={240} height={h} rx={16} fill={c as string} />
                <text x={x as number} y={B + 70} fontFamily={F_HUD} fontWeight={600} fontSize={50} fill="#f4efe4" textAnchor="middle">{t as string}</text>
              </g>;
            })}
            <text x={1180} y={B - H * 0.45 * u - 30} fontFamily={F_HUD} fontWeight={600} fontSize={70} fill="#ff8a5a" textAnchor="middle" opacity={interpolate(f, [k(300.0), k(300.3)], [0, 1], cl)}>LESS</text>
          </>} />
      );
    };
    return <Pl />;
  },
};
const q21d: PlanB = {
  a: 301.6, b: 303.94, trans: { tipo: "luz", d: 8, color: "#fff3d0" },
  sfx: [[301.65, "beep", -6], [301.95, "beep", -6], [302.3, "birds", -12, { dur: 1.4 }], [302.6, "cloth", -6], [303.0, "fail", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#3a3a52", luz: "#ffd88a" }} seed={5214} mano={2} claves={[mira(0, 975, 565, 1.04), mira(k(303.94), 985, 570, 1.08)]}
          medio={<><Camas21 f={f} k={k} dormidoB manana grogui={interpolate(f, [k(302.2), k(302.8)], [0, 1], cl)} />
            <Despertador x={1080} y={250} t="7:00" esc={1.6} brillo={Math.abs(Math.sin(f / 4))} /></>}
          hud={<>
            <Columna21 f={f} a={k(302.0)} top={330} titulo={ROT21("GROGGIER", "#9fd0ff")} sub="the next morning" />
            <Columna21 f={f} a={k(302.4)} top={720} titulo={ROT21("RESTED ✓", "#ffc94a")} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 22 · «¿qué estás mirando?» ======================
const DEE_SOFA = (extra: Partial<PersonaP>): PersonaP => ({ look: DEE, seed: 34, luz: { lado: -1, color: "#7ab8ff", fuerza: 0.8 }, ruta: [{ f: 0, x: s19 - 80, y: LP }], dir: [{ f: 0, v: 1 }], asiento: [{ f: 0, v: LIV_PUNTOS.asiento }], poses: [{ f: 0, v: { ...POSE_CELU_SENTADO, tronco: -10, cabeza: 18 } }], caras: [{ f: 0, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.4, y: 0.7 } }], enManoD: <Celular s={0.9} brillo="#7ab8ff" />, ...extra });
const OWEN_SOFA = (extra: Partial<PersonaP>): PersonaP => ({ look: OWEN_CASA, seed: 47, luz: RIM.noche, ruta: [{ f: 0, x: s19 + 90, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: LIV_PUNTOS.asiento }], poses: [{ f: 0, v: "sentado" }], caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: -1, y: 0.2 } }], ...extra });
const q22: PlanB = {
  a: 303.94, b: 305.8, trans: { tipo: "corte" },
  sfx: [[304.0, "cloth", -6], [304.3, "pop", -4]],
  el: (k) => (
    <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={522} mano={2} claves={[mira(0, s19, 660, 2.1), mira(k(305.8), s19 + 10, 665, 2.25)]}
      medio={<><Persona {...DEE_SOFA({})} /><Persona {...OWEN_SOFA({ habla: [[k(304.0), k(305.6)]] })} /></>}
      hud={<svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}><GloboM x={1180} y={500} texto={"What are you\nlooking at?"} desde={k(304.2)} hasta={k(305.8) + 4} tam={46} lado={1} /></svg>} />
  ),
};
// Dee da vuelta el celular: la luz de la pantalla le pega a Owen
const q22b: PlanB = {
  a: 305.8, b: 307.18, trans: { tipo: "corte" },
  sfx: [[305.85, "swish", -2], [306.2, "sparkle", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const gira = interpolate(f, [0, k(306.2)], [0, 1], cl);
      return (
        <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={5222} mano={2} claves={[mira(0, s19 + 10, 670, 2.4), mira(k(307.18), s19 + 20, 675, 2.6)]}
          medio={<>
            <Persona {...DEE_SOFA({ poses: [{ f: 0, v: { ...POSE_CELU_SENTADO, tronco: -10, cabeza: 18 } }, { f: k(306.1), v: { hD: 70, cD: 40, hI: 8, cI: 30, cabeza: 0 } }], caras: [{ f: 0, v: "cansado" }, { f: k(306.2), v: "triste" }], miradas: [{ f: 0, v: { x: 0.4, y: 0.7 } }, { f: k(306.2), v: { x: 1, y: 0 } }], enManoD: <Celular s={1} brillo="#7ab8ff" prendido={gira > 0.5} /> })} />
            <Persona {...OWEN_SOFA({ caras: [{ f: 0, v: "duda" }, { f: k(306.4), v: "sorpresa" }], luz: { lado: -1, color: "#9fd0ff", fuerza: 0.5 + 0.5 * gira } })} />
            {gira > 0.5 && <Halo x={s19 + 40} y={690} r={160} color="#9fd0ff" fuerza={0.5} />}
          </>}
          hud={<Rot t="Dee turns the phone around" a={k(305.9)} b={k(307.18) + 4} tam={52} mano pos="abajo" />} />
      );
    };
    return <Pl />;
  },
};
// celular grande en HTML (búsquedas, foro, llamadas, mensajes): texto ≥44 px
const CeluG: React.FC<{ x?: number; top?: number; w?: number; h?: number; f: number; desde?: number; vib?: number; children: React.ReactNode; fondo?: string }> = ({ x = 1250, top = 100, w = 600, h = 880, f, desde = 0, vib = 0, children, fondo = "#f4f6f8" }) => {
  const s = interpolate(f - desde, [0, 10], [0, 1], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const v = vib && f >= vib && f < vib + 20 ? Math.sin(f * 2.6) * 7 : 0;
  return (
    <div style={{ position: "absolute", left: x - w / 2 + v + Math.sin(f / 33) * 5, top: top + (1 - s) * 900 + Math.sin(f / 24) * 6, width: w, height: h, borderRadius: 64, background: "#141418", padding: 18, boxSizing: "border-box", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", transform: `rotate(${Math.sin(f / 45) * 0.8}deg)` }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 48, background: fondo, overflow: "hidden", position: "relative", fontFamily: F_HUD, color: "#20242c" }}>{children}</div>
    </div>
  );
};
const BUSQ = [["Halden Clinic", 308.64], ["Halden Clinic complaints", 309.74], ["Halden Clinic missing participants", 311.2], ["Halden Clinic Fulton Market", 313.06]] as const;
const Busquedas: React.FC<{ f: number; k: K }> = ({ f, k }) => (
  <>
    <div style={{ margin: "34px 26px 18px", padding: "16px 24px", borderRadius: 40, background: "#e3e8ee", fontSize: 44, fontWeight: 600, color: "#5a6470" }}>search…</div>
    {BUSQ.map(([t, s], i) => {
      if (f < k(s)) return null;
      const roja = i === 2;
      const n = Math.floor((f - k(s)) * 1.6);
      return (
        <div key={i} style={{ margin: "0 26px 18px", padding: "14px 20px", borderRadius: 20, background: roja ? "#ffe2dc" : "#ffffff", border: roja ? "4px solid #e2483a" : "2px solid #dde3e8", fontSize: 46, fontWeight: 600, color: roja ? "#c23a2e" : "#1a4fae", lineHeight: 1.1, transform: `scale(${interpolate(f - k(s), [0, 6], [0.9, 1], cl)})` }}>
          {t.slice(0, n)}
        </div>
      );
    })}
  </>
);
const q22c: PlanB = {
  a: 307.18, b: 313.06, trans: { tipo: "corte" },
  sfx: [[307.2, "whoosh", -4], [308.64, "type", -6, { dur: 0.8 }], [309.74, "type", -6, { dur: 0.9 }], [311.2, "type", -6, { dur: 1 }], [311.9, "heart1", -4], [312.2, "drone", -12, { dur: 0.9 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <AbsoluteFill style={{ background: "#2a2230" }}>
          <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={5223} mano={1.5} claves={[mira(0, s19 + 300, 640, 1.4)]} />
          <AbsoluteFill style={{ background: "rgba(10,12,24,0.45)" }} />
          <Vineta x={110} y={330} w={720} desde={k(307.4)} hasta={k(313.06) + 4} rot={-2}>
            <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={5224} mano={1} claves={[mira(0, s19 + 88, 690, 3.6)]}
              medio={<><Persona {...OWEN_SOFA({ caras: [{ f: 0, v: "duda" }, { f: k(311.3), v: "miedo" }], miradas: [{ f: 0, v: { x: -0.6, y: 0.4 } }], luz: { lado: -1, color: "#9fd0ff", fuerza: 1 } })} /><Halo x={s19 + 60} y={700} r={90} color="#9fd0ff" fuerza={0.45} /></>} />
          </Vineta>
          <CeluG f={f} desde={0}><Busquedas f={f} k={k} /></CeluG>
          <Rot t="a page of search results" a={k(307.3)} b={k(309.6)} tam={50} mano pos="izq" top={180} />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};
const q22d: PlanB = {
  a: 313.06, b: 316.1, trans: { tipo: "corte" },
  sfx: [[313.06, "type", -6, { dur: 1 }], [314.2, "pop", -4], [314.9, "paper", -4], [315.3, "roll", -6, { dur: 0.8 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <AbsoluteFill style={{ background: "#2a2230" }}>
          <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={5225} mano={1.5} claves={[mira(0, s19 + 320, 640, 1.45)]} />
          <AbsoluteFill style={{ background: "rgba(10,12,24,0.5)" }} />
          {/* mapa con el pin de Fulton Market */}
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <g transform={`translate(470,560) rotate(-3) scale(${interpolate(f, [k(313.6), k(314.0)], [0.6, 1], cl)})`} opacity={interpolate(f, [k(313.6), k(313.9)], [0, 1], cl)}>
              <rect x={-330} y={-250} width={660} height={500} rx={24} fill="#e9efe6" stroke="#f4efe4" strokeWidth={10} />
              {[-200, -60, 80, 220].map((x) => <rect key={x} x={x} y={-250} width={26} height={500} fill="#ffffff" />)}
              {[-150, -10, 130].map((y) => <rect key={y} x={-330} y={y} width={660} height={26} fill="#ffffff" />)}
              <rect x={-330} y={-250} width={110} height={500} fill="#9fd0ff" opacity={0.6} />
              <g transform={`translate(30,${-30 - Math.abs(Math.sin(f / 6)) * 16})`}><path d="M0,0 c-50,-60 -50,-120 0,-120 c50,0 50,60 0,120 Z" fill="#e2483a" /><circle cy={-80} r={18} fill="#fff" /></g>
              <text x={30} y={120} fontFamily={F_HUD} fontWeight={600} fontSize={52} fill="#20242c" textAnchor="middle">FULTON MARKET</text>
            </g>
          </svg>
          <CeluG f={f} desde={-20}>
            <div style={{ marginTop: 30 }}><Busquedas f={f} k={k} /></div>
          </CeluG>
          <Rot t="she's been reading for days" a={k(314.85)} b={k(316.1) + 4} tam={54} mano pos="abajo" />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};
// ====================== 22e · posts de foro: hermanos y esposas que dejaron de contestar ======================
const POSTS: [string, string, string, number][] = [
  ["@mari_t", "My brother signed up for a paid study in Chicago. Hasn't answered since May.", "HALDON CLINIC", 316.3],
  ["@rgonzo", "Wife did a 'screen time' trial downtown. Phone goes straight to voicemail.", "HALDEN CLINIK", 318.2],
  ["@k.lee", "Anyone else? Paid study, Chicago, Week 5… then nothing.", "HALDENE", 320.0],
];
const q22e: PlanB = {
  a: 316.1, b: 322.02, trans: { tipo: "corte" },
  sfx: [[316.2, "whoosh", -4], [316.3, "pop", -2], [318.2, "pop", -2], [320.0, "pop", -2], [321.0, "phone_buzz", -14], [321.4, "drone", -12, { dur: 0.6 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <AbsoluteFill style={{ background: "#1c1a26" }}>
          <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1c1a26", luz: "#ff6a5a" }} seed={5226} mano={1} claves={[mira(0, 960, 540, 1.0)]} />
          <div style={{ position: "absolute", left: 110, top: 160, fontFamily: F_HUD, fontWeight: 600, fontSize: 54, color: "#f4efe4", opacity: interpolate(f, [4, 10], [0, 1], cl) }}>FORUM · <span style={{ color: "#ff8a5a" }}>«paid study chicago»</span></div>
          {POSTS.map(([u, t, n, s], i) => {
            const o = interpolate(f, [k(s), k(s) + 8], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) });
            return (
              <div key={i} style={{ position: "absolute", left: 110 + i * 580, top: 290 + (1 - o) * 80 + (i % 2) * 40, width: 550, opacity: o, transform: `rotate(${[-1.5, 1, -0.5][i]}deg)`, background: "#f4efe4", borderRadius: 26, padding: "24px 26px", boxSizing: "border-box", fontFamily: F_HUD, color: "#20242c", boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 44, fontWeight: 600, color: "#5a6470" }}><div style={{ width: 54, height: 54, borderRadius: 27, background: ["#ff8a5a", "#7ab8ff", "#3fbf4a"][i] }} />{u}</div>
                <div style={{ fontSize: 54, fontWeight: 600, lineHeight: 1.14, marginTop: 18 }}>{t}</div>
                <div style={{ fontSize: 52, fontWeight: 600, color: "#c23a2e", marginTop: 22 }}>#{n}</div>
              </div>
            );
          })}
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};
// ====================== 22f · el nombre nunca escrito igual dos veces ======================
const VARIANTES: [string, number[], number][] = [["HALDON CLINIC", [4], 322.6], ["HALDEN CLINIK", [12], 323.3], ["HALDENE CLINIC", [6], 324.0]];
const q22f: PlanB = {
  a: 322.02, b: 325.44, trans: { tipo: "corte" },
  sfx: [[322.05, "glitch", -6], [322.6, "stamp", -4], [323.3, "stamp", -4], [324.0, "stamp", -4], [324.8, "glitch", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const gl = (Math.floor(f / 3) % 7 === 0) ? 6 : 0;
      return (
        <AbsoluteFill style={{ background: "#141220" }}>
          <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#141220", luz: "#ff6a5a" }} seed={5227} mano={1} claves={[mira(0, 960, 540, 1.0)]} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 96, color: "#f4efe4", letterSpacing: 8, transform: `translateX(${gl}px)` }}>HALDEN CLINIC</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 44, color: "#9aa4ac" }}>never spelled the same way twice</div>
          {VARIANTES.map(([t, rojas, s], i) => {
            const o = interpolate(f, [k(s), k(s) + 6], [0, 1], cl);
            return (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 440 + i * 170, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 92, letterSpacing: 8, color: "#c9d0d6", opacity: o, transform: `rotate(${[-2, 1.5, -1][i]}deg) scale(${interpolate(o, [0, 1], [1.3, 1])})` }}>
                {t.split("").map((c, j) => rojas.includes(j) ? <span key={j} style={{ color: "#ff4a3d", border: "6px solid #ff4a3d", borderRadius: 50, padding: "0 6px" }}>{c}</span> : <span key={j}>{c}</span>)}
              </div>
            );
          })}
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};
// ====================== 22g · «Owen… ¿estás metido en esto?» ======================
const q22g: PlanB = {
  a: 325.44, b: 328.94, trans: { tipo: "corte" },
  sfx: [[325.5, "cloth", -8], [326.0, "heart", -10, { dur: 2.8 }]],
  el: (k) => (
    <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={5228} mano={1.5} claves={[mira(0, s19 - 20, 680, 2.4), mira(k(328.94), s19 - 50, 690, 2.9, { curva: "inout" })]}
      medio={<><Persona {...DEE_SOFA({ poses: [{ f: 0, v: { hD: 20, cD: 60, hI: 8, cI: 30 } }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 1, y: -0.1 } }], enManoD: <Celular s={0.9} prendido={false} />, habla: [[k(326.2), k(328.6)]] })} />
        <Persona {...OWEN_SOFA({ caras: [{ f: 0, v: "miedo" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }] })} /></>}
      hud={<svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}><GloboM x={800} y={440} texto={"Owen…\nare you in this?"} desde={k(326.0)} hasta={k(328.94) + 4} tam={48} lado={-1} /></svg>} />
  ),
};
const q22h: PlanB = {
  a: 328.94, b: 332.72, trans: { tipo: "corte" },
  sfx: [[329.0, "drone", -14, { dur: 3 }], [331.0, "heart1", -6], [332.24, "cloth", -4], [332.3, "ding", -8]],
  el: (k) => (
    <Escena Set={Living} pal={PAL} setProps={{ hora: "noche", tele: false }} seed={5229} mano={1.5} claves={[mira(0, s19 + 100, 690, 2.8), mira(k(332.72), s19 + 95, 695, 3.3, { curva: "inout" })]}
      medio={<><Persona {...DEE_SOFA({ poses: [{ f: 0, v: { hD: 20, cD: 60, hI: 8, cI: 30 } }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 1, y: -0.1 } }], enManoD: <Celular s={0.9} prendido={false} /> })} />
        <Persona {...OWEN_SOFA({ caras: [{ f: 0, v: "miedo" }, { f: k(331.0), v: "triste" }, { f: k(332.24), v: "determinado" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }, { f: k(330.2), v: { x: -0.5, y: 0.8 } }, { f: k(332.0), v: { x: -1, y: 0 } }],
          ajuste: (p, ff) => ({ ...p, cabeza: (p.cabeza ?? 0) + (ff > k(332.24) ? 14 * Math.sin((ff - k(332.24)) / 2.2) : 0) }) })} /></>}
      hud={<>
        <Rot t="for the first time in five weeks" a={k(329.0)} b={k(330.9)} tam={54} mano pos="abajo" />
        <Rot t="he doesn't lie." a={k(331.0)} b={k(332.72) + 4} tam={70} pos="abajo" color="#ffc94a" />
      </>} />
  ),
};

// ====================== 23 · jueves: el examen de Lena ======================
const FICHAS = (ff: number, abre = 1) => (
  <g transform={`rotate(${Math.sin(ff / 9) * 6})`}>
    {["NaCl", "pH 7", "H₂O"].map((t, i) => (
      <g key={i} transform={`rotate(${(i - 1) * 16 * abre}) translate(0,-6)`}>
        <rect x={-40} y={-56} width={80} height={56} rx={5} fill={["#fff7c8", "#f4efe4", "#dff4ff"][i]} stroke="#bdb6a8" strokeWidth={2} />
        <text x={0} y={-20} fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#20242c" textAnchor="middle">{t}</text>
      </g>
    ))}
  </g>
);
const q23: PlanB = {
  a: 332.72, b: 335.12, trans: { tipo: "cortina", lado: 1 },
  sfx: [[332.8, "whoosh"], [333.0, "bus_engine", -14, { dur: 2 }], [333.4, "paper", -4], [334.2, "paper", -4]],
  el: (k) => (
    <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "dia", avance: (ff: number) => 8000 + ff * 12 }} seed={523} mano={2}
      claves={[mira(0, 560, 640, 1.55), mira(k(335.12), 600, 650, 1.7, { curva: "inout" })]}
      medio={<>
        <Persona {...owenVolante({ caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }, { f: k(334.0), v: { x: 1, y: 0 } }], cartel: reloj(9, { tam: 30 }) })} /><Volante />
        <Persona {...sentadoBus(LENA, ASIENTO_X(1), { seed: 18, poses: [{ f: 0, v: { ...POSE_CELU_SENTADO, hD: 50, cD: 110, hI: 40, cI: 120 } }], caras: [{ f: 0, v: "miedo" }, { f: k(334.0), v: "determinado" }], miradas: [{ f: 0, v: { x: 0.4, y: 0.8 } }],
          habla: [[k(333.5), k(334.6)]], enManoD: (ff) => FICHAS(ff) })} />
      </>}
      hud={<Rot t="THURSDAY · LENA'S EXAM" a={k(332.9)} b={k(335.12) + 4} tam={58} pos="der" top={170} color={VERDE} />} />
  ),
};
const COLEGIO = 2860;
const q23b: PlanB = {
  a: 335.12, b: 339.42, trans: { tipo: "corte" },
  sfx: [[335.15, "bus_brake", -6], [335.6, "bus_door", -4], [336.4, "step", -4], [336.9, "step", -4], [337.4, "step", -4], [337.9, "step", -4], [338.6, "pop", -6]],
  el: (k) => (
    <Escena Set={Ashland} pal={PAL} setProps={{ hora: "dia", centro: () => 2600, paradas: [], autos: 1 }} seed={5232} mano={2.5}
      claves={[mira(0, 2450, 800, 1.25), mira(k(337.0), 2600, 820, 1.5, { curva: "inout" }), mira(k(339.42), 2700, 830, 1.65, { curva: "inout" })]}
      medio={<>
        <g transform={`translate(${COLEGIO},${ASH_CARRIL - 80})`}>
          <rect x={-10} y={-430} width={20} height={430} fill="#3a3f46" />
          <rect x={-200} y={-520} width={400} height={130} rx={14} fill="#1a4fae" stroke="#f4efe4" strokeWidth={6} />
          <text x={0} y={-468} fontFamily={F_HUD} fontWeight={600} fontSize={50} fill="#f4efe4" textAnchor="middle">CITY COLLEGE</text>
          <text x={0} y={-416} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#cfe0ff" textAnchor="middle">CHICAGO · EST. 1934</text>
        </g>
        <Bus9 x={2150} y={ASH_CARRIL} hora="dia" puertas={1} kneel={1} dir={1} chofer gente={0.4} />
        <Persona look={LENA} seed={18} luz={RIM.sol} ruta={[{ f: 0, x: 2320, y: ASH_CARRIL - 80 }, { f: k(336.2), x: 2320, y: ASH_CARRIL - 80 }, { f: k(338.5), x: 2680, y: ASH_CARRIL - 80 }]}
          opacidad={(ff) => interpolate(ff, [k(335.8), k(336.2)], [0, 1], cl)} dir={[{ f: 0, v: 1 }, { f: k(338.5), v: -1 }]}
          poses={[{ f: 0, v: { hD: 60, cD: 80 } }, { f: k(338.6), v: { hD: 160, cD: 20 } }]} ajuste={(p, ff) => (ff > k(338.6) ? { ...p, hD: 150 + 25 * Math.sin(ff / 2.2) } : p)}
          caras={[{ f: 0, v: "miedo" }, { f: k(338.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(338.5), v: { x: -1, y: 0 } }]} enManoI={(ff) => FICHAS(ff, 0.3)} />
      </>}
      hud={<Rot t="dropped off on his break" a={k(335.3)} b={k(339.42) + 4} tam={54} mano pos="izq" top={180} />} />
  ),
};
const q23c: PlanB = {
  a: 339.42, b: 342.32, trans: { tipo: "corte" },
  sfx: [[339.45, "roll", -2, { dur: 0.8 }], [340.3, "ding", -2], [340.5, "paper", -2], [341.2, "paper", -4], [341.6, "sparkle", -4]],
  el: (k) => (
    <Escena Set={Ashland} pal={PAL} setProps={{ hora: "dia", centro: () => 2600, paradas: [], autos: 1 }} seed={5233} mano={2}
      claves={[mira(0, 2700, 840, 2.1), mira(k(342.32), 2700, 845, 2.4, { curva: "inout" })]}
      medio={<Persona look={LENA} seed={18} luz={RIM.sol} ruta={[{ f: 0, x: 2620, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: { hD: 60, cD: 80 } }, { f: k(340.44), v: { hD: 38, cD: 22, hI: 20, cI: 30 } }]}
        caras={[{ f: 0, v: "determinado" }, { f: k(340.44), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(340.5), v: { x: 1, y: 0.5 } }]}
        enManoD={(ff) => (ff > k(340.44) ? <g transform="scale(1.25)">{FICHAS(ff)}</g> : null)}
        cartel={reloj([{ f: 0, v: 0 }, { f: k(339.5), v: 6, d: 22 }], { tam: 48, rotulo: "LENA · TODAY" })} />}
      hud={<Rot t="paper flashcards" a={k(340.5)} b={k(342.32) + 4} tam={60} mano pos="der" top={180} />} />
  ),
};
const q23d: PlanB = {
  a: 342.32, b: 346.7, trans: { tipo: "cortina", lado: 1 },
  sfx: [[342.4, "write", -6, { dur: 1.8 }], [344.2, "step", -2], [344.7, "step", -2], [345.1, "fanfare", -10], [345.5, "sparkle", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Aula} pal={PAL} setProps={{ tiza: "CHEM 101 · FINAL" }} seed={524} mano={2.5}
          claves={[mira(0, 900, AULA_PISO - 230, 2.0), mira(k(344.6), 1080, AULA_PISO - 240, 1.8, { curva: "inout" }), mira(k(346.7), 1150, AULA_PISO - 240, 1.9)]}
          medio={<Persona look={LENA} seed={18} luz={RIM.cocina} ruta={[{ f: 0, x: 900, y: AULA_PISO }, { f: k(344.4), x: 900, y: AULA_PISO }, { f: k(345.4), x: 1200, y: AULA_PISO }]} correr={0.6}
            asiento={[{ f: 0, v: 62 }, { f: k(343.8), v: 62 }, { f: k(344.2), v: undefined }]}
            poses={[{ f: 0, v: { hD: 60, cD: 100, pI: 85, rI: -80, pD: 88, rD: -85, cabeza: 18 } }, { f: k(344.2), v: {} }, { f: k(345.1), v: { hD: 170, cD: 10, hI: 160, cI: 20 } }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(345.1), v: "risa" }]}
            enManoD={(ff) => ff > k(345.0) ? <g transform={`rotate(${Math.sin(ff / 2) * 20})`}><rect x={-30} y={-20} width={60} height={40} rx={4} fill="#fff7c8" stroke="#bdb6a8" strokeWidth={2} /></g> : null}
            enManoI={(ff) => ff > k(345.0) ? <g transform={`rotate(${Math.cos(ff / 2) * 20})`}><rect x={-30} y={-20} width={60} height={40} rx={4} fill="#f4efe4" stroke="#bdb6a8" strokeWidth={2} /></g> : null}
            cartel={reloj(6, { tam: 36, rotulo: "LENA" })} />}
          frente={<g transform={`translate(${900 + 70},${AULA_PISO})`}><rect x={-120} y={-108} width={240} height={18} rx={6} fill="#a8794e" /><rect x={-106} y={-90} width={14} height={90} fill="#6a4a30" /><rect x={92} y={-90} width={14} height={90} fill="#6a4a30" /><rect x={-60} y={-120} width={90} height={12} rx={2} fill="#f4efe4" /></g>}
          hud={<>
            <Rot t="an hour later…" a={k(342.4)} b={k(344.3)} tam={54} mano pos="izq" top={180} />
            <div style={{ position: "absolute", right: 140, top: 170, fontFamily: F_MANO, fontWeight: 700, fontSize: 120, color: VERDE, opacity: interpolate(f, [k(345.2), k(345.5)], [0, 1], cl), transform: "rotate(8deg)", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>A?</div>
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 24 · viernes 5:12: el número dice cero ======================
const q24: PlanB = {
  a: 346.7, b: 350.24, trans: { tipo: "luz", d: 14, color: "#fff3d0" },
  sfx: [[346.8, "tick", -2], [347.3, "cloth", -6], [347.8, "wood_hit", -8], [348.2, "swish", -8], [348.6, "ding", -2], [348.8, "sparkle", -4], [349.4, "birds", -14, { dur: 0.8 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={524} mano={2}
          claves={[mira(0, 470, 200, 2.6), mira(k(348.5), 500, 190, 2.95, { curva: "inout" }), mira(k(350.24), 505, 188, 3.05)]}
          medio={<>
            <CamaOwen f={f} celuEnCama={false} />
            <Acostado x={PIE_CAMA.x} y={PIE_CAMA.y} rot={90}>
              <Persona {...OWEN_ACOSTADO({
                poses: [{ f: 0, v: ACOST(8, 10) }, { f: k(347.3), v: ACOST(150, 30, 4, 6, 6) }, { f: k(347.8), v: ACOST(160, 10, 4, 6, 6) }, { f: k(348.4), v: ACOST(12, 60) }],
                caras: [{ f: 0, v: "cansado" }, { f: k(347.9), v: "duda" }, { f: k(348.6), v: "sorpresa" }, { f: k(349.4), v: "feliz" }],
                miradas: [{ f: 0, v: { x: 0.2, y: 0 } }, { f: k(347.4), v: { x: 1, y: 0.3 } }, { f: k(348.6), v: { x: 0, y: -1 } }],
              })} />
            </Acostado>
            <Frazada />
            <Reloj5 t="5:12" brillo={0.5 + 0.5 * Math.abs(Math.sin(f / 8))} />
            <CartelM x={490} y={100} claves={0} fmt={hm} icono="reloj" tam={30} f={f} desde={k(348.58)} />
            <Chispas x={490} y={100} f={f} desde={k(348.7)} r={70} />
          </>}
          hud={<Rot t="FRIDAY · 5:12 A.M." a={k(346.8)} b={k(348.5)} tam={58} pos="izq" top={180} color={VERDE} />} />
      );
    };
    return <Pl />;
  },
};
const q24b: PlanB = {
  a: 350.24, b: 354.14, trans: { tipo: "corte" },
  sfx: [[350.3, "whoosh", -6], [351.4, "whoosh", -8], [352.2, "cloth", -4], [352.5, "wind", -14, { dur: 1.4 }], [353.2, "sparkle", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false, luzDorm: false }} seed={5242} mano={2}
          claves={[mira(0, 505, 162, 3.0), mira(k(350.9), TF_PUNTOS.mesa, P - 230, 2.6, { curva: "inout" }), mira(k(351.6), TF_PUNTOS.mesa, P - 225, 2.7), mira(k(352.3), 480, 198, 2.6, { curva: "inout" }), mira(k(354.14), 485, 196, 2.75)]}
          medio={<>
            <g transform={`translate(${TF_PUNTOS.mesa + 20},${P - 214}) rotate(-8)`}><rect x={-40} y={-10} width={80} height={20} rx={6} fill="#15151a" /><rect x={-34} y={-6} width={68} height={12} rx={3} fill="#2a3440" /></g>
            <CamaOwen f={f} celuEnCama={false} />
            <Acostado x={PIE_CAMA.x} y={PIE_CAMA.y} rot={90}>
              <Persona {...OWEN_ACOSTADO({ poses: [{ f: 0, v: ACOST(12, 60) }, { f: k(352.3), v: ACOST(175, 6, 175, 6, 4) }],
                ajuste: (p, ff) => (ff > k(352.3) ? { ...p, hD: (p.hD ?? 0) + 6 * Math.sin(ff / 5), hI: (p.hI ?? 0) - 6 * Math.sin(ff / 5) } : p),
                caras: [{ f: 0, v: "feliz" }, { f: k(352.3), v: "risa" }], miradas: [{ f: 0, v: { x: 0, y: -1 } }] })} />
            </Acostado>
            <Frazada />
            <Reloj5 t="5:13" brillo={0.6} />
            <CartelM x={490} y={100} claves={0} fmt={hm} icono="reloj" tam={30} f={f} />
          </>}
          hud={<>
            <Rot t="the phone stayed downstairs" a={k(350.4)} b={k(352.1)} tam={56} mano pos="abajo" />
            <Rot t="lighter than in a month" a={k(352.3)} b={k(354.14) + 4} tam={62} mano pos="abajo" color="#ffe9a8" />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 25 · 7 llamadas perdidas de Dee ======================
const LLAM = [354.3, 354.6, 354.9, 355.2, 355.5, 355.8, 356.1];
const q25: PlanB = {
  a: 354.14, b: 357.9, trans: { tipo: "corte" },
  sfx: [[354.2, "step", -4], [354.7, "step", -4], [355.0, "cloth", -6], [355.3, "phone_buzz", -4], [355.96, "pop", -2], [356.3, "heart1", -4], [356.98, "ding", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const n = LLAM.filter((s) => f >= k(s)).length;
      const X0 = TF_PUNTOS.mesa - 60;
      return (
        <AbsoluteFill>
          <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: true }} seed={525} mano={2}
            claves={[mira(0, X0 + 260, P - 230, 2.2), mira(k(357.9), X0 + 250, P - 250, 2.5, { curva: "inout" })]}
            medio={<>
              <Persona look={OWEN_CASA} seed={47} luz={RIM.cocina} ruta={[{ f: 0, x: X0 - 260, y: P }, { f: k(354.9), x: X0, y: P }]} dir={[{ f: 0, v: 1 }]}
                poses={[{ f: 0, v: {} }, { f: k(354.9), v: { hD: 60, cD: 30 } }, { f: k(355.2), v: "celular" }]}
                caras={[{ f: 0, v: "feliz" }, { f: k(355.4), v: "duda" }, { f: k(356.2), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(355.2), v: { x: 0.3, y: 0.8 } }]}
                enManoD={(ff) => (ff >= k(355.2) ? <Celular s={0.9} brillo="#7ab8ff" /> : null)} />
              {f < k(355.2) && <g transform={`translate(${TF_PUNTOS.mesa + 20},${P - 214}) rotate(-8)`}><rect x={-40} y={-10} width={80} height={20} rx={6} fill="#15151a" /></g>}
            </>} />
          <CeluG f={f} desde={k(355.3)} x={1300} vib={k(355.3)} fondo="#1d2733">
            <div style={{ color: "#e9eef2", textAlign: "center", fontSize: 92, marginTop: 50 }}>5:14</div>
            <div style={{ margin: "30px 24px 0", borderRadius: 28, background: "rgba(240,244,248,0.95)", padding: "22px 24px" }}>
              <div style={{ fontSize: 50, fontWeight: 600, color: "#c23a2e" }}>{n} missed call{n === 1 ? "" : "s"}</div>
              {Array.from({ length: Math.min(n, 4) }).map((_, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 46, fontWeight: 600, marginTop: 12 }}><div style={{ width: 52, height: 52, borderRadius: 26, background: "#3fa39a", color: "#fff", fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>D</div>Dee · 4:0{i} AM</div>)}
              {n > 4 && <div style={{ fontSize: 44, fontWeight: 600, color: "#5a6470", marginTop: 10 }}>+{n - 4} more</div>}
            </div>
            {f >= k(356.98) && <div style={{ margin: "20px 24px 0", borderRadius: 28, background: "#2a6fd6", color: "#fff", padding: "18px 24px", fontSize: 46, fontWeight: 600 }}>1 new message · Dee</div>}
          </CeluG>
          <Rot t="Dee called at 4 a.m." a={k(354.3)} b={k(355.9)} tam={54} mano pos="izq" top={180} />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};
const MSG_DEE: [string, number][] = [["They called me. The clinic.", 357.9], ["Asked if I wanted to be a participant.", 359.54], ["I never gave them my number.", 361.34]];
const ChatG: React.FC<{ f: number; k: K; de: string; ini: string; color: string; msgs: [string, number][]; titulo?: string }> = ({ f, k, de, ini, color, msgs, titulo }) => (
  <>
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "34px 26px 22px", borderBottom: "2px solid #dde3e8", fontSize: 48, fontWeight: 600 }}>
      <div style={{ width: 70, height: 70, borderRadius: 35, background: color, color: "#fff", fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{ini}</div>
      <div>{de}{titulo && <div style={{ fontSize: 44, color: "#5a6470", fontWeight: 500 }}>{titulo}</div>}</div>
    </div>
    {msgs.map(([t, s], i) => {
      if (f < k(s)) return null;
      const n = Math.floor((f - k(s)) * 1.5);
      return <div key={i} style={{ margin: "18px 22px 0", maxWidth: 480, borderRadius: 30, borderTopLeftRadius: 8, background: "#e3e8ee", padding: "14px 22px", fontSize: 46, fontWeight: 600, lineHeight: 1.12, transform: `scale(${interpolate(f - k(s), [0, 5], [0.85, 1], cl)})`, transformOrigin: "left top" }}>{t.slice(0, n)}</div>;
    })}
  </>
);
const q25b: PlanB = {
  a: 357.9, b: 362.72, trans: { tipo: "corte" },
  sfx: [[357.95, "pop", -2], [358.0, "type", -10, { dur: 1.4 }], [359.54, "pop", -2], [359.6, "type", -10, { dur: 1.6 }], [361.34, "pop", -2], [361.4, "type", -10, { dur: 1.2 }], [362.1, "heart1", -2], [362.3, "glitch", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const X0 = TF_PUNTOS.mesa - 60;
      return (
        <AbsoluteFill>
          <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: true }} seed={5252} mano={2.5}
            claves={[mira(0, X0 + 170, P - 260, 2.8), mira(k(362.72), X0 + 160, P - 275, 3.2, { curva: "inout" })]}
            medio={<Persona look={OWEN_CASA} seed={47} luz={{ lado: 1, color: "#9fd0ff", fuerza: 0.9 }} ruta={[{ f: 0, x: X0, y: P }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: "celular" }, { f: k(361.6), v: { hD: 30, cD: 100, hI: 30, cI: 150, cabeza: 6 } }]}
              caras={[{ f: 0, v: "duda" }, { f: k(359.6), v: "miedo" }, { f: k(361.4), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: k(361.6), v: { x: 1, y: 0 } }]}
              enManoD={<Celular s={0.9} brillo="#7ab8ff" />} />} />
          <CeluG f={f} desde={-20} x={1300}><ChatG f={f} k={k} de="Dee" ini="D" color="#3fa39a" msgs={MSG_DEE} titulo="4:07 AM" /></CeluG>
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

// ====================== 26 · no puede desayunar… ni almorzar… un día y medio ======================
const q26: PlanB = {
  a: 362.72, b: 364.08, trans: { tipo: "corte" },
  sfx: [[362.8, "plates", -6, { dur: 0.6 }], [363.3, "wood_hit", -8], [363.6, "sad", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const empuja = interpolate(f, [k(363.1), k(363.5)], [0, 70], cl);
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: true }} seed={526} mano={2.5} claves={[mira(0, TF_PUNTOS.mesa + 60, 680, 2.4), mira(k(364.08), TF_PUNTOS.mesa + 50, 690, 2.6)]}
          medio={<>
            <g transform={`translate(${TF_PUNTOS.mesa - 40 - empuja},${P - 205})`}><ellipse rx={60} ry={14} fill="#f4f1e6" /><ellipse cx={-10} cy={-6} rx={22} ry={10} fill="#f2c94a" /><rect x={10} y={-14} width={34} height={12} rx={5} fill="#c9864a" /></g>
            <Persona look={OWEN_CASA} seed={47} luz={RIM.cocina} ruta={[{ f: 0, x: TF_PUNTOS.sillaOwen, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 60 }]}
              poses={[{ f: 0, v: { hD: 40, cD: 150, hI: 40, cI: 150, cabeza: 18, tronco: 14, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(363.1), v: { hD: 80, cD: 10, hI: 10, cI: 20, cabeza: 10, tronco: 6, pI: 85, rI: -80, pD: 88, rD: -85 } }]}
              caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: -0.4, y: 0.8 } }]} />
          </>}
          hud={<Rot t="he can't eat breakfast" a={k(362.8)} b={k(364.08) + 4} tam={58} mano pos="der" top={180} />} />
      );
    };
    return <Pl />;
  },
};
const q26b: PlanB = {
  a: 364.08, b: 365.28, trans: { tipo: "corte" },
  sfx: [[364.1, "whoosh", -4], [364.4, "bag", -4]],
  el: (k) => (
    <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "dia", avance: (ff: number) => 9000 + ff * 10 }} seed={527} mano={2}
      claves={[mira(0, 330, 640, 2.0), mira(k(365.28), 320, 630, 2.15)]}
      medio={<>
        <Persona {...owenVolante({ caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 1, y: 0.4 } }] })} /><Volante />
        <g transform={`translate(${BUS_PUNTOS.validador},${BP - 240 - 68}) scale(0.75)`}><path d="M-60,0 h120 l-12,90 h-96 Z" fill="#c9a36a" /><path d="M-60,0 l14,-24 h92 l14,24" fill="#b8925a" /><text y={60} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#5a3a24" textAnchor="middle">LUNCH</text></g>
      </>}
      hud={<Rot t="…or lunch" a={k(364.15)} b={k(365.28) + 4} tam={64} mano pos="der" top={180} />} />
  ),
};
const q26c: PlanB = {
  a: 365.28, b: 369.46, trans: { tipo: "corte" },
  sfx: [[365.3, "door", -8], [365.8, "step", -4], [366.4, "heart", -8, { dur: 3 }], [367.2, "cloth", -4], [367.8, "fail", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const nudo = interpolate(f, [k(367.0), k(368.6)], [0, 1], cl);
      return (
        <Escena Set={Descanso} pal={PAL} setProps={{ hora: "tarde" }} seed={5263} mano={2}
          claves={[mira(0, 1250, 640, 1.8), mira(k(369.46), 1250, 650, 2.1, { curva: "inout" })]}
          medio={<Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: 980, y: DES_PISO }, { f: k(366.4), x: 1120, y: DES_PISO }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: {} }, { f: k(366.4), v: { hD: 30, cD: 120, hI: 8, cI: 6, tronco: 8 } }, { f: k(367.6), v: { hD: 30, cD: 120, hI: 30, cI: 120, tronco: 14, cabeza: 10 } }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(367.0), v: "triste" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.6 } }]}
            cartel={{ claves: [{ f: 0, v: 30 }, { f: k(365.6), v: 36, d: 30 }], fmt: (v: number) => `${Math.round(v)} H · NO FOOD`, icono: "panza", tam: 40, color: "#ff8a5a" }} />}
          hud={<>
            <Rot t="end of his shift" a={k(365.4)} b={k(366.9)} tam={54} mano pos="izq" top={180} />
            <Vineta x={1180} y={540} w={600} desde={k(367.0)} hasta={k(369.46) + 2} rot={3} color="#ff8a5a">
              <svg width={1920} height={1080}><rect width={1920} height={1080} fill="#0f1e26" /><CuerpoAnat x={960} y={980} esc={2.2} flujo={0.4} f={f} nudo={nudo} />
                <text x={960} y={1010} fontFamily={F_HUD} fontWeight={600} fontSize={110} fill="#ff8a5a" textAnchor="middle">A KNOT</text></svg>
            </Vineta>
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 27 · el estrés y la panza ======================
const OWEN_PIZ = (x: number, extra: Partial<PersonaP>): PersonaP => ({ look: OWEN, seed: 47, luz: RIM.tubo, escala: 1.8, ruta: [{ f: 0, x, y: 1130 }], dir: [{ f: 0, v: -1 }], sombra: 0, ...extra });
const q27: PlanB = {
  a: 369.46, b: 371.54, trans: { tipo: "cortina", lado: 1 },
  sfx: [[369.5, "whoosh"], [369.9, "pop", -4], [370.4, "heart", -10, { dur: 1.1 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26" }} seed={527} mano={1.5} claves={[mira(0, 960, 560, 1.0), mira(k(371.54), 950, 560, 1.04)]}
          medio={<>
            <CuerpoAnat x={720} y={590} esc={0.72} flujo={0} f={f} nudo={0.6} />
            <Persona {...OWEN_PIZ(1520, { poses: [{ f: 0, v: { hD: 92, cD: 4, hI: 30, cI: 120 } }], caras: [{ f: 0, v: "determinado" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }], habla: [[k(369.6), k(371.4)]] })} />
          </>}
          hud={<Rot t="stress in your stomach" a={k(369.6)} b={k(371.54) + 4} tam={60} pos="der" top={170} color="#ffc94a" />} />
      );
    };
    return <Pl />;
  },
};
const Peligro: React.FC<{ f: number }> = ({ f }) => (
  <g transform={`translate(1240,300) scale(${1 + 0.06 * Math.max(0, Math.sin(f / 3))})`}><path d="M0,-110 L120,90 H-120 Z" fill="#ffc94a" stroke="#1d1f24" strokeWidth={10} strokeLinejoin="round" /><text y={70} fontFamily={F_HUD} fontWeight={600} fontSize={130} fill="#1d1f24" textAnchor="middle">!</text><text y={170} fontFamily={F_HUD} fontWeight={600} fontSize={56} fill="#ffc94a" textAnchor="middle">DANGER</text></g>
);
const q27b: PlanB = {
  a: 371.54, b: 376.42, trans: { tipo: "corte" },
  sfx: [[371.6, "boom", -8], [371.8, "heart", -6, { dur: 4.4 }], [372.6, "riser", -8, { dur: 2 }], [373.4, "swish", -4], [374.4, "swish", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const flujo = interpolate(f, [k(372.6), k(374.6)], [0, 1], cl);
      const d1 = interpolate(f, [k(373.4), k(373.9)], [0, 1], cl), d2 = interpolate(f, [k(374.4), k(374.9)], [0, 1], cl);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1e1418", luz: "#ff6a5a" }} seed={5272} mano={2} claves={[mira(0, 950, 560, 1.04), mira(k(376.42), 940, 560, 1.1, { curva: "inout" })]}
          medio={<>
            <CuerpoAnat x={720} y={590} esc={0.72} flujo={flujo} f={f} nudo={0.6} />
            <Peligro f={f} />
            {d1 > 0 && <g opacity={d1}><Flecha x1={1060} y1={600} x2={800} y2={560} u={d1} color="#9fd0ff" w={10} /><text x={1080} y={620} fontFamily={F_HUD} fontWeight={600} fontSize={64} fill="#9fd0ff">DIGESTION ↓</text></g>}
            {d2 > 0 && <g opacity={d2}><Flecha x1={1060} y1={820} x2={880} y2={790} u={d2} color="#ff6a5a" w={10} /><text x={1080} y={840} fontFamily={F_HUD} fontWeight={600} fontSize={64} fill="#ff6a5a">MUSCLES ↑</text></g>}
          </>}
          hud={<Rot t="your body thinks you're in danger" a={k(371.7)} b={k(373.3)} tam={52} pos="abajo" />} />
      );
    };
    return <Pl />;
  },
};
const q27c: PlanB = {
  a: 376.42, b: 379.9, trans: { tipo: "corte" },
  sfx: [[376.5, "slam", -4], [376.6, "fail", -6], [377.6, "pop", -4], [377.8, "plates", -8], [378.6, "sad", -12]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const off = interpolate(f, [k(376.5), k(376.75)], [0, 1], cl);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#141a22" }} seed={5273} mano={2} claves={[mira(0, 960, 560, 1.04), mira(k(379.9), 970, 560, 1.08)]}
          medio={<>
            <g transform="translate(700,505) scale(1.2)">
              <text y={-170} fontFamily={F_HUD} fontWeight={600} fontSize={90} fill="#f4efe4" textAnchor="middle">APPETITE</text>
              <rect x={-220} y={-90} width={440} height={180} rx={90} fill={off > 0.5 ? "#5a6470" : VERDE} />
              <circle cx={interpolate(off, [0, 1], [130, -130])} r={74} fill="#f4efe4" />
              <text x={off > 0.5 ? 60 : -60} y={24} fontFamily={F_HUD} fontWeight={600} fontSize={64} fill="#0f1e26" textAnchor="middle">{off > 0.5 ? "OFF" : "ON"}</text>
            </g>
            {(() => { const u = interpolate(f, [k(377.7), k(378.3)], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) }); return (
              <g transform={`translate(${1250 - 230 * u},${790 + 30 * u}) rotate(${-14 * u})`} opacity={1 - 0.55 * u}>
                <ellipse rx={120} ry={24} fill="#f4efe4" stroke="#bdb6a8" strokeWidth={4} />
                <path d="M-80,-14 q80,-70 160,0 Z" fill="#e0a95a" stroke="#8a5a2a" strokeWidth={4} />
                <path d="M-84,-14 h168 v-12 h-168 Z" fill="#6ab04a" />
                <path d="M-80,-26 q80,-60 160,0" fill="none" stroke="#c97a3a" strokeWidth={8} />
              </g>); })()}
            <Persona {...OWEN_PIZ(1450, { poses: [{ f: 0, v: { hD: 30, cD: 120, hI: 30, cI: 120 } }, { f: k(377.6), v: { hD: 80, cD: 8, hI: 30, cI: 120 } }, { f: k(378.4), v: { hD: 10, cD: 20, hI: 10, cI: 20 } }], caras: [{ f: 0, v: "sorpresa" }, { f: k(377.5), v: "triste" }], miradas: [{ f: 0, v: { x: -1, y: 0.2 } }, { f: k(377.7), v: { x: -1, y: 0.8 } }] })} />
          </>}
          hud={<svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}><GloboM x={1390} y={500} texto={"food\ncan wait."} desde={k(377.6)} hasta={k(379.9) + 4} tam={52} lado={-1} pensamiento /></svg>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 28 · 5:12 p.m., el mensaje ======================
const q28: PlanB = {
  a: 379.9, b: 382.12, trans: { tipo: "fundido", d: 8 },
  sfx: [[380.0, "phone_buzz", -2], [380.9, "phone_buzz", -2], [381.3, "cloth", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const vib = Math.sin(f * 2.4) * (f % 30 < 18 ? 5 : 0);
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "ocaso", avance: () => 12000 }} seed={528} mano={2} claves={[mira(0, 380, 640, 2.1), mira(k(382.12), 370, 640, 2.4, { curva: "inout" })]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "cansado" }, { f: k(380.4), v: "miedo" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }, { f: k(380.3), v: { x: 1, y: 0.6 } }] })} /><Volante />
            <g transform={`translate(${BUS_PUNTOS.validador + vib},${BP - 244}) rotate(-12)`}><Celular s={1.3} brillo="#7ab8ff" /></g>
            <Halo x={BUS_PUNTOS.validador} y={BP - 280} r={110} color="#7ab8ff" fuerza={0.5} />
          </>}
          hud={<Rot t="5:12 P.M." a={k(380.0)} b={k(382.12) + 4} tam={70} pos="der" top={170} color="#ff8a5a" />} />
      );
    };
    return <Pl />;
  },
};
const MSG_HALDEN: [string, number][] = [["Week 5 complete. Participant 47.", 384.46], ["We noticed you haven't been eating.", 386.94], ["We can help with that.", 388.3]];
const q28b: PlanB = {
  a: 382.12, b: 389.38, trans: { tipo: "corte" },
  sfx: [[382.2, "pop", -2], [384.5, "type", -10, { dur: 1.2 }], [385.7, "stamp", -6], [386.94, "type", -10, { dur: 1.2 }], [387.6, "heart", -6, { dur: 1.8 }], [388.3, "type", -10, { dur: 0.8 }], [389.0, "glitch", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <AbsoluteFill>
          <Escena Set={Descanso} pal={PAL} setProps={{ hora: "tarde" }} seed={5282} mano={2}
            claves={[mira(0, 1280, 600, 2.2), mira(k(389.38), 1270, 610, 2.55, { curva: "inout" })]}
            medio={<Persona look={OWEN} seed={47} luz={{ lado: 1, color: "#9fd0ff", fuerza: 0.9 }} ruta={[{ f: 0, x: 1080, y: DES_PISO }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: "celular" }, { f: k(387.0), v: { ...{ hD: 30, cD: 125, hI: 30, cI: 120 }, cabeza: 12 } }]}
              caras={[{ f: 0, v: "duda" }, { f: k(385.62), v: "sorpresa" }, { f: k(386.94), v: "miedo" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: k(387.6), v: { x: 1, y: 0 } }]}
              enManoD={<Celular s={0.9} brillo="#7ab8ff" />} />} />
          <CeluG f={f} desde={0} x={1300}><ChatG f={f} k={k} de="Halden Clinic" ini="H" color="#2a6fd6" titulo="Dr. Imani Hale" msgs={MSG_HALDEN} /></CeluG>
          <Rot t="the message" a={k(382.3)} b={k(384.3)} tam={56} mano pos="izq" top={180} />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};
const q28c: PlanB = {
  a: 389.38, b: 392.36, trans: { tipo: "corte" },
  sfx: [[389.4, "glitch", -2], [389.6, "boom", -4], [390.2, "heart1", -2], [391.4, "drone", -10, { dur: 1 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const u = interpolate(f, [k(389.6), k(390.4)], [0, 1], cl);
      const gl = Math.floor(f / 3) % 5 === 0 ? 8 : 0;
      return (
        <AbsoluteFill>
          <Escena Set={Descanso} pal={PAL} setProps={{ hora: "tarde" }} seed={5283} mano={2.5} claves={[mira(0, 1180, 610, 2.8), mira(k(392.36), 1170, 615, 3.2, { curva: "inout" })]}
            medio={<Persona look={OWEN} seed={47} luz={{ lado: 1, color: "#ff8a8a", fuerza: 0.9 }} ruta={[{ f: 0, x: 1080, y: DES_PISO }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: "manosCara" }]} caras={[{ f: 0, v: "miedo" }]} miradas={[{ f: 0, v: { x: -0.8, y: -0.8 } }]} />} />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <Flecha x1={820} y1={420} x2={590} y2={150} u={u} color="#ff4a3d" w={14} curva={-0.2} />
          </svg>
          <div style={{ position: "absolute", left: 1150, top: 380, fontFamily: F_HUD, fontWeight: 600, fontSize: 210, color: "#ff4a3d", textShadow: `${gl}px 0 0 #7ab8ff, 0 6px 20px rgba(0,0,0,0.6)`, opacity: u }}>42<span style={{ color: "#f4efe4", fontSize: 140 }}> / 47</span></div>
          <Rot t="the counter in the corner" a={k(389.5)} b={k(392.36) + 4} tam={54} mano pos="abajo" />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};

// ====================== 29 · gancho a ob06: la panza que digiere cualquier cosa ======================
const COSA = (i: number) => [
  <g><path d="M-50,-6 a50,40 0 0 1 100,0 Z" fill="#d89a4a" /><rect x={-54} y={-4} width={108} height={14} rx={6} fill="#5a3020" /><rect x={-52} y={10} width={104} height={8} fill="#7dbf4a" /><path d="M-50,18 h100 v10 a10,10 0 0 1 -10,10 h-80 a10,10 0 0 1 -10,-10 Z" fill="#d89a4a" /></g>,
  <g><path d="M-30,-30 h60 l14,24 -14,24 h-60 l-14,-24 Z" fill="#9aa4ac" stroke="#5a6470" strokeWidth={4} /><rect x={-10} y={18} width={20} height={60} fill="#9aa4ac" stroke="#5a6470" strokeWidth={4} /></g>,
  <g><path d="M0,-50 L46,40 Q0,56 -46,40 Z" fill="#f2c94a" stroke="#c98a2a" strokeWidth={5} /><circle cx={-8} cy={10} r={9} fill="#c23a2e" /><circle cx={14} cy={28} r={8} fill="#c23a2e" /></g>,
  <g><path d="M-20,-50 h36 v60 l30,14 a16,16 0 0 1 -10,30 l-56,-20 Z" fill="#ff8a5a" stroke="#c25a3a" strokeWidth={4} /><rect x={-20} y={-50} width={36} height={14} fill="#f4efe4" /></g>,
  <g><circle r={44} fill="#e2483a" /><rect x={-3} y={-60} width={6} height={20} fill="#5a3a24" /><ellipse cx={14} cy={-52} rx={14} ry={7} fill="#3fbf4a" /></g>,
  <g><rect x={-26} y={-50} width={52} height={100} rx={8} fill="#2a2a2e" /><rect x={-10} y={-60} width={20} height={12} fill="#9aa4ac" /><rect x={-26} y={-50} width={52} height={36} rx={8} fill="#ffc94a" /></g>,
][i];
const COSAS: number[] = [393.2, 393.7, 394.2, 394.7, 395.2, 395.7];
const q29: PlanB = {
  a: 392.36, b: 396.38, trans: { tipo: "fundido", d: 12 },
  sfx: [[392.4, "riser", -4, { dur: 3.6 }], [393.2, "swish", -4], [393.7, "metal", -6], [394.2, "swish", -4], [394.7, "swish", -4], [395.2, "swish", -4], [395.7, "metal", -6], [396.0, "boom", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const BX = 640, BY = 690;
      return (
        <AbsoluteFill>
          <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#141a22", luz: "#ffc94a" }} seed={529} mano={2} claves={[mira(0, 960, 560, 1.0), mira(k(396.38), 940, 570, 1.08, { curva: "inout" })]}
            medio={<>
              <Persona {...OWEN_PIZ(BX, { escala: 2.0, dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { hD: 30, cD: 120, hI: 30, cI: 120 } }], caras: [{ f: 0, v: "sorpresa" }, { f: k(394.2), v: "risa" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }],
                cartel: { claves: 0, icono: "panza", texto: "ANYTHING", tam: 44, color: "#ffc94a", desde: k(392.6) } })} />
              <Halo x={BX} y={BY} r={150 + 20 * Math.sin(f / 4)} color="#ffc94a" fuerza={0.6} />
            </>} />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{COSAS.map((s, i) => {
            const t = interpolate(f, [k(s), k(s) + 20], [0, 1], cl);
            if (t <= 0 || t >= 1) return null;
            const x0 = 1700, y0 = 260 + (i % 3) * 230;
            return <g key={i} transform={`translate(${x0 + (BX - x0) * t},${y0 + (BY - y0) * t - Math.sin(t * Math.PI) * 120}) rotate(${t * 540}) scale(${3.0 * (1 - 0.6 * t)})`}>{COSA(i)}</g>;
          })}</svg>
          <Rot t="NEXT WEEK" a={k(392.5)} b={k(396.38) + 4} tam={80} pos="der" top={170} color="#ffc94a" />
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};
const Bandeja: React.FC<{ x: number; y: number; tapa: number; f: number; tiembla?: number }> = ({ x, y, tapa, f, tiembla = 0 }) => (
  <g transform={`translate(${x + Math.sin(f * 2.2) * tiembla * 4},${y})`}>
    <ellipse rx={150} ry={26} fill="#c9ced2" stroke="#9aa4ac" strokeWidth={4} />
    {tapa > 0 && <Halo x={0} y={-40} r={140 * tapa} color="#7dff6a" fuerza={0.7 * tapa} />}
    <g transform={`translate(${tapa * 40},${-tapa * 120}) rotate(${tapa * 18})`}>
      <path d="M-120,-4 a120,104 0 0 1 240,0 Z" fill="#e9eef2" stroke="#9aa4ac" strokeWidth={5} />
      <circle cy={-112} r={14} fill="#9aa4ac" /><LogoHalden x={0} y={-50} s={0.6} />
    </g>
  </g>
);
const q29b: PlanB = {
  a: 396.38, b: 399.44, trans: { tipo: "corte" },
  sfx: [[396.4, "heart", -8, { dur: 3 }], [397.4, "metal", -4], [397.6, "sparkle", -2], [398.4, "riser", -10, { dur: 1 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const tapa = interpolate(f, [k(397.4), k(398.0)], [0, 0.35], cl);
      const M = HAL_PUNTOS.mesa;
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde" }} seed={5292} mano={2}
          claves={[mira(0, M - 40, HAL_PISO - 300, 2.3), mira(k(399.44), M - 20, HAL_PISO - 300, 2.6, { curva: "inout" })]}
          medio={<>
            <g transform={`translate(${M + 60},${HAL_PISO - 230})`}><rect x={-200} y={0} width={400} height={20} rx={6} fill="#c9ced2" /><rect x={-180} y={20} width={14} height={210} fill="#9aa4ac" /><rect x={166} y={20} width={14} height={210} fill="#9aa4ac" /></g>
            <Bandeja x={M + 60} y={HAL_PISO - 256} tapa={tapa} f={f} />
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: M - 260, y: HAL_PISO }, { f: k(397.0), x: M - 170, y: HAL_PISO }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 30, cD: 120, hI: 8, cI: 6 } }]} caras={[{ f: 0, v: "duda" }, { f: k(397.6), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.6 } }]} />
          </>}
          hud={<Rot t="from inside the clinic" a={k(396.5)} b={k(399.44) + 4} tam={56} mano pos="izq" top={180} />} />
      );
    };
    return <Pl />;
  },
};
const q29c: PlanB = {
  a: 399.44, b: 402.18, trans: { tipo: "corte" },
  sfx: [[399.5, "pop", 0], [400.0, "type", -8, { dur: 1.4 }], [401.6, "ding", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0e1a20", luz: "#ffc94a" }} seed={5293} mano={2} claves={[mira(0, 960, 560, 1.03), mira(k(402.18), 970, 560, 1.07)]}
          medio={<>
            <Persona {...OWEN_CTA(520, { poses: [{ f: 0, v: "celular" }, { f: k(400.4), v: { hD: 92, cD: 4, hI: 10, cI: 20 } }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }], habla: [[k(399.5), k(402.1)]], enManoD: (ff) => (ff < k(400.4) ? <Celular s={1} brillo="#7ab8ff" /> : null) })} />
            <Comentario f={f} desde={k(399.9)} texto="today: 4h 12m" />
          </>}
          hud={<Rot t="WHAT'S YOUR SCREEN TIME TODAY?" a={k(399.5)} b={k(402.18) + 4} tam={56} pos="der" top={170} color={VERDE} />} />
      );
    };
    return <Pl />;
  },
};
const q29d: PlanB = {
  a: 402.18, b: 405.8, trans: { tipo: "corte" },
  sfx: [[402.2, "pop", 0], [403.0, "ding", -4], [404.0, "whoosh", -4], [404.3, "metal", -6], [404.9, "metal", -6], [405.2, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#200e10", luz: "#e0262b" }} seed={5294} mano={2} claves={[mira(0, 960, 560, 1.03), mira(k(405.8), 965, 560, 1.07)]}
          medio={<Persona {...OWEN_CTA(380, { poses: [{ f: 0, v: { hD: 60, cD: 20, hI: 10, cI: 20 } }, { f: k(402.7), v: { hD: 88, cD: 0, hI: 10, cI: 20 } }, { f: k(404.0), v: "manosCintura" }], caras: [{ f: 0, v: "feliz" }, { f: k(403.0), v: "risa" }, { f: k(404.2), v: "picaro" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }], habla: [[k(402.2), k(405.7)]] })} />}
          hud={<>
            <BotonSub desde={k(402.2)} f={f} top={560} />
            <Vineta x={1180} y={150} w={620} desde={k(404.0)} hasta={k(405.8) + 4} rot={3} color="#7dff6a">
              <svg width={1920} height={1080}><rect width={1920} height={1080} fill="#e9eef2" /><rect y={760} width={1920} height={320} fill="#c9ced2" /><g transform="translate(960,760) scale(3.4)"><Bandeja x={0} y={0} tapa={0.12 + 0.08 * Math.abs(Math.sin(f / 2))} f={f} tiembla={1} /></g></svg>
            </Vineta>
            <Rot t="…something he really shouldn't" a={k(404.0)} b={k(405.8) + 4} tam={54} mano pos="abajo" />
          </>} />
      );
    };
    return <Pl />;
  },
};

export const PLANOS_OB05: PlanB[] = [q01, q02, q02b, q03, q03b, q04, q04b, q05, q06, q06b, q06c, q07, q07b, q07c, q07d, q07e, q08, q09, q09b, q09c, q09d, q10, q10b, q11, q11b, q11c, q11d, q12, q13, q13b, q13c, q13d, q14, q14b, q14c, q14d, q14e, q14f, q14g, q15, q15b, q16, q16b, q16c, q16d, q16e, q16f, q17, q17b, q17c, q17d, q17e, q18, q18b, q18c, q18d, q19, q19b, q19c, q19d, q19e, q19f, q20, q20b, q20c, q20d, q20e, q21, q21b, q21c, q21d, q22, q22b, q22c, q22d, q22e, q22f, q22g, q22h, q23, q23b, q23c, q23d, q24, q24b, q25, q25b, q26, q26b, q26c, q27, q27b, q27c, q28, q28b, q28c, q29, q29b, q29c, q29d];
export const OB05 = armar(PLANOS_OB05);

// reloj del día (minutos desde medianoche); null = sin reloj (pizarras / celulares)
const HORAS: [number, number | null][] = [[0, 8 * 60 + 20], [6.26, null], [11.34, 5 * 60 + 12], [28.78, 2 * 60 + 47], [33.48, null], [38.22, 5 * 60 + 40], [51.4, 6 * 60 + 18], [76, null], [111.56, 8 * 60 + 52], [129.3, 9 * 60], [133.74, null], [151.36, 10 * 60 + 58], [164.9, null], [167.68, 11 * 60 + 1], [182.68, 5 * 60 + 2], [193.32, 10 * 60 + 4], [209.3, null], [244.36, 22 * 60 + 40], [255.36, null], [260.82, 22 * 60 + 41], [268.22, null], [287.48, 23 * 60 + 5], [291.34, null], [303.94, 23 * 60 + 15], [307.18, null], [325.44, 23 * 60 + 40], [332.72, 12 * 60 + 30], [342.32, 13 * 60 + 30], [346.7, 5 * 60 + 12], [354.14, 5 * 60 + 14], [362.72, 6 * 60 + 5], [364.08, 12 * 60 + 30], [365.28, 17 * 60 + 2], [369.46, null], [379.9, 17 * 60 + 12], [392.36, null]];
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
