// lhh29e · componentes únicos 1-10 (kit h3d + cornkit): la alcancía de centavos que arma un 15, la caja azul que se va y entra la amarilla,
// la cinta azul de 1979, la salpicadura de grasa, la palma que palmea, la noche entera, por qué no frotar, los cuatro lugares, los 41 años y la plata de los huevos.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn } from "./h3d";
import { SaltBox, Egg, Skillet, card, SERIF } from "./saltkit";
import { BraidRug, Coin, CornBox, Drumstick, Mound, Puff, powderMat } from "./cornkit";

const PI = Math.PI;

// ---- 0:37 · QUINCE TRABAJOS POR CENTAVOS: los centavos de cobre caen uno a uno sobre la mesa y van dibujando un 15 al lado de la caja amarilla ----
const F15: number[][] = [[-0.12, 0.08], [-0.12, 0.04], [-0.12, 0], [-0.12, -0.04], [-0.12, -0.08], [-0.02, 0.08], [0.03, 0.08], [0.08, 0.08], [-0.02, 0.04], [-0.02, 0.0],
  [0.03, 0.0], [0.075, -0.03], [0.07, -0.07], [0.02, -0.085], [-0.025, -0.075]];
export const HPennies15: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0.06, 0.07, -0.06], az: [-0.12, 0.04], el: [0.36, 0.3], r: [0.62, 0.52], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="15 JOBS FOR PENNIES" col={AMB} /><Tag tt={tt} at={3.6} x={1450} y={860} txt="ONE YELLOW BOX" col={GRN} size={42} /></>}>{(tt) => <>
  <CornBox p={[0.2, 0, -0.2]} rot={[0, -0.3, 0]} s={1.1} />
  {F15.map(([x, z], i) => { const a = 0.3 + i * 0.2, k = phys(tt, a, 9, 0.35); if (tt < a) return null;
    const fl = Math.max(0, 1 - Math.abs(tt - a - 0.35) / 0.25); return <group key={i}><Coin p={[(rn(i, 7) - 0.5) * 0.006, 0.0035 + i * 0.0068 + (1 - cl(k)) * 0.3, (rn(i, 8) - 0.5) * 0.006]} rot={[0, rn(i, 2) * 3, (1 - cl(k)) * 2]} s={4.5} /><mesh position={[0.03, 0.006 + i * 0.0068, 0.03]} scale={Math.max(0.001, fl)}><sphereGeometry args={[0.014, 12, 10]} />{M.glow({ col: "#fff0b8", op: 0.85 })}</mesh></group>; })}
</>}</Scene3D>;

// ---- 0:52 · DE LA SAL A LA MAICENA: la caja azul de sal de la vez pasada se desliza fuera y entra la amarilla de maicena al mismo lugar del estante ----
export const HSwapBox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.09, 0], az: [-0.1, 0.1], el: [0.16, 0.12], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="LAST TIME: SALT" title="TODAY: CORNSTARCH" col={AMB} /><Tag tt={tt} at={1.2} x={600} y={860} txt="60¢ SALT" col={ICE} size={40} />
    <Tag tt={tt} at={2.6} x={1300} y={860} txt="THE YELLOW BOX" col={AMB} size={42} /></>}>{(tt) => { const out = eio(tt, 0.8, 2.0), inn = eio(tt, 1.6, 2.8);
  return <>
    <RBox s={[0.7, 0.014, 0.2]} p={[0, 0.0, 0]} r={0.004}>{M.wood({ base: [160, 116, 70] })}</RBox>
    <SaltBox p={[lerp(0, -0.5, out), 0.007, 0]} rot={[0, out * 0.4, 0]} s={1.1} />
    <CornBox p={[lerp(0.55, 0, inn), 0.007, 0]} rot={[0, (1 - inn) * -0.5, 0]} s={1.15} torn lid={eio(tt, 3.2, 4.2) * 0.5} />
    <Puff p={[0, 0.17, 0]} k={cl((tt - 3.6) / 2)} r={0.04} />
    {[-0.24, 0.24].map((x) => <mesh key={x} position={[x, 0.07, -0.05]}><cylinderGeometry args={[0.035, 0.035, 0.13, 32]} /><meshStandardMaterial color="#e8dcc4" roughness={0.5} /></mesh>)}
  </>; }}</Scene3D>;

