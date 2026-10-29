// rk29b · componentes 3D 1-15 (29-oct). Cada uno UNA vez en toda la tanda (registro D:/rtmp/rk29_COMPONENTES.md).
// La cerradura que escucha toda la noche, cree que el teléfono está cerca, abre sola para el que alguna vez tuvo código…
import React from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { Studio, Wall3, Rings3, Car3, RB, Mat, sm, spr, c01, rnd, type V3 } from "./studio3d";
import { AMB, RED, ICE, GRN, useTxt, Lock3, Door3, Phone3, Person3, Hand3, Thread, useSwitchTex, Hourglass3, Sofa3 } from "./lock3d";

type P = { t: number; h: H };

// mesa de luz de madera
const Night3: React.FC<{ p: V3 }> = ({ p }) => <group position={p}>
  <RB p={[0, 0.3, 0]} s={[0.6, 0.6, 0.45]} rad={0.02} c="#6b4a32" r={0.6} />
  <RB p={[0, 0.62, 0]} s={[0.66, 0.04, 0.5]} rad={0.01} c="#5a3c28" r={0.5} />
  <RB p={[0, 0.38, 0.23]} s={[0.5, 0.18, 0.01]} rad={0.005} c="#5a3c28" r={0.5} />
</group>;

// 1 · toda la noche: la cerradura late en la puerta y escucha; el reloj de la mesa de luz corre de 11 pm a 5 am; el teléfono duerme
export const H3Nightwatch: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const hr = 23 + 6 * sm(tt, 0.6, 7.0), step = Math.floor(hr * 4) / 4, hh = Math.floor(step) % 12 || 12, mm = Math.round((step % 1) * 60);
  const tex = useTxt([`${hh}:${String(mm).padStart(2, "0")} ${hr >= 24 ? "AM" : "PM"}`], 512, 200, "#120a0a", RED, 120, "Courier New");
  return <Studio tt={tt} night={1} photo={0.15} keys={[{ t: 0, p: [0.6, 1.05, 2.0], l: [0.3, 0.85, 0], fov: 40 }, { t: 10, p: [0.85, 0.95, 1.7], l: [0.5, 0.8, 0], arc: 0.04 }]}>
    <Wall3 p={[0, 1.6, -0.2]} s={[8, 3.4, 0.1]} kind="drywall" />
    <Door3 p={[-0.8, 0, -0.12]} s={0.95} lock={false} col="#4a2e26" />
    <Lock3 p={[-0.42, 1.18, -0.02]} s={0.42} led={0.5 + 0.5 * Math.sin(tt * 2.2)} ledCol={ICE} />
    <Rings3 p={[-0.42, 1.08, 0]} k={tt * 0.45} n={3} r={1.1} col={ICE} rot={[0, 0, 0]} op={0.3} />
    <Night3 p={[1.0, 0, 0.1]} />
    <Phone3 p={[0.72, 0.655, 0.18]} rot={[0, 0.4, 0]} s={0.95} on={0.1} />
    <group position={[1.12, 0.8, 0.12]} rotation={[-0.1, -0.35, 0]}>
      <RB p={[0, 0, 0]} s={[0.52, 0.24, 0.14]} rad={0.03} c="#1b1b1e" r={0.5} />
      <mesh position={[0, 0, 0.071]}><planeGeometry args={[0.46, 0.18]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
      <pointLight position={[0, 0, 0.2]} intensity={0.4} distance={0.8} color={RED} />
    </group>
  </Studio>;
}}</Stage>;

// 2 · radar: el círculo del piso es lo único que la cerradura sabe; el hombre entra con el teléfono, el círculo se pone verde y la puerta se abre
export const H3Radar: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const x = 2.6 - 2.2 * sm(tt, 0.6, 3.6), inside = x < 1.25, open = sm(tt, 3.7, 4.6), sweep = tt * 2.2;
  return <Studio tt={tt} floor="concrete" photo={0.3} keys={[{ t: 0, p: [1.2, 2.6, 3.6], l: [0.3, 0.3, 0], fov: 40 }, { t: 10, p: [0.4, 2.2, 3.5], l: [0.2, 0.4, 0], arc: 0.04 }]}>
    <Wall3 p={[-1.6, 1.3, -0.15]} s={[2.2, 2.8, 0.18]} kind="brick" />
    <Wall3 p={[1.6, 1.3, -0.15]} s={[2.2, 2.8, 0.18]} kind="brick" />
    <Door3 p={[0, 0, -0.1]} open={open} col="#2f4a5e" led={inside ? 1 : 0.4} ledCol={inside ? GRN : ICE} bolt={1 - open} />
    <group position={[0, 0.012, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh><ringGeometry args={[1.22, 1.27, 96]} /><meshBasicMaterial color={inside ? GRN : ICE} toneMapped={false} /></mesh>
      <mesh><circleGeometry args={[1.22, 96]} /><meshBasicMaterial color={inside ? GRN : ICE} transparent opacity={inside ? 0.16 : 0.07} depthWrite={false} /></mesh>
      <mesh rotation={[0, 0, -sweep]}><circleGeometry args={[1.22, 48, 0, 0.6]} /><meshBasicMaterial color={inside ? GRN : ICE} transparent opacity={0.28} depthWrite={false} /></mesh>
      {[0.42, 0.82].map((r, i) => <mesh key={i}><ringGeometry args={[r, r + 0.012, 80]} /><meshBasicMaterial color={ICE} transparent opacity={0.35} /></mesh>)}
    </group>
    <Person3 p={[x, 0, 0.6]} yaw={-Math.PI / 2} step={tt < 3.6 ? Math.sin(tt * 7) : 0} arm={0.55} col="#3e4f63" s={0.9} />
    <Phone3 p={[x - 0.42, 1.06, 0.6]} rot={[0.6, 0, 0.2]} s={0.45} on={0.9} />
  </Studio>;
}}</Stage>;

