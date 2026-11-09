// gary8pa · componentes únicos 2/2 (min 10-22): ráfagas, el 40, el frío, los errores, el 12,2, la cinta y el cierre. Render SÓLO en el farm.
import React from "react";
import { H, cl, eio, phys } from "./hkit";
import { M, RBox, Scene3D, lerp, tubeG } from "./h3d";
import { Fridge, PI, Thermo, Txt3, pop, roll } from "./gk";
import { CarBat, Inv } from "./gh8a";
import { Puffs } from "./ghx";

const z1 = (k: number) => Math.max(0.001, k);
const AMB = "#ffb547", GRN = "#6fe39a", RED = "#ff5a4a", INK = "#0e1013", CRM = "#f7f4ee", ICE = "#8fd0ff";

// 10:14 · LA MAREA DE FRÍO: heladera de vidrio con nivel azul; baja sola con todo apagado y sube sólo durante las dos ráfagas.
export const HTide: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark" bg="#0c0f14"
  cam={{ at: [0.15, 0.46, 0], az: [-0.26, 0.04], el: [0.12, 0.09], r: [1.95, 1.7], fov: 32 }}>{(tt) => {
  const b1 = eio(tt, 1.6, 2.4), b2 = eio(tt, 3.8, 4.6), lvl = 0.86 - 0.18 * eio(tt, 0.5, 1.6) + 0.18 * b1 - 0.18 * eio(tt, 2.5, 3.8) + 0.18 * b2;
  const burst = (tt > 1.6 && tt < 2.45) || (tt > 3.8 && tt < 4.65) ? 1 : 0, c1 = 1 - b1, c2 = 1 - b2;
  return <>
    <group position={[-0.45, 0, 0]}>
      <mesh position={[0, 0.5, 0]}><boxGeometry args={[0.58, 1.0, 0.46]} />{M.glass({ op: 0.2 })}</mesh>
      <mesh position={[0, 0.02 + 0.48 * lvl, 0]} scale={[1, z1(lvl), 1]}><boxGeometry args={[0.55, 0.96, 0.43]} /><meshStandardMaterial color={ICE} emissive="#4aa8f0" emissiveIntensity={0.55} transparent opacity={0.72} /></mesh>
      <mesh position={[0, 0.63, 0.24]}><boxGeometry args={[0.66, 0.012, 0.012]} />{M.glow({ col: RED })}</mesh>
      <Txt3 txt="FORTY" w={0.26} h={0.07} col={RED} glow p={[0.46, 0.63, 0.2]} />
      <Txt3 txt={burst ? "BURST" : "OFF"} w={0.3} h={0.1} col={burst ? "#ffd25a" : "#9aa0a6"} glow p={[0, 1.12, 0]} />
    </group>
    {[{ c: c1, x: 0.34 }, { c: c2, x: 0.76 }].map((q, i) => <group key={i} position={[q.x, 0, 0.02]}>
      <mesh position={[0, 0.2 * q.c, 0]} scale={[1, z1(q.c), 1]}><boxGeometry args={[0.32, 0.4, 0.28]} /><meshStandardMaterial color={AMB} emissive={AMB} emissiveIntensity={0.55} /></mesh>
      <Txt3 txt="150 WH" w={0.3} h={0.08} col={INK} p={[0, 0.24 * Math.max(0.2, q.c), 0.145]} op={cl(q.c * 2.5)} />
    </group>)}
    <Txt3 txt="TWO BURSTS" w={0.62} h={0.11} col={INK} bg={GRN} p={[0.42, 0.72, 0]} s={pop(tt, 4.9)} op={cl((tt - 4.8) / 0.2)} />
  </>;
}}</Scene3D>;

