// lsm29d · utilería del porche y la granja de Ruth para los componentes únicos (kit h3d): tablas del porche, mecedoras,
// tazones, teléfono de pared, la camioneta de Lyle, billetes, la Biblia de cantos dorados, casitas de la línea compartida.
import React from "react";
import * as THREE from "three";
import { M, RBox, rn, tex } from "./h3d";
import { paperTex } from "./tg";

const PI = Math.PI;
type V = [number, number, number];

// tabla del porche: veta A LO LARGO (x), nudos y juntas oscuras; madera gastada color miel
export const plankTex = (i: number) => tex.text("plank" + (i % 5), 1024, 64, (g) => {
  const b = [158 + 14 * rn(i, 2), 112 + 10 * rn(i, 3), 66 + 6 * rn(i, 4)]; g.fillStyle = `rgb(${b.join(",")})`; g.fillRect(0, 0, 1024, 64);
  for (let k = 0; k < 26; k++) { g.strokeStyle = `rgba(70,38,14,${0.08 + 0.16 * rn(i * 31 + k, 5)})`; g.lineWidth = 1 + 2 * rn(i * 31 + k, 6); g.beginPath(); const y = rn(i * 31 + k, 7) * 64; g.moveTo(0, y); g.bezierCurveTo(340, y + 6 * rn(k, 8) - 3, 680, y - 6 * rn(k, 9) + 3, 1024, y + 4 * rn(k, 10) - 2); g.stroke(); }
  for (let k = 0; k < 2; k++) { const x = 120 + 760 * rn(i * 7 + k, 11), y = 18 + 28 * rn(i * 7 + k, 12); g.fillStyle = "rgba(60,30,12,.55)"; g.beginPath(); g.ellipse(x, y, 9, 5, 0, 0, 6.3); g.fill(); }
  g.fillStyle = "rgba(30,16,6,.7)"; g.fillRect(0, 0, 1024, 2); g.fillRect(0, 62, 1024, 2);
});
// piso de tablas del porche con la baranda blanca detrás y, más allá, el patio de la granja al atardecer (no el vacío negro)
export const Porch: React.FC<{ w?: number; d?: number; rail?: boolean; dip?: number; crack?: number; yard?: boolean }> = ({ w = 2.4, d = 1.4, rail = true, dip = 0, crack = 0, yard = true }) => {
  const n = Math.round(d / 0.09);
  return <group>
    {Array.from({ length: n }, (_, i) => { const z = -d / 2 + (i + 0.5) * (d / n), mid = Math.abs(z) < 0.2 ? dip * (1 - Math.abs(z) / 0.2) : 0;
      return <RBox key={i} s={[w, 0.03, d / n - 0.006]} r={0.004} p={[0, 0.015 - mid, z]}><meshStandardMaterial map={plankTex(i)} roughness={0.72} /></RBox>; })}
    {crack > 0 && <mesh position={[0.15, 0.032 - dip, 0.12]} rotation={[-PI / 2, 0, 0.3]}><planeGeometry args={[0.5 * crack, 0.008]} /><meshBasicMaterial color="#1a0f08" /></mesh>}
    {rail && <group position={[0, 0, -d / 2 + 0.03]}>
      <RBox s={[w, 0.05, 0.06]} r={0.008} p={[0, 0.82, 0]}>{M.matte({ col: "#efece4" })}</RBox>
      <RBox s={[w, 0.04, 0.05]} r={0.006} p={[0, 0.1, 0]}>{M.matte({ col: "#e6e2d8" })}</RBox>
      {Array.from({ length: Math.round(w / 0.11) }, (_, i) => <RBox key={i} s={[0.03, 0.7, 0.03]} r={0.004} p={[-w / 2 + 0.06 + i * 0.11, 0.46, 0]}>{M.matte({ col: "#f1eee6" })}</RBox>)}
      {[-1, 1].map((k) => <RBox key={k} s={[0.1, 1.9, 0.1]} r={0.01} p={[k * (w / 2 - 0.05), 0.95, 0]}>{M.matte({ col: "#f3f0e8" })}</RBox>)}
    </group>}
    {yard && <Yard z={-d / 2 - 0.1} />}
  </group>;
};
// el patio de la granja detrás de la baranda: pasto, surcos de maíz, granero rojo y cielo de atardecer
const skyTex = () => tex.text("skyfarm", 512, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#2b3550"); gr.addColorStop(0.55, "#c98a5a"); gr.addColorStop(1, "#f0c27e"); g.fillStyle = gr; g.fillRect(0, 0, 512, 256); });
const fieldTex = () => tex.text("fieldrows", 512, 512, (g) => { g.fillStyle = "#5b5a32"; g.fillRect(0, 0, 512, 512); for (let k = 0; k < 40; k++) { g.fillStyle = k % 2 ? "rgba(40,36,18,.5)" : "rgba(120,112,60,.35)"; g.fillRect(0, k * 12.8, 512, 6); } });
export const Sky: React.FC = () => <mesh position={[0, 1.2, -6]}><planeGeometry args={[16, 5]} /><meshBasicMaterial map={skyTex()} toneMapped={false} /></mesh>;
export const Yard: React.FC<{ z?: number }> = ({ z = -0.8 }) => <group position={[0, 0, z]}>
  <mesh rotation={[-PI / 2, 0, 0]} position={[0, -0.25, -3]}><planeGeometry args={[14, 6]} /><meshStandardMaterial map={fieldTex()} roughness={1} /></mesh>
  <group position={[-1.6, -0.25, -4.2]}>
    <RBox s={[0.9, 0.6, 0.6]} r={0.02} p={[0, 0.3, 0]}><meshStandardMaterial color="#8a2f24" roughness={0.85} /></RBox>
    <mesh position={[0, 0.72, 0]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.5, 0.5, 0.62]} /><meshStandardMaterial color="#3b2a24" roughness={0.8} /></mesh>
    <RBox s={[0.28, 0.4, 0.02]} r={0.01} p={[0, 0.2, 0.31]}>{M.matte({ col: "#f1ece2" })}</RBox>
  </group>
  <mesh position={[0, 1.2, -6]}><planeGeometry args={[16, 5]} /><meshBasicMaterial map={skyTex()} toneMapped={false} /></mesh>
