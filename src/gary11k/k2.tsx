// gary11k · componentes únicos 2/3 (8:30 → 20:40): la goma con cada pieza en su hueco, el abanico del infrarrojo, el imán que se
// separa, los 4 botones, la fuerza sobre la cuña, la lata de Walt, el pin que sale, las 3 columnas, la tarde en orden, el mapa de
// los 6 lugares, el palo en el riel, la cuerda roja del portón, los motores afuera, mirar el tablero sin tocar. Render SÓLO en el farm.
import React from "react";
import { Cap, Mist } from "./caps";
import { H, cl, eio } from "./hkit";
import { M, RBox, Scene3D, lerp, tubeG } from "./h3d";
import { Mark, PI, Txt3, pop, roll } from "./gk";
import { AMB, BLU, CRM, Cam, Case, DoorAl, DoorF, Fob, GRN, INK, Led, MiniHouse, Pir, RED, Trip, V, Waves, Wedge, YEL, z1 } from "./kparts";

type P = { t: number; h: H };
const lab = (tt: number, at: number, txt: string, w: number, p: V, col = INK, bg: string | undefined = AMB) => <Txt3 txt={txt} w={w} h={w * 0.15} col={col} bg={bg} p={p} r={[-1.05, 0, 0]} s={pop(tt, at)} op={cl((tt - at + 0.1) / 0.2)} />;

// 8:31 · CADA PIEZA EN SU HUECO: la valija abierta; las piezas salen flotando de la goma de a una, con su cantidad, y vuelven a su lugar.
export const HFoamCase: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile" bg="#0e0f12"
  cam={{ at: [0, 0.2, 0], az: [-0.1, 0.1], el: [0.75, 0.62], r: [1.5, 1.3], fov: 30 }}>{(tt) => {
  const up = eio(tt, 0.8, 1.6) * (1 - eio(tt, 3.8, 4.5));
  return <>
    <Case s={1.4} op={eio(tt, 0.1, 0.7)} lift={up} arm={cl((tt - 4.5) / 0.3)} />
    {[["2 MOTION", -0.3, -0.15], ["4 DOOR/WINDOW", 0.1, -0.15], ["2 REMOTES", -0.3, 0.18], ["WEDGE", 0.05, 0.16], ["TRIPWIRE", 0.32, 0.18]].map(([l, x, z], i) =>
      <Txt3 key={l as string} txt={l as string} w={0.3} h={0.055} col={INK} bg={YEL} p={[x as number, 0.5, z as number]} r={[-1.0, 0, 0]} s={pop(tt, 1.3 + i * 0.35) * up} />)}
  </>;
}}</Scene3D>;

// 8:43 · EL ABANICO DEL CALOR: el sensor arriba en la esquina abre sus franjas; una silueta tibia cruza las franjas y se encienden.
export const HPirFan: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={0.6} txt={"SEES BODY HEAT MOVING"} col={CRM} bg={"#31343c"} /></>} t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#0b0c10"
  cam={{ at: [-0.1, 0.35, -0.45], az: [0.18, 0.08], el: [0.95, 0.85], r: [2.7, 2.4], fov: 32 }}>{(tt) => {
  const px = lerp(1.0, -0.6, eio(tt, 1.2, 4.0)), SX = -0.85, SZ = -1.25, N = 7, step = PI / 2 / N;
  const phi = Math.atan2(-(0.1 - SZ), px - SX);   // ángulo de la persona en el plano local del abanico (y local = -z mundo)
  return <>
    <mesh position={[-0.9, 0.6, -0.6]}><boxGeometry args={[0.04, 1.2, 1.4]} />{M.matte({ col: "#cfc6b4" })}</mesh>
    <mesh position={[0, 0.6, -1.3]}><boxGeometry args={[1.8, 1.2, 0.04]} />{M.matte({ col: "#d8d0bf" })}</mesh>
    <Pir p={[SX, 1.1, SZ]} r={[0.5, 0.78, 0]} s={1.1} on={1} />
    {Array.from({ length: N }, (_, i) => { const a0 = -PI / 2 + i * step, hit = phi > a0 && phi < a0 + step && tt > 1.2;
      return <mesh key={i} position={[SX + 0.04, 0.015, SZ + 0.04]} rotation={[-PI / 2, 0, 0]} scale={z1(eio(tt, 0.3 + i * 0.08, 0.7 + i * 0.08))}>
        <circleGeometry args={[2.1, 6, a0 + step * 0.18, step * 0.64]} /><meshBasicMaterial color={hit ? RED : "#7ad0ff"} transparent opacity={hit ? 0.6 : 0.24} depthWrite={false} toneMapped={false} /></mesh>; })}
    <group position={[px, 0, 0.1]}><mesh position={[0, 0.45, 0]}><capsuleGeometry args={[0.1, 0.55, 8, 16]} /><meshStandardMaterial color="#ff8a4a" emissive="#ff5a1a" emissiveIntensity={0.9} transparent opacity={0.85} /></mesh>
      <mesh position={[0, 0.9, 0]}><sphereGeometry args={[0.09, 16, 12]} /><meshStandardMaterial color="#ff8a4a" emissive="#ff5a1a" emissiveIntensity={0.9} transparent opacity={0.85} /></mesh></group>
    <Txt3 txt="MOTION SENSOR" w={0.55} h={0.09} col={CRM} glow p={[-0.35, 1.3, -1.2]} op={cl((tt - 0.4) / 0.3)} />
  </>;
}}</Scene3D>;

