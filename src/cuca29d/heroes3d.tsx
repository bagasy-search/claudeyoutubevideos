// cuca29d · TAMALES en bodegón 3D (estudio3d + kit3d), con lo aprendido en las 5 vueltas de cuca29a:
// UN objeto héroe grande y entero en cuadro, UNA acción física clara, cámara baja que curva, nada de rótulos flotando
// (las palabras sólo en papel/etiqueta DENTRO de la escena), entra con peso y nada se corta contra el borde.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, img, lerp, phys, Stage } from "./ckit";
import { ctex, Estudio, fall, Frijol, lathe, M, papel, RBox, rn, V3, Vapor, Yute } from "./estudio3d";
import { Chorro, Cuchara, Foto3D, Llama, Olla, Onda, Plato } from "./kit3d";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;
const ent = (tt: number, a: number) => cl(phys(tt, a, 6, 0.5));
const arco = (a: V3, b: V3, k: number, hh = 0.8): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + hh * Math.sin(k * P), lerp(a[2], b[2], k)];

// ---------- utilería del tamal ----------
// hoja de maíz: plano curvado (canoa) con vetas; lado liso (claro y brillante) arriba, lado rugoso (opaco, con vetas) abajo
export const hojaTex = (rug: boolean) => ctex("hoja" + rug, 256, 512, (g) => { g.fillStyle = rug ? "#c8b07a" : "#e8d6a4"; g.fillRect(0, 0, 256, 512);
  for (let i = 0; i < (rug ? 40 : 18); i++) { g.strokeStyle = `rgba(${rug ? "120,90,40" : "170,140,80"},${rug ? 0.55 : 0.25})`; g.lineWidth = rug ? 2 + rn(i, 2) * 2 : 1; const x = 10 + i * (rug ? 6 : 13); g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + 8 * Math.sin(i), 256, 128 + (x - 128) * 0.25, 512); g.stroke(); } });
export const hojaGeo = (() => { const g = new THREE.PlaneGeometry(0.9, 1.5, 12, 16), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), w = 1 - Math.pow((y + 0.75) / 1.5, 2) * 0.55; p.setX(i, x * w); p.setZ(i, 0.18 * Math.pow(x / 0.45, 2)); } g.computeVertexNormals(); return g; })();
export const Hoja: React.FC<{ p?: V3; rot?: V3; s?: number; liso?: boolean; c?: string; children?: React.ReactNode }> = ({ p, rot, s = 1, liso = true, c, children }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={hojaGeo} rotation={[-P2, 0, 0]} castShadow receiveShadow><meshPhysicalMaterial map={hojaTex(!liso)} color={c ?? "#ffffff"} roughness={liso ? 0.35 : 0.85} clearcoat={liso ? 0.5 : 0} side={THREE.DoubleSide} /></mesh>
    {children}
  </group>);
export const Masa: React.FC<{ p?: V3; s?: V3; c?: string }> = ({ p, s = [0.3, 0.02, 0.45], c = "#efe0b0" }) => <mesh position={p} scale={s} castShadow><sphereGeometry args={[1, 28, 14]} /><meshStandardMaterial color={c} roughness={0.75} /></mesh>;
// tamal envuelto: cápsula de masa dentro de la hoja doblada, con su colita
export const Tamal: React.FC<{ p?: V3; rot?: V3; s?: number; dorado?: number; abierto?: number }> = ({ p, rot, s = 1, dorado = 0, abierto = 0 }) => {
  const hc = new THREE.Color("#d8c08a").lerp(new THREE.Color("#b07a34"), dorado);
  return <group position={p} rotation={rot} scale={s}>
    <mesh rotation={[0, 0, P2]} scale={[1, 1, 0.75]} castShadow><capsuleGeometry args={[0.16, 0.5, 8, 18]} /><meshPhysicalMaterial map={hojaTex(true)} color={hc} roughness={0.7} clearcoat={0.2 + 0.4 * dorado} /></mesh>
    <mesh position={[-0.5, 0.0, 0]} rotation={[0, 0, P2 + 0.2]} scale={[1, 1, 0.3]} castShadow><coneGeometry args={[0.12, 0.3, 12]} /><meshStandardMaterial map={hojaTex(true)} color={hc} roughness={0.8} /></mesh>
    {abierto > 0 && <mesh position={[0.05, 0.12 * abierto, 0.02]} rotation={[0, 0, P2]} scale={[1, 1, 0.75]}><capsuleGeometry args={[0.13, 0.42, 8, 16]} /><meshStandardMaterial color="#f2e2b0" roughness={0.7} /></mesh>}
  </group>; };
const vapGeo = lathe([[0, 0], [0.8, 0], [0.84, 0.05], [0.86, 1.4], [0.9, 1.44]], 56);
export const Vaporera: React.FC<{ p?: V3; s?: number; corte?: number; agua?: number; t?: number; children?: React.ReactNode }> = ({ p, s = 1, corte = 0, agua = 0.25, t = 0, children }) => (
  <group position={p} scale={s}>
    <mesh geometry={vapGeo} castShadow receiveShadow><meshStandardMaterial color="#b8bcc4" metalness={0.85} roughness={0.32} side={THREE.DoubleSide} transparent={corte > 0} opacity={1 - 0.75 * corte} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[k * 0.9, 1.25, 0]} rotation={[0, k > 0 ? 0 : P, P2]} castShadow><torusGeometry args={[0.1, 0.025, 8, 16, P]} />{M.cromo()}</mesh>)}
    {agua > 0.01 && <mesh position={[0, 0.02 + agua / 2, 0]}><cylinderGeometry args={[0.8, 0.8, agua, 48]} />{M.liquido("#b8d4e0", 0.7)}</mesh>}
    {/* rejilla */}
    <mesh position={[0, 0.42, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.8, 48]} /><meshStandardMaterial color="#9aa0a8" metalness={0.9} roughness={0.3} wireframe /></mesh>
    <mesh position={[0, 0.42, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.79, 0.02, 8, 48]} />{M.cromo()}</mesh>
    {agua > 0.01 && Array.from({ length: 12 }, (_, i) => { const k = (t * 1.4 + rn(i, 1)) % 1, a = rn(i, 2) * 6.28, r = rn(i, 3) * 0.7; return <mesh key={i} position={[Math.cos(a) * r, 0.03 + agua, Math.sin(a) * r]} scale={0.001 + 0.025 * Math.sin(k * P)}><sphereGeometry args={[1, 8, 6]} /><meshPhysicalMaterial color="#eef8fc" roughness={0} transparent opacity={0.6} /></mesh>; })}
    {children}
  </group>);
export const Batidor: React.FC<{ p: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  {[0, 1, 2, 3].map((i) => <mesh key={i} rotation={[0, (i * P) / 4, 0]} position={[0, -0.18, 0]} scale={[1, 1.6, 1]}><torusGeometry args={[0.1, 0.006, 6, 24]} />{M.cromo()}</mesh>)}
  <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.025, 0.03, 0.4, 12]} />{M.madera("#a8784a")}</mesh></group>;
export const Tazon: React.FC<{ p?: V3; s?: number; c?: string; children?: React.ReactNode }> = ({ p, s = 1, c = "#e8dcc4", children }) => (
  <group position={p} scale={s}><mesh geometry={lathe([[0, 0], [0.3, 0], [0.5, 0.2], [0.58, 0.4]], 44)} castShadow receiveShadow><meshPhysicalMaterial color={c} roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>{children}</group>);
export const Vaso: React.FC<{ p?: V3; s?: number; agua?: number; children?: React.ReactNode }> = ({ p, s = 1, agua = 0.7, children }) => (
  <group position={p} scale={s}><mesh geometry={lathe([[0, 0], [0.22, 0], [0.26, 0.7]], 32)} castShadow>{M.vidrio()}</mesh>
    <mesh position={[0, agua * 0.35, 0]}><cylinderGeometry args={[0.215 + 0.04 * agua, 0.21, agua * 0.7, 32]} />{M.liquido("#cfe6ee", 0.35)}</mesh>{children}</group>);
const Etiqueta: React.FC<{ id: string; tx: string[]; p: V3; rot?: V3; w?: number; hh?: number; size?: number; bg?: string; ink?: string }> = ({ id, tx, p, rot = [-P2 + 0.35, 0, 0], w = 1.2, hh = 0.32, size = 110, bg, ink }) =>
  <mesh position={p} rotation={rot}><planeGeometry args={[w, hh]} /><meshStandardMaterial map={papel(id, tx, { w: 1024, h: Math.round(1024 * hh / w), size, bg, ink })} roughness={0.9} side={THREE.DoubleSide} /></mesh>;
void Frijol; void Cuchara;

