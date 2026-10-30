// cuca29e · ARROZ en bodegón 3D (estudio3d + kit3d), con lo aprendido en las 5 vueltas de cuca29a:
// UN objeto héroe grande y entero en cuadro, UNA acción física clara, cámara baja que curva, nada de rótulos flotando
// (las palabras sólo en papel/etiqueta DENTRO de la escena), entra con peso y nada se corta contra el borde.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, img, lerp, phys, Stage } from "./ckit";
import { ctex, Estudio, fall, lathe, M, papel, RBox, rn, V3, Vapor, Yute } from "./estudio3d";
import { Chorro, Foto3D, Llama, Olla, Onda, Plato } from "./kit3d";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;
const ent = (tt: number, a: number) => cl(phys(tt, a, 6, 0.5));
const arco = (a: V3, b: V3, k: number, hh = 0.8): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + hh * Math.sin(k * P), lerp(a[2], b[2], k)];

// ---------- utilería del arroz ----------
// granos: InstancedMesh (cientos de granos sin cientos de mallas); cada grano = cápsula alargada
const granoGeo = new THREE.CapsuleGeometry(0.012, 0.03, 3, 6);
const Granos: React.FC<{ pts: [number, number, number, number][]; c?: string; s?: number; rough?: number; clear?: number }> = ({ pts, c = "#f6f0e0", s = 1, rough = 0.45, clear = 0.4 }) => {
  const ref = React.useRef<THREE.InstancedMesh>(null);
  React.useLayoutEffect(() => { const m = ref.current; if (!m) return; const o = new THREE.Object3D();
    pts.forEach(([x, y, z, r], i) => { o.position.set(x, y, z); o.rotation.set(P2 + r * 0.6, r * 3, r * 1.7); o.scale.setScalar(s); o.updateMatrix(); m.setMatrixAt(i, o.matrix); });
    m.count = pts.length; m.instanceMatrix.needsUpdate = true; });
  return <instancedMesh ref={ref} args={[granoGeo, undefined, Math.max(1, pts.length)]} castShadow><meshPhysicalMaterial color={c} roughness={rough} clearcoat={clear} /></instancedMesh>;
};
// montón de granos dentro de un radio (disco/cúpula) a una altura
const monton = (n: number, R: number, y: number, dome = 0.06, seed = 1): [number, number, number, number][] => Array.from({ length: n }, (_, i) => { const a = rn(i, seed) * 6.28, r = Math.sqrt(rn(i, seed + 1)) * R; return [Math.cos(a) * r, y + dome * (1 - (r / R) ** 2) * rn(i, seed + 2), Math.sin(a) * r, rn(i, seed + 3)]; });
const cazGeo = lathe([[0, 0], [0.62, 0], [0.86, 0.14], [0.98, 0.42], [1.04, 0.5]], 56);
const Cazuela: React.FC<{ p?: V3; s?: number; children?: React.ReactNode }> = ({ p, s = 1, children }) => (
  <group position={p} scale={s}>
    <mesh geometry={cazGeo} castShadow receiveShadow><meshStandardMaterial color="#9a4f2c" roughness={0.6} side={THREE.DoubleSide} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[k * 1.04, 0.42, 0]} rotation={[0, k > 0 ? 0 : P, P2]} castShadow><torusGeometry args={[0.1, 0.035, 8, 16, P]} /><meshStandardMaterial color="#8a4526" roughness={0.65} /></mesh>)}
    {children}
  </group>);
const Tapa: React.FC<{ p?: V3; rot?: V3; r?: number }> = ({ p, rot, r = 1.02 }) => <group position={p} rotation={rot}>
  <mesh castShadow geometry={lathe([[r, 0], [r * 0.8, 0.12], [r * 0.3, 0.2], [0.001, 0.21]], 48)}><meshStandardMaterial color="#9a4f2c" roughness={0.6} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.25, 0]} castShadow><sphereGeometry args={[0.09, 16, 10]} /><meshStandardMaterial color="#8a4526" roughness={0.6} /></mesh></group>;
const Taza: React.FC<{ p?: V3; s?: number; c?: string; rot?: V3; children?: React.ReactNode }> = ({ p, s = 1, c = "#e8dcc4", rot, children }) => (
  <group position={p} scale={s} rotation={rot}><mesh geometry={lathe([[0, 0], [0.17, 0], [0.22, 0.3], [0.23, 0.33]], 36)} castShadow><meshPhysicalMaterial color={c} roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.25, 0.17, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.07, 0.02, 8, 16, P]} /><meshPhysicalMaterial color={c} roughness={0.3} /></mesh>{children}</group>);
const Etiqueta: React.FC<{ id: string; tx: string[]; p: V3; rot?: V3; w?: number; hh?: number; size?: number; bg?: string; ink?: string }> = ({ id, tx, p, rot = [-P2 + 0.35, 0, 0], w = 1.2, hh = 0.32, size = 110, bg, ink }) =>
  <mesh position={p} rotation={rot}><planeGeometry args={[w, hh]} /><meshStandardMaterial map={papel(id, tx, { w: 1024, h: Math.round(1024 * hh / w), size, bg, ink })} roughness={0.9} side={THREE.DoubleSide} /></mesh>;
const Tenedor: React.FC<{ p: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  {[-1.5, -0.5, 0.5, 1.5].map((k) => <mesh key={k} position={[k * 0.025, -0.12, 0]}><cylinderGeometry args={[0.006, 0.006, 0.18, 6]} />{M.cromo()}</mesh>)}
  <RBox p={[0, -0.02, 0]} s={[0.11, 0.04, 0.012]} r={0.005}>{M.cromo()}</RBox>
  <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.014, 0.018, 0.6, 10]} />{M.cromo()}</mesh></group>;
const wrap = (s: string, n = 22) => { const out: string[] = []; let cur = ""; for (const w of s.split(" ")) { if ((cur + " " + w).trim().length > n) { out.push(cur.trim()); cur = w; } else cur += " " + w; } if (cur.trim()) out.push(cur.trim()); return out; };

// ── 1 · REGLA: tres tazas de grano, una al lado de otra: el largo (bien), el corto que se bate y el precocido; la luz se queda en el largo
const HRegla: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const T = [{ s: 1.0, c: "#f6f0e0", tx: "grano largo" }, { s: 0.6, c: "#f3eedc", tx: "grano corto" }, { s: 1.0, c: "#e8d2a0", tx: "precocido" }], pick = cl((tt - 3.4) * 2);
  return <Estudio t={tt} cam={[0, 1.6, 3.4]} look={[0, 0.35, 0]} orbit={0.14}>
    {T.map((g, i) => { const x = -1.05 + i * 1.05, y = fall(tt, 0.4 + i * 0.6, 1.3), dim = i === 0 ? 0 : pick;
      return <group key={i} position={[x, y, 0]}>
        <Taza s={1.5} c="#e8dcc4"><Granos pts={monton(140, 0.28, 0.42, 0.08, i * 7 + 1)} c={"#" + new THREE.Color(g.c).lerp(new THREE.Color("#7a6a5a"), dim * 0.5).getHexString()} s={g.s * 1.2} /></Taza>
      </group>; })}
    <pointLight position={[-1.05, 1.3, 0.8]} intensity={0.01 + 3 * pick} distance={2.4} color="#ffe2b0" />
  </Estudio>;
}}</Stage>;

// ── 2 · LAVADO: la mano de agua entra al tazón: primera agua blanca lechosa que se tira, segunda menos, tercera transparente
const HLavado: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const ph = Math.min(2, Math.floor(cl((tt - 0.6) / 5.4) * 3)), loc = (cl((tt - 0.6) / 5.4) * 3) % 1, tilt = Math.sin(cl((loc - 0.55) / 0.4) * P), lvl = loc < 0.5 ? cl(loc * 3) : 1 - cl((loc - 0.55) * 3);
  const turb = [0.92, 0.5, 0.08][ph];
  return <Estudio t={tt} cam={[0.2, 1.8, 2.8]} look={[0, 0.4, 0]} orbit={0.12} fov={32}>
    <group position={[0, 0, 0]} rotation={[0, 0, -0.9 * tilt]}>
      <mesh geometry={lathe([[0, 0], [0.35, 0], [0.58, 0.25], [0.66, 0.45]], 44)} castShadow receiveShadow><meshPhysicalMaterial color="#e8dcc4" roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>
      <Granos pts={monton(320, 0.4, 0.04, 0.05, 3)} />
      <mesh position={[0, 0.05 + 0.15 * lvl, 0]}><cylinderGeometry args={[0.4 + 0.2 * lvl, 0.35, 0.3 * lvl + 0.001, 40]} /><meshPhysicalMaterial color={"#" + new THREE.Color("#cfe6ee").lerp(new THREE.Color("#f4f0e8"), turb).getHexString()} roughness={0.1} transmission={1 - turb * 0.9} thickness={0.3} transparent opacity={0.55 + 0.4 * turb} /></mesh>
    </group>
    {loc < 0.5 && <Chorro t={tt} a={[-0.25, 1.6, 0]} b={[0, 0.2 + 0.2 * lvl, 0]} r={0.04} c="#cfe6ee" o={0.5} />}
    {tilt > 0.3 && <Chorro t={tt} a={[0.62, 0.35, 0]} b={[0.95, 0.02, 0]} r={0.04 * tilt} c={turb > 0.3 ? "#f4f0e8" : "#cfe6ee"} o={0.6 + 0.3 * turb} />}
  </Estudio>;
}}</Stage>;

