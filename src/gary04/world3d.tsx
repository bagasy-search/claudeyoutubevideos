// gary04 · EL MUNDO: la casa de Gary en CORTE, como casa de muñecas, una noche nevada de enero en Ohio. Sótano (tablero,
// tanque del pozo, termotanque, alacena), planta baja (garaje con el auto, cocina, living con la lámpara testigo, comedor =
// el cuarto caliente) y planta alta (baño, dormitorio). En el frente del techo, un reloj grande que arranca en 0:00 cuando se
// corta la luz y cuenta el tiempo del corte; cada paso es una parada de la cámara por la casa. Afuera: la calle con las casas
// de los vecinos (se apagan), postes con hielo y el cable caído que chispea en la nieve (= la miniatura, cuadro 0).
// Cámara y efectos salen de world.json (paradas ancladas a frases). Render SÓLO en el farm.
import React, { useMemo } from "react";
import * as THREE from "three";
import { C, WorldCanvas, cl, ease, fxAt, mkCamAt, mkCamSpeed, paint, rnd } from "./wengine";
import { M, RBox, tex, tubeG } from "./h3d";
import CLK from "./clock.json";

const PI = Math.PI;
type V = [number, number, number];
const F0 = 0, F1 = 1.12, F2 = 2.24, BS = -1.05;  // pisos: planta baja, planta alta, techo, fondo del sótano
const XL = -1.6, XR = 1.6, ZB = -0.62, ZF = 0.62;  // la casa (sin el garaje)

const C3: Record<string, C> = {
  wide: { p: [0.2, 1.1, 6.6], l: [0.1, 0.75, 0], fov: 40 },
  front: { p: [0.4, 1.9, 4.0], l: [0.0, 1.7, 0], fov: 38 },
  clock: { p: [0.15, 2.65, 2.3], l: [0, 2.62, 0.6], fov: 34 },
  street: { p: [2.2, 0.9, 3.6], l: [4.6, 0.7, -0.6], fov: 40 },
  yard: { p: [2.3, 0.55, 2.9], l: [3.4, 0.08, 1.5], fov: 36 },
  base: { p: [0.0, -0.35, 3.1], l: [0.0, -0.55, -0.2], fov: 40 },
  panel: { p: [-1.0, -0.3, 1.45], l: [-1.32, -0.4, ZB], fov: 34 },
  well: { p: [-0.45, -0.35, 1.5], l: [-0.55, -0.6, -0.35], fov: 36 },
  pantry: { p: [0.95, -0.35, 1.5], l: [1.05, -0.55, -0.4], fov: 36 },
  kit: { p: [-0.9, 0.62, 2.3], l: [-0.9, 0.42, -0.3], fov: 38 },
  fridge: { p: [-1.05, 0.6, 1.35], l: [-1.32, 0.4, -0.35], fov: 34 },
  stove: { p: [-0.45, 0.55, 1.3], l: [-0.55, 0.32, -0.4], fov: 34 },
  liv: { p: [0.3, 0.62, 2.3], l: [0.3, 0.42, -0.3], fov: 38 },
  lamp: { p: [0.5, 0.62, 1.3], l: [0.62, 0.5, -0.35], fov: 34 },
  warm: { p: [1.2, 0.7, 2.1], l: [1.2, 0.38, -0.3], fov: 38 },
  bath: { p: [-0.95, 1.75, 2.2], l: [-1.0, 1.52, -0.3], fov: 38 },
  bed: { p: [0.6, 1.75, 2.2], l: [0.6, 1.48, -0.3], fov: 38 },
  up: { p: [0.0, 1.85, 3.9], l: [0.0, 1.62, 0], fov: 40 },
  gar: { p: [-2.2, 0.7, 2.6], l: [-2.3, 0.38, -0.2], fov: 38 },
  // cuadro 0 = la miniatura: al ras de la nieve, el cable caído chispeando adelante, la calle oscura con los porches y la luna
  thumb: { p: [2.55, 0.32, 3.3], l: [4.3, 0.55, 0.4], fov: 42 },
};
export const camAt = mkCamAt(C3);
export const camSpeed = mkCamSpeed(camAt);

