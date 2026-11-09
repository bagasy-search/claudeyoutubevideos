// MIO apa8pc · componentes únicos, primera mitad: el rastro, quién vive abajo, las advertencias y el frasco.
import React from "react";
import * as THREE from "three";
import { H, Tag, AMB, RED, GRN, TX } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { Boot, Flag, Grub, Sign, SoilBlock } from "./farmkit";
import { Blades, Dirt, Lawn, PI, Road } from "./akit";

export type P_ = { t: number; h: H };

// el zorrino de la casa: mira a +X. tail 0..1 = cola levantada
export const Skunk: React.FC<{ p?: number[]; rot?: number[]; s?: number; walk?: number; tail?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, walk = 0, tail = 0.3 }) => <group position={p as any} rotation={rot as any} scale={s}>
  <mesh position={[0, 0.078, 0]} rotation={[0, 0, PI / 2]} scale={[1, 1, 0.92]} castShadow><capsuleGeometry args={[0.058, 0.14, 12, 26]} />{M.hair({ col: "#17161a" })}</mesh>
  <mesh position={[0.122, 0.09, 0]} castShadow scale={[1.2, 0.9, 0.9]}><sphereGeometry args={[0.046, 24, 18]} />{M.hair({ col: "#17161a" })}</mesh>
  <mesh position={[0.178, 0.078, 0]} scale={[1.5, 0.7, 0.72]}><sphereGeometry args={[0.016, 14, 10]} /><meshPhysicalMaterial color="#0c0b0c" roughness={0.25} clearcoat={0.8} /></mesh>
  <mesh position={[0.116, 0.134, 0]} scale={[2.4, 0.3, 0.42]}><sphereGeometry args={[0.03, 16, 10]} />{M.hair({ col: "#ece8df" })}</mesh>
  <mesh position={[-0.01, 0.136, 0.018]} rotation={[0, 0, PI / 2 - 0.05]}><capsuleGeometry args={[0.012, 0.15, 6, 12]} />{M.hair({ col: "#ece8df" })}</mesh>
  <mesh position={[-0.01, 0.136, -0.018]} rotation={[0, 0, PI / 2 - 0.05]}><capsuleGeometry args={[0.012, 0.15, 6, 12]} />{M.hair({ col: "#ece8df" })}</mesh>
  {[[0.09, 0.03], [0.09, -0.03], [-0.09, 0.034], [-0.09, -0.034]].map((q, i) => <mesh key={i} position={[q[0] + 0.012 * Math.sin(walk * 6 + i * 2.2), 0.02, q[1]]}><capsuleGeometry args={[0.011, 0.03, 4, 8]} />{M.hair({ col: "#17161a" })}</mesh>)}
  <group position={[-0.12, 0.1, 0]} rotation={[0, 0, lerp(0.95, 0.12, tail)]}>
    <mesh position={[-0.09, 0, 0]} rotation={[0, 0, PI / 2]} scale={[1, 1, 1]} castShadow><capsuleGeometry args={[0.038, 0.13, 10, 20]} />{M.hair({ col: "#1e1c20" })}</mesh>
    <mesh position={[-0.17, 0.012, 0]} scale={[1.3, 0.8, 0.9]}><sphereGeometry args={[0.038, 16, 12]} />{M.hair({ col: "#ece8df" })}</mesh>
  </group>
</group>;

const latC = new Map<string, THREE.CanvasTexture>();
const latT = (w: number, h: number, gx?: number, gw = 0.26) => {
  const key = [w, h, gx, gw].join("|"); let t = latC.get(key); if (t) return t;
  const K = Math.min(2048 / w, 520), W = Math.round(w * K), H_ = Math.round(h * K), c = document.createElement("canvas"); c.width = W; c.height = H_;
  const g = c.getContext("2d")!, step = 0.115;
  [1, -1].forEach((dir) => { let i = 0; for (let o = -h - step; o < w + h + step; o += step, i++) {
    const x0 = (dir > 0 ? o : o + h) * K, x1 = (dir > 0 ? o + h : o) * K, tone = 196 + ((i * 37) % 26);
    g.lineCap = "butt"; g.strokeStyle = "rgba(52,44,34,1)"; g.lineWidth = 0.042 * K; g.beginPath(); g.moveTo(x0, H_); g.lineTo(x1, 0); g.stroke();
    g.strokeStyle = `rgb(${tone},${tone - 12},${tone - 34})`; g.lineWidth = 0.034 * K; g.beginPath(); g.moveTo(x0, H_); g.lineTo(x1, 0); g.stroke();
  } });
  if (gx !== undefined) { const cx = (gx + w / 2) * K, r = (gw / 2) * K, top = H_ - h * 0.56 * K + r; g.globalCompositeOperation = "destination-out"; g.beginPath(); g.moveTo(cx - r, H_); g.lineTo(cx - r, top); g.arc(cx, top, r, PI, 0); g.lineTo(cx + r, H_); g.closePath(); g.fill(); g.globalCompositeOperation = "source-over"; }
  t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; latC.set(key, t); return t;
};
export const Lattice: React.FC<{ w: number; h: number; p?: number[]; gapX?: number; gapW?: number }> = ({ w, h, p = [0, 0, 0], gapX, gapW = 0.26 }) => {
  if (w <= 0 || h <= 0) return null;
  return <mesh position={[p[0], p[1] + h / 2, p[2] + 0.002]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={latT(w, h, gapX, gapW)} alphaTest={0.5} side={THREE.DoubleSide} roughness={0.85} /></mesh>;
};

// el deck visto en corte de lado: oscuro por dentro; dark 0..1 = cuánto se oscurece
export const UnderDeck: React.FC<{ dark?: number; w?: number; children?: React.ReactNode }> = ({ dark = 1, w = 2.5, children }) => <>
  <Dirt w={7} d={5} rx={6} p={[0, 0, 0]} />
  <mesh position={[0, 0.25, -0.62]}><planeGeometry args={[w, 0.5]} /><meshStandardMaterial color="#27241f" roughness={1} /></mesh>
  {Array.from({ length: 9 }, (_, i) => <RBox key={i} s={[w / 9 - 0.012, 0.05, 1.3]} p={[-w / 2 + (i + 0.5) * (w / 9), 0.53, 0]} r={0.008}>{M.wood({ base: [132 + (i % 3) * 8, 96, 60] })}</RBox>)}
  <RBox s={[w, 0.12, 0.05]} p={[0, 0.45, 0.6]} r={0.008}>{M.wood({ base: [108, 78, 50] })}</RBox>
  {[-1, 1].map((x) => <RBox key={x} s={[0.1, 0.42, 0.1]} p={[x * (w / 2 - 0.08), 0.21, 0.56]} r={0.01}>{M.wood({ base: [98, 72, 48] })}</RBox>)}
  {children}
  <mesh position={[0, 0.255, 0.6]}><planeGeometry args={[w - 0.28, 0.5]} /><meshBasicMaterial color="#080706" transparent opacity={0.72 * dark} depthWrite={false} /></mesh>
</>;

// ---- CUADRITOS: las tapitas de pasto se dan vuelta de a una por todo el jardín ----
export const HFlipSquares: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 1.5, 1]} cam={{ at: [0, 0, 0], az: [-0.3, 0.14], el: [0.56, 0.42], r: [1.9, 1.55], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="DOZENS OF LITTLE SQUARES" col={AMB} />}>{(tt) => <>
  <Lawn />
  {Array.from({ length: 34 }, (_, i) => { const x = -1.05 + (i % 7) * 0.34 + (rn(i, 2) - 0.5) * 0.14, z = -0.62 + Math.floor(i / 7) * 0.3 + (rn(i, 3) - 0.5) * 0.12, ry = rn(i, 4) * 6.28, k = eio(tt, 0.3 + rn(i, 5) * 3.2, 0.75 + rn(i, 5) * 3.2); return <group key={i} position={[x, 0, z]} rotation={[0, ry, 0]}>
    <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.062, 20]} /><meshStandardMaterial color="#22160d" roughness={1} /></mesh>
    <group position={[0, 0.004, -0.06]} rotation={[k * 2.7, 0, 0]}>
      <RBox s={[0.13, 0.016, 0.12]} p={[0, 0.008, 0.06]} r={0.004}><meshStandardMaterial color="#3a2819" roughness={1} /></RBox>
      <mesh position={[0, 0.017, 0.06]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.13, 0.12]} /><meshStandardMaterial color="#5a8a3a" roughness={1} /></mesh>
    </group></group>; })}
  <Blades w={3} d={2} n={330} h={0.06} />
