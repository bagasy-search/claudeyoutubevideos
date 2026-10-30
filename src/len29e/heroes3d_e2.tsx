// len29e · componentes únicos en 3D real — 12-21 (6:26 → 11:29): destrabar, sacar el triturador, limpiar el anillo, aletas y pelo.
import React from "react";
import * as THREE from "three";
import { AMB, H, ICE, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tubeG } from "./h3d";
import { Allen, Disposal, Flaps, Hand, PI } from "./heroes3d_e1";

// ---- 6:26 · IDA Y VUELTA: desde abajo, la llave Allen calza en el hexágono y va y viene; arriba, en corte, el plato se balancea y el carozo se suelta y cae ----
export const HBackForth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" bg="#121010"
  cam={{ at: [0, 0.22, 0], az: [-0.5, -0.15], el: [-0.32, -0.2], r: [0.42, 0.36], fov: 32 }}>{(tt) => {
  const ins = eio(tt, 0.3, 1.1), sw = ins * Math.sin(Math.max(0, tt - 1.2) * 4.2) * 0.9 * (1 - cl((tt - 5.2) / 0.6)), free = cl((tt - 3.6) / 0.4);
  return <>
    <Disposal p={[0, 0.32, 0]} cut sink={false} spin={sw * 0.6 + free * tt * 2} jam={1 - free} hex={0.5 * ins} />
    <mesh position={[0.06 + 0.01 * free, 0.324 - 0.14 * free * free, 0.012]} scale={0.6 * free} castShadow><sphereGeometry args={[0.012, 16, 12]} /><meshStandardMaterial color="#8a5a3a" roughness={0.9} /></mesh>
    <Allen p={[0, lerp(0.04, 0.176, ins), 0]} rot={[PI, sw, 0]} s={2.2} glow={0.4 * ins} />
    <Hand p={[0.13 * Math.cos(sw), 0.13, -0.13 * Math.sin(sw)]} rot={[PI / 2, sw, 0]} curl={0.8} s={0.75} />
  </>;
}}</Scene3D>;

// ---- 7:24 · BAJARLO: el triturador gira un cuarto de vuelta en su anillo de montaje, se suelta y baja despacio a un balde ----
export const HHaul: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.9}
  cam={{ at: [0, 0.32, 0], az: [-0.35, 0.15], el: [0.12, 0.2], r: [1.15, 1.0], fov: 30 }}>{(tt) => {
  const tw = eio(tt, 0.5, 1.8), dn = eio(tt, 2.4, 4.6);
  return <>
    <mesh position={[0, 0.66, 0]}><cylinderGeometry args={[0.6, 0.6, 0.02, 4, 1]} />{M.wood()}</mesh>
    <mesh position={[0, 0.645, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.078, 0.006, 10, 48]} />{M.steel()}</mesh>
    {[0, 1, 2].map((i) => <mesh key={i} position={[Math.cos(i * 2.09 + tw * PI / 2) * 0.09, 0.64, Math.sin(i * 2.09 + tw * PI / 2) * 0.09]}><boxGeometry args={[0.02, 0.012, 0.012]} /><meshStandardMaterial color="#b8bec4" metalness={0.9} roughness={0.3} emissive="#ffb64a" emissiveIntensity={0.5 * (tw > 0.05 && tw < 0.95 ? 1 : 0)} /></mesh>)}
    <group position={[0, lerp(0.51, 0.22, dn), 0]} rotation={[0, tw * PI / 2, 0]}><Disposal sink={false} outlet={false} /></group>
    {/* el balde */}
    <mesh position={[0, 0.09, 0]} castShadow receiveShadow><cylinderGeometry args={[0.15, 0.12, 0.18, 40, 1, true]} /><meshStandardMaterial color="#e2a12a" roughness={0.6} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.12, 0.12, 0.004, 40]} /><meshStandardMaterial color="#c48a1e" roughness={0.6} /></mesh>
    {[-1, 1].map((sd) => <Hand key={sd} p={[sd * 0.13, lerp(0.5, 0.22, dn), 0.02]} rot={[0, 0, sd * 1.4]} curl={0.6} s={0.85} />)}
  </>;
}}</Scene3D>;

