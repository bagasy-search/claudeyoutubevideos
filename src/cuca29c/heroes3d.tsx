// cuca29c · MOLE DE RANCHO en bodegón 3D (estudio3d + kit3d), con lo aprendido en las 5 vueltas de cuca29a:
// UN objeto héroe grande y entero en cuadro, UNA acción física clara, cámara baja que curva, nada de rótulos flotando
// (las palabras sólo en papel/etiqueta DENTRO de la escena), entra con peso y nada se corta contra el borde.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, img, lerp, phys, Stage } from "./ckit";
import { ctex, Estudio, fall, Frijol, lathe, M, papel, RBox, rn, V3, Vapor } from "./estudio3d";
import { Chorro, Foto3D, Llama, Olla, Onda, Plato } from "./kit3d";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;
const ent = (tt: number, a: number) => cl(phys(tt, a, 6, 0.5));
const arco = (a: V3, b: V3, k: number, hh = 0.8): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + hh * Math.sin(k * P), lerp(a[2], b[2], k)];

// ---------- utilería del mole ----------
// chile seco: torno arrugado (pocas caras + flatShading = piel arrugada), acostado sobre x; tallo verde
const chileGeo = (L: number, R: number) => lathe(Array.from({ length: 11 }, (_, i) => { const u = i / 10; return [R * Math.sin(Math.min(1, u * 1.15) * P) * (1 - 0.35 * u) * (0.9 + 0.1 * Math.sin(i * 2.7)), u * L] as [number, number]; }), 14);
const CG = { ancho: chileGeo(0.9, 0.24), mulato: chileGeo(0.95, 0.22), pasilla: chileGeo(1.2, 0.12) };
const CC = { ancho: "#5a1a12", mulato: "#2a140e", pasilla: "#160b08" };
const Chile: React.FC<{ p?: V3; rot?: V3; s?: number; k?: keyof typeof CG; c?: string; dim?: number }> = ({ p, rot, s = 1, k = "ancho", c, dim = 0 }) => (
  <group position={p} rotation={rot} scale={s}>
    <group rotation={[0, 0, -P2]}>
      <mesh geometry={CG[k]} castShadow receiveShadow scale={[1, 1, 0.62]}><meshPhysicalMaterial color={new THREE.Color(c ?? CC[k]).lerp(new THREE.Color("#3a3028"), dim)} roughness={0.42 + 0.5 * dim} clearcoat={0.5 * (1 - dim)} flatShading /></mesh>
      <mesh position={[0, -0.05, 0]} castShadow><cylinderGeometry args={[0.03, 0.05, 0.14, 8]} /><meshStandardMaterial color="#6a7a3a" roughness={0.8} /></mesh>
    </group>
  </group>);
const cazuelaGeo = lathe([[0, 0], [0.62, 0], [0.86, 0.14], [0.98, 0.36], [1.04, 0.42]], 56);
const Cazuela: React.FC<{ p?: V3; s?: number; nivel?: number; mole?: string; children?: React.ReactNode }> = ({ p, s = 1, nivel = 0.3, mole = "#3a120c", children }) => (
  <group position={p} scale={s}>
    <mesh geometry={cazuelaGeo} castShadow receiveShadow><meshStandardMaterial color="#9a4f2c" roughness={0.6} side={THREE.DoubleSide} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[k * 1.04, 0.36, 0]} rotation={[0, k > 0 ? 0 : P, P2]} castShadow><torusGeometry args={[0.1, 0.035, 8, 16, P]} /><meshStandardMaterial color="#8a4526" roughness={0.65} /></mesh>)}
    {nivel > 0.01 && <mesh position={[0, 0.02 + nivel * 0.5, 0]}><cylinderGeometry args={[0.62 + 0.38 * nivel / 0.42 * 0.9, 0.62, nivel, 48]} /><meshPhysicalMaterial color={mole} roughness={0.25} clearcoat={0.9} /></mesh>}
    {children}
  </group>);
const comalGeo = lathe([[0, 0], [1.0, 0.0], [1.08, 0.04], [1.1, 0.06]], 64);
const Comal: React.FC<{ p?: V3 }> = ({ p }) => <group position={p}><mesh geometry={comalGeo} castShadow receiveShadow><meshStandardMaterial color="#1a1816" roughness={0.55} metalness={0.5} side={THREE.DoubleSide} /></mesh></group>;
const sartenGeo = lathe([[0, 0], [0.82, 0], [0.94, 0.16], [0.98, 0.2]], 64);
const Sarten: React.FC<{ p?: V3; rot?: V3; children?: React.ReactNode }> = ({ p, rot, children }) => (
  <group position={p} rotation={rot}>
    <mesh geometry={sartenGeo} castShadow receiveShadow><meshStandardMaterial color="#1c1a19" roughness={0.42} metalness={0.65} side={THREE.DoubleSide} /></mesh>
    <RBox p={[1.5, 0.17, 0]} s={[1.05, 0.07, 0.16]} r={0.03}><meshStandardMaterial color="#1c1a19" roughness={0.5} metalness={0.6} /></RBox>
    {children}
  </group>);
const Tabla: React.FC<{ p?: V3; w?: number; d?: number }> = ({ p, w = 2.6, d = 1.5 }) => <RBox p={p} s={[w, 0.08, d]} r={0.04}>{M.madera("#a8784a")}</RBox>;
const Pala: React.FC<{ p: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh scale={[0.16, 0.035, 0.24]} castShadow><sphereGeometry args={[1, 24, 12]} />{M.madera("#c08a52")}</mesh>
    <mesh position={[0, 0.0, 0.78]} rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.03, 0.035, 1.2, 12]} />{M.madera("#b07a48")}</mesh>
  </group>);
const Tazon: React.FC<{ p?: V3; s?: number; c?: string; children?: React.ReactNode }> = ({ p, s = 1, c = "#e8dcc4", children }) => (
  <group position={p} scale={s}><mesh geometry={lathe([[0, 0], [0.16, 0], [0.26, 0.1], [0.3, 0.2]], 40)} castShadow receiveShadow><meshPhysicalMaterial color={c} roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>{children}</group>);
const Semilla: React.FC<{ p: V3; c?: string; s?: number }> = ({ p, c = "#e6d2a0", s = 0.018 }) => <mesh position={p} scale={[s, s * 0.45, s * 0.7]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={c} roughness={0.5} /></mesh>;
const Humo: React.FC<{ t: number; p: V3; o: number; c?: string }> = ({ t, p, o, c }) => <Vapor t={t} p={p} o={o} h={1.0} s={0.28} spread={0.25} n={10} />;
void ctex;

// ── 1 · PODIO: los tres chiles caen de a uno sobre la tabla, cada uno con su luz: ancho (ancho y rojizo), mulato (oscuro), pasilla (largo y negro)
const HPodio: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const K: (keyof typeof CG)[] = ["ancho", "mulato", "pasilla"];
  return <Estudio t={tt} cam={[0, 1.6, 3.6]} look={[0, 0.25, 0]} orbit={0.16}>
    <Tabla p={[0, 0.04, 0]} w={3.2} d={1.6} />
    {K.map((k, i) => { const a = 0.4 + i * 1.6, x = -1.0 + i * 1.0, b = phys(tt, a, 5, 0.42);
      return <group key={k}>
        <Chile k={k} p={[x, 0.18 + fall(tt, a, 1.3), 0.1]} rot={[0.1, 0.5 - i * 0.35, 0.08 * (1 - cl(b))]} s={1.0} />
        <pointLight position={[x, 1.2, 0.8]} intensity={0.01 + 3.2 * cl((tt - a - 0.3) * 2) * (i === Math.min(2, Math.floor((tt - 0.4) / 1.6)) ? 1 : 0.35)} distance={2.4} color="#ffd9a8" />
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 2 · DOBLA: el chile bueno se arquea y vuelve (piel flexible); el viejo, al doblarse, se parte en dos y suelta migas
const HDobla: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const b1 = Math.sin(cl((tt - 0.8) / 2.4) * P) * 0.9, b2 = eio(tt, 3.8, 4.4), rot = tt > 4.4;
  return <Estudio t={tt} cam={[0.1, 1.15, 2.55]} look={[0, 0.3, 0]} orbit={0.06}>
    <Tabla p={[0, 0.04, 0]} w={3.2} d={1.5} />
    <group position={[-0.95, 0.2 + 0.12 * b1, 0.1]}>{[-1, 1].map((sg) => <group key={sg} rotation={[0, 0, -sg * b1 * 0.45]}>
      <Chile p={[sg * 0.3, 0, 0]} rot={[0, sg > 0 ? 0 : P, 0]} s={0.7} k="ancho" /></group>)}</group>
    {[-1, 1].map((sg) => <group key={"v" + sg} position={[0.95 + sg * (0.04 + 0.28 * cl((tt - 4.4) * 3)), 0.2 + (rot ? -0.02 : 0.1 * b2), 0.1]} rotation={[0, 0, sg * (rot ? 0.4 : 0.22 * b2)]}>
      <Chile p={[sg * 0.3, 0, 0]} rot={[0, sg > 0 ? 0 : P, 0]} s={0.7} k="ancho" c="#5a4a40" dim={0.7} /></group>)}
    {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[0.95 + (rn(i, 1) - 0.5) * 0.4, 0.1 + fall(tt, 4.4 + rn(i, 2) * 0.25, 0.3), 0.1 + (rn(i, 3) - 0.5) * 0.3]} scale={0.038 * cl((tt - 4.4) * 4)} castShadow><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#4a3a32" roughness={1} flatShading /></mesh>)}
  </Estudio>;
}}</Stage>;

// ── 3 · EXPLOTA: el chile se abre a lo largo, las venas salen y las semillas caen a su cazuelita (se guardan)
const HExplota: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const op = eio(tt, 1.0, 2.0), vein = eio(tt, 2.2, 3.2), sd = cl((tt - 3.2) / 2.0);
  return <Estudio t={tt} cam={[0.2, 1.7, 3.2]} look={[0.2, 0.3, 0]} orbit={0.14}>
    <Tabla p={[0, 0.04, 0]} w={3} d={1.5} />
    {[-1, 1].map((sg) => <group key={sg} position={[-0.3, 0.2, 0.05 + sg * 0.16 * op]} rotation={[sg * 0.9 * op, 0, 0]}>
      <mesh scale={[0.5, 0.12, 0.2]} castShadow><sphereGeometry args={[1, 18, 10, 0, 2 * P, sg > 0 ? 0 : P2, P2]} /><meshPhysicalMaterial color="#5a1a12" roughness={0.4} clearcoat={0.5} side={THREE.DoubleSide} flatShading /></mesh></group>)}
    <mesh position={[-0.3 + 0.9 * vein, 0.2 + 0.5 * Math.sin(vein * P), 0.05]} scale={[0.4, 0.03, 0.05]} visible={vein < 0.99}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#e8c890" roughness={0.7} /></mesh>
    <Tazon p={[0.95, 0.08, 0.3]} s={1.4} c="#9a4f2c" />
    {Array.from({ length: 36 }, (_, i) => { const k = cl(sd * 1.6 - i * 0.018); const a: V3 = [-0.3 + (rn(i, 1) - 0.5) * 0.5, 0.22, 0.05 + (rn(i, 2) - 0.5) * 0.1], b: V3 = [0.95 + (rn(i, 3) - 0.5) * 0.3, 0.18 + (i % 4) * 0.012, 0.3 + (rn(i, 4) - 0.5) * 0.3];
      return k <= 0 ? null : <Semilla key={i} p={arco(a, b, eio(k, 0, 1), 0.5)} c="#f0e2b8" s={0.024} />; })}
  </Estudio>;
}}</Stage>;

