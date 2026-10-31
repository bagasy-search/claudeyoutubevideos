// ohf30b · componentes únicos 1-7 (vapor que golpea): el reloj de las dos, el ciclo del condensado, el golpe de ariete,
// el mapa del sonido, la libreta, el enfriado y «el mismo agujero». Kit h3d + okit, cámara que orbita en curva.
// r2b (30-oct): mensaje grande en cinta (Big, centrado y entero), acción clara entre el 45 % y el 85 %, libreta escrita con lápiz real,
// enfriado con termómetro de aguja que barre, mapa del sonido iluminado con cámara que baja del piso al sótano.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, tex, rn } from "./h3d";
import { Big, Env, BleedKey, Cup, Gauge, PadSheet, PadSpec, Pencil, Pipe, Puffs, RadH, Shock, dialTex, padPen } from "./okit";

const PI = Math.PI;
const BANGS = [1.2, 2.0, 2.35, 3.5, 4.3, 4.65];
const shake = (tt: number, s = 0.012) => BANGS.reduce((a, b) => a + (tt > b && tt < b + 0.25 ? s * Math.sin((tt - b) * 90) * (1 - (tt - b) / 0.25) : 0), 0);

// ---- 0:05 · LAS DOS DE LA MAÑANA: el despertador marca 2:00 en el cuarto a oscuras; el radiador tiembla con cada golpe ----
const clockTx = (m = 0) => tex.text("clk2" + m, 512, 256, (g) => {
  g.fillStyle = "#0b0b0c"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#ff3b22"; g.font = "700 170px 'Courier New', monospace"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("2:" + String(m).padStart(2, "0"), 256, 134);
});
export const HNightClock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#141a26" key1={[-0.8, 1.6, 1.2]}
  cam={{ at: [-0.02, 0.32, 0], az: [-0.35, -0.05], el: [0.16, 0.1], r: [1.35, 1.15], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[1.25, "BANG. BANG. BANG.", "#b3261e"]]} />}>{(tt) => {
  const sx = shake(tt, 0.022), mins = Math.floor(lerp(0, 14, cl(tt / 5.6)));
  return <>
    <Env kind="plaster" col="#26324a" z={-0.55} y={0.6} rim={[0.7, 0.9, -0.3]} rimCol="#8fb4ff" rimI={2.4} />
    <RBox s={[0.3, 0.26, 0.24]} p={[-0.32, 0.13, 0.12]} r={0.01}>{M.wood({ base: [92, 60, 38] })}</RBox>
    <group position={[-0.32, 0.31, 0.16]} rotation={[0, 0.35, 0]}>
      <RBox s={[0.16, 0.08, 0.06]} r={0.012}><meshStandardMaterial color="#1d1d1f" roughness={0.4} /></RBox>
      <mesh position={[0, 0, 0.031]}><planeGeometry args={[0.13, 0.06]} /><meshBasicMaterial map={clockTx(mins)} toneMapped={false} /></mesh>
    </group>
    <pointLight position={[-0.3, 0.33, 0.25]} intensity={0.25} distance={0.6} color="#ff4a2a" />
    <group position={[0.22 + sx, 0, -0.2]}><RadH n={9} w={0.045} h={0.42} heat={(i, y) => 0.2 + 0.1 * y} glow={0.6} /></group>
    <Pipe a={[0.04, 0.06, -0.2]} b={[0.04, -0.4, -0.2]} r={0.022} col="#5d5a55" />
    <Pipe a={[0.04, 0.06, -0.2]} b={[0.06, 0.06, -0.2]} r={0.022} col="#5d5a55" />
    {BANGS.map((b, i) => <React.Fragment key={i}><Shock tt={tt} a={b} p={[0.04, 0.0, -0.12]} r={0.07} col="#ff8a3a" /><Shock tt={tt} a={b + 0.1} p={[0.22, 0.28, -0.08]} r={0.12 + 0.03 * (i % 3)} /></React.Fragment>)}
  </>;
}}</Scene3D>;

