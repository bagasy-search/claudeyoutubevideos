// gary06 · componentes únicos 4/4 (min 16-21).
import React from "react";
import { H, cl, eio, phys } from "./hkit";
import { M, RBox, Scene3D, lerp, tubeG } from "./h3d";
import { PI, Txt3, Mark, PBox } from "./gk";
import { Gen, Puffs, mini } from "./gh1";

const z1 = (k: number) => Math.max(0.001, k);

// 15:47 · EL PAPEL NO SE APAGA: el teléfono en la mesa pasa a 1 % y se apaga; al lado se desliza la hoja impresa con los teléfonos que
// importan (compañía de luz, vecinos, la familia) y cada renglón se escribe. «PAPER NEVER DIES».
export const HPhoneList: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#0e0d0c"
  cam={{ at: [0.0, 0.04, 0.06], az: [-0.1, 0.08], el: [0.95, 0.85], r: [1.05, 0.95], fov: 34 }}>{(tt) => {
  const dead = cl((tt - 1.2) / 0.4), sl = eio(tt, 1.6, 2.3), L = ["POWER COMPANY", "NEIGHBORS", "FAMILY ACROSS TOWN", "PLUMBER", "DOCTOR", "CHURCH"];
  return <>
    <group position={[-0.25, 0.006, 0]} rotation={[-PI / 2, 0, 0.15]}>
      <RBox s={[0.16, 0.3, 0.012]} r={0.02}>{M.matte({ col: "#1c1d20" })}</RBox>
      <mesh position={[0, 0, 0.007]}><planeGeometry args={[0.145, 0.28]} /><meshStandardMaterial color="#05070a" emissive="#3a8adf" emissiveIntensity={0.6 * (1 - dead)} /></mesh>
      <Txt3 txt={tt < 0.7 ? "5%" : tt < 1.2 ? "1%" : ""} w={0.13} h={0.075} col="#ff5a4a" glow p={[0, 0.02, 0.008]} op={1 - dead} />
      <Txt3 txt="DEAD" w={0.12} h={0.045} col="#ff5a4a" p={[0, -0.05, 0.008]} op={cl((tt - 1.5) / 0.3)} />
    </group>
    <group position={[lerp(0.8, 0.18, sl), 0.008, 0.0]} rotation={[-PI / 2, 0, -0.06]}>
      <mesh><planeGeometry args={[0.34, 0.44]} /><meshStandardMaterial color="#f6f0de" roughness={0.9} /></mesh>
      <Txt3 txt="PHONE NUMBERS" w={0.26} h={0.04} col="#b3221b" p={[0, 0.17, 0.001]} />
      {L.map((l, i) => <group key={l} position={[0, 0.1 - i * 0.056, 0.001]}>
        <Txt3 txt={l} w={0.17} h={0.032} col="#1b1d21" p={[-0.068, 0, 0]} op={cl((tt - 2.3 - i * 0.3) / 0.3)} />
        <Txt3 txt={["555-0142", "555-0178", "555-0119", "555-0163", "555-0127", "555-0191"][i]} w={0.085} h={0.028} col="#1d4a7a" p={[0.11, 0, 0]} op={cl((tt - 2.4 - i * 0.3) / 0.3)} />
      </group>)}
    </group>
    <Txt3 txt="PAPER NEVER DIES" w={0.42} h={0.065} col="#0e1013" bg="#6fe39a" p={[-0.27, 0.03, 0.24]} r={[-PI / 2 + 0.3, 0, 0]} op={cl((tt - 4.3) / 0.3)} />
  </>;
}}</Scene3D>;