// ===== el reloj del corte: minutos transcurridos según el tiempo del video (clock.json = [[t, minutos], …], interpolado) =====
const CK = CLK as unknown as { on: number; k: [number, number][] };
const elapsed = (t: number) => {
  const k = CK.k; if (t <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++) if (t < k[i + 1][0]) { const [a, va] = k[i], [b, vb] = k[i + 1]; return va + (vb - va) * ease((t - a) / Math.max(0.1, Math.min(b - a, 3))); }
  return k[k.length - 1][1];
};
const hm = (m: number) => { const mm = Math.floor(m); return `${Math.floor(mm / 60)}:${String(mm % 60).padStart(2, "0")}`; };
const lcd = (s: string, on: number) => paint("clk" + s + (on > 0.5 ? 1 : 0), 256, 96, (g) => {
  g.fillStyle = "#0b0f0c"; g.fillRect(0, 0, 256, 96);
  g.fillStyle = on > 0.5 ? "#ff5a3a" : "#2a1a16"; g.font = "700 74px Courier New"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, 128, 52);
});
const BigClock: React.FC<{ t: number; on: number }> = ({ t, on }) => {
  const m = elapsed(t), a = -(m / 60) * 2 * PI, hA = -(m / 720) * 2 * PI;
  return <group position={[0, 2.62, ZF + 0.04]}>
    <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.36, 0.36, 0.06, 64]} />{M.wood({ base: [96, 62, 36] })}</mesh>
    <mesh position={[0, 0, 0.032]}><circleGeometry args={[0.32, 64]} /><meshStandardMaterial color="#f3ecdc" roughness={0.6} emissive="#ffe2b0" emissiveIntensity={0.12 + 0.25 * on} /></mesh>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i / 12 * 2 * PI) * 0.27, Math.cos(i / 12 * 2 * PI) * 0.27, 0.035]} rotation={[0, 0, -i / 12 * 2 * PI]}><boxGeometry args={[0.012, i % 3 ? 0.03 : 0.05, 0.004]} /><meshBasicMaterial color="#2a2018" /></mesh>)}
    <group position={[0, 0, 0.04]} rotation={[0, 0, hA]}><mesh position={[0, 0.08, 0]}><boxGeometry args={[0.022, 0.17, 0.006]} /><meshStandardMaterial color="#1c1a18" /></mesh></group>
    <group position={[0, 0, 0.046]} rotation={[0, 0, a]}><mesh position={[0, 0.12, 0]}><boxGeometry args={[0.012, 0.25, 0.006]} /><meshStandardMaterial color="#c62a22" /></mesh></group>
    <mesh position={[0, 0, 0.05]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.012, 20]} />{M.brass()}</mesh>
    {/* la pantalla del tiempo de corte, debajo de la esfera */}
    <RBox s={[0.36, 0.13, 0.05]} p={[0, -0.46, 0]} r={0.015}>{M.matte({ col: "#2b2622" })}</RBox>
    <mesh position={[0, -0.46, 0.027]}><planeGeometry args={[0.32, 0.11]} /><meshBasicMaterial map={lcd(hm(m), on)} toneMapped={false} /></mesh>
  </group>;
};

// ===== piezas de la casa =====
const wallM = (col: string) => <meshStandardMaterial color={col} roughness={0.92} />;
const Wall: React.FC<{ p: V; s: V; col?: string; ns?: boolean }> = ({ p, s, col = "#e9e1d0", ns }) => <mesh position={p} receiveShadow={!ns} castShadow={!ns}><boxGeometry args={s} />{wallM(col)}</mesh>;
// losa con el canto del corte a la vista (crema, como casa de muñecas)
const Slab: React.FC<{ y: number; x0: number; x1: number }> = ({ y, x0, x1 }) => <>
  <mesh position={[(x0 + x1) / 2, y - 0.03, 0]} receiveShadow castShadow><boxGeometry args={[x1 - x0, 0.06, ZF - ZB]} /><meshStandardMaterial color="#d8cdb6" roughness={0.9} /></mesh>
  <mesh position={[(x0 + x1) / 2, y + 0.0015, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[x1 - x0 - 0.02, ZF - ZB - 0.02]} /><meshStandardMaterial map={tex.wood(4, 2, [150, 108, 70])} roughness={0.7} /></mesh>
</>;
const Win: React.FC<{ p: V; w?: number; h?: number; dark: number; blanket?: number }> = ({ p, w = 0.34, h = 0.32, dark, blanket = 0 }) => <group position={p}>
  <mesh><planeGeometry args={[w, h]} /><meshBasicMaterial color={dark > 0.5 ? "#16233a" : "#2c4266"} toneMapped={false} /></mesh>
  {[[-w / 2, 0, 0.03, h + 0.04], [w / 2, 0, 0.03, h + 0.04], [0, -h / 2, w + 0.04, 0.03], [0, h / 2, w + 0.04, 0.03], [0, 0, 0.02, h]].map(([x, y, a, b], i) => <mesh key={i} position={[x, y, 0.012]}><boxGeometry args={[a, b, 0.025]} />{M.matte({ col: "#f2efe8" })}</mesh>)}
  {/* frazada colgada sobre la ventana (de noche) */}
  <mesh position={[0, h / 2 + 0.02 - (h + 0.06) * Math.max(0.001, blanket) / 2, 0.03]} scale={[1, Math.max(0.001, blanket), 1]}><boxGeometry args={[w + 0.08, h + 0.06, 0.02]} />{M.matte({ col: "#7a3b2e" })}</mesh>
</group>;
const Door: React.FC<{ p: V; open: number; h?: number }> = ({ p, open, h = 0.78 }) => <group position={p}>
  <mesh position={[0, h / 2, 0]}><boxGeometry args={[0.03, h + 0.02, 0.38]} />{M.matte({ col: "#cfc3a8" })}</mesh>
  <group position={[0, 0, -0.17]} rotation={[0, -1.3 * open, 0]}><mesh position={[0.0, h / 2 - 0.01, 0.17]} castShadow><boxGeometry args={[0.025, h - 0.02, 0.33]} />{M.wood({ base: [176, 132, 86] })}</mesh></group>
</group>;

// la heladera chica del corte (puerta, cinta con la nota, termómetro adentro)
const Fridge: React.FC<{ f: (k: string) => number }> = ({ f }) => <group position={[-1.38, F0, -0.32]}>
  <RBox s={[0.3, 0.66, 0.28]} p={[0, 0.33, 0]} r={0.02}>{M.porcelain({ col: "#eef0f0" })}</RBox>
  <mesh position={[0, 0.46, 0.141]}><planeGeometry args={[0.28, 0.004]} /><meshBasicMaterial color="#9aa0a4" /></mesh>
  <mesh position={[0.12, 0.3, 0.152]}><boxGeometry args={[0.012, 0.16, 0.02]} />{M.steel()}</mesh>
  {/* la cinta cruzada con la nota «DON'T OPEN» */}
  <mesh position={[0, 0.34, 0.146]} rotation={[0, 0, -0.35]} scale={[Math.max(0.001, f("tape")), 1, 1]}><planeGeometry args={[0.36, 0.035]} /><meshStandardMaterial color="#d9c48a" roughness={0.6} /></mesh>
  <mesh position={[0.02, 0.36, 0.148]} scale={Math.max(0.001, f("tape"))}><planeGeometry args={[0.12, 0.07]} /><meshStandardMaterial map={paint("dontopen", 256, 150, (g) => { g.fillStyle = "#fbf6e6"; g.fillRect(0, 0, 256, 150); g.fillStyle = "#c62a22"; g.font = "900 54px Arial"; g.textAlign = "center"; g.fillText("DON'T", 128, 62); g.fillText("OPEN", 128, 122); })} roughness={0.8} /></mesh>
</group>;
const Stove: React.FC<{ f: (k: string) => number; t: number }> = ({ f, t }) => <group position={[-0.62, F0, -0.36]}>
  <RBox s={[0.3, 0.4, 0.26]} p={[0, 0.2, 0]} r={0.012}>{M.porcelain({ col: "#e8e4dc" })}</RBox>
  <mesh position={[0, 0.17, 0.131]}><planeGeometry args={[0.24, 0.18]} /><meshStandardMaterial color="#141414" emissive="#ff6a2a" emissiveIntensity={0.6 * f("oven")} /></mesh>
  {[-0.07, 0.07].map((x) => [-0.06, 0.06].map((z) => <mesh key={x + "" + z} position={[x, 0.402, z]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.025, 0.04, 24]} /><meshStandardMaterial color="#222" /></mesh>))}
  {[0, 1, 2, 3].map((i) => <mesh key={"k" + i} position={[-0.1 + i * 0.066, 0.36, 0.132]}><cylinderGeometry args={[0.012, 0.012, 0.01, 12]} />{M.matte({ col: "#333" })}</mesh>)}
  {/* el CO: una nube gris que sale del horno abierto (paso 6) */}
  {Array.from({ length: 12 }, (_, i) => { const ph = (t * 0.25 + i / 12) % 1; return <mesh key={"co" + i} position={[-0.05 + 0.25 * ph * Math.sin(i), 0.2 + ph * 0.5, 0.18 + 0.1 * Math.cos(i)]}><sphereGeometry args={[0.04 + 0.05 * ph, 10, 8]} /><meshBasicMaterial color="#9aa0a8" transparent opacity={0.22 * f("co") * (1 - ph)} depthWrite={false} /></mesh>; })}
