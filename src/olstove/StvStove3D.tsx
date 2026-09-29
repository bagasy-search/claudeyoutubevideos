// StvStove3D — la estufa de hierro en CORTE (3D real, three.js) con el flujo de aire y de humo.
// PAGO del guion: «light it from the top» → el humo tiene que pasar POR las llamas (top-down) vs. el humo que sube
// derecho por el caño sin quemarse (bottom-up), y el fuego «dormido» (regulador cerrado de más) que ahuma y ensucia el caño.
// Todo determinista por useCurrentFrame (nada de useFrame / Math.random: el farm rinde en chunks).
// `mode`: "bottomUp" | "topDown" | "smolder" | "split" (dos estufas lado a lado: bottom-up vs top-down).
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { OLE, rnd } from "./OleTheme";
import { CamRig, canvasTex, dots, softTex, smooth, clamp01, noise1 } from "./OleDutchOven3D";

export type StoveMode = "bottomUp" | "topDown" | "smolder";

export const brickTex = () => canvasTex((c, W, H) => {
  c.fillStyle = "#9A5A3C"; c.fillRect(0, 0, W, H);
  const bh = H / 8, bw = W / 4;
  for (let r = 0; r < 8; r++) for (let k = -1; k < 5; k++) {
    const x = k * bw + (r % 2 ? bw / 2 : 0), y = r * bh;
    const v = 0.85 + rnd(r * 13 + k * 7) * 0.3;
    c.fillStyle = `rgb(${Math.round(160 * v)},${Math.round(92 * v)},${Math.round(62 * v)})`;
    c.fillRect(x + 3, y + 3, bw - 6, bh - 6);
  }
  dots(c, W, H, 5, 220, "rgba(60,30,20,0.35)", 1, 3.5);
}, 256, 256, 1, 1);
export const ironTex = () => canvasTex((c, W, H) => {
  c.fillStyle = "#2B2826"; c.fillRect(0, 0, W, H);
  dots(c, W, H, 11, 900, "rgba(70,66,62,0.55)", 0.6, 2.2);
  dots(c, W, H, 12, 500, "rgba(10,10,10,0.55)", 0.6, 2.4);
  const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, "rgba(255,255,255,0.05)"); g.addColorStop(0.5, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(0,0,0,0.12)");
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}, 256, 256, 2, 2);
export const barkTex = (seed: number) => canvasTex((c, W, H) => {
  c.fillStyle = "#6E4A2B"; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 60; i++) { c.strokeStyle = `rgba(${30 + rnd(seed + i) * 40},${18 + rnd(seed + i + 9) * 20},10,0.5)`; c.lineWidth = 1 + rnd(seed + i + 4) * 3; c.beginPath(); const x = rnd(seed + i + 2) * W; c.moveTo(x, 0); c.lineTo(x + (rnd(seed + i + 7) - 0.5) * 30, H); c.stroke(); }
}, 128, 128);
export const flameTex = () => canvasTex((c, W, H) => {
  const g = c.createRadialGradient(W / 2, H * 0.62, 2, W / 2, H * 0.62, W * 0.5);
  g.addColorStop(0, "rgba(255,250,210,1)"); g.addColorStop(0.25, "rgba(255,196,80,0.95)"); g.addColorStop(0.6, "rgba(240,110,30,0.6)"); g.addColorStop(1, "rgba(200,50,10,0)");
  c.fillStyle = g;
  c.beginPath(); c.moveTo(W / 2, 4); c.bezierCurveTo(W * 0.92, H * 0.45, W * 0.98, H * 0.9, W / 2, H - 2); c.bezierCurveTo(W * 0.02, H * 0.9, W * 0.08, H * 0.45, W / 2, 4); c.fill();
}, 128, 192);

