// Piezas 3D compartidas del jamón (LorHam3D, LorRoaster3D): domo de jamón en espiral con su capa de glaseado, ranurado en
// rombos y clavos, la fuente de aluminio y la cámara. three.js real, todo por props/cuadro (nunca Math.random).
import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { canvasTex, dots } from "./lor3dutil";

export const HAMS = { x: 1.5, y: 1.0, z: 1.1 }; // semiejes del domo
export const PAN = { w: 4.1, d: 3.0, wall: 0.4, thick: 0.1 };
export const domeH = (x: number, z: number) => HAMS.y * Math.sqrt(Math.max(0, 1 - (x / HAMS.x) ** 2 - (z / HAMS.z) ** 2));

export const Cam: React.FC<{ pos: [number, number, number]; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree();
  camera.position.set(pos[0], pos[1], pos[2]); camera.lookAt(target[0], target[1], target[2]); camera.updateProjectionMatrix();
  return null;
};

export const useHamMats = () => useMemo(() => {
  const flesh = canvasTex((c, S) => {
    const g = c.createLinearGradient(0, 0, 0, S); g.addColorStop(0, "#E9A596"); g.addColorStop(1, "#D98676"); c.fillStyle = g; c.fillRect(0, 0, S, S);
    dots(c, S, 3, 500, "#F3C1B2", 1, 3, 0.35);
    c.strokeStyle = "rgba(150,70,60,0.55)"; c.lineWidth = 3; for (let y = 12; y < S; y += 26) { c.beginPath(); c.moveTo(0, y); c.lineTo(S, y + 6); c.stroke(); }
  }, 512, 1);
  const glaze = canvasTex((c, S) => {
    const g = c.createRadialGradient(S * 0.5, S * 0.5, 10, S * 0.5, S * 0.5, S * 0.7); g.addColorStop(0, "#C97A22"); g.addColorStop(0.6, "#A8541A"); g.addColorStop(1, "#7A3A12"); c.fillStyle = g; c.fillRect(0, 0, S, S);
    dots(c, S, 7, 260, "#E9A94E", 1, 4, 0.5); dots(c, S, 17, 160, "#5E2A0C", 1, 3, 0.4);
  }, 512, 1);
  const score = canvasTex((c, S) => {
    c.clearRect(0, 0, S, S); c.strokeStyle = "rgba(70,30,10,0.85)"; c.lineWidth = 5;
    for (let k = -S; k < S * 2; k += 46) { c.beginPath(); c.moveTo(k, 0); c.lineTo(k + S, S); c.stroke(); c.beginPath(); c.moveTo(k + S, 0); c.lineTo(k, S); c.stroke(); }
  }, 512, 1);
  return {
    flesh: new THREE.MeshStandardMaterial({ map: flesh, roughness: 0.55 }),
    glaze: new THREE.MeshStandardMaterial({ map: glaze, roughness: 0.28, metalness: 0.1, transparent: true, opacity: 0 }),
    score: new THREE.MeshStandardMaterial({ map: score, transparent: true, opacity: 0, roughness: 0.6, depthWrite: false }),
    clove: new THREE.MeshStandardMaterial({ color: "#2A1A12", roughness: 0.5 }),
    alu: new THREE.MeshStandardMaterial({ color: "#C9CCD0", roughness: 0.38, metalness: 0.65, side: THREE.DoubleSide }),
    juice: new THREE.MeshStandardMaterial({ color: "#B87A24", roughness: 0.12, metalness: 0.05, transparent: true, opacity: 0.85 }),
  };
}, []);

// jamón: domo rosado + capa de glaseado (opacidad = glaze) + rombos (opacidad = score) + clavos (cantidad = cloves, 0..1)
export const HamMesh: React.FC<{ mats: any; glaze: number; score: number; cloves: number; capTheta?: number; position?: [number, number, number] }> = ({ mats, glaze, score, cloves, capTheta = 1.0, position = [0, PAN.thick, 0] }) => {
  const geo = useMemo(() => ({ dome: new THREE.SphereGeometry(1, 56, 36, 0, Math.PI * 2, 0, Math.PI / 2), cap: new THREE.SphereGeometry(1.012, 56, 24, 0, Math.PI * 2, 0, capTheta), cloveG: new THREE.SphereGeometry(0.035, 10, 8) }), [capTheta]);
  mats.glaze.opacity = Math.max(0, Math.min(1, glaze)); mats.score.opacity = Math.max(0, Math.min(1, score));
  const N = 28, shown = Math.floor(cloves * N);
  const pts = useMemo(() => Array.from({ length: N }).map((_, i) => { const ring = i % 4, k = Math.floor(i / 4); const th = 0.18 + ring * 0.2, ph = (k / 7) * Math.PI * 2 + ring * 0.45; return [Math.sin(th) * Math.cos(ph) * HAMS.x * 1.02, Math.cos(th) * HAMS.y * 1.02, Math.sin(th) * Math.sin(ph) * HAMS.z * 1.02] as [number, number, number]; }), []);
  return (
    <group position={position}>
      <mesh geometry={geo.dome} material={mats.flesh} scale={[HAMS.x, HAMS.y, HAMS.z]} />
      <mesh geometry={geo.cap} material={mats.glaze} scale={[HAMS.x, HAMS.y, HAMS.z]} />
      <mesh geometry={geo.cap} material={mats.score} scale={[HAMS.x * 1.006, HAMS.y * 1.006, HAMS.z * 1.006]} />
      {pts.slice(0, shown).map((p, i) => <mesh key={i} geometry={geo.cloveG} material={mats.clove} position={p} />)}
    </group>
  );
};

export const PanMesh: React.FC<{ mats: any }> = ({ mats }) => {
  const { w, d, wall, thick } = PAN;
  return (
    <group>
      <mesh material={mats.alu} position={[0, thick / 2, 0]}><boxGeometry args={[w, thick, d]} /></mesh>
      <mesh material={mats.alu} position={[0, wall / 2, d / 2]}><boxGeometry args={[w, wall, thick]} /></mesh>
      <mesh material={mats.alu} position={[0, wall / 2, -d / 2]}><boxGeometry args={[w, wall, thick]} /></mesh>
      <mesh material={mats.alu} position={[w / 2, wall / 2, 0]}><boxGeometry args={[thick, wall, d]} /></mesh>
      <mesh material={mats.alu} position={[-w / 2, wall / 2, 0]}><boxGeometry args={[thick, wall, d]} /></mesh>
    </group>
  );
};
