// lhh29b · piezas compartidas de los componentes del limón: limón entero (cáscara con poros), medio limón (cara cortada con gajos),
// gajo suelto, botella de aerosol y frasco de vidrio. No exporta nada que empiece con H (body_gen sólo cuenta los héroes).
import React from "react";
import * as THREE from "three";
import { M, RBox, tex, rn } from "./h3d";

const PI = Math.PI;
export const lathe = (pts: number[][], seg = 64) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
export const SERIF = "Georgia, 'Times New Roman', serif";

// cáscara: amarillo con poros (bump) — una sola textura
export const rindTex = () => tex.text("rind", 256, 256, (g) => {
  g.fillStyle = "#f3d23a"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 900; i++) { const v = rn(i, 2); g.fillStyle = `rgba(${200 + v * 40},${150 + v * 50},20,${0.18 + 0.2 * rn(i, 3)})`; g.beginPath(); g.arc(rn(i, 4) * 256, rn(i, 5) * 256, 0.8 + 1.8 * rn(i, 6), 0, 6.3); g.fill(); }
});
// cara cortada: cáscara, blanco, gajos translúcidos y semillas
export const cutTex = (n = 10) => tex.text("lemcut" + n, 512, 512, (g) => {
  const c = 256; g.fillStyle = "#f2cf2c"; g.beginPath(); g.arc(c, c, 254, 0, 6.3); g.fill();
  g.fillStyle = "#fbf6e2"; g.beginPath(); g.arc(c, c, 236, 0, 6.3); g.fill();
  for (let i = 0; i < n; i++) { const a0 = (i / n) * PI * 2 + 0.03, a1 = ((i + 1) / n) * PI * 2 - 0.03;
    const gr = g.createRadialGradient(c, c, 20, c, c, 215); gr.addColorStop(0, "#fff6b8"); gr.addColorStop(1, "#f6dc54");
    g.fillStyle = gr; g.beginPath(); g.moveTo(c + Math.cos((a0 + a1) / 2) * 18, c + Math.sin((a0 + a1) / 2) * 18); g.arc(c, c, 214, a0, a1); g.closePath(); g.fill();
    for (let k = 0; k < 14; k++) { const a = a0 + (a1 - a0) * rn(i * 20 + k, 3), r = 40 + 160 * rn(i * 20 + k, 4); g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 2; g.beginPath(); g.moveTo(c + Math.cos(a) * r, c + Math.sin(a) * r); g.lineTo(c + Math.cos(a) * (r + 22), c + Math.sin(a) * (r + 22)); g.stroke(); } }
  g.fillStyle = "#fbf6e2"; g.beginPath(); g.arc(c, c, 18, 0, 6.3); g.fill();
  for (let i = 0; i < 3; i++) { const a = i * 2.1 + 0.4; g.fillStyle = "#efe2b0"; g.beginPath(); g.ellipse(c + Math.cos(a) * 70, c + Math.sin(a) * 70, 9, 15, a, 0, 6.3); g.fill(); }
});

export const Lemon: React.FC<{ p?: number[]; s?: number; rot?: number[]; squeeze?: number }> = ({ p = [0, 0, 0], s = 1, rot = [0, 0, 0], squeeze = 0 }) =>
  <group position={p as [number, number, number]} rotation={rot as [number, number, number]} scale={s}>
    <mesh scale={[1.32, 1 - 0.25 * squeeze, 1]} castShadow><sphereGeometry args={[0.04, 48, 32]} /><meshPhysicalMaterial map={rindTex()} bumpMap={rindTex()} bumpScale={0.6} roughness={0.42} clearcoat={0.55} clearcoatRoughness={0.4} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[k * 0.054, 0, 0]} rotation={[0, 0, -k * PI / 2]} castShadow><coneGeometry args={[0.009, 0.014, 16]} /><meshPhysicalMaterial color="#e6c21f" roughness={0.45} /></mesh>)}
  </group>;

// medio limón: la cara cortada mira hacia +y (rotarlo para mostrarla a cámara)
export const LemonHalf: React.FC<{ p?: number[]; s?: number; rot?: number[]; squeeze?: number; n?: number }> = ({ p = [0, 0, 0], s = 1, rot = [0, 0, 0], squeeze = 0, n = 10 }) =>
  <group position={p as [number, number, number]} rotation={rot as [number, number, number]} scale={s}>
    <mesh scale={[1.25, 1 - 0.4 * squeeze, 1]} castShadow><sphereGeometry args={[0.04, 48, 24, 0, PI * 2, PI / 2, PI / 2]} /><meshPhysicalMaterial map={rindTex()} bumpMap={rindTex()} bumpScale={0.6} roughness={0.42} clearcoat={0.55} side={THREE.DoubleSide} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} scale={[1.25, 1, 1]} position={[0, 0.0005, 0]}><circleGeometry args={[0.04, 48]} /><meshPhysicalMaterial map={cutTex(n)} roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} /></mesh>
  </group>;