/** troncos de la pila según el modo: top-down = gruesos abajo y astillas arriba; bottom-up = astillas abajo, gruesos arriba */
export function stackFor(mode: StoveMode) {
  const logs: { p: [number, number, number]; r: number; len: number; axis: "z" | "x"; kind: "log" | "kin" }[] = [];
  const big = (x: number, y: number, r = 0.085) => logs.push({ p: [x, y, 0], r, len: 0.78, axis: "z", kind: "log" });
  const cross = (z: number, y: number) => logs.push({ p: [0, y, z], r: 0.065, len: 0.95, axis: "x", kind: "log" });
  const kin = (x: number, y: number, z: number) => logs.push({ p: [x, y, z], r: 0.022, len: 0.7, axis: "z", kind: "kin" });
  if (mode === "topDown") {
    big(-0.2, 0.42); big(0.2, 0.42); big(0, 0.42, 0.075);
    cross(-0.2, 0.575); cross(0.2, 0.575);
    for (let i = 0; i < 6; i++) kin(-0.32 + i * 0.13, 0.685 + (i % 2) * 0.03, 0);
  } else {
    for (let i = 0; i < 6; i++) kin(-0.32 + i * 0.13, 0.36 + (i % 2) * 0.03, 0);
    cross(-0.2, 0.47); cross(0.2, 0.47);
    big(-0.2, 0.6); big(0.2, 0.6); big(0, 0.6, 0.075);
  }
  return logs;
}

const FLAME_Y: Record<StoveMode, [number, number]> = { topDown: [0.72, 1.06], bottomUp: [0.36, 0.86], smolder: [0.4, 0.6] };

