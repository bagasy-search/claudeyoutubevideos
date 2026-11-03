// gary04 · componentes únicos 1/4 (min 0-6). Cada uno es UN objeto que hace la idea sin leer; el texto va sobre la pieza.
import React from "react";
import { AbsoluteFill } from "remotion";
import { H } from "./hkit";
import { M, RBox, Scene3D, fall, tex, tubeG } from "./h3d";
import { Fridge, PI, Thermo, Txt3, cl, eio, lerp, phys, pop } from "./gk";

type V = [number, number, number];
// chispa corta: rayitos amarillos que salen de un punto y se apagan (k 0..1); la luz queda montada siempre
export const Spark: React.FC<{ p: V; k: number; s?: number }> = ({ p, k, s = 1 }) => {
  const on = k > 0 && k < 1 ? 1 : 0;
  return <group position={p} scale={s}>
    {Array.from({ length: 9 }, (_, i) => { const a = i * 2.4, l = Math.max(0.001, on * (0.03 + 0.05 * Math.sin(k * PI) * (0.6 + 0.4 * ((i * 7) % 3) / 2)));
      return <mesh key={i} position={[Math.cos(a) * l / 2, Math.sin(a) * l / 2 + 0.01, Math.sin(a * 1.7) * 0.01]} rotation={[0, 0, a]}><boxGeometry args={[l, 0.004, 0.004]} />{M.glow({ col: i % 2 ? "#ffe9a0" : "#ffb02a" })}</mesh>; })}
    <pointLight intensity={2.5 * (1 - cl(k)) * on} distance={0.6} color="#ffcf6a" />
  </group>;
};
// nieve: piso mate apenas azulado (col para bajarle la exposición de noche)
export const Snow: React.FC<{ w?: number; d?: number; col?: string }> = ({ w = 3, d = 2, col = "#e6edf4" }) => <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow><planeGeometry args={[w, d]} /><meshStandardMaterial color={col} roughness={0.95} /></mesh>;
// casita de muñecas: caja con techo a dos aguas y ventanas que se apagan (lit 0..1); apagada queda un reflejo azul frío
export const House: React.FC<{ p: V; lit: number; s?: number; col?: string; num?: string; r?: number }> = ({ p, lit, s = 1, col = "#8a6a52", num, r = 0 }) => <group position={p} scale={s} rotation={[0, r, 0]}>
  <RBox s={[0.22, 0.16, 0.18]} p={[0, 0.08, 0]} r={0.006}>{M.matte({ col })}</RBox>
  <mesh position={[0, 0.2, 0]} rotation={[0, PI / 4, 0]}><coneGeometry args={[0.17, 0.09, 4]} />{M.matte({ col: "#3b3330" })}</mesh>
  <mesh position={[0, 0.215, 0]} rotation={[0, PI / 4, 0]} scale={[1.02, 0.45, 1.02]}><coneGeometry args={[0.17, 0.09, 4]} /><meshStandardMaterial color="#eef3f8" roughness={1} /></mesh>
  {[-0.055, 0.055].map((x) => <mesh key={x} position={[x, 0.1, 0.091]}><planeGeometry args={[0.05, 0.05]} /><meshStandardMaterial color="#1a1612" emissive={lit > 0.03 ? "#ffc46a" : "#2c4670"} emissiveIntensity={lit > 0.03 ? 2.2 * lit : 0.35} toneMapped={false} /></mesh>)}
  <pointLight position={[0, 0.1, 0.16]} intensity={0.35 * lit} distance={0.35} color="#ffc46a" />
  <mesh position={[0, 0.04, 0.091]}><planeGeometry args={[0.04, 0.08]} />{M.matte({ col: "#3a2a20" })}</mesh>
  {num && <Txt3 txt={num} w={0.034} h={0.02} col="#f2c21b" bg="#1b1b1b" p={[0.042, 0.06, 0.092]} />}
</group>;

