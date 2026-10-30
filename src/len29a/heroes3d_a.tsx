// len29a · 3ª vuelta de los componentes en 3D real (kit h3d): el objeto con material y luz hace la idea sin leer.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H } from "./hkit";
import { Drop, Hair, M, RBox, Scene3D, cl, coilTex, tex, eio, hexNutG, lerp, phys, rn, threadG, tubeG } from "./h3d";

const PI = Math.PI;

// ---- 8:02 · COMO ABRIR UN FRASCO: la tapa del frasco y la tuerca del sifón giran juntas a la izquierda, suben por la rosca y saltan ----
export const HNut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile"
  cam={{ at: [0.03, 0.14, 0], az: [-0.42, 0.28], el: [0.46, 0.32], r: [1.22, 1.08], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="LIKE OPENING A JAR" col={AMB} />}>{(tt) => {
  const rot = 2.2 * PI * eio(tt, 1.1, 4.0), climb = 0.03 * eio(tt, 1.1, 4.0);
  const pop = cl((tt - 4.05) / 0.55), hop = Math.sin(PI * pop) * 0.13, land = phys(tt, 4.6, 8, 0.32);
  const jarS = 0.001 + cl(phys(tt, 0.15, 7, 0.45)), pipeS = 0.001 + cl(phys(tt, 0.45, 7, 0.45));
  // las dos piezas que giran: misma vuelta, mismo sentido (contra reloj visto desde arriba = +Y)
  const off = (side: number) => ({ x: side * lerp(0, 0.1, pop) + side * 0.02 * (land - 1) * (pop >= 1 ? 1 : 0), y: climb + hop, ry: rot + pop * 1.5 * PI, rz: side * 0.5 * pop * (1 - land) + (pop >= 1 ? side * 0.25 : 0) });
  const L = off(-1), R = off(1), arr = cl(phys(tt, 0.9, 6, 0.6)) * (1 - pop);
  return <>
    {/* EL FRASCO de vidrio con pepinos, tapa de chapa dorada estriada */}
    <group position={[-0.2, 0, 0]} scale={jarS}>
      <mesh position={[0, 0.08, 0]} castShadow><cylinderGeometry args={[0.072, 0.072, 0.16, 48, 1, true]} />{M.glass({ op: 0.28 })}</mesh>
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.072, 0.072, 0.004, 48]} />{M.glass({ op: 0.4 })}</mesh>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.066, 0.066, 0.115, 40]} />{M.water({ col: "#e3e8c4", op: 0.35 })}</mesh>
      <mesh position={[0, 0.075, 0]}><cylinderGeometry args={[0.0735, 0.0735, 0.06, 48, 1, true]} />{M.matte({ col: "#efe3c2", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.075, 0]}><cylinderGeometry args={[0.0738, 0.0738, 0.012, 48, 1, true]} />{M.matte({ col: "#b8302a", side: THREE.DoubleSide })}</mesh>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[Math.cos(i * 0.9) * 0.035, 0.035 + 0.012 * i, Math.sin(i * 0.9) * 0.035]} rotation={[0.3 * i, 0, 0.5]}><capsuleGeometry args={[0.012, 0.05, 6, 12]} />{M.matte({ col: "#5f7a2e" })}</mesh>)}
      <group position={[L.x * 0 + (pop > 0 ? L.x : 0), 0.175 + L.y, 0]} rotation={[0, L.ry, L.rz]}>
        <mesh castShadow><cylinderGeometry args={[0.078, 0.078, 0.03, 64]} />{M.brass()}</mesh>
        {Array.from({ length: 44 }, (_, i) => <mesh key={i} position={[Math.cos(i / 44 * 2 * PI) * 0.078, 0, Math.sin(i / 44 * 2 * PI) * 0.078]} rotation={[0, -i / 44 * 2 * PI, 0]}><boxGeometry args={[0.004, 0.026, 0.006]} />{M.brass({ col: "#b88a34" })}</mesh>)}
        <mesh position={[0.05, 0.0155, 0]}><cylinderGeometry args={[0.009, 0.009, 0.002, 20]} />{M.glow({ col: "#ff8a2a" })}</mesh>
      </group>
    </group>
    {/* EL CAÑO de cola de PVC parado, con su rosca y la tuerca deslizante */}
    <group position={[0.2, 0, 0]} scale={pipeS}>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow><cylinderGeometry args={[0.036, 0.036, 0.2, 40]} />{M.pvc()}</mesh>
      <mesh position={[0, 0.201, 0]}><cylinderGeometry args={[0.03, 0.03, 0.002, 40]} />{M.matte({ col: "#1a1b1d" })}</mesh>
      <mesh position={[0, 0.165, 0]} geometry={threadG(0.037, 0.06, 7)}>{M.pvc({ col: "#dcd8cd" })}</mesh>
      <group position={[(pop > 0 ? R.x : 0), 0.15 + R.y, 0]} rotation={[0, R.ry, R.rz]}>
        <mesh geometry={hexNutG(0.064, 0.04, 0.039)} castShadow>{M.pvc({ col: "#ece7da" })}</mesh>
        <mesh position={[0.045, 0.0245, 0]}><cylinderGeometry args={[0.008, 0.008, 0.002, 20]} />{M.glow({ col: "#ff8a2a" })}</mesh>
      </group>
    </group>
    {/* flechas curvas de cinta 3D sobre cada pieza, girando a la izquierda */}
    {[-0.2, 0.2].map((x, i) => <group key={i} position={[x, (i ? 0.22 : 0.24) + climb, 0]} rotation={[-PI / 2, 0, rot * 0.15 + 0.4]} scale={arr}>
      <mesh><torusGeometry args={[0.11, 0.006, 10, 64, PI * 1.25]} />{M.glow({ col: AMB })}</mesh>
      <mesh position={[Math.cos(PI * 1.25) * 0.11, Math.sin(PI * 1.25) * 0.11, 0]} rotation={[0, 0, PI * 1.25 - PI]}><coneGeometry args={[0.018, 0.04, 16]} />{M.glow({ col: AMB })}</mesh>
    </group>)}
  </>;
}}</Scene3D>;

