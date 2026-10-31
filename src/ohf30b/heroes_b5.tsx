// ohf30b · componentes únicos 29-37: tres tubos de nivel, la caldera que escupe agua, la libreta de rellenos, el agua sucia,
// el termostato de bajadas chicas, el coro de respiraderos, el calce del año pasado, la ficha de «cuándo llamar» y los cien años.
// r2b (30-oct): libreta → planilla en tabla de clip junto a la caldera, escrita con lápiz real mientras el tubo de nivel baja y se rellena;
// bajadas → termostato redondo que gira + curva de la noche como cable de cobre; cuándo llamar → caldera 3D con cada caso que se tilda
// sobre su pieza; cien años → el radiador junta capas de pintura y óxido mientras corre el año; agua sucia → un solo tubo en macro.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { Drop, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Big, Env, Gauge, PadSheet, PadSpec, Pencil, Pipe, Puffs, RadH, Shock, dialTex, padPen } from "./okit";

const PI = Math.PI;
// tubo de nivel (sight glass) con su línea normal y el agua a la altura w (0..1)
const Glass: React.FC<{ p: [number, number, number]; w: number; col?: string; film?: number; s?: number; glow?: number }> = ({ p, w, col = "#2f86d0", film = 0, s = 1, glow = 0 }) => <group position={p} scale={s}>
  {[0, 0.32].map((y) => <RBox key={y} s={[0.06, 0.03, 0.06]} p={[0, y, 0]} r={0.006}>{M.brass()}</RBox>)}
  <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.016, 0.016, 0.29, 20, 1, true]} />{M.glass({ op: 0.1 })}</mesh>
  <mesh position={[0, 0.015 + 0.145 * w, 0]} scale={[1, Math.max(0.01, w), 1]}><cylinderGeometry args={[0.014, 0.014, 0.29, 20]} /><meshStandardMaterial color={col} roughness={0.15} emissive={col} emissiveIntensity={0.25} /></mesh>
  {film > 0 && <mesh position={[0, 0.016 + 0.29 * w, 0]}><cylinderGeometry args={[0.0145, 0.0145, 0.006, 20]} /><meshStandardMaterial color="#9a7cff" metalness={0.9} roughness={0.1} transparent opacity={0.7 * film} /></mesh>}
  <mesh position={[0, 0.16, 0.018]}><boxGeometry args={[0.05, 0.003, 0.001]} /><meshBasicMaterial color="#d6301f" /></mesh>
  <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.03, 0.03, 0.34, 20, 1, true]} /><meshBasicMaterial color="#ffe08a" transparent opacity={0.18 * glow} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} /></mesh>
</group>;

// ---- 20:51 · TRES TUBOS: se llenan de a uno; bajo (llamar), por la mitad (bien) y hasta arriba (golpes) ----
export const HThreeGlass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#2a231e" key1={[-0.6, 1.6, 1.4]}
  cam={{ at: [0, 0.22, 0], az: [-0.24, 0.2], el: [0.1, 0.1], r: [1.0, 0.92], fov: 30 }}
  over={(tt) => <Big tt={tt} steps={[[0.8, "TOO LOW: CALL A PRO", "#b3261e"], [1.95, "HALFWAY: JUST RIGHT", "#1f6a3a"], [3.4, "TOO HIGH: BANGS", "#b3261e"]]} />}>{(tt) => <>
  <Env kind="plaster" col="#5f7a6a" z={-0.25} y={0.4} rim={[0.5, 0.6, -0.05]} rimI={2.6} />
  {[0.15, 0.5, 0.94].map((w, i) => { const a = 0.6 + i * 1.3, f = eio(tt, a, a + 1.0), on = eio(tt, a, a + 0.3) * (1 - eio(tt, a + 1.4, a + 1.7) * (i < 2 ? 1 : 0));
    return <group key={i} position={[-0.26 + i * 0.26, 0.02, 0]}>
      <Glass p={[0, 0, 0]} w={w * f + 0.012 * Math.sin(tt * 5 + i) * f * (1 - eio(tt, a + 1.0, a + 1.6))} glow={on} />
    </group>; })}
</>}</Scene3D>;