// 11:08 · EL TERMÓMETRO MANDA: el líquido sube y se queda bajo la raya; una corona cae y se le apoya arriba.
export const HBoss: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" bg="#0e0d0c"
  cam={{ at: [0, 0.68, 0], az: [0.18, -0.16], el: [0.03, 0.06], r: [1.7, 1.42], fov: 32 }}>{(tt) => {
  const q = eio(tt, 0.6, 2.4), cr = phys(tt, 3.3, 7, 0.45), d = cl((tt - 2.4) / 0.3);
  return <>
    <Thermo k={0.62 * q + 0.05} s={3.4} p={[0, 0, 0]} />
    <mesh position={[0, 0.91, 0]}><boxGeometry args={[0.46, 0.012, 0.012]} />{M.glow({ col: RED })}</mesh>
    <Txt3 txt="40°F" w={0.3} h={0.12} col={RED} glow p={[0.42, 0.92, 0]} op={d} />
    <group position={[0, 1.15 + 1.1 * (1 - cr), 0]} rotation={[0, 0.4, 0.1 * (1 - cl(cr))]}>
      <mesh><cylinderGeometry args={[0.1, 0.085, 0.07, 8, 1, true]} />{M.brass({ col: "#e0ad3a" })}</mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[Math.cos(i / 8 * 2 * PI) * 0.1, 0.06, Math.sin(i / 8 * 2 * PI) * 0.1]}><coneGeometry args={[0.02, 0.06, 6]} />{M.brass({ col: "#e0ad3a" })}</mesh>)}
    </group>
    <Txt3 txt="THE BOSS" w={0.5} h={0.12} col={INK} bg={AMB} p={[-0.48, 0.5, 0.05]} s={pop(tt, 4.2)} op={cl((tt - 4.1) / 0.2)} />
  </>;
}}</Scene3D>;

// 11:44 · EL FRÍO COME: tres baterías en fila; la escarcha les trepa de izquierda a derecha y el número de cada una baja.
export const HFrost: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" bg="#0c1016"
  cam={{ at: [0, 0.32, 0], az: [-0.08, 0.08], el: [0.2, 0.14], r: [2.15, 1.86], fov: 32 }}>{(tt) => {
  const B = [{ x: -0.72, p: 100, tp: "70°F", a: 0.6 }, { x: 0, p: 66, tp: "32°F", a: 1.7 }, { x: 0.72, p: 40, tp: "0°F", a: 2.9 }];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[8, 5]} /><meshStandardMaterial color="#dbe4ef" roughness={0.9} /></mesh>
    {B.map((b, i) => { const k = eio(tt, b.a, b.a + 1.0), lv = lerp(1, b.p / 100, k), fr = i * 0.5 * k;
      return <group key={b.x} position={[b.x, 0.002, 0]}>
        <CarBat s={0.95} glass lvl={lv} />
        <mesh position={[0, 0.16, 0]} scale={[1, 1, 1]}><boxGeometry args={[0.49, 0.31, 0.25]} /><meshStandardMaterial color="#e8f4ff" transparent opacity={0.5 * fr} depthWrite={false} roughness={0.6} /></mesh>
        <Txt3 txt={b.tp} w={0.26} h={0.1} col={i ? ICE : "#ffd25a"} glow p={[0, 0.56, 0]} op={cl((tt - b.a) / 0.3)} />
        <Txt3 txt={`${roll(tt, b.a, b.a + 1.0, 100, b.p)}%`} w={0.3} h={0.11} col={INK} bg="#f4f1e8" p={[0, 0.03, 0.26]} r={[-1.0, 0, 0]} op={cl((tt - b.a) / 0.3)} />
      </group>; })}
    <Txt3 txt="COLD EATS CRANKING" w={0.92} h={0.11} col={INK} bg={ICE} p={[0, 0.84, 0]} s={pop(tt, 4.7)} op={cl((tt - 4.6) / 0.2)} />
  </>;
}}</Scene3D>;

