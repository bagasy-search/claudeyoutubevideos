// MIO apa8pb · componentes únicos 11-26 min: el golpe, la puerta de atrás, los errores, lo que no sirve y el cierre.
import React from "react";
import { H, Tag, AMB, RED, GRN, TX } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { Boot, Bucket, Flag, Mole, Mound, Ridge, Sign, SoilBlock, Worm } from "./farmkit";
import { Blades, Dirt, Lawn, PI, Road, Trunk, Vole } from "./akit";
import { Spade, Tun } from "./heroes_1";

type P_ = { t: number; h: H };
const CORTE = { at: [0, -0.2, 0] as [number, number, number], az: [-0.1, 0.1] as [number, number], el: [0.05, 0.08] as [number, number], r: [1.7, 1.42] as [number, number], fov: 28 };
const Mug: React.FC<{ p?: number[]; s?: number; full?: number }> = ({ p = [0, 0, 0], s = 1, full = 1 }) => <group position={p as any} scale={s}>
  <mesh position={[0, 0.05, 0]} castShadow><cylinderGeometry args={[0.05, 0.043, 0.1, 40]} />{M.porcelain({ col: "#f2efe7" })}</mesh>
  <mesh position={[0, 0.03 + 0.0705 * full, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.044, 32]} /><meshPhysicalMaterial color="#2c1a0e" roughness={0.15} clearcoat={1} /></mesh>
  <mesh position={[0.058, 0.05, 0]}><torusGeometry args={[0.024, 0.006, 10, 24]} />{M.porcelain({ col: "#f2efe7" })}</mesh>
</group>;

// ---- EL ERROR: la pala cae justo encima y el topo sale disparado para atrás ----
export const HMissBack: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1.2, 2, 1.4]} cam={CORTE}
  over={(tt) => <Tag tt={tt} at={2.4} x={960} y={940} txt="HE SHOOTS BACK" col={RED} />}>{(tt) => {
  const f = eio(tt, 1.0, 1.32), run = eio(tt, 1.2, 1.75), sh = tt > 1.32 ? Math.exp(-(tt - 1.32) * 6) * Math.sin(tt * 60) * 0.008 : 0;
  return <group position={[sh, 0, 0]}>
    <SoilBlock w={3.6} h={0.72} d={0.6} p={[0, 0, 0]} />
    <Tun x={-0.1} y={-0.22} len={2.2} r={0.075} />
    <Mole p={[lerp(0.32, -0.92, run), -0.22, 0.34]} s={0.82} paddle={tt * (run > 0 && run < 1 ? 5 : 1.2)} nose={tt} />
    <Spade p={[0.42, lerp(0.95, -0.14, f), 0.312]} s={0.72} />
    {Array.from({ length: 12 }, (_, i) => { const a = i * 0.54 + 0.3, k = eio(tt, 1.32, 2.0), y = 0.08 * Math.sin(k * PI) * (1 + rn(i, 2)); return <mesh key={i} visible={tt > 1.32 && k < 1} position={[0.42 + Math.cos(a) * 0.3 * k, y, 0.32]}><sphereGeometry args={[0.012 + rn(i, 3) * 0.008, 8, 6]} /><meshStandardMaterial color="#4a3320" roughness={1} /></mesh>; })}
  </group>;
}}</Scene3D>;

// ---- LA PUERTA DE ATRÁS: la pala entra detrás del topo y corta el túnel; él se da vuelta y no hay salida ----
export const HBackDoor: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1.2, 2, 1.4]} cam={{ ...CORTE, az: [0.12, -0.08], r: [1.55, 1.3] }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={940} txt="BACK DOOR SHUT" col={GRN} />}>{(tt) => {
  const s = eio(tt, 0.8, 1.2), tr = eio(tt, 1.7, 2.3), bk = eio(tt, 2.4, 3.3), lt = tt > 3.3 ? Math.sin(tt * 18) * 0.008 : 0;
  return <>
    <SoilBlock w={3.6} h={0.72} d={0.6} p={[0, 0, 0]} />
    <Tun x={0} y={-0.22} len={2.2} r={0.075} />
    <Mole p={[lerp(0.42, -0.14, bk) + lt, -0.22, 0.34]} rot={[0, tr * PI, 0]} s={0.82} paddle={tt * (bk > 0 && bk < 1 ? 4 : 1)} nose={tt} />
    <Spade p={[-0.36, lerp(0.95, -0.42, s), 0.312]} s={0.72} />
    <mesh position={[-0.36, -0.22, 0.307]}><planeGeometry args={[0.2, 0.18]} /><meshBasicMaterial color="#3e2c1c" transparent opacity={s > 0.9 ? 0.92 : 0} /></mesh>
  </>;
}}</Scene3D>;

