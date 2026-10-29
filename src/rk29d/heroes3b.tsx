// rk29d · componentes 3D 16-30 (29-oct). Cada uno UNA vez en toda la tanda (registro D:/rtmp/rk29_COMPONENTES.md).
// Vara EVALUADOR (rk29b): objeto grande que se entiende sin leer, pared/piso claro, cámara cerca, acción con peso.
import React from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { Studio, Wall3, Fob3, Pouch3, Rings3, RB, Mat, sm, spr, c01, rnd, type V3 } from "./studio3d";
import { AMB, RED, useTxt, Person3, Door3 } from "./lock3d";
import { Truck3, Home3 } from "./truck3d";

type P = { t: number; h: H };

// 16 · el menú: cuatro marcos de pantalla uno detrás de otro; la cámara los atraviesa y al fondo una palanca física pasa de ON a OFF
const Frame16: React.FC<{ z: number; lab: THREE.Texture; hot: number }> = ({ z, lab, hot }) => <group position={[0, 1.0, z]}>
  {[[0, 0.43, 1.5, 0.05], [0, -0.43, 1.5, 0.05], [-0.73, 0, 0.05, 0.9], [0.73, 0, 0.05, 0.9]].map(([x, y, w, hh], i) => <RB key={i} p={[x, y, 0]} s={[w, hh, 0.05]} rad={0.015} c="#2c3a48" r={0.4} e="#4a8ac8" ei={0.25 + 0.5 * hot} />)}
  <mesh position={[0, 0.33, 0.03]}><planeGeometry args={[1.0, 0.15]} /><meshBasicMaterial map={lab} toneMapped={false} /></mesh>
</group>;
export const D3Menudive: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const labels = ["SETTINGS", "VEHICLE", "LOCKS", "PASSIVE ENTRY"].map((l) => useTxt([l], 512, 80, "#1e2a36", "#e8eef6", 50, "Arial Black"));
  const fly = sm(tt, 0.4, 6.2), cz = 2.6 - 4.1 * fly, flip = sm(tt, 6.6, 7.0);
  return <Studio tt={tt} floor="none" warm={0.7} photo={0} bg="#2b2620" keys={[{ t: 0, p: [0, 1.0, cz], l: [0, 1.0, cz - 3], fov: 46 }]}>
    {[0, 1, 2, 3].map((i) => <Frame16 key={i} z={-i * 0.8} lab={labels[i]} hot={c01(1 - Math.abs(cz - 0.6 + i * 0.8))} />)}
    <group position={[0, 0.95, -3.0]}>
      <RB s={[0.6, 0.36, 0.08]} rad={0.04} c="#3a3c42" m={0.7} r={0.35} />
      <group position={[0, 0, 0.05]} rotation={[0.55 - 1.1 * flip, 0, 0]}><mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.03, 0.04, 0.26, 16]} /><Mat c="#e8ecf0" m={1} r={0.15} /></mesh><mesh position={[0, 0.27, 0]}><sphereGeometry args={[0.055, 20, 20]} /><Mat c="#1a1a1e" r={0.4} /></mesh></group>
      <mesh position={[0.2, 0.12, 0.045]}><circleGeometry args={[0.035, 20]} /><meshBasicMaterial color={flip > 0.5 ? "#ff3a2a" : "#3aff7a"} toneMapped={false} /></mesh>
      <pointLight position={[0, 0.3, 0.5]} intensity={1.4} distance={1.6} color="#dfe8ff" />
    </group>
  </Studio>;
}}</Stage>;

// 17 · una sola presión: un pulgar entra de costado y hunde el botón grande de la llave; el contador mecánico gira de 0 a 1
const Thumb: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => <group position={p} scale={s}>
  <mesh position={[0.62, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.11, 0.12, 0.5, 20]} /><Mat c="#2c3e5a" r={0.85} /></mesh>
  <RB p={[0.3, 0.0, 0]} s={[0.26, 0.2, 0.26]} rad={0.08} c="#d9b49a" r={0.6} />
  <mesh position={[0.08, -0.02, 0]} rotation={[0, 0, Math.PI / 2 - 0.25]}><capsuleGeometry args={[0.055, 0.2, 8, 16]} /><Mat c="#d9b49a" r={0.6} /></mesh>
  <mesh position={[-0.03, -0.045, 0.0]} rotation={[0, 0, -0.25]} scale={[1, 0.5, 0.9]}><sphereGeometry args={[0.045, 14, 14]} /><Mat c="#ead0c0" r={0.4} /></mesh>