// botella de aerosol de tienda (cuerpo, cuello, gatillo); col = color del líquido/plástico
export const Spray: React.FC<{ p?: number[]; rot?: number[]; col?: string; s?: number; clear?: boolean; fill?: number; fill2?: number; c2?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], col = "#3f8fd8", s = 1, clear = false, fill = 1, fill2 = 0, c2 = "#d8eef8" }) =>
  <group position={p as [number, number, number]} rotation={rot as [number, number, number]} scale={s}>
    <mesh geometry={lathe([[0, 0], [0.034, 0], [0.036, 0.01], [0.036, 0.13], [0.03, 0.15], [0.014, 0.165], [0.014, 0.18], [0, 0.18]])} castShadow>
      {clear ? M.glass({ op: 0.25 }) : <meshPhysicalMaterial color={col} roughness={0.28} clearcoat={0.8} transparent opacity={0.92} />}</mesh>
    {clear && fill > 0 && <mesh position={[0, 0.005 + 0.0625 * fill, 0]}><cylinderGeometry args={[0.032, 0.032, 0.125 * fill, 40]} /><meshPhysicalMaterial color={col} roughness={0.1} transparent opacity={0.75} clearcoat={1} /></mesh>}
    {clear && fill2 > 0 && <mesh position={[0, 0.005 + 0.125 * fill + 0.0625 * fill2, 0]}><cylinderGeometry args={[0.032, 0.032, 0.125 * fill2, 40]} /><meshPhysicalMaterial color={c2} roughness={0.05} transparent opacity={0.45} clearcoat={1} /></mesh>}
    <RBox s={[0.03, 0.035, 0.03]} p={[0, 0.195, 0]} r={0.006}><meshPhysicalMaterial color={clear ? "#f2f2f2" : "#ffffff"} roughness={0.35} clearcoat={0.4} /></RBox>
    <RBox s={[0.055, 0.016, 0.022]} p={[0.022, 0.208, 0]} r={0.005}><meshPhysicalMaterial color={clear ? "#f2f2f2" : "#ffffff"} roughness={0.35} /></RBox>
    <RBox s={[0.008, 0.04, 0.016]} p={[0.03, 0.18, 0]} rot={[0, 0, -0.3]} r={0.003}><meshPhysicalMaterial color="#e8e8e8" roughness={0.4} /></RBox>
  </group>;

// frasco de conserva de un cuarto con tapa metálica; peel = cáscaras adentro, liq = altura del vinagre (0..1)
export const QuartJar: React.FC<{ p?: number[]; s?: number; peel?: number; liq?: number; op?: number }> = ({ p = [0, 0, 0], s = 1, peel = 0.75, liq = 0.8, op = 1 }) =>
  <group position={p as [number, number, number]} scale={s}>
    <mesh geometry={lathe([[0, 0], [0.05, 0], [0.055, 0.01], [0.055, 0.15], [0.045, 0.17], [0.042, 0.185], [0, 0.185]])}>{M.glass({ op: 0.22 * op })}</mesh>
    {liq > 0 && <mesh position={[0, 0.005 + 0.075 * liq, 0]}><cylinderGeometry args={[0.051, 0.051, 0.15 * liq, 40]} /><meshPhysicalMaterial color="#f4e7a2" roughness={0.05} transparent opacity={0.4 * op} clearcoat={1} /></mesh>}
    {Array.from({ length: Math.round(16 * peel) }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.07, 0.015 + rn(i, 3) * 0.13 * peel, (rn(i, 4) - 0.5) * 0.07]} rotation={[rn(i, 5) * 6, rn(i, 6) * 6, rn(i, 7) * 6]}>
      <sphereGeometry args={[0.022, 16, 8, 0, 2.2, 0, 1.4]} /><meshPhysicalMaterial map={rindTex()} roughness={0.5} side={THREE.DoubleSide} transparent opacity={op} /></mesh>)}
    <mesh position={[0, 0.19, 0]}><cylinderGeometry args={[0.046, 0.046, 0.014, 40]} />{M.steel({ op })}</mesh>
  </group>;
