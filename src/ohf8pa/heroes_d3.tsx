// ohf8pa · componentes 33-46 (cuando sigue frío, el retorno, el proyecto entero, seguridad y el cierre)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { CShadow, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { FlowPath, Hand, Tape } from "./okit";
import { GALV, Galv, GlassT, Lever, PI, Register, Round, Sheet, Therm } from "./ductkit";

// 20:20 · LA TELARAÑA: colgando de la junta, todas las hebras se inclinan para el mismo lado: ahí hay fuga
export const HCobweb: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="blinds" floor="counter" wall="brick" wallZ={-0.55} bg="#12100d" key1={[-0.4, 1.8, 1.4]}
  cam={{ at: [0, 0.34, 0], az: [-0.28, -0.06], el: [0.02, -0.06], r: [1.1, 1.03], fov: 30 }}>{(tt) => {
  const f = eio(tt, 1.0, 2.2);
  return <>
    <Galv s={[2.2, 0.36, 0.4]} p={[0, 0.72, -0.1]} seams={3} />
    {Array.from({ length: 16 }, (_, i) => { const x = -0.14 + i * 0.019, l = 0.28 + rn(i, 3) * 0.28, sw = 0.05 * Math.sin(tt * 2.4 + i) * (0.4 + f), b = f * (0.22 + rn(i, 5) * 0.1);
      const g = tubeG(`cw${i}_${Math.round(sw * 300)}_${Math.round(b * 60)}`, [[x, 0.54, 0.1], [x + b * 0.4, 0.54 - l * 0.45, 0.1], [x + b + sw, 0.54 - l, 0.1]], 0.0016, 18, 5);
      return <mesh key={i} geometry={g}><meshStandardMaterial color="#d7d2c5" roughness={0.9} transparent opacity={0.8} /></mesh>; })}
    <Tape txt="THE LEAK IS HERE" col="#b3261e" p={[-0.5, 0.25, 0.1]} rot={[0, 0.3, 0.03]} w={0.5} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.6)} />
  </>;
}}</Scene3D>;

