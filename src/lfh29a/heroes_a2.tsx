// lfh29a · componentes únicos 8-14 (el nido en corte, la receta que cae al frasco, fuerte contra suave, la tapa con agujeros, los días que vacían la mesada, montón contra polvito, la pensión de seis cuartos).
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Ant, BoraxBox, Jar, Powder, Saucer } from "./lf";

const PI = Math.PI;

// ---- 4:30 · LA REINA ESTÁ EN OTRO LADO: corte de tierra; las obreras bajan por los túneles con un granito blanco hasta la cámara de la reina, que se enciende ----
const TUN = [[-0.5, 0.0], [-0.38, -0.08], [-0.2, -0.12], [-0.1, -0.22], [0.05, -0.3], [0.18, -0.36]];
export const HNest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#1a120c" key1={[-0.6, 1.2, 1.6]}
  cam={{ at: [-0.1, -0.15, 0], at1: [0.2, -0.36, 0], az: [0.15, -0.1], el: [0.05, 0.0], r: [1.05, 0.82], fov: 30 }}>{(tt) => {
  const glow = eio(tt, 3.6, 4.6);
  return <>
    {/* bloque de tierra en corte con su pasto arriba */}
    <mesh position={[0, -0.45, -0.03]}><boxGeometry args={[1.6, 0.9, 0.06]} /><meshStandardMaterial map={tex.text("soil", 512, 256, (g) => { g.fillStyle = "#5a3b22"; g.fillRect(0, 0, 512, 256); for (let i = 0; i < 900; i++) { const v = rn(i, 2); g.fillStyle = `rgba(${40 + v * 60},${26 + v * 30},${12 + v * 14},.6)`; g.beginPath(); g.arc(rn(i, 3) * 512, rn(i, 4) * 256, 1 + rn(i, 5) * 4, 0, 6.3); g.fill(); } })} roughness={1} /></mesh>
    {Array.from({ length: 70 }, (_, i) => <mesh key={i} position={[-0.68 + i * 0.0195, 0.02, -0.03 + (rn(i, 2) - 0.5) * 0.04]} rotation={[0, 0, (rn(i, 3) - 0.5) * 0.5]}><coneGeometry args={[0.004, 0.06 + 0.04 * rn(i, 4), 4]} /><meshStandardMaterial color="#4f7a33" /></mesh>)}
    {/* túneles (cavados más oscuros) y la cámara grande */}
    {TUN.slice(0, -1).map(([x, y], i) => { const [x2, y2] = TUN[i + 1], L = Math.hypot(x2 - x, y2 - y); return <mesh key={i} position={[(x + x2) / 2, (y + y2) / 2, 0.001]} rotation={[0, 0, Math.atan2(y2 - y, x2 - x)]}><planeGeometry args={[L + 0.03, 0.034]} /><meshStandardMaterial color="#24170d" /></mesh>; })}
    <mesh position={[0.24, -0.38, 0.001]} scale={[1.5, 0.8, 1]}><circleGeometry args={[0.08, 32]} /><meshStandardMaterial color="#24170d" emissive="#ffb35a" emissiveIntensity={0.25 * glow} /></mesh>
    {/* la reina: hormiga grande con alas cortas */}
    <group position={[0.22, -0.39, 0.012]} rotation={[PI / 2, 0, 0]}><Ant s={3.6} ph={tt * 0.4} col="#2a1a10" />
      {/* abdomen translúcido y lleno de la reina, que brilla cuando llega el cebo */}
      <mesh position={[-0.017, 0.006, 0]} scale={[1.6, 0.9, 1]}><sphereGeometry args={[0.016, 20, 14]} /><meshPhysicalMaterial color="#c98a4a" roughness={0.3} clearcoat={1} transparent opacity={0.75} emissive="#ffb35a" emissiveIntensity={0.15 + 0.5 * glow} /></mesh></group>
    {/* huevitos blancos al costado */}
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[0.31 + rn(i, 2) * 0.05, -0.42 + rn(i, 3) * 0.04, 0.01]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.005, 10, 8]} /><meshStandardMaterial color="#f4efe0" /></mesh>)}
    {/* obreras que bajan con el granito */}
    {Array.from({ length: 8 }, (_, i) => { const u = cl(tt * 0.22 - i * 0.11); if (u <= 0 || u >= 1) return null; const f = u * (TUN.length - 1), k = Math.min(TUN.length - 2, Math.floor(f)), r = f - k; const [x, y] = TUN[k], [x2, y2] = TUN[k + 1];
      const ang = Math.atan2(y2 - y, x2 - x); return <group key={i} position={[lerp(x, x2, r), lerp(y, y2, r), 0.012]} rotation={[PI / 2, 0, 0]}><group rotation={[0, -ang, 0]}><Ant s={1.5} ph={tt * 3 + i} /><mesh position={[0.02, 0.006, 0]}><icosahedronGeometry args={[0.005, 0]} /><meshStandardMaterial color="#fbfaf5" emissive="#fff" emissiveIntensity={0.3} /></mesh></group></group>; })}
  </>;
}}</Scene3D>;

