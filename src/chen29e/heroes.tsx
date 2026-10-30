// chen29e · «Todo lo que Cocino con Un Pollo»: componentes 3D únicos (1 por minuto, ninguno repetido en la tanda chen29).
// Cada uno = objetos que se entienden sin leer, sobre la foto del momento desenfocada (Stage), cámara cerca, la acción repartida
// en toda la duración (D) y un momento «wow» en la palabra clave. Palabras sólo DENTRO de la escena, ≤5. Render SÓLO en el farm.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, phys, Stage } from "./ckit";
import { ctex, Estudio, fall, lathe, M, RBox, rn, V3, Vapor } from "./estudio3d";
import { Chorro, Cuchara, Llama, Mano, Olla, Onda, Plato } from "./kit3d";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;
const dur = (h: H) => Math.max(3, h.out - h.at);
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const sz = (k: number) => Math.max(0.001, k);
const FNT = `Caveat, "Segoe Script", cursive`;
const sombraTexE = () => ctex("sombraRE", 128, 128, (g) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, "rgba(0,0,0,.6)"); r.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });
const Sombra: React.FC<{ p: V3; r: number; o?: number }> = ({ p, r, o = 1 }) => <mesh position={[p[0], 0.004, p[2]]} rotation={[-P2, 0, 0]}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={sombraTexE()} transparent opacity={o} depthWrite={false} /></mesh>;
// SombraE
const esf = new THREE.SphereGeometry(1, 20, 14);
const etqTex = (txt: string, w: number, h: number, bg: string, ink: string) => ctex(`etq2:${txt}|${w}|${h}|${bg}|${ink}`, 512, Math.round(512 * h / w), (g) => {
  const W = 512, Hh = Math.round(512 * h / w); g.fillStyle = bg; g.fillRect(0, 0, W, Hh);
  for (let i = 0; i < 200; i++) { g.fillStyle = `rgba(120,90,50,${0.05 * rn(i, 7)})`; g.fillRect(rn(i, 2) * W, rn(i, 3) * Hh, 3, 3); }
  let s = Math.round(Hh * 0.78); g.font = `700 ${s}px ${FNT}`; while (g.measureText(txt).width > W * 0.88 && s > 20) { s -= 4; g.font = `700 ${s}px ${FNT}`; }
  g.fillStyle = ink; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, W / 2, Hh / 2 + s * 0.04);
});
const Etq: React.FC<{ p: V3; rot?: V3; txt: string; w?: number; h?: number; bg?: string; ink?: string; s?: number }> = ({ p, rot = [0, 0, 0], txt, w = 0.6, h = 0.26, bg = "#f1ead6", ink = "#2a1c12", s = 1 }) =>
  <mesh position={p} rotation={rot} scale={sz(s)} castShadow><planeGeometry args={[w, h]} /><meshStandardMaterial map={etqTex(txt, w, h, bg, ink)} roughness={0.9} side={THREE.DoubleSide} /></mesh>;
const fadeTex = () => ctex("fadeE", 256, 256, (g) => { const r = g.createRadialGradient(128, 128, 40, 128, 128, 128); r.addColorStop(0, "#fff"); r.addColorStop(1, "#000"); g.fillStyle = r; g.fillRect(0, 0, 256, 256); });
const Suelo: React.FC<{ c?: string }> = ({ c = "#6a4428" }) => <mesh rotation={[-P2, 0, 0]} position={[0, -0.002, 0]} receiveShadow><circleGeometry args={[2.4, 64]} /><meshStandardMaterial color={c} alphaMap={fadeTex()} transparent depthWrite={false} roughness={0.85} /></mesh>;
const Lumbre: React.FC<{ p: V3; t: number; s?: number }> = ({ p, t, s = 1 }) => <group position={p} scale={s}>
  {Array.from({ length: 9 }, (_, i) => { const a = i * 0.7, r = 0.1 + 0.2 * rn(i, 1), hh = 0.13 + 0.04 * Math.sin(t * 6 + i * 2); return <mesh key={i} position={[Math.cos(a) * r, hh / 2, Math.sin(a) * r]}><coneGeometry args={[0.055, hh, 10]} /><meshBasicMaterial color={i % 2 ? "#ff8a2a" : "#ffc04a"} transparent opacity={0.85} toneMapped={false} /></mesh>; })}
  <pointLight position={[0, 0.2, 0]} intensity={1.2} distance={1.5} color="#ff9a40" /></group>;

// ── el pollo y sus piezas ──
const CRUDO = "#f0cdb6", DORADO = "#c9873e";
const drumGeo = lathe([[0, 0], [0.09, 0.02], [0.115, 0.12], [0.085, 0.25], [0.036, 0.32], [0.03, 0.4], [0.048, 0.425], [0.001, 0.45]], 24);
const Pierna: React.FC<{ p?: V3; rot?: V3; c?: string; s?: number }> = ({ p, rot, c = CRUDO, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh geometry={drumGeo} castShadow><meshPhysicalMaterial color={c} roughness={0.45} clearcoat={0.4} /></mesh>
  <mesh position={[0, 0.43, 0]} scale={0.04} geometry={esf}><meshStandardMaterial color="#efe6d2" roughness={0.6} /></mesh></group>;
const Ala: React.FC<{ p?: V3; rot?: V3; c?: string; s?: number }> = ({ p, rot, c = CRUDO, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0, 0]} scale={[0.12, 0.05, 0.07]} geometry={esf} castShadow><meshPhysicalMaterial color={c} roughness={0.45} clearcoat={0.4} /></mesh>
  <mesh position={[0.17, 0, 0.03]} rotation={[0, -0.6, 0]} scale={[0.1, 0.04, 0.055]} geometry={esf} castShadow><meshPhysicalMaterial color={c} roughness={0.45} clearcoat={0.4} /></mesh>
  <mesh position={[0.28, 0, 0.1]} rotation={[0, -1.1, 0]} scale={[0.06, 0.025, 0.04]} geometry={esf}><meshPhysicalMaterial color={c} roughness={0.45} clearcoat={0.4} /></mesh></group>;
const Pechuga: React.FC<{ p?: V3; rot?: V3; c?: string; s?: number }> = ({ p, rot, c = "#f3c9bb", s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh scale={[0.2, 0.07, 0.12]} geometry={esf} castShadow><meshPhysicalMaterial color={c} roughness={0.4} clearcoat={0.5} /></mesh></group>;
const Hueso: React.FC<{ p?: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.022, 0.022, 0.3, 10]} /><meshStandardMaterial color="#eee4cc" roughness={0.6} /></mesh>
  {[-1, 1].map((sd) => [-1, 1].map((k) => <mesh key={sd + "" + k} position={[sd * 0.16, 0, k * 0.02]} scale={0.032} geometry={esf}><meshStandardMaterial color="#eee4cc" roughness={0.6} /></mesh>))}</group>;
const Espinazo: React.FC<{ p?: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  {Array.from({ length: 7 }, (_, i) => <RBox key={i} p={[-0.27 + i * 0.09, 0, 0]} s={[0.075, 0.06, 0.12 - Math.abs(i - 3) * 0.01]} r={0.02}><meshStandardMaterial color={i % 2 ? "#d9a99a" : "#e8c0b0"} roughness={0.55} /></RBox>)}</group>;
const pielGeo = (() => { const g = new THREE.PlaneGeometry(0.22, 0.16, 8, 6); const a = g.attributes.position as THREE.BufferAttribute; for (let i = 0; i < a.count; i++) a.setZ(i, 0.015 * Math.sin(a.getX(i) * 40) * Math.cos(a.getY(i) * 30)); g.computeVertexNormals(); return g; })();
const Piel: React.FC<{ p?: V3; rot?: V3; c?: string; s?: number }> = ({ p, rot, c = "#f4dcc0", s = 1 }) => <mesh position={p} rotation={rot} scale={s} geometry={pielGeo} castShadow><meshPhysicalMaterial color={c} roughness={0.4} clearcoat={0.5} side={THREE.DoubleSide} /></mesh>;
// pollo entero crudo (pechuga arriba, patas hacia +x)
const Pollo: React.FC<{ p?: V3; rot?: V3; s?: number; c?: string }> = ({ p, rot, s = 1, c = CRUDO }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.17, 0]} scale={[0.36, 0.2, 0.27]} geometry={esf} castShadow receiveShadow><meshPhysicalMaterial color={c} roughness={0.42} clearcoat={0.5} /></mesh>
  {[-1, 1].map((sd) => <mesh key={sd} position={[-0.04, 0.26, sd * 0.1]} scale={[0.26, 0.13, 0.12]} geometry={esf} castShadow><meshPhysicalMaterial color={c} roughness={0.42} clearcoat={0.5} /></mesh>)}
  {[-1, 1].map((sd) => <Pierna key={"p" + sd} p={[0.2, 0.17, sd * 0.17]} rot={[sd * 0.25, 0, -P2 * 0.72]} c={c} s={0.85} />)}
  {[-1, 1].map((sd) => <Ala key={"a" + sd} p={[-0.2, 0.17, sd * 0.25]} rot={[0, sd * 0.5 + (sd < 0 ? P : 0), 0.2]} c={c} s={0.8} />)}
</group>;
// refri abierto (la puerta abierta a la izquierda); interior hacia +z
const Refri: React.FC<{ p?: V3; s?: number; abre?: number; children?: React.ReactNode; luz?: number }> = ({ p, s = 1, abre = 1, children, luz = 1 }) => <group position={p} scale={s}>
  <RBox p={[0, 0.9, -0.42]} s={[0.9, 1.8, 0.06]} r={0.02}><meshStandardMaterial color="#3e4a50" roughness={0.6} /></RBox>
  {[-1, 1].map((sd) => <RBox key={sd} p={[sd * 0.43, 0.9, -0.1]} s={[0.05, 1.8, 0.7]} r={0.02}><meshPhysicalMaterial color="#f2f3f0" roughness={0.3} clearcoat={0.6} /></RBox>)}
  <RBox p={[0, 1.78, -0.1]} s={[0.9, 0.05, 0.7]} r={0.02}><meshPhysicalMaterial color="#f2f3f0" roughness={0.3} clearcoat={0.6} /></RBox>
  <RBox p={[0, 0.03, -0.1]} s={[0.9, 0.06, 0.7]} r={0.02}><meshPhysicalMaterial color="#f2f3f0" roughness={0.3} clearcoat={0.6} /></RBox>
  {[0.45, 0.9, 1.35].map((y) => <mesh key={y} position={[0, y, -0.1]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.8, 0.62]} /><meshPhysicalMaterial color="#e8f2f4" transparent opacity={0.45} roughness={0.05} side={THREE.DoubleSide} /></mesh>)}
  <group position={[-0.45, 0.9, 0.25]} rotation={[0, -abre * 1.75, 0]}><RBox p={[0.45, 0, 0.03]} s={[0.9, 1.78, 0.07]} r={0.03}><meshPhysicalMaterial color="#f4f5f2" roughness={0.3} clearcoat={0.6} /></RBox>
    <RBox p={[0.82, 0.25, 0.09]} s={[0.04, 0.5, 0.04]} r={0.015}>{M.cromo()}</RBox></group>
  <pointLight position={[0, 1.6, 0.1]} intensity={0.01 + 1.8 * luz} distance={2.4} color="#ffe2b0" />
  {children}
</group>;
const Frasco: React.FC<{ p?: V3; s?: number; nivel?: number; c?: string; tapa?: number; brillo?: number; children?: React.ReactNode }> = ({ p, s = 1, nivel = 0, c = "#e0a83a", tapa = 1, brillo = 0, children }) => <group position={p} scale={s}>
  <mesh geometry={lathe([[0, 0], [0.13, 0], [0.14, 0.03], [0.14, 0.3], [0.11, 0.34], [0.11, 0.37]])} castShadow>{M.vidrio()}</mesh>
  {nivel > 0.01 && <mesh position={[0, 0.015 + 0.15 * nivel, 0]}><cylinderGeometry args={[0.13, 0.13, 0.3 * nivel, 28]} /><meshPhysicalMaterial color={c} roughness={0.1} transparent opacity={0.85} emissive={c} emissiveIntensity={0.05 + 0.6 * brillo} /></mesh>}
  <mesh position={[0, 0.37 + (1 - tapa) * 0.35, 0]} rotation={[0, 0, (1 - tapa) * 0.6]}><cylinderGeometry args={[0.12, 0.12, 0.04, 28]} /><meshStandardMaterial color="#c8a040" metalness={0.7} roughness={0.3} /></mesh>
  {children}
</group>;
const Tazon: React.FC<{ p?: V3; s?: number; c?: string; liq?: string; children?: React.ReactNode }> = ({ p, s = 1, c = "#9a4a26", liq, children }) => <group position={p} scale={s}>
  <mesh geometry={lathe([[0, 0], [0.12, 0], [0.2, 0.08], [0.23, 0.16], [0.24, 0.17]])} castShadow receiveShadow>{M.barro(c)}</mesh>
  {liq && <mesh position={[0, 0.13, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.21, 28]} /><meshPhysicalMaterial color={liq} roughness={0.15} clearcoat={0.8} /></mesh>}{children}</group>;
const Bacterias: React.FC<{ n: number; t: number; r?: number; y?: number; c?: string }> = ({ n, t, r = 0.3, y = 0.3, c = "#6ee05a" }) => <>
  {Array.from({ length: n }, (_, i) => { const a = rn(i, 1) * 6.28, e = rn(i, 2) * 1.2; return <mesh key={i} position={[Math.cos(a) * r * Math.cos(e), y + Math.sin(e) * r * 0.6, Math.sin(a) * r * Math.cos(e)]} scale={0.032 + 0.01 * Math.sin(t * 5 + i)} geometry={esf}><meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.9} /></mesh>; })}</>;

// costillar del pollo: espinazo con arcos de costilla (lo que queda después de comérselo)
const Costillar: React.FC<{ p?: V3; s?: number }> = ({ p, s = 1 }) => <group position={p} scale={s}>
  <mesh rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.03, 0.026, 0.5, 12]} /><meshStandardMaterial color="#e9dcc0" roughness={0.6} /></mesh>
  {Array.from({ length: 7 }, (_, i) => <group key={i} position={[-0.2 + i * 0.066, 0, 0]}>{[-1, 1].map((sd) => <mesh key={sd} position={[0, 0.0, 0]} rotation={[sd * 0.2, sd > 0 ? 0 : P, 0]} castShadow><torusGeometry args={[0.1 - Math.abs(i - 3) * 0.008, 0.011, 6, 16, P * 0.85]} /><meshStandardMaterial color="#efe3c8" roughness={0.55} /></mesh>)}</group>)}
