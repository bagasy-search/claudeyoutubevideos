// lch29a · componentes únicos 1-8 (kit h3d + bb: zócalo real con su labio, polvo con física, cámara que orbita en curva).
import React from "react";
import * as THREE from "three";
import { AMB, H, ICE, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Bucket, Motes, Sock, WallBB, WhiteGloveHand } from "./bb";

const PI = Math.PI;

// ---- 0:26 · EL GUANTE BLANCO: un dedo enguantado recorre el labio del zócalo; la yema se pone gris y se levanta a cámara ----
export const HWhiteGlove: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none"
  cam={{ at: [-0.05, 0.13, 0.02], at1: [0.16, 0.2, 0.1], az: [0.7, 0.3], el: [0.22, 0.28], r: [0.62, 0.36], fov: 30 }}>{(tt) => {
  const run = eio(tt, 0.6, 3.4), lift = eio(tt, 3.7, 4.9), x = lerp(-0.38, 0.12, run);
  return <>
    <WallBB L={1.1} top={1} line={0.7} />
    {/* el rastro limpio que deja el dedo sobre el estante */}
    <mesh position={[(x + 0.08 - 0.42) / 2, 0.1255, 0.003]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, x + 0.08 + 0.42), 1, 1]}><planeGeometry args={[1, 0.013]} /><meshStandardMaterial color="#f6f3ec" roughness={0.4} /></mesh>
    <group position={[x, 0.138 + 0.07 * lift, -0.018 + 0.09 * lift]} rotation={[0.15 + 1.1 * lift, -0.35 * lift, -0.12 + 0.5 * lift]}>
      <WhiteGloveHand tip={cl(run * 1.6)} />
    </group>
    {/* motas que se levantan del estante al pasar */}
    <Motes n={40} r={0.003} pos={(i) => { const x0 = -0.38 + rn(i, 2) * 0.5, k = cl((tt - (0.6 + (x0 + 0.38) / 0.5 * 2.8)) / 2); return [x0, 0.127 + k * 0.1 * rn(i, 3), 0.01 + k * 0.05]; }} op={(i) => { const x0 = -0.38 + rn(i, 2) * 0.5; return x0 + 0.08 < x ? 0.85 * (1 - cl((tt - 2.2 - rn(i, 4) * 2) / 3)) : 0; }} />
  </>;
}}</Scene3D>;

// ---- 0:52 · BALDE, MEDIA Y PALO DE ESCOBA: los tres llegan de a uno sobre el piso con su peso y su sombra ----
export const HKit3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none"
  cam={{ at: [0, 0.14, 0], az: [-0.5, 0.35], el: [0.42, 0.34], r: [1.3, 1.12], fov: 32 }}>{(tt) => {
  const a = phys(tt, 0.3, 8, 0.32), b = phys(tt, 1.3, 8, 0.32), c = phys(tt, 2.3, 7, 0.3);
  return <>
    <group position={[0, 0, -0.32]}><WallBB L={1.3} dust={0.6} /></group>
    <group position={[-0.22, (1 - a) * 0.6, 0]}><Bucket lv={0.6} suds={cl(tt - 1)} /></group>
    <group position={[0.06, 0.03 + (1 - b) * 0.5, 0.12]} rotation={[-PI / 2, 0, 0.5 + 0.3 * (1 - cl(b))]}><Sock g={0.1} s={1.1} /></group>
    {/* palo de escoba: cae inclinado y queda acostado en diagonal */}
    <group position={[0.18, 0.012 + (1 - c) * 0.35, -0.05]} rotation={[0, -0.7, (1 - cl(c)) * 1.2]}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.9, 16]} /><meshStandardMaterial map={tex.wood(1, 3, [196, 150, 96])} roughness={0.6} /></mesh>
      <mesh position={[0.45, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.013, 0.013, 0.03, 16]} />{M.steel()}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 2:16 · HICE BARRO: el trapo mojado pasa por el estante polvoriento; atrás queda una pasta gris que chorrea hasta la ranura ----