// 9:34 · EL IMÁN QUE SE SEPARA: la puerta se abre, el imán se aleja de la pieza grande; pasa la marca y la pieza grita.
export const HMagnetGap: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={0.4} txt={"PEEL · STICK · DONE"} col={INK} bg={YEL} /></>} t={t} h={h} mode="split" floor="wood" wall="none" bg="#0f0d0b"
  cam={{ at: [0.0, 0.95, 0], az: [-0.35, -0.15], el: [0.12, 0.1], r: [1.6, 1.3], fov: 30 }}>{(tt) => {
  const op = eio(tt, 1.0, 3.0), gapM = op * 0.9, scream = cl((op - 0.08) * 10);
  return <>
    <DoorF p={[0, 0, 0]} open={op * 0.6} />
    <DoorAl p={[0.36, 1.2, 0.07]} s={1.4} gap={0} on={scream} />
    <group position={[0.36 + 0.09 - gapM * 0.15, 1.2, 0.07 + gapM * 0.6]}><RBox s={[0.04, 0.2, 0.04]} r={0.01}>{M.plastic({ col: "#f1efe8" })}</RBox></group>
    <Waves tt={tt} k={scream} p={[0.36, 0.98, 0.15]} s={0.55} />
    
    <Txt3 txt="MAGNET PULLS AWAY" w={0.62} h={0.08} col={CRM} p={[0.3, 1.6, 0.2]} op={cl((tt - 1.6) / 0.3)} />
  </>;
}}</Scene3D>;

// 9:46 · LOS CUATRO BOTONES: el control gigante de frente; cada botón se prende cuando lo nombra; el SOS late en rojo.
export const HFobSos: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.2} txt={"FROM YOUR BED"} col={CRM} bg={"#7a2a22"} /></>} t={t} h={h} mode="iris" floor="none" wall="wood" bg="#0d0c0b"
  cam={{ at: [0, 0.6, 0], az: [-0.18, 0.14], el: [0.05, 0.03], r: [1.45, 1.3], fov: 30 }}>{(tt) => {
  const lit = tt < 1.0 ? -1 : tt < 1.8 ? 0 : tt < 2.6 ? 1 : tt < 3.4 ? 2 : 3, sos = tt > 3.4 ? 0.6 + 0.4 * Math.sin(tt * 9) : 0;
  return <>
    <Fob p={[0, 0.6, 0]} s={2.6} lit={lit} sos={sos} />
    {["ARM", "DISARM", "HOME", "PANIC · SOS"].map((l, i) => <Txt3 key={l} txt={l} w={0.3} h={0.07} col={i === 3 ? RED : AMB} glow p={[i % 2 ? 0.42 : -0.42, i < 2 ? 0.75 : 0.5, 0]} op={cl((tt - 1.0 - i * 0.8) / 0.2)} />)}
    
  </>;
}}</Scene3D>;

