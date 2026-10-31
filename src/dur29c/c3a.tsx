// dur29c · bloque A (gancho, el trato, Londres y París): la cloaca debajo de la calle, las 8 postales, las rejillas que tragan la
// ciudad, el tesoro del barro, la marea, los ojos, los túneles, el cementerio en capas, el sótano que cede, las carretas, los seis
// millones y la cuerda. Un mecanismo por componente, objetos grandes, sin carteles para leer.
// v2 (ev1): todo más cerca y más grande, cada uno con su mecanismo a la vista (rejilla que vierte, zaranda, marca roja, plano de París…)
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, pop } from "./kb";
import { Stickman } from "../stickman3d";
import { Bone, Coin, Lantern, PI, Postal, Skull, Tunnel, Water, brickT, cobbleT, sm } from "./c3k";

type UP = { d: number; p: any };
const IMG = (id: string) => `img/dur29c/ag/dur29c_${id}.png`;

// chorro de agua sucia que cae (cilindro que se alarga + salpicadura), siempre montado
const Chorro: React.FC<{ p: number[]; L: number; k: number; col?: string }> = ({ p, L, k, col = "#6a5638" }) =>
  <group position={p as any}>
    <mesh position={[0, -L * k / 2, 0]} scale={[1, sm(k), 1]}><cylinderGeometry args={[0.03, 0.05, L, 12, 1, true]} /><meshStandardMaterial color={col} transparent opacity={0.38 * cl(k * 3)} depthWrite={false} roughness={0.2} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, -L, 0]} rotation={[-PI / 2, 0, 0]} scale={sm(cl(k * 1.5))}><ringGeometry args={[0.03, 0.08, 20]} /><meshBasicMaterial color="#a89070" transparent opacity={0.45 * cl(k * 2)} /></mesh>
  </group>;

// rata: cuerpo, cabeza, cola; los ojos van aparte
const Rata: React.FC<{ p: number[]; s?: number; ry?: number }> = ({ p, s = 1, ry = 0 }) =>
  <group position={p as any} scale={sm(s)} rotation={[0, ry, 0]}>
    <mesh scale={[1.7, 0.85, 1]}><sphereGeometry args={[0.04, 16, 12]} /><meshStandardMaterial color="#5a4a3e" roughness={0.9} /></mesh>
    <mesh position={[0.075, 0.006, 0]} rotation={[0, 0, -0.2]} scale={[1.5, 0.75, 0.75]}><coneGeometry args={[0.024, 0.06, 12]} /><meshStandardMaterial color="#62523f" roughness={0.9} /></mesh>
    <mesh position={[0.11, -0.002, 0]}><sphereGeometry args={[0.006, 8, 6]} /><meshStandardMaterial color="#d89090" /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[0.055, 0.035, k * 0.017]} rotation={[0, PI / 2, 0]}><circleGeometry args={[0.013, 12]} /><meshStandardMaterial color="#c08a80" side={THREE.DoubleSide} /></mesh>)}
    <mesh position={[-0.14, -0.012, 0]} rotation={[0, 0, 1.35]}><cylinderGeometry args={[0.003, 0.007, 0.16, 6]} /><meshStandardMaterial color="#c08a80" /></mesh>
  </group>;

// ---- CloacaCorte · corte de la calle de 1850: arriba el empedrado, el farol y la rueda que pasa; por la rejilla baja un haz de luz
// sobre vos, que caminás con el agua a las rodillas y el farol en la mano; en «monedas» brillan las monedas en el barro ----
const CloacaCorte: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "monedas", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#0d0b0a" key1={[-1.2, 2.4, 2]}
    cam={{ at: [0, 0.32, 0], at1: [0.04, 0.12, 0.05], az: [-0.26, -0.14], el: [0.12, 0.04], r: [2.15, 2.0], fov: 34 }}>{(tt) => {
    const wheel = lerp(-1.4, 1.6, cl(tt / 2.2)), glint = eio(tt, aM, aM + 0.6);
    return <>
      <mesh position={[0, 0.62, -0.05]}><boxGeometry args={[3, 0.1, 0.8]} /><meshStandardMaterial map={cobbleT()} roughness={0.9} /></mesh>
      <mesh position={[0, 0.5, -0.05]}><boxGeometry args={[3, 0.14, 0.8]} /><meshStandardMaterial map={dirtT([70, 54, 40])} roughness={1} /></mesh>
      {[-0.62, 0.66].map((x, i) => <group key={i} position={[x, 0.67, -0.3]}><mesh position={[0, 0.32, 0]}><cylinderGeometry args={[0.014, 0.02, 0.64, 8]} />{M.steel({ col: "#2a2826" })}</mesh>
        <mesh position={[0, 0.66, 0]}><boxGeometry args={[0.08, 0.1, 0.08]} /><meshStandardMaterial color="#ffe0a0" emissive="#ffb050" emissiveIntensity={1.4} /></mesh>
        <pointLight position={[0, 0.64, 0.12]} intensity={1.4} distance={1.4} color="#ffc070" /></group>)}
      <group position={[wheel, 0.85, -0.2]} rotation={[0, 0, -wheel * 4]}><mesh><torusGeometry args={[0.17, 0.014, 8, 32]} />{M.wood({ base: [80, 52, 30] })}</mesh>
        {Array.from({ length: 8 }, (_, i) => <mesh key={i} rotation={[0, 0, (i * PI) / 4]}><boxGeometry args={[0.34, 0.014, 0.014]} />{M.wood({ base: [80, 52, 30] })}</mesh>)}</group>
      {/* la rejilla justo encima tuyo y el haz de luz que baja por ella */}
      <group position={[0.05, 0.675, 0.1]}>{Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[i * 0.03 - 0.09, 0, 0]}><boxGeometry args={[0.012, 0.014, 0.2]} />{M.steel({ col: "#1e1c1a" })}</mesh>)}</group>
      <mesh position={[0.05, 0.12, 0.1]}><cylinderGeometry args={[0.1, 0.24, 1.1, 20, 1, true]} /><meshBasicMaterial color="#ffe2b0" transparent opacity={0.08} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      <spotLight position={[0.05, 0.6, 0.1]} angle={0.45} penumbra={0.8} intensity={5} distance={1.6} color="#ffe6c0" />
      <Tunnel L={3} R={0.42} p={[0, -0.02, -0.05]} />
      <mesh position={[0, -0.25, 0]}><boxGeometry args={[3, 0.1, 0.7]} /><meshPhysicalMaterial color="#5a4a2c" roughness={0.1} clearcoat={1} transparent opacity={0.85} depthWrite={false} /></mesh>
      {[0, 1, 2].map((j) => { const u = (tt * 0.6 + j / 3) % 1; return <mesh key={j} position={[0.05, -0.197, 0.12]} rotation={[-PI / 2, 0, 0]} scale={sm(0.4 + 2.2 * u)}><ringGeometry args={[0.05, 0.058, 32]} /><meshBasicMaterial color="#d8c090" transparent opacity={0.45 * (1 - u)} depthWrite={false} /></mesh>; })}
      <mesh position={[0.19, -0.198, 0.3]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.06, 0.4]} /><meshBasicMaterial color="#ffc070" transparent opacity={0.22 + 0.08 * Math.sin(tt * 2 * PI * 0.7)} depthWrite={false} /></mesh>
      <group position={[0.05, -0.29, 0.12]}><Stickman enSitio escala={0.22} rotY={25} guion={[{ t: 0, accion: "caminar", expr: "decidido" }, { t: aM, accion: "senalar", expr: "sorprendido" }]} semilla={3} contacto={0} color="#5a4c3c" /></group>
      <Lantern p={[0.19, -0.1, 0.22]} s={1.15} on={0.35 + 0.25 * cl(tt / 0.8)} />
      {Array.from({ length: 9 }, (_, i) => <Coin key={i} p={[-0.45 + i * 0.11 + rn(i, 2) * 0.04, -0.235, 0.18 + rn(i, 3) * 0.12]} r={0.02} silver={i === 4} />)}
      <pointLight position={[0.1, -0.1, 0.35]} intensity={3 * glint} distance={1} color="#ffe6a8" />
    </>;
  }}</U3>;
};