// ── 1 · SACOS: dos costales de yute: el de masa martajada (granito, con pedacitos) y el de harina (polvo fino que se levanta)
const HSacos: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const s1 = fall(tt, 0.4, 1.4), s2 = fall(tt, 1.4, 1.4), puff = cl((tt - 1.9) * 2) * (1 - cl((tt - 3.4) * 1.2));
  const saco = (x: number, y: number, fino: boolean) => <group position={[x, y, 0]}>
    <mesh geometry={lathe([[0, 0], [0.5, 0], [0.62, 0.3], [0.6, 0.8], [0.5, 1.0], [0.52, 1.06]], 32)} castShadow receiveShadow><Yute /></mesh>
    <mesh position={[0, 0.96, 0]}><cylinderGeometry args={[0.5, 0.5, 0.04, 32]} /><meshStandardMaterial color={fino ? "#f4ecd8" : "#e6d4a0"} roughness={1} /></mesh>
    {!fino && Array.from({ length: 40 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.45; return <mesh key={i} position={[Math.cos(a) * r, 0.99, Math.sin(a) * r]} scale={0.018 + 0.012 * rn(i, 3)}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#e0c888" roughness={1} flatShading /></mesh>; })}
  </group>;
  return <Estudio t={tt} cam={[0.1 * Math.sin(tt * 0.4), 1.5, 3.4 - 0.06 * tt]} look={[0, 0.55, 0]} orbit={0.05}>
    {saco(-0.75, s1, false)}{saco(0.75, s2, true)}
    {Array.from({ length: 30 }, (_, i) => { const k = cl(puff * 1.2 - rn(i, 4) * 0.2); return <mesh key={i} position={[0.75 + (rn(i, 5) - 0.5) * 0.8 * (1 + k), 1.0 + k * 0.6 * rn(i, 6), (rn(i, 7) - 0.5) * 0.7]} scale={0.04 + 0.08 * k}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#fbf6ea" transparent opacity={0.35 * (1 - k) * puff} depthWrite={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 2 · BATIDO: la manteca sola en el tazón: el batidor gira y la manteca pasa de amarilla y compacta a blanca y esponjada (crece)
const HBatido: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const w = eio(tt, 0.8, 5.5), ang = tt * 9;
  return <Estudio t={tt} cam={[0.3, 1.9, 2.6]} look={[0, 0.35, 0]} orbit={0.12} fov={32}>
    <Tazon s={1.3} c="#9a4f2c">
      <mesh position={[0, 0.16 + 0.1 * w, 0]} scale={[0.5 + 0.12 * w, 0.14 + 0.16 * w, 0.5 + 0.12 * w]}><sphereGeometry args={[1, 40, 20, 0, 2 * P, 0, P2]} /><meshStandardMaterial color={"#" + new THREE.Color("#ecd88a").lerp(new THREE.Color("#fbf8f0"), w).getHexString()} roughness={0.55 + 0.35 * w} flatShading={w > 0.4} /></mesh>
      {Array.from({ length: 24 }, (_, i) => { const a = rn(i, 1) * 6.28 + ang * 0.05, r = Math.sqrt(rn(i, 2)) * 0.45; return <mesh key={i} position={[Math.cos(a) * r, 0.2 + 0.24 * w * (1 - r * r * 2), Math.sin(a) * r]} scale={0.04 * w}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#ffffff" roughness={0.9} /></mesh>; })}
    </Tazon>
    <Batidor p={[0.15 * Math.cos(ang), 0.55 + 0.15 * w, 0.15 * Math.sin(ang)]} rot={[0.25 * Math.cos(ang), ang, 0.25 * Math.sin(ang)]} s={1.4} />
  </Estudio>;
}}</Stage>;

// ── 3 · FLOTA: la bolita de masa cae al vaso de agua: se hunde, duda… y sube a flotar (ya está)
const HFlota: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const drop = tt < 1.2 ? 1.8 - 1.8 * Math.pow(cl(tt / 1.2), 2) : 0, sink = eio(tt, 1.2, 2.0) * (1 - eio(tt, 2.6, 4.2)), y = tt < 1.2 ? 0.5 + drop : 0.5 - 0.38 * sink + 0.025 * Math.sin(tt * 3) * cl(tt - 4.2);
  return <Estudio t={tt} cam={[0.1 * Math.sin(tt * 0.5), 0.8, 2.0 - 0.04 * tt]} look={[0, 0.5, 0]} orbit={0.05} fov={30}>
    <Vaso s={1.3} agua={0.78}>
      <mesh position={[0, y, 0]} castShadow scale={[1, 0.92, 1]}><sphereGeometry args={[0.07, 24, 16]} /><meshStandardMaterial color="#f2e4b8" roughness={0.75} /></mesh>
      {Array.from({ length: 8 }, (_, i) => { const k = cl((tt - 1.2 - i * 0.08) * 1.5); return <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.1, y + k * (0.5 - y + 0.05), (rn(i, 2) - 0.5) * 0.1]} scale={0.008 * (k > 0 && k < 1 ? 1 : 0)}><sphereGeometry args={[1, 8, 6]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.7} roughness={0} /></mesh>; })}
      <Onda p={[0, 0.55, 0]} t={tt} a={1.2} r={0.2} /><Onda p={[0, 0.55, 0]} t={tt} a={4.2} r={0.15} />
    </Vaso>
  </Estudio>;
}}</Stage>;

// ── 4 · JARRAS: la balanza de dos platos: un kilo de masa de un lado, la manteca crece del otro hasta su cuarto (la aguja se asienta)
const HJarras: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const m = ent(tt, 0.6), g = eio(tt, 1.8, 4.0), tilt = lerp(-0.32, -0.32 + 0.24 * g, m) + 0.02 * Math.sin(tt * 4) * (1 - cl(tt - 4.2));
  return <Estudio t={tt} cam={[0.1 * Math.sin(tt * 0.4), 1.4, 3.4 - 0.05 * tt]} look={[0, 0.65, 0]} orbit={0.06}>
    <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.05, 0.12, 1.0, 16]} />{M.cromo("#b8962e")}</mesh>
    <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.4, 0.45, 0.06, 32]} />{M.cromo("#b8962e")}</mesh>
    <group position={[0, 1.02, 0]} rotation={[0, 0, tilt]}>
      <RBox s={[2.2, 0.05, 0.08]} r={0.02}>{M.cromo("#b8962e")}</RBox>
      {[-1, 1].map((sg) => <group key={sg} position={[sg * 1.05, 0, 0]} rotation={[0, 0, -tilt]}>
        <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.006, 0.006, 0.5, 4]} /><meshStandardMaterial color="#888" /></mesh>
        <mesh position={[0, -0.5, 0]} castShadow><cylinderGeometry args={[0.42, 0.36, 0.05, 32]} />{M.cromo("#b8962e")}</mesh>
        {sg < 0 ? <mesh position={[0, -0.37, 0]} scale={[0.34 * (0.6 + 0.4 * m), 0.2 * (0.6 + 0.4 * m), 0.3 * (0.6 + 0.4 * m)]} castShadow><sphereGeometry args={[1, 28, 14]} /><meshStandardMaterial color="#efe0b0" roughness={0.75} /></mesh>
          : <group>{[0, 1, 2, 3].map((j) => <RBox key={j} p={[(j % 2 - 0.5) * 0.3, -0.42 + 0.11 * Math.floor(j / 2) + fall(tt, 1.8 + j * 0.55, 1.0), 0]} s={[0.26, 0.1, 0.2]} r={0.02}><meshStandardMaterial color="#fbf6e6" roughness={0.6} /></RBox>)}</group>}
      </group>)}
    </group>
  </Estudio>;
}}</Stage>;

// ── 5 · TERMÓMETRO: el caldo de la olla cae a la masa: tibio (vapor apenas). La mano no se quema: el caldo hirviendo se queda en su olla
const HTermometro: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const pour = cl((tt - 1.4) * 3) * (1 - cl((tt - 4.4) * 3)), mix = eio(tt, 1.6, 5.0), tilt = cl((tt - 1.0) * 2) * (1 - cl((tt - 4.6) * 2));
  return <Estudio t={tt} cam={[0.3, 1.9, 4.2 - 0.06 * tt]} look={[0, 0.75, 0]} orbit={0.06}>
    <Tazon p={[0.5, 0, 0]} s={1.3} c="#9a4f2c">
      <mesh position={[0, 0.2, 0]} scale={[0.55, 0.12 + 0.04 * mix, 0.55]}><sphereGeometry args={[1, 36, 16, 0, 2 * P, 0, P2]} /><meshStandardMaterial color={"#" + new THREE.Color("#e8d6a0").lerp(new THREE.Color("#d8b878"), mix * 0.6).getHexString()} roughness={0.75 - 0.3 * mix} /></mesh>
    </Tazon>
    <group position={[-0.9, 1.25, 0]} rotation={[0, 0, -1.0 * tilt]}>
      <mesh geometry={lathe([[0, 0], [0.22, 0], [0.26, 0.4], [0.22, 0.48]], 32)} castShadow><meshStandardMaterial color="#9a4f2c" roughness={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0.3, 0.3, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.1, 0.03, 8, 16, P]} /><meshStandardMaterial color="#8a4526" /></mesh>
    </group>
    {pour > 0.01 && <Chorro t={tt} a={[-0.62, 1.55, 0]} b={[0.4, 0.4, 0]} r={0.05 * pour} c="#d8a850" o={0.8} />}
    <Vapor t={tt} p={[-0.9, 1.6, 0]} o={0.4} h={1.0} s={0.25} spread={0.3} n={12} /><Vapor t={tt} p={[0.5, 0.4, 0]} o={0.12 * mix} h={0.4} s={0.12} spread={0.3} n={4} />
    {/* termómetro de vidrio clavado en la masa: la columna se queda en lo tibio */}
    <group position={[0.85, 0.4, 0.1]} rotation={[0, 0, -0.3]}>
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.06, 0.06, 1.0, 16]} /><meshPhysicalMaterial color="#f4f8fa" roughness={0.05} transparent opacity={0.55} clearcoat={1} /></mesh>
      <mesh position={[0, 0.0, 0]}><sphereGeometry args={[0.05, 16, 12]} /><meshStandardMaterial color="#d84a2a" emissive="#d84a2a" emissiveIntensity={0.3} /></mesh>
      <mesh position={[0, 0.02 + 0.22 * mix, 0]}><cylinderGeometry args={[0.028, 0.028, 0.04 + 0.44 * mix, 8]} /><meshStandardMaterial color="#d84a2a" emissive="#d84a2a" emissiveIntensity={0.3} /></mesh>
    </group>
  </Estudio>;
}}</Stage>;

