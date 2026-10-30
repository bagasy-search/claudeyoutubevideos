// lhh29e · componentes únicos 11-20: los eslabones resbalosos, del medio hacia afuera, el maizal de 51 años, la receta del rociador,
// las eses en el vidrio, la maicena que se asienta, la salsa para 200, los grumos, la mezcla como leche y una cucharada por taza.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn, tubeG } from "./h3d";
import { Bowl, card, lg } from "./saltkit";
import { Chain, CornBox, Mound, Pot, Puff, Sprayer, powderMat } from "./cornkit";

const PI = Math.PI;

// ---- 4:14 · ESLABONES RESBALOSOS: dos eslabones gigantes enganchados; sin polvo se traban y chispean; con maicena el polvo los cubre y se deslizan uno sobre otro ----
export const HSlipperyLinks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" bg="#15110c"
  cam={{ at: [0, 0.05, 0], az: [-0.3, 0.3], el: [0.2, 0.16], r: [0.42, 0.36], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="THE LINKS GET SLIPPERY" col={AMB} /><Tag tt={tt} at={0.6} x={480} y={880} txt="CATCH" col={RED} size={44} />
    <Tag tt={tt} at={3.2} x={1450} y={880} txt="SLIDE PAST" col={GRN} size={44} /></>}>{(tt) => { const dust = eio(tt, 2.0, 3.0), slide = tt > 3.0 ? (tt - 3.0) * 1.6 : 0, jam = tt < 2.0 ? Math.sin(tt * 30) * 0.02 * cl(tt - 0.4) : 0;
  const goldM = <meshStandardMaterial color={new THREE.Color("#e6bd4a").lerp(new THREE.Color("#f4f0e4"), dust * 0.5)} metalness={1 - dust * 0.5} roughness={0.25 + dust * 0.5} />;
  return <>
    <mesh position={[-0.035, 0.06, 0]} rotation={[0, 0, jam]}><torusGeometry args={[0.05, 0.012, 24, 64]} />{goldM}</mesh>
    <group position={[0.035, 0.06, 0]} rotation={[PI / 2, slide, 0]}><mesh rotation={[0, 0, -jam]}><torusGeometry args={[0.05, 0.012, 24, 64]} />{goldM}</mesh></group>
    {tt < 2.0 && Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0.012 + (rn(i + Math.floor(tt * 10), 2) - 0.5) * 0.02, 0.06 + (rn(i + Math.floor(tt * 10), 3) - 0.5) * 0.02, 0.012]}><sphereGeometry args={[0.0018, 6, 5]} />{M.glow({ col: "#fff2a0", op: cl(tt - 0.4) })}</mesh>)}
    {Array.from({ length: 40 }, (_, i) => { const u = cl((tt - 1.8 - rn(i, 2) * 0.8) / 0.8); if (u <= 0) return null;
      return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.12, lerp(0.2, 0.06 + (rn(i, 4) - 0.5) * 0.06, u), (rn(i, 5) - 0.5) * 0.04]}><sphereGeometry args={[0.0025, 6, 5]} />{powderMat("#ffffff", 0.9)}</mesh>; })}
    <pointLight position={[0.1, 0.2, 0.2]} color="#ffe2a0" intensity={1.2} distance={0.6} />
  </>; }}</Scene3D>;

