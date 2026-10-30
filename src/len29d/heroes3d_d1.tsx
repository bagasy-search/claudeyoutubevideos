// len29d · 2ª vuelta en 3D real (kit h3d): despertador, maqueta, taza, mano, llave, boya, vitrina, frasco, sifón, tapón, ascensor.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, RED, H } from "./hkit";
import { M, RBox, Scene3D, cl, curve, eio, lerp, phys, rn, tex, tubeG } from "./h3d";

export const PI = Math.PI;
const GC: Record<string, THREE.BufferGeometry> = {};
export const geo = (k: string, f: () => THREE.BufferGeometry) => GC[k] || (GC[k] = f());
const SKIN = "#d8a888";

// ---- piezas compartidas del mundo inodoro ----
// la taza: torneado de porcelana, ovalada, con aro, pie y agua adentro
export const Bowl: React.FC<{ water?: number; wcol?: string; glass?: boolean; p?: number[]; s?: number }> = ({ water = 0.55, wcol, glass, p = [0, 0, 0], s = 1 }) => {
  const g = geo("bowl", () => new THREE.LatheGeometry([[0.05, 0.16], [0.07, 0.17], [0.11, 0.21], [0.15, 0.27], [0.165, 0.31], [0.16, 0.325], [0.145, 0.32]].map(([x, y]) => new THREE.Vector2(x, y)), 64));
  return <group position={p as [number, number, number]} scale={[s, s, s * 1.22]}>
    <mesh geometry={g} castShadow receiveShadow>{glass ? M.glass({ op: 0.22, side: THREE.DoubleSide }) : M.porcelain({ side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.08, -0.01]} castShadow><cylinderGeometry args={[0.07, 0.1, 0.16, 48]} />{glass ? M.glass({ op: 0.18 }) : M.porcelain()}</mesh>
    <mesh position={[0, 0.17 + 0.14 * water, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.06 + 0.1 * water, 48]} />{M.water({ op: 0.75, col: wcol })}</mesh>
  </group>;
};
// el tanque: caja de porcelana con tapa y manija cromada a la izquierda
export const Tank: React.FC<{ p?: number[]; lid?: number; handle?: number; cut?: boolean }> = ({ p = [0, 0.48, -0.22], lid = 0, handle = 0, cut }) => <group position={p as [number, number, number]}>
  {cut ? <>
    {[[-0.18, 0], [0.18, 0]].map(([x], i) => <RBox key={i} s={[0.02, 0.3, 0.16]} r={0.006} p={[x, 0, 0]}>{M.porcelain()}</RBox>)}
    <RBox s={[0.38, 0.3, 0.02]} r={0.006} p={[0, 0, -0.07]}>{M.porcelain()}</RBox>
    <RBox s={[0.38, 0.02, 0.16]} r={0.006} p={[0, -0.14, 0]}>{M.porcelain()}</RBox>
    <mesh position={[0, 0, 0.08]}><planeGeometry args={[0.36, 0.28]} />{M.glass({ op: 0.12, side: THREE.DoubleSide })}</mesh>
  </> : <RBox s={[0.38, 0.3, 0.16]} r={0.014}>{M.porcelain()}</RBox>}
  <RBox s={[0.4, 0.03, 0.18]} r={0.01} p={[0, 0.165 + 0.12 * lid, 0.02 * lid]} rot={[-0.5 * lid, 0, 0]}>{M.porcelain()}</RBox>
  <group position={[-0.15, 0.1, 0.085]} rotation={[0, 0, -0.5 * handle]}>
    <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.014, 0.014, 0.012, 24]} />{M.chrome()}</mesh>
    <RBox s={[0.08, 0.014, 0.012]} r={0.005} p={[0.035, 0, 0.012]}>{M.chrome()}</RBox>
  </group>
</group>;
// la mano: palma + cuatro dedos + pulgar; curl cierra los dedos
export const Hand: React.FC<{ p?: number[]; rot?: number[]; curl?: number; s?: number; col?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], curl = 0, s = 1, col = SKIN }) => <group position={p as [number, number, number]} rotation={rot as [number, number, number]} scale={s}>
  <RBox s={[0.075, 0.085, 0.026]} r={0.012} p={[0, 0.06, 0]}>{M.matte({ col })}</RBox>
  <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.03, 0.034, 0.08, 20]} />{M.matte({ col: "#3c4a5c" })}</mesh>
  {[-0.027, -0.009, 0.009, 0.027].map((x, i) => <group key={i} position={[x, 0.015, 0]} rotation={[curl * 1.4, 0, 0]}>
    <mesh position={[0, -0.025 + 0.004 * Math.abs(i - 1.5), 0]} castShadow><capsuleGeometry args={[0.0085, 0.04 - 0.004 * Math.abs(i - 1.5), 6, 12]} />{M.matte({ col })}</mesh>
  </group>)}
  <mesh position={[0.045, 0.045, 0.008]} rotation={[0, 0, 0.8 - 0.5 * curl]} castShadow><capsuleGeometry args={[0.009, 0.035, 6, 12]} />{M.matte({ col })}</mesh>
