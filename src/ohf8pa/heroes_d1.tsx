// ohf8pa · componentes 1-13 (la diferencia, la manija, dónde entra el aire, por qué la casa se desparejó)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { CShadow, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { FlowPath, Hand, Rag, Tape } from "./okit";
import { Flap, GALV, GlassT, Galv, Lever, PI, Pencil, Register, ReturnGrille, Round, Sheet, Therm } from "./ductkit";

// 0:30 · LA DIFERENCIA: dos termómetros de pared; uno sube a 74, el otro no pasa de 62; la distancia se abre con un fleje de carpintero
export const HGap12: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="oak" wall="plaster" wallZ={-0.5} bg="#191613" key1={[-1, 2, 1.5]}
  cam={{ at: [0, 0.55, 0], az: [-0.32, 0.26], el: [0.1, 0.16], r: [2.15, 1.75], fov: 34 }}>{(tt) => {
  const a = eio(tt, 0.3, 2.6), f = phys(tt, 2.8, 7, 0.45), hTop = 0.05 + 0.86 * 0.9 * (24 / 40), hLow = 0.05 + 0.86 * 0.9 * (12 / 40), mid = (hTop + hLow) / 2;
  return <>
    <GlassT p={[-0.4, 0, 0]} v={lerp(52, 74, a)} />
    <GlassT p={[0.4, 0, 0]} v={lerp(52, 62, a)} col="#2f72c4" />
    <Tape txt="KITCHEN" p={[-0.4, 1.06, 0]} w={0.3} k={phys(tt, 0.6, 8, 0.45)} rev={cl(tt - 0.6)} />
    <Tape txt="BACK BEDROOM" p={[0.4, 1.06, 0]} w={0.42} k={phys(tt, 0.9, 8, 0.45)} rev={cl(tt - 0.9)} />
    <group position={[0, mid, 0.02]} scale={[1, Math.max(0.02, cl(f)), 1]}>
      <RBox s={[0.02, hTop - hLow, 0.012]} r={0.003}>{M.brass()}</RBox>
      <RBox s={[0.1, 0.012, 0.012]} p={[0, (hTop - hLow) / 2, 0]} r={0.003}>{M.brass()}</RBox>
      <RBox s={[0.1, 0.012, 0.012]} p={[0, -(hTop - hLow) / 2, 0]} r={0.003}>{M.brass()}</RBox>
    </group>
    <Tape txt="12°" col="#b3261e" p={[0, mid, 0.06]} w={0.24} k={phys(tt, 3.3, 8, 0.45)} rev={cl((tt - 3.3) / 0.5)} />
    <CShadow p={[-0.4, 0, 0]} s={[0.2, 0.1]} o={0.5} /><CShadow p={[0.4, 0, 0]} s={[0.2, 0.1]} o={0.5} />
  </>;
}}</Scene3D>;

// 0:50 · DEL TAMAÑO DE UN DEDO: el ramal llena el cuadro y una mano real se acerca a la manijita para dar la escala
export const HLeverFinger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="brick" wallZ={-0.62} bg="#14110e" key1={[0.6, 1.2, 1.4]} warm={0.8}
  cam={{ at: [0, 1.02, 0.1], az: [0.5, -0.1], el: [0.12, -0.05], r: [0.9, 0.55], fov: 30 }}>{(tt) => {
  const c = eio(tt, 0.8, 2.3), wig = eio(tt, 3.6, 4.1) * Math.sin(Math.max(0, tt - 3.6) * 7) * 0.05;
  return <group position={[0, 1, 0]}>
    <Round l={2.4} r={0.2} p={[0, 0, -0.2]} />
    <Lever p={[0, 0, 0]} ang={wig} s={1.15} />
    <Hand p={[lerp(0.75, 0.13, c), lerp(-0.38, -0.08, c), 0.1]} rot={[0, -0.25, 2.2]} s={0.95} bend={0.5} />
    <Tape txt="THIS" col="#b3261e" p={[-0.26, 0.19, 0.08]} rot={[0, 0.2, 0.05]} w={0.17} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) / 0.5)} />
  </group>;
}}</Scene3D>;

