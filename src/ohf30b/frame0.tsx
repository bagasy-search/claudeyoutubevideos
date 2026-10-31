// ohf30b · CUADRO 0 = la miniatura sin texto, rehecha en 3D: radiador de vapor plateado bajo la ventana soleada, cortinas rojas,
// el nivel amarillo arriba, la cuña de madera bajo la pata y el piso de madera; a la derecha queda el lugar de él. F0 s: CORTE SECO.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, hexNutG, rn } from "./h3d";
import { Pipe } from "./okit";

const PI = Math.PI;
export const F0 = 1.2;
const H0 = { k: "f0", at: -4, out: 2 } as unknown as H;
const N = 15, X0 = -0.86, DX = 0.056, RW = 0.044, RH = 0.6;
const silver = <meshStandardMaterial color="#cfcfc9" metalness={0.85} roughness={0.32} />;
const Curtain: React.FC<{ x: number; w: number }> = ({ x, w }) => <group position={[x, 0, -0.18]}>
  {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-w / 2 + (i + 0.5) * w / 7, 0.95, 0.012 * Math.sin(i * 2.1)]} castShadow>
    <cylinderGeometry args={[w / 13, w / 12, 1.9, 14]} /><meshStandardMaterial color={i % 2 ? "#b8241f" : "#cf2e26"} roughness={0.85} /></mesh>)}
</group>;

export const Frame0: React.FC<{ t: number }> = ({ t }) => <Scene3D t={t} h={H0} mode="iris" floor="wood" wall="none" bg="#e8dcc4" key1={[0.6, 1.9, 1.3]} warm={1.15}
  cam={{ at: [-0.3, 0.43, 0.05], az: [-0.5, -0.45], el: [0.07, 0.06], r: [1.58, 1.5], fov: 32 }}>{() => <>
  {/* pared, antepecho de madera y la ventana con el sol de afuera */}
  <mesh position={[0, 1, -0.26]} receiveShadow><planeGeometry args={[5, 2.4]} /><meshStandardMaterial color="#d8c8a8" roughness={0.9} /></mesh>
  <RBox s={[1.3, 0.05, 0.12]} p={[-0.38, 0.8, -0.2]} r={0.008}>{M.wood({ base: [120, 70, 34] })}</RBox>
  <RBox s={[1.3, 0.12, 0.03]} p={[-0.38, 0.73, -0.24]} r={0.004}>{M.wood({ base: [110, 64, 30] })}</RBox>
  <mesh position={[-0.38, 1.25, -0.245]}><planeGeometry args={[1.16, 0.84]} /><meshBasicMaterial color="#f4f7e8" toneMapped={false} /></mesh>
  {[[-0.38, 0.84, 1.24, 0.06], [-0.38, 1.25, 1.24, 0.04], [-0.38, 1.66, 1.24, 0.06]].map(([x, y, w, h], i) => <RBox key={"h" + i} s={[w, h, 0.05]} p={[x, y, -0.22]} r={0.004}>{M.wood({ base: [128, 76, 36] })}</RBox>)}
  {[-0.98, -0.38, 0.22].map((x, i) => <RBox key={"v" + i} s={[0.06, 0.86, 0.05]} p={[x, 1.25, -0.22]} r={0.004}>{M.wood({ base: [128, 76, 36] })}</RBox>)}
  <Curtain x={-1.12} w={0.32} /><Curtain x={0.36} w={0.3} />
  {/* el radiador de columnas, plateado */}
  {Array.from({ length: N }, (_, i) => <group key={i} position={[X0 + i * DX, 0, 0]}>
    <RBox s={[RW, RH, 0.17]} p={[0, 0.1 + RH / 2, 0]} r={0.02}>{silver}</RBox>
    <mesh position={[0, 0.1 + RH, 0]}><sphereGeometry args={[RW * 0.52, 16, 12]} />{silver}</mesh>
  </group>)}
  <RBox s={[N * DX, 0.05, 0.08]} p={[X0 + (N - 1) * DX / 2, 0.14, 0]} r={0.02}>{silver}</RBox>
  {[X0 + 0.02, X0 + (N - 1) * DX - 0.02].map((x, i) => <RBox key={i} s={[0.05, 0.1, 0.07]} p={[x, 0.05 + (i ? 0.03 : 0), 0.02]} r={0.02}>{silver}</RBox>)}
  {/* la cuña de madera bajo la pata derecha */}
  <RBox s={[0.1, 0.03, 0.08]} p={[X0 + (N - 1) * DX - 0.02, 0.015, 0.03]} rot={[0, 0.1, 0]} r={0.004}>{M.wood({ base: [214, 176, 120] })}</RBox>
  {/* la válvula de bronce y el caño, abajo a la izquierda */}
  <Pipe a={[X0 - 0.03, 0.2, 0.02]} b={[X0 - 0.12, 0.2, 0.02]} r={0.026} col="#b08a48" />
  <mesh geometry={hexNutG(0.04, 0.05, 0.02)} position={[X0 - 0.12, 0.26, 0.02]}>{M.brass({ col: "#c39a4c" })}</mesh>
  <mesh position={[X0 - 0.12, 0.32, 0.02]}><cylinderGeometry args={[0.03, 0.03, 0.07, 20]} />{M.brass({ col: "#c9a050" })}</mesh>
  <Pipe a={[X0 - 0.12, 0.2, 0.02]} b={[X0 - 0.12, 0, 0.02]} r={0.026} col="#9a9a92" />
  {/* el nivel amarillo arriba, con sus burbujas verdes */}
  <group position={[X0 + 0.42, 0.1 + RH + 0.05, 0.0]} rotation={[0, 0, 0.004]}>
    <RBox s={[0.56, 0.06, 0.035]} r={0.006}><meshStandardMaterial color="#f2c21b" roughness={0.4} /></RBox>
    {[-0.2, 0, 0.2].map((x, i) => <mesh key={i} position={[x, 0, 0.019]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.05, 16]} /><meshPhysicalMaterial color="#9be04a" emissive="#5aa020" emissiveIntensity={0.4} roughness={0.1} transparent opacity={0.85} /></mesh>)}
    {[-0.28, 0.28].map((x, i) => <RBox key={i} s={[0.02, 0.064, 0.037]} p={[x, 0, 0]} r={0.004}><meshStandardMaterial color="#222" roughness={0.5} /></RBox>)}
  </group>
  {/* alfombra en la esquina */}
  <mesh position={[0.5, 0.002, 0.45]} rotation={[-PI / 2, 0, 0.3]} receiveShadow><planeGeometry args={[0.8, 0.6]} /><meshStandardMaterial color="#7a2a24" roughness={0.95} side={THREE.DoubleSide} /></mesh>
  {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[0.5 + (rn(i, 1) - 0.5) * 0.7, 0.003, 0.45 + (rn(i, 2) - 0.5) * 0.5]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.01 + 0.01 * rn(i, 3), 6]} /><meshStandardMaterial color={i % 2 ? "#d9b46a" : "#203a5a"} roughness={0.95} /></mesh>)}
</>}</Scene3D>;