</group>;
const fibraPechTex = () => ctex("fibraPech", 256, 128, (g) => { g.fillStyle = "#e2c49a"; g.fillRect(0, 0, 256, 128); for (let i = 0; i < 90; i++) { g.strokeStyle = i % 3 ? "rgba(170,120,70,.45)" : "rgba(250,232,200,.6)"; g.lineWidth = 1 + (i % 2); g.beginPath(); const y = (i * 1.43) % 128; g.moveTo(0, y); for (let x = 0; x <= 256; x += 16) g.lineTo(x, y + Math.sin(x / 30 + i) * 2.5); g.stroke(); } });
const hebraGeos = Array.from({ length: 12 }, (_, j) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-0.07, 0, 0), new THREE.Vector3(-0.025, 0.012 + 0.012 * Math.sin(j), 0.02 * Math.cos(j * 2)), new THREE.Vector3(0.025, -0.008, -0.018 * Math.sin(j * 3)), new THREE.Vector3(0.07, 0.01 * Math.cos(j), 0.01)]), 12, 0.0085 - (j % 3) * 0.0012, 5, false));
const alaCubTex = () => ctex("alaCub", 128, 128, (g) => { g.fillStyle = "#a8200f"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 70; i++) { g.fillStyle = i % 3 ? "rgba(70,10,5,.45)" : "rgba(255,120,60,.5)"; g.beginPath(); g.arc((i * 37) % 128, (i * 53) % 128, 1.5 + (i % 4), 0, 7); g.fill(); } });
// ── 1 · EL REFRI VACÍO (0:10): el refri abierto con un pollo entero; pasan lunes, martes, miércoles: el pollo se achica, quedan los huesos y luego nada
const H1Refri: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const D = dur(h), abre = phys(tt, 0.05, 3.5, 0.5), luz = eio(tt, 0.15, 0.5), q1 = eio(tt, 0.22 * D, 0.32 * D), q2 = eio(tt, 0.34 * D, 0.44 * D), hueso = eio(tt, 0.48 * D, 0.58 * D), nada = eio(tt, 0.72 * D, 0.84 * D);
  const dia = tt < 0.33 * D ? "lunes" : tt < 0.62 * D ? "martes" : "miércoles";
  return <Estudio t={tt} cam={[0.1, 1.05, 1.6]} look={[0, 0.92, -0.1]} orbit={0.06} mesa={false}>
    <Refri abre={cl(abre)} luz={luz}>
      <mesh position={[0, 0.9, -0.38]}><planeGeometry args={[0.8, 1.7]} /><meshStandardMaterial color="#20262a" emissive="#ffcf8a" emissiveIntensity={0.12 * luz} /></mesh>
      <Plato p={[0, 0.92, -0.1]} s={0.6} c="#f1ece0" />
      {hueso < 1 && <group position={[0, 0.94, -0.1]} scale={sz(0.75 * (1 - hueso))}>
        <mesh position={[0, 0.17, 0]} scale={[0.36, 0.2, 0.27]} geometry={esf} castShadow><meshPhysicalMaterial color={DORADO} roughness={0.35} clearcoat={0.8} /></mesh>
        {[-1, 1].map((sd) => <Pierna key={"p" + sd} p={[0.2, 0.17, sd * 0.17]} rot={[sd * 0.25, 0, -P2 * 0.72]} c={DORADO} s={sz(0.85 * (1 - q1))} />)}
        {[-1, 1].map((sd) => <Ala key={"a" + sd} p={[-0.2, 0.17, sd * 0.25]} rot={[0, sd * 0.5 + (sd < 0 ? P : 0), 0.2]} c={DORADO} s={sz(0.8 * (1 - q2))} />)}
      </group>}
      <group visible={hueso > 0.01}><Costillar p={[0, 1.0, -0.1]} s={sz(1.3 * hueso * (1 - nada))} /></group>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.3, 0.935, -0.1 + (rn(i, 2) - 0.5) * 0.25]} scale={sz(0.012 * nada)} geometry={esf}><meshStandardMaterial color="#c9a070" roughness={0.8} /></mesh>)}
    </Refri>
    <Etq p={[-0.62, 1.62, 0.55]} rot={[0, 0.7, 0]} txt={dia} w={0.5} h={0.2} bg={dia === "miércoles" ? "#e9d9b0" : "#f1ead6"} ink={dia === "miércoles" ? "#a0201a" : "#2a1c12"} s={phys(tt, 0.4, 6, 0.5)} />
  </Estudio>;
}}</Stage>;

// ── 2 · SIETE COMIDAS (0:35): un solo pollo al centro de la tabla y alrededor se encienden siete platos, uno por día, cada uno con su comida
const MiniComida: React.FC<{ i: number }> = ({ i }) => {
  if (i === 0) return <Tazon s={0.55} liq="#d9a440"><mesh position={[0.05, 0.14, 0]} scale={[0.06, 0.03, 0.04]} geometry={esf}><meshStandardMaterial color="#e68a2e" /></mesh></Tazon>;
  if (i === 1) return <>{[0, 1, 2].map((k) => <group key={k} position={[(k - 1) * 0.1, 0.02 + k * 0.004, 0]}><mesh><cylinderGeometry args={[0.07, 0.07, 0.012, 20]} /><meshStandardMaterial color="#d8a85a" /></mesh><mesh position={[0, 0.012, 0]} scale={[0.05, 0.01, 0.05]} geometry={esf}><meshStandardMaterial color="#c4522a" /></mesh></group>)}</>;
  if (i === 2) return <>{[0, 1, 2].map((k) => <mesh key={k} position={[0, 0.035, (k - 1) * 0.07]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.03, 0.03, 0.22, 14]} /><meshStandardMaterial color="#b8321e" roughness={0.4} /></mesh>)}</>;
  if (i === 3) return <><mesh position={[0, 0.02, 0]} scale={[0.13, 0.06, 0.13]} geometry={esf}><meshStandardMaterial color="#e2b25a" roughness={0.8} /></mesh><mesh position={[0, 0.07, 0]} scale={[0.05, 0.012, 0.05]} geometry={esf}><meshStandardMaterial color="#ffffff" /></mesh><mesh position={[0, 0.08, 0]} scale={0.022} geometry={esf}><meshStandardMaterial color="#f4b400" /></mesh></>;
  if (i === 4) return <>{[-1, 1].map((k) => <mesh key={k} position={[k * 0.05, 0.03, 0]} rotation={[0, 0, P2 + k * 0.2]} scale={[1, 1, 0.7]}><cylinderGeometry args={[0.035, 0.045, 0.2, 12]} /><meshStandardMaterial color="#e8d49a" roughness={0.8} /></mesh>)}</>;
  if (i === 5) return <>{[0, 1, 2].map((k) => <Ala key={k} p={[(k - 1) * 0.08, 0.03, (k % 2) * 0.05]} rot={[0, k, 0]} c="#b8321e" s={0.5} />)}</>;
  return <Tazon s={0.55} liq="#c8642a">{[0, 1, 2, 3].map((k) => <mesh key={k} position={[(rn(k, 3) - 0.5) * 0.2, 0.135, (rn(k, 4) - 0.5) * 0.2]} rotation={[-P2, 0, k]}><torusGeometry args={[0.03, 0.004, 6, 12]} /><meshStandardMaterial color="#f0d080" /></mesh>)}</Tazon>;
};
const DIA7 = ["L", "M", "M", "J", "V", "S", "D"];
const H2Siete: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const D = dur(h), st = Math.min(0.7, (D * 0.68) / 7);
  return <Estudio t={tt} cam={[0, 2.4, 2.25]} look={[0, 0.0, -0.05]} orbit={0.12}>
    <RBox p={[0, 0.02, 0]} s={[0.8, 0.04, 0.55]} r={0.02}>{M.madera("#8a5a32")}</RBox>
    <Pollo p={[0, 0.04, 0]} s={0.8 * phys(tt, 0.1, 6, 0.5)} />
    {DIA7.map((d, i) => { const a = -P * 0.92 + i * (P * 1.84 / 6), x = Math.sin(a) * 1.15, z = -Math.cos(a) * 0.7 + 0.05, k = phys(tt, 0.25 + i * st, 6, 0.5);
      const viaje = eio(tt, 0.2 + i * st, 0.35 + i * st + 0.1);
      return <group key={i}>
        {viaje > 0 && viaje < 1 && <mesh position={[lerp(0, x, viaje), 0.25 + Math.sin(viaje * P) * 0.35, lerp(0, z, viaje)]} scale={0.035} geometry={esf}><meshBasicMaterial color="#ffcf6a" toneMapped={false} /></mesh>}
        <group position={[x, 0, z]} scale={sz(k)}><Plato s={0.42} c="#efe7d6" /><group position={[0, 0.03, 0]}><MiniComida i={i} /></group>
          </group>
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 3 · DE LA BASURA A LA OLLA (0:59): el bote de basura escupe huesos y cáscaras en arco a la olla de barro; el caldo sube y se pone dorado
const Bote: React.FC<{ p: V3; tapa: number }> = ({ p, tapa }) => <group position={p}>
  <mesh position={[0, 0.32, 0]} castShadow><cylinderGeometry args={[0.28, 0.24, 0.64, 32]} /><meshStandardMaterial color="#3d5a3a" roughness={0.5} metalness={0.3} /></mesh>
  {[0.15, 0.32, 0.49].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.265, 0.008, 6, 40]} /><meshStandardMaterial color="#2c4429" /></mesh>)}
  <group position={[-0.28, 0.65, 0]} rotation={[0, 0, tapa * 1.9]}><mesh position={[0.28, 0.02, 0]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.04, 32]} /><meshStandardMaterial color="#456a42" roughness={0.5} metalness={0.3} /></mesh></group>
</group>;
const H3Basura: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const D = dur(h), tapa = phys(tt, 0.0, 6, 0.45), lv = 0.15 + 0.6 * eio(tt, 0.4, 0.78 * D), oro = eio(tt, 0.45 * D, 0.85 * D);
  const N = 12, s0 = 0.15, s1 = Math.max(s0 + 1, 0.72 * D);
  return <Estudio t={tt} cam={[0, 1.25, 2.6]} look={[0.05, 0.4, 0]} orbit={0.1}>
    <Bote p={[-0.75, 0, 0]} tapa={cl(tapa)} />
    <Olla p={[0.6, 0, 0]} mat="barro" nivel={lv} caldo={col("#8aa0a8", "#e0a238", oro)} hervor={0.3 + 0.5 * oro} t={tt} s={0.62} />
    {Array.from({ length: N }, (_, i) => { const a = s0 + (i / N) * (s1 - s0), k = eio(tt, a, a + 0.55); if (k <= 0 || k >= 1) return null;
      const pp: V3 = [lerp(-0.75, 0.6, k), 0.7 + Math.sin(k * P) * 0.6, lerp(0, 0, k)], r: V3 = [k * 6, i, k * 4];
      return i % 3 === 0 ? <Hueso key={i} p={pp} rot={r} s={1.4} /> : i % 3 === 1 ? <mesh key={i} position={pp} rotation={r} scale={[0.2, 0.02, 0.05]} geometry={esf}><meshStandardMaterial color="#e8892a" roughness={0.6} /></mesh>
        : <mesh key={i} position={pp} rotation={r} scale={[0.09, 0.13, 0.09]} geometry={esf}><meshStandardMaterial color="#c88a4a" roughness={0.5} /></mesh>; })}
    <Vapor t={tt} p={[0.6, 0.55, 0]} o={0.45 * oro} h={0.9} s={0.25} />
    <pointLight position={[0.6, 0.9, 0.4]} intensity={0.01 + 1.4 * oro} distance={2} color="#ffbf5a" />
    
  </Estudio>;
}}</Stage>;