// 12:21 · LA LÁPIDA: el inversor suena (aros que salen); de la nieve sube una lápida con 10.5 V: la alarma llegó tarde.
export const HTomb: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#10141c"
  cam={{ at: [0, 0.32, 0], az: [-0.22, 0.04], el: [0.14, 0.1], r: [1.7, 1.46], fov: 34 }}>{(tt) => {
  const up = phys(tt, 2.2, 4.8, 0.62), beep = tt < 3.2;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[8, 5]} /><meshStandardMaterial color="#d8e0ea" roughness={0.9} /></mesh>
    <Inv p={[-0.58, 0, 0.05]} s={1.1} led={RED} />
    {[0, 1, 2].map((i) => { const u = ((tt * 0.9 + i / 3) % 1); return <mesh key={i} position={[-0.58, 0.14, 0.2]} scale={z1(0.12 + 0.55 * u)}><torusGeometry args={[1, 0.012, 8, 48]} /><meshBasicMaterial color={RED} transparent opacity={(beep ? 0.75 : 0) * (1 - u)} depthWrite={false} /></mesh>; })}
    <group position={[0.3, -0.6 + 0.6 * up, 0]}>
      <RBox s={[0.54, 0.62, 0.11]} p={[0, 0.3, 0]} r={0.05}>{M.matte({ col: "#7d8288" })}</RBox>
      <mesh position={[0, 0.62, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.27, 0.27, 0.11, 44, 1, false, PI / 2, PI]} />{M.matte({ col: "#7d8288" })}</mesh>
      <Txt3 txt="10.5 V" w={0.4} h={0.14} col="#191b1f" p={[0, 0.42, 0.058]} />
      <Txt3 txt="R.I.P." w={0.26} h={0.08} col="#191b1f" p={[0, 0.66, 0.058]} />
    </group>
    <Txt3 txt="NOT A WARNING" w={0.7} h={0.11} col={INK} bg={RED} p={[-0.1, 0.03, 0.66]} r={[-1.15, 0, 0]} s={pop(tt, 4.5)} op={cl((tt - 4.4) / 0.2)} />
  </>;
}}</Scene3D>;

// 13:22 · RELOJ DE ARENA: la estufa encendida y un reloj de arena que se vacía a chorro: 300 WH en diez minutos.
export const HSandrun: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#0e0d0c"
  cam={{ at: [0.05, 0.42, 0], az: [0.26, -0.08], el: [0.1, 0.08], r: [1.7, 1.45], fov: 32 }}>{(tt) => {
  const k = eio(tt, 0.9, 4.2);
  return <>
    <group position={[-0.5, 0, 0]}>
      <RBox s={[0.4, 0.52, 0.14]} p={[0, 0.28, 0]} r={0.02}>{M.steel({ col: "#5e6268" })}</RBox>
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0, 0.12 + i * 0.08, 0.073]}><boxGeometry args={[0.32, 0.018, 0.006]} /><meshStandardMaterial color="#401" emissive="#ff5a1a" emissiveIntensity={0.4 + 2.2 * cl(tt - 0.5)} toneMapped={false} /></mesh>)}
      <pointLight position={[0, 0.3, 0.3]} intensity={2.4 * cl(tt - 0.5)} distance={1.5} color="#ff7a3a" />
      <Txt3 txt="140 AMPS" w={0.44} h={0.1} col={RED} glow p={[0, 0.68, 0]} op={cl((tt - 0.8) / 0.3)} />
    </group>
    <group position={[0.34, 0, 0]}>
      {[0.02, 0.86].map((y) => <mesh key={y} position={[0, y, 0]}><cylinderGeometry args={[0.24, 0.24, 0.04, 32]} />{M.wood({ base: [130, 88, 52] })}</mesh>)}
      <mesh position={[0, 0.64, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.2, 0.42, 36, 1, true]} />{M.glass({ op: 0.22 })}</mesh>
      <mesh position={[0, 0.24, 0]}><coneGeometry args={[0.2, 0.42, 36, 1, true]} />{M.glass({ op: 0.22 })}</mesh>
      <mesh position={[0, 0.44 + 0.2 * (1 - k) * 0.72 + 0.06 * k, 0]} rotation={[PI, 0, 0]} scale={z1(0.98 * (1 - k * 0.92))}><coneGeometry args={[0.17, 0.32, 32]} /><meshStandardMaterial color={AMB} emissive={AMB} emissiveIntensity={0.4} /></mesh>
      <mesh position={[0, 0.045 + 0.13 * k / 2, 0]} scale={z1(k)}><coneGeometry args={[0.17, 0.2, 32]} /><meshStandardMaterial color={AMB} emissive={AMB} emissiveIntensity={0.4} /></mesh>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.008, 0.008, 0.26, 8]} /><meshBasicMaterial color="#ffd27a" transparent opacity={k < 0.98 && tt > 0.9 ? 0.95 : 0} depthWrite={false} /></mesh>
      <Txt3 txt={`${roll(tt, 0.9, 4.2, 300, 0)} WH`} w={0.4} h={0.1} col="#ffd25a" glow p={[0, 0.56, 0.3]} />
    </group>
    <Txt3 txt="TEN MINUTES" w={0.62} h={0.11} col={INK} bg={RED} p={[-0.05, 0.03, 0.56]} r={[-1.05, 0, 0]} s={pop(tt, 4.4)} op={cl((tt - 4.3) / 0.2)} />
  </>;
}}</Scene3D>;