// 3 · fantasmas: la puerta abre sola y pasan, uno detrás del otro, los que alguna vez tuvieron código
export const H3Ghosts: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const open = sm(tt, 0.3, 1.1);
  return <Studio tt={tt} night={0.6} photo={0.2} keys={[{ t: 0, p: [1.3, 1.3, 3.3], l: [0, 1.0, 0], fov: 38 }, { t: 10, p: [-0.8, 1.2, 3.1], l: [0, 1.0, 0], arc: 0.05 }]}>
    <Wall3 p={[-1.65, 1.3, -0.15]} s={[2.3, 2.8, 0.18]} kind="drywall" />
    <Wall3 p={[1.65, 1.3, -0.15]} s={[2.3, 2.8, 0.18]} kind="drywall" />
    <Door3 p={[0, 0, -0.1]} open={0.75 * open} col="#5a2a24" led={1} ledCol={GRN} />
    <pointLight position={[0, 1.2, -1.2]} intensity={2.2} distance={3} color="#b8c6ff" />
    {[0, 1, 2, 3].map((i) => { const k = c01((tt - 0.8 - i * 1.5) / 2.6); const z = -1.6 + 3.6 * k, op = Math.min(0.8, Math.sin(Math.PI * k) * 1.2);
      return k > 0 && k < 1 ? <Person3 key={i} p={[0.05 + (i % 2 ? 0.12 : -0.12), 0, z]} yaw={0} step={Math.sin(tt * 6 + i)} col={["#9fd3ff", "#c9b8ff", "#ffd29f", "#a8f0c8"][i]} op={op} s={0.92 + 0.06 * rnd(i)} /> : null; })}
  </Studio>;
}}</Stage>;

// 4 · el anuncio: la cerradura repite «acá estoy» en pulsos; cada pulso que llega prende el teléfono, los auriculares y el auto
export const H3Beacon: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const ph = (tt % 1.2) / 1.2, hit = (d: number) => { const f = ((tt - d * 0.9) % 1.2) / 1.2; return tt > 0.8 + d ? Math.exp(-Math.pow((f - 0.1) * 9, 2)) : 0; };
  return <Studio tt={tt} photo={0.25} keys={[{ t: 0, p: [0, 1.25, 3.8], l: [0, 0.75, 0], fov: 40 }, { t: 10, p: [0.5, 1.4, 3.4], l: [0.1, 0.75, 0], arc: 0.04 }]}>
    <Wall3 p={[0, 1.6, -1.1]} s={[8, 3.4, 0.1]} kind="drywall" />
    <RB p={[0, 0.9, -0.95]} s={[0.7, 1.8, 0.1]} rad={0.02} c="#5a2a24" r={0.55} />
    <Lock3 p={[0, 1.05, -0.86]} s={0.75} led={0.4 + 0.6 * (1 - ph)} ledCol={AMB} />
    <Rings3 p={[0, 0.9, -0.8]} k={ph} n={3} r={2.6} col={AMB} rot={[0, 0, 0]} op={0.7} />
    <RB p={[0, 0.25, 0.5]} s={[3.2, 0.5, 0.8]} rad={0.03} c="#8a7a64" r={0.7} />
    <Phone3 p={[-1.05, 0.52, 0.5]} rot={[0, 0.3, 0]} s={0.75} on={0.15 + 0.85 * hit(0.2)} />
    <group position={[0, 0.56, 0.55]}>
      <RB p={[0, 0, 0]} s={[0.3, 0.12, 0.22]} rad={0.05} c="#f2f2f2" r={0.3} e={ICE} ei={0.6 * hit(0.4)} />
      {[-0.06, 0.06].map((x, i) => <mesh key={i} position={[x, 0.08, 0]} rotation={[0, 0, i ? -0.3 : 0.3]}><capsuleGeometry args={[0.025, 0.06, 4, 10]} /><Mat c="#fafafa" r={0.3} e={ICE} ei={0.8 * hit(0.4)} /></mesh>)}
    </group>
    <Car3 p={[1.15, 0.5, 0.45]} rot={[0, -0.5, 0]} s={0.32} head={hit(0.6)} col="#7c8590" />
  </Studio>;
}}</Stage>;

