// tdp29d · componentes 21-31: once botones, la economía silenciosa, un día del evaporado, la foto de la vincha, tres preguntas, el piso del pueblo, sin piso, la carta, la última línea, la tumba, el mensaje.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, rn } from "./h3d";
import { HANDF, PI, Sheet, fallY, pop, txt } from "./lkit3d";
import { Clock24, Fig, House, Letter } from "./tkit3d";
import { Box, Truck } from "./heroes_d1";

const Photo: React.FC<{ p?: number[]; r?: number[]; s?: number; age?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, age = 0 }) => <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
  <RBox s={[0.1, 0.07, 0.002]} r={0.002}>{M.matte({ col: new THREE.Color("#f6f1e4").lerp(new THREE.Color("#d8c49a"), age).getStyle() })}</RBox>
  <mesh position={[0, 0.004, 0.0012]}><planeGeometry args={[0.088, 0.05]} /><meshStandardMaterial color={new THREE.Color("#7aa86a").lerp(new THREE.Color("#a8a070"), age)} /></mesh>
  <mesh position={[-0.03, 0.008, 0.0013]}><planeGeometry args={[0.02, 0.004]} /><meshBasicMaterial color="#ffffff" /></mesh>
  <group position={[0.0, -0.012, 0.0015]} scale={0.32}><Fig s={1} cloth="#f6f6f2" arm={1.2} arm2={-0.8} /></group>
  <mesh position={[0.0, 0.035 * 0.32 + 0.004, 0.003]}><torusGeometry args={[0.0055, 0.0012, 6, 16]} /><meshBasicMaterial color="#ffffff" /></mesh>
</group>;