// ---- 4:43 · DEL MEDIO HACIA AFUERA: el nudo visto de arriba; tirar de las puntas lo aprieta (rojo); los dos alfileres abren desde el centro y el nudo se afloja ----
export const HMiddleOut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#3a3026"
  cam={{ at: [0, 0.02, 0.01], az: [0.1, -0.05], el: [0.62, 0.55], r: [0.36, 0.3], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="WORK FROM THE MIDDLE" col={GRN} /><Tag tt={tt} at={0.6} x={480} y={880} txt="PULL ENDS = TIGHTER" col={RED} size={36} />
    <Tag tt={tt} at={2.6} x={1400} y={880} txt="PINS PULL APART" col={GRN} size={36} /></>}>{(tt) => { const tight = eio(tt, 0.4, 1.8) * (1 - eio(tt, 2.4, 3.0)), open = eio(tt, 2.6, 4.6);
  const r = 0.018 * (1 - 0.5 * tight) + 0.03 * open;
  const loop = Array.from({ length: 9 }, (_, i) => { const a = i / 8 * PI * 2.6; return [Math.cos(a) * r * (1 + 0.3 * Math.sin(a * 2)), 0.002 * Math.sin(a * 3), Math.sin(a) * r]; });
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, -0.002, 0]}><planeGeometry args={[0.6, 0.4]} /><meshStandardMaterial color="#c9a46a" roughness={1} bumpMap={tex.paper(6, 6)} bumpScale={8} /></mesh>
    <Chain pts={[[-0.22 + 0.04 * tight, 0, 0.03], [-0.08, 0, 0.01], ...loop, [0.08, 0, -0.01], [0.22 - 0.04 * tight, 0, -0.03]]} n={70} r={0.01} />
    {[-1, 1].map((s) => <group key={s} position={[s * (0.004 + r * 0.9), 0.012, 0]} rotation={[0, 0, s * 0.3]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.0016, 0.0005, 0.06, 8]} />{M.steel({})}</mesh>
      <mesh position={[0, 0.062, 0]}><sphereGeometry args={[0.007, 16, 12]} /><meshPhysicalMaterial color={s > 0 ? "#c8322a" : "#2a62b8"} roughness={0.3} clearcoat={1} /></mesh></group>)}
      </>; }}</Scene3D>;

