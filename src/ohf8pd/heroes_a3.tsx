// ohf8pd · componentes únicos 18-36: tapón en corte, rejilla que respira, campana de CO, ascensor cortado, trampa en ángulo, cuatro noches, balde, olor, lo que no tapa, grava, rama, reloj, cuenta, golf, portón, malla, desfile, caja, récord
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Tape } from "./okit";
import { CopperWad, Mouse, PI, Ring, SnapTrap, stoneTex, sv } from "./rkit";

const paper = (a: string) => <meshStandardMaterial color={a} roughness={0.9} />;
const siding = (key: string, base: string, line: string) => <meshStandardMaterial map={tex.text(key, 512, 512, (g) => { g.fillStyle = base; g.fillRect(0, 0, 512, 512); g.fillStyle = line; for (let i = 0; i < 16; i++) g.fillRect(0, i * 32 + 28, 512, 3); })} roughness={0.85} />;

// ---- EL TAPÓN EN CORTE: el cobre entra con el destornillador, queda medio dedo adentro y el sellador cierra la cara ----
export const HPlugCut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[0.8, 2, 2]}
  cam={{ at: [0.12, 0.5, 0], az: [0.16, -0.14], el: [0.08, 0.05], r: [1.5, 1.34], fov: 32 }}>{(tt) => { const push = eio(tt, 0.5, 2.3), wx = lerp(0.9, -0.05, push), drv = lerp(1.32, 0.42, push) + 0.9 * eio(tt, 2.4, 3.0), fill = eio(tt, 3.2, 4.3), knife = eio(tt, 4.5, 5.6);
  return <>
    {[1, -1].map((s) => <RBox key={s} s={[1.2, 0.4, 0.5]} p={[-0.25, 0.5 + s * 0.32, 0]} r={0.006}>{M.wood({ rx: 2, ry: 2, base: s > 0 ? [168, 128, 84] : [150, 112, 72] })}</RBox>)}
    <RBox s={[1.2, 0.26, 0.02]} p={[-0.25, 0.5, -0.24]} r={0.002}>{paper("#120d09")}</RBox>
    <CopperWad id="plg" p={[wx, 0.5, 0]} w={0.5} h={0.23} d={0.3} n={80} k={1} />
    {fill > 0 && <mesh position={[0.28, 0.37 + 0.13 * fill, 0]} scale={[1, Math.max(0.002, fill), 1]}><boxGeometry args={[0.13, 0.26, 0.42]} /><meshStandardMaterial color="#d5d0c4" roughness={lerp(0.75, 0.3, knife)} /></mesh>}
    <group position={[drv, 0.5, 0.0]}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.018, 0.018, 0.7, 14]} />{M.chrome()}</mesh>
      <mesh position={[0.46, 0, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.3, 22]} />{M.matte({ col: "#b3261e" })}</mesh>
    </group>
    {knife > 0 && knife < 1 && <RBox s={[0.02, 0.32, 0.46]} p={[0.38, lerp(0.74, 0.26, knife), 0]} r={0.003}>{M.steel({ col: "#c8ccd0" })}</RBox>}
    <RBox s={[0.13, 0.02, 0.12]} p={[0.285, 0.69, 0.26]} r={0.002}><meshStandardMaterial color="#f2c531" metalness={0.3} roughness={0.35} /></RBox>
    <Tape txt="1/2 INCH" p={[0.5, 0.78, 0.26]} w={0.34} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- LA REJILLA QUE RESPIRA: las aletas se abren solas, sale pelusa; el cobre se acerca y se va ----
