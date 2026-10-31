// ohf30d · CUADRO 0 = la miniatura sin texto, rehecha en 3D: el zócalo calefactor con la tapa de la punta sacada, los caños de
// cobre y la purga de bronce con la moneda en la ranura, el hilito de agua cayendo al táper transparente, y la ventana nevada arriba.
// A la derecha queda el lugar de él. F0 s después: CORTE SECO al avatar.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, rn, tubeG } from "./h3d";
import { BD, Baseboard, Coin, CoinVent, PY, RoomWall } from "./bbkit";

const PI = Math.PI;
export const F0 = 1.2;
const H0 = { k: "f0", at: -4, out: 2 } as unknown as H;
// con el espejo, la punta abierta queda a la derecha (x = +0.36)
const VX = 0.43, VY = PY + 0.034, VZ = BD / 2;

export const Frame0: React.FC<{ t: number }> = ({ t }) => <Scene3D t={t} h={H0} mode="iris" floor="wood" wall="none" bg="#2a2420" key1={[0.8, 1.3, 1.1]} warm={1.05} lamp={[0.9, 0.6, 0.4]}
  cam={{ at: [0.38, 0.12, 0.06], az: [0.42, 0.36], el: [0.2, 0.17], r: [0.64, 0.6], fov: 32 }}>{(tt) => <>
  <RoomWall col="#bcc6b8" />
  {/* la ventana nevada arriba a la izquierda */}
  <mesh position={[-0.2, 0.55, 0.0]}><planeGeometry args={[0.7, 0.5]} /><meshBasicMaterial color="#e8f0f6" toneMapped={false} /></mesh>
  {Array.from({ length: 60 }, (_, i) => { const u = (tt * (0.06 + 0.05 * rn(i, 3)) + rn(i, 4)) % 1;
    return <mesh key={"sn" + i} position={[-0.53 + 0.66 * rn(i, 5), 0.78 - u * 0.46, 0.003]}><circleGeometry args={[0.003 + 0.003 * rn(i, 6), 6]} /><meshBasicMaterial color="#9fb0bd" toneMapped={false} /></mesh>; })}
  {[[-0.2, 0.29, 0.8, 0.04], [-0.2, 0.81, 0.8, 0.04]].map(([x, y, w, h], i) => <RBox key={"wh" + i} s={[w, h, 0.05]} p={[x, y, 0.02]} r={0.004}><meshStandardMaterial color="#f2efe8" roughness={0.5} /></RBox>)}
  {[-0.58, 0.18].map((x, i) => <RBox key={"wv" + i} s={[0.04, 0.56, 0.05]} p={[x, 0.55, 0.02]} r={0.004}><meshStandardMaterial color="#f2efe8" roughness={0.5} /></RBox>)}
  <RBox s={[0.88, 0.025, 0.1]} p={[-0.2, 0.27, 0.05]} r={0.004}><meshStandardMaterial color="#f2efe8" roughness={0.5} /></RBox>
  {Array.from({ length: 24 }, (_, i) => <mesh key={"ss" + i} position={[-0.58 + 0.76 * rn(i, 7), 0.31 + 0.02 * rn(i, 8), 0.025]}><sphereGeometry args={[0.008 + 0.01 * rn(i, 9), 8, 6]} /><meshStandardMaterial color="#f7fafc" roughness={0.6} /></mesh>)}
  {/* el zócalo, espejado: la punta sin tapa queda a la derecha */}
  <group scale={[-1, 1, 1]}><Baseboard len={0.8} capL={1} heat={() => 0.6} dust={() => 0.3} /></group>
  <CoinVent p={[VX, PY + 0.011, VZ]} a={0.3} crust={0.3} />
  {/* la ménsula de chapa de la punta, con óxido, y el caño de retorno abajo con su unión de bronce */}
  <RBox s={[0.012, 0.23, 0.1]} p={[0.52, 0.12, 0.05]} r={0.002}><meshStandardMaterial color="#8a8d8c" metalness={0.6} roughness={0.55} /></RBox>
  {Array.from({ length: 22 }, (_, i) => <mesh key={"rs" + i} position={[0.513, 0.02 + 0.2 * rn(i, 30), 0.01 + 0.09 * rn(i, 31)]} rotation={[0, -PI / 2, 0]}><circleGeometry args={[0.003 + 0.006 * rn(i, 32), 7]} /><meshStandardMaterial color="#7a4a26" roughness={0.9} /></mesh>)}
  <mesh position={[0.42, PY - 0.045, VZ]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.011, 0.011, 0.2, 20]} /><meshStandardMaterial color="#b8703a" metalness={0.9} roughness={0.3} /></mesh>
  <mesh position={[0.46, PY - 0.045, VZ]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.017, 0.017, 0.03, 6]} />{M.brass({ col: "#c99a45" })}</mesh>
  {/* la moneda en la ranura de la purga */}
  <group position={[VX + 0.016, VY, VZ]} rotation={[0, 0, 0]}><Coin rot={[0, PI / 2, PI / 2]} s={1.1} /></group>
  {/* el hilito de agua y las gotas */}
  <mesh geometry={tubeG("f0stream", [[VX + 0.004, VY - 0.012, VZ + 0.006], [VX + 0.006, VY - 0.05, VZ + 0.01], [VX + 0.006, 0.03, VZ + 0.012]], 0.0018, 30, 8)}>{M.water({ op: 0.85 })}</mesh>
  {Array.from({ length: 5 }, (_, i) => { const u = (tt * 1.4 + i / 5) % 1; return <mesh key={"dp" + i} position={[VX + 0.006, VY - 0.02 - u * (VY - 0.05), VZ + 0.012]}><sphereGeometry args={[0.0032, 8, 8]} />{M.water({ op: 0.9 })}</mesh>; })}
  {/* el táper transparente con agua */}
  <group position={[VX + 0.006, 0, VZ + 0.012]}>
    <mesh position={[0, 0.035, 0]}><boxGeometry args={[0.13, 0.07, 0.1]} /><meshPhysicalMaterial color="#eef6fb" roughness={0.08} transparent opacity={0.28} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[0, 0.016, 0]}><boxGeometry args={[0.124, 0.03, 0.094]} />{M.water({ op: 0.5, col: "#cfe6f2" })}</mesh>
  </group>
</>}</Scene3D>;