// 1:02 · SEIS NÚMEROS: el lápiz escribe en la hoja, renglón a renglón, los seis cuartos
const NUMS = ["Kitchen   74", "Dining    72", "Hall       71", "Front bed  68", "Bath      65", "Back bed  62"];
export const HSixNums: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="paper" wallZ={-0.75} bg="#16130f" key1={[-0.6, 2.2, 0.9]}
  cam={{ at: [0, 0.02, 0.05], az: [-0.5, -0.1], el: [0.95, 1.12], r: [1.25, 1.05], fov: 30 }}>{(tt) => {
  const n = Math.min(6, Math.floor(Math.max(0, tt - 0.5) / 0.85) + (tt > 0.5 ? 1 : 0)), py = -0.2 + Math.min(5, n - 1) * 0.0918;
  return <>
    <Sheet p={[0, 0.006, 0]} lines={NUMS.slice(0, n)} />
    <group position={[lerp(-0.1, 0.16, ((tt - 0.5) % 0.85) / 0.85), 0.012, py]} rotation={[0.25, 0, -0.55]}><Pencil /></group>
    <Tape txt="SIX NUMBERS" col="#b3261e" p={[0.4, 0.012, -0.34]} rot={[-PI / 2, 0, 0.08]} w={0.36} k={phys(tt, 5.3, 8, 0.45)} rev={cl((tt - 5.3) / 0.6)} />
  </>;
}}</Scene3D>;

// 2:30 · LA PALMA: la mano sobre la rejilla siente el aire: hilos tibios que la envuelven
export const HPalm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="oak" wall="plaster" wallZ={-0.7} bg="#18140f" key1={[0.8, 2, 1.2]} warm={0.7}
  cam={{ at: [0, 0.2, 0], az: [0.45, -0.25], el: [0.35, 0.22], r: [1.3, 1.0], fov: 32 }}>{(tt) => {
  const c = eio(tt, 0.4, 1.9), y = lerp(0.65, 0.34, c), hum = 0.008 * Math.sin(tt * 3.1) * c, b = eio(tt, 1.2, 2.3);
  return <>
    <Register p={[0, 0.002, 0]} />
    {[-0.14, -0.05, 0.05, 0.14].map((x, i) => <FlowPath key={i} tt={tt} pts={[[x, 0.03, 0], [x * 1.1, 0.14, 0], [x * 1.9, 0.3, 0.01], [x * 3.1, 0.46, 0.02]]} n={8} k={b} r={0.008} v={0.5} col="#ffb070" />)}
    <Hand p={[0.1, y + hum, 0.02]} rot={[-PI / 2, 0, PI / 2]} s={1.05} bend={0.08} />
    <Tape txt="AIR COMES OUT" p={[-0.44, 0.35, -0.68]} w={0.42} k={phys(tt, 2.5, 8, 0.45)} rev={cl((tt - 2.5) / 0.6)} />
  </>;
}}</Scene3D>;

// 3:02 · EL PAÑUELO: un pañuelo de papel se pega solo a la rejilla de retorno
export const HTissue: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="blinds" floor="oak" wall="paper" wallZ={0} bg="#1a1712" key1={[-0.5, 1.6, 1.5]}
  cam={{ at: [0, 0.5, 0.05], az: [-0.42, 0.2], el: [0.02, 0.1], r: [1.25, 0.95], fov: 32 }}>{(tt) => {
  const c = eio(tt, 1.0, 2.2), wob = (1 - c) * 0.06 * Math.sin(tt * 4), z = lerp(0.42, 0.033, c), x = lerp(0.5, 0.07, c), y = lerp(0.68, 0.53, c);
  return <>
    <ReturnGrille p={[0, 0.5, 0.008]} />
    {Array.from({ length: 16 }, (_, i) => <FlowPath key={i} tt={tt} pts={[[(rn(i) - 0.5) * 1.1, 0.25 + rn(i, 2) * 0.55, 0.5], [(rn(i) - 0.5) * 0.7, 0.3 + rn(i, 2) * 0.45, 0.2], [(rn(i) - 0.5) * 0.45, 0.33 + rn(i, 2) * 0.33, 0.02]]} n={3} k={0.6} r={0.005} v={0.6} col="#9fc4ee" />)}
    <mesh position={[x + wob, y, z]} rotation={[wob * 2, (1 - c) * 0.7, (1 - c) * 0.5]}><planeGeometry args={[0.22, 0.24, 8, 8]} /><meshStandardMaterial color="#fbfaf5" roughness={0.95} side={THREE.DoubleSide} /></mesh>
    <Tape txt="THAT'S YOUR RETURN" col="#1f5ea8" p={[0, 0.9, 0.03]} w={0.55} k={phys(tt, 2.8, 8, 0.45)} rev={cl((tt - 2.8) / 0.6)} />
  </>;
}}</Scene3D>;