const Stove: React.FC<{ mode: StoveMode; t: number; x?: number; s?: number; air?: number; doorOpen?: boolean; front?: boolean }> = ({ mode, t, x = 0, s = 1, air = 1, doorOpen = true, front = true }) => {
  const tex = useMemo(() => ({ brick: brickTex(), iron: ironTex(), fl: flameTex(), soft: softTex("rgba(255,255,255,0.95)"), bark: barkTex(3), bark2: barkTex(31) }), []);
  const logs = useMemo(() => stackFor(mode), [mode]);
  const [fy0, fy1] = FLAME_Y[mode];
  const strength = mode === "smolder" ? 0.35 : 1;
  const iron = <meshStandardMaterial map={tex.iron} color="#8a8480" roughness={0.75} metalness={0.5} />;
  const W = 1.5, D = 1.0, Y0 = 0.25, Y1 = 1.25;
  const collar: [number, number, number] = [0, Y1, -0.18];
  const flick = (i: number) => 0.78 + noise1(t * 9 + i * 3.7, 4 + i) * 0.5;

  // humo: 84 partículas por estufa, camino determinista
  const N = 84;
  const smoke = Array.from({ length: N }, (_, i) => {
    const life = mode === "smolder" ? 4.6 : 3.6;
    const u = ((t + rnd(i * 5 + 1) * life) % life) / life;
    const sx = (rnd(i * 5 + 2) - 0.5) * 0.7, sz = (rnd(i * 5 + 3) - 0.5) * 0.4;
    const y0 = mode === "topDown" ? 0.5 + rnd(i * 5 + 4) * 0.22 : 0.72 + rnd(i * 5 + 4) * 0.22;
    const a = u < 0.42 ? smooth(u / 0.42) : 1;
    let px: number, py: number, pz: number;
    if (u < 0.42) { px = sx * (1 - a) + collar[0] * a; pz = sz * (1 - a) + collar[2] * a; py = y0 + (Y1 - y0) * (a * 0.9 + 0.1 * a * a) + Math.sin(u * 11 + i) * 0.03; }
    else { const b = (u - 0.42) / 0.58; px = Math.sin(b * 5 + i) * 0.04 * b; pz = collar[2]; py = Y1 + b * 2.55; }
    const inFlame = mode === "topDown" && py > fy0 - 0.02 && py < fy1 + 0.12 && u < 0.42;
    const after = mode === "topDown" && u >= 0.34;   // ya pasó por la llama: humo quemado, casi invisible
    let op: number, col: string, size: number;
    if (mode === "topDown") {
      if (inFlame) { op = 0.75; col = "#FFB35A"; size = 0.28; }
      else if (after) { op = 0.10 + 0.10 * (1 - u); col = "#EEEAE4"; size = 0.16 + u * 0.22; }
      else { op = 0.42; col = "#9C968F"; size = 0.2; }
    } else if (mode === "bottomUp") { op = 0.8 - u * 0.15; col = "#4F4B45"; size = 0.26 + u * 0.7; }
    else { op = 0.68 - u * 0.1; col = "#3B3733"; size = 0.28 + u * 0.75; }
    if (u < 0.05) op *= u / 0.05;
    return { key: i, pos: [px, py, pz] as [number, number, number], op: op * (u > 0.93 ? (1 - u) / 0.07 : 1), col, size, add: inFlame };
  });
  // aire primario: entra por la tomilla del frente, pasa por debajo de la pila y sube por las brasas
  const NA = Math.round(14 * air);
  const airp = Array.from({ length: NA }, (_, i) => {
    const u = ((t * (0.35 + 0.35 * air) + rnd(i * 3 + 90)) % 1);
    const px = -1.05 + u * 1.05 + (u > 0.55 ? (rnd(i) - 0.5) * 0.5 * (u - 0.55) : 0);
    const py = u < 0.55 ? 0.34 + Math.sin(u * 9 + i) * 0.015 : 0.34 + (u - 0.55) * (fy0 + 0.05 - 0.34) / 0.45;
    return { key: i, pos: [px, py, 0.42 - (rnd(i + 4) * 0.7)] as [number, number, number], op: Math.sin(u * Math.PI) * 0.9 };
  });

  return (
    <group position={[x, 0, 0]} scale={s}>
      {/* patas, losa y sombra */}
      {[[-0.62, -0.38], [0.62, -0.38], [-0.62, 0.38], [0.62, 0.38]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, Y0 / 2, lz]}><cylinderGeometry args={[0.05, 0.07, Y0, 10]} />{iron}</mesh>
      ))}
      <mesh position={[0, 0.02, 0.05]} receiveShadow><boxGeometry args={[2.3, 0.04, 1.7]} /><meshStandardMaterial color="#C7BBA6" roughness={0.95} /></mesh>
      {/* cuerpo abierto al frente (corte) */}
      <mesh position={[0, Y0, 0]}><boxGeometry args={[W, 0.06, D]} />{iron}</mesh>
      <mesh position={[-W / 2 + 0.03, (Y0 + Y1) / 2, 0]}><boxGeometry args={[0.06, Y1 - Y0, D]} />{iron}</mesh>
      <mesh position={[W / 2 - 0.03, (Y0 + Y1) / 2, 0]}><boxGeometry args={[0.06, Y1 - Y0, D]} />{iron}</mesh>
      <mesh position={[0, (Y0 + Y1) / 2, -D / 2 + 0.03]}><boxGeometry args={[W, Y1 - Y0, 0.06]} />{iron}</mesh>
      <mesh position={[0, Y1 + 0.03, 0]}><boxGeometry args={[W + 0.08, 0.07, D + 0.08]} />{iron}</mesh>
      {/* tapa del caño y caño */}
      <mesh position={[collar[0], Y1 + 0.1, collar[2]]}><cylinderGeometry args={[0.16, 0.19, 0.1, 20]} />{iron}</mesh>
      <mesh position={[collar[0], Y1 + 1.55, collar[2]]}><cylinderGeometry args={[0.135, 0.135, 3.1, 24, 1, true]} /><meshStandardMaterial map={tex.iron} color="#6d6863" roughness={0.6} metalness={0.6} side={THREE.DoubleSide} /></mesh>
      {/* ladrillo refractario */}
      <mesh position={[0, Y0 + 0.06, 0]}><boxGeometry args={[W - 0.16, 0.06, D - 0.16]} /><meshStandardMaterial map={tex.brick} roughness={0.95} /></mesh>
      <mesh position={[0, (Y0 + Y1) / 2 + 0.03, -D / 2 + 0.075]}><boxGeometry args={[W - 0.16, Y1 - Y0 - 0.12, 0.04]} /><meshStandardMaterial map={tex.brick} roughness={0.95} /></mesh>
      {/* brasas */}
      <mesh position={[0, Y0 + 0.11, 0]}><boxGeometry args={[W - 0.3, 0.03, D - 0.35]} /><meshStandardMaterial color="#3A1608" emissive="#FF5A14" emissiveIntensity={0.9 * strength} roughness={1} /></mesh>
      {/* pila de leña */}
      {logs.map((L, i) => (
        <mesh key={i} position={L.p} rotation={L.axis === "z" ? [Math.PI / 2, 0, 0] : [0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[L.r, L.r, L.len, 14]} />
          <meshStandardMaterial map={L.kind === "log" ? (i % 2 ? tex.bark : tex.bark2) : tex.bark} color={L.kind === "kin" ? "#C89A63" : "#B58A5A"} emissive={mode === "topDown" && L.p[1] > 0.6 ? "#FF7A20" : "#000000"} emissiveIntensity={0.55} roughness={0.9} />
        </mesh>
      ))}
      {/* llamas */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const fx = -0.36 + i * 0.145, h = (fy1 - fy0) * (0.65 + 0.5 * noise1(t * 7 + i, 8 + i)) * strength;
        return (
          <sprite key={i} position={[fx, fy0 + h / 2, 0.02 + (i % 2) * 0.05]} scale={[0.4 * flick(i), h + 0.14, 1]}>
            <spriteMaterial map={tex.fl} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.95} />
          </sprite>
        );
      })}
      <pointLight position={[0, (fy0 + fy1) / 2, 0.3]} intensity={5.5 * strength * (0.85 + 0.3 * noise1(t * 6, 2))} distance={4} decay={1.6} color="#FF8A33" />
      {/* aire y humo */}
      {airp.map((a) => (
        <sprite key={"a" + a.key} position={a.pos} scale={[0.085, 0.085, 1]}><spriteMaterial map={tex.soft} color="#CFE8FF" transparent depthWrite={false} opacity={a.op} /></sprite>
      ))}
      {smoke.map((p) => (
        <sprite key={"s" + p.key} position={p.pos} scale={[p.size, p.size, 1]}>
          <spriteMaterial map={tex.soft} color={p.col} transparent depthWrite={false} opacity={clamp01(p.op)} blending={p.add ? THREE.AdditiveBlending : THREE.NormalBlending} />
        </sprite>
      ))}
      {/* puerta abierta hacia el costado (bisagra a la derecha) con su mica */}
      {front && doorOpen ? (
        <group position={[W / 2 + 0.02, (Y0 + Y1) / 2, D / 2]} rotation={[0, -1.7, 0]}>
          <mesh position={[-0.33, 0, 0]}><boxGeometry args={[0.66, Y1 - Y0 - 0.06, 0.04]} />{iron}</mesh>
          <mesh position={[-0.33, 0.02, 0.025]}><boxGeometry args={[0.38, 0.32, 0.01]} /><meshStandardMaterial color="#F0B267" emissive="#FF9A3A" emissiveIntensity={0.6} transparent opacity={0.7} /></mesh>
        </group>
      ) : null}
    </group>
  );
};