// ---- OchoPostales · ocho postales con la foto de cada ciudad entran de a una en abanico sobre la mesa; en «postal» se ilumina el
// frente, en «debajo» se dan vuelta de a una y del otro lado está el trabajo de abajo (la foto del peor oficio) ----
const PFR = ["f03_thames", "p12_queue", "e01_roofs", "v03_island", "f04_brooklyn", "i03_black_sky", "c04_stockyards", "k06_capital"];
const PBK = ["g01_sewer_water", "p11_catacomb_wall", "e02_roof_fire", "v01_furnace", "n01_caisson", "i01_furnace_door", "c02_hooks_rail", "k04_bare_feet"];
const OchoPostales: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "postal", 2.0), aD0 = sec(p, "debajo", 4.0), D = d / 30, aD = Math.min(aD0, Math.max(1.4, D - 4.4)), gap = Math.max(0.3, (D - aD - 0.8) / 8);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="drop" key1={[-0.8, 2.6, 1.6]}
    cam={{ at: [0, 0.05, 0.42], az: [-0.12, 0.08], el: [0.9, 0.78], r: [1.15, 1.0], fov: 34 }}>{(tt) => <>
      {PFR.map((f, i) => { const a = (i - 3.5) * 0.19, k = pop(tt, 0.1 + i * 0.16), fl = eio(tt, aD + i * gap, aD + i * gap + 0.6), lift = Math.sin(PI * fl) * 0.16, drop = (1 - eio(tt, 0.1 + i * 0.16, 0.5 + i * 0.16)) * 0.3;
        return <Postal key={i} src={IMG(f)} back={IMG(PBK[i])} w={0.36} s={k} flip={fl}
          p={[Math.sin(a) * 0.55, 0.02 + i * 0.003 + lift + drop, 0.35 - Math.cos(a) * 0.55 + 0.42]} rot={[-PI / 2, 0, -a]} />; })}
      <spotLight position={[0, 1.8, 0.6]} angle={0.5} penumbra={0.7} intensity={6 + 6 * eio(tt, aP, aP + 0.5)} distance={4} color="#fff0d8" />
    </>}</U3>;
};