// ---- 7:41 · LAS ALETAS POR ARRIBA: la tapa de goma sale tirando hacia arriba y se da vuelta en el aire mostrando la cara sucia ----
export const HBaffle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile"
  cam={{ at: [0, 0.27, 0], az: [0.3, -0.15], el: [0.3, 0.2], r: [0.8, 0.7], fov: 32 }}>{(tt) => {
  const up = eio(tt, 0.6, 2.0), flip = eio(tt, 2.2, 3.6), dirty = cl((tt - 3.0) / 0.6);
  return <>
    <mesh position={[0, 0.137, 0]}><cylinderGeometry args={[0.32, 0.32, 0.006, 64]} /><meshStandardMaterial color="#c9ced3" metalness={0.85} roughness={0.25} /></mesh>
    <mesh position={[0, 0.137, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.05, 48]} /><meshBasicMaterial color="#050505" /></mesh>
    <group position={[0, 0.142 + 0.18 * up, 0]} rotation={[PI * flip, 0, 0.2 * up]}>
      <Flaps open={0.3 * up} film={dirty} />
      <mesh position={[0, -0.012, 0]}><cylinderGeometry args={[0.048, 0.048, 0.02, 40, 1, true]} /><meshStandardMaterial color="#141414" roughness={0.7} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.cos(i * 0.52) * 0.03, -0.004, Math.sin(i * 0.52) * 0.03]} scale={dirty}><sphereGeometry args={[0.004 + 0.003 * rn(i, 2), 8, 6]} /><meshStandardMaterial color="#6e6a4c" roughness={1} /></mesh>)}
    </group>
    <Hand p={[0.02, 0.28 + 0.18 * up, 0]} rot={[PI, 0, 0.1]} curl={0.8 * eio(tt, 0.3, 0.6)} s={0.9} />
  </>;
}}</Scene3D>;

// ---- 8:15 · HIELO Y SAL: cubos de hielo y granos de sal caen en la cámara; el plato gira y los tira contra el anillo, que va quedando brillante ----
export const HIceSalt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0c0e12"
  cam={{ at: [0, 0.0, 0], az: [-0.4, 0.3], el: [0.6, 0.45], r: [0.4, 0.32], fov: 32 }}>{(tt) => {
  const sp = eio(tt, 2.0, 2.8), clean = eio(tt, 2.8, 6.0);
  return <>
    <Disposal p={[0, 0, 0]} cut sink={false} outlet={false} spin={sp * (tt - 2) * 12} crust={1 - clean} ringShine={clean} />
    {Array.from({ length: 9 }, (_, i) => { const t0 = 0.3 + i * 0.15, f = cl((tt - t0) / 0.55), a = i * 1.9 + sp * tt * 10, r = sp > 0 ? lerp(0.03, 0.06, sp) : 0.02 + 0.03 * rn(i, 2), melt = cl((tt - 3.0 - i * 0.2) / 2.5);
      return <mesh key={i} position={[Math.cos(a) * r, lerp(0.22, 0.012, f * f), Math.sin(a) * r]} rotation={[i, tt * 3 * sp, i * 2]} scale={(0.001 + (tt > t0 ? 1 : 0)) * (1 - melt)} castShadow><boxGeometry args={[0.016, 0.016, 0.016]} />{M.glass({ col: "#dff3ff" })}</mesh>; })}
    {Array.from({ length: 40 }, (_, i) => { const t0 = 1.0 + rn(i, 1) * 0.8, f = cl((tt - t0) / 0.5), a = i * 0.7 + sp * tt * 10, r = 0.01 + 0.055 * rn(i, 3);
      return <mesh key={"s" + i} position={[Math.cos(a) * r, lerp(0.2, 0.006, f * f), Math.sin(a) * r]} scale={tt > t0 ? 1 - clean * 0.8 : 0.001}><boxGeometry args={[0.003, 0.003, 0.003]} /><meshStandardMaterial color="#ffffff" roughness={0.4} /></mesh>; })}
    <pointLight position={[0.05, 0.1, 0.08]} intensity={0.3 + 0.6 * clean} distance={0.35} color="#dff3ff" />
  </>;
}}</Scene3D>;

