// lou29c · componentes 3D de los desayunos de Frank (1960): utilería simple que HACE lo que Lou dice en ese segundo; la comida
// va como foto real adentro de la loza. Ninguno repite un componente de lou29a ni de lou29b.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { preload, G, Label3, Plate, Pot, Pour, Sheet, Skillet, Std, Steam3, Tool, ez, lerp, rnd, sp, useTex, useFoodTex, V3 } from "./props3d";
import { R3, Cap, drop } from "./lou_r3a";
import { FONT } from "./lib";

preload(["lc_n15a", "lc_n14a", "lc_n13a", "lc_n12a", "lc_n11a", "lc_n10a", "lc_n09a", "lc_n08a", "lc_n07a", "lc_n06a", "lc_n05a", "lc_n04a", "lc_n03a", "lc_n02a", "lc_n01a"]);
type P = { t: number; h: H };
const steel = new THREE.MeshStandardMaterial({ color: "#d9dde2", metalness: 1, roughness: 0.22 });
const iron = new THREE.MeshStandardMaterial({ color: "#26262a", metalness: 0.7, roughness: 0.45 });
const glass = new THREE.MeshPhysicalMaterial({ color: "#eef6f4", roughness: 0.04, transparent: true, opacity: 0.25, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false });
const brass = new THREE.MeshStandardMaterial({ color: "#c9a24a", metalness: 1, roughness: 0.28 });
const wood = new THREE.MeshStandardMaterial({ color: "#8a5a32", roughness: 0.62 });
const BOWL = new THREE.LatheGeometry(([[0.001, 0], [0.2, 0], [0.32, 0.06], [0.42, 0.2], [0.44, 0.24], [0.425, 0.24], [0.4, 0.2], [0.3, 0.075], [0.19, 0.02], [0.001, 0.02]] as [number, number][]).map(([r, y]) => new THREE.Vector2(r, y)), 64);
const CAM: { p: V3; l: V3; fov: number } = { p: [0, 1.5, 2.4], l: [0, 0.3, 0], fov: 34 };
const k0 = (tt: number, a: number, w = 8, z = 0.42) => sp(tt, a, w, z);
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), k).getStyle();
const Tex: React.FC<{ id: string; w: number; h: number; draw: (g: CanvasRenderingContext2D, w: number, h: number) => void; children: (t: THREE.Texture | null) => React.ReactNode }> = ({ id, w, h, draw, children }) => <>{children(useTex(id, w, h, draw))}</>;
const FoodMesh: React.FC<{ tex: string; c?: string; cc?: number; children: React.ReactNode; p?: V3; r?: V3; s?: V3 | number }> = ({ tex, c = "#ffffff", cc = 0.2, children, p, r, s }) => {
  const ft = useFoodTex(tex);
  return <G p={p} r={r} s={s}><mesh castShadow>{children}<meshPhysicalMaterial key={ft ? "t" : "n"} map={ft ?? undefined} color={c} roughness={0.7} clearcoat={cc} /></mesh></G>;
};
const Bowl: React.FC<{ p?: V3; s?: number; fill: string; lvl?: number; mat?: THREE.Material }> = ({ p, s = 1, fill, lvl = 0.15, mat }) => <G p={p} s={s}>
  <mesh geometry={BOWL} castShadow>{mat ? <primitive object={mat} attach="material" /> : <meshPhysicalMaterial color="#f4f1ea" roughness={0.25} clearcoat={1} side={THREE.DoubleSide} />}</mesh>
  <mesh position={[0, lvl, 0]}><cylinderGeometry args={[0.24 + lvl * 0.8, 0.22, 0.01, 48]} /><Std c={fill} r={0.4} cc={0.6} /></mesh>
</G>;

// c00 · 5:40 de la mañana: el silbato de la acería larga vapor y avisa el cambio de turno
export const RMillWhistle: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} top="steel" cam={{ p: [0, 1.25, 3.0], l: [0, 1.2, 0], fov: 34 }} cam2={{ p: [0.1, 1.25, 2.6], l: [0, 1.3, 0], fov: 32 }} f={(tt) => {
  const blow = ez(tt, 1.4, 1.8) * (1 - ez(tt, 4.6, 5.4));
  return <G s={1.7}>
    <mesh position={[0, 0.3, 0]} material={steel} castShadow><cylinderGeometry args={[0.05, 0.05, 0.6, 24]} /></mesh>
    <mesh position={[0, 0.65, 0]} material={brass} castShadow><cylinderGeometry args={[0.12, 0.1, 0.12, 40]} /></mesh>
    <mesh position={[0, 0.92, 0]} material={brass} castShadow><cylinderGeometry args={[0.1, 0.1, 0.42, 40]} /></mesh>
    <mesh position={[0, 1.15, 0]} material={brass}><sphereGeometry args={[0.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
    {[...Array(8)].map((_, i) => <mesh key={i} position={[0, 0.78, 0]} rotation-y={(i / 8) * Math.PI * 2}><boxGeometry args={[0.22, 0.03, 0.01]} /><Std c="#2a2016" /></mesh>)}
    {blow > 0.01 && [...Array(16)].map((_, i) => { const ph = (tt * 0.5 + i / 16) % 1, a = (i / 16) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * (0.12 + ph * 0.5), 0.8 + ph * 0.9, Math.sin(a) * (0.12 + ph * 0.4)]} scale={0.6 + ph * 2.2}><sphereGeometry args={[0.07, 16, 10]} /><meshBasicMaterial color="#fffaf2" transparent opacity={blow * 0.55 * Math.sin(ph * Math.PI)} depthWrite={false} /></mesh>; })}
  </G>;
}} over={(tt) => <Cap tt={tt} at={1.6} x={1450} y={170} txt="SHIFT AT 6" col="#e4b23a" />} />;

