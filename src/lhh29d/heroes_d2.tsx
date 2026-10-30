// lhh29d · componentes únicos 10-18: la película de almidón en la plancha, la plancha que barre la sal, los agujeritos del vapor,
// la carreta de 1880, el jabón que no entra, los 146 años, la jarra que gira como licuado, el vidrio caliente que se raja y el polvo que se lleva la sal.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn } from "./h3d";
import { Carafe, Grains, Iron, SaltPile, Skillet, lg, saltMat } from "./saltkit";

const PI = Math.PI;
type V = [number, number, number];
const Cross: React.FC<{ k: number; p?: number[]; s?: number }> = ({ k, p = [0, 0, 0], s = 1 }) => k <= 0 ? null : <group position={p as V} scale={s}>
  {[1, -1].map((d) => <mesh key={d} rotation={[0, 0, d * PI / 4]} scale={[k, 1, 1]}><planeGeometry args={[0.3, 0.03]} />{M.glow({ col: RED, op: 0.9 })}</mesh>)}</group>;

// ---- 4:30 · UNA PELÍCULA MARRÓN Y PEGAJOSA: la plancha boca arriba; el almidón se pega en la suela en manchas que crecen; después arrastra y mancha la camisa ----
export const HStarchFilm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.06, 0], az: [-0.4, -0.15], el: [0.5, 0.4], r: [0.76, 0.66], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="A BROWN STICKY FILM" col={AMB} />
    <Tag tt={tt} at={5.0} x={960} y={230} txt="MARKS THE WHITE SHIRT" col={RED} size={46} /></>}>{(tt, u) => {
  const f = eio(u, 0.06, 0.32), flip = eio(u, 0.46, 0.56), drag = eio(u, 0.56, 0.78), off = eio(u, 0.8, 0.9);
  return <>
    <RBox s={[0.7, 0.012, 0.3]} p={[0, 0.006, 0]} r={0.004}><meshStandardMaterial color="#f8f6f0" roughness={0.95} bumpMap={tex.paper(5, 5)} bumpScale={2} /></RBox>
    {drag > 0 && <mesh position={[lerp(0.15, -0.15, drag) / 2 + 0.075, 0.0125, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.3 * drag, 0.05]} /><meshStandardMaterial color="#6a3a16" transparent opacity={0.92} roughness={0.9} /></mesh>}
    <group position={[lerp(0, lerp(0.15, -0.15, drag), flip) - 0.15 * off, lerp(0.16, 0.02, flip) + 0.5 * off, -0.05 * off]} rotation={[lerp(PI, 0, flip), 0, 0]}>
      <Iron film={f} holes />
    </group>
    {off > 0.05 && Array.from({ length: 6 }, (_, i) => { const q = ((tt * 0.9 + i / 6) % 1); return <mesh key={"dr" + i} position={[-0.12 + (rn(i, 9) - 0.5) * 0.08, lerp(0.2, 0.015, q), (rn(i, 10) - 0.5) * 0.03 - 0.05]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.006, 10, 8]} /><meshStandardMaterial color="#7a4a22" roughness={0.3} /></mesh>; })}
    {/* la lata de almidón */}
    <group position={[0.27, 0, -0.08]}><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.028, 0.028, 0.14, 32]} /><meshStandardMaterial color="#2e7bc4" metalness={0.6} roughness={0.3} /></mesh>
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.018, 0.026, 0.02, 24]} />{M.plastic({ col: "#f4f4f4" })}</mesh></group>
    {u > 0.02 && u < 0.4 && Array.from({ length: 18 }, (_, i) => { const q = ((tt * 1.2 + i / 18) % 1); return <mesh key={i} position={[0.24 - q * 0.22, 0.2 + Math.sin(i) * 0.015 + 0.06 * Math.sin(PI * q) - 0.03 * q, -0.08 + q * 0.08 + (rn(i, 2) - 0.5) * 0.04]}><sphereGeometry args={[0.006, 10, 8]} /><meshStandardMaterial color="#f4f8ff" roughness={0.1} transparent opacity={0.85 * (1 - 0.5 * q)} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 4:59 · PLANCHAR LA SAL: la bolsa de papel madera sobre la tabla; la plancha va y viene sobre la cucharada de sal y la suela vuelve a brillar ----
export const HIronPass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[-0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.08, 0], az: [0.55, 0.35], el: [0.48, 0.4], r: [0.85, 0.74], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="IRON THE SALT" col={GRN} />
    <Tag tt={tt} at={4.8} x={1450} y={860} txt="SHINY AGAIN" col={GRN} size={48} /></>}>{(tt) => {
  const go = cl((tt - 0.8) / 4.6), x = Math.sin(go * PI * 6) * 0.12, clean = eio(tt, 1.0, 5.2), lift = eio(tt, 5.4, 6.2);
  return <>
    {/* tabla de planchar con funda y bolsa de papel */}
    <mesh position={[0, 0.05, 0]} scale={[1, 1, 0.5]}><cylinderGeometry args={[0.3, 0.3, 0.012, 48, 1, false, 0, PI]} /><meshStandardMaterial color="#cfd8de" roughness={0.95} /></mesh>
    <RBox s={[0.6, 0.012, 0.3]} p={[-0.0, 0.05, 0]} r={0.05}><meshStandardMaterial color="#d6dfe4" roughness={0.95} bumpMap={tex.paper(6, 3)} bumpScale={2} /></RBox>
    <RBox s={[0.42, 0.003, 0.22]} p={[0, 0.058, 0]} r={0.002}><meshStandardMaterial color="#b98d5c" roughness={0.9} bumpMap={tex.paper(3, 2)} bumpScale={3} /></RBox>
    <Grains n={70} r={0.07} p={[x * 0.4, 0.06, 0]} seed={3} col={clean > 0.5 ? "#e8d8c0" : undefined} />
    <group position={[x, 0.065 + lift * 0.035, 0]} rotation={[lift * 0.25, 0, 0]}><Iron film={1 - clean} holes={false} /></group>
  </>;
}}</Scene3D>;

// ---- 5:15 · NUNCA CON VAPOR: corte de la suela con sus agujeritos; sale el vapor, la sal se moja y se mete y tapa los agujeros; cruz roja ----
export const HSteamHoles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark"
  cam={{ at: [0, 0.03, 0], az: [0.05, -0.05], el: [0.14, 0.1], r: [0.56, 0.46], fov: 28 }}
  over={(tt) => <><Head tt={tt} kick="" title="NEVER WITH STEAM ON" col={RED} /><Tag tt={tt} at={3.4} x={1450} y={840} txt="CLOGS THE HOLES" col={RED} size={42} /></>}>{(tt) => {
  const steam = cl((tt - 0.6) / 0.6), clog = eio(tt, 1.8, 4.6), x = eio(tt, 4.8, 5.4);
  return <>
    {/* corte de la suela: placa con 5 agujeros y la cámara de agua arriba */}
    {Array.from({ length: 6 }, (_, i) => <RBox key={i} s={[0.04, 0.014, 0.08]} p={[-0.15 + i * 0.06, 0.04, 0]} r={0.002}>{M.chrome({})}</RBox>)}
    <RBox s={[0.36, 0.03, 0.08]} p={[0, 0.07, 0]} r={0.004}><meshStandardMaterial color="#5d7d99" transparent opacity={0.55} roughness={0.2} /></RBox>
    {Array.from({ length: 5 }, (_, i) => { const hx = -0.12 + i * 0.06; return <group key={i}>
      {Array.from({ length: 4 }, (_, k) => { const u = ((tt * 1.3 + k / 4 + i * 0.13) % 1); return <mesh key={k} position={[hx, 0.03 - u * 0.05, 0.0]} scale={0.6 + u}><sphereGeometry args={[0.006, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.4 * (1 - u) * steam * (1 - clog)} depthWrite={false} /></mesh>; })}
      <mesh position={[hx, 0.04 - 0.004 * (1 - clog), 0]} scale={[1, clog, 1]}><boxGeometry args={[0.018, 0.014, 0.07]} /><meshStandardMaterial color="#c7c9c4" roughness={0.9} /></mesh>
    </group>; })}
    <Grains n={50} r={0.12} p={[0, -0.01, 0]} k={1} seed={5} y={0.0} col="#dfe6ea" />
    <RBox s={[0.42, 0.004, 0.14]} p={[0, -0.012, 0]} r={0.002}><meshStandardMaterial color="#b98d5c" roughness={0.9} /></RBox>
    
  </>;
}}</Scene3D>;

// ---- 5:33 · VINO EN CARRETA, 1880: la carreta de lona cruza la pradera al anochecer y la sartén negra se bambolea colgada del costado ----
export const HWagon1880: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#1a1e26" lamp={[0.6, 0.4, 0.4]}
  cam={{ at: [0, 0.1, 0], az: [0.6, 0.45], el: [0.16, 0.12], r: [0.95, 0.8], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="CAME WEST BY WAGON" col={AMB} /><Tag tt={tt} at={1.0} x={1450} y={840} txt="IOWA · 1880" col={AMB} size={44} /></>}>{(tt) => {
  const x = lerp(-0.25, 0.12, eio(tt, 0, 4.8)), rock = Math.sin(tt * 5) * 0.015, sw = Math.sin(tt * 3.2) * 0.35;
  const canvas = <meshStandardMaterial color="#c4b896" roughness={1} side={THREE.DoubleSide} bumpMap={tex.paper(3, 3)} bumpScale={5} />;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 6]} /><meshStandardMaterial color="#6d6a3a" roughness={1} bumpMap={tex.paper(30, 30)} bumpScale={4} /></mesh>
    {Array.from({ length: 60 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 1.6, 0.012, (rn(i, 3) - 0.5) * 1.2]} rotation={[0, rn(i, 4) * 3, 0.2]}><coneGeometry args={[0.004, 0.03, 4]} /><meshStandardMaterial color="#8a8040" /></mesh>)}
    <mesh position={[0.2, 0.8, -2]}><circleGeometry args={[0.18, 40]} /><meshBasicMaterial color="#c97a40" /></mesh>
    <group position={[x, 0.0, 0]} rotation={[rock, 0, rock * 0.5]}>
      <RBox s={[0.34, 0.06, 0.16]} p={[0, 0.1, 0]} r={0.006}>{M.wood({ base: [110, 72, 40] })}</RBox>
      <mesh position={[0, 0.13, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.1, 0.1, 0.34, 32, 1, true, 0, PI]} />{canvas}</mesh>
      {[-1, 1].map((sx) => [-1, 1].map((sz) => <mesh key={sx + "" + sz} position={[sx * 0.12, 0.055, sz * 0.09]} rotation={[0, 0, -tt * 3]}><torusGeometry args={[0.05, 0.01, 10, 28]} />{M.wood({ base: [90, 58, 32] })}</mesh>))}
      <group position={[0, 0.2, 0.1]} rotation={[sw * 0.7, 0, 0]}>
        <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.0015, 0.0015, 0.04, 4]} /><meshStandardMaterial color="#555" /></mesh>
        <group position={[0, -0.075, 0.012]} rotation={[PI / 2, 0, PI / 2]} scale={0.42}><Skillet seasoning={1} /></group>
      </group>
    </group>
  </>;
}}</Scene3D>;

