// ohf30a · componentes únicos 15-21: caño caliente y radiador frío (la compuerta cerrada), la empaquetadura en corte, el octavo de vuelta,
// la cera que empuja el pin, el pulgar que lo destraba, el tablero de 4 con 2 tildados, aire vs barro en espejo
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { CShadow, M, RBox, Scene3D, cl, eio, hexNutG, lerp, phys, rn, tex } from "./h3d";
import { AngleValve, FlowPath, Hand, IronRad, Pipe, RadH, Tape, Wheel } from "./okit";

const PI = Math.PI;
const flowDots = (tt: number, n: number, a: number[], b: number[], k: number, stop = 1, col = "#ffb070") => Array.from({ length: n }, (_, i) => {
  const u = Math.min(stop, (tt * 0.5 + i / n) % 1);
  return <mesh key={i} position={[lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)]} scale={Math.max(0.001, k)}><sphereGeometry args={[0.009, 8, 8]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>;
});

// ---- 10:30 · EL CAÑO QUEMA, EL RADIADOR NO: el frente de calor corre por el caño de cobre del zócalo hasta la válvula cerrada y
// ahí se frena; la mano se acerca al caño y salta para atrás; después toca el radiador: frío ----
const Haze: React.FC<{ tt: number; x0: number; x1: number; y: number; z: number; k: number }> = ({ tt, x0, x1, y, z, k }) => <group position={[(x0 + x1) / 2, y, z]} visible={k > 0.01}>
  {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.02 * Math.sin(tt * 2.2 + i * 1.7), ((tt * 0.07 + i * 0.05) % 0.2), 0.004 * i]} scale={[1 + 0.06 * Math.sin(tt * 3 + i), 1, 1]}>
    <planeGeometry args={[x1 - x0, 0.05]} /><meshBasicMaterial color="#ffb070" transparent opacity={0.07 * k} depthWrite={false} side={THREE.DoubleSide} /></mesh>)}