// 16:06 · TIRÁ DEL SEGURO: el matafuego grande; el anillo del seguro sale con resorte, la manija aprieta y sale el chorro blanco que
// barre; se encienden PULL · AIM · SQUEEZE · SWEEP.
export const HPullPin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" bg="#0e0f11"
  cam={{ at: [0.1, 0.42, 0], az: [-0.35, -0.05], el: [0.1, 0.06], r: [1.3, 1.18], fov: 34 }}>{(tt) => {
  const pin = phys(tt, 0.8, 7, 0.5), sq = eio(tt, 2.0, 2.3), spray = cl((tt - 2.3) / 0.3), sweep = 0.35 * Math.sin((tt - 2.3) * 2.4) * spray;
  const W = ["PULL", "AIM", "SQUEEZE", "SWEEP"], A = [0.9, 1.5, 2.1, 2.8];
  return <>
    <group position={[-0.2, 0, 0]}>
      <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.09, 0.09, 0.5, 32]} />{M.plastic({ col: "#d82a22" })}</mesh>
      <mesh position={[0, 0.52, 0]}><sphereGeometry args={[0.09, 28, 14, 0, 2 * PI, 0, PI / 2]} />{M.plastic({ col: "#d82a22" })}</mesh>
      <RBox s={[0.12, 0.08, 0.05]} p={[0, 0.27, 0.085]} r={0.01}>{M.plastic({ col: "#f3f1ea" })}</RBox>
      <Txt3 txt="ABC" w={0.08} h={0.035} col="#1b1d21" p={[0, 0.27, 0.111]} />
      <mesh position={[0, 0.63, 0]}><cylinderGeometry args={[0.025, 0.03, 0.06, 16]} />{M.chrome()}</mesh>
      <group position={[0.02, 0.67, 0]} rotation={[0, 0, -0.25 + 0.2 * sq]}><RBox s={[0.2, 0.02, 0.04]} p={[0.09, 0, 0]} r={0.006}>{M.steel({ col: "#2a2c30" })}</RBox></group>
      <RBox s={[0.18, 0.02, 0.04]} p={[0.1, 0.64, 0]} r={0.006}>{M.steel({ col: "#2a2c30" })}</RBox>
      <group position={[0.04 + 0.3 * cl(pin), 0.655 + 0.05 * Math.sin(PI * cl(pin)), 0.03]}>
        <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.003, 0.003, 0.06, 8]} />{M.chrome()}</mesh>
        <mesh position={[0.04, 0, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.018, 0.004, 8, 20]} />{M.plastic({ col: "#f2c21b" })}</mesh>
      </group>
      <mesh geometry={tubeG("pp_hose", [[0.03, 0.6, 0], [0.13, 0.5, 0.05], [0.2, 0.4, 0.1]], 0.009, 30, 8)}>{M.rubber({ col: "#1c1d20" })}</mesh>
      <group position={[0.2, 0.4, 0.1]} rotation={[0, sweep, 0]}>
        <mesh position={[0.25, 0, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.1 * spray + 0.001, 0.5, 20, 1, true]} /><meshBasicMaterial color="#f3f6f8" transparent opacity={0.55 * spray} depthWrite={false} side={2} /></mesh>
      </group>
    </group>
    {W.map((w, i) => <Txt3 key={w} txt={w} w={0.32} h={0.07} col={tt > A[i] ? "#0e1013" : "#666"} bg={tt > A[i] ? "#f2c21b" : "#2a2c30"} p={[0.5, 0.82 - i * 0.11, -0.15]} />)}
  </>;
}}</Scene3D>;

