// gary04 · componentes únicos 2/4 (min 5-11)
import React from "react";
import { AbsoluteFill } from "remotion";
import { H } from "./hkit";
import { M, RBox, Scene3D, fall, tex, tubeG } from "./h3d";
import { Fridge, PI, Thermo, Txt3, cl, eio, lerp, phys, pop } from "./gk";
import { House, Snow, Spark } from "./gh1";

// número de rodillo: el dígito nuevo entra desde arriba mientras el viejo sale por abajo (v real, h alto de la ventanita)
export const Roller: React.FC<{ v: number; p: [number, number, number]; w: number; h: number; col: string; suf?: string }> = ({ v, p, w, h, col, suf = "" }) => {
  return <group position={p}>
    <RBox s={[w + 0.02, h + 0.02, 0.012]} p={[0, 0, -0.008]} r={0.006}>{M.matte({ col: "#141516" })}</RBox>
    <Txt3 txt={`${Math.round(v)}${suf}`} w={w} h={h} col={col} bg="#141516" p={[0, 0, 0.001]} />
  </group>;
};

// 5:53 · LA LÁMPARA TESTIGO: living a oscuras (heladera y reloj apagados atrás), la perilla de la lámpara en ON; vuelve la luz: click y un cono cálido llena el cuarto
export const HOneLamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" bg="#0b0a0c" warm={0.35}
  cam={{ at: [0.0, 0.48, 0.03], at1: [0.0, 0.4, 0], az: [-0.25, -0.1], el: [0.12, 0.14], r: [0.55, 1.3], fov: 30 }} lamp={[0, 0.9, 0.6]}
  over={(tt) => <AbsoluteFill style={{ background: "#050812", opacity: 0.6 * (1 - cl((tt - 1.15) / 0.08)) }} />}>{(tt) => {
  const on = cl((tt - 1.15) / 0.08), knob = cl(phys(tt, 0.85, 12, 0.4));
  return <>
    {/* atrás: la heladera y el reloj de pared, apagados (sin luz ni hora que corra) */}
    <Fridge p={[-0.62, 0, -0.55]} s={1.2} />
    <group position={[0.42, 0.72, -0.62]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.08, 0.08, 0.02, 40]} />{M.matte({ col: "#2a2c30" })}</mesh>
      <mesh position={[0, 0, 0.011]}><circleGeometry args={[0.07, 40]} /><meshStandardMaterial color="#eae4d6" /></mesh>
      <mesh position={[0.02, 0.02, 0.013]} rotation={[0, 0, -0.8]}><boxGeometry args={[0.004, 0.05, 0.002]} /><meshBasicMaterial color="#1b1b1b" /></mesh>
      <mesh position={[0, 0.03, 0.013]}><boxGeometry args={[0.004, 0.06, 0.002]} /><meshBasicMaterial color="#1b1b1b" /></mesh>
    </group>
    {/* mesa */}
    <RBox s={[0.5, 0.03, 0.32]} p={[0, 0.2, 0]} r={0.006}>{M.wood({ base: [110, 72, 44] })}</RBox>
    {[[-0.22, -0.13], [0.22, -0.13], [-0.22, 0.13], [0.22, 0.13]].map(([x, z], i) => <mesh key={i} position={[x, 0.1, z]}><boxGeometry args={[0.025, 0.2, 0.025]} />{M.wood({ base: [90, 58, 36] })}</mesh>)}
    {/* la lámpara */}
    <group position={[0, 0.215, 0]} scale={1.35}>
      <mesh position={[0, 0.015, 0]}><cylinderGeometry args={[0.06, 0.07, 0.03, 32]} />{M.brass()}</mesh>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.01, 0.01, 0.17, 12]} />{M.brass()}</mesh>
      <mesh position={[0, 0.23, 0]}><cylinderGeometry args={[0.07, 0.11, 0.12, 32, 1, true]} /><meshStandardMaterial color="#efe2c4" emissive="#ffcf7a" emissiveIntensity={1.4 * on} side={2} /></mesh>
      <mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.025, 16, 12]} /><meshStandardMaterial color="#fff" emissive="#ffd98a" emissiveIntensity={3 * on} toneMapped={false} /></mesh>
      {/* la perilla grande, girada a ON (con su raya blanca) */}
      <group position={[0.0, 0.2, 0.012]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0, 0.014]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.026, 24]} />{M.brass()}</mesh>
        <mesh position={[0, 0, 0.028]} rotation={[0, 0, -knob * PI / 2]}><boxGeometry args={[0.006, 0.032, 0.002]} /><meshBasicMaterial color="#ffffff" /></mesh>
      </group>
    </group>
    <pointLight position={[0, 0.5, 0.05]} intensity={2.4 * on} distance={1.6} color="#ffcf7a" />
    <ambientLight intensity={0.35 * on} color="#ffcf9a" />
    {/* el cono de luz que baja de la pantalla y el charco en la mesa */}
    <mesh position={[0, 0.3, 0]} scale={Math.max(0.001, on)}><cylinderGeometry args={[0.15, 0.24, 0.17, 32, 1, true]} /><meshBasicMaterial color="#ffd89a" transparent opacity={0.12} depthWrite={false} side={2} /></mesh>
    <mesh position={[0, 0.2155, 0]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, on)}><circleGeometry args={[0.24, 40]} /><meshBasicMaterial color="#ffcf7a" transparent opacity={0.3} depthWrite={false} /></mesh>
  </>;
}}</Scene3D>;

