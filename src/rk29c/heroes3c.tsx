// rk29c · componentes 3D 31-45 (29-oct). Cada uno UNA vez en toda la tanda (registro D:/rtmp/rk29_COMPONENTES.md).
// Lección EVALUADOR rk29b r1: objetos GRANDES en cuadro, cámara cerca, sin halos rojos ni emisivos que quemen.
import React from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { Studio, Wall3, Car3, RB, Mat, sm, spr, c01 } from "./studio3d";
import { AMB, useTxt, Person3, Hand3, Thread } from "./lock3d";
import { Safe3, GDoor3, Can3, Box3, Torch3 } from "./garage3d";

type P = { t: number; h: H };
type V = [number, number, number];

// bici simple (dos ruedas, cuadro)
export const Bike3: React.FC<{ p?: V; rot?: V; s?: number; col?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, col = "#2f6fb0" }) => <group position={p} rotation={rot} scale={s}>
  {[-0.36, 0.36].map((x, i) => <mesh key={i} position={[x, 0.3, 0]}><torusGeometry args={[0.28, 0.025, 10, 36]} /><Mat c="#1a1a1a" r={0.8} /></mesh>)}
  <mesh position={[0, 0.48, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.02, 0.02, 0.62, 10]} /><Mat c={col} m={0.5} r={0.3} /></mesh>
  <mesh position={[-0.18, 0.4, 0]} rotation={[0, 0, -0.6]}><cylinderGeometry args={[0.02, 0.02, 0.4, 10]} /><Mat c={col} m={0.5} r={0.3} /></mesh>
  <mesh position={[0.3, 0.55, 0]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.018, 0.018, 0.4, 10]} /><Mat c="#c9ced4" m={1} r={0.3} /></mesh>
</group>;
// generador
export const Gen3: React.FC<{ p?: V; s?: number }> = ({ p = [0, 0, 0], s = 1 }) => <group position={p} scale={s}>
  <RB p={[0, 0.25, 0]} s={[0.6, 0.42, 0.42]} rad={0.04} c="#d8a030" r={0.5} />
  <RB p={[0, 0.25, 0]} s={[0.64, 0.46, 0.3]} rad={0.02} c="#2a2c31" r={0.5} />
  <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.02, 0.02, 0.64, 10]} /><Mat c="#1a1a1a" r={0.5} /></mesh>
</group>;
// etiqueta de precio que flota
const Tag: React.FC<{ p: V; tex: THREE.Texture; k: number }> = ({ p, tex, k }) => <group position={p} scale={k}>
  <RB s={[0.34, 0.16, 0.01]} rad={0.02} c="#f6f3ec" r={0.8} />
  <mesh position={[0, 0, 0.007]}><planeGeometry args={[0.32, 0.14]} /><meshBasicMaterial map={tex} /></mesh>
</group>;

// 31 · cables tensados: corte de la losa con dos cables que vibran; la broca baja, ve el cartel amarillo y se detiene
export const H3Tendons: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const down = sm(tt, 1.0, 2.8) * (1 - 0.6 * sm(tt, 3.6, 4.4)), sign = sm(tt, 2.8, 3.4);
  const tx = useTxt(["POST-TENSION", "DO NOT DRILL"], 512, 220, "#f2c230", "#1a1a1a", 52, "Arial Black");
  return <Studio tt={tt} floor="none" photo={0.2} keys={[{ t: 0, p: [0, 0.5, 2.5], l: [0, 0.1, 0], fov: 40 }, { t: 10, p: [0.35, 0.45, 2.2], l: [0.05, 0.1, 0], arc: 0.03 }]}>
    <RB p={[0, -0.3, 0]} s={[2.4, 0.6, 0.5]} rad={0.01} c="#9a978f" r={0.95} />
    {[-0.42, -0.2].map((y, i) => <mesh key={i} position={[0, y + 0.006 * Math.sin(tt * 40 + i), 0.252]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.02, 0.02, 2.3, 10]} /><Mat c="#3a3d44" m={0.9} r={0.3} /></mesh>)}
    <group position={[0.2, 0.75 - 0.55 * down, 0.2]}>
      <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.012, 0.012, 0.4, 10]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
      <RB p={[0, 0.08, 0]} s={[0.16, 0.26, 0.16]} rad={0.03} c="#d8a030" r={0.5} />
      <RB p={[0.14, 0.12, 0]} s={[0.2, 0.08, 0.08]} rad={0.03} c="#2a2c31" r={0.5} />
    </group>
    <group position={[-0.6, 0.35, 0.3]} scale={sign} rotation={[0, 0.2, 0]}><mesh><planeGeometry args={[0.8, 0.34]} /><meshBasicMaterial map={tx} /></mesh></group>
  </Studio>;
}}</Stage>;