// 20:32 · EL FLEXIBLE AHORCADO: la correa aprieta el tubo; el aire cae a la mitad; se saca y el tubo respira
export const HFlexPinch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="paper" wallZ={-0.75} bg="#15120e" key1={[0.3, 2.4, 1.2]}
  cam={{ at: [0, 0.2, 0], az: [0.3, 0.05], el: [0.26, 0.2], r: [1.8, 1.5], fov: 30 }}>{(tt) => {
  const rel = eio(tt, 3.0, 3.9), sq = 1 - rel;
  const rad = (u: number) => 0.14 * (1 - 0.62 * sq * Math.exp(-Math.pow((u - 0.5) * 11, 2)));
  const g = tubeG(`flex${Math.round(sq * 30)}`, [[-1.3, 0.2, 0], [-0.4, 0.21, 0], [0.4, 0.21, 0], [1.3, 0.2, 0]], rad, 160, 26);
  return <>
    <mesh geometry={g} castShadow><meshStandardMaterial color="#d5d7d8" metalness={0.55} roughness={0.42} /></mesh>
    {Array.from({ length: 34 }, (_, i) => { const u = i / 33, x = -1.3 + 2.6 * u, r = rad(u); return <mesh key={i} position={[x, 0.205, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[r, 0.0035, 6, 26]} /><meshStandardMaterial color="#8f9396" metalness={0.5} roughness={0.5} /></mesh>; })}
    <group position={[0, 0.2 + rel * 0.5, rel * 0.25]}><mesh rotation={[0, PI / 2, 0]}><torusGeometry args={[0.058 + rel * 0.08, 0.012, 8, 30]} /><meshStandardMaterial color="#d8c288" roughness={0.6} /></mesh></group>
    <FlowPath tt={tt} pts={[[-1.2, 0.2, 0], [0, 0.205, 0], [1.2, 0.2, 0]]} n={Math.round(7 + 15 * rel)} k={0.3 + 0.7 * rel} r={0.02} v={0.5} col="#ffb070" />
    <Tape txt="TOO TIGHT" col="#b3261e" p={[0.0, 0.7, 0]} w={0.3} k={phys(tt, 0.9, 8, 0.45)} rev={cl(tt - 0.9)} />
  </>;
}}</Scene3D>;

// 20:56 · LA VENDA VIEJA: la cinta de tela cuelga de la unión; la mastic la reemplaza de una pasada
export const HBadTape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="brick" wallZ={-0.45} bg="#120f0c" key1={[0.5, 1.8, 1.4]}
  cam={{ at: [0, 0.4, 0], az: [0.42, 0], el: [0.04, 0.1], r: [1.1, 0.85], fov: 30 }}>{(tt) => {
  const off = eio(tt, 2.2, 3.1), m = eio(tt, 3.2, 5.0), wob = 0.1 * Math.sin(tt * 2.8) * (1 - off);
  return <>
    <Round l={2.4} r={0.18} p={[0, 0.4, -0.08]} rot={[0, 0, PI / 2]} />
    <group position={[0, 0.4, 0.1]} rotation={[0, 0, wob]}><mesh position={[0.13, -0.24 - off * 1.0, 0.0]} rotation={[0.2, 0, 0.14]}><planeGeometry args={[0.13, 0.62]} /><meshStandardMaterial color="#8d8a84" roughness={0.9} side={THREE.DoubleSide} /></mesh></group>
    <mesh position={[0, 0.4, -0.08]} rotation={[0, 0, PI / 2]} scale={[1, Math.max(0.03, m), 1]}><cylinderGeometry args={[0.187, 0.187, 0.2, 40, 1, true]} /><meshStandardMaterial color="#8a8f7d" roughness={0.75} side={THREE.DoubleSide} /></mesh>
    <Tape txt="NOT DUCT TAPE" col="#b3261e" p={[-0.5, 0.74, 0.05]} w={0.42} k={phys(tt, 1.0, 8, 0.45)} rev={cl(tt - 1)} />
    <Tape txt="MASTIC" col="#1c7a4a" p={[0.42, 0.74, 0.05]} w={0.24} k={phys(tt, 4.2, 8, 0.45)} rev={cl(tt - 4.2)} />
  </>;
}}</Scene3D>;

// 21:44 · EL CUARTO GLOBO: se cierra la puerta, el cuarto se infla como un globo y el aire no entra
export const HBalloon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="plaster" wallZ={-0.75} bg="#15120e" key1={[-0.6, 2.4, 1.4]}
  cam={{ at: [0, 0.42, 0], az: [-0.5, 0.2], el: [0.3, 0.22], r: [2.1, 1.75], fov: 32 }}>{(tt) => {
  const c = eio(tt, 1.0, 1.8), inf = eio(tt, 1.8, 4.2), s = 1 + 0.14 * inf;
  return <>
    <group position={[0, 0.42, 0]} scale={[s, s, s]}><RBox s={[1.2, 0.8, 1.0]} r={0.03 + 0.14 * inf}><meshPhysicalMaterial color="#ecdcc5" roughness={0.75} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} /></RBox></group>
    <group position={[0.6 * s, 0.05, 0.36]} rotation={[0, -0.9 * (1 - c), 0]}><RBox s={[0.03, 0.72, 0.42]} p={[0, 0.36, -0.2]} r={0.004}>{M.wood({ base: [130, 86, 50] })}</RBox></group>
    <FlowPath tt={tt} pts={[[-0.28, 0.02, 0], [-0.28, 0.36, 0], [0.1, 0.5, 0.05], [0.6, 0.4, 0.2]]} n={12} k={1 - 0.75 * inf} r={0.02} v={0.5} col="#ffb070" />
    <Register p={[-0.28, 0.02, 0]} w={0.28} d={0.14} />
    <Tape txt="DOOR SHUT = NO WAY OUT" col="#b3261e" p={[0, 1.08, 0]} w={0.74} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) / 0.6)} />
  </>;
}}</Scene3D>;

