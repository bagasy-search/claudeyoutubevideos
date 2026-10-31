// lfh29c · componentes únicos 1-7 (las cuatro cosas bajo la pileta, el diario que deja el vidrio sin vetas, el sol que veta, la cáscara de limón en vinagre, el mármol que se opaca, la sal que friega, la pasta como glaseado).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Bottle, Jar, SodaBox } from "./ck";

const PI = Math.PI;

// ---- 0:36 · CUATRO COSAS BAJO LA PILETA: el mueble se abre y aparecen de a una el vinagre, el bicarbonato, el jabón en barra y la sal ----
export const HFourthings: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#17120e" key1={[-0.4, 1.2, 1.4]}
  cam={{ at: [0, 0.1, 0], az: [-0.12, 0.1], el: [0.14, 0.1], r: [0.9, 0.76], fov: 30 }}>{(tt) => {
  const door = eio(tt, 0.2, 1.0), it = [0, 1, 2, 3].map((i) => phys(tt, 1.0 + i * 0.75, 7, 0.45));
  return <>
    {/* interior del mueble: fondo, piso de tabla, caño en U */}
    <RBox s={[0.76, 0.4, 0.02]} p={[0, 0.18, -0.2]} r={0.004}>{M.wood({ base: [86, 56, 32] })}</RBox>
    <RBox s={[0.76, 0.02, 0.42]} p={[0, -0.01, 0]} r={0.004}>{M.wood({ base: [140, 98, 58] })}</RBox>
    <mesh position={[0.22, 0.3, -0.12]}><cylinderGeometry args={[0.014, 0.014, 0.2, 16]} />{M.chrome()}</mesh>
    <mesh position={[0.18, 0.2, -0.12]} rotation={[0, 0, 0]}><torusGeometry args={[0.04, 0.014, 12, 24, PI]} />{M.chrome()}</mesh>
    {/* las dos puertas que se abren hacia la cámara */}
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.38, 0.18, 0.21]} rotation={[0, sd * -door * 1.9, 0]}>
      <RBox s={[0.38, 0.4, 0.02]} p={[-sd * 0.19, 0, 0]} r={0.006}><meshStandardMaterial color="#e9e1cf" roughness={0.6} /></RBox>
      <mesh position={[-sd * 0.34, 0, 0.015]}><sphereGeometry args={[0.01, 12, 8]} />{M.brass()}</mesh>
    </group>)}
    {/* vinagre, bicarbonato, jabón en barra, sal */}
    <group position={[-0.25, 0.12 * (1 - it[0]), 0]} scale={Math.max(0.001, it[0])}><Bottle s={1.2} /></group>
    <group position={[-0.08, 0.12 * (1 - it[1]), 0.02]} scale={Math.max(0.001, it[1]) * 1.4}><SodaBox /></group>
    <group position={[0.08, 0.025 + 0.12 * (1 - it[2]), 0.04]} scale={Math.max(0.001, it[2])}>
      <RBox s={[0.1, 0.045, 0.06]} p={[0, 0, 0]} r={0.01}><meshStandardMaterial color="#efd36a" roughness={0.45} /></RBox>
    </group>
    <group position={[0.23, 0.12 * (1 - it[3]), 0.0]} scale={Math.max(0.001, it[3])}>
      <mesh position={[0, 0.075, 0]}><cylinderGeometry args={[0.04, 0.04, 0.15, 32]} /><meshStandardMaterial color="#2f5f9e" roughness={0.6} /></mesh>
      <mesh position={[0, 0.152, 0]}><cylinderGeometry args={[0.041, 0.041, 0.006, 32]} />{M.steel()}</mesh>
      <mesh position={[0.02, 0.157, 0]}><coneGeometry args={[0.006, 0.01, 8]} />{M.steel()}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 2:02 · EL DIARIO ARRUGADO: el bollo de papel pasa por el vidrio empañado y donde pasa queda transparente, sin una veta ----
