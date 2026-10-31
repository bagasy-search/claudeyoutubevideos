// lfh29d · componentes únicos 15-21 (el almíbar que espesa al enfriarse, el roux de manteca y harina, los manojos de hierbas que se secan, la mostaza que une el aderezo, la lechuga que se marchita con la grasa tibia, la leche que se reduce a la mitad, la cuenta del súper con sus etiquetas).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, rn, tex } from "./h3d";

const PI = Math.PI;

// ---- 9:32 · ESPESA AL ENFRIARSE: la cuchara sale del frasco; caliente gotea finito y rápido; frío cae en una cinta gruesa y lenta; el termómetro baja ----
export const HSyrupdrip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="none" bg="#1a1410" lamp={[0.2, 0.4, 0.3]}
  cam={{ at: [0, 0.16, 0], az: [0.3, 0.1], el: [0.12, 0.1], r: [0.7, 0.6], fov: 30 }}>{(tt) => {
  const cool = eio(tt, 0.8, 4.6), drip = (tt * lerp(2.2, 0.5, cool)) % 1, thick = lerp(0.004, 0.013, cool);
  return <>
    {/* el frasco de almíbar ámbar */}
    <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.06, 0.06, 0.14, 40, 1, true]} />{M.glass({ op: 0.2 })}</mesh>
    <mesh position={[0, 0.062, 0]}><cylinderGeometry args={[0.057, 0.057, 0.12, 36]} /><meshPhysicalMaterial color="#a0521a" roughness={0.08} clearcoat={1} transparent opacity={0.85} /></mesh>
    {/* la cuchara arriba */}
    <group position={[0.0, 0.3, 0]} rotation={[0, 0, -0.25]}>
      <mesh scale={[1, 0.35, 1.4]}><sphereGeometry args={[0.022, 18, 10, 0, PI * 2, PI / 2, PI / 2]} />{M.steel()}</mesh>
      <mesh position={[0.07, 0.03, 0]} rotation={[0, 0, 1.2]}><boxGeometry args={[0.008, 0.13, 0.004]} />{M.steel()}</mesh>
    </group>
    {/* el hilo que cae: fino y rápido (caliente) a cinta gruesa (fría) */}
    <mesh position={[0, lerp(0.29, 0.13, 0.5), 0]}><cylinderGeometry args={[thick * 0.7, thick, 0.16, 12]} /><meshPhysicalMaterial color="#b0601e" roughness={0.05} clearcoat={1} transparent opacity={0.9} /></mesh>
    <mesh position={[0, lerp(0.28, 0.13, drip), 0]} scale={[1, 1.4, 1]}><sphereGeometry args={[thick * 1.6, 12, 10]} /><meshPhysicalMaterial color="#b0601e" roughness={0.05} clearcoat={1} /></mesh>
    {/* el pliegue de cinta que se acumula arriba cuando espesa */}
    {[0, 1, 2].map((i) => <mesh key={i} position={[(i - 1) * 0.006, 0.13 + i * 0.004, 0]} scale={[1, 0.35, 1]} visible={cool > 0.5 + i * 0.12}><torusGeometry args={[0.012, thick, 8, 20]} /><meshPhysicalMaterial color="#b0601e" roughness={0.05} clearcoat={1} /></mesh>)}
    {/* el vapor que se va apagando */}
    {Array.from({ length: 4 }, (_, i) => { const u = (tt * 0.45 + i / 4) % 1; return <mesh key={"s" + i} position={[(rn(i, 9) - 0.5) * 0.05, 0.15 + u * 0.15, 0]}><sphereGeometry args={[0.018 + 0.02 * u, 10, 8]} /><meshBasicMaterial color="#e2ddd2" transparent opacity={0.1 * Math.sin(u * PI) * (1 - cool)} depthWrite={false} /></mesh>; })}
    {/* el termómetro de cocina: el rojo baja */}
    <group position={[-0.17, 0.02, 0.02]} rotation={[0, 0, 0.08]}>
      <RBox s={[0.034, 0.26, 0.012]} p={[0, 0.13, 0]} r={0.006}><meshStandardMaterial color="#efe6d0" roughness={0.6} /></RBox>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0.009, 0.04 + i * 0.024, 0.007]}><boxGeometry args={[0.01, 0.002, 0.001]} /><meshBasicMaterial color="#3a3530" /></mesh>)}
      <mesh position={[-0.004, 0.035, 0.008]}><sphereGeometry args={[0.009, 12, 10]} /><meshStandardMaterial color="#c8281e" roughness={0.3} /></mesh>
      <mesh position={[-0.004, 0.035 + lerp(0.2, 0.07, cool) / 2, 0.008]}><boxGeometry args={[0.005, lerp(0.2, 0.07, cool), 0.002]} /><meshStandardMaterial color="#c8281e" roughness={0.3} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 10:04 · EL ROUX: la manteca se derrite en la sartencita, entra la harina y la pasta se cocina un minuto ----
