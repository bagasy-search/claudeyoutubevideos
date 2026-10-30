// lhh29e · componentes únicos 31-39: una cucharada por mazo, la lata de talco con su borla, dónde no va, la tercera tanda dura,
// dos centavos contra cinco dólares, el oobleck que es piedra y es agua, veinte centavos sin pantalla, la piel del oso y el guante que entra.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn } from "./h3d";
import { Bowl, card, lg, SERIF } from "./saltkit";
import { Bear, CornBox, Glove, Mound, Naipe, Puff, Sprayer, powderMat } from "./cornkit";

const PI = Math.PI;

// ---- 11:49 · UNA CUCHARADA POR MAZO: con dos cucharadas, una nube blanca tapa la mesa de juego; con una sola, el mazo queda limpio y la mesa verde se ve ----
export const HDeckSpoon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.04, 0], az: [0, 0.05], el: [0.6, 0.52], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="NOT TOO MUCH" title="1 TBSP PER DECK" col={AMB} /><Tag tt={tt} at={0.6} x={560} y={880} txt="TOO MUCH = CLOUD" col={RED} size={36} /><Tag tt={tt} at={1.4} x={1360} y={880} txt="JUST RIGHT" col={GRN} size={38} /></>}>{(tt) => <>
  {[-1, 1].map((s) => { const bad = s < 0;
    return <group key={s} position={[s * 0.16, 0, 0]}>
      <RBox s={[0.26, 0.012, 0.22]} p={[0, 0.006, 0]} r={0.004}><meshStandardMaterial color="#2e5a3a" roughness={0.95} /></RBox>
      {Array.from({ length: 5 }, (_, i) => <Naipe key={i} k={"d" + s + i} txt={["A♣", "8♥", "K♦", "4♠", "Q♥"][i]} red={i % 2 === 1} p={[(i - 2) * 0.03, 0.013 + i * 0.0006, 0.02]} rot={[-PI / 2, 0, (i - 2) * 0.1]} dull={bad ? 0.6 : 0} />)}
      {bad && <Mound p={[0.06, 0.013, -0.06]} r={0.05} h={0.01} />}
      {bad && <Puff p={[0, 0.02, 0]} k={cl((tt - 0.6) / 3)} r={0.12} n={16} />}
      {[0, 1].map((j) => (bad || j === 0) && <group key={j} position={[-0.09 + j * 0.05, 0.02, -0.08]}><RBox s={[0.04, 0.004, 0.012]} p={[0.02, 0.004, 0]} r={0.002}>{M.steel({})}</RBox>
        <mesh scale={[1, 0.4, 0.8]}><sphereGeometry args={[0.012, 16, 10]} />{M.steel({})}</mesh></group>)}
    </group>; })}
</>}</Scene3D>;