// ---- 8:47 · EL SARRO DEL ANILLO: de cerca, los dientes del anillo cubiertos de costra marrón; pasa el hielo y deja una franja de metal brillante que da la vuelta ----
export const HScrapeRing: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0c0d0f"
  cam={{ at: [0.06, 0.0, 0.03], az: [0.7, 0.2], el: [0.35, 0.25], r: [0.2, 0.16], fov: 34 }}>{(tt) => {
  const sw = eio(tt, 1.0, 5.0) * PI * 2;
  return <>
    {Array.from({ length: 22 }, (_, i) => { const a = i * PI / 11, done = ((a - 0.1 + PI * 2) % (PI * 2)) < sw;
      return <group key={i}>
        <mesh position={[Math.cos(a) * 0.069, 0, Math.sin(a) * 0.069]} rotation={[0, -a, 0]}><boxGeometry args={[0.006, 0.014, 0.008]} /><meshStandardMaterial color={done ? "#c9ced3" : "#7a6340"} metalness={done ? 1 : 0.3} roughness={done ? 0.15 : 0.9} /></mesh>
        {!done && Array.from({ length: 3 }, (_, j) => <mesh key={j} position={[Math.cos(a + j * 0.04) * 0.066, (j - 1) * 0.004, Math.sin(a + j * 0.04) * 0.066]}><sphereGeometry args={[0.0035, 8, 6]} /><meshStandardMaterial color="#6e5734" roughness={1} /></mesh>)}
      </group>; })}
    <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.074, 0.006, 10, 64]} /><meshStandardMaterial color="#9a8a68" metalness={0.6} roughness={0.5} /></mesh>
    <mesh position={[Math.cos(sw + 0.1) * 0.058, 0.004, Math.sin(sw + 0.1) * 0.058]} rotation={[tt, tt * 2, 0]} scale={tt > 0.9 && tt < 5.2 ? 1 : 0.001} castShadow><boxGeometry args={[0.016, 0.016, 0.016]} />{M.glass({ col: "#dff3ff" })}</mesh>
    <pointLight position={[0.08, 0.05, 0.06]} intensity={0.6} distance={0.3} color="#fff4e0" />
  </>;
}}</Scene3D>;