// ── 4 · TUESTE: el chile se aplasta en el comal: uno… dos… tres (cada cuenta un soplo de humo y la piel se aviva) y se voltea
const HTueste: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const beats = [1.4, 2.4, 3.4], n = beats.filter((b) => tt > b).length, flip = eio(tt, 3.9, 4.5), press = beats.reduce((m, b) => Math.max(m, Math.sin(cl((tt - b + 0.15) / 0.5) * P)), 0);
  return <Estudio t={tt} cam={[0.3, 1.4, 3.0]} look={[0, 0.2, 0]} orbit={0.12}>
    <Comal p={[0, 0.02, 0]} />
    <Llama p={[0, -0.2, 0]} f={0.4} t={tt} r={0.6} />
    <Chile k="ancho" p={[0, 0.14 - 0.04 * press + 0.4 * Math.sin(flip * P), 0]} rot={[flip * P, 0.3, 0]} s={1.15} c={["#5a1a12", "#6a2214", "#7a2a16", "#6a2012"][n]} />
    <RBox p={[0.1, 0.24 + 0.4 * (1 - press) + (tt > 3.7 ? 1.5 : 0), 0.05]} s={[0.5, 0.05, 0.36]} r={0.02}>{M.madera("#8a5a34")}</RBox>
    {beats.map((b, i) => <Vapor key={i} t={tt} p={[0, 0.2, 0]} o={0.45 * cl((tt - b) * 3) * (1 - cl((tt - b - 0.9) * 2))} h={0.8} s={0.25} spread={0.5} n={8} />)}
  </Estudio>;
}}</Stage>;

// ── 5 · TINA: el plato tapa los chiles y el tazón se inclina sobre la tarja: el agua roja se va, los chiles se quedan
const HTina: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const tilt = eio(tt, 1.2, 2.2) * (1 - eio(tt, 5.0, 5.8)), out = cl((tt - 1.9) * 3) * (1 - cl((tt - 4.8) * 3)), lvl = 1 - eio(tt, 2.0, 4.8);
  return <Estudio t={tt} cam={[0.2, 1.5, 4.2]} look={[0.3, 0.6, 0]} orbit={0.12}>
    <RBox p={[1.1, 0.25, 0]} s={[1.4, 0.5, 1.2]} r={0.06}><meshStandardMaterial color="#d8dade" roughness={0.25} metalness={0.9} /></RBox>
    <mesh position={[1.1, 0.505, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.08, 20]} /><meshBasicMaterial color="#111" /></mesh>
    <group position={[0.15, 0.55, 0]} rotation={[0, 0, -tilt * 1.2]}>
      <group position={[-0.5, -0.0, 0]}>
        <mesh geometry={lathe([[0, 0], [0.4, 0], [0.55, 0.3], [0.6, 0.42]], 40)} castShadow><meshPhysicalMaterial color="#e8dcc4" roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.04 + 0.16 * lvl, 0]}><cylinderGeometry args={[0.42 + 0.12 * lvl, 0.4, 0.32 * lvl + 0.001, 36]} />{M.liquido("#8a2a18", 0.85)}</mesh>
        {[0, 1, 2].map((i) => <Chile key={i} k="ancho" p={[-0.12 + i * 0.12, 0.12, -0.1 + i * 0.1]} rot={[0, i * 0.9, 0]} s={0.45} />)}
        <Plato p={[0.0, 0.44, 0]} rot={[0, 0, 0.0]} s={1.25} c="#f3efe6" />
      </group>
    </group>
    {out > 0.01 && <Chorro t={tt} a={[0.6, 0.85, 0]} b={[1.1, 0.5, 0]} r={0.06 * out} c="#8a2a18" o={0.85} />}
  </Estudio>;
}}</Stage>;

