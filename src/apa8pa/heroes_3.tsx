// MIO apa8pa · componentes únicos 14-28 min: dónde va, ratas, guardas, cobertura, el abuelo, y el ÚLTIMO CORTE.
import React from "react";
import * as THREE from "three";
import { H, Tag, AMB, RED, GRN, TX } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tubeG } from "./h3d";
import { Flag, MeshPanel, Rodent, SoilBlock } from "./farmkit";
import { AppleSlice, Blades, Dirt, Hawk, I, Lawn, Mower, PI, Robin, Shingle, Snake, Snow, SnapTrap, Tee, Trunk, Vole } from "./akit";

type P_ = { t: number; h: H };

// ---- 14:10 · EL MAPACHE LO HACE RODAR: la T da vueltas por el pasto; bajan dos hierros y queda clavada ----
export const HRebarPin: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1, 2, 1.2]}
  cam={{ at: [0, 0.05, 0], az: [0.45, 0.1], el: [0.42, 0.3], r: [1.3, 1.05], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="PIN IT OR IT ROLLS" col={TX} />}>{(tt) => {
  const r = eio(tt, 0.1, 1.6), a = phys(tt, 1.8, 9, 0.35), b = phys(tt, 2.4, 9, 0.35), rebar = (x: number, k: number) => <group position={[x, 0.08 + 0.7 * (1 - k), 0]}>
    <mesh geometry={tubeG("reb" + x, [[-0.06, -0.1, 0], [-0.05, 0.03, 0], [0, 0.08, 0], [0.05, 0.03, 0], [0.06, -0.1, 0]], 0.008, 40, 8)} castShadow><meshStandardMaterial color="#6a3c22" roughness={0.9} /></mesh>
  </group>;
  return <>
    <Lawn /><Tee p={[lerp(-0.9, 0, r), 0, lerp(0.2, 0, r)]} rot={[lerp(5.5, 0, r), 0, 0]} arm={14} />
    {rebar(-0.22, a)}{rebar(0.22, b)}
  </>;
}}</Scene3D>;

// ---- 14:42 · UN CÍRCULO DE SESENTA PIES: desde arriba, tres estaciones abren cada una su círculo de pasto iluminado ----
export const HSixtyCircle: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 3, 1]}
  cam={{ at: [0, 0, 0], az: [-0.12, 0.2], el: [1.15, 1.0], r: [3.2, 2.7], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={2.9} x={960} y={940} txt="BUILD THREE" col={AMB} size={60} />}>{(tt) => <>
  <Lawn />
  {[[-0.9, 0.2], [0.15, -0.35], [0.95, 0.35]].map(([x, z], i) => { const k = phys(tt, 0.3 + i * 0.9, 4, 0.7);
    return <group key={i} position={[x, 0, z]}>
      <Tee s={0.65} arm={14} rot={[0, i * 0.8, 0]} />
      <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[Math.max(0.01, 0.62 * k - 0.012), Math.max(0.02, 0.62 * k), 80]} />{M.glow({ col: "#ffcf7a", op: 0.9 })}</mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[Math.max(0.02, 0.62 * k), 80]} /><meshBasicMaterial color="#ffcf7a" transparent opacity={0.13} depthWrite={false} /></mesh>
    </group>; })}
</>}</Scene3D>;

// ---- 15:24 · SE MUDA: la estación salta de bandera en bandera ----
export const HMoveStation: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 3, 1]}
  cam={{ at: [0.1, 0, 0], az: [0.2, 0.0], el: [0.62, 0.5], r: [2.4, 2.0], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.6} x={960} y={940} txt="IT'S THE MOVING THAT WORKS" col={AMB} />}>{(tt) => {
  const fl = [[-0.95, 0.15], [-0.25, -0.2], [0.45, 0.22], [1.05, -0.1]], ph = cl((tt - 0.4) / 4.2) * 3, i = Math.min(2, Math.floor(ph)), k = eio(ph - i, 0.15, 0.9), q = lerp(fl[i][0], fl[i + 1][0], k), z = lerp(fl[i][1], fl[i + 1][1], k);
  return <>
    <Lawn />
    {fl.map(([x, z2], j) => <Flag key={j} p={[x + 0.12, 0, z2 - 0.1]} tt={tt} i={j} s={1.4} />)}
    <Tee p={[q, 0.32 * Math.sin(k * PI), z]} s={0.72} arm={14} rot={[0, 0.3, 0.14 * Math.sin(k * 2 * PI)]} />
  </>;
}}</Scene3D>;