// ---- 1:50 · EL CICLO: la caldera hierve, el vapor sube por el caño, el hierro frío lo vuelve agua y el agua baja a la caldera ----
export const HCondense: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#2a201b" key1={[-1, 2.2, 1.4]}
  cam={{ at: [-0.02, 0.42, 0], az: [-0.32, 0.22], el: [0.14, 0.2], r: [1.7, 1.55], fov: 34 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "STEAM GOES UP…"], [3.0, "…AND COMES BACK DOWN AS WATER", "#1f4f9a"]]} />}>{(tt) => {
  const run = eio(tt, 0.3, 1.2), cond = eio(tt, 1.2, 3.6);
  return <>
    <Env kind="brick" col="#6e3e2c" z={-0.6} y={0.7} rim={[0.8, 1.0, -0.2]} />
    <RBox s={[0.26, 0.3, 0.22]} p={[-0.42, 0.15, 0]} r={0.02}><meshStandardMaterial color="#7a2c22" metalness={0.3} roughness={0.5} /></RBox>
    <mesh position={[-0.42, 0.08, 0.112]}><planeGeometry args={[0.08, 0.04]} /><meshBasicMaterial color={new THREE.Color("#ff9a3a").multiplyScalar(0.75 + 0.25 * Math.sin(tt * 3) ** 2)} toneMapped={false} /></mesh>
    <mesh position={[-0.42, 0.48, 0]}><cylinderGeometry args={[0.03, 0.03, 0.36, 20, 1, true]} />{M.glass({ op: 0.18 })}</mesh>
    <mesh position={[-0.1, 0.66, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.64, 20, 1, true]} />{M.glass({ op: 0.18 })}</mesh>
    <group position={[0.34, 0.12, 0]}><RadH n={8} w={0.045} h={0.4} heat={(i) => 0.25 + 0.65 * run * cl(cond * 1.3 - i / 9)} /></group>
    <Pipe a={[0.22, 0.66, 0]} b={[0.22, 0.58, 0]} r={0.02} />
    <Puffs tt={tt} n={9} a={[-0.42, 0.3, 0]} b={[-0.42, 0.66, 0]} r={0.016} op={0.75 * run} v={0.6} />
    <Puffs tt={tt} n={9} a={[-0.42, 0.66, 0]} b={[0.2, 0.66, 0]} r={0.016} op={0.75 * run} v={0.45} />
    <Puffs tt={tt} n={8} a={[0.2, 0.643, 0.012]} b={[-0.4, 0.643, 0.012]} r={0.011} col="#3f93e0" op={0.95 * eio(tt, 2.4, 3.2)} v={0.35} wob={0.002} />
    <Puffs tt={tt} n={7} a={[-0.43, 0.64, 0.02]} b={[-0.43, 0.3, 0.02]} r={0.011} col="#3f93e0" op={0.95 * eio(tt, 2.8, 3.6)} v={0.5} wob={0.002} />
  </>;
}}</Scene3D>;