// ---- 13:35 · ONCE BOTONES: un teléfono público verde; un dedo aprieta las teclas, una por una, once; el contador de años pasa a 9 mientras tanto; al final el tubo se levanta ----
export const HEleven: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0b0d12" lamp={[0, 0.5, 0.6]}
  cam={{ at: [0, 0.16, 0], at1: [0.0, 0.14, 0.02], az: [-0.25, 0.1], el: [0.1, 0.08], r: [0.62, 0.45], fov: 32 }}>{(tt) => {
  const n = Math.min(11, Math.floor(eio(tt, 0.6, 5.4) * 11.99)), key = [0, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8][Math.max(0, n - 1)], lift = eio(tt, 5.8, 6.6);
  const kx = (k: number) => -0.03 + ((k + 2) % 3) * 0.03, ky = (k: number) => 0.2 - Math.floor(((k + 9) % 10) / 3) * 0.025;
  return <>
    <RBox s={[0.16, 0.28, 0.08]} r={0.012} p={[0, 0.16, -0.04]}>{M.plastic({ col: "#2f7a4a" })}</RBox>
    {Array.from({ length: 12 }, (_, i) => <RBox key={i} s={[0.022, 0.018, 0.008]} r={0.003} p={[-0.03 + (i % 3) * 0.03, 0.2 - Math.floor(i / 3) * 0.025, 0.002]}>{M.pvc({ col: "#e8e6de" })}</RBox>)}
    <group position={[-0.07, 0.17 + 0.08 * lift, 0.01 + 0.04 * lift]} rotation={[0, 0, 0.2 * lift]}><mesh rotation={[0, 0, 0]}><capsuleGeometry args={[0.012, 0.14, 8, 14]} />{M.plastic({ col: "#2f7a4a" })}</mesh></group>
    <group position={[n > 0 ? kx(key) : 0.04, n > 0 ? ky(key) : 0.12, 0.02 + 0.01 * Math.abs(Math.sin(tt * PI * 2.4))]} rotation={[0.4, 0, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><capsuleGeometry args={[0.007, 0.05, 6, 12]} />{M.matte({ col: "#d8b89a" })}</mesh>
    </group>
    {Array.from({ length: n }, (_, i) => <mesh key={"d" + i} position={[-0.11 + i * 0.022, 0.37, 0.0]}><circleGeometry args={[0.007, 16]} />{M.glow({ col: "#ffd59a" })}</mesh>)}
    <Sheet map={txt("9y11", ["9 years · 11 buttons"], { w: 480, h: 100, bg: "#f2ead8", fg: "#2a2420", size: 52, font: HANDF })} w={0.17} h={0.035} p={[0.17, 0.06, 0.03]} r={[0, -0.2, 0.04]} s={pop(tt, 0.8)} />
  </>;
}}</Scene3D>;

// ---- 14:28 · LA ECONOMÍA SILENCIOSA: alrededor de una figura sola se arma, pieza por pieza, la red que lo sostiene: el camión, la pensión, la camioneta de las seis, el puesto de fideos, la mesa de sopa ----
export const HEconomy: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#c8c4b8" lamp={[0.2, 0.8, 0.5]}
  cam={{ at: [0, 0.06, 0], az: [-0.6, 0.6], el: [0.55, 0.45], r: [1.05, 0.95], fov: 32 }}>{(tt) => {
  const items = ["night movers", "cheap hotels", "cash jobs", "noodle shops", "soup on Saturdays"];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.6, 64]} /><meshStandardMaterial color="#e2dccc" /></mesh>
    <Fig p={[0, 0, 0]} s={1.3} cloth="#3a3a42" head={-0.3 + 0.3 * eio(tt, 4.5, 5.5)} />
    {items.map((l, i) => { const a = (i / items.length) * 2 * PI - PI / 2, r = 0.32, x = Math.cos(a) * r, z = Math.sin(a) * r, k = pop(tt, 0.4 + i * 0.8);
      return <group key={i} position={[x, 0, z]} scale={k}>
        {i === 0 && <Truck s={0.4} r={[0, -a, 0]} />}
        {i === 1 && <RBox s={[0.08, 0.1, 0.06]} r={0.004} p={[0, 0.05, 0]}>{M.matte({ col: "#a89a88", em: "#ffd59a", emI: 0.2 })}</RBox>}
        {i === 2 && <group><RBox s={[0.1, 0.05, 0.05]} r={0.01} p={[0, 0.04, 0]}>{M.pvc({ col: "#f2f2ee" })}</RBox><Fig p={[0.06, 0, 0.02]} s={0.7} cloth="#5a5a4a" /></group>}
        {i === 3 && <group><RBox s={[0.09, 0.07, 0.05]} r={0.004} p={[0, 0.035, 0]}>{M.wood({ base: [120, 86, 52] })}</RBox><mesh position={[0, 0.075, 0.026]}><planeGeometry args={[0.08, 0.012]} /><meshStandardMaterial color="#c0392b" /></mesh></group>}
        {i === 99 && <group><RBox s={[0.1, 0.008, 0.05]} r={0.003} p={[0, 0.05, 0]}>{M.plastic({ col: "#e6e3dc" })}</RBox><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.02, 0.018, 0.03, 18]} />{M.steel()}</mesh></group>}
        <Sheet map={txt("ec" + i, [l], { w: 400, h: 100, bg: "#f2ead8", fg: "#2a2420", size: 50, font: HANDF })} w={0.13} h={0.033} p={[0, 0.14, 0]} />
        <mesh position={[-x / 2, 0.003, -z / 2]} rotation={[-PI / 2, 0, -Math.atan2(z, x)]}><planeGeometry args={[r * 0.6 * eio(tt, 0.6 + i * 0.8, 1.2 + i * 0.8), 0.003]} />{M.glow({ col: "#c98a3a", op: 0.8 })}</mesh>
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 15:13 · UN DÍA DEL EVAPORADO: una mesa larga; una lámpara se desliza de estación en estación mientras el reloj de 24 h corre: futón 5:30, camioneta 6:00, hierros 7-17, sobre de 9.000 yenes, bento y cerveza, la tele baja, la foto ----
export const HDayJ: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#101216" lamp={[0, 0.6, 0.6]}
  cam={{ at: [-0.08, 0.1, 0], at1: [0.08, 0.1, 0], az: [-0.12, 0.05], el: [0.3, 0.26], r: [1.05, 0.98], fov: 32 }}>{(tt) => {
  const u = eio(tt, 0.3, 6.8), lx = lerp(-0.36, 0.36, u), HRS = [5.5, 6, 12, 17.5, 21], q = u * 4, qi = Math.min(3, Math.floor(q)), hr = lerp(HRS[qi], HRS[qi + 1], cl((q - qi - 0.35) / 0.3)), act = Math.round(q);
  const st: [number, string][] = [[-0.36, "5:30 · futon"], [-0.18, "6:00 · the van"], [0.0, "7 to 5 · steel"], [0.18, "¥9,000 cash"], [0.36, "the photo"]];
  return <>
    <RBox s={[1.2, 0.02, 0.24]} r={0.006} p={[0, -0.01, 0]}>{M.wood({ base: [110, 80, 54] })}</RBox>
    {st.map(([x, l], i) => { const on = cl(1 - Math.abs(lx - x) / 0.12);
      return <group key={i} position={[x, 0, 0]}>
        {i === 0 && <RBox s={[0.1, 0.01, 0.06]} r={0.004} p={[0, 0.005, 0]}>{M.matte({ col: "#d8d2c4" })}</RBox>}
        {i === 1 && <RBox s={[0.1, 0.05, 0.05]} r={0.01} p={[0, 0.025, 0]}>{M.pvc({ col: "#f2f2ee" })}</RBox>}
        {i === 2 && Array.from({ length: 5 }, (_, j) => <mesh key={j} position={[0, 0.005 + j * 0.006, (j - 2) * 0.008]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.003, 0.003, 0.11, 8]} />{M.steel({ col: "#7a4a3a" })}</mesh>)}
        {i === 3 && <RBox s={[0.07, 0.004, 0.04]} r={0.001} p={[0, 0.003, 0]}>{M.matte({ col: "#e6dcc4" })}</RBox>}
        {i === 99 && <group><RBox s={[0.07, 0.015, 0.05]} r={0.004} p={[-0.015, 0.008, 0]}>{M.plastic({ col: "#2a2a2a" })}</RBox><mesh position={[0.035, 0.02, 0]}><cylinderGeometry args={[0.009, 0.009, 0.04, 14]} />{M.steel({ col: "#c9a040" })}</mesh></group>}
        {i === 98 && <group><RBox s={[0.06, 0.045, 0.035]} r={0.004} p={[0, 0.022, 0]}>{M.matte({ col: "#1a1c22" })}</RBox><mesh position={[0, 0.024, 0.018]}><planeGeometry args={[0.05, 0.034]} /><meshBasicMaterial color={new THREE.Color("#2a5a2a").lerp(new THREE.Color("#7ab07a"), on)} toneMapped={false} /></mesh></group>}
        {i === 4 && <Photo p={[0, 0.005, 0]} r={[-PI / 2, 0, 0.1]} s={0.8} age={0.6} />}
      </group>; })}
    <pointLight position={[st[act][0], 0.12, 0.08]} intensity={0.8} distance={0.35} color="#ffe2b0" />
    <Clock24 p={[0.0, 0.2, -0.24]} s={0.75} h={hr} />
    {st.map(([, l], i) => i === act ? <Sheet key={"lb" + i} map={txt("dj" + i, [l], { w: 640, h: 140, bg: "#f2ead8", fg: "#2a2420", size: 84, font: HANDF })} w={0.3} h={0.066} p={[0, 0.07, 0.15]} r={[-0.35, 0, 0]} s={0.6 + 0.4 * pop(tt, 0.3 + (i - 0.5) * 1.62)} em={0.35} /> : null)}
    <pointLight position={[0, 0.3, 0.05]} intensity={0.5} distance={0.6} color="#ffffff" />
  </>;
}}</Scene3D>;

// ---- 15:56 · LA FOTO: la billetera gastada se abre en la mano; de adentro sale una foto vieja: una nena corriendo con la vincha blanca; la cámara se acerca a la vincha ----
export const HPhoto: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0e0c0a" lamp={[-0.2, 0.5, 0.5]} warm={0.9}
  cam={{ at: [0, 0.05, 0], at1: [-0.0, 0.1, 0.0], az: [-0.1, 0.0], el: [0.5, 0.2], r: [0.5, 0.22], fov: 32 }}>{(tt) => {
  const open = eio(tt, 0.6, 1.6), out = eio(tt, 1.8, 3.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.2, 1]} /><meshStandardMaterial color="#3a2c22" roughness={0.9} /></mesh>
    <group position={[0, 0.02, 0.02]}>
      <RBox s={[0.12, 0.006, 0.09]} r={0.006} p={[0.03, 0.003, 0]}>{M.matte({ col: "#4a3020" })}</RBox>
      <group position={[-0.03, 0.006, 0]} rotation={[0, 0, PI * (1 - open) * 0.95]}><RBox s={[0.12, 0.006, 0.09]} r={0.006} p={[-0.06, 0.003, 0]}>{M.matte({ col: "#5a3a26" })}</RBox></group>
    </group>
    <Photo p={[0.0, lerp(0.03, 0.1, out), lerp(0.02, 0.0, out)]} r={[lerp(-PI / 2, -0.3, out), 0, lerp(0, 0.08, out)]} s={1.0} age={0.75} />
    <pointLight position={[0.05, 0.25, 0.15]} intensity={0.6} distance={0.6} color="#ffe2b0" />
  </>;
}}</Scene3D>;

// ---- 16:20 · TRES PREGUNTAS: tres tarjetas caen sobre la mesa y se dan vuelta, cada una con su objeto: un detective (lupa), un formulario de la municipalidad, un camión que se niega (sobre devuelto) ----
export const HQuestions: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#16130f" lamp={[0, 0.7, 0.5]} warm={0.7}
  cam={{ at: [0, 0.03, 0], az: [-0.15, 0.1], el: [0.9, 0.75], r: [0.8, 0.7], fov: 32 }}>{(tt) => {
  const Q = ["Do they ever get found?", "How do they live without papers?", "Is it legal to help?"];
  return <>
    {Q.map((q, i) => { const x = -0.26 + i * 0.26, f = eio(tt, 0.6 + i * 1.6, 1.4 + i * 1.6);
      return <group key={i} position={[x, fallY(tt, 0.3 + i * 1.6, 0.12) + 0.004, 0]}>
        <group rotation={[0, 0, PI * f]} position={[0, 0.03 * Math.sin(PI * f), 0]}>
          <RBox s={[0.2, 0.004, 0.13]} r={0.004}>{M.matte({ col: "#f6f1e4" })}</RBox>
          <mesh position={[0, 0.0025, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.19, 0.12]} /><meshStandardMaterial map={txt("qq" + i, q.split(" ").reduce((a: string[], w) => { const l = a[a.length - 1]; if (l && (l + " " + w).length < 16) a[a.length - 1] = l + " " + w; else a.push(w); return a; }, []), { w: 480, h: 300, bg: "#f6f1e4", fg: "#22304e", size: 56, font: HANDF })} /></mesh>
          <mesh position={[0, -0.0025, 0]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[0.19, 0.12]} /><meshStandardMaterial color={["#d8e6d0", "#e6e0d0", "#e6d4d0"][i]} /></mesh>
        </group>
        <group position={[0, 0.006, 0]} scale={pop(tt, 1.3 + i * 1.6)}>
          {i === 0 && <group><mesh position={[0, 0.006, 0]} rotation={[-PI / 2, 0, 0]}><torusGeometry args={[0.025, 0.004, 10, 32]} />{M.steel({ col: "#2a2a2a" })}</mesh><mesh position={[0.035, 0.006, 0.035]} rotation={[-PI / 2, 0, -PI / 4]}><boxGeometry args={[0.035, 0.008, 0.008]} />{M.wood()}</mesh></group>}
          {i === 1 && <group><RBox s={[0.07, 0.002, 0.09]} r={0.001} p={[0, 0.002, 0]}>{M.matte({ col: "#fbfaf6" })}</RBox><mesh position={[0.02, 0.01, -0.02]}><cylinderGeometry args={[0.01, 0.01, 0.018, 16]} />{M.matte({ col: "#c0392b" })}</mesh></group>}
          {i === 2 && <Box p={[0, 0, 0]} s={0.9} />}
        </group>
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 17:36 · EL PISO DEL PUEBLO: un hombre cae desde arriba (la ciudad); abajo hay un pueblo de arrozales y casa grande que lo ataja como una red tejida; la madre sale a la puerta ----
export const HFloor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#c4d4dc" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0, 0.18, 0], at1: [0, 0.08, 0], az: [-0.3, 0.1], el: [0.25, 0.4], r: [1.2, 0.95], fov: 32 }}>{(tt) => {
  const fall = eio(tt, 0.8, 2.6), bounce = Math.sin(cl((tt - 2.6) / 0.8) * PI) * 0.03 * (tt > 2.6 ? 1 : 0), mom = eio(tt, 3.6, 4.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#7a9a5a" roughness={0.95} /></mesh>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} rotation={[-PI / 2, 0, 0]} position={[-0.5 + (i % 3) * 0.3, 0.001, -0.35 + Math.floor(i / 3) * 0.2]}><planeGeometry args={[0.27, 0.17]} /><meshStandardMaterial color="#8ab06a" roughness={0.4} metalness={0.1} /></mesh>)}
    <House p={[0.32, 0, -0.18]} s={0.8} lit={[0.6, 0.6, 0.6, 0.6]} col="#b8a88a" roof="#3a3e46" />
    <group position={[0, 0.12, 0.05]}>
      {Array.from({ length: 9 }, (_, i) => <mesh key={"a" + i} position={[-0.16 + i * 0.04, 0, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.0015, 0.0015, 0.32, 6]} />{M.wood({ base: [180, 150, 100] })}</mesh>)}
      {Array.from({ length: 9 }, (_, i) => <mesh key={"b" + i} position={[0, 0, -0.16 + i * 0.04]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0015, 0.0015, 0.32, 6]} />{M.wood({ base: [180, 150, 100] })}</mesh>)}
      {[[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]].map(([x, z], i) => <mesh key={"p" + i} position={[x, -0.06, z]}><cylinderGeometry args={[0.005, 0.005, 0.12, 8]} />{M.wood()}</mesh>)}
    </group>
    <group position={[0, lerp(0.8, 0.125, fall) - bounce, 0.05]} rotation={[fall < 1 ? 0.6 * Math.sin(tt * 4) : -PI / 2 + 0.2, 0, 0]}><Fig s={1.2} cloth="#2a2c34" arm={1.2 * (1 - fall)} /></group>
    <group position={[0.26, 0, -0.04]} scale={pop(tt, 3.6)}><Fig s={1.1} cloth="#8a6a5a" arm={0.9 * mom} /></group>
    <Sheet map={txt("flr", ["failure had a floor"], { w: 480, h: 100, bg: "#f2ead8", fg: "#2a2420", size: 52, font: HANDF })} w={0.17} h={0.035} p={[-0.15, 0.04, 0.22]} r={[-0.5, 0, 0]} s={pop(tt, 4.4)} />
  </>;
}}</Scene3D>;

// ---- 18:02 · SIN PISO: la misma red; las casas se vacían y se van; los hilos de la red se sueltan de a uno; el hombre cae más abajo, hasta un cuartito de 2.000 yenes que se enciende ----
export const HNoFloor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1a1e24" lamp={[0, 0.7, 0.5]}
  cam={{ at: [0, 0.02, 0.05], at1: [0, -0.1, 0.05], az: [-0.3, 0.05], el: [0.4, 0.35], r: [1.0, 0.85], fov: 32 }}>{(tt) => {
  const gone = eio(tt, 0.4, 2.2), open = eio(tt, 2.4, 3.2), fall = eio(tt, 3.0, 4.4), lit = 0.35 + 0.65 * eio(tt, 4.6, 5.2);
  return <>
    <House p={[0.36, -0.5 * gone, -0.2]} s={0.8 * (1 - gone) + 0.001} lit={[0, 0, 0, 0]} />
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.18, 0.12, 0.05]} rotation={[0, 0, sd * 1.35 * open]}>
      {Array.from({ length: 6 }, (_, i) => <RBox key={i} s={[0.03, 0.008, 0.34]} r={0.002} p={[-sd * (0.015 + i * 0.03), 0, 0]}>{M.wood({ base: [180, 150, 100] })}</RBox>)}
    </group>)}
    {[-1, 1].map((sd) => <RBox key={"m" + sd} s={[0.02, 0.012, 0.36]} r={0.002} p={[sd * 0.19, 0.12, 0.05]}>{M.wood({ base: [120, 90, 60] })}</RBox>)}
    <group position={[0, lerp(0.125, -0.27, fall), 0.05]}><Fig s={1.2} cloth="#2a2c34" arm={0.8 * fall} head={-0.2} /></group>
    <group position={[0, -0.3, 0.05]}>
      <RBox s={[0.36, 0.4, 0.36]} r={0.003} p={[0, 0.2, 0]}>{M.matte({ col: "#3a332a", side: THREE.BackSide })}</RBox>
      <RBox s={[0.14, 0.012, 0.07]} r={0.003} p={[0, 0.006, -0.08]}>{M.matte({ col: "#c9c2b4" })}</RBox>
      <mesh position={[0, 0.3, 0]}><sphereGeometry args={[0.01, 12, 8]} />{M.glow({ col: "#ffe2b0", op: lit })}</mesh>
      <pointLight position={[0, 0.28, 0.02]} intensity={0.8 * lit} distance={0.6} color="#ffe2b0" />
    </group>
  </>;
}}</Scene3D>;