// ---- 16:25 · UNA TALLA MÁS: el caño de seis aparece detrás del de tres; la rata se pone al lado y hace ver la escala ----
export const HRatPipe: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" key1={[-1, 2, 1.2]}
  cam={{ at: [0, 0.1, 0], az: [-0.3, 0.25], el: [0.24, 0.18], r: [1.5, 1.2], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="A RAT NEEDS MORE ROOM" col={TX} />}>{(tt) => {
  const a = phys(tt, 0.3, 6, 0.42), b = phys(tt, 1.6, 6, 0.42);
  return <>
    <Tee p={[0, 0, 0.28]} arm={14} riser={false} />
    <group position={[0, 0.4 * (1 - a), -0.12]}><Tee arm={15} r={3 * I} riser={false} /></group>
    <Rodent p={[lerp(1.1, 0.72, b), 0, 0.24]} rot={[0, PI, 0]} s={1.6} rat walk={tt * (b < 0.98 ? 1.5 : 0)} />
  </>;
}}</Scene3D>;

// ---- 17:04 · TRES NOCHES GRATIS: lunas que pasan arriba; la rata come con la trampa desarmada; a la cuarta luna la barra se levanta ----
export const HFreeNights: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[-0.8, 1.6, 0.9]} warm={0.5} bg="#090a12"
  cam={{ at: [0, 0.1, 0], az: [0.42, 0.15], el: [0.26, 0.2], r: [1.05, 0.86], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt={tt > 3.6 ? "NIGHT FOUR. SET IT." : "THREE NIGHTS FREE"} col={tt > 3.6 ? RED : AMB} />}>{(tt) => {
  const n = Math.min(3, Math.floor((tt - 0.2) / 1.2)), set = eio(tt, 3.6, 4.1);
  return <>
    <SnapTrap p={[-0.05, 0.02, 0]} rat s={1.4} snap={1 - set} dab={1.2} />
    <Rodent p={[0.32, 0.02, 0]} rot={[0, PI, 0]} s={1.15} rat walk={0} />
    {[0, 1, 2, 3].map((i) => <group key={i} position={[-0.6 + i * 0.4, 0.74, -0.2]}>
      <mesh><sphereGeometry args={[0.07, 28, 20]} />{M.glow({ col: i <= n ? "#f6edcc" : "#3a3c48", op: i <= n ? 1 : 0.5 })}</mesh></group>)}
    <pointLight position={[0, 1.0, 0.4]} intensity={1.8} distance={3} color="#9fb4ff" />
  </>;
}}</Scene3D>;

// ---- 18:05 · POR EL GALLINERO SE PASA: la malla hexagonal se traspasa; contra la de cuarto de pulgada se queda con el hocico ----
export const HChickenWire: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 2, 1.6]}
  cam={{ at: [0, 0.13, 0], az: [0.18, -0.1], el: [0.2, 0.15], r: [1.5, 1.26], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="QUARTER-INCH. NOT CHICKEN WIRE." col={AMB} />}>{(tt) => {
  const a = eio(tt, 0.5, 3.6), b = eio(tt, 0.9, 3.0), lt = tt > 3 ? Math.sin((tt - 3) * 11) * 0.008 : 0;
  return <>
    <Lawn />
    <group position={[-0.42, 0, 0]}><MeshPanel w={0.72} h={0.36} p={[0, 0.18, 0]} rot={[0, 0, 0]} cell={64} />
      <Vole p={[0, 0, lerp(-0.42, 0.34, a)]} rot={[0, -PI / 2, 0]} s={0.8} walk={tt * 2.4} /></group>
    <group position={[0.42, 0, 0]}><MeshPanel w={0.72} h={0.36} p={[0, 0.18, 0]} rot={[0, 0, 0]} cell={8} />
      <Vole p={[0, 0, lerp(-0.44, -0.085, b) + lt]} rot={[0, -PI / 2, 0]} s={0.8} walk={b < 1 ? tt * 2.4 : 0} /></group>
  </>;
}}</Scene3D>;

// ---- 18:44 · MÁS ALTO QUE TU NIEVE: la guarda alrededor del tronco, sube la nieve; el topillo camina encima y topa ----
export const HSnowLine: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1.2, 2.2, 1.4]}
  cam={{ at: [0, 0.32, 0], az: [-0.6, -0.18], el: [0.3, 0.2], r: [1.5, 1.2], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="TWO FEET · SUNK 3 INCHES" col={GRN} />}>{(tt) => {
  const s = eio(tt, 0.8, 2.8), v = eio(tt, 2.6, 4.4), y = 0.4 * s;
  return <>
    <Lawn /><Trunk r={0.085} h={1.4} />
    <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.15, 0.15, 0.5, 40, 1, true]} /><meshStandardMaterial color="#b9c0c4" metalness={0.8} roughness={0.5} wireframe /></mesh>
    <mesh position={[0, y / 2, 0]} scale={[1, Math.max(0.01, s), 1]}><cylinderGeometry args={[1.4, 1.5, 0.4, 56, 1]} /><meshPhysicalMaterial color="#eef3f8" roughness={0.8} /></mesh>
    <Vole p={[lerp(0.95, 0.27, v), y, 0.02]} rot={[0, PI, 0]} s={0.9} walk={v < 1 ? tt * 2 : 0} />
  </>;
}}</Scene3D>;

