// oldtech01v2 · BLOQUE A (137,16–286,50 s, línea de 20 min) — Pompeya: las termas Estabianas y del Foro, el recorrido
// apodyterium → tepidarium → caldarium → laconicum → frigidarium como gradiente de calor, las tres calderas de Vitruvio,
// el brasero de Vaccula y Séneca viviendo arriba de un baño.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { ClayMap } from "./ClayMap";
import { Hypo3D, Fase, HypoKey, PH } from "./Hypo3D";
import { Place, ThermalDefs, Embers, BigWord, Letterbox } from "./comps";
import { Term } from "./comps2";
import { WaxTablet, EmberForm } from "./comps3";
import { BathRoute, TankChain } from "./comps4";

export const OFFA = 137.16;
const T = "oldtech01v2/t2v/", R = "oldtech01v2/real/", F = "oldtech01v2/foto/";
type SA = Shot & { k?: string };
const ABS: SA[] = [
  { a: 137.16, b: 141.2, comp: "pompmap", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5], out: { type: "dissolve", d: 0.5 } },
  { a: 141.2, b: 143.6, v: R + "r855239", from: 1, rate: 1, out: { type: "whip", vx: 1 } },
  { a: 143.6, b: 145.7, v: R + "r20606531", from: 1, rate: 1, out: { type: "flash" } },
  { a: 145.7, b: 149.5, v: R + "r5966226", from: 2, rate: 1, cam: [1.05, 0.5, 0.5, 1.25, 0.5, 0.35], out: { type: "white", d: 0.4 } },
  { a: 149.5, b: 152.2, img: F + "e4cd8bc0.jpg", cam: [1.05, 0.5, 0.45, 1.22, 0.5, 0.3], out: { type: "dissolve", d: 0.4 } },
  { a: 152.2, b: 154.66, img: F + "1418572e.jpg", cam: [1.2, 0.5, 0.6, 1.05, 0.5, 0.5], out: { type: "whip", vx: -1 } },
  { a: 154.66, b: 160.72, v: R + "r7046815", from: 0, rate: 1, out: { type: "zoom", fx: 0.5, fy: 0.5 } },
  { a: 160.72, b: 163.4, img: F + "97477144.jpg", cam: [1.05, 0.5, 0.6, 1.3, 0.5, 0.7], out: { type: "dissolve", d: 0.4 } },
  { a: 163.4, b: 165.9, comp: "walls", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5], out: { type: "white", d: 0.4 } },
  { a: 165.9, b: 168.18, comp: "route0", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5], out: { type: "zoom", fx: 0.3, fy: 0.5 } },
  { a: 168.18, b: 171.3, img: F + "09229485.jpg", out: { type: "dissolve", d: 0.35 } },
  { a: 171.3, b: 174.06, img: F + "67efcfdd.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.55, 0.45], out: { type: "whip", vx: 1 } },
  { a: 174.06, b: 176.5, img: F + "42a1ebca.jpg", out: { type: "dissolve", d: 0.35 } },
  { a: 176.5, b: 178.64, img: F + "4b041833.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.4, 0.5], out: { type: "flash" } },
  { a: 178.64, b: 181.6, v: T + "xa05_caldarium", from: 0, out: { type: "dissolve", d: 0.35 } },
  { a: 181.6, b: 184.5, v: T + "xa05_caldarium", from: 4.5, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.6], out: { type: "whip", vx: -1 } },
  { a: 184.5, b: 186.9, img: F + "1418572e.jpg", cam: [1.0, 0.5, 0.5, 1.14, 0.5, 0.62], grade: "contrast(1.08) saturate(1.1) sepia(.12)", out: { type: "zoom", fx: 0.5, fy: 0.4 } },
  { a: 186.9, b: 190.3, img: F + "87cee5e6.jpg", out: { type: "dissolve", d: 0.4 } },
  { a: 190.3, b: 193.8, img: F + "d706fc95.jpg", cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.45], out: { type: "white", d: 0.4 } },
  { a: 193.8, b: 196.9, img: F + "32d98471.jpg", out: { type: "dissolve", d: 0.3 } },
  { a: 196.9, b: 200.44, img: F + "faec5e86.jpg", out: { type: "sweep", d: 0.5 } },
  { a: 200.44, b: 211.7, comp: "route1", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5], out: { type: "dissolve", d: 0.5 } },
  { a: 211.7, b: 215.0, v: T + "xa05_caldarium", from: 8.5, rate: 0.625, out: { type: "whip", vx: 1 } },
  { a: 215.0, b: 218.0, v: T + "xa08_sandals", from: 0, out: { type: "dissolve", d: 0.3 } },
  { a: 218.0, b: 220.24, v: T + "xa08_sandals", from: 4.5, out: { type: "flash" } },
  { a: 220.24, b: 224.6, v: T + "xa09_boilers", from: 0, out: { type: "dissolve", d: 0.5 } },
  { a: 224.6, b: 241.0, comp: "tanks", cam: [1.0, 0.5, 0.5, 1.05, 0.5, 0.4], out: { type: "dissolve", d: 0.5 } },
  { a: 241.0, b: 244.9, v: T + "xa09_boilers", from: 6.0, out: { type: "white", d: 0.4 } },
  { a: 244.9, b: 247.6, img: F + "9fdfef86.jpg", cam: [1.05, 0.45, 0.5, 1.22, 0.5, 0.55], out: { type: "dissolve", d: 0.35 } },
  { a: 247.6, b: 250.4, img: F + "d3542a97.jpg", out: { type: "whip", vx: -1 } },
  { a: 250.4, b: 254.64, img: F + "6fc5fb85.jpg", cam: [1.0, 0.5, 0.5, 1.18, 0.5, 0.55], out: { type: "zoom", fx: 0.5, fy: 0.55 } },
  { a: 254.64, b: 258.5, img: F + "bddb8dd8.jpg", cam: [1.1, 0.5, 0.55, 1.35, 0.5, 0.6], out: { type: "dissolve", d: 0.4 } },
  { a: 258.5, b: 263.34, v: T + "p07_brazier", from: 9.4, rate: 0.56, out: { type: "sweep", d: 0.5 } },
  { a: 263.34, b: 266.6, v: R + "r11345413", from: 1, rate: 1, out: { type: "whip", vx: 1 } },
  { a: 266.6, b: 269.6, v: T + "xa11_weights", from: 0, out: { type: "flash" } },
  { a: 269.6, b: 273.68, v: T + "xa11_weights", from: 4.5, out: { type: "dissolve", d: 0.4 } },
  { a: 273.68, b: 278.98, v: T + "xa03_niche", from: 4.0, grade: "blur(9px) brightness(.42)", k: "quote", out: { type: "dissolve", d: 0.4 } },
  { a: 278.98, b: 282.3, v: R + "r3696057", from: 2, rate: 1, out: { type: "zoom", fx: 0.5, fy: 0.6 } },
  { a: 282.3, b: 286.495, comp: "hidden", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5] },
];
export const SHOTSA: SA[] = ABS.map((s) => ({ ...s, a: s.a - OFFA, b: s.b - OFFA }));
export const MA_FRAMES = Math.round((286.495 - OFFA) * FPS);