// ---- 2:20 · GOLPE DE ARIETE: el charco en el bajo del caño; el vapor lo levanta, lo tira como un puño y revienta en el codo ----
export const HWaterSlug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#2a2420" key1={[-0.6, 1.6, 1.4]}
  cam={{ at: [0.05, 0.22, 0], az: [-0.3, 0.14], el: [0.1, 0.16], r: [1.2, 1.02], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "A PUDDLE IN THE LOW SPOT…", "#1f4f9a"], [3.95, "…BECOMES A WATER HAMMER", "#b3261e"]]} />}>{(tt) => {
  const go = eio(tt, 2.9, 3.9), hit = 3.9, sx = tt > hit && tt < hit + 0.35 ? 0.008 * Math.sin((tt - hit) * 80) * (1 - (tt - hit) / 0.35) : 0;
  const dip = (x: number) => -0.04 * Math.exp(-((x + 0.15) ** 2) / 0.02);
  const splash = cl((tt - hit) / 1.5);
  return <><Env kind="concrete" z={-0.4} y={0.5} rim={[0.6, 0.7, -0.1]} rimI={2.6} /><group position={[sx, 0.22, 0]}>
    {Array.from({ length: 24 }, (_, i) => { const x0 = -0.55 + i * 0.042, x1 = x0 + 0.042, a = Math.atan2(dip(x1) - dip(x0), 0.042);
      return <mesh key={i} position={[(x0 + x1) / 2, (dip(x0) + dip(x1)) / 2, 0]} rotation={[0, 0, a + PI / 2]}><cylinderGeometry args={[0.04, 0.04, 0.044, 22, 1, true]} />{M.glass({ op: 0.2 })}</mesh>; })}
    <mesh position={[0.46, 0.03, 0]}><torusGeometry args={[0.04, 0.042, 14, 24, PI / 2]} />{M.steel({ col: "#6b6f73" })}</mesh>
    <mesh position={[0.5, 0.16, 0]}><cylinderGeometry args={[0.042, 0.042, 0.2, 22]} />{M.steel({ col: "#6b6f73" })}</mesh>
    {/* el charco: tiembla con el vapor que pasa, después se vuelve tapón y viaja */}
    {splash < 0.05 && <mesh position={[lerp(-0.15, 0.42, go), lerp(-0.07, 0, go) + 0.004 * Math.sin(tt * 5) * cl(tt - 1.2) * (1 - go), 0]} scale={[lerp(2.2, 0.9, go), lerp(0.4, 1, go), 1]}><sphereGeometry args={[0.035, 20, 14]} />{M.water({ op: 0.85 })}</mesh>}
    {/* el golpe en el codo: el agua revienta en gotas */}
    {splash > 0 && splash < 1 && Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * PI * 2, r = 0.015 + 0.11 * splash;
      return <mesh key={i} position={[0.42 - 0.02 * splash, r * Math.sin(a) - 0.04 * splash * splash, r * Math.cos(a) * 0.5]}><sphereGeometry args={[0.013 * (1 - splash * 0.4), 12, 10]} />{M.water({ op: 0.95 * (1 - splash * 0.8) })}</mesh>; })}
    <Puffs tt={tt} n={10} a={[-0.6, 0.01, 0]} b={[0.4, 0.01, 0]} r={0.018} op={0.55 * eio(tt, 0.6, 1.4)} v={0.9} />
    <Shock tt={tt} a={hit} p={[0.46, 0.02, 0.06]} r={0.1} col="#ff8a3a" />
    <Shock tt={tt} a={hit + 0.12} p={[0.46, 0.02, 0.06]} r={0.16} />
  </group></>;
}}</Scene3D>;