// ---- 19:30 · EL VOLCÁN: mulch en cono hasta el tronco, con puertitas iluminadas como hotel; se tira hacia atrás hasta dejar tierra limpia ----
export const HVolcano: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 2, 1.2]} warm={0.8}
  cam={{ at: [0, 0.16, 0], az: [0.5, 0.12], el: [0.26, 0.34], r: [1.25, 1.02], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={1.0} x={960} y={940} txt={tt < 2.6 ? "THE BEST VOLE HOTEL" : "BARE GROUND AROUND THE TRUNK"} col={tt < 2.6 ? RED : GRN} />}>{(tt) => {
  const p = eio(tt, 2.3, 3.8), cone = lerp(1, 0.08, p);
  return <>
    <Lawn /><Trunk r={0.075} h={1.3} />
    <mesh position={[0, 0.17 * cone, 0]} scale={[1 + 0.5 * p, cone, 1 + 0.5 * p]}><coneGeometry args={[0.6, 0.36, 56, 1, true]} /><meshStandardMaterial color="#6a4526" roughness={1} side={THREE.DoubleSide} /></mesh>
    <mesh visible={p > 0.3} position={[0, 0.0045, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.28, 48]} /><meshStandardMaterial color="#4a3320" roughness={1} /></mesh>
    {Array.from({ length: 6 }, (_, i) => { const a = i * 1.05, r = 0.33; return <mesh key={i} position={[r * Math.sin(a), 0.1, r * Math.cos(a)]} rotation={[-0.5, a, 0]}><planeGeometry args={[0.05, 0.08]} />{M.glow({ col: "#ffd27a", op: (1 - p) * cl(tt * 3 - i * 0.5) })}</mesh>; })}
    {Array.from({ length: 80 }, (_, i) => { const a = rn(i, 2) * 6.28, r = (0.1 + rn(i, 3) * 0.45) * (1 + p * 0.9); return <mesh key={i} position={[r * Math.sin(a), 0.01 + (1 - r) * 0.1 * (1 - p), r * Math.cos(a)]} rotation={[rn(i, 4) * 3, rn(i, 5) * 3, 0]} castShadow><boxGeometry args={[0.05, 0.008, 0.02]} /><meshStandardMaterial color={i % 3 ? "#7a4f2a" : "#5a3a20"} roughness={1} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 19:58 · UN RÍO ANCHO: pasto alto de un lado, los árboles del otro, en medio tres pies de pelado; el topillo asoma, olfatea y se vuelve ----
export const HWideRiver: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 2.4, 1]}
  cam={{ at: [0, 0.04, 0], az: [0.65, 0.32], el: [0.45, 0.32], r: [1.8, 1.45], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="THREE FEET IS A RIVER" col={AMB} />}>{(tt) => {
  const v = eio(tt, 0.8, 2.1), tu = eio(tt, 3.0, 3.8), x = lerp(-1.0, -0.42, v) - 0.3 * tu;
  return <>
    <Lawn />
    <Blades w={0.9} d={2.4} n={380} h={0.3} p={[-1.0, 0, 0]} col="#6f7a3a" />
    <Trunk p={[0.75, 0, -0.3]} r={0.07} h={1.1} /><Trunk p={[0.85, 0, 0.42]} r={0.06} h={1.0} />
    <Vole p={[x, 0, 0.1]} rot={[0, PI * tu, 0]} s={1.2} walk={v < 1 || tu > 0 ? tt * 1.6 : 0} />
  </>;
}}</Scene3D>;

// ---- 22:05 · LA RONDA DEL CAFÉ: el pretil del porche con muescas y la taza que va saltando día a día ----
export const HCoffeeRail: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 2, 1.4]}
  cam={{ at: [0, 0.72, 0], az: [-0.3, 0.3], el: [0.3, 0.2], r: [1.8, 1.45], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="FIVE MINUTES WITH YOUR COFFEE" col={TX} />}>{(tt) => {
  const N = 8, ph = cl((tt - 0.2) / 4.5) * (N - 1), i = Math.min(N - 2, Math.floor(ph)), k = eio(ph - i, 0.15, 0.85), x0 = -0.84, dx = 0.24, x = lerp(x0 + i * dx, x0 + (i + 1) * dx, k);
  return <>
    <Lawn />
    {[-1.02, 0, 1.02].map((px) => <RBox key={px} s={[0.09, 0.68, 0.09]} p={[px, 0.32, 0]} r={0.01}>{M.wood({ base: [108, 78, 50] })}</RBox>)}
    <group position={[0, 0.68, 0]}>
    <RBox s={[2.5, 0.05, 0.3]} p={[0, -0.025, 0]} r={0.01}>{M.wood({ base: [132, 96, 62] })}</RBox>
    {Array.from({ length: N }, (_, j) => <mesh key={j} position={[x0 + j * dx, 0.002, 0.06]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.042, 0.052, 32]} /><meshBasicMaterial color="#3a2415" transparent opacity={j < ph ? 0.85 : 0.2} /></mesh>)}
    <group position={[x, 0.11 * Math.sin(k * PI), 0.06]}>
      <mesh position={[0, 0.05, 0]} castShadow><cylinderGeometry args={[0.05, 0.043, 0.1, 40]} />{M.porcelain({ col: "#f2efe7" })}</mesh>
      <mesh position={[0, 0.1005, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.044, 32]} /><meshPhysicalMaterial color="#2c1a0e" roughness={0.15} clearcoat={1} /></mesh>
      <mesh position={[0.058, 0.05, 0]}><torusGeometry args={[0.024, 0.006, 10, 24]} />{M.porcelain({ col: "#f2efe7" })}</mesh>
    </group>
    </group>
  </>;
}}</Scene3D>;

// ---- 22:58 · TIERRA DE PIEDRA: la pala baja contra el suelo helado y rebota con chispa ----
export const HFrozenDirt: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1.2, 2, 1.2]} warm={0.7} bg="#101419"
  cam={{ at: [0, 0.34, 0], az: [-0.42, 0.08], el: [0.24, 0.22], r: [1.5, 1.24], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.6} x={960} y={940} txt="BEFORE THE GROUND FREEZES" col={RED} />}>{(tt) => {
  const f = phys(tt, 0.5, 10, 0.22), o = tt > 0.75, s = Math.max(0, 1 - (tt - 0.75) * 2.4), cr = eio(tt, 0.75, 1.05);
  return <>
    <Dirt w={7} d={7} rx={6} p={[0, 0, 0]} />
    <mesh position={[0, 0.0035, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[7, 7]} /><meshPhysicalMaterial color="#d9e4ec" transparent opacity={0.46} roughness={0.3} clearcoat={1} /></mesh>
    {Array.from({ length: 9 }, (_, i) => { const a = i * 0.7 + rn(i, 2), L = (0.1 + rn(i, 3) * 0.18) * cr; return <mesh key={i} visible={cr > 0.01} position={[Math.cos(a) * L / 2, 0.0055, Math.sin(a) * L / 2]} rotation={[-PI / 2, 0, a]}><planeGeometry args={[Math.max(0.001, L), 0.0045]} /><meshBasicMaterial color="#20262b" /></mesh>; })}
    <group position={[0, 0.215 + 0.36 * (1 - f), 0]} rotation={[0, 0.2, 0.1]}>
      <RBox s={[0.15, 0.2, 0.012]} p={[0, -0.1, 0]} r={0.006}>{M.steel({ col: "#8f8f8f" })}</RBox>
      <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.024, 0.042, 0.08, 18]} />{M.steel({ col: "#6e6e6e" })}</mesh>
      <mesh position={[0, 0.42, 0]} castShadow><cylinderGeometry args={[0.016, 0.018, 0.74, 14]} />{M.wood({ base: [176, 134, 84] })}</mesh>
      <mesh position={[0, 0.81, 0]} rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.014, 0.1, 6, 12]} />{M.wood({ base: [150, 112, 70] })}</mesh>
    </group>
    {Array.from({ length: 12 }, (_, i) => { const a = i * 0.8, k2 = 1 - s; return <mesh key={i} visible={o && s > 0} position={[0.32 * k2 * Math.cos(a), 0.02 + 0.2 * Math.sin(k2 * PI) * (0.5 + rn(i, 2)), 0.32 * k2 * Math.sin(a)]}><sphereGeometry args={[0.006, 8, 6]} />{M.glow({ col: "#ffd27a", op: s })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 23:40 · LA CULEBRA: serpentea por el pasto y entra por el agujero, donde no llega el halcón ----
export const HBlackSnake: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 2, 1.2]}
  cam={{ at: [0.1, 0.03, 0], az: [0.3, -0.05], el: [0.52, 0.42], r: [1.25, 1.02], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={940} txt="HE NEVER KILLED A SNAKE" col={AMB} />}>{(tt) => {
  const path = (u: number) => { const x = lerp(-1.1, 0.55, u); return [Math.min(x, 0.55), x > 0.5 ? 0.012 - (x - 0.5) * 1 : 0.02, 0.14 * Math.sin(u * 11) * (1 - u)]; };
  return <>
    <Lawn />
    <mesh position={[0.56, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.06, 32]} /><meshBasicMaterial color="#050403" /></mesh>
    <Snake path={path} head={0.4 + 0.75 * cl(tt / 5.2)} />
    <Blades w={2} d={1.3} n={260} h={0.06} skip={(x, z) => Math.hypot(x - 0.56, z) < 0.12 || Math.abs(z) < 0.03} />
  </>;
}}</Scene3D>;

// ---- 24:02 · EL POSTE CON TRAVESAÑO: sube el poste en el borde de la huerta y el halcón baja y se posa ----
export const HPerchPost: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 2.4, 1.3]}
  cam={{ at: [0, 1.22, 0], az: [0.42, 0.1], el: [0.02, 0.06], r: [3.1, 2.7], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="A HAWK ON DUTY" col={AMB} />}>{(tt) => {
  const u = phys(tt, 0.2, 4, 0.6), l = eio(tt, 1.9, 3.3), y = 1.55 * u;
  return <>
    <Lawn />
    <mesh position={[0, y / 2, 0]} castShadow scale={[1, Math.max(0.02, u), 1]}><cylinderGeometry args={[0.05, 0.06, 1.55, 16]} />{M.wood({ base: [120, 88, 56] })}</mesh>
    <RBox s={[0.6, 0.05, 0.06]} p={[0, y, 0]} r={0.01}>{M.wood({ base: [130, 96, 62] })}</RBox>
    <Hawk p={[lerp(1.4, 0.12, l), y + 0.03 + 0.8 * (1 - l), 0]} s={1.3} rot={[0, PI, l < 0.9 ? 0.15 : 0]} head={0.3 * Math.sin(tt * 0.9)} />
  </>;
}}</Scene3D>;

// ---- 21:30 · NINGÚN PÁJARO ENTRA: el caño abierto en corte; arriba el petirrojo picotea el techo; la trampa queda lejos, adentro y a oscuras ----
export const HBirdRoof: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 2, 1.3]}
  cam={{ at: [0.02, 0.1, 0], az: [-0.08, 0.1], el: [0.14, 0.1], r: [1.1, 0.9], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="A ROOF AND A SMALL HOLE" col={GRN} />}>{(tt) => {
  const l = phys(tt, 0.5, 6, 0.5), pk = Math.max(0, Math.sin(tt * 7)) * eio(tt, 1.4, 1.8) * (1 - eio(tt, 4.6, 5));
  return <>
    <Lawn />
    <Tee cut arm={14} riser={false} door />
    <SnapTrap p={[-0.08, 0.012, 0]} s={1} />
    <group position={[0.04, 0.1 + 0.6 * (1 - l), 0]} rotation={[0, 0, -0.42 * pk]}><Robin rot={[0, PI, 0]} s={0.9} /></group>
  </>;
}}</Scene3D>;

// ---- 24:40 · VUELVE LIMPIA: la teja se levanta y la rodaja está entera; la bandera sale de la tierra y se va ----
export const HCleanSlice: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-0.8, 2, 1]}
  cam={{ at: [0, 0.04, 0], az: [-0.5, -0.18], el: [0.62, 0.48], r: [0.62, 0.48], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.6} x={960} y={940} txt="UNTOUCHED. YOU'RE DONE." col={GRN} />}>{(tt) => {
  const s = eio(tt, 0.3, 1.4), f = eio(tt, 3.2, 4.4);
  return <>
    <Lawn /><Blades w={1.6} d={1} n={260} h={0.07} skip={(x, z) => Math.hypot(x, z) < 0.2} />
    <AppleSlice s={1.3} p={[0, 0.003, 0]} />
    <Shingle p={[0.06 + 0.5 * s, 0.05 + 0.3 * s, -0.2 * s]} rot={[0.8 * s, 0, 0.9 * s]} s={1.2} />
    <Flag p={[-0.2, 1.1 * f, -0.08]} tt={tt} i={3} s={1.2} />
  </>;
}}</Scene3D>;