// 15:22 · LA ESCALERA DE LOS VOLTIOS: el tester baja peldaño por peldaño; en 12.2 una cinta roja le corta el paso.
export const HLadder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" bg="#0e0f12"
  cam={{ at: [0.05, 0.62, 0], az: [-0.2, 0.12], el: [0.03, 0.06], r: [1.95, 1.65], fov: 32 }}>{(tt) => {
  const R = [{ v: "12.7", l: "FULL", y: 1.08 }, { v: "12.4", l: "THREE QUARTERS", y: 0.72 }, { v: "12.2", l: "HALF", y: 0.36 }];
  const stp = eio(tt, 0.8, 1.5) * 1 + eio(tt, 1.8, 2.5) * 1 + eio(tt, 2.8, 3.5) * 1, tb = eio(tt, 3.6, 4.1);
  const y = stp <= 1 ? lerp(R[0].y, R[0].y, 0) : stp <= 2 ? lerp(R[0].y, R[1].y, stp - 1) : lerp(R[1].y, R[2].y, stp - 2);
  const lit = (i: number) => (stp >= i + 1 ? 1 : 0.15);
  return <>
    {[-0.42, 0.42].map((x) => <mesh key={x} position={[x, 0.7, 0]}><boxGeometry args={[0.045, 1.4, 0.05]} />{M.wood({ base: [186, 146, 96] })}</mesh>)}
    {R.map((r, i) => <group key={r.v} position={[0, r.y, 0]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.02, 0.02, 0.82, 12]} />{M.wood({ base: [170, 130, 84] })}</mesh>
      <Txt3 txt={r.v} w={0.3} h={0.12} col={i === 2 ? "#ffd25a" : CRM} glow p={[0.72, 0.03, 0.02]} op={0.4 + 0.6 * lit(i)} />
      <Txt3 txt={r.l} w={0.42} h={0.06} col="#c8ccd2" p={[0.76, -0.07, 0.02]} op={lit(i)} />
    </group>)}
    <group position={[0, y + 0.11, 0.05]}>
      <RBox s={[0.2, 0.29, 0.06]} r={0.02}>{M.plastic({ col: "#f2c21b" })}</RBox>
      <mesh position={[0, 0.07, 0.031]}><planeGeometry args={[0.15, 0.09]} /><meshStandardMaterial color="#a9c3a2" emissive="#9fd39a" emissiveIntensity={0.35} /></mesh>
      <mesh position={[0, -0.06, 0.04]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.02, 24]} />{M.matte({ col: "#222428" })}</mesh>
    </group>
    <group position={[0, R[2].y - 0.17, 0.08]} scale={[z1(tb), 1, 1]}>
      <mesh><boxGeometry args={[1.02, 0.12, 0.012]} /><meshStandardMaterial color="#d8361f" roughness={0.6} /></mesh>
      <Txt3 txt="STOP HERE" w={0.42} h={0.08} col={CRM} p={[0, 0, 0.008]} op={cl((tt - 4.0) / 0.2)} />
    </group>
  </>;
}}</Scene3D>;