// ---- 3:20 · CAMINÁ HACIA EL RUIDO: de cerca el radiador de arriba golpea; la cámara baja por el piso hasta el caño del sótano ----
export const HListenMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#262b33" warm={1.25} key1={[-0.8, 2.2, 1.6]}
  cam={{ at: [0.12, 0.72, 0], az: [-0.35, -0.1], el: [0.12, 0.08], r: [0.8, 0.72], fov: 34, push: { a: 2.85, b: 3.9, at: [0.0, 0.25, 0.0], r: 0.78, az: 0.25, el: 0.05 } }}
  over={(tt) => <Big tt={tt} steps={[[0.6, "ONE RADIATOR UPSTAIRS?"], [3.0, "…OR THE BASEMENT PIPES?", "#b3261e"]]} />}>{(tt) => {
  const A = (tt * 0.9) % 1, up = tt < 2.9, k2 = eio(tt, 2.9, 3.4), beat = 0.5 + 0.5 * Math.sin(tt * 2 * PI * 1.8);
  return <>
    {/* arriba: la sala (pared verde, piso de madera) con el radiador que golpea */}
    <mesh position={[0, 0.95, -0.25]} receiveShadow><planeGeometry args={[3, 1.0]} /><meshStandardMaterial map={tex.plaster("#7f9a90", 3, 1)} roughness={0.9} /></mesh>
    <RBox s={[3, 0.07, 0.03]} p={[0, 0.5, -0.24]} r={0.004}>{M.wood({ base: [96, 62, 38] })}</RBox>
    <RBox s={[3, 0.04, 1.4]} p={[0, 0.44, 0.3]} r={0.004}>{M.wood({ base: [150, 102, 62] })}</RBox>
    <group position={[0.12, 0.46, -0.14]}><RadH n={9} w={0.05} h={0.4} heat={() => 0.35 + 0.35 * (1 - k2) * beat} /></group>
    {/* abajo: el sótano (ladrillo, viguetas, caldera y el caño principal) */}
    <RBox s={[3, 0.06, 1.4]} p={[0, 0.39, 0.3]} r={0.004}>{M.wood({ base: [100, 70, 46] })}</RBox>
    {[-0.6, -0.2, 0.2, 0.6].map((x) => <RBox key={x} s={[0.05, 0.1, 1.4]} p={[x, 0.32, 0.3]} r={0.004}>{M.wood({ base: [120, 84, 52] })}</RBox>)}
    <mesh position={[0, 0.2, -0.3]} receiveShadow><planeGeometry args={[3, 0.5]} /><meshStandardMaterial map={tex.brick(4, 1, "#7a4632")} roughness={0.9} /></mesh>
    <mesh position={[0, 0, 0.3]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3, 1.4]} /><meshStandardMaterial map={tex.concrete(4, 2)} roughness={0.9} /></mesh>
    <RBox s={[0.2, 0.24, 0.18]} p={[-0.34, 0.12, -0.12]} r={0.015}><meshPhysicalMaterial color="#7a2c22" roughness={0.4} clearcoat={0.5} /></RBox>
    <Pipe a={[-0.24, 0.24, -0.05]} b={[0.6, 0.24, -0.05]} r={0.02} col="#6a6660" em="#ff6a1a" emI={0.9 * k2 * beat} />
    <Pipe a={[0.5, 0.24, -0.05]} b={[0.5, 0.46, -0.05]} r={0.016} col="#6a6660" />
    <pointLight position={[0.2, 0.3, 0.4]} intensity={0.9} distance={1.6} color="#ffd9a0" />
    <pointLight position={[0.0, 0.85, 0.5]} intensity={0.8} distance={1.8} color="#fff0d8" />
    {/* los aros del ruido: gruesos, salen de donde golpea */}
    {[0, 1, 2].map((i) => { const q = (A + i / 3) % 1, p: [number, number, number] = up ? [0.12, 0.7, 0.0] : [0.06, 0.24, 0.04];
      return <mesh key={i} position={p}><torusGeometry args={[0.04 + 0.2 * q, 0.011 * (1 - 0.5 * q), 12, 64]} /><meshStandardMaterial color="#ffb347" emissive="#ff9a2a" emissiveIntensity={1.4} transparent opacity={0.9 * (1 - q)} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 4:13 · ANOTALO: la libreta de espiral sobre el banco, con la llave de purga encima; el lápiz escribe las dos respuestas ----
const NOTE: PadSpec = { id: "r2note", lines: ["WHERE? ONE RADIATOR", "WHEN? AT START-UP ✓"], w: 0.4, h: 0.28, fs: 64, x0: 110, y0: 250, dy: 200, cols: ["#2a2c30", "#9b1f17"] };
export const HNotepad: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[-0.5, 1.9, 0.9]} warm={1.1}
  cam={{ at: [0.0, 0.0, 0.0], at1: [0.02, 0.0, 0.02], az: [-0.2, 0.12], el: [1.1, 0.98], r: [0.6, 0.54], fov: 34 }}>{(tt) => {
  const rev = lerp(0, 2, eio(tt, 0.7, 4.9)), pen = padPen(NOTE, rev), wr = pen.writing ? 1 : 0;
  const lift = 0.012 * (1 - wr) + 0.0015 * Math.sin(tt * 18) * wr, done = eio(tt, 5.0, 5.6);
  return <>
    {/* la libreta: tapa de cartón, hojas, espiral */}
    <RBox s={[0.44, 0.008, 0.33]} p={[0, 0.004, 0.012]} r={0.004}><meshStandardMaterial color="#5a4632" roughness={0.8} /></RBox>
    <group position={[0, 0.0095, 0.012]} rotation={[-PI / 2, 0, 0]}><PadSheet sp={NOTE} rev={rev} /></group>
    {Array.from({ length: 13 }, (_, i) => <mesh key={i} position={[-0.18 + i * 0.03, 0.012, -0.15]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.008, 0.0013, 8, 20]} />{M.chrome()}</mesh>)}
    {/* encima: la llave de purga y el respiradero viejo que se sacó */}
    <BleedKey p={[0.15, 0.02, 0.15]} rot={[PI / 2, 0, 0.5]} s={1.3} />
    <group position={[0.27, 0.0, -0.08]}><Cup fill={0.7} col="#5b3a1e" s={1.3} /></group>
    {Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[0.27 + 0.01 * Math.sin(tt * 1.2 + i), 0.13 + ((tt * 0.05 + i * 0.03) % 0.12), -0.08]}><sphereGeometry args={[0.012 + 0.006 * i, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.08} depthWrite={false} /></mesh>)}
    {/* el lápiz sigue la punta del trazo; al terminar se aparta */}
    <Pencil p={[pen.x + 0.12 * done, 0.0105 + lift + 0.03 * done, 0.012 - pen.y]} rot={[-0.55, 0.0, -0.45 - 0.2 * done]} />
  </>;
}}</Scene3D>;

// ---- 4:30 · APAGADO Y FRÍO: el termómetro de aguja pegado al radiador barre de 210 °F a la temperatura del cuarto ----
export const HCoolDown: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#1b2026" key1={[-0.7, 1.6, 1.4]} warm={1.1}
  cam={{ at: [0.06, 0.38, 0.05], az: [0.3, 0.02], el: [0.1, 0.05], r: [1.08, 0.95], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[0.8, "VALVE OFF…"], [3.0, "…LET IT COOL TWO HOURS", "#1f4f9a"]]} />}>{(tt) => {
  const cool = eio(tt, 1.2, 5.2), v = lerp(212, 72, cool);
  return <>
    <Env kind="plaster" col="#556b5a" z={-0.32} y={0.9} rim={[0.6, 0.9, 0.0]} rimI={2.2} />
    <RBox s={[3, 0.5, 0.03]} p={[0, 0.25, -0.31]} r={0.004}>{M.wood({ base: [110, 72, 44] })}</RBox>
    <RBox s={[3, 0.03, 0.05]} p={[0, 0.5, -0.3]} r={0.006}>{M.wood({ base: [96, 62, 38] })}</RBox>
    {/* reloj de pared al lado: pasan dos horas (la aguja corta gira 60°, la larga da dos vueltas) */}
    <group position={[0.37, 0.5, -0.27]} scale={1.75}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.02, 48]} /><meshStandardMaterial color="#2a2a2a" metalness={0.4} roughness={0.4} /></mesh>
      <mesh position={[0, 0, 0.011]}><circleGeometry args={[0.088, 48]} /><meshStandardMaterial color="#f3efe4" roughness={0.6} /></mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[0.075 * Math.sin(i * PI / 6), 0.075 * Math.cos(i * PI / 6), 0.012]} rotation={[0, 0, -i * PI / 6]}><boxGeometry args={[0.004, i % 3 ? 0.008 : 0.016, 0.001]} /><meshBasicMaterial color="#222" /></mesh>)}
      <group position={[0, 0, 0.014]} rotation={[0, 0, -PI / 3 * cool - 0.4]}><mesh position={[0, 0.025, 0]}><boxGeometry args={[0.008, 0.05, 0.002]} /><meshBasicMaterial color="#111" /></mesh></group>
      <group position={[0, 0, 0.016]} rotation={[0, 0, -PI * 4 * cool]}><mesh position={[0, 0.035, 0]}><boxGeometry args={[0.005, 0.07, 0.002]} /><meshBasicMaterial color="#111" /></mesh></group>
      <group position={[0, 0, 0.018]} rotation={[0, 0, -PI * 2 * 0.8 * tt]}><mesh position={[0, 0.03, 0]}><boxGeometry args={[0.0025, 0.085, 0.001]} /><meshBasicMaterial color="#c4281c" /></mesh></group>
      <mesh position={[0, 0, 0.02]}><circleGeometry args={[0.008, 16]} /><meshBasicMaterial color="#b3261e" /></mesh>
      <mesh position={[0, 0, 0.022]}><circleGeometry args={[0.095, 48]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.08} roughness={0.05} clearcoat={1} depthWrite={false} /></mesh>
    </group>
    <group position={[-0.05, 0, -0.06]}><RadH n={9} w={0.05} h={0.56} heat={(i, y) => 0.95 - 0.85 * cool + 0.05 * Math.sin(i * 1.7 + y * 4)} glow={1.1} /></group>
    {/* el calor que sube del hierro, cada vez menos */}
    {Array.from({ length: 7 }, (_, i) => { const u = (tt * 0.35 + i / 7) % 1; return <mesh key={i} position={[-0.25 + i * 0.07, 0.68 + u * 0.22, -0.04]} rotation={[0, 0, 0.3 * Math.sin(i + tt)]}><planeGeometry args={[0.04, 0.12]} /><meshBasicMaterial color="#ff9a5a" transparent opacity={0.22 * (1 - u) * (1 - cool)} depthWrite={false} toneMapped={false} /></mesh>; })}
    {/* termómetro magnético grande, al frente */}
    <Gauge v={v} max={220} tx={dialTex("cool220", 220, 60, 90, "°F", 180)} p={[0.02, 0.36, 0.06]} r={0.11} />
  </>;
}}</Scene3D>;

