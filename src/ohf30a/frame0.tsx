// ohf30a · CUADRO 0 = la miniatura sin texto, rehecha en 3D: radiador de fundición blanco y escarchado a la izquierda,
// la válvula de bronce enorme al centro y la pared blanca a la derecha (donde va a estar él). F0 s después: CORTE SECO al avatar.
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, hexNutG, rn } from "./h3d";
import { Pipe } from "./okit";

const PI = Math.PI;
export const F0 = 1.2;
const H0 = { k: "f0", at: -4, out: 2 } as unknown as H;
const paint = (c = "#ebe6dc") => <meshStandardMaterial color={c} roughness={0.62} />;
const frost = (n: number, x0: number, x1: number, y0: number, y1: number, z: number, seed: number) => Array.from({ length: n }, (_, i) =>
  <mesh key={seed + i} position={[x0 + (x1 - x0) * rn(i, seed), y0 + (y1 - y0) * rn(i, seed + 1), z + 0.004 * rn(i, seed + 2)]}>
    <icosahedronGeometry args={[0.003 + 0.007 * rn(i, seed + 3) ** 2, 0]} /><meshStandardMaterial color="#f7fbff" roughness={0.3} emissive="#dfefff" emissiveIntensity={0.25} /></mesh>);

export const Frame0: React.FC<{ t: number }> = ({ t }) => <Scene3D t={t} h={H0} mode="iris" floor="none" wall="none" bg="#d8d3ca" key1={[-0.9, 1.6, 1.4]} warm={1.1}
  cam={{ at: [-0.03, 0.45, 0], az: [0.1, 0.02], el: [0.06, 0.04], r: [1.12, 1.02], fov: 32 }}>{() => <>
  {/* pared blanca y zócalo */}
  <mesh position={[0, 0.6, -0.3]} receiveShadow><planeGeometry args={[4, 2]} /><meshStandardMaterial color="#e9e5dd" roughness={0.9} /></mesh>
  <RBox s={[3, 0.12, 0.02]} p={[0.4, 0.06, -0.29]} r={0.004}>{paint("#e2ddd2")}</RBox>
  {/* radiador de columnas, pintado de blanco, cubierto de escarcha */}
  {Array.from({ length: 6 }, (_, i) => <group key={i} position={[-0.27 - i * 0.075, 0, -0.08]}>
    <RBox s={[0.062, 0.86, 0.14]} p={[0, 0.48, 0]} r={0.028}>{paint()}</RBox>
    {frost(90, -0.032, 0.032, 0.1, 0.88, 0.07, 10 + i * 7)}
  </group>)}
  {/* cuello de la válvula al radiador: tuerca escarchada + tuerca cromada */}
  <Pipe a={[-0.26, 0.36, -0.02]} b={[-0.05, 0.36, -0.02]} r={0.034} col="#b9a06a" />
  <mesh geometry={hexNutG(0.058, 0.07, 0.03)} position={[-0.21, 0.36, -0.02]} rotation={[0, 0, PI / 2]}><meshStandardMaterial color="#e8eef2" roughness={0.5} metalness={0.3} /></mesh>
  {frost(70, -0.25, -0.17, 0.31, 0.41, 0.04, 90)}
  <mesh geometry={hexNutG(0.05, 0.05, 0.03)} position={[-0.135, 0.36, -0.02]} rotation={[0, 0, PI / 2]}>{M.chrome({ col: "#d9dde0" })}</mesh>
  {/* la válvula de bronce, gigante en primer plano */}
  <group position={[0.0, 0, 0.0]}>
    <Pipe a={[0, 0.0, 0]} b={[0, 0.24, 0]} r={0.03} col="#f0ece4" />
    <mesh geometry={hexNutG(0.072, 0.07, 0.03)} position={[0, 0.235, 0]}>{M.brass({ col: "#b98a3c" })}</mesh>
    <mesh position={[0, 0.39, 0]} castShadow><cylinderGeometry args={[0.064, 0.07, 0.2, 40]} />{M.brass({ col: "#c4964a" })}</mesh>
    <mesh position={[-0.045, 0.36, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.04, 0.04, 0.06, 28]} />{M.brass({ col: "#c4964a" })}</mesh>
    <mesh position={[0, 0.505, 0]}><cylinderGeometry args={[0.078, 0.078, 0.032, 48]} />{M.brass({ col: "#e0b45a" })}</mesh>
    <mesh position={[0, 0.555, 0]}><cylinderGeometry args={[0.064, 0.068, 0.07, 12]} /><meshStandardMaterial color="#141414" roughness={0.35} /></mesh>
    <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.03, 0.04, 0.02, 24]} /><meshStandardMaterial color="#1c1c1c" roughness={0.4} /></mesh>
    <mesh position={[0, 0.645, 0]}><cylinderGeometry args={[0.011, 0.011, 0.08, 16]} />{M.steel()}</mesh>
    {/* la flechita fundida en el cuerpo */}
    <RBox s={[0.006, 0.05, 0.004]} p={[0, 0.33, 0.068]} r={0.002}>{M.brass({ col: "#8a6428" })}</RBox>
  </group>
</>}</Scene3D>;
