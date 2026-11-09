// ohf8pa · componentes 14-32 (medir, preparar, la manija, el error central y el ajuste por estaciones)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { CShadow, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { FlowPath, Hand, Rag, Tape } from "./okit";
import { Flap, GALV, GlassT, Galv, Lever, PI, Pencil, Register, ReturnGrille, Round, Sheet, Therm } from "./ductkit";

const NOW = [["Kitchen", 74], ["Dining", 72], ["Hall", 71], ["Front bed", 68], ["Bath", 65], ["Back bed", 62]] as const;

// 8:44 · LA LÍNEA DE PARTIDA: seis columnas de madera, una por cuarto, escalonadas; de 74 a 62
export const HStartLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="plaster" wallZ={-0.6} bg="#171410" key1={[-0.9, 2.2, 1.4]}
  cam={{ at: [0, 0.46, 0], az: [-0.4, 0.2], el: [0.3, 0.18], r: [2.85, 2.55], fov: 32 }}>{(tt) => <>
  {NOW.map(([n, v], i) => { const k = phys(tt, 0.3 + i * 0.28, 6, 0.55), hh = (v - 58) / 16 * 0.9, x = -0.85 + i * 0.34, c = new THREE.Color("#3f7fd0").lerp(new THREE.Color("#e8602c"), (v - 62) / 12);
    return <group key={n}><RBox s={[0.25, Math.max(0.02, hh * cl(k)), 0.25]} p={[x, (hh * cl(k)) / 2, 0]} r={0.012}><meshStandardMaterial color={c} roughness={0.5} /></RBox>
      <Therm p={[x, hh * cl(k) + 0.08, 0.02]} v={v} s={1.05} />
      <Tape txt={n.toUpperCase()} p={[x, -0.001 + 0.03, 0.19]} rot={[-1.1, 0, 0]} w={0.26} k={phys(tt, 0.8 + i * 0.28, 8, 0.45)} rev={cl(tt - 0.8 - i * 0.28)} /></group>; })}
  <Tape txt="12° TOP TO BOTTOM" col="#b3261e" p={[0.35, 0.98, -0.1]} rot={[0, 0, -0.02]} w={0.58} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 0.6)} />
</>}</Scene3D>;

// 8:59 · RESPIRANDO POR UNA ALMOHADA: el filtro plisado se tapa y el aire del otro lado se hace hilo
export const HFilterBreath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="peel" wallZ={-0.75} bg="#110f0c" key1={[0.5, 2.2, 1.3]}
  cam={{ at: [0, 0.4, 0], az: [0.72, 0.42], el: [0.2, 0.26], r: [1.7, 1.4], fov: 32 }}>{(tt) => {
  const d = eio(tt, 1.0, 4.2), fl = 1 - 0.85 * d;
  return <>
    {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[-0.42 + i * 0.04, 0.42, 0]} rotation={[0, i % 2 ? 0.55 : -0.55, 0]}><planeGeometry args={[0.05, 0.72]} /><meshStandardMaterial color={new THREE.Color("#f2eee0").lerp(new THREE.Color("#5a5348"), d)} roughness={0.95} side={THREE.DoubleSide} /></mesh>)}
    <RBox s={[0.94, 0.05, 0.1]} p={[0, 0.8, 0]} r={0.004}><meshStandardMaterial color="#b89a64" roughness={0.8} /></RBox>
    <RBox s={[0.94, 0.05, 0.1]} p={[0, 0.04, 0]} r={0.004}><meshStandardMaterial color="#b89a64" roughness={0.8} /></RBox>
    {Array.from({ length: 12 }, (_, i) => <FlowPath key={i} tt={tt} pts={[[(rn(i) - 0.5) * 0.76, 0.14 + rn(i, 2) * 0.56, 1.1], [(rn(i) - 0.5) * 0.76, 0.14 + rn(i, 2) * 0.56, 0.1]]} n={4} k={0.7} r={0.012} v={0.7} col="#a8c8ef" />)}
    {Array.from({ length: 12 }, (_, i) => <FlowPath key={i} tt={tt} pts={[[(rn(i, 5) - 0.5) * 0.76, 0.14 + rn(i, 6) * 0.56, -0.08], [(rn(i, 5) - 0.5) * 0.7, 0.14 + rn(i, 6) * 0.56, -1.1]]} n={Math.max(1, Math.round(5 * fl))} k={0.15 + 0.85 * fl} r={0.012} v={0.7} col="#ffb070" />)}
    <Tape txt="THE HOUSE CAN'T BREATHE" col="#b3261e" p={[0, 0.98, 0]} w={0.72} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.6)} />
  </>;
}}</Scene3D>;