</group>;

// mecedora de madera pintada de blanco; rock = ángulo de balanceo
export const Rocker: React.FC<{ p?: V; ry?: number; rock?: number; col?: string }> = ({ p = [0, 0, 0], ry = 0, rock = 0, col = "#7a5232" }) => <group position={p} rotation={[0, ry, 0]}>
  <group rotation={[rock, 0, 0]} position={[0, 0.02, 0]}>
    {[-1, 1].map((k) => <group key={k} position={[k * 0.2, 0.62, 0]} rotation={[0, PI / 2, 0]}><mesh rotation={[0, 0, -PI / 2 - 0.375]}><torusGeometry args={[0.6, 0.016, 8, 40, 0.75]} />{M.matte({ col })}</mesh></group>)}
    <RBox s={[0.44, 0.03, 0.42]} r={0.008} p={[0, 0.42, 0]}>{M.matte({ col })}</RBox>
    <RBox s={[0.38, 0.045, 0.36]} r={0.02} p={[0, 0.455, 0.01]}><meshStandardMaterial color="#a8322a" roughness={0.9} /></RBox>
    {[-1, 1].map((kx) => [-1, 1].map((kz) => <RBox key={kx + "" + kz} s={[0.035, 0.38, 0.035]} r={0.005} p={[kx * 0.2, 0.22, kz * 0.18]}>{M.matte({ col })}</RBox>))}
    {[-1, 1].map((k) => <RBox key={"b" + k} s={[0.035, 0.6, 0.035]} r={0.005} p={[k * 0.2, 0.72, -0.2]}>{M.matte({ col })}</RBox>)}
    {Array.from({ length: 5 }, (_, i) => <RBox key={"s" + i} s={[0.03, 0.5, 0.012]} r={0.004} p={[-0.14 + i * 0.07, 0.72, -0.205]}>{M.matte({ col })}</RBox>)}
    <RBox s={[0.46, 0.05, 0.04]} r={0.008} p={[0, 1.03, -0.2]}>{M.matte({ col })}</RBox>
    {[-1, 1].map((k) => <RBox key={"a" + k} s={[0.05, 0.03, 0.42]} r={0.008} p={[k * 0.22, 0.62, -0.01]}>{M.matte({ col })}</RBox>)}
  </group>