// ---- 12:21 · LA LATA DE TALCO: la lata redonda de hojalata se destapa; la borla grande sale con su nubecita y la tapa queda girando ----
export const HPowderTin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" lamp={[-0.2, 0.45, 0.3]}
  cam={{ at: [0.0, 0.09, 0], az: [-0.3, 0.1], el: [0.3, 0.24], r: [0.66, 0.58], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="MAMA'S BODY POWDER" title="AN OLD POWDER TIN" col={AMB} /><Tag tt={tt} at={3.4} x={1450} y={860} txt="NO PERFUME" col={GRN} size={42} /></>}>{(tt) => {
  const lid = eio(tt, 0.6, 1.4), puff = eio(tt, 1.4, 2.6);
  const tinTex = tex.text("tin", 512, 128, (g) => { g.fillStyle = "#e6d6b0"; g.fillRect(0, 0, 512, 128); g.fillStyle = "#b85a6a"; for (let i = 0; i < 16; i++) { g.beginPath(); g.arc(16 + i * 32, 64, 10, 0, PI * 2); g.fill(); } g.fillStyle = "#3a5a7a"; g.fillRect(0, 0, 512, 12); g.fillRect(0, 116, 512, 12); });
  return <>
    <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.06, 0.06, 0.06, 48]} /><meshStandardMaterial map={tinTex} metalness={0.6} roughness={0.35} /></mesh>
    <mesh position={[0, 0.0605, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.057, 40]} />{powderMat()}</mesh>
    <group position={[0.03 * lid, 0.065 + 0.095 * lid, 0.0]} rotation={[lid * 1.2, tt * 3 * lid, 0]}>
      <mesh><cylinderGeometry args={[0.062, 0.062, 0.012, 48]} /><meshStandardMaterial map={tinTex} metalness={0.6} roughness={0.35} /></mesh>
      <mesh position={[0, 0.0065, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.058, 40]} /><meshStandardMaterial map={card("tinlid", 256, 256, ["PURE", "POWDER"], 50, "#3a5a7a", "#efe2c4")} metalness={0.4} roughness={0.4} /></mesh>
    </group>
    <group position={[-0.02 - 0.09 * puff, 0.07 + 0.05 * puff, 0]} rotation={[0.3 * puff, 0, 0.4 * puff]}>
      <mesh scale={[1, 0.45, 1]}><sphereGeometry args={[0.045, 32, 20]} /><meshStandardMaterial color="#fbf2f0" roughness={1} bumpMap={tex.paper(4, 4)} bumpScale={12} /></mesh>
      <mesh position={[0, 0.02, 0]}><torusGeometry args={[0.01, 0.003, 8, 20]} /><meshStandardMaterial color="#e8b8c4" roughness={0.6} /></mesh>
    </group>
    <Puff p={[-0.08, 0.1, 0]} k={cl((tt - 1.5) / 2.2)} r={0.06} n={14} />
    {lid > 0.6 && Array.from({ length: 36 }, (_, i) => { const q = ((tt * 1.2 + i / 36) % 1); return <mesh key={"lp" + i} position={[0.02 + (rn(i, 31) - 0.5) * 0.08, 0.15 - q * 0.08, 0.0 + (rn(i, 32) - 0.5) * 0.06]}><sphereGeometry args={[0.0028, 6, 5]} />{powderMat("#ffffff", 0.95)}</mesh>; })}
  </>; }}</Scene3D>;