// 16:21 · OCHENTA POR CIENTO: la caja en el piso del armario; su columna de carga sube y frena en la raya del 80 %; al lado se enrolla
// el cable corto y grueso con su etiqueta. «80% · READY FOR THE FRIDGE».
export const HEighty: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" bg="#0e0d0c"
  cam={{ at: [0.05, 0.34, 0], az: [-0.2, 0.1], el: [0.14, 0.1], r: [1.35, 1.2], fov: 34 }}>{(tt) => {
  const lv = 0.8 * eio(tt, 0.5, 2.6) + 0.01 * Math.max(0, Math.sin((tt - 2.6) * 6)) * Math.exp(-(tt - 2.6) * 2) * (tt > 2.6 ? 1 : 0), coil = eio(tt, 2.8, 4.2);
  return <>
    <PBox p={[-0.2, 0, 0]} s={1.3} scr={`${Math.round(lv * 100)}%`} />
    <group position={[0.2, 0.05, 0.05]}>
      <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.06, 0.06, 0.5, 24, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
      <mesh position={[0, 0.005 + 0.245 * Math.max(0.01, lv / 1), 0]} scale={[1, z1(lv), 1]}><cylinderGeometry args={[0.055, 0.055, 0.49, 24]} /><meshStandardMaterial color="#4fbf6a" emissive="#4fbf6a" emissiveIntensity={0.5} /></mesh>
      <mesh position={[0, 0.4, 0]}><boxGeometry args={[0.16, 0.006, 0.006]} />{M.glow({ col: "#ffd25a" })}</mesh>
      <Txt3 txt="80%" w={0.14} h={0.06} col="#ffd25a" glow p={[0.15, 0.4, 0]} />
    </group>
    {Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[0.4, 0.02 + i * 0.022, 0.12]} rotation={[PI / 2, 0, 0]} scale={z1(cl(coil * 4 - i))}><torusGeometry args={[0.07, 0.013, 10, 32]} />{M.rubber({ col: "#e5761c" })}</mesh>)}
    <Txt3 txt="SHORT · HEAVY" w={0.3} h={0.055} col="#f7f4ee" bg="#1b1d21" p={[0.4, 0.17, 0.14]} op={coil} />
    <Txt3 txt="READY FOR THE FRIDGE" w={0.7} h={0.08} col="#0e1013" bg="#6fe39a" p={[0.05, 0.64, 0]} op={cl((tt - 4.4) / 0.3)} />
  </>;
}}</Scene3D>;

// 17:06 · LA CARPA DEL GENERADOR: nieva sobre el generador en el patio; la carpa hecha para eso baja con peso y lo cubre dejando libre
// el escape; la nieve resbala por el techo. «MADE FOR IT · STILL OUTSIDE».
export const HGenTent: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#161c28"
  cam={{ at: [0, 0.3, 0], az: [-0.32, -0.1], el: [0.2, 0.14], r: [1.55, 1.4], fov: 34 }}>{(tt) => {
  const drop = phys(tt, 0.8, 7, 0.5);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[5, 4]} /><meshStandardMaterial color="#e3ebf3" roughness={0.95} /></mesh>
    <Gen t={tt} p={[0, 0, 0]} s={0.9} />
    <Puffs tt={tt} p={[0.25, 0.12, 0.08]} n={5} per={1.4} dir={[0.4, 0.25, 0]} op={0.45} />
    <group position={[0, 0.5 + 0.7 * (1 - drop), 0]}>
      <mesh rotation={[0, PI / 4, 0]} position={[0, 0.06, 0]}><coneGeometry args={[0.44, 0.2, 4, 1, true]} /><meshStandardMaterial color="#2a4a7a" roughness={0.7} side={2} /></mesh>
      <mesh rotation={[0.35, PI / 4, 0]} position={[0.02, 0.07 - 0.12 * eio(tt, 2.4, 3.6), 0.05 + 0.18 * eio(tt, 2.4, 3.6)]}><boxGeometry args={[0.2, 0.025, 0.14]} /><meshStandardMaterial color="#ffffff" roughness={0.9} /></mesh>
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z], i) => <mesh key={i} position={[x * 0.2, -0.25, z * 0.2]}><cylinderGeometry args={[0.013, 0.013, 0.5, 10]} />{M.steel({ col: "#2a2c30" })}</mesh>)}
    </group>
    {Array.from({ length: 40 }, (_, i) => { const x = ((i * 37) % 100) / 100 * 1.6 - 0.8, z = ((i * 61) % 100) / 100 * 1.0 - 0.5, y = 1.2 - ((tt * 0.25 + i * 0.07) % 1.2);
      return <mesh key={i} position={[x + 0.03 * Math.sin(tt + i), y, z]}><sphereGeometry args={[0.006, 6, 5]} /><meshBasicMaterial color="#ffffff" /></mesh>; })}
    <Txt3 txt="MADE FOR IT" w={0.46} h={0.08} col="#f7f4ee" bg="#2a4a7a" p={[0, 0.06, 0.42]} op={cl((tt - 2.0) / 0.3)} />
    <Txt3 txt="STILL OUTSIDE" w={0.5} h={0.08} col="#0e1013" bg="#6fe39a" p={[0, 0.16, 0.42]} op={cl((tt - 3.0) / 0.3)} />
  </>;
}}</Scene3D>;

