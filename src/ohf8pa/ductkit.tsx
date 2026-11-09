// ohf8pa · piezas de aire forzado para los componentes: conducto galvanizado, ramal, manija del damper, chapaleta, rejilla, termómetro, hoja a lápiz.
import React from "react";
import * as THREE from "three";
import { M, RBox, tex } from "./h3d";
import { V3 } from "./okit";

export const GALV = "#b9bfc3", PI = Math.PI;
const hand = "'Caveat','Patrick Hand','Segoe Print',cursive";

export const Galv: React.FC<{ s: number[]; p?: number[]; rot?: number[]; seams?: number }> = ({ s, p = [0, 0, 0], rot = [0, 0, 0], seams = 3 }) => <group position={p as V3} rotation={rot as V3}>
  <RBox s={s} r={0.008}>{M.steel({ col: GALV })}</RBox>
  {Array.from({ length: seams }, (_, i) => <RBox key={i} s={[0.006, s[1] + 0.006, s[2] + 0.006]} p={[-s[0] / 2 + (s[0] * (i + 1)) / (seams + 1), 0, 0]} r={0.002}>{M.steel({ col: "#8e959a" })}</RBox>)}
</group>;

// ramal redondo: a lo largo de Y local
export const Round: React.FC<{ l: number; r?: number; p?: number[]; rot?: number[]; op?: number }> = ({ l, r = 0.1, p = [0, 0, 0], rot = [0, 0, 0], op = 1 }) => <group position={p as V3} rotation={rot as V3}>
  <mesh castShadow={op === 1}><cylinderGeometry args={[r, r, l, 40, 1, op < 1]} />{op < 1 ? <meshStandardMaterial color="#d6dde1" transparent opacity={op} roughness={0.75} metalness={0} side={THREE.DoubleSide} depthWrite={false} /> : M.steel({ col: GALV })}</mesh>
  {op < 1 && [-0.5, -0.17, 0.17, 0.5].map((k) => <mesh key={k} position={[0, k * l, 0]}><cylinderGeometry args={[r + 0.003, r + 0.003, 0.014, 40, 1, true]} /><meshStandardMaterial color="#8e959a" metalness={0.5} roughness={0.45} side={THREE.DoubleSide} /></mesh>)}
  {op === 1 && [-0.32, 0, 0.32].map((k) => <mesh key={k} position={[0, k * l, 0]}><cylinderGeometry args={[r + 0.003, r + 0.003, 0.012, 40]} />{M.steel({ col: "#8e959a" })}</mesh>)}
</group>;

// la manija del damper, parada sobre la cara +Z del ramal: gira en su eje Z; ang=0 = alineada con el ramal (abierto)
export const Lever: React.FC<{ p?: number[]; ang?: number; s?: number; col?: string; line?: boolean }> = ({ p = [0, 0, 0], ang = 0, s = 1, col = "#5f666b", line }) => <group position={p as V3} scale={s}>
  <mesh rotation={[PI / 2, 0, 0]} position={[0, 0, 0.004]}><cylinderGeometry args={[0.062, 0.062, 0.008, 30, 1, false, -PI / 4, PI / 2]} /><meshStandardMaterial color="#9aa0a4" metalness={0.7} roughness={0.4} /></mesh>
  <group rotation={[0, 0, ang]}>
    <RBox s={[0.022, 0.13, 0.008]} p={[0, 0.045, 0.016]} r={0.003}>{M.steel({ col })}</RBox>
    <mesh position={[0, 0.0, 0.03]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.014, 0.014, 0.036, 16]} />{M.brass()}</mesh>
    {line && <RBox s={[0.005, 0.1, 0.002]} p={[0, 0.05, 0.022]} r={0.001} shadow={false}><meshBasicMaterial color="#141414" /></RBox>}
  </group>
  <group position={[0, 0, 0.05]} rotation={[0, 0, ang * 0.2]}>
    <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.015, 0.016, 12]} />{M.brass()}</mesh>
    <RBox s={[0.022, 0.012, 0.006]} p={[0.022, 0, 0]} r={0.002}>{M.brass()}</RBox>
    <RBox s={[0.022, 0.012, 0.006]} p={[-0.022, 0, 0]} r={0.002}>{M.brass()}</RBox>
  </group>
</group>;

// la chapaleta: disco dentro del ramal; ang=0 alineada con el aire (abierta)
export const Flap: React.FC<{ r?: number; ang?: number; p?: number[] }> = ({ r = 0.096, ang = 0, p = [0, 0, 0] }) => <group position={p as V3} rotation={[0, 0, ang]}>
  <mesh rotation={[0, PI / 2, 0]}><cylinderGeometry args={[r, r, 0.006, 40]} /><meshStandardMaterial color="#d35a3a" metalness={0.3} roughness={0.45} /></mesh>
</group>;

// rejilla de piso: acostada en XZ; louver 0 abierta .. 1 cerrada
export const Register: React.FC<{ p?: number[]; w?: number; d?: number; louver?: number; col?: string; rot?: number[] }> = ({ p = [0, 0, 0], w = 0.42, d = 0.16, louver = 0, col = "#3b342b", rot = [0, 0, 0] }) => <group position={p as V3} rotation={rot as V3}>
  <RBox s={[w, 0.012, d]} r={0.003} p={[0, 0.006, 0]}><meshStandardMaterial color={col} metalness={0.5} roughness={0.5} /></RBox>
  {Array.from({ length: 9 }, (_, i) => <RBox key={i} s={[w * 0.86, 0.004, d * 0.075]} r={0.001} p={[0, 0.016, -d * 0.36 + (i * d * 0.72) / 8]} rot={[(PI / 2.6) * (1 - louver), 0, 0]} shadow={false}><meshStandardMaterial color={col} metalness={0.5} roughness={0.5} /></RBox>)}