</>}</Scene3D>;

// ---- LO HUELE A TRAVÉS DEL PASTO: el aroma sube de las larvas y lo guía ----
export const HGrubScent: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1.2, 2, 1.4]} cam={{ at: [0, -0.04, 0], az: [-0.1, 0.1], el: [0.06, 0.08], r: [1.5, 1.24], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="HE SMELLS THEM THROUGH THE SOD" col={AMB} />}>{(tt) => {
  const w = eio(tt, 0.3, 4.2);
  return <>
    <SoilBlock w={3.4} h={0.6} d={0.6} p={[0, 0, 0]} grass />
    {Array.from({ length: 7 }, (_, i) => <group key={i} position={[-0.72 + i * 0.26, -0.15 - rn(i, 2) * 0.09, 0.32]}><Grub p={[0, 0, 0]} s={1.4} rot={[0, 0, rn(i, 3) * 3]} /></group>)}
    {Array.from({ length: 7 }, (_, j) => Array.from({ length: 9 }, (_, n) => { const ph = (tt * 0.42 + n / 9 + j * 0.13) % 1; return <mesh key={j + "_" + n} position={[-0.72 + j * 0.26 + 0.03 * Math.sin(ph * 12 + j), -0.13 + ph * 0.42, 0.34]}><sphereGeometry args={[0.012 * (1 - ph * 0.6), 10, 8]} /><meshBasicMaterial color="#ffdf9a" transparent opacity={0.65 * Math.sin(ph * PI)} /></mesh>; }))}
    <Skunk p={[lerp(-1.0, 0.5, w), 0.03, 0.12]} s={0.84} walk={tt * 2.2} />
  </>;
}}</Scene3D>;

// ---- EL TAMAÑO DE UNA TAZA: la taza baja y entra justo en el pocito ----
export const HCupFit: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1, 2, 1.2]} cam={{ at: [0, 0.06, 0], az: [0.4, 0.16], el: [0.44, 0.34], r: [0.86, 0.68], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={940} txt="THE SIZE OF A COFFEE CUP" col={AMB} />}>{(tt) => {
  const d = phys(tt, 0.6, 5, 0.65), y = lerp(0.56, -0.048, d);
  return <>
    <Lawn />
    <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.095, 40]} /><meshBasicMaterial color="#0d0805" /></mesh>
    <mesh position={[0, 0.0035, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.092, 0.122, 40]} /><meshStandardMaterial color="#553923" roughness={1} /></mesh>
    <group position={[0.3, 0.004, 0.16]} rotation={[-0.25, 0.8, 2.5]}><RBox s={[0.16, 0.018, 0.14]} p={[0, 0.009, 0]} r={0.005}><meshStandardMaterial color="#3a2819" roughness={1} /></RBox></group>
    <group position={[0, y, 0]}>
      <mesh position={[0, 0.075, 0]} castShadow><cylinderGeometry args={[0.09, 0.076, 0.15, 44]} />{M.porcelain({ col: "#f2efe7" })}</mesh>
      <mesh position={[0, 0.1505, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.082, 36]} /><meshPhysicalMaterial color="#2c1a0e" roughness={0.15} clearcoat={1} /></mesh>
      <mesh position={[0.105, 0.085, 0]}><torusGeometry args={[0.04, 0.01, 10, 24]} />{M.porcelain({ col: "#f2efe7" })}</mesh>
    </group>
    <Blades w={2} d={1.3} n={260} h={0.06} skip={(x, z) => Math.hypot(x, z) < 0.2} />
  </>;
}}</Scene3D>;