// ---- 21:05 · VAPOR MOJADO: la caldera llena de más: el agua sube por el tubo de nivel por encima de la raya y el vapor sale escupiendo gotas ----
export const HWetSteam: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#2a201b" warm={1.15} key1={[-0.8, 1.6, 1.3]}
  cam={{ at: [0.05, 0.45, 0], at1: [0.08, 0.52, 0], az: [-0.35, -0.12], el: [0.08, 0.1], r: [1.55, 1.4], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "OVERFILLED BOILER…"], [3.4, "…THROWS WATER UP THE PIPES", "#b3261e"]]} />}>{(tt) => {
  const fill = eio(tt, 2.75, 4.0), wet = eio(tt, 3.8, 4.4), w = lerp(0.5, 0.97, fill) + 0.015 * Math.sin(tt * 6) * fill;
  return <>
    <Env kind="brick" col="#6e3e2c" z={-0.45} y={0.6} floor="concrete" rim={[0.6, 0.9, -0.2]} />
    <RBox s={[0.56, 0.62, 0.42]} p={[0, 0.31, 0]} r={0.025}><meshStandardMaterial color="#3d5a4b" metalness={0.4} roughness={0.5} /></RBox>
    <RBox s={[0.58, 0.04, 0.44]} p={[0, 0.63, 0]} r={0.012}><meshStandardMaterial color="#2c4236" metalness={0.4} roughness={0.5} /></RBox>
    <mesh position={[-0.1, 0.1, 0.211]}><planeGeometry args={[0.14, 0.06]} /><meshBasicMaterial color={new THREE.Color("#ff8a2a").multiplyScalar(0.8 + 0.2 * Math.sin(tt * 3) ** 2)} toneMapped={false} /></mesh>
    <group position={[0.14, 0.04, 0.26]}><Glass p={[0, 0, 0]} w={w} s={1.8} glow={eio(tt, 3.6, 4.0)} /></group>
    {/* el caño de salida y el codo arriba */}
    <Pipe a={[-0.1, 0.65, 0]} b={[-0.1, 1.0, 0]} r={0.035} col="#55585b" />
    <Pipe a={[-0.1, 1.0, 0]} b={[0.4, 1.0, 0]} r={0.035} col="#55585b" />
    <Puffs tt={tt} n={10} a={[0.4, 1.0, 0]} b={[0.6, 1.12, 0.05]} r={0.02} op={0.55} v={0.8} />
    {/* gotas escupidas: arcos que salen de la boca del caño */}
    {Array.from({ length: 14 }, (_, i) => { const u = (((tt - 3.8) * 0.9 + i / 14) % 1 + 1) % 1, vx = 0.25 + 0.15 * rn(i, 2);
      return <mesh key={i} position={[0.42 + vx * u, 1.0 + 0.12 * u - 0.6 * u * u, 0.03 * Math.sin(i)]} scale={[1, 1.4, 1]} visible={tt > 3.8}><sphereGeometry args={[0.009, 12, 10]} />{M.water({ op: 0.95 * wet, col: "#3f93d6" })}</mesh>; })}
    {[4.1, 4.5, 4.9, 5.3].map((a, i) => <Drop key={i} tt={tt} a={a} b={a + 0.5} x={0.5 + 0.06 * i} y0={0.9} y1={0.0} z={0.03} r={0.009} />)}
  </>;
}}</Scene3D>;

// ---- 22:30 · LA PLANILLA DE LA CALDERA: tabla de clip colgada junto al tubo de nivel; el lápiz anota cada relleno mientras el nivel baja y sube ----
const LOG: PadSpec = { id: "r2fill", lines: ["BOILER WATER LOG", "NOV 2 - ADDED 1 IN.", "NOV 4 - ADDED 1 IN.", "NOV 6 - ADDED 2 IN.!"], w: 0.3, h: 0.34, fs: 62, x0: 96, y0: 190, dy: 190, cols: ["#1c2a3a", "#2a2c30", "#2a2c30", "#9b1f17"] };
export const HFillLog: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#2a2523" key1={[-0.4, 1.4, 1.3]} warm={1.1}
  cam={{ at: [0.0, 0.34, 0], at1: [0.04, 0.32, 0], az: [-0.3, 0.06], el: [0.06, 0.03], r: [0.82, 0.74], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[3.95, "ADDING WATER OFTEN? TELL THE TECH", "#b3261e"]]} y={960} />}>{(tt) => {
  const rev = lerp(0, 4, eio(tt, 0.4, 3.8)), pen = padPen(LOG, rev), wr = pen.writing ? 1 : 0, done = eio(tt, 3.8, 4.4);
  const fr = rev - Math.floor(rev), w = rev < 1 ? 0.5 : 0.5 - 0.28 * Math.sin(PI * Math.min(1, fr * 1.15));
  return <>
    <mesh position={[0, 0.5, -0.04]}><planeGeometry args={[3, 2]} /><meshStandardMaterial map={tex.brick(5, 3, "#7a4632")} roughness={0.9} /></mesh>
    {/* la caldera a la izquierda: chapa verde con remaches y su tubo de nivel */}
    <RBox s={[0.42, 0.8, 0.4]} p={[-0.42, 0.25, 0.18]} r={0.02}><meshStandardMaterial color="#3f5a4c" metalness={0.4} roughness={0.5} /></RBox>
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-0.215, 0.0 + i * 0.09, 0.3]}><sphereGeometry args={[0.006, 10, 8]} />{M.steel()}</mesh>)}
    <group position={[-0.2, 0.18, 0.05]}><Glass p={[0, 0, 0]} w={w} s={0.9} /></group>
    {/* clavo, tabla de clip y planilla */}
    <group position={[0.1, 0.34, 0.0]} rotation={[0, 0, 0.03]}>
      <RBox s={[0.34, 0.42, 0.006]} p={[0, -0.02, 0.003]} r={0.01}><meshStandardMaterial color="#8a5a36" roughness={0.7} /></RBox>
      <group position={[0, -0.04, 0.0075]}><PadSheet sp={LOG} rev={rev} /></group>
      <RBox s={[0.12, 0.035, 0.016]} p={[0, 0.17, 0.012]} r={0.006}>{M.steel({ col: "#d9dde0" })}</RBox>
      <mesh position={[0, 0.17, 0.022]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.03, 0.003, 8, 24, PI]} />{M.steel()}</mesh>
      <Pencil p={[pen.x + 0.1 * done, pen.y - 0.04 + 0.08 * done, 0.0095 + 0.004 * (1 - wr) + 0.0012 * Math.sin(tt * 16) * wr + 0.05 * done]} rot={[1.0, 0.0, -0.5]} />
    </group>
  </>;
}}</Scene3D>;

