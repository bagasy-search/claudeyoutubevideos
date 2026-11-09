// ohf8pb · piezas de vereda: losa de hormigón vieja, corte de tierra, jardín de fondo, llana, martillo, regla, bota, ladrillo de mortero.
import React from "react";
import * as THREE from "three";
import { M, RBox, tex, rn } from "./h3d";
import { V3 } from "./okit";

export const PI = Math.PI, Y0 = 0.5;
const concT = (k: string, base: string, n = 900) => tex.text("conc" + k + base, 512, 512, (g) => {
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < n; i++) { const x = rn(i, 2) * 512, y = rn(i, 3) * 512, r = 0.5 + rn(i, 4) * 2.2, d = rn(i, 5); g.fillStyle = d > 0.5 ? `rgba(40,38,34,${0.06 + d * 0.16})` : `rgba(235,230,220,${0.05 + d * 0.2})`; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  for (let i = 0; i < 14; i++) { const x = rn(i, 7) * 512, y = rn(i, 8) * 512, r = 40 + rn(i, 9) * 90; const gr = g.createRadialGradient(x, y, 2, x, y, r); gr.addColorStop(0, `rgba(70,66,56,${0.1 + rn(i, 10) * 0.14})`); gr.addColorStop(1, "rgba(70,66,56,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
});
export const CONC = { old: "#9b978c", clean: "#b5b2a8", dark: "#6f6c63", fresh: "#a8a59a", mort: "#8f8d85" };
export const Conc: React.FC<{ col?: string; k?: string; rough?: number; gloss?: boolean }> = ({ col = CONC.old, k = "a", rough = 0.92, gloss }) => gloss ? <meshPhysicalMaterial map={concT(k, col)} roughness={0.14} clearcoat={1} clearcoatRoughness={0.06} /> : <meshStandardMaterial map={concT(k, col)} roughness={rough} />;

// losa: caja de hormigón. p = centro; tilt alrededor de Z
export const Slab: React.FC<{ w?: number; d?: number; h?: number; p?: number[]; rot?: number[]; col?: string; k?: string; gloss?: boolean }> = ({ w = 1, d = 0.66, h = 0.2, p = [0, Y0 - 0.08, 0.03], rot = [0, 0, 0], col, k, gloss }) => <RBox s={[w, h, d]} p={p} rot={rot} r={0.012}><Conc col={col} k={k} gloss={gloss} /></RBox>;

const dirtT = () => tex.text("dirt2", 1024, 512, (g) => {
  g.fillStyle = "#5a4230"; g.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 2600; i++) { const x = rn(i, 12) * 1024, y = rn(i, 13) * 512, r = 0.8 + rn(i, 14) * 3; g.fillStyle = rn(i, 15) > 0.5 ? "rgba(30,20,12,.3)" : "rgba(150,120,90,.22)"; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  for (let i = 0; i < 70; i++) { const x = rn(i, 16) * 1024, y = 140 + rn(i, 17) * 372, r = 5 + rn(i, 18) * 15; g.fillStyle = "#857a6c"; g.beginPath(); g.ellipse(x, y, r, r * 0.68, rn(i, 19) * 3, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.14)"; g.beginPath(); g.ellipse(x - r * 0.25, y - r * 0.25, r * 0.4, r * 0.24, 0, 0, 7); g.fill(); }
});
// el bloque de tierra con el pasto atrás y la casa al fondo. Sobre esto se apoyan las losas en corte.
const grassT = () => tex.text("grass2", 1024, 1024, (g) => {
  g.fillStyle = "#4f6a34"; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 9000; i++) { const x = rn(i, 22) * 1024, y = rn(i, 23) * 1024, l = 5 + rn(i, 24) * 15, a = rn(i, 25) * 0.9 - 0.45, d = rn(i, 26); g.strokeStyle = d > 0.6 ? "rgba(146,172,88,.5)" : d > 0.3 ? "rgba(36,56,22,.42)" : "rgba(92,122,56,.5)"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + a * l, y - l); g.stroke(); }
});
const clapT = () => tex.text("clap2", 1024, 512, (g) => { g.fillStyle = "#dcd6c6"; g.fillRect(0, 0, 1024, 512); for (let y = 0; y < 512; y += 34) { g.fillStyle = "rgba(90,84,70,.42)"; g.fillRect(0, y, 1024, 3); g.fillStyle = "rgba(255,255,255,.34)"; g.fillRect(0, y + 3, 1024, 2); } });
export const grassMat = () => { const m = grassT(); m.wrapS = m.wrapT = THREE.RepeatWrapping; m.repeat.set(5, 4); return m; };
export const clapMat = () => clapT();

export const Yard: React.FC<{ cut?: boolean; w?: number }> = ({ cut = true, w = 8 }) => <group>
  {cut && <mesh position={[0, Y0 / 2 - 0.5, 0.35]} receiveShadow><planeGeometry args={[w, Y0 + 1]} /><meshStandardMaterial map={dirtT()} roughness={0.98} /></mesh>}
  <mesh position={[0, Y0, cut ? -3.1 : -0.1]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[Math.max(14, w + 4), cut ? 6.88 : 12.88]} /><meshStandardMaterial map={grassMat()} roughness={0.96} /></mesh>
  <mesh position={[0, Y0 + 2.4, -6.6]}><planeGeometry args={[18, 4.8]} /><meshStandardMaterial map={clapT()} roughness={0.85} /></mesh>
  <mesh position={[0, Y0 + 7.8, -6.7]}><planeGeometry args={[30, 6.2]} /><meshBasicMaterial color="#b9cbd8" toneMapped={false} /></mesh>
  {[-5.2, -2.2, 3.4].map((x) => <group key={x} position={[x, Y0 + 2.1, -6.55]}><RBox s={[1, 1.4, 0.04]} r={0.01}><meshStandardMaterial color="#efe9db" roughness={0.6} /></RBox><mesh position={[0, 0, 0.024]}><planeGeometry args={[0.8, 1.2]} /><meshBasicMaterial color="#8ea5b6" toneMapped={false} /></mesh></group>)}
  {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[-7 + i * 0.95, Y0 + 0.42 + rn(i, 31) * 0.12, -6.1 + rn(i, 32) * 0.2]} castShadow><sphereGeometry args={[0.62 + rn(i, 33) * 0.22, 14, 10]} /><meshStandardMaterial color={i % 2 ? "#3f5a30" : "#4d6a38"} roughness={0.95} /></mesh>)}