// ── 3 · SECO: el arroz lavado en la coladera escurre gota a gota sobre el plato; las gotas se van espaciando hasta que ya no cae ninguna
const colGeo = new THREE.SphereGeometry(0.55, 32, 14, 0, 2 * P, P2, P2);
const HSeco: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const dr = 1 - cl((tt - 0.8) / 4.6);
  return <Estudio t={tt} cam={[0.3, 1.5, 2.8]} look={[0, 0.6, 0]} orbit={0.12}>
    <Plato p={[0, 0.02, 0]} s={1.6} c="#e8eef0" />
    <group position={[0, 0.95, 0]}>
      <mesh geometry={colGeo} rotation={[P, 0, 0]}><meshStandardMaterial color="#c8ccd2" metalness={0.9} roughness={0.3} wireframe /></mesh>
      <mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.55, 0.025, 8, 40]} />{M.cromo()}</mesh>
      <Granos pts={monton(360, 0.42, -0.4, 0.22, 5)} c="#f8f4ea" />
    </group>
    {Array.from({ length: 8 }, (_, i) => { const per = 0.4 + 1.6 * (1 - dr), k = ((tt + rn(i, 1) * 3) % per) / per; if (dr < 0.08) return null;
      return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.4, 0.5 - 0.44 * k * k, (rn(i, 3) - 0.5) * 0.4]} scale={[0.016, 0.026, 0.016]}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color="#e8f4f8" roughness={0} transmission={0.9} thickness={0.1} /></mesh>; })}
    {Array.from({ length: 5 }, (_, i) => <Onda key={i} p={[(rn(i, 2) - 0.5) * 0.4, 0.06, (rn(i, 3) - 0.5) * 0.4]} t={tt} a={0.9 + i * 0.7} r={0.12} />)}
  </Estudio>;
}}</Stage>;

// ── 4 · PERLA: en la cazuela con aceite el grano pasa de translúcido a blanco perla, y brilla; la pala lo mueve para que se fría parejo
const HPerla: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const w = eio(tt, 0.8, 5.0), ang = tt * 1.8;
  return <Estudio t={tt} cam={[0.2, 2.0, 2.2]} look={[0, 0.25, 0]} orbit={0.1} fov={32}>
    <Llama p={[0, -0.08, 0]} f={0.5} t={tt} r={0.5} />
    <Cazuela s={1.0}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.72, 0.62, 0.03, 48]} /><meshPhysicalMaterial color="#e8b850" roughness={0.02} clearcoat={1} transparent opacity={0.5 * (1 - w)} /></mesh>
      <group rotation={[0, ang * 0.15, 0]}><Granos pts={monton(420, 0.68, 0.08, 0.05, 9)} c={"#" + new THREE.Color("#e8e2d0").lerp(new THREE.Color("#fffdf6"), w).getHexString()} rough={0.6 - 0.45 * w} clear={0.2 + 0.8 * w} /></group>
    </Cazuela>
    <group position={[Math.cos(ang) * 0.35, 0.3, Math.sin(ang) * 0.35]} rotation={[-0.4, -ang + P2, 0]}>
      <mesh scale={[0.16, 0.035, 0.24]} castShadow><sphereGeometry args={[1, 24, 12]} />{M.madera("#c08a52")}</mesh>
      <mesh position={[0, 0, 0.78]} rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.03, 0.035, 1.2, 12]} />{M.madera("#b07a48")}</mesh></group>
    {Array.from({ length: 16 }, (_, i) => { const k = (tt * 2 + rn(i, 7)) % 1; return <mesh key={i} position={[(rn(i, 8) - 0.5) * 1.2, 0.12 + Math.sin(k * P) * 0.18, (rn(i, 9) - 0.5) * 1.2]} scale={0.007}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#fff0c0" toneMapped={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 5 · PROBETA: una taza de arroz entra a la cazuela, luego dos tazas de líquido: la regla se ve en las tazas alineadas (1 y 2)
const HProbeta: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const steps = [0.8, 2.4, 3.9], lvl = cl((tt - 2.6) / 2.6);
  return <Estudio t={tt} cam={[0.2, 1.8, 3.4]} look={[0, 0.5, 0]} orbit={0.12}>
    <Cazuela p={[0, 0, -0.2]} s={0.95}>
      <Granos pts={monton(300, 0.6, 0.06, 0.05, 11)} c="#fffaf0" />
      <mesh position={[0, 0.05 + 0.15 * lvl, 0]}><cylinderGeometry args={[0.66 + 0.2 * lvl, 0.62, 0.3 * lvl + 0.001, 48]} />{M.liquido("#d86a3a", 0.8)}</mesh>
    </Cazuela>
    {steps.map((a, i) => { const k = eio(tt, a, a + 0.6), tip = cl((tt - a - 0.6) * 3) * (1 - cl((tt - a - 1.4) * 3)), back = eio(tt, a + 1.4, a + 1.9);
      const home: V3 = [-1.2 + i * 0.8, 0, 1.0], over: V3 = [0.3, 0.95, -0.2], p = arco(home, over, k * (1 - back), 0.3);
      return <group key={i}>
        <Taza p={p} s={1.1} rot={[0, 0, tip * 1.6]} c={i === 0 ? "#e8dcc4" : "#c0392b"}>
          {tip < 0.3 && (i === 0 ? <Granos pts={monton(60, 0.18, 0.28, 0.04, 13)} /> : <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.2, 0.17, 0.27, 28]} />{M.liquido("#d86a3a", 0.8)}</mesh>)}
        </Taza>
        {tip > 0.1 && i > 0 && <Chorro t={tt} a={[p[0] - 0.15, p[1] + 0.25, p[2]]} b={[0.1, 0.25, -0.2]} r={0.045 * tip} c="#d86a3a" o={0.8} />}
        {tip > 0.1 && i === 0 && Array.from({ length: 30 }, (_, j) => <mesh key={j} position={[p[0] - 0.15 + (rn(j, 1) - 0.5) * 0.08, p[1] + 0.2 - ((tt * 3 + rn(j, 2)) % 1) * 0.8, p[2] + (rn(j, 3) - 0.5) * 0.08]} rotation={[rn(j, 4) * 3, 0, 0]} scale={1}><capsuleGeometry args={[0.012, 0.03, 3, 6]} /><meshStandardMaterial color="#f6f0e0" /></mesh>)}
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 6 · JITOMATE: del vaso de la licuadora el jitomate pasa por la coladera fina; arriba se quedan las semillas y la piel
const vasoGeo = lathe([[0, 0], [0.26, 0], [0.3, 0.05], [0.42, 1.0], [0.44, 1.05]], 40);
const HJitomate: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const pour = cl((tt - 0.9) * 3) * (1 - cl((tt - 4.2) * 3)), sk = eio(tt, 1.2, 4.2), tilt = cl((tt - 0.5) * 2) * (1 - cl((tt - 4.4) * 2));
  return <Estudio t={tt} cam={[0.2, 1.9, 3.6]} look={[0.1, 0.8, 0]} orbit={0.12}>
    <mesh geometry={lathe([[0, 0], [0.4, 0], [0.55, 0.3], [0.6, 0.45]], 40)} position={[0.4, 0, 0]} castShadow receiveShadow><meshPhysicalMaterial color="#e8dcc4" roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.4, 0.05 + 0.15 * sk, 0]}><cylinderGeometry args={[0.42 + 0.14 * sk, 0.4, 0.3 * sk + 0.001, 36]} /><meshPhysicalMaterial color="#d8401e" roughness={0.15} clearcoat={0.9} /></mesh>
    <group position={[0.4, 0.95, 0]}>
      <mesh geometry={colGeo} rotation={[P, 0, 0]} scale={0.8}><meshStandardMaterial color="#c8ccd2" metalness={0.9} roughness={0.3} wireframe /></mesh>
      <mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.44, 0.022, 8, 40]} />{M.cromo()}</mesh>
      {Array.from({ length: 50 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.26; return <mesh key={i} position={[Math.cos(a) * r, -0.32 + rn(i, 3) * 0.05, Math.sin(a) * r]} scale={i % 3 ? [0.012, 0.006, 0.009] : [0.05, 0.008, 0.04]} visible={rn(i, 4) < sk}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={i % 3 ? "#f0d890" : "#b8281a"} roughness={0.5} /></mesh>; })}
    </group>
    <group position={[-1.1, 1.9, 0]} rotation={[0, 0, -1.05 * tilt]}>
      <mesh geometry={vasoGeo} castShadow>{M.vidrio()}</mesh>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.36, 0.27, 0.5 * (1 - 0.85 * sk) + 0.01, 30]} /><meshPhysicalMaterial color="#d8401e" roughness={0.3} /></mesh>
    </group>
    {pour > 0.01 && <Chorro t={tt} a={[-0.68, 1.95, 0]} b={[0.38, 0.75, 0]} r={0.06 * pour} c="#d8401e" o={0.92} />}
  </Estudio>;
}}</Stage>;

