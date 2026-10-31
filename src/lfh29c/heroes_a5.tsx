// lfh29c · componentes únicos 29-33 (el trapeado que sale por la puerta, los trapos de camisas viejas, una sola ventana que brilla, la mancha al sol, la ropa de color al revés y a la sombra).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, eio, lerp, phys, rn, tex } from "./h3d";

const PI = Math.PI;

// ---- 17:13 · DE LA ESQUINA A LA PUERTA: vista desde arriba; el lampazo zigzaguea desde el rincón del fondo y el piso mojado brilla detrás, la puerta queda libre ----
const MOPATH = (u: number) => { const rows = 5, r = Math.min(rows - 1, Math.floor(u * rows)), f = u * rows - r, dir = r % 2 ? -1 : 1; return [dir * lerp(-0.3, 0.3, f), -0.22 + r * 0.11]; };
export const HMopexit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#16130f" key1={[-0.3, 1.8, 0.6]}
  cam={{ at: [0, 0, 0.02], az: [0.0, 0.04], el: [1.3, 1.22], r: [0.98, 0.9], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.3, 5.0), [mx, mz] = MOPATH(k);
  return <>
    {/* el piso de tablas del cuarto con sus paredes bajas y la puerta abajo */}
    <RBox s={[0.76, 0.02, 0.6]} p={[0, -0.01, 0]} r={0.002}><meshStandardMaterial map={tex.wood(5, 1, [170, 120, 70])} roughness={0.8} /></RBox>
    {[[0, -0.31, 0.78, 0.03], [-0.38, 0, 0.03, 0.62], [0.38, 0, 0.03, 0.62], [-0.22, 0.31, 0.34, 0.03], [0.26, 0.31, 0.26, 0.03]].map(([x, z, w, d], i) => <RBox key={i} s={[w, 0.08, d]} p={[x, 0.04, z]} r={0.004}><meshStandardMaterial color="#e9dcc0" roughness={0.8} /></RBox>)}
    {/* la puerta abierta (abajo a la derecha) con la luz que entra */}
    <mesh position={[0.08, 0.001, 0.36]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.1, 0.1]} />{M.glow({ col: "#ffe2a0", op: 0.5 })}</mesh>
    {/* el piso mojado que brilla: pastillas que se encienden detrás del lampazo */}
    {Array.from({ length: 41 }, (_, i) => { const u = i / 40, [x, z] = MOPATH(u); return <mesh key={i} visible={u <= k} position={[x, 0.0015, z]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.1, 0.11]} /><meshPhysicalMaterial color="#8a5a30" roughness={0.04} clearcoat={1} transparent opacity={0.55} /></mesh>; })}
    {/* el lampazo de hilos con el balde */}
    <group position={[mx, 0.02, mz]} rotation={[0, Math.sin(tt * 6) * 0.4, 0]}>
      {Array.from({ length: 20 }, (_, i) => <mesh key={i} position={[(i % 10 - 4.5) * 0.009, 0, Math.floor(i / 10) * 0.012 - 0.006]} rotation={[0.3 * Math.sin(i), 0, 0.3 * Math.cos(i)]}><cylinderGeometry args={[0.003, 0.003, 0.04, 6]} /><meshStandardMaterial color="#efe6cf" roughness={1} /></mesh>)}
      <mesh position={[0, 0.06, 0.02]} rotation={[0.4, 0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.14, 8]} />{M.wood({ base: [180, 136, 86] })}</mesh>
    </group>
    <group position={[-0.28, 0.0, 0.22]}><mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.04, 0.034, 0.06, 28, 1, true]} />{M.steel({ col: "#a9b0b6", side: THREE.DoubleSide })}</mesh><mesh position={[0, 0.05, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.038, 28]} />{M.water({ op: 0.6 })}</mesh></group>
    {/* flecha de pisadas hacia la puerta (solo en lo seco, adelante del lampazo) */}
    {[0, 1, 2].map((i) => <mesh key={"f" + i} visible={k > 0.9} position={[0.08 + (i % 2 ? 0.015 : -0.015), 0.003, 0.2 + i * 0.05]} rotation={[-PI / 2, 0, 0]} scale={[0.6, 1, 1]}><circleGeometry args={[0.012, 12]} /><meshStandardMaterial color="#5a3c22" transparent opacity={0.5} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 17:47 · TRAPOS DE CAMISAS VIEJAS: la camisa a cuadros se abre en cuadrados que vuelan y se apilan doblados junto a los de pañal ----
export const HRags: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#1d1915" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0.02, 0.04, 0], az: [-0.1, 0.1], el: [0.8, 0.7], r: [0.74, 0.64], fov: 30 }}>{(tt) => {
  const plaid = tex.text("plaidshirt", 256, 256, (g) => { g.fillStyle = "#a8322a"; g.fillRect(0, 0, 256, 256); g.globalAlpha = 0.5; g.fillStyle = "#1e2a44"; for (let i = 0; i < 256; i += 48) { g.fillRect(i, 0, 18, 256); g.fillRect(0, i, 256, 18); } g.fillStyle = "#f2e6c8"; for (let i = 24; i < 256; i += 48) { g.fillRect(i, 0, 3, 256); g.fillRect(0, i, 256, 3); } });
  return <>
    {/* doce cuadrados que arrancan formando la camisa y vuelan a la pila */}
    {Array.from({ length: 12 }, (_, i) => { const cx = -0.24 + (i % 3) * 0.08, cz = -0.12 + Math.floor(i / 3) * 0.08, k = eio(tt, 1.0 + i * 0.25, 1.6 + i * 0.25), py = 0.006 + i * 0.008;
      return <mesh key={i} position={[lerp(cx, 0.12, k), lerp(0.004, py, k) + Math.sin(k * PI) * 0.12, lerp(cz, -0.02, k)]} rotation={[-PI / 2 + Math.sin(k * PI) * 0.8, 0, k * PI * 0.5]} scale={[lerp(1, 0.75, k), lerp(1, 0.75, k), 1]}>
        <boxGeometry args={[0.079, 0.079, 0.006]} /><meshStandardMaterial map={plaid} roughness={0.95} /></mesh>; })}
    {/* las mangas y el cuello, que se van con un fundido a los costados */}
    {[-1, 1].map((sd) => <mesh key={sd} visible={tt < 1.2} position={[-0.16 + sd * 0.17, 0.003, -0.06]} rotation={[-PI / 2, 0, sd * 0.5]}><planeGeometry args={[0.07, 0.24]} /><meshStandardMaterial map={plaid} roughness={0.95} /></mesh>)}
    <mesh visible={tt < 1.2} position={[-0.16, 0.004, -0.17]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.12, 0.03]} /><meshStandardMaterial map={plaid} roughness={0.95} /></mesh>
    {/* la otra pila: pañales de algodón blancos doblados */}
    {Array.from({ length: 6 }, (_, i) => <RBox key={"d" + i} s={[0.09, 0.012, 0.09]} p={[0.27, 0.006 + i * 0.013, 0.02]} rot={[0, 0.05 * Math.sin(i * 3), 0]} r={0.005}><meshStandardMaterial color="#fbfaf5" roughness={1} /></RBox>)}
    {/* tijera abierta al costado */}
    <group position={[-0.06, 0.006, 0.18]} rotation={[0, 0.6, 0]}>{[-1, 1].map((sd) => <group key={sd} rotation={[0, sd * 0.25 * (1 + Math.sin(tt * 4) * 0.3 * (tt < 1 ? 1 : 0)), 0]}><RBox s={[0.1, 0.004, 0.01]} p={[0.05, sd * 0.003, 0]} r={0.002}>{M.steel()}</RBox><mesh position={[-0.02, sd * 0.003, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.014, 0.004, 6, 16]} /><meshStandardMaterial color="#1e1e1e" /></mesh></group>)}</group>
  </>;
}}</Scene3D>;

