// ob01 · planos 1-20 (0 → 128,5 s): cuadro 0, despertar, Rosa 64, espejo 47, flashback Halden, ciencia, garaje, primeras paradas.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Actor } from "../../anikit/actor";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { Calendario, Contador, EtiquetaFlotante, Globo, MarcaCorto, Pildora, F_HUD } from "../../anikit/pantalla";
import { Lata, Taza } from "../../anikit/props";
import { PAL, OWEN, OWEN_CASA, ROSA, TINY, HALE, ABERNATHY, TEEN, SCRUBS, RUNNER, VERDE } from "../elenco";
import { BusInterior, BUS_PISO, BUS_PUNTOS, ASIENTO_X, Bus9 } from "../mundo/bus";
import { Ashland, ASH_CARRIL } from "../mundo/ashland";
import { TwoFlatCorte, TwoFlatFuera, TF_PISO, TF_ARRIBA, TF_PUNTOS, escalon } from "../mundo/twoflat";
import { Garaje, GAR_PISO, GAR_PUNTOS, MostradorDespacho } from "../mundo/garaje";
import { Halden, HAL_PISO, HAL_PUNTOS, MostradorHalden, Formulario } from "../mundo/halden";
import { AdnCpG, DosRelojes, Pizarra } from "../ciencia";
import { Etq, HudOwen, Marco, Notas, Mano } from "../comun";
import { EnBus, ESC, kDe, OwenAlVolante, Pas, Pasajero } from "./base";
import { Participantes47 } from "../ob03/planos";

export const ROJO_OWEN = "#ff5a4a";
const P = TF_PISO, A = TF_ARRIBA;

// ---------- 1 · CUADRO 0 = la miniatura sin texto (bus al ocaso) ----------
const PAS_MINI: Pas[] = [
  { look: TEEN, ruta: [{ f: 0, x: ASIENTO_X(1), y: BUS_PISO }], dir: [{ f: 0, v: -1 }], sentado: 0, poses: [{ f: 0, v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 40, cD: 100, hI: 25, cI: 50 } }], caras: [{ f: 0, v: "cansado" }], enManoD: <Lata color="#2fd16a" />, n: 31, edad: "REAL AGE", desde: -30, seed: 3 },
  { look: ABERNATHY, ruta: [{ f: 0, x: ASIENTO_X(3), y: BUS_PISO }], dir: [{ f: 0, v: -1 }], sentado: 0, caras: [{ f: 0, v: "feliz" }], n: 58, edad: "REAL AGE", desde: -30, seed: 2 },
];
const ReflejoOwen: React.FC<{ hora?: "ocaso" | "manana" | "dia" | "tarde"; cara?: string }> = ({ hora = "ocaso", cara = "sorpresa" }) => (
  <Escena Set={BusInterior} pal={PAL} claves={[mira(0, BUS_PUNTOS.chofer - 10, BUS_PISO - 300, 3.2)]} setProps={{ hora }} medio={<OwenAlVolante o={{ caras: [{ f: 0, v: cara }] }} />} />
);
// cuadro 0 = la miniatura sin texto (en espejo: Owen a la izquierda mirando a cámara, pasajeros a la derecha, el 47 rojo en el retrovisor)
const PAS_P01: Pas[] = [
  { ...PAS_MINI[0], n: undefined },
  { ...PAS_MINI[1], ruta: [{ f: 0, x: ASIENTO_X(2), y: BUS_PISO }], n: undefined },
];
export const P01Mini: React.FC = () => {
  const cl = [mira(0, 620, 640, 2.0), mira(24, 616, 640, 2.05)];
  return (
    <AbsoluteFill>
      <Escena Set={BusInterior} pal={PAL} claves={cl} seed={1} setProps={{ hora: "ocaso" }}
        medio={<>
          <OwenAlVolante o={{ caras: [{ f: 0, v: "sorpresa" }], miradas: [{ f: 0, v: { x: 0.2, y: 0 } }], giros: [{ f: 0, v: 0.6 }] }} />
          {PAS_P01.map((p, i) => <Pasajero key={i} p={p} />)}
        </>} />
      <EtiquetaFlotante x={1360} y={470} rotulo="REAL AGE" claves={31} desde={-30} color={VERDE} tam={88} />
      <EtiquetaFlotante x={1770} y={430} rotulo="REAL AGE" claves={58} desde={-30} color={VERDE} tam={88} />
      <Marco x={100} y={70} w={560} h={310} radio={70} espejar><ReflejoOwen /></Marco>
      <div style={{ position: "absolute", left: 500, top: 250, fontFamily: F_HUD, fontWeight: 700, fontSize: 100, color: ROJO_OWEN, textShadow: "0 0 24px rgba(255,90,74,0.8), 0 4px 12px rgba(0,0,0,0.6)" }}>47</div>
      <MarcaCorto />
    </AbsoluteFill>
  );
};