// 9:16 · LO QUE HABÍA ADENTRO: de la rejilla levantada suben una llave, canicas, una media
const Key3: React.FC = () => <group><mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.038, 0.011, 10, 22]} />{M.brass()}</mesh><RBox s={[0.1, 0.012, 0.018]} p={[0.082, 0, 0]} r={0.003}>{M.brass()}</RBox><RBox s={[0.018, 0.012, 0.03]} p={[0.12, 0, 0.018]} r={0.003}>{M.brass()}</RBox></group>;
export const HFinds: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="oak" wall="brick" wallZ={-0.75} bg="#17140f" key1={[-0.3, 2.3, 0.6]} warm={0.9}
  cam={{ at: [0, 0.16, 0], az: [-0.3, 0.32], el: [0.62, 0.48], r: [1.15, 0.92], fov: 32 }}>{(tt) => {
  const g = (d: number) => cl(phys(tt, d, 6, 0.55));
  return <>
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.4, 0.16]} /><meshBasicMaterial color="#080604" /></mesh>
    <Register p={[0.42, 0.003, 0.2]} rot={[0, 0.4, 0]} />
    <group position={[-0.22 * g(0.5), 0.02 + 0.2 * g(0.5), 0.08]} rotation={[0.3, tt * 0.3, 0.2]}><Key3 /></group>
    {[0, 1, 2, 3].map((i) => <mesh key={i} position={[(-0.06 + i * 0.07) * g(1.3 + i * 0.12), 0.02 + 0.15 * g(1.3 + i * 0.12), -0.15 * g(1.3 + i * 0.12)]}><sphereGeometry args={[0.024, 20, 16]} /><meshPhysicalMaterial color={["#2f7fc0", "#d04c3a", "#e8b63a", "#3aa86a"][i]} roughness={0.08} clearcoat={1} /></mesh>)}
    <group position={[0.22 * g(2.4), 0.02 + 0.16 * g(2.4), 0.12]} rotation={[-0.3, 0, -0.5]}><RBox s={[0.06, 0.13, 0.03]} r={0.014}><meshStandardMaterial color="#d7584a" roughness={0.95} /></RBox><RBox s={[0.1, 0.05, 0.03]} p={[0.024, -0.082, 0]} r={0.014}><meshStandardMaterial color="#d7584a" roughness={0.95} /></RBox></group>
    <Tape txt="LOOK DOWN THERE" p={[0, 0.03, 0.34]} rot={[-1.0, 0, 0.02]} w={0.5} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 0.5)} />
  </>;
}}</Scene3D>;

// 9:56 · NUNCA TAPAR EL RETORNO: el sofá se desliza delante de la rejilla y el flujo se apaga
export const HNoReturn: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="oak" wall="paper" wallZ={0} bg="#18150f" key1={[0.8, 2, 1.5]}
  cam={{ at: [0, 0.45, 0.2], az: [0.5, 0.18], el: [0.14, 0.2], r: [2.4, 2.28], fov: 32 }}>{(tt) => {
  const c = eio(tt, 1.2, 2.7), f = 1 - 0.92 * eio(tt, 1.6, 2.8);
  return <>
    <ReturnGrille p={[0, 0.5, 0.008]} w={0.74} h={0.5} />
    {Array.from({ length: 14 }, (_, i) => <FlowPath key={i} tt={tt} pts={[[(rn(i) - 0.5) * 1.5, 0.3 + rn(i, 2) * 0.5, 1.1], [(rn(i) - 0.5) * 0.7, 0.33 + rn(i, 2) * 0.35, 0.3], [(rn(i) - 0.5) * 0.4, 0.4 + rn(i, 2) * 0.2, 0.02]]} n={3} k={f} r={0.008} v={0.7} col="#a8c8ef" />)}
    <group position={[lerp(1.9, 0, c), 0, 0.42]}>
      <RBox s={[1.5, 0.3, 0.6]} p={[0, 0.34, 0]} r={0.05}><meshStandardMaterial color="#6f7c5c" roughness={0.9} /></RBox>
      <RBox s={[1.5, 0.5, 0.2]} p={[0, 0.6, -0.26]} r={0.06}><meshStandardMaterial color="#6f7c5c" roughness={0.9} /></RBox>
      <RBox s={[0.2, 0.45, 0.6]} p={[-0.78, 0.42, 0]} r={0.06}><meshStandardMaterial color="#5f6b4c" roughness={0.9} /></RBox>
      <RBox s={[0.2, 0.45, 0.6]} p={[0.78, 0.42, 0]} r={0.06}><meshStandardMaterial color="#5f6b4c" roughness={0.9} /></RBox>
    </group>
    <Tape txt="NEVER COVER A RETURN" col="#b3261e" p={[0, 0.9, 0.03]} w={0.68} k={phys(tt, 3.0, 8, 0.45)} rev={cl((tt - 3) / 0.6)} />
  </>;
}}</Scene3D>;