</group>;

// rejilla de retorno: de pared
export const ReturnGrille: React.FC<{ p?: number[]; w?: number; h?: number; rot?: number[] }> = ({ p = [0, 0, 0], w = 0.62, h = 0.44, rot = [0, 0, 0] }) => <group position={p as V3} rotation={rot as V3}>
  <RBox s={[w, h, 0.012]} r={0.004}><meshStandardMaterial color="#e5dfd2" roughness={0.55} /></RBox>
  <mesh position={[0, 0, 0.007]}><planeGeometry args={[w * 0.88, h * 0.84]} /><meshStandardMaterial color="#16120e" /></mesh>
  {Array.from({ length: 11 }, (_, i) => <RBox key={i} s={[w * 0.86, 0.012, 0.01]} r={0.002} p={[0, -h * 0.38 + (i * h * 0.76) / 10, 0.012]} rot={[0.5, 0, 0]} shadow={false}><meshStandardMaterial color="#e5dfd2" roughness={0.55} /></RBox>)}
</group>;

// termómetro digital de 8 cm: número en pantalla (entero o con signo)
const lcd = (txt: string) => tex.text("lcd" + txt, 256, 128, (g) => { g.fillStyle = "#c9d3bb"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#1a1f18"; g.font = "bold 92px 'DejaVu Sans Mono',Consolas,monospace"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 128, 70); });
export const Therm: React.FC<{ p?: number[]; rot?: number[]; v: number | string; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], v, s = 1 }) => {
  const txt = typeof v === "number" ? `${Math.round(v)}°` : v;
  return <group position={p as V3} rotation={rot as V3} scale={s}>
    <RBox s={[0.14, 0.09, 0.024]} r={0.012}><meshPhysicalMaterial color="#f1eee6" roughness={0.4} clearcoat={0.4} /></RBox>
    <mesh position={[0, 0.006, 0.0125]}><planeGeometry args={[0.112, 0.056]} /><meshBasicMaterial map={lcd(txt)} toneMapped={false} /></mesh>
  </group>;
};

// hoja rayada a lápiz; lines = renglones ya escritos; al cambiar el número se regenera la textura (cacheada por contenido)
export const Sheet: React.FC<{ p?: number[]; rot?: number[]; w?: number; h?: number; lines: string[]; head?: string }> = ({ p = [0, 0, 0], rot = [-PI / 2, 0, 0], w = 0.56, h = 0.74, lines, head }) => {
  const key = (head ?? "") + lines.join("|");
  const map = tex.text("sh" + key, 640, 846, (g) => {
    g.fillStyle = "#f3eeda"; g.fillRect(0, 0, 640, 846);
    g.strokeStyle = "rgba(90,120,170,.42)"; g.lineWidth = 2; for (let y = 96; y < 840; y += 62) { g.beginPath(); g.moveTo(0, y); g.lineTo(640, y); g.stroke(); }
    g.strokeStyle = "rgba(200,70,70,.45)"; g.beginPath(); g.moveTo(72, 0); g.lineTo(72, 846); g.stroke();
    g.fillStyle = "#2b2b30"; g.font = `58px ${hand}`; g.textBaseline = "alphabetic";
    if (head) g.fillText(head, 96, 76);
    lines.forEach((l, i) => g.fillText(l, 96, 150 + i * 62));
  });
  return <group position={p as V3} rotation={rot as V3}><mesh receiveShadow><planeGeometry args={[w, h]} /><meshStandardMaterial map={map} roughness={0.9} /></mesh></group>;
};

export const Pencil: React.FC<{ p?: number[]; rot?: number[] }> = ({ p = [0, 0, 0], rot = [0, 0, 0] }) => <group position={p as V3} rotation={rot as V3}>
  <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.0075, 0.0075, 0.2, 6]} /><meshStandardMaterial color="#e3b23c" roughness={0.5} /></mesh>
  <mesh position={[0, -0.012, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.0075, 0.024, 12]} /><meshStandardMaterial color="#d8b58a" roughness={0.7} /></mesh>
  <mesh position={[0, 0.207, 0]}><cylinderGeometry args={[0.0078, 0.0078, 0.016, 12]} /><meshStandardMaterial color="#d36a7a" roughness={0.8} /></mesh>
</group>;

// termómetro de vidrio con columna roja: v de 50 a 90
export const GlassT: React.FC<{ p?: number[]; v: number; h?: number; col?: string }> = ({ p = [0, 0, 0], v, h = 0.9, col = "#d1321f" }) => {
  const k = Math.max(0.03, (v - 50) / 40), ch = h * 0.86 * k;
  return <group position={p as V3}>
    <RBox s={[0.13, h + 0.08, 0.02]} r={0.008} p={[0, h / 2, -0.03]}>{M.wood({ base: [126, 84, 48] })}</RBox>
    {Array.from({ length: 9 }, (_, i) => <RBox key={i} s={[i % 4 === 0 ? 0.05 : 0.03, 0.004, 0.002]} r={0.001} p={[-0.042, 0.06 + (i * h * 0.86) / 8, -0.018]} shadow={false}><meshBasicMaterial color="#21160c" /></RBox>)}
    <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[0.016, 0.016, h, 16]} />{M.glass({ op: 0.1 })}</mesh>
    <mesh position={[0, 0.04, 0]}><sphereGeometry args={[0.03, 20, 16]} /><meshStandardMaterial color={col} roughness={0.25} /></mesh>
    <mesh position={[0, 0.05 + ch / 2, 0]}><cylinderGeometry args={[0.011, 0.011, ch, 12]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>
  </group>;
};
