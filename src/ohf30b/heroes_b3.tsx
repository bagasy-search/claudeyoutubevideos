// ohf30b · componentes únicos 15-21: la llave grande que raja, el aire que tiene que salir primero, el siseo que se apaga,
// la cinta de rosca + plomada, las velocidades de los respiraderos, «nunca pintarlo» y el caño maestro del sótano.
// r2b (30-oct): el héroe pasa a ser el DETALLE (respiradero en corte con su flotante, pluma de vapor que se achica contraluz,
// pintura que chorrea y sella el agujerito, respiradero torcido que la plomada endereza); mensaje grande Big; acción en 45-85 %.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, threadG, Drop } from "./h3d";
import { Big, Env, Pipe, Puffs, RadH, Shock, Tape } from "./okit";

const PI = Math.PI;
// respiradero de vapor (bala cromada); paint = cuánto lo tapó la pintura
const SteamVent: React.FC<{ p?: [number, number, number]; s?: number; rot?: number; col?: string; paint?: number }> = ({ p = [0, 0, 0], s = 1, rot = 0, col = "#dfe4e8", paint = 0 }) =>
  <group position={p} scale={s} rotation={[0, 0, rot]}>
    <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.012, 0.012, 0.04, 12]} />{M.brass()}</mesh>
    <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.03, 0.03, 0.08, 24]} />{paint > 0 ? <meshStandardMaterial color={new THREE.Color(col).lerp(new THREE.Color("#c9b98f"), paint)} metalness={1 - paint} roughness={0.12 + 0.6 * paint} /> : M.chrome({ col })}</mesh>
    <mesh position={[0, 0.12, 0]}><sphereGeometry args={[0.03, 24, 12, 0, PI * 2, 0, PI / 2]} />{paint > 0 ? <meshStandardMaterial color={new THREE.Color(col).lerp(new THREE.Color("#c9b98f"), paint)} metalness={1 - paint} roughness={0.12 + 0.6 * paint} /> : M.chrome({ col })}</mesh>
    <mesh position={[0, 0.151, 0]}><cylinderGeometry args={[0.003, 0.003, 0.002, 8]} /><meshBasicMaterial color="#111" /></mesh>
  </group>;

