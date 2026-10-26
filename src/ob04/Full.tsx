// ob04 · «What If You Could See Everyone's Price Tag?» (Owen Upgraded, sesión B). Plan: D:/rtmp/ob04_PLAN_MxM.md
// Cada plano va de un segundo de la voz al siguiente; adentro, k(seg) = cuadro local de ese segundo de la voz.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Escena } from "../anikit/escena";
import { Montaje } from "../anikit/montaje";
import { Lab, LAB_PISO } from "../anikit/sets/lab";
import { Aula, AULA_PISO } from "../anikit/sets/aula";
import { Celular, Taza } from "../anikit/props";
import { F_HUD, F_MANO } from "../anikit/pantalla";
import { Halo } from "../anikit/luz";
import { PAL, OWEN, OWEN_CASA, ROSA, DEE, ABERNATHY, LENA, ABRIGO, TEEN, SENORA, OBRERO, ESTUDIANTE, SCRUBS, RUNNER, FUMADOR, OFICINISTA, NENE, RIM, VERDE } from "../owen/elenco";
import { DELPHINE, TRAJE, pasajero } from "../owen/extras_b";
import { HudSerie, usd, CartelM } from "../owen/cartel";
import { Persona, PersonaP } from "../owen/b/gente";
import { armar, PlanB, K, sentadoBus, parado, POSE_CELU_SENTADO, Pizarra, GloboM, Vineta, TarjetaSemana, CeluMensaje, Factura, Tostadora, Personitas, NumeroM, FuenteB } from "../owen/b/lib";
import { BusInterior, Bus9, BUS_PISO, BUS_PUNTOS, ASIENTO_X, alVolante, Volante, marchaParadas, kneelEn } from "../owen/mundo/bus";
import { Ashland, ASH_PISO, ASH_CARRIL } from "../owen/mundo/ashland";
import { TwoFlatCorte, TF_PISO, TF_ARRIBA, TF_PUNTOS } from "../owen/mundo/twoflat";
import { Halden, HAL_PISO, HAL_PUNTOS, Formulario } from "../owen/mundo/halden";
import { Garaje, GAR_PISO, GAR_PUNTOS } from "../owen/mundo/garaje";
import { Plasma, PLA_PISO, PLA_PUNTOS, Aferesis } from "../owen/mundo/plasma";

const A = TF_ARRIBA, P = TF_PISO, BP = BUS_PISO;
const ch = BUS_PUNTOS.chofer;
// Owen al volante (se repite en todos los planos del bus)
const owenVolante = (extra: Partial<PersonaP> = {}): PersonaP => ({
  look: OWEN, ruta: [{ f: 0, x: ch, y: BP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: BUS_PUNTOS.asiento }], poses: [{ f: 0, v: "sentado" }],
  ajuste: alVolante(ch, 1), luz: RIM.tubo, seed: 47, ...extra,
});
const tag = (v: number | { f: number; v: number; d?: number }[], extra: Record<string, unknown> = {}) => ({ claves: v, ...extra });

// ====================== 1 · recap: tres noches sin dormir y la factura en el delantal ======================
const p01: PlanB = {
  a: 0, b: 6.6,
  sfx: [[0.2, "tick", -4], [1.2, "tick", -4], [2.2, "tick", -4], [3.0, "cloth"], [3.6, "paper", 2], [5.2, "boom", -6]],
  el: (k) => (
    <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "noche", luzCocina: false, luzBaño: false }} seed={1} mano={3}
      claves={[mira(0, 520, 640, 1.3), mira(k(3.0), 540, 700, 1.9, { curva: "inout" }), mira(k(6.6), 560, 720, 2.5, { curva: "in" })]}
      medio={<>
        {/* el delantal de Rosa colgado del gancho, al lado de la heladera */}
        <g transform={`translate(${TF_PUNTOS.heladera - 190},${P - 520})`}><circle r={8} fill="#8a6a4a" /><path d="M-40,10 h80 l20,190 h-120 Z" fill="#efe4cf" /><rect x={-26} y={110} width={52} height={40} rx={4} fill="#e2d4b8" /></g>
        <Persona look={OWEN_CASA} seed={47} luz={RIM.noche}
          ruta={[{ f: 0, x: 420, y: P }, { f: k(2.6), x: TF_PUNTOS.heladera - 280, y: P }]}
          poses={[{ f: 0, v: {} }, { f: k(2.8), v: { hD: 70, cD: 40 } }, { f: k(3.6), v: { hD: 40, cD: 110, cabeza: 10 } }]}
          caras={[{ f: 0, v: "cansado" }, { f: k(4.0), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(3.6), v: { x: 0.5, y: 0.6 } }]}
          enManoD={(f) => f > k(3.4) ? <Factura x={0} y={0} s={0.2} rot={-10} /> : null} />
      </>}
      hud={<>
        <div style={{ position: "absolute", right: 90, bottom: 120, fontFamily: F_MANO, fontSize: 64, color: "#f4efe4", opacity: interpolate(useF(), [0, 10, k(2.6), k(3)], [0, 1, 1, 0], { extrapolateRight: "clamp" }), transform: "rotate(-3deg)" }}>3 nights. 0 sleep.</div>
      </>}
    />
  ),
};
// la factura en primer plano (recap) — inserto dentro del plano 1 con un empuje a la cifra
const p01b: PlanB = {
  a: 6.6, b: 9.58, trans: { tipo: "barrido", d: 10 },
  sfx: [[6.62, "whoosh"], [7.3, "pop"], [7.6, "pop"], [7.9, "pop"], [8.2, "pop"], [8.5, "pop"], [8.8, "pop"]],
  el: (k) => {
    const gente: PersonaP[] = [
      parado(SENORA, 700, ASH_PISO, { cartel: tag(310000), dir: [{ f: 0, v: -1 }] }),
      parado(OBRERO, 900, ASH_PISO, { cartel: tag(180000), dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "brazosCruzados" }] }),
      parado(ESTUDIANTE, 1100, ASH_PISO, { cartel: tag(52000), poses: [{ f: 0, v: "celular" }] }),
      parado(SCRUBS, 1300, ASH_PISO, { cartel: tag(1400000) }),
      parado(OFICINISTA, 1480, ASH_PISO, { cartel: tag(23000), dir: [{ f: 0, v: -1 }] }),
      parado(RUNNER, 1680, ASH_PISO, { cartel: tag(96000) }),
    ];
    return (
      <Escena Set={Ashland} pal={PAL} setProps={{ hora: "alba", centro: () => 1200, paradas: [{ x: 1000, num: 12, refugio: true }] }} seed={2} mano={3}
        claves={[mira(0, 1200, 640, 1.0), mira(k(9.58), 1220, 600, 1.12)]}
        medio={<>{gente.map((g, i) => <Persona key={i} {...g} cartel={{ ...(g.cartel as any), desde: k(7.2 + i * 0.3) }} />)}</>} />
    );
  },
};

