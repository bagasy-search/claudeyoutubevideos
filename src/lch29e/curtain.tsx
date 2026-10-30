// lch29e · kit de CORTINAS: tela con pliegues de verdad (malla deformada), barral, ventana con haz de sol, lavarropas de carga frontal, ganchos, encaje.
import React from "react";
import * as THREE from "three";
import { M, RBox, rn, tex } from "./h3d";

const PI = Math.PI;

// texturas de tela
export const cottonTex = (col = "#f4efe2") => tex.text("cot" + col, 128, 128, (g) => { g.fillStyle = col; g.fillRect(0, 0, 128, 128); g.globalAlpha = 0.06; g.fillStyle = "#000"; for (let i = 0; i < 128; i += 3) { g.fillRect(i, 0, 1, 128); g.fillRect(0, i, 128, 1); } });
export const laceTex = () => tex.text("lace", 256, 256, (g) => {
  g.clearRect(0, 0, 256, 256); g.strokeStyle = "#fffaf0"; g.fillStyle = "#fffaf0";
  g.lineWidth = 3; for (let i = 0; i <= 256; i += 32) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); }
  g.lineWidth = 1.4; for (let i = -256; i <= 256; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 256, 256); g.stroke(); }
  // rosas y hojas de crochet
  for (let k = 0; k < 4; k++) { const cx = 64 + (k % 2) * 128, cy = 64 + Math.floor(k / 2) * 128;
    g.lineWidth = 4; for (let r = 6; r < 30; r += 7) { g.beginPath(); g.arc(cx, cy, r, 0, PI * 2); g.stroke(); }
    for (let a = 0; a < 6; a++) { const t = (a / 6) * PI * 2; g.beginPath(); g.ellipse(cx + Math.cos(t) * 40, cy + Math.sin(t) * 40, 12, 5, t, 0, PI * 2); g.fill(); } }
});
export const stripeTex = (a: string, b: string) => tex.text("str" + a + b, 128, 128, (g) => { g.fillStyle = a; g.fillRect(0, 0, 128, 128); g.fillStyle = b; for (let i = 0; i < 128; i += 32) g.fillRect(i, 0, 14, 128); });

// CORTINA: panel colgado del borde superior (y=0) hacia abajo; pliegues = ondas en z; sway = vaivén abajo; shrink = acorta (sube el ruedo);
// pucker = arrugas en el ruedo (forro que encoge distinto); crease = pliegue marcado horizontal a mitad (y relativo 0..1)
export const Curtain: React.FC<{ w?: number; h?: number; folds?: number; amp?: number; sway?: number; tt?: number; shrink?: number; pucker?: number; crease?: number; wrinkle?: number;
  map?: THREE.Texture; col?: string; op?: number; lace?: boolean; rough?: number; gather?: number }> =
  ({ w = 0.6, h = 1.4, folds = 5, amp = 0.025, sway = 0, tt = 0, shrink = 0, pucker = 0, crease = 0, wrinkle = 0, map, col = "#ffffff", op = 1, lace = false, rough = 0.95, gather = 0 }) => {
  const geo = React.useMemo(() => new THREE.PlaneGeometry(1, 1, 36, 30), []);
  const p = geo.attributes.position as THREE.BufferAttribute, H = h * (1 - shrink), W = w * (1 - gather * 0.6);
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i) + 0.5, v = 0.5 - p.getY(i); // u 0..1 ancho, v 0..1 de arriba hacia abajo
    let z = amp * (1 + gather * 2) * Math.sin(u * folds * PI * 2) + sway * v * v * Math.sin(tt * 1.6 + u * 3);
    z += pucker * v ** 4 * 0.05 * Math.sin(u * 37) * Math.cos(v * 23);
    z += wrinkle * 0.012 * Math.sin(u * 41 + v * 17) * Math.sin(v * 29 - u * 7);
    if (crease > 0) z += crease * 0.03 * Math.exp(-((v - 0.5) ** 2) / 0.0008);
    p.setXYZ(i, (u - 0.5) * W, -v * H, z);
  }
  p.needsUpdate = true; geo.computeVertexNormals();
  return <mesh geometry={geo}>{lace ? <meshStandardMaterial map={laceTex()} color={col} transparent alphaTest={0.25} side={2} roughness={0.9} opacity={op} />
    : <meshStandardMaterial map={map ?? cottonTex()} color={col} side={2} roughness={rough} transparent={op < 1} opacity={op} />}</mesh>;
};

// BARRAL con remates
export const Rod: React.FC<{ len?: number; brass?: boolean }> = ({ len = 1.4, brass = true }) => <group>
  <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, len, 16]} />{brass ? M.brass({}) : M.wood({ base: [120, 76, 40] })}</mesh>
  {[-1, 1].map((s) => <mesh key={s} position={[s * (len / 2 + 0.02), 0, 0]}><sphereGeometry args={[0.024, 18, 14]} />{brass ? M.brass({}) : M.wood({ base: [120, 76, 40] })}</mesh>)}