// ---- LondresRejillas · la calle de Londres de costado, llena de gente que camina; en «rejilla» las cuatro rejillas vierten chorros
// al túnel y con ellos caen monedas, cucharas y clavos; en «abajo» todo se junta en el barro bajo el farol; el tambor cuenta 2 millones ----
const LondresRejillas: React.FC<UP> = ({ d, p }) => {
  const aR = sec(p, "rejilla", 1.5), aA = sec(p, "abajo", 3.0), GX = [-0.3, 0.3];
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#14110e" key1={[-1, 2.5, 2]}
    cam={{ at: [0, 0.32, 0], az: [-0.24, 0.04], el: [0.16, 0.12], r: [1.9, 1.7], fov: 34 }}>{(tt) => <>
      <mesh position={[0, 0.62, 0]}><boxGeometry args={[2.6, 0.08, 0.6]} /><meshStandardMaterial map={cobbleT()} roughness={0.9} /></mesh>
      <RBox s={[2.6, 0.12, 0.1]} r={0.01} p={[0, 0.72, -0.28]}><meshStandardMaterial map={brickT([110, 70, 50], 4, 1)} roughness={0.9} /></RBox>
      {GX.map((x, j) => <group key={j} position={[x, 0.665, 0.18]} scale={1.6}>{Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[i * 0.026 - 0.065, 0, 0]}><boxGeometry args={[0.012, 0.014, 0.14]} />{M.steel({ col: "#2a2826" })}</mesh>)}</group>)}
      {GX.map((x, j) => <mesh key={j} position={[x, 0.3, 0.18]}><cylinderGeometry args={[0.07, 0.16, 0.6, 16, 1, true]} /><meshBasicMaterial color="#ffe2b0" transparent opacity={0.07} depthWrite={false} side={THREE.DoubleSide} /></mesh>)}
      {GX.map((x, j) => Array.from({ length: 16 }, (_, i) => { const u = (tt * 1.1 + i / 16 + j * 0.3) % 1, on = tt > aR + j * 0.2 + u * 0.55 ? 1 : 0; return <mesh key={j * 16 + i} position={[x + (rn(i + j * 16, 1) - 0.5) * 0.1, 0.6 - u * 0.64, 0.18 + (rn(i + j * 16, 2) - 0.5) * 0.08]} scale={[sm(on), sm(on * 2.2), sm(on)]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#8a7a58" transparent opacity={0.75} roughness={0.2} /></mesh>; }))}
      <Tunnel L={2.6} R={0.34} p={[0, 0.12, -0.05]} />
      <Water w={2.6} dpt={0.6} y={-0.06} col="#2a2216" />
      {Array.from({ length: 30 }, (_, i) => { const j = i % 2, x = GX[j] + (rn(i, 2) - 0.5) * 0.14, a = aR + (i / 30) * Math.max(1.2, d / 30 - aR - 0.8), y = lerp(0.68, -0.05 + rn(i, 4) * 0.02, cl((tt - a) / 0.55));
        const kind = i % 3; return <group key={i} position={[x, y, 0.18 + (rn(i, 5) - 0.5) * 0.12]} rotation={[rn(i, 6) * 6 * cl(tt - a), 0, rn(i, 7) * 4]} visible={tt > a} scale={2}>
          {kind === 0 ? <Coin p={[0, 0, 0]} r={0.022} silver={i % 7 === 0} /> : kind === 1 ? <group><mesh><boxGeometry args={[0.08, 0.008, 0.016]} />{M.steel({ col: "#a8aeb2" })}</mesh><mesh position={[0.05, 0, 0]} scale={[1.4, 0.4, 1]}><sphereGeometry args={[0.016, 10, 6]} />{M.steel({ col: "#a8aeb2" })}</mesh></group> : <mesh><cylinderGeometry args={[0.005, 0.005, 0.07, 6]} />{M.steel({ col: "#6a5a48" })}</mesh>}
        </group>; })}
      <group position={[0.02, -0.08, 0.22]}><Stickman enSitio escala={0.15} rotY={20} guion={[{ t: 0, accion: "caminar", expr: "decidido" }, { t: aA, accion: "senalar", expr: "sorprendido" }]} semilla={9} contacto={0} color="#6a4e38" /></group>
      <Lantern p={[0.14, 0.0, 0.3]} s={1.0} on={0.25 + 0.3 * eio(tt, aA - 0.3, aA + 0.3)} />
      <pointLight position={[0, 0.1, 0.45]} intensity={1.2 + 1.4 * eio(tt, aA, aA + 0.6)} distance={1.6} color="#ffb860" />
      <spotLight position={[0, 1.4, 0.4]} angle={0.6} penumbra={0.7} intensity={1.4} distance={2.4} color="#e8e0d0" />
    </>}</U3>;
};

// ---- TesoroBarro · la zaranda de madera con malla de alambre llena de barro negro; el agua lava el barro, que baja por la malla, y
// quedan los objetos de a uno: clavo, cobre, moneda; en «plata» una cuchara de plata que brilla, en «anillo» un anillo de oro que se levanta ----
const TesoroBarro: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "plata", 3.0), aA = sec(p, "anillo", 4.2);
  return <U3 d={d} bg={p.bg} ground={[40, 32, 24]} mode="wipe" sky="#0b0908" key1={[-0.6, 1.8, 1.4]}
    cam={{ at: [0, 0.16, 0], az: [-0.25, -0.05], el: [0.75, 0.6], r: [1.05, 0.85], fov: 32 }}>{(tt) => {
    const wash = eio(tt, 0.2, Math.max(1.2, aP - 0.3)), shake = Math.sin(tt * 2 * PI * 1.6) * 0.012 * (1 - wash);
    const items = [{ t: 0.6, x: -0.2, z: -0.08 }, { t: 1.2, x: 0.02, z: 0.1 }, { t: 1.8, x: 0.2, z: -0.1 }, { t: aP, x: -0.12, z: 0.12, sil: 1 }, { t: aA, x: 0.14, z: 0.05, ring: 1 }];
    return <group position={[shake, 0, 0]}>
      {/* marco de la zaranda y la malla */}
      {[[0, -0.26, 0.7, 0.04], [0, 0.26, 0.7, 0.04], [-0.35, 0, 0.04, 0.56], [0.35, 0, 0.04, 0.56]].map((b, i) => <RBox key={i} s={[b[2], 0.07, b[3]]} r={0.008} p={[b[0], 0.13, b[1]]}>{M.wood({ base: [120, 84, 50] })}</RBox>)}
      {Array.from({ length: 13 }, (_, i) => <mesh key={"a" + i} position={[-0.3 + i * 0.05, 0.1, 0]}><boxGeometry args={[0.003, 0.003, 0.5]} />{M.steel({ col: "#7a7470" })}</mesh>)}
      {Array.from({ length: 10 }, (_, i) => <mesh key={"b" + i} position={[0, 0.1, -0.225 + i * 0.05]}><boxGeometry args={[0.64, 0.003, 0.003]} />{M.steel({ col: "#7a7470" })}</mesh>)}
      {/* el barro: un bulto que se lava y se achica, y el que cae por la malla */}
      <mesh position={[0, 0.11, 0]} scale={[sm(1 - 0.8 * wash) * 1.35, sm(0.35 * (1 - wash)), sm(1 - 0.8 * wash)]}><sphereGeometry args={[0.24, 24, 14]} /><meshStandardMaterial map={dirtT([40, 32, 24])} roughness={0.5} /></mesh>
      {Array.from({ length: 14 }, (_, i) => { const ph = (tt * 1.4 + rn(i, 1)) % 1; return <mesh key={"g" + i} position={[(rn(i, 2) - 0.5) * 0.5, 0.08 - ph * 0.12, (rn(i, 3) - 0.5) * 0.4]} scale={sm(0.6 * (1 - wash * 0.8))}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#2e2418" roughness={0.4} /></mesh>; })}
      {items.map((it, i) => { const k = eio(tt, it.t, it.t + 0.6), up = it.ring ? 0.12 * eio(tt, aA + 0.3, aA + 1.0) : 0;
        return <group key={i} position={[it.x * (1 - up * 4), 0.115 + up, it.z]} rotation={[it.ring ? 0.8 * (1 - up * 5) : 0, it.ring ? tt * 1.4 : rn(i, 4) * 3, 0]} scale={sm(lerp(0.5, 1, k) * (it.ring ? 1 + 4 * up : 1))}>
          {it.ring ? <mesh><torusGeometry args={[0.04, 0.01, 12, 32]} />{M.brass({ col: "#ecc860" })}</mesh>
            : it.sil ? <group><mesh><boxGeometry args={[0.16, 0.01, 0.022]} />{M.chrome({ col: "#e8ecf0" })}</mesh><mesh position={[0.1, 0, 0]} scale={[1.4, 0.4, 1]}><sphereGeometry args={[0.03, 12, 8]} />{M.chrome({ col: "#e8ecf0" })}</mesh></group>
            : i === 0 ? <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.14, 6]} />{M.steel({ col: "#5a4a3a" })}</mesh>
            : i === 1 ? <RBox s={[0.1, 0.014, 0.05]} r={0.004} p={[0, 0, 0]}>{M.brass({ col: "#b06a3a" })}</RBox> : <Coin p={[0, 0, 0]} r={0.03} rot={[0, 0, 0]} />}
        </group>; })}
      <pointLight position={[0.0, 0.45, 0.3]} intensity={0.8 + 2 * eio(tt, aP, aP + 0.4) + 2.5 * eio(tt, aA, aA + 0.4)} distance={1.4} color="#fff0d0" />
      <Lantern p={[-0.5, 0.2, -0.25]} s={1.3} />
    </group>;
  }}</U3>;
};

// ---- MareaReloj · la boca de la cloaca sobre el Támesis con su escalera de piedra; el reloj de bolsillo grande al lado; en «baja» el
// agua marrón baja y se ven los escalones, en «sube» trepa escalón por escalón hasta tapar la boca y pasa la marca roja ----
const MareaReloj: React.FC<UP> = ({ d, p }) => {
  const aB = sec(p, "baja", 1.0), aS = sec(p, "sube", 3.5);
  return <U3 d={d} bg={p.bg} ground={[70, 56, 40]} mode="wipe" sky="#2a2620" key1={[-1, 2.4, 1.8]}
    cam={{ at: [0.1, 0.3, 0], az: [-0.3, -0.15], el: [0.14, 0.1], r: [1.55, 1.3], fov: 34 }}>{(tt) => {
    const lvl = 0.3 - 0.26 * eio(tt, aB, aB + 0.9) + 0.58 * eio(tt, aS, aS + 1.5), hit = eio(tt, aS + 1.1, aS + 1.5);
    return <>
      <RBox s={[1.4, 0.95, 0.3]} r={0.01} p={[0, 0.47, -0.4]}><meshStandardMaterial map={brickT([100, 70, 52], 3, 2)} roughness={0.95} /></RBox>
      <mesh position={[-0.15, 0.3, -0.24]}><circleGeometry args={[0.2, 32]} /><meshBasicMaterial color="#050403" /></mesh>
      <mesh position={[-0.15, 0.3, -0.245]}><ringGeometry args={[0.2, 0.25, 32]} /><meshStandardMaterial map={brickT([90, 60, 44], 1, 1)} /></mesh>
      {/* la marca roja pintada a la altura del techo de la boca */}
      <mesh position={[-0.15, 0.54, -0.243]}><planeGeometry args={[0.7, 0.025]} /><meshStandardMaterial color="#c8301e" emissive="#c8301e" emissiveIntensity={0.3 + 1.2 * hit} /></mesh>
      {Array.from({ length: 6 }, (_, i) => <RBox key={i} s={[0.5, 0.05, 0.1]} r={0.005} p={[-0.15, 0.03 + i * 0.05, 0.25 - i * 0.1]}><meshStandardMaterial map={dirtT([110, 104, 96])} roughness={0.9} /></RBox>)}
      <mesh position={[0, lvl, 0.3]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#5e4c30" roughness={0.45} metalness={0.1} /></mesh>
      <mesh position={[0, lvl + 0.004, -0.24]}><boxGeometry args={[1.4, 0.014, 0.02]} /><meshStandardMaterial color="#d8ccb0" roughness={0.8} /></mesh>
      {Array.from({ length: 14 }, (_, i) => <mesh key={"f" + i} position={[-0.65 + i * 0.1, lvl + 0.006, -0.2 + 0.02 * Math.sin(tt * 1.4 + i)]} scale={[1.4, 0.4, 1]}><sphereGeometry args={[0.025, 8, 6]} /><meshStandardMaterial color="#c8bca0" roughness={0.9} /></mesh>)}
      <group position={[0.36, 0.5, 0.05]} rotation={[0.12, -0.35, 0]} scale={0.8}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.04, 40]} />{M.brass({ col: "#c89a4a" })}</mesh>
        <mesh position={[0, 0.215, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.03, 0.008, 8, 20]} />{M.brass({ col: "#c89a4a" })}</mesh>
        <mesh position={[0, 0, 0.022]}><circleGeometry args={[0.18, 40]} /><meshStandardMaterial color="#f2ead8" /></mesh>
        {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i * PI / 6) * 0.155, Math.cos(i * PI / 6) * 0.155, 0.024]}><boxGeometry args={[0.006, 0.022, 0.002]} /><meshBasicMaterial color="#2a2018" /></mesh>)}
        <mesh position={[0, 0, 0.026]} rotation={[0, 0, -tt * 1.6]}><boxGeometry args={[0.008, 0.28, 0.003]} /><meshBasicMaterial color="#1a1410" /></mesh>
        <mesh position={[0, 0, 0.028]} rotation={[0, 0, -tt * 0.14]}><boxGeometry args={[0.012, 0.18, 0.003]} /><meshBasicMaterial color="#1a1410" /></mesh>
      </group>
      <pointLight position={[0.3, 0.8, 0.6]} intensity={1.6} distance={2.4} color="#ffe2b8" />
    </>;
  }}</U3>;
};