// ---- 5:04 · CINCUENTA Y UN AÑOS DE MAÍZ: por la ventana de la cocina, filas de maíz que crecen y se cosechan en ciclo; el contador de años gira hasta 51 ----
export const HCorn51: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#cfe0ec"
  cam={{ at: [-0.05, 0.1, 0.2], az: [0.1, 0.18], el: [0.16, 0.12], r: [0.62, 0.54], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="OUT MY WINDOW" title="HAROLD'S CORN · 51 YEARS" col={AMB} /></>}>{(tt) => { const y = 51 * eio(tt, 0.3, 4.2), g = (y % 1);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#6a4a2a" roughness={1} /></mesh>
    {Array.from({ length: 5 }, (_, row) => Array.from({ length: 12 }, (_, i) => { const hgt = 0.02 + 0.13 * Math.sin(g * PI);
      return <group key={row + "-" + i} position={[-0.5 + i * 0.09, 0, -0.1 - row * 0.12]}>
        <mesh position={[0, hgt / 2, 0]}><cylinderGeometry args={[0.003, 0.004, hgt, 6]} /><meshStandardMaterial color={g > 0.6 ? "#c8a85a" : "#4a8a3a"} roughness={0.8} /></mesh>
        <mesh position={[0, hgt * 0.7, 0]} rotation={[0, i, 0.8]}><planeGeometry args={[0.05 * (hgt / 0.15), 0.008]} /><meshStandardMaterial color={g > 0.6 ? "#d4b46a" : "#5a9a44"} side={THREE.DoubleSide} /></mesh>
      </group>; }))}
    {/* la mazorca grande en primer plano: las chalas se abren y los granos se vuelven polvo blanco */}
    <group position={[-0.04, 0.0, 0.2]} rotation={[0, 0.3, 0.1]}>
      <mesh position={[0, 0.11, 0]} scale={[1, 1, 1]}><capsuleGeometry args={[0.03, 0.15, 8, 24]} /><meshStandardMaterial color="#e8c04a" roughness={0.55} /></mesh>
      {Array.from({ length: 12 }, (_, ring) => Array.from({ length: 12 }, (_, j) => { const a = j / 12 * PI * 2 + ring * 0.26, gone = cl((eio(tt, 2.6, 4.4) * 14 - ring - rn(ring * 12 + j, 3) * 2));
        return <mesh key={ring + "-" + j} position={[Math.cos(a) * 0.031, 0.05 + ring * 0.011, Math.sin(a) * 0.031]} scale={1 - 0.3 * gone}><sphereGeometry args={[0.0075, 10, 8]} /><meshPhysicalMaterial color="#f2c43a" roughness={0.35} clearcoat={0.6} /></mesh>; }))}
      {[0, 1, 2].map((i) => { const op = eio(tt, 0.6 + i * 0.3, 2.2 + i * 0.3); return <mesh key={i} position={[0, 0.03, 0]} rotation={[0, i * 2.1, 0]}>
        <group rotation={[op * 0.9, 0, 0]}><mesh position={[0, 0.09, 0.034]} scale={[1, 1, 0.3]}><sphereGeometry args={[0.035, 16, 12, 0, PI, 0, PI]} /><meshStandardMaterial color="#7a9a4a" roughness={0.8} side={THREE.DoubleSide} /></mesh></group></mesh>; })}
    </group>
    <Mound p={[0.0, 0, 0.22]} r={0.07 * eio(tt, 2.8, 4.8) + 0.001} h={0.03 * eio(tt, 2.8, 4.8) + 0.001} />
    {Array.from({ length: 30 }, (_, i) => { const st = 2.7 + rn(i, 5) * 1.8, u = cl((tt - st) / 0.6); if (u <= 0 || u >= 1) return null;
      return <mesh key={i} position={[-0.02 + (rn(i, 6) - 0.5) * 0.04, lerp(0.14, 0.01, u), 0.22 + (rn(i, 7) - 0.5) * 0.04]}><sphereGeometry args={[0.0035, 6, 5]} />{powderMat()}</mesh>; })}
    <group position={[0.12, 0.07, 0.24]} rotation={[-0.15, -0.3, 0]} scale={1.6}><RBox s={[0.1, 0.07, 0.04]} r={0.008}>{M.wood({ base: [120, 80, 50] })}</RBox>
      <DigitDrum v={Math.floor(y / 10)} p={[-0.02, 0, 0.021]} r={0.024} w={0.032} /><DigitDrum v={y % 10} p={[0.02, 0, 0.021]} r={0.024} w={0.032} /></group>
    <group position={[0, 0.14, 0.26]}>
      {[-1, 1].map((s) => <RBox key={s} s={[0.03, 0.4, 0.03]} p={[s * 0.32, 0, 0]} r={0.004}><meshStandardMaterial color="#f4efe4" /></RBox>)}
      <RBox s={[0.67, 0.03, 0.03]} p={[0, 0.2, 0]} r={0.004}><meshStandardMaterial color="#f4efe4" /></RBox>
      <RBox s={[0.67, 0.03, 0.08]} p={[0, -0.19, 0.02]} r={0.004}><meshStandardMaterial color="#f4efe4" /></RBox>
      <group position={[0.22, -0.13, 0.065]}><RBox s={[0.09, 0.06, 0.03]} r={0.008}>{M.wood({ base: [120, 80, 50] })}</RBox>
        <DigitDrum v={Math.floor(y / 10)} p={[-0.017, 0, 0.016]} r={0.02} w={0.028} /><DigitDrum v={y % 10} p={[0.017, 0, 0.016]} r={0.02} w={0.028} /></group>
    </group>
  </>; }}</Scene3D>;

// ---- 5:21 · LA RECETA DEL ROCIADOR: un embudo sobre el rociador; entran por turno el agua tibia, la cucharada de maicena y el cuarto de taza de vinagre, cada uno con su capa ----
export const HSprayRecipe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.25, 0], az: [0.3, 0.1], el: [0.2, 0.16], r: [0.76, 0.68], fov: 30 }}
  over={(tt) => { const L = ["1 QUART WARM WATER", "1 TBSP CORNSTARCH", "¼ CUP WHITE VINEGAR"], i = Math.min(2, Math.max(0, Math.floor((tt - 0.4) / 1.8)));
    return <><Head tt={tt} kick="BERNICE'S SPRAY" title="SHAKE IT HARD" col={ICE} /><Tag key={i} tt={tt - i * 1.8} at={0.4} x={1400} y={850} txt={L[i]} col={AMB} size={52} /></>; }}>{(tt) => {
  const w = eio(tt, 0.4, 1.8), c = eio(tt, 2.2, 3.4), v = eio(tt, 4.0, 5.2), sh = tt > 5.4 ? Math.sin(tt * 26) * 0.12 : 0;
  return <>
    <group rotation={[0, 0, sh]} position={[0, 0, 0]}><Sprayer s={1.3} fill={0.15 + 0.55 * w + 0.15 * v} cloud={c} /></group>
    <mesh position={[0, 0.34, 0]} rotation={[PI, 0, 0]} scale={1 - eio(tt, 5.2, 5.4)}><coneGeometry args={[0.05, 0.07, 32, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
    {w > 0 && w < 1 && <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.006, 0.006, 0.12, 10]} />{M.water({ col: "#bfe2f2", op: 0.7 })}</mesh>}
    {c > 0 && c < 1 && Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.01, 0.38 - ((tt * 1.4 + rn(i, 3)) % 1) * 0.05, 0]}><sphereGeometry args={[0.0035, 6, 5]} />{powderMat()}</mesh>)}
    {v > 0 && v < 1 && <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.005, 0.005, 0.12, 10]} />{M.water({ col: "#f4f0d8", op: 0.6 })}</mesh>}
    <group position={[0.06, 0.375, 0]} rotation={[0, 0, 1.3 * Math.sin(PI * c)]} scale={Math.max(0.001, 1.5 * cl(tt - 1.6) * (1 - eio(tt, 3.6, 3.9)))}>
      <mesh position={[0, 0, 0]} scale={[1.3, 0.45, 1]}><sphereGeometry args={[0.022, 24, 12, 0, PI * 2, PI / 2, PI / 2]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0.075, 0.004, 0]} rotation={[0, 0, PI / 2 - 0.12]}><cylinderGeometry args={[0.004, 0.005, 0.11, 10]} />{M.steel({})}</mesh>
      <mesh position={[0, 0.002, 0]} scale={[1, 0.6 * (1 - c) + 0.001, 1]}><sphereGeometry args={[0.02, 16, 10, 0, PI * 2, 0, PI / 2]} />{powderMat()}</mesh></group>
    <group position={[-0.16, 0.25, 0.04]} rotation={[0, 0.3, 0]} scale={2.0}><RBox s={[0.09, 0.06, 0.03]} r={0.008}>{M.wood({ base: [120, 80, 50] })}</RBox>
      <DigitDrum v={c} p={[-0.018, 0, 0.016]} r={0.022} w={0.03} />
      <mesh position={[0.024, 0, 0.0165]}><planeGeometry args={[0.034, 0.03]} /><meshStandardMaterial map={tex.text("tbspl", 128, 112, (g) => { g.fillStyle = "#f1ead9"; g.fillRect(0, 0, 128, 112); g.fillStyle = "#2a1e12"; g.font = "bold 40px Georgia"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("TBSP", 64, 58); })} /></mesh></group>
    <CornBox p={[-0.2, 0, -0.05]} rot={[0, 0.4, 0]} s={0.9} lid={0.6} />
    <group position={[0.2, 0, -0.04]}><mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.03, 0.035, 0.16, 32]} />{M.glass({ col: "#f4f0e0", op: 0.5 })}</mesh>
      <mesh position={[0, 0.07, 0.035]}><planeGeometry args={[0.05, 0.06]} /><meshStandardMaterial map={card("vin", 128, 150, ["WHITE", "VINEGAR"], 30, "#2a1e12", "#f4ead2")} /></mesh></group>
  </>; }}</Scene3D>;