</group>;
export const D3Onecoin: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const inn = sm(tt, 0.4, 1.2), press = sm(tt, 1.3, 1.55) * (1 - sm(tt, 2.1, 2.5)), roll = sm(tt, 1.55, 2.3);
  const dg = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => useTxt([`${d}`], 256, 256, "#f6f3ec", "#151515", 200, "Courier New"));
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [0.05, 0.75, 1.45], l: [0.05, 0.2, 0], fov: 40 }, { t: 8, p: [0.2, 0.72, 1.3], l: [0.1, 0.2, 0], fov: 40, arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.8]} s={[6, 3.4, 0.1]} kind="drywall" />
    <RB p={[-0.25, 0.05, 0]} s={[0.36, 0.1, 0.62]} rad={0.05} c="#1a1a1e" r={0.35} />
    {[-0.17, 0.0, 0.17].map((z, i) => <mesh key={i} position={[-0.25, 0.105 - (i === 1 ? 0.025 * press : 0), z]}><cylinderGeometry args={[0.06, 0.06, 0.03, 24]} /><Mat c={i === 1 ? "#3a3c42" : "#2a2c31"} r={0.5} e={i === 1 ? "#ffb257" : "#000"} ei={i === 1 ? 0.8 * press : 0} /></mesh>)}
    <mesh position={[-0.25, 0.102, -0.27]}><sphereGeometry args={[0.012, 10, 10]} /><meshBasicMaterial color="#ff3a2a" toneMapped={false} transparent opacity={0.2 + 0.8 * press} /></mesh>
    <Thumb p={[-0.25 + 0.06 + 0.9 * (1 - inn), 0.19 - 0.03 * press, 0]} s={1} />
    <group position={[0.55, 0.32, -0.25]}>
      <RB p={[0, 0, -0.05]} s={[0.34, 0.42, 0.22]} rad={0.03} c="#2a2c31" r={0.5} />
      <group position={[0, 0, 0.07]} rotation={[-roll * (Math.PI * 2 / 10), 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.16, 0.16, 0.24, 30]} /><Mat c="#f6f3ec" r={0.7} /></mesh>
        {dg.map((m, d) => { const a = d * (Math.PI * 2 / 10); return <mesh key={d} position={[0, Math.sin(a) * 0.162, Math.cos(a) * 0.162]} rotation={[-a, 0, 0]}><planeGeometry args={[0.2, 0.09]} /><meshBasicMaterial map={m} /></mesh>; })}
      </group>
      <RB p={[0, 0.115, 0.17]} s={[0.3, 0.04, 0.04]} rad={0.01} c="#2a2c31" r={0.5} /><RB p={[0, -0.115, 0.17]} s={[0.3, 0.04, 0.04]} rad={0.01} c="#2a2c31" r={0.5} />
    </group>
  </Studio>;
}}</Stage>;

// 18 · dos perfiles: dos asientos en la cabina; el de él apagado, el de ella con el destrabe todavía prendido
export const D3Twoseats: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const a = useTxt(["HIS · OFF"], 512, 128, "#2a2c31", "#9aa0a8", 70, "Arial Black"), b = useTxt(["HERS · ON"], 512, 128, "#2a2c31", AMB, 70, "Arial Black");
  const glow = 0.5 + 0.5 * Math.sin(tt * Math.PI * 2 * 0.8);
  const Seat = ({ x, lit }: { x: number; lit: boolean }) => <group position={[x, 0, 0]}>
    <RB p={[0, 0.45, 0]} s={[0.55, 0.14, 0.55]} rad={0.06} c={lit ? "#6a4a3a" : "#3a3a3e"} r={0.8} />
    <RB p={[0, 0.85, -0.25]} s={[0.55, 0.75, 0.14]} rad={0.07} c={lit ? "#6a4a3a" : "#3a3a3e"} r={0.8} />
    <RB p={[0, 1.32, -0.25]} s={[0.3, 0.2, 0.12]} rad={0.05} c={lit ? "#6a4a3a" : "#3a3a3e"} r={0.8} />
    {lit && <mesh position={[0, 0.85, -0.17]}><planeGeometry args={[0.5, 0.7]} /><meshBasicMaterial color={AMB} transparent opacity={0.15 * glow} toneMapped={false} /></mesh>}
  </group>;
  return <Studio tt={tt} floor="none" warm={0.8} photo={0.15} keys={[{ t: 0, p: [0, 1.45, 2.7], l: [0, 0.7, 0], fov: 42 }, { t: 10, p: [0.3, 1.35, 2.5], l: [0.1, 0.7, 0], arc: 0.03 }]}>
    <RB p={[0, 0.3, -0.1]} s={[1.8, 0.2, 1.0]} rad={0.02} c="#2a2c31" r={0.8} />
    <Seat x={-0.45} lit={false} /><Seat x={0.45} lit />
    <mesh position={[-0.45, 0.3, 0.41]}><planeGeometry args={[0.6, 0.15]} /><meshBasicMaterial map={a} /></mesh>
    <mesh position={[0.45, 0.3, 0.41]}><planeGeometry args={[0.6, 0.15]} /><meshBasicMaterial map={b} toneMapped={false} /></mesh>
  </Studio>;
}}</Stage>;

