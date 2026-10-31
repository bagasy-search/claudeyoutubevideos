// apa30 · KIT de objetos del canal en 3D para los componentes únicos (topo, ratón, rata, gallina, huevo, lombriz, gusano blanco,
// corte de suelo con estratos, lata, tabla, banderita, bota, balde, bidón, regadera, malla, tablón de granero). Low-poly con
// material gastado; todo determinista. Los animales son maquetas de arcilla (nunca primer plano "real": eso es metraje real).
import React from "react";
import * as THREE from "three";
import { M, RBox, tex, rn, tubeG, cl, lerp } from "./h3d";

const PI = Math.PI;
type V = [number, number, number];
const strataT = () => tex.text("strata", 256, 512, (g) => {
  const bands = ["#4a6b2a", "#3a2a1c", "#4a3424", "#5a4330", "#6b5238", "#7a6346"], hs = [18, 90, 110, 120, 100, 74]; let y = 0;
  bands.forEach((c, i) => { g.fillStyle = c; g.fillRect(0, y, 256, hs[i]); y += hs[i]; });
  for (let i = 0; i < 2400; i++) { const v = rn(i, 1); g.fillStyle = `rgba(${30 + v * 80},${20 + v * 60},${10 + v * 40},.45)`; g.fillRect(rn(i, 2) * 256, 18 + rn(i, 3) * 494, 1 + v * 3, 1 + v * 2); }
  for (let i = 0; i < 22; i++) { g.fillStyle = `rgba(150,130,110,${0.5 + 0.4 * rn(i, 4)})`; g.beginPath(); g.ellipse(rn(i, 5) * 256, 140 + rn(i, 6) * 360, 3 + rn(i, 7) * 7, 2 + rn(i, 8) * 5, rn(i, 9) * 3, 0, 6.3); g.fill(); }
  for (let i = 0; i < 26; i++) { g.strokeStyle = "rgba(205,170,120,.45)"; g.lineWidth = 1.2; g.beginPath(); const x = rn(i, 10) * 256, yy = 20 + rn(i, 11) * 160; g.moveTo(x, yy); g.bezierCurveTo(x + 6, yy + 20, x - 8, yy + 40, x + 4, yy + 60 + rn(i, 12) * 40); g.stroke(); }
});
export const soilT = () => tex.text("soilk", 256, 256, (g) => {
  g.fillStyle = "#3a2a1c"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) { const v = 40 + rn(i, 1) * 50; g.fillStyle = `rgba(${v + 20},${v},${v - 15},.6)`; g.fillRect(rn(i, 2) * 256, rn(i, 3) * 256, 1 + rn(i, 4) * 3, 1 + rn(i, 5) * 3); }
});
export const grassT = () => tex.text("grassk", 256, 256, (g) => {
  g.fillStyle = "#4f6b2e"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) { const v = rn(i, 1); g.strokeStyle = `rgba(${70 + v * 60},${100 + v * 70},${30 + v * 25},.6)`; const x = rn(i, 2) * 256, y = rn(i, 3) * 256; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rn(i, 4) - 0.5) * 3, y - 3 - rn(i, 5) * 5); g.stroke(); }
});
export const meshT = (cell = 16) => tex.text("mesh" + cell, 256, 256, (g) => {
  g.clearRect(0, 0, 256, 256); g.strokeStyle = "#d4d7da"; g.lineWidth = 3;
  for (let k = 0; k <= 256; k += cell) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 256); g.stroke(); g.beginPath(); g.moveTo(0, k); g.lineTo(256, k); g.stroke(); }
});
export const barnT = () => tex.text("barnk", 512, 256, (g) => {
  for (let c = 0; c < 10; c++) { const v = rn(c, 4); g.fillStyle = `rgb(${110 + v * 30},${96 + v * 26},${78 + v * 20})`; g.fillRect(c * 52, 0, 52, 256); g.fillStyle = "rgba(20,14,8,.7)"; g.fillRect(c * 52, 0, 3, 256); }
  for (let i = 0; i < 900; i++) { g.strokeStyle = `rgba(40,28,16,${0.1 + 0.15 * rn(i, 1)})`; const x = rn(i, 2) * 512, y = rn(i, 3) * 256; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 10 + rn(i, 7) * 20); g.stroke(); }
});

