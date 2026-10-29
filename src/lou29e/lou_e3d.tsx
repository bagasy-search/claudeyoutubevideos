// lou29e · componentes 3D de los pies de la tía Ruth: UN objeto grande y centrado que hace lo que Lou dice en ese segundo.
// Ninguno repite un componente de lou29a, b, c ni d.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { G, Pour, Sheet, Std, Steam3, Tool, ez, lerp, rnd, useTex, V3 } from "./props3d";
import { R3, Cap, drop } from "./lou_r3a";
import { FONT } from "./lib";

type P = { t: number; h: H };
const steel = new THREE.MeshStandardMaterial({ color: "#d9dde2", metalness: 1, roughness: 0.22 });
const tin = new THREE.MeshStandardMaterial({ color: "#c9ccd0", metalness: 0.9, roughness: 0.35, side: THREE.DoubleSide });
const china = new THREE.MeshPhysicalMaterial({ color: "#f4f1ea", roughness: 0.25, clearcoat: 1, side: THREE.DoubleSide });
const wood = new THREE.MeshStandardMaterial({ color: "#8a5a32", roughness: 0.62 });
const crust = new THREE.MeshPhysicalMaterial({ color: "#d39a52", roughness: 0.6, clearcoat: 0.25 });
const rawCrust = new THREE.MeshPhysicalMaterial({ color: "#efd6a6", roughness: 0.75, side: THREE.DoubleSide });
const lathe = (pts: [number, number][]) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), 72);
const TIN = lathe([[0.001, 0], [0.34, 0], [0.44, 0.1], [0.5, 0.11], [0.5, 0.12], [0.43, 0.115], [0.335, 0.012], [0.001, 0.012]]);
const LINING = lathe([[0.001, 0.014], [0.33, 0.016], [0.425, 0.108], [0.48, 0.124], [0.48, 0.14], [0.415, 0.124], [0.32, 0.032], [0.001, 0.032]]);
const BOWL = lathe([[0.001, 0], [0.2, 0], [0.32, 0.06], [0.42, 0.2], [0.44, 0.24], [0.425, 0.24], [0.4, 0.2], [0.3, 0.075], [0.19, 0.02], [0.001, 0.02]]);
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), Math.max(0, Math.min(1, k))).getStyle();
const TexMat: React.FC<{ id: string; w: number; h: number; draw: (g: CanvasRenderingContext2D, w: number, h: number) => void; r0?: number; m?: number }> = ({ id, w, h, draw, r0 = 0.6, m = 0 }) => {
  const tx = useTex(id, w, h, draw);
  return <meshStandardMaterial key={tx ? "t" : "n"} map={tx ?? undefined} roughness={r0} metalness={m} />;
};
const wedgeGeo = (r: number, a: number, d: number) => { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(r, 0); s.absarc(0, 0, r, 0, a, false); s.lineTo(0, 0); return new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 24 }); };
const Tin: React.FC<{ lined?: boolean }> = ({ lined }) => <><mesh geometry={TIN} material={tin} castShadow receiveShadow />{lined && <mesh geometry={LINING} material={rawCrust} receiveShadow />}</>;
const Rim: React.FC<{ y?: number }> = ({ y = 0.125 }) => <mesh position={[0, y, 0]} rotation-x={Math.PI / 2} material={crust} castShadow><torusGeometry args={[0.47, 0.035, 14, 72]} /></mesh>;
const TOPV = { p: [0, 1.0, 0.78] as V3, l: [0, 0.06, 0] as V3, fov: 34 };
const TOPV2 = { p: [0.05, 0.9, 0.68] as V3, l: [0, 0.06, 0] as V3, fov: 32 };