// ---- 23:05 · AGUA SUCIA: UN tubo gordo en macro, desde abajo, contra la chapa oxidada; el agua se enturbia, cae el sedimento y el nivel baja de la raya ----
export const HMuddyGlass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#33241a" key1={[0.8, 1.0, 1.0]} warm={1.25}
  cam={{ at: [0, 0.26, 0], az: [0.75, 0.5], el: [-0.12, -0.04], r: [0.95, 0.82], fov: 30 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "RUSTY, OILY, BOUNCING WATER…", "#b3261e"], [3.4, "…SKIMMING IS A TECH JOB"]]} />}>{(tt) => {
  const dirty = eio(tt, 0.8, 2.4), sed = eio(tt, 2.8, 5.2), w = lerp(0.82, 0.34, eio(tt, 2.8, 5.0)) + 0.04 * Math.sin(tt * 4.5) * eio(tt, 1.5, 2.2), H0 = 0.06, HH = 0.44;
  const col = new THREE.Color("#3f97da").lerp(new THREE.Color("#4a2208"), dirty);
  return <>
    {/* chapa oxidada de la caldera con remaches */}
    <RBox s={[1.2, 1.0, 0.04]} p={[0, 0.3, -0.12]} r={0.02}><meshStandardMaterial color="#5a3a26" metalness={0.5} roughness={0.55} /></RBox>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.25 + (i % 2) * 0.5, -0.1 + Math.floor(i / 2) * 0.12, -0.095]}><sphereGeometry args={[0.012, 12, 10]} />{M.steel({ col: "#8a7a6a" })}</mesh>)}
    <pointLight position={[-0.4, 0.5, -0.05]} intensity={2.6} distance={1.5} color="#ff9a4a" />
    {/* el tubo: bronce arriba y abajo, vidrio gordo, la raya normal en rojo */}
    {[H0 - 0.03, H0 + HH + 0.03].map((y) => <RBox key={y} s={[0.16, 0.06, 0.16]} p={[0, y, 0]} r={0.012}>{M.brass()}</RBox>)}
    <mesh position={[0, H0 + HH / 2, 0]}><cylinderGeometry args={[0.062, 0.062, HH, 40, 1, true]} />{M.glass({ op: 0.12 })}</mesh>
    <mesh position={[0, H0 + HH * w / 2, 0]}><cylinderGeometry args={[0.057, 0.057, HH * w, 40]} /><meshStandardMaterial color={col} roughness={0.2} transparent opacity={0.95} emissive={col} emissiveIntensity={0.05} /></mesh>
    <mesh position={[0, H0 + HH * w + 0.002, 0]}><cylinderGeometry args={[0.058, 0.058, 0.006, 40]} /><meshStandardMaterial color="#9a7cff" metalness={0.9} roughness={0.1} transparent opacity={0.75 * eio(tt, 1.4, 2.4)} /></mesh>
    <mesh position={[0, H0 + 0.004 + 0.03 * sed, 0]} scale={[1, Math.max(0.02, sed), 1]}><cylinderGeometry args={[0.056, 0.056, 0.06, 40]} /><meshStandardMaterial color="#2e1606" roughness={1} /></mesh>
    <mesh position={[0, H0 + HH * 0.5, 0.0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.064, 0.003, 8, 48]} /><meshBasicMaterial color="#e5332a" toneMapped={false} /></mesh>
    {/* sedimento: escamas de óxido que caen girando */}
    {Array.from({ length: 30 }, (_, i) => { const u = ((tt - 1.2) * (0.25 + 0.2 * rn(i, 2)) + rn(i, 3)) % 1, a = rn(i, 4) * 6.28, rr = 0.045 * rn(i, 5), y = H0 + HH * w * (1 - u);
      return <mesh key={i} position={[rr * Math.cos(a), y, rr * Math.sin(a)]} rotation={[tt * 2 + i, tt + i, 0]} visible={tt > 1.2}><boxGeometry args={[0.008 + 0.006 * rn(i, 6), 0.002, 0.006]} /><meshStandardMaterial color="#4a220a" roughness={0.9} transparent opacity={dirty} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 23:40 · BAJADAS CHICAS: un termostato redondo GRANDE en la pared y el radiador al lado; bajada fuerte = se enfría y golpea al subir; bajada chica = tibio y callado ----
const ringTx = () => tex.text("thermoring2", 512, 512, (g) => {
  g.fillStyle = "#efe7d4"; g.beginPath(); g.arc(256, 256, 250, 0, PI * 2); g.fill();
  g.fillStyle = "#2a2a2a"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "700 40px Arial";
  for (let v = 50; v <= 80; v += 2) { const a = -PI / 2 + (v - 65) * 0.09; g.save(); g.translate(256 + Math.cos(a) * 215, 256 + Math.sin(a) * 215); g.rotate(a + PI / 2); g.fillRect(-2, -14, 4, v % 10 === 0 ? 28 : 14); g.restore();
    if (v % 10 === 0) g.fillText(String(v), 256 + Math.cos(a) * 172, 256 + Math.sin(a) * 172); }
});
const setTx = (n: number) => tex.text("setp" + n, 256, 256, (g) => { g.fillStyle = "#14181c"; g.beginPath(); g.arc(128, 128, 126, 0, PI * 2); g.fill(); g.fillStyle = n < 62 ? "#7fb6ff" : "#ffb36a"; g.font = "700 120px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(n + "°", 136, 134); });
export const HSetback: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#2a2030" key1={[-0.6, 1.5, 1.3]} warm={1.1}
  cam={{ at: [-0.02, 0.38, 0.05], az: [-0.12, 0.12], el: [0.07, 0.05], r: [1.2, 1.08], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[0.8, "TURN IT DOWN 10-15° AT NIGHT…"], [1.85, "…AND IT BANGS AT DAWN", "#b3261e"], [3.4, "A FEW DEGREES: QUIET", "#1f6a3a"]]} />}>{(tt) => {
  const down = eio(tt, 0.4, 1.3), up = eio(tt, 1.8, 2.3), small = eio(tt, 3.4, 4.2);
  const sp = 70 - 13 * down + 13 * up - 3 * small, set = Math.round(sp);
  const heat = cl(0.85 - 0.75 * eio(tt, 0.7, 1.7) + 0.8 * eio(tt, 2.0, 2.9) - 0.12 * eio(tt, 3.6, 4.6));
  const BG = [2.35, 2.6, 2.85, 3.05], sx = BG.reduce((a, b) => a + (tt > b && tt < b + 0.2 ? 0.014 * Math.sin((tt - b) * 90) * (1 - (tt - b) / 0.2) : 0), 0);
  return <>
    <Env kind="plaster" col="#4f4060" z={-0.36} y={0.6} rim={[0.6, 0.8, -0.1]} rimI={2.2} />
    {/* el canto de pared en primer plano donde va el termostato */}
    <RBox s={[0.42, 1.3, 0.12]} p={[-0.36, 0.65, 0.26]} r={0.01}><meshStandardMaterial map={tex.plaster("#5d4c70", 1, 3)} roughness={0.9} /></RBox>
    <RBox s={[0.44, 0.1, 0.14]} p={[-0.36, 0.05, 0.26]} r={0.008}>{M.wood({ base: [96, 62, 38] })}</RBox>
    {/* termostato redondo grande: aro gris, dial con la escala que gira, número en el centro */}
    <group position={[-0.25, 0.42, 0.3]} scale={0.95}>
      <mesh rotation={[PI / 2, 0, 0]} position={[0, 0, 0.02]}><cylinderGeometry args={[0.17, 0.17, 0.04, 64]} /><meshPhysicalMaterial color="#d8cfb9" roughness={0.4} clearcoat={0.5} /></mesh>
      <mesh position={[0, 0, 0.045]}><torusGeometry args={[0.155, 0.012, 16, 64]} />{M.chrome({ col: "#bfc5ca" })}</mesh>
      <group position={[0, 0, 0.042]} rotation={[0, 0, (sp - 65) * 0.09]}><mesh><circleGeometry args={[0.15, 64]} /><meshStandardMaterial map={ringTx()} roughness={0.5} /></mesh></group>
      <mesh position={[0, 0, 0.046]}><circleGeometry args={[0.075, 48]} /><meshBasicMaterial map={setTx(set)} toneMapped={false} /></mesh>
      <mesh position={[0, 0.162, 0.05]} rotation={[0, 0, PI]}><coneGeometry args={[0.012, 0.026, 3]} /><meshBasicMaterial color="#c8322a" /></mesh>
      <mesh position={[0, 0, 0.056]}><circleGeometry args={[0.158, 64]} />{M.glass({ op: 0.1 })}</mesh>
    </group>
    {/* el radiador al lado: se enfría (azul), vuelve a calentar golpeando, y con la bajada chica queda tibio */}
    <group position={[0.18 + sx, 0, -0.18]}><RadH n={8} w={0.05} h={0.56} heat={(i, y) => heat + 0.05 * Math.sin(i * 1.3 + y * 3)} glow={1.0} /></group>
    {BG.map((b, i) => <Shock key={i} tt={tt} a={b} p={[0.18, 0.3, -0.06]} r={0.14 + 0.03 * (i % 2)} col="#ff6a3a" />)}
    <mesh position={[0.18, 0.005, -0.1]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.24, 0.26, 64]} /><meshBasicMaterial color="#5fd17a" transparent opacity={0.85 * eio(tt, 4.2, 4.6)} toneMapped={false} depthWrite={false} /></mesh>
  </>;
}}</Scene3D>;

// ---- 24:40 · EL CORO DE RESPIRADEROS: cinco respiraderos en fila sobre el caño; sisean de a uno, del cercano al lejano, y se callan igual ----
export const HVentChorus: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#2a2a24" warm={1.3} key1={[-0.5, 1.6, 1.4]}
  cam={{ at: [0.0, 0.2, -0.05], at1: [0.12, 0.2, -0.3], az: [-0.62, -0.42], el: [0.08, 0.1], r: [1.15, 1.05], fov: 34 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "NEAR VENTS FIRST, FAR VENTS LAST…"], [3.6, "…THEN THE HOUSE GOES QUIET", "#1f6a3a"]]} />}>{(tt) => <>
  <mesh position={[0, 0, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[4, 4]} /><meshStandardMaterial map={tex.concrete(5, 5)} roughness={0.9} /></mesh>
  <mesh position={[0, 0.7, -1.0]}><planeGeometry args={[8, 1.6]} /><meshStandardMaterial map={tex.plaster("#a89a78", 8, 2)} roughness={0.9} /></mesh>
  <pointLight position={[-0.4, 0.8, 0.6]} intensity={2.2} distance={3} color="#fff0d6" />
  <pointLight position={[0.5, 0.5, -0.9]} intensity={1.8} distance={2.2} color="#ffc27a" />
  {/* el caño principal: largo, aislado a tramos, con las cinco válvulas grandes encima */}
  <Pipe a={[-0.8, 0.06, 0.55]} b={[0.8, 0.06, -1.05]} r={0.03} col="#55585b" />
  {Array.from({ length: 5 }, (_, i) => { const x = -0.56 + i * 0.3, z = 0.31 - i * 0.3, on = eio(tt, 0.5 + i * 0.4, 0.8 + i * 0.4), off = eio(tt, 2.4 + i * 0.4, 2.7 + i * 0.4), hiss = on * (1 - off);
    return <group key={i} position={[x, 0.06, z]}>
      <Pipe a={[0, 0, 0]} b={[0, 0.08, 0]} r={0.016} col="#b08a48" />
      <group position={[0, 0.07, 0]} scale={2.0}>
        <mesh position={[0, 0.012, 0]}><cylinderGeometry args={[0.018, 0.018, 0.016, 6]} />{M.brass({ col: "#b8913f" })}</mesh>
        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.028, 0.03, 0.08, 32]} />{M.chrome()}</mesh>
        <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.028, 32, 12, 0, PI * 2, 0, PI / 2]} />{M.chrome()}</mesh>
        <mesh position={[0, 0.132, 0]}><cylinderGeometry args={[0.006, 0.006, 0.012, 12]} />{M.brass()}</mesh>
        <mesh position={[0, 0.03, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.03, 0.004, 8, 32]} />{M.brass({ col: "#b8913f" })}</mesh>
      </group>
      <Puffs tt={tt} n={10} a={[0, 0.34, 0]} b={[0.05, 0.62, 0]} r={0.018} col="#f4f8ff" op={0.85 * hiss} v={1.3} wob={0.012} />
    </group>; })}