// ---- UN CUARTO DE UN PIE: pala atrás y bota adelante; lo que queda en medio se ilumina ----
export const HFootRoom: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 2, 1.5]} cam={{ at: [0, -0.12, 0], az: [-0.08, 0.12], el: [0.07, 0.1], r: [1.42, 1.18], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.1} x={960} y={940} txt="A ROOM ONE FOOT LONG" col={AMB} />}>{(tt) => {
  const b = phys(tt, 0.5, 7, 0.5), l = eio(tt, 1.6, 2.5), r = eio(tt, 2.5, 3.2);
  return <>
    <SoilBlock w={3.2} h={0.66} d={0.6} p={[0, 0, 0]} />
    <Tun x={0} y={-0.2} len={2.2} r={0.075} />
    <mesh position={[0, -0.2, 0.3065]}><planeGeometry args={[0.6, 0.15]} /><meshBasicMaterial color="#ffc46a" transparent opacity={0.32 * l} /></mesh>
    <Mole p={[0.14 * Math.sin(tt * 2.1), -0.2, 0.345]} rot={[0, Math.sin(tt * 2.1 + 1.5) > 0 ? 0 : PI, 0]} s={0.72} paddle={tt * 3} nose={tt} />
    <Spade p={[-0.32, -0.4, 0.312]} s={0.72} />
    <group position={[0.34, 0.02 + 0.8 * (1 - b), 0.15]} rotation={[0, PI / 2, 0]}><Boot s={2.1} /></group>
    <RBox s={[Math.max(0.01, 0.62 * r), 0.03, 0.006]} p={[-0.31 + 0.31 * r, -0.05, 0.31]} r={0.002}><meshStandardMaterial color="#e6c042" roughness={0.5} /></RBox>
    {Array.from({ length: 13 }, (_, i) => <mesh key={i} visible={r > (i + 0.5) / 13} position={[-0.31 + i * 0.0517, -0.043, 0.3145]}><planeGeometry args={[0.003, i % 6 ? 0.012 : 0.02]} /><meshBasicMaterial color="#2a1d12" /></mesh>)}
    <Sign id="ftr" txt="1 FT" p={[0, 0.22, 0.22]} w={0.2} h={0.1} />
  </>;
}}</Scene3D>;

// ---- LA LOSA DE PASTO: se levanta entera, da vuelta como una tapa y abajo está él ----
export const HSlabFlip: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 2, 1.2]} cam={{ at: [0, 0.08, 0], az: [-0.42, -0.2], el: [0.5, 0.4], r: [1.5, 1.24], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="AND THERE HE IS" col={AMB} />}>{(tt) => {
  const k = eio(tt, 0.6, 2.3), dip = Math.sin(tt * 2) * 0.012;
  return <>
    <Lawn />
    <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.62, 0.42]} /><meshStandardMaterial color="#1e140c" roughness={1} /></mesh>
    <Mole p={[-0.02, 0.03 + dip, 0]} s={0.9} paddle={tt * 2} nose={tt} />
    <group position={[0.31, 0.002, 0]} rotation={[0, 0, -k * 2.75]}>
      <RBox s={[0.62, 0.08, 0.42]} p={[-0.31, 0.04, 0]} r={0.012}><meshStandardMaterial color="#3a2819" roughness={1} /></RBox>
      <mesh position={[-0.31, 0.0815, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.4]} /><meshStandardMaterial color="#5c8c3a" roughness={1} /></mesh>
      {Array.from({ length: 90 }, (_, i) => <mesh key={i} position={[-0.6 + rn(i, 2) * 0.58, 0.11, -0.19 + rn(i, 3) * 0.38]}><coneGeometry args={[0.004, 0.06, 5]} /><meshStandardMaterial color={i % 3 ? "#5d8f3a" : "#7bab4a"} roughness={0.8} /></mesh>)}
      {Array.from({ length: 24 }, (_, i) => <mesh key={"r" + i} position={[-0.58 + rn(i, 4) * 0.54, -0.012, -0.19 + rn(i, 5) * 0.38]} rotation={[rn(i, 6), rn(i, 7), PI / 2]}><cylinderGeometry args={[0.0016, 0.0016, 0.05, 5]} /><meshStandardMaterial color="#c9b38c" /></mesh>)}
    </group>
    <Blades w={2.6} d={1.6} n={320} h={0.08} skip={(x, z) => Math.abs(x) < 0.42 && Math.abs(z) < 0.3 || (x > 0.2 && x < 1.05 && Math.abs(z) < 0.3)} />
  </>;
}}</Scene3D>;

