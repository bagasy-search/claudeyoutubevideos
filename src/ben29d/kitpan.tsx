// ben29 · KIT DE PANADERÍA 3D (compartido por los 5 videos): hogaza, rebanada, bolsa de pan de molde, bol, masa,
// reloj, moneda, frasco, tela. Son PIEZAS, no componentes: cada componente de heroes_<slug>.tsx arma su propia escena con esto.
import React, { useMemo } from "react";
import * as THREE from "three";
import { cl, lerp } from "./ckit";
import { ctex, lathe, M, rn, V3 } from "./estudio3d";

export const P = Math.PI, P2 = P / 2;
const CR = { pale: new THREE.Color("#ead2a2"), gold: new THREE.Color("#c98a42"), dark: new THREE.Color("#6b3a1c") };
// color de corteza: 0 cruda/pálida → 0,5 dorada → 1 castaña
export const corteza = (b: number) => b < 0.5 ? CR.pale.clone().lerp(CR.gold, b * 2) : CR.gold.clone().lerp(CR.dark, (b - 0.5) * 2);

// hogaza: esfera aplastada con bultos deterministas + greña (el corte que abre) + harina en la panza
const hogGeo = (() => { const g = new THREE.SphereGeometry(1, 64, 40), p = g.attributes.position as THREE.BufferAttribute, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = 1 + 0.025 * Math.sin(v.x * 9 + v.z * 5) + 0.02 * Math.sin(v.z * 13 - v.y * 7); v.multiplyScalar(n); if (v.y < 0) v.y *= 0.35; p.setXYZ(i, v.x, v.y, v.z); }
  g.computeVertexNormals(); return g; })();
const greTex = () => ctex("grena", 256, 64, (g) => { const gr = g.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, "#f2e2bd"); gr.addColorStop(0.5, "#d8b47a"); gr.addColorStop(1, "#f2e2bd"); g.fillStyle = gr; g.fillRect(0, 0, 256, 64);
  for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(150,100,50,${0.15 * rn(i, 3)})`; g.fillRect(rn(i, 1) * 256, rn(i, 2) * 64, 3, 2); } });
const cortTex = () => rep(ctex("corteza", 512, 256, (g) => { g.fillStyle = "#ffffff"; g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 1400; i++) { const r = 1 + rn(i, 4) ** 2 * 9, d = rn(i, 5); g.fillStyle = d < 0.55 ? `rgba(90,45,15,${0.08 + 0.18 * rn(i, 6)})` : d < 0.85 ? `rgba(255,236,200,${0.15 + 0.2 * rn(i, 6)})` : `rgba(60,25,8,${0.25 * rn(i, 6)})`;
    g.beginPath(); g.ellipse(rn(i, 1) * 512, rn(i, 2) * 256, r * 1.6, r, rn(i, 3) * 3, 0, 7); g.fill(); }
  for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(70,35,12,${0.2 + 0.2 * rn(i, 9)})`; g.lineWidth = 1 + rn(i, 8) * 2; g.beginPath(); const x = rn(i, 7) * 512, y = rn(i, 10) * 256; g.moveTo(x, y); g.lineTo(x + (rn(i, 11) - 0.5) * 40, y + (rn(i, 12) - 0.5) * 14); g.stroke(); } }));
const harTex = () => ctex("harina", 256, 256, (g) => { g.fillStyle = "#000"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 260; i++) { const a = rn(i, 1) * 6.28, d = Math.sqrt(rn(i, 2)) * 110, r = 3 + rn(i, 3) * 16; const gr = g.createRadialGradient(128 + Math.cos(a) * d, 128 + Math.sin(a) * d, 0, 128 + Math.cos(a) * d, 128 + Math.sin(a) * d, r);
    gr.addColorStop(0, `rgba(255,255,255,${0.25 + 0.4 * rn(i, 4)})`); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); } });
