// ohf8pc · CUADRO 0 = la miniatura sin texto, rehecha en 3D: la hoja de roble con paneles, marco blanco, pared crema con zócalo, línea de luz abajo y el burlete negro en la mano.
import React from "react";
import { H } from "./hkit";
import { RBox, Scene3D } from "./h3d";
import { Hand } from "./okit";
import { DW, Leaf, Light, Saddle, Sweep } from "./doorkit";

export const F0 = 1.2;
const H0 = { k: "f0", at: -4, out: 2 } as unknown as H;

export const Frame0: React.FC<{ t: number }> = ({ t }) => <Scene3D t={t} h={H0} mode="iris" floor="oak" wall="none" bg="#e6dcc4" key1={[-0.8, 2.2, 2.2]}
  cam={{ at: [0.28, 0.42, 0.02], az: [-0.3, -0.29], el: [0.15, 0.15], r: [1.5, 1.48], fov: 32 }}>{() => <>
  <RBox s={[1.6, 2.4, 0.06]} p={[-DW / 2 - 0.92, 1.2, -0.06]} r={0.004}><meshStandardMaterial color="#e6dcc4" roughness={0.9} /></RBox>
  <RBox s={[1.58, 0.22, 0.03]} p={[-DW / 2 - 0.92, 0.11, -0.012]} r={0.006}><meshStandardMaterial color="#f1ebdc" roughness={0.55} /></RBox>
  <RBox s={[0.15, 2.4, 0.07]} p={[-DW / 2 - 0.05, 1.2, 0.0]} r={0.01}><meshStandardMaterial color="#f4f0e4" roughness={0.45} /></RBox>
  <RBox s={[0.03, 2.4, 0.08]} p={[-DW / 2 - 0.09, 1.2, 0.003]} r={0.006}><meshStandardMaterial color="#e1dbcb" roughness={0.45} /></RBox>
  <Leaf p={[0, 0.07, 0]} />
  <Saddle p={[0, 0, 0.02]} d={0.2} h={0.05} scoop={0.008} w={DW + 0.2} />
  <group position={[0, 0.004, 0.018]}><Light a={0.02} b={0.05} c={0.034} y={0.05} /></group>
  <group position={[0.02, 0.078, 0.11]} rotation={[0, 0.34, 0.14]}><Sweep w={0.62} bend={0.1} /></group>
  <Hand p={[0.42, 0.11, 0.26]} rot={[0.2, -0.3, 1.7]} s={1.2} bend={0.75} />
  <Hand p={[0.34, 0.04, 0.32]} rot={[0.3, -0.2, 1.35]} s={1.2} bend={0.65} />
</>}</Scene3D>;
