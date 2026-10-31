// ohf30 · piezas 3D compartidas por los componentes del minuto (heroes_*): radiador con MAPA DE CALOR por columna y altura,
// manómetro con su esfera dibujada, llave de purga de bronce, taza, trapo, caño, rótulo de cinta de pintor DENTRO de la escena.
// (los componentes son distintos entre sí: esto es sólo el material de taller con el que se arman)
import React from "react";
import * as THREE from "three";
import { M, RBox, tex, rn, lerp } from "./h3d";

const PI = Math.PI;
export type V3 = [number, number, number];
// frío azul acero → hierro → naranja vivo (calor que se ve)
const C_COLD = new THREE.Color("#5b86c9"), C_IRON = new THREE.Color("#a59d8a"), C_HOT = new THREE.Color("#ff7a2e");
export const heatCol = (k: number) => k < 0.5 ? C_COLD.clone().lerp(C_IRON, k * 2) : C_IRON.clone().lerp(C_HOT, (k - 0.5) * 2);

// radiador de columnas: n columnas × seg tramos; heat(i, y01) da 0..1 (0 frío, .5 tibio, 1 caliente)
export const RadH: React.FC<{ n?: number; w?: number; h?: number; heat: (i: number, y: number) => number; p?: V3; ry?: number; seg?: number; glow?: number }> = ({ n = 9, w = 0.05, h = 0.5, heat, p = [0, 0, 0], ry = 0, seg = 7, glow = 1 }) => {
  const L = n * w * 1.12, x0 = -L / 2 + w / 2;
  return <group position={p} rotation={[0, ry, 0]}>
    {Array.from({ length: n }, (_, i) => <group key={i} position={[x0 + i * w * 1.12, 0.05, 0]}>
      {Array.from({ length: seg }, (_, j) => { const y = (j + 0.5) / seg, k = Math.max(0, Math.min(1, heat(i, y))), c = heatCol(k);
        return <mesh key={j} position={[0, h * y, 0]} castShadow receiveShadow><boxGeometry args={[w, h / seg + 0.001, w * 1.5]} />
          <meshStandardMaterial color={c} metalness={0.45} roughness={0.45} emissive={k > 0.55 ? "#ff6a1a" : "#123a7a"} emissiveIntensity={glow * (k > 0.55 ? (k - 0.55) * 0.9 : (0.5 - Math.min(0.5, k)) * 0.35)} /></mesh>; })}
    </group>)}
    {[0.06, h + 0.04].map((y, i) => <RBox key={i} p={[0, y, 0]} s={[L, 0.03, w * 1.1]} r={0.01}><meshStandardMaterial color="#9d9684" metalness={0.5} roughness={0.45} /></RBox>)}
    {[-1, 1].map((s) => <RBox key={s} p={[s * (L / 2 - 0.03), 0.025, 0]} s={[0.04, 0.05, w * 2.6]} r={0.008}><meshStandardMaterial color="#7d786b" metalness={0.4} roughness={0.5} /></RBox>)}
  </group>;
};