// 5 · creer: el teléfono sigue lejos en la mesa de luz; aparece la cajita del ladrón junto a la puerta y la aguja «¿cerca?» se va a SÍ: abre
export const H3Believe: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const box = sm(tt, 0.8, 1.6), fool = sm(tt, 2.0, 3.4), open = sm(tt, 3.8, 4.8);
  const no = useTxt(["NO"], 128, 64, "#2a2c31", "#f6f3ec", 40), yes = useTxt(["YES"], 128, 64, "#2a2c31", GRN, 40);
  return <Studio tt={tt} night={0.7} photo={0.15} keys={[{ t: 0, p: [0.2, 1.3, 3.6], l: [0, 0.9, 0], fov: 40 }, { t: 10, p: [-0.3, 1.25, 3.2], l: [-0.2, 0.9, 0], arc: 0.04 }]}>
    <Wall3 p={[0.6, 1.6, -0.5]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Door3 p={[-0.9, 0, -0.35]} open={open * 0.6} col="#4a2e26" led={0.3 + 0.7 * fool} ledCol={fool > 0.5 ? GRN : ICE} bolt={1 - open} />
    {/* la cajita con antena, pegada a la puerta por afuera */}
    <group position={[-1.55, 0.95 - 0.5 * (1 - box), 0.15]} scale={box}>
      <RB p={[0, 0, 0]} s={[0.22, 0.14, 0.08]} rad={0.02} c="#15161a" r={0.4} />
      <mesh position={[0.07, 0.17, 0]}><cylinderGeometry args={[0.006, 0.006, 0.22, 8]} /><Mat c="#222" /></mesh>
      <mesh position={[-0.06, 0.02, 0.045]}><sphereGeometry args={[0.012, 10, 10]} /><meshBasicMaterial color={RED} toneMapped={false} /></mesh>
      <Rings3 p={[0, 0.1, 0]} k={(tt * 0.8) % 1} n={2} r={0.7} col={RED} rot={[0, 0, 0]} op={box} />
    </group>
    {/* el medidor «¿teléfono cerca?» */}
    <group position={[0.15, 1.35, -0.4]}>
      <mesh><circleGeometry args={[0.42, 48, 0, Math.PI]} /><Mat c="#f6f3ec" r={0.8} /></mesh>
      <mesh position={[0, 0, -0.01]}><circleGeometry args={[0.47, 48, 0, Math.PI]} /><Mat c="#2a2c31" m={0.5} r={0.4} /></mesh>
      <mesh position={[0, 0, 0.004]} rotation={[0, 0, 0]}><circleGeometry args={[0.4, 32, 0, 0.9]} /><meshBasicMaterial color={GRN} transparent opacity={0.5} /></mesh>
      <mesh position={[-0.3, -0.1, 0.01]}><planeGeometry args={[0.24, 0.12]} /><meshBasicMaterial map={no} /></mesh>
      <mesh position={[0.3, -0.1, 0.01]}><planeGeometry args={[0.24, 0.12]} /><meshBasicMaterial map={yes} /></mesh>
      <group rotation={[0, 0, Math.PI / 2 - 0.15 - (Math.PI - 0.6) * fool + 0.03 * Math.sin(tt * 9) * fool * (1 - fool) * 4]} position={[0, 0, 0.02]}><mesh position={[0, 0.17, 0]}><boxGeometry args={[0.025, 0.34, 0.01]} /><meshBasicMaterial color="#1a1a1a" /></mesh></group>
    </group>
    <Night3 p={[1.6, 0, -0.1]} />
    <Phone3 p={[1.55, 0.655, -0.05]} rot={[0, 0.3, 0]} s={0.55} on={0.1} />
  </Studio>;
}}</Stage>;