// ---- OjosPared · el farol barre el borde del túnel y aparecen ratas enteras con los ojos encendidos de a pares; en «atacado» se
// adelantan hacia vos y el farol tiembla ----
const OjosPared: React.FC<UP> = ({ d, p }) => {
  const aA = sec(p, "atacado", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#070605" key1={[-0.5, 1.5, 1]}
    cam={{ at: [0, -0.08, 0], az: [-0.12, 0.08], el: [0.1, 0.06], r: [1.0, 0.8], fov: 34 }}>{(tt) => {
    const sweep = lerp(-0.5, 0.5, eio(tt, 0.2, aA)), adv = eio(tt, aA, aA + 0.9);
    return <>
      <Tunnel L={2.4} R={0.45} p={[0, 0.05, -0.1]} col={[80, 52, 36]} />
      <Water w={2.4} dpt={0.5} y={-0.25} p={[0, 0, 0.15]} col="#1a1610" />
      {/* la cornisa de ladrillo donde están las ratas */}
      <mesh position={[0, -0.24, -0.2]}><boxGeometry args={[2.4, 0.04, 0.2]} /><meshStandardMaterial map={brickT([70, 46, 32], 6, 1)} roughness={0.95} /></mesh>
      {Array.from({ length: 14 }, (_, i) => { const x = -0.9 + (i / 13) * 1.8 + (rn(i, 1) - 0.5) * 0.05, lit = cl(1 - Math.abs(x - sweep) * 2.2) + adv, z = -0.2 + adv * (0.15 + 0.15 * rn(i, 3));
        return <group key={i} position={[x, -0.19, z]}>
          <Rata p={[0, 0, 0]} s={1.6 + 0.4 * rn(i, 4)} ry={-PI / 2 + (rn(i, 5) - 0.5) * 0.8} />
          {[-1, 1].map((s) => <mesh key={s} position={[s * 0.016, 0.03, 0.08]}><sphereGeometry args={[0.016, 10, 8]} /><meshBasicMaterial color="#ffd070" transparent opacity={cl(0.25 + lit)} toneMapped={false} /></mesh>)}
        </group>; })}
      <Lantern p={[sweep * 0.5 + 0.02 * Math.sin(tt * 2 * PI * 1.8) * adv, -0.02, 0.35]} s={0.7} on={0.32} />
      <pointLight position={[sweep * 0.6, 0.05, 0.25]} intensity={2.2} distance={1.1} color="#ffc878" />
      <hemisphereLight args={["#8a7a6a", "#1a1410", 0.5]} />
    </>;
  }}</U3>;
};

// ---- TunelesForma · la maqueta de la cloaca enterrada en tierra: un caño que corre parejo y se abre en dos; en «sube» se ilumina el
// ramal que trepa, en «baja» el que se hunde y en «sale» la boca de salida con luz de día; el tosher camina por adentro ----
const TunelesForma: React.FC<UP> = ({ d, p }) => {
  const aS = sec(p, "sube", 1.5), aB = sec(p, "baja", 3.0), aX = sec(p, "sale", 4.5);
  const pipe = (k: string, a: number[], b: number[], on: number, col: string) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    return <group key={k} position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]} rotation={[0, 0, Math.atan2(dy, dx) - PI / 2]}>
      <mesh><cylinderGeometry args={[0.09, 0.09, L, 24, 1, true, 0, PI]} /><meshStandardMaterial map={brickT([120, 74, 52], 1, 2)} side={THREE.DoubleSide} roughness={0.9} /></mesh>
      <mesh position={[0, 0, -0.06]}><cylinderGeometry args={[0.02, 0.02, L, 10]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.2 + 2.6 * on} /></mesh></group>; };
  const wy = 0.3;
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="drop" key1={[-1, 2.4, 2]}
    cam={{ at: [-0.1, 0.35, 0], at1: [0.3, 0.45, 0], az: [-0.3, 0.15], el: [0.18, 0.14], r: [1.7, 1.45], fov: 34 }}>{(tt) => <>
      {/* el bloque de tierra en el que están cavados */}
      <mesh position={[0.1, 0.4, -0.12]}><boxGeometry args={[2.4, 1.4, 0.2]} /><meshStandardMaterial map={dirtT([78, 60, 44])} roughness={1} /></mesh>
      <mesh position={[0.1, -0.32, 0]}><boxGeometry args={[2.4, 0.1, 0.5]} /><meshStandardMaterial map={dirtT([66, 50, 36])} roughness={1} /></mesh>
      {pipe("m", [-0.9, 0.3], [0.0, 0.3], 0.5, "#d8b070")}
      {pipe("u", [0.0, 0.3], [0.7, 0.75], eio(tt, aS, aS + 0.5), "#f0c070")}
      {pipe("d", [0.0, 0.3], [0.7, -0.15], eio(tt, aB, aB + 0.5), "#70a8f0")}
      {pipe("x", [0.7, 0.75], [1.05, 0.95], eio(tt, aX, aX + 0.5), "#fff4d8")}
      <mesh position={[1.1, 0.98, 0]}><circleGeometry args={[0.12, 28]} /><meshBasicMaterial color="#d8ecff" toneMapped={false} transparent opacity={0.15 + 0.85 * eio(tt, aX, aX + 0.6)} /></mesh>
      <pointLight position={[1.0, 1.0, 0.3]} intensity={0.3 + 3 * eio(tt, aX, aX + 0.6)} distance={1.6} color="#dceaff" />
      <group position={[lerp(-0.8, -0.05, cl(tt / Math.max(1, aS))), wy - 0.085, 0.0]}><Stickman enSitio escala={0.13} rotY={90} guion={[{ t: 0, accion: "caminar", expr: "decidido" }, { t: aS, accion: "mirar_reloj", expr: "pensativo" }]} semilla={5} contacto={0} color="#5a4c3c" /></group>
      <Lantern p={[lerp(-0.76, -0.01, cl(tt / Math.max(1, aS))), wy - 0.02, 0.05]} s={0.6} />
    </>}</U3>;
};

