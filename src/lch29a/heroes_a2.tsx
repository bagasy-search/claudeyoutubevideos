// lch29a · componentes únicos 9-15.
import React from "react";
import * as THREE from "three";
import { AMB, GRN, H, ICE, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Bucket, Motes, Sock, SockMitt, Toothbrush, WallBB } from "./bb";

const PI = Math.PI;

// ---- 5:06 · LA MEDIA ES UN GUANTE: la mano entra en la media, se apoya en el zócalo y la lana copia el perfil mientras limpia ----
export const HSockFit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none"
  cam={{ at: [0.02, 0.12, 0.04], az: [0.6, 0.35], el: [0.18, 0.24], r: [0.7, 0.6], fov: 30 }} over={(tt) => <Tag tt={tt} at={2.2} x={960} y={150} txt="FITS THE TRIM" col={AMB} size={40} />}>{(tt) => {
  const go = eio(tt, 0.3, 1.6), run = eio(tt, 1.8, 5.4), x = lerp(-0.3, 0.3, run), press = eio(tt, 1.4, 1.8);
  return <>
    <WallBB L={0.9} top={1} line={0.5} />
    {/* velo de polvo en la cara que sólo queda delante de la mano */}
    <mesh position={[(x + 0.45) / 2, 0.065, 0.0099]} scale={[Math.max(0.001, 0.45 - x) / 0.9, 1, 1]}><planeGeometry args={[0.9, 0.1]} /><meshStandardMaterial color="#9a948a" transparent opacity={0.4} roughness={1} depthWrite={false} /></mesh>
    <mesh position={[(x - 0.45) / 2, 0.1255, 0.003]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, x + 0.45), 1, 1]}><planeGeometry args={[1, 0.014]} /><meshStandardMaterial color="#f6f3ec" roughness={0.4} /></mesh>
    <group position={[lerp(-0.3, x, cl(run * 20)) , lerp(0.32, 0.075, go), lerp(0.2, 0.05, go)]} rotation={[lerp(-0.2, -1.25, go), 0, lerp(0.5, PI / 2, go)]}><SockMitt g={0.15 + 0.5 * run} press={press} /></group>
  </>;
}}</Scene3D>;

// ---- 6:05 · DOS BALDES: la media gris se enjuaga en la pileta (agua que se ensucia) y recién después vuelve al balde limpio ----
export const HTwoBuckets: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none"
  cam={{ at: [0, 0.2, 0], az: [-0.2, 0.25], el: [0.42, 0.36], r: [1.15, 1.0], fov: 32 }} over={(tt) => <><Tag tt={tt} at={0.8} x={620} y={160} txt="RINSE" col={RED} size={44} /><Tag tt={tt} at={1.3} x={1300} y={160} txt="CLEAN" col={ICE} size={44} /></>}>{(tt) => {
  // la media viaja: arriba del enjuague (izq), baja, sube, cruza al limpio (der), baja
  const k1 = eio(tt, 0.4, 1.2), dip1 = Math.sin(PI * eio(tt, 1.2, 2.4)), k2 = eio(tt, 2.6, 3.6), dip2 = Math.sin(PI * eio(tt, 3.6, 4.6));
  const x = lerp(lerp(0, -0.2, k1), 0.2, k2), y = 0.42 - 0.2 * dip1 - 0.2 * dip2, rinse = eio(tt, 1.4, 2.6);
  return <>
    <group position={[-0.2, 0, 0]}><Bucket lv={0.7} water={"#" + new THREE.Color("#b9d6e2").lerp(new THREE.Color("#5a554b"), rinse).getHexString()} /></group>
    <group position={[0.2, 0, 0]}><Bucket lv={0.7} suds={1} /></group>
    <group position={[x, y - 0.05, 0]}><Sock g={1 - 0.7 * rinse} s={0.8} /></group>
    {/* nube gris que suelta la media en el enjuague */}
    {rinse > 0 && rinse < 1 && <mesh position={[-0.2, 0.2, 0]} scale={0.03 + 0.08 * rinse}><sphereGeometry args={[1, 16, 10]} /><meshBasicMaterial color="#6d6a62" transparent opacity={0.4 * (1 - rinse)} depthWrite={false} /></mesh>}
  </>;
}}</Scene3D>;