// ---------- 2 · REBOBINADO: la tarde vuelve a las 5:12 AM ----------
export const P02Rebobina: React.FC = () => {
  const f = useF();
  const u = interpolate(f, [0, 30], [0, 1], { extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) });
  const min = 18 * 60 + 40 - u * (18 * 60 + 40 - (5 * 60 + 12));
  const m = Math.floor(min), h = Math.floor(m / 60), h12 = h % 12 === 0 ? 12 : h % 12;
  const cl = [mira(0, 770, 640, 1.36), mira(33, 760, 620, 1.0)];
  return (
    <AbsoluteFill>
      <EnBus cl={cl} hora={u < 0.5 ? "ocaso" : "alba"} part={null} pas={PAS_MINI.map((p) => ({ ...p, n: undefined }))} owen={{ caras: [{ f: 0, v: "sorpresa" }] }} />
      <AbsoluteFill style={{ background: "#0e1430", opacity: 0.25 + 0.6 * u }} />
      {Array.from({ length: 14 }).map((_, k) => <div key={k} style={{ position: "absolute", left: ((k * 263 + f * 90) % 2200) - 200, top: 80 + k * 70, width: 300, height: 4, background: "#f4efe4", opacity: 0.25 * (1 - u) }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 220, color: "#f4efe4", fontVariantNumeric: "tabular-nums", textShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
        {h12}:{String(m % 60).padStart(2, "0")} <span style={{ fontSize: 110 }}>{h < 12 ? "AM" : "PM"}</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3 · 5:12, el radiador ----------
export const P03Despierta: React.FC = () => {
  const f = useF();
  const k = kDe(1.9);
  const cl = [mira(0, 380, A - 200, 2.1), mira(k(3.0), 120, A - 170, 1.8, { curva: "inout" }), mira(k(5.0), 250, A - 190, 1.7, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={3} setProps={{ hora: "noche", luzCocina: false, luzBaño: false, luzDorm: true, radiador: (ff: number) => ff > k(2.5) && ff % 10 < 6 }}
      medio={<Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.cama + 140, y: A }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: { tronco: 30, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 35, cD: 55 } }, { f: 20, v: "sentado" }, { f: k(3.0), v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 45, cD: 140 } }, { f: k(4.4), v: "sentado" }]}
        asiento={[{ f: 0, v: 110 }]} caras={[{ f: 0, v: "cansado" }, { f: k(2.6), v: "enojo" }, { f: k(4.6), v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.2, y: 0.2 } }, { f: k(2.6), v: { x: -1, y: 0.3 } }]} />}
      hud={<HudOwen min={312} part={null} />} />
  );
};