// 6 · mayo de 2022: las hojas del almanaque caen hasta MAY 2022, el informe se abre y baja el sello
export const H3Paper2022: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const months = ["JAN 2022", "FEB 2022", "MAR 2022", "APR 2022"];
  const pages = months.map((m) => useTxt([m.split(" ")[0], m.split(" ")[1]], 256, 256, "#f6f3ec", "#2a2c31", 64));
  const may = useTxt(["MAY", "2022"], 256, 256, "#f6f3ec", RED, 70), rep = useTxt(["RELAY ATTACK", "ON BLE", "SMART LOCKS", "", "NCC GROUP"], 512, 640, "#fbfaf6", "#2a2c31", 46);
  const stamp = useTxt(["HANDS-FREE", "CAN BE FOOLED"], 512, 220, "rgba(0,0,0,0)", RED, 62);
  const fold = sm(tt, 2.6, 3.6), down = sm(tt, 4.0, 4.5), lift = sm(tt, 4.7, 5.2);
  return <Studio tt={tt} floor="wood" photo={0.25} keys={[{ t: 0, p: [-0.5, 1.6, 2.2], l: [-0.45, 0.6, 0], fov: 38 }, { t: 3.2, p: [0.1, 1.9, 1.9], l: [0.3, 0.2, 0.1] }, { t: 10, p: [0.4, 1.7, 1.6], l: [0.35, 0.2, 0.15], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    <group position={[-0.45, 0, -0.2]}>
      <RB p={[0, 0.36, -0.02]} s={[0.62, 0.72, 0.04]} rad={0.01} c="#2a2c31" r={0.5} />
      <mesh position={[0, 0.36, 0.005]}><planeGeometry args={[0.56, 0.56]} /><meshStandardMaterial map={may} roughness={0.9} /></mesh>
      {pages.map((tx, i) => { const f = sm(tt, 0.3 + i * 0.5, 0.75 + i * 0.5); return f < 1 ? <group key={i} position={[0, 0.64, 0.01 + (4 - i) * 0.003]} rotation={[f * 2.6, 0, f * 0.4 * (i % 2 ? 1 : -1)]}><mesh position={[0, -0.28, 0]}><planeGeometry args={[0.56, 0.56]} /><meshStandardMaterial map={tx} roughness={0.9} side={THREE.DoubleSide} /></mesh></group> : null; })}
    </group>
    <group position={[0.35, 0.01, 0.15]}>
      <RB p={[0, 0.01, 0]} s={[0.5, 0.02, 0.64]} rad={0.004} c="#c9b48a" r={0.8} />
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.46, 0.6]} /><meshStandardMaterial map={rep} roughness={0.95} /></mesh>
      <group position={[-0.25, 0.024, 0]} rotation={[0, 0, Math.PI * fold]}><mesh position={[0.25, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.5, 0.64]} /><meshStandardMaterial color="#c9b48a" roughness={0.8} side={THREE.DoubleSide} /></mesh></group>
      {down > 0.95 && <mesh position={[0, 0.026, 0.05]} rotation={[-Math.PI / 2, 0, -0.12]}><planeGeometry args={[0.44, 0.19]} /><meshBasicMaterial map={stamp} transparent /></mesh>}
      <group position={[0.02, 0.05 + 0.6 * (1 - down) + 0.4 * lift, 0.05]}>
        <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.09, 0.09, 0.04, 32]} /><Mat c="#7a1d18" r={0.5} /></mesh>
        <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.03, 0.04, 0.2, 20]} /><Mat c="#3a2a20" r={0.6} /></mesh>
        <mesh position={[0, 0.27, 0]}><sphereGeometry args={[0.06, 20, 20]} /><Mat c="#3a2a20" r={0.6} /></mesh>
      </group>
    </group>
  </Studio>;
}}</Stage>;