export const HRoux: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark" bg="#19140f" key1={[-0.9, 1.3, 1.1]} warm={0.8}
  cam={{ at: [0.03, 0.04, 0], az: [-0.25, 0.25], el: [0.85, 0.75], r: [0.6, 0.52], fov: 30 }}>{(tt) => {
  const melt = eio(tt, 0.3, 1.8), flour = eio(tt, 1.9, 2.8), cook = eio(tt, 2.8, 5.2), st = tt * 4;
  const paste = `rgb(${Math.round(lerp(222, 168, cook))},${Math.round(lerp(196, 112, cook))},${Math.round(lerp(132, 58, cook))})`;
  return <>
    {/* la hornalla con la llama azul baja, siempre montada */}
    <mesh position={[0, -0.02, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.06, 0.1, 32]} /><meshStandardMaterial color="#1c1b1a" metalness={0.6} roughness={0.5} /></mesh>
    {Array.from({ length: 14 }, (_, i) => { const a = i * PI / 7; return <mesh key={i} position={[Math.cos(a) * 0.075, -0.012, Math.sin(a) * 0.075]}><coneGeometry args={[0.006, 0.018 + 0.004 * Math.sin(tt * 2 + i), 6]} />{M.glow({ col: "#4a7ae0", op: 0.55 })}</mesh>; })}
    {/* la sartencita de hierro */}
    <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.13, 0.115, 0.035, 44, 1, true]} /><meshStandardMaterial color="#2a2826" metalness={0.5} roughness={0.55} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.004, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.115, 44]} /><meshStandardMaterial color="#262422" metalness={0.5} roughness={0.6} /></mesh>
    <mesh position={[0.22, 0.03, 0]} rotation={[0, 0, PI / 2 - 0.1]}><cylinderGeometry args={[0.01, 0.012, 0.18, 12]} /><meshStandardMaterial color="#2a2826" metalness={0.5} roughness={0.55} /></mesh>
    {/* la manteca: el cubo se vuelve charco */}
    <RBox s={[0.06 * (1 - melt) + 0.002, 0.04 * (1 - melt) + 0.001, 0.04 * (1 - melt) + 0.002]} p={[0, 0.026 - 0.02 * melt, 0]} r={0.004}><meshStandardMaterial color="#f2d878" roughness={0.4} /></RBox>
    <mesh position={[0, 0.0065, 0]} rotation={[-PI / 2, 0, 0]} scale={0.2 + 0.8 * melt}><circleGeometry args={[0.105, 40]} /><meshPhysicalMaterial color={flour > 0.2 ? paste : "#d9a83a"} roughness={flour > 0.2 ? 0.75 : 0.3} clearcoat={flour > 0.2 ? 0 : 0.4} transparent opacity={0.95} /></mesh>
    {/* la harina que cae en lluvia */}
    {Array.from({ length: 30 }, (_, i) => { const u = (tt * 1.4 + rn(i, 2)) % 1; return <mesh key={"f" + i} visible={flour > 0.02 && flour < 0.98} position={[(rn(i, 3) - 0.5) * 0.06, 0.25 - u * 0.24, (rn(i, 4) - 0.5) * 0.06]}><boxGeometry args={[0.007, 0.007, 0.007]} /><meshStandardMaterial color="#efe9de" roughness={1} /></mesh>; })}
    {/* grumitos de la pasta que el batidor deshace */}
    {Array.from({ length: 16 }, (_, i) => <mesh key={"l" + i} visible={flour > 0.5} position={[Math.cos(i * 2.3 + st * 0.2) * 0.07 * rn(i, 5), 0.01, Math.sin(i * 2.3 + st * 0.2) * 0.07 * rn(i, 5)]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.008 * (1 - cook) + 0.002, 8, 6]} /><meshStandardMaterial color={paste} roughness={0.8} /></mesh>)}
    {/* el batidor plano */}
    <group position={[Math.cos(st) * 0.05, 0.06, Math.sin(st) * 0.05]} rotation={[0.5, st, 0]} visible={flour > 0.3}>
      {[-1, 0, 1].map((j) => <mesh key={j} position={[j * 0.012, -0.02, 0]} scale={[0.5, 1.2, 1]}><torusGeometry args={[0.025, 0.0014, 6, 24]} />{M.steel()}</mesh>)}
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.007, 0.007, 0.09, 12]} />{M.steel()}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 11:14 · CABEZA ABAJO EN LA DESPENSA: tres manojos atados con hilo (salvia, tomillo, mejorana) cuelgan de la viga; se secan y se vuelven verde oliva ----
export const HHerbbunch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="wood" bg="#1c1611" key1={[-0.7, 1.4, 1.4]} lamp={[0, 0.5, 0.35]}
  cam={{ at: [0, 0.3, 0], az: [-0.2, 0.15], el: [-0.05, 0.02], r: [0.78, 0.68], fov: 30 }}>{(tt) => {
  const dry = eio(tt, 1.0, 5.0), shrink = lerp(1, 0.82, dry);
  const greens = [["#7d9a7a", "#8a8462"], ["#3f6a2e", "#6a6a3a"], ["#5f8a3a", "#7f7a46"]];
  const mix = (a: string, b: string) => { const p = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16); return `rgb(${[0, 1, 2].map((i) => Math.round(lerp(p(a, i), p(b, i), dry))).join(",")})`; };
  return <>
    {/* la viga de la despensa con los clavos */}
    <RBox s={[1.2, 0.08, 0.08]} p={[0, 0.6, 0]} r={0.008}>{M.wood({ base: [96, 64, 38], rx: 3 })}</RBox>
    {[-0.24, 0, 0.24].map((x, i) => { const sway = Math.sin(tt * 1.1 + i * 1.7) * 0.05;
      return <group key={i} position={[x, 0.56, 0.03]} rotation={[0, 0, sway]}>
        <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.0018, 0.0018, 0.1, 6]} /><meshStandardMaterial color="#d8c9a6" roughness={1} /></mesh>
        <mesh position={[0, -0.1, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.012, 0.003, 6, 14]} /><meshStandardMaterial color="#c8b48a" roughness={1} /></mesh>
        {/* los tallos */}
        {Array.from({ length: 9 }, (_, j) => <mesh key={j} position={[(j - 4) * 0.004, -0.17, (rn(j, i) - 0.5) * 0.01]} rotation={[0, 0, (j - 4) * 0.05]}><cylinderGeometry args={[0.0018, 0.0018, 0.14, 5]} /><meshStandardMaterial color={mix("#6a7a3a", "#7a6a42")} roughness={1} /></mesh>)}
        {/* las hojas: salvia grandes y aterciopeladas, tomillo chiquitas, mejorana redondas */}
        {Array.from({ length: i === 1 ? 46 : 26 }, (_, j) => { const y = -0.2 - rn(j, i + 3) * 0.18, sp = (0.025 + (-0.2 - y) * 0.35) * shrink, a = j * 2.4;
          const sz = i === 0 ? [0.018, 0.007, 0.03] : i === 1 ? [0.006, 0.004, 0.009] : [0.012, 0.006, 0.014];
          return <mesh key={j} position={[Math.cos(a) * sp, y, Math.sin(a) * sp]} rotation={[0.4 + dry * 0.5, a, 0.3]} scale={[sz[0] * shrink, sz[1], sz[2] * shrink]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color={mix(greens[i][0], greens[i][1])} roughness={i === 0 ? 1 : 0.8} /></mesh>; })}
      </group>; })}
    {/* hojitas secas que caen a la repisa */}
    {Array.from({ length: 6 }, (_, j) => { const u = cl((tt - 2.5 - j * 0.4) / 1.2); return <mesh key={"d" + j} visible={u > 0} position={[(j - 2.5) * 0.09, lerp(0.3, 0.02, u), 0.05 + Math.sin(u * 8 + j) * 0.02]} rotation={[u * 5, j, u * 3]} scale={[0.01, 0.004, 0.015]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#7a6e44" roughness={1} /></mesh>; })}
    <RBox s={[1.0, 0.02, 0.2]} p={[0, 0.0, 0.02]} r={0.004}>{M.wood({ base: [140, 100, 62] })}</RBox>
  </>;
}}</Scene3D>;

// ---- 12:05 · LA MOSTAZA UNE: dos frascos de aceite y vinagre se agitan; el de la izquierda vuelve a separarse en dos capas, el de la mostaza queda cremoso ----
export const HEmulsion: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="none" bg="#1a1612" key1={[-0.8, 1.5, 1.3]}
  cam={{ at: [0.03, 0.09, 0], az: [0.1, -0.1], el: [0.32, 0.26], r: [0.62, 0.55], fov: 30 }}>{(tt) => {
  const dab = eio(tt, 0.3, 1.0), shake = cl((tt - 1.2) / 1.6), sh = shake > 0 && shake < 1 ? Math.sin(tt * 26) : 0, after = eio(tt, 3.0, 5.2);
  const jar = (x: number, mustard: boolean) => { const mixed = mustard ? cl(shake * 1.5) : cl(shake * 1.5) * (1 - after);
    return <group position={[x, 0, 0]} rotation={[0, 0, sh * 0.18]} scale={1.35}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.05, 0.05, 0.14, 36, 1, true]} />{M.glass({ op: 0.22 })}</mesh>
      <mesh position={[0, 0.148, 0]}><cylinderGeometry args={[0.053, 0.053, 0.016, 36]} /><meshStandardMaterial color="#c9a43a" metalness={0.8} roughness={0.3} /></mesh>
      {/* separado: vinagre rojizo abajo, aceite dorado arriba / mezclado: una sola crema */}
      <mesh position={[0, 0.025, 0]}><cylinderGeometry args={[0.047, 0.047, 0.045, 32]} /><meshPhysicalMaterial color={mixed > 0.5 ? (mustard ? "#d8b44a" : "#c8a058") : "#a8402a"} roughness={mixed > 0.5 ? 0.6 : 0.05} transparent opacity={mixed > 0.5 ? 0.97 : 0.75} /></mesh>
      <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.047, 0.047, 0.065, 32]} /><meshPhysicalMaterial color={mixed > 0.5 ? (mustard ? "#d8b44a" : "#c8a058") : "#e2c04a"} roughness={mixed > 0.5 ? 0.6 : 0.05} transparent opacity={mixed > 0.5 ? 0.97 : 0.7} /></mesh>
      {/* gotitas de aceite que suben al separarse */}
      {!mustard && Array.from({ length: 10 }, (_, i) => <mesh key={i} visible={after > 0.05 && after < 0.95} position={[(rn(i, 2) - 0.5) * 0.07, 0.02 + after * 0.07 + rn(i, 3) * 0.02, (rn(i, 4) - 0.5) * 0.07]}><sphereGeometry args={[0.005, 8, 6]} /><meshStandardMaterial color="#e8c84a" roughness={0.1} /></mesh>)}
    </group>; };
  return <>
    {jar(-0.15, false)}{jar(0.15, true)}
    {/* la cucharita de mostaza que va al frasco derecho */}
    <group position={[0.15, lerp(0.34, 0.24, dab), 0.03]} visible={dab < 0.98}>
      <mesh><sphereGeometry args={[0.014, 14, 8, 0, PI * 2, PI / 2, PI / 2]} />{M.steel()}</mesh>
      <mesh position={[0, 0.003, 0]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.011, 12, 8]} /><meshStandardMaterial color="#d9a81e" roughness={0.6} /></mesh>
      <mesh position={[0.045, 0.01, 0]} rotation={[0, 0, PI / 2 - 0.2]}><boxGeometry args={[0.004, 0.08, 0.003]} />{M.steel()}</mesh>
    </group>
    {/* el frasco de mostaza */}
    <mesh position={[0.3, 0.04, -0.17]}><cylinderGeometry args={[0.03, 0.03, 0.08, 24]} /><meshStandardMaterial color="#e6b62a" roughness={0.45} /></mesh>
    <mesh position={[0.3, 0.085, -0.17]}><cylinderGeometry args={[0.031, 0.031, 0.012, 24]} /><meshStandardMaterial color="#c8281e" roughness={0.4} /></mesh>
  </>;
}}</Scene3D>;