// ---- 4:51 · LA RECETA: una cuchara de bórax y media taza de azúcar caen al frasco de agua tibia y se disuelven en remolino ----
export const HRecipe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile"
  cam={{ at: [-0.02, 0.13, 0], az: [-0.25, 0.25], el: [0.28, 0.2], r: [0.66, 0.54], fov: 30 }}
>{(tt) => {
  const sp = eio(tt, 0.6, 1.4), cup = eio(tt, 2.2, 3.0), mix = eio(tt, 3.2, 5.4), back = eio(tt, 3.7, 4.6);
  return <>
    <Jar r={0.07} h={0.17} lv={0.75} liq={mix > 0.5 ? "#f2ead2" : "#d8e6ee"} lid={0} />
    {/* remolino al revolver */}
    {Array.from({ length: 40 }, (_, i) => { const a = tt * 3 + i * 0.6, rr = 0.012 + 0.045 * rn(i, 2); const o = (cl(tt - 0.9) * (1 - mix * 0.9)); return o > 0.02 ? <mesh key={i} position={[Math.cos(a) * rr, 0.03 + 0.08 * rn(i, 3), Math.sin(a) * rr]}><icosahedronGeometry args={[0.0045, 0]} /><meshStandardMaterial color="#e6c46a" emissive="#e6c46a" emissiveIntensity={0.2} transparent opacity={o} /></mesh> : null; })}
    {/* cuchara que se inclina sobre el frasco */}
    <group position={[-0.1 + 0.09 * sp, 0.24, 0]} rotation={[0, 0, -1.6 * cl((tt - 1.2) * 2)]}>
      <mesh position={[-0.07, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.005, 0.005, 0.12, 10]} />{M.steel()}</mesh>
      <mesh scale={[1, 0.35, 0.8]}><sphereGeometry args={[0.02, 16, 10, 0, 6.3, PI / 2, PI / 2]} />{M.steel({ side: 2 })}</mesh>
    </group>
    {/* taza medidora de lata */}
    <group position={[0.12 - 0.09 * cup + 0.16 * back, 0.26 - 0.2 * back, 0.05 * back]} rotation={[0, 0, 1.9 * cl((tt - 2.8) * 2) * (1 - back)]}>
      <mesh><cylinderGeometry args={[0.04, 0.035, 0.05, 30, 1, true]} />{M.steel({ side: 2 })}</mesh>
      <mesh position={[0.055, 0, 0]} rotation={[0, 0, PI / 2]}><boxGeometry args={[0.008, 0.05, 0.012]} />{M.steel()}</mesh>
    </group>
    {/* chorro blanco de cada uno */}
    {[[1.25, 1.9], [2.85, 3.5]].map(([a, b], j) => { const k = (tt - a) / (b - a); return k > 0 && k < 1 ? Array.from({ length: 16 }, (_, i) => { const y = 0.24 - ((k * 3 + i / 16) % 1) * 0.12; return <mesh key={j + "" + i} position={[(rn(i, j + 3) - 0.5) * 0.012, y, (rn(i, j + 5) - 0.5) * 0.012]}><icosahedronGeometry args={[0.0028, 0]} /><meshStandardMaterial color="#fbfaf4" /></mesh>; }) : null; })}
    <group position={[-0.24, 0, -0.12]} rotation={[0, 0.5, 0]}><BoraxBox s={0.7} /></group>
    {/* rayitas de medida pintadas en el vidrio */}
    {[0.04, 0.07, 0.1, 0.13].map((y, i) => <mesh key={i} position={[0, y, 0.0705]}><planeGeometry args={[i % 2 ? 0.014 : 0.026, 0.0025]} /><meshBasicMaterial color="#8a2a22" /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 5:21 · MÁS NO ES MEJOR: dos platitos; en el fuerte las hormigas caen ahí mismo; en el suave cargan y se van en fila a casa ----
export const HStrength: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="dark"
  cam={{ at: [0, 0.02, 0], az: [0, 0.2], el: [0.95, 0.8], r: [0.8, 0.66], fov: 30 }}
>{(tt) => <>
    <group position={[-0.2, 0, 0]}><Saucer r={0.075} /><mesh position={[0, 0.0125, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.05, 30]} />{M.water({ col: "#f0f0f0", op: 0.7, emI: 0 })}</mesh></group>
    <group position={[0.2, 0, 0]}><Saucer r={0.075} /><mesh position={[0, 0.0125, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.05, 30]} />{M.water({ col: "#e8d9a8", op: 0.6, emI: 0 })}</mesh></group>
    {/* el hormiguerito adonde vuelven las del plato suave */}
    <mesh position={[0.2, 0.0, -0.25]} scale={[1, 0.45, 1]}><sphereGeometry args={[0.05, 24, 12, 0, 6.3, 0, PI / 2]} /><meshStandardMaterial color="#8a6442" roughness={1} /></mesh>
    <mesh position={[0.2, 0.0226, -0.25]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.009, 16]} /><meshBasicMaterial color="#1a0f06" /></mesh>
    {/* fuerte: llegan, prueban y quedan panza arriba en el borde */}
    {Array.from({ length: 8 }, (_, i) => { const a = i * 0.8, arr = eio(tt, 0.2 + i * 0.25, 1.2 + i * 0.25), dead = tt > 1.6 + i * 0.25; const r0 = lerp(0.3, 0.085, arr);
      return <group key={i} position={[-0.2 + Math.cos(a) * r0, 0.002, Math.sin(a) * r0]} rotation={[dead ? PI * 0.95 : 0, 0, 0]}><group position={[0, dead ? -0.008 : 0, 0]}><Ant yaw={-a + PI} ph={dead ? 0.2 : tt * 3 + i} s={1.7} col={dead ? "#3b2f27" : "#141110"} /></group></group>; })}
    {/* suave: van y vienen; las que se van llevan su gotita hacia arriba del cuadro (el nido) */}
    {Array.from({ length: 10 }, (_, i) => { const u = (tt * 0.25 + i * 0.1) % 1, out = u > 0.5, k = out ? (u - 0.5) * 2 : 1 - u * 2; const p = [0.2 + 0.02 * Math.sin(i), 0.002, lerp(-0.08, -0.21, k)];
      return <group key={i}><Ant p={[p[0] + (out ? 0.012 : -0.012), p[1], p[2]]} yaw={out ? PI / 2 : -PI / 2} ph={tt * 3 + i} s={1.7} />{out && <mesh position={[p[0] + 0.012, 0.012, p[2] - 0.022]}><sphereGeometry args={[0.004, 10, 8]} />{M.water({ col: "#e8d9a8", op: 0.9 })}</mesh>}</group>; })}
  </>}</Scene3D>;

// ---- 6:09 · AGUJEROS CON UN CLAVO: el martillo baja tres veces sobre la tapa; cada golpe deja un agujero; adentro brilla el algodón mojado ----
export const HLidholes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0.03, 0.15, 0], az: [0.3, -0.2], el: [0.36, 0.3], r: [0.85, 0.7], fov: 30 }}>{(tt) => {
  const hits = [0.9, 2.0, 3.1], n = hits.filter((x) => tt > x).length;
  const hk = Math.max(...hits.map((x) => { const d = tt - x; return d > -0.4 && d < 0.5 ? (d < 0 ? 1 - cl(-d / 0.4) : 1 - cl(d / 0.5)) : 0; }));
  const nx = [0, 0.02, -0.02][Math.min(2, n)];
  return <>
    <Jar r={0.055} h={0.11} lid={1} holes={n} />
    {/* algodones mojados adentro */}
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.06, 0.02, (rn(i, 3) - 0.5) * 0.06]} scale={[1, 0.8, 1]}><icosahedronGeometry args={[0.016, 2]} /><meshPhysicalMaterial color="#f4ecd6" roughness={0.9} sheen={1} sheenColor="#fff2cc" /></mesh>)}
    {/* clavo y martillo */}
    <group position={[nx, 0.112 + 0.02 * (1 - hk), 0]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.002, 0.0008, 0.06, 8]} />{M.steel()}</mesh>
      <mesh position={[0, 0.061, 0]}><cylinderGeometry args={[0.006, 0.006, 0.002, 14]} />{M.steel()}</mesh>
    </group>
    {/* martillo: la cara de la cabeza (abajo) cae justo sobre la cabeza del clavo */}
    <group position={[nx, 0.2105 + 0.1 * (1 - hk), 0]} rotation={[0, 0, 0.35 * (1 - hk)]}>
      <RBox s={[0.03, 0.075, 0.03]} p={[0, 0, 0]} r={0.006}>{M.steel({ col: "#7d848c" })}</RBox>
      <mesh position={[0.12, 0.012, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.011, 0.012, 0.22, 14]} />{M.wood({ base: [176, 128, 80] })}</mesh>
    </group>
    {/* soplito de polvo de lata en cada golpe */}
    {hits.map((x, j) => Array.from({ length: 10 }, (_, i) => { const k = cl((tt - x) / 0.6), a = rn(i + j * 10, 2) * 6.3; return <mesh key={j * 10 + i} visible={k > 0 && k < 1} position={[[0, 0.02, -0.02][j] + Math.cos(a) * 0.03 * k, 0.117 + 0.015 * Math.sin(k * PI), Math.sin(a) * 0.03 * k]}><sphereGeometry args={[0.003 + 0.004 * k, 8, 6]} /><meshBasicMaterial color="#d8d4cc" transparent opacity={0.6 * (1 - k)} depthWrite={false} /></mesh>; }))}
  </>;
}}</Scene3D>;