// ── 4 · LA BÁSCULA DEL POLLERO (2:21): la báscula de reloj colgada; el pollo cae al plato, el plato baja con resorte y la aguja se mece hasta 2 kilos
const romanaTex = () => ctex("romana", 512, 512, (g) => { g.fillStyle = "#f6f2e8"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill();
  g.strokeStyle = "#222"; g.lineWidth = 5; g.fillStyle = "#222"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 64px Montserrat, Arial";
  for (let i = 0; i <= 25; i++) { const a = -P2 + (i / 25) * P * 1.8 - P * 0.9 + P2, L = i % 5 ? 18 : 36; g.beginPath(); g.moveTo(256 + Math.cos(a) * 225, 256 + Math.sin(a) * 225); g.lineTo(256 + Math.cos(a) * (225 - L), 256 + Math.sin(a) * (225 - L)); g.stroke();
    if (i % 5 === 0) g.fillText(String(i / 5), 256 + Math.cos(a) * 160, 256 + Math.sin(a) * 160); }
  g.font = "700 40px Montserrat, Arial"; g.fillText("kg", 256, 360); });
const H4Pollero: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const D = dur(h), cae = 0.2, land = cae + 0.45, y = fall(tt, cae, 0.9);
  const rs = tt > land ? 1 - Math.exp(-(tt - land) * 2.4) * Math.cos((tt - land) * 9) : 0;
  const ang = -P * 0.9 + (2 / 5) * P * 1.8 * rs, baja = 0.12 * rs, tag = phys(tt, 0.6 * D, 5, 0.35);
  return <Estudio t={tt} cam={[0, 1.3, 2.95]} look={[0, 1.2, 0]} orbit={0.08} mesa={false}>
    <mesh position={[0, 2.1, -0.1]}><cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />{M.hierro()}</mesh>
    <group position={[0, 1.55, 0]}>
      <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.32, 0.32, 0.1, 40]} /><meshStandardMaterial color="#c23a2a" roughness={0.4} metalness={0.3} /></mesh>
      <mesh position={[0, 0, 0.052]}><circleGeometry args={[0.28, 40]} /><meshStandardMaterial map={romanaTex()} /></mesh>
      <group position={[0, 0, 0.058]} rotation={[0, 0, -ang - P2]}><mesh position={[0, 0.11, 0]}><planeGeometry args={[0.014, 0.23]} /><meshBasicMaterial color="#111" side={THREE.DoubleSide} /></mesh></group>
      <mesh position={[0, 0, 0.06]} scale={0.02} geometry={esf}><meshStandardMaterial color="#111" /></mesh>
    </group>
    <group position={[0, -baja, 0]}>
      {[0, 1, 2].map((i) => { const a = i * 2.094; return <mesh key={i} position={[Math.cos(a) * 0.17, 1.0, Math.sin(a) * 0.17]} rotation={[Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3]}><cylinderGeometry args={[0.005, 0.005, 0.56, 4]} />{M.cromo()}</mesh>; })}
      <mesh position={[0, 0.72, 0]} geometry={lathe([[0, 0], [0.35, 0.02], [0.42, 0.09]])} castShadow receiveShadow>{M.cromo("#c8ccd0")}</mesh>
      <Pollo p={[0, 0.74 + y, 0]} s={0.8} />
    </group>
    <group position={[0.42, 1.3, 0.05]} rotation={[0, 0, 0.3 * Math.sin(tt * 3) * Math.exp(-Math.max(0, tt - 0.6 * D) * 1.5)]}>
      <mesh position={[0, -0.12 * cl(tag), 0]}><cylinderGeometry args={[0.003, 0.003, 0.24 * cl(tag) + 0.001, 4]} /><meshBasicMaterial color="#555" /></mesh>
      </group>
    
  </Estudio>;
}}</Stage>;

// ── 5 · DEL TIANGUIS AL REFRI (3:09): el pollo en la bolsa sobre la mesa; el reloj corre y le brotan bichitos verdes; entra a la hielera con hielo y se apagan
const relojTex = () => ctex("reloj29e", 256, 256, (g) => { g.fillStyle = "#faf6ec"; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill(); g.fillStyle = "#222"; for (let i = 0; i < 12; i++) { const a = i * P / 6; g.fillRect(126 + Math.cos(a) * 100, 124 + Math.sin(a) * 100, 6, 8); } });
const H5Hielera: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const D = dur(h), agarra = eio(tt, 0.38 * D, 0.46 * D), mete = eio(tt, 0.46 * D, 0.66 * D), suelta = eio(tt, 0.66 * D, 0.7 * D), tapa = phys(tt, 0.74 * D, 6, 0.45), frio = eio(tt, 0.66 * D, 0.82 * D);
  const corre = Math.min(tt, 0.66 * D), bichos = cl(tt / 0.4) * (1 - frio);
  const pp: V3 = [lerp(-0.42, 0.42, mete), 0.06 + Math.sin(mete * P) * 0.5 - 0.06 * mete, lerp(0.05, 0.0, mete)];
  const mano: V3 = [pp[0] + 0.02, pp[1] + 0.42 + (1 - agarra) * 0.35 + suelta * 0.3, pp[2] - 0.05];
  return <Estudio t={tt} cam={[0, 1.15, 2.15]} look={[0, 0.38, 0]} orbit={0.06}>
    <group position={[-0.05, 0.62, -0.55]}>
      <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.06, 48]} /><meshStandardMaterial color="#a0201a" roughness={0.4} metalness={0.3} /></mesh>
      <mesh position={[0, 0, 0.032]}><circleGeometry args={[0.27, 48]} /><meshStandardMaterial map={relojTex()} /></mesh>
      <group position={[0, 0, 0.036]} rotation={[0, 0, -corre * 2.4]}><mesh position={[0, 0.1, 0]}><planeGeometry args={[0.014, 0.21]} /><meshBasicMaterial color="#111" /></mesh></group>
      <group position={[0, 0, 0.038]} rotation={[0, 0, -corre * 0.2]}><mesh position={[0, 0.065, 0]}><planeGeometry args={[0.024, 0.14]} /><meshBasicMaterial color="#111" /></mesh></group>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.2, 0.3, 0]}><sphereGeometry args={[0.07, 20, 12]} />{M.cromo("#c9a24a")}</mesh>)}
      <mesh position={[0, -0.36, -0.02]}><cylinderGeometry args={[0.02, 0.03, 0.42, 10]} />{M.cromo("#9a9da2")}</mesh>
    </group>
    <group position={pp} rotation={[0, mete * 0.5, 0]}>
      <Pollo s={0.7} c={col(CRUDO, "#d9b49a", cl(tt / (0.4 * D)) * (1 - frio))} />
      <group visible={bichos > 0.02}><group scale={sz(0.4 + 0.6 * bichos)}><Bacterias n={16} t={tt} r={0.27} y={0.15} /></group></group>
    </group>
    <Mano p={mano} rot={[P2 * 0.9, 0, 0]} pinza={agarra * (1 - suelta)} s={0.75} />
    <group position={[0.42, 0, 0]}>
      <RBox p={[0, 0.2, 0]} s={[0.78, 0.4, 0.56]} r={0.04}><meshStandardMaterial color="#f6f6f2" roughness={0.7} /></RBox>
      <mesh position={[0, 0.39, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.7, 0.48]} /><meshStandardMaterial color="#cfe6f2" roughness={0.3} /></mesh>
      {Array.from({ length: 14 }, (_, i) => <RBox key={i} p={[(rn(i, 1) - 0.5) * 0.6, 0.4, (rn(i, 2) - 0.5) * 0.38]} s={[0.1, 0.08, 0.1]} r={0.025} rot={[rn(i, 3), rn(i, 4), 0]}><meshPhysicalMaterial color="#eaf8ff" transmission={0.5} roughness={0.08} transparent opacity={0.85} /></RBox>)}
      <group position={[0, 0.41, -0.28]} rotation={[-(1 - cl(tapa)) * 1.75, 0, 0]}><RBox p={[0, 0.03, 0.28]} s={[0.8, 0.06, 0.58]} r={0.04}><meshStandardMaterial color="#3a7ac0" roughness={0.6} /></RBox></group>
      <Vapor t={tt} p={[0, 0.42, 0.05]} n={10} h={0.5} o={0.35 * (1 - cl(tapa))} s={0.22} spread={0.5} />
      <Sombra p={[0, 0, 0]} r={0.55} o={0.55} />
    </group>
    <Sombra p={[pp[0], 0, pp[2]]} r={0.32} o={0.5} />
  </Estudio>;
}}</Stage>;

// ── 6 · EL AGUA SALPICA (4:01): el pollo en la tarja bajo el chorro; las gotitas verdes vuelan en arco y manchan los platos, el trapo y la taza
const H6Salpica: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const D = dur(h), on = eio(tt, 0.0, 0.3) * (1 - eio(tt, 0.85 * D, 0.92 * D)), mancha = (i: number) => eio(tt, 0.35 + i * 0.35, 1.3 + i * 0.35 + 0.4 * D);
  const blancos: { p: V3; r: number }[] = [{ p: [0.95, 0.42, -0.25], r: 0.09 }, { p: [-0.95, 0.12, 0.25], r: 0.12 }, { p: [0.75, 0.13, 0.45], r: 0.07 }, { p: [-0.7, 0.13, -0.35], r: 0.08 }, { p: [1.05, 0.3, -0.25], r: 0.08 }];
  return <Estudio t={tt} cam={[0, 1.55, 2.2]} look={[0, 0.25, 0]} orbit={0.08} mesa={false}>
    <RBox p={[0, -0.02, 0]} s={[3.2, 0.08, 1.6]} r={0.02}><meshStandardMaterial color="#c9c3b6" roughness={0.6} /></RBox>
    <group position={[0, 0, 0]}>{[[0, -0.18, 0, 1.0, 0.04, 0.7], [0, 0, -0.35, 1.0, 0.36, 0.04], [0, 0, 0.35, 1.0, 0.36, 0.04], [-0.5, 0, 0, 0.04, 0.36, 0.7], [0.5, 0, 0, 0.04, 0.36, 0.7]].map((b, i) => <RBox key={i} p={[b[0], b[1], b[2]]} s={[b[3], b[4], b[5]]} r={0.01}>{M.cromo("#b8bcc2")}</RBox>)}</group>
    <Pollo p={[0, -0.16, 0]} s={0.62} />
    <group position={[0, 0.2, -0.45]}><mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.03, 0.03, 0.5, 12]} />{M.cromo()}</mesh>
      <mesh position={[0, 0.5, 0.15]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.32, 12]} />{M.cromo()}</mesh></group>
    {on > 0.02 && <Chorro a={[0, 0.69, -0.14]} b={[0, 0.0, -0.05]} r={0.055 * on} c="#bfe0f0" o={0.85} />}
    {Array.from({ length: 26 }, (_, i) => { const tg = blancos[i % 5], u = (tt * 1.1 + i / 26) % 1; if (on < 0.05) return null;
      return <mesh key={i} position={[lerp(0, tg.p[0], u), lerp(0.05, tg.p[1], u) + Math.sin(u * P) * 0.5, lerp(-0.05, tg.p[2], u)]} scale={0.034 * on} geometry={esf}><meshStandardMaterial color="#9ee07a" emissive="#6ec04a" emissiveIntensity={0.4} transparent opacity={0.85} /></mesh>; })}
    <group position={[1.0, 0.04, -0.25]}>{[0, 1, 2].map((i) => <mesh key={i} position={[(i - 1) * 0.07, 0.2, 0]} rotation={[0, P2, 0.1]}><cylinderGeometry args={[0.2, 0.2, 0.015, 32]} /><meshStandardMaterial color="#f4f2ec" roughness={0.3} /></mesh>)}
      <RBox p={[0, 0.02, 0]} s={[0.32, 0.04, 0.3]} r={0.01}>{M.cromo()}</RBox></group>
    <mesh position={[-0.95, 0.03, 0.25]} rotation={[-P2, 0, 0.2]}><planeGeometry args={[0.45, 0.3]} /><meshStandardMaterial color="#d8c8a0" roughness={1} /></mesh>
    <group position={[0.75, 0.02, 0.45]}><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.07, 0.06, 0.14, 20]} /><meshStandardMaterial color="#e8e2d0" roughness={0.4} /></mesh></group>
    {blancos.map((b, i) => <mesh key={"m" + i} position={[b.p[0], b.p[1] + 0.012, b.p[2]]} rotation={[-P2, 0, 0]} scale={sz(1.6 * b.r * mancha(i))}><circleGeometry args={[1, 18]} /><meshBasicMaterial color="#5ab83a" transparent opacity={0.9} /></mesh>)}
  </Estudio>;
}}</Stage>;