</>}</Scene3D>;
// ---- 25:10 · EL CALCE DEL AÑO PASADO: primer plano de la pata con el calendario grande al frente; pasa el año, la cuña se oscurece, el piso baja y se abre la luz roja; entra una cuña nueva y clara y cierra ----
const yearTx = (y: number) => tex.text("yr" + y, 256, 256, (g) => { g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#b3261e"; g.fillRect(0, 0, 256, 60); g.fillStyle = "#fff"; g.font = "700 40px Arial"; g.textAlign = "center"; g.fillText("FALL", 128, 44); g.fillStyle = "#222"; g.font = "700 96px Arial"; g.fillText(String(y), 128, 180); });
export const HShimYear: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#161c26" key1={[-0.4, 1.2, 1.0]}
  cam={{ at: [-0.03, 0.07, 0.03], az: [-0.38, -0.2], el: [0.12, 0.08], r: [0.5, 0.44], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "FLOORS KEEP MOVING…"], [3.2, "…CHECK THE SHIM EVERY FALL", "#1f6a3a"]]} />}>{(tt) => {
  const f1 = eio(tt, 0.8, 1.4), sink = eio(tt, 1.2, 2.4), gap = 0.03 * sink, fix = eio(tt, 3.2, 4.4);
  return <>
    <Env kind="plaster" col="#3a4a62" z={-0.3} y={0.4} rim={[0.4, 0.5, -0.1]} rimCol="#9cc4ff" rimI={2.2} />
    {/* el calendario, grande y al frente, parado en el piso: se da vuelta la hoja del año */}
    <group position={[-0.135, 0.1, 0.07]} rotation={[-0.08, -0.25, 0]} scale={0.9}>
      <RBox s={[0.17, 0.17, 0.006]} p={[0, 0, -0.005]} r={0.002}><meshStandardMaterial color="#d8d2c4" roughness={0.9} /></RBox>
      <mesh><planeGeometry args={[0.16, 0.16]} /><meshStandardMaterial map={yearTx(2026)} roughness={0.9} /></mesh>
      <group position={[0, 0.08, 0.004]} rotation={[-PI * f1, 0, 0]} visible={f1 < 0.5}><mesh position={[0, -0.08, 0]}><planeGeometry args={[0.16, 0.16]} /><meshStandardMaterial map={yearTx(2025)} roughness={0.9} side={THREE.DoubleSide} /></mesh></group>
    </group>
    {/* tablas: bajan bajo la pata */}
    {Array.from({ length: 12 }, (_, i) => { const x = -0.5 + i * 0.09, d = -gap * Math.exp(-(x ** 2) / 0.03);
      return <RBox key={i} s={[0.092, 0.03, 0.3]} p={[x, -0.015 + d, 0]} r={0.003}>{M.wood({ base: [150, 102, 62] })}</RBox>; })}
    <RBox s={[1.2, 0.12, 0.06]} p={[0.0, -0.11 - gap, -0.08]} r={0.004}>{M.wood({ base: [110, 78, 50] })}</RBox>
    <RBox s={[0.07, 0.07, 0.12]} p={[0, 0.06 + 0.012, 0]} r={0.01}><meshStandardMaterial color="#cfcfc9" metalness={0.8} roughness={0.32} /></RBox>
    {[0, 1, 2, 3].map((i) => <RBox key={i} s={[0.045, 0.32, 0.1]} p={[-0.06 + i * 0.05, 0.27, 0]} r={0.014}><meshStandardMaterial color="#cfcfc9" metalness={0.8} roughness={0.32} /></RBox>)}
    {/* la cuña vieja: clara al principio, se oscurece con el año y baja con el piso; la nueva, gruesa y clara, entra de frente */}
    <mesh position={[0, 0.006 - gap, 0]} rotation={[PI / 2, 0, 0]} scale={[1.3, 1, 0.5]}><cylinderGeometry args={[0.04, 0.04, 0.12, 3]} /><meshStandardMaterial color={new THREE.Color("#e2c48e").lerp(new THREE.Color("#4a3322"), eio(tt, 0.6, 2.4))} roughness={0.85} /></mesh>
    <RBox s={[0.09, Math.max(0.004, gap * 0.95), 0.12]} p={[0, 0.026 - gap * 0.5, lerp(0.34, 0, fix)]} r={0.002}><meshStandardMaterial color="#f0d39a" roughness={0.7} /></RBox>
    <mesh position={[0, 0.026 - gap * 0.5, 0.062]}><planeGeometry args={[0.08, Math.max(0.0005, gap)]} /><meshBasicMaterial color="#ff4a2a" toneMapped={false} transparent opacity={cl(sink * 1.5) * (1 - fix)} /></mesh>
  </>;
}}</Scene3D>;