// ---------- 4 · la fachada de Paulina St ----------
export const P04Fachada: React.FC = () => {
  const f = useF();
  // 26-oct (ojo director 4/10: fachada quieta): se prende la luz de Owen, su silueta cruza la ventana, pasa un corredor y el diariero tira el diario
  const x0 = TF_PUNTOS.puerta - 415, wy = P - 680;
  const luz = interpolate(f, [14, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sx = interpolate(f, [26, 80], [x0 + 40, x0 + 260], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const diario = interpolate(f, [40, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dX = interpolate(diario, [0, 1], [TF_PUNTOS.puerta + 420, TF_PUNTOS.puerta + 40]), dY = P - 40 - Math.sin(diario * Math.PI) * 180;
  return (
    <Escena Set={TwoFlatFuera} pal={PAL} claves={[mira(0, 900, 560, 0.9), mira(99, 1180, 500, 1.12, { curva: "inout" })]} seed={4} setProps={{ hora: "alba" }}
      medio={<>
        <defs><clipPath id="p04ven"><rect x={x0 + 55} y={wy} width={210} height={170} /></clipPath></defs>
        <g clipPath="url(#p04ven)" opacity={luz}>
          <rect x={x0 + 55} y={wy} width={210} height={170} fill="#ffd98a" opacity={0.85} />
          <g transform={`translate(${sx},${wy + 175})`} fill="#3a2a22" opacity={0.85}>
            <circle cx={0} cy={-128} r={24} /><rect x={-26} y={-104} width={52} height={104} rx={20} />
          </g>
        </g>
        <Halo x={x0 + 160} y={wy + 85} r={220} color="#ffd98a" fuerza={0.35 * luz} />
        <Actor look={RUNNER} escala={ESC * 1.15} seed={41} ruta={[{ f: 0, x: 300, y: P + 60 }, { f: 99, x: 1900, y: P + 60, curva: "lineal" }]} correr={1} caras={[{ f: 0, v: "feliz" }]} />
        {diario > 0 && diario < 1.01 && <g transform={`translate(${dX},${dY}) rotate(${diario * 540})`}><rect x={-34} y={-12} width={68} height={24} rx={6} fill="#efe8d8" stroke="#8a847a" strokeWidth={3} /><rect x={-6} y={-12} width={12} height={24} fill="#c0392b" /></g>}
      </>}
      hud={<><Pildora texto="S PAULINA ST · 5:13 AM" x={960} y={190} desde={8} color="#f4efe4" /><HudOwen min={313} part={null} /></>} />
  );
};

// ---------- 5 · Rosa tararea con el café ----------
const ROSA_COCINA = TF_PUNTOS.cocina + 90;
export const P05Rosa: React.FC = () => {
  const k = kDe(9.5);
  const rev = Array.from({ length: 9 }).map((_, i) => ({ f: i * 18, v: { hD: 55 + (i % 2) * 18, cD: 60 - (i % 2) * 20 } }));
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={[mira(0, 520, P - 260, 1.45), mira(k(14.9), 430, P - 260, 1.7, { curva: "inout" })]} seed={5} setProps={{ hora: "alba", luzBaño: false }}
      medio={<>
        <Actor look={ROSA} escala={ESC} seed={5} ruta={[{ f: 0, x: ROSA_COCINA, y: P }]} dir={[{ f: 0, v: -1 }]} poses={rev} caras={[{ f: 0, v: "feliz" }]} habla={[[0, 400]]} miradas={[{ f: 0, v: { x: -0.4, y: 0.5 } }]} />
        <Notas x={ROSA_COCINA - 40} y={P - 300} />
      </>}
      hud={<HudOwen min={315} part={null} />} />
  );
};

// ---------- 6 · Owen baja la escalera y entra ----------
export const P06Baja: React.FC = () => {
  const k = kDe(14.9);
  const ruta = [{ f: 0, ...escalon(14) }, ...[10, 6, 2].map((s, i) => ({ f: Math.round(((i + 1) / 4) * k(16.4)), ...escalon(s), curva: "lineal" as const })), { f: k(16.4), ...escalon(0), curva: "lineal" as const }, { f: k(17.6), x: 830, y: P, curva: "out" as const }];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={[mira(0, 1700, A + 150, 1.0), mira(k(16.4), 1250, P - 250, 1.1, { curva: "inout" }), mira(k(17.9), 760, P - 250, 1.2, { curva: "inout" })]} seed={6} setProps={{ hora: "alba", luzBaño: false }}
      medio={<>
        <Actor look={ROSA} escala={ESC} seed={5} ruta={[{ f: 0, x: ROSA_COCINA, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 60, cD: 60 } }]} caras={[{ f: 0, v: "feliz" }]} habla={[[0, 90]]} />
        <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={ruta} caras={[{ f: 0, v: "cansado" }, { f: k(17.5), v: "sorpresa" }]} />
      </>}
      hud={<HudOwen min={316} part={null} />} />
  );
};

// ---------- 7 · el número de Rosa: 64 (tiene 81) ----------
export const P07Numero: React.FC = () => {
  const f = useF();
  const k = kDe(17.9);
  const brillo = interpolate(f, [k(18.2), k(22.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 26-oct (ojo 5/10): 3 beats con cámara — Rosa revuelve y tararea, golpe de cámara al 64, Owen se inclina y se frota los ojos
  const cl = [mira(0, 640, P - 250, 1.7), mira(k(21.8), 520, P - 280, 1.9, { curva: "inout" }), mira(k(22.8), 560, P - 300, 2.1, { curva: "out" }), mira(k(25.0), 570, P - 290, 2.05), mira(k(25.7), 640, P - 260, 1.85, { curva: "inout" })];
  const rev = Array.from({ length: 14 }).map((_, i) => ({ f: i * 16, v: { hD: 55 + (i % 2) * 18, cD: 60 - (i % 2) * 20 } }));
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={7} setProps={{ hora: "alba", luzBaño: false }}
      medio={<>
        <Halo x={ROSA_COCINA} y={P - 320} r={60 + 80 * brillo} color={VERDE} fuerza={0.5 * brillo * (f < k(22.84) ? 1 : 0.4)} />
        <Actor look={ROSA} escala={ESC} seed={5} ruta={[{ f: 0, x: ROSA_COCINA, y: P }]} dir={[{ f: 0, v: -1 }, { f: k(26.5), v: 1 }]} poses={[...rev, { f: k(26.5), v: "parado" }]} caras={[{ f: 0, v: "feliz" }]} habla={[[0, 60], [90, 150]]} miradas={[{ f: 0, v: { x: -0.4, y: 0.5 } }]} />
        <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: 830, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, { f: k(22.8), v: { tronco: 14, cabeza: 12, hD: 30, cD: 40 } }, { f: k(24.6), v: "parado" }, { f: k(25.7), v: "manosCara" }, { f: k(27.0), v: "parado" }]} caras={[{ f: 0, v: "neutral" }, { f: k(22.8), v: "sorpresa" }, { f: k(25.7), v: "cansado" }, { f: k(26.9), v: "sorpresa" }]} />
      </>}
      hud={<>
        <Etq cl={cl} x={ROSA_COCINA} y={P - 300} n={64} desde={k(22.7)} tam={78} />
        <Pildora texto="ROSA · 81 YEARS OLD" x={960} y={950} desde={k(24.3)} color="#f4efe4" />
        <HudOwen min={317} part={null} />
      </>} />
  );
};

// ---------- 8 · la taza ----------
export const P08Taza: React.FC = () => {
  const k = kDe(27.7);
  const pasa = k(28.9);
  const cl = [mira(0, 650, P - 250, 1.6)];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={8} setProps={{ hora: "alba", luzBaño: false }}
      medio={<>
        <Actor look={ROSA} escala={ESC} seed={5} ruta={[{ f: 0, x: ROSA_COCINA + 120, y: P }, { f: pasa, x: 650, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 70, cD: 30 } }, { f: pasa, v: { hD: 85, cD: 10 } }, { f: pasa + 14, v: "parado" }]} caras={[{ f: 0, v: "feliz" }, { f: k(29.5), v: "duda" }]} habla={[[k(28.3), k(30.2)]]} enManoD={(ff: number) => (ff < pasa + 4 ? <Taza vapor={1} f={ff} /> : null)} />
        <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: 830, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, { f: pasa, v: { hD: 80, cD: 20 } }, { f: pasa + 16, v: { hD: 30, cD: 100 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(30.2), v: "neutral" }]} enManoD={(ff: number) => (ff >= pasa + 4 ? <Taza vapor={1} f={ff} /> : null)} />
      </>}
      hud={<>
        <Globo texto="Why are you staring at my hair?" x={700} y={300} desde={k(28.0)} hasta={k(31.2)} cola="abajo" tam={40} />
        <HudOwen min={318} part={null} />
      </>} />
  );
};