</group>;
const Lamp: React.FC<{ on: number; p: V }> = ({ on, p }) => <group position={p}>
  <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.07, 0.08, 0.02, 24]} />{M.brass({ col: "#6a5030" })}</mesh>
  <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.008, 0.008, 0.58, 10]} />{M.brass({ col: "#6a5030" })}</mesh>
  <mesh position={[0, 0.63, 0]}><cylinderGeometry args={[0.07, 0.11, 0.13, 32, 1, true]} /><meshStandardMaterial color="#efe2c4" side={THREE.DoubleSide} emissive="#ffcf7a" emissiveIntensity={1.4 * on} /></mesh>
  <pointLight position={[0, 0.6, 0.05]} intensity={2.2 * on} distance={1.6} color="#ffd59a" />
</group>;
const Couch: React.FC<{ p: V }> = ({ p }) => <group position={p}>
  <RBox s={[0.62, 0.16, 0.26]} p={[0, 0.1, 0]} r={0.04}>{M.matte({ col: "#4f6b5a" })}</RBox>
  <RBox s={[0.62, 0.24, 0.07]} p={[0, 0.22, -0.11]} r={0.03}>{M.matte({ col: "#4f6b5a" })}</RBox>
  {[-1, 1].map((s) => <RBox key={s} s={[0.07, 0.2, 0.26]} p={[s * 0.31, 0.15, 0]} r={0.03}>{M.matte({ col: "#476251" })}</RBox>)}
</group>;
const TV: React.FC<{ p: V; unplug: number }> = ({ p, unplug }) => <group position={p}>
  <RBox s={[0.34, 0.16, 0.16]} p={[0, 0.08, 0]} r={0.01}>{M.wood({ base: [110, 74, 44] })}</RBox>
  <RBox s={[0.4, 0.24, 0.025]} p={[0, 0.3, 0]} r={0.008}>{M.matte({ col: "#151515" })}</RBox>
  {/* el enchufe que sale de la pared */}
  <mesh position={[0.24 + 0.06 * unplug, 0.05, -0.04]}><boxGeometry args={[0.03, 0.035, 0.02]} />{M.rubber({ col: "#222" })}</mesh>
</group>;
const Mattress: React.FC<{ p: V; k: number; col: string }> = ({ p, k, col }) => <group position={p} scale={[1, Math.max(0.001, k), 1]}>
  <RBox s={[0.42, 0.06, 0.22]} p={[0, 0.03, 0]} r={0.02}>{M.matte({ col: "#efe9dc" })}</RBox>
  <RBox s={[0.3, 0.025, 0.22]} p={[0.06, 0.07, 0]} r={0.012}>{M.matte({ col })}</RBox>