// ---- 18:28 · LA CARTA: llega un sobre sin remitente con matasellos del otro lado del país; se abre y la carta escrita a mano se despliega sobre la mesa ----
export const HLetterJ: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#14110d" lamp={[-0.2, 0.6, 0.5]} warm={0.9}
  cam={{ at: [0, 0.02, 0], az: [-0.15, 0.05], el: [0.95, 1.05], r: [0.6, 0.42], fov: 32 }}>{(tt) => <>
  <group position={[0.16, 0.004 + fallY(tt, 0.3, 0.15), -0.06]} rotation={[0, 0.25, 0]} scale={pop(tt, 0.3)}>
    <RBox s={[0.14, 0.004, 0.09]} r={0.002}>{M.matte({ col: "#f2ead8" })}</RBox>
    <mesh position={[0.045, 0.0025, -0.025]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.018, 28]} /><meshBasicMaterial color="#5a6a8a" transparent opacity={0.55} /></mesh>
    <mesh position={[-0.02, 0.0025, 0.01]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.07, 0.02]} /><meshStandardMaterial map={txt("nora", ["no return address"], { w: 360, h: 90, bg: "#f2ead8", fg: "#5a5048", size: 40, font: HANDF })} /></mesh>
  </group>
  <Letter p={[-0.05, 0.003, 0.02]} r={[0, -0.05, 0]} s={1.15} u={eio(tt, 1.6, 4.4)} key0="ljp" lines={["I am not writing this to ask", "you for anything.", "I am not writing so you", "can find me.", "", "I left because I was ashamed.", "I told myself it was to protect", "you. That was a lie.", "", "I have thought about you", "every single day."]} />
  <mesh position={[-0.2, 0.012, 0.13]} rotation={[-PI / 2, 0, 0.3]}><torusGeometry args={[0.018, 0.002, 8, 24]} />{M.steel({ col: "#2a2a2a" })}</mesh>
  <mesh position={[-0.16, 0.012, 0.135]} rotation={[-PI / 2, 0, 0.3]}><torusGeometry args={[0.018, 0.002, 8, 24]} />{M.steel({ col: "#2a2a2a" })}</mesh>
