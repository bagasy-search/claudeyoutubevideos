// StvCabinHeat3D — la cabaña-cocina en CORTE (3D real) con el MAPA DE CALOR que cambia.
// PAGO del guion: «do those three right and you get more heat out of the same pile of wood» / «plug the leaks, close the doors».
// Antes (leaky): el calor se va por la ventana y la puerta, la cabaña queda con frío en el suelo y las esquinas.
// Después (sealed): el mismo fuego, calor parejo (burletes, puerta del cuarto de al lado cerrada, masa térmica junto a la estufa).
// Todo determinista por useCurrentFrame. El campo de temperatura es una función analítica (nada de simulación con estado).
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { OLE, rnd } from "./OleTheme";
import { CamRig, canvasTex, dots, softTex, smooth, clamp01, noise1 } from "./OleDutchOven3D";
import { ironTex, flameTex } from "./StvStove3D";

const logWall = (seed: number) => canvasTex((c, W, H) => {
  c.fillStyle = "#7A5636"; c.fillRect(0, 0, W, H);
  const rows = 6, rh = H / rows;
  for (let r = 0; r < rows; r++) {
    const g = c.createLinearGradient(0, r * rh, 0, (r + 1) * rh);
    g.addColorStop(0, "#5E3F24"); g.addColorStop(0.18, "#94693F"); g.addColorStop(0.55, "#86603A"); g.addColorStop(1, "#4A311C");
    c.fillStyle = g; c.fillRect(0, r * rh, W, rh - 1);
    for (let k = 0; k < 26; k++) { c.strokeStyle = `rgba(40,22,10,${0.1 + rnd(seed + r * 40 + k) * 0.25})`; c.lineWidth = 1; const y = r * rh + rnd(seed + r * 50 + k + 3) * rh; c.beginPath(); c.moveTo(rnd(seed + r + k) * W, y); c.lineTo(rnd(seed + r + k) * W + 60 + rnd(k + r) * 120, y + (rnd(seed + k) - 0.5) * 4); c.stroke(); }
  }
  dots(c, W, H, seed, 120, "rgba(30,16,8,0.25)", 1, 3);
}, 512, 384);
const floorTex = () => canvasTex((c, W, H) => {
  c.fillStyle = "#B08556"; c.fillRect(0, 0, W, H);
  const n = 9, bw = W / n;
  for (let i = 0; i < n; i++) { const v = 0.85 + rnd(i * 9) * 0.3; c.fillStyle = `rgb(${Math.round(176 * v)},${Math.round(133 * v)},${Math.round(86 * v)})`; c.fillRect(i * bw + 1.5, 0, bw - 3, H); for (let k = 0; k < 20; k++) { c.strokeStyle = "rgba(60,35,15,0.2)"; c.beginPath(); const x = i * bw + rnd(i * 20 + k) * bw; c.moveTo(x, 0); c.lineTo(x + 6, H); c.stroke(); } }
}, 256, 256);

/** rampa de calor: azul frío → crema → amarillo → naranja → rojo */
function heatColor(v: number): [number, number, number] {
  const stops: [number, [number, number, number]][] = [[0, [0.16, 0.34, 0.78]], [0.28, [0.45, 0.72, 0.9]], [0.5, [0.96, 0.93, 0.7]], [0.72, [0.98, 0.7, 0.26]], [1, [0.86, 0.16, 0.1]]];
  for (let i = 1; i < stops.length; i++) if (v <= stops[i][0]) { const [a, ca] = stops[i - 1], [b, cb] = stops[i]; const u = (v - a) / (b - a); return [ca[0] + (cb[0] - ca[0]) * u, ca[1] + (cb[1] - ca[1]) * u, ca[2] + (cb[2] - ca[2]) * u]; }
  return stops[stops.length - 1][1];
}
const NX = 9, NY = 4, NZ = 6;
const X0 = -3, X1 = 3, Z0 = -2.1, Z1 = 2.1, H = 2.6;
const STOVE: [number, number] = [1.7, -1.3];