export type Stove3DProps = { mode?: StoveMode | "split"; air?: number; dolly?: number; leftMode?: StoveMode; rightMode?: StoveMode };
export const StvStove3D: React.FC<Stove3DProps> = ({ mode = "topDown", air = 1, dolly = 0.6, leftMode = "bottomUp", rightMode = "topDown" }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const t = frame / fps, dur = durationInFrames / fps;
  const split = mode === "split";
  const dist = interpolate(t, [0, dur], [split ? 6.4 : 4.5, split ? 6.4 - 1.0 * dolly : 4.5 - 0.7 * dolly], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const ang = interpolate(t, [0, dur], [0.2, -0.08]);
  const target: [number, number, number] = [0, split ? 1.45 : 1.4, 0];
  const pos: [number, number, number] = [Math.sin(ang) * dist, 2.2, Math.cos(ang) * dist];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 35%, ${OLE.cream}, ${OLE.kraftL})` }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 34, position: pos, near: 0.1, far: 60 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamRig pos={pos} target={target} fov={34} />
        <hemisphereLight args={["#FFF4DE", "#8C6A48", 1.15]} />
        <directionalLight position={[-4, 6, 5]} intensity={1.5} color="#EAF1FF" />
        <directionalLight position={[4, 3, 3]} intensity={0.5} color="#FFD9A8" />
        {split ? (
          <>
            <Stove mode={leftMode} t={t} x={-1.3} s={1} air={air} />
            <Stove mode={rightMode} t={t} x={1.3} s={1} air={air} />
          </>
        ) : <Stove mode={mode as StoveMode} t={t} air={air} />}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
export default StvStove3D;
