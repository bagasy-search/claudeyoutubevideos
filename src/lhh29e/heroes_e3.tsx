// lhh29e · componentes únicos 21-30: el minuto de hervor, mitad y mitad, la fuente de la kermés, el aceite que se enfría, la casa parroquial de 120 años,
// las tablas que se rozan, el freezer que la arruina, el gusto a tiza, la canasta y la bolsa que se sacude.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn } from "./h3d";
import { Bowl, Skillet, card, dialAng, dialFace, SERIF } from "./saltkit";
import { Drumstick, Floorboards, Mound, Naipe, Pot, Puff, powderMat } from "./cornkit";

const PI = Math.PI;

// ---- 7:29 · UN MINUTO DE HERVOR Y ABAJO: la salsa burbujea; un reloj de arena de un minuto se da vuelta; cuando cae el último grano la perilla gira a bajo ----
export const HBoilMinute: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.08, 0], az: [-0.25, 0.1], el: [0.3, 0.24], r: [0.56, 0.48], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="ONE MINUTE AT A BOIL" col={AMB} /><Tag tt={tt} at={3.8} x={1450} y={860} txt="THEN TURN IT DOWN" col={GRN} size={40} /></>}>{(tt) => {
  const sand = eio(tt, 0.8, 3.6), low = eio(tt, 3.7, 4.3), b = 1 - 0.8 * low;
  return <>
    <Pot p={[-0.05, 0, 0]} level={0.75} thick={0.8} col="#7a4a22">
      {Array.from({ length: 8 }, (_, i) => { const u = ((tt * (1.2 * b) + rn(i, 2)) % 1); return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.12, 0.064, (rn(i, 4) - 0.5) * 0.12]} scale={[1, 0.6, 1]}><sphereGeometry args={[0.006 * Math.sin(u * PI) * b + 0.0001, 10, 8]} /><meshPhysicalMaterial color="#8a5a2a" roughness={0.1} clearcoat={1} /></mesh>; })}
    </Pot>
    <group position={[0.2, 0, 0.02]} rotation={[0, 0, (1 - eio(tt, 0.2, 0.7)) * PI]}>
      <group position={[0, 0.07, 0]}>
        <mesh geometry={undefined} position={[0, 0.03, 0]}><coneGeometry args={[0.025, 0.05, 24, 1, true]} />{M.glass({ op: 0.3, side: THREE.DoubleSide })}</mesh>
        <mesh position={[0, -0.03, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.025, 0.05, 24, 1, true]} />{M.glass({ op: 0.3, side: THREE.DoubleSide })}</mesh>
        <mesh position={[0, 0.012 + 0.012 * (1 - sand), 0]} scale={[1 - sand * 0.9 + 0.1, 1 - sand + 0.01, 1 - sand * 0.9 + 0.1]}><coneGeometry args={[0.02, 0.025, 20]} /><meshStandardMaterial color="#e2c48a" roughness={1} /></mesh>
        <mesh position={[0, -0.05 + 0.01 * sand, 0]} scale={[sand + 0.01, sand + 0.01, sand + 0.01]}><coneGeometry args={[0.022, 0.022, 20]} /><meshStandardMaterial color="#e2c48a" roughness={1} /></mesh>
        {[-1, 1].map((s) => <mesh key={s} position={[0, s * 0.058, 0]}><cylinderGeometry args={[0.032, 0.032, 0.006, 24]} />{M.wood({ base: [120, 80, 50] })}</mesh>)}
      </group>
    </group>
    <group position={[-0.05, 0.03, 0.14]} rotation={[0.3, 0, 0]}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.016, 32]} /><meshStandardMaterial color="#2a2a2a" roughness={0.4} /></mesh>
      <group rotation={[0, 0, lerp(-0.8, 0.9, low)]}><RBox s={[0.006, 0.03, 0.006]} p={[0, 0.006, 0.009]} r={0.002}><meshStandardMaterial color="#f4f4f4" /></RBox></group></group>
    <mesh position={[-0.05, -0.002, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.04, 0.085, 32]} />{M.glow({ col: "#ff5a2a", op: 0.6 * b })}</mesh>
    <pointLight position={[-0.05, 0.02, 0]} color="#ff6a2a" intensity={1.4 * b} distance={0.4} />
  </>; }}</Scene3D>;

