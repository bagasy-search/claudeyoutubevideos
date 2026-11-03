// gary06 · componentes únicos 3/4 (min 11-16).
import React from "react";
import { H, cl, eio, phys } from "./hkit";
import { M, RBox, Scene3D, lerp, tubeG } from "./h3d";
import { PI, Txt3, Mark, Fridge, Bulb, PBox } from "./gk";
import { Drop } from "./h3d";

type V = [number, number, number];
const z1 = (k: number) => Math.max(0.001, k);
const q = (x: number, s = 0.02) => Math.round(x / s) * s;
// fuego lento (≤2 Hz): conos naranjas que respiran
const Fire: React.FC<{ tt: number; k: number; p: V; s?: number }> = ({ tt, k, p, s = 1 }) => <group position={p} scale={[s, s * z1(k) * (1 + 0.08 * Math.sin(tt * 2 * PI * 1.6)), s]}>
  <mesh position={[0, 0.05, 0]}><coneGeometry args={[0.04, 0.12, 14, 1, true]} /><meshBasicMaterial color="#ff7a2a" transparent opacity={0.85} depthWrite={false} toneMapped={false} side={2} /></mesh>
  <mesh position={[0, 0.035, 0]}><coneGeometry args={[0.022, 0.07, 12, 1, true]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.9} depthWrite={false} toneMapped={false} /></mesh>
</group>;
// farol LED de camping
export const Lantern: React.FC<{ on: number; p?: V; s?: number; bars?: number }> = ({ on, p = [0, 0, 0], s = 1, bars = -1 }) => <group position={p} scale={z1(s)}>
  <RBox s={[0.1, 0.03, 0.1]} p={[0, 0.015, 0]} r={0.01}>{M.plastic({ col: "#2a6a3a" })}</RBox>
  <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.042, 0.042, 0.13, 24]} /><meshPhysicalMaterial color="#fff8e8" transparent opacity={0.75} roughness={0.2} emissive="#fff0c8" emissiveIntensity={1.8 * on} /></mesh>
  <RBox s={[0.1, 0.025, 0.1]} p={[0, 0.18, 0]} r={0.01}>{M.plastic({ col: "#2a6a3a" })}</RBox>
  <mesh position={[0, 0.215, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.03, 0.005, 8, 20, PI]} />{M.matte({ col: "#1c1d20" })}</mesh>
  <pointLight position={[0, 0.1, 0.06]} intensity={0.9 * on} distance={0.8} color="#fff0c8" />
  {bars >= 0 && Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[-0.024 + i * 0.016, 0.015, 0.051]}><planeGeometry args={[0.012, 0.012]} /><meshStandardMaterial color={i < bars ? "#4fbf6a" : "#2a2c30"} emissive={i < bars ? "#4fbf6a" : "#000"} emissiveIntensity={0.8} /></mesh>)}
</group>;

// 11:21 · LO QUE MERECE LA BATERÍA: la caja en el centro; heladera, lámpara, teléfono y CPAP enchufados alrededor y encendidos; la estufa
// entra deslizándose a enchufarse y rebota contra un vidrio rojo con su X. «HEATER: NOT ON THE BATTERY».
export const HPriority: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" bg="#0e0d0c"
  cam={{ at: [0.05, 0.18, 0.05], az: [-0.2, 0.12], el: [0.45, 0.38], r: [1.8, 1.65], fov: 34 }}>{(tt) => {
  const it = [{ x: -0.55, z: -0.25, l: "FRIDGE" }, { x: -0.5, z: 0.3, l: "LIGHTS" }, { x: 0.5, z: -0.25, l: "PHONES" }, { x: 0.05, z: -0.45, l: "CPAP" }];
  const on = (i: number) => cl((tt - 0.5 - i * 0.4) / 0.3), slide = tt < 2.6 ? lerp(1.2, 0.62, eio(tt, 2.0, 2.6)) : 0.62 + 0.2 * (1 - Math.exp(-(tt - 2.6) * 3)) * Math.abs(Math.cos((tt - 2.6) * 6));
  return <>
    <PBox p={[0, 0, 0]} s={1.0} scr="85%" />
    {it.map((o, i) => <group key={i}>
      <mesh geometry={tubeG("pr" + i, [[0, 0.02, 0], [o.x * 0.5, 0.012, o.z * 0.5 + 0.05], [o.x, 0.02, o.z]], 0.008, 30, 8)}><meshStandardMaterial color="#1c1d20" emissive="#ffd25a" emissiveIntensity={0.8 * on(i)} /></mesh>
      <group position={[o.x, 0, o.z]}>
        {i === 0 ? <Fridge s={0.6} lit={on(i)} /> : i === 1 ? <Bulb on={on(i)} s={2} p={[0, 0.0, 0]} /> : i === 2 ? <RBox s={[0.07, 0.13, 0.01]} p={[0, 0.07, 0]} r={0.008}><meshStandardMaterial color="#111" emissive="#3a8adf" emissiveIntensity={0.8 * on(i)} /></RBox>
          : <RBox s={[0.16, 0.08, 0.12]} p={[0, 0.04, 0]} r={0.02}>{M.plastic({ col: "#d9dcdf", em: "#6fe39a", emI: 0.3 * on(i) })}</RBox>}
        <Txt3 txt={o.l} w={0.24} h={0.055} col="#0e1013" bg="#6fe39a" p={[0, 0.48 * (i === 0 ? 1 : 0.5), 0.05]} op={on(i)} />
      </group>
    </group>)}
    <group position={[slide, 0, 0.3]}>
      <RBox s={[0.2, 0.18, 0.1]} p={[0, 0.09, 0]} r={0.02}>{M.plastic({ col: "#c62a22" })}</RBox>
      <mesh position={[0, 0.1, 0.051]}><planeGeometry args={[0.15, 0.1]} /><meshStandardMaterial color="#3a2a22" emissive="#ff6a20" emissiveIntensity={0.3} /></mesh>
    </group>
    <Mark k={cl((tt - 2.8) / 0.4)} p={[0.62, 0.2, 0.38]} s={0.7} />
    <Txt3 txt="NO HEAT OFF THE BATTERY" w={0.84} h={0.085} col="#f7f4ee" bg="#b3221b" p={[0.05, 0.03, 0.62]} r={[-PI / 2 + 0.5, 0, 0]} op={cl((tt - 3.3) / 0.3)} />
  </>;
}}</Scene3D>;