export const Hogaza: React.FC<{ p?: V3; rot?: V3; s?: number; bake?: number; open?: number; flour?: number; rise?: number; gloss?: number }> = ({ p, rot, s = 1, bake = 1, open = 1, flour = 0.4, rise = 1, gloss = 0 }) => (
  <group position={p} rotation={rot} scale={[s, s * lerp(0.75, 1, rise), s]}>
    <mesh geometry={hogGeo} scale={[0.5, 0.36, 0.42]} position={[0, 0.0, 0]} castShadow receiveShadow>
      <meshPhysicalMaterial color={corteza(bake)} map={cortTex()} bumpMap={cortTex()} bumpScale={2.5} roughness={0.8 - 0.3 * gloss} clearcoat={0.08 + 0.5 * gloss} clearcoatRoughness={0.6} sheen={0.5} sheenColor="#ffe2b0" />
    </mesh>
    {/* greña: abre con open, color de miga más claro */}
    <mesh position={[0, 0.355, 0]} rotation={[-P2, 0, 0.25]} scale={[0.62, 0.02 + 0.07 * open, 1]}><planeGeometry args={[0.6, 1]} /><meshStandardMaterial map={greTex()} color={corteza(bake * 0.55)} roughness={0.8} /></mesh>
    <mesh position={[0.02, 0.36, 0.035 * open]} rotation={[-P2 + 0.5 * open, 0, 0.25]} scale={[0.6, 0.06 * open + 0.001, 1]}><planeGeometry args={[0.6, 1]} /><meshStandardMaterial color={corteza(Math.min(1, bake + 0.15))} roughness={0.7} side={THREE.DoubleSide} /></mesh>
    {flour > 0 && <mesh position={[0, 0.3, 0]} rotation={[-P2, 0, 0]} scale={[0.42, 0.34, 1]}><circleGeometry args={[1, 32]} /><meshStandardMaterial color="#fbf6ea" alphaMap={harTex()} transparent opacity={0.8 * flour} roughness={1} depthWrite={false} /></mesh>}
  </group>
);

// rebanada: forma de pan (cuadrado con copete) extruida; cara = miga, canto = corteza
const sliceShape = (() => { const s = new THREE.Shape(); s.moveTo(-0.5, -0.5); s.lineTo(0.5, -0.5); s.lineTo(0.5, 0.25); s.bezierCurveTo(0.62, 0.62, 0.2, 0.68, 0, 0.62); s.bezierCurveTo(-0.2, 0.68, -0.62, 0.62, -0.5, 0.25); s.lineTo(-0.5, -0.5); return s; })();
const sliceGeo = new THREE.ExtrudeGeometry(sliceShape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.015, bevelSegments: 2, curveSegments: 24 });
const migaTex = (key: string, holes: number, base: string) => ctex("miga" + key, 256, 256, (g) => { g.fillStyle = base; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < holes; i++) { const big = holes < 500, r = 1 + rn(i, 4) ** 3 * (big ? 12 : 2.2); g.fillStyle = big ? `rgba(150,110,60,${0.25 + 0.3 * rn(i, 5)})` : `rgba(190,160,110,${0.12 + 0.14 * rn(i, 5)})`; g.beginPath(); g.ellipse(rn(i, 1) * 256, rn(i, 2) * 256, r * 1.3, r, rn(i, 3) * 3, 0, 7); g.fill(); } });
const rep = (t: THREE.Texture) => { if (t.wrapS !== THREE.RepeatWrapping) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.needsUpdate = true; } return t; };
export const Rebanada: React.FC<{ p?: V3; rot?: V3; s?: number; kind?: "molde" | "pueblo"; dry?: number; sq?: number }> = ({ p, rot, s = 1, kind = "molde", dry = 0, sq = 0 }) => (
  <group position={p} rotation={rot} scale={[s * (1 + 0.08 * sq), s * (1 - 0.1 * sq), s * (1 - 0.65 * sq)]}>
    <mesh geometry={sliceGeo} castShadow receiveShadow>
      <meshStandardMaterial attach="material-0" map={rep(kind === "molde" ? migaTex("m", 900, "#fbf6ec") : migaTex("p", 260, "#efdcb2"))} color={kind === "molde" ? "#ffffff" : new THREE.Color("#ffffff").lerp(new THREE.Color("#d9c39a"), dry)} roughness={0.95} />
      <meshStandardMaterial attach="material-1" color={kind === "molde" ? "#c99a5c" : corteza(0.95)} roughness={0.75} />
    </mesh>
  </group>
);