// 10:25 · LA ANATOMÍA: maqueta de mesa, cada parte se ilumina al nombrarla: plenum, tronco, ramales
export const HAnatomy: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="brick" wallZ={-0.7} bg="#14110e" key1={[0.2, 2.4, 1.4]} warm={0.85}
  cam={{ at: [0.1, 0.5, 0], at1: [0.5, 0.65, 0], az: [-0.42, 0.26], el: [0.34, 0.2], r: [2.6, 2.3], fov: 32 }}>{(tt) => {
  const a = eio(tt, 0.6, 1.3), b = eio(tt, 3.0, 3.8), c = eio(tt, 5.0, 5.8), glow = (k: number, base = GALV) => new THREE.Color(base).lerp(new THREE.Color("#ffb060"), k * 0.75);
  return <>
    <RBox s={[0.6, 0.72, 0.5]} p={[-0.95, 0.36, 0]} r={0.016}><meshStandardMaterial color="#c4b48a" roughness={0.65} metalness={0.15} /></RBox>
    <RBox s={[0.64, 0.34, 0.54]} p={[-0.95, 0.9, 0]} r={0.008}><meshStandardMaterial color={glow(a)} metalness={0.8} roughness={0.3} emissive="#ff7a2a" emissiveIntensity={0.15 * a} /></RBox>
    <RBox s={[2.0, 0.26, 0.34]} p={[0.3, 0.92, 0]} r={0.008}><meshStandardMaterial color={glow(b)} metalness={0.8} roughness={0.3} emissive="#ff7a2a" emissiveIntensity={0.15 * b} /></RBox>
    {[-0.3, 0.2, 0.7, 1.2].map((x, i) => <mesh key={i} position={[x, 1.32, 0]}><cylinderGeometry args={[0.07, 0.07, 0.55, 28]} /><meshStandardMaterial color={glow(cl(c * 4 - i))} metalness={0.8} roughness={0.3} emissive="#ff7a2a" emissiveIntensity={0.15 * cl(c * 4 - i)} /></mesh>)}
    <Tape txt="PLENUM" p={[-0.95, 1.14, 0.1]} w={0.26} k={phys(tt, 0.8, 8, 0.45)} rev={cl(tt - 0.8)} />
    <Tape txt="TRUNK" p={[0.3, 0.72, 0.18]} w={0.22} k={phys(tt, 3.2, 8, 0.45)} rev={cl(tt - 3.2)} />
    <Tape txt="BRANCHES" p={[1.42, 1.28, 0.08]} w={0.3} k={phys(tt, 5.2, 8, 0.45)} rev={cl(tt - 5.2)} />
  </>;
}}</Scene3D>;

// 11:15 · LA MANIJA DICE LA VERDAD: gemelos en corte; manija y chapaleta van siempre paralelas
export const HSameWayRule: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="wood" wallZ={-0.75} bg="#110e0b" key1={[0, 2.1, 1.7]}
  cam={{ at: [0, 0.5, 0], az: [0.1, -0.1], el: [0.08, 0.14], r: [2.0, 1.7], fov: 32 }}>{(tt) => {
  const ang = eio(tt, 2.0, 3.2) * (PI / 2);
  return <>
    {[-0.48, 0.48].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <Round l={1.3} r={0.22} p={[0, 0.5, 0]} op={0.2} />
      <Flap r={0.216} ang={i ? ang : 0} p={[0, 0.5, 0]} />
      <Lever p={[0, 0.5, 0.22]} ang={i ? ang : 0} s={1.8} />
      <Tape txt={i ? "ACROSS = CLOSED" : "WITH THE PIPE = OPEN"} col={i ? "#b3261e" : "#1c7a4a"} p={[0, 1.24, 0.1]} w={0.62} k={phys(tt, i ? 3.4 : 1.0, 8, 0.45)} rev={cl(tt - (i ? 3.4 : 1))} />
    </group>)}
  </>;
}}</Scene3D>;

// 12:08 · EL ACEITE ENTRA: una gota sobre la tuerca, el óxido se oscurece y la manija recién afloja
export const HOilCreep: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="brick" wallZ={-0.5} bg="#13100c" key1={[0.8, 1.4, 1.5]}
  cam={{ at: [0, 1.04, 0.03], az: [-0.5, -0.1], el: [0.25, 0.12], r: [0.72, 0.5], fov: 28 }}>{(tt) => {
  const d = eio(tt, 0.6, 1.3), sp = eio(tt, 1.4, 3.2), wig = eio(tt, 3.8, 4.5) * 0.28 * Math.sin((tt - 3.8) * 6) * (tt > 3.8 ? 1 : 0);
  return <group position={[0, 1, 0]}>
    <Round l={1.8} r={0.2} p={[0, 0, -0.2]} />
    <mesh position={[0, 0, 0.002]}><circleGeometry args={[0.03 + 0.08 * sp, 40]} /><meshStandardMaterial color="#3b2a18" transparent opacity={0.55 * sp} roughness={0.2} /></mesh>
    <Lever p={[0, 0, 0]} s={1.4} ang={wig} col="#a8886a" />
    <mesh position={[0, lerp(0.42, 0.06, d), 0.07]} scale={[1, 1 + 0.6 * d, 1]}><sphereGeometry args={[0.012, 16, 12]} /><meshPhysicalMaterial color="#c79a30" roughness={0.1} clearcoat={1} transparent opacity={d < 1 ? 1 : 0.0001} /></mesh>
    <group position={[0.05, 0.48, 0.1]} rotation={[0.2, 0, 2.5]}><mesh><cylinderGeometry args={[0.012, 0.02, 0.32, 16]} />{M.steel({ col: "#9fa7ad" })}</mesh></group>
    <Tape txt="ONE DROP. WAIT." p={[-0.28, -0.26, 0.05]} rot={[0, 0.25, 0.04]} w={0.34} k={phys(tt, 2.8, 8, 0.45)} rev={cl((tt - 2.8) / 0.6)} />
  </group>;
}}</Scene3D>;