// 11:40 · LA CADENA DE LA VELA: en la cómoda del cuarto la vela se consume; la cola del gato barre y la voltea; la brasa corre por la
// manta y sube por la cortina. Cada eslabón se nombra al pasar.
export const HTipOver: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" bg="#0d0b0a"
  cam={{ at: [0.1, 0.46, 0], az: [-0.22, 0.06], el: [0.16, 0.12], r: [1.7, 1.5], fov: 34 }}>{(tt) => {
  // r1 (5/10, «no se entiende»): cómoda + vela que se vuelca sobre la CAMA (colcha) + cortina de pliegues en la ventana
  const burn = eio(tt, 0.4, 1.6), shake = tt > 1.9 && tt < 2.4 ? 0.01 * Math.sin((tt - 1.9) * 50) : 0, tip = eio(tt, 2.2, 2.65), bl = eio(tt, 2.8, 4.0), cu = eio(tt, 3.9, 5.3);
  const W = [["BURNS DOWN", 0.6], ["KNOCKED OVER", 2.3], ["BLANKET", 3.0], ["CURTAIN", 4.2]] as [string, number][];
  return <>
    <group position={[shake, 0, 0]}>
      <RBox s={[0.5, 0.42, 0.32]} p={[-0.3, 0.21, -0.1]} r={0.02}>{M.wood({ base: [110, 72, 44] })}</RBox>
      {[0.11, 0.29].map((y) => <mesh key={y} position={[-0.3, y, 0.065]}><boxGeometry args={[0.42, 0.006, 0.006]} />{M.matte({ col: "#4a2e1a" })}</mesh>)}
      {[0.2, 0.36].map((y) => <mesh key={"k" + y} position={[-0.3, y - 0.04, 0.07]}><sphereGeometry args={[0.012, 12, 10]} />{M.brass()}</mesh>)}
      <group position={[-0.08, 0.42, -0.02]} rotation={[0, 0, -tip * 1.5]}>
        <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.04, 0.045, 0.01, 20]} />{M.brass()}</mesh>
        <mesh position={[0, 0.01 + 0.07 * (1 - 0.5 * burn), 0]} scale={[1, z1(1 - 0.5 * burn), 1]}><cylinderGeometry args={[0.028, 0.028, 0.14, 18]} />{M.porcelain({ col: "#f3ead6" })}</mesh>
        <Fire tt={tt} k={1} p={[0, 0.15 * (1 - 0.5 * burn) + 0.015, 0]} s={0.7} />
      </group>
    </group>
    <RBox s={[0.75, 0.26, 0.7]} p={[0.42, 0.13, 0.05]} r={0.02}>{M.wood({ base: [96, 62, 36] })}</RBox>
    <RBox s={[0.78, 0.06, 0.72]} p={[0.42, 0.29, 0.05]} r={0.025}><meshStandardMaterial color="#5a6aa8" roughness={0.95} /></RBox>
    {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.12 + i * 0.2, 0.322, 0.05]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.012, 0.7]} /><meshStandardMaterial color="#e8dcc0" /></mesh>)}
    <RBox s={[0.3, 0.07, 0.18]} p={[0.62, 0.35, -0.2]} r={0.03}>{M.porcelain({ col: "#f1ead9" })}</RBox>
    <mesh position={[0.05 + 0.2 * bl, 0.324, 0.0]} rotation={[-PI / 2, 0, 0]} scale={[z1(bl), z1(0.3 + 0.7 * bl), 1]}><planeGeometry args={[0.45, 0.4]} /><meshStandardMaterial color="#3a1a0a" emissive="#ff5a1a" emissiveIntensity={1.2 + 0.3 * Math.sin(tt * 2 * PI * 1.2)} toneMapped={false} transparent opacity={0.85} /></mesh>
    {[0, 1, 2].map((i) => <Fire key={i} tt={tt + i * 0.3} k={bl} p={[0.08 + i * 0.13, 0.33, 0.0 + 0.05 * (i % 2)]} s={0.8} />)}
    <mesh position={[0.62, 0.78, -0.33]}><planeGeometry args={[0.5, 0.5]} /><meshBasicMaterial color="#1e2a44" toneMapped={false} /></mesh>
    <mesh position={[0.62, 1.07, -0.3]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.8, 10]} />{M.brass()}</mesh>
    {[0, 1, 2, 3, 4].map((i) => <RBox key={i} s={[0.07, 0.72, 0.03]} p={[0.27 + i * 0.06, 0.7, -0.29 + 0.025 * (i % 2)]} r={0.012}><meshStandardMaterial color="#e2cfa6" roughness={0.95} /></RBox>)}
    <mesh position={[0.39, 0.36 + 0.33 * cu, -0.25]} scale={[1, z1(cu), 1]}><planeGeometry args={[0.32, 0.66]} /><meshStandardMaterial color="#3a1a0a" emissive="#ff6a1a" emissiveIntensity={1.4} toneMapped={false} transparent opacity={0.85} /></mesh>
    {[0, 1].map((i) => <Fire key={"c" + i} tt={tt + i * 0.4} k={cu} p={[0.32 + i * 0.14, 0.36 + 0.62 * cu, -0.23]} s={1.0} />)}
    <pointLight position={[0.3, 0.6, 0.3]} intensity={1.6 * Math.max(bl, cu)} distance={1.6} color="#ff8a3a" />
    {W.map(([w, a], i) => <Txt3 key={w} txt={w} w={0.34} h={0.065} col="#f7f4ee" bg="#b3221b" p={[-0.4, 0.92 - i * 0.085, -0.25]} op={cl((tt - a) / 0.3)} />)}
  </>;
}}</Scene3D>;