// 0:19 · LA CALLE SE APAGA: a ras de la calle nevada, las casas en fila se apagan de a una de punta a punta; la tuya, adelante, es la última
export const HStreet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0a1020" warm={0.5}
  key1={[-1.2, 2.2, 1.6]} cam={{ at: [0.08, 0.14, -0.3], az: [-0.5, -0.46], el: [0.14, 0.12], r: [2.25, 2.18], fov: 30 }}>{(tt) => {
  const off = (i: number) => 1 - cl((tt - 0.9 - i * 0.5) / 0.12), lamp = 1 - cl((tt - 3.0) / 0.15), mine = off(5), dark = 1 - mine;
  const ROW: V[] = [[-0.42, 0, -1.25], [-0.42, 0, -0.95], [-0.42, 0, -0.65], [-0.42, 0, -0.35], [-0.42, 0, -0.05]];
  return <>
    <Snow col={dark > 0.5 ? "#9fb0c8" : "#d3dce8"} w={4} d={4} />
    {/* la calle: una franja gris que se pierde al fondo */}
    <mesh position={[-0.05, 0.002, -0.6]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.36, 2.6]} /><meshStandardMaterial color="#5a6170" roughness={0.9} /></mesh>
    {ROW.map((p, i) => <House key={i} p={p} r={-PI / 2} lit={off(i)} s={1.15} col={["#8a6a52", "#6a7a8a", "#9a7a5a", "#7a5a4a", "#5a6a5a"][i]} />)}
    {/* la tuya: adelante, más grande, con número */}
    <House p={[0.32, 0, 0.12]} r={-0.5} lit={mine} s={1.7} col="#9a5a3e" num="12" />
    {/* el farol de la esquina y su charco de luz sobre la nieve */}
    <group position={[0.08, 0, -0.2]}>
      <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.012, 0.016, 0.5, 10]} /><meshStandardMaterial color="#3a4250" emissive="#2c4670" emissiveIntensity={0.5} /></mesh>
      <mesh position={[0, 0.5, 0]} scale={Math.max(0.001, lamp)}><sphereGeometry args={[0.07, 20, 14]} /><meshBasicMaterial color="#ffd9a0" transparent opacity={0.25} depthWrite={false} /></mesh>
      <mesh position={[0, 0.5, 0]}><sphereGeometry args={[0.025, 16, 12]} /><meshStandardMaterial color="#222" emissive="#ffd9a0" emissiveIntensity={3 * lamp} toneMapped={false} /></mesh>
      <pointLight position={[0, 0.46, 0.05]} intensity={1.6 * lamp} distance={1.2} color="#ffd9a0" />
      <mesh position={[0, 0.004, 0]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, lamp)}><circleGeometry args={[0.28, 40]} /><meshBasicMaterial color="#ffcf8a" transparent opacity={0.22} depthWrite={false} /></mesh>
    </group>
    <ambientLight intensity={0.25 * dark} color="#3a5a9a" />
    {Array.from({ length: 50 }, (_, i) => <mesh key={i} position={[-0.9 + (i * 0.173) % 1.8, 0.7 - ((tt * 0.12 + i * 0.137) % 0.7), -1.3 + (i % 7) * 0.22]}><sphereGeometry args={[0.005, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>)}
  </>;
}}</Scene3D>;

// 2:33 · EL INTERRUPTOR PRINCIPAL: primer plano de la palanca grande, colgando a medio camino con luz roja; sube de golpe con resorte y recién ahí luz verde
export const HBreaker: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" bg="#101216"
  cam={{ at: [-0.04, 0.36, 0.04], at1: [0, 0.46, 0.07], az: [-0.3, -0.18], el: [0.14, 0.12], r: [1.15, 0.58], fov: 30 }} lamp={[0.2, 0.6, 0.5]}>{(tt) => {
  const door = eio(tt, 0.2, 0.9), flip = cl(phys(tt, 2.9, 10, 0.35)), ok = cl((tt - 3.3) / 0.12), blink = !ok && Math.sin(tt * 14) > 0 ? 1 : 0, shake = tt > 2.95 && tt < 3.2 ? 0.004 * Math.sin(tt * 90) : 0;
  return <group position={[shake, 0, 0]}>
    <RBox s={[0.4, 0.56, 0.06]} p={[0, 0.3, -0.03]} r={0.008}>{M.matte({ col: "#868d94" })}</RBox>
    <mesh position={[0, 0.3, 0.0005]}><planeGeometry args={[0.34, 0.5]} />{M.matte({ col: "#1c1e22" })}</mesh>
    {Array.from({ length: 12 }, (_, i) => <RBox key={i} s={[0.07, 0.03, 0.02]} p={[(i % 2 ? 0.05 : -0.05), 0.08 + Math.floor(i / 2) * 0.042, 0.01]} r={0.003}>{M.plastic({ col: "#2a2c30" })}</RBox>)}
    {/* el principal, grande: cuerpo + palanca que cuelga a medio camino (saltada) y sube a ON */}
    <RBox s={[0.26, 0.11, 0.04]} p={[0, 0.47, 0.02]} r={0.008}>{M.plastic({ col: "#202226" })}</RBox>
    <group position={[0, 0.47, 0.045]} rotation={[lerp(0.15, -0.75, flip), 0, 0]}>
      <RBox s={[0.16, 0.03, 0.11]} p={[0, 0, 0.05]} r={0.008}>{M.matte({ col: ok > 0.5 ? "#1c5a38" : "#b8241a" })}</RBox>
      <Txt3 txt="MAIN" w={0.15} h={0.05} col="#ffffff" weight={900} p={[0, 0.0155, 0.06]} r={[-PI / 2, 0, 0]} />
    </group>
    {/* LED de estado: rojo que titila mientras está saltada, verde fijo al volver */}
    <mesh position={[0.1, 0.43, 0.042]}><sphereGeometry args={[0.009, 12, 10]} /><meshStandardMaterial color="#300" emissive={ok ? "#3aff6a" : "#ff2a1a"} emissiveIntensity={ok ? 0.8 : 0.9 * blink} /></mesh>
    <pointLight position={[0.1, 0.45, 0.2]} intensity={0.25 * blink} distance={0.4} color="#ff3a2a" />
    <pointLight position={[0, 0.5, 0.12]} intensity={0.25 * ok} distance={0.25} color="#4dff9a" />
    <Spark p={[0, 0.5, 0.1]} k={(tt - 2.95) / 0.3} s={0.8} />
    {/* la tapa que se abre hacia la izquierda */}
    <group position={[-0.2, 0.3, 0.005]} rotation={[0, -1.25 * door, 0]}>
      <RBox s={[0.4, 0.56, 0.012]} p={[0.2, 0, 0.006]} r={0.006}>{M.matte({ col: "#8e959c" })}</RBox>
    </group>
  </group>;
}}</Scene3D>;