// ---- 1:10 · LA CINTA AZUL DE 1979: la escarapela azul cae girando frente a la tarta de merengue y el año sube en el tambor ----
export const HRibbon79: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#14110e" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.09, 0], az: [0.2, -0.1], el: [0.22, 0.18], r: [0.64, 0.54], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="STORY COUNTY FAIR" title="BLUE RIBBON · 1979" col={ICE} /><Tag tt={tt} at={4.2} x={960} y={230} txt="OVER EDNA PRUITT" col={AMB} size={42} /></>}>{(tt) => { const k = phys(tt, 0.5, 6, 0.45);
  return <>
    <RBox s={[0.6, 0.02, 0.3]} p={[0, 0.01, 0]} r={0.006}><meshStandardMaterial color="#f4efe4" roughness={0.8} /></RBox>
    <mesh position={[-0.08, 0.04, 0]}><cylinderGeometry args={[0.12, 0.1, 0.04, 48]} /><meshStandardMaterial color="#d49a4e" roughness={0.7} /></mesh>
    <mesh position={[-0.08, 0.06, 0]} scale={[1, 0.45, 1]}><sphereGeometry args={[0.11, 48, 24, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#fff6e6" roughness={0.6} /></mesh>
    <group position={[-0.08, 0.1 + (1 - cl(k)) * 0.3, 0.03]} rotation={[-0.9 * cl(k), (1 - cl(k)) * 6, 0]}>
      {Array.from({ length: 16 }, (_, i) => <mesh key={i} rotation={[0, 0, (i / 16) * PI * 2]} position={[0, 0, -0.002]}><boxGeometry args={[0.012, 0.09, 0.002]} /><meshStandardMaterial color="#1e4aa8" roughness={0.5} /></mesh>)}
      <mesh><circleGeometry args={[0.035, 40]} /><meshStandardMaterial map={card("rib", 128, 128, ["1ST"], 54, "#ffd84a", "#1e4aa8")} roughness={0.4} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.015, -0.09, -0.003]} rotation={[0, 0, s * 0.15]}><planeGeometry args={[0.025, 0.11]} /><meshStandardMaterial color="#1e4aa8" side={THREE.DoubleSide} /></mesh>)}
    </group>
    <group position={[0.17, 0.045, 0.06]} rotation={[-0.25, -0.3, 0]} scale={1.3}><RBox s={[0.12, 0.05, 0.03]} r={0.006}>{M.wood({ base: [120, 80, 50] })}</RBox>
      {[1, 9, 7, 9].map((d, i) => <DigitDrum key={i} v={i < 2 ? d : d * eio(tt, 0.8, 3.0)} p={[-0.039 + i * 0.026, 0, 0.016]} r={0.018} w={0.022} />)}</group>
  </>; }}</Scene3D>;