// 32 · el armado de Carl, desarmado en el aire: caja abulonada, caja de terciado gris, carro rojo delante, latas arriba
export const H3Carlstack: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const ex = 1 - sm(tt, 2.0, 4.6);
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [1.4, 1.3, 2.6], l: [0, 0.6, 0], fov: 40 }, { t: 10, p: [1.7, 1.1, 2.2], l: [0.05, 0.55, 0], arc: 0.04 }]}>
    <Wall3 p={[0, 1.6, -0.8]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Safe3 p={[0, 0, 0]} s={0.65} bolts={1} />
    <group position={[0, 0.6 * ex, 0]}><RB p={[0, 0.36, 0]} s={[0.62, 0.72, 0.58]} rad={0.006} c="#8f8f8a" r={0.9} op={0.92} /></group>
    {[[-0.15, 0.82], [0.12, 0.84], [0.0, 1.02]].map(([x, y], i) => <Can3 key={i} p={[x, y + 1.0 * ex + 0.1 * i * ex, 0.02]} s={1.4} c={["#c8c4ba", "#a8b0a0", "#c0b8a8"][i]} />)}
    <group position={[0, 0, 0.55 + 0.7 * ex]}><RB p={[0, 0.32, 0]} s={[0.9, 0.5, 0.35]} rad={0.03} c="#c23a2a" r={0.4} m={0.3} />{[-0.35, 0.35].map((x, i) => <mesh key={i} position={[x, 0.05, 0.12]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.05, 0.05, 0.04, 16]} /><Mat c="#1a1a1a" r={0.8} /></mesh>)}</group>
  </Studio>;
}}</Stage>;

// 33 · cómo entra Carl: el carro rueda un pie, las latas suben, la tapa se abre y asoma el dial
export const H3Rollaside: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const roll = sm(tt, 0.6, 1.8), lift = sm(tt, 2.0, 3.0), lid = sm(tt, 3.2, 4.2), dial = sm(tt, 4.4, 6.0);
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0.8, 1.3, 2.3], l: [0, 0.5, 0], fov: 40 }, { t: 4, p: [0.6, 1.2, 1.8], l: [0, 0.5, 0] }, { t: 10, p: [0.4, 1.0, 1.4], l: [0, 0.45, 0.1], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.8]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Safe3 p={[0, 0, 0]} s={0.65} dial={dial * 4} />
    <group position={[0, 0.72, -0.29]} rotation={[-1.8 * lid, 0, 0]}><RB p={[0, 0, 0.29]} s={[0.62, 0.02, 0.58]} rad={0.004} c="#8f8f8a" r={0.9} /></group>
    {[-0.3, 0.3].map((x, i) => <RB key={i} p={[x, 0.36, 0]} s={[0.02, 0.72, 0.58]} rad={0.004} c="#8f8f8a" r={0.9} />)}
    {[[-0.12, 0], [0.14, 0]].map(([x], i) => <Can3 key={i} p={[x + 0.9 * lift * (i ? 1 : -1), 0.74 + 0.3 * Math.sin(Math.PI * lift), 0]} s={1.3} />)}
    <group position={[0.3 * roll, 0, 0.55]}><RB p={[0, 0.3, 0]} s={[0.9, 0.48, 0.35]} rad={0.03} c="#c23a2a" r={0.4} m={0.3} /></group>
  </Studio>;
}}</Stage>;