// ---- 25:20 · HUMO POR LA PUERTA DE ATRÁS: el corte de cuevas; el humo se va por todos los otros agujeros ----
export const HGasBack: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 2, 1.4]}
  cam={{ at: [0, -0.05, 0], az: [0.06, -0.14], el: [0.1, 0.16], r: [1.8, 1.5], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={940} txt="OUT THE BACK DOOR" col={RED} />}>{(tt) => {
  const xh = [-0.72, -0.28, 0.18, 0.66];
  return <>
    <SoilBlock w={2.4} h={0.5} d={0.6} p={[0, 0, 0]} />
    <mesh position={[0, -0.16, 0.301]}><planeGeometry args={[1.7, 0.09]} /><meshBasicMaterial color="#0d0805" /></mesh>
    {xh.map((x) => <mesh key={x} position={[x, -0.07, 0.3015]}><planeGeometry args={[0.07, 0.15]} /><meshBasicMaterial color="#0d0805" /></mesh>)}
    {Array.from({ length: 50 }, (_, i) => { const ph = ((tt * 0.55 + i * 0.13) % 1), x0 = xh[i % 3 + 1], p2 = cl(ph * 1.8), up = cl(ph * 1.8 - 1), x = lerp(-0.72, x0, p2), y = -0.16 + up * 0.5, o = cl(tt * 1.5) * (1 - up);
      return <mesh key={i} position={[x, y, 0.32]}><sphereGeometry args={[0.024 + 0.05 * up, 12, 10]} /><meshBasicMaterial color="#cfd2d5" transparent opacity={0.34 * o} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 25:50 · EL PUENTE: el anillo blanco y tres ramitas que cruzan de la corteza de arriba a la de abajo y se prenden ----
export const HBridgeGraft: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-0.9, 1.8, 1.2]}
  cam={{ at: [0, 0.2, 0], az: [0.3, -0.25], el: [0.1, 0.16], r: [0.84, 0.66], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="A BRIDGE GRAFT" col={GRN} />}>{(tt) => <>
  <Lawn /><Trunk r={0.115} h={1.3} ring={1} band={0.22} y0={0.08} />
  {[-0.7, 0, 0.7].map((a, i) => { const k = phys(tt, 0.7 + i * 0.7, 6, 0.55);
    return <group key={i} rotation={[0, a, 0]} scale={[1, Math.max(0.02, k), 1]}>
      <mesh geometry={tubeG("br" + i, [[0, 0.02, 0.118], [0, 0.07, 0.13], [0, 0.15, 0.135], [0, 0.26, 0.13], [0, 0.34, 0.118]], 0.009, 30, 10)} castShadow><meshStandardMaterial color="#5c4228" roughness={0.9} /></mesh>
      {[0.075, 0.28].map((y) => <mesh key={y} position={[0, y, 0.13]}><sphereGeometry args={[0.014, 12, 10]} />{M.glow({ col: "#a9e68a", op: eio(tt, 2.8 + i * 0.3, 3.6 + i * 0.3) })}</mesh>)}
    </group>; })}
</>}</Scene3D>;

// ---- 26:30 · CTA GRATIS: una hoja doblada baja al pasto, se abre sola, y encima van cayendo las marcas de cada bicho ----
export const HDigKey: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1, 2.4, 1.2]}
  cam={{ at: [0, 0.02, 0], az: [-0.18, 0.2], el: [0.84, 0.7], r: [1.15, 0.94], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.7} x={960} y={930} txt="FREE DIG KEY · BELOW" col={AMB} />}>{(tt) => {
  const o = eio(tt, 0.6, 1.8), Y = phys(tt, 0.1, 6, 0.55), mk = (i: number, n: React.ReactNode) => <group key={i} position={[-0.18 + i * 0.18, 0.03 + 0.3 * (1 - phys(tt, 2.0 + i * 0.4, 7, 0.4)), 0.02]}>{n}</group>;
  return <>
    <Lawn />
    <group position={[0, 0.012 + 0.5 * (1 - Y), 0]}>
      <mesh rotation={[-PI / 2, 0, 0]} receiveShadow castShadow><planeGeometry args={[0.72, 0.5]} /><meshStandardMaterial color="#efe6d2" roughness={0.85} /></mesh>
      <mesh position={[0.36 - 0.36 * o, 0.0008 + 0.14 * Math.sin(o * PI), 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.72 * (1 - o) + 0.0001, 0.5]} /><meshStandardMaterial color="#e6dac0" roughness={0.85} side={THREE.DoubleSide} /></mesh>
    </group>
    {mk(0, <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.05, 24]} /><meshBasicMaterial color="#1b130c" /></mesh>)}
    {mk(1, <mesh scale={[1, 0.5, 1]} castShadow><sphereGeometry args={[0.07, 24, 18]} /><meshStandardMaterial color="#3a2a1c" roughness={1} /></mesh>)}
    {mk(2, <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.12, 0.05]} /><meshStandardMaterial color="#7a5a37" /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 27:44 · UNA MUESCA MÁS ABAJO: la palanca salta una muesca; el filo baja ----
export const HLastNotch: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 2, 1.2]}
  cam={{ at: [-0.05, 0.18, 0], az: [-0.62, -0.32], el: [0.34, 0.24], r: [1.5, 1.2], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.4} x={960} y={940} txt="ONE NOTCH LOWER" col={AMB} size={54} />}>{(tt) => {
  const d = phys(tt, 1.0, 11, 0.32);
  return <>
    <Lawn />
    <Mower deck={d} spin={tt * 12} rot={[0, 0.2, 0]} />
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0.18, 0.2 - i * 0.03, 0.26]}><boxGeometry args={[0.036, 0.012, 0.012]} />{M.steel({ col: i === Math.round(1 + d) ? "#ffcf7a" : "#a8a8a8" })}</mesh>)}
  </>;
}}</Scene3D>;

