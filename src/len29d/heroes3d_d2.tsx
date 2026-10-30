// len29d · 2ª vuelta en 3D real (kit h3d): billete, grieta, cera, cintura, gota, salida, trapo, juguetes, sopapas, salpicadura.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, RED, H } from "./hkit";
import { M, RBox, Scene3D, cl, curve, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Bowl, Hand, PI } from "./heroes3d_d1";

const SKIN = "#d8a888";
const Steam: React.FC<{ tt: number; p: number[]; n?: number; on?: number; s?: number }> = ({ tt, p, n = 10, on = 1, s = 1 }) => <>{Array.from({ length: n }, (_, i) => { const k = ((tt * 0.5 + i / n) % 1); return <mesh key={i} position={[p[0] + 0.05 * s * Math.sin(i * 2 + tt), p[1] + 0.3 * s * k, p[2] + 0.04 * s * Math.cos(i)]} scale={(0.5 + 1.5 * k) * s}><sphereGeometry args={[0.025, 12, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.13 * (1 - k) * on} depthWrite={false} /></mesh>; })}</>;
const Kettle: React.FC<{ p: number[]; tilt: number }> = ({ p, tilt }) => <group position={p as [number, number, number]} rotation={[0, 0, -1.0 * tilt]}>
  <mesh castShadow scale={[1, 0.85, 1]}><sphereGeometry args={[0.08, 32, 24]} />{M.steel({ col: "#d8dde2" })}</mesh>
  <mesh position={[0.09, 0.0, 0]} rotation={[0, 0, -1.0]}><cylinderGeometry args={[0.008, 0.016, 0.09, 16]} />{M.steel({ col: "#d8dde2" })}</mesh>
  <mesh position={[-0.02, 0.08, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.05, 0.008, 10, 28, PI]} />{M.plastic({ col: "#1c1c1e" })}</mesh>
</group>;

// ---- 4:58 · LA PROPINA PARTIDA: un billete de 20 sobre el mostrador se rasga; el pedazo de 5 sale volando hacia el aprendiz ----
const billTex = () => tex.text("d_bill", 512, 220, (g) => { g.fillStyle = "#c9d6b8"; g.fillRect(0, 0, 512, 220); g.strokeStyle = "#3d5a3a"; g.lineWidth = 6; g.strokeRect(12, 12, 488, 196); g.fillStyle = "#3d5a3a"; g.font = "bold 70px Georgia"; g.fillText("20", 34, 92); g.fillText("20", 400, 196); g.beginPath(); g.ellipse(256, 110, 62, 76, 0, 0, 2 * PI); g.globalAlpha = 0.3; g.fill(); g.globalAlpha = 1; for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(60,90,58,${0.08 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 220, 30, 2); } });
let BILL: [THREE.Texture, THREE.Texture] | null = null;
export const HTipSplit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="wood" warm={0.8}
  cam={{ at: [0.14, 0.12, 0], az: [-0.2, 0.15], el: [0.38, 0.28], r: [1.3, 1.15], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="15 MINUTES LATER" title="IT FLUSHED" col={ICE} />}>{(tt) => {
  const land = cl(phys(tt, 0.3, 6, 0.45)), tear = eio(tt, 1.8, 2.6), fly = eio(tt, 2.6, 4.2), W = 0.4, Hh = 0.17, cut = 0.75;
  if (!BILL) { const t1 = billTex(), l = t1.clone(), r = t1.clone(); l.repeat.set(cut, 1); l.needsUpdate = true; r.repeat.set(1 - cut, 1); r.offset.set(cut, 0); r.needsUpdate = true; BILL = [l, r]; }
  const [left, right] = BILL;
  return <>
    <group position={[-0.08, 0.004 + 0.25 * (1 - land), 0]} rotation={[-PI / 2, 0, 0.08]}>
      <mesh position={[-W / 2 + (W * cut) / 2 - 0.01 * tear, 0, 0]} rotation={[0, 0, 0.04 * tear]}><planeGeometry args={[W * cut, Hh]} /><meshStandardMaterial map={left} roughness={0.8} side={THREE.DoubleSide} /></mesh>
      <group position={[W / 2 - (W * (1 - cut)) / 2 + 0.03 * tear + 0.42 * fly, -0.05 * fly, 0.18 * Math.sin(PI * fly)]} rotation={[0.6 * fly, 2.4 * fly, -0.1 * tear]}>
        <mesh><planeGeometry args={[W * (1 - cut), Hh]} /><meshStandardMaterial map={right} roughness={0.8} side={THREE.DoubleSide} /></mesh>
      </group>
    </group>
    {/* el aprendiz: figurita con gorra a la derecha que abre la mano */}
    <group position={[0.42, 0, -0.12]} rotation={[0, -0.5, 0]}>
      <mesh position={[0, 0.16, 0]} castShadow><capsuleGeometry args={[0.04, 0.14, 8, 16]} />{M.matte({ col: "#3a5a8a" })}</mesh>
      <mesh position={[0, 0.3, 0]} castShadow><sphereGeometry args={[0.035, 20, 14]} />{M.matte({ col: SKIN })}</mesh>
      <mesh position={[0, 0.325, 0.01]} scale={[1, 0.5, 1.1]}><sphereGeometry args={[0.037, 20, 12, 0, 2 * PI, 0, PI / 2]} />{M.matte({ col: RED })}</mesh>
      <mesh position={[-0.05, 0.2 + 0.04 * fly, 0.04]} rotation={[-0.9 * fly, 0, 0.4]}><capsuleGeometry args={[0.012, 0.09, 6, 10]} />{M.matte({ col: "#3a5a8a" })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 5:49 · AGUA HIRVIENDO: la pava vierte en la taza; en la porcelana se abre una grieta en zigzag, saltan astillas y destella ----
const crackPts = (n: number) => Array.from({ length: n }, (_, i) => { const y = 0.31 - i * 0.012, r = lerp(0.165, 0.11, cl((0.31 - y) / 0.1)), a = PI / 2 + 0.06 * (i % 2 ? 1 : -1) + 0.01 * i; return [Math.cos(a) * r, y, Math.sin(a) * r * 1.22]; });
export const HFrostCrack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="tile"
  cam={{ at: [0, 0.22, 0.1], az: [0.1, -0.08], el: [0.28, 0.2], r: [1.05, 0.88], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="MISTAKE NUMBER ONE" title="BOILING WATER" col={RED} />}>{(tt) => {
  const tilt = eio(tt, 0.4, 1.1) * (1 - eio(tt, 3.6, 4.2)), cr = eio(tt, 2.0, 3.2), flash = cl((tt - 2.0) / 0.1) * (1 - cl((tt - 2.2) / 0.4)), n = Math.max(2, Math.round(2 + 7 * cr));
  return <>
    <Bowl water={0.6} p={[0, 0, 0]} />
    <Kettle p={[-0.22, 0.5, 0]} tilt={tilt} />
    {tilt > 0.7 && <mesh geometry={tubeG("d_fk", [[-0.14, 0.47, 0], [-0.09, 0.4, 0], [-0.03, 0.32, 0], [0, 0.25, 0]], 0.008, 24, 10)}>{M.water({ op: 0.7, emI: 0.4 })}</mesh>}
    <Steam tt={tt} p={[0, 0.25, 0]} on={tilt > 0.3 || cr > 0 ? 1 : 0} />
    {cr > 0 && <mesh geometry={tubeG("d_crk" + n, crackPts(n), 0.0028, 40, 6)}><meshBasicMaterial color="#2a2a2c" /></mesh>}
    {Array.from({ length: 8 }, (_, i) => { const k = cl((tt - 2.05 - i * 0.04) / 0.8); return k > 0 && k < 1 ? <mesh key={i} position={[0.03 * (rn(i, 2) - 0.5) + 0.12 * (rn(i, 3) - 0.5) * k, 0.29 + 0.1 * k - 0.2 * k * k, 0.2 + 0.12 * k]} rotation={[k * 8, k * 5 * i, 0]}><tetrahedronGeometry args={[0.006 + 0.004 * rn(i, 4)]} />{M.porcelain()}</mesh> : null; })}
    <pointLight position={[0, 0.3, 0.3]} intensity={0.28 * flash} distance={0.4} color="#ffffff" />
  </>;
}}</Scene3D>;

// ---- 6:06 · EL ANILLO DE CERA: debajo del inodoro, el anillo de cera grande sobre la brida; cae agua caliente con vapor y la cera se achata y brilla ----
export const HWaxMelt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="none" bg="#15120f"
  cam={{ at: [0, 0.04, 0], az: [0.3, 0.1], el: [0.42, 0.3], r: [0.75, 0.62], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="UNDER THE TOILET" title="THE WAX SEAL" col={AMB} />}>{(tt) => {
  const pour = tt > 1.0 && tt < 4.6 ? 1 : 0, melt = eio(tt, 1.4, 5.0), shine = melt * (0.6 + 0.4 * Math.sin(tt * 3));
  return <>
    <mesh position={[0, 0.005, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.05, 0.12, 56]} />{M.brass({ col: "#8a8f93" })}</mesh>
    <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.05, 0.05, 0.1, 40, 1, true]} />{M.matte({ col: "#141516", side: THREE.DoubleSide })}</mesh>
    {[0, 1, 2, 3].map((i) => <mesh key={i} position={[Math.cos(i * PI / 2) * 0.1, 0.012, Math.sin(i * PI / 2) * 0.1]}><cylinderGeometry args={[0.006, 0.006, 0.01, 12]} />{M.steel()}</mesh>)}
    <mesh position={[0, 0.03 - 0.016 * melt, 0]} rotation={[PI / 2, 0, 0]} scale={[1 + 0.18 * melt, 1 + 0.18 * melt, 1 - 0.55 * melt]}><torusGeometry args={[0.075, 0.026, 24, 64]} /><meshPhysicalMaterial color="#e6c070" roughness={0.6 - 0.5 * melt} clearcoat={melt} emissive="#ffb050" emissiveIntensity={0.25 * shine} /></mesh>
    {pour > 0 && <mesh position={[0.04, 0.25, 0.03]}><cylinderGeometry args={[0.008, 0.007, 0.42, 14, 1, true]} />{M.water({ op: 0.7, emI: 0.4 })}</mesh>}
    <Steam tt={tt} p={[0.04, 0.03, 0.03]} on={melt > 0.05 ? 1 : 0} s={0.8} />
    {melt > 0.4 && Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[Math.cos(i * 1.05) * 0.1, 0.004, Math.sin(i * 1.05) * 0.1]} scale={[1, 0.2, 1]}><sphereGeometry args={[0.012 * (melt - 0.4) * 2.5, 12, 8]} /><meshPhysicalMaterial color="#e6c070" roughness={0.1} clearcoat={1} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 6:28 · DESDE LA CINTURA: la silueta junto a una regla marcada en la cintura; el balde vierte de esa altura, salpica en la taza y una flecha gruesa empuja hacia abajo ----
const rulerTex = () => tex.text("d_ruler", 64, 512, (g) => { g.fillStyle = "#f2c230"; g.fillRect(0, 0, 64, 512); g.fillStyle = "#1e1a12"; for (let i = 0; i < 48; i++) g.fillRect(0, i * 10.6, i % 4 ? 16 : 34, 2); });
export const HWaistDrop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile"
  cam={{ at: [0.05, 0.42, 0], az: [-0.5, -0.3], el: [0.1, 0.08], r: [1.9, 1.7], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="HOW YOU POUR MATTERS" title="FROM THE WAIST" col={AMB} />}>{(tt) => {
  const mark = cl((tt - 0.5) / 0.4), tilt = eio(tt, 1.4, 2.2) * (1 - eio(tt, 4.4, 5.0)), splash = cl((tt - 2.2) / 0.6), push = eio(tt, 2.4, 4.4);
  return <>
    <Bowl p={[0.12, 0, 0.05]} water={0.55} />
    <mesh position={[-0.45, 0.45, -0.1]}><boxGeometry args={[0.04, 0.9, 0.01]} /><meshStandardMaterial map={rulerTex()} roughness={0.6} /></mesh>
    <mesh position={[-0.45, 0.55, -0.093]}><boxGeometry args={[0.1, 0.012, 0.004]} />{M.glow({ col: RED, op: mark })}</mesh>
    <group position={[-0.25, 0, -0.05]}>
      <mesh position={[0, 0.27, 0]} castShadow><capsuleGeometry args={[0.07, 0.3, 8, 16]} />{M.matte({ col: "#2c3036" })}</mesh>
      <mesh position={[0, 0.72, 0]} castShadow><sphereGeometry args={[0.065, 24, 16]} />{M.matte({ col: "#2c3036" })}</mesh>
      <mesh position={[0, 0.55, 0]} castShadow><capsuleGeometry args={[0.08, 0.18, 8, 16]} />{M.matte({ col: "#2c3036" })}</mesh>
      <mesh position={[0, 0.55, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.085, 0.006, 8, 40]} />{M.glow({ col: RED, op: mark })}</mesh>
    </group>
    <group position={[-0.08, 0.55, 0.03]} rotation={[0, 0, -1.3 * tilt]}>
      <mesh castShadow><cylinderGeometry args={[0.08, 0.065, 0.14, 40, 1, true]} />{M.plastic({ col: "#e0e4e8", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, -0.07, 0]}><cylinderGeometry args={[0.065, 0.065, 0.004, 40]} />{M.plastic({ col: "#c8ccd0" })}</mesh>
    </group>
    {tilt > 0.7 && <mesh geometry={tubeG("d_wd", [[0.0, 0.56, 0.03], [0.06, 0.5, 0.04], [0.11, 0.38, 0.05], [0.12, 0.27, 0.05]], 0.022, 30, 12)}>{M.water({ op: 0.65, emI: 0.3 })}</mesh>}
    {splash > 0 && splash < 1 && Array.from({ length: 12 }, (_, i) => { const a = i * PI / 6; return <mesh key={i} position={[0.12 + Math.cos(a) * 0.09 * splash, 0.27 + 0.08 * Math.sin(PI * splash), 0.05 + Math.sin(a) * 0.09 * splash]}><sphereGeometry args={[0.008, 10, 8]} />{M.water({ op: 0.9 })}</mesh>; })}
    <group position={[0.12, 0.36 - 0.12 * push, 0.05]} scale={0.001 + cl(push * 3)}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.018, 0.018, 0.1, 20]} />{M.glow({ col: AMB, op: 0.9 })}</mesh>
      <mesh rotation={[PI, 0, 0]}><coneGeometry args={[0.04, 0.05, 24]} />{M.glow({ col: AMB, op: 0.9 })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 7:17 · LOS QUINCE MINUTOS: una gota de jabón rueda por un camino curvo en relieve y se estira en las bajadas; al lado, un reloj mecánico barre el cuarto de hora ----
const PATH15 = [[-0.4, 0.2, 0], [-0.25, 0.15, 0.08], [-0.1, 0.16, -0.05], [0.05, 0.08, 0.06], [0.18, 0.06, -0.04], [0.3, 0.02, 0.04]];
export const HTimeline15: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="none" bg="#101318"
  cam={{ at: [0, 0.12, 0], az: [-0.2, 0.15], el: [0.4, 0.3], r: [1.15, 1.0], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="WHILE YOU WAIT" title="WHAT'S HAPPENING DOWN THERE" col={ICE} />}>{(tt) => {
  const c = curve(PATH15), u = eio(tt, 0.5, 6.4), p = c.getPointAt(u), tg = c.getTangentAt(u), str = 1 + 0.6 * cl(-tg.y * 3), min = eio(tt, 0.5, 6.4) * PI / 2;
  return <>
    <mesh geometry={tubeG("d_t15", PATH15, 0.03, 120, 20)}>{M.porcelain({ col: "#cfd8e2" })}</mesh>
    <group position={[p.x, p.y + 0.035, p.z]} rotation={[0, -Math.atan2(tg.z, tg.x), Math.atan2(tg.y, Math.hypot(tg.x, tg.z))]} scale={[str, 1 / Math.sqrt(str), 1 / Math.sqrt(str)]}>
      <mesh><sphereGeometry args={[0.022, 24, 16]} /><meshPhysicalMaterial color="#3fae6a" roughness={0} transmission={0.4} emissive="#3fae6a" emissiveIntensity={0.3} /></mesh>
    </group>
    <group position={[0.34, 0.3, -0.25]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.13, 0.13, 0.03, 56]} />{M.brass({ col: "#b8873a" })}</mesh>
      <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.115, 56]} />{M.porcelain()}</mesh>
      <mesh position={[0, 0, 0.018]}><circleGeometry args={[0.105, 48, PI / 2 - min, min]} />{M.glow({ col: ICE, op: 0.35 })}</mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i * PI / 6) * 0.095, Math.cos(i * PI / 6) * 0.095, 0.02]} rotation={[0, 0, -i * PI / 6]}><boxGeometry args={[0.004, 0.014, 0.002]} />{M.matte({ col: "#1a1a1a" })}</mesh>)}
      <group position={[0, 0, 0.022]} rotation={[0, 0, -min]}><mesh position={[0, 0.045, 0]}><boxGeometry args={[0.005, 0.09, 0.002]} />{M.matte({ col: "#1a1a1a" })}</mesh></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 8:25 · NUNCA SIN SALIDA: una puerta con bisagras y el cartel EXIT encendido; la mano gira la llave en la cerradura y un sello A+ cae con golpe sobre la libreta ----
const exitTex = () => tex.text("d_exit", 256, 96, (g) => { g.fillStyle = "#1a0a08"; g.fillRect(0, 0, 256, 96); g.fillStyle = "#ff4a3a"; g.font = "bold 64px Arial"; g.textAlign = "center"; g.fillText("EXIT", 128, 72); });
const stampTex = () => tex.text("d_aplus", 256, 256, (g) => { g.clearRect(0, 0, 256, 256); g.strokeStyle = "#c8261c"; g.lineWidth = 14; g.beginPath(); g.arc(128, 128, 100, 0, 2 * PI); g.stroke(); g.fillStyle = "#c8261c"; g.font = "bold 110px Georgia"; g.textAlign = "center"; g.fillText("A+", 128, 166); });
export const HTestExit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.7}
  cam={{ at: [0.05, 0.26, -1.1], az: [-0.25, 0.1], el: [0.16, 0.12], r: [0.98, 0.82], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="STAN'S RULE" title="NEVER WITHOUT A WAY OUT" col={AMB} />}>{(tt) => {
  const key = eio(tt, 1.0, 2.2) * PI / 2, door = eio(tt, 2.4, 3.6) * 0.5, st = phys(tt, 4.0, 9, 0.5), hit = cl((tt - 4.1) / 0.08) * (1 - cl((tt - 4.3) / 0.3)), print = cl((tt - 4.15) / 0.1);
  return <>
    <group position={[-0.18, 0, -1.5]} rotation={[0, door, 0]}>
      <RBox s={[0.36, 0.72, 0.03]} r={0.006} p={[0.18, 0.36, 0]}>{M.wood({ base: [120, 80, 48] })}</RBox>
      {[0.14, 0.58].map((y) => <mesh key={y} position={[0, y, 0.016]}><cylinderGeometry args={[0.008, 0.008, 0.06, 12]} />{M.brass()}</mesh>)}
      <group position={[0.31, 0.36, 0.02]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.016, 0.016, 0.01, 24]} />{M.brass()}</mesh>
        <group rotation={[0, 0, key]} position={[0, 0, 0.02]}><RBox s={[0.012, 0.05, 0.004]} r={0.002} p={[0, 0.03, 0]}>{M.brass({ col: "#e2b44a" })}</RBox><mesh position={[0, 0.06, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.012, 0.003, 8, 20]} />{M.brass({ col: "#e2b44a" })}</mesh></group>
      </group>
    </group>
    <mesh position={[0, 0.82, -1.57]}><boxGeometry args={[0.2, 0.075, 0.03]} /><meshBasicMaterial map={exitTex()} toneMapped={false} /></mesh>
    <pointLight position={[0, 0.8, -1.45]} intensity={0.4} distance={0.5} color="#ff5040" />
    <Hand p={[0.17, 0.35, -1.42]} rot={[0, 0, PI / 2 - key * 0.6]} curl={0.6} />
    {/* la libreta y el sello */}
    <group position={[0.3, 0, -1.0]}>
      <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0.2]}><planeGeometry args={[0.22, 0.28]} /><meshStandardMaterial map={tex.paper()} roughness={0.9} /></mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-PI / 2, 0, 0.2]} scale={0.001 + print}><planeGeometry args={[0.14, 0.14]} /><meshBasicMaterial map={stampTex()} transparent depthWrite={false} /></mesh>
      <group position={[0, 0.02 + 0.3 * (1 - st) + 0.25 * cl((tt - 4.6) / 0.5), 0]} rotation={[0, 0.2, 0]}>
        <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.06, 0.06, 0.03, 32]} />{M.rubber({ col: "#8a1c16" })}</mesh>
        <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.018, 0.022, 0.1, 20]} />{M.wood({ base: [90, 58, 36] })}</mesh>
        <mesh position={[0, 0.14, 0]}><sphereGeometry args={[0.03, 20, 14]} />{M.wood({ base: [90, 58, 36] })}</mesh>
      </group>
      <pointLight position={[0, 0.1, 0.1]} intensity={0.4 * hit} distance={0.4} color="#ffd38a" />
    </group>
  </>;
}}</Scene3D>;