// ---- EL MAPACHE ENROLLA: un rollo de pasto avanza y deja la tierra pelada ----
export const HSodCarpet: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 1.8, 1.1]} cam={{ at: [0, 0.05, 0], az: [-0.5, -0.3], el: [0.3, 0.24], r: [1.8, 1.5], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="A RACCOON ROLLS THE CARPET" col={AMB} />}>{(tt) => {
  const k = eio(tt, 0.4, 4.0), x = lerp(-0.86, 0.72, k), r = 0.035 + 0.1 * k, W = 0.74;
  return <>
    <Lawn />
    <mesh position={[(x - 0.9) / 2, 0.004, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[Math.max(0.01, x + 0.9), W]} /><meshStandardMaterial color="#3a2819" roughness={1} /></mesh>
    <mesh position={[x, r + 0.003, 0]} rotation={[PI / 2, tt * 0 - k * 16, 0]} castShadow><cylinderGeometry args={[r, r, W, 32]} /><meshStandardMaterial color="#567f36" roughness={1} /></mesh>
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[x, r + 0.003, -0.33 + i * 0.165]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[r + 0.0008, r + 0.0008, 0.012, 32]} /><meshStandardMaterial color="#3a2819" roughness={1} /></mesh>)}
    <Blades w={2.4} d={1.8} n={330} h={0.07} skip={(q, z) => (Math.abs(z) < W / 2 + 0.02 && q < x + r + 0.02)} />
  </>;
}}</Scene3D>;

// ---- EL TOBOGÁN: bajo la celosía la tierra quedó lisa, y hay pelos enganchados en la madera ----
export const HWornDirt: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 2, 1.8]} cam={{ at: [0.05, 0.17, 0.5], az: [0.42, 0.12], el: [0.26, 0.18], r: [1.5, 1.2], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="A SLIDE, SIX TO EIGHT INCHES" col={AMB} />}>{(tt) => {
  const s = eio(tt, 0.4, 2.2), hr = eio(tt, 3.0, 4.2);
  return <>
    <Dirt w={7} d={5} rx={6} p={[0, 0, 0]} />
    <mesh position={[0, 0.25, 0.5]}><planeGeometry args={[2.4, 0.5]} /><meshBasicMaterial color="#141210" /></mesh>
    <group position={[0, 0, 0.52]}><Lattice w={2.1} h={0.5} gapX={0.08} gapW={0.28} /></group>
    <RBox s={[2.5, 0.12, 0.05]} p={[0, 0.54, 0.55]} r={0.008}>{M.wood({ base: [108, 78, 50] })}</RBox>
    <Road id="wdr" pts={[[0.08, 0.5], [0.13, 0.8], [0.0, 1.1], [0.1, 1.6]]} w={0.22} col="#8a6a47" u={s} y={0.005} />
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} visible={hr > (i + 1) / 10} position={[-0.09 + i * 0.024, 0.46 + rn(i, 2) * 0.03, 0.586]} rotation={[0, 0, rn(i, 3) * 2 - 1]}><cylinderGeometry args={[0.0014, 0.0014, 0.12, 4]} /><meshBasicMaterial color={i % 3 ? "#121114" : "#eeeae1"} /></mesh>)}
    <Blades w={3.4} d={1.8} n={180} h={0.06} p={[0, 0, 1.6]} skip={(x, z) => Math.abs(x - 0.08) < 0.22} />
  </>;
}}</Scene3D>;

// ---- CINCO DEDOS: la huella se arma dedo por dedo y las garras por delante ----
export const HFiveToes: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1.3, 1, 0.7]} cam={{ at: [0, 0, 0], az: [0.14, -0.05], el: [1.18, 1.02], r: [0.72, 0.56], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="FIVE TOES. LONG CLAWS." col={AMB} />}>{(tt) => {
  const col = "#2a1b10", pr = eio(tt, 0.2, 0.7), T = [-0.12, -0.058, 0, 0.058, 0.12], Y = [-0.04, -0.092, -0.11, -0.092, -0.04];
  return <>
    <Dirt w={3} d={3} rx={16} p={[0, 0, 0]} />
    <mesh position={[0, 0.004, 0.04]} rotation={[-PI / 2, 0, 0]} scale={[1.1 * pr + 0.001, 0.86 * pr + 0.001, 1]}><circleGeometry args={[0.09, 36]} /><meshStandardMaterial color={col} roughness={1} /></mesh>
    {T.map((x, i) => { const k = eio(tt, 0.8 + i * 0.28, 1.15 + i * 0.28), c = eio(tt, 2.5 + i * 0.1, 2.85 + i * 0.1); return <group key={i}>
      <mesh position={[x, 0.0045, Y[i]]} rotation={[-PI / 2, 0, 0]} scale={[k + 0.001, 1.2 * k + 0.001, 1]}><circleGeometry args={[0.022, 22]} /><meshStandardMaterial color={col} roughness={1} /></mesh>
      <mesh position={[x * 1.1, 0.005, Y[i] - 0.045 * c - 0.016]} rotation={[-PI / 2, 0, -x * 1.2]}><planeGeometry args={[0.006, Math.max(0.001, 0.09 * c)]} /><meshBasicMaterial color="#120b06" /></mesh>
    </group>; })}
  </>;
}}</Scene3D>;

// ---- PARA ATRÁS, DESPACIO: las botas retroceden un paso por vez y él zapatea adelante ----
export const HBackupBoots: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 1.7, 1.2]} cam={{ at: [0, 0.14, 0], az: [0.32, 0.16], el: [0.17, 0.12], r: [1.7, 1.4], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.6} x={960} y={940} txt="BACK UP SLOW AND QUIET" col={GRN} />}>{(tt) => {
  const st = (n: number) => { let d = 0; for (let i = 0; i < 4; i++) d += eio(tt, 1 + i * 1.05 + n * 0.52, 1.5 + i * 1.05 + n * 0.52); return d; }, stamp = Math.abs(Math.sin(tt * 11)) * 0.018;
  return <>
    <Lawn />
    <Skunk p={[-0.58, stamp, 0]} s={1.0} tail={0.95} walk={0} />
    <group position={[0.2 + st(0) * 0.2, 0.05 * Math.max(0, Math.sin(tt * 2.9)) * 0.1, 0.09]} rotation={[0, -PI / 2, 0]}><Boot s={1.6} /></group>
    <group position={[0.34 + st(1) * 0.2, 0, -0.09]} rotation={[0, -PI / 2, 0]}><Boot s={1.6} /></group>
    <Blades w={2.8} d={1.6} n={320} h={0.06} />
  </>;
}}</Scene3D>;

