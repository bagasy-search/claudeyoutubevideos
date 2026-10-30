// len29e · componentes únicos en 3D real — 22-31 (13 m → 21 m): agua, papas, lavavajillas, séptico, motor, botón rojo, cierre.
import React from "react";
import * as THREE from "three";
import { H, ICE, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tubeG } from "./h3d";
import { Allen, Disposal, Hand, PI, Switch } from "./heroes3d_e1";

// ---- 13 m · QUINCE SEGUNDOS: el chorro frío cae en el desagüe mientras un reloj de bronce gira su tambor hasta 15 y recién ahí la llave se apaga ----
export const HFifteenRule: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile"
  cam={{ at: [0.05, 0.32, 0], az: [-0.3, 0.1], el: [0.18, 0.12], r: [0.95, 0.85], fov: 30 }}>{(tt) => {
  const n = Math.min(15, Math.floor(cl((tt - 0.6) / 5.0) * 15.99)), done = cl((tt - 5.8) / 0.3), run = eio(tt, 0.2, 0.5) * (1 - done);
  return <>
    <mesh geometry={tubeG("e_fau15", [[-0.1, 0.6, -0.08], [-0.1, 0.66, -0.02], [-0.1, 0.64, 0.03], [-0.1, 0.58, 0.04]], 0.012, 30, 14)}>{M.chrome()}</mesh>
    <mesh position={[-0.1, 0.43, 0.04]} scale={[1, run + 0.001, 1]}><cylinderGeometry args={[0.007, 0.009, 0.3, 12]} />{M.water({ col: "#cfe9ff" })}</mesh>
    <Disposal p={[-0.1, 0.16, 0.04]} s={0.95} spin={tt * 10 * run} />
    <group position={[0.24, 0.36, 0.05]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.04, 48]} />{M.brass()}</mesh>
      <mesh position={[0, 0, 0.021]}><circleGeometry args={[0.088, 48]} /><meshStandardMaterial color="#f4ecd8" roughness={0.6} /></mesh>
      <mesh position={[0, 0, 0.022]}><ringGeometry args={[0.07, 0.085, 48, 1, PI / 2, -(n / 15) * PI * 2]} /><meshBasicMaterial color={done > 0 ? "#6fe39a" : "#3a8ad6"} toneMapped={false} /></mesh>
      <group position={[0, 0, 0.03]}><DigitDrum v={Math.floor(n / 10)} p={[-0.02, 0, 0]} /><DigitDrum v={n % 10} p={[0.02, 0, 0]} /></group>
    </group>
    <Switch p={[0.24, 0.6, -0.1]} up={1 - done} s={1.2} />
  </>;
}}</Scene3D>;

