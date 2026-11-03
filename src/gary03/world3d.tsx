// gary03 · EL MUNDO: el banco del garaje de Gary convertido en banco de pruebas. 12 power stations genéricas en fila
// (sin marcas), cada una con su etiqueta de precio colgando y el cartel de venta que promete de más. Las 9 de la izquierda son
// las que no compraría: cada punto la cámara aterriza en una y Gary le pinta una X roja de tiza en la tapa. Las 3 de la derecha,
// apartadas bajo la lámpara, son las que sí ($300 / $600 / $1,200) y reciben su tilde verde. Ventana con nieve, tablero de
// pinza, multímetro amarillo. Cámara y efectos salen de world.json (paradas ancladas a frases). Render SÓLO en el farm.
import React, { useMemo } from "react";
import * as THREE from "three";
import { C, WorldCanvas, cl, ease, fxAt, mkCamAt, mkCamSpeed, paint, rnd } from "./wengine";
import { M, RBox, tex } from "./h3d";

const TOP = 0.9;                                   // tapa del banco
const WX = 1.2;                                    // la ventana con nieve, sobre las tres buenas (se ve en el cuadro 0)
const XS = [...Array.from({ length: 9 }, (_, i) => -1.46 + i * 0.255), 0.96, 1.24, 1.55];
// tamaño de cada caja [ancho, alto, fondo] y color del cuerpo
const SZ: [number, number, number][] = [[0.2, 0.15, 0.13], [0.17, 0.13, 0.12], [0.23, 0.17, 0.15], [0.22, 0.16, 0.14], [0.19, 0.14, 0.13], [0.16, 0.12, 0.11], [0.21, 0.15, 0.14], [0.2, 0.14, 0.13], [0.22, 0.16, 0.15], [0.17, 0.13, 0.12], [0.22, 0.16, 0.15], [0.27, 0.2, 0.17]];
const BODY = ["#5d6166", "#2c2f33", "#8b8f93", "#3b3e42", "#6f6a60", "#2a2c2f", "#7a7e83", "#45484c", "#58534b", "#3a3d41", "#4a4e53", "#33363a"];
const CLAIM = ["POWERS EVERYTHING", "ULTRA LIGHT", "2000W", "1000Wh", "HOME BACKUP", "FRIDGE READY", "+ FREE SOLAR", "BEST PRICE", "EXPANDABLE", "LFP · PURE SINE", "LFP · PURE SINE", "LFP · PURE SINE"];
const PRICE = ["$249", "$329", "$399", "$549", "$289", "$159", "$449", "$219", "$899", "$300", "$600", "$1,200"];

const C3: Record<string, C> = {
  wide: { p: [0.05, 1.55, 2.6], l: [0.05, 1.0, 0], fov: 40 },
  wideL: { p: [-0.9, 1.35, 1.75], l: [-0.55, 0.98, 0], fov: 38 },
  trio: { p: [1.3, 1.25, 0.95], l: [1.25, 0.98, 0], fov: 36 },
  window: { p: [0.75, 1.5, 0.75], l: [WX, 1.45, -0.6], fov: 40 },
  meter: { p: [-0.25, 1.15, 0.55], l: [-0.2, 0.92, 0.18], fov: 34 },
  board: { p: [-0.6, 1.5, 0.9], l: [-0.6, 1.45, -0.6], fov: 40 },
  // cuadro 0 = la miniatura: la fila de cajas vista desde la derecha, la quemada adelante, la ventana con nieve y el farol
  thumb: { p: [0.98, 1.3, 1.3], l: [0.3, 1.02, -0.1], fov: 38 },
};
// una parada por caja (de frente, un poco arriba) y una cenital (la tapa con la tiza)
XS.forEach((x, i) => { const s = SZ[i]; C3["b" + i] = { p: [x + 0.12, TOP + s[1] + 0.2, 0.62], l: [x, TOP + s[1] * 0.55, 0], fov: 32 }; C3["lid" + i] = { p: [x + 0.02, TOP + s[1] + 0.55, 0.32], l: [x, TOP + s[1], 0], fov: 34 }; });
export const camAt = mkCamAt(C3);
export const camSpeed = mkCamSpeed(camAt);