</group>;

// tazón de loza de todos los días
export const Mug: React.FC<{ p?: V; ry?: number; col?: string; coffee?: boolean }> = ({ p = [0, 0, 0], ry = 0, col = "#e8dcc0", coffee = true }) => <group position={p} rotation={[0, ry, 0]}>
  <mesh position={[0, 0.045, 0]} castShadow receiveShadow><cylinderGeometry args={[0.04, 0.036, 0.09, 32, 1, true]} /><meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.036, 0.036, 0.006, 28]} /><meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.6} /></mesh>
  {coffee && <mesh position={[0, 0.075, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.038, 28]} /><meshPhysicalMaterial color="#3e2312" roughness={0.1} clearcoat={1} /></mesh>}
  <mesh position={[0.046, 0.047, 0]} rotation={[0, 0, -PI / 2]}><torusGeometry args={[0.022, 0.0065, 10, 24, PI]} /><meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.6} /></mesh>
</group>;

// mesita de madera del porche
export const SideTable: React.FC<{ p?: V; h?: number }> = ({ p = [0, 0, 0], h = 0.5 }) => <group position={p}>
  <RBox s={[0.42, 0.03, 0.42]} r={0.01} p={[0, h, 0]}>{M.wood({ base: [150, 102, 60] })}</RBox>
  {[-1, 1].map((kx) => [-1, 1].map((kz) => <RBox key={kx + "" + kz} s={[0.03, h, 0.03]} r={0.004} p={[kx * 0.17, h / 2, kz * 0.17]}>{M.wood({ base: [130, 88, 50] })}</RBox>))}
</group>;

// teléfono de pared de roble con manivela, auricular colgado y las dos campanas
export const WallPhone: React.FC<{ p?: V; ring?: number; off?: number }> = ({ p = [0, 0, 0], ring = 0, off = 0 }) => <group position={p}>
  <RBox s={[0.22, 0.42, 0.1]} r={0.012} p={[0, 0, 0]}>{M.wood({ base: [150, 96, 52] })}</RBox>
  <RBox s={[0.18, 0.12, 0.03]} r={0.008} p={[0, -0.27, 0.04]}>{M.wood({ base: [138, 88, 48] })}</RBox>
  {[-1, 1].map((k) => <mesh key={k} position={[k * 0.045, 0.14 + 0.004 * Math.sin(ring * 40 + k), 0.065]} rotation={[PI / 2, 0, 0]}><sphereGeometry args={[0.035, 20, 12, 0, PI * 2, 0, PI / 2]} />{M.brass()}</mesh>)}
  <mesh position={[0, 0.02, 0.07]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.035, 0.08, 20]} /><meshStandardMaterial color="#141210" roughness={0.4} /></mesh>
  <group position={[0.13, 0.02, 0.02]} rotation={[0, 0, 0.6 * off]}>
    <mesh position={[0.005, -0.05, 0]}><cylinderGeometry args={[0.018, 0.014, 0.1, 16]} /><meshStandardMaterial color="#141210" roughness={0.4} /></mesh>
  </group>
  <group position={[-0.12, -0.05, 0.03]} rotation={[0, 0, ring * 2]}><RBox s={[0.012, 0.08, 0.012]} r={0.003} p={[0, -0.04, 0]}>{M.steel()}</RBox><RBox s={[0.03, 0.012, 0.03]} r={0.004} p={[0.015, -0.08, 0.01]}><meshStandardMaterial color="#141210" /></RBox></group>
</group>;

