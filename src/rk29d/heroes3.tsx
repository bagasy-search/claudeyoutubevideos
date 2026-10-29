// rk29d · componentes 3D 1-15 (29-oct). Cada uno UNA vez en toda la tanda (registro D:/rtmp/rk29_COMPONENTES.md).
// La camioneta que se va de noche con su propia llave: baldosas, escarcha, marcas, la cámara de Dale, la nota del parasol…
// Vara EVALUADOR (rk29b): objeto grande que se entiende sin leer, pared/piso claro, cámara cerca, acción con peso.
import React from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { Studio, Wall3, Fob3, Rings3, RB, Mat, sm, spr, c01, rnd } from "./studio3d";
import { AMB, GRN, useTxt, Door3, Hand3 } from "./lock3d";
import { Truck3, Home3, Hook3, Grille3 } from "./truck3d";

type P = { t: number; h: H };

// 1 · once pasos: una bota pisa baldosa por baldosa del gancho a la puerta; cada una se enciende con su número grande y la luz llega a la manija
const NumTile: React.FC<{ n: number; p: [number, number, number]; on: number }> = ({ n, p, on }) => {
  const m = useTxt([`${n}`], 256, 256, "#00000000", on > 0.5 ? "#7a3a0a" : "#9a9284", 200, "Arial Black");
  return <mesh position={p} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.3]} /><meshBasicMaterial map={m} transparent /></mesh>;
};
export const D3Lantern: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const k = c01((tt - 0.6) / 5.5) * 10, i = Math.min(10, Math.floor(k)), u = k - i, n = Math.min(11, i + (u > 0.55 || k >= 10 ? 1 : 0) + (k >= 10 ? 0 : 0));
  const X = (j: number) => -2.0 + j * 0.42, bx = X(i) + 0.42 * (k >= 10 ? 0 : sm(u, 0.1, 0.6)), by = 0.03 + (k >= 10 ? 0 : 0.18 * Math.sin(Math.PI * sm(u, 0.1, 0.6)));
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} night={0.35} keys={[{ t: 0, p: [-1.4, 1.7, 2.3], l: [-0.3, 0.2, -0.3], fov: 44 }, { t: 9, p: [-0.6, 1.6, 2.2], l: [0.4, 0.2, -0.3], fov: 44, arc: 0.03 }]}>
    <Wall3 p={[0, 1.4, -0.9]} s={[7, 3, 0.1]} kind="drywall" />
    <Hook3 p={[-2.0, 1.2, -0.83]} s={2} />
    <Door3 p={[2.4, 0, -0.84]} col="#5a3a2a" lock={false} frame />
    {[...Array(11)].map((_, j) => { const on = j < n ? 1 : 0; return <group key={j}>
      <RB p={[X(j), 0.012, -0.3]} s={[0.4, 0.024, 0.6]} rad={0.004} c={on ? "#f2c070" : "#d8d2c4"} r={0.7} e={on ? "#ffb257" : "#000"} ei={on ? 0.35 : 0} />
      <NumTile n={j + 1} p={[X(j), 0.026, -0.3]} on={on} />
    </group>; })}
    <group position={[bx, by, -0.08]} rotation={[0, 0, -0.25 * Math.sin(Math.PI * sm(u, 0.1, 0.6)) * (k >= 10 ? 0 : 1)]}>
      <RB p={[0, 0.03, 0]} s={[0.34, 0.06, 0.15]} rad={0.025} c="#2a1e16" r={0.8} />
      <RB p={[-0.06, 0.17, 0]} s={[0.2, 0.24, 0.14]} rad={0.04} c="#6a4a2e" r={0.7} />
      <RB p={[0.09, 0.09, 0]} s={[0.16, 0.1, 0.14]} rad={0.04} c="#6a4a2e" r={0.7} />
    </group>
    <pointLight position={[bx, 0.6, 0.1]} intensity={1.6} distance={1.4} color="#ffcf80" />
    {n >= 11 && <pointLight position={[2.1, 1.05, -0.45]} intensity={2.5 * sm(tt, 6.1, 6.8)} distance={1.2} color="#ffcf80" />}
  </Studio>;
}}</Stage>;

