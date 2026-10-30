// lch29e · componentes únicos 1-7 (la nube en el sol, las cuarenta y dos ventanas, la aspiradora en el barral, la sopa de polvo, el forro que encoge distinto, las cortinas que trepan la pared, la bolsita de ganchos).
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Curtain, Dust, PinHook, Rod, Washer, Window, cottonTex } from "./curtain";
import { Hand } from "./sofa";

const PI = Math.PI;

// ---- 0:19 · LA NUBE EN EL SOL: la mano sacude la cortina a contraluz; del pliegue sale una nube de polvo que gira lenta en el haz de sol de las cuatro de la tarde ----
export const HDustCloud: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" bg="#120e0b" key1={[0.9, 1.2, -0.6]}
  cam={{ at: [0.2, 1.0, 0.2], az: [0.45, 0.35], el: [0.05, 0.1], r: [1.35, 1.12], fov: 34 }}>{(tt) => {
  const shake = Math.sin(cl((tt - 0.6) / 0.9) * PI * 3) * (1 - cl((tt - 0.6) / 0.9)), cloud = eio(tt, 0.8, 2.4);
  return <>
    <group position={[0, 1.0, -0.05]}><Window w={0.9} h={1.2} sun={1} sky="#ffd79a" /></group>
    <group position={[0, 1.66, 0.06]}><Rod len={1.3} />
      <group position={[-0.3, 0, 0]}><Curtain w={0.55} h={1.5} folds={4} amp={0.03} tt={tt} sway={0.05 * shake} col="#efe2c4" /></group>
      <group position={[0.33, 0, 0]}><Curtain w={0.5} h={1.5} folds={4} amp={0.03 + 0.03 * Math.abs(shake)} tt={tt * 6} sway={0.12 * shake} col="#efe2c4" /></group>
    </group>
    {/* la mano que toma el borde y da una sacudida */}
    <group position={[0.5, 1.05 + 0.05 * shake, 0.1]} rotation={[0, -PI / 2, PI / 2]} scale={1.2}><Hand grip={0.7} /></group>
    {/* la nube: cientos de motas que salen del pliegue y se abren en el haz */}
    <group position={[0.3, 1.0 + 0.25 * cloud, 0.25]} rotation={[0, tt * 0.5, 0]}><Dust tt={tt * 1.6} k={cloud} n={480} box={[0.15 + 0.8 * cloud, 0.25 + 0.7 * cloud, 0.15 + 0.5 * cloud]} size={0.02} /></group>
    {/* el haz de sol que la recorta */}
    <mesh position={[0.25, 1.0, 0.3]} rotation={[0, 0, -0.5]}><planeGeometry args={[0.45, 1.8]} />{M.glow({ col: "#ffe0a0", op: 0.1 + 0.06 * cloud })}</mesh>
  </>;
}}</Scene3D>;