// 19 · las herramientas del asiento de atrás: las cajas salen volando de la cabina; la camioneta queda trabada detrás del tractor
export const D3Toolstack: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const out = (i: number) => sm(tt, 0.8 + i * 0.5, 2.0 + i * 0.5), park = sm(tt, 4.4, 6.0);
  return <Studio tt={tt} floor="concrete" warm={0.85} photo={0} keys={[{ t: 0, p: [2.0, 1.6, 2.6], l: [0, 0.6, 0], fov: 42 }, { t: 9, p: [2.2, 1.5, 2.2], l: [0, 0.6, -0.4], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -2.8]} s={[8, 3.4, 0.1]} kind="drywall" />
    <Truck3 p={[0, 0, 0 - 0.9 * park]} s={0.95} door={1 - park} />
    {[0, 1, 2].map((i) => { const k = out(i); return <RB key={i} p={[0.5 + 1.2 * k, 0.7 + 0.5 * Math.sin(Math.PI * k) - 0.55 * k + i * 0.18 * k, 0.2 + 0.4 * k]} rot={[0, k * 0.6, 0]} s={[0.4, 0.18, 0.22]} rad={0.02} c={["#c62a22", "#2a2c31", "#d8a030"][i]} r={0.4} m={0.3} />; })}
    <group position={[0, 0, -2.0]}><RB p={[0, 0.7, 0]} s={[1.2, 0.8, 1.0]} rad={0.05} c="#3a7a3a" r={0.5} /><mesh position={[0.6, 0.45, -0.2]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.45, 0.45, 0.25, 24]} /><Mat c="#1a1a1a" r={0.9} /></mesh><mesh position={[-0.6, 0.45, -0.2]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.45, 0.45, 0.25, 24]} /><Mat c="#1a1a1a" r={0.9} /></mesh></group>
  </Studio>;
}}</Stage>;

// 20 · la alarma: cuando fuerzan la puerta, ondas rojas y bocina; cuando abre la llave, silencio total
export const D3Sirentwo: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const forced = tt < 4.6, hand = sm(tt, 0.6, 1.4);
  return <Studio tt={tt} floor="concrete" warm={0.85} photo={0} keys={[{ t: 0, p: [2.4, 1.4, 2.6], l: [0, 0.6, 0], fov: 42 }, { t: 10, p: [2.6, 1.3, 2.2], l: [0.1, 0.6, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -2.4]} s={[8, 3.4, 0.1]} kind="drywall" />
    <Truck3 p={[0, 0, 0]} s={0.95} door={forced ? 0.08 * Math.abs(Math.sin(tt * 8)) * hand : sm(tt, 5.6, 6.4) * 0.8} brake={forced && Math.sin(tt * 2 * Math.PI) > 0 ? 1 : 0} />
    <Rings3 p={[0, 0.9, 0]} k={(tt * 0.6) % 1} n={3} r={1.8} col={RED} rot={[0, 0, 0]} op={forced && tt > 1.2 ? 0.35 : 0} />
    {forced ? <group position={[0.75, 0.75, 0.4]}><RB s={[0.5, 0.04, 0.04]} rad={0.015} c="#b8302a" m={0.5} r={0.4} /></group> : <group position={[0.85, 0.75, 0.6]} rotation={[0.3, 0, 0]}><Fob3 s={0.45} led={1} /></group>}
  </Studio>;
}}</Stage>;