export const HBreathe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-0.6, 2.4, 2]}
  cam={{ at: [0.05, 0.55, 0], az: [-0.42, -0.1], el: [0.1, 0.05], r: [1.45, 1.3], fov: 32 }}>{(tt) => { const blow = 0.5 + 0.5 * Math.sin(tt * 3.2), w = eio(tt, 1.6, 2.6) * (1 - eio(tt, 3.4, 4.4));
  return <>
    <RBox s={[3.4, 1.6, 0.06]} p={[0, 0.6, -0.08]} r={0.004}>{siding("sb", "#b9b3a2", "#7f7a6b")}</RBox>
    <RBox s={[0.46, 0.46, 0.05]} p={[0, 0.55, -0.03]} r={0.006}><meshStandardMaterial color="#e8e3d7" roughness={0.55} /></RBox>
    {[0, 1, 2].map((i) => <group key={i} position={[0, 0.72 - i * 0.14, 0.0]} rotation={[-0.38 - 0.62 * blow, 0, 0]}><RBox s={[0.38, 0.135, 0.008]} p={[0, -0.067, 0]} r={0.003}><meshStandardMaterial color="#efeadf" roughness={0.45} /></RBox></group>)}
    {Array.from({ length: 22 }, (_, i) => { const u = (tt * 0.42 + rn(i, 1)) % 1; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.36 + u * (rn(i, 3) - 0.5) * 0.4, 0.5 - u * 0.1, 0.1 + u * 0.75]} scale={[1, 0.7, 1]}><sphereGeometry args={[0.016 + rn(i, 4) * 0.02, 8, 6]} /><meshStandardMaterial color="#cfc8b8" roughness={1} transparent opacity={0.7 * (1 - u)} depthWrite={false} /></mesh>; })}
    <group position={[lerp(1.0, 0.26, w) + (w > 0.9 ? 0.012 * Math.sin(tt * 30) : 0), 0.55, 0.26]}><CopperWad id="brt" w={0.2} h={0.16} d={0.16} n={40} k={1} /></group>
    <Tape txt="NEVER PLUG THIS" col="#b3261e" p={[0.08, 0.86, 0.1]} w={0.6} k={phys(tt, 3.3, 8, 0.45)} rev={cl((tt - 3.3) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- LA CAMPANA: casita bajo vidrio; el humo ya no se va y el detector parpadea ----
export const HCoGauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="none" key1={[-0.6, 2.2, 1.9]}
  cam={{ at: [0.2, 0.62, 0], az: [-0.24, 0.16], el: [0.16, 0.1], r: [2.2, 2.0], fov: 32 }}>{(tt) => { const fill = eio(tt, 0.5, 4.4), blink = tt > 3.6 && Math.floor(tt * 2.6) % 2 === 0;
  return <>
    <RBox s={[0.44, 0.3, 0.36]} p={[-0.14, 0.2, 0]} r={0.008}>{siding("sc", "#ded7c3", "#a39c87")}</RBox>
    <mesh position={[-0.14, 0.45, 0]} rotation={[0, PI / 4, 0]} scale={[1, 0.62, 1]} castShadow><coneGeometry args={[0.36, 0.34, 4]} /><meshStandardMaterial color="#7a3a2a" roughness={0.8} /></mesh>
    <RBox s={[0.07, 0.2, 0.07]} p={[-0.02, 0.56, 0]} r={0.004}>{paper("#8f4a36")}</RBox>
    {Array.from({ length: 46 }, (_, i) => { const u = cl(fill * 1.25 - rn(i, 2) * 0.25), a = rn(i, 3) * PI * 2, R = 0.08 + rn(i, 4) * 0.34 * u; return <mesh key={i} position={[-0.14 + Math.cos(a) * R, 0.56 + u * (0.08 + rn(i, 5) * 0.36) - (1 - u) * 0.0, Math.sin(a) * R]} scale={[sv(u), sv(u), sv(u)]}><sphereGeometry args={[0.05 + rn(i, 6) * 0.05, 12, 9]} /><meshStandardMaterial color="#8a8f92" roughness={1} transparent opacity={0.26} depthWrite={false} /></mesh>; })}
    <mesh position={[-0.14, 0.53, 0]}><cylinderGeometry args={[0.47, 0.47, 0.96, 56, 1, true]} /><meshPhysicalMaterial color="#e9f4f7" transparent opacity={0.09} roughness={0.04} clearcoat={1} side={2} depthWrite={false} /></mesh>
    <mesh position={[-0.14, 1.01, 0]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.47, 56, 20, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color="#e9f4f7" transparent opacity={0.09} roughness={0.04} clearcoat={1} side={2} depthWrite={false} /></mesh>
    <group position={[0.72, 0.26, 0.1]} rotation={[0, -0.3, 0]}>
      <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.06, 40]} /><meshStandardMaterial color="#efeadf" roughness={0.45} /></mesh>
      <mesh position={[0, 0.06, 0.033]}><circleGeometry args={[0.04, 24]} /><meshBasicMaterial color={blink ? "#ff3b2f" : "#581813"} /></mesh>
    </group>
    <Tape txt="WORKING CO ALARM" p={[0.74, 0.6, 0.16]} w={0.5} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- CORTÁS EL CABLE: la cabina sube, las tijeras cortan y cae sobre el cobre ----
export const HCableCut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-0.4, 3, 2.4]}
  cam={{ at: [0, 1.0, 0], az: [-0.24, 0.16], el: [0.04, 0.02], r: [3.2, 2.95], fov: 32 }}>{(tt) => { const up = eio(tt, 0.3, 2.3), fall = phys(tt, 3.3, 5, 0.3), y = lerp(0.35, 1.2, up) - (tt > 3.3 ? 0.74 * fall : 0), snip = eio(tt, 2.8, 3.3), cut = tt > 3.3;
  return <>
    <RBox s={[1.0, 2.6, 0.02]} p={[0, 1.3, -0.26]} r={0.002}>{M.wood({ rx: 3, ry: 4, base: [92, 62, 36] })}</RBox>
    {[-0.5, 0.5].map((x) => <RBox key={x} s={[0.08, 2.6, 0.5]} p={[x, 1.3, 0]} r={0.006}>{M.wood({ rx: 1, ry: 5, base: [158, 116, 72] })}</RBox>)}
    <RBox s={[1.9, 0.12, 0.6]} p={[0, 0.06, 0]} r={0.006}><meshStandardMaterial map={stoneTex("cc", 3, 1)} roughness={0.95} /></RBox>
    <CopperWad id="cc" p={[0, 0.25, 0]} w={0.82} h={0.26} d={0.4} n={120} k={eio(tt, 0.2, 1.0)} />
    <group position={[0, y, 0]}>
      <RBox s={[0.5, 0.03, 0.34]} p={[0, 0, 0]} r={0.004}>{M.steel({ col: "#8f9499" })}</RBox>
      <RBox s={[0.5, 0.03, 0.34]} p={[0, 0.42, 0]} r={0.004}>{M.steel({ col: "#8f9499" })}</RBox>
      <RBox s={[0.5, 0.42, 0.02]} p={[0, 0.21, -0.16]} r={0.003}><meshStandardMaterial color="#4e5457" roughness={0.6} /></RBox>
      {[-0.24, 0.24].map((x) => <RBox key={x} s={[0.02, 0.42, 0.34]} p={[x, 0.21, 0]} r={0.003}><meshStandardMaterial color="#6d7478" roughness={0.6} /></RBox>)}
      <Mouse p={[-0.02, 0.02, 0.02]} s={2.4} run={0} />
    </group>
    <mesh position={[0, (y + 0.43 + (cut ? y + 0.55 : 2.6)) / 2, 0]} scale={[1, Math.max(0.001, (cut ? 0.12 : 2.6 - y - 0.43)), 1]}><cylinderGeometry args={[0.012, 0.012, 1, 10]} />{M.steel({ col: "#c8ccd0" })}</mesh>
    {cut && <mesh position={[0.03 * Math.sin(tt * 16), lerp(2.2, 3.2, eio(tt, 3.3, 4.2)), 0]}><cylinderGeometry args={[0.012, 0.012, 0.8, 10]} />{M.steel({ col: "#c8ccd0" })}</mesh>}
    <group position={[0.36, 1.76, 0.08]}>
      {[1, -1].map((s) => <group key={s} rotation={[0, 0, s * lerp(0.5, 0.05, snip)]}><RBox s={[0.42, 0.03, 0.012]} p={[-0.22, 0, 0]} r={0.003}>{M.chrome()}</RBox><RBox s={[0.3, 0.05, 0.03]} p={[0.15, 0, 0]} r={0.01}>{M.matte({ col: "#b3261e" })}</RBox></group>)}
    </group>
    <Tape txt="COPPER IN EVERY BAY" p={[0, 0.58, 0.28]} w={1.0} k={phys(tt, 4.6, 8, 0.45)} rev={cl((tt - 4.6) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- EN ÁNGULO RECTO: vista cenital; el gatillo besa el zócalo y el ratón viene pegado a la pared ----
export const HRightAngle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" key1={[0.4, 3, 0.8]}
  cam={{ at: [0.05, 0.04, -0.06], az: [-0.2, 0.18], el: [1.16, 1.0], r: [1.35, 1.18], fov: 32 }}>{(tt) => { const trig = eio(tt, 3.1, 3.2), mx = lerp(-0.72, -0.2, eio(tt, 0.3, 3.1));
  return <>
    <RBox s={[3.2, 0.3, 0.1]} p={[0, 0.15, -0.42]} r={0.006}><meshStandardMaterial color="#e8e2d3" roughness={0.6} /></RBox>
    <SnapTrap p={[0.0, 0.04, -0.13]} ry={PI / 2} s={1.3} trig={trig} />
    <SnapTrap p={[0.34, 0.04, -0.13]} ry={PI / 2} s={1.3} trig={0} />
    {tt < 3.15 && <Mouse p={[mx, 0.05, -0.31]} run={tt} s={1.2} />}
    {[3.15, 3.35].map((a, i) => <Ring key={i} tt={tt} a={a} p={[0, 0.08, -0.25]} rot={[-PI / 2, 0, 0]} r={0.4} d={0.7} />)}
    <Tape txt="TRIGGER TO THE WALL" p={[0.1, 0.16, 0.2]} rot={[-1.0, 0, 0]} w={0.9} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.9)} />
  </>;
}}</Scene3D>;

// ---- CUATRO NOCHES: la luna cruza tres veces sobre trampas desarmadas; a la cuarta se arman todas juntas ----
export const HFourNights: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none" key1={[-0.3, 2.4, 1.6]}
  cam={{ at: [0, 0.34, 0], az: [-0.16, 0.16], el: [0.34, 0.26], r: [2.4, 2.2], fov: 32 }}>{(tt) => { const nf = cl(tt / 4.6) * 3.99, n = Math.floor(nf), a = (nf - n) * PI, on = tt > 4.6;
  return <>
    <mesh position={[-Math.cos(a) * 1.05, 0.5 + Math.sin(a) * 0.58, -0.7]}><sphereGeometry args={[0.11, 28, 20]} /><meshBasicMaterial color="#efe7c8" /></mesh>
    {[0, 1, 2, 3].map((i) => <group key={i}>
      <SnapTrap p={[-0.84 + i * 0.56, 0.05, 0]} ry={0.05} s={1.3} big set={on} trig={0} />
      <mesh position={[-0.84 + i * 0.56, 0.1, 0.09]} scale={[1, 0.6, 1]}><sphereGeometry args={[Math.max(0.002, 0.035 * (on ? 1 : 1 - nf / 4 * 0.75)), 14, 10]} />{paper("#b58243")}</mesh>
    </group>)}
    <Tape key={n} txt={"NIGHT " + (n + 1)} col={on ? "#b3261e" : undefined} p={[0, 0.72, 0.1]} w={0.42} k={phys(tt, n * 1.15, 9, 0.45)} />
    {on && <Tape txt="SET THEM ALL" col="#b3261e" p={[0, 0.3, 0.44]} rot={[-0.5, 0, 0]} w={0.66} k={phys(tt, 4.75, 8, 0.45)} rev={cl((tt - 4.75) / 0.7)} />}
  </>;
}}</Scene3D>;

// ---- EL BALDE: el ratón sube la rampa, pisa la lata que gira y cae ----
export const HBucketRun: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="none" key1={[-0.5, 2.4, 2]}
  cam={{ at: [-0.08, 0.52, 0], az: [-0.3, 0.12], el: [0.16, 0.1], r: [2.25, 2.0], fov: 32 }}>{(tt) => { const walk = eio(tt, 0.3, 3.0), tip = eio(tt, 3.0, 3.3), spin = (tt > 3 ? (tt - 3) * 14 * Math.max(0, 1 - (tt - 3) / 3.4) : 0), dd = tt > 3.3 ? cl((tt - 3.3) / 0.65) : 0, ramp = walk * 0.8, mx = ramp < 0.66 ? lerp(-1.25, -0.42, ramp / 0.66) : lerp(-0.42, 0, (ramp - 0.66) / 0.34), myr = ramp < 0.66 ? lerp(0.05, 0.86, ramp / 0.66) : 0.92, my = lerp(myr, 0.14, dd * dd);
  return <>
    <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.37, 0.31, 0.8, 48, 1, true]} /><meshStandardMaterial color="#efeadf" roughness={0.5} side={2} transparent opacity={0.38} depthWrite={false} /></mesh>
    <mesh position={[0, 0.82, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.37, 0.017, 10, 64]} /><meshStandardMaterial color="#efeadf" roughness={0.45} /></mesh>
    <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.31, 0.31, 0.02, 40]} />{paper("#c8c2b3")}</mesh>
    <mesh position={[0, 0.82, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.005, 0.005, 0.84, 8]} />{M.steel({ col: "#c8ccd0" })}</mesh>
    <group position={[0, 0.82, 0]} rotation={[spin, 0, 0]}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.095, 0.095, 0.26, 36]} />{M.steel({ col: "#b9bec2" })}</mesh>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.098, 0.098, 0.1, 36]} />{paper("#a4743a")}</mesh>
      <mesh position={[0, 0.1, 0]} scale={[1, 0.3, 1]}><sphereGeometry args={[0.03, 10, 8]} />{paper("#7c5426")}</mesh>
    </group>
    <RBox s={[1.3, 0.03, 0.2]} p={[-0.88, 0.45, 0]} rot={[0, 0, 0.72]} r={0.006}>{M.wood({ rx: 3, ry: 1, base: [160, 118, 72] })}</RBox>
    <Mouse p={[mx, my, lerp(0, 0.08, tip)]} rz={ramp < 0.66 ? 0.72 : -tip * 2.5 - dd * 3} run={tt < 3 ? tt : 0} s={1.45} />
    <Tape txt="IT RESETS ITSELF" p={[0.66, 0.9, 0.1]} w={0.46} k={phys(tt, 4.4, 8, 0.45)} rev={cl((tt - 4.4) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- SALE POR LOS ENCHUFES: tres tomas y por cada una se escapa el olor verde ----
const Outlet: React.FC<{ x: number; y: number }> = ({ x, y }) => <group position={[x, y, 0.0]}>
  <RBox s={[0.15, 0.24, 0.012]} r={0.008}><meshStandardMaterial color="#efeadf" roughness={0.42} /></RBox>
  {[0.055, -0.055].map((d) => <group key={d} position={[0, d, 0.008]}><mesh><circleGeometry args={[0.038, 20]} /><meshStandardMaterial color="#e2dccd" /></mesh>{[-0.014, 0.014].map((o) => <mesh key={o} position={[o, 0.005, 0.001]}><planeGeometry args={[0.006, 0.02]} /><meshBasicMaterial color="#14100c" /></mesh>)}</group>)}
</group>;
export const HWallSmell: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" key1={[-0.3, 2.4, 2.2]}
  cam={{ at: [0, 0.62, 0], az: [-0.24, 0.2], el: [0.08, 0.04], r: [2.3, 2.05], fov: 32 }}>{(tt) => <>
    <RBox s={[3.8, 1.8, 0.06]} p={[0, 0.9, -0.08]} r={0.004}><meshStandardMaterial map={tex.text("wpp", 256, 256, (g) => { g.fillStyle = "#b9a98e"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#a69575"; for (let i = 0; i < 6; i++) g.fillRect(i * 44 + 8, 0, 14, 256); })} roughness={0.85} /></RBox>
    <RBox s={[3.8, 0.16, 0.06]} p={[0, 0.1, -0.03]} r={0.008}><meshStandardMaterial color="#e6e0d0" roughness={0.6} /></RBox>
    {[-0.75, 0, 0.75].map((x, i) => <group key={i}>
      <Outlet x={x} y={0.46} />
      {Array.from({ length: 34 }, (_, j) => { const a = 0.5 + i * 0.9 + j * 0.09, u = cl((tt - a) / 2.3); if (u <= 0 || u >= 1) return null; return <mesh key={j} position={[x + Math.sin(u * 8 + j) * 0.09 * u, 0.47 + u * 0.72, 0.08 + u * 0.25]} scale={[1 + u, 1 + u, 1 + u]}><sphereGeometry args={[0.05, 12, 9]} /><meshStandardMaterial color="#7f9a43" roughness={1} transparent opacity={0.2 * (1 - u)} depthWrite={false} /></mesh>; })}
    </group>)}
    <Tape txt="EVERY OUTLET" col="#b3261e" p={[0, 1.05, 0.12]} w={0.62} k={phys(tt, 3.0, 8, 0.45)} rev={cl((tt - 3.0) / 0.8)} />
  </>}</Scene3D>;

// ---- LO QUE NO TAPA NADA: el enchufe ultrasónico, el algodón, las bolitas y el gato caen frente al agujero; el agujero sigue ----
const Cat: React.FC = () => <group>
  <mesh scale={[1.6, 0.9, 1]} castShadow><sphereGeometry args={[0.11, 22, 16]} />{paper("#b0713a")}</mesh>
  <mesh position={[0.16, 0.05, 0]} castShadow><sphereGeometry args={[0.07, 20, 14]} />{paper("#b97d44")}</mesh>
  {[-1, 1].map((m) => <mesh key={m} position={[0.17, 0.12, m * 0.04]}><coneGeometry args={[0.025, 0.05, 10]} />{paper("#a4652f")}</mesh>)}
</group>;
export const HShelfJunk: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[-0.5, 2.4, 2.1]}
  cam={{ at: [0, 0.56, 0], az: [-0.24, 0.16], el: [0.08, 0.04], r: [2.15, 1.98], fov: 32 }}>{(tt) => { const X = [-0.54, -0.18, 0.18, 0.54], fall = (i: number) => { const u = cl((tt - (0.9 + i * 0.95)) / 0.55); return u * u; };
  const yy = (i: number, base: number) => lerp(base, 0.09, fall(i)), xx = (i: number) => lerp(X[i], (i - 1.5) * 0.14, fall(i)), mz = eio(tt, 4.8, 5.8);
  return <>
    <RBox s={[3.4, 1.8, 0.06]} p={[0, 0.9, -0.1]} r={0.004}>{siding("sj", "#c2b79d", "#958b72")}</RBox>
    <RBox s={[1.7, 0.04, 0.32]} p={[0, 0.92, 0.04]} r={0.006}>{M.wood({ rx: 3, ry: 1, base: [132, 92, 54] })}</RBox>
    <mesh position={[0, 0.3, -0.066]} scale={[1, 0.8, 1]}><circleGeometry args={[0.2, 36]} />{paper("#070503")}</mesh>
    <group position={[xx(0), yy(0, 1.01), 0.06]} rotation={[fall(0) * 2.6, 0, 0]}><RBox s={[0.14, 0.14, 0.09]} r={0.012}><meshStandardMaterial color="#efeadf" roughness={0.42} /></RBox><mesh position={[0, 0.03, 0.046]}><circleGeometry args={[0.012, 12]} /><meshBasicMaterial color="#49e05b" /></mesh></group>
    <mesh position={[xx(1), yy(1, 0.99), 0.06]} scale={[1, 0.8, 1]} castShadow><sphereGeometry args={[0.06, 16, 12]} />{paper("#f6f2e9")}</mesh>
    {[0, 1, 2, 3, 4].map((m) => <mesh key={m} position={[xx(2) + (m - 2) * 0.05, yy(2, 0.97) + (m % 2) * 0.03, 0.06]} castShadow><sphereGeometry args={[0.03, 14, 10]} /><meshStandardMaterial color="#ecebe6" roughness={0.5} /></mesh>)}
    <group position={[xx(3), yy(3, 1.04), 0.06]} rotation={[0, 0, fall(3) * 0.2]}><Cat /></group>
    <Mouse p={[lerp(-0.95, -0.02, mz), 0.05, 0.08]} run={tt > 4.7 ? tt : 0} s={1.5} />
    <Tape txt="STILL OPEN" col="#b3261e" p={[0.5, 0.42, 0.1]} w={0.5} k={phys(tt, 4.7, 8, 0.45)} rev={cl((tt - 4.7) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- PISO ABIERTO: los arbustos se van, cae grava junto al cimiento y el ratón queda a la vista ----
const GR = Array.from({ length: 260 }, (_, i) => ({ x: (rn(i, 41) - 0.5) * 3.1, z: -0.34 + rn(i, 42) * 0.44, r: 0.022 + rn(i, 43) * 0.026, c: Math.floor(rn(i, 44) * 3) }));
export const HGravelRing: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[0.2, 3, 1]}
  cam={{ at: [0, 0.1, 0], az: [-0.2, 0.16], el: [0.72, 0.6], r: [2.1, 1.85], fov: 32 }}>{(tt) => { const sh = 1 - eio(tt, 0.3, 1.5);
  return <>
    <RBox s={[3.6, 0.9, 0.14]} p={[0, 0.42, -0.5]} r={0.008}><meshStandardMaterial map={stoneTex("gr", 5, 1)} roughness={0.95} /></RBox>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0, 0.32]}><planeGeometry args={[3.8, 2.2]} /><meshStandardMaterial map={tex.text("grs2", 512, 512, (g) => { g.fillStyle = "#4f6a32"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 4000; i++) { g.strokeStyle = i % 2 ? "#6f8c42" : "#3b5426"; g.beginPath(); const x = rn(i, 8) * 512, y = rn(i, 9) * 512; g.moveTo(x, y); g.lineTo(x + rn(i, 10) * 5 - 2, y - 7); g.stroke(); } })} roughness={1} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.004, -0.12]}><planeGeometry args={[3.6, 0.5]} />{paper("#5f5240")}</mesh>
    {[-1.05, -0.5, 0.15, 0.85].map((x, i) => <mesh key={i} position={[x, 0.2, -0.12]} scale={[sv(sh), sv(sh), sv(sh)]} castShadow><sphereGeometry args={[0.24 + i * 0.012, 20, 14]} />{paper("#2f4a22")}</mesh>)}
    {GR.map((g, i) => { const k = phys(tt, 1.2 + rn(i, 45) * 2.6, 9, 0.34); return <mesh key={i} position={[g.x, lerp(0.75, 0.02, k), g.z]} scale={[1.2, 0.72, 1]} rotation={[i, i * 2, 0]} castShadow><sphereGeometry args={[g.r, 7, 5]} />{paper(["#9a948a", "#b6afa3", "#7f7a70"][g.c])}</mesh>; })}
    <Mouse p={[lerp(-0.9, 0.1, eio(tt, 3.8, 5.8)), 0.04, 0.22]} run={tt} s={1.3} />
    <Tape txt="18 INCHES WIDE" p={[0, 0.22, 0.62]} rot={[-0.8, 0, 0]} w={0.72} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- LA RAMA ES UN PUENTE: la rata corre hacia el techo; se corta la punta y queda el hueco ----
export const HBranchGap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[0.6, 3, 2.2]}
  cam={{ at: [0.02, 1.0, 0], az: [-0.18, 0.12], el: [0.06, 0.03], r: [2.7, 2.45], fov: 32 }}>{(tt) => { const cut = eio(tt, 3.5, 4.1), run = eio(tt, 0.3, 2.4), back = eio(tt, 2.5, 3.3), rx = lerp(1.45, -0.05, run) + back * 0.72, ry = 1.0 + (rx + 0.4) * 0.14 + 0.05;
  return <>
    <RBox s={[1.8, 1.2, 0.5]} p={[-1.5, 0.4, -0.1]} r={0.006}>{siding("br", "#c8c0aa", "#8b846f")}</RBox>
    <RBox s={[2.5, 0.08, 1.0]} p={[-1.42, 1.14, 0]} rot={[0, 0, -0.34]} r={0.012}><meshStandardMaterial color="#5a4a42" roughness={0.9} /></RBox>
    <mesh position={[2.0, 0.6, -0.08]} castShadow><cylinderGeometry args={[0.2, 0.3, 2.6, 18]} />{paper("#4c382a")}</mesh>
    <mesh geometry={tubeG("brn", [[2.0, 1.32, -0.05], [1.1, 1.22, 0], [0.45, 1.12, 0]], 0.055, 40, 12)} castShadow>{paper("#594231")}</mesh>
    <group position={[0, -2.2 * cut * cut, 0]} rotation={[0, 0, cut * 0.8]}><mesh geometry={tubeG("brn2", [[0.45, 1.12, 0], [0.0, 1.05, 0], [-0.42, 0.98, 0]], 0.036, 30, 10)} castShadow>{paper("#594231")}</mesh>
      {[0, 1, 2].map((i) => <mesh key={i} position={[-0.3 + i * 0.3, 1.1 - i * 0.02, 0]} scale={[1, 0.65, 0.8]}><sphereGeometry args={[0.16, 14, 10]} />{paper("#3a5a28")}</mesh>)}</group>
    {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.85 + i * 0.3, 1.34 + 0.02 * i, 0]} scale={[1, 0.65, 0.8]}><sphereGeometry args={[0.17, 14, 10]} />{paper("#3a5a28")}</mesh>)}
    <Mouse p={[rx, Math.min(ry, 1.25), 0]} ry={back > 0 ? 0 : PI} run={tt} s={1.3} rat />
    <mesh position={[0.115, 0.9, 0.12]} scale={[sv(eio(tt, 4.0, 4.7)), 1, 1]}><boxGeometry args={[0.67, 0.04, 0.006]} /><meshStandardMaterial color="#f2c531" metalness={0.3} roughness={0.35} /></mesh>
    <Tape txt="4 FEET" p={[0.115, 1.0, 0.13]} w={0.36} k={phys(tt, 4.4, 8, 0.45)} rev={cl((tt - 4.4) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- EL RELOJ DEL FIN DE SEMANA: la aguja barre cuatro cuñas y cada una suelta su tarea ----
const SAT = ["TAPE THE HOLES", "CLOSE THEM", "SET THE TRAPS", "CHECK AND RESET"];
export const HSatClock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark" key1={[-0.2, 2.2, 2.4]}
  cam={{ at: [0.04, 0.7, 0], az: [-0.2, 0.16], el: [0.03, 0.01], r: [2.4, 2.22], fov: 32 }}>{(tt) => { const a = eio(tt, 0.4, 5.6) * PI * 2, stage = Math.min(3, Math.floor(eio(tt, 0.4, 5.6) * 4));
  return <>
    <mesh position={[-0.42, 0.7, 0]} rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.6, 0.6, 0.06, 80]} />{M.brass()}</mesh>
    <mesh position={[-0.42, 0.7, 0.033]}><circleGeometry args={[0.55, 80]} /><meshStandardMaterial map={tex.text("sat", 512, 512, (g) => { const C = ["#d9a441", "#b3683c", "#3d5a7a", "#6f8c42"]; C.forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.moveTo(256, 256); g.arc(256, 256, 256, -Math.PI / 2 + i * Math.PI / 2, i * Math.PI / 2); g.fill(); }); g.fillStyle = "#f6f1e6"; g.beginPath(); g.arc(256, 256, 96, 0, 7); g.fill(); })} roughness={0.55} /></mesh>
    <group position={[-0.42, 0.7, 0.06]} rotation={[0, 0, -a]}><RBox s={[0.035, 0.5, 0.012]} p={[0, 0.22, 0]} r={0.004}>{M.chrome()}</RBox></group>
    <mesh position={[-0.42, 0.7, 0.07]}><sphereGeometry args={[0.04, 18, 14]} />{M.brass()}</mesh>
    {SAT.map((s, i) => { const y = 1.06 - i * 0.24, on = i <= stage; return <group key={i}><Tape txt={s} col={i === stage ? "#b3261e" : undefined} p={[0.7, y, 0.08]} w={0.74} k={on ? phys(tt, 0.4 + i * 1.3, 8, 0.45) : 0} rev={1} /></group>; })}
  </>;
}}</Scene3D>;