// 3:30 · EL AIRE ES VAGO: en el empalme, casi todo el aire dobla por la primera salida y a la última le llega un hilo
export const HLazy: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="brick" wallZ={-0.75} bg="#121010" key1={[0, 2.3, 1.1]}
  cam={{ at: [0.1, 0.4, 0], at1: [0.5, 0.42, 0], az: [-0.5, 0.2], el: [0.3, 0.2], r: [2.6, 2.3], fov: 32 }}>{(tt) => {
  const f = eio(tt, 0.4, 1.6);
  const xs = [-0.8, -0.1, 0.6, 1.3], k = [1, 0.5, 0.2, 0.06], lbl = ["FIRST", "", "", "LAST"];
  return <>
    <group position={[0.2, 0.4, 0]} ><mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.17, 0.17, 3.0, 36, 1, true]} /><meshStandardMaterial color="#d6dde1" transparent opacity={0.24} roughness={0.75} side={THREE.DoubleSide} depthWrite={false} /></mesh></group>
    {xs.map((x, i) => <group key={i}><Round l={0.7} r={0.1} p={[x, 0.82, 0]} op={0.25} />
      <FlowPath tt={tt} pts={[[-1.3, 0.4, 0], [x - 0.15, 0.4, 0], [x, 0.56, 0], [x, 1.3, 0]]} n={Math.round(4 + 26 * k[i])} k={f * (0.2 + 0.8 * k[i])} r={0.024} v={0.5} col="#ffb070" />
      {lbl[i] && <Tape txt={lbl[i]} col={i ? "#1f5ea8" : "#b3261e"} p={[x, 1.32, 0.01]} w={0.2} k={phys(tt, 1.6 + i * 0.3, 8, 0.45)} rev={cl(tt - 1.6 - i * 0.3)} />}
    </group>)}
    <Tape txt="AIR IS LAZY" p={[0.3, 0.05, 0.02]} rot={[-0.4, 0, 0]} w={0.42} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.5)} />
  </>;
}}</Scene3D>;

// 3:55 · LA CHAPALETA DE ADENTRO: el caño se vuelve de vidrio y se ve qué mueve la manija
export const HFlapIn: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="oak" wall="plaster" wallZ={-0.75} bg="#12100d" key1={[0.4, 1.9, 1.5]}
  cam={{ at: [0, 0.5, 0], az: [0.6, 0.15], el: [0.1, 0.22], r: [1.5, 1.1], fov: 32 }}>{(tt) => {
  const op = lerp(1, 0.22, eio(tt, 0.7, 1.9)), a = eio(tt, 3.0, 4.2) * 1.15, fl = 1 - 0.75 * eio(tt, 3.2, 4.4);
  return <>
    <Round l={1.6} r={0.17} p={[0, 0.5, 0]} op={op} />
    <Flap r={0.164} ang={a} p={[0, 0.5, 0]} />
    <Lever p={[0, 0.5, 0.17]} ang={a} s={1.3} />
    <FlowPath tt={tt} pts={[[0, -0.3, 0], [0, 0.3, 0], [0, 0.7, 0], [0, 1.3, 0]]} n={Math.round(4 + 18 * fl)} k={eio(tt, 1.4, 2.2) * fl} r={0.03} v={0.5} col="#ffb070" />
    <Tape txt="A FLAP" p={[0.44, 0.74, 0.04]} w={0.2} k={phys(tt, 2.0, 8, 0.45)} rev={cl(tt - 2)} />
    <Tape txt="THE HANDLE TURNS IT" col="#b3261e" p={[-0.56, 0.32, 0.02]} w={0.55} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 0.6)} />
  </>;
}}</Scene3D>;