// la camioneta (1950, de juguete grande): color, ruedas que giran, capó abierto
export const Pickup: React.FC<{ p?: V; ry?: number; col?: string; wheel?: number; hood?: number }> = ({ p = [0, 0, 0], ry = 0, col = "#4b6f8a", wheel = 0, hood = 0 }) => <group position={p} rotation={[0, ry, 0]}>
  <RBox s={[0.62, 0.12, 0.28]} r={0.03} p={[0, 0.14, 0]}><meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.7} metalness={0.2} /></RBox>
  <RBox s={[0.2, 0.15, 0.26]} r={0.03} p={[0.02, 0.27, 0]}><meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.7} metalness={0.2} /></RBox>
  <mesh position={[0.02, 0.28, 0.131]}><planeGeometry args={[0.15, 0.08]} />{M.glass({ op: 0.5, col: "#cfe2ee" })}</mesh>
  <mesh position={[0.02, 0.28, -0.131]} rotation={[0, PI, 0]}><planeGeometry args={[0.15, 0.08]} />{M.glass({ op: 0.5, col: "#cfe2ee" })}</mesh>
  <RBox s={[0.25, 0.1, 0.26]} r={0.01} p={[-0.2, 0.25, 0]}><meshStandardMaterial map={tex.wood(2, 1, [120, 84, 52])} roughness={0.8} /></RBox>
  <group position={[0.31, 0.2, 0]} rotation={[0, 0, -1.0 * hood]}><RBox s={[0.2, 0.02, 0.24]} r={0.01} p={[-0.1, 0, 0]}><meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.7} /></RBox></group>
  <RBox s={[0.03, 0.06, 0.26]} r={0.01} p={[0.32, 0.12, 0]}>{M.chrome()}</RBox>
  {[-1, 1].map((k) => <mesh key={k} position={[0.322, 0.17, k * 0.09]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.022, 0.022, 0.01, 18]} />{M.glow({ col: "#fff3cf", op: 0.9 })}</mesh>)}
  {[-0.2, 0.2].map((x) => [-1, 1].map((k) => <group key={x + "" + k} position={[x, 0.07, k * 0.14]} rotation={[PI / 2, 0, 0]}>
    <mesh rotation={[0, wheel, 0]} castShadow><cylinderGeometry args={[0.065, 0.065, 0.05, 24]} /><meshStandardMaterial color="#1a1a1a" roughness={0.8} /></mesh>
    <mesh position={[0, k * 0.026, 0]} rotation={[0, wheel, 0]}><cylinderGeometry args={[0.035, 0.035, 0.004, 6]} />{M.chrome()}</mesh>
  </group>))}
</group>;

// billete viejo (verde) con su valor
export const billTex = (v: string, tint = "#c9d6b8") => tex.text("bill" + v + tint, 512, 220, (g) => {
  g.fillStyle = tint; g.fillRect(0, 0, 512, 220); g.strokeStyle = "#3f5a3a"; g.lineWidth = 8; g.strokeRect(12, 12, 488, 196);
  g.lineWidth = 2; g.strokeRect(26, 26, 460, 168);
  g.fillStyle = "#e2e8d6"; g.beginPath(); g.ellipse(256, 110, 70, 76, 0, 0, 6.3); g.fill(); g.strokeStyle = "#3f5a3a"; g.stroke();
  g.fillStyle = "#3f5a3a"; g.font = "900 64px Georgia"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(v, 70, 62); g.fillText(v, 442, 158); g.font = "700 22px Georgia"; g.fillText("THE UNITED STATES OF AMERICA", 256, 40); g.font = "900 34px Georgia"; g.fillText(v.replace("$", "") + " DOLLARS", 256, 188);
  g.fillStyle = "#5a7650"; g.beginPath(); g.arc(256, 106, 38, 0, 6.3); g.fill();
});
export const Bill: React.FC<{ v: string; p?: V; rot?: V; s?: number; tint?: string }> = ({ v, p = [0, 0, 0], rot = [-PI / 2, 0, 0], s = 1, tint }) => <mesh position={p} rotation={rot} scale={s} castShadow receiveShadow>
  <planeGeometry args={[0.156, 0.067]} /><meshStandardMaterial map={billTex(v, tint)} roughness={0.85} side={THREE.DoubleSide} />
</mesh>;

