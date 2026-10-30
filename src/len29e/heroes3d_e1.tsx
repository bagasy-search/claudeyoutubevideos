// len29e · componentes únicos en 3D real (kit h3d) — el triturador de Lenny: piezas compartidas + 1-11 (0:04 → 5:41).
// Todos parten del mismo objeto (el triturador en corte: brida, cámara, anillo moledor, plato con dos impulsores, eje, motor,
// agujero hexagonal y botón rojo abajo), así el video entero habla de UNA máquina que el que mira termina conociendo.
import React from "react";
import * as THREE from "three";
import { AMB, H, ICE, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, curve, eio, lerp, phys, rn, tex, tubeG } from "./h3d";

export const PI = Math.PI;
export const SKIN = "#d8a888";
const CLIP = [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)];
const BODY = "#1e2124", INNER = "#5a5e63";

// ---- piezas compartidas ----
// las aletas de goma del desagüe: 8 gajos que se doblan hacia adentro (open 0..1); film = mugre gris de abajo
export const Flaps: React.FC<{ p?: number[]; open?: number; film?: number; r?: number; push?: number[] }> = ({ p = [0, 0, 0], open = 0, film = 0, r = 0.045, push }) => <group position={p as [number, number, number]}>
  {Array.from({ length: 8 }, (_, i) => { const o = Math.max(open, push ? push[i] ?? 0 : 0); return <group key={i} rotation={[0, i * PI / 4 + PI / 8, 0]}>
    <group position={[r, 0, 0]} rotation={[0, 0, -o * 1.15]}>
      <mesh position={[-r * 0.5, 0, 0]} castShadow receiveShadow><boxGeometry args={[r * 0.98, 0.003, r * 0.72]} /><meshStandardMaterial color="#141414" roughness={0.7} /></mesh>
      <mesh position={[-r * 0.5, -0.0022, 0]}><boxGeometry args={[r * 0.96, 0.0012, r * 0.7]} /><meshStandardMaterial color="#9a9670" roughness={0.35} emissive="#3a3820" emissiveIntensity={0.6 * film} transparent opacity={film} depthWrite={false} /></mesh>
    </group></group>; })}
  <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.0018, 0]}><ringGeometry args={[r, r + 0.012, 48]} />{M.chrome()}</mesh>
</group>;

// la llave Allen: L de barra hexagonal (corto hacia arriba, largo hacia el costado)
export const Allen: React.FC<{ p?: number[]; rot?: number[]; s?: number; glow?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, glow = 0 }) => <group position={p as [number, number, number]} rotation={rot as [number, number, number]} scale={s}>
  <mesh position={[0, 0.02, 0]} castShadow><cylinderGeometry args={[0.0036, 0.0036, 0.04, 6]} /><meshStandardMaterial color="#cfd3d6" metalness={1} roughness={0.2} emissive="#ffb64a" emissiveIntensity={glow} /></mesh>
  <mesh position={[0.045, -0.002, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.0036, 0.0036, 0.09, 6]} /><meshStandardMaterial color="#cfd3d6" metalness={1} roughness={0.2} emissive="#ffb64a" emissiveIntensity={glow} /></mesh>
  <mesh position={[0, -0.002, 0]}><sphereGeometry args={[0.0042, 12, 8]} />{M.steel()}</mesh>
</group>;

// la mano (de len29d): palma + cuatro dedos + pulgar; curl cierra los dedos
export const Hand: React.FC<{ p?: number[]; rot?: number[]; curl?: number; s?: number; col?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], curl = 0, s = 1, col = SKIN }) => <group position={p as [number, number, number]} rotation={rot as [number, number, number]} scale={s}>
  <RBox s={[0.075, 0.085, 0.026]} r={0.012} p={[0, 0.06, 0]}>{M.matte({ col })}</RBox>
  <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.03, 0.034, 0.08, 20]} />{M.matte({ col: "#3c4a5c" })}</mesh>
  {[-0.027, -0.009, 0.009, 0.027].map((x, i) => <group key={i} position={[x, 0.015, 0]} rotation={[curl * 1.4, 0, 0]}>
    <mesh position={[0, -0.025 + 0.004 * Math.abs(i - 1.5), 0]} castShadow><capsuleGeometry args={[0.0085, 0.04 - 0.004 * Math.abs(i - 1.5), 6, 12]} />{M.matte({ col })}</mesh>
  </group>)}
  <mesh position={[0.045, 0.045, 0.008]} rotation={[0, 0, 0.8 - 0.5 * curl]} castShadow><capsuleGeometry args={[0.009, 0.035, 6, 12]} />{M.matte({ col })}</mesh>
</group>;

