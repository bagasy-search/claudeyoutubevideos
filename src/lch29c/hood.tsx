// lch29c · kit de la campana: filtro de malla (con agujeros de verdad), carbón, campana, olla, pava, caja de bicarbonato, botellas, utensilios.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, lerp, rn, tex } from "./h3d";

const PI = Math.PI;
const TX = new Map<string, THREE.Texture>();
// malla en rombos: hilos opacos, agujeros transparentes; dirt 0..1 tapa los agujeros de marrón (10 niveles en caché)
export const meshTex = (dirt = 0, dark = 0) => {
  const d = Math.round(cl(dirt) * 10), k = Math.round(cl(dark) * 10), key = `m${d}|${k}`;
  if (TX.has(key)) return TX.get(key)!;
  const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d")!;
  g.clearRect(0, 0, 256, 256);
  const wire = `rgb(${lerp(205, 70, k / 10)},${lerp(208, 72, k / 10)},${lerp(212, 76, k / 10)})`;
  g.strokeStyle = wire; g.lineWidth = 5;
  for (let i = -256; i < 512; i += 22) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 256, 256); g.stroke(); g.beginPath(); g.moveTo(i + 256, 0); g.lineTo(i, 256); g.stroke(); }
  // grasa: manchas marrones que crecen hasta tapar todo
  for (let i = 0; i < 160 * d; i++) { g.fillStyle = `rgba(${90 + 40 * rn(i, 2)},${52 + 20 * rn(i, 3)},${18},${0.55 + 0.4 * rn(i, 4)})`; g.beginPath(); g.arc(rn(i, 5) * 256, rn(i, 6) * 256, 4 + 10 * rn(i, 7) * (0.5 + d / 10), 0, PI * 2); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); t.colorSpace = THREE.SRGBColorSpace; TX.set(key, t); return t;
};

// FILTRO de malla: marco de aluminio + 2 capas de malla con agujeros reales (alphaTest)
export const Filter: React.FC<{ w?: number; d?: number; dirt?: number; dark?: number; layers?: number; gap?: number }> = ({ w = 0.36, d = 0.24, dirt = 0, dark = 0, layers = 3, gap = 0.006 }) => <group>
  {[[0, d / 2], [0, -d / 2]].map(([x, z], i) => <RBox key={i} s={[w + 0.012, 0.016, 0.012]} p={[x, 0, z]} r={0.003}>{M.steel({ col: dirt > 0.5 ? "#7a5a34" : "#c4c8cc" })}</RBox>)}
  {[w / 2, -w / 2].map((x, i) => <RBox key={i} s={[0.012, 0.016, d]} p={[x, 0, 0]} r={0.003}>{M.steel({ col: dirt > 0.5 ? "#7a5a34" : "#c4c8cc" })}</RBox>)}
  {Array.from({ length: layers }, (_, i) => <mesh key={i} position={[0, -0.005 + i * gap, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[w, d]} /><meshStandardMaterial map={meshTex(dirt, dark)} alphaTest={0.4} transparent side={THREE.DoubleSide} metalness={0.6} roughness={0.35} /></mesh>)}
  <mesh position={[w / 2 - 0.03, 0.004, d / 2 - 0.004]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.012, 0.0025, 8, 20]} />{M.steel()}</mesh>
</group>;

// MANO de arcilla (palma hacia arriba por defecto): palma + 4 dedos + pulgar; grip 0..1 cierra los dedos
export const Hand: React.FC<{ grip?: number; col?: string }> = ({ grip = 0, col = "#d9a888" }) => <group>
  <RBox s={[0.085, 0.026, 0.09]} r={0.012}><meshStandardMaterial color={col} roughness={0.65} /></RBox>
  {[-0.03, -0.01, 0.01, 0.03].map((x, i) => <group key={i} position={[x, 0, 0.045]} rotation={[-1.2 * grip, 0, 0]}><mesh position={[0, 0, 0.032 - 0.004 * Math.abs(i - 1.5)]} rotation={[PI / 2, 0, 0]}><capsuleGeometry args={[0.0095, 0.045 - 0.006 * Math.abs(i - 1.5), 8, 14]} /><meshStandardMaterial color={col} roughness={0.65} /></mesh></group>)}
  <group position={[0.05, 0, 0.0]} rotation={[0, -0.6, -0.9 * grip]}><mesh position={[0.02, 0, 0.01]} rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.011, 0.035, 8, 14]} /><meshStandardMaterial color={col} roughness={0.65} /></mesh></group>
  <mesh position={[0, 0, -0.07]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.032, 0.07, 18]} /><meshStandardMaterial color={col} roughness={0.65} /></mesh>
  <mesh position={[0, 0, -0.13]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.06, 18]} /><meshStandardMaterial color="#c9b6d8" roughness={0.8} /></mesh>