// 12:25 · DÍAS, NO HORAS: el farol LED sobre la mesa de luz; el almanaque de taco pasa DAY 1, 2, 3, 4 y el indicador del farol apenas
// pierde una rayita. «NO FLAME · RUNS FOR DAYS».
export const HLanternDays: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#0c0d10"
  cam={{ at: [0.05, 0.32, 0], az: [-0.2, 0.12], el: [0.16, 0.1], r: [1.25, 1.1], fov: 34 }}>{(tt) => {
  const d = Math.min(4, 1 + Math.floor(cl((tt - 0.6) / 3.6) * 4)), fl = ((tt - 0.6) % 0.9) / 0.9, flip = tt > 0.6 && tt < 4.2 ? eio(fl, 0.7, 1) : 0;
  return <>
    <RBox s={[0.7, 0.04, 0.4]} p={[0, 0.02, 0]} r={0.01}>{M.wood({ base: [120, 84, 50] })}</RBox>
    <Lantern on={1} p={[-0.15, 0.04, 0.02]} s={1.6} bars={d >= 4 ? 3 : 4} />
    <group position={[0.22, 0.04, -0.02]}>
      <RBox s={[0.2, 0.22, 0.04]} p={[0, 0.11, 0]} r={0.01}>{M.plastic({ col: "#f3f1ea" })}</RBox>
      <mesh position={[0, 0.2, 0.021]}><planeGeometry args={[0.2, 0.05]} /><meshStandardMaterial color="#b3221b" /></mesh>
      <Txt3 txt="DAY" w={0.12} h={0.035} col="#f7f4ee" p={[0, 0.2, 0.022]} />
      <Txt3 txt={String(d)} w={0.14} h={0.12} col="#1b1d21" p={[0, 0.1, 0.022]} />
      <group position={[0, 0.175, 0.024]} rotation={[-PI * flip, 0, 0]}><mesh position={[0, -0.075, 0]}><planeGeometry args={[0.19, 0.15]} /><meshStandardMaterial color="#f7f4ee" side={2} transparent opacity={flip > 0.02 && flip < 0.98 ? 1 : 0} /></mesh></group>
    </group>
    <Txt3 txt="NO FLAME" w={0.32} h={0.065} col="#0e1013" bg="#6fe39a" p={[-0.15, 0.55, 0.05]} op={cl((tt - 0.5) / 0.3)} />
    <Txt3 txt="RUNS FOR DAYS" w={0.56} h={0.085} col="#0e1013" bg="#ffd25a" p={[0.1, 0.64, 0.05]} op={cl((tt - 3.0) / 0.3)} />
  </>;
}}</Scene3D>;