// 3:09 · ANOTÁ LA HORA: el lápiz escribe «9:40 PM» en la libreta, letra por letra con la punta siempre en la última letra, y lo subraya
export const HNoteTime: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#120e0b" warm={0.6}
  cam={{ at: [0, 0.0, 0.02], az: [0.1, -0.05], el: [1.05, 0.95], r: [0.72, 0.64], fov: 30 }} lamp={[0.1, 0.5, 0.3]}>{(tt) => {
  const TX = "9:40 PM", CW = 0.05, X0 = -0.16, wr = lerp(0, TX.length, cl((tt - 0.3) / 3.5)), n = Math.floor(wr), und = eio(tt, 4.1, 4.7);
  const tipX = tt < 3.9 ? X0 + Math.min(wr, TX.length) * CW : tt < 4.1 ? lerp(X0 + TX.length * CW, X0 - 0.01, eio(tt, 3.9, 4.1)) : X0 - 0.01 + 0.36 * und;
  const tipY = tt < 3.9 ? 0.02 + 0.03 * Math.sin(wr * PI * 2) * (wr < TX.length ? 1 : 0) : -0.045;
  const lift = tt < 3.9 ? (wr % 1 > 0.8 ? 0.012 : 0) : tt < 4.1 ? 0.02 * Math.sin(PI * eio(tt, 3.9, 4.1)) : 0;
  return <>
    <group rotation={[-PI / 2, 0, -0.06]} position={[0, 0.004, 0]}>
      <RBox s={[0.46, 0.34, 0.01]} r={0.01}>{M.matte({ col: "#cfc5aa" })}</RBox>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, 0.12 - i * 0.05, 0.0055]}><planeGeometry args={[0.42, 0.002]} /><meshBasicMaterial color="#9ab6d6" /></mesh>)}
      {Array.from({ length: 9 }, (_, i) => <mesh key={"r" + i} position={[-0.2 + i * 0.05, 0.172, 0.006]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.012, 0.0025, 8, 16]} />{M.steel()}</mesh>)}
      {/* cada letra aparece cuando la punta pasa por ella */}
      {TX.split("").map((c, i) => c === " " ? null : <Txt3 key={i} txt={c} w={0.05} h={0.09} col="#15171c" weight={700} font="Georgia" p={[X0 + (i + 0.5) * CW, 0.02, 0.006]} s={Math.max(0.001, cl((wr - i) * 1.4))} />)}
      <mesh position={[X0 - 0.01 + 0.18 * und, -0.045, 0.006]} scale={[Math.max(0.001, und), 1, 1]}><planeGeometry args={[0.36, 0.009]} /><meshBasicMaterial color="#c62a22" /></mesh>
      <mesh position={[tipX + 0.05, tipY - 0.05, 0.0058]} rotation={[0, 0, -0.9]}><planeGeometry args={[0.16, 0.022]} /><meshBasicMaterial color="#000" transparent opacity={0.22 * (1 - lift * 30)} depthWrite={false} /></mesh>
      {/* el lápiz amarillo: la punta en el origen del grupo, sobre el papel */}
      <group position={[tipX, tipY, 0.006 + lift]} rotation={[PI / 2 - 0.55, 0.0, -0.5]}>
        <mesh position={[0, 0.0125, 0]}><coneGeometry args={[0.009, 0.025, 6]} />{M.wood({ base: [220, 180, 130] })}</mesh>
        <mesh position={[0, 0.003, 0]}><coneGeometry args={[0.0028, 0.007, 6]} />{M.matte({ col: "#2a2a2a" })}</mesh>
        <mesh position={[0, 0.105, 0]}><cylinderGeometry args={[0.009, 0.009, 0.16, 6]} />{M.plastic({ col: "#e8b62c" })}</mesh>
        <mesh position={[0, 0.192, 0]}><cylinderGeometry args={[0.0095, 0.0095, 0.015, 12]} />{M.rubber({ col: "#e88a9a" })}</mesh>
      </group>
    </group>
  </>;
}}</Scene3D>;

