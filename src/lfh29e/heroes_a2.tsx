// lfh29e · componentes únicos 8-14 (la cuchara tope, la hoja de prueba, el sol del mediodía, el revés de la hoja, dos semanas de tardes, la fila del alféizar, el camino de olor)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { SoapBottle, Leaf, Aphid, Ant, RoseBud } from "./ek";
import { Jar } from "./ck";

const PI = Math.PI;

// ---- 6:02 · HASTA UNA CUCHARADA, NUNCA MÁS: la cucharita y la cuchara bajan al frasco; la tercera rebota en una tapa de vidrio ----
export const HSpoonlimit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" key1={[-0.7, 1.5, 1.2]} warm={0.8}
  cam={{ at: [0, 0.2, 0], az: [0.25, -0.1], el: [0.22, 0.16], r: [1.17, 1.05], fov: 30 }}>{(tt) => {
  const s1 = eio(tt, 0.4, 1.4), s2 = eio(tt, 1.8, 2.8), s3 = phys(tt, 3.4, 9, 0.35), lvl = 0.55 + 0.04 * s1 + 0.06 * s2;
  const Spoon: React.FC<{ big?: boolean }> = ({ big }) => <group>
    <mesh position={[0, 0.07, 0]}><boxGeometry args={[0.008, 0.14, 0.003]} />{M.steel()}</mesh>
    <mesh scale={[1, 0.35, 1.4]}><sphereGeometry args={[big ? 0.022 : 0.014, 16, 10, 0, PI * 2, PI / 2, PI / 2]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, -0.002, 0]} scale={[1, 0.25, 1.4]}><sphereGeometry args={[big ? 0.02 : 0.012, 14, 8]} /><meshPhysicalMaterial color="#58b86a" roughness={0.15} clearcoat={1} /></mesh>
  </group>;
  return <>
    <group position={[0, 0, 0]} scale={1.4}><Jar fill={lvl} liq="#d6ecd8" lid={0} /></group>
    {/* cucharita (teaspoon) y cuchara (tablespoon) que vuelcan al frasco */}
    <group position={[-0.08, 0.3 - 0.06 * Math.sin(s1 * PI), 0]} rotation={[0, 0, -1.2 * Math.sin(s1 * PI)]} visible={s1 < 1} scale={1.7}><Spoon /></group>
    <group position={[0.08, 0.3 - 0.06 * Math.sin(s2 * PI), 0]} rotation={[0, 0, 1.2 * Math.sin(s2 * PI)]} visible={s2 > 0 && s2 < 1} scale={1.7}><Spoon big /></group>
    {/* la tercera choca contra una tapa de vidrio que aparece: «nunca más» */}
    <mesh position={[0, 0.27, 0]} visible={tt > 3.2} scale={cl((tt - 3.2) / 0.3)}><cylinderGeometry args={[0.09, 0.09, 0.008, 40]} />{M.glass({ op: 0.45, col: "#ffd0c8" })}</mesh>
    <group position={[0, 0.3 + 0.06 * (1 - cl(s3)) + 0.03 * Math.abs(Math.sin(s3 * PI * 2)) * (1 - cl((tt - 4.2) / 1)), 0]} rotation={[0, 0, 0.5]} visible={tt > 3.3} scale={1.7}><Spoon big /></group>
    {/* las burbujas que suben con cada cucharada */}
    {Array.from({ length: 14 }, (_, i) => { const u = (tt * 0.5 + rn(i, 2)) % 1; return <mesh key={i} visible={s1 > 0.5} position={[(rn(i, 3) - 0.5) * 0.07, 0.04 + u * 0.12 * lvl, (rn(i, 4) - 0.5) * 0.07]}><sphereGeometry args={[0.003 + 0.003 * rn(i, 5), 8, 6]} />{M.glass({ op: 0.5 })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 6:28 · UNA HOJA, UNA SOLA: el rociador marca una hoja con un hilito rojo; el reloj de arena da la vuelta; al día siguiente sigue verde ----
export const HTestleaf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#1f2c22" key1={[-0.7, 1.5, 1.3]}
  cam={{ at: [0, 0.17, 0], az: [-0.2, 0.15], el: [0.18, 0.1], r: [0.8, 0.7], fov: 30 }}>{(tt) => {
  const mist = eio(tt, 0.5, 1.4) * (1 - eio(tt, 1.6, 2.0)), tie = eio(tt, 2.0, 2.8), flip = eio(tt, 3.0, 4.2), ok = eio(tt, 4.6, 5.4);
  const L = [[-0.12, 0.08, 0.5], [0.0, 0.14, -0.3], [0.12, 0.08, -0.7], [-0.06, 0.2, 0.9], [0.08, 0.22, -1.1]];
  return <>
    <mesh position={[0, 0.12, -0.01]}><cylinderGeometry args={[0.005, 0.006, 0.3, 10]} /><meshStandardMaterial color="#3c6a28" /></mesh>
    {L.map(([x, y, r], i) => <group key={i} position={[x, y, 0]} rotation={[0, 0, r]}><group scale={i === 1 ? 2.2 : 1.8}><Leaf col={i === 1 ? new THREE.Color("#3f7d2a").lerp(new THREE.Color("#5ea83a"), ok).getStyle() : "#3f7d2a"} /></group></group>)}
    {/* el hilo rojo atado al pecíolo de la hoja de prueba */}
    <mesh position={[0.0, 0.14, 0.004]} scale={[tie + 0.001, 1, 1]}><torusGeometry args={[0.01, 0.0025, 8, 20]} /><meshStandardMaterial color="#c2302a" /></mesh>
    <mesh position={[0.012, 0.125, 0.004]} rotation={[0, 0, -0.6]} scale={[1, tie + 0.001, 1]}><boxGeometry args={[0.003, 0.04, 0.002]} /><meshStandardMaterial color="#c2302a" /></mesh>
    {/* el rociador y la nubecita solo sobre esa hoja */}
    <group position={[0.26, 0.2, 0.06]} rotation={[0, 0, 0.3]} visible={tt < 2.0}><SoapBottle col="#e6ecf2" cap="#2d6fd0" s={0.9} /></group>
    {Array.from({ length: 30 }, (_, i) => { const u = (tt * 2 + rn(i, 2)) % 1; return <mesh key={i} visible={mist > 0.05} position={[lerp(0.22, 0.02 + (rn(i, 3) - 0.5) * 0.05, u), lerp(0.36, 0.17 + (rn(i, 4) - 0.5) * 0.05, u), 0.02]}><sphereGeometry args={[0.0025, 6, 5]} />{M.water({ col: "#e8f6ff", op: 0.8 })}</mesh>; })}
    {/* reloj de arena: un día y una noche */}
    <group position={[-0.24, 0.28, 0.02]} rotation={[0, 0, PI * flip]}>
      <mesh position={[0, 0.03, 0]}><coneGeometry args={[0.025, 0.05, 20]} />{M.glass({ op: 0.35 })}</mesh>
      <mesh position={[0, -0.03, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.025, 0.05, 20]} />{M.glass({ op: 0.35 })}</mesh>
      <mesh position={[0, -0.04 + 0.0, 0]} rotation={[PI, 0, 0]} scale={[1, 0.6, 1]}><coneGeometry args={[0.02, 0.03, 20]} /><meshStandardMaterial color="#e2b866" /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[0, sd * 0.058, 0]}><cylinderGeometry args={[0.032, 0.032, 0.008, 20]} />{M.wood({ base: [110, 70, 40] })}</mesh>)}
    </group>
    {/* la tilde verde que crece en la hoja sana: un brote nuevo */}
    <group position={[0.0, 0.26, 0.01]} scale={ok + 0.001}><RoseBud s={1.6} open={0.4} /></group>
  </>;
}}</Scene3D>;

// ---- 6:52 · EL SOL DEL MEDIODÍA: la gota sobre la hoja hace de lupa y el sol la quema; sombra y atardecer la salvan ----
export const HNoonsun: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#3a2a1a" key1={[-0.2, 1.8, 0.6]}
  cam={{ at: [0, 0.04, 0], az: [0.3, 0.05], el: [0.75, 0.6], r: [0.5, 0.42], fov: 30 }}>{(tt) => {
  const burn = eio(tt, 1.2, 3.6), save = eio(tt, 4.2, 5.4);
  return <>
    <group rotation={[-PI / 2, 0, 0.2]}><group scale={5}><Leaf col="#4a8a2e" dull={burn * (1 - save) * 0.0} /></group></group>
    {/* las quemaduras marrones que se agrandan bajo cada gota */}
    {[[0.02, 0.18], [-0.04, 0.3], [0.05, 0.36]].map(([x, z], i) => <group key={i}>
      <mesh position={[x, 0.004, -z + 0.06]} rotation={[-PI / 2, 0, 0]} scale={burn * (1 - save) + 0.001}><circleGeometry args={[0.03, 24]} /><meshStandardMaterial color="#7a4a1e" roughness={1} transparent opacity={0.9} /></mesh>
      <mesh position={[x, 0.012, -z + 0.06]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.014, 16, 12]} />{M.water({ col: "#eaf6ff", op: 0.75 })}</mesh>
    </group>)}
    {/* el sol del mediodía y su haz cónico que baja a cada gota */}
    <mesh position={[0, 0.48, -0.1]}><sphereGeometry args={[0.06, 24, 16]} />{M.glow({ col: "#ffe08a", op: 1 - save })}</mesh>
    {[[0.02, 0.18], [-0.04, 0.3], [0.05, 0.36]].map(([x, z], i) => <mesh key={"b" + i} position={[x / 2, 0.24, (-z + 0.06 - 0.1) / 2]} visible={save < 0.95}><cylinderGeometry args={[0.002, 0.03, 0.46, 12, 1, true]} /><meshBasicMaterial color="#fff2b0" transparent opacity={0.18 * (1 - save) * eio(tt, 0.4, 1.2)} side={THREE.DoubleSide} depthWrite={false} /></mesh>)}
    {/* la sombra del árbol del atardecer que barre la hoja y la salva */}
    <mesh position={[lerp(-0.6, 0, save), 0.02, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.6]} /><meshBasicMaterial color="#10161c" transparent opacity={0.55 * save} depthWrite={false} /></mesh>
  </>;
}}</Scene3D>;

// ---- 7:20 · DEBAJO DE LA HOJA: la hoja se da vuelta como una página y abajo está la colonia; el rocío la alcanza ----
export const HUnderleaf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1a261a" key1={[-0.5, 1.4, 1.4]}
  cam={{ at: [0, 0.06, 0], az: [0.2, -0.1], el: [0.35, 0.25], r: [0.58, 0.49], fov: 30 }}>{(tt) => {
  const flip = eio(tt, 0.6, 2.0), mist = eio(tt, 2.6, 3.2) * (1 - eio(tt, 4.4, 4.8)), gone = eio(tt, 3.2, 5.2);
  return <>
    <group position={[0, 0.06, 0]} rotation={[-PI / 2 + PI * flip, 0, 0]}>
      <group position={[0, -0.12, 0]} scale={2.6}><Leaf col="#3f7d2a" /></group>
      {/* la colonia en el revés (del lado de abajo) */}
      {Array.from({ length: 34 }, (_, i) => { const a = rn(i, 2) * PI * 2, rr = rn(i, 3); return <group key={i} visible={i / 34 > gone} position={[Math.cos(a) * 0.04 * rr, -0.12 + 0.13 + Math.sin(a) * 0.08 * rr, -0.006]} rotation={[PI / 2, 0, a]}><Aphid s={2.3} /></group>; })}
    </group>
    {/* boquilla del rociador apuntando de abajo hacia arriba */}
    <group position={[0.18, -0.06, 0.08]} rotation={[0, 0, 0.9]}><SoapBottle col="#e6ecf2" cap="#2d6fd0" s={0.9} /></group>
    {Array.from({ length: 40 }, (_, i) => { const u = (tt * 2.4 + rn(i, 2)) % 1; return <mesh key={i} visible={mist > 0.05} position={[lerp(0.12, (rn(i, 3) - 0.5) * 0.1, u), lerp(0.02, 0.07, u), lerp(0.08, (rn(i, 4) - 0.5) * 0.1, u)]}><sphereGeometry args={[0.0025, 6, 5]} />{M.water({ col: "#e8f6ff", op: 0.8 })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 7:41 · DOS SEMANAS DE TARDES: el rosal pasa de pimpollos con bichos a rosas abiertas mientras corren catorce atardeceres ----
export const HTwoweeks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#2c2018" key1={[-0.8, 1.4, 1.3]} warm={0.7}
  cam={{ at: [0, 0.16, 0], az: [-0.15, 0.2], el: [0.12, 0.08], r: [0.86, 0.74], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.4, 5.6), day = Math.floor(k * 14);
  return <>
    <mesh position={[0, 0.2, -0.45]}><planeGeometry args={[3, 1.2]} /><meshBasicMaterial color={new THREE.Color("#5a3a2e").lerp(new THREE.Color("#e8a060"), 0.35 + 0.4 * k)} /></mesh>
    <mesh position={[0, -0.02, -0.1]} rotation={[-PI / 2 + 0.05, 0, 0]}><planeGeometry args={[3, 1]} /><meshStandardMaterial color="#3e5a26" roughness={1} /></mesh>
    {/* catorce rayitas de tiza en una tablita, una por tarde */}
    <RBox s={[0.34, 0.06, 0.01]} p={[-0.18, 0.31, -0.05]} r={0.006}><meshStandardMaterial color="#2a2a26" roughness={0.9} /></RBox>
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} visible={i < day} position={[-0.33 + i * 0.022, 0.31, -0.044]} rotation={[0, 0, i % 5 === 4 ? 1.1 : 0]}><boxGeometry args={[0.004, 0.04, 0.002]} /><meshStandardMaterial color="#f2efe6" /></mesh>)}
    {/* el arbusto: cinco tallos, pimpollos que se abren */}
    {Array.from({ length: 5 }, (_, i) => { const x = -0.1 + i * 0.07, y = 0.16 + 0.06 * Math.sin(i * 2); return <group key={i} position={[x + 0.12, y, 0]}>
      <RoseBud s={2.4} open={cl(k * 1.4 - i * 0.08)} col="#e0667a" />
      {Array.from({ length: 6 }, (_, j) => <group key={j} visible={j / 6 > k * 1.2} position={[Math.cos(j) * 0.02, -0.01 + 0.01 * j, Math.sin(j) * 0.02 + 0.015]}><Aphid s={2} /></group>)}
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 8:12 · LA FILA DEL ALFÉIZAR: las hormigas cruzan el alféizar en fila; el rociador barre y la fila se corta ----
export const HSpraysill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#1e1a16" key1={[-0.6, 1.5, 1.2]} warm={0.8}
  cam={{ at: [0, 0.04, 0], az: [0.3, -0.1], el: [0.5, 0.38], r: [0.73, 0.61], fov: 30 }}>{(tt) => {
  const spray = eio(tt, 2.2, 3.4), wipe = eio(tt, 3.6, 5.6);
  return <>
    {/* el alféizar de madera pintada y el vidrio con el jardín */}
    <RBox s={[0.8, 0.03, 0.18]} p={[0, -0.015, 0]} r={0.006}><meshStandardMaterial color="#e9e1d0" roughness={0.6} /></RBox>
    <mesh position={[0, 0.2, -0.1]}><planeGeometry args={[0.8, 0.4]} /><meshBasicMaterial color="#6f9a54" /></mesh>
    <RBox s={[0.8, 0.02, 0.02]} p={[0, 0.0, -0.09]} r={0.004}><meshStandardMaterial color="#d8cfbc" /></RBox>
    <group position={[0.24, 0, -0.04]}><SoapBottle s={1.0} /></group>
    {/* las hormigas en fila que caminan de izquierda a derecha */}
    {Array.from({ length: 22 }, (_, i) => { const x = -0.4 + ((tt * 0.06 + i * 0.035) % 0.75), hit = spray > 0 && x > -0.1 && x < 0.1 && i % 2 === 0, gone = (x > -0.25 && x < 0.15) && wipe > (x + 0.25) / 0.4;
      return <group key={i} visible={!gone && !(hit && spray > 0.6)} position={[x, 0.001, 0.02 + 0.008 * Math.sin(i * 1.7)]} rotation={[0, 0, 0]}><Ant s={1.8} step={tt + i} /></group>; })}
    {/* la nube de rocío y el trapo que pasa después */}
    {Array.from({ length: 40 }, (_, i) => { const u = (tt * 2 + rn(i, 2)) % 1; return <mesh key={i} visible={spray > 0.02 && spray < 0.98} position={[lerp(-0.1, 0.1, rn(i, 3)), lerp(0.18, 0.004, u), lerp(-0.04, 0.06, rn(i, 4))]}><sphereGeometry args={[0.003, 6, 5]} />{M.water({ col: "#e8f6ff", op: 0.8 })}</mesh>; })}
    <RBox s={[0.1, 0.012, 0.08]} p={[lerp(-0.3, 0.2, wipe), 0.006, 0.02]} r={0.004}><meshStandardMaterial color="#2d5d9a" roughness={0.95} /></RBox>
    {/* la estela húmeda que deja el trapo */}
    <mesh position={[lerp(-0.3, 0.2, wipe) / 2 - 0.15 / 2, 0.0005, 0.02]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, lerp(0, 0.5, wipe)), 1, 1]}><planeGeometry args={[1, 0.08]} /><meshPhysicalMaterial color="#c9bfa8" roughness={0.1} clearcoat={1} transparent opacity={0.6} /></mesh>
  </>;
}}</Scene3D>;

// ---- 8:40 · EL CAMINO DE OLOR: la primera hormiga vuelve al nido dejando un hilo brillante; las demás lo siguen ----
export const HScentroad: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#15130f" key1={[-0.5, 1.6, 1.0]}
  cam={{ at: [0, 0.0, 0], az: [0.1, 0.0], el: [1.0, 0.85], r: [0.94, 0.80], fov: 30 }}>{(tt) => {
  const first = eio(tt, 0.4, 2.6), PTS = [[0.28, 0.003, 0.14], [0.12, 0.003, 0.0], [0.02, 0.003, 0.1], [-0.12, 0.003, -0.04], [-0.28, 0.003, -0.12]];
  const at = (u: number) => { const n = PTS.length - 1, s = Math.min(n - 0.0001, u * n), i = Math.floor(s), f = s - i; return [lerp(PTS[i][0], PTS[i + 1][0], f), 0.003, lerp(PTS[i][2], PTS[i + 1][2], f)]; };
  const trail = PTS.slice(0, 1).concat(Array.from({ length: 12 }, (_, i) => at(((i + 1) / 12) * first)));
  return <>
    {/* el piso de linóleo a cuadros */}
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.2, 0.8]} /><meshStandardMaterial map={tex.text("lino", 256, 256, (g) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? "#c9b48a" : "#8a6a44"; g.fillRect(x * 32, y * 32, 32, 32); } })} roughness={0.6} /></mesh>
    {/* el azucarero a un lado, el nido (grieta) al otro */}
    <mesh position={[0.32, 0.03, 0.16]}><cylinderGeometry args={[0.05, 0.045, 0.06, 28]} />{M.porcelain({ col: "#4a7aa8" })}</mesh>
    <mesh position={[0.32, 0.062, 0.16]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.046, 28]} /><meshStandardMaterial color="#fbf8f0" roughness={0.9} /></mesh>
    <mesh position={[-0.3, 0.001, -0.13]} rotation={[-PI / 2, 0, 0.6]}><planeGeometry args={[0.14, 0.012]} /><meshBasicMaterial color="#050403" /></mesh>
    {/* el hilo de olor brillante que deja la primera */}
    {first > 0.02 && <mesh geometry={tubeG("scent" + Math.round(first * 60), trail, 0.0035, 60, 6)}>{M.glow({ col: "#f2c24a", op: 0.7 })}</mesh>}
    <group position={at(first) as [number, number, number]} rotation={[0, PI, 0]} scale={2.4}><Ant step={tt} /></group>
    {/* las seguidoras salen del nido sobre el mismo hilo */}
    {Array.from({ length: 10 }, (_, i) => { const u = 1 - cl((tt - 2.8 - i * 0.22) / 2.6); return <group key={i} visible={tt > 2.8 + i * 0.22} position={at(u) as [number, number, number]} scale={2.4}><Ant step={tt + i} /></group>; })}
  </>;
}}</Scene3D>;