// la tapa de llave de luz con su palanquita (up 1 = prendida)
export const Switch: React.FC<{ p?: number[]; up?: number; glow?: number; s?: number }> = ({ p = [0, 0, 0], up = 0, glow = 0, s = 1 }) => <group position={p as [number, number, number]} scale={s}>
  <RBox s={[0.07, 0.11, 0.008]} r={0.006}>{M.plastic({ col: "#f1ede2" })}</RBox>
  <RBox s={[0.018, 0.032, 0.006]} r={0.003} p={[0, 0, 0.006]}>{M.plastic({ col: "#e4dfd2" })}</RBox>
  <group position={[0, 0, 0.008]} rotation={[lerp(0.55, -0.55, up), 0, 0]}><RBox s={[0.012, 0.026, 0.012]} r={0.004} p={[0, 0, 0.008]}>{M.plastic({ col: "#fbf8f0", em: "#7dff9e", emI: glow })}</RBox></group>
</group>;

// el enchufe con su cable: out 0 = enchufado en el tomacorriente (que está en [0,0,0])
export const PlugOutlet: React.FC<{ p?: number[]; out?: number; s?: number }> = ({ p = [0, 0, 0], out = 0, s = 1 }) => <group position={p as [number, number, number]} scale={s}>
  <RBox s={[0.07, 0.11, 0.008]} r={0.006}>{M.plastic({ col: "#f1ede2" })}</RBox>
  {[-0.024, 0.024].map((y) => <RBox key={y} s={[0.034, 0.034, 0.006]} r={0.008} p={[0, y, 0.005]}>{M.plastic({ col: "#e9e4d8" })}</RBox>)}
  <group position={[0, 0.024, 0.02 + 0.09 * out]} rotation={[0, 0, 0.3 * out]}>
    <RBox s={[0.028, 0.034, 0.03]} r={0.006}>{M.plastic({ col: "#2a2c2e" })}</RBox>
    <mesh geometry={tubeG("e_cord", [[0, -0.01, 0.012], [0, -0.06, 0.04], [0.03, -0.14, 0.05], [0.08, -0.2, 0.02]], 0.004, 40, 8)}>{M.plastic({ col: "#2a2c2e" })}</mesh>
  </group>
</group>;

// el triturador. cut: corte a la mitad (se ve la cámara); spin: ángulo del plato; crust: sarro en el anillo; jam: carozo trabado;
// hex/btn: brillo del agujero hexagonal y del botón rojo; btnOut: el botón saltó; glass: carcasa de vidrio (rayos X); shake: vibra
export type DispP = { p?: number[]; s?: number; cut?: boolean; spin?: number; crust?: number; jam?: number; hex?: number; btn?: number; btnOut?: number; glass?: number;
  shake?: number; open?: number; film?: number; plug?: number; coil?: number; ringShine?: number; sink?: boolean; outlet?: boolean; hairW?: number; crack?: number };