// ── 6 · CINTA: en la sartén entra una sola cosa por vez (almendras, pasas, plátano): se fríe sola y salta a su tazón
const HCinta: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const R = [{ a: 0.5, c: "#c8945a", sh: [0.06, 0.03, 0.04] as V3 }, { a: 2.6, c: "#3a1a26", sh: [0.04, 0.03, 0.035] as V3 }, { a: 4.7, c: "#e8c070", sh: [0.09, 0.025, 0.09] as V3 }];
  return <Estudio t={tt} cam={[0, 1.9, 3.8]} look={[0, 0.25, 0.2]} orbit={0.14}>
    <Sarten p={[-0.3, 0.02, 0]} />
    {R.map((r, j) => <Tazon key={"t" + j} p={[-1.2 + j * 1.2, 0.02, 1.25]} s={1.1} />)}
    {R.map((r, j) => Array.from({ length: 10 }, (_, i) => { const inP = eio(tt, r.a, r.a + 0.5), outP = eio(tt, r.a + 1.5, r.a + 2.0), fr = cl((tt - r.a - 0.5) / 1.0);
      if (tt < r.a - 0.05) return null;
      const pan: V3 = [-0.3 + (rn(i + j * 20, 1) - 0.5) * 0.9, 0.06 + 0.02 * Math.sin(tt * 20 + i) * fr * (1 - outP), (rn(i + j * 20, 2) - 0.5) * 0.9];
      const bowl: V3 = [-1.2 + j * 1.2 + (rn(i, 3) - 0.5) * 0.2, 0.12 + (i % 3) * 0.03, 1.25 + (rn(i, 4) - 0.5) * 0.2];
      const p = outP > 0 ? arco(pan, bowl, outP, 0.6) : arco([-0.3, 1.4, 0], pan, inP, 0.1);
      return <mesh key={j + "_" + i} position={p} rotation={[rn(i, 5) * 3, rn(i, 6) * 6, 0]} scale={r.sh} castShadow><sphereGeometry args={[1, 12, 8]} /><meshPhysicalMaterial color={new THREE.Color(r.c).lerp(new THREE.Color("#7a4a1a"), 0.3 * fr)} roughness={0.35} clearcoat={0.6} /></mesh>; }))}
    {Array.from({ length: 12 }, (_, i) => { const k = (tt * 2 + rn(i, 7)) % 1; return <mesh key={"c" + i} position={[-0.3 + (rn(i, 8) - 0.5) * 1.2, 0.05 + Math.sin(k * P) * 0.2, (rn(i, 9) - 0.5) * 1.2]} scale={0.008}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#fff0c0" toneMapped={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 7 · ORDEN: cinco cazuelitas en fila; la pala de madera toca una por una y su contenido salta a la sartén en ese orden
const HOrden: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const O = ["#5a1a12", "#c8945a", "#3a1a26", "#e6d2a0", "#d84a2a"], at = (i: number) => 0.9 + i * 1.05, cur = O.reduce((c, _, i) => (tt > at(i) ? i : c), -1);
  return <Estudio t={tt} cam={[0.1, 1.55, 3.0]} look={[0, 0.25, 0.35]} orbit={0.06}>
    <Sarten p={[-0.2, 0.02, -0.5]} />
    {O.map((c, i) => { const x = -1.6 + i * 0.8, jump = eio(tt, at(i) + 0.2, at(i) + 0.9);
      return <group key={i}>
        <Tazon p={[x, 0.02 + 0.16 * Math.sin(P * cl((tt - at(i)) / 0.9)), 1.0]} s={1.15} c="#9a4f2c" />
        {Array.from({ length: 7 }, (_, j) => { const a: V3 = [x + (rn(j + i * 9, 1) - 0.5) * 0.18, 0.14, 1.0 + (rn(j + i * 9, 2) - 0.5) * 0.18], b: V3 = [-0.2 + (rn(j + i * 9, 3) - 0.5) * 0.9, 0.06 + i * 0.012, -0.5 + (rn(j + i * 9, 4) - 0.5) * 0.9];
          return <mesh key={j} position={arco(a, b, jump, 0.9)} scale={[0.065, 0.04, 0.05]} castShadow><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color={c} roughness={0.4} clearcoat={0.5} /></mesh>; })}
      </group>; })}
    <Pala p={[-1.6 + Math.max(0, cur) * 0.8 + 0.05, 0.35 + 0.15 * Math.abs(Math.sin(tt * 3)), 1.25]} rot={[-0.5, 0.2, 0]} s={1.0} />
  </Estudio>;
}}</Stage>;

// ── 8 · AJONJOLÍ: la pala da vueltas sin parar en la sartén y el ajonjolí brinca y se dora parejo
const HAjonjoli: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const gold = eio(tt, 0.8, 5.5), ang = tt * 2.6;
  return <Estudio t={tt} cam={[0.2, 2.6, 2.6]} look={[0, 0.05, 0]} orbit={0.12}>
    <Sarten p={[0, 0.02, 0]} />
    {Array.from({ length: 160 }, (_, i) => { const a = rn(i, 1) * 6.28 + ang * 0.25 * (rn(i, 2) > 0.5 ? 1 : 0), r = Math.sqrt(rn(i, 3)) * 0.78, hop = Math.max(0, Math.sin(tt * 9 + i * 1.7)) * 0.08;
      return <Semilla key={i} p={[Math.cos(a) * r, 0.04 + hop, Math.sin(a) * r]} c={"#" + new THREE.Color("#f0e2b8").lerp(new THREE.Color("#c88a3a"), gold * (0.7 + 0.3 * rn(i, 4))).getHexString()} s={0.02} />; })}
    <Pala p={[Math.cos(ang) * 0.4, 0.12, Math.sin(ang) * 0.4]} rot={[-0.35, -ang + P2, 0]} s={0.9} />
  </Estudio>;
}}</Stage>;

// ── 9 · ÑAPA: la tortilla seca y el bolillo caen al vaso de la licuadora y el mole sube espeso
const vasoGeo = lathe([[0, 0], [0.26, 0], [0.3, 0.05], [0.42, 1.0], [0.44, 1.05]], 40);
const HNape: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const tor = fall(tt, 0.8, 1.6), bol = fall(tt, 1.9, 1.6), thick = eio(tt, 2.8, 5.0), spin = cl((tt - 2.6) * 3);
  return <Estudio t={tt} cam={[0.2, 1.25, 2.6]} look={[0, 0.85, 0]} orbit={0.06}>
    <mesh geometry={lathe([[0, 0], [0.5, 0], [0.48, 0.1], [0.36, 0.5], [0.34, 0.56]], 40)} castShadow receiveShadow><meshPhysicalMaterial color="#d8d2c4" roughness={0.3} clearcoat={0.6} /></mesh>
    <group position={[0, 0.56, 0]}>
      <mesh position={[0, 0.25 + 0.12 * thick, 0]} rotation={[0, tt * 6 * spin, 0]}><cylinderGeometry args={[0.36 + 0.03 * thick, 0.27, 0.45 + 0.24 * thick, 32]} /><meshPhysicalMaterial color={"#" + new THREE.Color("#7a2a18").lerp(new THREE.Color("#4a160e"), thick).getHexString()} roughness={0.3} clearcoat={0.8} transparent opacity={0.9} /></mesh>
      <mesh position={[0.05, 0.5 + Math.max(0, tor) * 0.5 + (tt > 2.6 ? -1 : 0), 0]} rotation={[0.9, 0.4, 0]} visible={tt < 2.6}><cylinderGeometry args={[0.24, 0.24, 0.02, 30]} /><meshStandardMaterial color="#d9b878" roughness={0.8} /></mesh>
      <mesh position={[-0.05, 0.55 + Math.max(0, bol) * 0.5, 0.05]} rotation={[0.3, 0, 0.6]} visible={tt < 2.8 && tt > 1.6}><capsuleGeometry args={[0.1, 0.2, 6, 12]} /><meshStandardMaterial color="#d89a4a" roughness={0.6} /></mesh>
      {spin > 0 && Array.from({ length: 18 }, (_, i) => { const a = tt * 7 + i * 0.9, r = 0.08 + 0.22 * rn(i, 1), y = 0.15 + 0.5 * ((rn(i, 2) + tt * 0.4) % 1) * (1 - 0.4 * thick); return <mesh key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]} scale={0.035 * (1 - 0.7 * thick)}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={i % 2 ? "#d9b878" : "#d89a4a"} roughness={0.8} /></mesh>; })}
      <mesh geometry={vasoGeo} castShadow>{M.vidrio()}</mesh>
      <mesh position={[0, 1.08, 0]}><cylinderGeometry args={[0.45, 0.45, 0.07, 32]} /><meshStandardMaterial color="#1a1a1a" roughness={0.5} /></mesh>
    </group>
  </Estudio>;
}}</Stage>;

// ── 10 · ESPECIERO: las especias se cuentan: tres clavos, una raja de canela, cinco pimientas caen de a una en el platito
const HEspeciero: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const S = [...Array(3).fill("clavo"), "canela", ...Array(5).fill("pim")] as string[];
  return <Estudio t={tt} cam={[0, 1.6, 2.6]} look={[0, 0.2, 0]} orbit={0.12} fov={30}>
    <Plato p={[0, 0.02, 0]} s={1.5} c="#efe6d2" />
    {S.map((k, i) => { const a = 0.6 + i * 0.5, x = -0.38 + (i % 5) * 0.19, z = -0.12 + Math.floor(i / 5) * 0.26 + (k === "canela" ? 0.06 : 0), y = 0.1 + fall(tt, a, 1.0);
      if (tt < a - 0.4) return null;
      return k === "clavo" ? <group key={i} position={[x, y, z]} rotation={[P2, rn(i, 1) * 6, 0]}><mesh castShadow><cylinderGeometry args={[0.012, 0.018, 0.16, 8]} /><meshStandardMaterial color="#4a2214" roughness={0.8} /></mesh><mesh position={[0, 0.09, 0]}><sphereGeometry args={[0.035, 10, 8]} /><meshStandardMaterial color="#5a2a18" roughness={0.9} flatShading /></mesh></group>
        : k === "canela" ? <mesh key={i} position={[0.1, y, 0.02]} rotation={[0, 0.3, P2]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.6, 14, 1, true, 0, 5]} /><meshStandardMaterial color="#a0582a" roughness={0.85} side={THREE.DoubleSide} /></mesh>
        : <mesh key={i} position={[x, y - 0.03, z + 0.12]} castShadow><sphereGeometry args={[0.035, 12, 10]} /><meshStandardMaterial color="#2a1c14" roughness={0.9} flatShading /></mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 11 · ZONAS: jitomate y tomate verde en la orilla del comal: la piel se llena de manchas negras y se arruga
const HZonas: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const ch = eio(tt, 0.8, 5.5), roll = eio(tt, 3.0, 3.8);
  const piel = (base: string) => ctex("asado" + base + Math.round(ch * 10), 256, 256, (g) => { g.fillStyle = base; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 70 * ch; i++) { g.fillStyle = `rgba(20,12,8,${0.5 + 0.4 * rn(i, 3)})`; g.beginPath(); g.ellipse(rn(i, 1) * 256, rn(i, 2) * 256, 6 + 14 * rn(i, 4), 4 + 10 * rn(i, 5), rn(i, 6) * 3, 0, 7); g.fill(); } });
  return <Estudio t={tt} cam={[0.2, 1.5, 3.0]} look={[0, 0.25, 0]} orbit={0.14}>
    <Comal p={[0, 0.02, 0]} /><Llama p={[0, -0.2, 0]} f={0.35} t={tt} r={0.55} />
    {[-1, 1].map((sg, i) => <mesh key={i} position={[sg * 0.55, 0.26 + fall(tt, 0.1 + i * 0.3, 1.0), 0.3]} rotation={[roll * P * (i ? 1 : -1), 0, 0]} scale={i ? [0.26, 0.22, 0.26] : [0.3, 0.26, 0.3]} castShadow>
      <sphereGeometry args={[1, 32, 20]} /><meshPhysicalMaterial map={piel(i ? "#6aa040" : "#c8321e")} roughness={0.25 + 0.4 * ch} clearcoat={1 - ch} />
      <mesh position={[0, 0.95, 0]} scale={i ? [0.55, 0.25, 0.55] : [0.12, 0.3, 0.12]}><coneGeometry args={[1, 1, i ? 6 : 8]} /><meshStandardMaterial color={i ? "#b8a070" : "#4a6a2a"} roughness={0.9} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 7 }, (_, j) => { const th = rn(j + i * 7, 1) * 6.28, ph = 0.6 + rn(j + i * 7, 2) * 1.6; return <mesh key={j} position={[Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th)]} scale={0.001 + 0.13 * eio(tt, 1.5 + j * 0.4, 2.3 + j * 0.4) * (1 - 0.6 * eio(tt, 2.6 + j * 0.4, 3.0 + j * 0.4))}><sphereGeometry args={[1, 12, 8]} /><meshPhysicalMaterial color="#2a1a10" roughness={0.3} clearcoat={0.8} /></mesh>; })}</mesh>)}
    <Vapor t={tt} p={[0, 0.3, 0.3]} o={0.25 * ch} h={0.9} s={0.25} spread={1.0} n={10} />
  </Estudio>;
}}</Stage>;