// ---------- bloque de suelo en corte (cara frontal con estratos, arriba pasto) ----------
export const SoilBlock: React.FC<{ w?: number; h?: number; d?: number; p?: V; grass?: boolean }> = ({ w = 1, h = 0.5, d = 0.5, p = [0, 0, 0], grass = true }) => <group position={p}>
  <RBox s={[w, h, d]} p={[0, -h / 2, 0]} r={0.008}><meshStandardMaterial map={soilT()} roughness={1} /></RBox>
  <mesh position={[0, -h / 2, d / 2 + 0.0015]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={strataT()} roughness={1} /></mesh>
  {grass && <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[w, d]} /><meshStandardMaterial map={grassT()} roughness={0.95} /></mesh>}
</group>;
// túnel visto en el corte: fila de discos oscuros a lo largo de una curva sobre la cara frontal (z = cara)
export const TunnelCut: React.FC<{ pts: number[][]; z: number; r?: number; k?: number; col?: string }> = ({ pts, z, r = 0.03, k = 1, col = "#120c07" }) => {
  const c = new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(q[0], q[1], z)));
  const N = 40, n = Math.round(N * cl(k));
  return <>{Array.from({ length: n }, (_, i) => { const q = c.getPointAt(i / (N - 1)); return <mesh key={i} position={[q.x, q.y, z]}><circleGeometry args={[r, 16]} /><meshStandardMaterial color={col} roughness={1} /></mesh>; })}</>;
};
// lomo de topo sobre el pasto
export const Ridge: React.FC<{ id: string; pts: number[][]; r?: number; up?: number; col?: string }> = ({ id, pts, r = 0.03, up = 1, col = "#b08a5c" }) =>
  <mesh geometry={tubeG("ridge" + id, pts, r, 60, 8)} scale={[1, Math.max(0.02, 0.55 * up), 1]} castShadow receiveShadow><meshStandardMaterial color={col} map={soilT()} roughness={0.95} /></mesh>;
export const Mound: React.FC<{ p: V; s?: number; half?: boolean }> = ({ p, s = 1, half }) => <group position={p} scale={[s, s * 0.55, s]}>
  <mesh castShadow receiveShadow><sphereGeometry args={[0.1, 16, 10, half ? 0 : 0, half ? PI : PI * 2, 0, PI / 2]} /><meshStandardMaterial map={soilT()} color="#c4a078" roughness={1} side={THREE.DoubleSide} /></mesh>
  <mesh position={[half ? 0 : 0, 0.098, half ? -0.06 : 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.018, 14]} /><meshStandardMaterial color="#2a1c10" roughness={1} /></mesh>
</group>;