// ── 7 · HERVOR: el caldo entra a la cazuela ya hirviendo: borbota en la olla de al lado y, al caer, el arroz sigue chisporroteando
const HHervor: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const pour = cl((tt - 1.6) * 3) * (1 - cl((tt - 4.6) * 3)), lvl = eio(tt, 1.8, 4.6), tilt = cl((tt - 1.2) * 2) * (1 - cl((tt - 4.8) * 2));
  return <Estudio t={tt} cam={[0.3, 1.9, 3.6]} look={[0.1, 0.55, 0]} orbit={0.12}>
    <Llama p={[0.5, -0.08, 0]} f={0.55} t={tt} r={0.5} />
    <Cazuela p={[0.5, 0, 0]} s={0.9}>
      <Granos pts={monton(300, 0.6, 0.06, 0.05, 15)} c="#f2c8a8" />
      <mesh position={[0, 0.06 + 0.13 * lvl, 0]}><cylinderGeometry args={[0.66 + 0.18 * lvl, 0.62, 0.26 * lvl + 0.001, 48]} />{M.liquido("#c87a3a", 0.75)}</mesh>
      {Array.from({ length: 20 }, (_, i) => { const k = (tt * 2.2 + rn(i, 1)) % 1, a = rn(i, 2) * 6.28, r = rn(i, 3) * 0.6; return <mesh key={i} position={[Math.cos(a) * r, 0.08 + 0.26 * lvl, Math.sin(a) * r]} scale={0.001 + 0.04 * lvl * Math.sin(k * P)}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color="#f8e8c8" roughness={0} transparent opacity={0.7} /></mesh>; })}
    </Cazuela>
    <group position={[-1.0, 1.15, 0]} rotation={[0, 0, -0.95 * tilt]}>
      <Olla s={0.6} nivel={0.7} caldo="#c87a3a" t={tt} hervor={1} mat="peltre" /></group>
    {pour > 0.01 && <Chorro t={tt} a={[-0.5, 1.5, 0]} b={[0.4, 0.3, 0]} r={0.05 * pour} c="#c87a3a" o={0.8} />}
    <Vapor t={tt} p={[-1.0, 1.6, 0]} o={0.4} h={0.9} s={0.25} spread={0.3} n={10} />
    <Vapor t={tt} p={[0.5, 0.4, 0]} o={0.35 * lvl} h={1.0} s={0.3} spread={0.7} n={10} />
  </Estudio>;
}}</Stage>;

// ── 8 · SAL: la cuchara de madera toma caldo de la cazuela y sube a la boca: la sal se arregla AHÍ, en el caldo, antes de tapar (caen cristales)
const HSal: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const up = eio(tt, 0.8, 1.8) * (1 - eio(tt, 2.6, 3.2)), s = cl((tt - 3.4) / 1.8);
  return <Estudio t={tt} cam={[0.3, 1.6, 2.6]} look={[0, 0.5, 0]} orbit={0.1} fov={32}>
    <Cazuela s={1.0}><mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.92, 0.75, 0.04, 48]} />{M.liquido("#c87a3a", 0.85)}</mesh></Cazuela>
    <group position={[0.2, lerp(0.38, 1.35, up), 0.2]} rotation={[-1.3 + 1.0 * up, 0.3, 0]}>
      <mesh scale={[0.16, 0.035, 0.24]} castShadow><sphereGeometry args={[1, 24, 12]} />{M.madera("#c08a52")}</mesh>
      <mesh position={[0, 0.0, 0.78]} rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.03, 0.035, 1.2, 12]} />{M.madera("#b07a48")}</mesh>
      <mesh position={[0, 0.02, 0]} scale={[0.13, 0.015, 0.2]} visible={up > 0.3}><sphereGeometry args={[1, 20, 8]} />{M.liquido("#c87a3a", 0.9)}</mesh></group>
    <Vapor t={tt} p={[0.2, lerp(0.4, 1.4, up), 0.2]} o={0.25 * up} h={0.5} s={0.15} spread={0.15} n={6} />
    {Array.from({ length: 40 }, (_, i) => { const k = cl(s * 1.4 - rn(i, 1) * 0.4); if (k <= 0 || k >= 1) return null;
      return <mesh key={i} position={[-0.3 + (rn(i, 2) - 0.5) * 0.08, 1.4 - 1.08 * k, (rn(i, 3) - 0.5) * 0.08]} rotation={[rn(i, 4) * 3, rn(i, 5) * 3, 0]} scale={0.018}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.4} thickness={0.5} /></mesh>; })}
    <group position={[-0.3, 1.55, 0]} rotation={[0, 0, P * 0.85 * cl((tt - 3.2) * 3)]}><mesh castShadow><cylinderGeometry args={[0.08, 0.1, 0.28, 20]} />{M.vidrio()}</mesh><mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.08, 0.08, 0.05, 20]} />{M.cromo()}</mesh></group>
  </Estudio>;
}}</Stage>;

// ── 9 · TAPA: la tapa baja y se asienta con su golpecito; el vapor sale por la orilla y una mano que se acerca… no la levanta
const HTapa: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const y = 0.5 + fall(tt, 0.6, 1.2) * 0.8, jig = 0.012 * Math.sin(tt * 26) * cl((tt - 1.6) * 2);
  return <Estudio t={tt} cam={[0.3, 1.5, 3.0]} look={[0, 0.5, 0]} orbit={0.14}>
    <Llama p={[0, -0.08, 0]} f={0.3} t={tt} r={0.45} />
    <Cazuela s={1.0}><Tapa p={[0, y + jig, 0]} rot={[jig * 2, 0, 0]} r={1.0} /></Cazuela>
    {Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * 6.28 + 0.3; return <Vapor key={i} t={tt + i} p={[Math.cos(a) * 1.0, 0.55, Math.sin(a) * 1.0]} o={0.25 * cl((tt - 1.6) * 1.5)} h={0.7} s={0.14} spread={0.08} n={4} />; })}
    <Onda p={[0, 0.5, 0]} t={tt} a={1.25} r={1.2} />
  </Estudio>;
}}</Stage>;

// ── 10 · PERILLA (lumbre al mínimo): de cerca, la corona de fuego se encoge de llamas altas naranjas a una coronita azul que apenas lame el barro
const HPerillaE: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const lo = eio(tt, 1.2, 3.0);
  return <Estudio t={tt} cam={[0.2, 0.75, 2.4]} look={[0, 0.25, 0]} orbit={0.12} fov={32}>
    <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.32, 0.36, 0.06, 32]} /><meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} /></mesh>
    {Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * 6.28, fl = 0.9 + 0.2 * Math.sin(tt * 20 + i * 2.1), hh = lerp(0.36, 0.06, lo) * fl;
      return <mesh key={i} position={[Math.cos(a) * 0.28, 0.04 + hh / 2, Math.sin(a) * 0.28]}><coneGeometry args={[0.035, hh, 8]} /><meshBasicMaterial color={"#" + new THREE.Color("#ff9a2a").lerp(new THREE.Color("#4a8aff"), lo).getHexString()} transparent opacity={0.85} toneMapped={false} depthWrite={false} /></mesh>; })}
    <pointLight position={[0, 0.2, 0]} intensity={lerp(4, 1.2, lo)} distance={2} color={lo > 0.5 ? "#7aa8ff" : "#ffa040"} />
    <Cazuela p={[0, 0.48, 0]} s={0.8}><Tapa p={[0, 0.5, 0]} r={1.0} /></Cazuela>
  </Estudio>;
}}</Stage>;

// ── 11 · HIELO (no se mueve): la cazuela tapada queda quieta como estatua; la cuchara se acerca, la tapa no se mueve y la cuchara se retira sola a su lugar
const HHielo: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const app = eio(tt, 0.8, 2.0) * (1 - eio(tt, 2.8, 4.0)), still = cl((tt - 2.0) * 2) * (1 - cl((tt - 3.0) * 2));
  return <Estudio t={tt} cam={[0.4, 1.7, 3.2]} look={[0, 0.5, 0]} orbit={0.12}>
    <Llama p={[0, -0.08, 0]} f={0.12} t={tt} r={0.4} />
    <Cazuela s={1.0}><Tapa p={[0, 0.5, 0]} r={1.0} /></Cazuela>
    <mesh position={[0, 0.85, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[1.12, 0.012, 8, 64]} /><meshBasicMaterial color="#cfe8ff" transparent opacity={0.5 * still} toneMapped={false} /></mesh>
    <group position={[lerp(2.2, 0.95, app), 1.0, 0.2]} rotation={[0, 0, 0.6]}>
      <mesh scale={[0.16, 0.035, 0.24]} castShadow rotation={[0, P2, 0]}><sphereGeometry args={[1, 24, 12]} />{M.madera("#c08a52")}</mesh>
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.03, 0.035, 1.0, 12]} />{M.madera("#b07a48")}</mesh></group>
  </Estudio>;
}}</Stage>;

