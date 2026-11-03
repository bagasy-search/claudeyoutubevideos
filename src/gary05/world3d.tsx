// gary05 · EL MUNDO: el sótano de una casa de Ohio a las 4 de la mañana, en corte (sin pared de adelante). Al fondo el
// calefactor a gas con la tapa sacable (inductor, encendedor, placa, soplador, llamas), el ducto que sube y el caño blanco
// que sale por la pared; a la izquierda la escalera, el termostato redondo y la ventanita alta con escarcha, carámbanos y
// nieve cayendo afuera; a la derecha el banco de Gary (pinza amarilla, libreta) y el termotanque; en el piso, la power
// station con el cable al interruptor de transferencia. Cuadro 0 = la miniatura: calefactor abierto con llama azul,
// termostato en 68°, la power station enchufada y la ventana helada. Cámara y efectos salen de world.json.
import React, { useMemo } from "react";
import * as THREE from "three";
import { C, WorldCanvas, mkCamAt, mkCamSpeed, fxAt, paint, rnd } from "./wengine";
import { M, RBox, tex, tubeG } from "./h3d";
import { PBox, WattMeter } from "./gk";
import { Clamp, Furnace, Thermostat, TSwitch } from "./fk";

const PI = Math.PI;
type V = [number, number, number];
const FZ = -0.85, FX = 0.35, ZB = -1.2;   // calefactor (fondo) y pared del fondo

const C3: Record<string, C> = {
  thumb: { p: [-0.62, 0.62, 1.05], l: [0.2, 0.62, -0.75], fov: 46 },
  wide: { p: [0.0, 1.25, 3.2], l: [0.0, 0.85, -0.6], fov: 46 },
  stairs: { p: [-0.2, 1.15, 1.6], l: [-1.3, 0.95, -0.4], fov: 42 },
  furnace: { p: [0.35, 0.8, 1.15], l: [0.35, 0.68, FZ], fov: 40 },
  inside: { p: [0.35, 0.78, 0.25], l: [0.35, 0.74, FZ], fov: 42 },
  ind: { p: [0.18, 1.04, -0.22], l: [0.21, 0.99, FZ + 0.12], fov: 34 },
  ign: { p: [0.28, 0.74, -0.32], l: [0.245, 0.66, FZ + 0.06], fov: 32 },
  board: { p: [0.52, 1.04, -0.28], l: [0.47, 1.0, FZ + 0.12], fov: 32 },
  blow: { p: [0.35, 0.36, -0.12], l: [0.35, 0.26, FZ], fov: 38 },
  ps: { p: [-0.15, 0.42, 0.6], l: [0.0, 0.14, -0.3], fov: 38 },
  ts: { p: [0.8, 1.06, -0.25], l: [0.86, 0.98, ZB + 0.04], fov: 34 },
  thermo: { p: [-0.5, 1.26, -0.55], l: [-0.55, 1.24, ZB], fov: 32 },
  window: { p: [-1.05, 1.5, 0.0], l: [-1.3, 1.72, ZB], fov: 38 },
  bench: { p: [1.0, 1.2, 0.65], l: [1.55, 0.85, -0.55], fov: 40 },
  duct: { p: [0.45, 1.5, 0.75], l: [0.35, 1.85, FZ], fov: 42 },
};
export const camAt = mkCamAt(C3);
export const camSpeed = mkCamSpeed(camAt);