</>}</Scene3D>;

// ---- 19:42 · LA ÚLTIMA LÍNEA: una pluma escribe sola, letra por letra, la última línea de la carta; la tinta brilla un instante y se seca ----
const LAST = "I'm sorry I made you wait for a letter instead of a father.";
export const HLastLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#0f0d0a" lamp={[-0.2, 0.5, 0.5]} warm={0.9}
  cam={{ at: [0, 0.01, 0], at1: [0.04, 0.01, 0], az: [-0.12, 0.05], el: [1.0, 0.95], r: [0.48, 0.42], fov: 32 }}>{(tt) => {
  const u = eio(tt, 0.4, 5.6), n = Math.floor(u * LAST.length), lines = [LAST.slice(0, Math.min(n, 30)), n > 30 ? LAST.slice(30, n) : ""];
  return <>
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.36, 0.2]} /><meshStandardMaterial map={txt("ll" + n, lines, { w: 900, h: 500, bg: "#fbf8f0", fg: "#22304e", size: 58, lh: 90, align: "left", pad: 60, font: HANDF, rule: true })} roughness={0.9} /></mesh>
    <group position={[-0.13 + (n % 30) * 0.0085, 0.03, n > 30 ? 0.02 : -0.02]} rotation={[0.5, 0.6, -0.3]}>
      <mesh><cylinderGeometry args={[0.004, 0.004, 0.11, 12]} />{M.matte({ col: "#1a1c22" })}</mesh>
      <mesh position={[0, -0.06, 0]}><coneGeometry args={[0.004, 0.012, 12]} />{M.brass()}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 20:12 · EL NOMBRE EN LA TUMBA: la lápida familiar con incienso; el cincel termina de grabar un nombre más, al lado de los padres; humo del incienso, flores frescas ----