export const Disposal: React.FC<DispP> = ({ p = [0, 0, 0], s = 1, cut = false, spin = 0, crust = 0, jam = 0, hex = 0, btn = 0, btnOut = 0, glass = 0, shake = 0, open = 0, film = 0, plug = 0, coil = 0, ringShine = 0, sink = true, outlet = true, hairW = 0, crack = 0 }) => {
  const cp = cut ? CLIP : [], op = 1 - 0.82 * glass, tr = glass > 0.01;
  const shell = (col: string, rough = 0.5) => <meshStandardMaterial color={col} roughness={rough} metalness={0.25} clippingPlanes={cp} transparent={tr} opacity={op} side={THREE.DoubleSide} depthWrite={!tr} />;
  const ringCol = new THREE.Color("#8d9196").lerp(new THREE.Color("#6b5a3c"), crust * 0.85).getStyle();
  return <group position={[p[0] + shake * Math.sin(p[0] * 9 + spin * 31), p[1], p[2]]} scale={s}>
    {sink && <mesh position={[0, 0.137, 0]}><cylinderGeometry args={[0.17, 0.17, 0.006, 64]} /><meshStandardMaterial color="#c9ced3" metalness={0.85} roughness={0.25} clippingPlanes={cp} side={THREE.DoubleSide} /></mesh>}
    <Flaps p={[0, 0.142, 0]} open={open} film={film} />
    <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.05, 0.05, 0.03, 48, 1, true]} /><meshStandardMaterial color="#e3e7ea" metalness={1} roughness={0.15} clippingPlanes={cp} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.072, 0.072, 0.02, 48, 1, true]} />{shell("#9aa0a6", 0.35)}</mesh>
    <mesh position={[0, 0.11, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.05, 0.072, 48]} />{shell("#9aa0a6", 0.35)}</mesh>
    <mesh position={[0, 0.09, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.072, 0.085, 48]} />{shell(BODY)}</mesh>
    {/* la cámara (arriba) y el motor (abajo) */}
    <mesh position={[0, 0.035, 0]} castShadow><cylinderGeometry args={[0.085, 0.085, 0.11, 64, 1, true]} />{shell(BODY)}</mesh>
    <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[0.079, 0.079, 0.108, 64, 1, true]} /><meshStandardMaterial color={INNER} roughness={0.8} side={THREE.BackSide} clippingPlanes={cp} transparent={tr} opacity={op} /></mesh>
    <mesh position={[0, -0.07, 0]} castShadow><cylinderGeometry args={[0.08, 0.075, 0.1, 64, 1, true]} />{shell(BODY)}</mesh>
    <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.0815, 0.0815, 0.022, 64, 1, true]} />{shell("#b8bec4", 0.3)}</mesh>
    <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.075, 0.075, 0.004, 64]} />{shell("#26292c")}</mesh>
    {cut && <>
      {/* las caras del corte: anillo claro donde la carcasa está cortada */}
      <mesh position={[0, 0.035, 0.0005]}><planeGeometry args={[0.17, 0.11]} /><meshBasicMaterial color="#000" transparent opacity={0} /></mesh>
    </>}
    {/* el anillo moledor: aro con dientes y ranuras */}
    <group position={[0, 0.0, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.074, 0.006, 10, 64]} /><meshStandardMaterial color={ringCol} metalness={0.8} roughness={0.35 + 0.4 * crust} emissive="#ffffff" emissiveIntensity={0.25 * ringShine} clippingPlanes={cp} /></mesh>
      {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[Math.cos(i * PI / 11) * 0.069, 0, Math.sin(i * PI / 11) * 0.069]} rotation={[0, -i * PI / 11, 0]}>
        <boxGeometry args={[0.006, 0.014, 0.008]} /><meshStandardMaterial color={ringCol} metalness={0.8} roughness={0.4 + 0.4 * crust} emissive="#ffffff" emissiveIntensity={0.2 * ringShine} clippingPlanes={cp} /></mesh>)}
      {Array.from({ length: 26 }, (_, i) => <mesh key={"c" + i} position={[Math.cos(i * 0.97) * 0.068, (rn(i, 2) - 0.5) * 0.016, Math.sin(i * 0.97) * 0.068]} scale={0.001 + crust}><sphereGeometry args={[0.004 + 0.003 * rn(i, 3), 8, 6]} /><meshStandardMaterial color="#6e5734" roughness={0.95} clippingPlanes={cp} /></mesh>)}
    </group>
    {/* el plato con los dos impulsores (giran juntos) */}
    <group position={[0, -0.012, 0]} rotation={[0, spin, 0]}>
      <mesh castShadow receiveShadow><cylinderGeometry args={[0.066, 0.066, 0.006, 64]} /><meshStandardMaterial color="#a6abb0" metalness={0.85} roughness={0.3} clippingPlanes={cp} /></mesh>
      {[0, PI].map((a, i) => <group key={i} rotation={[0, a, 0]}><mesh position={[0.044, 0.008, 0]} rotation={[0, 0.4 * Math.sin(spin * 3 + i), 0]} castShadow><boxGeometry args={[0.022, 0.01, 0.01]} /><meshStandardMaterial color="#c3c8cd" metalness={0.9} roughness={0.25} clippingPlanes={cp} /></mesh>
        <mesh position={[0.036, 0.008, 0]}><cylinderGeometry args={[0.003, 0.003, 0.012, 10]} />{M.steel()}</mesh></group>)}
      {[...Array(8)].map((_, i) => <mesh key={i} position={[Math.cos(i * PI / 4 + 0.3) * 0.025, 0.0032, Math.sin(i * PI / 4 + 0.3) * 0.025]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.004, 12]} /><meshBasicMaterial color="#2a2c2e" /></mesh>)}
    </group>
    {/* el eje y el bobinado del motor */}
    <mesh position={[0, -0.065, 0]}><cylinderGeometry args={[0.008, 0.008, 0.11, 16]} /><meshStandardMaterial color="#d7dbde" metalness={1} roughness={0.2} clippingPlanes={cp} /></mesh>
    <mesh position={[0, -0.075, 0]}><cylinderGeometry args={[0.05, 0.05, 0.05, 40, 1, true]} /><meshStandardMaterial color={new THREE.Color("#b5723a").lerp(new THREE.Color("#ff3a1a"), coil).getStyle()} metalness={0.7} roughness={0.35} emissive="#ff2a00" emissiveIntensity={1.4 * coil} clippingPlanes={cp} side={THREE.DoubleSide} /></mesh>
    {/* pelo enroscado en el eje, bajo el plato */}
    {Array.from({ length: 14 }, (_, i) => <mesh key={"h" + i} position={[0, -0.02 - i * 0.0016, 0]} rotation={[PI / 2, 0, i]} scale={hairW > i / 14 ? 1 : 0.001}><torusGeometry args={[0.0095 + 0.0006 * i, 0.0006, 4, 24]} />{M.hair()}</mesh>)}
    {/* carozo de durazno trabado entre un impulsor y el anillo */}
    <mesh position={[0.06, 0.004, 0.012]} rotation={[0.4, 0.9, 0.2]} scale={[1, 0.7, 0.8].map((v) => v * (0.001 + jam)) as [number, number, number]} castShadow><sphereGeometry args={[0.012, 16, 12]} /><meshStandardMaterial color="#8a5a3a" roughness={0.9} emissive="#ff3a1a" emissiveIntensity={0.3 * jam * (0.6 + 0.4 * Math.sin(spin * 40))} /></mesh>
    {/* abajo: agujero hexagonal y botón rojo */}
    <mesh position={[0, -0.1225, 0]}><cylinderGeometry args={[0.0095, 0.0095, 0.002, 6]} /><meshStandardMaterial color="#050505" emissive="#ffb64a" emissiveIntensity={0.9 * hex} /></mesh>
    <mesh position={[0, -0.1235, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.013, 0.0012, 6, 6]} /><meshBasicMaterial color="#ffb64a" transparent opacity={hex} toneMapped={false} /></mesh>
    <mesh position={[0.042, -0.124 - 0.006 * btnOut, 0.018]}><cylinderGeometry args={[0.007, 0.007, 0.008, 24]} /><meshStandardMaterial color="#d22a20" roughness={0.4} emissive="#ff3020" emissiveIntensity={1.2 * btn} /></mesh>
    {/* la salida al costado (codo blanco) y la entrada del lavavajillas al otro lado */}
    {outlet && <mesh geometry={tubeG("e_out", [[0.08, -0.005, 0], [0.13, -0.005, 0], [0.16, -0.03, 0], [0.165, -0.12, 0]], 0.019, 40, 20)} castShadow>{M.pvc()}</mesh>}
    <group position={[-0.088, 0.075, 0]} rotation={[0, 0, PI / 2]}>
      <mesh><cylinderGeometry args={[0.011, 0.012, 0.03, 24, 1, true]} /><meshStandardMaterial color="#2a2c2e" roughness={0.5} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.012, 0]} scale={0.001 + plug}><cylinderGeometry args={[0.0105, 0.0105, 0.003, 24]} />{M.plastic({ col: "#3a3c3f" })}</mesh>
    </group>
    {/* fisura de la carcasa */}
    <mesh position={[-0.06, -0.06, 0.059]} rotation={[0, -0.78, 0]}><planeGeometry args={[0.004, 0.09 * crack]} /><meshBasicMaterial color="#ff6a3a" transparent opacity={crack} toneMapped={false} /></mesh>
  </group>;
};

