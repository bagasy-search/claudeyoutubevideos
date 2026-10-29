// lou29a · componentes 3D c08-c38 (uno por minuto): cada uno es el objeto del diner que cuenta lo que Lou dice EN ESE SEGUNDO,
// con la foto real del plato adentro de la loza/olla/sartén. Mismo banco (Bench) y envoltura (R3) que lou_r3a.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { preload, usePhoto, useMat, Clock, Coin, Food, G, Glass, Jar, Label3, Plate, Pot, Pour, Sheet, Skillet, Std, Thermo, Tool, ez, lerp, rnd, sp, V3 } from "./props3d";
import { R3, Cap, Vapor, drop } from "./lou_r3a";
import { FONT } from "./lib";
import { HAND, MARK } from "./hkit";

preload(["la_n12a", "la_n11a", "la_n10a", "la_n09a", "la_n08a", "la_n07a", "la_n06a", "la_n05a", "la_n04a", "la_n03a", "la_n02a", "la_n01a", "la_n15a"]);
type P = { t: number; h: H };
// materiales compartidos (a nivel módulo: dentro de f no se pueden usar hooks)
const steel = new THREE.MeshStandardMaterial({ color: "#d9dde2", metalness: 1, roughness: 0.22 });
const glass = new THREE.MeshPhysicalMaterial({ color: "#e8f2f0", roughness: 0.04, transparent: true, opacity: 0.28, clearcoat: 1, side: THREE.DoubleSide });