</group>;
// la llavecita de paso cromada contra la pared, con manija ovalada
export const Valve: React.FC<{ p?: number[]; turn?: number; crust?: number; em?: number }> = ({ p = [0, 0.1, -1.5], turn = 0, crust = 0, em = 0 }) => <group position={p as [number, number, number]}>
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.01, 32]} />{M.chrome()}</mesh>
  <mesh position={[0, 0, 0.04]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.014, 0.016, 0.08, 24]} />{M.chrome({ em: "#ffffff", emI: em })}</mesh>
  <mesh position={[0, 0.06, 0.06]}><cylinderGeometry args={[0.006, 0.006, 0.12, 12]} />{M.chrome()}</mesh>
  <group position={[0, 0, 0.085]} rotation={[0, 0, turn]}>
    <mesh scale={[1.7, 1, 0.5]}><sphereGeometry args={[0.022, 24, 16]} />{M.chrome({ em: "#ffffff", emI: em })}</mesh>
  </group>
  {crust > 0 && Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[Math.cos(i * 1.7) * 0.018, Math.sin(i * 1.7) * 0.018, 0.01 + 0.06 * rn(i, 2)]} scale={crust}><octahedronGeometry args={[0.006 + 0.004 * rn(i, 3)]} />{M.matte({ col: i % 2 ? "#e6e2d4" : "#c9c3ae" })}</mesh>)}
</group>;
const wallpaper = () => tex.text("d_wp", 512, 512, (g) => { g.fillStyle = "#3a2a22"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(214,170,96,.35)"; g.lineWidth = 3; for (let x = 0; x < 512; x += 64) for (let y = 0; y < 512; y += 64) { g.beginPath(); g.moveTo(x + 32, y + 6); g.quadraticCurveTo(x + 58, y + 32, x + 32, y + 58); g.quadraticCurveTo(x + 6, y + 32, x + 32, y + 6); g.stroke(); } });

// ---- 0:08 · LAS SEIS DE LA MAÑANA: despertador de campanas sobre la mesa de luz; al lado, una taza de vidrio cuya agua sube atada a la aguja y acelera ----
export const HDawnClock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" warm={0.7}
  cam={{ at: [0.05, 0.2, 0], az: [-0.3, 0.12], el: [0.18, 0.12], r: [1.15, 0.98], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="6:00 A.M." title="IT'S COMING UP" col={RED} />}>{(tt) => {
  const u = cl(tt / 6.2), ang = (u < 0.5 ? u * 0.6 : 0.3 + (u - 0.5) * 2.6) * 2 * PI, ring = cl((tt - 4.4) / 0.2), sh = ring * Math.sin(tt * 70) * 0.06, lvl = cl(ang / (2 * PI) / 1.6);
  return <>
    <group position={[-0.17, 0.0, 0.02]} rotation={[0, 0.35, sh]}>
      <mesh position={[0, 0.17, 0]} rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.12, 0.12, 0.07, 56]} />{M.plastic({ col: "#b42a22" })}</mesh>
      <mesh position={[0, 0.17, 0.036]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.105, 0.105, 0.004, 56]} />{M.porcelain()}</mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i * PI / 6) * 0.09, 0.17 + Math.cos(i * PI / 6) * 0.09, 0.04]} rotation={[0, 0, -i * PI / 6]}><boxGeometry args={[0.004, i % 3 ? 0.01 : 0.02, 0.002]} />{M.matte({ col: "#1a1a1a" })}</mesh>)}
      <mesh position={[0, 0.17, 0.042]} rotation={[0, 0, -ang]}><boxGeometry args={[0.005, 0.16, 0.002]} />{M.matte({ col: "#1a1a1a" })}</mesh>
      <mesh position={[0, 0.17, 0.044]} rotation={[0, 0, -ang / 12 - 0.9]}><boxGeometry args={[0.008, 0.1, 0.002]} />{M.matte({ col: "#1a1a1a" })}</mesh>
      {[-1, 1].map((s) => <group key={s} position={[s * 0.075, 0.31, 0]} rotation={[0, 0, -s * 0.5 + sh * 2]}>
        <mesh castShadow><sphereGeometry args={[0.048, 32, 16, 0, 2 * PI, 0, PI / 2]} />{M.brass({ col: "#d4a24a", side: THREE.DoubleSide })}</mesh>
      </group>)}
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, sh * 8]}><boxGeometry args={[0.006, 0.05, 0.006]} />{M.brass()}</mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.07, 0.04, 0]} rotation={[0, 0, s * 0.4]}><cylinderGeometry args={[0.008, 0.012, 0.08, 12]} />{M.brass()}</mesh>)}
    </group>
    {/* la taza de vidrio: el agua sube con la aguja */}
    <group position={[0.2, 0, 0.04]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.07, 0.06, 0.24, 48, 1, true]} />{M.glass({ op: 0.2, side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.06, 0.06, 0.006, 48]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.006 + 0.11 * lvl, 0]} scale={[1, 0.001 + lvl, 1]}><cylinderGeometry args={[0.066, 0.06, 0.22, 48]} />{M.water({ op: 0.6 })}</mesh>
      <mesh position={[0, 0.235, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.003, 8, 48]} />{M.glow({ col: RED, op: 0.4 + 0.6 * lvl })}</mesh>
    </group>
    <pointLight position={[-0.17, 0.32, 0.25]} intensity={0.25 * ring} distance={0.6} color="#ffcf8a" />
  </>;
}}</Scene3D>;