// ---- 12:36 · NO DONDE HAY HONGOS: la maicena hecha comida para la levadura; los granitos blancos se acercan a un pliegue tibio y húmedo, la levadura crece y aparece la cruz roja: ahí no ----
export const HYeastNo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.35]}
  cam={{ at: [0.02, 0.08, 0], az: [0.25, 0.05], el: [0.3, 0.26], r: [0.8, 0.7], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="HONEST WORDS" title="IT CAN FEED YEAST" col={RED} /><Tag tt={tt} at={3.6} x={900} y={120} txt="ASK YOUR DOCTOR" col={AMB} size={44} /></>}>{(tt) => {
  const tilt = eio(tt, 0.4, 1.0) * (1 - eio(tt, 2.4, 3.0)), grow = eio(tt, 1.6, 5.0);
  return <>
    <CornBox p={[-0.2, 0.0, -0.02]} rot={[0, 0.5, -0.9 * tilt]} s={0.8} lid={1} />
    {Array.from({ length: 40 }, (_, i) => { const st = 0.9 + rn(i, 2) * 1.4, u = cl((tt - st) / 0.7); if (u <= 0 || u >= 1) return null;
      return <mesh key={i} position={[lerp(-0.13, 0.1, u) + (rn(i, 3) - 0.5) * 0.02, 0.16 - 0.1 * u * u + Math.sin(u * PI) * 0.03, (rn(i, 4) - 0.5) * 0.03]}><sphereGeometry args={[0.003, 6, 5]} />{powderMat()}</mesh>; })}
    {/* el bol de masa tibia: con la maicena la levadura come y la masa sube y se infla */}
    <group position={[0.12, 0, 0]}>
      <mesh geometry={lg("ybowl", [[0, 0], [0.06, 0], [0.1, 0.05], [0.105, 0.075], [0.1, 0.075], [0.095, 0.052], [0.058, 0.006], [0, 0.006]], 48)} castShadow>{M.porcelain({ col: "#d8e4ea", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.05 + 0.03 * grow, 0]} scale={[1, 0.45 + 0.55 * grow, 1]}><sphereGeometry args={[0.096 + 0.012 * grow, 48, 24, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#efdcb4" roughness={0.75} bumpMap={tex.paper(3, 3)} bumpScale={3} /></mesh>
      {Array.from({ length: 9 }, (_, i) => { const a = i * 2.4, r = 0.02 + 0.06 * rn(i, 5), k = cl(grow * 1.5 - rn(i, 6) * 0.5); return <mesh key={i} position={[Math.cos(a) * r, 0.05 + 0.03 * grow + (0.042 + 0.05 * grow) * Math.sqrt(1 - (r / 0.11) ** 2), Math.sin(a) * r]} scale={k}><sphereGeometry args={[0.006, 12, 8]} /><meshPhysicalMaterial color="#f6ead0" roughness={0.3} clearcoat={0.6} /></mesh>; })}
    </group>
    {/* el sobrecito de levadura al lado */}
    {[0, 1].map((j) => { const g = Math.max(0, Math.sin(tt * 2.2 + j * 2)); return <group key={"gl" + j} position={[0.02 + j * 0.03, 0.03 + j * 0.01, 0.15 - j * 0.02]} rotation={[0, 0, tt * 0.8 + j]} scale={Math.max(0.001, g * (1.2 - j * 0.4))}>
      {[0, PI / 2].map((a) => <mesh key={a} rotation={[0, 0, a]}><boxGeometry args={[0.05, 0.0035, 0.001]} />{M.glow({ col: "#fff2c0", op: 0.9 })}</mesh>)}<mesh><sphereGeometry args={[0.005, 10, 8]} />{M.glow({ col: "#ffffff", op: 0.9 })}</mesh></group>; })}
    <group position={[0.02, 0.003, 0.14]} rotation={[0, -0.4, 0]} scale={1.35}><RBox s={[0.07, 0.004, 0.09]} r={0.002}><meshStandardMaterial map={card("yeastp", 160, 200, ["DRY", "YEAST"], 40, "#7a2a1a", "#f2d68a")} roughness={0.5} /></RBox></group>
  </>; }}</Scene3D>;

// ---- 13:10 · LA TERCERA TANDA, DURA: tres galletas en fila salen de la tabla enharinada, cada una más gris y dura (se quiebra con un crac); la de maicena queda tierna y dorada ----
export const HToughBatch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.04, 0.02], az: [-0.1, 0.05], el: [0.45, 0.38], r: [0.58, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="EXTRA FLOUR" title="BY BATCH 3: TOUGH" col={RED} /><Tag tt={tt} at={2.4} x={520} y={880} txt="BATCH 3: CRACK" col={RED} size={38} /><Tag tt={tt} at={3.2} x={1400} y={880} txt="CORNSTARCH: TENDER" col={GRN} size={38} /></>}>{(tt) => <>
  <RBox s={[0.7, 0.02, 0.3]} p={[0, 0.01, 0]} r={0.006}>{M.wood({ base: [190, 150, 100] })}</RBox>
  {(() => { const l1 = phys(tt, 0.3, 8, 0.45), l2 = phys(tt, 0.8, 8, 0.45), brk = eio(tt, 2.0, 2.4), TOUGH = new THREE.Color("#c8bea6"), TEN = new THREE.Color("#f2d48c");
    return <>
      <group position={[-0.12, 0.02 + (1 - cl(l1)) * 0.2, 0]} scale={2.1}>
        {[-1, 1].map((s) => <group key={s} position={[s * 0.014 * brk, 0.006 * brk, 0]} rotation={[0, 0, -s * 0.3 * brk]}>
          <mesh scale={[1, 0.3, 1]}><cylinderGeometry args={[0.045, 0.045, 0.04, 40, 1, false, s < 0 ? PI : 0, PI]} /><meshStandardMaterial color={TOUGH} roughness={0.9} bumpMap={tex.paper(2, 2)} bumpScale={16} side={THREE.DoubleSide} /></mesh>
          <Mound p={[0, 0.007, 0]} r={0.03} h={0.004} col="#f0e6d0" /></group>)}
        {Array.from({ length: 16 }, (_, i) => { const q = cl((tt - 2.0 - rn(i, 41) * 0.25) / 0.7); if (q <= 0) return null; const sd = i % 2 ? 1 : -1;
          return <mesh key={i} position={[(rn(i, 42) - 0.5) * 0.01 + sd * q * (0.03 + rn(i, 43) * 0.04), 0.008 + Math.sin(Math.min(1, q) * PI) * 0.035 - q * 0.004, (rn(i, 44) - 0.5) * 0.06]} rotation={[i, i * 2, 0]}><boxGeometry args={[0.0045, 0.003, 0.004]} /><meshStandardMaterial color={TOUGH} roughness={1} /></mesh>; })}
      </group>
      <group position={[0.13, 0.02 + (1 - cl(l2)) * 0.2, 0]} scale={2.1}>
        <mesh scale={[1, 0.36, 1]}><cylinderGeometry args={[0.045, 0.047, 0.04, 40]} /><meshStandardMaterial color={TEN} roughness={0.7} bumpMap={tex.paper(2, 2)} bumpScale={4} /></mesh>
        <mesh position={[0, 0.0075, 0]} scale={[1, 0.25, 1]}><sphereGeometry args={[0.044, 32, 12, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color={TEN} roughness={0.65} /></mesh>
        {Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[0, 0.03 + ((tt + j / 6) % 1) * 0.05, 0]} scale={0.6}><sphereGeometry args={[0.01, 8, 6]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.2 * (1 - ((tt + j / 6) % 1))} depthWrite={false} /></mesh>)}
      </group></>; })()}
</>}</Scene3D>;

// ---- 14:51 · DOS CENTAVOS LA BOTELLA: la lata de almidón del súper con su etiqueta de 5 dólares cae pesada; el rociador casero aterriza al lado con su etiquetita de 2 centavos ----
export const HTwoCents: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.1, 0], az: [0.15, -0.1], el: [0.18, 0.14], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="HOMEMADE SPRAY STARCH" title="TWO CENTS A BOTTLE" col={GRN} /><Tag tt={tt} at={0.8} x={560} y={880} txt="STORE: $5" col={RED} size={42} /><Tag tt={tt} at={1.8} x={1360} y={880} txt="MINE: 2¢" col={GRN} size={42} /></>}>{(tt) => {
  const a = phys(tt, 0.4, 7, 0.4), b = phys(tt, 1.4, 7, 0.4);
  return <>
    <group position={[-0.14, (1 - cl(a)) * 0.3, 0]}>
      <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.038, 0.038, 0.18, 40]} /><meshStandardMaterial map={tex.text("can", 256, 256, (g) => { g.fillStyle = "#2a5ab8"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#ffffff"; g.font = "bold 46px " + SERIF; g.textAlign = "center"; g.fillText("SPRAY", 128, 110); g.fillText("STARCH", 128, 160); })} metalness={0.5} roughness={0.35} /></mesh>
      <mesh position={[0, 0.19, 0]}><cylinderGeometry args={[0.03, 0.036, 0.02, 32]} />{M.plastic({ col: "#e8e8e8" })}</mesh>
      <group position={[0.05, 0.14, 0.03]} rotation={[0, 0, -0.3 + Math.sin(tt * 2) * 0.1]}><mesh><planeGeometry args={[0.06, 0.032]} /><meshStandardMaterial map={card("p5", 128, 70, ["$4.99"], 40, "#b8322a", "#fff6d8")} side={THREE.DoubleSide} /></mesh></group>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.12, 0.002, 0.06 + rn(i, 3) * 0.04]} rotation={[-PI / 2, 0, rn(i, 4) * 3]}><planeGeometry args={[0.006, 0.004]} /><meshStandardMaterial color="#ffffff" /></mesh>)}
    </group>
    <group position={[0.14, (1 - cl(b)) * 0.3, 0]}>
      <Sprayer s={0.95} fill={0.75} cloud={0.4} />
      <group position={[0.05, 0.12, 0.03]} rotation={[0, 0, 0.3 + Math.sin(tt * 2 + 1) * 0.1]}><mesh><planeGeometry args={[0.05, 0.03]} /><meshStandardMaterial map={card("p2", 128, 70, ["2¢"], 46, "#2a7a3a", "#fff6d8")} side={THREE.DoubleSide} /></mesh></group>
    </group>
  </>; }}</Scene3D>;