// ---- 5:36 · EN ESES GRANDES: el vidrio de la ventana con película gris; el trapo baja dibujando una S enorme y deja un camino brillante ----
export const HSSwipe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#8fb3cf"
  cam={{ at: [0, 0.2, 0], az: [-0.12, 0.08], el: [0.05, 0.03], r: [0.9, 0.8], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="BIG S SHAPES" col={ICE} /><Tag tt={tt} at={3.6} x={1450} y={860} txt="TOP TO BOTTOM" col={GRN} size={42} /></>}>{(tt) => {
  const k = eio(tt, 0.4, 4.2), N = 40, path = Array.from({ length: N + 1 }, (_, i) => { const u = i / N; return [Math.sin(u * PI * 3) * 0.13, 0.36 - u * 0.32, 0.003]; }), upto = Math.max(2, Math.floor(k * N));
  const cur = path[Math.min(N, upto)];
  return <>
    <mesh position={[0, 0.2, -0.3]}><planeGeometry args={[1.6, 1]} /><meshBasicMaterial map={tex.text("fieldsky", 256, 128, (g) => { const gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, "#9cc4e4"); gr.addColorStop(0.6, "#f2dca0"); gr.addColorStop(0.62, "#c8a85a"); gr.addColorStop(1, "#8a6a3a"); g.fillStyle = gr; g.fillRect(0, 0, 256, 128); })} /></mesh>
    <mesh position={[0, 0.2, 0]}><planeGeometry args={[0.36, 0.4]} /><meshStandardMaterial color="#d4d8d8" transparent opacity={0.9 * (1 - eio(tt, 4.2, 5.2))} roughness={1} bumpMap={tex.paper(4, 4)} bumpScale={4} /></mesh>
    <mesh geometry={tubeG("swipe" + upto, path.slice(0, upto + 1), 0.03, 80, 8)} scale={[1, 1, 0.05]}><meshBasicMaterial color="#a9cde8" toneMapped={false} transparent opacity={1 - eio(tt, 4.2, 5.2)} /></mesh>
    <group position={[cur[0] + 0.35 * eio(tt, 4.3, 5.0), Math.max(0.07, cur[1]), 0.015]} rotation={[0, 0, Math.sin(tt * 3) * 0.2]}><RBox s={[0.085, 0.06, 0.03]} r={0.012}><meshStandardMaterial color="#e8c84a" roughness={1} bumpMap={tex.paper(3, 3)} bumpScale={8} /></RBox><RBox s={[0.085, 0.06, 0.01]} p={[0, 0, -0.02]} r={0.004}><meshStandardMaterial color="#3a7a3a" roughness={1} /></RBox></group>
    {[-1, 1].map((s) => <RBox key={s} s={[0.025, 0.46, 0.03]} p={[s * 0.19, 0.2, 0.01]} r={0.004}><meshStandardMaterial color="#f4efe4" /></RBox>)}
    {[-1, 1].map((s) => <RBox key={s} s={[0.4, 0.025, 0.03]} p={[0, 0.2 + s * 0.21, 0.01]} r={0.004}><meshStandardMaterial color="#f4efe4" /></RBox>)}
  </>; }}</Scene3D>;