</group>;
const Bed: React.FC<{ f: (k: string) => number }> = ({ f }) => <group position={[0.75, F1, -0.28]}>
  <RBox s={[0.62, 0.14, 0.4]} p={[0, 0.09, 0]} r={0.02}>{M.wood({ base: [130, 88, 52] })}</RBox>
  <RBox s={[0.58, 0.06, 0.38]} p={[0, 0.19, 0]} r={0.025}>{M.matte({ col: "#f1ece2" })}</RBox>
  <RBox s={[0.42, 0.04, 0.39]} p={[0.07, 0.235, 0]} r={0.02}>{M.matte({ col: "#3f5f88" })}</RBox>
  <RBox s={[0.04, 0.32, 0.4]} p={[-0.3, 0.2, 0]} r={0.015}>{M.wood({ base: [120, 80, 46] })}</RBox>
  {/* la bolsa de agua caliente al pie de la cama: brilla tibia */}
  <mesh position={[0.22, 0.27, 0.05]} scale={[1, 0.5, 0.75]}><sphereGeometry args={[0.06, 20, 14]} /><meshStandardMaterial color="#c4472e" emissive="#ff7a3a" emissiveIntensity={0.9 * f("hwb")} /></mesh>
  <pointLight position={[0.22, 0.34, 0.1]} intensity={0.9 * f("hwb")} distance={0.6} color="#ff9a5a" />
</group>;
const Tub: React.FC<{ fill: number; drip: number; t: number }> = ({ fill, drip, t }) => <group position={[-1.2, F1, -0.3]}>
  <RBox s={[0.5, 0.2, 0.26]} p={[0, 0.1, 0]} r={0.04}>{M.porcelain()}</RBox>
  <mesh position={[0, 0.03 + 0.15 * fill, 0]} scale={[1, Math.max(0.001, fill), 1]}><boxGeometry args={[0.44, 0.02, 0.2]} />{M.water()}</mesh>
  <mesh position={[-0.22, 0.27, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.01, 0.01, 0.08, 10]} />{M.chrome()}</mesh>
  {/* lavatorio con la canilla que gotea */}
  <group position={[0.5, 0, 0.02]}>
    <RBox s={[0.2, 0.36, 0.16]} p={[0, 0.18, 0]} r={0.015}>{M.wood({ base: [190, 170, 140] })}</RBox>
    <RBox s={[0.18, 0.03, 0.15]} p={[0, 0.37, 0]} r={0.01}>{M.porcelain()}</RBox>
    <mesh position={[0, 0.43, -0.05]}><cylinderGeometry args={[0.008, 0.008, 0.08, 10]} />{M.chrome()}</mesh>
    <mesh position={[0, 0.46 - ((t * 1.4) % 1) * 0.08, -0.02]}><sphereGeometry args={[0.007, 10, 8]} />{M.water({ op: 0.9 * drip })}</mesh>
  </group>
</group>;
// el sótano: tablero (la térmica principal), tanque del pozo, termotanque, alacena con latas y los 6 bidones de papá
const Panel: React.FC<{ f: (k: string) => number }> = ({ f }) => <group position={[-1.32, -0.45, ZB + 0.03]}>
  <RBox s={[0.26, 0.38, 0.06]} r={0.01}>{M.steel({ col: "#9aa2aa" })}</RBox>
  {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[(i % 2 ? 0.05 : -0.05), 0.06 - Math.floor(i / 2) * 0.05, 0.032]}><boxGeometry args={[0.07, 0.03, 0.01]} />{M.matte({ col: "#222" })}</mesh>)}
  {/* la térmica principal arriba: palanca que pasa de ON a OFF y vuelve */}
  <group position={[0, 0.14, 0.035]} rotation={[0.9 - 1.8 * f("main"), 0, 0]}><mesh position={[0, 0.02, 0]}><boxGeometry args={[0.1, 0.045, 0.02]} />{M.matte({ col: "#b22a20" })}</mesh></group>
  <pointLight position={[0.0, 0.1, 0.3]} intensity={1.2 * f("flash")} distance={0.9} color="#fff2d0" />
</group>;
const WellTank: React.FC<{ lvl: number }> = ({ lvl }) => <group position={[-0.62, BS, -0.3]}>
  <mesh position={[0, 0.3, 0]} castShadow><capsuleGeometry args={[0.13, 0.32, 12, 32]} />{M.plastic({ col: "#2f6fb4" })}</mesh>
  <mesh position={[0.16, 0.42, 0.06]}><cylinderGeometry args={[0.03, 0.03, 0.02, 20]} />{M.steel()}</mesh>
  <mesh position={[0, 0.02 + 0.28 * lvl, 0.14]} scale={[1, Math.max(0.001, lvl), 1]}><boxGeometry args={[0.05, 0.56, 0.005]} />{M.water({ op: 0.9 })}</mesh>
</group>;
const Heater: React.FC = () => <group position={[0.05, BS, -0.36]}>
  <mesh position={[0, 0.34, 0]} castShadow><cylinderGeometry args={[0.14, 0.14, 0.68, 32]} />{M.porcelain({ col: "#e9e6de" })}</mesh>
  <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.02, 0.02, 0.1, 10]} />{M.brass({ col: "#b07a3a" })}</mesh>
</group>;
const Pantry: React.FC<{ jug: number }> = ({ jug }) => <group position={[1.05, BS, -0.45]}>
  {[0.2, 0.45, 0.7].map((y, j) => <group key={j}>
    <mesh position={[0, y, 0]} castShadow receiveShadow><boxGeometry args={[0.8, 0.02, 0.24]} />{M.wood({ base: [160, 118, 72] })}</mesh>
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.33 + i * 0.11, y + 0.05, 0]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.08, 20]} />{M.steel({ col: ["#c94a2e", "#e8c04a", "#3f7b4f", "#d9d2c0"][(i + j) % 4] })}</mesh>)}
  </group>)}
  {[-1, 1].map((s) => <mesh key={s} position={[s * 0.4, 0.4, 0]}><boxGeometry args={[0.02, 0.8, 0.24]} />{M.wood({ base: [140, 100, 60] })}</mesh>)}
  {/* los seis bidones de leche llenos de agua de papá, en el piso */}
  {Array.from({ length: 6 }, (_, i) => <group key={"j" + i} position={[-0.3 + i * 0.12, 0, 0.3]} scale={Math.max(0.001, jug)}>
    <RBox s={[0.09, 0.15, 0.09]} p={[0, 0.075, 0]} r={0.015}>{M.glass({ op: 0.45, col: "#f2f6f8" })}</RBox>
    <mesh position={[0, 0.06, 0]}><boxGeometry args={[0.08, 0.11, 0.08]} />{M.water({ op: 0.5 })}</mesh>
    <mesh position={[0, 0.165, 0]}><cylinderGeometry args={[0.018, 0.018, 0.02, 12]} />{M.plastic({ col: "#e8c04a" })}</mesh>
  </group>)}