// 6:27 · LLENAR TODO: olla, jarra, bidón y bañadera en fila sobre azulejo oscuro; la canilla corre por un riel, frena sobre cada uno y el agua sube con ondas
export const HFillUp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="dark" bg="#16181c"
  cam={{ at: [0.0, 0.2, 0], az: [-0.12, 0.08], el: [0.26, 0.2], r: [1.75, 1.6], fov: 30 }} lamp={[0, 0.8, 0.5]}>{(tt) => {
  const X = [-0.56, -0.28, -0.02, 0.4], T0 = (i: number) => 0.5 + i * 1.05, f = (i: number) => eio(tt, T0(i) + 0.25, T0(i) + 1.0), cur = Math.max(0, Math.min(3, Math.floor((tt - 0.5) / 1.05)));
  const fx = lerp(X[Math.max(0, cur - 1)], X[cur], cl(phys(tt, T0(cur) - 0.05, 7, 0.3))), pour = tt > T0(cur) + 0.2 && f(cur) < 1 ? 1 : 0, over = eio(tt, 4.9, 5.4);
  const Ripple = ({ y, r, i }: { y: number; r: number; i: number }) => { const k = (tt * 2.2) % 1, act = tt > T0(i) + 0.25 && f(i) < 1; return <mesh position={[0, y + 0.002, 0]} rotation={[-PI / 2, 0, 0]} scale={act ? 0.2 + 0.8 * k : 0.001}><ringGeometry args={[r * 0.7, r, 32]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85 * (1 - k)} depthWrite={false} /></mesh>; };
  const Drop = ({ x, i, y }: { x: number; i: number; y: number }) => <mesh position={[x, y, 0.0]} scale={Math.max(0.001, cl(phys(tt, T0(i) + 1.0, 9, 0.4))) * 1} rotation={[PI, 0, 0]}><coneGeometry args={[0.018, 0.04, 16]} />{M.water({ op: 0.95, col: "#3a9ae6" })}</mesh>;
  return <>
    {/* olla */}
    <group position={[X[0], 0, 0]} scale={pop(tt, 0.1)}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.09, 0.08, 0.14, 32, 1, true]} />{M.steel({ side: 2 })}</mesh>
      <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.08, 0.08, 0.01, 32]} />{M.steel()}</mesh>
      <mesh position={[0, 0.01 + 0.06 * f(0), 0]} scale={[1, Math.max(0.001, f(0)), 1]}><cylinderGeometry args={[0.085, 0.08, 0.12, 32]} />{M.water()}</mesh>
      <Ripple y={0.01 + 0.12 * f(0)} r={0.08} i={0} />
    </group>
    {/* jarra */}
    <group position={[X[1], 0, 0]} scale={pop(tt, 0.2)}>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.055, 0.06, 0.22, 32, 1, true]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.01 + 0.1 * f(1), 0]} scale={[1, Math.max(0.001, f(1)), 1]}><cylinderGeometry args={[0.052, 0.057, 0.2, 32]} />{M.water()}</mesh>
      <mesh position={[0.07, 0.13, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.04, 0.008, 8, 20, PI]} />{M.glass({ op: 0.4 })}</mesh>
      <Ripple y={0.01 + 0.2 * f(1)} r={0.05} i={1} />
    </group>
    {/* bidón */}
    <group position={[X[2], 0, 0]} scale={pop(tt, 0.3)}>
      <RBox s={[0.16, 0.26, 0.12]} p={[0, 0.13, 0]} r={0.02}>{M.plastic({ col: "#e6ecef", op: 0.45 })}</RBox>
      <mesh position={[0, 0.01 + 0.12 * f(2), 0]} scale={[1, Math.max(0.001, f(2)), 1]}><boxGeometry args={[0.14, 0.24, 0.1]} />{M.water()}</mesh>
      <mesh position={[0, 0.275, 0]}><cylinderGeometry args={[0.025, 0.025, 0.03, 16]} />{M.plastic({ col: "#2f74c4" })}</mesh>
    </group>
    {/* bañadera con patas y borde curvo: se llena al final y desborda un poco */}
    <group position={[X[3], 0, 0]} scale={pop(tt, 0.4)}>
      <mesh position={[0, 0.11, 0]} scale={[1, 0.55, 0.52]}><sphereGeometry args={[0.24, 40, 20, 0, 2 * PI, PI / 2, PI / 2]} />{M.porcelain({ side: 2 })}</mesh>
      <mesh position={[0, 0.11, 0]} rotation={[PI / 2, 0, 0]} scale={[1, 0.52, 1]}><torusGeometry args={[0.24, 0.012, 10, 48]} />{M.porcelain()}</mesh>
      {[[-0.16, -0.07], [0.16, -0.07], [-0.16, 0.07], [0.16, 0.07]].map(([x, z], i) => <mesh key={i} position={[x, 0.02, z]}><sphereGeometry args={[0.022, 12, 10]} />{M.brass()}</mesh>)}
      <mesh position={[0, 0.03 + 0.075 * f(3), 0]} rotation={[-PI / 2, 0, 0]} scale={[1, 0.52, 1]}><circleGeometry args={[Math.max(0.001, 0.12 + 0.11 * f(3)), 40]} />{M.water({ op: 0.85 * cl(f(3) * 4) })}</mesh>
      <Ripple y={0.03 + 0.075 * f(3)} r={0.2} i={3} />
    </group>
    {/* el riel de la canilla y la canilla que corre y frena */}
    <mesh position={[-0.08, 0.5, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 1.2, 12]} />{M.chrome()}</mesh>
    <group position={[fx, 0.47, 0]} scale={2.0}>
      <RBox s={[0.05, 0.05, 0.05]} p={[0, 0.03, 0]} r={0.008}>{M.chrome()}</RBox>
      <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.016, 0.016, 0.08, 16]} />{M.chrome()}</mesh>
      <mesh position={[0, -0.13, 0]} scale={[1, Math.max(0.001, pour), 1]}><cylinderGeometry args={[0.007, 0.006, 0.19, 12]} />{M.water({ op: 0.85, col: "#4aa8ee" })}</mesh>
    </group>
    {/* una gota azul se posa sobre cada recipiente lleno */}
    {[[0, 0.14, 0.09], [1, 0.22, 0.06], [2, 0.27, 0.09], [3, 0.115, 0.25]].map(([i, y, r]) => { const k = cl((tt - T0(i) - 1.0) / 0.5); return <mesh key={i} position={[X[i], y, 0]} rotation={[-PI / 2, 0, 0]} scale={[1, i === 3 ? 0.52 : 1, 1]}><ringGeometry args={[r, r + 0.008, 40]} />{M.glow({ col: "#8fd0ff", op: k > 0 && k < 1 ? Math.sin(PI * k) : 0.001 })}</mesh>; })}
  </>;
}}</Scene3D>;