const stickerTex = (i: number) => paint("stk" + i, 512, 160, (g) => {
  const big = CLAIM[i].length < 8;
  g.fillStyle = i >= 9 ? "#1f3b2a" : ["#d8361f", "#f2c21b", "#e8e2d2"][i % 3]; g.fillRect(0, 0, 512, 160);
  g.fillStyle = i >= 9 ? "#bdf2c8" : i % 3 === 1 ? "#1b1b1b" : i % 3 === 2 ? "#b8261b" : "#fff6e6";
  g.font = `900 ${big ? 110 : 58}px Arial`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(CLAIM[i], 256, 84);
});
const tagTex = (i: number) => paint("tag" + i, 128, 200, (g) => {
  g.fillStyle = "#efe3c4"; g.fillRect(0, 0, 128, 200);
  g.fillStyle = "#3a2b18"; g.beginPath(); g.arc(64, 26, 10, 0, 7); g.fill();
  g.fillStyle = "#24170c"; g.font = `700 ${PRICE[i].length > 4 ? 34 : 44}px Georgia`; g.textAlign = "center"; g.fillText(PRICE[i], 64, 110);
  g.strokeStyle = "rgba(60,40,20,.35)"; g.lineWidth = 2; g.beginPath(); g.moveTo(20, 140); g.lineTo(108, 140); g.stroke();
});
// trazo de tiza (una línea gruesa, con grano)
const chalk = (col: string) => paint("chalk" + col, 256, 48, (g) => {
  for (let i = 0; i < 900; i++) { const x = rnd(i, 1) * 256, y = 24 + (rnd(i, 2) - 0.5) * 30 * (0.6 + 0.4 * Math.sin(x / 40)); g.fillStyle = col; g.globalAlpha = 0.25 + 0.6 * rnd(i, 3); g.fillRect(x, y, 2 + rnd(i, 4) * 4, 2 + rnd(i, 5) * 3); }
});
// trazo que se dibuja de un extremo al otro (k 0..1), sobre la tapa (y local 0)
const Stroke: React.FC<{ k: number; len: number; rot: number; col: string; x?: number; z?: number }> = ({ k, len, rot, col, x = 0, z = 0 }) =>
  <group position={[x, 0.002, z]} rotation={[-Math.PI / 2, 0, rot]}>
    <mesh position={[-len / 2 + (len * Math.max(0.001, k)) / 2, 0, 0]} scale={[Math.max(0.001, k), 1, 1]}><planeGeometry args={[len, len * 0.19]} /><meshBasicMaterial map={chalk(col)} transparent depthWrite={false} toneMapped={false} /></mesh>
  </group>;