// ---- 10:15 · LA LLAVE GRANDE NO: al costado del radiador, la llave de caño muerde la válvula vieja, empuja… y el bronce se raja y escupe ----
export const HBigWrench: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#1e1b19" key1={[-0.6, 1.7, 1.4]}
  cam={{ at: [0.08, 0.24, 0], az: [-0.42, -0.1], el: [0.2, 0.15], r: [1.75, 1.55], fov: 32, push: { a: 3.75, b: 4.7, at: [-0.04, 0.2, 0.04], r: 0.5, az: 0.55, el: 0.28 } }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "A BIG WRENCH ON AN OLD VALVE…"], [3.75, "…AND THE OLD BRASS CRACKS", "#b3261e"]]} />}>{(tt) => {
  const push = eio(tt, 1.4, 3.7), crack = eio(tt, 3.6, 3.9), sx = tt > 3.7 && tt < 4.0 ? 0.006 * Math.sin((tt - 3.7) * 70) : 0;
  return <>
    <mesh position={[0, 0.7, -0.32]}><planeGeometry args={[3, 2]} /><meshStandardMaterial map={tex.plaster("#6d5b4a", 3, 2)} roughness={0.9} /></mesh>
    <group position={[0.32, 0, -0.08]}><RadH n={6} w={0.05} h={0.5} heat={() => 0.3} /></group>
    {/* válvula de ángulo vieja: sale del piso y entra al radiador */}
    <Pipe a={[-0.05, 0, 0]} b={[-0.05, 0.16, 0]} r={0.026} col="#5d5a55" />
    <group position={[-0.05 + sx, 0.2, 0]}>
      <RBox s={[0.1, 0.09, 0.09]} r={0.02}><meshStandardMaterial color="#9a7a3a" metalness={0.8} roughness={0.42} emissive="#ff2a1a" emissiveIntensity={1.1 * crack} /></RBox>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.025, 0.03, 0.05, 20]} />{M.brass({ col: "#a58440" })}</mesh>
      {/* la rajadura: zigzag oscuro con borde caliente que se abre */}
      {[[-0.022, 0.026, 0.5], [0.0, 0.006, -0.6], [0.018, -0.016, 0.45], [0.03, -0.036, -0.3]].map(([x, y, rz], i) => <group key={i} visible={crack > 0.02 + i * 0.2}>
        <mesh position={[x, y, 0.0455]} rotation={[0, 0, rz]}><planeGeometry args={[0.009 * crack, 0.03]} /><meshBasicMaterial color="#1a0d08" /></mesh>
        <mesh position={[x, y, 0.0452]} rotation={[0, 0, rz]}><planeGeometry args={[0.016 * crack, 0.034]} /><meshBasicMaterial color="#ff5a2a" toneMapped={false} transparent opacity={0.85 * (1 - 0.5 * eio(tt, 4.2, 5.5))} /></mesh>
      </group>)}
    </group>
    <Pipe a={[0.0, 0.2, 0]} b={[0.18, 0.2, 0]} r={0.024} col="#7d786b" />
    {/* la llave Stillson: mordaza con dientes, tuerca moleteada, mango largo rojo; gira con el empujón */}
    <group position={[-0.05, 0.2, 0.06]} rotation={[0, PI, -0.25 + 0.75 * push]}>
      <RBox s={[0.05, 0.14, 0.035]} p={[0, 0.0, 0]} r={0.008}><meshStandardMaterial color="#8d9296" metalness={0.8} roughness={0.35} /></RBox>
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0.027, -0.04 + i * 0.02, 0]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.008, 0.008, 0.034]} /><meshStandardMaterial color="#6b6f73" metalness={0.8} roughness={0.35} /></mesh>)}
      <mesh position={[0, -0.09, 0]} rotation={[0, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.03, 14]} /><meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.4} /></mesh>
      <RBox s={[0.6, 0.04, 0.03]} p={[0.3, -0.12, 0]} rot={[0, 0, 0.04]} r={0.012}><meshPhysicalMaterial color="#c22a20" roughness={0.35} clearcoat={0.5} /></RBox>
    </group>
    {/* chorrito de agua por la rajadura */}
    {[4.6, 4.85, 5.1, 5.35, 5.6, 5.85].map((a, i) => <Drop key={i} tt={tt} a={a} b={a + 0.4} x={-0.04 + 0.006 * (i % 3)} y0={0.19} y1={0.0} z={0.055} r={0.006} />)}
    {/* astillas de bronce que saltan de la rajadura y caen al piso */}
    {Array.from({ length: 9 }, (_, i) => { const u = cl((tt - 3.72) / 0.9), vx = (rn(i, 41) - 0.5) * 0.5, vz = 0.12 + rn(i, 42) * 0.25, vy = 0.25 + rn(i, 43) * 0.35;
      const y = Math.max(0.004, 0.2 + vy * u - 0.75 * u * u), sp = (1 - u) * 14;
      return <mesh key={i} visible={tt > 3.72} position={[-0.04 + vx * u, y, 0.05 + vz * u]} rotation={[sp * rn(i, 44), sp, sp * 0.7]} castShadow><boxGeometry args={[0.007 + 0.006 * rn(i, 45), 0.004, 0.006]} />{M.brass({ col: "#c9a24a" })}</mesh>; })}
    <Shock tt={tt} a={3.7} p={[-0.05, 0.2, 0.1]} r={0.08} col="#ff8a3a" />
  </>;
}}</Scene3D>;

