// kitbano · utilería 3D del BAÑO (inodoro en corte, tanque con flotador/sapo/cadena, toallitas, bote, sonda de inodoro, raíces…)
// Va dentro de <Estudio>. Todo por código (cero imágenes generadas). Render SÓLO en el farm.
import React, { useMemo } from "react";
import * as THREE from "three";
import { rbox } from "./fx3d";
import { ctex, lathe, M, papel, rn, V3 } from "./estudio3d";
import { AGUA, GOMA, tuboGeo } from "./kitplo";

const P = Math.PI, P2 = P / 2;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const LOZA = (o = 1, c = "#fbfbf8") => <meshPhysicalMaterial color={c} roughness={0.14} clearcoat={1} clearcoatRoughness={0.08} transparent={o < 1} opacity={o} depthWrite={o >= 1} side={THREE.DoubleSide} />;
const XC = (x: number, base = "#fbfbf8") => new THREE.Color(base).lerp(new THREE.Color("#8fd0ff"), x).getStyle();

// ── INODORO (de frente a +z, tanque atrás). x = rayos X (se ve el sifón interno), nivel = agua de la taza (0 normal … 1 al borde),
//    tapon = bollo en el cuello, agua = color del agua, tapa = levanta la tapa del tanque, tq = nivel del tanque 0..1, sapo = goma abierta 0..1,
//    marca = raya de nivel visible, corteTq = frente del tanque transparente, remolino = agua girando
const tazaGeo = lathe([[0.0, 0.3], [0.1, 0.3], [0.17, 0.36], [0.26, 0.48], [0.31, 0.58], [0.33, 0.62]], 48);
const pieGeo = lathe([[0.19, 0.0], [0.2, 0.02], [0.15, 0.12], [0.14, 0.3]], 40);
export const TRAPI: V3[] = [[0, 0.33, 0.06], [0, 0.22, 0.0], [0, 0.2, -0.1], [0, 0.36, -0.16], [0, 0.44, -0.22], [0, 0.32, -0.28], [0, 0.08, -0.3], [0, -0.02, -0.3]];
export const Inodoro: React.FC<{ p?: V3; rot?: V3; s?: number; x?: number; nivel?: number; tapon?: number; tc?: string; agua?: string; tapa?: number; tq?: number;
  sapo?: number; marca?: boolean; corteTq?: number; flot?: number; remolino?: number; t?: number; asiento?: boolean; cadena?: number; sinTapa?: boolean; children?: React.ReactNode }> =
  ({ p, rot, s = 1, x = 0, nivel = 0, tapon = 0, tc = "#eae6da", agua = "#a9cfe0", tapa = 0, tq = 0.8, sapo = 0, marca = false, corteTq = 0, flot, remolino = 0, t = 0, asiento = true, cadena = 0.5, sinTapa = false, children }) => {
  const trap = useMemo(() => tuboGeo(TRAPI, 0.05, 60, 16), []);
  const o = 1 - 0.72 * x, wy = 0.4 + 0.21 * nivel, wr = 0.14 + 0.18 * nivel;
  const fy = flot ?? tq; // el flotador sigue al agua salvo que se lo fuerce
  const tqy = 0.66 + 0.4 * tq;
  return <group position={p} rotation={rot} scale={s}>
    <group scale={[1, 1, 1.28]}>
      <mesh geometry={tazaGeo} castShadow={x < 0.5}>{LOZA(o, XC(x))}</mesh>
      <mesh geometry={pieGeo} castShadow={x < 0.5} receiveShadow>{LOZA(o, XC(x))}</mesh>
      <mesh position={[0, 0.625, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.325, 0.022, 12, 56]} />{LOZA(Math.min(1, o + 0.2), XC(x))}</mesh>
      <mesh position={[0, wy, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[wr, 48]} />{AGUA(0.82, agua)}</mesh>
      {remolino > 0.01 && Array.from({ length: 3 }, (_, i) => <mesh key={i} position={[0, wy + 0.004, 0]} rotation={[-P2, 0, t * 5 + i * 2.1]}>
        <ringGeometry args={[wr * (0.3 + 0.2 * i), wr * (0.36 + 0.2 * i), 32, 1, 0, P * 1.1]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.5 * remolino} depthWrite={false} /></mesh>)}
      {asiento && <mesh position={[0, 0.655, 0]} rotation={[P2, 0, 0]} scale={[1, 1, 0.35]} castShadow><torusGeometry args={[0.29, 0.045, 12, 48]} /><meshPhysicalMaterial color="#f4f2ec" roughness={0.3} clearcoat={0.6} /></mesh>}
    </group>
    {/* sifón interno: se ve en rayos X */}
    {x > 0.02 && <mesh geometry={trap}><meshPhysicalMaterial color="#8fd0ff" emissive="#8fd0ff" emissiveIntensity={0.3} transparent opacity={0.55 * x} roughness={0.2} depthWrite={false} side={THREE.DoubleSide} /></mesh>}
    {tapon > 0.01 && <group position={[0, 0.4, -0.2]}>{Array.from({ length: 10 }, (_, i) =>
      <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.06, (rn(i, 2) - 0.5) * 0.08, (rn(i, 3) - 0.5) * 0.08]} scale={0.02 + 0.025 * tapon * rn(i, 4)}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={tc} roughness={0.85} /></mesh>)}</group>}
    {/* tanque */}
    <group position={[0, 0, -0.42]}>
      <mesh position={[0, 0.9, -0.02]} geometry={rbox(0.66, 0.5, 0.22, 0.03)} castShadow receiveShadow>{LOZA(Math.min(1 - 0.85 * corteTq, o), XC(x))}</mesh>
      {!sinTapa && <mesh position={[0, 1.17 + 0.5 * tapa, -0.02 + 0.18 * tapa]} rotation={[-0.5 * tapa, 0, 0]} geometry={rbox(0.7, 0.05, 0.26, 0.02)} castShadow>{LOZA(1 - 0.9 * cl(tapa * 3 - 2), XC(x))}</mesh>}
      <mesh position={[0.24, 1.08, 0.1]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.018, 0.018, 0.1, 10]} />{M.cromo()}</mesh>
      {corteTq > 0.02 && <group>
        <mesh position={[0, (0.67 + tqy) / 2, -0.02]} scale={[0.6, Math.max(0.01, tqy - 0.67), 0.17]}><boxGeometry args={[1, 1, 1]} />{AGUA(0.45 * corteTq, "#9fd3ec")}</mesh>
        {/* rebosadero (tubo alto) con la marca */}
        <mesh position={[0.08, 0.92, -0.02]}><cylinderGeometry args={[0.022, 0.022, 0.5, 14]} /><meshStandardMaterial color="#e9e4d4" roughness={0.5} /></mesh>
        {marca && <mesh position={[0, 0.66 + 0.4 * 0.8, -0.115]}><boxGeometry args={[0.6, 0.012, 0.004]} /><meshBasicMaterial color="#e8432e" toneMapped={false} /></mesh>}
        {/* flotador de vasito en su columna */}
        <mesh position={[-0.2, 0.9, -0.02]}><cylinderGeometry args={[0.012, 0.012, 0.48, 8]} /><meshStandardMaterial color="#d8d2c2" /></mesh>
        <mesh position={[-0.2, 0.66 + 0.4 * fy - 0.03, -0.02]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.08, 18]} /><meshStandardMaterial color="#3a3a3a" roughness={0.6} /></mesh>
        {/* sapo (goma) con bisagra y cadena a la palanca */}
        <group position={[0.08 - 0.07, 0.69, -0.02]} rotation={[0, 0, 0.9 * sapo]}>
          <mesh position={[0.07, 0, 0]} rotation={[0, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.025, 24]} />{GOMA("#b8322a")}</mesh>
        </group>
        <Cadena a={[0.06, 0.72 + 0.12 * sapo, -0.02]} b={[0.2, 1.06, 0.06]} flojo={cadena} n={11} />
      </group>}
    </group>
    {children}
  </group>;
};