// ---- POR AFUERA: desde arriba las huellas dan la vuelta a los túneles; la línea recta queda tachada ----
export const HLongWayRound: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-0.8, 2.4, 0.6]} cam={{ at: [0, 0, 0.06], az: [0.05, -0.05], el: [1.16, 1.02], r: [2.5, 2.2], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.1} x={960} y={940} txt="FORTY FEET. FIVE MINUTES." col={GRN} />}>{(tt) => {
  const N = 32, k = eio(tt, 0.9, 4.4), x1 = eio(tt, 0.2, 0.7);
  const q = (u: number) => [lerp(-1.1, 1.05, u), 0.34 - 0.9 * Math.sin(u * PI) ** 1.1 * -1];
  return <>
    <Lawn />
    <Road id="lrA" pts={[[-1.2, -0.16], [-0.5, 0.0], [0.1, 0.16], [0.7, 0.02], [1.2, 0.1]]} w={0.07} col="#70482b" />
    <Road id="lrB" pts={[[-0.3, -0.8], [-0.24, -0.3], [-0.5, 0], [-0.3, 0.42]]} w={0.06} col="#70482b" />
    <Road id="lrC" pts={[[0.55, -0.7], [0.42, -0.24], [0.7, 0.02], [0.62, 0.42]]} w={0.06} col="#70482b" />
    <mesh position={[0, 0.006, -0.42]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[Math.max(0.01, 2.2 * x1), 0.01]} /><meshBasicMaterial color="#e6482f" transparent opacity={1 - 0.65 * eio(tt, 0.8, 1.2)} /></mesh>
    {[0.5, -0.5].map((a) => <mesh key={a} visible={tt > 0.8} position={[0, 0.008, -0.42]} rotation={[-PI / 2, 0, a]}><planeGeometry args={[Math.min(0.26, (tt - 0.8) * 1.2), 0.022]} /><meshBasicMaterial color="#e6482f" /></mesh>)}
    {Array.from({ length: N }, (_, i) => { const u = i / (N - 1), g = q(u), ang = u * PI; return <group key={i} visible={u < k} position={[g[0], 0.007, g[1] + (i % 2 ? 0.024 : -0.024)]} rotation={[-PI / 2, 0, -0.5 + ang * 0.32]} scale={[1, 0.42, 1]}><mesh><circleGeometry args={[0.036, 18]} /><meshBasicMaterial color="#efe6d2" /></mesh></group>; })}
  </>;
}}</Scene3D>;

// ---- 51 MINUTOS: el reloj de tambores en la tabla, y el balde con la tapa ----
export const HDrum51: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" key1={[-1, 1.9, 1.5]} cam={{ at: [0.05, 0.11, 0], az: [-0.25, 0.18], el: [0.2, 0.15], r: [0.82, 0.66], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={940} txt="FIFTY-ONE MINUTES" col={AMB} />}>{(tt) => {
  const k = eio(tt, 0.2, 2.5), v = 51 * k, ten = Math.floor(v / 10) + eio(v % 10, 9, 10), lid = phys(tt, 3.0, 7, 0.45);
  return <>
    <RBox s={[0.34, 0.15, 0.1]} p={[-0.17, 0.075, 0]} r={0.018}><meshStandardMaterial color="#242120" roughness={0.42} metalness={0.25} /></RBox>
    <DigitDrum v={ten} p={[-0.225, 0.09, 0.052]} r={0.052} w={0.074} />
    <DigitDrum v={v % 10} p={[-0.125, 0.09, 0.052]} r={0.052} w={0.074} />
    <Bucket s={0.72} p={[0.27, 0, -0.03]} fill={0.7} />
    <group position={[0.27, 0.262 + 0.42 * (1 - lid), -0.03]}><mesh castShadow><cylinderGeometry args={[0.118, 0.118, 0.012, 40]} />{M.pvc({ col: "#d9d5ca" })}</mesh></group>
  </>;
}}</Scene3D>;