// 22:02 · TRES CUARTOS DE PULGADA: la regla debajo de la puerta y la luz que pasa
export const HGap34: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="oak" wall="sage" wallZ={-0.75} bg="#15120e" key1={[0.6, 1.6, 1.3]}
  cam={{ at: [0, 0.14, 0.05], az: [0.42, 0.16], el: [0.16, 0.22], r: [1.1, 0.8], fov: 28 }}>{(tt) => {
  const r = phys(tt, 0.7, 7, 0.5);
  return <>
    <RBox s={[1.4, 1.2, 0.05]} p={[0, 0.72, -0.05]} r={0.006}>{M.wood({ base: [112, 72, 42] })}</RBox>
    <mesh position={[0, 0.06, -0.03]}><planeGeometry args={[1.38, 0.1]} /><meshBasicMaterial color="#ffe2ab" toneMapped={false} /></mesh>
    <group position={[-0.1, 0.002, lerp(0.8, 0.24, cl(r))]}>
      <RBox s={[0.1, 0.008, 0.6]} p={[0, 0.004, 0]} r={0.002}><meshStandardMaterial color="#e6c04e" roughness={0.5} /></RBox>
    </group>
    <group position={[0.25, 0.06, 0.02]} scale={[1, Math.max(0.02, cl(phys(tt, 1.9, 7, 0.5))), 1]}><RBox s={[0.018, 0.112, 0.012]} r={0.003}>{M.brass()}</RBox></group>
    {[-0.5, -0.2, 0.1, 0.42].map((x, i) => <FlowPath key={x} tt={tt + i * 0.2} pts={[[x, 0.07, -0.7], [x, 0.06, -0.05], [x + 0.03, 0.06, 0.4], [x + 0.06, 0.1, 0.8]]} n={9} k={cl(tt - 1)} r={0.012} v={0.45} col="#f1b77a" />)}
    <Tape txt={'3/4" TO 1"'} col="#b3261e" p={[0.42, 0.42, 0.0]} w={0.36} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.5)} />
  </>;
}}</Scene3D>;

// 22:37 · EL CANASTO: el hueco entre vigas tapado con chapa; el aire se escapa por todas las rendijas
export const HPanJoist: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="brick" wallZ={-1.1} bg="#120f0c" key1={[0, 1.6, 3.0]}
  cam={{ at: [0, 1.3, 0], az: [0.45, -0.1], el: [-0.28, -0.12], r: [2.0, 1.7], fov: 34 }}>{(tt) => {
  const k = eio(tt, 0.8, 1.9);
  return <group position={[0, 1, 0]}>
    <RBox s={[2.4, 0.06, 2.4]} p={[0, 0.92, 0]} r={0.004}>{M.wood({ base: [120, 80, 46] })}</RBox>
    {[-1, -0.42, 0.42, 1].map((x) => <RBox key={x} s={[0.12, 0.56, 2.4]} p={[x, 0.6, 0]} r={0.008}>{M.wood({ base: [132, 90, 52] })}</RBox>)}
    <RBox s={[0.72, 0.012, 2.2]} p={[0, 0.33, 0]} r={0.002}>{M.steel({ col: "#a9afb3" })}</RBox>
    {[[-0.4, 0.4], [0.4, 0.3], [-0.38, -0.2], [0.39, -0.5], [-0.41, -0.8], [0.4, 0.8], [0.0, 1.05], [0.0, -1.1]].map(([x, z], i) => <FlowPath key={i} tt={tt} pts={[[x * 0.92, 0.36, z], [x * 1.05, 0.26, z * 1.04], [x * 1.3, 0.05, z * 1.1]]} n={7} k={k} r={0.014} v={0.45} col="#a8c8ef" />)}
    <Tape txt="LIKE A BASKET" col="#b3261e" p={[0, 0.22, 1.0]} rot={[0.2, 0, 0]} w={0.42} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.6)} />
  </group>;
}}</Scene3D>;

// 23:19 · DOS MANIJAS, UN DÍA: dos manijas giran, luego la hoja del almanaque pasa, recién ahí la siguiente
const DayT = (k: string) => tex.text("day" + k, 300, 360, (g) => { g.fillStyle = "#f4efde"; g.fillRect(0, 0, 300, 360); g.fillStyle = "#b3261e"; g.fillRect(0, 0, 300, 80); g.fillStyle = "#fff"; g.font = "bold 50px Georgia"; g.textAlign = "center"; g.fillText("WAIT", 150, 58); g.fillStyle = "#22181a"; g.font = "bold 170px Georgia"; g.fillText(k, 150, 270); });
export const HTwoDay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" wallZ={-0.42} bg="#141009" key1={[-0.3, 2.1, 1.4]}
  cam={{ at: [0, 0.36, 0], az: [-0.26, 0.15], el: [0.14, 0.12], r: [1.75, 1.45], fov: 32 }}>{(tt) => {
  const a = eio(tt, 0.5, 1.3) * 0.5, b = eio(tt, 1.2, 2.0) * 0.5, p = eio(tt, 3.0, 3.8);
  return <>
    {[-0.52, -0.08].map((x, i) => <group key={i} position={[x, 0.36, 0]}><Round l={0.9} r={0.13} p={[0, 0, -0.13]} /><Lever s={1.15} ang={i ? b : a} /></group>)}
    <group position={[0.54, 0.42, -0.1]}><mesh><planeGeometry args={[0.46, 0.55]} /><meshStandardMaterial map={DayT("2")} roughness={0.9} /></mesh>
      <group position={[0, 0.275, 0.004]} rotation={[-p * 2.6, 0, 0]}><mesh position={[0, -0.275, 0]}><planeGeometry args={[0.46, 0.55]} /><meshStandardMaterial map={DayT("1")} roughness={0.9} side={THREE.DoubleSide} /></mesh></group></group>
    <Tape txt="TWO HANDLES. ONE DAY." col="#b3261e" p={[-0.25, 0.84, 0.05]} w={0.66} k={phys(tt, 2.2, 8, 0.45)} rev={cl((tt - 2.2) / 0.6)} />
  </>;
}}</Scene3D>;

