// lfh29c · componentes únicos 8-14 (la noche con la pasta en el horno, el trapo a favor de la veta, el aceite de más que se pega, lejía y vinagre separados, la mesa que se hincha, la espuma del desagüe, la escurridora).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Bottle, Jug, Rag } from "./ck";
import { Hand } from "./bk";

const PI = Math.PI;

// ---- 5:18 · TODA LA NOCHE: la puerta del horno con pasta; por la ventana pasa la luna, sale el sol, y la grasa quemada se suelta ----
export const HOvernight: React.FC<{ t: number; h: H }> = ({ t, h }) => { const tt0 = (t - h.at) / Math.max(1, h.out - h.at); const sky = tt0 < 0.25 ? "#2a3550" : tt0 < 0.7 ? "#0f1424" : "#e6b27a"; return <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg={sky} key1={[-0.6, 1.4, 1.4]}
  cam={{ at: [0, 0.04, 0], az: [-0.2, 0.1], el: [0.22, 0.18], r: [0.95, 0.85], fov: 30 }}>{(tt) => {
  const night = eio(tt, 0.4, 1.6) * (1 - eio(tt, 3.6, 4.4)), moon = eio(tt, 0.8, 3.8), wipe = eio(tt, 4.4, 5.4);
  return <>
    {/* ventana de la cocina al fondo: luna que cruza, después amanece */}
    <mesh position={[0.1, 0.32, -0.4]}><planeGeometry args={[0.7, 0.36]} /><meshBasicMaterial color={night > 0.5 ? "#141c34" : "#f2c48a"} /></mesh>
    {[[-0.25, 0.32, 0.02, 0.38], [0.45, 0.32, 0.02, 0.38], [0.1, 0.5, 0.72, 0.02], [0.1, 0.14, 0.72, 0.02], [0.1, 0.32, 0.015, 0.36]].map(([x, y, w, hh], i) => <RBox key={i} s={[w, hh, 0.03]} p={[x, y, -0.39]} r={0.004}><meshStandardMaterial color="#f1ece2" roughness={0.6} /></RBox>)}
    <mesh visible={night > 0.1} position={[lerp(-0.18, 0.38, moon), 0.3 + 0.12 * Math.sin(moon * PI), -0.38]}><circleGeometry args={[0.035, 32]} />{M.glow({ col: "#f2f0e2", op: night })}</mesh>
    <mesh visible={tt > 3.8} position={[0.3, 0.2 + 0.1 * eio(tt, 3.8, 5.0), -0.385]}><circleGeometry args={[0.05, 32]} />{M.glow({ col: "#ffcf6a" })}</mesh>
    {/* la puerta del horno abierta, horizontal, con la ventanita y la grasa quemada */}
    <RBox s={[0.6, 0.03, 0.4]} p={[0, -0.03, 0.05]} r={0.01}>{M.porcelain({ col: "#2a2826" })}</RBox>
    <RBox s={[0.36, 0.006, 0.22]} p={[0, -0.012, 0.05]} r={0.004}><meshStandardMaterial color="#1a1512" roughness={0.3} metalness={0.3} /></RBox>
    {Array.from({ length: 26 }, (_, i) => <mesh key={i} visible={wipe < (i % 10) / 10 + 0.05 || (rn(i, 4) - 0.5) * 0.3 > lerp(-0.2, 0.2, wipe)} position={[(rn(i, 2) - 0.5) * 0.32, -0.008, 0.05 + (rn(i, 3) - 0.5) * 0.18]} rotation={[-PI / 2, 0, i]}><circleGeometry args={[0.016 + 0.014 * rn(i, 5), 9]} /><meshStandardMaterial color="#5a3414" roughness={0.5} /></mesh>)}
    {/* la pasta blanca encima: se seca y agrieta de noche, el trapo la levanta a la mañana */}
    <mesh position={[lerp(0, 0.18, wipe) * 0, -0.006, 0.05]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, 1 - wipe), 1, 1]}><planeGeometry args={[0.34, 0.2]} /><meshStandardMaterial map={tex.text("pastecrack", 256, 160, (g) => { g.fillStyle = "#f6f2e6"; g.fillRect(0, 0, 256, 160); g.strokeStyle = "#cfc6b0"; g.lineWidth = 2; for (let i = 0; i < 20; i++) { g.beginPath(); let x = rn(i, 2) * 256, y = rn(i, 3) * 160; g.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (rn(i * 9 + k, 4) - 0.5) * 50; y += (rn(i * 9 + k, 5) - 0.5) * 40; g.lineTo(x, y); } g.stroke(); } })} roughness={1} /></mesh>
    <group visible={tt > 4.3} position={[lerp(-0.2, 0.2, wipe), 0.005, 0.05]}><Rag w={0.1} d={0.22} col="#a8322a" key2="ov" /></group>
  </>;
}}</Scene3D>; };