// ---- 0:04 · EL ZUMBIDO: la llave de luz se prende, el triturador tiembla y suelta anillos de sonido ámbar, pero el plato no gira ----
export const HHumSwitch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="wood" warm={0.8}
  cam={{ at: [0, 0.3, 0], az: [-0.5, -0.15], el: [0.12, 0.2], r: [1.05, 0.85], fov: 30 }}>{(tt) => {
  const up = eio(tt, 0.5, 0.8) - eio(tt, 3.2, 3.4) + eio(tt, 3.9, 4.1), on = up > 0.5 ? 1 : 0;
  return <>
    <Switch p={[-0.3, 0.42, -0.2]} up={up} glow={on * 0.6} s={1.4} />
    <Disposal p={[0.05, 0.3, 0]} shake={0.002 * on} spin={tt * 0.6} />
    {Array.from({ length: 4 }, (_, i) => { const k = ((tt * 0.9 + i / 4) % 1); return <mesh key={i} position={[0.05, 0.31, 0]} rotation={[PI / 2, 0, 0]} scale={0.6 + 2.2 * k}><torusGeometry args={[0.1, 0.0025, 8, 64]} /><meshBasicMaterial color="#ffb64a" transparent opacity={on * 0.55 * (1 - k)} toneMapped={false} depthWrite={false} /></mesh>; })}
    <pointLight position={[0.05, 0.25, 0.25]} intensity={0.4 * on} distance={0.8} color="#ffb64a" />
  </>;
}}</Scene3D>;