// ── CADENA de eslabones entre a y b; flojo 0 (tensa) … 1 (cuelga mucho)
export const Cadena: React.FC<{ a: V3; b: V3; flojo?: number; n?: number; c?: string }> = ({ a, b, flojo = 0.3, n = 12, c = "#c9cdd2" }) =>
  <group>{Array.from({ length: n }, (_, i) => { const k = (i + 0.5) / n, sag = Math.sin(k * P) * 0.18 * flojo;
    return <mesh key={i} position={[a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k - sag, a[2] + (b[2] - a[2]) * k]} rotation={[i % 2 ? P2 : 0, 0, Math.atan2(b[1] - a[1], b[0] - a[0]) + P2]} scale={[1, 1.6, 1]}>
      <torusGeometry args={[0.009, 0.003, 6, 12]} /><meshStandardMaterial color={c} metalness={0.8} roughness={0.3} /></mesh>; })}</group>;

// ── TOALLITA húmeda: paño acolchado que ondula (no se rompe); enrolla 0..1 la retuerce en soga
const toallaTex = () => ctex("toallita", 256, 256, (g) => { g.fillStyle = "#f6f7f4"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(160,170,180,.45)"; g.lineWidth = 3;
  for (let i = -256; i < 512; i += 22) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 256, 256); g.stroke(); g.beginPath(); g.moveTo(i + 256, 0); g.lineTo(i, 256); g.stroke(); } });