// 10:33 · LA FUERZA SOBRE LA CUÑA: alguien empuja la puerta (flechas que crecen); la cuña se clava en el piso y el interruptor dispara.
export const HWedgeForce: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={2.4} txt={"HARDER TO OPEN + LOUD"} col={INK} bg={YEL} /></>} t={t} h={h} mode="drop" floor="wood" wall="none" bg="#0f0d0b"
  cam={{ at: [0.0, 0.25, 0.1], az: [1.1, 0.85], el: [0.22, 0.18], r: [1.7, 1.4], fov: 30 }}>{(tt) => {
  const push = eio(tt, 1.0, 2.0), on = cl((tt - 2.0) / 0.2);
  return <>
    <DoorF p={[0, 0, 0]} r={[0, PI / 2, 0]} open={-0.04 * push} />
    <Wedge p={[0.22, 0, 0.0]} r={[0, PI, 0]} s={1.5} on={on} />
    {[0.35, 0.8, 1.25].map((y, i) => <mesh key={i} position={[-0.35 + 0.08 * push, y, 0]} rotation={[0, 0, -PI / 2]} scale={z1(push)}><coneGeometry args={[0.06, 0.2, 12]} /><meshBasicMaterial color={RED} toneMapped={false} /></mesh>)}
    <Waves tt={tt} k={on} p={[0.25, 0.2, 0]} r={[0, PI / 2, 0]} s={1.1} />
    
  </>;
}}</Scene3D>;

// 11:06 · LA LATA DE WALT (1984): hilo de pescar a la altura de la rodilla en un obrador; una pierna lo engancha y la lata de café con tuercas cae.
export const HCoffeeCan: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={2.9} txt={"JUST MAKE IT LOUD"} col={INK} bg={AMB} /></>} t={t} h={h} mode="wipe" floor="dark" wall="none" bg="#090a0d"
  cam={{ at: [0.2, 0.3, 0], az: [-0.45, -0.25], el: [0.2, 0.15], r: [2.0, 1.7], fov: 32 }}>{(tt) => {
  const leg = lerp(-1.2, 0.0, eio(tt, 0.8, 1.8)), pull = eio(tt, 1.8, 2.1), fall = eio(tt, 2.1, 2.6);
  return <>
    {[-0.9, 0.9].map((x) => <mesh key={x} position={[x, 0.3, 0]}><boxGeometry args={[0.06, 0.6, 0.06]} />{M.wood({ base: [110, 84, 60] })}</mesh>)}
    <mesh geometry={tubeG("cfl" + Math.round(pull * 10), [[-0.9, 0.3, 0], [0, 0.3 - 0.05 * pull, 0.1 * pull], [0.9, 0.3, 0]], 0.003, 20, 5)}><meshBasicMaterial color="#e8e4d8" /></mesh>
    <group position={[0.95, 0.3 - 0.28 * fall, 0.05]} rotation={[0, 0, -1.5 * fall]}><mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.07, 0.07, 0.16, 24]} />{M.steel({ col: "#9a5a3a" })}</mesh></group>
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0.95 + 0.25 * fall * Math.cos(i), 0.02 + 0.1 * fall * Math.abs(Math.sin(i * 3)), 0.2 * fall * Math.sin(i)]} scale={z1(fall)}><cylinderGeometry args={[0.012, 0.02, 0.025, 6]} />{M.steel({ col: "#c9ced3" })}</mesh>)}
    <group position={[leg, 0, 0.05]}><mesh position={[0, 0.35, 0]}><capsuleGeometry args={[0.05, 0.6, 6, 12]} />{M.matte({ col: "#3a3f4e" })}</mesh></group>
    <Waves tt={tt} k={cl((tt - 2.4) / 0.2)} p={[0.95, 0.15, 0.2]} s={1.2} />
    {[[-0.4, -0.5], [0.3, -0.6]].map(([x, z], i) => <group key={i} position={[x, 0.1, z]}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.16, 24]} />{M.wood({ base: [150, 110, 70] })}</mesh><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.17, 24]} />{M.brass({ col: "#c06a30" })}</mesh></group>)}
    <Txt3 txt="1984" w={0.3} h={0.1} col={AMB} glow p={[-0.75, 0.75, 0]} />
    
  </>;
}}</Scene3D>;