// 34 · el recorrido del ladrón visto de arriba: huellas que pasan delante del carro rojo y siguen de largo a 18 pulgadas
export const H3Pathpast: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const n = Math.floor(c01((tt - 0.5) / 5) * 16);
  const lbl = useTxt(['18"'], 256, 128, "#00000000", AMB, 100, "Arial Black");
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0, 4.0, 1.0], l: [0, 0, -0.2], fov: 42 }, { t: 10, p: [0.4, 3.6, 0.9], l: [0.1, 0, -0.2], arc: 0.03 }]}>
    <group position={[-0.9, 0, -0.8]}><RB p={[0, 0.3, 0]} s={[0.9, 0.5, 0.35]} rad={0.03} c="#c23a2a" r={0.4} m={0.3} /></group>
    <group position={[0.4, 0, -1.1]}><Bike3 rot={[0, 0.2, 0]} /></group>
    <group position={[1.4, 0, -0.9]}><Gen3 /></group>
    {[...Array(n)].map((_, i) => <mesh key={i} position={[-2.2 + i * 0.3, 0.004, -0.3 + (i % 2 ? 0.08 : -0.08)]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}><planeGeometry args={[0.1, 0.22]} /><meshStandardMaterial color="#2a2016" roughness={1} transparent opacity={0.85} /></mesh>)}
    <mesh position={[-0.9, 0.01, -0.45]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.02, 0.3]} /><meshBasicMaterial color={AMB} toneMapped={false} /></mesh>
    <mesh position={[-0.6, 0.02, -0.45]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.4, 0.2]} /><meshBasicMaterial map={lbl} transparent /></mesh>
  </Studio>;
}}</Stage>;

// 35 · el ojo que tasa: bici, herramientas y generador ganan su etiqueta de precio; las latas quedan grises sin etiqueta
export const H3Valuescan: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const p1 = useTxt(["$900"], 256, 112, "#f6f3ec", "#1e2026", 84, "Arial Black"), p2 = useTxt(["$1,400"], 256, 112, "#f6f3ec", "#1e2026", 72, "Arial Black"), p3 = useTxt(["$600"], 256, 112, "#f6f3ec", "#1e2026", 84, "Arial Black");
  const k = (i: number) => spr(tt, 0.8 + i * 1.0, 8, 0.5);
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0, 1.3, 3.0], l: [0, 0.6, 0], fov: 40 }, { t: 10, p: [0.4, 1.2, 2.7], l: [0.1, 0.6, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.9]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Bike3 p={[-1.2, 0, -0.3]} rot={[0, 0.3, 0]} s={1.1} />
    <Gen3 p={[0, 0, -0.3]} s={1.2} />
    <group position={[1.1, 0, -0.4]}><RB p={[0, 0.4, 0]} s={[0.5, 0.8, 0.4]} rad={0.02} c="#c23a2a" r={0.4} m={0.4} />{[0.2, 0.45, 0.7].map((y, i) => <RB key={i} p={[0, y, 0.205]} s={[0.44, 0.02, 0.01]} rad={0.003} c="#1a1a1a" r={0.5} />)}</group>
    {[[1.85, 0], [2.05, 0], [1.95, 0.2]].map(([x, y], i) => <Can3 key={i} p={[x - 0.15, y, -0.35]} s={1.3} />)}
    <Tag p={[-1.2, 1.0, 0]} tex={p1} k={k(0)} />
    <Tag p={[0, 0.85, 0]} tex={p2} k={k(1)} />
    <Tag p={[1.1, 1.05, 0]} tex={p3} k={k(2)} />
  </Studio>;
}}</Stage>;