// ---- 0:24 · POR DELANTE DE TODOS: maqueta de la casa sin techo vista desde arriba; una figurita en puntas de pie con linterna cruza el pasillo entre las camas ----
export const HQuietPath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none"
  cam={{ at: [0, 0.02, 0], az: [0.6, 0.35], el: [0.95, 0.82], r: [1.3, 1.1], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="NOBODY CAN HEAR YOU" title="PAST EVERYBODY" col={AMB} />}>{(tt) => {
  const path = [[-0.36, 0, 0.2], [-0.1, 0, 0.2], [0.05, 0, 0.05], [0.05, 0, -0.12], [0.3, 0, -0.16]], c = curve(path), u = eio(tt, 0.6, 5.4), pp = c.getPointAt(u), tg = c.getTangentAt(u), step = Math.abs(Math.sin(tt * 7));
  const walls: number[][] = [[0, -0.3, 0.9, 0.02], [0, 0.32, 0.9, 0.02], [-0.45, 0.01, 0.02, 0.62], [0.45, 0.01, 0.02, 0.62], [-0.18, -0.12, 0.02, 0.36], [0.2, 0.2, 0.02, 0.24], [0.28, 0.01, 0.34, 0.02]];
  return <>
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.9, 0.62]} /><meshStandardMaterial map={tex.wood(4, 4, [138, 106, 72])} roughness={0.7} /></mesh>
    {walls.map(([x, z, w, d], i) => <RBox key={i} s={[w, 0.09, d]} r={0.003} p={[x, 0.045, z]}>{M.matte({ col: "#efe9dc" })}</RBox>)}
    {[[-0.32, -0.12], [0.32, 0.18]].map(([x, z], i) => <group key={i} position={[x, 0, z]}>
      <RBox s={[0.16, 0.035, 0.22]} r={0.01} p={[0, 0.02, 0]}>{M.wood({ base: [90, 58, 36] })}</RBox>
      <RBox s={[0.15, 0.02, 0.17]} r={0.012} p={[0, 0.045, 0.02]}>{M.matte({ col: i ? "#6a7fa8" : "#a86a6a" })}</RBox>
      <mesh position={[0, 0.06 + 0.003 * Math.sin(tt * 1.4 + i), 0.02]} scale={[1, 0.45, 1.6]}><sphereGeometry args={[0.045, 20, 14]} />{M.matte({ col: i ? "#6a7fa8" : "#a86a6a" })}</mesh>
      <RBox s={[0.1, 0.02, 0.04]} r={0.01} p={[0, 0.05, -0.08]}>{M.matte({ col: "#f2efe8" })}</RBox>
    </group>)}
    {/* la figurita en puntas de pie */}
    <group position={[pp.x, 0.01 * step, pp.z]} rotation={[0, Math.atan2(tg.x, tg.z), 0]}>
      <group scale={2}><mesh position={[0, 0.07, 0]} castShadow><capsuleGeometry args={[0.014, 0.05, 6, 12]} />{M.matte({ col: "#2f4a6a" })}</mesh>
      <mesh position={[0, 0.12, 0]} castShadow><sphereGeometry args={[0.014, 16, 12]} />{M.matte({ col: SKIN })}</mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.007, 0.025, 0.006 * s * Math.sin(tt * 7)]}><capsuleGeometry args={[0.005, 0.035, 4, 8]} />{M.matte({ col: "#2a2a2c" })}</mesh>)}
      <mesh position={[0.016, 0.085, 0.02]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.004, 0.004, 0.025, 10]} />{M.steel()}</mesh>
      <mesh position={[0.016, 0.075, 0.1]} rotation={[-PI / 2 - 0.3, 0, 0]}><coneGeometry args={[0.04, 0.14, 24, 1, true]} /><meshBasicMaterial color="#fff3c8" transparent opacity={0.12} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      <pointLight position={[0.016, 0.05, 0.12]} intensity={0.25} distance={0.3} color="#fff0c0" />
    </group></group>
  </>;
}}</Scene3D>;

