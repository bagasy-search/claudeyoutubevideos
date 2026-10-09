// OleStove3D — la cocina de hierro fundido de campamento (caldera + olla + pava + leña) que gira lentamente bajo la luz del farol.
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { rnd } from "./OleSupTheme";
import { CamRig, Motes, StoveModel, V3, canvasTex, dots, flick, softTex } from "./Ole3DKit";

export type OleStove3DProps = {
  /** vuelta completa cada N segundos (default 24) */
  turnSeconds?: number;
  /** ángulo inicial en radianes (default 0.5: 3/4 frontal) */
  startAngle?: number;
  /** cantidad de vapor 0..1 (default 1) */
  steam?: number;
  /** empujar la cámara (dolly) de 4.0 a 3.0 durante el componente (default true) */
  push?: boolean;
  /** true: vuelta completa (default false: vaivén ±1.1 rad para no mostrar la espalda) */
  fullTurn?: boolean;
  swing?: number;
};

export const OleStove3D: React.FC<OleStove3DProps> = ({ turnSeconds = 24, startAngle = 0.5, steam = 1, push = true, fullTurn = false, swing = 1.1 }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const T = useMemo(() => ({
    floor: canvasTex((c, W, H) => {
      c.fillStyle = "#33210F"; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? "#3F2B18" : "#372414"; c.fillRect(0, i * H / 6 + 2, W, H / 6 - 4); for (let k = 0; k < 16; k++) { c.strokeStyle = `rgba(15,8,3,${0.2 + rnd(i * 30 + k) * 0.3})`; c.lineWidth = 1 + rnd(k) * 2; const y = i * H / 6 + 6 + rnd(i * 40 + k + 2) * (H / 6 - 12); c.beginPath(); c.moveTo(0, y); c.lineTo(W, y + (rnd(k + i) - 0.5) * 8); c.stroke(); } }
      dots(c, W, H, 71, 300, "#1a0f07", 1, 4, 0.5);
    }, 512, 512, [4, 4]),
    wall: canvasTex((c, W, H) => {
      const rows = 4, rh = H / rows; c.fillStyle = "#8b8271"; c.fillRect(0, 0, W, H);
      for (let r = 0; r < rows; r++) { const y0 = r * rh + 6, h = rh - 12; const g = c.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, "#33231a"); g.addColorStop(0.2, "#6b4e38"); g.addColorStop(0.5, "#7a5a41"); g.addColorStop(0.88, "#4a3324"); g.addColorStop(1, "#2a190d"); c.fillStyle = g; c.fillRect(0, y0, W, h); for (let i = 0; i < 22; i++) { c.strokeStyle = `rgba(20,10,4,${0.25 + rnd(r * 99 + i) * 0.35})`; c.lineWidth = 1 + rnd(i + r) * 2; const y = y0 + 6 + rnd(r * 50 + i + 3) * (h - 12); c.beginPath(); c.moveTo(rnd(i * 7 + r) * W * 0.3, y); c.lineTo(W * (0.6 + rnd(i + r * 3) * 0.4), y + (rnd(i) - 0.5) * 6); c.stroke(); } c.fillStyle = "#a89c84"; c.fillRect(0, r * rh - 5, W, 11); }
    }, 1024, 512, [3, 2]),
  }), []);
  const ang = fullTurn ? startAngle + (t / turnSeconds) * Math.PI * 2 : startAngle + Math.sin((t / turnSeconds) * Math.PI * 2) * swing;
  const dist = push ? 3.1 - 0.6 * Math.min(1, frame / Math.max(1, durationInFrames)) : 3.4;
  const pos: V3 = [Math.sin(ang) * dist, 1.55 + Math.sin(t * 0.5) * 0.04, Math.cos(ang) * dist];
  const look: V3 = [0, 0.85, 0];
  const f = flick(frame, 9);
  const soft = softTex();
  return (
    <AbsoluteFill style={{ background: "#150C06" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 36, position: pos, near: 0.1, far: 40 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamRig pos={pos} look={look} />
        <color attach="background" args={["#150C06"]} />
        <fog attach="fog" args={["#2a1a10", 7, 16]} />
        <hemisphereLight args={["#8A8F9C", "#3A2410", 1.1]} />
        <pointLight position={[Math.sin(ang) * 1.8, 2.4, Math.cos(ang) * 1.8]} color="#FFBE78" intensity={30 * flick(frame, 1)} distance={9} decay={1.4} />
        <directionalLight position={[Math.sin(ang + 0.8) * 4, 4, Math.cos(ang + 0.8) * 4]} intensity={0.9} color="#FFE0B8" />
        <pointLight position={[-2.2, 1.2, -1.0]} color="#7FA0CC" intensity={2.2} distance={8} decay={1.5} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}><planeGeometry args={[14, 14]} /><meshStandardMaterial map={T.floor} roughness={0.9} /></mesh>
        {/* cuatro paredes de troncos alrededor (la cámara gira) */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[Math.sin(i * Math.PI / 2) * 6.5, 2.2, Math.cos(i * Math.PI / 2) * 6.5]} rotation={[0, i * Math.PI / 2 + Math.PI, 0]}><planeGeometry args={[13, 4.4]} /><meshStandardMaterial map={T.wall} roughness={0.95} /></mesh>
        ))}
        <StoveModel frame={frame} fps={fps} steam={steam} light />
        <sprite position={[-0.22, 0.58, 0.55]} scale={[1.6 * f, 1.0 * f, 1]}><spriteMaterial map={soft} color="#FF7A22" transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0.0]}><circleGeometry args={[0.85, 24]} /><meshBasicMaterial color="#000000" transparent opacity={0.22} depthWrite={false} /></mesh>
        <Motes frame={frame} center={[0, 0.2, 0]} span={[5, 3, 5]} n={70} seed={5} opacity={0.5} size={0.04} />
      </ThreeCanvas>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 48%, rgba(8,3,0,0.6) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
