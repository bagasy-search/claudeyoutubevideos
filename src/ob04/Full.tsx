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
  sfx: [[0.2, "tick", -4], [0.6, "step", -6], [1.2, "step", -6], [1.9, "cloth"], [2.2, "paper", 2], [3.6, "cloth", -6], [4.6, "boom", -6], [5.4, "paper", 4]],
  el: (k) => (
    <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "noche", luzCocina: false, luzBaño: false }} seed={1} mano={3}
      claves={[mira(0, 700, 650, 2.6), mira(k(3.0), 740, 650, 3.3, { curva: "inout" }), mira(k(6.6), 760, 660, 4.0, { curva: "in" })]}
      medio={<>
        {/* el delantal de Rosa colgado del gancho, al lado de la heladera */}
        <g transform={`translate(${TF_PUNTOS.heladera - 190},${P - 520})`}><circle r={8} fill="#8a6a4a" /><path d="M-40,10 h80 l20,190 h-120 Z" fill="#efe4cf" /><rect x={-26} y={110} width={52} height={40} rx={4} fill="#e2d4b8" /></g>
        {/* Owen entra al cuadro, saca la factura del delantal, la lee, se frota los ojos y la arruga */}
        <Persona look={OWEN_CASA} seed={47} luz={RIM.noche}
          ruta={[{ f: 0, x: 600, y: P }, { f: k(1.6), x: TF_PUNTOS.heladera - 280, y: P }]}
          poses={[{ f: 0, v: {} }, { f: k(1.8), v: { hD: 80, cD: 30 } }, { f: k(2.6), v: { hD: 40, cD: 110, cabeza: 10 } }, { f: k(3.6), v: { hD: 46, cD: 120, hI: 150, cI: 40, cabeza: 14 } }, { f: k(4.4), v: { hD: 40, cD: 110, cabeza: 10 } }, { f: k(5.4), v: { hD: 70, cD: 150, cabeza: -4 } }]}
          caras={[{ f: 0, v: "cansado" }, { f: k(4.6), v: "sorpresa" }, { f: k(5.6), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(2.4), v: { x: 0.5, y: 0.6 } }]}
          enManoD={(f) => f > k(2.0) ? <g transform="rotate(180)"><Factura x={0} y={0} s={f > k(5.4) ? 0.15 : 0.24} rot={f > k(5.4) ? 25 : -10} /></g> : null} />
      </>}
      hud={<>
        <div style={{ position: "absolute", left: 110, bottom: 130, fontFamily: F_HUD, fontWeight: 700, fontSize: 70, color: "#fff", background: "rgba(20,16,24,0.82)", padding: "10px 30px", borderRadius: 14, opacity: interpolate(useF(), [0, 8, k(3.0), k(3.4)], [0, 1, 1, 0], { extrapolateRight: "clamp" }) }}>3 NIGHTS · <span style={{ color: "#ff8a5a" }}>0 SLEEP</span></div>
      </>}
    />
  ),
};
// la factura en primer plano: sale del bolsillo del delantal y la cifra rueda hasta $31,412
const p01b: PlanB = {
  a: 6.6, b: 7.9, trans: { tipo: "barrido", d: 10 },
  sfx: [[6.62, "whoosh"], [6.75, "paper", 2], [7.0, "roll", -2], [7.6, "slam", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const sube = interpolate(f, [0, 12], [260, 0], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
      const n = Math.round(interpolate(f, [k(6.9), k(7.55)], [0, 31412], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      const z = interpolate(f, [0, k(7.9)], [1.0, 1.12]);
      const sello = interpolate(f, [k(7.55), k(7.75)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <AbsoluteFill style={{ background: "#efe4cf" }}>
          <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", transform: `scale(${z})` }}>
            {/* tela del delantal con costuras */}
            {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={0} y={i * 80} width={1920} height={2} fill="#e0d2b6" />)}
            <g transform={`translate(960,${440 + sube})`}><Factura x={0} y={0} s={2.25} rot={-4} monto={`$${n.toLocaleString("en-US")}.00`} sello={sello} /></g>
            {/* bolsillo del delantal por delante */}
            <path d="M560,900 h800 l-30,220 h-740 Z" fill="#e2d4b8" stroke="#c9b48e" strokeWidth={4} strokeDasharray="14 10" />
            <path d="M560,900 h800" stroke="#b39a70" strokeWidth={8} />
          </svg>
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};
// «everybody has a price»: cuatro vecinos en la parada, cada uno en lo suyo, y las etiquetas aparecen de a una
const p01c: PlanB = {
  a: 7.9, b: 9.58, trans: { tipo: "corte" },
  sfx: [[7.95, "pop"], [8.3, "pop"], [8.65, "pop"], [9.0, "pop"], [8.1, "sip", -8]],
  el: (k) => {
    const gente: PersonaP[] = [
      parado(SENORA, 760, ASH_PISO, { cartel: tag(310000), dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { hD: 70, cD: 120 } }, { f: k(8.6), v: { hD: 60, cD: 140 } }], enManoD: () => <g transform="scale(0.5)"><Taza /></g> }),
      parado(OBRERO, 1080, ASH_PISO, { cartel: tag(180000), dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "brazosCruzados" }, { f: k(8.9), v: { hD: 160, cD: 30, hI: 160, cI: 30 } }], caras: [{ f: 0, v: "cansado" }] }),
      parado(ESTUDIANTE, 1400, ASH_PISO, { cartel: tag(52000), poses: [{ f: 0, v: "celular" }] }),
      parado(SCRUBS, 1720, ASH_PISO, { cartel: tag(1400000), dir: [{ f: 0, v: -1 }], ruta: [{ f: 0, x: 1860, y: ASH_PISO }, { f: k(9.2), x: 1720, y: ASH_PISO }] }),
    ];
    return (
      <Escena Set={Ashland} pal={PAL} setProps={{ hora: "alba", centro: () => 1240, paradas: [{ x: 1000, num: 12, refugio: true }] }} seed={2} mano={3}
        claves={[mira(0, 1240, 560, 1.45), mira(k(9.58), 1250, 540, 1.55)]}
        medio={<>{gente.map((g, i) => <Persona key={i} {...g} cartel={{ ...(g.cartel as any), desde: k(7.95 + i * 0.35) }} />)}</>} />
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
// cepillo de dientes en la mano (espuma opcional)
const Cepillo: React.FC<{ espuma?: boolean }> = ({ espuma }) => (
  <g transform="rotate(-80)"><rect x={-5} y={-8} width={10} height={78} rx={4} fill="#3aa0d8" /><rect x={-7} y={60} width={14} height={20} rx={3} fill="#f4f7fa" />{espuma && <circle cx={0} cy={84} r={9} fill="#fff" opacity={0.9} />}</g>
);
// pose de cepillarse: la mano va y viene rápido junto a la boca
const cepillar = (k: K, desde: number, hasta: number) => {
  const out: { f: number; v: any }[] = [];
  for (let t = desde, i = 0; t < hasta; t += 0.16, i++) out.push({ f: k(t), v: { hD: i % 2 ? 62 : 54, cD: i % 2 ? 148 : 158 } });
  return out;
};
// 5:12: suena el despertador, Owen lo apaga de un manotazo y arrastra los pies hasta el baño
const p03: PlanB = {
  a: 9.58, b: 12.0, trans: { tipo: "fundido", d: 12 },
  sfx: [[9.6, "beep", -2], [9.9, "beep", -2], [10.2, "beep", -2], [10.5, "slam", -6], [11.0, "step", -8], [11.5, "step", -8]],
  el: (k) => (
    <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false }} seed={3} mano={2.5}
      claves={[mira(0, 520, A - 150, 2.3), mira(k(10.6), 560, A - 150, 2.3), mira(k(12.0), 820, A - 160, 2.1, { curva: "inout" })]}
      medio={<Persona look={OWEN_CASA} seed={47} luz={RIM.alba} ruta={[{ f: 0, x: 560, y: A }, { f: k(10.7), x: 560, y: A }, { f: k(12.0), x: 860, y: A }]} dir={[{ f: 0, v: -1 }, { f: k(10.6), v: 1 }]}
        poses={[{ f: 0, v: { hD: 30, cD: 40 } }, { f: k(10.2), v: { hD: 120, cD: 20 } }, { f: k(10.5), v: { hD: 40, cD: 10, cabeza: 12 } }, { f: k(10.8), v: {} }]}
        caras={[{ f: 0, v: "cansado" }]} />}
      hud={<div style={{ position: "absolute", left: 110, bottom: 130, fontFamily: F_HUD, fontWeight: 700, fontSize: 72, color: "#fff", background: "rgba(20,16,24,0.82)", padding: "10px 30px", borderRadius: 14 }}>MONDAY · <span style={{ color: "#ff5a4a" }}>5:12 AM</span></div>}
    />
  ),
};
// se cepilla los dientes medio dormido; el reflejo hace lo mismo
const p03b: PlanB = {
  a: 12.0, b: 15.0, trans: { tipo: "corte" },
  sfx: [[12.0, "water", -6, { dur: 1.2 }], [12.3, "brush", -2, { dur: 2.6 }]],
  el: (k) => (
    <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false }} seed={3} mano={2}
      claves={[mira(0, 1020, A - 240, 2.9), mira(k(15.0), 1035, A - 250, 3.2)]}
      medio={<>
        <Reflejo><Persona {...owenEspejo(k, [], [{ f: 0, v: "cansado" }])} poses={cepillar(k, 12.0, 15.0)} enManoD={<Cepillo espuma />} /></Reflejo>
        <Persona look={OWEN_CASA} seed={47} luz={RIM.alba} ruta={[{ f: 0, x: 980, y: A }]} dir={[{ f: 0, v: 1 }]} poses={cepillar(k, 12.0, 15.0)} enManoD={<Cepillo espuma />} caras={[{ f: 0, v: "cansado" }]} />
      </>}
    />
  ),
};
// en el espejo el cartel cambia: no es una batería, no es un cerebro: es un signo de dólar
const p03c: PlanB = {
  a: 15.0, b: 19.48, trans: { tipo: "corte" },
  sfx: [[15.0, "glitch", -4], [15.7, "fail", -8], [16.12, "whoosh"], [16.8, "fail", -8], [17.18, "whoosh"], [18.22, "slam", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const i = f < k(16.12) ? "bateria" : f < k(17.18) ? "cerebro" : "dolar";
      const tx = i === "bateria" ? "100%" : i === "cerebro" ? "IQ" : "$";
      const no = (f > k(15.7) && f < k(16.12)) || (f > k(16.8) && f < k(17.18));
      const rot = i === "dolar" ? 0 : Math.sin(f / 2) * (no ? 3 : 0);
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false }} seed={3} mano={1.5}
          claves={[mira(0, 1090, A - 330, 3.0), mira(k(18.2), 1100, A - 335, 3.5, { curva: "inout" }), mira(k(19.48), 1104, A - 338, 3.7)]}
          medio={<>
            <Reflejo>
              <Persona {...owenEspejo(k, [{ claves: 0, texto: tx, icono: i, tam: 34, fmt: () => "" }], [{ f: 0, v: "cansado" }, { f: k(15.2), v: "sorpresa" }, { f: k(18.3), v: "duda" }])}
                poses={[...cepillar(k, 15.0, 15.4), { f: k(15.5), v: { hD: 30, cD: 60 } }]} enManoD={(ff: number) => ff < k(15.5) ? <Cepillo espuma /> : null} />
            </Reflejo>
            <Persona look={OWEN_CASA} seed={47} luz={RIM.alba} ruta={[{ f: 0, x: 980, y: A }]} dir={[{ f: 0, v: 1 }]} poses={[...cepillar(k, 15.0, 15.4), { f: k(15.5), v: { hD: 20, cD: 60 } }]} caras={[{ f: 0, v: "cansado" }, { f: k(15.2), v: "sorpresa" }]} />
          </>}
          hud={f < k(15.6) ? null : <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center" }}><span style={{ fontFamily: F_HUD, fontWeight: 800, fontSize: 80, color: no ? "#ff6a5a" : i === "dolar" ? VERDE : "#fff", background: "rgba(20,16,24,0.85)", padding: "8px 34px", borderRadius: 14, display: "inline-block", transform: `rotate(${rot}deg)` }}>
            {i === "bateria" ? "NOT A BATTERY" : i === "cerebro" ? "NOT A BRAIN" : "A DOLLAR SIGN"}
          </span></div>}
        />
      );
    };
    return <Pl />;
  },
};
// $4,700 rueda en el espejo: se le cae el cepillo de la boca
const p04: PlanB = {
  a: 19.48, b: 24.74, trans: { tipo: "corte" },
  sfx: [[19.5, "roll", 0], [21.0, "drop", -4], [21.3, "plastic", -6], [22.4, "ding", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba", luzCocina: false }} seed={4} mano={1.5}
          claves={[mira(0, 1040, A - 320, 2.8), mira(k(22.4), 1060, A - 325, 3.2, { curva: "inout" }), mira(k(24.74), 1070, A - 328, 3.4)]}
          medio={<>
            <Reflejo><Persona {...owenEspejo(k, [{ claves: [{ f: 0, v: 0 }, { f: k(19.8), v: 4700, d: 60 }], tam: 34 }], [{ f: 0, v: "sorpresa" }, { f: k(23.0), v: "determinado" }])} poses={[{ f: 0, v: { hD: 30, cD: 60 } }, { f: k(21), v: { hD: 10, cD: 10 } }]} /></Reflejo>
            <Persona look={OWEN_CASA} seed={47} luz={RIM.alba} ruta={[{ f: 0, x: 980, y: A }, { f: k(22.2), x: 960, y: A }]} dir={[{ f: 0, v: 1 }]} enManoD={(ff: number) => ff < k(20.9) ? <Cepillo espuma /> : null}
              poses={[{ f: 0, v: { hD: 20, cD: 60 } }, { f: k(21), v: { hD: 10, cD: 10 } }, { f: k(23), v: { hD: 150, cD: 40, hI: 150, cI: 40 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(23.0), v: "determinado" }]} />
            {/* el cepillo cae al lavabo */}
            {f >= k(20.9) && <g transform={`translate(1040,${interpolate(f, [k(20.9), k(21.3)], [A - 200, A - 110], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}) rotate(${interpolate(f, [k(20.9), k(21.3)], [-80, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`}><rect x={-5} y={-8} width={10} height={78} rx={4} fill="#3aa0d8" /></g>}
          </>}
          hud={<div style={{ position: "absolute", left: 110, bottom: 130, fontFamily: F_HUD, fontWeight: 700, fontSize: 64, color: "#fff", background: "rgba(20,16,24,0.82)", padding: "10px 30px", borderRadius: 14, opacity: interpolate(f, [k(22.4), k(22.7)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>HE KNOWS THAT NUMBER.</div>}
        />
      );
    };
    return <Pl />;
  },
};
// el formulario de la clínica en primer plano: el resaltador marca $4,700 y la firma de Owen
const p04b: PlanB = {
  a: 24.74, b: 28.02, trans: { tipo: "barrido", d: 10 },
  sfx: [[24.76, "whoosh"], [25.0, "paper", 0], [25.6, "marker", -2, { dur: 0.8 }], [26.6, "write", -4, { dur: 1.0 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const z = interpolate(f, [0, k(28.02)], [1.0, 1.1]);
      const marca = interpolate(f, [k(25.6), k(26.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const firma = interpolate(f, [k(26.6), k(27.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const entra = interpolate(f, [0, 10], [120, 0], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
      return (
        <AbsoluteFill style={{ background: "#dfe6ea" }}>
          <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", transform: `scale(${z})` }}>
            <g transform={`translate(960,${540 + entra}) rotate(-2) scale(0.86)`}>
              <rect x={-520} y={-470} width={1040} height={960} rx={10} fill="#fbfbf8" stroke="#c9ced6" strokeWidth={4} />
              <text x={0} y={-380} fontFamily={F_HUD} fontWeight={800} fontSize={64} fill="#1f3fa8" textAnchor="middle">HALDEN CLINIC</text>
              <text x={0} y={-320} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#6a7280" textAnchor="middle">CLINICAL TRIAL HC-12 · PARTICIPANT 47</text>
              {Array.from({ length: 4 }).map((_, i) => <rect key={i} x={-440} y={-250 + i * 40} width={i % 2 ? 640 : 880} height={14} rx={6} fill="#dde1e6" />)}
              <text x={-440} y={20} fontFamily={F_HUD} fontWeight={700} fontSize={56} fill="#20242c">COMPENSATION</text>
              <text x={440} y={20} fontFamily={F_HUD} fontWeight={800} fontSize={84} fill="#20242c" textAnchor="end">$4,700</text>
              <ellipse cx={300} cy={-8} rx={200} ry={74} fill="none" stroke="#e8c020" strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - marca} transform="rotate(-4 300 -8)" />
              {Array.from({ length: 3 }).map((_, i) => <rect key={i} x={-440} y={90 + i * 40} width={i % 2 ? 700 : 880} height={14} rx={6} fill="#dde1e6" />)}
              <rect x={-440} y={360} width={600} height={4} fill="#20242c" />
              <text x={-440} y={410} fontFamily={F_HUD} fontSize={30} fill="#6a7280">SIGNATURE · O. MARSH</text>
              <path d="M-420,350 q40,-80 80,-6 q30,54 66,-24 q40,-66 66,12 q30,42 90,-18" stroke="#1f3fa8" strokeWidth={8} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - firma} strokeLinecap="round" />
            </g>
          </svg>
        </AbsoluteFill>
      );
    };
    return <Pl />;
  },
};
/// Week 4 en la sala de espera de Halden: las sillas vacías y la tablet que marca 44 / 47
const p05: PlanB = {
  a: 28.02, b: 31.52, trans: { tipo: "luz", d: 10, color: "#d8fff2" },
  sfx: [[28.05, "slam", -2], [28.84, "beep", -4], [30.26, "slam", -2], [30.6, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const sillas = [880, 1000, 1120, 1240, 1360];
      // la tercera silla queda vacía cuando aparece «44 STILL IN»: la persona se levanta y se va
      const sale = interpolate(f, [k(30.3), k(31.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const looks = [SCRUBS, ESTUDIANTE, OBRERO, SENORA, RUNNER];
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "manana", tablet: f < k(30.26) ? "45 / 47" : "44 / 47" }} seed={5} mano={2}
          claves={[mira(0, 1120, HAL_PISO - 220, 1.8), mira(k(31.52), 1130, HAL_PISO - 230, 2.0)]}
          medio={<>{sillas.map((x, i) => i === 2
            ? <Persona key={i} {...parado(looks[i], x + sale * 700, HAL_PISO)} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "sentado" }, { f: k(30.3), v: {} }]} asiento={[{ f: 0, v: 0.22 }, { f: k(30.3), v: 0 }]} caras={[{ f: 0, v: "cansado" }, { f: k(30.3), v: "triste" }]} />
            : <Persona key={i} {...parado(looks[i], x, HAL_PISO)} poses={[{ f: 0, v: "sentado" }]} asiento={[{ f: 0, v: 0.22 }]} miradas={[{ f: 0, v: { x: 0, y: 0.4 } }, { f: k(30.4), v: { x: i < 2 ? 1 : -1, y: 0 } }]} caras={[{ f: 0, v: "cansado" }]} />)}</>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", gap: 24 }}>
            {[{ t: "WEEK 4", d: 0, c: "#fff" }, { t: "PARTICIPANT 47", d: k(28.84), c: VERDE }, { t: "44 STILL IN", d: k(30.26), c: "#ff8a5a" }].map((l, i) => {
              const s = interpolate(f, [l.d, l.d + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return <div key={i} style={{ fontFamily: F_HUD, fontWeight: 800, fontSize: 64, color: l.c, background: "rgba(14,26,32,0.88)", padding: "10px 28px", borderRadius: 14, opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${0.8 + 0.2 * s})` }}>{l.t}</div>;
            })}
          </div>}
        />
      );
    };
    return <Pl />;
  },
};

// ====================== 6 · Rosa con la bata y el café: $1,960,000; la tostada se quema ======================
const ROSA_BATA = { ...ROSA, accesorios: [...(ROSA.accesorios ?? []).filter((a: any) => a.t !== "delantal")], camisa: "#c9667a" };
const rosaCartel = (k: K, desde: number) => ({ claves: [{ f: 0, v: 0 }, { f: k(34.3), v: 1960000, d: 80 }], fmt: (v: number) => "$" + Math.round(v).toLocaleString("en-US"), tam: 66, rotulo: "ROSA", desde });
// Rosa sirve el café en bata, tarareando
const p06: PlanB = {
  a: 31.52, b: 34.2, trans: { tipo: "fundido", d: 10 },
  sfx: [[31.6, "step", -6], [32.0, "cup", -4], [32.4, "pour", -4, { dur: 1.6 }]],
  el: (k) => (
    <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba" }} seed={6} mano={2}
      claves={[mira(0, TF_PUNTOS.cocina + 80, P - 300, 2.6), mira(k(34.2), TF_PUNTOS.cocina + 100, P - 320, 2.8)]}
      medio={<Persona look={ROSA_BATA} seed={12} luz={RIM.cocina}
        ruta={[{ f: 0, x: TF_PUNTOS.cocina - 60, y: P }, { f: k(32.2), x: TF_PUNTOS.cocina + 40, y: P }]}
        poses={[{ f: 0, v: {} }, { f: k(32.2), v: { hD: 70, cD: 60, hI: 40, cI: 70 } }, { f: k(33.0), v: { hD: 80, cD: 40, hI: 40, cI: 70, cabeza: 6 } }, { f: k(33.8), v: { hD: 70, cD: 60, hI: 40, cI: 70, cabeza: -4 } }]}
        caras={[{ f: 0, v: "feliz" }]} enManoD={(ff) => <Taza x={0} y={0} vapor={ff > k(33) ? 1 : 0} f={ff} />} />}
    />
  ),
};
// el cartel de Rosa crece hasta no entrar en el cuadro; ella le habla a Owen con las manos
const p06b: PlanB = {
  a: 34.2, b: 38.5, trans: { tipo: "corte" },
  sfx: [[34.3, "roll", 0], [36.8, "ding", -6], [37.4, "laugh", -10]],
  el: (k) => (
    <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba" }} seed={6} mano={2}
      claves={[mira(0, TF_PUNTOS.cocina + 140, P - 330, 2.4), mira(k(36.5), TF_PUNTOS.cocina + 150, P - 350, 2.15, { curva: "inout" }), mira(k(38.5), TF_PUNTOS.cocina + 150, P - 350, 2.1)]}
      medio={<Persona look={ROSA_BATA} seed={12} luz={RIM.cocina} ruta={[{ f: 0, x: TF_PUNTOS.cocina + 40, y: P }]}
        poses={[{ f: 0, v: { hD: 40, cD: 110 } }, { f: k(35.0), v: { hD: 60, cD: 120, hI: 120, cI: 30 } }, { f: k(35.8), v: { hD: 40, cD: 110, hI: 140, cI: 20, cabeza: 6 } }, { f: k(36.6), v: { hD: 60, cD: 120, hI: 110, cI: 40, cabeza: -4 } }, { f: k(37.4), v: { hD: 40, cD: 110, hI: 30, cI: 30 } }]}
        caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} enManoD={(ff) => <Taza x={0} y={0} vapor={1} f={ff} />}
        cartel={rosaCartel(k, 0)} />}
    />
  ),
};
// Owen se queda mirando el cartel; al lado la tostadora humea y las tostadas saltan negras
const p06c: PlanB = {
  a: 38.5, b: 42.44, trans: { tipo: "corte" },
  sfx: [[38.6, "toaster", -6], [39.8, "fire", -10, { dur: 1.8 }], [41.6, "pop", 0], [41.75, "gasp", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const humo = interpolate(f, [k(38.6), k(40.6)], [0.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const salto = interpolate(f, [k(41.5), k(41.65), k(41.95)], [0, 1, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba" }} seed={6} mano={1.5}
          claves={[mira(0, TF_PUNTOS.sillaOwen + 20, P - 300, 2.5), mira(k(41.4), TF_PUNTOS.sillaOwen + 30, P - 310, 2.9, { curva: "inout" }), mira(k(42.44), TF_PUNTOS.sillaOwen + 30, P - 300, 2.7)]}
          medio={<>
            <Tostadora x={TF_PUNTOS.sillaOwen - 120} y={P - 200} humo={humo} salto={salto} f={f} quemada={humo} />
            <Persona look={OWEN_CASA} seed={47} luz={RIM.cocina} ruta={[{ f: 0, x: TF_PUNTOS.sillaOwen + 120, y: P }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 10, cD: 20, cabeza: -10, tronco: -4 } }, { f: k(41.6), v: "manosCara" }]}
              caras={[{ f: 0, v: "sorpresa" }, { f: k(41.6), v: "miedo" }]} miradas={[{ f: 0, v: { x: -0.8, y: -0.8 } }, { f: k(41.6), v: { x: -1, y: 0.4 } }]} />
          </>}
          hud={<div style={{ position: "absolute", right: 110, bottom: 130, fontFamily: F_HUD, fontWeight: 700, fontSize: 60, color: "#fff", background: "rgba(20,16,24,0.82)", padding: "10px 30px", borderRadius: 14, opacity: interpolate(f, [k(39.4), k(39.7)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>HE STARES SO LONG…</div>}
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
  a: 42.44, b: 46.2, trans: { tipo: "barrido", d: 10 },
  sfx: [[42.5, "bus_engine", -10, { dur: 3.8 }], [42.8, "murmur", -12, { dur: 3.2 }], [43.0, "pop", -2], [43.5, "pop", -2], [44.0, "pop", -2], [44.6, "laugh", -10]],
  el: (k) => (
    <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: (f: number) => f * 14 }} seed={7} mano={2.5}
      claves={[mira(0, ASIENTO_X(3) + 40, 600, 1.55), mira(k(46.2), ASIENTO_X(4), 600, 1.75)]}
      medio={<>{pasajerosBus(k, {
        1: { habla: [[k(42.6), k(43.8)], [k(44.8), k(45.8)]], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "feliz" }], cartel: { claves: 210000, tam: 34, desde: k(43.0) } },
        3: { habla: [[k(43.9), k(44.7)]], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "neutral" }, { f: k(44.6), v: "risa" }], cartel: { claves: 160000, tam: 34, desde: k(43.5) } },
        5: { cartel: { claves: 38000, tam: 34, desde: k(44.0) } },
      }).map((p, i) => <Persona key={i} {...p} />)}</>}
      hud={<div style={{ position: "absolute", left: 110, bottom: 130, fontFamily: F_HUD, fontWeight: 700, fontSize: 64, color: "#fff", background: "rgba(20,16,24,0.85)", padding: "10px 30px", borderRadius: 14, opacity: interpolate(useF(), [k(44.9), k(45.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>IT&apos;S <span style={{ color: "#ff6a5a" }}>NOT</span> WHAT THEY EARN</div>}
    />
  ),
};
const p07b: PlanB = {
  a: 46.2, b: 52.76, trans: { tipo: "corte" },
  sfx: [[46.25, "bus_engine", -12, { dur: 6.4 }], [46.3, "bus_brake", -6], [47.0, "bus_door", -2], [47.6, "step", 0], [48.1, "step", 0], [48.6, "step", 0], [50.6, "roll", -2], [51.4, "fail", -8]],
  el: (k) => {
    const av = marchaParadas([[k(46.4), k(50.0)]], 14);
    const pf = (f: number) => interpolate(f, [k(46.8), k(47.2), k(49.6), k(50)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: av, puertaF: pf }} seed={7} mano={2.5}
        claves={[mira(0, 640, 640, 1.5), mira(k(48.4), 700, 650, 1.7, { curva: "inout" }), mira(k(52.76), 760, 640, 1.85)]}
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
        claves={[mira(0, x5 + 40, 620, 1.8), mira(k(55.0), x5 + 60, 610, 2.1, { curva: "inout" }), mira(k(58.66), x5 + 60, 610, 2.25)]}
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
        hud={<div style={{ position: "absolute", left: 1300, top: 500, fontFamily: F_HUD, fontWeight: 800, fontSize: 64, color: VERDE, background: "rgba(14,26,32,0.85)", padding: "4px 20px", borderRadius: 12, opacity: interpolate(useF(), [k(56), k(56.3), k(58.2), k(58.6)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateY(${-interpolate(useF(), [k(56), k(58.6)], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`, textShadow: "0 0 20px rgba(125,255,106,0.6)" }}>+$1,000</div>}
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
  sfx: [[58.7, "whoosh_big", -2], [59.5, "stamp", -2], [60.4, "pop", 0], [60.9, "pop", 0], [61.4, "pop", 0], [61.9, "pop", 0], [62.4, "pop", 0], [63.2, "slam", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      // el banco a la izquierda se tacha; a la derecha la chica del bus, y de su cartel salen las cosas que hace por los demás
      const banco = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" });
      const tacha = interpolate(f, [k(59.5), k(59.75)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const corre = interpolate(f, [k(60.0), k(60.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) });
      const px = 1240, py = 860;
      return (
        <Escena Set={Pizarra} pal={PAL} seed={10} mano={2} claves={[mira(0, 960, 540, 1.0), mira(k(64), 990, 540, 1.06)]}
          medio={<>
            {/* banco */}
            <g opacity={banco * (1 - corre * 0.75)} transform={`translate(${420 - corre * 120},560) scale(${1 - corre * 0.35})`}>
              <path d="M-210,-120 L0,-230 L210,-120 Z" fill="#c9d6dc" />
              {[-150, -75, 0, 75, 150].map((x) => <rect key={x} x={x - 18} y={-110} width={36} height={220} rx={6} fill="#e6eef2" />)}
              <rect x={-230} y={110} width={460} height={34} rx={6} fill="#c9d6dc" />
              <text x={0} y={-140} fontFamily={F_HUD} fontWeight={800} fontSize={44} fill="#0b1820" textAnchor="middle">BANK</text>
              <g opacity={tacha} transform={`scale(${1.6 - 0.6 * tacha})`}><path d="M-200,-200 L200,180 M200,-200 L-200,180" stroke="#ff5a4a" strokeWidth={30} strokeLinecap="round" /></g>
            </g>
            <text x={420} y={800} fontFamily={F_HUD} fontWeight={700} fontSize={50} fill="#ff8a7a" textAnchor="middle" opacity={tacha * (1 - corre)}>NOT MONEY IN THE BANK</text>
            {/* la chica: sonríe y saluda */}
            <Persona look={TEEN} seed={33} ruta={[{ f: 0, x: px, y: py }]} escala={1.25} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: {} }, { f: k(60.2), v: { hD: 150, cD: 30 } }, { f: k(60.8), v: { hD: 130, cD: 60 } }, { f: k(61.4), v: { hD: 150, cD: 30 } }, { f: k(62.0), v: { hD: 130, cD: 60 } }, { f: k(62.6), v: {} }]}
              caras={[{ f: 0, v: "feliz" }]} cartel={{ claves: 41000, tam: 50 }} />
            {ICONOS_REEMPLAZO.map((ic, i) => {
              const t0 = k(60.3 + i * 0.5);
              const t = interpolate(f, [t0, t0 + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (u) => 1 - Math.pow(1 - u, 3) });
              const ang = Math.PI * (1.05 + i * 0.22);
              const x = px + Math.cos(ang) * 470, y = 470 + Math.sin(ang) * 300 + 140;
              const lat = 1 + Math.max(0, Math.sin((f - t0) / 5)) * 0.06 * (t >= 1 ? 1 : 0);
              return (
                <g key={i} opacity={t}>
                  <path d={`M${px},${py - 300} L${x},${y}`} stroke={ic.c} strokeWidth={4} strokeDasharray="10 10" opacity={0.6} />
                  <g transform={`translate(${px + (x - px) * t},${py - 300 + (y - py + 300) * t}) scale(${(0.4 + 0.6 * t) * lat})`}>
                    <circle r={80} fill="#0b1820" stroke={ic.c} strokeWidth={8} />
                    <g transform="scale(1.8)"><path d={ic.d} fill="none" stroke={ic.c} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></g>
                    <text y={-100} fontFamily={F_HUD} fontWeight={700} fontSize={40} fill={ic.c} textAnchor="middle" letterSpacing={3}>{ic.t}</text>
                  </g>
                </g>
              );
            })}
          </>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center", opacity: interpolate(f, [k(63.0), k(63.25)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <span style={{ fontFamily: F_HUD, fontWeight: 800, fontSize: 60, color: "#fff", background: "rgba(14,26,32,0.9)", padding: "10px 30px", borderRadius: 14 }}>= WHAT IT WOULD COST <span style={{ color: VERDE }}>TO REPLACE HER</span></span>
          </div>} />
      );
    };
    return <Pl />;
  },
};
// re-gancho: el bus frena de golpe en la parada 30 al amanecer
const p11: PlanB = {
  a: 64.0, b: 68.22, trans: { tipo: "fundido", d: 14 },
  sfx: [[64.0, "riser", -2, { dur: 4.2 }], [64.2, "bus_engine", -8, { dur: 2.4 }], [66.4, "bus_brake", 0], [66.75, "slam", -4], [67.6, "heart1", -2]],
  el: (k) => {
    const bx = (f: number) => interpolate(f, [0, k(66.7)], [-900, 1200], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 1.6) });
    const Pl: React.FC = () => {
      const f = useF();
      // cabeceo del frenazo: se inclina hacia adelante y rebota
      const cab = f < k(66.6) ? 0 : Math.sin((f - k(66.6)) / 3) * 2.2 * Math.exp(-(f - k(66.6)) / 9);
      const x = bx(f);
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "alba", centro: () => 1500, paradas: [{ x: 1800, num: 30, refugio: true }] }} seed={11} mano={3}
          claves={[mira(0, 1300, 600, 0.8), mira(k(66.6), 1800, 720, 1.05, { curva: "inout" }), mira(k(68.2), 2060, 820, 1.7, { curva: "in" })]}
          medio={<g transform={`rotate(${cab} ${x + 300} ${ASH_CARRIL})`}><Bus9 x={x} y={ASH_CARRIL} hora="alba" rueda={x * 0.7} dir={1} gente={0.6} /></g>}
          hud={<div style={{ position: "absolute", left: 110, top: 170, opacity: interpolate(f, [k(65.2), k(65.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <span style={{ fontFamily: F_HUD, fontWeight: 800, fontSize: 72, color: VERDE, letterSpacing: 6, background: "rgba(14,26,32,0.88)", padding: "8px 34px", borderRadius: 14 }}>STOP 30</span>
          </div>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 12 · cómo se le pone precio a una vida: el VSL ======================
// ruta con camiones (reutilizada en los planos del VSL)
const Ruta: React.FC<{ f: number; y: number; vel?: number; peligro?: number; defensas?: number; tono?: string }> = ({ f, y, vel = 9, peligro = 0, defensas = 0, tono = "#3a3d44" }) => {
  const camion = (i: number) => ((f * (vel + i * 2) + i * 870) % 2700) - 400;
  return (
    <g>
      <rect x={-800} y={y} width={3600} height={200} fill={tono} />
      {Array.from({ length: 20 }).map((_, i) => <rect key={i} x={-760 + i * 200 - (f * vel) % 200} y={y + 94} width={110} height={12} fill="#e8d45a" />)}
      {peligro > 0 && [300, 900, 1500].map((x, i) => <path key={i} d={`M${x},${y + 40} l40,30 l-20,30 l50,40`} stroke="#1d1d22" strokeWidth={8} fill="none" opacity={peligro} />)}
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${camion(i)},${y + 70 + (i % 2) * 80})`}>
          <rect x={-140} y={-110} width={200} height={110} rx={8} fill={["#e9e4d8", "#c23a2e"][i]} />
          <rect x={60} y={-80} width={80} height={80} rx={10} fill={["#2a5a9a", "#3a3f46"][i]} />
          <rect x={86} y={-70} width={44} height={32} rx={6} fill="#bfe0f2" />
          {[-100, 20, 100].map((x) => <circle key={x} cx={x} cy={4} r={20} fill="#1d1d22" />)}
        </g>
      ))}
      {Array.from({ length: defensas }).map((_, i) => <g key={i}><rect x={-200 + i * 200} y={y - 60} width={190} height={22} rx={6} fill="#c9ced2" stroke="#7a8288" strokeWidth={4} /><rect x={-120 + i * 200} y={y - 60} width={14} height={62} fill="#7a8288" /></g>)}
    </g>
  );
};
const rotuloB = (f: number, desde: number, t: React.ReactNode, extra: React.CSSProperties = {}) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", opacity: interpolate(f, [desde, desde + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
    <span style={{ fontFamily: F_HUD, fontWeight: 800, fontSize: 62, color: "#fff", background: "rgba(11,24,32,0.9)", padding: "10px 32px", borderRadius: 14, ...extra }}>{t}</span>
  </div>
);
// la balanza: una persona en un platillo y fajos que caen del otro hasta que la balanza se inclina
const p12: PlanB = {
  a: 68.22, b: 74.1, trans: { tipo: "fundido", d: 10 },
  sfx: [[68.3, "whoosh"], [69.6, "cash", -4], [70.4, "cash", -4], [71.2, "cash", -4], [72.0, "cash", -4], [72.8, "cash", -2], [73.2, "creak", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const fajos = Math.floor(interpolate(f, [k(69.5), k(73.0)], [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      const inc = interpolate(fajos, [0, 6], [-12, 8]) + Math.sin(f / 6) * 0.8;
      const rad = (inc * Math.PI) / 180;
      const izq = { x: 960 - Math.cos(rad) * 360, y: 560 - Math.sin(rad) * 360 }, der = { x: 960 + Math.cos(rad) * 360, y: 560 + Math.sin(rad) * 360 };
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#14222c", luz: "#ffc94a" }} seed={12} mano={1.5}
          claves={[mira(0, 960, 600, 1.2), mira(k(74.1), 960, 620, 1.32)]}
          medio={<>
            <path d="M960,560 L900,900 L1020,900 Z" fill="#e9e3d6" />
            <g transform={`rotate(${inc} 960 560)`}><rect x={600} y={554} width={720} height={12} rx={6} fill="#e9e3d6" /></g>
            {[izq, der].map((p, i) => <g key={i}><path d={`M${p.x},${p.y} L${p.x - 110},${p.y + 160} M${p.x},${p.y} L${p.x + 110},${p.y + 160}`} stroke="#e9e3d6" strokeWidth={4} /><rect x={p.x - 130} y={p.y + 156} width={260} height={14} rx={7} fill="#e9e3d6" /></g>)}
            <Persona look={OFICINISTA} seed={14} ruta={[{ f: 0, x: izq.x, y: izq.y + 156 }]} escala={0.75} poses={[{ f: 0, v: { hD: 30, cD: 30 } }, { f: k(72.6), v: "celebrar" }]} caras={[{ f: 0, v: "neutral" }, { f: k(72.6), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }]} />
            {Array.from({ length: fajos }).map((_, i) => {
              const t0 = k(69.5 + i * 0.6);
              const cae = interpolate(f, [t0, t0 + 6], [-300, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return <rect key={i} x={der.x - 70 + (i % 2) * 14} y={der.y + 128 - i * 24 + cae} width={130} height={22} rx={4} fill="#7dff6a" stroke="#2a6a2a" strokeWidth={3} />;
            })}
          </>}
          hud={rotuloB(f, k(68.6), <>HOW DO YOU PRICE A <span style={{ color: "#ffc94a" }}>HUMAN LIFE?</span></>)} />
      );
    };
    return <Pl />;
  },
};
// la decisión del gobierno: ¿ruta más segura o regla nueva para camiones?
const p12b: PlanB = {
  a: 74.1, b: 80.0, trans: { tipo: "corte" },
  sfx: [[74.2, "truck", -6, { dur: 5 }], [76.6, "pop"], [78.4, "pop"], [79.4, "stamp", 0]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const sello = interpolate(f, [k(79.4), k(79.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#14222c", luz: "#ffc94a" }} seed={12} mano={2}
          claves={[mira(0, 960, 620, 1.15), mira(k(80), 960, 640, 1.3)]}
          medio={<>
            <Ruta f={f} y={780} />
            {/* el funcionario con la tablilla mira la ruta y decide */}
            <Persona look={OFICINISTA} seed={14} ruta={[{ f: 0, x: 960, y: 740 }]} escala={1.1}
              poses={[{ f: 0, v: { hD: 60, cD: 100 } }, { f: k(76.6), v: { hD: 60, cD: 100, hI: 150, cI: 20 } }, { f: k(77.6), v: { hD: 60, cD: 100 } }, { f: k(78.4), v: { hD: 150, cD: 20, hI: 40, cI: 100 } }, { f: k(79.3), v: { hD: 60, cD: 100 } }]}
              caras={[{ f: 0, v: "duda" }, { f: k(79.4), v: "determinado" }]} miradas={[{ f: 0, v: { x: -1, y: -0.3 } }, { f: k(78.4), v: { x: 1, y: -0.3 } }, { f: k(79.3), v: { x: 0, y: 0 } }]} />
            {[["SAFER HIGHWAY?", 76.6, 520], ["NEW RULE FOR TRUCKS?", 78.4, 1400]].map(([t, s, x], i) => <g key={i} opacity={interpolate(f, [k(s as number), k(s as number) + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} transform={`translate(${x},450)`}><rect x={-270} y={-56} width={540} height={112} rx={56} fill="#0b1820" stroke="#f4efe4" strokeWidth={5} /><text y={16} fontFamily={F_HUD} fontWeight={700} fontSize={44} fill="#f4efe4" textAnchor="middle">{t as string}</text></g>)}
          </>}
          hud={sello > 0 ? <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}><span style={{ display: "inline-block", fontFamily: F_HUD, fontWeight: 800, fontSize: 62, color: "#ffc94a", border: "6px solid #ffc94a", background: "rgba(11,24,32,0.92)", padding: "8px 30px", borderRadius: 14, transform: `rotate(-3deg) scale(${1.5 - 0.5 * sello})`, opacity: sello }}>VALUE OF A STATISTICAL LIFE</span></div> : null} />
      );
    };
    return <Pl />;
  },
};
// no es lo que valés como persona: es cuánto se gasta para evitar UNA muerte → $13,000,000
const p12c: PlanB = {
  a: 80.0, b: 90.0, trans: { tipo: "barrido", d: 10 },
  sfx: [[80.4, "pop"], [81.6, "fail", -6], [83.6, "pop"], [84.4, "heart1", -4], [86.8, "slam", 0], [87.0, "roll", -2, { dur: 1.6 }], [88.6, "cash", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const tacha = interpolate(f, [k(81.6), k(81.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const fase2 = interpolate(f, [k(83.4), k(83.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const fase3 = interpolate(f, [k(86.5), k(86.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const n = Math.round(interpolate(f, [k(86.8), k(88.4)], [0, 13], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      const pila = Math.floor(interpolate(f, [k(86.8), k(89.4)], [0, 13], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#14222c", luz: "#ffc94a" }} seed={13} mano={1.5}
          claves={[mira(0, 960, 540, 1.0), mira(k(86.6), 960, 540, 1.04), mira(k(90), 960, 540, 1.1)]}
          medio={<>
            {/* fase 1: «lo que valés» tachado */}
            <g opacity={1 - fase2}>
              <Persona look={ESTUDIANTE} seed={16} ruta={[{ f: 0, x: 960, y: 820 }]} escala={1.3} poses={[{ f: 0, v: { hD: 150, cD: 30, hI: 150, cI: 30 } }]} caras={[{ f: 0, v: "feliz" }, { f: k(81.6), v: "triste" }]} />
              <text x={960} y={330} fontFamily={F_HUD} fontWeight={800} fontSize={70} fill="#f4efe4" textAnchor="middle">WHAT YOU&apos;RE WORTH</text>
              <path d="M560,310 L1360,310" stroke="#ff5a4a" strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tacha} />
            </g>
            {/* fase 2: una sola persona salvada de un camión */}
            <g opacity={fase2 * (1 - fase3)}>
              <Ruta f={f} y={760} vel={6} />
              <Persona look={ESTUDIANTE} seed={16} ruta={[{ f: 0, x: 1100, y: 740 }, { f: k(84.4), x: 1100, y: 740 }, { f: k(85.0), x: 900, y: 720 }]} escala={1.0} poses={[{ f: 0, v: "celular" }, { f: k(84.4), v: "celebrar" }]} caras={[{ f: 0, v: "neutral" }, { f: k(84.4), v: "miedo" }]} />
              <text x={960} y={330} fontFamily={F_HUD} fontWeight={800} fontSize={64} fill="#f4efe4" textAnchor="middle">TO PREVENT <tspan fill="#ffc94a">ONE</tspan> DEATH</text>
            </g>
            {/* fase 3: la cifra del DOT con la pila de fajos que sube */}
            <g opacity={fase3}>
              {Array.from({ length: pila }).map((_, i) => <rect key={i} x={760 + (i % 2) * 16} y={900 - i * 26} width={400} height={24} rx={5} fill="#7dff6a" stroke="#2a6a2a" strokeWidth={3} />)}
              <text x={960} y={330} fontFamily={F_HUD} fontWeight={800} fontSize={150} fill="#ffc94a" textAnchor="middle">${n},000,000</text>
              <text x={960} y={400} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#e9e3d6" textAnchor="middle" letterSpacing={4}>U.S. DEPARTMENT OF TRANSPORTATION</text>
            </g>
          </>}
          hud={<FuenteB texto="U.S. DOT, value of a statistical life guidance (≈$13M, 2024)" desde={k(86.8)} hasta={k(90)} />} />
      );
    };
    return <Pl />;
  },
};
// ese número decide qué ruta tiene defensas y cuál sigue siendo peligrosa
const p12d: PlanB = {
  a: 90.0, b: 94.62, trans: { tipo: "corte" },
  sfx: [[90.6, "metal", 0], [91.2, "metal", 0], [91.8, "metal", 0], [92.4, "metal", 0], [93.0, "skid", -4], [93.5, "fail", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const defensas = Math.floor(interpolate(f, [k(90.5), k(92.6)], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#14222c", luz: "#ffc94a" }} seed={14} mano={2}
          claves={[mira(0, 960, 640, 0.95), mira(k(94.62), 960, 650, 1.02)]}
          medio={<>
            <Ruta f={f} y={470} defensas={defensas} />
            <Ruta f={f + 400} y={800} peligro={interpolate(f, [k(92.8), k(93.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} tono="#2e3036" />
            <g transform="translate(1700,440)" opacity={interpolate(f, [k(92.4), k(92.7)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}><circle r={56} fill="#2a8a4a" /><path d="M-26,0 l18,20 l34,-40" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" /></g>
            <g transform="translate(1700,770)" opacity={interpolate(f, [k(93.4), k(93.7)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}><path d="M0,-60 L60,50 L-60,50 Z" fill="#ffc94a" stroke="#1d1d22" strokeWidth={6} /><text y={36} fontFamily={F_HUD} fontWeight={800} fontSize={64} fill="#1d1d22" textAnchor="middle">!</text></g>
          </>}
          hud={<>
            <div style={{ position: "absolute", left: 110, top: 160, fontFamily: F_HUD, fontWeight: 800, fontSize: 50, color: "#7dff6a", background: "rgba(11,24,32,0.9)", padding: "6px 24px", borderRadius: 12, opacity: interpolate(f, [k(90.6), k(90.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>GUARDRAILS GET BUILT</div>
            <div style={{ position: "absolute", left: 110, bottom: 120, fontFamily: F_HUD, fontWeight: 800, fontSize: 50, color: "#ff8a7a", background: "rgba(11,24,32,0.9)", padding: "6px 24px", borderRadius: 12, opacity: interpolate(f, [k(93.2), k(93.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>…OR THE ROAD STAYS DANGEROUS</div>
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 13 · el cuerpo desarmado en frascos: unos pocos dólares ======================
const FRASCOS = [{ s: "C", n: "CARBON", c: "#5a5a5a", p: "$0.03", t: 99.4 }, { s: "Ca", n: "CALCIUM", c: "#f4f1e6", p: "$2.40", t: 100.2 }, { s: "Fe", n: "IRON", c: "#c96a3a", p: "$0.01", t: 101.0 }, { s: "O", n: "OXYGEN", c: "#9fdcff", p: "$0.01", t: 101.8 }];
const TICKET = [["CALCIUM", "2.40"], ["PHOSPHORUS", "1.60"], ["POTASSIUM", "0.70"], ["CARBON", "0.03"], ["IRON", "0.01"], ["OXYGEN", "0.01"]];
const cajaTxt = (o: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: F_HUD, fontWeight: 800, fontSize: 60, color: "#fff", background: "rgba(10,18,40,0.9)", padding: "10px 30px", borderRadius: 14, opacity: o, ...extra });
// Owen en el anillo de escaneo: el cuerpo se le desarma en elementos que salen volando
const p13: PlanB = {
  a: 94.62, b: 99.0, trans: { tipo: "barrido", d: 10 },
  sfx: [[94.7, "whoosh"], [95.2, "scan", -6, { dur: 1.6 }], [96.9, "sparkle", -2], [97.3, "whoosh", -4], [97.9, "pop", -2], [98.3, "pop", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const ox = 900;
      const brillo = interpolate(f, [k(96.6), k(97.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <Escena Set={Lab} pal={PAL} seed={13} mano={2}
          claves={[mira(0, ox, LAB_PISO - 250, 1.75), mira(k(97.0), ox + 120, LAB_PISO - 260, 1.45, { curva: "inout" }), mira(k(99.0), ox + 260, LAB_PISO - 270, 1.3)]}
          medio={<>
            <ellipse cx={ox} cy={LAB_PISO} rx={200} ry={36} fill="none" stroke="#7dff6a" strokeWidth={5} opacity={0.8} />
            <rect x={ox - 150} y={LAB_PISO - 40 - ((f * 7) % 380)} width={300} height={5} fill="#7dff6a" opacity={0.6} />
            <Persona look={OWEN} seed={47} luz={RIM.verde} ruta={[{ f: 0, x: ox, y: LAB_PISO }]}
              poses={[{ f: 0, v: {} }, { f: k(95.6), v: { hD: 70, cD: 70, hI: 60, cI: 70, cabeza: 14 } }, { f: k(97.4), v: { hD: 60, cD: 20, hI: 50, cI: 20, tronco: -6, cabeza: -6 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(95.6), v: "duda" }, { f: k(97.3), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0, y: 0 } }, { f: k(95.6), v: { x: 0.3, y: 1 } }, { f: k(97.4), v: { x: 1, y: -0.2 } }]}
              opacidad={(ff) => 1 - 0.35 * interpolate(ff, [k(96.6), k(97.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            <ellipse cx={ox} cy={LAB_PISO - 170} rx={110} ry={210} fill="#7dff6a" opacity={brillo * 0.22 * (0.8 + 0.2 * Math.sin(f / 3))} />
            {/* los elementos salen del cuerpo hacia la derecha, uno por uno */}
            {Array.from({ length: 16 }).map((_, i) => {
              const fr = FRASCOS[i % 4];
              const t0 = k(97.0 + i * 0.1);
              const t = interpolate(f, [t0, t0 + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (u) => 1 - Math.pow(1 - u, 2) });
              if (t <= 0) return null;
              const y0 = LAB_PISO - 60 - (i * 37) % 300;
              const x = ox + t * (700 + (i % 3) * 90), y = y0 - Math.sin(t * Math.PI) * (60 + (i % 4) * 25);
              return (
                <g key={i} transform={`translate(${x},${y}) scale(${0.6 + 0.4 * t})`}>
                  <circle r={34} fill={fr.c} stroke="#0a1230" strokeWidth={4} />
                  <text y={12} fontFamily={F_HUD} fontWeight={800} fontSize={32} fill={fr.s === "C" ? "#fff" : "#0a1230"} textAnchor="middle">{fr.s}</text>
                </g>
              );
            })}
          </>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center" }}>
            <span style={cajaTxt(interpolate(f, [k(95.4), k(95.7)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}>A BODY, TAKEN APART <span style={{ color: "#ffc94a" }}>AND SOLD?</span></span>
          </div>} />
      );
    };
    return <Pl />;
  },
};
// la laboratorista va frasco por frasco: carbono, calcio, hierro, oxígeno, justo cuando la voz los nombra
const p13b: PlanB = {
  a: 99.0, b: 104.4, trans: { tipo: "corte" },
  sfx: [[99.4, "pour", -4, { dur: 0.6 }], [100.2, "pour", -4, { dur: 0.6 }], [101.0, "pour", -4, { dur: 0.6 }], [101.8, "pour", -4, { dur: 0.6 }], [102.7, "pop", 0], [102.9, "pop", 0], [103.1, "pop", 0], [103.3, "pop", 0]],
  el: (k) => {
    const XS = [560, 860, 1160, 1460];
    const Pl: React.FC = () => {
      const f = useF();
      // dónde está la laboratorista: al lado del frasco que se nombra
      const ruta = FRASCOS.flatMap((fr, i) => [{ f: k(fr.t - 0.45), x: XS[i] - 175, y: LAB_PISO }, { f: k(fr.t + 0.35), x: XS[i] - 175, y: LAB_PISO }]);
      const actual = FRASCOS.reduce((a, fr, i) => (f >= k(fr.t - 0.45) ? i : a), 0);
      const vertiendo = (i: number) => f >= k(FRASCOS[i].t) && f < k(FRASCOS[i].t + 0.6);
      return (
        <Escena Set={Lab} pal={PAL} seed={131} mano={1.5}
          claves={[mira(0, 1010, 620, 1.05), mira(k(104.4), 1010, 600, 1.12)]}
          medio={<>
            {FRASCOS.map((fr, i) => {
              const lleno = interpolate(f, [k(fr.t), k(fr.t + 0.6)], [0, 0.78], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const x = XS[i];
              return (
                <g key={i} transform={`translate(${x},${LAB_PISO})`}>
                  <rect x={-105} y={-290} width={210} height={290} rx={26} fill="#e9f4f6" opacity={0.18} stroke="#cfe6ea" strokeWidth={6} />
                  <rect x={-96} y={-284 + 278 * (1 - lleno)} width={192} height={278 * lleno} rx={20} fill={fr.c} opacity={0.92} />
                  <rect x={-80} y={-322} width={160} height={36} rx={8} fill="#5a6066" />
                  <rect x={-78} y={-200} width={156} height={110} rx={10} fill="#f6f1e4" />
                  <text y={-128} fontFamily={F_HUD} fontWeight={800} fontSize={64} fill="#1d2a34" textAnchor="middle">{fr.s}</text>
                  <text y={-98} fontFamily={F_HUD} fontWeight={700} fontSize={22} fill="#1d2a34" textAnchor="middle" letterSpacing={2}>{fr.n}</text>
                  {vertiendo(i) && <path d={`M${-120},${-360} Q${-70},${-330} ${-40},${-284 + 278 * (1 - lleno)}`} stroke={fr.c} strokeWidth={12} fill="none" strokeLinecap="round" />}
                  <CartelM x={0} y={-350} claves={0} texto={fr.p} tam={44} f={f} desde={k(102.7 + i * 0.2)} />
                </g>
              );
            })}
            <Persona look={SCRUBS} seed={21} luz={RIM.verde} ruta={[{ f: 0, x: XS[0] - 175, y: LAB_PISO }, ...ruta, { f: k(102.9), x: XS[3] + 200, y: LAB_PISO }]} escala={1.25} dir={[{ f: 0, v: 1 }, { f: k(102.9), v: -1 }]}
              poses={[{ f: 0, v: {} }, ...FRASCOS.flatMap((fr) => [{ f: k(fr.t - 0.1), v: { hD: 120, cD: 30, tronco: 8 } }, { f: k(fr.t + 0.6), v: { hD: 40, cD: 50 } }]), { f: k(102.4), v: {} }, { f: k(103.0), v: "señalar" }]}
              caras={[{ f: 0, v: "determinado" }, { f: k(102.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.5 } }]}
              enManoD={(ff) => ff < k(102.6) ? <g transform={`rotate(${vertiendo(actual) ? 70 : 0})`}><rect x={-18} y={-40} width={36} height={52} rx={6} fill="#e9f4f6" opacity={0.6} stroke="#cfe6ea" strokeWidth={3} /><rect x={-15} y={-14} width={30} height={24} rx={4} fill={FRASCOS[actual].c} /></g> : null} />
          </>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center" }}>
            <span style={cajaTxt(interpolate(f, [k(102.5), k(102.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}>SOLD AS <span style={{ color: "#ffc94a" }}>RAW ELEMENTS</span></span>
          </div>} />
      );
    };
    return <Pl />;
  },
};
// el ticket se imprime renglón por renglón y suma: $4.76; abajo, la franja "unos dólares ↔ unos cientos"
const p13c: PlanB = {
  a: 104.4, b: 109.3, trans: { tipo: "corte" },
  sfx: [[104.5, "printer", -4, { dur: 1.8 }], [106.4, "cash", 0], [107.6, "stamp", -2], [108.0, "sad", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const imp = interpolate(f, [k(104.5), k(106.2)], [0, TICKET.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const tot = interpolate(f, [k(106.3), k(106.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const rango = interpolate(f, [k(106.6), k(107.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const sello = interpolate(f, [k(107.6), k(107.75)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const alto = 140 + Math.min(imp, TICKET.length) * 62 + tot * 110;
      return (
        <Escena Set={Lab} pal={PAL} seed={132} mano={1.2}
          claves={[mira(0, 960, 540, 1.0), mira(k(109.3), 960, 540, 1.06)]}
          medio={<>
            <g transform="translate(700,170)">
              <rect x={-260} y={0} width={520} height={alto} fill="#f6f1e4" />
              <path d={`M-260,${alto} ${Array.from({ length: 14 }).map((_, i) => `l${520 / 28},14 l${520 / 28},-14`).join(" ")}`} fill="#f6f1e4" />
              <text x={0} y={70} fontFamily={F_HUD} fontWeight={800} fontSize={40} fill="#1d2a34" textAnchor="middle" letterSpacing={4}>1 HUMAN BODY</text>
              <line x1={-220} x2={220} y1={100} y2={100} stroke="#1d2a34" strokeWidth={3} strokeDasharray="8 8" />
              {TICKET.map(([n, p], i) => i < imp && (
                <g key={i}><text x={-220} y={150 + i * 62} fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#1d2a34">{n}</text>
                  <text x={220} y={150 + i * 62} fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#1d2a34" textAnchor="end">${p}</text></g>
              ))}
              <g opacity={tot}>
                <line x1={-220} x2={220} y1={140 + TICKET.length * 62} y2={140 + TICKET.length * 62} stroke="#1d2a34" strokeWidth={4} />
                <text x={-220} y={210 + TICKET.length * 62} fontFamily={F_HUD} fontWeight={800} fontSize={52} fill="#1d2a34">TOTAL</text>
                <text x={220} y={210 + TICKET.length * 62} fontFamily={F_HUD} fontWeight={800} fontSize={52} fill="#c23a2e" textAnchor="end">$4.75</text>
              </g>
              <g opacity={sello} transform={`translate(30,330) rotate(-14) scale(${1.8 - 0.8 * sello})`}>
                <rect x={-230} y={-60} width={460} height={110} rx={14} fill="none" stroke="#c23a2e" strokeWidth={10} />
                <text y={22} fontFamily={F_HUD} fontWeight={800} fontSize={64} fill="#c23a2e" textAnchor="middle" letterSpacing={4}>CHEAP STUFF</text>
              </g>
            </g>
            {/* Owen mira el ticket y se encoge */}
            <Persona look={OWEN} seed={47} luz={RIM.verde} ruta={[{ f: 0, x: 1460, y: LAB_PISO - 40 }]} escala={1.7} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: "brazosCruzados" }, { f: k(106.4), v: { hD: 60, cD: 120, cabeza: 8 } }, { f: k(107.7), v: "encogerse" }]}
              caras={[{ f: 0, v: "duda" }, { f: k(106.4), v: "sorpresa" }, { f: k(107.7), v: "triste" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }]} />
            <g opacity={rango} transform="translate(1330,190)">
              <text x={-240} y={0} fontFamily={F_HUD} fontWeight={800} fontSize={44} fill="#7dff6a" textAnchor="middle">A FEW $</text>
              <text x={240} y={0} fontFamily={F_HUD} fontWeight={800} fontSize={44} fill="#ffc94a" textAnchor="middle">A FEW $100</text>
              <path d={`M-240,40 H${-240 + 480 * rango}`} stroke="#ffc94a" strokeWidth={10} strokeLinecap="round" />
              <circle cx={-240} cy={40} r={14} fill="#7dff6a" /><circle cx={-240 + 480 * rango} cy={40} r={14} fill="#ffc94a" />
            </g>
          </>}
          hud={<FuenteB texto="Estimates of the human body's elemental value (various chemistry sources)" desde={k(104.6)} hasta={k(109.2)} />} />
      );
    };
    return <Pl />;
  },
};
// lo caro es lo que hacés con eso: a una señora se le cae la bolsa y Owen la levanta y se la da
const p13d: PlanB = {
  a: 109.3, b: 111.64, trans: { tipo: "luz", d: 8, color: "#fff2c8" },
  sfx: [[109.5, "drop", -2], [109.6, "apples", -6], [110.2, "step", -4], [110.9, "paper", -2], [111.2, "sparkle", -4]],
  el: (k) => {
    const X = 1000;
    const Pl: React.FC = () => {
      const f = useF();
      const cae = interpolate(f, [k(109.4), k(109.65)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const levanta = f >= k(110.35);
      const brillo = interpolate(f, [k(110.9), k(111.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const bolsa = <g><path d="M-30,-60 L30,-60 L36,20 L-36,20 Z" fill="#c9a26a" stroke="#8a6a3a" strokeWidth={3} /><circle cx={-12} cy={-66} r={12} fill="#d8443a" /><circle cx={12} cy={-64} r={10} fill="#7dc24a" /></g>;
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => X, autos: 2 }} seed={133} mano={2}
          claves={[mira(0, X, ASH_PISO - 230, 2.0), mira(k(111.64), X + 20, ASH_PISO - 240, 2.25)]}
          medio={<>
            <Halo x={X} y={ASH_PISO - 200} r={420} color="#ffd98a" fuerza={brillo * 0.6} />
            <Persona look={SENORA} seed={31} luz={RIM.sol} ruta={[{ f: 0, x: X - 260, y: ASH_PISO }, { f: k(109.6), x: X - 200, y: ASH_PISO }]}
              poses={[{ f: 0, v: { hD: 20, cD: 30 } }, { f: k(109.6), v: "manosCara" }, { f: k(110.8), v: { hD: 60, cD: 40, hI: 50, cI: 40 } }]}
              caras={[{ f: 0, v: "cansado" }, { f: k(109.6), v: "sorpresa" }, { f: k(110.9), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(109.6), v: { x: 0.5, y: 1 } }, { f: k(110.6), v: { x: 1, y: 0 } }]}
              enManoD={(ff) => (ff < k(109.4) || ff > k(110.9) ? bolsa : null)} />
            {f >= k(109.4) && !levanta && <g transform={`translate(${X - 120 + cae * 80},${ASH_PISO - 60 + cae * 40}) rotate(${cae * 70})`}>{bolsa}</g>}
            {f >= k(109.5) && !levanta && [0, 1, 2].map((i) => <circle key={i} cx={X - 20 + i * 50 + cae * i * 20} cy={ASH_PISO - 10} r={13} fill={i === 1 ? "#7dc24a" : "#d8443a"} />)}
            <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: X + 300, y: ASH_PISO }, { f: k(110.1), x: X + 60, y: ASH_PISO }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: {} }, { f: k(110.1), v: "agacharse" }, { f: k(110.6), v: { hD: 80, cD: 10, tronco: 6 } }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(110.1), v: "determinado" }, { f: k(110.8), v: "feliz" }]}
              enManoD={(ff) => (ff >= k(110.35) && ff <= k(110.9) ? bolsa : null)} />
          </>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center" }}>
            <span style={cajaTxt(interpolate(f, [k(109.9), k(110.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}>THE EXPENSIVE PART: <span style={{ color: "#ffc94a" }}>WHAT YOU DO WITH IT</span></span>
          </div>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 14 · parada 4: el señor Abernathy ======================
const ABER_BUFANDA = { ...ABERNATHY, accesorios: [...(ABERNATHY.accesorios ?? []), { t: "bufanda" as const, color: "#c23a2e" }] } as typeof ABERNATHY;
const libro = <g><path d="M-46,-30 L0,-22 L46,-30 L46,26 L0,34 L-46,26 Z" fill="#f05a3a" stroke="#8a2a1a" strokeWidth={3} /><path d="M-40,-24 L-4,-17 L-4,26 L-40,20 Z" fill="#fff6e0" /><path d="M40,-24 L4,-17 L4,26 L40,20 Z" fill="#fff6e0" /><circle cx={-22} cy={2} r={9} fill="#ffc94a" /><path d="M12,14 l10,-16 l10,16 Z" fill="#7dc24a" /></g>;
const pala = <g><line x1={0} y1={-10} x2={0} y2={130} stroke="#8a6a3a" strokeWidth={8} strokeLinecap="round" /><path d="M-34,124 h68 l-6,50 h-56 Z" fill="#c9d6dc" stroke="#5a6066" strokeWidth={3} /></g>;
const diario = <g><rect x={-44} y={-58} width={88} height={112} rx={3} fill="#efeae0" stroke="#bdb6a8" strokeWidth={2} />{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-36} y={-44 + i * 16} width={i === 0 ? 72 : 30 + (i % 3) * 12} height={i === 0 ? 10 : 6} fill="#8a8478" />)}</g>;
// sube en la parada 4 y se sienta en el asiento 4, como siempre
const p14: PlanB = {
  a: 111.64, b: 115.9, trans: { tipo: "luz", d: 12 },
  sfx: [[111.7, "bus_brake", -6], [112.3, "bus_door", -2], [112.9, "step", -2], [113.5, "step", -2], [114.1, "step", -2], [115.0, "chair", -6]],
  el: (k) => {
    const x4 = ASIENTO_X(4);
    const pf = (f: number) => interpolate(f, [k(111.9), k(112.3), k(114.2), k(114.6)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: marchaParadas([[0, k(114.6)]], 14), puertaF: pf }} seed={14} mano={2}
          claves={[mira(0, 640, 600, 1.55), mira(k(113.0), 640, 600, 1.6), mira(k(115.0), x4 - 140, 600, 1.75, { curva: "inout" }), mira(k(115.9), x4 - 120, 600, 1.85)]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "neutral" }, { f: k(112.8), v: "feliz" }], giros: [{ f: 0, v: 0 }, { f: k(112.6), v: 0.6 }, { f: k(114), v: 0 }] })} />
            <Volante />
            {pasajerosBus(k, { 5: { cartel: undefined } }).filter((_, i) => i !== 2).map((p, i) => <Persona key={i} {...p} />)}
            <Persona look={ABER_BUFANDA} seed={4} luz={RIM.tubo}
              ruta={[{ f: 0, x: 560, y: BP }, { f: k(112.6), x: 560, y: BP }, { f: k(114.8), x: x4, y: BP }]} opacidad={(ff) => (ff < k(112.4) ? 0 : 1)}
              asiento={[{ f: 0, v: undefined }, { f: k(114.8), v: undefined }, { f: k(115.3), v: BUS_PUNTOS.asiento }]} dir={[{ f: 0, v: 1 }, { f: k(114.9), v: -1 }]}
              poses={[{ f: 0, v: {} }, { f: k(112.7), v: { hD: 120, cD: 40 } }, { f: k(113.3), v: {} }, { f: k(115.3), v: "sentado" }]}
              caras={[{ f: 0, v: "feliz" }]} giros={[{ f: 0, v: 0 }, { f: k(112.7), v: -0.5 }, { f: k(113.4), v: 0 }]} enManoD={diario} />
          </>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", opacity: interpolate(f, [k(112.0), k(112.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <span style={cajaTxt(1)}>STOP 4 · <span style={{ color: VERDE }}>SEAT 4, LIKE ALWAYS</span></span>
          </div>} />
      );
    };
    return <Pl />;
  },
};
// primer plano: su cartel sube a $890,000 y él mira por la ventana sonriendo
const p14b: PlanB = {
  a: 115.9, b: 118.2, trans: { tipo: "corte" },
  sfx: [[115.94, "roll", 0], [117.4, "ding", -4]],
  el: (k) => {
    const x4 = ASIENTO_X(4);
    return (
      <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: marchaParadas([[0, 0]], 14) }} seed={14} mano={1.5}
        claves={[mira(0, x4, 660, 2.1), mira(k(118.2), x4, 650, 2.3)]}
        medio={<Persona look={ABER_BUFANDA} seed={4} luz={RIM.tubo} ruta={[{ f: 0, x: x4, y: BP }]} asiento={[{ f: 0, v: BUS_PUNTOS.asiento }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: "sentado" }, { f: k(116.6), v: { hD: 150, cD: 40, cabeza: -6 } }, { f: k(117.4), v: "sentado" }]} caras={[{ f: 0, v: "neutral" }, { f: k(116.6), v: "feliz" }]}
          miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(116.6), v: { x: 1, y: -0.3 } }]}
          cartel={{ claves: [{ f: 0, v: 0 }, { f: k(115.94), v: 890000, d: 50 }], tam: 46, rotulo: "MR. ABERNATHY" }} />} />
    );
  },
};
// Owen se da vuelta al volante y le pregunta con cuidado
const p14c: PlanB = {
  a: 118.2, b: 120.6, trans: { tipo: "corte" },
  sfx: [[118.3, "creak", -8]],
  el: (k) => (
    <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: marchaParadas([[0, 0]], 14) }} seed={14} mano={1.5}
      claves={[mira(0, ch + 160, 640, 2.0), mira(k(120.6), ch + 170, 640, 2.15)]}
      medio={<>
        <Persona {...owenVolante({ caras: [{ f: 0, v: "duda" }], habla: [[k(118.4), k(120.4)]], giros: [{ f: 0, v: 0 }, { f: k(118.3), v: 0.7 }], miradas: [{ f: 0, v: { x: 1, y: 0 } }] })} />
        <Volante />
        <GloboM x={ch + 260} y={BP - 270} texto={"What do you do\nwith your days?"} desde={k(118.4)} hasta={k(120.6)} tam={30} lado={-1} />
      </>} />
  ),
};
// los martes: lee cuentos a los chicos en la biblioteca Rudy Lozano
const p14d: PlanB = {
  a: 120.6, b: 123.4, trans: { tipo: "fundido", d: 8 },
  sfx: [[120.7, "page", -2], [121.6, "laugh", -8], [122.6, "page", -2], [122.9, "laugh", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Aula} pal={PAL} seed={141} mano={1.5} claves={[mira(0, 1000, AULA_PISO - 220, 1.55), mira(k(123.4), 1020, AULA_PISO - 230, 1.7)]}
          medio={<>
            <Persona look={ABERNATHY} seed={4} luz={RIM.cocina} ruta={[{ f: 0, x: 820, y: AULA_PISO }]} asiento={[{ f: 0, v: 60 }]}
              poses={[{ f: 0, v: { hD: 60, cD: 100, hI: 60, cI: 100 } }, { f: k(121.5), v: { hD: 120, cD: 40, hI: 60, cI: 100 } }, { f: k(122.2), v: { hD: 60, cD: 100, hI: 60, cI: 100 } }]}
              caras={[{ f: 0, v: "risa" }]} habla={[[0, 9999]]} enManoD={libro} />
            {[0, 1, 2].map((i) => <Persona key={i} look={NENE} seed={60 + i} luz={RIM.cocina} ruta={[{ f: 0, x: 1060 + i * 120, y: AULA_PISO }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 20 }]}
              poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(121.6 + i * 0.2), v: { hD: 140, cD: 20, hI: 130, cI: 20 } }, { f: k(122.3 + i * 0.1), v: "sentadoSuelo" }]}
              caras={[{ f: 0, v: "feliz" }, { f: k(121.6), v: "risa" }]} escala={0.85} />)}
          </>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center" }}>
            <span style={cajaTxt(interpolate(f, [k(120.8), k(121.1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}>TUESDAYS · <span style={{ color: "#ffc94a" }}>READS TO KIDS AT THE LIBRARY</span></span>
          </div>} />
      );
    };
    return <Pl />;
  },
};
// palea la nieve de media cuadra: las veredas se van limpiando una por una
const p14e: PlanB = {
  a: 123.4, b: 126.0, trans: { tipo: "corte" },
  sfx: [[123.6, "shovel", -2], [124.2, "shovel", -2], [124.8, "shovel", -2], [125.4, "shovel", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = interpolate(f, [0, k(126.0)], [700, 1500]);
      const golpe = (Math.floor((f - 0) / 18) % 2) === 0;
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 1100, autos: 0 }} seed={142} mano={1.5} claves={[mira(0, 900, ASH_PISO - 200, 1.5), mira(k(126), 1380, ASH_PISO - 200, 1.55)]}
          medio={<>
            {/* la vereda nevada; detrás de él queda limpia */}
            <rect x={x + 40} y={ASH_PISO - 22} width={2400} height={44} rx={12} fill="#f4f8fb" />
            {[0, 1, 2, 3].map((i) => <g key={i} opacity={x > 860 + i * 180 ? 1 : 0}><circle cx={820 + i * 180} cy={ASH_PISO - 300} r={30} fill="#0f8a4a" stroke="#fff" strokeWidth={4} /><path d={`M${806 + i * 180},${ASH_PISO - 300} l10,12 l18,-24`} stroke="#fff" strokeWidth={7} fill="none" /></g>)}
            <Persona look={ABER_BUFANDA} seed={4} luz={RIM.sol} ruta={[{ f: 0, x, y: ASH_PISO }]} poses={[{ f: 0, v: golpe ? "empujar" : { tronco: 10, hD: 60, cD: 30, hI: 50, cI: 40 } }]} caras={[{ f: 0, v: "determinado" }]} enManoD={pala} />
            {golpe && <g>{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={x + 130 + i * 14} cy={ASH_PISO - 30 - (i % 3) * 18} r={10} fill="#fff" />)}</g>}
          </>}
          frente={<>{Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={(i * 97 + f) % 2400} cy={((i * 53 + f * 3) % 1100)} r={5} fill="#fff" opacity={0.85} />)}</>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center" }}>
            <span style={cajaTxt(interpolate(f, [k(123.6), k(123.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}>SHOVELS SNOW FOR <span style={{ color: "#9fdcff" }}>HALF THE BLOCK</span></span>
          </div>} />
      );
    };
    return <Pl />;
  },
};
// y vuelve a su diario
const p14f: PlanB = {
  a: 126.0, b: 127.78, trans: { tipo: "fundido", d: 8 },
  sfx: [[126.1, "paper", 0]],
  el: (k) => {
    const x4 = ASIENTO_X(4);
    return (
      <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: marchaParadas([[0, 0]], 14) }} seed={14} mano={1.5}
        claves={[mira(0, x4 - 60, 700, 2.0), mira(k(127.78), x4 - 80, 690, 1.85)]}
        medio={<>
          <Persona {...owenVolante({ caras: [{ f: 0, v: "feliz" }], giros: [{ f: 0, v: 0.5 }, { f: k(126.8), v: 0 }] })} />
          <Persona look={ABER_BUFANDA} seed={4} luz={RIM.tubo} ruta={[{ f: 0, x: x4, y: BP }]} asiento={[{ f: 0, v: BUS_PUNTOS.asiento }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: "sentado" }, { f: k(126.1), v: { hD: 40, cD: 110, hI: 40, cI: 110 } }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0, y: 0.5 } }]} enManoD={diario}
            cartel={{ claves: 890000, tam: 40, rotulo: "MR. ABERNATHY", latido: 40 }} />
        </>} />
    );
  },
};

const Vuela: React.FC<{ f0: number; f1: number; de: [number, number]; a: [number, number]; children: React.ReactNode }> = ({ f0, f1, de, a, children }) => {
  const f = useF();
  if (f < f0) return null;
  const t = interpolate(f, [f0, f1], [0, 1], { extrapolateRight: "clamp", easing: (u) => u * u * (3 - 2 * u) });
  return <g transform={`translate(${de[0] + (a[0] - de[0]) * t},${de[1] + (a[1] - de[1]) * t - Math.sin(t * Math.PI) * 70}) rotate(${(1 - t) * -20})`}>{children}</g>;
};
// ====================== 15 · parada 18: Lena corre con un café ======================
const lenaTag = (k: K, extra: Record<string, unknown> = {}) => ({ claves: [{ f: 0, v: 610000 }, { f: k(132.6), v: 640000, d: 70 }], tam: 46, rotulo: "LENA", ...extra });
// sale corriendo del Café 18 con un vaso en la mano; la cámara la acompaña hacia el bus
const p15: PlanB = {
  a: 127.78, b: 131.2, trans: { tipo: "barrido", d: 10 },
  sfx: [[127.8, "bus_brake", -6], [128.9, "door_bell", -4], [129.2, "step", 0], [129.5, "step", 0], [129.8, "step", 0], [130.1, "step", 0], [130.4, "step", 0]],
  el: (k) => {
    const CAFE = 1700;
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "manana", centro: () => 2300, cafe: CAFE, autos: 2 }} seed={15} mano={2.5}
          claves={[mira(0, CAFE + 560, ASH_PISO - 400, 1.0), mira(k(128.9), CAFE + 560, ASH_PISO - 380, 1.05), mira(k(131.2), CAFE + 1050, ASH_PISO - 300, 1.35, { curva: "in" })]}
          medio={<Persona look={LENA} seed={18} luz={RIM.sol}
            ruta={[{ f: 0, x: CAFE + 500, y: ASH_PISO - 10 }, { f: k(128.9), x: CAFE + 500, y: ASH_PISO - 10 }, { f: k(131.2), x: CAFE + 1300, y: ASH_PISO }]} correr={0.9} opacidad={(ff) => (ff < k(128.8) ? 0 : 1)}
            poses={[{ f: 0, v: { hD: 80, cD: 20 } }]} caras={[{ f: 0, v: "risa" }]} enManoD={<Taza x={0} y={0} color="#f4efe6" vapor={1} f={f} />}
            cartel={lenaTag(k, { desde: k(128.9) })} />}
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center" }}>
            <span style={cajaTxt(interpolate(f, [k(128.0), k(128.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}>STOP 18 · <span style={{ color: "#ffc94a" }}>LENA RUNS OUT</span></span>
          </div>} />
      );
    };
    return <Pl />;
  },
};
// sube a la puerta delantera y le da el café a Owen: «¡Invita la casa!»; su cartel sube mientras sonríe
const p15b: PlanB = {
  a: 131.2, b: 134.4, trans: { tipo: "corte" },
  sfx: [[131.25, "bus_door", -4], [131.4, "pop", 0], [132.6, "roll", -2], [133.6, "ding", -6]],
  el: (k) => {
    const pf = (f: number) => interpolate(f, [0, 6], [0.6, 1], { extrapolateRight: "clamp" });
    return (
      <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: marchaParadas([[0, 0]], 15), puertaF: pf }} seed={151} mano={1.5}
        claves={[mira(0, 420, 640, 1.9), mira(k(134.4), 430, 640, 2.05)]}
        medio={<>
          <Persona {...owenVolante({ caras: [{ f: 0, v: "sorpresa" }, { f: k(132.0), v: "feliz" }], giros: [{ f: 0, v: 0.7 }], miradas: [{ f: 0, v: { x: 1, y: -0.2 } }],
            poses: [{ f: 0, v: "sentado" }, { f: k(131.9), v: { hD: 70, cD: 30, pI: 88, rI: 88, pD: 92, rD: 92 } }],
            enManoD: (ff: number) => (ff > k(131.9) ? <Taza x={0} y={0} color="#f4efe6" vapor={1} f={ff} /> : null) })} />
          <Volante />
          <Persona look={LENA} seed={18} luz={RIM.sol} ruta={[{ f: 0, x: 620, y: BP }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: { hD: 80, cD: 20 } }, { f: k(131.9), v: { hD: 120, cD: 30, hI: 20, cI: 40 } }, { f: k(132.8), v: "celebrar" }, { f: k(133.6), v: { hD: 40, cD: 60 } }]}
            caras={[{ f: 0, v: "risa" }, { f: k(132.6), v: "feliz" }]} habla={[[k(131.4), k(132.6)]]}
            enManoD={(ff) => (ff <= k(131.9) ? <Taza x={0} y={0} color="#f4efe6" vapor={1} f={ff} /> : null)}
            cartel={lenaTag(k, { latido: 50 })} />
          <GloboM x={430} y={BP - 290} texto={"On the house!"} desde={k(131.4)} hasta={k(133.4)} tam={32} lado={-1} />
        </>} />
    );
  },
};
// Owen igual le paga: le extiende un billete de $5; ella se sorprende y se ríe
const p15c: PlanB = {
  a: 134.4, b: 135.84, trans: { tipo: "corte" },
  sfx: [[134.5, "paper", -2], [134.6, "coin", 0], [135.0, "laugh", -6]],
  el: (k) => {
    const billete = <g><rect x={-40} y={-20} width={80} height={40} rx={4} fill="#9fdc8a" stroke="#4a8a3a" strokeWidth={3} /><text y={10} fontFamily={F_HUD} fontWeight={800} fontSize={26} fill="#2a5a2a" textAnchor="middle">$5</text></g>;
    return (
      <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: marchaParadas([[0, 0]], 15), puertaF: () => 1 }} seed={151} mano={1.5}
        claves={[mira(0, 440, 660, 2.2), mira(k(135.84), 450, 660, 2.35)]}
        medio={<>
          <Persona {...owenVolante({ caras: [{ f: 0, v: "feliz" }], giros: [{ f: 0, v: 0.7 }], miradas: [{ f: 0, v: { x: 1, y: -0.2 } }],
            poses: [{ f: 0, v: "sentado" }], habla: [[k(134.5), k(135.0)]] })} />
          <Vuela f0={k(134.5)} f1={k(135.05)} de={[310, BP - 190]} a={[575, BP - 200]}>{billete}</Vuela>
          <Persona look={LENA} seed={18} luz={RIM.sol} ruta={[{ f: 0, x: 620, y: BP }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: { hD: 40, cD: 60 } }, { f: k(134.6), v: "manosCara" }, { f: k(135.1), v: { hD: 100, cD: 30 } }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(134.6), v: "sorpresa" }, { f: k(135.1), v: "risa" }]}
            cartel={{ claves: 640000, tam: 46, rotulo: "LENA" }} />
        </>}
        hud={<div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center" }}>
          <span style={cajaTxt(1)}>OWEN PAYS HER <span style={{ color: VERDE }}>ANYWAY</span></span>
        </div>} />
    );
  },
};

// ====================== 16-18 · parada 30, 6:10: Mrs. Delphine Ward ======================
const bolsaW = (c: string) => <g><path d="M-26,0 h52 l-6,70 h-40 Z" fill={c} /><path d="M-14,0 q14,-24 28,0" stroke="#8a6a4a" strokeWidth={4} fill="none" /><circle cx={-8} cy={-4} r={9} fill="#d8443a" /><rect x={4} y={-14} width={10} height={20} fill="#f4efe4" /></g>;
const sillaPlegada = (x: number, y: number) => <g transform={`translate(${x},${y})`}><rect x={-14} y={-200} width={28} height={190} rx={8} fill="#3a3f46" /><circle cx={0} cy={-14} r={40} fill="none" stroke="#2a2e34" strokeWidth={10} /><circle cx={0} cy={-14} r={6} fill="#8a9298" /></g>;
const MARIDO = { ...ABERNATHY, camisa: "#5a6a8a", accesorios: [{ t: "pelo" as const, forma: "calvo" as const, color: "#c9c4bb" }] } as typeof ABERNATHY;
const wardTag = (k: K, extra: Record<string, unknown> = {}) => ({ claves: [{ f: 0, v: 0 }, { f: k(154.5), v: 2900000, d: 110 }], fmt: (v: number) => "$" + Math.round(v).toLocaleString("en-US"), rotulo: "MRS. WARD", ...extra });
// 6:10, parada 30: sube una mujer chiquita con dos bolsas pesadas y una silla de ruedas plegada
const p16: PlanB = {
  a: 135.84, b: 141.0, trans: { tipo: "fundido", d: 14 },
  sfx: [[135.9, "bus_brake", -6], [136.4, "bus_kneel", -6], [136.9, "bus_door", -2], [137.6, "step", -2], [138.1, "bag", -4], [138.6, "metal", -2], [139.3, "step", -2], [140.0, "step", -2], [140.5, "bag", -4]],
  el: (k) => {
    const pf = (f: number) => interpolate(f, [k(136.8), k(137.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const Pl: React.FC = () => {
      const f = useF();
      const x = interpolate(f, [k(137.4), k(140.6)], [600, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "alba", avance: marchaParadas([[0, k(136.4)]], 16), puertaF: pf }} seed={16} mano={2}
          claves={[mira(0, 520, 640, 1.6), mira(k(140.6), 760, 640, 1.8, { curva: "inout" }), mira(k(141.0), 780, 640, 1.82)]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "neutral" }], giros: [{ f: 0, v: 0 }] })} />
            <Volante />
            {f >= k(137.3) && sillaPlegada(x - 90, BP)}
            <Persona look={DELPHINE} seed={66} luz={RIM.alba} opacidad={(ff) => (ff < k(137.3) ? 0 : 1)}
              ruta={[{ f: 0, x: 600, y: BP }, { f: k(137.4), x: 600, y: BP }, { f: k(140.6), x: 900, y: BP }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 10, cD: 10, hI: 14, cI: 12, tronco: 10, cabeza: 8 } }, { f: k(138.6), v: { hD: 8, cD: 6, hI: 12, cI: 8, tronco: 14, cabeza: 10 } }, { f: k(139.6), v: { hD: 10, cD: 10, hI: 14, cI: 12, tronco: 10, cabeza: 8 } }]}
              caras={[{ f: 0, v: "cansado" }]} enManoD={bolsaW("#c9a36a")} enManoI={bolsaW("#e9e4d8")} />
          </>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center" }}>
            <span style={cajaTxt(interpolate(f, [k(136.0), k(136.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}>6:10 · <span style={{ color: VERDE }}>STOP 30</span></span>
          </div>} />
      );
    };
    return <Pl />;
  },
};
// se presenta: Mrs. Delphine Ward, 66; deja las bolsas y se toma la espalda
const p16b: PlanB = {
  a: 141.0, b: 143.5, trans: { tipo: "corte" },
  sfx: [[141.1, "bag", -2], [141.4, "bag", -4], [142.0, "sigh", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const suelta = f >= k(141.1);
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "alba", avance: marchaParadas([[0, 0]], 16) }} seed={161} mano={1.5}
          claves={[mira(0, 900, 660, 2.2), mira(k(143.5), 900, 650, 2.4)]}
          medio={<>
            {sillaPlegada(810, BP)}
            {suelta && <><g transform={`translate(${960},${BP - 70})`}>{bolsaW("#c9a36a")}</g><g transform={`translate(${1020},${BP - 70})`}>{bolsaW("#e9e4d8")}</g></>}
            <Persona look={DELPHINE} seed={66} luz={RIM.alba} ruta={[{ f: 0, x: 900, y: BP }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 10, cD: 10, hI: 14, cI: 12, tronco: 10 } }, { f: k(141.1), v: "agacharse" }, { f: k(141.7), v: "manosCintura" }, { f: k(142.6), v: { hD: 30, cD: 60, hI: -35, cI: -95 } }]}
              caras={[{ f: 0, v: "cansado" }, { f: k(142.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0, y: 0.6 } }, { f: k(142.6), v: { x: -1, y: 0 } }]}
              enManoD={(ff) => (ff < k(141.1) ? bolsaW("#c9a36a") : null)} enManoI={(ff) => (ff < k(141.1) ? bolsaW("#e9e4d8") : null)} />
          </>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center" }}>
            <span style={cajaTxt(interpolate(f, [k(141.2), k(141.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}>MRS. DELPHINE WARD · <span style={{ color: "#ffc94a" }}>66</span></span>
          </div>} />
      );
    };
    return <Pl />;
  },
};
// cien mañanas la vio pasar sin mirarla: el contador corre y Owen recién ahora gira la cabeza
const p16c: PlanB = {
  a: 143.5, b: 147.36, trans: { tipo: "corte" },
  sfx: [[143.6, "tick", -6, { dur: 2.2 }], [145.9, "heart1", -4], [146.4, "suspense", -8, { dur: 1 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const n = Math.round(interpolate(f, [k(143.6), k(145.8)], [1, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (u) => u * u }));
      const fantasma = (i: number) => interpolate((f + i * 7) % 28, [0, 14, 28], [0, 0.35, 0]);
      return (
        <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "alba", avance: marchaParadas([[0, 0]], 16) }} seed={162} mano={1.5}
          claves={[mira(0, 440, 640, 2.0), mira(k(145.8), 440, 640, 2.1), mira(k(147.36), 470, 630, 2.5, { curva: "in" })]}
          medio={<>
            <Persona {...owenVolante({ caras: [{ f: 0, v: "neutral" }, { f: k(145.9), v: "sorpresa" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }, { f: k(145.9), v: { x: 1, y: 0 } }], giros: [{ f: 0, v: 0 }, { f: k(145.9), v: 0.8 }] })} />
            <Volante />
            {f < k(145.8) && [0, 1, 2].map((i) => <g key={i} opacity={fantasma(i)}><Persona look={DELPHINE} seed={66} ruta={[{ f: 0, x: 600 + i * 40 + ((f + i * 7) % 28) * 8, y: BP }]} poses={[{ f: 0, v: { tronco: 10 } }]} caras={[{ f: 0, v: "cansado" }]} /></g>)}
          </>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center" }}>
            <span style={cajaTxt(interpolate(f, [k(143.6), k(143.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}>{n} MORNINGS · <span style={{ color: "#ff8a7a" }}>NEVER REALLY LOOKED</span></span>
          </div>} />
      );
    };
    return <Pl />;
  },
};
// en casa: le pone el saco al marido con demencia, que no sabe bien dónde está
const p17: PlanB = {
  a: 147.36, b: 150.6, trans: { tipo: "fundido", d: 10 },
  sfx: [[147.5, "cloth", -4], [148.4, "spoon", -4], [149.6, "cup", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = TF_PUNTOS.mesa;
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "manana" }} seed={171} mano={1.5}
          claves={[mira(0, x + 80, P - 260, 2.0), mira(k(150.6), x + 90, P - 270, 2.2)]}
          medio={<>
            <Persona look={MARIDO} seed={70} luz={RIM.cocina} ruta={[{ f: 0, x, y: P }]} asiento={[{ f: 0, v: 60 }]} poses={[{ f: 0, v: "sentado" }]}
              caras={[{ f: 0, v: "duda" }, { f: k(149.0), v: "feliz" }]} miradas={[{ f: 0, v: { x: -0.9, y: -0.4 } }, { f: k(148.6), v: { x: 1, y: -0.3 } }]} habla={[[k(149.1), k(149.6)]]} />
            {f < k(148.8) && [0, 1, 2].map((i) => <text key={i} x={x - 50 + i * 50} y={P - 250 - ((f + i * 9) % 30) * 2} fontFamily={F_HUD} fontWeight={800} fontSize={54} fill="#c9667a" opacity={interpolate((f + i * 9) % 30, [0, 8, 30], [0, 1, 0])}>?</text>)}
            <Persona look={DELPHINE} seed={66} luz={RIM.cocina} ruta={[{ f: 0, x: x + 190, y: P }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 80, cD: 40, hI: 70, cI: 50, tronco: 10 } }, { f: k(148.3), v: { hD: 95, cD: 10, tronco: 14 } }, { f: k(149.2), v: { hD: 60, cD: 80, tronco: 6 } }]}
              caras={[{ f: 0, v: "determinado" }, { f: k(149.0), v: "feliz" }]} miradas={[{ f: 0, v: { x: -1, y: 0.4 } }]}
              enManoD={(ff) => (ff >= k(148.3) && ff < k(149.2) ? <g><line x1={0} y1={0} x2={40} y2={0} stroke="#c9d6dc" strokeWidth={5} /><ellipse cx={46} cy={0} rx={9} ry={6} fill="#c9d6dc" /></g> : null)} />
          </>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center" }}>
            <span style={cajaTxt(interpolate(f, [k(147.6), k(147.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}>HER HUSBAND · <span style={{ color: "#ffc94a" }}>DEMENTIA</span></span>
          </div>} />
      );
    };
    return <Pl />;
  },
};
// a la tarde: los dos nietos llegan corriendo, ella les da la merienda; la mamá sale en ambo al turno noche
const p17b: PlanB = {
  a: 150.6, b: 154.34, trans: { tipo: "corte" },
  sfx: [[150.7, "door", -4], [150.9, "step", 0], [151.1, "step", 0], [151.3, "laugh", -6], [152.4, "bag", -6], [153.2, "door", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const x = TF_PUNTOS.mesa;
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "tarde" }} seed={172} mano={1.5}
          claves={[mira(0, x + 160, P - 230, 1.6), mira(k(154.34), x + 180, P - 240, 1.75)]}
          medio={<>
            {[0, 1].map((i) => <Persona key={i} look={{ ...NENE, camisa: ["#f2c230", "#3fa3d0"][i] }} seed={80 + i} luz={RIM.cocina}
              ruta={[{ f: 0, x: x - 300 - i * 120, y: P }, { f: k(151.6), x: x + 40 + i * 110, y: P }]} correr={0.9} escala={0.8} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: {} }, { f: k(151.7), v: "celebrar" }, { f: k(152.6), v: { hD: 90, cD: 20 } }]} caras={[{ f: 0, v: "risa" }]} />)}
            <Persona look={DELPHINE} seed={66} luz={RIM.cocina} ruta={[{ f: 0, x: x + 380, y: P }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: "manosCintura" }, { f: k(152.3), v: { hD: 90, cD: 20, hI: 80, cI: 30 } }]} caras={[{ f: 0, v: "cansado" }, { f: k(151.8), v: "feliz" }]}
              enManoD={(ff) => (ff >= k(152.3) ? <g><rect x={-20} y={-14} width={40} height={28} rx={6} fill="#f2c230" /><circle cx={0} cy={0} r={8} fill="#d8443a" /></g> : null)} />
            <Persona look={SCRUBS} seed={90} luz={RIM.cocina} ruta={[{ f: 0, x: x + 560, y: P }, { f: k(152.4), x: x + 560, y: P }, { f: k(154.3), x: x + 900, y: P }]} dir={[{ f: 0, v: -1 }, { f: k(152.4), v: 1 }]}
              poses={[{ f: 0, v: "saludar" }, { f: k(152.4), v: {} }]} caras={[{ f: 0, v: "cansado" }]} />
          </>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center" }}>
            <span style={cajaTxt(interpolate(f, [k(150.8), k(151.1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}>2 GRANDSONS · <span style={{ color: "#9fdcff" }}>MOM WORKS NIGHTS</span></span>
          </div>} />
      );
    };
    return <Pl />;
  },
};
// de vuelta en el bus: el cartel más grande que vio en su vida, $2,900,000; Owen abre los ojos
const p18: PlanB = {
  a: 154.34, b: 158.5, trans: { tipo: "corte" },
  sfx: [[154.4, "roll", 0, { dur: 3.8 }], [158.2, "boom", -2], [158.35, "sparkle", -4]],
  el: (k) => {
    const x2 = ASIENTO_X(2);
    return (
      <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "alba", avance: (f: number) => f * 12 }} seed={18} mano={2}
        claves={[mira(0, x2, 650, 2.0), mira(k(157.8), x2, 560, 1.45, { curva: "inout" }), mira(k(158.5), x2, 560, 1.5, { resorte: { damping: 9, stiffness: 120 } })]}
        medio={<>
          <Persona {...sentadoBus(DELPHINE, x2, { caras: [{ f: 0, v: "cansado" }], seed: 66, miradas: [{ f: 0, v: { x: 0.8, y: 0.2 } }], poses: [{ f: 0, v: { ...POSE_CELU_SENTADO, hD: 20, cD: 80, cabeza: 6 } }],
            cartel: wardTag(k, { tam: 64, latido: 30 }) })} />
        </>} />
    );
  },
};
// no paga impuestos por eso; nadie le paga un centavo: el recibo de sueldo en $0.00
const p18b: PlanB = {
  a: 158.5, b: 162.28, trans: { tipo: "corte" },
  sfx: [[158.6, "paper", -2], [159.4, "stamp", -2], [160.9, "stamp", -2], [161.2, "sad", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const s1 = interpolate(f, [k(159.4), k(159.55)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const s2 = interpolate(f, [k(160.9), k(161.05)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const fila = (y: number, a: string, b: string, c = "#1d2a34") => <g><text x={-330} y={y} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#5a6066">{a}</text><text x={330} y={y} fontFamily={F_HUD} fontWeight={800} fontSize={44} fill={c} textAnchor="end">{b}</text></g>;
      return (
        <Escena Set={Pizarra} pal={PAL} seed={181} mano={1.2} claves={[mira(0, 960, 540, 1.0), mira(k(162.28), 960, 540, 1.05)]}
          medio={<>
            <g transform="translate(640,560)">
              <rect x={-380} y={-330} width={760} height={640} rx={18} fill="#f6f1e4" />
              <rect x={-380} y={-330} width={760} height={100} rx={18} fill="#2a4a6a" />
              <text x={0} y={-262} fontFamily={F_HUD} fontWeight={800} fontSize={46} fill="#fff" textAnchor="middle" letterSpacing={4}>EARNINGS STATEMENT</text>
              {fila(-160, "EMPLOYEE", "D. WARD")}
              {fila(-90, "HOURS / WEEK", "70+")}
              {fila(-20, "VALUE OF WORK", "$2,900,000", "#0f8a4a")}
              {fila(50, "TAXES PAID ON IT", "$0", "#c23a2e")}
              <line x1={-330} x2={330} y1={110} y2={110} stroke="#1d2a34" strokeWidth={4} />
              {fila(190, "PAID TO HER", "$0.00", "#c23a2e")}
              <g opacity={s1} transform={`translate(560,30) rotate(-10) scale(${1.8 - 0.8 * s1})`}><rect x={-140} y={-46} width={280} height={84} rx={10} fill="none" stroke="#c23a2e" strokeWidth={8} /><text y={18} fontFamily={F_HUD} fontWeight={800} fontSize={50} fill="#c23a2e" textAnchor="middle">NO TAX</text></g>
              <g opacity={s2} transform={`translate(560,200) rotate(-8) scale(${(1.8 - 0.8 * s2) * 0.8})`}><rect x={-210} y={-50} width={420} height={92} rx={10} fill="none" stroke="#c23a2e" strokeWidth={9} /><text y={20} fontFamily={F_HUD} fontWeight={800} fontSize={56} fill="#c23a2e" textAnchor="middle">NOT A CENT</text></g>
            </g>
            <Persona look={DELPHINE} seed={66} ruta={[{ f: 0, x: 1640, y: 960 }]} escala={1.5} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 10, cD: 10, hI: 14, cI: 12, tronco: 10 } }, { f: k(161.0), v: "encogerse" }]} caras={[{ f: 0, v: "cansado" }, { f: k(161.0), v: "triste" }]}
              enManoD={bolsaW("#c9a36a")} enManoI={bolsaW("#e9e4d8")} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 19 · AARP: 38 millones de cuidadores, $600 mil millones ======================
const sillaRuedas = (x: number, y: number) => <g transform={`translate(${x},${y})`}><circle cx={0} cy={-60} r={60} fill="none" stroke="#2a2e34" strokeWidth={10} /><circle cx={0} cy={-60} r={8} fill="#8a9298" /><rect x={-50} y={-140} width={110} height={16} rx={6} fill="#3a3f46" /><rect x={50} y={-260} width={14} height={136} rx={6} fill="#3a3f46" /><circle cx={70} cy={-14} r={14} fill="#2a2e34" /></g>;
const PISO19 = 980;
// los cuidadores: en primer plano tres que cuidan; atrás la multitud que se cuenta hasta 38 millones
const p19: PlanB = {
  a: 162.28, b: 168.4, trans: { tipo: "luz", d: 12, color: "#ffe2a0" },
  sfx: [[162.4, "whoosh_big", -2], [164.0, "popcluster", -2, { dur: 2.5 }], [166.6, "roll", -4, { dur: 1.6 }], [168.2, "slam", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const n = Math.round(interpolate(f, [k(164.0), k(168.0)], [0, 38000000], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (u) => u * u }));
      const empuja = interpolate(f, [0, k(168.4)], [0, 120]);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1c1626", luz: "#ff8a9a" }} seed={19} mano={2}
          claves={[mira(0, 960, 600, 1.25), mira(k(165.0), 960, 560, 1.05, { curva: "inout" }), mira(k(168.4), 960, 540, 1.0)]}
          medio={<>
            <Personitas x={140} y={380} n={60} cols={30} on={Math.min(60, Math.round(interpolate(f, [k(164.0), k(167.8)], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })))} color="#ff8a9a" tam={44} desde={k(164.0)} f={f} paso={1} />
            {/* empuja la silla de ruedas */}
            {sillaRuedas(420 + empuja, PISO19)}
            <Persona look={MARIDO} seed={70} ruta={[{ f: 0, x: 430 + empuja, y: PISO19 - 40 }]} asiento={[{ f: 0, v: 90 }]} poses={[{ f: 0, v: "sentado" }]} caras={[{ f: 0, v: "cansado" }]} />
            <Persona look={DELPHINE} seed={66} ruta={[{ f: 0, x: 560 + empuja, y: PISO19 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "empujar" }]} caras={[{ f: 0, v: "determinado" }]} />
            {/* da de comer */}
            <Persona look={SENORA} seed={31} ruta={[{ f: 0, x: 960, y: PISO19 }]} asiento={[{ f: 0, v: 60 }]} poses={[{ f: 0, v: "sentado" }]} caras={[{ f: 0, v: "cansado" }, { f: k(165.5), v: "feliz" }]} habla={[[k(165.5), k(166.2)]]} />
            <Persona look={ESTUDIANTE} seed={41} ruta={[{ f: 0, x: 1120, y: PISO19 }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 60, cD: 60, tronco: 10 } }, { f: k(165.2), v: { hD: 95, cD: 10, tronco: 14 } }, { f: k(166.0), v: { hD: 60, cD: 60, tronco: 10 } }]} caras={[{ f: 0, v: "feliz" }]} />
            {/* ayuda a caminar a un abuelo */}
            <Persona look={ABERNATHY} seed={4} ruta={[{ f: 0, x: 1420, y: PISO19 }, { f: k(168.4), x: 1520, y: PISO19 }]} poses={[{ f: 0, v: { tronco: 14, cabeza: 10 } }]} caras={[{ f: 0, v: "cansado" }]} />
            <Persona look={OBRERO} seed={52} ruta={[{ f: 0, x: 1340, y: PISO19 }, { f: k(168.4), x: 1440, y: PISO19 }]} poses={[{ f: 0, v: { hD: 80, cD: 10 } }]} caras={[{ f: 0, v: "determinado" }]} />
          </>}
          hud={<>
            <div style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center", opacity: interpolate(f, [k(163.6), k(163.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              <span style={cajaTxt(1, { fontSize: 76 })}>{n.toLocaleString("en-US")} <span style={{ color: "#ffb0bc" }}>FAMILY CAREGIVERS</span></span>
            </div>
            <FuenteB texto="AARP, Valuing the Invaluable (2023)" desde={k(164)} hasta={k(168.3)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// $600 mil millones de cuidado sin pago en un año: la pila de fajos crece hasta tapar a la multitud
const p19b: PlanB = {
  a: 168.4, b: 172.6, trans: { tipo: "corte" },
  sfx: [[168.5, "cash", 0], [168.9, "roll", -2, { dur: 2.4 }], [171.4, "slam", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const v = interpolate(f, [k(168.6), k(171.3)], [0, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (u) => 1 - Math.pow(1 - u, 2) });
      const capas = Math.round(v / 600 * 14);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1c1626", luz: "#7dff6a" }} seed={191} mano={1.5}
          claves={[mira(0, 960, 600, 1.0), mira(k(172.6), 960, 560, 1.08)]}
          medio={<>
            {Array.from({ length: capas }).map((_, i) => <g key={i} transform={`translate(${960 + ((i % 2) - 0.5) * 30},${PISO19 - 20 - i * 42})`}>{[-220, -70, 80, 230].map((dx) => <g key={dx} transform={`translate(${dx},0)`}><rect x={-70} y={-20} width={140} height={40} rx={4} fill="#7dc24a" stroke="#2a5a2a" strokeWidth={3} /><rect x={-14} y={-20} width={28} height={40} fill="#f4efe4" opacity={0.85} /></g>)}</g>)}
            <Persona look={DELPHINE} seed={66} ruta={[{ f: 0, x: 640, y: PISO19 }]} escala={1.35} poses={[{ f: 0, v: {} }, { f: k(170.0), v: { hD: 120, cD: 30, cabeza: -14 } }]} caras={[{ f: 0, v: "cansado" }, { f: k(170.0), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.6 } }]} />
            <Persona look={SENORA} seed={31} ruta={[{ f: 0, x: 1290, y: PISO19 }]} escala={1.35} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: {} }, { f: k(170.4), v: "manosCara" }]} caras={[{ f: 0, v: "cansado" }, { f: k(170.4), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: -1, y: -0.6 } }]} />
          </>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center" }}>
            <span style={cajaTxt(1, { fontSize: 84 })}><span style={{ color: VERDE }}>${Math.round(v)} BILLION</span> · UNPAID · ONE YEAR</span>
          </div>} />
      );
    };
    return <Pl />;
  },
};
// si todos mandaran la factura: un cheque gigante que ella firma… y nunca se manda
const p19c: PlanB = {
  a: 172.6, b: 176.6, trans: { tipo: "corte" },
  sfx: [[172.7, "whoosh", -2], [173.4, "marker", -4, { dur: 1.2 }], [175.4, "stamp", 0], [175.6, "sad", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const y = interpolate(f, [k(172.7), k(173.2)], [1100, 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (u) => 1 - Math.pow(1 - u, 3) });
      const firma = interpolate(f, [k(173.4), k(174.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const sello = interpolate(f, [k(175.4), k(175.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1c1626", luz: "#ffe2a0" }} seed={192} mano={1.2}
          claves={[mira(0, 900, 540, 1.0), mira(k(176.6), 900, 540, 1.06)]}
          medio={<>
            <g transform={`translate(800,${y - 40}) rotate(-2)`}>
              <rect x={-600} y={-230} width={1200} height={460} rx={18} fill="#f4f1e6" stroke="#9aa49a" strokeWidth={6} />
              <text x={-550} y={-150} fontFamily={F_HUD} fontWeight={700} fontSize={38} fill="#4a5a4a">PAY TO THE ORDER OF</text>
              <text x={-550} y={-70} fontFamily={F_HUD} fontWeight={800} fontSize={60} fill="#1f3fa8">EVERY FAMILY CAREGIVER</text>
              <rect x={-550} y={-20} width={1100} height={100} rx={12} fill="#fff" stroke="#9aa49a" strokeWidth={3} />
              <text x={0} y={52} fontFamily={F_HUD} fontWeight={800} fontSize={72} fill="#2a5a2a" textAnchor="middle">$600,000,000,000</text>
              <rect x={150} y={200} width={400} height={4} fill="#9aa49a" />
              <path d="M170,190 q30,-50 60,0 t60,0 t60,0 t60,0 t60,0" fill="none" stroke="#1f3fa8" strokeWidth={6} strokeDasharray={420} strokeDashoffset={420 * (1 - firma)} strokeLinecap="round" />
              <text x={-550} y={120} fontFamily={F_HUD} fontWeight={700} fontSize={32} fill="#4a5a4a">MEMO: ONE OF THE LARGEST PAYCHECKS IN THE COUNTRY</text>
              <g opacity={sello} transform={`translate(-150,330) rotate(-6) scale(${1.6 - 0.7 * sello})`}><rect x={-230} y={-56} width={460} height={104} rx={12} fill="rgba(244,241,230,0.85)" stroke="#c23a2e" strokeWidth={10} /><text y={22} fontFamily={F_HUD} fontWeight={800} fontSize={62} fill="#c23a2e" textAnchor="middle">NEVER SENT</text></g>
            </g>
            <Persona look={DELPHINE} seed={66} ruta={[{ f: 0, x: 1640, y: 940 }]} escala={1.15} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: {} }, { f: k(173.4), v: { hD: 80, cD: 20 } }, { f: k(174.7), v: {} }, { f: k(175.5), v: "encogerse" }]}
              caras={[{ f: 0, v: "duda" }, { f: k(173.4), v: "feliz" }, { f: k(175.5), v: "triste" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }]}
              enManoD={(ff) => (ff >= k(173.4) && ff < k(174.7) ? <g><rect x={-6} y={-40} width={12} height={60} rx={4} fill="#1f3fa8" /></g> : null)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// la mayoría son mujeres, la mayoría está cansada, la mayoría nunca piensa que vale algo
const p19d: PlanB = {
  a: 176.6, b: 182.4, trans: { tipo: "corte" },
  sfx: [[176.7, "pop", 0], [178.56, "pop", 0], [179.8, "pop", 0], [180.6, "sad", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const L = [{ look: DELPHINE, s: 66 }, { look: SENORA, s: 31 }, { look: ROSA, s: 12 }, { look: SCRUBS, s: 21 }];
      const cansada = f >= k(178.56), baja = f >= k(179.8);
      const lineas: [string, number, string][] = [["MOST ARE WOMEN", 176.7, "#ffb0bc"], ["MOST ARE TIRED", 178.56, "#ffe2a0"], ["MOST NEVER THINK THEY'RE WORTH ANYTHING", 179.8, "#ffffff"]];
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1c1626", luz: "#ff8a9a" }} seed={193} mano={1.5}
          claves={[mira(0, 960, 600, 1.2), mira(k(182.4), 960, 610, 1.28)]}
          medio={<>{L.map((l, i) => (
            <Persona key={i} look={l.look} seed={l.s} ruta={[{ f: 0, x: 560 + i * 270, y: PISO19 }]} escala={1.15}
              poses={[{ f: 0, v: {} }, { f: k(178.56 + i * 0.1), v: { tronco: 12, cabeza: 14, hD: 6, cD: 6, hI: 6, cI: 6 } }, { f: k(179.9 + i * 0.1), v: "encogerse" }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(178.56), v: "cansado" }, { f: k(179.9), v: "triste" }]} miradas={[{ f: 0, v: { x: 0, y: 0 } }, { f: k(179.9), v: { x: 0, y: 1 } }]}
              cartel={{ claves: [{ f: 0, v: [2900000, 1200000, 1960000, 840000][i] }, { f: k(180.2), v: 0, d: 40 }], tam: 34, desde: k(176.8 + i * 0.15), parpadeo: baja ? 0.5 : 0 }} />
          ))}
          {cansada && !baja && L.map((_, i) => <text key={i} x={600 + i * 270} y={PISO19 - 420 - ((f + i * 6) % 24) * 2} fontFamily={F_HUD} fontWeight={800} fontSize={40} fill="#9fdcff" opacity={0.8}>z</text>)}</>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {lineas.map(([t, s, c], i) => {
              const o = interpolate(f, [k(s), k(s) + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return <div key={i} style={{ ...cajaTxt(o, { fontSize: 44, color: c }), transform: `translateY(${(1 - o) * 20}px)` }}>{t}</div>;
            })}
          </div>} />
      );
    };
    return <Pl />;
  },
};

// ====================== 20 · CTA a mitad: ¿qué diría el tuyo? ======================
// un chico en el sillón mira el celular; arriba de su cabeza la cifra gira como tragamonedas y él la mira
const p20: PlanB = {
  a: 182.4, b: 188.0, trans: { tipo: "fundido", d: 14 },
  sfx: [[182.5, "whoosh"], [184.6, "pop", 0], [185.4, "roll", -4, { dur: 2.4 }], [187.6, "ding", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const n = Math.floor(f / 4) % 9;
      const vals = ["$12,400", "$380,000", "$1.2M", "$47,000", "$2.1M", "$900", "$640,000", "$3.3M", "$88,000"];
      const x = TF_PUNTOS.sillaOwen;
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "noche" }} seed={20} mano={1.5}
          claves={[mira(0, x + 220, P - 330, 1.45), mira(k(188.0), x + 240, P - 350, 1.65)]}
          medio={<>
            <Persona look={ESTUDIANTE} seed={41} luz={RIM.noche} ruta={[{ f: 0, x: x + 320, y: P }]} escala={1.2}
              poses={[{ f: 0, v: "celular" }, { f: k(184.6), v: { hD: 20, cD: 120, cabeza: -18 } }, { f: k(186.4), v: "pensar" }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(184.6), v: "sorpresa" }, { f: k(186.4), v: "duda" }]} miradas={[{ f: 0, v: { x: 0, y: 1 } }, { f: k(184.6), v: { x: 0, y: -1 } }]}
              enManoD={(ff) => (ff < k(184.6) ? <Celular s={0.8} /> : null)} />
            <CartelM x={x + 320} y={P - 520} claves={0} texto={f > k(185.4) ? vals[n] : "???"} tam={60} f={f} desde={k(184.4)} />
          </>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center" }}>
            <span style={cajaTxt(interpolate(f, [k(184.5), k(184.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), { fontSize: 72 })}>WHAT WOULD <span style={{ color: "#ffc94a" }}>YOURS</span> SAY?</span>
          </div>} />
      );
    };
    return <Pl />;
  },
};
// el comentario se escribe solo; el botón de suscribirse se aprieta; Owen con la factura: «se pone peor»
const p20b: PlanB = {
  a: 188.0, b: 193.22, trans: { tipo: "corte" },
  sfx: [[188.1, "typing", -4, { dur: 1.4 }], [190.4, "click", 0], [190.5, "ding", -2], [191.8, "heart1", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const txt = "Mine would say… $____";
      const nTxt = Math.round(interpolate(f, [k(188.1), k(189.5)], [0, txt.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      const apreta = interpolate(f, [k(190.3), k(190.45), k(190.6)], [1, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const sus = f >= k(190.45);
      const cur = interpolate(f, [k(189.6), k(190.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0e1a20" }} seed={201} mano={1.2} claves={[mira(0, 960, 540, 1.0), mira(k(193.2), 960, 540, 1.05)]}
          medio={<>
            <g transform="translate(560,420)">
              <rect x={-380} y={-120} width={760} height={240} rx={22} fill="#f4efe4" />
              <circle cx={-300} cy={-40} r={44} fill="#22303a" />
              <text x={-230} y={-50} fontFamily={F_HUD} fontWeight={700} fontSize={34} fill="#5a6066">YOUR COMMENT</text>
              <text x={-230} y={20} fontFamily={F_HUD} fontWeight={800} fontSize={50} fill="#1d2a34">{txt.slice(0, nTxt)}{f % 16 < 8 ? "|" : ""}</text>
            </g>
            <g transform={`translate(1380,420) scale(${apreta})`}>
              <rect x={-250} y={-70} width={500} height={140} rx={70} fill={sus ? "#3a3f46" : "#e0302a"} />
              <text x={0} y={20} fontFamily={F_HUD} fontWeight={800} fontSize={56} fill="#fff" textAnchor="middle">{sus ? "SUBSCRIBED" : "SUBSCRIBE"}</text>
            </g>
            <g transform={`translate(${1700 - 300 * cur},${640 - 200 * cur})`}><path d="M0,0 l0,60 l16,-14 l12,26 l12,-6 l-12,-26 l22,0 Z" fill="#fff" stroke="#0e1a20" strokeWidth={3} /></g>
            <Persona look={OWEN_CASA} seed={47} ruta={[{ f: 0, x: 980, y: 1000 }]} escala={1.5}
              poses={[{ f: 0, v: { hD: 60, cD: 80 } }, { f: k(191.6), v: "manosCara" }]} caras={[{ f: 0, v: "triste" }, { f: k(191.6), v: "miedo" }]}
              enManoD={(ff) => (ff < k(191.6) ? <g transform="rotate(180)"><Factura x={0} y={0} s={0.5} monto="$31,412.00" /></g> : null)} />
          </>}
          hud={<div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center" }}>
            <span style={cajaTxt(interpolate(f, [k(191.6), k(191.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}>OWEN'S WEEK? <span style={{ color: "#ff8a7a" }}>IT GETS WORSE.</span></span>
          </div>} />
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
          hud={<div style={{ position: "absolute", left: 110, top: 150, fontFamily: F_HUD, fontWeight: 800, fontSize: 72, color: "#f4efe4", lineHeight: 1.18, background: "rgba(10,18,40,0.9)", padding: "10px 30px", borderRadius: 16, opacity: f > k(194.2) ? 1 : 0 }}>
            <div style={{ opacity: f > k(194.2) ? 1 : 0 }}>&nbsp;&nbsp;$31,412</div>
            <div style={{ opacity: f > k(198.5) ? 1 : 0 }}>−&nbsp;&nbsp;$4,700</div>
            <div style={{ opacity: f > k(200.9) ? 1 : 0, borderTop: "5px solid #f4efe4", color: "#ff6a5a" }}>&nbsp;&nbsp;$26,712 SHORT</div>
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
              return <g key={i} transform={`translate(${620 + i * 130},${560 + (1 - t) * -400 - i * 18}) rotate(${(i - 1.5) * 9})`} opacity={t}><rect x={-160} y={-100} width={320} height={200} rx={8} fill="#f4f1e6" stroke="#c9c2b0" strokeWidth={3} /><text y={-30} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#c23a2e" textAnchor="middle">FINAL NOTICE</text>{[0, 1, 2].map((r) => <rect key={r} x={-120} y={10 + r * 22} width={240} height={8} rx={3} fill="#d6d2c6" />)}</g>;
            })}
            {f >= k(213.2) && <Persona look={OWEN_CASA} seed={47} ruta={[{ f: 0, x: 1500, y: 980 }]} escala={1.35} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 120, cD: 40, hI: 120, cI: 40 } }, { f: k(214.9), v: "manosCara" }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(214.9), v: "miedo" }]} miradas={[{ f: 0, v: { x: -1, y: -0.3 } }]} />}
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
          claves={sale ? [mira(k(241.2), 700, 760, 1.4), mira(k(248.44), 560, 760, 1.6)] : f < k(221.46) ? [mira(0, 260, 700, 1.05), mira(k(221.4), 640, 700, 1.15)] : [mira(k(234.7), s0 + 40, 800, 1.6), mira(k(241.2), s0 + 60, 820, 1.9, { curva: "inout" })]}
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
            {!sale && f >= k(234.7) && <div style={{ position: "absolute", right: 90, top: 150, fontFamily: F_HUD, fontWeight: 700, fontSize: 54, color: "#f4efe4", background: "rgba(10,18,40,0.9)", padding: "10px 30px", borderRadius: 16 }}>{`0:${String(Math.min(59, Math.floor(interpolate(f, [k(234.7), k(241)], [0, 59], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })))).padStart(2, "0")} → 1:00 h`}</div>}
            {sale && <div style={{ position: "absolute", right: 120, top: 250, fontFamily: F_HUD, fontWeight: 800, fontSize: 64, color: "#ff6a5a", background: "rgba(10,18,40,0.9)", padding: "10px 30px", borderRadius: 16, opacity: interpolate(f, [k(246.6), k(247)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>${Math.round(interpolate(f, [k(246.8), k(248)], [26012, 25942], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })).toLocaleString("en-US")} TO GO</div>}
            {sale && <div style={{ position: "absolute", right: 120, top: 150, fontFamily: F_HUD, fontWeight: 800, fontSize: 56, color: VERDE, background: "rgba(10,18,40,0.9)", padding: "10px 30px", borderRadius: 16, opacity: interpolate(f, [k(244.6), k(245)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>+$70</div>}
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
          hud={<div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center" }}><span style={cajaTxt(1)}>COVERS A <span style={{ color: VERDE }}>CO-WORKER'S SHIFT</span></span></div>} />
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
                  poses={[{ f: 0, v: "sentado" }, { f: k(272), v: dueño ? { hD: 60, cD: 60, pI: 85, rI: -80, pD: 88, rD: -85 } : "sentado" }, { f: k(278.4 + i * 0.27), v: dueño ? { hD: 140, cD: 20, pI: 85, rI: -80, pD: 88, rD: -85 } : { hD: 100, cD: 140, hI: 100, cI: 140, cabeza: -10, pI: 85, rI: -80, pD: 88, rD: -85 } }]} caras={[{ f: 0, v: "neutral" }, { f: k(278.4), v: dueño ? "picaro" : "duda" }]}
                  habla={[[k(278.4) + i * 8, k(281) + i * 8]]}
                  enManoD={dueño && tazas ? <Taza x={0} y={0} color={["#c23a2e", "#2a6fd6"][i / 2]} /> : undefined}
                  carteles={f > k(278.2) ? [{ claves: 0, texto: dueño ? "SELL: $7" : "BUY: $3", tam: 30, icono: "dolar", color: dueño ? VERDE : "#ffc94a", desde: k(278.2) + i * 6 }] : []} />
              );
            })}
          </>}
          hud={<>
            <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", opacity: interpolate(f, [k(280.4), k(280.7), k(283), k(283.1)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}><span style={cajaTxt(1)}>OWNERS ASK <span style={{ color: VERDE }}>≈ 2×</span> WHAT BUYERS PAY</span></div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 86, color: VERDE, opacity: interpolate(f, [k(283.1), k(283.4), k(286), k(286.3)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>SAME MUG.</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 80, color: "#ffc94a", opacity: interpolate(f, [k(286.3), k(286.7)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>THE ENDOWMENT EFFECT</div>
            <FuenteB texto="Kahneman, Knetsch & Thaler, Journal of Political Economy (1990)" desde={k(283.2)} hasta={k(292)} />
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
          claves={f < k(314.2) ? [mira(0, 760, 620, 1.3), mira(k(298.6), 760, 560, 1.7, { curva: "inout" }), mira(k(302.9), 900, 640, 1.9, { curva: "inout" }), mira(k(306.0), 930, 650, 2.05), mira(k(308.5), x9 - 200, 600, 1.4, { curva: "inout" })] : [mira(k(314.2), ch + 200, 600, 1.0), mira(k(317.48), ch + 600, 620, 0.8, { curva: "inout" })]}
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
          hud={f >= k(314.2) ? <div style={{ position: "absolute", right: 110, top: 160, fontFamily: F_HUD, fontWeight: 800, fontSize: 58, color: "#f4efe4", background: "rgba(10,18,40,0.9)", padding: "10px 30px", borderRadius: 16, opacity: interpolate(f, [k(315.6), k(316)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>50 PASSENGERS</div> : <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center" }}><span style={cajaTxt(interpolate(f, [k(302.9), k(303.2), k(308.2), k(308.48)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}>{f < k(305.96) ? <>NOT LOW. <span style={{ color: "#ff6a5a" }}>ZERO.</span></> : "AS IF NO ONE WOULD NOTICE"}</span></div>} />
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
            <Persona look={ROSA} seed={12} luz={RIM.cocina} ruta={[{ f: 0, x: TF_PUNTOS.sillaRosa - 230, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 60 }]}
              poses={[{ f: 0, v: "sentado" }, { f: k(332.5), v: { ...POSE_CELU_SENTADO } }]} caras={[{ f: 0, v: "feliz" }, { f: k(332.5), v: "neutral" }]} enManoD={(ff) => ff > k(332.6) ? <Celular s={0.9} brillo="#ffd27a" /> : null} cartel={{ claves: 1960000, tam: 30, rotulo: "ROSA" }} />
            <Persona look={OWEN_CASA} seed={47} luz={RIM.cocina} ruta={[{ f: 0, x: TF_PUNTOS.sillaRosa + 20, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 60 }]}
              poses={[{ f: 0, v: "sentado" }, { f: k(328.4), v: { hD: 40, cD: 50, pI: 85, rI: -80, pD: 88, rD: -85 } }, { f: k(334.0), v: { hD: 10, cD: 20, hI: -30, cI: 20, pI: 85, rI: -80, pD: 88, rD: -85, tronco: 10 } }, { f: k(335.4), v: "sentado" }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(328.4), v: "triste" }, { f: k(334.2), v: "sorpresa" }]} habla={[[k(328.4), k(330.1)]]} cartel={{ claves: 14000, tam: 28 }} />
            <GloboM x={TF_PUNTOS.sillaRosa + 60} y={P - 300} texto={"You okay?"} desde={k(328.4)} hasta={k(330.2)} tam={26} lado={1} />
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
      hud={<Estallido k={k} />} />
  ),
};
// el estallido del cartel: destello blanco, rayos que salen del cartel, billetes que vuelan, y la cuenta ×1.000 en caja
const Estallido: React.FC<{ k: K }> = ({ k }) => {
  const f = useF();
  const t = f - k(341.6);
  const fl = interpolate(t, [0, 3, 14], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const r = interpolate(t, [0, 20], [60, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (u) => 1 - Math.pow(1 - u, 3) });
  const ro = interpolate(t, [0, 4, 26], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const caja = interpolate(f, [k(348.1), k(348.5), k(355.3), k(355.6)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {t > 0 && Array.from({ length: 18 }).map((_, i) => { const a = (i / 18) * Math.PI * 2; return <line key={i} x1={960 + Math.cos(a) * r * 0.35} y1={400 + Math.sin(a) * r * 0.35} x2={960 + Math.cos(a) * r} y2={400 + Math.sin(a) * r} stroke={i % 2 ? "#7dff6a" : "#ffe36a"} strokeWidth={14} strokeLinecap="round" opacity={ro} />; })}
        {t > 0 && Array.from({ length: 14 }).map((_, i) => { const a = (i / 14) * Math.PI * 2 + 0.2; const d = interpolate(t, [0, 40], [0, 700 + (i % 3) * 120], { extrapolateRight: "clamp" }); const g = t * t * 0.12; return <g key={i} transform={`translate(${960 + Math.cos(a) * d},${400 + Math.sin(a) * d * 0.7 + g}) rotate(${t * (i % 2 ? 9 : -7)})`} opacity={interpolate(t, [30, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}><rect x={-40} y={-20} width={80} height={40} rx={4} fill="#7dc24a" stroke="#2a5a2a" strokeWidth={3} /><rect x={-10} y={-20} width={20} height={40} fill="#f4efe4" opacity={0.85} /></g>; })}
      </svg>
      <AbsoluteFill style={{ background: "#fff", opacity: fl }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center" }}>
        <span style={cajaTxt(caja, { fontSize: 58 })}>$4,700 <span style={{ color: "#ffc94a" }}>× 1,000</span> = <span style={{ color: VERDE }}>$4,700,000</span></span>
      </div>
    </AbsoluteFill>
  );
};

// ====================== 28 · el mensaje de la Dr. Hale; 43/47 ======================
const p28: PlanB = {
  a: 355.62, b: 367.38, trans: { tipo: "corte" },
  sfx: [[355.7, "phone_buzz", 0], [356.4, "phone_buzz", -2], [357.0, "type", -8, { dur: 6 }], [365.86, "glitch", 0], [366.0, "slam", -2]],
  el: (k) => (
    <AbsoluteFill style={{ background: "linear-gradient(#2a2232, #120e16)" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, rgba(122,184,255,0.25), rgba(0,0,0,0) 55%)" }} />
      <ZoomCelu k={k} />
    </AbsoluteFill>
  ),
};
// la cámara se acerca a la notificación mientras se escribe; al final el contador baja a 43
const ZoomCelu: React.FC<{ k: K }> = ({ k }) => {
  const f = useF();
  const z = interpolate(f, [0, k(358.6), k(361.0), k(365.5), k(366.2)], [1.05, 1.15, 1.75, 1.8, 1.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (u) => u * u * (3 - 2 * u) });
  const b = interpolate(f, [k(365.86), k(366.1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 30%" }}>
        <CeluMensaje de="HALDEN CLINIC · DR. IMANI HALE" lineas={["Week 4 complete, participant 47.", "You're doing better than expected."]} desde={0} escribe={k(359.5)} vibra={2} esc={1.05} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center" }}>
        <span style={cajaTxt(b, { fontSize: 60 })}>PARTICIPANTS LEFT: <span style={{ color: "#ff6a5a" }}>43 OF 47</span></span>
      </div>
    </AbsoluteFill>
  );
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
          claves={[mira(0, ch + 100, 600, 1.8), mira(k(371.8), 1300, 620, 0.95, { curva: "inout" }), mira(k(379.4), 1700, 620, 1.0), mira(k(381.4), 1250, 640, 1.45, { curva: "inout" }), mira(k(387.6), 1900, 640, 1.45, { curva: "inout" }), mira(k(394.4), 1500, 600, 1.1, { curva: "inout" })]}
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
            <div style={{ position: "absolute", right: 100, top: 150, fontFamily: F_HUD, fontWeight: 800, fontSize: 54, color: "#f4efe4", background: "rgba(10,18,40,0.9)", padding: "10px 30px", borderRadius: 16, opacity: interpolate(f, [k(370.8), k(371.2), k(378.6), k(379.2)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>50 PASSENGERS · 50 SCREENS</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: F_HUD, fontWeight: 800, fontSize: 70, color: "#ffc94a", opacity: interpolate(f, [k(379.6), k(380)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 3px 14px rgba(0,0,0,0.7)" }}><span style={{ background: "rgba(10,18,40,0.9)", padding: "10px 30px", borderRadius: 16 }}>NEXT WEEK: <span style={{ color: "#f4efe4" }}>SCREEN TIME</span></span></div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 100, textAlign: "center", fontFamily: F_HUD, fontWeight: 800, fontSize: 52, color: "#f4efe4", opacity: interpolate(f, [k(387.5), k(388)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}><span style={{ background: "rgba(10,18,40,0.9)", padding: "10px 30px", borderRadius: 16 }}>WHAT NUMBER WOULD FLOAT OVER <span style={{ color: "#ffc94a" }}>YOUR</span> HEAD? · <span style={{ color: "#ff5a4a" }}>SUBSCRIBE</span></span></div>
          </>} />
      );
    };
    return <Pl />;
  },
};

export const PLANOS_OB04: PlanB[] = [p01, p01b, p01c, p03, p03b, p03c, p04, p04b, p05, p06, p06b, p06c, p07, p07b, p09, p10, p11, p12, p12b, p12c, p12d, p13, p13b, p13c, p13d, p14, p14b, p14c, p14d, p14e, p14f, p15, p15b, p15c, p16, p16b, p16c, p17, p17b, p18, p18b, p19, p19b, p19c, p19d, p20, p20b, p21, p22, p23, p24, p25, p26, p27, p28, p29];
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