</group>;

// MIGA irregular (icosaedro deformado)
export const Crumb: React.FC<{ s?: number; col?: string; i?: number }> = ({ s = 0.02, col = "#1c1d1f", i = 0 }) => <mesh scale={[s * (0.8 + 0.5 * rn(i, 11)), s * (0.5 + 0.4 * rn(i, 12)), s * (0.8 + 0.5 * rn(i, 13))]} rotation={[rn(i, 14) * 3, rn(i, 15) * 3, 0]}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color={col} roughness={1} flatShading /></mesh>;

// FILTRO de carbón: almohadón negro, fofo
const feltTex = () => tex.text("felt", 128, 128, (g) => { g.fillStyle = "#1c1d1f"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 2500; i++) { const v = 20 + 30 * rn(i, 2); g.fillStyle = `rgb(${v},${v},${v + 2})`; g.fillRect(rn(i, 3) * 128, rn(i, 4) * 128, 1 + rn(i, 5) * 2, 1); } });
export const Charcoal: React.FC<{ w?: number; d?: number }> = ({ w = 0.34, d = 0.22 }) => <RBox s={[w, 0.03, d]} r={0.012}><meshStandardMaterial map={feltTex()} roughness={1} /></RBox>;

// CAMPANA de acero sobre la hornalla (frente inclinado, labio abajo, botones, luz)
export const Hood: React.FC<{ col?: string; light?: number; grime?: number }> = ({ col = "#cfd3d7", light = 0, grime = 0 }) => {
  const mat = <meshStandardMaterial color={col} metalness={0.8} roughness={0.3} />;
  return <group>
    <RBox s={[0.9, 0.12, 0.5]} p={[0, 0.06, 0]} r={0.01}>{mat}</RBox>
    <mesh position={[0, 0.03, 0.27]} rotation={[0.45, 0, 0]}><boxGeometry args={[0.9, 0.09, 0.02]} />{mat}</mesh>
    <RBox s={[0.3, 0.35, 0.25]} p={[0, 0.29, -0.08]} r={0.01}>{mat}</RBox>
    {/* botones al frente */}
    {[-0.05, 0, 0.05].map((x, i) => <mesh key={i} position={[0.3 + x, 0.04, 0.29]} rotation={[0.45 + PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.008, 20]} />{M.plastic({ col: grime > 0.5 ? "#4a3a24" : "#2b2b2b" })}</mesh>)}
    {/* la luz */}
    <mesh position={[-0.3, -0.001, 0.12]} rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.035, 30]} /><meshBasicMaterial color={light > 0 ? "#ffe9b0" : "#bdb39a"} toneMapped={false} /></mesh>
    {light > 0 && <pointLight position={[-0.3, -0.08, 0.12]} intensity={1.5 * light} distance={1.2} color="#ffd9a0" />}
  </group>;
};