// ── 6 · POLVO: la cucharita al ras: la pala de dedo empareja y cae sólo una pizca a la masa (el resto vuelve a la lata)
const HPolvo: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const sw = eio(tt, 1.0, 1.9), go = eio(tt, 2.4, 3.4), tip = cl((tt - 3.4) * 3) * (1 - cl((tt - 4.6) * 2));
  const sp: V3 = arco([-0.5, 0.62, 0], [0.5, 0.75, 0], go, 0.25);
  return <Estudio t={tt} cam={[0.1, 1.3, 2.4]} look={[0, 0.45, 0]} orbit={0.1} fov={30}>
    <group position={[-0.5, 0, 0]}><mesh castShadow><cylinderGeometry args={[0.28, 0.28, 0.55, 32]} /><meshStandardMaterial color="#c0392b" metalness={0.5} roughness={0.35} /></mesh>
      <mesh position={[0, 0.276, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.26, 32]} /><meshStandardMaterial color="#f8f6f0" roughness={1} /></mesh></group>
    <Tazon p={[0.55, 0, 0]} s={0.9} c="#9a4f2c"><mesh position={[0, 0.18, 0]} scale={[0.45, 0.1, 0.45]}><sphereGeometry args={[1, 30, 12, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#efe0b0" roughness={0.75} /></mesh></Tazon>
    <group position={sp} rotation={[0, 0, -tip * 1.2]}>
      <mesh scale={[1, 0.5, 1]}><sphereGeometry args={[0.07, 20, 10, 0, 2 * P, P2, P2]} />{M.cromo()}</mesh>
      <mesh position={[-0.3, 0.02, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.012, 0.016, 0.5, 8]} />{M.cromo()}</mesh>
      <mesh position={[0, 0.0 + 0.02 * (1 - sw), 0]} scale={[0.065, 0.02 + 0.03 * (1 - sw), 0.065]} visible={tip < 0.6}><sphereGeometry args={[1, 16, 8, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#f8f6f0" roughness={1} /></mesh>
    </group>
    <RBox p={[-0.5 + 0.18 * (sw - 0.5) * 2, 0.7, 0]} s={[0.02, 0.06, 0.2]} r={0.005}><meshStandardMaterial color="#d0d4da" metalness={0.8} roughness={0.3} /></RBox>
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[-0.5 + (rn(i, 1) - 0.5) * 0.1, 0.62 - 0.35 * cl((tt - 1.2 - rn(i, 2) * 0.6) * 2), (rn(i, 3) - 0.5) * 0.08]} scale={0.006 * (sw > 0.2 && tt < 2.4 ? 1 : 0)}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>)}
    {Array.from({ length: 10 }, (_, i) => <mesh key={"p" + i} position={[0.5 + (rn(i, 4) - 0.5) * 0.06, 0.7 - 0.45 * cl((tt - 3.5 - rn(i, 5) * 0.5) * 2), (rn(i, 6) - 0.5) * 0.06]} scale={0.007 * (tt > 3.5 ? 1 : 0)}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>)}
  </Estudio>;
}}</Stage>;

// ── 7 · SALADA: la pizca de masa en la cuchara se prueba y luego el cucharón de sal gruesa cae: la masa cruda va un poco subida de sal
const HSalada: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const s = cl((tt - 1.4) / 2.4);
  return <Estudio t={tt} cam={[0.2, 1.6, 2.6]} look={[0, 0.35, 0]} orbit={0.12} fov={32}>
    <Tazon s={1.3} c="#9a4f2c"><mesh position={[0, 0.22, 0]} scale={[0.6, 0.13, 0.6]}><sphereGeometry args={[1, 36, 14, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#e8d6a0" roughness={0.75} /></mesh></Tazon>
    <group position={[0.5, 1.25, 0]} rotation={[0, 0, 0.7 + 0.6 * cl((tt - 1.2) * 2)]}>
      <mesh geometry={lathe([[0, 0], [0.18, 0], [0.22, 0.25], [0.2, 0.3]], 28)} castShadow><meshPhysicalMaterial color="#f3efe6" roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} /></mesh></group>
    {Array.from({ length: 60 }, (_, i) => { const k = cl(s * 1.4 - rn(i, 1) * 0.4); if (k <= 0) return null; const a: V3 = [0.32, 1.15, 0], b: V3 = [(rn(i, 2) - 0.5) * 0.7, 0.36, (rn(i, 3) - 0.5) * 0.7];
      return <mesh key={i} position={arco(a, b, Math.min(1, k * 1.3), 0.12)} rotation={[rn(i, 4) * 3, rn(i, 5) * 3, 0]} scale={0.022}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.4} thickness={0.5} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 8 · REMOJO: las hojas secas y tiesas entran a la tina de agua caliente: se hunden, se suavizan y se abren
const HRemojo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const soft = eio(tt, 2.0, 5.5);
  return <Estudio t={tt} cam={[0.2, 2.1, 2.9 - 0.06 * tt]} look={[0, 0.25, 0]} orbit={0.05}>
    <mesh geometry={lathe([[0, 0], [1.0, 0], [1.15, 0.45], [1.2, 0.5]], 56)} castShadow receiveShadow><meshStandardMaterial color="#9aa6b0" metalness={0.7} roughness={0.35} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[1.1, 1.0, 0.38, 48]} />{M.liquido("#c8dce4", 0.55)}</mesh>
    {Array.from({ length: 6 }, (_, i) => { const a = 0.5 + i * 0.3, y = Math.max(0.18 + 0.02 * i, 0.4 + fall(tt, a, 1.6) - 0.22 * cl((tt - a - 0.6) * 2));
      return <Hoja key={i} p={[(rn(i, 1) - 0.5) * 0.9, y, (rn(i, 2) - 0.5) * 0.6]} rot={[0.4 * (1 - soft), rn(i, 3) * 6, 0.3 * (1 - soft) * (i % 2 ? 1 : -1)]} s={0.85 + 0.1 * soft} liso={i % 2 === 0} c={"#" + new THREE.Color("#c8b88a").lerp(new THREE.Color("#ece0b4"), soft).getHexString()} />; })}
    {Array.from({ length: 6 }, (_, i) => <Onda key={"o" + i} p={[(rn(i, 1) - 0.5) * 0.9, 0.4, (rn(i, 2) - 0.5) * 0.6]} t={tt} a={0.5 + i * 0.3 + 0.55} r={0.4} />)}
    <Vapor t={tt} p={[0, 0.45, 0]} o={0.35} h={1.1} s={0.3} spread={0.9} n={12} />
  </Estudio>;
}}</Stage>;

// ── 9 · LADOS: la hoja da la vuelta en el aire: el lado rugoso con vetas no; cae del lado liso y brillante, que es donde va la masa
const HLados: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const fl = eio(tt, 1.6, 2.8), up = Math.sin(fl * P) * 0.6;
  return <Estudio t={tt} cam={[0.2 * Math.sin(tt * 0.5), 1.7 - 0.04 * tt, 2.3 - 0.05 * tt]} look={[0, 0.2, 0]} orbit={0.05} fov={32}>
    <RBox p={[0, 0.04, 0]} s={[2.2, 0.08, 1.5]} r={0.04}>{M.madera("#a8784a")}</RBox>
    <group position={[0, 0.12 + up + fall(tt, 0.2, 1.0) * (tt < 1.4 ? 1 : 0), 0]} rotation={[0, 0.25 + 0.35 * cl(tt - 3.2) * Math.sin((tt - 3.2) * 0.8), P * (1 - fl)]}>
      <Hoja liso s={1.15} />
      <mesh geometry={hojaGeo} rotation={[-P2, 0, 0]} position={[0, -0.004, 0]} scale={1.0}><meshStandardMaterial map={hojaTex(true)} roughness={0.95} side={THREE.BackSide} /></mesh>
    </group>
    <pointLight position={[0.4, 1.4, 0.8]} intensity={0.01 + 2.2 * cl((tt - 2.9) * 2)} distance={3} color="#fff2d0" />
  </Estudio>;
}}</Stage>;

