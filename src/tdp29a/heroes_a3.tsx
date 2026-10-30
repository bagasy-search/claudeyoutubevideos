// tdp29a · componentes 23-32 (hikikomori): la libreta de lo que SÍ hizo, el tiempo, el día del otro lado, la casa de tres generaciones, la carta.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { HANDF, PI, Sheet, fallY, pop, txt } from "./lkit3d";
import { Balance, Block, Can, Clock24, Fig, House, Letter, Shoji, Tatami } from "./tkit3d";
import { Tray } from "./heroes_a1";

// ---- 12:35 · LA LIBRETA DE LO QUE SÍ HIZO: en la libreta lisa se escriben, de a uno, los renglones chiquitos de cada día ----
const did = ["Mon — he ate all the rice", "Tue — he took a shower", "Wed — light on until 4", "Thu — the tray came back clean", "Fri — he opened the window"];
export const HNotebook: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0.02, 0.02, 0.02], az: [-0.2, 0.05], el: [0.95, 0.85], r: [0.62, 0.52], fov: 32 }}>{(tt) => {
  const L = did[0].split(" — ")[1], n = Math.round(L.length * eio(tt, 0.8, 3.4)), ck = eio(tt, 3.8, 4.5);
  return <>
    <group scale={pop(tt, 0.1)}>
      <RBox s={[0.42, 0.012, 0.3]} r={0.006} p={[0, 0.006, 0]}>{M.matte({ col: "#e9e2d0" })}</RBox>
      <mesh position={[0, 0.0125, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.4, 0.28]} /><meshStandardMaterial map={txt("nb1_" + n, ["", L.slice(0, n), ""], { w: 1024, h: 720, bg: "#fbf8ef", fg: "#22304e", size: 110, lh: 220, font: HANDF, rule: true })} roughness={0.92} /></mesh>
      <mesh position={[0.15, 0.014, 0.075]} rotation={[-PI / 2, 0, -0.5]} scale={[Math.max(0.001, ck), Math.max(0.001, ck), 1]}><planeGeometry args={[0.07, 0.016]} />{M.glow({ col: "#2c8a4a" })}</mesh>
    </group>
    <group position={[lerp(-0.15, 0.17, n / L.length), 0.03, 0.02]} rotation={[0.9, 0.4, 0.3]} scale={pop(tt, 0.4)}>
      <mesh><cylinderGeometry args={[0.005, 0.005, 0.14, 12]} />{M.plastic({ col: "#22304e" })}</mesh>
    </group>
    <group position={[-0.3, 0, -0.08]} scale={pop(tt, 0.6)}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.06, 0.035, 0.06, 32, 1, true]} /><meshStandardMaterial color="#2a1a14" side={THREE.DoubleSide} roughness={0.3} /></mesh>
      <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.035, 0.035, 0.006, 24]} /><meshStandardMaterial color="#2a1a14" /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 13:10 · EL ENEMIGO ES EL TIEMPO: las hojas del calendario vuelan y se pegan a la puerta; la pared engorda capa por capa ----
export const HWalls: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#121214" lamp={[0.3, 0.6, 0.5]}
  cam={{ at: [-0.05, 0.3, 0], az: [0.5, 0.3], el: [0.15, 0.2], r: [1.15, 1.02], fov: 32 }}>{(tt) => {
  const L = Math.floor(10 * eio(tt, 0.6, 5.2));
  return <>
    <Shoji s={0.75} light={0.45 * (1 - 0.7 * eio(tt, 0.6, 5.2))} />
    {Array.from({ length: 10 }, (_, i) => { const a = 0.6 + i * 0.46, k = phys(tt, a, a + 0.6, 0.3);
      return tt > a ? <RBox key={i} s={[0.034, 0.7, 0.03]} r={0.004} p={[lerp(0.75, -0.17 + i * 0.039, k), 0.35, 0.05 + (i % 2) * 0.012]}>{M.wood({ base: [86 + i * 3, 64, 44] })}</RBox> : null; })}
    <group position={[-0.4, 0.45, 0.15]} scale={1.7 * pop(tt, 0.4)}>
      <RBox s={[0.12, 0.08, 0.06]} r={0.01}>{M.brass({ col: "#b88a34" })}</RBox>
      {[0, 1].map((d) => <DigitDrum key={d} v={d === 0 ? L / 10 : L % 10} p={[-0.025 + d * 0.05, 0, 0.031]} r={0.025} w={0.04} />)}
    </group>
  </>;
}}</Scene3D>;