// 7 · reloj de arena de 30 s: la arena cae y, cuando termina, la palanca baja sola y el pestillo sale
export const H3Sandglass: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const k = sm(tt, 0.4, 4.6), lever = sm(tt, 4.6, 5.0), bolt = spr(tt, 4.9, 9, 0.5);
  return <Studio tt={tt} photo={0.25} keys={[{ t: 0, p: [0.0, 1.0, 2.6], l: [0, 0.65, 0], fov: 38 }, { t: 7, p: [0.35, 1.05, 2.4], l: [0.15, 0.65, 0], arc: 0.04 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    <RB p={[0, 0.2, 0]} s={[2.0, 0.4, 0.8]} rad={0.03} c="#8a7a64" r={0.7} />
    <Hourglass3 p={[-0.45, 0.4, 0.05]} s={0.9} k={k} />
    <group position={[0.45, 0.4, 0]}>
      <RB p={[0, 0.35, -0.2]} s={[0.36, 0.7, 0.1]} rad={0.03} c="#22252b" r={0.4} m={0.4} />
      <mesh position={[0, 0.25, -0.14]}><ringGeometry args={[0.04, 0.055, 32]} /><meshBasicMaterial color={lever > 0.5 ? GRN : AMB} toneMapped={false} /></mesh>
      <group position={[0, 0.5, -0.13]} rotation={[0, 0, 0.9 - 1.8 * lever]}><RB p={[0, 0.09, 0]} s={[0.05, 0.18, 0.05]} rad={0.02} c="#c9ced4" m={1} r={0.25} /></group>
      <RB p={[0.18 + 0.2 * bolt, 0.4, -0.2]} s={[0.26, 0.08, 0.08]} rad={0.015} c="#c9ced4" m={1} r={0.25} />
      <RB p={[0.55, 0.4, -0.2]} s={[0.1, 0.2, 0.16]} rad={0.01} c="#d6cbb4" r={0.6} />
    </group>
  </Studio>;
}}</Stage>;

// 8 · la planta del living vista desde arriba: el sillón a 8 pies; el hijo se da vuelta con el teléfono, el círculo de la cerradura lo alcanza y la puerta se abre
export const H3Couchplan: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const grow = sm(tt, 0.5, 2.4), turn = sm(tt, 2.6, 3.4), open = sm(tt, 3.6, 4.4), r = 0.5 + 1.75 * grow, reach = r > 1.95;
  return <Studio tt={tt} floor="wood" photo={0} keys={[{ t: 0, p: [0.2, 4.6, 2.6], l: [0.2, 0, 0], fov: 40 }, { t: 11, p: [0.7, 4.2, 2.0], l: [0.3, 0, -0.1], arc: 0.03 }]}>
    {[[-1.9, 0.5, 0.06, 3.0], [2.3, 0.5, 0.06, 3.0]].map(([x, y, w, d], i) => <RB key={i} p={[x, y, -0.2]} s={[w, 1.0, d]} rad={0.01} c="#ece7dc" r={0.9} />)}
    <RB p={[-1.0, 0.5, -1.7]} s={[1.8, 1.0, 0.06]} rad={0.01} c="#ece7dc" r={0.9} />
    <RB p={[1.6, 0.5, -1.7]} s={[1.4, 1.0, 0.06]} rad={0.01} c="#ece7dc" r={0.9} />
    <group position={[0.45, 0, -1.7]} rotation={[0, 0, 0]}>
      <group position={[-0.45, 0, 0]} rotation={[0, -open * 1.3, 0]}><RB p={[0.45, 0.5, 0]} s={[0.88, 1.0, 0.05]} rad={0.01} c="#7a2a24" r={0.55} /><mesh position={[0.8, 1.02, 0]}><sphereGeometry args={[0.05, 12, 12]} /><meshBasicMaterial color={reach ? GRN : ICE} toneMapped={false} /></mesh></group>
    </group>
    <group position={[0.45, 0.012, -1.6]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh><circleGeometry args={[r, 80, Math.PI, Math.PI]} /><meshBasicMaterial color={reach ? GRN : ICE} transparent opacity={0.14} depthWrite={false} /></mesh>
      <mesh><ringGeometry args={[r - 0.025, r, 80, 1, Math.PI, Math.PI]} /><meshBasicMaterial color={reach ? GRN : ICE} toneMapped={false} /></mesh>
    </group>
    <Sofa3 p={[0.45, 0, 0.75]} rot={[0, Math.PI, 0]} s={0.85} col="#5b6b7a" />
    <Person3 p={[0.45, 0.05, 0.62]} yaw={Math.PI + turn * 0.9} sit={1} s={0.8} col="#a04a3a" arm={0.6} />
    <Phone3 p={[0.45 - 0.25 * turn, 0.95, 0.35 - 0.1 * turn]} rot={[0, turn, 0]} s={0.4} on={0.95} />
    {/* la cinta de 8 pies sobre el piso */}
    <group position={[-0.25, 0.015, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh position={[0, 0, 0]} scale={[1, grow, 1]}><planeGeometry args={[0.08, 2.0]} /><meshStandardMaterial color="#f2c230" roughness={0.6} /></mesh>
    </group>
  </Studio>;
}}</Stage>;

// 9 · las 11 aperturas: el reloj de pared marca de 12 a 5 de la mañana y caen 11 fichas rojas con peso en la bandeja
export const H3Clock11: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const wedge = sm(tt, 0.3, 1.3);
  return <Studio tt={tt} photo={0.2} keys={[{ t: 0, p: [0, 1.4, 3.0], l: [0, 1.15, 0], fov: 38 }, { t: 11, p: [0.4, 1.2, 2.8], l: [0.1, 1.0, 0], arc: 0.04 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    <group position={[0, 1.55, -0.5]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.62, 0.62, 0.08, 64]} /><Mat c="#2a2c31" m={0.6} r={0.35} /></mesh>
      <mesh position={[0, 0, 0.042]}><circleGeometry args={[0.57, 64]} /><Mat c="#f6f3ec" r={0.8} /></mesh>
      <mesh position={[0, 0, 0.044]} rotation={[0, 0, Math.PI / 2 - (5 / 12) * Math.PI * 2 * wedge]}><circleGeometry args={[0.55, 48, 0, (5 / 12) * Math.PI * 2 * wedge]} /><meshBasicMaterial color={RED} transparent opacity={0.28} /></mesh>
      {[...Array(12)].map((_, i) => { const a = Math.PI / 2 - (i / 12) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0.046]} rotation={[0, 0, a]}><planeGeometry args={[0.07, 0.018]} /><meshBasicMaterial color="#2a2c31" /></mesh>; })}
      <group position={[0, 0, 0.05]} rotation={[0, 0, -tt * 0.6]}><mesh position={[0, 0.2, 0]}><boxGeometry args={[0.025, 0.4, 0.01]} /><meshBasicMaterial color="#1a1a1a" /></mesh></group>
      <group position={[0, 0, 0.055]} rotation={[0, 0, -(5 / 12) * Math.PI * 2 * wedge]}><mesh position={[0, 0.14, 0]}><boxGeometry args={[0.04, 0.28, 0.01]} /><meshBasicMaterial color="#1a1a1a" /></mesh></group>
    </group>
    {/* bandeja de madera con las 11 fichas */}
    <RB p={[0, 0.5, -0.2]} s={[1.6, 0.06, 0.4]} rad={0.01} c="#7a4a2a" r={0.6} />
    <RB p={[0, 0.25, -0.2]} s={[1.7, 0.5, 0.45]} rad={0.02} c="#5a3c28" r={0.6} />
    {[...Array(11)].map((_, i) => { const at = 1.2 + i * 0.36, f = c01((tt - at) / 0.45), y0 = 0.56; const yy = f < 1 ? y0 + 1.6 * (1 - f * f) : y0 + 0.04 * Math.abs(Math.sin((tt - at - 0.45) * 14)) * Math.exp(-(tt - at - 0.45) * 6);
      return tt > at ? <group key={i} position={[-0.68 + i * 0.136, yy, -0.2]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.055, 0.055, 0.03, 28]} /><Mat c={RED} r={0.35} m={0.2} e={RED} ei={0.15} /></mesh></group> : null; })}
  </Studio>;
}}</Stage>;