// ── 7 · OCHO PARTES (4:31): el pollo entero en la tabla se abre como flor y cada pieza va a su lugar: dos piernas, dos alas, dos pechugas, espinazo y piel
const H7Ocho: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const D = dur(h), abre = (i: number) => phys(tt, 0.3 + i * 0.2, 5.5, 0.55), entero = 1 - eio(tt, 0.2, 0.5);
  const ring = (i: number): V3 => { const a = -P * 0.85 + i * (P * 1.7 / 7); return [Math.sin(a) * 0.95, 0.06, -Math.cos(a) * 0.55 + 0.2]; };
  const NOM = ["pierna", "ala", "pechuga", "espinazo", "piel", "pechuga", "ala", "pierna"];
  const pieza = (i: number) => { const n = NOM[i]; return n === "pierna" ? <Pierna rot={[0, 0, P2]} s={0.75} /> : n === "ala" ? <Ala s={0.8} /> : n === "pechuga" ? <Pechuga s={1.0} /> : n === "espinazo" ? <Espinazo s={0.7} /> : <Piel rot={[-P2, 0, 0]} s={1.4} />; };
  return <Estudio t={tt} cam={[0, 2.5, 2.2]} look={[0, 0.05, 0.0]} orbit={0.1}>
    <RBox p={[0, 0.02, 0.1]} s={[2.6, 0.04, 1.4]} r={0.03}>{M.madera("#9a6a3c")}</RBox>
    <Pollo p={[0, 0.04, 0]} s={sz(0.85 * entero)} />
    {NOM.map((n, i) => { const k = abre(i), q = ring(i); return <group key={i}>
      <group position={[q[0] * k, 0.06 + Math.sin(cl(k) * P) * 0.3, q[2] * k]} scale={sz(1.45 * Math.min(1, k * 1.5))}>{pieza(i)}</group></group>; })}
    
  </Estudio>;
}}</Stage>;

// ── 8 · LA PIEL ES ORO (5:04): los pedazos de piel caen uno por uno al frasco; el frasco se enciende dorado como un tesoro y la tapa se cierra
const H8Piel: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const D = dur(h), n = 9, st = (0.6 * D) / n, oro = eio(tt, 0.55 * D, 0.8 * D), tapa = phys(tt, 0.82 * D, 6, 0.45);
  return <Estudio t={tt} cam={[0, 0.95, 1.9]} look={[0, 0.55, 0]} orbit={0.1}>
    <group scale={2.2}><Frasco tapa={cl(tapa)} nivel={0} brillo={oro}>
      {Array.from({ length: n }, (_, i) => { const a = 0.05 + i * st; if (tt < a) return null; const y = Math.max(0.03 + i * 0.03, 0.6 - 4.9 * (tt - a) ** 2 * 0.25);
        return <Piel key={i} p={[(rn(i, 1) - 0.5) * 0.1, y, (rn(i, 2) - 0.5) * 0.1]} rot={[-P2 + (rn(i, 3) - 0.5) * 0.8, rn(i, 4) * 3, 0]} s={0.7} c={col("#f4dcc0", "#f2c46a", oro)} />; })}
    </Frasco></group>
    <pointLight position={[0, 0.4, 0.3]} intensity={0.01 + 2.2 * oro} distance={1.8} color="#ffc65a" />
    {Array.from({ length: 10 }, (_, i) => { const u = (tt * 0.4 + i / 10) % 1, a = i * 2.4; return <mesh key={i} position={[Math.cos(a) * 0.45, 0.3 + u * 0.7, Math.sin(a) * 0.3]} scale={sz(0.03 * oro * Math.sin(u * P))} geometry={esf}><meshBasicMaterial color="#ffe08a" toneMapped={false} /></mesh>; })}
    
  </Estudio>;
}}</Stage>;

// ── 9 · LA TABLA CON ESTROPAJO (5:52): la tabla con manchas del pollo crudo; el estropajo la talla en zigzag, deja espuma y las manchas se borran; el agua enjuaga
const zig = (u: number): [number, number] => { const row = Math.min(3, Math.floor(u * 4)), f = u * 4 - row; return [(row % 2 ? 1 - f : f) * 1.1 - 0.55, -0.27 + row * 0.18]; };
const vetaTex = () => ctex("vetaE", 512, 320, (g) => { g.fillStyle = "#b98a58"; g.fillRect(0, 0, 512, 320); for (let i = 0; i < 46; i++) { g.strokeStyle = `rgba(${90 + (i % 4) * 12},${55 + (i % 3) * 8},25,${0.25 + 0.2 * Math.abs(Math.sin(i))})`; g.lineWidth = 1 + (i % 3); g.beginPath(); const y0 = i * 7 + Math.sin(i) * 4; g.moveTo(0, y0); for (let x = 0; x <= 512; x += 16) g.lineTo(x, y0 + Math.sin(x / 60 + i) * 5 + Math.sin(x / 13 + i * 2) * 1.5); g.stroke(); } });
const fibraTex = () => ctex("fibraE", 128, 128, (g) => { g.fillStyle = "#2f6a2a"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 400; i++) { g.strokeStyle = i % 2 ? "rgba(20,50,20,.8)" : "rgba(90,150,70,.7)"; g.beginPath(); const x = (i * 37) % 128, y = (i * 61) % 128; g.moveTo(x, y); g.lineTo(x + Math.sin(i) * 9, y + Math.cos(i * 1.3) * 9); g.stroke(); } });
const H9Tabla: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const D = dur(h), W0 = 0.25, W1 = Math.max(2.0, D * 0.55), sp = cl((tt - W0) / (W1 - W0)), A0 = W1 + 0.15, A1 = D - 0.25, ag = cl((tt - A0) / (A1 - A0));
  const px = (u: number) => lerp(-0.5, 0.5, u), pz = (u: number) => 0.2 * Math.sin(u * P * 7);
  const xw = lerp(-0.62, 0.62, ag), moj = eio(tt, A0, A1);
  return <Estudio t={tt} cam={[0, 1.35, 1.35]} look={[0, 0.05, 0]} orbit={0.07}>
    <RBox p={[0, 0.035, 0]} s={[1.4, 0.07, 0.78]} r={0.03}><meshPhysicalMaterial map={vetaTex()} roughness={lerp(0.75, 0.18, moj)} clearcoat={moj} clearcoatRoughness={0.1} /></RBox>
    <Sombra p={[0, 0, 0]} r={0.85} o={0.7} />
    {Array.from({ length: 9 }, (_, i) => { const sx = -0.48 + i * 0.12, sz = (rn(i, 2) - 0.5) * 0.38, borra = cl((sp - (sx + 0.5)) / 0.1);
      return <mesh key={i} position={[sx, 0.072, sz]} rotation={[-P2, 0, rn(i, 3) * 3]} scale={[0.07 + 0.05 * rn(i, 4), 0.05 + 0.04 * rn(i, 5), 1]}><circleGeometry args={[1, 20]} /><meshStandardMaterial color="#c86a6a" transparent opacity={0.75 * (1 - borra)} roughness={0.4} depthWrite={false} /></mesh>; })}
    {Array.from({ length: 70 }, (_, j) => { const u = j / 70; if (sp < u) return null; const x = px(u) + (rn(j, 1) - 0.5) * 0.06, z = pz(u) + (rn(j, 2) - 0.5) * 0.06;
      const vive = x > xw ? 1 : cl(1 - (xw - x) / 0.12); if (vive <= 0) return null;
      return <mesh key={j} position={[x, 0.075, z]} scale={Math.max(0.001, (0.022 + 0.022 * rn(j, 3)) * vive)} geometry={esf}><meshPhysicalMaterial color="#ffffff" roughness={0.2} transmission={0.2} clearcoat={1} /></mesh>; })}
    {tt < A0 + 0.3 && <group position={[px(sp), 0.11 + 0.02 * Math.abs(Math.sin(tt * 18)), pz(sp)]} rotation={[0, Math.cos(sp * P * 7) * 0.35, 0]} scale={Math.max(0.001, 1 - cl((tt - A0) / 0.3))}>
      <RBox p={[0, 0.03, 0]} s={[0.26, 0.08, 0.16]} r={0.025}><meshStandardMaterial color="#f2c63a" roughness={0.9} /></RBox>
      <RBox p={[0, -0.025, 0]} s={[0.26, 0.03, 0.16]} r={0.01}><meshStandardMaterial map={fibraTex()} roughness={1} /></RBox></group>}
    {ag > 0 && ag < 1 && <><Chorro a={[xw, 1.0, 0]} b={[xw, 0.075, 0]} r={0.03} c="#bfe2f5" o={0.75} />
      {Array.from({ length: 10 }, (_, i) => { const k = (tt * 2.2 + i / 10) % 1, a = i * 0.63; return <mesh key={i} position={[xw + Math.cos(a) * 0.25 * k, 0.08 + Math.sin(k * P) * 0.1, Math.sin(a) * 0.18 * k]} scale={0.012} geometry={esf}><meshPhysicalMaterial color="#d8f0ff" transparent opacity={0.8} clearcoat={1} /></mesh>; })}</>}
    {moj > 0 && <mesh position={[lerp(-0.7, xw, 0.5), 0.0715, 0]} rotation={[-P2, 0, 0]} scale={[Math.max(0.001, xw + 0.7), 1, 1]}><planeGeometry args={[1, 0.74]} /><meshPhysicalMaterial color="#8a5a30" transparent opacity={0.18} roughness={0.02} clearcoat={1} depthWrite={false} /></mesh>}
  </Estudio>;
}}</Stage>;

// ── 10 · TRES LITROS DE AGUA FRÍA (6:28): tres jarras de un litro se vacían de una en una en la olla de barro; el agua sube con su frío azul y caen las piernas
const H10Tres: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const D = dur(h), st = (0.6 * D) / 3, ech = (i: number) => eio(tt, 0.15 + i * st, 0.15 + (i + 0.8) * st), lv = 0.08 + 0.25 * (ech(0) + ech(1) + ech(2)), lit = Math.round(ech(0) + ech(1) + ech(2) - 0.49);
  const piezas = eio(tt, 0.72 * D, 0.82 * D);
  return <Estudio t={tt} cam={[0, 1.45, 2.4]} look={[0, 0.45, 0]} orbit={0.1}>
    <Olla p={[0.25, 0, 0]} mat="barro" nivel={lv} caldo="#9cc6dc" t={tt} s={0.7} />
    {[0, 1, 2].map((i) => { const k = ech(i), vac = k > 0.98, tilt = Math.sin(cl(k) * P) * 1.9 * (k > 0 && k < 1 ? 1 : 0);
      const base: V3 = [-0.75 - (2 - i) * 0.0, 0, -0.35 + i * 0.35], at: V3 = [-0.18, 0.75, 0];
      const pos: V3 = k > 0 && k < 1 ? [lerp(base[0], at[0], Math.min(1, k * 4)), lerp(0, at[1], Math.min(1, k * 4)), lerp(base[2], at[2], Math.min(1, k * 4))] : base;
      return <group key={i}>
        <group position={pos} rotation={[0, 0, -tilt]}>
          <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.1, 0.11, 0.34, 24]} /><meshPhysicalMaterial color="#f2f6f8" roughness={0.1} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} /></mesh>
          {!vac && <mesh position={[0, 0.16 * (1 - k) + 0.01, 0]}><cylinderGeometry args={[0.095, 0.105, sz(0.3 * (1 - k)), 24]} /><meshPhysicalMaterial color="#8ec4ea" transparent opacity={0.7} roughness={0.05} /></mesh>}
          <mesh position={[0.11, 0.25, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.05, 0.012, 8, 16, P]} /><meshStandardMaterial color="#e8eef0" /></mesh>
        </group>
        {k > 0.3 && k < 0.85 && <Chorro a={[-0.05, 0.98, 0]} b={[0.15, lv * 0.6 + 0.1, 0]} r={0.025} c="#bfe2f6" o={0.8} />}
      </group>; })}
    {Array.from({ length: 10 }, (_, i) => { const u = (tt * 0.45 + i / 10) % 1; return <mesh key={i} position={[0.25 + Math.cos(i * 2.3) * 0.3, 0.6 + u * 0.4, Math.sin(i * 2.3) * 0.2]} scale={sz(0.022 * (lv > 0.2 ? 1 : 0) * Math.sin(u * P))} geometry={esf}><meshStandardMaterial color="#9fd0ff" emissive="#9fd0ff" emissiveIntensity={0.5} /></mesh>; })}
    <group position={[0.25, 0.5 + (1 - piezas) * 0.7, 0]} visible={piezas > 0.01}><Pierna rot={[0, 0, P2 + 0.3]} s={0.6} /><group position={[0.08, 0, 0.1]}><Espinazo s={0.5} rot={[0, 0.5, 0.2]} /></group></group>
    
  </Estudio>;
}}</Stage>;