// 24:30 · LO QUE ESCRIBIÓ UN SEÑOR: una tarjeta clavada en un corcho con el comentario, y un cartel al lado: lo escuché
export const HCommentCard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" wallZ={-0.2} bg="#15110c" key1={[-0.4, 1.9, 1.4]} warm={0.9}
  cam={{ at: [0, 0.4, 0], az: [0.2, -0.1], el: [0.04, 0.1], r: [1.3, 1.1], fov: 32 }}>{(tt) => {
  const k = phys(tt, 0.5, 7, 0.5);
  const m = tex.text("comm1", 720, 360, (g) => { g.fillStyle = "#fcfaf3"; g.fillRect(0, 0, 720, 360); g.fillStyle = "#2a2a2a"; g.font = "bold 80px Georgia"; g.textAlign = "center"; g.fillText("Wasted my time.", 360, 170); g.font = "42px Georgia"; g.fillStyle = "#777"; g.fillText("a comment on one of my videos", 360, 260); });
  return <>
    <RBox s={[2, 1.2, 0.04]} p={[0, 0.4, -0.16]} r={0.01}><meshStandardMaterial color="#b98d5a" roughness={0.95} /></RBox>
    <group position={[0, 0.4, 0]} scale={Math.max(0.02, cl(k))} rotation={[0, 0, -0.03]}><mesh castShadow><planeGeometry args={[1.0, 0.5]} /><meshStandardMaterial map={m} roughness={0.9} /></mesh></group>
    <mesh position={[0, 0.65, 0.02]}><sphereGeometry args={[0.024, 16, 12]} /><meshPhysicalMaterial color="#c8281e" roughness={0.1} clearcoat={1} /></mesh>
    <Tape txt="SO HERE'S THE WHOLE JOB" col="#1c7a4a" p={[0, 0.03, 0.03]} w={0.74} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.6)} />
  </>;
}}</Scene3D>;

// 25:04 · LA SEMANA: seis tablillas caen, una por día, con su tarea
const WK = [["SAT", "MEASURE"], ["SUN", "READ"], ["MON", "LABEL"], ["TUE", "PINCH 2"], ["WED", "READ"], ["THU", "AGAIN"]];
export const HWeekPlan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="oak" wall="peel" wallZ={-0.75} bg="#16130f" key1={[-0.5, 2.4, 0.9]}
  cam={{ at: [0, 0.03, 0], az: [-0.3, 0.1], el: [0.9, 0.7], r: [2.1, 1.75], fov: 32 }}>{(tt) => <>
  {WK.map(([d, j], i) => { const k = phys(tt, 0.4 + i * 0.55, 6, 0.55), m = tex.text("wk" + d + j, 320, 300, (g) => { g.fillStyle = "#e9d9b4"; g.fillRect(0, 0, 320, 300); g.fillStyle = "#6b3b20"; g.font = "bold 56px Georgia"; g.textAlign = "center"; g.fillText(d, 160, 90); g.fillStyle = "#22180f"; g.font = "bold 46px Georgia"; g.fillText(j, 160, 205); });
    return <group key={d} position={[-0.8 + i * 0.32, 0.02 + (1 - cl(k)) * 0.5, (i % 2) * 0.14 - 0.07]} rotation={[-PI / 2, 0, (i % 3 - 1) * 0.08]}><mesh castShadow><planeGeometry args={[0.28, 0.28]} /><meshStandardMaterial map={m} roughness={0.8} /></mesh></group>; })}
</>}</Scene3D>;