// ---- 26:20 · CUÁNDO LLAMAR: una tarjeta con el teléfono entra y queda pegada con un imán en la caldera; cada caso se tilda grande sobre la tarjeta ----
const callTx = () => tex.text("callcard6", 512, 640, (g) => {
  g.fillStyle = "#f3ecdc"; g.fillRect(0, 0, 512, 640);
  g.fillStyle = "#b3261c"; g.fillRect(0, 0, 512, 150);
  // el teléfono (tubo clásico) dibujado
  g.save(); g.translate(86, 76); g.rotate(-0.5); g.fillStyle = "#fff";
  g.beginPath(); g.ellipse(-30, 0, 20, 30, 0, 0, PI * 2); g.fill(); g.beginPath(); g.ellipse(30, 0, 20, 30, 0, 0, PI * 2); g.fill(); g.fillRect(-30, -40, 60, 22); g.restore();
  g.fillStyle = "#fff"; g.font = "900 52px Arial"; g.textBaseline = "middle"; g.fillText("CALL A PRO", 160, 80);
  const rows = ["GAS SMELL", "EMPTY GLASS", "GAUGE OVER 2", "LEAK WON'T STOP"];
  rows.forEach((r, i) => { const y = 215 + i * 110; g.strokeStyle = "#2a2a2a"; g.lineWidth = 7; g.strokeRect(34, y - 38, 76, 76); g.fillStyle = "#1e1e1e"; g.font = "800 38px Arial"; g.fillText(r, 132, y + 2); if (i < 3) { g.fillStyle = "#cfc4ad"; g.fillRect(34, y + 52, 444, 4); } });
});
const BigTick: React.FC<{ p: [number, number, number]; k: number }> = ({ p, k }) => <group position={p} scale={Math.max(0.001, k)} visible={k > 0.01} rotation={[0, 0, -0.15]}>
  <mesh position={[-0.011, -0.003, 0]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.026, 0.011, 0.006]} /><meshStandardMaterial color="#1d1d1f" roughness={0.5} /></mesh>
  <mesh position={[0.011, 0.012, 0]} rotation={[0, 0, -PI / 3.2]}><boxGeometry args={[0.05, 0.011, 0.006]} /><meshStandardMaterial color="#1d1d1f" roughness={0.5} /></mesh>
