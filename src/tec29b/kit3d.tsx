// kit3d · utilería 3D compartida por los 5 videos de Cuca (olla, mano, llama, plato, cuchara, foto con espesor, onda).
// Va dentro de <Estudio>. Render SÓLO en el farm.
import React, { useMemo } from "react";
import { continueRender, delayRender } from "remotion";
import * as THREE from "three";
import { rbox } from "./fx3d";
import { cl, Frijol, lathe, M, rn, V3 } from "./estudio3d";

const P2 = Math.PI / 2;
// foto real como textura (bloquea el cuadro hasta que carga: nunca sale una textura vacía)
const fotoCache = new Map<string, THREE.Texture>();
export const useFoto = (src: string) => {
  const [hd] = React.useState(() => (fotoCache.has(src) ? null : delayRender("foto " + src)));
  return useMemo(() => {
    let t = fotoCache.get(src);
    if (!t) {
      t = new THREE.TextureLoader().load(src, () => { if (hd !== null) continueRender(hd); }, undefined, () => { if (hd !== null) continueRender(hd); });
      t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; fotoCache.set(src, t);
    } else if (hd !== null) continueRender(hd);
    return t;
  }, [src, hd]);
};
// tarjeta-foto con espesor y borde de papel
export const Foto3D: React.FC<{ src: string; p?: V3; rot?: V3; w?: number; h?: number; dim?: number; children?: React.ReactNode }> = ({ src, p, rot, w = 1.2, h = 0.8, dim = 0, children }) => {
  const tx = useFoto(src);
  return <group position={p} rotation={rot}>
    <mesh geometry={rbox(w + 0.06, h + 0.06, 0.02, 0.01)} castShadow receiveShadow><meshStandardMaterial color="#f1ead8" roughness={0.85} /></mesh>
    <mesh position={[0, 0, 0.0115]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={tx} roughness={0.55} color={new THREE.Color(1 - dim, 1 - dim, 1 - dim)} /></mesh>
    {children}
  </group>;
};
// mano estilizada (arcilla tono piel), dedos hacia -z; pinza 0 = abierta, 1 = cerrada
const piel = "#c98e6a";
export const Mano: React.FC<{ p: V3; rot?: V3; pinza?: number; dedos?: number; s?: number }> = ({ p, rot, pinza = 0, dedos = 4, s = 1 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={rbox(0.36, 0.1, 0.4, 0.05)} castShadow><meshStandardMaterial color={piel} roughness={0.6} /></mesh>
    <mesh position={[0, 0, 0.42]} rotation={[P2, 0, 0]} castShadow><capsuleGeometry args={[0.1, 0.4, 6, 12]} /><meshStandardMaterial color="#e9e2d6" roughness={0.8} /></mesh>
    {Array.from({ length: dedos }, (_, i) => <group key={i} position={[-0.135 + i * (0.27 / Math.max(1, dedos - 1)), 0, -0.2]} rotation={[-pinza * 1.1, 0, 0]}>
      <mesh position={[0, 0, -0.12]} rotation={[P2, 0, 0]} castShadow><capsuleGeometry args={[0.038, 0.18 - Math.abs(i - 1.5) * 0.02, 6, 10]} /><meshStandardMaterial color={piel} roughness={0.6} /></mesh></group>)}
    <group position={[0.2, 0, 0.02]} rotation={[0, -0.6 + pinza * 0.9, -pinza * 0.5]}>
      <mesh position={[0.1, 0, -0.08]} rotation={[P2, 0.5, 0]} castShadow><capsuleGeometry args={[0.042, 0.16, 6, 10]} /><meshStandardMaterial color={piel} roughness={0.6} /></mesh></group>
  </group>
);
// olla (barro / peltre / vidrio) con caldo, frijoles y hervor
const ollaGeo = lathe([[0, 0], [0.5, 0], [0.62, 0.12], [0.68, 0.42], [0.64, 0.7], [0.6, 0.76], [0.66, 0.8]]);
export const Olla: React.FC<{ p?: V3; rot?: V3; mat?: "barro" | "peltre" | "vidrio"; nivel?: number; caldo?: string; frijol?: number; hinchado?: number; fc?: string; hervor?: number; t?: number; s?: number; children?: React.ReactNode }> =
  ({ p, rot, mat = "barro", nivel = 0, caldo = "#5a2a1a", frijol = 0, hinchado = 0, fc = "#5a2418", hervor = 0, t = 0, s = 1, children }) => (
  <group position={p} rotation={rot} scale={s}>
    {nivel > 0.01 && <mesh position={[0, 0.02 + 0.37 * nivel, 0]}><cylinderGeometry args={[0.6 + 0.06 * Math.min(1, nivel * 1.4), 0.52, 0.74 * nivel, 40]} />{M.liquido(caldo, mat === "vidrio" ? 0.75 : 0.96)}</mesh>}
    {Array.from({ length: frijol }, (_, i) => { const a = rn(i, 11) * 6.28, r = Math.sqrt(rn(i, 12)) * 0.48, y = 0.06 + (i % 5) * 0.05 + 0.03 * Math.sin(t * 7 + i) * hervor;
      return <Frijol key={i} p={[Math.cos(a) * r, y, Math.sin(a) * r]} rot={[rn(i, 13) * 3, rn(i, 14) * 6, 0]} s={0.05} c={fc} hinchado={hinchado} />; })}
    {hervor > 0 && nivel > 0 && Array.from({ length: 10 }, (_, i) => { const k = (t * 1.6 + rn(i, 15)) % 1;
      return <mesh key={"b" + i} position={[(rn(i, 16) - 0.5) * 0.8, 0.04 + 0.74 * nivel, (rn(i, 17) - 0.5) * 0.8]} scale={0.001 + 0.045 * hervor * Math.sin(k * Math.PI)}><sphereGeometry args={[1, 10, 8]} />{M.liquido("#8a5a40", 0.7)}</mesh>; })}
    <mesh geometry={ollaGeo} castShadow receiveShadow>{mat === "vidrio" ? M.vidrio() : mat === "peltre" ? <meshPhysicalMaterial color="#2c4a6e" roughness={0.25} clearcoat={1} side={THREE.DoubleSide} /> : <meshStandardMaterial color="#9a4f2c" roughness={0.62} side={THREE.DoubleSide} />}</mesh>
    {mat === "barro" && [-1, 1].map((k) => <mesh key={k} position={[k * 0.68, 0.62, 0]} rotation={[0, k > 0 ? 0 : Math.PI, P2]} castShadow><torusGeometry args={[0.09, 0.03, 8, 16, Math.PI]} /><meshStandardMaterial color="#8a4526" roughness={0.65} /></mesh>)}
    {children}
  </group>
);
// llama de gas: corona de conos; f = tamaño 0..1
export const Llama: React.FC<{ p: V3; f: number; t: number; r?: number }> = ({ p, f, t, r = 0.32 }) => (
  <group position={p}>
    <mesh rotation={[P2, 0, 0]}><torusGeometry args={[r, 0.035, 8, 32]} />{M.hierro()}</mesh>
    {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * 6.28, h = (0.05 + 0.24 * f) * (0.85 + 0.15 * Math.sin(t * 9 + i * 1.7));
      return <mesh key={i} position={[Math.cos(a) * r, h / 2 + 0.02, Math.sin(a) * r]} rotation={[Math.sin(a) * 0.3 * f, 0, -Math.cos(a) * 0.3 * f]} visible={f > 0.02}>
        <coneGeometry args={[0.035, h, 8]} /><meshBasicMaterial color={new THREE.Color("#3a7bff").lerp(new THREE.Color("#ffb347"), 0.3 * f)} transparent opacity={0.85} toneMapped={false} /></mesh>; })}
    {/* luz siempre montada (nunca cond && <Light>: destella) */}
    <pointLight position={[0, 0.2, 0]} intensity={0.01 + 4 * f} distance={2.5} color="#6aa0ff" />
  </group>
);
export const Plato: React.FC<{ p?: V3; rot?: V3; s?: number; c?: string; children?: React.ReactNode }> = ({ p, rot, s = 1, c = "#f3efe6", children }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={lathe([[0, 0], [0.3, 0], [0.42, 0.035], [0.46, 0.05]])} castShadow receiveShadow><meshPhysicalMaterial color={c} roughness={0.18} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
    {children}
  </group>
);
// cuchara: el cuenco en el origen, el mango hacia +z
export const Cuchara: React.FC<{ p: V3; rot?: V3; s?: number; mat?: "madera" | "cromo"; children?: React.ReactNode }> = ({ p, rot, s = 1, mat = "madera", children }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh scale={[0.22, 0.07, 0.3]} castShadow><sphereGeometry args={[1, 24, 12, 0, 6.28, Math.PI / 2, Math.PI / 2]} />{mat === "cromo" ? M.cromo() : <meshStandardMaterial color="#b07a48" roughness={0.6} side={THREE.DoubleSide} />}</mesh>
    <mesh position={[0, 0.02, 0.75]} rotation={[P2 - 0.08, 0, 0]} castShadow><cylinderGeometry args={[0.03, 0.04, 0.95, 10]} />{mat === "cromo" ? M.cromo() : M.madera("#a06a3c")}</mesh>
    {children}
  </group>
);
// onda en un líquido (anillo que se abre)
export const Onda: React.FC<{ p: V3; t: number; a: number; r?: number }> = ({ p, t, a, r = 0.6 }) => { const k = cl((t - a) / 1.2);
  return <mesh position={p} rotation={[-P2, 0, 0]} scale={0.05 + k * r} visible={k > 0 && k < 1}><ringGeometry args={[0.9, 1, 40]} /><meshBasicMaterial color="#fff4e0" transparent opacity={0.5 * (1 - k)} depthWrite={false} /></mesh>; };
// chorro de líquido entre dos puntos (cilindro orientado)
export const Chorro: React.FC<{ a: V3; b: V3; r?: number; c?: string; o?: number }> = ({ a, b, r = 0.035, c = "#c98a3a", o = 0.9 }) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), L = A.distanceTo(B), mid = A.clone().add(B).multiplyScalar(0.5);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  return <mesh position={mid} quaternion={q}><cylinderGeometry args={[r, r * 0.8, Math.max(0.001, L), 12]} />{M.liquido(c, o)}</mesh>;
};