// 3:26 · 35 PIES: el cable caído chispea en la nieve; un anillo rojo se abre con resorte hasta 35 pies, con dos camionetas y un hombre adentro para la escala
export const HWire35: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0b0f18" warm={0.45}
  cam={{ at: [0.02, 0.0, 0.05], az: [0.0, 0.12], el: [0.82, 0.7], r: [1.85, 1.7], fov: 30 }} lamp={[0, 0.8, 0.3]}>{(tt) => {
  const ring = Math.max(0, phys(tt, 0.3, 2.6, 0.35)), rr = Math.max(0.001, 0.05 + 0.5 * ring), sp = (tt * 2.3) % 1, flash = 0.4 * cl(1 - Math.abs(tt - 1.15) / 0.2), tape = eio(tt, 2.4, 3.2);
  const Truck: React.FC<{ p: V; r: number; col: string }> = ({ p, r, col }) => <group position={p} rotation={[0, r, 0]}>
    <RBox s={[0.26, 0.05, 0.1]} p={[0, 0.04, 0]} r={0.01}>{M.plastic({ col })}</RBox>
    <RBox s={[0.1, 0.045, 0.095]} p={[0.04, 0.085, 0]} r={0.01}>{M.plastic({ col })}</RBox>
    {[-0.08, 0.08].map((x) => [-0.05, 0.05].map((z) => <mesh key={x + "," + z} position={[x, 0.02, z]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.015, 14]} />{M.rubber({ col: "#151515" })}</mesh>))}
  </group>;
  return <>
    <Snow col="#6f7f94" w={4} d={4} />
    {/* el poste y el cable que cae en curva hasta la nieve, con su sombra */}
    <mesh position={[-0.72, 0.35, -0.45]}><cylinderGeometry args={[0.02, 0.025, 0.7, 12]} />{M.wood({ base: [90, 64, 44] })}</mesh>
    <mesh geometry={tubeG("w35", [[-0.72, 0.66, -0.45], [-0.5, 0.4, -0.28], [-0.22, 0.08, -0.08], [-0.02, 0.012, 0.0], [0.08, 0.012, 0.05]], 0.009, 40, 8)} castShadow>{M.rubber({ col: "#151515" })}</mesh>
    <Spark p={[0.08, 0.02, 0.05]} k={sp} s={2.4} />
    <pointLight position={[0.08, 0.1, 0.05]} intensity={4 * flash} distance={1.2} color="#ff9a3a" />
    {/* el anillo de peligro: se abre desde la chispa con resorte */}
    <mesh position={[0.05, 0.004, 0.03]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[Math.max(0.0005, rr - 0.014), rr, 96]} />{M.glow({ col: "#ff3b2a", op: 0.9 })}</mesh>
    <mesh position={[0.05, 0.003, 0.03]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[rr, 96]} /><meshBasicMaterial color="#ff3b2a" transparent opacity={0.1} depthWrite={false} /></mesh>
    {/* cinta de peligro amarilla y negra, que se tiende alrededor */}
    {Array.from({ length: 48 }, (_, i) => { const a = i / 48 * 2 * PI; return <mesh key={i} position={[0.05 + Math.cos(a) * 0.58, 0.03, 0.03 + Math.sin(a) * 0.58]} rotation={[0, -a, 0]} scale={Math.max(0.001, cl(tape * 48 - i))}><boxGeometry args={[0.012, 0.022, 0.078]} /><meshStandardMaterial color={i % 2 ? "#151515" : "#f2c21b"} roughness={0.6} /></mesh>; })}
    {/* escala: dos camionetas en fila y un hombre de 6 pies adentro del anillo */}
    <group scale={Math.max(0.001, cl(phys(tt, 1.9, 7, 0.5)))}>
      <Truck p={[-0.12, 0, 0.26]} r={0.0} col="#2f5f9a" />
      <Truck p={[0.18, 0, 0.26]} r={0.0} col="#8a3a2a" />
      <group position={[0.36, 0, -0.05]} scale={5}>
        {[-1, 1].map((sd) => <mesh key={"ar" + sd} position={[0.017 * sd, 0.05, 0]} rotation={[0, 0, 0.25 * sd]}><capsuleGeometry args={[0.004, 0.026, 4, 8]} />{M.matte({ col: "#f07a1a" })}</mesh>)}
        {[-0.008, 0.008].map((x) => <mesh key={x} position={[x, 0.016, 0]}><capsuleGeometry args={[0.006, 0.02, 4, 8]} />{M.matte({ col: "#2a3040" })}</mesh>)}
        <mesh position={[0, 0.048, 0]}><capsuleGeometry args={[0.013, 0.03, 4, 10]} />{M.matte({ col: "#f07a1a" })}</mesh>
        <mesh position={[0, 0.082, 0]}><sphereGeometry args={[0.011, 12, 10]} />{M.matte({ col: "#d8a888" })}</mesh>
        <mesh position={[0, 0.09, 0]}><sphereGeometry args={[0.0115, 12, 10, 0, PI * 2, 0, PI / 2]} />{M.matte({ col: "#c62a22" })}</mesh>
      </group>
    </group>
    <Txt3 txt="35 FT" w={0.32} h={0.12} bg="#b8241a" col="#ffffff" p={[0.05, 0.12, -0.62]} r={[-0.5, 0, 0]} s={Math.max(0.001, phys(tt, 2.8, 8, 0.45))} />
  </>;
}}</Scene3D>;