// 6:55 · GOTEO EN LAS PAREDES DE AFUERA: dos caños de cobre en el ladrillo; el quieto engorda un manguito de hielo y se raja con chorro; el que gotea sigue limpio
export const HDrip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#0e1018" warm={0.6}
  cam={{ at: [0, 0.28, -0.1], az: [0.0, 0.08], el: [0.1, 0.06], r: [1.2, 1.06], fov: 30 }} lamp={[0, 0.7, 0.6]}>{(tt) => {
  const ice = eio(tt, 0.4, 2.8), crack = cl((tt - 3.0) / 0.1), jet = cl((tt - 3.05) / 0.3);
  const Pipe = ({ x, drip }: { x: number; drip: boolean }) => <group position={[x, 0, 0]}>
    <mesh position={[0, 0.34, -0.25]}><cylinderGeometry args={[0.03, 0.03, 0.62, 20]} />{M.steel({ col: "#b87333" })}</mesh>
    <mesh position={[0, 0.2, -0.18]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.14, 20]} />{M.steel({ col: "#b87333" })}</mesh>
    <mesh position={[0, 0.18, -0.115]}><cylinderGeometry args={[0.02, 0.016, 0.04, 16]} />{M.chrome()}</mesh>
    {drip ? <>
      {/* una gota grande cada segundo, y el charquito abajo */}
      {(() => { const ph = tt % 1; return <mesh position={[0, 0.15 - ph * ph * 0.14, -0.115]} scale={[1, 1.3 + ph * 0.4, 1]}><sphereGeometry args={[0.038, 16, 12]} />{M.water({ op: 0.95 })}</mesh>; })()}
      {[0, 1].map((i) => { const k = ((tt + 0.08) % 1 + i * 0.5) % 1; return <mesh key={"rp" + i} position={[0, 0.004, -0.11]} rotation={[-PI / 2, 0, 0]} scale={0.4 + 1.4 * k}><ringGeometry args={[0.03, 0.036, 32]} />{M.water({ op: 0.7 * (1 - k) })}</mesh>; })}
      <mesh position={[0, 0.003, -0.11]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.06, 24]} />{M.water({ op: 0.5 })}</mesh>
    </> : <>
      {/* el manguito de hielo: cristales que engordan y se hinchan */}
      <mesh position={[0, 0.34, -0.25]} scale={[1 + 0.35 * ice + 0.12 * crack, cl(ice * 1.2), 1 + 0.35 * ice + 0.12 * crack]}><cylinderGeometry args={[0.031, 0.031, 0.6, 28]} /><meshPhysicalMaterial color="#cfeaff" transparent opacity={0.42 * ice} roughness={0.08} clearcoat={1} emissive="#5aa8ff" emissiveIntensity={0.12} depthWrite={false} /></mesh>
      {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[0.04 * Math.cos(i * 2.3), 0.08 + (i * 0.027) % 0.56, -0.25 + 0.04 * Math.sin(i * 2.3)]} rotation={[i, i * 1.7, 0]} scale={Math.max(0.001, cl(ice * 1.3 - (i % 4) * 0.1))}><octahedronGeometry args={[0.014, 0]} /><meshPhysicalMaterial color="#ffffff" roughness={0.2} clearcoat={1} emissive="#bfe2ff" emissiveIntensity={0.15} /></mesh>)}
      {/* la grieta nítida y el chorro de agua + astillas de hielo */}
      {Array.from({ length: 9 }, (_, i) => <mesh key={"ib" + i} position={[0.03 * Math.cos(i * 2.1), 0.12 + i * 0.055, -0.25 + 0.03 * Math.sin(i * 2.1)]} scale={[1, 1.6, 1].map((v) => v * Math.max(0.001, ice) * (0.8 + 0.3 * ((i * 7) % 3) / 2)) as [number, number, number]}><sphereGeometry args={[0.03, 16, 12]} /><meshPhysicalMaterial color="#d8f0ff" transparent opacity={0.35} roughness={0.05} clearcoat={1} depthWrite={false} /></mesh>)}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <mesh key={"zg" + i} position={[(i % 2 ? 0.012 : -0.012), 0.22 + i * 0.05, -0.189]} rotation={[0, 0, i % 2 ? 0.7 : -0.7]} scale={[1, Math.max(0.001, cl(crack * 7 - i)), 1]}><boxGeometry args={[0.004, 0.072, 0.004]} />{M.glow({ col: "#eaf8ff" })}</mesh>)}
      {jet > 0.02 && <mesh geometry={tubeG("dj" + Math.round(jet * 20), Array.from({ length: 8 }, (_, i) => { const u = i / 7 * Math.round(jet * 20) / 20; return [0.03 + 0.33 * u, 0.36 - 0.35 * u * u, -0.19 + 0.04 * u]; }), 0.013, 30, 8)}>{M.water({ op: 0.9 })}</mesh>}
      {Array.from({ length: 10 }, (_, i) => { const k = ((tt - 3.3) * 1.6 + i / 10 + 10) % 1, a = i * 0.63; return <mesh key={"sd" + i} position={[0.36 + Math.cos(a) * 0.09 * k, 0.01 + 0.24 * k * (1 - k), -0.15 + Math.sin(a) * 0.06 * k]} scale={jet > 0.9 ? 1 : 0.001}><sphereGeometry args={[0.008, 8, 6]} />{M.water({ op: 0.85 * (1 - k) })}</mesh>; })}
      {[0, 1, 2].map((i) => { const k = ((tt - 3.3) * 2 + i / 3 + 10) % 1; return <mesh key={"sp" + i} position={[0.36, 0.01, -0.15]} rotation={[-PI / 2, 0, 0]} scale={jet > 0.9 ? 0.3 + k : 0.001}><ringGeometry args={[0.03, 0.036, 24]} />{M.water({ op: 0.6 * (1 - k) })}</mesh>; })}
      {Array.from({ length: 8 }, (_, i) => { const k = cl((tt - 3.0) / 0.5), a = i * 0.8; return <mesh key={"a" + i} position={[0.04 + Math.cos(a) * 0.15 * k, 0.38 + Math.sin(a) * 0.1 * k - 0.2 * k * k, -0.2]} rotation={[i, i, 0]} scale={Math.max(0.001, k > 0 && k < 1 ? 1 : 0.001)}><tetrahedronGeometry args={[0.012, 0]} /><meshPhysicalMaterial color="#ffffff" clearcoat={1} roughness={0.2} /></mesh>; })}
    </>}
  </group>;
  return <>
    {/* pared de ladrillo de afuera */}
    <mesh position={[0, 0.5, -0.28]}><planeGeometry args={[2.4, 1.4]} /><meshStandardMaterial map={tex.tile(9, 10, "#8a4a36", "#4a3a34")} roughness={0.9} /></mesh>
    <mesh position={[0, 0, 0.2]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.4, 1]} /><meshStandardMaterial color="#cfd8e4" roughness={1} /></mesh>
    <Pipe x={-0.24} drip={false} />
    <Pipe x={0.24} drip={true} />
  </>;
}}</Scene3D>;