// ---- 0:36 · CUARENTA Y DOS VENTANAS: la iglesia de madera blanca de Ames; las ventanas se encienden de a una, cada una con su cortina, mientras el campanario se recorta contra el cielo ----
export const HFortyTwo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#1a2233" key1={[-0.8, 1.0, 1.2]}
  cam={{ at: [0, 0.45, 0], az: [0.55, 0.4], el: [0.12, 0.16], r: [2.6, 2.2], fov: 34 }}>{(tt) => {
  const lit = cl((tt - 0.5) / 4.5) * 42;
  const wins: [number, number, number][] = [];
  for (let i = 0; i < 14; i++) wins.push([-0.85 + i * 0.13, 0.28, 0.301]);
  for (let i = 0; i < 14; i++) wins.push([-0.85 + i * 0.13, 0.58, 0.301]);
  for (let i = 0; i < 7; i++) wins.push([0.951, 0.28 + (i % 2) * 0.3, -0.24 + Math.floor(i / 2) * 0.16]);
  for (let i = 0; i < 7; i++) wins.push([-0.951, 0.28 + (i % 2) * 0.3, -0.24 + Math.floor(i / 2) * 0.16]);
  return <>
    {/* césped y nave */}
    <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[2.4, 48]} /><meshStandardMaterial color="#3d5a2c" roughness={1} /></mesh>
    <RBox s={[1.9, 0.78, 0.6]} p={[0, 0.39, 0]} r={0.01}>{M.pvc({ col: "#f3f1ea" })}</RBox>
    <mesh position={[0, 0.78 + 0.18, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}><cylinderGeometry args={[0.001, 0.44, 0.36, 4, 1, false, PI / 4]} /><meshStandardMaterial color="#4a3a32" roughness={0.8} /></mesh>
    {/* campanario */}
    <RBox s={[0.3, 0.6, 0.3]} p={[-1.08, 0.3, 0]} r={0.01}>{M.pvc({ col: "#f3f1ea" })}</RBox>
    <RBox s={[0.24, 0.5, 0.24]} p={[-1.08, 0.85, 0]} r={0.01}>{M.pvc({ col: "#f3f1ea" })}</RBox>
    <mesh position={[-1.08, 1.38, 0]}><coneGeometry args={[0.17, 0.62, 4]} /><meshStandardMaterial color="#4a3a32" /></mesh>
    <mesh position={[-1.08, 1.74, 0]}><boxGeometry args={[0.012, 0.12, 0.012]} />{M.brass({})}</mesh>
    <mesh position={[-1.08, 1.75, 0]}><boxGeometry args={[0.07, 0.012, 0.012]} />{M.brass({})}</mesh>
    {/* ventanas: se prenden de a una, con su cortina blanca recogida */}
    {wins.map(([x, y, z], i) => { const on = cl(lit - i), side = Math.abs(x) > 0.9; return <group key={i} position={[x, y, z]} rotation={[0, side ? Math.sign(x) * PI / 2 : 0, 0]}>
      <mesh><planeGeometry args={[0.07, 0.2]} />{M.glow({ col: on > 0 ? "#ffd38a" : "#2a3446", op: lerp(1, 1, on) })}</mesh>
      {on > 0 && [-1, 1].map((s) => <mesh key={s} position={[s * 0.026, 0, 0.002]}><planeGeometry args={[0.018 * on, 0.2]} /><meshBasicMaterial color="#fff8e8" /></mesh>)}
    </group>; })}
    {/* el contador mecánico: tambor que gira hasta 42 en el cartel de la puerta */}
    <RBox s={[0.34, 0.16, 0.03]} p={[0.3, 0.12, 0.33]} r={0.01}>{M.wood({ base: [90, 60, 36] })}</RBox>
    <mesh position={[0.3, 0.12, 0.347]}><planeGeometry args={[0.28, 0.12]} /><meshBasicMaterial map={tex.text("n42_" + Math.floor(lit), 160, 70, (g) => { g.fillStyle = "#1b1410"; g.fillRect(0, 0, 160, 70); g.fillStyle = "#f6e2b0"; g.font = "bold 54px Georgia"; g.textAlign = "center"; g.fillText(String(Math.floor(lit)), 80, 56); })} /></mesh>
  </>;
}}</Scene3D>;