// ---- LA CUENTA QUE BAJA: una pila por noche, cada vez más baja, hasta el piso ----
const NN = [7, 6, 6, 5, 4, 3, 3, 2, 1, 1, 0, 0, 0];
export const HTallyDrop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="none" key1={[-0.5, 2.2, 2.2]}
  cam={{ at: [-0.55, 0.3, 0], at1: [0.85, 0.22, 0], az: [-0.34, 0.2], el: [0.16, 0.1], r: [1.85, 1.65], fov: 32 }}>{(tt) => <>
    {NN.map((n, i) => { const x = -1.2 + i * 0.2, a = 0.3 + i * 0.36; return <group key={i}>
      <mesh position={[x, 0.052, 0.14]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 22]} />{paper(n ? "#d7cfbc" : "#f6f1e7")}</mesh>
      {Array.from({ length: n }, (_, j) => <mesh key={j} position={[x, lerp(1.0, 0.07 + j * 0.052, phys(tt, a + j * 0.05, 9, 0.34)), 0.0]} castShadow><cylinderGeometry args={[0.075, 0.075, 0.05, 28]} />{M.wood({ rx: 1, ry: 1, base: [156 - j * 6, 112, 68] })}</mesh>)}
    </group>; })}
    <Tape txt="DAY 10: CLEAN FLOUR" p={[0.72, 0.42, 0.14]} w={0.62} k={phys(tt, 3.9, 8, 0.45)} rev={cl((tt - 3.9) / 0.9)} />
  </>}</Scene3D>;

