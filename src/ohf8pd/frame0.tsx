// ohf8pd · CUADRO 0 = la miniatura sin texto, rehecha en 3D: garaje, balde blanco, lata en alambre y rampa con listones. F0 s después: CORTE SECO al avatar.
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D } from "./h3d";
import { Bucket5, PI } from "./rkit";

export const F0 = 1.2;
const H0 = { k: "f0", at: -4, out: 2 } as unknown as H;

export const Frame0: React.FC<{ t: number }> = ({ t }) => <Scene3D t={t} h={H0} mode="iris" floor="counter" wall="none" key1={[0.8, 2.2, 2]}
  cam={{ at: [0.16, 0.55, 0], az: [0.14, 0.11], el: [0.14, 0.13], r: [2.14, 2.08], fov: 32 }}>{() => <>
  <RBox s={[4.6, 2.6, 0.06]} p={[-0.3, 1.3, -1.1]} r={0.004}><meshStandardMaterial color="#d9d3c6" roughness={0.85} /></RBox>
  <RBox s={[1.1, 1.9, 0.02]} p={[1.42, 0.95, -1.06]} r={0.002}><meshBasicMaterial color="#cfe0ad" /></RBox>
  <RBox s={[0.06, 2, 0.08]} p={[0.85, 1, -1.04]} r={0.006}>{M.steel({ col: "#9c9c94" })}</RBox>
  <RBox s={[3.2, 0.04, 0.06]} p={[-0.2, 1.92, -1.02]} r={0.006}>{M.steel({ col: "#9c9c94" })}</RBox>
  <RBox s={[0.1, 1.1, 0.04]} p={[0.62, 0.55, -1.0]} rot={[0, 0, 0.05]} r={0.006}>{M.wood({ rx: 1, ry: 5, base: [186, 142, 92] })}</RBox>
  <Bucket5 p={[-0.2, 0.05, 0]} s={1.9} />
  {[-0.52, 0.12].map((x) => <mesh key={x} position={[x, 1.08, 0]}><torusGeometry args={[0.07, 0.006, 8, 24, PI]} />{M.steel({ col: "#c8ccd0" })}</mesh>)}
  <mesh position={[-0.2, 1.11, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.005, 0.005, 0.84, 8]} />{M.steel({ col: "#c8ccd0" })}</mesh>
  <mesh position={[-0.2, 1.11, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.26, 40]} />{M.steel({ col: "#b9bec2" })}</mesh>
  <group position={[0.36, 0.52, 0.42]} rotation={[-0.3, 0.3, 0.22]}>
    <RBox s={[0.26, 1.04, 0.025]} r={0.005}>{M.wood({ rx: 1, ry: 3, base: [214, 178, 128] })}</RBox>
    {[-0.36, -0.1, 0.16, 0.4].map((y) => <RBox key={y} s={[0.24, 0.03, 0.02]} p={[0, y, 0.02]} r={0.004}>{M.wood({ rx: 1, ry: 1, base: [176, 132, 84] })}</RBox>)}
  </group>
</>}</Scene3D>;