// ---- 18:20 · EMPEZÁ CON UNA SOLA VENTANA: la pared de la casa con cuatro ventanas opacas; una se limpia, brilla y tira un rectángulo de sol en el piso ----
export const HOnewindow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#1a1612" key1={[0.6, 1.6, -1.2]}
  cam={{ at: [0, 0.2, 0.05], az: [-0.35, -0.2], el: [0.22, 0.18], r: [1.1, 0.98], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.6, 3.0), beam = eio(tt, 2.6, 3.6);
  return <>
    {/* la pared interior con cuatro ventanas */}
    <RBox s={[1.2, 0.6, 0.03]} p={[0, 0.3, -0.12]} r={0.004}><meshStandardMaterial color="#e9dcc0" roughness={0.9} /></RBox>
    {[-0.42, -0.14, 0.14, 0.42].map((x, i) => { const me = i === 1, c = me ? k : 0; return <group key={i} position={[x, 0.34, -0.1]}>
      <mesh position={[0, 0, -0.005]}><planeGeometry args={[0.2, 0.28]} /><meshBasicMaterial color="#cfe4f2" /></mesh>
      <mesh position={[0, 0, 0.003]}><planeGeometry args={[0.2, 0.28]} /><meshStandardMaterial color="#b8b0a0" transparent opacity={0.85 * (1 - c)} roughness={1} depthWrite={false} /></mesh>
      {[[-0.105, 0, 0.012, 0.3], [0.105, 0, 0.012, 0.3], [0, 0.145, 0.22, 0.012], [0, -0.145, 0.22, 0.012], [0, 0, 0.008, 0.28], [0, 0, 0.2, 0.008]].map(([xx, yy, w, hh], j) => <RBox key={j} s={[w, hh, 0.02]} p={[xx, yy, 0.008]} r={0.002}><meshStandardMaterial color="#f6f2ea" roughness={0.6} /></RBox>)}
      {me && <mesh visible={tt > 0.5 && tt < 3.1} position={[lerp(-0.07, 0.07, (Math.sin(tt * 5) + 1) / 2), lerp(0.1, -0.1, k), 0.03]} rotation={[tt * 3, tt * 2, 0]}><icosahedronGeometry args={[0.03, 1]} /><meshStandardMaterial color="#ece6d6" roughness={0.95} flatShading /></mesh>}
      {me && <mesh visible={beam > 0.05} position={[0, 0, 0.004]}><planeGeometry args={[0.2, 0.28]} />{M.glow({ col: "#fff1c8", op: 0.25 * beam })}</mesh>}
    </group>; })}
    {/* el rectángulo de sol en el piso que sólo da esa ventana */}
    <mesh position={[-0.1, 0.002, 0.18]} rotation={[-PI / 2, 0, 0.2]}><planeGeometry args={[0.22, 0.3]} />{M.glow({ col: "#ffe2a0", op: 0.35 * beam })}</mesh>
    <mesh position={[-0.12, 0.2, 0.04]} rotation={[0.9, 0, 0.15]}><planeGeometry args={[0.2, 0.36]} />{M.glow({ col: "#fff1c8", op: 0.07 * beam })}</mesh>
  </>;
}}</Scene3D>;