// ---- 11:29 · PRIMERO SALE EL AIRE: el respiradero cromado en macro, con la chapa cortada; el aire sale por el agujerito, entra el vapor, el flotante sube y lo cierra ----
export const HAirOut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#1d2a2e" key1={[-0.5, 1.2, 1.0]} warm={1.1}
  cam={{ at: [0.04, 0.24, 0], at1: [0.04, 0.22, 0], az: [-0.18, 0.12], el: [0.12, 0.08], r: [0.86, 0.74], fov: 30 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "AIR OUT FIRST…", "#1f4f9a"], [3.4, "…THEN STEAM IN, AND IT SHUTS", "#b3261e"]]} />}>{(tt) => {
  const steam = eio(tt, 1.6, 3.8), shut = eio(tt, 3.6, 4.3), fy = 0.075 + 0.055 * shut, air = eio(tt, 0.4, 0.9) * (1 - shut);
  const shell = <meshStandardMaterial color="#dfe4e8" metalness={1} roughness={0.14} side={THREE.DoubleSide} />;
  return <>
    <Env kind="plaster" col="#3b6468" z={-0.4} y={0.4} rim={[0.45, 0.6, -0.15]} rimI={2.8} />
    {/* columnas del radiador atrás, en penumbra */}
    {[0, 1, 2].map((i) => <RBox key={i} s={[0.07, 0.7, 0.14]} p={[-0.3 + i * 0.08, 0.05, -0.12]} r={0.03}><meshStandardMaterial color="#cdbf9e" metalness={0.3} roughness={0.5} /></RBox>)}
    <Pipe a={[-0.2, 0.06, -0.08]} b={[0.04, 0.06, -0.08]} r={0.014} col="#b08a48" />
    <Pipe a={[0.04, 0.06, -0.08]} b={[0.04, 0.06, 0]} r={0.014} col="#b08a48" />
    <group position={[0.04, 0.0, 0]}>
      {/* cuerpo cromado con una ventana cortada hacia la cámara */}
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.07, 0.07, 0.2, 48, 1, true, PI * 0.28, PI * 1.44]} />{shell}</mesh>
      <mesh position={[0, 0.22, 0]}><sphereGeometry args={[0.07, 48, 16, PI * 0.28, PI * 1.44, 0, PI / 2]} />{shell}</mesh>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.074, 0.074, 0.02, 48]} />{M.chrome()}</mesh>
      {/* el agujerito de arriba */}
      <mesh position={[0, 0.29, 0]}><cylinderGeometry args={[0.006, 0.006, 0.004, 12]} /><meshBasicMaterial color="#111" /></mesh>
      {/* vapor que va llenando desde abajo */}
      <mesh position={[0, 0.03 + 0.095 * steam, 0]} scale={[1, Math.max(0.01, 0.95 * steam), 1]}><cylinderGeometry args={[0.064, 0.064, 0.2, 32]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} /></mesh>
      {/* el aire (azul) que queda arriba y se va */}
      <mesh position={[0, 0.22 - 0.095 * (1 - steam), 0]} scale={[1, Math.max(0.01, 0.95 * (1 - steam)), 1]}><cylinderGeometry args={[0.064, 0.064, 0.2, 32]} /><meshBasicMaterial color="#5fb0ff" transparent opacity={0.3} depthWrite={false} /></mesh>
      {/* flotante: lata de bronce con anillos, resorte abajo y aguja arriba; sube y tapa */}
      <group position={[0, fy, 0]}>
        <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.04, 0.04, 0.1, 32]} />{M.brass({ col: "#c39a4c" })}</mesh>
        {[0.015, 0.05, 0.085].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.041, 0.003, 8, 32]} />{M.brass()}</mesh>)}
        <mesh position={[0, 0.115, 0]}><coneGeometry args={[0.04, 0.03, 32]} />{M.brass({ col: "#c39a4c" })}</mesh>
        <mesh position={[0, 0.145, 0]}><cylinderGeometry args={[0.003, 0.006, 0.03 + 0.0 * shut, 12]} />{M.steel()}</mesh>
      </group>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, 0.03 + i * (fy - 0.03) / 6, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.022, 0.002, 6, 20]} />{M.steel()}</mesh>)}
    </group>
    {/* chorro de aire que sale, y cuando cierra el anillo verde */}
    <Puffs tt={tt} n={14} a={[0.04, 0.3, 0]} b={[0.12, 0.6, 0.02]} r={0.014} col="#9fd0ff" op={0.9 * air} v={1.2} wob={0.012} />
    <mesh position={[0.04, 0.293, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.012, 0.02 + 0.03 * shut, 32]} /><meshBasicMaterial color="#5fd17a" transparent opacity={0.9 * shut} toneMapped={false} depthWrite={false} /></mesh>
  </>;
}}</Scene3D>;

