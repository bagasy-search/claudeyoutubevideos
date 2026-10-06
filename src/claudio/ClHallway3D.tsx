// ClHallway3D — el pasillo del hotel en 3D real (three.js): alfombra azul marino con guarda dorada, paredes crema con zócalo de
// madera, apliques que iluminan, puertas de madera con su plaqueta de latón numerada a los dos lados. La cámara avanza por el
// pasillo y cada puerta que pasa suma inodoros al contador (plaqueta grande) hasta `total`. Set-piece del "en el hotel eran 120".
//   total (120) · floor (3 = puertas 301…) · title rótulo de la plaqueta · sub nota a mano
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CL, LABEL, SERIF, HAND } from "./ClTheme";
import { Plaque, lin, pop } from "./ClParts";

const DOORS = 14, GAP = 3.2, W = 3.2, H = 3.1;
const Cam: React.FC<{ z: number; sway: number }> = ({ z, sway }) => {
  const { camera } = useThree(); camera.position.set(sway, 1.62, z); camera.lookAt(sway * 0.3, 1.45, z - 10); camera.updateProjectionMatrix(); return null;
};
const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, rep?: [number, number]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } t.anisotropy = 8; return t;
};

export const ClHallway3D: React.FC<{ total?: number; floor?: number; title?: string; sub?: string }> = ({ total = 120, floor = 3, title = "inodoros", sub = "cada uno, todos los días" }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: T, fps } = useVideoConfig();
  const k = interpolate(f, [0, T], [0, 1], { easing: Easing.inOut(Easing.quad) });
  const z = interpolate(k, [0, 1], [2, -GAP * (DOORS - 3)]);
  const sway = Math.sin(f * 0.06) * 0.05;
  const n = Math.min(total, Math.round(interpolate(f, [6, T * 0.82], [0, total], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })));
  const tex = useMemo(() => ({
    carpet: canvasTex(256, 256, (c) => { c.fillStyle = "#1E2D4F"; c.fillRect(0, 0, 256, 256); c.strokeStyle = "#B58B45"; c.lineWidth = 6; c.strokeRect(20, 20, 216, 216); c.beginPath(); c.moveTo(128, 50); c.lineTo(206, 128); c.lineTo(128, 206); c.lineTo(50, 128); c.closePath(); c.stroke(); c.fillStyle = "rgba(255,255,255,0.04)"; for (let i = 0; i < 400; i++) c.fillRect((i * 97) % 256, (i * 57) % 256, 2, 2); }, [2, 12]),
    wall: canvasTex(64, 64, (c) => { c.fillStyle = "#EFE6D6"; c.fillRect(0, 0, 64, 64); c.fillStyle = "rgba(160,140,110,0.06)"; for (let i = 0; i < 64; i += 4) c.fillRect(i, 0, 1, 64); }, [20, 2]),
    plaques: Array.from({ length: DOORS * 2 }, (_, i) => canvasTex(256, 128, (c) => { const g = c.createLinearGradient(0, 0, 256, 128); g.addColorStop(0, "#E3C27F"); g.addColorStop(0.5, "#B58B45"); g.addColorStop(1, "#8C6831"); c.fillStyle = g; c.fillRect(0, 0, 256, 128); c.fillStyle = "#2A1E0C"; c.font = "bold 78px Georgia"; c.textAlign = "center"; c.fillText(String(floor * 100 + 1 + i), 128, 92); })),
  }), [floor]);
  const mats = useMemo(() => ({
    carpet: new THREE.MeshStandardMaterial({ map: tex.carpet, roughness: 0.95 }),
    wall: new THREE.MeshStandardMaterial({ map: tex.wall, roughness: 0.9 }),
    ceil: new THREE.MeshStandardMaterial({ color: "#F6F1E7", roughness: 1 }),
    wood: new THREE.MeshStandardMaterial({ color: "#5A3A22", roughness: 0.55 }),
    frame: new THREE.MeshStandardMaterial({ color: "#3E2716", roughness: 0.5 }),
    base: new THREE.MeshStandardMaterial({ color: "#4A3020", roughness: 0.6 }),
    brass: new THREE.MeshStandardMaterial({ color: "#C9A35A", roughness: 0.3, metalness: 0.8 }),
    lamp: new THREE.MeshStandardMaterial({ color: "#FFF2D2", emissive: "#FFE2A8", emissiveIntensity: 1.6 }),
    plaque: tex.plaques.map((t: any) => new THREE.MeshStandardMaterial({ map: t, roughness: 0.35, metalness: 0.5 })),
  }), [tex]);
  const L = GAP * DOORS + 12;
  const p = pop(f, fps, 4);
  return (
    <AbsoluteFill style={{ backgroundColor: "#2A2418", overflow: "hidden" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 52, position: [0, 1.62, 2] }} gl={{ antialias: true }}>
        <Cam z={z} sway={sway} />
        <fog attach="fog" args={["#3A2E1E", 8, 34]} />
        <ambientLight intensity={0.45} color="#FFE9C8" />
        <mesh material={mats.carpet} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -L / 2 + 6]}><planeGeometry args={[W, L]} /></mesh>
        <mesh material={mats.ceil} rotation={[Math.PI / 2, 0, 0]} position={[0, H, -L / 2 + 6]}><planeGeometry args={[W, L]} /></mesh>
        <mesh material={mats.wall} rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, -L / 2 + 6]}><planeGeometry args={[L, H]} /></mesh>
        <mesh material={mats.wall} rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, -L / 2 + 6]}><planeGeometry args={[L, H]} /></mesh>
        <mesh material={mats.base} position={[-W / 2 + 0.02, 0.08, -L / 2 + 6]}><boxGeometry args={[0.04, 0.16, L]} /></mesh>
        <mesh material={mats.base} position={[W / 2 - 0.02, 0.08, -L / 2 + 6]}><boxGeometry args={[0.04, 0.16, L]} /></mesh>
        <mesh material={mats.wood} position={[0, H / 2, -L + 6.1]}><boxGeometry args={[W, H, 0.1]} /></mesh>
        {Array.from({ length: DOORS }, (_, i) => [-1, 1].map((side) => {
          const dz = -i * GAP - (side > 0 ? GAP / 2 : 0), x = side * (W / 2 - 0.03), idx = i * 2 + (side > 0 ? 1 : 0);
          return (
            <group key={i + "_" + side} position={[x, 0, dz]} rotation={[0, -side * Math.PI / 2, 0]}>
              <mesh material={mats.frame} position={[0, 1.08, 0.01]}><boxGeometry args={[1.12, 2.22, 0.04]} /></mesh>
              <mesh material={mats.wood} position={[0, 1.05, 0.04]}><boxGeometry args={[0.96, 2.1, 0.04]} /></mesh>
              <mesh material={mats.brass} position={[0.36, 1.0, 0.08]}><sphereGeometry args={[0.04, 12, 8]} /></mesh>
              <mesh material={mats.plaque[idx]} position={[0, 1.62, 0.065]}><planeGeometry args={[0.36, 0.18]} /></mesh>
              <mesh material={mats.lamp} position={[0.9, 2.15, 0.05]}><boxGeometry args={[0.14, 0.22, 0.08]} /></mesh>
              {i % 2 === 0 ? <pointLight position={[0.9, 2.1, 0.35]} intensity={1.6} distance={4.5} decay={1.8} color="#FFDCA0" /> : null}
            </group>
          );
        }))}
      </ThreeCanvas>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(10,8,4,0.45) 100%)" }} />
      <div style={{ position: "absolute", left: 110, bottom: 110, opacity: Math.min(1, p * 1.3), translate: `0 ${(1 - p) * 80}px`, rotate: "-1.5deg" }}>
        <Plaque style={{ padding: "18px 50px 12px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: "#2A1E0C", lineHeight: 1, fontVariantNumeric: "tabular-nums", minWidth: 250, textShadow: "0 2px 0 rgba(255,240,200,0.6)" }}>{n}</div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 64, color: "#2A1E0C", letterSpacing: 4, textTransform: "uppercase" }}>{title}</div>
          </div>
        </Plaque>
        {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CL.yellowSoft, marginTop: 14, marginLeft: 20, textShadow: "0 3px 12px rgba(0,0,0,0.6)", clipPath: `inset(0 ${100 - lin(f, T * 0.5, T * 0.7) * 100}% 0 0)` }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