// 2 · la mancha: en primer plano, la mancha de aceite brilla sobre la escarcha de la entrada; la helada se derrite alrededor, las huellas se van y la camioneta sale de cuadro
export const D3Oilspot: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const melt = sm(tt, 0.8, 5.0), go = sm(tt, 0.4, 4.0);
  return <Studio tt={tt} floor="none" warm={0.7} photo={0} keys={[{ t: 0, p: [0.35, 0.75, 1.7], l: [0, 0.05, -0.9], fov: 42 }, { t: 9, p: [0.5, 0.7, 1.55], l: [0, 0.05, -1.0], fov: 42, arc: 0.03 }]}>
    <RB p={[0, -0.02, -2.0]} s={[2.6, 0.04, 6]} rad={0.004} c="#eef3f7" r={0.9} />
    <RB p={[2.0, -0.02, -2.0]} s={[1.4, 0.04, 6]} rad={0.004} c="#7a8a6a" r={1} />
    <RB p={[-2.0, -0.02, -2.0]} s={[1.4, 0.04, 6]} rad={0.004} c="#7a8a6a" r={1} />
    {[-0.48, 0.48].map((x, i) => <mesh key={i} position={[x, 0.003, -2.3]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.24, 5]} /><meshStandardMaterial color="#5a6066" roughness={1} /></mesh>)}
    {[...Array(14)].map((_, i) => <mesh key={i} position={[-0.48 + (i % 2) * 0.96, 0.005, -0.1 - Math.floor(i / 2) * 0.32]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.2, 0.06]} /><meshBasicMaterial color="#3a3f44" /></mesh>)}
    <mesh position={[0.05, 0.006, 0.1]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.3, 1, 1]}><circleGeometry args={[0.32, 48]} /><meshStandardMaterial color="#141418" metalness={0.7} roughness={0.04} envMapIntensity={2} /></mesh>
    <mesh position={[-0.02, 0.007, 0.06]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.12, 0.2, 40]} /><meshBasicMaterial color="#5a3a7a" transparent opacity={0.35} /></mesh>
    {[...Array(60)].map((_, i) => { const a = rnd(i) * Math.PI * 2, r = 0.5 + rnd(i, 2) * 0.9, sc = Math.max(0.001, 1 - melt * (1.6 - r * 0.6)); return <mesh key={i} position={[0.05 + Math.cos(a) * r * 1.2, 0.008, 0.1 + Math.sin(a) * r * 0.7]} rotation={[-Math.PI / 2, 0, rnd(i, 3) * 3]} scale={sc}><circleGeometry args={[0.025 + 0.025 * rnd(i, 4), 6]} /><meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.2} /></mesh>; })}
    <Truck3 p={[0, 0, -2.4 - 4.5 * go]} rot={[0, Math.PI, 0]} s={0.9} brake={1} />
  </Studio>;
}}</Stage>;

// 3 · marca por marca: seis parrillas grandes bajan con resorte, cada una con su emblema de metal; la última, la tuya, gira hacia cámara
const Badge: React.FC<{ k: number; p: [number, number, number] }> = ({ k, p }) => <group position={p}>
  {k === 0 && <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.02, 32]} /><Mat c="#e8ecf0" m={1} r={0.15} /></mesh>}
  {k === 1 && <mesh scale={[1.6, 1, 1]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.02, 32]} /><Mat c="#2a4a8a" m={0.6} r={0.25} /></mesh>}
  {k === 2 && <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]}><cylinderGeometry args={[0.08, 0.08, 0.02, 4]} /><Mat c="#c9ced4" m={1} r={0.15} /></mesh>}
  {k === 3 && <><RB s={[0.16, 0.04, 0.02]} rad={0.01} c="#d4a84a" m={1} r={0.2} /><RB s={[0.04, 0.12, 0.02]} rad={0.01} c="#d4a84a" m={1} r={0.2} /></>}
  {k === 4 && <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.05, 0.02, 5]} /><Mat c="#9aa0a8" m={1} r={0.2} /></mesh>}
  {k === 5 && <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.08, 0.08, 0.025, 32]} /><Mat c="#c62a22" m={0.4} r={0.3} /></mesh>}
</group>;
export const D3Badgerow: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const cols = ["#c9ced4", "#d4a84a", "#9aa0a8", "#c9ced4", "#b8b8b0", "#f2c230"], turn = sm(tt, 5.0, 6.0);
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [0, 1.15, 3.6], l: [0, 1.0, 0], fov: 42 }, { t: 10, p: [0.35, 1.12, 3.4], l: [0.2, 1.0, 0], fov: 42, arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.45]} s={[7, 3.4, 0.1]} kind="brick" />
    {[0, 1, 2, 3, 4, 5].map((i) => { const y = 1.0 + 1.6 * (1 - c01(spr(tt, 0.4 + i * 0.7, 8, 0.45))); const mine = i === 5;
      return <group key={i} position={[-1.85 + i * 0.74, y, -0.25]} rotation={[0, mine ? 1.1 * (1 - turn) : 0, 0]} scale={mine ? 1.0 + 0.15 * turn : 0.95}>
        <Grille3 s={1} col={cols[i]} />
        <Badge k={i} p={[0, 0, 0.06]} />
      </group>; })}
    <pointLight position={[1.85, 1.6, 0.6]} intensity={2.4 * turn} distance={1.8} color="#fff2c8" />
  </Studio>;
}}</Stage>;