// 12:57 · LO BLANCO NO SE TOCA: la espátula se acerca al caño envuelto y una cinta roja la frena
export const HWhiteWrap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="blinds" floor="counter" wall="brick" wallZ={-0.6} bg="#121010" key1={[0.4, 1.9, 1.5]}
  cam={{ at: [0, 0.4, 0], az: [0.36, -0.2], el: [0.14, 0.1], r: [1.55, 1.45], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.6, 2.2), stop = phys(tt, 2.2, 8, 0.45), x = lerp(0.9, 0.22, k);
  const wrap = tex.text("wrap", 512, 256, (g) => { g.fillStyle = "#ddd6c5"; g.fillRect(0, 0, 512, 256); g.strokeStyle = "rgba(120,110,95,.5)"; g.lineWidth = 3; for (let i = -256; i < 512; i += 22) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 256, 256); g.stroke(); } });
  return <>
    <mesh position={[0, 0.4, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.21, 0.21, 2.6, 40]} /><meshStandardMaterial map={wrap} roughness={0.95} /></mesh>
    <group position={[x, 0.62 + 0.02 * Math.sin(tt * 3), 0.1]} rotation={[0, 0, -0.6]}>
      <RBox s={[0.16, 0.01, 0.13]} r={0.004}>{M.steel({ col: "#c9ced3" })}</RBox>
      <RBox s={[0.26, 0.03, 0.04]} p={[0.2, 0.006, 0]} r={0.012}><meshStandardMaterial color="#8c5a30" roughness={0.7} /></RBox>
    </group>
    <group position={[0.12, 0.72, 0.28]} scale={Math.max(0.02, cl(stop))} rotation={[0, 0, 0.78]}><RBox s={[0.68, 0.05, 0.012]} r={0.004}><meshStandardMaterial color="#c8281e" roughness={0.5} /></RBox></group>
    <group position={[0.12, 0.72, 0.29]} scale={Math.max(0.02, cl(stop))} rotation={[0, 0, -0.78]}><RBox s={[0.68, 0.05, 0.012]} r={0.004}><meshStandardMaterial color="#c8281e" roughness={0.5} /></RBox></group>
    <Tape txt="DO NOT SCRAPE IT" col="#b3261e" p={[0, 0.21, 0.16]} rot={[-0.5, 0, 0]} w={0.52} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) / 0.6)} />
  </>;
}}</Scene3D>;

// 13:47 · QUE GRITEN: dos latas unidas por un hilo, de la rejilla de arriba al sótano; el hilo vibra cuando alguien grita
const Can: React.FC<{ p: number[]; rot?: number[] }> = ({ p, rot = [0, 0, 0] }) => <group position={p as [number, number, number]} rotation={rot as [number, number, number]}><mesh><cylinderGeometry args={[0.1, 0.1, 0.2, 30, 1, true]} />{M.steel({ col: "#cfd3d6", side: THREE.DoubleSide })}</mesh><mesh position={[0, -0.1, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.1, 30]} />{M.steel({ col: "#a5abb0" })}</mesh></group>;
export const HHoller: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="sage" wallZ={-0.5} bg="#16130f" key1={[-0.6, 2.2, 1.4]}
  cam={{ at: [0, 0.85, 0], az: [-0.3, 0.25], el: [0.08, 0.14], r: [3.0, 2.75], fov: 32 }}>{(tt) => {
  const v = eio(tt, 2.2, 2.5) * (1 - eio(tt, 4.6, 5.2)), w = 0.018 * v * Math.sin(tt * 34);
  const line = tubeG("holler" + Math.round(w * 2000), [[-0.8, 1.3, 0], [-0.2, 0.86 + w, 0.02], [0.3, 0.46 - w, 0.02], [0.82, 0.3, 0]], 0.006, 36, 8);
  return <>
    <Can p={[-0.84, 1.36, 0]} rot={[0, 0, -PI / 2.4]} /><Can p={[0.86, 0.26, 0]} rot={[0, 0, PI / 1.8]} />
    <mesh geometry={line}><meshStandardMaterial color="#b89a64" roughness={0.9} /></mesh>
    <Tape txt="UPSTAIRS" p={[-0.84, 1.68, 0.02]} w={0.3} k={phys(tt, 0.7, 8, 0.45)} rev={cl(tt - 0.7)} />
    <Tape txt="BASEMENT" p={[0.86, 0.6, 0.02]} w={0.32} k={phys(tt, 1.2, 8, 0.45)} rev={cl(tt - 1.2)} />
    <Tape txt="AIR DROPPED OFF!" col="#b3261e" p={[0.45, 1.05, 0.02]} rot={[0, 0, -0.04]} w={0.56} k={phys(tt, 2.3, 8, 0.45)} rev={cl((tt - 2.3) / 0.4)} />
  </>;
}}</Scene3D>;