// ---- CementerioCapas · corte del suelo del cementerio con la calle arriba: capa sobre capa de tierra y huesos sube hasta pasar el nivel
// de la calle; la regla de madera al costado marca los metros y en «dos» llega a 2 m con el vecino parado arriba de todo ----
const CementerioCapas: React.FC<UP> = ({ d, p }) => {
  const aD = sec(p, "dos", 3.0);
  return <U3 over={(tt) => <Drums v={2 * (0.35 + 0.65 * eio(tt, 0.3, Math.max(aD + 0.6, d / 30 - 0.5)))} n={1} x={1500} y={120} s={1.1} unit="m" op={1} />} d={d} bg={p.bg} ground={null} mode="wipe" sky="#120f0c" key1={[-1, 2.4, 2]}
    cam={{ at: [0, 0.35, 0], at1: [0, 0.6, 0], az: [-0.32, 0.1], el: [0.1, 0.14], r: [1.75, 1.6], fov: 34 }}>{(tt) => {
    const layers = 8, grow = 0.35 + 0.65 * eio(tt, 0.3, Math.max(aD + 0.6, d / 30 - 0.5)), top = 0.04 + layers * 0.12 * grow;
    return <>
      {/* la calle a la izquierda, a nivel 0,5: el cementerio la pasa */}
      <mesh position={[-1.25, 0.48, 0]}><boxGeometry args={[0.8, 0.06, 0.6]} /><meshStandardMaterial map={cobbleT()} /></mesh>
      <mesh position={[-1.25, 0.22, 0]}><boxGeometry args={[0.8, 0.46, 0.6]} /><meshStandardMaterial map={dirtT([90, 72, 54])} roughness={1} /></mesh>
      <RBox s={[0.12, 1.1, 0.62]} r={0.01} p={[-0.82, 0.55, 0]}><meshStandardMaterial map={brickT([150, 140, 120], 1, 3)} roughness={0.95} /></RBox>
      <mesh position={[0, 0.0, 0]}><boxGeometry args={[1.5, 0.04, 0.58]} /><meshStandardMaterial map={dirtT([60, 48, 36])} /></mesh>
      {Array.from({ length: layers }, (_, l) => { const on = cl(grow * layers - l); return <group key={l} position={[0, 0.08 + l * 0.12, 0]} scale={[1, sm(on), 1]}>
        <mesh><boxGeometry args={[1.5, 0.12, 0.55]} /><meshStandardMaterial map={dirtT([92 - l * 4, 70 - l * 3, 50])} roughness={1} /></mesh>
        {Array.from({ length: 4 }, (_, i) => <Bone key={i} p={[-0.55 + i * 0.36 + rn(l * 5 + i, 1) * 0.08, 0.0, 0.285]} rot={[0, 0, rn(l * 5 + i, 2) * 3]} s={1.3} />)}
        <Skull p={[-0.5 + rn(l, 3) * 1.0, 0.01, 0.28]} s={1.1} />
      </group>; })}
      <group position={[lerp(-0.6, 0.45, cl(tt / (d / 30))), top, 0.05]}><Stickman enSitio escala={0.13} rotY={90} guion={[{ t: 0, accion: "caminar", expr: "asqueado" }]} semilla={9} contacto={0} color="#4a3e34" /></group>
      {/* la regla con marcas cada 25 cm y la franja roja que sube */}
      <group position={[0.88, 0, 0.12]}><mesh position={[0, 0.55, 0]}><boxGeometry args={[0.06, 1.1, 0.03]} />{M.wood({ base: [190, 150, 90] })}</mesh>
        {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.012, 0.08 + i * 0.12, 0.017]}><boxGeometry args={[i % 4 === 0 ? 0.05 : 0.03, 0.006, 0.002]} /><meshBasicMaterial color="#2a1c10" /></mesh>)}
        <mesh position={[0.02, (top) / 2, 0.018]} scale={[1, sm(top), 1]}><boxGeometry args={[0.02, 1, 0.004]} /><meshStandardMaterial color="#d8402a" emissive="#d8402a" emissiveIntensity={0.6} /></mesh></group>
      <pointLight position={[0.3, 1.2, 0.8]} intensity={2} distance={3} color="#ffe2c0" />
    </>;
  }}</U3>;
};