// 11:48 · EL PIN QUE SALE: primerísimo plano del tripwire; el hilo se tensa, el pin se desliza fuera del cuerpo y arranca la sirena.
export const HPinPull: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={2.7} txt={"OLDEST TRICK THERE IS"} col={CRM} bg={"#3a3020"} /></>} t={t} h={h} mode="iris" floor="none" wall="wood" bg="#0d0c0b"
  cam={{ at: [0.25, 0.5, 0], az: [-0.3, 0.1], el: [0.08, 0.05], r: [1.0, 0.85], fov: 28 }}>{(tt) => {
  const pull = eio(tt, 1.6, 2.4), on = cl((tt - 2.3) / 0.2);
  return <>
    <Trip p={[0, 0.5, 0]} s={2.2} pull={pull} on={on} len={0.5} />
    <Waves tt={tt} k={on} p={[0, 0.5, 0.1]} s={0.42} />
    <Txt3 txt="PIN" w={0.16} h={0.07} col={AMB} glow p={[0.2 + 0.35 * pull, 0.32, 0.05]} op={cl((tt - 0.8) / 0.3)} />
    
  </>;
}}</Scene3D>;

// 12:18 · LAS TRES COLUMNAS: tres pilares iguales; cada fila (instalar, por mes, en un apagón largo, ruido) baja como un ladrillo con tilde o cruz.
export const HThreeCols: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark" bg="#0c0d10"
  cam={{ at: [0, 0.55, 0], az: [-0.06, 0.06], el: [0.1, 0.08], r: [2.6, 2.35], fov: 32 }}>{(tt) => {
  const R = [["$$$ TO INSTALL", "CHEAP", "$149 ONCE"], ["MONTHLY BILL", "MAYBE A PLAN", "NO BILL"], ["BLACKOUT: HOURS", "BLACKOUT: NO CLOUD", "BLACKOUT: WORKS"], ["CALLS SOMEBODY", "RECORDS VIDEO", "MAKES NOISE"]];
  const OK = [[0, 1, 1], [0, 1, 1], [0, 0, 1], [1, 1, 1]];
  return <>
    {["MONITORED", "CAMERAS", "BATTERY KIT"].map((c, j) => <group key={c} position={[-0.75 + j * 0.75, 0, 0]}>
      <Txt3 txt={c} w={0.6} h={0.09} col={j === 2 ? INK : CRM} bg={j === 2 ? YEL : "#2a2c31"} p={[0, 1.15, 0]} />
      {R.map((r, i) => { const a = 0.5 + i * 0.75 + j * 0.12, f = eio(tt, a, a + 0.35); return <group key={i} position={[0, 0.95 - i * 0.22 + 0.4 * (1 - f), 0]} scale={z1(f)}>
        <RBox s={[0.66, 0.18, 0.08]} r={0.02}>{M.matte({ col: j === 2 ? "#3a3020" : "#24262b" })}</RBox>
        <Txt3 txt={r[j]} w={0.5} h={0.065} col={CRM} p={[-0.04, 0, 0.042]} />
        <Mark ok={!!OK[i][j]} k={f} p={[0.27, 0, 0.05]} s={0.25} /></group>; })}
    </group>)}
  </>;
}}</Scene3D>;

