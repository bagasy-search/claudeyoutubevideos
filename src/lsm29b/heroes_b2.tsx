// lsm29b · componentes únicos 7-12 (la cosecha de Lyle, el genio de Vern, el vendedor de Biblias y el pagaré sin firmar).
import React from "react";
import * as THREE from "three";
import { AMB, H, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Glass, Table, paperTex } from "./tg";
import { Book, Mug, Pickup, Sky } from "./pg";

const PI = Math.PI;

// ---- 5:24 · LA COSECHADORA DE LYLE: la camioneta entra con su cosechadora en el carro; detrás, el maizal cae surco a surco y el contador llega a 11 días ----
const ROWS = Array.from({ length: 6 }, (_, r) => Array.from({ length: 18 }, (_, c) => [-1.3 + c * 0.14 + 0.03 * rn(r * 18 + c, 2), -0.5 - r * 0.12] as [number, number])).flat();
const red = <meshPhysicalMaterial color="#b3261e" roughness={0.38} clearcoat={0.7} />;
const Combine: React.FC<{ spin: number }> = ({ spin }) => <group>
  {/* cuerpo, tolva de grano, cabina con vidrio, tubo de descarga */}
  <RBox s={[0.36, 0.17, 0.2]} r={0.02} p={[0, 0.16, 0]}>{red}</RBox>
  <RBox s={[0.2, 0.08, 0.18]} r={0.015} p={[-0.06, 0.285, 0]}>{red}</RBox>
  <RBox s={[0.1, 0.11, 0.12]} r={0.012} p={[0.11, 0.3, 0]}>{red}</RBox>
  <mesh position={[0.162, 0.31, 0]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.1, 0.07]} />{M.glass({ op: 0.6, col: "#cfe2ee" })}</mesh>
  <mesh position={[-0.12, 0.33, 0.08]} rotation={[0.5, 0, -0.9]}><cylinderGeometry args={[0.012, 0.012, 0.22, 12]} />{red}</mesh>
  {/* ruedas: grandes adelante, chicas atrás */}
  {[-1, 1].map((k) => <group key={k}>
    <mesh position={[0.09, 0.08, k * 0.12]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.08, 0.08, 0.05, 24]} /><meshStandardMaterial color="#1a1a1a" roughness={0.85} /></mesh>
    <mesh position={[0.09, 0.08, k * 0.148]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.004, 18]} /><meshStandardMaterial color="#d8c25a" roughness={0.5} /></mesh>
    <mesh position={[-0.13, 0.05, k * 0.1]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.045, 0.045, 0.035, 18]} /><meshStandardMaterial color="#1a1a1a" roughness={0.85} /></mesh>
  </group>)}
  {/* el cabezal ancho con la barra de corte, los dientes y el molinete amarillo */}
  <group position={[0.27, 0.07, 0]}>
    <RBox s={[0.1, 0.06, 0.46]} r={0.01}>{M.steel({ col: "#a9adb0" })}</RBox>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[0.06, -0.02, -0.21 + i * 0.038]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.01, 0.05, 6]} />{M.steel({ col: "#c9ced3" })}</mesh>)}
    <group position={[0.02, 0.07, 0]} rotation={[spin, 0, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 0.46, 8]} /><meshStandardMaterial color="#d8c25a" /></mesh>
      {[0, 1, 2, 3, 4].map((j) => <RBox key={j} s={[0.006, 0.006, 0.44]} r={0.002} p={[0.045 * Math.cos(j * 1.256), 0.045 * Math.sin(j * 1.256), 0]}><meshStandardMaterial color="#d8c25a" /></RBox>)}
    </group>
  </group>