// ---------- animales (maquetas de arcilla) ----------
// TOPO: cuerpo de terciopelo gris, hocico rosado, manos-pala rosadas hacia afuera, cola corta. paddle = brazada (0..1)
export const Mole: React.FC<{ p?: V; rot?: V; s?: number; paddle?: number; nose?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, paddle = 0, nose = 0 }) => {
  const sw = Math.sin(paddle * PI * 2);
  return <group position={p} rotation={rot} scale={s}>
    <mesh scale={[0.06, 0.045, 0.1]} position={[0, 0.045, 0]} castShadow><sphereGeometry args={[1, 28, 20]} /><meshStandardMaterial color="#4a4744" roughness={0.95} /></mesh>
    <mesh position={[0, 0.042, 0.1 + 0.004 * Math.sin(nose * 20)]} rotation={[PI / 2, 0, 0]} castShadow><coneGeometry args={[0.018, 0.05, 16]} /><meshStandardMaterial color="#d99a8f" roughness={0.6} /></mesh>
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.055, 0.025, 0.055]} rotation={[0.2 + 0.35 * sw * sd, sd * 0.9, sd * (0.4 + 0.25 * sw)]}>
      <mesh scale={[0.032, 0.008, 0.026]} castShadow><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#e3a99c" roughness={0.6} /></mesh>
      {[-2, -1, 0, 1, 2].map((c) => <mesh key={c} position={[c * 0.011, 0, 0.026]} rotation={[PI / 2, 0, 0]}><coneGeometry args={[0.003, 0.014, 6]} /><meshStandardMaterial color="#f1e4d0" roughness={0.4} /></mesh>)}
    </group>)}
    <mesh position={[0, 0.05, -0.105]} rotation={[-0.6, 0, 0]}><cylinderGeometry args={[0.004, 0.006, 0.03, 8]} /><meshStandardMaterial color="#d99a8f" /></mesh>
  </group>;
};
// RATÓN / RATA (misma maqueta, la rata más grande y oscura; cola larga)
export const Rodent: React.FC<{ p?: V; rot?: V; s?: number; rat?: boolean; deer?: boolean; walk?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, rat, deer, walk = 0 }) => {
  const body = rat ? "#5b4f45" : deer ? "#8a5f3a" : "#8a8580", belly = deer ? "#f4efe6" : rat ? "#7d7266" : "#a9a49d", b = 0.004 * Math.sin(walk * PI * 4);
  return <group position={p} rotation={rot} scale={s}>
    <mesh scale={[0.035, 0.03, 0.06]} position={[0, 0.035 + b, 0]} castShadow><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color={body} roughness={0.9} /></mesh>
    <mesh scale={[0.03, 0.018, 0.05]} position={[0, 0.022 + b, 0.004]}><sphereGeometry args={[1, 20, 12]} /><meshStandardMaterial color={belly} roughness={0.9} /></mesh>
    <mesh position={[0, 0.042 + b, 0.06]} rotation={[PI / 2.3, 0, 0]} castShadow><coneGeometry args={[0.02, 0.045, 18]} /><meshStandardMaterial color={body} roughness={0.9} /></mesh>
    <mesh position={[0, 0.034 + b, 0.084]}><sphereGeometry args={[0.005, 10, 8]} /><meshStandardMaterial color="#d48a8a" /></mesh>
    {[-1, 1].map((sd) => <group key={sd}>
      <mesh position={[sd * 0.014, 0.068 + b, 0.04]} rotation={[0.2, 0, sd * 0.3]}><circleGeometry args={[rat ? 0.011 : 0.014, 16]} /><meshStandardMaterial color="#d9a8a0" side={THREE.DoubleSide} roughness={0.7} /></mesh>
      <mesh position={[sd * 0.012, 0.05 + b, 0.066]}><sphereGeometry args={[0.0042, 10, 8]} />{M.porcelain({ col: "#0b0b0b" })}</mesh>
    </group>)}
    <mesh geometry={tubeG(rat ? "tailR" : "tailM", [[0, 0.03, -0.055], [0, 0.02, -0.09], [0.02, 0.008, -0.13], [0.045, 0.004, -0.17]], rat ? 0.0045 : 0.0025, 30, 6)}><meshStandardMaterial color="#c99a8f" roughness={0.6} /></mesh>
  </group>;
};
// GALLINA (maqueta): cuerpo rojizo, cresta, pico
export const Hen: React.FC<{ p?: V; rot?: V; s?: number; peck?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, peck = 0 }) => <group position={p} rotation={rot} scale={s}>
  <mesh scale={[0.09, 0.08, 0.12]} position={[0, 0.13, 0]} castShadow><sphereGeometry args={[1, 24, 18]} /><meshStandardMaterial color="#9a4a22" roughness={0.9} /></mesh>
  <mesh scale={[0.05, 0.08, 0.04]} position={[0, 0.17, -0.12]} rotation={[-0.6, 0, 0]} castShadow><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#6a2c12" roughness={0.9} /></mesh>
  <group position={[0, 0.22 - 0.06 * peck, 0.1 + 0.03 * peck]} rotation={[0.5 * peck, 0, 0]}>
    <mesh castShadow><sphereGeometry args={[0.045, 18, 14]} /><meshStandardMaterial color="#a8562a" roughness={0.9} /></mesh>
    <mesh position={[0, 0.04, 0.005]} scale={[0.3, 1, 1]}><sphereGeometry args={[0.022, 12, 10]} /><meshStandardMaterial color="#d32a1e" roughness={0.6} /></mesh>
    <mesh position={[0, -0.005, 0.05]} rotation={[PI / 2, 0, 0]}><coneGeometry args={[0.01, 0.025, 8]} /><meshStandardMaterial color="#e8b23a" /></mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.03, 0.008, 0.03]}><sphereGeometry args={[0.005, 8, 8]} />{M.porcelain({ col: "#111" })}</mesh>)}
  </group>
  {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.03, 0.03, 0]}><cylinderGeometry args={[0.005, 0.005, 0.07, 8]} /><meshStandardMaterial color="#e8b23a" /></mesh>)}