// c01 · la avena de diez centavos: el azúcar negra al medio y la crema fría que hace un FOSO alrededor
export const RCreamMoat: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.9, 1.55], l: [0, 0.2, 0], fov: 34 }} cam2={{ p: [0.05, 1.7, 1.3], l: [0, 0.22, 0], fov: 32 }} f={(tt) => {
  const sug = drop(tt, 0.8, 0.8), moat = ez(tt, 1.8, 4.2), pour = tt > 1.7 && tt < 4.3;
  return <>
    <G s={1.8}><mesh geometry={BOWL} castShadow><meshPhysicalMaterial color="#f4f1ea" roughness={0.25} clearcoat={1} side={THREE.DoubleSide} /></mesh>
      <FoodMesh tex="dough" c="#e8d3a4" p={[0, 0.17, 0]}><cylinderGeometry args={[0.36, 0.3, 0.02, 48]} /></FoodMesh>
      {sug.on && <G p={[0, 0.19 + sug.y, 0]} s={[1, sug.sq, 1]}><FoodMesh tex="dough" c="#a8692e"><sphereGeometry args={[0.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /></FoodMesh></G>}
      {moat > 0.01 && <mesh position={[0, 0.185, 0]} rotation-x={-Math.PI / 2}><ringGeometry args={[0.22, 0.37, 64, 1, -Math.PI / 2, Math.PI * 2 * moat]} /><meshPhysicalMaterial color="#fffdf6" roughness={0.08} clearcoat={1} /></mesh>}
    </G>
    {pour && <><G p={[0.35 * Math.cos(-Math.PI / 2 + moat * Math.PI * 2) + 0.05, 0.75, 0.35 * Math.sin(-Math.PI / 2 + moat * Math.PI * 2)]} r={[0, 0, 0.9]}><mesh castShadow><cylinderGeometry args={[0.06, 0.07, 0.18, 32]} /><meshPhysicalMaterial color="#f4f1ea" roughness={0.25} clearcoat={1} /></mesh></G>
      <Pour x={0.4 * Math.cos(-Math.PI / 2 + moat * Math.PI * 2)} z={0.4 * Math.sin(-Math.PI / 2 + moat * Math.PI * 2)} y0={0.68} y1={0.25} c="#fffdf6" w={0.012} /></>}
  </>;
}} over={(tt) => <Cap tt={tt} at={2.4} x={1460} y={170} txt="CREAM MOAT" col="#e8d3a4" />} />;

// c02 · masa de panqueques con grumos: el batidor baja… y se frena. Los grumos se quedan
export const RLumps: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.7, 1.6], l: [0, 0.15, 0], fov: 34 }} cam2={{ p: [0.05, 1.45, 1.25], l: [0, 0.15, 0], fov: 32 }} f={(tt) => {
  const dn = ez(tt, 0.8, 1.6) * (1 - ez(tt, 2.6, 3.4)), x = drop(tt, 2.8, 1.0);
  return <>
    <G s={1.35}><mesh geometry={BOWL} castShadow><meshPhysicalMaterial color="#f4f1ea" roughness={0.25} clearcoat={1} side={THREE.DoubleSide} /></mesh>
      <FoodMesh tex="dough" c="#f2dfb0" cc={0.4} p={[0, 0.17, 0]}><cylinderGeometry args={[0.36, 0.3, 0.02, 48]} /></FoodMesh>
      {[...Array(18)].map((_, i) => { const a = rnd(i, 1) * 6.28, r = 0.3 * Math.sqrt(rnd(i, 2)); return <mesh key={i} position={[Math.cos(a) * r, 0.18, Math.sin(a) * r]} scale={[1, 0.6, 1]} castShadow><sphereGeometry args={[0.018 + 0.015 * rnd(i, 3), 12, 8]} /><Std c="#f7ecd0" r={0.8} /></mesh>; })}
    </G>
    <G p={[0.05, 0.55 - 0.3 * dn, 0]} r={[0, tt * 0.5, 0]}>
      <mesh position={[0, 0.35, 0]} material={steel}><cylinderGeometry args={[0.018, 0.018, 0.4, 12]} /></mesh>
      {[...Array(6)].map((_, i) => <mesh key={i} position={[0, 0.08, 0]} rotation-y={(i / 6) * Math.PI} scale={[1, 1.9, 1]} material={steel}><torusGeometry args={[0.07, 0.004, 6, 32]} /></mesh>)}
    </G>
  </>;
}} over={(tt) => <Cap tt={tt} at={3.0} x={1440} y={170} txt="LEAVE THE LUMPS" col="#f2dfb0" />} />;

