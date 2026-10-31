// lfh29e · componentes únicos 29-34 (las veinte en el fondo, la tensión superficial, armar la trampa, el mapa de trampas, una botella, el alféizar al atardecer)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { SoapBottle, Fly } from "./ek";
import { Jar } from "./ck";

const PI = Math.PI;

// ---- 21:42 · VEINTE EN EL FONDO: el frasco a la hora de la cena; las mosquitas caen una a una y el tambor cuenta hasta 20 ----
export const HTwentyflies: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile" key1={[-0.6, 1.5, 1.2]} warm={0.8}
  cam={{ at: [0.04, 0.09, 0], az: [0.2, -0.1], el: [0.22, 0.16], r: [0.56, 0.48], fov: 30 }}>{(tt) => {
  const n = Math.floor(eio(tt, 0.3, 4.2) * 20);
  return <>
    <group scale={1.4}><Jar fill={0.3} liq="#c87a2a" lid={0} /></group>
    {Array.from({ length: 20 }, (_, i) => { const k = cl((tt - 0.3 - (i / 20) * 3.9) / 0.4); return <group key={i} visible={k > 0} position={[Math.cos(i * 2.4) * 0.035 * Math.sqrt(i / 20 + 0.1), lerp(0.24, 0.062, k), Math.sin(i * 2.4) * 0.035 * Math.sqrt(i / 20 + 0.1)]} rotation={[k < 1 ? k * 3 : PI, i, 0]}><Fly s={2.3} t={k < 1 ? tt + i : 0} wings={k < 1} /></group>; })}
    {/* el contador de tambor al lado */}
    <group position={[0.2, 0.04, 0.06]} rotation={[-0.3, -0.4, 0]}>
      <RBox s={[0.09, 0.06, 0.045]} p={[0, 0, 0]} r={0.008}>{M.wood({ base: [120, 76, 40] })}</RBox>
      {[0, 1].map((d) => { const v = d === 0 ? Math.floor(n / 10) : n % 10; return <group key={d} position={[-0.018 + d * 0.036, 0, 0.024]}>
        <RBox s={[0.03, 0.04, 0.004]} p={[0, 0, 0]} r={0.003}><meshStandardMaterial color="#f6f1e4" /></RBox>
        <mesh position={[0, 0, 0.003]}><planeGeometry args={[0.028, 0.038]} /><meshBasicMaterial transparent map={tex.text("tw" + v, 64, 80, (g) => { g.fillStyle = "#1c1a16"; g.font = "800 64px Georgia"; g.textAlign = "center"; g.fillText(String(v), 32, 64); })} /></mesh>
      </group>; })}
    </group>
  </>;
}}</Scene3D>;

// ---- 22:00 · LA TENSIÓN SUPERFICIAL: la mosquita se posa y el vinagre la sostiene como una cama elástica; cae una gota de jabón y la piel se rompe ----
// la piel del vinagre: UNA malla circular que se hunde bajo la mosquita y hace ondas (antes 600 cubitos con material propio = el navegador se caía)
const Skin: React.FC<{ land: number; brk: number; tt: number }> = ({ land, brk, tt }) => {
  const g = React.useMemo(() => new THREE.CircleGeometry(0.12, 64, 0, Math.PI * 2), []);
  const base = React.useMemo(() => Float32Array.from(g.attributes.position.array as ArrayLike<number>), [g]);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let v = 0; v < pos.count; v++) { const x = base[v * 3], y = base[v * 3 + 1], d = Math.hypot(x, y);
    pos.setZ(v, -0.012 * land * Math.exp(-d * d / 0.0006) * (1 - brk) + brk * 0.004 * Math.sin(d * 120 - tt * 14) * Math.exp(-d * 6)); }
  pos.needsUpdate = true; g.computeVertexNormals();
  return <mesh geometry={g} rotation={[-PI / 2, 0, 0]}><meshPhysicalMaterial color={brk > 0.3 ? "#d29a52" : "#c87a2a"} roughness={0.05} clearcoat={1} /></mesh>;
};