// ---- 10:48 · LA ESPIRAL: el tambor rojo gira, el cable de acero entra por el caño de vidrio, engancha la bola de pelo y la trae afuera ----
export const HAugerPath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark"
  cam={{ at: [0.0, 0.15, 0], at1: [0.0, 0.15, 0], az: [0.22, -0.06], el: [0.28, 0.2], r: [1.25, 1.1], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="IT COMES BACK WITH IT" col={ICE} />}>{(tt) => {
  const X0 = -0.3, XC = 0.32, Y = 0.16;
  const go = eio(tt, 0.7, 2.6), back = eio(tt, 3.3, 5.6);
  const tip = lerp(X0 + 0.04, XC - 0.03, go) - back * 0.4, tipQ = Math.round(tip * 80) / 80;
  const spin = (tt - 0.7) * 9 * (tt > 0.7 ? 1 : 0);
  const clogX = tt < 3.3 ? XC : tipQ + 0.05, hooked = tt >= 3.0;
  const len = Math.max(0.02, tip - (X0 - 0.12)), ct = coilTex(); ct.repeat.set(1, len * 9); ct.offset.set(0, -spin * 0.04);
  const drumIn = 0.3 * (1 - phys(tt, 0.1, 7, 0.45)), pipeIn = cl(phys(tt, 0.3, 6, 0.6));
  return <>
    {/* el caño de vidrio acostado sobre dos caballetes de madera, con grasa adentro */}
    <group scale={[1, pipeIn, pipeIn]}>
      <mesh position={[0.17, Y, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.62, 48, 1, true]} />{M.glass({ op: 0.24 })}</mesh>
      <mesh position={[0.17, Y, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.047, 0.047, 0.62, 48, 1, true]} />{M.grease({ op: 0.18, side: THREE.BackSide })}</mesh>
      {[-0.06, 0.4].map((x, i) => <RBox key={i} s={[0.05, 0.11, 0.12]} p={[x, 0.055, 0]} r={0.008}>{M.wood({ base: [170, 120, 70] })}</RBox>)}
    </group>
    {/* la bola de pelo y grasa: quieta en el fondo del caño hasta que el cable la engancha y la saca */}
    <group position={[clogX, Y - (hooked && tt > 5.0 ? 0.03 * eio(tt, 5.0, 5.6) : 0), 0]} rotation={[spin * (hooked ? 0.12 : 0), 0, 0]}>
      {Array.from({ length: 26 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.055, (rn(i, 2) - 0.5) * 0.055, (rn(i, 3) - 0.5) * 0.055]} castShadow><sphereGeometry args={[0.02 + 0.012 * rn(i, 4), 12, 10]} />{M.grease({ col: i % 3 ? "#8b8070" : "#c9b98a" })}</mesh>)}
      <Hair id="aug" pts={[[-0.05, 0.02, 0], [-0.02, -0.03, 0.03], [0.02, 0.03, -0.02], [0.05, -0.02, 0.02], [0.03, -0.05, 0]]} n={34} spread={0.05} r={0.0024} />
      {tt > 3.6 && <Drop tt={tt} a={4.2} b={4.6} x={0} y0={-0.03} y1={-Y + 0.001} r={0.007} mat={M.grease({ col: "#9a8f78" })} />}
    </group>
    {/* el cable: resorte de acero (cilindro con hélice pintada que corre al girar) */}
    <mesh position={[X0 - 0.12, Y, 0]} rotation={[spin * 0.6, 0, 0]} geometry={tubeG("aug_h" + Math.round(len * 80), Array.from({ length: Math.max(2, Math.round(len * 700)) }, (_, i) => { const u = i / (Math.max(2, Math.round(len * 700)) - 1), ang = u * len * 520; return [u * len, 0.014 * Math.cos(ang), 0.014 * Math.sin(ang)]; }), 0.0042, Math.max(8, Math.round(len * 900)), 6)} castShadow>{M.steel({ col: "#cfd5da" })}</mesh>
    <mesh position={[X0 - 0.12 + len / 2, Y, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.006, 0.006, len, 12, 1]} /><meshStandardMaterial map={ct} metalness={0.85} roughness={0.3} /></mesh>
    <mesh position={[tip, Y, 0]} castShadow><sphereGeometry args={[0.02, 16, 12]} />{M.chrome()}</mesh>
    {/* el tambor rojo con su manivela */}
    <group position={[X0 - 0.22, 0.17 + drumIn, 0]}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.12, 64]} />{M.plastic({ col: "#c8261e" })}</mesh>
      <mesh rotation={[0, 0, PI / 2]} position={[0.062, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.01, 40]} />{M.chrome()}</mesh>
      <group rotation={[spin * 0.5, 0, 0]} position={[-0.065, 0, 0]}>
        <mesh position={[0, 0.06, 0]} castShadow><boxGeometry args={[0.012, 0.13, 0.02]} />{M.chrome()}</mesh>
        <mesh position={[-0.03, 0.12, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.06, 20]} />{M.wood({ base: [90, 50, 25] })}</mesh>
      </group>
      <mesh position={[0, -0.13, 0]}><boxGeometry args={[0.12, 0.08, 0.16]} />{M.steel({ col: "#5a5f64" })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 4:11 · LA BURBUJA: en una pileta de natación una burbuja sale del desagüe del fondo, crece al subir y revienta arriba ----
export const HPool: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0a1016" key1={[-0.8, 2.6, 1.2]}
  cam={{ at: [0, 0.3, 0], az: [-0.12, 0.12], el: [0.14, 0.12], r: [1.9, 1.7], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="BUBBLES ONLY GO UP" col={ICE} />}>{(tt) => {
  const W = 1.1, D = 0.7, Hh = 0.42, top = Hh;
  const rise = eio(tt, 0.9, 4.1), by = lerp(0.03, top - 0.02, rise), br = lerp(0.06, 0.16, rise), burst = cl((tt - 4.15) / 1.5);
  const tile = 0.5 + 0.5 * Math.sin(tt * 1.3);
  const caustic = (i: number) => 0.5 + 0.5 * Math.sin(tt * 1.7 + i * 1.9);
  return <>
    {/* deck de baldosas alrededor */}
    {[[0, top, D / 2 + 0.35, W + 1.4, 0.0001], [0, top, -D / 2 - 0.35, W + 1.4, 0.7], [W / 2 + 0.35, top, 0, 0.7, D], [-W / 2 - 0.35, top, 0, 0.7, D]].map(([x, y, z, w, d], i) =>
      <mesh key={i} position={[x, y - 0.02, z]} receiveShadow castShadow><boxGeometry args={[w, 0.04, d]} /><meshStandardMaterial map={tex.counter(3, 2)} color="#9a948a" roughness={0.5} /></mesh>)}
    {/* borde de azulejo azul */}
    {[[0, D / 2, W, 0], [0, -D / 2, W, 0], [W / 2, 0, D, 1], [-W / 2, 0, D, 1]].map(([x, z, w, r], i) =>
      <mesh key={"b" + i} position={[x, top - 0.035, z]} rotation={[0, r ? PI / 2 : 0, 0]}><boxGeometry args={[w + 0.02, 0.03, 0.02]} /><meshStandardMaterial color="#2a6fa8" roughness={0.3} /></mesh>)}
    {/* vaso de la pileta: fondo y paredes de azulejo celeste */}
    <mesh position={[0, 0, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[W, D]} /><meshStandardMaterial color="#9fd4ee" roughness={0.4} /></mesh>
    <mesh position={[0, Hh / 2, D / 2]}><planeGeometry args={[W, Hh]} />{M.glass({ op: 0.12 })}</mesh>
    {[[0, -D / 2, 0, W], [-W / 2, 0, PI / 2, D], [W / 2, 0, -PI / 2, D]].map(([x, z, r, w], i) =>
      <mesh key={"w" + i} position={[x, Hh / 2, z]} rotation={[0, r, 0]} receiveShadow><planeGeometry args={[w, Hh]} /><meshStandardMaterial color="#8cc7e6" roughness={0.4} side={THREE.DoubleSide} /></mesh>)}
    {/* líneas de carril y desagüe */}
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[W * 0.8, 0.03]} /><meshStandardMaterial color="#1f4f86" /></mesh>
    <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.06, 0.06, 0.006, 32]} />{M.matte({ col: "#0c1218" })}</mesh>
    {Array.from({ length: 5 }, (_, i) => <mesh key={"g" + i} position={[-0.04 + i * 0.02, 0.008, 0]}><boxGeometry args={[0.006, 0.006, 0.11]} />{M.chrome()}</mesh>)}
    <mesh position={[0, 0.008, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.058, 0.005, 8, 40]} />{M.chrome()}</mesh>
    {/* cáusticas: manchas de luz que bailan en el fondo */}
    {Array.from({ length: 22 }, (_, i) => <mesh key={"c" + i} position={[(rn(i, 1) - 0.5) * W * 0.9 + 0.03 * Math.sin(tt * 0.9 + i), 0.002, (rn(i, 2) - 0.5) * D * 0.9 + 0.03 * Math.cos(tt * 0.8 + i)]} rotation={[-PI / 2, 0, rn(i, 3) * 3]}>
      <ringGeometry args={[0.03 + 0.03 * rn(i, 4), 0.038 + 0.03 * rn(i, 4), 7]} /><meshBasicMaterial color="#e8fbff" transparent opacity={0.25 * caustic(i)} depthWrite={false} /></mesh>)}
    {/* el agua */}
    <mesh position={[0, top / 2 - 0.02, 0]}><boxGeometry args={[W - 0.004, top - 0.04, D - 0.004]} />{M.water({ col: "#4fb0e0", op: 0.34, emI: 0.15 })}</mesh>
    <mesh position={[0, top - 0.04 + 0.002 * tile, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[W, D, 1, 1]} /><meshPhysicalMaterial color="#9fe0ff" roughness={0.02} transparent opacity={0.3} clearcoat={1} /></mesh>
    {/* escalera cromada */}
    {[-0.07, 0.07].map((dz, i) => <mesh key={"l" + i} geometry={tubeG("lad" + i, [[W / 2 - 0.08, 0.12, dz], [W / 2 - 0.06, top - 0.04, dz], [W / 2 + 0.02, top + 0.14, dz], [W / 2 + 0.1, top + 0.1, dz], [W / 2 + 0.12, top, dz]], 0.008, 60, 12)} castShadow>{M.chrome()}</mesh>)}
    {[0.16, 0.26].map((y, i) => <mesh key={"s" + i} position={[W / 2 - 0.07, y, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.006, 0.006, 0.14, 12]} />{M.chrome()}</mesh>)}
    {/* LA BURBUJA */}
    {burst <= 0 && tt > 0.85 && <group position={[0.02 * Math.sin(tt * 5), by, 0.015 * Math.cos(tt * 4)]} scale={[1 + 0.06 * Math.sin(tt * 9), 1 - 0.06 * Math.sin(tt * 9), 1]}>
      <mesh><sphereGeometry args={[br, 32, 24]} /><meshPhysicalMaterial color="#ffffff" roughness={0} transparent opacity={0.72} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} emissive="#bfe8ff" emissiveIntensity={0.45} /></mesh>
      <mesh position={[-br * 0.35, br * 0.4, br * 0.5]}><sphereGeometry args={[br * 0.18, 12, 10]} />{M.glow({ col: "#ffffff", op: 0.9 })}</mesh>
    </group>}
    {Array.from({ length: 8 }, (_, i) => { const k = cl((tt - 0.9 - i * 0.35) / 2.6); return k > 0 && k < 1 && burst <= 0 ? <mesh key={"m" + i} position={[0.05 * Math.sin(i * 2), lerp(0.03, top - 0.03, k), 0.04 * Math.cos(i * 3)]}><sphereGeometry args={[0.005, 10, 8]} />{M.glass({ col: "#ffffff", op: 0.6 })}</mesh> : null; })}
    {/* revienta: corona de gotas y anillo en la superficie */}
    {burst > 0 && burst < 1 && <>
      {Array.from({ length: 16 }, (_, i) => { const a = i / 16 * 2 * PI, s = cl(burst * 1.6) * (0.1 + 0.06 * rn(i, 5)); return <mesh key={"d" + i} position={[Math.cos(a) * s, top - 0.03 + 0.2 * Math.sin(PI * cl(burst * 1.6)) * (0.6 + 0.4 * rn(i, 6)), Math.sin(a) * s]}><sphereGeometry args={[0.012, 10, 8]} />{M.water({ col: "#dff4ff", op: 0.95 * (1 - cl(burst * 1.6)) })}</mesh>; })}
      {[0, 0.25].map((d, j) => { const k = cl(burst * 1.3 - d); return <mesh key={j} position={[0, top - 0.03, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.05 + 0.3 * k, 0.065 + 0.31 * k, 64]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85 * (1 - k)} depthWrite={false} /></mesh>; })}
    </>}
  </>;
}}</Scene3D>;