// ── 12 · QUEMADOS (bloque): cada error es un OBJETO que llega a la tabla con su etiqueta de papel, y cuando llega el siguiente se va al bote de barro
const Error3D: React.FC<{ i: number; tt: number }> = ({ i, tt }) => {
  if (i === 0) return <Chile k="ancho" s={1.1} dim={0.8} />;
  if (i === 1) return <><Chile k="ancho" s={1.1} c="#0a0606" dim={0.3} /><Vapor t={tt} p={[0, 0.1, 0]} o={0.45} h={1.0} s={0.25} spread={0.3} n={10} /></>;
  if (i === 2) return <><mesh geometry={lathe([[0, 0], [0.22, 0], [0.26, 0.5]], 32)} castShadow>{M.vidrio()}</mesh><mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.235, 0.215, 0.38, 32]} />{M.liquido("#6a2a18", 0.8)}</mesh></>;
  if (i === 3) return <><Chile k="ancho" s={1.1} />{[-0.2, 0, 0.2].map((x) => <mesh key={x} position={[x, 0.13, 0]} scale={[0.2, 0.015, 0.02]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color="#f0dcb0" /></mesh>)}</>;
  return <Sarten p={[-0.4, 0, 0]} rot={[0, 0, 0]}>{Array.from({ length: 30 }, (_, j) => <mesh key={j} position={[(rn(j, 1) - 0.5) * 1.2, 0.1 + (j % 4) * 0.06, (rn(j, 2) - 0.5) * 1.2]} scale={0.07}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={["#5a1a12", "#c8945a", "#3a1a26", "#e6d2a0"][j % 4]} roughness={0.5} /></mesh>)}</Sarten>;
};
const HQuemados: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[];
  return <Estudio t={tt} cam={[0.2, 1.45, 3.3]} look={[0.2, 0.4, 0]} orbit={0.08}>
    <Tabla p={[-0.2, 0.04, 0.1]} w={2.8} d={1.6} />
    <mesh geometry={lathe([[0, 0], [0.4, 0], [0.5, 0.5], [0.46, 0.6]], 40)} position={[1.85, 0, -0.4]} castShadow receiveShadow><meshStandardMaterial color="#8a4526" roughness={0.7} side={THREE.DoubleSide} /></mesh>
    {E.map((e, i) => { const a = i === 0 ? -0.5 : e.a - h.at, nx = E[i + 1] ? E[i + 1].a - h.at : 1e9, k = ent(tt, a), gone = eio(tt, nx, nx + 0.7);
      if (tt < a - 0.3 || gone >= 1) return null;
      const p = arco([-0.2, 0.12 + (1 - k) * 1.2, 0.1], [1.85, 0.45, -0.4], gone, 0.8);
      return <group key={i} position={p} scale={1 - 0.5 * gone} rotation={[0, 0, gone * 2]}>
        <group scale={1.45}><Error3D i={i} tt={tt} /></group>
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 13 · COLADOR: de la licuadora sale el chorro a la coladera sobre la olla; la pala aprieta y el pellejo se queda arriba
const coladeraGeo = new THREE.SphereGeometry(0.5, 32, 14, 0, 2 * P, P2, P2);
const HColador: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const pour = cl((tt - 0.8) * 3) * (1 - cl((tt - 3.4) * 3)), press = cl((tt - 3.6) / 2.4), sk = eio(tt, 1.2, 3.6);
  return <Estudio t={tt} cam={[0.2, 2.0, 3.9]} look={[0.2, 0.7, 0]} orbit={0.12}>
    <Olla p={[0.4, 0, 0]} s={1.0} nivel={0.2 + 0.4 * sk} caldo="#5a1a10" t={tt} />
    <group position={[0.4, 1.3, 0]}>
      <mesh geometry={coladeraGeo} rotation={[P, 0, 0]}><meshStandardMaterial color="#c8ccd2" metalness={0.9} roughness={0.3} wireframe /></mesh>
      <mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.5, 0.025, 8, 40]} />{M.cromo()}</mesh>
      {Array.from({ length: 22 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.34; return <mesh key={i} position={[Math.cos(a) * r, -0.36 + rn(i, 3) * 0.06, Math.sin(a) * r]} rotation={[rn(i, 4) * 3, 0, 0]} scale={0.06 * sk}><sphereGeometry args={[1, 10, 6, 0, 3.6]} /><meshStandardMaterial color="#3a0e08" roughness={0.7} side={THREE.DoubleSide} /></mesh>; })}
    </group>
    <group position={[-1.2, 2.0, 0]} rotation={[0, 0, -1.1 * cl((tt - 0.4) * 2) * (1 - cl((tt - 3.6) * 2))]}>
      <mesh geometry={vasoGeo} castShadow>{M.vidrio()}</mesh>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.36, 0.27, 0.5 * (1 - sk * 0.8) + 0.01, 30]} />{M.liquido("#6a1e12", 0.9)}</mesh>
    </group>
    {pour > 0.01 && <Chorro t={tt} a={[-0.75, 2.05, 0]} b={[0.35, 1.0, 0]} r={0.07 * pour} c="#6a1e12" o={0.9} />}
    <Pala p={[0.45 + 0.15 * Math.sin(press * 18), 1.05 + 0.04 * Math.abs(Math.sin(press * 18)), 0.1]} rot={[-1.1, 0.4, 0]} s={0.8 * cl((tt - 3.4) * 3)} />
  </Estudio>;
}}</Stage>;

// ── 14 · CHILLA: la pasta cae a la manteca bien caliente y chilla: salta en gotas y el borde hierve en burbujas
const HChilla: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const pour = cl((tt - 1.0) * 3) * (1 - cl((tt - 3.4) * 3)), lvl = eio(tt, 1.2, 3.4), hot = cl((tt - 1.1) * 2);
  return <Estudio t={tt} cam={[0.3, 1.9, 3.2]} look={[0, 0.4, 0]} orbit={0.14}>
    <Cazuela s={0.95} nivel={0.04 + 0.26 * lvl} mole="#4a1a10" />
    <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.7, 0.62, 0.02, 48]} /><meshPhysicalMaterial color="#e8b850" roughness={0.02} clearcoat={1} transparent opacity={0.8 * (1 - lvl)} /></mesh>
    {pour > 0.01 && <Chorro t={tt} a={[-0.3, 1.9, 0]} b={[0.0, 0.1 + 0.26 * lvl, 0]} r={0.1 * pour} c="#5a1a10" o={0.98} />}
    {Array.from({ length: 30 }, (_, i) => { const k = (tt * 2.4 + rn(i, 1)) % 1, a = rn(i, 2) * 6.28, r = 0.1 + 0.5 * rn(i, 3);
      return <mesh key={i} position={[Math.cos(a) * r * (1 + k), 0.12 + 0.26 * lvl + Math.sin(k * P) * 0.45 * hot, Math.sin(a) * r * (1 + k)]} scale={0.022 * hot * (1 - k)}><sphereGeometry args={[1, 8, 6]} /><meshPhysicalMaterial color={i % 3 ? "#e8b850" : "#5a1a10"} roughness={0.05} clearcoat={1} /></mesh>; })}
    {Array.from({ length: 16 }, (_, i) => { const k = (tt * 1.8 + rn(i, 5)) % 1, a = (i / 16) * 6.28; return <mesh key={"b" + i} position={[Math.cos(a) * 0.72, 0.08 + 0.26 * lvl, Math.sin(a) * 0.72]} scale={0.001 + 0.05 * hot * Math.sin(k * P)}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color="#6a2a18" roughness={0.1} clearcoat={1} /></mesh>; })}
    <Vapor t={tt} p={[0, 0.4, 0]} o={0.35 * hot} h={1.2} s={0.32} spread={0.7} n={12} />
  </Estudio>;
}}</Stage>;