// 36 · el foco del ladrón barre el garage y salta sobre el rincón aburrido sin detenerse
export const H3Spotskip: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const tgt = React.useMemo(() => new THREE.Object3D(), []);
  const u = c01((tt - 0.4) / 6.0), x = -1.6 + 3.2 * u, jump = x > 0.6 && x < 1.5;
  tgt.position.set(jump ? 1.9 : x, jump ? 1.5 : 0.5, -0.6);
  return <Studio tt={tt} floor="concrete" night={0.95} photo={0} bg="#060608" keys={[{ t: 0, p: [0, 1.4, 3.0], l: [0, 0.6, -0.5], fov: 42 }, { t: 10, p: [0.3, 1.3, 2.7], l: [0.2, 0.6, -0.5], arc: 0.03 }]}>
    <primitive object={tgt} />
    <Wall3 p={[0, 1.6, -0.9]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Bike3 p={[-1.3, 0, -0.4]} rot={[0, 0.3, 0]} />
    <Gen3 p={[-0.3, 0, -0.4]} />
    <group position={[1.05, 0, -0.5]}><RB p={[0, 0.3, 0]} s={[0.9, 0.5, 0.35]} rad={0.03} c="#c23a2a" r={0.4} m={0.3} />{[-0.2, 0.15].map((x, i) => <Can3 key={i} p={[x, 0.55, 0]} s={1.3} />)}</group>
    <Torch3 p={[0, 1.4, 2.4]} tgt={tgt} angle={0.16} on={1.2} />
  </Studio>;
}}</Stage>;

// 37 · el garage respira calor y frío: un sol que sube y baja tras la ventanita; el termómetro de pared va de 100 °F a bajo cero
export const H3Heatswing: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const ph = (tt * 0.6) % (Math.PI * 2), hot = 0.5 + 0.5 * Math.sin(ph);
  const deg = Math.round(-5 + 105 * hot);
  const tx = useTxt([`${deg}°F`], 256, 128, "#f6f3ec", hot > 0.5 ? "#b8302a" : "#2f6fb0", 90, "Arial Black");
  return <Studio tt={tt} floor="concrete" warm={0.6 + 0.6 * hot} photo={0} keys={[{ t: 0, p: [0, 1.25, 2.2], l: [0, 1.1, 0], fov: 40 }, { t: 10, p: [0.3, 1.2, 2.0], l: [0.1, 1.1, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.3]} s={[6, 3.4, 0.1]} kind="drywall" />
    <mesh position={[-0.7, 1.4, -0.24]}><planeGeometry args={[0.7, 0.4]} /><meshBasicMaterial color={hot > 0.5 ? "#f2c98a" : "#8fa6c8"} /></mesh>
    <mesh position={[-0.7, 1.2 + 0.3 * Math.sin(ph), -0.235]}><circleGeometry args={[0.08, 24]} /><meshBasicMaterial color={hot > 0.5 ? "#ffd27a" : "#e8eef6"} /></mesh>
    <group position={[0.45, 1.1, -0.2]}>
      <RB s={[0.14, 0.8, 0.04]} rad={0.04} c="#ecebe6" r={0.6} />
      <mesh position={[0, -0.32 + 0.3 * hot, 0.025]}><planeGeometry args={[0.03, 0.06 + 0.6 * hot]} /><meshBasicMaterial color="#c62a22" /></mesh>
      <mesh position={[0, -0.36, 0.03]}><circleGeometry args={[0.04, 20]} /><meshBasicMaterial color="#c62a22" /></mesh>
    </group>
    <group position={[0.95, 1.1, -0.2]}><mesh><planeGeometry args={[0.5, 0.25]} /><meshBasicMaterial map={tx} /></mesh></group>
    <Safe3 p={[0.0, 0, 0.3]} s={0.55} />
  </Studio>;
}}</Stage>;