// c03 · el sándwich de huevo para la vianda: papel manteca que lo envuelve y adentro de la lunchera
export const RWaxWrap: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={CAM} cam2={{ p: [0.15, 1.3, 1.9], l: [0.1, 0.25, 0], fov: 32 }} f={(tt) => {
  const w1 = ez(tt, 1.0, 1.7), w2 = ez(tt, 1.7, 2.4), mv = ez(tt, 3.0, 4.0), lid = ez(tt, 4.0, 4.6);
  const sx = lerp(-0.35, 0.45, mv), sy = 0.06 + 0.35 * Math.sin(Math.PI * mv);
  return <>
    <mesh position={[-0.35, 0.002, 0]} rotation-x={-Math.PI / 2}><planeGeometry args={[0.8, 0.8]} /><meshPhysicalMaterial color="#f4efdd" roughness={0.3} transparent opacity={0.85} clearcoat={0.6} /></mesh>
    <G p={[sx, sy + 0.06 * mv, 0]} s={1 - 0.15 * mv}>
      <FoodMesh tex="crust" c="#f0d29a" p={[0, 0.02, 0]}><boxGeometry args={[0.36, 0.035, 0.36]} /></FoodMesh>
      <mesh position={[0, 0.045, 0]} scale={[1, 0.2, 1]}><cylinderGeometry args={[0.15, 0.16, 0.06, 40]} /><Std c="#fbf8f0" r={0.5} /></mesh>
      <mesh position={[0, 0.055, 0]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.06, 24, 12]} /><Std c="#f0a020" r={0.5} /></mesh>
      <FoodMesh tex="crust" c="#f0d29a" p={[0, 0.08, 0]}><boxGeometry args={[0.36, 0.035, 0.36]} /></FoodMesh>
      {w1 > 0.01 && <mesh position={[0, 0.1, 0.0]} rotation-x={-Math.PI / 2 + (1 - w1) * 1.6} scale={[1.05, 0.5, 1]}><planeGeometry args={[0.42, 0.42]} /><meshPhysicalMaterial color="#f4efdd" roughness={0.3} transparent opacity={0.8} side={THREE.DoubleSide} /></mesh>}
      {w2 > 0.01 && <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, (1 - w2) * 1.5]} scale={[0.5, 1.05, 1]}><planeGeometry args={[0.42, 0.42]} /><meshPhysicalMaterial color="#f4efdd" roughness={0.3} transparent opacity={0.8} side={THREE.DoubleSide} /></mesh>}
    </G>
    <G p={[0.45, 0, 0]}>
      <mesh position={[0, 0.15, 0]} material={steel} castShadow><boxGeometry args={[0.6, 0.3, 0.42]} /></mesh>
      <mesh position={[0, 0.3, -0.21]} rotation-x={-1.6 * (1 - lid)}><mesh position={[0, 0.0, 0.21]} rotation-x={0}><cylinderGeometry args={[0.21, 0.21, 0.6, 32, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#d9dde2" metalness={1} roughness={0.22} side={THREE.DoubleSide} /></mesh></mesh>
      <mesh position={[0, 0.58, 0]} material={steel} rotation-x={Math.PI / 2}><torusGeometry args={[0.09, 0.01, 8, 24, Math.PI]} /></mesh>
    </G>
  </>;
}} over={(tt) => <Cap tt={tt} at={1.4} x={480} y={170} txt="YOLK SET · WRAPPED" col="#f0a020" />} />;

// c04 · el truco del señor Schmidt: el repasador con la papa rallada se retuerce y gotea el agua
export const RTowelSqueeze: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.2, 2.3], l: [0, 0.5, 0], fov: 34 }} cam2={{ p: [0.1, 1.1, 1.85], l: [0, 0.55, 0], fov: 32 }} f={(tt) => {
  const tw = ez(tt, 0.9, 4.0), lvl = 0.05 + 0.13 * ez(tt, 1.2, 4.6);
  return <>
    <Bowl p={[0, 0, 0]} s={1.1} mat={glass} fill="#d9c9a6" lvl={lvl} />
    <G p={[0, 0.68, 0]} r={[0, tw * 6, 0]}>
      <Tex id="towelc" w={256} h={256} draw={(g, w) => { g.fillStyle = "#f3efe6"; g.fillRect(0, 0, w, w); g.fillStyle = "rgba(40,80,160,.8)"; for (let i = 0; i < 8; i++) { g.fillRect(i * 32, 0, 12, w); g.fillRect(0, i * 32, w, 12); } }}>
        {(tx) => <>
          <mesh scale={[1 - 0.25 * tw, 0.85 + 0.15 * tw, 1 - 0.25 * tw]} castShadow><sphereGeometry args={[0.2, 40, 24]} /><meshStandardMaterial key={tx ? "t" : "n"} map={tx ?? undefined} roughness={0.95} /></mesh>
          <mesh position={[0, 0.28, 0]} rotation-y={tw * 4} castShadow><coneGeometry args={[0.07, 0.25, 24, 1, true]} /><meshStandardMaterial key={tx ? "t2" : "n2"} map={tx ?? undefined} roughness={0.95} side={THREE.DoubleSide} /></mesh>
        </>}
      </Tex>
    </G>
    {tt > 1.1 && tt < 4.8 && [...Array(10)].map((_, i) => { const ph = (tt * 1.6 + i / 10) % 1; return <mesh key={i} position={[0.08 * Math.cos(i * 2.4), 0.5 - ph * 0.32, 0.08 * Math.sin(i * 2.4)]} scale={[1, 1.8, 1]}><sphereGeometry args={[0.018, 12, 8]} /><meshPhysicalMaterial color="#e8f0f4" roughness={0} transmission={0.5} transparent opacity={0.8} /></mesh>; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={2.2} x={480} y={170} txt="SQUEEZE · DRY = CRISP" col="#5a8fd0" />} />;

// c05 · las papas apiladas hierven al vapor; en UNA capa se doran
const Chunk: React.FC<{ p: V3; k: number; r?: number }> = ({ p, k, r = 0 }) => <FoodMesh tex="dough" c={col("#f3e2b6", "#c9822e", k)} cc={0.3} p={p} r={[r, r * 2, 0]}><boxGeometry args={[0.075, 0.07, 0.075]} /></FoodMesh>;
export const ROneLayer: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.85, 2.1], l: [0.1, 0.1, 0], fov: 34 }} cam2={{ p: [0.05, 1.65, 1.8], l: [0.1, 0.1, 0], fov: 32 }} f={(tt) => {
  const brown = ez(tt, 1.5, 5.0);
  return <>
    <G p={[-0.55, 0.02, 0]} r={[0, Math.PI, 0]}><Skillet rad={0.38} inside="#2a2a2a" /></G>
    <G p={[0.55, 0.02, 0]}><Skillet rad={0.38} inside="#2a2a2a" /></G>
    {[...Array(26)].map((_, i) => { const a = rnd(i, 1) * 6.28, r = 0.13 * Math.sqrt(rnd(i, 2)); const d = drop(tt, 0.3 + i * 0.03, 0.6); return d.on ? <Chunk key={"p" + i} p={[-0.55 + Math.cos(a) * r, 0.07 + Math.floor(i / 7) * 0.06 + d.y, Math.sin(a) * r]} k={0.15 * brown} r={rnd(i, 3)} /> : null; })}
    {[...Array(16)].map((_, i) => { const d = drop(tt, 0.3 + i * 0.03, 0.6); return d.on ? <Chunk key={"o" + i} p={[0.55 - 0.24 + (i % 4) * 0.16, 0.07 + d.y, -0.24 + Math.floor(i / 4) * 0.16]} k={brown} /> : null; })}
    <Steam3 tt={tt} p={[-0.55, 0.25, 0]} n={10} spread={0.3} a={2} />
  </>;
}} over={(tt) => <><Cap tt={tt} at={1.2} x={600} y={170} txt="PILED = STEAM" col="#9fb7c9" /><Cap tt={tt} at={2.4} x={1320} y={170} txt="ONE LAYER" col="#c9822e" /></>} />;

// c06 · los hígados: el reloj de arena de 3 minutos se da vuelta UNA vez (un lado, el otro)
export const RHourglass: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.15, 2.3], l: [0.2, 0.4, 0], fov: 34 }} cam2={{ p: [0.25, 1.05, 1.85], l: [0.3, 0.45, 0], fov: 32 }} f={(tt) => {
  const run1 = ez(tt, 0.6, 3.0), flip = ez(tt, 3.1, 3.7), run2 = ez(tt, 3.8, 6.5);
  const top = flip < 0.5 ? 1 - run1 : 1 - run2, bot = 1 - top;
  return <>
    <G p={[-0.45, 0.02, 0]}><Skillet rad={0.42} photo="lc_n09a" /></G>
    <G p={[0.75, 0.45, -0.5]} r={[0, 0, flip * Math.PI]}>
      {[1, -1].map((s) => <mesh key={s} position={[0, s * 0.36, 0]} material={wood} castShadow><cylinderGeometry args={[0.2, 0.2, 0.04, 40]} /></mesh>)}
      {[0, 1, 2].map((i) => <mesh key={i} position={[0.17 * Math.cos(i * 2.1), 0, 0.17 * Math.sin(i * 2.1)]} material={wood}><cylinderGeometry args={[0.015, 0.015, 0.7, 12]} /></mesh>)}
      <mesh material={glass}><latheGeometry args={[[[0.001, -0.33], [0.12, -0.3], [0.14, -0.2], [0.05, -0.04], [0.02, 0], [0.05, 0.04], [0.14, 0.2], [0.12, 0.3], [0.001, 0.33]].map(([r, y]) => new THREE.Vector2(r, y)), 48]} /></mesh>
      <mesh position={[0, flip < 0.5 ? 0.04 + 0.12 * top : -0.04 - 0.12 * top, 0]} scale={[1, Math.max(0.02, top), 1]}><coneGeometry args={[0.11, 0.24, 32]} /><Std c="#e9c98a" r={0.9} /></mesh>
      <mesh position={[0, flip < 0.5 ? -0.31 + 0.11 * bot : 0.31 - 0.11 * bot, 0]} rotation-x={flip < 0.5 ? 0 : Math.PI} scale={[1, Math.max(0.02, bot), 1]}><coneGeometry args={[0.12, 0.22, 32]} /><Std c="#e9c98a" r={0.9} /></mesh>
    </G>
  </>;
}} over={(tt) => <Cap tt={tt} at={1.0} x={1440} y={170} txt="3 MIN A SIDE" col="#e9c98a" />} />;

