// lch29d · kit del sofá: tela floreada de 1974, almohadón, apoyabrazos enrollado, toalla blanca con marcas, plancha de vapor vieja, manchas (decal), mano de arcilla, taza, ventilador, cepillo, etiqueta, carpetita.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, lerp, rn, tex } from "./h3d";

const PI = Math.PI;

// tela floreada: crema con rosas de repollo rosadas y hojas verdes (se repite)
export const floralTex = (rep = 2) => {
  const t = tex.text("floral", 512, 512, (g) => {
    g.fillStyle = "#efe4cf"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(160,140,110,${0.05 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 512, 2, 1); }
    for (let i = 0; i < 14; i++) {
      const x = rn(i, 5) * 512, y = rn(i, 6) * 512, r = 26 + 18 * rn(i, 7);
      g.fillStyle = "#6f8f5a"; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(x + Math.cos(k * 2.1 + i) * r, y + Math.sin(k * 2.1 + i) * r, r * 0.55, r * 0.22, k * 2.1 + i, 0, PI * 2); g.fill(); }
      for (let k = 0; k < 5; k++) { g.fillStyle = ["#c9576a", "#d9788a", "#e8a0ad", "#b8455a", "#f0bfc6"][k]; g.beginPath(); g.arc(x + (rn(i * 9 + k, 8) - 0.5) * r * 0.3, y + (rn(i * 9 + k, 9) - 0.5) * r * 0.3, r * (1 - k * 0.17), 0, PI * 2); g.fill(); }
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); return t;
};
export const Fabric: React.FC<{ rep?: number; col?: string }> = ({ rep = 2, col = "#ffffff" }) => <meshStandardMaterial map={floralTex(rep)} color={col} roughness={0.92} />;

// almohadón del asiento
export const Cushion: React.FC<{ w?: number; d?: number; h?: number; p?: number[]; rot?: number[] }> = ({ w = 0.5, d = 0.5, h = 0.12, p = [0, 0, 0], rot = [0, 0, 0] }) => <RBox s={[w, h, d]} r={Math.min(0.04, h / 2.2)} p={p} rot={rot}><Fabric /></RBox>;

// apoyabrazos enrollado: cilindro acostado + panel
export const Arm: React.FC<{ len?: number; r?: number }> = ({ len = 0.7, r = 0.09 }) => <group>
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[r, r, len, 40]} /><Fabric rep={1} /></mesh>
  <RBox s={[r * 1.6, 0.36, len]} p={[0, -0.2, 0]} r={0.03}><Fabric rep={1} /></RBox>
</group>;

// el sofá entero (3 almohadones), mirando a +z
export const Sofa: React.FC<{ seat?: (i: number) => React.ReactNode }> = ({ seat }) => <group>
  <RBox s={[1.9, 0.26, 0.8]} p={[0, 0.2, 0]} r={0.04}><Fabric rep={3} /></RBox>
  <RBox s={[1.9, 0.5, 0.2]} p={[0, 0.55, -0.32]} r={0.06}><Fabric rep={3} /></RBox>
  {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.98, 0.52, 0.0]}><Arm len={0.78} /></group>)}
  {[-0.58, 0, 0.58].map((x, i) => <group key={i}>{seat ? seat(i) : <Cushion w={0.56} d={0.62} h={0.14} p={[x, 0.4, 0.05]} />}</group>)}
  {[-0.85, 0.85].map((x) => [-0.32, 0.32].map((z) => <mesh key={`${x}${z}`} position={[x, 0.04, z]}><cylinderGeometry args={[0.025, 0.02, 0.08, 12]} />{M.wood({ base: [90, 55, 30] })}</mesh>))}
</group>;

// MANCHA (decal): disco con borde suave; ring = borde más oscuro (aro de agua / café)
const spotTex = (ring: boolean) => tex.text("spot" + (ring ? "r" : "s"), 128, 128, (g) => {
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 62);
  if (ring) { r.addColorStop(0, "rgba(255,255,255,0.35)"); r.addColorStop(0.78, "rgba(255,255,255,0.5)"); r.addColorStop(0.9, "rgba(255,255,255,1)"); r.addColorStop(1, "rgba(255,255,255,0)"); }
  else { r.addColorStop(0, "rgba(255,255,255,0.95)"); r.addColorStop(0.7, "rgba(255,255,255,0.75)"); r.addColorStop(1, "rgba(255,255,255,0)"); }
  g.fillStyle = r; g.beginPath(); for (let a = 0; a <= 64; a++) { const t = (a / 64) * PI * 2, rr = 62 * (0.86 + 0.14 * Math.sin(t * 5 + 1) * Math.cos(t * 3)); g.lineTo(64 + Math.cos(t) * rr, 64 + Math.sin(t) * rr); } g.fill();
});
export const Spot: React.FC<{ r: number; col?: string; op?: number; ring?: boolean; p?: number[]; rot?: number[] }> = ({ r, col = "#5a3a1c", op = 1, ring = false, p = [0, 0, 0], rot = [-PI / 2, 0, 0] }) =>
  op > 0.01 ? <mesh position={p as [number, number, number]} rotation={rot as [number, number, number]}><planeGeometry args={[r * 2, r * 2]} /><meshStandardMaterial map={spotTex(ring)} color={col} transparent opacity={op} depthWrite={false} roughness={0.9} polygonOffset polygonOffsetFactor={-2} /></mesh> : null;