// ---- 19:25 · LA MANCHA MIRANDO AL SOL: la camisa blanca colgada con el lado manchado hacia el sol; el sol cruza y la mancha se borra ----
export const HClothesline: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#5f93c8" key1={[-1.2, 1.6, 1.0]}
  cam={{ at: [0, 0.18, 0], az: [-0.1, 0.12], el: [0.06, 0.04], r: [0.86, 0.76], fov: 30 }}>{(tt) => {
  const sun = eio(tt, 0.3, 5.0), fade = eio(tt, 1.0, 4.8), sway = Math.sin(tt * 1.6) * 0.06;
  return <>
    {/* cielo, pasto, los dos postes y la soga */}
    <mesh position={[0, -0.3, -0.6]} rotation={[-PI / 2 + 0.1, 0, 0]}><planeGeometry args={[4, 2]} /><meshStandardMaterial color="#6a8a3a" roughness={1} /></mesh>
    {/* el sol de la tarde que sube por la esquina y blanquea la mancha */}
    <mesh position={[0.5, lerp(0.05, 0.42, sun), -0.5]}><sphereGeometry args={[0.07, 24, 16]} />{M.glow({ col: "#ffd27a" })}</mesh>
    {Array.from({ length: 8 }, (_, i) => <mesh key={"r" + i} position={[0.5, lerp(0.05, 0.42, sun), -0.52]} rotation={[0, 0, i * PI / 4 + tt * 0.2]}><planeGeometry args={[0.26 * sun + 0.001, 0.006]} /><meshBasicMaterial color="#ffe3a0" transparent opacity={0.5 * sun} /></mesh>)}
    {[-0.42, 0.42].map((x) => <mesh key={x} position={[x, 0.05, -0.02]}><cylinderGeometry args={[0.012, 0.014, 0.7, 10]} />{M.wood({ base: [120, 86, 52] })}</mesh>)}
    <mesh position={[0, 0.38, -0.02]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0025, 0.0025, 0.84, 6]} /><meshStandardMaterial color="#efe6cf" /></mesh>
    {/* el sol que cruza el cielo */}
    <mesh position={[lerp(-0.6, 0.6, sun), 0.55 + 0.12 * Math.sin(sun * PI), -0.5]}><circleGeometry args={[0.07, 32]} />{M.glow({ col: "#ffe08a" })}</mesh>
    {/* la camisa blanca colgada, con la mancha de óxido/pasto en el frente que se aclara */}
    <group position={[0, 0.38, 0]} rotation={[sway * 0.4, sway, 0]}>
      <mesh position={[0, -0.13, 0]}><planeGeometry args={[0.24, 0.26]} /><meshStandardMaterial color="#fbfaf5" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.15, -0.06, 0]} rotation={[0, 0, sd * 0.7]}><planeGeometry args={[0.07, 0.15]} /><meshStandardMaterial color="#fbfaf5" roughness={0.9} side={THREE.DoubleSide} /></mesh>)}
      <mesh position={[0.03, -0.14, 0.002]}><circleGeometry args={[0.045, 24]} /><meshStandardMaterial color="#a8742a" transparent opacity={0.85 * (1 - fade)} roughness={1} /></mesh>
      <mesh position={[-0.05, -0.2, 0.002]}><circleGeometry args={[0.025, 18]} /><meshStandardMaterial color="#5a7a2a" transparent opacity={0.8 * (1 - fade)} roughness={1} /></mesh>
      {[-0.08, 0.08].map((x) => <RBox key={x} s={[0.012, 0.04, 0.012]} p={[x, 0.005, 0.006]} r={0.003}>{M.wood({ base: [200, 160, 110] })}</RBox>)}
    </group>
    {/* el reflejo de sol sobre la camisa */}
    <mesh position={[0.02, 0.24, 0.01]}><circleGeometry args={[0.12, 32]} />{M.glow({ col: "#fff4c8", op: 0.12 * Math.sin(sun * PI) })}</mesh>
  </>;
}}</Scene3D>;