// 4:20 · EL DOBLE DE SU PARTE: cuatro vasos debajo de la misma jarra; bolitas de calor caen más en el primero
export const HShares: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="sage" wallZ={-0.6} bg="#171511" key1={[-0.7, 2.2, 1.3]}
  cam={{ at: [0, 0.32, 0], az: [-0.3, 0.3], el: [0.28, 0.14], r: [2.2, 1.85], fov: 32 }}>{(tt) => {
  const f = eio(tt, 0.5, 4.6), lv = [0.62, 0.48, 0.3, 0.13], xs = [-0.66, -0.22, 0.22, 0.66], nm = ["KITCHEN", "DINING", "FRONT BED", "BACK BED"];
  return <>{xs.map((x, i) => <group key={i} position={[x, 0, 0]}>
    <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.15, 0.13, 0.6, 32, 1, true]} />{M.glass({ op: 0.26 })}</mesh>
    <RBox s={[0.26, 0.012, 0.26]} p={[0, 0.006, 0]} r={0.05}>{M.glass({ op: 0.34 })}</RBox>
    <mesh position={[0, 0.012 + (lv[i] * f * 0.56) / 2, 0]} scale={[1, Math.max(0.02, f), 1]}><cylinderGeometry args={[0.135, 0.125, lv[i] * 0.56, 28]} /><meshStandardMaterial color="#e8843a" emissive="#c9551a" emissiveIntensity={0.3} roughness={0.5} /></mesh>
    <Tape txt={nm[i]} p={[0, 0.72, 0]} w={0.26} k={phys(tt, 0.6 + i * 0.2, 8, 0.45)} rev={cl(tt - 0.6 - i * 0.2)} />
  </group>)}
    <Tape txt="TWICE ITS SHARE" col="#b3261e" p={[-0.5, 0.92, -0.05]} rot={[0, 0, -0.04]} w={0.46} k={phys(tt, 4.4, 8, 0.45)} rev={cl((tt - 4.4) / 0.5)} /></>;
}}</Scene3D>;

// 5:05 · TODO LO QUE GASTÓ: cartones con lo que le arreglaron caen sobre la mesa y el termómetro no se entera
const CARD_T = ["NEW WINDOWS", "BLOWN INSULATION", "WEATHERSTRIP", "ANOTHER FURNACE TECH"];
export const HStuck61: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="peel" wallZ={-0.45} bg="#17130f" key1={[0.5, 2.1, 1.3]}
  cam={{ at: [-0.05, 0.36, 0], az: [0.34, -0.2], el: [0.38, 0.2], r: [1.9, 1.6], fov: 32 }}>{(tt) => <>
  {CARD_T.map((c, i) => { const k = phys(tt, 0.4 + i * 0.75, 7, 0.5); const m = tex.text("rc" + c, 480, 280, (g) => { g.fillStyle = "#efe7d0"; g.fillRect(0, 0, 480, 280); g.fillStyle = "#2a2118"; g.font = "bold 44px Georgia"; g.textAlign = "center"; g.fillText(c.split(" ").slice(0, 2).join(" "), 240, 120); g.font = "36px Georgia"; g.fillText(c.split(" ").slice(2).join(" ") || "PAID", 240, 190); g.strokeStyle = "#a33"; g.lineWidth = 5; g.strokeRect(20, 20, 440, 240); });
    return <group key={c} position={[-0.42 + i * 0.08, 0.008 + i * 0.005 + (1 - cl(k)) * 0.9, -0.08 + i * 0.05]} rotation={[-PI / 2 + (1 - cl(k)) * 0.5, 0, -0.14 + i * 0.13]}><mesh castShadow receiveShadow><planeGeometry args={[0.62, 0.36]} /><meshStandardMaterial map={m} roughness={0.85} side={THREE.DoubleSide} /></mesh></group>; })}
  <GlassT p={[0.56, 0, -0.1]} v={lerp(61, 61.4, Math.sin(tt) * 0.5 + 0.5)} col="#2f72c4" />
  <Tape txt="STILL 61°" col="#1f5ea8" p={[0.56, 1.06, -0.1]} w={0.32} k={phys(tt, 3.8, 8, 0.45)} rev={cl((tt - 3.8) / 0.5)} />
</>}</Scene3D>;