</group>;
export const HCallCard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#1c2430" key1={[0.8, 1.6, 1.2]} warm={1.0}
  cam={{ at: [-0.02, 0.4, 0], at1: [-0.07, 0.43, 0.12], az: [0.3, 0.12], el: [0.0, 0.04], r: [1.15, 0.92], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[0.55, "CALL A PRO IF…"], [1.15, "✓ YOU SMELL GAS OR BURNING", "#9b1f17"], [1.8, "✓ THE SIGHT GLASS IS EMPTY", "#9b1f17"], [3.0, "✓ THE GAUGE IS WAY ABOVE 2", "#9b1f17"], [4.0, "✓ A LEAK YOU CAN'T STOP", "#9b1f17"]]} />}>{(tt) => {
  const s1 = eio(tt, 1.15, 1.5), s2 = eio(tt, 1.8, 2.3), s3 = eio(tt, 3.0, 3.5);
  // la tarjeta entra desde arriba a la derecha con resorte, el imán la clava y queda inclinada; cada tilde le da un golpecito
  const kin = phys(tt, 0.2, 7, 0.5);
  const knock = [1.45, 2.3, 3.4, 4.3].reduce((s, a) => s + (tt > a ? Math.exp(-(tt - a) * 5) * Math.sin((tt - a) * 16) : 0), 0);
  const tilt = lerp(0.6, -0.09, kin) + 0.035 * knock;
  const cp: [number, number, number] = [lerp(0.5, -0.1, kin), lerp(0.75, 0.42, kin), 0.205];
  const rowY = (i: number) => 0.14 * (0.5 - (215 + i * 110) / 640);
  return <>
    <Env kind="plaster" col="#34485e" z={-0.4} y={0.6} rim={[-0.6, 0.9, -0.2]} rimCol="#9cc4ff" rimI={2.4} />
    <mesh position={[0, 0, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3, 3]} /><meshStandardMaterial map={tex.concrete(5, 5)} roughness={0.9} /></mesh>
    <pointLight position={[-0.3, 0.6, 0.7]} intensity={1.4} distance={2.2} color="#fff1dc" />
    {/* la caldera: gabinete rojo laqueado, ventanita del quemador, tubo de nivel, manómetro y el caño que sube */}
    <RBox s={[0.5, 0.6, 0.38]} p={[0, 0.3, 0]} r={0.025}><meshPhysicalMaterial color="#9a2a22" metalness={0.2} roughness={0.35} clearcoat={0.7} /></RBox>
    <RBox s={[0.52, 0.04, 0.4]} p={[0, 0.61, 0]} r={0.012}><meshStandardMaterial color="#2a2a2c" metalness={0.6} roughness={0.4} /></RBox>
    <mesh position={[-0.1, 0.1, 0.191]}><planeGeometry args={[0.12, 0.06]} /><meshBasicMaterial color={new THREE.Color("#ff8a2a").multiplyScalar(0.55 + 0.45 * s1)} toneMapped={false} /></mesh>
    <group position={[0.14, 0.24, 0.2]}><Glass p={[0, 0, 0]} w={0.5 * (1 - s2) + 0.02} s={0.8} /></group>
    <Pipe a={[-0.12, 0.62, 0.0]} b={[-0.12, 0.84, 0.0]} r={0.03} col="#55585b" />
    <Pipe a={[0.08, 0.62, 0.08]} b={[0.08, 0.68, 0.08]} r={0.006} col="#b07a4a" />
    <Gauge v={lerp(1.2, 6.5, s3) + 0.1 * Math.sin(tt * 1.5) * s3} max={10} tx={dialTex("call10", 10, 0.5, 2, "PSI", 5)} p={[0.08, 0.74, 0.08]} r={0.07} />
    <mesh position={[-0.12, 0.7, 0.0]}><cylinderGeometry args={[0.038, 0.038, 0.03, 6]} /><meshStandardMaterial color="#6b6f73" metalness={0.7} roughness={0.35} /></mesh>
    {[4.05, 4.3, 4.55, 4.8, 5.05, 5.3].map((a, i) => <Drop key={i} tt={tt} a={a} b={a + 0.45} x={-0.1 + 0.01 * (i % 2)} y0={0.69} y1={0.0} z={0.04} r={0.008} />)}
    {/* el olor: ondas que suben de la ventanita */}
    {Array.from({ length: 4 }, (_, i) => { const u = (tt * 0.5 + i / 4) % 1; return <mesh key={i} position={[-0.1 + 0.02 * Math.sin(u * 8 + i), 0.15 + u * 0.25, 0.2]}><torusGeometry args={[0.015 + 0.01 * u, 0.0025, 6, 16, PI]} /><meshBasicMaterial color="#d9c27a" transparent opacity={0.6 * (1 - u) * s1 * (1 - s2)} depthWrite={false} toneMapped={false} /></mesh>; })}
    {/* LA TARJETA: cartón con canto, imán redondo arriba, tildes grandes */}
    <group position={cp} rotation={[0, 0, tilt]} scale={1.9}>
      <RBox s={[0.115, 0.145, 0.004]} p={[0, 0, 0]} r={0.002}><meshStandardMaterial color="#e8dfcb" roughness={0.8} /></RBox>
      <mesh position={[0, 0, 0.0025]}><planeGeometry args={[0.112, 0.14]} /><meshStandardMaterial map={callTx()} roughness={0.75} /></mesh>
      <mesh position={[0, 0.075, 0.009]} rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.014, 0.014, 0.012, 28]} /><meshPhysicalMaterial color="#1f4f9a" roughness={0.3} clearcoat={0.8} /></mesh>
      <mesh position={[0, 0.075, 0.0155]}><circleGeometry args={[0.009, 24]} /><meshStandardMaterial color="#8a8e93" metalness={0.6} roughness={0.5} /></mesh>
      {[1.45, 2.3, 3.4, 4.3].map((a, i) => <BigTick key={i} p={[-0.04, rowY(i) + 0.003, 0.006]} k={phys(tt, a, 9, 0.45) * 0.42} />)}
    </group>
  </>;
}}</Scene3D>;