</group>;
export const HHotPipe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="oak" wall="plaster" wallZ={-0.16} bg="#1b1815" key1={[-1.0, 1.4, 1.1]} warm={0.85}
  cam={{ at: [-0.22, 0.12, -0.02], at1: [-0.02, 0.2, -0.02], az: [-0.42, -0.1], el: [0.38, 0.24], r: [0.7, 1.0], fov: 32 }}>{(tt) => {
  const N = 12, x0 = -0.72, f = eio(tt, 0.2, 2.2) * 1.05, hot = (i: number) => cl(f * N - i);
  const reach = eio(tt, 2.3, 2.9), yank = phys(tt, 3.05, 12, 0.45), toRad = eio(tt, 3.7, 4.5), flash = cl((tt - 3.0) * 4) * (1 - eio(tt, 3.3, 3.9));
  const hx = lerp(-0.3, 0.26, toRad), hy = toRad > 0 ? lerp(0.32, 0.3, toRad) : lerp(0.34, 0.045, reach) + 0.28 * cl(yank), bend = 0.25 * cl(yank) * (1 - toRad);
  const n = 9, w = 0.05, L = n * w * 1.12, frost = eio(tt, 4.4, 5.4);
  return <>
    <IronRad n={n} w={w} h={0.42} p={[0.1 + L / 2 + 0.01, 0, -0.02]} valve={false} heat={(i, y) => 0.06 + 0.04 * y} />
    <CShadow p={[0.1 + L / 2, 0, -0.02]} s={[L + 0.1, 0.14]} o={0.6} />
    <AngleValve p={[0, 0.087, -0.02]} pin={0} />
    {/* caño de cobre por el zócalo: el frente de calor corre de izquierda a derecha y se frena en la válvula */}
    {Array.from({ length: N }, (_, i) => <Pipe key={i} a={[x0 + (i * -x0) / N, 0.014, -0.02]} b={[x0 + ((i + 1) * -x0) / N + 0.001, 0.014, -0.02]} r={0.0135} col="#b87333" em="#ff4a08" emI={1.1 * hot(i)} />)}
    <Pipe a={[0, 0.014, -0.02]} b={[0, 0.06, -0.02]} r={0.0142} col="#b87333" em="#ff4a08" emI={1.1 * cl(f * N - N + 0.5)} />
    <mesh position={[0, 0.014, -0.02]}><sphereGeometry args={[0.016, 16, 12]} /><meshStandardMaterial color="#b87333" metalness={0.85} roughness={0.32} emissive="#ff4a08" emissiveIntensity={1.1 * cl(f * N - N + 0.5)} /></mesh>
    {[0.15, 0.4].map((k, i) => <RBox key={i} s={[0.012, 0.03, 0.034]} p={[x0 + k * -x0 * 1.3, 0.016, -0.02]} r={0.003}>{M.steel({ col: "#8c9096" })}</RBox>)}
    <Haze tt={tt} x0={x0} x1={0} y={0.05} z={-0.02} k={cl(f)} />
    <pointLight position={[-0.3, 0.06, 0.06]} color="#ff7a2a" intensity={0.15 * cl(f)} distance={0.5} decay={2} />
    {/* destello rojo donde la mano casi toca */}
    <mesh position={[-0.3, 0.014, 0.0]} rotation={[-PI / 2, 0, 0]} visible={flash > 0.01}><ringGeometry args={[0.02 + 0.03 * flash, 0.028 + 0.035 * flash, 32]} /><meshBasicMaterial color="#ff3a1a" transparent opacity={0.8 * flash} toneMapped={false} depthWrite={false} /></mesh>
    {/* escarcha azul donde la mano toca el radiador */}
    <mesh position={[0.26, 0.3, 0.012]} visible={frost > 0.01}><ringGeometry args={[0.015, 0.02 + 0.03 * frost, 32]} /><meshBasicMaterial color="#7cc0ff" transparent opacity={0.7 * frost} toneMapped={false} depthWrite={false} /></mesh>
    <Hand p={[hx, hy, 0.035 * toRad]} rot={[0.2, 0.3, 0.12]} s={1.0} bend={bend} />
    <Tape txt="PIPE HOT" col="#b3261e" p={[-0.2, 0.003, 0.08]} rot={[-PI / 2, 0, 0.03]} w={0.24} k={phys(tt, 1.2, 8, 0.45)} rev={cl((tt - 1.2) / 0.5)} />
    <Tape txt="RADIATOR COLD" col="#1f4f9a" p={[0.3, 0.55, -0.155]} rot={[0, 0, -0.02]} w={0.26} k={phys(tt, 4.0, 8, 0.45)} rev={cl((tt - 4.0) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- 11:10 · LA EMPAQUETADURA: la válvula vieja del radiador abierta en corte; los anillos alrededor del vástago, la tuerca
// encima, la gota que asoma ----
export const HPacking: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="oak" wall="paper" wallZ={-0.3} bg="#191714" key1={[-0.7, 1.4, 1.3]} warm={0.85}
  cam={{ at: [0, 0.27, 0], az: [0.45, -0.25], el: [0.15, 0.22], r: [0.8, 0.68], fov: 30 }}>{(tt) => {
  const open = eio(tt, 0.3, 1.4), ring = (i: number) => phys(tt, 1.2 + i * 0.25, 9, 0.45), bead = eio(tt, 3.2, 4.4);
  const n = 6, w = 0.05, L = n * w * 1.12;
  return <>
    <IronRad n={n} w={w} h={0.5} p={[0.26 + L / 2, 0, -0.12]} valve={false} heat={(i, y) => 0.2 + 0.1 * y} />
    <CShadow p={[0.26 + L / 2, 0, -0.12]} s={[L + 0.1, 0.16]} o={0.6} />
    <CShadow p={[0, 0, 0]} s={[0.16, 0.16]} o={0.6} />
    <Pipe a={[0, 0, 0]} b={[0, 0.12, 0]} r={0.016} col="#b87333" />
    <Tape txt="PACKING NUT" p={[0.15, 0.4, -0.295]} rot={[0, 0, 0.02]} w={0.2} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.6)} />
    <Pipe a={[0.06, 0.16, 0]} b={[0.2, 0.16, 0]} r={0.015} col="#b87333" />
    <Pipe a={[0.2, 0.16, 0]} b={[0.26, 0.16, -0.12]} r={0.015} col="#b87333" />
    <group position={[0, 0.12, 0]}>
    {/* mitad del cuerpo de bronce que se abre como un libro */}
    <group rotation={[0, -open * 1.1, 0]} position={[-0.05, 0, 0]}><mesh position={[0.05, 0.08, 0]}><cylinderGeometry args={[0.07, 0.08, 0.16, 32, 1, false, 0, PI]} />{M.brass({ col: "#a87c30" })}</mesh></group>
    <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.07, 0.08, 0.16, 32, 1, false, PI, PI]} />{M.brass({ col: "#a87c30" })}</mesh>
    <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.009, 0.009, 0.34, 14]} />{M.steel()}</mesh>
    {/* los anillos de empaque, uno por uno */}
    {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0, 0.12 + i * 0.016, 0]} rotation={[PI / 2, 0, 0]} scale={Math.max(0.001, cl(ring(i)))} visible={ring(i) > 0.01}><torusGeometry args={[0.022, 0.0075, 10, 28]} /><meshStandardMaterial color="#2b2622" roughness={0.9} /></mesh>)}
    {/* la tuerca del empaque GIRA (y baja un pelo) y una flecha curva marca el giro */}
    <mesh position={[0, 0.2 - 0.008 * eio(tt, 3.0, 5.0), 0]} rotation={[0, eio(tt, 3.0, 5.0) * PI * 1.5, 0]} geometry={hexNutG(0.04, 0.03, 0.012)} castShadow>{M.brass()}</mesh>
    <mesh position={[0, 0.215, 0]} rotation={[PI / 2, 0, 0]} visible={tt > 3.0}><torusGeometry args={[0.062, 0.0055, 8, 48, Math.max(0.01, eio(tt, 3.0, 5.0) * PI * 1.5)]} /><meshStandardMaterial color="#e8a33a" emissive="#e8a33a" emissiveIntensity={0.6} roughness={0.5} /></mesh>
    <Wheel p={[0, 0.34, 0]} r={0.06} />
    {/* la gota en el vástago */}
    <mesh position={[0.012, 0.225 - bead * 0.01, 0.006]} scale={[Math.max(0.001, bead), Math.max(0.001, bead * 1.3), Math.max(0.001, bead)]} visible={bead > 0.01}><sphereGeometry args={[0.008, 12, 10]} />{M.water({ op: 0.85 })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 11:45 · UN OCTAVO DE VUELTA: la llave fija sobre la tuerca, un arco de 45° se dibuja y la gota deja de crecer ----
export const HEighth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="oak" wall="plaster" wallZ={-0.3} bg="#1b1815" key1={[-0.6, 1.2, 1.3]}
  cam={{ at: [0.04, 0.12, 0.08], at1: [0.06, 0.12, 0.08], az: [-0.3, 0.15], el: [0.78, 0.66], r: [1.0, 0.9], fov: 32 }}>{(tt) => {
  const inW = phys(tt, 0.3, 7, 0.5), turn = eio(tt, 1.8, 3.4), arc = cl((tt - 1.8) / 1.6), bead = 1 - eio(tt, 3.2, 4.2), glow = eio(tt, 3.4, 4.0) * (1 - 0.25 * eio(tt, 5.0, 6.0));
  const NY = 0.15;
  return <>
    {/* la válvula de verdad: caño de cobre que sale del piso, cuerpo de bronce, salida lateral al radiador */}
    <CShadow p={[0, 0, 0]} s={[0.2, 0.2]} o={0.6} />
    <Pipe a={[0, 0, 0]} b={[0, 0.07, 0]} r={0.016} col="#b87333" />
    <mesh position={[0, 0.09, 0]} castShadow><sphereGeometry args={[0.045, 28, 20]} />{M.brass({ col: "#a87c30" })}</mesh>
    <Pipe a={[-0.03, 0.09, 0]} b={[-0.6, 0.09, 0]} r={0.016} col="#b87333" />
    <mesh position={[0, 0.125, 0]}><cylinderGeometry args={[0.03, 0.036, 0.03, 24]} />{M.brass({ col: "#a87c30" })}</mesh>
    <mesh position={[0, NY + 0.07, 0]}><cylinderGeometry args={[0.008, 0.008, 0.14, 12]} />{M.steel()}</mesh>
    <Wheel p={[0, NY + 0.13, 0]} r={0.055} />
    {/* la pista entera (gris, 8 marcas) para que se lea que 45° es 1/8 */}
    <mesh position={[0, NY + 0.02, 0]} rotation={[PI / 2, 0, 0]}><ringGeometry args={[0.375, 0.383, 128]} /><meshBasicMaterial color="#d9d4c8" transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[Math.cos(i * PI / 4) * 0.379, NY + 0.021, Math.sin(i * PI / 4) * 0.379]} rotation={[0, -i * PI / 4, 0]}><boxGeometry args={[0.03, 0.002, 0.006]} /><meshBasicMaterial color="#d9d4c8" transparent opacity={0.6} /></mesh>)}
    {/* el arco de 1/8 que va dibujando la punta de la llave, grueso y verde */}
    <mesh position={[0, NY + 0.022, 0]} rotation={[PI / 2, 0, 0]} visible={arc > 0.005}><ringGeometry args={[0.36, 0.41, 64, 1, 0, Math.max(0.001, arc * PI / 4)]} /><meshBasicMaterial color="#5fe08e" toneMapped={false} side={THREE.DoubleSide} /></mesh>
    <group position={[0, NY, 0]} rotation={[0, -turn * PI / 4, 0]}>
      <mesh geometry={hexNutG(0.05, 0.035, 0.013)} castShadow>{M.brass()}</mesh>
      {/* la llave fija entra de costado y abraza la tuerca */}
      <group position={[lerp(0.25, 0, cl(inW)), 0.018, 0]}>
        <RBox s={[0.3, 0.012, 0.045]} p={[0.2, 0, 0]} r={0.004}>{M.steel({ col: "#9aa1a8" })}</RBox>
        <mesh position={[0.06, 0, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.055, 0.016, 8, 24, PI * 1.4]} />{M.steel({ col: "#9aa1a8" })}</mesh>
      </group>
    </group>
    {/* la gota que deja de crecer; luz verde cuando quedó */}
    <mesh position={[0.02, NY - 0.012 - (1 - bead) * 0.0, 0.02]} scale={Math.max(0.001, bead)} visible={bead > 0.01}><sphereGeometry args={[0.009, 12, 10]} />{M.water({ op: 0.85 })}</mesh>
    <pointLight position={[0.1, NY + 0.2, 0.15]} intensity={0.18 * glow} distance={0.8} color="#7dffb0" />
    <Tape txt="1/8 TURN" col="#1f6a3a" p={[-0.22, 0.003, 0.15]} rot={[-PI / 2, 0, 0.12]} w={0.36} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- 12:05 · LA CERA EMPUJA EL PIN: el cabezal termostático en corte; la cápsula de cera se hincha con el calor y cierra el paso ----