// 26:27 · REVOLVER LA CASA: un frasco de dos capas (naranja y azul) se mezcla con una cuchara hasta quedar parejo
export const HFanStir: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="sage" wallZ={-0.5} bg="#16130f" key1={[-0.6, 2, 1.3]}
  cam={{ at: [0, 0.42, 0], az: [0.36, -0.15], el: [0.14, 0.2], r: [1.5, 1.2], fov: 32 }}>{(tt) => {
  const m = eio(tt, 1.0, 5.0), cTop = new THREE.Color("#ee8a3a").lerp(new THREE.Color("#c2a07a"), m), cBot = new THREE.Color("#3f7fd0").lerp(new THREE.Color("#c2a07a"), m), a = tt * 3.4;
  return <>
    <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.28, 0.28, 0.84, 40, 1, true]} />{M.glass({ op: 0.24 })}</mesh>
    <mesh position={[0, 0.56, 0]}><cylinderGeometry args={[0.265, 0.265, 0.34, 40]} /><meshStandardMaterial color={cTop} roughness={0.4} /></mesh>
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.265, 0.265, 0.36, 40]} /><meshStandardMaterial color={cBot} roughness={0.4} /></mesh>
    <group position={[Math.cos(a) * 0.11, 0.72, Math.sin(a) * 0.11]} rotation={[Math.sin(a) * 0.14, 0, Math.cos(a) * 0.14]}><mesh><cylinderGeometry args={[0.012, 0.012, 1.0, 14]} />{M.steel({ col: "#d9dde0" })}</mesh></group>
    <Tape txt="FAN ON: IT STIRS THE HOUSE" p={[0, 1.22, 0]} w={0.82} k={phys(tt, 3.0, 8, 0.45)} rev={cl((tt - 3) / 0.6)} />
  </>;
}}</Scene3D>;

// 27:19 · UNA POR PISO: casa en corte con tres pisos; una alarma de CO por piso se prende en verde
const COAlarm: React.FC<{ p: number[]; on: number }> = ({ p, on }) => <group position={p as [number, number, number]}>
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.035, 36]} /><meshPhysicalMaterial color="#f5f2ea" roughness={0.4} clearcoat={0.4} /></mesh>
  <mesh position={[0, 0.04, 0.02]}><circleGeometry args={[0.018, 16]} /><meshBasicMaterial color={new THREE.Color("#2a2a2a").lerp(new THREE.Color("#42e07a"), on)} toneMapped={false} /></mesh>
  {[0, 1, 2].map((i) => <RBox key={i} s={[0.1, 0.006, 0.002]} p={[0, -0.01 - i * 0.018, 0.019]} r={0.001} shadow={false}><meshBasicMaterial color="#888" /></RBox>)}
</group>;
export const HCOFloors: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="oak" wall="brick" wallZ={-0.75} bg="#101016" key1={[0.3, 2.3, 1.5]}
  cam={{ at: [0, 0.76, 0], az: [0.22, -0.2], el: [0.06, 0.12], r: [2.3, 2.19], fov: 32 }}>{(tt) => <>
  {[0, 0.52, 1.04].map((y, i) => <group key={i} position={[0, y, 0]}>
    <RBox s={[1.3, 0.5, 0.03]} p={[0, 0.25, -0.2]} r={0.006}><meshStandardMaterial color={["#b9b3a3", "#d6cdb8", "#d9d0ba"][i]} roughness={0.9} /></RBox>
    <RBox s={[1.34, 0.025, 0.5]} p={[0, 0.0, 0]} r={0.004}>{M.wood({ base: [110, 72, 42] })}</RBox>
    <COAlarm p={[0.3, 0.34, -0.16]} on={eio(tt, 0.8 + i * 0.9, 1.2 + i * 0.9)} />
    <Tape txt={["BASEMENT", "FIRST FLOOR", "UPSTAIRS"][i]} p={[-0.3, 0.32, -0.17]} w={0.34} k={phys(tt, 0.7 + i * 0.9, 8, 0.45)} rev={cl(tt - 0.7 - i * 0.9)} />
  </group>)}
</>}</Scene3D>;