// la power station genérica: cuerpo redondeado, panel frontal oscuro con pantalla, tomas, manija, cartel y etiqueta colgante
const PStation: React.FC<{ i: number; t: number; f: (k: string) => number }> = ({ i, t, f }) => {
  const [w, h, d] = SZ[i], x = XS[i], hl = f("b" + i), on = f("on" + i), xk = f("x" + i), ok = i >= 9 ? f("ok" + (i - 9)) : 0;
  const lift = 0.025 * hl, sw = Math.sin(t * 1.7 + i) * 0.12 * (0.4 + hl);
  return <group position={[x, TOP + lift, rnd(i, 7) * 0.04 - 0.02]} rotation={[0, (rnd(i, 8) - 0.5) * 0.12, 0]}>
    <RBox s={[w, h, d]} p={[0, h / 2, 0]} r={0.014}><meshPhysicalMaterial color={BODY[i]} roughness={0.5} clearcoat={0.25} /></RBox>
    {/* panel frontal y pantalla (se enciende) */}
    <RBox s={[w * 0.86, h * 0.62, 0.004]} p={[0, h * 0.42, d / 2 + 0.001]} r={0.006} shadow={false}>{M.matte({ col: "#16181b" })}</RBox>
    <mesh position={[-w * 0.2, h * 0.55, d / 2 + 0.0045]}><planeGeometry args={[w * 0.28, h * 0.18]} /><meshStandardMaterial color="#0b1a12" emissive={on > 0.5 && i < 9 && f("beep") > 0.5 ? "#ff3b2a" : "#4dff9a"} emissiveIntensity={0.05 + 1.3 * on} /></mesh>
    {[0, 1].map((k) => <group key={k} position={[w * (0.08 + k * 0.17), h * 0.33, d / 2 + 0.004]}>
      <mesh><planeGeometry args={[w * 0.13, h * 0.2]} /><meshStandardMaterial color="#e8e6e0" roughness={0.6} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * w * 0.025, h * 0.02, 0.0006]}><planeGeometry args={[w * 0.012, h * 0.06]} /><meshBasicMaterial color="#111" /></mesh>)}
    </group>)}
    {[0, 1, 2].map((k) => <mesh key={"u" + k} position={[-w * 0.32 + k * w * 0.07, h * 0.25, d / 2 + 0.0045]}><planeGeometry args={[w * 0.04, h * 0.035]} /><meshBasicMaterial color="#0a0a0a" /></mesh>)}
    {/* rejillas laterales */}
    {Array.from({ length: 6 }, (_, k) => <mesh key={"v" + k} position={[w / 2 + 0.0006, h * (0.3 + k * 0.07), 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[d * 0.6, 0.006]} /><meshBasicMaterial color="#121315" /></mesh>)}
    {/* manija */}
    {[-1, 1].map((sd) => <mesh key={"hp" + sd} position={[sd * w * 0.32, h + 0.018, 0]}><boxGeometry args={[0.014, 0.036, 0.03]} />{M.matte({ col: "#1c1d20" })}</mesh>)}
    <RBox s={[w * 0.72, 0.016, 0.03]} p={[0, h + 0.036, 0]} r={0.006}>{M.matte({ col: "#1c1d20" })}</RBox>
    {/* cartel de venta (lo que promete la caja) */}
    <mesh position={[0, h * 0.86, d / 2 + 0.0015]}><planeGeometry args={[w * 0.86, h * 0.2]} /><meshStandardMaterial map={stickerTex(i)} roughness={0.55} /></mesh>
    {/* etiqueta de precio colgando de la manija con hilo, se balancea */}
    <group position={[w * 0.3, h + 0.03, d * 0.1]} rotation={[sw * 0.3, 0, sw]}>
      <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.0007, 0.0007, 0.06, 4]} /><meshBasicMaterial color="#d9cdb2" /></mesh>
      <mesh position={[0, -0.085, 0.004]} rotation={[0, -0.3, 0]}><planeGeometry args={[0.045, 0.07]} /><meshStandardMaterial map={tagTex(i)} roughness={0.8} side={THREE.DoubleSide} /></mesh>
    </group>
    {/* la tiza en la tapa: X roja (dos trazos) o tilde verde */}
    <group position={[0, h + 0.001, 0]}>
      {i < 9 && <><Stroke k={cl(xk * 2)} len={Math.min(w, d) * 1.05} rot={0.75} col="#ff4a3a" /><Stroke k={cl(xk * 2 - 1)} len={Math.min(w, d) * 1.05} rot={-0.75} col="#ff4a3a" /></>}
      {i >= 9 && <><Stroke k={cl(ok * 2.5)} len={Math.min(w, d) * 0.42} rot={-0.8} col="#7dff9e" x={-0.03} z={0.0} /><Stroke k={cl(ok * 1.6 - 0.6)} len={Math.min(w, d) * 0.9} rot={0.95} col="#7dff9e" x={0.025} z={-0.012} /></>}
    </group>
    {/* luz propia cuando se la nombra (siempre montada: intensidad, nunca && ) */}
    <pointLight position={[0, h + 0.25, 0.25]} intensity={1.6 * hl} distance={0.9} color="#ffe1b0" />
  </group>;
};