// ---- ALCANCE: la cinta se estira doce pies y el rocío cae justo en la punta ----
export const HRangeArc: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 1.9, 1.2]} cam={{ at: [0.1, 0.25, 0], az: [0.06, 0.1], el: [0.16, 0.12], r: [2.6, 2.2], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={940} txt="TEN OR TWELVE FEET" col={RED} />}>{(tt) => {
  const r = eio(tt, 0.3, 2.3), sp = eio(tt, 2.6, 3.8), L = 2.1;
  return <>
    <Lawn />
    <Skunk p={[-1.05, 0, 0.14]} s={1.05} tail={1} />
    <RBox s={[Math.max(0.01, L * r), 0.004, 0.06]} p={[-0.98 + L * r / 2, 0.012, 0.36]} r={0.001}><meshStandardMaterial color="#e6c042" roughness={0.45} metalness={0.3} /></RBox>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} visible={(i + 1) / 12 <= r + 0.01} position={[-0.98 + (i + 1) * (L / 12), 0.0145, 0.36]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.012, 0.05]} /><meshBasicMaterial color="#1a1a1a" /></mesh>)}
    <RBox s={[0.14, 0.1, 0.1]} p={[-0.98, 0.05, 0.36]} r={0.018}><meshStandardMaterial color="#b1b2ae" roughness={0.3} metalness={0.7} /></RBox>
    {Array.from({ length: 34 }, (_, i) => { const u = cl(sp * 1.1 - rn(i, 2) * 0.1) * (0.6 + 0.4 * i / 33), x = lerp(-1.25, 1.1, u); return <mesh key={i} visible={sp > 0.02 && u > 0.02} position={[x, 0.2 + 0.68 * Math.sin(u * PI) - u * 0.17, 0.14 + (rn(i, 3) - 0.5) * 0.04]}><sphereGeometry args={[0.012, 8, 6]} /><meshBasicMaterial color="#e8e089" transparent opacity={0.8} /></mesh>; })}
    <group position={[1.1, 0, 0.14]} rotation={[0, -PI / 2, 0]}><Boot s={1.5} /></group>
  </>;
}}</Scene3D>;

// ---- DE DÍA Y DANDO VUELTAS: el rastro zigzaguea bajo el sol y no sigue a nadie ----
export const HWobblePath: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[0.4, 3, 0.6]} cam={{ at: [0, 0.02, 0], az: [0.1, -0.1], el: [0.84, 0.7], r: [2.0, 1.7], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="DON'T GO NEAR HIM. CALL THE COUNTY." col={RED} />}>{(tt) => {
  const u = eio(tt, 0.3, 5.4), q = (k: number) => [lerp(-1.0, 0.8, k) + 0.13 * Math.sin(k * 21), 0.24 * Math.sin(k * 8) + 0.15 * Math.cos(k * 17)], P = Array.from({ length: 40 }, (_, i) => q(i / 39)), a = q(u), b = q(Math.min(1, u + 0.01));
  return <>
    <Lawn />
    <Road id="wbp" pts={P as any} w={0.05} col="#b1c774" u={u} y={0.005} />
    <Skunk p={[a[0], 0.0, a[1]]} rot={[0.14 * Math.sin(tt * 4), Math.atan2(a[1] - b[1], b[0] - a[0]), 0.1 * Math.sin(tt * 6)]} s={0.72} walk={tt * 1.6} tail={0.2} />
    <Blades w={2.6} d={1.6} n={220} h={0.05} />
  </>;
}}</Scene3D>;

// ---- LAS VACUNAS PRIMERO: el frasquito, la jeringa que sube, y la chapita que queda colgando ----
export const HVialShot: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" key1={[-1, 1.9, 1.4]} cam={{ at: [0.03, 0.14, 0], az: [-0.3, 0.14], el: [0.18, 0.14], r: [0.74, 0.6], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="DOG'S SHOTS FIRST" col={GRN} />}>{(tt) => {
  const k = eio(tt, 0.7, 2.3), sw = Math.sin(tt * 2.2) * Math.exp(-(tt - 2.6) * 0.5) * (tt > 2.6 ? 0.5 : 0), tg = phys(tt, 2.5, 7, 0.45);
  return <>
    <group position={[-0.17, 0, 0]}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.042, 0.042, 0.14, 32]} />{M.glass({})}</mesh>
      <mesh position={[0, 0.04 + 0.02 * (1 - k * 0.5), 0]}><cylinderGeometry args={[0.038, 0.038, 0.08 - 0.04 * k * 0.5, 32]} /><meshStandardMaterial color="#e7c15a" roughness={0.3} transparent opacity={0.85} /></mesh>
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.03, 0.03, 0.02, 24]} />{M.steel({ col: "#c8c8c6" })}</mesh>
    </group>
    <group position={[-0.17, 0.32, 0]} rotation={[0, 0, 0]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.018, 0.018, 0.17, 24]} />{M.glass({})}</mesh>
      <mesh position={[0, -0.075 + 0.05 * k, 0]}><cylinderGeometry args={[0.015, 0.015, 0.1 * k + 0.001, 20]} /><meshStandardMaterial color="#e7c15a" roughness={0.3} transparent opacity={0.85} /></mesh>
      <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.0014, 0.0014, 0.12, 6]} />{M.steel({})}</mesh>
      <mesh position={[0, 0.14 + 0.09 * k, 0]}><cylinderGeometry args={[0.006, 0.006, 0.18, 10]} />{M.pvc({ col: "#f2efe7" })}</mesh>
      <mesh position={[0, 0.23 + 0.09 * k, 0]}><cylinderGeometry args={[0.026, 0.026, 0.008, 18]} />{M.pvc({ col: "#f2efe7" })}</mesh>
    </group>
    <group position={[0.2, 0.36 + 0.5 * (1 - tg), -0.02]} rotation={[0, 0, sw]}>
      <mesh position={[0, 0.0, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.045, 0.004, 8, 32]} />{M.steel({ col: "#c8c8c6" })}</mesh>
      <mesh position={[0, -0.13, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.078, 0.078, 0.006, 40]} />{M.brass()}</mesh>
      <Sign id="vtag" txt="RABIES" p={[0, -0.13, 0.0045]} w={0.11} h={0.06} col="#d6a84a" ink="#2d1c07" />
    </group>
  </>;
}}</Scene3D>;