// 14:08 · EL CAMINO DE VUELTA: la raya de marcador cruza manija y caño; se mueve, y se ve exactamente de dónde salió
export const HWayHome: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="brick" wallZ={-0.5} bg="#14100c" key1={[0.7, 1.4, 1.5]}
  cam={{ at: [0, 1.04, 0.03], az: [0.5, 0.1], el: [0.1, 0.2], r: [0.78, 0.6], fov: 28 }}>{(tt) => {
  const a = eio(tt, 1.6, 2.6) * 0.8 * (1 - eio(tt, 4.3, 5.2));
  return <group position={[0, 1, 0]}>
    <Round l={1.8} r={0.2} p={[0, 0, -0.2]} />
    <RBox s={[0.008, 0.2, 0.002]} p={[0, 0.24, 0.002]} r={0.001} shadow={false}><meshBasicMaterial color="#111" /></RBox>
    <Lever p={[0, 0, 0]} s={1.5} ang={a} line />
    <Tape txt="BACK TO THE LINE" col="#1c7a4a" p={[-0.26, -0.24, 0.05]} rot={[0, -0.2, 0.03]} w={0.42} k={phys(tt, 4.4, 8, 0.45)} rev={cl((tt - 4.4) / 0.5)} />
  </group>;
}}</Scene3D>;

// 14:40 · LA MANGUERA CON AGUJEROS: chorros fuertes al principio, gota al final; se aprietan los primeros y el último revive
export const HHose: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="paper" wallZ={-0.75} bg="#1a1712" key1={[0.1, 2.4, 1.3]}
  cam={{ at: [0, 0.2, 0], az: [-0.34, 0.2], el: [0.42, 0.28], r: [2.3, 2], fov: 32 }}>{(tt) => {
  const fix = eio(tt, 3.6, 5.0), xs = [-0.9, -0.45, 0, 0.45, 0.9], f0 = [1, 0.75, 0.42, 0.16, 0.05];
  return <>
    <mesh position={[0, 0.06, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.05, 0.05, 2.5, 24]} /><meshStandardMaterial color="#2e7a4a" roughness={0.5} /></mesh>
    {xs.map((x, i) => { const k = lerp(f0[i], 0.52, fix); return <group key={i}>
      <FlowPath tt={tt} pts={[[x, 0.1, 0], [x, 0.2 + k * 0.4, 0.02], [x + 0.05 + 0.2 * k, 0.26 + k * 0.5, 0.05], [x + 0.2 + 0.32 * k, 0.04, 0.1]]} n={Math.round(5 + 15 * k)} k={0.2 + 0.8 * k} r={0.013} v={0.9} col="#7ec6ef" />
      {i < 2 && <group position={[x, 0.12, 0.02]} scale={Math.max(0.03, fix)}><RBox s={[0.12, 0.05, 0.12]} r={0.012}><meshStandardMaterial color="#b3261e" roughness={0.5} /></RBox></group>}
    </group>; })}
    <Tape txt="PINCH THE WARM ROOMS" col="#b3261e" p={[0, 0.03, 0.42]} rot={[-1.05, 0, 0]} w={0.62} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.6)} />
  </>;
}}</Scene3D>;

// 15:15 · LA SEGUNDA MITAD: un cuadrante de bronce: el arco de la manija avanza y el aire casi no baja hasta pasar la mitad
export const HSecondHalf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="oak" wall="plaster" wallZ={-0.75} bg="#100e0b" key1={[0.2, 2, 1.7]}
  cam={{ at: [0, 0.5, 0], az: [-0.2, 0.15], el: [0.06, 0.12], r: [1.9, 1.78], fov: 32 }}>{(tt) => {
  const p = eio(tt, 0.8, 5.2), a = p * (PI / 2), fl = Math.max(0.03, 1 - Math.pow(p, 3));
  return <>
    <group position={[-0.5, 0.5, 0]}><Round l={1.2} r={0.2} p={[0, 0, -0.2]} /><Lever p={[0, 0, 0]} s={2.2} ang={a} /></group>
    <group position={[0.55, 0.06, 0]}>
      <RBox s={[0.32, 0.86, 0.14]} p={[0, 0.43, -0.06]} r={0.012}>{M.wood({ base: [116, 76, 42] })}</RBox>
      <RBox s={[0.2, Math.max(0.02, 0.78 * fl), 0.05]} p={[0, 0.04 + (0.78 * fl) / 2, 0.02]} r={0.008}><meshStandardMaterial color="#e8843a" emissive="#c9551a" emissiveIntensity={0.3} roughness={0.5} /></RBox>
    </group>
    <Tape txt="AIR" p={[0.55, 1.02, 0.02]} w={0.14} k={phys(tt, 0.6, 8, 0.45)} rev={cl(tt - 0.6)} />
    <Tape txt="THE LAST HALF DOES THE WORK" col="#b3261e" p={[-0.1, 0.02, 0.1]} rot={[-0.6, 0, 0]} w={0.86} k={phys(tt, 4.6, 8, 0.45)} rev={cl((tt - 4.6) / 0.6)} />
  </>;
}}</Scene3D>;