// ---- EL MONTÍCULO RESPIRA: la tierra late, las migas ruedan y la pala llega en ángulo ----
export const HHeaveMound: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1, 1.5, 1]} cam={{ at: [0, 0.1, 0], az: [0.34, 0.12], el: [0.16, 0.12], r: [1.05, 0.84], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={940} txt="THAT'S HIM" col={RED} />}>{(tt) => {
  const beat = Math.max(0, Math.sin(tt * 4.2)) ** 3, sp = eio(tt, 3.6, 4.4);
  return <>
    <Lawn />
    <group scale={[1 + 0.05 * beat, 1 + 0.22 * beat, 1 + 0.05 * beat]}><Mound p={[0, 0, 0]} s={1.4} /></group>
    {Array.from({ length: 16 }, (_, i) => { const a = rn(i, 2) * 6.28, ph = (tt * 0.55 + rn(i, 3)) % 1, r = 0.05 + ph * 0.22; return <mesh key={i} position={[Math.cos(a) * r, Math.max(0.006, 0.09 * (1 - ph) ** 2), Math.sin(a) * r]} castShadow><sphereGeometry args={[0.009 + rn(i, 4) * 0.006, 8, 6]} /><meshStandardMaterial color="#3e2a18" roughness={1} /></mesh>; })}
    <Spade p={[lerp(0.8, 0.34, sp), lerp(0.8, 0.1, sp), -0.04]} rot={[0, 0.2, 0.52]} s={0.7} />
    <Blades w={2.2} d={1.5} n={300} h={0.08} skip={(x, z) => Math.hypot(x, z) < 0.3} />
  </>;
}}</Scene3D>;

// ---- EL BANQUITO EQUIVOCADO: esperás arriba de una loma muerta y la telaraña va creciendo ----
export const HCobwebRidge: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 1.8, 1.3]} cam={{ at: [0, 0.16, 0], az: [-0.5, -0.2], el: [0.2, 0.15], r: [1.25, 1.02], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="NOBODY COMING BACK" col={AMB} />}>{(tt) => {
  const w = eio(tt, 0.7, 4.8);
  return <>
    <Lawn />
    <Ridge id="cwr" pts={[[-1.3, 0, 0.1], [-0.7, 0, -0.08], [-0.2, 0, 0.1], [0.4, 0, -0.06], [1.2, 0, 0.1]]} r={0.06} col="#5b7a3c" />
    <group position={[0, 0.03, 0.05]}>
      {[0, 2.09, 4.19].map((a) => <mesh key={a} position={[0.1 * Math.cos(a), 0.15, 0.1 * Math.sin(a)]} rotation={[0.16 * Math.sin(a), 0, -0.16 * Math.cos(a)]} castShadow><cylinderGeometry args={[0.012, 0.016, 0.31, 12]} />{M.wood({ base: [132, 96, 62] })}</mesh>)}
      <mesh position={[0, 0.315, 0]} castShadow><cylinderGeometry args={[0.15, 0.15, 0.03, 40]} />{M.wood({ base: [146, 106, 66] })}</mesh>
      {Array.from({ length: 11 }, (_, i) => { const a = i * 0.57 - 0.2, L = 0.3 * w; return <mesh key={i} position={[Math.cos(a) * (0.15 + L / 2), 0.31 - L * 0.42, Math.sin(a) * (0.15 + L / 2)]} rotation={[0, -a, -0.78]} visible={w > 0.02}><cylinderGeometry args={[0.0007, 0.0007, Math.max(0.001, L * 1.26), 4]} /><meshBasicMaterial color="#f2f0ea" transparent opacity={0.8} /></mesh>; })}
      {Array.from({ length: 4 }, (_, j) => <mesh key={j} visible={w > 0.3 + j * 0.16} position={[0, 0.31 - (j + 1) * 0.052, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.15 + (j + 1) * 0.06, 0.0006, 4, 40, 6.28 * 0.92]} /><meshBasicMaterial color="#f2f0ea" transparent opacity={0.65} /></mesh>)}
    </group>
    <Blades w={2.6} d={1.6} n={280} h={0.07} skip={(x, z) => Math.abs(z - 0.02) < 0.12} />
  </>;
}}</Scene3D>;

// ---- EL ASCENSOR DE LAS ESTACIONES: el topo sube y baja en la tierra según el mes ----
export const HDepthLift: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1.2, 2, 1.4]} cam={{ at: [0, -0.46, 0], az: [-0.08, 0.08], el: [0.04, 0.06], r: [2.1, 1.82], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.7} x={960} y={940} txt="FALL IS BEST" col={GRN} />}>{(tt) => {
  const a = eio(tt, 1.1, 1.8), b = eio(tt, 2.5, 3.2), y = lerp(lerp(-0.86, -1.02, a), -0.2, b), m = tt < 1.3 ? 0 : tt < 2.85 ? 1 : 2, x = 0.1 * Math.sin(tt * 0.9);
  return <>
    <SoilBlock w={4} h={1.3} d={0.6} p={[0, 0, 0]} />
    <Tun x={0} y={-0.2} len={3} r={0.07} col={b > 0.2 ? "#1c120a" : "#2d1e12"} />
    <Tun x={0} y={-0.86} len={3} r={0.07} /><Tun x={0} y={-1.02} len={3} r={0.05} col="#21150c" />
    <mesh position={[0.1, -0.56, 0.3055]}><planeGeometry args={[0.15, 0.8]} /><meshBasicMaterial color="#1c120a" /></mesh>
    <Mole p={[0.1 + x * (b < 1 && a < 1 ? 0.2 : 1), y, 0.345]} s={0.82} paddle={tt * 1.6} nose={tt} />
    <Sign id="dj1" txt="JULY" p={[-0.58, 0.28 + (m === 0 ? 0 : 3), 0.2]} w={0.4} h={0.17} />
    <Sign id="dj2" txt="JANUARY" p={[0, 0.28 + (m === 1 ? 0 : 3), 0.2]} w={0.5} h={0.17} col="#dbe7f0" />
    <Sign id="dj3" txt="OCTOBER" p={[0.58, 0.28 + (m === 2 ? 0 : 3), 0.2]} w={0.5} h={0.17} col="#f2cf8d" />
  </>;
}}</Scene3D>;

// ---- UNA TAZA O TRES: de un lado una taza con su cartel; del otro aparecen tres ----
export const HThreeMugs: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" key1={[-1, 1.9, 1.4]} cam={{ at: [0, 0.1, 0], az: [0.16, -0.1], el: [0.24, 0.18], r: [1.02, 0.84], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={940} txt="SOME MOLES MAKE YOU WAIT" col={AMB} />}>{(tt) => {
  const a = phys(tt, 0.2, 6, 0.5), m = [1.3, 2.0, 2.7].map((d) => phys(tt, d, 6, 0.5));
  return <>
    <Mug p={[-0.36, 0.42 * (1 - a), 0]} s={1.3} />
    <Sign id="mg1" txt="20 MIN" p={[-0.36, 0.26 + 0.9 * (1 - a), -0.08]} w={0.3} h={0.12} />
    {[-0.02, 0.18, 0.38].map((x, i) => <Mug key={i} p={[x + 0.02, 0.42 * (1 - m[i]), 0]} s={1.3} />)}
    <Sign id="mg3" txt="3 MORNINGS" p={[0.2, 0.26 + 0.9 * (1 - m[2]), -0.08]} w={0.46} h={0.12} />
  </>;
}}</Scene3D>;