// ---- 7:58 · MITAD Y MITAD: dos tazas iguales se vuelcan a la vez en un bol: harina a la izquierda, maicena a la derecha; entran la sal, la pimienta y el pimentón ----
export const HHalfHalf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.06, 0], az: [0.15, -0.1], el: [0.45, 0.38], r: [0.62, 0.52], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="THE CHICKEN COATING" title="HALF AND HALF" col={AMB} /><Tag tt={tt} at={0.8} x={540} y={880} txt="1 CUP FLOUR" col={AMB} size={38} />
    <Tag tt={tt} at={1.2} x={1380} y={880} txt="1 CUP CORNSTARCH" col={ICE} size={38} /></>}>{(tt) => {
  const tip = eio(tt, 0.8, 1.6) * (1 - eio(tt, 2.4, 2.8)), fill = eio(tt, 1.0, 2.6), sp = eio(tt, 3.2, 4.4);
  return <>
    <Bowl p={[0, 0, 0.02]} s={1.3} col="#d8e4ea" />
    <mesh position={[-0.025, 0.02 + 0.035 * fill, 0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.06 * fill + 0.001, 32, 0, PI]} /><meshStandardMaterial color="#efe4cc" roughness={1} /></mesh>
    <mesh position={[0.025, 0.02 + 0.035 * fill, 0.02]} rotation={[-PI / 2, 0, PI]}><circleGeometry args={[0.06 * fill + 0.001, 32, 0, PI]} />{powderMat()}</mesh>
    {[-1, 1].map((s) => <group key={s} position={[s * lerp(0.2, 0.08, tip), 0.02 + 0.13 * tip, 0.02]} rotation={[0, 0, -s * tip * 1.9]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.04, 0.035, 0.06, 32, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      {tip < 0.5 && <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.038, 0.034, 0.05, 32]} />{s < 0 ? <meshStandardMaterial color="#efe4cc" roughness={1} /> : powderMat()}</mesh>}
    </group>)}
    {tip > 0.5 && [-1, 1].map((s) => Array.from({ length: 26 }, (_, i) => { const q = ((tt * 1.8 + i / 26) % 1), y = 0.15 - q * 0.1, bo = q > 0.85 ? (q - 0.85) * 6.7 : 0;
      return <mesh key={s + "_" + i} position={[s * (0.07 - q * 0.035) + s * bo * 0.02 * (rn(i, 9) - 0.2), y + 0.02 * Math.sin(PI * bo), 0.02 + (rn(i, 8) - 0.5) * 0.02]}><sphereGeometry args={[0.0035, 6, 5]} />{s < 0 ? <meshStandardMaterial color="#efe4cc" roughness={1} /> : powderMat()}</mesh>; }))}
    {[-1, 1].map((s) => <Puff key={"pf" + s} p={[s * 0.035, 0.06, 0.02]} k={tip > 0.5 ? (tt * 1.8) % 1 : 0} r={0.03} seed={s + 5} />)}
    {Array.from({ length: 24 }, (_, i) => { const u = cl(sp * 1.4 - rn(i, 2) * 0.4); if (u <= 0) return null; const col = ["#ffffff", "#2a2a2a", "#c83a1a"][i % 3];
      return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.08, lerp(0.22, 0.056, u), 0.02 + (rn(i, 4) - 0.5) * 0.08]}><sphereGeometry args={[0.0022, 6, 5]} /><meshStandardMaterial color={col} roughness={0.7} /></mesh>; })}
  </>; }}</Scene3D>;