// foto de comida que aparece (fundido) adentro de una pieza: disco horizontal
const PhotoDisc: React.FC<{ id: string; rad: number; o?: number; zoom?: number; p?: V3 }> = ({ id, rad, o = 1, zoom = 1.6, p = [0, 0.05, 0] }) => {
  const ph = usePhoto(id, 0, 1, zoom);
  return o > 0.01 ? <mesh rotation-x={-Math.PI / 2} position={p}><circleGeometry args={[rad, 64]} /><meshStandardMaterial key={ph ? "t" : "n"} map={ph ?? undefined} transparent opacity={o} roughness={0.4} /></mesh> : null;
};
// burbujas que suben y revientan dentro de un líquido (y0 = superficie)
const Bubbles: React.FC<{ tt: number; n: number; rad: number; y0: number; big?: number; sp?: number; p?: V3; c?: string }> = ({ tt, n, rad, y0, big = 0.02, sp: spd = 1.6, p = [0, 0, 0], c = "#ffffff" }) => <>{Array.from({ length: n }, (_, i) => {
  const ph = (tt * spd * (0.7 + 0.6 * rnd(i, 7)) + rnd(i, 3)) % 1, a = rnd(i, 1) * 6.28, r = rad * Math.sqrt(rnd(i, 2));
  return <mesh key={i} position={[p[0] + Math.cos(a) * r, p[1] + y0 + 0.004, p[2] + Math.sin(a) * r]} scale={[1, 0.55, 1]}><sphereGeometry args={[big * (0.4 + Math.sin(ph * Math.PI)), 14, 8]} /><meshPhysicalMaterial color={c} roughness={0.05} transparent opacity={0.55} clearcoat={1} /></mesh>;
})}</>;
// taza de café de diner
const Mug: React.FC<{ p?: V3; r?: V3; s?: number; fill?: string }> = ({ p, r, s = 1, fill = "#2a160c" }) => {
  const china = useMat("china");
  return <G p={p} r={r} s={s}>
    <mesh material={china} castShadow position={[0, 0.11, 0]}><cylinderGeometry args={[0.1, 0.09, 0.22, 40, 1, true]} /></mesh>
    <mesh material={china} position={[0, 0.005, 0]}><cylinderGeometry args={[0.09, 0.09, 0.01, 40]} /></mesh>
    <mesh position={[0, 0.19, 0]} rotation-x={-Math.PI / 2}><circleGeometry args={[0.095, 40]} /><Std c={fill} r={0.15} /></mesh>
    <mesh material={china} position={[0.12, 0.11, 0]} castShadow><torusGeometry args={[0.055, 0.016, 12, 24]} /></mesh>
  </G>;
};
// tabla de madera
const Board: React.FC<{ w?: number; d?: number; p?: V3 }> = ({ w = 1.6, d = 0.9, p = [0, 0, 0] }) => <Sheet id={`board${w}${d}`} w={w} h={d} th={0.05} p={[p[0], p[1] + 0.025, p[2]]} r={[-Math.PI / 2, 0, 0]} draw={(g, ww, hh) => {
  g.fillStyle = "#b07a45"; g.fillRect(0, 0, ww, hh);
  for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(90,50,20,${0.08 + 0.15 * rnd(i, 2)})`; g.lineWidth = 1 + 3 * rnd(i, 3); const y = rnd(i, 1) * hh; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(ww * 0.3, y + 8 * rnd(i, 4), ww * 0.7, y - 8, ww, y + 4); g.stroke(); }
}} />;
// plato hondo chico con un polvo/líquido (harina, huevo, pan rallado)
const Dish: React.FC<{ p: V3; c: string; s?: number }> = ({ p, c, s = 1 }) => <G p={p} s={s}><Plate deep rad={0.34} food={c} /></G>;

// c08 · Número 12: el catfish de los viernes; el plato entra, caen los hush puppies de a uno y el cartelito de 90¢
export const RCatfish: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.25, 2.1], l: [0, 0.1, 0], fov: 34 }} cam2={{ p: [0.35, 1.0, 1.55], l: [0.1, 0.12, 0], fov: 32 }} f={(tt) => {
  const pl = drop(tt, 0.3, 0.9), card = sp(tt, 2.4, 8, 0.4);
  return <>
    <G p={[-0.15, pl.y, 0]} s={[1, pl.sq, 1]}><Plate rad={0.5} photo="la_n12a" zoom={1.5} /></G>
    {[0, 1, 2, 3, 4].map((i) => { const d = drop(tt, 1.1 + i * 0.22, 0.9); return d.on ? <G key={i} p={[0.62 + 0.13 * (i % 2), 0.11 + d.y, -0.25 + i * 0.12]}><Food kind="ball" tex="crust" s={0.75} /></G> : null; })}
    <G p={[0.55, 0, 0.45]} r={[-0.35 + 0.35 * card, -0.4, 0]} s={card}><Sheet id="tag90" w={0.42} h={0.3} th={0.01} p={[0, 0.15, 0]} draw={(g, w, hh) => { g.fillStyle = "#fbf6ea"; g.fillRect(0, 0, w, hh); g.fillStyle = "#b3241b"; g.fillRect(0, 0, w, hh * 0.22); g.fillStyle = "#fff"; g.font = `900 120px ${FONT}`; g.textAlign = "center"; g.fillText("FRIDAY", w / 2, hh * 0.18); g.fillStyle = "#1d2440"; g.font = `400 330px ${MARK}`; g.fillText("90¢", w / 2, hh * 0.86); }} /></G>
  </>;
}} />;

// c09 · el aceite a 350: el termómetro baja a la sartén, el mercurio sube y recién ahí el aceite hierve y entra el filete
export const RFryTherm: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.3, 2.0], l: [0, 0.25, 0], fov: 34 }} cam2={{ p: [-0.3, 1.0, 1.45], l: [0, 0.25, 0], fov: 32 }} f={(tt) => {
  const dn = sp(tt, 0.8, 6, 0.6), lvl = 0.15 + 0.65 * ez(tt, 1.6, 4.6), hot = ez(tt, 4.2, 5.0), fil = drop(tt, 6.0, 0.8);
  return <>
    <Skillet rad={0.62} inside="#c08a2c" />
    <mesh position={[0, 0.034, 0]} rotation-x={-Math.PI / 2}><circleGeometry args={[0.53, 64]} /><meshPhysicalMaterial color="#d9a23a" roughness={0.05} clearcoat={1} transparent opacity={0.75} emissive="#ff9a2a" emissiveIntensity={0.25 * hot} /></mesh>
    {hot > 0.05 && <Bubbles tt={tt} n={60} rad={0.5} y0={0.035} big={0.012 * hot} sp={2.5} c="#fff1c4" />}
    <G p={[0.3, 0.05 + 1.0 * (1 - dn), -0.1]} r={[0, 0, -0.25]}><Thermo h={0.9} lvl={lvl} /></G>
    {fil.on && <G p={[-0.15, 0.06 + fil.y, 0.1]} s={[1, fil.sq, 1]}><Food kind="cutlet" tex="breaded" s={1.2} /></G>}
    <Label3 txt={`${Math.round(150 + 200 * ez(tt, 1.6, 4.6))}°`} font="mark" col="#b3241b" w={0.9} p={[0.7, 0.75, -0.3]} s={dn} />
  </>;
}} />;

// c10 · la guerra del chucrut: el frasco de Pennsylvania y el plato de Ohio chocan en el mostrador
export const RKrautWar: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.9, 2.3], l: [0, 0.3, 0], fov: 34 }} cam2={{ p: [0, 0.75, 1.8], l: [0, 0.3, 0], fov: 32 }} f={(tt) => {
  const k = ez(tt, 0.5, 2.0), hit = tt > 2.0 ? Math.exp(-(tt - 2.0) * 4) * Math.sin((tt - 2.0) * 22) : 0;
  return <>
    <G p={[lerp(-1.6, -0.36, k) - 0.06 * hit, 0, 0]} r={[0, 0, 0.12 * hit]}><Jar rad={0.22} h={0.55} fill="#d9cf8a" level={0.85} label="PA KRAUT" /></G>
    <G p={[lerp(1.7, 0.36, k) + 0.06 * hit, 0, 0]} r={[0.15 * hit, 0, 0]}><Plate rad={0.42} photo="la_n11a" /></G>
    {tt > 2.0 && <G p={[0, 0.35, 0.1]} s={sp(tt, 2.0, 12, 0.35) * 0.9}><Label3 txt="VS" font="sans" col="#b3241b" w={0.6} /></G>}
  </>;
}} over={(tt) => <Cap tt={tt} at={2.3} x={960} y={150} txt="THE KRAUT WAR · 1972" col="#e4572e" />} />;

// c11 · enjuagar el chucrut: el colador bajo el chorro, el agua que sale pasa de turbia a clara
export const RRinseKraut: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.2, 2.1], l: [0, 0.4, 0], fov: 34 }} cam2={{ p: [0.25, 1.0, 1.6], l: [0, 0.35, 0], fov: 32 }} f={(tt) => {
  const clear = ez(tt, 1.2, 5.5), w = sp(tt, 0.4, 8, 0.6);
  const water = new THREE.Color("#c9b25a").lerp(new THREE.Color("#cfe6ee"), clear);
  return <>
    <G p={[0, 0, 0]}><Plate deep rad={0.5} food={"#" + water.getHexString()} /></G>
    <G p={[0, 0.42, 0]}>
      <mesh material={steel} castShadow scale={[1, 0.55, 1]}><sphereGeometry args={[0.32, 40, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /></mesh>
      <mesh position={[0, -0.02, 0]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.29, 32, 16]} /><Std c="#e7dc9a" r={0.6} /></mesh>
      {[...Array(40)].map((_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.45, 0.06 + 0.04 * rnd(i, 2), (rnd(i, 3) - 0.5) * 0.45]} rotation={[rnd(i, 4) * 3, rnd(i, 5) * 3, 0]}><cylinderGeometry args={[0.006, 0.006, 0.14, 6]} /><Std c="#efe5a8" r={0.5} /></mesh>)}
      <mesh position={[0.32, 0.02, 0]} rotation-z={Math.PI / 2} material={steel}><boxGeometry args={[0.03, 0.4, 0.05]} /></mesh>
    </G>
    <Pour x={0} z={0} y0={1.6} y1={0.5} c="#d8eef5" w={0.035 * w} o={0.6 * w} />
    {[...Array(10)].map((_, i) => { const ph = (tt * 2 + i / 10) % 1; return <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.4, 0.38 - ph * 0.3, (rnd(i, 2) - 0.5) * 0.4]}><sphereGeometry args={[0.012, 8, 6]} /><meshPhysicalMaterial color={water} transparent opacity={0.7} roughness={0.05} /></mesh>; })}
  </>;
}} />;

// c12 · sloppy joe: cebolla y morrón picados caen sobre la carne; la grasa se escurre a la lata y queda UNA cucharada
export const RFiftyCents: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.4, 2.0], l: [0.1, 0.1, 0], fov: 34 }} cam2={{ p: [0.4, 1.15, 1.5], l: [0.3, 0.15, 0], fov: 32 }} f={(tt) => {
  const tilt = ez(tt, 6.0, 7.0) * (1 - ez(tt, 8.6, 9.4)), fat = ez(tt, 6.4, 8.4);
  return <>
    <G p={[0, 0.06 * tilt, 0]} r={[0, 0, tilt * 0.1]}><Skillet rad={0.6} photo="la_n10a" zoom={2.2} /></G>
    {[...Array(24)].map((_, i) => { const d = drop(tt, 1.0 + i * 0.08 + (i % 2) * 1.4, 1.0); const a = rnd(i, 1) * 6.28, r = 0.42 * Math.sqrt(rnd(i, 2)); return d.on ? <mesh key={i} castShadow position={[Math.cos(a) * r, 0.06 + d.y, Math.sin(a) * r]} rotation={[rnd(i, 3), rnd(i, 4), 0]}><boxGeometry args={[0.045, 0.03, 0.045]} /><Std c={i % 2 ? "#3f8a2e" : "#f2ecd9"} r={0.35} cc={0.5} /></mesh> : null; })}
    {tt > 6.4 && <Pour x={0.72} z={0} y0={0.12} y1={0.0} c="#e2b04a" w={0.02 * (1 - fat)} o={0.8} />}
    <G p={[0.95, 0, 0.2]}><Jar rad={0.14} h={0.28} fill="#e9c46a" level={0.1 + 0.6 * fat} label="FAT" lid="#888" /></G>
    <G p={[-0.75, 0.04, 0.35]} r={[0, 0.6, 0]} s={sp(tt, 8.8, 8, 0.5)}><Tool kind="spoon" /></G>
    {(() => { const d = drop(tt, 0.3, 1.4), spin = (1 - ez(tt, 0.3, 1.5)) * 14; return d.on ? <G p={[-0.95, 0.03 + d.y, -0.35]} r={[spin * 0.3, spin, 0]}><Coin rad={0.17} txt="50¢" /></G> : null; })()}
  </>;
}} />;

// c13 · la ternera: tres chuletas gruesas en la tabla; cada golpe del mazo las estira y de 3 salen 5 finas
export const RVeal: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} top="wood" cam={{ p: [0, 1.6, 1.9], l: [0, 0.05, 0], fov: 34 }} cam2={{ p: [0, 1.3, 1.5], l: [0, 0.05, 0.05], fov: 34 }} f={(tt) => {
  const hits = [1.2, 2.2, 3.2], hk = (i: number) => ez(tt, hits[i], hits[i] + 0.25), five = sp(tt, 4.4, 7, 0.45);
  const cur = tt < 1.0 ? -1 : tt < 2.0 ? 0 : tt < 3.0 ? 1 : 2, swing = Math.max(0, Math.sin(((tt - 0.9) % 1) * Math.PI)) * (tt > 0.9 && tt < 3.6 ? 1 : 0);
  return <>
    <Board w={2.2} d={1.1} />
    {[0, 1, 2].map((i) => { const k = hk(i), x0 = (i - 1) * 0.55, x1 = (i - 2) * 0.42; return <G key={i} p={[lerp(x0, x1, five), 0.08, lerp(0, -0.2, five)]} s={[1 + 0.35 * k, 1 - 0.55 * k, 1 + 0.25 * k]}><Food kind="cutlet" tex="beef" s={0.9} /></G>; })}
    {[0, 1].map((i) => <G key={i} p={[0.42 + i * 0.42, 0.06, 0.22]} s={[1.35 * five, 0.45 * five + 0.001, 1.25 * five]}><Food kind="cutlet" tex="beef" s={0.9} /></G>)}
    {cur >= 0 && tt < 3.7 && <G p={[(cur - 1) * 0.55, 0.22 + 0.45 * (1 - swing), 0.05]} r={[-0.6 * (1 - swing), 0.3, 0]}><Tool kind="mallet" /></G>}
  </>;
}} over={(tt) => <><Cap tt={tt} at={1.3} x={420} y={170} txt="THICK = CHEAP?" col="#e4572e" /><Cap tt={tt} at={4.6} x={1450} y={170} txt="THIN = COOKED" col="#3fae5b" /></>} />;

// c14 · el empanado en tres platos: harina, huevo, pan rallado con parmesano; la chuleta viaja y se va cubriendo
export const RDredge: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.5, 2.2], l: [0, 0.05, 0], fov: 36 }} cam2={{ p: [0.4, 1.2, 1.7], l: [0.4, 0.05, 0], fov: 33 }} f={(tt) => {
  const leg = (a: number) => ez(tt, a, a + 0.9), l1 = leg(1.5), l2 = leg(4.0), l3 = leg(6.6);
  const x = lerp(lerp(lerp(-1.6, -0.75, l1), 0, l2), 0.75, l3), hop = Math.sin(l1 * Math.PI) + Math.sin(l2 * Math.PI) + Math.sin(l3 * Math.PI);
  const coat = l3 > 0.5 ? "breaded" : l2 > 0.5 ? undefined : undefined, col = l2 > 0.5 ? "#e6c45a" : l1 > 0.5 ? "#efe6d6" : "#b86a5a";
  return <>
    {[["#f3efe6", -0.75], ["#f2c94c", 0], ["#c98a45", 0.75]].map(([c, xx], i) => { const d = drop(tt, 0.2 + i * 0.25, 0.8); return <G key={i} p={[xx as number, d.y, 0]}><Dish p={[0, 0, 0]} c={c as string} /></G>; })}
    <G p={[x, 0.09 + 0.45 * hop, 0]} r={[0, 0, 0.4 * Math.sin(hop * 3)]}><Food kind="cutlet" c={col} tex={coat} rough={0.8} s={0.7} /></G>
    {tt > 6.6 && [...Array(18)].map((_, i) => { const ph = ez(tt, 6.9 + i * 0.03, 7.6 + i * 0.03); return <mesh key={i} position={[0.75 + (rnd(i, 1) - 0.5) * 0.4, 0.5 - 0.42 * ph, (rnd(i, 2) - 0.5) * 0.3]}><sphereGeometry args={[0.012, 6, 4]} /><Std c="#d7a25a" /></mesh>; })}
  </>;
}} over={(tt) => <><Cap tt={tt} at={0.6} x={560} y={900} txt="FLOUR" col="#e9e2d0" /><Cap tt={tt} at={0.9} x={960} y={900} txt="EGG" col="#f2c94c" /><Cap tt={tt} at={1.2} x={1430} y={900} txt="CRUMBS" col="#c98a45" /></>} />;

// c15 · el gravy va DEBAJO: la salsera vuelca al costado y la cutlet queda crocante arriba
export const RGravyUnder: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.3, 1.9], l: [0, 0.1, 0], fov: 34 }} cam2={{ p: [-0.35, 1.05, 1.45], l: [-0.05, 0.1, 0], fov: 32 }} f={(tt) => {
  const tilt = ez(tt, 1.2, 2.0) * (1 - ez(tt, 5.0, 5.8)), pool = ez(tt, 1.8, 5.2);
  return <>
    <Plate rad={0.55} photo="la_n09a" zoom={1.35} />
    <mesh position={[-0.2, 0.03, 0.18]} rotation-x={-Math.PI / 2} scale={[1.4, 1, 1]}><circleGeometry args={[0.2 * pool + 0.001, 48]} /><meshPhysicalMaterial color="#6b3a1a" roughness={0.1} clearcoat={1} /></mesh>
    <G p={[-0.62, 0.5, 0.25]} r={[0, 0, -1.0 * tilt]} s={1.5}>
      <mesh material={steel} castShadow scale={[1.5, 0.7, 1]}><sphereGeometry args={[0.14, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /></mesh>
      <mesh position={[0, -0.004, 0]} rotation-x={-Math.PI / 2} scale={[1.5, 1, 1]}><circleGeometry args={[0.13, 32]} /><Std c="#5a2e12" r={0.15} /></mesh>
      <mesh position={[-0.2, 0, 0]} rotation-z={Math.PI / 2} material={steel}><torusGeometry args={[0.06, 0.012, 8, 20, Math.PI]} /></mesh>
    </G>
    {tilt > 0.75 && <Pour x={-0.36} z={0.2} y0={0.46} y1={0.04} c="#6b3a1a" w={0.03} />}
  </>;
}} over={(tt) => <Cap tt={tt} at={2.4} x={1400} y={200} txt="UNDER, NOT ON" col="#e4572e" />} />;

// c16 · corned beef ya curado: el paquete de 3 libras cae y de él salen cuatro platos con sobras
export const RCrock: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.4, 2.3], l: [0, 0.1, 0], fov: 36 }} cam2={{ p: [0, 1.6, 1.9], l: [0, 0.05, 0], fov: 36 }} f={(tt) => {
  const pk = drop(tt, 0.4, 1.0), open = ez(tt, 2.6, 3.4);
  return <>
    <G p={[0, pk.y, 0]} s={[1, pk.sq, 1]}>
      <G p={[0, 0.12, 0]} s={[1, 1, 1]}><mesh castShadow scale={[1, 0.45, 0.62]}><sphereGeometry args={[0.36, 40, 20]} /><meshPhysicalMaterial color="#c2565a" roughness={0.45} clearcoat={0.6} /></mesh></G>
      <G p={[0, 0.22 + open * 0.6, 0]} r={[-open * 1.2, 0, 0]}><Sheet id="cbpack" w={0.9} h={0.6} th={0.01} r={[-Math.PI / 2, 0, 0]} draw={(g, w, hh) => { g.fillStyle = "rgba(240,236,228,.95)"; g.fillRect(0, 0, w, hh); g.fillStyle = "#1d6b3a"; g.fillRect(0, 0, w, hh * 0.3); g.fillStyle = "#fff"; g.font = `900 120px ${FONT}`; g.textAlign = "center"; g.fillText("CORNED BEEF", w / 2, hh * 0.22); g.fillStyle = "#1d2440"; g.font = `900 110px ${FONT}`; g.fillText("CURED · 3 LB", w / 2, hh * 0.62); }} /></G>
    </G>
    {[0, 1, 2, 3].map((i) => { const k = sp(tt, 3.8 + i * 0.35, 7, 0.5), a = -2.4 + i * 1.6; return <G key={i} p={[Math.cos(a) * 1.0 * k, 0, Math.sin(a) * 0.55 * k + 0.1]} s={0.55 * k + 0.001}><Plate rad={0.42} photo="la_n08a" /></G>; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={4.0} x={960} y={150} txt="3 LB · FEEDS 4" col="#3fae5b" />} />;

// c17 · hervor fuerte vs burbujitas: dos ollas, la de la izquierda salta y la carne se encoge; la de la derecha queda tierna
export const RBubbles: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.5, 2.3], l: [0, 0.35, 0], fov: 36 }} cam2={{ p: [0.5, 1.3, 1.7], l: [0.5, 0.35, 0], fov: 33 }} f={(tt) => {
  const shrink = ez(tt, 1.0, 5.0);
  return <>
    <G p={[-0.6, 0, 0]}><Pot rad={0.42} h={0.5} fill="#c9a87a" level={0.8} />
      <Bubbles tt={tt} n={26} rad={0.36} y0={0.42} big={0.05} sp={3.2} c="#f3e7d0" />
      <G p={[0, 0.44 + 0.03 * Math.sin(tt * 18), 0]} s={[1 - 0.35 * shrink, 1 + 0.2 * shrink, 1 - 0.35 * shrink]}><mesh scale={[1, 0.3, 0.7]}><sphereGeometry args={[0.24, 32, 16]} /><meshPhysicalMaterial color={new THREE.Color("#c2565a").lerp(new THREE.Color("#7a3a32"), shrink)} roughness={0.7} /></mesh></G>
    </G>
    <G p={[0.6, 0, 0]}><Pot rad={0.42} h={0.5} fill="#c9a87a" level={0.8} />
      <Bubbles tt={tt} n={40} rad={0.36} y0={0.42} big={0.012} sp={1.2} c="#f3e7d0" />
      <G p={[0, 0.44, 0]}><mesh scale={[1, 0.3, 0.7]}><sphereGeometry args={[0.24, 32, 16]} /><meshPhysicalMaterial color="#c2565a" roughness={0.45} clearcoat={0.6} /></mesh></G>
    </G>
  </>;
}} over={(tt) => <><Vapor tt={tt} x={560} y={430} w={360} a={1} /><Vapor tt={tt} x={1360} y={430} w={300} a={0.35} /><Cap tt={tt} at={1.2} x={560} y={160} txt="TOUGH" col="#e4572e" /><Cap tt={tt} at={3.0} x={1360} y={160} txt="TINY BUBBLES" col="#3fae5b" /></>} />;

// c18 · aplastar porotos contra la pared de la olla: la cuchara de madera los hace crema y el caldo espesa
export const RBeanMash: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.25, 1.35], l: [0.15, 0.35, 0], fov: 34 }} f={(tt) => {
  const press = ez(tt, 0.8, 2.0) * (1 - ez(tt, 4.4, 5.2)) + ez(tt, 2.6, 3.0) * 0.3, thick = ez(tt, 1.6, 5.0);
  return <>
    <Pot rad={0.5} h={0.5} fill={"#" + new THREE.Color("#8a3a26").lerp(new THREE.Color("#5e2a1a"), thick).getHexString()} level={0.78} />
    {[...Array(55)].map((_, i) => { const a = rnd(i, 1) * 6.28, r = 0.42 * Math.sqrt(rnd(i, 2)), x = Math.cos(a) * r, z = Math.sin(a) * r, near = x > 0.22 ? press : 0; return <G key={i} p={[x, 0.4, z]} r={[0, rnd(i, 3) * 6, 0]} s={[1 + 0.6 * near, 1 - 0.6 * near, 1]}><Food kind="bean" c="#7a2418" /></G>; })}
    <G p={[0.3 - 0.06 * press, 0.44, 0.02]} r={[-1.0, 0, 0.25]} s={1.6}><Tool kind="wspoon" /></G>
  </>;
}} over={(tt) => <Cap tt={tt} at={2.0} x={560} y={170} txt="1 CUP · MASHED" col="#e4572e" />} />;

// c19 · las postales de Navidad: caen una por año hasta 1990 y la última dice «Merry Christmas, Lou»
const YEARS = [1975, 1978, 1981, 1984, 1987, 1990];
export const RPostcard: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.6, 1.6], l: [0, 0, 0], fov: 36 }} cam2={{ p: [0.1, 1.25, 1.1], l: [0.05, 0, 0], fov: 34 }} f={(tt) => <>
  {YEARS.map((y, i) => { const d = drop(tt, 0.4 + i * 0.6, 0.9), last = i === YEARS.length - 1; return d.on ? <G key={y} p={[(rnd(i, 1) - 0.5) * 0.5, 0.01 + i * 0.008 + d.y, (rnd(i, 2) - 0.5) * 0.3]} r={[-Math.PI / 2, 0, (rnd(i, 3) - 0.5) * 0.7 + (1 - d.sq) * 2]}>
    <Sheet id={`pc${y}`} w={0.8} h={0.52} th={0.005} draw={(g, w, hh) => {
      g.fillStyle = "#fbf4e2"; g.fillRect(0, 0, w, hh); g.strokeStyle = "#b3241b"; g.lineWidth = 12; g.strokeRect(20, 20, w - 40, hh - 40);
      g.fillStyle = "#1d6b3a"; g.fillRect(w - 200, 50, 140, 160); g.fillStyle = "#fff"; g.font = `900 52px ${FONT}`; g.textAlign = "center"; g.fillText(String(y), w - 130, 145);
      g.strokeStyle = "rgba(29,36,64,.5)"; g.lineWidth = 3; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(w * 0.55, hh * 0.5 + k * 60); g.lineTo(w - 60, hh * 0.5 + k * 60); g.stroke(); }
      g.fillStyle = "#1d2440"; g.textAlign = "left"; g.font = `700 ${last ? 90 : 70}px ${HAND}`; g.fillText(last ? "Merry Christmas," : "Season's greetings", 60, hh * 0.42); g.fillText(last ? "Lou!  — Earl" : "from the road", 60, hh * 0.62);
    }} /></G> : null; })}
</>} />;

// c20 · el tenedor raya el puré del cottage pie; las crestas se doran con la luz del horno
export const RForkRidges: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.5, 1.5], l: [0, 0.1, 0], fov: 34 }} cam2={{ p: [0.2, 1.2, 1.1], l: [0, 0.1, 0], fov: 32 }} f={(tt) => {
  const gold = ez(tt, 6.0, 9.5), ph = ez(tt, 9.0, 10.8), lines = 7;
  const c = new THREE.Color("#f3e6c2").lerp(new THREE.Color("#c98a3a"), gold);
  return <>
    <Plate deep rad={0.6} food={"#" + new THREE.Color("#efe0b8").lerp(new THREE.Color("#d9b06a"), gold * 0.6).getHexString()} />
    {[...Array(lines)].map((_, i) => { const a = 0.8 + i * 0.6, k = ez(tt, a, a + 0.5), z = -0.3 + i * 0.1, half = Math.sqrt(Math.max(0, 0.44 * 0.44 - z * z)); return k > 0 ? <mesh key={i} castShadow position={[-half + half * k, 0.055, z]}><boxGeometry args={[2 * half * k + 0.001, 0.018, 0.02]} /><meshStandardMaterial color={c} roughness={0.5} emissive="#ff8a2a" emissiveIntensity={0.15 * gold} /></mesh> : null; })}
    {tt < 5.4 && (() => { const i = Math.min(lines - 1, Math.floor((tt - 0.8) / 0.6)), k = ez(tt, 0.8 + i * 0.6, 1.3 + i * 0.6), z = -0.3 + i * 0.1, half = Math.sqrt(Math.max(0, 0.44 * 0.44 - z * z)); return <G p={[-half + 2 * half * k, 0.08, z + 0.05]} r={[0.5, Math.PI / 2, 0]}><Tool kind="fork" /></G>; })()}
    <PhotoDisc id="la_n06a" rad={0.45} o={ph} zoom={1.7} p={[0, 0.07, 0]} />
  </>;
}} over={(tt) => <Cap tt={tt} at={6.4} x={1500} y={170} txt="400° · 25 MIN" col="#e4572e" />} />;

// c21 · la gota de agua que baila sobre la sartén caliente: rebota y se desliza en vez de evaporarse
export const RWaterDance: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.9, 1.4], l: [0, 0.1, 0], fov: 32 }} cam2={{ p: [0.2, 0.6, 1.0], l: [0.1, 0.08, 0], fov: 30 }} f={(tt) => <>
  <Skillet rad={0.6} inside="#2b2621" />
  {[...Array(7)].map((_, i) => { const a = 0.6 + i * 0.35; if (tt < a) return null; const x = tt - a, bounce = Math.abs(Math.sin(x * 9)) * 0.08 * Math.exp(-x * 0.6), sx = (rnd(i, 1) - 0.5) * 0.7 + Math.sin(x * 2 + i) * 0.12 * x, sz = (rnd(i, 2) - 0.5) * 0.5 + Math.cos(x * 1.7 + i) * 0.08 * x;
    return <mesh key={i} castShadow position={[sx, 0.05 + bounce + (x < 0.25 ? (0.25 - x) * 4 : 0), sz]} scale={[1, 0.7 + 0.3 * Math.cos(x * 18), 1]}><sphereGeometry args={[0.03 + 0.01 * rnd(i, 3), 24, 16]} /><meshPhysicalMaterial color="#e6f4ff" roughness={0} transmission={0.9} thickness={0.05} clearcoat={1} /></mesh>; })}
</>} over={(tt) => <><Vapor tt={tt} x={960} y={560} w={500} n={5} a={0.5} /><Cap tt={tt} at={1.4} x={960} y={160} txt="IT DANCES = READY" col="#3fae5b" /></>} />;

// c22 · el pot pie sin masa abajo: el billete de un dólar sale de la fuente con base y se pega a la otra; caen los cubos de pavo
export const RDollarCrust: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.4, 2.1], l: [0, 0.1, 0], fov: 34 }} cam2={{ p: [0.3, 1.2, 1.7], l: [0.3, 0.1, 0], fov: 33 }} f={(tt) => {
  const fly = ez(tt, 1.0, 3.0), arc = Math.sin(fly * Math.PI);
  return <>
    <G p={[-0.6, 0, 0]}><Plate deep rad={0.45} food="#d9a65a" /><mesh position={[0, 0.06, 0]} rotation-x={-Math.PI / 2}><ringGeometry args={[0.24, 0.33, 48]} /><Std c="#e3b469" r={0.7} /></mesh></G>
    <G p={[0.6, 0, 0]}><Plate deep rad={0.45} food="#f2e7cf" /></G>
    <G p={[lerp(-0.6, 0.6, fly), 0.15 + 0.6 * arc, 0.05]} r={[-Math.PI / 2 + 0.6 * arc, 0, fly * 6.28]}>
      <Sheet id="bill1" w={0.52} h={0.22} th={0.003} draw={(g, w, hh) => { g.fillStyle = "#cfd8bf"; g.fillRect(0, 0, w, hh); g.strokeStyle = "#2e5a3a"; g.lineWidth = 14; g.strokeRect(16, 16, w - 32, hh - 32); g.fillStyle = "#2e5a3a"; g.font = `900 180px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("1", 110, hh / 2); g.fillText("1", w - 110, hh / 2); g.beginPath(); g.ellipse(w / 2, hh / 2, 90, 120, 0, 0, 6.3); g.stroke(); }} />
    </G>
    {[...Array(14)].map((_, i) => { const d = drop(tt, 4.0 + i * 0.12, 1.0); return d.on ? <G key={i} p={[0.6 + (rnd(i, 1) - 0.5) * 0.4, 0.08 + d.y + 0.04 * rnd(i, 3), (rnd(i, 2) - 0.5) * 0.4]} r={[rnd(i, 4), rnd(i, 5), 0]} s={0.6}><Food kind="cube" c="#f1ddb8" rough={0.6} /></G> : null; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={2.8} x={1360} y={170} txt="−$1 A PLATE" col="#3fae5b" />} />;

// c23 · tres cortes en la tapa de masa: de cada uno sale una columna de vapor; después, el pot pie dorado de verdad
export const RSteamSlits: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.3, 1.6], l: [0, 0.1, 0], fov: 34 }} cam2={{ p: [0, 1.1, 1.2], l: [0, 0.1, 0], fov: 32 }} f={(tt) => {
  const ph = ez(tt, 8.0, 10.0);
  return <>
    <Plate deep rad={0.6} />
    <mesh castShadow position={[0, 0.06, 0]} scale={[1, 0.18, 1]}><sphereGeometry args={[0.44, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color={new THREE.Color("#f0dcae").lerp(new THREE.Color("#b8742e"), ez(tt, 5.0, 8.5))} roughness={0.6} /></mesh>
    {[0, 1, 2].map((i) => { const k = ez(tt, 0.8 + i * 1.1, 1.4 + i * 1.1); return <mesh key={i} position={[(i - 1) * 0.16, 0.142, 0.04 - 0.08 * k]} rotation={[0, 0.5, 0]}><boxGeometry args={[0.012, 0.01, 0.16 * k + 0.001]} /><Std c="#3a2414" /></mesh>; })}
    {tt < 4.2 && (() => { const i = Math.min(2, Math.floor((tt - 0.8) / 1.1)), k = ez(tt, 0.8 + i * 1.1, 1.4 + i * 1.1); return <G p={[(i - 1) * 0.16, 0.2, 0.1 - 0.16 * k]} r={[0.6, 0.5, 0]}><Tool kind="knife" /></G>; })()}
    <PhotoDisc id="la_n05a" rad={0.46} o={ph} zoom={1.6} p={[0, 0.155, 0]} />
  </>;
}} over={(tt) => <>{[0, 1, 2].map((i) => tt > 1.4 + i * 1.1 ? <Vapor key={i} tt={tt + i} x={800 + i * 160} y={430} w={90} n={3} a={0.9} /> : null)}<Cap tt={tt} at={5.0} x={1500} y={170} txt="400° · 30 MIN" col="#e4572e" /></>} />;

// c24 · enero de 1977: la ventana del diner de noche, nieve que se apila y los faros de 30 camiones que van llegando
export const RSnowIn: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.9, 2.4], l: [0, 0.7, -1.2], fov: 38 }} cam2={{ p: [0, 0.85, 1.9], l: [0, 0.75, -1.2], fov: 36 }} f={(tt) => {
  const pile = ez(tt, 0.5, 9.0), n = Math.min(30, Math.floor(ez(tt, 2.0, 9.5) * 30));
  return <>
    <mesh position={[0, 0.9, -1.5]}><planeGeometry args={[4.2, 1.6]} /><meshBasicMaterial color="#0e1a2e" /></mesh>
    {[...Array(30)].map((_, i) => i < n ? <group key={i} position={[-1.9 + (i % 10) * 0.42 + 0.1 * rnd(i, 1), 0.45 + Math.floor(i / 10) * 0.12, -1.48]}>{[-0.035, 0.035].map((dx) => <mesh key={dx} position={[dx, 0, 0]}><circleGeometry args={[0.026, 16]} /><meshBasicMaterial color="#ffe08a" toneMapped={false} /></mesh>)}</group> : null)}
    {[...Array(80)].map((_, i) => { const ph = (tt * (0.25 + 0.15 * rnd(i, 3)) + rnd(i, 1)) % 1; return <mesh key={i} position={[-2 + 4 * rnd(i, 2) + 0.1 * Math.sin(tt + i), 1.7 - ph * 1.5, -1.45]}><circleGeometry args={[0.012 + 0.01 * rnd(i, 4), 8]} /><meshBasicMaterial color="#ffffff" /></mesh>; })}
    {[[-2.15, 0.9, 0.1, 1.7], [2.15, 0.9, 0.1, 1.7], [0, 1.72, 4.4, 0.1], [0, 0.08, 4.4, 0.16]].map(([x, y, w, hh], i) => <mesh key={i} position={[x, y, -1.42]} castShadow><boxGeometry args={[w, hh, 0.1]} /><Std c="#b3241b" r={0.35} cc={1} /></mesh>)}
    <mesh position={[0, 0.17 + 0.05 * pile, -1.38]}><boxGeometry args={[4.2, 0.1 * pile + 0.001, 0.12]} /><Std c="#f4f7fb" r={0.9} /></mesh>
    <G p={[1.3, 1.3, -1.36]}><Label3 txt="OPEN" font="mark" col={Math.sin(tt * 7) > -0.7 ? "#ff4a7a" : "#5a1020"} w={1.5} /></G>
  </>;
}} over={(tt) => <Cap tt={tt} at={2.4} x={420} y={160} txt={`JAN 1977 · ${Math.min(30, Math.floor(ez(tt, 2.0, 9.5) * 30))} TRUCKS`} col="#8ab4ff" />} />;