// ── 15 · GRASA: de cerca, la superficie del mole respira y van brotando perlas de grasa roja que se juntan en el borde
const HGrasa: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const g = eio(tt, 1.0, 5.0);
  return <Estudio t={tt} cam={[0.1, 1.15, 1.9]} look={[0, 0.35, 0]} orbit={0.1} fov={30}>
    <Cazuela s={1.1} nivel={0.3} mole="#3a120c" />
    {Array.from({ length: 60 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.95, on = cl((g - rn(i, 3) * 0.8) * 4), edge = cl((g - 0.5) * 2) * (r > 0.7 ? 1 : 0.4);
      return <mesh key={i} position={[Math.cos(a) * lerp(r, 0.98, edge * 0.3), 0.37, Math.sin(a) * lerp(r, 0.98, edge * 0.3)]} scale={[0.05 * on * (0.5 + rn(i, 4)), 0.008 * on, 0.05 * on * (0.5 + rn(i, 4))]}><sphereGeometry args={[1, 16, 8]} /><meshPhysicalMaterial color="#d84a1a" roughness={0} clearcoat={1} transparent opacity={0.85} /></mesh>; })}
    {Array.from({ length: 6 }, (_, i) => <Onda key={i} p={[(rn(i, 7) - 0.5) * 1.2, 0.375, (rn(i, 8) - 0.5) * 1.0]} t={tt} a={0.8 + i * 0.7} r={0.25} />)}
  </Estudio>;
}}</Stage>;

// ── 16 · JARRA: el caldo entra de a un cucharón (tres), y el mole se afloja un poco con cada uno
const HJarra: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const L = [1.0, 2.6, 4.2], n = L.filter((a) => tt > a + 0.8).length, nn = L.reduce((c, a) => c + eio(tt, a + 0.1, a + 1.1), 0);
  return <Estudio t={tt} cam={[0.7, 1.45, 2.7]} look={[0.55, 0.55, -0.15]} orbit={0.06}>
    <Cazuela s={1.0} nivel={0.22 + 0.04 * nn} mole={["#3a120c", "#40140e", "#461810", "#4c1c12"][n]} />
    <mesh position={[0, 0.3 + 0.04 * nn, 0]} scale={[0.62 + 0.12 * nn, Math.max(0.02, 0.34 * (1 - nn / 3)), 0.62 + 0.12 * nn]}><sphereGeometry args={[1, 40, 20, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color="#3a120c" roughness={0.28} clearcoat={0.9} /></mesh>
    <Olla p={[1.7, 0, -0.5]} s={0.7} nivel={0.7} caldo="#c8963a" t={tt} hervor={0.2} />
    {L.map((a, i) => { const k = eio(tt, a - 0.6, a), tip = cl((tt - a) * 3) * (1 - cl((tt - a - 0.8) * 3)), back = eio(tt, a + 0.8, a + 1.3);
      if (tt < a - 0.6 || back >= 1) return null;
      const p = arco([1.7, 0.8, -0.5], [0.2, 0.95, 0], k * (1 - back), 0.4);
      return <group key={i}><group position={p} rotation={[0, 0, -tip * 1.4]}>
        <mesh scale={[1, 0.7, 1]} castShadow><sphereGeometry args={[0.2, 28, 14, 0, 2 * P, P2, P2]} /><meshStandardMaterial color="#d8dade" roughness={0.2} metalness={1} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, -0.06, 0]}><cylinderGeometry args={[0.18, 0.12, 0.05, 24]} />{M.liquido("#c8963a", 0.9 * (1 - tip))}</mesh>
        <mesh position={[0.34, 0.36, 0]} rotation={[0, 0, -0.75]} castShadow><cylinderGeometry args={[0.025, 0.03, 0.95, 12]} />{M.cromo()}</mesh></group>
        {tip > 0.05 && <Chorro t={tt} a={[p[0] - 0.2, p[1] - 0.05, 0]} b={[0.05, 0.36, 0]} r={0.05 * tip} c="#c8963a" o={0.8} />}
        <Onda p={[0.05, 0.36, 0]} t={tt} a={a + 0.2} r={0.5} /></group>; })}
  </Estudio>;
}}</Stage>;

// ── 17 · CHOCOLATE: la tablilla de chocolate de metate cae al mole, se hunde y se derrite en una espiral
const HChocolate: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const y = 0.42 + fall(tt, 0.8, 1.4), mel = eio(tt, 1.9, 4.6), sw = tt * 1.4;
  return <Estudio t={tt} cam={[0.1, 1.6, 2.4]} look={[0, 0.4, 0]} orbit={0.12} fov={32}>
    <Cazuela s={1.0} nivel={0.3} mole="#3a120c" />
    <group position={[0, y - 0.05 * mel, 0]} rotation={[-0.2, 0.4, 0.1]} scale={[1 - 0.5 * mel, 1 - 0.8 * mel, 1 - 0.5 * mel]}>
      <RBox s={[0.7, 0.12, 0.42]} r={0.03}><meshStandardMaterial color="#3a1c10" roughness={0.75} /></RBox>
      {Array.from({ length: 26 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.62, 0.062, (rn(i, 2) - 0.5) * 0.36]} scale={0.012 + 0.01 * rn(i, 3)}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color={i % 3 ? "#5a3020" : "#8a5a3a"} roughness={0.9} /></mesh>)}
      {[-0.1, 0.1].map((x) => <mesh key={x} position={[x, 0.041, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.16, 0.2]} /><meshStandardMaterial color="#4a2614" roughness={0.5} /></mesh>)}</group>
    {Array.from({ length: 40 }, (_, i) => { const u = i / 40, a = sw + u * 9, r = 0.05 + u * 0.75; return <mesh key={i} position={[Math.cos(a) * r, 0.33, Math.sin(a) * r]} rotation={[-P2, 0, -a]} scale={[0.1 * mel, 0.05 * mel, 1]} visible={mel > 0.02}><circleGeometry args={[1, 12]} /><meshPhysicalMaterial color="#7a4a2a" roughness={0.1} clearcoat={1} transparent opacity={0.85} /></mesh>; })}
    <Onda p={[0, 0.33, 0]} t={tt} a={1.9} r={0.8} />
  </Estudio>;
}}</Stage>;

// ── 18 · CUCHARA: la cuchara de palo sale del mole bien cubierta; la gota cae lenta y espesa (ése es el punto)
const HCuchara: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const up = eio(tt, 0.8, 2.0), dk = cl((tt - 2.4) / 3.0);
  return <Estudio t={tt} cam={[0.4, 1.4, 2.4]} look={[0, 0.65, 0]} orbit={0.1} fov={32}>
    <Cazuela s={1.0} nivel={0.3} mole="#3a120c" />
    <group position={[0.1, lerp(0.35, 1.05, up), 0.1]} rotation={[-1.3 + up * 0.4, 0.3, 0]}>
      <Pala p={[0, 0, 0]} s={1.1} />
      <mesh scale={[0.18, 0.05, 0.26]} position={[0, 0.006, 0]}><sphereGeometry args={[1, 24, 12]} /><meshPhysicalMaterial color="#3a120c" roughness={0.15} clearcoat={1} /></mesh>
    </group>
    {/* la gota: se estira, cuelga y cae lenta */}
    {up > 0.95 && [0, 1].map((j) => { const k = cl(dk * 2 - j), yy = lerp(0.82, 0.36, k * k);
      return <group key={j}>
        <mesh position={[0.1, (0.86 + yy) / 2, 0.36]} scale={[0.018 * (1 - k), Math.max(0.001, (0.86 - yy) / 2), 0.018 * (1 - k)]}><cylinderGeometry args={[1, 1, 2, 10]} /><meshPhysicalMaterial color="#3a120c" roughness={0.15} clearcoat={1} /></mesh>
        <mesh position={[0.1, yy, 0.36]} scale={[0.04, 0.055, 0.04]} visible={k < 0.99}><sphereGeometry args={[1, 14, 10]} /><meshPhysicalMaterial color="#3a120c" roughness={0.15} clearcoat={1} /></mesh>
        <Onda p={[0.1, 0.33, 0.36]} t={tt} a={2.4 + 1.5 * (j + 1)} r={0.25} /></group>; })}
  </Estudio>;
}}</Stage>;