export const Toallita: React.FC<{ p?: V3; rot?: V3; s?: number; t?: number; enrolla?: number; c?: string }> = ({ p, rot, s = 1, t = 0, enrolla = 0, c = "#ffffff" }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(0.4, 0.3, 16, 12), []);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const base = useMemo(() => Float32Array.from(pos.array as Float32Array), [geo]);
  for (let i = 0; i < pos.count; i++) { const x = base[i * 3], y = base[i * 3 + 1];
    const a = enrolla * (x / 0.2) * P * 1.6, r = 0.05 + 0.1 * (1 - enrolla);
    const wz = Math.sin(x * 9 + t * 2.4) * 0.025 + Math.cos(y * 11 + t * 1.7) * 0.02;
    pos.setXYZ(i, enrolla > 0.01 ? x * (1 - 0.6 * enrolla) : x, y * (1 - 0.65 * enrolla) + (enrolla > 0.01 ? Math.sin(a) * r * enrolla : 0), wz * (1 - enrolla) + (enrolla > 0.01 ? (Math.cos(a) - 1) * r * enrolla : 0)); }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return <mesh geometry={geo} position={p} rotation={rot} scale={s} castShadow><meshStandardMaterial map={toallaTex()} color={c} roughness={0.85} side={THREE.DoubleSide} /></mesh>;
};

// ── CUADRO DE PAPEL HIGIÉNICO que se deshace: k 0 entero … 1 en pedacitos que se dispersan
export const PapelCuadro: React.FC<{ p?: V3; rot?: V3; s?: number; k?: number }> = ({ p, rot, s = 1, k = 0 }) =>
  <group position={p} rotation={rot} scale={s}>{Array.from({ length: 16 }, (_, i) => { const gx = (i % 4) - 1.5, gy = Math.floor(i / 4) - 1.5;
    return <mesh key={i} position={[gx * 0.05 * (1 + 2.5 * k) + (rn(i, 1) - 0.5) * 0.12 * k, gy * 0.05 * (1 + 2.5 * k) + (rn(i, 2) - 0.5) * 0.12 * k, (rn(i, 3) - 0.5) * 0.1 * k]}
      rotation={[rn(i, 4) * 3 * k, rn(i, 5) * 3 * k, 0]} scale={1 - 0.45 * k}><planeGeometry args={[0.05, 0.05]} /><meshStandardMaterial color="#fbfaf6" roughness={0.95} side={THREE.DoubleSide} transparent opacity={1 - 0.3 * k} /></mesh>; })}</group>;