// ---- TRES AMANECERES: el sol cruza tres veces; la loma no se mueve y cada día se clava una estaca ----
export const HThreeSuns: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1.2, 1.3, 1]} cam={{ at: [0, 0.32, 0], az: [0.08, -0.08], el: [0.05, 0.04], r: [2.0, 1.72], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={940} txt="FLAT = EMPTY" col={AMB} />}>{(tt) => {
  const ph = cl(tt / 4.8) * 3, d = Math.min(2, Math.floor(ph)), u = ph - d;
  return <>
    <Lawn />
    <Ridge id="tsr" pts={[[-1.4, 0, 0.14], [0, 0, 0.14], [1.4, 0, 0.14]]} r={0.05} up={0.34} col="#648544" />
    <mesh position={[lerp(-1.25, 1.25, u), 0.08 + 0.92 * Math.sin(u * PI), -0.7]}><sphereGeometry args={[0.1, 32, 20]} />{M.glow({ col: "#ffd56b" })}</mesh>
    <pointLight position={[lerp(-1.25, 1.25, u), 1, 0.2]} intensity={3 * Math.sin(u * PI)} distance={5} color="#ffd9a0" />
    {[0, 1, 2].map((i) => { const s = phys(tt, (i + 1) * 1.6 - 0.1, 7, 0.5); return <group key={i} position={[-0.3 + i * 0.3, 0.3 * (1 - s), 0.34]} scale={[1, Math.max(0.001, s), 1]}><mesh position={[0, 0.09, 0]} castShadow><cylinderGeometry args={[0.012, 0.008, 0.2, 10]} />{M.wood({ base: [150, 112, 70] })}</mesh></group>; })}
  </>;
}}</Scene3D>;

// ---- TIERRA GRATIS: el rastrillo baja el montículo y la tierra negra se abre en abanico ----
export const HRakeMound: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 1.8, 1.2]} cam={{ at: [0, 0.08, 0], az: [0.4, 0.18], el: [0.3, 0.22], r: [1.2, 0.98], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="FREE TOPSOIL" col={GRN} />}>{(tt) => {
  const k = eio(tt, 0.5, 4.2), sw = Math.sin(tt * 3.4), rx = 0.2 + 0.18 * sw;
  return <>
    <Lawn />
    <mesh position={[0, 0.004, 0]} rotation={[-PI / 2, 0, 0]} scale={[0.2 + 0.36 * k, 0.2 + 0.22 * k, 1]}><circleGeometry args={[1, 48]} /><meshStandardMaterial color="#2c1d11" roughness={1} /></mesh>
    <group scale={[1 + 0.5 * k, Math.max(0.06, 1 - 0.92 * k), 1 + 0.5 * k]}><Mound p={[0, 0, 0]} s={1.2} /></group>
    <group position={[rx, 0.022, 0.03]} rotation={[0, PI / 2, 0]}>
      <RBox s={[0.34, 0.03, 0.03]} p={[0, 0.02, 0]} r={0.008}>{M.steel({ col: "#62625e" })}</RBox>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.155 + i * 0.0282, -0.012, 0]} rotation={[0.1, 0, 0]}><coneGeometry args={[0.006, 0.05, 6]} />{M.steel({ col: "#62625e" })}</mesh>)}
      <mesh position={[0, 0.48, 0.42]} rotation={[-0.84, 0, 0]} castShadow><cylinderGeometry args={[0.014, 0.014, 1.25, 12]} />{M.wood({ base: [176, 134, 84] })}</mesh>
    </group>
    <Blades w={2.4} d={1.6} n={260} h={0.08} skip={(x, z) => Math.hypot(x / 1.5, z) < 0.36} />
  </>;
}}</Scene3D>;

// ---- EL BALDE AL BORDE DEL MONTE: se inclina, el topo cae y sale caminando entre los troncos ----
export const HTipBucket: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 1.8, 1.2]} cam={{ at: [0.1, 0.18, 0], az: [-0.3, -0.05], el: [0.15, 0.12], r: [1.75, 1.45], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.3} x={960} y={940} txt="THE SAME MORNING" col={AMB} />}>{(tt) => {
  const k = eio(tt, 0.7, 1.5), w = eio(tt, 1.8, 5.2);
  return <>
    <Lawn />
    {[[-0.3, -0.7], [0.3, -0.92], [0.85, -0.6], [1.3, -0.88], [-0.9, -0.95], [0.1, -1.3]].map((q, i) => <Trunk key={i} p={[q[0], 0, q[1]]} r={0.08 + (i % 2) * 0.03} h={1.8} />)}
    <group position={[-0.32, 0, 0.1]} rotation={[0, 0, -k * 1.5]}><Bucket s={0.82} metal fill={0.45} /></group>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} visible={k > 0.5} position={[-0.0 + rn(i, 2) * 0.18, 0.012, 0.03 + rn(i, 3) * 0.14]} castShadow><sphereGeometry args={[0.022 + rn(i, 4) * 0.01, 10, 8]} /><meshStandardMaterial color="#3c2a1a" roughness={1} /></mesh>)}
    <Mole p={[lerp(0.12, 0.72, w), 0.03, lerp(0.1, -0.56, w)]} rot={[0, 2.5, 0]} s={0.72} paddle={tt * 4} nose={tt} />
    <Blades w={3} d={1.8} n={300} h={0.07} skip={(x, z) => Math.hypot(x + 0.1, z - 0.1) < 0.42} />
  </>;
}}</Scene3D>;