export const HTension: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#1a120a" key1={[-0.4, 1.4, 1.0]} warm={0.9}
  cam={{ at: [0, 0.0, 0], az: [0.25, -0.1], el: [0.18, 0.12], r: [0.3, 0.24], fov: 30 }}>{(tt) => {
  const land = eio(tt, 0.3, 1.2), drop = cl((tt - 2.4) / 0.5), brk = eio(tt, 2.9, 3.6), sink = eio(tt, 3.4, 5.6);
  return <>
    {/* la piel del vinagre: malla que se hunde bajo la mosquita y se rompe en ondas cuando llega el jabón */}
    <Skin land={land} brk={brk} tt={tt} />
    {/* la mosquita grande: baja, queda parada; cuando se rompe la piel se hunde */}
    <group position={[0, lerp(0.07, 0.014, land) - 0.012 * sink - 0.006 * land * (1 - brk), 0]} rotation={[0.5 * sink, 0.6, 0.3 * sink]}><Fly s={6} t={tt} wings={land < 0.9} /></group>
    {/* la gota de jabón que cae al costado */}
    <mesh visible={drop > 0 && drop < 1} position={[0.06, lerp(0.14, 0.004, drop), 0.03]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.006, 14, 10]} /><meshPhysicalMaterial color="#58b86a" roughness={0.1} clearcoat={1} /></mesh>
    {/* el anillo verde de jabón que se abre desde donde cayó */}
    <mesh position={[0.06, 0.004, 0.03]} rotation={[-PI / 2, 0, 0]} visible={brk > 0.02} scale={1 + brk * 5}><ringGeometry args={[0.01, 0.013, 32]} /><meshBasicMaterial color="#8ad89a" transparent opacity={0.7 * (1 - sink)} /></mesh>
  </>;
}}</Scene3D>;

// ---- 22:31 · ARMAR LA TRAMPA: medio vaso de vinagre, una gota de jabón, la cáscara de durazno; tres pasos que caen uno sobre otro ----
export const HTrapbuild: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" key1={[-0.6, 1.5, 1.2]} warm={0.85}
  cam={{ at: [0, 0.1, 0], az: [-0.3, 0.2], el: [0.3, 0.22], r: [0.66, 0.54], fov: 30 }}>{(tt) => {
  const v = eio(tt, 0.4, 1.8), d = cl((tt - 2.4) / 0.4), p = phys(tt, 3.4, 6, 0.4), done = eio(tt, 4.6, 5.4);
  return <>
    <group scale={1.4}><Jar fill={0.05 + 0.3 * v} liq="#c87a2a" lid={0} /></group>
    {/* la taza medidora que vuelca medio vaso */}
    <group position={[-0.12, 0.26, 0]} rotation={[0, 0, -1.6 * Math.sin(Math.min(1, v * 1.1) * PI / 2) * (1 - eio(tt, 1.8, 2.3))]} visible={tt < 2.3}>
      <mesh><cylinderGeometry args={[0.04, 0.035, 0.07, 24, 1, true]} />{M.glass({ op: 0.35, side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, -0.01, 0]}><cylinderGeometry args={[0.038, 0.034, 0.04, 24]} /><meshPhysicalMaterial color="#c87a2a" roughness={0.05} transmission={0.4} /></mesh>
      <mesh position={[0.045, 0.0, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.018, 0.004, 8, 16, PI]} />{M.glass({ op: 0.5 })}</mesh>
    </group>
    {/* la botella de detergente que suelta UNA gota */}
    <group position={[0.06, 0.32, 0]} rotation={[0, 0, 2.6]} visible={tt > 1.9 && tt < 3.2}><SoapBottle s={0.9} /></group>
    <mesh visible={d > 0 && d < 1} position={[0.0, lerp(0.22, 0.07, d), 0]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.007, 14, 10]} /><meshPhysicalMaterial color="#58b86a" roughness={0.1} clearcoat={1} /></mesh>
    <mesh visible={d >= 1} position={[0, 0.072, 0]} rotation={[-PI / 2, 0, 0]} scale={1 + 3 * cl((tt - 2.8) / 0.6)}><ringGeometry args={[0.006, 0.009, 24]} /><meshBasicMaterial color="#8ad89a" transparent opacity={0.6 * (1 - cl((tt - 2.8) / 0.8))} /></mesh>
    {/* la cáscara de durazno que cae con rebote */}
    <group position={[0.01, 0.08 + 0.2 * (1 - cl(p)), 0.01]} rotation={[0.3, tt, 0.2]} visible={tt > 3.3}>
      <mesh scale={[1.6, 0.3, 1]}><sphereGeometry args={[0.018, 16, 10, 0, PI]} /><meshPhysicalMaterial color="#f2a24a" roughness={0.7} sheen={1} sheenColor="#ffd2a0" side={THREE.DoubleSide} /></mesh>
    </group>
    {/* tres fichas de paso que se encienden debajo: taza, gota, cáscara (íconos, sin texto) */}
    {[v, d, cl(p)].map((k, i) => <group key={i} position={[-0.14 + i * 0.14, 0.004, 0.16]} visible={k > 0.05} scale={0.4 + 0.6 * cl(k)}>
      <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.03, 32]} /><meshStandardMaterial color={k >= 0.99 ? "#c2302a" : "#3a3028"} roughness={0.6} /></mesh>
      <mesh position={[0, 0.006, 0]} visible={k >= 0.99}>{i === 0 ? <cylinderGeometry args={[0.012, 0.01, 0.012, 16]} /> : i === 1 ? <sphereGeometry args={[0.008, 12, 10]} /> : <sphereGeometry args={[0.012, 12, 8, 0, PI]} />}<meshStandardMaterial color={["#c87a2a", "#58b86a", "#f2a24a"][i]} /></mesh>
    </group>)}
    <mesh position={[0, 0.002, 0.16]} rotation={[-PI / 2, 0, 0]} scale={[done + 0.001, 1, 1]}><planeGeometry args={[0.3, 0.004]} /><meshBasicMaterial color="#c2302a" /></mesh>
  </>;
}}</Scene3D>;