// ---- 0:55 · UNA TAZA: taza medidora de vidrio; un hilo espeso de detergente cae de la botella, la taza se llena con burbujas y la línea 1 CUP brilla ----
const cupTex = (glow: number) => tex.text("d_cup" + Math.round(glow * 4), 256, 256, (g) => { g.clearRect(0, 0, 256, 256); g.fillStyle = glow > 0.5 ? "#ffd27a" : "rgba(255,255,255,.75)"; g.font = "bold 40px Arial"; g.fillRect(20, 60, 70, 6); g.fillText("1 CUP", 100, 76); g.fillRect(20, 150, 40, 4); g.fillRect(20, 220, 40, 4); });
export const HOneCup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile"
  cam={{ at: [0, 0.2, 0], az: [-0.25, 0.1], el: [0.2, 0.14], r: [1.2, 1.05], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="SOMETHING YOU ALREADY OWN" title="ONE CUP" col={AMB} />}>{(tt) => {
  const tilt = eio(tt, 0.4, 1.2) * (1 - eio(tt, 4.4, 5.0)), lvl = eio(tt, 1.2, 4.4), glow = cl((tt - 4.2) / 0.4);
  return <>
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.085, 0.075, 0.22, 56, 1, true]} />{M.glass({ op: 0.3, side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.004, 0]}><cylinderGeometry args={[0.075, 0.075, 0.008, 56]} />{M.glass({ op: 0.35 })}</mesh>
      <mesh position={[0.1, 0.13, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.045, 0.01, 12, 32, PI]} />{M.glass({ op: 0.35 })}</mesh>
      <mesh position={[0, 0.008 + 0.075 * lvl, 0]} scale={[1, 0.001 + lvl, 1]}><cylinderGeometry args={[0.08, 0.075, 0.15, 48]} /><meshPhysicalMaterial color="#3fae6a" roughness={0.05} transmission={0.5} thickness={0.1} transparent opacity={0.85} /></mesh>
      <mesh position={[0, 0.11, 0.0805]}><planeGeometry args={[0.13, 0.13]} /><meshBasicMaterial map={cupTex(glow)} transparent depthWrite={false} /></mesh>
      {Array.from({ length: 10 }, (_, i) => { const k = ((tt * 0.4 + i / 10) % 1); return lvl > 0.1 ? <mesh key={i} position={[Math.cos(i * 2.1) * 0.05, 0.01 + 0.15 * lvl * k, Math.sin(i * 2.1) * 0.05]}><sphereGeometry args={[0.006 + 0.004 * rn(i, 2), 10, 8]} /><meshPhysicalMaterial color="#e8fff0" roughness={0} transparent opacity={0.6} iridescence={1} depthWrite={false} /></mesh> : null; })}
      <pointLight position={[0, 0.17, 0.15]} intensity={0.2 * glow} distance={0.3} color="#ffd27a" />
    </group>
    {/* la botella de detergente que se inclina */}
    <group position={[-0.12, 0.42, 0]} rotation={[0, 0, -2.0 * tilt]}>
      <RBox s={[0.08, 0.17, 0.05]} r={0.02}>{M.plastic({ col: "#2f8a52" })}</RBox>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.012, 0.02, 0.04, 20]} />{M.plastic({ col: "#f2f2f2" })}</mesh>
    </group>
    {tilt > 0.8 && <mesh geometry={tubeG("d_det", [[-0.03, 0.4, 0], [-0.01, 0.3, 0], [0.0, 0.2, 0], [0.0, 0.01 + 0.15 * lvl, 0]], (u) => 0.007 + 0.003 * u, 30, 10)}><meshPhysicalMaterial color="#3fae6a" roughness={0.05} transmission={0.4} /></mesh>}
  </>;
}}</Scene3D>;