// ---- 2:03 · LA SALPICADURA: la sartén de pollo frito; una gota de grasa sale en arco por el aire y aterriza en la alfombra trenzada de la entrada ----
export const HSplash: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[-0.3, 0.5, 0.2]}
  cam={{ at: [0.0, 0.05, 0.08], az: [-0.2, -0.08], el: [0.5, 0.44], r: [0.9, 0.8], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="1985 · BABY SHOWER" title="HOT GREASE ON THE RUG" col={RED} /><Tag tt={tt} at={2.2} x={1450} y={860} txt="MAMA'S WOOL COAT RUG" col={AMB} size={40} /></>}>{(tt) => {
  const u = cl((tt - 0.8) / 1.4), x = lerp(-0.28, 0.2, u), y = 0.12 + Math.sin(u * PI) * 0.22 - u * 0.1;
  return <>
    <group position={[-0.3, 0.06, 0]} rotation={[0, 0, -0.28 * Math.sin(PI * cl((tt - 0.4) / 1.4))]}><RBox s={[0.3, 0.06, 0.24]} p={[0, -0.03, 0]} r={0.01}><meshStandardMaterial color="#f2efe8" roughness={0.4} /></RBox>
      <Skillet p={[0, 0.0, 0]} s={0.75} />
      <mesh position={[0, 0.02, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.075, 40]} />{M.grease({ col: "#c99a3a", op: 0.85 })}</mesh>
      {[0, 1.2, 2.4].map((a, i) => <Drumstick key={i} p={[Math.cos(a) * 0.04, 0.025, Math.sin(a) * 0.04]} rot={[PI / 2, 0, a]} s={0.6} crisp={0.7} />)}
      {Array.from({ length: 10 }, (_, i) => { const b = ((tt * 2 + rn(i, 3)) % 1); return <mesh key={i} position={[(rn(i, 4) - 0.5) * 0.12, 0.025 + b * 0.015, (rn(i, 5) - 0.5) * 0.12]} scale={1 - b}><sphereGeometry args={[0.004, 8, 6]} />{M.grease({ col: "#f0d07a", op: 0.8 })}</mesh>; })}
    </group>
    {Array.from({ length: 6 }, (_, j) => { const uj = cl((tt - 0.8 - j * 0.07) / 1.3), xj = lerp(-0.28, 0.22 + j * 0.01, uj), yj = 0.12 + Math.sin(uj * PI) * 0.2 - uj * 0.1; return uj > 0 && uj < 1 && <mesh key={j} position={[xj, yj, 0.1 + j * 0.006]} scale={[1.3, 0.8, 0.8]}><sphereGeometry args={[0.02 - j * 0.002, 16, 12]} />{M.grease({ col: "#e8b84a" })}</mesh>; })}
    <BraidRug p={[0.25, 0, 0.12]} r={0.22} spot={eio(tt, 2.1, 2.6)} />
    <mesh position={[0.24, 0.032, 0.13]} rotation={[-PI / 2, 0, 0.4]} scale={[1.3, 0.9, 1]}><circleGeometry args={[0.12 * eio(tt, 2.0, 3.8) + 0.001, 40]} />{M.grease({ col: "#4a2e0a", op: 0.9 * eio(tt, 2.0, 2.4) })}</mesh>
    <RBox s={[0.02, 0.5, 0.4]} p={[0.5, 0.25, 0.1]} r={0.004}>{M.wood({ base: [130, 90, 56] })}</RBox>
  </>; }}</Scene3D>;

// ---- 2:20 · PALMEAR SUAVE: un montón de maicena sobre la mancha; la palma baja y lo aplana de a golpecitos, sin frotar ----
export const HPatPat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.1, 0.5, 0.3]}
  cam={{ at: [0.06, 0.04, 0.02], az: [0.25, 0.1], el: [0.42, 0.36], r: [0.56, 0.48], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="PAT IT DOWN GENTLY" col={AMB} /><Tag tt={tt} at={3.4} x={1450} y={860} txt="NOW LEAVE IT ALONE" col={GRN} size={42} /></>}>{(tt) => {
  const pats = Math.min(6, Math.floor((tt - 0.6) / 0.7)), ph = ((tt - 0.6) % 0.7) / 0.7, down = tt > 0.6 && tt < 4.8 ? Math.sin(ph * PI) : 0, flat = cl(pats / 6 + down * 0.08);
  return <>
    <group position={[0, -0.004 * Math.max(0, down - 0.8) * 5, 0]}><BraidRug r={0.3} spot={1} /></group>
    <Mound p={[0.09, 0.017, 0.03]} r={0.075 + 0.01 * flat} h={0.028 - 0.016 * flat} />
    <group position={[0.09, 0.05 + 0.1 * (1 - down) + (tt > 4.9 ? eio(tt, 4.9, 5.5) * 0.3 : 0), 0.03]} rotation={[0, 0.4, 0]}>
      <RBox s={[0.08, 0.018, 0.09]} r={0.009}><meshStandardMaterial color="#e7b89a" roughness={0.65} /></RBox>
      {[-0.027, -0.009, 0.009, 0.027].map((x, i) => <mesh key={i} position={[x, 0, 0.065]} rotation={[PI / 2, 0, 0]}><capsuleGeometry args={[0.008, 0.035, 6, 10]} /><meshStandardMaterial color="#e7b89a" roughness={0.65} /></mesh>)}
    </group>
    <Puff p={[0.09, 0.02, 0.03]} k={tt > 0.6 && tt < 4.8 && ph > 0.45 ? (ph - 0.45) / 0.55 : 0} r={0.12} />
  </>; }}</Scene3D>;

// ---- 2:31 · TODA LA NOCHE: luna que cruza la ventana y sale el sol; la maicena se va oscureciendo en el centro mientras chupa la grasa ----
export const HOvernight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood"
  cam={{ at: [0, 0.08, 0], az: [0.1, -0.05], el: [0.28, 0.22], r: [0.8, 0.68], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="GO TO BED" title="IT SOAKS ALL NIGHT" col={ICE} /><Tag tt={tt} at={4.6} x={1450} y={860} txt="DARKER = GREASE" col={AMB} size={42} /></>}>{(tt) => {
  const k = eio(tt, 0.5, 5.0), sky = new THREE.Color("#0c1630").lerp(new THREE.Color("#f2c88a"), eio(tt, 3.2, 5.2));
  return <>
    <BraidRug p={[0, 0, 0.1]} r={0.26} spot={1} cover={1} dark={k} />
    <group position={[0, 0.3, -0.25]}>
      <mesh><planeGeometry args={[0.4, 0.28]} /><meshBasicMaterial color={sky} /></mesh>
      <mesh position={[lerp(-0.12, 0.0, eio(tt, 0.5, 2.8)), lerp(0.09, -0.12, eio(tt, 0.5, 2.8)), 0.002]} scale={Math.max(0.001, 1 - eio(tt, 2.4, 2.8))}><circleGeometry args={[0.03, 32]} />{M.glow({ col: "#f4f0dc", op: 1 })}</mesh>
      <mesh position={[lerp(0.02, 0.12, eio(tt, 2.8, 5.0)), lerp(-0.12, 0.08, eio(tt, 2.8, 5.0)), 0.003]} scale={Math.max(0.001, eio(tt, 2.8, 3.2))}><circleGeometry args={[0.035, 32]} />{M.glow({ col: "#ffcf4a", op: 1 })}</mesh>
      {[-1, 1].map((s) => <RBox key={s} s={[0.02, 0.32, 0.03]} p={[s * 0.21, 0, 0.01]} r={0.003}><meshStandardMaterial color="#f4efe4" /></RBox>)}
      {[-1, 1].map((s) => <RBox key={s} s={[0.44, 0.02, 0.03]} p={[0, s * 0.15, 0.01]} r={0.003}><meshStandardMaterial color="#f4efe4" /></RBox>)}
      <RBox s={[0.42, 0.012, 0.02]} p={[0, 0, 0.01]} r={0.002}><meshStandardMaterial color="#f4efe4" /></RBox>
    </group>
    <pointLight position={[0, 0.4, 0.1]} color={sky} intensity={0.6 + 1.2 * eio(tt, 3.2, 5.2)} distance={1.4} />
    <directionalLight position={[0.3, 0.2, -1]} intensity={1.3 * eio(tt, 3.2, 5.2)} color="#ffb060" />
  </>; }}</Scene3D>;

// ---- 2:51 · NO FROTES: corte de las fibras de la alfombra; frotando, la grasa baja y se abre; con polvo y espera, sube y queda en el polvo ----
export const HNoRub: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.5, 0.4]}
  cam={{ at: [0, 0.12, 0], az: [0, 0.05], el: [0.18, 0.14], r: [0.68, 0.6], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="DON'T RUB IT" col={RED} /><Tag tt={tt} at={0.6} x={560} y={230} txt="RUBBED" col={RED} size={40} />
    <Tag tt={tt} at={1.4} x={1360} y={230} txt="PATTED" col={GRN} size={40} /></>}>{(tt) => { const k = eio(tt, 0.8, 4.5);
  return <>{[-1, 1].map((s) => { const bad = s < 0;
    return <group key={s} position={[s * 0.17, 0, 0]} scale={2}>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.055 + i * 0.01, 0.04, 0]} rotation={[0, 0, Math.sin(i * 1.7) * 0.08 + (bad ? Math.sin(tt * 8) * 0.1 * cl(tt - 0.8) * (1 - cl(tt - 4)) : 0)]}>
        <cylinderGeometry args={[0.0035, 0.004, 0.08, 8]} /><meshStandardMaterial color={["#6a3b26", "#2c3d5c", "#8c2e26"][i % 3]} roughness={0.95} /></mesh>)}
      <RBox s={[0.13, 0.008, 0.03]} p={[0, -0.002, 0]} r={0.002}><meshStandardMaterial color="#3a2a1c" /></RBox>
      {Array.from({ length: 14 }, (_, i) => { const x0 = (rn(i, 2) - 0.5) * 0.03, y0 = 0.075;
        const x = bad ? x0 * (1 + 3 * k) : x0 * (1 - 0.3 * k), y = bad ? y0 - 0.06 * k * rn(i, 3) : y0 + 0.018 * k;
        return <mesh key={i} position={[x, y, 0.006]}><sphereGeometry args={[0.007, 12, 10]} />{M.grease({ col: "#3a2610" })}</mesh>; })}
      {!bad && <Mound p={[0, 0.08, 0]} r={0.045} h={0.018} col={new THREE.Color("#fbfaf6").lerp(new THREE.Color("#c4b69c"), k).getStyle()} />}
      {bad && <group position={[0.02 + Math.sin(tt * 8) * 0.03, 0.11, 0.01]}><RBox s={[0.05, 0.02, 0.03]} r={0.008}><meshStandardMaterial color="#f4f4f4" roughness={0.9} /></RBox></group>}
    </group>; })}</>; }}</Scene3D>;