// ── 19 · MESES: el frasco de pasta queda en la repisa junto a la ventana; afuera el árbol pasa verde → naranja → pelón → verde: meses
const HMeses: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const s = cl((tt - 1.0) / 5.0) * 3, col = ["#4a8a36", "#d8862a", "#7a5a3a", "#5aa040"], ci = Math.min(3, Math.floor(s)), fr = s - ci, leaf = ci === 2 ? 0.15 + 0.85 * fr : ci === 1 ? 1 - 0.85 * fr : 1;
  const c = new THREE.Color(col[ci]).lerp(new THREE.Color(col[Math.min(3, ci + 1)]), fr);
  return <Estudio t={tt} cam={[0, 1.35, 3.4]} look={[0, 1.0, -0.5]} orbit={0.08}>
    <RBox p={[0, 1.15, -1.0]} s={[2.4, 1.6, 0.06]} r={0.02}><meshStandardMaterial color="#cfe6f2" emissive="#bfe0f0" emissiveIntensity={0.5} roughness={0.3} /></RBox>
    {[-1.2, 1.2].map((x) => <RBox key={x} p={[x, 1.15, -0.95]} s={[0.1, 1.7, 0.12]} r={0.02}>{M.madera("#6a4428")}</RBox>)}
    {[0.32, 1.98].map((y) => <RBox key={y} p={[0, y, -0.95]} s={[2.5, 0.1, 0.12]} r={0.02}>{M.madera("#6a4428")}</RBox>)}
    <mesh position={[0.3, 0.85, -0.98]}><cylinderGeometry args={[0.06, 0.09, 1.1, 10]} />{M.madera("#4a3020")}</mesh>
    {Array.from({ length: 40 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.6, on = rn(i, 3) < leaf; return <mesh key={i} position={[0.3 + Math.cos(a) * r, 1.45 + Math.sin(a) * r * 0.55, -0.98]} scale={on ? 0.11 : 0.0001}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={c} roughness={0.7} /></mesh>; })}
    <RBox p={[0, 0.3, -0.5]} s={[2.6, 0.08, 0.9]} r={0.02}>{M.madera("#8a5a34")}</RBox>
    <group position={[-0.35, 0.34 + fall(tt, 0.1, 0.8), -0.4]}>
      <mesh geometry={lathe([[0, 0], [0.26, 0], [0.29, 0.04], [0.3, 0.55], [0.24, 0.62], [0.23, 0.68]], 36)} castShadow>{M.vidrio()}</mesh>
      <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.28, 0.26, 0.5, 30]} /><meshPhysicalMaterial color="#3a120c" roughness={0.3} clearcoat={0.6} /></mesh>
      <mesh position={[0, 0.7, 0]}><cylinderGeometry args={[0.25, 0.25, 0.07, 28]} />{M.cromo("#b8962e")}</mesh>
    </group>
  </Estudio>;
}}</Stage>;

// ── 20 · RECETARIO (bloque): la cajita de fichas de la abuela; con cada paso sube una ficha con su foto y su renglón a mano, y se acuesta adelante
const HRecetario: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), 0), from = Math.max(0, cur - 2);
  return <Estudio t={tt} cam={[0, 1.75, 3.6]} look={[0, 0.75, 0]} orbit={0.08}>
    <RBox p={[0, 0.25, -0.35]} s={[1.6, 0.5, 0.9]} r={0.04}>{M.madera("#7a4a28")}</RBox>
    {S.slice(from, cur + 1).map((s, j) => { const i = from + j, a = s.a - h.at, up = ent(tt, a), lay = i < cur ? 1 : 0;
      return <group key={i} position={[0, 0.5 + 0.55 * up - 0.45 * lay + (cur - i) * 0.01, -0.35 + 0.6 * up + 0.35 * lay + (cur - i) * 0.05]} rotation={[-0.25 - 1.0 * lay, 0, (rn(i, 1) - 0.5) * 0.1]}>
        <Foto3D src={img(h.imgs?.[i] ?? h.bg ?? "")} p={[0, 0.1, 0]} w={1.2} h={0.62} />
        <mesh position={[0, -0.38, 0.012]}><planeGeometry args={[1.26, 0.22]} /><meshStandardMaterial map={papel("rc" + i, [`${i + 1}. ${s.tx}`], { w: 1024, h: 180, size: 96, bg: "#f6f1e4" })} roughness={0.9} /></mesh>
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 21 · GOTAS: la misma cucharada en dos platos: en el caliente corre; en el frío se queda quieta y espesa
const HGotas: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const d1 = eio(tt, 1.0, 4.5), d2 = eio(tt, 1.4, 2.4);
  return <Estudio t={tt} cam={[0, 1.35, 2.5]} look={[0, 0.15, 0]} orbit={0.06}>
    <Plato p={[-0.8, 0.02, 0]} s={1.4} c="#f3efe6" /><Plato p={[0.8, 0.02, 0]} s={1.4} c="#e6eef2" />
    <Vapor t={tt} p={[-0.8, 0.1, 0]} o={0.25} h={0.6} s={0.25} spread={0.4} n={8} />
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0.8 + (rn(i, 1) - 0.5) * 0.7, 0.07, (rn(i, 2) - 0.5) * 0.7]} scale={0.018}><octahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#ffffff" emissive="#dff2ff" emissiveIntensity={0.4} /></mesh>)}
    <mesh position={[-0.8 + 0.2 * d1, 0.065 + 0.05 * (1 - d2), 0]} scale={[0.16 + 0.42 * d1, 0.02 + 0.05 * (1 - d2), 0.14 + 0.08 * d1]}><sphereGeometry args={[1, 24, 12]} /><meshPhysicalMaterial color="#3a120c" roughness={0.1} clearcoat={1} /></mesh>
    {tt > 2.6 && <group position={[0.8, 0.2 + 0.6 * (1 - ent(tt, 2.6)), 0]} rotation={[0.08, 0, 0.05]}><Pala p={[0, 0.52, 0]} rot={[-P2, 0, 0]} s={0.55} /></group>}
    <mesh position={[0.8, 0.07 + 0.06 * (1 - d2), 0]} scale={[0.18, 0.16, 0.16]}><sphereGeometry args={[1, 24, 12]} /><meshPhysicalMaterial color="#3a120c" roughness={0.25 + 0.3 * d2} clearcoat={1 - 0.6 * d2} /></mesh>
  </Estudio>;
}}</Stage>;

// ── 22 · BAÑO MARÍA: la cazuelita del mole se asienta dentro de la olla con agua que burbujea suave alrededor
const HBanoMaria: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const y = fall(tt, 0.8, 1.2), bub = cl((tt - 1.6) * 0.8);
  return <Estudio t={tt} cam={[0.25, 1.25, 2.45]} look={[0, 0.5, 0]} orbit={0.08}>
    <Llama p={[0, 0.01, 0]} f={0.3} t={tt} r={0.45} />
    <Olla p={[0, 0.04, 0]} s={1.35} mat="vidrio" nivel={0.45} caldo="#cfe2ea" t={tt} />
    <group position={[0, 0.42 + y, 0]}><Cazuela s={0.5} nivel={0.3} mole="#3a120c" />
      {tt > 2.2 && <group rotation={[0, (tt - 2.2) * 1.6, 0]}><Pala p={[0.16, 0.42, 0]} rot={[-1.0, 0, 0]} s={0.42} /></group>}</group>
    {Array.from({ length: 22 }, (_, i) => { const k = (tt * 1.2 + rn(i, 1)) % 1, a = rn(i, 2) * 6.28, r = 0.62 + 0.18 * rn(i, 3); return <mesh key={i} position={[Math.cos(a) * r, 0.36 + 0.02 * k, Math.sin(a) * r]} scale={0.001 + 0.05 * bub * Math.sin(k * P)}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color="#e8f4f8" roughness={0} transparent opacity={0.6} clearcoat={1} /></mesh>; })}
    <Vapor t={tt} p={[0, 0.6, 0]} o={0.25 * bub} h={1.0} s={0.3} spread={0.9} n={12} />
  </Estudio>;
}}</Stage>;

// ── 23 · CARRUSEL: el mueble giratorio con tres cazuelas (rojo, verde, negro) gira y frena frente a cámara con cada una y su guiso al lado
const HCarrusel: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const st = [0, 1, 2].map((i) => eio(tt, 0.6 + i * 2.2, 1.6 + i * 2.2)).reduce((a, b) => a + b, 0), ang = -st * (2 * P / 3);
  const MO = ["#8a1a10", "#4a6a24", "#160806"];
  return <Estudio t={tt} cam={[0, 1.7, 3.8]} look={[0, 0.35, 0]} orbit={0.06}>
    <group rotation={[0, ang, 0]}>
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow><cylinderGeometry args={[1.55, 1.55, 0.08, 64]} />{M.madera("#8a5a34")}</mesh>
      {MO.map((c, i) => { const a = (i / 3) * 2 * P + P2; return <group key={i} position={[Math.cos(a) * 0.95, 0.1, Math.sin(a) * 0.95]}>
        <Cazuela s={0.42} nivel={0.3} mole={c} />
        <Plato p={[0.0, 0.0, 0.0]} s={0.001} /></group>; })}
    </group>
    {MO.map((c, i) => { const on = cl((tt - (1.6 + i * 2.2)) * 3) * (1 - cl((tt - (2.8 + i * 2.2)) * 3)); return <pointLight key={i} position={[0, 1.1, 1.6]} intensity={0.01 + 3 * on} distance={2.6} color={["#ff9a6a", "#b8e07a", "#ffd9a8"][i]} />; })}
  </Estudio>;
}}</Stage>;