const blockTex = () => paint("bsmtblock", 512, 512, (g) => {
  g.fillStyle = "#8c8780"; g.fillRect(0, 0, 512, 512);
  for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++) {
    const x = c * 128 + (r % 2 ? 64 : 0), y = r * 64, v = 128 + 22 * rnd(r * 9 + c, 3);
    g.fillStyle = `rgb(${v + 6},${v + 2},${v - 6})`; g.fillRect(x + 3, y + 3, 122, 58);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(60,55,50,${0.12 * rnd(i + r * 40 + c, 7)})`; g.fillRect(x + 3 + 120 * rnd(i, r + c), y + 3 + 56 * rnd(i, r * 2 + c), 2, 2); }
  }
  g.fillStyle = "#6e6a63"; for (let r = 0; r <= 8; r++) g.fillRect(0, r * 64, 512, 3);
});
const floorTex = () => paint("bsmtfloor", 512, 512, (g) => {
  g.fillStyle = "#77736c"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) { g.fillStyle = rnd(i, 2) > 0.5 ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.07)"; g.fillRect(rnd(i, 1) * 512, rnd(i, 3) * 512, 3, 3); }
  g.strokeStyle = "rgba(40,36,32,.35)"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 300); g.bezierCurveTo(140, 280, 260, 340, 512, 310); g.stroke();
});
const frostTex = () => paint("frost", 256, 160, (g) => {
  g.clearRect(0, 0, 256, 160);
  for (let i = 0; i < 260; i++) { const x = rnd(i, 1) * 256, y = rnd(i, 2) * 160, ed = Math.min(x, 256 - x, y, 160 - y), a = Math.max(0, 0.75 - ed / 70);
    g.strokeStyle = `rgba(235,246,255,${a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 14 * (rnd(i, 3) - 0.5), y + 14 * (rnd(i, 4) - 0.5)); g.stroke(); }
});

// foco con blanco propio (el target tiene que estar en la escena para que apunte)
const SpotAt: React.FC<{ p: V; to: V; angle: number; pen?: number; k: number; d: number; col: string; shadow?: boolean }> = ({ p, to, angle, pen = 1, k, d, col, shadow }) => {
  const tg = useMemo(() => new THREE.Object3D(), []); tg.position.set(to[0], to[1], to[2]);
  return <><primitive object={tg} /><spotLight position={p} target={tg} angle={angle} penumbra={pen} intensity={k} distance={d} color={col} castShadow={shadow} shadow-bias={-0.0004} shadow-normalBias={0.03} shadow-mapSize-width={1024} shadow-mapSize-height={1024} /></>;
};
const Window: React.FC<{ t: number }> = ({ t }) => {
  const W = 0.62, H = 0.36;
  return <group position={[-1.3, 1.72, ZB + 0.01]}>
    {/* afuera: noche azul, nieve amontonada y copos */}
    <mesh position={[0, 0, -0.05]}><planeGeometry args={[W, H]} /><meshBasicMaterial color="#10264a" toneMapped={false} /></mesh>
    <mesh position={[0, -H / 2 + 0.05, -0.04]}><planeGeometry args={[W, 0.1]} /><meshBasicMaterial color="#cfe0f4" toneMapped={false} /></mesh>
    {Array.from({ length: 34 }, (_, i) => { const ph = (t * (0.08 + 0.05 * rnd(i, 2)) + rnd(i, 1)) % 1; return <mesh key={i} position={[-W / 2 + W * rnd(i, 3) + 0.01 * Math.sin(t + i), H / 2 - H * ph, -0.03]}><circleGeometry args={[0.004 + 0.003 * rnd(i, 4), 8]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>; })}
    {/* escarcha en los bordes del vidrio */}
    <mesh position={[0, 0, -0.012]}><planeGeometry args={[W, H]} /><meshBasicMaterial map={frostTex()} transparent toneMapped={false} depthWrite={false} /></mesh>
    {/* marco y cruz */}
    {[[0, H / 2 + 0.02, W + 0.08, 0.04], [0, -H / 2 - 0.02, W + 0.08, 0.04], [-W / 2 - 0.02, 0, 0.04, H + 0.08], [W / 2 + 0.02, 0, 0.04, H + 0.08], [0, 0, 0.025, H]].map(([x, y, a, b], i) =>
      <mesh key={i} position={[x, y, 0.0]}><boxGeometry args={[a, b, 0.05]} />{M.matte({ col: "#e9e4da" })}</mesh>)}
    {/* nieve en el alféizar y carámbanos colgando */}
    <RBox s={[W + 0.1, 0.04, 0.09]} p={[0, -H / 2 - 0.05, 0.03]} r={0.015}><meshStandardMaterial color="#eef4fb" roughness={0.9} /></RBox>
    {Array.from({ length: 11 }, (_, i) => <mesh key={"ic" + i} position={[-W / 2 + 0.03 + i * (W - 0.06) / 10, H / 2 + 0.0 - 0.04 - 0.03 * rnd(i, 5), 0.035]} rotation={[PI, 0, 0]}><coneGeometry args={[0.009, 0.06 + 0.09 * rnd(i, 6), 7]} />{M.glass({ op: 0.7, col: "#dff2ff" })}</mesh>)}
    {/* termómetro de afuera, pegado al vidrio: 11 °F */}
    <group position={[W / 2 - 0.1, 0.02, -0.02]}>
      <mesh><circleGeometry args={[0.05, 32]} /><meshBasicMaterial color="#f2efe6" toneMapped={false} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[0, 0, 2.4]}><planeGeometry args={[0.004, 0.08]} /><meshBasicMaterial color="#c62a22" /></mesh>
    </group>
    {/* luz de luna que entra fría */}
    <SpotAt p={[0.0, 0.1, -0.3]} to={[0.3, -1.7, 1.2]} angle={0.7} k={6} d={4} col="#8fb4ff" />
  </group>;
};