export const HNewspaper: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#8fb3cf" key1={[-0.6, 1.2, 1.6]}
  cam={{ at: [0, 0.0, 0], az: [0.18, -0.1], el: [0.08, 0.04], r: [0.92, 0.82], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.4, 4.8), path = (u: number) => { const row = Math.min(3, Math.floor(u * 4)), f = u * 4 - row, dir = row % 2 ? -1 : 1; return [dir * lerp(-0.26, 0.26, f), 0.2 - row * 0.13]; };
  const [px, py] = path(k), news = tex.text("newsball", 256, 256, (g) => { g.fillStyle = "#ece6d6"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#3a3632"; for (let y = 8; y < 256; y += 12) for (let x = 6; x < 250; x += 40) g.fillRect(x, y, 30 + rn(x + y, 2) * 6, 4); g.font = "900 34px Georgia"; g.fillText("DAILY", 60, 50); });
  return <>
    {/* marco de ventana de madera y el paisaje detrás */}
    <mesh position={[0, 0, -0.3]}><planeGeometry args={[2.4, 1.4]} /><meshBasicMaterial map={tex.text("farmview", 512, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#9cc4e4"); gr.addColorStop(0.55, "#d8e8f0"); gr.addColorStop(0.56, "#7a9a4a"); gr.addColorStop(1, "#5a7a34"); g.fillStyle = gr; g.fillRect(0, 0, 512, 256); g.fillStyle = "#a8322a"; g.fillRect(330, 100, 90, 46); g.beginPath(); g.moveTo(320, 100); g.lineTo(375, 70); g.lineTo(430, 100); g.fill(); })} /></mesh>
    {[[-0.36, 0, 0.04, 0.68], [0.36, 0, 0.04, 0.68], [0, 0.32, 0.76, 0.04], [0, -0.32, 0.76, 0.04]].map(([x, y, w, hh], i) => <RBox key={i} s={[w, hh, 0.04]} p={[x, y, 0]} r={0.006}><meshStandardMaterial color="#f1ece2" roughness={0.6} /></RBox>)}
    {/* vidrio empañado en mosaico: cada pastilla se limpia cuando el bollo pasa cerca */}
    {Array.from({ length: 14 * 8 }, (_, i) => { const cx = -0.315 + (i % 14) * 0.0485, cy = 0.27 - Math.floor(i / 14) * 0.078; let clean = 0;
      for (let s = 0; s <= 40; s++) { const u = (s / 40) * k, [qx, qy] = path(u); if (Math.hypot(qx - cx, (qy - cy) * 0.8) < 0.07) { clean = 1; break; } }
      return <mesh key={i} position={[cx, cy, 0.002]}><planeGeometry args={[0.0486, 0.079]} /><meshStandardMaterial color="#8f8574" transparent opacity={clean ? 0 : 0.88} roughness={1} depthWrite={false} /></mesh>; })}
    {/* el bollo de diario, girando y aplastándose contra el vidrio */}
    <mesh position={[px, py, 0.05]} rotation={[tt * 3, tt * 2, tt]} scale={[1.05, 1, 0.75]}><icosahedronGeometry args={[0.085, 1]} /><meshStandardMaterial map={news} roughness={0.95} flatShading /></mesh>
  </>;
}}</Scene3D>;

// ---- 2:20 · AL SOL SE VETEA: el mismo vidrio; al sol el agua se seca en segundos y deja vetas blancas, a la sombra queda limpio ----
export const HSunstreak: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#2a2f36" key1={[-1.4, 1.2, 1.2]}
  cam={{ at: [0, 0.0, 0], az: [-0.1, 0.1], el: [0.06, 0.04], r: [0.95, 0.86], fov: 30 }}>{(tt) => {
  const dry = eio(tt, 1.0, 3.2), sun = eio(tt, 0.2, 0.9);
  return <>
    {/* dos hojas de ventana; la izquierda recibe el sol */}
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.22, 0, 0]}>
      {[[-0.19, 0, 0.03, 0.56], [0.19, 0, 0.03, 0.56], [0, 0.265, 0.41, 0.03], [0, -0.265, 0.41, 0.03]].map(([x, y, w, hh], i) => <RBox key={i} s={[w, hh, 0.03]} p={[x, y, 0]} r={0.004}><meshStandardMaterial color="#f1ece2" roughness={0.6} /></RBox>)}
      <mesh position={[0, 0, -0.005]}><planeGeometry args={[0.36, 0.5]} />{M.glass({ op: 0.15, col: sd < 0 ? "#fff3d6" : "#e2ecf4" })}</mesh>
      {/* gotas de agua con vinagre: al sol se achican rápido y dejan veta; a la sombra se van con el trapo */}
      {Array.from({ length: 14 }, (_, i) => { const x = (rn(i * 3 + sd, 2) - 0.5) * 0.3, y = (rn(i * 3 + sd, 3) - 0.5) * 0.42, run = 0.08 * eio(tt, 0.3 + i * 0.03, 1.4);
        return <group key={i}>
          <mesh position={[x, y - run, 0.004]} scale={[1, 1.5, 0.6]} visible={sd < 0 ? dry < 0.95 : tt < 3.6}><sphereGeometry args={[0.011 * (sd < 0 ? 1 - dry * 0.9 : 1), 12, 8]} />{M.water({ op: 0.8 })}</mesh>
          {sd < 0 && <mesh position={[x, y - run / 2, 0.003]}><planeGeometry args={[0.006, run + 0.01]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85 * dry} /></mesh>}
        </group>; })}
      {sd > 0 && <mesh visible={tt > 3.4} position={[lerp(-0.2, 0.2, eio(tt, 3.4, 4.6)), 0, 0.02]}><boxGeometry args={[0.08, 0.5, 0.012]} /><meshStandardMaterial color="#ece6d6" roughness={1} /></mesh>}
    </group>)}
    {/* el sol: disco caliente y su rayo sobre la hoja izquierda */}
    <mesh position={[-0.62, 0.38, -0.2]}><circleGeometry args={[0.07 * sun + 0.001, 32]} />{M.glow({ col: "#ffd76a" })}</mesh>
    <mesh position={[-0.36, 0.16, -0.05]} rotation={[0, 0, 0.7]}><planeGeometry args={[0.24, 0.9]} />{M.glow({ col: "#ffe2a0", op: 0.22 * sun })}</mesh>
  </>;
}}</Scene3D>;