// 38 · el reloj del incendio: llamas afuera de la caja (titileo lento), corte con el papel adentro y una aguja que recorre los minutos
export const H3Firetime: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const ang = -Math.PI / 2 + Math.PI * 2 * c01((tt - 0.5) / 7) * 0.5;
  const fl = 0.85 + 0.15 * Math.sin(tt * 2 * Math.PI * 1.2);
  return <Studio tt={tt} floor="concrete" night={0.6} photo={0} bg="#0a0606" keys={[{ t: 0, p: [0, 0.8, 2.3], l: [0, 0.5, 0], fov: 40 }, { t: 10, p: [0.35, 0.75, 2.0], l: [0.1, 0.5, 0], arc: 0.03 }]}>
    <group position={[-0.25, 0, 0]}>
      <RB p={[0, 0.45, 0]} s={[0.7, 0.9, 0.6]} rad={0.03} c="#3d4148" r={0.4} m={0.6} />
      <RB p={[0, 0.45, 0.301]} s={[0.5, 0.7, 0.01]} rad={0.004} c="#d8d2c4" r={0.9} />
      {[0, 1, 2].map((i) => <RB key={i} p={[0, 0.3 + i * 0.12, 0.31]} s={[0.36, 0.08, 0.004]} rad={0.002} c="#f6f3ec" r={0.9} />)}
      {[-0.4, 0.4].map((x, i) => <mesh key={i} position={[x, 0.35 * fl, 0.1]} scale={[1, fl, 1]}><coneGeometry args={[0.12, 0.7, 12]} /><meshStandardMaterial color="#ff8a2a" emissive="#ff6a1a" emissiveIntensity={0.8} transparent opacity={0.85} /></mesh>)}
      <pointLight position={[0, 0.5, 0.6]} intensity={2.2 * fl} distance={2.5} color="#ff9a4a" />
    </group>
    <group position={[0.7, 0.7, 0]}>
      <mesh><cylinderGeometry args={[0.3, 0.3, 0.04, 48]} /><Mat c="#ecebe6" r={0.6} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.022]}><circleGeometry args={[0.28, 48]} /><meshBasicMaterial color="#f6f3ec" /></mesh>
      <group position={[0, 0, 0.03]} rotation={[0, 0, -ang]}><mesh position={[0, 0.12, 0]}><planeGeometry args={[0.02, 0.24]} /><meshBasicMaterial color="#1a1a1a" /></mesh></group>
    </group>
  </Studio>;
}}</Stage>;

// 39 · la base de concreto: el agua sube por el garage hasta su marca; la caja, sobre cuatro pulgadas, queda seca
export const H3Raisedpad: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const w = 0.09 * sm(tt, 1.0, 4.0);
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0.9, 0.55, 1.8], l: [0, 0.2, 0], fov: 38 }, { t: 10, p: [1.1, 0.45, 1.5], l: [0, 0.18, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    <RB p={[0, 0.05, 0]} s={[0.9, 0.1, 0.8]} rad={0.01} c="#a8a59c" r={0.95} />
    <Safe3 p={[0, 0.1, 0]} s={0.65} />
    <Box3 p={[-1.0, 0, 0.1]} s={[0.5, 0.4, 0.4]} />
    <mesh position={[0, w, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[6, 4]} /><meshPhysicalMaterial color="#6a8aa0" transmission={0.4} roughness={0.08} transparent opacity={0.7} /></mesh>
    <mesh position={[0.46, 0.1, 0.41]}><planeGeometry args={[0.1, 0.006]} /><meshBasicMaterial color={AMB} toneMapped={false} /></mesh>
  </Studio>;
}}</Stage>;

// 40 · la caja en la vereda es un cartel: los autos pasan de a uno y cada uno gira los faros hacia la caja vacía
export const H3Billboard: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const lbl = useTxt(["SAFE", "1200 LB"], 512, 256, "#b8905a", "#1a1a1a", 88, "Arial Black");
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0, 1.1, 3.2], l: [0, 0.5, 0], fov: 40 }, { t: 10, p: [0.4, 1.0, 2.9], l: [0.1, 0.5, 0], arc: 0.03 }]}>
    <RB p={[0, 0.005, 1.0]} s={[8, 0.01, 1.4]} rad={0.002} c="#3a3c40" r={0.9} />
    <group position={[-0.2, 0, -0.1]}><Box3 s={[0.9, 1.0, 0.7]} open={0.3} /><mesh position={[0, 0.55, 0.352]}><planeGeometry args={[0.7, 0.35]} /><meshBasicMaterial map={lbl} /></mesh></group>
    {[0, 1, 2].map((i) => { const u = c01((tt - 0.4 - i * 2.2) / 2.4), x = -3.5 + 7 * u; const look = Math.max(0, 1 - Math.abs(x) / 1.2); return u > 0 && u < 1 ? <Car3 key={i} p={[x, 0, 1.0]} rot={[0, Math.PI / 2 - 0.4 * look, 0]} s={0.6} col={["#c9ced4", "#2a3a4e", "#7a2a22"][i]} head={0.4} /> : null; })}
  </Studio>;
}}</Stage>;