// ---- 6:30 · TRES DÍAS, A VECES UNA SEMANA: el almanaque de pared arranca hojas; en la mesada de abajo las hormigas son cada vez menos ----
const calTex = (d: number) => tex.text("cal" + d, 256, 256, (g) => { g.fillStyle = "#fbf6ea"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#b3271c"; g.fillRect(0, 0, 256, 60); g.fillStyle = "#fff"; g.font = "700 34px Georgia"; g.textAlign = "center"; g.fillText("DAY", 128, 44); g.fillStyle = "#1c1a17"; g.font = "900 150px Georgia"; g.fillText(String(d), 128, 210); });
export const HAntcount: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="tile"
  cam={{ at: [0.08, 0.2, -0.28], az: [0.2, -0.1], el: [0.32, 0.28], r: [1.1, 1.0], fov: 30 }}>{(tt) => {
  const day = Math.min(7, 1 + Math.floor(tt / 0.75)), flip = (tt / 0.75) % 1;
  return <>
    {/* almanaque colgado */}
    <group position={[-0.22, 0.34, -0.5]}>
      <mesh><planeGeometry args={[0.28, 0.28]} /><meshStandardMaterial map={calTex(Math.min(7, day + (day < 7 ? 1 : 0)))} roughness={0.9} /></mesh>
      {day < 7 && <group position={[0, 0.14, 0.003]} rotation={[-PI * eio(flip, 0.55, 1), 0, 0]}><mesh position={[0, -0.14, 0]}><planeGeometry args={[0.28, 0.28]} /><meshStandardMaterial map={calTex(day)} roughness={0.9} side={2} /></mesh></group>}
      <mesh position={[0, 0.15, 0.004]}><boxGeometry args={[0.3, 0.02, 0.01]} />{M.brass()}</mesh>
    </group>
    {/* hormigas que se van apagando día a día */}
    {Array.from({ length: 40 }, (_, i) => { const g = cl(tt / 0.75 + 1 - (1 + (i / 40) * 6.2)); if (g >= 1) return null; const a = rn(i, 2) * 6.3, r = 0.05 + rn(i, 3) * 0.3; const x0 = Math.cos(a) * r, z0 = -0.15 + Math.sin(a) * r * 0.6, x = lerp(x0, 0.32, g), z = lerp(z0, -0.32, g);
      return <Ant key={i} p={[x, 0.001, z]} yaw={g > 0 ? -Math.atan2(-0.32 - z0, 0.32 - x0) : a + tt * 0.6 * (rn(i, 4) - 0.5)} ph={tt * 3 + i} s={2} />; })}
    <group position={[0.32, 0, -0.32]}><Jar r={0.06} h={0.12} lv={0.6} liq="#efe2c0" holes={3} /></group>
  </>;
}}</Scene3D>;

// ---- 7:03 · LO RODEAN: a la izquierda un montón blanco que las hormigas esquivan; a la derecha un velo finito que cruzan y se llevan pegado ----
export const HPilevsdust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#15130f"
  cam={{ at: [0, 0, 0], az: [0, 0.15], el: [1.05, 0.9], r: [0.75, 0.62], fov: 30 }}>{(tt) => <>
    <mesh position={[0, 0.0005, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.004, 0.6]} />{M.glow({ col: "#ffffff", op: 0.18 })}</mesh>
    {/* montón */}
    <mesh position={[-0.2, 0, 0]} scale={[1, 0.45, 1]}><sphereGeometry args={[0.06, 32, 16, 0, 6.3, 0, PI / 2]} /><meshStandardMaterial color="#f4f1e8" roughness={1} /></mesh>
    <group position={[-0.2, 0, 0]}><Powder n={60} w={0.15} d={0.15} heap={0.01} /></group>
    {/* velo finito */}
    <group position={[0.2, 0, 0]}><Powder n={420} w={0.22} d={0.3} r={0.0016} /></group>
    {Array.from({ length: 7 }, (_, i) => { const u = (tt * 0.17 + i / 7) % 1, z = lerp(0.3, -0.3, u); const dx = Math.abs(z) < 0.11 ? Math.cos(Math.asin(cl(Math.abs(z) / 0.11))) * 0.1 : 0; const side = i % 2 ? 1 : -1;
      return <Ant key={"l" + i} p={[-0.2 + side * (0.02 + dx), 0.001, z]} yaw={PI / 2 - side * (Math.abs(z) < 0.11 ? Math.sign(z) * 0.9 : 0)} ph={tt * 3 + i} s={2.2} />; })}
    {Array.from({ length: 7 }, (_, i) => { const u = (tt * 0.17 + i / 7) % 1, z = lerp(0.3, -0.3, u); const coat = cl((0.15 - z) / 0.25);
      return <Ant key={"r" + i} p={[0.2 + (rn(i, 3) - 0.5) * 0.1, 0.001, z]} yaw={PI / 2} ph={tt * 3 + i} s={2.2} dust={coat * 0.42} />; })}
  </>}</Scene3D>;

// ---- 8:18 · LA PENSIÓN: casa de ladrillo en corte como casa de muñecas; se prenden de a una las seis ventanas de arriba ----
export const HBoarding: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#1b2433" key1={[-1.2, 2.0, 2.2]}
  cam={{ at: [0.05, 0.36, 0], az: [-0.35, 0.22], el: [0.1, 0.16], r: [2.0, 1.7], fov: 30 }}
>{(tt) => {
  const brick = tex.text("brick", 256, 256, (g) => { g.fillStyle = "#c9c0b2"; g.fillRect(0, 0, 256, 256); for (let r = 0; r < 16; r++) for (let c = 0; c < 6; c++) { g.fillStyle = `rgb(${140 + rn(r * 6 + c, 2) * 40},${58 + rn(r * 6 + c, 3) * 18},${40})`; g.fillRect(c * 44 + (r % 2) * 22 - 22, r * 16 + 1, 42, 14); } });
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 6]} /><meshStandardMaterial color="#2c3428" roughness={1} /></mesh>
    <mesh position={[0, 0.36, 0]}><boxGeometry args={[0.8, 0.72, 0.4]} /><meshStandardMaterial map={brick} roughness={0.9} /></mesh>
    {/* techo a dos aguas */}
    <mesh position={[0, 0.82, 0]} rotation={[0, PI / 4, 0]} scale={[1.2, 1, 0.75]}><coneGeometry args={[0.52, 0.22, 4]} /><meshStandardMaterial color="#3d3a38" roughness={0.8} /></mesh>
    {/* porche */}
    <RBox s={[0.84, 0.02, 0.14]} p={[0, 0.2, 0.27]} r={0.004}>{M.wood({ base: [214, 206, 190] })}</RBox>
    {[-0.38, -0.13, 0.13, 0.38].map((x) => <mesh key={x} position={[x, 0.1, 0.33]}><cylinderGeometry args={[0.01, 0.01, 0.2, 10]} />{M.porcelain()}</mesh>)}
    <RBox s={[0.1, 0.16, 0.01]} p={[0, 0.08, 0.201]} r={0.003}>{M.wood({ base: [90, 50, 30] })}</RBox>
    {/* seis ventanas de arriba que se encienden de a una + dos de abajo apagadas */}
    {Array.from({ length: 6 }, (_, i) => { const on = cl((tt - 0.8 - i * 0.5) * 3); const x = -0.3 + (i % 3) * 0.3, y = i < 3 ? 0.62 : 0.44;
      return <group key={i} position={[x, y, 0.201]}><mesh><planeGeometry args={[0.1, 0.11]} /><meshStandardMaterial color="#1a1c22" emissive="#ffc673" emissiveIntensity={1.6 * on} toneMapped={false} /></mesh>
        <mesh position={[0, 0, 0.002]}><planeGeometry args={[0.006, 0.11]} /><meshStandardMaterial color="#efe8da" /></mesh><mesh position={[0, 0, 0.002]}><planeGeometry args={[0.1, 0.006]} /><meshStandardMaterial color="#efe8da" /></mesh></group>; })}
    {[-0.25, 0.25].map((x) => <mesh key={x} position={[x, 0.27, 0.201]}><planeGeometry args={[0.1, 0.1]} /><meshStandardMaterial color="#1a1c22" /></mesh>)}
    {/* árbol pelado del costado */}
    <mesh position={[0.62, 0.3, 0.1]}><cylinderGeometry args={[0.015, 0.025, 0.6, 8]} />{M.wood({ base: [70, 50, 34] })}</mesh>
    <mesh position={[0.62, 0.65, 0.1]} scale={[1, 0.8, 1]}><icosahedronGeometry args={[0.14, 1]} /><meshStandardMaterial color="#3f5a32" roughness={1} flatShading /></mesh>
  </>;
}}</Scene3D>;