// ---------- 9 · el espejo del baño: 47 ----------
const ESP = TF_PUNTOS.espejo;
export const P09Espejo: React.FC = () => {
  const k = kDe(31.2);
  const cl = [mira(0, 980, A - 240, 1.7), mira(k(34.5), 1070, A - 300, 2.4, { curva: "inout" }), mira(k(39.6), 1110, A - 320, 3.0, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={9} setProps={{ hora: "alba", luzBaño: true }}
      medio={<>
        <defs><clipPath id="espbano"><rect x={ESP - 80} y={A - 410} width={160} height={180} rx={10} /></clipPath></defs>
        <g clipPath="url(#espbano)">
          <rect x={ESP - 80} y={A - 410} width={160} height={180} fill="#cfe0e4" />
          <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: ESP + 30, y: A }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "cansado" }, { f: k(35.6), v: "miedo" }]} />
          <rect x={ESP - 80} y={A - 410} width={160} height={180} fill="#aac6cf" opacity={0.22} />
        </g>
        <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.puertaBaño - 60, y: A }, { f: k(33.2), x: ESP - 150, y: A }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: k(35.6), v: "encogerse" }]} caras={[{ f: 0, v: "cansado" }, { f: k(35.6), v: "miedo" }]} />
      </>}
      hud={<>
        <Etq cl={cl} x={ESP + 30} y={A - 320} n={47} desde={k(35.8)} color={ROJO_OWEN} tam={70} />
        <Pildora texto="OWEN · 29 YEARS OLD" x={960} y={950} desde={k(37.7)} color="#f4efe4" />
        <HudOwen min={320} part={null} />
      </>} />
  );
};