// ---- LA JAULA, NO: la jaula cae con él adentro, cola arriba, y dos tablas se clavan cruzadas ----
export const HCageDrop: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 2, 1.2]} cam={{ at: [0, 0.15, 0], az: [0.34, 0.14], el: [0.18, 0.14], r: [1.3, 1.08], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.1} x={960} y={940} txt="NOT THIS ANIMAL" col={RED} />}>{(tt) => {
  const f = phys(tt, 0.2, 7, 0.4), a = phys(tt, 2.3, 9, 0.35), b = phys(tt, 2.75, 9, 0.35), W = 0.72, H_ = 0.3, D_ = 0.28, e = 0.006;
  return <>
    <Lawn />
    <group position={[0, 0.7 * (1 - f), 0]}>
      <Skunk p={[-0.02, 0.0, 0]} s={0.94} tail={0.9} />
      {[0, H_].flatMap((y) => [[0, -D_ / 2, W, e], [0, D_ / 2, W, e]].map((q, i) => <RBox key={y + "a" + i} s={[q[2], e, e]} p={[q[0], y + 0.01, q[1]]} r={0.001}>{M.steel({ col: "#7b7d7e" })}</RBox>))}
      {[0, H_].flatMap((y) => [-W / 2, W / 2].map((x, i) => <RBox key={y + "b" + i} s={[e, e, D_]} p={[x, y + 0.01, 0]} r={0.001}>{M.steel({ col: "#7b7d7e" })}</RBox>))}
      {Array.from({ length: 19 }, (_, i) => [D_ / 2, -D_ / 2].map((z) => <mesh key={i + "_" + z} position={[-W / 2 + (i + 0.5) * (W / 19), H_ / 2 + 0.01, z]}><cylinderGeometry args={[0.0018, 0.0018, H_, 4]} />{M.steel({ col: "#808283" })}</mesh>))}
      {Array.from({ length: 8 }, (_, i) => <mesh key={"v" + i} position={[0, 0.04 + i * 0.038, D_ / 2]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0014, 0.0014, W, 4]} />{M.steel({ col: "#808283" })}</mesh>)}
    </group>
    <RBox s={[1.0, 0.07, 0.016]} p={[0, 0.17, 0.2 + 0.6 * (1 - a)]} rot={[0, 0, 0.42]} r={0.006}>{M.wood({ base: [146, 106, 66] })}</RBox>
    <RBox s={[1.0, 0.07, 0.016]} p={[0, 0.17, 0.218 + 0.6 * (1 - b)]} rot={[0, 0, -0.42]} r={0.006}>{M.wood({ base: [134, 98, 62] })}</RBox>
  </>;
}}</Scene3D>;

// ---- EL CERCO DE LOS MESES: doce tablitas; un portón baja sobre mayo-agosto ----
export const HMonthGate: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 2, 1.4]} cam={{ at: [0, 0.34, 0], az: [-0.16, 0.14], el: [0.1, 0.08], r: [2.2, 1.86], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.9} x={960} y={940} txt="NEVER MAY THROUGH AUGUST" col={RED} />}>{(tt) => {
  const M_ = "JFMAMJJASOND".split(""), g = phys(tt, 1.7, 6, 0.5);
  return <>
    <Lawn />
    <RBox s={[3, 0.05, 0.05]} p={[0, 0.2, -0.02]} r={0.008}>{M.wood({ base: [108, 78, 50] })}</RBox>
    {M_.map((m, i) => { const x = -1.32 + i * 0.24, on = phys(tt, 0.1 + i * 0.09, 7, 0.5), hot = i >= 4 && i <= 7; return <group key={i} position={[x, 0.28 + 0.4 * (1 - on), 0.0]}><Sign id={"mg" + m + i} txt={m} p={[0, 0, 0]} w={0.19} h={0.26} col={hot && g > 0.5 ? "#d6614a" : "#e2d5b8"} /><RBox s={[0.03, 0.34, 0.02]} p={[0, -0.14, -0.018]} r={0.004}>{M.wood({ base: [132, 96, 62] })}</RBox></group>; })}
    <group position={[-0.0, 0.54 + 0.9 * (1 - g), 0.08]}>
      {[-0.48, 0.48].map((x) => <RBox key={x} s={[0.06, 0.6, 0.04]} p={[x, -0.12, 0]} r={0.008}>{M.wood({ base: [96, 62, 38] })}</RBox>)}
      {[0.02, -0.26].map((y) => <RBox key={y} s={[1.06, 0.05, 0.03]} p={[0, y, 0.01]} r={0.008}>{M.wood({ base: [110, 72, 44] })}</RBox>)}
    </group>
  </>;
}}</Scene3D>;

// ---- UNA HORA DESPUÉS: el sol baja atrás del deck, sube la luna y él sale solo ----
export const HSundownHour: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1.3, 1.1, 1.1]} warm={0.9} cam={{ at: [0, 0.34, 0], az: [0.18, -0.06], el: [0.08, 0.06], r: [2.3, 2.0], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={940} txt="AN HOUR AFTER SUNDOWN" col={AMB} />}>{(tt) => {
  const s = eio(tt, 0.2, 2.6), m = eio(tt, 2.5, 4.2), w = eio(tt, 3.5, 6.2);
  return <>
    <Lawn />
    <mesh position={[0, 1.2, -1.6]}><planeGeometry args={[9, 3.2]} /><meshBasicMaterial color="#141a33" transparent opacity={0.92 * m} /></mesh>
    <mesh position={[0.5, lerp(1.1, -0.05, s), -1.45]}><sphereGeometry args={[0.16, 32, 20]} />{M.glow({ col: "#ffb45a" })}</mesh>
    <mesh position={[-0.7, lerp(0.05, 1.1, m), -1.45]} visible={m > 0.01}><sphereGeometry args={[0.1, 32, 20]} />{M.glow({ col: "#f3f0dc" })}</mesh>
    <group position={[0, 0, -0.2]}>
      {Array.from({ length: 8 }, (_, i) => <RBox key={i} s={[0.2, 0.04, 0.9]} p={[-0.74 + i * 0.212, 0.42, 0]} r={0.006}>{M.wood({ base: [116, 84, 54] })}</RBox>)}
      {[-0.74, 0.74].map((x) => <RBox key={x} s={[0.08, 0.42, 0.08]} p={[x, 0.2, 0.4]} r={0.008}>{M.wood({ base: [98, 72, 48] })}</RBox>)}
      <mesh position={[0, 0.2, 0.0]}><planeGeometry args={[1.5, 0.4]} /><meshBasicMaterial color="#0b0a09" /></mesh>
    </group>
    <Skunk p={[lerp(-0.2, 0.95, w), 0, lerp(-0.1, 0.42, w)]} rot={[0, -0.4, 0]} s={0.84} walk={tt * 2} />
  </>;
}}</Scene3D>;

// ---- SU CASA: el corte del deck, oscuro y seco; él duerme enrollado adentro ----
export const HUnderDeckCut: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1.1, 2, 1.8]} cam={{ at: [0, 0.3, 0.2], az: [-0.16, 0.12], el: [0.08, 0.08], r: [2.3, 1.95], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.2} x={960} y={940} txt="DARK. QUIET. DRY." col={TX} />}>{(tt) => {
  const b = 1 + 0.03 * Math.sin(tt * 1.8);
  return <UnderDeck dark={0.32}>
    <mesh position={[0, 0.006, 0.05]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.28, 36]} /><meshStandardMaterial color="#8b6d4b" roughness={1} /></mesh>
    <group scale={[b, b, b]} position={[0, 0, 0.05]}><Skunk p={[0, -0.02, 0]} rot={[0, 0.5, 0]} s={1.05} tail={0.05} /></group>
  </UnderDeck>;
}}</Scene3D>;