// 10 · tres teléfonos sobre la mesa: el dedo apaga uno, otro y otro
const Toggle3: React.FC<{ p: V3; off: boolean; label: string }> = ({ p, off, label }) => {
  const on = useSwitchTex(label, true), of = useSwitchTex(label, false);
  return <Phone3 p={p} s={1} on={1} map={off ? of : on} col={off ? "#888" : "#9fe8b5"} />;
};
export const H3Threephones: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const ts = [1.0, 2.5, 4.0], idx = ts.filter((x) => tt > x - 0.6).length - 1, cur = Math.max(0, idx), seg = ts[cur], press = c01(1 - Math.abs(tt - seg) / 0.35);
  const hx = -0.55 + 0.55 * cur, hand = sm(tt, 0.2, 0.8);
  return <Studio tt={tt} floor="wood" photo={0.2} keys={[{ t: 0, p: [0, 1.7, 1.5], l: [0, 0.05, 0], fov: 40 }, { t: 10, p: [0.35, 1.6, 1.4], l: [0.1, 0.05, 0], arc: 0.03 }]}>
    {["AUTO-UNLOCK", "AUTO-UNLOCK", "AUTO-UNLOCK"].map((l, i) => <Toggle3 key={i} p={[-0.55 + 0.55 * i, 0.015, 0]} off={tt > ts[i]} label={l} />)}
    <Hand3 p={[hx + 0.08, 0.05 + 0.08 * (1 - press) + 0.4 * (1 - hand), 0.12]} rot={[-0.15, 0.2, 0]} s={1.1} />
  </Studio>;
}}</Stage>;

// 11 · la lupa recorre el menú de ajustes y prende en rojo cada palabra peligrosa
export const H3Scanner: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const rows = ["Notifications", "Auto-Unlock", "Language", "Proximity", "Touch to Open", "Battery", "Hands-Free", "Geofence"], bad = [1, 3, 4, 6, 7];
  const tex = rows.map((r, i) => useTxt([r], 512, 96, "#1c1f25", "#e9ecf1", 52)), texR = rows.map((r) => useTxt([r], 512, 96, "#3a0d0a", RED, 56));
  const y = 0.5 - 1.0 * sm(tt, 0.6, 5.6);
  return <Studio tt={tt} floor="none" photo={0.3} keys={[{ t: 0, p: [0, 0.3, 1.75], l: [0, 0.15, 0], fov: 40 }, { t: 11, p: [0.15, -0.15, 1.6], l: [0, -0.2, 0], arc: 0.03 }]}>
    <group rotation={[0, -0.12, 0]}>
      <RB p={[0, 0, -0.03]} s={[0.78, 1.5, 0.05]} rad={0.06} c="#15161a" r={0.25} m={0.3} />
      {rows.map((r, i) => { const ry = 0.56 - i * 0.16, lit = bad.includes(i) && y < ry + 0.05;
        return <group key={i} position={[0, ry, 0]}>
          <mesh position={[0, 0, lit ? 0.02 : 0]} scale={lit ? 1.06 : 1}><planeGeometry args={[0.7, 0.13]} /><meshBasicMaterial map={lit ? texR[i] : tex[i]} /></mesh>
        </group>; })}
      <group position={[0.52, y + 0.06, 0.2]}>
        <mesh><torusGeometry args={[0.17, 0.022, 16, 64]} /><Mat c="#2a2c31" m={0.6} r={0.3} /></mesh>
        <mesh><circleGeometry args={[0.165, 48]} /><meshPhysicalMaterial color="#eaf4ff" transmission={0.95} roughness={0.02} thickness={0.05} transparent opacity={0.25} /></mesh>
        <mesh position={[0.17, -0.17, 0]} rotation={[0, 0, Math.PI / 4]}><cylinderGeometry args={[0.025, 0.03, 0.26, 16]} /><Mat c="#3a2a20" r={0.5} /></mesh>
      </group>
    </group>
  </Studio>;
}}</Stage>;

