// lch29b · componentes únicos 15-21 (dos dedos, placard, moneda, fibra rota, caminito, mesa, lana).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Coin, Iron, Pile, Steam, Towel, dent, dentLine } from "./rug";

const PI = Math.PI;
const skin = <meshStandardMaterial color="#e2b896" roughness={0.6} />;

// ---- 7:10 · DOS DEDOS CADA PRIMAVERA: dos dedos marcan el ancho y la pata del aparador se corre justo eso ----
export const HTwoFingers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#16130f"
  cam={{ at: [0.03, 0.05, 0], az: [0.55, 0.35], el: [0.4, 0.45], r: [0.55, 0.48], fov: 30 }}>{(tt) => {
  const fin = phys(tt, 0.5, 7, 0.5) * (1 - eio(tt, 3.0, 3.6)), mv = eio(tt, 1.6, 3.0), DX = 0.045;
  return <>
    <Pile w={0.7} d={0.5} tt={tt} sq={(x, z) => dent(x, z, 0, 0, 0.022) * (1 - 0.6 * mv) + dent(x, z, DX, 0, 0.022) * mv * 0.25} />
    {/* la pata torneada de nogal y el borde del aparador */}
    <group position={[DX * mv, 0, 0]}>
      <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.016, 0.012, 0.12, 20]} /><meshStandardMaterial map={tex.wood(1, 2, [80, 46, 24])} roughness={0.5} /></mesh>
      <mesh position={[0, 0.03, 0]}><sphereGeometry args={[0.02, 20, 14]} /><meshStandardMaterial map={tex.wood(1, 1, [80, 46, 24])} roughness={0.5} /></mesh>
      <RBox s={[0.3, 0.05, 0.22]} p={[-0.1, 0.145, -0.06]} r={0.008}><meshStandardMaterial map={tex.wood(2, 1, [96, 58, 30])} roughness={0.5} /></RBox>
    </group>
    {/* dos dedos acostados sobre el pelo: índice y mayor */}
    {fin > 0.01 && <group position={[0.03, 0.03 + 0.15 * (1 - cl(fin)), 0.07]} rotation={[0, PI / 2, 0]}>
      {[0, 1].map((i) => <mesh key={i} position={[0, 0, (i - 0.5) * 0.022]} rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.0105, 0.07, 8, 16]} />{skin}</mesh>)}
    </group>}
  </>;
}}</Scene3D>;

// ---- 8:05 · LA PRUEBA DEL RINCÓN: al fondo del placard, diez segundos de vapor; el parche se pone brillante = olefina ----
export const HClosetTest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#110f0c" key1={[-0.5, 1.4, 1.6]}
  cam={{ at: [0, 0.08, -0.05], az: [-0.2, 0.05], el: [0.3, 0.32], r: [0.7, 0.62], fov: 32 }}>{(tt) => {
  const st = eio(tt, 0.5, 1.0) * (1 - eio(tt, 2.4, 2.7)), lift = eio(tt, 2.6, 3.2), shine = eio(tt, 3.0, 4.0);
  return <>
    <Pile w={0.7} d={0.5} tt={tt} col="#c7b38b" shine={(x, z) => shine * dent(x, z, 0, 0, 0.06)} sq={(x, z) => shine * 0.5 * dent(x, z, 0, 0, 0.06)} />
    {/* paredes del placard, zapatos corridos, la ropa colgada arriba */}
    <mesh position={[0, 0.3, -0.25]}><planeGeometry args={[0.7, 0.6]} /><meshStandardMaterial color="#d9cfbd" roughness={0.95} /></mesh>
    {/* la puerta del placard entreabierta, con su perilla */}
    <group position={[-0.35, 0, 0.25]} rotation={[0, 1.1, 0]}><mesh position={[0.17, 0.3, 0]}><boxGeometry args={[0.34, 0.6, 0.015]} /><meshStandardMaterial color="#efe9dc" roughness={0.7} /></mesh><mesh position={[0.31, 0.3, 0.012]}><sphereGeometry args={[0.012, 16, 12]} /><meshStandardMaterial color="#c9a24a" metalness={0.9} roughness={0.3} /></mesh></group>
    {[-1, 1].map((s) => <mesh key={s} position={[s * 0.35, 0.3, 0]} rotation={[0, -s * PI / 2, 0]}><planeGeometry args={[0.5, 0.6]} /><meshStandardMaterial color="#cfc4b0" roughness={0.95} /></mesh>)}
    {[[-0.22, 0.12], [-0.16, 0.15]].map(([x, z], i) => <group key={i} position={[x, 0.025, z]} rotation={[0, 0.4 + i * 0.2, 0]}><RBox s={[0.11, 0.04, 0.045]} r={0.015}><meshPhysicalMaterial color="#3a2414" roughness={0.3} clearcoat={0.8} /></RBox></group>)}
    {Array.from({ length: 6 }, (_, i) => <RBox key={i} s={[0.012, 0.22, 0.14]} p={[-0.2 + i * 0.075, 0.48, -0.15]} r={0.005}><meshStandardMaterial color={["#7b8fa6", "#c9a46a", "#8c3b34", "#e4e0d6", "#4f6b4c", "#a7a2c6"][i]} roughness={1} /></RBox>)}
    <mesh position={[0, 0.6, -0.15]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.7, 10]} />{M.chrome()}</mesh>
    {lift < 1 && <group position={[0, 0.024, 0]}><Towel w={0.22} d={0.15} wet={0.6} /></group>}
    <group position={[0, 0.062 + 0.2 * lift, 0]} rotation={[0, 0.5, 0]}><Iron hot={st} /></group>
    <Steam tt={tt} k={st} p={[0, 0.04, 0]} up={-0.15} spread={0.1} />
    {/* el destello duro del plástico derretido */}
    {shine > 0 && <mesh position={[0, 0.026, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.055, 32]} /><meshPhysicalMaterial color="#efe3c4" roughness={0.03} clearcoat={1} transparent opacity={0.75 * shine} /></mesh>}
  </>;
}}</Scene3D>;