// ---------- 10 · flashback: Halden Clinic, 3 días antes ----------
export const P10Halden: React.FC = () => {
  const f = useF();
  const k = kDe(39.7);
  const HP = HAL_PISO;
  // 26-oct (ojo 5/10: muñecos diminutos): planos más cerrados — firma en primer plano, cuenta, tablet, Hale de cerca
  const cl = [mira(0, HAL_PUNTOS.silla - 100, HP - 260, 1.9), mira(k(43.6), HAL_PUNTOS.silla - 120, HP - 280, 2.0), mira(k(44.2), 1060, HP - 300, 1.6, { curva: "inout" }), mira(k(49.4), 1240, HP - 250, 3.0, { curva: "inout" }), mira(k(52.4), 980, HP - 230, 1.75, { curva: "inout" }), mira(k(54.2), HAL_PUNTOS.recepcion + 120, HP - 250, 2.1, { curva: "inout" })];
  const firma = interpolate(f, [k(40.6), k(43.0)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Halden} pal={PAL} claves={cl} seed={10} setProps={{ hora: "manana", tablet: "47 / 47" }}
      medio={<>
        <Actor look={HALE} escala={ESC} seed={8} ruta={[{ f: 0, x: HAL_PUNTOS.recepcion, y: HP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: 10, v: { hD: 80, cD: 10 } }, { f: 40, v: "parado" }, { f: k(44.2), v: "señalar" }, { f: k(46.0), v: "parado" }, { f: k(49.6), v: { hD: 70, cD: 60, hI: 70, cI: 60 } }, { f: k(51.0), v: "parado" }, { f: k(54.2), v: "hablar" }]} caras={[{ f: 0, v: "feliz" }]} habla={[[8, 40], [k(44.2), k(46.0)], [k(54.3), k(56.8)]]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }]} />
        <MostradorHalden />
        <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: HAL_PUNTOS.silla - 140, y: HP }]} dir={[{ f: 0, v: 1 }]} poses={[...Array.from({ length: 8 }).map((_, i) => ({ f: k(40.6) + i * 9, v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 60 + (i % 2) * 16, cD: 40 - (i % 2) * 14, hI: 25, cI: 50, cabeza: 14 } })), { f: k(44), v: "sentado" }, { f: k(46.4), v: { tronco: -6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 150, cD: 20 } }, { f: k(48.0), v: "sentado" }, { f: k(49.6), v: { tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 60, cD: 80, hI: 60, cI: 100, cabeza: 18 } }, { f: k(51.2), v: "sentado" }]} asiento={[{ f: 0, v: 120 }]} caras={[{ f: 0, v: "determinado" }, { f: k(46), v: "feliz" }, { f: k(54.5), v: "duda" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: k(44), v: { x: -1, y: 0 } }, { f: k(49.6), v: { x: 0.2, y: 0.8 } }, { f: k(51.2), v: { x: -1, y: 0 } }]} />
      </>}
      hud={<>
        <Calendario texto="3 DAYS AGO" desde={0} hasta={k(44)} />
        {f < k(44.2) && <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><Formulario x={1560} y={760 + Math.max(0, 20 - f) * 20} s={1.4} firma={firma} rot={-5} /></svg>}
        <Pildora texto="12 WEEKS · $4,700" x={960} y={160} desde={k(44.2)} hasta={k(49.4)} color={VERDE} />
        <Mano texto="= grandma's hip surgery" x={1240} y={300} desde={k(46.4)} hasta={k(49.4)} color="#ffd27a" tam={64} />
        <Pildora texto="PARTICIPANT 47 OF 47" x={960} y={900} desde={k(51.2)} hasta={k(54.0)} color="#f4efe4" />
        <Contador lineas={[{ etiqueta: "PARTICIPANTS", claves: "47/47", color: VERDE }]} tam={38} desde={k(51.2)} />
        <Globo texto="Side effects: mild and temporary." x={830} y={330} desde={k(54.3)} hasta={k(57.2)} cola="abajo" tam={48} />
        <HudOwen part={null} />
      </>} />
  );
};