// ---- 5:39 · NI UNA VEZ JABÓN: la barra de jabón con espuma se acerca a la sartén y rebota contra un vidrio invisible; cruz ----
export const HNoSoap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile"
  cam={{ at: [0.13, 0.03, 0.02], az: [-0.3, -0.1], el: [0.5, 0.42], r: [0.68, 0.58], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="NEVER ONE DROP OF SOAP" col={RED} /><Tag tt={tt} at={2.6} x={1450} y={840} txt="150 YEARS" col={AMB} size={44} /></>}>{(tt, u) => {
  const app = eio(u, 0.3, 0.5), bounce = u > 0.5 ? Math.abs(Math.sin((u - 0.5) * 22)) * 0.09 * Math.max(0, 1 - (u - 0.5) * 3) : 0, flash = cl(1 - Math.abs(u - 0.54) * 9);
  return <>
    <Skillet p={[0.04, 0, 0]} seasoning={1} />
    <mesh position={[0.165, 0.06, 0.05]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.2, 0.12]} />{M.glass({ op: 0.08 + 0.4 * flash })}</mesh>
    <group position={[lerp(0.32, 0.21, app) + bounce + 0.06 * eio(u, 0.66, 0.78), 0.018 + 0.03 * flash, 0.05]} rotation={[0, 0.3 + flash, 0]} scale={1.2}>
      <RBox s={[0.09, 0.03, 0.055]} r={0.012}><meshPhysicalMaterial color="#f2c8d8" roughness={0.3} clearcoat={0.5} /></RBox>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.08, 0.018, (rn(i, 3) - 0.5) * 0.05]}><sphereGeometry args={[0.006 + rn(i, 4) * 0.006, 12, 8]} />{M.glass({ op: 0.45 })}</mesh>)}
    </group>
    {[-1, 1].map((k) => <mesh key={"x" + k} position={[0.27, 0.06, 0.05]} rotation={[0, 0, k * 0.78]} scale={[Math.max(0.001, eio(u, 0.8, 0.86)), 1, 1]}><boxGeometry args={[0.16, 0.014, 0.01]} />{M.glow({ col: "#e0302a" })}</mesh>)}
    {/* el huevo frito se despega y patina sin una gota de jabón */}
    <group position={[0.04 + 0.03 * Math.sin(eio(u, 0.6, 0.76) * PI * 2) + 0.075 * eio(u, 0.76, 0.92), 0.0075 + 0.01 * eio(u, 0.76, 0.92), 0.03 * Math.sin(eio(u, 0.6, 0.76) * PI)]} scale={Math.max(0.001, cl(phys(tt, 0.4, 7, 0.5)))}>
      <mesh rotation={[-PI / 2, 0, 0]} scale={[1, 0.85, 1]}><circleGeometry args={[0.055, 40]} /><meshPhysicalMaterial color="#f7f3ea" roughness={0.35} clearcoat={0.5} /></mesh>
      <mesh position={[0.008, 0.002, 0]} scale={[1, 0.55, 1]}><sphereGeometry args={[0.02, 24, 16, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color="#f2a81a" roughness={0.2} clearcoat={1} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 6:26 · 146 AÑOS SIN UN PUNTO DE ÓXIDO: la sartén con dos huevos chisporroteando; el contador rueda hasta 146 ----
export const HAge146: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" lamp={[0, 0.4, 0.3]}
  cam={{ at: [0, 0.04, 0], az: [0.25, 0.4], el: [0.62, 0.52], r: [0.68, 0.56], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="146 YEARS · NO RUST" col={AMB} /><Tag tt={tt} at={2.0} x={1450} y={840} txt="EGGS EVERY MORNING" col={GRN} size={40} /></>}>{(tt, u) => {
  const v = 146 * eio(tt, 0.4, 3.6), fry = eio(tt, 0.2, 2.0);
  return <>
    {/* hornalla a gas */}
    <mesh position={[0, -0.01, 0]}><cylinderGeometry args={[0.16, 0.16, 0.01, 40]} /><meshStandardMaterial color="#1c1c1c" roughness={0.6} /></mesh>
    {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.06, -0.012, Math.sin(a) * 0.06]}><coneGeometry args={[0.006, 0.02, 6]} />{M.glow({ col: "#4aa0ff", op: 0.7 })}</mesh>; })}
    <Skillet seasoning={1} />
    {[-0.045, 0.05].map((x, i) => <group key={i} position={[x, 0.0075, i ? 0.03 : -0.02]}>
      <mesh rotation={[-PI / 2, 0, 0]} scale={[1.1, 0.9, 1]}><circleGeometry args={[0.04, 32]} /><meshStandardMaterial color={new THREE.Color("#e8ecd8").lerp(new THREE.Color("#ffffff"), fry)} transparent opacity={0.6 + 0.4 * fry} roughness={0.4} /></mesh>
      <mesh position={[0, 0.006, 0]} scale={[1, 0.55, 1]}><sphereGeometry args={[0.014, 24, 16]} /><meshPhysicalMaterial color="#f4a614" roughness={0.2} clearcoat={1} /></mesh></group>)}
    {Array.from({ length: 8 }, (_, i) => { const u = ((tt * 2 + i / 8) % 1); return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.18, 0.01 + u * 0.03, (rn(i, 4) - 0.5) * 0.18]}><sphereGeometry args={[0.0015, 6, 4]} />{M.glow({ col: "#fff3c4", op: 0.8 * (1 - u) })}</mesh>; })}
    {u > 0.6 && (() => { const land = eio(u, 0.64, 0.74), b = u > 0.74 ? Math.abs(Math.sin((u - 0.74) * 45)) * 0.02 * Math.max(0, 1 - (u - 0.74) * 6) : 0, open = cl((u - 0.8) * 10);
      return <group position={[0.0, 0.0075 + 0.16 * (1 - land) + b, 0.075]}>
        {open < 1 && <mesh position={[0, 0.02, 0]} scale={[1 - open, 1.3 * (1 - open), 1 - open]}><sphereGeometry args={[0.018, 24, 16]} /><meshPhysicalMaterial color="#f3e6d0" roughness={0.5} /></mesh>}
        {open > 0 && <><mesh rotation={[-PI / 2, 0, 0]} scale={open}><circleGeometry args={[0.038, 32]} /><meshStandardMaterial color="#f6f6f2" /></mesh>
          <mesh position={[0, 0.006, 0]} scale={[open, 0.55 * open, open]}><sphereGeometry args={[0.014, 24, 16]} /><meshPhysicalMaterial color="#f4a614" roughness={0.2} clearcoat={1} /></mesh></>}
      </group>; })()}
    <group position={[0, 0.07, -0.22]} rotation={[-0.3, 0, 0]}>
      <RBox s={[0.15, 0.07, 0.04]} r={0.008}>{M.wood({ base: [120, 80, 50] })}</RBox>
      {[0, 1, 2].map((d) => <DigitDrum key={d} v={d === 0 ? Math.min(1, v / 100) : d === 1 ? Math.min(4, (v % 100) / 10) : v % 10} p={[-0.042 + d * 0.042, 0, 0.022]} r={0.024} w={0.034} />)}
    </group>
  </>;
}}</Scene3D>;