// ---- 0:22 · LA MANO NO ENTRA: vista desde arriba del desagüe; una mano baja hacia las aletas y a un dedo de entrar un disco rojo la frena y la manda de vuelta ----
export const HHandStop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" warm={0.9}
  cam={{ at: [0, 0.14, 0], az: [0.2, -0.1], el: [0.95, 0.82], r: [0.62, 0.5], fov: 32 }}>{(tt) => {
  const down = eio(tt, 0.4, 2.6), stop = phys(tt, 2.6, 7, 0.4), back = eio(tt, 3.6, 4.8);
  return <>
    <mesh position={[0, 0.137, 0]}><cylinderGeometry args={[0.32, 0.32, 0.006, 64]} /><meshStandardMaterial color="#c9ced3" metalness={0.85} roughness={0.25} /></mesh>
    <Flaps p={[0, 0.142, 0]} open={0.25 * down * (1 - back)} />
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[Math.cos(i * 0.7) * (0.09 + 0.12 * rn(i, 2)), 0.145, Math.sin(i * 0.7) * (0.09 + 0.12 * rn(i, 2))]} rotation={[-PI / 2, 0, rn(i, 3) * 6]}><circleGeometry args={[0.02 + 0.015 * rn(i, 4), 7]} /><meshStandardMaterial color="#c8b07a" roughness={0.9} side={THREE.DoubleSide} /></mesh>)}
    <Hand p={[0.02, lerp(0.45, 0.18, down) + 0.2 * back, 0.02]} rot={[PI, 0, 0.2]} curl={0.1} s={1.1} />
    <group position={[0, 0.23, 0]} rotation={[-PI / 2, 0, 0]} scale={0.001 + stop * (1 - back * 0.3)}>
      <mesh><ringGeometry args={[0.07, 0.085, 64]} /><meshBasicMaterial color={RED} toneMapped={false} transparent opacity={0.95} /></mesh>
      <mesh rotation={[0, 0, PI / 4]}><planeGeometry args={[0.15, 0.014]} /><meshBasicMaterial color={RED} toneMapped={false} /></mesh>
      <mesh><circleGeometry args={[0.07, 64]} /><meshBasicMaterial color="#ff5a4a" transparent opacity={0.18} depthWrite={false} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 1:46 · NO HAY CUCHILLAS: la cruz de cuchillas de licuadora gira arriba; se achica y se hunde, y desde abajo sube el plato chato con sus dos impulsores ----
export const HNoBlades: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile"
  cam={{ at: [0, 0.13, 0], az: [-0.35, 0.25], el: [0.42, 0.32], r: [0.42, 0.34], fov: 30 }}>{(tt) => {
  const gone = eio(tt, 2.4, 3.4), rise = phys(tt, 3.2, 6, 0.45);
  return <>
    <group position={[0, 0.2 - 0.12 * gone, 0]} rotation={[0, tt * 9 * (1 - gone), 0]} scale={0.001 + (1 - gone)}>
      {[0, 1, 2, 3].map((i) => <mesh key={i} rotation={[0, i * PI / 2, (i % 2 ? 0.35 : -0.35)]} position={[0, 0, 0]} castShadow><boxGeometry args={[0.16, 0.003, 0.022]} /><meshStandardMaterial color="#eef1f4" metalness={1} roughness={0.08} /></mesh>)}
      <mesh><cylinderGeometry args={[0.012, 0.012, 0.03, 20]} />{M.steel()}</mesh>
    </group>
    <group position={[0, 0.02 + 0.12 * rise, 0]} scale={0.001 + rise}>
      <mesh castShadow receiveShadow><cylinderGeometry args={[0.066, 0.066, 0.006, 64]} /><meshStandardMaterial color="#a6abb0" metalness={0.85} roughness={0.3} /></mesh>
      {[0, PI].map((a, i) => <mesh key={i} position={[Math.cos(a) * 0.044, 0.008, Math.sin(a) * 0.044]} castShadow><boxGeometry args={[0.022, 0.01, 0.01]} />{M.steel()}</mesh>)}
      <mesh position={[0, 0.0, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.074, 0.005, 10, 64]} />{M.steel({ col: "#8d9196" })}</mesh>
    </group>
    <pointLight position={[0, 0.35, 0.2]} intensity={0.3 * rise} distance={0.7} color="#cfe6ff" />
  </>;
}}</Scene3D>;
const _noblades = AMB;