// e00 · mock apple: las galletitas caen al almíbar y hierven DOS minutos; nadie las revuelve
export const RCrackerBoil: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.95, 0.68], l: [0, 0.16, 0], fov: 34 }} cam2={{ p: [0.05, 0.88, 0.6], l: [0, 0.16, 0], fov: 32 }} f={(tt) => <>
  <mesh position={[0, 0.13, 0]} castShadow><cylinderGeometry args={[0.44, 0.42, 0.26, 64, 1, true]} /><meshStandardMaterial color="#d9dde2" metalness={1} roughness={0.22} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.005, 0]} material={steel}><cylinderGeometry args={[0.42, 0.42, 0.01, 64]} /></mesh>
  <mesh position={[0.7, 0.24, 0]} castShadow><boxGeometry args={[0.5, 0.03, 0.06]} /><Std c="#1a1a1a" r={0.4} cc={1} /></mesh>
  <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.43, 0.43, 0.01, 64]} /><meshPhysicalMaterial color="#e2c271" roughness={0.35} clearcoat={0.3} /></mesh>
  {[...Array(14)].map((_, i) => { const d = drop(tt, 0.5 + i * 0.07, 0.5); const a = rnd(i, 1) * 6.28, r = 0.3 * Math.sqrt(rnd(i, 2)); return d.on ? <G key={i} p={[Math.cos(a) * r, 0.205 + d.y + 0.006 * Math.sin(tt * 4 + i), Math.sin(a) * r]} r={[0.08 * Math.sin(tt * 3 + i), rnd(i, 3) * 3, 0]}><mesh castShadow><boxGeometry args={[0.13, 0.032, 0.11]} /><Std c="#f0dca0" r={0.7} /></mesh></G> : null; })}
  {[...Array(16)].map((_, i) => { const ph = (tt * 1.3 + rnd(i, 4)) % 1, a = rnd(i, 5) * 6.28, r = 0.38 * Math.sqrt(rnd(i, 6)); return <mesh key={"b" + i} position={[Math.cos(a) * r, 0.205, Math.sin(a) * r]} scale={Math.sin(ph * Math.PI)}><sphereGeometry args={[0.018, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#efd28a" roughness={0.05} clearcoat={1} /></mesh>; })}
</>} over={(tt) => <Cap tt={tt} at={1.6} x={1380} y={150} txt="2 MIN · DON'T STIR" col="#e2c271" />} />;

// e01 · vinegar pie: la botella de sidra se inclina y llena la cuchara sopera: dos, ni una más
export const RVinegarSpoon: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.72, 0.95], l: [0, 0.18, 0], fov: 34 }} cam2={{ p: [0.05, 0.68, 0.85], l: [0, 0.18, 0], fov: 32 }} f={(tt) => {
  const tilt = ez(tt, 0.5, 1.2) * (1 - ez(tt, 3.6, 4.2)), fill = ez(tt, 1.3, 3.2);
  return <>
    <G p={[0, 0.05, 0.1]} r={[0, -0.6, 0]}><Tool kind="spoon" s={2.2} />
      {fill > 0.02 && <mesh position={[0, 0.03, -0.044]} scale={[0.6 + 0.4 * fill, 1, 1.35 * (0.6 + 0.4 * fill)]}><cylinderGeometry args={[0.13, 0.13, 0.004, 40]} /><meshPhysicalMaterial color="#c98a2a" roughness={0.05} clearcoat={0.6} transparent opacity={0.9} /></mesh>}
    </G>
    <G p={[0.25, 0.25, 0.05]} r={[0, 0, 1.9 * tilt]} s={0.75}>
      <mesh position={[0, 0.0, 0]} castShadow><cylinderGeometry args={[0.085, 0.085, 0.36, 40]} /><meshPhysicalMaterial color="#b8742a" roughness={0.05} clearcoat={1} transparent opacity={0.88} /></mesh>
      <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.088, 0.088, 0.16, 40, 1, true, -0.8, 1.6]} /><TexMat id="cider" w={512} h={300} draw={(g, w, hh) => { g.fillStyle = "#f2e6c4"; g.fillRect(0, 0, w, hh); g.fillStyle = "#b3241b"; g.fillRect(0, 0, w, hh * 0.18); g.fillRect(0, hh * 0.82, w, hh * 0.18); g.fillStyle = "#1d2440"; g.font = `900 ${Math.round(hh * 0.24)}px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("CIDER", w / 2, hh * 0.38); g.fillText("VINEGAR", w / 2, hh * 0.64); }} /></mesh>
      <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.03, 0.06, 0.1, 24]} /><meshPhysicalMaterial color="#b8742a" roughness={0.05} clearcoat={1} transparent opacity={0.88} /></mesh>
      <mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.034, 0.034, 0.03, 24]} /><Std c="#8a1d14" r={0.4} cc={1} /></mesh>
    </G>
    <Pour x={0.05} z={0.06} y0={0.18} y1={0.085} c="#c98a2a" w={0.012} o={tilt > 0.9 && fill < 0.99 ? 1 : 0} />
  </>;
}} over={(tt) => <Cap tt={tt} at={1.4} x={480} y={150} txt="2 TBSP · NO MORE" col="#c98a2a" />} />;

// e02 · horneado en blanco: el tenedor pincha la masa, entra el papel y llueven porotos secos
export const RBlindBeans: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={TOPV} cam2={TOPV2} f={(tt) => {
  const paper = drop(tt, 1.8, 0.5);
  return <>
    <Tin lined />
    {[...Array(16)].map((_, i) => { const a = (i / 16) * 6.28 + rnd(i, 1), r = 0.08 + 0.2 * rnd(i, 2); return tt > 0.5 + i * 0.06 ? <mesh key={i} position={[Math.cos(a) * r, 0.033, Math.sin(a) * r]}><cylinderGeometry args={[0.008, 0.008, 0.003, 10]} /><Std c="#7a5530" /></mesh> : null; })}
    {paper.on && <mesh position={[0, 0.04 + paper.y, 0]} rotation-y={0.3}><boxGeometry args={[0.66, 0.003, 0.66]} /><meshStandardMaterial color="#f7f3ea" roughness={0.9} /></mesh>}
    {[...Array(80)].map((_, i) => { const d = drop(tt, 2.4 + i * 0.02, 0.6); const a = rnd(i, 3) * 6.28, r = 0.28 * Math.sqrt(rnd(i, 4)); return d.on ? <mesh key={"b" + i} position={[Math.cos(a) * r, 0.055 + 0.018 * Math.floor(i / 40) + d.y, Math.sin(a) * r]} rotation-y={rnd(i, 5) * 3} scale={[1.4, 0.8, 0.9]} castShadow><sphereGeometry args={[0.022, 14, 8]} /><meshPhysicalMaterial color="#efe3c4" roughness={0.35} clearcoat={0.6} /></mesh> : null; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.2} x={1440} y={150} txt="BLIND BAKE" col="#efd6a6" />} />;

// e03 · green tomato pie: el tomate verde se va en rodajas finitas que se abren en abanico
const SLICE = (g: CanvasRenderingContext2D, w: number) => { g.fillStyle = "#5c8f2e"; g.fillRect(0, 0, w, w); g.fillStyle = "#cfe39a"; g.beginPath(); g.arc(w / 2, w / 2, w * 0.46, 0, 6.3); g.fill(); g.fillStyle = "#e6f0c0"; for (let i = 0; i < 5; i++) { const a = i * 1.257; g.beginPath(); g.ellipse(w / 2 + Math.cos(a) * w * 0.24, w / 2 + Math.sin(a) * w * 0.24, w * 0.1, w * 0.06, a, 0, 6.3); g.fill(); } g.fillStyle = "#f6f2d8"; for (let i = 0; i < 30; i++) { const a = rnd(i, 1) * 6.28, r = w * (0.18 + 0.1 * rnd(i, 2)); g.beginPath(); g.ellipse(w / 2 + Math.cos(a) * r, w / 2 + Math.sin(a) * r, 5, 3, a, 0, 6.3); g.fill(); } };
export const RGreenTomato: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [-0.05, 0.72, 0.72], l: [-0.05, 0.08, 0], fov: 34 }} cam2={{ p: [-0.03, 0.66, 0.64], l: [-0.05, 0.08, 0], fov: 32 }} f={(tt) => <>
  <mesh position={[0, 0.02, 0]} material={wood} castShadow receiveShadow><boxGeometry args={[1.1, 0.04, 0.62]} /></mesh>
  <G p={[0.3, 0.17, 0]} s={[1, 0.92, 1]}><mesh castShadow><sphereGeometry args={[0.16, 48, 24]} /><meshPhysicalMaterial color="#6f9e36" roughness={0.2} clearcoat={1} /></mesh></G>
  {[...Array(8)].map((_, i) => { const a = 0.6 + i * 0.36, k = ez(tt, a, a + 0.35); return tt > a ? <G key={i} p={[lerp(0.2, -0.42 + i * 0.085, k), 0.05 + i * 0.006 + 0.08 * (1 - k), lerp(0, 0.04 * Math.sin(i), k)]} r={[0.12 * (1 - k), 0, -0.22]}><mesh castShadow><cylinderGeometry args={[0.15, 0.15, 0.012, 48]} /><TexMat id="gtslice" w={256} h={256} draw={SLICE} r0={0.3} /></mesh></G> : null; })}
</>} over={(tt) => <Cap tt={tt} at={1.4} x={480} y={150} txt="1/8 INCH THIN" col="#8fc04a" />} />;

// e04 · funeral pie: el pie de pasas y la tarjeta de Ruth: «para la familia», sin cobrar
export const RFuneralCard: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.62, 1.1], l: [0, 0.14, 0], fov: 34 }} cam2={{ p: [0.05, 0.58, 0.98], l: [0, 0.15, 0], fov: 32 }} f={(tt) => {
  const k = ez(tt, 0.8, 1.8);
  return <>
    <G p={[0, 0, -0.32]}>
      <Tin />
      <mesh position={[0, 0.115, 0]} scale={[1, 0.18, 1]} material={crust} castShadow><sphereGeometry args={[0.46, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
      <Rim />
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, i * 0.785]}><planeGeometry args={[0.18, 0.012]} /><Std c="#5a2a14" /></mesh>)}
    </G>
    <G p={[lerp(0.45, 0, k), 0.19, 0.36]} r={[-0.3, lerp(-0.5, 0, k), 0]}>
      <Sheet id="fcard" w={0.6} h={0.36} th={0.004} draw={(g, w, hh) => { g.fillStyle = "#f8f3e6"; g.fillRect(0, 0, w, hh); g.strokeStyle = "#1d2440"; g.lineWidth = 6; g.strokeRect(10, 10, w - 20, hh - 20); g.fillStyle = "#1d2440"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `italic 700 ${Math.round(hh * 0.2)}px Georgia, serif`; g.fillText("For the family", w / 2, hh * 0.33); g.font = `italic 600 ${Math.round(hh * 0.13)}px Georgia, serif`; g.fillText("— Ruth", w * 0.62, hh * 0.55); g.fillStyle = "#b3241b"; g.font = `900 ${Math.round(hh * 0.15)}px ${FONT}`; g.fillText("NO CHARGE", w / 2, hh * 0.8); }} />
    </G>
  </>;
}} />;

// e05 · ruibarbo: el tallo rojo se queda; la hoja se corta y se aparta (es venenosa)
export const RRhubarbLeaf: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0.12, 1.1, 1.0], l: [0.12, 0.03, 0], fov: 34 }} cam2={{ p: [0.13, 1.02, 0.9], l: [0.12, 0.03, 0], fov: 32 }} f={(tt) => {
  const cut = ez(tt, 1.0, 1.3), away = ez(tt, 1.4, 2.4), dead = ez(tt, 2.0, 3.0);
  return <>
    <mesh position={[-0.12, 0.035, 0]} rotation-z={Math.PI / 2} castShadow><cylinderGeometry args={[0.035, 0.04, 0.8, 32]} /><meshPhysicalMaterial color="#c2304a" roughness={0.3} clearcoat={0.9} /></mesh>
    <G p={[0.4 + 0.12 * away, 0.03 + 0.03 * cut, 0.05 * away]} r={[0, 0.3 * away, 0]} s={0.85}>
      <mesh rotation-x={-Math.PI / 2} scale={[1.15, 1, 1]} castShadow><circleGeometry args={[0.26, 48]} /><meshPhysicalMaterial color={col("#4f8a2e", "#6f6a40", dead)} roughness={0.45} clearcoat={0.4} side={THREE.DoubleSide} /></mesh>
      {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[0.0, 0.003, 0]} rotation={[-Math.PI / 2, 0, -0.9 + i * 0.45]}><planeGeometry args={[0.5, 0.008]} /><Std c="#9cc06a" /></mesh>)}
    </G>
    {[-0.1, 0.1].map((z) => <mesh key={z} position={[-0.16, 0.035, z]} rotation-z={Math.PI / 2} castShadow><cylinderGeometry args={[0.03, 0.035, 0.72, 32]} /><meshPhysicalMaterial color="#b8283f" roughness={0.3} clearcoat={0.9} /></mesh>)}
  </>;
}} over={(tt) => <><Cap tt={tt} at={1.6} x={1460} y={150} txt="LEAVES = POISON" col="#d42a1e" /><Cap tt={tt} at={2.4} x={520} y={150} txt="STALKS ONLY" col="#3fae5b" /></>} />;

// pie de merengue compartido por e06 (picos que se levantan) y e07 (el día de lluvia que los hace llorar)
const PEAKS = [...Array(42)].map((_, i) => { const a = i * 2.399, r = 0.4 * Math.sqrt((i + 0.5) / 42); return { x: Math.cos(a) * r, z: Math.sin(a) * r, r, s: 0.8 + 0.4 * rnd(i, 9) }; });
const MeringuePie: React.FC<{ k: number; gold: number; droop?: number; weep?: number }> = ({ k, gold, droop = 0, weep = 0 }) => <>
  <Tin />
  <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.44, 0.44, 0.01, 64]} /><meshPhysicalMaterial color="#f2d33a" roughness={0.15} clearcoat={1} /></mesh>
  <Rim />
  <mesh position={[0, 0.105, 0]} scale={[1, 0.28 * Math.max(0.05, k) * (1 - 0.3 * droop), 1]} castShadow><sphereGeometry args={[0.44, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color={col("#fbfaf5", "#f3e2b8", gold * 0.5)} roughness={0.35} clearcoat={0.7} /></mesh>
  {PEAKS.map((q, i) => { const y = 0.105 + 0.123 * Math.sqrt(Math.max(0, 1 - (q.r / 0.44) ** 2)) * Math.max(0.05, k) * (1 - 0.3 * droop); return <G key={i} p={[q.x, y, q.z]} s={[1 + 0.2 * droop, Math.max(0.05, k) * q.s * (1 - 0.55 * droop), 1 + 0.2 * droop]}>
    <mesh position={[0, 0.01, 0]} scale={[1, 0.8, 1]} castShadow><sphereGeometry args={[0.05, 24, 14]} /><meshPhysicalMaterial color="#fbfaf5" roughness={0.3} clearcoat={0.8} /></mesh>
    <mesh position={[0.006, 0.06, 0]} rotation-z={-0.18} castShadow><coneGeometry args={[0.042, 0.1, 24]} /><meshPhysicalMaterial color={col("#fbfaf5", "#e2b26a", gold * 0.8)} roughness={0.3} clearcoat={0.7} /></mesh>
  </G>; })}
  {weep > 0.02 && [...Array(24)].map((_, i) => { const q = PEAKS[(i * 7) % 42]; return <mesh key={"w" + i} position={[q.x * 1.05, 0.14 + 0.04 * rnd(i, 3), q.z * 1.05]} scale={weep}><sphereGeometry args={[0.014, 12, 8]} /><meshPhysicalMaterial color="#fff6d8" roughness={0} clearcoat={1} transmission={0.6} transparent opacity={0.85} /></mesh>; })}
</>;
export const RMeringuePeaks: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.72, 0.95], l: [0, 0.16, 0], fov: 34 }} cam2={{ p: [0.05, 0.68, 0.85], l: [0, 0.17, 0], fov: 32 }} f={(tt) =>
  <MeringuePie k={ez(tt, 0.5, 2.4)} gold={ez(tt, 2.8, 4.2)} />} over={(tt) => <Cap tt={tt} at={1.4} x={1400} y={150} txt="STIFF, SHINY PEAKS" col="#f2d33a" />} />;

// e07 · nunca en día de lluvia: la ventana chorrea y el merengue se desinfla y llora gotitas
export const RRainyDay: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.52, 1.0], l: [0, 0.24, -0.25], fov: 34 }} cam2={{ p: [0.05, 0.5, 0.9], l: [0, 0.24, -0.25], fov: 32 }} f={(tt) => <>
  <G p={[0, 0.62, -0.7]}>
    <mesh><planeGeometry args={[1.3, 0.8]} /><meshStandardMaterial color="#4c5c6c" roughness={0.3} /></mesh>
    {[[0, 0.42, 1.42, 0.05], [0, -0.42, 1.42, 0.05], [-0.69, 0, 0.05, 0.88], [0.69, 0, 0.05, 0.88], [0, 0, 0.04, 0.84], [0, 0, 1.38, 0.04]].map(([x, y, w, hh], i) => <mesh key={i} position={[x, y, 0.02]}><boxGeometry args={[w, hh, 0.05]} /><Std c="#f2efe6" r={0.5} /></mesh>)}
    {[...Array(34)].map((_, i) => { const ph = (tt * (0.5 + 0.4 * rnd(i, 2)) + rnd(i, 3)) % 1; return <mesh key={"r" + i} position={[-0.62 + 1.24 * rnd(i, 1), 0.38 - 0.76 * ph, 0.012]}><boxGeometry args={[0.006, 0.05 + 0.04 * rnd(i, 4), 0.002]} /><meshBasicMaterial color="#cfe0ee" transparent opacity={0.75} /></mesh>; })}
  </G>
  <G p={[0, 0, 0.05]}><MeringuePie k={1} gold={0.6} droop={ez(tt, 1.0, 4.0)} weep={ez(tt, 2.0, 3.6)} /></G>
</>} over={(tt) => <Cap tt={tt} at={1.2} x={1400} y={150} txt="NEVER ON A RAINY DAY" col="#9fb7c9" />} />;

// e08 · banana cream: el corte de costado se arma capa por capa: masa, crema, BANANAS, crema, chantilly
const WEDGE = (d: number) => wedgeGeo(0.62, 0.75, d);
const LAY: [string, number][] = [["#c98d4a", 0.035], ["#f3dc8a", 0.03], ["#f4ecbc", 0.035], ["#f3dc8a", 0.06], ["#fbfaf4", 0.05]];
const LAYG = LAY.map(([, d]) => WEDGE(d));
export const RBananaLayer: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0.3, 0.45, 0.95], l: [0.3, 0.1, -0.15], fov: 34 }} cam2={{ p: [0.32, 0.43, 0.85], l: [0.3, 0.1, -0.15], fov: 32 }} f={(tt) => {
  let y = 0.012;
  return <>
    <mesh position={[0.3, 0.006, -0.2]}><cylinderGeometry args={[0.55, 0.55, 0.012, 64]} /><primitive object={china} attach="material" /></mesh>
    {LAY.map(([c, d], i) => { const dr = drop(tt, 0.5 + i * 0.55, 0.22), y0 = y; y += d; return dr.on ? <mesh key={i} geometry={LAYG[i]} position={[0, y0 + dr.y, 0]} rotation-x={-Math.PI / 2} castShadow receiveShadow><meshPhysicalMaterial color={c} roughness={i === 4 ? 0.5 : 0.3} clearcoat={i === 0 ? 0.2 : 0.6} /></mesh> : null; })}
    {tt > 1.75 && [...Array(6)].map((_, i) => <G key={"c" + i} p={[0.07 + i * 0.092, 0.0945, 0.003]}><mesh rotation-x={Math.PI / 2}><cylinderGeometry args={[0.042, 0.042, 0.004, 32]} /><meshPhysicalMaterial color="#f2dc6a" roughness={0.3} clearcoat={0.5} /></mesh><mesh position={[0, 0, 0.0025]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.012, 0.012, 0.002, 16]} /><Std c="#b89a3a" /></mesh></G>)}
    {tt > 2.8 && [...Array(10)].map((_, i) => { const a = 0.75 * rnd(i, 1), r = 0.15 + 0.4 * rnd(i, 2); return <mesh key={"w" + i} position={[Math.cos(a) * r, 0.222, -Math.sin(a) * r]} scale={[1, 0.6, 1]}><sphereGeometry args={[0.045, 16, 10]} /><meshPhysicalMaterial color="#fbfaf4" roughness={0.5} /></mesh>; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.2} x={1400} y={150} txt="CUSTARD FIRST" col="#f3dc8a" />} />;

// e09 · coco tostado: en la sartén seca el coco rallado pasa de blanco a dorado mientras la cuchara lo mueve
export const RToastCoconut: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={TOPV} cam2={TOPV2} f={(tt) => {
  const gold = ez(tt, 0.8, 4.0);
  return <>
    <mesh position={[0, 0.02, 0]} castShadow receiveShadow><cylinderGeometry args={[0.46, 0.44, 0.04, 64]} /><Std c="#2a2a2c" r={0.55} m={0.4} /></mesh>
    <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.47, 0.45, 0.08, 64, 1, true]} /><meshStandardMaterial color="#2a2a2c" roughness={0.55} metalness={0.4} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.75, 0.08, 0]} castShadow><boxGeometry args={[0.6, 0.035, 0.08]} /><Std c="#2a2a2c" r={0.55} m={0.4} /></mesh>
    {[...Array(140)].map((_, i) => { const a = rnd(i, 1) * 6.28, r = 0.36 * Math.sqrt(rnd(i, 2)), sw = 0.03 * Math.sin(tt * 2 + i); return <mesh key={i} position={[Math.cos(a + sw) * r, 0.045 + 0.012 * rnd(i, 3), Math.sin(a + sw) * r]} rotation={[0, rnd(i, 4) * 3, rnd(i, 5) * 0.4]}><boxGeometry args={[0.06, 0.01, 0.014]} /><Std c={col("#f7f4ea", rnd(i, 6) > 0.5 ? "#c98a3a" : "#dca55a", gold * (0.7 + 0.3 * rnd(i, 7)))} r={0.6} /></mesh>; })}
    <G p={[0.2 * Math.cos(tt * 1.6), 0.07, 0.2 * Math.sin(tt * 1.6)]} r={[0, -tt * 1.6, 0]}><mesh material={wood} position={[0, 0, 0]} scale={[1, 0.35, 1.4]} castShadow><sphereGeometry args={[0.06, 24, 12]} /></mesh><mesh material={wood} position={[0, 0.1, 0.25]} rotation-x={1.15} castShadow><cylinderGeometry args={[0.014, 0.016, 0.42, 14]} /></mesh></G>
  </>;
}} over={(tt) => <Cap tt={tt} at={1.4} x={1440} y={150} txt="UNTIL GOLDEN" col="#dca55a" />} />;

// e10 · cherry: las tiras de una pulgada caen sobre las cerezas y arman el enrejado
const XS = [-0.3, -0.15, 0, 0.15, 0.3];
export const RLatticeWeave: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={TOPV} cam2={TOPV2} f={(tt) => <>
  <Tin />
  <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.44, 0.44, 0.01, 64]} /><meshPhysicalMaterial color="#8e1420" roughness={0.12} clearcoat={1} /></mesh>
  {[...Array(30)].map((_, i) => { const a = rnd(i, 1) * 6.28, r = 0.4 * Math.sqrt(rnd(i, 2)); return <mesh key={i} position={[Math.cos(a) * r, 0.11, Math.sin(a) * r]} castShadow><sphereGeometry args={[0.04, 18, 10]} /><meshPhysicalMaterial color="#6e0c18" roughness={0.1} clearcoat={1} /></mesh>; })}
  <Rim />
  {XS.map((x, i) => { const d = drop(tt, 0.6 + i * 0.18, 0.5), L = 2 * Math.sqrt(0.47 ** 2 - x * x); return d.on ? <mesh key={"v" + i} position={[x, 0.15 + d.y, 0]} material={crust} castShadow><boxGeometry args={[0.075, 0.016, L]} /></mesh> : null; })}
  {XS.map((z, i) => { const d = drop(tt, 1.8 + i * 0.18, 0.5), L = 2 * Math.sqrt(0.47 ** 2 - z * z); return d.on ? <mesh key={"h" + i} position={[0, 0.168 + d.y, z]} material={crust} castShadow><boxGeometry args={[L, 0.016, 0.075]} /></mesh> : null; })}
</>} over={(tt) => <Cap tt={tt} at={1.0} x={1440} y={150} txt="1-INCH STRIPS" col="#d39a52" />} />;

// e11 · los rulos de chocolate: el pelapapas recorre la barra y los rulos caen sobre la tabla
const CURL = new THREE.TorusGeometry(0.05, 0.016, 10, 28, 4.6);
export const RChocoCurl: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.52, 0.75], l: [0, 0.1, 0], fov: 34 }} cam2={{ p: [0.05, 0.5, 0.68], l: [0, 0.1, 0], fov: 32 }} f={(tt) => {
  const run = (tt - 0.6) / 1.6, px = run < 0 ? -0.36 : lerp(-0.36, 0.36, run % 1);
  return <>
    <mesh position={[0, 0.02, 0.05]} castShadow receiveShadow><boxGeometry args={[1.1, 0.04, 0.6]} /><meshPhysicalMaterial color="#ece6da" roughness={0.2} clearcoat={1} /></mesh>
    <mesh position={[0, 0.08, -0.05]} castShadow><boxGeometry args={[0.76, 0.08, 0.28]} /><meshPhysicalMaterial color="#4a2616" roughness={0.3} clearcoat={0.7} /></mesh>
    {[-0.19, 0, 0.19].map((x) => <mesh key={x} position={[x, 0.121, -0.05]}><boxGeometry args={[0.012, 0.004, 0.28]} /><Std c="#2e160c" /></mesh>)}
    {run > 0 && <G p={[px, 0.14, -0.05]}>
      <mesh material={steel} castShadow><boxGeometry args={[0.03, 0.01, 0.2]} /></mesh>
      {[-0.1, 0.1].map((z) => <mesh key={z} material={steel} position={[0, 0.03, z]}><boxGeometry args={[0.012, 0.06, 0.012]} /></mesh>)}
      <mesh position={[0, 0.05, 0.17]} rotation-x={Math.PI / 2 - 0.35} castShadow><cylinderGeometry args={[0.018, 0.02, 0.13, 18]} /><Std c="#9a1f16" r={0.35} cc={1} /></mesh>
    </G>}
    {[...Array(9)].map((_, i) => { const at = 0.8 + i * 0.4; if (tt < at) return null; const k = ez(tt, at, at + 0.5); return <G key={i} p={[lerp(-0.3 + (i % 5) * 0.15, -0.3 + i * 0.075, k), lerp(0.15, 0.06, k), lerp(-0.05, 0.13, k)]} r={[Math.PI / 2 * k, rnd(i, 1) * 3, 0]}><mesh geometry={CURL} castShadow><meshPhysicalMaterial color="#4a2616" roughness={0.3} clearcoat={0.7} /></mesh></G>; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.2} x={1400} y={150} txt="A POTATO PEELER" col="#c98a5a" />} />;

// e12 · la grasa en la harina: los cubos de manteca de cerdo se achican hasta el tamaño de una arveja
const LARD = [...Array(7)].map((_, i) => ({ x: 0.3 * Math.cos(i * 0.9) * Math.sqrt((i + 1) / 7), z: 0.3 * Math.sin(i * 0.9) * Math.sqrt((i + 1) / 7) }));
export const RPeaPieces: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0.15, 0.95, 0.9], l: [0.15, 0.1, 0], fov: 34 }} cam2={{ p: [0.17, 0.88, 0.8], l: [0.15, 0.1, 0], fov: 32 }} f={(tt) => {
  const k = ez(tt, 0.6, 3.6);
  return <>
    <G s={1.3}><mesh geometry={BOWL} castShadow receiveShadow><meshPhysicalMaterial color="#3d6fa8" roughness={0.25} clearcoat={1} side={THREE.DoubleSide} /></mesh></G>
    <mesh position={[0, 0.04, 0]} scale={[1, 0.32, 1]}><sphereGeometry args={[0.42, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#f6f3ec" roughness={0.95} /></mesh>
    {LARD.map((q, i) => { const sc = 1 - 0.62 * k; return <mesh key={i} position={[q.x, 0.04 + 0.134 * Math.sqrt(Math.max(0, 1 - (Math.hypot(q.x, q.z) / 0.42) ** 2)) + 0.03 * sc, q.z]} rotation-y={i} scale={sc} castShadow><boxGeometry args={[0.1, 0.08, 0.1]} /><meshPhysicalMaterial color="#fbf6e8" roughness={0.4} clearcoat={0.5} /></mesh>; })}
    {k > 0.3 && [...Array(24)].map((_, i) => { const a = rnd(i, 1) * 6.28, r = 0.32 * Math.sqrt(rnd(i, 2)); return <mesh key={"p" + i} position={[Math.cos(a) * r, 0.055 + 0.134 * Math.sqrt(Math.max(0, 1 - (r / 0.42) ** 2)), Math.sin(a) * r]} scale={Math.min(1, (k - 0.3) * 2)}><boxGeometry args={[0.035, 0.03, 0.035]} /><meshPhysicalMaterial color="#fbf6e8" roughness={0.4} clearcoat={0.5} /></mesh>; })}
    {tt > 2.4 && <mesh position={[0.66, 0.045, 0.12]} castShadow scale={Math.min(1, (tt - 2.4) * 3)}><sphereGeometry args={[0.045, 24, 14]} /><meshPhysicalMaterial color="#5aa83a" roughness={0.3} clearcoat={1} /></mesh>}
  </>;
}} over={(tt) => <Cap tt={tt} at={2.5} x={1440} y={150} txt="SIZE OF PEAS" col="#5aa83a" />} />;

// e13 · el repulgue: el borde liso se ondula de a poco alrededor del pie
const BUMPS = 44;
export const RCrimpEdge: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.15, 0.92], l: [0, 0.06, 0], fov: 34 }} cam2={{ p: [0.05, 1.08, 0.85], l: [0, 0.06, 0], fov: 32 }} f={(tt) => {
  const k = ez(tt, 0.6, 4.0);
  return <>
    <Tin />
    <mesh position={[0, 0.115, 0]} scale={[1, 0.15, 1]} material={crust} castShadow><sphereGeometry args={[0.45, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
    <Rim y={0.12} />
    {[...Array(BUMPS)].map((_, i) => { const a = (i / BUMPS) * Math.PI * 2, on = i / BUMPS < k, r = 0.47 + (on ? (i % 2 ? 0.018 : -0.006) : 0); return <mesh key={i} position={[Math.cos(a) * r, 0.135, Math.sin(a) * r]} rotation-y={-a} scale={[on ? 1.1 : 1.3, on ? 0.9 : 0.6, on ? 0.6 : 0.8]} material={crust} castShadow><sphereGeometry args={[0.042, 16, 10]} /></mesh>; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.2} x={420} y={950} txt="FOLD & CRIMP" col="#d39a52" />} />;

// e14 · tres horas: la porción cortada caliente se derrama en un charco; la que esperó queda firme
const SLC = wedgeGeo(0.48, 0.6, 0.11), SLT = wedgeGeo(0.48, 0.6, 0.025);
const Slice: React.FC<{ p: V3; slump: number }> = ({ p, slump }) => <G p={p} r={[0, 0.5, 0]}>
  <G s={[1, 1 - 0.45 * slump, 1]}><mesh geometry={SLC} rotation-x={-Math.PI / 2} position={[-0.2, 0.012, 0.12]} castShadow><meshPhysicalMaterial color="#9a1420" roughness={0.15} clearcoat={1} /></mesh>
    <mesh geometry={SLT} rotation-x={-Math.PI / 2} position={[-0.2, 0.122, 0.12]} material={crust} castShadow /></G>
</G>;
export const RCoolThree: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.95, 1.15], l: [0, 0.05, 0], fov: 34 }} cam2={{ p: [0.05, 0.9, 1.05], l: [0, 0.05, 0], fov: 32 }} f={(tt) => {
  const run = ez(tt, 0.8, 3.6);
  return <>
    {[-0.5, 0.5].map((x) => <mesh key={x} position={[x, 0.006, 0]} receiveShadow><cylinderGeometry args={[0.44, 0.44, 0.012, 64]} /><meshStandardMaterial color="#efeae0" roughness={0.55} /></mesh>)}
    {run > 0.03 && <mesh position={[-0.5, 0.0135, 0.12]} scale={[0.15 + 0.85 * run, 1, 0.12 + 0.6 * run]}><cylinderGeometry args={[0.3, 0.3, 0.003, 48]} /><meshPhysicalMaterial color="#8e1420" roughness={0.02} clearcoat={1} /></mesh>}
    <Slice p={[-0.5, 0, 0]} slump={run} />
    <Slice p={[0.5, 0, 0]} slump={0} />
  </>;
}} over={(tt) => <><Cap tt={tt} at={0.8} x={560} y={150} txt="CUT HOT" col="#d42a1e" /><Cap tt={tt} at={1.4} x={1360} y={150} txt="3 HOURS" col="#3fae5b" /></>} />;

// e15 · antes de sacarse el abrigo: la manteca de cerdo y la de vaca al freezer 20 minutos, se escarchan
export const RFrostFat: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.5, 0.72], l: [0, 0.1, 0], fov: 34 }} cam2={{ p: [0.05, 0.48, 0.65], l: [0, 0.1, 0], fov: 32 }} f={(tt) => {
  const fr = ez(tt, 0.8, 4.0);
  return <>
    <mesh position={[0, 0.01, 0]} receiveShadow><boxGeometry args={[1.0, 0.02, 0.55]} /><meshStandardMaterial color={col("#d9dde2", "#e6f2fa", fr)} metalness={0.6} roughness={0.3} /></mesh>
    <mesh position={[-0.22, 0.11, 0]} castShadow><boxGeometry args={[0.36, 0.18, 0.26]} /><meshPhysicalMaterial color={col("#fbf6e8", "#eef6fb", fr)} roughness={0.5 + 0.3 * fr} clearcoat={0.4} /></mesh>
    <mesh position={[0.24, 0.07, 0]} castShadow><boxGeometry args={[0.4, 0.1, 0.13]} /><meshPhysicalMaterial color={col("#f5d76a", "#f2e6b0", fr)} roughness={0.4 + 0.3 * fr} clearcoat={0.4} /></mesh>
    {[...Array(220)].map((_, i) => { const lard = i < 130, x = lard ? -0.22 + 0.34 * (rnd(i, 1) - 0.5) : 0.24 + 0.38 * (rnd(i, 1) - 0.5), y = lard ? 0.202 : 0.122, z = (lard ? 0.24 : 0.12) * (rnd(i, 2) - 0.5); return fr > rnd(i, 3) ? <mesh key={i} position={[x, y, z]} rotation-y={rnd(i, 4) * 3}><octahedronGeometry args={[0.012, 0]} /><meshStandardMaterial color="#ffffff" emissive="#dff0ff" emissiveIntensity={0.5} /></mesh> : null; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.2} x={1400} y={150} txt="FREEZER · 20 MIN" col="#9fc8e8" />} />;

export const R3X: Record<string, React.FC<P>> = {
  crackerBoil: RCrackerBoil, vinegarSpoon: RVinegarSpoon, blindBeans: RBlindBeans, greenTomato: RGreenTomato, funeralCard: RFuneralCard,
  rhubarbLeaf: RRhubarbLeaf, meringuePeaks: RMeringuePeaks, rainyDay: RRainyDay, bananaLayer: RBananaLayer, toastCoconut: RToastCoconut,
  latticeWeave: RLatticeWeave, chocoCurl: RChocoCurl, peaPieces: RPeaPieces, crimpEdge: RCrimpEdge, coolThree: RCoolThree, frostFat: RFrostFat,
};