// ── ROLLO de papel: desen = largo de la tira que cuelga (0..1)
export const Rollo: React.FC<{ p?: V3; rot?: V3; s?: number; desen?: number; bollo?: number }> = ({ p, rot, s = 1, desen = 0, bollo = 0 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.12, 0.12, 0.2, 32, 1, true]} /><meshStandardMaterial color="#fbfaf6" roughness={0.9} side={THREE.DoubleSide} /></mesh>
    {[-0.1, 0.1].map((z) => <mesh key={z} position={[0, 0, z]}><ringGeometry args={[0.045, 0.12, 32]} /><meshStandardMaterial color="#efece4" roughness={0.9} side={THREE.DoubleSide} /></mesh>)}
    <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.045, 0.045, 0.205, 20, 1, true]} /><meshStandardMaterial color="#b98d5a" roughness={0.8} side={THREE.DoubleSide} /></mesh>
    {desen > 0.01 && <mesh position={[0.12, -0.6 * desen / 2, 0]} rotation={[0, P2, 0]}><planeGeometry args={[0.2, 0.6 * desen]} /><meshStandardMaterial color="#fbfaf6" roughness={0.9} side={THREE.DoubleSide} /></mesh>}
    {bollo > 0.01 && <mesh position={[0.12, -0.6 * desen - 0.05, 0]} scale={0.04 + 0.1 * bollo}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#f7f5ee" roughness={0.95} flatShading /></mesh>}
  </group>
);

// ── BOTE con tapa de pedal: abre 0..1
const boteGeo = lathe([[0, 0], [0.2, 0], [0.22, 0.5], [0.225, 0.52]], 36);
export const Bote: React.FC<{ p?: V3; rot?: V3; s?: number; abre?: number; c?: string }> = ({ p, rot, s = 1, abre = 0, c = "#d9dde0" }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={boteGeo} castShadow receiveShadow>{M.cromo(c)}</mesh>
    <group position={[0, 0.53, -0.22]} rotation={[-1.7 * abre, 0, 0]}><mesh position={[0, 0, 0.22]} castShadow><cylinderGeometry args={[0.23, 0.23, 0.03, 36]} />{M.cromo("#eceff1")}</mesh></group>
    <mesh position={[0, 0.03, 0.24 - 0.02 * abre]} geometry={rbox(0.14, 0.03, 0.08, 0.01)} castShadow><meshStandardMaterial color="#222" roughness={0.5} /></mesh>
  </group>
);

// ── HILO DENTAL enredado con algodones: «medusa»; k = cuánto juntó (0..1)
export const Medusa: React.FC<{ p?: V3; s?: number; k?: number; t?: number }> = ({ p, s = 1, k = 1, t = 0 }) => {
  const hilos = useMemo(() => Array.from({ length: 7 }, (_, j) => tuboGeo(Array.from({ length: 9 }, (_, i) => [Math.sin(i * 0.9 + j) * 0.06 + (rn(j, 1) - 0.5) * 0.1, -i * 0.05, Math.cos(i * 0.7 + j * 2) * 0.06] as V3), 0.004, 50, 5)), []);
  return <group position={p} scale={s}>
    {hilos.map((g, j) => <mesh key={j} geometry={g} rotation={[0, j * 0.9, Math.sin(t * 1.5 + j) * 0.12]}><meshStandardMaterial color="#e8f4f2" roughness={0.3} /></mesh>)}
    {Array.from({ length: Math.round(9 * k) }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.14, -0.05 - rn(i, 2) * 0.3, (rn(i, 3) - 0.5) * 0.14]} scale={[0.035, 0.028, 0.03]}>
      <icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#fdfcf8" roughness={1} flatShading /></mesh>)}
  </group>;
};