// 16:04 · LA CINTA EN LA PUERTA: la cinta se desenrolla sobre la heladera y las seis horas se escriben una por una, con su acción.
export const HTape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#e7e6df"
  cam={{ at: [0, 0.02, 0], az: [-0.08, 0.06], el: [0.03, 0.02], r: [1.6, 1.5], fov: 32 }}>{(tt) => {
  const un = eio(tt, 0.32, 0.95), S = [["9", "SHUT"], ["12", "CHECK"], ["1", "OFF"], ["4", "RUN"], ["5", "OFF"], ["8", "DONE"]], run = (i: number) => i === 1 || i === 3;
  return <>
    <mesh position={[0, 0, -0.03]}><planeGeometry args={[6, 4]} /><meshStandardMaterial color="#eef0ee" roughness={0.55} /></mesh>
    <mesh position={[1.06, 0.05, -0.02]}><boxGeometry args={[0.03, 1.6, 0.05]} />{M.steel()}</mesh>
    <mesh position={[-1.0 + 0.96 * un, 0, 0]} scale={[z1(un), 1, 1]}><boxGeometry args={[1.92, 0.46, 0.006]} /><meshStandardMaterial color="#d9c48a" roughness={0.75} /></mesh>
    {S.map(([a, b], i) => { const at = 1.0 + i * 0.62, x = -0.8 + i * 0.32; return <group key={i} position={[x, 0, 0.008]}>
      <Txt3 txt={a} w={0.22} h={0.2} col={run(i) ? "#b3221b" : "#1b1d21"} p={[0, 0.08, 0]} font="Caveat, Arial" op={cl((tt - at) / 0.2)} s={0.7 + 0.3 * cl((tt - at) / 0.2)} />
      <Txt3 txt={b} w={0.26} h={0.08} col="#1b1d21" p={[0, -0.13, 0]} op={cl((tt - at - 0.1) / 0.2)} />
    </group>; })}
    <Txt3 txt="AFTER NINE AT NIGHT" w={0.96} h={0.11} col={CRM} bg="#1b1d21" p={[0, 0.5, 0.01]} s={pop(tt, 4.9)} op={cl((tt - 4.8) / 0.2)} />
  </>;
}}</Scene3D>;

// 18:42 · EL SUBIBAJA DE WALT: US$ 400 de equipo de un lado y el fusible de US$ 4 del otro; pesa más el fusible.
export const HSeesaw: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#0e0d0c"
  cam={{ at: [0, 0.34, 0], az: [-0.12, 0.1], el: [0.14, 0.1], r: [2.0, 1.72], fov: 32 }}>{(tt) => {
  const land = phys(tt, 2.2, 3.2, 0.34), a = lerp(0.2, -0.2, cl(land)), f = phys(tt, 2.0, 7, 0.5);
  const L = 0.86;
  return <>
    <mesh position={[0, 0.16, 0]} rotation={[0, PI / 4, 0]}><coneGeometry args={[0.2, 0.32, 4]} />{M.steel({ col: "#50545a" })}</mesh>
    <group position={[0, 0.33, 0]} rotation={[0, 0, a]}>
      <RBox s={[1.9, 0.04, 0.32]} r={0.012}>{M.wood({ base: [176, 132, 86] })}</RBox>
      <group position={[-L + 0.14, 0.02, 0]}>
        <Inv s={0.9} />
        <CarBat p={[0.0, 0.14, 0]} s={0.5} />
        <Txt3 txt="$400" w={0.32} h={0.12} col="#ffd25a" glow p={[0, 0.5, 0]} />
      </group>
      <group position={[L - 0.1, 0.02 + 0.8 * (1 - f), 0]} scale={z1(cl(f * 3))}>
        <RBox s={[0.16, 0.08, 0.09]} p={[0, 0.04, 0]} r={0.012}>{M.plastic({ col: "#d8361f" })}</RBox>
        <Txt3 txt="$4 FUSE" w={0.4} h={0.12} col={GRN} glow p={[0, 0.26, 0]} />
      </group>
    </group>
    <Txt3 txt="THE PART THAT PROTECTS" w={1.05} h={0.11} col={INK} bg={GRN} p={[0, 0.03, 0.58]} r={[-1.1, 0, 0]} s={pop(tt, 4.6)} op={cl((tt - 4.5) / 0.2)} />
  </>;
}}</Scene3D>;