// ---- 5:48 · EL MISMO AGUJERO: la válvula del radiador en corte; el vapor sube por el centro y el agua baja por el piso ----
export const HSameHole: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#262626" key1={[-0.6, 1.4, 1.4]}
  cam={{ at: [0.15, 0.27, 0], az: [-0.32, 0.18], el: [0.14, 0.1], r: [1.42, 1.3], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "ONE PIPE. ONE HOLE."], [3.0, "STEAM UP · WATER DOWN · SAME HOLE", "#1f4f9a"]]} />}>{(tt) => {
  const k = eio(tt, 0.4, 1.4), w = eio(tt, 2.6, 3.4);
  return <>
    <Env kind="plaster" col="#556a7a" z={-0.4} y={0.5} rim={[0.7, 0.8, -0.1]} />
    <mesh position={[-0.2, 0.12, 0]}><cylinderGeometry args={[0.05, 0.05, 0.28, 24, 1, true]} />{M.glass({ op: 0.18 })}</mesh>
    <mesh position={[0.05, 0.28, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.05, 0.05, 0.42, 24, 1, true]} />{M.glass({ op: 0.18 })}</mesh>
    <RBox s={[0.12, 0.13, 0.13]} p={[-0.2, 0.28, 0]} r={0.02}>{M.brass({ col: "#b48a3c" })}</RBox>
    <group position={[0.46, 0.0, 0]}><RadH n={5} w={0.045} h={0.5} heat={(i, y) => 0.3 + 0.55 * k * y} /></group>
    {/* el agua que vuelve: una lámina azul que corre por el piso del caño */}
    <mesh position={[0.05, 0.237, 0]} rotation={[0, 0, PI / 2]} scale={[1, w, 1]}><cylinderGeometry args={[0.012, 0.012, 0.42, 12]} />{M.water({ op: 0.85, col: "#3f93e0" })}</mesh>
    <Puffs tt={tt} n={8} a={[-0.2, 0, 0]} b={[-0.2, 0.28, 0]} r={0.014} op={0.75 * k} v={0.7} />
    <Puffs tt={tt} n={8} a={[-0.14, 0.3, 0]} b={[0.27, 0.3, 0]} r={0.014} op={0.75 * k} v={0.55} />
    <Puffs tt={tt} n={8} a={[0.27, 0.245, 0.02]} b={[-0.14, 0.245, 0.02]} r={0.01} col="#3f93e0" op={w} v={0.4} wob={0.002} />
    <Puffs tt={tt} n={7} a={[-0.235, 0.24, 0.02]} b={[-0.235, 0, 0.02]} r={0.01} col="#3f93e0" op={eio(tt, 2.9, 3.6)} v={0.5} wob={0.002} />
  </>;
}}</Scene3D>;