</group>;
export const Egg: React.FC<{ p?: V; s?: number; brown?: boolean; crack?: boolean }> = ({ p = [0, 0, 0], s = 1, brown = true, crack }) => <group position={p} scale={s}>
  <mesh scale={[0.022, 0.03, 0.022]} position={[0, 0.03, 0]} castShadow><sphereGeometry args={[1, 24, 18]} /><meshPhysicalMaterial color={brown ? "#c88a5a" : "#f4efe6"} roughness={0.45} clearcoat={0.2} /></mesh>
  {crack && <mesh position={[0, 0.045, 0.016]} rotation={[0.5, 0, 0]}><torusGeometry args={[0.012, 0.0015, 6, 20, PI * 1.2]} /><meshStandardMaterial color="#3a2414" /></mesh>}
</group>;
// LOMBRIZ y GUSANO BLANCO
export const Worm: React.FC<{ id: string; p?: V; len?: number; ph?: number; s?: number }> = ({ id, p = [0, 0, 0], len = 0.12, ph = 0, s = 1 }) => {
  const k = Math.round(ph * 8) / 8, pts = Array.from({ length: 7 }, (_, i) => [i / 6 * len - len / 2, 0.008, Math.sin(i * 1.3 + k * 6) * 0.012]);
  return <mesh position={p} scale={s} geometry={tubeG("worm" + id + k, pts, (u) => 0.0055 * (0.6 + 0.4 * Math.sin(u * PI)), 40, 8)} castShadow><meshPhysicalMaterial color="#c4766a" roughness={0.35} clearcoat={0.6} /></mesh>;
};
export const Grub: React.FC<{ p?: V; s?: number; rot?: V }> = ({ p = [0, 0, 0], s = 1, rot = [0, 0, 0] }) => <group position={p} rotation={rot} scale={s}>
  <mesh geometry={tubeG("grub", [[0.02, 0.01, 0], [0.012, 0.02, 0.012], [-0.006, 0.02, 0.012], [-0.014, 0.012, 0]], (u) => 0.0075 * (0.7 + 0.3 * Math.sin(u * PI)), 30, 10)} castShadow><meshPhysicalMaterial color="#f1ead6" roughness={0.4} clearcoat={0.5} /></mesh>
  <mesh position={[0.022, 0.009, 0]}><sphereGeometry args={[0.006, 12, 10]} /><meshStandardMaterial color="#b46a2a" /></mesh>
</group>;

