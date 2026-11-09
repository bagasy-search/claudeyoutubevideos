// ohf8pe · componentes únicos 40-44: escudo contra el aerosol, el auto vacío, el pasillo que se parte, la repisa del repaso, los cuatro vasos
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { Tape } from "./okit";
import { Bug, MiniBed, PI, SlickCup, faceTex, sv } from "./bkit";

// ---- EL ESCUDO: la lluvia de aerosol le rebota en la espalda; sigue caminando ----
export const HSprayShield: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[0.4, 2.3, 2]}
  cam={{ at: [0, 0.48, 0], az: [0.28, -0.14], el: [0.2, 0.14], r: [2.1, 1.9], fov: 32 }}>{(tt) => { const x = lerp(-0.55, 0.42, cl((tt - 0.6) / 4.6));
  return <>
    <group position={[-0.5, 0.92, 0.1]} rotation={[0, 0, -0.5]}><mesh castShadow><cylinderGeometry args={[0.1, 0.1, 0.42, 26]} />{M.steel({ col: "#c7ccd0" })}</mesh><RBox s={[0.1, 0.08, 0.06]} p={[0, 0.25, 0]} r={0.01}>{M.matte({ col: "#b3261e" })}</RBox></group>
    {Array.from({ length: 70 }, (_, i) => { const v = (tt * 1.2 + rn(i, 161)) % 1, sx = -0.34 + v * (x + 0.34 + (rn(i, 162) - 0.5) * 0.24), sy = lerp(0.98, 0.14, v * v), bounce = v > 0.82 ? (v - 0.82) * 2.4 : 0; return <mesh key={i} position={[sx + bounce * (rn(i, 163) - 0.2), sy + bounce * 1.1, 0.1 + (rn(i, 164) - 0.5) * 0.2]}><sphereGeometry args={[0.009, 8, 6]} /><meshStandardMaterial color="#d8e6ea" transparent opacity={0.8} roughness={0.2} /></mesh>; })}
    <mesh position={[x, 0.12, 0.1]} scale={[1.3, 0.62, 1]}><sphereGeometry args={[0.18, 30, 16, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color="#9fd1ff" transparent opacity={0.3} roughness={0.1} clearcoat={1} side={2} depthWrite={false} /></mesh>
    <Bug p={[x, 0.046, 0.1]} s={2.4} run={tt} />
    <Tape txt="RESISTANT" col="#b3261e" p={[0.34, 0.7, 0.2]} w={0.52} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- EL AUTO VACÍO: nadie duerme en el asiento; las que subieron se apagan solas ----
export const HEmptyCar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="none" key1={[-0.4, 2.4, 2]}
  cam={{ at: [0, 0.46, 0], az: [-0.3, 0.14], el: [0.22, 0.16], r: [2.0, 1.82], fov: 32 }}>{(tt) => { const d = eio(tt, 1.8, 4.8);
  return <>
    <RBox s={[1.6, 0.1, 0.9]} p={[0, 0.06, 0]} r={0.012}><meshStandardMaterial color="#2c2e33" roughness={0.9} /></RBox>
    <RBox s={[0.9, 0.2, 0.74]} p={[0.1, 0.24, 0]} r={0.06}><meshStandardMaterial color="#595c62" roughness={0.95} /></RBox>
    <group position={[-0.32, 0.26, 0]} rotation={[0, 0, 0.18]}><RBox s={[0.18, 0.76, 0.74]} p={[0, 0.34, 0]} r={0.06}><meshStandardMaterial color="#62656c" roughness={0.95} /></RBox></group>
    {[-0.3, 0.3].map((z) => <RBox key={z} s={[1.1, 0.03, 0.04]} p={[0.1, 0.125, z + (z > 0 ? 0.12 : -0.12)]} r={0.008}>{M.chrome()}</RBox>)}
    {[[0.32, 0.12], [0.02, -0.15], [0.42, -0.2]].map(([x, z], i) => <Bug key={i} p={[x, 0.34, z]} ry={i * 2} s={sv(1.9 * (1 - 0.3 * d))} dead={d} run={d < 0.5 ? tt : 0} />)}
    <Tape txt="NOBODY SLEEPS HERE" p={[0.2, 0.8, 0.2]} w={0.8} k={phys(tt, 1.2, 8, 0.45)} rev={cl((tt - 1.2) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- EL PASILLO QUE SE PARTE: la valija dobla sola a la lavandería, el cuarto queda cerrado ----
export const HSuitFork: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[0.5, 2.4, 2]}
  cam={{ at: [0.1, 0.68, 0], az: [0.2, -0.1], el: [0.26, 0.2], r: [3.15, 2.85], fov: 32 }}>{(tt) => { const u = eio(tt, 0.6, 2.6), tv = eio(tt, 2.6, 4.2), X = lerp(-1.1, 0, u) + lerp(0, 0.75, tv), Z = lerp(0.3, 0.3, u) - lerp(0, 0.86, tv), dr = eio(tt, 4.2, 5.2);
  const Door = ({ x, c, t2, open }: { x: number; c: string; t2: string; open: number }) => <group position={[x, 0, -0.62]}>
    <RBox s={[0.78, 1.32, 0.06]} p={[0, 0.66, -0.06]} r={0.006}><meshStandardMaterial color="#e0d7c2" roughness={0.9} /></RBox>
    <mesh position={[0, 0.58, -0.02]}><planeGeometry args={[0.56, 1.1]} /><meshBasicMaterial color={open ? "#ffd88a" : "#1d1712"} /></mesh>
    <group position={[-0.28, 0.58, 0.01]} rotation={[0, open * 1.5, 0]}><RBox s={[0.56, 1.1, 0.03]} p={[0.28, 0, 0]} r={0.006}><meshStandardMaterial color={c} roughness={0.7} /></RBox></group>
    <Tape txt={t2} p={[0, 1.28, 0.06]} w={0.52} k={1} rev={1} />
  </group>;
  return <>
    <Door x={-0.42} c="#7a553a" t2="BEDROOM" open={0} />
    <Door x={0.72} c="#8a9ea8" t2="DRYER" open={1} />
    <group position={[X, 0.2, Z]} scale={[1, 1, 1]}><RBox s={[0.5, 0.36, 0.18]} r={0.03}><meshStandardMaterial color="#7a4e2c" roughness={0.65} /></RBox><mesh position={[0, 0.24, 0]}><torusGeometry args={[0.06, 0.012, 8, 20, PI]} />{M.matte({ col: "#3b2616" })}</mesh></group>
    <Tape txt="NOT THE BEDROOM" col="#b3261e" p={[-0.4, 0.16, 0.5]} w={0.78} k={phys(tt, 3.5, 8, 0.45)} rev={cl((tt - 3.5) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- LA REPISA DEL REPASO: todo el plan, un objeto por paso, cae en fila ----
export const HRecapRow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" key1={[-0.3, 2.2, 2.3]}
  cam={{ at: [0, 0.7, 0], az: [-0.14, 0.12], el: [0.12, 0.08], r: [3.15, 2.9], fov: 32 }}>{(tt) => { const K = (i: number) => phys(tt, 0.4 + i * 0.5, 8, 0.55), Y = (i: number) => lerp(1.85, 0.62, K(i));
  return <>
    <RBox s={[3, 0.06, 0.5]} p={[0, 0.56, 0.1]} r={0.008}>{M.wood({ rx: 3, ry: 1, base: [152, 112, 72] })}</RBox>
    <group position={[-1.12, Y(0), 0.1]}><SlickCup p={[0, 0, 0]} r={0.1} h={0.14} /></group>
    <mesh position={[-0.74, Y(1) + 0.08, 0.1]}><cylinderGeometry args={[0.1, 0.1, 0.08, 26]} /><meshStandardMaterial color="#d9cfae" roughness={0.6} /></mesh>
    <mesh position={[-0.36, Y(2) + 0.14, 0.1]} scale={[1, 0.95, 0.9]}><sphereGeometry args={[0.15, 26, 18]} /><meshStandardMaterial color="#20201f" roughness={0.5} /></mesh>
    <mesh position={[0.04, Y(3) + 0.14, 0.1]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.13, 0.13, 0.05, 40]} /><meshStandardMaterial color="#e8e3d7" roughness={0.5} /></mesh>
    <mesh position={[0.4, Y(4) + 0.14, 0.1]} rotation={[0, 0, 0.6]}><cylinderGeometry args={[0.03, 0.05, 0.32, 16]} />{M.matte({ col: "#3a3f46" })}</mesh>
    <RBox s={[0.2, 0.26, 0.06]} p={[0.72, Y(5) + 0.13, 0.1]} r={0.008}>{M.steel({ col: "#b5b8ba" })}</RBox>
    <mesh position={[1.08, Y(6) + 0.17, 0.1]}><cylinderGeometry args={[0.055, 0.055, 0.34, 20]} /><meshStandardMaterial color="#efe9da" roughness={0.5} /></mesh>
    <Tape txt="IN THIS ORDER" p={[0, 1.2, 0.2]} w={0.82} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- LOS CUATRO VASOS: la cama se apaga con la lámpara; una pata por vez entra en su vaso ----
export const HCupsNight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" key1={[0.3, 2.2, 2]}
  cam={{ at: [0, 0.32, 0], az: [0.34, 0.14], el: [0.36, 0.28], r: [2.3, 2.1], fov: 32 }}>{(tt) => { const K = (i: number) => phys(tt, 0.6 + i * 0.65, 8, 0.55), dim = eio(tt, 4.2, 6.0);
  return <>
    <MiniBed p={[0, 0.06, 0]} id="cn" />
    {[[-0.4, -0.24], [0.4, -0.24], [-0.4, 0.24], [0.4, 0.24]].map(([x, z], i) => <group key={i} position={[lerp(x * 3.0, x, K(i)), 0.045, lerp(z * 3.0, z, K(i))]}><SlickCup p={[0, 0, 0]} r={0.075} h={0.08} /></group>)}
    <mesh position={[0, 0.6, 0.6]}><planeGeometry args={[8, 5]} /><meshBasicMaterial color="#04060c" transparent opacity={0.55 * dim} depthWrite={false} /></mesh>
    <Tape txt="NOW SLEEP" p={[0, 0.84, 0.12]} w={0.6} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.7)} />
  </>;
}}</Scene3D>;
