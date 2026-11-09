// MIO apa8pb · componentes únicos 0-11 min: la ola en el pasto, quién es el topo, las dos clases de túnel, las banderas.
import React from "react";
import * as THREE from "three";
import { H, Tag, AMB, RED, GRN, TX } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Boot, Bucket, Can, Flag, Mole, Mound, Ridge, Sign, SoilBlock, Worm, Grub } from "./farmkit";
import { Blades, Dirt, Lawn, PI, Road } from "./akit";

export type P_ = { t: number; h: H };

// pala de punta redonda: el origen es la punta de la hoja, el cabo sube por +Y
export const Spade: React.FC<{ p?: number[]; rot?: number[]; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => <group position={p as any} rotation={rot as any} scale={s}>
  <RBox s={[0.24, 0.26, 0.012]} p={[0, 0.17, 0]} r={0.005}>{M.steel({})}</RBox>
  <mesh position={[0, 0.045, 0]} scale={[1, 0.62, 0.05]} castShadow><sphereGeometry args={[0.12, 28, 14]} />{M.steel({})}</mesh>
  <mesh position={[0, 0.34, 0]} castShadow><cylinderGeometry args={[0.024, 0.04, 0.12, 20]} />{M.steel({})}</mesh>
  <mesh position={[0, 0.86, 0]} castShadow><cylinderGeometry args={[0.019, 0.021, 0.96, 18]} /><meshStandardMaterial color="#a97c48" roughness={0.6} /></mesh>
  <mesh position={[0, 1.34, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.02, 0.02, 0.17, 16]} /><meshStandardMaterial color="#6e4c2a" roughness={0.55} /></mesh>
</group>;
// túnel visto en el corte (cara frontal z = d/2)
export const Tun: React.FC<{ x?: number; y?: number; len?: number; r?: number; z?: number; col?: string }> = ({ x = 0, y = -0.2, len = 1, r = 0.065, z = 0.304, col = "#1c120a" }) =>
  <mesh position={[x, y, z]} rotation={[0, 0, PI / 2]} scale={[1, 1, 0.01]}><capsuleGeometry args={[r, len, 10, 24]} /><meshBasicMaterial color={col} /></mesh>;

// ---- LA OLA: el pasto se levanta y la lomada camina despacio, dejando un rastro apretado ----
const swell = (x: number, z: number, x0: number) => 0.05 * Math.exp(-(((x - x0) / 0.13) ** 2 + (z / 0.09) ** 2));
export const HSodWave: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1.4, 1.2, 0.6]}
  cam={{ at: [0, 0.03, 0], az: [0.42, 0.12], el: [0.34, 0.26], r: [1.15, 0.92], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={940} txt="THAT'S NOT THE WIND" col={AMB} />}>{(tt) => {
  const x0 = lerp(-0.85, 0.62, eio(tt, 0.1, 6.6));
  return <>
    <Lawn /><Road id="swr" pts={[[-1.4, 0], [-0.7, 0.01], [0, -0.01], [0.9, 0]]} w={0.1} col="#4c7433" u={cl((x0 + 1.4) / 2.3)} />
    <mesh position={[x0, 0, 0]} scale={[0.17, 0.052, 0.12]} castShadow receiveShadow><sphereGeometry args={[1, 32, 20]} /><meshStandardMaterial color="#5a8a3c" roughness={1} /></mesh>
    {Array.from({ length: 620 }, (_, i) => { const x = -1.2 + rn(i, 2) * 2.2, z = -0.5 + rn(i, 3) * 0.9, b = swell(x, z, x0), hh = 0.07 + rn(i, 4) * 0.05, sh = b > 0.006 ? Math.sin(tt * 26 + i) * 0.28 : 0.05 * Math.sin(tt * 1.2 + i);
      return <mesh key={i} position={[x, b + hh / 2, z]} rotation={[sh, rn(i, 5) * 3, sh * 0.7]} castShadow><coneGeometry args={[0.0048, hh, 5]} /><meshStandardMaterial color={i % 3 ? "#5d8f3a" : "#79a84a"} roughness={0.8} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- NUEVE DE DIEZ: diez palas clavadas en fila; nueve se caen; una sola se queda ----
export const HNineTenSpades: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 2, 1.2]}
  cam={{ at: [0, 0.42, 0], az: [-0.2, 0.18], el: [0.17, 0.13], r: [2.1, 1.75], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="NINE OUT OF TEN MISS" col={RED} />}>{(tt) => {
  return <><Lawn />{Array.from({ length: 10 }, (_, i) => { const x = -1.08 + i * 0.24, stay = i === 7, a = phys(tt, 0.1 + i * 0.09, 8, 0.4), f = stay ? 0 : eio(tt, 2.0 + rn(i, 3) * 0.9, 2.9 + rn(i, 3) * 0.9), d = i % 2 ? 1 : -1;
    return <Spade key={i} s={0.62} p={[x, 0.7 * (1 - a) - 0.03, 0.03 * d]} rot={[0.03 * d + d * 1.48 * f, 0.1 * d, 0]} />; })}
    <mesh position={[0.6, 0.006, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.11, 0.125, 48]} />{M.glow({ op: eio(tt, 3.2, 3.9) })}</mesh>
  </>;
}}</Scene3D>;

// ---- AL TACHO: chicle, molinete y estaca sónica vuelan al barril; quedan la pala y el balde ----
const arc = (k: number, a: number[], b: number[], up = 0.8) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + up * Math.sin(k * PI), lerp(a[2], b[2], k)] as [number, number, number];
export const HJunkBarrel: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1, 2, 1.2]}
  cam={{ at: [0, 0.34, 0], az: [0.3, -0.05], el: [0.3, 0.24], r: [2.0, 1.72], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={940} txt="A SPADE AND A BUCKET" col={AMB} />}>{(tt) => {
  const K = [eio(tt, 0.3, 1.5), eio(tt, 1.1, 2.3), eio(tt, 1.9, 3.1)], B = [0, 0.24, 0], sp = phys(tt, 3.3, 7, 0.4), bk = phys(tt, 3.7, 7, 0.4);
  const P = [arc(K[0], [-1.1, 0.3, 0.5], B), arc(K[1], [1.1, 0.5, 0.4], B), arc(K[2], [-0.9, 0.2, -0.5], B)];
  return <>
    <Lawn />
    <mesh position={[0, 0.32, 0]} castShadow receiveShadow><cylinderGeometry args={[0.29, 0.27, 0.64, 40, 1, true]} />{M.steel({ side: THREE.DoubleSide, col: "#6a6f70" })}</mesh>
    {[0.14, 0.5].map((y) => <mesh key={y} position={[0, y, 0]}><torusGeometry args={[0.285, 0.008, 8, 40]} />{M.steel({ col: "#4c5152" })}</mesh>).map((m, i) => <group key={i} rotation={[0, 0, 0]}>{React.cloneElement(m, { rotation: [PI / 2, 0, 0] })}</group>)}
    {K[0] < 1 && <RBox s={[0.15, 0.04, 0.06]} p={P[0]} rot={[K[0] * 5, K[0] * 3, 0]} r={0.008}><meshStandardMaterial color="#e06a93" /></RBox>}
    {K[1] < 1 && <group position={P[1]} rotation={[K[1] * 4, 0, K[1] * 2]}><mesh position={[0, -0.16, 0]}><cylinderGeometry args={[0.008, 0.008, 0.36, 8]} />{M.steel({})}</mesh>{[0, 1, 2, 3].map((i) => <mesh key={i} position={[0, 0, 0.012]} rotation={[0, 0, i * PI / 2 + tt * 9]}><mesh position={[0.075, 0, 0]}><boxGeometry args={[0.15, 0.05, 0.004]} /><meshStandardMaterial color={i % 2 ? "#d9b13a" : "#c23b2e"} side={THREE.DoubleSide} /></mesh></mesh>)}</group>}
    {K[2] < 1 && <group position={P[2]} rotation={[K[2] * 6, 0, 0.4]}><mesh position={[0, -0.09, 0]}><coneGeometry args={[0.035, 0.2, 14]} /><meshStandardMaterial color="#3c7a46" /></mesh><RBox s={[0.1, 0.09, 0.08]} p={[0, 0.05, 0]} r={0.012}><meshStandardMaterial color="#222" /></RBox></group>}
    <Spade s={0.72} p={[0.62, 1.1 * (1 - sp) - 0.03, 0.14]} rot={[0.03, 0.4, -0.04]} />
    <Bucket s={0.8} p={[-0.62, 0.7 * (1 - bk), 0.2]} />
  </>;
}}</Scene3D>;

// ---- BANCO LIMPIO: un tablón barre latas y cajas de la mesa; cae una pala sola ----
export const HClearBench: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" key1={[-0.8, 2, 1.2]}
  cam={{ at: [0, 0.1, 0], az: [-0.25, 0.14], el: [0.42, 0.32], r: [1.5, 1.28], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={940} txt="NOTHING LEFT OVERNIGHT" col={TX} />}>{(tt) => {
  const sw = eio(tt, 1.2, 2.9), x = lerp(1.25, -1.5, sw), sp = phys(tt, 3.2, 7, 0.42), hit = (x0: number) => Math.max(0, x0 - (x - 0.1));
  return <>
    <Can p={[0.42 - hit(0.42), 0.02, 0.14]} r={0.08} h={0.2} /><Can p={[-0.1 - hit(-0.1), 0.02, -0.14]} r={0.07} h={0.16} />
    <RBox s={[0.32, 0.18, 0.22]} p={[0.18 - hit(0.18), 0.11, -0.02]} r={0.006}><meshStandardMaterial map={tex.wood(0)} /></RBox>
    <RBox s={[0.06, 0.16, 0.9]} p={[x, 0.1, 0]} r={0.012}><meshStandardMaterial color="#8a6238" roughness={0.75} /></RBox>
    <Spade s={0.72} p={[0.62, 0.04 + 0.7 * (1 - sp), 0.02]} rot={[-PI / 2, 0, PI / 2 - 0.5]} />
  </>;
}}</Scene3D>;

// ---- EL TICKET: del cajón sale un papel largo y al final sólo importa el total ----
export const HReceiptRoll: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="wood" key1={[-0.6, 1.8, 1.1]}
  cam={{ at: [0, 0.02, 0.12], az: [0.1, -0.08], el: [0.92, 0.78], r: [1.0, 0.82], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={940} txt="AND STILL THE RIDGES" col={RED} />}>{(tt) => {
  const k = eio(tt, 0.3, 3.6), T = tex.text("rrcpt", 512, 1400, (g) => { g.fillStyle = "#f6f0df"; g.fillRect(0, 0, 512, 1400); g.fillStyle = "#6f6a60"; for (let i = 0; i < 11; i++) { const y = 70 + i * 96; g.fillRect(50, y, 200 + (i * 73) % 150, 22); g.fillRect(400, y, 60, 22); } g.fillStyle = "#1a1a1a"; g.fillRect(40, 1160, 432, 6); g.font = "800 92px Georgia"; g.textAlign = "center"; g.fillText("TOTAL $200", 256, 1290); });
  return <>
    <RBox s={[0.64, 0.14, 0.5]} p={[0, 0.07, -0.58]} r={0.02}><meshStandardMaterial color="#39393b" roughness={0.5} /></RBox>
    <mesh position={[0, 0.012, lerp(-1.25, -0.03, k)]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.42, 1.15]} /><meshStandardMaterial map={T} roughness={0.8} /></mesh>
  </>;
}}</Scene3D>;

// ---- DOS PALAS: junto al topo, dos palas giran hacia afuera y son sus manos ----
export const HTwoShovels: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1, 2, 1.2]}
  cam={{ at: [0, 0.08, 0], az: [-0.12, 0.18], el: [0.3, 0.2], r: [1.25, 1.02], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={940} txt="HANDS LIKE SHOVELS" col={AMB} />}>{(tt) => {
  const a = phys(tt, 0.6, 5, 0.55), b = phys(tt, 0.9, 5, 0.55);
  return <>
    <Dirt w={4} d={4} rx={8} />
    <Mole p={[0, 0.03, 0.02]} s={1.1} paddle={tt * 1.2} nose={tt} />
    <group position={[-0.1, 0.1, 0]} rotation={[0, 0, lerp(0.1, PI / 2 + 0.12, a)]}><Spade s={0.42} p={[0, 0.42, 0]} rot={[0, 0, PI]} /></group>
    <group position={[0.1, 0.1, 0]} rotation={[0, 0, lerp(-0.1, -PI / 2 - 0.12, b)]}><Spade s={0.42} p={[0, 0.42, 0]} rot={[0, 0, PI]} /></group>
  </>;
}}</Scene3D>;

// ---- TE SIENTE: una bota pisa arriba y los anillos bajan por la tierra hasta el topo ----
export const HFootRipples: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 1.8, 1.3]}
  cam={{ at: [0, -0.2, 0], az: [0.1, -0.1], el: [0.05, 0.08], r: [1.7, 1.45], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={0.9} x={960} y={940} txt="HE FEELS YOU WALK" col={AMB} />}>{(tt) => {
  const st = Math.max(0, Math.floor((tt - 0.3) / 1.5)), dt = (tt - 0.3) - st * 1.5, x = -0.75 + st * 0.3, y = dt < 0.5 ? 0.28 * (1 - eio(dt, 0, 0.5)) : dt < 1.1 ? 0 : 0.28 * eio(dt, 1.1, 1.5);
  return <>
    <SoilBlock w={3.6} h={0.95} d={0.6} p={[0, 0, 0]} />
    <Tun x={0.75} y={-0.5} len={1.3} />
    <Mole p={[0.55, -0.53, 0.33]} s={0.9} paddle={tt * 0.8} nose={tt} />
    <Boot p={[x, y + 0.01, 0.1]} rot={[0, PI / 2, 0]} s={1.5} />
    {[0, 1, 2, 3, 4].map((i) => { const tb = 0.8 + i * 1.5, a = cl((tt - tb) / 1.5), x0 = -0.75 + i * 0.3; return <group key={i}>{[0, 0.25, 0.5].map((d) => { const k = cl(a - d), R = 0.05 + 1.1 * k; return <mesh key={d} visible={k > 0.01 && k < 0.99} position={[x0, -0.004, 0.306]}><ringGeometry args={[R, R + 0.009, 64, 1, PI, PI]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.8 * (1 - k)} /></mesh>; })}</group>; })}
  </>;
}}</Scene3D>;

// ---- SIN GUSANOS NO: las larvas se apagan una por una; los gusanos siguen ahí ----
const FW: React.FC<{ id: string; x: number; y: number; ph: number; s?: number }> = ({ id, x, y, ph, s = 1.5 }) => <group position={[x, y, 0.306]} rotation={[PI / 2, 0, 0.3 * Math.sin(x * 8)]}><Worm id={id} ph={ph} s={s} /></group>;
export const HGrubsGone: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 1.8, 1.3]}
  cam={{ at: [0, -0.2, 0], az: [-0.12, 0.08], el: [0.06, 0.1], r: [1.15, 0.95], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="STILL ALL THE WORMS" col={GRN} />}>{(tt) => <>
  <SoilBlock w={2.6} h={0.65} d={0.6} p={[0, 0, 0]} />
  {Array.from({ length: 12 }, (_, i) => { const k = Math.max(0.001, 1 - eio(tt, 0.8 + i * 0.18, 1.2 + i * 0.18)); return <group key={i} position={[-0.75 + i * 0.135, -0.07 - rn(i, 2) * 0.05, 0.31]} rotation={[PI / 2, 0, 0]} scale={k}><Grub s={1.9} /></group>; })}
  {Array.from({ length: 9 }, (_, i) => <FW key={i} id={"gg" + i} x={-0.72 + i * 0.18 + rn(i, 3) * 0.05} y={-0.2 - rn(i, 4) * 0.28} ph={tt * 0.9 + i * 0.2} />)}
</>}</Scene3D>;

// ---- QUINCE PIES POR HORA: junto a la loma que avanza, el reloj da una vuelta ----
export const HClockRidge: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1, 2, 1]}
  cam={{ at: [0, 0.08, 0], az: [0.28, -0.05], el: [0.38, 0.3], r: [1.8, 1.55], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="FIFTEEN FEET AN HOUR" col={AMB} />}>{(tt) => {
  const k = eio(tt, 0.3, 6.0), R = 0.26;
  return <>
    <Lawn />
    <group position={[-1.1, 0, 0.1]} scale={[Math.max(0.01, k), 1, 1]}><Ridge id="clk" pts={[[0, 0, 0], [0.5, 0, 0.03], [1.1, 0, -0.03], [1.9, 0, 0.02], [2.2, 0, 0]]} r={0.05} /></group>
    <group position={[0.1, R + 0.05, -0.35]} rotation={[-0.08, 0, 0]}>
      <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[R + 0.02, R + 0.02, 0.05, 56]} />{M.brass({})}</mesh>
      <mesh position={[0, 0, 0.027]}><circleGeometry args={[R, 56]} /><meshStandardMaterial color="#f2ead5" roughness={0.6} /></mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i * PI / 6) * R * 0.86, Math.cos(i * PI / 6) * R * 0.86, 0.03]} rotation={[0, 0, -i * PI / 6]}><planeGeometry args={[0.012, 0.042]} /><meshBasicMaterial color="#2a2118" /></mesh>)}
      <group position={[0, 0, 0.036]} rotation={[0, 0, -k * 2 * PI]}><mesh position={[0, R * 0.38, 0]}><planeGeometry args={[0.018, R * 0.76]} /><meshBasicMaterial color="#1a1410" /></mesh></group>
      <group position={[0, 0, 0.032]} rotation={[0, 0, -k * 2 * PI / 12 - 1]}><mesh position={[0, R * 0.25, 0]}><planeGeometry args={[0.024, R * 0.5]} /><meshBasicMaterial color="#1a1410" /></mesh></group>
    </group>
  </>;
}}</Scene3D>;