const Stairs: React.FC = () => <group position={[-1.75, 0, -0.1]}>
  {Array.from({ length: 9 }, (_, i) => <group key={i}>
    <RBox s={[0.5, 0.03, 0.2]} p={[0, 0.2 + i * 0.2, 0.75 - i * 0.2]} r={0.006}>{M.wood({ base: [128, 92, 58] })}</RBox>
  </group>)}
  {/* zanca */}
  <mesh position={[0.26, 1.0, -0.05]} rotation={[0.785, 0, 0]}><boxGeometry args={[0.03, 0.06, 2.55]} />{M.wood({ base: [100, 70, 44] })}</mesh>
  <mesh position={[0.3, 1.25, -0.05]} rotation={[0.785, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 2.4, 10]} />{M.wood({ base: [90, 62, 38] })}</mesh>
</group>;

// el banco de Gary: tablón, pinza amarilla, libreta, linterna
const Bench: React.FC = () => <group position={[1.55, 0, -0.62]}>
  <RBox s={[0.8, 0.05, 0.42]} p={[0, 0.82, 0]} r={0.01}>{M.wood({ base: [146, 104, 62] })}</RBox>
  {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z], i) => <mesh key={i} position={[x * 0.36, 0.4, z * 0.18]}><boxGeometry args={[0.05, 0.8, 0.05]} />{M.wood({ base: [110, 76, 44] })}</mesh>)}
  <RBox s={[0.76, 0.03, 0.38]} p={[0, 0.25, 0]} r={0.008}>{M.wood({ base: [120, 84, 50] })}</RBox>
  <Clamp jaw={1} val="4.8A" p={[-0.2, 0.88, 0.05]} r={[-PI / 2 + 0.25, 0, 0.5]} s={0.9} />
  <RBox s={[0.16, 0.012, 0.22]} p={[0.12, 0.851, 0.03]} r={0.004}><meshStandardMaterial map={tex.paper()} roughness={0.9} /></RBox>
  <mesh position={[0.12, 0.858, 0.03]} rotation={[-PI / 2, 0, 0.3]}><cylinderGeometry args={[0.004, 0.004, 0.15, 8]} />{M.plastic({ col: "#f2c21b" })}</mesh>
  <mesh position={[0.3, 0.88, -0.05]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.025, 0.02, 0.16, 18]} />{M.matte({ col: "#222428" })}</mesh>
  {/* tablero de pinzas (pegboard) atrás con herramientas */}
  <mesh position={[0, 1.3, -0.2]}><planeGeometry args={[0.8, 0.6]} /><meshStandardMaterial color="#b49a74" roughness={0.9} /></mesh>
  {[[-0.25, 1.35, "#c62a22"], [-0.05, 1.3, "#f2c21b"], [0.18, 1.38, "#2b6fd6"]].map(([x, y, c], i) => <RBox key={i} s={[0.04, 0.2, 0.02]} p={[x as number, y as number, -0.18]} r={0.006}>{M.plastic({ col: c as string })}</RBox>)}