// ---- 14:34 · LA PAPA HECHA LADRILLO: cáscaras de papa caen al triturador y salen por el caño como una pasta que se compacta en un bloque gris que tapa todo ----
export const HPotatoBrick: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="tile"
  cam={{ at: [0.16, 0.26, 0], az: [-0.25, 0.15], el: [0.12, 0.08], r: [0.62, 0.55], fov: 30 }}>{(tt) => {
  const pack = eio(tt, 2.2, 5.0);
  return <>
    <Disposal p={[0, 0.25, 0]} cut spin={tt * 10} sink={false} outlet={false} />
    {Array.from({ length: 12 }, (_, i) => { const t0 = 0.2 + i * 0.15, f = cl((tt - t0) / 0.6);
      return <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.06, lerp(0.55, 0.27, f * f), (rn(i, 2) - 0.5) * 0.04]} rotation={[rn(i, 3) * 6, rn(i, 4) * 6, tt * 2]} scale={tt > t0 && f < 1 ? 1.8 : 0.001}><torusGeometry args={[0.014, 0.004, 6, 16, PI * 1.2]} />{M.matte({ col: "#b88a4a" })}</mesh>; })}
    <mesh geometry={tubeG("e_pbrick", [[0.08, 0.245, 0], [0.15, 0.245, 0], [0.19, 0.215, 0], [0.45, 0.2, 0]], 0.024, 40, 20)}><meshStandardMaterial color="#f2efe6" roughness={0.3} transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[0.21 + 0.1 * pack, 0.205, 0]} rotation={[0, 0, PI / 2]} scale={[1, 0.001 + pack, 1]}><cylinderGeometry args={[0.021, 0.021, 0.2, 20]} /><meshStandardMaterial color={new THREE.Color("#d9c9a0").lerp(new THREE.Color("#8a8778"), pack).getStyle()} roughness={0.95} /></mesh>
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0.2 + i * 0.02, 0.205 + (rn(i, 7) - 0.5) * 0.02, (rn(i, 8) - 0.5) * 0.02]} scale={pack * (rn(i, 9) * 0.5 + 0.5)}><sphereGeometry args={[0.006, 6, 5]} /><meshStandardMaterial color="#6f6b5e" roughness={1} /></mesh>)}
    <mesh position={[0.46, 0.2, 0]} rotation={[0, PI / 2, 0]}><ringGeometry args={[0.026, 0.04, 32]} /><meshBasicMaterial color={RED} transparent opacity={cl((tt - 4.4) / 0.4)} toneMapped={false} /></mesh>
  </>;
}}</Scene3D>;