</group>;

// VENTANA: marco blanco de madera, vidrio con cruz, cielo de fondo; sun = haz de luz que cruza
export const Window: React.FC<{ w?: number; h?: number; sky?: string; sun?: number }> = ({ w = 1.0, h = 1.3, sky = "#f3d9a8", sun = 0 }) => <group>
  <mesh position={[0, 0, -0.03]}><planeGeometry args={[w, h]} /><meshBasicMaterial color={sky} toneMapped={false} /></mesh>
  {[[0, h / 2, w + 0.08, 0.06], [0, -h / 2, w + 0.12, 0.07], [0, 0, w, 0.03]].map(([x, y, a, b], i) => <RBox key={i} s={[a, b, 0.05]} p={[x, y, 0]} r={0.008}>{M.pvc({ col: "#f6f3ec" })}</RBox>)}
  {[-w / 2, 0, w / 2].map((x, i) => <RBox key={"v" + i} s={[i === 1 ? 0.03 : 0.06, h, 0.05]} p={[x, 0, 0]} r={0.008}>{M.pvc({ col: "#f6f3ec" })}</RBox>)}
  {sun > 0 && <mesh position={[0.25, -0.35, 0.6]} rotation={[0.9, 0.35, 0]}><cylinderGeometry args={[0.18, 0.42, 1.6, 24, 1, true]} />{M.glow({ col: "#ffe2a8", op: 0.09 * sun })}</mesh>}
</group>;

// POLVO en el haz: puntitos que flotan y giran lento
const moteTex = () => tex.text("mote", 32, 32, (g) => { const r = g.createRadialGradient(16, 16, 0, 16, 16, 16); r.addColorStop(0, "rgba(255,240,210,1)"); r.addColorStop(1, "rgba(255,240,210,0)"); g.fillStyle = r; g.fillRect(0, 0, 32, 32); });
export const Dust: React.FC<{ tt: number; k: number; n?: number; box?: number[]; p?: number[]; size?: number }> = ({ tt, k, n = 120, box = [0.6, 0.6, 0.3], p = [0, 0, 0], size = 0.012 }) => <group position={p as [number, number, number]}>
  {k > 0.01 && Array.from({ length: n }, (_, i) => { const a = tt * (0.15 + 0.2 * rn(i, 5)) + rn(i, 6) * 6.28;
    return <sprite key={i} position={[(rn(i, 2) - 0.5) * box[0] + 0.04 * Math.sin(a), (rn(i, 3) - 0.5) * box[1] + 0.03 * Math.cos(a * 0.7) - 0.02 * tt * rn(i, 7), (rn(i, 4) - 0.5) * box[2]]} scale={[size * (0.6 + rn(i, 8)), size * (0.6 + rn(i, 8)), 1]}>
      <spriteMaterial map={moteTex()} transparent opacity={k * (0.5 + 0.5 * Math.sin(a * 2 + i))} depthWrite={false} toneMapped={false} /></sprite>; })}
</group>;

const washerFront = (() => { let g: THREE.ShapeGeometry | null = null; return () => { if (g) return g;
  const sh = new THREE.Shape(); sh.moveTo(-0.3, 0); sh.lineTo(0.3, 0); sh.lineTo(0.3, 0.85); sh.lineTo(-0.3, 0.85); sh.lineTo(-0.3, 0);
  const hole = new THREE.Path(); hole.absarc(0, 0.4, 0.2, 0, Math.PI * 2, true); sh.holes.push(hole); return (g = new THREE.ShapeGeometry(sh, 48)); }; })();