// ── 10 · UNTA: la cuchara arrastra la masa sobre la hoja en una capa delgadita y pareja (se ve la hoja por las orillas)
const HUnta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const sp = eio(tt, 1.0, 4.0);
  return <Estudio t={tt} cam={[0.1, 2.1, 1.9]} look={[0, 0.12, 0.05]} orbit={0.08} fov={32}>
    <RBox p={[0, 0.04, 0]} s={[2.2, 0.08, 1.6]} r={0.04}>{M.madera("#a8784a")}</RBox>
    <Hoja p={[0, 0.1, 0]} rot={[0, P2, 0]} s={1.2} liso>
      <mesh position={[0, 0.03 + 0.04 * (1 - sp), -0.25 + 0.25 * sp]} scale={[0.12 + 0.18 * sp, 0.05 * (1 - sp) + 0.012, 0.12 + 0.28 * sp]}><sphereGeometry args={[1, 30, 12, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#efe0b0" roughness={0.7} /></mesh>
    </Hoja>
    <group position={[lerp(0.4, -0.25, sp), 0.18, 0.05 * Math.sin(sp * 12)]} rotation={[0, P2, 0.55]}>
      <mesh scale={[1, 0.4, 1.3]}><sphereGeometry args={[0.11, 20, 10, 0, 2 * P, P2, P2]} />{M.cromo()}</mesh>
      <mesh position={[0, 0.2, 0.45]} rotation={[-1.0, 0, 0]}><cylinderGeometry args={[0.018, 0.022, 0.8, 10]} />{M.cromo()}</mesh>
    </group>
  </Estudio>;
}}</Stage>;

// ── 11 · DIANA: una cucharada de relleno rojo baja justo al centro de la masa, y se queda ahí: poco, con orilla limpia alrededor
const HDiana: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const d = eio(tt, 1.0, 2.0), set = cl((tt - 2.0) * 3), glow = cl((tt - 2.4) * 2);
  return <Estudio t={tt} cam={[0, 2.3, 1.6]} look={[0, 0.1, 0]} orbit={0.08} fov={32}>
    <RBox p={[0, 0.04, 0]} s={[2.2, 0.08, 1.6]} r={0.04}>{M.madera("#a8784a")}</RBox>
    <Hoja p={[0, 0.1, 0]} rot={[0, P2, 0]} s={1.2} liso>
      <mesh position={[0, 0.02, 0]} scale={[0.3, 0.012, 0.42]}><sphereGeometry args={[1, 30, 10, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#efe0b0" roughness={0.7} /></mesh>
      <mesh position={[0, 0.03 + 0.5 * (1 - d), 0]} scale={[0.09 + 0.02 * set, 0.035, 0.18 + 0.02 * set]}><sphereGeometry args={[1, 24, 12]} /><meshPhysicalMaterial color="#9a2a14" roughness={0.3} clearcoat={0.8} /></mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.12, 0.06 + 0.5 * (1 - d), (rn(i, 2) - 0.5) * 0.28]} scale={0.022}><boxGeometry args={[1, 0.7, 1.2]} /><meshStandardMaterial color="#e8c8a0" roughness={0.6} /></mesh>)}
    </Hoja>
    {/* anillo de luz que marca la orilla limpia */}
    <mesh position={[0, 0.125, 0]} rotation={[-P2, 0, P2]} scale={[1, 1.5, 1]}><ringGeometry args={[0.24, 0.26, 48]} /><meshBasicMaterial color="#ffe2a0" transparent opacity={0.6 * glow * (1 - cl((tt - 4.5) * 1.5))} toneMapped={false} /></mesh>
  </Estudio>;
}}</Stage>;

// ── 12 · RULETA (bloque de 5 errores): la vaporera abierta; con cada error sale UN tamal y se abre mostrando su falla (crudo, pesado, aguado…), y va al plato
export const ErrTamal: React.FC<{ i: number; k: number }> = ({ i, k }) => {
  const c = ["#e8d8a8", "#d8c890", "#efe0b0", "#efe0b0", "#e0cc98"][i];
  return <group>
    <Hoja p={[0, 0, 0]} rot={[0, P2, 0]} s={0.9} liso />
    <mesh position={[0, 0.05, 0]} rotation={[0, 0, P2]} scale={[1, 1, i === 2 ? 1.2 : 0.75]}><capsuleGeometry args={[i === 2 ? 0.16 : 0.12, 0.42, 8, 16]} /><meshStandardMaterial color={c} roughness={i === 0 ? 0.95 : 0.7} flatShading={i === 0} /></mesh>
    {i === 1 && <mesh position={[0, 0.06, 0]} rotation={[0, 0, P2]} scale={[1, 1, 0.76]}><capsuleGeometry args={[0.07, 0.3, 6, 12]} /><meshStandardMaterial color="#f4ecd0" roughness={0.3} transparent opacity={0.8} /></mesh>}
    {i === 3 && Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[0.2 + j * 0.05, 0.0, 0.14 + 0.06 * k * j]} scale={[0.05, 0.005, 0.05]}><sphereGeometry args={[1, 10, 6]} /><meshPhysicalMaterial color="#9a2a14" roughness={0.1} clearcoat={1} /></mesh>)}
    {i === 4 && <Vapor t={k * 4} p={[0, 0.1, 0]} o={0.3} h={0.6} s={0.2} spread={0.3} n={6} />}
  </group>; };