// ---- 15:08 · PIEDRA Y AGUA: el oobleck en el bol; el puño pega y rebota como contra una piedra; después la mano se apoya despacio y los dedos se hunden ----
export const HOobleck: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.06, 0], az: [0.3, 0.15], el: [0.34, 0.28], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="2 CUPS + 1 CUP WATER" title="OOBLECK" col={ICE} /><Tag tt={tt} at={0.9} x={560} y={880} txt="PUNCH: HARD AS ROCK" col={AMB} size={36} />
    <Tag tt={tt} at={4.2} x={1360} y={880} txt="REST: IT SINKS" col={GRN} size={38} /></>}>{(tt) => {
  const hit = tt < 3.0 ? Math.max(0, Math.sin(Math.min(1, tt / 0.6) * PI / 2)) * (tt < 0.9 ? 1 : Math.abs(Math.cos((tt - 0.9) * 6)) * Math.exp(-(tt - 0.9) * 2)) : 0;
  const sink = eio(tt, 3.6, 6.0), fist = tt < 3.0, hy = fist ? lerp(0.25, 0.075, tt < 0.9 ? eio(tt, 0.3, 0.9) : 1 - 0.8 * (1 - Math.exp(-(tt - 0.9) * 2)) * Math.abs(Math.sin((tt - 0.9) * 6))) : lerp(0.2, 0.06 - 0.02 * sink, eio(tt, 3.2, 3.8));
  return <>
    <Bowl s={1.5} col="#d8e4ea" />
    <mesh position={[0, 0.06, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.095, 48]} /><meshPhysicalMaterial color="#f6f4ec" roughness={0.3} clearcoat={0.7} /></mesh>
    {tt > 0.85 && tt < 1.6 && Array.from({ length: 3 }, (_, i) => <mesh key={i} position={[0, 0.0605, 0]} rotation={[-PI / 2, 0, 0]} scale={0.4 + (tt - 0.85) * 3 + i * 0.3}><ringGeometry args={[0.02, 0.023, 40]} />{M.glow({ col: "#ffd24a", op: 0.8 * (1 - (tt - 0.85) / 0.75) })}</mesh>)}
    <group position={[0, hy + (fist ? 0.02 : 0), 0]}>
      {fist ? <RBox s={[0.07, 0.05, 0.06]} r={0.02}><meshStandardMaterial color="#e8b898" roughness={0.65} /></RBox>
        : <group><RBox s={[0.07, 0.016, 0.07]} p={[0, 0.01, -0.02]} r={0.008}><meshStandardMaterial color="#e8b898" roughness={0.65} /></RBox>
          {[-0.024, -0.008, 0.008, 0.024].map((x, i) => <mesh key={i} position={[x, 0.01 - 0.02 * sink, 0.035]} rotation={[PI / 2 + sink * 0.4, 0, 0]}><capsuleGeometry args={[0.007, 0.03, 6, 10]} /><meshStandardMaterial color="#e8b898" roughness={0.65} /></mesh>)}</group>}
    </group>
    {!fist && <mesh position={[0, 0.061, 0.03]} rotation={[-PI / 2, 0, 0]} scale={sink}><ringGeometry args={[0.03, 0.045, 32]} /><meshPhysicalMaterial color="#ffffff" roughness={0.2} clearcoat={1} transparent opacity={0.6} /></mesh>}
  </>; }}</Scene3D>;