// 4 · la cámara de Dale: en la esquina del garage, la cámara barre la entrada con su cono de luz; el piloto rojo REC titila y la barra corre hasta las 2:14
export const D3Dalecam: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const k = c01((tt - 0.6) / 6), mins = Math.floor(134 * k), yaw = 0.78 + 0.32 * Math.sin(tt * 0.9), pitch = 0.62, rec = Math.sin(tt * Math.PI * 2) > 0 ? 1 : 0.25;
  const tx = useTxt([`${Math.floor(mins / 60) + 1}:${String(mins % 60).padStart(2, "0")} AM`], 512, 160, "#151515", "#f6f3ec", 100, "Courier New");
  const fx = -2.1 + Math.sin(yaw) * 3.0, fz = -1.5 + Math.cos(yaw) * 3.0;
  return <Studio tt={tt} floor="concrete" night={0.55} photo={0} bg="#1a1c22" keys={[{ t: 0, p: [1.5, 1.7, 3.6], l: [-0.5, 1.0, -0.6], fov: 46 }, { t: 11, p: [1.7, 1.65, 3.4], l: [-0.5, 1.0, -0.7], fov: 46, arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -1.8]} s={[7, 3.4, 0.1]} kind="drywall" />
    <Wall3 p={[-2.45, 1.6, 0.5]} rot={[0, Math.PI / 2, 0]} s={[4.6, 3.4, 0.1]} kind="drywall" />
    <Truck3 p={[0.2, 0, 0.1]} rot={[0, Math.PI, 0]} s={0.95} />
    <mesh position={[fx, 0.01, fz]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.2, 1, 1]}><circleGeometry args={[0.9, 40]} /><meshBasicMaterial color="#cfe8ff" transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
    <group position={[-2.1, 2.35, -1.5]} rotation={[0, yaw, 0]}><group rotation={[pitch, 0, 0]}>
      <RB p={[0, 0, -0.08]} s={[0.26, 0.2, 0.36]} rad={0.05} c="#ecebe6" r={0.5} />
      <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.05, 24]} /><Mat c="#1a1a1a" m={0.6} r={0.1} /></mesh>
      <mesh position={[0.08, 0.07, 0.1]}><sphereGeometry args={[0.018, 12, 12]} /><meshBasicMaterial color="#ff2a1a" toneMapped={false} transparent opacity={rec} /></mesh>
      <mesh position={[0, 0, 1.55]} rotation={[-Math.PI / 2, 0, 0]}><coneGeometry args={[0.95, 2.9, 40, 1, true]} /><meshBasicMaterial color="#cfe8ff" transparent opacity={0.1} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} /></mesh>
    </group></group>
    <RB p={[-2.35, 2.3, -1.5]} s={[0.12, 0.05, 0.05]} rad={0.01} c="#d8d2c4" r={0.6} />
    <group position={[0.9, 2.25, -1.72]}>
      <RB s={[1.4, 0.5, 0.04]} rad={0.03} c="#151515" r={0.5} />
      <mesh position={[-0.5, 0.08, 0.025]}><circleGeometry args={[0.06, 24]} /><meshBasicMaterial color="#ff2a1a" toneMapped={false} transparent opacity={rec} /></mesh>
      <mesh position={[0.15, 0.08, 0.025]}><planeGeometry args={[0.9, 0.26]} /><meshBasicMaterial map={tx} toneMapped={false} /></mesh>
      <RB p={[0, -0.15, 0.03]} s={[1.2, 0.05, 0.01]} rad={0.01} c="#3a3a3e" r={0.5} />
      <RB p={[-0.6 + 0.6 * k, -0.15, 0.04]} s={[1.2 * k + 0.001, 0.05, 0.012]} rad={0.01} c="#c62a22" r={0.5} />
    </group>
  </Studio>;
}}</Stage>;

// 5 · sale con las luces apagadas: la camioneta retrocede por la entrada en la oscuridad, la casa sigue dormida
export const D3Lightsoff: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const back = 0.55 * sm(tt, 1.0, 7.5);
  return <Studio tt={tt} floor="concrete" night={0.9} photo={0} bg="#0e1018" keys={[{ t: 0, p: [3.4, 2.1, 4.8], l: [0, 0.5, 0.2], fov: 44 }, { t: 9, p: [3.6, 1.9, 5.2], l: [0, 0.5, 0.6], arc: 0.03 }]}>
    <Home3 p={[0, 0, -1.6]} s={1.3} lit={0} />
    <RB p={[0, 0.005, 0.6]} s={[1.4, 0.01, 4]} rad={0.002} c="#5a5c60" r={0.9} />
    <Truck3 p={[0, 0, -0.1 + 2.6 * back]} rot={[0, Math.PI, 0]} s={0.9} head={0} brake={0} />
    <mesh position={[1.6, 2.6, -2.0]}><circleGeometry args={[0.2, 32]} /><meshBasicMaterial color="#e8eef6" toneMapped={false} /></mesh>
    <pointLight position={[1.6, 2.6, -1.0]} intensity={1.6} distance={8} color="#b8c6ff" />
  </Studio>;
}}</Stage>;