// 3:56 · 4 HORAS CON LA PUERTA CERRADA: cuatro relojes en la puerta se encienden de a uno (verde → ámbar); la cinta «no abrir» se pega de un golpe
export const HFridge4h: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="tile" bg="#1a1c20"
  cam={{ at: [0, 0.58, 0.12], az: [-0.12, 0.04], el: [0.08, 0.06], r: [1.12, 1.04], fov: 30 }} lamp={[0.2, 0.9, 0.5]}>{(tt) => {
  const q = (i: number) => cl((tt - 0.6 - i * 0.7) / 0.15), slap = cl(phys(tt, 3.6, 11, 0.35)), leak = 0.6 + 0.2 * Math.sin(tt * 3);
  return <>
    <mesh position={[0, 0.004, 0.06]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.3, 40]} /><meshBasicMaterial color="#000" transparent opacity={0.4} depthWrite={false} /></mesh>
    <Fridge p={[0, 0, 0]} s={1.15} />
    {/* luz fría que se filtra por la rendija de la puerta */}
    <mesh position={[0, 0.5, 0.176]}><planeGeometry args={[0.37, 0.006]} />{M.glow({ col: "#bfe2ff", op: leak })}</mesh>
    {/* cuatro relojes, uno por hora */}
    {[0, 1, 2, 3].map((i) => { const k = q(i), x = (i % 2 ? 0.075 : -0.075), sweep = Math.max(0.001, 2 * PI * cl((tt - 0.6 - i * 0.7) / 0.6));
      return <group key={i} position={[x * 1.15, 0.72 - Math.floor(i / 2) * 0.17, 0.205]} scale={(1.45 + 0.2 * Math.sin(PI * k)) * Math.max(0.001, cl(phys(tt, 0.3 + i * 0.7, 9, 0.45)))}>
        <mesh><circleGeometry args={[0.038, 40]} /><meshStandardMaterial color="#f4f1ea" roughness={0.6} /></mesh>
        <mesh position={[0, 0, 0.001]}><ringGeometry args={[0.038, 0.045, 40]} />{M.steel()}</mesh>
        <mesh position={[0, 0, 0.002]}><ringGeometry args={[0.022, 0.034, 40, 1, PI / 2 - sweep, sweep]} />{M.glow({ col: sweep > 6.2 ? "#ffb02a" : "#4dff9a", op: k > 0 ? 0.95 : 0.001 })}</mesh>
        <mesh position={[0, 0, 0.003]} rotation={[0, 0, -sweep]}><boxGeometry args={[0.003, 0.03, 0.002]} /><meshBasicMaterial color="#1b1b1b" /></mesh>
      </group>; })}
    {/* la cinta de papel «no abrir»: cae sobre la puerta y se aplasta con un golpe de goma */}
    <group position={[0, 0.56, 0.245 + 0.12 * (1 - slap)]} rotation={[0, 0, -0.18]} scale={[1, 1, 1]}>
      <mesh position={[0.01, -0.012, -0.004]} scale={[Math.max(0.001, slap), 1, 1]}><planeGeometry args={[0.47, 0.06]} /><meshBasicMaterial color="#000" transparent opacity={0.3} depthWrite={false} /></mesh>
      <mesh scale={[Math.max(0.001, slap), 1, 1]}><planeGeometry args={[0.46, 0.07]} /><meshStandardMaterial color="#f2c21b" roughness={0.9} /></mesh>
      <Txt3 txt="DON'T OPEN" w={0.36} h={0.055} col="#b8241a" weight={900} p={[0, 0, 0.001]} op={cl(slap * 2 - 1)} />
    </group>
  </>;
}}</Scene3D>;