// ── 24 · PREGUNTAS (bloque): dos preguntas, dos escenas de mesa. 1) sin azúcar ni chocolate: la tablilla y el azúcar se apartan y cae UNA pasita grande al mole.
//      2) mole para tamales: la hoja de maíz envuelve la masa y el cucharón echa sólo medio caldo: el mole queda espeso, montado
const HPreguntas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], a2 = S[1] ? S[1].a - h.at : 99, pan = eio(tt, a2 - 0.8, a2 + 0.4);
  const fuera = eio(tt, 1.6, 2.6), pas = fall(tt, 3.0, 1.3), tam = ent(tt, a2 + 0.2), ver = cl((tt - a2 - 1.4) * 2) * (1 - cl((tt - a2 - 2.6) * 2));
  return <Estudio t={tt} cam={[lerp(-1.6, 1.6, pan), 1.35, 2.7]} look={[lerp(-1.6, 1.6, pan), 0.35, 0]} orbit={0.04}>
    <Tabla p={[0, 0.04, 0]} w={6.2} d={1.8} />
    <group position={[-1.6, 0.08, 0]}>
      <Cazuela s={0.62} nivel={0.3} />
      <group position={[-0.85 - 0.9 * fuera, 0, 0.3]} rotation={[0, 0.5 * fuera, 0]}><RBox p={[0, 0.05, 0]} s={[0.42, 0.1, 0.24]} r={0.02}><meshStandardMaterial color="#4a2416" roughness={0.6} /></RBox></group>
      <group position={[0.9 + 0.9 * fuera, 0, 0.25]}><Tazon s={0.9} c="#f4efe6" /><mesh position={[0, 0.17, 0]} scale={[0.22, 0.06, 0.22]}><sphereGeometry args={[1, 16, 8]} /><meshStandardMaterial color="#fbfaf6" roughness={0.95} /></mesh></group>
      {tt > 2.6 && <mesh position={[0, 0.3 + pas, 0]} scale={[0.09, 0.07, 0.07]} castShadow><icosahedronGeometry args={[1, 1]} /><meshPhysicalMaterial color="#3a1a26" roughness={0.45} clearcoat={0.6} flatShading /></mesh>}
      <Onda p={[0, 0.3, 0]} t={tt} a={3.5} r={0.4} />
    </group>
    <group position={[1.6, 0.08, 0]}>
      <Cazuela p={[0.55, 0, -0.1]} s={0.55} nivel={0.34} mole="#3a120c">
        <mesh position={[0, 0.32, 0]} scale={[0.5, 0.18, 0.5]}><sphereGeometry args={[1, 32, 16, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color="#3a120c" roughness={0.3} clearcoat={0.8} /></mesh></Cazuela>
      <group position={[-0.6, 0.06 + (1 - tam) * 0.9, 0.15]} rotation={[0, 0.3, 0]}>
        <mesh scale={[0.42, 0.1, 0.2]} castShadow><sphereGeometry args={[1, 24, 12]} /><meshStandardMaterial color="#d8c48a" roughness={0.9} /></mesh>
        <mesh position={[0, 0.06, 0]} scale={[0.2, 0.05, 0.1]}><sphereGeometry args={[1, 16, 8]} /><meshPhysicalMaterial color="#3a120c" roughness={0.3} clearcoat={0.7} /></mesh></group>
      {ver > 0.02 && <><Cuchar p={[0.75, 0.95, -0.1]} tip={ver} /><Chorro t={tt} a={[0.6, 0.9, -0.1]} b={[0.55, 0.42, -0.1]} r={0.025 * ver} c="#c8963a" o={0.8} /></>}
    </group>
  </Estudio>;
}}</Stage>;
const Cuchar: React.FC<{ p: V3; tip: number }> = ({ p, tip }) => <group position={p} rotation={[0, 0, -tip * 1.2]}>
  <mesh scale={[1, 0.7, 1]} castShadow><sphereGeometry args={[0.16, 24, 12, 0, 2 * P, P2, P2]} /><meshStandardMaterial color="#d8dade" roughness={0.2} metalness={1} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0.28, 0.3, 0]} rotation={[0, 0, -0.75]} castShadow><cylinderGeometry args={[0.02, 0.025, 0.8, 12]} />{M.cromo()}</mesh></group>;
const wrap = (s: string, n = 22) => { const out: string[] = []; let cur = ""; for (const w of s.split(" ")) { if ((cur + " " + w).trim().length > n) { out.push(cur.trim()); cur = w; } else cur += " " + w; } if (cur.trim()) out.push(cur.trim()); return out; };

// ── 25 · FIESTA: la mesa larga; las veinte sillas llegan de a una alrededor y en el centro la cazuela grande se llena
const HFiesta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const N = 20, fill = eio(tt, 1.0, 5.6);
  const seat = (i: number): [V3, number] => i < 16 ? [[-2.1 + (i % 8) * 0.6, 0, i < 8 ? -0.95 : 0.95], i < 8 ? 0 : P] : [[i < 18 ? -2.85 : 2.85, 0, (i % 2 ? 0.4 : -0.4)], i < 18 ? P2 : -P2];
  return <Estudio t={tt} cam={[0, 3.6, 4.4]} look={[0, 0.3, 0]} orbit={0.12}>
    <RBox p={[0, 0.55, 0]} s={[5.0, 0.08, 1.3]} r={0.03}>{M.madera("#8a5a34")}</RBox>
    {[[-2.3, -0.5], [2.3, -0.5], [-2.3, 0.5], [2.3, 0.5]].map(([x, z], i) => <RBox key={i} p={[x, 0.27, z]} s={[0.08, 0.54, 0.08]} r={0.02}>{M.madera("#6a4428")}</RBox>)}
    <group position={[0, 0.59, 0]}><Cazuela s={0.55} nivel={0.05 + 0.3 * fill} mole="#3a120c" /></group>
    <Vapor t={tt} p={[0, 0.85, 0]} o={0.3 * fill} h={0.9} s={0.25} spread={0.4} n={8} />
    {Array.from({ length: N }, (_, i) => { const a = 0.6 + i * 0.22, [p, ry] = seat(i), y = fall(tt, a, 0.9); if (tt < a - 0.2) return null;
      return <group key={i} position={[p[0], y, p[2]]} rotation={[0, ry, 0]}>
        <RBox p={[0, 0.32, 0]} s={[0.36, 0.05, 0.34]} r={0.02}>{M.madera("#a8784a")}</RBox>
        <RBox p={[0, 0.62, -0.16]} s={[0.36, 0.55, 0.04]} r={0.02}>{M.madera("#a8784a")}</RBox>
        {[[-0.15, -0.14], [0.15, -0.14], [-0.15, 0.14], [0.15, 0.14]].map(([x, z], j) => <mesh key={j} position={[x, 0.15, z]}><cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />{M.madera("#8a5a34")}</mesh>)}
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 26 · POSTAL: la olla de barro con el pollo de rancho; el cucharón levanta el caldo dorado con su brillo de grasa
const Pierna: React.FC<{ p: V3; rot: V3 }> = ({ p, rot }) => <group position={p} rotation={rot}>
  <mesh scale={[1, 1.3, 1]} castShadow><sphereGeometry args={[0.16, 18, 12]} /><meshPhysicalMaterial color="#d8a868" roughness={0.4} clearcoat={0.5} /></mesh>
  <mesh position={[0, 0.26, 0]} castShadow><cylinderGeometry args={[0.035, 0.05, 0.22, 10]} /><meshStandardMaterial color="#f0e2c8" roughness={0.6} /></mesh></group>;
const HPostal: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const up = eio(tt, 2.0, 3.2) * (1 - eio(tt, 5.2, 6.0)), tip = cl((tt - 3.6) * 2) * (1 - cl((tt - 5.0) * 2));
  return <Estudio t={tt} cam={[0.3, 1.8, 3.0]} look={[0, 0.6, 0]} orbit={0.12}>
    <Olla s={1.25} nivel={0.72} caldo="#d0a040" t={tt} hervor={0.25}>
      {[0, 1, 2].map((i) => <Pierna key={i} p={[-0.25 + i * 0.25, 0.58, (rn(i, 1) - 0.5) * 0.3]} rot={[0.4, i * 1.4, 0.3]} />)}
      {Array.from({ length: 18 }, (_, i) => <mesh key={"g" + i} position={[(rn(i, 3) - 0.5) * 0.9, 0.555, (rn(i, 4) - 0.5) * 0.9]} rotation={[-P2, 0, 0]} scale={0.02 + 0.03 * rn(i, 5)}><circleGeometry args={[1, 14]} /><meshPhysicalMaterial color="#f0c040" roughness={0} clearcoat={1} transparent opacity={0.75} /></mesh>)}
    </Olla>
    <Vapor t={tt} p={[0, 0.8, 0]} o={0.35} h={1.2} s={0.3} spread={0.6} n={12} />
    <group position={[0.3, lerp(0.75, 1.45, up), 0.15]} rotation={[0, 0, -tip * 1.3]}>
      <mesh scale={[1, 0.7, 1]} castShadow><sphereGeometry args={[0.2, 28, 14, 0, 2 * P, P2, P2]} /><meshStandardMaterial color="#d8dade" roughness={0.2} metalness={1} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.06, 0]}><cylinderGeometry args={[0.18, 0.12, 0.05, 24]} />{M.liquido("#e0b040", 0.85 * (1 - tip))}</mesh>
      <mesh position={[0.34, 0.36, 0]} rotation={[0, 0, -0.75]} castShadow><cylinderGeometry args={[0.025, 0.03, 0.95, 12]} />{M.cromo()}</mesh>
    </group>
    {tip > 0.05 && <Chorro t={tt} a={[0.12, 1.4, 0.15]} b={[0.05, 0.92, 0.15]} r={0.045 * tip} c="#e0b040" o={0.8} />}
  </Estudio>;
}}</Stage>;