// c07 · el Dutch baby: en la sartén de hierro BIEN caliente la masa se infla como una corona dorada
export const RPuff: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.4, 1.9], l: [0, 0.15, 0], fov: 34 }} cam2={{ p: [0.05, 1.2, 1.5], l: [0, 0.18, 0], fov: 32 }} f={(tt) => {
  const pf = ez(tt, 1.0, 4.0), fall = ez(tt, 5.0, 6.2), ht = pf * (1 - 0.35 * fall);
  return <>
    <G p={[0, 0.03, 0]}>
      <mesh material={iron} castShadow receiveShadow><cylinderGeometry args={[0.5, 0.44, 0.06, 64]} /></mesh>
      <mesh position={[0, 0.07, 0]} material={iron}><torusGeometry args={[0.49, 0.03, 12, 64]} /></mesh>
      <mesh position={[0.78, 0.06, 0]} rotation-z={Math.PI / 2} material={iron}><boxGeometry args={[0.05, 0.5, 0.07]} /></mesh>
    </G>
    <FoodMesh tex="crust" c={col("#f2dfb0", "#ffffff", pf)} cc={0.4} p={[0, 0.08, 0]} s={[1, 0.15 + ht * 1.1, 1]}><sphereGeometry args={[0.44, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2]} /></FoodMesh>
    {[...Array(14)].map((_, i) => { const a = (i / 14) * Math.PI * 2; return <FoodMesh key={i} tex="crust" c="#ffffff" p={[Math.cos(a) * 0.42, 0.1 + ht * 0.28, Math.sin(a) * 0.42]} s={[1, 0.6 + ht * 1.4, 1]}><sphereGeometry args={[0.07, 20, 12]} /></FoodMesh>; })}
    {fall > 0.5 && [...Array(40)].map((_, i) => <mesh key={i} position={[0.35 * (rnd(i, 1) - 0.5), 0.12 + ht * 0.4 + 0.5 * (1 - ez(tt, 5.4 + i * 0.01, 6.0)), 0.35 * (rnd(i, 2) - 0.5)]}><boxGeometry args={[0.008, 0.008, 0.008]} /><Std c="#ffffff" r={0.9} /></mesh>)}
  </>;
}} over={(tt) => <Cap tt={tt} at={2.0} x={1440} y={170} txt="SCREAMING HOT PAN" col="#e4572e" />} />;

