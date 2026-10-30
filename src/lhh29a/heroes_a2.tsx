// lhh29a · componentes únicos 9-16 (kit h3d): la taza de la feria, la asadera quemada, la pasta «arena mojada»,
// la junta color té, el glaseado de sal, el teléfono con cepillo, el frasco de la puerta de atrás y la bolsa con broche.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn, tubeG, DigitDrum } from "./h3d";

const PI = Math.PI;
const Salt: React.FC<{ n: number; c: number[]; r: number; s?: number; seed?: number; k?: number; h?: number }> = ({ n, c, r, s = 0.008, seed = 1, k = 1, h = 0.5 }) => <>
  {Array.from({ length: n }, (_, i) => { const a = rn(i, seed) * PI * 2, d = Math.sqrt(rn(i, seed + 1)) * r, hh = rn(i, seed + 2) * r * h * (1 - d / r);
    return k * n > i && <mesh key={i} position={[c[0] + Math.cos(a) * d, c[1] + hh + s / 2, c[2] + Math.sin(a) * d]} rotation={[rn(i, 5) * 3, rn(i, 6) * 3, rn(i, 7) * 3]}><boxGeometry args={[s, s * 1.5, s]} /><meshPhysicalMaterial color="#fbfdff" roughness={0.15} clearcoat={1} /></mesh>; })}
</>;
const lathe = (pts: number[][], seg = 64) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);

const fairTex = () => tex.text("fair78b", 512, 160, (g) => {
  g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, 512, 160); g.fillStyle = "#b8322a"; g.fillRect(0, 18, 512, 16); g.fillRect(0, 126, 512, 16);
  g.fillStyle = "#1e4f8a"; g.font = "700 46px Georgia"; g.textAlign = "center"; for (let i = 0; i < 6; i++) g.fillText("★", 42 + i * 86, 96);
});
// ---- 4:47 · LA TAZA DE LA ASTILLA: la taza de la feria con agua tibia; la cuchara vuelca la sal, el agua se enturbia y la astilla sube flotando hasta la pinza ----
export const HFairMug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0, 0.1, 0], az: [-0.12, 0.1], el: [0.36, 0.44], r: [0.4, 0.33], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THE SPLINTER CUP" col={AMB} />}>{(tt) => {
  const land = phys(tt, 0.05, 6, 0.5), sp = phys(tt, 0.8, 5, 0.5), tip = eio(tt, 1.4, 2.0), cloud = eio(tt, 1.7, 3.2), rise = eio(tt, 3.0, 4.6), grab = eio(tt, 4.6, 5.2), up = eio(tt, 5.2, 6.2);
  return <>
    <group position={[0, (1 - cl(land)) * 0.3, 0]} rotation={[0, PI + 0.18 * Math.sin(tt * 0.6), 0]}>
      <mesh geometry={lathe([[0, 0], [0.045, 0], [0.05, 0.004], [0.052, 0.1], [0.049, 0.1], [0.047, 0.006], [0, 0.006]])} castShadow receiveShadow>{M.porcelain({ col: "#f6f1e4", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.055, 0]}><cylinderGeometry args={[0.0525, 0.0515, 0.07, 64, 1, true]} /><meshPhysicalMaterial map={fairTex()} roughness={0.15} clearcoat={1} transparent /></mesh>
      <mesh position={[0.058, 0.055, 0]}><torusGeometry args={[0.026, 0.007, 12, 32, PI * 1.1]} />{M.porcelain({ col: "#f6f1e4" })}</mesh>
      {/* agua tibia que se enturbia con la sal */}
      <mesh position={[0, 0.088, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.047, 40]} /><meshPhysicalMaterial color={new THREE.Color("#9fcbe0").lerp(new THREE.Color("#e9eef0"), cloud)} roughness={0.08} clearcoat={1} transparent opacity={0.85} /></mesh>
    </group>
    {/* la cuchara vuelca */}
    <group position={[0.06, 0.16 + (1 - cl(sp)) * 0.2 + 0.4 * eio(tt, 2.2, 3.0), 0.01]} rotation={[0, 0.3, -1.4 * tip]}>
      <mesh position={[0.07, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.005, 0.1, 12]} />{M.steel()}</mesh>
      <mesh scale={[1, 0.35, 0.75]}><sphereGeometry args={[0.024, 20, 10, 0, PI * 2, PI / 2, PI / 2]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      {tip < 0.6 && <Salt n={24} c={[0, -0.004, 0]} r={0.018} s={0.006} seed={13} />}
    </group>
    {tip > 0.3 && tip < 1 && Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0.01 + rn(i, 2) * 0.02, 0.15 - ((tt * 1.4 + rn(i, 3)) % 1) * 0.06, rn(i, 4) * 0.02]}><boxGeometry args={[0.005, 0.008, 0.005]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1} /></mesh>)}
    {/* la astilla sube flotando a la superficie y la pinza se la lleva */}
    <mesh position={[-0.012, 0.06 + 0.03 * rise + 0.12 * up, 0.012]} rotation={[0.2, 0.4, 1.2 - 1.0 * rise]} castShadow><boxGeometry args={[0.008, 0.05, 0.007]} /><meshStandardMaterial map={tex.wood(1, 2, [176, 132, 82])} roughness={0.8} /></mesh>
    <group position={[-0.012, 0.1 + (1 - grab) * 0.12 + 0.12 * up, 0.012]} rotation={[0, 0, 0.15]}>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * (0.012 - 0.006 * grab), 0.07, 0]} rotation={[0, 0, sd * 0.06]} castShadow><boxGeometry args={[0.007, 0.14, 0.014]} />{M.steel()}</mesh>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 5:06 · NEGRO COMO CAÑO DE ESTUFA: el caño de la estufa cubierto de hollín; el cepillo de alambre sube girando y lo deja plateado de abajo hacia arriba ----