// ---- 9:05 · LA MONEDA DE CANTO: raspa como un raspadita y las cuatro marquitas de la mesa ratona se borran ----
export const HCoinEdge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#16130f"
  cam={{ at: [0, 0.02, 0], az: [0.3, 0.1], el: [0.75, 0.8], r: [0.42, 0.38], fov: 30 }}>{(tt) => {
  const D = [[-0.06, -0.04], [0.06, -0.04], [-0.06, 0.04], [0.06, 0.04]], T0 = [0.6, 1.8, 3.0, 4.2];
  const cur = Math.min(3, Math.max(0, T0.findIndex((a) => tt < a + 1.2))), [dx, dz] = D[cur], k = cl((tt - T0[cur]) / 1.1);
  return <>
    <Pile w={0.5} d={0.4} tt={tt} sq={(x, z) => Math.max(...D.map(([a, b], i) => dent(x, z, a, b, 0.024) * (1 - eio(tt, T0[i], T0[i] + 1.1))))} />
    <group position={[dx + 0.02 * Math.sin(k * PI * 6), 0.034, dz]} rotation={[0, 0.5, 0.25 * Math.sin(k * PI * 6)]}><group scale={2.2}><Coin /></group></group>
  </>;
}}</Scene3D>;

// ---- 10:10 · LA FIBRA ROTA NO VUELVE: el vapor levanta las dobladas; las dos partidas se quedan en el piso ----
const brokenG = new THREE.CylinderGeometry(0.006, 0.006, 0.07, 8);
export const HBrokenFiber: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#1a1712" key1={[-1.0, 1.0, 1.2]}
  cam={{ at: [0, 0.07, 0], az: [-0.15, 0.1], el: [0.1, 0.14], r: [0.5, 0.45], fov: 32 }}>{(tt) => {
  const up = eio(tt, 1.0, 3.6), mark = cl((tt - 3.6) * 2);
  return <>
    <mesh position={[0, -0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.2, 0.6]} /><meshStandardMaterial color="#8a7a5c" roughness={1} /></mesh>
    <Steam tt={tt} k={eio(tt, 0.4, 1.0) * (1 - eio(tt, 3.2, 3.8))} p={[0, 0.15, 0]} up={-0.6} spread={0.4} n={20} />
    {Array.from({ length: 17 }, (_, i) => { const x = -0.24 + i * 0.03, broken = i === 6 || i === 11; const ang = broken ? 1.45 : lerp(1.35, 0.05 * (rn(i, 2) - 0.5), up);
      return broken ? <group key={i} position={[x, 0, 0]}>
        <mesh geometry={brokenG} position={[0, 0.03, 0]} scale={[1, 0.85, 1]}><meshPhysicalMaterial color="#c7b38a" roughness={0.5} sheen={1} /></mesh>
        <mesh geometry={brokenG} position={[0.05, 0.006, 0.01]} rotation={[0, 0.3, PI / 2 - 0.08]}><meshPhysicalMaterial color="#b9a47c" roughness={0.6} /></mesh>
        {mark > 0 && <mesh position={[0.02, 0.075, 0.02]}><ringGeometry args={[0.04, 0.046, 40]} /><meshBasicMaterial color="#ff5a4a" transparent opacity={mark} /></mesh>}
      </group> : <group key={i} position={[x, 0, (rn(i, 4) - 0.5) * 0.04]} rotation={[0, 0, -ang]}><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.005, 0.006, 0.14, 8]} /><meshPhysicalMaterial color="#d8c49c" roughness={0.5} sheen={1} sheenColor="#fff2d0" /></mesh></group>; })}
  </>;
}}</Scene3D>;