// ---- 5:52 · SE ASIENTA EN UN MINUTO: el rociador turbio se aclara arriba y el polvo cae al fondo como nieve; una sacudida y vuelve a nublarse ----
export const HSettle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0.03, 0.14, 0], az: [-0.2, 0.15], el: [0.12, 0.1], r: [0.72, 0.62], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="IT SETTLES FAST" title="SHAKE EVERY TIME" col={AMB} /><Tag tt={tt} at={0.6} x={1450} y={860} txt="1 MINUTE" col={RED} size={42} /></>}>{(tt) => {
  const settle = eio(tt, 0.4, 3.2) * (1 - eio(tt, 3.6, 4.0)), sh = tt > 3.6 && tt < 4.6 ? Math.sin(tt * 30) * 0.15 : 0;
  return <>
    <group rotation={[0, 0, sh]}><Sprayer s={1.4} fill={0.8} cloud={1 - settle} sed={0} />
      <mesh position={[0, 0.014 * settle, 0]}><cylinderGeometry args={[0.0545, 0.0545, 0.028 * settle + 0.0001, 40]} />{powderMat()}</mesh>
      <mesh position={[0, 0.028 * settle + 0.022, 0]}><cylinderGeometry args={[0.0542, 0.0542, 0.044, 40]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.6 * settle} roughness={0.6} depthWrite={false} /></mesh></group>
    {Array.from({ length: 30 }, (_, i) => { const y0 = 0.02 + rn(i, 2) * 0.15; return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.08, lerp(y0, 0.012, settle) * 1.4, (rn(i, 4) - 0.5) * 0.08]}><sphereGeometry args={[0.0022, 6, 5]} />{powderMat("#ffffff", 0.9)}</mesh>; })}
    <group position={[0.12, 0.11, 0.1]} rotation={[0.1, -0.3, 0]} scale={1.15}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.012, 40]} />{M.chrome({})}</mesh>
      <mesh position={[0, 0, 0.0065]}><circleGeometry args={[0.035, 40]} /><meshStandardMaterial color="#fbfaf6" /></mesh>
      <mesh position={[0, 0, 0.007]} rotation={[0, 0, -settle * PI * 2]}><group><mesh position={[0, 0.014, 0]}><boxGeometry args={[0.002, 0.028, 0.001]} /><meshBasicMaterial color="#b8322a" /></mesh></group></mesh></group>
  </>; }}</Scene3D>;