// ---- 2:51 · LAS CÁSCARAS EN EL FRASCO: las tiras de limón caen al vinagre y el frasco se pone amarillo de a poco ----
export const HPeeljar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#1f1a15" lamp={[0.2, 0.45, 0.3]}
  cam={{ at: [0, 0.1, 0], az: [-0.2, 0.15], el: [0.24, 0.18], r: [0.6, 0.52], fov: 30 }}>{(tt) => {
  const tint = eio(tt, 2.4, 5.2), liq = `rgb(${Math.round(lerp(242, 246, tint))},${Math.round(lerp(236, 206, tint))},${Math.round(lerp(214, 72, tint))})`;
  return <>
    <group scale={1.3}><Jar fill={0.85} liq={liq} lid={1 - eio(tt, 4.6, 5.3)}>
      {/* tiras de cáscara: caen en espiral y quedan flotando a distintas alturas */}
      {Array.from({ length: 9 }, (_, i) => { const k = phys(tt, 0.3 + i * 0.22, 6, 0.6), y = lerp(0.3, 0.02 + (i % 5) * 0.022, k);
        return <mesh key={i} position={[Math.cos(i * 2.2) * 0.028, y, Math.sin(i * 2.2) * 0.028]} rotation={[i, i * 0.7 + tt * 0.2 * (1 - k), 0.5]}>
          <torusGeometry args={[0.018, 0.0045, 6, 16, PI * 1.2]} /><meshPhysicalMaterial color="#f2c81e" roughness={0.45} clearcoat={0.4} /></mesh>; })}
      {/* burbujitas que suben mientras toma color */}
      {Array.from({ length: 10 }, (_, i) => { const u = ((tt * 0.4 + rn(i, 2)) % 1); return <mesh key={"b" + i} visible={tt > 2} position={[(rn(i, 3) - 0.5) * 0.08, 0.01 + u * 0.11, (rn(i, 4) - 0.5) * 0.08]}><sphereGeometry args={[0.003, 8, 6]} />{M.glass({ op: 0.5 })}</mesh>; })}
    </Jar></group>
    {/* los dos limones pelados al costado */}
    {[0, 1].map((i) => <mesh key={i} position={[0.17 + i * 0.07, 0.03, 0.05 - i * 0.06]} scale={[1.1, 0.9, 0.9]}><sphereGeometry args={[0.032, 24, 16]} /><meshStandardMaterial color="#f7ecc0" roughness={0.6} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 3:26 · EL MÁRMOL: el piso de mármol brilla; cae el vinagre, burbujea, y al secar quedan manchas opacas que no se van ----
export const HMarble: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#20242a" key1={[-0.3, 1.6, 1.0]}
  cam={{ at: [0, 0, 0], az: [0.25, 0.1], el: [0.5, 0.42], r: [0.78, 0.66], fov: 30 }}>{(tt) => {
  const marble = tex.text("marblec2", 512, 512, (g) => { g.fillStyle = "#26332e"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(226,228,214,.55)"; for (let i = 0; i < 14; i++) { g.lineWidth = 1 + rn(i, 2) * 3; g.beginPath(); let x = rn(i, 3) * 512, y = 0; g.moveTo(x, y); while (y < 512) { x += (rn(i * 50 + y, 4) - 0.5) * 60; y += 30; g.lineTo(x, y); } g.stroke(); } });
  const SP = [[-0.12, 0.02], [0.02, -0.06], [0.13, 0.05]];
  return <>
    <RBox s={[0.9, 0.04, 0.6]} p={[0, -0.02, 0]} r={0.004}><meshPhysicalMaterial map={marble} roughness={0.06} clearcoat={1} clearcoatRoughness={0.02} /></RBox>
    {SP.map(([x, z], i) => { const a = 0.6 + i * 0.7, fall = cl((tt - a) / 0.35), fizz = eio(tt, a + 0.35, a + 1.6), dull = eio(tt, a + 1.6, a + 2.4);
      return <group key={i}>
        {/* gota que cae del pico de la botella */}
        <mesh visible={fall > 0 && fall < 1} position={[x, lerp(0.3, 0.01, fall), z]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.01, 12, 8]} />{M.water({ op: 0.85, col: "#f4eed8" })}</mesh>
        {/* charquito que efervesce y se seca */}
        <mesh visible={fall >= 1 && dull < 1} position={[x, 0.0015, z]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.038, 32]} />{M.water({ op: 0.55 * (1 - dull), col: "#f4eed8" })}</mesh>
        {fall >= 1 && fizz < 1 && Array.from({ length: 8 }, (_, k) => <mesh key={k} position={[x + Math.cos(k * 0.8) * 0.022 * rn(k, 2), 0.004 + 0.01 * ((tt * 3 + rn(k, 3)) % 1), z + Math.sin(k * 0.8) * 0.022 * rn(k, 4)]}><sphereGeometry args={[0.0035, 8, 6]} />{M.glass({ op: 0.7 })}</mesh>)}
        {/* la mancha opaca, mate y blanquecina, que queda grabada en la piedra */}
        <mesh visible={dull > 0.02} position={[x, 0.0012, z]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.038, 32]} /><meshStandardMaterial color="#a9b1a8" roughness={1} transparent opacity={0.95 * dull} /></mesh>
      </group>; })}
    {/* la botella que gotea, arriba, pasando de mancha en mancha */}
    <group position={[lerp(-0.12, 0.13, eio(tt, 0.4, 2.2)), 0.36, 0]} rotation={[0, 0, 2.4]} visible={tt < 2.6}><Bottle s={0.9} /></group>
  </>;
}}</Scene3D>;

// ---- 4:14 · LA SAL FRIEGA: el salero cubre la mancha de la pileta enlozada y el cepillo la levanta en círculos ----
export const HSinkscrub: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="none" bg="#1c1e22" key1={[-0.5, 1.6, 1.2]}
  cam={{ at: [0, -0.02, 0], az: [0.15, -0.1], el: [0.95, 0.85], r: [0.78, 0.66], fov: 30 }}>{(tt) => {
  const shake = eio(tt, 0.3, 1.8), scrub = eio(tt, 2.0, 5.0), ang = scrub * PI * 6, bx = Math.cos(ang) * 0.07 * (1 - scrub * 0.3), bz = Math.sin(ang) * 0.05;
  return <group position={[0, 0.03, 0]}>{/* +3 cm: la tapa de la pileta coincidía con la mesada (z-fighting, 60 destellos en el farm) */}
    {/* la pileta enlozada blanca: borde y bacha */}
    <RBox s={[0.8, 0.04, 0.56]} p={[0, -0.02, 0]} r={0.02}>{M.porcelain({ col: "#3f6684" })}</RBox>
    <mesh position={[0, 0.004, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.4]} /><meshPhysicalMaterial color="#4d7898" roughness={0.15} clearcoat={0.8} /></mesh>
    <mesh position={[0.2, 0.008, 0.1]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.015, 0.024, 24]} />{M.chrome()}</mesh>
    {/* la mancha gris-óxido: se borra donde pasó el cepillo */}
    {Array.from({ length: 70 }, (_, i) => { const x = (rn(i, 2) - 0.5) * 0.24, z = (rn(i, 3) - 0.5) * 0.16, a2 = Math.atan2(z / 0.05, x / 0.07), clean = scrub * PI * 6 > ((a2 + PI * 2) % (PI * 2)) + PI * 2 * Math.floor(rn(i, 4) * 2.4);
      return <mesh key={i} visible={!clean} position={[x, 0.008 + i * 0.00005, z]} rotation={[-PI / 2, 0, rn(i, 5) * 3]}><circleGeometry args={[0.014 + 0.012 * rn(i, 6), 10]} /><meshStandardMaterial color={rn(i, 7) > 0.5 ? "#9a6a3e" : "#7a7266"} roughness={1} transparent opacity={0.75} /></mesh>; })}
    {/* granos de sal que caen y quedan */}
    {Array.from({ length: 120 }, (_, i) => { const a = 0.3 + (i / 120) * 1.5, k = cl((tt - a) / 0.3), x = (rn(i, 8) - 0.5) * 0.24, z = (rn(i, 9) - 0.5) * 0.16;
      return <mesh key={"s" + i} visible={k > 0 && !(scrub > 0.3 && rn(i, 10) < scrub)} position={[x, lerp(0.25, 0.013, k), z]} rotation={[i, i, 0]}><boxGeometry args={[0.005, 0.004, 0.005]} /><meshStandardMaterial color="#ffffff" roughness={0.3} /></mesh>; })}
    {/* salero de vidrio con tapa de lata, sacudiéndose */}
    <group visible={tt < 2.0} position={[0.02 * Math.sin(tt * 30) * (shake < 1 ? 1 : 0), 0.3, 0]} rotation={[PI, 0, 0.2]}>
      <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.025, 0.028, 0.08, 24]} />{M.glass({ op: 0.4 })}</mesh>
      <mesh position={[0, -0.005, 0]}><cylinderGeometry args={[0.027, 0.027, 0.014, 24]} />{M.steel()}</mesh>
    </group>
    {/* cepillo de raíz con cerdas */}
    <group visible={tt > 1.9} position={[bx, 0.04, bz]} rotation={[0, ang * 0.2, 0]}>
      <RBox s={[0.12, 0.03, 0.05]} p={[0, 0.02, 0]} r={0.012}>{M.wood({ base: [176, 128, 74] })}</RBox>
      {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[-0.05 + (i % 8) * 0.0145, -0.002, -0.016 + Math.floor(i / 8) * 0.016]}><cylinderGeometry args={[0.004, 0.004, 0.022, 6]} /><meshStandardMaterial color="#d8c08a" roughness={0.9} /></mesh>)}
    </group>
  </group>;
}}</Scene3D>;