// ---- 6:41 · LA GOMITA: la mopa plana; el trapo húmedo se envuelve sobre la cabeza y dos gomitas rojas lo atan de un chasquido ----
export const HRubberBand: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [0, 0.06, 0], az: [0.6, 0.15], el: [0.55, 0.42], r: [0.62, 0.52], fov: 30 }} over={(tt) => <Tag tt={tt} at={3.4} x={960} y={160} txt="SNAP" col={RED} size={48} />}>{(tt) => {
  const wrap = eio(tt, 0.4, 1.8), b1 = phys(tt, 2.2, 10, 0.3), b2 = phys(tt, 3.0, 10, 0.3);
  return <>
    {/* cabeza de mopa plana con su palo */}
    <RBox s={[0.34, 0.02, 0.1]} p={[0, 0.03, 0]} r={0.006}><meshStandardMaterial color="#3f6aa8" roughness={0.5} /></RBox>
    <mesh position={[0, 0.2, -0.02]} rotation={[-0.25, 0, 0]} castShadow><cylinderGeometry args={[0.01, 0.01, 0.36, 14]} /><meshStandardMaterial map={tex.wood(1, 3, [196, 150, 96])} roughness={0.6} /></mesh>
    {/* trapo: dos mitades que se doblan por arriba y por abajo de la cabeza */}
    <mesh position={[0, 0.042, 0]} castShadow><boxGeometry args={[0.38, 0.004, 0.13]} /><meshStandardMaterial color="#f2efe6" roughness={1} /></mesh>
    {[-1, 1].map((s) => <group key={s} position={[0, 0.03, s * 0.065]} rotation={[s * (PI / 2) * wrap, 0, 0]}><mesh position={[0, 0, s * 0.03]} castShadow><boxGeometry args={[0.38, 0.004, 0.06]} /><meshStandardMaterial color="#e9e5da" roughness={1} side={THREE.DoubleSide} /></mesh></group>)}
    {/* gomitas: llegan estiradas y se cierran con rebote */}
    {[[-0.11, b1], [0.11, b2]].map(([x, b], i) => (b as number) > 0 && <mesh key={i} position={[x as number, 0.03, 0]} rotation={[0, PI / 2, 0]} scale={[1 + 0.8 * (1 - cl(b as number)), (0.36 + 0.8 * (1 - cl(b as number))), 1]}><torusGeometry args={[0.072, 0.004, 8, 40]} />{M.rubber({ col: "#d6352b" })}</mesh>)}
  </>;
}}</Scene3D>;

// ---- 6:59 · 80 % PARADA: la planta de la casa vista de arriba; el zócalo de cada pieza se pinta verde (escoba) y quedan ámbar sólo las esquinas ----
const ROOMS = [[-0.3, -0.15, 0.36, 0.26], [0.1, -0.15, 0.4, 0.26], [-0.3, 0.14, 0.24, 0.3], [-0.04, 0.14, 0.26, 0.3], [0.24, 0.14, 0.18, 0.3]];
export const HEighty: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="none"
  cam={{ at: [-0.02, 0, 0], az: [0.1, -0.1], el: [1.05, 0.95], r: [1.05, 0.95], fov: 32 }} over={(tt) => <Tag tt={tt} at={3.6} x={960} y={110} txt="80% STANDING UP" col={GRN} size={46} />}>{(tt) => <>
    <mesh position={[-0.02, 0.002, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.88, 0.66]} /><meshStandardMaterial map={tex.wood(5, 4, [150, 108, 66])} roughness={0.7} /></mesh>
    {ROOMS.map(([cx, cz, w, d], i) => { const k = eio(tt, 0.5 + i * 0.55, 1.2 + i * 0.55); const sides: [number, number, number, number][] = [[cx, cz - d / 2, w, 0], [cx, cz + d / 2, w, 0], [cx - w / 2, cz, d, 1], [cx + w / 2, cz, d, 1]];
      return <group key={i}>
        {sides.map(([x, z, L, r], j) => <group key={j}>
          <mesh position={[x, 0.03, z]} rotation={[0, r * PI / 2, 0]} castShadow><boxGeometry args={[L, 0.06, 0.012]} /><meshStandardMaterial color={new THREE.Color("#8a8378").lerp(new THREE.Color("#fbf8f1"), k).getStyle()} roughness={0.6} /></mesh>
        </group>)}
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], j) => <mesh key={"c" + j} position={[cx + sx * (w / 2 - 0.015), 0.012, cz + sz * (d / 2 - 0.015)]} scale={0.6 + 0.6 * cl(k * 3 - 2)}><sphereGeometry args={[0.016, 12, 10]} /><meshStandardMaterial color="#6f6a61" roughness={1} /></mesh>)}
      </group>; })}
  </>}</Scene3D>;