</group>;
export const HCombine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#2b3550" warm={0.9} key1={[-1.6, 2.4, 1.0]}
  cam={{ at: [0.15, 0.25, -0.15], at1: [0.45, 0.22, -0.2], az: [0.25, 0.4], el: [0.24, 0.19], r: [3.4, 2.9], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="11 DAYS · NOT A DIME" col={AMB} size={42} />}>{(tt) => {
  const x = lerp(-2.6, 0.55, eio(tt, 0.2, 4.6)), days = Math.min(11, Math.floor(cl((tt - 1.0) / 3.4) * 11.99));
  return <>
    <Sky />
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[8, 5]} /><meshStandardMaterial color="#6e5a3a" roughness={0.95} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.002, 0.08]}><planeGeometry args={[8, 0.4]} /><meshStandardMaterial color="#b4a383" roughness={0.95} /></mesh>
    {/* el maizal seco de octubre: fila por fila cae con rebote cuando pasa la cosechadora */}
    {ROWS.map(([cx, cz], i) => { const u = (x - 0.25 - cx) / 0.22, cut = u <= 0 ? 0 : u >= 1 ? 1 : u, fall = -1.4 * cut + 0.12 * Math.sin(PI * cl(u - 1) * 3) * Math.exp(-2 * cl(u - 1));
      return <group key={i} position={[cx, 0, cz]} rotation={[0, 0, fall]}>
      <mesh position={[0, 0.22, 0]} castShadow><cylinderGeometry args={[0.007, 0.01, 0.44, 6]} /><meshStandardMaterial color="#b39a62" roughness={0.9} /></mesh>
      <mesh position={[0.014, 0.27, 0]} rotation={[0, 0, -0.4]}><cylinderGeometry args={[0.014, 0.01, 0.08, 8]} /><meshStandardMaterial color="#d6b35a" roughness={0.7} /></mesh>
      {[0, 1, 2].map((j) => <mesh key={j} position={[0, 0.13 + j * 0.1, 0]} rotation={[0, j * 2.1, 0.9]}><planeGeometry args={[0.014, 0.13]} /><meshStandardMaterial color="#a88d58" roughness={0.9} side={THREE.DoubleSide} /></mesh>)}
    </group>; })}
    {/* la camioneta de Lyle con el carro y la cosechadora roja encima */}
    <group position={[x, 0, 0.08]}>
      <Pickup p={[0.5, 0, 0]} col="#56708a" wheel={-x * 18} />
      <RBox s={[0.04, 0.02, 0.02]} r={0.004} p={[0.17, 0.09, 0]}>{M.steel({ col: "#555" })}</RBox>
      <RBox s={[0.7, 0.03, 0.34]} r={0.006} p={[-0.2, 0.1, 0]}>{M.steel({ col: "#7c7f82" })}</RBox>
      {[-0.4, -0.12].map((wx) => [-1, 1].map((k) => <mesh key={wx + "" + k} position={[wx, 0.05, k * 0.18]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.04, 18]} /><meshStandardMaterial color="#1a1a1a" roughness={0.8} /></mesh>))}
      <group position={[-0.25, 0.115, 0]} scale={1.2}><Combine spin={x * 7} /></group>
    </group>
    {/* el contador de días, grande y al frente */}
    <group position={[-1.05, 0.26, 0.35]} rotation={[0, 0.35, 0]} scale={0.8}>
      <RBox s={[0.025, 0.32, 0.025]} r={0.004} p={[0, -0.16, -0.02]}>{M.wood({ base: [110, 76, 44] })}</RBox>
      <RBox s={[0.3, 0.17, 0.03]} r={0.012} p={[0, 0.04, -0.02]}>{M.wood({ base: [176, 132, 82] })}</RBox>
      <DigitDrum v={Math.floor(days / 10)} p={[-0.055, 0.04, 0.0]} r={0.055} w={0.09} />
      <DigitDrum v={days % 10} p={[0.055, 0.04, 0.0]} r={0.055} w={0.09} />
    </group>
  </>;
}}</Scene3D>;