// ---- 27:15 · CIEN AÑOS: corre el año de 1926 a hoy; el radiador junta capas de pintura, saltaduras y óxido; la pared cambia de época; sigue tibio ----
const DigitsY = (y: number) => tex.text("yrd" + y, 512, 160, (g) => { g.fillStyle = "#14181c"; g.fillRect(0, 0, 512, 160); g.fillStyle = "#f6c453"; g.font = "700 120px 'Courier New', monospace"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(y), 256, 84); });
const COATS: [number, string][] = [[1926, "#8a8d8f"], [1948, "#d8c9a3"], [1968, "#8fbfa2"], [1990, "#c9c4bc"], [2010, "#f1eee6"]];
const coatAt = (y: number) => { let c = new THREE.Color(COATS[0][1]); for (let i = 1; i < COATS.length; i++) { const k = cl((y - COATS[i][0] + 3) / 6); c = c.clone().lerp(new THREE.Color(COATS[i][1]), k); } return c; };
const WALLS: [number, string][] = [[1926, "#3c4a36"], [1960, "#8a6a2c"], [1990, "#7a8a96"], [2020, "#5d6f7d"]];
const wallAt = (y: number) => { let c = new THREE.Color(WALLS[0][1]); for (let i = 1; i < WALLS.length; i++) c = c.clone().lerp(new THREE.Color(WALLS[i][1]), cl((y - WALLS[i][0] + 6) / 12)); return c; };
export const HHundredYears: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" key1={[-0.7, 2.0, 1.4]}
  cam={{ at: [0, 0.48, 0], az: [-0.35, 0.28], el: [0.1, 0.08], r: [1.75, 1.6], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[3.9, "100 YEARS · NO PUMP · FEW MOVING PARTS", "#1c2a3a"]]} />}>{(tt) => {
  const yf = lerp(1926, 2026, eio(tt, 0.4, 3.8)), y = Math.round(yf), age = (yf - 1926) / 100, col = coatAt(yf);
  const N = 13, X0 = -0.34, DX = 0.056;
  return <>
    <mesh position={[0, 0.8, -0.3]}><planeGeometry args={[4, 2]} /><meshStandardMaterial color={wallAt(yf)} roughness={0.9} /></mesh>
    {Array.from({ length: N }, (_, i) => <group key={i} position={[X0 + i * DX, 0, 0]}>
      <RBox s={[0.046, 0.56, 0.16]} p={[0, 0.38, 0]} r={0.02}><meshStandardMaterial color={col} metalness={0.25 + 0.45 * (1 - age)} roughness={0.32 + 0.35 * age} /></RBox>
      <mesh position={[0, 0.66, 0]}><sphereGeometry args={[0.024, 16, 12]} /><meshStandardMaterial color={col} metalness={0.3} roughness={0.4 + 0.3 * age} /></mesh>
    </group>)}
    <RBox s={[N * DX, 0.05, 0.08]} p={[X0 + (N - 1) * DX / 2, 0.14, 0]} r={0.02}><meshStandardMaterial color={col} metalness={0.3} roughness={0.5} /></RBox>
    {[X0 + 0.02, X0 + (N - 1) * DX - 0.02].map((x, i) => <RBox key={i} s={[0.05, 0.1, 0.07]} p={[x, 0.05, 0.02]} r={0.02}><meshStandardMaterial color={col} metalness={0.3} roughness={0.5} /></RBox>)}
    {/* saltaduras que muestran la capa de abajo, y manchas de óxido que crecen con los años */}
    {Array.from({ length: 26 }, (_, i) => { const born = 1936 + rn(i, 2) * 85; if (yf < born) return null; const k = cl((yf - born) / 18), rust = i % 3 === 0;
      const x = X0 + Math.floor(rn(i, 3) * N) * DX, yy = 0.15 + rn(i, 4) * 0.48;
      return <mesh key={i} position={[x, yy, 0.0805]} scale={[1, 1.3, 1]}><circleGeometry args={[0.006 + 0.012 * k * (0.5 + rn(i, 5)), 14]} /><meshStandardMaterial color={rust ? "#7a3a14" : coatAt(born - 12)} roughness={0.9} /></mesh>; })}
    {/* el contador de años, placa de bronce arriba */}
    <group position={[0, 0.82, 0.02]}>
      <RBox s={[0.34, 0.12, 0.03]} r={0.012}>{M.brass({ col: "#b48a3c" })}</RBox>
      <mesh position={[0, 0, 0.016]}><planeGeometry args={[0.3, 0.094]} /><meshBasicMaterial map={DigitsY(y)} toneMapped={false} /></mesh>
    </group>
    {/* sigue tibio: el aire tiembla arriba */}
    {Array.from({ length: 6 }, (_, i) => { const u = (tt * 0.35 + i / 6) % 1; return <mesh key={i} position={[-0.28 + i * 0.11, 0.7 + u * 0.12, 0.02]}><planeGeometry args={[0.05, 0.1]} /><meshBasicMaterial color="#ffb070" transparent opacity={0.12 * (1 - u)} depthWrite={false} toneMapped={false} /></mesh>; })}
  </>;
}}</Scene3D>;