export const HMud: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[-1.6, 0.7, 0.6]}
  cam={{ at: [0, 0.11, 0.02], az: [0.75, 0.55], el: [0.14, 0.18], r: [0.42, 0.36], fov: 30 }}>{(tt) => {
  const xr = lerp(-0.22, 0.24, eio(tt, 0.6, 4.4));
  const HIT = Array.from({ length: 8 }, (_, i) => -0.2 + i * 0.058);
  return <>
    <WallBB L={0.8} top={0} line={0.2} dust={0} />
    {/* la capa de polvo seco y peludo sobre el labio */}
    <Motes n={160} r={0.0042} col="#9a9284" pos={(i) => [-0.3 + rn(i, 2) * 0.6, 0.129 + 0.003 * rn(i, 3), 0.002 + 0.008 * rn(i, 4)]} op={(i) => { const x = -0.3 + rn(i, 2) * 0.6; const hit = HIT.find((hx) => Math.abs(hx - x) < 0.03); const th = hit === undefined ? 99 : 0.6 + (hit + 0.22) / 0.46 * 3.8 + 0.25; return 1 - cl((tt - th) / 0.3); }} />
    {HIT.map((hx, i) => { const th = 0.6 + (hx + 0.22) / 0.46 * 3.8, fall = cl((tt - th) / 0.25), spread = eio(tt, th + 0.25, th + 0.7), run = eio(tt, th + 0.6, th + 2.4); return <group key={i}>
      {/* la gota que cae del trapo */}
      {fall > 0 && fall < 1 && <mesh position={[hx, lerp(0.175, 0.132, fall * fall), 0.008]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.006, 14, 10]} />{M.water({ op: 0.85 })}</mesh>}
      {/* el polvo mojado se vuelve pasta gris brillante */}
      {spread > 0 && <mesh position={[hx, 0.1292, 0.005]} rotation={[-PI / 2, 0, 0]} scale={[spread, spread * 0.22, 1]}><circleGeometry args={[0.024, 24]} /><meshPhysicalMaterial color="#4e4a44" roughness={0.15} clearcoat={1} /></mesh>}
      {/* y baja por la cara hasta la ranura del piso */}
      {run > 0 && <mesh position={[hx + 0.004, 0.128 - 0.06 * run, 0.0108]}><planeGeometry args={[0.009, Math.max(0.001, 0.12 * run)]} /><meshPhysicalMaterial color="#56514a" roughness={0.15} clearcoat={1} /></mesh>}
      {run > 0 && <mesh position={[hx + 0.004, 0.128 - 0.12 * run, 0.0112]} scale={[1, 1.3, 0.6]}><sphereGeometry args={[0.0065, 14, 10]} /><meshPhysicalMaterial color="#4e4a44" roughness={0.12} clearcoat={1} /></mesh>}
      {run > 0.95 && <mesh position={[hx + 0.004, 0.003, 0.016]} rotation={[-PI / 2, 0, 0]} scale={[eio(tt, th + 2.3, th + 3.0), 0.5, 1]}><circleGeometry args={[0.022, 20]} /><meshPhysicalMaterial color="#4e4a44" roughness={0.15} clearcoat={1} /></mesh>}
    </group>; })}
    {/* el trapo mojado que va goteando de izquierda a derecha */}
    <group position={[xr, 0.19, 0.012]} rotation={[0.3, 0, 0.08 * Math.sin(tt * 5)]}><RBox s={[0.07, 0.035, 0.04]} r={0.014}><meshPhysicalMaterial color="#7d93a0" roughness={0.55} clearcoat={0.5} /></RBox></group>
  </>;
}}</Scene3D>;

// cepillo de la aspiradora: cabeza ovalada con cerdas largas + caño
const Brush: React.FC = () => <group>
  <RBox s={[0.1, 0.03, 0.04]} r={0.012}><meshPhysicalMaterial color="#3a3d42" roughness={0.4} clearcoat={0.4} /></RBox>
  {Array.from({ length: 60 }, (_, i) => <mesh key={i} position={[-0.045 + (i % 15) * 0.0065, -0.028, -0.014 + Math.floor(i / 15) * 0.009]} rotation={[0.1 * (rn(i, 2) - 0.5), 0, 0.1 * (rn(i, 3) - 0.5)]}><cylinderGeometry args={[0.0018, 0.0012, 0.03, 5]} /><meshStandardMaterial color="#d8c39a" roughness={0.9} /></mesh>)}
  <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.016, 0.018, 0.1, 20]} /><meshPhysicalMaterial color="#9aa0a8" roughness={0.3} metalness={0.7} /></mesh>
  <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.018, 0.018, 0.2, 20]} /><meshPhysicalMaterial color="#9aa0a8" roughness={0.3} metalness={0.7} /></mesh>
</group>;