// 6:02 · VOLVIÓ A SU CUARTO: la almohada baja del sofá a la cama y el número de la pared sube
export const HBackBed: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="oak" wall="paper" wallZ={-0.55} bg="#16130f" key1={[-0.8, 2, 1.3]} warm={0.8}
  cam={{ at: [0.05, 0.45, 0], az: [-0.4, 0.05], el: [0.26, 0.18], r: [2.3, 1.95], fov: 32 }}>{(tt) => {
  const k = eio(tt, 0.7, 2.2), temp = lerp(61, 70, eio(tt, 1.5, 4.5));
  return <>
    <RBox s={[1.1, 0.1, 0.72]} p={[0, 0.2, 0]} r={0.02}>{M.wood({ base: [100, 64, 36] })}</RBox>
    <RBox s={[1.06, 0.14, 0.7]} p={[0, 0.32, 0]} r={0.05}><meshStandardMaterial color="#f0ebdf" roughness={0.9} /></RBox>
    <RBox s={[0.7, 0.05, 0.72]} p={[0.17, 0.41, 0]} r={0.022}><meshStandardMaterial color="#8c3e30" roughness={0.9} /></RBox>
    <RBox s={[0.34, 0.1, 0.5]} p={[lerp(-1.1, -0.34, k), lerp(0.28, 0.44, Math.sin(k * PI) * 0.6 + k), 0]} r={0.05}><meshStandardMaterial color="#f7f4ec" roughness={0.9} /></RBox>
    <Therm p={[0.62, 0.78, -0.53]} v={temp} s={1.6} />
    <Tape txt="HOME" col="#1c7a4a" p={[-0.3, 0.74, -0.53]} w={0.2} k={phys(tt, 3.2, 8, 0.45)} rev={cl(tt - 3.2)} />
  </>;
}}</Scene3D>;

// 6:32 · TRES CAUSAS: tres cajones que se abren: una alfombra, un caño suelto, una ventana floja
export const HThree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" wallZ={-0.5} bg="#15110d" key1={[0.2, 2.1, 1.4]} warm={0.85}
  cam={{ at: [0, 0.42, 0], az: [0.11, -0.11], el: [0.18, 0.28], r: [2.3, 2.19], fov: 32 }}>{(tt) => <>
  {[0, 1, 2].map((i) => { const o = phys(tt, 0.6 + i * 1.5, 7, 0.5), x = -0.68 + i * 0.68; const nm = ["NOT ENOUGH AIR", "AIR GETS LOST", "HEAT LEAKS OUT"][i];
    return <group key={i} position={[x, 0.3, cl(o) * 0.26]}>
      <RBox s={[0.6, 0.42, 0.5]} r={0.012}>{M.wood({ base: [116, 76, 42] })}</RBox>
      <mesh position={[0, 0.22, 0]}><boxGeometry args={[0.5, 0.012, 0.4]} /><meshStandardMaterial color="#14100c" /></mesh>
      <group position={[0, 0.25, 0]} scale={Math.max(0.05, cl(o))}>
        {i === 0 && <><RBox s={[0.4, 0.02, 0.3]} r={0.008}><meshStandardMaterial color="#8e2f2a" roughness={0.95} /></RBox><Register p={[0, 0.012, 0]} w={0.22} d={0.09} /></>}
        {i === 1 && <><Round l={0.2} r={0.06} p={[-0.1, 0.07, 0]} rot={[0, 0, PI / 2]} /><Round l={0.2} r={0.06} p={[0.15, 0.1, 0]} rot={[0, 0, 1.3]} /></>}
        {i === 2 && <group position={[0, 0.14, 0]}><RBox s={[0.3, 0.3, 0.02]} r={0.006}><meshStandardMaterial color="#e9e3d6" /></RBox><mesh position={[0, 0, 0.012]}><planeGeometry args={[0.24, 0.24]} /><meshBasicMaterial color="#b8d2ea" toneMapped={false} /></mesh></group>}
      </group>
      <Tape txt={nm} p={[0, -0.02, 0.26]} w={0.44} k={phys(tt, 1.0 + i * 1.5, 8, 0.45)} rev={cl(tt - 1 - i * 1.5)} />
    </group>; })}
</>}</Scene3D>;