// 16:07 · EL HIGH LIMIT: la aguja sube sobre el intercambiador y al tocar el límite, llama apagada
export const HHighLimit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="brick" wallZ={-0.45} bg="#120e0b" key1={[0.4, 1.7, 1.5]} warm={1.1}
  cam={{ at: [0, 0.46, 0], az: [0.3, -0.15], el: [0.1, 0.16], r: [1.7, 1.59], fov: 32 }}>{(tt) => {
  const p = eio(tt, 0.6, 4.0), off = tt > 4.1 ? 1 : 0, ang = lerp(-1.1, 0.95, p), fl = (1 - off) * (0.8 + 0.2 * Math.sin(tt * 11));
  return <>
    <RBox s={[0.8, 0.78, 0.04]} p={[-0.3, 0.46, -0.12]} r={0.01}><meshStandardMaterial color={new THREE.Color("#3a2a20").lerp(new THREE.Color("#a33a1a"), p * (1 - off * 0.5))} roughness={0.55} metalness={0.5} emissive="#ff4a14" emissiveIntensity={0.22 * p * (1 - off * 0.7)} /></RBox>
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.56 + i * 0.086, 0.1, -0.06]} scale={[1, Math.max(0.05, fl), 1]}><coneGeometry args={[0.024, 0.16, 12]} /><meshBasicMaterial color="#5aa8ff" toneMapped={false} transparent opacity={off ? 0.001 : 0.85} /></mesh>)}
    <group position={[0.52, 0.5, -0.1]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.24, 0.24, 0.04, 44]} />{M.brass()}</mesh>
      <mesh position={[0, 0, 0.022]}><circleGeometry args={[0.22, 44]} /><meshStandardMaterial color="#efe8d8" roughness={0.7} /></mesh>
      <mesh position={[0, 0, 0.024]} rotation={[0, 0, PI / 2 - 0.95]}><ringGeometry args={[0.18, 0.205, 40, 1, -0.17, 0.36]} /><meshBasicMaterial color="#c8281e" /></mesh>
      <group position={[0, 0, 0.03]} rotation={[0, 0, -ang]}><RBox s={[0.012, 0.19, 0.004]} p={[0, 0.09, 0]} r={0.002} shadow={false}><meshBasicMaterial color="#1b1b1b" /></RBox></group>
    </group>
    <Tape txt="HIGH LIMIT" col="#b3261e" p={[0.52, 0.86, -0.08]} w={0.34} k={phys(tt, 3.2, 8, 0.45)} rev={cl(tt - 3.2)} />
    <Tape txt="FURNACE QUITS" p={[-0.3, 0.98, -0.1]} w={0.44} k={phys(tt, 4.3, 8, 0.45)} rev={cl((tt - 4.3) / 0.5)} />
  </>;
}}</Scene3D>;

// 16:42 · UNA DE CADA CINCO: cinco rejillas; a una se le baja la persiana; a las otras no
export const HOneInFive: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="blinds" floor="oak" wall="sage" wallZ={-0.75} bg="#16130f" key1={[-0.4, 2.5, 1]}
  cam={{ at: [0, 0.1, 0], az: [-0.2, 0.2], el: [0.62, 0.42], r: [2.1, 1.8], fov: 32 }}>{(tt) => {
  const cl3 = eio(tt, 1.2, 2.4);
  return <>{[-0.82, -0.41, 0, 0.41, 0.82].map((x, i) => <group key={i} position={[x, 0.002, 0]}>
    <Register louver={i === 2 ? cl3 : 0} col={i === 2 ? "#6b2e22" : "#3b342b"} w={0.32} d={0.2} />
    {i !== 2 && <FlowPath tt={tt} pts={[[0, 0.02, 0], [0, 0.2, 0], [0.02, 0.42, 0]]} n={8} k={0.9} r={0.012} v={0.5} col="#ffb070" />}
    <Tape txt={i === 2 ? "1" : ""} col="#b3261e" p={[0, 0.008, 0.2]} rot={[-1.2, 0, 0]} w={0.1} k={phys(tt, 2.5, 8, 0.45)} rev={cl(tt - 2.5)} />
  </group>)}
  <Tape txt="NEVER MORE THAN 1 IN 5" col="#b3261e" p={[0, 0.03, -0.3]} rot={[-1.0, 0, 0]} w={0.78} k={phys(tt, 3.0, 8, 0.45)} rev={cl((tt - 3) / 0.6)} /></>;
}}</Scene3D>;