// ---- SotanoCede · el sótano de la casa vecina: barriles, estantes con botellas y una vela; la pared del fondo se abomba, se raja y
// en «cede» se abre y entra una avalancha de tierra con huesos; la vela se cae y sube el polvo ----
const SotanoCede: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "cede", 2.5);
  return <U3 d={d} bg={p.bg} ground={[90, 74, 58]} mode="wipe" sky="#0e0b09" key1={[-0.6, 2, 1.6]}
    cam={{ at: [0, 0.32, 0], az: [-0.35, -0.2], el: [0.12, 0.1], r: [1.45, 1.2], fov: 34 }}>{(tt) => {
    const bulge = eio(tt, 0.3, aC) * 0.06, br = eio(tt, aC, aC + 0.8), shake = Math.sin(tt * 2 * PI * 1.8) * 0.004 * eio(tt, aC - 1, aC) * (1 - br);
    return <group position={[shake, 0, 0]}>
      {Array.from({ length: 30 }, (_, i) => { const c = i % 6, r = Math.floor(i / 6), x = -0.5 + c * 0.2, y = 0.08 + r * 0.16, cen = Math.max(0, 1 - Math.hypot(x, y - 0.4) * 2.2);
        return <RBox key={i} s={[0.19, 0.15, 0.12]} r={0.01} p={[x + br * cen * x * 0.6, y - br * cen * 0.25, -0.3 + bulge * cen + br * cen * 0.5]} rot={[br * cen * rn(i, 1), 0, br * cen * (rn(i, 2) - 0.5)]}>
          <meshStandardMaterial map={brickT([130 + rn(i, 3) * 20, 92, 70], 1, 1)} roughness={0.95} /></RBox>; })}
      {/* barriles y estante a los costados */}
      {[-0.62, -0.42].map((x, i) => <group key={i} position={[x, 0.13, 0.05 + i * 0.12]}><mesh><cylinderGeometry args={[0.09, 0.09, 0.26, 20]} />{M.wood({ base: [110, 70, 40] })}</mesh>
        {[-0.08, 0.08].map((y) => <mesh key={y} position={[0, y, 0]}><torusGeometry args={[0.092, 0.006, 6, 24]} />{M.steel({ col: "#3a3632" })}</mesh>)}</group>)}
      <group position={[0.62, 0, -0.05]}>{[0.18, 0.4].map((y, j) => <group key={j}><RBox s={[0.3, 0.02, 0.14]} r={0.004} p={[0, y, 0]}>{M.wood({ base: [100, 68, 40] })}</RBox>
        {Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[-0.1 + i * 0.065, y + 0.06, 0]} rotation={[0, 0, br * (rn(i + j * 4, 1) - 0.5) * 1.4]}><cylinderGeometry args={[0.018, 0.02, 0.1, 10]} />{M.glass({ col: "#3a5a2a" })}</mesh>)}</group>)}</group>
      {Array.from({ length: 22 }, (_, i) => <group key={i} visible={br > 0.05} position={[(rn(i, 1) - 0.5) * 0.7 * br, 0.05 + rn(i, 2) * 0.4 * (1 - br * 0.6), -0.2 + br * (0.25 + rn(i, 3) * 0.35)]}>
        {i % 4 === 0 ? <Skull p={[0, 0, 0]} s={1.1} /> : <Bone p={[0, 0, 0]} rot={[rn(i, 4) * 3, rn(i, 5) * 3, 0]} s={1.2} />}</group>)}
      <mesh position={[0, 0.02, -0.05]} scale={[sm(br) * 1.3, sm(br) * 0.3, sm(br) * 1.0]}><sphereGeometry args={[0.4, 20, 10]} /><meshStandardMaterial map={dirtT([70, 54, 40])} roughness={1} /></mesh>
      {Array.from({ length: 10 }, (_, i) => { const k = eio(tt, aC + 0.1 + i * 0.05, aC + 1.6 + i * 0.05); return <mesh key={"p" + i} position={[(rn(i, 6) - 0.5) * 0.8, 0.1 + k * 0.35 * rn(i, 7), -0.1 + k * 0.3]} scale={sm(0.08 + k * 0.18)}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#9a8a72" transparent opacity={0.3 * Math.sin(PI * k)} depthWrite={false} /></mesh>; })}
      <group position={[0.3, 0.08, 0.2]} rotation={[0, 0, -PI / 2 * eio(tt, aC + 0.3, aC + 0.7)]}><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.014, 0.014, 0.12, 10]} /><meshStandardMaterial color="#f0e8d0" /></mesh>
        <mesh position={[0, 0.13, 0]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.009, 8, 6]} />{M.glow({ col: "#ffc860", op: 1 - eio(tt, aC + 0.5, aC + 0.9) })}</mesh></group>
      <pointLight position={[0.3, 0.25, 0.25]} intensity={1.8 * (1 - eio(tt, aC + 0.5, aC + 0.9)) + 0.4} distance={1.5} color="#ffb860" />
    </group>;
  }}</U3>;
};