// c08 · tomates fritos: la rodaja FINITA se rompe, la de media pulgada se aguanta (la regla lo mide)
const TomSlice: React.FC<{ p: V3; th: number; split?: number }> = ({ p, th, split = 0 }) => <G p={p}>
  {[1, -1].map((s) => <G key={s} p={[s * split * 0.05, 0, 0]} r={[0, 0, s * split * 0.25]}><mesh castShadow><cylinderGeometry args={[0.17, 0.17, th, 40, 1, false, s > 0 ? -Math.PI / 2 : Math.PI / 2, Math.PI]} /><meshPhysicalMaterial color="#c8321e" roughness={0.3} clearcoat={0.8} /></mesh>
    <mesh position={[0, th / 2 + 0.001, 0]} rotation-x={-Math.PI / 2}><circleGeometry args={[0.15, 40, s > 0 ? 0 : Math.PI, Math.PI]} /><Std c="#e5553a" r={0.3} cc={0.6} /></mesh></G>)}
  {[...Array(6)].map((_, i) => <mesh key={i} position={[0.09 * Math.cos(i * 1.05), th / 2 + 0.004, 0.09 * Math.sin(i * 1.05)]} scale={[1, 0.3, 1]}><sphereGeometry args={[0.018, 10, 6]} /><Std c="#f1c45a" r={0.4} /></mesh>)}
</G>;
export const RHalfInch: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.0, 1.3], l: [0.1, 0.08, 0], fov: 34 }} cam2={{ p: [0.1, 0.9, 1.1], l: [0.15, 0.08, 0], fov: 32 }} f={(tt) => {
  const brk = k0(tt, 2.4, 9, 0.6), r = ez(tt, 0.6, 1.4);
  return <>
    <TomSlice p={[-0.45, 0.012, 0]} th={0.02} split={brk} />
    <TomSlice p={[0.4, 0.045, 0]} th={0.09} />
    <G p={[0.75 - 0.15 * (1 - r), 0.0, 0]} r={[0, 0, 0]}>
      <Sheet id="ruler" w={0.06} h={0.42} th={0.02} p={[0, 0.21, 0]} draw={(g, w, hh) => { g.fillStyle = "#e9c86a"; g.fillRect(0, 0, w, hh); g.fillStyle = "#1d2440"; for (let i = 0; i <= 16; i++) g.fillRect(0, hh - (i / 16) * hh, i % 4 ? w * 0.35 : w * 0.7, 6); g.fillStyle = "#b3241b"; g.fillRect(0, hh - 0.5 * hh * 0.42 * 0 - (0.09 / 0.42) * hh - 4, w, 10); }} />
    </G>
  </>;
}} over={(tt) => <><Cap tt={tt} at={2.6} x={560} y={170} txt="TOO THIN" col="#d42a1e" /><Cap tt={tt} at={1.2} x={1340} y={170} txt="½ INCH" col="#3fae5b" /></>} />;

// c09 · pigs in a blanket: el panqueque se llena de burbujas que revientan; recién ahí va la salchicha
export const RBubbleWait: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} top="steel" cam={{ p: [0, 1.7, 1.6], l: [0, 0.05, 0], fov: 34 }} cam2={{ p: [0.05, 1.45, 1.25], l: [0, 0.05, 0], fov: 32 }} f={(tt) => {
  const set = ez(tt, 0.5, 3.4), s = drop(tt, 3.6, 0.7), roll = ez(tt, 4.4, 5.4);
  return <>
    <FoodMesh tex="dough" c={col("#f6e7c2", "#efd49a", set)} cc={0.5 * (1 - set)} p={[0, 0.012, 0]}><cylinderGeometry args={[0.42, 0.42, 0.022, 64]} /></FoodMesh>
    {[...Array(30)].map((_, i) => { const a = rnd(i, 1) * 6.28, r = 0.36 * Math.sqrt(rnd(i, 2)), b = 0.6 + rnd(i, 3) * 2.6, k = ez(tt, b, b + 0.4), pop = tt > b + 0.4; return k > 0 ? <mesh key={i} position={[Math.cos(a) * r, 0.025, Math.sin(a) * r]} rotation-x={-Math.PI / 2}>{pop ? <ringGeometry args={[0.006, 0.016, 16]} /> : <circleGeometry args={[0.016 * k, 16]} />}<meshPhysicalMaterial color={pop ? "#b98a4a" : "#fff6dc"} roughness={0.1} clearcoat={1} side={THREE.DoubleSide} /></mesh> : null; })}
    {s.on && <G p={[-0.28 + 0.28 * roll, 0.06 + s.y + 0.04 * roll, 0]} r={[0, 0, -roll * Math.PI * 2]}><mesh rotation-x={Math.PI / 2} castShadow><capsuleGeometry args={[0.05, 0.4, 8, 16]} /><Std c="#8a4a26" r={0.45} cc={0.6} /></mesh></G>}
    {roll > 0.01 && <G p={[0, 0.07, 0]}><mesh rotation-x={Math.PI / 2} scale={[1, 1, 1]}><cylinderGeometry args={[0.08, 0.08, 0.5, 40, 1, true, 0, Math.PI * 2 * roll]} /><meshPhysicalMaterial color="#efd49a" roughness={0.6} side={THREE.DoubleSide} /></mesh></G>}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.4} x={1440} y={170} txt="WAIT FOR THE BUBBLES" col="#efd49a" />} />;