// ---- 1:45 · NO TIRES DE NUEVO: la mano baja a la manija dos veces y el agua de la taza sube un escalón cada vez; a la tercera frena a un dedo y la manija se pone roja ----
export const HHandOff: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="tile"
  cam={{ at: [-0.05, 0.36, 0], az: [-0.4, -0.2], el: [0.22, 0.16], r: [1.25, 1.1], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="EVERYBODY DOES IT" title="DON'T FLUSH AGAIN" col={RED} />}>{(tt) => {
  const pr = (a: number) => eio(tt, a, a + 0.35) * (1 - eio(tt, a + 0.5, a + 0.9)), p1 = pr(0.6), p2 = pr(2.0), app = eio(tt, 3.6, 4.3), stop = cl((tt - 4.3) / 0.2);
  const w = 0.55 + 0.17 * cl((tt - 1.0) / 0.6) + 0.17 * cl((tt - 2.4) / 0.6), hd = Math.max(p1, p2), tremble = stop * 0.003 * Math.sin(tt * 40);
  return <>
    <Bowl water={w} p={[0, 0, 0.04]} />
    <Tank p={[0, 0.48, -0.2]} handle={hd} />
    <mesh position={[-0.15, 0.58, -0.105]}><sphereGeometry args={[0.03, 16, 12]} /><meshBasicMaterial color={RED} transparent opacity={0.45 * stop} depthWrite={false} /></mesh>
    <Hand p={[lerp(-0.36, -0.165, Math.max(hd, app * 0.82)) + tremble, 0.6 - 0.045 * hd, -0.09]} rot={[0, 0.25, PI / 2]} curl={0.25} s={1.1} />
    {w > 0.85 && [0, 1, 2].map((i) => { const k = ((tt * 1.2 + i / 3) % 1); return <mesh key={i} position={[0.12 - 0.1 * i, 0.33 - 0.25 * k * k, 0.2]}><sphereGeometry args={[0.008, 10, 8]} />{M.water({ op: 0.85 })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 2:02 · LA LLAVECITA: pared de azulejos a oscuras; el cono de la linterna barre con polvo flotando, encuentra la llave cromada al ras del piso, destella y gira ----
export const HValveHunt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="tile" warm={0.3}
  cam={{ at: [0, 0.14, -1.4], az: [0.12, -0.05], el: [0.16, 0.12], r: [0.8, 0.66], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="DOWN LOW, NEAR THE FLOOR" title="THE LITTLE VALVE" col={AMB} />}>{(tt) => {
  const sx = lerp(0.35, -0.1, eio(tt, 0.4, 2.2)) + 0.1 * eio(tt, 2.2, 2.8), sy = lerp(0.36, 0.1, eio(tt, 1.6, 2.8)), found = cl((tt - 2.8) / 0.3), turn = eio(tt, 3.6, 5.0) * PI / 2;
  const src = [0.25, 0.42, -0.6], dx = sx - src[0], dy = sy - src[1], dz = -1.5 - src[2], L = Math.hypot(dx, dy, dz);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx, dy, dz).normalize());
  return <>
    <group position={[0, 0.1, -1.56]} scale={1.8}><Valve p={[0, 0, 0]} turn={turn} em={0.6 * found * (0.6 + 0.4 * Math.sin(tt * 6))} /></group>
    <mesh position={[src[0] + dx / 2, src[1] + dy / 2, src[2] + dz / 2]} quaternion={q}><cylinderGeometry args={[0.1, 0.012, L, 32, 1, true]} /><meshBasicMaterial color="#fff2c8" transparent opacity={0.05} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    <mesh position={[sx, sy, -1.575]}><circleGeometry args={[0.1, 40]} /><meshBasicMaterial color="#fff2c8" transparent opacity={0.1} depthWrite={false} /></mesh>
    <pointLight position={[sx, sy, -1.45]} intensity={0.3} distance={0.35} color="#fff2c8" />
    {Array.from({ length: 30 }, (_, i) => { const k = rn(i, 2), y = src[1] + dy * k + 0.03 * Math.sin(tt * 0.7 + i); return <mesh key={i} position={[src[0] + dx * k + 0.05 * (rn(i, 3) - 0.5) * k, y, src[2] + dz * k + 0.05 * (rn(i, 4) - 0.5)]}><sphereGeometry args={[0.0018, 6, 4]} /><meshBasicMaterial color="#fff" transparent opacity={0.5} depthWrite={false} /></mesh>; })}
    <group position={[src[0] + 0.03, src[1], src[2] + 0.08]} quaternion={q}><mesh><cylinderGeometry args={[0.022, 0.018, 0.14, 20]} />{M.plastic({ col: "#222428" })}</mesh></group>
  </>;
}}</Scene3D>;

// ---- 2:31 · LEVANTÁ LA BOYA: tanque de porcelana en corte; el chorro de la válvula llena; la mano sube el brazo de la boya y el chorro se corta ----
export const HFloatLift: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="tile"
  cam={{ at: [0, 0.48, -0.2], az: [0.0, 0.1], el: [0.12, 0.08], r: [0.95, 0.85], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="NO VALVE? NO PROBLEM" title="LIFT THE FLOAT" col={AMB} />}>{(tt) => {
  const lift = eio(tt, 2.2, 3.2), flow = 1 - cl((tt - 3.0) / 0.25), lvl = 0.35 + 0.25 * eio(tt, 0, 3.0), arm = -0.25 + 0.55 * lift;
  return <>
    <Bowl p={[0, 0, 0.06]} />
    <Tank p={[0, 0.48, -0.2]} cut lid={1} />
    <group position={[0, 0.48, -0.2]}>
      <mesh position={[0, -0.135 + 0.13 * lvl, 0]} scale={[1, 0.001 + lvl, 1]}><boxGeometry args={[0.34, 0.26, 0.13]} />{M.water({ op: 0.45 })}</mesh>
      <mesh position={[0.11, -0.03, 0]}><cylinderGeometry args={[0.014, 0.014, 0.22, 20]} />{M.plastic({ col: "#5a5f66" })}</mesh>
      <group position={[0.11, 0.08, 0]} rotation={[0, 0, arm]}>
        <mesh position={[-0.08, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.16, 10]} />{M.brass()}</mesh>
        <mesh position={[-0.17, 0, 0]}><sphereGeometry args={[0.035, 24, 16]} />{M.plastic({ col: "#d05030" })}</mesh>
      </group>
      {flow > 0 && <mesh position={[0.11, 0.0, 0.0]}><cylinderGeometry args={[0.004, 0.006, 0.2, 10, 1, true]} />{M.water({ op: 0.7 * flow, emI: 0.5 })}</mesh>}
      <mesh position={[-0.05, -0.08, 0]}><cylinderGeometry args={[0.02, 0.02, 0.1, 20]} />{M.plastic({ col: "#5a5f66" })}</mesh>
    </group>
    <Hand p={[-0.03, lerp(0.85, 0.6, eio(tt, 1.2, 2.2)) + 0.1 * lift, -0.2]} rot={[0, 0, PI]} curl={0.7 * eio(tt, 1.8, 2.2)} s={1.05} />
  </>;
}}</Scene3D>;

// ---- 2:51 · LA LÍQUIDA: vitrina de vidrio con tres envases; un foco barre; el polvo y la cápsula se apagan y la botella de líquido se enciende ----
export const HLiquidOnly: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark" warm={0.45}
  cam={{ at: [0, 0.2, 0], az: [-0.18, 0.18], el: [0.14, 0.1], r: [1.15, 1.0], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="NOT THE DISHWASHER KIND" title="THE LIQUID ONE" col={AMB} />}>{(tt) => {
  const sx = lerp(-0.4, 0.4, eio(tt, 0.4, 3.0)), dim = (x: number) => cl((tt - 1.0 - (x + 0.25) * 4) / 0.5), win = cl((tt - 3.2) / 0.5);
  return <>
    <RBox s={[0.8, 0.02, 0.26]} r={0.005} p={[0, 0.06, 0]}>{M.wood({ base: [58, 38, 24] })}</RBox>
    <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.82, 0.3, 0.28]} />{M.glass({ op: 0.08, side: THREE.DoubleSide })}</mesh>
    {/* la caja de polvo */}
    <group position={[-0.25, 0.07, 0]}><RBox s={[0.12, 0.15, 0.07]} r={0.006} p={[0, 0.075, 0]}>{M.matte({ col: lerp(1, 0.3, dim(-0.25)) > 0.5 ? "#e8a03a" : "#5a4024" })}</RBox></group>
    {/* la cápsula */}
    <group position={[0, 0.11, 0]}>
      <mesh scale={[1, 0.7, 1]}><sphereGeometry args={[0.045, 24, 16]} /><meshPhysicalMaterial color={dim(0) > 0.5 ? "#2a3440" : "#4a8ad0"} roughness={0.1} clearcoat={1} /></mesh>
      <mesh position={[0, 0.0, 0.0]} scale={[1.02, 0.25, 1.02]}><sphereGeometry args={[0.045, 24, 16]} />{M.plastic({ col: dim(0) > 0.5 ? "#3a3020" : "#f2c230" })}</mesh>
    </group>
    {/* la botella de líquido */}
    <group position={[0.25, 0.07, 0]}>
      <RBox s={[0.08, 0.17, 0.05]} r={0.02} p={[0, 0.085, 0]}><meshPhysicalMaterial color="#3fae6a" roughness={0.1} transmission={0.5} emissive="#3fae6a" emissiveIntensity={0.25 * win} /></RBox>
      <mesh position={[0, 0.19, 0]}><cylinderGeometry args={[0.012, 0.02, 0.04, 20]} />{M.plastic({ col: "#f2f2f2" })}</mesh>
    </group>
    <mesh position={[sx, 0.62, 0.15]} rotation={[0.25, 0, 0]}><coneGeometry args={[0.13, 0.55, 32, 1, true]} /><meshBasicMaterial color="#fff2c8" transparent opacity={0.06} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    <pointLight position={[sx, 0.35, 0.18]} intensity={0.4} distance={0.4} color="#fff2c8" />
    <pointLight position={[0.25, 0.2, 0.2]} intensity={0.2 * win} distance={0.3} color="#9affc0" />
  </>;
}}</Scene3D>;

// ---- 3:17 · SE HUNDE: frasco de agua con refracción; una columna verde y espesa baja y se amontona en el fondo; al lado la balancita se inclina hacia ese lado ----
export const HDenseJar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile"
  cam={{ at: [0.05, 0.2, 0], az: [-0.2, 0.1], el: [0.18, 0.12], r: [0.95, 0.8], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="THE PART NOBODY TELLS YOU" title="IT SINKS" col={ICE} />}>{(tt) => {
  const pour = eio(tt, 0.5, 3.4), pile = eio(tt, 1.2, 4.2), tip = phys(tt, 4.0, 5, 0.3) * 0.22;
  return <>
    <group position={[-0.1, 0, 0]}>
      <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.1, 0.1, 0.28, 56, 1, true]} />{M.glass({ op: 0.28, side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.284, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.1, 0.004, 8, 56]} />{M.glass({ op: 0.5 })}</mesh>
      <mesh position={[0, 0.125, 0]}><cylinderGeometry args={[0.096, 0.096, 0.24, 48]} />{M.water({ op: 0.3 })}</mesh>
      {pour > 0 && pour < 1 && <mesh geometry={tubeG("d_dj" + Math.round(pour * 20), [[0, 0.42, 0], [0, 0.3, 0], [0.005, 0.12, 0], [0, 0.02 + 0.06 * pile, 0]], 0.008, 30, 10)}><meshPhysicalMaterial color="#3fae6a" roughness={0.1} transmission={0.3} /></mesh>}
      {Array.from({ length: 22 }, (_, i) => { const on = cl(pile * 22 - i); if (on <= 0) return null; const a = i * 2.4, r = 0.065 * Math.sqrt(rn(i, 2)); return <mesh key={i} position={[Math.cos(a) * r, 0.015 + 0.012 * Math.floor(i / 8) + 0.01 * rn(i, 3), Math.sin(a) * r]} scale={[1.4 * on, 0.7 * on, 1.4 * on]}><sphereGeometry args={[0.022, 16, 12]} /><meshPhysicalMaterial color="#3fae6a" roughness={0.1} transmission={0.25} /></mesh>; })}
    </group>
    {/* la balancita: dos platillos, el del detergente baja */}
    <group position={[0.24, 0, 0]} scale={1.5}>
      <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.006, 0.02, 0.16, 16]} />{M.brass()}</mesh>
      <group position={[0, 0.16, 0]} rotation={[0, 0, -tip]}>
        <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.24, 10]} />{M.brass()}</mesh>
        {[-1, 1].map((s) => <group key={s} position={[s * 0.12, -0.04, 0]} rotation={[0, 0, tip]}>
          <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.0015, 0.0015, 0.04, 6]} />{M.brass()}</mesh>
          <mesh><cylinderGeometry args={[0.04, 0.03, 0.006, 32]} />{M.brass()}</mesh>
          <mesh position={[0, 0.015, 0]}><sphereGeometry args={[0.018, 16, 12]} />{s > 0 ? <meshPhysicalMaterial color="#3fae6a" roughness={0.1} /> : M.water({ op: 0.6 })}</mesh>
        </group>)}
      </group>
    </group>
  </>;
}}</Scene3D>;