// ── 11 · LA ESPUMA GRIS (7:00): el caldo visto de arriba con su espuma gris; la cuchara la va sacando de a una y el caldo queda claro y dorado
const H11Espuma: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const D = dur(h), N = 9, st = (0.72 * D) / N, sac = (i: number) => eio(tt, 0.1 + i * st, 0.1 + (i + 0.85) * st), quedan = N - Array.from({ length: N }, (_, i) => sac(i) >= 1).filter(Boolean).length;
  const cur = Math.min(N - 1, Math.max(0, Math.floor((tt - 0.1) / st))), kc = sac(cur);
  const fp = (i: number): V3 => { const a = i * 2.39, r = 0.08 + 0.26 * Math.sqrt((i + 0.5) / N); return [Math.cos(a) * r, 0.36, Math.sin(a) * r]; };
  const bowl: V3 = [0.75, 0.12, 0.25], q = fp(cur), sp: V3 = kc < 0.5 ? [lerp(0.4, q[0], kc * 2), 0.42, lerp(0.2, q[2], kc * 2)] : [lerp(q[0], bowl[0], (kc - 0.5) * 2), 0.42 + Math.sin((kc - 0.5) * 2 * P) * 0.2, lerp(q[2], bowl[2], (kc - 0.5) * 2)];
  return <Estudio t={tt} cam={[0.2, 2.1, 0.75]} look={[0.2, 0.3, 0]} orbit={0.06}>
    <Olla p={[0, 0, 0]} mat="barro" nivel={0.85} caldo={col("#8a8a7a", "#e0a63a", 1 - quedan / N)} hervor={0.25} t={tt} s={0.62} />
    {Array.from({ length: N }, (_, i) => { const k = sac(i), p0 = fp(i); if (k >= 1) return null; const mov = k > 0.5 ? (k - 0.5) * 2 : 0;
      const pp: V3 = k > 0.5 ? [lerp(p0[0], bowl[0], mov), p0[1] + 0.05 + Math.sin(mov * P) * 0.2, lerp(p0[2], bowl[2], mov)] : p0;
      return <mesh key={i} position={pp} scale={[0.1, 0.04, 0.1]} geometry={esf}><meshStandardMaterial color="#8a8478" roughness={0.9} /></mesh>; })}
    <Cuchara p={sp} rot={[0, 0.8, 0.3]} s={0.9} mat="cromo" />
    <Tazon p={[0.75, 0, 0.25]} s={0.8} c="#c9c1b0">{Array.from({ length: N - quedan }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.15, 0.13 + i * 0.006, (rn(i, 2) - 0.5) * 0.15]} scale={[0.06, 0.02, 0.06]} geometry={esf}><meshStandardMaterial color="#9a9488" /></mesh>)}</Tazon>
    <Vapor t={tt} p={[0, 0.45, 0]} o={0.25} h={0.7} s={0.25} />
  </Estudio>;
}}</Stage>;

// ── 12 · LOS FRASCOS DE CALDO (8:12): la olla vierte el caldo dorado frasco por frasco; se cierran y brillan en la repisa como tesoro
const H12Frascos: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const D = dur(h), st = (0.6 * D) / 4, ll = (i: number) => eio(tt, 0.15 + i * st, 0.15 + (i + 0.9) * st), cur = Math.min(3, Math.max(0, Math.floor((tt - 0.15) / st))), X = (i: number) => -0.66 + i * 0.44;
  const oro = eio(tt, 0.72 * D, 0.9 * D), vert = tt > 0.15 && tt < 0.15 + 4 * st;
  return <Estudio t={tt} cam={[0, 1.3, 2.75]} look={[0, 0.6, 0]} orbit={0.1}>
    {[0, 1, 2, 3].map((i) => <Frasco key={i} p={[X(i), 0, 0]} s={1.4} nivel={ll(i) * 0.9} tapa={phys(tt, 0.15 + (i + 0.95) * st, 6, 0.45)} brillo={oro} />)}
    <group position={[lerp(X(0), X(3), cl((tt - 0.15) / (4 * st))) - 0.32, 1.05, 0]} rotation={[0, 0, -1.0]} visible={vert}>
      <mesh geometry={lathe([[0, 0], [0.16, 0], [0.22, 0.12], [0.22, 0.28], [0.18, 0.32]])}>{M.barro("#8a4426")}</mesh></group>
    {vert && <Chorro a={[X(cur) - 0.08, 0.98, 0]} b={[X(cur), 0.25 + 0.3 * ll(cur), 0]} r={0.045} c="#e8a830" o={0.92} />}
    <RBox p={[0, -0.02, 0]} s={[2.0, 0.04, 0.5]} r={0.01}>{M.cromo("#c8ccd0")}</RBox>
    <pointLight position={[0, 0.6, 0.6]} intensity={0.01 + 2.0 * oro} distance={2.5} color="#ffc65a" />
    
  </Estudio>;
}}</Stage>;

// ── 13 · LA PECHUGA SE ESTIRA (9:05): dos tenedores deshebran la pechuga cocida y las hebras van haciendo un montón más alto que la pechuga
const Tenedor: React.FC<{ p: V3; rot: V3 }> = ({ p, rot }) => <group position={p} rotation={rot}>
  <RBox p={[0, 0.27, 0]} s={[0.05, 0.42, 0.016]} r={0.007}>{M.cromo()}</RBox>
  {[-1.5, -0.5, 0.5, 1.5].map((k) => <mesh key={k} position={[k * 0.016, 0.0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.15, 6]} />{M.cromo()}</mesh>)}</group>;
const H13Hebras: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const D = dur(h), k = eio(tt, 0.35, 0.85 * D), N = Math.floor(k * 90), tiron = Math.max(0, Math.sin(tt * 5.5)) * (k > 0 && k < 1 ? 1 : 0), ab = 0.03 + 0.07 * tiron;
  const pech = 1 - 0.75 * k;
  return <Estudio t={tt} cam={[0, 1.05, 1.35]} look={[0, 0.1, 0]} orbit={0.06}>
    <Plato p={[0, 0, 0]} s={1.05} c="#a9542c" />
    <group position={[-0.24, 0.07, 0]} scale={[sz(pech), sz(0.6 + 0.4 * pech), sz(0.7 + 0.3 * pech)]}>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * ab, 0, 0]} scale={[0.15, 0.1, 0.17]} geometry={esf} castShadow><meshStandardMaterial map={fibraPechTex()} roughness={0.7} /></mesh>)}
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0, 0.02 + (i % 3) * 0.02, -0.12 + i * 0.04]} rotation={[0, 0, P2]} scale={[1, 0.6 + ab * 6, 1]}><cylinderGeometry args={[0.005, 0.005, 0.06 + ab * 1.5, 5]} /><meshStandardMaterial color="#ecd6ae" roughness={0.8} /></mesh>)}
    </group>
    <group position={[-0.24, 0, 0]}>
      <Tenedor p={[-0.05 - ab * pech, 0.12, 0.02]} rot={[0.15, 0, 0.35 + 0.25 * tiron]} />
      <Tenedor p={[0.05 + ab * pech, 0.12, 0.02]} rot={[0.15, 0, -0.35 - 0.25 * tiron]} />
    </group>
    {Array.from({ length: N }, (_, i) => { const lay = Math.floor(i / 14), r = Math.sqrt(rn(i, 1)) * Math.max(0.04, 0.17 - lay * 0.022), a = rn(i, 2) * 6.28, y = 0.04 + lay * 0.032 + rn(i, 6) * 0.015;
      const f = cl((N - i) / 4), yy = y + 0.15 * (1 - f);
      return <mesh key={i} geometry={hebraGeos[i % 12]} position={[0.22 + Math.cos(a) * r, yy, Math.sin(a) * r]} rotation={[rn(i, 3) * 0.6, a, rn(i, 5) * 0.5]} castShadow><meshStandardMaterial color={i % 4 ? "#ead8b6" : "#d9bf92"} roughness={0.8} /></mesh>; })}
    <Sombra p={[0.22, 0, 0]} r={0.28} o={0.35 * k} />
  </Estudio>;
}}</Stage>;

// ── 14 · EL MOLCAJETE (10:54): caen jitomates, chile y ajo al molcajete; el tejolote muele en círculos, sube la salsa roja y el caldo le da cuerpo
const molGeo = lathe([[0, 0.06], [0.26, 0.08], [0.33, 0.2], [0.34, 0.3], [0.3, 0.31], [0.24, 0.2], [0.001, 0.14]], 32);
const H14Molcajete: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const D = dur(h), muele = eio(tt, 0.75, 0.72 * D), cdo = eio(tt, 0.76 * D, 0.92 * D), a = tt * 5 * (muele > 0 && muele < 1 ? 1 : 0.2);
  const caen = [{ k: "j", x: -0.08, at: 0.05 }, { k: "c", x: 0.0, at: 0.2 }, { k: "j", x: 0.09, at: 0.35 }, { k: "a", x: 0.06, at: 0.5 }];
  return <Estudio t={tt} cam={[0, 1.35, 1.75]} look={[0, 0.25, 0]} orbit={0.1}>
    <mesh geometry={molGeo} castShadow receiveShadow><meshStandardMaterial color="#4a4744" roughness={0.95} /></mesh>
    {[0, 1, 2].map((i) => <mesh key={i} position={[Math.cos(i * 2.09) * 0.18, 0.03, Math.sin(i * 2.09) * 0.18]}><coneGeometry args={[0.05, 0.08, 10]} /><meshStandardMaterial color="#4a4744" roughness={0.95} /></mesh>)}
    {caen.map((c, i) => { const y = 0.24 + fall(tt, c.at, 0.9), s = sz(1 - muele); return c.k === "j" ? <mesh key={i} position={[c.x, y, 0]} scale={0.09 * s} geometry={esf} castShadow><meshPhysicalMaterial color="#c8281a" roughness={0.3} clearcoat={0.7} /></mesh>
      : c.k === "c" ? <mesh key={i} position={[c.x, y + 0.02, 0.06]} rotation={[P2, 0, 0.5]} scale={[s, s, s]}><capsuleGeometry args={[0.04, 0.17, 6, 10]} /><meshStandardMaterial color="#3f8a2a" roughness={0.4} /></mesh>
        : <mesh key={i} position={[c.x, y, -0.06]} scale={[0.055 * s, 0.065 * s, 0.055 * s]} geometry={esf}><meshStandardMaterial color="#f2ecd8" /></mesh>; })}
    <mesh position={[0, 0.17 + 0.1 * muele, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.24 + 0.05 * muele, 32]} /><meshPhysicalMaterial color={col("#b8301e", "#c84a26", cdo)} roughness={0.2} clearcoat={0.8 + 0.2 * cdo} /></mesh>
    <group position={[Math.cos(a) * 0.08, 0.32 + 0.04 * Math.abs(Math.sin(a * 2)), Math.sin(a) * 0.08]} rotation={[Math.sin(a) * 0.3, 0, Math.cos(a) * 0.3]}>
      <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.045, 0.07, 0.26, 16]} /><meshStandardMaterial color="#5a5652" roughness={0.95} /></mesh></group>
    {cdo > 0.02 && cdo < 0.98 && <Chorro a={[0.35, 0.75, 0]} b={[0.05, 0.26, 0]} r={0.02} c="#e0a63a" o={0.85} />}
    
  </Estudio>;
}}</Stage>;

// ── 15 · EL TICKET DE LA FONDA (11:56): el mismo plato de entomatadas en la casa y en la fonda; la caja de la fonda imprime un ticket larguísimo de $85
const ticketTex = (amt: string) => ctex("tk" + amt, 256, 768, (g) => { g.fillStyle = "#f8f6f0"; g.fillRect(0, 0, 256, 768); for (let i = 0; i < 14; i++) { g.fillStyle = "rgba(60,60,60,.18)"; g.fillRect(24, 40 + i * 34, 80 + rn(i, 2) * 120, 10); }
  g.fillStyle = "#1a1a1a"; g.font = "900 96px Montserrat, Arial"; g.textAlign = "center"; g.fillText(amt, 128, 700); });
const Entomatadas: React.FC<{ p: V3 }> = ({ p }) => <group position={p}><Plato s={0.6} c="#efe7d6" />
  {[0, 1, 2].map((k) => <mesh key={k} position={[0, 0.045, (k - 1) * 0.085]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.04, 0.04, 0.32, 16]} /><meshPhysicalMaterial color="#b8321e" roughness={0.3} clearcoat={0.6} /></mesh>)}
  {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.28, 0.09, (rn(i, 2) - 0.5) * 0.24]} scale={0.014} geometry={esf}><meshStandardMaterial color="#fbf8f0" /></mesh>)}
  {[0, 1].map((k) => <mesh key={"c" + k} position={[(k - 0.5) * 0.12, 0.092, 0.02]} rotation={[-P2, 0, 0]}><torusGeometry args={[0.04, 0.006, 6, 16]} /><meshStandardMaterial color="#f2eadf" /></mesh>)}</group>;
const H15Ticket: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const D = dur(h), L = 0.05 + 1.15 * eio(tt, 0.15, 0.7 * D), l = 0.05 + 0.15 * eio(tt, 0.15, 0.8);
  const Tira: React.FC<{ x: number; len: number; amt: string }> = ({ x, len, amt }) => { const tex = ticketTex(amt); tex.repeat.set(1, Math.min(1, len / 1.2)); tex.offset.set(0, 1 - Math.min(1, len / 1.2));
    return <group position={[x, 0.42, -0.2]}>
      <mesh position={[0, -len / 2 + 0.0, 0.12 + Math.min(len, 0.4) * 0.6]} rotation={[-0.25 - Math.min(0.9, len) * 0.9, 0, 0]}><planeGeometry args={[0.3, len]} /><meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={0.8} /></mesh></group>; };
  return <Estudio t={tt} cam={[0, 1.45, 2.6]} look={[0, 0.3, 0.1]} orbit={0.1}>
    <Entomatadas p={[-0.6, 0, 0.3]} /><Entomatadas p={[0.6, 0, 0.3]} />
    <RBox p={[0.6, 0.22, -0.3]} s={[0.36, 0.44, 0.3]} r={0.03}><meshStandardMaterial color="#2a2a2e" roughness={0.5} /></RBox>
    <RBox p={[-0.6, 0.12, -0.3]} s={[0.26, 0.24, 0.22]} r={0.03}><meshStandardMaterial color="#6a4428" roughness={0.6} /></RBox>
    <Tira x={0.6} len={L} amt="$85" /><Tira x={-0.6} len={l} amt="$20" />
    
    
  </Estudio>;
}}</Stage>;