// ---- 6:10 · A FAVOR DE LA VETA: el trapo con aceite corre por las tablas siguiendo la veta y deja un brillo; después lo lustra en círculos ----
export const HGrainbuff: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#1b1612" key1={[-1.4, 0.7, 0.8]}
  cam={{ at: [0, 0, 0], az: [0.3, 0.15], el: [0.4, 0.32], r: [0.66, 0.56], fov: 30 }}>{(tt) => {
  const pass = [0, 1, 2].map((i) => eio(tt, 0.4 + i * 0.9, 1.2 + i * 0.9)), buff = eio(tt, 3.3, 5.3), row = Math.min(2, Math.floor(cl((tt - 0.4) / 2.7) * 3));
  const rx = tt < 3.3 ? lerp(-0.36, 0.36, pass[row]) : Math.cos(buff * PI * 6) * 0.08, rz = tt < 3.3 ? -0.09 + row * 0.09 : Math.sin(buff * PI * 6) * 0.06;
  return <>
    {/* tres tablas de mesa de pino, opacas y secas; donde pasa el trapo quedan oscuras y brillantes */}
    {[0, 1, 2].map((i) => <group key={i} position={[0, 0, -0.09 + i * 0.09]}>
      <RBox s={[0.84, 0.03, 0.086]} p={[0, -0.015, 0]} r={0.004}><meshStandardMaterial map={tex.wood(2, 0.4, [196, 156, 108])} roughness={0.95} /></RBox>
      <mesh position={[lerp(-0.42, 0, pass[i]), 0.0006, 0]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, pass[i]), 1, 1]}><planeGeometry args={[0.84, 0.084]} /><meshPhysicalMaterial map={tex.wood(2, 0.4, [150, 98, 54])} roughness={0.3 - 0.2 * buff} clearcoat={0.4 + 0.6 * buff} transparent opacity={0.92} /></mesh>
    </group>)}
    {/* el trapo con la mano encima */}
    <group visible={tt > 0.3} position={[rx, 0.012, rz]}>
      <Rag w={0.1} d={0.08} col="#3d6e3a" key2="gb" />
      <group position={[0, 0.03, 0.02]} rotation={[0, PI, 0]} scale={1.3}><Hand curl={0.15} /></group>
    </group>
    {/* el brillo que corre por la tabla al lustrar */}
    <mesh visible={buff > 0.1} position={[lerp(-0.3, 0.3, (tt * 0.6) % 1), 0.002, 0]} rotation={[-PI / 2, 0, 0.3]}><planeGeometry args={[0.05, 0.3]} />{M.glow({ col: "#fff1d0", op: 0.18 * buff })}</mesh>
  </>;
}}</Scene3D>;