// ---------- objetos ----------
export const Can: React.FC<{ p?: V; r?: number; h?: number; label?: boolean; open?: boolean; half?: boolean }> = ({ p = [0, 0, 0], r = 0.07, h = 0.17, label = true, open = true, half = false }) => {
  // half = corte: sólo la mitad de atrás de la lata, para ver lo que hay adentro
  const th: [number, number] = half ? [PI / 2, PI] : [0, 2 * PI];
  return <group position={p}>
  <mesh position={[0, h / 2, 0]} castShadow receiveShadow><cylinderGeometry args={[r, r, h, 40, 1, open, th[0], th[1]]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
  <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[r, r, 0.004, 40, 1, false, th[0], th[1]]} />{M.steel()}</mesh>
  {label && <mesh position={[0, h * 0.5, 0]}><cylinderGeometry args={[r + 0.001, r + 0.001, h * 0.55, 40, 1, true, th[0], th[1]]} /><meshStandardMaterial color="#b8352a" roughness={0.5} side={THREE.DoubleSide} /></mesh>}
  {[0.12, 0.88].map((y) => <mesh key={y} position={[0, h * y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[r + 0.001, 0.0025, 6, 40, half ? PI : 2 * PI]} />{M.steel()}</mesh>)}
</group>; };
export const Board: React.FC<{ p?: V; s?: number[]; rot?: V }> = ({ p = [0, 0, 0], s = [0.42, 0.022, 0.42], rot = [0, 0, 0] }) =>
  <RBox s={s} p={p} rot={rot} r={0.004}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>;
export const Flag: React.FC<{ p?: V; tt?: number; i?: number; col?: string; s?: number }> = ({ p = [0, 0, 0], tt = 0, i = 0, col = "#ff6a1a", s = 1 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.0025, 0.0025, 0.24, 6]} />{M.steel()}</mesh>
  <mesh position={[0.032, 0.215, 0]} rotation={[0, 0.35 * Math.sin(tt * 2 + i), 0]}><planeGeometry args={[0.065, 0.045]} /><meshStandardMaterial color={col} side={THREE.DoubleSide} roughness={0.7} /></mesh>
</group>;
export const Boot: React.FC<{ p?: V; rot?: V; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <RBox s={[0.1, 0.035, 0.26]} p={[0, 0.018, 0.02]} r={0.015}><meshStandardMaterial color="#2a1f17" roughness={0.8} /></RBox>
  <RBox s={[0.095, 0.08, 0.2]} p={[0, 0.07, 0.02]} r={0.03}><meshStandardMaterial color="#6b4423" roughness={0.65} /></RBox>
  <RBox s={[0.09, 0.2, 0.11]} p={[0, 0.18, -0.05]} r={0.03}><meshStandardMaterial color="#5a3a1e" roughness={0.65} /></RBox>
</group>;
export const Bucket: React.FC<{ p?: V; s?: number; col?: string; metal?: boolean; fill?: number; fillCol?: string }> = ({ p = [0, 0, 0], s = 1, col = "#f1efe9", metal, fill = 0, fillCol = "#3a2a1c" }) => <group position={p} scale={s}>
  <mesh position={[0, 0.17, 0]} castShadow receiveShadow><cylinderGeometry args={[0.15, 0.125, 0.34, 40, 1, true]} />{metal ? M.steel({ side: THREE.DoubleSide }) : M.pvc({ col, side: THREE.DoubleSide })}</mesh>
  <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.125, 0.125, 0.006, 40]} />{metal ? M.steel() : M.pvc({ col })}</mesh>
  <mesh position={[0, 0.34, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.151, 0.007, 8, 40]} />{metal ? M.steel() : M.pvc({ col })}</mesh>
  {fill > 0 && <mesh position={[0, 0.006 + 0.32 * fill, 0]}><cylinderGeometry args={[0.125 + 0.024 * fill, 0.125 + 0.024 * fill, 0.008, 40]} /><meshStandardMaterial map={fillCol === "soil" ? soilT() : undefined} color={fillCol === "soil" ? "#6b5238" : fillCol} roughness={1} /></mesh>}