</group>;

export const Trowel: React.FC<{ p?: number[]; rot?: number[]; s?: number; wide?: boolean }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, wide }) => <group position={p as V3} rotation={rot as V3} scale={s}>
  {wide ? <RBox s={[0.4, 0.006, 0.13]} r={0.002}>{M.steel({ col: "#c7ccd0" })}</RBox> : <mesh rotation={[-PI / 2, 0, -PI / 2]} position={[0, 0, 0]}><shapeGeometry args={[(() => { const sh = new THREE.Shape(); sh.moveTo(-0.15, -0.06); sh.lineTo(0.18, 0); sh.lineTo(-0.15, 0.06); sh.closePath(); return sh; })()]} /><meshStandardMaterial color="#c7ccd0" metalness={0.85} roughness={0.28} side={THREE.DoubleSide} /></mesh>}
  <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.008, 0.008, 0.1, 10]} />{M.steel({ col: "#7d8388" })}</mesh>
  <mesh position={[0, 0.1, 0]} rotation={[PI / 2, 0, 0]}><capsuleGeometry args={[0.024, 0.17, 6, 16]} /><meshStandardMaterial color="#8a5a33" roughness={0.6} /></mesh>
</group>;

export const Hammer: React.FC<{ p?: number[]; rot?: number[]; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => <group position={p as V3} rotation={rot as V3} scale={s}>
  <RBox s={[0.18, 0.08, 0.08]} r={0.01}>{M.steel({ col: "#70767c" })}</RBox>
  <mesh position={[0, 0.24, 0]}><cylinderGeometry args={[0.018, 0.024, 0.42, 16]} /><meshStandardMaterial color="#b98a55" roughness={0.55} /></mesh>
</group>;

export const Boot: React.FC<{ p?: number[]; rot?: number[]; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => <group position={p as V3} rotation={rot as V3} scale={s}>
  <RBox s={[0.42, 0.05, 0.15]} p={[0.03, 0.025, 0]} r={0.018}><meshStandardMaterial color="#1f1b18" roughness={0.75} /></RBox>
  <RBox s={[0.4, 0.13, 0.145]} p={[0.02, 0.11, 0]} r={0.05}><meshStandardMaterial color="#5e4026" roughness={0.55} /></RBox>
  <RBox s={[0.17, 0.3, 0.14]} p={[-0.09, 0.28, 0]} r={0.05}><meshStandardMaterial color="#54381f" roughness={0.6} /></RBox>
  <RBox s={[0.22, 0.34, 0.15]} p={[-0.09, 0.56, 0]} r={0.05}><meshStandardMaterial color="#2b3b4e" roughness={0.85} /></RBox>
</group>;

// reglón de madera: a lo largo de X
export const Board: React.FC<{ l?: number; p?: number[]; rot?: number[]; h?: number; d?: number }> = ({ l = 1.6, p = [0, 0, 0], rot = [0, 0, 0], h = 0.08, d = 0.09 }) => <RBox s={[l, h, d]} p={p} rot={rot} r={0.006}>{M.wood({ base: [176, 134, 86] })}</RBox>;

// cuña de mortero: x de 0 a l, alto de h0 (izq) a h1 (der), profundidad d; fin = cuánto está hecha
export const Wedge: React.FC<{ l: number; h0: number; h1: number; d?: number; p?: number[]; col?: string; k?: string }> = ({ l, h0, h1, d = 0.66, p = [0, 0, 0], col = CONC.fresh, k = "m" }) => {
  const geo = React.useMemo(() => { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(l, 0); sh.lineTo(l, Math.max(0.0006, h1)); sh.lineTo(0, Math.max(0.0006, h0)); sh.closePath(); const g = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false }); g.translate(0, 0, -d / 2); return g; }, [l, h0, h1, d]);
  return <mesh geometry={geo} position={p as V3} castShadow receiveShadow><Conc col={col} k={k} /></mesh>;
};