export const HGrave: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#b9c2c6" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0, 0.14, 0], az: [-0.3, 0.1], el: [0.12, 0.1], r: [0.8, 0.62], fov: 32 }}>{(tt) => {
  const carve = eio(tt, 0.8, 4.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#9a9890" roughness={0.95} /></mesh>
    <RBox s={[0.3, 0.04, 0.2]} r={0.004} p={[0, 0.02, 0]}>{M.matte({ col: "#7a7c80" })}</RBox>
    <RBox s={[0.12, 0.3, 0.08]} r={0.006} p={[0, 0.19, -0.03]}>{M.porcelain({ col: "#5a5c62" })}</RBox>
    {[-0.022, 0.0, 0.022].map((x, i) => <mesh key={i} position={[x, 0.2, 0.0105]}><planeGeometry args={[0.016, 0.18 * (i < 2 ? 1 : carve)]} /><meshStandardMaterial color="#2a2c30" roughness={0.9} /></mesh>)}
    <mesh position={[0.022, 0.2 + 0.09 - 0.18 * carve, 0.03]} rotation={[0.6, 0, 0]} visible={carve < 0.99}><cylinderGeometry args={[0.003, 0.003, 0.05, 8]} />{M.steel()}</mesh>
    {[-0.1, 0.1].map((x, i) => <group key={i} position={[x, 0.04, 0.05]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.012, 0.01, 0.06, 16]} />{M.steel({ col: "#4a4c50" })}</mesh>
      {Array.from({ length: 5 }, (_, j) => <mesh key={j} position={[(j - 2) * 0.006, 0.07 + rn(j, i) * 0.02, 0]}><sphereGeometry args={[0.007, 10, 8]} /><meshStandardMaterial color={["#e8e0f0", "#f0d040", "#e86a8a", "#f6f6f2", "#a86ad0"][j]} /></mesh>)}
    </group>)}
    {Array.from({ length: 14 }, (_, i) => { const k = ((tt * 0.25 + i / 14) % 1); return <mesh key={i} position={[Math.sin(tt + i) * 0.015 * k, 0.06 + k * 0.3, 0.08]} scale={0.005 + 0.015 * k}><sphereGeometry args={[1, 8, 6]} />{M.glow({ col: "#e8ecf2", op: 0.2 * (1 - k) })}</mesh>; })}
    <mesh position={[0, 0.05, 0.08]}><cylinderGeometry args={[0.001, 0.001, 0.05, 6]} />{M.matte({ col: "#7a4a2a" })}</mesh>
  </>;
}}</Scene3D>;

