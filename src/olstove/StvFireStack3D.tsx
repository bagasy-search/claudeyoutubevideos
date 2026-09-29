// StvFireStack3D — la PILA del fuego en 3D real, armada capa por capa y encendida desde ARRIBA (top-down).
// PAGO del guion: «big splits on the bottom… kindling on the very top… you light it from the top». Los troncos caen uno a uno,
// el papel prende arriba y el frente de fuego BAJA capa por capa (los troncos ya quemados se ponen brasa/carbón).
// mode "bottomUp" muestra lo contrario (astillas abajo, todo arde a la vez y el humo sube sin pasar por la llama).
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { OLE, rnd } from "./OleTheme";
import { CamRig, softTex, smooth, clamp01, noise1 } from "./OleDutchOven3D";
import { brickTex, barkTex, flameTex, stackFor, StoveMode } from "./StvStove3D";

export const StvFireStack3D: React.FC<{ mode?: "topDown" | "bottomUp"; igniteAt?: number; orbit?: number; burnSecs?: number; t0?: number; layerAt?: number[] }> = ({ mode = "topDown", igniteAt = 2.6, orbit = 1, burnSecs = 6, t0 = 0, layerAt }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const t = frame / fps + t0, dur = durationInFrames / fps + t0;
  const tex = useMemo(() => ({ brick: brickTex(), bark: barkTex(3), bark2: barkTex(31), fl: flameTex(), soft: softTex("rgba(255,255,255,0.95)") }), []);
  const logs = useMemo(() => stackFor(mode as StoveMode), [mode]);
  // orden de caída: de abajo hacia arriba
  const order = [...logs.keys()].sort((a, b) => logs[a].p[1] - logs[b].p[1]);
  const layerOf = (idx: number) => { const y = logs[idx].p[1]; return y < (mode === "topDown" ? 0.5 : 0.42) ? 0 : y < (mode === "topDown" ? 0.62 : 0.55) ? 1 : 2; };
  const fall = (idx: number) => { const k = order.indexOf(idx); const ta = layerAt ? layerAt[layerOf(idx)] + 0.18 * (k % 3) : 0.25 + k * 0.32; return smooth((t - ta) / 0.55); };
  // frente de fuego (y) : topDown baja desde el techo de la pila; bottomUp arde todo
  const topY = mode === "topDown" ? 0.78 : 0.68, botY = 0.34;
  const burn = clamp01((t - igniteAt) / burnSecs);
  const front = mode === "topDown" ? topY - (topY - botY) * Easing.inOut(Easing.sin)(burn) : botY + 0.1;
  const lit = t >= igniteAt;
  const ang = 0.55 + (t / dur) * 0.6 * orbit;
  const dist = 3.0 - 0.4 * smooth(t / dur);
  const pos: [number, number, number] = [Math.sin(ang) * dist, 1.9, Math.cos(ang) * dist];
  const target: [number, number, number] = [0, 0.66, 0];
  const flick = (i: number) => 0.8 + noise1(t * 9 + i * 3.1, 4 + i) * 0.5;
  const fireY = front;
  const nFl = 9;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, ${OLE.cream}, ${OLE.kraftL})` }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: pos, near: 0.1, far: 40 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamRig pos={pos} target={target} fov={32} />
        <hemisphereLight args={["#FFF4DE", "#8C6A48", 1.15]} />
        <directionalLight position={[-3, 5, 4]} intensity={1.5} color="#EAF1FF" />
        {/* piso de ladrillo refractario con ceniza */}
        <mesh position={[0, 0.3, 0]}><boxGeometry args={[1.7, 0.08, 1.2]} /><meshStandardMaterial map={tex.brick} roughness={0.95} /></mesh>
        <mesh position={[0, 0.345, 0]}><boxGeometry args={[1.5, 0.012, 1.0]} /><meshStandardMaterial color="#8E8B87" roughness={1} /></mesh>
        {logs.map((L, i) => {
          const f = fall(i);
          if (f <= 0.001) return null;
          const y = L.p[1] + (1 - f) * (1 - f) * 1.4;
          // ¿ya lo alcanzó el frente de fuego? (topDown: y del tronco por encima del frente)
          const reached = mode === "topDown" ? (lit && L.p[1] + 0.06 > front ? 1 : 0) : (lit ? 1 : 0);
          const sinceBurn = mode === "topDown" ? clamp01((front - (L.p[1] - 0.1)) * -4) : clamp01((t - igniteAt) / 4);
          const col = L.kind === "kin" ? "#C89A63" : "#B58A5A";
          return (
            <mesh key={i} position={[L.p[0], y, L.p[2]]} rotation={L.axis === "z" ? [Math.PI / 2, 0, 0] : [0, 0, Math.PI / 2]} scale={[1, 1, 1]}>
              <cylinderGeometry args={[L.r * 1.05, L.r * 1.05, L.len, 16]} />
              <meshStandardMaterial map={i % 2 ? tex.bark : tex.bark2} color={reached ? (sinceBurn > 0.5 ? "#3A2A20" : "#8A5A35") : col}
                emissive={reached ? "#FF5A14" : "#000000"} emissiveIntensity={reached ? 0.35 + 0.65 * (1 - Math.abs(sinceBurn - 0.5) * 2) : 0} roughness={0.9} />
            </mesh>
          );
        })}
        {/* mecha de papel (un giro) en la cima */}
        {mode === "topDown" && fall(order[order.length - 1]) > 0.5 && !lit ? (
          <mesh position={[0.05, 0.76, 0.02]} rotation={[0.3, 0.2, 1.1]}><cylinderGeometry args={[0.03, 0.02, 0.22, 8]} /><meshStandardMaterial color="#E9E4D6" roughness={1} /></mesh>
        ) : null}
        {/* llamas en el frente */}
        {lit ? Array.from({ length: nFl }, (_, i) => {
          const fx = -0.4 + i * 0.1 + (rnd(i * 5) - 0.5) * 0.05, fz = (rnd(i * 5 + 1) - 0.5) * 0.45;
          const grow = smooth((t - igniteAt) / 0.9);
          const h = (0.32 + 0.22 * noise1(t * 7 + i, 20 + i)) * grow * (mode === "bottomUp" ? 1.4 : 1);
          return (
            <sprite key={i} position={[fx, fireY + h / 2 + 0.03, fz]} scale={[0.26 * flick(i), h, 1]}>
              <spriteMaterial map={tex.fl} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.95} />
            </sprite>
          );
        }) : null}
        {lit ? <pointLight position={[0, fireY + 0.25, 0.2]} intensity={7 * (0.85 + 0.3 * noise1(t * 6, 3))} distance={4} decay={1.6} color="#FF8A33" /> : null}
        {/* brasitas que caen del frente hacia los troncos de abajo (top-down: la llama "pasa" el fuego hacia abajo) */}
        {lit && mode === "topDown" ? Array.from({ length: 16 }, (_, i) => {
          const u = ((t * 0.9 + rnd(i * 7 + 1)) % 1);
          return <sprite key={i} position={[-0.35 + rnd(i * 3) * 0.7, fireY - u * 0.28, (rnd(i * 3 + 2) - 0.5) * 0.4]} scale={[0.05, 0.05, 1]}><spriteMaterial map={tex.soft} color="#FF9A3A" transparent depthWrite={false} opacity={(1 - u) * 0.95} blending={THREE.AdditiveBlending} /></sprite>;
        }) : null}
        {/* humo: en top-down casi no se ve (atraviesa la llama); en bottom-up sube gris y espeso */}
        {lit ? Array.from({ length: 40 }, (_, i) => {
          const u = ((t * 0.5 + rnd(i * 11)) % 1);
          const y = fireY + 0.2 + u * 1.5;
          const op = mode === "topDown" ? 0.07 * (1 - u) : 0.5 * (1 - u * 0.6);
          return <sprite key={i} position={[(rnd(i * 2) - 0.5) * 0.4 + Math.sin(u * 6 + i) * 0.05, y, (rnd(i * 2 + 1) - 0.5) * 0.3]} scale={[0.2 + u * 0.5, 0.2 + u * 0.5, 1]}><spriteMaterial map={tex.soft} color={mode === "topDown" ? "#E6E2DA" : "#6B665F"} transparent depthWrite={false} opacity={op} /></sprite>;
        }) : null}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
export default StvFireStack3D;