// c25 · las chuletas «dale los 45»: hongos en láminas caen con la cebolla y se doran
export const RChop45: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.4, 1.9], l: [0, 0.1, 0], fov: 34 }} cam2={{ p: [0.3, 1.15, 1.45], l: [0.05, 0.1, 0], fov: 32 }} f={(tt) => {
  const brown = ez(tt, 3.5, 7.8);
  return <>
    <Skillet rad={0.62} photo="la_n04a" zoom={1.9} />
    {[...Array(16)].map((_, i) => { const d = drop(tt, 1.0 + i * 0.14, 1.0), a = rnd(i, 1) * 6.28, r = 0.4 * Math.sqrt(rnd(i, 2)); return d.on ? <G key={i} p={[Math.cos(a) * r, 0.07 + d.y, Math.sin(a) * r]} r={[Math.PI / 2, 0, rnd(i, 3) * 6]}>
      <mesh castShadow><cylinderGeometry args={[0.07, 0.07, 0.018, 24, 1, false, 0, Math.PI]} /><meshPhysicalMaterial color={new THREE.Color("#ece2cf").lerp(new THREE.Color("#7a4c26"), brown)} roughness={0.5} clearcoat={0.4 * brown} /></mesh>
      <mesh castShadow position={[0, 0, -0.045]}><boxGeometry args={[0.04, 0.018, 0.06]} /><meshPhysicalMaterial color={new THREE.Color("#e6dac4").lerp(new THREE.Color("#6e4422"), brown)} roughness={0.5} /></mesh>
    </G> : null; })}
  </>;
}} over={(tt) => <><Cap tt={tt} at={0.4} x={420} y={170} txt="45 MINUTES" col="#e4572e" /><Cap tt={tt} at={1.4} x={1450} y={170} txt="+ MUSHROOMS" col="#c98a45" /></>} />;