// ---- 6:28 · ACEITE DE MÁS: el chorro deja un charco brillante; la pelusa cae, se pega, y el dedo levanta hilos pegajosos ----
export const HDuststicky: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#1d1915" key1={[-0.8, 1.4, 1.0]} lamp={[0.2, 0.4, 0.3]}
  cam={{ at: [0, 0.02, 0], az: [0.3, 0.15], el: [0.35, 0.3], r: [0.5, 0.42], fov: 30 }}>{(tt) => {
  const pour = eio(tt, 0.2, 1.4), puddle = eio(tt, 0.4, 1.8), lift = eio(tt, 3.6, 4.8) * (tt > 3.6 ? 1 : 0), press = eio(tt, 3.0, 3.6);
  return <>
    <RBox s={[0.8, 0.03, 0.5]} p={[0, -0.015, 0]} r={0.004}><meshStandardMaterial map={tex.wood(2, 1, [150, 100, 60])} roughness={0.7} /></RBox>
    {/* el charco de aceite que se agranda */}
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]} scale={[puddle + 0.001, puddle * 0.8 + 0.001, 1]}><circleGeometry args={[0.15, 40]} /><meshPhysicalMaterial color="#c08a2a" roughness={0.05} clearcoat={1} transparent opacity={0.75} /></mesh>
    <mesh visible={pour > 0.02 && pour < 0.98} position={[-0.02, 0.13, 0]}><cylinderGeometry args={[0.005, 0.007, 0.26, 10]} />{M.grease({ col: "#d4a03a", op: 0.85 })}</mesh>
    <group visible={tt < 1.6} position={[-0.06, 0.3, 0]} rotation={[0, 0, 2.2]}><Bottle s={0.8} liq="#d4a03a" cap="#3d6e3a" label="#c9e0b4" fill={0.6} /></group>
    {/* pelusa y polvo que caen y se quedan pegados (no rebotan) */}
    {Array.from({ length: 50 }, (_, i) => { const a = 1.6 + rn(i, 2) * 1.6, k = cl((tt - a) / 0.6), x = (rn(i, 3) - 0.5) * 0.24, z = (rn(i, 4) - 0.5) * 0.18;
      return <mesh key={i} visible={k > 0} position={[x + 0.02 * Math.sin(tt * 3 + i) * (1 - k), lerp(0.3, 0.004, k), z]} rotation={[i, i * 2, 0]}><icosahedronGeometry args={[0.004 + 0.004 * rn(i, 5), 0]} /><meshStandardMaterial color={i % 3 ? "#8f877c" : "#5c544a"} roughness={1} /></mesh>; })}
    {/* el dedo baja, aprieta, y al subir tira hilos de aceite con pelusa */}
    <group visible={tt > 2.9} position={[0.03, 0.05 - 0.04 * press + 0.12 * lift, 0.02]} rotation={[-1.3, 0.4, 0]} scale={1.4}><Hand curl={0.75} /></group>
    {lift > 0.02 && [-0.012, 0, 0.012].map((dx, i) => <mesh key={i} geometry={tubeG("strand" + i + Math.round(lift * 20), [[0.03 + dx, 0.002, 0.0], [0.03 + dx * 0.6, 0.04 * lift, 0.004], [0.03 + dx * 0.3, 0.09 * lift + 0.004, 0.01]], (u) => 0.0022 * (1 - u * 0.6), 16, 6)}>{M.grease({ col: "#c99a3a", op: 0.85 })}</mesh>)}
  </>;
}}</Scene3D>;

// ---- 6:56 · LEJÍA Y VINAGRE, NUNCA JUNTOS: se deslizan uno hacia el otro, sube un vaho verde, y una tabla cae entre los dos y los separa ----
export const HApart: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" key1={[-0.6, 1.6, 1.2]}
  cam={{ at: [0, 0.12, 0], az: [-0.1, 0.08], el: [0.16, 0.12], r: [0.82, 0.72], fov: 30 }}>{(tt) => {
  const near = eio(tt, 0.3, 1.8) * (1 - phys(tt, 2.4, 7, 0.45) * 1), board = phys(tt, 2.2, 8, 0.4), fume = eio(tt, 1.2, 2.0) * (1 - eio(tt, 2.4, 3.2));
  return <>
    {/* jarra de lejía (blanca, tapa azul) y botella de vinagre */}
    <group position={[lerp(-0.34, -0.1, near), 0, 0]}><Jug s={1.1} liq="#f6f6f0" cap="#2d5d9a" /></group>
    <group position={[lerp(0.32, 0.1, near), 0, 0]}><Bottle s={1.3} /></group>
    {/* el vaho verdoso que empieza a subir entre los dos */}
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} visible={fume > 0.02} position={[(rn(i, 2) - 0.5) * 0.12, 0.15 + i * 0.018 + 0.03 * Math.sin(tt * 2 + i), (rn(i, 3) - 0.5) * 0.06]}><sphereGeometry args={[0.03 + 0.02 * rn(i, 4), 14, 10]} /><meshStandardMaterial color="#b6d05a" transparent opacity={0.28 * fume} depthWrite={false} /></mesh>)}
    {/* la tabla que cae y los separa */}
    <RBox s={[0.03, 0.42, 0.3]} p={[0, 0.21 + 0.5 * (1 - board), 0]} r={0.006}>{M.wood({ base: [176, 120, 66] })}</RBox>
    <mesh visible={board > 0.9} position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.18 * (tt - 2.2), 0.19 * (tt - 2.2) + 0.005, 40]} /><meshBasicMaterial color="#f6e7c8" transparent opacity={cl(1 - (tt - 2.6))} /></mesh>
  </>;
}}</Scene3D>;