// ── 12 · OLLASERROR (bloque de 5): cada error es una cazuelita en la tabla con su arroz mal hecho (engrudo, quemado, aguado…) y su etiqueta; al siguiente, se va
const ErrArroz: React.FC<{ i: number; tt: number }> = ({ i, tt }) => {
  const caz = (ch: React.ReactNode) => <Cazuela s={0.55}>{ch}</Cazuela>;
  if (i === 0) return caz(<><Granos pts={monton(160, 0.55, 0.1, 0.1, 21)} c="#f2ece0" /><mesh position={[0, 0.14, 0]} scale={[0.6, 0.06, 0.6]}><sphereGeometry args={[1, 24, 10]} /><meshPhysicalMaterial color="#f8f4ea" roughness={0.2} transparent opacity={0.6} /></mesh></>);
  if (i === 1) return caz(<><Granos pts={monton(160, 0.55, 0.1, 0.08, 23)} c="#e8d8b8" /><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.7, 0.62, 0.03, 40]} /><meshPhysicalMaterial color="#e8b850" roughness={0} clearcoat={1} transparent opacity={0.6} /></mesh>{Array.from({ length: 8 }, (_, j) => <mesh key={j} position={[(rn(j, 1) - 0.5), 0.3 + ((tt * 2 + rn(j, 2)) % 1) * 0.4, (rn(j, 3) - 0.5)]} scale={0.02}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#ffe8a0" /></mesh>)}</>);
  if (i === 2) return caz(<><Granos pts={monton(160, 0.55, 0.08, 0.05, 25)} c="#f2c8a8" /><mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.8, 0.62, 0.22, 40]} />{M.liquido("#d87a4a", 0.8)}</mesh></>);
  if (i === 3) return caz(<><Granos pts={monton(160, 0.55, 0.1, 0.08, 27)} c="#e8c8a8" /><mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.75, 0.62, 0.16, 40]} />{M.liquido("#c8d8e0", 0.6)}</mesh>{Array.from({ length: 5 }, (_, j) => <mesh key={j} position={[(rn(j, 1) - 0.5) * 0.6, 0.3, (rn(j, 2) - 0.5) * 0.6]} scale={0.08}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#e8f4ff" roughness={0.05} transmission={0.7} thickness={0.5} /></mesh>)}</>);
  return caz(<><Granos pts={monton(160, 0.55, 0.12, 0.2, 29)} c="#f0e8d8" /><Tapa p={[0.6, 0.9, 0]} rot={[0, 0, -0.7]} r={1.0} /><mesh position={[0.3, 0.5, 0]} rotation={[0, 0, 0.9]}><cylinderGeometry args={[0.03, 0.035, 1.0, 12]} />{M.madera("#b07a48")}</mesh></>);
};
const HOllasError: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[];
  return <Estudio t={tt} cam={[0, 1.8, 3.6]} look={[0, 0.35, 0]} orbit={0.1}>
    <RBox p={[0, 0.04, 0.1]} s={[2.8, 0.08, 1.7]} r={0.04}>{M.madera("#a8784a")}</RBox>
    {E.map((e, i) => { const a = i === 0 ? -0.5 : e.a - h.at, nx = E[i + 1] ? E[i + 1].a - h.at : 1e9, k = ent(tt, a), gone = eio(tt, nx, nx + 0.6);
      if (tt < a - 0.3 || gone >= 1) return null;
      return <group key={i} position={[2.6 * gone, 0.08 + (1 - k) * 1.3, 0]} rotation={[0, 0, -gone * 0.6]}>
        <ErrArroz i={i} tt={tt} />
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 13 · REPOSO: fuera del fuego, entre cazuela y tapa se mete un trapo de cuadros; el vapor deja de salir y el arroz descansa
const trapoTex = () => ctex("trapoE", 256, 256, (g) => { g.fillStyle = "#f2ece0"; g.fillRect(0, 0, 256, 256); g.fillStyle = "rgba(40,90,160,.7)"; for (let i = 0; i < 256; i += 64) { g.fillRect(i, 0, 18, 256); g.fillRect(0, i, 256, 18); } });
const HReposoE: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const mv = eio(tt, 0.6, 1.6), tr = eio(tt, 1.8, 2.8), st = 1 - cl((tt - 2.8) * 0.8);
  return <Estudio t={tt} cam={[0.3, 1.6, 3.4]} look={[0.3, 0.5, 0]} orbit={0.12}>
    <Llama p={[-1.0, -0.08, 0]} f={0.25 * (1 - mv)} t={tt} r={0.4} />
    <group position={[lerp(-1.0, 0.6, mv), 0.25 * Math.sin(mv * P), 0]}>
      <Cazuela s={0.9}>
        <mesh position={[0, 0.5 + 0.03 * tr, 0]} rotation={[-P2, 0, 0.3]} visible={tr > 0.01}><planeGeometry args={[2.4 * tr + 0.01, 2.4 * tr + 0.01]} /><meshStandardMaterial map={trapoTex()} roughness={0.95} side={THREE.DoubleSide} /></mesh>
        {Array.from({ length: 4 }, (_, i) => { const a = (i / 4) * 6.28 + 0.6; return <mesh key={i} position={[Math.cos(a) * 1.2 * tr, 0.36, Math.sin(a) * 1.2 * tr]} rotation={[0, -a, 0.7]} visible={tr > 0.5}><planeGeometry args={[0.6, 0.35]} /><meshStandardMaterial map={trapoTex()} roughness={0.95} side={THREE.DoubleSide} /></mesh>; })}
        <Tapa p={[0, 0.53 + 0.4 * Math.sin(tr * P) * (tr < 1 ? 1 : 0), 0]} r={1.0} />
      </Cazuela>
    </group>
    <Vapor t={tt} p={[lerp(-1.0, 0.6, mv), 0.6, 0]} o={0.35 * st} h={0.9} s={0.25} spread={0.9} n={10} />
  </Estudio>;
}}</Stage>;

// ── 14 · TENEDOR: el tenedor entra de lado y levanta el arroz: los granos se separan, sueltos, y caen esponjados
const HTenedor: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const k = (tt * 0.9) % 1, n = Math.floor(tt * 0.9), lift = Math.sin(cl(k * 1.3) * P), x = -0.35 + (n % 3) * 0.35;
  return <Estudio t={tt} cam={[0.2, 1.7, 1.9]} look={[0, 0.35, 0]} orbit={0.08} fov={32}>
    <Cazuela s={0.95}><Granos pts={monton(500, 0.82, 0.32, 0.14, 31)} c="#f2b088" /></Cazuela>
    <Tenedor p={[x, 0.52 + 0.3 * lift, 0.1]} rot={[0.6 - 0.5 * lift, 0, 0.1]} s={1.4} />
    <Granos pts={Array.from({ length: 50 }, (_, i): [number, number, number, number] => [x + (rn(i + n * 50, 1) - 0.5) * 0.25, 0.5 + 0.35 * lift * rn(i, 2) + 0.05, 0.1 + (rn(i + n * 50, 3) - 0.5) * 0.15, rn(i, 4)])} c="#f2b088" />
  </Estudio>;
}}</Stage>;

// ── 15 · PALETA (arroz verde): poblano y cilantro CRUDOS entran a la licuadora y el líquido se vuelve verde intenso (no se cocinan antes)
const HPaleta: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const p1 = fall(tt, 0.6, 1.6), p2 = fall(tt, 1.4, 1.6), g = eio(tt, 2.4, 4.6), spin = cl((tt - 2.2) * 3);
  return <Estudio t={tt} cam={[0.2, 1.5, 3.6]} look={[0, 0.8, 0]} orbit={0.12}>
    <mesh geometry={lathe([[0, 0], [0.5, 0], [0.48, 0.1], [0.36, 0.5], [0.34, 0.56]], 40)} castShadow receiveShadow><meshPhysicalMaterial color="#d8d2c4" roughness={0.3} clearcoat={0.6} /></mesh>
    <group position={[0, 0.56, 0]}>
      <mesh position={[0, 0.3, 0]} rotation={[0, tt * 6 * spin, 0]}><cylinderGeometry args={[0.36, 0.27, 0.55, 32]} /><meshPhysicalMaterial color={"#" + new THREE.Color("#d8e8d0").lerp(new THREE.Color("#2a8a2a"), g).getHexString()} roughness={0.25} transparent opacity={0.85} /></mesh>
      <mesh position={[0.05, 0.4 + Math.max(0, p1) * 0.5, 0]} rotation={[0.3, 0.4, 0.8]} visible={tt < 2.4} castShadow scale={[0.12, 0.3, 0.1]}><sphereGeometry args={[1, 16, 12]} /><meshPhysicalMaterial color="#1e5a1e" roughness={0.2} clearcoat={0.9} /></mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.3, 0.5 + Math.max(0, p2) * 0.5 + i * 0.03, (rn(i, 2) - 0.5) * 0.3]} rotation={[rn(i, 3) * 3, rn(i, 4) * 3, 0]} visible={tt < 2.6 && tt > 1.0} scale={0.06}><circleGeometry args={[1, 7]} /><meshStandardMaterial color="#3aa03a" side={THREE.DoubleSide} /></mesh>)}
      <mesh geometry={vasoGeo} castShadow>{M.vidrio()}</mesh>
      <mesh position={[0, 1.08, 0]}><cylinderGeometry args={[0.45, 0.45, 0.07, 32]} /><meshStandardMaterial color="#1a1a1a" roughness={0.5} /></mesh>
    </group>
  </Estudio>;
}}</Stage>;