// OLLA grande de aluminio; water = color del agua; level 0..1
export const Pot: React.FC<{ r?: number; h?: number; water?: string; level?: number; wop?: number }> = ({ r = 0.16, h = 0.2, water = "#9fc6dc", level = 0.75, wop = 0.75 }) => <group>
  <mesh position={[0, h / 2, 0]} castShadow><cylinderGeometry args={[r, r * 0.97, h, 48, 1, true]} /><meshStandardMaterial color="#c9ccd0" metalness={0.85} roughness={0.32} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[r * 0.97, r * 0.97, 0.006, 48]} />{M.steel()}</mesh>
  <mesh position={[0, h, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[r, 0.005, 10, 60]} />{M.steel()}</mesh>
  {[-1, 1].map((s) => <mesh key={s} position={[s * (r + 0.02), h * 0.82, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.022, 0.006, 10, 20, PI]} />{M.steel()}</mesh>)}
  {level > 0 && <mesh position={[0, h * level, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[r * 0.96, 48]} /><meshPhysicalMaterial color={water} roughness={0.08} transparent opacity={wop} clearcoat={1} /></mesh>}
</group>;

// burbujas de hervor (dentro de un círculo de radio r a la altura y)
export const Boil: React.FC<{ tt: number; k: number; r?: number; y?: number; n?: number; col?: string }> = ({ tt, k, r = 0.14, y = 0.15, n = 26, col = "#eaf6ff" }) => <>
  {k > 0.02 && Array.from({ length: n }, (_, i) => { const ph = (tt * (1.2 + rn(i, 2)) + rn(i, 3)) % 1, a = rn(i, 4) * PI * 2, rr = Math.sqrt(rn(i, 5)) * r;
    return <mesh key={i} position={[Math.cos(a) * rr, y + 0.004, Math.sin(a) * rr]} scale={k * (0.3 + ph)}><sphereGeometry args={[0.008, 10, 8]} /><meshPhysicalMaterial color={col} roughness={0.05} transparent opacity={0.8 * (1 - ph)} clearcoat={1} /></mesh>; })}
</>;

// vapor suave que sube: sprites con gradiente radial (nunca esferas grises)
const puffTex = () => tex.text("puff", 128, 128, (g) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, "rgba(255,255,255,0.9)"); r.addColorStop(0.5, "rgba(255,255,255,0.35)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });
export const Vapor: React.FC<{ tt: number; k: number; p?: number[]; spread?: number; n?: number; h?: number }> = ({ tt, k, p = [0, 0, 0], spread = 0.1, n = 14, h = 0.3 }) => <group position={p as [number, number, number]}>
  {k > 0.02 && Array.from({ length: n }, (_, i) => { const ph = (tt * 0.35 + rn(i, 2)) % 1, sc = (0.6 + 1.6 * ph) * 0.07; return <sprite key={i} position={[(rn(i, 3) - 0.5) * spread * (1 + ph), ph * h, (rn(i, 4) - 0.5) * spread]} scale={[sc, sc, sc]}><spriteMaterial map={puffTex()} transparent opacity={0.22 * k * Math.sin(ph * PI)} depthWrite={false} /></sprite>; })}
</group>;

// caja de bicarbonato (amarilla/naranja), detergente verde, aceite amarillo, pava cobre
const sodaTex = () => tex.text("soda", 256, 320, (g) => { g.fillStyle = "#f2b51c"; g.fillRect(0, 0, 256, 320); g.fillStyle = "#c2271e"; g.fillRect(0, 0, 256, 70); g.fillStyle = "#fff"; g.font = "bold 40px Georgia"; g.fillText("BAKING", 50, 140); g.fillText("SODA", 72, 190); g.fillStyle = "#c2271e"; g.beginPath(); g.arc(128, 255, 38, 0, PI * 2); g.fill(); });
export const SodaBox: React.FC = () => <group>
  <mesh position={[0, 0.07, 0]} castShadow><boxGeometry args={[0.1, 0.14, 0.06]} /><meshStandardMaterial attach="material-4" map={sodaTex()} roughness={0.7} /><meshStandardMaterial attach="material-0" color="#f2b51c" /><meshStandardMaterial attach="material-1" color="#f2b51c" /><meshStandardMaterial attach="material-2" color="#c2271e" /><meshStandardMaterial attach="material-3" color="#f2b51c" /><meshStandardMaterial attach="material-5" color="#f2b51c" /></mesh>
</group>;
export const Bottle: React.FC<{ col?: string; h?: number; r?: number; glass?: boolean; cap?: string }> = ({ col = "#3fae4a", h = 0.2, r = 0.032, glass = false, cap = "#f2f2f2" }) => <group>
  <mesh position={[0, h * 0.4, 0]} castShadow><cylinderGeometry args={[r, r, h * 0.8, 30]} />{glass ? <meshPhysicalMaterial color={col} roughness={0.05} transmission={0.6} thickness={0.02} clearcoat={1} /> : M.plastic({ col })}</mesh>
  <mesh position={[0, h * 0.86, 0]}><cylinderGeometry args={[r * 0.4, r, h * 0.14, 24]} />{glass ? <meshPhysicalMaterial color={col} roughness={0.05} transmission={0.6} /> : M.plastic({ col })}</mesh>
  <mesh position={[0, h * 0.97, 0]}><cylinderGeometry args={[r * 0.42, r * 0.42, h * 0.08, 20]} />{M.plastic({ col: cap })}</mesh>
</group>;
export const Kettle: React.FC = () => <group>
  <mesh position={[0, 0.07, 0]} scale={[1, 0.8, 1]} castShadow><sphereGeometry args={[0.09, 40, 28]} /><meshStandardMaterial color="#c47a45" metalness={0.9} roughness={0.25} /></mesh>
  <mesh position={[0.11, 0.09, 0]} rotation={[0, 0, -0.9]}><cylinderGeometry args={[0.008, 0.016, 0.1, 16]} /><meshStandardMaterial color="#c47a45" metalness={0.9} roughness={0.25} /></mesh>
  <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.055, 0.008, 10, 30, PI]} /><meshStandardMaterial color="#2b1a10" roughness={0.6} /></mesh>
</group>;
export const Spoon: React.FC<{ load?: number }> = ({ load = 0 }) => <group>
  <mesh position={[0.07, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.005, 0.12, 10]} />{M.chrome()}</mesh>
  <mesh scale={[1.3, 0.35, 1]}><sphereGeometry args={[0.018, 20, 12, 0, PI * 2, PI / 2, PI / 2]} />{M.chrome({ })}</mesh>
  {load > 0 && <mesh position={[0, 0.002, 0]} scale={[1.2 * load, 0.5 * load, load]}><sphereGeometry args={[0.017, 16, 10, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#fbfbf6" roughness={1} /></mesh>}
</group>;
export const SoftBrush: React.FC<{ col?: string }> = ({ col = "#e7c34a" }) => <group>
  <RBox s={[0.1, 0.022, 0.04]} r={0.008}>{M.plastic({ col })}</RBox>
  <mesh position={[0.09, 0.012, 0]} rotation={[0, 0, -0.25]}><cylinderGeometry args={[0.008, 0.01, 0.1, 12]} />{M.plastic({ col })}</mesh>
  {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[-0.042 + (i % 10) * 0.0094, -0.02, -0.014 + Math.floor(i / 10) * 0.014]}><cylinderGeometry args={[0.0028, 0.0022, 0.02, 6]} /><meshStandardMaterial color="#f4f1e4" roughness={0.8} /></mesh>)}
</group>;
export const Cloth: React.FC<{ col?: string; w?: number; d?: number; dirt?: number }> = ({ col = "#e9e4d6", w = 0.12, d = 0.09, dirt = 0 }) => <group>
  <RBox s={[w, 0.014, d]} r={0.006}><meshStandardMaterial color={col} roughness={1} /></RBox>
  {dirt > 0 && <mesh position={[0, 0.0075, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.035 * dirt, 24]} /><meshStandardMaterial color="#7a5226" roughness={0.9} transparent opacity={0.85} /></mesh>}
</group>;
export const Blob: React.FC<{ s?: number; col?: string }> = ({ s = 0.01, col = "#d9a943" }) => <mesh scale={[1, 0.7, 1]}><sphereGeometry args={[s, 14, 10]} /><meshPhysicalMaterial color={col} roughness={0.2} clearcoat={1} transparent opacity={0.92} /></mesh>;
// hornalla a gas: base enlozada + corona azul
export const Burner: React.FC<{ on?: number }> = ({ on = 0 }) => <group>
  <RBox s={[0.6, 0.04, 0.5]} p={[0, -0.02, 0]} r={0.012}>{M.porcelain({ col: "#f3efe6" })}</RBox>
  <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.07, 0.08, 0.012, 32]} /><meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} /></mesh>
  {on > 0 && Array.from({ length: 20 }, (_, i) => { const a = (i / 20) * PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.075, 0.018, Math.sin(a) * 0.075]}><coneGeometry args={[0.006, 0.022 * on, 8]} />{M.glow({ col: "#5aa0ff", op: 0.8 })}</mesh>; })}
</group>;