// ---- 2:01 · LO DE ADENTRO: el triturador se abre en el aire en sus pisos (aletas, cámara, anillo, plato con impulsores, motor) y cada uno se enciende al nombrarlo ----
export const HInsideCut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" warm={0.85}
  cam={{ at: [0, 0.34, 0], az: [-0.6, -0.2], el: [0.22, 0.12], r: [0.9, 0.78], fov: 30 }}>{(tt) => {
  const ex = eio(tt, 0.5, 2.0) * (1 - eio(tt, 6.2, 7.4)), lit = (i: number) => cl((tt - 1.6 - i * 0.9) / 0.3) * (1 - cl((tt - 2.4 - i * 0.9) / 0.4));
  const lv = [0.24, 0.12, 0.0, -0.1, -0.24];
  return <group position={[0, 0.34, 0]} scale={1.5}>
    <pointLight position={[0.15, 0.2, 0.35]} intensity={1.6} distance={1.2} color="#fff4e6" />
    <pointLight position={[-0.3, 0.0, 0.2]} intensity={0.8} distance={1.0} color="#cfe6ff" />
    <Flaps p={[0, 0.14 + lv[0] * ex, 0]} />
    <mesh position={[0, 0.14 + lv[0] * ex - 0.003, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.04, 0.07, 48]} />{M.glow({ col: AMB, op: lit(0) })}</mesh>
    <mesh position={[0, 0.035 + lv[1] * ex, 0]} castShadow><cylinderGeometry args={[0.085, 0.085, 0.11, 64, 1, true]} /><meshStandardMaterial color="#3a3e43" roughness={0.45} side={THREE.DoubleSide} emissive="#ffb64a" emissiveIntensity={0.35 * lit(1)} /></mesh>
    <group position={[0, lv[2] * ex, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.074, 0.006, 10, 64]} /><meshStandardMaterial color="#8d9196" metalness={0.8} roughness={0.35} emissive="#ffb64a" emissiveIntensity={0.7 * lit(3)} /></mesh>
      {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[Math.cos(i * PI / 11) * 0.069, 0, Math.sin(i * PI / 11) * 0.069]} rotation={[0, -i * PI / 11, 0]}><boxGeometry args={[0.006, 0.014, 0.008]} /><meshStandardMaterial color="#8d9196" metalness={0.8} roughness={0.4} emissive="#ffb64a" emissiveIntensity={0.7 * lit(3)} /></mesh>)}
    </group>
    <group position={[0, -0.012 + lv[3] * ex, 0]} rotation={[0, tt * 1.2, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.066, 0.066, 0.006, 64]} /><meshStandardMaterial color="#a6abb0" metalness={0.85} roughness={0.3} emissive="#ffb64a" emissiveIntensity={0.5 * lit(2)} /></mesh>
      {[0, PI].map((a, i) => <mesh key={i} position={[Math.cos(a) * 0.044, 0.008, Math.sin(a) * 0.044]}><boxGeometry args={[0.022, 0.01, 0.01]} /><meshStandardMaterial color="#c3c8cd" metalness={0.9} roughness={0.25} emissive="#7dd6ff" emissiveIntensity={1.2 * lit(2)} /></mesh>)}
    </group>
    <group position={[0, -0.07 + lv[4] * ex, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.08, 0.075, 0.1, 64]} /><meshStandardMaterial color={BODY} roughness={0.5} /></mesh>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.0815, 0.0815, 0.022, 64, 1, true]} /><meshStandardMaterial color="#b8bec4" metalness={0.3} roughness={0.3} /></mesh>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.008, 0.008, 0.06, 16]} />{M.chrome()}</mesh>
    </group>
  </group>;
}}</Scene3D>;

// ---- 2:20 · APLASTAR Y RALLAR: desde arriba adentro de la cámara; el plato gira y revolea trozos de comida contra el anillo, que se rompen en migas y se van por la ranura ----
export const HSmashGrate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0c0d0f"
  cam={{ at: [0, 0.0, 0], az: [0.3, -0.4], el: [1.05, 0.9], r: [0.36, 0.3], fov: 34 }}>{(tt) => {
  const sp = eio(tt, 0.3, 1.2) * 14;
  return <>
    <Disposal p={[0, 0, 0]} cut={false} sink={false} spin={tt * sp * 0.6} outlet={false} />
    {Array.from({ length: 10 }, (_, i) => { const t0 = 0.6 + i * 0.45, k = cl((tt - t0) / 0.6), a = i * 2.3 + tt * 3, r = lerp(0.015, 0.066, k), br = k >= 1 ? cl((tt - t0 - 0.6) / 0.8) : 0;
      return <group key={i}>
        <mesh position={[Math.cos(a) * r, 0.01, Math.sin(a) * r]} scale={0.001 + (1 - br) * (tt > t0 ? 1 : 0)} castShadow><dodecahedronGeometry args={[0.009 + 0.004 * rn(i, 2)]} />{M.matte({ col: ["#e08a3a", "#8fb84a", "#d9c27a", "#c25a3a"][i % 4] })}</mesh>
        {Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[Math.cos(a + j * 0.25) * (0.068 + 0.01 * br), 0.006 - 0.04 * br * br, Math.sin(a + j * 0.25) * (0.068 + 0.01 * br)]} scale={0.001 + br * (1 - cl((tt - t0 - 1.6) / 0.5))}><sphereGeometry args={[0.0025, 6, 5]} />{M.matte({ col: ["#e08a3a", "#8fb84a", "#d9c27a", "#c25a3a"][i % 4] })}</mesh>)}
      </group>; })}
    <pointLight position={[0, 0.12, 0.05]} intensity={0.5} distance={0.4} color="#fff0d0" />
  </>;
}}</Scene3D>;