// 12:43 · EL EMPUJÓN: dos portavelas en la misma mesa; la mesa recibe un golpe y tiembla; el candelero alto y flaco se cae; el frasco
// ancho cabecea y vuelve a quedar parado. «TIPS» / «CAN'T TIP».
export const HWobble: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark" bg="#0d0c0b"
  cam={{ at: [0, 0.26, 0], az: [-0.15, 0.1], el: [0.14, 0.1], r: [1.2, 1.08], fov: 34 }}>{(tt) => {
  const bump = tt > 1.2 && tt < 1.8 ? 0.015 * Math.sin((tt - 1.2) * 40) * (1 - (tt - 1.2) / 0.6) : 0;
  const fall = eio(tt, 1.4, 2.1) * 1.45, wob = tt < 1.3 ? 0 : 0.35 * Math.exp(-(tt - 1.3) * 2.2) * Math.sin((tt - 1.3) * 7);
  return <>
    <group position={[bump, 0, 0]}>
      <RBox s={[0.8, 0.04, 0.4]} p={[0, 0.02, 0]} r={0.01}>{M.wood({ base: [120, 84, 50] })}</RBox>
      <group position={[-0.2, 0.04, 0]}>
        <group position={[0.03, 0, 0]} rotation={[0, 0, -fall]}><group position={[-0.03, 0, 0]}>
          <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.03, 0.035, 0.01, 18]} />{M.brass()}</mesh>
          <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.008, 0.012, 0.2, 14]} />{M.brass()}</mesh>
          <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.012, 0.012, 0.14, 14]} />{M.porcelain({ col: "#f3ead6" })}</mesh>
          <Fire tt={tt} k={fall < 1.2 ? 1 : 0.001} p={[0, 0.34, 0]} s={0.35} />
        </group></group>
      </group>
      <group position={[0.2, 0.04, 0]} rotation={[0, 0, wob]}>
        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.07, 0.075, 0.12, 28, 1, true]} />{M.glass({ op: 0.4, col: "#ffe8c8" })}</mesh>
        <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.075, 0.075, 0.01, 28]} />{M.glass({ op: 0.6 })}</mesh>
        <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.04, 0.04, 0.07, 20]} />{M.porcelain({ col: "#f3ead6" })}</mesh>
        <Fire tt={tt} k={1} p={[0, 0.075, 0]} s={0.35} />
      </group>
      <pointLight position={[0.2, 0.2, 0.1]} intensity={0.7} distance={0.8} color="#ffb06a" />
    </group>
    <Txt3 txt="TALL · THIN" w={0.3} h={0.055} col="#f7f4ee" bg="#1b1d21" p={[-0.2, 0.1, 0.22]} op={cl((tt - 0.3) / 0.3)} />
    <Txt3 txt="WIDE JAR" w={0.28} h={0.055} col="#f7f4ee" bg="#1b1d21" p={[0.2, 0.1, 0.22]} op={cl((tt - 0.5) / 0.3)} />
    <Txt3 txt="TIPS" w={0.2} h={0.07} col="#f7f4ee" bg="#b3221b" p={[-0.1, 0.2, 0.1]} op={cl((tt - 2.2) / 0.3)} />
    <Txt3 txt="CAN'T TIP" w={0.32} h={0.07} col="#0e1013" bg="#6fe39a" p={[0.2, 0.26, 0.1]} op={cl((tt - 3.0) / 0.3)} />
  </>;
}}</Scene3D>;

// 13:14 · LA CUERDA FLOJA DEL VOLTAJE: el cable entre dos postes marcado 120 V; caen a la vez heladeras, freezers y calefactores de toda la
// calle colgando de él y el cable se comba; el voltímetro baja la aguja. «EVERYTHING STARTS AT ONCE → VOLTAGE SAGS».
export const HSag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#121722"
  cam={{ at: [0, 0.55, 0], az: [-0.1, 0.08], el: [0.08, 0.05], r: [1.6, 1.45], fov: 36 }}>{(tt) => {
  const land = phys(tt, 1.0, 7, 0.45), sag = q(0.04 + 0.22 * cl(land) * (1 - 0.35 * eio(tt, 3.8, 5.2)), 0.01), v = lerp(120, 98, cl(land)) + 14 * eio(tt, 3.8, 5.2);
  const N = 5, wy = (x: number) => 0.85 - sag * (1 - Math.pow(x / 0.75, 2));
  return <>
    <mesh position={[0, 0.6, -1.2]}><planeGeometry args={[5, 2.4]} /><meshBasicMaterial color="#26304a" toneMapped={false} /></mesh>
    {[-0.75, 0.75].map((x) => <mesh key={x} position={[x, 0.45, 0]}><cylinderGeometry args={[0.025, 0.03, 0.9, 14]} />{M.wood({ base: [92, 70, 50] })}</mesh>)}
    <mesh geometry={tubeG("sag" + sag, Array.from({ length: 15 }, (_, j) => { const x = -0.75 + 1.5 * j / 14; return [x, wy(x), 0]; }), 0.006, 60, 6)}>{M.matte({ col: "#1c1d20" })}</mesh>
    {Array.from({ length: N }, (_, i) => { const x = -0.52 + i * 0.26, y0 = wy(x), drop = (1 - cl(land)) * 0.6, kind = i % 3;
      return <group key={i} position={[x, y0 + drop, 0]}>
        <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.002, 0.002, 0.1, 6]} />{M.matte({ col: "#1c1d20" })}</mesh>
        <group position={[0, -0.1, 0]} rotation={[0, 0, 0.1 * Math.sin(tt * 3 + i)]} scale={1.8}>
          {kind === 0 ? <Fridge s={0.3} p={[0, -0.2, 0]} /> : kind === 1 ? <><RBox s={[0.12, 0.1, 0.08]} p={[0, -0.05, 0]} r={0.01}>{M.plastic({ col: "#c62a22" })}</RBox><mesh position={[0, -0.05, 0.041]}><planeGeometry args={[0.09, 0.06]} /><meshStandardMaterial color="#3a2a22" emissive="#ff6a20" emissiveIntensity={1.2} toneMapped={false} /></mesh></>
            : <RBox s={[0.1, 0.16, 0.08]} p={[0, -0.08, 0]} r={0.01}>{M.steel({ col: "#9aa0a6" })}</RBox>}
        </group>
      </group>; })}
    <group position={[0.0, 0.3, 0.4]} scale={1.5}>
      <RBox s={[0.3, 0.2, 0.04]} r={0.02}>{M.plastic({ col: "#f2c21b" })}</RBox>
      <mesh position={[0, 0.0, 0.021]}><planeGeometry args={[0.24, 0.14]} /><meshStandardMaterial color="#f7f4ee" /></mesh>
      <group position={[0, -0.05, 0.023]} rotation={[0, 0, lerp(0.9, -0.9, (v - 90) / 40)]}><mesh position={[0, 0.06, 0]}><boxGeometry args={[0.005, 0.12, 0.003]} />{M.matte({ col: "#b3221b" })}</mesh></group>
      <Txt3 txt={`${Math.round(v)} V`} w={0.16} h={0.06} col={v < 110 ? "#b3221b" : "#1b1d21"} p={[0, -0.045, 0.024]} />
    </group>
    <Txt3 txt="ALL AT ONCE" w={0.5} h={0.08} col="#f7f4ee" bg="#1b1d21" p={[-0.42, 0.9, 0.1]} op={cl((tt - 1.4) / 0.3)} />
    <Txt3 txt="VOLTAGE SAGS" w={0.5} h={0.08} col="#f7f4ee" bg="#b3221b" p={[0.42, 0.9, 0.1]} op={cl((tt - 2.2) / 0.3)} />
  </>;
}}</Scene3D>;