// ---- 7:14 · GIRARLA COMO UN LICUADO: la jarra con hielo y sal; los cubitos dan vueltas, rascan el vidrio y la película marrón se borra ----
export const HMilkshake: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" lamp={[-0.3, 0.4, 0.2]}
  cam={{ at: [0, 0.09, 0], az: [-0.2, 0.2], el: [0.22, 0.18], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="SWIRL IT LIKE A MILKSHAKE" col={ICE} /><Tag tt={tt} at={1.0} x={420} y={840} txt="ICE + SALT + LEMON" col={AMB} size={38} anchor="l" />
    <Tag tt={tt} at={5.2} x={1450} y={840} txt="LIKE NEW" col={GRN} size={44} /></>}>{(tt) => {
  const sw = cl((tt - 0.6) / 4.6), ang = tt * 8 * (sw > 0 && sw < 1 ? 1 : 0.2), film = 1 - eio(tt, 0.8, 5.2), wob = Math.sin(tt * 8) * 0.06 * (sw > 0 && sw < 1 ? 1 : 0);
  return <><mesh position={[0, 0.15, -0.2]}><planeGeometry args={[0.6, 0.4]} /><meshStandardMaterial color="#15181d" roughness={0.9} /></mesh><group rotation={[wob, 0, wob * 0.6]}>
    <Carafe film={film} />
    {Array.from({ length: 6 }, (_, i) => { const a = ang + (i / 6) * PI * 2, r = 0.05; return <RBox key={i} s={[0.033, 0.03, 0.033]} p={[Math.cos(a) * r, 0.018 + (i % 2) * 0.022, Math.sin(a) * r]} rot={[a, a * 0.7, 0]} r={0.005}>{M.glass({ col: "#eaf6ff", op: 0.6 })}</RBox>; })}
    <Grains n={40} r={0.06} p={[0, 0.005, 0]} seed={8} />
    <mesh position={[Math.cos(ang + 1) * 0.03, 0.04, Math.sin(ang + 1) * 0.03]} rotation={[PI / 2, 0, ang]}><cylinderGeometry args={[0.025, 0.025, 0.006, 24]} /><meshStandardMaterial color="#f3dc4a" roughness={0.4} /></mesh>
  </group></>;
}}</Scene3D>;

// ---- 7:50 · NUNCA HIELO EN VIDRIO CALIENTE: la jarra recién salida de la placa, roja de calor; cae un cubito y el vidrio se raja ----
export const HThermalCrack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark"
  cam={{ at: [0, 0.09, 0], az: [0.2, -0.1], el: [0.18, 0.14], r: [0.56, 0.46], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="NEVER ICE IN HOT GLASS" col={RED} /><Tag tt={tt} at={3.6} x={1450} y={840} txt="LET IT COOL FIRST" col={ICE} size={42} /></>}>{(tt) => {
  const heat = 1 - eio(tt, 2.4, 3.2) * 0.3, drop = phys(tt, 1.0, 9, 0.4), crack = eio(tt, 1.7, 2.4);
  return <>
    <RBox s={[0.26, 0.02, 0.22]} p={[0, 0.0, 0]} r={0.01}><meshStandardMaterial color="#141414" roughness={0.5} /></RBox>
    <mesh position={[0, 0.0105, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.08, 40]} /><meshStandardMaterial color="#3a0a04" emissive="#ff3a10" emissiveIntensity={1.2 * heat} /></mesh>
    <group position={[0, 0.012, 0]}><Carafe film={0.3} /></group>
    <pointLight position={[0, 0.06, 0.1]} color="#ff5a1a" intensity={1.6 * heat} distance={0.5} />
    {Array.from({ length: 6 }, (_, i) => { const u = ((tt * 0.8 + i / 6) % 1); return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.06, 0.18 + u * 0.15, 0]} scale={1 + u}><sphereGeometry args={[0.012, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.15 * (1 - u)} depthWrite={false} /></mesh>; })}
    {drop > 0 && <RBox s={[0.026, 0.024, 0.026]} p={[0.01, 0.04 + (1 - cl(drop)) * 0.35, 0]} rot={[tt, tt, 0]} r={0.005}>{M.glass({ col: "#eaf6ff", op: 0.7 })}</RBox>}
    {crack > 0 && Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * PI * 2 + 0.3; return <mesh key={i} position={[Math.cos(a) * 0.087, 0.06, Math.sin(a) * 0.087]} rotation={[0, -a + PI / 2, (rn(i, 5) - 0.5) * 1.2]}>
      <planeGeometry args={[0.0018, 0.1 * crack * (0.6 + rn(i, 6))]} /><meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 8:23 · LA SAL SE LLEVA EL POLVO: corte de la bolsa de papel con las flores de seda cabeza abajo; la sal rebota, junta el polvo gris y cae al fondo ----
export const HDustCarry: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.14, 0], az: [-0.1, 0.1], el: [0.12, 0.1], r: [0.7, 0.6], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="SALT CARRIES THE DUST" col={GRN} /><Tag tt={tt} at={0.8} x={420} y={840} txt="HEADS FIRST" col={AMB} size={40} anchor="l" />
    <Tag tt={tt} at={4.8} x={1450} y={840} txt="ONE MINUTE" col={GRN} size={42} /></>}>{(tt) => {
  const shake = cl((tt - 0.8) / 4.2), sh = Math.sin(tt * 14) * 0.012 * (shake > 0 && shake < 1 ? 1 : 0), clean = eio(tt, 1.0, 5.0);
  const petal = new THREE.Color("#8d8a86").lerp(new THREE.Color("#e04a6a"), clean), leaf = new THREE.Color("#7a7d74").lerp(new THREE.Color("#3f8a3a"), clean);
  return <group position={[sh, 0, 0]}>
    {/* bolsa cortada: tres paredes de papel madera */}
    <RBox s={[0.26, 0.36, 0.004]} p={[0, 0.18, -0.08]} r={0.002}><meshStandardMaterial color="#b98d5c" roughness={0.95} bumpMap={tex.paper(3, 4)} bumpScale={3} /></RBox>
    {[-1, 1].map((k) => <RBox key={k} s={[0.004, 0.36, 0.16]} p={[k * 0.13, 0.18, 0]} r={0.002}><meshStandardMaterial color="#a77d4e" roughness={0.95} /></RBox>)}
    <RBox s={[0.26, 0.004, 0.16]} p={[0, 0.002, 0]} r={0.002}><meshStandardMaterial color="#a77d4e" roughness={0.95} /></RBox>
    {/* flores cabeza abajo: tallos que entran por arriba */}
    {[-0.06, 0, 0.06].map((x, i) => <group key={i} position={[x, 0.12, 0]} rotation={[0, i, Math.sin(tt * 9 + i) * 0.06 * (shake > 0 && shake < 1 ? 1 : 0)]}>
      <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.003, 0.003, 0.26, 6]} /><meshStandardMaterial color={leaf} /></mesh>
      {Array.from({ length: 6 }, (_, k) => <mesh key={k} position={[Math.cos(k) * 0.02, 0.0, Math.sin(k) * 0.02]} rotation={[Math.cos(k) * 0.8, 0, Math.sin(k) * 0.8]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.022, 16, 10]} /><meshStandardMaterial color={petal} roughness={0.7} side={THREE.DoubleSide} /></mesh>)}
    </group>)}
    {/* granos que rebotan y motas de polvo que se van con ellos */}
    {Array.from({ length: 40 }, (_, i) => { if (shake <= 0) return null; const u = ((tt * 0.9 + rn(i, 2)) % 1), y = 0.02 + Math.abs(Math.sin(u * PI * 2)) * 0.16 * (shake < 1 ? 1 : 1 - u);
      return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.22, y, (rn(i, 4) - 0.5) * 0.12]} rotation={[i, i, 0]}><boxGeometry args={[0.004, 0.004, 0.004]} />{saltMat(i % 3 === 0 ? "#9a968e" : undefined)}</mesh>; })}
    <SaltPile r={0.1} h={0.012 * clean} p={[0, 0.004, 0]} tint="#b8b2a8" />
  </group>;
}}</Scene3D>;