// ---- 15:37 · VEINTE CENTAVOS, CERO PANTALLA: la tele vieja se apaga a un puntito; al lado el bol de oobleck y el reloj corre dos horas; las moneditas suman 20 ----
export const HNoScreen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [-0.02, 0.1, 0], az: [-0.2, 0.1], el: [0.22, 0.18], r: [0.86, 0.76], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="TWO HOURS" title="NO SCREEN · 20¢" col={GRN} /></>}>{(tt) => { const off = eio(tt, 0.4, 1.2), hr = eio(tt, 1.2, 4.2);
  return <>
    <group position={[-0.2, 0, -0.04]}>
      <RBox s={[0.2, 0.16, 0.14]} p={[0, 0.1, 0]} r={0.012}>{M.wood({ base: [110, 70, 40] })}</RBox>
      <mesh position={[-0.02, 0.105, 0.071]}><planeGeometry args={[0.13, 0.1]} /><meshStandardMaterial color="#0c0f10" emissive="#9fd0ff" emissiveIntensity={(1 - off) * 1.2} /></mesh>
      <mesh position={[-0.02, 0.105, 0.072]} scale={[(1 - off) + 0.02, (1 - off) * 0.9 + 0.02, 1]}><planeGeometry args={[0.12, 0.09]} />{M.glow({ col: "#e8f4ff", op: off < 1 ? 0.4 + off * 0.6 : 0 })}</mesh>
      {[0, 1].map((i) => <mesh key={i} position={[0.07, 0.13 - i * 0.04, 0.071]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.009, 0.009, 0.006, 20]} />{M.chrome({})}</mesh>)}
      {[-1, 1].map((s) => <mesh key={"ant" + s} position={[s * 0.03, 0.22, -0.02]} rotation={[0, 0, -s * 0.45]}><cylinderGeometry args={[0.0018, 0.0018, 0.1, 6]} />{M.chrome({})}</mesh>)}
      <mesh position={[0, 0.183, -0.02]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.014, 16, 10]} /><meshStandardMaterial color="#2a2a2a" /></mesh>
      {[-1, 1].map((s) => <mesh key={"lg" + s} position={[s * 0.08, 0.01, 0]}><cylinderGeometry args={[0.005, 0.004, 0.02, 8]} />{M.wood({ base: [80, 50, 30] })}</mesh>)}
    </group>
    <Bowl p={[0.12, 0, 0.05]} s={1.1} col="#d8e4ea" />
    <mesh position={[0.12, 0.045, 0.05]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 40]} /><meshPhysicalMaterial color="#f6f4ec" roughness={0.3} clearcoat={0.7} /></mesh>
    <group position={[0.24, 0.18, -0.12]}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.045, 0.045, 0.01, 48]} />{M.brass({})}</mesh>
      <mesh position={[0, 0, 0.0055]}><circleGeometry args={[0.04, 48]} /><meshStandardMaterial color="#fbfaf6" /></mesh>
      <group position={[0, 0, 0.007]} rotation={[0, 0, -hr * PI * 4]}><mesh position={[0, 0.016, 0]}><boxGeometry args={[0.0025, 0.032, 0.001]} /><meshBasicMaterial color="#222" /></mesh></group>
      <group position={[0, 0, 0.008]} rotation={[0, 0, -hr * PI / 3]}><mesh position={[0, 0.011, 0]}><boxGeometry args={[0.0035, 0.022, 0.001]} /><meshBasicMaterial color="#222" /></mesh></group></group>
    {[0, 1].map((i) => <mesh key={i} position={[0.02 + i * 0.022, 0.001 + i * 0.0016, 0.18]} rotation={[0, i, 0]} scale={cl(hr * 3 - i)}><cylinderGeometry args={[0.0105, 0.0105, 0.0016, 28]} />{M.steel({ col: "#cfd3d6" })}</mesh>)}
  </>; }}</Scene3D>;