// ---- 2:39 · EL ANILLO DE BODAS: un anillo de oro cae entre las aletas, rebota en el plato quieto y queda brillando; no hay nada que corte ----
export const HRingPlate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0d0e10"
  cam={{ at: [0, 0.0, 0], az: [-0.2, 0.25], el: [0.55, 0.42], r: [0.42, 0.34], fov: 32 }}>{(tt) => {
  const f = cl((tt - 0.5) / 1.1), y = f < 1 ? lerp(0.2, 0.0, f * f) : 0.0 + 0.02 * Math.max(0, Math.sin((tt - 1.6) * 9)) * Math.exp(-(tt - 1.6) * 3), gl = cl((tt - 2.2) / 0.5);
  return <>
    <Disposal p={[0, 0, 0]} cut sink={false} outlet={false} open={f < 1 && f > 0.2 ? 0.6 : 0} />
    <mesh position={[0.012, y, 0.01]} rotation={[PI / 2 - 0.15 * (1 - f), tt * (1 - gl) * 4, 0]} castShadow><torusGeometry args={[0.014, 0.0028, 16, 48]} /><meshStandardMaterial color="#e6b54a" metalness={1} roughness={0.12} emissive="#ffcf6a" emissiveIntensity={0.5 * gl} /></mesh>
    <pointLight position={[0.012, 0.05, 0.06]} intensity={0.5 * gl} distance={0.25} color="#ffd27a" />
  </>;
}}</Scene3D>;

// ---- 3:27 · LO QUE TE DICE: tres trituradores en fila; el 1º zumba con anillos y su carozo se enciende, el 2º está mudo y le brilla el botón rojo, el 3º traquetea con una moneda adentro ----
export const HSymptoms3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark"
  cam={{ at: [0, 0.25, 0], az: [-0.2, 0.2], el: [0.14, 0.08], r: [1.0, 0.9], fov: 30 }}>{(tt) => {
  const a = (i: number) => cl((tt - 0.6 - i * 1.9) / 0.3) * (1 - cl((tt - 2.4 - i * 1.9) / 0.3) * 0.6);
  const coinY = 0.012 + 0.03 * Math.abs(Math.sin(tt * 11)) * a(2);
  return <>
    <Disposal p={[-0.4, 0.25, 0]} cut sink={false} outlet={false} jam={a(0)} shake={0.002 * a(0)} spin={tt} />
    {Array.from({ length: 3 }, (_, i) => { const k = ((tt * 0.9 + i / 3) % 1); return <mesh key={i} position={[-0.4, 0.26, 0]} rotation={[PI / 2, 0, 0]} scale={0.6 + 1.5 * k}><torusGeometry args={[0.1, 0.0025, 8, 64]} /><meshBasicMaterial color="#ffb64a" transparent opacity={a(0) * 0.6 * (1 - k)} toneMapped={false} depthWrite={false} /></mesh>; })}
    <Disposal p={[0, 0.25, 0]} cut sink={false} outlet={false} btn={a(1)} btnOut={a(1)} />
    <Disposal p={[0.4, 0.25, 0]} cut sink={false} outlet={false} shake={0.003 * a(2)} spin={tt * 8 * a(2)} />
    <mesh position={[0.4 + 0.03 * Math.sin(tt * 7), 0.25 + coinY, 0.02]} rotation={[PI / 2 + 0.6 * Math.sin(tt * 13), 0, 0]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.002, 32]} />{M.brass({ col: "#cfd3d6" })}</mesh>
    <pointLight position={[0, 0.1, 0.3]} intensity={0.5 * a(1)} distance={0.5} color="#ff4a3a" />
  </>;
}}</Scene3D>;

// ---- 3:44 · LA TRABA: de cerca adentro de la cámara; el carozo calzado entre el impulsor y el anillo; el plato empuja, tiembla y no pasa ----
export const HJamWedge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0c0d0f"
  cam={{ at: [0.04, 0.0, 0.0], az: [0.15, -0.1], el: [0.38, 0.3], r: [0.24, 0.19], fov: 34 }}>{(tt) => {
  const push = eio(tt, 0.8, 1.4), j = Math.sin(tt * 55) * 0.025 * push;
  return <>
    <Disposal p={[0, 0, 0]} cut sink={false} outlet={false} spin={0.15 * push + j} jam={1} />
    <pointLight position={[0.06, 0.06, 0.05]} intensity={0.25 + 0.25 * push * Math.abs(Math.sin(tt * 6))} distance={0.25} color="#ff6a3a" />
    <pointLight position={[-0.05, 0.1, 0.1]} intensity={0.4} distance={0.4} color="#dfeaff" />
  </>;
}}</Scene3D>;