const HRuletaD: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[];
  return <Estudio t={tt} cam={[0, 1.8, 4.2]} look={[0, 0.5, 0]} orbit={0.08}>
    <Vaporera p={[-1.5, 0, -0.6]} s={0.75} agua={0.2} t={tt}>{[0, 1, 2, 3].map((j) => <Tamal key={j} p={[(j - 1.5) * 0.3, 0.7, 0]} rot={[0, 0, P2 - 0.1]} s={0.8} />)}</Vaporera>
    <Vapor t={tt} p={[-1.5, 1.1, -0.6]} o={0.3} h={1.0} s={0.3} spread={0.5} n={10} />
    {E.map((e, i) => { const a = i === 0 ? -0.5 : e.a - h.at, nx = E[i + 1] ? E[i + 1].a - h.at : 1e9, k = ent(tt, a), op = eio(tt, a + 0.5, a + 1.2), gone = eio(tt, nx, nx + 0.6);
      if (tt < a - 0.3 || gone >= 1) return null;
      return <group key={i} position={arco([-1.5, 1.2, -0.6], [0.4, 0.12, 0.2], k, 0.5)} rotation={[0, 0, 0]}>
        <group position={[0, 0, 0]} scale={1 - gone}>
          <ErrTamal i={i} k={op} />
          <Etiqueta id={"rd" + i} tx={[e.tx]} p={[0, 0.02, 0.68]} w={1.5} hh={0.28} size={100} bg="#f7f0de" />
        </group>
        <group position={[0, 0, -0.9 * gone]} />
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 13 · DOBLEZ: la hoja ya untada y rellena se cierra a lo largo y la punta se dobla HACIA ATRÁS (no hacia el frente)
const HDoblez: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const roll = eio(tt, 0.8, 2.4), back = eio(tt, 2.8, 4.0);
  return <Estudio t={tt} cam={[0.6, 1.7, 2.0]} look={[0, 0.15, 0]} orbit={0.1} fov={32}>
    <RBox p={[0, 0.04, 0]} s={[2.2, 0.08, 1.6]} r={0.04}>{M.madera("#a8784a")}</RBox>
    <group position={[0, 0.1, 0]} rotation={[0, P2, 0]}>
      {[-1, 1].map((sg) => <group key={sg} position={[sg * 0.02, 0, 0]} rotation={[0, 0, sg * -1.35 * roll]}>
        <mesh position={[sg * 0.22, 0, 0]} rotation={[-P2, 0, 0]} castShadow><planeGeometry args={[0.44, 1.0]} /><meshPhysicalMaterial map={hojaTex(false)} roughness={0.4} clearcoat={0.4} side={THREE.DoubleSide} /></mesh></group>)}
      <mesh position={[0, 0.04 + 0.06 * roll, 0]} rotation={[P2, 0, 0]} scale={[1, 1, 0.7]}><capsuleGeometry args={[0.1 + 0.02 * (1 - roll), 0.55, 8, 16]} /><meshStandardMaterial color="#efe0b0" roughness={0.7} /></mesh>
      {/* la punta (cola de la hoja) que se dobla hacia atrás */}
      <group position={[0, 0.08, -0.5]} rotation={[-P * back * 0.95, 0, 0]}>
        <mesh position={[0, 0, -0.25]} rotation={[-P2, 0, 0]} castShadow><planeGeometry args={[0.3 - 0.1 * roll, 0.5]} /><meshPhysicalMaterial map={hojaTex(false)} roughness={0.4} side={THREE.DoubleSide} /></mesh></group>
    </group>
  </Estudio>;
}}</Stage>;

// ── 14 · AMARRE: de una hoja se arranca una tira y se amarra alrededor del tamal: da la vuelta y queda el nudito
const HAmarre: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const rip = eio(tt, 0.8, 1.8), wrap = eio(tt, 2.0, 4.0), knot = ent(tt, 4.1);
  return <Estudio t={tt} cam={[0.3, 1.5, 2.2]} look={[0, 0.2, 0]} orbit={0.1} fov={32}>
    <RBox p={[0, 0.04, 0]} s={[2.4, 0.08, 1.6]} r={0.04}>{M.madera("#a8784a")}</RBox>
    <Hoja p={[-0.7, 0.1, -0.2]} rot={[0, 0.3, 0]} s={0.8} liso />
    <mesh position={[-0.7 + 0.8 * rip, 0.12 + 0.3 * Math.sin(rip * P), -0.2 + 0.2 * rip]} rotation={[-P2, 0, 0.3]} scale={[1, 1, 1]} visible={wrap < 0.05}><planeGeometry args={[0.05, 1.2]} /><meshStandardMaterial map={hojaTex(false)} side={THREE.DoubleSide} /></mesh>
    <Tamal p={[0.3, 0.22, 0.1]} rot={[0, -0.2, 0]} s={1.3} />
    <group position={[0.3, 0.22, 0.1]} rotation={[0, -0.2, 0]}>
      <mesh rotation={[0, P2, 0]} visible={wrap > 0.02}><torusGeometry args={[0.165 * 1.3, 0.018, 8, 40, 2 * P * wrap]} /><meshStandardMaterial map={hojaTex(false)} color="#e8d6a4" roughness={0.6} /></mesh>
      <group position={[0, 0.24, 0]} scale={knot}>{[-1, 1].map((sg) => <mesh key={sg} position={[0, 0.02, sg * 0.05]} rotation={[sg * 0.8, 0, 0]} scale={[0.03, 0.01, 0.07]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#e8d6a4" roughness={0.6} /></mesh>)}</group>
    </group>
  </Estudio>;
}}</Stage>;

// ── 15 · CORTE: la vaporera en corte: el agua abajo hierve y el nivel NUNCA llega a la rejilla; arriba los tamales parados en seco
const HCorte: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const cut = eio(tt, 0.6, 1.6), gap = cl((tt - 2.4) * 2) * (1 - cl((tt - 5.5) * 2));
  return <Estudio t={tt} cam={[0.15 * Math.sin(tt * 0.4), 1.3, 3.3 - 0.05 * tt]} look={[0, 0.7, 0]} orbit={0.05}>
    <Llama p={[0, 0.0, 0]} f={0.6} t={tt} r={0.5} />
    <Vaporera p={[0, 0.05, 0]} s={1.05} corte={cut} agua={0.28} t={tt}>
      {Array.from({ length: 7 }, (_, i) => <Tamal key={i} p={[(i - 3) * 0.2, 0.88, 0]} rot={[0, 0, P2 + (rn(i, 1) - 0.5) * 0.15]} s={0.8} />)}
    </Vaporera>
    {/* la franja seca entre el agua y la rejilla se ilumina */}
    <mesh position={[0, 0.05 + 0.36 * 1.05, 0.86]}><planeGeometry args={[1.5, 0.12 * 1.05]} /><meshBasicMaterial color="#ffd88a" transparent opacity={0.3 * gap} toneMapped={false} depthWrite={false} /></mesh>
    <Vapor t={tt} p={[0, 0.5, 0]} o={0.25} h={1.2} s={0.25} spread={0.6} n={10} />
  </Estudio>;
}}</Stage>;

// ── 16 · FLOR: vista de arriba de la vaporera: los tamales se paran de a uno en espiral, como pétalos, dejando aire entre ellos
const HFlor: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const N = 8;
  return <Estudio t={tt} cam={[0.3 * Math.sin(tt * 0.3), 4.0 - 0.06 * tt, 1.6]} look={[0, 0.7, 0]} orbit={0.04} fov={34}>
    <Vaporera s={1.15} agua={0.2} t={tt}>
      {Array.from({ length: N }, (_, i) => { const a = 0.5 + i * 0.45, k = ent(tt, a), r = 0.48, ang = (i / 8) * 2 * P;
        if (tt < a - 0.1) return null;
        return <group key={i} position={[Math.cos(ang) * r, 0.75 + (1 - k) * 0.8, Math.sin(ang) * r]} rotation={[0, -ang, 0]}><Tamal rot={[0, 0, P2 - 0.35]} s={0.62} /><Vapor t={tt + i} p={[0.25, 0.1, 0.22]} o={0.25 * k} h={0.8} s={0.12} spread={0.05} n={4} /></group>; })}
      <pointLight position={[0, 1.0, 0]} intensity={1.5 * cl((tt - 4) * 0.5)} distance={1.5} color="#ffe0a0" />
    </Vaporera>
  </Estudio>;
}}</Stage>;

// ── 17 · CAPAS (tapado): sobre los tamales caen hojas, luego el trapo de cocina que se asienta como cobija, y al final la tapa
export const trapoTex = () => ctex("trapo", 256, 256, (g) => { g.fillStyle = "#f2ece0"; g.fillRect(0, 0, 256, 256); g.fillStyle = "rgba(192,57,43,.75)"; for (let i = 0; i < 256; i += 64) { g.fillRect(i, 0, 18, 256); g.fillRect(0, i, 256, 18); } });
const trapoGeo = (() => { const g = new THREE.PlaneGeometry(2.0, 2.0, 24, 24); g.rotateX(-P2); return g; })();
const trapoG = trapoGeo.clone();
const HCapasD: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const tr = eio(tt, 2.4, 3.6), tapa = eio(tt, 4.2, 5.0);
  const g = trapoG;
  { const p = g.attributes.position, b = trapoGeo.attributes.position; for (let i = 0; i < p.count; i++) { const x = b.getX(i), z = b.getZ(i), r = Math.hypot(x, z), dome = Math.max(0, 0.95 - r) * 0.25; p.setY(i, lerp(0.9, dome - Math.max(0, r - 0.92) * 0.9, tr) + 0.02 * Math.sin(x * 9 + tt * 2) * (1 - tr)); } p.needsUpdate = true; g.computeVertexNormals(); }
  return <Estudio t={tt} cam={[0.3, 2.6, 3.8 - 0.06 * tt]} look={[0, 0.9, 0]} orbit={0.05}>
    <Vaporera s={1.0} agua={0.2} t={tt}>
      {Array.from({ length: 9 }, (_, i) => <Tamal key={i} p={[(i % 3 - 1) * 0.42, 0.8, (Math.floor(i / 3) - 1) * 0.42]} rot={[0, 0, P2 - 0.15]} s={0.7} />)}
      {Array.from({ length: 5 }, (_, i) => <Hoja key={"h" + i} p={[(rn(i, 1) - 0.5) * 0.4, 1.12 + 0.02 * i + fall(tt, 0.5 + i * 0.3, 1.5), (rn(i, 2) - 0.5) * 0.4]} rot={[0, rn(i, 3) * 6, 0]} s={1.0} liso={false} />)}
      <mesh geometry={g} position={[0, 1.18, 0]} castShadow receiveShadow visible={tt > 2.3}><meshStandardMaterial map={trapoTex()} roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <group position={[0, 1.5 + 1.4 * (1 - tapa), 0]} visible={tt > 4.1}>
        <mesh castShadow><cylinderGeometry args={[0.88, 0.9, 0.05, 48]} /><meshStandardMaterial color="#b8bcc4" metalness={0.85} roughness={0.3} /></mesh>
        <mesh position={[0, 0.07, 0]}><sphereGeometry args={[0.07, 16, 10]} /><meshStandardMaterial color="#1a1a1a" roughness={0.5} /></mesh></group>
    </Vaporera>
  </Estudio>;
}}</Stage>;