export const Bucket: React.FC<{ p?: number[]; s?: number; col?: string }> = ({ p = [0, 0, 0], s = 1, col = "#e5e2d9" }) => <group position={p as V3} scale={s}>
  <mesh position={[0, 0.17, 0]} castShadow><cylinderGeometry args={[0.15, 0.125, 0.34, 32, 1, true]} /><meshStandardMaterial color={col} roughness={0.5} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.27, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.146, 32]} /><meshStandardMaterial color="#8c8a82" roughness={0.9} /></mesh>
</group>;

// bandeja de pregunta: fleje de medir amarillo
export const Rule: React.FC<{ l?: number; p?: number[]; rot?: number[]; n?: number }> = ({ l = 1, p = [0, 0, 0], rot = [0, 0, 0], n = 10 }) => <group position={p as V3} rotation={rot as V3}>
  <RBox s={[l, 0.004, 0.06]} r={0.001}><meshStandardMaterial color="#e6c04e" roughness={0.5} /></RBox>
  {Array.from({ length: n + 1 }, (_, i) => <RBox key={i} s={[0.005, 0.002, i % 5 === 0 ? 0.04 : 0.024]} p={[-l / 2 + (i * l) / n, 0.004, -0.012]} r={0.0005} shadow={false}><meshBasicMaterial color="#1a1a1a" /></RBox>)}
</group>;