// ---- 7:46 · EL PISO EN LA PARED: el lampazo del piso barre y al tocar el zócalo le deja una franja sucia (la arenilla del piso) ----
export const HFloorWall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="none" key1={[-1.2, 1.6, 1.4]}
  cam={{ at: [0, 0.1, 0.06], az: [-0.35, -0.1], el: [0.28, 0.24], r: [0.95, 0.82], fov: 30 }} over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="FLOOR DIRT ON THE WALL" col={RED} size={40} />}>{(tt) => {
  const run = eio(tt, 0.5, 4.2), x = lerp(-0.34, 0.3, run);
  return <>
    <WallBB L={1.0} dust={0} />
    {/* huella mojada y sucia en el piso y la franja en el zócalo */}
    <mesh position={[(x - 0.45) / 2 + 0.0, 0.0015, 0.07]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, x + 0.45), 1, 1]}><planeGeometry args={[1, 0.11]} /><meshPhysicalMaterial color="#8d8a7e" roughness={0.1} clearcoat={1} transparent opacity={0.45} /></mesh>
    <mesh position={[(x - 0.45) / 2, 0.016, 0.0101]} scale={[Math.max(0.001, x + 0.45), 1, 1]}><planeGeometry args={[1, 0.032]} /><meshStandardMaterial color="#5c5549" roughness={0.9} transparent opacity={0.92} /></mesh>
    {/* lampazo de tiras de algodón */}
    <group position={[x, 0, 0.06]}>
      {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.12, 0.02, (rn(i, 3) - 0.5) * 0.07]} rotation={[(rn(i, 4) - 0.5) * 0.8, 0, (rn(i, 5) - 0.5) * 0.8 - 0.3]} castShadow><cylinderGeometry args={[0.005, 0.006, 0.07, 6]} /><meshStandardMaterial color="#b9b2a2" roughness={1} /></mesh>)}
      <mesh position={[0.08, 0.25, 0.02]} rotation={[0, 0, -0.35]} castShadow><cylinderGeometry args={[0.011, 0.011, 0.46, 14]} /><meshStandardMaterial map={tex.wood(1, 3, [176, 132, 82])} roughness={0.6} /></mesh>
    </group>
    <Motes n={40} r={0.003} col="#7a6f5c" pos={(i) => [-0.45 + rn(i, 2) * 0.9, 0.003, 0.03 + rn(i, 3) * 0.12]} op={(i) => (-0.45 + rn(i, 2) * 0.9 > x ? 0.9 : 0)} />
  </>;
}}</Scene3D>;

// ---- 8:47 · LA ESQUINA: rincón interior de dos zócalos; el cepillo de dientes gira en circulitos y sale una nube gris ----
export const HCornerCloud: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none"
  cam={{ at: [0, 0.06, 0], az: [PI / 4 - 0.25, PI / 4 + 0.2], el: [0.42, 0.34], r: [0.42, 0.36], fov: 30 }}>{(tt) => {
  const sc = eio(tt, 0.8, 1.2) * (1 - eio(tt, 4.6, 5.2)), a = tt * 9, out = eio(tt, 1.2, 5.0);
  return <>
    <group position={[0.4, 0, 0]}><WallBB L={0.8} line={1 - out} top={0.4} /></group>
    <group position={[0, 0, 0.4]} rotation={[0, PI / 2, 0]}><WallBB L={0.8} line={1 - out} top={0.4} /></group>
    {/* mugre compacta en el rincón que se va deshaciendo */}
    {Array.from({ length: 26 }, (_, i) => <mesh key={i} position={[0.025 + 0.025 * rn(i, 2), 0.008 + 0.018 * rn(i, 3), 0.025 + 0.025 * rn(i, 4)]} scale={Math.max(0.001, 1 - out * (0.6 + 0.6 * rn(i, 5)))}><sphereGeometry args={[0.007 + 0.005 * rn(i, 6), 7, 6]} /><meshStandardMaterial color={i % 3 ? "#8a8478" : "#6c665c"} roughness={1} /></mesh>)}
    <group position={[0.045 + 0.012 * Math.cos(a) * sc, 0.04 + 0.01 * Math.sin(a) * sc + (1 - eio(tt, 0.3, 1.0)) * 0.2, 0.045]} rotation={[0, -PI / 4, -0.5]} scale={0.65}><Toothbrush /></group>
    <Motes n={140} r={0.0042} col="#8c867b" pos={(i) => { const k = cl((tt - 1.2 - rn(i, 2) * 3.4) / 1.4), az = rn(i, 3) * PI / 2; return [0.03 + Math.cos(az) * 0.12 * k, 0.02 + 0.14 * k * rn(i, 4), 0.03 + Math.sin(az) * 0.12 * k]; }} op={(i) => { const k = cl((tt - 1.2 - rn(i, 2) * 3.4) / 1.4); return k > 0 ? 0.9 * (1 - k) : 0; }} />
  </>;
}}</Scene3D>;