// 4:12 · EL FRÍO SE CAE: puerta abierta de frente; una cascada de niebla azul pesada se derrama por el borde y avanza por el piso como un charco
export const HColdSpill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark" bg="#0c0e12"
  cam={{ at: [0.02, 0.3, 0.2], az: [-0.18, -0.1], el: [0.2, 0.16], r: [1.55, 1.42], fov: 30 }} lamp={[0.5, 0.45, 0.7]}>{(tt) => {
  const door = eio(tt, 0.1, 0.6), flow = cl((tt - 0.45) / 0.35), front = 0.2 + 0.75 * eio(tt, 0.6, 7.5);
  const soft = tex.text("softfog", 64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.5, "rgba(255,255,255,.45)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
  return <>
    <Fridge p={[0, 0, 0]} s={1.1} door={door} lit={0.25 * door} col="#b9bec2" />
    {/* el hueco: paredes, estantes de vidrio y luz interior, para que se lea heladera ABIERTA */}
    <group scale={1.1}>
      {[[-0.158, 0.215, 0.008, 0.42], [0.158, 0.215, 0.008, 0.42]].map(([x, y, w, hh], i) => <RBox key={"cw" + i} s={[w, hh, 0.08]} p={[x, y, 0.19]} r={0.003}>{M.porcelain({ col: "#dfe4e8" })}</RBox>)}
      {[0.012, 0.42].map((y, i) => <RBox key={"ch" + i} s={[0.324, 0.008, 0.08]} p={[0, y, 0.19]} r={0.003}>{M.porcelain({ col: "#dfe4e8" })}</RBox>)}
      {[0.14, 0.27].map((y, i) => <mesh key={"gs" + i} position={[0, y, 0.19]}><boxGeometry args={[0.3, 0.005, 0.078]} /><meshPhysicalMaterial color="#cfe6ff" transparent opacity={0.45} roughness={0.05} /></mesh>)}
      <mesh position={[0, 0.405, 0.2]}><boxGeometry args={[0.12, 0.008, 0.03]} /><meshBasicMaterial color="#f4fbff" toneMapped={false} /></mesh>
    </group>
    {/* la cascada: niebla densa que cae por el borde del estante y se curva al piso */}
    {Array.from({ length: 220 }, (_, i) => { const ph = (tt * 0.45 + i / 220) % 1, x = -0.17 + (i % 12) * 0.031 + 0.012 * Math.sin(i * 1.7), y = ph < 0.35 ? 0.4 - ph * 1.08 : 0.025, z = ph < 0.35 ? 0.2 + ph * 0.12 : Math.min(front, 0.24 + (ph - 0.35) * 1.0);
      return <mesh key={i} position={[x * (1 + (ph > 0.35 ? (ph - 0.35) * 0.9 : 0)), Math.max(0.02, y) + 0.008 * (i % 3), z]} scale={Math.max(0.001, flow) * (0.09 + (i % 4) * 0.02) * (1 + ph * 1.6)}><planeGeometry args={[1, 1]} /><meshBasicMaterial map={soft} color="#9cc8ff" transparent opacity={(ph < 0.35 ? 0.22 : 0.26) * (1 - ph * 0.5)} depthWrite={false} /></mesh>; })}
    {/* el charco de frío con borde definido que avanza por el piso */}
    <mesh position={[0, 0.006, 0.18 + (front - 0.18) / 2]} rotation={[-PI / 2, 0, 0]} scale={[1.2, Math.max(0.001, (front - 0.18) / 0.4), 1]}><planeGeometry args={[0.7, 0.7]} /><meshBasicMaterial map={soft} color="#7fb0f0" transparent opacity={0.4 * flow} depthWrite={false} /></mesh>
    <mesh visible={false} position={[0, 0.008, 0.18 + (front - 0.18) / 2]} rotation={[-PI / 2, 0, 0]} scale={[1.2, Math.max(0.001, (front - 0.18) / 0.4), 1]}><ringGeometry args={[0.2, 0.22, 48]} /><meshBasicMaterial color="#cfe8ff" transparent opacity={0.25 * flow} depthWrite={false} /></mesh>
    {/* luz azul rasante que sale de la heladera abierta */}
    <pointLight position={[0, 0.06, 0.35]} intensity={1.2 * flow} distance={0.9} color="#6fb4ff" />
  </>;
}}</Scene3D>;

// 4:59 · EL LADO NORTE: afuera, contra la pared de ladrillo, la heladerita en la nieve; la brújula grande gira con inercia y la N se clava apuntándola; escarcha
export const HNorthCooler: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0d1220" warm={0.5}
  key1={[1.4, 1.2, 1.0]} cam={{ at: [0.04, 0.14, 0.08], az: [0.32, 0.18], el: [0.4, 0.36], r: [1.3, 1.26], fov: 30 }} lamp={[0, 0.7, 0.5]}>{(tt) => {
  const needle = lerp(3.2, 0, cl(phys(tt, 0.8, 4, 0.28))), nail = cl((tt - 2.4) / 0.1), frost = eio(tt, 2.4, 3.8);
  return <>
    <Snow col="#d8e2ee" />
    {/* pared de ladrillo de la casa, atrás */}
    <mesh position={[0, 0.5, -0.36]}><planeGeometry args={[3, 1.2]} /><meshStandardMaterial map={tex.tile(10, 8, "#8a4a36", "#4a3a34")} roughness={0.9} /></mesh>
    {/* montículo de nieve al pie de la pared */}
    {[[-0.5, -0.3, 0.16], [-0.18, -0.32, 0.14], [0.2, -0.31, 0.15], [0.55, -0.3, 0.13]].map(([x, z, r], i) => <mesh key={i} position={[x, 0, z]} scale={[1.6, 0.6, 1]}><sphereGeometry args={[r, 24, 16]} /><meshStandardMaterial color="#e8eef6" roughness={1} /></mesh>)}
    <group position={[-0.18, 0, -0.14]} scale={1.15}>
      <RBox s={[0.32, 0.18, 0.2]} p={[0, 0.09, 0]} r={0.02}>{M.plastic({ col: "#2f74c4" })}</RBox>
      <RBox s={[0.33, 0.04, 0.21]} p={[0, 0.2, 0]} r={0.012}>{M.plastic({ col: "#f2f2ee" })}</RBox>
      <mesh position={[0, 0.235, 0]}><boxGeometry args={[0.16, 0.012, 0.02]} />{M.matte({ col: "#2a2c30" })}</mesh>
      {Array.from({ length: 9 }, (_, i) => <mesh key={"ic" + i} position={[-0.15 + i * 0.037, 0.175 - 0.03 * frost * (0.6 + (i % 3) * 0.3), 0.106]} rotation={[PI, 0, 0]} scale={[1, Math.max(0.001, frost * (0.6 + (i % 3) * 0.3)), 1]}><coneGeometry args={[0.007, 0.06, 6]} /><meshPhysicalMaterial color="#e8f6ff" roughness={0.1} clearcoat={1} emissive="#9fd8ff" emissiveIntensity={0.3} /></mesh>)}
      {/* escarcha: cristalitos que crecen sobre la tapa al clavarse la aguja */}
      {Array.from({ length: 26 }, (_, i) => <mesh key={i} position={[-0.14 + (i * 0.047) % 0.28, 0.222, -0.08 + (i * 0.031) % 0.16]} rotation={[i, i * 2, 0]} scale={Math.max(0.001, cl(frost * 1.4 - (i % 5) * 0.08)) * (0.6 + (i % 3) * 0.3)}><octahedronGeometry args={[0.012, 0]} /><meshPhysicalMaterial color="#f4fbff" roughness={0.15} transmission={0.3} clearcoat={1} emissive="#9fd8ff" emissiveIntensity={0.25} /></mesh>)}
    </group>
    {/* la brújula grande en primer plano */}
    <group position={[0.3, 0.075 + 0.25 * (1 - cl(phys(tt, 0.3, 7, 0.5))), 0.26]} rotation={[-PI / 2 + 0.25, 0, 0]} scale={1.25}>
      <mesh position={[0, 0, -0.016]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.172, 0.172, 0.034, 48]} />{M.brass()}</mesh>
      <mesh position={[0.012, -0.012, -0.034]}><circleGeometry args={[0.18, 40]} /><meshBasicMaterial color="#000" transparent opacity={0.35} depthWrite={false} /></mesh>
      <mesh><circleGeometry args={[0.15, 64]} />{M.matte({ col: "#f3ead2" })}</mesh>
      <mesh position={[0, 0, 0.001]}><ringGeometry args={[0.14, 0.155, 64]} />{M.brass()}</mesh>
      {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[Math.cos(i * PI / 8) * 0.125, Math.sin(i * PI / 8) * 0.125, 0.002]} rotation={[0, 0, i * PI / 8]}><boxGeometry args={[i % 4 ? 0.01 : 0.02, 0.003, 0.001]} /><meshBasicMaterial color="#3a3530" /></mesh>)}
      <group rotation={[0, 0, needle + 2.25]}>
        <mesh position={[0, 0.055, 0.004]}><coneGeometry args={[0.022, 0.11, 3]} />{M.matte({ col: "#c62a22" })}</mesh>
        <mesh position={[0, -0.055, 0.004]} rotation={[0, 0, PI]}><coneGeometry args={[0.022, 0.11, 3]} />{M.matte({ col: "#e8e2d2" })}</mesh>
        <mesh position={[0, 0, 0.007]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 0.006, 12]} />{M.brass()}</mesh>
      </group>
      <Txt3 txt="N" w={0.06} h={0.06} col={nail > 0 ? "#ffd24a" : "#c62a22"} glow={nail > 0} weight={900} p={[-0.105 * Math.sin(2.25), 0.105 * Math.cos(2.25), 0.003]} s={1.2 + 0.5 * Math.sin(PI * nail)} />
    </group>
  </>;
}}</Scene3D>;