// ---- 6:15 · FÓSFORO SECO: el fósforo raspa la caja y estalla en llama; llega el vaso de agua de Ruth y la llama se achica ----
export const HDrymatch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.28} bg="#1a120c" key1={[-0.8, 2.0, 1.2]}
  cam={{ at: [0.03, 0.8, 0.02], at1: [0.05, 0.81, 0.02], az: [0.35, 0.1], el: [0.28, 0.22], r: [0.6, 0.46], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={1010} txt="A TEMPER LIKE A DRY MATCH" col={AMB} size={40} />}>{(tt) => {
  const strike = eio(tt, 0.4, 1.0), flare = tt > 1.0 ? phys(tt, 1.0, 9, 0.25) : 0, water = phys(tt, 2.4, 7, 0.5), calm = eio(tt, 3.0, 4.0);
  const fl = Math.max(0, flare) * (1 - 0.7 * calm), wob = 1 + 0.1 * Math.sin(tt * 2 * PI * 1.6);
  const box = tex.text("mbox", 512, 256, (g) => { g.fillStyle = "#e8d6a8"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#b52d23"; g.fillRect(0, 70, 512, 116); g.fillStyle = "#f6e7c2"; g.font = "900 64px Georgia"; g.textAlign = "center"; g.fillText("SAFETY", 256, 150); });
  const mx = lerp(-0.08, 0.05, strike), my = 0.81 + 0.02 * strike;
  return <>
    <RBox s={[1.2, 0.04, 0.8]} r={0.01} p={[0, 0.74, 0]}>{M.wood({ base: [96, 60, 34] })}</RBox>
    {/* la caja de fósforos con su raspador */}
    <group position={[-0.03, 0.775, 0.02]} rotation={[0, 0.25, 0]}>
      <mesh castShadow><boxGeometry args={[0.11, 0.03, 0.07]} /><meshStandardMaterial map={box} roughness={0.8} /></mesh>
      <mesh position={[0, 0, 0.0352]}><planeGeometry args={[0.1, 0.022]} /><meshStandardMaterial color="#5a3424" roughness={1} /></mesh>
    </group>
    {/* chispas del raspón */}
    {Array.from({ length: 10 }, (_, i) => { const u = tt - 0.95 - rn(i, 2) * 0.1; if (u < 0 || u > 0.5) return null; return <mesh key={"k" + i} position={[0.03 + 0.15 * u * rn(i, 3), 0.8 + 0.12 * u - 0.3 * u * u, 0.06 + 0.1 * u * (rn(i, 4) - 0.5)]}><sphereGeometry args={[0.0025, 6, 4]} />{M.glow({ col: "#ffd27a", op: 1 - u * 2 })}</mesh>; })}
    {/* el fósforo */}
    <group position={[mx, my, 0.06]} rotation={[0, 0.25, 0.25 + 0.3 * strike]}>
      <mesh position={[-0.03, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0022, 0.0022, 0.06, 6]} /><meshStandardMaterial color={new THREE.Color("#e2c48c").lerp(new THREE.Color("#2a1a10"), cl(fl * 0.6))} roughness={0.8} /></mesh>
      <mesh position={[0.002, 0, 0]}><sphereGeometry args={[0.0048, 10, 8]} /><meshStandardMaterial color={tt > 1.0 ? "#2a1a10" : "#b8322a"} roughness={0.6} /></mesh>
      {/* la llama en gota: base azulada, cuerpo amarillo-naranja (parpadeo lento, < 2 Hz) */}
      <group position={[0.006, 0.004, 0]} rotation={[0, 0, -0.55]} scale={[Math.max(0.02, 1.9 * fl), Math.max(0.02, 1.9 * fl * wob), Math.max(0.02, 1.9 * fl)]} visible={fl > 0.02}>
        <mesh position={[0, 0.006, 0]}><sphereGeometry args={[0.007, 14, 10]} />{M.glow({ col: "#7fa6ff", op: 0.55 })}</mesh>
        <mesh position={[0, 0.022, 0]}><coneGeometry args={[0.009, 0.034, 18]} />{M.glow({ col: "#ffb347", op: 0.9 })}</mesh>
        <mesh position={[0, 0.016, 0]}><coneGeometry args={[0.005, 0.02, 14]} />{M.glow({ col: "#fff1c4", op: 0.95 })}</mesh>
      </group>
    </group>
    <pointLight position={[0.06, 0.88, 0.1]} intensity={0.45 * fl} distance={0.8} decay={2} color="#ffb060" />
    {/* el humo gris cuando se calma */}
    {Array.from({ length: 10 }, (_, i) => { const u = tt - 3.2 - i * 0.09; if (u < 0 || u > 1.4) return null; return <mesh key={"h" + i} position={[mx + 0.02 + 0.02 * Math.sin(u * 3 + i), my + 0.03 + 0.12 * u, 0.06]}><sphereGeometry args={[0.006 + 0.01 * u, 10, 8]} /><meshBasicMaterial color="#9a948c" transparent opacity={0.3 * (1 - u / 1.4)} depthWrite={false} /></mesh>; })}
    {/* el vaso de agua transparente que pone Ruth */}
    <group position={[lerp(0.5, 0.14, cl(water)), 0.76, -0.04]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.032, 0.028, 0.12, 32, 1, true]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.03, 0.027, 0.09, 32]} /><meshPhysicalMaterial color="#9fd0ea" roughness={0.05} transmission={0.6} transparent opacity={0.45} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 6:26 · LA VENTANA DEL TAMBO: la llave inglesa vuela girando; el vidrio de la casita blanca se raja en estrella ----
const siding = () => tex.text("siding", 256, 256, (g) => { g.fillStyle = "#ece8de"; g.fillRect(0, 0, 256, 256); for (let k = 0; k < 16; k++) { g.fillStyle = "rgba(120,110,95,.35)"; g.fillRect(0, k * 16 + 13, 256, 3); } });
export const HMilkhouse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#2b3550" warm={0.85}
  cam={{ at: [0.05, 0.55, -0.3], at1: [0.08, 0.6, -0.3], az: [0.42, 0.18], el: [0.14, 0.1], r: [1.9, 1.35], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={1010} txt="FOUR FEET FROM THE WINDOW" col={AMB} size={40} />}>{(tt) => {
  const fly = eio(tt, 0.3, 1.5), hit = tt > 1.5, cr = hit ? cl((tt - 1.5) / 0.35) : 0;
  const wx = lerp(1.5, 0.1, fly), wy = 0.5 + 0.4 * Math.sin(PI * fly), wz = lerp(0.7, -0.2, fly);
  return <>
    <Sky />
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[8, 5]} /><meshStandardMaterial color="#6f6447" roughness={0.95} /></mesh>
    {/* el tambo: casita blanca de tablas, techo rojo a dos aguas con alero, ventana de cuatro paños */}
    <group position={[0, 0, -0.6]}>
      <RBox s={[1.0, 0.8, 0.7]} r={0.01} p={[0, 0.4, 0]}><meshStandardMaterial map={siding()} roughness={0.85} /></RBox>
      <mesh position={[0, 0.8, 0]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.707, 0.707, 0.68]} /><meshStandardMaterial map={siding()} roughness={0.85} /></mesh>
      {[-1, 1].map((k) => <RBox key={k} s={[0.8, 0.035, 0.82]} r={0.008} p={[k * 0.27, 1.07, 0]} rot={[0, 0, -k * PI / 4]}><meshStandardMaterial color="#8a2a22" roughness={0.8} /></RBox>)}
      <RBox s={[0.46, 0.38, 0.04]} r={0.006} p={[0.07, 0.48, 0.36]}>{M.matte({ col: "#f6f3ec" })}</RBox>
      <mesh position={[0.07, 0.48, 0.382]}><planeGeometry args={[0.4, 0.32]} /><meshStandardMaterial color="#26343c" metalness={0.3} roughness={0.08} /></mesh>
      <RBox s={[0.018, 0.32, 0.02]} r={0.003} p={[0.07, 0.48, 0.385]}>{M.matte({ col: "#f6f3ec" })}</RBox>
      <RBox s={[0.4, 0.018, 0.02]} r={0.003} p={[0.07, 0.48, 0.385]}>{M.matte({ col: "#f6f3ec" })}</RBox>
      <RBox s={[0.16, 0.5, 0.03]} r={0.006} p={[-0.32, 0.25, 0.36]}><meshStandardMaterial color="#7a5a3c" roughness={0.8} /></RBox>
      {/* la estrella de la rajadura en el paño de arriba a la derecha */}
      {Array.from({ length: 13 }, (_, i) => { const a = (i / 13) * PI * 2 + 0.4 * rn(i, 3), L = (0.05 + 0.08 * rn(i, 2)) * cr; return <mesh key={i} visible={cr > 0} position={[0.17 + Math.cos(a) * L / 2, 0.56 + Math.sin(a) * L / 2, 0.388]} rotation={[0, 0, a]}><planeGeometry args={[Math.max(0.002, L), 0.005]} /><meshBasicMaterial color="#f4fbff" transparent opacity={0.95} /></mesh>; })}
      <mesh visible={cr > 0} position={[0.17, 0.56, 0.389]}><circleGeometry args={[0.012 * cr + 0.001, 16]} /><meshBasicMaterial color="#f4fbff" transparent opacity={0.9} /></mesh>
      {Array.from({ length: 10 }, (_, i) => { const u = hit ? tt - 1.5 : 0; if (!hit || u > 1.2) return null; return <mesh key={"s" + i} position={[0.17 + (rn(i, 4) - 0.5) * 0.1, Math.max(0.01, 0.56 - 0.9 * u * u * (0.6 + rn(i, 5))), 0.4 + 0.25 * u * rn(i, 6)]} rotation={[u * 6 * rn(i, 7), u * 5, 0]}><planeGeometry args={[0.022, 0.016]} />{M.glass({ op: 0.7 })}</mesh>; })}
    </group>
    {/* la llave inglesa grande que gira en el aire de derecha a izquierda */}
    <group visible={tt < 1.52} position={[wx, wy, wz]} rotation={[0.2, 0.3, tt * 8]} scale={1.6}>
      <RBox s={[0.22, 0.026, 0.014]} r={0.005}>{M.steel()}</RBox>
      <RBox s={[0.05, 0.06, 0.016]} r={0.008} p={[0.11, 0.014, 0]}>{M.steel()}</RBox>
      <RBox s={[0.02, 0.03, 0.016]} r={0.004} p={[0.12, 0.05, 0]}>{M.steel()}</RBox>
    </group>
    <group visible={hit} position={[0.25, 0.015, -0.12]} rotation={[PI / 2, 0, 0.8]} scale={1.6}><RBox s={[0.22, 0.026, 0.014]} r={0.005}>{M.steel()}</RBox><RBox s={[0.05, 0.06, 0.016]} r={0.008} p={[0.11, 0.014, 0]}>{M.steel()}</RBox></group>
    {/* la marca de los cuatro pies: dónde estaba parado el hermanito */}
    <mesh rotation={[-PI / 2, 0, 0]} position={[0.75, 0.003, 0.05]}><ringGeometry args={[0.07, 0.09, 40]} />{M.glow({ col: "#ffcf7a", op: 0.8 * eio(tt, 2.2, 3.0) })}</mesh>
    <mesh rotation={[-PI / 2, 0, 0.35]} position={[0.45, 0.003, -0.07]}><planeGeometry args={[0.6 * eio(tt, 2.4, 3.2) + 0.001, 0.01]} />{M.glow({ col: "#ffcf7a", op: 0.7 })}</mesh>
  </>;
}}</Scene3D>;

// ---- 7:17 · LAS LLAVES SE QUEDAN EN EL GANCHO: el llavero sale del tablero, duda en el aire y vuelve a colgarse ----
export const HCarkeys: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="wood" warm={0.8} key1={[-0.6, 1.8, 1.6]}
  cam={{ at: [0, 1.1, -1.5], at1: [0.0, 1.09, -1.5], az: [0.18, -0.1], el: [0.05, 0.02], r: [0.7, 0.52], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.9} x={960} y={1010} txt="NEVER LET THEM DRIVE" col={AMB} size={42} />}>{(tt) => {
  const out = eio(tt, 0.4, 1.3) * (1 - eio(tt, 2.6, 3.3)), dud = Math.sin((tt - 1.3) * 5) * 0.25 * cl((tt - 1.3) / 0.3) * (1 - cl((tt - 2.6) / 0.3));
  const sw = Math.sin((tt - 3.3) * 6) * 0.3 * Math.exp(-Math.max(0, tt - 3.3) * 1.4) * (tt > 3.3 ? 1 : 0);
  const board = tex.text("pegb2", 512, 384, (g) => { g.fillStyle = "#8a6a46"; g.fillRect(0, 0, 512, 384); g.fillStyle = "#3b2a1a"; for (let r = 0; r < 12; r++) for (let c = 0; c < 16; c++) { g.beginPath(); g.arc(16 + c * 32, 16 + r * 32, 3.5, 0, 6.3); g.fill(); }
    // el contorno pintado del auto, como el de las herramientas
    g.strokeStyle = "#f3ead6"; g.lineWidth = 7; g.beginPath(); g.moveTo(70, 300); g.lineTo(70, 250); g.lineTo(150, 240); g.lineTo(200, 190); g.lineTo(320, 190); g.lineTo(370, 240); g.lineTo(440, 250); g.lineTo(440, 300); g.closePath(); g.stroke();
    g.beginPath(); g.arc(150, 302, 26, 0, 6.3); g.stroke(); g.beginPath(); g.arc(360, 302, 26, 0, 6.3); g.stroke(); });
  const tag = tex.text("cartag", 128, 96, (g) => { g.fillStyle = "#c9a14a"; g.fillRect(0, 0, 128, 96); g.fillStyle = "#2a1a0e"; g.font = "900 52px Georgia"; g.textAlign = "center"; g.fillText("CAR", 64, 66); });
  return <>
    <mesh position={[0, 1.1, -1.58]}><planeGeometry args={[0.8, 0.6]} /><meshStandardMaterial map={board} roughness={0.8} /></mesh>
    {/* el gancho dorado, bien a la vista */}
    <mesh position={[0, 1.27, -1.53]} rotation={[PI / 2.3, 0, 0]}><cylinderGeometry args={[0.007, 0.007, 0.09, 12]} />{M.brass({ em: "#7a5a20", emI: 0.3 })}</mesh>
    <mesh position={[0, 1.275, -1.485]}><sphereGeometry args={[0.01, 12, 10]} />{M.brass()}</mesh>
    {/* el llavero grande: argolla plateada, llave del auto y chapita «CAR» */}
    <group position={[0, 1.27 - 0.06 * out, -1.5 + 0.28 * out]} rotation={[sw + 0.15 * dud, dud, sw * 0.5]}>
      <mesh position={[0, -0.04, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.04, 0.0045, 10, 40]} />{M.chrome()}</mesh>
      <group position={[-0.012, -0.13, 0.006]} rotation={[0, 0, 0.15]}>
        <RBox s={[0.06, 0.07, 0.01]} r={0.012}><meshStandardMaterial color="#141414" roughness={0.4} /></RBox>
        <RBox s={[0.022, 0.1, 0.004]} r={0.002} p={[0, -0.08, 0]}>{M.brass()}</RBox>
        {[0, 1, 2, 3].map((i) => <RBox key={i} s={[0.01, 0.01, 0.004]} r={0.001} p={[0.014, -0.05 - i * 0.02, 0]}>{M.brass()}</RBox>)}
      </group>
      <group position={[0.035, -0.11, -0.004]} rotation={[0, 0, -0.3]}><mesh><planeGeometry args={[0.06, 0.045]} /><meshStandardMaterial map={tag} roughness={0.6} metalness={0.4} side={THREE.DoubleSide} /></mesh></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 7:53 · LA BIBLIA DE CANTOS DORADOS: el libro gira mostrando el dorado de las hojas y se abre en el «Family Record» ----
const NAMES = ["Family Record", "BIRTHS", "Ruth Ann  1911", "Loretta  1945", "MARRIAGES", "Ruth & Walter 1934", "DEATHS", "____________"];
export const HGoldbible: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.85} key1={[1.2, 1.8, 0.4]}
  cam={{ at: [0.0, 0.8, 0.03], at1: [-0.06, 0.8, 0.03], az: [1.05, 0.15], el: [0.22, 0.85], r: [0.7, 0.68], fov: 30 }}>{(tt) => {
  const spin = eio(tt, 0.1, 2.4), open = eio(tt, 2.6, 3.8), n = Math.min(NAMES.length, 2 + Math.floor(cl((tt - 3.8) / 1.4) * 6.99));
  const rec = paperTex("famrec" + n, [...NAMES.slice(0, n), ...Array(NAMES.length - n).fill(" ")], { w: 512, h: 680, bg: "#efe4c8", ink: "#5a2a1e", font: "italic 700" });
  const glint = ((tt * 0.55) % 1.4) - 0.2;
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.3} d={0.9} /></group>
    <group position={[0.06, 0.76, 0]} rotation={[0, lerp(-PI * 1.7, 0, spin), 0]}>
      <Book w={0.26} h={0.34} th={0.085} col="#2e1610" open={open} page={rec} />
      {/* el destello que recorre el canto dorado */}
      <mesh position={[0.124, 0.043, lerp(-0.16, 0.16, cl(glint))]} rotation={[0, PI / 2, 0]} visible={glint > 0 && glint < 1}><planeGeometry args={[0.03, 0.07]} />{M.glow({ col: "#fff2c0", op: 0.55 })}</mesh>
      {/* la cinta roja del señalador */}
      <mesh position={[0.02, 0.0, 0.176]} rotation={[0.2, 0, 0]}><planeGeometry args={[0.012, 0.09]} /><meshStandardMaterial color="#a3221c" roughness={0.6} side={THREE.DoubleSide} /></mesh>
    </group>
    <pointLight position={[0.4, 0.95, 0.25]} intensity={0.9} distance={1.4} color="#ffe2a8" />
    <Mug p={[0.42, 0.76, 0.25]} col="#d9cdb0" />
  </>;
}}</Scene3D>;

// ---- 8:41 · EL PAGARÉ SIN FIRMAR: la lapicera baja a la línea del co-firmante, se frena a un dedo y se va; la línea queda en blanco ----
export const HCosign: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" warm={0.75}
  cam={{ at: [0.02, 0.77, 0.05], at1: [0.03, 0.77, 0.08], az: [0.2, -0.05], el: [1.0, 1.1], r: [0.7, 0.62], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={1010} txt="HE DIDN'T SIGN" col={AMB} size={44} />}>{(tt) => {
  const down = eio(tt, 0.4, 2.0), stop = eio(tt, 2.4, 3.4), y = 0.795 + 0.03 * (1 - down) + 0.05 * stop, x = lerp(0.36, 0.17, down) + 0.3 * stop;
  const note = paperTex("note61", ["PROMISSORY NOTE", "$1,200.00", "BORROWER ________", "CO-SIGNER ________"], { w: 640, h: 820, bg: "#f2ecdc", ink: "#2a2420", font: "700" });
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.3} d={0.9} /></group>
    <mesh position={[0, 0.7615, 0]} rotation={[-PI / 2, 0, 0.05]} receiveShadow><planeGeometry args={[0.26, 0.33]} /><meshStandardMaterial map={note} roughness={0.85} /></mesh>
    {/* la línea del co-firmante se ilumina cuando la lapicera se aleja */}
    <mesh position={[0.02, 0.7625, 0.11]} rotation={[-PI / 2, 0, 0.05]}><planeGeometry args={[0.2, 0.016]} />{M.glow({ col: "#ffcf7a", op: 0.25 + 0.5 * Math.max(down, stop) })}</mesh>
    {/* el recuadro rojo de lápiz que se dibuja alrededor de la línea vacía */}
    {[[0, 0.014, 0.22, 0.004], [0, -0.014, 0.22, 0.004], [-0.11, 0, 0.004, 0.032], [0.11, 0, 0.004, 0.032]].map(([dx, dz, w, d], i) => { const k = eio(tt, 2.9 + i * 0.15, 3.15 + i * 0.15); return <mesh key={"rb" + i} visible={k > 0.01} position={[0.02 + dx * Math.cos(0.05), 0.763, 0.11 + dz]} rotation={[-PI / 2, 0, 0.05]} scale={[i < 2 ? Math.max(0.01, k) : 1, i < 2 ? 1 : Math.max(0.01, k), 1]}><planeGeometry args={[w, d]} /><meshBasicMaterial color="#c0261c" /></mesh>; })}
    {/* la lapicera fuente */}
    <group position={[x, y, 0.15]} rotation={[0.9, 0.3, 0.5]} scale={1.7} visible={stop < 0.98}>
      <mesh><cylinderGeometry args={[0.007, 0.006, 0.13, 16]} /><meshPhysicalMaterial color="#141414" roughness={0.2} clearcoat={1} /></mesh>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.0075, 0.0075, 0.006, 16]} />{M.brass()}</mesh>
      <mesh position={[0, -0.075, 0]}><coneGeometry args={[0.006, 0.02, 12]} />{M.brass()}</mesh>
    </group>
    {/* la mano de Ruth sobre el brazo de Ralph: la manga a cuadros entra desde el costado */}
    <group position={[lerp(0.75, 0.4, eio(tt, 1.8, 2.6)), 0.8, 0.22]} rotation={[0, 0.2, 0]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.045, 0.05, 0.4, 20]} /><meshStandardMaterial map={tex.text("flan", 128, 128, (g) => { g.fillStyle = "#3d5a7a"; g.fillRect(0, 0, 128, 128); g.fillStyle = "rgba(200,60,50,.6)"; for (let i = 0; i < 4; i++) { g.fillRect(i * 32, 0, 10, 128); g.fillRect(0, i * 32, 128, 10); } })} roughness={0.9} /></mesh>
    </group>
    <group position={[lerp(-0.7, -0.36, eio(tt, 1.9, 2.7)), 0.82, 0.24]} rotation={[0, -0.25, 0]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.04, 0.045, 0.36, 20]} /><meshStandardMaterial color="#b9a7c9" roughness={0.9} /></mesh>
    </group>
  </>;
}}</Scene3D>;