// ---- 23:10 · DOS O TRES SI LA COCINA ES GRANDE: plano de la cocina; las trampas caen donde están las nubes y las nubes se achican ----
export const HTrapmap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#181410" key1={[-0.4, 1.8, 0.8]}
  cam={{ at: [0, 0, 0.02], az: [-0.1, 0.1], el: [1.05, 0.9], r: [1.05, 0.91], fov: 30 }}>{(tt) => {
  const T = [[-0.24, -0.12], [0.2, -0.14], [0.02, 0.14]];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.9, 0.6]} /><meshStandardMaterial map={tex.text("lino3", 256, 256, (g) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? "#e2d4b0" : "#b08e60"; g.fillRect(x * 32, y * 32, 32, 32); } })} roughness={0.6} /></mesh>
    <RBox s={[0.84, 0.03, 0.12]} p={[0, 0.015, -0.24]} r={0.004}><meshStandardMaterial map={tex.counter(4, 1)} roughness={0.5} /></RBox>
    <RBox s={[0.3, 0.05, 0.16]} p={[0.02, 0.025, 0.14]} r={0.006}>{M.wood({ base: [130, 86, 48] })}</RBox>
    {T.map(([x, z], i) => { const drop = phys(tt, 0.5 + i * 0.9, 6, 0.4), shrink = eio(tt, 1.2 + i * 0.9, 4.6 + i * 0.3); return <group key={i} position={[x, 0.03 + (i === 2 ? 0.02 : 0), z]}>
      <group position={[0, 0.2 * (1 - cl(drop)), 0]} scale={0.9}><Jar fill={0.3} liq="#c87a2a" lid={0} /></group>
      {Array.from({ length: 14 }, (_, k) => { const a = tt * (1.2 + rn(k + i * 9, 2)) + k * 2.4, rr = 0.07 * (1 - 0.8 * shrink); return <group key={k} visible={k / 14 > shrink * 0.9} position={[Math.cos(a) * rr * rn(k, 3), 0.12 + Math.sin(tt * 2 + k) * 0.02, Math.sin(a) * rr * rn(k, 4)]}><Fly s={2} t={tt + k} /></group>; })}
      <mesh position={[0, -0.028 + 0.001, 0]} rotation={[-PI / 2, 0, 0]} scale={cl(drop) + 0.001}><ringGeometry args={[0.07, 0.08, 40]} /><meshBasicMaterial color="#c2302a" transparent opacity={0.7} /></mesh>
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 25:23 · UNA BOTELLA, UN DÓLAR: la botella sola en la mesa y, a su alrededor, se dibujan los cuatro usos: pimpollo, hormiga, plato, frasco ----
export const HOnebottle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" key1={[-0.6, 1.6, 1.2]} warm={0.85}
  cam={{ at: [0, 0.1, 0], az: [-0.5, 0.5], el: [0.3, 0.2], r: [0.7, 0.6], fov: 30 }}>{(tt) => {
  const land = phys(tt, 0.3, 6, 0.45);
  return <>
    <group position={[0, 0.15 * (1 - cl(land)), 0]}><SoapBottle s={1.4} /></group>
    {/* la moneda de un dólar que rueda y se apoya a su lado */}
    <group position={[lerp(0.4, 0.12, eio(tt, 0.6, 1.8)), 0.022, 0.08]} rotation={[0, 0, -eio(tt, 0.6, 1.8) * 8 + (tt > 1.8 ? 0 : 0)]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.004, 32]} /><meshStandardMaterial color="#d8b445" metalness={0.8} roughness={0.3} /></mesh>
    </group>
    {/* los cuatro trabajos en órbita, uno por vez: rosa, hormiga, plato, frasco */}
    {[0, 1, 2, 3].map((i) => { const k = phys(tt, 1.8 + i * 0.6, 6, 0.4), a = i * PI / 2 + tt * 0.3, rr = 0.22; return <group key={i} position={[Math.cos(a) * rr, 0.1 + 0.02 * Math.sin(tt * 2 + i), Math.sin(a) * rr]} scale={cl(k) * 1 + 0.001}>
      {i === 0 && <mesh><sphereGeometry args={[0.025, 16, 12]} /><meshPhysicalMaterial color="#e0667a" roughness={0.45} sheen={0.6} /></mesh>}
      {i === 1 && <group>{[[-0.012, 0.009], [0, 0.007], [0.012, 0.008]].map(([x, r], j) => <mesh key={j} position={[x, 0, 0]} scale={[1.3, 1, 1]}><sphereGeometry args={[r, 10, 8]} /><meshPhysicalMaterial color="#1a1310" roughness={0.25} clearcoat={1} /></mesh>)}</group>}
      {i === 2 && <mesh rotation={[0.4, 0, 0]}><cylinderGeometry args={[0.03, 0.025, 0.008, 28]} />{M.porcelain({ col: "#e8e2d4" })}</mesh>}
      {i === 3 && <group scale={0.55}><Jar fill={0.3} liq="#c87a2a" lid={0} /></group>}
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 26:15 · EL ALFÉIZAR AL ATARDECER: la botella en la ventana, el rosal limpio afuera y el sol que baja detrás ----
export const HSillsunset: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#2a1a14" key1={[-0.6, 1.2, 1.4]} warm={0.6}
  cam={{ at: [0, 0.16, 0], az: [-0.08, 0.08], el: [0.06, 0.04], r: [0.78, 0.7], fov: 30 }}>{(tt) => {
  const sun = eio(tt, 0, 4.5);
  return <>
    {/* el cielo del atardecer y el sol que baja */}
    <mesh position={[0, 0.2, -0.5]}><planeGeometry args={[2.4, 1.4]} /><meshBasicMaterial color={new THREE.Color("#e8905a").lerp(new THREE.Color("#5a3050"), sun)} /></mesh>
    <mesh position={[0.18, lerp(0.3, 0.06, sun), -0.45]}><sphereGeometry args={[0.06, 24, 16]} />{M.glow({ col: "#ffc070", op: 0.9 })}</mesh>
    <mesh position={[0, 0.02, -0.42]}><planeGeometry args={[2.4, 0.12]} /><meshBasicMaterial color="#2e3a1c" /></mesh>
    {/* rosas limpias recortadas contra el cielo */}
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.3 + i * 0.1, 0.1 + 0.03 * Math.sin(i * 2), -0.38]}><sphereGeometry args={[0.025, 14, 10]} /><meshStandardMaterial color="#e0667a" roughness={0.5} emissive="#5a1a20" emissiveIntensity={0.3} /></mesh>)}
    {/* el marco de la ventana y el alféizar */}
    {[[-0.36, 0.2, 0.04, 0.5], [0.36, 0.2, 0.04, 0.5], [0, 0.44, 0.76, 0.04], [0, 0.2, 0.02, 0.5]].map(([x, y, w, hh], i) => <RBox key={i} s={[w, hh, 0.04]} p={[x, y, 0]} r={0.006}><meshStandardMaterial color="#efe6d4" roughness={0.6} /></RBox>)}
    <RBox s={[0.84, 0.03, 0.16]} p={[0, -0.04, 0.06]} r={0.006}><meshStandardMaterial color="#e6dcc6" roughness={0.6} /></RBox>
    <group position={[-0.16, -0.025, 0.08]}><SoapBottle s={1.1} /></group>
    <group position={[0.18, -0.025, 0.08]} scale={0.9}><Jar fill={0.3} liq="#c87a2a" lid={0} /></group>
  </>;
}}</Scene3D>;