// ── HISOPO, CLIP, ESPEJITO, ESPONJA, VASO, PASTILLA, LATA, COCHECITO, LLAVE DE PASO
export const Hisopo: React.FC<{ p?: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh><cylinderGeometry args={[0.006, 0.006, 0.3, 8]} /><meshStandardMaterial color="#9fc6e8" /></mesh>
    {[-0.16, 0.16].map((y) => <mesh key={y} position={[0, y, 0]} scale={[0.018, 0.03, 0.018]}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color="#fdfdfb" roughness={1} /></mesh>)}
  </group>
);
export const Clip: React.FC<{ p?: V3; rot?: V3; s?: number; abierto?: number }> = ({ p, rot, s = 1, abierto = 0 }) => {
  const g = useMemo(() => tuboGeo([[0, 0, 0], [0, 0.2, 0], [0.03, 0.23, 0], [0.06, 0.2, 0], [0.06, 0.04, 0], [0.04, 0.02, 0], [0.02, 0.04, 0], [0.02, 0.16, 0]], 0.006, 80, 8), []);
  return <group position={p} rotation={rot} scale={s}>
    <mesh geometry={g} castShadow>{M.cromo("#c9ccd0")}</mesh>
    {abierto > 0.01 && <mesh position={[0, -0.12 * abierto, 0]}><cylinderGeometry args={[0.006, 0.006, 0.24 * abierto, 8]} />{M.cromo("#c9ccd0")}</mesh>}
  </group>;
};
export const Espejito: React.FC<{ p?: V3; rot?: V3; s?: number; img?: THREE.Texture }> = ({ p, rot, s = 1, img }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.02, 40]} /><meshStandardMaterial color="#2b2f36" metalness={0.6} roughness={0.3} /></mesh>
    <mesh position={[0, 0, 0.011]}><circleGeometry args={[0.115, 40]} />{img ? <meshBasicMaterial map={img} toneMapped={false} /> : <meshStandardMaterial color="#dfe9f2" metalness={1} roughness={0.05} />}</mesh>
    <mesh position={[0, -0.27, 0]} castShadow><cylinderGeometry args={[0.018, 0.022, 0.3, 12]} /><meshStandardMaterial color="#2b2f36" roughness={0.4} /></mesh>
  </group>
);
export const Esponja: React.FC<{ p?: V3; rot?: V3; s?: number; moja?: number }> = ({ p, rot, s = 1, moja = 0 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={rbox(0.22, 0.07, 0.14, 0.02)} castShadow><meshStandardMaterial color={new THREE.Color("#f2d24a").lerp(new THREE.Color("#b29a3a"), moja)} roughness={1} /></mesh>
    <mesh position={[0, 0.045, 0]} geometry={rbox(0.22, 0.025, 0.14, 0.01)} castShadow><meshStandardMaterial color="#2f8a4e" roughness={0.9} /></mesh>
  </group>
);
const vasoGeo = lathe([[0, 0], [0.06, 0], [0.085, 0.2], [0.088, 0.205]], 28);
export const Vaso: React.FC<{ p?: V3; rot?: V3; s?: number; lleno?: number }> = ({ p, rot, s = 1, lleno = 0 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={vasoGeo} castShadow><meshPhysicalMaterial color="#e8eef2" roughness={0.2} transparent opacity={0.55} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    {lleno > 0.01 && <mesh position={[0, 0.1 * lleno, 0]}><cylinderGeometry args={[0.06 + 0.024 * lleno, 0.058, 0.2 * lleno, 20]} />{AGUA(0.7, "#a9c9b8")}</mesh>}
  </group>
);
export const Pastilla: React.FC<{ p?: V3; rot?: V3; s?: number; k?: number }> = ({ p, rot, s = 1, k = 0 }) => (
  <mesh position={p} rotation={rot} scale={s * (1 - 0.5 * k)} geometry={rbox(0.14, 0.05, 0.09, 0.02)} castShadow><meshPhysicalMaterial color="#1f6fe0" roughness={0.3} clearcoat={0.6} /></mesh>
);
export const Lata: React.FC<{ p?: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh castShadow><cylinderGeometry args={[0.065, 0.065, 0.24, 32]} /><meshStandardMaterial color="#c71f26" metalness={0.5} roughness={0.3} /></mesh>
    {[0.12, -0.12].map((y) => <mesh key={y} position={[0, y, 0]}><cylinderGeometry args={[0.058, 0.062, 0.012, 32]} />{M.cromo("#d6d9dd")}</mesh>)}
    <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.0655, 0.0655, 0.03, 32, 1, true]} /><meshStandardMaterial color="#f4f1ea" roughness={0.5} /></mesh>
  </group>
);
export const Cochecito: React.FC<{ p?: V3; rot?: V3; s?: number; c?: string }> = ({ p, rot, s = 1, c = "#e8432e" }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh position={[0, 0.05, 0]} geometry={rbox(0.24, 0.06, 0.12, 0.02)} castShadow><meshPhysicalMaterial color={c} roughness={0.25} clearcoat={1} /></mesh>
    <mesh position={[-0.01, 0.1, 0]} geometry={rbox(0.12, 0.05, 0.1, 0.02)} castShadow><meshPhysicalMaterial color="#bfe3f5" roughness={0.1} clearcoat={1} /></mesh>
    {[[-0.08, 0.06], [0.08, 0.06], [-0.08, -0.06], [0.08, -0.06]].map(([x, z], i) => <mesh key={i} position={[x, 0.025, z]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.026, 0.026, 0.02, 16]} /><meshStandardMaterial color="#1a1a1a" roughness={0.7} /></mesh>)}
  </group>
);
export const LlavePaso: React.FC<{ p?: V3; rot?: V3; s?: number; giro?: number }> = ({ p, rot, s = 1, giro = 0 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.16, 16]} />{M.cromo()}</mesh>
    <mesh position={[0, 0, 0.09]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.05, 6]} />{M.cromo()}</mesh>
    <group position={[0, 0, 0.13]} rotation={[0, 0, -giro * P2]}>
      <mesh geometry={rbox(0.16, 0.035, 0.03, 0.012)} castShadow><meshStandardMaterial color="#d8d8d8" metalness={0.7} roughness={0.25} /></mesh>
    </group>
    <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.015, 0.015, 0.4, 10]} />{M.cromo("#b8bcc2")}</mesh>
  </group>
);