// 41 · cortala en pedazos: la caja de cartón se despliega, se parte en baldosas y cada una se da vuelta del lado liso
export const H3Cuttiles: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const unf = sm(tt, 0.6, 2.0), sp = sm(tt, 2.2, 3.4);
  const lbl = useTxt(["SAFE"], 256, 128, "#b8905a", "#1a1a1a", 90, "Arial Black");
  return <Studio tt={tt} floor="wood" photo={0.2} keys={[{ t: 0, p: [0, 2.4, 1.8], l: [0, 0.2, 0], fov: 40 }, { t: 10, p: [0.3, 2.2, 1.6], l: [0, 0.2, 0], arc: 0.03 }]}>
    {unf < 0.3 && <Box3 s={[0.7, 0.5, 0.5]} />}
    {unf >= 0.3 && [...Array(9)].map((_, i) => { const cx = (i % 3) - 1, cz = Math.floor(i / 3) - 1, flip = sm(tt, 3.6 + i * 0.25, 4.1 + i * 0.25); return <group key={i} position={[cx * (0.34 + 0.12 * sp), 0.02 + 0.15 * Math.sin(Math.PI * flip), cz * (0.34 + 0.12 * sp)]} rotation={[Math.PI * flip, 0, 0]}>
      <RB s={[0.32, 0.01, 0.32]} rad={0.002} c="#b8905a" r={0.9} />
      {i === 4 && <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.15]} /><meshBasicMaterial map={lbl} /></mesh>}
      <mesh position={[0, -0.006, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[0.31, 0.31]} /><Mat c="#a88050" r={1} /></mesh>
    </group>; })}
  </Studio>;
}}</Stage>;

// 42 · la cadena del parasol: control del portón → registro en la guantera → dirección → el portón que sube solo; un hilo ámbar los une
export const H3Visorchain: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const k = (i: number) => sm(tt, 0.6 + i * 1.3, 1.4 + i * 1.3);
  const reg = useTxt(["REGISTRATION", "1418 ELM ST"], 512, 256, "#f6f3ec", "#1e2026", 50);
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0, 1.4, 3.2], l: [0, 0.9, 0], fov: 42 }, { t: 10, p: [0.4, 1.3, 2.9], l: [0.2, 0.9, 0], arc: 0.03 }]}>
    <group position={[-1.4, 1.0, 0]} scale={1.6}><RB s={[0.16, 0.06, 0.24]} rad={0.02} c="#2a2c31" r={0.4} /><mesh position={[0, 0.031, 0.04]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.035, 20]} /><Mat c="#9aa0a8" m={0.8} r={0.3} /></mesh></group>
    <group position={[-0.45, 1.0, 0]} scale={k(0)}><mesh><planeGeometry args={[0.6, 0.3]} /><meshBasicMaterial map={reg} /></mesh></group>
    <group position={[1.4, 0, -0.6]} scale={0.5}><GDoor3 up={k(2)} win frame /></group>
    <Thread a={[-1.3, 1.0, 0.05]} b={[-0.7, 1.0, 0.02]} k={k(0)} lift={0.25} />
    <Thread a={[-0.15, 1.0, 0.02]} b={[0.85, 0.7, -0.5]} k={k(1)} lift={0.3} />
    <Person3 p={[0.5, 0, 0.3]} yaw={0.6} s={0.85} col="#1a1c22" op={k(2)} />
  </Studio>;
}}</Stage>;