// ── 16 · LA GRASA TAPA LA TUBERÍA (13:08): el caño en corte; la grasa amarilla se cuaja en el codo y el agua se regresa; la cuchara la saca al frasquito y el agua baja
const H16Tuberia: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const D = dur(h), tapa = eio(tt, 0.05, 0.35 * D), sube = eio(tt, 0.3 * D, 0.5 * D), saca = eio(tt, 0.55 * D, 0.8 * D), baja = eio(tt, 0.75 * D, 0.92 * D);
  const tapon = tapa * (1 - saca), agua = sube * (1 - baja);
  return <Estudio t={tt} cam={[0, 1.05, 2.3]} look={[0, 0.65, 0]} orbit={0.08} mesa={false}>
    
    <group position={[-0.2, 1.1, 0]}>{[[0, -0.1, 0, 0.9, 0.03, 0.55], [0, 0.06, -0.27, 0.9, 0.34, 0.03], [-0.44, 0.06, 0, 0.03, 0.34, 0.55], [0.44, 0.06, 0, 0.03, 0.34, 0.55]].map((b, i) => <RBox key={i} p={[b[0], b[1], b[2]]} s={[b[3], b[4], b[5]]} r={0.01}>{M.cromo("#b8bcc2")}</RBox>)}
      <mesh position={[0, -0.08 + 0.2 * agua, 0.0]} rotation={[-P2, 0, 0]} scale={sz(agua > 0.02 ? 1 : 0)}><planeGeometry args={[0.84, 0.5]} /><meshPhysicalMaterial color="#9fb8b0" transparent opacity={0.75} roughness={0.05} /></mesh></group>
    <mesh position={[-0.2, 0.75, 0]}><cylinderGeometry args={[0.07, 0.07, 0.6, 20, 1, true]} /><meshPhysicalMaterial color="#5a8a7a" roughness={0.1} transparent opacity={0.45} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[-0.02, 0.45, 0]} rotation={[0, 0, P]}><torusGeometry args={[0.18, 0.07, 14, 30, P]} /><meshPhysicalMaterial color="#5a8a7a" roughness={0.1} transparent opacity={0.45} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[-0.02, 0.45, 0]} rotation={[0, 0, P + P * 0.25]}><torusGeometry args={[0.18, 0.062 * cl(tapon * 1.2), 12, 24, P * 0.5 + 0.001]} /><meshStandardMaterial color="#f2d36a" roughness={0.7} /></mesh>
    <mesh position={[-0.2, 0.75 + 0.15 * agua, 0]}><cylinderGeometry args={[0.062, 0.062, sz(0.6 * agua), 16]} /><meshPhysicalMaterial color="#2a7ad0" transparent opacity={0.88} /></mesh>
    {tapa > 0.02 && tapa < 0.98 && <Chorro a={[-0.2, 1.65, 0.05]} b={[-0.2, 1.05, 0]} r={0.025} c="#f2d36a" o={0.9} />}
    <pointLight position={[0, 0.5, 0.4]} intensity={0.01 + 1.2 * tapon * (0.6 + 0.4 * Math.sin(tt * 6))} distance={1.4} color="#ff4a2a" />
    <Frasco p={[0.75, 0.45, 0.1]} s={1.3} nivel={0.8 * saca} c="#f2d36a" tapa={phys(tt, 0.82 * D, 6, 0.45)} />
    <RBox p={[0.75, 0.42, 0.1]} s={[0.6, 0.04, 0.5]} r={0.01}>{M.madera("#7a5230")}</RBox>
    {saca > 0.02 && saca < 0.98 && <Cuchara p={[lerp(-0.1, 0.75, (saca * 3) % 1), 0.95 + Math.sin(((saca * 3) % 1) * P) * 0.3, 0.1]} rot={[0, 0, 0.5]} mat="cromo" />}
    
  </Estudio>;
}}</Stage>;

// ── 17 · EL ARROZ QUE SUENA (13:43): en la cazuela, los granos brincan como arena y se doran del blanco al dorado; el sonido sale en ondas
const cazGeo = lathe([[0, 0], [0.42, 0.01], [0.5, 0.1], [0.52, 0.16]], 40);
const H17Arroz: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const D = dur(h), dora = eio(tt, 0.05, 0.8 * D), a = tt * 3;
  return <Estudio t={tt} cam={[0, 1.65, 0.95]} look={[0, 0.08, 0]} orbit={0.08}>
    <mesh geometry={cazGeo} castShadow receiveShadow>{M.barro("#8a4426")}</mesh>
    {Array.from({ length: 140 }, (_, i) => { const r = Math.sqrt(rn(i, 1)) * 0.42, an = rn(i, 2) * 6.28, j = Math.max(0, Math.sin(tt * 18 + i * 1.7)) * 0.025 * dora;
      return <mesh key={i} position={[Math.cos(an) * r, 0.04 + rn(i, 3) * 0.02 + j, Math.sin(an) * r]} rotation={[rn(i, 4) * 3, rn(i, 5) * 3, 0]} scale={[0.016, 0.016, 0.036]} geometry={esf}><meshStandardMaterial color={col("#f6f2e6", i % 5 ? "#d9a248" : "#c48a30", dora * (0.8 + 0.2 * rn(i, 6)))} roughness={0.5} /></mesh>; })}
    <group position={[Math.cos(a) * 0.2, 0.18, Math.sin(a) * 0.2]} rotation={[0.5 * Math.sin(a), a, 0.5]}><Cuchara p={[0, 0, 0]} s={0.5} /></group>
    {[0, 1, 2].map((i) => <Onda key={i} p={[0, 0.2, 0]} t={tt} a={0.6 + i * 0.9 + Math.floor(Math.max(0, tt - 0.6) / 2.7) * 2.7} r={0.9} />)}
  </Estudio>;
}}</Stage>;

// ── 18 · VEINTE TAMALES (15:16): en la vaporera abierta los tamales se paran de uno en uno, con la punta para arriba, hasta veinte, y sale el vapor
const tamalGeo = lathe([[0, 0], [0.055, 0.01], [0.065, 0.08], [0.06, 0.2], [0.035, 0.27], [0.008, 0.31]], 16);
const H18Veinte: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const D = dur(h), st = (0.7 * D) / 20, n = Math.min(20, Math.floor(Math.max(0, tt - 0.1) / st) + (tt > 0.1 ? 1 : 0)), vap = 0.4 + 0.6 * eio(tt, 0.6 * D, 0.9 * D);
  const pos = (i: number): V3 => { const ring = i < 7 ? 0 : i < 15 ? 1 : 2, k = i < 7 ? i : i < 15 ? i - 7 : i - 15, N = [7, 8, 5][ring], R = [0.36, 0.24, 0.11][ring], a = k / N * 6.28 + ring * 0.3; return [Math.cos(a) * R, 0.06, Math.sin(a) * R]; };
  return <Estudio t={tt} cam={[0, 1.55, 1.9]} look={[0, 0.3, 0]} orbit={0.1}>
    <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.47, 0.45, 0.5, 40, 1, true, P * 0.15, P * 1.7]} /><meshStandardMaterial color="#b8bcc2" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.005, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.46, 40]} /><meshStandardMaterial color="#a8acb2" metalness={0.8} roughness={0.35} /></mesh>
    {Array.from({ length: n }, (_, i) => { const q = pos(i); return <mesh key={i} geometry={tamalGeo} position={[q[0], q[1] + fall(tt, 0.1 + i * st, 0.6), q[2]]} rotation={[(rn(i, 1) - 0.5) * 0.15, rn(i, 2) * 3, (rn(i, 3) - 0.5) * 0.15]} castShadow><meshStandardMaterial color={i % 3 ? "#e6d39a" : "#d8c486"} roughness={0.85} /></mesh>; })}
    <Vapor t={tt} p={[0, 0.5, 0]} o={0.55 * vap} h={1.0} s={0.35} spread={0.3} />
    
    
  </Estudio>;
}}</Stage>;

// ── 19 · LA BOLITA QUE FLOTA (16:27): la bolita de masa sin batir se hunde en el vaso; la batida con caldo cae y flota, se mece y la masa está lista
const H19Flota: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const D = dur(h), a1 = 0.1, a2 = 0.4 * D, y1 = tt < a1 ? 1.2 : Math.max(0.07, 1.2 - (tt - a1) * 2.2);
  const t2 = tt - a2, y2 = t2 < 0 ? 1.4 : t2 < 0.4 ? 1.4 - 4.9 * t2 * t2 * 2 : 0.66 + 0.09 * Math.exp(-(t2 - 0.4) * 1.8) * Math.cos((t2 - 0.4) * 7);
  return <Estudio t={tt} cam={[0, 0.85, 1.75]} look={[0, 0.48, 0]} orbit={0.08}>
    <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.3, 0.26, 0.8, 40, 1, true]} />{M.vidrio()}</mesh>
    <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.285, 0.26, 0.66, 40]} /><meshPhysicalMaterial color="#cfe6ee" transparent opacity={0.35} roughness={0.02} depthWrite={false} /></mesh>
    <mesh position={[0.06, Math.min(1.2, y1), 0]} scale={0.075} geometry={esf} castShadow><meshStandardMaterial color="#c9b47a" roughness={0.9} /></mesh>
    {t2 > -0.01 && <mesh position={[-0.05, Math.min(1.4, y2), 0.02]} scale={0.085} geometry={esf} castShadow><meshStandardMaterial color="#f2e2b0" roughness={0.75} emissive="#f2c46a" emissiveIntensity={0.15} /></mesh>}
    {Array.from({ length: 10 }, (_, i) => { const u = (tt * 0.9 + i / 10) % 1; return <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.2, 0.08 + u * 0.58, (rn(i, 2) - 0.5) * 0.2]} scale={sz(0.024 * (tt > a1 ? 1 : 0))} geometry={esf}><meshPhysicalMaterial color="#ffffff" transparent opacity={0.7} roughness={0} /></mesh>; })}
    
    
  </Estudio>;
}}</Stage>;