// 17:15 · UN DÍA ENTERO: un disco de 24 horas gira, sol y luna pasan sobre la casa
export const HWholeDay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="peel" wallZ={-0.75} bg="#0f1016" key1={[0.4, 2.4, 1.2]}
  cam={{ at: [0, 0.5, 0], az: [-0.28, 0.1], el: [0.18, 0.16], r: [2.2, 1.85], fov: 32 }}>{(tt) => {
  const a = eio(tt, 0.4, 5.6) * PI * 2 + PI * 0.9;
  return <>
    <mesh position={[0, 1, -0.62]}><planeGeometry args={[6, 4]} /><meshBasicMaterial color={new THREE.Color("#1b2438").lerp(new THREE.Color("#a9c7dc"), cl(0.5 + 0.8 * Math.sin(a)))} toneMapped={false} /></mesh>
    <group position={[0, 0, -0.1]}><RBox s={[0.5, 0.42, 0.4]} p={[0, 0.21, 0]} r={0.01}><meshStandardMaterial color="#e2d8c6" roughness={0.8} /></RBox>
      {[-0.13, 0.13].map((x) => <RBox key={x} s={[0.09, 0.11, 0.006]} p={[x, 0.27, 0.202]} r={0.002}><meshStandardMaterial color={cl(0.5 + 0.8 * Math.sin(a)) < 0.5 ? "#f6c76e" : "#50606c"} emissive={cl(0.5 + 0.8 * Math.sin(a)) < 0.5 ? "#a06a20" : "#000"} roughness={0.3} /></RBox>)}
      <RBox s={[0.09, 0.19, 0.006]} p={[0, 0.1, 0.202]} r={0.002}>{M.wood({ base: [96, 58, 36] })}</RBox>
      <RBox s={[0.06, 0.2, 0.06]} p={[0.15, 0.7, -0.05]} r={0.004}><meshStandardMaterial color="#8a4b37" roughness={0.9} /></RBox>
      <mesh position={[0, 0.58, 0]} rotation={[0, PI / 4, 0]}><coneGeometry args={[0.42, 0.32, 4]} /><meshStandardMaterial color="#6e4a33" roughness={0.8} /></mesh></group>
    <mesh position={[Math.cos(a) * 0.95, 0.55 + Math.sin(a) * 0.72, -0.1]}><sphereGeometry args={[0.1, 28, 20]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} /></mesh>
    <mesh position={[-Math.cos(a) * 0.95, 0.55 - Math.sin(a) * 0.72, -0.1]}><sphereGeometry args={[0.07, 28, 20]} /><meshBasicMaterial color="#d4e0ff" toneMapped={false} /></mesh>
    <Tape txt="A FULL DAY" p={[0, 0.05, 0.5]} rot={[-1.0, 0, 0]} w={0.42} k={phys(tt, 3.0, 8, 0.45)} rev={cl((tt - 3) / 0.6)} />
    <Tape txt="ALL THAT PLASTER IS SLOW" p={[0.05, 1.42, -0.1]} w={0.74} k={phys(tt, 4.3, 8, 0.45)} rev={cl((tt - 4.3) / 0.6)} />
  </>;
}}</Scene3D>;

// 17:29 · LA COLUMNA NUEVA: la segunda columna de números crece al lado de la primera
const NUM2 = [71, 71, 71, 69, 67, 65];
export const HNewColumn: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="brick" wallZ={-0.75} bg="#16130f" key1={[-0.6, 2.2, 0.9]}
  cam={{ at: [0, 0.02, 0.05], az: [0.23, 0.03], el: [0.95, 1.1], r: [1.2, 1.14], fov: 30 }}>{(tt) => {
  const n = Math.min(6, tt > 0.7 ? Math.floor((tt - 0.7) / 0.7) + 1 : 0);
  const L = NOW.map((r, i) => `${String(r[1])}      ${i < n ? "→ " + NUM2[i] : ""}`);
  return <><Sheet p={[0, 0.006, 0]} lines={L} head="Mon     Wed" />
    <group position={[0.12, 0.012, -0.2 + Math.max(0, n - 1) * 0.0918]} rotation={[0.25, 0, -0.5]}><Pencil /></group>
    <Tape txt="WHAT MOVED?" col="#b3261e" p={[0.42, 0.012, -0.32]} rot={[-PI / 2, 0, 0.06]} w={0.34} k={phys(tt, 5.0, 8, 0.45)} rev={cl((tt - 5) / 0.6)} /></>;
}}</Scene3D>;