// ---- 8:12 · UNA HORA EN LA KERMÉS: dos presas en la fuente; un reloj adelanta una hora; la de harina sola se hunde y se ablanda, la de mitad y mitad sigue crocante con brillo ----
export const HPotluck: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.04, 0], az: [-0.1, 0.1], el: [0.42, 0.36], r: [0.44, 0.38], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="AN HOUR ON THE PLATTER" title="STILL CRISP" col={GRN} /><Tag tt={tt} at={1.2} x={560} y={880} txt="FLOUR ALONE" col={RED} size={38} /><Tag tt={tt} at={1.6} x={1360} y={880} txt="HALF AND HALF" col={GRN} size={38} /></>}>{(tt) => {
  const hr = eio(tt, 0.4, 3.0);
  return <>
    <mesh position={[0, 0.006, 0]} rotation={[-PI / 2, 0, 0]} scale={[1.5, 1, 1]}><circleGeometry args={[0.15, 48]} />{M.porcelain({})}</mesh>
    <Drumstick p={[-0.08, 0.025 - 0.006 * hr, 0]} rot={[PI / 2, 0, 0.3]} s={1.2} crisp={1 - hr} grease={hr} />
    <Drumstick p={[0.08, 0.025, 0]} rot={[PI / 2, 0, -0.3]} s={1.2} crisp={1} />
    {tt < 1.6 && Array.from({ length: 34 }, (_, i) => { const q = cl((tt - 0.1 - rn(i, 2) * 0.8) / 0.5); if (q <= 0 || q >= 1) return null; return <mesh key={"pd" + i} position={[0.08 + (rn(i, 3) - 0.5) * 0.07, 0.17 - q * 0.13, (rn(i, 4) - 0.5) * 0.05]}><sphereGeometry args={[0.003, 6, 5]} />{powderMat()}</mesh>; })}
    <Puff p={[0.08, 0.05, 0]} k={cl((tt - 0.5) / 1.1)} r={0.05} seed={3} />
    {hr > 0.4 && <mesh position={[-0.08, 0.0075, 0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.03 * hr, 24]} />{M.grease({ col: "#d8b05a", op: 0.7 })}</mesh>}
    <group position={[0, 0.065, -0.2]} scale={0.7}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.055, 0.055, 0.012, 48]} />{M.brass({})}</mesh>
      <mesh position={[0, 0, 0.0065]}><circleGeometry args={[0.05, 48]} /><meshStandardMaterial color="#fbfaf6" /></mesh>
      <group position={[0, 0, 0.008]} rotation={[0, 0, -hr * PI * 2]}><mesh position={[0, 0.02, 0]}><boxGeometry args={[0.003, 0.04, 0.001]} /><meshBasicMaterial color="#222" /></mesh></group>
      <group position={[0, 0, 0.009]} rotation={[0, 0, -hr * PI / 6]}><mesh position={[0, 0.013, 0]}><boxGeometry args={[0.004, 0.026, 0.001]} /><meshBasicMaterial color="#222" /></mesh></group></group>
  </>; }}</Scene3D>;

// ---- 8:18 · EL ACEITE SE ENFRÍA: termómetro de fritura en la sartén; entran las presas de a una, demasiadas; la aguja cae de 350 a 275 y el burbujeo se apaga ----
export const HOilCools: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.06, 0], az: [0.3, 0.2], el: [0.5, 0.42], r: [0.56, 0.48], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="DON'T CROWD THE PAN" col={RED} /><Tag tt={tt} at={3.6} x={1450} y={860} txt="GREASY, NOT CRISPY" col={RED} size={40} /></>}>{(tt) => {
  const n = Math.min(9, Math.floor(eio(tt, 0.3, 3.0) * 9.99)), temp = lerp(350, 275, eio(tt, 1.2, 3.6)), b = cl((temp - 275) / 75);
  return <>
    <Skillet s={1.2} />
    <mesh position={[0, 0.024, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.105, 48]} />{M.grease({ col: "#c99a3a", op: 0.85 })}</mesh>
    {Array.from({ length: n }, (_, i) => { const a = i * 2.4, r = i === 0 ? 0 : 0.035 + (i % 3) * 0.02; return <Drumstick key={i} p={[Math.cos(a) * r, 0.03, Math.sin(a) * r]} rot={[PI / 2, 0, a]} s={0.55} crisp={0.3} grease={1 - b} raw={0.2} />; })}
    {Array.from({ length: 16 }, (_, i) => { const u = ((tt * 2.2 + rn(i, 2)) % 1); return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.18, 0.026 + u * 0.01, (rn(i, 4) - 0.5) * 0.18]} scale={(1 - u) * b + 0.0001}><sphereGeometry args={[0.004, 8, 6]} />{M.grease({ col: "#f6e0a0", op: 0.8 })}</mesh>; })}
    <group position={[0.12, 0.07, -0.05]} rotation={[0.35, -0.5, -0.4]}>
      <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.0018, 0.0018, 0.1, 8]} />{M.steel({})}</mesh>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.035, 0.01, 40]} />{M.chrome({})}</mesh>
      <mesh position={[0, 0, 0.0055]}><circleGeometry args={[0.031, 40]} /><meshStandardMaterial map={dialFace("fry", 200, 400, 350)} roughness={0.5} /></mesh>
      <group position={[0, 0, 0.007]} rotation={[0, 0, -dialAng(temp, 200, 400) + PI]}><mesh position={[0.012, 0, 0]}><boxGeometry args={[0.026, 0.002, 0.001]} /><meshBasicMaterial color="#b8322a" /></mesh></group>
    </group>
  </>; }}</Scene3D>;