// bolsa de pan de molde: plástico transparente con las rebanadas paradas adentro y el cuello torcido con su clip
export const Bolsa: React.FC<{ p?: V3; rot?: V3; s?: number; n?: number; label?: THREE.Texture }> = ({ p, rot, s = 1, n = 12, label }) => (
  <group position={p} rotation={rot} scale={s}>
    {Array.from({ length: n }, (_, i) => <Rebanada key={i} p={[0, 0.5, -0.5 + i * 0.09]} s={0.95} />)}
    <mesh position={[0, 0.58, 0.05]}><boxGeometry args={[1.12, 1.32, 1.28]} /><meshPhysicalMaterial color="#ffffff" roughness={0.15} transparent opacity={0.16} clearcoat={1} envMapIntensity={1.4} depthWrite={false} /></mesh>
    <mesh position={[0, 0.58, 0.72]} rotation={[P2, 0, 0]}><coneGeometry args={[0.32, 0.4, 16, 1, true]} /><meshPhysicalMaterial color="#ffffff" roughness={0.2} transparent opacity={0.22} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[0, 0.58, 0.95]}><boxGeometry args={[0.16, 0.12, 0.03]} /><meshStandardMaterial color="#2f6fb8" roughness={0.5} /></mesh>
    {label && <mesh position={[0.565, 0.6, 0.05]} rotation={[0, P2, 0]}><planeGeometry args={[1.1, 0.9]} /><meshStandardMaterial map={label} roughness={0.5} transparent /></mesh>}
  </group>
);

// bol de loza crema (y su versión de vidrio)
const bolGeo = lathe([[0, 0], [0.32, 0], [0.38, 0.03], [0.62, 0.28], [0.7, 0.46], [0.72, 0.5], [0.68, 0.5], [0.6, 0.3], [0.34, 0.06], [0, 0.05]], 48);
export const Bol: React.FC<{ p?: V3; rot?: V3; s?: number; vidrio?: boolean; children?: React.ReactNode }> = ({ p, rot, s = 1, vidrio, children }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={bolGeo} castShadow receiveShadow>{vidrio ? M.vidrio() : <meshPhysicalMaterial color="#efe6d2" roughness={0.3} clearcoat={0.7} side={THREE.DoubleSide} />}</mesh>
    {!vidrio && <mesh position={[0, 0.47, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.7, 0.012, 8, 64]} /><meshStandardMaterial color="#2c5a8a" roughness={0.4} /></mesh>}
    {children}
  </group>
);