// ---- LA PELOTITA: viene rodando por el umbral y pasa justo detrás del caño de propano ----
export const HGolfBall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-0.7, 2.2, 2]}
  cam={{ at: [-0.1, 0.56, 0], az: [-0.42, -0.1], el: [0.14, 0.08], r: [1.5, 1.36], fov: 32 }}>{(tt) => { const k = eio(tt, 0.5, 3.3), x = lerp(-0.8, 0.0, k), drop = eio(tt, 3.3, 3.55), z = lerp(0.2, -0.16, eio(tt, 3.0, 3.5));
  return <>
    <RBox s={[3, 0.42, 0.5]} p={[0, 0.2, 0.08]} r={0.008}><meshStandardMaterial map={stoneTex("gb", 4, 1)} roughness={0.95} /></RBox>
    <RBox s={[3, 1.05, 0.06]} p={[0, 0.92, -0.2]} r={0.004}>{siding("gbs", "#c9c1ab", "#857e6c")}</RBox>
    <mesh position={[0.0, 0.5, -0.163]}><circleGeometry args={[0.095, 28]} /><meshStandardMaterial color="#070503" /></mesh>
    <mesh geometry={tubeG("gbp", [[0.75, 0.74, 0.02], [0.3, 0.74, 0.02], [0.09, 0.62, 0.0], [0.04, 0.54, -0.16]], 0.018, 40, 12)} castShadow><meshStandardMaterial color="#c9b23a" metalness={0.5} roughness={0.35} /></mesh>
    {drop < 1 && <mesh position={[x, 0.462, z]} rotation={[0, 0, -k * 9]} scale={[sv(1 - drop), sv(1 - drop), sv(1 - drop)]} castShadow><sphereGeometry args={[0.052, 36, 26]} /><meshPhysicalMaterial map={tex.text("gbl", 256, 128, (g) => { g.fillStyle = "#f7f4ec"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#c9c4b7"; for (let i = 0; i < 18; i++) for (let j = 0; j < 10; j++) { g.beginPath(); g.arc(i * 14 + (j % 2) * 7, j * 13 + 4, 2.4, 0, 7); g.fill(); } })} roughness={0.42} clearcoat={0.5} /></mesh>}
    <Tape txt="BEHIND THE PROPANE LINE" p={[-0.1, 0.9, 0.0]} w={0.8} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.9)} />
  </>;
}}</Scene3D>;

// ---- LA RAJA DEL PORTÓN: desde el piso del garaje, la esquina deja entrar día y un ratón por ahí ----
export const HDaylightCorner: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="none" key1={[-0.3, 1.8, 2.3]}
  cam={{ at: [0.42, 0.22, 0], az: [-0.14, 0.2], el: [0.11, 0.07], r: [1.75, 1.5], fov: 32 }}>{(tt) => { const glow = eio(tt, 0.5, 1.8), mx = lerp(0.72, 0.5, eio(tt, 2.8, 4.8));
  return <>
    <RBox s={[3, 1.6, 0.05]} p={[0, 0.86, -0.3]} r={0.004}><meshStandardMaterial map={tex.text("gd", 256, 256, (g) => { g.fillStyle = "#b2ad9e"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#8c8778"; for (let i = 0; i < 4; i++) g.fillRect(0, i * 64 + 60, 256, 4); })} roughness={0.7} /></RBox>
    <RBox s={[2.0, 0.05, 0.05]} p={[-0.55, 0.06, -0.26]} r={0.012}>{paper("#1e1c1a")}</RBox>
    <RBox s={[0.1, 1.6, 0.12]} p={[1.04, 0.84, -0.26]} r={0.006}>{paper("#d8d2c2")}</RBox>
    <mesh position={[0.72, 0.04, -0.27]}><shapeGeometry args={[(() => { const s = new THREE.Shape(); s.moveTo(-0.27, 0.0); s.lineTo(0.27, 0.0); s.lineTo(0.27, 0.075); s.closePath(); return s; })()]} /><meshBasicMaterial color={`rgb(${Math.round(lerp(50, 255, glow))},${Math.round(lerp(44, 236, glow))},${Math.round(lerp(36, 190, glow))})`} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0.72, 0.041, 0.26]}><planeGeometry args={[1.0, 1.1]} /><meshBasicMaterial map={tex.text("gl2", 256, 256, (g) => { const a = g.createRadialGradient(128, 0, 4, 128, 0, 250); a.addColorStop(0, "rgba(255,235,180,.85)"); a.addColorStop(1, "rgba(255,235,180,0)"); g.fillStyle = a; g.fillRect(0, 0, 256, 256); })} transparent opacity={glow} depthWrite={false} /></mesh>
    <Mouse p={[mx, 0.045, lerp(-0.34, 0.25, eio(tt, 2.8, 4.8))]} ry={1.6} run={tt > 2.8 ? tt : 0} s={1.2} />
    <Tape txt="AN OPEN INVITATION" p={[0.2, 0.57, -0.2]} w={0.78} k={phys(tt, 2.2, 8, 0.45)} rev={cl((tt - 2.2) / 0.9)} />
  </>;
}}</Scene3D>;

// ---- LA MALLA DURA: el hueco grande; la rejilla se apoya, y cada arandela la clava ----
export const HFistCloth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-0.6, 2, 2.1]}
  cam={{ at: [0.15, 0.55, 0], az: [-0.3, 0.1], el: [0.1, 0.05], r: [1.72, 1.56], fov: 32 }}>{(tt) => { const k = phys(tt, 0.7, 7, 0.45), Z = lerp(0.8, 0.012, k), P: [number, number][] = [[-0.34, 0.86], [0.34, 0.86], [0.34, 0.24], [-0.34, 0.24], [0, 0.88], [0, 0.22], [-0.37, 0.55], [0.37, 0.55]];
  return <>
    <RBox s={[3, 1.6, 0.06]} p={[0, 0.6, -0.05]} r={0.004}>{siding("fc", "#b9b3a2", "#7f7a6b")}</RBox>
    <mesh position={[0, 0.55, -0.015]} scale={[1, 0.86, 1]}><circleGeometry args={[0.26, 36]} />{paper("#070503")}</mesh>
    <group position={[0, 0.55, Z + 0.012]}>
      {Array.from({ length: 16 }, (_, i) => <mesh key={"v" + i} position={[-0.375 + i * 0.05, 0, 0]}><boxGeometry args={[0.006, 0.76, 0.006]} /><meshStandardMaterial color="#9ba0a4" metalness={0.8} roughness={0.35} /></mesh>)}
      {Array.from({ length: 16 }, (_, i) => <mesh key={"h" + i} position={[0, -0.375 + i * 0.05, 0.003]}><boxGeometry args={[0.76, 0.006, 0.006]} /><meshStandardMaterial color="#9ba0a4" metalness={0.8} roughness={0.35} /></mesh>)}
    </group>
    {P.map(([x, y], i) => { const a = 2.1 + i * 0.36, sc = phys(tt, a, 10, 0.45), zz = lerp(0.3, 0.03, sc); return <group key={i} position={[x, y, zz]} rotation={[PI / 2, 0, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.05, 0.05, 0.007, 22]} />{M.steel({ col: "#a9adb1" })}</mesh>
      <mesh position={[0, 0.012, 0]} castShadow><cylinderGeometry args={[0.024, 0.024, 0.018, 6]} />{M.steel({ col: "#c8ccd0" })}</mesh>
    </group>; })}
    <Tape txt="1/4 INCH CLOTH" p={[0.66, 0.86, 0.1]} w={0.42} k={phys(tt, 1.7, 8, 0.45)} rev={cl((tt - 1.7) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- EL DESFILE: agujero alrededor del caño; los ratones llegan en fila, con banderita ----
export const HParade: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[-0.4, 2.8, 1.1]}
  cam={{ at: [0.05, 0.1, 0.05], az: [-0.3, 0.16], el: [0.72, 0.58], r: [1.75, 1.55], fov: 32 }}>{(tt) => <>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0.42, 0.04, -0.14]}><circleGeometry args={[0.26, 40]} /><meshStandardMaterial color="#060403" /></mesh>
    <mesh position={[0.42, 0.45, -0.14]} castShadow><cylinderGeometry args={[0.042, 0.042, 0.9, 20]} />{M.steel({ col: "#a8a8a0" })}</mesh>
    <group position={[0.74, 0.42, -0.5]}>{[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[(i - 2) * 0.13, 0, 0]} castShadow><cylinderGeometry args={[0.058, 0.058, 0.78, 16]} /><meshStandardMaterial color="#c9c4b4" metalness={0.45} roughness={0.42} /></mesh>)}</group>
    {Array.from({ length: 8 }, (_, i) => { const p = cl((tt - 0.3 - i * 0.48) / 2.6), x = lerp(-1.45, 0.3, p), z = lerp(0.42, -0.1, eio(p, 0.45, 1)), gone = eio(p, 0.9, 1); if (p <= 0 || gone >= 1) return null; return <group key={i} position={[x, 0.05 - gone * 0.2, z]} rotation={[0, Math.atan2(0.32, 1), 0]} scale={sv(1 - gone * 0.6)}>
      <Mouse p={[0, 0, 0]} run={tt + i * 0.2} s={1.05} />
      <mesh position={[-0.02, 0.15, 0]}><cylinderGeometry args={[0.003, 0.003, 0.2, 6]} />{paper("#d9d2c0")}</mesh>
      <mesh position={[0.045, 0.22, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.032, 0.11, 3]} />{paper(i % 2 ? "#b3261e" : "#2f78c8")}</mesh>
    </group>; })}
    <Tape txt="A PARADE" col="#b3261e" p={[-0.5, 0.12, -0.42]} rot={[-0.7, 0, 0]} w={0.5} k={phys(tt, 1.7, 8, 0.45)} rev={cl((tt - 1.7) / 0.6)} />
  </>}</Scene3D>;

// ---- LA CAJA CON LLAVE: la caja anclada al piso; la pata prueba, tira y no se mueve ----
export const HBaitBox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-0.6, 2.4, 2]}
  cam={{ at: [0, 0.3, 0], az: [-0.3, 0.14], el: [0.22, 0.14], r: [1.6, 1.42], fov: 32 }}>{(tt) => { const lock = phys(tt, 0.7, 9, 0.45), paw = Math.max(eio(tt, 2.3, 2.7) * (1 - eio(tt, 2.9, 3.3)), eio(tt, 3.5, 3.9) * (1 - eio(tt, 4.1, 4.5)));
  return <>
    <RBox s={[3.2, 0.2, 1.8]} p={[0, -0.09, 0.2]} r={0.01}><meshStandardMaterial map={stoneTex("bb", 4, 2)} roughness={0.95} /></RBox>
    <RBox s={[3.2, 1.0, 0.1]} p={[0, 0.5, -0.48]} r={0.006}><meshStandardMaterial map={stoneTex("bb2", 4, 2)} roughness={0.95} /></RBox>
    <RBox s={[0.78, 0.34, 0.5]} p={[-0.05, 0.18, -0.12]} r={0.05}><meshStandardMaterial color="#3a3d42" roughness={0.45} /></RBox>
    <mesh position={[-0.3, 0.13, 0.133]}><circleGeometry args={[0.05, 22]} />{paper("#050505")}</mesh>
    <mesh position={[0.2, 0.13, 0.133]}><circleGeometry args={[0.05, 22]} />{paper("#050505")}</mesh>
    <group position={[0.0, lerp(0.75, 0.2, lock), 0.135]}>
      <RBox s={[0.13, 0.11, 0.05]} r={0.012}>{M.brass()}</RBox>
      <mesh position={[0, 0.075, 0]}><torusGeometry args={[0.042, 0.009, 10, 30, PI]} />{M.steel({ col: "#c8ccd0" })}</mesh>
    </group>
    {[-0.3, 0.2].map((x, i) => <mesh key={i} position={[x, 0.008, 0.22]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.032, 12]} />{M.steel({ col: "#c8ccd0" })}</mesh>)}
    <mesh geometry={tubeG("bch", [[-0.3, 0.02, 0.22], [-0.32, 0.06, 0.16], [-0.25, 0.12, 0.14]], 0.008, 20, 8)}>{M.steel({ col: "#9a9ea2" })}</mesh>
    <group position={[lerp(1.0, 0.46, paw), 0.28, 0.14]}>
      <mesh scale={[1.9, 0.75, 0.9]} castShadow><sphereGeometry args={[0.11, 22, 16]} />{paper("#a6743f")}</mesh>
      {[-1, 0, 1].map((m) => <mesh key={m} position={[-0.2, -0.02, m * 0.045]} castShadow><sphereGeometry args={[0.03, 12, 10]} />{paper("#8d6133")}</mesh>)}
    </group>
    <Tape txt="LOCKED AND ANCHORED" p={[0, 0.6, 0.04]} w={0.86} k={phys(tt, 1.5, 8, 0.45)} rev={cl((tt - 1.5) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- EL RÉCORD: tiras de cinta azul van cayendo y arman el número ----
const SEG: [number, number, number][] = [[-0.5, 0.42, 0], [-0.26, 0.21, 1], [-0.5, 0, 0], [-0.26, -0.21, 1], [-0.5, -0.42, 0], [0.42, 0.21, 1], [0.42, -0.21, 1]];
export const HRecordTape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[-0.3, 3, 1]}
  cam={{ at: [-0.05, 0.05, 0.12], az: [-0.2, 0.14], el: [1.2, 1.08], r: [2.35, 2.15], fov: 32 }}>{(tt) => <>
    {SEG.map(([x, z, v], i) => { const k = phys(tt, 0.25 + i * 0.42, 10, 0.42); return <RBox key={i} s={v ? [0.13, 0.008, 0.44] : [0.54, 0.008, 0.13]} p={[x, lerp(1.0, 0.038, k), z]} rot={[0, (1 - k) * 1.2, 0]} r={0.002}><meshStandardMaterial color="#2f78c8" roughness={0.72} /></RBox>; })}
    <Tape txt="THE RECORD TO BEAT" p={[0, 0.2, 0.62]} rot={[-1.0, 0, 0]} w={0.82} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.7)} />
  </>}</Scene3D>;