// ---- 2:20 · LA ASPIRADORA EN EL BARRAL: la cortina queda colgada; el cepillo baja en trazos largos de arriba abajo y deja una franja limpia, más clara, con el polvo yéndose por el tubo ----
const dirtyTex = () => tex.text("dirtyc", 128, 256, (g) => { g.fillStyle = "#c9bb9c"; g.fillRect(0, 0, 128, 256); g.globalAlpha = 0.18; g.fillStyle = "#6d6047"; for (let i = 0; i < 300; i++) g.fillRect(rn(i, 2) * 128, rn(i, 3) * 256, 2, 2); });
export const HRodVacuum: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" bg="#15100c" key1={[-0.8, 1.2, 1.3]}
  cam={{ at: [0, 1.0, 0.1], az: [0.3, 0.22], el: [0.06, 0.1], r: [1.3, 1.1], fov: 34 }}>{(tt) => {
  const strokes = [[0.6, 2.2, -0.18], [2.4, 4.0, 0.0], [4.2, 5.8, 0.18]];
  const cur = strokes.find(([a, b]) => tt >= a && tt < b) ?? strokes[tt < 0.6 ? 0 : 2], y = lerp(1.62, 0.3, eio(tt, cur[0], cur[1]));
  return <>
    <group position={[0, 1.7, 0]}><Rod len={0.9} brass={false} />
      <Curtain w={0.7} h={1.5} folds={5} amp={0.02} map={dirtyTex()} />
      {/* franjas limpias, una por trazo, que crecen detrás del cepillo */}
      {strokes.map(([a, b, x], i) => { const k = eio(tt, a, b); return k > 0 && <mesh key={i} position={[x, -0.06 - 1.38 * k / 2, 0.03]}><planeGeometry args={[0.13, 1.38 * k]} /><meshStandardMaterial map={cottonTex("#fbf6e8")} emissive="#fff3d8" emissiveIntensity={0.25} /></mesh>; })}
    </group>
    {/* el tubo y el cepillo suave */}
    <group position={[cur[2], y, 0.06]} scale={1.6}>
      <RBox s={[0.13, 0.05, 0.05]} r={0.012}>{M.plastic({ col: "#45474c" })}</RBox>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-0.055 + i * 0.012, 0, -0.03]}><cylinderGeometry args={[0.003, 0.003, 0.02, 5]} rotation={[PI / 2, 0, 0]} /><meshStandardMaterial color="#d8c9a4" /></mesh>)}
      <mesh position={[0.0, -0.32, 0.18]} rotation={[0.55, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.7, 16]} />{M.chrome({})}</mesh>
    </group>
    {/* polvo que el tubo chupa: motas que convergen al cepillo */}
    {Array.from({ length: 36 }, (_, i) => { const ph = (tt * 1.4 + rn(i, 2)) % 1, a = rn(i, 3) * PI * 2, r = 0.22 * (1 - ph); return <mesh key={"s" + i} position={[cur[2] + Math.cos(a) * r, y + Math.sin(a) * r, 0.1]}><sphereGeometry args={[0.006, 6, 5]} /><meshBasicMaterial color="#8a7a60" transparent opacity={0.8 * ph} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 2:40 · SOPA DE POLVO: por el vidrio del lavarropas, el agua se pone gris y la cortina gira en el caldo ----
export const HDustSoup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="tile" bg="#14120f" key1={[-0.6, 1.3, 1.4]}
  cam={{ at: [0, 0.42, 0.3], az: [0.15, 0.08], el: [0.12, 0.1], r: [0.95, 0.68], fov: 32 }}>{(tt) => {
  const gray = eio(tt, 0.5, 3.5), rot = tt * 1.8;
  return <>
    <Washer drum={rot} water={0.55} wcol={`rgb(${Math.round(lerp(150, 110, gray))},${Math.round(lerp(185, 108, gray))},${Math.round(lerp(205, 100, gray))})`}>
      {/* la cortina hecha un bollo que da vueltas */}
      <group rotation={[0, 0, -rot * 0.6]} position={[0.03, -0.06, 0]}><mesh scale={[1.2, 0.7, 1]}><icosahedronGeometry args={[0.1, 2]} /><meshStandardMaterial map={cottonTex("#d8cfb8")} roughness={1} /></mesh></group>
      {/* grumos de polvo en suspensión */}
      {Array.from({ length: 40 }, (_, i) => { const a = rot * (0.4 + rn(i, 2)) + rn(i, 3) * 6.28, r = 0.05 + 0.13 * rn(i, 4); return <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r * 0.6 - 0.05, (rn(i, 5) - 0.5) * 0.25]}><sphereGeometry args={[0.004 + 0.006 * rn(i, 6), 8, 6]} /><meshStandardMaterial color="#5e5648" transparent opacity={gray} /></mesh>; })}
    </Washer>
  </>;
}}</Scene3D>;

// ---- 3:24 · EL FORRO ENCOGE DISTINTO: la cortina de damasco con su forro blanco atrás; con el agua el forro sube más que la tela y el ruedo se frunce y tira ----
const damaskTex = () => tex.text("damask", 256, 256, (g) => { g.fillStyle = "#c9a548"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#e3c56c"; g.lineWidth = 6; for (let k = 0; k < 4; k++) { const cx = 64 + (k % 2) * 128, cy = 64 + Math.floor(k / 2) * 128; g.beginPath(); g.ellipse(cx, cy, 30, 50, 0, 0, PI * 2); g.stroke(); g.beginPath(); g.moveTo(cx, cy - 50); g.lineTo(cx, cy + 50); g.stroke(); } });
export const HLinedShrink: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" bg="#16110d" key1={[-0.9, 1.3, 1.2]}
  cam={{ at: [0, 0.75, 0], az: [0.9, 0.75], el: [0.06, 0.1], r: [1.7, 1.45], fov: 34 }}>{(tt) => {
  const k = eio(tt, 1.0, 4.4);
  return <>
    <group position={[0, 1.55, 0]}><Rod len={1.0} />
      <group position={[0, 0, 0.012]}><Curtain w={0.8} h={1.45} folds={4} amp={0.03} map={damaskTex()} shrink={0.08 * k} pucker={k} /></group>
      <group position={[0, 0, -0.012]}><Curtain w={0.78} h={1.45} folds={4} amp={0.03} col="#f6f4ee" shrink={0.2 * k} /></group>
    </group>
    {/* la regla de costurera parada al lado: el ruedo se aleja de la marca del piso */}
    <RBox s={[0.04, 1.5, 0.008]} p={[0.48, 0.75, 0.05]} r={0.004}><meshStandardMaterial map={tex.text("rule", 32, 512, (g) => { g.fillStyle = "#f2d56a"; g.fillRect(0, 0, 32, 512); g.fillStyle = "#2a2010"; for (let i = 0; i < 512; i += 17) g.fillRect(0, i, i % 85 === 0 ? 24 : 12, 2); })} /></RBox>
  </>;
}}</Scene3D>;

// ---- 3:55 · LAS CORTINAS QUE TREPAN LA PARED: las cortinas de Arlene, lavadas en caliente, suben del piso medio metro con un tirón seco, y el forro todavía más ----
export const HClimbWall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" bg="#17110d" key1={[-0.8, 1.4, 1.3]}
  cam={{ at: [0, 0.85, 0], az: [0.2, 0.12], el: [0.1, 0.16], r: [2.1, 1.8], fov: 34 }}>{(tt) => {
  const j = [0.8, 1.7, 2.6].map((a) => cl(phys(tt, a, 9, 0.35)));
  const sh = 0.12 * j[0] + 0.12 * j[1] + 0.14 * j[2];
  const flor = tex.text("arl", 128, 128, (g) => { g.fillStyle = "#e9d6b7"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 14; i++) { g.fillStyle = i % 2 ? "#b4485a" : "#5e7d48"; g.beginPath(); g.arc(rn(i, 2) * 128, rn(i, 3) * 128, 9, 0, PI * 2); g.fill(); } });
  return <>
    <group position={[0, 1.0, -0.06]}><Window w={0.9} h={1.1} sky="#bcd2e6" /></group>
    <group position={[0, 1.66, 0.05]}><Rod len={1.6} />
      {[-0.52, 0.52].map((x, i) => <group key={i} position={[x, 0, 0]}><Curtain w={0.5} h={1.62} folds={4} amp={0.03} map={flor} shrink={sh} />
        <group position={[0, 0, -0.01]}><Curtain w={0.48} h={1.62} folds={4} amp={0.03} col="#f4f1e8" shrink={sh * 1.3} /></group></group>)}
    </group>
    {/* la marca de donde llegaban antes: una cinta en el zócalo */}
    <RBox s={[1.6, 0.012, 0.01]} p={[0, 0.04, 0.06]} r={0.002}><meshBasicMaterial color="#d24a3a" /></RBox>
  </>;
}}</Scene3D>;

// ---- 4:30 · LA BOLSITA DE GANCHOS: cada gancho sale de la cortina, salta y cae en la bolsa con cierre; la bolsa sube y queda pegada con cinta en la punta del barral ----
export const HHookBag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" bg="#16110d" key1={[-0.6, 1.3, 1.3]}
  cam={{ at: [0.05, 1.45, 0.1], az: [0.3, 0.22], el: [0.1, 0.14], r: [1.0, 0.86], fov: 32 }}>{(tt) => {
  const N = 6, up = eio(tt, 4.4, 5.6), tape = eio(tt, 5.6, 6.4);
  const bag: [number, number, number] = [lerp(0.25, 0.42, up), lerp(1.22, 1.5, up), 0.12];
  return <>
    <group position={[0, 1.6, 0]}><Rod len={1.1} brass={false} />
      <group position={[-0.15, -0.02, 0]}><Curtain w={0.6} h={1.2} folds={5} amp={0.025} col="#efe7d6" /></group>
    </group>
    {/* los ganchos: saltan de a uno hasta la bolsa */}
    {Array.from({ length: N }, (_, i) => { const a = 0.5 + i * 0.6, k = eio(tt, a, a + 0.5), x0 = -0.42 + i * 0.11;
      const pos = k < 1 ? [lerp(x0, bag[0], k), lerp(1.56, bag[1] - 0.02, k) + 0.12 * Math.sin(k * PI), lerp(0.02, bag[2], k)] : [bag[0] + (rn(i, 2) - 0.5) * 0.05, bag[1] - 0.04 + rn(i, 3) * 0.03, bag[2]];
      return <group key={i} position={pos as [number, number, number]} rotation={[0, 0, k * 5 + i]} scale={2.4}><PinHook /></group>; })}
    {/* la bolsa con cierre */}
    <group position={bag}>
      <RBox s={[0.2, 0.24, 0.012]} r={0.006}><meshPhysicalMaterial color="#e8f2ff" transparent opacity={0.35} roughness={0.15} clearcoat={1} side={2} depthWrite={false} /></RBox>
      <RBox s={[0.2, 0.012, 0.018]} p={[0, 0.12, 0]} r={0.003}>{M.plastic({ col: "#3a7bd5" })}</RBox>
    </group>
    {/* la cinta de papel que la pega al barral */}
    {tape > 0 && <RBox s={[0.05 * tape, 0.1, 0.004]} p={[0.43, 1.6, 0.13]} rot={[0, 0, 0.2]} r={0.002}><meshStandardMaterial color="#e6d6a8" roughness={0.9} /></RBox>}
    {tt < 4.4 && <group position={[bag[0] + 0.08, bag[1] - 0.1, 0.16]} rotation={[0.4, -PI / 2, 0.3]} scale={0.9}><Hand grip={0.5} /></group>}
  </>;
}}</Scene3D>;
void phys; void Window;