// esfera de manómetro dibujada: rango 0..max, banda verde [g0,g1], rótulo de unidades
export const dialTex = (key: string, max: number, g0: number, g1: number, unit = "PSI", red?: number) => tex.text("dial" + key, 512, 512, (g) => {
  g.fillStyle = "#f4efe2"; g.beginPath(); g.arc(256, 256, 250, 0, PI * 2); g.fill();
  const ang = (v: number) => PI * 0.75 + (v / max) * PI * 1.5;
  const band = (a: number, b: number, col: string) => { g.strokeStyle = col; g.lineWidth = 34; g.beginPath(); g.arc(256, 256, 196, ang(a), ang(b)); g.stroke(); };
  band(g0, g1, "#3f9a52"); if (red !== undefined) band(red, max, "#c8322a");
  g.strokeStyle = "#1d1d1d"; g.fillStyle = "#1d1d1d"; g.textAlign = "center"; g.textBaseline = "middle";
  const step = max <= 4 ? 0.5 : max <= 40 ? 5 : max <= 100 ? 10 : 50;
  for (let v = 0; v <= max + 1e-6; v += step / 5) {
    const a = ang(v), big = Math.abs(v / step - Math.round(v / step)) < 1e-6, r0 = big ? 160 : 176;
    g.lineWidth = big ? 6 : 2; g.beginPath(); g.moveTo(256 + Math.cos(a) * r0, 256 + Math.sin(a) * r0); g.lineTo(256 + Math.cos(a) * 214, 256 + Math.sin(a) * 214); g.stroke();
    if (big) { g.font = "700 38px Arial"; g.fillText(String(Math.round(v * 10) / 10), 256 + Math.cos(a) * 124, 256 + Math.sin(a) * 124); }
  }
  g.font = "900 40px Arial"; g.fillText(unit, 256, 352);
  g.lineWidth = 10; g.strokeStyle = "#2a2a2a"; g.beginPath(); g.arc(256, 256, 246, 0, PI * 2); g.stroke();
});
// manómetro: caja de bronce, vidrio, aguja (v en las unidades del dial)
export const Gauge: React.FC<{ v: number; max: number; tx: THREE.Texture; p?: V3; r?: number; rot?: V3 }> = ({ v, max, tx, p = [0, 0, 0], r = 0.12, rot = [0, 0, 0] }) => {
  const a = -(PI * 0.75 + (Math.max(0, Math.min(max * 1.04, v)) / max) * PI * 1.5) + PI / 2 * 0;
  return <group position={p} rotation={rot}>
    <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[r * 1.12, r * 1.12, r * 0.35, 48]} />{M.brass()}</mesh>
    <mesh position={[0, 0, r * 0.18]}><circleGeometry args={[r, 48]} /><meshStandardMaterial map={tx} roughness={0.6} /></mesh>
    <group position={[0, 0, r * 0.2]} rotation={[0, 0, a]}>
      <mesh position={[r * 0.38, 0, 0]}><boxGeometry args={[r * 0.82, r * 0.035, 0.004]} /><meshStandardMaterial color="#b3261e" /></mesh>
    </group>
    <mesh position={[0, 0, r * 0.215]}><cylinderGeometry args={[r * 0.07, r * 0.07, 0.006, 16]} />{M.brass()}</mesh>
    <mesh position={[0, 0, r * 0.24]}><circleGeometry args={[r * 1.02, 48]} />{M.glass({ op: 0.14 })}</mesh>
  </group>;
};

// llave de purga de bronce (la cruz con el agujero cuadrado), apuntando en +x
export const BleedKey: React.FC<{ p?: V3; rot?: V3; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0.03, 0, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.009, 0.009, 0.06, 20]} />{M.brass()}</mesh>
  <mesh position={[0.061, 0, 0]}><boxGeometry args={[0.003, 0.007, 0.007]} /><meshStandardMaterial color="#1a1206" /></mesh>
  <mesh position={[-0.012, 0, 0]} castShadow><boxGeometry args={[0.014, 0.07, 0.012]} />{M.brass({ col: "#cf9c42" })}</mesh>
  {[-1, 1].map((k) => <mesh key={k} position={[-0.012, k * 0.035, 0]}><sphereGeometry args={[0.009, 14, 10]} />{M.brass({ col: "#cf9c42" })}</mesh>)}
</group>;

// taza esmaltada blanca con filete azul (para el agua de la purga); fill 0..1, col del agua
export const Cup: React.FC<{ p?: V3; fill?: number; col?: string; s?: number }> = ({ p = [0, 0, 0], fill = 0, col = "#9fc4dc", s = 1 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.04, 0]} castShadow receiveShadow><cylinderGeometry args={[0.042, 0.036, 0.08, 32, 1, true]} />{M.porcelain({ side: THREE.DoubleSide })}</mesh>
  <mesh position={[0, 0.079, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.042, 0.003, 8, 40]} /><meshStandardMaterial color="#2f5fa8" /></mesh>
  <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.036, 0.036, 0.004, 32]} />{M.porcelain()}</mesh>
  <mesh position={[0.05, 0.045, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.016, 0.004, 8, 20, PI]} />{M.porcelain()}</mesh>
  {fill > 0.01 && <mesh position={[0, 0.004 + 0.035 * fill, 0]} scale={[1, Math.max(0.01, fill), 1]}><cylinderGeometry args={[0.039, 0.036, 0.07, 32]} />{M.water({ col, op: 0.85 })}</mesh>}
</group>;