// ---- 21:33 · ESTA NOCHE: un celular sobre la mesa; se escribe un mensaje corto («Hi. It's me.»), el pulgar duda, envía; el globito sale y una lucecita se prende lejos, en una ventana ----
export const HMessage: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#0a0b10" lamp={[0, 0.5, 0.6]}
  cam={{ at: [0, 0.01, 0.05], at1: [0.1, 0.05, -0.12], az: [-0.2, -0.05], el: [1.25, 0.62], r: [0.42, 0.82], fov: 32 }}>{(tt) => {
  const msg = "Hi. It's me.", n = Math.floor(eio(tt, 0.6, 2.6) * msg.length), sent = eio(tt, 3.2, 5.0), far = eio(tt, 4.9, 5.4);
  const c = new THREE.CatmullRomCurve3([[0.04, 0.03, 0.02], [0.12, 0.14, -0.12], [0.22, 0.16, -0.26], [0.245, 0.125, -0.348]].map((q) => new THREE.Vector3(q[0], q[1], q[2])));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#2a241e" roughness={0.9} /></mesh>
    <group position={[0, 0, 0.05]} scale={1.8}><RBox s={[0.08, 0.008, 0.16]} r={0.01} p={[0, 0.004, 0]}>{M.matte({ col: "#14161c" })}</RBox>
    <mesh position={[0, 0.0085, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.072, 0.148]} /><meshStandardMaterial map={txt("ms" + n + (sent > 0.02 ? "s" : ""), ["", "", sent > 0.02 ? "" : msg.slice(0, n) + (Math.floor(tt * 3) % 2 ? "|" : ""), "", sent > 0.02 ? "           " + msg : ""], { w: 300, h: 600, bg: "#eef2f6", fg: "#1a2a3a", size: 64, align: "left", pad: 20 })} emissive="#ffffff" emissiveIntensity={0.12} /></mesh></group>
    {Array.from({ length: 60 }, (_, i) => { const v = i / 60; if (v > sent) return null; const q = c.getPointAt(v); return <mesh key={i} position={[q.x, q.y, q.z]} scale={0.0035}><sphereGeometry args={[1, 6, 5]} />{M.glow({ col: "#9ac4ff", op: 0.85 })}</mesh>; })}
    {sent > 0 && sent < 1 && (() => { const q = c.getPointAt(sent); return <mesh position={[q.x, q.y, q.z]} scale={0.011}><sphereGeometry args={[1, 12, 8]} />{M.glow({ col: "#cfe2ff", op: 1 })}</mesh>; })()}
    <House p={[0.2, 0, -0.42]} s={0.5} lit={[0, far, 0, 0.15 * far]} col="#6a6a72" roof="#2a2c30" />
    <pointLight position={[0.245, 0.13, -0.3]} intensity={0.9 * far} distance={0.4} color="#ffcf8a" />
  </>;
}}</Scene3D>;