// ---- 8:52 · CIENTO VEINTE AÑOS: la casa parroquial blanca junto a la iglesia; una ventana del pasillo se enciende de noche y el contador llega a 120 ----
export const HParsonage120: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0f1626"
  cam={{ at: [0.04, 0.2, 0], az: [-0.3, -0.15], el: [0.16, 0.12], r: [1.32, 1.2], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="THE PARSONAGE" title="120 YEARS OLD" col={AMB} /><Tag tt={tt} at={2.6} x={1450} y={860} txt="SQUEAK. SQUEAK." col={ICE} size={44} /></>}>{(tt) => { const n = 120 * eio(tt, 0.3, 2.6), win = eio(tt, 1.4, 2.0);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#1c2a1c" roughness={1} /></mesh>
    <group position={[-0.12, 0, 0]}>
      <RBox s={[0.28, 0.18, 0.2]} p={[0, 0.09, 0]} r={0.004}><meshStandardMaterial map={tex.wood(1, 12, [214, 200, 172])} roughness={0.85} /></RBox>
      <mesh position={[0, 0.23, 0]} rotation={[0, PI / 4, 0]} scale={[1, 0.6, 1]}><coneGeometry args={[0.21, 0.16, 4]} /><meshStandardMaterial color="#3a3a40" roughness={0.8} /></mesh>
{Array.from({ length: 9 }, (_, j) => <mesh key={"cb" + j} position={[0, 0.012 + j * 0.019, 0.1012]}><boxGeometry args={[0.28, 0.003, 0.002]} /><meshStandardMaterial color="#8a8070" roughness={1} /></mesh>)}
      {[-0.08, 0, 0.08].map((x, i) => <mesh key={i} position={[x, 0.1, 0.103]}><planeGeometry args={[0.04, 0.05]} /><meshStandardMaterial color="#1a1a22" emissive="#ffc46a" emissiveIntensity={i === 1 ? 0.25 * win : 0.06} /></mesh>)}
      <pointLight position={[0, 0.1, 0.14]} color="#ffc46a" intensity={0.15 * win} distance={0.4} />
    </group>
    <group position={[0.22, 0, -0.06]}>
      <RBox s={[0.16, 0.16, 0.26]} p={[0, 0.08, 0]} r={0.004}><meshStandardMaterial map={tex.wood(1, 12, [236, 228, 210])} roughness={0.8} /></RBox>
      {Array.from({ length: 8 }, (_, j) => <mesh key={"cc" + j} position={[0.0812, 0.012 + j * 0.019, 0]} rotation={[0, PI / 2, 0]}><boxGeometry args={[0.26, 0.003, 0.002]} /><meshStandardMaterial color="#9a9282" roughness={1} /></mesh>)}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]} scale={[1, 0.6, 1.6]}><coneGeometry args={[0.115, 0.12, 4]} /><meshStandardMaterial color="#3a3a40" /></mesh>
      <RBox s={[0.05, 0.12, 0.05]} p={[0, 0.27, 0.11]} r={0.003}><meshStandardMaterial color="#f2efe8" /></RBox>
      <mesh position={[0, 0.37, 0.11]}><coneGeometry args={[0.035, 0.08, 4]} /><meshStandardMaterial color="#3a3a40" /></mesh>
      <RBox s={[0.004, 0.04, 0.004]} p={[0, 0.43, 0.11]} r={0.001}><meshStandardMaterial color="#d8c88a" /></RBox><RBox s={[0.02, 0.004, 0.004]} p={[0, 0.44, 0.11]} r={0.001}><meshStandardMaterial color="#d8c88a" /></RBox>
    </group>
    <mesh position={[0.5, 0.55, -0.6]}><circleGeometry args={[0.04, 32]} /><meshBasicMaterial color="#8a8878" /></mesh>
    <group position={[0.06, 0.06, 0.28]} rotation={[0, -0.3, 0]} scale={2.1}><RBox s={[0.12, 0.06, 0.03]} r={0.008}>{M.wood({ base: [120, 80, 50] })}</RBox>
      {[0, 1, 2].map((d) => <DigitDrum key={d} v={d === 0 ? Math.floor(n / 100) : d === 1 ? Math.floor(n / 10) % 10 : n % 10} p={[-0.03 + d * 0.03, 0, 0.016]} r={0.02} w={0.026} />)}</group>
  </>; }}</Scene3D>;