// 13:33 · CUATRO LLAMADAS, UNA CALLE: el corcho del taller; cuatro órdenes de servicio se clavan de a una con su chinche roja, cada una con
// lo que se quemó (dos compresores, una placa, una tele) y su mancha de quemado. «LIMA · 2017 · SAME STREET».
export const HTickets: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0e0d0c"
  cam={{ at: [0, 0.45, 0], az: [-0.12, 0.1], el: [0.06, 0.03], r: [1.25, 1.12], fov: 34 }}>{(tt) => {
  const T = ["FRIDGE COMPRESSOR", "FRIDGE COMPRESSOR", "FURNACE BOARD", "BIG TV"];
  return <>
    <RBox s={[1.2, 0.8, 0.03]} p={[0, 0.45, -0.03]} r={0.02}><meshStandardMaterial color="#b88a5a" roughness={0.95} /></RBox>
    <RBox s={[1.26, 0.86, 0.02]} p={[0, 0.45, -0.045]} r={0.02}>{M.wood({ base: [96, 62, 36] })}</RBox>
    {T.map((l, i) => { const a = 0.4 + i * 0.75, k = phys(tt, a, 9, 0.45), x = -0.42 + i * 0.28, rz = [0.06, -0.05, 0.04, -0.07][i];
      return <group key={i} position={[x, 0.42 + 0.3 * (1 - cl(k)), 0.0]} rotation={[0, 0, rz]} scale={z1(cl(k * 1.2))}>
        <mesh><planeGeometry args={[0.24, 0.32]} /><meshStandardMaterial color="#f6f0de" roughness={0.9} /></mesh>
        <Txt3 txt="SERVICE CALL" w={0.2} h={0.03} col="#b3221b" p={[0, 0.12, 0.002]} />
        <Txt3 txt={l} w={0.21} h={0.05} col="#1b1d21" bg="#f6f0de" p={[0, 0.06, 0.002]} />
        <mesh position={[0, -0.05, 0.002]}><circleGeometry args={[0.06, 24]} /><meshStandardMaterial color="#2a1a10" transparent opacity={0.85 * cl((tt - a - 0.3) / 0.3)} /></mesh>
        <Txt3 txt="FRIED" w={0.12} h={0.035} col="#ff6a3a" p={[0, -0.05, 0.003]} op={cl((tt - a - 0.3) / 0.3)} />
        <mesh position={[0, 0.15, 0.01]}><sphereGeometry args={[0.014, 14, 10]} />{M.plastic({ col: "#d82a22" })}</mesh>
      </group>; })}
    <Txt3 txt="LIMA · 2017 · SAME STREET" w={0.9} h={0.085} col="#f7f4ee" bg="#b3221b" p={[0, 0.13, 0.03]} op={cl((tt - 3.6) / 0.3)} />
  </>;
}}</Scene3D>;

