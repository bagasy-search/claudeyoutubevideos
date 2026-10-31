// ben29a · «18 vs 4»: los componentes únicos del minuto (uno por idea, ninguno se repite en la tanda).
// Regla: el OBJETO cuenta la idea sin leer; cada cosa llega de a una con resorte; cámara curva (Estudio orbita); ≤5 palabras por rótulo,
// y los rótulos van DENTRO de la escena (papel, pizarra, esfera del reloj), nunca flotando ni arriba a la izquierda.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, img, lerp, phys, Stage } from "./ckit";
import { ctex, Estudio, fall, lathe, M, papel, RBox, rn, V3, Vapor, Yute } from "./estudio3d";
import { Chorro, Foto3D, Mano } from "./kit3d";
import { Bol, Bolsa, corteza, Frasco, Fuego, Hogaza, Lino as LinoK, Masa, Moneda, P, P2, Rebanada, Reloj } from "./kitpan";

type C = React.FC<{ t: number; h: H }>;
const ent = (tt: number, a: number) => cl(phys(tt, a, 6, 0.5)); // llegada con resorte
const sp = (tt: number, a: number) => phys(tt, a, 6, 0.45);       // resorte con rebote (puede pasar de 1)
const IT = (h: H) => (h.items ?? []) as { a: number; tx: string }[];
const cartel = (key: string, tx: string, o: { w?: number; h?: number; bg?: string; ink?: string; size?: number } = {}) =>
  papel(key, [tx], { w: o.w ?? 512, h: o.h ?? 192, size: o.size ?? 120, bg: o.bg, ink: o.ink, font: `900 ${o.size ?? 120}px Georgia, serif` });
const Placa: React.FC<{ p: V3; rot?: V3; w: number; h: number; tex: THREE.Texture; k?: number }> = ({ p, rot, w, h, tex, k = 1 }) => (
  <group position={p} rotation={rot} scale={0.001 + k}>
    <RBox s={[w + 0.06, h + 0.06, 0.04]} r={0.015}>{M.madera("#5a3a22")}</RBox>
    <mesh position={[0, 0, 0.022]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={tex} roughness={0.85} /></mesh>
  </group>);

// ── 1 · CAMPANA (CTA1): la campanilla de bronce de la puerta de la panadería se mece y suena; el cartel de madera cuelga y se balancea
const H1Campana: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const ring = (a: number) => Math.exp(-2.2 * Math.max(0, tt - a)) * Math.sin(Math.max(0, tt - a) * 11) * (tt > a ? 1 : 0);
  const sw = 0.5 * ring(1.2) + 0.35 * ring(3.0), sg = sp(tt, 0.5), sign = 0.25 * Math.exp(-1.5 * Math.max(0, tt - 0.5)) * Math.sin(Math.max(0, tt - 0.5) * 5);
  return <Estudio t={tt} cam={[0.1, 1.75, 2.7]} look={[0.1, 1.75, 0]} orbit={0.08}>
    <RBox p={[0, 1.4, -0.35]} s={[3.6, 3.0, 0.1]} r={0.02}>{M.madera("#4a2c18")}</RBox>
    {[-1.2, -0.4, 0.4, 1.2].map((x, i) => <RBox key={i} p={[x, 1.4, -0.29]} s={[0.04, 2.9, 0.02]} r={0.01}>{M.madera("#3a2010")}</RBox>)}
    {/* brazo de hierro y campanilla */}
    <mesh position={[-0.55, 2.35, -0.05]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.025, 0.025, 0.8, 10]} />{M.hierro()}</mesh>
    <group position={[-0.25, 2.33, -0.05]} rotation={[0, 0, sw]}>
      <mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />{M.hierro()}</mesh>
      <mesh position={[0, -0.42, 0]} geometry={campGeo} castShadow>{M.cromo("#c9a24a")}</mesh>
      <mesh position={[0.06 * Math.sin(tt * 9) * Math.abs(sw), -0.5, 0]}><sphereGeometry args={[0.045, 14, 10]} />{M.hierro()}</mesh>
    </group>
    {/* ondas de sonido: anillos que se abren a cada golpe */}
    {[1.2, 1.55, 3.0, 3.35].map((a, i) => { const k = cl((tt - a) / 1.1); return <mesh key={i} position={[-0.25, 1.95, 0]} scale={0.2 + k * 1.3} visible={k > 0 && k < 1}><torusGeometry args={[0.5, 0.008, 8, 64]} /><meshBasicMaterial color="#ffe2a0" transparent opacity={0.6 * (1 - k)} toneMapped={false} /></mesh>; })}
    {/* cartel colgado de dos cadenas que cae y se mece */}
    <group position={[0.55, lerp(3.8, 1.45, cl(sg)) + 0.05 * (sg - cl(sg)), 0.05]} rotation={[0, 0, sign]}>
      {[-0.45, 0.45].map((x, i) => <mesh key={i} position={[x, 0.55, 0]}><cylinderGeometry args={[0.008, 0.008, 0.7, 6]} />{M.cromo("#8a7a5a")}</mesh>)}
      <Placa p={[0, 0, 0]} w={1.3} h={0.42} tex={cartel("sub", "SUBSCRIBE", { bg: "#6a4428", ink: "#f6e7c4" })} />
    </group>
    <pointLight position={[-0.25, 2.0, 0.8]} intensity={1.5 + 2 * Math.abs(sw)} distance={2.5} color="#ffd9a0" />
  </Estudio>;
}}</Stage>;
const campGeo = (() => { const g = new THREE.LatheGeometry([[0.0, 0.36], [0.08, 0.35], [0.13, 0.28], [0.16, 0.12], [0.22, 0.0], [0.24, -0.02]].map(([r, y]) => new THREE.Vector2(r, y)), 40); return g; })();

// ── 2 · ROLLO: la etiqueta se despega de la bolsa y se desenrolla como un ticket larguísimo; el cuentavueltas de bronce sube a 22
const listaTex = () => ctex("lista", 256, 1024, (g) => { g.fillStyle = "#f7f3ea"; g.fillRect(0, 0, 256, 1024); g.fillStyle = "#2a2a2a";
  for (let y = 20; y < 1010; y += 13) { const w = 80 + rn(y, 1) * 150; g.fillRect(14, y, w, 6); } });
const digTex = (n: number) => cartel("dig" + n, String(n), { w: 256, h: 192, size: 150, bg: "#1c1612", ink: "#f2d58a" });
const H2Rollo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const un = eio(tt, 1.0, 4.6), cnt = Math.min(22, Math.floor(cl((tt - 1.2) / 4.0) * 22.99)), L = 0.05 + 3.2 * un;
  return <Estudio t={tt} cam={[0.9, 1.6, 3.8]} look={[0.2, 0.55, 0]} orbit={0.12}>
    <group position={[-0.9, fall(tt, 0.1, 1.5), 0]} rotation={[0, 0.5, 0]}><Bolsa s={0.8} /></group>
    {/* la tira: sale del costado de la bolsa, baja y se tiende en la mesa hacia cámara */}
    <group position={[-0.45, 0.02, 0.2]} rotation={[0, -0.5, 0]}>
      <mesh position={[0, 0.0, L / 2]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.32, L]} /><meshStandardMaterial map={listaTex()} roughness={0.8} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.05, L]} rotation={[0, P2, 0]}><cylinderGeometry args={[0.05, 0.05, 0.32, 20]} /><meshStandardMaterial color="#f7f3ea" roughness={0.8} /></mesh>
    </group>
    {/* cuentavueltas: dos ruedas de dígitos en caja de bronce */}
    <group position={[1.05, 0.42 + 0.3 * (1 - ent(tt, 0.6)), 0.3]} rotation={[0, -0.35, 0]}>
      <RBox s={[0.95, 0.55, 0.4]} r={0.05}>{M.cromo("#a8823a")}</RBox>
      {[0, 1].map((d) => { const v = d === 0 ? Math.floor(cnt / 10) : cnt % 10; return <mesh key={d} position={[-0.2 + d * 0.4, 0, 0.205]}><planeGeometry args={[0.34, 0.36]} /><meshStandardMaterial map={digTex(v)} roughness={0.4} /></mesh>; })}
    </group>
  </Estudio>;
}}</Stage>;

// ── 3 · BALANZA: platillo izquierdo recibe 22 frasquitos de colores, el derecho 4 cosas de cocina; los rótulos 22 y 4 están en la base
const VIAL = ["#f4f1ea", "#e8d9a8", "#cfe0e8", "#f0e0f0", "#d8f0d0", "#f6e2b8"];
const H3Balanza: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const nL = Math.min(22, Math.floor(cl((tt - 0.6) / 2.6) * 22.99)), nR = Math.min(4, Math.floor(cl((tt - 3.6) / 1.6) * 4.99));
  const tilt = 0.16 * cl(nL / 22) - 0.04 * cl(nR / 4) + 0.01 * Math.sin(tt * 2.2) * (1 - cl(tt - 6));
  const pan = (side: number): V3 => [side * 1.0 * Math.cos(tilt), 1.25 - side * 1.0 * Math.sin(tilt), 0];
  const L = pan(-1), R = pan(1);
  return <Estudio t={tt} cam={[0, 1.25, 2.55]} look={[0, 0.9, 0]} orbit={0.1}>
    <RBox p={[0, 0.06, 0]} s={[1.0, 0.12, 0.5]} r={0.03}>{M.madera("#5a3a22")}</RBox>
    <mesh position={[0, 0.75, 0]}><cylinderGeometry args={[0.04, 0.06, 1.3, 14]} />{M.cromo("#b8962e")}</mesh>
    <mesh position={[0, 1.42, 0]} rotation={[0, 0, -tilt]}><boxGeometry args={[2.1, 0.05, 0.05]} />{M.cromo("#b8962e")}</mesh>
    {[L, R].map((q, i) => <group key={i} position={[q[0], q[1] - 0.45, q[2]]}>
      {[0, 1, 2].map((j) => { const a = (j / 3) * 2 * P; return <mesh key={j} position={[Math.cos(a) * 0.2, 0.22, Math.sin(a) * 0.2]} rotation={[Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4]}><cylinderGeometry args={[0.005, 0.005, 0.5, 4]} />{M.cromo("#8a7a5a")}</mesh>; })}
      <mesh geometry={platGeo} castShadow receiveShadow>{M.cromo("#c9a64a")}</mesh>
    </group>)}
    {Array.from({ length: nL }, (_, i) => { const a = 0.6 + i * 0.118, x = (rn(i, 1) - 0.5) * 0.42, z = (rn(i, 2) - 0.5) * 0.42, y = 0.04 + Math.floor(i / 9) * 0.13;
      return <mesh key={i} position={[L[0] + x, L[1] - 0.43 + y + fall(tt, a, 0.9), z]} rotation={[0, rn(i, 3) * 6, 0]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.12, 12]} /><meshPhysicalMaterial color={VIAL[i % 6]} roughness={0.15} clearcoat={1} transparent opacity={0.85} /></mesh>; })}
    <group position={[R[0], R[1] - 0.42, 0]}>
      {nR > 0 && <mesh position={[-0.12, 0.05 + fall(tt, 3.6, 0.9), -0.05]}><coneGeometry args={[0.13, 0.12, 24]} /><meshStandardMaterial color="#f8f4ea" roughness={1} /></mesh>}
      {nR > 1 && <mesh position={[0.12, 0.08 + fall(tt, 4.0, 0.9), -0.08]} geometry={jarraGeo} castShadow>{M.barro("#a8602c")}</mesh>}
      {nR > 2 && <mesh position={[-0.05, 0.03 + fall(tt, 4.4, 0.9), 0.15]}><cylinderGeometry args={[0.07, 0.05, 0.04, 20]} /><meshStandardMaterial color="#eef1f3" roughness={0.3} /></mesh>}
      {nR > 3 && <mesh position={[0.15, 0.03 + fall(tt, 4.8, 0.9), 0.15]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.05, 12, 8]} /><meshStandardMaterial color="#c9a86a" roughness={0.9} /></mesh>}
    </group>
    <Placa p={[-0.32, 0.06, 0.27]} w={0.3} h={0.1} tex={cartel("n22", "22", { bg: "#efe4c8", ink: "#8a2f24" })} k={ent(tt, 3.2)} />
    <Placa p={[0.32, 0.06, 0.27]} w={0.3} h={0.1} tex={cartel("n4", "4", { bg: "#efe4c8", ink: "#3a6a2a" })} k={ent(tt, 5.2)} />
  </Estudio>;
}}</Stage>;
const platGeo = new THREE.LatheGeometry([[0, 0], [0.3, 0.0], [0.34, 0.05], [0.35, 0.06]].map(([r, y]) => new THREE.Vector2(r, y)), 40);
const jarraGeo = new THREE.LatheGeometry([[0, 0], [0.07, 0], [0.09, 0.08], [0.07, 0.16], [0.05, 0.2], [0.06, 0.22]].map(([r, y]) => new THREE.Vector2(r, y)), 24);