// ---- 3:04 · ANDA EN CUATRO LUGARES: un almohadón, un asiento de auto, un mantel y una alfombra caen en fila, cada uno con su montoncito blanco ----
export const HFourPlaces: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" lamp={[0, 0.5, 0.4]}
  cam={{ at: [0.02, 0.03, 0.02], az: [-0.08, 0.08], el: [0.42, 0.36], r: [1.08, 0.98], fov: 30 }}
  over={(tt) => { const L = ["CUSHION", "CAR SEAT", "TABLECLOTH", "CARPET"];
    return <><Head tt={tt} kick="" title="IT WORKS ON ALL FOUR" col={AMB} />{L.map((s, i) => <Tag key={i} tt={tt} at={0.6 + i * 0.9} x={330 + i * 420} y={i % 2 ? 300 : 205} txt={s} col={GRN} size={32} />)}</>; }}>{(tt) => <>
  {["#7a6a9a", "#3a3a3e", "#f4f0e6", "#8a4a32"].map((col, i) => { const a = 0.5 + i * 0.9, k = phys(tt, a, 7, 0.45); if (tt < a - 0.05) return null;
    return <group key={i} position={[-0.33 + i * 0.22, (1 - cl(k)) * 0.35, 0]}>
      {i === 0 && <RBox s={[0.17, 0.05, 0.17]} p={[0, 0.025, 0]} r={0.02}><meshStandardMaterial color={col} roughness={0.95} bumpMap={tex.paper(3, 3)} bumpScale={3} /></RBox>}
      {i === 1 && <><RBox s={[0.17, 0.04, 0.17]} p={[0, 0.02, 0]} r={0.02}><meshStandardMaterial color={col} roughness={0.9} /></RBox>
        <RBox s={[0.17, 0.16, 0.04]} p={[0, 0.1, -0.07]} rot={[-0.2, 0, 0]} r={0.02}><meshStandardMaterial color={col} roughness={0.9} /></RBox></>}
      {i === 2 && <RBox s={[0.18, 0.006, 0.18]} p={[0, 0.003, 0]} r={0.002}><meshStandardMaterial map={tex.text("gingham", 128, 128, (g) => { g.fillStyle = "#f4f0e6"; g.fillRect(0, 0, 128, 128); g.fillStyle = "rgba(190,40,40,.5)"; for (let j = 0; j < 8; j++) { g.fillRect(j * 16, 0, 8, 128); g.fillRect(0, j * 16, 128, 8); } })} roughness={0.9} /></RBox>}
      {i === 3 && <RBox s={[0.18, 0.012, 0.18]} p={[0, 0.006, 0]} r={0.003}><meshStandardMaterial color={col} roughness={1} bumpMap={tex.paper(6, 6)} bumpScale={6} /></RBox>}
      <Mound p={[0.01, i === 0 ? 0.05 : i === 1 ? 0.04 : i === 2 ? 0.006 : 0.012, 0.02]} r={0.035} h={0.014} />
    </group>; })}
</>}</Scene3D>;