// ---- 12:23 · LA LECHUGA MARCHITA: el bol de lechuga de hoja recién cortada; cae la grasa tibia con vinagre y las hojas se aflojan y se acomodan ----
export const HWilted: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#18140f" lamp={[0.1, 0.45, 0.25]}
  cam={{ at: [0, 0.07, 0], az: [-0.3, 0.1], el: [0.55, 0.48], r: [0.62, 0.54], fov: 30 }}>{(tt) => {
  const pour = cl((tt - 0.6) / 1.8), wilt = eio(tt, 1.4, 4.6);
  return <>
    <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.16, 40, 20, 0, PI * 2, PI / 2, PI / 2.3]} />{M.wood({ base: [176, 132, 84] })}</mesh>
    {/* las hojas onduladas: paradas y verde claro -> caídas y verde oscuro brillante */}
    {Array.from({ length: 18 }, (_, i) => { const a = i * 2.399, r = 0.1 * Math.sqrt((i + 0.5) / 18), up = lerp(1.0, 0.35, wilt * (0.7 + 0.3 * rn(i, 2)));
      return <mesh key={i} position={[Math.cos(a) * r, 0.07 + 0.03 * up, Math.sin(a) * r]} rotation={[lerp(-0.9, -0.2, wilt) * (rn(i, 3) + 0.5), a, 0.3]} scale={[1, up, 1]}>
        <sphereGeometry args={[0.045, 16, 10, 0, PI * 1.3, 0, PI / 2]} />
        <meshPhysicalMaterial color={`rgb(${Math.round(lerp(140, 70, wilt))},${Math.round(lerp(196, 120, wilt))},${Math.round(lerp(90, 40, wilt))})`} roughness={lerp(0.6, 0.3, wilt)} clearcoat={wilt * 0.7} side={THREE.DoubleSide} />
      </mesh>; })}
    {/* la sartencita que vuelca la grasa tibia */}
    <group position={[0.2, 0.22, 0]} rotation={[0, 0, Math.sin(pour * PI) * 0.9]}>
      <mesh><cylinderGeometry args={[0.06, 0.055, 0.03, 30, 1, true]} /><meshStandardMaterial color="#2a2826" metalness={0.5} roughness={0.55} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.014, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.055, 30]} /><meshStandardMaterial color="#262422" metalness={0.5} roughness={0.6} /></mesh>
      <mesh position={[0.11, 0.005, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.007, 0.009, 0.1, 10]} /><meshStandardMaterial color="#2a2826" metalness={0.5} roughness={0.55} /></mesh>
    </group>
    <mesh position={[0.12, 0.15, 0]} rotation={[0, 0, 0.4]} visible={pour > 0.25 && pour < 0.85}><cylinderGeometry args={[0.005, 0.008, 0.13, 10]} /><meshPhysicalMaterial color="#c8902e" roughness={0.1} clearcoat={1} transparent opacity={0.85} /></mesh>
    {/* el vapor de lo tibio */}
    {Array.from({ length: 4 }, (_, i) => { const u = (tt * 0.5 + i / 4) % 1; return <mesh key={"s" + i} position={[(rn(i, 9) - 0.5) * 0.12, 0.13 + u * 0.18, (rn(i, 8) - 0.5) * 0.1]}><sphereGeometry args={[0.025 + 0.03 * u, 10, 8]} /><meshBasicMaterial color="#e4dfd4" transparent opacity={0.08 * Math.sin(u * PI) * cl(pour * 2)} depthWrite={false} /></mesh>; })}
    {/* dos tiras de panceta al costado */}
    {[0, 1].map((i) => <RBox key={i} s={[0.13, 0.006, 0.025]} p={[-0.27, 0.005, -0.04 + i * 0.04]} rot={[0, 0.2, 0]} r={0.003}><meshStandardMaterial map={tex.text("bacon", 128, 32, (g) => { g.fillStyle = "#8a3a22"; g.fillRect(0, 0, 128, 32); g.fillStyle = "#e8c8a0"; g.fillRect(0, 10, 128, 5); g.fillRect(0, 22, 128, 3); })} roughness={0.6} /></RBox>)}
  </>;
}}</Scene3D>;

