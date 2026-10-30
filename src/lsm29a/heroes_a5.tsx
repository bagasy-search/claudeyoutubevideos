// lsm29a · componentes únicos 25-27 (el viernes al mediodía, la puerta abierta, la balanza de la tristeza).
import React from "react";
import * as THREE from "three";
import { AMB, H, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Candle, Dots, Plate, Roll, paperTex } from "./tg";

const PI = Math.PI;

// ---- 19:02 · EL VIERNES AL MEDIODÍA: la heladera se abre, se prende su luz de adentro y en el estante espera un plato con su nombre ----
export const HFridgeplate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" warm={0.75}
  cam={{ at: [0, 0.82, 0], at1: [-0.06, 0.55, 0.12], az: [0.42, 0.12], el: [0.1, 0.32], r: [2.4, 0.9], fov: 32 }} over={(tt) => <Tag tt={tt} at={3.6} x={1450} y={300} txt="SOMEBODY THOUGHT OF HER" col={AMB} size={34} />}>{(tt) => {
  const open = eio(tt, 0.6, 2.0), lit = eio(tt, 0.9, 1.4), tape = eio(tt, 2.4, 3.2), pull = phys(tt, 2.3, 7, 0.5);
  const body = "#cfe0d4", inner = "#b9c4c2";
  return <>
    {/* heladera vieja color menta, de esquinas redondas, en una cocina en penumbra */}
    <group position={[0, 0, -0.1]}>
      <RBox s={[0.7, 1.7, 0.04]} r={0.01} p={[0, 0.85, -0.3]}><meshStandardMaterial color={inner} roughness={0.7} /></RBox>
      {[-1, 1].map((k) => <RBox key={k} s={[0.04, 1.7, 0.62]} r={0.02} p={[k * 0.33, 0.85, 0]}>{M.porcelain({ col: body })}</RBox>)}
      <RBox s={[0.7, 0.06, 0.62]} r={0.03} p={[0, 1.68, 0]}>{M.porcelain({ col: body })}</RBox>
      <RBox s={[0.7, 0.12, 0.62]} r={0.02} p={[0, 0.06, 0]}>{M.porcelain({ col: body })}</RBox>
      {/* la lamparita de adentro: emisiva tibia, nunca una luz que se monta */}
      <mesh position={[0, 1.58, -0.05]}><sphereGeometry args={[0.025, 14, 10]} />{M.glow({ col: "#fff1c8", op: 0.25 + 0.75 * lit })}</mesh>
      <mesh position={[0, 0.9, -0.275]}><planeGeometry args={[0.62, 1.55]} /><meshStandardMaterial color={inner} emissive="#ffd9a0" emissiveIntensity={0.42 * lit} roughness={0.8} /></mesh>
      {[0.48, 0.95, 1.3].map((y) => <mesh key={y} position={[0, y, 0]}><boxGeometry args={[0.62, 0.01, 0.55]} />{M.glass({ op: 0.45, col: "#dfeee8" })}</mesh>)}
      {/* lo de siempre: leche, mermelada, huevos, manteca */}
      <mesh position={[-0.2, 1.06, -0.1]}><boxGeometry args={[0.09, 0.22, 0.09]} /><meshStandardMaterial color="#f2efe4" roughness={0.6} /></mesh>
      <mesh position={[-0.2, 1.12, -0.054]}><planeGeometry args={[0.07, 0.05]} /><meshStandardMaterial color="#3d6fb3" roughness={0.6} /></mesh>
      <mesh position={[0.18, 1.02, -0.12]}><cylinderGeometry args={[0.045, 0.045, 0.13, 20]} /><meshPhysicalMaterial color="#9b1f2a" roughness={0.2} clearcoat={1} /></mesh>
      <mesh position={[0.18, 1.095, -0.12]}><cylinderGeometry args={[0.048, 0.048, 0.02, 20]} />{M.brass()}</mesh>
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.05 + (i % 2) * 0.05, 1.33, -0.12 + Math.floor(i / 2) * 0.05]} scale={[1, 1.3, 1]}><sphereGeometry args={[0.022, 14, 10]} /><meshStandardMaterial color="#efe3cc" roughness={0.6} /></mesh>)}
      <mesh position={[0.21, 0.51, -0.12]}><boxGeometry args={[0.14, 0.05, 0.06]} /><meshStandardMaterial color="#f0d46e" roughness={0.6} /></mesh>
      {/* el plato con papel encerado: se adelanta solo un poquito, y su nombre */}
      <group position={[-0.06, 0.49, 0.02 + 0.06 * cl(pull)]}>
        <Plate r={0.16} />
        <mesh position={[0, 0.015, 0]} scale={[1, 0.45, 1]}><sphereGeometry args={[0.14, 28, 12, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color="#efe2bd" roughness={0.35} transparent opacity={0.75} clearcoat={0.8} depthWrite={false} /></mesh>
        <group position={[0, 0.07, 0.11]} rotation={[-0.35, 0, -0.04]} scale={0.45 + 1.05 * tape}>
          <mesh><planeGeometry args={[0.32, 0.09]} /><meshStandardMaterial map={paperTex("tapeMarg2", ["Margaret"], { w: 640, h: 180, bg: "#efe4bf", ink: "#2c2a33", font: "italic 700" })} roughness={0.8} /></mesh>
        </group>
      </group>
      <mesh position={[-0.06, 0.5, 0.02]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.15, 0.32, 48]} />{M.glow({ col: "#ffd68a", op: 0.45 * tape })}</mesh>
      <pointLight position={[-0.06, 0.7, 0.1]} intensity={0.8 * tape} distance={0.9} decay={2} color="#ffcf8a" />
      {/* la puerta gira sobre su bisagra, con estantes de puerta */}
      <group position={[-0.35, 0, 0.32]} rotation={[0, -open * 1.75, 0]}>
        <RBox s={[0.7, 1.68, 0.07]} r={0.025} p={[0.35, 0.86, 0]}>{M.porcelain({ col: body })}</RBox>
        <RBox s={[0.03, 0.4, 0.04]} r={0.01} p={[0.64, 1.1, 0.06]}>{M.chrome()}</RBox>
        <mesh position={[0.35, 1.45, 0.04]}><planeGeometry args={[0.22, 0.05]} />{M.chrome()}</mesh>
      </group>
    </group>
    {/* el haz tibio que sale al piso */}
    <mesh position={[0.05, 0.003, 0.55]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.8]} />{M.glow({ col: "#ffe7b8", op: 0.12 * lit })}</mesh>
  </>;
}}</Scene3D>;