// libro de tapa dura: cuero, cantos dorados; open 0..1 abre la tapa
export const Book: React.FC<{ p?: V; ry?: number; w?: number; h?: number; th?: number; col?: string; gold?: boolean; open?: number; page?: THREE.Texture }> = ({ p = [0, 0, 0], ry = 0, w = 0.2, h = 0.27, th = 0.06, col = "#3a1d14", gold = true, open = 0, page }) => <group position={p} rotation={[0, ry, 0]}>
  <RBox s={[w, 0.008, h]} r={0.004} p={[0, 0.004, 0]}><meshStandardMaterial color={col} roughness={0.55} /></RBox>
  <mesh position={[0, th / 2, 0]} castShadow><boxGeometry args={[w - 0.012, th - 0.012, h - 0.012]} />{gold ? M.brass({ col: "#e0b45a" }) : <meshStandardMaterial color="#efe6d0" roughness={0.8} />}</mesh>
  {page && <mesh position={[0, th - 0.0055, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[w - 0.016, h - 0.016]} /><meshStandardMaterial map={page} roughness={0.8} /></mesh>}
  <RBox s={[0.012, th, h]} r={0.004} p={[-w / 2, th / 2, 0]}><meshStandardMaterial color={col} roughness={0.55} /></RBox>
  <group position={[-w / 2, th, 0]} rotation={[0, 0, PI * 0.96 * open]}>
    <RBox s={[w, 0.008, h]} r={0.004} p={[w / 2, 0.004, 0]}><meshStandardMaterial color={col} roughness={0.55} /></RBox>
    <mesh position={[w / 2, 0.0085, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.034, 32]} />{M.brass()}</mesh>
    <RBox s={[0.012, 0.0015, 0.08]} r={0.0006} p={[w / 2, 0.009, 0]}>{M.brass()}</RBox><RBox s={[0.05, 0.0015, 0.012]} r={0.0006} p={[w / 2, 0.009, 0.015]}>{M.brass()}</RBox>
  </group>
</group>;

// casita de granja en maqueta: ventanas que se prenden (lit 0..1)
export const House: React.FC<{ p?: V; ry?: number; s?: number; lit?: number; col?: string }> = ({ p = [0, 0, 0], ry = 0, s = 1, lit = 0, col = "#f1ede4" }) => <group position={p} rotation={[0, ry, 0]} scale={s}>
  <RBox s={[0.2, 0.14, 0.14]} r={0.006} p={[0, 0.07, 0]}>{M.matte({ col })}</RBox>
  <mesh position={[0, 0.17, 0]} rotation={[0, 0, PI / 4]} castShadow><boxGeometry args={[0.105, 0.105, 0.15]} /><meshStandardMaterial color="#5b3a2c" roughness={0.8} /></mesh>
  {[-0.05, 0.05].map((x) => <mesh key={x} position={[x, 0.08, 0.0705]}><planeGeometry args={[0.03, 0.04]} /><meshStandardMaterial color="#1c1814" emissive="#ffc06a" emissiveIntensity={0.1 + 2.2 * lit} toneMapped={false} /></mesh>)}
  <mesh position={[0, 0.04, 0.0705]}><planeGeometry args={[0.03, 0.06]} /><meshStandardMaterial color="#6d4a32" roughness={0.8} /></mesh>
</group>;

// muñequito de madera (clavija): la gente en las maquetas
export const Peg: React.FC<{ p?: V; s?: number; col?: string }> = ({ p = [0, 0, 0], s = 1, col = "#c99a60" }) => <group position={p} scale={s}>
  <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.012, 0.016, 0.06, 16]} /><meshStandardMaterial color={col} roughness={0.55} /></mesh>
  <mesh position={[0, 0.072, 0]} castShadow><sphereGeometry args={[0.014, 16, 12]} /><meshStandardMaterial map={tex.wood(1, 1, [206, 166, 112])} roughness={0.5} /></mesh>
</group>;

// hoja escrita a mano en renglones (lista, libreta, libro de cuentas)
export const listTex = (key: string, lines: string[], n: number, o: { bg?: string; ink?: string; w?: number; h?: number } = {}) => paperTex(key + n, [...lines.slice(0, n), ...Array(Math.max(0, lines.length - n)).fill(" ")], { w: o.w ?? 512, h: o.h ?? 640, rule: true, bg: o.bg ?? "#f3ecd8", ink: o.ink ?? "#1f2a4a", font: "italic 700" });