// ── 4 · CAMIÓN: el camioncito de reparto da la vuelta a una ruta circular; el almanaque de la pared arranca hojas hasta 14
const H4Camion: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const ang = eio(tt, 0.4, 6.4) * 2 * P * 1.25, day = Math.min(14, 1 + Math.floor(cl((tt - 0.8) / 5.0) * 13.99));
  return <Estudio t={tt} cam={[0.2, 1.75, 2.75]} look={[0.15, 0.45, -0.25]} orbit={0.1}>
    <mesh position={[0, 0.012, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[1.0, 1.35, 64]} /><meshStandardMaterial color="#3a3a3c" roughness={0.9} /></mesh>
    {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * 2 * P; return <mesh key={i} position={[Math.cos(a) * 1.175, 0.014, Math.sin(a) * 1.175]} rotation={[-P2, 0, -a]}><planeGeometry args={[0.03, 0.12]} /><meshBasicMaterial color="#e8d070" /></mesh>; })}
    <group position={[Math.cos(ang) * 1.175, 0, Math.sin(ang) * 1.175]} rotation={[0, -ang, 0]}>
      <RBox p={[0, 0.2, 0]} s={[0.22, 0.26, 0.5]} r={0.03}><meshPhysicalMaterial color="#e8e4dc" roughness={0.3} clearcoat={1} /></RBox>
      <RBox p={[0, 0.17, -0.33]} s={[0.22, 0.2, 0.16]} r={0.03}><meshPhysicalMaterial color="#b8281c" roughness={0.3} clearcoat={1} /></RBox>
      {[[-0.12, -0.3], [0.12, -0.3], [-0.12, 0.15], [0.12, 0.15]].map(([x, z], i) => <mesh key={i} position={[x, 0.05, z]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />{M.hierro()}</mesh>)}
    </group>
    {/* la góndola en el centro, con su luz blanca fuerte */}
    <RBox p={[0, 0.35, 0]} s={[0.9, 0.7, 0.35]} r={0.02}><meshStandardMaterial color="#d8dadc" roughness={0.4} metalness={0.4} /></RBox>
    {[0, 1].map((r) => [0, 1, 2].map((c) => <group key={r + "" + c} position={[-0.28 + c * 0.28, 0.08 + r * 0.33, 0.02]}><Bolsa s={0.2} n={6} rot={[0, P2, 0]} /></group>))}
    <mesh position={[0, 0.95, 0.1]}><boxGeometry args={[0.9, 0.03, 0.08]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
    <pointLight position={[0, 0.9, 0.4]} intensity={2} distance={1.6} color="#f4f8ff" />
    {/* almanaque */}
    <group position={[1.0, 1.25, -0.9]}>
      <RBox s={[0.62, 0.72, 0.03]} r={0.01}><meshStandardMaterial color="#f1ead8" roughness={0.9} /></RBox>
      <mesh position={[0, 0.27, 0.02]}><planeGeometry args={[0.6, 0.16]} /><meshStandardMaterial color="#8a2f24" roughness={0.8} /></mesh>
      <mesh position={[0, -0.08, 0.02]}><planeGeometry args={[0.56, 0.5]} /><meshStandardMaterial map={cartel("dia" + day, String(day), { w: 256, h: 230, size: 170, bg: "#f6f1e4" })} roughness={0.9} /></mesh>
      {/* la hoja que se va: vuela y gira */}
      {(() => { const f = ((tt - 0.8) / 5.0) * 13.99 % 1; return tt > 0.8 && day < 14 ? <mesh position={[0.1 + f * 0.6, -0.08 + f * 0.4, 0.05 + f * 0.3]} rotation={[f * 2, f * 3, f]}><planeGeometry args={[0.56, 0.5]} /><meshStandardMaterial color="#f6f1e4" roughness={0.9} side={THREE.DoubleSide} transparent opacity={1 - f} /></mesh> : null; })()}
    </group>
  </Estudio>;
}}</Stage>;

// ── 5 · ALMOHADA: la mano aprieta la rebanada de molde, vuelve como esponja… y se convierte en una almohada de pluma
const H5Almohada: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const sq = Math.sin(cl((tt - 1.0) / 1.2) * P) * 0.8, mor = eio(tt, 3.0, 4.6), hy = lerp(0.62, 0.2, Math.sin(cl((tt - 0.8) / 1.6) * P)) + 0.5 * mor;
  return <Estudio t={tt} cam={[0.3, 0.85, 1.75]} look={[0, 0.2, 0]} orbit={0.1}>
    <group position={[0, 0.03, 0]} rotation={[-P2, 0, 0]} scale={1 - mor}><Rebanada s={0.75} sq={sq} /></group>
    <group position={[0, 0.17, 0]} scale={[0.001 + mor * 1.1, 0.001 + mor * 0.5 * (1 - 0.3 * sq), 0.001 + mor * 0.8]}>
      <mesh castShadow><sphereGeometry args={[0.5, 40, 20]} /><meshPhysicalMaterial color="#fbfaf5" roughness={0.85} sheen={1} sheenColor="#ffffff" /></mesh>
      <mesh rotation={[P2, 0, 0]} scale={[1.02, 1.02, 0.3]}><torusGeometry args={[0.49, 0.02, 8, 64]} /><meshStandardMaterial color="#e8e2d4" roughness={0.9} /></mesh>
    </group>
    <Mano p={[0.05, hy, 0.12]} rot={[-1.2, 0.2, 0]} pinza={0.4 + 0.5 * sq} s={1.1} />
    {Array.from({ length: 6 }, (_, i) => { const k = cl((tt - 4.4 - i * 0.12) / 1.8); return <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.8 + 0.2 * Math.sin(tt + i), 0.3 + k * 0.9, (rn(i, 2) - 0.5) * 0.4]} rotation={[0, 0, Math.sin(tt * 2 + i)]} visible={k > 0 && k < 1} scale={0.06}><planeGeometry args={[1, 0.35]} /><meshStandardMaterial color="#ffffff" transparent opacity={1 - k} side={THREE.DoubleSide} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 6 · TRES RAZONES (blandura): la rebanada al centro; llegan el azúcar (terrones que se funden), el aceite (la deja brillosa) y los emulsionantes (bolitas que abrazan gotas)
const H6Blanda: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const E = IT(h), at = (i: number) => (E[i]?.a ?? h.at + 1 + i * 2.5) - h.at;
  const s1 = cl((tt - at(0)) / 1.6), s2 = eio(tt, at(1), at(1) + 1.2), s3 = ent(tt, at(2));
  return <Estudio t={tt} cam={[0, 1.15, 3.0]} look={[0, 0.55, 0]} orbit={0.12}>
    <group position={[0, 0.58, 0]}><Rebanada s={0.95} /></group>
    {/* aceite: barniz sobre la cara */}
    <mesh position={[0, 0.66, 0.11]} scale={[0.92, 1.05 * s2 + 0.001, 1]}><planeGeometry args={[1, 1]} /><meshPhysicalMaterial color="#e8c860" roughness={0.05} clearcoat={1} transparent opacity={0.22} depthWrite={false} /></mesh>
    {/* azúcar: 6 terrones caen y se achican al tocar */}
    {Array.from({ length: 6 }, (_, i) => { const a = at(0) + i * 0.15, y = 1.6 - lerp(0, 1.0, eio(tt, a, a + 0.7)), m = 1 - cl((tt - a - 0.7) / 1.0);
      return <mesh key={i} position={[-0.3 + (i % 3) * 0.3, y, 0.2 + Math.floor(i / 3) * 0.08]} rotation={[rn(i, 1), rn(i, 2), 0]} scale={0.06 * m + 0.001} castShadow><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#ffffff" roughness={0.4} transmission={0.3} /></mesh>; })}
    {/* gota de aceite que baja y estalla en barniz */}
    <mesh position={[0.62, lerp(1.6, 1.1, eio(tt, at(1) - 0.6, at(1))), 0.15]} scale={0.08 * (1 - s2) + 0.001}><sphereGeometry args={[1, 20, 14]} /><meshPhysicalMaterial color="#e8c040" roughness={0.02} clearcoat={1} transparent opacity={0.85} /></mesh>
    {/* emulsionantes: bolita con cola, cada una abraza una gota de agua dentro de la miga */}
    {Array.from({ length: 7 }, (_, i) => { const k = ent(tt, at(2) + i * 0.12), x = -0.35 + (i % 4) * 0.23, y = 0.35 + Math.floor(i / 4) * 0.3;
      return <group key={i} position={[x, y, 0.16]} scale={0.001 + k}>
        <mesh><sphereGeometry args={[0.045, 16, 12]} /><meshPhysicalMaterial color="#9fd0f0" roughness={0.02} transmission={0.6} clearcoat={1} /></mesh>
        {[0, 1, 2].map((j) => { const a = (j / 3) * 2 * P + tt; return <mesh key={j} position={[Math.cos(a) * 0.07, Math.sin(a) * 0.07, 0]}><sphereGeometry args={[0.02, 10, 8]} /><meshStandardMaterial color="#e0a040" roughness={0.4} /></mesh>; })}
      </group>; })}
    {E.map((e, i) => <Placa key={i} p={[-0.9 + i * 0.9, 0.1, 0.55]} rot={[-0.5, 0, 0]} w={0.6} h={0.16} tex={cartel("raz" + i, e.tx, { size: 90 })} k={i === 2 ? s3 : ent(tt, at(i))} />)}
  </Estudio>;
}}</Stage>;

// ── 7 · CORTEZA QUE CANTA: la hogaza sobre la pala; llegan el fuego, el vapor y el reloj de arena, y en cada uno la corteza se oscurece y se abre
const H7Canta: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#2a140a">{(tt) => {
  const E = IT(h), at = (i: number) => (E[i]?.a ?? h.at + 1 + i * 1.8) - h.at;
  const f = ent(tt, at(0)), st = ent(tt, at(1)), hr = ent(tt, at(2)), bake = 0.15 + 0.35 * f + 0.25 * st + 0.25 * hr;
  return <Estudio t={tt} cam={[0, 1.2, 3.1]} look={[0, 0.5, 0]} orbit={0.12}>
    <RBox p={[0, 0.03, 0.1]} s={[1.0, 0.04, 1.0]} r={0.2}>{M.madera("#9a6a3a")}</RBox>
    <RBox p={[0, 0.03, 1.0]} s={[0.12, 0.03, 1.0]} r={0.02}>{M.madera("#8a5a2a")}</RBox>
    <Hogaza p={[0, 0.2, 0.1]} s={1.0} bake={bake} open={st} flour={0.3} />
    <Fuego p={[-0.95, 0.05, -0.35]} f={f} t={tt} s={1.4} />
    <Vapor t={tt} p={[0, 0.45, 0.1]} o={0.45 * st * (1 - 0.6 * hr)} h={1.2} s={0.5} spread={0.4} n={14} />
    <group position={[0.95, 0.05 + 1.2 * (1 - hr), -0.2]} rotation={[0, 0, P * eio(tt, at(2) + 0.6, at(2) + 1.6)]} scale={1.6}>
      <mesh position={[0, 0.28, 0]} geometry={relojArenaGeo}>{M.vidrio()}</mesh>
      <mesh position={[0, 0.1, 0]}><coneGeometry args={[0.1 * (0.3 + 0.7 * cl(tt - at(2))), 0.1, 20]} /><meshStandardMaterial color="#d8b878" roughness={1} /></mesh>
      {[0, 0.56].map((y, i) => <mesh key={i} position={[0, y, 0]}><cylinderGeometry args={[0.2, 0.2, 0.04, 24]} />{M.madera("#5a3a22")}</mesh>)}
    </group>
    {E.map((e, i) => <Placa key={i} p={[-0.9 + i * 0.9, 0.06, 0.95]} rot={[-0.7, 0, 0]} w={0.5} h={0.15} tex={cartel("can" + i, e.tx, { size: 90 })} k={ent(tt, at(i))} />)}
  </Estudio>;
}}</Stage>;
const relojArenaGeo = new THREE.LatheGeometry([[0.001, -0.28], [0.17, -0.26], [0.16, -0.12], [0.03, 0.0], [0.16, 0.12], [0.17, 0.26], [0.001, 0.28]].map(([r, y]) => new THREE.Vector2(r, y)), 32);