// c10 · tocino en sartén FRÍA: se prende el fuego y las tiras se van ondulando y dorando parejas
const Bacon: React.FC<{ p: V3; k: number; ph: number }> = ({ p, k, ph }) => <G p={p}>{[...Array(10)].map((_, i) => <mesh key={i} position={[-0.25 + i * 0.055, 0.012 + 0.02 * k * Math.sin(i * 1.4 + ph), 0]} rotation-z={0.35 * k * Math.cos(i * 1.4 + ph)} castShadow><boxGeometry args={[0.058, 0.012, 0.09]} /><meshPhysicalMaterial color={col(i % 3 === 1 ? "#f3d6c8" : "#d97a72", i % 3 === 1 ? "#d9a060" : "#8a3a1e", k)} roughness={0.5} clearcoat={0.5 + 0.4 * k} /></mesh>)}</G>;
export const RColdBacon: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0.2, 1.45, 1.35], l: [0.2, 0.05, 0], fov: 34 }} cam2={{ p: [0.22, 1.3, 1.15], l: [0.22, 0.05, 0], fov: 32 }} f={(tt) => {
  const fire = ez(tt, 1.0, 1.6), k = ez(tt, 1.8, 5.5);
  return <>
    <G p={[0, 0.02, 0]}><Skillet rad={0.48} inside="#232326" /></G>
    {[-0.16, 0, 0.16].map((z, i) => <Bacon key={i} p={[0, 0.06, z]} k={k} ph={i * 0.8} />)}
    {fire > 0.01 && [...Array(16)].map((_, i) => { const a = (i / 16) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.3, -0.005, Math.sin(a) * 0.3 + 0.0]} scale={[1, fire, 1]}><coneGeometry args={[0.015, 0.04, 8]} /><meshStandardMaterial color="#5aa0ff" emissive="#3b7bff" emissiveIntensity={1.2} transparent opacity={0.8} /></mesh>; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.2} x={1440} y={170} txt="COLD PAN · THEN HEAT" col="#5aa0ff" />} />;

// c11 · el secreto de la tostada francesa: una cucharada de harina nieva sobre el bol de crema de huevo
export const RFlourSecret: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.6, 1.8], l: [0, 0.2, 0], fov: 34 }} cam2={{ p: [0.05, 1.4, 1.45], l: [0, 0.22, 0], fov: 32 }} f={(tt) => {
  const tip = ez(tt, 1.2, 1.8), mix = ez(tt, 2.6, 4.5);
  return <>
    <Bowl s={1.2} fill={col("#f0c75a", "#e9cf8e", mix)} lvl={0.17} />
    <G p={[0.18, 0.75, 0]} r={[0, 0, tip * 1.3]}><Tool kind="spoon" r={[0, Math.PI / 2, 0]} /><mesh position={[0, 0.03, 0.0]} scale={[1, 1 - tip, 1]}><sphereGeometry args={[0.06, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><Std c="#fbfaf6" r={0.95} /></mesh></G>
    {tip > 0.6 && tt < 3.6 && [...Array(60)].map((_, i) => { const ph = (tt * 1.4 + rnd(i, 1)) % 1; return <mesh key={i} position={[0.1 + 0.08 * (rnd(i, 2) - 0.5), 0.72 - ph * 0.5, 0.08 * (rnd(i, 3) - 0.5)]}><boxGeometry args={[0.006, 0.006, 0.006]} /><Std c="#ffffff" r={0.9} /></mesh>; })}
    {tt > 1.9 && <mesh position={[0.08, 0.215, 0]} rotation-x={-Math.PI / 2} scale={1 - mix}><circleGeometry args={[0.1, 32]} /><Std c="#fbfaf6" r={0.95} /></mesh>}
    {mix > 0.01 && <G p={[0.15 * Math.cos(tt * 3), 0.45, 0.15 * Math.sin(tt * 3)]} r={[0.3, 0, 0]}><Tool kind="fork" r={[Math.PI / 2 - 0.2, 0, 0]} s={0.8} /></G>}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.5} x={1440} y={170} txt="+1 TBSP FLOUR" col="#fbfaf6" />} />;

// c12 · 20 segundos por lado: la rodaja entra a la crema, se da vuelta y sale goteando
export const RSoak20: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.1, 1.5], l: [0, 0.18, 0], fov: 34 }} cam2={{ p: [0.05, 1.0, 1.3], l: [0, 0.18, 0], fov: 32 }} f={(tt) => {
  const dn = ez(tt, 0.6, 1.2) * (1 - ez(tt, 4.4, 5.0)), fl = ez(tt, 2.6, 3.2), soak = ez(tt, 1.2, 4.4);
  return <>
    <mesh position={[0, 0.03, 0]} castShadow receiveShadow><boxGeometry args={[1.1, 0.06, 0.75]} /><meshPhysicalMaterial color="#f2ede2" roughness={0.25} clearcoat={1} /></mesh>
    <mesh position={[0, 0.061, 0]}><boxGeometry args={[1.0, 0.002, 0.65]} /><Std c="#ecc45c" r={0.2} cc={1} /></mesh>
    <G p={[0, 0.07 + 0.5 * (1 - dn), 0]} r={[0, 0, fl * Math.PI]}>
      <FoodMesh tex="crust" c={col("#f6e8c8", "#f0c770", soak)} cc={soak * 0.6}><boxGeometry args={[0.5, 0.07, 0.5]} /></FoodMesh>
    </G>
    {tt > 4.6 && [...Array(6)].map((_, i) => { const ph = (tt * 1.5 + i / 6) % 1; return <mesh key={i} position={[-0.2 + i * 0.08, 0.5 - ph * 0.42, 0]}><sphereGeometry args={[0.012, 10, 8]} /><Std c="#ecc45c" r={0.2} cc={1} /></mesh>; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={0.9} x={1460} y={170} txt="20 SECONDS A SIDE" col="#ecc45c" />} />;

// c13 · el omelette Denver: el morrón grande se parte en cubitos de un cuarto de pulgada
export const RDiceSmall: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0.1, 1.05, 1.15], l: [0.05, 0.1, 0], fov: 34 }} cam2={{ p: [0.12, 0.95, 1.0], l: [0.05, 0.1, 0], fov: 32 }} f={(tt) => {
  const c1 = k0(tt, 1.2, 9, 0.55), c2 = k0(tt, 2.4, 9, 0.55), kn = Math.max(0, Math.sin(Math.PI * ez(tt, 0.9, 1.4))) + Math.max(0, Math.sin(Math.PI * ez(tt, 2.1, 2.6)));
  const N = 4, s = 0.4 / N;
  return <>
    <mesh position={[0, 0.03, 0]} material={wood} castShadow receiveShadow><boxGeometry args={[1.4, 0.06, 0.9]} /></mesh>
    {[...Array(N * N * 2)].map((_, i) => { const x = i % N, z = Math.floor(i / N) % N, y = Math.floor(i / (N * N)); const spread = 0.04 * c1 + 0.03 * c2;
      return <mesh key={i} position={[(x - (N - 1) / 2) * (s + spread) - 0.1, 0.06 + s / 2 + y * (s + 0.004) * (1 - c2) , (z - (N - 1) / 2) * (s + spread) + (y ? 0.45 * c2 : 0)]} castShadow><boxGeometry args={[s * 0.98, s * 0.98, s * 0.98]} /><meshPhysicalMaterial color={i % 5 === 0 ? "#3f8a25" : "#4fa02e"} roughness={0.25} clearcoat={1} /></mesh>; })}
    <G p={[0.5, 0.06 + 0.35 * (1 - Math.min(1, kn)), 0]} r={[0, Math.PI / 2, Math.PI / 2]}><Tool kind="knife" /></G>
  </>;
}} over={(tt) => <Cap tt={tt} at={2.6} x={1440} y={170} txt="¼ INCH DICE" col="#4fa02e" />} />;

// carne cruda; ya pasada por la máquina, cuadriculada
const steakDraw = (cubed: boolean) => (g: CanvasRenderingContext2D, w: number) => { g.fillStyle = "#a8463c"; g.fillRect(0, 0, w, w); for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(${200 + 40 * rnd(i, 1)},${120 + 40 * rnd(i, 1)},110,.35)`; g.fillRect(rnd(i, 2) * w, rnd(i, 3) * w, 4, 3); } if (cubed) { g.strokeStyle = "rgba(70,20,15,.75)"; g.lineWidth = 4; for (let k = 0; k < w; k += 22) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, w); g.stroke(); g.beginPath(); g.moveTo(0, k); g.lineTo(w, k); g.stroke(); } } };
const SteakMat: React.FC<{ cubed: boolean }> = ({ cubed }) => { const a = useTex("rawsteak", 256, 256, steakDraw(false)), b = useTex("cubesteak", 256, 256, steakDraw(true)); const tx = cubed ? b : a; return <meshStandardMaterial key={tx ? "t" + cubed : "n"} map={tx ?? undefined} roughness={0.55} />; };
// c14 · el cube steak: la carne pasa entre los rodillos de cuchillas y sale cuadriculada
export const RCuber: React.FC<P> = ({ t, h }) => {
  return <R3 t={t} h={h} top="steel" cam={{ p: [0, 1.3, 2.0], l: [0, 0.3, 0], fov: 34 }} cam2={{ p: [0.1, 1.15, 1.6], l: [0, 0.3, 0], fov: 32 }} f={(tt) => {
    const mv = ez(tt, 0.8, 4.2), x = lerp(-0.85, 0.75, mv);
    return <>
      <mesh position={[0, 0.25, 0]} castShadow><boxGeometry args={[0.36, 0.5, 0.8]} /><Std c="#b3241b" r={0.3} cc={1} /></mesh>
      {[0.42, 0.18].map((y) => <mesh key={y} position={[0, y, 0.0]} rotation-x={Math.PI / 2} material={steel}><cylinderGeometry args={[0.07, 0.07, 0.84, 32]} /></mesh>)}
      {[...Array(10)].map((_, i) => <mesh key={i} position={[0, 0.3, -0.36 + i * 0.08]} rotation={[tt * 6, 0, 0]} material={steel}><torusGeometry args={[0.075, 0.006, 6, 24]} /></mesh>)}
      <G p={[x, 0.3, 0]}><mesh castShadow><boxGeometry args={[0.55, 0.04, 0.45]} /><SteakMat cubed={x > 0} /></mesh></G>
    </>;
  }} over={(tt) => <Cap tt={tt} at={2.0} x={1440} y={170} txt="CUBED = TENDER" col="#e4572e" />} />;
};

// c15 · el rallador de caja: la papa hervida la noche anterior baja y sube y se arma el montón de hebras
export const RGrater: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.15, 2.1], l: [0, 0.4, 0], fov: 34 }} cam2={{ p: [0.15, 1.05, 1.7], l: [0.1, 0.4, 0], fov: 32 }} f={(tt) => {
  const g = Math.max(0, Math.sin(tt * 3.2)) * (tt > 0.8 && tt < 5.5 ? 1 : 0), pile = ez(tt, 1.0, 5.5);
  return <>
    <Tex id="grater" w={256} h={512} draw={(gg, w, hh) => { gg.fillStyle = "#cfd4da"; gg.fillRect(0, 0, w, hh); gg.fillStyle = "#3a3d42"; for (let y = 20; y < hh; y += 34) for (let x = 18; x < w; x += 40) { gg.beginPath(); gg.ellipse(x + (y % 68 ? 20 : 0), y, 12, 7, 0, 0, 6.3); gg.fill(); } }}>
      {(tx) => <G p={[-0.1, 0, 0]} r={[0, 0.5, 0]}><mesh position={[0, 0.38, 0]} castShadow><boxGeometry args={[0.32, 0.76, 0.22]} /><meshStandardMaterial key={tx ? "t" : "n"} map={tx ?? undefined} metalness={0.8} roughness={0.35} /></mesh><mesh position={[0, 0.82, 0]} material={steel} rotation-z={Math.PI / 2}><torusGeometry args={[0.07, 0.012, 8, 24, Math.PI]} /></mesh></G>}
    </Tex>
    {tt < 5.6 && <G p={[-0.1 + 0.2 * Math.sin(0.5), 0.3 + 0.32 * g, 0.12 + 0.12]} r={[0, 0.5, 0]}><FoodMesh tex="crust" c="#c49a64" s={[1 - 0.4 * pile, 1.35 * (1 - 0.4 * pile), 1 - 0.4 * pile]}><sphereGeometry args={[0.11, 32, 16]} /></FoodMesh></G>}
    {[...Array(130)].map((_, i) => { const k = ez(tt, 1.0 + i * 0.033, 1.4 + i * 0.033); return k > 0.01 ? <mesh key={i} position={[0.22 + 0.32 * (rnd(i, 1) - 0.5) * (1 - 0.5 * rnd(i, 2)), 0.015 + 0.14 * rnd(i, 2) * pile * (1 - Math.abs(rnd(i, 1) - 0.5)), 0.3 + 0.3 * (rnd(i, 3) - 0.5) * (1 - 0.5 * rnd(i, 2))]} rotation={[0, rnd(i, 4) * 3, Math.PI / 2 + (rnd(i, 5) - 0.5)]} scale={k * 1.4}><capsuleGeometry args={[0.006, 0.07, 4, 6]} /><Std c="#ecd9a6" r={0.6} /></mesh> : null; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.4} x={1440} y={170} txt="BOILED LAST NIGHT" col="#e8d39a" />} />;

// c16 · la plancha necesita media hora: el calor se abre del centro a los bordes
export const RGriddleHeat: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.6, 2.0], l: [0, 0.05, 0], fov: 34 }} cam2={{ p: [0.05, 1.4, 1.6], l: [0, 0.05, 0], fov: 32 }} f={(tt) => {
  const k = ez(tt, 0.8, 5.0);
  return <>
    <mesh position={[0, 0.05, 0]} castShadow receiveShadow><boxGeometry args={[1.9, 0.1, 1.0]} /><meshStandardMaterial color="#3a3b3e" metalness={0.85} roughness={0.4} /></mesh>
    {[...Array(5)].map((_, i) => { const r = 0.12 + i * 0.2 * k; return <mesh key={i} position={[0, 0.101 + i * 0.0005, 0]} rotation-x={-Math.PI / 2} scale={[1.7, 1, 1]}><circleGeometry args={[r, 64]} /><meshBasicMaterial color={["#ff8a3a", "#e8642a", "#c24a22", "#8e3a20", "#5a2a1a"][i]} transparent opacity={0.11 * k} depthWrite={false} /></mesh>; })}
    <mesh position={[0, 0.06, 0.52]}><boxGeometry args={[1.9, 0.08, 0.04]} /><Std c="#1a1a1a" m={0.6} r={0.4} /></mesh>
  </>;
}} over={(tt) => <Cap tt={tt} at={1.0} x={1440} y={170} txt={`${Math.round(ez(tt, 0.8, 5.0) * 30)} MIN · EDGE TO EDGE`} col="#ff8a3a" />} />;

// c17 · el termo del café: cuando el nivel baja a un tercio, Frank lo tira y hace otro
export const RUrnGauge: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.15, 2.8], l: [0, 0.65, 0], fov: 34 }} cam2={{ p: [0.15, 1.1, 2.45], l: [0.1, 0.65, 0], fov: 32 }} f={(tt) => {
  const dn = ez(tt, 0.6, 2.6), up = ez(tt, 3.6, 5.2), lvl = 0.9 - 0.6 * dn + 0.6 * up;
  return <>
    <mesh position={[0, 0.6, 0]} material={steel} castShadow><cylinderGeometry args={[0.32, 0.32, 1.0, 48]} /></mesh>
    <mesh position={[0, 1.12, 0]} material={steel}><sphereGeometry args={[0.32, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
    {[0, 1, 2].map((i) => <mesh key={i} position={[0.24 * Math.cos(i * 2.1), 0.05, 0.24 * Math.sin(i * 2.1)]} material={steel}><cylinderGeometry args={[0.025, 0.03, 0.1, 12]} /></mesh>)}
    <mesh position={[0.18, 0.62, 0.3]} material={glass}><cylinderGeometry args={[0.03, 0.03, 0.85, 16]} /></mesh>
    <mesh position={[0.18, 0.2 + 0.85 * lvl / 2, 0.3]}><cylinderGeometry args={[0.022, 0.022, 0.85 * lvl, 16]} /><Std c="#3a1d0e" r={0.15} cc={1} /></mesh>
    <mesh position={[0.18, 0.2 + 0.85 * 0.33, 0.33]}><boxGeometry args={[0.1, 0.006, 0.006]} /><meshBasicMaterial color="#d42a1e" /></mesh>
    <mesh position={[-0.05, 0.25, 0.33]} material={steel} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.025, 0.025, 0.12, 12]} /></mesh>
  </>;
}} over={(tt) => <Cap tt={tt} at={2.4} x={1440} y={170} txt={tt < 3.4 ? "⅓ LEFT → POUR IT OUT" : "FRESH URN"} col="#c98a45" />} />;

export const R3X: Record<string, React.FC<P>> = {
  millWhistle: RMillWhistle, creamMoat: RCreamMoat, lumps: RLumps, waxWrap: RWaxWrap, towelSqueeze: RTowelSqueeze, oneLayer: ROneLayer,
  hourglass: RHourglass, puff: RPuff, halfInch: RHalfInch, bubbleWait: RBubbleWait, coldBacon: RColdBacon, flourSecret: RFlourSecret,
  soak20: RSoak20, diceSmall: RDiceSmall, cuber: RCuber, grater: RGrater, griddleHeat: RGriddleHeat, urnGauge: RUrnGauge,
};