// 6 · la nota del parasol: el parasol baja con su espejito y la nota amarilla escrita a mano cae haciendo eses hasta el tablero
export const D3Glovebox: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const vis = sm(tt, 0.5, 1.4), fall = c01((tt - 1.6) / 1.6), land = fall >= 1 ? 1 : 0;
  const note = useTxt(["SPARE KEY", "UNDER SEAT", "— Dad"], 512, 360, "#fbf0a8", "#1e3a8a", 84, "Comic Sans MS");
  const ny = 1.42 - 0.73 * fall, nx = -0.3 + 0.35 * fall + 0.08 * Math.sin(fall * 9) * (1 - fall), rz = 0.5 * Math.sin(fall * 7) * (1 - fall) + 0.08;
  return <Studio tt={tt} floor="none" warm={0.8} photo={0.15} keys={[{ t: 0, p: [0, 1.25, 1.95], l: [0, 1.08, 0], fov: 42 }, { t: 10, p: [0.15, 1.22, 1.8], l: [0, 1.05, 0], fov: 42, arc: 0.03 }]}>
    <RB p={[0, 1.78, -0.2]} s={[2.6, 0.08, 0.9]} rad={0.02} c="#3a3a3e" r={0.9} />
    <RB p={[0, 1.2, -0.66]} s={[2.6, 1.0, 0.04]} rad={0.02} c="#9ab8d6" r={0.05} m={0.2} />
    <RB p={[0, 0.58, -0.2]} s={[2.6, 0.12, 0.9]} rad={0.05} c="#2a2a2e" r={0.85} />
    <group position={[-0.3, 1.73, 0.1]} rotation={[-Math.PI / 2 * (1 - vis) + 0.12, 0, 0]}>
      <RB p={[0, -0.24, 0]} s={[0.9, 0.48, 0.05]} rad={0.03} c="#8a8478" r={0.9} />
      <RB p={[0.12, -0.24, 0.027]} s={[0.4, 0.22, 0.008]} rad={0.01} c="#e8ecf0" m={1} r={0.05} />
    </group>
    {tt > 1.5 && <group position={[nx, ny + 0.012, 0.12 + 0.15 * fall]} rotation={[land ? -Math.PI / 2 : -0.4 - 1.1 * fall, 0, rz]}>
      <mesh><planeGeometry args={[0.42, 0.3]} /><meshStandardMaterial map={note} roughness={1} envMapIntensity={0.2} side={THREE.DoubleSide} /></mesh>
    </group>}
    {land > 0 && <mesh position={[nx + 0.015, 0.643, 0.28]} rotation={[-Math.PI / 2, 0, rz]}><planeGeometry args={[0.44, 0.32]} /><meshBasicMaterial color="#000000" transparent opacity={0.25} /></mesh>}
  </Studio>;
}}</Stage>;

// 7 · las piezas valen: la camioneta se abre en vista explotada; caja, ruedas, faros y cabina se separan flotando con precio
export const D3Partsburst: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const ex = sm(tt, 1.0, 3.6);
  const p1 = useTxt(["$1,800"], 256, 96, "#f6f3ec", "#1e2026", 60, "Arial Black"), p2 = useTxt(["$2,400"], 256, 96, "#f6f3ec", "#1e2026", 60, "Arial Black"), p3 = useTxt(["$900"], 256, 96, "#f6f3ec", "#1e2026", 64, "Arial Black");
  const tag = (x: number, y: number, z: number, tex: any, i: number) => <group position={[x, y, z]} scale={c01(spr(tt, 3.8 + i * 0.5, 8, 0.5))}><RB s={[0.4, 0.15, 0.01]} rad={0.02} c="#f6f3ec" r={0.8} /><mesh position={[0, 0, 0.007]}><planeGeometry args={[0.38, 0.13]} /><meshBasicMaterial map={tex} /></mesh></group>;
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [2.4, 1.6, 2.4], l: [0, 0.5, -0.2], fov: 42 }, { t: 10, p: [2.6, 1.5, 2.0], l: [0, 0.5, -0.3], arc: 0.04 }]}>
    <Wall3 p={[0, 1.6, -2.4]} s={[8, 3.4, 0.1]} kind="drywall" />
    <Truck3 p={[0, 0.25 * ex, 0]} s={1.0} ex={ex} />
    {tag(0.9, 1.3, 0.6, p1, 0)}
    {tag(-0.9, 0.9, -1.2, p2, 1)}
    {tag(1.1, 0.6, -1.0, p3, 2)}
  </Studio>;
}}</Stage>;