// ---------- 11 · WEEK 1 ----------
export const P11Semana: React.FC = () => {
  const k = kDe(57.2);
  return (
    <AbsoluteFill>
      <Pizarra><Participantes47 desde={4} apaga={99999} owen={k(58.0)} fuera={[]} /></Pizarra>
      <Mano texto="WEEK 1" x={960} y={170} desde={0} color="#f4efe4" tam={150} />
      <Pildora texto="THE PART THAT ISN'T MADE UP ↓" x={960} y={880} desde={k(58.6)} color={VERDE} tam={44} />
      <HudOwen part="47/47" />
    </AbsoluteFill>
  );
};

export const P12DosEdades: React.FC = () => <AbsoluteFill><DosRelojes cal={29} bio={29} titulo="YOUR BODY KEEPS TWO AGES" /><HudOwen part="47/47" /></AbsoluteFill>;
export const P13Adn: React.FC = () => <AbsoluteFill><AdnCpG n={353} desde={kDe(66.4)(72.5)} /><HudOwen part="47/47" /></AbsoluteFill>;
export const P14NoCoinciden: React.FC = () => {
  const k = kDe(80.9);
  return (
    <AbsoluteFill>
      <DosRelojes cal={29} bio={47} titulo="OWEN" />
      <Mano texto="+18 YEARS" x={960} y={930} desde={k(86.0)} color={ROJO_OWEN} tam={90} />
      <HudOwen part="47/47" />
    </AbsoluteFill>
  );
};

// ---------- 15 · garaje de la 74th, Tiny golpea la hoja ----------
export const P15Garaje: React.FC = () => {
  const f = useF();
  const k = kDe(88.7);
  const golpe = k(95.2);
  const hoja = (ff: number) => (ff < golpe ? 0 : Math.max(0, 1 - (ff - golpe) / 8));
  const cl = [mira(0, 700, GAR_PISO - 280, 1.15), mira(k(92), 560, GAR_PISO - 270, 1.45, { curva: "inout" })];
  return (
    <Escena Set={Garaje} pal={PAL} claves={cl} seed={15} setProps={{ hora: "alba", hoja }}
      medio={<>
        <Actor look={TINY} escala={ESC * 1.1} seed={7} ruta={[{ f: 0, x: GAR_PUNTOS.ventanilla, y: GAR_PISO }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "brazosCruzados" }, { f: golpe - 12, v: { hD: 150, cD: 30 } }, { f: golpe, v: { hD: 75, cD: -5, tronco: 10 } }, { f: golpe + 20, v: "manosCintura" }]} caras={[{ f: 0, v: "picaro" }, { f: golpe, v: "risa" }]} habla={[[golpe + 4, golpe + 40]]} />
        <MostradorDespacho />
        <Actor look={OWEN} escala={ESC} seed={6} ruta={[{ f: 0, x: 1250, y: GAR_PISO }, { f: k(91.8), x: GAR_PUNTOS.mostrador + 120, y: GAR_PISO }]} caras={[{ f: 0, v: "cansado" }, { f: golpe, v: "sorpresa" }, { f: golpe + 15, v: "cansado" }]} />
      </>}
      hud={<>
        <Pildora texto="74TH STREET GARAGE" x={960} y={950} desde={k(89)} hasta={k(92.5)} color="#f4efe4" />
        <Pildora texto="DISPATCHER MARCUS «TINY»" x={960} y={950} desde={k(92.8)} hasta={k(96.8)} color="#ffd27a" />
        <HudOwen min={340} part="47/47" />
      </>} />
  );
  void f;
};