// ---- 6:22 · SALSA PARA DOSCIENTOS: largas mesas de iglesia vistas de arriba; los platos aparecen en filas, cada uno con su charquito de salsa, y el contador llega a 200 ----
export const HGravy200: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#2a2420"
  cam={{ at: [-0.2, 0.07, 0.24], az: [-0.35, -0.2], el: [0.32, 0.27], r: [1.05, 0.94], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="EVERY FUNERAL DINNER" title="GRAVY FOR 200" col={AMB} /></>}>{(tt) => { const n = 200 * eio(tt, 0.3, 4.4);
  return <>
    {Array.from({ length: 4 }, (_, r) => <RBox key={r} s={[1.2, 0.02, 0.16]} p={[0, 0.03, -0.36 + r * 0.24]} r={0.004}>{M.wood({ base: [120, 78, 46] })}</RBox>)}
    {Array.from({ length: 50 }, (_, i) => { const r = Math.floor(i / 12.5), c = i % 13, k = cl(n / 4 - i); if (k <= 0 || r > 3) return null;
      return <group key={i} position={[-0.54 + c * 0.09, 0.041, -0.36 + r * 0.24]} scale={cl(k * 2)}>
        <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.035, 32]} />{M.porcelain({})}</mesh>
        <mesh position={[0.008, 0.002, 0.004]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.015, 24]} /><meshPhysicalMaterial color="#6a3a18" roughness={0.2} clearcoat={0.8} /></mesh>
        <mesh position={[-0.01, 0.005, -0.006]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.012, 12, 8]} /><meshStandardMaterial color="#f6eedc" roughness={0.9} /></mesh>
        {k < 0.6 && <mesh position={[0.008, 0.004 + 0.16 * (1 - cl(k / 0.6)) ** 2, 0.004]} scale={[1, 1.3, 1]}><sphereGeometry args={[0.009, 12, 8]} /><meshPhysicalMaterial color="#6a3a18" roughness={0.2} clearcoat={0.8} /></mesh>}</group>; })}
    <group position={[-0.42, 0.0, 0.45]}>
      <mesh geometry={lg("gpot", [[0, 0], [0.11, 0], [0.115, 0.01], [0.115, 0.12], [0.12, 0.125], [0.11, 0.125], [0.105, 0.01]], 48)} castShadow>{M.steel({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.105, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.106, 48]} /><meshPhysicalMaterial color="#7a4418" roughness={0.25} clearcoat={0.9} /></mesh>
      <group position={[0.03 * Math.cos(tt * 1.6), 0.105 + 0.05 * Math.max(0, Math.sin(tt * 1.6)), 0.03 * Math.sin(tt * 1.6)]} rotation={[0, -tt * 1.6, 0.9]}>
        <mesh position={[0, -0.01, 0]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.03, 24, 12, 0, PI * 2, PI / 2, PI / 2]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
        <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.004, 0.004, 0.2, 10]} />{M.steel({})}</mesh></group>
    </group>
    <group position={[0.0, 0.12, 0.42]} rotation={[-0.3, -0.35, 0]} scale={1.8}><RBox s={[0.14, 0.07, 0.03]} r={0.008}>{M.wood({ base: [120, 80, 50] })}</RBox>
      {[0, 1, 2].map((d) => <DigitDrum key={d} v={d === 0 ? Math.floor(n / 100) : d === 1 ? Math.floor(n / 10) % 10 + 0 : n % 10} p={[-0.034 + d * 0.034, 0, 0.016]} r={0.024} w={0.03} />)}</group>
  </>; }}</Scene3D>;