// 18:00 · TRES GRADOS: dos fichas de madera se acercan hasta quedar a tres dedos
export const HShrink3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="oak" wall="plaster" wallZ={-0.5} bg="#191613" key1={[-0.7, 2.1, 1.4]}
  cam={{ at: [0, 0.55, 0], az: [0.32, -0.22], el: [0.12, 0.14], r: [2.1, 1.98], fov: 34 }}>{(tt) => {
  const k = eio(tt, 0.7, 3.6);
  return <><GlassT p={[-0.34, 0, 0]} v={lerp(74, 71, k)} /><GlassT p={[0.34, 0, 0]} v={lerp(62, 68, k)} col="#2f72c4" />
    <Tape txt={`${Math.round(lerp(12, 3, k))}°`} col="#1c7a4a" p={[0, 0.62, 0.05]} w={0.26} k={phys(tt, 0.4, 8, 0.45)} rev={1} />
    <Tape txt="THAT'S GOOD ENOUGH" p={[0, 1.06, 0.02]} w={0.62} k={phys(tt, 3.8, 8, 0.45)} rev={cl((tt - 3.8) / 0.6)} /></>;
}}</Scene3D>;

// 18:47 · TODO AL REVÉS: la casa de corte con los dos cielos: nieve y sol; el aire frío se cae y el tibio sube
export const HFlipSeason: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="wood" wallZ={-0.75} bg="#101218" key1={[0.2, 2.4, 1.5]}
  cam={{ at: [0, 0.5, 0], az: [-0.2, 0.2], el: [0.08, 0.12], r: [2.4, 2.0], fov: 32 }}>{(tt) => {
  const s = eio(tt, 2.8, 3.8);
  return <>
    <RBox s={[1.3, 1.0, 0.03]} p={[0, 0.5, -0.2]} r={0.01}><meshStandardMaterial color={new THREE.Color("#c8d6e8").lerp(new THREE.Color("#f2d9a8"), s)} roughness={0.85} /></RBox>
    <RBox s={[1.3, 0.04, 0.5]} p={[0, 0.5, 0]} r={0.008}>{M.wood({ base: [110, 72, 42] })}</RBox>
    {[-0.66, 0.66].map((x) => <RBox key={x} s={[0.05, 1.04, 0.5]} p={[x, 0.52, 0]} r={0.006}><meshStandardMaterial color="#e8e0d0" roughness={0.8} /></RBox>)}
    <RBox s={[1.42, 0.05, 0.56]} p={[0, 1.02, 0]} r={0.008}>{M.wood({ base: [90, 56, 36] })}</RBox>
    {[-0.3, 0.3].map((x, i) => <FlowPath key={i} tt={tt} pts={[[x, 0.06, 0.05], [x, 0.48, 0.05], [x + (i ? 0.1 : -0.1), 0.96, 0.05]]} n={10} k={1 - s} r={0.022} v={0.4} col="#ffa060" />)}
    {[-0.3, 0.3].map((x, i) => <FlowPath key={"c" + i} tt={tt} pts={[[x, 0.96, 0.05], [x, 0.54, 0.05], [x + (i ? 0.1 : -0.1), 0.06, 0.05]]} n={10} k={s} r={0.022} v={0.4} col="#80bfff" />)}
    <Tape txt={s < 0.5 ? "WINTER: WARM RISES" : "SUMMER: COOL FALLS"} col={s < 0.5 ? "#b3261e" : "#1f5ea8"} p={[0, 1.2, 0]} w={0.66} k={phys(tt, s < 0.5 ? 0.6 : 3.0, 8, 0.45)} rev={1} />
  </>;
}}</Scene3D>;

// 19:12 · LA W Y LA S: la manija salta de una letra a la otra, en un caño marcado
export const HTwoLetters: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="brick" wallZ={-0.5} bg="#13100c" key1={[0.5, 1.5, 1.5]}
  cam={{ at: [0, 1.03, 0.02], az: [0.25, -0.2], el: [0.1, 0.05], r: [0.7, 0.55], fov: 28 }}>{(tt) => {
  const a = lerp(0.34, -0.34, eio(tt, 1.4, 2.1) - eio(tt, 3.6, 4.3));
  return <group position={[0, 1, 0]}>
    <Round l={1.8} r={0.2} p={[0, 0, -0.2]} />
    <Tape txt="W" col="#b3261e" p={[-0.11, 0.25, 0.01]} w={0.1} k={phys(tt, 0.4, 8, 0.45)} rev={1} />
    <Tape txt="S" col="#1f5ea8" p={[0.11, 0.25, 0.01]} w={0.1} k={phys(tt, 0.8, 8, 0.45)} rev={1} />
    <Lever p={[0, 0, 0]} s={1.55} ang={a} />
    <Tape txt="TWICE A YEAR" p={[-0.24, -0.25, 0.05]} rot={[0, 0.2, 0.02]} w={0.36} k={phys(tt, 2.3, 8, 0.45)} rev={cl((tt - 2.3) / 0.5)} />
  </group>;
}}</Scene3D>;