// ---- 11:00 · EL CAMINITO: la franja gastada del sofá a la cocina; rocío fino, el cepillo a contrapelo y la franja se para ----
export const HPathMist: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#16130f" key1={[-1.5, 0.6, 0.4]}
  cam={{ at: [0, 0.04, 0], at1: [0.05, 0.03, 0], az: [-0.3, -0.15], el: [0.55, 0.6], r: [0.85, 0.75], fov: 32 }}>{(tt) => {
  const mist = eio(tt, 0.4, 1.6), bx = lerp(0.55, -0.55, eio(tt, 1.8, 4.6));
  return <>
    <Pile w={1.3} d={0.7} tt={tt} sq={(x, z) => dentLine(x, z, -0.65, 0.65, 0, 0.08) * (x < bx ? 0.85 : 0.1)} wet={(x, z) => mist * 0.5 * dentLine(x, z, -0.65, 0.65, 0, 0.09)} />
    {/* la botella de rocío y su nube fina */}
    {tt < 1.9 && <group position={[lerp(-0.4, 0.4, mist), 0.16, -0.05]} rotation={[0, 0, 0.5]} scale={1.6}>
      <mesh><cylinderGeometry args={[0.025, 0.028, 0.1, 20]} />{M.plastic({ col: "#cfe6f2" })}</mesh>
      <RBox s={[0.03, 0.03, 0.02]} p={[0.0, 0.065, 0]} r={0.006}>{M.plastic({ col: "#f2f2f2" })}</RBox>
    </group>}
    {tt > 0.4 && tt < 1.9 && Array.from({ length: 40 }, (_, i) => { const ph = (tt * 1.6 + rn(i, 2)) % 1; return <mesh key={i} position={[lerp(-0.4, 0.4, mist) - 0.03 + (rn(i, 3) - 0.5) * 0.1 * ph, 0.14 - 0.12 * ph, -0.05 + (rn(i, 4) - 0.5) * 0.08 * ph]}><sphereGeometry args={[0.0025, 6, 5]} />{M.water({ op: 0.7 * (1 - ph) })}</mesh>; })}
    {/* el cepillo duro, a contrapelo */}
    {tt > 1.7 && tt < 4.8 && <group position={[bx, 0.06, 0]} rotation={[0, 0, 0.1 * Math.sin(tt * 18)]} scale={1.7}>
      <RBox s={[0.12, 0.03, 0.08]} r={0.01}><meshStandardMaterial map={tex.wood(1, 1, [150, 100, 58])} roughness={0.6} /></RBox>
      {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[-0.05 + (i % 8) * 0.014, -0.025, -0.025 + Math.floor(i / 8) * 0.025]}><cylinderGeometry args={[0.003, 0.002, 0.025, 5]} /><meshStandardMaterial color="#2a2420" /></mesh>)}
    </group>}
  </>;
}}</Scene3D>;