// ---- 3:21 · CUARENTA Y UN AÑOS: la alfombra sigue frente a la puerta; el contador sube hasta 41 y al lado aparece un sonajero de bebé que se vuelve una corbata ----
export const HRug41: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.1, -0.02], az: [0.2, 0.05], el: [0.34, 0.28], r: [0.9, 0.78], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="SAME RUG, SAME DOOR" title="41 YEARS LATER" col={AMB} /><Tag tt={tt} at={2.8} x={470} y={860} txt="THAT BABY IS 40" col={GRN} size={42} /></>}>{(tt, u) => { const n = 41 * eio(u, 0.3, 0.8), ro = eio(u, 0.04, 0.5);
  return <>
    <group rotation={[0, (1 - ro) * 4, 0]} position={[0, 0, 0.08]}><BraidRug r={0.24 * Math.max(0.05, ro)} /></group>
    <RBox s={[0.3, 0.55, 0.03]} p={[0, 0.275, -0.2]} r={0.006}>{M.wood({ base: [120, 74, 44] })}</RBox>
    <mesh position={[0.11, 0.27, -0.18]}><sphereGeometry args={[0.012, 16, 12]} />{M.brass({})}</mesh>
    <group position={[0.15, 0.15, 0.18]} rotation={[-0.15, -0.25, 0]} scale={2.0}><RBox s={[0.1, 0.07, 0.04]} r={0.008}>{M.wood({ base: [120, 80, 50] })}</RBox>
      <DigitDrum v={Math.floor(n / 10)} p={[-0.02, 0, 0.021]} r={0.024} w={0.032} /><DigitDrum v={n % 10} p={[0.02, 0, 0.021]} r={0.024} w={0.032} /></group>
  </>; }}</Scene3D>;