// ---- 16:29 · SE CHUPA LA GRASA DEL PELO: primerísimo plano de la piel del oso; las hebras grises de grasa y polvo; los granitos blancos se pegan a la mugre y la sacan al cepillar ----
export const HOilFur: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" bg="#17120e"
  cam={{ at: [0, 0.06, 0], az: [0.2, -0.1], el: [0.3, 0.24], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="MR. BUTTONS SINCE 1986" title="IT SOAKS UP THE OIL" col={AMB} /><Tag tt={tt} at={4.2} x={1450} y={860} txt="THEN BRUSH IT OUT" col={GRN} size={40} /></>}>{(tt) => {
  const dust = eio(tt, 0.6, 2.2), soak = eio(tt, 1.6, 3.2), brush = eio(tt, 3.0, 5.0);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.5, 0.3]} /><meshStandardMaterial color="#4a3426" roughness={1} /></mesh>
    {Array.from({ length: 140 }, (_, i) => { const x = (rn(i, 2) - 0.5) * 0.42, z = (rn(i, 3) - 0.5) * 0.24, swept = brush > (x + 0.21) / 0.42 ? 1 : 0;
      const col = new THREE.Color("#5e4330").lerp(new THREE.Color("#4a4440"), (1 - soak) * 0.5).lerp(new THREE.Color("#9a7552"), swept * 0.7);
      return <mesh key={i} position={[x, 0.02, z]} rotation={[0.3 * Math.sin(i), 0, 0.3 * Math.cos(i) + swept * 0.4]}><cylinderGeometry args={[0.0012, 0.002, 0.04, 5]} /><meshStandardMaterial color={col} roughness={1} /></mesh>; })}
    {Array.from({ length: 60 }, (_, i) => { const x = (rn(i, 5) - 0.5) * 0.42, swept = brush > (x + 0.21) / 0.42; if (swept) return null;
      return <mesh key={i} position={[x, lerp(0.15, 0.03 + rn(i, 6) * 0.01, dust), (rn(i, 7) - 0.5) * 0.24]}><sphereGeometry args={[0.0028 + soak * 0.0012, 6, 5]} />{powderMat(new THREE.Color("#ffffff").lerp(new THREE.Color("#b0a690"), soak).getStyle())}</mesh>; })}
    {brush > 0 && <mesh position={[-0.21 + 0.21 * brush, 0.042, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.42 * brush + 0.001, 0.22]} /><meshStandardMaterial color="#c49a6a" transparent opacity={0.35} roughness={1} depthWrite={false} /></mesh>}
    <group position={[lerp(-0.24, 0.2, brush), 0.07, 0]} rotation={[0.25, 0, 0.15]} scale={1.3}>
      <RBox s={[0.05, 0.02, 0.2]} r={0.008}>{M.wood({ base: [170, 120, 74] })}</RBox>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0, -0.018, -0.09 + i * 0.02]}><cylinderGeometry args={[0.004, 0.004, 0.02, 6]} /><meshStandardMaterial color="#e8dcc4" roughness={1} /></mesh>)}
    </group>
  </>; }}</Scene3D>;