// ---- 6:38 · GRUMOS AL INSTANTE: el polvo seco cae en la salsa caliente y cada nubecita se vuelve una bolita blanca que flota; no se deshacen más ----
export const HLumps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" bg="#140f0b"
  cam={{ at: [0, 0.06, 0], az: [0.2, -0.1], el: [0.6, 0.5], r: [0.42, 0.36], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="NEVER EVER" title="DRY POWDER IN HOT" col={RED} /><Tag tt={tt} at={3.4} x={1450} y={860} txt="LUMPS FOREVER" col={RED} size={44} /></>}>{(tt) => <>
  <Pot level={0.75} thick={0.2}>
    {Array.from({ length: 22 }, (_, i) => { const a = 0.4 + rn(i, 2) * 1.6, u = cl((tt - a) / 0.5), lump = cl((tt - a - 0.5) / 0.6); if (u <= 0) return null;
      const x = (rn(i, 3) - 0.5) * 0.12, z = (rn(i, 4) - 0.5) * 0.12;
      return <group key={i}>
        {u < 1 && <mesh position={[x, lerp(0.25, 0.066, u), z]}><sphereGeometry args={[0.004, 6, 5]} />{powderMat()}</mesh>}
        <mesh position={[x + Math.sin(tt + i) * 0.004, 0.066, z]} scale={[1, 0.7, 1]}><sphereGeometry args={[0.004 + 0.006 * lump, 12, 10]} /><meshStandardMaterial color="#f4ede0" roughness={0.9} bumpMap={tex.paper(1, 1)} bumpScale={5} /></mesh>
      </group>; })}
    {Array.from({ length: 6 }, (_, i) => { const b = (tt * 0.9 + i / 6) % 1; return <mesh key={i} position={[(rn(i, 6) - 0.5) * 0.1, 0.07 + b * 0.12, (rn(i, 7) - 0.5) * 0.1]} scale={1 + b}><sphereGeometry args={[0.01, 10, 8]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.15 * (1 - b)} depthWrite={false} /></mesh>; })}
  </Pot>
  <mesh position={[0, -0.01, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.08, 32]} />{M.glow({ col: "#ff5a2a", op: 0.5 })}</mesh>
  <pointLight position={[0, 0.02, 0]} color="#ff6a2a" intensity={1.2} distance={0.4} />
</>}</Scene3D>;

// ---- 6:55 · COMO LECHE: una taza; cae la cucharada de maicena sobre dos cucharadas de agua fría; la cuchara gira y el remolino queda blanco y liso como leche ----
export const HSlurry: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [-0.01, 0.045, 0], az: [0.1, -0.1], el: [1.25, 1.15], r: [0.3, 0.26], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="1 TBSP + 2 TBSP COLD" title="LIKE MILK" col={ICE} /><Tag tt={tt} at={4.0} x={1450} y={860} txt="THE SLURRY" col={GRN} size={44} /></>}>{(tt) => {
  const mix = eio(tt, 1.6, 4.0), sp = tt * 7;
  return <>
    <mesh geometry={lg("mug", [[0, 0], [0.045, 0], [0.05, 0.08], [0.052, 0.08], [0.047, 0.0], [0, 0.003]], 48)}>{M.porcelain({ col: "#e4eef2", side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.045, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.046, 48]} />
      <meshPhysicalMaterial color={new THREE.Color("#b8d4e2").lerp(new THREE.Color("#dfe6ea"), mix)} roughness={0.15} clearcoat={0.8} transparent opacity={0.6 + 0.4 * mix} /></mesh>
    {mix < 1 && <Mound p={[0.01, 0.045, 0.005]} r={0.025 * (1 - mix)} h={0.012 * (1 - mix)} />}
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0, 0.0456 + i * 0.0001, 0]} rotation={[-PI / 2, 0, sp * (1 - 0.12 * i) + i * 1.3]}><ringGeometry args={[0.006 + i * 0.0075, 0.0105 + i * 0.0075, 40, 1, 0, 3.2]} /><meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.95 * cl(mix * 2) * (1 - 0.6 * eio(tt, 4.4, 5.4))} /></mesh>)}
    {tt > 1.4 && <group position={[Math.cos(sp) * 0.02, 0.09, Math.sin(sp) * 0.02]} rotation={[0.25 * Math.cos(sp), 0, 0.25 * Math.sin(sp)]}><mesh><cylinderGeometry args={[0.003, 0.003, 0.12, 8]} />{M.steel({})}</mesh></group>}
    <group position={[-0.13, 0, 0.02]}><mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.03, 0.03, 0.1, 32]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[0.028, 0.028, 0.07, 32]} />{M.water({ col: "#bfe2f2", op: 0.5 })}</mesh>
      {[0, 1, 2].map((i) => <RBox key={i} s={[0.012, 0.012, 0.012]} p={[(i - 1) * 0.012, 0.065, 0]} rot={[i, i, 0]} r={0.003}>{M.glass({ col: "#e8f6ff", op: 0.6 })}</RBox>)}</group>
  </>; }}</Scene3D>;