// ---- 9:33 · FRÍA, NO CALIENTE: dos canillas lado a lado; de la caliente la grasa baja derretida y vuelve a cuajarse en el caño; de la fría sale en bolitas duras que el plato tritura ----
export const HColdHot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="tile"
  cam={{ at: [0, 0.3, 0], az: [-0.12, 0.12], el: [0.1, 0.08], r: [0.85, 0.75], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={1.0} x={640} y={180} txt="HOT" col="#ff7a4a" size={40} /><Tag tt={tt} at={1.4} x={1280} y={180} txt="COLD" col={ICE} size={40} /></>}>{(tt) => {
  const run = eio(tt, 0.4, 1.0), set = cl((tt - 2.4) / 2.0);
  return <>
    {[-1, 1].map((sd) => { const hot = sd < 0;
      return <group key={sd} position={[sd * 0.28, 0, 0]}>
        <mesh geometry={tubeG("e_fau" + sd, [[0, 0.62, -0.05], [0, 0.66, 0], [0, 0.64, 0.05], [0, 0.58, 0.06]], 0.012, 30, 14)}>{M.chrome()}</mesh>
        <mesh position={[0, 0.42, 0.06]} scale={[1, run, 1]}><cylinderGeometry args={[0.006, 0.008, 0.32, 12]} />{M.water({ col: hot ? "#ffd2b0" : "#cfe9ff" })}</mesh>
        <Disposal p={[0, 0.16, 0.06]} s={0.9} cut sink={false} outlet={false} spin={tt * 6} />
        {hot ? <mesh geometry={tubeG("e_hotout", [[0.08, 0.155, 0.06], [0.14, 0.155, 0.06], [0.17, 0.12, 0.06], [0.17, 0.02, 0.06]], 0.02, 30, 16)}><meshStandardMaterial color="#f2efe6" roughness={0.4} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} /></mesh> : null}
        {hot && Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0.17, 0.11 - i * 0.012, 0.06]} scale={set}><sphereGeometry args={[0.012 + 0.002 * rn(i, 1), 10, 8]} />{M.grease()}</mesh>)}
        {!hot && Array.from({ length: 8 }, (_, i) => { const k = ((tt * 0.8 + i / 8) % 1); return <mesh key={i} position={[0.03 * Math.cos(i), lerp(0.3, 0.17, k), 0.06 + 0.03 * Math.sin(i)]} scale={(1 - k) * run}><sphereGeometry args={[0.005, 8, 6]} />{M.grease({ col: "#f1e6b8" })}</mesh>; })}
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 9:53 · LA CAPA DE ABAJO: las aletas vistas de costado en corte; la cara de abajo tiene una película gris viscosa que gotea ----
export const HFilmFlap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0d0e10"
  cam={{ at: [0, 0.13, 0], az: [0.25, -0.2], el: [-0.12, -0.05], r: [0.24, 0.2], fov: 32 }}>{(tt) => {
  const f = eio(tt, 0.5, 2.0);
  return <>
    <Disposal p={[0, 0, 0]} cut sink={false} outlet={false} film={f} open={0.12} />
    {Array.from({ length: 7 }, (_, i) => { const k = ((tt * 0.35 + i / 7) % 1); return <mesh key={i} position={[Math.cos(i * 0.9) * 0.03, 0.135 - 0.05 * k * k, 0.01 + Math.sin(i * 0.9) * 0.02]} scale={[1, 1 + 1.6 * k, 1].map((v) => v * f * (1 - k * 0.6)) as [number, number, number]}><sphereGeometry args={[0.003, 8, 6]} /><meshStandardMaterial color="#77756a" roughness={0.3} /></mesh>; })}
    <pointLight position={[0.05, 0.1, 0.12]} intensity={0.22} distance={0.3} color="#e8f0ff" />
  </>;
}}</Scene3D>;

// ---- 10:12 · EL CEPILLO DE DIENTES: un cepillo viejo entra por debajo de las aletas, las levanta de a una y cada una sale limpia ----
export const HToothScrub: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0d0e10"
  cam={{ at: [0, 0.14, 0], az: [-0.3, 0.3], el: [0.5, 0.4], r: [0.36, 0.3], fov: 32 }}>{(tt) => {
  const cur = cl((tt - 0.6) / 4.8) * 8, push = Array.from({ length: 8 }, (_, i) => Math.max(0, 1 - Math.abs(cur - i - 0.5) * 1.6) * 0.5);
  const a = Math.floor(Math.min(cur, 7.99)) * PI / 4 + PI / 8, filmLeft = (i: number) => (cur > i + 1 ? 0 : 1);
  return <>
    <mesh position={[0, 0.137, 0]}><cylinderGeometry args={[0.2, 0.2, 0.006, 64]} /><meshStandardMaterial color="#c9ced3" metalness={0.85} roughness={0.25} /></mesh>
    {Array.from({ length: 8 }, (_, i) => <group key={i} rotation={[0, i * PI / 4 + PI / 8, 0]}><group position={[0.045, 0.142, 0]} rotation={[0, 0, -push[i] * 1.15]}>
      <mesh position={[-0.0225, 0, 0]}><boxGeometry args={[0.044, 0.003, 0.032]} /><meshStandardMaterial color="#141414" roughness={0.7} /></mesh>
      <mesh position={[-0.0225, -0.0022, 0]}><boxGeometry args={[0.043, 0.0012, 0.031]} /><meshStandardMaterial color="#77756a" roughness={1} transparent opacity={filmLeft(i)} /></mesh>
    </group></group>)}
    <group position={[Math.cos(-a) * 0.03, 0.115, Math.sin(-a) * 0.03]} rotation={[0, -a, 0.5]}>
      <RBox s={[0.16, 0.012, 0.016]} r={0.005} p={[0.07, 0, 0]}>{M.plastic({ col: "#3a8ad6" })}</RBox>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.008 + (i % 6) * 0.004, 0.012, (Math.floor(i / 6) - 0.5) * 0.006 + 0.0012 * Math.sin(tt * 30)]}><cylinderGeometry args={[0.0012, 0.0012, 0.012, 5]} /><meshStandardMaterial color="#f4f4f4" roughness={0.6} /></mesh>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 11:29 · EL PELO EN EL EJE: el plato se levanta en el aire; debajo, el pelo enroscado en el eje se desarma vuelta por vuelta y se va ----
export const HHairSpool: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0c0d0f"
  cam={{ at: [0, -0.02, 0], az: [0.4, -0.2], el: [0.15, 0.25], r: [0.32, 0.26], fov: 32 }}>{(tt) => {
  const lift = eio(tt, 0.5, 1.6), w = 1 - eio(tt, 2.4, 5.6);
  return <>
    <Disposal p={[0, 0, 0]} cut sink={false} outlet={false} hairW={w} spin={-tt * 1.5 * lift} />
    <mesh position={[0, -0.012 + 0.09 * lift, 0]} rotation={[0.3 * lift, 0, 0]} scale={lift > 0.02 ? 1 : 0.001}><cylinderGeometry args={[0.066, 0.066, 0.006, 64]} /><meshStandardMaterial color="#a6abb0" metalness={0.85} roughness={0.3} emissive="#7dd6ff" emissiveIntensity={0.15 * lift} /></mesh>
    {Array.from({ length: 6 }, (_, i) => { const k = cl((tt - 2.6 - i * 0.45) / 1.4); return <mesh key={i} position={[0.02 + 0.12 * k, -0.025 - i * 0.003 + 0.04 * k, 0.03 * k]} rotation={[k * 2, i, k]} scale={k > 0 && k < 1 ? 1 : 0.001}><torusGeometry args={[0.012, 0.0006, 4, 24, PI * (1 + k)]} />{M.hair()}</mesh>; })}
    <pointLight position={[0.05, 0.02, 0.08]} intensity={0.5} distance={0.3} color="#fff0d0" />
  </>;
}}</Scene3D>;

// ---- 12:20 · EL ARROZ QUE SE HINCHA: granos de arroz caen en un caño transparente; con el agua se hinchan y lo llenan hasta taparlo ----
export const HRiceSwell: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="tile"
  cam={{ at: [0, 0.22, 0], az: [-0.3, 0.2], el: [0.12, 0.08], r: [0.75, 0.65], fov: 30 }}>{(tt) => {
  const sw = eio(tt, 1.8, 5.2), wet = eio(tt, 1.2, 2.0);
  return <>
    <mesh geometry={tubeG("e_rice", [[-0.32, 0.22, 0], [-0.1, 0.22, 0], [0.1, 0.2, 0], [0.32, 0.18, 0]], 0.04, 40, 24)}><meshStandardMaterial color="#e8eef2" roughness={0.1} transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[0, 0.215, 0]} rotation={[0, 0, PI / 2 - 0.06]} scale={[1, 1, 1]}><cylinderGeometry args={[0.035 * wet, 0.035 * wet, 0.6, 24, 1, true]} />{M.water({ col: "#dbe9f2" })}</mesh>
    {Array.from({ length: 70 }, (_, i) => { const t0 = 0.2 + rn(i, 1) * 1.0, f = cl((tt - t0) / 0.6), x = -0.28 + rn(i, 2) * 0.56, s = 1 + 1.6 * sw;
      return <mesh key={i} position={[x, lerp(0.42, 0.2 + (rn(i, 3) - 0.5) * 0.05 * sw - 0.02 * (1 - sw), f * f), (rn(i, 4) - 0.5) * 0.05 * (0.4 + 0.6 * sw)]} rotation={[rn(i, 5) * 6, rn(i, 6) * 6, 0]} scale={tt > t0 ? [s, s * 0.6 + 0.4, s] as [number, number, number] : 0.001}><capsuleGeometry args={[0.003, 0.009, 4, 8]} /><meshStandardMaterial color="#f4f1e6" roughness={0.6} /></mesh>; })}
    <mesh position={[0.34, 0.18, 0]} rotation={[0, 0, PI / 2]}><ringGeometry args={[0.03, 0.05, 32]} /><meshBasicMaterial color="#ff5a4a" transparent opacity={cl((tt - 4.2) / 0.4)} toneMapped={false} /></mesh>
  </>;
}}</Scene3D>;
void AMB; void phys;