// 12 · el raro: cuatro teléfonos, tres ya apagados; el del hijo sigue prendido y un hilo rojo lo une a la puerta que se abre
export const H3Oddone: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const k = sm(tt, 1.6, 3.0), open = sm(tt, 3.1, 4.0);
  const offT = useSwitchTex("AUTO-UNLOCK", false), onT = useSwitchTex("AUTO-UNLOCK", true);
  return <Studio tt={tt} floor="wood" photo={0.2} keys={[{ t: 0, p: [0, 1.4, 2.4], l: [0, 0.3, -0.4], fov: 40 }, { t: 10, p: [0.4, 1.3, 2.2], l: [0.1, 0.4, -0.6], arc: 0.04 }]}>
    <Wall3 p={[0, 1.6, -1.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Door3 p={[0.9, 0, -1.5]} s={0.9} open={open * 0.6} col="#5a2a24" led={open} ledCol={RED} bolt={1 - open} />
    {[0, 1, 2, 3].map((i) => { const odd = i === 2; return <group key={i} position={[-0.75 + i * 0.5, 0.015 + (odd ? 0.04 * sm(tt, 0.6, 1.2) : 0), 0.2]} rotation={[0, 0, 0]}>
      <Phone3 s={0.75} on={1} map={odd ? onT : offT} col={odd ? RED : "#888"} />
      {odd && <pointLight position={[0, 0.2, 0]} intensity={1.2 * (0.6 + 0.4 * Math.sin(tt * 6))} distance={0.8} color={RED} />}
    </group>; })}
    <Thread a={[0.25, 0.06, 0.2]} b={[1.2, 1.15, -1.42]} lift={0.6} k={k} col={RED} r={0.014} />
  </Studio>;
}}</Stage>;

// 13 · el dial del auto-lock: la perilla gira hasta la zona verde (30 s a 3 min); al rato la puerta se cierra y el pestillo sale solo
export const H3Autolockdial: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const turn = spr(tt, 0.6, 5, 0.5), close = sm(tt, 3.4, 4.4), bolt = spr(tt, 4.6, 9, 0.5);
  const lb = [useTxt(["OFF"], 128, 64, "rgba(0,0,0,0)", "#f6f3ec", 44), useTxt(["30s"], 128, 64, "rgba(0,0,0,0)", GRN, 44), useTxt(["3m"], 128, 64, "rgba(0,0,0,0)", GRN, 44), useTxt(["1h"], 128, 64, "rgba(0,0,0,0)", "#f6f3ec", 44)];
  const ang = [2.4, 0.9, -0.2, -2.0];
  return <Studio tt={tt} photo={0.25} keys={[{ t: 0, p: [-0.4, 1.2, 2.6], l: [-0.4, 1.0, 0], fov: 36 }, { t: 3.2, p: [0.1, 1.2, 3.2], l: [0.2, 0.95, 0] }, { t: 10, p: [0.5, 1.15, 3.0], l: [0.4, 0.95, 0], arc: 0.04 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    <group position={[-0.45, 1.0, -0.45]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.5, 0.52, 0.08, 64]} /><Mat c="#22252b" m={0.5} r={0.35} /></mesh>
      <mesh position={[0, 0, 0.045]} rotation={[0, 0, -0.2]}><ringGeometry args={[0.33, 0.45, 48, 1, -0.2 + 0.2, 1.1]} /><meshBasicMaterial color={GRN} transparent opacity={0.6} toneMapped={false} /></mesh>
      {lb.map((m, i) => <mesh key={i} position={[Math.cos(ang[i]) * 0.62, Math.sin(ang[i]) * 0.62, 0.05]}><planeGeometry args={[0.22, 0.11]} /><meshBasicMaterial map={m} transparent toneMapped={false} /></mesh>)}
      <group position={[0, 0, 0.09]} rotation={[0, 0, 2.4 - 2.75 * turn]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.28, 0.3, 0.1, 48]} /><Mat c="#c9ced4" m={1} r={0.22} /></mesh>
        <RB p={[0.18, 0, 0.06]} s={[0.16, 0.035, 0.02]} rad={0.008} c={AMB} e={AMB} ei={0.6} />
      </group>
    </group>
    <group position={[0.7, 0, -0.45]}>
      <RB p={[-0.5, 1.05, 0]} s={[0.08, 2.1, 0.14]} rad={0.01} c="#efe9dd" r={0.6} />
      <group position={[0.45, 0, 0]} rotation={[0, (1 - close) * 1.1, 0]}><RB p={[-0.45, 1.0, 0]} s={[0.88, 2.0, 0.06]} rad={0.015} c="#5a2a24" r={0.55} />
        <Lock3 p={[-0.8, 1.1, 0.06]} s={0.32} led={bolt} ledCol={GRN} bolt={0} />
        <RB p={[-0.92 - 0.1 * bolt, 1.1, 0]} s={[0.12, 0.05, 0.04]} rad={0.01} c="#c9ced4" m={1} r={0.25} />
      </group>
    </group>
  </Studio>;
}}</Stage>;