// ── 18 · TIMER: el reloj de cocina de cuerda junto a la vaporera tapada: la perilla da hora y media y nadie toca la tapa
const HTimer: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const wind = eio(tt, 0.6, 1.6), run = cl((tt - 1.8) / 4.5), ang = -wind * 1.5 * P + run * 1.5 * P, sh = Math.sin(tt * 30) * 0.008 * cl((tt - 1.8) * 4);
  return <Estudio t={tt} cam={[0.45, 1.6, 3.9 - 0.05 * tt]} look={[0.15, 0.6, 0]} orbit={0.05}>
    <Vaporera p={[-0.5, 0, -0.4]} s={0.85} agua={0.2} t={tt}>
      <mesh position={[0, 1.46, 0]} castShadow><cylinderGeometry args={[0.88, 0.9, 0.05, 48]} /><meshStandardMaterial color="#b8bcc4" metalness={0.85} roughness={0.3} /></mesh>
    </Vaporera>
    <Vapor t={tt} p={[-0.5, 1.3, -0.4]} o={0.25} h={0.9} s={0.25} spread={0.9} n={10} />
    <group position={[0.85 + sh, 0.32, 0.5]} rotation={[-0.25, -0.35, 0]}>
      <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.32, 0.34, 0.24, 48]} /><meshPhysicalMaterial color="#c0392b" roughness={0.3} clearcoat={0.8} /></mesh>
      <mesh position={[0, 0, 0.122]}><circleGeometry args={[0.28, 48]} /><meshStandardMaterial color="#f7f3ea" roughness={0.6} /></mesh>
      <mesh position={[0, 0, 0.124]}><ringGeometry args={[0.0, 0.27, 48, 1, P2, 1.5 * P * (1 - run) * wind + 0.001]} /><meshBasicMaterial color="#f0c060" transparent opacity={0.6} /></mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.cos((i / 12) * 2 * P) * 0.23, Math.sin((i / 12) * 2 * P) * 0.23, 0.126]}><boxGeometry args={[0.01, 0.04, 0.002]} /><meshBasicMaterial color="#2a1a10" /></mesh>)}
      <mesh position={[0, 0, 0.13]} rotation={[0, 0, ang + P2]}><boxGeometry args={[0.02, 0.24, 0.01]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      <mesh position={[0, 0, 0.14]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />{M.cromo()}</mesh>
    </group>
  </Estudio>;
}}</Stage>;

// ── 19 · DESPEGA: la prueba: se abre un tamal y la hoja se desprende sola de la masa, limpia, sin que se pegue nada
const HDespega: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const op = eio(tt, 1.2, 3.0);
  return <Estudio t={tt} cam={[0.3 + 0.15 * Math.sin(tt * 0.5), 1.6 - 0.04 * tt, 2.0 - 0.04 * tt]} look={[0, 0.2, 0]} orbit={0.05} fov={32}>
    <Plato p={[0, 0.02, 0]} s={1.6} c="#efe6d2" />
    <mesh position={[0, 0.18, 0]} rotation={[0, 0.3, P2]} scale={[1, 1, 0.78]} castShadow><capsuleGeometry args={[0.14, 0.5, 8, 18]} /><meshStandardMaterial color="#f4e6b8" roughness={0.65} /></mesh>
    {[-1, 1].map((sg) => <group key={sg} position={[0, 0.16, 0]} rotation={[0, 0.3, 0]}>
      <group rotation={[sg * (0.2 + 1.2 * op), 0, 0]}>
        <mesh position={[0, 0.02, sg * (0.16 + 0.05 * op)]} rotation={[sg * P2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.84, 24, 1, true, 0, P]} /><meshPhysicalMaterial map={hojaTex(true)} color="#d8c08a" roughness={0.7} side={THREE.DoubleSide} /></mesh></group></group>)}
    <Vapor t={tt} p={[0, 0.3, 0]} o={0.4 * op} h={0.8} s={0.22} spread={0.3} n={8} />
  </Estudio>;
}}</Stage>;

// ── 20 · REPOSO: los tamales en la canasta bajo el trapo; el vapor se calma y la masa se asienta (el reloj de arena corre)
const HReposo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const s = cl((tt - 0.8) / 5.0);
  return <Estudio t={tt} cam={[0.3, 1.7, 3.6 - 0.05 * tt]} look={[0.3, 0.4, 0]} orbit={0.05}>
    <mesh geometry={lathe([[0, 0], [0.7, 0], [0.9, 0.35], [0.95, 0.4]], 40)} castShadow receiveShadow><meshStandardMaterial map={ctex("cesta", 256, 256, (g) => { g.fillStyle = "#b8864a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 256; i += 16) { g.fillStyle = "rgba(90,50,20,.45)"; g.fillRect(0, i, 256, 6); g.fillRect(i, 0, 4, 256); } })} roughness={0.9} side={THREE.DoubleSide} /></mesh>
    {Array.from({ length: 6 }, (_, i) => <Tamal key={i} p={[(i % 3 - 1) * 0.36, 0.28 + Math.floor(i / 3) * 0.12, (Math.floor(i / 3) - 0.5) * 0.3]} rot={[0, 0.2, 0]} s={0.75} />)}
    <mesh position={[0, 0.5, 0]} rotation={[-P2, 0, 0.3]} scale={[1, 1, 1]}><planeGeometry args={[1.5, 1.2, 8, 8]} /><meshStandardMaterial map={trapoTex()} roughness={0.95} side={THREE.DoubleSide} transparent opacity={0.0001 + 0.999 * cl((tt - 0.3) * 3)} /></mesh>
    <Vapor t={tt} p={[0, 0.55, 0]} o={0.35 * (1 - s)} h={0.8} s={0.25} spread={0.6} n={10} />
    <group position={[1.3, 0, 0.3]}>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.2, 0.2, 0.04, 24]} />{M.madera("#6a4428")}</mesh>
      <mesh position={[0, 0.62, 0]}><cylinderGeometry args={[0.2, 0.2, 0.04, 24]} />{M.madera("#6a4428")}</mesh>
      <mesh position={[0, 0.32, 0]} geometry={lathe([[0.14, -0.28], [0.02, -0.02], [0.02, 0.02], [0.14, 0.28]], 24)}>{M.vidrio()}</mesh>
      <mesh position={[0, 0.32 + 0.14 * (1 - s), 0]}><coneGeometry args={[0.12 * (1 - s) + 0.001, 0.22 * (1 - s) + 0.001, 20]} /><meshStandardMaterial color="#e0c090" roughness={1} /></mesh>
      <mesh position={[0, 0.05 + 0.1 * s, 0]}><coneGeometry args={[0.13 * s + 0.001, 0.2 * s + 0.001, 20]} /><meshStandardMaterial color="#e0c090" roughness={1} /></mesh>
    </group>
  </Estudio>;
}}</Stage>;