// ---- LA LUZ: se enciende el foco en la otra punta y el oscuro se va ----
export const HLightFill: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1.1, 2, 1.8]} cam={{ at: [0, 0.3, 0.2], az: [0.2, -0.08], el: [0.09, 0.07], r: [2.2, 1.9], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.6} x={960} y={940} txt="DAY AND NIGHT" col={AMB} />}>{(tt) => {
  const l = eio(tt, 0.7, 1.05), w = eio(tt, 1.6, 4.4);
  return <UnderDeck dark={1 - 0.86 * l}>
    <group position={[0.92, 0, 0.1]}>
      <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.01, 0.018, 0.24, 10]} />{M.steel({ col: "#50504e" })}</mesh>
      <group position={[0, 0.28, 0]} rotation={[0, 0, PI / 2 + 0.25]}><mesh castShadow><cylinderGeometry args={[0.07, 0.1, 0.12, 24, 1, true]} />{M.steel({ col: "#d6a84a", side: 2 })}</mesh><mesh position={[0, -0.03, 0]}><sphereGeometry args={[0.05, 20, 14]} />{M.glow({ col: "#fff0c6", op: l })}</mesh></group>
    </group>
    <pointLight position={[0.72, 0.3, 0.2]} intensity={5 * l} distance={3.2} color="#ffe5b0" />
    <Skunk p={[lerp(-0.08, -0.82, w), 0, 0.08]} rot={[0, PI, 0]} s={0.94} walk={tt * 2.5} tail={0.3} />
  </UnderDeck>;
}}</Scene3D>;

// ---- LA RADIO: la perilla gira y las voces llenan el sótano; él levanta las orejas ----
export const HRadioTalk: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1.1, 2, 1.8]} cam={{ at: [0.18, 0.2, 0.2], az: [-0.1, 0.16], el: [0.08, 0.08], r: [1.42, 1.18], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={940} txt="AS FAR AS HE KNOWS, YOU MOVED IN" col={AMB} />}>{(tt) => {
  const k = eio(tt, 0.5, 1.2);
  return <UnderDeck dark={0.3}>
    <group position={[0.42, 0, 0.14]} rotation={[0, -0.25, 0]}>
      <RBox s={[0.36, 0.24, 0.12]} p={[0, 0.12, 0]} r={0.03}>{M.wood({ base: [120, 72, 40] })}</RBox>
      <mesh position={[-0.06, 0.13, 0.0615]}><circleGeometry args={[0.08, 32]} /><meshStandardMaterial color="#2a2522" roughness={0.9} /></mesh>
      <mesh position={[0.11, 0.17, 0.066]} rotation={[PI / 2, k * 3, 0]}><cylinderGeometry args={[0.024, 0.026, 0.02, 20]} />{M.brass()}</mesh>
      <mesh position={[0.11, 0.09, 0.066]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.02, 0.018, 20]} />{M.brass()}</mesh>
      <RBox s={[0.1, 0.014, 0.004]} p={[0.11, 0.135, 0.062]} r={0.001}>{M.glow({ col: "#ffb04a", op: k })}</RBox>
    </group>
    {[0, 1, 2, 3].map((i) => { const ph = (tt * 0.65 + i / 4) % 1; return <mesh key={i} position={[0.36, 0.14, 0.24]} rotation={[0, 0, 0]} visible={k > 0.5}><ringGeometry args={[0.08 + ph * 0.72, 0.09 + ph * 0.72, 56]} /><meshBasicMaterial color="#f5e3b6" transparent opacity={0.42 * (1 - ph)} depthWrite={false} /></mesh>; })}
    <Skunk p={[-0.42 - 0.2 * eio(tt, 2, 4), 0.01 + 0.018 * Math.abs(Math.sin(tt * 5)) * k, 0.1]} s={0.94} tail={0.5} walk={tt * 1.4 * (tt > 2 && tt < 4 ? 1 : 0)} />
  </UnderDeck>;
}}</Scene3D>;