// ---------- 16 · la ruta 9 por fuera ----------
export const P16Ruta: React.FC = () => {
  const k = kDe(96.8);
  const bx = (ff: number) => 400 + ff * 15;
  const cam = (ff: number) => 1400 + ff * 3.75;
  const cl = [mira(0, cam(0), 820, 0.55), mira(240, cam(240), 820, 0.55)];
  const f = useF();
  return (
    <Escena Set={Ashland} pal={PAL} claves={cl} seed={16} setProps={{ hora: "alba", centro: cam, paradas: [{ x: 3000, num: 1, refugio: true }] }}
      medio={<Bus9 x={bx(f)} y={ASH_CARRIL} esc={0.62} dir={1} hora="alba" rueda={f * 9} />}
      hud={<>
        <Pildora texto="ROUTE 9 · ASHLAND AVENUE" x={960} y={950} desde={k(97.2)} hasta={k(99.0)} color="#ffb02e" />
        <Pildora texto="17 MILES · NORTH TO SOUTH AND BACK" x={960} y={950} desde={k(99.1)} hasta={k(102.2)} color="#ffb02e" />
        <Pildora texto="~400 FACES A SHIFT" x={960} y={950} desde={k(102.3)} color="#ffb02e" />
        <HudOwen min={345} part="47/47" />
      </>} />
  );
};

// ---------- 17 · el número de Tiny ----------
export const P17Tiny: React.FC = () => {
  const k = kDe(103.8);
  const cl = [mira(0, 470, GAR_PISO - 340, 2.0), mira(72, 450, GAR_PISO - 350, 2.2)];
  return (
    <Escena Set={Garaje} pal={PAL} claves={cl} seed={17} setProps={{ hora: "alba" }}
      medio={<>
        <Actor look={TINY} escala={ESC * 1.1} seed={7} ruta={[{ f: 0, x: GAR_PUNTOS.ventanilla, y: GAR_PISO }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "manosCintura" }]} caras={[{ f: 0, v: "risa" }, { f: 30, v: "picaro" }]} habla={[[0, 30]]} />
        <MostradorDespacho />
      </>}
      hud={<><Etq cl={cl} x={GAR_PUNTOS.ventanilla} y={GAR_PISO - 360} n={61} edad={50} desde={k(104.6)} /><HudOwen min={341} part="47/47" /></>} />
  );
};