const sootTex = () => tex.text("soot2", 256, 256, (g) => {
  g.fillStyle = "#16120f"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 900; i++) { const v = 20 + 40 * rn(i, 3); g.fillStyle = `rgba(${v + 30},${v + 10},${v},${0.35 * rn(i, 4)})`; g.beginPath(); g.arc(rn(i, 5) * 256, rn(i, 6) * 256, 1 + 5 * rn(i, 7), 0, 7); g.fill(); }
});
export const HRoaster: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="tile"
  cam={{ at: [0, 0.22, 0], az: [0.4, -0.2], el: [0.12, 0.2], r: [0.95, 0.8], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="BLACK LIKE A STOVEPIPE" col={RED} />}>{(tt) => {
  const H0 = 0.46, k = eio(tt, 1.0, 5.4), yb = 0.02 + H0 * k;
  return <>
    <RBox s={[0.34, 0.06, 0.26]} p={[0, 0.03, 0]} r={0.01}><meshStandardMaterial color="#2a2c30" metalness={0.6} roughness={0.5} /></RBox>
    {/* tramo limpio (plateado) y tramo con hollín: el corte sube con el cepillo */}
    <mesh position={[0, 0.06 + yb / 2, 0]} castShadow><cylinderGeometry args={[0.06, 0.06, Math.max(0.001, yb), 48]} />{M.chrome({ col: "#d9dde2" })}</mesh>
    <mesh position={[0, 0.06 + yb + (H0 + 0.02 - yb) / 2, 0]} castShadow><cylinderGeometry args={[0.0605, 0.0605, Math.max(0.001, H0 + 0.02 - yb), 48]} /><meshStandardMaterial map={sootTex()} roughness={0.95} /></mesh>
    {/* el cepillo de alambre: anillo de cerdas que gira y sube */}
    <group position={[0, 0.06 + yb, 0]} rotation={[0, tt * 9, 0]}>
      {Array.from({ length: 36 }, (_, i) => <mesh key={i} position={[Math.cos(i / 36 * PI * 2) * 0.072, 0, Math.sin(i / 36 * PI * 2) * 0.072]} rotation={[0, -i / 36 * PI * 2, PI / 2]}><cylinderGeometry args={[0.0012, 0.0012, 0.03, 4]} />{M.steel({ col: "#9aa0a6" })}</mesh>)}
      <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.088, 0.008, 10, 48]} /><meshStandardMaterial color="#7a4a22" roughness={0.7} /></mesh>
      <mesh position={[0.16, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.009, 0.14, 12]} /><meshStandardMaterial color="#7a4a22" roughness={0.7} /></mesh>
    </group>
    {/* escamas de hollín que caen girando */}
    {Array.from({ length: 30 }, (_, i) => { const t0 = 1.0 + rn(i, 2) * 4.2, f = cl((tt - t0) / 0.9); const y0 = 0.08 + H0 * eio(t0, 1.0, 5.4);
      return f > 0 && f < 1 && <mesh key={i} position={[Math.cos(i * 2.4) * (0.08 + 0.1 * f), y0 * (1 - f) + 0.065 * f, Math.sin(i * 2.4) * (0.08 + 0.1 * f)]} rotation={[f * 6, i, f * 4]}><boxGeometry args={[0.01, 0.002, 0.008]} /><meshStandardMaterial color="#1a1612" roughness={1} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 5:39 · COMO ARENA MOJADA: dos platitos frente a frente; el de la izquierda se ahoga y la sal desaparece; el de la derecha, apenas húmedo, se aprieta con la cuchara y el copete se sostiene ----
export const HGritty: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0, 0.05, 0], az: [0, 0.1], el: [0.24, 0.2], r: [0.82, 0.72], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="DAMP, NOT WET" col={AMB} />}>{(tt) => {
  const pour = eio(tt, 0.6, 2.2), drip = eio(tt, 1.0, 1.8), dis = eio(tt, 1.8, 3.4), press = eio(tt, 2.6, 3.4) * (1 - eio(tt, 3.6, 4.2)), hold = eio(tt, 3.4, 4.0);
  return <>
    {[-0.17, 0.17].map((x, j) => <group key={j} position={[x, 0, 0]}>
      <mesh geometry={lathe([[0, 0], [0.08, 0], [0.12, 0.018], [0.125, 0.02], [0.08, 0.004], [0, 0.004]])} castShadow receiveShadow>{M.porcelain({ side: THREE.DoubleSide })}</mesh>
    </group>)}
    {/* izquierda: el vaso entero de agua, la sal se va */}
    <group position={[-0.12, 0.2, 0]} rotation={[0, 0, 1.6 * pour * (1 - eio(tt, 2.3, 2.8))]}>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.03, 0.026, 0.1, 32, 1, true]} />{M.glass({ op: 0.3 })}</mesh>
    </group>
    <mesh position={[-0.17, 0.008 + 0.01 * pour, 0]}><cylinderGeometry args={[0.07 + 0.045 * pour, 0.07, 0.004, 48]} />{M.water({ op: 0.55 * cl(pour * 3), col: "#9fd0ea" })}</mesh>
    <Salt n={90} c={[-0.17, 0.006, 0]} r={0.05} s={0.008} seed={21} k={1 - dis} />
    {pour > 0.1 && pour < 0.95 && <mesh position={[-0.155, 0.11, 0]}><cylinderGeometry args={[0.006, 0.008, 0.18, 10]} />{M.water({ op: 0.5, col: "#9fd0ea" })}</mesh>}
    {/* derecha: unas gotas, la cuchara aprieta y queda un copete firme que brilla húmedo */}
    {drip > 0 && drip < 1 && <mesh position={[0.17, 0.2 - 0.17 * drip, 0]}><sphereGeometry args={[0.006, 10, 8]} />{M.water({ op: 0.8 })}</mesh>}
    <group position={[0.17, 0.006, 0]} scale={[1 + 0.1 * hold, 1 - 0.25 * press + 0.55 * hold, 1 + 0.1 * hold]}>
      <Salt n={170} c={[0, 0, 0]} r={0.055} s={0.008} seed={23} h={0.9} />
      <mesh position={[0, 0.03, 0]} scale={Math.max(0.001, hold)}><coneGeometry args={[0.045, 0.06, 24]} /><meshPhysicalMaterial color="#eef2f3" roughness={0.6} clearcoat={0.6} /></mesh>
      <mesh position={[0, 0.006, 0]} scale={[1, 0.62, 1]}><sphereGeometry args={[0.052, 28, 14, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color="#e9eef0" roughness={0.45} clearcoat={0.9} transparent opacity={0.5 * drip} /></mesh>
    </group>
    <group position={[0.17, 0.07 + 0.08 * (1 - press) + 0.2 * eio(tt, 3.8, 4.6), 0]} rotation={[0, 0, 0.3]}>
      <mesh scale={[1, 0.35, 0.75]}><sphereGeometry args={[0.03, 20, 10, 0, PI * 2, 0, PI / 2]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0.075, 0.02, 0]} rotation={[0, 0, PI / 2 - 0.3]}><cylinderGeometry args={[0.004, 0.005, 0.12, 10]} />{M.steel()}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 6:29 · COLOR DE TÉ FLOJO: la taza de té se inclina y gotea; la junta de la pared de 1956 se tiñe de abajo hacia arriba mientras el contador mecánico corre hasta 1990 ----
export const HGrout: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="none"
  cam={{ at: [-0.02, 0.2, -0.08], az: [-0.25, 0.1], el: [0.22, 0.16], r: [1.1, 0.95], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THE COLOR OF WEAK TEA" col={AMB} />}>{(tt) => {
  const age = eio(tt, 0.8, 4.6), yrf = lerp(1956, 1990, age), yr = Math.floor(yrf);
  const tip = eio(tt, 0.4, 1.0);
  return <>
    {/* junta: franjas horizontales que se tiñen de abajo hacia arriba */}
    {Array.from({ length: 6 }, (_, r) => { const g = cl(age * 1.6 - r * 0.12); const col = new THREE.Color("#dedad0").lerp(new THREE.Color("#6e4419"), g);
      return <mesh key={r} position={[0, 0.05 + r * 0.104, -0.3]}><planeGeometry args={[0.9, 0.104]} /><meshStandardMaterial color={col} roughness={0.9} /></mesh>; })}
    {Array.from({ length: 36 }, (_, i) => { const c = i % 6, r = Math.floor(i / 6), k = phys(tt, 0.05 + (c + r) * 0.03, 8, 0.5);
      return <RBox key={i} s={[0.118, 0.08, 0.012]} p={[-0.36 + c * 0.144, 0.05 + r * 0.104, -0.292 + (1 - cl(k)) * 0.15]} r={0.008}>{M.porcelain({ col: "#f6f6f2" })}</RBox>; })}
    {/* chorreadas color té que bajan por las juntas */}
    {[-0.288, 0, 0.144].map((x, j) => { const k = eio(tt, 0.9 + j * 0.5, 3.4 + j * 0.5); return <mesh key={"d" + j} position={[x, 0.6 - 0.28 * k, -0.285]} scale={[1, Math.max(0.001, k), 1]}><planeGeometry args={[0.012, 0.56]} /><meshPhysicalMaterial color="#8a5a28" roughness={0.1} clearcoat={1} transparent opacity={0.85} /></mesh>; })}
    {/* la taza de té en primer plano, inclinada; gotas color té */}
    <group position={[-0.2, 0.06, 0.1]} rotation={[0, 0.5, -0.7 * tip]}>
      <mesh geometry={lathe([[0, 0], [0.035, 0], [0.045, 0.05], [0.047, 0.052], [0.044, 0.052], [0.033, 0.004], [0, 0.004]])} castShadow>{M.porcelain({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.042, 0]} rotation={[0, 0, 0.7 * tip]}><cylinderGeometry args={[0.04, 0.038, 0.002, 32]} /><meshPhysicalMaterial color="#a6773f" roughness={0.05} clearcoat={1} /></mesh>
      <mesh position={[0.05, 0.03, 0]}><torusGeometry args={[0.015, 0.004, 8, 20, PI * 1.2]} />{M.porcelain()}</mesh>
    </group>
    {Array.from({ length: 5 }, (_, j) => { const f = ((tt * 1.2 + j / 5) % 1); return tip > 0.8 && <mesh key={j} position={[-0.165, 0.09 - f * 0.09, 0.1]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.005, 10, 8]} /><meshPhysicalMaterial color="#a6773f" roughness={0.05} clearcoat={1} /></mesh>; })}
    <mesh position={[-0.165, 0.001, 0.1]} rotation={[-PI / 2, 0, 0]} scale={0.3 + 0.7 * age}><circleGeometry args={[0.04, 32]} /><meshPhysicalMaterial color="#a6773f" roughness={0.05} clearcoat={1} transparent opacity={0.85} /></mesh>
    {/* contador mecánico de cuatro tambores sobre la mesada */}
    <RBox s={[0.2, 0.07, 0.06]} p={[0.22, 0.035, 0.12]} r={0.01}><meshStandardMaterial color="#2b2d31" metalness={0.5} roughness={0.4} /></RBox>
    {String(yr).split("").map((d, i) => <DigitDrum key={i} v={+d + (i === 3 ? yrf % 1 : 0)} p={[0.16 + i * 0.04, 0.045, 0.15]} r={0.026} w={0.034} />)}
  </>;
}}</Scene3D>;

// ---- 6:45 · ESPESA COMO GLASEADO: el jabón cae en hilo sobre la sal y el batidor de mano gira hasta levantar picos firmes ----
export const HFrosting: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="tile"
  cam={{ at: [0, 0.08, 0], az: [0.45, -0.25], el: [0.5, 0.4], r: [0.7, 0.58], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THICK LIKE FROSTING" col={ICE} />}>{(tt) => {
  const soap = eio(tt, 0.6, 1.8), mix = eio(tt, 1.8, 4.4), peak = phys(tt, 4.2, 6, 0.45), out = eio(tt, 4.4, 5.2);
  return <>
    <mesh geometry={lathe([[0, 0], [0.09, 0], [0.13, 0.02], [0.135, 0.022], [0.09, 0.004], [0, 0.004]])} castShadow receiveShadow>{M.porcelain({ col: "#f3efe6", side: THREE.DoubleSide })}</mesh>
    <Salt n={Math.round(160 * (1 - mix))} c={[0, 0.006, 0]} r={0.065} s={0.008} seed={31} h={0.8} />
    {/* la botella verde, entera en cuadro, inclinada sobre el plato */}
    <group position={[0.14, 0.14, 0.02]} rotation={[0, 0, 0.3 + 1.6 * cl(soap * 3) * (1 - eio(tt, 1.9, 2.4))]}>
      <RBox s={[0.05, 0.12, 0.03]} r={0.012}>{M.plastic({ col: "#3fa35c" })}</RBox>
      <mesh position={[0, 0.072, 0]}><cylinderGeometry args={[0.008, 0.012, 0.025, 12]} />{M.plastic({ col: "#f2f2f2" })}</mesh>
    </group>
    {soap > 0.15 && soap < 1 && <mesh position={[0.05, 0.07, 0.02]}><cylinderGeometry args={[0.003, 0.003, 0.12, 8]} />{M.grease({ col: "#7fd39a", op: 0.8 })}</mesh>}
    {/* el glaseado: copete con picos que crecen al batir */}
    {mix > 0 && <group position={[0, 0.006, 0]} rotation={[0, tt * 3 * (1 - out), 0]} scale={[0.5 + 0.5 * mix, Math.max(0.05, mix * (0.8 + 0.25 * cl(peak))), 0.5 + 0.5 * mix]}>
      <mesh geometry={lathe([[0, 0], [0.075, 0], [0.07, 0.02], [0.05, 0.04], [0.03, 0.055], [0.012, 0.07], [0.002, 0.08], [0, 0.08]])}><meshPhysicalMaterial color="#f8f8f4" roughness={0.35} clearcoat={0.7} sheen={1} /></mesh>
      {Array.from({ length: 9 }, (_, i) => { const a = i * 0.7, r = 0.02 + 0.045 * rn(i, 3); return <mesh key={i} position={[Math.cos(a) * r, 0.05 - r * 0.4, Math.sin(a) * r]} rotation={[0.3 * Math.sin(a), 0, 0.3 * Math.cos(a)]} scale={[1, Math.max(0.001, cl(peak)), 1]}><coneGeometry args={[0.012, 0.035, 10]} /><meshPhysicalMaterial color="#ffffff" roughness={0.3} clearcoat={0.8} /></mesh>; })}
    </group>}
    {/* batidor de alambre: seis lazos que giran */}
    <group position={[0.01, 0.1 + 0.25 * out, 0]} rotation={[0.15, tt * 14, 0.1]}>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} rotation={[0, i * PI / 6, 0]} scale={[0.6, 1, 1]}><torusGeometry args={[0.045, 0.0015, 6, 40]} />{M.steel()}</mesh>)}
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.009, 0.007, 0.1, 14]} /><meshStandardMaterial color="#7a4a22" roughness={0.6} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 7:32 · «LLAMÉ A UN CEPILLO»: el teléfono negro de disco; el cepillo de dientes viejo entra y fregotea el disco con espuma, el cable rizado se estira ----
export const HToothbrush: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0, 0.08, 0.04], az: [-0.18, 0.15], el: [0.55, 0.45], r: [0.55, 0.47], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="I CALLED A TOOTHBRUSH" col={AMB} />}>{(tt) => {
  const ring = tt < 1.2 ? Math.sin(tt * 60) * 0.025 * cl(tt * 3) : 0, inb = phys(tt, 1.2, 5, 0.5), scrub = cl((tt - 1.8) / 3.4), foam = eio(tt, 1.9, 3.5) * (1 - eio(tt, 5.0, 6.0));
  const bx = 0.05 * Math.cos(scrub * PI * 7), bz = 0.08 + 0.03 * Math.sin(scrub * PI * 7), cs = Math.sin(scrub * PI * 7) ** 2;
  return <>
    <group rotation={[0, 0, ring]}>
      <mesh position={[0, 0.04, -0.01]} scale={[1, 0.42, 0.85]}><sphereGeometry args={[0.11, 40, 20, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color="#111214" roughness={0.18} clearcoat={1} /></mesh>
      <RBox s={[0.2, 0.04, 0.18]} p={[0, 0.02, 0]} r={0.02}><meshPhysicalMaterial color="#111214" roughness={0.18} clearcoat={1} /></RBox>
      {/* disco: placa blanca con números y anillos de cromo de los diez agujeros */}
      <group position={[0, 0.062, 0.07]} rotation={[-0.55, 0, 0]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.055, 0.055, 0.004, 40]} /><meshStandardMaterial map={tex.text("dialnums", 256, 256, (g) => { g.fillStyle = "#f1ece0"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#1b1b1b"; g.font = "900 26px Arial"; g.textAlign = "center"; for (let i = 0; i < 10; i++) { const a = -(i * 0.55 + 0.6); g.fillText(String((i + 1) % 10), 128 + Math.cos(a) * 84, 137 + Math.sin(a) * 84); } })} roughness={0.5} /></mesh>
        {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[Math.cos(i * 0.55 + 0.6) * 0.04, Math.sin(i * 0.55 + 0.6) * 0.04, 0.0045]}><ringGeometry args={[0.0085, 0.0105, 24]} />{M.chrome()}</mesh>)}
        {Array.from({ length: 22 }, (_, i) => <mesh key={"f" + i} position={[(rn(i, 2) - 0.5) * 0.09, (rn(i, 3) - 0.5) * 0.09, 0.008]} scale={Math.max(0.001, foam * (0.6 + 0.6 * rn(i, 4)))}><sphereGeometry args={[0.008, 10, 8]} /><meshPhysicalMaterial color="#ffffff" roughness={0.2} transparent opacity={0.85} clearcoat={1} /></mesh>)}
      </group>
      {[-0.06, 0.06].map((x, i) => <mesh key={i} position={[x, 0.11, -0.02]}><boxGeometry args={[0.014, 0.03, 0.02]} /><meshPhysicalMaterial color="#111214" roughness={0.2} clearcoat={1} /></mesh>)}
      <mesh position={[0, 0.13, -0.02]} rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.016, 0.13, 8, 16]} /><meshPhysicalMaterial color="#111214" roughness={0.2} clearcoat={1} /></mesh>
    </group>
    {/* el cepillo de dientes viejo, cerdas abajo, fregando en círculos */}
    <group position={[bx + 0.02, 0.1 + (1 - cl(inb)) * 0.25 + 0.006 * Math.sin(tt * 30) * (scrub > 0 && scrub < 1 ? 1 : 0), bz]} rotation={[-0.55, 0.4 + 0.3 * Math.sin(scrub * 9), 0]}>
      <mesh position={[0.07, 0.012, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0065, 0.0055, 0.15, 14]} />{M.plastic({ col: "#d24a6a" })}</mesh>
      <mesh position={[0, 0.006, 0]}><boxGeometry args={[0.035, 0.008, 0.013]} />{M.plastic({ col: "#d24a6a" })}</mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.014 + (i % 6) * 0.0056, -0.004, (Math.floor(i / 6) - 0.5) * 0.006]}><cylinderGeometry args={[0.002, 0.0016, 0.012, 6]} /><meshStandardMaterial color="#e8f0f4" roughness={0.6} /></mesh>)}
    </group>
    {/* el cable rizado que se estira con cada fregada */}
    <mesh geometry={tubeG("cord" + Math.round(cs * 8), Array.from({ length: 40 }, (_, i) => [-0.12 - i * (0.004 + 0.0012 * Math.round(cs * 8) / 8), 0.02 + 0.01 * Math.sin(i * 1.4), 0.01 * Math.cos(i * 1.4) + i * 0.002]), 0.003)}><meshPhysicalMaterial color="#111214" roughness={0.3} /></mesh>
  </>;
}}</Scene3D>;