// ── 21 · MESA (bloque rutina, 9 pasos): la cuerda de tendido de la cocina; con cada paso se cuelga con su pinza la ficha con foto y su renglón
const HMesaD: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), 0), from = Math.max(0, cur - 2);
  return <Estudio t={tt} cam={[0, 1.2, 3.4]} look={[0, 1.0, 0]} orbit={0.06}>
    <mesh position={[0, 1.55, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.008, 0.008, 4.4, 6]} /><meshStandardMaterial color="#c8a878" /></mesh>
    {S.slice(from, cur + 1).map((s, j) => { const i = from + j, a = s.a - h.at, k = ent(tt, a), x = -1.3 + (i - from) * 1.3 - (cur - from < 2 ? 0 : 0), sw = 0.08 * Math.sin(tt * 2 + i) * (1 - cl((tt - a) * 0.5)) + 0.02 * Math.sin(tt * 1.3 + i);
      return <group key={i} position={[x, 1.55 + (1 - k) * 1.2, 0.02]} rotation={[0, 0, sw]}>
        <RBox p={[0, -0.02, 0.02]} s={[0.06, 0.16, 0.05]} r={0.01}>{M.madera("#c08a52")}</RBox>
        <group position={[0, -0.6, 0]}>
          <mesh position={[0, 0, -0.005]}><planeGeometry args={[1.12, 1.0]} /><meshStandardMaterial color="#f6f1e4" roughness={0.9} /></mesh>
          <Foto3D src={img(h.imgs?.[i] ?? h.bg ?? "")} p={[0, 0.12, 0]} w={1.0} h={0.62} />
          <mesh position={[0, -0.36, 0.006]}><planeGeometry args={[1.06, 0.2]} /><meshStandardMaterial map={papel("ms" + i, [`${i + 1}. ${s.tx}`], { w: 1024, h: 190, size: 88, bg: "#f6f1e4" })} roughness={0.9} /></mesh>
        </group>
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 22 · ORILLA: cuando baja el agua, el chorrito de la jarra entra por la ORILLA de la vaporera, pegado a la pared, sin mojar los tamales
const HOrilla: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const pour = cl((tt - 1.4) * 3) * (1 - cl((tt - 4.6) * 3)), lvl = 0.1 + 0.18 * eio(tt, 1.6, 4.6), tilt = cl((tt - 1.0) * 2) * (1 - cl((tt - 4.8) * 2));
  return <Estudio t={tt} cam={[0.4, 2.3, 3.0]} look={[0, 0.8, 0]} orbit={0.12}>
    <Vaporera s={1.0} corte={0.45} agua={lvl} t={tt}>
      {Array.from({ length: 7 }, (_, i) => <Tamal key={i} p={[(i - 3) * 0.18, 0.82, 0]} rot={[0, 0, P2 - 0.1]} s={0.7} />)}
    </Vaporera>
    <group position={[1.25, 1.85, 0]} rotation={[0, 0, 0.9 * tilt]}>
      <mesh geometry={lathe([[0, 0], [0.18, 0], [0.22, 0.45], [0.2, 0.5]], 28)} castShadow><meshStandardMaterial color="#9a4f2c" roughness={0.6} side={THREE.DoubleSide} /></mesh></group>
    {pour > 0.01 && <Chorro t={tt} a={[0.96, 2.1, 0]} b={[0.8, 0.05 + lvl, 0]} r={0.03 * pour} c="#cfe6ee" o={0.6} />}
  </Estudio>;
}}</Stage>;

// ── 23 · CONGELA: los tamales ya cocidos y fríos entran a la bolsa con cierre, se les saca el aire y la bolsa se escarcha en el congelador
const HCongela: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const fr = eio(tt, 3.6, 5.6), air = eio(tt, 2.4, 3.4);
  const esc = ctex("escD" + Math.round(fr * 6), 256, 256, (g) => { g.clearRect(0, 0, 256, 256); for (let i = 0; i < 400 * fr; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + 0.5 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 256, rn(i, 3) * 256, 2, 2); } });
  return <Estudio t={tt} cam={[0, 1.6, 3.0]} look={[0, 0.45, 0]} orbit={0.1}>
    <pointLight position={[0, 1.4, 1.0]} intensity={2.4 * fr} distance={3.5} color="#b8dcff" />
    {Array.from({ length: 4 }, (_, i) => <Tamal key={i} p={[(i - 1.5) * 0.35, 0.22 + fall(tt, 0.4 + i * 0.35, 1.3), 0]} rot={[0, P2, 0]} s={0.8} />)}
    <mesh position={[0, 0.28, 0]} scale={[1, 1 - 0.35 * air, 1]}><boxGeometry args={[1.7, 0.42, 0.85]} /><meshPhysicalMaterial color="#e8f2f8" roughness={0.15} transmission={0.85} thickness={0.2} transparent opacity={0.45} /></mesh>
    <mesh position={[0, 0.28, 0]} scale={[1.001, 1 - 0.35 * air + 0.001, 1.001]}><boxGeometry args={[1.7, 0.42, 0.85]} /><meshStandardMaterial map={esc} transparent depthWrite={false} /></mesh>
    <RBox p={[0, 0.5 - 0.07 * air, 0.0]} s={[1.72, 0.035, 0.87]} r={0.01}><meshStandardMaterial color="#2a6ab0" roughness={0.4} /></RBox>
    {Array.from({ length: 10 }, (_, i) => { const k = (tt * 0.4 + rn(i, 1)) % 1; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 2.2, 0.15 + k * 0.6, (rn(i, 3) - 0.5) * 1.0]} scale={0.25}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#e8f4ff" transparent opacity={0.08 * fr * Math.sin(k * P)} depthWrite={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 24 · COMAL: el tamal congelado se recalienta en el comal, con su hoja: se voltea y la hoja queda dorada y tostadita
const HComalD: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const fl = eio(tt, 2.8, 3.5), d = eio(tt, 0.8, 5.0);
  return <Estudio t={tt} cam={[0.3, 1.2, 2.3 - 0.04 * tt]} look={[0, 0.2, 0]} orbit={0.05}>
    <mesh geometry={lathe([[0, 0], [1.0, 0.0], [1.08, 0.04], [1.1, 0.06]], 64)} position={[0, 0.02, 0]} castShadow receiveShadow><meshStandardMaterial color="#1a1816" roughness={0.55} metalness={0.5} side={THREE.DoubleSide} /></mesh>
    <Llama p={[0, -0.2, 0]} f={0.35} t={tt} r={0.55} />
    {[-1, 1].map((sg, i) => <Tamal key={i} p={[sg * 0.3, 0.2 + 0.35 * Math.sin(fl * P), sg * 0.1]} rot={[fl * P, 0.3 * sg, 0]} s={1.0} dorado={d * (0.75 + 0.25 * i)} />)}
    <Vapor t={tt} p={[0, 0.25, 0]} o={0.3 * d} h={0.8} s={0.22} spread={0.6} n={10} />
  </Estudio>;
}}</Stage>;

// ── 25 · TENDEDERO (bloque «lo que mi abuela nunca hacía»): cada "nunca" llega como OBJETO a la mesa y le cae encima una cruz de hojas de maíz
const NuncaObj: React.FC<{ i: number; tt: number }> = ({ i, tt }) => {
  if (i === 0) return <RBox s={[0.5, 0.3, 0.32]} r={0.03}><meshStandardMaterial color="#f0e6c4" roughness={0.5} /></RBox>;
  if (i === 1) return <><Olla s={0.5} nivel={0.6} caldo="#d0a040" t={tt} hervor={1} /><Vapor t={tt} p={[0, 0.5, 0]} o={0.45} h={0.9} s={0.25} spread={0.3} n={10} /></>;
  if (i === 2) return <group rotation={[0, 0, 0.2]}><mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.12, 32]} /><meshStandardMaterial color="#c0392b" roughness={0.4} /></mesh><mesh position={[0, 0, 0.065]} rotation={[0, 0, tt * 6]}><boxGeometry args={[0.02, 0.22, 0.01]} /><meshStandardMaterial color="#111" /></mesh></group>;
  if (i === 3) return <Vaporera s={0.35} agua={0.2} t={tt}><mesh position={[0.5, 1.9, 0]} rotation={[0, 0, -0.8]}><cylinderGeometry args={[0.88, 0.9, 0.05, 32]} /><meshStandardMaterial color="#b8bcc4" metalness={0.85} roughness={0.3} /></mesh></Vaporera>;
  return <Tamal s={1.1} />;
};
const HTendedero: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[];
  return <Estudio t={tt} cam={[0, 1.6, 3.8]} look={[0, 0.35, 0]} orbit={0.1}>
    {E.map((e, i) => { const a = i === 0 ? -0.5 : e.a - h.at, nx = E[i + 1] ? E[i + 1].a - h.at : 1e9, k = ent(tt, a), x = eio(tt, a + 1.0, a + 1.5), gone = eio(tt, nx, nx + 0.6);
      if (tt < a - 0.3 || gone >= 1) return null;
      return <group key={i} position={[-2.4 * gone, 0.15 + (1 - k) * 1.4, 0]}>
        <NuncaObj i={i} tt={tt} />
        {[-1, 1].map((sg) => <group key={sg} position={[0, 0.5 + 1.2 * (1 - x), 0.3]} rotation={[0, 0, sg * 0.75]} visible={x > 0.01}><mesh scale={[0.12, 1.1, 1]}><planeGeometry args={[1, 1]} /><meshStandardMaterial map={hojaTex(false)} color="#e8d0a0" side={THREE.DoubleSide} /></mesh></group>)}
        <Etiqueta id={"tn" + i} tx={[e.tx]} p={[0, -0.12, 0.75]} w={1.7} hh={0.28} size={96} bg="#f7f0de" />
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 26 · CARTAS (bloque preguntas): sobres de correo caen en la mesa; cada uno se abre y la carta sube con la pregunta y, debajo, la respuesta a mano
const HCartas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), 0);
  return <Estudio t={tt} cam={[0, 1.9, 2.8]} look={[0, 0.45, 0]} orbit={0.06}>
    {S.slice(Math.max(0, cur - 1), cur + 1).map((s, j) => { const i = Math.max(0, cur - 1) + j, [q, r] = s.tx.split("|"), a = s.a - h.at, k = ent(tt, a), op = eio(tt, a + 0.6, a + 1.3), w = cl((tt - a - 1.8) / 1.2), old = i < cur ? 1 : 0;
      return <group key={i} position={[old * -1.6, 0.06 + old * -0.02, old * -0.4]} rotation={[0, old * 0.3, 0]}>
        <group position={[0, (1 - k) * 1.5, 0]}>
          <RBox s={[1.6, 0.03, 1.0]} r={0.01}><meshStandardMaterial color="#e8dcc0" roughness={0.9} /></RBox>
          <group position={[0, 0.02, -0.5]} rotation={[-P * 0.9 * op, 0, 0]}><mesh position={[0, 0, 0.3]} rotation={[-P2, 0, 0]}><shapeGeometry args={[(() => { const sh = new THREE.Shape(); sh.moveTo(-0.8, 0.3); sh.lineTo(0.8, 0.3); sh.lineTo(0, -0.3); sh.closePath(); return sh; })()]} /><meshStandardMaterial color="#ddd0b0" side={THREE.DoubleSide} /></mesh></group>
          <group position={[0, 0.04 + 0.55 * op, -0.05 - 0.2 * op]} rotation={[-P2 + 1.2 * op, 0, 0]}>
            <mesh><planeGeometry args={[1.4, 1.1]} /><meshStandardMaterial color="#fbf8ef" roughness={0.9} side={THREE.DoubleSide} /></mesh>
            <mesh position={[0, 0.25, 0.004]}><planeGeometry args={[1.32, 0.5]} /><meshStandardMaterial map={papel("cq" + i, wrap(q), { w: 1024, h: 390, size: 84, bg: "#fbf8ef" })} roughness={0.9} /></mesh>
            <mesh position={[0, -0.27, 0.004]} scale={[Math.max(0.001, w), 1, 1]}><planeGeometry args={[1.32, 0.5]} /><meshStandardMaterial map={papel("cr" + i, wrap(r ?? ""), { w: 1024, h: 390, size: 90, bg: "#f3e6bc", ink: "#1e2a4a" })} roughness={0.9} /></mesh>
          </group>
        </group>
      </group>; })}
  </Estudio>;
}}</Stage>;
const wrap = (s: string, n = 22) => { const out: string[] = []; let cur = ""; for (const w of s.split(" ")) { if ((cur + " " + w).trim().length > n) { out.push(cur.trim()); cur = w; } else cur += " " + w; } if (cur.trim()) out.push(cur.trim()); return out; };