/** temperatura 0..1 en un punto; m = 0 (con fugas) → 1 (sellada y cerrada la puerta de al lado) */
function temp(x: number, y: number, z: number, m: number, pulse: number) {
  const d = Math.hypot(x - STOVE[0], z - STOVE[1], (y - 0.9) * 0.8);
  const L = 1.5 + 2.6 * m;                                      // radio de calor: la masa térmica y el aire quieto lo reparten
  let v = Math.exp(-d / L) * (0.95 + 0.05 * pulse);
  v += (y / H) * 0.22 * (1 - m * 0.7);                           // el aire caliente se junta arriba en el cielo raso
  v += 0.26 * m * (1 - Math.abs(y - 1.1) / 1.6);                 // sellada: el calor se reparte a altura de cuerpo
  const leakWin = Math.exp(-Math.hypot(x - X0, z + 0.2, y - 1.5) / 1.3) * (1 - m);   // ventana con fuga
  const leakDoor = Math.exp(-Math.hypot(x - 0.5, z - Z1, y - 0.7) / 1.4) * (1 - m);  // puerta con fuga (frío al ras del piso)
  v -= 0.62 * leakWin + 0.6 * leakDoor;
  v -= (1 - m) * 0.18 * (1 - y / H);                             // frío en el piso
  return clamp01(v);
}