// 14:42 · EL ATAJO DE WALT: diorama nevado; dos caminos de casa a casa: la ruta larga que rodea y el atajo recto por la laguna helada.
// La camioneta del atajo rompe el hielo y se hunde; la de la ruta larga llega. «THE SHORTCUT IS THE LONG WAY AROUND».
export const HShortcut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#151b26"
  cam={{ at: [-0.03, 0.05, 0.08], az: [-0.2, 0.1], el: [0.6, 0.5], r: [1.2, 1.08], fov: 36 }}>{(tt) => {
  const s1 = eio(tt, 0.6, 2.0), sink = eio(tt, 2.0, 3.2), s2 = eio(tt, 0.6, 4.6);
  const road = [[-0.6, 0.01, 0], [-0.45, 0.01, 0.4], [0, 0.01, 0.5], [0.45, 0.01, 0.4], [0.6, 0.01, 0]];
  const c2 = road.length - 1, seg = s2 * c2, j = Math.min(c2 - 1, Math.floor(seg)), f = seg - j, P2 = road[j].map((v, i) => lerp(v, road[j + 1][i], f));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[4, 3]} /><meshStandardMaterial color="#e6edf4" roughness={0.95} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.003, -0.05]}><circleGeometry args={[0.32, 40]} /><meshPhysicalMaterial color="#9fc6e6" roughness={0.1} clearcoat={1} /></mesh>
    <mesh geometry={tubeG("sc_road", road, 0.03, 60, 6)} scale={[1, 0.15, 1]}>{M.matte({ col: "#6a6e75" })}</mesh>
    {[-0.62, 0.62].map((x, i) => <group key={i} position={[x, 0, -0.05]}>
      <RBox s={[0.16, 0.12, 0.14]} p={[0, 0.06, 0]} r={0.01}>{M.matte({ col: i ? "#7a5a46" : "#5a6a7a" })}</RBox>
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.12, 0.12, 0.15]} />{M.matte({ col: "#3a3f48" })}</mesh>
    </group>)}
    <mesh rotation={[-PI / 2, 0, 0]} position={[-0.02, 0.005, -0.05]} scale={z1(cl((tt - 1.95) / 0.5))}><circleGeometry args={[0.17, 28]} /><meshStandardMaterial color="#0a1422" roughness={0.2} /></mesh>
    {Array.from({ length: 7 }, (_, i) => { const a = i * 0.9 + 0.3, k = cl((tt - 1.95) / 0.4); return <RBox key={"sl" + i} s={[0.09, 0.012, 0.06]} p={[-0.02 + 0.19 * Math.cos(a), 0.012 + 0.02 * k, -0.05 + 0.19 * Math.sin(a)]} r={0.004} rot={[0.5 * k * Math.sin(a), -a, 0.5 * k * Math.cos(a)]}><meshPhysicalMaterial color="#dff0ff" roughness={0.15} clearcoat={1} /></RBox>; })}
    <group position={[lerp(-0.5, -0.02, s1), 0.04 - 0.2 * sink, -0.05]} rotation={[0, 0, -0.9 * sink]} scale={1.8}>
      <RBox s={[0.1, 0.04, 0.06]} r={0.01}>{M.plastic({ col: "#c62a22" })}</RBox>
      <RBox s={[0.05, 0.035, 0.055]} p={[-0.015, 0.035, 0]} r={0.01}>{M.glass({ col: "#9fb8d0", op: 0.7 })}</RBox>
    </group>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.02, 0.006, -0.05]} rotation={[-PI / 2, 0, i * PI / 3]} scale={z1(cl((tt - 1.95) / 0.4))}><planeGeometry args={[0.24, 0.006]} /><meshBasicMaterial color="#2a3550" /></mesh>)}
    <group position={[P2[0], 0.04, P2[2]]} scale={1.8}><RBox s={[0.1, 0.04, 0.06]} r={0.01}>{M.plastic({ col: "#2a6a3a" })}</RBox><RBox s={[0.05, 0.035, 0.055]} p={[-0.015, 0.035, 0]} r={0.01}>{M.glass({ col: "#9fb8d0", op: 0.7 })}</RBox></group>
    <Txt3 txt="SHORTCUT  ✕" w={0.42} h={0.08} col="#f7f4ee" bg="#b3221b" p={[-0.1, 0.14, -0.32]} r={[-0.6, 0, 0]} op={cl((tt - 0.6) / 0.3)} />
    <Txt3 txt="THE LONG WAY AROUND" w={0.7} h={0.08} col="#0e1013" bg="#6fe39a" p={[0.05, 0.12, 0.42]} r={[-0.6, 0, 0]} op={cl((tt - 3.6) / 0.3)} />
  </>;
}}</Scene3D>;