// 8:04 · UN SOLO CUARTO: la planta de la casa vista de arriba; la marea azul helada entra de a un cuarto desde afuera; el naranja queda tibio y se le cierran las puertas
export const HWarmRoom: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none" bg="#0c0d10"
  cam={{ at: [0, 0, 0.04], az: [0.0, 0.1], el: [0.98, 0.88], r: [1.5, 1.36], fov: 30 }} lamp={[0, 0.9, 0.3]}>{(tt) => {
  const ORD = [0, 3, 1, 5, 2], W = 4, cold = (i: number) => i === W ? 0 : eio(tt, 0.5 + ORD.indexOf(i) * 0.35, 1.0 + ORD.indexOf(i) * 0.35), glow = cl((tt - 1.8) / 0.5);
  const R: [number, number, number, number][] = [[-0.3, -0.15, 0.3, 0.26], [0.02, -0.15, 0.32, 0.26], [0.32, -0.15, 0.26, 0.26], [-0.3, 0.13, 0.3, 0.28], [0.02, 0.13, 0.32, 0.28], [0.32, 0.13, 0.26, 0.28]];
  const door = (i: number) => cl(phys(tt, 2.5 + i * 0.5, 15, 0.3));
  return <>
    {R.map(([x, z, w, d], i) => <group key={i}>
      <mesh position={[x, 0.004, z]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[w - 0.012, d - 0.012]} /><meshStandardMaterial color={i === W ? "#c9773a" : "#c9b89a"} emissive={i === W ? "#ff8a3a" : "#3a7ad8"} emissiveIntensity={i === W ? 0.65 * glow : 0.6 * cold(i)} /></mesh>
      {i !== W && <mesh position={[x - (w - 0.02) / 2 + (w - 0.02) * cold(i) / 2, 0.035, z]} scale={[Math.max(0.001, cold(i)), 1, 1]}><boxGeometry args={[w - 0.02, 0.06, d - 0.02]} /><meshStandardMaterial color="#4f9cff" transparent opacity={0.55} emissive="#2a6ad8" emissiveIntensity={0.6} depthWrite={false} /></mesh>}
      {i !== W && Array.from({ length: 6 }, (_, k) => <mesh key={"wv" + k} position={[x - (w - 0.02) / 2 + (w - 0.02) * cold(i) + 0.012 * Math.sin(tt * 6 + k * 1.3), 0.04, z - (d - 0.02) / 2 + (k + 0.5) * (d - 0.02) / 6]} scale={cold(i) > 0.02 && cold(i) < 0.98 ? 1 : 0.001}><sphereGeometry args={[0.024, 12, 8]} /><meshStandardMaterial color="#cfe8ff" emissive="#8fc8ff" emissiveIntensity={0.8} transparent opacity={0.8} depthWrite={false} /></mesh>)}
      {/* escarcha en el piso de los cuartos fríos */}
      {i !== W && Array.from({ length: 10 }, (_, k) => <mesh key={k} position={[x - w / 2 + 0.03 + ((k * 0.137) % 1) * (w - 0.06), 0.006, z - d / 2 + 0.03 + ((k * 0.291) % 1) * (d - 0.06)]} rotation={[-PI / 2, 0, k]} scale={Math.max(0.001, cold(i))}><circleGeometry args={[0.012, 6]} /><meshBasicMaterial color="#eaf6ff" transparent opacity={0.8} /></mesh>)}
      {[[0, -d / 2, w, 0.012], [0, d / 2, w, 0.012], [-w / 2, 0, 0.012, d], [w / 2, 0, 0.012, d]].map(([dx, dz, ww, dd], k) => <mesh key={k} position={[x + dx, 0.04, z + dz]}><boxGeometry args={[ww, 0.08, dd]} />{M.matte({ col: "#e8e2d4" })}</mesh>)}
    </group>)}
    {/* el aire frío entrando desde afuera por el borde de la casa */}
    
    {/* las dos puertas del cuarto tibio: hojas con bisagra y picaporte que se cierran con peso, de a una */}
    {[[-0.14, 0.08, PI / 2], [0.0, -0.01, 0]].map(([x, z, r0], i) => <group key={i} position={[x, 0.045, z]} rotation={[0, r0 + (1 - door(i)) * 1.4, 0]}>
      <mesh position={[0.065, 0.02, 0]}><boxGeometry args={[0.13, 0.13, 0.016]} />{M.wood({ base: [150, 96, 52] })}</mesh>
      <mesh position={[0.115, 0.02, 0.012]}><sphereGeometry args={[0.009, 10, 8]} />{M.brass()}</mesh>
    </group>)}
    <pointLight position={[0.02, 0.3, 0.13]} intensity={1.8 * glow} distance={0.6} color="#ff9a4a" />
    <mesh position={[0.02, 0.0045, 0.13]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, glow)}><circleGeometry args={[0.2, 32]} /><meshBasicMaterial color="#ffb070" transparent opacity={0.2} depthWrite={false} /></mesh>
  </>;
}}</Scene3D>;