// 43 · el botón de vacaciones: el dedo aprieta LOCK en el panel de pared y los controles de afuera rebotan sin efecto
export const H3Vacationbtn: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const press = sm(tt, 1.0, 1.4), on = tt > 1.3;
  const tx = useTxt(["LOCK"], 256, 96, "#2a2c31", on ? "#ffb257" : "#9aa0a8", 70, "Arial Black");
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0, 1.15, 1.4], l: [0, 1.05, 0], fov: 40 }, { t: 3, p: [0.6, 1.1, 2.2], l: [0.4, 0.9, 0] }, { t: 10, p: [0.8, 1.05, 2.0], l: [0.5, 0.9, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.12]} s={[6, 3.4, 0.1]} kind="drywall" />
    <group position={[0, 1.05, -0.05]}><RB s={[0.3, 0.42, 0.05]} rad={0.015} c="#ecebe6" r={0.6} /><RB p={[0, 0.06, 0.03 - 0.012 * press]} s={[0.2, 0.08, 0.025]} rad={0.01} c="#2a2c31" r={0.5} /><mesh position={[0, 0.06, 0.045 - 0.012 * press]}><planeGeometry args={[0.18, 0.07]} /><meshBasicMaterial map={tx} toneMapped={false} /></mesh></group>
    <Hand3 p={[0.05, 1.11, 0.12 + 0.3 * (1 - press) + 0.3 * sm(tt, 1.6, 2.4)]} rot={[0, 0, 0]} s={1.5} />
    {[0, 1, 2].map((i) => { const u = ((tt - 3 - i * 0.9) % 2.7) / 2.7; const x = 1.4 - 0.7 * Math.sin(Math.PI * c01(u)); return tt > 3 + i * 0.9 ? <group key={i} position={[x, 0.8 + i * 0.22, 0.4]} rotation={[0, 0, 0.3 * Math.sin(tt * 3 + i)]}><RB s={[0.12, 0.05, 0.18]} rad={0.02} c="#2a2c31" r={0.4} /></group> : null; })}
  </Studio>;
}}</Stage>;

// 44 · nunca la llave al lado del candado: la llave sale del clavo junto a la caja y vuela lejos, a un libro en otro cuarto
export const H3Keyhook: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const f = sm(tt, 1.6, 4.2), x = 0.5 + (-2.0 - 0.5) * f, y = 1.25 + 0.5 * Math.sin(Math.PI * f) - 0.35 * f;
  return <Studio tt={tt} floor="wood" photo={0} keys={[{ t: 0, p: [0.6, 1.2, 2.2], l: [0.4, 0.9, 0], fov: 40 }, { t: 2, p: [-0.2, 1.3, 3.0], l: [-0.6, 0.9, 0] }, { t: 10, p: [-0.9, 1.2, 2.6], l: [-1.4, 0.9, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.5]} s={[6, 3.4, 0.1]} kind="drywall" />
    <RB p={[-0.85, 1.3, -0.3]} s={[0.1, 2.6, 0.5]} rad={0.004} c="#d8d2c4" r={0.9} />
    <Safe3 p={[0.6, 0, -0.1]} s={0.75} />
    <mesh position={[0.5, 1.3, -0.43]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.06, 8]} /><Mat c="#c9ced4" m={1} r={0.3} /></mesh>
    <group position={[x, y, -0.35 + 0.3 * f]} rotation={[0, 0, f * 6]} scale={1.7}>
      <mesh position={[0, 0.05, 0]}><torusGeometry args={[0.03, 0.01, 8, 20]} /><Mat c="#d4a84a" m={1} r={0.25} /></mesh>
      <RB p={[0, -0.03, 0]} s={[0.014, 0.1, 0.008]} rad={0.003} c="#d4a84a" m={1} r={0.25} />
    </group>
    <group position={[-2.0, 0.55, -0.1]}>
      <RB p={[0, 0.25, 0]} s={[0.8, 0.5, 0.4]} rad={0.01} c="#6a4a32" r={0.7} />
      <group position={[0, 0.55, 0]} rotation={[0, 0, 0]}><RB s={[0.3, 0.06, 0.22]} rad={0.005} c="#7a2a22" r={0.8} /><RB p={[0, 0.032, 0]} s={[0.28, 0.008, 0.2]} rad={0.002} c="#f6f3ec" r={0.9} /></group>
    </group>
  </Studio>;
}}</Stage>;