const numTex = (() => { let c: THREE.Texture | null = null; return () => { if (c) return c; const cv = document.createElement("canvas"); cv.width = 512; cv.height = 64; const g = cv.getContext("2d")!;
  g.fillStyle = "#f6f4ee"; g.fillRect(0, 0, 512, 64); g.fillStyle = "#333"; g.font = "700 40px Arial"; g.textAlign = "center"; ["*", "1", "2", "3", "4", "5"].forEach((s, i) => g.fillText(s, 42 + i * 86, 46));
  c = new THREE.CanvasTexture(cv); c.colorSpace = THREE.SRGBColorSpace; c.wrapS = THREE.RepeatWrapping; return c; }; })();
export const HWaxPin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="oak" wall="plaster" wallZ={-0.16} bg="#1d1a17" key1={[-1.0, 1.3, 1.0]} warm={0.5}
  cam={{ at: [0.02, 0.16, 0], at1: [0.0, 0.15, 0], az: [-0.62, -0.32], el: [0.2, 0.1], r: [0.5, 0.4], fov: 30 }}>{(tt) => {
  // cuarto que se calienta → la cera se hincha y empuja el pin (cierra); se enfría → la cera se encoge pero la costra traba el pin;
  // la costra se quiebra y el pin salta: vuelve el agua caliente y el radiador se calienta
  const wax = eio(tt, 0.4, 1.7) * (1 - eio(tt, 2.0, 3.0)), crack = eio(tt, 3.55, 4.1), free = phys(tt, 3.6, 13, 0.32);
  const len = 0.035 * (1 + 0.45 * wax), bot = 0.14 - len, tip = bot - 0.02, push = Math.max(0, Math.min(1, (tip - 0.0726) / 0.011));
  const jit = tt > 2.3 && tt < 3.5 ? 0.12 * Math.max(0, Math.sin((tt - 2.3) * PI * 1.6)) ** 6 : 0;
  const pin = tt < 2.0 ? push : Math.min(push, lerp(jit, 1, cl(free)));
  const open = tt < 1.2 ? 1 : pin, flow = eio(tt, 3.7, 4.6) + (1 - eio(tt, 0.9, 1.5)) * (tt < 2 ? 1 : 0), roomW = wax;
  const n = 7, w = 0.05, L = n * w * 1.12;
  return <>
    <pointLight position={[-0.15, 0.3, 0.25]} intensity={1.6 * roomW} distance={1.2} color="#ff9a4a" />
    <IronRad n={n} w={w} h={0.42} p={[0.09 + L / 2 + 0.01, 0, -0.02]} valve={false} heat={(i, y) => 0.12 + 0.8 * cl(flow) * cl(1.3 - y - i * 0.08)} />
    <group position={[0, 0.087, -0.02]}>
      <AngleValve pin={open} crust={eio(tt, 1.9, 2.4) * (1 - 0.0 * crack)} crack={crack} />
      {/* cabezal termostático blanco, abierto en corte para ver la cápsula de cera */}
      <group rotation={[0, -1.1, 0]}>
        <mesh position={[0, 0.098, 0]}><cylinderGeometry args={[0.036, 0.036, 0.104, 40, 1, true, PI * 0.62, PI * 1.36]} /><meshPhysicalMaterial map={numTex()} roughness={0.35} clearcoat={0.4} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.151, 0]}><cylinderGeometry args={[0.036, 0.036, 0.005, 40, 1, false, PI * 0.62, PI * 1.36]} /><meshPhysicalMaterial color="#f6f4ee" roughness={0.35} clearcoat={0.4} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.028, 0.028, 0.012, 32, 1, true, PI * 0.62, PI * 1.36]} />{M.chrome({ col: "#dfe3e6", side: THREE.DoubleSide })}</mesh>
      </group>
      {/* la cápsula de cera: fuelle de bronce que se estira hacia abajo */}
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, 0.14 - (len * (i + 0.5)) / 6, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.0155, 0.0042, 10, 28]} /><meshStandardMaterial color={new THREE.Color("#c9a24a").lerp(new THREE.Color("#ff8a3a"), wax * 0.6)} metalness={0.8} roughness={0.3} emissive="#ff5a10" emissiveIntensity={0.5 * wax} /></mesh>)}
      <mesh position={[0, 0.14 - len / 2, 0]}><cylinderGeometry args={[0.012, 0.012, len, 20]} /><meshStandardMaterial color="#e8c25a" roughness={0.4} emissive="#ff6a1a" emissiveIntensity={0.6 * wax} /></mesh>
      <mesh position={[0, bot - 0.01, 0]}><cylinderGeometry args={[0.0028, 0.0028, 0.02, 10]} />{M.steel()}</mesh>
      {/* aro rojo que late (≤2 Hz) mientras el pin está trabado */}
      <mesh position={[0, 0.056, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.011, 0.0135, 40]} /><meshBasicMaterial color="#ff4a3a" transparent opacity={0.85 * cl((tt - 2.2) * 3) * (1 - crack) * (0.55 + 0.45 * Math.sin(tt * PI * 2.4))} toneMapped={false} depthWrite={false} /></mesh>
    </group>
    <CShadow p={[0, 0, -0.02]} s={[0.09, 0.06]} />
    <Tape txt="WAX PUSHES THE PIN" p={[-0.1, 0.205, -0.155]} rot={[0, 0, 0.03]} w={0.15} k={phys(tt, 0.8, 8, 0.45)} rev={cl((tt - 0.8) / 0.9)} />
  </>;
}}</Scene3D>;