// 19:44 · LA MANGUERA: del caño de escape sale la manguera con su abrazadera; la abrazadera se afloja, se abre una raja y el gas se va por ahí.
export const HHose: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark" bg="#0e0f12"
  cam={{ at: [0.08, 0.28, 0], az: [-0.2, 0.08], el: [0.26, 0.18], r: [1.5, 1.28], fov: 32 }}>{(tt) => {
  const sl = eio(tt, 1.1, 1.8), cr = cl((tt - 2.3) / 0.2);
  return <>
    <mesh position={[-0.76, 0.3, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.055, 0.055, 0.5, 28]} />{M.steel({ col: "#7a7f86" })}</mesh>
    <mesh geometry={tubeG("hose8", [[-0.5, 0.3, 0], [-0.1, 0.32, 0.05], [0.4, 0.22, 0], [1.0, 0.25, -0.2]], 0.075, 60, 16)} castShadow>{M.rubber({ col: "#3a3d42" })}</mesh>
    <mesh position={[-0.46 + 0.12 * sl, 0.3 - 0.02 * sl, 0]} rotation={[0, PI / 2, 0.3 * sl]}><torusGeometry args={[0.085, 0.012, 10, 36]} />{M.chrome()}</mesh>
    {cr > 0 && <mesh position={[0.2, 0.3, 0.065]} rotation={[0, 0, 0.35]} scale={[1, z1(cr), 1]}><boxGeometry args={[0.18, 0.012, 0.012]} /><meshBasicMaterial color="#090909" /></mesh>}
    <Puffs tt={tt} p={[-0.42, 0.36, 0.06]} n={5} per={1.3} dir={[0.05, 0.42, 0.1]} op={0.55 * sl} s={1.1} />
    <Puffs tt={tt + 0.4} p={[0.2, 0.34, 0.09]} n={5} per={1.2} dir={[-0.1, 0.44, 0.1]} op={0.55 * cr} s={1.1} />
    <Txt3 txt="CLAMP LOOSENS" w={0.58} h={0.09} col="#ffd25a" glow p={[-0.48, 0.74, 0]} op={cl((tt - 1.5) / 0.3)} />
    <Txt3 txt="HOSE CRACKS" w={0.52} h={0.09} col={RED} glow p={[0.32, 0.74, 0]} op={cl((tt - 2.6) / 0.3)} />
    <Txt3 txt="KEEP IT OUTSIDE" w={0.82} h={0.11} col={INK} bg={AMB} p={[0, 0.03, 0.62]} r={[-1.05, 0, 0]} s={pop(tt, 4.3)} op={cl((tt - 4.2) / 0.2)} />
  </>;
}}</Scene3D>;

// 20:32 · EL PODIO: tres cajas suben a sus pedestales; cuanto más utilizable, más alto. La de auto se queda abajo: es la goma de auxilio.
export const HPodium: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" bg="#0f0e0c"
  cam={{ at: [0.05, 0.42, 0], az: [0.12, -0.1], el: [0.14, 0.1], r: [2.1, 1.8], fov: 32 }}>{(tt) => {
  const B = [{ x: -0.74, n: 300, hrs: "4 HOURS", pe: 0.1, a: 0.6, col: "#17181b", t: "CAR" }, { x: 0, n: 600, hrs: "8 HOURS", pe: 0.3, a: 1.7, col: "#2b6fd6", t: "DEEP CYCLE" }, { x: 0.74, n: 1000, hrs: "14 HOURS", pe: 0.56, a: 2.9, col: "#7a7f86", t: "LITHIUM" }];
  return <>{B.map((b) => { const k = phys(tt, b.a, 4.6, 0.58);
    return <group key={b.x} position={[b.x, 0, 0]}>
      <mesh position={[0, b.pe * cl(k) / 2 + 0.001, 0]} scale={[1, z1(cl(k)), 1]}><boxGeometry args={[0.52, b.pe, 0.4]} />{M.wood({ base: [150, 108, 66] })}</mesh>
      <group position={[0, b.pe * cl(k), 0]}>
        <RBox s={[0.42, 0.26, 0.22]} p={[0, 0.13, 0]} r={0.02}>{M.plastic({ col: b.col })}</RBox>
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.13, 0.28, 0.04]}><cylinderGeometry args={[0.02, 0.024, 0.04, 16]} />{M.steel({ col: "#a8acae" })}</mesh>)}
        <Txt3 txt={b.t} w={0.34} h={0.07} col={CRM} p={[0, 0.14, 0.112]} />
        <Txt3 txt={`${roll(tt, b.a, b.a + 0.7, 0, b.n)} WH`} w={0.4} h={0.1} col="#ffd25a" glow p={[0, 0.44, 0]} op={cl((tt - b.a) / 0.3)} />
        <Txt3 txt={b.hrs} w={0.36} h={0.075} col={GRN} glow p={[0, 0.56, 0]} op={cl((tt - b.a - 0.5) / 0.3)} />
      </group>
    </group>; })}
  </>;
}}</Scene3D>;