// ---- 9:22 · LAS TABLAS NO SE ROZAN: corte de dos tablas del piso; al pisar se frotan y salen ondas de chirrido; el polvo entra a la rendija y la pisada ya no hace onda ----
export const HBoardsRub: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark" bg="#5a4836"
  cam={{ at: [0, 0.02, 0], az: [0.4, 0.25], el: [0.36, 0.3], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="POWDER IN THE CRACKS" col={AMB} /><Tag tt={tt} at={0.6} x={540} y={880} txt="BOARDS RUB = SQUEAK" col={RED} size={36} /><Tag tt={tt} at={3.6} x={1380} y={880} txt="NO MORE SQUEAK" col={GRN} size={38} /></>}>{(tt) => {
  const pw = eio(tt, 1.8, 3.2), step = Math.max(0, Math.sin(tt * 2.6)), squeak = step * (1 - pw);
  return <>
    <Floorboards n={7} w={0.06} len={0.4} gap={0.004} rub={squeak} tt={tt} powder={pw} />
    <RBox s={[0.5, 0.03, 0.03]} p={[0, -0.02, 0]} r={0.004}>{M.wood({ base: [110, 74, 44] })}</RBox>
    <group position={[0, 0.04 + 0.04 * (1 - step), 0.06]}><RBox s={[0.08, 0.03, 0.18]} r={0.015}><meshPhysicalMaterial color="#b88a5e" roughness={0.45} clearcoat={0.5} /></RBox><RBox s={[0.084, 0.008, 0.184]} p={[0, -0.017, 0]} r={0.003}><meshStandardMaterial color="#c9b79a" roughness={0.9} /></RBox>
      {[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.016, 0.02 - i * 0.02]}><boxGeometry args={[0.05, 0.003, 0.003]} /><meshStandardMaterial color="#f1ece2" /></mesh>)}</group>
    {[0, 1, 2].map((i) => { const u = (tt * 1.6 + i / 3) % 1; return <mesh key={i} position={[0.034, 0.03, -0.12]} rotation={[0, 0, 0]} scale={0.3 + u * 1.5}><torusGeometry args={[0.03, 0.002, 6, 40, PI]} />{M.glow({ col: "#ff5a4a", op: squeak * (1 - u) })}</mesh>; })}
    {Array.from({ length: 20 }, (_, i) => { const u = cl((tt - 1.6 - rn(i, 2) * 1.2) / 0.6); if (u <= 0 || u >= 1) return null;
      return <mesh key={i} position={[0.032 + (rn(i, 3) - 0.5) * 0.01, lerp(0.12, 0.02, u), (rn(i, 4) - 0.5) * 0.3]}><sphereGeometry args={[0.0025, 6, 5]} />{powderMat()}</mesh>; })}
    <group position={[lerp(-0.2, 0.032, eio(tt, 1.2, 1.7)) + 0.4 * eio(tt, 3.4, 3.9), 0.022 + 0.006 * Math.abs(Math.sin(tt * 6)), Math.sin(tt * 3) * 0.1 * cl(tt - 1.6) * (1 - cl(tt - 3.4))]}>
      <RBox s={[0.05, 0.026, 0.08]} r={0.008}><meshStandardMaterial color="#f2d870" roughness={1} bumpMap={tex.paper(3, 3)} bumpScale={8} /></RBox>
      {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[(rn(i, 11) - 0.5) * 0.045, 0.0135, (rn(i, 12) - 0.5) * 0.07]}><sphereGeometry args={[0.0035, 6, 5]} />{powderMat()}</mesh>)}</group>
  </>; }}</Scene3D>;

