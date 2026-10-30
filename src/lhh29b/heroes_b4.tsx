// lhh29b · componentes únicos 25-32 (kit h3d): la servilleta que amarillea de 1934 a los 60, las servilletas al sol sobre el pasto,
// la mancha con forma de clavo, la secadora que fija la mancha, los agujeritos del rallador, el bordado del refrán, los dos candelabros y la laca de bronce.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn, tubeG } from "./h3d";
import { LemonHalf, lathe, SERIF } from "./lemonkit";

const PI = Math.PI;
const linen = (k: string, base: string) => tex.text("linen" + k, 256, 256, (g) => { g.fillStyle = base; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = "rgba(120,100,70,.10)"; for (let i = 0; i < 128; i++) { g.beginPath(); g.moveTo(i * 2, 0); g.lineTo(i * 2, 256); g.stroke(); g.beginPath(); g.moveTo(0, i * 2); g.lineTo(256, i * 2); g.stroke(); }
  g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 3; for (let i = 0; i < 32; i++) { g.beginPath(); g.arc(i * 8 + 4, 248, 4, PI, 0); g.stroke(); g.beginPath(); g.arc(i * 8 + 4, 8, 4, 0, PI); g.stroke(); } });

// ---- 13:03 · DE 1934 A LOS 60: una servilleta de lino de regalo de bodas gira sobre la cómoda; el año corre y el blanco se vuelve amarillo viejo ----
export const HYellowing: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.2, 0.4, 0.4]}
  cam={{ at: [-0.05, 0.06, -0.02], az: [0.4, -0.15], el: [0.5, 0.42], r: [0.62, 0.54], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="WEDDING LINEN, 1934" col={AMB} />
    </>}>{(tt, u) => {
  const y = eio(u, 0.08, 0.9), q = Math.round(y * 6), yf = lerp(1934, 1965, y), yr = Math.floor(yf), fr = yf - yr;
  const pg = (n: number) => tex.text("yr" + n, 256, 320, (g) => { g.fillStyle = "#fbf6ea"; g.fillRect(0, 0, 256, 320); g.fillStyle = "#7a1f2b"; g.fillRect(0, 0, 256, 70); g.fillStyle = "#fbf6ea"; g.font = "bold 40px " + SERIF; g.fillText("JUNE", 78, 50);
    g.fillStyle = "#1d1d1d"; g.font = "bold 92px " + SERIF; g.fillText(String(n), 22, 210); for (let i = 0; i < 4; i++) { g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(30, 240 + i * 18, 196, 3); } });
  const col = new THREE.Color("#fbfaf4").lerp(new THREE.Color("#e6d08a"), q / 6).getStyle();
  return <>
    {[0, 1, 2].map((i) => <RBox key={i} s={[0.22, 0.006, 0.22]} p={[0.005 * i, 0.003 + i * 0.006, -0.004 * i]} rot={[0, 0.04 * i, 0]} r={0.002}><meshStandardMaterial map={linen("y" + q, col)} roughness={0.95} /></RBox>)}
    <group position={[0, 0.03 + 0.02 * Math.sin(tt * 1.2), 0]} rotation={[-PI / 2 + 0.25, 0, tt * 0.25]}>
      <mesh><planeGeometry args={[0.24, 0.24, 12, 12]} /><meshStandardMaterial map={linen("y" + q, col)} roughness={0.95} side={THREE.DoubleSide} /></mesh></group>
    <group position={[-0.17, 0, -0.12]} rotation={[0, 0.5, 0]}>
      <RBox s={[0.13, 0.012, 0.06]} p={[0, 0.006, 0]} r={0.004}>{M.wood({ base: [110, 70, 40] })}</RBox>
      <mesh position={[0, 0.09, 0]}><planeGeometry args={[0.12, 0.15]} /><meshStandardMaterial map={pg(Math.min(1965, yr + 1))} roughness={0.85} /></mesh>
      <group position={[0, 0.165, 0.002]} rotation={[-PI * fr * 1.1, 0, 0]}><mesh position={[0, -0.075, 0]}><planeGeometry args={[0.12, 0.15]} /><meshStandardMaterial map={pg(yr)} roughness={0.85} side={THREE.DoubleSide} /></mesh></group>
      {[-0.04, 0, 0.04].map((x, i) => <mesh key={i} position={[x, 0.166, 0.004]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.006, 0.0012, 6, 16]} />{M.chrome()}</mesh>)}
    </group>
    <pointLight position={[lerp(0.5, -0.3, u), 0.35, 0.3]} intensity={0.15} distance={1.1} color="#fff1cf" />
    <mesh position={[lerp(0.25, -0.15, u), 0.0015, 0.05]} rotation={[-PI / 2, 0, 0.5]}><planeGeometry args={[0.14, 0.6]} />{M.glow({ col: "#fff1cf", op: 0.05 })}</mesh>
    {(() => { const k = phys(tt, 0.4, 6, 0.5); return k > 0 && <group position={[0.2, 0.012, 0.12]} rotation={[0, -0.5, 0]} scale={cl(k)}>
      <RBox s={[0.07, 0.024, 0.045]} r={0.004}><meshStandardMaterial map={tex.text("tag34", 128, 80, (g) => { g.fillStyle = "#f6f0dc"; g.fillRect(0, 0, 128, 80); g.fillStyle = "#7a1f2b"; g.font = "bold 30px " + SERIF; g.fillText("1934", 26, 52); })} roughness={0.8} /></RBox></group>; })()}
  </>;
}}</Scene3D>;

