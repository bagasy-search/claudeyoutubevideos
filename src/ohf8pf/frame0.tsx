// ohf8pf · CUADRO 0 = la miniatura sin texto, rehecha en 3D: el piso de mármol del baño, el zócalo en diagonal, el inodoro al fondo, el frasco con cinta y el pececillo. F0 s después: CORTE SECO al avatar.
import React from "react";
import { H } from "./hkit";
import { RBox, Scene3D, tex } from "./h3d";
import { Fish, PI, TapeJar } from "./sfkit";

export const F0 = 1.2;
const H0 = { k: "f0", at: -4, out: 2 } as unknown as H;

const marble = () => tex.text("sfmar", 512, 512, (g) => {
  g.fillStyle = "#eae7e1"; g.fillRect(0, 0, 512, 512); g.lineCap = "round";
  for (let i = 0; i < 26; i++) { g.strokeStyle = `rgba(120,116,110,${0.08 + 0.18 * ((i * 37) % 10) / 10})`; g.lineWidth = 1 + (i % 3) * 1.4; g.beginPath(); let x = (i * 97) % 512, y = 0; g.moveTo(x, y); while (y < 512) { x += ((i * y * 13) % 60) - 30; y += 40; g.lineTo(x, y); } g.stroke(); }
});

export const Frame0: React.FC<{ t: number }> = ({ t }) => <Scene3D t={t} h={H0} mode="iris" floor="none" wall="none" bg="#ece9e3" key1={[0.4, 2.8, 2.2]}
  cam={{ at: [0.05, 0.34, 0], az: [0.36, 0.33], el: [0.18, 0.17], r: [1.72, 1.68], fov: 32 }}>{() => <>
  <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow><planeGeometry args={[7, 7]} /><meshStandardMaterial map={marble()} roughness={0.22} metalness={0.03} /></mesh>
  <RBox s={[0.06, 2.4, 6]} p={[-1.0, 1.2, 0]} r={0.004}><meshStandardMaterial color="#efece4" roughness={0.75} /></RBox>
  <RBox s={[0.05, 0.18, 6]} p={[-0.95, 0.092, 0]} r={0.012}><meshStandardMaterial color="#fbf9f3" roughness={0.45} /></RBox>
  <RBox s={[6, 2.4, 0.06]} p={[0, 1.2, -1.8]} r={0.004}><meshStandardMaterial color="#efece4" roughness={0.75} /></RBox>
  <RBox s={[6, 0.18, 0.05]} p={[0, 0.092, -1.75]} r={0.012}><meshStandardMaterial color="#fbf9f3" roughness={0.45} /></RBox>
  <RBox s={[0.76, 0.86, 0.03]} p={[-0.1, 1.42, -1.74]} r={0.006}><meshBasicMaterial color="#f7f8f6" /></RBox>
  <group position={[0.42, 0, -1.32]}>
    <mesh position={[0, 0.17, 0]} castShadow><cylinderGeometry args={[0.13, 0.17, 0.34, 28]} /><meshPhysicalMaterial color="#f7f6f1" roughness={0.12} clearcoat={1} /></mesh>
    <mesh position={[0, 0.39, 0.03]} scale={[1, 0.34, 1.26]}><cylinderGeometry args={[0.24, 0.2, 0.3, 36]} /><meshPhysicalMaterial color="#f7f6f1" roughness={0.12} clearcoat={1} /></mesh>
    <RBox s={[0.46, 0.46, 0.18]} p={[0, 0.66, -0.3]} r={0.03}><meshPhysicalMaterial color="#f7f6f1" roughness={0.12} clearcoat={1} /></RBox>
  </group>
  <TapeJar p={[-0.46, 0.003, 0.36]} r={0.15} h={0.3} tape={0} bread={0} />
  <mesh position={[-0.46, 0.27, 0.36]}><cylinderGeometry args={[0.156, 0.156, 0.075, 44, 1, true]} /><meshStandardMaterial color="#d6c090" roughness={0.95} side={2} /></mesh>
  <Fish p={[0.0, 0.004, 0.56]} ry={0.12} s={1.45} run={0.3} />
</>}</Scene3D>;