// 15:01 · EL ARMARIO DEL PASILLO: las dos hojas se abren con peso; adentro se enciende una luz cálida y aparece UN estante con todo:
// faroles, mantas, radio, extintor y la caja en el piso. «ONE SHELF · NOTHING FANCY».
export const HCloset: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#0d0c0b"
  cam={{ at: [0, 0.4, -0.32], az: [-0.08, 0.08], el: [0.12, 0.08], r: [1.4, 1.06], fov: 34 }}>{(tt) => {
  const op = phys(tt, 0.5, 5, 0.6), li = cl((tt - 0.9) / 0.4);
  return <>
    {/* pared del pasillo con el HUECO del placard (r1: la pared entera tapaba todo) */}
    {[-1, 1].map((sd) => <RBox key={sd} s={[0.4, 1.2, 0.04]} p={[sd * 0.6, 0.6, -0.3]} r={0.01}><meshStandardMaterial color="#8a7e6c" roughness={0.9} /></RBox>)}
    <RBox s={[1.6, 0.2, 0.04]} p={[0, 1.1, -0.3]} r={0.01}><meshStandardMaterial color="#8a7e6c" roughness={0.9} /></RBox>
    <RBox s={[0.8, 1.0, 0.36]} p={[0, 0.5, -0.47]} r={0.01}><meshStandardMaterial color="#a8987e" roughness={0.95} side={1} /></RBox>
    <pointLight position={[0, 0.85, -0.3]} intensity={0.85 * li} distance={1.3} color="#ffd8a0" />
    <mesh position={[0, 0.5, -0.45]}><boxGeometry args={[0.76, 0.02, 0.3]} />{M.wood({ base: [130, 92, 56] })}</mesh>
    {[-0.3, -0.2].map((x) => <Lantern key={x} on={0.6 * li} p={[x, 0.51, -0.42]} s={1.15} />)}
    {[0, 1, 2].map((i) => <RBox key={i} s={[0.16, 0.035, 0.2]} p={[-0.02, 0.53 + i * 0.036, -0.45]} r={0.01}><meshStandardMaterial color={["#5a5a4a", "#6a5a3a", "#4a5a4a"][i]} roughness={1} /></RBox>)}
    <RBox s={[0.12, 0.08, 0.05]} p={[0.15, 0.55, -0.42]} r={0.01}>{M.plastic({ col: "#2a2c30" })}</RBox>
    <group position={[0.29, 0.51, -0.42]}><mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.03, 0.03, 0.16, 18]} />{M.plastic({ col: "#d82a22" })}</mesh></group>
    <PBox p={[0.14, 0, -0.42]} s={0.75} scr="80%" on={li} />
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.4, 0.5, -0.28]} rotation={[0, sd * 1.9 * op, 0]}>
      <RBox s={[0.4, 1.0, 0.03]} p={[-sd * 0.2, 0, 0.015]} r={0.008}>{M.porcelain({ col: "#efe9dc" })}</RBox>
      <mesh position={[-sd * 0.36, 0, 0.04]}><sphereGeometry args={[0.014, 12, 10]} />{M.brass()}</mesh>
    </group>)}
    <Txt3 txt="ONE SHELF · NOTHING FANCY" w={0.6} h={0.06} col="#f7f4ee" bg="#1b1d21" p={[0, 0.37, -0.2]} op={cl((tt - 2.4) / 0.3)} />
  </>;
}}</Scene3D>;

// 15:16 · TODAS DEL MISMO TAMAÑO: cuatro faroles y dos linternas de cabeza en fila; las pilas ruedan desde la caja y entran en cada una
// (todas AA); una pila grande intrusa rebota afuera con su X. Cada aparato se prende al cargar. «ALL THE SAME SIZE».
export const HSameBattery: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark" bg="#0c0d10"
  cam={{ at: [0.0, 0.16, 0.05], az: [-0.15, 0.1], el: [0.38, 0.3], r: [1.35, 1.22], fov: 34 }}>{(tt) => {
  const X = [-0.45, -0.27, -0.09, 0.09, 0.27, 0.45], a = (i: number) => 0.5 + i * 0.45, on = (i: number) => cl((tt - a(i) - 0.4) / 0.2);
  const odd = tt < 3.4 ? 0 : (tt - 3.4), ox = lerp(0.6, 0.2, cl(odd / 0.4)) + (odd > 0.4 ? Math.min(0.3, 0.5 * (odd - 0.4)) : 0), oy = 0.03 + (odd > 0.4 ? Math.abs(Math.sin((odd - 0.4) * 7)) * 0.08 * Math.exp(-(odd - 0.4) * 2) : 0);
  return <>
    {X.map((x, i) => <group key={i}>
      {i < 4 ? <Lantern on={on(i)} p={[x, 0, -0.05]} s={1.1} /> : <group position={[x, 0.04, -0.05]}>
        <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.05, 0.008, 8, 24]} />{M.rubber({ col: "#2a2c30" })}</mesh>
        <RBox s={[0.05, 0.035, 0.03]} p={[0, 0, 0.05]} r={0.008}>{M.plastic({ col: "#2a2c30" })}</RBox>
        <mesh position={[0, 0, 0.066]}><circleGeometry args={[0.012, 16]} /><meshStandardMaterial color="#fff8e8" emissive="#fff0c8" emissiveIntensity={2.4 * on(i)} toneMapped={false} /></mesh>
      </group>}
      <group position={[lerp(-0.75, x, eio(tt, a(i), a(i) + 0.35)), 0.016 + 0.08 * eio(tt, a(i) + 0.3, a(i) + 0.4), 0.15 - 0.15 * eio(tt, a(i) + 0.3, a(i) + 0.4)]} rotation={[0, 0, PI / 2 - (tt - a(i)) * 6 * (tt < a(i) + 0.35 ? 1 : 0)]} scale={z1(tt < a(i) + 0.42 ? 1 : 0.001)}>
        <mesh><cylinderGeometry args={[0.007, 0.007, 0.05, 12]} />{M.plastic({ col: "#c9a12a" })}</mesh>
      </group>
      <Txt3 txt="AA" w={0.07} h={0.035} col="#ffd25a" glow p={[x, 0.3, -0.05]} op={on(i)} />
    </group>)}
    <group position={[ox, oy, 0.2]} rotation={[0, 0, PI / 2]} scale={z1(tt > 3.3 ? 1 : 0.001)}><mesh><cylinderGeometry args={[0.017, 0.017, 0.06, 16]} />{M.plastic({ col: "#3a5a8a" })}</mesh></group>
    <Mark k={cl((tt - 3.9) / 0.4)} p={[ox, 0.09, 0.24]} s={0.4} />
    <Txt3 txt="ALL THE SAME SIZE" w={0.7} h={0.085} col="#0e1013" bg="#6fe39a" p={[0, 0.02, 0.4]} r={[-PI / 2 + 0.6, 0, 0]} op={cl((tt - 4.3) / 0.3)} />
  </>;
}}</Scene3D>;