// ── 27 · FRIJOLES (cuántos salen): de la bola de un kilo de masa van saliendo bolitas que caen en fila sobre hojas: se cuentan con los tamales que se forman
const HFrijolesD: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const N = 20, sh = 1 - 0.85 * cl((tt - 0.6) / 4.8);
  return <Estudio t={tt} cam={[0, 2.9, 3.9 - 0.05 * tt]} look={[0.2, 0.1, 0.1]} orbit={0.05}>
    <RBox p={[0, 0.04, 0]} s={[4.0, 0.08, 2.2]} r={0.04}>{M.madera("#a8784a")}</RBox>
    <mesh position={[-1.4, 0.1 + 0.3 * sh, -0.6]} scale={[0.5 * Math.cbrt(sh), 0.36 * Math.cbrt(sh), 0.5 * Math.cbrt(sh)]} castShadow><sphereGeometry args={[1, 32, 18]} /><meshStandardMaterial color="#efe0b0" roughness={0.75} /></mesh>
    {Array.from({ length: N }, (_, i) => { const a = 0.6 + i * 0.24; if (tt < a) return null; const k = eio(tt, a, a + 0.5), x = -0.6 + (i % 5) * 0.55, z = -0.6 + Math.floor(i / 5) * 0.45;
      return <group key={i} position={arco([-1.4, 0.4, -0.6], [x, 0.12, z], k, 0.5)}>{k >= 1 && <Hoja p={[0, -0.03, 0]} rot={[0, P2, 0]} s={0.42} liso />}{k < 1 ? <mesh scale={0.09}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#efe0b0" roughness={0.75} /></mesh> : <Tamal rot={[0, 0.2, 0]} s={0.5} />}</group>; })}
  </Estudio>;
}}</Stage>;

// ── 28 · MONEDAS (la cuenta contra el puesto): dos montones: el tamal del puesto (monedas que suben altas) y el de la casa (un montoncito); el recibo de papel cae al lado
const HMonedas: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const A = 20, B = 6, rc = fall(tt, 4.6, 1.2);
  const pila = (x: number, n: number, a0: number) => Array.from({ length: n }, (_, i) => { const a = a0 + i * 0.13; if (tt < a - 0.2) return null;
    return <mesh key={i} position={[x + (rn(i, 1) - 0.5) * 0.02, 0.1 + i * 0.045 + fall(tt, a, 0.9), 0.3]} rotation={[0, rn(i, 2) * 6, (rn(i, 3) - 0.5) * 0.04 + (n > 10 ? 0.004 * i * Math.sin(tt * 5) * cl((tt - 3.4) * 2) : 0)]} castShadow><cylinderGeometry args={[0.16, 0.16, 0.04, 28]} />{M.cromo(i % 3 ? "#c8a040" : "#b8b8c0")}</mesh>; });
  return <Estudio t={tt} cam={[0.1 * Math.sin(tt * 0.4), 1.5, 3.3 - 0.06 * tt]} look={[0, 0.55, 0.2]} orbit={0.06}>
    <Tamal p={[-0.75, 0.15, -0.4]} rot={[0, 0.3, 0]} s={1.0} /><Tamal p={[0.75, 0.15, -0.4]} rot={[0, -0.3, 0]} s={1.0} />
    <RBox p={[-0.75, 0.08, 0.3]} s={[0.5, 0.02, 0.5]} r={0.01}>{M.madera("#8a5a34")}</RBox><RBox p={[0.75, 0.08, 0.3]} s={[0.5, 0.02, 0.5]} r={0.01}>{M.madera("#8a5a34")}</RBox>
    {pila(-0.75, A, 0.6)}{pila(0.75, B, 0.6)}
    {[[-0.75, 1.4], [0.75, 0.35]].map(([x, L], j) => { const u = eio(tt, 4.4, 5.6); return <mesh key={j} position={[x, 0.025, 0.55 + L * 0.5 * u / 2]} rotation={[-P2, 0, 0]} visible={u > 0.01}><planeGeometry args={[0.36, Math.max(0.01, L * 0.5 * u)]} /><meshStandardMaterial color="#fbf8ef" roughness={0.9} side={THREE.DoubleSide} /></mesh>; })}
    {void rc}
  </Estudio>;
}}</Stage>;

// ── 29 · VUELO (repaso de 24): la fila de tamales en la mesa larga, la cámara corre por encima y cada uno se ilumina con su papelito al nombrarse
const HVuelo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], N = Math.max(1, S.length), cur = S.reduce((c, e, i) => (t >= e.a ? i : c), 0);
  const px = (i: number) => (i - (N - 1) / 2) * 0.7, camx = px(cur);
  return <Estudio t={tt} cam={[camx + 0.1, 1.2, 2.3]} look={[camx, 0.2, 0]} orbit={0.0} fov={34}>
    <RBox p={[0, 0.02, 0]} s={[N * 0.7 + 2, 0.04, 1.0]} r={0.02}>{M.madera("#a8784a")}</RBox>
    {S.map((s, i) => { if (Math.abs(i - cur) > 3) return null; const on = i === cur, k = on ? cl(phys(t, s.a, 8, 0.4)) : 0;
      return <group key={i} position={[px(i), 0.14 + 0.12 * k, 0]}>
        <Tamal rot={[0, 0.3, 0]} s={0.7} dorado={i < cur ? 0.25 : 0} />
        {on && <pointLight position={[0, 0.8, 0.5]} intensity={2.5 * k} distance={1.8} color="#ffd9a8" />}
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 30 · CALDO (el secreto): el caldo donde se coció el relleno, con su capa de grasa roja, entra a la masa en vez de agua y la masa se pinta
const HCaldoD: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const pour = cl((tt - 1.6) * 3) * (1 - cl((tt - 4.6) * 3)), mix = eio(tt, 1.8, 5.6), tilt = cl((tt - 1.2) * 2) * (1 - cl((tt - 4.8) * 2));
  return <Estudio t={tt} cam={[0.3, 1.8, 3.4]} look={[0.2, 0.55, 0]} orbit={0.12}>
    <Tazon p={[0.6, 0, 0]} s={1.35} c="#9a4f2c">
      <mesh position={[0, 0.2, 0]} scale={[0.56, 0.13, 0.56]}><sphereGeometry args={[1, 36, 16, 0, 2 * P, 0, P2]} /><meshStandardMaterial color={"#" + new THREE.Color("#efe0b0").lerp(new THREE.Color("#e0a060"), mix * 0.7).getHexString()} roughness={0.7} /></mesh>
    </Tazon>
    <group position={[-0.9, 1.2, 0]} rotation={[0, 0, -0.9 * tilt]}>
      <Olla s={0.6} nivel={0.7} caldo="#c8702a" t={tt} hervor={0.15}>
        {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.9, 0.555, (rn(i, 2) - 0.5) * 0.9]} rotation={[-P2, 0, 0]} scale={0.03 + 0.04 * rn(i, 3)}><circleGeometry args={[1, 14]} /><meshPhysicalMaterial color="#e05a1a" roughness={0} clearcoat={1} transparent opacity={0.8} /></mesh>)}
      </Olla>
    </group>
    {pour > 0.01 && <Chorro t={tt} a={[-0.45, 1.5, 0]} b={[0.5, 0.42, 0]} r={0.05 * pour} c="#c8702a" o={0.85} />}
    <Vapor t={tt} p={[-0.9, 1.6, 0]} o={0.25} h={0.6} s={0.2} spread={0.3} n={6} />
  </Estudio>;
}}</Stage>;

export const MAP3: Record<string, C> = { sacos: HSacos, batido: HBatido, flota: HFlota, jarras: HJarras, termometro: HTermometro, polvo: HPolvo, salada: HSalada,
  remojo: HRemojo, lados: HLados, unta: HUnta, diana: HDiana, ruleta: HRuletaD, doblez: HDoblez, amarre: HAmarre, corte: HCorte, flor: HFlor, capas: HCapasD,
  timer: HTimer, despega: HDespega, reposo: HReposo, mesa: HMesaD, orilla: HOrilla, congela: HCongela, comal: HComalD, tendedero: HTendedero, cartas: HCartas,
  frijoles: HFrijolesD, monedas: HMonedas, vuelo: HVuelo, caldo: HCaldoD };