// ---- 13:33 · PLANAS AL SOL, NO COLGADAS: el sol cruza el cielo sobre el pasto; las servilletas tendidas en el piso pasan de amarillas a blancas; la soga, tachada ----
export const HFlatGrass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#c3cfd6"
  cam={{ at: [0, 0.16, -0.2], az: [-0.3, 0.2], el: [0.2, 0.16], r: [1.15, 1.0], fov: 32 }}
  over={(tt) => <><Head tt={tt} kick="" title="FLAT ON THE GRASS" col={GRN} />
    </>}>{(tt, u) => {
  const s = eio(u, 0.05, 0.92), q = Math.round(s * 6), sa = lerp(-1.1, 1.1, s);
  const grass = tex.text("grass6", 512, 512, (g) => { g.fillStyle = "#4a4635"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(90,80,55,${0.08 * rn(i, 9)})`; g.beginPath(); g.arc(rn(i, 10) * 512, rn(i, 11) * 512, 4 + 10 * rn(i, 12), 0, 6.3); g.fill(); } for (let i = 0; i < 7000; i++) { g.strokeStyle = `rgba(${86 + rn(i, 2) * 12},${90 + rn(i, 3) * 10},${58 + rn(i, 8) * 8},.35)`; g.beginPath(); const x = rn(i, 4) * 512, y = rn(i, 5) * 512; g.moveTo(x, y); g.lineTo(x + (rn(i, 6) - 0.5) * 5, y - 6 - 8 * rn(i, 7)); g.stroke(); } });
  const col = new THREE.Color("#e6d08a").lerp(new THREE.Color("#ffffff"), q / 6).getStyle();
  return <>
    <directionalLight position={[Math.sin(sa) * 2, Math.cos(sa) * 2, 0.6]} intensity={0.8} color="#fff1c8" />
    <mesh position={[Math.sin(sa) * 0.7, 0.47 + 0.03 * Math.cos(sa), -1.3]}><sphereGeometry args={[0.05, 24, 16]} />{M.glow({ col: "#ffd23a" })}</mesh>
    <mesh position={[Math.sin(sa) * 0.7, 0.47 + 0.03 * Math.cos(sa), -1.31]}><circleGeometry args={[0.12, 32]} />{M.glow({ col: "#ffe08a", op: 0.45 })}</mesh>
    
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial map={grass} roughness={1} bumpMap={grass} bumpScale={4} /></mesh>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} rotation={[-PI / 2, 0, (rn(i, 2) - 0.5) * 0.3]} position={[-0.3 + (i % 3) * 0.3, 0.004, -0.08 + Math.floor(i / 3) * 0.24]}>
      <planeGeometry args={[0.2, 0.2]} /><meshStandardMaterial map={linen("g" + q, col)} roughness={0.95} /></mesh>)}
    <group position={[0, -0.1, -0.12]} scale={1.12}>
      {[-0.5, 0.5].map((x, i) => <mesh key={i} position={[x, 0.2, 0]}><cylinderGeometry args={[0.012, 0.012, 0.4, 10]} />{M.wood({ base: [120, 90, 60] })}</mesh>)}
      <mesh position={[0, 0.38, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.002, 0.002, 1.0, 6]} /><meshStandardMaterial color="#e8e2d2" /></mesh>
      {[-0.3, 0, 0.3].map((x, i) => <group key={"l" + i} position={[x, 0.38, 0]} rotation={[0.12 * Math.sin(tt * 1.6 + i), 0, 0.03 * Math.sin(tt * 1.1 + i * 2)]}>
        <mesh position={[0, -0.12, 0]}><planeGeometry args={[0.27, 0.24, 8, 8]} /><meshStandardMaterial map={linen("h" + i + "0", "#e6d08a")} roughness={0.95} side={THREE.DoubleSide} /></mesh>
        {[-0.08, 0.08].map((cx, j) => <mesh key={j} position={[cx, 0, 0.004]}><boxGeometry args={[0.008, 0.03, 0.008]} />{M.wood({ base: [190, 160, 120] })}</mesh>)}</group>)}
      {u > 0.45 && [-0.4, 0.4].map((r, i) => <mesh key={"x" + i} position={[0, 0.27, 0.03]} rotation={[0, 0, r * 1.6]}><boxGeometry args={[0.36 * eio(u, 0.45 + i * 0.08, 0.55 + i * 0.08), 0.02, 0.008]} />{M.glow({ col: "#e0302a" })}</mesh>)}</group>
  </>;
}}</Scene3D>;

// ---- 14:39 · LA MANCHA DEL CLAVO: el hombro de la camisa blanca dominguera; sale el clavo oxidado y queda su silueta marrón; limón y sal la van borrando ----
export const HNailStain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" lamp={[0.35, 0.45, 0.3]}
  cam={{ at: [0, 0.16, 0], az: [0.3, 0.1], el: [0.12, 0.08], r: [0.62, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="THE SHAPE OF A NAIL" col={RED} />
    </>}>{(tt, u) => {
  const out = eio(u, 0.04, 0.22), fade = eio(u, 0.55, 0.95), salt = cl((u - 0.42) / 0.12);
  const rust = tex.text("nailrust", 128, 384, (g) => { g.clearRect(0, 0, 128, 384); for (let i = 0; i < 220; i++) { const y = 40 + rn(i, 2) * 320, x = 64 + (rn(i, 3) - 0.5) * (14 + 30 * rn(i, 4)); g.fillStyle = `rgba(${120 + rn(i, 5) * 40},${55 + rn(i, 6) * 30},20,${0.12 + 0.2 * rn(i, 7)})`; g.beginPath(); g.arc(x, y, 4 + 10 * rn(i, 8), 0, 6.3); g.fill(); }
    g.fillStyle = "rgba(110,50,18,.75)"; g.fillRect(58, 60, 12, 300); g.beginPath(); g.arc(64, 52, 22, 0, 6.3); g.fill(); });
  const shirt = tex.text("shirt5", 256, 256, (g) => { g.fillStyle = "#4e5b6a"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(160,160,170,.25)"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 90); g.bezierCurveTo(90, 70, 170, 70, 256, 100); g.stroke();
    for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(40 + i * 40, 100); g.lineTo(30 + i * 42, 256); g.strokeStyle = "rgba(170,170,180,.12)"; g.stroke(); } });
  return <group position={[0, 0.12, 0]}>
    <mesh rotation={[0, 0, 0.12]}><planeGeometry args={[0.42, 0.3, 20, 10]} /><meshStandardMaterial map={shirt} roughness={0.95} bumpMap={tex.paper(8, 8)} bumpScale={3} /></mesh>
    <mesh position={[0, 0.06, 0.001]} rotation={[0, 0, 0.1]}><planeGeometry args={[0.09, 0.2]} /><meshStandardMaterial map={rust} transparent opacity={(1 - 0.92 * fade) * cl(out * 2)} roughness={1} depthWrite={false} /></mesh>
    <mesh position={[0.06, 0.1, 0.03]} rotation={[0, 0, -0.6]}><planeGeometry args={[0.12, 0.7]} />{M.glow({ col: "#fff0c0", op: 0.1 })}</mesh>
    <pointLight position={[0.2, 0.3, 0.2]} intensity={0.5} distance={0.8} color="#fff0c0" />
    <group position={[0, 0.05, 0.005 + out * 0.25]} rotation={[0.1, 0, 0.1]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.004, 0.004, 0.11, 10]} /><meshStandardMaterial map={tex.rust()} metalness={0.5} roughness={0.8} /></mesh></group>
    {u > 0.26 && <LemonHalf p={[lerp(0.12, 0.015 * Math.sin(u * 60), eio(u, 0.5, 0.58) * (1 - eio(u, 0.9, 0.97))), lerp(0.09 - 0.03 * eio(u, 0.26, 0.34), 0.07 + 0.03 * Math.cos(u * 45), eio(u, 0.5, 0.58) * (1 - eio(u, 0.9, 0.97))), 0.05]} rot={[PI / 2 + 0.3, 0, 0.4]} s={1.2} squeeze={eio(u, 0.3, 0.4)} />}
    {Array.from({ length: 30 }, (_, i) => { const y = lerp(0.2, 0.02 + rn(i, 2) * 0.09, salt); return salt > 0 && <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.06, y, 0.004 + (1 - salt) * 0.05]}><boxGeometry args={[0.003, 0.003, 0.003]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.4} /></mesh>; })}
    <pointLight position={[0.3, 0.25, 0.25]} intensity={0.45 * fade} distance={1} color="#fff1b0" />
  </group>;
}}</Scene3D>;

// ---- 15:00 · EL CALOR LA FIJA: la camisa manchada gira en el tambor de la secadora; el calor se enciende naranja y la mancha se oscurece para siempre ----
export const HDryerLock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile"
  cam={{ at: [0.04, 0.2, 0.05], az: [-0.25, 0.15], el: [0.14, 0.1], r: [1.05, 0.95], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="HEAT SETS IT FOREVER" col={RED} />
    </>}>{(tt, u) => {
  const heat = eio(u, 0.08, 0.42), set = eio(u, 0.3, 0.55), ou = eio(u, 0.72, 0.95);
  const drumT = tex.text("drum2", 256, 256, (g) => { g.fillStyle = "#6a6c70"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#26282b"; for (let y = 8; y < 256; y += 16) for (let x = 8 + (y % 32 ? 8 : 0); x < 256; x += 16) { g.beginPath(); g.arc(x, y, 3, 0, 6.29); g.fill(); } });
  return <>
    <RBox s={[0.42, 0.44, 0.36]} p={[0, 0.22, -0.18]} r={0.02}>{M.porcelain({ col: "#f2f2ef" })}</RBox>
    {(() => { const door = eio(u, 0.58, 0.7); return <group position={[-0.13, 0.2, 0.004]} rotation={[0, -1.7 * door, 0]}>
      <mesh position={[0.13, 0, 0]}><torusGeometry args={[0.13, 0.016, 16, 64]} />{M.chrome({})}</mesh>
      <mesh position={[0.13, 0, 0]}><circleGeometry args={[0.122, 64]} />{M.glass({ op: 0.18 })}</mesh></group>; })()}
    <mesh position={[0, 0.2, 0.016]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.122, 0.122, 0.03, 48, 1, true]} /><meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.35} side={THREE.BackSide} emissive="#ff6a1a" emissiveIntensity={0.25 * heat * (1 - ou)} /></mesh>
    <mesh position={[0, 0.2, 0.0015]}><circleGeometry args={[0.122, 64]} /><meshStandardMaterial map={drumT} color="#4a4c50" metalness={0.7} roughness={0.35} emissive="#ff5a1a" emissiveIntensity={0.6 * heat * (1 - ou)} /></mesh>
    <pointLight position={[0, 0.2, 0.05]} intensity={1.2 * heat * (1 - ou)} distance={0.3} color="#ff7a2a" />
    {heat > 0.05 && Array.from({ length: 10 }, (_, i) => { const d = ((u * 5 + rn(i, 81)) % 1); return <mesh key={"hw" + i} position={[(rn(i, 82) - 0.5) * 0.16, 0.12 + d * 0.16, 0.02]}><sphereGeometry args={[0.006, 8, 6]} />{M.glow({ col: "#ffa040", op: 0.6 * (1 - d) * heat * (1 - ou) })}</mesh>; })}
    <pointLight position={[-0.45, 0.25, 0.4]} intensity={1.4 * ou} distance={1.2} color="#fff0d8" />
    {u > 0.6 && <group position={[0.06 + 0.02 * ou, 0.17 - 0.03 * ou + 0.2 * (1 - eio(u, 0.6, 0.7)), 0.03 + 0.2 * ou]} rotation={[0, 0, -0.4]} scale={1.1}>
      <RBox s={[0.07, 0.06, 0.025]} p={[0.03, 0.045, 0]} r={0.012}><meshPhysicalMaterial color="#d9a888" roughness={0.6} sheen={0.5} /></RBox>
      {[-0.022, -0.007, 0.008, 0.023].map((x, i) => <mesh key={i} position={[x + 0.03, 0.0, 0.01]}><capsuleGeometry args={[0.0075, 0.035, 6, 12]} /><meshPhysicalMaterial color="#d9a888" roughness={0.6} sheen={0.5} /></mesh>)}
      <mesh position={[0.07, 0.03, 0.01]} rotation={[0, 0, -0.9]}><capsuleGeometry args={[0.008, 0.03, 6, 12]} /><meshPhysicalMaterial color="#d9a888" roughness={0.6} sheen={0.5} /></mesh>
      <mesh position={[0.05, 0.13, 0]}><cylinderGeometry args={[0.032, 0.036, 0.11, 16]} /><meshStandardMaterial color="#6a7c94" roughness={0.9} /></mesh></group>}
    <group position={[0.02 * ou, 0.2 - 0.03 * ou, 0.01 + 0.2 * ou]} rotation={[0, 0, Math.min(u, 0.72) * 14]} scale={1 + 0.25 * ou}>
      {false && <group position={[0.1, 0.065, 0.012]} rotation={[0, 0, -0.5]}>
        <RBox s={[0.06, 0.05, 0.02]} p={[0.03, 0.035, 0]} r={0.01}><meshPhysicalMaterial color="#d9a888" roughness={0.6} sheen={0.5} /></RBox>
        {[-0.018, -0.006, 0.006, 0.018].map((x, i) => <mesh key={i} position={[x + 0.03, 0.0, 0.008]}><capsuleGeometry args={[0.006, 0.03, 6, 12]} /><meshPhysicalMaterial color="#d9a888" roughness={0.6} sheen={0.5} /></mesh>)}
        <mesh position={[0.045, 0.1, 0]}><cylinderGeometry args={[0.026, 0.03, 0.09, 16]} /><meshStandardMaterial color="#6a7c94" roughness={0.9} /></mesh></group>}
      <mesh position={[0.04, 0.02, 0]} rotation={[0, 0, 0.4]}><planeGeometry args={[0.13, 0.1, 6, 6]} /><meshStandardMaterial color="#f7f7f4" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0.05, 0.025, 0.002]}><circleGeometry args={[0.014, 16]} /><meshStandardMaterial color={new THREE.Color("#b46a2a").lerp(new THREE.Color("#4a2208"), set).getStyle()} roughness={1} /></mesh></group>
    <mesh position={[0.13, 0.4, 0.002]}><planeGeometry args={[0.08, 0.025]} />{M.glow({ col: heat > 0.5 ? "#ff6a2a" : "#3a3a3a" })}</mesh>
    {Array.from({ length: 8 }, (_, i) => { const d = ((tt * 0.6 + rn(i, 2)) % 1); return heat > 0.3 && <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.3, 0.44 + d * 0.12, -0.1]}><sphereGeometry args={[0.012, 8, 6]} />{M.glow({ col: "#ff8a3a", op: 0.25 * (1 - d) * heat })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 15:30 · LOS AGUJERITOS: primer plano de la chapa del rallador con queso seco en cada agujero; el limón usado sube y baja y los tapones saltan ----
export const HGraterHoles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" lamp={[0.2, 0.3, 0.4]}
  cam={{ at: [0, 0.06, 0.02], az: [0.35, 0.2], el: [0.3, 0.24], r: [0.66, 0.56], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="DRIED LIKE CEMENT" col={AMB} />
    </>}>{(tt, u) => {
  const ly = 0.1 + 0.08 * Math.sin(Math.max(0, u - 0.06) * 34);
  return <group position={[0, 0.1, 0]}>
    <mesh><planeGeometry args={[0.24, 0.3]} />{M.steel({ col: "#cfd4d8" })}</mesh>
    {Array.from({ length: 48 }, (_, i) => { const c = i % 6, r = Math.floor(i / 6), x = -0.09 + c * 0.036 + (r % 2) * 0.018, y = -0.12 + r * 0.034;
      const hit = Math.abs(y - (ly - 0.1)) < 0.03 && u > 0.06, pop = hit ? 1 : 0, born = cl((u - 0.08 - rn(i, 2) * 0.7) / 0.1);
      return <group key={i} position={[x, y, 0]}>
        <mesh position={[0, 0, 0.0005]}><circleGeometry args={[0.009, 16]} /><meshStandardMaterial color="#0e0f10" /></mesh>
        <mesh position={[0, -0.006, 0.003]} rotation={[0.9, 0, 0]}><torusGeometry args={[0.009, 0.0018, 6, 16, PI]} />{M.steel({})}</mesh>
        {born < 1 && <mesh position={[0, -born * 0.05, 0.004 + born * 0.04]} rotation={[born * 3, born * 2, 0]} scale={1 - 0.3 * born + 0 * pop}><boxGeometry args={[0.012, 0.009, 0.006]} /><meshStandardMaterial color="#e5a83a" roughness={0.7} /></mesh>}
      </group>; })}
    <LemonHalf p={[0.0, ly - 0.1, 0.035]} rot={[-PI / 2, 0, 0]} s={1.5} />
    <group position={[0, -0.17, 0.06]}>
      <mesh rotation={[0, 0, 0]}><cylinderGeometry args={[0.13, 0.1, 0.012, 48]} />{M.porcelain({})}</mesh>
      {Array.from({ length: 160 }, (_, i) => { const on = cl((eio(u, 0.08, 0.92) * 160 - i)); const r = 0.09 * Math.sqrt(rn(i, 2)), a = rn(i, 3) * 6.3; return on > 0 && <mesh key={"z" + i} position={[Math.cos(a) * r, 0.008 + (0.09 - r) * 0.35 + 0.12 * (1 - on), Math.sin(a) * r]} rotation={[rn(i, 4) * 3, rn(i, 5) * 3, 0]}><boxGeometry args={[0.02, 0.004, 0.004]} /><meshStandardMaterial color={rn(i, 6) > 0.5 ? "#f2c63a" : "#e2a82a"} roughness={0.5} emissive="#5a3a00" emissiveIntensity={0.3} /></mesh>; })}
      {Array.from({ length: 14 }, (_, i) => { const d = (u * 6 + rn(i, 2)) % 1; return u > 0.08 && u < 0.92 && <mesh key={"f" + i} position={[(rn(i, 3) - 0.5) * 0.05, 0.12 - d * 0.11, -0.04 + d * 0.04]} rotation={[d * 6, i, 0]}><boxGeometry args={[0.016, 0.004, 0.004]} /><meshStandardMaterial color="#f2c63a" roughness={0.5} /></mesh>; })}</group>
  </group>;
}}</Scene3D>;

// ---- 15:50 · EL BORDADO: un bastidor de madera con lino; la aguja va cosiendo letra por letra «WASTE NOT, WANT NOT» en hilo rojo ----
const MOTTO = "WASTE NOT, WANT NOT";
export const HWasteNot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[-0.2, 0.4, 0.4]}
  cam={{ at: [0, 0.03, 0], az: [0.15, -0.1], el: [0.95, 0.85], r: [0.55, 0.47], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="MOTHER'S RULE" col={RED} /></>}>{(tt, u) => {
  const n = Math.floor(MOTTO.length * eio(u, 0.04, 0.84));
  const cloth = tex.text("motto" + n, 512, 512, (g) => { g.fillStyle = "#efe6d0"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(120,100,70,.12)"; for (let i = 0; i < 256; i++) { g.beginPath(); g.moveTo(i * 2, 0); g.lineTo(i * 2, 512); g.stroke(); }
    g.strokeStyle = "#b3241c"; g.fillStyle = "#b3241c"; g.font = "bold 58px " + SERIF; g.lineWidth = 2; g.setLineDash([6, 4]);
    const a = MOTTO.slice(0, Math.min(n, 10)), b = n > 10 ? MOTTO.slice(11, n) : ""; g.fillText(a, 80, 230); g.strokeText(a, 80, 230); g.fillText(b, 100, 320); g.strokeText(b, 100, 320);
    g.setLineDash([]); for (let i = 0; i < 10; i++) { g.fillStyle = "#3f7a3a"; g.beginPath(); g.ellipse(120 + i * 30, 400 + 8 * Math.sin(i), 10, 5, i, 0, 6.3); g.fill(); } });
  const line = n <= 10 ? 0 : 1, cx = line === 0 ? 80 + n * 31 : 100 + (n - 11) * 32, cy = line === 0 ? 210 : 300;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.012, 0]}><circleGeometry args={[0.16, 64]} /><meshStandardMaterial map={cloth} roughness={0.95} /></mesh>
    {[0.012, 0.02].map((y, i) => <mesh key={i} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.165 + i * 0.006, 0.006, 12, 64]} />{M.wood({ base: [200, 160, 110] })}</mesh>)}
    <mesh position={[0.17, 0.02, 0]}><boxGeometry args={[0.02, 0.014, 0.012]} />{M.brass({})}</mesh>
    {(() => { const dn = eio(u, 0.85, 0.9), nx = lerp(-0.16 + (cx / 512) * 0.32 * 0.94 + 0.006, 0.12, dn), nz = lerp(-0.16 + (cy / 512) * 0.32 + 0.012, 0.13, dn), hy = 0.02 + 0.05 * Math.abs(Math.sin(u * 70)), ey = hy + 0.045;
      return <>
        <group position={[nx, hy, nz]} rotation={[0.55, 0, -0.6]} scale={1.3}>
          <mesh position={[0, 0.02, 0]} castShadow><cylinderGeometry args={[0.0028, 0.0012, 0.09, 10]} />{M.chrome({})}</mesh>
          <mesh position={[0, 0.06, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.003, 0.0012, 6, 12]} />{M.chrome({})}</mesh></group>
        <mesh position={[0.012, 0.0128, 0.012]} scale={[1, 0.001, 1]} geometry={tubeG("thr" + n + "_" + Math.round(hy * 400), [[nx + 0.024, ey, nz + 0.012], [nx + 0.035, ey + 0.012, nz + 0.02], [nx + 0.03, 0.03, nz + 0.015], [nx + 0.01, 0.015, nz + 0.005], [nx - 0.01, 0.013, nz]], 0.0016, 40, 6)}><meshBasicMaterial color="#000" transparent opacity={0.3} depthWrite={false} /></mesh>
        <mesh position={[nx + 0.012, 0.0129, nz + 0.012]} rotation={[-PI / 2, 0, 0.5]}><planeGeometry args={[0.004, 0.06 + 0.02 * hy / 0.07]} /><meshBasicMaterial color="#000" transparent opacity={0.3} depthWrite={false} /></mesh>
        <mesh castShadow geometry={tubeG("thr" + n + "_" + Math.round(hy * 400), [[nx + 0.024, ey, nz + 0.012], [nx + 0.035, ey + 0.012, nz + 0.02], [nx + 0.03, 0.03, nz + 0.015], [nx + 0.01, 0.015, nz + 0.005], [nx - 0.01, 0.013, nz]], 0.0016, 40, 6)}><meshStandardMaterial color="#c42a1e" roughness={0.6} /></mesh>
      </>; })()}
  </>;
}}</Scene3D>;

// ---- 16:56 · DOS CANDELABROS: los dos candelabros altos de bronce sobre el mantel del altar; el de la izquierda empieza oscuro y un brillo lo va puliendo ----
export const HCandlesticks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" lamp={[0, 0.6, 0.4]}
  cam={{ at: [-0.06, 0.27, 0], az: [-0.25, 0.05], el: [0.15, 0.1], r: [1.05, 0.92], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="31 YEARS OF SHINE" col={AMB} />
    </>}>{(tt, u) => {
  const pol = eio(u, 0.1, 0.85), sx = lerp(-0.4, 0.4, eio(u, 0.1, 0.9)), ry = 0.08 + 0.2 * Math.abs(Math.sin(u * 22));
  const stick = lathe([[0, 0], [0.07, 0], [0.07, 0.012], [0.03, 0.03], [0.018, 0.06], [0.026, 0.08], [0.014, 0.1], [0.012, 0.3], [0.024, 0.32], [0.012, 0.33], [0.02, 0.36], [0.022, 0.38], [0, 0.38]], 48);
  return <>
    <RBox s={[0.9, 0.05, 0.3]} p={[0, -0.025, 0]} r={0.01}><meshStandardMaterial color="#f4f1ea" roughness={0.9} /></RBox>
    <mesh position={[0, 0.001, 0.151]}><planeGeometry args={[0.9, 0.05]} /><meshStandardMaterial color="#c9a14a" roughness={0.6} /></mesh>
    <pointLight position={[sx, 0.3, 0.25]} intensity={2.2} distance={0.8} color="#ffffff" />
    {[-0.17, 0.17].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <mesh geometry={stick} castShadow><meshStandardMaterial color={i === 0 ? new THREE.Color("#5e4a28").lerp(new THREE.Color("#d9a84a"), pol).getStyle() : "#d9a84a"} metalness={1} roughness={i === 0 ? lerp(0.7, 0.2, pol) : 0.2} /></mesh>
      <mesh position={[0, 0.44, 0]}><cylinderGeometry args={[0.012, 0.012, 0.12, 20]} /><meshStandardMaterial color="#f7f2e2" roughness={0.6} /></mesh>
      <mesh position={[0, 0.51, 0]} scale={[1, 1.6 + 0.1 * Math.sin(tt * 2 * PI * 1.5 + i), 1]}><sphereGeometry args={[0.008, 12, 10]} />{M.glow({ col: "#ffc35a" })}</mesh>
      {i === 0 && [0, 1, 2, 3, 4].map((k) => { const a = k * 1.25 + 0.3, ln = 0.04 + 0.03 * rn(k, 2); return <mesh key={"w" + k} position={[Math.sin(a) * 0.014, 0.3 - ln / 2 - k * 0.02, Math.cos(a) * 0.014]} scale={[1, Math.max(0.001, 1 - pol), 1]}><capsuleGeometry args={[0.004, ln, 4, 8]} /><meshStandardMaterial color="#f7f2e2" roughness={0.5} /></mesh>; })}
    </group>)}
    {u > 0.08 && u < 0.9 && <group position={[-0.17 + 0.035, ry, 0.035]}>
      <LemonHalf p={[0, 0, 0]} rot={[0, -PI / 2, 0.2]} s={0.7} />
      <RBox s={[0.03, 0.06, 0.05]} p={[0.035, 0, 0.005]} r={0.012}><meshPhysicalMaterial color="#d9a888" roughness={0.6} sheen={0.5} /></RBox>
      {[-0.018, -0.006, 0.006, 0.018].map((y, i) => <mesh key={i} position={[0.012, y, 0.03]} rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.006, 0.026, 6, 12]} /><meshPhysicalMaterial color="#d9a888" roughness={0.6} sheen={0.5} /></mesh>)}
      <mesh position={[0.1, -0.01, 0.01]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.024, 0.028, 0.1, 16]} /><meshStandardMaterial color="#7a5a8a" roughness={0.9} /></mesh></group>}
    {u > 0.1 && Array.from({ length: 5 }, (_, k) => { const ph = (u * 7 + k / 5) % 1; return <mesh key={"st" + k} position={[-0.17 + 0.02 * Math.sin(k * 2), 0.06 + 0.28 * rn(k, 3), 0.03]} rotation={[0, 0, ph * 4]} scale={0.012 * Math.sin(PI * ph) + 0.0001}><octahedronGeometry args={[1, 0]} />{M.glow({ col: "#fff6d0", op: 0.9 * pol })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 17:30 · ¿TIENE LACA?: corte en dos bloques: bronce macizo y bronce con capa transparente; la gota de limón hace brillar el macizo y nubla la laca ----
export const HLacquer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark"
  cam={{ at: [0, 0.05, 0], az: [-0.1, 0.12], el: [0.35, 0.28], r: [0.62, 0.52], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="SOLID OR LACQUERED?" col={AMB} />
    <Tag tt={tt} at={3.0} x={620} y={250} txt="SOLID: SHINES" col={GRN} size={40} />
    <Tag tt={tt} at={3.4} x={1300} y={250} txt="COATED: CLOUDS" col={RED} size={40} /></>}>{(tt) => {
  const dr = cl((tt - 0.8) / 0.8), ef = eio(tt, 1.6, 3.2);
  return <>
    {[-0.14, 0.14].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <RBox s={[0.2, 0.06, 0.14]} p={[0, 0.03, 0]} r={0.006}><meshStandardMaterial color={i === 0 ? new THREE.Color("#a8813a").lerp(new THREE.Color("#e2b45a"), ef).getStyle() : "#c49a48"} metalness={1} roughness={i === 0 ? lerp(0.45, 0.15, ef) : 0.25} /></RBox>
      {i === 1 && <RBox s={[0.204, 0.008, 0.144]} p={[0, 0.064, 0]} r={0.003}><meshPhysicalMaterial color={new THREE.Color("#ffffff").getStyle()} roughness={lerp(0.02, 0.6, ef)} transparent opacity={lerp(0.18, 0.7, ef)} clearcoat={1} /></RBox>}
      {dr < 1 && <mesh position={[0, 0.3 - dr * 0.23, 0]} scale={[1, 1.3, 1]}><sphereGeometry args={[0.012, 14, 10]} />{M.water({ col: "#f6e47a", op: 0.85 })}</mesh>}
      {dr >= 1 && <mesh position={[0, i ? 0.0695 : 0.0605, 0]} rotation={[-PI / 2, 0, 0]} scale={0.4 + 0.6 * ef}><circleGeometry args={[0.04, 32]} />{M.water({ col: "#f6e47a", op: 0.35 * (1 - ef * 0.6) })}</mesh>}
    </group>)}
  </>;
}}</Scene3D>;