// 7:05 · CUÁNTO MIENTE: un termómetro lee 2 de más; se le pega la cinta con la corrección
export const HCalibTape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="sage" wallZ={-0.75} bg="#15120e" key1={[-0.7, 2.3, 1]}
  cam={{ at: [0, 0.03, 0], az: [0.45, -0.05], el: [0.8, 1.02], r: [0.95, 0.72], fov: 30 }}>{(tt) => <>
  {[-0.24, 0, 0.24].map((x, i) => <Therm key={i} p={[x, 0.016, 0]} rot={[-PI / 2, 0, (i - 1) * 0.04]} v={[70, 72, 69][i]} s={1.35} />)}
  <Tape txt="-2" col="#b3261e" p={[0, 0.034, 0.12]} rot={[-PI / 2, 0, -0.03]} w={0.16} k={phys(tt, 1.6, 8, 0.45)} rev={cl((tt - 1.6) / 0.5)} />
  <Tape txt="+1" col="#1f5ea8" p={[0.24, 0.034, 0.12]} rot={[-PI / 2, 0, 0.05]} w={0.16} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.5)} />
  <Tape txt="OK" col="#1c7a4a" p={[-0.24, 0.034, 0.12]} rot={[-PI / 2, 0, 0.03]} w={0.14} k={phys(tt, 3.1, 8, 0.45)} rev={cl((tt - 3.1) / 0.5)} />
</>}</Scene3D>;

// 7:40 · A LA ALTURA DEL PECHO: la vara de medir contra la pared y el termómetro que sube hasta su marca
export const HChest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="blinds" floor="oak" wall="sage" wallZ={0} bg="#17140f" key1={[0.7, 2.1, 1.5]}
  cam={{ at: [0, 0.75, 0.04], az: [0.3, -0.2], el: [0.1, 0.02], r: [2.5, 2.05], fov: 32 }}>{(tt) => {
  const k = phys(tt, 0.7, 6, 0.55), y = lerp(0.1, 1.3, cl(k));
  return <>
    <RBox s={[0.1, 2.2, 0.012]} p={[-0.3, 1.1, 0.008]} r={0.003}><meshStandardMaterial color="#e6c04e" roughness={0.5} /></RBox>
    {Array.from({ length: 12 }, (_, i) => <RBox key={i} s={[0.05, 0.005, 0.002]} p={[-0.33, 0.1 + i * 0.18, 0.016]} r={0.001} shadow={false}><meshBasicMaterial color="#222" /></RBox>)}
    <Therm p={[0.05, y, 0.02]} s={1.5} v={70} />
    <RBox s={[0.34, 0.006, 0.004]} p={[-0.08, 1.3, 0.016]} r={0.001} shadow={false}><meshBasicMaterial color="#b3261e" /></RBox>
    <Tape txt="CHEST HIGH" col="#b3261e" p={[0.42, 1.3, 0.02]} w={0.36} k={phys(tt, 1.9, 8, 0.45)} rev={cl((tt - 1.9) / 0.5)} />
    <RBox s={[0.56, 0.03, 0.2]} p={[0.46, 0.34, 0.1]} r={0.006}>{M.wood({ base: [146, 104, 62] })}</RBox>
    <Therm p={[0.46, 0.46, 0.12]} s={1.0} v={78} />
    <group position={[0.46, 0.47, 0.2]} scale={Math.max(0.03, cl(phys(tt, 3.0, 7, 0.5)))}><RBox s={[0.42, 0.03, 0.01]} rot={[0, 0, 0.78]} r={0.004}><meshStandardMaterial color="#c8281e" roughness={0.5} /></RBox><RBox s={[0.42, 0.03, 0.01]} rot={[0, 0, -0.78]} r={0.004}><meshStandardMaterial color="#c8281e" roughness={0.5} /></RBox></group>
    <Tape txt="NOT ON A SHELF" p={[0.46, 0.2, 0.2]} rot={[0, 0, -0.04]} w={0.44} k={phys(tt, 3.1, 8, 0.45)} rev={cl((tt - 3.1) / 0.5)} />
  </>;
}}</Scene3D>;