// ---- CarretasNoche · el plano de París sobre la mesa a la luz de una vela: del cementerio sale una línea roja que se dibuja hasta las
// canteras del sur y por ella avanzan las carretas negras; en «curas» se encienden velitas detrás: la procesión ----
const ROUTE = [[-0.32, -0.18], [-0.18, -0.08], [-0.05, 0.02], [0.05, 0.12], [0.2, 0.18], [0.34, 0.24]];
const routeAt = (u: number) => { const L = ROUTE.length - 1, s = Math.min(L - 0.0001, Math.max(0, u) * L), i = Math.floor(s), f = s - i; return [lerp(ROUTE[i][0], ROUTE[i + 1][0], f), lerp(ROUTE[i][1], ROUTE[i + 1][1], f)]; };
const mapaT = () => tex.text("paris1786", 1024, 768, (g) => {
  g.fillStyle = "#c8b48a"; g.fillRect(0, 0, 1024, 768);
  for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(120,90,50,${0.05 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 1024, rn(i, 3) * 768, 3, 3); }
  g.strokeStyle = "rgba(90,70,45,.45)"; g.lineWidth = 2;
  for (let i = 0; i < 60; i++) { g.beginPath(); const x = rn(i, 4) * 1024, y = rn(i, 5) * 768; g.moveTo(x, y); g.lineTo(x + (rn(i, 6) - 0.5) * 300, y + (rn(i, 7) - 0.5) * 300); g.stroke(); }
  g.strokeStyle = "#6a8aa8"; g.lineWidth = 26; g.beginPath(); g.moveTo(0, 300); g.bezierCurveTo(300, 200, 600, 420, 1024, 330); g.stroke();
  g.fillStyle = "rgba(60,40,20,.55)"; g.fillRect(170, 520, 90, 70); // el cementerio
  g.fillStyle = "rgba(40,30,20,.35)"; for (let i = 0; i < 26; i++) { g.beginPath(); g.ellipse(700 + rn(i, 8) * 260, 60 + rn(i, 9) * 200, 14, 9, 0, 0, 7); g.fill(); } // las canteras
});
const CarretasNoche: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "curas", 2.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="drop" key1={[-0.6, 2.2, 1.2]}
    cam={{ at: [0, 0.05, 0], az: [-0.15, 0.1], el: [0.95, 0.75], r: [1.15, 0.9], fov: 34 }}>{(tt) => {
    const u = eio(tt, 0.2, Math.max(1.5, aC + 0.4));
    return <>
      <mesh position={[0, 0.012, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.96, 0.72]} /><meshStandardMaterial map={mapaT()} roughness={0.85} /></mesh>
      {ROUTE.slice(0, -1).map((a, i) => { const b = ROUTE[i + 1], f = cl(u * (ROUTE.length - 1) - i); if (f <= 0) return null; const ex = lerp(a[0], b[0], f), ez = lerp(a[1], b[1], f), L = Math.hypot(ex - a[0], ez - a[1]);
        return <mesh key={i} position={[(a[0] + ex) / 2, 0.018, -(a[1] + ez) / 2]} rotation={[0, Math.atan2(ez - a[1], ex - a[0]), PI / 2]}><cylinderGeometry args={[0.006, 0.006, Math.max(0.001, L), 8]} /><meshStandardMaterial color="#b8281a" emissive="#b8281a" emissiveIntensity={0.5} /></mesh>; })}
      {Array.from({ length: 4 }, (_, i) => { const ui = u - i * 0.1; if (ui <= 0.02) return null; const q = routeAt(ui), q2 = routeAt(ui + 0.02);
        return <group key={i} position={[q[0], 0.04, -q[1]]} rotation={[0, Math.atan2(q2[1] - q[1], q2[0] - q[0]), 0]} scale={3}>
          <RBox s={[0.06, 0.016, 0.036]} r={0.003} p={[0, 0.004, 0]}>{M.wood({ base: [110, 74, 44] })}</RBox>
          <mesh position={[0, 0.012, 0]} rotation={[PI / 2, 0, 0]} scale={[1, 1, 0.8]}><cylinderGeometry args={[0.022, 0.022, 0.034, 14, 1, true, 0, PI]} /><meshStandardMaterial color="#4a3a2a" roughness={0.95} side={THREE.DoubleSide} /></mesh>
          {[-1, 1].map((sd) => <group key={sd} position={[0, -0.004, sd * 0.021]}><mesh><torusGeometry args={[0.012, 0.0025, 6, 16]} />{M.wood({ base: [140, 100, 60] })}</mesh>
            {[0, 1].map((k) => <mesh key={k} rotation={[0, 0, k * PI / 2]}><boxGeometry args={[0.024, 0.002, 0.002]} />{M.wood({ base: [140, 100, 60] })}</mesh>)}</group>)}
          <mesh position={[0.036, 0.016, 0]}><sphereGeometry args={[0.004, 8, 6]} />{M.glow({ col: "#ffd080" })}</mesh>
        </group>; })}
      {Array.from({ length: 8 }, (_, i) => { const q = routeAt(cl(u - 0.45 - i * 0.05)), k = eio(tt, aC + i * 0.12, aC + i * 0.12 + 0.3);
        return <mesh key={"v" + i} position={[q[0] - 0.02, 0.03, -q[1] + 0.02]} scale={sm(k)}><sphereGeometry args={[0.007, 8, 6]} />{M.glow({ col: "#ffd890" })}</mesh>; })}
      {/* la vela sobre la mesa */}
      <group position={[-0.42, 0, 0.3]}><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.025, 0.025, 0.12, 14]} /><meshStandardMaterial color="#efe6cf" /></mesh>
        <mesh position={[0, 0.135, 0]} scale={[1, 1.7 + 0.1 * Math.sin(tt * 2 * PI * 1.5), 1]}><sphereGeometry args={[0.01, 8, 6]} />{M.glow({ col: "#ffc060" })}</mesh>
        <pointLight position={[0, 0.16, 0]} intensity={1.4} distance={1.6} color="#ffb860" /></group>
      <hemisphereLight args={["#e8d8b8", "#3a2a1a", 0.6]} />
      <mesh position={[0.34, 0.016, -0.24]} rotation={[-PI / 2, 0, 0]} scale={sm(eio(tt, 0.4, 1.0))}><ringGeometry args={[0.04, 0.055, 28]} /><meshStandardMaterial color="#b8281a" emissive="#b8281a" emissiveIntensity={0.5} /></mesh>
    </>;
  }}</U3>;
};

