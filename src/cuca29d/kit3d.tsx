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
// mano (r5): palma con nudillos, dedos de dos falanges con uña, pulgar opuesto y manga bordada; dedos hacia -z; pinza 0 abierta → 1 cerrada
const piel = "#b8785a";
const Piel = () => <meshPhysicalMaterial color={piel} roughness={0.55} sheen={0.6} sheenColor="#ffcfb0" clearcoat={0.15} />;
const Dedo: React.FC<{ L: number; r: number; k: number }> = ({ L, r, k }) => (
  <group rotation={[-k * 0.9, 0, 0]}>
    <mesh position={[0, 0, -L * 0.5]} rotation={[P2, 0, 0]} castShadow><capsuleGeometry args={[r, L, 6, 12]} /><Piel /></mesh>
    <group position={[0, 0, -L]} rotation={[-k * 1.0, 0, 0]}>
      <mesh position={[0, 0, -L * 0.4]} rotation={[P2, 0, 0]} castShadow><capsuleGeometry args={[r * 0.9, L * 0.75, 6, 12]} /><Piel /></mesh>
      <mesh position={[0, r * 0.75, -L * 0.62]} rotation={[-P2 + 0.25, 0, 0]} scale={[1, 1.3, 1]}><circleGeometry args={[r * 0.72, 16]} /><meshPhysicalMaterial color="#e6b7a2" roughness={0.25} clearcoat={1} /></mesh>
    </group>
  </group>);
export const Mano: React.FC<{ p: V3; rot?: V3; pinza?: number; dedos?: number; s?: number }> = ({ p, rot, pinza = 0, dedos = 4, s = 1 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={rbox(0.34, 0.1, 0.36, 0.05)} castShadow><Piel /></mesh>
    {Array.from({ length: dedos }, (_, i) => { const x = -0.12 + i * (0.24 / Math.max(1, dedos - 1)), L = 0.1 - Math.abs(i - (dedos - 1) / 2) * 0.012;
      return <group key={i} position={[x, 0.005, -0.18]}>
        <mesh position={[0, 0.03, 0]} castShadow><sphereGeometry args={[0.04, 12, 10]} /><Piel /></mesh>
        <Dedo L={L} r={0.034} k={pinza} /></group>; })}
    <group position={[0.17, -0.01, -0.02]} rotation={[0, -0.7 + pinza * 0.8, -0.4 - pinza * 0.4]}><Dedo L={0.08} r={0.038} k={pinza * 0.4} /></group>
    <mesh position={[0, 0, 0.36]} rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.15, 0.17, 0.4, 20]} /><meshStandardMaterial color="#f1ead8" roughness={0.85} /></mesh>
    <mesh position={[0, 0, 0.17]} rotation={[P2, 0, 0]}><torusGeometry args={[0.152, 0.018, 8, 24]} /><meshStandardMaterial color="#b8281c" roughness={0.7} /></mesh>
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
// chorro (r5): cinta de líquido que ondula, se ensancha al pegar y abre una corona de gotas; t anima la ondulación
export const Chorro: React.FC<{ a: V3; b: V3; r?: number; c?: string; o?: number; t?: number; splash?: boolean }> = ({ a, b, r = 0.035, c = "#c98a3a", o = 0.9, t = 0, splash = true }) => {
  const N = 7, A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), up = new THREE.Vector3(0, 1, 0);
  const pt = (u: number) => { const q = A.clone().lerp(B, u); q.y -= 0.12 * Math.sin(u * Math.PI) * (A.distanceTo(B) > 0.8 ? 1 : 0.3); q.x += 0.02 * Math.sin(t * 13 + u * 11) * u; q.z += 0.015 * Math.cos(t * 11 + u * 9) * u; return q; };
  const segs = Array.from({ length: N }, (_, i) => { const P0 = pt(i / N), P1 = pt((i + 1) / N), L = P0.distanceTo(P1), mid = P0.clone().add(P1).multiplyScalar(0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(up, P1.clone().sub(P0).normalize()); const u = (i + 0.5) / N, rr = r * (1.15 - 0.4 * u + 0.08 * Math.sin(t * 17 + i));
    return <mesh key={i} position={mid} quaternion={q}><cylinderGeometry args={[rr, rr * 0.92, L * 1.08, 14]} /><meshPhysicalMaterial color={c} roughness={0.05} transparent opacity={o} clearcoat={1} envMapIntensity={1.5} depthWrite={false} /></mesh>; });
  return <>{segs}
    {splash && <group position={[b[0], b[1] + 0.01, b[2]]}>
      <mesh rotation={[-P2, 0, 0]}><circleGeometry args={[r * 2.6, 24]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.35 * o} depthWrite={false} /></mesh>
      {Array.from({ length: 9 }, (_, i) => { const k = (t * 2.4 + rn(i, 3)) % 1, an = (i / 9) * 6.28; return <mesh key={i} position={[Math.cos(an) * r * (1.5 + 3 * k), 0.12 * Math.sin(k * Math.PI), Math.sin(an) * r * (1.5 + 3 * k)]} scale={r * 0.45 * (1 - k)}><sphereGeometry args={[1, 8, 6]} /><meshPhysicalMaterial color={c} roughness={0.05} transparent opacity={o} clearcoat={1} /></mesh>; })}
    </group>}
  </>;
};