// 17:42 · LA PELEA EN EL TABLERO: el generador sigue enchufado con el cable de dos machos y alguien sube la llave principal; desde el poste
// entra la corriente amarilla de la red, desde el generador la naranja; chocan dentro del tablero, chisporrotea y el cable humea.
// «GRID vs GENERATOR».
export const HFight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark" bg="#0e1013"
  cam={{ at: [0, 0.45, 0], az: [-0.1, 0.08], el: [0.12, 0.08], r: [1.85, 1.7], fov: 36 }}>{(tt) => {
  const mainOn = eio(tt, 0.6, 0.9), g = eio(tt, 1.0, 2.2), meet = cl((tt - 2.2) / 0.3), smoke = cl((tt - 3.0) / 0.5);
  const pulse = (x0: number, x1: number, col: string, u: number, k: string) => Array.from({ length: 6 }, (_, i) => { const f = ((tt * 0.9 + i / 6) % 1) * u;
    return <mesh key={k + i} position={[lerp(x0, x1, f), 0.48 + 0.01 * Math.sin(i), 0.02]}><sphereGeometry args={[0.016, 10, 8]} />{M.glow({ col })}</mesh>; });
  return <>
    <mesh position={[-0.8, 0.45, -0.1]}><cylinderGeometry args={[0.025, 0.03, 0.9, 14]} />{M.wood({ base: [92, 70, 50] })}</mesh>
    <mesh geometry={tubeG("fg_l", [[-0.8, 0.86, -0.1], [-0.5, 0.6, 0], [-0.13, 0.48, 0.02]], 0.007, 40, 6)}>{M.matte({ col: "#1c1d20" })}</mesh>
    <mesh geometry={tubeG("fg_r", [[0.65, 0.2, 0.05], [0.4, 0.4, 0.04], [0.13, 0.48, 0.02]], 0.012, 40, 8)}>{M.rubber({ col: "#e07a1f" })}</mesh>
    <RBox s={[0.26, 0.4, 0.08]} p={[0, 0.48, -0.02]} r={0.015}>{M.steel({ col: "#9aa0a6" })}</RBox>
    <group position={[0, 0.58, 0.03]} rotation={[lerp(0.6, -0.6, mainOn), 0, 0]}><mesh position={[0, 0, 0.02]}><boxGeometry args={[0.06, 0.025, 0.04]} />{M.plastic({ col: "#1c1d20" })}</mesh></group>
    <Txt3 txt="MAIN ON" w={0.16} h={0.04} col="#6fe39a" glow p={[0, 0.64, 0.03]} op={mainOn} />
    <Gen t={tt} p={[0.66, 0, 0.05]} s={0.75} />
    {pulse(-0.5, -0.02, "#ffe06a", g, "a")}{pulse(0.5, 0.02, "#ff8a3a", g, "b")}
    <mesh position={[0, 0.48, 0.05]} scale={z1(meet * (0.8 + 0.2 * Math.sin(tt * 2 * PI * 1.8)))}><sphereGeometry args={[0.05, 18, 14]} />{M.glow({ col: "#fff2b0", op: 0.85 })}</mesh>
    <pointLight position={[0, 0.48, 0.2]} intensity={1.8 * meet} distance={1.0} color="#ffd27a" />
    <Puffs tt={tt} p={[0.3, 0.42, 0.05]} n={4} per={1.6} dir={[0.05, 0.35, 0]} op={0.5 * smoke} />
    <Txt3 txt="GRID" w={0.18} h={0.06} col="#ffe06a" glow p={[-0.5, 0.72, 0.02]} op={g} />
    <Txt3 txt="GENERATOR" w={0.32} h={0.06} col="#ff8a3a" glow p={[0.5, 0.72, 0.02]} op={g} />
    <Txt3 txt="SOMETHING BREAKS" w={0.66} h={0.085} col="#f7f4ee" bg="#b3221b" p={[0, 0.16, 0.25]} op={cl((tt - 3.3) / 0.3)} />
  </>;
}}</Scene3D>;