// 8 · arriba de la lista: los techos del barrio se achican y la camioneta sube sola a la cima de una pila de vehículos
export const D3Cart: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const up = sm(tt, 2.0, 4.6);
  return <Studio tt={tt} floor="concrete" warm={0.85} photo={0} keys={[{ t: 0, p: [0, 1.6, 4.4], l: [0, 0.8, 0], fov: 42 }, { t: 9, p: [0.4, 2.2, 4.0], l: [0, 1.3, 0], arc: 0.03 }]}>
    {[-1.8, -0.6, 0.6, 1.8].map((x, i) => <Home3 key={i} p={[x, 0, -2.4]} s={0.7 * (1 - 0.4 * up)} />)}
    {[0, 1, 2].map((i) => <group key={i} position={[0, i * 0.42, 0]}><RB p={[0, 0.2, 0]} s={[1.5 - i * 0.2, 0.38, 0.8]} rad={0.06} c={["#7c8590", "#2a3a4e", "#c9ced4"][i]} r={0.4} m={0.4} /></group>)}
    <Truck3 p={[1.8 - 1.8 * up, 1.26 * up, 0]} rot={[0, Math.PI / 2, 0]} s={0.55} />
  </Studio>;
}}</Stage>;

// 9 · se destraba: corte de la puerta de la camioneta; la mano tira de la varilla, sube el seguro y asoma rojo en el vidrio con un clic
export const D3Pinpop: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const rod = sm(tt, 1.4, 2.0), clk = c01((tt - 2.0) / 0.8);
  return <Studio tt={tt} floor="none" warm={0.85} photo={0.15} keys={[{ t: 0, p: [0.1, 1.0, 2.5], l: [0.1, 0.85, 0], fov: 42 }, { t: 8, p: [0.3, 1.0, 2.3], l: [0.15, 0.9, 0], fov: 42, arc: 0.03 }]}>
    <RB p={[0, 0.55, -0.08]} s={[2.0, 1.1, 0.08]} rad={0.04} c="#8a2a22" r={0.3} m={0.45} />
    <RB p={[-0.15, 0.5, -0.03]} s={[1.3, 0.75, 0.02]} rad={0.02} c="#1a1a1e" r={0.95} />
    {[[0, 1.12, 2.0, 0.05], [-0.98, 1.45, 0.05, 0.7], [0.98, 1.45, 0.05, 0.7], [0, 1.78, 2.0, 0.05]].map(([x, y, w, hh], i) => <RB key={i} p={[x, y, -0.08]} s={[w, hh, 0.07]} rad={0.015} c="#6a1e18" r={0.35} m={0.4} />)}
    <mesh position={[0, 1.45, -0.09]}><planeGeometry args={[1.9, 0.62]} /><meshPhysicalMaterial color="#9ab8d6" transparent opacity={0.35} roughness={0.05} /></mesh>
    <RB p={[0.25, 0.35, 0.0]} s={[0.3, 0.22, 0.06]} rad={0.02} c="#3a3c42" m={0.7} r={0.35} />
    <group position={[0.62, 0.42 + 0.14 * rod, 0.0]}><mesh position={[0, 0.34, 0]}><cylinderGeometry args={[0.016, 0.016, 0.68, 10]} /><Mat c="#e8ecf0" m={1} r={0.2} /></mesh><RB p={[0, 0, 0]} s={[0.12, 0.04, 0.05]} rad={0.01} c="#c9ced4" m={1} r={0.25} /></group>
    <Hand3 p={[0.62, 0.36 + 0.14 * rod, 0.1]} rot={[-Math.PI / 2 - 0.2, 0, 0]} s={1.0} skin="#d9b49a" sleeve="#2c3e5a" />
    <group position={[0.62, 1.12 + 0.16 * rod, -0.06]}>
      <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.035, 0.04, 0.16, 18]} /><Mat c="#2a2c31" r={0.4} /></mesh>
      <mesh position={[0, -0.02 + 0.0, 0]}><cylinderGeometry args={[0.041, 0.041, 0.06, 18]} /><Mat c="#c62a22" r={0.4} e="#c62a22" ei={0.3 * rod} /></mesh>
    </group>
    {clk > 0 && clk < 1 && <Rings3 p={[0.62, 1.25, -0.02]} k={clk} n={2} r={0.3} col="#ffffff" rot={[0, 0, 0]} op={1 - clk} />}
  </Studio>;
}}</Stage>;