// ---- 2:56 · TRES PASADAS LENTAS: el cepillo de la aspiradora recorre el estante, la cara y la línea del piso; el polvo se va adentro ----
export const HBrushPass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none"
  cam={{ at: [0, 0.09, 0.02], az: [0.4, 0.15], el: [0.24, 0.2], r: [0.78, 0.7], fov: 30 }}>{(tt) => {
  const P = [[0.14, 0.4, 1.9], [0.075, 2.0, 3.6], [0.022, 3.7, 5.4]] as const;
  const cur = Math.max(0, P.findIndex(([, , b]) => tt < b)), [py, a, b] = P[tt >= 5.4 ? 2 : cur], k = eio(tt, a, b), x = lerp(-0.36, 0.36, k);
  const done = (j: number) => (tt >= P[j][2] ? 1 : tt < P[j][1] ? -1 : lerp(-0.36, 0.36, eio(tt, P[j][1], P[j][2])));
  // polvo gris visible en las tres franjas: sólo queda delante del cepillo
  const band = (j: number, y: number, z: number, hgt: number) => { const d = done(j); const L = d === 1 ? 0 : d === -1 ? 0.8 : 0.4 - d; return L > 0.002 && <mesh key={j} position={[0.4 - L / 2, y, z]}><planeGeometry args={[L, hgt]} /><meshStandardMaterial color="#8c867b" transparent opacity={0.8} roughness={1} depthWrite={false} /></mesh>; };
  const hose = new THREE.CatmullRomCurve3([new THREE.Vector3(x, py + 0.24, 0.03), new THREE.Vector3(x + 0.1, py + 0.45, 0.12), new THREE.Vector3(x + 0.35, 0.65, 0.3)]);
  return <>
    <WallBB L={0.9} top={0} line={0} dust={0} />
    <group rotation={[-PI / 2, 0, 0]} position={[0, 0.1296, 0.006]}>{band(0, 0, 0, 0.014)}</group>
    {band(1, 0.07, 0.0102, 0.08)}
    <group rotation={[-PI / 2, 0, 0]} position={[0, 0.0035, 0.02]}>{band(2, 0, 0, 0.022)}</group>
    {tt < 5.5 && <group position={[x, py + 0.03, 0.03]} rotation={[tt < 1.9 ? 0 : -PI / 2 + 0.25, 0, 0]} scale={1.3}><Brush /></group>}
    {tt < 5.5 && <mesh><tubeGeometry args={[hose, 24, 0.02, 12, false]} /><meshPhysicalMaterial color="#5b6168" roughness={0.5} clearcoat={0.3} /></mesh>}
    {/* las motas que se chupa el cepillo */}
    <Motes n={50} r={0.0036} col="#7a746a" pos={(i) => { const ph = (tt * 2.2 + rn(i, 2)) % 1; return [x + 0.09 * (1 - ph) * (rn(i, 3) - 0.1), py + 0.005 + 0.03 * ph, 0.02 + 0.012 * ph]; }} op={() => (k > 0.02 && k < 0.98 ? 0.9 : 0)} />
  </>;
}}</Scene3D>;

// ---- 3:09 · RÁPIDO = AL AIRE: el cepillo pasa ligero, el polvo salta en una nube y vuelve a posarse en el mismo estante ----
export const HFlickDust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[-0.8, 1.6, 0.8]}
  cam={{ at: [0, 0.18, 0.03], az: [-0.55, -0.25], el: [0.12, 0.18], r: [0.6, 0.5], fov: 30 }} over={(tt) => <Tag tt={tt} at={3.4} x={960} y={150} txt="RIGHT BACK DOWN" col={RED} size={44} />}>{(tt) => {
  const x = lerp(-0.45, 0.5, eio(tt, 0.4, 1.0)), settle = cl((tt - 3.0) / 2.0);
  return <>
    <WallBB L={1.0} top={0.95 - 0.5 * cl((tt - 0.5) * 2) + 0.5 * settle} />
    {tt < 1.2 && <group position={[x, 0.155, 0.03]} rotation={[0, 0, -0.5]}><Brush /></group>}
    {/* haz de luz que delata la nube */}
    <mesh position={[0, 0.3, 0.05]} rotation={[0, 0, -0.4]}><planeGeometry args={[0.25, 0.8]} /><meshBasicMaterial color="#fff1d0" transparent opacity={0.06} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    <Motes n={180} r={0.0036} col="#a49d90" pos={(i) => { const x0 = -0.42 + rn(i, 2) * 0.88, t0 = 0.4 + (x0 + 0.45) / 0.95 * 0.6, T = 2.6 + 2.2 * rn(i, 3), k = cl((tt - t0) / T), hgt = (0.08 + 0.2 * rn(i, 4)) * Math.sin(PI * Math.pow(k, 0.7)); return [x0 + 0.06 * Math.sin(k * 5 + i) * k, 0.128 + hgt, 0.006 + 0.08 * Math.sin(PI * k) * rn(i, 6)]; }} op={0.9} />
  </>;
}}</Scene3D>;