// ---- 11:50 · LA MESA CON SUS TABLAS: se abre la mesa del comedor; abajo, 4 pozos hondos y la ronda de marquitas de las sillas ----
export const HTableLeaves: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#16130f"
  cam={{ at: [0, 0.05, 0], az: [0.2, 0.05], el: [0.85, 0.95], r: [1.75, 1.55], fov: 32 }}>{(tt) => {
  const open = eio(tt, 0.5, 2.0), up = eio(tt, 2.2, 3.2);
  const LG = [[-0.32, -0.2], [0.32, -0.2], [-0.32, 0.2], [0.32, 0.2]], CH = [-0.25, -0.08, 0.08, 0.25].flatMap((x) => [[x, -0.36], [x, 0.36]]);
  const wd = <meshStandardMaterial map={tex.wood(2, 1, [110, 66, 34])} roughness={0.4} />;
  return <>
    <Pile w={1.3} d={1.0} step={0.012} tt={tt} sq={(x, z) => Math.max(...LG.map(([a, b]) => dent(x, z, a, b, 0.055)), ...CH.map(([a, b]) => 0.6 * Math.max(dent(x, z, a - 0.02, b, 0.012), dent(x, z, a + 0.02, b, 0.012))))} />
    <group position={[0, 0.32 * up, -0.25 * up]}>
      {[-1, 1].map((s) => <group key={s} position={[s * 0.12 * open, 0, 0]}>
        <RBox s={[0.42, 0.03, 0.5]} p={[s * 0.21, 0.28, 0]} r={0.008}>{wd}</RBox>
        {LG.filter(([a]) => a * s > 0).map(([a, b], i) => <mesh key={i} position={[a, 0.13, b]}><cylinderGeometry args={[0.022, 0.018, 0.26, 14]} />{wd}</mesh>)}
      </group>)}
    </group>
    {open > 0.6 && <RBox s={[0.22 * open, 0.03, 0.5]} p={[0, 0.28 + 0.32 * up, -0.25 * up]} r={0.008}><meshStandardMaterial map={tex.wood(1, 1, [128, 80, 42])} roughness={0.4} /></RBox>}
  </>;
}}</Scene3D>;

// ---- 12:45 · LANA: MÁS ARRIBA: la alfombra tejida de la abuela; la plancha a una pulgada, sólo vapor tibio ----
const hooked = () => tex.text("hooked", 256, 256, (g) => { g.fillStyle = "#6d2f2a"; g.fillRect(0, 0, 256, 256); const C = ["#d9b25a", "#e7dcc4", "#3f6a45", "#b8463c"]; for (let i = 0; i < 26; i++) { g.fillStyle = C[i % 4]; g.beginPath(); g.arc(rn(i, 2) * 256, rn(i, 3) * 256, 10 + 22 * rn(i, 4), 0, PI * 2); g.fill(); } for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(0,0,0,${0.08 * rn(i, 5)})`; g.fillRect(rn(i, 6) * 256, rn(i, 7) * 256, 2, 2); } });
export const HWoolHeight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#16130f"
  cam={{ at: [0, 0.08, 0], az: [0.12, -0.05], el: [0.12, 0.14], r: [0.7, 0.62], fov: 30 }}>{(tt) => {
  const rise = eio(tt, 0.5, 1.6), st = eio(tt, 1.4, 2.0), ruler = phys(tt, 1.0, 7, 0.5);
  return <>
    <mesh position={[0, 0.006, 0]}><boxGeometry args={[0.8, 0.012, 0.4]} /><meshStandardMaterial map={hooked()} roughness={1} /></mesh>
    <group position={[0, 0.013, 0]}><Towel w={0.3} d={0.2} wet={0.3} /></group>
    <group position={[0, lerp(0.05, 0.074, rise), 0]}><Iron hot={0} /></group>
    {/* la regla de madera parada al lado: una pulgada */}
    <group position={[0.14, 0.02 + 0.2 * (1 - cl(ruler)), 0.07]}>
      <RBox s={[0.02, 0.1, 0.004]} p={[0, 0.03, 0]} r={0.002}><meshStandardMaterial color="#e8d49a" roughness={0.6} /></RBox>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.004, -0.015 + i * 0.0127, 0.0025]}><boxGeometry args={[i % 2 ? 0.006 : 0.012, 0.0012, 0.001]} /><meshStandardMaterial color="#333" /></mesh>)}
      <mesh position={[-0.02, 0.033, 0.003]}><boxGeometry args={[0.02, 0.0018, 0.001]} /><meshStandardMaterial color="#ff5a4a" /></mesh>
    </group>
    <Steam tt={tt} k={st * 0.6} p={[0, 0.03, 0]} up={-0.05} spread={0.12} n={14} />
  </>;
}}</Scene3D>;
void Iron;