// ---- 8:39 · EL FRASCO DE LA PUERTA DE ATRÁS: la sal cae al frasco en capa blanca, el aceite dorado queda arriba, la cuchara mezcla hasta ámbar y la tela a cuadros se ata con hilo ----
const ginghamTex = () => tex.text("gingham", 128, 128, (g) => { g.fillStyle = "#fff"; g.fillRect(0, 0, 128, 128); g.fillStyle = "rgba(196,48,48,.55)"; for (let i = 0; i < 8; i++) { g.fillRect(i * 16, 0, 8, 128); g.fillRect(0, i * 16, 128, 8); } });
export const HOilJar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [0, 0.09, 0], az: [0.35, -0.2], el: [0.22, 0.32], r: [0.62, 0.52], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THE BACK-DOOR JAR" col={AMB} />}>{(tt) => {
  const salt = eio(tt, 0.3, 1.4), oil = eio(tt, 1.4, 2.6), stir = eio(tt, 2.8, 4.4), lid = phys(tt, 4.6, 6, 0.5), tie = eio(tt, 5.2, 6.0);
  const amber = new THREE.Color("#f7f8f8").lerp(new THREE.Color("#e8c46a"), stir);
  return <>
    <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.06, 0.06, 0.14, 48, 1, true]} />{M.glass({ op: 0.22 })}</mesh>
    <mesh position={[0, 0.001, 0]}><cylinderGeometry args={[0.06, 0.06, 0.002, 48]} />{M.glass({ op: 0.3 })}</mesh>
    <mesh position={[0, 0.035 * salt, 0]} scale={[1, Math.max(0.001, salt), 1]}><cylinderGeometry args={[0.057, 0.057, 0.07, 40]} /><meshPhysicalMaterial color={amber} roughness={0.6} transparent opacity={0.95} /></mesh>
    {salt > 0 && stir < 0.5 && <Salt n={40} c={[0, 0.07 * salt, 0]} r={0.05} s={0.007} seed={41} h={0.2} />}
    {/* capa de aceite dorado arriba, que se absorbe al mezclar */}
    <mesh position={[0, 0.07 + 0.02 * oil * (1 - stir), 0]} scale={[1, Math.max(0.001, oil * (1 - stir)), 1]}><cylinderGeometry args={[0.0575, 0.0575, 0.04, 40]} /><meshPhysicalMaterial color="#e2b23c" roughness={0.05} clearcoat={1} transparent opacity={0.7} emissive="#7a5208" emissiveIntensity={0.3} /></mesh>
    {oil > 0 && oil < 1 && <mesh position={[0.01, 0.17, 0]}><cylinderGeometry args={[0.003, 0.004, 0.14, 8]} />{M.grease({ col: "#e2b23c", op: 0.85 })}</mesh>}
    {/* cuchara de madera que mezcla */}
    {stir > 0 && stir < 1 && <group position={[0.02 * Math.cos(tt * 7), 0.12, 0.02 * Math.sin(tt * 7)]} rotation={[0.15 * Math.sin(tt * 7), 0, 0.15 * Math.cos(tt * 7)]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.005, 0.006, 0.18, 10]} />{M.wood({ base: [196, 150, 96], rx: 1, ry: 1 })}</mesh>
      <mesh position={[0, -0.065, 0]} scale={[1, 1.5, 0.4]}><sphereGeometry args={[0.014, 16, 10]} />{M.wood({ base: [196, 150, 96], rx: 1, ry: 1 })}</mesh>
    </group>}
    {/* la tela a cuadros cae sobre la boca y el hilo la ata */}
    <group position={[0, 0.142 + (1 - cl(lid)) * 0.2, 0]}>
      <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 32]} /><meshStandardMaterial map={ginghamTex()} roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.016, 0]}><cylinderGeometry args={[0.07, 0.088, 0.032, 32, 1, true]} /><meshStandardMaterial map={ginghamTex()} roughness={0.9} side={THREE.DoubleSide} /></mesh>
    </group>
    {lid > 0.9 && <mesh position={[0, 0.13, 0]} rotation={[PI / 2, 0, 0]} scale={[1 + 0.25 * (1 - tie), 1 + 0.25 * (1 - tie), 1]}><torusGeometry args={[0.062, 0.0022, 6, 40]} /><meshStandardMaterial color="#c8b48a" roughness={0.9} /></mesh>}
  </>;
}}</Scene3D>;