// ---- CÓMO SALE LA TIERRA: a la izquierda sube derecho y arma un volcán; a la derecha sale de costado y arma abanico ----
export const HDirtPour: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 2, 1]}
  cam={{ at: [0, 0.14, 0], az: [-0.1, 0.14], el: [0.36, 0.26], r: [1.75, 1.5], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={940} txt="ROUND MEANS MOLE" col={AMB} />}>{(tt) => {
  const g = eio(tt, 0.3, 5.2);
  return <>
    <Lawn />
    <Mound p={[-0.6, 0, 0]} s={Math.max(0.05, 2.6 * g)} />
    <group position={[0.6, 0, 0]} rotation={[0, 0.4, 0]}><Mound p={[0, 0, 0]} s={Math.max(0.05, 2.6 * g)} half /></group>
    {Array.from({ length: 34 }, (_, i) => { const ph = ((tt * 0.8 + i * 0.11) % 1), a = i * 2.4, l = ph * 0.2, y = 0.03 + 0.42 * ph * (1 - ph) * 4 * 0.45;
      return <mesh key={i} visible={tt < 5.4} position={[-0.6 + Math.cos(a) * l, y + 0.1 * g, Math.sin(a) * l]}><sphereGeometry args={[0.013, 8, 6]} /><meshStandardMaterial color="#6e5233" /></mesh>; })}
    {Array.from({ length: 34 }, (_, i) => { const ph = ((tt * 0.8 + i * 0.13) % 1), sp = (rn(i, 3) - 0.5) * 1.5, l = 0.05 + ph * 0.34, y = 0.03 + 0.24 * ph * (1 - ph);
      return <mesh key={i} visible={tt < 5.4} position={[0.6 + Math.cos(0.4 + sp) * l, y, -Math.sin(0.4 + sp) * l]}><sphereGeometry args={[0.013, 8, 6]} /><meshStandardMaterial color="#6e5233" /></mesh>; })}
    <Sign id="dpm" txt="MOLE" p={[-0.6, 0.72, -0.28]} w={0.34} h={0.12} /><Sign id="dpg" txt="GOPHER" p={[0.6, 0.72, -0.28]} w={0.34} h={0.12} />
    {[-0.6, 0.6].map((x) => <mesh key={x} position={[x, 0.33, -0.3]}><cylinderGeometry args={[0.012, 0.012, 0.66, 10]} /><meshStandardMaterial color="#8b6a44" /></mesh>)}
  </>;
}}</Scene3D>;

// ---- LOS TORCIDOS SE BORRAN: se dibujan caminos torcidos y el pasto los tapa; la autopista junto a la vereda queda ----
const CR = [[[-1.0, 0.1], [-0.7, -0.15], [-0.4, 0.14], [-0.2, -0.2]], [[-0.1, 0.55], [0.15, 0.3], [-0.05, 0.05], [0.25, -0.25]], [[0.3, 0.55], [0.55, 0.3], [0.48, 0.05], [0.8, -0.15]], [[-0.9, 0.5], [-0.6, 0.42], [-0.5, 0.25], [-0.25, 0.3]]];
export const HCrookedFade: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1, 3, 1]}
  cam={{ at: [0, 0, 0.1], az: [0.05, -0.08], el: [1.08, 0.94], r: [2.2, 1.9], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={940} txt="USED ONCE. THEN NEVER." col={TX} />}>{(tt) => {
  const fade = eio(tt, 3.2, 5.2), c = new THREE.Color("#a98a5e").lerp(new THREE.Color("#5b8a3c"), fade).getStyle();
  return <>
    <Lawn />
    <RBox s={[3.4, 0.03, 0.34]} p={[0, 0.015, -0.72]} r={0.005}><meshStandardMaterial color="#b8b4ab" roughness={0.9} /></RBox>
    <Road id="cfhw" pts={[[-1.8, -0.46], [-0.6, -0.46], [0.6, -0.46], [1.8, -0.46]]} w={0.075} col="#a07c50" u={eio(tt, 3.0, 4.6)} />
    {CR.map((p, i) => <Road key={i} id={"cf" + i} pts={p} w={0.05} col={c} u={eio(tt, 0.1 + i * 0.35, 1.3 + i * 0.35)} />)}
  </>;
}}</Scene3D>;

// ---- APOYÁ EL PIE: la bota baja despacio sobre un pie de loma y la deja a ras; aparece la bandera ----
export const HLeanPress: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 1.8, 1]}
  cam={{ at: [0, 0.07, 0], az: [0.45, 0.22], el: [0.3, 0.22], r: [1.2, 0.98], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="LEAN ON IT. DON'T STOMP." col={AMB} />}>{(tt) => {
  const b = eio(tt, 0.8, 2.6), l = eio(tt, 3.6, 4.4), f = phys(tt, 4.3, 7, 0.4);
  return <>
    <Lawn />
    <Ridge id="lpa" pts={[[-1.3, 0, 0], [-0.8, 0, 0.01], [-0.26, 0, 0]]} r={0.06} />
    <Ridge id="lpb" pts={[[0.26, 0, 0], [0.8, 0, -0.01], [1.3, 0, 0]]} r={0.06} />
    <Ridge id="lpm" pts={[[-0.26, 0, 0], [0, 0, 0], [0.26, 0, 0]]} r={0.06} up={Math.max(0.03, 1 - b)} />
    <group position={[0, lerp(0.45, 0.03, b) + 0.5 * l, 0]} rotation={[0, PI / 2, 0]}><Boot s={1.85} /></group>
    <Flag p={[0.1, 0.5 * (1 - f), 0.16]} tt={tt} s={1.3} />
  </>;
}}</Scene3D>;

// ---- HUMEDAD: cae agua; sólo los dos dedos de arriba se oscurecen; los gusanos suben a la franja ----
export const HDampLine: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 2, 1.3]}
  cam={{ at: [0, -0.16, 0], az: [0.1, -0.1], el: [0.05, 0.09], r: [1.25, 1.05], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="THE WORMS COME UP" col={AMB} />}>{(tt) => {
  const w = eio(tt, 0.3, 2.4);
  return <>
    <SoilBlock w={2.8} h={0.7} d={0.6} p={[0, 0, 0]} grass />
    <mesh position={[0, -0.075 * w, 0.303]}><planeGeometry args={[2.8, Math.max(0.001, 0.15 * w)]} /><meshBasicMaterial color="#1a0f08" transparent opacity={0.5} /></mesh>
    {Array.from({ length: 50 }, (_, i) => { const y = 0.7 - (((tt * 1.1 + rn(i, 2)) % 1) * 0.72); return <mesh key={i} visible={tt < 2.8} position={[-1.3 + rn(i, 3) * 2.6, y, 0.2]}><capsuleGeometry args={[0.0035, 0.03, 4, 8]} /><meshBasicMaterial color="#cfe2ff" transparent opacity={0.8} /></mesh>; })}
    {Array.from({ length: 8 }, (_, i) => <FW key={i} id={"dl" + i} x={-0.8 + i * 0.24} y={lerp(-0.44 - rn(i, 2) * 0.1, -0.1 - rn(i, 4) * 0.03, eio(tt, 2.2 + i * 0.1, 4.2 + i * 0.1))} ph={tt + i * 0.2} />)}
  </>;
}}</Scene3D>;

// ---- CAMINO ROTO: el techo aplastado tapa el túnel; el topo empuja y lo vuelve a levantar ----
export const HCaveFix: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 1.8, 1.3]}
  cam={{ at: [0, -0.1, 0], az: [-0.1, 0.1], el: [0.08, 0.12], r: [1.15, 0.95], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="HE CAN'T STAND IT" col={AMB} />}>{(tt) => {
  const m = eio(tt, 0.2, 2.2), r = eio(tt, 2.2, 4.4), x = lerp(-0.75, -0.2, m) + 0.5 * eio(tt, 4.4, 6);
  return <>
    <SoilBlock w={2.6} h={0.6} d={0.6} p={[0, 0, 0]} />
    <Tun x={-0.65} y={-0.18} len={0.9} /><Tun x={0.65} y={-0.18} len={0.9} /><Tun x={0} y={-0.18} len={0.45} col={new THREE.Color("#6f5236").lerp(new THREE.Color("#1c120a"), r).getStyle()} />
    <mesh position={[0, -0.003, 0]} scale={[0.34, Math.max(0.01, 0.075 * r), 0.3]}><sphereGeometry args={[1, 28, 16]} /><meshStandardMaterial color="#6d8f47" roughness={1} /></mesh>
    <Mole p={[x, -0.2, 0.34]} s={0.82} paddle={tt * (r > 0 && r < 1 ? 3 : 1)} nose={tt} />
    <Ridge id="cfl" pts={[[-1.3, 0, 0], [-0.36, 0, 0]]} r={0.05} /><Ridge id="cfr" pts={[[0.36, 0, 0], [1.3, 0, 0]]} r={0.05} />
  </>;
}}</Scene3D>;

// ---- CINCO PLANAS, UNA ARRIBA: seis banderas sobre lomas aplastadas; una se levanta sola ----
export const HFiveFlat: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1, 2, 1]}
  cam={{ at: [0, 0.08, 0], az: [-0.32, 0.12], el: [0.3, 0.22], r: [1.9, 1.62], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={940} txt="THAT'S THE ROAD HE'S USING" col={AMB} />}>{(tt) => {
  const u = phys(tt, 2.6, 4, 0.55);
  return <>
    <Lawn />
    {Array.from({ length: 6 }, (_, i) => { const x = -1.05 + i * 0.42, up = i === 3 ? Math.max(0.05, u) : 0.05, f = phys(tt, 0.2 + i * 0.16, 7, 0.4);
      return <group key={i}><group position={[x, 0, 0]}><Ridge id={"ff" + i} pts={[[-0.17, 0, 0], [0, 0, 0], [0.17, 0, 0]]} r={0.06} up={up} /></group><Flag p={[x, 0.5 * (1 - f), 0.12]} tt={tt} i={i} s={1.3} col={i === 3 && u > 0.4 ? "#ffc23a" : "#ff6a1a"} /></group>; })}
  </>;
}}</Scene3D>;

// ---- DOS MINUTOS DE LIMA: la lima va y viene y el filo empieza a brillar ----
export const HFileSpade: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" key1={[-0.7, 1.6, 1]}
  cam={{ at: [0, 0.03, 0.2], az: [0.25, 0.05], el: [0.58, 0.46], r: [0.72, 0.6], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="A DULL SPADE SHAKES THE GROUND" col={AMB} />}>{(tt) => {
  const s = 0.5 + 0.5 * Math.sin(tt * 7), g = eio(tt, 0.8, 5);
  return <>
    <group position={[0, 0.03, -0.32]} rotation={[-PI / 2, 0, PI]}><Spade s={1.25} /></group>
    <mesh position={[0, 0.036, -0.32 + 0.015]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.14, 0.15, 48, 1, 0.5, PI - 1]} />{M.glow({ op: g })}</mesh>
    <group position={[lerp(-0.14, 0.14, s), 0.07, 0.02]} rotation={[0, 0, 0.05]}><RBox s={[0.5, 0.016, 0.05]} r={0.004}>{M.steel({ col: "#5e6062" })}</RBox><RBox s={[0.18, 0.04, 0.045]} p={[0.32, 0, 0]} r={0.016}>{M.wood({ base: [90, 58, 32] })}</RBox></group>
    {Array.from({ length: 16 }, (_, i) => { const ph = (tt * 2.4 + i * 0.13) % 1; return <mesh key={i} position={[lerp(-0.14, 0.14, s) + (i - 8) * 0.012, 0.05 + 0.1 * ph, 0.03 + 0.1 * ph * (i % 2 ? 1 : -0.3)]}><sphereGeometry args={[0.0026, 6, 4]} /><meshBasicMaterial color="#ffc873" transparent opacity={(1 - ph) * g} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- EL SOL SOBRE LA CERCA: sale por el costado, sube y la mejor hora se acaba a las diez ----
export const HSunArc: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1.6, 0.8, 0.8]} warm={0.8}
  cam={{ at: [0, 0.42, 0], az: [0.05, -0.05], el: [0.08, 0.06], r: [2.2, 1.95], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="SUNUP TILL ABOUT TEN" col={AMB} />}>{(tt) => {
  const a = lerp(PI * 0.96, PI * 0.42, eio(tt, 0.2, 6.2)), x = 1.6 * Math.cos(a), y = 0.3 + 1.0 * Math.sin(a);
  return <>
    <Lawn />
    {Array.from({ length: 17 }, (_, i) => <RBox key={i} s={[0.13, 0.5, 0.02]} p={[-1.6 + i * 0.2, 0.25, -0.7]} r={0.004}>{M.wood({ base: [148, 112, 74] })}</RBox>)}
    <RBox s={[3.5, 0.05, 0.02]} p={[0, 0.34, -0.72]} r={0.004}>{M.wood({ base: [120, 90, 58] })}</RBox>
    <mesh position={[x, y, -1.4]}><sphereGeometry args={[0.13, 32, 20]} /><meshBasicMaterial color="#ffd27a" /></mesh>
    <mesh position={[x, y, -1.45]}><circleGeometry args={[0.34, 40]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.28} /></mesh>
    <Blades w={3.2} d={1.4} n={420} h={0.09} />
    <Flag p={[0.2, 0, 0]} tt={tt} s={2.2} />
  </>;
}}</Scene3D>;

// ---- TRES PIES AL COSTADO: se despliega el metro de carpintero desde la bota hasta la loma ----
export const HYardstickSide: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1, 2, 1]}
  cam={{ at: [0.1, 0.03, 0.1], az: [0.1, -0.08], el: [0.92, 0.8], r: [1.45, 1.22], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="BESIDE IT. NOT ON IT." col={AMB} />}>{(tt) => {
  const k = eio(tt, 0.7, 3.0), T = tex.text("ydst", 1024, 64, (g) => { g.fillStyle = "#e9c56a"; g.fillRect(0, 0, 1024, 64); g.fillStyle = "#231a0e"; for (let i = 0; i < 36; i++) g.fillRect(i * 28.4, 0, i % 12 === 0 ? 5 : 2, i % 12 === 0 ? 50 : 24); g.font = "bold 30px Georgia"; ["1 FT", "2 FT", "3 FT"].forEach((s, i) => g.fillText(s, 250 + i * 340, 56)); });
  return <>
    <Lawn />
    <Ridge id="ydr" pts={[[-0.5, 0, -1.3], [-0.5, 0, 0], [-0.5, 0, 1.3]]} r={0.07} />
    <group position={[0.52, 0, 0.14]} rotation={[0, PI / 2, 0]}><Boot s={1.4} /></group>
    <group position={[0.45, 0, -0.16]} rotation={[0, PI / 2, 0]}><Boot s={1.4} /></group>
    <group position={[0.42, 0.012, 0]} scale={[Math.max(0.01, k), 1, 1]}><mesh position={[-0.46, 0, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.92, 0.07]} /><meshStandardMaterial map={T} roughness={0.5} /></mesh></group>
  </>;
}}</Scene3D>;

// ---- PARADO: la taza cortada a la mitad; el café baja, el vapor se apaga, y el reloj pasa ----
export const HCoffeeDrop: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-0.8, 1.6, 1.1]}
  cam={{ at: [0, 0.14, 0], az: [-0.18, 0.2], el: [0.14, 0.2], r: [0.78, 0.66], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={0.8} x={960} y={940} txt={tt < 2.6 ? "TWENTY MINUTES" : tt < 4.6 ? "MAYBE FORTY" : "SOME MORNINGS, AN HOUR"} col={AMB} />}>{(tt) => {
  const l = lerp(0.2, 0.035, eio(tt, 0.3, 6.2)), st = 1 - eio(tt, 2.2, 5.6);
  return <>
    <Lawn />
    <Bucket p={[0, -0.14, 0]} s={0.7} col="#d8d4c8" />
    <mesh position={[0, 0.103, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.106, 40]} /><meshStandardMaterial map={tex.wood(1)} /></mesh>
    <group position={[0, 0.105, 0]}>
      <mesh position={[0, 0.115, 0]} castShadow><cylinderGeometry args={[0.075, 0.07, 0.23, 44, 1, true]} /><meshPhysicalMaterial color="#eef6f7" roughness={0.06} transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh position={[0, l / 2 + 0.006, 0]}><cylinderGeometry args={[0.069, 0.066, l, 44]} /><meshStandardMaterial color="#2c1608" roughness={0.3} /></mesh>
      <mesh position={[0, 0.115, 0]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.14, 0.23]} /><meshBasicMaterial color="#1a0f08" transparent opacity={0.0} /></mesh>
      {Array.from({ length: 14 }, (_, i) => { const ph = (tt * 0.35 + i * 0.08) % 1; return <mesh key={i} position={[0.01 * Math.sin(i + ph * 7), l + 0.03 + ph * 0.34, 0.02]}><sphereGeometry args={[0.018 + ph * 0.03, 10, 8]} /><meshBasicMaterial color="#f4efe3" transparent opacity={0.3 * (1 - ph) * st} /></mesh>; })}
    </group>
  </>;
}}</Scene3D>;

// ---- MEDIA PULGADA: una moneda sobre el pasto sube apenas; las briznas tiemblan ----
export const HHalfInchLift: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1.4, 1.1, 0.5]}
  cam={{ at: [0, 0.03, 0], az: [0.34, 0.14], el: [0.17, 0.1], r: [0.56, 0.44], fov: 24 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={940} txt="HALF AN INCH. THAT'S ALL." col={AMB} />}>{(tt) => {
  const k = eio(tt, 1.0, 3.0) - 0.15 * eio(tt, 5.0, 6.4), Y = 0.052 * k + 0.006;
  return <>
    <Lawn />
    <mesh scale={[0.3, 0.05 * k + 0.002, 0.18]} castShadow receiveShadow><sphereGeometry args={[1, 40, 20]} /><meshStandardMaterial color="#5a8a3c" roughness={1} /></mesh>
    <mesh position={[0, Y - 0.003, 0]} rotation={[0.03 * k, 0, 0.05 * k]} castShadow><cylinderGeometry args={[0.052, 0.052, 0.006, 48]} />{M.steel({ col: "#c9ccce" })}</mesh>
    {Array.from({ length: 300 }, (_, i) => { const x = -0.8 + rn(i, 2) * 1.6, z = -0.45 + rn(i, 3) * 0.75, b = 0.05 * k * Math.exp(-((x / 0.3) ** 2 + (z / 0.18) ** 2)), hh = 0.06 + rn(i, 4) * 0.05, sh = b > 0.004 ? 0.22 * Math.sin(tt * 22 + i) : 0.04 * Math.sin(tt + i); if (Math.hypot(x, z) < 0.07) return null;
      return <mesh key={i} position={[x, b + hh / 2, z]} rotation={[sh, 0, sh * 0.7]} castShadow><coneGeometry args={[0.0035, hh, 5]} /><meshStandardMaterial color={i % 3 ? "#5d8f3a" : "#79a84a"} roughness={0.8} /></mesh>; })}
  </>;
}}</Scene3D>;