// ── 8 · PESAS: la balanza de cocina antigua; cada ingrediente se vuelca al bol y la esfera de la balanza marca sus gramos
const H8Pesas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const E = IT(h), cur = E.reduce((c, e, i) => (t >= e.a ? i : c), -1), c0 = cur < 0 ? 0 : cur, a = (E[c0]?.a ?? h.at) - h.at;
  const pour = eio(tt, a + 0.1, a + 1.0), col = ["#f6f1e4", "#bfe0f0", "#ffffff", "#c9a86a"][c0];
  const needle = cur < 0 ? 0 : [0.9, 0.7, 0.18, 0.08][c0] * pour;
  return <Estudio t={tt} cam={[0.2, 1.4, 2.8]} look={[0, 0.6, 0]} orbit={0.1}>
    <RBox p={[0, 0.25, 0]} s={[0.8, 0.5, 0.6]} r={0.08}><meshPhysicalMaterial color="#c8382a" roughness={0.35} clearcoat={1} /></RBox>
    <mesh position={[0, 0.25, 0.305]}><circleGeometry args={[0.2, 48]} /><meshStandardMaterial color="#f6f1e4" roughness={0.6} /></mesh>
    <mesh position={[0, 0.25, 0.31]} rotation={[0, 0, P2 * 0.0 - needle * 2 * P * 0.8]}><mesh position={[0, 0.08, 0]}><boxGeometry args={[0.012, 0.16, 0.005]} /><meshBasicMaterial color="#8a2f24" /></mesh></mesh>
    <mesh position={[0, 0.25, 0.312]}><ringGeometry args={[0.19, 0.205, 48]} />{M.cromo()}</mesh>
    <mesh position={[0, 0.52, 0]}><cylinderGeometry args={[0.38, 0.38, 0.03, 40]} />{M.cromo()}</mesh>
    <Bol p={[0, 0.53, 0]} s={0.55}><mesh position={[0, 0.06 + 0.12 * cl((cur + pour) / 4), 0]}><cylinderGeometry args={[0.45, 0.35, 0.04 + 0.2 * cl((cur + pour) / 4), 32]} /><meshStandardMaterial color="#f3ead6" roughness={1} /></mesh></Bol>
    {cur >= 0 && <Chorro a={[0.45, 1.4, 0]} b={[0.05, 0.75, 0]} r={c0 === 1 ? 0.03 : 0.02 + 0.02 * (c0 === 0 ? 1 : 0)} c={col} o={Math.sin(pour * P) * 0.9} t={tt} splash={c0 === 1} />}
    {/* la cifra: grabada en una plaquita al pie de la balanza */}
    {E.map((e, i) => <Placa key={i} p={[0, 0.06, 0.55]} rot={[-0.7, 0, 0]} w={0.6} h={0.18} tex={cartel("gr" + i, e.tx, { size: 110 })} k={i === c0 && cur >= 0 ? ent(tt, (E[i].a - h.at) + 0.6) : 0} />)}
  </Estudio>;
}}</Stage>;

// ── 9 · TERMÓMETRO: jarra de agua con termómetro de vidrio; la columna sube a 27 (franja verde); el chorro de la pava la dispara y la levadura se apaga y se hunde
const H9Termo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const hot = eio(tt, 3.4, 4.4) * (1 - eio(tt, 6.0, 6.8)), lvl = lerp(0, 0.42, eio(tt, 0.6, 2.2)) + 0.4 * hot, die = cl((tt - 4.2) / 1.2) * (1 - eio(tt, 6.0, 6.8));
  return <Estudio t={tt} cam={[0.35, 1.05, 2.25]} look={[0.25, 0.7, 0]} orbit={0.1}>
    <mesh position={[0, 0.35, 0]} geometry={jarroGeo}>{M.vidrio()}</mesh>
    <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.33, 0.3, 0.58, 32]} />{M.liquido("#cfe6f0", 0.35)}</mesh>
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.4, lerp(0.56, 0.08 + rn(i, 3) * 0.05, die), (rn(i, 2) - 0.5) * 0.4]} scale={0.018}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={new THREE.Color("#d8b070").lerp(new THREE.Color("#6a6a66"), die)} roughness={0.9} /></mesh>)}
    {/* termómetro */}
    <group position={[0.12, 0.75, 0.05]} rotation={[0, 0, -0.12]}>
      <mesh><cylinderGeometry args={[0.03, 0.03, 1.1, 16]} />{M.vidrio()}</mesh>
      <mesh position={[0, -0.55, 0]}><sphereGeometry args={[0.05, 16, 12]} /><meshBasicMaterial color="#d0302a" toneMapped={false} /></mesh>
      <mesh position={[0, -0.55 + (0.05 + lvl) / 2, 0]}><cylinderGeometry args={[0.012, 0.012, 0.05 + lvl, 10]} /><meshBasicMaterial color="#d0302a" toneMapped={false} /></mesh>
      <mesh position={[0.04, -0.55 + 0.47, 0.0]}><boxGeometry args={[0.03, 0.06, 0.01]} /><meshBasicMaterial color="#6abf4a" toneMapped={false} /></mesh>
      <Placa p={[0.2, -0.08, 0]} w={0.24} h={0.11} tex={cartel("t27", "27°", { size: 120, ink: "#3a6a2a" })} k={ent(tt, 2.0)} />
    </group>
    {/* pava con chorro humeante */}
    <group position={[0.9, 1.25 + 0.6 * (1 - ent(tt, 2.9)), 0]} rotation={[0, 0, 0.5 * eio(tt, 3.1, 3.5) * (1 - eio(tt, 5.6, 6.0))]}>
      <mesh geometry={pavaGeo} castShadow><meshPhysicalMaterial color="#2c5a8a" roughness={0.25} clearcoat={1} /></mesh>
      <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.2, 0.2, 0.012, 32]} />{M.hierro()}</mesh>
      <mesh position={[0, 0.315, 0]}><cylinderGeometry args={[0.1, 0.11, 0.03, 24]} /><meshPhysicalMaterial color="#2c5a8a" roughness={0.25} clearcoat={1} /></mesh>
      <mesh position={[0, 0.35, 0]}><sphereGeometry args={[0.035, 16, 12]} /><meshStandardMaterial color="#1a1410" roughness={0.5} /></mesh>
      <mesh position={[0, 0.33, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.17, 0.016, 10, 32, P]} />{M.cromo("#c8ccd0")}</mesh>
      <mesh position={[-0.27, 0.15, 0]} rotation={[0, 0, 0.85]}><cylinderGeometry args={[0.022, 0.05, 0.26, 14]} /><meshPhysicalMaterial color="#2c5a8a" roughness={0.25} clearcoat={1} /></mesh>
    </group>
    {hot > 0.05 && <Chorro a={[0.6, 1.3, 0]} b={[0.05, 0.62, 0]} r={0.025} c="#e8f4fa" o={0.6 * hot} t={tt} />}
    <Vapor t={tt} p={[0, 0.62, 0]} o={0.35 * hot} h={0.9} s={0.35} spread={0.3} n={10} />
  </Estudio>;
}}</Stage>;
const jarroGeo = new THREE.LatheGeometry([[0, -0.35], [0.33, -0.35], [0.36, -0.3], [0.37, 0.3], [0.35, 0.36]].map(([r, y]) => new THREE.Vector2(r, y)), 40);
const pavaGeo = new THREE.LatheGeometry([[0, 0.01], [0.2, 0.01], [0.25, 0.07], [0.26, 0.15], [0.22, 0.25], [0.12, 0.31], [0.001, 0.31]].map(([r, y]) => new THREE.Vector2(r, y)), 32);