// ── 20 · AL CONGELADOR (17:03): las bolsas de cuatro tamales entran de una en una al congelador; se escarchan y aguantan meses
const H20Congela: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const D = dur(h), st = Math.min(0.55, (0.6 * D) / 4), ent = (i: number) => 0.25 + i * st, esc = eio(tt, 0.35 * D, 0.9 * D), baja = eio(tt, 0.1, D - 0.4);
  const blanco = <meshPhysicalMaterial color="#f2f3f0" roughness={0.3} clearcoat={0.6} />, rej = M.cromo("#c8ccd2");
  const slots: V3[] = [[-0.2, 0.36, 0.0], [0.2, 0.36, 0.0], [-0.2, 0.74, 0.0], [0.2, 0.74, 0.0]];
  return <Estudio t={tt} cam={[0.15, 0.78, 2.45]} look={[0.05, 0.62, 0]} orbit={0.08} mesa={false}>
    <Suelo c="#6a5440" />
    <group position={[0, 0, -0.1]}>
      <RBox p={[0, 0.62, -0.28]} s={[0.98, 1.2, 0.04]} r={0.01}><meshStandardMaterial color="#9ec8e8" emissive="#6aa8e0" emissiveIntensity={0.55} roughness={0.5} /></RBox>
      {[-1, 1].map((k) => <RBox key={k} p={[k * 0.49, 0.62, 0]} s={[0.05, 1.24, 0.6]} r={0.015}>{blanco}</RBox>)}
      <RBox p={[0, 1.24, 0]} s={[1.03, 0.06, 0.6]} r={0.015}>{blanco}</RBox>
      <RBox p={[0, 0.03, 0]} s={[1.03, 0.06, 0.6]} r={0.015}>{blanco}</RBox>
      {[0.3, 0.68, 1.03].map((y, j) => <group key={j} position={[0, y, 0]}>
        {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0, 0, -0.25 + i * 0.062]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.006, 0.006, 0.94, 6]} />{rej}</mesh>)}
        {[-1, 1].map((k) => <mesh key={k} position={[k * 0.46, 0, 0]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 0.52, 6]} />{rej}</mesh>)}</group>)}
      <group position={[0.51, 0.62, 0.3]} rotation={[0, -1.9 * eio(tt, 0, 0.4) - 0.15, 0]}>
        <RBox p={[-0.49, 0, 0.02]} s={[0.98, 1.22, 0.06]} r={0.02}>{blanco}</RBox>
        <RBox p={[-0.49, 0, -0.025]} s={[0.9, 1.12, 0.03]} r={0.01}><meshStandardMaterial color="#d8dcd8" roughness={0.6} /></RBox></group>
      <pointLight position={[0, 1.15, 0.1]} intensity={2.4} distance={1.8} color="#bfe4ff" />
    </group>
    <Sombra p={[0, 0, -0.1]} r={0.75} o={0.6} />
    {slots.map((sl, i) => { const a = ent(i), k = cl((tt - a) / 0.45); if (tt < a) return null;
      const from: V3 = [0.95, 1.1, 0.9], y = k < 1 ? lerp(from[1], sl[1] + 0.06, eio(k, 0, 1)) + Math.sin(k * P) * 0.18 : sl[1] + 0.06 + fall(tt, a + 0.45, 0.05);
      const fr = esc * cl((tt - a - 0.5) / 0.6);
      return <group key={i} position={[lerp(from[0], sl[0], k), y, lerp(from[2], sl[2] - 0.1, k)]} rotation={[0, (1 - k) * 0.8, (1 - k) * 0.3]}>
        <RBox s={[0.34, 0.09, 0.28]} r={0.03}><meshPhysicalMaterial color={col("#ffffff", "#e6f4ff", fr)} transparent opacity={0.38 + 0.4 * fr} roughness={0.12 + 0.6 * fr} clearcoat={1} depthWrite={false} /></RBox>
        {[0, 1, 2, 3].map((j) => <mesh key={j} position={[(j - 1.5) * 0.072, -0.005, 0]} rotation={[P2, 0, 0]} scale={[1, 1, 0.55]} castShadow><cylinderGeometry args={[0.03, 0.034, 0.24, 12]} /><meshStandardMaterial color="#d9c48a" roughness={0.85} /></mesh>)}
        {Array.from({ length: 14 }, (_, j) => <mesh key={j} position={[(rn(j + i * 20, 1) - 0.5) * 0.3, 0.048, (rn(j + i * 20, 2) - 0.5) * 0.24]} rotation={[rn(j, 3) * 3, rn(j, 4) * 3, 0]} scale={Math.max(0.001, 0.016 * fr * (0.6 + rn(j, 5)))}><octahedronGeometry args={[1, 0]} /><meshPhysicalMaterial color="#f4fbff" emissive="#cfe8ff" emissiveIntensity={0.5} roughness={0.1} clearcoat={1} /></mesh>)}</group>; })}
    <group position={[-0.78, 0.25, 0.25]}>
      <RBox p={[0, 0.45, -0.03]} s={[0.14, 0.95, 0.03]} r={0.02}><meshStandardMaterial color="#f1ead6" roughness={0.8} /></RBox>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0.035, 0.12 + i * 0.09, -0.012]}><boxGeometry args={[0.035, 0.006, 0.002]} /><meshBasicMaterial color="#3a2a1c" /></mesh>)}
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.022, 0.022, 0.8, 16]} />{M.vidrio()}</mesh>
      <mesh position={[0, 0.06, 0]} scale={0.05} geometry={esf}><meshPhysicalMaterial color="#c8201a" clearcoat={1} roughness={0.2} /></mesh>
      {(() => { const hh = lerp(0.7, 0.1, baja); return <mesh position={[0, 0.08 + hh / 2, 0]}><cylinderGeometry args={[0.011, 0.011, hh, 10]} /><meshStandardMaterial color="#d0241c" emissive="#7a0e08" emissiveIntensity={0.4} /></mesh>; })()}
      <Etq p={[0, -0.12, 0.02]} txt="−18°" w={0.32} h={0.15} bg="#1c3a5a" ink="#ffffff" s={Math.max(0.001, phys(tt, D - 0.9, 5, 0.5))} /></group>
    <Sombra p={[-0.78, 0, 0.25]} r={0.12} />
  </Estudio>;
}}</Stage>;

// ── 21 · LAS ALITAS EN SALSA (18:09): las alitas doradas saltan del comal al tazón de salsa; el tazón las revuelca y salen rojas y brillosas
const H21Salsa: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const D = dur(h), N = 6, st = (0.42 * D) / N;
  const salsaMat = <meshPhysicalMaterial color="#9e1c0e" roughness={0.25} clearcoat={0.9} />;
  return <Estudio t={tt} cam={[0, 1.2, 2.0]} look={[0.05, 0.22, 0]} orbit={0.06}>
    <group position={[-0.72, 0, 0.05]}>
      <mesh position={[0, 0.04, 0]} geometry={lathe([[0, 0], [0.3, 0], [0.34, 0.06], [0.35, 0.08]], 40)} castShadow><meshStandardMaterial color="#1e1c1b" roughness={0.45} metalness={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0.5, 0.09, 0]} rotation={[0, 0, 0.12]}><boxGeometry args={[0.34, 0.03, 0.05]} /><meshStandardMaterial color="#1e1c1b" roughness={0.45} metalness={0.6} /></mesh>
      <Sombra p={[0, 0, 0]} r={0.45} o={0.55} />
    </group>
    <group position={[0.12, 0, 0]}>
      <mesh geometry={molGeo} scale={1.35} castShadow receiveShadow><meshStandardMaterial color="#55524e" roughness={0.95} /></mesh>
      {[0, 1, 2].map((i) => <mesh key={i} position={[Math.cos(i * 2.1) * 0.27, 0.04, Math.sin(i * 2.1) * 0.27]} castShadow><cylinderGeometry args={[0.05, 0.07, 0.1, 10]} /><meshStandardMaterial color="#4a4744" roughness={0.95} /></mesh>)}
      <mesh position={[0, 0.36, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.38, 36]} />{salsaMat}</mesh>
      <Sombra p={[0, 0, 0]} r={0.55} o={0.6} />
    </group>
    <group position={[0.85, 0, 0.12]}><Plato s={0.7} c="#efe7d6" /></group>
    {Array.from({ length: N }, (_, i) => { const t0 = 0.25 + i * st, vuela = eio(tt, t0, t0 + 0.55), hunde = eio(tt, t0 + 0.55, t0 + 0.8), sale = eio(tt, t0 + 0.95, t0 + 1.5);
      const a = i * 1.05, src: V3 = [-0.72 + Math.cos(a) * 0.14, 0.1, 0.05 + Math.sin(a) * 0.14], mid: V3 = [0.12 + Math.cos(a) * 0.1, 0.4, Math.sin(a) * 0.1], dst: V3 = [0.85 + Math.cos(a) * 0.15, 0.06 + i * 0.02, 0.12 + Math.sin(a) * 0.12];
      const pp: V3 = sale > 0 ? [lerp(mid[0], dst[0], sale), lerp(mid[1] - 0.06, dst[1], sale) + Math.sin(sale * P) * 0.38, lerp(mid[2], dst[2], sale)]
        : [lerp(src[0], mid[0], vuela), lerp(src[1], mid[1], vuela) + Math.sin(vuela * P) * 0.5 - 0.1 * hunde, lerp(src[2], mid[2], vuela)];
      const cub = sale > 0;
      return <group key={i}><Ala p={pp} rot={[0.3 * Math.sin(vuela * P), a + vuela * 2 + sale * 2, 0.2]} c={cub ? "#a8200f" : DORADO} s={1.45} />
        {cub && sale < 0.6 && <mesh position={[pp[0] - 0.05, pp[1] - 0.06, pp[2]]} scale={sz(0.02 * (1 - sale))} geometry={esf}>{salsaMat}</mesh>}
        {hunde > 0 && hunde < 1 && Array.from({ length: 6 }, (_, j) => { const u = hunde, aa = j * 1.05; return <mesh key={j} position={[mid[0] + Math.cos(aa) * u * 0.14, 0.38 + Math.sin(u * P) * 0.1, mid[2] + Math.sin(aa) * u * 0.14]} scale={sz(0.018 * (1 - u))} geometry={esf}>{salsaMat}</mesh>; })}</group>; })}
  </Estudio>;
}}</Stage>;

// ── 22 · EL CHICHARRÓN DE PIEL (18:41): los cuadritos de piel en la sartén de fierro se doran y se inflan; truenan y saltan gotitas de grasa; la pala larga los mueve
const H22Chicharron: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const D = dur(h), dora = eio(tt, 0.05, 0.75 * D), a = tt * 1.6;
  return <Estudio t={tt} cam={[0, 1.35, 1.6]} look={[0, 0.12, 0]} orbit={0.08}>
    <Lumbre p={[0, -0.12, 0]} t={tt} s={1.4} />
    <mesh position={[0, 0.06, 0]} geometry={lathe([[0, 0], [0.4, 0], [0.46, 0.09], [0.47, 0.1]])} castShadow>{M.hierro()}</mesh>
    <mesh position={[0.72, 0.1, 0]} rotation={[0, 0, P2 - 0.15]}><cylinderGeometry args={[0.035, 0.03, 0.55, 10]} />{M.hierro()}</mesh>
    {Array.from({ length: 34 }, (_, i) => { const r = Math.sqrt(rn(i, 1)) * 0.36, an = rn(i, 2) * 6.28 + a * (r < 0.2 ? 0.3 : 0.1) * dora, inf = 1 + 0.75 * dora;
      return <RBox key={i} p={[Math.cos(an) * r, 0.085 + 0.02 * inf, Math.sin(an) * r]} s={[0.055 * inf, 0.03 * inf, 0.05 * inf]} r={0.012} rot={[rn(i, 3) * 0.5, rn(i, 4) * 3, 0]}><meshPhysicalMaterial color={col("#f2dcc0", "#c27a2a", dora * (0.85 + 0.15 * rn(i, 5)))} roughness={0.5} clearcoat={0.6} /></RBox>; })}
    {Array.from({ length: 16 }, (_, i) => { const u = (tt * 1.2 + rn(i, 1)) % 1, an = i * 2.4; return <mesh key={"g" + i} position={[Math.cos(an) * (0.15 + u * 0.4), 0.1 + Math.sin(u * P) * 0.32, Math.sin(an) * (0.15 + u * 0.4)]} scale={sz(0.026 * dora)} geometry={esf}><meshBasicMaterial color="#ffd27a" toneMapped={false} /></mesh>; })}
    <group position={[Math.cos(a) * 0.12 + 0.25, 0.25, Math.sin(a) * 0.12 - 0.05]} rotation={[0, -0.6, -0.9]}>
      <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.02, 0.02, 0.8, 10]} />{M.madera("#8a5a32")}</mesh>
      <RBox p={[0, -0.02, 0]} s={[0.14, 0.12, 0.015]} r={0.01}>{M.madera("#8a5a32")}</RBox></group>
  </Estudio>;
}}</Stage>;

// ── 23 · RECALENTAR MIL VECES (19:59): la olla va y viene del refri a la lumbre; cada vuelta cruza la franja roja del termómetro y le salen bichitos; mejor sacar sólo un plato
const H23Recalentar: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const D = dur(h), ciclos = 0.68 * D, f = cl((tt - 0.1) / (ciclos - 0.1)), fase = (f * 3) % 1, viaje = f >= 1 ? 0 : 0.5 - 0.5 * Math.cos(fase * 2 * P);
  const temp = viaje, nB = Math.min(30, Math.floor(f * 3) * 9 + (fase > 0.25 ? 4 : 0)), plato = eio(tt, ciclos + 0.2, D - 0.6);
  const pos: V3 = [lerp(-0.85, 0.85, viaje), 0.05 + Math.sin(viaje * P) * 0.4, 0];
  return <Estudio t={tt} cam={[0, 1.3, 2.7]} look={[0, 0.5, 0]} orbit={0.08}>
    <Refri p={[-1.05, 0, -0.35]} s={0.62} />
    <Lumbre p={[0.85, -0.05, 0]} t={tt} />
    <group position={pos}><Olla mat="barro" nivel={0.7} caldo="#c88a3a" t={tt} s={0.4} /><Bacterias n={Math.max(1, nB)} t={tt} r={0.3} y={0.22} /></group>
    <group position={[0, 0.25, -0.45]} scale={1.2}>
      <mesh position={[0, 0.03, 0.03]} scale={0.07} geometry={esf}><meshStandardMaterial color="#c0201a" /></mesh>
      <RBox p={[0, 0.45, 0]} s={[0.1, 0.9, 0.05]} r={0.04}>{M.vidrio()}</RBox>
      <mesh position={[0, 0.45, 0.028]}><planeGeometry args={[0.12, 0.25]} /><meshBasicMaterial color="#e84a3a" transparent opacity={0.55} /></mesh>
      <mesh position={[0, 0.06 + 0.4 * (temp + plato * 0.95 * 0) , 0.03]} scale={[1, sz(0.04 + 0.8 * temp), 1]}><planeGeometry args={[0.03, 1]} /><meshBasicMaterial color="#c0201a" /></mesh>
    </group>
    <group position={[lerp(0, 0.85, plato), 0.05 + Math.sin(plato * P) * 0.3, 0.45]} visible={plato > 0.01}><Tazon s={0.6} liq="#c88a3a" /><Vapor t={tt} p={[0, 0.15, 0]} o={0.5 * plato} h={0.6} s={0.15} /></group>
    
  </Estudio>;
}}</Stage>;