</group>;

export const BasementWorld: React.FC<{ t: number }> = ({ t }) => {
  const fx = fxAt(t), f = (k: string) => fx[k] ?? 0, cam = camAt(t);
  const dark = f("dark"), lights = 1 - dark;
  const fl = f("fl"), torch = f("torch"), ps = f("ps"), cord = f("cord");
  const watts = Math.round(f("w")), pct = Math.round(f("pct")), temp = f("temp");
  const inlet: V = [0.86, 0.905, ZB + 0.09], psP: V = [-0.02, 0, -0.3];
  const cordPts = useMemo(() => [[psP[0] + 0.15, 0.14, psP[2] - 0.05], [0.4, 0.02, -0.45], [0.8, 0.02, -0.9], [0.88, 0.4, ZB + 0.1], inlet], []);
  return <WorldCanvas cam={cam} bg="#06080c" fog={[4, 12]}>
    <hemisphereLight args={["#8aa0c0", "#1a1612", 0.18 + 0.35 * lights]} />
    {/* bombita del techo (se apaga con el corte) */}
    <group position={[0.0, 2.05, -0.2]}>
      <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.004, 0.004, 0.16, 6]} />{M.matte({ col: "#222" })}</mesh>
      <mesh><sphereGeometry args={[0.035, 20, 14]} /><meshStandardMaterial color="#fff6e0" emissive="#ffd59a" emissiveIntensity={2.4 * lights} toneMapped={false} /></mesh>
      <pointLight intensity={4 * lights} distance={5} color="#ffdcae" />
    </group>
    {/* relleno frío del frente del corte (de noche apenas) */}
    <spotLight position={[0.4, 2.2, 3.4]} angle={0.75} penumbra={1} intensity={3.5 + 5 * lights} distance={8} color="#c9d6ea" />
    {/* la linterna de Gary: un cono cálido desde la escalera hacia el calefactor */}
    <SpotAt p={[-1.3, 1.5, 0.4]} to={[FX, 0.6, FZ]} angle={0.28} pen={0.6} k={18 * torch} d={4.5} col="#fff1d0" shadow />

    {/* sótano: piso, paredes de bloque, vigas del techo */}
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0, -0.1]} receiveShadow><planeGeometry args={[4.4, 2.6]} /><meshStandardMaterial map={floorTex()} roughness={0.92} /></mesh>
    <mesh position={[0, 1.1, ZB]} receiveShadow><planeGeometry args={[4.4, 2.2]} /><meshStandardMaterial map={blockTex()} roughness={0.95} /></mesh>
    <mesh position={[-2.2, 1.1, -0.1]} rotation={[0, PI / 2, 0]} receiveShadow><planeGeometry args={[2.6, 2.2]} /><meshStandardMaterial map={blockTex()} roughness={0.95} color="#d8d2c8" /></mesh>
    <mesh position={[2.2, 1.1, -0.1]} rotation={[0, -PI / 2, 0]} receiveShadow><planeGeometry args={[2.6, 2.2]} /><meshStandardMaterial map={blockTex()} roughness={0.95} color="#d8d2c8" /></mesh>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-2.0 + i * 0.5, 2.15, -0.1]} castShadow><boxGeometry args={[0.06, 0.16, 2.6]} />{M.wood({ base: [124, 90, 56] })}</mesh>)}
    <mesh position={[0, 2.24, -0.1]}><planeGeometry args={[4.4, 2.6]} /><meshStandardMaterial color="#5a4630" roughness={1} side={THREE.BackSide} /></mesh>

    <Window t={t} />
    <Stairs />

    {/* el calefactor, con el ducto de chapa que sube al techo y el caño de gas negro */}
    <Furnace t={t} p={[FX, 0, FZ]} k={{ open: f("open"), ind: f("ind"), ign: f("ign"), fl, blow: f("blow"), led: f("led"), err: f("err") }} />
    <RBox s={[0.6, 0.5, 0.52]} p={[FX, 1.4, FZ]} r={0.006}>{M.steel({ col: "#b8bdc0" })}</RBox>
    <RBox s={[0.42, 0.26, 0.4]} p={[FX, 1.85, FZ]} r={0.006}>{M.steel({ col: "#b0b5b8" })}</RBox>
    <RBox s={[1.6, 0.24, 0.32]} p={[FX + 0.4, 2.0, FZ + 0.15]} r={0.006}>{M.steel({ col: "#aeb3b6" })}</RBox>
    <mesh geometry={tubeG("gas05", [[1.2, 1.9, ZB + 0.05], [1.0, 1.0, ZB + 0.05], [0.9, 0.6, -0.65], [FX + 0.29, 0.6, FZ + 0.16]], 0.016, 60, 10)}>{M.matte({ col: "#1d1d1f" })}</mesh>
    <group position={[0.95, 0.75, -0.7]}><RBox s={[0.06, 0.03, 0.03]} r={0.006}>{M.plastic({ col: "#f2c21b" })}</RBox></group>
    {/* interruptor de servicio (como de luz) y el interruptor de transferencia en la pared */}
    <group position={[-0.12, 1.3, ZB + 0.02]}>
      <RBox s={[0.08, 0.12, 0.04]} r={0.008}>{M.steel({ col: "#9aa0a6" })}</RBox>
      <mesh position={[0, 0, 0.022]}><boxGeometry args={[0.012, 0.03, 0.01]} />{M.plastic({ col: "#e9e7e1" })}</mesh>
      <mesh position={[0.0, 0.24, 0.0]}><boxGeometry args={[0.02, 0.36, 0.02]} />{M.steel({ col: "#9aa0a6" })}</mesh>
    </group>
    <TSwitch lev={f("lev")} p={[0.86, 0.98, ZB + 0.04]} />
    {/* termostato redondo en la pared del fondo, entre la escalera y el calefactor */}
    <Thermostat temp={temp} fan={f("fan")} on={1} flame={fl} p={[-0.55, 1.25, ZB + 0.015]} />
    {/* la power station en el piso, con el medidor arriba y el cable hasta la toma del interruptor */}
    <group scale={Math.max(0.001, ps)}>
      <PBox p={psP} w={0.36} h={0.26} d={0.22} scr={`${pct}%`} scrCol="#5ab8ff" on={ps} />
      <WattMeter val={`${watts} W`} p={[psP[0] - 0.06, 0.29, psP[2]]} s={1.0} />
    </group>
    <mesh geometry={tubeG("cord05", cordPts, 0.009, 90, 8)} visible={cord > 0.5} castShadow>{M.rubber({ col: "#151517" })}</mesh>
    {/* termotanque a la derecha, al fondo */}
    <group position={[1.75, 0, -0.95]}>
      <mesh position={[0, 0.55, 0]} castShadow><cylinderGeometry args={[0.2, 0.2, 1.1, 32]} />{M.porcelain({ col: "#e9e6de" })}</mesh>
      <mesh position={[0, 1.15, 0]}><cylinderGeometry args={[0.03, 0.03, 0.12, 12]} />{M.brass({ col: "#b07a3a" })}</mesh>
    </group>
    <Bench />
  </WorldCanvas>;
};
export const World3D = BasementWorld;