// ---- 5:01 · COMO GLASEADO ESPESO: el agua cae sobre el bicarbonato y la cuchara lo bate hasta que hace picos ----
export const HFrosting: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#201a15" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.05, 0], az: [0.2, -0.1], el: [0.62, 0.55], r: [0.52, 0.46], fov: 30 }}>{(tt) => {
  const pour = eio(tt, 0.4, 1.6), mix = eio(tt, 1.6, 4.6), ang = tt * 7, peaks = eio(tt, 3.4, 5.0);
  return <>
    {/* bol de loza azul */}
    <mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.13, 40, 20, 0, PI * 2, PI / 2, PI / 2]} /><meshPhysicalMaterial color="#3d6ea8" roughness={0.2} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.05, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.13, 0.006, 8, 48]} /><meshPhysicalMaterial color="#f4f1ea" roughness={0.2} clearcoat={0.8} /></mesh>
    {/* el polvo: montaña que se aplana y se vuelve pasta con picos */}
    <mesh position={[0, 0.0 + 0.012 * mix, 0]} scale={[1, lerp(0.7, 0.35, mix), 1]}>
      <sphereGeometry args={[0.1, 48, 24, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color={mix > 0.3 ? "#fbf8ef" : "#f6f4ee"} roughness={lerp(1, 0.35, mix)} clearcoat={0.3 * mix} />
    </mesh>
    {Array.from({ length: 16 }, (_, i) => { const a = i * 2.4, r = 0.025 + 0.055 * rn(i, 2); return <mesh key={i} visible={peaks > 0.02} position={[Math.cos(a) * r, 0.04 + 0.006 * mix, Math.sin(a) * r]} rotation={[0, a, 0.3 * (rn(i, 3) - 0.5)]} scale={[1, peaks + 0.001, 1]}><coneGeometry args={[0.012, 0.03, 10]} /><meshPhysicalMaterial color="#fbf8ef" roughness={0.4} /></mesh>; })}
    {/* chorro de agua desde la taza */}
    <mesh visible={pour > 0.02 && pour < 0.98} position={[0.03, 0.15, 0]}><cylinderGeometry args={[0.004, 0.006, 0.2, 10]} />{M.water({ op: 0.7 })}</mesh>
    <group visible={tt < 1.8} position={[0.08, 0.28, 0]} rotation={[0, 0, 1.9 * pour]}>
      <mesh><cylinderGeometry args={[0.035, 0.03, 0.06, 28, 1, true]} />{M.porcelain({ col: "#f4f1ea", side: THREE.DoubleSide })}</mesh>
    </group>
    {/* cuchara de madera que bate en círculos */}
    <group visible={tt > 1.6} position={[Math.cos(ang) * 0.04, 0.12, Math.sin(ang) * 0.04]} rotation={[0.35 * Math.sin(ang), 0, 0.35 * Math.cos(ang)]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.006, 0.007, 0.18, 10]} />{M.wood({ base: [190, 146, 92] })}</mesh>
      <mesh position={[0, -0.04, 0]} scale={[1, 0.4, 1.4]}><sphereGeometry args={[0.022, 16, 10]} />{M.wood({ base: [190, 146, 92] })}</mesh>
    </group>
  </>;
}}</Scene3D>;