// 13:54 · UNA TARDE, EN ORDEN: una casa de juguete; una línea punteada recorre 5 paradas numeradas y un cronómetro de 30 s aprieta cada pieza.
export const HAfternoon: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.4} txt={"ONE AFTERNOON"} col={INK} bg={YEL} /></>} t={t} h={h} mode="split" floor="wood" wall="none" bg="#0f0d0b"
  cam={{ at: [0, 0.2, 0], az: [0.3, -0.15], el: [0.9, 0.8], r: [2.3, 2.0], fov: 32 }}>{(tt) => {
  const S: [string, number, number][] = [["FRONT DOOR", -0.6, 0.35], ["DOORS + WINDOWS", -0.2, 0.0], ["HALLWAY", 0.2, -0.25], ["SIDE GATE", 0.75, 0.3], ["NIGHTSTAND", 0.45, -0.45]];
  const n = Math.floor(cl((tt - 0.4) / 3.8) * 5 + 0.001), sec = roll(tt, 0.6, 4.4, 0, 30);
  return <>
    <RBox s={[1.6, 0.04, 1.1]} p={[0, 0.02, 0]} r={0.02}>{M.matte({ col: "#d8cdb6" })}</RBox>
    {[[-0.8, 0, 0.04, 1.1], [0.8, 0, 0.04, 1.1], [0, -0.55, 1.6, 0.04], [0, 0.55, 1.6, 0.04], [0.0, 0.0, 0.04, 0.6]].map(([x, z, w, d], i) => <mesh key={i} position={[x, 0.1, z]}><boxGeometry args={[w, 0.16, d]} />{M.matte({ col: "#efe9dc" })}</mesh>)}
    {S.map(([l, x, z], i) => <group key={l} position={[x, 0.06, z]} scale={z1(i < n ? 1 : 0.4)}>
      <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 24]} /><meshBasicMaterial color={i < n ? YEL : "#555"} toneMapped={false} /></mesh>
      <Txt3 txt={`${i + 1}`} w={0.08} h={0.08} col={INK} p={[0, 0.005, 0]} r={[-PI / 2, 0, 0]} />
      <Txt3 txt={l} w={0.36} h={0.055} col={CRM} p={[0, 0.12, 0.1]} r={[-0.9, 0, 0]} op={i < n ? 1 : 0} /></group>)}
    <Txt3 txt={`PRESS ${sec}s`} w={0.4} h={0.1} col={GRN} glow p={[-0.5, 0.45, -0.4]} />
    
  </>;
}}</Scene3D>;

// 14:48 · LOS 6 LUGARES (vista de ladrón con linterna): la casa vista de arriba de noche; un haz de linterna da la vuelta y marca 1…6.
export const HMap6: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.6} txt={"NOT A STATISTIC · MY OWN EYES"} col={CRM} bg={"#31343c"} /></>} t={t} h={h} mode="iris" floor="dark" wall="none" bg="#06080e"
  cam={{ at: [0, 0.1, 0.1], az: [0.0, 0.25], el: [1.1, 1.0], r: [2.4, 2.1], fov: 32 }}>{(tt) => {
  const P6: [string, number, number][] = [["BACK DOOR", 0.0, -0.5], ["SLIDER", 0.55, -0.35], ["BASEMENT WINDOW", 0.6, 0.15], ["GARAGE", -0.75, 0.0], ["SIDE GATE", 0.72, 0.45], ["FRONT DOOR", 0.0, 0.5]];
  const a = lerp(-PI * 0.6, PI * 1.4, eio(tt, 0.4, 4.6)), n = Math.floor(cl((tt - 0.5) / 4.0) * 6 + 0.001);
  return <>
    <RBox s={[1.2, 0.3, 0.9]} p={[0, 0.15, 0]} r={0.02}>{M.matte({ col: "#3f4652" })}</RBox>
    <RBox s={[0.45, 0.24, 0.6]} p={[-0.85, 0.12, 0.05]} r={0.02}>{M.matte({ col: "#353b45" })}</RBox>
    <mesh position={[0.9, 0.12, 0.45]}><boxGeometry args={[0.3, 0.24, 0.03]} />{M.wood({ base: [110, 84, 60] })}</mesh>
    <spotLight position={[1.6 * Math.cos(a), 0.6, 1.4 * Math.sin(a)]} angle={0.25} penumbra={0.6} intensity={18} distance={3} color="#fff2c8" target-position={[0, 0, 0]} />
    {P6.map(([l, x, z], i) => <group key={l} position={[x, 0.34, z]} scale={z1(i < n ? pop(tt, 0.5 + i * 0.66) : 0)}>
      <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.065, 24]} /><meshBasicMaterial color={RED} toneMapped={false} /></mesh>
      <Txt3 txt={`${i + 1}`} w={0.08} h={0.08} col={CRM} p={[0, 0.005, 0]} r={[-PI / 2, 0, 0]} />
      <Txt3 txt={l} w={0.4} h={0.06} col={CRM} p={[0, 0.02, 0.12]} r={[-PI / 2, 0, 0]} /></group>)}
    
  </>;
}}</Scene3D>;