// ── 16 · CEBOLLA (arroz blanco): el cuarto de cebolla y la cabeza de ajo ENTEROS se hunden en el arroz blanco y se quedan ahí, perfumando
const HCebolla: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const c1 = fall(tt, 0.8, 1.4), c2 = fall(tt, 1.8, 1.4), sink = eio(tt, 2.8, 4.0);
  return <Estudio t={tt} cam={[0.2, 1.8, 2.4]} look={[0, 0.35, 0]} orbit={0.12} fov={32}>
    <Cazuela s={0.95}>
      <Granos pts={monton(400, 0.8, 0.28, 0.12, 33)} c="#fbf8f0" />
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.9, 0.7, 0.05, 48]} />{M.liquido("#e8e8e0", 0.6)}</mesh>
    </Cazuela>
    <group position={[-0.25, 0.42 + c1 - 0.12 * sink, 0]} rotation={[0.4, 0.6, 0]}>
      <mesh castShadow><sphereGeometry args={[0.2, 24, 16, 0, P2]} /><meshPhysicalMaterial color="#f4ecdc" roughness={0.4} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>
      {[0.16, 0.12, 0.08].map((r) => <mesh key={r}><sphereGeometry args={[r, 20, 12, 0, P2]} /><meshStandardMaterial color="#efe4cc" side={THREE.DoubleSide} /></mesh>)}</group>
    <group position={[0.3, 0.44 + c2 - 0.1 * sink, 0.1]}>{Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * 6.28; return <mesh key={i} position={[Math.cos(a) * 0.07, 0, Math.sin(a) * 0.07]} rotation={[0, -a, 0.15]} scale={[0.07, 0.12, 0.07]} castShadow><sphereGeometry args={[1, 14, 10]} /><meshPhysicalMaterial color="#f4ece4" roughness={0.4} clearcoat={0.3} /></mesh>; })}</group>
  </Estudio>;
}}</Stage>;

// ── 17 · DADOS: zanahoria, chícharo y elote en cuadritos crudos caen sobre el arroz ya con caldo, de un solo golpe, y se acomodan
const HDados: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const V = [{ c: "#e87a2a", g: "box" }, { c: "#5aa83a", g: "sph" }, { c: "#f0c840", g: "box" }];
  return <Estudio t={tt} cam={[0.2, 2.0, 2.4]} look={[0, 0.3, 0]} orbit={0.12} fov={32}>
    <Cazuela s={1.0}><Granos pts={monton(360, 0.84, 0.18, 0.06, 35)} c="#f2c8a8" /><mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.9, 0.78, 0.04, 48]} />{M.liquido("#c87a3a", 0.75)}</mesh></Cazuela>
    {V.map((v, j) => Array.from({ length: 22 }, (_, i) => { const a = 0.6 + j * 0.9 + rn(i, 1) * 0.25, ang = rn(i + j * 30, 2) * 6.28, r = Math.sqrt(rn(i + j * 30, 3)) * 0.78;
      return <mesh key={j + "_" + i} position={[Math.cos(ang) * r, 0.26 + fall(tt, a, 1.4), Math.sin(ang) * r]} rotation={[rn(i, 4) * 3, rn(i, 5) * 3, 0]} scale={v.g === "box" ? 0.035 : 0.025} castShadow>
        {v.g === "box" ? <boxGeometry args={[1, 1, 1]} /> : <sphereGeometry args={[1, 10, 8]} />}<meshPhysicalMaterial color={v.c} roughness={0.35} clearcoat={0.6} /></mesh>; }))}
  </Estudio>;
}}</Stage>;

// ── 18 · TREN (rutina, 10 pasos): las cazuelitas en fila sobre una banca larga; con cada paso la cámara llega a la siguiente: foto del paso y su ficha a mano
const HTren: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), 0), from = Math.max(0, cur - 2);
  return <Estudio t={tt} cam={[0, 1.45, 3.4]} look={[0, 0.75, 0]} orbit={0.06}>
    <RBox p={[0, 0.25, -0.3]} s={[4.4, 0.5, 0.8]} r={0.04}>{M.madera("#7a4a28")}</RBox>
    {S.slice(from, cur + 1).map((s, j) => { const i = from + j, a = s.a - h.at, k = ent(tt, a), x = -1.35 + (i - from) * 1.35;
      return <group key={i} position={[x, 0.5 + (1 - k) * 1.2, -0.25]} rotation={[-0.18, 0, (rn(i, 1) - 0.5) * 0.08]}>
        <RBox p={[0, 0.5, -0.03]} s={[1.18, 1.1, 0.03]} r={0.01}><meshStandardMaterial color="#f6f1e4" roughness={0.9} /></RBox>
        <Foto3D src={img(h.imgs?.[i] ?? h.bg ?? "")} p={[0, 0.5, 0]} w={1.08} h={0.98} />
        {i === cur && <pointLight position={[0, 1.2, 0.8]} intensity={1.5 * k} distance={2} color="#ffe2b0" />}
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 19 · PEGADITO: la cazuela vacía se inclina y la pala despega la costra dorada del fondo en una sola pieza crujiente, que va al plato
const HPegadito: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const sc = eio(tt, 0.8, 2.6), lift = eio(tt, 2.8, 4.2);
  const cost = ctex("costra", 256, 256, (g) => { g.fillStyle = "#c8842a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 500; i++) { g.fillStyle = rn(i, 1) > 0.7 ? "rgba(90,40,10,.7)" : "rgba(250,220,150,.6)"; g.beginPath(); g.ellipse(rn(i, 2) * 256, rn(i, 3) * 256, 6, 2.5, rn(i, 4) * 3, 0, 7); g.fill(); } });
  return <Estudio t={tt} cam={[0.4, 1.9, 2.6]} look={[0.2, 0.3, 0]} orbit={0.12}>
    <group rotation={[0.35, 0, 0]}><Cazuela s={0.95}>
      <mesh position={[0, 0.02 + 0.6 * lift, 0.3 * lift]} rotation={[-P2 + 0.5 * lift, 0, 0]}><circleGeometry args={[0.62, 48, 0, 2 * P * (0.3 + 0.7 * sc)]} /><meshPhysicalMaterial map={cost} roughness={0.5} clearcoat={0.5} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.015, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.62, 48, 2 * P * (0.3 + 0.7 * sc), 2 * P * (0.7 - 0.7 * sc) + 0.001]} /><meshStandardMaterial map={cost} roughness={0.7} /></mesh>
    </Cazuela></group>
    <group position={[0.6 * Math.cos(sc * 5), 0.4 + 0.5 * lift, 0.6 * Math.sin(sc * 5)]} rotation={[-0.9, sc * 5, 0]}>
      <mesh scale={[0.16, 0.035, 0.24]}><sphereGeometry args={[1, 24, 12]} />{M.madera("#c08a52")}</mesh>
      <mesh position={[0, 0, 0.78]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.03, 0.035, 1.2, 12]} />{M.madera("#b07a48")}</mesh></group>
  </Estudio>;
}}</Stage>;