// ---- 12:58 · DESTRABAR EL PIN: sin el cabezal, el dedo aprieta el pin y lo suelta; a la tercera la costra se quiebra,
// el pin sube solo, el caño se calienta y el radiador entibia de abajo hacia arriba ----
export const HPinPump: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="oak" wall="paper" wallZ={-0.13} bg="#1a1916" key1={[0.6, 1.3, 0.9]} warm={0.6}
  cam={{ at: [0.01, 0.13, 0.0], at1: [0.03, 0.12, 0], az: [0.45, 0.12], el: [0.62, 0.48], r: [0.5, 0.42], fov: 30 }}>{(tt) => {
  const P = [1.0, 1.75, 2.5], pr = (i: number) => { const x = (tt - P[i]) / 0.5; return x > 0 && x < 1 ? Math.sin(x * PI) : 0; };
  const press = Math.max(pr(0), pr(1), pr(2)), crack = eio(tt, 2.75, 3.1);
  const rel = (i: number, a: number) => tt > P[i] + 0.5 ? a * Math.exp(-(tt - P[i] - 0.5) * 3) : 0;
  const pin = tt < 3.0 ? Math.max(0, Math.max(rel(0, 0.25), rel(1, 0.5)) - press * 0.0) : cl(phys(tt, 3.0, 12, 0.35));
  const pinTop = 0.087 + 0.05 + 0.0186 + 0.011 * pin;
  const lift = eio(tt, 3.3, 4.1), come = phys(tt, 0.25, 6, 0.6), hy = pinTop + 0.006 - press * 0.012 + (1 - cl(come)) * 0.25 + lift * 0.3;
  const hot = eio(tt, 3.3, 4.2), rw = eio(tt, 3.6, 6.0);
  const n = 7, w = 0.05, L = n * w * 1.12;
  return <>
    <IronRad n={n} w={w} h={0.42} p={[0.09 + L / 2 + 0.01, 0, -0.02]} valve={false} heat={(i, y) => 0.1 + 0.85 * cl(rw * 1.6 - y - i * 0.07)} />
    <group position={[0, 0.087, -0.02]}><AngleValve pin={pin} crust={1} crack={crack} /></group>
    <Pipe a={[0, -0.002, -0.02]} b={[0, 0.05, -0.02]} r={0.0138} col="#b87333" em="#ff5a10" emI={0.9 * hot} />
    {/* el cabezal blanco desenroscado, acostado en el piso */}
    <group position={[-0.1, 0.036, 0.07]} rotation={[0, 0.7, PI / 2]}>
      <mesh castShadow><cylinderGeometry args={[0.036, 0.036, 0.1, 40]} /><meshPhysicalMaterial map={numTex()} roughness={0.35} clearcoat={0.4} /></mesh>
      <mesh position={[0, -0.056, 0]}><cylinderGeometry args={[0.028, 0.028, 0.012, 32]} />{M.chrome({ col: "#dfe3e6" })}</mesh>
    </group>
    <CShadow p={[-0.1, 0, 0.07]} s={[0.14, 0.09]} o={0.6} />
    <group position={[0.0, hy, -0.02]}><Hand rot={[-0.35, -0.5, -0.35]} s={1.05} bend={press} /></group>
    <Tape txt="PRESS · LET IT UP" p={[-0.075, 0.035, -0.125]} rot={[0, 0, 0.02]} w={0.15} k={phys(tt, 0.6, 8, 0.45)} rev={cl((tt - 0.6) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 13:41 · DOS DE CUATRO: cuatro radiadores de hierro en el pasillo, cada uno con su etiqueta colgada (AIR, VALVE, SLUDGE,
// BALANCE); la cámara los recorre; AIR y VALVE dan vuelta la etiqueta (tilde verde) y se calientan; los otros dos siguen fríos ----
const TAGS = ["AIR", "VALVE", "SLUDGE", "BALANCE"];
const tagTex = (s: string, done: boolean) => tex.text("tag" + s + done, 256, 360, (g) => {
  g.fillStyle = "#d9bf86"; g.fillRect(0, 0, 256, 360);
  for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(120,80,30,${0.06 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 360, 3, 2); }
  g.strokeStyle = "#b99a5a"; g.lineWidth = 10; g.beginPath(); g.arc(128, 46, 22, 0, 6.3); g.stroke(); g.fillStyle = "#3b2a18"; g.beginPath(); g.arc(128, 46, 12, 0, 6.3); g.fill();
  g.textAlign = "center"; g.textBaseline = "middle";
  if (done) { g.strokeStyle = "#1f7a3a"; g.lineWidth = 30; g.lineCap = "round"; g.beginPath(); g.moveTo(58, 200); g.lineTo(110, 258); g.lineTo(204, 128); g.stroke(); g.fillStyle = "#1f6a3a"; g.font = "700 46px 'Permanent Marker', cursive"; g.fillText(s, 128, 318); }
  else { g.fillStyle = "#1c2a3a"; g.font = `700 ${s.length > 5 ? 50 : 66}px 'Permanent Marker', cursive`; g.fillText(s, 128, 210); }
});
export const HTwoOf4: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="oak" wall="paper" wallZ={-0.36} bg="#191714" key1={[-0.6, 1.9, 1.3]} warm={0.85}
  cam={{ at: [-0.2, 0.26, -0.2], at1: [-0.1, 0.26, -0.18], az: [0.28, 0.0], el: [0.16, 0.2], r: [2.55, 2.45], fov: 32 }}>{(tt) => {
  // r3: sin etiquetas. De a uno, cada radiador pasa de frío (gris azulado) a caliente y le cae una ✓ verde grande con resorte
  const CK = [0.9, 2.0, 3.0, 3.9], done = CK.filter((c) => tt > c + 0.15).length;
  return <>
  {CK.map((ck, i) => { const x = -0.82 + i * 0.48, warmK = eio(tt, ck, ck + 1.6), pop = phys(tt, ck + 0.15, 9, 0.4);
    return <group key={i}>
      <IronRad n={7} w={0.05} h={0.42} p={[x, 0, -0.27]} glow={0.4 + 0.8 * warmK} heat={(c, y) => 0.05 + 0.9 * cl(warmK * 1.7 - y * 0.7) * (1 - 0.05 * c)} />
      <pointLight position={[x, 0.25, -0.05]} intensity={0.25 * warmK} distance={0.6} color="#ff9a55" />
      {/* la ✓: dos barras verdes con borde blanco, cae y rebota sobre el radiador */}
      <group position={[x + 0.02, 0.3 + 0.08 * (1 - cl(pop)), -0.16]} scale={Math.max(0.001, pop)} visible={pop > 0.01} rotation={[0, 0, 0.05]}>
        <RBox s={[0.075, 0.032, 0.025]} p={[-0.045, -0.005, 0]} rot={[0, 0, -0.85]} r={0.008}><meshStandardMaterial color="#2fbf5f" emissive="#2fbf5f" emissiveIntensity={0.35} roughness={0.35} /></RBox>
        <RBox s={[0.15, 0.032, 0.025]} p={[0.03, 0.03, 0]} rot={[0, 0, 0.95]} r={0.008}><meshStandardMaterial color="#2fbf5f" emissive="#2fbf5f" emissiveIntensity={0.35} roughness={0.35} /></RBox>
      </group>
      <CShadow p={[x, 0, -0.26]} s={[0.5, 0.16]} o={0.55} />
    </group>; })}
  <Tape txt={`${Math.max(1, done)} OF 4 DONE`} col="#1f6a3a" p={[-0.05, 0.03, 0.1]} rot={[-0.85, 0, 0]} w={0.72} k={phys(tt, 1.0, 8, 0.45)} rev={cl((tt - 1.0) / 0.8)} />
</>; }}</Scene3D>;

// ---- 14:30 · EL ESPEJO (r3): UNA sola columna de hierro gigante, en corte térmico, gira sobre su eje en una base:
// de un lado AIRE (frío arriba), da media vuelta y del otro BARRO (frío abajo, con el limo negro asentado) ----
const colTex = (kind: "air" | "mud") => tex.text("col" + kind, 256, 512, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 512);
  if (kind === "air") { gr.addColorStop(0, "#2d5f9e"); gr.addColorStop(0.24, "#4a86c4"); gr.addColorStop(0.36, "#e9a24a"); gr.addColorStop(0.55, "#e2622a"); gr.addColorStop(1, "#c94a22"); }
  else { gr.addColorStop(0, "#c94a22"); gr.addColorStop(0.45, "#e2622a"); gr.addColorStop(0.6, "#e9a24a"); gr.addColorStop(0.72, "#4a86c4"); gr.addColorStop(1, "#2d5f9e"); }
  g.fillStyle = gr; g.fillRect(0, 0, 256, 512);
  if (kind === "mud") for (let i = 0; i < 420; i++) { const y = 512 - Math.pow(rn(i, 3), 2.2) * 120; g.fillStyle = `rgba(22,16,10,${0.5 + 0.4 * rn(i, 4)})`; g.beginPath(); g.arc(rn(i, 2) * 256, y, 2 + 5 * rn(i, 5), 0, 6.3); g.fill(); }
  else for (let i = 0; i < 26; i++) { g.strokeStyle = "rgba(220,240,255,.55)"; g.lineWidth = 2; g.beginPath(); g.arc(rn(i, 2) * 256, 20 + rn(i, 3) * 90, 4 + 10 * rn(i, 4), 0, 6.3); g.stroke(); }
  for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(0,0,0,${0.06 * rn(i, 7)})`; g.fillRect(rn(i, 8) * 256, rn(i, 9) * 512, 2, 2); }
});
export const HFlipHeat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="brick" wallZ={-0.36} bg="#14110e" key1={[-0.9, 1.8, 1.4]} warm={0.6}
  cam={{ at: [0, 0.46, 0], at1: [0.02, 0.44, 0], az: [0.32, -0.12], el: [0.1, 0.16], r: [1.95, 2.15], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.3, 1.6), spin = cl(phys(tt, 2.5, 6, 0.5)) * PI + (phys(tt, 2.5, 6, 0.5) - cl(phys(tt, 2.5, 6, 0.5))) * PI, Hc = 0.74, R = 0.11;
  const skin = (kind: "air" | "mud") => <meshStandardMaterial map={colTex(kind)} emissiveMap={colTex(kind)} emissive="#ffffff" emissiveIntensity={0.08 + 0.3 * k} color={new THREE.Color("#6d6d6d").lerp(new THREE.Color("#ffffff"), k)} roughness={0.55} metalness={0.25} />;
  return <>
    {/* base giratoria de hierro */}
    <mesh position={[0, 0.03, 0]} castShadow receiveShadow><cylinderGeometry args={[0.22, 0.25, 0.06, 48]} /><meshStandardMaterial color="#2c2d2f" metalness={0.6} roughness={0.45} /></mesh>
    <CShadow p={[0, 0, 0]} s={[0.7, 0.7]} o={0.7} />
    <group position={[0, 0.06, 0]} rotation={[0, spin, 0]}>
      {/* la columna: mitad AIRE (frente) y mitad BARRO (atrás) */}
      <mesh position={[0, Hc / 2 + 0.03, 0]} castShadow><cylinderGeometry args={[R, R, Hc, 48, 1, true, -PI / 2, PI]} />{skin("air")}</mesh>
      <mesh position={[0, Hc / 2 + 0.03, 0]} castShadow><cylinderGeometry args={[R, R, Hc, 48, 1, true, PI / 2, PI]} />{skin("mud")}</mesh>
      {/* costuras de fundición y tapas redondas */}
      {[-1, 1].map((sx) => <mesh key={sx} position={[sx * R, Hc / 2 + 0.03, 0]}><boxGeometry args={[0.012, Hc, 0.014]} /><meshStandardMaterial color="#26272a" metalness={0.6} roughness={0.5} /></mesh>)}
      {[0.03, Hc + 0.03].map((y, i) => <mesh key={i} position={[0, y, 0]} scale={[1, 0.45, 1]}><sphereGeometry args={[R, 40, 20]} /><meshStandardMaterial color="#323336" metalness={0.6} roughness={0.45} /></mesh>)}
      {[0.16, 0.4, 0.62].map((y, i) => <mesh key={i} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[R + 0.004, 0.006, 8, 48]} /><meshStandardMaterial color="#2a2b2e" metalness={0.6} roughness={0.5} /></mesh>)}
      <mesh position={[0, Hc + 0.1, 0]}><cylinderGeometry args={[0.02, 0.02, 0.06, 16]} />{M.brass()}</mesh>
    </group>
    <pointLight position={[0.3, 0.5, 0.5]} intensity={0.35 * k} distance={1.4} color="#ff9a55" />
    <Tape txt="AIR = COLD TOP" col="#1f4f9a" p={[0.52, 0.72, -0.355]} rot={[0, 0, -0.03]} w={0.6} k={phys(tt, 1.2, 8, 0.45)} rev={cl((tt - 1.2) / 0.7)} />
    <Tape txt="SLUDGE = COLD BOTTOM" col="#5a3a1a" p={[0.52, 0.26, -0.355]} rot={[0, 0, 0.03]} w={0.64} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 0.8)} />
  </>;
}}</Scene3D>;