// ---- CIENTOS DE PIES: la cámara viaja por el corte; el agua hizo un charco chiquito y el túnel sigue seco ----
export const HPourLong: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 2, 1.5]}
  cam={{ at: [-2.1, -0.16, 0], at1: [2.0, -0.16, 0], az: [0.02, 0.02], el: [0.05, 0.05], r: [1.45, 1.42], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="HUNDREDS OF FEET" col={RED} />}>{(tt) => {
  const p = eio(tt, 0.2, 5.4);
  return <>
    <SoilBlock w={9} h={0.7} d={0.6} p={[0, 0, 0]} />
    <Tun x={0.4} y={-0.22} len={7.4} r={0.075} />
    <mesh position={[-2.6, -0.1, 0.3058]}><planeGeometry args={[0.13, 0.26]} /><meshBasicMaterial color="#1c120a" /></mesh>
    {Array.from({ length: 40 }, (_, i) => { const u = i / 40, L = 4.8, on = u <= p, hh = (0.06 + 0.005 * Math.sin(tt * 5 + i * 0.9)) * (1 - u * 0.92); return <group key={i} visible={on}><mesh position={[-2.6 + (u + 0.0125) * L, -0.295 + hh / 2, 0.3065]}><planeGeometry args={[L / 40 + 0.002, hh]} /><meshStandardMaterial color="#2f566b" roughness={0.25} metalness={0.2} /></mesh><mesh position={[-2.6 + (u + 0.0125) * L, -0.295 + hh, 0.3068]}><planeGeometry args={[L / 40 + 0.002, 0.005]} /><meshBasicMaterial color="#a8cfe0" /></mesh></group>; })}
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} visible={tt < 2} position={[-2.6, ((-tt * 1.4 + i * 0.1) % 0.34) + 0.12, 0.31]}><capsuleGeometry args={[0.006, 0.03, 4, 8]} /><meshBasicMaterial color="#8ec8e8" /></mesh>)}
    {[0.2, 1.3, 2.6].map((x, i) => <Mole key={i} p={[x + tt * 0.08, -0.22, 0.345]} s={0.7} paddle={tt * 2} nose={tt} />)}
    {Array.from({ length: 8 }, (_, i) => <group key={i} position={[-1.6 + i * 0.85, -0.5 - rn(i, 2) * 0.1, 0.306]} rotation={[PI / 2, 0, 0.5]}><Worm id={"pl" + i} ph={tt + i} s={1.4} /></group>)}
  </>;
}}</Scene3D>;

// ---- HA ESCUCHADO COSAS PEORES: pasa el camión y tiembla todo; la estaca zumba y nadie se entera ----
export const HTruckRumble: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 2, 1.2]} cam={{ at: [0, 0.14, 0], az: [0.3, 0.14], el: [0.15, 0.11], r: [1.85, 1.55], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="HE'S HEARD WORSE" col={AMB} />}>{(tt) => {
  const u = cl((tt - 0.4) / 3.8), x = lerp(-3, 3, u), near = Math.exp(-(x * x) / 2), sh = near * Math.sin(tt * 74) * 0.009;
  return <group position={[0, sh, sh * 0.6]}>
    <Lawn />
    <RBox s={[9, 0.012, 0.72]} p={[0, 0.004, -0.8]} r={0.003}><meshStandardMaterial color="#3b3a39" roughness={0.9} /></RBox>
    <group position={[x, 0, -0.8]}>
      <RBox s={[0.95, 0.42, 0.42]} p={[-0.18, 0.36, 0]} r={0.02}><meshStandardMaterial color="#b7402c" roughness={0.5} metalness={0.3} /></RBox>
      <RBox s={[0.3, 0.3, 0.42]} p={[0.48, 0.3, 0]} r={0.03}><meshStandardMaterial color="#d2cfc6" roughness={0.45} /></RBox>
      {[-0.42, 0.04, 0.46].map((q) => [-0.2, 0.2].map((z) => <mesh key={q + "_" + z} position={[q, 0.1, z]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.06, 24]} /><meshStandardMaterial color="#17171a" roughness={0.7} /></mesh>))}
    </group>
    <group position={[0, 0, 0.16]}>
      <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.018, 0.012, 0.2, 12]} /><meshStandardMaterial color="#8d3f35" roughness={0.5} metalness={0.3} /></mesh>
      {[0, 1, 2].map((i) => { const ph = (tt * 0.9 + i / 3) % 1; return <mesh key={i} position={[0, 0.012, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03 + ph * 0.13, 0.034 + ph * 0.13, 32]} /><meshBasicMaterial color="#efe6d2" transparent opacity={0.6 * (1 - ph)} /></mesh>; })}
    </group>
    <Blades w={3} d={1.3} n={300} h={0.08} p={[0, 0, 0.3]} skip={(x, z) => Math.hypot(x, z + 0.14) < 0.16} />
  </group>;
}}</Scene3D>;