// 18:18 · SIETE PASOS LARGOS: desde la pared de la casa aparecen en la nieve las huellas de las botas, una por una con su número, hasta
// el generador. «≈ 20 FT».
export const HSevenSteps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#161c28"
  cam={{ at: [-0.02, 0.05, 0], az: [-0.1, 0.1], el: [0.95, 0.85], r: [1.8, 1.65], fov: 36 }}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[5, 4]} /><meshStandardMaterial color="#e6edf4" roughness={0.95} /></mesh>
  <RBox s={[0.32, 0.5, 1.0]} p={[-0.75, 0.25, 0]} r={0.01}>{M.wood({ base: [176, 168, 150] })}</RBox>
  {[-1, 1].map((sd) => <mesh key={sd} position={[-0.75 + sd * 0.09, 0.56, 0]} rotation={[0, 0, -sd * 0.55]}><boxGeometry args={[0.22, 0.03, 1.08]} />{M.matte({ col: "#5a3a2a" })}</mesh>)}
  <RBox s={[0.02, 0.36, 0.2]} p={[-0.585, 0.18, 0.2]} r={0.005}>{M.wood({ base: [120, 70, 40] })}</RBox>
  <mesh position={[-0.588, 0.32, -0.25]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.22, 0.16]} /><meshStandardMaterial color="#1a1a1a" emissive="#ffc46a" emissiveIntensity={0.6} /></mesh>
  <Txt3 txt="HOUSE" w={0.26} h={0.08} col="#f7f4ee" bg="#1b1d21" p={[-0.75, 0.66, 0.05]} r={[-PI / 2 + 0.3, 0, 0]} />
  {Array.from({ length: 7 }, (_, i) => { const a = 0.5 + i * 0.5, k = cl((tt - a) / 0.2), x = -0.5 + i * 0.165, z = i % 2 ? 0.06 : -0.06;
    return <group key={i}>
      <mesh position={[x, 0.002, z]} rotation={[-PI / 2, 0, -PI / 2]} scale={[z1(k), z1(k), 1]}><circleGeometry args={[0.04, 20]} /><meshStandardMaterial color="#9aa8b8" transparent opacity={0.85} /></mesh>
      <mesh position={[x + 0.05, 0.002, z]} rotation={[-PI / 2, 0, 0]} scale={[z1(k), z1(k), 1]}><circleGeometry args={[0.025, 16]} /><meshStandardMaterial color="#9aa8b8" transparent opacity={0.85} /></mesh>
      <Txt3 txt={String(i + 1)} w={0.1} h={0.1} col="#b3221b" p={[x + 0.02, 0.05, z + 0.13]} r={[-PI / 2 + 0.5, 0, 0]} op={k} />
    </group>; })}
  <Gen t={tt} p={[0.66, 0, 0]} s={0.7} />
  <Txt3 txt="≈ 20 FT" w={0.56} h={0.13} col="#f7f4ee" bg="#b3221b" p={[0.0, 0.05, -0.3]} r={[-PI / 2 + 0.5, 0, 0]} op={cl((tt - 3.7) / 0.3)} />
</>}</Scene3D>;