// ── SONDA DE INODORO: tubo con curva + manivela + funda de goma; avance 0..1 baja por el cuello, giro = vueltas de la manivela
export const SondaInodoro: React.FC<{ p?: V3; rot?: V3; s?: number; giro?: number; funda?: boolean }> = ({ p, rot, s = 1, giro = 0, funda = true }) => {
  const g = useMemo(() => tuboGeo([[0, 1.0, 0], [0, 0.3, 0], [0, 0.12, 0.04], [0, 0.04, 0.14]], 0.018, 40, 10), []);
  return <group position={p} rotation={rot} scale={s}>
    <mesh geometry={g} castShadow>{M.cromo("#c9ccd0")}</mesh>
    {funda && <mesh position={[0, 0.06, 0.12]} rotation={[1.1, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.09, 14]} />{GOMA("#2a2a2a")}</mesh>}
    <group position={[0, 1.0, 0]} rotation={[0, giro * P * 2, 0]}>
      <mesh position={[0.08, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />{M.cromo()}</mesh>
      <mesh position={[0.16, 0.06, 0]}><cylinderGeometry args={[0.022, 0.022, 0.12, 12]} /><meshStandardMaterial color="#d6362c" roughness={0.5} /></mesh>
    </group>
  </group>;
};

// ── RAÍCES que entran por una fisura y crecen adentro del caño; k 0..1
export const Raices: React.FC<{ p?: V3; rot?: V3; s?: number; k?: number }> = ({ p, rot, s = 1, k = 1 }) => {
  const ramas = useMemo(() => Array.from({ length: 9 }, (_, j) => { const pts: V3[] = []; let x = 0, y = 0.25, z = 0;
    for (let i = 0; i < 8; i++) { pts.push([x, y, z]); x += (rn(j * 7 + i, 1) - 0.5) * 0.12 + (j - 4) * 0.012; y -= 0.035 + rn(j * 7 + i, 2) * 0.02; z += (rn(j * 7 + i, 3) - 0.5) * 0.08; }
    return tuboGeo(pts, 0.008 + 0.006 * rn(j, 4), 40, 6); }), []);
  return <group position={p} rotation={rot} scale={s}>{ramas.map((g, j) =>
    <mesh key={j} geometry={g} scale={[1, cl(k * 1.4 - j * 0.05), 1]} position={[0, 0.25 * (1 - cl(k * 1.4 - j * 0.05)), 0]}><meshStandardMaterial color={j % 2 ? "#8a6a48" : "#a8845c"} roughness={0.9} /></mesh>)}</group>;
};

// ── BORDE DE LA TAZA visto desde abajo: fila de agujeritos; sarro 0..1 los tapa (costra blanca), chorro = agua que sale de los libres
export const BordeAgujeros: React.FC<{ p?: V3; rot?: V3; s?: number; n?: number; sarro?: number; chorro?: number; tapados?: number[]; t?: number; limpio?: number }> =
  ({ p, rot, s = 1, n = 9, sarro = 0, chorro = 0, tapados = [], t = 0, limpio = 0 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={rbox(1.9, 0.14, 0.34, 0.06)} castShadow receiveShadow>{LOZA()}</mesh>
    {Array.from({ length: n }, (_, i) => { const x = -0.8 + (1.6 * i) / (n - 1), tap = tapados.includes(i) ? cl(sarro - (limpio * n - i) * 0 ) * (1 - cl(limpio * n - i)) : 0;
      return <group key={i} position={[x, -0.071, 0.05]}>
        <mesh rotation={[P2, 0, 0]}><circleGeometry args={[0.032, 20]} /><meshBasicMaterial color="#1b1f24" /></mesh>
        {tap > 0.01 && <mesh position={[0, -0.006, 0]} scale={[0.045 * tap, 0.018 * tap, 0.045 * tap]}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#efe8d6" roughness={1} flatShading /></mesh>}
        {chorro > 0.01 && tap < 0.3 && <mesh position={[0, -0.25 * chorro, 0]}><cylinderGeometry args={[0.012, 0.02, 0.5 * chorro, 10, 1, true]} /><meshPhysicalMaterial color="#bfe3f5" transparent opacity={0.55 + 0.1 * Math.sin(t * 20 + i)} roughness={0.05} depthWrite={false} side={THREE.DoubleSide} /></mesh>}
      </group>; })}
  </group>
);

// ── HOJA DE CALENDARIO que se arranca (día 1 del mes); arranca 0..1
export const Calendario: React.FC<{ p?: V3; rot?: V3; s?: number; arranca?: number; dia?: string; mes?: string }> = ({ p, rot, s = 1, arranca = 0, dia = "1", mes = "PRIMERO DEL MES" }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={rbox(0.6, 0.72, 0.04, 0.02)} castShadow><meshStandardMaterial color="#f7f3ea" roughness={0.8} /></mesh>
    <mesh position={[0, 0.27, 0.022]}><planeGeometry args={[0.58, 0.16]} /><meshStandardMaterial map={papel("calm" + mes, [mes], { w: 512, h: 140, bg: "#c0392b", ink: "#ffffff", size: 54 })} roughness={0.6} /></mesh>
    <group position={[0, 0.19, 0.03]} rotation={[-1.9 * arranca, 0, 0.3 * arranca]}>
      <mesh position={[0, -0.25, 0]}><planeGeometry args={[0.56, 0.5]} /><meshStandardMaterial map={papel("cald" + dia, [dia], { w: 512, h: 460, bg: "#fbf9f3", ink: "#1b1b1b", size: 300 })} roughness={0.8} side={THREE.DoubleSide} /></mesh>
    </group>
  </group>
);
export { cl, LOZA, XC };
