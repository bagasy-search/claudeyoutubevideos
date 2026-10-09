// Ole3DKit — utilidades compartidas de las piezas 3D del kit olsup (three.js sobre @remotion/three).
// Reglas del farm: todo depende de useCurrentFrame (nada de useFrame / Math.random / CSS animations).
import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { rnd } from "./OleSupTheme";

export type V3 = [number, number, number];

export function canvasTex(draw: (c: CanvasRenderingContext2D, W: number, H: number) => void, W = 512, H = W, rep?: [number, number]) {
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const c = cv.getContext("2d")!; draw(c, W, H);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  return t;
}
export function dots(c: CanvasRenderingContext2D, W: number, H: number, seed: number, n: number, col: string, rMin: number, rMax: number, alpha = 1) {
  c.fillStyle = col; c.globalAlpha = alpha;
  for (let i = 0; i < n; i++) {
    const x = rnd(seed + i * 3) * W, y = rnd(seed + i * 3 + 1) * H, r = rMin + rnd(seed + i * 3 + 2) * (rMax - rMin);
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
  }
  c.globalAlpha = 1;
}
export function blobs(c: CanvasRenderingContext2D, seed: number, n: number, cx: number, cy: number, R: number, cols: string[], rMin: number, rMax: number, squash = 0.7) {
  for (let i = 0; i < n; i++) {
    const a = rnd(seed + i * 5) * Math.PI * 2, d = Math.sqrt(rnd(seed + i * 5 + 1)) * R;
    const r = rMin + rnd(seed + i * 5 + 2) * (rMax - rMin);
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
    const col = cols[Math.floor(rnd(seed + i * 5 + 3) * cols.length)];
    c.save(); c.translate(x, y); c.rotate(rnd(seed + i * 5 + 4) * 6.28);
    c.fillStyle = "rgba(0,0,0,0.35)"; c.beginPath(); c.ellipse(r * 0.08, r * 0.14, r, r * squash, 0, 0, 6.29); c.fill();
    c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, r, r * squash, 0, 0, 6.29); c.fill();
    c.fillStyle = "rgba(255,240,200,0.22)"; c.beginPath(); c.ellipse(-r * 0.2, -r * 0.2, r * 0.55, r * squash * 0.4, 0, 0, 6.29); c.fill();
    c.restore();
  }
}
export function radialFill(c: CanvasRenderingContext2D, W: number, H: number, inner: string, outer: string) {
  const g = c.createRadialGradient(W / 2, H / 2, 4, W / 2, H / 2, Math.max(W, H) * 0.55);
  g.addColorStop(0, inner); g.addColorStop(1, outer); c.fillStyle = g; c.fillRect(0, 0, W, H);
}

// halo suave (vapor / resplandor)
let _soft: any = null;
export function softTex() {
  if (!_soft) _soft = canvasTex((c, W) => {
    const g = c.createRadialGradient(W / 2, W / 2, 0, W / 2, W / 2, W / 2);
    g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.35, "rgba(255,255,255,0.55)"); g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g; c.fillRect(0, 0, W, W);
  }, 128);
  return _soft;
}
// llama (sprite)
let _flame: any = null;
export function flameTex() {
  if (!_flame) _flame = canvasTex((c, W, H) => {
    const g = c.createRadialGradient(W / 2, H * 0.62, 2, W / 2, H * 0.62, W * 0.5);
    g.addColorStop(0, "rgba(255,250,200,1)"); g.addColorStop(0.3, "rgba(255,190,70,0.95)"); g.addColorStop(0.65, "rgba(232,90,20,0.55)"); g.addColorStop(1, "rgba(200,40,0,0)");
    c.fillStyle = g; c.beginPath(); c.moveTo(W / 2, 4); c.bezierCurveTo(W * 0.95, H * 0.5, W * 0.9, H * 0.98, W / 2, H * 0.98); c.bezierCurveTo(W * 0.1, H * 0.98, W * 0.05, H * 0.5, W / 2, 4); c.fill();
  }, 128, 192);
  return _flame;
}

export const flick = (frame: number, i: number, amp = 1) =>
  1 + amp * (0.10 * Math.sin(frame * 0.85 + i * 2.3) + 0.06 * Math.sin(frame * 2.1 + i * 5.1) + 0.14 * (rnd(Math.floor(frame / 2) + i * 977) - 0.5));