// ---- 7:30 · NUNCA LA MESA EN REMOJO: el charco se mete entre las tablas, la madera se oscurece y los bordes se levantan ----
export const HWoodsoak: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1a1613" key1={[-0.8, 1.2, 1.2]}
  cam={{ at: [0, -0.02, 0.0], az: [0.45, 0.3], el: [0.3, 0.24], r: [0.62, 0.54], fov: 30 }}>{(tt) => {
  const soak = eio(tt, 0.8, 4.6), cup = eio(tt, 2.4, 5.2), sq = Math.round(soak * 8) / 8;
  return <>
    {/* tablas vistas en corte: el agua oscurece desde arriba y por las juntas */}
    {[-2, -1, 0, 1, 2].map((i) => <group key={i} position={[i * 0.105, 0, 0]}>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.025, 0, 0]} rotation={[0, 0, sd * 0.12 * cup]}>
        <RBox s={[0.05, 0.05, 0.4]} p={[0, -0.025, 0]} r={0.002}><meshStandardMaterial map={tex.wood(0.3, 1, [lerp(184, 92, sq) | 0, lerp(140, 62, sq) | 0, lerp(92, 36, sq) | 0])} roughness={0.85} /></RBox>
      </group>)}
      {/* el agua bajando por la junta */}
      <mesh position={[0.0525, -0.025 * soak, 0.2005]}><planeGeometry args={[0.006, 0.05 * soak + 0.001]} />{M.water({ op: 0.8 })}</mesh>
    </group>)}
    {/* el charco arriba que se va achicando porque entra en la madera */}
    <mesh position={[0, 0.002 + 0.006 * cup, 0]} rotation={[-PI / 2, 0, 0]} scale={[1 - soak * 0.7, 1 - soak * 0.6, 1]}><circleGeometry args={[0.22, 48]} />{M.water({ op: 0.6 })}</mesh>
  </>;
}}</Scene3D>;