// 21:18 · LOS IMANES: la puerta de la heladera; caen siete imanes con lo que hay que recordar, uno por cada frase del repaso.
export const HMagnets: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#e9e8e1"
  cam={{ at: [0, 0, 0], az: [-0.1, 0.1], el: [0.04, 0.02], r: [1.75, 1.62], fov: 32 }}>{(tt) => {
  const I = [{ t: "300 WH", c: "#2b6fd6" }, { t: "-15%", c: "#e5761c" }, { t: "57 W", c: "#2f9a55" }, { t: "1000 W", c: "#d8361f" }, { t: "2 BURSTS", c: "#1b1d21" }, { t: "12.2 V", c: "#b3221b" }, { t: "40°F", c: "#2b6fd6" }];
  return <>
    <mesh position={[0, 0, -0.02]}><planeGeometry args={[6, 4]} /><meshStandardMaterial color="#f2f3f1" roughness={0.5} /></mesh>
    <mesh position={[1.1, 0, 0]}><boxGeometry args={[0.03, 1.5, 0.05]} />{M.steel()}</mesh>
    {I.map((m, i) => { const at = 0.34 + i * 0.68, k = phys(tt, at, 7, 0.46), x = -0.68 + (i % 4) * 0.46 + (i > 3 ? 0.22 : 0), y = i > 3 ? -0.22 : 0.26;
      return <group key={m.t} position={[x, y + 0.5 * (1 - k), 0.012]} scale={z1(cl(k * 3))} rotation={[0, 0, -0.05 + (i % 3) * 0.05]}>
        <RBox s={[0.4, 0.2, 0.024]} r={0.02}>{M.plastic({ col: m.c })}</RBox>
        <Txt3 txt={m.t} w={0.34} h={0.11} col={CRM} p={[0, 0, 0.0135]} />
      </group>; })}
  </>;
}}</Scene3D>;