// ---- 10:27 · NO AL FREEZER: un táper de salsa entra al congelador con escarcha; sale, se descongela y queda aguado y esponjoso con charco ----
export const HFreezeThaw: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.07, 0], az: [-0.2, 0.15], el: [0.4, 0.34], r: [0.52, 0.44], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="MISTAKE TWO" title="DON'T FREEZE IT" col={ICE} /><Tag tt={tt} at={3.4} x={1450} y={860} txt="WATERY AND SPONGY" col={RED} size={40} /></>}>{(tt) => {
  const fr = eio(tt, 0.4, 1.8) * (1 - eio(tt, 2.2, 3.4)), thaw = eio(tt, 2.6, 4.6);
  return <>
    <RBox s={[0.16, 0.06, 0.12]} p={[0, 0.03, 0]} r={0.012}>{M.plastic({ col: "#f4f6f8", op: 0.4 })}</RBox>
    <RBox s={[0.15, 0.045 - 0.01 * thaw, 0.11]} p={[0, 0.024 - 0.005 * thaw, 0]} r={0.01}><meshStandardMaterial color={new THREE.Color("#8a5a2a").lerp(new THREE.Color("#a88a62"), thaw)} roughness={0.4 + 0.5 * thaw} bumpMap={tex.paper(3, 3)} bumpScale={thaw * 14} /></RBox>
    {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.17, 0.062, (rn(i, 3) - 0.5) * 0.13]} rotation={[-PI / 2, 0, rn(i, 4) * 3]} scale={fr}><planeGeometry args={[0.012, 0.012]} /><meshStandardMaterial color="#eaf6ff" transparent opacity={0.8} roughness={0.2} /></mesh>)}
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]} scale={[1, 0.8, 1]}><circleGeometry args={[0.13 * thaw + 0.001, 40]} />{M.water({ col: "#c8b08a", op: 0.55 * thaw })}</mesh>
    <group position={[0.15, 0.15, -0.06]} rotation={[0.2, -0.3, tt * 0.4]} scale={Math.max(0.001, 1.6 * fr)}>
      {Array.from({ length: 6 }, (_, i) => <group key={i} rotation={[0, 0, i * PI / 3]}><RBox s={[0.004, 0.06, 0.004]} p={[0, 0.03, 0]} r={0.0015}>{M.glass({ col: "#d8f0ff", op: 0.85 })}</RBox>
        {[-1, 1].map((k) => <RBox key={k} s={[0.003, 0.018, 0.003]} p={[k * 0.006, 0.042, 0]} rot={[0, 0, -k * 0.8]} r={0.001}>{M.glass({ col: "#d8f0ff", op: 0.85 })}</RBox>)}</group>)}
      <mesh><sphereGeometry args={[0.006, 12, 8]} />{M.glass({ col: "#e8f8ff", op: 0.9 })}</mesh></group>
    <pointLight position={[0.3, 0.035, 0.05]} color="#ffd8a0" intensity={0.9 * thaw} distance={0.7} />
    {Array.from({ length: 6 }, (_, i) => { const q = ((tt * 0.8 + i / 6) % 1); return thaw > 0.2 && <mesh key={"dr" + i} position={[-0.075 + (i % 3) * 0.075, 0.05 - q * 0.048, i < 3 ? 0.061 : -0.061]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.004, 10, 8]} />{M.water({ col: "#d8c8a8", op: 0.85 * thaw })}</mesh>; })}
  </>; }}</Scene3D>;