// ---- 20:10 · AL REVÉS Y A LA SOMBRA: la remera de color se da vuelta en el aire y se cuelga bajo la sombra del árbol, que no la destiñe ----
export const HShadeline: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#a8cce4" key1={[1.2, 1.8, 0.6]}
  cam={{ at: [0.05, 0.2, 0], az: [0.15, -0.05], el: [0.08, 0.06], r: [0.9, 0.8], fov: 30 }}>{(tt) => {
  const flip = eio(tt, 0.4, 1.8), hang = phys(tt, 1.8, 7, 0.5);
  return <>
    <mesh position={[0, -0.3, -0.6]} rotation={[-PI / 2 + 0.1, 0, 0]}><planeGeometry args={[4, 2]} /><meshStandardMaterial color="#6a8a3a" roughness={1} /></mesh>
    {/* el árbol: tronco y copa que tiran la sombra sobre la soga */}
    <mesh position={[-0.5, 0.1, -0.2]}><cylinderGeometry args={[0.03, 0.045, 0.8, 12]} /><meshStandardMaterial color="#5a3c22" roughness={1} /></mesh>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.42 + (rn(i, 2) - 0.3) * 0.3, 0.56 + (rn(i, 3) - 0.5) * 0.12, -0.1 + (rn(i, 4) - 0.5) * 0.2]}><sphereGeometry args={[0.1 + 0.04 * rn(i, 5), 16, 12]} /><meshStandardMaterial color={i % 2 ? "#3d6a2a" : "#4f7e32"} roughness={1} /></mesh>)}
    <mesh position={[0.05, 0.2, -0.03]}><planeGeometry args={[0.6, 0.5]} /><meshBasicMaterial color="#1a2a3a" transparent opacity={0.22} depthWrite={false} /></mesh>
    <mesh position={[0.05, 0.4, -0.02]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0025, 0.0025, 0.7, 6]} /><meshStandardMaterial color="#efe6cf" /></mesh>
    <mesh position={[0.4, 0.1, -0.02]}><cylinderGeometry args={[0.012, 0.014, 0.62, 10]} />{M.wood({ base: [120, 86, 52] })}</mesh>
    {/* la remera azul: el frente con el estampado, el revés con las costuras; gira y sube a la soga */}
    <group position={[0.05, lerp(0.05, 0.4, hang), 0.05]} rotation={[0, PI * flip, 0]}>
      <group position={[0, -0.12, 0]}>
        <mesh position={[0, 0, 0.001]}><planeGeometry args={[0.22, 0.24]} /><meshStandardMaterial color="#2a6fd8" roughness={0.9} /></mesh>
        <mesh position={[0, 0.03, 0.002]}><circleGeometry args={[0.04, 24]} /><meshStandardMaterial color="#f2c81e" roughness={0.9} /></mesh>
        <mesh position={[0, 0, -0.001]} rotation={[0, PI, 0]}><planeGeometry args={[0.22, 0.24]} /><meshStandardMaterial map={tex.text("inside", 128, 128, (g) => { g.fillStyle = "#3a78d0"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "#a8c4e8"; g.lineWidth = 3; g.setLineDash([6, 4]); g.strokeRect(6, 6, 116, 116); g.beginPath(); g.moveTo(64, 0); g.lineTo(64, 20); g.stroke(); })} roughness={0.95} /></mesh>
        {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.14, 0.07, 0]} rotation={[0, 0, sd * 0.6]}><planeGeometry args={[0.07, 0.09]} /><meshStandardMaterial color="#2a6fd8" roughness={0.9} side={THREE.DoubleSide} /></mesh>)}
      </group>
      {[-0.08, 0.08].map((x) => <RBox key={x} s={[0.012, 0.04, 0.012]} p={[x, 0.005, 0.006]} r={0.003}>{M.wood({ base: [200, 160, 110] })}</RBox>)}
    </group>
    {/* manchas de luz entre las hojas, quietas sobre la remera */}
    {[0, 1, 2].map((i) => <mesh key={"l" + i} position={[-0.05 + i * 0.08, 0.3 - i * 0.04, 0.07]}><circleGeometry args={[0.015, 12]} />{M.glow({ col: "#fff4c8", op: 0.12 })}</mesh>)}
  </>;
}}</Scene3D>;