// termómetro grueso: tubo de vidrio, bulbo y columna de líquido saturado (k 0..1 del alto)
const BigThermo: React.FC<{ x: number; k: number; col: string }> = ({ x, k, col }) => { const S = 2.1, yOf = (q: number) => 0.02 + S * (0.03 + 0.14 * q);
  return <group position={[x, 0, 0]}>
    <mesh position={[0, yOf(0.5), 0]}><cylinderGeometry args={[0.052, 0.052, yOf(1) - yOf(0) + 0.06, 32, 1, true]} />{M.glass({ op: 0.3 })}</mesh>
    <mesh position={[0, yOf(0.5) + (yOf(1) - yOf(0) + 0.06) / 2, 0]}><sphereGeometry args={[0.052, 24, 12, 0, PI * 2, 0, PI / 2]} />{M.glass({ op: 0.3 })}</mesh>
    <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.08, 28, 20]} /><meshPhysicalMaterial color={col} emissive={col} emissiveIntensity={0.7} clearcoat={1} roughness={0.2} /></mesh>
    <mesh position={[0, (0.06 + yOf(k)) / 2, 0]} scale={[1, Math.max(0.001, yOf(k) - 0.06), 1]}><cylinderGeometry args={[0.036, 0.036, 1, 24]} /><meshPhysicalMaterial color={col} emissive={col} emissiveIntensity={0.7} clearcoat={1} roughness={0.2} /></mesh>
    {Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[0.056, yOf(i / 10), 0.01]}><boxGeometry args={[i % 5 ? 0.012 : 0.022, 0.003, 0.003]} /><meshBasicMaterial color="#e8e2d2" /></mesh>)}
  </group>; };