// 15:56 · EL PALO EN EL RIEL: la puerta corrediza intenta deslizar; el palo cortado a medida en el riel la frena en seco.
export const HDowel: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.7} txt={"CUT TO LENGTH"} col={INK} bg={YEL} /></>} t={t} h={h} mode="wipe" floor="tile" wall="none" bg="#0b0c10"
  cam={{ at: [0, 0.35, 0], az: [-0.5, -0.3], el: [0.4, 0.3], r: [1.9, 1.6], fov: 30 }}>{(tt) => {
  const d = eio(tt, 0.4, 1.2), tries = [1.6, 2.4, 3.2].map((a) => eio(tt, a, a + 0.15) * (1 - eio(tt, a + 0.2, a + 0.45))).reduce((x, y) => x + y, 0);
  return <>
    <RBox s={[1.8, 0.04, 0.12]} p={[0, 0.02, 0]} r={0.005}>{M.steel({ col: "#9aa0a6" })}</RBox>
    <group position={[0.4 - 0.03 * tries, 0, 0.03]}><RBox s={[0.85, 1.0, 0.04]} p={[0, 0.54, 0]} r={0.01}>{M.steel({ col: "#7a7f86" })}</RBox><mesh position={[0, 0.54, 0.022]}><planeGeometry args={[0.75, 0.9]} />{M.glass({ op: 0.3, col: "#bfe0ff" })}</mesh></group>
    <mesh position={[-0.45, 0.05, -0.02 + 0.3 * (1 - d)]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.022, 0.022, 0.84, 14]} />{M.wood({ base: [196, 150, 96] })}</mesh>
    {[0, 1, 2].map((i) => <mesh key={i} position={[-0.02, 0.5, 0.1]} rotation={[0, 0, PI / 2]} scale={z1(tries * (1 - i * 0.25))}><coneGeometry args={[0.05, 0.14, 10]} /><meshBasicMaterial color={RED} toneMapped={false} /></mesh>)}
    
  </>;
}}</Scene3D>;

// 17:00 · LA CUERDA ROJA: el portón de garaje en corte; un gancho entra por la rendija de arriba hacia la manija roja; un precinto lo deja colgando sin poder.
export const HReleaseCord: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.3} txt={"ZIP TIE ON THE LEVER"} col={INK} bg={YEL} /></>} t={t} h={h} mode="drop" floor="dark" wall="none" bg="#0b0c10"
  cam={{ at: [0, 1.02, 0.05], az: [0.55, 0.45], el: [0.16, 0.12], r: [1.55, 1.35], fov: 30 }}>{(tt) => {
  const hook = eio(tt, 0.8, 2.0), tie = eio(tt, 2.6, 3.0), tug = tie > 0.5 ? 0.03 * Math.sin(tt * 18) * cl((tt - 3.0) / 0.2) * (1 - cl((tt - 4.0) / 0.3)) : 0;
  return <>
    <mesh position={[0, 0.6, 0.5]}><boxGeometry args={[0.04, 1.2, 1.0]} /><meshStandardMaterial color="#d2ccbf" transparent opacity={0.28} depthWrite={false} /></mesh>
    <RBox s={[0.06, 0.05, 1.4]} p={[0, 1.3, -0.2]} r={0.005}>{M.steel({ col: "#8a8f96" })}</RBox>
    <RBox s={[0.12, 0.1, 0.16]} p={[0, 1.24, -0.1]} r={0.01}>{M.steel({ col: "#6a6f76" })}</RBox>
    <mesh position={[0, 1.0 + tug, -0.1]}><cylinderGeometry args={[0.005, 0.005, 0.4, 6]} /><meshBasicMaterial color="#c62a22" /></mesh>
    <mesh position={[0, 0.78 + tug, -0.1]}><boxGeometry args={[0.04, 0.08, 0.025]} />{M.plastic({ col: "#d0261c" })}</mesh>
    <mesh position={[0.0, 1.2, -0.1]} rotation={[0, 0.5, 0]} scale={z1(tie)}><torusGeometry args={[0.045, 0.011, 8, 24]} /><meshStandardMaterial color="#f4f4f0" emissive="#9fffc0" emissiveIntensity={0.8} toneMapped={false} /></mesh>
    <Txt3 txt="EMERGENCY RELEASE" w={0.8} h={0.11} col={RED} glow p={[0, 0.82, -0.62]} r={[0, 0.5, 0]} op={cl((tt - 0.3) / 0.3)} />
    <Txt3 txt="ZIP TIE ↓" w={0.36} h={0.1} col={GRN} glow p={[0.02, 1.42, -0.1]} r={[0, 0.5, 0]} op={tie} />
    <mesh geometry={tubeG("hk" + Math.round(hook * 20), [[0, 1.32, 0.9], [0, 1.25, 0.5], [0, lerp(1.25, 1.0, hook), lerp(0.5, 0.0, hook)]], 0.006, 20, 6)}>{M.steel({ col: "#c9ced3" })}</mesh>
    
  </>;
}}</Scene3D>;