// ── 20 · PORCIÓN: media taza cruda por persona: cuatro platos y cuatro medias tazas que se vacían en la cazuela, ni un grano de más
const HPorcion: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  return <Estudio t={tt} cam={[0, 2.4, 3.2]} look={[0, 0.3, 0]} orbit={0.12}>
    <Cazuela s={0.75}><Granos pts={monton(Math.round(320 * cl((tt - 1.2) / 4.4)), 0.55, 0.06, 0.05, 37)} c="#fbf8f0" /></Cazuela>
    {[0, 1, 2, 3].map((i) => { const a = (i / 4) * 2 * P + P / 4, home: V3 = [Math.cos(a) * 1.6, 0, Math.sin(a) * 1.1], at = 1.0 + i * 1.1, k = eio(tt, at, at + 0.4), tip = cl((tt - at - 0.4) * 3) * (1 - cl((tt - at - 0.9) * 3)), back = eio(tt, at + 0.9, at + 1.2);
      const p = arco(home, [Math.cos(a) * 0.5, 0.85, Math.sin(a) * 0.35], k * (1 - back), 0.2);
      return <group key={i}>
        <Plato p={[home[0], 0.02, home[2]]} s={0.9} c="#efe6d2" />
        <group position={[p[0], p[1] + 0.06, p[2]]} rotation={[0, -a, tip * 1.8]}>
          <mesh geometry={lathe([[0, 0], [0.12, 0], [0.16, 0.18]], 28)} castShadow>{M.cromo()}</mesh>
          {back < 0.5 && tip < 0.4 && <Granos pts={monton(40, 0.12, 0.13, 0.04, 39 + i)} c="#fbf8f0" />}
        </group>
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 21 · GOTAS (recalentado): el arroz frío y apelmazado en el sartén recibe un chorrito de agua, se tapa, el vapor lo afloja y vuelve a esponjar
const HGotasE: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const pour = cl((tt - 0.8) * 3) * (1 - cl((tt - 1.8) * 3)), lid = eio(tt, 2.0, 2.6) * (1 - eio(tt, 4.6, 5.2)), fluff = eio(tt, 4.6, 5.6);
  return <Estudio t={tt} cam={[0.3, 1.8, 2.6]} look={[0, 0.3, 0]} orbit={0.12} fov={32}>
    <Llama p={[0, -0.08, 0]} f={0.25} t={tt} r={0.45} />
    <mesh geometry={lathe([[0, 0], [0.82, 0], [0.94, 0.16], [0.98, 0.2]], 64)} castShadow receiveShadow><meshStandardMaterial color="#1c1a19" roughness={0.42} metalness={0.65} side={THREE.DoubleSide} /></mesh>
    <Granos pts={monton(420, 0.75, 0.05, 0.08 + 0.12 * fluff, 41)} c="#f2b088" s={1} />
    {pour > 0.01 && <Chorro t={tt} a={[-0.6, 1.4, 0]} b={[-0.1, 0.12, 0]} r={0.02 * pour} c="#cfe6ee" o={0.5} />}
    <group position={[0, 0.25 + 1.2 * (1 - lid), 0]} visible={lid > 0.01}><mesh castShadow><cylinderGeometry args={[0.98, 1.0, 0.05, 48]} />{M.vidrio()}</mesh><mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.06, 12, 8]} /><meshStandardMaterial color="#1a1a1a" /></mesh></group>
    <Vapor t={tt} p={[0, 0.2, 0]} o={0.4 * cl((tt - 2.4) * 1.5) * (1 - cl((tt - 5.4) * 2))} h={0.6} s={0.25} spread={0.6} n={10} />
  </Estudio>;
}}</Stage>;

// ── 22 · REFRI: el reloj de pared marca la cuenta de dos horas y el tóper con arroz entra al refri antes de que la aguja llegue (la luz fría lo recibe)
const HRefri: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const sp = cl((tt - 0.6) / 4.2), go = eio(tt, 3.6, 4.6), door = eio(tt, 3.0, 3.6) * (1 - eio(tt, 5.0, 5.8));
  return <Estudio t={tt} cam={[0.4, 1.4, 3.6]} look={[0.3, 0.9, 0]} orbit={0.1}>
    <group position={[1.0, 0, -0.5]}>
      <RBox p={[0, 0.95, -0.4]} s={[1.2, 1.9, 0.06]} r={0.02}><meshStandardMaterial color="#e8eef2" roughness={0.4} /></RBox>
      {[-0.55, 0.55].map((x) => <RBox key={x} p={[x, 0.95, 0]} s={[0.06, 1.9, 0.8]} r={0.02}><meshStandardMaterial color="#e8eef2" roughness={0.4} /></RBox>)}
      {[0.5, 1.0, 1.5].map((y) => <RBox key={y} p={[0, y, 0]} s={[1.05, 0.02, 0.75]} r={0.005}>{M.vidrio()}</RBox>)}
      <pointLight position={[0, 1.4, 0.2]} intensity={2 * door + 0.4} distance={2} color="#d8ecff" />
      <group position={[-0.58, 0.95, 0.4]} rotation={[0, -1.9 * door, 0]}><RBox p={[0.6, 0, 0]} s={[1.2, 1.9, 0.08]} r={0.03}><meshStandardMaterial color="#d84a3a" roughness={0.3} /></RBox></group>
    </group>
    <group position={arco([-0.6, 0.35, 0.4], [1.0, 1.04, -0.5], go, 0.3)}>
      <RBox s={[0.5, 0.18, 0.36]} r={0.03}><meshPhysicalMaterial color="#f0f4f8" roughness={0.2} transmission={0.6} thickness={0.2} /></RBox>
      <RBox p={[0, 0.1, 0]} s={[0.52, 0.03, 0.38]} r={0.01}><meshStandardMaterial color="#2a6ab0" roughness={0.4} /></RBox>
      <Granos pts={monton(60, 0.16, 0.02, 0.06, 43).map(([x, y, z, r]) => [x * 1.4, y, z, r])} c="#f2b088" />
    </group>
    <group position={[-1.1, 1.5, -0.9]}>
      <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.36, 0.36, 0.06, 40]} /><meshStandardMaterial color="#f7f3ea" /></mesh>
      <mesh position={[0, 0, 0.035]}><ringGeometry args={[0.0, 0.32, 40, 1, P2 - 2 * P * sp * (2 / 12), 2 * P * sp * (2 / 12) + 0.001]} /><meshBasicMaterial color="#f0c060" transparent opacity={0.6} /></mesh>
      <mesh position={[0, 0, 0.04]} rotation={[0, 0, -2 * P * sp * (2 / 12)]}><boxGeometry args={[0.025, 0.26, 0.01]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.cos((i / 12) * 2 * P) * 0.29, Math.sin((i / 12) * 2 * P) * 0.29, 0.034]}><boxGeometry args={[0.012, 0.04, 0.002]} /><meshBasicMaterial color="#2a1a10" /></mesh>)}
    </group>
  </Estudio>;
}}</Stage>;

// ── 23 · BOLSITAS: el arroz entra a la bolsa, la mano de rodillo la aplasta plana y las bolsitas se apilan como libros en el congelador (con escarcha)
const HBolsitas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const fr = eio(tt, 3.8, 5.6);
  return <Estudio t={tt} cam={[0.2, 1.7, 3.0]} look={[0, 0.4, 0]} orbit={0.12}>
    <pointLight position={[0, 1.4, 1.0]} intensity={2.2 * fr} distance={3.5} color="#b8dcff" />
    {[0, 1, 2, 3].map((i) => { const a = 0.6 + i * 0.75, fl = eio(tt, a, a + 0.5), drop = fall(tt, a + 0.5, 0.9);
      return <group key={i} position={[0, 0.08 + i * 0.09 + (tt < a + 0.5 ? 0.8 : drop), 0]} rotation={[0, (rn(i, 1) - 0.5) * 0.2, 0]}>
        <RBox s={[1.3, 0.06 + 0.22 * (1 - fl), 0.9]} r={0.03}><meshPhysicalMaterial color="#f8fbff" roughness={0.15} transmission={0.7} thickness={0.2} transparent opacity={0.6} /></RBox>
        <RBox p={[0, 0, 0]} s={[1.2, 0.04 + 0.2 * (1 - fl), 0.8]} r={0.03}><meshStandardMaterial color={["#f2b088", "#fbf8f0", "#8ac06a", "#f2b088"][i]} roughness={0.8} /></RBox>
        <RBox p={[0, 0, -0.44]} s={[1.32, 0.07, 0.03]} r={0.01}><meshStandardMaterial color="#2a6ab0" /></RBox>
      </group>; })}
    {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.3, 0.4 + rn(i, 2) * 0.05, (rn(i, 3) - 0.5) * 0.9]} scale={0.012 * fr}><octahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#ffffff" emissive="#dff2ff" emissiveIntensity={0.5} /></mesh>)}
  </Estudio>;
}}</Stage>;

// ── 24 · HUEVO: en los últimos minutos los huevos se acomodan encima del arroz, se tapa y salen con la yema cremosa (uno se parte a la mitad)
const HHuevo: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const cut = eio(tt, 3.6, 4.6);
  return <Estudio t={tt} cam={[0.2, 1.8, 2.4]} look={[0, 0.35, 0]} orbit={0.12} fov={32}>
    <Cazuela s={0.95}><Granos pts={monton(420, 0.82, 0.28, 0.1, 45)} c="#f2b088" />
      {[0, 1, 2, 3].map((i) => { const a = (i / 4) * 6.28 + 0.4, d = fall(tt, 0.6 + i * 0.4, 1.2), half = i === 0 ? cut : 0;
        return <group key={i} position={[Math.cos(a) * 0.45, 0.42 + d, Math.sin(a) * 0.45]} rotation={[0, a, 0]}>
          {[-1, 1].map((sg) => <group key={sg} position={[0, 0, sg * 0.04 * half]} rotation={[sg * 0.6 * half, 0, 0]}>
            <mesh scale={[0.12, 0.09, 0.09]} castShadow><sphereGeometry args={[1, 24, 16, 0, P, 0, P]} /><meshPhysicalMaterial color={half > 0 ? "#fbf8f0" : "#e8c8a0"} roughness={0.4} side={THREE.DoubleSide} /></mesh>
            {half > 0 && <mesh position={[0, 0, 0.001 * sg]} rotation={[sg > 0 ? 0 : P, 0, 0]} scale={[0.07, 0.055, 1]}><circleGeometry args={[1, 24]} /><meshPhysicalMaterial color="#f0a020" roughness={0.2} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>}
          </group>)}
        </group>; })}
    </Cazuela>
    <Vapor t={tt} p={[0, 0.5, 0]} o={0.3} h={0.8} s={0.25} spread={0.7} n={10} />
  </Estudio>;
}}</Stage>;