// ---- LOS TÚNELES RIEGAN: cae la lluvia, baja por las galerías y moja la tierra ----
export const HRainSoak: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1.2, 2, 1.4]} cam={{ at: [0, -0.24, 0], az: [0.1, -0.1], el: [0.05, 0.08], r: [1.8, 1.5], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="AIR AND RAIN GO DOWN" col={GRN} />}>{(tt) => {
  const k = eio(tt, 1.2, 4.6);
  return <>
    <SoilBlock w={3.6} h={0.86} d={0.6} p={[0, 0, 0]} />
    <Tun x={-0.1} y={-0.26} len={2.4} r={0.07} />
    {[-0.82, -0.14, 0.58].map((x) => <mesh key={x} position={[x, -0.13, 0.3058]}><planeGeometry args={[0.1, 0.26]} /><meshBasicMaterial color="#1c120a" /></mesh>)}
    {[-0.82, -0.14, 0.58].map((x) => <mesh key={"f" + x} position={[x, -0.016 - 0.13 * k, 0.3066]}><planeGeometry args={[0.05, Math.max(0.001, 0.26 * k)]} /><meshBasicMaterial color="#7fc0e4" transparent opacity={0.85} /></mesh>)}
    {Array.from({ length: 46 }, (_, i) => { const x = -1.3 + rn(i, 2) * 2.6, d = rn(i, 3) * 0.3; return <mesh key={"s" + i} position={[x, -0.36 - d * k, 0.3062]} visible={k > 0.05}><circleGeometry args={[0.011 + rn(i, 4) * 0.012, 10]} /><meshBasicMaterial color="#79b3d4" transparent opacity={0.5 * k} /></mesh>; })}
    {Array.from({ length: 56 }, (_, i) => <mesh key={"r" + i} position={[-1.5 + rn(i, 5) * 3, 1.0 - ((tt * 1.8 + rn(i, 6)) % 1) * 1.0, 0.1 + rn(i, 7) * 0.3]}><capsuleGeometry args={[0.0028, 0.05, 3, 6]} /><meshBasicMaterial color="#b6d9ec" transparent opacity={0.8} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- EL PERRO EN EL JARDÍN: la tierra sale volando y la tina entra justita en el pozo ----
export const HWashtubHole: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 2, 1.2]} cam={{ at: [0, 0.06, 0], az: [-0.3, 0.1], el: [0.5, 0.4], r: [1.55, 1.28], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="I'D RATHER HAVE THE RIDGES" col={AMB} />}>{(tt) => {
  const fl = eio(tt, 0.1, 1.6), d = phys(tt, 2.0, 5, 0.65), yt = lerp(0.8, -0.14, d);
  return <>
    <Lawn />
    <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.34, 56]} /><meshBasicMaterial color="#0d0805" /></mesh>
    <mesh position={[0, 0.004, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.33, 0.47, 56]} /><meshStandardMaterial color="#553923" roughness={1} /></mesh>
    {Array.from({ length: 26 }, (_, i) => { const a = i * 0.77, sp = (tt * 1.3 + rn(i, 2)) % 1, on = tt < 1.8; return <mesh key={i} visible={on} position={[Math.cos(a) * (0.1 + sp * 0.75), 0.03 + 0.5 * Math.sin(sp * PI), Math.sin(a) * (0.1 + sp * 0.75)]} castShadow><sphereGeometry args={[0.014 + rn(i, 3) * 0.012, 8, 6]} /><meshStandardMaterial color="#402a18" roughness={1} /></mesh>; })}
    {Array.from({ length: 10 }, (_, i) => { const a = i * 0.63 + 0.3; return <mesh key={"m" + i} position={[Math.cos(a) * 0.58, 0.012, Math.sin(a) * 0.58]} scale={[1.4 * fl + 0.01, 0.34 * fl + 0.01, 1.2 * fl + 0.01]} castShadow><sphereGeometry args={[0.08, 16, 12]} /><meshStandardMaterial color="#4a3320" roughness={1} /></mesh>; })}
    <group position={[0, yt, 0]}>
      <mesh position={[0, 0.09, 0]} castShadow><cylinderGeometry args={[0.32, 0.28, 0.24, 48, 1, true]} />{M.steel({ col: "#a6a9aa", side: 2 })}</mesh>
      <mesh position={[0, 0.21, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.32, 0.012, 10, 56]} />{M.steel({ col: "#c2c5c6" })}</mesh>
      <mesh position={[0, 0.0, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.28, 48]} />{M.steel({ col: "#73767a" })}</mesh>
    </group>
    <Blades w={2.6} d={1.8} n={240} h={0.07} skip={(x, z) => Math.hypot(x, z) < 0.72} />
  </>;
}}</Scene3D>;

// ---- EL BULBO: el topo pasa sin tocarlo; atrás viene el topillo por el mismo túnel y se los come ----
export const HBulbVole: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1.2, 2, 1.4]} cam={{ at: [0, -0.16, 0], az: [-0.08, 0.1], el: [0.05, 0.08], r: [1.5, 1.26], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={940} txt="THAT'S THE VOLE" col={RED} />}>{(tt) => {
  const m = eio(tt, 0.3, 2.5), v = eio(tt, 2.6, 5.6), vx = lerp(-1.0, 0.5, v);
  return <>
    <SoilBlock w={3.4} h={0.7} d={0.6} p={[0, 0, 0]} />
    <Tun x={0} y={-0.3} len={2.8} r={0.07} />
    <Mole p={[lerp(-0.9, 1.1, m), -0.3, 0.345]} s={0.8} rot={[0, PI, 0]} paddle={tt * 3} nose={tt} />
    <Vole p={[vx, -0.36, 0.34]} s={0.62} walk={tt * 2.6} />
    {[-0.5, -0.12, 0.26].map((x, i) => { const gone = cl((vx - x + 0.02) / 0.14), s = 1 - gone; return <group key={i} position={[x, -0.15, 0.323]} scale={[Math.max(0.001, s), Math.max(0.001, s), 0.5]}>
      <mesh castShadow><sphereGeometry args={[0.058, 24, 18]} /><meshStandardMaterial color="#d9b98a" roughness={0.6} /></mesh>
      <mesh position={[0, 0.07, 0]}><coneGeometry args={[0.024, 0.08, 14]} /><meshStandardMaterial color="#b18f5b" roughness={0.7} /></mesh>
      <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.012, 0.016, 0.28, 8]} /><meshStandardMaterial color="#6b9a3e" roughness={0.7} /></mesh>
    </group>; })}
  </>;
}}</Scene3D>;