// ---- 9:02 · DE GOLPE O DE A POCO: la taza de vidrio baja lento en remolino; cae un trapo y el agua se vacía de golpe ----
export const HSuddenSlow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="tile"
  cam={{ at: [0, 0.22, 0.04], az: [0.25, 0.05], el: [0.3, 0.22], r: [0.95, 0.8], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="ASK YOURSELF ONE THING" title="ALL AT ONCE · OR SLOW?" col={AMB} />}>{(tt) => {
  const drop = cl(phys(tt, 2.6, 7, 0.4)), gone = eio(tt, 3.1, 3.6), w = lerp(0.9 - 0.12 * cl(tt / 2.6), 0.0, gone), sw = tt * (1.5 + 6 * gone);
  return <>
    <Bowl glass water={w} p={[0, 0, 0]} />
    {Array.from({ length: 3 }, (_, i) => <mesh key={i} position={[0, 0.17 + 0.14 * w + 0.002, 0]} rotation={[-PI / 2, 0, sw + i * 2.1]}><ringGeometry args={[0.02 + i * 0.03, 0.026 + i * 0.03, 40, 1, 0, PI * 1.2]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.35 * (1 - gone * 0.5)} depthWrite={false} /></mesh>)}
    {/* el trapo: cae arrugado y se hunde con el agua */}
    <group position={[0, lerp(0.7, 0.2 + 0.14 * w, drop), 0]} rotation={[0.4 * (1 - drop), tt * 0.3, 0.2]}>
      <mesh scale={[1, 0.35, 0.8]} castShadow><icosahedronGeometry args={[0.06, 1]} />{M.matte({ col: "#d98a3a" })}</mesh>
    </group>
    {gone > 0 && gone < 1 && <mesh position={[0, 0.12, 0.02]}><cylinderGeometry args={[0.03, 0.01, 0.12, 20, 1, true]} />{M.water({ op: 0.6, emI: 0.4 })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 9:34 · LO QUE SAQUÉ: del caño salen rebotando uno por uno un patito, un autito, un cepillo y una pelota; la cámara sigue al pato ----
const Duck: React.FC = () => <group>
  <mesh scale={[1.2, 0.9, 1]} castShadow><sphereGeometry args={[0.05, 24, 16]} />{M.plastic({ col: "#f2c230" })}</mesh>
  <mesh position={[0.04, 0.05, 0]} castShadow><sphereGeometry args={[0.032, 20, 14]} />{M.plastic({ col: "#f2c230" })}</mesh>
  <mesh position={[0.076, 0.045, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.014, 0.03, 12]} />{M.plastic({ col: "#e6762a" })}</mesh>
  {[-1, 1].map((s) => <mesh key={s} position={[0.055, 0.06, s * 0.02]}><sphereGeometry args={[0.005, 10, 8]} />{M.matte({ col: "#111" })}</mesh>)}
</group>;
export const HToyParade: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="dark"
  cam={{ at: [-0.25, 0.1, 0], at1: [0.25, 0.06, 0], az: [-0.2, 0.15], el: [0.2, 0.14], r: [1.1, 0.95], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="THINGS I'VE PULLED OUT" title="SOAP WON'T FIX A DUCK" col={AMB} />}>{(tt) => {
  const go = (i: number) => { const a = 0.5 + i * 1.1, k = cl((tt - a) / 1.6), x = -0.42 + 0.25 * k + 0.3 * i * 0.0 + (0.6 - i * 0.12) * k, y = 0.06 + 0.15 * Math.abs(Math.sin(PI * 2.2 * k)) * (1 - k); return { k, x, y, a }; };
  return <>
    <mesh position={[-0.56, 0.08, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.09, 0.09, 0.2, 48, 1, true]} />{M.pvc({ col: "#cfcabd", side: THREE.DoubleSide })}</mesh>
    <mesh position={[-0.46, 0.08, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.09, 0.012, 12, 48]} />{M.pvc({ col: "#cfcabd" })}</mesh>
    {[0, 1, 2, 3].map((i) => { const { k, x, y } = go(i); if (k <= 0) return null; return <group key={i} position={[x, y, 0.12 * (i % 2 ? 1 : -1) * k]} rotation={[0, 0, -k * 6 * (i === 3 ? 1 : 0.15)]}>
      {i === 0 && <Duck />}
      {i === 1 && <group><RBox s={[0.12, 0.04, 0.06]} r={0.012} p={[0, 0.02, 0]}>{M.plastic({ col: RED })}</RBox><RBox s={[0.06, 0.03, 0.05]} r={0.01} p={[-0.01, 0.05, 0]}>{M.glass({ op: 0.5 })}</RBox>{[-1, 1].map((sx) => [-1, 1].map((sz) => <mesh key={sx + "" + sz} position={[sx * 0.04, 0.0, sz * 0.032]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.014, 0.014, 0.01, 16]} />{M.rubber({ col: "#222" })}</mesh>))}</group>}
      {i === 2 && <group rotation={[0, 0.3, PI / 2.2]}><mesh><cylinderGeometry args={[0.009, 0.009, 0.16, 12]} />{M.plastic({ col: "#3a8ad0" })}</mesh><RBox s={[0.018, 0.03, 0.014]} r={0.004} p={[0, 0.09, 0.006]}>{M.matte({ col: "#f2f2f2" })}</RBox></group>}
      {i === 3 && <mesh castShadow><sphereGeometry args={[0.04, 24, 16]} />{M.plastic({ col: "#3fae6a" })}</mesh>}
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 10:07 · LA SOPAPA CORRECTA: dos bocas curvas de porcelana; la sopapa plana no sella y escapan burbujas; la de manga se mete en la boca y sella ----
const Plunger: React.FC<{ p: number[]; flange?: boolean; press: number }> = ({ p, flange, press }) => <group position={p as [number, number, number]}>
  <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.011, 0.011, 0.36, 16]} />{M.wood({ base: [150, 100, 58] })}</mesh>
  <mesh position={[0, 0.05, 0]} scale={[1 + 0.18 * press, 0.85 - 0.25 * press, 1 + 0.18 * press]}><sphereGeometry args={[0.07, 32, 16, 0, 2 * PI, 0, PI / 2]} />{M.rubber({ col: "#b82a22" })}</mesh>
  {flange && <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.035, 0.03, 0.05, 24, 1, true]} />{M.rubber({ col: "#9a221c" })}</mesh>}
</group>;
export const HSealFit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark"
  cam={{ at: [0, 0.06, 0], az: [0.0, 0.1], el: [0.24, 0.18], r: [1.0, 0.86], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="A TOILET HOLE IS CURVED" title="FLAT CUP · NO SEAL" col={RED} />}>{(tt) => {
  const down = eio(tt, 0.5, 1.4), press = 0.5 + 0.5 * Math.sin(tt * 4) * cl((tt - 1.4) / 0.3), good = cl((tt - 2.4) / 0.5);
  return <>
    {[-0.24, 0.24].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, -0.02, 0]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.15, 48, 24, 0, 2 * PI, PI / 2, PI / 2]} />{M.porcelain({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, -0.055, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.035, 32]} />{M.matte({ col: "#0a0a0b" })}</mesh>
      <mesh position={[0, -0.03, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.14, 48]} />{M.water({ op: 0.4 })}</mesh>
      <Plunger p={[0, lerp(0.35, -0.06 - (i ? 0.02 : 0), down), 0]} flange={i === 1} press={press * down} />
      {i === 0 && down > 0.9 && Array.from({ length: 8 }, (_, j) => { const k = ((tt * 0.9 + j / 8) % 1); return <mesh key={j} position={[Math.cos(j * 0.8) * 0.075, -0.03 + 0.12 * k, Math.sin(j * 0.8) * 0.075]}><sphereGeometry args={[0.006 + 0.004 * rn(j, 2), 10, 8]} /><meshPhysicalMaterial color="#e9f3ff" roughness={0} transparent opacity={0.6 * (1 - k)} depthWrite={false} /></mesh>; })}
      {i === 1 && <mesh position={[0, -0.025, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.072, 0.078, 48]} />{M.glow({ col: "#7fd8a0", op: 0.7 * good })}</mesh>}
      {i === 0 && <mesh position={[0, -0.025, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.072, 0.078, 48]} />{M.glow({ col: RED, op: 0.7 * good })}</mesh>}
    </group>)}
  </>;
}}</Scene3D>;

// ---- 11:17 · NADA DE QUÍMICOS: un brazo sobre la taza; el químico cae y salta una corona de gotas; una gota toca el antebrazo y deja una marca roja ----
export const HChemSplash: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="tile"
  cam={{ at: [0.02, 0.32, 0.05], az: [0.35, 0.15], el: [0.26, 0.2], r: [0.9, 0.78], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="MISTAKE NUMBER TWO" title="NO CHEMICALS · EVER" col={RED} />}>{(tt) => {
  const tilt = eio(tt, 0.4, 1.0) * (1 - eio(tt, 2.0, 2.4)), cr = cl((tt - 1.3) / 0.7), mk = cl((tt - 2.1) / 0.8), dk = cl((tt - 1.5) / 0.6);
  return <>
    <Bowl p={[0, 0, 0]} water={0.6} wcol="#9ab83a" />
    <group position={[-0.2, 0.52, 0.02]} rotation={[0, 0, -1.6 * tilt]}>
      <RBox s={[0.07, 0.16, 0.05]} r={0.012}>{M.plastic({ col: "#3a2a8a" })}</RBox>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.014, 0.018, 0.04, 16]} />{M.plastic({ col: RED })}</mesh>
    </group>
    {tilt > 0.7 && <mesh geometry={tubeG("d_chem", [[-0.11, 0.5, 0.02], [-0.06, 0.42, 0.02], [-0.02, 0.32, 0.02], [0, 0.26, 0.02]], 0.006, 24, 8)}><meshPhysicalMaterial color="#c8e03a" roughness={0} emissive="#9ab020" emissiveIntensity={0.4} /></mesh>}
    {cr > 0 && cr < 1 && Array.from({ length: 14 }, (_, i) => { const a = i * 2 * PI / 14; return <mesh key={i} position={[Math.cos(a) * 0.08 * cr, 0.26 + 0.1 * Math.sin(PI * cr), 0.02 + Math.sin(a) * 0.08 * cr]}><sphereGeometry args={[0.006, 10, 8]} /><meshPhysicalMaterial color="#c8e03a" roughness={0} /></mesh>; })}
    {/* el antebrazo apoyado en el borde */}
    <group position={[0.16, 0.36, 0.12]} rotation={[0, -0.6, PI / 2 - 0.15]}>
      <mesh castShadow><capsuleGeometry args={[0.032, 0.26, 10, 20]} />{M.matte({ col: SKIN })}</mesh>
      <mesh position={[0.033, 0.02, 0]} rotation={[0, 0, PI / 2]} scale={[0.001 + mk, 0.001 + mk, 0.4]}><sphereGeometry args={[0.02, 16, 12]} /><meshStandardMaterial color="#c83a2a" roughness={0.6} transparent opacity={0.85} /></mesh>
    </group>
    {dk > 0 && dk < 1 && <mesh position={[lerp(0.04, 0.18, dk), 0.3 + 0.12 * Math.sin(PI * dk), lerp(0.02, 0.12, dk)]}><sphereGeometry args={[0.008, 10, 8]} /><meshPhysicalMaterial color="#c8e03a" roughness={0} emissive="#9ab020" emissiveIntensity={0.5} /></mesh>}
  </>;
}}</Scene3D>;