// 21 · el manual en la tormenta: nieve contra la ventana, el libro abierto en la mesa pasa páginas hasta la que importa
export const D3Snowmanual: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const flips = c01((tt - 0.6) / 4.5) * 6, page = useTxt(["PASSIVE ENTRY", "pg. 214", "", "To disable:", "hold LOCK 5 sec"], 512, 512, "#fbfaf6", "#1e2026", 50);
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [0, 1.4, 1.5], l: [0, 0.7, -0.2], fov: 42 }, { t: 9, p: [0.2, 1.3, 1.3], l: [0, 0.65, -0.1], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.7]} s={[6, 3.4, 0.1]} kind="drywall" />
    <mesh position={[0, 1.4, -0.64]}><planeGeometry args={[1.2, 0.8]} /><meshBasicMaterial color="#9fb0c4" /></mesh>
    {[...Array(40)].map((_, i) => <mesh key={i} position={[-0.55 + rnd(i) * 1.1, 1.8 - ((tt * (0.3 + 0.3 * rnd(i, 2)) + rnd(i, 3)) % 1) * 0.8, -0.62]}><circleGeometry args={[0.01 + 0.01 * rnd(i, 4), 8]} /><meshBasicMaterial color="#ffffff" /></mesh>)}
    <RB p={[0, 0.5, 0]} s={[1.6, 0.06, 0.9]} rad={0.01} c="#7a4a2a" r={0.6} />
    <group position={[0, 0.55, 0.05]}>
      <RB p={[-0.22, 0, 0]} s={[0.42, 0.03, 0.56]} rad={0.004} c="#f6f3ec" r={0.9} />
      <mesh position={[0.22, 0.017, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.42, 0.56]} /><meshStandardMaterial map={page} roughness={1} envMapIntensity={0.2} /></mesh>
      {flips < 5.9 && <group position={[0, 0.02, 0]} rotation={[0, 0, -Math.PI * (flips % 1)]}><mesh position={[0.21, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.42, 0.56]} /><meshStandardMaterial color="#f2ede2" side={2} /></mesh></group>}
    </group>
  </Studio>;
}}</Stage>;

// 22 · la de enfrente: dos casas cara a cara con dos camionetas iguales; pasa febrero en el almanaque y una entrada queda vacía
export const D3Neighbortrucks: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const day = Math.min(28, 1 + Math.floor(c01((tt - 0.5) / 5) * 28)), gone = sm(tt, 5.6, 6.6);
  const cal = useTxt(["FEB", `${day}`], 256, 256, "#f6f3ec", "#c62a22", 96, "Arial Black");
  return <Studio tt={tt} floor="concrete" warm={0.85} photo={0} keys={[{ t: 0, p: [0, 2.8, 4.0], l: [0, 0.5, 0], fov: 42 }, { t: 9, p: [0.4, 2.6, 3.7], l: [0, 0.5, 0], arc: 0.03 }]}>
    <RB p={[0, 0.005, 0]} s={[1.2, 0.01, 6]} rad={0.002} c="#3a3c40" r={0.9} />
    <Home3 p={[-2.0, 0, -0.2]} rot={[0, Math.PI / 2, 0]} s={0.9} />
    <Home3 p={[2.0, 0, -0.2]} rot={[0, -Math.PI / 2, 0]} s={0.9} />
    <Truck3 p={[-1.1, 0, 0.6]} rot={[0, Math.PI / 2, 0]} s={0.6} col="#c9ced4" />
    <group position={[1.1, 0, 0.6 + 4 * gone]}><Truck3 rot={[0, -Math.PI / 2, 0]} s={0.6} col="#c9ced4" /></group>
    <group position={[0, 1.05, -0.7]}><RB s={[0.5, 0.5, 0.03]} rad={0.01} c="#f6f3ec" r={0.8} /><mesh position={[0, 0, 0.016]}><planeGeometry args={[0.46, 0.46]} /><meshBasicMaterial map={cal} /></mesh></group>
  </Studio>;
}}</Stage>;