// 10 · el placar de arriba: placar en corte, adentro oscuro; la llave brillante sube al estante alto, entra en la caja de zapatos y las puertas se cierran apagando la luz
export const D3Dollhouse: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const up = sm(tt, 0.6, 2.2), lid = sm(tt, 2.5, 3.1), shut = sm(tt, 3.6, 5.0);
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} night={0.45} keys={[{ t: 0, p: [0, 1.4, 3.4], l: [0, 1.3, -0.2], fov: 44 }, { t: 9, p: [0.35, 1.45, 3.2], l: [0, 1.35, -0.2], fov: 44, arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.7]} s={[7, 3.4, 0.1]} kind="drywall" />
    <RB p={[0, 1.2, -0.5]} s={[1.3, 2.4, 0.04]} rad={0.004} c="#2a2622" r={0.9} />
    {[-1, 1].map((sd) => <RB key={sd} p={[sd * 0.65, 1.2, -0.25]} s={[0.04, 2.4, 0.5]} rad={0.004} c="#b8a888" r={0.8} />)}
    <RB p={[0, 2.42, -0.25]} s={[1.34, 0.04, 0.5]} rad={0.004} c="#b8a888" r={0.8} />
    <RB p={[0, 2.0, -0.25]} s={[1.26, 0.04, 0.46]} rad={0.004} c="#c8a878" r={0.7} />
    <RB p={[0, 1.1, -0.25]} s={[1.26, 0.04, 0.46]} rad={0.004} c="#c8a878" r={0.7} />
    {[0, 1, 2].map((j) => <RB key={j} p={[-0.35 + j * 0.3, 1.32, -0.3]} s={[0.22, 0.4, 0.3]} rad={0.01} c={["#5a6a8a", "#8a5a3a", "#6a6a6a"][j]} r={0.9} />)}
    <pointLight position={[0, 1.9, 0.1]} intensity={3.2 * (1 - shut)} distance={2.2} color="#ffe2b0" />
    <group position={[0, 2.02, -0.25]}><RB p={[0, 0.1, 0]} s={[0.56, 0.2, 0.32]} rad={0.01} c="#e8e2d4" r={0.8} /><group position={[0, 0.2 + 0.4 * (1 - lid), -0.16]} rotation={[-0.9 * (1 - lid), 0, 0]}><RB p={[0, 0.01, 0.16]} s={[0.58, 0.03, 0.34]} rad={0.005} c="#c62a22" r={0.8} /></group></group>
    {lid < 0.7 && <group position={[0, 0.85 + 1.32 * up, 0.15 - 0.4 * up]} rotation={[0, tt * 1.5, 0]}><Fob3 s={0.62} led={1} /><pointLight intensity={1.2} distance={0.8} color="#bfe8ff" /></group>}
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.66, 0, 0.02]} rotation={[0, sd * (1 - shut) * 1.35, 0]}><RB p={[-sd * 0.33, 1.2, 0]} s={[0.64, 2.4, 0.04]} rad={0.005} c="#f2ede2" r={0.7} /><RB p={[-sd * 0.6, 1.15, 0.03]} s={[0.03, 0.16, 0.03]} rad={0.01} c="#c9ced4" m={1} r={0.25} /></group>)}
  </Studio>;
}}</Stage>;

// 11 · la sumadora: dos números se marcan en las teclas de una sumadora vieja y la tira de papel sale con el total
export const D3Abacus: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const roll = sm(tt, 3.6, 5.6), press = Math.floor(c01((tt - 0.6) / 2.8) * 8);
  const tape = useTxt(["  38,000", "+ 4,200", "────────", "  42,200"], 512, 512, "#fbfaf6", "#1e2026", 64, "Courier New");
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [0, 1.4, 1.5], l: [0, 0.6, 0], fov: 42 }, { t: 10, p: [0.3, 1.3, 1.3], l: [0, 0.65, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.8]} s={[6, 3.4, 0.1]} kind="drywall" />
    <RB p={[0, 0.5, 0]} s={[0.8, 0.18, 0.6]} rad={0.05} c="#b8b2a2" r={0.5} />
    {[...Array(12)].map((_, i) => { const on = i === (press * 5) % 12 && press < 8; return <RB key={i} p={[-0.24 + (i % 4) * 0.16, 0.6 - (on ? 0.012 : 0), 0.18 - Math.floor(i / 4) * 0.13]} s={[0.12, 0.04, 0.1]} rad={0.015} c={on ? "#c62a22" : "#3a3d44"} r={0.5} />; })}
    <group position={[0, 0.62, -0.28]}><mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.05, 0.05, 0.4, 20]} /><Mat c="#f6f3ec" r={0.8} /></mesh></group>
    <mesh position={[0, 0.7 + 0.35 * roll, -0.3]} rotation={[-0.15, 0, 0]}><planeGeometry args={[0.32, 0.7 * roll + 0.001]} /><meshStandardMaterial map={tape} roughness={1} envMapIntensity={0.2} /></mesh>
  </Studio>;
}}</Stage>;