// ---- 15:13 · LA MANGUERA DEL LAVAVAJILLAS: en la entrada del costado hay un tapón de fábrica; si el triturador es nuevo, se lo saca de un golpe con un destornillador y el agua del lavavajillas pasa ----
export const HDwHose: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="wood" bg="#121010"
  cam={{ at: [-0.09, 0.32, 0], az: [-0.9, -0.6], el: [0.15, 0.08], r: [0.5, 0.42], fov: 32 }}>{(tt) => {
  const hit = eio(tt, 1.2, 1.5), plugGone = cl((tt - 1.5) / 0.6), flow = eio(tt, 3.2, 3.8);
  return <>
    <Disposal p={[0, 0.3, 0]} cut sink={false} plug={1 - plugGone} />
    <mesh position={[-0.05 + 0.04 * plugGone, 0.375 - 0.15 * plugGone * plugGone, 0]} rotation={[0, 0, PI / 2 + plugGone * 3]} scale={plugGone > 0 && plugGone < 1 ? 1 : 0.001}><cylinderGeometry args={[0.0105, 0.0105, 0.003, 24]} />{M.plastic({ col: "#3a3c3f" })}</mesh>
    <group position={[-0.2 + 0.07 * hit - 0.08 * eio(tt, 1.8, 2.4), 0.375, 0]} rotation={[0, 0, PI / 2]} scale={1 - eio(tt, 2.4, 2.8) + 0.001}>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.0035, 0.0035, 0.1, 10]} />{M.steel()}</mesh>
      <RBox s={[0.022, 0.07, 0.022]} r={0.008} p={[0, -0.03, 0]}>{M.plastic({ col: "#e0b020" })}</RBox>
    </group>
    <mesh geometry={tubeG("e_dwh", [[-0.42, 0.42, -0.05], [-0.3, 0.42, 0], [-0.18, 0.38, 0], [-0.105, 0.375, 0]], 0.012, 40, 14)} scale={0.001 + eio(tt, 2.6, 3.2)}>{M.rubber({ col: "#1f2124" })}</mesh>
    {Array.from({ length: 8 }, (_, i) => { const k = ((tt * 1.2 + i / 8) % 1); return <mesh key={i} position={[lerp(-0.3, -0.07, k), 0.375 + 0.005 * Math.sin(i), 0]} scale={flow}><sphereGeometry args={[0.006, 8, 6]} />{M.water()}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 16:34 · LA TAPA QUE FALTA: lo mismo visto por fuera; un disco de metal se desprende del costado y abre camino, el chorro del lavavajillas entra y el desagüe vuelve a correr ----
export const HKnockout: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.9}
  cam={{ at: [0, 0.3, 0], az: [0.6, 0.3], el: [0.1, 0.18], r: [0.95, 0.8], fov: 30 }}>{(tt) => {
  const pop = phys(tt, 1.0, 6, 0.4), fl = eio(tt, 2.0, 2.8);
  return <>
    <Disposal p={[0, 0.3, 0]} plug={1 - cl(pop)} />
    <RBox s={[0.38, 0.32, 0.36]} r={0.015} p={[-0.5, 0.16, 0]}>{M.steel({ col: "#d4d8dc" })}</RBox>
    <RBox s={[0.34, 0.03, 0.01]} r={0.004} p={[-0.5, 0.28, 0.182]}>{M.matte({ col: "#222" })}</RBox>
    <mesh position={[-0.5, 0.2, 0.183]}><circleGeometry args={[0.012, 24]} /><meshBasicMaterial color="#6fe39a" toneMapped={false} transparent opacity={fl} /></mesh>
    <mesh geometry={tubeG("e_kno", [[-0.31, 0.12, 0], [-0.22, 0.1, 0.03], [-0.15, 0.3, 0.03], [-0.105, 0.375, 0]], 0.012, 40, 14)}>{M.rubber({ col: "#1f2124" })}</mesh>
    {Array.from({ length: 10 }, (_, i) => { const k = ((tt * 0.9 + i / 10) % 1); return <mesh key={i} position={[0.165, lerp(0.29, 0.18, k), 0]} scale={fl}><sphereGeometry args={[0.006, 8, 6]} />{M.water()}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 17:10 · EL POZO SÉPTICO: corte de la tierra; del triturador baja un caño largo al tanque; la capa de lodo del fondo crece y llega a la marca roja ----
export const HSeptic: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0f0d0b"
  cam={{ at: [0.05, 0.1, 0], az: [-0.12, 0.05], el: [0.08, 0.04], r: [1.75, 1.6], fov: 30 }}>{(tt) => {
  const sl = eio(tt, 1.2, 5.2);
  return <>
    <mesh position={[0.2, -0.12, -0.2]}><boxGeometry args={[1.6, 0.6, 0.05]} /><meshStandardMaterial color="#5a4330" roughness={1} /></mesh>
    <mesh position={[0.2, 0.18, 0]}><boxGeometry args={[1.6, 0.006, 0.4]} /><meshStandardMaterial color="#5f7a3a" roughness={1} /></mesh>
    <Disposal p={[-0.45, 0.35, 0]} s={0.7} sink={false} outlet={false} spin={tt * 4} />
    <mesh geometry={tubeG("e_sep", [[-0.39, 0.35, 0], [-0.3, 0.3, 0], [0.1, 0.0, 0], [0.32, -0.04, 0]], 0.018, 50, 16)}>{M.pvc()}</mesh>
    <mesh position={[0.5, -0.15, 0]}><boxGeometry args={[0.4, 0.3, 0.25]} /><meshStandardMaterial color="#9aa0a6" roughness={0.7} transparent opacity={0.35} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.5, -0.24 + 0.06 * sl, 0]} scale={[1, 0.15 + 0.85 * sl, 1]}><boxGeometry args={[0.38, 0.12, 0.23]} /><meshStandardMaterial color="#4a3a22" roughness={1} /></mesh>
    <mesh position={[0.5, -0.06, -0.02]}><boxGeometry args={[0.38, 0.12, 0.2]} />{M.water({ col: "#6a6a40", op: 0.4 })}</mesh>
    <mesh position={[0.5, -0.12, 0.127]}><planeGeometry args={[0.4, 0.004]} /><meshBasicMaterial color={RED} toneMapped={false} /></mesh>
    {Array.from({ length: 8 }, (_, i) => { const k = ((tt * 0.6 + i / 8) % 1); return <mesh key={i} position={[lerp(-0.3, 0.3, k), lerp(0.3, -0.03, Math.pow(k, 0.8)), 0]}><sphereGeometry args={[0.007, 6, 5]} /><meshStandardMaterial color="#8a6a3a" roughness={1} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 19 m · EL MOTOR CALIENTE: rayos X del motor; el bobinado pasa de cobre a rojo encendido y un termostato en el costado salta y lo corta ----
export const HOverheat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark"
  cam={{ at: [0, 0.24, 0], az: [0.4, -0.3], el: [0.0, 0.1], r: [0.48, 0.4], fov: 32 }}>{(tt) => {
  const heat = eio(tt, 0.5, 3.5), trip = cl((tt - 3.6) / 0.15), cool = eio(tt, 4.0, 6.5);
  return <>
    <Disposal p={[0, 0.3, 0]} glass={0.9} coil={heat * (1 - cool)} spin={tt * 14 * (1 - trip)} shake={0.002 * heat * (1 - trip)} btn={trip} btnOut={trip} />
    {Array.from({ length: 6 }, (_, i) => { const k = ((tt * 0.5 + i / 6) % 1); return <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.12, 0.22 + 0.25 * k, (rn(i, 2) - 0.5) * 0.08]} scale={heat * (1 - cool) * (1 - k)}><sphereGeometry args={[0.012, 8, 6]} /><meshBasicMaterial color="#ff7a3a" transparent opacity={0.25} depthWrite={false} toneMapped={false} /></mesh>; })}
    <pointLight position={[0, 0.23, 0.12]} intensity={1.2 * heat * (1 - cool)} distance={0.4} color="#ff4a1a" />
  </>;
}}</Scene3D>;

// ---- 18:51 · EL BOTÓN ROJO: desde abajo, el botón rojo asomado; un dedo lo aprieta, hace clic, el brillo se apaga y la llave de la pared vuelve a dar vida ----
export const HResetBtn: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="wood" bg="#121010"
  cam={{ at: [0.04, 0.18, 0.02], az: [-0.3, 0.1], el: [-0.55, -0.4], r: [0.34, 0.28], fov: 32 }}>{(tt) => {
  const press = eio(tt, 1.0, 1.4) * (1 - eio(tt, 1.8, 2.2)), click = cl((tt - 1.4) / 0.1), on = cl((tt - 3.2) / 0.3);
  return <>
    <Disposal p={[0, 0.3, 0]} sink={false} btn={(1 - click) * (0.6 + 0.4 * Math.sin(tt * 6))} btnOut={1 - click} spin={tt * 10 * on} shake={0.0015 * on} />
    <Hand p={[0.042, lerp(0.05, 0.11, press), 0.018]} rot={[0, 0, 0]} curl={0.5} s={0.6} />
    <mesh position={[0.042, 0.172, 0.018]} rotation={[PI / 2, 0, 0]} scale={0.6 + 2 * click * (1 - cl((tt - 1.5) / 0.6))}><torusGeometry args={[0.01, 0.001, 6, 32]} /><meshBasicMaterial color="#ffffff" transparent opacity={(1 - cl((tt - 1.5) / 0.6)) * click} toneMapped={false} /></mesh>
    <Switch p={[-0.16, 0.36, -0.08]} up={on} glow={on * 0.6} s={1.0} />
  </>;
}}</Scene3D>;

// ---- 20:13 · LA LLAVE PEGADA: la llave Allen con cinta pegada al costado del triturador, siempre a mano; la cinta se enrolla y la llave queda brillando ----
export const HTapedWrench: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="wood" bg="#121010" warm={0.9}
  cam={{ at: [0, 0.3, 0.02], az: [-0.25, 0.3], el: [0.1, 0.05], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={1300} y={260} txt="ALWAYS WITHIN REACH" col={ICE} size={32} />}>{(tt) => {
  const in1 = phys(tt, 0.4, 6, 0.45), tape = eio(tt, 1.6, 2.8);
  return <>
    <Disposal p={[0, 0.3, 0]} sink={false} />
    <Allen p={[0.03, 0.29 + 0.2 * (1 - cl(in1)), 0.088]} rot={[PI / 2, 0, -0.4]} s={1.3} glow={0.4 * tape * (0.6 + 0.4 * Math.sin(tt * 3))} />
    <mesh position={[0.06, 0.3, 0.09]} rotation={[0, 0, 0.3]} scale={[0.001 + tape, 1, 1]}><boxGeometry args={[0.07, 0.02, 0.002]} /><meshStandardMaterial color="#c7c0a8" roughness={0.6} transparent opacity={0.9} /></mesh>
    <mesh position={[0.06 + 0.07 * (1 - tape), 0.3, 0.1]} rotation={[0, 0, PI / 2]} scale={0.001 + (1 - tape) * cl(in1)}><torusGeometry args={[0.02, 0.008, 8, 24]} /><meshStandardMaterial color="#c7c0a8" roughness={0.6} /></mesh>
  </>;
}}</Scene3D>;

// ---- 21 m · EL ÚLTIMO CASO: una gota aparece abajo de la carcasa, la fisura se enciende y el triturador se aparta: este ya no se arregla, se cambia ----
export const HLeakEnd: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.85}
  cam={{ at: [0, 0.26, 0], az: [0.3, -0.25], el: [0.08, 0.15], r: [0.65, 0.55], fov: 30 }}>{(tt) => {
  const cr = eio(tt, 1.6, 2.8), drops = cl((tt - 0.3) / 0.5);
  return <>
    <Disposal p={[0, 0.3, 0]} crack={cr} sink={false} />
    {Array.from({ length: 4 }, (_, i) => { const k = ((tt * 0.55 + i / 4) % 1); return <mesh key={i} position={[-0.06, lerp(0.24, 0.0, k * k), 0.059]} scale={[1, 1.4, 1].map((v) => v * drops) as [number, number, number]}><sphereGeometry args={[0.006, 10, 8]} />{M.water()}</mesh>; })}
    <mesh position={[-0.06, 0.002, 0.06]} rotation={[-PI / 2, 0, 0]} scale={0.3 + 1.2 * cl((tt - 0.6) / 4)}><circleGeometry args={[0.05, 40]} />{M.water({ op: 0.5 })}</mesh>
    <pointLight position={[-0.06, 0.24, 0.15]} intensity={0.6 * cr} distance={0.3} color="#ff6a3a" />
  </>;
}}</Scene3D>;

// ---- 21 m · LA VERSIÓN CORTA: el triturador entero gira 360° en el aire, en corte, y cada pieza que se repasa se enciende en su orden: aletas, plato, anillo, hexágono, botón ----
export const HNoBlades2: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark" warm={0.85}
  cam={{ at: [0, 0.3, 0], az: [-0.4, 0.2], el: [0.18, 0.05], r: [0.62, 0.55], fov: 30 }}>{(tt) => {
  const st = (i: number) => cl((tt - 0.8 - i * 1.1) / 0.3) * (1 - cl((tt - 1.8 - i * 1.1) / 0.3));
  return <group position={[0, 0.3, 0]} rotation={[0, tt * 0.9, 0]}>
    <Disposal cut sink={false} open={0.4 * st(0)} spin={tt * 2 + st(1) * 3} ringShine={st(2) * 1.6} hex={st(3)} btn={st(4)} />
    <mesh position={[0, 0.142, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.045, 0.06, 48]} />{M.glow({ col: "#ffb64a", op: st(0) })}</mesh>
    <mesh position={[0, -0.006, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.06, 0.068, 48]} />{M.glow({ col: "#7dd6ff", op: st(1) })}</mesh>
  </group>;
}}</Scene3D>;
void Hand;