// 45 · las dos mitades: originales viajan a la bóveda del banco, copias y lo de todos los días quedan en la caja de casa
export const H3Bankhome: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const go = (i: number) => sm(tt, 1.0 + i * 0.5, 2.6 + i * 0.5);
  const orig = useTxt(["ORIGINAL"], 256, 96, "#f6f3ec", "#7a2a22", 54, "Arial Black"), copy = useTxt(["COPY"], 256, 96, "#f6f3ec", "#2f6fb0", 60, "Arial Black");
  return <Studio tt={tt} floor="wood" photo={0.2} keys={[{ t: 0, p: [0, 1.3, 3.0], l: [0, 0.7, 0], fov: 42 }, { t: 10, p: [0.3, 1.2, 2.7], l: [0, 0.7, 0], arc: 0.03 }]}>
    <group position={[1.3, 0, -0.3]}><RB p={[0, 0.7, 0]} s={[1.0, 1.4, 0.7]} rad={0.03} c="#b8b8b0" r={0.4} m={0.7} /><mesh position={[0, 0.75, 0.352]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.02, 48]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh></group>
    <Safe3 p={[-1.3, 0, -0.2]} s={0.75} open={0.8} />
    {[0, 1, 2].map((i) => { const k = go(i); return <group key={i} position={[-0.2 + 1.5 * k, 0.9 + 0.4 * Math.sin(Math.PI * k) + i * 0.05, 0.1]} rotation={[-0.3, 0, 0]}><RB s={[0.3, 0.008, 0.38]} rad={0.002} c="#f6f3ec" r={0.9} /><mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.26, 0.1]} /><meshBasicMaterial map={orig} /></mesh></group>; })}
    {[0, 1].map((i) => { const k = go(i + 1); return <group key={"c" + i} position={[-0.2 - 0.95 * k, 0.9 + 0.3 * Math.sin(Math.PI * k) - 0.3 * k + i * 0.05, 0.1]} rotation={[-0.3, 0, 0]}><RB s={[0.3, 0.008, 0.38]} rad={0.002} c="#e8eef6" r={0.9} /><mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.24, 0.1]} /><meshBasicMaterial map={copy} /></mesh></group>; })}
  </Studio>;
}}</Stage>;

export const HEROES_3C = { tendons: H3Tendons, carlstack: H3Carlstack, rollaside: H3Rollaside, pathpast: H3Pathpast, valuescan: H3Valuescan, spotskip: H3Spotskip, heatswing: H3Heatswing, firetime: H3Firetime, raisedpad: H3Raisedpad, billboard: H3Billboard, cuttiles: H3Cuttiles, visorchain: H3Visorchain, vacationbtn: H3Vacationbtn, keyhook: H3Keyhook, bankhome: H3Bankhome };