// ---- 3:35 · ABAJO · ARRIBA · POR ENCIMA: el sifón de la taza como tubo de vidrio; un carrito rojo baja, sube la joroba y cae del otro lado ----
const SIF = [[-0.36, 0.34, 0], [-0.22, 0.08, 0], [-0.08, 0.04, 0], [0.04, 0.24, 0], [0.12, 0.3, 0], [0.2, 0.22, 0], [0.3, -0.02, 0], [0.38, -0.1, 0]];
export const HPorcelainPath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark"
  cam={{ at: [0, 0.14, 0], az: [0.2, -0.08], el: [0.1, 0.06], r: [1.05, 0.92], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="INSIDE THE PORCELAIN" title="DOWN · UP · OVER" col={AMB} />}>{(tt) => {
  const c = curve(SIF), u = tt < 2.4 ? 0.48 * eio(tt, 0.4, 2.4) : tt < 3.4 ? 0.48 + 0.12 * eio(tt, 2.4, 3.4) : 0.6 + 0.4 * cl((tt - 3.4) / 1.2) ** 1.6, p = c.getPointAt(Math.min(0.999, u)), tg = c.getTangentAt(Math.min(0.999, u));
  return <>
    <mesh geometry={tubeG("d_sif", SIF, 0.06, 160, 40)}><meshPhysicalMaterial color="#f4f1ea" roughness={0.1} transmission={0.75} thickness={0.03} transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh geometry={tubeG("d_sif_l", SIF, 0.004, 160, 8)}>{M.glow({ col: AMB, op: 0.35 })}</mesh>
    <group position={[p.x, p.y - 0.03, p.z]} rotation={[0, 0, Math.atan2(tg.y, tg.x)]}>
      <RBox s={[0.06, 0.025, 0.04]} r={0.006} p={[0, 0.015, 0]}>{M.plastic({ col: RED })}</RBox>
      {[-1, 1].map((sx) => [-1, 1].map((sz) => <mesh key={sx + "_" + sz} position={[sx * 0.02, 0, sz * 0.022]} rotation={[PI / 2, 0, tt * 10]}><cylinderGeometry args={[0.009, 0.009, 0.006, 16]} />{M.rubber()}</mesh>))}
    </group>
  </>;
}}</Scene3D>;

// ---- 3:52 · LO HACE RESBALOSO: el tapón de papel prendido a la pared del caño con ganchitos; una gota verde corre y suelta cada gancho; el tapón resbala y deja rastro ----
export const HSlipWall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark"
  cam={{ at: [0.02, 0.1, 0], az: [0.25, -0.1], el: [0.14, 0.1], r: [1.15, 1.0], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="TWO THINGS AT ONCE" title="IT MAKES IT SLIPPERY" col={ICE} />}>{(tt) => {
  const g = eio(tt, 0.5, 3.0), slide = eio(tt, 3.2, 5.4) ** 1.5, x = -0.02 + 0.4 * slide, hooks = 8;
  return <group rotation={[0, 0, -0.18]}>
    <mesh position={[0.05, 0.1, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.08, 0.08, 0.9, 48, 1, true, -PI / 2, PI * 1.25]} />{M.glass({ op: 0.18, side: THREE.DoubleSide })}</mesh>
    <group position={[x, 0.1, 0]}>
      <mesh scale={[1.3, 0.85, 0.85]} castShadow><icosahedronGeometry args={[0.06, 2]} />{M.matte({ col: "#efe9dc" })}</mesh>
      {Array.from({ length: hooks }, (_, i) => { const a = i * 2 * PI / hooks, off = cl(g * hooks * 1.1 - i); return <mesh key={i} position={[-0.02 + 0.04 * (i % 2), Math.sin(a) * (0.062 + 0.012 * (1 - off)), Math.cos(a) * (0.062 + 0.012 * (1 - off))]} rotation={[a, 0, 0]} scale={1 - 0.7 * off}><torusGeometry args={[0.01, 0.002, 6, 12, PI]} />{M.matte({ col: "#cfc8b8" })}</mesh>; })}
    </group>
    {/* la gota verde que da la vuelta al tapón */}
    {g > 0 && g < 1 && <mesh position={[x - 0.03, 0.1 + Math.sin(g * 2 * PI) * 0.072, Math.cos(g * 2 * PI) * 0.072]}><sphereGeometry args={[0.012, 14, 10]} /><meshPhysicalMaterial color="#3fae6a" roughness={0.05} emissive="#3fae6a" emissiveIntensity={0.4} /></mesh>}
    {/* el rastro verde brillante */}
    {slide > 0 && <mesh position={[-0.02 + 0.2 * slide, 0.024, 0]} scale={[0.001 + slide, 1, 1]}><boxGeometry args={[0.4, 0.002, 0.05]} /><meshPhysicalMaterial color="#3fae6a" roughness={0} transparent opacity={0.55} /></mesh>}
  </group>;
}}</Scene3D>;

// ---- 4:24 · EL PISO 12: indicador de bronce de ascensor sobre empapelado; la aguja sube con inercia hasta 12; abajo, las puertas doradas ----
const dialTex = () => tex.text("d_dial", 512, 256, (g) => { g.clearRect(0, 0, 512, 256); g.fillStyle = "#2a1a10"; g.font = "bold 30px Georgia"; g.textAlign = "center"; for (let i = 1; i <= 12; i++) { const a = PI - (i - 1) / 11 * PI; g.fillText(String(i), 256 + Math.cos(a) * 200, 240 - Math.sin(a) * 200); } });
export const HHotel12: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none" warm={0.8}
  cam={{ at: [0, 0.38, -1.3], az: [0.1, -0.05], el: [0.06, 0.04], r: [1.0, 0.85], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="RUSH STREET · 1980" title="THE 12TH FLOOR" col={AMB} />}>{(tt) => {
  const v = cl(phys(tt, 0.6, 3.2, 0.32)), ang = PI / 2 - v * PI, open = eio(tt, 4.0, 5.4);
  return <>
    <mesh position={[0, 0.5, -1.6]}><planeGeometry args={[2.2, 1.4]} /><meshStandardMaterial map={wallpaper()} roughness={0.8} /></mesh>
    <group position={[0, 0.58, -1.58]}>
      <mesh rotation={[PI / 2, 0, 0]} scale={[1, 1, 0.55]}><cylinderGeometry args={[0.2, 0.2, 0.02, 64, 1, false, -PI / 2, PI]} />{M.brass({ col: "#c4933e" })}</mesh>
      <mesh position={[0, 0.0, 0.012]}><planeGeometry args={[0.38, 0.19]} /><meshBasicMaterial map={dialTex()} transparent depthWrite={false} /></mesh>
      <group position={[0, -0.09, 0.02]} rotation={[0, 0, ang]}><mesh position={[0, 0.08, 0]}><boxGeometry args={[0.006, 0.16, 0.004]} />{M.matte({ col: "#1a1a1a" })}</mesh></group>
      <mesh position={[0, -0.09, 0.024]}><cylinderGeometry args={[0.012, 0.012, 0.01, 20]} />{M.brass()}</mesh>
      <pointLight position={[0, 0.25, 0.25]} intensity={0.15} distance={0.6} color="#ffd38a" />
    </group>
    {[-1, 1].map((s) => <RBox key={s} s={[0.2, 0.42, 0.02]} r={0.004} p={[s * (0.1 + 0.18 * open), 0.21, -1.57]}>{M.brass({ col: "#d4a24a" })}</RBox>)}
    <mesh position={[0, 0.21, -1.59]}><planeGeometry args={[0.4, 0.42]} /><meshBasicMaterial color="#ffe8b8" /></mesh>
  </>;
}}</Scene3D>;