// ---- 15:07 · LA FUERZA ROMPE LA CONFIANZA: un puentecito de papel une la puerta con la madre; alguien tira de la puerta y el puente se rompe en pedazos ----
export const HTrust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#131215" lamp={[0, 0.6, 0.3]}
  cam={{ at: [-0.05, 0.18, 0], az: [-0.45, -0.3], el: [0.3, 0.22], r: [1.0, 0.9], fov: 32 }}>{(tt) => {
  const yank = eio(tt, 2.0, 2.4), shut = eio(tt, 5.6, 5.9), o = Math.max(0, 0.04 * eio(tt, 0.4, 1.2) + 0.3 * yank - 0.34 * shut);
  return <>
    <group position={[-0.3, 0, 0]} rotation={[0, PI / 2, 0]}><Shoji s={0.6} open={o} light={0.35 + 1.2 * o} /></group>
    <group position={[-0.5, 0, 0.05 - 0.08 * yank]} rotation={[0, PI / 2, 0]} scale={1.4}><Fig sit={1} bow={0.2 + 0.5 * yank} /></group>
    <group position={[lerp(0.36, -0.1, eio(tt, 1.2, 2.0)), 0, 0.1]} rotation={[0, -PI / 2, 0]} scale={1.5 * pop(tt, 0.2)}><Fig col="#3a3430" arm={0.6 * yank} /></group>
    <mesh position={[0.02, 0.0015, 0.08]} rotation={[-PI / 2, 0, PI / 2]} scale={[Math.max(0.001, o * 3), 1, 1]}><planeGeometry args={[0.35, 0.75]} />{M.glow({ col: "#ffd59a", op: 0.5 })}</mesh>
  </>;
}}</Scene3D>;

// ---- 16:10 · UN DÍA DEL OTRO LADO: el reloj de 24 horas avanza; en cada parada se levanta lo que pasa a esa hora ----
const stops = [[14, "wakes up"], [16, "reads"], [19, "the tray"], [24, "midnight"], [27, "the store"], [29, "first trains"]] as const;
export const HDayCycle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#0f1220" lamp={[0.2, 0.5, 0.4]}
  cam={{ at: [0, 0.26, 0], az: [-0.25, 0.1], el: [0.12, 0.16], r: [1.05, 0.92], fov: 30 }}>{(tt) => {
  const k = cl((tt - 0.4) / 5.6), hr = 14 + 15 * eio(k, 0, 1), day = Math.max(0, Math.cos(((hr % 24) - 13) / 24 * 2 * PI));
  const night = 1 - day, tray = eio(tt, 1.6, 2.2) * (1 - eio(tt, 3.6, 4.0));
  return <>
    <group position={[-0.25, 0, -0.1]} scale={pop(tt, 0.1)}><Shoji s={0.7} light={0.15 + 0.55 * night} /></group>
    <mesh position={[0.18, 0.42, -0.12]}><planeGeometry args={[0.26, 0.2]} /><meshBasicMaterial color={new THREE.Color("#0b1430").lerp(new THREE.Color("#9cc8ff"), day)} /></mesh>
    <RBox s={[0.29, 0.23, 0.015]} r={0.004} p={[0.18, 0.42, -0.13]}>{M.wood({ base: [70, 48, 30] })}</RBox>
    <mesh position={[0.18 + 0.1 * Math.cos(hr / 24 * 2 * PI), 0.42 + 0.07 * Math.sin(hr / 24 * 2 * PI), -0.115]}><circleGeometry args={[0.02, 24]} />{M.glow({ col: day > 0.3 ? "#fff1b8" : "#dfe6ff" })}</mesh>
    <group position={[0.18, 0.2, -0.1]} scale={0.85 * pop(tt, 0.3)}><Clock24 h={hr % 24} /></group>
    <group position={[-0.08, 0, 0.12]} scale={Math.max(0.001, 1.1 * tray)}><Tray /></group>
  </>;
}}</Scene3D>;