// c26 · el estofado: ajo, una cucharada de harina, una de pasta de tomate y el caldo que sube y raspa el fondo
export const RCrowdPan: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.5, 1.8], l: [0, 0.15, 0], fov: 34 }} cam2={{ p: [-0.25, 1.2, 1.3], l: [0, 0.15, 0], fov: 32 }} f={(tt) => {
  const broth = ez(tt, 6.4, 9.5), g1 = drop(tt, 0.6, 1.0), g2 = drop(tt, 0.9, 1.0), fl = drop(tt, 3.0, 1.0), tp = drop(tt, 4.4, 1.0);
  const base = new THREE.Color("#5a3220").lerp(new THREE.Color("#7a3a20"), ez(tt, 4.6, 6.0)).lerp(new THREE.Color("#6b3a1e"), broth);
  return <>
    <Pot rad={0.55} h={0.42} fill={"#" + base.getHexString()} level={0.2 + 0.6 * broth} handles />
    {[g1, g2].map((d, i) => d.on ? <mesh key={i} castShadow position={[-0.15 + i * 0.25, 0.12 + 0.25 * broth + d.y, 0.05]} scale={[0.6, 0.45, 1]}><sphereGeometry args={[0.06, 20, 12]} /><Std c="#f4ecd8" r={0.4} cc={0.5} /></mesh> : null)}
    {fl.on && <mesh castShadow position={[0.1, 0.12 + 0.25 * broth + fl.y, -0.15]} scale={[1, 0.5 * (1 - ez(tt, 6.4, 7.4)) + 0.01, 1]}><coneGeometry args={[0.1, 0.12, 24]} /><Std c="#f7f3ea" r={0.95} /></mesh>}
    {tp.on && <mesh castShadow position={[-0.1, 0.12 + 0.25 * broth + tp.y, -0.2]} scale={[1, 0.5 * (1 - ez(tt, 6.4, 7.4)) + 0.01, 1]}><sphereGeometry args={[0.07, 20, 12]} /><Std c="#b3241b" r={0.3} cc={0.8} /></mesh>}
    {tt > 6.2 && tt < 9.6 && <Pour x={0.25} z={0} y0={1.5} y1={0.15 + 0.3 * broth} c="#8a5a2e" w={0.03} />}
    {tt > 8.5 && <G p={[0, 0.5, 0.1]} r={[0.9, 0.4 + Math.sin(tt * 3) * 0.6, 0]}><Tool kind="wspoon" /></G>}
  </>;
}} over={(tt) => <><Cap tt={tt} at={3.2} x={420} y={170} txt="2 TBSP FLOUR" col="#e9e2d0" /><Cap tt={tt} at={4.6} x={1450} y={170} txt="2 TBSP TOMATO" col="#e4572e" /></>} />;