// ── 10 · SAL Y LEVADURA: bol visto desde arriba; la cuchara de madera hace de muro; un grano de sal rueda hacia la levadura y la cuchara lo ataja; después cae el agua al medio
const H10Separa: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const roll = eio(tt, 2.2, 3.4), back = eio(tt, 3.4, 4.0), pour = cl((tt - 4.6) / 0.4) * (1 - cl((tt - 6.6) / 0.4));
  return <Estudio t={tt} cam={[0, 2.6, 1.3]} look={[0, 0.2, 0]} orbit={0.06} fov={30}>
    <Bol p={[0, 0, 0]} s={1.1}><mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.6, 0.38, 0.12, 40]} /><meshStandardMaterial color="#f6efe0" roughness={1} /></mesh></Bol>
    {Array.from({ length: 40 }, (_, i) => <mesh key={"s" + i} position={[-0.38 + (rn(i, 1) - 0.5) * 0.18, 0.22 + rn(i, 3) * 0.04 + fall(tt, 0.3 + i * 0.01, 0.5), (rn(i, 2) - 0.5) * 0.18]} rotation={[rn(i, 4), rn(i, 5), 0]} scale={0.014}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#ffffff" roughness={0.2} clearcoat={1} /></mesh>)}
    {Array.from({ length: 50 }, (_, i) => <mesh key={"y" + i} position={[0.38 + (rn(i, 6) - 0.5) * 0.18, 0.22 + rn(i, 8) * 0.03 + fall(tt, 1.0 + i * 0.01, 0.5), (rn(i, 7) - 0.5) * 0.18]} scale={[0.012, 0.008, 0.012]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#c9a46a" roughness={0.9} /></mesh>)}
    {/* el grano rebelde */}
    <mesh position={[lerp(-0.3, -0.08, roll) - 0.12 * back, 0.24 + 0.02 * Math.abs(Math.sin(roll * 9)), 0.05]} rotation={[0, 0, -roll * 6]} scale={0.025}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#ffffff" roughness={0.2} clearcoat={1} emissive="#ffe0b0" emissiveIntensity={0.3} /></mesh>
    <group position={[0, 0.3 + 0.5 * (1 - ent(tt, 1.6)), 0]} rotation={[0, -0.05 + 0.18 * back, 0]}>
      <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.025, 0.03, 1.4, 12]} />{M.madera("#a06a3c")}</mesh>
    </group>
    {pour > 0.02 && <Chorro a={[0, 1.6, 0.15]} b={[0, 0.2, 0.05]} r={0.04} c="#d8eef6" o={0.7 * pour} t={tt} />}
  </Estudio>;
}}</Stage>;

// ── 11 · CAMPANARIO: el reloj de la plaza corre 12 horas (luna y sol cruzan detrás) y la masa en la artesa crece y burbujea sola
const H11Campanario: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#141826">{(tt) => {
  const k = eio(tt, 1.0, 6.0), hr = 9 + 12 * k, sky = Math.sin(k * P);
  return <Estudio t={tt} cam={[0.2, 1.75, 4.6]} look={[0, 1.55, 0]} orbit={0.08}>
    <RBox p={[0, 1.6, -0.3]} s={[1.3, 3.2, 0.9]} r={0.02}><meshStandardMaterial color="#c9a87a" roughness={0.95} /></RBox>
    <mesh position={[0, 3.45, -0.3]} rotation={[0, P / 4, 0]}><coneGeometry args={[0.95, 0.6, 4]} /><meshStandardMaterial color="#8a4a2a" roughness={0.8} /></mesh>
    <Reloj p={[0, 2.5, 0.16]} s={0.95} h={hr} romano marco="#5a4028" />
    <pointLight position={[0, 2.5, 0.8]} intensity={0.6 + 1.2 * (1 - sky)} distance={2} color="#ffe6b0" />
    {/* astro que cruza: luna → sol */}
    <mesh position={[lerp(-2.4, 2.4, k), 2.2 + 1.3 * sky, -2.2]}><sphereGeometry args={[0.22, 24, 16]} /><meshBasicMaterial color={new THREE.Color("#dfe6f0").lerp(new THREE.Color("#ffd27a"), cl(k * 2 - 0.6))} toneMapped={false} /></mesh>
    {/* artesa con la masa */}
    <group position={[0, 0.0, 1.1]}>
      <RBox p={[0, 0.18, 0]} s={[1.5, 0.36, 0.6]} r={0.05}>{M.madera("#6a4428")}</RBox>
      <Masa p={[0, 0.3, 0]} r={0.62} rise={0.15 + 0.85 * k} t={tt} />
    </group>
  </Estudio>;
}}</Stage>;

// ── 12 · RED DE GLUTEN: dos clases de hebras sueltas se buscan, se dan la mano y tejen una red; las burbujas de la levadura la inflan sin romperla
const NODES = Array.from({ length: 30 }, (_, i) => ({ x: ((i % 6) - 2.5) * 0.42, y: (Math.floor(i / 6) - 2) * 0.36 + ((i % 6) % 2) * 0.18 }));
const H12Red: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#2a1e10">{(tt) => {
  const j = eio(tt, 0.8, 3.4), g = eio(tt, 4.0, 6.0);
  const pos = (i: number): V3 => { const n = NODES[i], sx = (rn(i, 1) - 0.5) * 3, sy = (rn(i, 2) - 0.5) * 2.2, b = Math.hypot(n.x, n.y);
    return [lerp(sx, n.x * (1 + 0.15 * g * (1 - b / 2)), j) + 0.02 * Math.sin(tt * 1.3 + i), 1.1 + lerp(sy, n.y * (1 + 0.15 * g), j) + 0.02 * Math.cos(tt + i), 0]; };
  const links: [number, number][] = []; NODES.forEach((a, i) => NODES.forEach((b, k) => { if (k > i && Math.hypot(a.x - b.x, a.y - b.y) < 0.5) links.push([i, k]); }));
  return <Estudio t={tt} cam={[0, 1.1, 3.6]} look={[0, 1.1, 0]} orbit={0.1} mesa={false}>
    {NODES.map((_, i) => <mesh key={i} position={pos(i)}><sphereGeometry args={[0.05, 16, 12]} /><meshPhysicalMaterial color={i % 2 ? "#e0a84a" : "#c97a3a"} roughness={0.3} clearcoat={0.8} /></mesh>)}
    {links.map(([a, b], i) => { const A = new THREE.Vector3(...pos(a)), B = new THREE.Vector3(...pos(b)), L = A.distanceTo(B), k = cl((j - 0.6 - rn(i, 3) * 0.3) / 0.25);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
      return <mesh key={"l" + i} position={A.clone().lerp(B, 0.5)} quaternion={q} scale={[1, 0.001 + k, 1]}><cylinderGeometry args={[0.012, 0.012, L, 6]} /><meshStandardMaterial color="#f0c878" roughness={0.4} emissive="#ffb040" emissiveIntensity={0.15 * k} /></mesh>; })}
    {[[-0.6, 0.95], [0.45, 1.3], [0.0, 0.8], [0.7, 0.7], [-0.3, 1.45]].map(([x, y], i) => <mesh key={"b" + i} position={[x, y, 0.05]} scale={0.001 + 0.17 * cl(g * 1.4 - i * 0.12)}><sphereGeometry args={[1, 24, 16]} /><meshPhysicalMaterial color="#ffffff" roughness={0} transmission={1} thickness={0.2} transparent opacity={0.35} clearcoat={1} depthWrite={false} /></mesh>)}
    <pointLight position={[0, 1.2, 1.2]} intensity={2} distance={4} color="#ffd9a0" />
  </Estudio>;
}}</Stage>;