export const ease = (x: number) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// Cámara por cuadro (sin useFrame)
export const CamRig: React.FC<{ pos: V3; look: V3; roll?: number; fov?: number }> = ({ pos, look, roll = 0, fov }) => {
  const { camera } = useThree();
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.up.set(Math.sin(roll), Math.cos(roll), 0);
  camera.lookAt(look[0], look[1], look[2]);
  if (fov) (camera as any).fov = fov;
  camera.updateProjectionMatrix();
  return null;
};

// Vapor: sprites que suben, ciclo determinista
export const Steam: React.FC<{ pos: V3; frame: number; fps?: number; n?: number; seed?: number; amt?: number; size?: number; rise?: number; color?: string; speed?: number }> = ({ pos, frame, fps = 30, n = 3, seed = 0, amt = 1, size = 0.16, rise = 0.7, color = "#F4EDE2", speed = 0.45 }) => {
  if (amt <= 0.01) return null;
  const t = frame / fps; const tex = softTex();
  return (
    <group position={pos}>
      {Array.from({ length: n }).map((_, i) => {
        const ph = (t * speed + i / n + rnd(seed * 13 + i) * 0.5) % 1;
        const y = ph * rise, sc = size * (0.6 + ph * 2.2);
        const op = Math.sin(Math.PI * ph) * 0.42 * amt;
        const x = Math.sin(t * 1.3 + i * 2 + seed) * 0.04 * (0.4 + ph * 2);
        return (
          <sprite key={i} position={[x, y, Math.cos(t * 1.1 + i + seed) * 0.03]} scale={[sc, sc, sc]}>
            <spriteMaterial map={tex} color={color} transparent opacity={op} depthWrite={false} />
          </sprite>
        );
      })}
    </group>
  );
};

// Motas de polvo / cenizas: Points deterministas alrededor de un centro
export const Motes: React.FC<{ frame: number; center: V3; span: V3; n?: number; size?: number; color?: string; opacity?: number; fps?: number; seed?: number; vy?: number }> = ({ frame, center, span, n = 90, size = 0.035, color = "#FFD58A", opacity = 0.5, fps = 30, seed = 1, vy }) => {
  const t = frame / fps; const tex = softTex();
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      a[i * 3] = center[0] + (rnd(seed * 100 + i * 3) - 0.5) * span[0] + Math.sin(t * 0.25 + i) * 0.15;
      a[i * 3 + 1] = center[1] + ((((rnd(seed * 100 + i * 3 + 1) + t * (vy ?? 0.02) * (0.5 + rnd(i + 5))) % 1) + 1) % 1) * span[1];
      a[i * 3 + 2] = center[2] + (rnd(seed * 100 + i * 3 + 2) - 0.5) * span[2] + Math.cos(t * 0.2 + i * 1.7) * 0.15;
    }
    g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    return g;
  }, [frame, n, center[0], center[1], center[2]]); // eslint-disable-line
  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial map={tex} color={color} size={size} sizeAttenuation transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
};