// 9:09 · 9 AFUERA, 55 ADENTRO: dos termómetros que llenan el alto; el de afuera cae a 9 °F con su rodillo de números; el de adentro queda arriba de la barra roja de 55
export const HNineFifty: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#0f1014"
  cam={{ at: [0.04, 0.3, 0], az: [0.0, 0.08], el: [0.1, 0.06], r: [1.75, 1.62], fov: 30 }} lamp={[0, 0.8, 0.6]}>{(tt) => {
  const fall9 = eio(tt, 0.5, 2.6), out = lerp(0.62, 0.12, fall9), vOut = lerp(32, 9, fall9), inn = 0.7 + 0.015 * Math.sin(tt * 2), bar = Math.max(0.001, phys(tt, 2.8, 7, 0.3));
  const S = 2.1, yOf = (k: number) => 0.02 + S * (0.03 + 0.14 * k);
  return <>
    <BigThermo x={-0.24} k={out} col="#3a8aff" />
    <Roller v={vOut} p={[-0.06, yOf(out), 0.06]} w={0.15} h={0.08} col="#8fd0ff" suf="°" />
    <Txt3 txt="OUTSIDE" w={0.3} h={0.085} col="#8fd0ff" bg="#141516" p={[-0.24, 0.5, 0.06]} s={pop(tt, 0.1)} />
    <BigThermo x={0.24} k={inn} col="#ff7a2a" />
    {/* la barra roja gruesa de 55 que cruza el de adentro */}
    <RBox s={[0.26 * bar + 0.001, 0.03, 0.03]} p={[0.24, yOf(0.55), 0.06]} r={0.006}>{M.plastic({ col: "#c62a22", em: "#ff3a2a", emI: 0.3 })}</RBox>
    <Txt3 txt="55°" w={0.14} h={0.07} col="#ffb070" bg="#141516" p={[0.5, yOf(0.55), 0.06]} s={Math.min(1.1, bar)} />
    <Txt3 txt="INSIDE" w={0.3} h={0.085} col="#ffb070" bg="#141516" p={[0.24, 0.5, 0.06]} s={pop(tt, 0.2)} />
  </>;
}}</Scene3D>;