// 5:19 · VUELVE CON UN PICO: el enchufe de la tele salta de la pared con resorte y queda colgando; el pulso viaja por el cable y revienta en el tomacorriente vacío
const SG_PTS: V[] = [[-0.34, 0.66, -0.355], [-0.34, 0.5, -0.355], [-0.34, 0.3, -0.355]];
export const HSurge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#120e0b"
  cam={{ at: [-0.14, 0.16, -0.22], az: [-0.16, -0.06], el: [0.22, 0.18], r: [0.78, 0.72], fov: 30 }} lamp={[0, 0.7, 0.5]}>{(tt) => {
  const jump = Math.max(0, phys(tt, 3.6, 6, 0.3)), pulse = cl((tt - 2.6) / 0.9), hit = cl(1 - Math.abs(tt - 3.6) / 0.3), smoke = cl((tt - 3.5) / 1.5);
  const plugP: V = [lerp(-0.33, -0.18, jump), lerp(0.18, 0.04, jump) + 0.14 * Math.sin(Math.min(1, jump) * PI) + (tt > 4.2 ? 0.02 * Math.abs(Math.sin((tt - 4.2) * 9)) * Math.exp(-(tt - 4.2) * 3) : 0), lerp(-0.33, -0.18, jump)];
  return <>
    {/* tomacorriente en la pared, a la izquierda */}
    <group position={[-0.34, 0.2, -0.36]} scale={1.6}>
      <RBox s={[0.08, 0.12, 0.012]} r={0.006}>{M.pvc()}</RBox>
      {[0.025, -0.025].map((y) => <group key={y} position={[0, y, 0.007]}>{[-0.008, 0.008].map((x) => <mesh key={x} position={[x, 0, 0]}><planeGeometry args={[0.004, 0.012]} /><meshBasicMaterial color="#111" /></mesh>)}</group>)}
    </group>
    {/* el cable de la pared que trae el pulso: una luz celeste que baja por adentro */}
    <mesh visible={false} geometry={tubeG("sg1", SG_PTS, 0.016, 20, 8)}>{M.matte({ col: "#2a2c30" })}</mesh>
    {[0, 0.05, 0.1].map((d, i) => { const u = cl(pulse * 1.15 - d), PP: V[] = [[-0.33, 0.18, -0.33], [-0.1, 0.012, -0.14], [0.03, 0.02, -0.13], [0.1, 0.12, -0.17]], f = u * 3, j = Math.min(2, Math.floor(f)), r = f - j; return <mesh key={i} position={[lerp(PP[j][0], PP[j + 1][0], r), lerp(PP[j][1], PP[j + 1][1], r) + 0.02, lerp(PP[j][2], PP[j + 1][2], r)]} scale={Math.max(0.001, u > 0 && u < 1 ? 1 - i * 0.3 : 0.001)}><sphereGeometry args={[0.022, 16, 12]} />{M.glow({ col: i ? "#ffb84a" : "#ffe9a0", op: 0.95 - i * 0.25 })}</mesh>; })}
    {pulse > 0.02 && pulse < 0.98 && (() => { const PP: V[] = [[-0.33, 0.18, -0.33], [-0.1, 0.012, -0.14], [0.03, 0.02, -0.13], [0.1, 0.12, -0.17]], u = pulse, f = u * 3, j = Math.min(2, Math.floor(f)), r = f - j, pts: V[] = [...PP.slice(0, j + 1), [lerp(PP[j][0], PP[j + 1][0], r), lerp(PP[j][1], PP[j + 1][1], r), lerp(PP[j][2], PP[j + 1][2], r)]];
      return <mesh geometry={tubeG("sgg" + Math.round(u * 40), pts.length > 2 ? pts : [pts[0], [lerp(pts[0][0], pts[1][0], 0.5), lerp(pts[0][1], pts[1][1], 0.5), lerp(pts[0][2], pts[1][2], 0.5)], pts[1]], 0.011, 30, 8)}>{M.glow({ col: "#ffcf5a", op: 0.85 })}</mesh>; })()}
    <pointLight position={[lerp(-0.33, 0.1, pulse), 0.08, -0.2]} intensity={pulse > 0 && pulse < 1 ? 0.8 : 0} distance={0.5} color="#bfe8ff" />
    {Array.from({ length: 26 }, (_, i) => { const k = cl((tt - 3.5 - (i % 3) * 0.05) / 0.7), a = -0.9 + i * 0.07; return <mesh key={i} position={[-0.34 + Math.cos(a) * 0.3 * k, 0.22 + Math.sin(a + 1.2) * 0.12 * k - 0.25 * k * k, -0.3 + 0.1 * k]} scale={Math.max(0.001, k > 0 && k < 1 ? 1 : 0.001)}><sphereGeometry args={[0.016, 8, 6]} />{M.glow({ col: i % 2 ? "#ffd86a" : "#fff4c8" })}</mesh>; })}
    {Array.from({ length: 6 }, (_, i) => { const k = cl(smoke - i * 0.08); return <mesh key={"s" + i} position={[-0.34 + 0.02 * Math.sin(i * 2), 0.24 + 0.25 * k, -0.33]} scale={Math.max(0.001, k > 0 ? 0.5 + k : 0.001)}><sphereGeometry args={[0.03, 12, 10]} /><meshBasicMaterial color="#9a9a9a" transparent opacity={0.25 * (1 - k)} depthWrite={false} /></mesh>; })}
    <pointLight position={[-0.34, 0.25, -0.2]} intensity={2 * hit} distance={0.8} color="#ffe9a0" />
    {/* la tele a la derecha, apagada */}
    <group position={[0.08, 0, -0.2]} scale={0.55}>
      <RBox s={[0.42, 0.26, 0.03]} p={[0, 0.3, 0]} r={0.008}>{M.matte({ col: "#141414" })}</RBox>
      <mesh position={[0, 0.3, 0.016]}><planeGeometry args={[0.39, 0.23]} /><meshStandardMaterial color="#0b0d10" roughness={0.2} metalness={0.3} emissive={tt > 3.55 && tt < 4.2 ? "#ffffff" : "#bfe0ff"} emissiveIntensity={tt > 3.55 && tt < 4.2 ? (Math.floor(tt * 12) % 2 ? 3 : 0.05) : tt <= 3.55 ? 0.35 : 0} /></mesh>
      <RBox s={[0.12, 0.012, 0.08]} p={[0, 0.006, 0]} r={0.004}>{M.matte({ col: "#1c1d20" })}</RBox>
      <mesh position={[0, 0.09, 0]}><boxGeometry args={[0.02, 0.17, 0.02]} />{M.matte({ col: "#1c1d20" })}</mesh>
    </group>
    {/* el cable de la tele: tramo fijo por el piso + el enchufe que salta y cuelga */}
    <mesh geometry={tubeG("sg2", [[0.1, 0.12, -0.17], [0.03, 0.02, -0.13], [-0.1, 0.012, -0.14]], 0.006, 24, 6)}>{M.rubber({ col: "#1b1b1b" })}</mesh>
    <mesh geometry={tubeG("sgp" + Math.round(jump * 40), [[plugP[0], plugP[1] - 0.02, plugP[2] + 0.01], [lerp(plugP[0], -0.1, 0.5), Math.max(0.012, plugP[1] * 0.4), lerp(plugP[2], -0.14, 0.5) + 0.03], [-0.1, 0.012, -0.14]], 0.006, 24, 6)}>{M.rubber({ col: "#1b1b1b" })}</mesh>
    <group position={plugP} rotation={[0, 0.3 * jump, 0.4 * jump]} scale={2}>
      <RBox s={[0.03, 0.04, 0.026]} r={0.006}>{M.matte({ col: "#e8e4da" })}</RBox>
      {[-0.007, 0.007].map((x) => <mesh key={x} position={[x, 0, -0.022]}><boxGeometry args={[0.003, 0.009, 0.02]} />{M.brass()}</mesh>)}
    </group>
  </>;
}}</Scene3D>;
export { AbsoluteFill };