// ── 24 · EL TRAPO DE MANTA (21:27): el caldo de huesos se cuela por la manta; abajo queda dorado y claro; la manta se levanta con los huesos: ya dieron todo
const H24Manta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const D = dur(h), cuela = eio(tt, 0.1, 0.5 * D), sube = eio(tt, 0.62 * D, 0.82 * D);
  return <Estudio t={tt} cam={[0, 1.6, 2.6]} look={[0, 0.65, 0]} orbit={0.1}>
    <Olla p={[0, 0, 0]} mat="barro" nivel={0.15 + 0.6 * cuela} caldo="#e0a63a" t={tt} s={0.6} />
    <group position={[0, 0.5 + sube * 0.7, 0]} rotation={[0, 0, sube * 0.3]}>
      <mesh scale={[0.45, lerp(0.18, 0.28, sube), 0.45]} rotation={[P, 0, 0]}><sphereGeometry args={[1, 28, 14, 0, 6.29, 0, P2]} /><meshStandardMaterial color="#f4f0e6" roughness={1} side={THREE.DoubleSide} transparent opacity={0.92} /></mesh>
      {Array.from({ length: 7 }, (_, i) => <Hueso key={i} p={[(rn(i, 1) - 0.5) * 0.3, -0.08 - rn(i, 2) * 0.06, (rn(i, 3) - 0.5) * 0.3]} rot={[rn(i, 4) * 3, rn(i, 5) * 3, 0]} s={sz(1.1 * cl(cuela * 2))} />)}
      <mesh position={[0, 0.02, 0]} visible={sube > 0.05}><coneGeometry args={[0.07, 0.25 * sube + 0.001, 10]} /><meshStandardMaterial color="#f4f0e6" roughness={1} /></mesh></group>
    <group position={[-0.55, 1.1, 0]} rotation={[0, 0, -1.2 * cl(cuela * 3)]} visible={cuela < 0.98}><mesh geometry={lathe([[0, 0], [0.16, 0], [0.22, 0.14], [0.22, 0.3]])}>{M.barro("#7a3a20")}</mesh></group>
    {cuela > 0.05 && cuela < 0.95 && <Chorro a={[-0.38, 1.15, 0]} b={[0, 0.62, 0]} r={0.045} c="#c88a3a" o={0.88} />}
    <Vapor t={tt} p={[0, 0.55, 0]} o={0.3} h={0.8} s={0.25} />
    
  </Estudio>;
}}</Stage>;

// ── 25 · SÓLO SE TIRA EL CACAREO (22:19): la gallina cacarea; las ondas del sonido son lo único que vuela al bote de basura, y el bote se cierra
const Gallina: React.FC<{ p: V3; pico: number }> = ({ p, pico }) => <group position={p}>
  <mesh position={[0, 0.3, 0]} scale={[0.3, 0.26, 0.22]} geometry={esf} castShadow><meshStandardMaterial color="#a0582a" roughness={0.8} /></mesh>
  <mesh position={[-0.28, 0.42, 0]} rotation={[0, 0, 0.8]} scale={[0.14, 0.2, 0.14]} geometry={esf}><meshStandardMaterial color="#5a2e16" roughness={0.8} /></mesh>
  <mesh position={[0.22, 0.55, 0]} scale={0.12} geometry={esf} castShadow><meshStandardMaterial color="#a0582a" roughness={0.8} /></mesh>
  {[0, 1, 2].map((i) => <mesh key={i} position={[0.17 + i * 0.05, 0.69 - Math.abs(i - 1) * 0.02, 0]} scale={[0.03, 0.045, 0.015]} geometry={esf}><meshStandardMaterial color="#d0201a" /></mesh>)}
  <group position={[0.33, 0.55, 0]}><mesh rotation={[0, 0, -P2 + 0.25 * pico]} position={[0.03, 0.01, 0]}><coneGeometry args={[0.03, 0.08, 8]} /><meshStandardMaterial color="#f2b81a" /></mesh>
    <mesh rotation={[0, 0, -P2 - 0.25 * pico]} position={[0.03, -0.015, 0]}><coneGeometry args={[0.025, 0.07, 8]} /><meshStandardMaterial color="#e0a010" /></mesh></group>
  <mesh position={[0.3, 0.47, 0]} scale={[0.02, 0.04, 0.02]} geometry={esf}><meshStandardMaterial color="#d0201a" /></mesh>
  {[-1, 1].map((sd) => <mesh key={sd} position={[0.27, 0.58, sd * 0.09]} scale={0.014} geometry={esf}><meshStandardMaterial color="#111" /></mesh>)}
  {[-1, 1].map((sd) => <mesh key={"l" + sd} position={[0, 0.08, sd * 0.07]}><cylinderGeometry args={[0.012, 0.012, 0.16, 6]} /><meshStandardMaterial color="#e0a010" /></mesh>)}
</group>;
const H25Cacareo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const D = dur(h), canta = tt > 0.05 && tt < 0.55 * D, pico = canta ? Math.abs(Math.sin(tt * 14)) : 0, tapa = phys(tt, 0.72 * D, 6, 0.4);
  return <Estudio t={tt} cam={[0.1, 1.05, 2.35]} look={[0.15, 0.45, 0]} orbit={0.08} mesa={false}>
    <Suelo c="#8a6a48" />
    <Gallina p={[-0.55, 0, 0]} pico={pico} />
    {Array.from({ length: 6 }, (_, i) => { const a = 0.1 + i * (0.5 * D - 0.1) / 6, k = eio(tt, a, a + 1.4); if (k <= 0 || k >= 1) return null;
      return <mesh key={i} position={[lerp(-0.18, 0.65, k), 0.56 + Math.sin(k * P) * 0.25 - k * 0.1, 0]} rotation={[0, P2, 0]} scale={sz(0.16 + 0.16 * Math.sin(k * P))}><torusGeometry args={[1, 0.1, 8, 30, P * 0.7]} /><meshStandardMaterial color="#f6e6b0" emissive="#f6d070" emissiveIntensity={0.5} transparent opacity={1 - k * 0.3} /></mesh>; })}
    <group position={[0.75, 0, 0]}>
      <mesh position={[0, 0.27, 0]} castShadow><cylinderGeometry args={[0.24, 0.2, 0.54, 32]} /><meshStandardMaterial color="#3d5a3a" roughness={0.5} metalness={0.3} /></mesh>
      <group position={[-0.24, 0.55, 0]} rotation={[0, 0, (1 - cl(tapa)) * 1.6]}><mesh position={[0.24, 0.02, 0]}><cylinderGeometry args={[0.26, 0.26, 0.04, 32]} /><meshStandardMaterial color="#456a42" roughness={0.5} metalness={0.3} /></mesh></group>
    </group>
    
  </Estudio>;
}}</Stage>;

// ── 26 · LA CUENTA EN EL ÁBACO (25:21): dos ábacos de madera: el de la casa corre sus cuentas hasta 266; el de la fonda hasta 570
const Abaco: React.FC<{ p: V3; v: number[]; c: string }> = ({ p, v, c }) => <group position={p}>
  {[-1, 1].map((sd) => <RBox key={sd} p={[sd * 0.42, 0.35, 0]} s={[0.05, 0.7, 0.08]} r={0.015}>{M.madera("#6a4428")}</RBox>)}
  {[0, 0.68].map((y) => <RBox key={y} p={[0, 0.02 + y, 0]} s={[0.9, 0.05, 0.08]} r={0.015}>{M.madera("#6a4428")}</RBox>)}
  {[0, 1, 2].map((r) => { const y = 0.52 - r * 0.17, n = v[r]; return <group key={r}>
    <mesh position={[0, y, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.006, 0.006, 0.82, 6]} />{M.cromo()}</mesh>
    {Array.from({ length: 10 }, (_, i) => { const on = i < n, x = on ? -0.36 + i * 0.055 + Math.max(0, i - n + 1) * 0 : 0.36 - (9 - i) * 0.055;
      return <mesh key={i} position={[x, y, 0]} rotation={[0, 0, P2]} scale={[1, 1, 1]}><cylinderGeometry args={[0.026, 0.026, 0.045, 14]} /><meshStandardMaterial color={on ? c : "#d9c9a8"} roughness={0.4} /></mesh>; })}
  </group>; })}
</group>;
const H26Cuenta: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const D = dur(h), k1 = eio(tt, 0.1, 0.42 * D), k2 = eio(tt, 0.25 * D, 0.75 * D), dif = phys(tt, 0.8 * D, 6, 0.5);
  const cuentas = (tot: number, k: number) => { const v = Math.round(tot * k); return [Math.floor(v / 100), Math.floor(v / 10) % 10, v % 10]; };
  return <Estudio t={tt} cam={[0, 0.95, 2.15]} look={[0, 0.45, 0]} orbit={0.08}>
    <Abaco p={[-0.55, 0, 0]} v={cuentas(266, k1)} c="#3f8a4a" />
    <Abaco p={[0.55, 0, 0]} v={cuentas(570, k2)} c="#c0392b" />
    <Etq p={[-0.55, 0.86, 0.02]} txt={`$${Math.round(266 * k1)}`} w={0.62} h={0.28} bg="#e9d9b0" ink="#2a6a2a" s={phys(tt, 0.1, 6, 0.5)} />
    <Etq p={[0.55, 0.86, 0.02]} txt={`$${Math.round(570 * k2)}`} w={0.62} h={0.28} bg="#d9d4c8" ink="#7a2a14" s={phys(tt, 0.25 * D, 6, 0.5)} />
    
    
  </Estudio>;
}}</Stage>;

// ── 27 · LA RUTINA DEL DOMINGO (25:57): el pollo se parte y cada cosa vuela a su lugar del refri: la piel al frasco, los huesos a la bolsa, cada pieza a su traste; la puerta se cierra
const H27Resumen: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const D = dur(h), parte = eio(tt, 0.1, 0.45), st = (0.5 * D) / 6, cierra = eio(tt, 0.82 * D, 0.95 * D);
  const destinos: V3[] = [[-0.22, 1.37, -0.05], [0.18, 1.37, -0.05], [-0.22, 0.92, -0.05], [0.18, 0.92, -0.05], [-0.2, 0.47, -0.05], [0.18, 0.47, -0.05]];
  const vuela = (i: number) => eio(tt, 0.4 + i * st, 0.4 + (i + 0.9) * st);
  const cosa = (i: number) => i === 0 ? <Frasco s={0.6} nivel={0.6} c="#f4dcc0" /> : i === 1 ? <group><Hueso p={[0, 0.06, 0]} s={0.55} /><Hueso p={[0.02, 0.1, 0.03]} rot={[0, 1, 0]} s={0.5} /><RBox p={[0, 0.08, 0]} s={[0.28, 0.16, 0.2]} r={0.04}><meshPhysicalMaterial color="#eef8ff" transparent opacity={0.35} roughness={0.2} depthWrite={false} /></RBox></group>
    : <group>{i === 2 ? <Pierna p={[-0.1, 0.05, 0]} rot={[0, 0, -P2]} s={0.5} /> : i === 3 ? <Ala p={[-0.08, 0.05, 0]} s={0.5} /> : <Pechuga p={[0, 0.05, 0]} s={0.6} />}<RBox p={[0, 0.06, 0]} s={[0.28, 0.12, 0.2]} r={0.02}><meshPhysicalMaterial color="#f4fbff" transparent opacity={0.35} roughness={0.2} depthWrite={false} /></RBox><RBox p={[0, 0.125, 0]} s={[0.29, 0.015, 0.21]} r={0.006}><meshStandardMaterial color={["#3a7ac0", "#c0392b", "#3f8a4a", "#e0a020"][i - 2]} roughness={0.5} /></RBox></group>;
  return <Estudio t={tt} cam={[0.7, 1.35, 3.2]} look={[0.35, 0.85, 0]} orbit={0.1} mesa={false}>
    <Suelo c="#6a5440" />
    <Refri abre={1 - cierra} luz={1 - cierra}>{destinos.map((d, i) => { const k = vuela(i); return k > 0 ? <group key={i} position={[lerp(1.1, d[0], k), lerp(0.75, d[1], k) + Math.sin(k * P) * 0.35, lerp(0.6, d[2], k)]}>{cosa(i)}</group> : null; })}</Refri>
    <RBox p={[1.1, 0.35, 0.6]} s={[0.7, 0.7, 0.5]} r={0.02}>{M.madera("#7a5230")}</RBox>
    <Pollo p={[1.1, 0.71, 0.6]} s={sz(0.6 * (1 - parte))} />
    {Array.from({ length: 6 }, (_, i) => { const k = vuela(i); return k <= 0 && parte > 0.5 ? <group key={i} position={[1.1 + (i - 2.5) * 0.09, 0.73, 0.6 + (i % 2) * 0.1]}><Pechuga s={0.4} /></group> : null; })}
    
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  refri: H1Refri, siete: H2Siete, basura: H3Basura, pollero: H4Pollero, hielera: H5Hielera, salpica: H6Salpica, ocho: H7Ocho, piel: H8Piel,
  tabla: H9Tabla, tres: H10Tres, espuma: H11Espuma, frascos: H12Frascos, hebras: H13Hebras, molcajete: H14Molcajete, ticket: H15Ticket,
  tuberia: H16Tuberia, arroz: H17Arroz, veinte: H18Veinte, flota: H19Flota, congela: H20Congela, salsa: H21Salsa, chicharron: H22Chicharron,
  recalentar: H23Recalentar, manta: H24Manta, cacareo: H25Cacareo, cuenta: H26Cuenta, resumen: H27Resumen,
};