// ── 25 · NOTAS (preguntas): notitas pegadas en la tapa del refri con imanes; cada una baja, se pega, y debajo se escribe la respuesta a mano
const HNotas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), 0);
  return <Estudio t={tt} cam={[0, 1.25, 3.2]} look={[0, 1.1, -0.6]} orbit={0.06}>
    <RBox p={[0, 1.15, -0.9]} s={[3.4, 2.2, 0.08]} r={0.06}><meshStandardMaterial color="#e8eef2" roughness={0.35} /></RBox>
    {S.slice(Math.max(0, cur - 1), cur + 1).map((s, j) => { const i = Math.max(0, cur - 1) + j, [q, r] = s.tx.split("|"), a = s.a - h.at, k = ent(tt, a), w = cl((tt - a - 1.2) / 1.2), x = j === 0 && cur > 0 ? -0.82 : (cur > 0 ? 0.82 : 0);
      return <group key={i} position={[x, 1.15 + (1 - k) * 1.5, -0.84]} rotation={[0, 0, (i % 2 ? 1 : -1) * 0.035]}>
        <mesh position={[0, 0.4, 0]} castShadow><planeGeometry args={[1.45, 0.66]} /><meshStandardMaterial map={papel("nq" + i, wrap(q), { w: 1024, h: 466, size: 86, bg: "#fff4a8" })} roughness={0.9} /></mesh>
        <mesh position={[0, 0.74, 0.03]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.04, 20]} /><meshStandardMaterial color={["#c0392b", "#2a6ab0", "#3aa03a", "#e8a020", "#8a3ab0"][i % 5]} roughness={0.3} /></mesh>
        <mesh position={[0, -0.34, 0]} scale={[Math.max(0.001, w), 1, 1]} castShadow><planeGeometry args={[1.45, 0.62]} /><meshStandardMaterial map={papel("nr" + i, wrap(r ?? ""), { w: 1024, h: 438, size: 92, bg: "#f7f3ea", ink: "#1e2a4a" })} roughness={0.9} /></mesh>
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 26 · FRASCOS («nunca hacía»): cada "nunca" queda encerrado en un frasco de vidrio que baja, se tapa y se va a la repisa alta (guardado, no se usa)
const NuncaE: React.FC<{ i: number; tt: number }> = ({ i, tt }) => {
  if (i === 0) return <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.18, 0.18, 0.4, 24]} />{M.liquido("#cfe6ee", 0.5)}</mesh>;
  if (i === 1) return <Tapa p={[0, 0.2, 0]} rot={[0.5, 0, 0]} r={0.24} />;
  if (i === 2) return <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.02, 0.025, 0.5, 10]} />{M.madera("#b07a48")}</mesh>;
  if (i === 3) return <mesh position={[0, 0.15, 0]} geometry={lathe([[0, 0], [0.18, 0], [0.2, 0.22]], 28)}><meshStandardMaterial color="#f4f4f0" roughness={0.3} metalness={0.2} side={THREE.DoubleSide} /></mesh>;
  if (i === 4) return <><mesh position={[0, 0.25, 0]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.16, 0.16, 0.06, 24]} /><meshStandardMaterial color="#f7f3ea" /></mesh><mesh position={[0, 0.25, 0.035]} rotation={[0, 0, tt * 3]}><boxGeometry args={[0.012, 0.13, 0.005]} /><meshStandardMaterial color="#111" /></mesh></>;
  return <Vapor t={tt} p={[0, 0.1, 0]} o={0.5} h={0.4} s={0.12} spread={0.08} n={6} />;
};
const HFrascos: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[];
  return <Estudio t={tt} cam={[0, 1.4, 3.6]} look={[0, 0.8, 0]} orbit={0.08}>
    <RBox p={[0, 1.6, -0.6]} s={[3.6, 0.06, 0.5]} r={0.02}>{M.madera("#6a4428")}</RBox>
    {E.map((e, i) => { const a = i === 0 ? -0.5 : e.a - h.at, nx = E[i + 1] ? E[i + 1].a - h.at : 1e9, k = ent(tt, a), lid = eio(tt, a + 0.9, a + 1.3), shelf = eio(tt, nx, nx + 0.8), done = tt > nx + 0.8;
      if (tt < a - 0.3) return null;
      const home: V3 = [-1.5 + i * 0.6, 1.63, -0.6], p: V3 = done ? home : arco([0, 0.1 + (1 - k) * 1.3, 0.3], home, shelf, 0.4);
      return <group key={i} position={p} scale={done ? 0.55 : lerp(1, 0.55, shelf)}>
        <NuncaE i={i} tt={tt} />
        <mesh geometry={lathe([[0, 0], [0.26, 0], [0.3, 0.05], [0.3, 0.6], [0.24, 0.66], [0.23, 0.72]], 32)} castShadow>{M.vidrio()}</mesh>
        <mesh position={[0, 0.74 + 0.6 * (1 - lid), 0]}><cylinderGeometry args={[0.25, 0.25, 0.07, 28]} />{M.cromo("#b8962e")}</mesh>
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 27 · REMOLINO (arroz con leche): la raja de canela hierve sola primero, el agua se pone ámbar; luego entra la leche en remolino
const HRemolino: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const amb = eio(tt, 0.8, 2.8), milk = eio(tt, 3.0, 5.4), pour = cl((tt - 3.0) * 3) * (1 - cl((tt - 5.0) * 3)), sw = tt * 1.6;
  return <Estudio t={tt} cam={[0.2, 2.0, 2.4]} look={[0, 0.35, 0]} orbit={0.1} fov={32}>
    <Llama p={[0, -0.08, 0]} f={0.45} t={tt} r={0.45} />
    <Olla s={1.0} nivel={0.6} caldo={"#" + new THREE.Color("#e0eef2").lerp(new THREE.Color("#c88a3a"), amb).lerp(new THREE.Color("#f6efe0"), milk).getHexString()} t={tt} hervor={0.5} mat="peltre">
      <mesh position={[0.1, 0.5, 0]} rotation={[0, sw * 0.3, P2]}><cylinderGeometry args={[0.05, 0.05, 0.5, 14, 1, true, 0, 5]} /><meshStandardMaterial color="#a0582a" roughness={0.85} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 36 }, (_, i) => { const u = i / 36, a = sw + u * 9, r = 0.05 + u * 0.55; return <mesh key={i} position={[Math.cos(a) * r, 0.47, Math.sin(a) * r]} rotation={[-P2, 0, -a]} scale={[0.06 * milk, 0.025 * milk, 1]} visible={milk > 0.02 && milk < 0.98}><circleGeometry args={[1, 12]} /><meshBasicMaterial color="#fbf8f0" transparent opacity={0.85} /></mesh>; })}
    </Olla>
    {pour > 0.01 && <Chorro t={tt} a={[-0.7, 1.4, 0]} b={[-0.2, 0.5, 0]} r={0.05 * pour} c="#fbf8f0" o={0.95} />}
    <Vapor t={tt} p={[0, 0.6, 0]} o={0.3} h={0.8} s={0.25} spread={0.5} n={10} />
  </Estudio>;
}}</Stage>;

// ── 28 · ETIQUETAS (la cuenta contra la fonda): el plato de la fonda con su ticket largo, y el plato de la casa con su ticket corto; las monedas caen en cada uno
const HEtiquetas: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const t1 = eio(tt, 0.8, 1.8), t2 = eio(tt, 2.2, 3.0);
  return <Estudio t={tt} cam={[0, 1.6, 3.4]} look={[0, 0.4, 0]} orbit={0.12}>
    {[-1, 1].map((sg, i) => <group key={i} position={[sg * 0.85, 0, 0]}>
      <Plato p={[0, 0.02, 0]} s={1.25} c="#efe6d2"><Granos pts={monton(160, 0.3, 0.06, 0.08, 47 + i)} c="#f2b088" /></Plato>
      <mesh position={[0.05, 0.5 + (i ? 0 : 0.25), -0.55]} rotation={[-0.2, 0, sg * 0.05]} scale={[1, i ? t2 : t1, 1]}><planeGeometry args={[0.7, i ? 0.55 : 1.05]} /><meshStandardMaterial map={papel("tk" + i, i ? ["en casa", "", "$12"] : ["fonda", "", "plato $65", "propina", "", "$75"], { w: 512, h: i ? 400 : 768, size: 72, bg: "#fbf8ef" })} roughness={0.9} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: i ? 3 : 12 }, (_, j) => <mesh key={j} position={[0.55, 0.06 + j * 0.035 + fall(tt, (i ? 3.2 : 1.9) + j * 0.12, 0.9), 0.3]} rotation={[0, rn(j, 1) * 6, 0]} castShadow><cylinderGeometry args={[0.12, 0.12, 0.03, 24]} />{M.cromo(j % 3 ? "#c8a040" : "#b8b8c0")}</mesh>)}
    </group>)}
  </Estudio>;
}}</Stage>;