// ---- 9:33 · DOCE ESQUINAS, DIEZ MINUTOS: el salón de la iglesia visto de arriba; cada esquina se enciende al pasar la aguja del reloj ----
const HALL: [number, number][] = [[-0.38, -0.24], [0.38, -0.24], [0.38, 0.24], [-0.38, 0.24], [-0.12, -0.24], [0.12, -0.24], [0.38, 0.0], [0.12, 0.24], [-0.12, 0.24], [-0.38, 0.0], [-0.12, 0.0], [0.12, 0.0]];
export const HTwelveCorners: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="none"
  cam={{ at: [0, 0, 0.02], az: [-0.2, 0.15], el: [0.95, 1.1], r: [1.3, 1.18], fov: 32 }} over={(tt) => <Tag tt={tt} at={4.8} x={960} y={110} txt="12 CORNERS · 10 MINUTES" col={AMB} size={40} />}>{(tt) => {
  const run = eio(tt, 0.6, 5.2), n = Math.floor(run * 12 + 0.001);
  return <>
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.86, 0.58]} /><meshStandardMaterial map={tex.tile(12, 8, "#d9d2c0", "#a59d88")} roughness={0.4} /></mesh>
    {[[0, -0.29, 0.86, 0], [0, 0.29, 0.86, 0], [-0.43, 0, 0.58, 1], [0.43, 0, 0.58, 1], [0, 0, 0.5, 0]].map(([x, z, L, r], j) => <mesh key={j} position={[x, 0.025, z]} rotation={[0, r * PI / 2, 0]} castShadow><boxGeometry args={[L, 0.05, 0.012]} /><meshStandardMaterial color="#efe9de" roughness={0.5} /></mesh>)}
    {HALL.map(([x, z], i) => <mesh key={i} position={[x * 1.1, 0.06, z * 1.15]} scale={i < n ? 1 + 0.4 * (1 - cl(phys(tt, 0.6 + (i + 1) / 12 * 4.6, 9, 0.35))) : 0.45}><sphereGeometry args={[0.014, 14, 10]} />{i < n ? M.glow({ col: AMB }) : M.matte({ col: "#4a4640" })}</mesh>)}
    {/* reloj de pared en el medio: la aguja larga recorre 10 minutos */}
    <group position={[0, 0.08, 0]} rotation={[-PI / 2, 0, 0]}>
      <mesh><circleGeometry args={[0.09, 48]} /><meshStandardMaterial color="#f6f1e6" roughness={0.5} /></mesh>
      <mesh position={[0, 0, -0.004]}><torusGeometry args={[0.09, 0.008, 10, 48]} />{M.brass()}</mesh>
      <group position={[0, 0, 0.002]} rotation={[0, 0, -run * PI / 3]}><mesh position={[0, 0.035, 0]}><boxGeometry args={[0.006, 0.07, 0.002]} /><meshStandardMaterial color="#1b1b1b" /></mesh></group>
      <mesh position={[0, 0, 0.001]}><ringGeometry args={[0.0, 0.085, 48, 1, PI / 2 - PI / 3 * run, PI / 3 * run]} /><meshBasicMaterial color={AMB} transparent opacity={0.35} /></mesh>
    </group>
  </>;
}}</Scene3D>;