// 18:34 · EL VIENTO DE BLUFFTON: el generador a 20 pies de SU casa pero bajo la ventana del vecino; la veleta gira y el humo dobla hacia esa
// ventana; adentro el detector del vecino parpadea rojo y el reloj marca 2:00. «20 FT IS THE MINIMUM».
export const HWindNeighbor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#121824"
  cam={{ at: [0.0, 0.28, 0], az: [-0.22, 0.05], el: [0.42, 0.34], r: [2.05, 1.9], fov: 36 }}>{(tt) => {
  const wind = eio(tt, 0.8, 1.8), al = cl((tt - 2.6) / 0.3), blink = al * (Math.sin(tt * 2 * PI * 1.5) > 0 ? 1 : 0.25);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[5, 4]} /><meshStandardMaterial color="#e3ebf3" roughness={0.95} /></mesh>
    <group position={[-0.62, 0, 0]}><RBox s={[0.4, 0.4, 0.5]} p={[0, 0.2, 0]} r={0.01}>{M.matte({ col: "#5a6a7a" })}</RBox><Txt3 txt="YOURS" w={0.24} h={0.06} col="#f7f4ee" bg="#1b1d21" p={[0, 0.48, 0.1]} /></group>
    <group position={[0.66, 0, 0]}>
      <RBox s={[0.4, 0.4, 0.5]} p={[0, 0.2, 0]} r={0.01}>{M.matte({ col: "#7a5a46" })}</RBox>
      <mesh position={[-0.201, 0.25, 0]} rotation={[0, -PI / 2, 0]}><planeGeometry args={[0.16, 0.12]} /><meshStandardMaterial color="#1a1a1a" emissive="#ffc46a" emissiveIntensity={0.3} /></mesh>
      <mesh position={[-0.202, 0.36, 0.12]} rotation={[0, -PI / 2, 0]}><circleGeometry args={[0.045, 20]} /><meshStandardMaterial color="#300" emissive="#ff2a1a" emissiveIntensity={4 * blink} toneMapped={false} /></mesh>
      <Txt3 txt="NEIGHBOR" w={0.3} h={0.06} col="#f7f4ee" bg="#1b1d21" p={[0, 0.48, 0.1]} />
      <Txt3 txt="2:00 AM" w={0.24} h={0.07} col="#ff5a4a" glow p={[-0.22, 0.45, 0.12]} r={[0, -PI / 2 + 0.6, 0]} op={al} />
    </group>
    <Gen t={tt} p={[0.25, 0, 0.05]} s={0.6} />
    <Puffs tt={tt} p={[0.4, 0.1, 0.08]} n={6} per={1.4} dir={[lerp(0.05, 0.3, wind), lerp(0.4, 0.15, wind), 0]} op={0.5} />
    <group position={[0.0, 0.0, -0.4]}>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.006, 0.006, 0.6, 8]} />{M.steel({ col: "#2a2c30" })}</mesh>
      <group position={[0, 0.6, 0]} rotation={[0, lerp(PI * 0.7, 0, wind), 0]}><mesh position={[0.08, 0, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.03, 0.18, 4]} />{M.brass()}</mesh></group>
    </group>
    <Txt3 txt="20 FT = THE MINIMUM" w={0.8} h={0.09} col="#f7f4ee" bg="#b3221b" p={[0, 0.04, 0.45]} r={[-PI / 2 + 0.6, 0, 0]} op={cl((tt - 4.0) / 0.3)} />
  </>;
}}</Scene3D>;