// ---- 17:33 · TRES GENERACIONES: el abuelo y la nena en el tatami; la abuela cruza con la taza de té, abre el shoji sin golpear y se sienta al lado del encerrado ----
export const HRoof: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#17130e" lamp={[0.1, 0.5, 0.3]}
  cam={{ at: [0.05, 0.12, 0], az: [0.25, -0.15], el: [0.4, 0.3], r: [1.0, 0.86], fov: 32 }}>{(tt) => {
  const walk = eio(tt, 1.0, 3.0), open = eio(tt, 3.0, 3.6), sit = eio(tt, 4.2, 4.9);
  return <>
    <Tatami w={1.1} d={0.75} />
    <group position={[-0.3, 0, -0.12]} rotation={[0, 0.6, 0]} scale={1.5 * pop(tt, 0.2)}><Fig sit={1} col="#8a6a4a" bow={0.2} /></group>
    <group position={[-0.18, 0, 0.12]} rotation={[0, 1.2, 0]} scale={1.0 * pop(tt, 0.4)}><Fig sit={1} /></group>
    <group position={[0.18, 0, -0.08]} rotation={[0, -PI / 2, 0]}><Shoji s={0.5} open={0.7 * open} light={0.35} /></group>
    <group position={[0.36, 0, 0.0]} rotation={[0, -PI / 2 - 0.4 * sit, 0]} scale={1.5}><Fig sit={1} bow={0.35 - 0.2 * sit} head={0.25 * (1 - sit)} /></group>
    <group position={[lerp(-0.1, 0.27, walk), 0, lerp(0.2, 0.14, walk)]} rotation={[0, PI / 2 + 0.5 * sit, 0]} scale={1.45 * pop(tt, 0.6)}>
      <Fig col="#8a6a4a" bow={0.2} arm={0.25 * (1 - sit)} sit={sit} />
      <mesh position={[0.045, 0.1 - 0.05 * sit, 0.035]}><cylinderGeometry args={[0.014, 0.011, 0.022, 20]} />{M.porcelain({ col: "#e9eef0" })}</mesh>
    </group>
    {[0, 1, 2].map((i) => { const y = 0.12 - 0.05 * sit + ((tt * 0.06 + i * 0.33) % 1) * 0.12; return <mesh key={i} position={[lerp(-0.1, 0.27, walk) + 0.02 * Math.sin(tt * 2 + i), y, 0.19]} scale={0.6 + ((tt * 0.06 + i * 0.33) % 1)}><sphereGeometry args={[0.008, 10, 8]} />{M.glow({ col: "#ffffff", op: 0.18 * (1 - ((tt * 0.06 + i * 0.33) % 1)) })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 18:03 · NO ES SÓLO JAPÓN: un globo gira y se clavan alfileres que se prenden: Japón, Corea, Italia, España, Estados Unidos ----
const pins = [[36, 138, "JAPAN"], [37, 127, "KOREA"], [42, 12, "ITALY"], [40, -4, "SPAIN"], [39, -98, "USA"]] as const;
export const HGlobe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="none" bg="#0c1018" lamp={[0.3, 0.6, 0.6]}
  cam={{ at: [-0.62, 0.13, 0], at1: [0.62, 0.13, 0], az: [0.22, -0.12], el: [0.07, 0.05], r: [0.8, 0.74], fov: 32 }}>{(tt) => <>
  {pins.map(([, , name], i) => { const x = -0.62 + i * 0.31, a = 0.3 + i * 1.05, on = eio(tt, a + 0.35, a + 0.75);
    return <group key={i} position={[x, 0, -0.02 * Math.abs(i - 2)]} scale={pop(tt, a)}>
      <RBox s={[0.27, 0.03, 0.24]} r={0.006} p={[0, 0.015, 0]}>{M.wood({ base: [104, 72, 44] })}</RBox>
      <House p={[0, 0.03, -0.02]} s={0.55} lit={[0, i === 4 ? 0.3 * on : 0, 0, on]} col={["#a9a194", "#a29d94", "#a89a86", "#aa9f8e", "#9fa3a8"][i]} />
      <mesh position={[0.0495, 0.0795, 0.0585]}><planeGeometry args={[0.062, 0.062]} /><meshBasicMaterial color="#ff9a2e" transparent opacity={on} toneMapped={false} /></mesh>
      <group position={[0.05, 0.05, 0.0595]} scale={Math.max(0.001, 0.3 * on)}><Fig cloth="#1b130c" col="#8a6a4a" sit={0.6} head={0.1} /></group>
      <Sheet map={txt("gl" + name, [name as string], { w: 320, h: 80, bg: "#5e3d24", fg: "#f3e2c0", size: 52 })} w={0.17} h={0.042} p={[0, 0.016, 0.1225]} r={[-0.25, 0, 0]} />
    </group>; })}
</>}</Scene3D>;

// ---- 19:09 · LA CARTA DE YUKI: la hoja se despliega sobre el piso del pasillo, junto a la puerta cerrada ----
const yuki = ["Hello.", "My name is Yuki.", "", "You don't have to", "open the door.", ""];
export const HLetter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#15120f" lamp={[0.1, 0.45, 0.3]}
  cam={{ at: [0, 0.02, -0.05], at1: [0, 0.02, 0.04], az: [0.1, 0], el: [1.05, 1.15], r: [0.58, 0.52], fov: 32 }}>{(tt) => <>
    <group position={[0, 0, -0.2]} scale={0.6}><Shoji s={0.6} light={0.4} /></group>
    <group position={[0, 0.003, 0.04]} scale={1.5 * pop(tt, 0.1)}><Letter u={eio(tt, 0.6, 2.4)} lines={yuki} key0="yuki" /></group>
  </>}</Scene3D>;

// ---- 19:58 · LA PUERTA SE ABRE DOS CENTÍMETROS: sale la rayita de luz y por abajo se asoma un papelito con un título ----
export const HSlide: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" lamp={[0, 0.4, 0.5]}
  cam={{ at: [-0.1, 0.1, 0.02], az: [0.15, 0.05], el: [0.28, 0.24], r: [0.92, 0.82], fov: 32 }}>{(tt) => {
  const o = 0.08 * eio(tt, 1.0, 2.2), slip = eio(tt, 3.0, 4.2), arm = eio(tt, 2.6, 3.2) * (1 - eio(tt, 4.6, 5.2));
  return <>
    <group position={[-0.24, 0, 0]}><Shoji s={0.8} open={o} light={0.6 * eio(tt, 1, 2)} /></group>
    <group position={[-0.08, 0, -0.05]} scale={1.4}><Fig sit={1} bow={0.6 * arm} arm={1.1 * arm} col="#5a5048" /></group>
    <mesh position={[-0.02, 0.0015, 0.1]} rotation={[-PI / 2, 0, 0]} scale={[1, Math.max(0.001, eio(tt, 1.0, 2.2)), 1]}><planeGeometry args={[0.08, 0.5]} />{M.glow({ col: "#ffd59a", op: 0.4 })}</mesh>
    <mesh position={[-0.05, 0.003, lerp(-0.02, 0.22, slip)]} rotation={[-PI / 2, 0, 0.08]} scale={pop(tt, 2.9)}>
      <planeGeometry args={[0.26, 0.13]} /><meshStandardMaterial map={txt("ttl", ["Tokyo Story?"], { w: 384, h: 192, bg: "#fbf8ef", fg: "#22304e", size: 72, font: HANDF })} roughness={0.9} />
    </mesh>
  </>;
}}</Scene3D>;

// ---- 20:15 · AL REVÉS DE TODO LO QUE TEME: en la balanza, los tres miedos pesados contra una carta liviana; la carta gana ----
export const HOpposite: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.7, 0.4]}
  cam={{ at: [0, 0.24, 0], az: [-0.2, 0.2], el: [0.12, 0.18], r: [1.0, 0.85], fov: 30 }}>{(tt) => {
  const tilt = lerp(-0.8, 0.7, phys(tt, 3.4, 5, 0.4));
  return <>
    <Balance s={1.2} tilt={tilt}
      left={<group>{[0, 1, 2].map((i) => <mesh key={i} position={[(i - 1) * 0.04, 0.03 + (i === 1 ? 0.04 : 0) + fallY(tt, 0.4 + i * 0.5, 0.4), 0]} rotation={[rn(i, 1), rn(i, 2) * 3, 0]} scale={[1.2, 0.8 + 0.3 * rn(i, 5), 1]}>
        <dodecahedronGeometry args={[0.035, 1]} /><meshStandardMaterial color="#3a3b3f" roughness={0.85} flatShading /></mesh>)}</group>}
      right={<group position={[0, 0.01 + fallY(tt, 2.8, 0.4), 0]} scale={0.5}><Letter u={eio(tt, 3.6, 4.6)} lines={["Hi, it's Yuki.", ""]} key0="opp" /></group>} />
  </>;
}}</Scene3D>;

// ---- 21:06 · ARIGATO: la nota de la madre sobre la bandeja se da vuelta sola y del otro lado dice una palabra ----
export const HArigato: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#15120f" lamp={[0.1, 0.4, 0.3]}
  cam={{ at: [0, 0.03, 0], az: [-0.2, 0.15], el: [0.85, 0.75], r: [0.6, 0.5], fov: 30 }}>{(tt) => {
  const f = eio(tt, 2.0, 3.0);
  return <>
    <group scale={1.3 * pop(tt, 0.1)}><Tray food={false} chip /></group>
    <group position={[0, 0.03 + 0.06 * Math.sin(PI * f), 0]} rotation={[0, 0.15, PI * f]} scale={pop(tt, 0.5)}>
      <Sheet map={txt("plum", ["The plum tree", "has flowers."], { w: 384, h: 256, bg: "#fbf8ef", fg: "#22304e", size: 54, font: HANDF })} w={0.17} h={0.113} r={[-PI / 2, 0, 0]} p={[0, 0.001, 0]} />
      <Sheet map={txt("arig", ["ありがとう", "arigato"], { w: 384, h: 256, bg: "#fbf8ef", fg: "#8a2a22", size: 70, font: HANDF })} w={0.17} h={0.113} r={[PI / 2, 0, PI]} p={[0, -0.001, 0]} />
    </group>
  </>;
}}</Scene3D>;

// ---- 22:31 · TODAS ESAS VENTANAS: arranca pegado a UNA ventana, con una figurita sentada de espaldas a la luz; la cámara se aleja y aparecen cientos ----
export const HWindows: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="none" bg="#090c14"
  cam={{ at: [-0.035, 0.405, 0.1], at1: [0, 0.4, -0.5], az: [0.05, -0.12], el: [0.03, 0.16], r: [0.2, 1.3], fov: 34 }}>{(tt) => <>
    {Array.from({ length: 9 }, (_, b) => { const x = (b % 3 - 1) * 0.75, z = -Math.floor(b / 3) * 0.8, a = b === 1 ? 0 : 1.2 + b * 0.22;
      return <group key={b} position={[x, 0, z]} scale={pop(tt, a)}><Block cols={8} rows={10} on={(i) => (b === 1 && i === 43) ? 1 : (rn(i + b * 97, 3) > 0.45 ? 0.9 : 0.05) * (0.85 + 0.15 * Math.sin(tt * 0.8 + i))} /></group>; })}
    <group position={[-0.035, 0.383, 0.108]} rotation={[0, PI, 0]} scale={0.17}><Fig sit={1} bow={0.2} col="#3a2a1e" /></group>
  </>}</Scene3D>;