// ====================== 3 · 5:12, el espejo: batería → cerebro → etiqueta ======================
const Reflejo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <g>
    <defs><clipPath id="ob4espejo"><rect x={TF_PUNTOS.espejo - 74} y={A - 404} width={148} height={168} rx={8} /></clipPath></defs>
    <g clipPath="url(#ob4espejo)"><rect x={TF_PUNTOS.espejo - 80} y={A - 410} width={160} height={180} fill="#9fbfca" />{children}<path d={`M${TF_PUNTOS.espejo - 60},${A - 404} l40,0 l-70,170 l-40,0 Z`} fill="#fff" opacity={0.18} /></g>
  </g>
);
const owenEspejo = (k: K, carteles: any[], cara: { f: number; v: string }[] = [{ f: 0, v: "cansado" }]): PersonaP => ({
  look: { ...OWEN_CASA, frontal: true }, ruta: [{ f: 0, x: TF_PUNTOS.espejo, y: A - 150 }], escala: 0.62, seed: 47, luz: { lado: -1, color: "#fff2d8", fuerza: 0.6 },
  caras: cara, carteles, poses: [{ f: 0, v: { hD: 30, cD: 140 } }],
});
const p03: PlanB = {
  a: 9.58, b: 19.48, trans: { tipo: "fundido", d: 12 },
  sfx: [[9.7, "tick", 0], [10.4, "water", -6, { dur: 2.5 }], [11.9, "brush", -4, { dur: 3.5 }], [15.0, "glitch", -4], [16.12, "whoosh"], [17.18, "whoosh"], [18.22, "slam", -2]],
  el: (k) => {
    const ic = (f: number) => (f < k(16.12) ? "bateria" : f < k(17.18) ? "cerebro" : "dolar");
    const Pl: React.FC = () => {
      const f = useF();
      const i = ic(f);
      const tx = i === "bateria" ? "100%" : i === "cerebro" ? "IQ ??" : "";
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false }} seed={3} mano={2.5}
          claves={[mira(0, 900, 300, 0.9), mira(k(11.8), 1040, 120, 2.0, { curva: "inout" }), mira(k(15.6), 1100, 70, 3.1, { curva: "inout" }), mira(k(19.48), 1105, 60, 3.4)]}
          medio={<>
            <Reflejo>
              <Persona {...owenEspejo(k, [{ claves: 0, texto: tx || undefined, icono: i, tam: 30, desde: k(14.6), fmt: () => "" }], [{ f: 0, v: "cansado" }, { f: k(15.2), v: "sorpresa" }, { f: k(18.3), v: "duda" }])} />
            </Reflejo>
            <Persona look={OWEN_CASA} seed={47} luz={RIM.alba} ruta={[{ f: 0, x: 1180, y: A }, { f: k(11.6), x: 980, y: A }]} dir={[{ f: 0, v: -1 }, { f: k(11.6), v: 1 }]}
              poses={[{ f: 0, v: {} }, { f: k(11.8), v: { hD: 60, cD: 150 } }, { f: k(12.4), v: { hD: 66, cD: 140 } }, { f: k(12.8), v: { hD: 58, cD: 150 } }, { f: k(13.2), v: { hD: 66, cD: 140 } }, { f: k(13.6), v: { hD: 58, cD: 150 } }, { f: k(15.2), v: { hD: 20, cD: 60 } }]}
              caras={[{ f: 0, v: "cansado" }, { f: k(15.2), v: "sorpresa" }]} />
          </>}
        />
      );
    };
    return <Pl />;
  },
};
// $4,700 rueda en el espejo + inserto del formulario de la clínica
const p04: PlanB = {
  a: 19.48, b: 28.02, trans: { tipo: "corte" },
  sfx: [[19.5, "roll", 0], [22.4, "ding", -4], [24.74, "whoosh"], [25.3, "paper", 0], [26.4, "write", -4, { dur: 1.2 }]],
  el: (k) => (
    <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false }} seed={4} mano={2}
      claves={[mira(0, 1110, 40, 3.6), mira(k(24.6), 1110, 20, 4.2, { curva: "inout" }), mira(k(28.02), 1110, 30, 4.0)]}
      medio={<Reflejo><Persona {...owenEspejo(k, [{ claves: [{ f: 0, v: 0 }, { f: k(19.8), v: 4700, d: 60 }], tam: 30 }], [{ f: 0, v: "sorpresa" }, { f: k(23.4), v: "determinado" }])} /></Reflejo>}
      hud={<Vineta x={1130} y={500} w={700} desde={k(24.74)} hasta={k(28.02) + 2} rot={2}>
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "manana" }} seed={41} mano={1.5} claves={[mira(0, HAL_PUNTOS.mesa, HAL_PISO - 260, 2.6), mira(k(28), HAL_PUNTOS.mesa, HAL_PISO - 250, 2.9)]}
          medio={<Formulario x={HAL_PUNTOS.mesa} y={HAL_PISO - 260} s={1.0} firma={interpolate(useF(), [k(26.2), k(27.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />} />
      </Vineta>}
    />
  ),
};
// tarjeta de la semana
const p05: PlanB = {
  a: 28.02, b: 31.52, trans: { tipo: "luz", d: 10, color: "#d8fff2" },
  sfx: [[28.05, "slam", -2], [28.84, "slam", -4], [30.26, "slam", -2], [30.6, "heart1", -6]],
  el: (k) => (
    <AbsoluteFill style={{ background: "#0e1a20" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(67,224,180,0.18), rgba(0,0,0,0) 60%)" }} />
      <TarjetaSemana hasta={k(31.52)} lineas={[{ t: "WEEK 4", desde: 0, tam: 150 }, { t: "PARTICIPANT 47", desde: k(28.84), tam: 74, color: VERDE }, { t: "44 STILL IN", desde: k(30.26), tam: 74, color: "#ff8a5a" }]} />
    </AbsoluteFill>
  ),
};

// ====================== 6 · Rosa con la bata y el café: $1,960,000; la tostada se quema ======================
const p06: PlanB = {
  a: 31.52, b: 42.44, trans: { tipo: "cortina", lado: -1 },
  sfx: [[31.6, "step", 0], [32.2, "step", 0], [32.9, "pour", -4, { dur: 2 }], [34.3, "roll", 0], [37.6, "ding", -6], [38.5, "gasp", -4], [40.2, "toaster", 0], [40.9, "fire", -10, { dur: 1.6 }], [41.6, "pop", 0]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const humo = interpolate(f, [k(38.5), k(40.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const salto = interpolate(f, [k(41.4), k(41.6), k(41.9)], [0, 1, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba" }} seed={6} mano={3}
          claves={[mira(0, 560, 720, 1.4), mira(k(34.2), 420, 700, 1.7, { curva: "inout" }), mira(k(38.0), 380, 660, 1.9, { curva: "inout" }), mira(k(40.2), 600, 740, 1.9, { curva: "inout" }), mira(k(42.44), 640, 740, 2.0)]}
          medio={<>
            <Tostadora x={TF_PUNTOS.mesa + 60} y={P - 200} humo={humo} salto={salto} f={f} quemada={humo} />
            <Persona look={{ ...ROSA, accesorios: [...(ROSA.accesorios ?? []).filter((a: any) => a.t !== "delantal")], camisa: "#c9667a" }} seed={12} luz={RIM.cocina}
              ruta={[{ f: 0, x: 140, y: P }, { f: k(32.6), x: TF_PUNTOS.cocina + 40, y: P }, { f: k(37.0), x: TF_PUNTOS.cocina + 40, y: P }, { f: k(39.0), x: 380, y: P }]}
              poses={[{ f: 0, v: {} }, { f: k(32.8), v: { hD: 70, cD: 60 } }, { f: k(34.6), v: { hD: 40, cD: 120, cabeza: -4 } }, { f: k(37), v: { hD: 40, cD: 120 } }]}
              caras={[{ f: 0, v: "feliz" }]} enManoD={(ff) => ff > k(33.4) ? <Taza x={0} y={0} vapor={1} f={ff} /> : null}
              cartel={{ claves: [{ f: 0, v: 0 }, { f: k(34.3), v: 1960000, d: 80 }], fmt: (v: number) => "$" + Math.round(v).toLocaleString("en-US"), tam: 44, rotulo: "ROSA", desde: k(34.2) }} />
            <Persona look={OWEN_CASA} seed={47} luz={RIM.cocina} ruta={[{ f: 0, x: TF_PUNTOS.sillaOwen + 40, y: P }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: {} }, { f: k(38.4), v: { hD: 10, cD: 20, cabeza: -10, tronco: -4 } }, { f: k(41.6), v: "manosCara" }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(35.4), v: "sorpresa" }, { f: k(41.6), v: "miedo" }]} miradas={[{ f: 0, v: { x: -1, y: -0.2 } }, { f: k(35.4), v: { x: -0.8, y: -0.8 } }, { f: k(41.6), v: { x: -0.2, y: 0.4 } }]}
              cartel={{ claves: 4700, tam: 30 }} />
          </>}
        />
      );
    };
    return <Pl />;
  },
};

// ====================== 7-9 · el bus: las reglas ======================
const pasajerosBus = (k: K, extra: Record<number, Partial<PersonaP>> = {}) => {
  const base: [number, any, number][] = [[1, SCRUBS, 210000], [3, OBRERO, 160000], [5, ESTUDIANTE, 38000], [7, SENORA, 520000], [8, FUMADOR, 21000], [9, RUNNER, 74000]];
  return base.map(([fila, look, v], i) => sentadoBus(look, ASIENTO_X(fila), { cartel: { claves: v, tam: 30, desde: k(42.6) + i * 4 }, ...(extra[fila] ?? {}) }));
};
const p07: PlanB = {
  a: 42.44, b: 52.76, trans: { tipo: "barrido", d: 10 },
  sfx: [[42.5, "bus_engine", -10, { dur: 10 }], [42.7, "pop", -2], [42.84, "pop", -2], [42.97, "pop", -2], [43.1, "pop", -2], [46.3, "bus_brake", -6], [47.0, "bus_door", -2], [47.6, "step", 0], [48.1, "step", 0], [48.6, "step", 0], [50.6, "roll", -2], [51.4, "fail", -8]],
  el: (k) => {
    const av = marchaParadas([[k(46.4), k(50.0)]], 14);
    const pf = (f: number) => interpolate(f, [k(46.8), k(47.2), k(49.6), k(50)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: av, puertaF: pf }} seed={7} mano={2.5}
        claves={[mira(0, 1500, 600, 0.72), mira(k(46.0), 900, 640, 1.1, { curva: "inout" }), mira(k(48.4), 760, 660, 1.6, { curva: "inout" }), mira(k(52.76), 800, 640, 1.7)]}
        medio={<>
          <Persona {...owenVolante({ caras: [{ f: 0, v: "duda" }, { f: k(50.6), v: "picaro" }], cartel: { claves: 4700, tam: 28 } })} />
          <Volante />
          {pasajerosBus(k).map((p, i) => <Persona key={i} {...p} />)}
          {/* el del traje sube en la 12 hablando por teléfono de su barco */}
          <Persona look={TRAJE} seed={21} luz={RIM.tubo} ruta={[{ f: 0, x: 700, y: BP + 0 }, { f: k(47.2), x: 700, y: BP }, { f: k(47.2) + 1, x: 520, y: BP }, { f: k(48.8), x: BUS_PUNTOS.validador + 40, y: BP }, { f: k(50.0), x: BUS_PUNTOS.validador + 40, y: BP }, { f: k(52.6), x: 980, y: BP }]}
            opacidad={(f) => (f < k(47.2) ? 0 : 1)} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: "celular" }, { f: k(48.8), v: { hD: 80, cD: 120, cabeza: -6 } }, { f: k(49.4), v: "celular" }]} caras={[{ f: 0, v: "risa" }, { f: k(51.2), v: "picaro" }]} habla={[[k(47.4), k(50.4)]]}
            cartel={{ claves: 11000, tam: 34, desde: k(50.56) }} />
          <GloboM x={700} y={BP - 330} texto={"…the boat's\n42 feet, Mike."} desde={k(47.6)} hasta={k(50.4)} tam={26} lado={1} />
        </>}
      />
    );
  },
};
const p09: PlanB = {
  a: 52.76, b: 58.66, trans: { tipo: "corte" },
  sfx: [[53.4, "step", -2], [54.4, "cloth"], [55.6, "roll", 0], [56.3, "ding", -2], [57.2, "sparkle", -6]],
  el: (k) => {
    const x5 = ASIENTO_X(5);
    return (
      <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: (f: number) => f * 14 }} seed={9} mano={2.5}
        claves={[mira(0, x5 - 60, 620, 1.7), mira(k(55.0), x5, 580, 2.1, { curva: "inout" }), mira(k(58.66), x5 + 20, 560, 2.3)]}
        medio={<>
          {/* la embarazada se para en el pasillo con la mano en la panza */}
          <Persona look={{ ...SCRUBS, camisa: "#e9a3c8", pantalon: "#5a4a6a", accesorios: [{ t: "pelo", forma: "cola", color: "#3a2016" }] }} seed={31} luz={RIM.tubo}
            ruta={[{ f: 0, x: x5 + 160, y: BP }, { f: k(55.6), x: x5 + 160, y: BP }, { f: k(56.6), x: x5 + 10, y: BP }]} dir={[{ f: 0, v: -1 }]}
            asiento={[{ f: 0, v: undefined }, { f: k(56.6), v: undefined }, { f: k(57.0), v: BUS_PUNTOS.asiento }]}
            poses={[{ f: 0, v: { hI: 40, cI: 90, hD: 150, cD: 10 } }, { f: k(56.6), v: { hI: 40, cI: 90 } }, { f: k(57.0), v: "sentado" }]} caras={[{ f: 0, v: "cansado" }, { f: k(55.6), v: "feliz" }]} />
          <ellipse cx={x5 + 160 - 8} cy={BP - 170} rx={26} ry={34} fill="#e9a3c8" opacity={interpolate(useCurrentFrame(), [0, 1], [1, 1])} style={{ display: "none" }} />
          <Persona look={TEEN} seed={33} luz={RIM.tubo}
            ruta={[{ f: 0, x: x5, y: BP }, { f: k(54.6), x: x5, y: BP }, { f: k(55.4), x: x5 + 220, y: BP }]} dir={[{ f: 0, v: -1 }, { f: k(54.4), v: 1 }]}
            asiento={[{ f: 0, v: BUS_PUNTOS.asiento }, { f: k(54.2), v: BUS_PUNTOS.asiento }, { f: k(54.7), v: undefined }]}
            poses={[{ f: 0, v: POSE_CELU_SENTADO }, { f: k(54.0), v: "sentado" }, { f: k(54.7), v: "agarrarAlto" }]} caras={[{ f: 0, v: "neutral" }, { f: k(54.0), v: "feliz" }]}
            cartel={{ claves: [{ f: 0, v: 40000 }, { f: k(55.7), v: 41000, d: 30 }], tam: 34 }} />
        </>}
        hud={<div style={{ position: "absolute", left: 1210, top: 250, fontFamily: F_HUD, fontWeight: 600, fontSize: 56, color: VERDE, opacity: interpolate(useF(), [k(56), k(56.3), k(58.2), k(58.6)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateY(${-interpolate(useF(), [k(56), k(58.6)], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`, textShadow: "0 0 20px rgba(125,255,106,0.6)" }}>+$1,000</div>}
      />
    );
  },
};
// el cartel se abre: lo que costaría reemplazar todo lo que hacés por los demás
const ICONOS_REEMPLAZO = [
  { t: "CARE", c: "#ff8a9a", d: "M0,10 C-26,-8 -20,-30 -6,-26 C0,-24 0,-18 0,-16 C0,-18 0,-24 6,-26 C20,-30 26,-8 0,10 Z" },
  { t: "COOK", c: "#ffc94a", d: "M-24,-6 h48 v18 a10,10 0 0 1 -10,10 h-28 a10,10 0 0 1 -10,-10 Z M-30,-6 h60 M-8,-22 q4,-8 0,-14 M8,-22 q4,-8 0,-14" },
  { t: "DRIVE", c: "#7ab8ff", d: "M-26,0 a26,26 0 1 0 52,0 a26,26 0 1 0 -52,0 M-6,0 a6,6 0 1 0 12,0 a6,6 0 1 0 -12,0 M-26,0 h20 M6,0 h20 M0,6 v20" },
  { t: "TEACH", c: "#b88aff", d: "M-28,-20 h56 v34 h-56 Z M-18,-8 h30 M-18,2 h20 M0,14 v12" },
  { t: "LISTEN", c: "#7dff6a", d: "M-20,-10 a20,20 0 0 1 40,0 v14 a8,8 0 0 1 -16,0 v-8 M-20,-10 v14 a8,8 0 0 0 16,0 v-8" },
];
const p10: PlanB = {
  a: 58.66, b: 64.0, trans: { tipo: "luz", d: 12, color: "#d8fff2" },
  sfx: [[58.7, "whoosh_big", -2], [60.4, "pop", 0], [60.9, "pop", 0], [61.4, "pop", 0], [61.9, "pop", 0], [62.4, "pop", 0], [63.2, "slam", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Pizarra} pal={PAL} seed={10} mano={2} claves={[mira(0, 960, 520, 1.0), mira(k(64), 960, 540, 1.08)]}
          medio={<>
            <CartelM x={960} y={420} claves={4700} tam={70} f={f} texto="NOT MONEY IN THE BANK" icono="dolar" />
            {ICONOS_REEMPLAZO.map((ic, i) => {
              const t = interpolate(f, [k(60.3 + i * 0.5), k(60.3 + i * 0.5) + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const x = 960 + (i - 2) * 300, y = 640;
              return (
                <g key={i} opacity={t} transform={`translate(${960 + (x - 960) * t},${420 + (y - 420) * t}) scale(${0.4 + 0.6 * t})`}>
                  <circle r={92} fill="#0b1820" stroke={ic.c} strokeWidth={8} />
                  <g transform="scale(2)"><path d={ic.d} fill="none" stroke={ic.c} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></g>
                  <text y={150} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill={ic.c} textAnchor="middle" letterSpacing={3}>{ic.t}</text>
                </g>
              );
            })}
            <NumeroM x={960} y={930} texto="= WHAT IT WOULD COST TO REPLACE YOU" desde={k(63.0)} tam={54} color="#f4efe4" />
          </>} />
      );
    };
    return <Pl />;
  },
};
// re-gancho: el bus llega a la parada 30 al ocaso
const p11: PlanB = {
  a: 64.0, b: 68.22, trans: { tipo: "fundido", d: 14 },
  sfx: [[64.0, "riser", -2, { dur: 4.2 }], [64.4, "bus_engine", -10, { dur: 3.6 }], [67.6, "heart1", -2]],
  el: (k) => {
    const bx = (f: number) => interpolate(f, [0, k(67.0)], [-600, 1500], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 2.4) });
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "alba", centro: () => 1400, paradas: [{ x: 1800, num: 30, refugio: true }] }} seed={11} mano={3}
          claves={[mira(0, 1500, 560, 0.85), mira(k(68.2), 1720, 520, 1.5, { curva: "in" })]}
          medio={<Bus9 x={bx(f)} y={ASH_CARRIL} hora="alba" rueda={bx(f) * 0.7} dir={1} gente={0.6} />}
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 70, color: VERDE, letterSpacing: 6, opacity: interpolate(f, [k(65.2), k(65.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 0 30px rgba(125,255,106,0.5)" }}>STOP 30</div>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 12 · cómo se le pone precio a una vida: el VSL ======================
const p12: PlanB = {
  a: 68.22, b: 94.62, trans: { tipo: "cortina", lado: 1 },
  sfx: [[68.3, "whoosh"], [74.2, "truck", -6, { dur: 4 }], [79.5, "pop"], [83.6, "pop"], [86.8, "slam", 0], [87.2, "roll", -2], [90.6, "metal", 0], [91.2, "metal", 0], [91.8, "metal", 0], [92.4, "metal", 0], [93.0, "metal", 0]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const camion = (i: number) => ((f * (9 + i * 2) + i * 870) % 2700) - 400;
      const defensas = Math.floor(interpolate(f, [k(90.5), k(93.4)], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#14222c", luz: "#ffc94a" }} seed={12} mano={2}
          claves={[mira(0, 960, 540, 0.9), mira(k(74.1), 960, 600, 1.0, { curva: "inout" }), mira(k(86.6), 960, 480, 1.05, { curva: "inout" }), mira(k(90.4), 960, 680, 1.15, { curva: "inout" }), mira(k(94.62), 960, 700, 1.2)]}
          medio={<>
            {/* la balanza del principio: una persona contra una pila de plata */}
            {f < k(74.2) && (
              <g opacity={interpolate(f, [k(73.4), k(74.1)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} transform={`translate(960,560) rotate(${Math.sin(f / 14) * 6})`}>
                <rect x={-360} y={-6} width={720} height={12} rx={6} fill="#e9e3d6" />
                <path d="M0,0 L-40,300 L40,300 Z" fill="#e9e3d6" />
                <g transform="translate(-300,-10)"><circle cx={0} cy={-120} r={30} fill="#f4efe4" /><path d="M-40,0 q0,-80 40,-80 q40,0 40,80 Z" fill="#f4efe4" /></g>
                <g transform="translate(300,-10)">{Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-60 + (i % 2) * 10} y={-24 - i * 22} width={110} height={20} rx={4} fill="#7dff6a" stroke="#2a6a2a" strokeWidth={3} />)}</g>
              </g>
            )}
            {f >= k(73.6) && (
              <g opacity={interpolate(f, [k(73.6), k(74.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                {/* la ruta con camiones y la defensa que se construye */}
                <rect x={-800} y={760} width={3600} height={220} fill="#3a3d44" />
                {Array.from({ length: 20 }).map((_, i) => <rect key={i} x={-760 + i * 200 - (f * 9) % 200} y={862} width={110} height={12} fill="#e8d45a" />)}
                {[0, 1, 2].map((i) => (
                  <g key={i} transform={`translate(${camion(i)},${810 + (i % 2) * 90})`}>
                    <rect x={-140} y={-110} width={200} height={110} rx={8} fill={["#e9e4d8", "#c23a2e", "#2a6fd6"][i]} />
                    <rect x={60} y={-80} width={80} height={80} rx={10} fill={["#2a5a9a", "#3a3f46", "#e9e4d8"][i]} />
                    <rect x={86} y={-70} width={44} height={32} rx={6} fill="#bfe0f2" />
                    {[-100, 20, 100].map((x) => <circle key={x} cx={x} cy={4} r={20} fill="#1d1d22" />)}
                  </g>
                ))}
                {Array.from({ length: defensas }).map((_, i) => <g key={i}><rect x={-200 + i * 200} y={700} width={190} height={22} rx={6} fill="#c9ced2" stroke="#7a8288" strokeWidth={4} /><rect x={-120 + i * 200} y={700} width={14} height={62} fill="#7a8288" /></g>)}
                {[["SAFER HIGHWAY?", 76.6, 560], ["NEW RULE FOR TRUCKS?", 78.4, 1360]].map(([t, s, x], i) => <g key={i} opacity={interpolate(f, [k(s as number), k(s as number) + 8, k(79.2), k(79.5)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} transform={`translate(${x},420)`}><rect x={-250} y={-50} width={500} height={100} rx={50} fill="#0b1820" stroke="#f4efe4" strokeWidth={5} /><text y={16} fontFamily={F_HUD} fontWeight={600} fontSize={42} fill="#f4efe4" textAnchor="middle">{t as string}</text></g>)}
                <g transform="translate(960,330)">
                  <rect x={-430} y={-70} width={860} height={140} rx={24} fill="#0b1820" stroke="#ffc94a" strokeWidth={6} opacity={interpolate(f, [k(79.4), k(79.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
                  <text y={-8} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#ffc94a" textAnchor="middle" letterSpacing={3} opacity={interpolate(f, [k(79.4), k(79.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>VALUE OF A STATISTICAL LIFE</text>
                  <text y={46} fontFamily={F_HUD} fontWeight={500} fontSize={30} fill="#e9e3d6" textAnchor="middle" opacity={interpolate(f, [k(83.6), k(84)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>what society will spend to prevent ONE death</text>
                </g>
                <NumeroM x={960} y={560} texto={"$" + Math.round(interpolate(f, [k(86.8), k(88.4)], [0, 13], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) + ",000,000"} desde={k(86.74)} tam={140} color="#ffc94a" rotulo="U.S. DEPARTMENT OF TRANSPORTATION" />
              </g>
            )}
          </>}
          hud={<FuenteB texto="U.S. DOT, value of a statistical life guidance (≈$13M, 2024)" desde={k(86.8)} hasta={k(94.5)} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 13 · el cuerpo desarmado en frascos: unos pocos dólares ======================
const FRASCOS = [{ s: "O", n: "OXYGEN", c: "#9fdcff", p: "$0.01" }, { s: "C", n: "CARBON", c: "#4a4a4a", p: "$0.03" }, { s: "Ca", n: "CALCIUM", c: "#f4f1e6", p: "$2.40" }, { s: "Fe", n: "IRON", c: "#c96a3a", p: "$0.01" }, { s: "P", n: "PHOSPHORUS", c: "#ffb04a", p: "$1.60" }, { s: "K", n: "POTASSIUM", c: "#c9b8ff", p: "$0.70" }];
const p13: PlanB = {
  a: 94.62, b: 111.64, trans: { tipo: "barrido", d: 10 },
  sfx: [[94.7, "whoosh"], [97.0, "glass", -2], [98.4, "glass", -2], [99.8, "glass", -2], [101.2, "glass", -2], [102.6, "glass", -2], [104.0, "glass", -2], [105.2, "coin", 0], [106.9, "sad", -6], [109.3, "sparkle", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const des = interpolate(f, [k(96.0), k(104.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <Escena Set={Lab} pal={PAL} seed={13} mano={2}
          claves={[mira(0, 1200, 560, 1.0), mira(k(104.6), 1300, 600, 1.15, { curva: "inout" }), mira(k(109.3), 1100, 600, 1.35, { curva: "inout" }), mira(k(111.64), 1080, 600, 1.4)]}
          medio={<>
            {/* silueta del cuerpo que se va vaciando en los frascos */}
            <g opacity={1 - des * 0.75}>
              <circle cx={700} cy={LAB_PISO - 430} r={60} fill="#7dff6a" opacity={0.25} stroke="#7dff6a" strokeWidth={4} strokeDasharray="10 8" />
              <path d={`M640,${LAB_PISO - 360} h120 l30,200 h-30 l-10,160 h-30 l-10,-150 l-10,150 h-30 l-10,-160 h-30 Z`} fill="#7dff6a" opacity={0.18} stroke="#7dff6a" strokeWidth={4} strokeDasharray="10 8" />
            </g>
            {FRASCOS.map((fr, i) => {
              const t = interpolate(f, [k(96.4 + i * 1.4), k(96.4 + i * 1.4) + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const x = 980 + i * 170, y = LAB_PISO - 200;
              return (
                <g key={i} transform={`translate(${x},${y}) scale(${0.6 + 0.4 * t})`} opacity={t}>
                  <rect x={-55} y={-150} width={110} height={150} rx={16} fill="#e9f4f6" opacity={0.35} stroke="#cfe6ea" strokeWidth={4} />
                  <rect x={-48} y={-150 + 150 * (1 - 0.7 * t)} width={96} height={146 * 0.7 * t} rx={10} fill={fr.c} opacity={0.85} />
                  <rect x={-40} y={-176} width={80} height={28} rx={6} fill="#5a6066" />
                  <text y={-60} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#1d2a34" textAnchor="middle">{fr.s}</text>
                  <text y={34} fontFamily={F_HUD} fontWeight={500} fontSize={18} fill="#e9e3d6" textAnchor="middle" letterSpacing={2}>{fr.n}</text>
                  <CartelM x={0} y={-200} claves={0} texto={fr.p} tam={26} f={f} desde={k(105.0)} />
                </g>
              );
            })}
            <NumeroM x={1400} y={300} texto={f < k(105.8) ? "" : "A FEW DOLLARS"} desde={k(105.8)} tam={90} color="#ffc94a" rotulo="YOUR BODY, SOLD AS RAW ELEMENTS" />
            {f > k(109.3) && <Persona look={OWEN} seed={47} luz={RIM.verde} ruta={[{ f: k(109.3), x: 640, y: LAB_PISO }, { f: k(110.4), x: 760, y: LAB_PISO }]} poses={[{ f: 0, v: {} }, { f: k(110.4), v: { hD: 90, cD: 30, hI: 60, cI: 40 } }]} caras={[{ f: 0, v: "determinado" }]} />}
          </>}
          hud={<FuenteB texto="Estimates of the human body's elemental value (various chemistry sources)" desde={k(100)} hasta={k(109)} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 14 · parada 4: el señor Abernathy ======================
const p14: PlanB = {
  a: 111.64, b: 127.78, trans: { tipo: "luz", d: 12 },
  sfx: [[111.7, "bus_brake", -6], [112.3, "bus_door", -2], [112.9, "step", -2], [113.5, "step", -2], [114.1, "step", -2], [115.0, "chair", -6], [115.94, "roll", 0], [117.4, "ding", -4], [126.0, "paper", 0]],
  el: (k) => {
    const x4 = ASIENTO_X(4);
    const pf = (f: number) => interpolate(f, [k(111.9), k(112.3), k(114.2), k(114.6)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: marchaParadas([[0, k(114.6)]], 14), puertaF: pf }} seed={14} mano={2.5}
          claves={[mira(0, 700, 640, 1.2), mira(k(115.0), x4 - 300, 620, 1.35, { curva: "inout" }), mira(k(118.2), (x4 + ch) / 2, 640, 1.0, { curva: "inout" }), mira(k(120.6), x4 - 40, 600, 1.7, { curva: "inout" }), mira(k(126), x4 - 40, 610, 1.8)]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "neutral" }, { f: k(118.2), v: "duda" }, { f: k(121), v: "feliz" }], habla: [[k(118.4), k(120.4)]], giros: [{ f: 0, v: 0 }, { f: k(118.2), v: 0.6 }, { f: k(124), v: 0 }], cartel: { claves: 4700, tam: 28 } })} />
            <Volante />
            {pasajerosBus(k, { 5: { cartel: undefined } }).filter((_, i) => i !== 2).map((p, i) => <Persona key={i} {...p} />)}
            <Persona look={ABERNATHY} seed={4} luz={RIM.tubo}
              ruta={[{ f: 0, x: 560, y: BP }, { f: k(112.6), x: 560, y: BP }, { f: k(114.8), x: x4, y: BP }]} opacidad={(ff) => (ff < k(112.4) ? 0 : 1)}
              asiento={[{ f: 0, v: undefined }, { f: k(114.8), v: undefined }, { f: k(115.3), v: BUS_PUNTOS.asiento }]} dir={[{ f: 0, v: 1 }, { f: k(114.9), v: -1 }]}
              poses={[{ f: 0, v: {} }, { f: k(115.3), v: "sentado" }, { f: k(125.9), v: { hD: 40, cD: 110, hI: 40, cI: 110, pI: 85, rI: -80, pD: 88, rD: -85 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(120.6), v: "feliz" }]} habla={[[k(120.6), k(125.9)]]} giros={[{ f: 0, v: 0 }, { f: k(120.4), v: -0.4 }, { f: k(126), v: 0 }]}
              enManoD={(ff) => ff > k(125.9) ? <rect x={-30} y={-46} width={64} height={84} rx={3} fill="#efeae0" stroke="#bdb6a8" strokeWidth={2} /> : null}
              cartel={{ claves: [{ f: 0, v: 0 }, { f: k(115.94), v: 890000, d: 50 }], tam: 34, desde: k(115.6), rotulo: "MR. ABERNATHY" }} />
            <GloboM x={x4 - 30} y={BP - 300} texto={"What do you do\nwith your days?"} desde={k(118.4)} hasta={k(120.5)} tam={24} lado={-1} />
          </>}
          hud={<>
            <Vineta x={70} y={130} w={620} desde={k(121.0)} hasta={k(123.6)} rot={-3}>
              <Escena Set={Aula} pal={PAL} seed={141} mano={1.5} claves={[mira(0, 900, AULA_PISO - 200, 1.2)]}
                medio={<>
                  <Persona look={ABERNATHY} seed={4} luz={RIM.cocina} ruta={[{ f: 0, x: 900, y: AULA_PISO }]} asiento={[{ f: 0, v: 60 }]} poses={[{ f: 0, v: { hD: 60, cD: 100, hI: 60, cI: 100, pI: 85, rI: -80, pD: 88, rD: -85 } }]} caras={[{ f: 0, v: "risa" }]} habla={[[0, 9999]]} />
                  {[0, 1, 2].map((i) => <Persona key={i} look={NENE} seed={60 + i} luz={RIM.cocina} ruta={[{ f: 0, x: 1150 + i * 110, y: AULA_PISO }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 20 }]} poses={[{ f: 0, v: "sentadoSuelo" }]} caras={[{ f: 0, v: i === 1 ? "risa" : "feliz" }]} escala={0.8} />)}
                </>} />
            </Vineta>
            <Vineta x={1220} y={150} w={620} desde={k(123.4)} hasta={k(126.0)} rot={3}>
              <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "manana" }} seed={142} mano={1.5} claves={[mira(0, 1180, 900, 0.7)]}
                medio={<Persona look={{ ...ABERNATHY, accesorios: [...(ABERNATHY.accesorios ?? []), { t: "bufanda", color: "#c23a2e" }] }} seed={4} ruta={[{ f: 0, x: 900, y: TF_PISO }, { f: 200, x: 1500, y: TF_PISO }]} poses={[{ f: 0, v: "empujar" }]} caras={[{ f: 0, v: "determinado" }]} />}
                frente={<>{Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={(i * 97) % 2000} cy={((i * 53 + useF() * 3) % 1100)} r={5} fill="#fff" opacity={0.8} />)}</>} />
            </Vineta>
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 15 · parada 18: Lena corre con un café ======================
const p15: PlanB = {
  a: 127.78, b: 135.84, trans: { tipo: "barrido", d: 10 },
  sfx: [[127.8, "bus_brake", -6], [128.9, "door_bell", -4], [129.2, "step", 0], [129.5, "step", 0], [129.8, "step", 0], [130.1, "step", 0], [131.4, "pop", 0], [132.6, "roll", -2], [134.6, "coin", 0]],
  el: (k) => {
    const CAFE = 1700;
    const busX = 2050;
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 2100, cafe: CAFE, paradas: [{ x: 2300, num: 18 }], autos: 3 }} seed={15} mano={3}
          claves={[mira(0, 2100, 760, 0.95), mira(k(131.2), 2250, 790, 1.2, { curva: "inout" }), mira(k(135.84), 2300, 790, 1.3)]}
          medio={<>
            <Bus9 x={busX} y={ASH_CARRIL} hora="manana" puertas={1} kneel={kneelEn(f, 0, k(135.8))} dir={1} gente={0.5} />
            <Persona look={LENA} seed={18} luz={RIM.sol}
              ruta={[{ f: 0, x: CAFE + 600, y: ASH_PISO }, { f: k(128.9), x: CAFE + 600, y: ASH_PISO }, { f: k(130.6), x: busX + 120, y: ASH_CARRIL - 80, curva: "out" }]} correr={0.9}
              poses={[{ f: 0, v: {} }, { f: k(130.8), v: { hD: 80, cD: 20 } }, { f: k(134.6), v: { hD: 30, cD: 30 } }]} caras={[{ f: 0, v: "risa" }, { f: k(134.8), v: "sorpresa" }, { f: k(135.4), v: "feliz" }]}
              habla={[[k(131.4), k(132.6)]]} enManoD={<Taza x={0} y={0} color="#f4efe6" vapor={1} f={f} />}
              cartel={{ claves: [{ f: 0, v: 610000 }, { f: k(132.6), v: 640000, d: 70 }], tam: 44, rotulo: "LENA" }} />
            <GloboM x={busX + 130} y={ASH_PISO - 300} texto={"On the house!"} desde={k(131.4)} hasta={k(133.6)} tam={28} lado={1} />
            {f > k(134.6) && <g transform={`translate(${busX + 60 + (f - k(134.6)) * 4},${ASH_PISO - 180 - (f - k(134.6)) * 1.5})`}><rect x={-22} y={-12} width={44} height={24} rx={3} fill="#9fdc8a" stroke="#4a8a3a" strokeWidth={2} /><text y={6} fontFamily={F_HUD} fontWeight={600} fontSize={14} fill="#2a5a2a" textAnchor="middle">$5</text></g>}
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 16-18 · parada 30, 6:10: Mrs. Delphine Ward ======================
const p16: PlanB = {
  a: 135.84, b: 147.36, trans: { tipo: "fundido", d: 14 },
  sfx: [[135.9, "bus_brake", -6], [136.6, "bus_kneel", -6], [137.4, "bus_door", -2], [138.2, "step", -2], [138.8, "bag", -4], [139.6, "metal", -2], [140.4, "step", -2], [141.2, "step", -2], [144.8, "suspense", -8, { dur: 3 }]],
  el: (k) => {
    const busX = 1150;
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "alba", centro: () => 1300, paradas: [{ x: 1500, num: 30, refugio: true }], autos: 2 }} seed={16} mano={3}
          claves={[mira(0, 1300, 760, 0.9), mira(k(140.0), 1350, 780, 1.2, { curva: "inout" }), mira(k(143.5), 1420, 760, 1.5, { curva: "inout" }), mira(k(147.36), 1420, 760, 1.6)]}
          medio={<>
            <Bus9 x={busX} y={ASH_CARRIL} hora="alba" puertas={interpolate(f, [k(137.2), k(137.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} kneel={kneelEn(f, k(136.5), k(147))} dir={1} gente={0.4} />
            <Persona look={DELPHINE} seed={66} luz={RIM.alba}
              ruta={[{ f: 0, x: 1520, y: ASH_CARRIL - 80 }, { f: k(137.8), x: 1520, y: ASH_CARRIL - 80 }, { f: k(142.0), x: 1330, y: ASH_CARRIL - 80 }]}
              poses={[{ f: 0, v: { hD: 10, cD: 10, hI: 14, cI: 12, tronco: 8 } }]} caras={[{ f: 0, v: "cansado" }]} dir={[{ f: 0, v: -1 }]}
              enManoD={<g><path d="M-26,0 h52 l-6,70 h-40 Z" fill="#c9a36a" /><path d="M-14,0 q14,-24 28,0" stroke="#8a6a4a" strokeWidth={4} fill="none" /></g>}
              enManoI={<g><path d="M-26,0 h52 l-6,70 h-40 Z" fill="#e9e4d8" /><path d="M-14,0 q14,-24 28,0" stroke="#8a8a8a" strokeWidth={4} fill="none" /></g>} />
            {/* la silla de ruedas plegada que lleva arrastrando */}
            <g transform={`translate(${interpolate(f, [k(137.8), k(142.0)], [1600, 1410], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })},${ASH_CARRIL - 80})`}>
              <rect x={-14} y={-200} width={28} height={190} rx={8} fill="#3a3f46" /><circle cx={0} cy={-14} r={40} fill="none" stroke="#2a2e34" strokeWidth={10} /><circle cx={0} cy={-14} r={6} fill="#8a9298" />
            </g>
          </>}
          hud={<div style={{ position: "absolute", left: 90, bottom: 110, fontFamily: F_HUD, fontWeight: 600, fontSize: 46, color: "#f4efe4", opacity: interpolate(f, [k(141.6), k(142.2), k(146.6), k(147.3)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>MRS. DELPHINE WARD · 66</div>} />
      );
    };
    return <Pl />;
  },
};
const p17: PlanB = {
  a: 147.36, b: 154.34, trans: { tipo: "corte" },
  sfx: [[148.6, "pop", -2], [151.0, "pop", -2]],
  el: (k) => {
    const x2 = ASIENTO_X(2);
    return (
      <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "alba", avance: (f: number) => f * 12 }} seed={17} mano={2.5}
        claves={[mira(0, (x2 + ch) / 2, 640, 1.2), mira(k(154.34), x2 - 80, 600, 1.45)]}
        medio={<>
          <Persona {...owenVolante({ giros: [{ f: 0, v: 0.7 }], caras: [{ f: 0, v: "triste" }], cartel: { claves: 4700, tam: 28 } })} />
          <Volante />
          <Persona {...sentadoBus(DELPHINE, x2, { caras: [{ f: 0, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.9, y: 0.1 } }], seed: 66, poses: [{ f: 0, v: { ...POSE_CELU_SENTADO, hD: 20, cD: 80, cabeza: 6 } }] })} />
        </>}
        hud={<>
          <Vineta x={1180} y={110} w={640} desde={k(148.4)} hasta={k(154.3)} rot={2}>
            <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "manana" }} seed={171} mano={1.5} claves={[mira(0, 560, 760, 1.6)]}
              medio={<>
                <Persona look={{ ...ABERNATHY, camisa: "#5a6a8a", accesorios: [{ t: "pelo", forma: "calvo", color: "#c9c4bb" }] }} seed={70} luz={RIM.cocina} ruta={[{ f: 0, x: 500, y: TF_PISO }]} asiento={[{ f: 0, v: 60 }]} poses={[{ f: 0, v: "sentado" }]} caras={[{ f: 0, v: "duda" }]} miradas={[{ f: 0, v: { x: -0.9, y: -0.4 } }]} />
                <Persona look={DELPHINE} seed={66} luz={RIM.cocina} ruta={[{ f: 0, x: 680, y: TF_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 70, cD: 50 } }]} caras={[{ f: 0, v: "feliz" }]} />
              </>} />
          </Vineta>
          <Vineta x={1260} y={560} w={560} desde={k(151.0)} hasta={k(154.3)} rot={-2}>
            <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "tarde" }} seed={172} mano={1.5} claves={[mira(0, 620, 760, 1.6)]}
              medio={<>
                {[0, 1].map((i) => <Persona key={i} look={{ ...NENE, camisa: ["#f2c230", "#3fa3d0"][i] }} seed={80 + i} luz={RIM.cocina} ruta={[{ f: 0, x: 540 + i * 160, y: TF_PISO }]} escala={0.8} poses={[{ f: 0, v: i ? "celebrar" : "saludar" }]} caras={[{ f: 0, v: "risa" }]} />)}
                <Persona look={DELPHINE} seed={66} luz={RIM.cocina} ruta={[{ f: 0, x: 860, y: TF_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "manosCintura" }]} caras={[{ f: 0, v: "cansado" }]} />
              </>} />
          </Vineta>
        </>} />
    );
  },
};
const p18: PlanB = {
  a: 154.34, b: 162.28, trans: { tipo: "corte" },
  sfx: [[154.4, "roll", 0, { dur: 4 }], [158.2, "boom", -2], [158.4, "sparkle", -4], [160.9, "sad", -10]],
  el: (k) => {
    const x2 = ASIENTO_X(2);
    return (
      <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "alba", avance: (f: number) => f * 12 }} seed={18} mano={2}
        claves={[mira(0, x2, 560, 2.0), mira(k(158.2), x2, 470, 1.55, { resorte: { damping: 9, stiffness: 120 } }), mira(k(162.28), x2, 500, 1.65)]}
        medio={<>
          {pasajerosBus(k).map((p, i) => <Persona key={i} {...p} cartel={{ ...(p.cartel as any), desde: 0, tam: 26 }} />)}
          <Persona {...sentadoBus(DELPHINE, x2, { caras: [{ f: 0, v: "cansado" }], seed: 66, cartel: { claves: [{ f: 0, v: 0 }, { f: k(154.5), v: 2900000, d: 110 }], fmt: (v: number) => "$" + Math.round(v).toLocaleString("en-US"), tam: 46, rotulo: "MRS. WARD", latido: 0 } })} />
        </>}
        hud={<div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: F_MANO, fontWeight: 700, fontSize: 70, color: "#f4efe4", opacity: interpolate(useF(), [k(159.3), k(159.6), k(162), k(162.28)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: "rotate(-2deg)", textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>{useF() < k(160.9) ? "Taxes paid on it: $0" : "Paid to her: $0"}</div>} />
    );
  },
};

// ====================== 19 · AARP: 38 millones de cuidadores, $600 mil millones ======================
const p19: PlanB = {
  a: 162.28, b: 182.4, trans: { tipo: "luz", d: 12, color: "#ffe2a0" },
  sfx: [[162.4, "whoosh_big", -2], [164.0, "popcluster", -2, { dur: 2.5 }], [168.0, "slam", 0], [170.4, "roll", -2], [173.7, "paper", 0], [175.4, "stamp", 0], [176.7, "pop", 0], [178.6, "pop", 0], [179.8, "pop", 0]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const fase2 = f >= k(173.6);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1c1626", luz: "#ff8a9a" }} seed={19} mano={2}
          claves={[mira(0, 960, 540, 1.0), mira(k(173.4), 960, 520, 1.05, { curva: "inout" }), mira(k(176.4), 960, 560, 1.12, { curva: "inout" }), mira(k(182.4), 960, 560, 1.18)]}
          medio={<>
            {!fase2 && <>
              <Personitas x={360} y={340} n={38} cols={19} on={38} color="#ff8a9a" tam={46} desde={k(162.4)} f={f} paso={1} />
              <NumeroM x={960} y={250} texto="38 MILLION" rotulo="FAMILY CAREGIVERS IN THE U.S." desde={k(163.7)} tam={110} color="#ff8a9a" />
              <NumeroM x={960} y={900} texto={"$" + Math.round(interpolate(f, [k(167.4), k(169.0)], [0, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) + " BILLION"} rotulo="OF UNPAID CARE · IN ONE YEAR" desde={k(168.0)} tam={130} color={VERDE} />
            </>}
            {fase2 && (
              <g transform={`translate(960,${interpolate(f, [k(173.6), k(174.2)], [900, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}) rotate(-3)`}>
                <rect x={-560} y={-220} width={1120} height={440} rx={18} fill="#f4f1e6" stroke="#9aa49a" strokeWidth={6} />
                <text x={-510} y={-150} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#4a5a4a">PAY TO THE ORDER OF</text>
                <text x={-510} y={-80} fontFamily={F_MANO} fontWeight={700} fontSize={64} fill="#1f3fa8">every family caregiver</text>
                <rect x={180} y={-200} width={340} height={80} rx={10} fill="#fff" stroke="#9aa49a" strokeWidth={3} />
                <text x={350} y={-145} fontFamily={F_HUD} fontWeight={600} fontSize={46} fill="#2a5a2a" textAnchor="middle">$600,000,000,000</text>
                <rect x={-510} y={40} width={1020} height={3} fill="#9aa49a" />
                <text x={-510} y={30} fontFamily={F_MANO} fontWeight={700} fontSize={44} fill="#1f3fa8">six hundred billion dollars</text>
                {f > k(175.4) && <g transform={`rotate(-14) scale(${interpolate(f, [k(175.4), k(175.7)], [1.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`} opacity={0.85}><rect x={60} y={80} width={420} height={90} rx={10} fill="none" stroke="#c23a2e" strokeWidth={8} /><text x={270} y={142} fontFamily={F_HUD} fontWeight={600} fontSize={52} fill="#c23a2e" textAnchor="middle">NEVER SENT</text></g>}
              </g>
            )}
          </>}
          hud={<>
            <FuenteB texto="AARP, Valuing the Invaluable (2023): ~38M caregivers, ~$600B" desde={k(165)} hasta={k(173.4)} />
            {[["Most are women.", 176.7], ["Most are tired.", 178.56], ["Most never think they're worth anything.", 179.8]].map(([t, s], i) => (
              <div key={i} style={{ position: "absolute", left: 120, top: 760 + i * 74, fontFamily: F_MANO, fontWeight: 700, fontSize: 60, color: i === 2 ? "#ff8a9a" : "#f4efe4", opacity: interpolate(f, [k(s as number), k(s as number) + 8, k(181.9), k(182.3)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>{t as string}</div>
            ))}
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 20 · CTA a mitad: ¿qué diría el tuyo? ======================
const p20: PlanB = {
  a: 182.4, b: 193.22, trans: { tipo: "fundido", d: 14 },
  sfx: [[182.5, "whoosh"], [184.6, "pop", 0], [185.4, "roll", -4, { dur: 2.5 }], [188.0, "ding", -4], [189.2, "pop", 0]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const n = Math.floor(f / 4) % 9;
      const vals = ["$12,400", "$380,000", "$1.2M", "$47,000", "$2.1M", "$900", "$640,000", "$3.3M", "$88,000"];
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0e1a20" }} seed={20} mano={2} claves={[mira(0, 960, 560, 1.0), mira(k(193.2), 960, 560, 1.1)]}
          medio={<>
            <g transform="translate(960,1000)"><circle cx={0} cy={-420} r={110} fill="#22303a" /><path d="M-200,0 Q-200,-280 0,-280 Q200,-280 200,0 Z" fill="#22303a" /></g>
            <CartelM x={960} y={430} claves={0} texto={f < k(187.9) ? (f > k(185.4) ? vals[n] : "???") : "YOU?"} tam={78} f={f} desde={k(184.4)} />
          </>}
          hud={<>
            <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 68, color: "#f4efe4", opacity: interpolate(f, [k(184.5), k(185)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>WHAT WOULD YOURS SAY?</div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 44, color: VERDE, opacity: interpolate(f, [k(188), k(188.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>TELL US IN THE COMMENTS  ·  SUBSCRIBE</div>
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 21 · martes: la cuenta que venía esquivando ======================
const p21: PlanB = {
  a: 193.22, b: 216.0, trans: { tipo: "cortina", lado: -1 },
  sfx: [[193.3, "tick", -2], [194.2, "calc", -2, { dur: 3 }], [196.4, "slam", -2], [198.6, "slam", -2], [201.0, "fail", -6], [203.7, "whoosh"], [204.4, "popcluster", -4, { dur: 2 }], [207.0, "pop", 0], [213.3, "paper", 0], [213.8, "paper", 0], [214.3, "paper", 0], [214.8, "stamp", 0]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const stat = f >= k(203.6);
      if (!stat) return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "noche", luzCocina: true }} seed={21} mano={2.5}
          claves={[mira(0, 620, 640, 1.6), mira(k(196.4), TF_PUNTOS.mesa, 680, 2.3, { curva: "inout" }), mira(k(203.6), TF_PUNTOS.mesa, 690, 2.4)]}
          medio={<>
            <Persona look={OWEN_CASA} seed={47} luz={RIM.cocina} ruta={[{ f: 0, x: TF_PUNTOS.sillaOwen, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 60 }]}
              poses={[{ f: 0, v: { ...POSE_CELU_SENTADO, hD: 50, cD: 80, hI: 50, cI: 70, cabeza: 18 } }, { f: k(201), v: { hD: 40, cD: 150, hI: 40, cI: 150, cabeza: 18, tronco: 14, pI: 85, rI: -80, pD: 88, rD: -85 } }]}
              caras={[{ f: 0, v: "duda" }, { f: k(201), v: "triste" }]} cartel={{ claves: 4700, tam: 30 }} />
            <Factura x={TF_PUNTOS.mesa - 70} y={P - 212} s={0.32} rot={-80} />
          </>}
          hud={<div style={{ position: "absolute", left: 110, top: 150, fontFamily: F_MANO, fontWeight: 700, fontSize: 84, color: "#f4efe4", lineHeight: 1.1, textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>
            <div style={{ opacity: f > k(194.2) ? 1 : 0 }}>&nbsp;&nbsp;$31,412</div>
            <div style={{ opacity: f > k(198.5) ? 1 : 0 }}>−&nbsp;&nbsp;$4,700</div>
            <div style={{ opacity: f > k(200.9) ? 1 : 0, borderTop: "5px solid #f4efe4", color: "#ff6a5a" }}>&nbsp;&nbsp;$26,712 short</div>
          </div>} />
      );
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1e1418", luz: "#ff6a5a" }} seed={211} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(216), 960, 560, 1.1)]}
          medio={<>
            <NumeroM x={960} y={240} texto="100 MILLION" rotulo="AMERICANS WITH MEDICAL DEBT" desde={k(204.0)} tam={120} color="#ff6a5a" />
            {f < k(213.2) && <Personitas x={520} y={520} n={10} cols={10} on={4} color="#ff6a5a" tam={80} desde={k(207.0)} f={f} paso={3} />}
            {f < k(213.2) && <NumeroM x={960} y={800} texto="4 IN 10 ADULTS" desde={k(209.6)} tam={70} color="#f4efe4" />}
            {f >= k(213.2) && [0, 1, 2, 3].map((i) => {
              const t = interpolate(f, [k(213.3 + i * 0.5), k(213.3 + i * 0.5) + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return <g key={i} transform={`translate(${760 + i * 130},${560 + (1 - t) * -400 - i * 18}) rotate(${(i - 1.5) * 9})`} opacity={t}><rect x={-160} y={-100} width={320} height={200} rx={8} fill="#f4f1e6" stroke="#c9c2b0" strokeWidth={3} /><text y={-30} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#c23a2e" textAnchor="middle">FINAL NOTICE</text>{[0, 1, 2].map((r) => <rect key={r} x={-120} y={10 + r * 22} width={240} height={8} rx={3} fill="#d6d2c6" />)}</g>;
            })}
          </>}
          hud={<FuenteB texto="KFF Health News & NPR investigation (2022)" desde={k(206.8)} hasta={k(215.8)} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 22 · el centro de plasma ======================
const p22: PlanB = {
  a: 216.0, b: 248.44, trans: { tipo: "barrido", d: 10 },
  sfx: [[216.1, "door_bell", -4], [216.6, "step", -2], [217.1, "step", -2], [221.5, "whoosh"], [223.4, "pop", 0], [226.0, "pop", 0], [228.8, "pop", 0], [231.8, "pop", 0], [234.8, "machine", -8, { dur: 6.4 }], [236.2, "beep", -6], [239.4, "beep", -6], [241.3, "door_bell", -4], [244.6, "coin", 0], [246.8, "roll", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const s0 = PLA_PUNTOS.sillon[0];
      const enCiencia = f >= k(221.46) && f < k(234.7);
      if (enCiencia) {
        const t1 = f < k(228.76);
        return (
          <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#20180c", luz: "#f2c94a" }} seed={221} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(234.7), 960, 560, 1.1)]}
            medio={t1 ? <>
              {/* el mundo: 2/3 del plasma sale de EE.UU. */}
              <circle cx={640} cy={540} r={250} fill="#1d2a34" stroke="#f2c94a" strokeWidth={6} />
              <path d={`M640,540 L640,290 A250,250 0 1 1 ${640 + 250 * Math.sin(-2.094)},${540 - 250 * Math.cos(-2.094)} Z`} fill="#f2c94a" opacity={interpolate(f, [k(222), k(223.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
              <NumeroM x={640} y={880} texto="≈ 2/3" rotulo="OF THE WORLD'S PLASMA COMES FROM THE U.S." desde={k(223.4)} tam={90} color="#f2c94a" />
              {/* el tubo de sangre: rojo abajo, amarillo arriba */}
              <g transform="translate(1340,540)">
                <rect x={-60} y={-260} width={120} height={500} rx={60} fill="#e9f4f6" opacity={0.3} stroke="#cfe6ea" strokeWidth={6} />
                <rect x={-52} y={-10} width={104} height={240} rx={50} fill="#a3202a" />
                <rect x={-52} y={-200 + 190 * (1 - interpolate(f, [k(225.6), k(226.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))} width={104} height={190 * interpolate(f, [k(225.6), k(226.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} fill="#f2c94a" />
                <text x={110} y={-100} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f2c94a">PLASMA</text>
                <text x={110} y={120} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#ff6a6a">RED CELLS</text>
              </g>
              {["BURNS", "IMMUNE DISEASES", "BLEEDING DISORDERS"].map((t, i) => <g key={i} opacity={interpolate(f, [k(226.0 + i * 0.9), k(226.4 + i * 0.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}><rect x={1520} y={300 + i * 110} width={360} height={80} rx={40} fill="#0b1820" stroke="#f2c94a" strokeWidth={4} /><text x={1700} y={352 + i * 110} fontFamily={F_HUD} fontWeight={600} fontSize={i ? 28 : 36} fill="#f4efe4" textAnchor="middle">{t}</text></g>)}
            </> : <>
              {/* calendario: hasta 2 veces por semana, los primeros pagan más */}
              <g transform="translate(960,560)">
                <rect x={-520} y={-260} width={1040} height={460} rx={20} fill="#f4f1e6" />
                <rect x={-520} y={-260} width={1040} height={90} rx={20} fill="#c23a2e" />
                <text y={-198} fontFamily={F_HUD} fontWeight={600} fontSize={46} fill="#fff" textAnchor="middle">THIS WEEK</text>
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d, i) => <g key={d}><text x={-450 + i * 150} y={-120} fontFamily={F_HUD} fontWeight={600} fontSize={28} fill="#4a4a4a" textAnchor="middle">{d}</text><rect x={-510 + i * 150} y={-90} width={120} height={140} rx={10} fill="#e6e0d2" />{(i === 1 || i === 4) && <circle cx={-450 + i * 150} cy={-20} r={46} fill="#f2c94a" opacity={interpolate(f, [k(229.6 + (i === 4 ? 0.6 : 0)), k(230 + (i === 4 ? 0.6 : 0))], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}</g>)}
                <text y={150} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#2a5a2a" textAnchor="middle" opacity={interpolate(f, [k(231.9), k(232.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>NEW DONORS: BONUS FOR FIRST VISITS</text>
              </g>
            </>}
            hud={<FuenteB texto="Plasma Protein Therapeutics Association; FDA donation rules" desde={k(222)} hasta={k(234.4)} />} />
        );
      }
      const sale = f >= k(241.2);
      return (
        <Escena Set={Plasma} pal={PAL} setProps={{ hora: "ocaso" }} seed={22} mano={2.5}
          claves={sale ? [mira(k(241.2), 700, 620, 1.2), mira(k(248.44), 560, 620, 1.4)] : f < k(221.46) ? [mira(0, 400, 640, 0.9), mira(k(221.4), 700, 660, 1.1)] : [mira(k(234.7), s0 + 40, 720, 1.5), mira(k(241.2), s0 + 60, 740, 1.8, { curva: "inout" })]}
          medio={<>
            <Persona look={OWEN} seed={47} luz={RIM.clinica}
              ruta={sale ? [{ f: k(241.2), x: s0 - 120, y: PLA_PISO }, { f: k(244), x: 300, y: PLA_PISO }] : f < k(221.46) ? [{ f: 0, x: -100, y: PLA_PISO }, { f: k(219.4), x: PLA_PUNTOS.recepcion + 300, y: PLA_PISO }] : [{ f: 0, x: s0, y: PLA_PISO }]}
              asiento={sale || f < k(221.46) ? undefined : [{ f: 0, v: 108 }]}
              poses={sale ? [{ f: 0, v: { hI: 40, cI: 110 } }, { f: k(244.4), v: { hI: 40, cI: 110, hD: 60, cD: 80 } }] : f < k(221.46) ? [{ f: 0, v: {} }] : [{ f: 0, v: { ...POSE_CELU_SENTADO, tronco: -14, cabeza: 4, hD: 50, cD: 10, hI: 20, cI: 30, rI: -50, rD: -55 } }]}
              caras={sale ? [{ f: 0, v: "cansado" }, { f: k(244.6), v: "duda" }] : [{ f: 0, v: "cansado" }]} dir={[{ f: 0, v: -1 }]}
              enManoD={sale ? (ff) => ff > k(244.4) ? <rect x={-26} y={-16} width={52} height={32} rx={5} fill="#2a6fd6" /> : null : undefined}
              cartel={{ claves: 4700, tam: 30 }} />
            {!sale && f >= k(221.46) && <Aferesis x={s0} piso={PLA_PISO} brazo={{ x: s0 - 60, y: PLA_PISO - 175 }} lleno={interpolate(f, [k(234.7), k(241.2)], [0.1, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} f={f} />}
            {sale && <circle cx={0} cy={0} r={0} />}
          </>}
          hud={<>
            {!sale && f >= k(234.7) && <div style={{ position: "absolute", right: 90, top: 150, fontFamily: F_HUD, fontWeight: 600, fontSize: 54, color: "#f4efe4", textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>{`0:${String(Math.min(59, Math.floor(interpolate(f, [k(234.7), k(241)], [0, 59], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })))).padStart(2, "0")} → 1:00 h`}</div>}
            {sale && <div style={{ position: "absolute", left: 120, top: 200, fontFamily: F_HUD, fontWeight: 600, fontSize: 64, color: "#ff6a5a", textShadow: "0 3px 10px rgba(0,0,0,0.6)", opacity: interpolate(f, [k(246.6), k(247)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>${Math.round(interpolate(f, [k(246.8), k(248)], [26012, 25942], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })).toLocaleString("en-US")} TO GO</div>}
            {sale && <div style={{ position: "absolute", left: 120, top: 120, fontFamily: F_HUD, fontWeight: 600, fontSize: 52, color: VERDE, opacity: interpolate(f, [k(244.6), k(245)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>+$70</div>}
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 23 · miércoles: su propio cartel empieza a subir ======================
const p23: PlanB = {
  a: 248.44, b: 266.18, trans: { tipo: "luz", d: 12 },
  sfx: [[248.5, "whoosh"], [250.5, "roll", 0], [251.8, "ding", -4], [254.1, "roll", 0], [254.6, "ding", -4], [257.0, "bus_engine", -12, { dur: 1.6 }], [258.6, "bag", -4], [260.0, "metal", -4], [261.6, "roll", 0, { dur: 2.5 }], [264.4, "sparkle", -4]],
  el: (k) => {
    const sube = [{ f: 0, v: 4700 }, { f: k(250.5), v: 6000, d: 26 }, { f: k(254.1), v: 9000, d: 20 }, { f: k(261.6), v: 14000, d: 60 }];
    const Pl: React.FC = () => {
      const f = useF();
      const fase = f < k(256.6) ? 0 : f < k(258.0) ? 1 : f < k(259.9) ? 2 : f < k(261.6) ? 3 : 4;
      if (fase === 0 || fase === 1) return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "dia", avance: (ff: number) => ff * 14 }} seed={23} mano={2.5}
          claves={[mira(0, ch + 60, 560, 2.2), mira(k(256.6), ch + 120, 620, 1.6, { curva: "inout" })]}
          medio={<><Persona {...owenVolante({ cartel: { claves: sube, tam: 34 }, caras: [{ f: 0, v: "duda" }, { f: k(250.6), v: "sorpresa" }, { f: k(254.9), v: "duda" }], giros: [{ f: 0, v: 0 }, { f: k(252), v: 0.5 }, { f: k(254), v: 0 }] })} /><Volante /></>} />
      );
      if (fase === 2) return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "dia", centro: () => 1500, paradas: [{ x: 1700, num: 30, refugio: true }], autos: 2 }} seed={231} mano={2.5}
          claves={[mira(0, 1500, 780, 1.2)]}
          medio={<>
            <Bus9 x={1300} y={ASH_CARRIL} hora="dia" puertas={1} kneel={1} dir={1} chofer={false} />
            <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: k(258), x: 1450, y: ASH_CARRIL - 80 }, { f: k(259.6), x: 1560, y: ASH_CARRIL - 80 }]} poses={[{ f: 0, v: { hD: 10, cD: 10, hI: 14, cI: 12 } }]} caras={[{ f: 0, v: "feliz" }]} cartel={{ claves: sube, tam: 34 }}
              enManoD={<g><path d="M-26,0 h52 l-6,70 h-40 Z" fill="#c9a36a" /></g>} enManoI={<g><path d="M-26,0 h52 l-6,70 h-40 Z" fill="#e9e4d8" /></g>} />
            <Persona look={DELPHINE} seed={66} luz={RIM.sol} ruta={[{ f: k(258), x: 1580, y: ASH_CARRIL - 80 }, { f: k(259.6), x: 1700, y: ASH_CARRIL - 80 }]} caras={[{ f: 0, v: "feliz" }]} cartel={{ claves: 2900000, tam: 30 }} />
          </>} />
      );
      if (fase === 3) return (
        <Escena Set={Garaje} pal={PAL} setProps={{ hora: "tarde" }} seed={232} mano={2.5} claves={[mira(0, GAR_PUNTOS.mostrador, 620, 1.4)]}
          medio={<Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: GAR_PUNTOS.mostrador, y: GAR_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 80, cD: 40 } }, { f: k(260.8), v: "señalar" }]} caras={[{ f: 0, v: "feliz" }]} cartel={{ claves: sube, tam: 34 }} />}
          hud={<div style={{ position: "absolute", left: 160, top: 180, fontFamily: F_MANO, fontWeight: 700, fontSize: 64, color: "#f4efe4", transform: "rotate(-4deg)", textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>covers Ray's shift</div>} />
      );
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "noche", luzCocina: false, luzDorm: true }} seed={233} mano={2} claves={[mira(k(261.6), 700, 140, 1.6), mira(k(266.18), 760, 120, 2.0)]}
          medio={<Persona look={OWEN_CASA} seed={47} luz={RIM.noche} ruta={[{ f: 0, x: TF_PUNTOS.cama + 180, y: A }]} asiento={[{ f: 0, v: 70 }]} poses={[{ f: 0, v: { ...POSE_CELU_SENTADO, hD: 120, cD: 30, hI: 120, cI: 30, cabeza: -18 } }]} caras={[{ f: 0, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0, y: -1 } }]} cartel={{ claves: sube, tam: 36 }} />} />
      );
    };
    return <Pl />;
  },
};

// ====================== 24 · el experimento de las tazas (1990) ======================
const p24: PlanB = {
  a: 266.18, b: 294.44, trans: { tipo: "cortina", lado: 1 },
  sfx: [[266.3, "whoosh"], [270.0, "crowd", -14, { dur: 6 }], [272.4, "cup", -2], [273.0, "cup", -2], [273.6, "cup", -2], [278.2, "coin", 0], [280.4, "coin", 0], [283.1, "slam", -2], [286.3, "sparkle", -4], [292.4, "whoosh"]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const final = f >= k(292.36);
      if (final) return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "tarde" }} seed={241} mano={2} claves={[mira(0, 300, 640, 1.6), mira(k(294.44), 320, 630, 1.75)]}
          medio={<>
            <Persona look={ROSA} seed={12} luz={RIM.cocina} ruta={[{ f: 0, x: TF_PUNTOS.cocina + 40, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 70, cD: 70, hI: 60, cI: 70 } }]} caras={[{ f: 0, v: "feliz" }]} cartel={{ claves: 1960000, tam: 34, rotulo: "ROSA" }} />
          </>} />
      );
      const tazas = f > k(272.0);
      return (
        <Escena Set={Aula} pal={PAL} setProps={{ tiza: "Kahneman · Knetsch · Thaler, 1990" }} seed={24} mano={2}
          claves={[mira(0, 900, 600, 0.95), mira(k(272.0), 650, 700, 1.7, { curva: "inout" }), mira(k(278.0), 780, 660, 1.6, { curva: "inout" }), mira(k(283.0), 900, 600, 1.1, { curva: "inout" }), mira(k(288.2), 1170, 680, 1.6, { curva: "inout" }), mira(k(292.36), 1170, 680, 1.7)]}
          medio={<>
            {[0, 1, 2, 3].map((i) => {
              const dueño = i % 2 === 0;
              const x = 520 + i * 260;
              return (
                <Persona key={i} look={pasajero(i + 3)} seed={90 + i} luz={RIM.cocina} ruta={[{ f: 0, x, y: AULA_PISO }]} dir={[{ f: 0, v: dueño ? 1 : -1 }]} asiento={[{ f: 0, v: 62 }]}
                  poses={[{ f: 0, v: "sentado" }, { f: k(272), v: dueño ? { hD: 60, cD: 60, pI: 85, rI: -80, pD: 88, rD: -85 } : "sentado" }]} caras={[{ f: 0, v: "neutral" }, { f: k(278.4), v: dueño ? "picaro" : "duda" }]}
                  habla={[[k(278.4) + i * 8, k(281) + i * 8]]}
                  enManoD={dueño && tazas ? <Taza x={0} y={0} color={["#c23a2e", "#2a6fd6"][i / 2]} /> : undefined}
                  carteles={f > k(278.2) ? [{ claves: 0, texto: dueño ? "SELL: $7" : "BUY: $3", tam: 30, icono: "dolar", color: dueño ? VERDE : "#ffc94a", desde: k(278.2) + i * 6 }] : []} />
              );
            })}
          </>}
          hud={<>
            
            <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 86, color: VERDE, opacity: interpolate(f, [k(283.1), k(283.4), k(286), k(286.3)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>SAME MUG.</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 80, color: "#ffc94a", opacity: interpolate(f, [k(286.3), k(286.7)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>THE ENDOWMENT EFFECT</div>
            <FuenteB texto="Kahneman, Knetsch & Thaler, Journal of Political Economy (1990)" desde={k(270)} hasta={k(292)} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 25 · jueves, parada 30: el hombre del abrigo gris vale $0 ======================
const p25: PlanB = {
  a: 294.44, b: 317.48, trans: { tipo: "fundido", d: 14 },
  sfx: [[294.5, "bus_brake", -6], [295.2, "bus_door", -2], [295.8, "step", -4], [296.4, "step", -4], [297.0, "step", -4], [298.6, "drone", -6, { dur: 9 }], [302.9, "boom", -2], [304.1, "glitch", -4], [305.0, "glitch", -4], [308.5, "paper", -2], [311.2, "bus_door", -2], [312.6, "car_door", -6], [315.6, "heart1", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const afuera = f >= k(311.0) && f < k(314.2);
      if (afuera) return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1600, paradas: [{ x: 1500, num: 38 }], autos: 2 }} seed={251} mano={3}
          claves={[mira(k(311), 1500, 740, 1.0), mira(k(314.2), 1800, 740, 1.1)]}
          medio={<>
            <Bus9 x={1250} y={ASH_CARRIL} hora="manana" puertas={1} dir={1} />
            {/* la van blanca sin logo */}
            <g transform={`translate(2150,${ASH_CARRIL - 10})`}><rect x={-260} y={-220} width={520} height={200} rx={26} fill="#eef0ee" /><rect x={160} y={-200} width={90} height={80} rx={14} fill="#8aa4b4" /><rect x={-240} y={-200} width={6} height={180} fill="#d6d9d6" /><circle cx={-160} cy={-14} r={36} fill="#1d1d22" /><circle cx={170} cy={-14} r={36} fill="#1d1d22" /></g>
            <Persona look={ABRIGO} seed={9} luz={RIM.sol} ruta={[{ f: k(311.2), x: 1400, y: ASH_CARRIL - 80 }, { f: k(314.2), x: 1950, y: ASH_CARRIL - 80 }]} caras={[{ f: 0, v: "neutral" }]} cartel={{ claves: 0, tam: 30, parpadeo: 0.5 }} />
          </>} />
      );
      const x9 = ASIENTO_X(9);
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: marchaParadas([[0, k(297.6)], [k(310.8), k(312)]], 14), puertaF: (ff: number) => interpolate(ff, [k(294.8), k(295.2), k(297), k(297.4)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} seed={25} mano={2.5}
          claves={f < k(314.2) ? [mira(0, 760, 620, 1.3), mira(k(298.6), 760, 560, 1.7, { curva: "inout" }), mira(k(302.9), 900, 520, 2.3, { curva: "inout" }), mira(k(306.0), 950, 540, 2.5), mira(k(308.5), x9 - 200, 600, 1.4, { curva: "inout" })] : [mira(k(314.2), ch + 200, 600, 1.0), mira(k(317.48), ch + 600, 620, 0.8, { curva: "inout" })]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "determinado" }, { f: k(302.9), v: "miedo" }, { f: k(314.2), v: "triste" }], giros: [{ f: 0, v: 0 }, { f: k(298.8), v: 0.7 }, { f: k(310), v: 0 }], cartel: { claves: 14000, tam: 28 } })} />
            <Volante />
            {pasajerosBus(k).map((p, i) => <Persona key={i} {...p} cartel={{ ...(p.cartel as any), desde: 0 }} />)}
            {f < k(311.0) && <Persona look={ABRIGO} seed={9} luz={{ lado: 1, color: "#b8c4cc", fuerza: 0.6 }}
              ruta={[{ f: 0, x: 540, y: BP }, { f: k(295.6), x: 540, y: BP }, { f: k(298.2), x: 900, y: BP }, { f: k(305.6), x: 900, y: BP }, { f: k(308.4), x: x9 + 20, y: BP }]}
              opacidad={(ff) => (ff < k(295.4) ? 0 : 1)} dir={[{ f: 0, v: 1 }, { f: k(308.4), v: -1 }]}
              asiento={[{ f: 0, v: undefined }, { f: k(308.4), v: undefined }, { f: k(308.8), v: BUS_PUNTOS.asiento }]}
              poses={[{ f: 0, v: {} }, { f: k(308.8), v: { ...POSE_CELU_SENTADO, hD: 50, cD: 100, cabeza: 14 } }]} caras={[{ f: 0, v: "neutral" }]}
              enManoD={(ff) => ff > k(308.6) ? <rect x={-22} y={-30} width={44} height={60} rx={3} fill="#2a2a2a" /> : null}
              cartel={{ claves: 0, tam: 44, desde: k(302.9), parpadeo: f > k(304.1) ? 0.35 : 0, rotulo: f > k(305.0) ? "ZERO" : undefined }} />}
            {f >= k(314.2) && Array.from({ length: 10 }).map((_, i) => <Persona key={`x${i}`} {...sentadoBus(pasajero(i + 10), ASIENTO_X(1 + i) + 40, { seed: 120 + i })} />)}
          </>}
          hud={f >= k(314.2) ? <div style={{ position: "absolute", right: 110, top: 160, fontFamily: F_HUD, fontWeight: 600, fontSize: 58, color: "#f4efe4", textShadow: "0 3px 10px rgba(0,0,0,0.6)", opacity: interpolate(f, [k(315.6), k(316)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>50 PASSENGERS</div> : <div style={{ position: "absolute", left: 0, right: 0, bottom: 130, textAlign: "center", fontFamily: F_MANO, fontWeight: 700, fontSize: 64, color: "#f4efe4", opacity: interpolate(f, [k(305.96), k(306.3), k(308.2), k(308.48)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>as if no one would notice</div>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 26 · jueves a la noche: la cena con Dee ======================
const p26: PlanB = {
  a: 317.48, b: 336.4, trans: { tipo: "cortina", lado: -1 },
  sfx: [[317.6, "door", -4], [318.4, "step", -2], [319.4, "plates", -6, { dur: 3 }], [321.4, "roll", -2], [324.0, "tick", -6], [326.0, "tick", -6], [330.2, "phone_buzz", -2], [332.5, "phone_buzz", -4], [334.0, "cloth", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const dee = (ff: number) => (ff < k(321.3) ? 2400000 : 2400000 - (ff - k(321.3)) * 37);
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "noche" }} seed={26} mano={2.5}
          claves={[mira(0, 700, 640, 1.2), mira(k(321.3), TF_PUNTOS.mesa, 600, 1.7, { curva: "inout" }), mira(k(327.2), TF_PUNTOS.mesa + 60, 660, 2.0, { curva: "inout" }), mira(k(332.5), TF_PUNTOS.mesa, 660, 1.6, { curva: "inout" }), mira(k(336.4), TF_PUNTOS.mesa, 670, 1.7)]}
          medio={<>
            <Persona look={DEE} seed={34} luz={RIM.cocina} ruta={[{ f: 0, x: 1250, y: P }, { f: k(319.6), x: TF_PUNTOS.sillaOwen + 40, y: P }]} dir={[{ f: 0, v: -1 }]}
              asiento={[{ f: 0, v: undefined }, { f: k(319.6), v: undefined }, { f: k(320.0), v: 60 }]}
              poses={[{ f: 0, v: {} }, { f: k(320.0), v: "sentado" }, { f: k(330.6), v: { ...POSE_CELU_SENTADO } }]} caras={[{ f: 0, v: "cansado" }, { f: k(330.3), v: "feliz" }, { f: k(331), v: "cansado" }]}
              habla={[[k(330.3), k(331.2)]]} enManoD={(ff) => ff > k(330.6) ? <Celular s={0.9} brillo="#7ab8ff" /> : null}
              cartel={{ claves: 0, texto: usd(dee(f)).replace("M", "M"), fmt: undefined, tam: 36, rotulo: "DEE", parpadeo: 0 }} />
            <Persona look={ROSA} seed={12} luz={RIM.cocina} ruta={[{ f: 0, x: TF_PUNTOS.sillaRosa - 160, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 60 }]}
              poses={[{ f: 0, v: "sentado" }, { f: k(332.5), v: { ...POSE_CELU_SENTADO } }]} caras={[{ f: 0, v: "feliz" }, { f: k(332.5), v: "neutral" }]} enManoD={(ff) => ff > k(332.6) ? <Celular s={0.9} brillo="#ffd27a" /> : null} cartel={{ claves: 1960000, tam: 30, rotulo: "ROSA" }} />
            <Persona look={OWEN_CASA} seed={47} luz={RIM.cocina} ruta={[{ f: 0, x: TF_PUNTOS.sillaRosa + 20, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 60 }]}
              poses={[{ f: 0, v: "sentado" }, { f: k(328.4), v: { hD: 40, cD: 50, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(334.0), v: { hD: 10, cD: 20, hI: -30, cI: 20, pI: 85, rI: -80, pD: 88, rD: -85, tronco: 10 } }, { f: k(335.4), v: "sentado" }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(328.4), v: "triste" }, { f: k(334.2), v: "sorpresa" }]} habla={[[k(328.4), k(330.1)]]} cartel={{ claves: 14000, tam: 28 }} />
            <GloboM x={TF_PUNTOS.sillaRosa + 60} y={P - 300} texto={"You okay, Dee?"} desde={k(328.4)} hasta={k(330.2)} tam={26} lado={1} />
            <GloboM x={TF_PUNTOS.sillaOwen + 20} y={P - 310} texto={"I'm fine."} desde={k(330.3)} hasta={k(331.9)} tam={26} lado={-1} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 27 · viernes 5:12: el cartel explota ======================
const p27: PlanB = {
  a: 336.4, b: 355.62, trans: { tipo: "luz", d: 14 },
  sfx: [[336.5, "tick", 0], [337.4, "water", -8, { dur: 1.5 }], [338.1, "riser", -4, { dur: 3.4 }], [341.6, "boom", 0], [341.7, "roll", 0, { dur: 3 }], [346.2, "slam", 0], [348.2, "gasp", -2], [350.5, "heart", -6, { dur: 4 }]],
  el: (k) => (
    <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false }} seed={27} mano={2}
      claves={[mira(0, 1000, 120, 2.0), mira(k(338.0), 1100, 50, 3.4, { curva: "inout" }), mira(k(341.6), 1110, 20, 4.2, { resorte: { damping: 8, stiffness: 180 } }), mira(k(348.2), 1110, 40, 3.6, { curva: "inout" }), mira(k(355.62), 1110, 30, 3.9)]}
      medio={<Reflejo><Persona {...owenEspejo(k, [{ claves: [{ f: 0, v: 14000 }, { f: k(341.66), v: 4700, d: 6 }, { f: k(342.4), v: 4700000, d: 90 }], fmt: (v: number) => "$" + Math.round(v).toLocaleString("en-US"), tam: 30 }], [{ f: 0, v: "cansado" }, { f: k(341.6), v: "sorpresa" }, { f: k(348.2), v: "miedo" }, { f: k(353.9), v: "duda" }])} /></Reflejo>}
      hud={<div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 62, color: "#f4efe4", opacity: interpolate(useF(), [k(348.1), k(348.5), k(355.3), k(355.6)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 3px 12px rgba(0,0,0,0.7)" }}>× 1,000</div>} />
  ),
};

// ====================== 28 · el mensaje de la Dr. Hale; 43/47 ======================
const p28: PlanB = {
  a: 355.62, b: 367.38, trans: { tipo: "corte" },
  sfx: [[355.7, "phone_buzz", 0], [356.4, "phone_buzz", -2], [357.0, "type", -8, { dur: 6 }], [365.86, "glitch", 0], [366.0, "slam", -2]],
  el: (k) => (
    <AbsoluteFill style={{ background: "linear-gradient(#2a2232, #120e16)" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, rgba(122,184,255,0.25), rgba(0,0,0,0) 55%)" }} />
      <CeluMensaje de="HALDEN CLINIC · DR. IMANI HALE" lineas={["Week 4 complete, participant 47.", "You're doing better than expected."]} desde={0} escribe={k(359.5)} vibra={2} esc={1.05} />
    </AbsoluteFill>
  ),
};

// ====================== 29-30 · el bus de las pantallas y el gancho a ob05 ======================
const p29: PlanB = {
  a: 367.38, b: 394.4, trans: { tipo: "fundido", d: 14 },
  sfx: [[367.4, "bus_engine", -12, { dur: 12 }], [370.8, "whoosh"], [372.2, "drone", -6, { dur: 7 }], [374.4, "glitch", -6], [376.0, "glitch", -6], [377.4, "glitch", -4], [379.5, "riser", -4, { dur: 3 }], [382.6, "tick", 0], [382.9, "tick", 0], [383.2, "tick", 0], [386.2, "boom", -4], [388.0, "pop", 0], [390.8, "ding", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const relojes = f >= k(379.48);
      const flick = f > k(374.0) && !relojes;
      const horas = ["2h 10m", "4h 02m", "1h 31m", "6h 44m", "3h 15m", "5h 20m", "2h 48m", "7h 05m", "0h 52m", "3h 33m", "4h 41m"];
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "tarde", avance: (ff: number) => ff * 13 }} seed={29} mano={2.5}
          claves={[mira(0, ch + 100, 600, 1.8), mira(k(371.8), 1500, 600, 0.68, { curva: "inout" }), mira(k(379.4), 1700, 600, 0.72), mira(k(381.4), 1250, 640, 1.45, { curva: "inout" }), mira(k(387.6), 1900, 640, 1.45, { curva: "inout" }), mira(k(394.4), 1500, 600, 1.1, { curva: "inout" })]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "duda" }, { f: k(372.2), v: "miedo" }], giros: [{ f: 0, v: 0 }, { f: k(368.4), v: 0.9 }], cartel: { claves: 4700000, tam: 28 } })} />
            <Volante />
            {Array.from({ length: 11 }).map((_, i) => {
              const v = 20000 + ((i * 7919) % 900) * 1000;
              return <Persona key={i} {...sentadoBus(pasajero(i + 1), ASIENTO_X(1 + i), { seed: 200 + i, poses: [{ f: 0, v: POSE_CELU_SENTADO }], enManoD: <Celular s={0.9} brillo="#7ab8ff" /> })}
                carteles={[relojes ? { claves: 0, icono: "reloj", texto: horas[i], tam: 30, desde: k(379.6) + i * 3 } : { claves: v, tam: 28, parpadeo: flick ? 0.5 + 0.04 * i : 0 }]} />;
            })}
          </>}
          hud={<>
            <div style={{ position: "absolute", right: 100, top: 150, fontFamily: F_HUD, fontWeight: 600, fontSize: 54, color: "#f4efe4", opacity: interpolate(f, [k(370.8), k(371.2), k(378.6), k(379.2)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>50 PASSENGERS · 50 SCREENS</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 64, color: "#f4efe4", WebkitTextStroke: "2px #0b1820", opacity: interpolate(f, [k(379.6), k(380)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 3px 14px rgba(0,0,0,0.7)" }}>NEXT WEEK: SCREEN TIME</div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 44, color: "#f4efe4", opacity: interpolate(f, [k(387.5), k(388)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>WHAT NUMBER WOULD FLOAT OVER YOUR HEAD?  ·  SUBSCRIBE</div>
          </>} />
      );
    };
    return <Pl />;
  },
};

export const PLANOS_OB04: PlanB[] = [p01, p01b, p03, p04, p05, p06, p07, p09, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29];
export const OB04 = armar(PLANOS_OB04);

// reloj del día (minutos desde medianoche) por tramo de la voz; null = sin reloj (pizarras)
const HORAS: [number, number | null][] = [[0, 3 * 60 + 40], [6.6, null], [9.58, 5 * 60 + 12], [28.02, null], [31.52, 5 * 60 + 31], [42.44, 6 * 60 + 2], [58.66, null], [64, 6 * 60 + 10], [68.22, null], [111.64, 6 * 60 + 4], [127.78, 6 * 60 + 7], [135.84, 6 * 60 + 10], [162.28, null], [193.22, 21 * 60 + 40], [203.6, null], [216, 17 * 60 + 40], [221.46, null], [234.7, 17 * 60 + 52], [248.44, 10 * 60 + 15], [261.6, 22 * 60 + 5], [266.18, null], [292.36, 18 * 60 + 30], [294.44, 6 * 60 + 10], [317.48, 19 * 60 + 30], [336.4, 5 * 60 + 12], [355.62, null], [367.38, 15 * 60 + 40]];
const horaEn = (s: number) => { let h: number | null = null; for (const [t, v] of HORAS) if (s >= t) h = v; return h; };

export const Ob04: React.FC = () => {
  const f = useCurrentFrame();
  const h = horaEn(f / 30);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Montaje planos={OB04.planos} />
      <HudSerie part={[{ f: 0, v: 44 }, { f: Math.round(365.86 * 30), v: 43 }]} hora={h} />
    </AbsoluteFill>
  );
};