// TOALLA blanca doblada: marcas = lista de manchas transferidas (x,z en la toalla, radio, intensidad)
export const Towel: React.FC<{ w?: number; d?: number; marks?: { x: number; z: number; r: number; k: number; col?: string }[]; damp?: number }> = ({ w = 0.34, d = 0.24, marks = [], damp = 0 }) => <group>
  <RBox s={[w, 0.014, d]} r={0.006}><meshStandardMaterial color={damp > 0.5 ? "#eef0f0" : "#fbfaf6"} roughness={1} /></RBox>
  {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-w / 2 + (i + 0.5) * (w / 9), 0.0075, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.003, d * 0.96]} /><meshBasicMaterial color="#e2ded3" /></mesh>)}
  {marks.map((m, i) => <Spot key={i} r={m.r} col={m.col ?? "#7a5a3a"} op={m.k} p={[m.x, 0.0078, m.z]} />)}
</group>;

// PLANCHA de vapor vieja (blanca y celeste), punta hacia +x
export const SteamIron: React.FC = () => <group>
  <mesh position={[0, 0.012, 0]} rotation={[-PI / 2, 0, 0]} scale={[1, 0.62, 1]}><circleGeometry args={[0.1, 3]} />{M.chrome()}</mesh>
  <mesh position={[-0.01, 0.035, 0]} scale={[1.25, 0.42, 0.78]}><sphereGeometry args={[0.075, 30, 18]} />{M.pvc({ col: "#f4f2ec" })}</mesh>
  <mesh position={[0.0, 0.06, 0]} scale={[1.1, 0.25, 0.6]}><sphereGeometry args={[0.06, 24, 14]} />{M.plastic({ col: "#8fc3d9" })}</mesh>
  <mesh position={[-0.02, 0.105, 0]} rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.014, 0.08, 8, 14]} />{M.pvc({ col: "#f4f2ec" })}</mesh>
  {[-0.07, 0.03].map((x, i) => <mesh key={i} position={[x, 0.075, 0]}><cylinderGeometry args={[0.012, 0.016, 0.05, 12]} />{M.pvc({ col: "#f4f2ec" })}</mesh>)}
  <mesh position={[-0.075, 0.05, 0.03]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.008, 18]} />{M.plastic({ col: "#d23a2a" })}</mesh>
</group>;

// vapor: sprites con gradiente (nunca esferas grises)
const puffTex = () => tex.text("puff", 128, 128, (g) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, "rgba(255,255,255,0.9)"); r.addColorStop(0.5, "rgba(255,255,255,0.35)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });
export const Steam: React.FC<{ tt: number; k: number; p?: number[]; spread?: number; n?: number; h?: number; down?: boolean }> = ({ tt, k, p = [0, 0, 0], spread = 0.12, n = 14, h = 0.2, down = false }) => <group position={p as [number, number, number]}>
  {k > 0.02 && Array.from({ length: n }, (_, i) => { const ph = (tt * 0.45 + rn(i, 2)) % 1, sc = (0.6 + 1.4 * ph) * 0.06; return <sprite key={i} position={[(rn(i, 3) - 0.5) * spread * (1 + ph), (down ? -1 : 1) * ph * h, (rn(i, 4) - 0.5) * spread]} scale={[sc, sc, sc]}><spriteMaterial map={puffTex()} transparent opacity={0.3 * k * Math.sin(ph * PI)} depthWrite={false} /></sprite>; })}
</group>;

// MANO de arcilla (palma hacia abajo por defecto, dedos hacia +z); grip 0..1 cierra
export const Hand: React.FC<{ grip?: number; col?: string; sleeve?: string }> = ({ grip = 0, col = "#d9a888", sleeve = "#c9b6d8" }) => <group>
  <RBox s={[0.085, 0.026, 0.09]} r={0.012}><meshStandardMaterial color={col} roughness={0.65} /></RBox>
  {[-0.03, -0.01, 0.01, 0.03].map((x, i) => <group key={i} position={[x, 0, 0.045]} rotation={[1.2 * grip, 0, 0]}><mesh position={[0, 0, 0.032 - 0.004 * Math.abs(i - 1.5)]} rotation={[PI / 2, 0, 0]}><capsuleGeometry args={[0.0095, 0.045 - 0.006 * Math.abs(i - 1.5), 8, 14]} /><meshStandardMaterial color={col} roughness={0.65} /></mesh></group>)}
  <group position={[0.05, 0, 0.0]} rotation={[0, -0.6, 0.9 * grip]}><mesh position={[0.02, 0, 0.01]} rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.011, 0.035, 8, 14]} /><meshStandardMaterial color={col} roughness={0.65} /></mesh></group>
  <mesh position={[0, 0, -0.07]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.032, 0.07, 18]} /><meshStandardMaterial color={col} roughness={0.65} /></mesh>
  <mesh position={[0, 0, -0.13]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.06, 18]} /><meshStandardMaterial color={sleeve} roughness={0.8} /></mesh>