// 23 · el hábito: la bolsita cuelga del clavo junto a la puerta; cada noche se usa, la lengüeta de cuero se oscurece y brilla, y en la pared se suman las rayitas
export const D3Wornpath: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const k = c01((tt - 0.6) / 6), n = Math.floor(k * 14), sw = 0.12 * Math.sin(tt * 7) * Math.exp(-((tt * 2.333) % 1) * 3);
  const L = (a: number, b: number, u: number) => Math.round(a + (b - a) * u).toString(16).padStart(2, "0"), tab = `#${L(0xc0, 0x4a, k)}${L(0x8a, 0x2a, k)}${L(0x58, 0x16, k)}`;
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} night={0.3} keys={[{ t: 0, p: [0.15, 1.35, 1.9], l: [0.1, 1.2, -0.6], fov: 42 }, { t: 10, p: [0.3, 1.32, 1.75], l: [0.15, 1.2, -0.6], fov: 42, arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.75]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Door3 p={[1.15, 0, -0.69]} col="#5a3a2a" lock={false} frame />
    <mesh position={[-0.2, 1.55, -0.66]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.12, 10]} /><Mat c="#9aa0a8" m={1} r={0.3} /></mesh>
    <group position={[-0.2, 1.55, -0.62]} rotation={[0, 0, sw]}>
      <mesh position={[0, -0.04, 0]}><torusGeometry args={[0.035, 0.008, 8, 20]} /><Mat c="#6a4a2e" r={0.7} /></mesh>
      <group position={[0, -0.32, 0]}><Pouch3 s={1.25} col="#6a6a62" /></group>
      <RB p={[0, -0.62, 0.05]} s={[0.12, 0.16, 0.02]} rad={0.02} c={tab} r={0.85 - 0.55 * k} m={0.1 * k} />
    </group>
    <pointLight position={[-0.2, 1.3, 0.1]} intensity={0.6 + 0.8 * k} distance={1.3} color="#ffd8a0" />
    {[...Array(14)].map((_, i) => { const g = Math.floor(i / 5), j = i % 5, on = i < n; if (!on) return null;
      return j < 4 ? <RB key={i} p={[-1.25 + g * 0.3 + j * 0.05, 1.3, -0.69]} s={[0.012, 0.16, 0.005]} rad={0.003} c="#3a3a3e" r={0.9} />
        : <RB key={i} p={[-1.25 + g * 0.3 + 0.075, 1.3, -0.688]} rot={[0, 0, -0.95]} s={[0.012, 0.25, 0.005]} rad={0.003} c="#3a3a3e" r={0.9} />; })}
  </Studio>;
}}</Stage>;

// 24 · mala y buena: una ficha gruesa salta y gira en el aire; de un lado la cara roja (llave colgada junto a la puerta), del otro la verde (llave adentro de la bolsita); cae verde
export const D3Badgood: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const f = c01((tt - 0.8) / 2.6), y = 0.48 + 0.9 * Math.sin(Math.PI * f), land = tt > 3.4 ? spr(tt, 3.4, 9, 0.4) : 0, a = 7 * Math.PI * (1 - (1 - f) * (1 - f));
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [0, 1.0, 2.3], l: [0, 0.7, 0], fov: 42 }, { t: 9, p: [0.25, 0.98, 2.1], l: [0, 0.7, 0], fov: 42, arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.9]} s={[6, 3.4, 0.1]} kind="drywall" />
    <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={1 - 0.4 * Math.sin(Math.PI * f)}><circleGeometry args={[0.4, 32]} /><meshBasicMaterial color="#000" transparent opacity={0.22} /></mesh>
    <group position={[0, y - 0.04 * land, 0]} rotation={[0, a, 0]} scale={[1, 1 + 0.04 * land, 1]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.44, 0.44, 0.12, 48]} /><Mat c="#c9ced4" m={0.9} r={0.25} /></mesh>
      <mesh position={[0, 0, 0.061]}><circleGeometry args={[0.4, 48]} /><Mat c="#c62a22" r={0.45} /></mesh>
      <group position={[0, 0, 0.07]}>
        <RB p={[0.1, 0, 0]} s={[0.16, 0.34, 0.02]} rad={0.01} c="#f6f3ec" r={0.6} />
        <mesh position={[-0.16, 0.1, 0.01]}><torusGeometry args={[0.05, 0.015, 8, 20]} /><Mat c="#f2c230" m={0.9} r={0.25} /></mesh>
        <RB p={[-0.16, -0.02, 0.01]} s={[0.025, 0.16, 0.02]} rad={0.005} c="#f2c230" m={0.9} r={0.25} />
      </group>
      <mesh position={[0, 0, -0.061]} rotation={[0, Math.PI, 0]}><circleGeometry args={[0.4, 48]} /><Mat c="#2a8a4a" r={0.45} /></mesh>
      <group position={[0, -0.02, -0.08]} rotation={[0, Math.PI, 0]}><Pouch3 s={0.55} col="#e8e2d4" /></group>
    </group>
  </Studio>;
}}</Stage>;