// ---- 11:02 · EL GUSTO A TIZA: una cuchara de salsa blanca opaca; la llama sube un minuto y la salsa se vuelve brillante y traslúcida ----
export const HChalkyBoil: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" bg="#14100c"
  cam={{ at: [0, 0.05, 0], az: [0.2, -0.05], el: [0.26, 0.2], r: [0.36, 0.3], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="TASTES CHALKY?" title="BOIL ONE MINUTE" col={AMB} /><Tag tt={tt} at={3.6} x={1450} y={860} txt="RAW TASTE GONE" col={GRN} size={42} /></>}>{(tt) => {
  const k = eio(tt, 0.8, 3.6), fl = 0.6 + 0.4 * Math.sin(tt * 11);
  return <>
    <group position={[0, 0.09, 0]} rotation={[0.3, 0, 0.1]}>
      <mesh scale={[1, 0.35, 1.3]}><sphereGeometry args={[0.04, 32, 16, 0, PI * 2, PI / 2, PI / 2]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <RBox s={[0.012, 0.004, 0.14]} p={[0, 0.002, -0.11]} r={0.002}>{M.steel({})}</RBox>
      <mesh position={[0, -0.002, 0]} rotation={[-PI / 2, 0, 0]} scale={[1, 1.3, 1]}><circleGeometry args={[0.036, 32]} />
        <meshPhysicalMaterial color={new THREE.Color("#f4f0e6").lerp(new THREE.Color("#e8c890"), k * 0.5)} roughness={lerp(0.95, 0.08, k)} clearcoat={k} transmission={0.4 * k} thickness={0.01} /></mesh>
    </group>
    <Pot p={[0, -0.1, 0]} s={1.1} col="#f2ead8" thick={k} />
    {Array.from({ length: 28 }, (_, i) => { const q = ((tt * 0.5 + i / 28) % 1), fade = 1 - eio(tt, 2.2, 3.8); return <mesh key={"cl" + i} position={[(rn(i, 21) - 0.5) * 0.14 + Math.sin(tt + i) * 0.01, -0.01 + q * 0.1, (rn(i, 22) - 0.5) * 0.1]} scale={0.5 + q * 1.4}><sphereGeometry args={[0.013, 12, 10]} /><meshBasicMaterial color="#b8b2a8" transparent opacity={0.2 * fade * Math.sin(PI * q)} depthWrite={false} /></mesh>; })}
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[Math.cos(i * 0.63) * 0.07, -0.115, Math.sin(i * 0.63) * 0.07]} scale={[1, 0.6 + 0.8 * k * (0.6 + 0.4 * Math.sin(tt * 9 + i)), 1]}><coneGeometry args={[0.01, 0.03, 8]} />{M.glow({ col: "#4a8aff", op: 0.75 * (0.4 + 0.6 * k) })}</mesh>)}
    <pointLight position={[0, -0.08, 0.05]} color="#ffb06a" intensity={0.6 + 1.2 * k * fl} distance={0.5} />
  </>; }}</Scene3D>;

// ---- 11:16 · PINACLE Y CANASTA: el abanico de naipes se abre en la mesa del salón, con las tazas de café y las barritas de limón ----
export const HPinochle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.03, 0], az: [-0.15, 0.1], el: [0.8, 0.7], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="EVERY THURSDAY" title="PINOCHLE AND CANASTA" col={AMB} /><Tag tt={tt} at={2.8} x={1450} y={880} txt="COFFEE AND BARS" col={GRN} size={40} /></>}>{(tt) => { const f = eio(tt, 0.4, 2.0);
  const C = [["A♥", true], ["K♠", false], ["Q♥", true], ["J♣", false], ["10♦", true], ["9♠", false]] as [string, boolean][];
  return <>
    <RBox s={[0.6, 0.012, 0.4]} p={[0, 0.006, 0]} r={0.004}><meshStandardMaterial color="#2e5a3a" roughness={0.95} /></RBox>
    {C.map(([txt, red], i) => <Naipe key={i} k={"p" + i} txt={txt} red={red} p={[0, 0.0125 + i * 0.0006, 0.03]} rot={[-PI / 2, 0, (i - 2.5) * 0.22 * f]} />)}
    {[[-0.2, -0.1], [0.2, -0.12]].map(([x, z], i) => <group key={i} position={[x, 0.012, z]}>
      <mesh geometry={undefined} position={[0, 0.025, 0]}><cylinderGeometry args={[0.028, 0.022, 0.05, 32]} />{M.porcelain({})}</mesh>
      <mesh position={[0, 0.046, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.025, 32]} /><meshStandardMaterial color="#3a2010" roughness={0.2} /></mesh></group>)}
    <group position={[0.18, 0.012, 0.12]}>{[0, 1, 2].map((i) => <RBox key={i} s={[0.04, 0.018, 0.04]} p={[(i - 1) * 0.045, 0.009, 0]} r={0.004}><meshStandardMaterial color="#f2d65a" roughness={0.6} /></RBox>)}</group>
  </>; }}</Scene3D>;