// ---- 20:06 · DEJAR LA PUERTA ABIERTA: la puerta de la casa queda entornada; la luz amarilla sale en cuña sobre el porche nevado ----
export const HDoorajar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#141b28" warm={0.45}
  cam={{ at: [0.1, 0.8, 0.4], at1: [0.15, 0.6, 0.6], az: [0.62, 0.42], el: [0.16, 0.2], r: [3.6, 3.0], fov: 32 }} over={(tt) => <Tag tt={tt} at={2.6} x={1400} y={860} txt="SO THERE'S A CHRISTMAS" col={AMB} size={38} />}>{(tt) => {
  const op = eio(tt, 0.6, 2.4) * 0.5, glow = cl(op / 0.5);
  return <>
    {/* el porche de tablas, con nieve que entra desde el jardín */}
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[4, 3]} /><meshStandardMaterial map={tex.wood(8, 2, [92, 74, 62])} roughness={0.8} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.003, 1.15]}><planeGeometry args={[4, 0.8]} /><meshStandardMaterial color="#c9d3e0" roughness={0.95} /></mesh>
    {/* huellas que llegan hasta la puerta */}
    {[0, 1, 2, 3, 4, 5].map((i) => <mesh key={i} rotation={[-PI / 2, 0, 0.2]} position={[0.55 + (i % 2) * 0.12 - i * 0.07, 0.006, 1.45 - i * 0.24]}><circleGeometry args={[0.045, 16]} /><meshStandardMaterial color="#8d97a8" roughness={1} /></mesh>)}
    {/* la fachada de tablas, azulada de noche */}
    <mesh position={[0, 1.2, -0.02]}><planeGeometry args={[4, 2.4]} /><meshStandardMaterial map={tex.text("siding2", 256, 256, (g) => { g.fillStyle = "#7c8696"; g.fillRect(0, 0, 256, 256); g.fillStyle = "rgba(0,0,0,.22)"; for (let y = 0; y < 256; y += 21) g.fillRect(0, y, 256, 3); })} roughness={0.85} /></mesh>
    <mesh position={[1.25, 1.25, 0.0]}><planeGeometry args={[0.6, 0.8]} /><meshStandardMaterial color="#2a3240" emissive="#ffb04a" emissiveIntensity={0.08} roughness={0.4} /></mesh>{[[0, 0, 0.6, 0.03], [0, 0, 0.03, 0.8], [0, 0.4, 0.66, 0.05], [0, -0.4, 0.66, 0.05], [0.31, 0, 0.05, 0.86], [-0.31, 0, 0.05, 0.86]].map(([x, y, w, hh], i) => <mesh key={i} position={[1.25 + x, 1.25 + y, 0.005]}><planeGeometry args={[w, hh]} /><meshStandardMaterial color="#e6e1d6" roughness={0.7} /></mesh>)}
    {/* el vano iluminado detrás de la puerta */}
    <mesh position={[0, 1.0, -0.01]}><planeGeometry args={[0.9, 2.0]} /><meshStandardMaterial color="#ffcf7a" emissive="#ffb04a" emissiveIntensity={1.5 * glow} roughness={0.6} /></mesh>
    <group position={[-0.45, 0, 0.0]} rotation={[0, -op * 1.6, 0]}>
      <RBox s={[0.9, 2.0, 0.05]} r={0.01} p={[0.45, 1.0, 0.03]}>{M.wood({ base: [110, 40, 34], rx: 1 })}</RBox>
      <mesh position={[0.82, 1.0, 0.07]}><sphereGeometry args={[0.025, 14, 10]} />{M.brass()}</mesh>
      <mesh position={[0.45, 1.5, 0.07]}><torusGeometry args={[0.14, 0.035, 10, 30]} /><meshStandardMaterial color="#5f6f3a" roughness={0.8} /></mesh>
    </group>
    {/* la cuña de luz: capas apiladas que se abren sobre las tablas y llegan a la nieve */}
    {[0, 1, 2, 3, 4, 5].map((i) => <mesh key={i} position={[0.12 + i * 0.01, 0.005 + i * 0.12, 0.35 + 0.45 * glow - i * 0.03]} rotation={[-PI / 2, 0, -0.1]}><planeGeometry args={[(0.5 + 0.6 * glow) * (1 - i * 0.12), (0.4 + 1.1 * glow) * (1 - i * 0.14)]} />{M.glow({ col: "#ffc36a", op: (i === 0 ? 0.42 : 0.06) * glow })}</mesh>)}
    <Dots n={140} r={0.008} col="#ffffff" pos={(i) => [(rn(i, 2) - 0.5) * 3.6, 2.4 - ((tt * (0.12 + 0.1 * rn(i, 3)) + rn(i, 4)) % 1) * 2.4, 0.3 + rn(i, 5) * 1.4]} op={(i) => (Math.abs((rn(i, 2) - 0.5) * 3.6 - 0.15) < 0.5 ? 1 : 0.55)} />
  </>;
}}</Scene3D>;