// ---- 28:05 · TRES PIES DE PISO LIMPIO: de arriba, la cortadora abre un anillo al ras alrededor del árbol ----
export const HThreeFootRing: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 3, 1]}
  cam={{ at: [0, 0, 0], az: [0.22, -0.22], el: [1.1, 0.92], r: [2.5, 2.1], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={940} txt="TEN MINUTES · ZERO DOLLARS" col={GRN} />}>{(tt) => {
  const a = Math.max(0.001, eio(tt, 0.3, 4.2) * 2 * PI), R = 0.54;
  return <>
    <Lawn />
    <Blades w={3} d={2.2} n={420} h={0.16} col="#66803f" skip={(x, z) => { const r = Math.hypot(x, z); if (r > R + 0.13) return false; let an = Math.atan2(z, x); if (an < 0) an += 2 * PI; return an < a; }} />
    <mesh position={[0, 0.0025, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[R + 0.13, 64, 0, a]} /><meshStandardMaterial color="#8fa05c" roughness={1} /></mesh>
    <Trunk r={0.07} h={1.1} />
    <Mower p={[R * Math.cos(a), 0, R * Math.sin(a)]} rot={[0, -a - PI / 2, 0]} s={0.42} deck={1} spin={tt * 12} />
  </>;
}}</Scene3D>;

// ---- 28:32 · LA NIEVE SE PEGA: el mismo corte dos veces; con pasto largo queda el hueco; al ras la nieve asienta y no queda dónde pasar ----
export const HSnowPacks: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1.2, 2.2, 1.4]}
  cam={{ at: [0, 0.14, 0], az: [0.02, -0.14], el: [0.08, 0.14], r: [2.2, 1.85], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={940} txt="NO ROOF. NO ROAD." col={AMB} size={54} />}>{(tt) => {
  const s = phys(tt, 0.3, 4, 0.74), side = (x: number, tall: boolean) => { const yb = tall ? 0.14 : 0.04; return <group position={[x, 0, 0]}>
    <SoilBlock w={1.45} h={0.2} d={0.6} p={[0, 0, 0]} />
    <Blades w={1.4} d={0.6} n={200} h={tall ? 0.15 : 0.03} seed={tall ? 3 : 8} />
    <Snow s={[1.45, 0.3, 0.6]} p={[0, yb + 0.15 + 0.7 * (1 - s), 0]} />
    {tall && <Vole p={[0, 0.0, 0.31]} s={0.9} walk={tt * 1.2} />}
    {!tall && <Vole p={[-0.6, 0.34 + 0.7 * (1 - s), 0.1]} rot={[0, 0.3, 0]} s={0.7} walk={0} />}
  </group>; };
  return <>{side(-0.78, true)}{side(0.78, false)}</>;
}}</Scene3D>;