// 12 · la rueda de medir: el odómetro de la rueda de agrimensor corre de 15 a 30 mientras rueda por el pasillo
export const D3Doubler: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const k = sm(tt, 0.6, 6.0), ft = Math.round(15 + 15 * k), x = -1.4 + 2.6 * k;
  const tx = useTxt([`${ft} FT`], 256, 128, "#151515", AMB, 88, "Courier New");
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [-0.6, 1.0, 2.2], l: [-0.6, 0.4, 0], fov: 42 }, { t: 9, p: [1.0, 1.0, 2.0], l: [1.0, 0.4, 0], arc: 0.02 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[8, 3.4, 0.1]} kind="drywall" />
    <group position={[x, 0, 0]}>
      <group position={[0, 0.25, 0]} rotation={[0, 0, -k * 20]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.25, 0.25, 0.04, 40]} /><Mat c="#f2c230" r={0.5} /></mesh>{[0, 1, 2, 3].map((i) => <RB key={i} p={[0, 0, 0.025]} rot={[0, 0, i * Math.PI / 4]} s={[0.46, 0.02, 0.01]} rad={0.004} c="#1a1a1a" r={0.6} />)}</group>
      <mesh position={[-0.2, 0.7, 0]} rotation={[0, 0, 0.45]}><cylinderGeometry args={[0.015, 0.015, 1.0, 10]} /><Mat c="#2a2c31" m={0.6} r={0.4} /></mesh>
      <group position={[-0.12, 0.5, 0.03]}><RB s={[0.24, 0.12, 0.05]} rad={0.015} c="#1a1a1a" r={0.5} /><mesh position={[0, 0, 0.026]}><planeGeometry args={[0.22, 0.1]} /><meshBasicMaterial map={tx} toneMapped={false} /></mesh></group>
    </group>
  </Studio>;
}}</Stage>;

// 13 · el sensor de movimiento: la llave en corte; la bolita rueda mientras se mueve, se queda quieta y el ojito se apaga
export const D3Ballsensor: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const moving = tt < 4.0, sway = moving ? 0.25 * Math.sin(tt * 3) : 0.25 * Math.sin(4 * 3) * Math.max(0, 1 - (tt - 4) * 2);
  const eye = tt < 5.5 ? 1 : Math.max(0, 1 - (tt - 5.5) * 2);
  return <Studio tt={tt} floor="none" warm={0.85} photo={0.15} keys={[{ t: 0, p: [0, 0.9, 1.4], l: [0, 0.4, 0], fov: 40 }, { t: 10, p: [0.2, 0.85, 1.2], l: [0, 0.42, 0], arc: 0.03 }]}>
    <group position={[0, 0.4, 0]} rotation={[0, 0, sway * 0.4]}>
      <RB s={[0.9, 0.16, 1.4]} rad={0.08} c="#17181c" r={0.3} op={0.5} />
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.05, 0.05, 0.7, 20, 1, true]} /><meshPhysicalMaterial color="#e8f2ff" transmission={0.8} roughness={0.05} transparent opacity={0.4} side={2} /></mesh>
      <mesh position={[sway, 0, 0]}><sphereGeometry args={[0.04, 20, 20]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh>
      <RB p={[0.0, 0.0, 0.45]} s={[0.4, 0.06, 0.3]} rad={0.01} c="#2a6a3a" r={0.5} />
      <mesh position={[0.25, 0.09, -0.5]}><sphereGeometry args={[0.035, 16, 16]} /><meshBasicMaterial color={eye > 0.5 ? GRN : "#1a2a1e"} toneMapped={false} /></mesh>
    </group>
  </Studio>;
}}</Stage>;

// 14 · la de internet: la llave del bolsillo duerme con su lucecita apagada; la de repuesto sale de la caja de envío con el LED rojo prendido y transmitiendo
const Zz: React.FC<{ p: [number, number, number]; k: number }> = ({ p, k }) => {
  const m = useTxt(["z"], 128, 128, "#00000000", "#6a7a9a", 110, "Arial Black");
  return <>{[0, 1, 2].map((i) => { const u = (k + i / 3) % 1; return <mesh key={i} position={[p[0] + 0.12 * u, p[1] + 0.45 * u, p[2]]} scale={0.6 + 0.8 * u}><planeGeometry args={[0.12, 0.12]} /><meshBasicMaterial map={m} transparent opacity={Math.sin(Math.PI * u)} /></mesh>; })}</>;
};
export const D3Twofobs: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const box = sm(tt, 1.4, 2.4), up = sm(tt, 2.4, 3.6), blink = Math.sin(tt * Math.PI * 2 * 1.2) > 0 ? 1 : 0.25;
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [0, 1.0, 2.1], l: [0, 0.5, 0], fov: 42 }, { t: 10, p: [0.25, 0.98, 1.95], l: [0, 0.5, 0], fov: 42, arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.8]} s={[6, 3.4, 0.1]} kind="drywall" />
    <group position={[-0.6, 0.06, 0.1]} rotation={[-Math.PI / 2 + 0.35, 0, 0.2]}><Fob3 s={0.95} led={0} dim={0.6} /></group>
    <Zz p={[-0.45, 0.4, 0.1]} k={tt * 0.4} />
    <group position={[0.6, 0, 0]}><RB p={[0, 0.17, 0]} s={[0.6, 0.34, 0.46]} rad={0.01} c="#b8905a" r={0.9} /><RB p={[0, 0.17, 0.232]} s={[0.6, 0.06, 0.005]} rad={0.002} c="#d8c090" r={0.8} />
      {[-1, 1].map((sd) => <group key={sd} position={[0, 0.34, sd * 0.23]} rotation={[sd * box * 2.1, 0, 0]}><RB p={[0, 0, -sd * 0.115]} s={[0.6, 0.012, 0.23]} rad={0.002} c="#b8905a" r={0.9} /></group>)}</group>
    {box > 0.3 && <group position={[0.6, 0.3 + 0.45 * up, 0.05]} rotation={[0.25, 0.2 * Math.sin(tt), 0]}><Fob3 s={0.95} led={blink} />
      <Rings3 p={[0, 0.1, 0]} k={(tt * 0.8) % 1} n={3} r={0.5} col="#ff5a3a" rot={[0, 0, 0]} op={up} /></group>}
  </Studio>;
}}</Stage>;