// ---- A LA OLLA: cebolla y ají vuelan y salpican adentro ----
export const HPotToss: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" key1={[-1, 1.9, 1.3]} cam={{ at: [0.04, 0.15, 0], az: [-0.3, 0.16], el: [0.28, 0.22], r: [1.0, 0.82], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.1} x={960} y={940} txt="ONE ONION. ONE HOT PEPPER." col={AMB} />}>{(tt) => {
  const a = eio(tt, 0.4, 1.3), b = eio(tt, 1.6, 2.5), arc = (u: number, x0: number) => [lerp(x0, 0, u), 0.17 + 0.5 * Math.sin(u * PI) * (1 - u * 0.2) - u * 0.08, lerp(0.14, 0, u)], A = arc(a, -0.62), B = arc(b, 0.62);
  return <>
    <mesh position={[0, 0.105, 0]} castShadow><cylinderGeometry args={[0.21, 0.19, 0.21, 48, 1, true]} />{M.steel({ col: "#7a7c7f", side: 2 })}</mesh>
    <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.19, 0.19, 0.006, 48]} />{M.steel({ col: "#55575a" })}</mesh>
    <mesh position={[0, 0.17, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.2, 48]} />{M.water({})}</mesh>
    {[-1, 1].map((x) => <mesh key={x} position={[x * 0.235, 0.17, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.028, 0.008, 8, 20]} />{M.steel({ col: "#50504e" })}</mesh>)}
    <group position={A as any} visible={a < 0.995} rotation={[a * 5, a * 4, 0]}>
      <mesh castShadow scale={[1, 0.86, 1]}><sphereGeometry args={[0.06, 26, 18]} /><meshStandardMaterial color="#d6a14a" roughness={0.42} /></mesh>
      <mesh position={[0, 0.058, 0]}><coneGeometry args={[0.014, 0.05, 12]} /><meshStandardMaterial color="#a57a35" /></mesh></group>
    <group position={B as any} visible={b < 0.995} rotation={[b * 3, b * 6, 0.8]}>
      <mesh castShadow scale={[1, 2.2, 1]}><sphereGeometry args={[0.022, 18, 14]} /><meshStandardMaterial color="#4f9a33" roughness={0.3} /></mesh>
      <mesh position={[0, 0.058, 0]}><cylinderGeometry args={[0.005, 0.006, 0.02, 8]} /><meshStandardMaterial color="#6e8440" /></mesh></group>
    {[1.3, 2.5].map((at, j) => Array.from({ length: 9 }, (_, i) => { const k = cl((tt - at) / 0.5), a2 = i * 0.7; return <mesh key={j + "_" + i} visible={tt > at && k < 1} position={[Math.cos(a2) * 0.2 * k * 0.7, 0.17 + 0.16 * Math.sin(k * PI), Math.sin(a2) * 0.2 * k * 0.7]}><sphereGeometry args={[0.008, 8, 6]} />{M.water({})}</mesh>; }))}
  </>;
}}</Scene3D>;

let puff_: THREE.CanvasTexture | null = null;
export const puffT = () => { if (!puff_) { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d")!, r = g.createRadialGradient(64, 64, 4, 64, 64, 62); r.addColorStop(0, "rgba(255,255,255,.9)"); r.addColorStop(0.5, "rgba(255,255,255,.34)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 128, 128); puff_ = new THREE.CanvasTexture(c); } return puff_; };

// ---- EL VAPOR QUE SE VA: sube de la olla y sale por la ventana abierta ----
export const HSteamWindow: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#7f735f" key1={[-1, 1.9, 1.5]} cam={{ at: [0.1, 0.5, 0], az: [-0.2, 0.1], el: [0.04, 0.05], r: [1.7, 1.42], fov: 28 }}
  over={(tt) => <>{Array.from({ length: 30 }, (_, i) => { const u = (tt * 0.3 + i / 30) % 1, x = lerp(300, 1290, eio(u, 0.22, 1)) + 30 * Math.sin(u * 11 + i), y = lerp(650, 330, Math.min(1, u * 1.7)) + 22 * Math.sin(u * 9 + i * 2), d = 130 + 300 * u; return <div key={i} style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", opacity: 0.34 * Math.sin(u * PI) * cl((tt - 0.4) / 0.9), background: "radial-gradient(circle, rgba(250,246,236,0.95) 0%, rgba(250,246,236,0.4) 42%, rgba(250,246,236,0) 70%)" }} />; })}<Tag tt={tt} at={2.8} x={960} y={940} txt="KITCHEN WINDOW OPEN" col={GRN} /></>}>{(tt) => {
  const o = eio(tt, 0.2, 1.3), W = 0.62, wx = 0.42, wy = 0.66;
  return <>
    <mesh position={[0, 0.8, -0.36]}><planeGeometry args={[4, 2.4]} /><meshStandardMaterial color="#c8bb9c" roughness={1} /></mesh>
    <mesh position={[wx, wy, -0.355]}><planeGeometry args={[W, 0.6]} /><meshBasicMaterial color="#b6d3e6" /></mesh>
    <mesh position={[wx, wy - 0.18, -0.352]}><planeGeometry args={[W, 0.24]} /><meshBasicMaterial color="#6f9a54" /></mesh>
    {[[0, 0.32, W + 0.08, 0.05], [0, -0.32, W + 0.08, 0.05], [-W / 2 - 0.015, 0, 0.05, 0.68], [W / 2 + 0.015, 0, 0.05, 0.68]].map((q, i) => <RBox key={i} s={[q[2], q[3], 0.05]} p={[wx + q[0], wy + q[1], -0.33]} r={0.006}>{M.wood({ base: [224, 216, 198] })}</RBox>)}
    <RBox s={[W, 0.3, 0.018]} p={[wx, wy + 0.14 + 0.28 * o - 0.1, -0.3]} r={0.004}>{M.glass({})}</RBox>
    <RBox s={[3.2, 0.05, 0.6]} p={[0, 0.22, 0]} r={0.01}>{M.wood({ base: [140, 104, 66] })}</RBox>
    <mesh position={[-0.42, 0.33, 0]} castShadow><cylinderGeometry args={[0.13, 0.12, 0.17, 40, 1, true]} />{M.steel({ col: "#6f7174", side: 2 })}</mesh>
  </>;
}}</Scene3D>;

// ---- PONELE EL CARTEL: el frasco con el líquido rojo; el rótulo se escribe de izquierda a derecha ----
export const HNotFood: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" key1={[-1, 1.9, 1.4]} cam={{ at: [0, 0.14, 0], az: [0.28, -0.04], el: [0.12, 0.09], r: [0.8, 0.64], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="WRITE IT BIG" col={RED} />}>{(tt) => {
  const l = eio(tt, 0.7, 2.5);
  return <>
    <mesh position={[0, 0.13, 0]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.26, 44]} />{M.glass({})}</mesh>
    <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.092, 0.092, 0.21, 40]} /><meshPhysicalMaterial color="#b63a1b" roughness={0.15} transparent opacity={0.86} /></mesh>
    <mesh position={[0, 0.272, 0]}><cylinderGeometry args={[0.083, 0.083, 0.026, 40]} />{M.steel({ col: "#c9c6bd" })}</mesh>
    <group position={[0, 0.13, 0.102]}><Sign id="nfl" txt="NOT FOOD" p={[0, 0, 0]} w={0.17} h={0.09} col="#f1ead8" /></group>
    <mesh position={[0.085 * 1 - 0.17 * l / 2 + 0.0, 0.13, 0.1055]}><planeGeometry args={[Math.max(0.001, 0.17 * (1 - l)), 0.09]} /><meshBasicMaterial color="#f1ead8" /></mesh>
    <group position={[-0.085 + 0.17 * l, 0.16 + 0.012 * Math.sin(tt * 16) * (l > 0 && l < 1 ? 1 : 0), 0.14]} rotation={[0.9, 0, -0.5]}>
      <mesh castShadow><cylinderGeometry args={[0.008, 0.002, 0.15, 12]} /><meshStandardMaterial color="#232327" roughness={0.42} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- NO ES UN CERCO: la nube rociada se apaga sola y él pasa caminando ----