// ---- 17:20 · EL GUANTE QUE ENTRA: el guante amarillo de goma; cae la cucharadita de maicena adentro, se sacude, y la mano entra derecho hasta el puño ----
export const HGloveSlide: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.1, 0], az: [0.2, -0.1], el: [0.14, 0.1], r: [0.56, 0.48], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="1 TSP IN EACH GLOVE" title="HANDS SLIDE RIGHT IN" col={AMB} /><Tag tt={tt} at={4.2} x={1450} y={860} txt="DRY FOR A WEEK" col={GRN} size={42} /></>}>{(tt) => {
  const pour = cl((tt - 0.4) / 1.0), sh = tt > 1.6 && tt < 2.8 ? Math.sin(tt * 24) * 0.12 : 0, inn = eio(tt, 3.0, 4.4);
  return <>
    <group position={[0, 0.06, 0]} rotation={[0, 0, sh]}><Glove s={1.4} inflate={inn} /></group>
    {pour > 0 && pour < 1 && Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.01, 0.06 - 0.035 - ((tt * 1.6 + rn(i, 3)) % 1) * 0.08 + 0.12, 0]}><sphereGeometry args={[0.0025, 6, 5]} />{powderMat()}</mesh>)}
    <group position={[0, lerp(-0.18, 0.02, inn), 0]} scale={1}>
      <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.03, 0.033, 0.12, 24]} /><meshStandardMaterial color="#e8b898" roughness={0.65} /></mesh>
      <mesh position={[0, -0.15, 0]}><cylinderGeometry args={[0.04, 0.044, 0.12, 24]} /><meshStandardMaterial color="#c8a0d8" roughness={0.85} bumpMap={tex.paper(2, 2)} bumpScale={4} /></mesh>
    </group>
    <Puff p={[0, 0.06, 0.02]} k={cl((tt - 3.1) / 1.4)} r={0.08} n={16} />
    {inn > 0.1 && inn < 0.95 && Array.from({ length: 20 }, (_, i) => { const q = ((tt * 1.5 + i / 20) % 1); return <mesh key={"gp" + i} position={[Math.cos(i * 2.4) * (0.05 + q * 0.06), 0.06 + q * 0.05, Math.sin(i * 2.4) * (0.03 + q * 0.04) + 0.02]}><sphereGeometry args={[0.004, 6, 5]} />{powderMat("#ffffff", 0.9 * (1 - q))}</mesh>; })}
    <mesh position={[-0.2, 0.03, -0.05]}><boxGeometry args={[0.16, 0.06, 0.12]} /><meshPhysicalMaterial color="#cfe6f2" roughness={0.1} clearcoat={1} transparent opacity={0.55} /></mesh>
  </>; }}</Scene3D>;