// trapo doblado (algodón a cuadros)
const ragTex = () => tex.text("rag", 128, 128, (g) => { g.fillStyle = "#e9e1cf"; g.fillRect(0, 0, 128, 128); g.fillStyle = "rgba(170,60,50,.45)"; for (let i = 0; i < 128; i += 16) { g.fillRect(i, 0, 6, 128); g.fillRect(0, i, 128, 6); } });
export const Rag: React.FC<{ p?: V3; rot?: V3; s?: V3 }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = [0.14, 0.02, 0.1] }) => <RBox s={s} p={p} rot={rot} r={0.008}><meshStandardMaterial map={ragTex()} roughness={0.95} /></RBox>;

// caño recto de a hasta b
export const Pipe: React.FC<{ a: V3; b: V3; r?: number; col?: string; em?: string; emI?: number }> = ({ a, b, r = 0.02, col = "#55585b", em = "#000", emI = 0 }) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = d.length(), mid = A.clone().add(B).multiplyScalar(0.5);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return <mesh position={mid} quaternion={q} castShadow receiveShadow><cylinderGeometry args={[r, r, L, 20]} /><meshStandardMaterial color={col} metalness={0.7} roughness={0.4} emissive={em} emissiveIntensity={emI} /></mesh>;
};

// rótulo de cinta de pintor con marcador, plano dentro de la escena (≤5 palabras)
// rev 0..1 = el marcador va escribiendo (12 pasos cacheados)
// ancho real del texto con la fuente del marcador (antes se estimaba por letra y los textos largos se salían de la cinta)
const _tw: Record<string, number> = {};
const tapeW = (txt: string) => {
  if (_tw[txt] == null) { const g = document.createElement("canvas").getContext("2d")!; g.font = "700 62px 'Permanent Marker', 'Comic Sans MS', cursive"; _tw[txt] = Math.max(txt.length * 34, g.measureText(txt).width); }
  return _tw[txt];
};
export const Tape: React.FC<{ txt: string; p?: V3; rot?: V3; w?: number; k?: number; col?: string; rev?: number }> = ({ txt, p = [0, 0, 0], rot = [0, 0, 0], w = 0.3, k = 1, col = "#1c2a3a", rev = 1 }) => {
  const W = Math.round(80 + tapeW(txt)), q = Math.round(Math.max(0, Math.min(1, rev)) * 12);
  const tx = tex.text("tape" + txt + col + q, W, 96, (g) => {
    g.fillStyle = "#efe0b0"; g.fillRect(0, 0, W, 96); for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(150,120,60,${0.06 * rn(i, 9)})`; g.fillRect(rn(i, 3) * W, rn(i, 4) * 96, 6, 3); }
    g.save(); g.beginPath(); g.rect(0, 0, 32 + (W - 32) * q / 12, 96); g.clip();
    g.fillStyle = col; g.font = "700 62px 'Permanent Marker', 'Comic Sans MS', cursive"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, W / 2, 52); g.restore();
  });
  const hgt = w * 96 / W;
  return <group position={p} rotation={rot} scale={[Math.max(0.001, k), Math.max(0.001, k), 1]}>
    <mesh castShadow><planeGeometry args={[w, hgt]} /><meshStandardMaterial map={tx} roughness={0.85} side={THREE.DoubleSide} /></mesh>
  </group>;
};

// burbujas/partículas que suben (aire en el agua): n, caja, velocidad
export const Bubbles: React.FC<{ tt: number; n: number; box: [number, number, number]; p?: V3; v?: number; r?: number; col?: string; op?: number }> = ({ tt, n, box, p = [0, 0, 0], v = 0.12, r = 0.006, col = "#eaf6ff", op = 0.8 }) => <group position={p}>
  {Array.from({ length: n }, (_, i) => { const y = ((rn(i, 2) * box[1] + tt * v * (0.6 + rn(i, 3))) % box[1]);
    return <mesh key={i} position={[(rn(i, 4) - 0.5) * box[0] + 0.004 * Math.sin(tt * 3 + i), y, (rn(i, 5) - 0.5) * box[2]]}><sphereGeometry args={[r * (0.6 + rn(i, 6)), 10, 8]} /><meshPhysicalMaterial color={col} transparent opacity={op} roughness={0.05} clearcoat={1} /></mesh>; })}
</group>;

// rueda de válvula (manija redonda con rayos), gira en su eje y
export const Wheel: React.FC<{ p?: V3; a?: number; r?: number; col?: string }> = ({ p = [0, 0, 0], a = 0, r = 0.05, col = "#1d1d1d" }) => <group position={p} rotation={[0, a, 0]}>
  <mesh rotation={[PI / 2, 0, 0]} castShadow><torusGeometry args={[r, r * 0.16, 12, 36]} /><meshStandardMaterial color={col} roughness={0.35} /></mesh>
  {[0, 1, 2].map((i) => <mesh key={i} rotation={[0, (i * PI) / 3, 0]}><boxGeometry args={[r * 2, r * 0.12, r * 0.12]} /><meshStandardMaterial color={col} roughness={0.35} /></mesh>)}
  <mesh><cylinderGeometry args={[r * 0.25, r * 0.25, r * 0.4, 16]} />{M.brass()}</mesh>
</group>;

// onda de golpe (BANG): anillo que se abre y se apaga desde el instante a; mira a cámara (plano XY)
export const Shock: React.FC<{ tt: number; a: number; p?: V3; r?: number; col?: string; d?: number }> = ({ tt, a, p = [0, 0, 0], r = 0.08, col = "#ffd27a", d = 0.6 }) => {
  const k = (tt - a) / d; if (k <= 0 || k >= 1) return null;
  return <group position={p}>{[0, 0.18].map((o, i) => { const q = Math.max(0, k - o); return q > 0 ? <mesh key={i}><ringGeometry args={[r * (0.3 + 2.4 * q), r * (0.42 + 2.4 * q), 48]} /><meshBasicMaterial color={col} transparent opacity={0.85 * (1 - q)} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} /></mesh> : null; })}</group>;
};

// bocanadas que viajan de A a B en ciclo (vapor, aire, agua): n esferas, velocidad v (vueltas/s)
export const Puffs: React.FC<{ tt: number; n: number; a: V3; b: V3; r?: number; col?: string; op?: number; v?: number; k?: number; wob?: number }> = ({ tt, n, a, b, r = 0.012, col = "#ffffff", op = 0.5, v = 0.5, k = 1, wob = 0.01 }) => <>
  {Array.from({ length: n }, (_, i) => { const u = (tt * v + i / n) % 1, s = Math.sin(Math.PI * u);
    return <mesh key={i} position={[lerp(a[0], b[0], u) + wob * Math.sin(tt * 3 + i * 2), lerp(a[1], b[1], u) + wob * Math.cos(tt * 2.6 + i), lerp(a[2], b[2], u)]} scale={Math.max(0.001, k * (0.6 + 0.6 * s))}>
      <sphereGeometry args={[r, 10, 8]} /><meshBasicMaterial color={col} transparent opacity={op * s} depthWrite={false} /></mesh>; })}
</>;

// ficha / hoja de libreta con renglones a mano; rev = cuántos renglones se ven (0..n, con decimales escribe el renglón)
export const Card: React.FC<{ id: string; lines: string[]; p?: V3; rot?: V3; w?: number; h?: number; rev?: number; col?: string; ruled?: boolean }> = ({ id, lines, p = [0, 0, 0], rot = [0, 0, 0], w = 0.3, h = 0.2, rev = 99, col = "#1c2a3a", ruled = true }) => {
  const q = Math.round(Math.min(lines.length, Math.max(0, rev)) * 8);
  const W = 768, Hh = Math.round(768 * h / w);
  const tx = tex.text("card" + id + q, W, Hh, (g) => {
    g.fillStyle = "#f6efdc"; g.fillRect(0, 0, W, Hh);
    if (ruled) { g.strokeStyle = "rgba(70,110,170,.35)"; g.lineWidth = 3; for (let y = 90; y < Hh; y += 84) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.strokeStyle = "rgba(200,60,60,.45)"; g.beginPath(); g.moveTo(70, 0); g.lineTo(70, Hh); g.stroke(); }
    g.fillStyle = col; g.font = "700 58px 'Permanent Marker', 'Comic Sans MS', cursive"; g.textBaseline = "alphabetic";
    lines.forEach((s, i) => { const full = Math.floor(q / 8); if (i > full) return; const part = i < full ? 1 : (q % 8) / 8; if (part <= 0) return;
      g.save(); g.beginPath(); g.rect(0, 0, 90 + (W - 90) * part, Hh); g.clip(); g.fillText(s, 92, 78 + i * 84); g.restore(); });
  });
  return <group position={p} rotation={rot}><mesh castShadow receiveShadow><boxGeometry args={[w, h, 0.002]} /><meshStandardMaterial map={tx} roughness={0.9} /></mesh></group>;
};