// ---- 12:17 · EL SISEO: contraluz de la ventana; la pluma de vapor del respiradero sisea larga… y se achica hasta nada ----
export const HHissMeter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#2a1d14" key1={[0.6, 1.2, -0.8]} warm={1.1}
  cam={{ at: [0.02, 0.32, 0], az: [-0.18, 0.2], el: [-0.05, 0.02], r: [0.7, 0.62], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "HSSSSSS…"], [3.4, "…THEN QUIET. GOOD VENT.", "#1f6a3a"]]} />}>{(tt) => {
  const k = 1 - eio(tt, 1.8, 4.6), N = 26;
  return <>
    {/* la ventana de atrás, cálida: la pluma se lee a contraluz */}
    <mesh position={[0.1, 0.55, -0.5]}><planeGeometry args={[0.9, 0.7]} /><meshBasicMaterial color="#35506e" toneMapped={false} /></mesh>
    {[[-0.35, 0.55, 0.05, 0.74], [0.55, 0.55, 0.05, 0.74], [0.1, 0.92, 0.95, 0.05], [0.1, 0.18, 0.95, 0.05], [0.1, 0.55, 0.03, 0.7]].map(([x, y, w, hh], i) => <RBox key={i} s={[w, hh, 0.03]} p={[x, y, -0.48]} r={0.004}>{M.wood({ base: [70, 46, 30] })}</RBox>)}
    {/* esquina superior del radiador, verde viejo, con el respiradero */}
    <group position={[-0.32, 0, 0]}><RadH n={5} w={0.06} h={0.3} heat={() => 0.75} glow={0.4} /></group>
    <mesh position={[-0.13, 0.22, 0]} rotation={[0, 0, -PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.06, 12]} />{M.brass()}</mesh>
    <SteamVent p={[-0.09, 0.2, 0]} s={1.25} />
    {/* la pluma: hilo de vapor que se abre y sube; su largo y su opacidad = el siseo */}
    {Array.from({ length: N }, (_, i) => { const u = ((tt * 0.9 + i / N) % 1), y = 0.4 + u * 0.42 * (0.25 + 0.75 * k), sp = 0.01 + 0.09 * u * (0.3 + 0.7 * k);
      return <mesh key={i} position={[-0.09 + sp * Math.sin(i * 2.3 + tt * 0.8) + 0.05 * u, y, sp * Math.cos(i * 1.7)]} scale={Math.max(0.001, (0.5 + 1.6 * u) * (0.35 + 0.65 * k))}>
        <sphereGeometry args={[0.016, 12, 10]} /><meshBasicMaterial color="#fffaf2" transparent opacity={0.62 * (1 - u) * k} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 12:40 · CINTA Y PLOMADA: cinta en la rosca, el respiradero entra torcido, la plomada baja y lo endereza ----
export const HPlumbVent: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#232628" key1={[-0.6, 1.6, 1.3]}
  cam={{ at: [0.02, 0.28, 0], az: [-0.3, 0.12], el: [0.12, 0.08], r: [0.82, 0.74], fov: 30 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "TAPE THE THREADS, SCREW IT IN…"], [3.6, "…STANDING STRAIGHT UP", "#1f6a3a"]]} />}>{(tt) => {
  const wrap = eio(tt, 0.4, 1.6), screw = eio(tt, 1.6, 2.8), drop = eio(tt, 2.7, 3.3), fix = eio(tt, 3.3, 4.6);
  const lean = 0.38 * (1 - fix), ok = eio(tt, 4.5, 4.9);
  return <>
    <mesh position={[0, 0.5, -0.3]}><planeGeometry args={[3, 2]} /><meshStandardMaterial map={tex.brick(4, 3, "#7f4430")} roughness={0.9} /></mesh>
    {/* la última columna del radiador, crema, con el agujero roscado */}
    <RBox s={[0.12, 0.62, 0.16]} p={[-0.2, 0.05, 0]} r={0.035}><meshStandardMaterial color="#e3d9c2" metalness={0.25} roughness={0.5} /></RBox>
    <group position={[-0.13, 0.28, 0]} rotation={[0, 0, lean]}>
      {/* niple horizontal con rosca y cinta blanca que lo envuelve */}
      <group rotation={[0, 0, -PI / 2]} position={[0.03, 0, 0]}>
        <group rotation={[0, screw * PI * 6, 0]}>
          <mesh geometry={threadG(0.011, 0.05, 7)}>{M.brass()}</mesh>
          <mesh scale={[1, Math.max(0.01, wrap), 1]} position={[0, -0.025 + 0.025 * wrap, 0]}><cylinderGeometry args={[0.0128, 0.0128, 0.05, 18, 1, true]} /><meshStandardMaterial color="#f7f7f5" roughness={0.6} transparent opacity={0.92} side={THREE.DoubleSide} /></mesh>
        </group>
      </group>
      {/* el respiradero: entra girando hasta el niple */}
      <group position={[0.07 + 0.08 * (1 - screw), 0.0, 0]} rotation={[0, screw * PI * 4, 0]}><SteamVent p={[0, -0.02, 0]} s={1.3} /></group>
    </group>
    {/* la plomada: cuelga al lado; el respiradero termina paralelo al hilo */}
    <group position={[0.2, 0.75, 0.04]}>
      <mesh position={[0, -0.27 * drop, 0]}><cylinderGeometry args={[0.0012, 0.0012, Math.max(0.001, 0.54 * drop), 6]} /><meshBasicMaterial color="#f2ead2" /></mesh>
      <mesh position={[0, -0.54 * drop - 0.02, 0]} rotation={[PI, 0, 0]} scale={Math.max(0.001, cl(drop * 3))}><coneGeometry args={[0.016, 0.045, 20]} />{M.brass()}</mesh>
    </group>
    <mesh position={[-0.05, 0.4, 0.06]}><ringGeometry args={[0.12, 0.132, 48]} /><meshBasicMaterial color="#5fd17a" transparent opacity={0.85 * ok} toneMapped={false} depthWrite={false} /></mesh>
  </>;
}}</Scene3D>;

// ---- 13:15 · LEJOS = RÁPIDO: cuatro radiadores sobre el caño, del más cerca al más lejos; los de la punta soplan más y se calientan a la par ----
export const HVentSpeeds: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" key1={[-1, 2.4, 1.6]}
  cam={{ at: [0.12, 0.22, 0], az: [-0.35, 0.15], el: [0.2, 0.16], r: [1.6, 1.45], fov: 34 }}
  over={(tt) => <Big tt={tt} steps={[[1.0, "FAR FROM THE BOILER…"], [3.0, "…USE THE FASTER VENT", "#b3261e"]]} />}>{(tt) => {
  const run = eio(tt, 0.8, 4.8);
  return <>
    <RBox s={[0.16, 0.24, 0.16]} p={[-0.62, 0.12, 0]} r={0.015}><meshStandardMaterial color="#7a2c22" roughness={0.5} /></RBox>
    <Pipe a={[-0.54, 0.04, 0.0]} b={[0.72, 0.04, 0.0]} r={0.016} />
    {[0, 1, 2, 3].map((i) => { const x = -0.36 + i * 0.34, sp = 0.4 + i * 0.5, k = cl(run * (0.75 + i * 0.08));
      return <group key={i} position={[x, 0.04, 0]}>
        <group scale={0.55}><RadH n={6} heat={() => 0.15 + 0.8 * k} glow={0.8} /></group>
        <SteamVent p={[0.11, 0.18, 0]} s={0.75} rot={-PI / 2} />
        <Puffs tt={tt} n={4 + i * 2} a={[0.16, 0.19, 0]} b={[0.24, 0.32, 0]} r={0.009} col="#d6ecff" op={0.75 * (1 - k * 0.8)} v={sp} />
        <Tape txt={["#1 SLOW", "#2", "#4", "#6 FAST"][i]} col={i === 3 ? "#b3261e" : "#1c2a3a"} p={[0, 0.4, 0.03]} w={i === 0 || i === 3 ? 0.2 : 0.09} k={phys(tt, 0.4 + i * 0.3, 8, 0.45)} />
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 13:47 · NUNCA PINTARLO: el pincel pasa, la pintura chorrea, llena el agujerito y el chorro de aire se corta ----
export const HNoPaint: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1f2a22" key1={[-0.5, 1.3, 1.1]} warm={1.1}
  cam={{ at: [0, 0.24, 0], az: [-0.3, 0.12], el: [0.42, 0.32], r: [0.42, 0.37], fov: 30, push: { a: 3.7, b: 5.0, at: [-0.2, -0.12, 0], r: 1.35, az: 0.3, el: 0.18 } }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "ONE COAT OF PAINT…"], [3.3, "…SEALS THE HOLE. NEVER PAINT A VENT.", "#b3261e"]]} />}>{(tt) => {
  const stroke = eio(tt, 0.7, 2.4), seal = eio(tt, 2.4, 3.6), sw = stroke > 0 && stroke < 1 ? 1 : 0;
  const PAINT = "#e9dcc0";
  return <>
    <mesh position={[0, 0.3, -0.3]}><planeGeometry args={[2, 2]} /><meshStandardMaterial map={tex.plaster("#4f6b55", 2, 2)} roughness={0.9} /></mesh>
    <SteamVent p={[0, 0.0, 0]} s={1.5} paint={stroke * 0.85} />
    {/* al alejarse: el respiradero pintado está en la punta de un radiador que se queda frío */}
    <group position={[-0.3, -0.56, -0.02]}><RadH n={8} w={0.05} h={0.5} heat={(i, y) => 0.88 - 0.8 * eio(tt, 3.6 + (7 - i) * 0.12, 4.8 + (7 - i) * 0.12) + 0.04 * Math.sin(i * 1.7 + y * 4)} glow={1.1} /></group>
    <Pipe a={[-0.06, -0.02, 0]} b={[0.0, -0.02, 0]} r={0.012} col="#b08a48" />
    <mesh position={[0, -0.56, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3, 2]} />{M.wood({ base: [130, 88, 54] })}</mesh>
    <pointLight position={[0.3, 0.3, 0.6]} intensity={1.2} distance={2.5} color="#fff0d8" />
    {/* la pintura que chorrea por el cuerpo: gotas largas que bajan y quedan */}
    {Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * PI * 2 + 0.3, L = 0.02 + 0.05 * rn(i, 4) * eio(tt, 1.2 + i * 0.12, 3.2 + i * 0.1);
      return <mesh key={i} position={[0.046 * Math.sin(a), 0.2 - L / 2, 0.046 * Math.cos(a)]} scale={[1, Math.max(0.001, L / 0.02), 1]}><capsuleGeometry args={[0.005, 0.02, 6, 10]} /><meshPhysicalMaterial color={PAINT} roughness={0.25} clearcoat={0.8} /></mesh>; })}
    {/* el agujerito arriba y la gota de pintura que lo tapa */}
    <mesh position={[0, 0.2275, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.006, 20]} /><meshBasicMaterial color="#0b0b0b" /></mesh>
    <mesh position={[0, 0.226, 0]} scale={[1, 0.55, 1]} visible={seal > 0.01}><sphereGeometry args={[0.012 * Math.max(0.05, seal), 20, 14]} /><meshPhysicalMaterial color={PAINT} roughness={0.2} clearcoat={1} /></mesh>
    {/* el aire que sale… y deja de salir */}
    <Puffs tt={tt} n={10} a={[0, 0.235, 0]} b={[0.02, 0.4, 0]} r={0.008} col="#e8f4ff" op={0.75 * (1 - seal)} v={1.3} wob={0.006} />
    {/* el pincel: barre de un lado al otro con la carga de pintura y se va */}
    <group position={[lerp(-0.07, 0.07, (Math.sin(tt * 3.2) + 1) / 2) * sw + (stroke >= 1 ? 0.3 * eio(tt, 2.4, 3.2) : 0), 0.2 + (stroke >= 1 ? 0.1 * eio(tt, 2.4, 3.2) : 0), 0.08]} rotation={[0.3, 0, -0.5]} visible={tt < 3.3}>
      <RBox s={[0.034, 0.045, 0.012]} r={0.004}><meshStandardMaterial color={PAINT} roughness={0.3} /></RBox>
      <RBox s={[0.038, 0.022, 0.016]} p={[0, 0.032, 0]} r={0.002}>{M.steel()}</RBox>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.008, 0.011, 0.14, 12]} />{M.wood({ base: [170, 120, 70] })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 14:19 · EL CAÑO MAESTRO: sale de la caldera, da la vuelta por el techo del sótano bajando de a poco; las subidas van a los radiadores ----
export const HMainLoop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#2a2420" warm={1.2} key1={[-1, 2.2, 1.4]} lamp={[0.2, 0.7, 0.2]}
  cam={{ at: [0, 0.2, 0], az: [-0.6, 0.3], el: [0.5, 0.4], r: [1.45, 1.3], fov: 34 }}
  over={(tt) => <Big tt={tt} steps={[[1.0, "THE MAIN PIPE…"], [3.0, "…SLOPES BACK TO THE BOILER", "#1f4f9a"]]} />}>{(tt) => {
  const draw = eio(tt, 0.3, 2.6), PTS: [number, number, number][] = [[-0.5, 0.3, -0.3], [0.5, 0.28, -0.3], [0.5, 0.26, 0.3], [-0.4, 0.24, 0.3], [-0.4, 0.06, 0.3]];
  const segs = PTS.slice(1).map((b, i) => [PTS[i], b] as const);
  const roll = eio(tt, 2.75, 5.3), rs = Math.min(2, Math.floor(roll * 3)), rf = roll * 3 - rs, ra = PTS[rs], rb = PTS[rs + 1];
  return <>
    <Env kind="concrete" z={-0.7} y={0.6} floor="concrete" fy={0} rim={[0.6, 0.8, 0.6]} rimI={2.6} />
    <RBox s={[0.2, 0.3, 0.18]} p={[-0.5, 0.15, -0.3]} r={0.015}><meshStandardMaterial color="#7a2c22" roughness={0.5} /></RBox>
    {PTS.slice(1, 4).map((q, i) => <mesh key={i} position={q} visible={draw * 4 > i + 1}><sphereGeometry args={[0.04, 20, 14]} />{M.brass()}</mesh>)}
    {/* la bolita de acero que rueda por arriba del caño siguiendo la pendiente, de vuelta a la caldera */}
    <mesh position={[lerp(ra[0], rb[0], rf), lerp(ra[1], rb[1], rf) + 0.058, lerp(ra[2], rb[2], rf)]} visible={roll > 0.001}><sphereGeometry args={[0.024, 24, 16]} />{M.chrome()}</mesh>
    {segs.map(([a, b], i) => { const k = cl(draw * 4 - i); if (k <= 0) return null; const e: [number, number, number] = [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
      return <Pipe key={i} a={a} b={e} r={0.034} col="#5d5a55" />; })}
    {[[-0.1, -0.3], [0.5, 0.0], [0.1, 0.3]].map(([x, z], i) => <Pipe key={i} a={[x, 0.28, z]} b={[x, 0.28 + 0.2 * eio(tt, 2.4 + i * 0.2, 3.0 + i * 0.2), z]} r={0.014} />)}
    {Array.from({ length: 8 }, (_, i) => { const u = ((tt * 0.25 + i / 8) % 1) * 4, s = Math.min(3, Math.floor(u)), f = u - s, [a, b] = segs[s];
      return <mesh key={i} position={[lerp(a[0], b[0], f), lerp(a[1], b[1], f) + 0.04, lerp(a[2], b[2], f)]} rotation={[0, Math.atan2(-(b[2] - a[2]), b[0] - a[0]), -PI / 2]}><coneGeometry args={[0.016, 0.034, 10]} /><meshBasicMaterial color="#4fa3e0" toneMapped={false} transparent opacity={eio(tt, 2.6, 3.2)} /></mesh>; })}
  </>;
}}</Scene3D>;