</group>;
const Car: React.FC<{ out: number }> = ({ out }) => <group position={[-2.3, F0, -0.05 + 1.5 * out]}>
  <RBox s={[0.42, 0.16, 0.86]} p={[0, 0.13, 0]} r={0.05}>{M.plastic({ col: "#7a1f1c" })}</RBox>
  <RBox s={[0.36, 0.13, 0.46]} p={[0, 0.27, -0.04]} r={0.04}>{M.glass({ op: 0.5, col: "#a9c3d6" })}</RBox>
  {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z], i) => <mesh key={i} position={[x * 0.2, 0.06, z * 0.28]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.06, 0.06, 0.05, 20]} />{M.rubber({ col: "#151515" })}</mesh>)}
  {/* caño de escape */}
  <mesh position={[0.12, 0.05, -0.44]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.05, 10]} />{M.steel()}</mesh>
</group>;

// afuera: casa vecina con porche (luces que se apagan), poste con hielo, el cable caído que chispea
const Neighbor: React.FC<{ p: V; r: number; lit: number; s?: number }> = ({ p, r, lit, s = 1 }) => <group position={p} rotation={[0, r, 0]} scale={s}>
  <mesh position={[0, 0.45, 0]} castShadow receiveShadow><boxGeometry args={[1.4, 0.9, 1.0]} /><meshStandardMaterial color="#5b6573" roughness={0.9} /></mesh>
  <mesh position={[0, 1.12, 0]} rotation={[0, PI / 4, 0]} scale={[1.05, 0.45, 0.75]} castShadow><coneGeometry args={[1.08, 1, 4]} /><meshStandardMaterial color="#e9eef5" roughness={0.8} /></mesh>
  {/* porche con columnas y techito nevado */}
  <mesh position={[0, 0.62, 0.68]}><boxGeometry args={[1.2, 0.04, 0.36]} /><meshStandardMaterial color="#e9eef5" /></mesh>
  {[-0.55, -0.18, 0.18, 0.55].map((x) => <mesh key={x} position={[x, 0.3, 0.84]}><boxGeometry args={[0.04, 0.6, 0.04]} /><meshStandardMaterial color="#d8dde3" /></mesh>)}
  <mesh position={[0, 0.08, 0.84]}><boxGeometry args={[1.2, 0.03, 0.03]} /><meshStandardMaterial color="#d8dde3" /></mesh>
  {[-0.4, 0.4].map((x) => <mesh key={"w" + x} position={[x, 0.45, 0.502]}><planeGeometry args={[0.26, 0.24]} /><meshStandardMaterial color="#141a24" emissive="#ffc77a" emissiveIntensity={1.4 * lit} /></mesh>)}
  <mesh position={[0, 0.33, 0.502]}><planeGeometry args={[0.2, 0.42]} /><meshStandardMaterial color="#3a2a20" /></mesh>
</group>;
const Pole: React.FC<{ p: V }> = ({ p }) => <group position={p}>
  <mesh position={[0, 1.3, 0]} castShadow><cylinderGeometry args={[0.035, 0.045, 2.6, 12]} />{M.wood({ base: [80, 60, 44] })}</mesh>
  <mesh position={[0, 2.45, 0]}><boxGeometry args={[0.7, 0.05, 0.05]} />{M.wood({ base: [80, 60, 44] })}</mesh>
  {[-0.3, 0.3].map((x) => <mesh key={x} position={[x, 2.5, 0]}><cylinderGeometry args={[0.02, 0.02, 0.05, 10]} />{M.glass({ op: 0.6, col: "#9ad0c0" })}</mesh>)}
</group>;
const sag = (a: V, b: V, d: number, n = 24): number[][] => Array.from({ length: n + 1 }, (_, i) => { const u = i / n; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - d * 4 * u * (1 - u), a[2] + (b[2] - a[2]) * u]; });
// carámbanos colgando de un cable
const Icicles: React.FC<{ pts: number[][]; seed: number }> = ({ pts, seed }) => <>{pts.slice(2, -2).map((q, i) => i % 2 ? null : <mesh key={i} position={[q[0], q[1] - 0.04 - 0.03 * rnd(i, seed), q[2]]} rotation={[PI, 0, 0]}><coneGeometry args={[0.008, 0.08 + 0.06 * rnd(i, seed + 1), 6]} />{M.glass({ op: 0.6, col: "#dff2ff" })}</mesh>)}</>;
const Sparks: React.FC<{ t: number; p: V; k: number }> = ({ t, p, k }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const N = 70, pos = new Float32Array(N * 3), burst = Math.floor(t * 2.2);
  for (let i = 0; i < N; i++) { const ph = (t * 2.2 + rnd(i, 3)) % 1, a = rnd(i + burst * 7, 1) * 2 * PI, sp = 0.15 + 0.25 * rnd(i, 2);
    pos.set([p[0] + Math.cos(a) * sp * ph, p[1] + 0.02 + (0.3 * rnd(i, 4)) * ph - 0.35 * ph * ph, p[2] + Math.sin(a) * sp * ph], i * 3); }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return <points geometry={geo}><pointsMaterial color="#ffd27a" size={0.018} transparent opacity={0.95 * k} depthWrite={false} toneMapped={false} /></points>;
};
const Snow: React.FC<{ t: number }> = ({ t }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const N = 900, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const ph = (t * (0.05 + 0.04 * rnd(i, 3)) + rnd(i, 1)) % 1; pos.set([-4.5 + rnd(i, 2) * 12 + 0.06 * Math.sin(t * 0.6 + i), 4.0 - ph * 4.3, -3.5 + rnd(i, 4) * 8.5], i * 3); }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return <points geometry={geo}><pointsMaterial color="#f2f6ff" size={0.02} transparent opacity={0.85} depthWrite={false} /></points>;
};
const snowTex = () => paint("snowg", 256, 256, (g) => { g.fillStyle = "#dfe6ef"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1400; i++) { g.fillStyle = rnd(i, 9) > 0.5 ? "#f6f9fd" : "#c9d3df"; g.globalAlpha = 0.5; g.fillRect(rnd(i, 1) * 256, rnd(i, 2) * 256, 2, 2); } });