// ---- SeisMillones · la pared de calaveras y huesos se arma fila por fila en cascada, como ladrillos; el contador llega a 6 millones en
// «seis» y la cámara sube y se aleja: la pared sigue y sigue por el túnel ----
const SeisMillones: React.FC<UP> = ({ d, p }) => {
  const aS = sec(p, "seis", 2.5);
  return <U3 d={d} bg={p.bg} ground={[58, 50, 42]} mode="wipe" sky="#0d0b09" key1={[-0.6, 2, 1.4]}
    cam={{ at: [0, 0.32, 0], at1: [0.55, 0.42, -0.35], az: [-0.5, -0.72], el: [0.08, 0.26], r: [0.9, 1.55], fov: 34 }}>{(tt) => {
    const rows = 8, cols = 22, k = cl(tt / Math.max(1, Math.max(aS, d / 30 - 0.4)));
    return <>
      {Array.from({ length: rows * cols }, (_, i) => { const r = Math.floor(i / cols), c = i % cols, on = cl((k * (cols + rows * 3) - c - r * 3) / 2); const x = -0.2 + c * 0.1, y = 0.06 + r * 0.1;
        return r % 2 === 0 ? <Skull key={i} p={[x, y + (1 - on) * 0.4, -0.3 - c * 0.02]} rot={[0, -0.6, 0]} s={on * 0.85} />
          : <Bone key={i} p={[x, y + (1 - on) * 0.4, -0.28 - c * 0.02]} rot={[0, PI / 2 - 0.6, 0]} s={on} />; })}
      <pointLight position={[0.2, 0.5, 0.4]} intensity={2.6} distance={2.2} color="#ffd090" />
      <pointLight position={[1.2, 0.6, 0.2]} intensity={2.0} distance={2.4} color="#ffb070" />
      <pointLight position={[2.0, 0.6, -0.2]} intensity={1.4} distance={2} color="#ff9a50" />
    </>;
  }}</U3>;
};

// ---- CuerdaSalida · a ras del suelo entre paredes altas y oscuras de cantera: la cuerda gruesa se desenrolla detrás del caminante;
// en «doscientos» la cámara sube y el laberinto no termina; en «queda» aparece uno sin cuerda, parado, perdido ----
const CuerdaSalida: React.FC<UP> = ({ d, p }) => {
  const aD = sec(p, "doscientos", 2.5), aQ = sec(p, "queda", 4.5);
  const path = [[-0.9, -0.5], [-0.5, -0.5], [-0.5, 0.0], [0.0, 0.0], [0.0, 0.4], [0.5, 0.4], [0.5, -0.2], [0.9, -0.2]];
  const segAt = (u: number) => { const L = path.length - 1, s = Math.min(L - 0.0001, u * L), i = Math.floor(s), f = s - i; return [lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f)]; };
  return <U3 d={d} bg={p.bg} ground={[60, 54, 46]} mode="drop" sky="#0a0908" key1={[-0.5, 2.4, 0.5]}
    cam={{ at: [-0.6, 0.05, -0.4], at1: [0, 0, 0], az: [-0.9, 0.2], el: [0.5, 1.15], r: [1.3, 3.0], fov: 36 }}>{(tt) => {
    const u = 0.12 + 0.88 * cl(tt / Math.max(1.5, aD + 1)), pos = segAt(u);
    return <>
      {Array.from({ length: 64 }, (_, i) => { const gx = (i % 8) - 3.5, gz = Math.floor(i / 8) - 3.5; if (rn(i, 3) < 0.35) return null;
        return <RBox key={i} s={rn(i, 1) > 0.5 ? [0.42, 0.34, 0.06] : [0.06, 0.34, 0.42]} r={0.01} p={[gx * 0.42, 0.17, gz * 0.42 + 0.21]}><meshStandardMaterial map={dirtT([120, 112, 98])} roughness={0.95} /></RBox>; })}
      {path.slice(0, -1).map((a, i) => { const b = path[i + 1], f0 = i / (path.length - 1), f = cl((u - f0) * (path.length - 1)); if (f <= 0) return null; const ex = lerp(a[0], b[0], f), ez = lerp(a[1], b[1], f), L = Math.hypot(ex - a[0], ez - a[1]);
        return <mesh key={i} position={[(a[0] + ex) / 2, 0.02, (a[1] + ez) / 2]} rotation={[0, -Math.atan2(ez - a[1], ex - a[0]), PI / 2]}><cylinderGeometry args={[0.026, 0.026, Math.max(0.001, L), 8]} /><meshStandardMaterial color="#f0d098" emissive="#d09030" emissiveIntensity={1.4} /></mesh>; })}
      <group position={[pos[0], 0.0, pos[1]]}><Stickman enSitio escala={0.09} rotY={0} guion={[{ t: 0, accion: "caminar", expr: "decidido" }]} semilla={7} contacto={0} color="#4a4038" />
        <Lantern p={[0.03, 0.16, 0.02]} s={0.8} /><pointLight position={[0, 0.4, 0.1]} intensity={2.2} distance={1.6} color="#ffc070" /></group>
      <group position={[0.9, 0.0, 0.7]} scale={sm(eio(tt, aQ, aQ + 0.5))}><Stickman escala={0.09} rotY={-130} guion={[{ t: 0, accion: "mirar_reloj", expr: "asustado" }]} semilla={8} contacto={0} color="#4a4038" /></group>
      <pointLight position={[0.9, 0.3, 0.7]} intensity={0.0001 + 1.2 * eio(tt, aQ, aQ + 0.5)} distance={1} color="#ffb070" />
      <hemisphereLight args={["#a89a88", "#1a1612", 0.55]} />
    </>;
  }}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { CloacaCorte, OchoPostales, LondresRejillas, TesoroBarro, MareaReloj, OjosPared, TunelesForma, CementerioCapas, SotanoCede, CarretasNoche, SeisMillones, CuerdaSalida };