// 25 · el doblez: primer plano de la bolsita que se abre y se cierra; en la línea del pliegue la tela se gasta y por la rendija escapan rayos de luz
export const D3Creasecrack: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const op = 0.5 - 0.5 * Math.cos(tt * 2.6), wear = c01((tt - 0.5) / 6), ray = wear * (1 - op);
  return <Studio tt={tt} floor="wood" warm={0.8} photo={0} night={0.4} keys={[{ t: 0, p: [0, 0.6, 1.05], l: [0, 0.32, 0], fov: 40 }, { t: 10, p: [0.15, 0.58, 0.95], l: [0, 0.32, 0], fov: 40, arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.9]} s={[6, 3.4, 0.1]} kind="drywall" />
    <group position={[0, 0.3, 0]} rotation={[0.25, 0, 0]}><Pouch3 s={2.2} open={op} col="#6a6a62" /></group>
    <mesh position={[0, 0.535, 0.07]} rotation={[0.25, 0, 0]}><planeGeometry args={[0.5, 0.012 + 0.012 * wear]} /><meshBasicMaterial color="#d8d2c4" transparent opacity={0.25 + 0.6 * wear} /></mesh>
    {[...Array(7)].map((_, i) => { const a = -0.75 + i * 0.25; return <mesh key={i} position={[Math.sin(a) * 0.32, 0.55 + Math.cos(a) * 0.3, 0.08]} rotation={[0, 0, -a]}><planeGeometry args={[0.035, 0.6]} /><meshBasicMaterial color="#bfe8ff" transparent opacity={0.45 * ray} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>; })}
    <pointLight position={[0, 0.5, 0.1]} intensity={1.6 * ray} distance={0.9} color="#bfe8ff" />
  </Studio>;
}}</Stage>;

// 26 · la sombra de la llave: la llave de la camioneta bajo la lámpara proyecta en la puerta de la casa la sombra de una llave de casa; la puerta se abre
export const D3Truckkey: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const sh = sm(tt, 1.0, 2.4), open = sm(tt, 4.0, 5.4);
  return <Studio tt={tt} floor="wood" warm={0.8} photo={0} keys={[{ t: 0, p: [0.8, 1.2, 2.2], l: [0, 1.0, -0.4], fov: 42 }, { t: 9, p: [1.0, 1.15, 1.9], l: [0, 1.0, -0.4], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.62]} s={[6, 3.4, 0.1]} kind="drywall" />
    <group position={[0, 0, -0.56]}><RB p={[-0.5, 1.05, 0]} s={[0.1, 2.2, 0.16]} rad={0.01} c="#efe9dd" r={0.6} /><RB p={[0.5, 1.05, 0]} s={[0.1, 2.2, 0.16]} rad={0.01} c="#efe9dd" r={0.6} /><group position={[-0.45, 0, 0]} rotation={[0, -open * 1.2, 0]}><RB p={[0.45, 1.02, 0]} s={[0.88, 2.02, 0.07]} rad={0.015} c="#c8b89a" r={0.6} /></group></group>
    <group position={[0, 1.15, 0.6]} rotation={[0.4, 0, 0]}><Fob3 s={0.7} /></group>
    <group position={[0, 1.2, -0.5]} scale={sh * (1 - open)}>
      <mesh position={[0, 0.18, 0]}><ringGeometry args={[0.08, 0.14, 32]} /><meshBasicMaterial color="#3a3226" transparent opacity={0.75} /></mesh>
      <mesh position={[0, -0.15, 0]}><planeGeometry args={[0.06, 0.4]} /><meshBasicMaterial color="#3a3226" transparent opacity={0.75} /></mesh>
      {[0, 1].map((j) => <mesh key={j} position={[0.05, -0.28 + j * 0.09, 0]}><planeGeometry args={[0.07, 0.04]} /><meshBasicMaterial color="#3a3226" transparent opacity={0.75} /></mesh>)}
    </group>
    <spotLight position={[0, 2.4, 1.6]} angle={0.4} penumbra={0.5} intensity={10} distance={6} color="#fff1d0" />
  </Studio>;
}}</Stage>;