// 20:22 · LOS MOTORES AFUERA: generador, parrilla y auto entran al garaje y salen rebotados con una cruz; afuera, lejos, con la regla de 20 pies.
export const HEnginesOut: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.4} txt={"NEVER INSIDE · NOT EVEN THE GARAGE"} col={CRM} bg={"#7a2a22"} /></>} t={t} h={h} mode="split" floor="dark" wall="none" bg="#0b0c10"
  cam={{ at: [0.3, 0.25, 0], az: [-0.3, 0.1], el: [0.6, 0.5], r: [2.5, 2.2], fov: 32 }}>{(tt) => {
  const out = eio(tt, 1.8, 3.0);
  return <>
    <MiniHouse p={[-0.7, 0, 0]} s={2.2} lit={0.6} />
    {[0, 1, 2].map((i) => <group key={i} position={[lerp(-0.45, 0.65 + i * 0.12, out), 0.0, -0.25 + i * 0.25]}>
      <RBox s={[0.16, 0.12, 0.12]} p={[0, 0.06, 0]} r={0.015}>{M.plastic({ col: ["#c9a227", "#333", "#7a1f1c"][i] })}</RBox>
      <Mark k={eio(tt, 0.8 + i * 0.25, 1.1 + i * 0.25) * (1 - out)} p={[0, 0.3, 0]} s={0.22} />
    </group>)}
    <mesh position={[0.1, 0.01, 0.45]} rotation={[-PI / 2, 0, 0]} scale={[z1(out), 1, 1]}><planeGeometry args={[0.9, 0.03]} /><meshBasicMaterial color={YEL} toneMapped={false} /></mesh>
    <Txt3 txt="20 FT+" w={0.3} h={0.09} col={YEL} glow p={[0.1, 0.1, 0.55]} op={out} />
    <Txt3 txt="CO" w={0.18} h={0.1} col={RED} glow p={[-0.7, 0.75, 0]} op={cl((tt - 0.6) / 0.3) * (1 - out)} />
    
  </>;
}}</Scene3D>;

// 20:32 · MIRAR, NO TOCAR: el tablero cerrado bajo el haz de una linterna; una mano se acerca y frena a un palmo; el haz se queda.
export const HPanelLook: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={2.5} txt={"LOOK. DON'T TOUCH."} col={CRM} bg={"#7a2a22"} /></>} t={t} h={h} mode="iris" floor="none" wall="wood" bg="#0a0a0c"
  cam={{ at: [0, 0.6, 0], az: [0.25, -0.05], el: [0.05, 0.03], r: [1.5, 1.3], fov: 30 }}>{(tt) => {
  const hand = eio(tt, 1.4, 2.4), back = eio(tt, 3.2, 3.8);
  return <>
    <RBox s={[0.55, 0.8, 0.08]} p={[0, 0.6, 0]} r={0.01}>{M.steel({ col: "#9aa2aa" })}</RBox>
    <mesh position={[0.2, 0.6, 0.045]}><boxGeometry args={[0.03, 0.08, 0.01]} />{M.steel({ col: "#555" })}</mesh>
    <spotLight position={[0.6, 0.9, 1.2]} angle={0.18} penumbra={0.5} intensity={30} distance={3} color="#fff2d0" target-position={[0, 0.6, 0]} />
    <group position={[0.6 - 0.25 * hand + 0.25 * back, 0.55, 0.35]}><mesh rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.05, 0.25, 8, 16]} /><meshStandardMaterial color="#c99a7c" roughness={0.7} /></mesh></group>
    <mesh position={[0.25, 0.55, 0.2]} scale={z1(cl((tt - 2.3) / 0.2) * (1 - back))}><planeGeometry args={[0.02, 0.4]} /><meshBasicMaterial color={RED} toneMapped={false} /></mesh>
    
  </>;
}}</Scene3D>;