// luz de cuarto (siempre montada: sólo cambia la intensidad)
const RoomLight: React.FC<{ p: V; k: number; col?: string; d?: number }> = ({ p, k, col = "#ffd9a0", d = 1.8 }) => <pointLight position={p} intensity={k} distance={d} color={col} />;

export const HouseWorld: React.FC<{ t: number }> = ({ t }) => {
  const fx = fxAt(t), f = (k: string) => fx[k] ?? 0, cam = camAt(t);
  const dark = f("dark"), pw = f("power"), lights = cl(1 - dark + pw);   // casa encendida = antes del corte o cuando vuelve
  const wire = f("wire"), clockOn = t >= CK.on ? 1 : 0;
  const A: V = [2.7, 2.48, 1.25], B: V = [4.9, 2.48, 1.25], Bd: V = [3.55, 0.03, 1.95];
  const wire1 = sag(A, B, 0.18), down = sag(A, Bd, 0.25, 30), wire2 = sag(B, [7.1, 2.48, 1.25], 0.18);
  return <WorldCanvas cam={cam} bg="#070b14" fog={[7, 22]}>
    <hemisphereLight args={["#8fa6c8", "#1a1e26", 0.32 + 0.25 * (1 - dark)]} />
    {/* la luna (fría, de atrás) */}
    <directionalLight position={[6, 7, -4]} intensity={1.1} color="#b9cdf0" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-6} shadow-camera-right={8} shadow-camera-top={5} shadow-camera-bottom={-3} shadow-bias={-0.0004} shadow-normalBias={0.03} />
    <mesh position={[9, 6.2, -12]}><sphereGeometry args={[0.7, 32, 24]} />{M.glow({ col: "#f4f7ff" })}</mesh>
    {/* luz de relleno del frente del corte (como en una vitrina) */}
    <spotLight position={[0, 2.6, 4.2]} angle={0.7} penumbra={1} intensity={10 + 6 * (1 - dark)} distance={9} color="#d9e2f2" />

    {/* ===== el terreno con el sótano excavado y la nieve ===== */}
    <mesh position={[0, -0.6, -2.0]} receiveShadow><boxGeometry args={[14, 1.2, 2.76]} /><meshStandardMaterial color="#4a3a2c" roughness={1} /></mesh>
    <mesh position={[-3.1, -0.6, 0.0]} receiveShadow><boxGeometry args={[3.0, 1.2, 1.24]} /><meshStandardMaterial color="#4a3a2c" roughness={1} /></mesh>
    <mesh position={[4.3, -0.6, 0.0]} receiveShadow><boxGeometry args={[5.4, 1.2, 1.24]} /><meshStandardMaterial color="#4a3a2c" roughness={1} /></mesh>
    <mesh position={[0, -1.15, 0]} receiveShadow><boxGeometry args={[3.2, 0.2, 1.24]} /><meshStandardMaterial color="#4a3a2c" roughness={1} /></mesh>
    {/* nieve: atrás, a los costados y adelante del corte (la calle) */}
    <mesh position={[0, 0.02, -2.0]} receiveShadow><boxGeometry args={[14, 0.04, 2.76]} /><meshStandardMaterial map={snowTex()} roughness={0.85} /></mesh>
    <mesh position={[4.3, 0.02, 0.0]} receiveShadow><boxGeometry args={[5.4, 0.04, 1.24]} /><meshStandardMaterial map={snowTex()} roughness={0.85} /></mesh>
    <mesh position={[4.4, 0.0, 3.2]} receiveShadow rotation={[-PI / 2, 0, 0]}><planeGeometry args={[5.2, 5.2]} /><meshStandardMaterial map={snowTex()} roughness={0.85} /></mesh>
    <mesh position={[-3.7, 0.02, 0.0]} receiveShadow><boxGeometry args={[1.4, 0.04, 1.24]} /><meshStandardMaterial map={snowTex()} roughness={0.85} /></mesh>
    <mesh visible={false} position={[0, -0.6, 0.63]}><boxGeometry args={[14, 1.2, 0.02]} /><meshStandardMaterial color="#3a2c22" roughness={1} /></mesh>

    {/* ===== sótano ===== */}
    <Wall p={[0, BS + 0.5, ZB + 0.005]} s={[3.2, 1.0, 0.04]} col="#9d978c" ns />
    <Wall p={[XL + 0.005, BS + 0.5, 0]} s={[0.04, 1.0, 1.24]} col="#8f897e" ns />
    <Wall p={[XR - 0.005, BS + 0.5, 0]} s={[0.04, 1.0, 1.24]} col="#8f897e" ns />
    <mesh position={[0, BS - 0.01, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3.2, 1.24]} /><meshStandardMaterial color="#7d786f" roughness={0.95} /></mesh>
    <Panel f={f} />
    <WellTank lvl={1 - 0.85 * f("well")} />
    <Heater />
    <Pantry jug={f("jugs")} />
    <RoomLight p={[0, -0.25, 0.3]} k={1.4 * lights + 1.6 * f("base")} />

    {/* ===== planta baja ===== */}
    <Slab y={F0} x0={XL} x1={XR} />
    <Wall p={[0, F0 + 0.56, ZB]} s={[3.24, 1.12, 0.05]} />
    <Wall p={[XL - 0.02, F0 + 0.56, 0]} s={[0.05, 1.12, 1.24]} col="#e2d8c4" />
    <Wall p={[XR + 0.02, F0 + 0.56, 0]} s={[0.05, 1.12, 1.24]} col="#e2d8c4" />
    <Door p={[-0.2, F0, 0.05]} open={1 - f("shut")} />
    <Door p={[0.8, F0, 0.05]} open={1 - f("shut")} />
    {/* toallas enrolladas contra la puerta del cuarto caliente */}
    <mesh position={[0.83, F0 + 0.03, 0.05]} rotation={[PI / 2, 0, 0]} scale={[1, 1, Math.max(0.001, f("towel"))]}><cylinderGeometry args={[0.03, 0.03, 0.36, 12]} />{M.matte({ col: "#d9e2ea" })}</mesh>
    {/* cocina */}
    <Fridge f={f} />
    <Stove f={f} t={t} />
    <RBox s={[0.36, 0.4, 0.26]} p={[-1.03, F0 + 0.2, -0.36]} r={0.01}>{M.wood({ base: [120, 86, 54] })}</RBox>
    <mesh position={[-1.03, F0 + 0.41, -0.36]}><boxGeometry args={[0.38, 0.03, 0.28]} />{M.matte({ col: "#cfc8b8" })}</mesh>
    <Win p={[-0.95, F0 + 0.72, ZB + 0.03]} dark={dark} />
    <RoomLight p={[-0.9, F0 + 0.95, 0.15]} k={1.6 * lights + 2.2 * f("kit")} />
    {/* living: sillón, tele, la lámpara testigo */}
    <Couch p={[0.25, F0, 0.05]} />
    <TV p={[0.25, F0, -0.45]} unplug={f("unplug")} />
    <Lamp on={Math.max(lights, f("lampon"))} p={[0.62, F0, -0.4]} />
    <Win p={[0.0, F0 + 0.72, ZB + 0.03]} dark={dark} w={0.3} />
    <RoomLight p={[0.3, F0 + 0.95, 0.15]} k={1.4 * lights + 2.2 * f("liv")} />
    {/* comedor = cuarto caliente: mesa, colchones en el piso, frazadas en la ventana, farol */}
    <RBox s={[0.42, 0.03, 0.3]} p={[1.2, F0 + 0.33, -0.3]} r={0.01}>{M.wood({ base: [140, 96, 56] })}</RBox>
    {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z], i) => <mesh key={i} position={[1.2 + x * 0.18, F0 + 0.16, -0.3 + z * 0.12]}><boxGeometry args={[0.025, 0.32, 0.025]} />{M.wood({ base: [120, 80, 46] })}</mesh>)}
    <Mattress p={[1.1, F0, 0.15]} k={f("mat")} col="#a7563f" />
    <Mattress p={[1.25, F0, 0.4]} k={f("mat")} col="#4f6f9a" />
    <Win p={[1.2, F0 + 0.72, ZB + 0.03]} dark={dark} blanket={f("blk")} />
    <RoomLight p={[1.2, F0 + 0.6, 0.1]} k={1.4 * lights + 2.6 * f("warm")} col="#ffb46a" />

    {/* ===== planta alta ===== */}
    <Slab y={F1} x0={XL} x1={XR} />
    <Wall p={[0, F1 + 0.56, ZB]} s={[3.24, 1.12, 0.05]} col="#dfe4e6" />
    <Wall p={[XL - 0.02, F1 + 0.56, 0]} s={[0.05, 1.12, 1.24]} col="#d5dadc" />
    <Wall p={[XR + 0.02, F1 + 0.56, 0]} s={[0.05, 1.12, 1.24]} col="#d5dadc" />
    <Wall p={[-0.4, F1 + 0.56, -0.25]} s={[0.04, 1.12, 0.74]} col="#cfd5d8" />
    <Tub fill={f("tub")} drip={f("drip")} t={t} />
    <Bed f={f} />
    <Win p={[0.75, F1 + 0.7, ZB + 0.03]} dark={dark} />
    {/* detector de CO a pilas en la pared del pasillo de los dormitorios */}
    <group position={[-0.2, F1 + 0.8, ZB + 0.04]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.02, 32]} />{M.plastic({ col: "#f3f1ea" })}</mesh>
      <mesh position={[0.018, 0.018, 0.012]}><circleGeometry args={[0.007, 16]} /><meshStandardMaterial color="#300" emissive="#3aff6a" emissiveIntensity={1.5 * f("codet")} toneMapped={false} /></mesh>
    </group>
    <RoomLight p={[-1.0, F1 + 0.9, 0.15]} k={1.3 * lights + 2.0 * f("bath")} col="#e6f0ff" />
    <RoomLight p={[0.6, F1 + 0.9, 0.15]} k={1.3 * lights + 2.0 * f("bed")} />
    {/* techo a dos aguas, con nieve encima, y el reloj en el frente */}
    <Slab y={F2} x0={XL} x1={XR} />
    {[-1, 1].map((s) => <group key={s}>
      <mesh position={[s * 0.85, F2 + 0.42, 0]} rotation={[0, 0, -s * 0.52]} castShadow><boxGeometry args={[1.95, 0.06, 1.4]} /><meshStandardMaterial color="#5a3a2c" roughness={0.9} /></mesh>
      <mesh position={[s * 0.84, F2 + 0.47, 0]} rotation={[0, 0, -s * 0.52]}><boxGeometry args={[1.95, 0.05, 1.42]} /><meshStandardMaterial map={snowTex()} roughness={0.8} /></mesh>
    </group>)}
    <mesh position={[0, F2 + 0.42, ZF + 0.005]}><shapeGeometry args={[useMemo(() => { const s = new THREE.Shape(); s.moveTo(-1.62, -0.42); s.lineTo(1.62, -0.42); s.lineTo(0, 0.5); s.lineTo(-1.62, -0.42); return s; }, [])]} /><meshStandardMaterial color="#c9bfa8" roughness={0.9} side={THREE.DoubleSide} /></mesh>
    <BigClock t={t} on={clockOn} />

    {/* ===== garaje (una planta) ===== */}
    <mesh position={[-2.3, F0 - 0.03, 0]} receiveShadow><boxGeometry args={[1.36, 0.06, 1.24]} /><meshStandardMaterial color="#8a8680" roughness={0.95} /></mesh>
    <Wall p={[-2.3, F0 + 0.5, ZB]} s={[1.36, 1.0, 0.05]} col="#c8c2b4" />
    <Wall p={[-2.98, F0 + 0.5, 0]} s={[0.05, 1.0, 1.24]} col="#bdb7a9" />
    {/* el portón (sube cuando sacan el auto) visto de costado: una tabla a la derecha del corte */}
    <mesh position={[-2.3, F0 + 0.5 + 0.38 * f("gdoor"), ZF - 0.02]} scale={[1, Math.max(0.001, 1 - 0.75 * f("gdoor")), 1]}><boxGeometry args={[1.3, 0.92, 0.02]} /><meshStandardMaterial color="#d2ccbf" roughness={0.8} transparent opacity={0.28} depthWrite={false} /></mesh>
    <mesh position={[-2.3, F0 + 1.06, 0]} rotation={[0, 0, 0.0]}><boxGeometry args={[1.4, 0.06, 1.3]} /><meshStandardMaterial map={snowTex()} roughness={0.8} /></mesh>
    <Car out={f("car")} />
    <RoomLight p={[-2.3, F0 + 0.85, 0.2]} k={1.0 * lights + 2.0 * f("gar")} />
    {/* la heladerita portátil afuera, contra la pared norte (paso 2) */}
    <group position={[-2.3, 0.04, -0.95]} scale={Math.max(0.001, f("cooler"))}>
      <RBox s={[0.3, 0.2, 0.2]} p={[0, 0.1, 0]} r={0.02}>{M.plastic({ col: "#2f6fb4" })}</RBox>
      <RBox s={[0.31, 0.04, 0.21]} p={[0, 0.21, 0]} r={0.015}>{M.plastic({ col: "#f3f1ea" })}</RBox>
    </group>

    {/* ===== la calle: vecinos, postes, el cable caído ===== */}
    <Neighbor p={[4.2, 0.04, -1.3]} r={-0.12} lit={1 - f("nb")} />
    <Neighbor p={[6.2, 0.04, -1.6]} r={-0.2} lit={1 - f("nb")} s={0.95} />
    <Neighbor p={[7.6, 0.04, -2.0]} r={-0.28} lit={1 - f("nb")} s={0.9} />
    <Pole p={[2.7, 0.0, 1.25]} />
    <Pole p={[4.9, 0.0, 1.25]} />
    <Pole p={[7.1, 0.0, 1.25]} />
    <mesh geometry={tubeG("wa", wire1, 0.008, 60, 6)}>{M.rubber({ col: "#151515" })}</mesh>
    <mesh geometry={tubeG("wb", wire2, 0.008, 60, 6)}>{M.rubber({ col: "#151515" })}</mesh>
    <Icicles pts={wire1} seed={3} />
    <Icicles pts={wire2} seed={5} />
    {/* el cable cortado: baja del poste hasta la nieve y chispea en la punta */}
    <mesh geometry={tubeG("wd", down, 0.011, 80, 8)} castShadow>{M.rubber({ col: "#101010" })}</mesh>
    <Icicles pts={down.slice(0, 18)} seed={7} />
    <Sparks t={t} p={Bd} k={0.35 + 0.65 * wire} />
    <pointLight position={[Bd[0], 0.15, Bd[2]]} intensity={(1.2 + 0.8 * Math.sin(t * 23) * Math.sin(t * 7)) * (0.4 + 0.6 * wire)} distance={1.8} color="#9fc4ff" />
    {/* la luz de la calle (se apaga con el corte) */}
    <group position={[2.4, 0, 0.6]}>
      <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.02, 0.025, 1.8, 10]} />{M.steel({ col: "#3a3d42" })}</mesh>
      <mesh position={[0, 1.82, 0]}><sphereGeometry args={[0.06, 16, 12]} /><meshStandardMaterial color="#222" emissive="#ffd9a0" emissiveIntensity={2.5 * (1 - f("nb"))} toneMapped={false} /></mesh>
      <pointLight position={[0, 1.75, 0.1]} intensity={3 * (1 - f("nb"))} distance={3.5} color="#ffd9a0" />
    </group>
    <Snow t={t} />
  </WorldCanvas>;
};
export const World3D = HouseWorld;