// 27 · el recital: telón rojo que se abre; mientras aplauden, en otra parte un tráiler ajeno se carga de a uno: cortadora, freezer, herramientas
export const D3Recital: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const cur = sm(tt, 0.4, 1.8), load = (i: number) => sm(tt, 2.6 + i * 1.6, 3.8 + i * 1.6);
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [0, 1.3, 3.4], l: [0, 0.9, 0], fov: 44 }, { t: 10, p: [0.4, 1.25, 3.1], l: [0.3, 0.8, 0], arc: 0.03 }]}>
    <group position={[-1.2, 0, -0.4]}>
      <RB p={[0, 0.2, 0]} s={[1.8, 0.4, 0.8]} rad={0.02} c="#6a4a32" r={0.7} />
      {[-1, 1].map((sd) => <RB key={sd} p={[sd * (0.45 + 0.45 * cur), 1.2, -0.3]} s={[0.9 * (1 - 0.6 * cur) + 0.05, 2.0, 0.06]} rad={0.02} c="#9a1e1e" r={0.9} />)}
      <Person3 p={[0, 0.4, -0.1]} s={0.6} col="#e8b8d0" />
      {[0, 1, 2, 3].map((i) => <Person3 key={i} p={[-0.6 + i * 0.4, 0, 0.8]} yaw={Math.PI} s={0.7} col="#3a4a5e" arm={Math.abs(Math.sin(tt * 6 + i))} />)}
    </group>
    <group position={[1.5, 0, -0.2]}>
      <RB p={[0, 0.3, 0]} s={[1.2, 0.1, 0.8]} rad={0.01} c="#5a5c60" m={0.6} r={0.4} />
      {[-0.4, 0.4].map((x, i) => <mesh key={i} position={[x, 0.15, 0.42]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.15, 0.15, 0.08, 20]} /><Mat c="#1a1a1a" r={0.9} /></mesh>)}
      {[0, 1, 2].map((i) => { const k = load(i); return <RB key={i} p={[-0.35 + i * 0.35, 0.35 + 0.15 + 0.6 * (1 - k), 0.8 * (1 - k)]} s={[0.3, 0.3, 0.4]} rad={0.03} c={["#3a7a3a", "#f2f2f0", "#c62a22"][i]} r={0.5} />; })}
    </group>
  </Studio>;
}}</Stage>;

// 28 · la cajita imantada: se abre como almeja y adentro está la llave; el contador mecánico gira de 1975 a 2025
export const D3Magnet50: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const open = sm(tt, 1.0, 2.2), yr = Math.round(1975 + 50 * sm(tt, 2.6, 6.0));
  const tx = useTxt([`${yr}`], 512, 200, "#151515", AMB, 160, "Courier New");
  return <Studio tt={tt} floor="concrete" warm={0.85} photo={0} keys={[{ t: 0, p: [0, 1.0, 1.6], l: [0, 0.55, 0], fov: 40 }, { t: 9, p: [0.25, 0.95, 1.4], l: [0, 0.55, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    <group position={[-0.35, 0.35, 0]}>
      <RB p={[0, 0, 0]} s={[0.45, 0.08, 0.3]} rad={0.02} c="#2a2c31" r={0.5} />
      <group position={[0, 0.04, -0.15]} rotation={[-1.4 * open, 0, 0]}><RB p={[0, 0.04, 0.15]} s={[0.45, 0.08, 0.3]} rad={0.02} c="#2a2c31" r={0.5} /></group>
      <group position={[0, 0.06, 0.02]} rotation={[0, 0.3, 0]}><RB s={[0.06, 0.02, 0.18]} rad={0.008} c="#c9ced4" m={1} r={0.25} /><mesh position={[0, 0, -0.12]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.04, 0.012, 8, 20]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh></group>
    </group>
    <group position={[0.45, 0.7, -0.4]}><RB s={[0.7, 0.28, 0.08]} rad={0.03} c="#151515" r={0.5} /><mesh position={[0, 0, 0.041]}><planeGeometry args={[0.64, 0.24]} /><meshBasicMaterial map={tx} toneMapped={false} /></mesh></group>
  </Studio>;
}}</Stage>;

// 29 · la tapita del puerto: debajo del tablero, la linterna ilumina el enchufe del mecánico; la tapa de acero sube, lo tapa y el bulón entra girando
export const D3Plugcap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const cap = spr(tt, 1.6, 6, 0.5), bolt = sm(tt, 2.8, 4.2), clk = c01((tt - 4.2) / 0.8);
  return <Studio tt={tt} floor="none" warm={0.7} photo={0} bg="#2b2620" keys={[{ t: 0, p: [0.1, 0.55, 1.4], l: [0, 0.85, 0], fov: 40 }, { t: 9, p: [0.25, 0.55, 1.25], l: [0, 0.85, 0], fov: 40, arc: 0.03 }]}>
    <RB p={[0, 1.08, -0.2]} s={[2.4, 0.16, 0.9]} rad={0.04} c="#2a2a2e" r={0.85} />
    <RB p={[0, 0.88, -0.35]} s={[2.4, 0.3, 0.06]} rad={0.02} c="#34343a" r={0.85} />
    <group position={[0, 0.93, -0.25]}>
      <RB s={[0.5, 0.18, 0.14]} rad={0.03} c="#1a1a1e" r={0.5} />
      <RB p={[0, 0, 0.04]} s={[0.42, 0.11, 0.08]} rad={0.015} c="#0a0a0c" r={0.7} />
      {[...Array(16)].map((_, i) => <mesh key={i} position={[-0.17 + (i % 8) * 0.048, i < 8 ? 0.022 : -0.022, 0.07]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 0.03, 8]} /><Mat c="#d8b04a" m={1} r={0.25} /></mesh>)}
    </group>
    <pointLight position={[0.3, 0.6, 0.5]} intensity={2.2} distance={1.6} color="#fff2d8" />
    <mesh position={[0.05, 0.8, 0.25]} rotation={[-1.1, 0, 0.3]}><coneGeometry args={[0.32, 0.9, 32, 1, true]} /><meshBasicMaterial color="#fff2d8" transparent opacity={0.08} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} /></mesh>
    <group position={[0, 0.93 - 0.55 * (1 - cap), -0.13]}>
      <RB s={[0.6, 0.26, 0.05]} rad={0.02} c="#c9ced4" m={1} r={0.22} />
      <group position={[0.22, 0, 0.03 + 0.12 * (1 - bolt)]} rotation={[Math.PI / 2, bolt * 9, 0]}><mesh><cylinderGeometry args={[0.035, 0.035, 0.02, 6]} /><Mat c="#9aa0a8" m={1} r={0.3} /></mesh><mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.014, 0.014, 0.1, 10]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh></group>
    </group>
    {clk > 0 && clk < 1 && <Rings3 p={[0.22, 0.93, -0.08]} k={clk} n={2} r={0.25} col="#ffffff" rot={[0, 0, 0]} op={1 - clk} />}
  </Studio>;
}}</Stage>;