// 15 · el código impreso: la guantera se abre, sale la tarjetita hacia la cámara y en el parante el teclado grande prende sus cinco botones en orden
export const D3Codecard: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const open = sm(tt, 0.5, 1.3), card = sm(tt, 1.3, 2.5), at = (i: number) => 3.0 + i * 0.6;
  const tx = useTxt(["KEYLESS CODE", "7 3 1 9 5"], 512, 256, "#f6f3ec", "#1e2026", 52, "Arial Black");
  const keys = ["1·2", "3·4", "5·6", "7·8", "9·0"].map((k) => useTxt([k], 256, 128, "#00000000", "#f6f3ec", 90, "Arial Black"));
  return <Studio tt={tt} floor="none" warm={0.85} photo={0.15} keys={[{ t: 0, p: [0.1, 1.05, 2.2], l: [0.1, 0.85, 0], fov: 42 }, { t: 11, p: [0.3, 1.05, 2.05], l: [0.15, 0.85, 0], fov: 42, arc: 0.03 }]}>
    <RB p={[-0.45, 0.6, -0.25]} s={[1.3, 0.55, 0.6]} rad={0.04} c="#3a3a3e" r={0.8} />
    <RB p={[-0.45, 0.58, 0.02]} s={[0.9, 0.36, 0.04]} rad={0.01} c="#121214" r={0.9} />
    <group position={[-0.45, 0.4, 0.06]} rotation={[open * 1.25, 0, 0]}><RB p={[0, 0.19, 0]} s={[0.92, 0.38, 0.04]} rad={0.02} c="#4a4a4e" r={0.8} /></group>
    <group position={[-0.45 + 0.1 * card, 0.6 + 0.3 * card, 0.05 + 0.55 * card]} rotation={[-0.35 * card, 0.15 * card, 0]} scale={0.8 + 0.5 * card}><RB p={[0, 0, -0.004]} s={[0.43, 0.22, 0.006]} rad={0.01} c="#d8d2c4" r={0.8} /><mesh><planeGeometry args={[0.42, 0.21]} /><meshBasicMaterial map={tx} /></mesh></group>
    <group position={[0.75, 0.95, -0.1]} scale={1.5}>
      <RB s={[0.18, 0.72, 0.07]} rad={0.03} c="#8a2a22" r={0.3} m={0.45} />
      {[0, 1, 2, 3, 4].map((i) => { const on = tt >= at(i) ? 1 : 0, f = c01((tt - at(i)) / 0.5); return <group key={i} position={[0, 0.26 - i * 0.13, 0.04]}>
        <RB s={[0.12, 0.1, 0.02]} rad={0.015} c={on ? "#e8a030" : "#2a2c31"} r={0.5} e={on ? "#ffb257" : "#000"} ei={on ? 0.6 : 0} />
        <mesh position={[0, 0, 0.012]}><planeGeometry args={[0.1, 0.05]} /><meshBasicMaterial map={keys[i]} transparent /></mesh>
        {f > 0 && f < 1 && <Rings3 p={[0, 0, 0.02]} k={f} n={1} r={0.12} col="#ffcf70" rot={[0, 0, 0]} op={1 - f} />}
      </group>; })}
    </group>
  </Studio>;
}}</Stage>;

export const HEROES_3 = { lantern: D3Lantern, oilspot: D3Oilspot, badgerow: D3Badgerow, dalecam: D3Dalecam, lightsoff: D3Lightsoff, glovebox: D3Glovebox, partsburst: D3Partsburst, cart: D3Cart, pinpop: D3Pinpop, dollhouse: D3Dollhouse, abacus: D3Abacus, doubler: D3Doubler, ballsensor: D3Ballsensor, twofobs: D3Twofobs, codecard: D3Codecard };