// copos que caen detrás de la ventana
const Snow: React.FC<{ t: number }> = ({ t }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const N = 220, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const ph = (t * (0.08 + 0.05 * rnd(i, 3)) + rnd(i, 1)) % 1; pos.set([WX - 0.45 + rnd(i, 2) * 0.9 + 0.04 * Math.sin(t * 0.8 + i), 1.78 - ph * 0.66, -0.585 - rnd(i, 4) * 0.01], i * 3); }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return <points geometry={geo}><pointsMaterial color="#eef4ff" size={0.012} transparent opacity={0.9} depthWrite={false} /></points>;
};

const pegTex = () => paint("peg", 512, 256, (g) => {
  g.fillStyle = "#b08a5a"; g.fillRect(0, 0, 512, 256);
  for (let y = 8; y < 256; y += 16) for (let x = 8; x < 512; x += 16) { g.fillStyle = "#3a2a18"; g.beginPath(); g.arc(x, y, 2.6, 0, 7); g.fill(); }
});


// la caja quemada de la miniatura (cuadro 0): cuerpo abierto con las celdas al rojo y humo; se apaga cuando arranca el cuento
const Burnt: React.FC<{ t: number; k: number }> = ({ t, k }) => <group position={[0.66, TOP, 0.26]} rotation={[0, 0.3, 0]} scale={Math.max(0.001, k)}>
  <RBox s={[0.3, 0.22, 0.2]} p={[0, 0.11, 0]} r={0.02}><meshStandardMaterial color="#2a2b2d" roughness={0.8} /></RBox>
  <mesh position={[-0.04, 0.1, 0.101]}><planeGeometry args={[0.18, 0.15]} /><meshStandardMaterial color="#120806" /></mesh>
  {Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[-0.1 + i * 0.04, 0.1, 0.085]}><cylinderGeometry args={[0.018, 0.018, 0.13, 16]} /><meshStandardMaterial color="#b9b4ad" metalness={0.6} roughness={0.4} emissive="#ff5a10" emissiveIntensity={1.2 + 0.4 * Math.sin(t * 2 + i)} /></mesh>)}
  <pointLight position={[-0.04, 0.12, 0.2]} intensity={1.4 * k} distance={0.8} color="#ff7a2a" />
  {Array.from({ length: 10 }, (_, i) => { const ph = (t * 0.35 + i / 10) % 1; return <mesh key={"s" + i} position={[-0.02 + 0.03 * Math.sin(i * 2 + t), 0.24 + ph * 0.4, 0.02]}><sphereGeometry args={[0.025 + ph * 0.045, 10, 8]} /><meshBasicMaterial color="#3a3a3c" transparent opacity={0.22 * (1 - ph) * k} depthWrite={false} /></mesh>; })}
</group>;
const Lantern: React.FC = () => <group position={[0.72, TOP, -0.22]}>
  <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.06, 0.07, 0.04, 24]} />{M.brass({ col: "#7a5a2a" })}</mesh>
  <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.05, 0.05, 0.16, 24, 1, true]} />{M.glass({ op: 0.3 })}</mesh>
  <mesh position={[0, 0.11, 0]}><sphereGeometry args={[0.018, 12, 10]} />{M.glow({ col: "#ffcf7a" })}</mesh>
  <mesh position={[0, 0.22, 0]}><coneGeometry args={[0.06, 0.05, 24]} />{M.brass({ col: "#7a5a2a" })}</mesh>
  <pointLight position={[0, 0.14, 0.05]} intensity={2.2} distance={1.6} color="#ffbf6a" />
</group>;