// ---------- 18 · sube al bus, se abren las puertas ----------
export const P18Puertas: React.FC = () => {
  const k = kDe(106.2);
  const llega = k(108.1);
  const avance = (ff: number) => 600 - Math.max(0, llega - ff) ** 2 * 0.06;
  const puertaF = (ff: number) => interpolate(ff, [k(108.3), k(108.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <EnBus cl={[mira(0, 380, 660, 1.75), mira(k(110.9), 470, 650, 1.55, { curva: "inout" })]} hora="alba" min={360} avance={avance} puertaF={puertaF} paradas={[{ a: 600, num: 1 }]}
      owen={{ caras: [{ f: 0, v: "cansado" }, { f: k(109.6), v: "sorpresa" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }, { f: k(108.4), v: { x: 1, y: 0.1 } }], giros: [{ f: 0, v: 0 }, { f: k(108.4), v: 0.7 }] }} />
  );
};

// ---------- 19 · suben: teen 31, scrubs 52, runner 33 ----------
export const P19Suben: React.FC = () => {
  const k = kDe(110.9);
  const sube = (t0: number, destino: number, vale: number) => [{ f: k(t0), x: BUS_PUNTOS.puertaF + 40, y: BUS_PISO }, { f: k(t0) + 22, x: BUS_PUNTOS.validador + 40, y: BUS_PISO, curva: "out" as const }, { f: k(vale), x: BUS_PUNTOS.validador + 40, y: BUS_PISO }, { f: k(vale) + 50, x: destino, y: BUS_PISO }];
  const pas: Pas[] = [
    { look: TEEN, ruta: sube(111.0, 1380, 112.2), poses: [{ f: 0, v: "parado" }, { f: k(113.6), v: "agarrarAlto" }], caras: [{ f: 0, v: "cansado" }], enManoI: <Lata color="#2fd16a" />, n: 31, edad: 19, desde: k(115.0), seed: 3 },
    { look: SCRUBS, ruta: sube(115.4, ASIENTO_X(2), 116.4), sentado: k(116.4) + 52, caras: [{ f: 0, v: "cansado" }], n: 52, edad: 44, desde: k(119.1), seed: 11 },
    { look: RUNNER, ruta: sube(119.5, 1740, 120.2), poses: [{ f: 0, v: "parado" }, { f: k(121.9), v: "agarrarAlto" }], caras: [{ f: 0, v: "feliz" }], n: 33, edad: 40, desde: k(122.1), seed: 12 },
  ];
  const pasV = pas.map((p) => ({ ...p, aparece: p.ruta[0].f }));
  const cl = [mira(0, 560, 650, 1.45), mira(k(114.6), 980, 640, 1.3, { curva: "inout" }), mira(k(115.8), 700, 650, 1.35, { curva: "inout" }), mira(k(118.9), 900, 660, 1.3, { curva: "inout" }), mira(k(120.4), 800, 650, 1.25, { curva: "inout" }), mira(k(122.0), 1400, 650, 1.25, { curva: "inout" })]; // 26-oct: pasajeros separados ≥320 px para que los rótulos 31/52/33 no se pisen
  return (
    <EnBus cl={cl} hora="manana" min={368} avance={() => 600} puertaF={() => 1} paradas={[{ a: 600, num: 1 }]} pas={pasV}
      owen={{ caras: [{ f: 0, v: "sorpresa" }, { f: k(116), v: "duda" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }], giros: [{ f: 0, v: 0.6 }] }} />
  );
};

// ---------- 20 · cuentas en cada semáforo ----------
export const P20Cuentas: React.FC = () => {
  const k = kDe(123.4);
  const f = useF();
  return (
    <EnBus cl={[mira(0, 330, BUS_PISO - 250, 2.3), mira(150, 300, BUS_PISO - 260, 2.5)]} hora="manana" min={375} avance={() => 2000}
      owen={{ caras: [{ f: 0, v: "duda" }, { f: k(127), v: "determinado" }], miradas: [{ f: 0, v: { x: 0.3, y: -0.6 } }] }}
      detras={<g transform={`translate(40,${BUS_PISO - 470})`}><rect x={-22} y={-60} width={44} height={120} rx={10} fill="#1d1f24" /><circle cy={-34} r={14} fill={f % 40 < 38 ? "#ff3d2e" : "#5a1a14"} /><circle cy={0} r={14} fill="#3a3a20" /><circle cy={34} r={14} fill="#163a20" /><rect x={-4} y={60} width={8} height={300} fill="#3a3f46" /></g>}
      hud={<>
        <Mano texto="31 − 19 = +12" x={1250} y={300} desde={k(125.4)} color={VERDE} tam={60} />
        <Mano texto="52 − 44 = +8" x={1290} y={420} desde={k(126.2)} color={VERDE} tam={60} />
        <Mano texto="33 − 40 = −7" x={1270} y={540} desde={k(127.0)} color="#ffd27a" tam={60} />
      </>} />
  );
};

export { ABERNATHY };