// ---- 12:56 · HASTA LA MITAD: la olla pesada de leche con azúcar; la cuchara de madera con la marca de lápiz; el nivel baja a la mitad y se dora ----
export const HReduce: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" bg="#1a1510" lamp={[0, 0.5, 0.35]}
  cam={{ at: [0, 0.1, 0], az: [0.2, -0.05], el: [0.3, 0.26], r: [0.66, 0.58], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.6, 4.8), lvl = lerp(0.14, 0.07, k), col = `rgb(${Math.round(lerp(240, 214, k))},${Math.round(lerp(234, 170, k))},${Math.round(lerp(220, 96, k))})`;
  return <>
    {/* la olla en corte: la pared delantera transparente para ver el nivel */}
    <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.13, 0.12, 0.16, 48, 1, true]} />{M.steel({ op: 0.35, side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.0, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.12, 48]} />{M.steel({ col: "#8a8c8e" })}</mesh>
    <mesh position={[0, lvl / 2, 0]}><cylinderGeometry args={[0.125, 0.118, lvl, 44]} /><meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.4} /></mesh>
    {/* la marca que deja la leche en la pared al bajar */}
    <mesh position={[0, 0.14, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.127, 0.002, 6, 48]} /><meshStandardMaterial color="#e8dcc0" roughness={0.8} /></mesh>
    {/* la cuchara de madera con dos rayas de lápiz: lleno y mitad */}
    <group position={[0.06, 0.12, 0.02]} rotation={[0, 0, -0.18]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.007, 0.008, 0.3, 12]} />{M.wood({ base: [206, 166, 112] })}</mesh>
      <mesh position={[0, -0.1, 0]} scale={[1, 1.4, 0.4]}><sphereGeometry args={[0.022, 16, 10]} />{M.wood({ base: [206, 166, 112] })}</mesh>
      {[-0.0, -0.07].map((y, i) => <mesh key={i} position={[0, y, 0.008]}><boxGeometry args={[0.016, 0.003, 0.002]} /><meshBasicMaterial color={i ? "#c8281e" : "#3a3530"} /></mesh>)}
    </group>
    {/* burbujitas lentas en la superficie */}
    {Array.from({ length: 8 }, (_, i) => { const u = (tt * 0.6 + rn(i, 2)) % 1, a = rn(i, 3) * 6.3, r = 0.1 * Math.sqrt(rn(i, 4)); return <mesh key={i} position={[Math.cos(a) * r, lvl + 0.002, Math.sin(a) * r]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.006 * Math.sin(u * PI) + 0.001, 8, 6]} /><meshStandardMaterial color={col} roughness={0.2} /></mesh>; })}
    {/* la llama mínima */}
    {Array.from({ length: 12 }, (_, i) => { const a = i * PI / 6; return <mesh key={"f" + i} position={[Math.cos(a) * 0.07, -0.02, Math.sin(a) * 0.07]}><coneGeometry args={[0.005, 0.012, 6]} />{M.glow({ col: "#4a7ae0", op: 0.5 })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 13:29 · LA CUENTA DEL SÚPER: por la cinta de la caja pasan once productos con su etiqueta amarilla; el visor suma hasta 45 ----
export const HPricetags: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" bg="#15171a" key1={[-0.6, 1.6, 1.2]}
  cam={{ at: [0, 0.14, 0], az: [-0.2, -0.05], el: [0.3, 0.26], r: [1.0, 0.9], fov: 30 }}>{(tt) => {
  const prices = [4, 3, 6, 3, 3, 5, 5, 4, 5, 4, 3], belt = eio(tt, 0.3, 4.8) * 11, total = prices.reduce((s, p, i) => s + (belt > i + 0.5 ? p : 0), 0);
  const cols = ["#c8a040", "#f2f2ee", "#e6b030", "#8a5a2a", "#f0f0f0", "#e8d020", "#5a2a18", "#c8281e", "#3a7a3a", "#e8e0c8", "#2a5a9a"];
  return <>
    {/* la cinta negra de la caja */}
    <RBox s={[1.4, 0.03, 0.26]} p={[0, -0.015, 0]} r={0.006}><meshStandardMaterial map={tex.text("belt", 64, 64, (g) => { g.fillStyle = "#1c1c1e"; g.fillRect(0, 0, 64, 64); g.fillStyle = "#2a2a2e"; g.fillRect(0, 0, 64, 4); })} roughness={0.8} /></RBox>
    {prices.map((p, i) => { const x = (i - belt) * 0.16 + 0.1, kind = i % 4; if (x < -0.55 || x > 0.55) return null;
      return <group key={i} position={[x, 0, 0]}>
        {kind === 0 && <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.04, 0.04, 0.12, 28]} /><meshStandardMaterial color={cols[i]} metalness={0.3} roughness={0.4} /></mesh>}
        {kind === 1 && <RBox s={[0.07, 0.15, 0.07]} p={[0, 0.075, 0]} r={0.004}><meshStandardMaterial color={cols[i]} roughness={0.7} /></RBox>}
        {kind === 2 && <RBox s={[0.1, 0.13, 0.04]} p={[0, 0.065, 0]} r={0.004}><meshStandardMaterial color={cols[i]} roughness={0.7} /></RBox>}
        {kind === 3 && <group><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.03, 0.036, 0.14, 24]} /><meshPhysicalMaterial color={cols[i]} roughness={0.15} transparent opacity={0.85} /></mesh></group>}
        {/* la etiqueta amarilla con el precio */}
        <mesh position={[0, 0.03, 0.05]} rotation={[-0.2, 0, 0]}><planeGeometry args={[0.07, 0.04]} /><meshStandardMaterial map={tex.text("tag" + p, 128, 72, (g) => { g.fillStyle = "#f2d22a"; g.fillRect(0, 0, 128, 72); g.fillStyle = "#1a1a1a"; g.font = "900 48px Arial"; g.textAlign = "center"; g.fillText("$" + p, 64, 54); })} roughness={0.6} /></mesh>
      </group>; })}
    {/* el escáner y el visor de la caja: dos tambores que suman */}
    <mesh position={[0.1, 0.005, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.1, 0.24]} /><meshStandardMaterial color="#202a22" emissive="#c8281e" emissiveIntensity={0.25} roughness={0.2} /></mesh>
    <group position={[0, 0.28, -0.12]} scale={2.3}>
      <RBox s={[0.2, 0.1, 0.06]} p={[0, 0, -0.02]} r={0.01}><meshStandardMaterial color="#2a2c30" roughness={0.5} /></RBox>
      <mesh position={[-0.072, 0, 0.012]}><planeGeometry args={[0.03, 0.05]} /><meshStandardMaterial map={tex.text("dollar", 32, 64, (g) => { g.fillStyle = "#f1ead9"; g.fillRect(0, 0, 32, 64); g.fillStyle = "#1b1b1b"; g.font = "900 44px Arial"; g.textAlign = "center"; g.fillText("$", 16, 48); })} /></mesh>
      <DigitDrum v={Math.floor(total / 10)} p={[-0.025, 0, 0.012]} r={0.028} w={0.04} />
      <DigitDrum v={total % 10} p={[0.025, 0, 0.012]} r={0.028} w={0.04} />
      <mesh position={[0, -0.18, -0.02]}><cylinderGeometry args={[0.012, 0.012, 0.26, 10]} />{M.steel()}</mesh>
    </group>
  </>;
}}</Scene3D>;