export const HNoForce: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 2, 1.2]} cam={{ at: [0, 0.06, 0], az: [0.3, 0.1], el: [0.52, 0.42], r: [2.1, 1.75], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.3} x={960} y={940} txt="IT'S NOT A FENCE" col={RED} />}>{(tt) => {
  const f = 1 - eio(tt, 1.6, 3.0), w = eio(tt, 1.9, 5.7);
  return <>
    <Lawn />
    {Array.from({ length: 48 }, (_, i) => { const a = (i / 48) * 6.28; return <mesh key={i} position={[Math.cos(a) * 0.72, 0.09 + 0.015 * Math.sin(tt * 3 + i), Math.sin(a) * 0.44]} visible={f > 0.03}><sphereGeometry args={[0.09 * (0.8 + rn(i, 2) * 0.5), 14, 10]} /><meshBasicMaterial color="#d9733d" transparent opacity={0.42 * f} depthWrite={false} /></mesh>; })}
    {Array.from({ length: 150 }, (_, i) => { const a = (i / 150) * 6.28 + rn(i, 5) * 0.06, q = 1 + (rn(i, 3) - 0.5) * 0.07; return <mesh key={i} position={[Math.cos(a) * 0.72 * q, 0.012, Math.sin(a) * 0.44 * q]} rotation={[-PI / 2, 0, rn(i, 7) * 6]}><circleGeometry args={[0.012 + rn(i, 4) * 0.014, 7]} /><meshStandardMaterial color={i % 3 ? "#b4431c" : "#7d2a12"} roughness={1} /></mesh>; })}
    <Skunk p={[lerp(-1.02, 0.98, w), 0, 0.02]} s={0.82} walk={tt * 2.2} />
    <Blades w={3} d={1.8} n={280} h={0.05} />
  </>;
}}</Scene3D>;

// ---- CON EL RASTRILLO: la lata agujereada se empuja bien al fondo; vos te quedás afuera ----
export const HRakeSlide: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1.1, 2, 1.8]} cam={{ at: [-0.12, 0.26, 0.3], az: [0.5, 0.3], el: [0.13, 0.1], r: [2.1, 1.8], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={940} txt="DO NOT CRAWL UNDER THERE" col={RED} />}>{(tt) => {
  const k = eio(tt, 0.4, 4.0), z = lerp(0.82, -0.3, k);
  return <UnderDeck dark={0.22}>
    <group position={[0, 0.002, z]} rotation={[0, k * 0.12, 0]}>
      <mesh position={[0, 0.095, 0]} castShadow><cylinderGeometry args={[0.075, 0.075, 0.19, 32]} />{M.steel({ col: "#c4c5c1" })}</mesh>
      {Array.from({ length: 22 }, (_, i) => { const a = i * 0.73, y = 0.03 + (i % 4) * 0.04; return <mesh key={i} position={[Math.sin(a) * 0.0757, y, Math.cos(a) * 0.0757]} rotation={[0, a, 0]}><circleGeometry args={[0.0065, 10]} /><meshBasicMaterial color="#141210" /></mesh>; })}
    </group>
    <group position={[0, 0.03, z + 0.075]}>
      <RBox s={[0.36, 0.024, 0.024]} p={[0, 0, 0.01]} r={0.006}>{M.steel({ col: "#62625e" })}</RBox>
      <mesh position={[0, 0.0, 1.0]} rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.014, 0.014, 2, 12]} />{M.wood({ base: [176, 134, 84] })}</mesh>
    </group>
    <Lattice w={0} h={0} />
  </UnderDeck>;
}}</Scene3D>;

// ---- UNA SOLA SALIDA: desde arriba la línea rociada rodea el deck y deja un hueco, por donde sale ----
export const HPerimeterGap: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-0.8, 2.4, 0.6]} cam={{ at: [0, 0, 0.12], az: [0.1, -0.08], el: [1.1, 0.96], r: [2.2, 1.9], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={940} txt="LEAVE HIM ONE WAY OUT" col={GRN} />}>{(tt) => {
  const k = eio(tt, 0.3, 3.4), Wd = 0.74, Dd = 0.42, N = 96, sk = eio(tt, 3.6, 6.0);
  return <>
    <Lawn />
    {Array.from({ length: 9 }, (_, i) => <RBox key={i} s={[(2 * Wd) / 9 - 0.01, 0.04, 2 * Dd]} p={[-Wd + (i + 0.5) * ((2 * Wd) / 9), 0.5, 0]} r={0.006}>{M.wood({ base: [132 + (i % 3) * 8, 96, 60] })}</RBox>)}
    {Array.from({ length: N }, (_, i) => { const u = i / N, S = (Wd * 2 + Dd * 2) * 2, s = u * S, inside = (() => { let a = s; if (a < 2 * Wd) return [-Wd + a, Dd + 0.05]; a -= 2 * Wd; if (a < 2 * Dd) return [Wd + 0.05, Dd - a]; a -= 2 * Dd; if (a < 2 * Wd) return [Wd - a, -Dd - 0.05]; a -= 2 * Wd; return [-Wd - 0.05, -Dd + a]; })(), gap = u < 0.13 && u > 0.07; return <mesh key={i} visible={u <= k && !gap} position={[inside[0], 0.006, inside[1]]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.06, 16]} /><meshStandardMaterial color="#37491f" roughness={1} transparent opacity={0.8} /></mesh>; })}
    <Skunk p={[-0.31, 0, lerp(0.34, 0.92, sk)]} rot={[0, -PI / 2, 0]} s={0.56} walk={tt * 2} />
  </>;
}}</Scene3D>;