// 19:01 · LA LISTA DEL GABINETE: la puerta del gabinete de la cocina se abre y adentro, pegada con cinta, la hoja de la primera hora:
// diez renglones con sus minutos que se van marcando. «MY FIRST HOUR».
export const HCabinetList: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0e0d0c"
  cam={{ at: [0.0, 0.42, 0], az: [-0.22, -0.05], el: [0.08, 0.05], r: [1.35, 1.22], fov: 34 }}>{(tt) => {
  const op = phys(tt, 0.4, 5, 0.6), MN = ["1", "5", "10", "15", "20", "25", "30", "40", "50", "60"];
  const L = ["WINDOW · BREAKER", "FRIDGE SHUT", "UNPLUG · 1 LAMP", "WATER · DRIP", "TEST CO", "WARM ROOM", "PHONES · RADIO", "FURNACE ON BATTERY", "NEIGHBORS", "COFFEE"];
  return <>
    <RBox s={[0.7, 0.8, 0.3]} p={[0, 0.45, -0.17]} r={0.01}>{M.wood({ base: [150, 112, 72] })}</RBox>
    <mesh position={[0, 0.45, -0.019]}><planeGeometry args={[0.64, 0.74]} /><meshStandardMaterial color="#e8dcc0" roughness={0.9} /></mesh>
    {[-0.27, 0.27].map((x) => [0.2, 0.62].map((y, j) => <mesh key={x + "" + y} position={[x, y + 0.05, -0.12]}><cylinderGeometry args={[0.035, 0.035, 0.1, 18]} />{j ? M.glass({ col: "#d8b070", op: 0.7 }) : M.steel({ col: "#c9ced3" })}</mesh>))}
    <group position={[0, 0.45, 0]}>
      <mesh><planeGeometry args={[0.42, 0.62]} /><meshStandardMaterial color="#fbf7ec" roughness={0.9} /></mesh>
      <Txt3 txt="MY FIRST HOUR" w={0.32} h={0.048} col="#b3221b" p={[0, 0.248, 0.001]} />
      {MN.map((m, i) => { const k = cl((tt - 1.2 - i * 0.35) / 0.25);
        return <group key={m} position={[0, 0.19 - i * 0.047, 0.001]}>
          <Txt3 txt={`MIN ${m}`} w={0.09} h={0.03} col="#1b1d21" p={[-0.15, 0, 0]} op={k} />
          <Txt3 txt={L[i]} w={0.24} h={0.03} col="#1b1d21" p={[0.06, 0, 0]} op={k} />
        </group>; })}
      {[[-0.18, 0.3], [0.18, 0.3], [-0.18, -0.3], [0.18, -0.3]].map(([x, y], i) => <mesh key={i} position={[x, y, 0.002]} rotation={[0, 0, i % 2 ? -0.6 : 0.6]}><planeGeometry args={[0.1, 0.03]} /><meshStandardMaterial color="#e8d9a8" transparent opacity={0.8} /></mesh>)}
    </group>
    <group position={[0.35, 0.45, 0.0]} rotation={[0, 2.0 * cl(op), 0]}>
      <RBox s={[0.7, 0.8, 0.025]} p={[-0.35, 0, 0.012]} r={0.01}>{M.wood({ base: [150, 112, 72] })}</RBox>
      <mesh position={[-0.64, 0, 0.03]}><sphereGeometry args={[0.014, 12, 10]} />{M.brass()}</mesh>
    </group>
  </>;
}}</Scene3D>;

// 20:45 · EL REPASO DE LOS SIETE: el estante largo con las siete cosas (de los cajones del principio); a medida que Gary las nombra, cada una
// recibe su X roja. Parte 0 = las tres primeras, parte 1 = la cámara corre a las cuatro últimas.
export const HRecap7: React.FC<{ t: number; h: H }> = ({ t, h }) => {
  const P = h.part ?? 0, mk: number[] = h.marks ?? [], off = P ? 3 : 0;
  return <Scene3D t={t} h={h} mode={P ? "split" : "wipe"} floor="dark" wall="wood" bg="#0f0d0b"
    cam={P ? { at: [0.4, 0.24, 0], at1: [0.5, 0.24, 0], az: [-0.1, 0.08], el: [0.2, 0.16], r: [1.45, 1.35], fov: 34 } : { at: [-0.6, 0.24, 0], at1: [-0.48, 0.24, 0], az: [-0.12, 0.08], el: [0.2, 0.16], r: [1.3, 1.22], fov: 34 }}>{(tt) => <>
    <mesh position={[0, 0.06, 0]}><boxGeometry args={[2.2, 0.03, 0.34]} />{M.wood({ base: [120, 84, 50] })}</mesh>
    {Array.from({ length: 7 }, (_, i) => { const x = -0.9 + i * 0.3, at = i < off ? -1 : mk[i - off], k = at === undefined ? 0 : at < 0 ? 1 : cl((t - at - 0.2) / 0.35);
      return <group key={i} position={[x, 0.075, 0]}>
        <group scale={2.2}>{mini(i, tt)}</group>
        <Mark k={k} p={[0, 0.12, 0.14]} s={1.0} />
        <Txt3 txt={String(i + 1)} w={0.08} h={0.07} col="#f2c21b" glow p={[0, -0.04, 0.18]} />
      </group>; })}
    <Txt3 txt="7 NEVERS" w={0.5} h={0.1} col="#f7f4ee" bg="#b3221b" p={[P ? 0.45 : -0.6, 0.5, -0.12]} op={cl((tt - 0.5) / 0.3)} />
  </>}</Scene3D>;
};