// ---- 21:45 · TRISTE NO ES DESAGRADECIDO: una balanza de bronce; de un lado la vela por él, del otro el pan de la mesa: queda pareja ----
export const HBalance: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.85}
  cam={{ at: [0, 0.32, 0], az: [-0.25, 0.25], el: [0.14, 0.2], r: [1.2, 1.0], fov: 30 }} over={(tt) => <><Tag tt={tt} at={1.4} x={520} y={820} txt="SAD" col="#cfe2ff" size={54} /><Tag tt={tt} at={2.6} x={1420} y={820} txt="GRATEFUL" col={AMB} size={54} /></>}>{(tt) => {
  const l = phys(tt, 0.8, 6, 0.6), r = phys(tt, 2.0, 6, 0.6);
  const tilt = 0.32 * cl(l) * (1 - eio(tt, 2.2, 3.6)) - 0.32 * 0 + 0.05 * Math.sin(tt * 2.2) * Math.exp(-Math.max(0, tt - 3.6));
  const arm = 0.28, py = (k: number) => 0.5 + Math.sin(-tilt) * arm * k;
  return <>
    {/* pie y columna */}
    <mesh position={[0, 0.02, 0]} castShadow><cylinderGeometry args={[0.12, 0.14, 0.04, 40]} />{M.brass()}</mesh>
    <mesh position={[0, 0.28, 0]} castShadow><cylinderGeometry args={[0.012, 0.016, 0.5, 16]} />{M.brass()}</mesh>
    <mesh position={[0, 0.54, 0]}><sphereGeometry args={[0.02, 16, 12]} />{M.brass()}</mesh>
    <group position={[0, 0.53, 0]} rotation={[0, 0, tilt]}><mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.007, 0.007, arm * 2, 10]} />{M.brass()}</mesh></group>
    {[-1, 1].map((k) => { const x = k * Math.cos(tilt) * arm, y = 0.53 + k * Math.sin(tilt) * arm; return <group key={k} position={[x, y, 0]}>
      {[0, 1, 2].map((j) => <mesh key={j} position={[Math.cos(j * 2.1) * 0.035, -0.09, Math.sin(j * 2.1) * 0.035]} rotation={[Math.sin(j * 2.1) * 0.35, 0, -Math.cos(j * 2.1) * 0.35]}><cylinderGeometry args={[0.001, 0.001, 0.19, 4]} />{M.brass()}</mesh>)}
      <group position={[0, -0.18, 0]}>
        <mesh><cylinderGeometry args={[0.09, 0.07, 0.015, 36]} />{M.brass()}</mesh>
        {k < 0 && <group position={[0, 0.008 + (1 - cl(l)) * 0.25, 0]} visible={tt > 0.7}><Candle tt={tt} on={eio(tt, 1.2, 1.8)} h={0.1} /></group>}
        {k > 0 && <group position={[0, 0.03 + (1 - cl(r)) * 0.25, 0]} visible={tt > 1.9}><Roll s={1.2} /><Roll p={[0.03, 0.01, 0.03]} s={1.0} /></group>}
      </group>
    </group>; })}
    <Dots n={20} r={0.003} col="#ffe2a8" glow pos={(i) => [(rn(i, 2) - 0.5) * 0.9, 0.2 + ((tt * 0.04 + rn(i, 3)) % 1) * 0.6, (rn(i, 4) - 0.5) * 0.4]} op={0.3} />
  </>;
}}</Scene3D>;