type V3 = [number, number, number];
const K = (at: number, pos: V3, look: V3, fov = 40): HypoKey => ({ at, pos, look, fov });
const base = (o: Partial<Fase>): Fase => ({ open: 0, gas: 0, flue: 0, glow: 0, room: 0, ...o });
const ROOMS = (t0: number) => [
  { at: t0, la: "APODYTERIUM", en: "CAMBIO", h: 0.08 },
  { at: t0 + 0.2, la: "TEPIDARIUM", en: "TIBIO", h: 0.55 },
  { at: t0 + 0.4, la: "CALDARIUM", en: "CALIENTE", h: 1 },
  { at: t0 + 0.6, la: "LACONICUM", en: "CALOR SECO", h: 0.9 },
  { at: t0 + 0.8, la: "FRIGIDARIUM", en: "FRÍO", h: 0 },
];

export const MA: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFFA;
  const L = (x: number) => x - OFFA;
  const renderComp = (s: Shot) => {
    switch (s.comp) {
      case "pompmap": return <ClayMap t0={L(136.9)} keys={[
        { at: 0, pos: [8, 16, 22], look: [7.96, 0, 11.5], fov: 34 }, { at: 4.2, pos: [8.3, 4.2, 15.0], look: [7.96, 0.6, 11.5], fov: 34 },
      ]} pins={[{ at: 0.8, out: 4.0, lon: 14.48, lat: 40.75, label: "POMPEYA", sub: "Bahía de Nápoles · 79 d. C.", ring: true }]} />;
      case "walls": return <Hypo3D t0={L(163.2)} keys={[K(0, [7, 2.4, 9], [0, 1.2, 0], 40), K(2.8, [8.5, 3.4, 10.5], [0, 1.6, 0], 40)]}
        fase={() => base({ open: 0.75, gas: 1, glow: 0.7, flue: 1, room: 0.6 })}
        labels={[{ at: 0.3, out: 2.6, x: -2, y: 0.4, z: 3.0, text: "SUELOS ELEVADOS", side: "r" }, { at: 1.1, out: 2.6, x: 0, y: 2.8, z: 0, text: "HOLLOW WALLS", side: "r" }]} />;
      case "route0": return <BathRoute t={t} a={L(165.9)} b={L(168.3)} rooms={ROOMS(L(166.1))} gradAt={L(999)} />;
      case "route1": return <BathRoute t={t} a={L(200.3)} b={L(211.8)} rooms={ROOMS(L(200.6))} gradAt={L(202.6)} />;
      case "tanks": /* tanksDrift: en ES el tramo antes del primer tanque dura >4 s → acercamiento lento para que no quede quieto */ return <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.012 * Math.max(0, Math.min(t, L(229.2)) - L(224.4))})` }}><TankChain t={t} a={L(224.4)} b={L(241.1)} drawAt={L(233.9)} warmAt={L(235.6)} coldAt={L(238.3)} litAt={[L(228.94), L(230.34), L(231.66)]} linkAt={L(232.36)} /></div>;
      case "hidden": return <Hypo3D t0={L(282.1)} keys={[K(0, [6, 3.2, 7], [-1, 0.6, 0], 42), K(4.2, [4, 0.9, 4.8], [-3, 0.4, 0], 42)]}
        fase={() => base({ open: 0.9, gas: 1, glow: 0.85, room: 0.4 })}
        labels={[{ at: 1.6, out: 4.1, x: -2.5, y: PH * 0.5, z: 2.6, text: "BAJO EL SUELO", side: "r" }]} />;
    }
    return null;
  };
  const cur = SHOTSA.find((s) => t >= s.a && t < s.b);
  const FIRE = new Set([T + "xa09_boilers", T + "xa10_brazier", R + "r3696057"]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTSA.map((s, i) => <ShotLayer key={i} S={SHOTSA} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v && FIRE.has(cur.v) && <Embers t={t} n={40} op={0.7} />}
        {cur?.v === T + "xa01_vesuvius" && <Embers t={t} n={60} op={0.5} />}
        <BigWord t={ta} a={144.0} b={145.6} text="POMPEYA" hot />
        <EmberForm t={ta} a={146.0} b={149.4} text="79 d. C." kicker="ERUPCIÓN DEL VESUBIO" />
        <Place t={ta} a={149.7} b={154.5} text="SEPULTADA · NO DESTRUIDA" sub="la calefacción sobrevivió casi intacta" />
        <Place t={ta} a={155.0} b={160.6} text="LAS TERMAS ESTABIANAS" sub="las más antiguas de Pompeya, reconstruidas con los años" />
        <Term t={ta} a={168.4} b={173.9} words={[{ la: "APODYTERIUM", en: "EL VESTUARIO", at: 170.0 }]} y={150} />
        <Term t={ta} a={174.2} b={178.5} words={[{ la: "TEPIDARIUM", en: "LA SALA TIBIA", at: 175.4 }]} y={150} />
        <Term t={ta} a={178.8} b={184.4} words={[{ la: "CALDARIUM", en: "LA SALA CALIENTE", at: 180.0 }]} y={150} />
        <Place t={ta} a={184.7} b={186.8} text="EL LABRUM" sub="una pila de agua caliente en un extremo" />
        <Term t={ta} a={187.1} b={193.6} words={[{ la: "LACONICUM", en: "LA SALA SECA PARA SUDAR", at: 188.6 }]} y={150} />
        <Term t={ta} a={194.0} b={200.3} words={[{ la: "FRIGIDARIUM", en: "LA ZAMBULLIDA FRÍA", at: 195.2 }]} y={150} />
        <Place t={ta} a={206.4} b={209.4} text="SOLO TIBIA" />
        <Place t={ta} a={209.5} b={211.6} text="NADA DE CALOR" />
        <BigWord t={ta} a={211.9} b={214.9} text="UN GRADIENTE DE TEMPERATURA" />
        <Place t={ta} a={215.3} b={220.1} text="SUELAS GRUESAS DE MADERA" sub="solo para cruzar la sala" />
        <Place t={ta} a={222.4} b={224.5} text="VITRUVIO" sub="Sobre la arquitectura · Libro V" />
        <Place t={ta} a={241.2} b={244.8} text="UN SOLO FUEGO" sub="para el agua y el suelo" />
        <Place t={ta} a={245.1} b={247.5} text="LAS TERMAS DEL FORO" sub="el brasero de bronce sigue ahí" />
        <Place t={ta} a={250.6} b={254.5} text="MARCO NIGIDIO VACULA" sub="un funcionario local · su regalo a las termas" />
        <BigWord t={ta} a={255.4} b={258.4} text="VACULA = VAQUITA" />
        <Place t={ta} a={259.0} b={263.2} text="A LOS ROMANOS LES GUSTABA VER UN RESPLANDOR" />
        <Place t={ta} a={263.5} b={266.5} text="LOS VECINOS" />
        {cur?.k === "quote" && <WaxTablet t={ta} a={273.75} b={278.9} papyrus author="SÉNECA" work="Cartas · 56" dur={1.6}
          lines={["Vivo justo encima", "unos baños:", "los gruñidos de los hombres", "levantando pesas de plomo"]} hot={["groans", "lead"]} en="su queja, en una carta a un amigo" />}
        <Place t={ta} a={279.2} b={282.2} text="LAS SALAS · EL GRADIENTE · LAS CALDERAS" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