</group>;
export const Jug: React.FC<{ p?: V; s?: number; fill?: number; milky?: number }> = ({ p = [0, 0, 0], s = 1, fill = 0, milky = 0 }) => <group position={p} scale={s}>
  <RBox s={[0.16, 0.26, 0.16]} p={[0, 0.13, 0]} r={0.035}>{M.glass({ op: 0.3, col: "#f6f3ea" })}</RBox>
  {fill > 0 && <RBox s={[0.15, 0.25 * fill, 0.15]} p={[0, 0.005 + 0.125 * fill, 0]} r={0.03}><meshPhysicalMaterial color={new THREE.Color("#d8c26a").lerp(new THREE.Color("#f2eee2"), milky)} roughness={0.3} transparent opacity={0.55 + 0.35 * milky} clearcoat={0.6} /></RBox>}
  <mesh position={[0, 0.29, 0]}><cylinderGeometry args={[0.025, 0.03, 0.04, 20]} />{M.plastic({ col: "#1f5fa8" })}</mesh>
  <mesh position={[0.06, 0.22, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.03, 0.008, 8, 20, PI]} />{M.glass({ op: 0.4, col: "#f6f3ea" })}</mesh>
</group>;
export const WateringCan: React.FC<{ p?: V; rot?: V; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.09, 0.1, 0.2, 32]} />{M.steel()}</mesh>
  <mesh geometry={tubeG("spout", [[0.08, 0.05, 0], [0.18, 0.13, 0], [0.26, 0.22, 0]], 0.012, 30, 10)} castShadow>{M.steel()}</mesh>
  <mesh position={[0.27, 0.23, 0]} rotation={[0, 0, -0.8]}><cylinderGeometry args={[0.03, 0.015, 0.03, 20]} />{M.steel()}</mesh>
  <mesh position={[-0.02, 0.2, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.008, 8, 24, PI]} />{M.steel()}</mesh>
</group>;
// panel de malla de 1/2" (o 1/4") como plano con alfa
export const MeshPanel: React.FC<{ w: number; h: number; p?: V; rot?: V; cell?: number; rep?: number }> = ({ w, h, p = [0, 0, 0], rot = [0, 0, 0], cell = 16 }) => {
  const t = meshT(cell).clone(); t.repeat.set(w * 8, h * 8); t.needsUpdate = true;
  return <mesh position={p} rotation={rot} castShadow><planeGeometry args={[w, h]} /><meshStandardMaterial map={t} transparent alphaTest={0.3} metalness={0.8} roughness={0.3} side={THREE.DoubleSide} /></mesh>;
};
// tablón de pared de granero (fondo vertical)
export const BarnWall: React.FC<{ w?: number; h?: number; p?: V }> = ({ w = 3, h = 1.6, p = [0, 0.8, -0.8] }) => <mesh position={p} receiveShadow><planeGeometry args={[w, h]} /><meshStandardMaterial map={barnT()} roughness={0.95} /></mesh>;
// rótulo pintado como textura sobre una tablita (el texto vive DENTRO de la escena)
export const Sign: React.FC<{ id: string; txt: string; sub?: string; p?: V; rot?: V; w?: number; h?: number; col?: string; ink?: string }> = ({ id, txt, sub, p = [0, 0, 0], rot = [0, 0, 0], w = 0.4, h = 0.16, col = "#efe6d2", ink = "#2a1d12" }) => {
  const T = tex.text("sign" + id, 512, Math.round(512 * h / w), (g) => {
    const H = Math.round(512 * h / w); g.fillStyle = col; g.fillRect(0, 0, 512, H);
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(120,90,50,${0.06 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * H, 3, 3); }
    g.fillStyle = ink; g.textAlign = "center"; g.textBaseline = "middle";
    let fs = Math.min(H * (sub ? 0.5 : 0.62), 900 / Math.max(4, txt.length)); g.font = `900 ${fs}px Arial`; while (fs > 10 && g.measureText(txt).width > 470) { fs *= 0.92; g.font = `900 ${fs}px Arial`; } g.fillText(txt, 256, sub ? H * 0.4 : H * 0.52);
    if (sub) { fs = Math.min(H * 0.24, 760 / Math.max(6, sub.length)); g.font = `700 ${fs}px Arial`; g.fillStyle = "#8a3a1a"; g.fillText(sub, 256, H * 0.78); }
  });
  return <RBox s={[w, h, 0.012]} p={p} rot={rot} r={0.004}><meshStandardMaterial map={T} roughness={0.85} /></RBox>;
};
export const _k = { lerp };