// ---- 11:34 · TREINTA SEGUNDOS DE SACUDIDA: la bolsa de papel con el mazo adentro se sacude, el reloj cuenta 30 y salen las cartas sueltas y brillantes ----
export const HShakeBag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0.02, 0.08, 0], az: [0.2, -0.1], el: [0.3, 0.24], r: [0.62, 0.54], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="1 TBSP IN A BAG" title="SHAKE 30 SECONDS" col={AMB} /><Tag tt={tt} at={4.4} x={1450} y={860} txt="THEY SLIDE LIKE NEW" col={GRN} size={40} /></>}>{(tt) => {
  const sh = tt > 0.4 && tt < 3.6 ? 1 : 0, s30 = 30 * eio(tt, 0.4, 3.6), out = eio(tt, 3.8, 5.0);
  return <>
    <group position={[-0.08, 0.1 + sh * Math.abs(Math.sin(tt * 14)) * 0.03, 0]} rotation={[sh * Math.sin(tt * 14) * 0.25, 0, sh * Math.cos(tt * 14) * 0.15]}>
      <RBox s={[0.12, 0.18, 0.07]} r={0.006}><meshStandardMaterial color="#b58a5a" roughness={0.95} bumpMap={tex.paper(2, 3)} bumpScale={6} /></RBox>
      <RBox s={[0.12, 0.03, 0.05]} p={[0, 0.1, 0]} rot={[0.3, 0, 0]} r={0.004}><meshStandardMaterial color="#a87a4a" roughness={0.95} /></RBox>
    </group>
    <Puff p={[-0.08, 0.2, 0]} k={sh ? ((tt * 14 / (2 * PI)) % 1) : 0} r={0.08} />
    {sh > 0 && Array.from({ length: 26 }, (_, i) => { const q = ((tt * 14 / (2 * PI) + i / 26) % 1); return <mesh key={"dz" + i} position={[-0.08 + Math.cos(i * 2.4) * (0.07 + q * 0.06), 0.1 + Math.sin(i * 1.7) * 0.08, Math.sin(i * 2.4) * (0.05 + q * 0.04)]}><sphereGeometry args={[0.0055, 8, 6]} />{powderMat("#ffffff", 0.9 * (1 - q))}</mesh>; })}
    {Array.from({ length: 6 }, (_, i) => { const k = cl(out * 6 - i); if (k <= 0) return null;
      return <Naipe key={i} k={"s" + i} txt={["A♠", "K♥", "Q♣", "J♦", "10♥", "2♠"][i]} red={i % 2 === 1} p={[0.02 + i * 0.03 * k, 0.003 + i * 0.0006, -0.01]} rot={[-PI / 2, 0, -0.3 + i * 0.12]} />; })}
    <group position={[0.18, 0.12, -0.08]}><RBox s={[0.09, 0.06, 0.03]} r={0.008}>{M.wood({ base: [120, 80, 50] })}</RBox>
      <DigitDrum v={Math.floor(s30 / 10)} p={[-0.017, 0, 0.016]} r={0.02} w={0.028} /><DigitDrum v={s30 % 10} p={[0.017, 0, 0.016]} r={0.02} w={0.028} /></group>
  </>; }}</Scene3D>;