// LAVARROPAS de carga frontal: caja blanca, ojo de buey con vidrio; drum = ángulo del tambor; water = nivel 0..1 y color
export const Washer: React.FC<{ drum?: number; water?: number; wcol?: string; door?: number; children?: React.ReactNode }> = ({ drum = 0, water = 0, wcol = "#9fb4c0", door = 0, children }) => <group>
  {/* gabinete HUECO: fondo, laterales, techo y frente con agujero, así se ve el tambor por el ojo de buey */}
  <RBox s={[0.6, 0.85, 0.2]} p={[0, 0.425, -0.2]} r={0.03}>{M.pvc({ col: "#f2f1ec" })}</RBox>
  {[-1, 1].map((sx) => <RBox key={sx} s={[0.03, 0.85, 0.42]} p={[sx * 0.285, 0.425, 0.09]} r={0.012}>{M.pvc({ col: "#f2f1ec" })}</RBox>)}
  <RBox s={[0.6, 0.04, 0.42]} p={[0, 0.83, 0.09]} r={0.012}>{M.pvc({ col: "#f2f1ec" })}</RBox>
  <RBox s={[0.6, 0.04, 0.42]} p={[0, 0.02, 0.09]} r={0.012}>{M.pvc({ col: "#e9e7e0" })}</RBox>
  <mesh position={[0, 0, 0.3]} geometry={washerFront()}>{M.pvc({ col: "#f2f1ec" })}</mesh>
  <RBox s={[0.6, 0.12, 0.02]} p={[0, 0.79, 0.3]} r={0.01}>{M.pvc({ col: "#e4e2da" })}</RBox>
  {[-0.18, 0.15].map((x, i) => <mesh key={i} position={[x, 0.79, 0.315]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.02, 24]} />{M.chrome({})}</mesh>)}
  {/* el tambor visto por la puerta: interior de acero, agua, lo que gira */}
  <group position={[0, 0.4, 0.1]}>
    <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.36, 40, 1, true]} /><meshStandardMaterial color="#b9bec4" metalness={0.6} roughness={0.35} side={2} /></mesh>
    <mesh position={[0, 0, -0.17]}><circleGeometry args={[0.2, 40]} /><meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.4} /></mesh>
    <group rotation={[0, 0, drum]}>{Array.from({ length: 3 }, (_, i) => <RBox key={i} s={[0.03, 0.05, 0.3]} p={[Math.cos(i * 2.09) * 0.18, Math.sin(i * 2.09) * 0.18, 0]} rot={[0, 0, i * 2.09]} r={0.01}><meshStandardMaterial color="#a8adb3" metalness={0.8} roughness={0.3} /></RBox>)}{children}</group>
    {water > 0 && <mesh position={[0, -0.2 + 0.2 * water, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.38, 0.34]} />{M.water({ col: wcol, op: 0.75 })}</mesh>}
    {water > 0 && <mesh position={[0, -0.2 + 0.2 * water, 0.165]}><planeGeometry args={[0.38, 0.4 * water]} />{M.water({ col: wcol, op: 0.45 })}</mesh>}
  </group>
  {/* puerta: aro cromado + vidrio, gira sobre la bisagra izquierda */}
  <group position={[-0.22, 0.4, 0.305]} rotation={[0, -door * 1.7, 0]}><group position={[0.22, 0, 0]}>
    <mesh><torusGeometry args={[0.21, 0.025, 14, 48]} />{M.chrome({})}</mesh>
    <mesh><circleGeometry args={[0.2, 48]} />{M.glass({ op: 0.18 })}</mesh></group></group>
</group>;

// GANCHO de cortina (alfiler de metal) y ARGOLLA con pinza
export const PinHook: React.FC<{ rust?: number }> = ({ rust = 0 }) => <group>
  <mesh position={[0, 0.02, 0]}><torusGeometry args={[0.012, 0.0025, 8, 20, PI]} />{M.steel({ col: rust > 0.5 ? "#a0522d" : "#c9ced3" })}</mesh>
  <mesh position={[0.012, -0.005, 0]}><cylinderGeometry args={[0.0025, 0.0025, 0.05, 8]} />{M.steel({ col: rust > 0.5 ? "#a0522d" : "#c9ced3" })}</mesh>
  <mesh position={[-0.012, 0.0, 0]}><cylinderGeometry args={[0.0025, 0.0015, 0.04, 8]} />{M.steel({ col: rust > 0.5 ? "#a0522d" : "#c9ced3" })}</mesh>
</group>;
export const ClipRing: React.FC = () => <group>
  <mesh><torusGeometry args={[0.022, 0.004, 10, 28]} />{M.brass({})}</mesh>
  <RBox s={[0.012, 0.03, 0.006]} p={[0, -0.04, 0]} r={0.002}>{M.brass({})}</RBox>
</group>;

// BAÑERA esmaltada con agua de color
export const Tub: React.FC<{ water?: number; wcol?: string; wop?: number }> = ({ water = 0.6, wcol = "#d9e6ea", wop = 0.6 }) => <group>
  {/* bañera ABIERTA: fondo + cuatro paredes esmaltadas, se ve el agua y lo que hay adentro */}
  <RBox s={[1.2, 0.06, 0.6]} p={[0, 0.03, 0]} r={0.02}>{M.porcelain({})}</RBox>
  {[-1, 1].map((sz) => <RBox key={"z" + sz} s={[1.2, 0.45, 0.07]} p={[0, 0.225, sz * 0.265]} r={0.03}>{M.porcelain({})}</RBox>)}
  {[-1, 1].map((sx) => <RBox key={"x" + sx} s={[0.07, 0.45, 0.6]} p={[sx * 0.565, 0.225, 0]} r={0.03}>{M.porcelain({})}</RBox>)}
  <mesh position={[0, 0.07 + 0.36 * water, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.06, 0.46]} />{M.water({ col: wcol, op: wop })}</mesh>
</group>;