// 14 · el cartel verde de la ruta: LEE'S SUMMIT · 2019 viene hacia nosotros como desde el auto y pasa por arriba
export const H3Citysign: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const tex = useTxt(["LEE'S SUMMIT", "MISSOURI · 2019"], 1024, 420, "#0f6b3a", "#ffffff", 104), z = -9 + 7.2 * sm(tt, 0.0, 6.5);
  return <Studio tt={tt} floor="concrete" night={0.35} photo={0} bg="#2a3346" keys={[{ t: 0, p: [0, 1.4, 3.5], l: [0, 2.2, -4], fov: 46 }, { t: 9, p: [0.1, 1.45, 3.3], l: [0, 2.6, -2], arc: 0.02 }]}>
    {[...Array(14)].map((_, i) => { const zz = ((i * 1.4 + tt * 6) % 19.6) - 16; return <mesh key={i} position={[0, 0.006, zz]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.12, 0.7]} /><meshBasicMaterial color="#f2e7b8" /></mesh>; })}
    {[-2.4, 2.4].map((x, i) => <mesh key={i} position={[x, 0.007, -4]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.1, 30]} /><meshBasicMaterial color="#e8e8e8" /></mesh>)}
    <group position={[0, 0, z]}>
      {[-1.6, 1.6].map((x, i) => <mesh key={i} position={[x, 1.6, 0]}><cylinderGeometry args={[0.06, 0.06, 3.2, 16]} /><Mat c="#9aa0a8" m={0.9} r={0.35} /></mesh>)}
      <RB p={[0, 3.0, 0]} s={[3.4, 1.4, 0.08]} rad={0.04} c="#0f6b3a" r={0.4} />
      <mesh position={[0, 3.0, 0.045]}><planeGeometry args={[3.2, 1.3]} /><meshStandardMaterial map={tex} roughness={0.35} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.25} /></mesh>
    </group>
    {[...Array(8)].map((_, i) => { const zz = ((i * 2.5 + tt * 6) % 20) - 17; return <mesh key={i} position={[(i % 2 ? 1 : -1) * (3.2 + rnd(i) * 0.8), 0.8, zz]}><coneGeometry args={[0.45, 1.6, 10]} /><Mat c="#24402c" r={0.9} /></mesh>; })}
  </Studio>;
}}</Stage>;

// 15 · el pestillo pega en el marco: el burlete grueso no deja cerrar, el pestillo sale y choca contra la madera
export const H3Bolthit: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const swing = 0.32 * (1 - sm(tt, 0.3, 1.6)) + 0.09, bounce = tt > 1.6 ? 0.03 * Math.sin((tt - 1.6) * 16) * Math.exp(-(tt - 1.6) * 5) : 0;
  const b1 = sm(tt, 2.2, 2.5), hitT = 2.5, back = sm(tt, 3.3, 3.8), bolt = Math.min(b1, 0.42) * (1 - back * 0.6), flash = tt > hitT ? Math.exp(-(tt - hitT) * 5) : 0;
  return <Studio tt={tt} photo={0.2} keys={[{ t: 0, p: [0.75, 1.75, 0.75], l: [0.47, 1.1, 0], fov: 34 }, { t: 10, p: [0.85, 1.6, 0.6], l: [0.5, 1.1, 0], arc: 0.02 }]}>
    <Wall3 p={[1.4, 1.3, -0.08]} s={[1.6, 2.8, 0.16]} kind="drywall" />
    <RB p={[0.55, 1.05, 0]} s={[0.12, 2.2, 0.2]} rad={0.01} c="#d8c39a" r={0.55} />
    <RB p={[0.49, 1.05, 0.06]} s={[0.025, 2.0, 0.05]} rad={0.008} c="#141414" r={0.9} />
    <RB p={[0.493, 1.1, 0.0]} s={[0.012, 0.08, 0.06]} rad={0.004} c="#c9ced4" m={1} r={0.25} />
    <group position={[-0.45, 0, 0]} rotation={[0, -(swing + bounce), 0]}>
      <RB p={[0.45, 1.02, 0]} s={[0.9, 2.02, 0.07]} rad={0.015} c="#7a2a24" r={0.55} />
      <Lock3 p={[0.78, 1.1, 0.06]} s={0.32} led={1} ledCol={AMB} />
      <RB p={[0.88 + 0.1 * bolt, 1.1, 0]} s={[0.16, 0.07, 0.05]} rad={0.01} c="#d4a84a" m={1} r={0.25} />
    </group>
    {flash > 0.02 && <pointLight position={[0.5, 1.15, 0.2]} intensity={0.8 * flash} distance={0.6} color="#ffd29f" />}
    {flash > 0.02 && [...Array(8)].map((_, i) => { const a = rnd(i) * Math.PI * 2, d = (tt - hitT) * 0.6; return <mesh key={i} position={[0.48 + Math.cos(a) * d * 0.4, 1.1 + Math.sin(a) * d * 0.5, 0.1 + d * 0.3]}><boxGeometry args={[0.02, 0.02, 0.05]} /><meshBasicMaterial color="#d8c39a" /></mesh>; })}
  </Studio>;
}}</Stage>;

export const HEROES_3 = { nightwatch: H3Nightwatch, radar: H3Radar, ghosts: H3Ghosts, beacon: H3Beacon, believe: H3Believe, paper2022: H3Paper2022, sandglass: H3Sandglass, couchplan: H3Couchplan, clock11: H3Clock11, threephones: H3Threephones, scanner: H3Scanner, oddone: H3Oddone, autolockdial: H3Autolockdial, citysign: H3Citysign, bolthit: H3Bolthit };