// 28:59 · EL VENTILADOR LADRÓN: un ventilador en un ramal y el vecino se queda sin aire
export const HBoosterSteal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="brick" wallZ={-0.7} bg="#121010" key1={[0, 2.3, 1.2]}
  cam={{ at: [0, 0.5, 0], az: [0.34, -0.1], el: [0.2, 0.14], r: [2.1, 1.75], fov: 32 }}>{(tt) => {
  const k = eio(tt, 1.0, 2.2), a = tt * 15 * k;
  return <>
    <mesh position={[0, 0.3, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.15, 0.15, 2.4, 36, 1, true]} /><meshStandardMaterial color="#d6dde1" transparent opacity={0.24} roughness={0.75} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    {[-0.42, 0.42].map((x, i) => <group key={i}><Round l={0.78} r={0.11} p={[x, 0.82, 0]} op={0.22} />
      <FlowPath tt={tt} pts={[[-1.2, 0.3, 0], [x - 0.1, 0.3, 0], [x, 0.46, 0], [x, 1.2, 0]]} n={Math.round(i ? 4 + 18 * k : 14 - 10 * k)} k={i ? 0.5 + 0.5 * k : 0.8 - 0.65 * k} r={0.02} v={0.5} col="#ffb070" /></group>)}
    <group position={[0.42, 0.74, 0]} rotation={[0, a, 0]}>{[0, 1, 2, 3].map((j) => <RBox key={j} s={[0.17, 0.004, 0.04]} p={[Math.cos((j * PI) / 2) * 0.05, 0, Math.sin((j * PI) / 2) * 0.05]} rot={[0.3, (-j * PI) / 2, 0]} r={0.002} shadow={false}>{M.steel({ col: "#d7dbe0" })}</RBox>)}</group>
    <Tape txt="BOOSTER" col="#b3261e" p={[0.74, 0.94, 0.04]} w={0.26} k={phys(tt, 1.2, 8, 0.45)} rev={cl(tt - 1.2)} />
    <Tape txt="ROBS THE NEIGHBOR" col="#1f5ea8" p={[-0.62, 1.32, 0.04]} w={0.54} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.6)} />
  </>;
}}</Scene3D>;

// 29:45 · MÁS GRANDE NO ARREGLA: el horno crece; el termómetro del cuarto frío ni se mueve
export const HBigger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="brick" wallZ={-0.6} bg="#14110d" key1={[0, 2.2, 1.4]}
  cam={{ at: [0.1, 0.5, 0], az: [-0.3, 0.2], el: [0.14, 0.18], r: [2.4, 2.28], fov: 32 }}>{(tt) => {
  const g = eio(tt, 0.7, 3.2), k = phys(tt, 0.7, 5, 0.6), s = lerp(0.7, 1.35, cl(g));
  return <>
    <group position={[-0.55, 0, 0]} scale={[s, s, s]}><RBox s={[0.6, 0.86, 0.5]} p={[0, 0.43, 0]} r={0.016}><meshStandardMaterial color="#c4b48a" roughness={0.65} metalness={0.15} /></RBox></group>
    <GlassT p={[0.65, 0, 0]} v={62} col="#2f72c4" />
    <Tape txt="STILL 62°" col="#1f5ea8" p={[0.65, 1.04, 0]} w={0.3} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) / 0.6)} />
    <Tape txt="BIGGER = MORE AIR, SAME WRONG PLACE" col="#b3261e" p={[-0.1, 0.05, 0.42]} rot={[-1.0, 0, 0]} w={1.1} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.6)} />
  </>;
}}</Scene3D>;

// 30:30 · TODAS ESPERANDO: la fila de ramales con sus manijas, cada una con su cinta, la cámara pasa de largo despacio
const ROOMS = ["KITCHEN", "DINING", "HALL", "FRONT BED", "BATH", "BACK BED"];
export const HAllSix: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="brick" wallZ={-0.6} bg="#141009" key1={[-0.6, 1.5, 1.8]} warm={0.9}
  cam={{ at: [-0.9, 0.42, 0], at1: [0.9, 0.42, 0], az: [0.28, 0.14], el: [0.05, 0.05], r: [1.5, 1.44], fov: 32 }}>{(tt) => <>
  {ROOMS.map((n, i) => { const x = -1.5 + i * 0.6; return <group key={n}>
    <Round l={1.4} r={0.13} p={[x, 0.42, -0.13]} />
    <Lever p={[x, 0.45, 0]} s={1.15} ang={[0.5, 0.3, 0, 0, 0, 0][i]} line />
    <Tape txt={n} p={[x, 0.8, 0.02]} w={0.26} k={phys(tt, 0.4 + i * 0.25, 8, 0.45)} rev={cl(tt - 0.4 - i * 0.25)} />
  </group>; })}
</>}</Scene3D>;