const mediaCaz = new THREE.LatheGeometry([[0, 0], [0.62, 0], [0.86, 0.14], [0.98, 0.36], [1.04, 0.42]].map(([r, y]) => new THREE.Vector2(Math.max(0.001, r), y)), 56, P2, P);
// ── 27 · TERMO: la cazuela en corte: la llama directa calienta el centro del fondo (se pone al rojo y ahí se pega); con el comal abajo el calor se reparte
const HTermo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const heat = eio(tt, 0.6, 2.6) * (1 - eio(tt, 4.2, 5.0)), com = eio(tt, 3.8, 4.6), even = eio(tt, 4.6, 6.0);
  const fondo = ctex("fondo" + Math.round(heat * 8) + Math.round(even * 8), 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, `rgba(255,${Math.round(90 + 120 * even)},40,${0.15 + 0.85 * Math.max(heat, 0.5 * even)})`); gr.addColorStop(0.4 + 0.55 * even, `rgba(200,60,20,${0.6 * Math.max(heat, 0.6 * even)})`); gr.addColorStop(1, "rgba(60,20,10,0)"); g.fillStyle = "#3a120c"; g.fillRect(0, 0, 256, 256); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
  return <Estudio t={tt} cam={[0.15, 0.85, 2.7]} look={[0, 0.3, 0]} orbit={0.05}>
    <group position={[0, 0.25 + 0.08 * com, 0]}>
      <mesh geometry={mediaCaz} castShadow><meshStandardMaterial color="#9a4f2c" roughness={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.012, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.62, 48, 0, P]} /><meshStandardMaterial map={fondo} roughness={0.5} emissiveMap={fondo} emissive="#ffffff" emissiveIntensity={0.6} /></mesh>
      <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.85, 0.62, 0.24, 48, 1, true, P2, P]} /><meshPhysicalMaterial color="#3a120c" roughness={0.3} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.14, 0.001]}><planeGeometry args={[1.47, 0.24]} /><meshPhysicalMaterial color="#3a120c" roughness={0.35} clearcoat={0.6} /></mesh>
      <mesh position={[0, -0.02, 0.002]}><planeGeometry args={[1.24, 0.05]} /><meshStandardMaterial map={fondo} emissiveMap={fondo} emissive="#ffffff" emissiveIntensity={0.8} /></mesh>
    </group>
    <Llama p={[0, 0.02, 0]} f={0.9 * (1 - com * 0.6)} t={tt} r={0.18 + 0.2 * com} />
    <group position={[0, lerp(1.6, 0.14, com) + (com > 0 ? 0 : 3), 0]}><Comal /></group>
  </Estudio>;
}}</Stage>;

// ── 28 · COLLAR (bloque): las cuentas de barro en su hilo; cada una se enciende al nombrarse y de ella cuelga su papelito
const HCollar: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], N = Math.max(1, S.length), cur = S.reduce((c, e, i) => (t >= e.a ? i : c), -1);
  const bead = (i: number): V3 => { const u = (i + 0.5) / N; return [lerp(-2.4, 2.4, u), 1.55 - 1.1 * Math.sin(u * P) + 0.02 * Math.sin(tt * 1.2 + u * 5), 0]; };
  const fc = bead(Math.max(0, cur)), cx = lerp(fc[0], 0, 0.35);
  return <Estudio t={tt} cam={[cx, 1.0, 2.6]} look={[cx, fc[1] - 0.25, 0]} orbit={0.03}>
    {Array.from({ length: N - 1 }, (_, i) => { const a = new THREE.Vector3(...bead(i)), b = new THREE.Vector3(...bead(i + 1)), m = a.clone().add(b).multiplyScalar(0.5), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
      return <mesh key={"h" + i} position={m} quaternion={q}><cylinderGeometry args={[0.008, 0.008, a.distanceTo(b), 6]} /><meshStandardMaterial color="#c8a878" /></mesh>; })}
    {S.map((s, i) => { const on = i <= cur, k = cl(phys(t, s.a, 8, 0.4)), p = bead(i);
      return <group key={i} position={p}>
        <mesh scale={1 + 0.35 * k * (i === cur ? 1 : 0)} castShadow><sphereGeometry args={[0.13, 24, 16]} /><meshPhysicalMaterial color={on ? "#e0902e" : "#8a4526"} roughness={0.35} clearcoat={0.6} emissive="#ffb050" emissiveIntensity={i === cur ? 0.8 * k : 0} /></mesh>
        {i === cur && <group position={[0, -0.12, 0]} rotation={[0, 0, 0.06 * Math.sin(tt * 3)]}>
          <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.004, 0.004, 0.24, 4]} /><meshStandardMaterial color="#c8a878" /></mesh>
          <group position={[0, -0.38, 0]} scale={0.001 + k}>{i % 4 === 0 ? <Chile k="ancho" s={0.32} rot={[0, 0, P2]} /> : i % 4 === 1 ? <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.16, 0.16, 0.012, 32]} /><meshStandardMaterial color="#e2c88e" roughness={0.85} /></mesh> : i % 4 === 2 ? <Pala p={[0, -0.12, 0]} rot={[P2, 0, 0]} s={0.3} /> : <Cazuela s={0.16} nivel={0.3} />}</group></group>}
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 29 · SURCO: la pala raya el fondo de la cazuela y el surco se queda abierto un momento antes de cerrarse: ésa es la señal
const HSurco: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const dr = eio(tt, 1.0, 2.4), cls = eio(tt, 3.8, 5.8);
  return <Estudio t={tt} cam={[0.1, 2.1, 1.9]} look={[0, 0.3, 0]} orbit={0.08} fov={32}>
    <Cazuela s={1.1} nivel={0.3} mole="#3a120c" />
    {/* el surco: dos labios de mole que se abren detrás de la pala y se vuelven a juntar */}
    {[-1, 1].map((sg) => <mesh key={sg} position={[lerp(-0.7, 0.7, dr) / 2 - 0.0, 0.345, sg * 0.07 * (1 - cls)]} scale={[0.7 * dr + 0.001, 0.03, 0.05]}><sphereGeometry args={[1, 24, 8]} /><meshPhysicalMaterial color="#4a1810" roughness={0.15} clearcoat={1} /></mesh>)}
    <mesh position={[lerp(-0.7, 0.7, dr) / 2, 0.334, 0]} scale={[0.7 * dr + 0.001, 1, 0.06 * (1 - cls) + 0.001]} rotation={[-P2, 0, 0]}><planeGeometry args={[2, 2]} /><meshStandardMaterial color="#7a4a2a" roughness={0.6} /></mesh>
    <Pala p={[lerp(-0.7, 0.7, dr), 0.42 + 0.6 * eio(tt, 2.5, 3.0), 0]} rot={[-1.2, P2, 0]} s={0.9} />
  </Estudio>;
}}</Stage>;

export const MAP3: Record<string, C> = { podio: HPodio, dobla: HDobla, explota: HExplota, tueste: HTueste, tina: HTina, cinta: HCinta, orden: HOrden, ajonjoli: HAjonjoli,
  nape: HNape, especiero: HEspeciero, zonas: HZonas, colador: HColador, chilla: HChilla, grasa: HGrasa, jarra: HJarra, chocolate: HChocolate, cuchara: HCuchara,
  meses: HMeses, gotas: HGotas, banomaria: HBanoMaria, carrusel: HCarrusel, fiesta: HFiesta, postal: HPostal, termo: HTermo, surco: HSurco,
  quemados: HQuemados, recetario: HRecetario, preguntas: HPreguntas, collar: HCollar };
void Frijol; void Humo;