// ---- 7:11 · UNA CUCHARADA POR TAZA: una balanza de platillos; de un lado la cucharada de maicena, del otro una taza de caldo; queda pareja ----
export const HCupThick: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.14, 0], az: [-0.1, 0.1], el: [0.14, 0.1], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="1 TBSP = 1 CUP" col={AMB} /><Tag tt={tt} at={3.6} x={1450} y={860} txt="THICKER? ANOTHER SLURRY" col={GRN} size={36} /></>}>{(tt) => {
  const tilt = (1 - eio(tt, 1.0, 3.2)) * 0.28 * (tt < 0.8 ? cl(tt / 0.8) : 1) + Math.sin(tt * 4) * 0.02 * (1 - eio(tt, 3, 4));
  return <>
    <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.008, 0.012, 0.24, 16]} />{M.brass({})}</mesh>
    <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.07, 0.08, 0.01, 32]} />{M.brass({})}</mesh>
    <group position={[0, 0.24, 0]} rotation={[0, 0, tilt]}>
      <RBox s={[0.4, 0.008, 0.012]} r={0.003}>{M.brass({})}</RBox>
      {[-1, 1].map((s) => <group key={s} position={[s * 0.19, 0, 0]} rotation={[0, 0, -tilt]}>
        {[0, 1, 2].map((i) => <mesh key={i} position={[Math.cos(i * 2.1) * 0.03, -0.05, Math.sin(i * 2.1) * 0.03]} rotation={[Math.sin(i * 2.1) * 0.5, 0, -Math.cos(i * 2.1) * 0.5]}><cylinderGeometry args={[0.0008, 0.0008, 0.11, 4]} />{M.brass({})}</mesh>)}
        <mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.06, 0.05, 0.008, 40]} />{M.brass({})}</mesh>
        {s < 0 ? <group position={[0, -0.093, 0]}><RBox s={[0.07, 0.004, 0.018]} p={[0.03, 0.006, 0]} r={0.002}>{M.steel({})}</RBox>
          <mesh position={[-0.012, 0.006, 0]} scale={[1, 0.4, 0.8]}><sphereGeometry args={[0.02, 20, 12]} />{M.steel({})}</mesh><Mound p={[-0.012, 0.01, 0]} r={0.016} h={0.009} /></group>
          : <group position={[0, -0.093, 0]}><mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.035, 0.03, 0.06, 32]} />{M.glass({ op: 0.35 })}</mesh>
            <mesh position={[0, 0.025, 0]}><cylinderGeometry args={[0.033, 0.029, 0.048, 32]} /><meshPhysicalMaterial color="#8a5a2a" roughness={0.2} clearcoat={0.6} transparent opacity={0.85} /></mesh></group>}
      </group>)}
    </group>
    <Puff p={[-0.19, 0.16, 0]} k={cl((tt - 3.2) / 1.5)} r={0.03} />
  </>; }}</Scene3D>;