// ───────────── Cocina de hierro de campamento ─────────────
export function useIronMats() {
  return useMemo(() => {
    const ironTex = canvasTex((c, W, H) => {
      c.fillStyle = "#34302C"; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(${rnd(i) > 0.5 ? "255,255,255" : "0,0,0"},${0.03 + rnd(i + 9) * 0.05})`; c.fillRect(0, rnd(i + 2) * H, W, 1 + rnd(i + 4) * 6); }
      dots(c, W, H, 11, 500, "#5A544E", 0.6, 2, 0.6); dots(c, W, H, 12, 300, "#15120F", 0.6, 3, 0.7);
    }, 256);
    return {
      iron: new THREE.MeshStandardMaterial({ map: ironTex, color: "#9a958e", roughness: 0.5, metalness: 0.4 }),
      ironDark: new THREE.MeshStandardMaterial({ color: "#26221F", roughness: 0.55, metalness: 0.4 }),
      brass: new THREE.MeshStandardMaterial({ color: "#B8893A", roughness: 0.4, metalness: 0.6 }),
      tin: new THREE.MeshStandardMaterial({ color: "#C9CDCE", roughness: 0.4, metalness: 0.5 }),
      log: new THREE.MeshStandardMaterial({ color: "#6B4526", roughness: 0.95 }),
    };
  }, []);
}

// La cocina mira hacia +z. Escala 1 ≈ 1 m.
export const StoveModel: React.FC<{ frame: number; fps?: number; steam?: number; light?: boolean }> = ({ frame, fps = 30, steam = 1, light = true }) => {
  const M = useIronMats();
  const f = flick(frame, 3);
  return (
    <group>
      {[[-0.4, -0.25], [0.4, -0.25], [-0.4, 0.25], [0.4, 0.25]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.09, z]} material={M.ironDark}><cylinderGeometry args={[0.035, 0.05, 0.18, 8]} /></mesh>
      ))}
      <mesh position={[0, 0.5, 0]} material={M.iron}><boxGeometry args={[1.0, 0.64, 0.66]} /></mesh>
      <mesh position={[0, 0.845, 0]} material={M.ironDark}><boxGeometry args={[1.06, 0.06, 0.72]} /></mesh>
      {[-0.3, 0.05].map((x, i) => (
        <mesh key={i} position={[x, 0.885, 0.05]} material={M.iron}><cylinderGeometry args={[0.12, 0.12, 0.02, 20]} /></mesh>
      ))}
      {/* puerta del fuego con rendijas encendidas */}
      <mesh position={[-0.22, 0.56, 0.335]} material={M.ironDark}><boxGeometry args={[0.34, 0.26, 0.02]} /></mesh>
      {[0.5, 0.56, 0.62].map((y, i) => <mesh key={i} position={[-0.22, y, 0.348]} scale={[1, 1, 1]}><planeGeometry args={[0.24, 0.022 * (0.8 + 0.3 * f)]} /><meshBasicMaterial color={f > 1 ? "#FFB040" : "#FF8020"} /></mesh>)}
      <mesh position={[0.26, 0.48, 0.335]} material={M.ironDark}><boxGeometry args={[0.4, 0.36, 0.02]} /></mesh>
      <mesh position={[0.26, 0.5, 0.35]} material={M.brass}><boxGeometry args={[0.26, 0.02, 0.02]} /></mesh>
      {/* caldera */}
      <mesh position={[0.62, 0.62, 0]} material={M.iron}><boxGeometry args={[0.22, 0.5, 0.5]} /></mesh>
      <mesh position={[0.62, 0.9, 0]} material={M.ironDark}><boxGeometry args={[0.24, 0.04, 0.52]} /></mesh>
      {/* caño */}
      <mesh position={[-0.3, 1.9, -0.2]} material={M.ironDark}><cylinderGeometry args={[0.07, 0.07, 2.0, 12]} /></mesh>
      <mesh position={[-0.3, 1.0, -0.2]} material={M.ironDark}><cylinderGeometry args={[0.1, 0.1, 0.06, 12]} /></mesh>
      {/* olla grande */}
      <mesh position={[0.05, 1.03, 0.05]} material={M.ironDark}><cylinderGeometry args={[0.2, 0.17, 0.25, 20]} /></mesh>
      <mesh position={[0.05, 1.165, 0.05]} material={M.ironDark}><cylinderGeometry args={[0.16, 0.2, 0.03, 20]} /></mesh>
      <mesh position={[0.05, 1.19, 0.05]} material={M.ironDark}><sphereGeometry args={[0.03, 8, 6]} /></mesh>
      {/* pava */}
      <group position={[-0.32, 0.9, 0.08]}>
        <mesh position={[0, 0.11, 0]} material={M.tin}><cylinderGeometry args={[0.1, 0.13, 0.2, 18]} /></mesh>
        <mesh position={[0, 0.235, 0]} material={M.tin}><cylinderGeometry args={[0.04, 0.1, 0.06, 18]} /></mesh>
        <mesh position={[0.13, 0.15, 0]} rotation={[0, 0, -0.9]} material={M.tin}><cylinderGeometry args={[0.015, 0.03, 0.14, 8]} /></mesh>
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]} material={M.ironDark}><torusGeometry args={[0.09, 0.008, 6, 14, Math.PI]} /></mesh>
      </group>
      {/* leña */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[-0.72, 0.06 + Math.floor(i / 3) * 0.11, -0.12 + (i % 3) * 0.16]} rotation={[0, 0, Math.PI / 2]} material={M.log}><cylinderGeometry args={[0.06, 0.06, 0.34, 8]} /></mesh>
      ))}
      {light ? <pointLight position={[-0.22, 0.6, 0.8]} color="#FF8A34" intensity={5 * f} distance={5} decay={1.6} /> : null}
      <Steam pos={[-0.2, 1.15, -0.05]} frame={frame} fps={fps} n={3} size={0.13} rise={0.9} amt={steam} seed={31} />
      <Steam pos={[-0.32, 1.22, 0.08]} frame={frame} fps={fps} n={2} size={0.07} rise={0.6} amt={steam * 0.9} seed={37} speed={0.7} />
      <Steam pos={[0.05, 1.25, 0.05]} frame={frame} fps={fps} n={3} size={0.14} rise={0.8} amt={steam * 0.8} seed={41} />
    </group>
  );
};