</group>;

// TAZA marrón de cerámica (la de Harold)
export const Mug: React.FC<{ fill?: number; col?: string }> = ({ fill = 0.8, col = "#6b3f22" }) => <group>
  <mesh position={[0, 0.055, 0]}><cylinderGeometry args={[0.045, 0.04, 0.11, 32, 1, true]} /><meshPhysicalMaterial color={col} roughness={0.3} clearcoat={0.8} side={2} /></mesh>
  <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.04, 0.04, 0.004, 32]} /><meshPhysicalMaterial color={col} roughness={0.3} clearcoat={0.8} /></mesh>
  {fill > 0 && <mesh position={[0, 0.11 * fill - 0.004, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.042, 32]} /><meshPhysicalMaterial color="#2b1608" roughness={0.05} clearcoat={1} /></mesh>}
  <mesh position={[0.052, 0.06, 0]}><torusGeometry args={[0.026, 0.008, 10, 24, PI]} /><meshPhysicalMaterial color={col} roughness={0.3} clearcoat={0.8} /></mesh>
</group>;

// VENTILADOR de mesa: aspas que giran (velocidad suave, sin parpadeo), rejilla
export const Fan: React.FC<{ tt: number; on?: number }> = ({ tt, on = 1 }) => <group>
  <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.07, 0.08, 0.02, 24]} />{M.pvc({ col: "#f2efe6" })}</mesh>
  <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.012, 0.012, 0.16, 12]} />{M.pvc({ col: "#f2efe6" })}</mesh>
  <group position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
    <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.11, 0.004, 8, 48]} />{M.chrome()}</mesh>
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} rotation={[0, 0, (i / 8) * PI]}><boxGeometry args={[0.22, 0.002, 0.002]} />{M.chrome()}</mesh>)}
    <group position={[0, 0, -0.01]} rotation={[0, 0, tt * 2.2 * on]}>{[0, 1, 2].map((i) => <mesh key={i} rotation={[0, 0.35, (i / 3) * PI * 2]} position={[0, 0, 0]}><group position={[0.05, 0, 0]}><mesh scale={[1, 0.45, 0.06]}><sphereGeometry args={[0.05, 16, 10]} />{M.plastic({ col: "#9cc8da", op: 0.9 })}</mesh></group></mesh>)}</group>
    <mesh position={[0, 0, -0.03]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.035, 0.05, 18]} />{M.pvc({ col: "#f2efe6" })}</mesh>
  </group>
</group>;

// CEPILLO de ropa de madera
export const ClothesBrush: React.FC = () => <group>
  <RBox s={[0.16, 0.025, 0.055]} p={[0, 0.03, 0]} r={0.01}>{M.wood({ base: [150, 98, 52] })}</RBox>
  {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[-0.07 + (i % 10) * 0.0155, 0.009, -0.018 + Math.floor(i / 10) * 0.018]}><cylinderGeometry args={[0.004, 0.004, 0.022, 6]} /><meshStandardMaterial color="#2b2118" roughness={0.9} /></mesh>)}
</group>;

// ETIQUETA de tapicería con letra grande
export const tagTex = (letter: string) => tex.text("tag" + letter, 200, 260, (g) => {
  g.fillStyle = "#fbfaf4"; g.fillRect(0, 0, 200, 260); g.fillStyle = "#2a2a2a"; g.font = "bold 22px Georgia"; g.fillText("DO NOT REMOVE", 14, 34);
  g.font = "bold 120px Georgia"; const w = g.measureText(letter).width; g.fillText(letter, 100 - w / 2, 170); g.fillStyle = "#777"; for (let i = 0; i < 3; i++) g.fillRect(24, 200 + i * 14, 152 - i * 30, 5);
});

// CARPETITA de crochet (calada)
export const doilyTex = () => tex.text("doily", 256, 256, (g) => {
  g.clearRect(0, 0, 256, 256); g.strokeStyle = "#ffffff"; g.lineWidth = 3;
  for (let r = 20; r < 124; r += 14) { g.beginPath(); g.arc(128, 128, r, 0, PI * 2); g.stroke(); }
  for (let a = 0; a < 48; a++) { const t = (a / 48) * PI * 2; g.beginPath(); g.moveTo(128 + Math.cos(t) * 20, 128 + Math.sin(t) * 20); g.lineTo(128 + Math.cos(t) * 122, 128 + Math.sin(t) * 122); g.stroke(); }
  for (let a = 0; a < 24; a++) { const t = (a / 24) * PI * 2; g.beginPath(); g.arc(128 + Math.cos(t) * 116, 128 + Math.sin(t) * 116, 9, 0, PI * 2); g.stroke(); }
});
export const Doily: React.FC<{ r?: number; op?: number; col?: THREE.Color | string }> = ({ r = 0.12, op = 1, col = "#ffffff" }) => <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[r, 48]} /><meshStandardMaterial map={doilyTex()} color={col} transparent alphaTest={0.3} opacity={op} roughness={0.9} side={2} /></mesh>;

void lerp; void cl;