// ── 13 · PLIEGUE: el bol gira un cuarto por vez; cada lado de la masa se levanta y se dobla al centro (cuatro solapas) con la mano mojada encima
const H13Pliegue: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const step = (i: number) => eio(tt, 0.8 + i * 1.3, 1.6 + i * 1.3), turn = [0, 1, 2, 3].reduce((s, i) => s + eio(tt, 1.6 + i * 1.3, 2.0 + i * 1.3), 0);
  return <Estudio t={tt} cam={[0, 2.1, 1.9]} look={[0, 0.2, 0]} orbit={0.06} fov={32}>
    <group rotation={[0, -turn * P2, 0]}>
      <Bol p={[0, 0, 0]} s={1.1} />
      <Masa p={[0, 0.08, 0]} r={0.5} rise={0.5 + 0.1 * cl(turn / 4)} t={tt} bub={0.6} />
      {[0, 1, 2, 3].map((i) => { const k = step(i); return <group key={i} rotation={[0, -i * P2, 0]}>
        <group position={[0, 0.22, 0.4]} rotation={[-k * P * 0.92, 0, 0]}>
          <mesh position={[0, 0.01, -0.1 * 0 + 0.0]} rotation={[-P2, 0, 0]} scale={[0.5, 0.26, 1]}><circleGeometry args={[0.5, 24, 0, P]} /><meshPhysicalMaterial color="#efdcb4" roughness={0.55} sheen={0.8} side={THREE.DoubleSide} /></mesh>
        </group></group>; })}
    </group>
    <Mano p={[0.15 + 0.1 * Math.sin(tt * 1.4), 0.75, 0.35]} rot={[-0.9, 0.3, 0]} pinza={0.3} s={0.9} />
    {Array.from({ length: 6 }, (_, i) => { const k = ((tt * 0.8 + rn(i, 1)) % 1); return <mesh key={i} position={[0.15 + (rn(i, 2) - 0.5) * 0.2, 0.7 - k * 0.5, 0.15]} scale={0.012 * (1 - k)}><sphereGeometry args={[1, 8, 6]} />{M.liquido("#dff0f8", 0.8)}</mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 14 · OLLA AL HORNO: corte del horno; la olla de hierro vacía con tapa se pone al rojo de a poco y la perilla gira hasta 240
const H14Precalor: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#2a120a">{(tt) => {
  const k = eio(tt, 0.8, 5.5), dial = eio(tt, 0.4, 1.4);
  return <Estudio t={tt} cam={[0.3, 1.0, 3.0]} look={[0, 0.7, 0]} orbit={0.1}>
    <RBox p={[0, 0.7, -0.1]} s={[1.8, 1.3, 1.2]} r={0.04}><meshStandardMaterial color="#5a4a3e" roughness={0.6} metalness={0.3} side={THREE.BackSide} /></RBox>
    {[0.25, 1.2].map((y, j) => Array.from({ length: 11 }, (_, i) => <mesh key={j + "-" + i} position={[-0.7 + i * 0.14, y, 0]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 0.9, 6]} /><meshStandardMaterial color="#3a3634" metalness={0.7} roughness={0.4} emissive="#ff4a10" emissiveIntensity={j ? 0.2 + 1.6 * k : 0.05} toneMapped={false} /></mesh>))}
    {/* resistencia de arriba al rojo */}
    <mesh position={[0, 1.3, -0.1]} rotation={[P2, 0, 0]}><torusGeometry args={[0.55, 0.015, 8, 48]} /><meshStandardMaterial color="#401810" emissive="#ff3a10" emissiveIntensity={0.2 + 2.5 * k} toneMapped={false} /></mesh>
    <group position={[0, 0.3, 0]}>
      <mesh geometry={ollaHGeo} castShadow><meshStandardMaterial color="#1a1918" roughness={0.78} metalness={0.35} bumpMap={hierroTex()} bumpScale={1.5} /></mesh>
      <mesh position={[0, 0.47, 0]} scale={[1, 0.25, 1]}><sphereGeometry args={[0.49, 32, 12, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#1a1918" roughness={0.78} metalness={0.35} bumpMap={hierroTex()} bumpScale={1.5} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.52, 0.4, 0]} rotation={[0, 0, sd * P2]}><torusGeometry args={[0.07, 0.02, 8, 16, P]} /><meshStandardMaterial color="#1a1918" roughness={0.78} metalness={0.35} /></mesh>)}
      <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.06, 0.08, 0.06, 16]} />{M.hierro()}</mesh>
    </group>
    {/* aire que tiembla */}
    {Array.from({ length: 8 }, (_, i) => { const q = ((tt * 0.5 + rn(i, 1)) % 1); return <mesh key={i} position={[(rn(i, 2) - 0.5) * 1.2, 0.95 + q * 0.3, 0.2]} scale={[0.25, 0.06, 1]}><planeGeometry args={[1, 1]} /><meshBasicMaterial color="#ffb070" transparent opacity={0.12 * k * Math.sin(q * P)} depthWrite={false} /></mesh>; })}
    <pointLight position={[0, 1.1, 0.4]} intensity={0.6 + 2.4 * k} distance={3} color="#ff8a40" />
    {/* perilla */}
    <group position={[1.15, 1.2, 0.5]}>
      <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.06, 40]} />{M.cromo()}</mesh>
      <mesh position={[0, 0, 0.035]} rotation={[0, 0, -dial * P * 1.4]}><mesh position={[0, 0.12, 0]}><boxGeometry args={[0.03, 0.08, 0.01]} /><meshBasicMaterial color="#b8281c" /></mesh></mesh>
      <Placa p={[0, -0.32, 0]} w={0.42} h={0.14} tex={cartel("240", "240 °C", { size: 110, ink: "#8a2f24" })} k={ent(tt, 1.3)} />
    </group>
  </Estudio>;
}}</Stage>;
const hierroTex = () => ctex("hierro", 256, 256, (g) => { g.fillStyle = "#808080"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 2200; i++) { g.fillStyle = `rgba(${rn(i, 1) > 0.5 ? 255 : 0},${rn(i, 1) > 0.5 ? 255 : 0},${rn(i, 1) > 0.5 ? 255 : 0},${0.12 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 2 + rn(i, 5) * 3, 2 + rn(i, 6) * 3); } });
const ollaHGeo = new THREE.LatheGeometry([[0, 0], [0.42, 0], [0.47, 0.05], [0.48, 0.47], [0.44, 0.47], [0.43, 0.06], [0, 0.05]].map(([r, y]) => new THREE.Vector2(r, y)), 48);

// ── 15 · NUBE: la olla cortada al medio; adentro la masa pálida suelta vapor que llena la olla, crece y abre la greña; se levanta la tapa y la nube escapa
const ollaCut = new THREE.LatheGeometry([[0, 0], [0.62, 0], [0.68, 0.06], [0.7, 0.62], [0.64, 0.62], [0.62, 0.07], [0, 0.06]].map(([r, y]) => new THREE.Vector2(r, y)), 48, 0, P);
const H15Nube: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#20140c">{(tt) => {
  const st = cl((tt - 0.6) / 1.5), rise = eio(tt, 1.2, 4.2), lid = eio(tt, 4.6, 5.6);
  return <Estudio t={tt} cam={[0, 1.15, 2.7]} look={[0, 0.4, 0]} orbit={0.08}>
    <group rotation={[0, P, 0]}><mesh geometry={ollaCut} castShadow receiveShadow><meshStandardMaterial color="#1c1a19" roughness={0.45} metalness={0.6} side={THREE.DoubleSide} /></mesh></group>
    <mesh position={[0, 0.32, 0]} rotation={[0, 0, 0]}><planeGeometry args={[1.34, 0.56]} /><meshStandardMaterial color="#3a2a22" roughness={0.9} transparent opacity={0.0} /></mesh>
    <Hogaza p={[0, 0.08, -0.05]} s={0.95} bake={0.08 + 0.25 * rise} open={rise} rise={0.55 + 0.45 * rise} flour={0.4} />
    <Vapor t={tt} p={[0, 0.25, -0.1]} o={0.5 * st * (1 - 0.5 * lid)} h={0.4 + 1.4 * lid} s={0.45} spread={0.7} n={16} />
    <group position={[0.25 * lid, 0.66 + 0.9 * lid, -0.1 - 0.2 * lid]} rotation={[0, 0, -0.5 * lid]}>
      <mesh scale={[1, 0.22, 1]}><sphereGeometry args={[0.7, 40, 12, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#1c1a19" roughness={0.45} metalness={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.07, 0.09, 0.07, 16]} />{M.hierro()}</mesh>
    </group>
    <pointLight position={[0, 0.5, 0.6]} intensity={1.4} distance={2.5} color="#ffb070" />
  </Estudio>;
}}</Stage>;

// ── 16 · CASTAÑA: tres hogazas suben una escalera de tablas — pálida, dorada, castaña —; una castaña real cae y rueda junto a la última
const H16Castana: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const B = [0.1, 0.5, 1.0];
  return <Estudio t={tt} cam={[0.2, 1.3, 3.6]} look={[0, 0.6, 0]} orbit={0.12}>
    {B.map((b, i) => { const k = sp(tt, 0.5 + i * 0.9), x = -1.0 + i * 1.0, y = i * 0.28;
      return <group key={i}>
        <RBox p={[x, y * 0.5 + 0.02, 0]} s={[0.85, y + 0.04, 0.7]} r={0.02}>{M.madera(["#7a5232", "#6a4428", "#5a3820"][i])}</RBox>
        <Hogaza p={[x, y + 0.04 + 1.2 * (1 - cl(k)), 0]} s={0.75 * (0.9 + 0.1 * k)} bake={b} open={0.8} flour={0.3} />
        <Placa p={[x, y * 0.5 + 0.02, 0.36]} w={0.5} h={0.12} tex={cartel("cs" + i, ["PALE", "GOLD", "CHESTNUT"][i], { size: 90 })} k={ent(tt, 0.9 + i * 0.9)} />
      </group>; })}
    <pointLight position={[1.0, 1.3, 0.8]} intensity={1.5 * ent(tt, 2.6)} distance={2} color="#ffcf90" />
    {/* la castaña */}
    {(() => { const a = 3.4, x = lerp(1.4, 1.45, eio(tt, a + 0.4, a + 1.5)), r = (tt - a) * 6 * (1 - cl(tt - a - 1.5));
      return <mesh position={[x - 0.15 * eio(tt, a + 0.4, a + 1.5), 0.6 + 0.07 + fall(tt, a, 1.4), 0.25]} rotation={[0, 0, -r]} scale={[0.1, 0.085, 0.07]} castShadow><sphereGeometry args={[1, 24, 16]} /><meshPhysicalMaterial color={corteza(1)} roughness={0.25} clearcoat={1} /></mesh>; })()}
  </Estudio>;
}}</Stage>;

// ── 17 · TAMBOR: la hogaza boca abajo; el nudillo golpea tres veces y cada golpe abre un anillo de sonido y hace saltar las migas de harina
const H17Tambor: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const K = [1.2, 2.0, 2.8], hit = K.reduce((s, a) => s + Math.max(0, Math.sin(cl((tt - a + 0.25) / 0.5) * P)), 0);
  return <Estudio t={tt} cam={[0.3, 1.0, 2.4]} look={[0, 0.35, 0]} orbit={0.1}>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.5 + i * 0.125, 0.06, 0]}><boxGeometry args={[0.01, 0.01, 0.9]} />{M.cromo("#8a8a88")}</mesh>)}
    <Hogaza p={[0, 0.1, 0]} rot={[P, 0, 0]} s={0.9} bake={0.9} open={0.6} flour={0} />
    <mesh position={[0, 0.235, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.36, 40]} /><meshStandardMaterial color={corteza(0.85)} roughness={0.9} /></mesh>
    <mesh position={[0, 0.237, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.3, 40]} /><meshStandardMaterial color="#f4ecd8" transparent opacity={0.45} roughness={1} /></mesh>
    <Mano p={[0.05, 0.36 + 0.22 * (1 - Math.min(1, hit)), 0.1]} rot={[-1.4, 0, 0.3]} pinza={1} s={0.9} />
    {K.map((a, i) => { const k = cl((tt - a) / 0.9); return <mesh key={i} position={[0, 0.25, 0]} rotation={[-P2, 0, 0]} scale={0.3 + 1.6 * k} visible={k > 0 && k < 1}><ringGeometry args={[0.95, 1, 64]} /><meshBasicMaterial color="#ffe2a0" transparent opacity={0.55 * (1 - k)} toneMapped={false} depthWrite={false} /></mesh>; })}
    {Array.from({ length: 18 }, (_, i) => { const a = K[i % 3], x = tt - a, y = Math.max(0, 1.6 * x - 4.9 * x * x); return <mesh key={"m" + i} position={[(rn(i, 1) - 0.5) * 0.5, 0.25 + y, (rn(i, 2) - 0.5) * 0.5]} scale={0.008} visible={x > 0 && x < 0.4}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#fbf6ea" /></mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 18 · LOS 5 ERRORES (bloque): un plato giratorio de madera con las cinco fotos paradas; cada error gira al frente, se ilumina y recibe su número
const numTex = (n: string) => papel("bnum" + n, [n], { w: 256, h: 256, size: 190, ink: "#b8281c", bg: "#f6f1e4", font: "900 190px Georgia, serif" });
const H18Errores: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#2a0f0a">{(tt) => {
  const E = IT(h), cur = Math.max(0, E.reduce((c, e, i) => (t >= e.a ? i : c), 0)), N = 5;
  const rot = E.reduce((s, e, i) => s + (i === 0 ? 0 : eio(tt, e.a - h.at - 0.2, e.a - h.at + 0.7)), 0) * (2 * P / N);
  return <Estudio t={tt} cam={[0, 1.45, 3.9]} look={[0, 0.75, 0]} orbit={0.05}>
    <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[1.5, 1.55, 0.1, 64]} />{M.madera("#6a4428")}</mesh>
    <group rotation={[0, rot, 0]}>
      {Array.from({ length: N }, (_, i) => { const a = -(i / N) * 2 * P, k = ent(tt, 0.2 + i * 0.12), on = i === cur;
        return <group key={i} rotation={[0, a, 0]}><group position={[0, 0.1 + 0.62 * k, 1.05]} rotation={[0, 0, 0]} scale={on ? 1.08 : 0.92}>
          <Foto3D src={img(h.imgs?.[i] ?? h.bg ?? "")} w={1.3} h={0.9} dim={on ? 0 : 0.45}>
            <mesh position={[-0.55, 0.38, 0.03]} rotation={[0, 0, 0.1]}><planeGeometry args={[0.3, 0.3]} /><meshStandardMaterial map={numTex(String(i + 1))} roughness={0.9} /></mesh>
            {E[i] && <mesh position={[0, -0.52, 0.03]}><planeGeometry args={[1.2, 0.2]} /><meshStandardMaterial map={papel("berr" + i, [E[i].tx], { w: 1024, h: 170, size: 110 })} roughness={0.9} /></mesh>}
          </Foto3D></group></group>; })}
    </group>
    <pointLight position={[0, 1.1, 2.2]} intensity={2.4} distance={3} color="#ffe0b0" />
  </Estudio>;
}}</Stage>;

// ── 19 · PIZARRA (CTA2): la pizarra de la panadería en su caballete; la tiza escribe la pregunta y al lado aparece la bolsa girando con un 22 escrito
const preguntaTex = (k: number) => ctex("preg" + Math.round(k * 40), 1024, 512, (g) => {
  g.fillStyle = "#22302a"; g.fillRect(0, 0, 1024, 512); for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(255,255,255,${0.03 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 1024, rn(i, 3) * 512, 30, 2); }
  g.save(); g.beginPath(); g.rect(0, 0, 1024 * k, 512); g.clip(); g.fillStyle = "#f4f1e8"; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = `700 120px Caveat, "Segoe Script", cursive`; g.fillText("How many on", 512, 190); g.fillText("YOUR bag?", 512, 330); g.restore();
});
const H19Pizarra: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const w = eio(tt, 0.8, 3.6), bag = ent(tt, 3.4);
  return <Estudio t={tt} cam={[0.25, 1.25, 3.5]} look={[0.2, 0.95, 0]} orbit={0.08}>
    {[[-0.6, 0.18], [0.6, -0.18]].map(([x, r], i) => <mesh key={i} position={[x * 0.9, 0.8, -0.15]} rotation={[0.12, 0, r]}><boxGeometry args={[0.06, 1.7, 0.06]} />{M.madera("#6a4428")}</mesh>)}
    <RBox p={[0, 1.15, 0]} s={[1.7, 1.0, 0.06]} r={0.02}>{M.madera("#5a3a22")}</RBox>
    <mesh position={[0, 1.15, 0.035]}><planeGeometry args={[1.56, 0.86]} /><meshStandardMaterial map={preguntaTex(w)} roughness={0.95} /></mesh>
    <mesh position={[lerp(-0.7, 0.7, w), 1.0 + 0.15 * Math.sin(w * P * 6), 0.12]} rotation={[0, 0, 0.6]}><cylinderGeometry args={[0.02, 0.02, 0.14, 10]} /><meshStandardMaterial color="#f4f1e8" roughness={1} /></mesh>
    <group position={[1.05, 0.08 + 0.8 * (1 - bag), 0.55]} rotation={[0, -0.6 + 0.35 * Math.sin(tt * 0.5), 0]}><Bolsa s={0.42} n={8} label={cartel("b22", "22", { w: 256, h: 192, size: 160, bg: "#efe4c8", ink: "#8a2f24" })} /></group>
  </Estudio>;
}}</Stage>;

// ── 20 · RUTINA (bloque): el reloj grande de la cocina; la aguja salta a cada hora y en el estante de abajo aparece lo de ese paso (bol, mano, tela, olla, hogaza)
const H20Rutina: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const E = IT(h), H0 = [8, 8, 8.75, 9.75, 11.5], cur = E.reduce((c, e, i) => (t >= e.a ? i : c), 0);
  const hr = E.reduce((s, e, i) => i === 0 ? H0[0] : lerp(s, H0[i] + (i >= 1 ? 12 : 0), eio(tt, e.a - h.at - 0.3, e.a - h.at + 0.6)), H0[0]);
  const X = (i: number) => -1.2 + i * 0.6, k = (i: number) => E[i] ? ent(tt, E[i].a - h.at) : 0;
  return <Estudio t={tt} cam={[0, 1.3, 3.6]} look={[0, 1.05, 0]} orbit={0.08}>
    <Reloj p={[0, 1.55, -0.2]} s={1.15} h={hr} />
    <RBox p={[0, 0.55, -0.1]} s={[3.0, 0.06, 0.5]} r={0.01}>{M.madera("#6a4428")}</RBox>
    <group position={[X(0), 0.58 + 0.6 * (1 - k(0)), 0]} scale={0.001 + k(0)}><Bol s={0.32}><Masa p={[0, 0.05, 0]} r={0.6} rise={0.1} rough={1} /></Bol></group>
    <group position={[X(1), 0.75 + 0.6 * (1 - k(1)), 0.05]} scale={0.001 + k(1)}><Mano p={[0, 0, 0]} rot={[-0.4, 0, 0]} pinza={0.2} s={0.7} /></group>
    <group position={[X(2), 0.6 + 0.6 * (1 - k(2)), 0]} scale={0.001 + k(2)}><mesh scale={[0.25, 0.1, 0.18]}><sphereGeometry args={[1, 24, 12]} /><meshStandardMaterial color="#e9e1cf" roughness={0.95} /></mesh></group>
    <group position={[X(3), 0.58 + 0.6 * (1 - k(3)), 0]} scale={0.001 + k(3) * 0.45}><mesh geometry={ollaHGeo}>{M.hierro()}</mesh></group>
    <group position={[X(4), 0.6 + 0.6 * (1 - k(4)), 0]} scale={0.001 + k(4)}><Hogaza s={0.5} bake={1} /></group>
    {E.map((e, i) => <Placa key={i} p={[X(i), 0.42, 0.18]} w={0.5} h={0.13} tex={cartel("rut" + i, e.tx, { size: 90 })} k={k(i) * (i <= cur ? 1 : 0)} />)}
  </Estudio>;
}}</Stage>;

// ── 21 · TRES VIDAS: la hogaza vieja se parte en tres y cada pedazo vuela a su segunda vida: sopa de ajo, pan rallado, torrijas
const H21Vidas: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const split = eio(tt, 1.0, 1.6), fly = (i: number) => eio(tt, 1.8 + i * 0.7, 2.6 + i * 0.7), D: V3[] = [[-1.1, 0.35, 0.2], [0, 0.55, -0.3], [1.1, 0.25, 0.2]];
  return <Estudio t={tt} cam={[0, 1.6, 3.4]} look={[0, 0.4, 0]} orbit={0.1}>
    {[0, 1, 2].map((i) => { const a0: V3 = [(i - 1) * 0.18 * split, 0.22, 0.6], q = fly(i), d = D[i];
      return <group key={i} position={[lerp(a0[0], d[0], q), lerp(a0[1], d[1], q) + Math.sin(q * P) * 0.6, lerp(a0[2], d[2], q)]} scale={1 - 0.6 * q} rotation={[0, (i - 1) * 0.5 * split, q * 3]}>
        <Hogaza s={0.45} bake={0.95} open={0.5} rot={[0, (i * 2 * P) / 3, 0]} /></group>; })}
    <group position={[-1.1, 0, 0.2]} scale={0.001 + ent(tt, 1.6)}>
      <mesh geometry={cuencoGeo} castShadow>{M.barro("#9a4f2c")}</mesh>
      <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.3, 0.2, 0.02, 32]} />{M.liquido("#b8401c", 0.95)}</mesh>
      <mesh position={[0, 0.19, 0]} scale={[0.09, 0.04, 0.09]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#fbf6ea" roughness={0.4} /></mesh>
      <mesh position={[0, 0.215, 0]} scale={[0.04, 0.02, 0.04]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#f0b020" roughness={0.3} /></mesh>
    </group>
    <Frasco p={[0, 0, -0.3]} s={0.001 + 0.7 * ent(tt, 2.3)} nivel={0.3 + 0.5 * fly(1)} c="#d8a650" />
    <group position={[1.1, 0, 0.2]} scale={0.001 + ent(tt, 3.0)}>
      <mesh geometry={platGeo} scale={1.2}><meshPhysicalMaterial color="#f3efe6" roughness={0.2} clearcoat={0.8} /></mesh>
      {[0, 1].map((i) => <RBox key={i} p={[-0.1 + i * 0.2, 0.06, 0]} s={[0.17, 0.06, 0.28]} r={0.03} rot={[0, 0.2 * i, 0]}><meshStandardMaterial color="#c88838" roughness={0.6} /></RBox>)}
    </group>
    {["SOUP", "CRUMBS", "TORRIJAS"].map((tx, i) => <Placa key={i} p={[D[i][0], 0.06, 0.75]} rot={[-0.6, 0, 0]} w={0.5} h={0.13} tex={cartel("vid" + i, tx, { size: 90 })} k={ent(tt, 2.4 + i * 0.7)} />)}
  </Estudio>;
}}</Stage>;
const cuencoGeo = new THREE.LatheGeometry([[0, 0], [0.18, 0], [0.3, 0.1], [0.34, 0.2], [0.31, 0.2], [0.27, 0.11], [0.16, 0.03], [0, 0.03]].map(([r, y]) => new THREE.Vector2(r, y)), 40);

// ── 22 · PULGAR: primerísimo plano de la corteza; el pulgar de la señora aprieta y las grietas corren como un mapa, con crujido de migas
const grietaTex = (k: number) => ctex("grieta" + Math.round(k * 30), 512, 512, (g) => {
  g.clearRect(0, 0, 512, 512); g.strokeStyle = "rgba(40,20,8,.85)"; g.lineCap = "round";
  for (let r = 0; r < 9; r++) { let x = 256, y = 256, a = (r / 9) * 2 * P + rn(r, 1); g.lineWidth = 5; g.beginPath(); g.moveTo(x, y);
    const n = Math.floor(14 * k); for (let s = 0; s < n; s++) { a += (rn(r * 31 + s, 2) - 0.5) * 0.9; x += Math.cos(a) * 16; y += Math.sin(a) * 16; g.lineTo(x, y); g.lineWidth = Math.max(1, 5 - s * 0.3); } g.stroke(); }
});
const H22Pulgar: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const press = Math.sin(cl((tt - 1.0) / 2.4) * P), cr = cl((tt - 1.4) / 1.6);
  return <Estudio t={tt} cam={[0.3, 1.0, 1.6]} look={[0, 0.4, 0]} orbit={0.06} fov={32}>
    <Hogaza p={[0, 0.0, 0]} s={1.4} bake={0.92} open={0.8} flour={0.2} />
    <mesh position={[0, 0.505 - 0.015 * press, 0.0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.6, 0.6]} /><meshBasicMaterial map={grietaTex(cr)} transparent depthWrite={false} /></mesh>
    <group position={[0.04, 0.6 - 0.08 * press + 0.35 * (1 - ent(tt, 0.4)), 0.08]} rotation={[-0.35, 0, 0.2]}><mesh position={[0, 0.1, 0]}><capsuleGeometry args={[0.05, 0.2, 8, 16]} /><meshPhysicalMaterial color="#e0a888" roughness={0.55} sheen={0.5} sheenColor="#ffd0c0" /></mesh><mesh position={[0, 0.02, 0.035]} rotation={[-0.3, 0, 0]} scale={[0.034, 0.012, 0.04]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#f0c8b8" roughness={0.3} /></mesh></group>
    {Array.from({ length: 14 }, (_, i) => { const x = tt - 1.5 - (i % 4) * 0.1, y = Math.max(0, 1.2 * x - 4.9 * x * x); return <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.4, 0.5 + y, (rn(i, 2) - 0.5) * 0.3]} scale={0.007 + 0.006 * rn(i, 3)} visible={x > 0 && x < 0.3}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={corteza(0.9)} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 23 · CUBO DE LEVADURA: a la izquierda la cucharita con 2 g de levadura seca; a la derecha caen tres cubitos de levadura fresca, uno sobre otro
const H23Cubo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => (
  <Estudio t={tt} cam={[0, 0.8, 1.7]} look={[0, 0.22, 0]} orbit={0.1}>
    <group position={[-0.55, 0.05, 0]} scale={0.001 + ent(tt, 0.3)}>
      <mesh position={[0, 0, 0.3]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.025, 0.03, 0.6, 10]} />{M.cromo()}</mesh>
      <mesh scale={[0.12, 0.04, 0.16]}><sphereGeometry args={[1, 20, 10, 0, 2 * P, P2, P2]} />{M.cromo()}</mesh>
      {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.12, 0.01 + rn(i, 3) * 0.03, (rn(i, 2) - 0.5) * 0.15]} scale={[0.01, 0.006, 0.01]}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#c9a46a" /></mesh>)}
    </group>
    {[0, 1, 2].map((i) => <RBox key={i} p={[0.45 + (i - 1) * 0.0, 0.07 + i * 0.14 + fall(tt, 1.6 + i * 0.6, 1.2), 0]} rot={[0, (rn(i, 1) - 0.5) * 0.4, 0]} s={[0.22, 0.13, 0.22]} r={0.02}><meshStandardMaterial color="#d9c49a" roughness={0.75} /></RBox>)}
    <Placa p={[-0.55, 0.05, 0.45]} rot={[-0.7, 0, 0]} w={0.4} h={0.12} tex={cartel("y2", "2 g", { size: 110 })} k={ent(tt, 0.8)} />
    <Placa p={[0.45, 0.05, 0.45]} rot={[-0.7, 0, 0]} w={0.4} h={0.12} tex={cartel("y6", "6 g", { size: 110 })} k={ent(tt, 3.2)} />
  </Estudio>)}</Stage>;

// ── 24 · FRASCO DE AHORRO: cada semana caen dos monedas (dos hogazas) al frasco y el nivel sube; la etiqueta de papel del frasco dice el año
const H24Ahorro: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const k = cl((tt - 0.6) / 5.0);
  return <Estudio t={tt} cam={[0.3, 1.2, 2.8]} look={[0, 0.5, 0]} orbit={0.1}>
    <Frasco p={[0, 0, 0]} s={1.2} nivel={0.05 + 0.8 * k} c="#b8963a" tapa={false}>
      <mesh position={[0, 0.4, 0.345]}><planeGeometry args={[0.42, 0.22]} /><meshStandardMaterial map={cartel("ano", "$400 / YEAR", { size: 100, ink: "#3a6a2a" })} roughness={0.9} /></mesh>
    </Frasco>
    {[0, 1, 2].map((i) => { const x = ((tt - 0.6 - i * 0.2) % 0.6 + 0.6) % 0.6, on = tt > 0.6 + i * 0.2 && tt < 5.6;
      return <group key={i} visible={on}><Moneda p={[0.05 * Math.sin(i * 2), 1.5 - 4.9 * x * x, 0.02 * i]} rot={[P2 * 0.8 + x * 6, 0, 0]} s={0.08} /></group>; })}
    <Hogaza p={[-0.85, 0.2, 0.2]} s={0.6} bake={1} />
    <Hogaza p={[0.85, 0.2, 0.15]} s={0.55} bake={0.95} />
  </Estudio>;
}}</Stage>;

// ── 25 · DÍA TRES: el almanaque arranca SAT, SUN, MON y se queda en TUE; abajo la rebanada de molde no cambia y la del pueblo se seca y se pone firme
const DIAS = ["SAT", "SUN", "MON", "TUE"];
const H25Dia3: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const d = Math.min(3, Math.floor(cl((tt - 0.8) / 3.2) * 3.99)), dry = cl((tt - 0.8) / 3.2);
  return <Estudio t={tt} cam={[0, 1.2, 3.1]} look={[0, 0.85, 0]} orbit={0.1}>
    <group position={[0, 1.3, -0.4]}>
      <RBox s={[0.9, 0.75, 0.03]} r={0.01}><meshStandardMaterial color="#f1ead8" roughness={0.9} /></RBox>
      <mesh position={[0, 0.28, 0.02]}><planeGeometry args={[0.88, 0.16]} /><meshStandardMaterial color="#8a2f24" /></mesh>
      <mesh position={[0, -0.08, 0.02]}><planeGeometry args={[0.8, 0.5]} /><meshStandardMaterial map={cartel("dd" + d, DIAS[d], { w: 512, h: 300, size: 200, bg: "#f6f1e4" })} roughness={0.9} /></mesh>
    </group>
    <group position={[-0.6, 0.5, 0]} rotation={[0, 0.2, 0]}><Rebanada s={0.8} kind="molde" /></group>
    <group position={[0.6, 0.5, 0]} rotation={[0, -0.2, 0]}><Rebanada s={0.8} kind="pueblo" dry={dry} /></group>
    <pointLight position={[0.6, 1.0, 1.0]} intensity={0.6 + 0.8 * dry} distance={2} color="#ffd9a0" />
  </Estudio>;
}}</Stage>;

// ── 26 · CARRERA: dos frascos de masa; el de mucha levadura sube de golpe, hace espuma y se desploma; el de una pizca sube despacito y queda alto
const H26Carrera: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const fast = eio(tt, 0.6, 2.2) * (1 - 0.55 * eio(tt, 3.2, 4.4)), slow = eio(tt, 0.6, 6.2);
  const J: [number, number, string][] = [[-0.55, fast, "#e8cf98"], [0.55, slow, "#efdcb4"]];
  return <Estudio t={tt} cam={[0, 1.2, 3.0]} look={[0, 0.6, 0]} orbit={0.1}>
    {J.map(([x, k, c], i) => <group key={i} position={[x, 0, 0]}>
      <Frasco s={1.1} nivel={0} tapa={false}><mesh position={[0, 0.06 + 0.42 * k, 0]}><cylinderGeometry args={[0.32, 0.32, 0.1 + 0.84 * k, 32]} /><meshPhysicalMaterial color={c} roughness={0.6} sheen={0.6} /></mesh></Frasco>
      {i === 0 && Array.from({ length: 10 }, (_, j) => { const q = ((tt * 0.9 + rn(j, 1)) % 1); return <mesh key={j} position={[(rn(j, 2) - 0.5) * 0.4, 0.2 + 1.0 * k + q * 0.4, (rn(j, 3) - 0.5) * 0.3]} scale={0.001 + 0.05 * Math.sin(q * P) * cl((tt - 1.6) * 2) * (1 - cl(tt - 4.4))}><sphereGeometry args={[1, 12, 8]} /><meshPhysicalMaterial color="#fff6dc" roughness={0.1} transparent opacity={0.6} /></mesh>; })}
    </group>)}
    <group position={[-0.55, 0.03, 0.55]}><mesh scale={[0.12, 0.04, 0.16]}><sphereGeometry args={[1, 20, 10, 0, 2 * P, P2, P2]} />{M.cromo()}</mesh><mesh position={[0, 0.03, 0]} scale={[0.1, 0.04, 0.12]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#c9a46a" roughness={0.9} /></mesh></group>
    <group position={[0.55, 0.03, 0.55]}><mesh scale={[0.12, 0.04, 0.16]}><sphereGeometry args={[1, 20, 10, 0, 2 * P, P2, P2]} />{M.cromo()}</mesh><mesh position={[0, 0.02, 0]} scale={0.015}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#c9a46a" /></mesh></group>
  </Estudio>;
}}</Stage>;

// ── 27 · MOLINO: la piedra del molino gira, el trigo cae por la tolva y el costal de 50 kilos se llena
const sacoGeo = lathe([[0.001, 0], [0.3, 0], [0.36, 0.06], [0.38, 0.3], [0.35, 0.5], [0.22, 0.63], [0.08, 0.69], [0.11, 0.78], [0.001, 0.8]], 40);
const H27Molino: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const fill = eio(tt, 1.0, 5.4);
  return <Estudio t={tt} cam={[0.3, 1.15, 2.4]} look={[-0.1, 0.6, 0]} orbit={0.1}>
    <group position={[-0.6, 0.12, 0]}>
      <mesh rotation={[0, tt * 0.8, 0]} castShadow><cylinderGeometry args={[0.6, 0.6, 0.22, 48]} /><meshStandardMaterial color="#9a948a" roughness={0.95} /></mesh>
      <mesh position={[0, 0.22, 0]} rotation={[0, -tt * 1.2, 0]} castShadow><cylinderGeometry args={[0.6, 0.6, 0.2, 48]} /><meshStandardMaterial color="#8a847a" roughness={0.95} /></mesh>
      <mesh position={[0, 0.75, 0]} rotation={[P, 0, 0]}><coneGeometry args={[0.35, 0.5, 4, 1, true]} /><meshStandardMaterial color="#7a5232" roughness={0.8} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 18 }, (_, j) => { const q = ((tt * 1.2 + rn(j, 1)) % 1); return <mesh key={j} position={[(rn(j, 2) - 0.5) * 0.1, 0.95 - q * 0.5, (rn(j, 3) - 0.5) * 0.1]} scale={[0.02, 0.012, 0.012]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#d8b060" roughness={0.8} /></mesh>; })}
    </group>
    <Chorro a={[0.0, 0.3, 0]} b={[0.75, 0.45 + 0.4 * fill, 0]} r={0.03} c="#f6f1e4" o={0.85 * cl(tt - 0.8) * (1 - cl(tt - 5.6))} t={tt} splash={false} />
    <group position={[0.75, 0, 0]}>
      <group scale={[1 + 0.08 * fill, 0.55 + 0.45 * fill, 1 + 0.08 * fill]}>
        <mesh geometry={sacoGeo} castShadow receiveShadow><Yute /></mesh>
        <mesh position={[0, 0.7, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.085, 0.012, 6, 24]} /><meshStandardMaterial color="#6a4a2a" roughness={1} /></mesh>
      </group>
      <mesh position={[0, 0.2 + 0.18 * fill, 0.375]}><planeGeometry args={[0.36, 0.16]} /><meshStandardMaterial map={cartel("50kg", "50 KG", { size: 120, ink: "#8a2f24" })} roughness={0.95} transparent opacity={cl(fill * 2)} /></mesh>
    </group>
  </Estudio>;
}}</Stage>;

// ── 28 · TERCIOS: el frasco se llena con un tercio de harina integral y dos tercios de blanca; las capas se ven de costado
const H28Tercios: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const a = eio(tt, 0.6, 2.2), b = eio(tt, 2.6, 5.0);
  return <Estudio t={tt} cam={[0, 1.0, 2.6]} look={[0, 0.55, 0]} orbit={0.1}>
    <group scale={1.3}>
      <mesh position={[0, 0.02 + 0.115 * a, 0]}><cylinderGeometry args={[0.32, 0.32, 0.23 * a + 0.001, 32]} /><meshStandardMaterial color="#9a6a3a" roughness={1} /></mesh>
      <mesh position={[0, 0.25 + 0.23 * b, 0]}><cylinderGeometry args={[0.32, 0.32, 0.46 * b + 0.001, 32]} /><meshStandardMaterial color="#f6f1e4" roughness={1} /></mesh>
      <Frasco nivel={0} tapa={false} />
    </group>
    {a > 0.02 && a < 0.99 && <Chorro a={[0.5, 1.5, 0]} b={[0, 0.1 + 0.3 * a, 0]} r={0.03} c="#9a6a3a" o={0.9} t={tt} splash={false} />}
    {b > 0.02 && b < 0.99 && <Chorro a={[-0.5, 1.5, 0]} b={[0, 0.4 + 0.6 * b, 0]} r={0.035} c="#f6f1e4" o={0.9} t={tt} splash={false} />}
    <Placa p={[0.65, 0.2, 0.1]} rot={[0, -0.3, 0]} w={0.3} h={0.14} tex={cartel("t13", "1/3", { size: 120, ink: "#6a3a1a" })} k={ent(tt, 1.6)} />
    <Placa p={[0.65, 0.75, 0.1]} rot={[0, -0.3, 0]} w={0.3} h={0.14} tex={cartel("t23", "2/3", { size: 120 })} k={ent(tt, 4.2)} />
  </Estudio>;
}}</Stage>;

// ── 29 · BANDEJA: horno cortado con dos bandejas; la taza vuelca agua hirviendo en la de abajo, revienta el vapor y envuelve el pan; la puerta se cierra
const tazaGeo = new THREE.LatheGeometry([[0, 0], [0.1, 0], [0.12, 0.16], [0.11, 0.16], [0.09, 0.02], [0, 0.02]].map(([r, y]) => new THREE.Vector2(r, y)), 28);
const H29Bandeja: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#2a120a">{(tt) => {
  const pour = cl((tt - 1.2) / 0.3) * (1 - cl((tt - 2.4) / 0.3)), st = cl((tt - 1.6) / 1.0), door = eio(tt, 4.4, 5.2);
  return <Estudio t={tt} cam={[0.35, 1.05, 2.5]} look={[0, 0.6, 0]} orbit={0.1}>
    <RBox p={[0, 0.7, -0.1]} s={[1.8, 1.3, 1.2]} r={0.04}><meshStandardMaterial color="#5a4a3e" roughness={0.6} metalness={0.3} side={THREE.BackSide} /></RBox>
    <mesh position={[0, 0.2, 0]}><boxGeometry args={[1.4, 0.05, 0.8]} />{M.cromo("#5a5a58")}</mesh>
    <mesh position={[0, 0.75, 0]}><boxGeometry args={[1.4, 0.03, 0.8]} />{M.cromo("#7a7a78")}</mesh>
    <Hogaza p={[0, 0.82, 0]} s={0.7} bake={0.15 + 0.4 * cl(tt - 3)} open={st * 0.6} />
    <Vapor t={tt} p={[0, 0.25, 0]} o={0.55 * st} h={1.1} s={0.6} spread={1.0} n={16} />
    <group position={[0.75, 0.55, 0.6]} rotation={[0, 0, 1.6 * pour]}><mesh geometry={tazaGeo}>{M.cromo("#e6e2da")}</mesh></group>
    {pour > 0.05 && <Chorro a={[0.62, 0.6, 0.55]} b={[0.4, 0.24, 0.2]} r={0.025} c="#dff0f8" o={0.7 * pour} t={tt} />}
    <group position={[0, 0.05, 0.55]} rotation={[P2 * (1 - door), 0, 0]}><mesh position={[0, 0.65, 0]}><boxGeometry args={[1.8, 1.3, 0.03]} />{M.vidrio()}</mesh>{[[0, 1.28, 1.8, 0.06], [0, 0.02, 1.8, 0.06], [-0.88, 0.65, 0.06, 1.3], [0.88, 0.65, 0.06, 1.3]].map(([x, y, w, hh], i) => <mesh key={i} position={[x, y, 0.01]}><boxGeometry args={[w, hh, 0.05]} />{M.hierro()}</mesh>)}</group>
    <pointLight position={[0, 0.6, 0.4]} intensity={2} distance={2.5} color="#ff9a50" />
  </Estudio>;
}}</Stage>;

// ── 30 · LINO: la hogaza sobre la tabla; el paño de lino se levanta de las puntas y la envuelve
const H30Lino: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const k = eio(tt, 1.0, 4.0);
  return <Estudio t={tt} cam={[0.3, 1.3, 2.4]} look={[0, 0.25, 0]} orbit={0.1}>
    <RBox p={[0, 0.03, 0]} s={[1.6, 0.06, 1.1]} r={0.03}>{M.madera("#9a6a3a")}</RBox>
    <Hogaza p={[0, 0.2, 0]} s={0.8} bake={0.95} />
    <LinoK p={[0, 0.07, 0]} k={k} r={0.5} />
  </Estudio>;
}}</Stage>;

// ── 31 · TOSTADA: la rebanada de tres días salta de la tostadora, el medio tomate la frota y cae el hilo de aceite
const H31Tostada: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const pop = sp(tt, 1.0), land = eio(tt, 2.0, 2.8), rub = cl((tt - 3.0) / 1.6), oil = cl((tt - 4.6) / 0.3) * (1 - cl((tt - 5.8) / 0.3));
  const sx = lerp(-0.6, 0.35, land), sy = lerp(0.55 + 0.45 * cl(pop) + 0.15 * (pop - cl(pop)), 0.07, land);
  return <Estudio t={tt} cam={[-0.1, 0.95, 1.9]} look={[-0.1, 0.3, 0]} orbit={0.1}>
    <RBox p={[-0.6, 0.25, 0]} s={[0.6, 0.5, 0.4]} r={0.08}>{M.cromo("#c8ccd0")}</RBox>
    <mesh position={[-0.6, 0.505, 0]}><boxGeometry args={[0.4, 0.01, 0.06]} /><meshBasicMaterial color="#ff7a30" toneMapped={false} /></mesh>
    <group position={[sx, sy, 0]} rotation={[-P2 * land, 0, 0]}><Rebanada s={0.45} kind="pueblo" dry={0.6} /></group>
    <mesh position={[0.35, 0.115, 0.0]} rotation={[-P2, 0, 0]} visible={land > 0.9}><planeGeometry args={[0.38 * rub + 0.001, 0.4]} /><meshStandardMaterial color="#c8301c" transparent opacity={0.55} roughness={0.2} /></mesh>
    <group position={[0.35 + 0.15 * Math.sin(rub * P * 4), 0.17 + 0.3 * (1 - ent(tt, 2.8)), 0]}><mesh scale={[0.13, 0.08, 0.13]}><sphereGeometry args={[1, 24, 12, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color="#d8301c" roughness={0.2} clearcoat={1} /></mesh></group>
    {oil > 0.02 && <Chorro a={[0.6, 1.0, 0]} b={[0.35, 0.14, 0]} r={0.008} c="#c8a020" o={0.9 * oil} t={tt} />}
  </Estudio>;
}}</Stage>;

// ── 32 · RECETA (repaso): la ficha de cartulina se escribe sola, renglón por renglón, a medida que Benito lo dice
const H32Receta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const E = IT(h), N = E.length, X = (i: number) => (i - (N - 1) / 2) * 0.55;
  const k = E.map((e) => eio(t, e.a, e.a + 0.7)), cur = k.reduce((a, b) => a + b, 0) - 1, end = eio(t, E[N - 1].a + 2.5, E[N - 1].a + 4.5);
  const cx = lerp(X(Math.max(0, cur)), 0, end);
  const obj = (i: number) => [
    <>{["#e8dcc0", "#9ad0e8", "#f4f4f0", "#c9a46a"].map((c, j) => <Frasco key={j} p={[(j - 1.5) * 0.11, 0, (j % 2) * 0.06]} s={0.32} nivel={0.7} c={c} />)}</>,
    <Bol s={0.5}><Masa p={[0, 0.05, 0]} r={0.16} rise={0.3} rough={0.6} t={tt} /></Bol>,
    <><Masa p={[0, 0.02, 0]} r={0.17} rise={0.4 + 0.5 * cl((t - E[2].a) / 3)} t={tt} /><Reloj p={[0.17, 0.16, -0.12]} s={0.22} h={12 * cl((t - E[2].a) / 3)} /></>,
    <Masa p={[0, 0.02, 0]} r={0.17} rise={0.55} rough={0.3} t={tt} />,
    <><mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.17, 0.15, 0.2, 32]} />{M.hierro()}</mesh><pointLight position={[0, 0.3, 0.2]} intensity={0.8} distance={0.8} color="#ff8a40" /></>,
    <Hogaza p={[0, 0, 0]} s={0.42} bake={1} />,
  ][i];
  return <Estudio t={tt} cam={[cx + 0.1, lerp(0.95, 1.35, end), lerp(1.8, 2.6, end)]} look={[cx, 0.1, 0]} orbit={0.04} fov={34}>
    <RBox p={[0, 0.02, 0]} s={[N * 0.55 + 0.3, 0.04, 0.6]} r={0.02}>{M.madera("#9a6a3a")}</RBox>
    {E.map((e, i) => <group key={i} position={[X(i), 0.04 + 0.4 * (1 - k[i]), 0]} scale={0.001 + k[i]}>
      {obj(Math.min(i, 5))}
      <Placa p={[0, 0.005, 0.24]} rot={[-1.0, 0, 0]} w={0.46} h={0.09} tex={cartel("rc" + i, e.tx.toUpperCase(), { size: 70, w: 720 })} />
    </group>)}
  </Estudio>;
}}</Stage>;

// ── 33 · EL FRASQUITO (adelanto): la vasija de barro del maestro bajo un paño; el paño se corre y adentro la masa madre respira
const vasijaGeo = new THREE.LatheGeometry([[0, 0], [0.22, 0], [0.32, 0.2], [0.34, 0.45], [0.28, 0.66], [0.3, 0.7], [0.28, 0.72]].map(([r, y]) => new THREE.Vector2(r, y)), 40);
const H33Frasquito: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#1c1410">{(tt) => {
  const cloth = eio(tt, 1.6, 2.6), br = 0.5 + 0.5 * Math.sin(tt * 1.4);
  return <Estudio t={tt} cam={[0.2, 1.1, 2.2]} look={[0, 0.45, 0]} orbit={0.08}>
    <mesh geometry={vasijaGeo} castShadow>{M.barro("#a8602c")}</mesh>
    <Masa p={[0, 0.62, 0]} r={0.27} rise={0.6 + 0.08 * br} t={tt} c="#e8d8b0" />
    <mesh position={[0.6 * cloth, 0.86 - 0.5 * cloth, 0.1 * cloth]} rotation={[-P2 + 0.3 * cloth, 0, 0.8 * cloth]}><planeGeometry args={[0.8, 0.8, 8, 8]} /><meshStandardMaterial color="#e9e1cf" roughness={0.95} side={THREE.DoubleSide} /></mesh>
    <pointLight position={[0, 1.2, 0.6]} intensity={0.6 + 1.6 * cloth} distance={2} color="#ffd9a0" />
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = { campana: H1Campana, rollo: H2Rollo, balanza: H3Balanza, camion: H4Camion, almohada: H5Almohada, blanda: H6Blanda,
  canta: H7Canta, pesas: H8Pesas, termo: H9Termo, separa: H10Separa, campanario: H11Campanario, red: H12Red, pliegue: H13Pliegue, precalor: H14Precalor,
  nube: H15Nube, castana: H16Castana, tambor: H17Tambor, errores: H18Errores, pizarra: H19Pizarra, rutina: H20Rutina, vidas: H21Vidas, pulgar: H22Pulgar,
  cubo: H23Cubo, ahorro: H24Ahorro, dia3: H25Dia3,
  carrera: H26Carrera, molino: H27Molino, tercios: H28Tercios, bandeja: H29Bandeja, lino: H30Lino, tostada: H31Tostada, receta: H32Receta, frasquito: H33Frasquito };