// 30 · dos interruptores en serie: el motor necesita los dos; uno escondido corta la corriente aunque el otro esté prendido
export const D3Series: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const s1 = sm(tt, 1.0, 1.4), s2 = tt < 5.2 ? 0 : 1, flow = s1 * s2;
  const Sw = ({ x, on, col }: { x: number; on: number; col: string }) => <group position={[x, 0.6, 0]}><RB s={[0.3, 0.42, 0.06]} rad={0.03} c={col} r={0.5} /><group position={[0, 0, 0.04]} rotation={[0.5 - 1.0 * on, 0, 0]}><RB p={[0, 0, 0.04]} s={[0.08, 0.16, 0.08]} rad={0.02} c="#ecebe6" r={0.5} /></group></group>;
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [0, 1.3, 2.3], l: [0, 0.6, 0], fov: 42 }, { t: 10, p: [0.3, 1.2, 2.1], l: [0, 0.6, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    <RB p={[-1.4, 0.4, 0]} s={[0.3, 0.5, 0.25]} rad={0.03} c="#2a2c31" r={0.5} />
    <Sw x={-0.6} on={s1} col="#3a3d44" /><Sw x={0.2} on={s2} col="#5a4a3a" />
    <group position={[1.1, 0.5, 0]}><RB s={[0.5, 0.4, 0.4]} rad={0.05} c="#7a7f86" m={0.7} r={0.35} /><group rotation={[0, 0, tt * 18 * flow]} position={[0, 0, 0.21]}><RB s={[0.3, 0.04, 0.02]} rad={0.01} c="#2a2c31" r={0.4} /></group></group>
    {[[-1.25, -0.75], [-0.45, 0.05], [0.35, 0.85]].map(([a, b], i) => <RB key={i} p={[(a + b) / 2, 0.6, 0]} s={[b - a, 0.025, 0.025]} rad={0.008} c={i === 0 || (i === 1 && s1 > 0.5) || (i === 2 && flow > 0.5) ? "#d4a84a" : "#5a5c60"} m={0.8} r={0.3} />)}
  </Studio>;
}}</Stage>;

export const HEROES_3B = { menudive: D3Menudive, onecoin: D3Onecoin, twoseats: D3Twoseats, toolstack: D3Toolstack, sirentwo: D3Sirentwo, snowmanual: D3Snowmanual, neighbortrucks: D3Neighbortrucks, wornpath: D3Wornpath, badgood: D3Badgood, creasecrack: D3Creasecrack, truckkey: D3Truckkey, recital: D3Recital, magnet50: D3Magnet50, plugcap: D3Plugcap, series: D3Series };