// ---- 9:57 · DOBLAR DOS VECES Y UN BROCHE: la boca de la bolsa se dobla una, dos veces y el broche de ropa de madera la muerde ----
const bagTop = () => tex.text("bagTop2", 256, 128, (g) => { g.fillStyle = "#d8c39a"; g.fillRect(0, 0, 256, 128); for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(140,110,70,${0.06 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 128, 3, 3); } });
export const HClothespin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood"
  cam={{ at: [0, 0.18, 0], az: [-0.75, -0.2], el: [0.3, 0.26], r: [0.8, 0.68], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="FOLD IT TWICE · PIN IT" col={GRN} />}>{(tt, u) => {
  const f1 = eio(u, 0.08, 0.3), f2 = eio(u, 0.33, 0.52), pu = cl((u - 0.55) / 0.2), pin = pu <= 0 ? 0 : 1 - Math.exp(-pu * 5) * Math.cos(pu * 11), bite = eio(u, 0.68, 0.72), W = 0.16, D = 0.1;
  return <>
    <RBox s={[W, 0.22, D]} p={[0, 0.11, 0]} r={0.008}><meshStandardMaterial map={tex.text("bagEpsomB", 256, 384, (g) => { g.fillStyle = "#efe7d6"; g.fillRect(0, 0, 256, 384); g.fillStyle = "#1f4f8a"; g.fillRect(0, 150, 256, 70); g.fillStyle = "#fff"; g.font = "900 38px Arial"; g.textAlign = "center"; g.fillText("EPSOM", 128, 182); g.font = "700 22px Arial"; g.fillText("SALT", 128, 210); })} roughness={0.85} /></RBox>
    {/* la boca de la bolsa: dos solapas articuladas que se doblan hacia adelante */}
    <group position={[0, 0.22, D / 2]} rotation={[f1 * PI, 0, 0]}>
      <mesh position={[0, 0.04, 0]}><boxGeometry args={[W, 0.08, 0.004]} /><meshStandardMaterial map={bagTop()} roughness={0.85} side={THREE.DoubleSide} /></mesh>
      <group position={[0, 0.08, 0]} rotation={[f2 * PI, 0, 0]}>
        <mesh position={[0, 0.04, 0]}><boxGeometry args={[W, 0.08, 0.004]} /><meshStandardMaterial map={bagTop()} roughness={0.85} side={THREE.DoubleSide} /></mesh>
      </group>
    </group>
    {/* broche de madera: dos patas + resorte, cae desde arriba y muerde */}
    <group visible={u > 0.55} position={[0.03, 0.2 + (1 - cl(pin)) * 0.25, D / 2 + 0.01]} rotation={[0, -0.9, 0.05]} scale={2.4}>
      {[-1, 1].map((sd) => <group key={sd} rotation={[sd * (0.18 * (1 - bite) + 0.02), 0, 0]}>
        <RBox s={[0.014, 0.085, 0.009]} p={[0, 0, sd * 0.007]} r={0.003}>{M.wood({ base: [214, 180, 128], rx: 1, ry: 1 })}</RBox>
      </group>)}
      {[-0.006, -0.002, 0.002, 0.006].map((x, j) => <mesh key={j} position={[x, 0.012, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.012, 0.0018, 8, 20]} />{M.chrome()}</mesh>)}
    </group>
    <pointLight position={[lerp(-0.3, 0.3, eio(u, 0.7, 0.98)), 0.3, 0.2]} intensity={0.8 * Math.sin(PI * eio(u, 0.7, 0.98))} distance={0.6} color="#ffd9a0" />
    {bite > 0.9 && (() => { const rr = eio(u, 0.72, 0.95); return <mesh position={[0.03, 0.2, D / 2 + 0.03]}><ringGeometry args={[0.02 + 0.08 * rr, 0.026 + 0.08 * rr, 40]} />{M.glow({ col: GRN, op: 0.6 * (1 - rr) })}</mesh>; })()}
  </>;
}}</Scene3D>;