// ---- LA HOJA EN LA ESTACA: se clava al borde del jardín y flamea ----
export const HDkStake: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1, 2, 1.5]} cam={{ at: [0, 0.34, 0], az: [-0.3, 0.14], el: [0.08, 0.06], r: [1.35, 1.1], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.6} x={960} y={940} txt="IT'S FREE · BELOW" col={GRN} />}>{(tt) => {
  const s = phys(tt, 0.2, 9, 0.4), fl = eio(tt, 0.9, 1.5), wob = Math.sin(tt * 2.6) * 0.1 + Math.sin(tt * 5.3) * 0.04;
  return <>
    <Lawn />
    <mesh position={[0, 0.34, 0]} castShadow scale={[1, Math.max(0.05, s), 1]}><cylinderGeometry args={[0.018, 0.022, 0.72, 12]} />{M.wood({ base: [150, 112, 70] })}</mesh>
    <group position={[0.02, 0.62 * s, 0.02]} rotation={[0, wob, 0]} scale={Math.max(0.001, fl)}>
      <Sign id="dkst" txt="FREE DIG KEY" sub="20 CRITTERS · 1 PAGE" p={[0.25, -0.12, 0]} w={0.5} h={0.34} />
      {[-0.13, 0.05].map((y) => <mesh key={y} position={[0.006, y - 0.12, 0.012]}><cylinderGeometry args={[0.006, 0.006, 0.012, 8]} />{M.brass()}</mesh>)}
    </group>
    {[-0.8, 0.8].map((x, i) => <Flag key={i} p={[x, 0, -0.5]} tt={tt} i={i} s={1.1} />)}
    <Blades w={2.8} d={1.5} n={300} h={0.08} skip={(x, z) => Math.hypot(x, z) < 0.1} />
  </>;
}}</Scene3D>;

// ---- PARECÍA UN EJÉRCITO: veinte montículos, se apagan diecisiete, quedan tres ----
export const HArmyThree: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 2.2, 1]} cam={{ at: [0, 0, 0], az: [0.18, -0.08], el: [0.74, 0.62], r: [2.6, 2.2], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={940} txt="TWO OR THREE" col={AMB} />}>{(tt) => {
  return <>
    <Lawn />
    {Array.from({ length: 20 }, (_, i) => { const x = -1.1 + ((i * 7) % 20) * 0.115 + (rn(i, 2) - 0.5) * 0.08, z = -0.5 + ((i * 3) % 7) * 0.17 + (rn(i, 3) - 0.5) * 0.06, keep = i === 4 || i === 11 || i === 17, a = phys(tt, 0.2 + i * 0.09, 7, 0.5), g = keep ? 1 : 1 - eio(tt, 3.1 + i * 0.03, 3.8 + i * 0.03); return <group key={i}>
      <group position={[x, 0, z]} scale={Math.max(0.001, a * g)}><Mound p={[0, 0, 0]} s={0.92} /></group>
      {keep && <mesh position={[x, 0.006, z]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.2, 0.22, 48]} />{M.glow({ op: eio(tt, 3.6, 4.2) })}</mesh>}
    </group>; })}
  </>;
}}</Scene3D>;