// ---- 3:38 · LA PLATA DE LOS HUEVOS: una canasta de huevos; los huevos se vuelven monedas que caen en un frasco escondido, y del frasco sale la cadenita de oro de 1931 ----
export const HEggMoney: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.07, 0], az: [-0.2, 0.15], el: [0.3, 0.24], r: [0.52, 0.44], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="1931" title="BOUGHT WITH EGG MONEY" col={AMB} /><Tag tt={tt} at={4.2} x={1450} y={860} txt="HER ONLY REAL GOLD" col={GRN} size={40} /></>}>{(tt) => { const fill = eio(tt, 0.8, 3.6), gold = eio(tt, 3.8, 4.8);
  return <>
    <group position={[-0.17, 0, 0]}>
      <mesh geometry={undefined} position={[0, 0.03, 0]}><cylinderGeometry args={[0.1, 0.075, 0.06, 32, 1, true]} /><meshStandardMaterial color="#a8824a" roughness={0.9} side={THREE.DoubleSide} bumpMap={tex.paper(8, 2)} bumpScale={8} /></mesh>
      {Array.from({ length: 6 }, (_, i) => { const gone = cl(fill * 6 - i); return gone >= 1 ? null : <Egg key={i} p={[Math.cos(i) * 0.045, 0.06 + 0.02 * gone, Math.sin(i) * 0.045]} s={0.9 * (1 - gone)} brown />; })}
    </group>
    {Array.from({ length: 6 }, (_, i) => { const u = cl(fill * 6 - i); if (u <= 0 || u >= 1) return null;
      return <group key={i}><Coin copper={false} p={[lerp(-0.17, 0.12, u), 0.08 + Math.sin(u * PI) * 0.1, 0]} rot={[u * 6, 0, 0]} s={2.6} /><mesh position={[lerp(-0.17, 0.12, u), 0.08 + Math.sin(u * PI) * 0.1, 0.01]}><sphereGeometry args={[0.018, 12, 10]} />{M.glow({ col: "#ffe08a", op: 0.9 * Math.sin(u * PI) })}</mesh></group>; })}
    <group position={[0.12, 0, 0]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.045, 0.045, 0.12, 40, 1, true]} />{M.glass({ op: 0.1, side: THREE.DoubleSide })}</mesh>
      {Array.from({ length: Math.floor(fill * 12) }, (_, i) => <Coin key={i} copper={false} p={[(rn(i, 3) - 0.5) * 0.04, 0.003 + i * 0.0035, (rn(i, 4) - 0.5) * 0.04]} rot={[0, rn(i, 5) * 3, 0]} />)}
      <mesh position={[0, 0.13 + 0.06 * gold, 0]} rotation={[PI / 2, 0, tt]} scale={gold}><torusGeometry args={[0.035, 0.0015, 8, 64]} />{M.brass({ col: "#e6bd4a" })}</mesh>
      <group position={[0, 0.15, 0.05]} scale={Math.max(0.001, 2.6 * gold)}><RBox s={[0.004, 0.022, 0.002]} r={0.001}>{M.brass({ col: "#e6bd4a" })}</RBox><RBox s={[0.014, 0.004, 0.002]} p={[0, 0.004, 0]} r={0.001}>{M.brass({ col: "#e6bd4a" })}</RBox></group>
    </group>
  </>; }}</Scene3D>;