export const GarageWorld: React.FC<{ t: number }> = ({ t }) => {
  const fx = fxAt(t), f = (k: string) => fx[k] ?? 0, cam = camAt(t);
  const lamp = (0.85 + 0.15 * f("lamp")) * (1 - 0.6 * f("burn"));  // cuadro 0: el garaje en penumbra, como la miniatura
  return <WorldCanvas cam={cam} bg="#0d0f12" fog={[4, 14]}>
    <hemisphereLight args={["#dfe6ee", "#2a2018", 0.4]} />
    {/* la lámpara de pinza sobre el banco (luz principal, cálida) */}
    <spotLight position={[0.2, 2.1, 0.9]} angle={0.75} penumbra={0.8} intensity={30 * lamp} distance={6} castShadow color="#ffeacc" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />
    {/* luz fría de la ventana con nieve, del lado derecho */}
    <spotLight position={[WX + 0.1, 1.6, -0.5]} angle={0.7} penumbra={1} intensity={9} distance={5} color="#bcd4ff" />
    {/* las tres buenas, bajo su propia lámpara (sube cuando llegan) */}
    <spotLight position={[1.25, 1.9, 0.6]} angle={0.45} penumbra={0.9} intensity={14 * f("trio")} distance={3} color="#ffe2b0" />

    {/* piso de cemento, pared de bloque pintada, tablero de pinza */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow><planeGeometry args={[8, 6]} /><meshStandardMaterial color="#6d6a64" roughness={0.9} /></mesh>
    <mesh position={[0, 1.5, -0.62]} receiveShadow><planeGeometry args={[8, 3]} /><meshStandardMaterial color="#c9c1b0" roughness={0.95} /></mesh>
    <mesh position={[-0.55, 1.5, -0.6]} receiveShadow><planeGeometry args={[2.2, 0.95]} /><meshStandardMaterial map={pegTex()} roughness={0.85} /></mesh>
    {/* herramientas en el tablero: pinzas, destornilladores, rollos de cable */}
    {Array.from({ length: 9 }, (_, i) => <mesh key={"sd" + i} position={[-1.45 + i * 0.12, 1.55 + (i % 2) * 0.05, -0.585]} rotation={[0, 0, 0.05 * (i - 4)]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.2, 10]} />{M.plastic({ col: ["#d8361f", "#f2c21b", "#2b6fd6"][i % 3] })}</mesh>)}
    {[[-0.15, 1.6, "#d8361f"], [0.2, 1.48, "#1d1d1f"], [0.05, 1.75, "#f2c21b"]].map(([x, y, c], i) => <mesh key={"co" + i} position={[x as number, y as number, -0.57]} castShadow><torusGeometry args={[0.1, 0.022, 12, 40]} />{M.rubber({ col: c as string })}</mesh>)}
    {/* ventana con nieve (derecha) */}
    <mesh position={[WX, 1.45, -0.61]}><planeGeometry args={[0.9, 0.7]} /><meshBasicMaterial color="#9fb6d6" toneMapped={false} /></mesh>
    {[[-0.45, 0], [0.45, 0], [0, -0.35], [0, 0.35], [0, 0]].map(([dx, dy], i) => <mesh key={"wf" + i} position={[WX + dx, 1.45 + dy, -0.6]}><boxGeometry args={[i < 2 || i === 4 ? 0.04 : 0.94, i < 2 || i === 4 ? 0.74 : 0.04, 0.03]} />{M.wood({ base: [214, 206, 190] })}</mesh>)}
    <Snow t={t} />
    {/* el banco: tapa gruesa de madera, patas, estante de abajo */}
    <mesh position={[0.05, TOP - 0.03, 0]} castShadow receiveShadow><boxGeometry args={[3.6, 0.06, 0.78]} /><meshStandardMaterial map={tex.wood(5, 1, [146, 98, 56])} roughness={0.7} /></mesh>
    {[[-1.7, -0.32], [-1.7, 0.32], [1.8, -0.32], [1.8, 0.32], [0.05, -0.32], [0.05, 0.32]].map(([x, z], i) => <mesh key={"lg" + i} position={[x, (TOP - 0.06) / 2, z]} castShadow><boxGeometry args={[0.07, TOP - 0.06, 0.07]} />{M.wood({ base: [120, 80, 46] })}</mesh>)}
    <mesh position={[0.05, 0.22, 0]} receiveShadow castShadow><boxGeometry args={[3.5, 0.03, 0.7]} />{M.wood({ base: [110, 74, 42] })}</mesh>
    {/* debajo: rollos de cable y un balde */}
    <mesh position={[-1.1, 0.3, 0.05]} rotation={[-Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.13, 0.04, 12, 40]} />{M.rubber({ col: "#e0701f" })}</mesh>
    <mesh position={[1.1, 0.36, 0]} castShadow><cylinderGeometry args={[0.13, 0.11, 0.26, 32, 1, true]} />{M.plastic({ col: "#e6762a", side: THREE.DoubleSide })}</mesh>
    {/* la lámpara de pinza */}
    <group position={[0.2, 1.95, 0.25]} rotation={[0.5, 0, 0]}>
      <mesh castShadow><coneGeometry args={[0.13, 0.17, 32, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, -0.05, 0]}><sphereGeometry args={[0.04, 16, 12]} />{M.glow({ col: "#fff2d6" })}</mesh>
    </group>
    {/* multímetro amarillo, libreta y lápiz al frente del banco */}
    <group position={[-0.2, TOP, 0.22]} rotation={[0, 0.3, 0]}>
      <RBox s={[0.1, 0.035, 0.18]} p={[0, 0.0175, 0]} r={0.012}>{M.plastic({ col: "#f2c21b" })}</RBox>
      <RBox s={[0.07, 0.004, 0.05]} p={[0, 0.036, -0.045]} r={0.002}>{M.matte({ col: "#a9c3a2", em: "#6f8f6a", emI: 0.4 * f("meter") })}</RBox>
      <mesh position={[0, 0.037, 0.035]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.024, 0.024, 0.008, 32]} />{M.matte({ col: "#222" })}</mesh>
      <mesh position={[-0.08, 0.008, 0.06]} rotation={[0, 0, Math.PI / 2 - 0.1]} castShadow><cylinderGeometry args={[0.0035, 0.0035, 0.25, 6]} />{M.rubber({ col: "#c62a22" })}</mesh>
      <mesh position={[-0.06, 0.008, 0.09]} rotation={[0, 0.3, Math.PI / 2 - 0.1]} castShadow><cylinderGeometry args={[0.0035, 0.0035, 0.25, 6]} />{M.rubber({ col: "#151515" })}</mesh>
    </group>
    <group position={[0.3, TOP + 0.004, 0.25]} rotation={[0, -0.2, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.15, 0.21]} /><meshStandardMaterial map={tex.paper()} roughness={0.9} /></mesh>
      <mesh position={[0.02, 0.004, 0]} rotation={[0, 0.6, Math.PI / 2]} castShadow><cylinderGeometry args={[0.004, 0.004, 0.17, 6]} />{M.plastic({ col: "#e8b62c" })}</mesh>
    </group>
    <Burnt t={t} k={f("burn")} />
    <Lantern />
    {/* las 12 cajas */}
    {XS.map((_, i) => <PStation key={i} i={i} t={t} f={f} />)}
    {/* separador: regla de madera entre las 9 y las 3 */}
    <mesh position={[0.81, TOP + 0.006, 0]} castShadow><boxGeometry args={[0.02, 0.012, 0.6]} />{M.wood({ base: [190, 150, 96] })}</mesh>
  </WorldCanvas>;
};
export const World3D = GarageWorld;
// (para chequeos) cuánto se ve encendida cada caja
export const boxOn = (t: number, i: number) => ease(fxAt(t)["on" + i] ?? 0);