// 17:58 · TRES INSTRUMENTOS: el tester, el termómetro y una mano sobre el cable; se enciende uno por vez.
export const HThreeChecks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="dark" bg="#0e0e11"
  cam={{ at: [0, 0.3, 0], az: [-0.12, 0.1], el: [0.18, 0.12], r: [1.95, 1.65], fov: 32 }}>{(tt) => {
  const K = [0.7, 2.0, 3.3].map((a) => eio(tt, a, a + 0.5));
  return <>
    <group position={[-0.7, 0, 0]} scale={1 + 0.14 * K[0]}>
      <RBox s={[0.22, 0.34, 0.06]} p={[0, 0.17, 0]} r={0.02}>{M.plastic({ col: "#f2c21b" })}</RBox>
      <mesh position={[0, 0.25, 0.031]}><planeGeometry args={[0.16, 0.1]} /><meshStandardMaterial color="#a9c3a2" emissive="#9fd39a" emissiveIntensity={0.25 + 0.7 * K[0]} /></mesh>
      <Txt3 txt="12.4" w={0.13} h={0.07} col="#14231a" p={[0, 0.25, 0.032]} font="Courier New" />
      <pointLight position={[0, 0.5, 0.35]} intensity={2.1 * K[0]} distance={1.2} color="#ffe4b0" />
    </group>
    <group position={[0, 0, 0]} scale={1 + 0.14 * K[1]}>
      <Thermo k={0.55} s={1.5} />
      <pointLight position={[0, 0.5, 0.35]} intensity={2.1 * K[1]} distance={1.2} color="#ffe4b0" />
    </group>
    <group position={[0.7, 0, 0]} scale={1 + 0.14 * K[2]}>
      <mesh geometry={tubeG("cbl3", [[-0.34, 0.08, 0], [0, 0.06, 0.03], [0.34, 0.08, 0]], 0.028, 40, 12)}>{M.rubber({ col: "#2c2e32" })}</mesh>
      <group position={[0, 0.14 + 0.25 * (1 - K[2]), 0.03]}>
        <RBox s={[0.17, 0.09, 0.2]} p={[0, 0, 0]} r={0.04}>{M.matte({ col: "#c9987a" })}</RBox>
        <mesh position={[0.05, 0.28, -0.42]} rotation={[0.95, 0, -0.12]}><cylinderGeometry args={[0.07, 0.085, 0.85, 18]} />{M.matte({ col: "#2d4f86" })}</mesh>
        {[-0.06, -0.02, 0.02, 0.06].map((x) => <RBox key={x} s={[0.034, 0.05, 0.14]} p={[x, -0.02, 0.16]} r={0.015}>{M.matte({ col: "#c9987a" })}</RBox>)}
      </group>
      <pointLight position={[0, 0.5, 0.35]} intensity={2.1 * K[2]} distance={1.2} color="#ffe4b0" />
    </group>
    {["METER", "THERMOMETER", "HAND"].map((l, i) => <Txt3 key={l} txt={l} w={0.5} h={0.09} col={CRM} glow p={[-0.7 + i * 0.7, 0.68, 0]} op={K[i]} />)}
    <Txt3 txt="NEVER JUST ONE" w={0.76} h={0.11} col={INK} bg={AMB} p={[0, 0.03, 0.56]} r={[-1.1, 0, 0]} s={pop(tt, 4.7)} op={cl((tt - 4.6) / 0.2)} />
  </>;
}}</Scene3D>;

// 13:52 · LA LUCECITA QUE CHUPA: una luz verde chiquita, con un tubito que le saca gotas a la batería toda la noche.
export const HSip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" bg="#090b0d"
  cam={{ at: [0.1, 0.22, 0], az: [-0.18, 0.16], el: [0.2, 0.14], r: [1.5, 1.28], fov: 32 }}>{(tt) => {
  const k = eio(tt, 0.8, 4.3), lv = lerp(0.5, 0.385, k);
  return <>
    <CarBat p={[-0.42, 0, 0]} s={1.05} glass lvl={lv} />
    <Inv p={[0.5, 0, 0]} s={1.15} />
    <mesh geometry={tubeG("sipt", [[-0.3, 0.14, 0.08], [0.0, 0.3, 0.14], [0.3, 0.12, 0.14]], 0.011, 40, 10)}>{M.glass({ op: 0.35 })}</mesh>
    {Array.from({ length: 7 }, (_, i) => { const u = (tt * 0.55 + i / 7) % 1, x = lerp(-0.3, 0.3, u), y = 0.14 + 0.17 * Math.sin(PI * u) - 0.02 * u; return <mesh key={i} position={[x, y, lerp(0.08, 0.14, Math.min(1, u * 2))]}><sphereGeometry args={[0.012, 12, 10]} /><meshStandardMaterial color={AMB} emissive={AMB} emissiveIntensity={1.1} /></mesh>; })}
    <Txt3 txt={`${roll(tt, 0.8, 4.3, 0, 70)} WH GONE`} w={0.62} h={0.11} col="#ffd25a" glow p={[0, 0.66, 0]} />
    <Txt3 txt="TURN IT OFF" w={0.56} h={0.11} col={INK} bg={GRN} p={[0.1, 0.03, 0.56]} r={[-1.1, 0, 0]} s={pop(tt, 4.6)} op={cl((tt - 4.5) / 0.2)} />
  </>;
}}</Scene3D>;