// ---- 4:15 · EN ESTE ORDEN: la llave de la pared baja, el enchufe sale del tomacorriente con su cable, y la llave vuelve a subir para probar: el triturador ni se mueve ----
export const HKillOrder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood"
  cam={{ at: [0, 0.3, 0], az: [-0.3, 0.3], el: [0.14, 0.1], r: [1.15, 1.0], fov: 30 }}>{(tt) => {
  const off = eio(tt, 0.5, 0.8), out = eio(tt, 2.0, 2.8), test = eio(tt, 4.0, 4.3) - eio(tt, 5.4, 5.7), ok = cl((tt - 4.6) / 0.3);
  return <>
    <Switch p={[-0.4, 0.45, -0.1]} up={1 - off + test} s={1.6} />
    <PlugOutlet p={[0.0, 0.22, -0.1]} out={out} s={1.4} />
    <Disposal p={[0.36, 0.32, 0]} s={0.9} />
    {[[-0.4, off], [0.0, out], [0.36, ok]].map(([x, k], i) => <mesh key={i} position={[x, 0.08, 0.06]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.018, 32]} /><meshBasicMaterial color="#6fe39a" transparent opacity={0.15 + 0.85 * k} toneMapped={false} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 5:24 · LA PROMESA: una balanza de bronce; en un platillo la llave de la pared, en el otro el enchufe agarrado en la mano; gana la mano ----
export const HPromise: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark" warm={0.85}
  over={(tt) => <Tag tt={tt} at={3.6} x={1420} y={300} txt="A PLUG IN YOUR HAND" col={ICE} size={32} />}
  cam={{ at: [0, 0.32, 0], az: [0.3, -0.2], el: [0.16, 0.12], r: [1.1, 0.95], fov: 30 }}>{(tt) => {
  const a1 = phys(tt, 0.5, 6, 0.45), a2 = phys(tt, 1.6, 6, 0.45), tilt = 0.28 * eio(tt, 2.4, 3.6) + 0.02 * Math.sin(tt * 2);
  return <group position={[0, 0, 0]}>
    <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.008, 0.012, 0.4, 16]} />{M.brass()}</mesh>
    <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.08, 0.1, 0.02, 40]} />{M.brass()}</mesh>
    <group position={[0, 0.4, 0]} rotation={[0, 0, -tilt]}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.006, 0.006, 0.6, 12]} />{M.brass()}</mesh>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.3, 0, 0]} rotation={[0, 0, tilt]}>
        {[0, 2, 4].map((k) => <mesh key={k} position={[Math.cos(k) * 0.04, -0.07, Math.sin(k) * 0.04]} rotation={[Math.sin(k) * 0.5, 0, -Math.cos(k) * 0.5]}><cylinderGeometry args={[0.001, 0.001, 0.15, 4]} />{M.brass()}</mesh>)}
        <mesh position={[0, -0.14, 0]} castShadow><cylinderGeometry args={[0.1, 0.085, 0.012, 40]} />{M.brass()}</mesh>
        {sd < 0 ? <group position={[0, -0.13 + 0.25 * (1 - a1), 0]} scale={0.001 + a1}><Switch p={[0, 0.06, 0]} up={1} s={1.0} /></group>
          : <group position={[0, -0.13 + 0.25 * (1 - a2), 0]} scale={0.001 + a2}><Hand p={[0, 0.0, 0]} rot={[0, 0, 0.2]} curl={0.7} s={0.9} /><RBox s={[0.028, 0.034, 0.03]} r={0.006} p={[0.01, 0.11, 0.02]}>{M.plastic({ col: "#2a2c2e" })}</RBox></group>}
      </group>)}
    </group>
  </group>;
}}</Scene3D>;

// ---- 5:41 · EL AGUJERO DE SEIS LADOS: la cámara pasa por debajo del triturador; la carcasa se vuelve de vidrio y el eje sube del hexágono encendido hasta el plato ----
export const HHexHole: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" bg="#121010"
  cam={{ at: [0, 0.26, 0], at1: [0, 0.3, 0], az: [0.4, -0.3], el: [-0.75, -0.35], r: [0.5, 0.62], fov: 32 }}>{(tt) => {
  const hx = cl((tt - 0.8) / 0.4) * (0.75 + 0.25 * Math.sin(tt * 5)), gl = eio(tt, 2.4, 3.6);
  return <>
    <Disposal p={[0, 0.3, 0]} hex={hx} glass={gl} spin={eio(tt, 4.0, 6.0) * 2} />
    <mesh position={[0, 0.235, 0]}><cylinderGeometry args={[0.0085, 0.0085, 0.11, 16]} /><meshBasicMaterial color="#ffb64a" transparent opacity={0.7 * gl} toneMapped={false} depthWrite={false} /></mesh>
    <pointLight position={[0, 0.12, 0.1]} intensity={0.6 * hx} distance={0.4} color="#ffcf8a" />
  </>;
}}</Scene3D>;
void _noblades; void curve; void tex;