// ---- 8:08 · COMO UN EXPERIMENTO DE ESCUELA: el vinagre cae sobre el bicarbonato del desagüe y la espuma sube por la rejilla ----
export const HFizz: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#1c1e22" key1={[-0.4, 1.6, 1.0]}
  cam={{ at: [0, 0.02, 0], az: [0.2, -0.1], el: [0.62, 0.55], r: [0.48, 0.42], fov: 30 }}>{(tt) => {
  const pour = eio(tt, 0.3, 1.3), foam = eio(tt, 1.0, 2.6) * (1 - 0.4 * eio(tt, 4.2, 5.4));
  return <>
    {/* fondo de la pileta y la rejilla cromada con el bicarbonato */}
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1, 0.8]} /><meshPhysicalMaterial color="#6d747b" metalness={0.7} roughness={0.32} clearcoat={0.4} /></mesh>
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.035, 0.05, 40]} />{M.chrome()}</mesh>
    <mesh position={[0, 0.0005, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.035, 32]} /><meshStandardMaterial color="#141414" /></mesh>
    {[-0.02, 0, 0.02].map((x) => <mesh key={x} position={[x, 0.002, 0]}><boxGeometry args={[0.004, 0.002, 0.07]} />{M.chrome()}</mesh>)}
    <mesh position={[0, 0.003, 0]} scale={[1, 0.3, 1]} visible={tt < 1.6}><sphereGeometry args={[0.04, 20, 10, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#fbfaf5" roughness={1} /></mesh>
    {/* el chorro de vinagre */}
    <mesh visible={pour > 0.02 && pour < 0.98} position={[0.01, 0.12, 0]}><cylinderGeometry args={[0.005, 0.006, 0.24, 10]} />{M.water({ op: 0.6, col: "#f4eed8" })}</mesh>
    <group visible={tt < 1.5} position={[0.05, 0.3, 0]} rotation={[0, 0, 2.3]}><Bottle s={0.8} /></group>
    {/* la espuma: burbujas que crecen, suben y se desparraman */}
    {Array.from({ length: 110 }, (_, i) => { const a = i * 2.4, r0 = 0.06 * Math.sqrt(i / 110) * (0.4 + foam), y = 0.004 + foam * (0.05 * (1 - Math.sqrt(i / 110)) + 0.006 * rn(i, 2)) + 0.003 * Math.sin(tt * 6 + i);
      return <mesh key={i} visible={foam > 0.02 && i / 110 < foam * 1.2} position={[Math.cos(a) * r0 * 1.4, y, Math.sin(a) * r0 * 1.4]}><sphereGeometry args={[0.006 + 0.008 * rn(i, 3), 10, 8]} /><meshPhysicalMaterial color="#fbfbf6" roughness={0.1} transmission={0.2} transparent opacity={0.85} clearcoat={1} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 8:58 · LA ESCURRIDORA: los rodillos giran, la sábana pasa y el agua cae a la tina donde entra la taza de vinagre ----
export const HWringer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" key1={[-0.8, 1.6, 1.2]}
  cam={{ at: [0, 0.2, 0], az: [0.45, 0.25], el: [0.18, 0.14], r: [0.9, 0.78], fov: 30 }}>{(tt) => {
  const roll = tt * 3, feed = eio(tt, 0.3, 4.6), cup = eio(tt, 3.4, 4.4);
  return <>
    {/* la tina galvanizada con agua */}
    <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.2, 0.17, 0.18, 48, 1, true]} />{M.steel({ col: "#a9b0b6", side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.15, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.195, 48]} />{M.water({ op: 0.7, col: "#cfe2ea" })}</mesh>
    {/* el marco y los dos rodillos de goma */}
    {[-0.16, 0.16].map((x) => <RBox key={x} s={[0.02, 0.2, 0.04]} p={[x, 0.28, 0]} r={0.004}><meshStandardMaterial color="#3a5a3a" roughness={0.5} metalness={0.3} /></RBox>)}
    {[0.33, 0.29].map((y, i) => <mesh key={y} position={[0, y, 0]} rotation={[(i ? 1 : -1) * roll, 0, PI / 2]}><cylinderGeometry args={[0.02, 0.02, 0.3, 28]} /><meshStandardMaterial map={tex.text("roller", 64, 64, (g) => { g.fillStyle = "#e9e3d4"; g.fillRect(0, 0, 64, 64); g.fillStyle = "#c9c1ae"; g.fillRect(0, 0, 64, 6); })} roughness={0.7} /></mesh>)}
    <mesh position={[0.18, 0.31, 0]} rotation={[0, 0, roll]}><torusGeometry args={[0.03, 0.004, 6, 20]} /><meshStandardMaterial color="#3a5a3a" metalness={0.3} /></mesh>
    {/* la sábana: entra mojada y floja por atrás, sale plana y escurrida por adelante */}
    <mesh position={[0, 0.31, -0.08 + 0.0]} rotation={[-0.9, 0, 0]}><planeGeometry args={[0.24, 0.16 * (1 - feed) + 0.001]} /><meshStandardMaterial color="#dfe6ea" roughness={0.6} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.31 - 0.08 * feed, 0.03]} rotation={[0.1, 0, 0]}><planeGeometry args={[0.24, 0.16 * feed + 0.001]} /><meshStandardMaterial color="#f6f4ee" roughness={0.9} side={THREE.DoubleSide} /></mesh>
    {/* el agua escurrida en gotas */}
    {Array.from({ length: 12 }, (_, i) => { const u = (tt * 1.5 + rn(i, 2)) % 1; return <mesh key={i} visible={feed > 0.05 && feed < 0.98} position={[(rn(i, 3) - 0.5) * 0.22, lerp(0.28, 0.15, u), -0.02]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.005, 8, 6]} />{M.water({ op: 0.8 })}</mesh>; })}
    {/* la taza de vinagre al agua del enjuague */}
    <group visible={tt > 3.2 && tt < 4.8} position={[-0.1, 0.24, 0.12]} rotation={[0, 0, -1.6 * cup]}>
      <mesh><cylinderGeometry args={[0.03, 0.026, 0.05, 24, 1, true]} />{M.porcelain({ col: "#f4f1ea", side: THREE.DoubleSide })}</mesh>
    </group>
    <mesh visible={cup > 0.3 && cup < 0.98} position={[-0.07, 0.19, 0.12]}><cylinderGeometry args={[0.004, 0.005, 0.08, 8]} />{M.water({ op: 0.6, col: "#f4eed8" })}</mesh>
  </>;
}}</Scene3D>;