// masa: domo blando que crece (rise 0..1) con burbujas en la piel; rough = desgreñada (recién mezclada)
const masaGeo = (() => { const g = new THREE.SphereGeometry(1, 48, 24, 0, 2 * P, 0, P2), p = g.attributes.position as THREE.BufferAttribute, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 + 0.03 * Math.sin(v.x * 11) * Math.sin(v.z * 9)); p.setXYZ(i, v.x, v.y, v.z); } g.computeVertexNormals(); return g; })();
export const Masa: React.FC<{ p?: V3; r?: number; rise?: number; rough?: number; t?: number; bub?: number; c?: string }> = ({ p, r = 0.5, rise = 0.5, rough = 0, t = 0, bub = 1, c = "#efdcb4" }) => (
  <group position={p}>
    <mesh geometry={masaGeo} scale={[r * (0.85 + 0.15 * rise), r * (0.35 + 0.45 * rise), r * (0.85 + 0.15 * rise)]} castShadow receiveShadow>
      <meshPhysicalMaterial color={c} roughness={0.55 + 0.35 * rough} sheen={0.8} sheenColor="#fff1d6" clearcoat={0.2 * (1 - rough)} flatShading={rough > 0.5} />
    </mesh>
    {Array.from({ length: 16 }, (_, i) => { const a = rn(i, 1) * 6.28, rr = Math.sqrt(rn(i, 2)) * 0.7, x = Math.cos(a) * rr, z = Math.sin(a) * rr, hgt = Math.sqrt(Math.max(0, 1 - rr * rr)), k = cl(rise * 1.6 - 0.5 - rn(i, 3) * 0.4) * bub;
      return <mesh key={i} position={[x * r * (0.85 + 0.15 * rise), hgt * r * (0.35 + 0.45 * rise), z * r * (0.85 + 0.15 * rise)]} scale={0.001 + r * 0.05 * k * (0.6 + rn(i, 4)) * (1 + 0.05 * Math.sin(t * 2 + i))}>
        <sphereGeometry args={[1, 12, 8, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color="#f6e8c8" roughness={0.2} clearcoat={1} transparent opacity={0.85} /></mesh>; })}
  </group>
);

// esfera de reloj (números romanos de campanario o arábigos de cocina)
export const relojTex = (romano = false) => ctex("reloj" + romano, 512, 512, (g) => {
  const gr = g.createRadialGradient(256, 230, 30, 256, 256, 250); gr.addColorStop(0, "#fbf6e8"); gr.addColorStop(1, "#e2d6b8"); g.fillStyle = gr; g.beginPath(); g.arc(256, 256, 248, 0, 7); g.fill();
  g.strokeStyle = "#2a1c12"; g.lineWidth = 10; g.stroke(); g.fillStyle = "#2a1c12"; g.textAlign = "center"; g.textBaseline = "middle";
  const R = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
  g.font = romano ? "700 54px Georgia, serif" : "700 64px Georgia, serif";
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 2 * P - P2; g.fillText(romano ? R[i] : String(i === 0 ? 12 : i), 256 + Math.cos(a) * 190, 256 + Math.sin(a) * 190); }
  for (let i = 0; i < 60; i++) { const a = (i / 60) * 2 * P; g.lineWidth = i % 5 ? 2 : 5; g.beginPath(); g.moveTo(256 + Math.cos(a) * 236, 256 + Math.sin(a) * 236); g.lineTo(256 + Math.cos(a) * (i % 5 ? 226 : 218), 256 + Math.sin(a) * (i % 5 ? 226 : 218)); g.stroke(); }
});
// reloj: horas h (0..12, decimales) → agujas
export const Reloj: React.FC<{ p?: V3; rot?: V3; s?: number; h: number; romano?: boolean; marco?: string }> = ({ p, rot, s = 1, h, romano, marco = "#3a2416" }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh position={[0, 0, -0.04]} rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.56, 0.56, 0.08, 64]} /><meshStandardMaterial color={marco} roughness={0.5} metalness={0.3} /></mesh>
    <mesh><circleGeometry args={[0.5, 64]} /><meshStandardMaterial map={relojTex(romano)} roughness={0.6} /></mesh>
    <mesh position={[0, 0, 0.012]} rotation={[0, 0, -(h / 12) * 2 * P]}><mesh position={[0, 0.12, 0]}><boxGeometry args={[0.035, 0.27, 0.01]} /><meshStandardMaterial color="#1a120c" metalness={0.5} roughness={0.3} /></mesh></mesh>
    <mesh position={[0, 0, 0.02]} rotation={[0, 0, -(h % 1) * 2 * P]}><mesh position={[0, 0.18, 0]}><boxGeometry args={[0.022, 0.38, 0.01]} /><meshStandardMaterial color="#1a120c" metalness={0.5} roughness={0.3} /></mesh></mesh>
    <mesh position={[0, 0, 0.03]}><circleGeometry args={[0.03, 16]} />{M.cromo("#b8962e")}</mesh>
    <mesh position={[0, 0, 0.03]}><ringGeometry args={[0.5, 0.56, 64]} />{M.cromo("#b8962e")}</mesh>
  </group>
);

export const Moneda: React.FC<{ p: V3; rot?: V3; s?: number; c?: string }> = ({ p, rot, s = 0.09, c = "#c9a64a" }) => (
  <mesh position={p} rotation={rot} castShadow><cylinderGeometry args={[s, s, s * 0.16, 28]} />{M.cromo(c)}</mesh>
);

// frasco de vidrio con contenido (nivel 0..1) y tapa
const frascoGeo = lathe([[0, 0], [0.3, 0], [0.33, 0.04], [0.34, 0.7], [0.27, 0.8], [0.26, 0.88]]);
export const Frasco: React.FC<{ p?: V3; s?: number; nivel?: number; c?: string; tapa?: boolean; children?: React.ReactNode }> = ({ p, s = 1, nivel = 0.5, c = "#d6a35a", tapa = true, children }) => (
  <group position={p} scale={s}>
    {nivel > 0.01 && <mesh position={[0, 0.02 + 0.34 * nivel, 0]}><cylinderGeometry args={[0.32, 0.32, 0.68 * nivel, 32]} /><meshStandardMaterial color={c} roughness={0.9} /></mesh>}
    <mesh geometry={frascoGeo} castShadow>{M.vidrio()}</mesh>
    {tapa && <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.28, 0.28, 0.07, 28]} />{M.cromo("#b8962e")}</mesh>}
    {children}
  </group>
);