export const StvCabinHeat3D: React.FC<{ swapAt?: number; swapDur?: number; orbit?: number }> = ({ swapAt = 2.4, swapDur = 2.2, orbit = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const t = frame / fps, dur = durationInFrames / fps;
  const m = smooth((t - swapAt) / swapDur);
  const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
  const tex = useMemo(() => ({ wall: logWall(4), wall2: logWall(44), floor: floorTex(), iron: ironTex(), fl: flameTex(), soft: softTex("rgba(255,255,255,0.95)") }), []);
  const ang = 0.5 + Math.sin((t / dur) * Math.PI) * 0.16 * orbit;
  const dist = 8.8 - 0.8 * smooth(t / dur);
  const pos: [number, number, number] = [Math.sin(ang) * dist, 5.0, Math.cos(ang) * dist];
  const target: [number, number, number] = [0, 0.9, 0];
  const cells: { k: number; p: [number, number, number]; col: [number, number, number]; a: number }[] = [];
  for (let ix = 0; ix < NX; ix++) for (let iy = 0; iy < NY; iy++) for (let iz = 0; iz < NZ; iz++) {
    const x = X0 + (ix + 0.5) * (X1 - X0) / NX, y = 0.15 + (iy + 0.5) * (H - 0.3) / NY, z = Z0 + (iz + 0.5) * (Z1 - Z0) / NZ;
    const v = temp(x, y, z, m, pulse);
    cells.push({ k: ix + NX * (iy + NY * iz), p: [x, y, z], col: heatColor(v), a: 0.1 + 0.22 * v });
  }
  const cs = [(X1 - X0) / NX * 0.9, (H - 0.3) / NY * 0.9, (Z1 - Z0) / NZ * 0.9] as const;
  // aire: caliente sube junto a la estufa; frío entra por la ventana/puerta y reptando por el piso (fugas) → se apaga al sellar
  const warm = Array.from({ length: 14 }, (_, i) => { const u = (t * 0.32 + rnd(i * 3)) % 1; return { key: i, p: [STOVE[0] + (rnd(i) - 0.5) * 0.7 - u * (0.6 + 1.6 * m), 0.9 + u * 1.65, STOVE[1] + (rnd(i + 8) - 0.5) * 0.5 + u * (0.4 + 1.2 * m)] as [number, number, number], o: Math.sin(u * Math.PI) * 0.8 }; });
  const cold = Array.from({ length: 12 }, (_, i) => { const u = (t * 0.28 + rnd(i * 5 + 40)) % 1; return { key: i, p: [X0 + 0.15 + u * 2.2, 1.5 - u * 1.0, -0.2 + (rnd(i) - 0.5) * 0.9] as [number, number, number], o: Math.sin(u * Math.PI) * 0.85 * (1 - m) }; });
  const flick = 0.8 + noise1(t * 8, 4) * 0.5;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, ${OLE.cream}, ${OLE.kraftL})` }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: pos, near: 0.1, far: 60 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamRig pos={pos} target={target} fov={32} />
        <hemisphereLight args={["#FFF4DE", "#8C6A48", 1.2]} />
        <directionalLight position={[-4, 7, 5]} intensity={1.3} color="#EAF1FF" />
        {/* piso, pared del fondo y pared izquierda (corte: frente y derecha abiertos) */}
        <mesh position={[0, -0.03, 0]}><boxGeometry args={[X1 - X0 + 0.3, 0.06, Z1 - Z0 + 0.3]} /><meshStandardMaterial map={tex.floor} roughness={0.9} /></mesh>
        <mesh position={[0, H / 2, Z0 - 0.08]}><boxGeometry args={[X1 - X0 + 0.3, H, 0.16]} /><meshStandardMaterial map={tex.wall} roughness={0.95} /></mesh>
        <mesh position={[X0 - 0.08, H / 2, 0]}><boxGeometry args={[0.16, H, Z1 - Z0 + 0.3]} /><meshStandardMaterial map={tex.wall2} roughness={0.95} /></mesh>
        {/* ventana en la pared izquierda (marco + vidrio con luz de nieve) */}
        <mesh position={[X0 + 0.02, 1.5, -0.2]}><boxGeometry args={[0.06, 0.95, 1.05]} /><meshStandardMaterial color="#4A311C" roughness={0.8} /></mesh>
        <mesh position={[X0 + 0.06, 1.5, -0.2]}><boxGeometry args={[0.02, 0.8, 0.9]} /><meshStandardMaterial color="#DCEBFA" emissive="#BFD8F2" emissiveIntensity={0.55} roughness={0.2} /></mesh>
        {/* marco de la puerta al frente-izquierda (línea en el piso) */}
        <mesh position={[0.5, 0.75, Z1]}><boxGeometry args={[0.95, 1.5, 0.05]} /><meshStandardMaterial color="#5A3C22" roughness={0.9} transparent opacity={0.55} /></mesh>
        {/* estufa de hierro (bloque) con caño y brillo */}
        <mesh position={[STOVE[0], 0.42, STOVE[1]]}><boxGeometry args={[0.85, 0.72, 0.6]} /><meshStandardMaterial map={tex.iron} color="#8a8480" roughness={0.7} metalness={0.5} /></mesh>
        <mesh position={[STOVE[0], 1.9, STOVE[1] - 0.12]}><cylinderGeometry args={[0.09, 0.09, 2.1, 16]} /><meshStandardMaterial map={tex.iron} color="#6d6863" roughness={0.6} metalness={0.6} /></mesh>
        <sprite position={[STOVE[0], 0.44, STOVE[1] + 0.32]} scale={[0.34 * flick, 0.36, 1]}><spriteMaterial map={tex.fl} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.95} /></sprite>
        <pointLight position={[STOVE[0], 0.7, STOVE[1] + 0.5]} intensity={4} distance={3.5} decay={1.6} color="#FF8A33" />
        {/* mesa y banco (referencia de escala) */}
        <mesh position={[-1.2, 0.5, 0.9]}><boxGeometry args={[1.5, 0.08, 0.8]} /><meshStandardMaterial color="#A67B4B" roughness={0.9} /></mesh>
        {[[-1.85, 0.6], [-0.55, 0.6], [-1.85, 1.2], [-0.55, 1.2]].map(([lx, lz], i) => <mesh key={i} position={[lx, 0.25, lz]}><boxGeometry args={[0.07, 0.5, 0.07]} /><meshStandardMaterial color="#7A5636" /></mesh>)}
        {/* el mapa de calor: nubes blandas de color (sprites) */}
        {cells.map((c) => (
          <sprite key={c.k} position={c.p} scale={[cs[0] * 2.2, cs[1] * 2.3, 1]}>
            <spriteMaterial map={tex.soft} color={new THREE.Color(c.col[0], c.col[1], c.col[2])} transparent depthWrite={false} opacity={Math.min(0.34, c.a * 1.35)} />
          </sprite>
        ))}
        <sprite renderOrder={20} position={[STOVE[0], 0.7, STOVE[1] + 0.35]} scale={[1.2, 1.2, 1]}><spriteMaterial map={tex.soft} color="#FF9A3A" transparent depthTest={false} depthWrite={false} opacity={0.5} blending={THREE.AdditiveBlending} /></sprite>
        {warm.map((w) => <sprite key={"w" + w.key} position={w.p} scale={[0.14, 0.14, 1]}><spriteMaterial map={tex.soft} color="#FFB45E" transparent depthWrite={false} opacity={w.o} blending={THREE.AdditiveBlending} /></sprite>)}
        {cold.map((w) => <sprite key={"c" + w.key} position={w.p} scale={[0.16, 0.16, 1]}><spriteMaterial map={tex.soft} color="#7FB6FF" transparent depthWrite={false} opacity={w.o} /></sprite>)}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
export default StvCabinHeat3D;