// porchlight · «see you next time in the farmhouse kitchen»: la ventana de la cocina de noche, la jarra de vinagre en el alféizar, la luz se entibia y aparece la estrella.
export const HPorchlight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1b2436" key1={[-0.8, 1.2, 1.4]}
  cam={{ at: [0, 0.22, 0], az: [-0.18, 0.12], el: [0.06, 0.1], r: [1.05, 0.88], fov: 30 }}>{(tt) => {
  const dim = eio(tt, 1.6, 4.6), star = eio(tt, 2.2, 4.0), cur = phys(tt, 0.6, 5, 0.6);
  const glow = lerp(0.85, 0.45, dim);
  return <>
    {/* tablas de la pared exterior */}
    {Array.from({ length: 9 }, (_, i) => <RBox key={i} s={[1.6, 0.075, 0.02]} p={[0, -0.12 + i * 0.075, -0.03 - (i % 2) * 0.004]} r={0.004}>{M.wood({ base: [118, 104, 88] })}</RBox>)}
    {/* marco y cuatro vidrios con luz tibia de adentro */}
    <RBox s={[0.5, 0.42, 0.03]} p={[0, 0.27, 0]} r={0.006}><meshStandardMaterial color="#e8dfcc" roughness={0.7} /></RBox>
    {[[-0.105, 0.37], [0.105, 0.37], [-0.105, 0.17], [0.105, 0.17]].map(([x, y], i) => <mesh key={"p" + i} position={[x, y, 0.017]}><planeGeometry args={[0.19, 0.18]} /><meshStandardMaterial color="#3a2a18" emissive="#f0b860" emissiveIntensity={glow * (0.9 + 0.1 * rn(i, 3))} roughness={0.3} /></mesh>)}
    {/* cortinas a cuadros que se cierran un poco */}
    {[-1, 1].map((sd) => <mesh key={"c" + sd} position={[sd * lerp(0.2, 0.15, cur), 0.29, 0.02]}><planeGeometry args={[0.1, 0.36]} /><meshStandardMaterial map={tex.text("gingham", 64, 64, (g) => { g.fillStyle = "#efe6d6"; g.fillRect(0, 0, 64, 64); g.fillStyle = "rgba(170,60,50,.55)"; for (let k = 0; k < 64; k += 16) { g.fillRect(k, 0, 8, 64); g.fillRect(0, k, 64, 8); } })} roughness={0.9} transparent opacity={0.92} /></mesh>)}
    {/* alféizar con la jarra de vinagre y una maceta de geranio */}
    <RBox s={[0.58, 0.025, 0.08]} p={[0, 0.045, 0.03]} r={0.004}>{M.wood({ base: [200, 186, 160] })}</RBox>
    <group position={[-0.12, 0.058, 0.035]}>
      <mesh position={[0, 0.055, 0]}><cylinderGeometry args={[0.032, 0.036, 0.11, 24]} /><meshStandardMaterial color="#d8d2bc" roughness={0.35} transparent opacity={0.85} /></mesh>
      <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.03, 0.034, 0.08, 24]} /><meshStandardMaterial color="#d9c27a" roughness={0.2} transparent opacity={0.7} /></mesh>
      <mesh position={[0, 0.125, 0]}><cylinderGeometry args={[0.012, 0.016, 0.03, 12]} /><meshStandardMaterial color="#c43c2c" roughness={0.5} /></mesh>
      <mesh position={[0.036, 0.075, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.02, 0.006, 8, 20, PI]} /><meshStandardMaterial color="#d8d2bc" roughness={0.35} /></mesh>
    </group>
    <group position={[0.14, 0.058, 0.035]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.035, 0.026, 0.06, 20]} /><meshStandardMaterial color="#b0603a" roughness={0.9} /></mesh>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[(rn(i, 4) - 0.5) * 0.06, 0.08 + rn(i, 5) * 0.04, (rn(i, 6) - 0.5) * 0.03]}><sphereGeometry args={[0.014, 10, 8]} /><meshStandardMaterial color={i % 3 ? "#3f6e2c" : "#d23a3a"} roughness={0.8} /></mesh>)}
    </group>
    {/* la luz de la ventana sobre el alféizar (siempre montada, rampa) */}
    <pointLight position={[0, 0.27, 0.12]} color="#ffbe6a" intensity={0.5 * glow} distance={0.9} />
    {/* la estrella de la tarde, arriba a la derecha */}
    <mesh position={[0.52, 0.64, -0.2]} scale={0.6 + 0.4 * star}><sphereGeometry args={[0.008, 10, 8]} />{M.glow({ col: "#fff2d0", op: 0.9 * star })}</mesh>
  </>;
}}</Scene3D>;