// 9:45 · LA MAREA INVISIBLE: casa en corte; del horno sube un volumen gris en capas de borde ondulado que llena los cuartos; al tocar el detector, éste se pone rojo y late
export const HCoTide: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="none" bg="#0c0d10"
  cam={{ at: [0, 0.42, 0], az: [0.0, 0.06], el: [0.1, 0.06], r: [1.18, 1.08], fov: 30 }} lamp={[0, 1, 0.8]}>{(tt) => {
  const lvl = lerp(0.0, 0.62, eio(tt, 0.6, 3.4)), hitT = 3.35, alarm = tt > hitT ? cl((tt - hitT) / 0.1) : 0, beat = alarm * (0.5 + 0.5 * Math.sin((tt - hitT) * 16));
  return <>
    <RBox s={[0.9, 0.02, 0.3]} p={[0, 0.0, -0.05]} r={0.004}>{M.wood({ base: [130, 92, 58] })}</RBox>
    <RBox s={[0.9, 0.02, 0.3]} p={[0, 0.36, -0.05]} r={0.004}>{M.wood({ base: [130, 92, 58] })}</RBox>
    <mesh position={[0, 0.36, -0.2]}><boxGeometry args={[0.9, 0.72, 0.02]} />{M.matte({ col: "#d9cdb4" })}</mesh>
    {[-0.45, 0.0, 0.45].map((x) => <mesh key={x} position={[x, 0.36, -0.05]}><boxGeometry args={[0.02, 0.72, 0.3]} />{M.matte({ col: "#e8e2d4" })}</mesh>)}
    <mesh position={[0, 0.82, -0.05]}><coneGeometry args={[0.66, 0.2, 4, 1]} />{M.matte({ col: "#4a3a34" })}</mesh>
    <RBox s={[0.2, 0.2, 0.16]} p={[-0.25, 0.11, -0.08]} r={0.008}>{M.steel({ col: "#d8d8d4" })}</RBox>
    <mesh position={[-0.25, 0.1, 0.002]}><planeGeometry args={[0.15, 0.1]} /><meshStandardMaterial color="#1a0d06" emissive="#ff6a2a" emissiveIntensity={0.9} /></mesh>
    {[-0.22, 0.22].map((x) => <RBox key={x} s={[0.22, 0.06, 0.16]} p={[x, 0.4, -0.06]} r={0.02}>{M.matte({ col: x < 0 ? "#4f6f9a" : "#a7563f" })}</RBox>)}
    {/* el gas: capas translúcidas apiladas + una cresta ondulada que sube */}
    {[0, 1, 2, 3, 4].map((j) => { const l = Math.max(0.001, lvl * (1 - j * 0.06)); return <mesh key={j} position={[0, 0.01 + l / 2, -0.05 + (j - 2) * 0.03]} scale={[1, l, 1]}><boxGeometry args={[0.88, 1, 0.07]} /><meshStandardMaterial color="#5c636c" transparent opacity={0.36} depthWrite={false} /></mesh>; })}
    {Array.from({ length: 30 }, (_, i) => { const x = -0.42 + i * 0.029; return <mesh key={i} position={[x, 0.01 + lvl + 0.015 * Math.sin(tt * 3 + i * 0.7), 0.04]} scale={lvl > 0.01 ? 1 : 0.001}><sphereGeometry args={[0.036, 10, 8]} /><meshBasicMaterial color="#7a8088" transparent opacity={0.6} depthWrite={false} /></mesh>; })}
    {/* el detector, grande, en el techo de arriba: carcasa y LED se ponen rojos y laten */}
    <group position={[0.22, 0.68, -0.02]} scale={1.8 * (1 + 0.08 * beat)}>
      <mesh><cylinderGeometry args={[0.045, 0.045, 0.02, 32]} /><meshPhysicalMaterial color={alarm ? "#d8463a" : "#f3f1ea"} roughness={0.32} clearcoat={0.5} emissive="#ff2a1a" emissiveIntensity={0.4 * beat} /></mesh>
      {[0, 1, 2].map((k) => <mesh key={k} position={[0, -0.0105, 0]} rotation={[PI / 2, 0, 0]}><ringGeometry args={[0.012 + k * 0.009, 0.015 + k * 0.009, 24]} /><meshBasicMaterial color="#9a958c" /></mesh>)}
      <mesh position={[0.03, -0.011, 0.0]}><sphereGeometry args={[0.007, 12, 10]} /><meshStandardMaterial color="#300" emissive="#ff2a1a" emissiveIntensity={3 * beat} toneMapped={false} /></mesh>
    </group>
    <pointLight position={[0.22, 0.6, 0.15]} intensity={1.4 * beat} distance={0.8} color="#ff3a2a" />
    {[0, 1].map((i) => { const q = ((tt - hitT) * 1.4 + i * 0.5 + 10) % 1; return <mesh key={"cp" + i} position={[0.22, 0.66, 0.02]} scale={alarm > 0 ? 0.5 + 2.2 * q : 0.001}><torusGeometry args={[0.07, 0.006, 8, 40]} /><meshBasicMaterial color="#ff3a2a" transparent opacity={0.8 * (1 - q)} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// 10:18 · 20 PIES DE LA CASA: el generador arranca pegado a la pared y se aleja sobre la nieve tirando la cinta métrica del carrete; el humo oscuro se va lejos
export const HGen20: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0b0f18" warm={0.6}
  cam={{ at: [0.02, 0.16, 0.08], az: [-0.1, -0.04], el: [0.36, 0.32], r: [2.2, 2.15], fov: 30 }} lamp={[0, 0.8, 0.5]}>{(tt) => {
  const gx = lerp(-0.4, 0.52, eio(tt, 0.2, 2.8)), tape = gx + 0.38, flag = cl(phys(tt, 2.85, 8, 0.45));
  return <>
    <Snow col="#d4dde8" />
    {/* pared de la casa a la izquierda, con ventana */}
    <mesh position={[-0.6, 0.3, 0]}><boxGeometry args={[0.06, 0.6, 0.9]} />{M.matte({ col: "#a89a86" })}</mesh>
    <mesh position={[-0.568, 0.36, -0.1]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.16, 0.14]} /><meshStandardMaterial color="#1a1612" emissive="#ffc46a" emissiveIntensity={0.8} /></mesh>
    {/* el carrete de la cinta en la pared y la cinta ancha que sale */}
    <RBox s={[0.08, 0.08, 0.05]} p={[-0.55, 0.05, 0.2]} r={0.012}>{M.plastic({ col: "#e8b62c" })}</RBox>
    <mesh position={[-0.53 + tape / 2, 0.006, 0.2]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[Math.max(0.001, tape), 0.05]} /><meshStandardMaterial color="#f2c21b" /></mesh>
    {Array.from({ length: 20 }, (_, i) => <mesh key={i} position={[-0.51 + i * 0.054, 0.007, 0.19]} rotation={[-PI / 2, 0, 0]} scale={i * 0.054 < tape ? 1 : 0.001}><planeGeometry args={[0.004, i % 5 ? 0.02 : 0.034]} /><meshBasicMaterial color="#111" /></mesh>)}
    {/* la banderita «20 FT» clavada en la nieve donde termina la cinta */}
    <group position={[(gx - 0.69) / 2, 0, 0.26]} scale={Math.max(0.001, flag)}>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.004, 0.004, 0.2, 8]} />{M.steel()}</mesh>
      <Txt3 txt="20 FT" w={0.16} h={0.07} bg="#f2c21b" col="#141516" p={[0.08, 0.17, 0]} />
    </group>
    {/* el generador: marco negro, tanque naranja, ruedas */}
    <group position={[gx, 0, 0]} scale={1.2}>
      <RBox s={[0.26, 0.16, 0.16]} p={[0, 0.1, 0]} r={0.012}>{M.plastic({ col: "#d8361f" })}</RBox>
      {[[-0.13, 0, -0.08], [0.13, 0, -0.08], [-0.13, 0, 0.08], [0.13, 0, 0.08]].map((p, i) => <mesh key={i} position={[p[0], 0.1, p[2]]}><boxGeometry args={[0.014, 0.2, 0.014]} />{M.matte({ col: "#1c1d20" })}</mesh>)}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.28, 10]} />{M.matte({ col: "#1c1d20" })}</mesh>
      {[-0.09, 0.09].map((z) => <mesh key={z} position={[-0.1, 0.03, z]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />{M.rubber({ col: "#151515" })}</mesh>)}
    </group>
    {Array.from({ length: 8 }, (_, i) => <mesh key={"hu" + i} rotation={[-PI / 2, 0, 0]} position={[-0.42 + i * 0.1, 0.003, -0.16 + (i % 2) * 0.04]} scale={i * 0.1 < gx + 0.3 ? 1 : 0.001}><circleGeometry args={[0.02, 12]} /><meshStandardMaterial color="#9aaabd" /></mesh>)}
    {/* surco en la nieve detrás del generador */}
    <mesh position={[(gx - 0.38) / 2, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[Math.max(0.001, gx + 0.38), 0.14]} /><meshStandardMaterial color="#aebccd" roughness={1} /></mesh>
    {/* humo gris oscuro y denso que sale para el lado contrario a la casa y se disipa lejos */}
    {Array.from({ length: 18 }, (_, i) => { const ph = (tt * 0.35 + i / 18) % 1; return <mesh key={i} position={[gx + 0.2 + ph * 0.6, 0.18 + ph * 0.3, 0.03 * Math.sin(i)]}><sphereGeometry args={[0.05 + ph * 0.13, 12, 10]} /><meshBasicMaterial color="#33373d" transparent opacity={0.78 * (1 - ph)} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// 11:06 · MODO AHORRO: el teléfono grande en primer plano; la batería cae en picada en rojo, el interruptor hace clic y la batería amarilla frena como rodillo
export const HLowPower: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" bg="#0f1014"
  cam={{ at: [0, 0.28, 0], az: [-0.3, -0.2], el: [0.14, 0.1], r: [0.92, 0.82], fov: 30 }} lamp={[0.3, 0.7, 0.4]}>{(tt) => {
  const lp = tt > 3.7, pct = tt < 3.7 ? lerp(100, 41, eio(tt, 0.3, 3.5)) : 41 + 3 * Math.sin((tt - 3.7) * 10) * Math.exp(-(tt - 3.7) * 3), sw = cl(phys(tt, 3.6, 12, 0.4));
  const cg = cl((100 - pct) / 50), col = lp ? "#f2c21b" : `rgb(${Math.round(lerp(77, 255, cg))},${Math.round(lerp(255, 59, cg))},${Math.round(lerp(154, 42, cg))})`, alert = !lp && pct < 75 ? 0.5 + 0.5 * Math.sin(tt * 20) : 0;
  return <>
    <mesh position={[0, 0.003, 0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.2, 32]} /><meshBasicMaterial color="#000" transparent opacity={0.45} depthWrite={false} /></mesh>
    <pointLight position={[0.4, 0.5, 0.3]} intensity={1.2} distance={1.4} color="#ffcf8a" />
    {/* fondo con profundidad: la lámpara y la ventana del cuarto, fuera de foco */}
    {([[-0.55, 0.42, -0.9, 0.09, "#ffb860"], [0.6, 0.55, -1.1, 0.12, "#ffcf8a"], [-0.2, 0.7, -1.3, 0.07, "#ff9a4a"]] as [number, number, number, number, string][]).map(([x, y, z, r, c], i) => <mesh key={"bk" + i} position={[x, y, z]}><sphereGeometry args={[r, 16, 12]} /><meshBasicMaterial color={c} transparent opacity={0.35} depthWrite={false} /></mesh>)}
    <group scale={pop(tt, 0.1)} rotation={[0, 0.25, 0]}>
      <RBox s={[0.26, 0.52, 0.03]} p={[0, 0.28, 0]} r={0.04}>{M.matte({ col: "#141414" })}</RBox>
      <mesh position={[0, 0.28, 0.0155]}><planeGeometry args={[0.23, 0.48]} /><meshStandardMaterial color="#0b0e14" emissive={alert ? "#4a0a0a" : "#18304a"} emissiveIntensity={0.6 + 0.4 * alert} /></mesh>
      <group position={[0, 0.38, 0.017]}>
        <mesh><planeGeometry args={[0.16, 0.08]} /><meshBasicMaterial color="#e8eef4" /></mesh>
        <mesh position={[0, 0, 0.0005]}><planeGeometry args={[0.15, 0.07]} /><meshBasicMaterial color="#0b0e14" /></mesh>
        <mesh position={[0.088, 0, 0]}><planeGeometry args={[0.012, 0.03]} /><meshBasicMaterial color="#e8eef4" /></mesh>
        <mesh position={[-0.072 + 0.072 * pct / 100, 0, 0.001]} scale={[Math.max(0.001, pct / 100), 1, 1]}><planeGeometry args={[0.144, 0.062]} />{M.glow({ col })}</mesh>
      </group>
      <Txt3 txt={`${Math.round(pct)}%`} w={0.16} h={0.075} col={lp ? "#f2c21b" : pct < 75 ? "#ff6a5a" : "#ffffff"} weight={900} p={[0, 0.27, 0.02]} />
      {/* el interruptor de modo ahorro */}
      <group position={[0, 0.15, 0.017]} scale={1.5 + 0.2 * Math.sin(PI * sw)}>
        <RBox s={[0.1, 0.05, 0.004]} r={0.024} shadow={false}>{M.glow({ col: lp ? "#f2c21b" : "#3a3f46" })}</RBox>
        <mesh position={[lerp(-0.025, 0.025, sw), 0, 0.003]}><circleGeometry args={[0.02, 24]} /><meshBasicMaterial color="#ffffff" /></mesh>
      </group>
      {/* reflejo de la lámpara cruzando el vidrio */}
      <mesh position={[lerp(-0.2, 0.2, eio(tt, 3.7, 4.4)), 0.3, 0.0175]} rotation={[0, 0, -0.6]} scale={tt > 3.7 && tt < 4.4 ? 1 : 0.001}><planeGeometry args={[0.05, 0.42]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.1} depthWrite={false} /></mesh>
    </group>
  </>;
}}</Scene3D>;
export { House, fall, tubeG };