// c27 · el vaso de jugo que corta biscuits: derecho arriba y abajo sube alto; girado, queda chato
export const RJuiceGlass: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} top="wood" cam={{ p: [0, 1.25, 2.3], l: [0, 0.3, 0], fov: 36 }} cam2={{ p: [0, 1.0, 1.8], l: [0, 0.3, 0], fov: 34 }} f={(tt) => {
  const pd = (a: number) => ez(tt, a, a + 0.5) * (1 - ez(tt, a + 1.2, a + 1.7)), L = pd(1.0), R = pd(1.0), rise = ez(tt, 4.5, 9.0);
  return <>
    <Sheet id="flourdough" w={2.2} h={1.0} th={0.06} p={[0, 0.03, 0]} r={[-Math.PI / 2, 0, 0]} draw={(g, w, hh) => { g.fillStyle = "#ecdcb6"; g.fillRect(0, 0, w, hh); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,255,255,${0.3 * rnd(i, 1)})`; g.beginPath(); g.arc(rnd(i, 2) * w, rnd(i, 3) * hh, 2 + 6 * rnd(i, 4), 0, 6.3); g.fill(); } }} />
    <G p={[-0.5, 0.42 - 0.34 * L, 0]}><Glass rad={0.16} h={0.34} /></G>
    <G p={[0.5, 0.42 - 0.34 * R, 0]} r={[0, R * 2.5 * Math.sin(tt * 4), 0]}><Glass rad={0.16} h={0.34} /></G>
    {tt > 2.5 && <><G p={[-0.5, 0.06 + 0.08 * (0.6 + 0.9 * rise), 0]} s={[1, 0.6 + 0.9 * rise, 1]}><Food kind="biscuit" tex={rise > 0.5 ? "crust" : "dough"} /></G>
      <G p={[0.5, 0.06 + 0.08 * 0.6, 0]} s={[1, 0.6 + 0.15 * rise, 1]}><Food kind="biscuit" tex={rise > 0.5 ? "crust" : "dough"} /></G></>}
  </>;
}} over={(tt) => <><Cap tt={tt} at={2.4} x={560} y={170} txt="STRAIGHT DOWN" col="#3fae5b" /><Cap tt={tt} at={2.8} x={1360} y={170} txt="TWIST = FLAT" col="#e4572e" /></>} />;

// c28 · el pollo frito: harina, suero, harina; cae a la rejilla y descansa diez minutos antes del aceite
export const RDoubleDip: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.45, 2.1], l: [0.2, 0.1, 0], fov: 36 }} cam2={{ p: [0.8, 1.1, 1.5], l: [0.8, 0.1, 0], fov: 32 }} f={(tt) => {
  const leg = (a: number) => ez(tt, a, a + 0.6), l1 = leg(0.4), l2 = leg(1.4), l3 = leg(2.4), l4 = leg(3.4);
  const x = lerp(lerp(lerp(lerp(-1.5, -0.9, l1), -0.3, l2), 0.3, l3), 1.0, l4), hop = [l1, l2, l3, l4].reduce((s, k) => s + Math.sin(k * Math.PI), 0);
  return <>
    {[["#f3efe6", -0.9], ["#f6f3e8", -0.3], ["#f3efe6", 0.3]].map(([c, xx], i) => <Dish key={i} p={[xx as number, 0, 0]} c={c as string} s={0.85} />)}
    <G p={[1.0, 0.08, 0]}>{[...Array(9)].map((_, i) => <mesh key={i} material={steel} position={[-0.3 + i * 0.075, 0, 0]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.005, 0.005, 0.5, 6]} /></mesh>)}{[-0.2, 0, 0.2].map((z) => <mesh key={z} material={steel} position={[0, 0, z]} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.005, 0.005, 0.62, 6]} /></mesh>)}</G>
    <G p={[x, 0.1 + 0.4 * hop, 0]} r={[0, 0, 0.5 * Math.sin(hop * 3)]}><Food kind="cutlet" tex={l3 > 0.5 ? "breaded" : undefined} c={l1 > 0.5 ? "#efe6d6" : "#e6b6a0"} s={0.65} /></G>
  </>;
}} over={(tt) => <Cap tt={tt} at={4.0} x={1450} y={170} txt="REST 10 MIN" col="#3fae5b" />} />;

// c29 · el hot hamburger plate se arma en pila: plato, pan, medallón, papas y el gravy que cubre todo
export const RStackPlate: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0.6, 1.2, 1.7], l: [0, 0.1, 0], fov: 34 }} cam2={{ p: [0.4, 1.0, 1.25], l: [0, 0.1, 0], fov: 32 }} f={(tt) => {
  const pl = drop(tt, 0.2, 0.8), br = drop(tt, 0.9, 0.8), pt = drop(tt, 1.7, 0.8), gr = ez(tt, 4.2, 6.5), ph = ez(tt, 7.5, 9.2);
  return <>
    <G p={[0, pl.y, 0]}><Plate rad={0.55} /></G>
    {br.on && <mesh castShadow position={[-0.08, 0.06 + br.y, 0]}><boxGeometry args={[0.42, 0.05, 0.42]} /><meshPhysicalMaterial color="#f7f0e0" roughness={0.9} /></mesh>}
    {pt.on && <G p={[-0.08, 0.13 + pt.y, 0]} s={[1.05, 0.8, 1.05]}><Food kind="patty" tex="cooked" /></G>}
    {[...Array(14)].map((_, i) => { const d = drop(tt, 2.5 + i * 0.07, 0.8); return d.on ? <mesh key={i} castShadow position={[0.3 + 0.08 * rnd(i, 1), 0.05 + d.y + 0.03 * (i % 3), -0.15 + 0.3 * rnd(i, 2)]} rotation={[0, rnd(i, 3) * 3, Math.PI / 2 * rnd(i, 4)]}><boxGeometry args={[0.03, 0.03, 0.2]} /><Std c="#e8b44c" r={0.5} cc={0.3} /></mesh> : null; })}
    <mesh position={[-0.08, 0.14, 0]} scale={[1.1 * gr + 0.001, 0.42 * gr + 0.001, 1.1 * gr + 0.001]}><sphereGeometry args={[0.24, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#5e3014" roughness={0.08} clearcoat={1} /></mesh>
    <mesh position={[-0.08, 0.025, 0]} rotation-x={-Math.PI / 2}><circleGeometry args={[0.34 * ez(tt, 5.0, 7.5) + 0.001, 48]} /><meshPhysicalMaterial color="#5e3014" roughness={0.08} clearcoat={1} /></mesh>
    {tt > 4.0 && tt < 6.6 && <Pour x={-0.08} z={0} y0={1.2} y1={0.18} c="#6b3a1a" w={0.03} />}
  </>;
}} />;

// c30 · las grasas de toda la noche: cuatro medallones en la plancha gotean al frasco que se llena de ámbar
export const RDrippings: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.2, 2.2], l: [0, 0.2, 0], fov: 36 }} cam2={{ p: [0.5, 1.0, 1.7], l: [0.5, 0.25, 0], fov: 33 }} f={(tt) => {
  const fill = ez(tt, 2.5, 10.5);
  return <>
    {[0, 1, 2, 3].map((i) => { const d = drop(tt, 0.3 + i * 0.35, 0.9); return d.on ? <G key={i} p={[-0.9 + (i % 2) * 0.5, 0.03 + d.y, -0.2 + Math.floor(i / 2) * 0.45]} s={[1, d.sq, 1]}><Food kind="patty" tex="cooked" /></G> : null; })}
    {[...Array(6)].map((_, i) => { const ph = (tt * 1.4 + i / 6) % 1; return tt > 2.3 ? <mesh key={i} position={[0.55, 0.62 - ph * 0.4, 0]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.014, 10, 8]} /><meshPhysicalMaterial color="#e2a23a" roughness={0.05} emissive="#c86a10" emissiveIntensity={0.3} /></mesh> : null; })}
    <G p={[0.55, 0, 0]}><Jar rad={0.2} h={0.48} fill="#d98a20" level={0.05 + 0.75 * fill} label="DRIPPINGS" lid="#555" /></G>
  </>;
}} over={(tt) => <Cap tt={tt} at={3.0} x={1450} y={170} txt="BY 2 A.M." col="#e2a23a" />} />;

// c31 · el secreto: media taza de café negro a la sartén del gravy; se oscurece, sin gusto a café
export const RCoffeeGravy: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.4, 1.9], l: [0.1, 0.2, 0], fov: 34 }} cam2={{ p: [0.2, 1.15, 1.4], l: [0.1, 0.15, 0], fov: 32 }} f={(tt) => {
  const tilt = ez(tt, 0.8, 1.6) * (1 - ez(tt, 4.0, 4.8)), dark = ez(tt, 1.6, 5.0);
  return <>
    <Skillet rad={0.6} inside={"#" + new THREE.Color("#9a5a2a").lerp(new THREE.Color("#4a2410"), dark).getHexString()} />
    <mesh position={[0, 0.034, 0]} rotation-x={-Math.PI / 2}><circleGeometry args={[0.52, 64]} /><meshPhysicalMaterial color={new THREE.Color("#9a5a2a").lerp(new THREE.Color("#4a2410"), dark)} roughness={0.08} clearcoat={1} /></mesh>
    <Mug p={[0.42, 0.38, 0]} r={[0, 0, 1.6 * tilt]} s={1.3} />
    {tilt > 0.7 && <Pour x={0.24} z={0} y0={0.42} y1={0.04} c="#24120a" w={0.022} />}
    {tt > 5.0 && <G p={[-0.15, 0.07, 0.05]} r={[-0.25, 0.8 + Math.sin(tt * 2.5) * 0.7, 0]} s={1.4}><Tool kind="wspoon" /></G>}
  </>;
}} over={(tt) => <><Vapor tt={tt} x={900} y={520} w={420} a={0.6} /><Cap tt={tt} at={1.8} x={420} y={170} txt="½ CUP COFFEE" col="#c98a45" /></>} />;

// c32 · la noche en el Blue Moon empieza: la tarjeta de Lou entra al reloj marcador y sale sellada 10:00 PM
export const RPromise: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.95, 1.9], l: [0, 0.55, 0], fov: 34 }} cam2={{ p: [0.15, 0.85, 1.4], l: [0, 0.6, 0], fov: 32 }} f={(tt) => {
  const inn = ez(tt, 1.0, 2.2), out = ez(tt, 3.6, 4.6), stamp = tt > 3.0, thump = tt > 3.0 ? Math.exp(-(tt - 3.0) * 8) * Math.sin((tt - 3.0) * 40) : 0;
  return <>
    <G p={[0, 0, -0.1]} r={[0, 0, 0.01 * thump]}>
      <mesh castShadow position={[0, 0.55, 0]}><boxGeometry args={[0.8, 1.1, 0.5]} /><Std c="#8a8f94" m={0.6} r={0.35} /></mesh>
      <G p={[0, 0.8, 0.26]}><Clock rad={0.24} hour={10 + 0.0 * tt} /></G>
      <mesh position={[0, 0.38, 0.255]}><boxGeometry args={[0.36, 0.03, 0.02]} /><Std c="#111" /></mesh>
    </G>
    <G p={[lerp(1.2, 0, inn) + 1.2 * out, 0.36, 0.32]} r={[0, 0, Math.PI / 2]}>
      <Sheet id={`tc${stamp ? 1 : 0}`} w={0.3} h={0.62} th={0.004} draw={(g, w, hh) => { g.fillStyle = "#f2e6b8"; g.fillRect(0, 0, w, hh); g.fillStyle = "#1d2440"; g.font = `900 46px ${FONT}`; g.textAlign = "center"; g.fillText("TIME CARD", w / 2, 70); g.font = `700 70px ${HAND}`; g.fillText("Lou", w / 2, 160); g.strokeStyle = "rgba(29,36,64,.4)"; for (let k = 0; k < 8; k++) { g.beginPath(); g.moveTo(30, 220 + k * 90); g.lineTo(w - 30, 220 + k * 90); g.stroke(); } if (stamp) { g.fillStyle = "#b3241b"; g.font = `900 58px ${FONT}`; g.fillText("10:00 PM", w / 2, 290); } }} />
    </G>
  </>;
}} over={(tt) => <Cap tt={tt} at={4.6} x={1450} y={170} txt="10 P.M. · NIGHT GRILL" col="#8ab4ff" />} />;

// c33 · la cámara fría decide el menú: se abre la puerta con frío y cada sobra vuela a su plato
export const RWalkIn: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.5, 2.9], l: [0, 0.3, -0.2], fov: 40 }} cam2={{ p: [0, 1.4, 2.5], l: [0, 0.2, 0.1], fov: 40 }} f={(tt) => {
  const door = ez(tt, 0.4, 1.6);
  const dishes: [string, string, number][] = [["la_n06a", "COTTAGE PIE", 2.0], ["la_n15a", "CHILI MAC", 3.6], ["la_n05a", "POT PIE", 5.0]];
  return <>
    <mesh position={[0, 0.9, -1.2]} receiveShadow><boxGeometry args={[1.4, 1.8, 0.1]} /><meshStandardMaterial color="#cfe4f2" emissive="#bfe0ff" emissiveIntensity={0.5 * door} /></mesh>
    <G p={[-0.7, 0.9, -1.1]} r={[0, -1.9 * door, 0]}><mesh position={[0.7, 0, 0]} material={steel} castShadow><boxGeometry args={[1.4, 1.8, 0.12]} /></mesh><mesh position={[1.25, 0, 0.1]} castShadow><boxGeometry args={[0.06, 0.4, 0.06]} /><Std c="#333" m={0.8} /></mesh></G>
    {dishes.map(([id, name, a], i) => { const k = ez(tt, a, a + 1.0), x = (i - 1) * 0.95; return k > 0 ? <G key={id} p={[lerp(0, x, k), 0.9 * (1 - k) + 0.6 * Math.sin(k * Math.PI) * 0.4, lerp(-1.0, 0.25, k)]} r={[0.4 * (1 - k), 0, 0]}><Plate rad={0.38} photo={id} /><Label3 txt={name} w={0.75} col="#1d2440" bgc="#fbf6ea" p={[0, 0.02, 0.5]} r={[-Math.PI / 2, 0, 0]} /></G> : null; })}
  </>;
}} over={(tt) => <><Vapor tt={tt} x={960} y={520} w={600} n={8} a={ez(tt, 0.8, 1.6)} /><Cap tt={tt} at={1.4} x={960} y={130} txt="NOTHING GOT THROWN AWAY" col="#3fae5b" /></>} />;

// c34 · las dos de la mañana: el reloj grande y lo que pasa a esa hora aparece alrededor (biscuits, cutlets, el café de Gus)
export const RNightClock: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.0, 2.6], l: [0, 0.6, 0], fov: 38 }} cam2={{ p: [0, 0.9, 2.1], l: [0, 0.55, 0], fov: 36 }} f={(tt) => {
  const b = sp(tt, 2.4, 7, 0.5), c = sp(tt, 4.4, 7, 0.5), m = sp(tt, 6.6, 7, 0.5);
  return <>
    <G p={[0, 1.0, -0.6]}><Clock rad={0.5} hour={1.75 + 0.25 * ez(tt, 0.3, 2.0)} /></G>
    <G p={[-0.9, 0, 0.1]} s={b + 0.001}><Sheet id="tray" w={0.7} h={0.5} th={0.02} p={[0, 0.01, 0]} r={[-Math.PI / 2, 0, 0]} draw={(g, w, hh) => { g.fillStyle = "#9aa0a6"; g.fillRect(0, 0, w, hh); }} />{[...Array(6)].map((_, i) => <G key={i} p={[-0.2 + (i % 3) * 0.2, 0.08, -0.1 + Math.floor(i / 3) * 0.22]} s={0.6}><Food kind="biscuit" tex="crust" /></G>)}</G>
    <G p={[0, 0, 0.3]} s={c + 0.001}><Board w={0.8} d={0.5} /><G p={[0, 0.07, 0]} s={[1.2, 0.5, 1]}><Food kind="cutlet" tex="beef" /></G><G p={[0.25, 0.12, 0.05]} r={[0, 0.5, 0]}><Tool kind="mallet" /></G></G>
    <G p={[0.9, 0, 0.1]} s={m + 0.001}><Mug s={1.4} /></G>
  </>;
}} over={(tt) => <><Cap tt={tt} at={2.6} x={430} y={880} txt="BISCUITS" col="#c98a45" /><Cap tt={tt} at={4.6} x={960} y={950} txt="CUTLETS" col="#e4572e" /><Cap tt={tt} at={6.8} x={1490} y={880} txt="GUS'S COFFEE" col="#8ab4ff" /></>} />;

// c35 · una olla, tres platos: la olla se inclina y cada chorro cae a su plato (estofado, gravy, cottage pie)
export const ROnePot: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.6, 2.9], l: [0, 0.45, 0], fov: 40 }} cam2={{ p: [0, 1.45, 2.4], l: [0, 0.42, 0.1], fov: 40 }} f={(tt) => {
  const plates: [string, number][] = [["la_n03a", 1.2], ["la_n01a", 3.2], ["la_n06a", 5.2]], cur = plates.findIndex(([, a]) => tt >= a && tt < a + 1.6);
  const x = cur >= 0 ? (cur - 1) * 0.85 : 0, tilt = cur >= 0 ? ez(tt, plates[cur][1], plates[cur][1] + 0.4) * (1 - ez(tt, plates[cur][1] + 1.2, plates[cur][1] + 1.6)) : 0;
  return <>
    <G p={[x, 0.75, -0.4]} r={[tilt * 0.9, 0, 0]}><Pot rad={0.32} h={0.36} photo="la_n03a" level={0.8} /></G>
    {tilt > 0.5 && <Pour x={x} z={-0.05} y0={0.85} y1={0.05} c="#6b3a1a" w={0.03} />}
    {plates.map(([id, a], i) => { const d = drop(tt, 0.2 + i * 0.2, 0.7), ph = ez(tt, a + 0.4, a + 1.4); return <G key={id} p={[(i - 1) * 0.85, d.y, 0.3]}><Plate rad={0.36} /><PhotoDisc id={id} rad={0.24} o={ph} zoom={1.45} p={[0, 0.03, 0]} /></G>; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={0.8} x={960} y={130} txt="ONE POT · THREE PLATES" col="#e4572e" />} />;

// c36 · platos calientes: el horno a 200°, la puerta de vidrio se abre y la pila de platos entra y sale brillando de calor
export const RWarmPlates: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.9, 2.3], l: [0, 0.5, 0], fov: 36 }} cam2={{ p: [0.3, 0.8, 1.8], l: [0, 0.5, 0], fov: 34 }} f={(tt) => {
  const door = ez(tt, 0.8, 1.8) * (1 - ez(tt, 3.4, 4.2)) + ez(tt, 7.0, 7.8), inn = ez(tt, 1.8, 3.2) * (1 - ez(tt, 7.8, 9.0)), heat = ez(tt, 4.2, 7.0), dial = ez(tt, 0.2, 1.0);
  return <>
    <mesh position={[0, 0.5, -0.5]} castShadow receiveShadow><boxGeometry args={[1.3, 1.0, 0.9]} /><Std c="#2b2b2e" m={0.5} r={0.4} /></mesh>
    <mesh position={[0, 0.48, -0.06]}><boxGeometry args={[1.0, 0.7, 0.02]} /><meshStandardMaterial color="#1a0d06" emissive="#c84a08" emissiveIntensity={0.12 + 0.3 * heat} /></mesh>
    <G p={[0, 0.13, -0.04]} r={[door * 1.4, 0, 0]}><mesh position={[0, 0.35, 0]} material={glass}><boxGeometry args={[1.0, 0.7, 0.03]} /></mesh></G>
    <G p={[0.5, 0.92, -0.04]} r={[0, 0, -dial * 2.2]}><mesh rotation-x={Math.PI / 2}><cylinderGeometry args={[0.06, 0.06, 0.04, 24]} /><Std c="#d9dde2" m={1} r={0.25} /></mesh><mesh position={[0, 0.04, 0.02]}><boxGeometry args={[0.012, 0.05, 0.01]} /><Std c="#b3241b" /></mesh></G>
    <G p={[0, 0.25, lerp(0.6, -0.5, inn)]}>{[0, 1, 2, 3, 4].map((i) => <G key={i} p={[0, i * 0.035, 0]}><Plate rad={0.3} /></G>)}</G>
  </>;
}} over={(tt) => <><Cap tt={tt} at={0.6} x={1500} y={170} txt="200° · 5 MIN" col="#e4572e" /><Cap tt={tt} at={8.4} x={420} y={170} txt="HOT TWICE AS LONG" col="#3fae5b" /></>} />;

// c37 · el riel de comandas: cada número cantado es una tira de papel que se engancha de un golpe y se balancea
export const RTicketRail: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.0, 2.0], l: [0, 0.95, 0], fov: 36 }} cam2={{ p: [0.4, 0.95, 1.6], l: [0.4, 0.95, 0], fov: 33 }} f={(tt) => {
  return <>
    <mesh material={steel} position={[0, 1.3, 0]} castShadow><boxGeometry args={[3.2, 0.06, 0.08]} /></mesh>
    {[15, 14, 13, 12, 11, 10].map((n, i) => { const a = 1.2 + i * 1.05, k = sp(tt, a, 9, 0.35); if (tt < a) return null; const sw = Math.exp(-(tt - a) * 2.2) * Math.sin((tt - a) * 9) * 0.35;
      return <G key={n} p={[-1.25 + i * 0.5, 1.28 + (1 - k) * 0.5, 0.05]} r={[sw, 0, sw * 0.4]}><Sheet id={`tk${n}`} w={0.34} h={0.6} th={0.003} p={[0, -0.3, 0]} draw={(g, w, hh) => { g.fillStyle = "#fbf8ee"; g.fillRect(0, 0, w, hh); g.fillStyle = "#3a6ea5"; g.fillRect(0, 0, w, 70); g.fillStyle = "#1d2440"; g.font = `900 200px ${FONT}`; g.textAlign = "center"; g.fillText(String(n), w / 2, 330); g.strokeStyle = "rgba(29,36,64,.4)"; for (let k2 = 0; k2 < 4; k2++) { g.beginPath(); g.moveTo(40, 430 + k2 * 70); g.lineTo(w - 40, 430 + k2 * 70); g.stroke(); } }} /></G>; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={0.6} x={960} y={1000} txt="ALL 15 · ONE MORE TIME" col="#e4572e" />} />;

// c38 · dos dólares el plato: la balanza de platillos se inclina con el chili mac y los dos billetes contra la moneda de 1972
export const RTwoDollar: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.2, 2.5], l: [0, 0.6, 0], fov: 36 }} cam2={{ p: [0, 1.0, 2.0], l: [0, 0.6, 0], fov: 34 }} f={(tt) => {
  const cn = drop(tt, 0.6, 1.0), pl = drop(tt, 2.0, 1.2), tip = sp(tt, 2.4, 5, 0.3) * 0.22 - (tt > 0.8 && tt < 2.4 ? 0.12 * ez(tt, 0.8, 1.3) : 0);
  const pan = (x: number): V3 => [x * Math.cos(tip), 1.0 - x * Math.sin(tip) - 0.45, 0];
  return <>
    <mesh material={steel} position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.03, 0.06, 1.0, 16]} /></mesh>
    <mesh material={steel} position={[0, 0.02, 0]}><cylinderGeometry args={[0.25, 0.3, 0.04, 32]} /></mesh>
    <G p={[0, 1.0, 0]} r={[0, 0, -tip]}><mesh material={steel} castShadow><boxGeometry args={[1.6, 0.03, 0.04]} /></mesh></G>
    {[-0.75, 0.75].map((x) => { const pp = pan(x); return <G key={x} p={pp}>
      {[0, 1, 2].map((k) => <mesh key={k} material={steel} position={[0.2 * Math.cos(k * 2.1), 0.22, 0.2 * Math.sin(k * 2.1)]} rotation={[0.4 * Math.sin(k * 2.1), 0, -0.4 * Math.cos(k * 2.1)]}><cylinderGeometry args={[0.004, 0.004, 0.48, 4]} /></mesh>)}
      <mesh material={steel} castShadow><cylinderGeometry args={[0.3, 0.24, 0.03, 40]} /></mesh>
      {x < 0 && cn.on && <G p={[0, 0.04 + cn.y, 0]}><Coin rad={0.2} txt="45¢" /></G>}
      {x > 0 && pl.on && <G p={[0, 0.03 + pl.y, 0]}><Plate rad={0.26} photo="la_n15a" /><Sheet id="bill2" w={0.3} h={0.13} th={0.003} p={[0.05, 0.05, 0.12]} r={[-Math.PI / 2, 0, 0.3]} draw={(g, w, hh) => { g.fillStyle = "#cfd8bf"; g.fillRect(0, 0, w, hh); g.fillStyle = "#2e5a3a"; g.font = `900 220px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("$2", w / 2, hh / 2); }} /></G>}
    </G>; })}
  </>;
}} over={(tt) => <><Cap tt={tt} at={1.0} x={420} y={170} txt="1972" col="#c9ced4" /><Cap tt={tt} at={2.8} x={1450} y={170} txt="TODAY · ~$2" col="#3fae5b" /></>} />;

export const R3B: Record<string, React.FC<P>> = {
  rubberBall: RCatfish, fryTherm: RFryTherm, krautWar: RKrautWar, rinseKraut: RRinseKraut, fiftyCents: RFiftyCents, veal3to5: RVeal, dredge: RDredge,
  gravyUnder: RGravyUnder, crock: RCrock, bubbles: RBubbles, beanMash: RBeanMash, postcard: RPostcard, forkRidges: RForkRidges, waterDance: RWaterDance,
  dollarCrust: RDollarCrust, steamSlits: RSteamSlits, snowIn: RSnowIn, chop45: RChop45, crowdPan: RCrowdPan, juiceGlass: RJuiceGlass, doubleDip: RDoubleDip,
  stackPlate: RStackPlate, drippings: RDrippings, coffeeGravy: RCoffeeGravy, promise: RPromise, walkIn: RWalkIn, nightClock: RNightClock, onePot: ROnePot,
  warmPlates: RWarmPlates, ticketRail: RTicketRail, twoDollar: RTwoDollar,
};