// ---- 4:14 · UNA CUCHARADITA EN UN GALÓN: la cucharita gigante en primer plano, una gota verde cae al balde y se abre en el agua ----
export const HTeaspoon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none"
  cam={{ at: [0.0, 0.18, 0], az: [-0.1, 0.1], el: [0.3, 0.36], r: [1.0, 0.9], fov: 30 }}>{(tt) => {
  const tip = eio(tt, 1.0, 1.6), drop = cl((tt - 1.5) / 0.5), dis = eio(tt, 2.0, 4.0);
  const sq = eio(tt, 2.4, 3.0), jet = cl((tt - 2.9) / 0.3) * (1 - eio(tt, 4.6, 5.0)), foam = eio(tt, 3.1, 5.6);
  return <>
    {/* izquierda: UNA cucharadita, una gota y anillos */}
    <group position={[-0.24, 0, 0]}><Bucket lv={0.7} r={0.13} /></group>
    {dis > 0 && [0, 1, 2].map((i) => <mesh key={i} position={[-0.23, 0.166, 0.0]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, cl(dis * 1.4 - i * 0.2)) * (0.03 + 0.06 * i)}><ringGeometry args={[0.6, 1, 40]} /><meshBasicMaterial color="#7fd36a" transparent opacity={0.55 * (1 - dis * 0.6)} depthWrite={false} /></mesh>)}
    <group position={[-0.17, 0.3, 0.05]} rotation={[0.3, -0.5, -1.2 * tip]} scale={2.0}>
      <mesh position={[0.07, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.006, 0.11, 12]} />{M.chrome()}</mesh>
      <mesh scale={[1, 0.4, 0.75]}><sphereGeometry args={[0.022, 24, 12, 0, PI * 2, PI / 2, PI / 2]} />{M.chrome({ side: THREE.DoubleSide })}</mesh>
      {tip < 0.7 && <mesh position={[0, -0.003, 0]} scale={[1, 0.22, 0.75]}><sphereGeometry args={[0.02, 18, 10]} /><meshPhysicalMaterial color="#4fc23a" roughness={0.05} clearcoat={1} /></mesh>}
    </group>
    {drop > 0 && drop < 1 && <mesh position={[-0.21, lerp(0.28, 0.17, drop * drop), 0.03]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.011, 16, 12]} /><meshPhysicalMaterial color="#4fc23a" roughness={0.05} clearcoat={1} /></mesh>}
    {/* derecha: el chorro de la botella y la espuma que rebalsa */}
    <group position={[0.26, 0, 0]}><Bucket lv={0.7} r={0.13} /></group>
    <group position={[0.36, 0.42, 0.02]} rotation={[0, 0, 2.2 * sq]}>
      <mesh><cylinderGeometry args={[0.04, 0.045, 0.16, 24]} /><meshPhysicalMaterial color="#3fae39" roughness={0.2} clearcoat={0.8} /></mesh>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.012, 0.02, 0.04, 16]} />{M.plastic({ col: "#f2f2f2" })}</mesh>
    </group>
    {jet > 0 && <mesh position={[0.27, 0.3, 0.02]} rotation={[0, 0, 0.35]}><cylinderGeometry args={[0.009, 0.014, 0.26 * jet, 10]} /><meshPhysicalMaterial color="#4fc23a" roughness={0.05} clearcoat={1} transparent opacity={0.85} /></mesh>}
    {foam > 0 && Array.from({ length: 40 }, (_, i) => { const a = rn(i, 2) * PI * 2, rr = 0.11 * Math.sqrt(rn(i, 3)); return <mesh key={i} position={[0.26 + Math.cos(a) * rr * (1 + 0.3 * foam), 0.17 + 0.09 * foam * rn(i, 4) + (rr > 0.09 ? -0.06 * foam * rn(i, 5) : 0), Math.sin(a) * rr * (1 + 0.3 * foam)]} scale={(0.012 + 0.018 * rn(i, 6)) * foam}><sphereGeometry args={[1, 12, 10]} /><meshPhysicalMaterial color="#f4f8f2" roughness={0.3} transmission={0.3} clearcoat={0.6} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 4:30 · PAPEL MATAMOSCAS: dos tramos de zócalo; a la izquierda (mucho jabón) el polvo se pega y la cara se pone gris; a la derecha resbala al piso ----
export const HFlypaper: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[-1.0, 1.4, 1.0]}
  cam={{ at: [0, 0.09, 0.02], az: [0.12, -0.12], el: [0.16, 0.2], r: [0.66, 0.58], fov: 30 }}>{(tt) => {
  const film = eio(tt, 0.3, 1.0), gray = eio(tt, 1.2, 5.4);
  return <>
    <WallBB L={1.0} dust={0} />
    <mesh position={[-0.25, 0.062, 0.0101]}><planeGeometry args={[0.48, 0.1]} /><meshPhysicalMaterial color="#e6dcb8" roughness={0.04} clearcoat={1} iridescence={1} iridescenceIOR={1.3} transparent opacity={0.45 * film} /></mesh>
    <mesh position={[lerp(-0.48, -0.02, (tt * 0.4) % 1), 0.062, 0.0104]}><planeGeometry args={[0.03, 0.1]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.35 * film} depthWrite={false} /></mesh>
    {/* la capa de polvo que se va pegando: la mitad izquierda se pone gris */}
    <mesh position={[-0.25, 0.062, 0.0106]}><planeGeometry args={[0.48, 0.1]} /><meshStandardMaterial color="#77716a" transparent opacity={0.6 * gray} roughness={1} depthWrite={false} /></mesh>
    <mesh position={[0, 0.06, 0.012]}><boxGeometry args={[0.004, 0.13, 0.004]} /><meshStandardMaterial color="#555" /></mesh>
    <Motes n={110} r={0.0048} pos={(i) => { const left = i % 2 === 0, x = (left ? -0.47 : 0.03) + rn(i, 2) * 0.44, t0 = 0.6 + rn(i, 3) * 4, k = cl((tt - t0) / 1.0), yh = 0.02 + rn(i, 4) * 0.09, y = lerp(0.26, yh, Math.min(1, k)); const stuck = left && k >= 1; const down = !left && k >= 1 ? cl((tt - t0 - 1.0) / 0.45) : 0; return [x + (left ? 0 : 0.01 * down), stuck ? yh : lerp(y, 0.003, down * down), stuck ? 0.0118 : lerp(0.05, 0.013, k) + 0.03 * down]; }} op={(i) => (tt > 0.6 + rn(i, 3) * 4 ? 0.95 : 0)} />
  </>;
}}</Scene3D>;

// ---- 4:51 · LA LATA DEL CAFÉ: la lata bajo la pileta y las medias con agujeros que van cayendo adentro, una por una ----
const canTex = () => tex.text("coffeecan", 512, 256, (g) => { g.fillStyle = "#b8352b"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#f3e2b8"; g.fillRect(0, 70, 512, 110); g.fillStyle = "#3a1d12"; g.font = "900 64px Georgia"; g.textAlign = "center"; g.fillText("COFFEE", 256, 145); g.fillStyle = "#e8c36a"; g.fillRect(0, 60, 512, 6); g.fillRect(0, 184, 512, 6); });
export const HSockCan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.12, 0], az: [0.35, -0.2], el: [0.38, 0.45], r: [0.8, 0.66], fov: 30 }}>{(tt) => <>
    <mesh position={[0, 0.09, 0]} castShadow receiveShadow><cylinderGeometry args={[0.09, 0.09, 0.18, 40, 1, true]} /><meshStandardMaterial map={canTex()} metalness={0.5} roughness={0.35} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.09, 0.09, 0.004, 40]} />{M.steel()}</mesh>
    {Array.from({ length: 5 }, (_, i) => { const a = 0.4 + i * 0.75, k = phys(tt, a, 7, 0.4), yE = 0.08 + i * 0.03, y = lerp(0.55, yE, cl(k)); return tt > a - 0.05 && <group key={i} position={[(rn(i, 2) - 0.5) * 0.05, Math.max(yE, y), (rn(i, 3) - 0.5) * 0.05]} rotation={[rn(i, 4) * 0.6, rn(i, 5) * 3, (1 - cl(k)) * 1.2 - 0.3]}><Sock g={0.15 + 0.15 * i} s={0.7} /></group>; })}
  </>}</Scene3D>;