// 15:30 · LANA CONTRA ALGODÓN: dos medias iguales sobre la tabla; les caen gotas de agua a las dos; la de algodón se pone azul fría
// y su termómetro baja; la de lana sigue naranja tibia. «WOOL STAYS WARM DAMP».
export const HWoolCotton: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" bg="#0e0d0c"
  cam={{ at: [0, 0.16, 0], az: [-0.15, 0.1], el: [0.42, 0.34], r: [1.25, 1.12], fov: 34 }}>{(tt) => {
  const wet = cl((tt - 1.6) / 1.2), cold = eio(tt, 2.0, 3.8);
  const sock = (x: number, col: string, em: string, emI: number, id: string) => <group position={[x, 0.03, 0]}>
    <mesh geometry={tubeG("sock2" + id, [[0, 0.04, -0.2], [0, 0.04, 0.02], [0.02, 0.04, 0.1], [0.1, 0.04, 0.15], [0.17, 0.04, 0.16]], 0.042, 50, 16)} scale={[1, 0.75, 1]} castShadow><meshStandardMaterial color={col} roughness={1} emissive={em} emissiveIntensity={emI} /></mesh>
    <mesh position={[0, 0.03, -0.2]}><cylinderGeometry args={[0.046, 0.046, 0.05, 20]} /><meshStandardMaterial color={col} roughness={1} emissive={em} emissiveIntensity={emI * 0.6} /></mesh>
    {[0, 1, 2, 3].map((k) => <mesh key={k} position={[0, 0.035, -0.17 + k * 0.05]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.043, 0.004, 6, 24]} /><meshStandardMaterial color={col} roughness={1} /></mesh>)}
  </group>;
  return <>
    {sock(-0.25, "#8a6a4a", "#ff7a2a", 0.35, "w")}
    {sock(0.25, "#e9e6de", "#3a8adf", 0.6 * cold, "c")}
    {[0, 1, 2, 3].map((i) => <React.Fragment key={i}><Drop tt={tt} a={1.0 + i * 0.25} b={1.4 + i * 0.25} x={-0.27 + i * 0.03} y0={0.6} y1={0.08} z={0.02} /><Drop tt={tt} a={1.1 + i * 0.25} b={1.5 + i * 0.25} x={0.23 + i * 0.03} y0={0.6} y1={0.08} z={0.02} /></React.Fragment>)}
    {[-0.25, 0.25].map((x, i) => { const T = i ? lerp(88, 61, cold) : lerp(88, 84, cold);
      return <group key={x} position={[x, 0.28, -0.12]}>
        <Txt3 txt={i ? "COTTON" : "WOOL"} w={0.26} h={0.065} col="#f7f4ee" bg={i ? "#1d4a7a" : "#8a4a1a"} p={[0, 0.1, 0]} />
        <Txt3 txt={`${Math.round(T)}°F`} w={0.2} h={0.08} col={i ? "#9fd0ff" : "#ffb34a"} glow p={[0, 0.0, 0]} op={cl((tt - 2.0) / 0.3)} />
      </group>; })}
    {[-0.25, 0.25].map((x) => <mesh key={x} position={[x + 0.02, 0.071, 0.0]} rotation={[-PI / 2, 0, 0]} scale={z1(wet)}><circleGeometry args={[0.07, 24]} /><meshStandardMaterial color="#20304a" transparent opacity={0.45} depthWrite={false} /></mesh>)}
    <Txt3 txt="WOOL STAYS WARM DAMP" w={0.8} h={0.08} col="#0e1013" bg="#ffb34a" p={[0, 0.02, 0.34]} r={[-PI / 2 + 0.6, 0, 0]} op={cl((tt - 4.2) / 0.3)} />
  </>;
}}</Scene3D>;