// miniaturas del repaso: un objeto por truco (en ciclo), nada de texto
const MiniE: React.FC<{ i: number; tt: number }> = ({ i, tt }) => { const j = i % 12;
  if (j === 0) return <group>{Array.from({ length: 14 }, (_, q) => <mesh key={q} position={[(rn(q, 1) - 0.5) * 0.3, 0.03 + 0.05 * rn(q, 2), (rn(q, 3) - 0.5) * 0.3]} rotation={[0, rn(q, 4) * 6, P2]} scale={[0.02, 0.07, 0.02]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#f6f0e0" roughness={0.5} /></mesh>)}</group>;
  if (j === 1) return <Olla s={0.3} nivel={0.6} caldo="#cfe6ee" t={tt} />;
  if (j === 2) return <mesh scale={[0.2, 0.18, 0.2]}><sphereGeometry args={[1, 24, 16]} /><meshPhysicalMaterial color="#c8321e" roughness={0.25} clearcoat={1} /></mesh>;
  if (j === 3) return <Llama p={[0, 0, 0]} f={0.5} t={tt} r={0.18} />;
  if (j === 4) return <group><mesh><cylinderGeometry args={[0.28, 0.28, 0.03, 28]} />{M.cromo()}</mesh><mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.04, 12, 8]} /><meshStandardMaterial color="#1a1a1a" /></mesh></group>;
  if (j === 5) return <group rotation={[0, 0, 0.6]}><mesh><boxGeometry args={[0.04, 0.5, 0.02]} />{M.madera("#a8784a")}</mesh><mesh position={[0, 0.3, 0]} scale={[1, 1.3, 0.4]}><sphereGeometry args={[0.07, 14, 10]} />{M.madera("#b07a48")}</mesh></group>;
  if (j === 6) return <group>{[0, 1, 2].map((q) => <mesh key={q} position={[(q - 1) * 0.1, 0.05, 0]}><sphereGeometry args={[0.05, 12, 8]} /><meshStandardMaterial color={["#e8742a", "#5aa040", "#f2c83a"][q]} /></mesh>)}</group>;
  if (j === 7) return <mesh scale={[0.18, 0.12, 0.13]}><sphereGeometry args={[1, 20, 14]} /><meshPhysicalMaterial color="#fbf6ea" roughness={0.3} clearcoat={0.6} /></mesh>;
  if (j === 8) return <group><mesh scale={[0.14, 0.12, 0.14]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#f2ead8" roughness={0.6} /></mesh><mesh position={[0, 0.13, 0]} scale={[0.02, 0.06, 0.02]}><coneGeometry args={[1, 1, 8]} /><meshStandardMaterial color="#c8b088" /></mesh></group>;
  if (j === 9) return <group>{[0, 1, 2].map((q) => <mesh key={q} position={[0, q * 0.06, 0]}><boxGeometry args={[0.36, 0.05, 0.26]} /><meshPhysicalMaterial color="#e8f2f8" roughness={0.15} transparent opacity={0.7} /></mesh>)}</group>;
  if (j === 10) return <group rotation={[0, 0, P2]}><mesh><cylinderGeometry args={[0.035, 0.035, 0.45, 12]} /><meshStandardMaterial color="#8a4a22" roughness={0.9} /></mesh></group>;
  return <mesh scale={[0.12, 0.16, 0.12]}><sphereGeometry args={[1, 20, 14]} /><meshPhysicalMaterial color="#d8a040" roughness={0.3} clearcoat={0.6} /></mesh>;
};
// ── 29 · RUEDA (repaso de 24): la rueda de la lotería de cocina gira: cada truco es una casilla con su granito; la aguja de madera se detiene en el nombrado
const HRueda: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], N = Math.max(1, S.length), cur = S.reduce((c, e, i) => (t >= e.a ? i : c), 0), k = cl(phys(t, S[cur]?.a ?? 0, 7, 0.4));
  const ang = -((cur - 1 + k) / N) * 2 * P;
  return <Estudio t={tt} cam={[0, 1.2, 3.6]} look={[0, 1.1, 0]} orbit={0.05}>
    <group position={[0, 1.2, -0.3]} rotation={[0, 0, ang]}>
      <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[1.25, 1.25, 0.08, 64]} />{M.madera("#a8784a")}</mesh>
      {S.map((s, i) => { const a = (i / N) * 2 * P + P2; return <group key={i} position={[Math.cos(a) * 1.0, Math.sin(a) * 1.0, 0.05]} rotation={[0, 0, a - P2]}>
        <mesh><circleGeometry args={[0.15, 24]} /><meshStandardMaterial color={i === cur ? "#e0902e" : i < cur ? "#c8a060" : "#f2e6cc"} emissive="#ffb050" emissiveIntensity={i === cur ? 0.5 * k : 0} /></mesh>
        {i !== cur && <group position={[0, 0, 0.06]} scale={0.32}><MiniE i={i} tt={tt} /></group>}</group>; })}
    </group>
    <mesh position={[0, 2.5, -0.2]} rotation={[0, 0, P]}><coneGeometry args={[0.08, 0.26, 4]} />{M.madera("#6a4428")}</mesh>
    {S[cur] && <group position={[0, 0.55 + 0.05 * Math.sin(tt * 2), 0.9]} rotation={[0.2, tt * 0.8, 0]} scale={0.001 + 1.1 * k}><MiniE i={cur} tt={tt} /></group>}
  </Estudio>;
}}</Stage>;

// ── 30 · AJOFLOR (el ajo que avisa): el diente de ajo flota en el aceite; cuando se dora, ése es el aviso: el aceite está listo y el arroz entra
const HAjoFlor: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const g = eio(tt, 0.8, 3.2), rice = fall(tt, 3.8, 1.2), bub = cl((tt - 0.6) * 1.5);
  return <Estudio t={tt} cam={[0.2, 1.4, 2.0]} look={[0, 0.2, 0]} orbit={0.1} fov={30}>
    <Llama p={[0, -0.08, 0]} f={0.5} t={tt} r={0.45} />
    <Cazuela s={0.9}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.7, 0.62, 0.05, 48]} /><meshPhysicalMaterial color="#e8b850" roughness={0.02} clearcoat={1} transparent opacity={0.75} /></mesh>
      <group position={[0, 0.1 + 0.01 * Math.sin(tt * 5), 0]} rotation={[0.3, tt * 0.4, P2 * 0.8]}>
        <mesh scale={[0.09, 0.15, 0.08]} castShadow><sphereGeometry args={[1, 20, 14]} /><meshPhysicalMaterial color={"#" + new THREE.Color("#f4ece0").lerp(new THREE.Color("#c8862a"), g).getHexString()} roughness={0.4} clearcoat={0.6} /></mesh></group>
      {Array.from({ length: 18 }, (_, i) => { const k = (tt * 2.6 + rn(i, 1)) % 1, a = (i / 18) * 6.28; return <mesh key={i} position={[Math.cos(a) * 0.17, 0.1, Math.sin(a) * 0.17]} scale={0.001 + 0.02 * bub * Math.sin(k * P)}><sphereGeometry args={[1, 8, 6]} /><meshPhysicalMaterial color="#fff2c0" roughness={0} transparent opacity={0.7} /></mesh>; })}
      {tt > 3.6 && <Granos pts={monton(300, 0.6, 0.08 + Math.max(0, rice), 0.06, 49)} c="#e8e2d0" />}
    </Cazuela>
    <pointLight position={[0, 0.8, 0.5]} intensity={0.01 + 2.5 * cl((tt - 3.0) * 2) * (1 - cl((tt - 3.9) * 2))} distance={1.8} color="#ffcf70" />
  </Estudio>;
}}</Stage>;

export const MAP3: Record<string, C> = { regla: HRegla, lavado: HLavado, seco: HSeco, perla: HPerla, probeta: HProbeta, jitomate: HJitomate, hervor: HHervor, sal: HSal,
  tapa: HTapa, perilla: HPerillaE, hielo: HHielo, ollaserror: HOllasError, reposo: HReposoE, tenedor: HTenedor, paleta: HPaleta, cebolla: HCebolla, dados: HDados,
  tren: HTren, pegadito: HPegadito, porcion: HPorcion, gotas: HGotasE, refri: HRefri, bolsitas: HBolsitas, huevo: HHuevo, notas: HNotas, frascos: HFrascos,
  remolino: HRemolino, etiquetas: HEtiquetas, rueda: HRueda, ajoflor: HAjoFlor };
void Yute;