// tela de lino: plano con pliegues que se cierra (k 0 abierta → 1 envuelve) sobre un radio
export const Lino: React.FC<{ p?: V3; k: number; r?: number; c?: string }> = ({ p, k, r = 0.5, c = "#e9e1cf" }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(2.4 * r, 2.4 * r, 24, 24), [r]);
  const pos = geo.attributes.position as THREE.BufferAttribute, base = useMemo(() => Float32Array.from(pos.array as Float32Array), [geo]);
  for (let i = 0; i < pos.count; i++) {
    const x = base[i * 3], y = base[i * 3 + 1], d = Math.hypot(x, y), a = Math.atan2(y, x), lift = cl((d - r * 0.55) / (r * 0.7)) * k;
    const rr = lerp(d, r * 0.95 * Math.max(0.2, 1 - lift * 0.35), lift), z = Math.sin(lift * P2) * r * 1.0 + 0.01 * Math.sin(x * 20) * Math.cos(y * 17);
    pos.setXYZ(i, Math.cos(a) * rr, Math.sin(a) * rr, z);
  }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return <mesh geometry={geo} position={p} rotation={[-P2, 0, 0]} castShadow receiveShadow><meshStandardMaterial color={c} roughness={0.92} side={THREE.DoubleSide} /></mesh>;
};

// llama de leña: lenguas en sprite (gota con degradé, aditivo), ondulan ≤1,5 Hz; la luz SIEMPRE montada
const llamaTex = () => ctex("llama", 128, 256, (g) => { for (let k = 0; k < 3; k++) { const gr = g.createRadialGradient(64, 200, 4, 64, 170, 110 - k * 30);
    gr.addColorStop(0, k === 2 ? "rgba(255,250,220,0.9)" : k === 1 ? "rgba(255,200,90,0.7)" : "rgba(255,110,30,0.55)"); gr.addColorStop(1, "rgba(255,80,20,0)"); g.fillStyle = gr;
    g.beginPath(); g.moveTo(64, 10 + k * 40); g.bezierCurveTo(110 - k * 10, 120, 118 - k * 14, 230, 64, 248); g.bezierCurveTo(10 + k * 14, 230, 18 + k * 10, 120, 64, 10 + k * 40); g.fill(); } });
export const Fuego: React.FC<{ p: V3; f: number; t: number; s?: number }> = ({ p, f, t, s = 1 }) => (
  <group position={p} scale={s}>
    {Array.from({ length: 11 }, (_, i) => { const x = (rn(i, 1) - 0.5) * 0.62, hgt = (0.3 + 0.32 * rn(i, 2)) * Math.max(0.001, f) * (0.88 + 0.12 * Math.sin(t * (5 + (i % 4)) + i * 1.7));
      return <sprite key={i} position={[x + 0.03 * Math.sin(t * 4 + i), hgt * 0.42, (rn(i, 3) - 0.5) * 0.3 + 0.01 * i]} scale={[hgt * 0.55, hgt, 1]}>
        <spriteMaterial map={llamaTex()} transparent opacity={0.5 * cl(f * 3)} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>; })}
    {[0, 1, 2].map((i) => <mesh key={"b" + i} position={[(i - 1) * 0.2, 0.03, 0.02 * i]} rotation={[0, 0.6 * i, P2]} castShadow><cylinderGeometry args={[0.045, 0.05, 0.6, 10]} /><meshStandardMaterial color="#3a2516" roughness={0.95} emissive="#ff5a1a" emissiveIntensity={0.25 * f} /></mesh>)}
    <pointLight position={[0, 0.35, 0.2]} intensity={0.01 + 3 * f * (0.92 + 0.08 * Math.sin(t * 7))} distance={3} color="#ff9a40" />
  </group>
);
