// ohf8pe · CUADRO 0 = la miniatura sin texto, rehecha en 3D: el colchón de arriba levantado, la tela con puntos a la luz de la linterna, ventana y lámpara detrás. F0 s después: CORTE SECO al avatar.
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D } from "./h3d";
import { PI, Specks, quilt } from "./bkit";

export const F0 = 1.2;
const H0 = { k: "f0", at: -4, out: 2 } as unknown as H;

export const Frame0: React.FC<{ t: number }> = ({ t }) => <Scene3D t={t} h={H0} mode="iris" floor="none" wall="none" bg="#e9e3d6" key1={[0.5, 2.6, 2.4]}
  cam={{ at: [0.02, 0.66, 0.3], az: [-0.3, -0.27], el: [0.37, 0.35], r: [1.76, 1.72], fov: 32 }}>{() => <>
  {/* cuarto: pared clara, ventana con jardín, lámpara */}
  <RBox s={[6, 3.4, 0.06]} p={[0, 1.2, -1.5]} r={0.004}><meshStandardMaterial color="#eeeae1" roughness={0.9} /></RBox>
  <RBox s={[0.86, 0.9, 0.03]} p={[0.2, 1.2, -1.45]} r={0.002}><meshBasicMaterial color="#cfe0b4" /></RBox>
  <RBox s={[0.05, 0.96, 0.05]} p={[0.2, 1.2, -1.42]} r={0.004}><meshStandardMaterial color="#f7f5ef" roughness={0.6} /></RBox>
  <RBox s={[0.92, 0.05, 0.05]} p={[0.2, 1.2, -1.42]} r={0.004}><meshStandardMaterial color="#f7f5ef" roughness={0.6} /></RBox>
  <group position={[1.05, 0.55, -1.15]}>
    <mesh><cylinderGeometry args={[0.09, 0.13, 0.5, 22]} /><meshStandardMaterial color="#5f7886" roughness={0.45} /></mesh>
    <mesh position={[0, 0.46, 0]}><cylinderGeometry args={[0.2, 0.28, 0.36, 28]} /><meshStandardMaterial color="#f8f1df" roughness={0.8} emissive="#f4dfb0" emissiveIntensity={0.3} /></mesh>
  </group>
  {/* colchón de abajo y la tela al descubierto */}
  <RBox s={[3.6, 0.42, 1.7]} p={[0, 0.21, 0]} r={0.05}>{quilt("f0b")}</RBox>
  <RBox s={[3.5, 0.012, 1.56]} p={[0, 0.426, 0]} r={0.003}><meshStandardMaterial color="#cfb88f" roughness={1} /></RBox>
  <Specks id={7} n={210} w={1.5} d={0.86} p={[-0.3, 0.435, 0.28]} size={0.0135} />
  <mesh position={[0.06, 0.4345, 0.32]} rotation={[-PI / 2, 0, 0]} scale={[1.5, 0.8, 1]}><circleGeometry args={[0.32, 40]} /><meshBasicMaterial color="#fff2c9" transparent opacity={0.62} depthWrite={false} /></mesh>
  {/* colchón de arriba, abierto desde adelante */}
  <group position={[0, 0.44, -0.7]} rotation={[-0.22, 0, 0.012]}>
    <RBox s={[3.6, 0.2, 1.3]} p={[0, 0.1, 0.65]} r={0.06}>{quilt("f0t", "#f4efe4", "#dcd5c5")}</RBox>
    <RBox s={[3.62, 0.022, 0.02]} p={[0, 0.02, 1.295]} r={0.006}><meshStandardMaterial color="#8d8a84" roughness={0.9} /></RBox>
  </group>
  {/* la linterna entra por la derecha */}
  <group position={[0.64, 0.6, 0.86]} rotation={[0.08, 0.3, PI / 2 - 0.2]}>
    <mesh castShadow><cylinderGeometry args={[0.06, 0.05, 0.34, 26]} />{M.matte({ col: "#17171a" })}</mesh>
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.085, 0.062, 0.08, 26]} />{M.matte({ col: "#222226" })}</mesh>
    <mesh position={[0, 0.242, 0]}><cylinderGeometry args={[0.078, 0.078, 0.004, 26]} /><meshBasicMaterial color="#fff6d8" /></mesh>
  </group>
</>}</Scene3D>;
