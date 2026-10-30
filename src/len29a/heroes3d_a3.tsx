// len29a · 3ª vuelta en 3D (tanda 3): cinta, lupa, vela, repisa, despiece, cuarto de vuelta, enfriamiento.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, RED, H } from "./hkit";
import { Hair, M, RBox, Scene3D, cl, curve, eio, hexNutG, lerp, phys, rn, tex, threadG, tubeG } from "./h3d";

const PI = Math.PI;
const RG = new Map<string, THREE.BufferGeometry>();
// aro extruido (corte de caño con capa de grasa), cacheado por radios redondeados
const ringG = (ro: number, ri: number, d: number) => { const k = `${ro.toFixed(3)}|${ri.toFixed(3)}|${d}`; const c = RG.get(k); if (c) return c;
  const s = new THREE.Shape(); s.absarc(0, 0, ro, 0, PI * 2, false); const hp = new THREE.Path(); hp.absarc(0, 0, ri, 0, PI * 2, true); s.holes.push(hp);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 48 }); g.translate(0, 0, -d / 2); RG.set(k, g); return g; };

// ---- 4:31 · LA CINTA MÉTRICA: la hoja amarilla baja por el caño de vidrio, pega en el tapón y se frena; la franja de 6 a 18" se ilumina ----
const tapeTex = () => tex.text("tape", 1024, 32, (g) => {
  g.fillStyle = "#f2c230"; g.fillRect(0, 0, 1024, 32); g.fillStyle = "#1b1b1b";
  for (let i = 0; i < 64; i++) g.fillRect(i * 16, 0, 2, i % 4 ? 10 : 20);
});
const RP = [[-0.62, 0.42, 0], [-0.62, 0.2, 0], [-0.56, 0.12, 0], [-0.44, 0.1, 0], [0.62, 0.08, 0]];
const rulerTex = () => tex.text("regla_6_18", 1024, 64, (g) => {
  g.fillStyle = "#e9c46a"; g.fillRect(0, 0, 1024, 64); g.fillStyle = "#2a1d0e"; g.font = "bold 22px Arial"; g.textAlign = "center";
  for (let i = 0; i <= 48; i++) { const x = 12 + i * 20.8; g.fillRect(x - 1, 0, 2, i % 4 === 0 ? 30 : i % 2 ? 12 : 20); if (i % 4 === 0) g.fillText(String(i / 4 + 6), x, 56); }
});
export const HRuler: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="tile"
  cam={{ at: [-0.08, 0.17, 0], at1: [0.06, 0.13, 0], az: [0.42, 0.12], el: [0.3, 0.22], r: [1.62, 1.32], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="SIX TO EIGHTEEN INCHES" col={AMB} />}>{(tt) => {
  const c = curve(RP), ext = eio(tt, 0.8, 3.2), stop = tt > 3.2 ? 0.012 * Math.sin((tt - 3.2) * 18) * Math.exp(-(tt - 3.2) * 4) : 0;
  const u1 = lerp(0.02, 0.73, ext) + stop, band = cl(phys(tt, 3.6, 5, 0.6));
  const tp: number[][] = []; for (let i = 0; i <= 30; i++) { const p = c.getPointAt(u1 * i / 30); tp.push([p.x, p.y, p.z]); }
  return <>
    {/* la pileta arriba a la izquierda, el caño grande de vidrio que baja y corre por el piso */}
    <mesh position={[-0.62, 0.45, 0]}><cylinderGeometry args={[0.16, 0.05, 0.08, 48, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
    <mesh geometry={tubeG("rglass", RP, 0.055, 160, 32)}>{M.glass({ op: 0.22 })}</mesh>
    {/* el tapón de grasa donde se frena */}
    <mesh position={[0.34, 0.083, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.12, 36]} />{M.grease({ col: "#c9a75a" })}</mesh>
    {/* la hoja de la cinta: cinta amarilla con marcas que sigue la curva del caño */}
    <mesh geometry={tubeG("tape" + Math.round(u1 * 200), tp, 0.018, 60, 4)}><meshStandardMaterial map={tapeTex()} roughness={0.4} metalness={0.3} /></mesh>
    <RBox s={[0.12, 0.12, 0.06]} r={0.02} p={[-0.84, 0.48, 0]}>{M.plastic({ col: "#f2c230" })}</RBox>
    <mesh position={[-0.84, 0.48, 0.031]}><cylinderGeometry args={[0.035, 0.035, 0.004, 32]} />{M.chrome()}</mesh>
    {/* la franja de 6 a 18 pulgadas, luz sobre el caño */}
    <mesh position={[-0.19 + 0.25 * band, 0.088, 0]} rotation={[0, 0, PI / 2 - 0.02]} scale={[1, 0.001 + band, 1]}><cylinderGeometry args={[0.064, 0.064, 0.5, 40, 1, true]} />{M.glow({ col: RED, op: 0.32 })}</mesh>
    {[-0.19, -0.19 + 0.5 * band].map((x, i) => <mesh key={i} position={[x, 0.088, 0]} rotation={[0, PI / 2, 0]} scale={0.001 + band}><torusGeometry args={[0.066, 0.005, 8, 40]} />{M.glow({ col: RED })}</mesh>)}
    {/* la regla de madera al lado del caño, del 6 al 18 */}
    <mesh position={[0.06, 0.004, 0.15]} rotation={[-PI / 2, 0, 0]} receiveShadow scale={[1.15, 1.9, 1]}><boxGeometry args={[0.54, 0.05, 0.006]} /><meshStandardMaterial map={rulerTex()} roughness={0.6} /></mesh>
    <pointLight position={[0.06, 0.25, 0.2]} intensity={0.22 + 0.2 * band} distance={0.6} color="#ffbf55" />
  </>;
}}</Scene3D>;

// ---- 5:17 · LA LUPA: la lente llega al corte del caño y la cámara entra por ella: grasa con gotas y pelos, de cerca ----
export const HLoupe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="dark" warm={0.7}
  cam={{ at: [0, 0.14, 0.05], at1: [0.04, 0.17, 0.12], az: [0.05, -0.05], el: [0.2, 0.12], r: [1.15, 0.24], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="ALWAYS GREASE" col={AMB} />}>{(tt) => {
  const lens = eio(tt, 0.4, 2.4), rx = lerp(0.26, 0.04, lens), ry = lerp(0.3, 0.17, lens);
  return <>
    {/* el corte del caño de hierro: aro gris con la capa de grasa amarilla por dentro, gotas y pelos pegados */}
    <group position={[0, 0.14, 0]}>
      <mesh geometry={ringG(0.13, 0.112, 0.3)} castShadow receiveShadow>{M.steel({ col: "#8c8f92" })}</mesh>
      <mesh geometry={ringG(0.112, 0.075, 0.29)}>{M.grease({ col: "#b8913e" })}</mesh>
      {Array.from({ length: 40 }, (_, i) => { const a = rn(i, 2) * 2 * PI, r = 0.075 + 0.006 * rn(i, 3); return <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0.15 - rn(i, 4) * 0.02]}><sphereGeometry args={[0.004 + 0.006 * rn(i, 5), 14, 10]} />{M.grease({ col: i % 3 ? "#f0d488" : "#b88e3a" })}</mesh>; })}
      {Array.from({ length: 5 }, (_, i) => { const a = 0.6 + i * 1.2; return <Hair key={i} id={"lp" + i} n={4} spread={0.004} r={0.0007} pts={[[Math.cos(a) * 0.08, Math.sin(a) * 0.08, 0.152], [Math.cos(a + 0.3) * 0.05, Math.sin(a + 0.3) * 0.05, 0.16], [Math.cos(a + 0.6) * 0.03, Math.sin(a + 0.6) * 0.03, 0.155]]} />; })}
    </group>
    {/* la lupa: aro cromado y mango de madera; la cámara termina adentro del vidrio */}
    <group position={[rx, ry, 0.36]} rotation={[0, 0, -0.5 + 0.5 * lens]}>
      <mesh><torusGeometry args={[0.085, 0.008, 16, 64]} />{M.chrome()}</mesh>
      <mesh scale={[1, 1, 0.16]}><sphereGeometry args={[0.084, 48, 24]} /><meshPhysicalMaterial color="#ffffff" roughness={0} transmission={1} thickness={0.06} ior={1.6} transparent opacity={0.96} clearcoat={1} /></mesh>
      <mesh position={[0, -0.13, 0]}><cylinderGeometry args={[0.012, 0.014, 0.09, 20]} />{M.wood({ base: [120, 70, 34] })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 6:10 · LA VELA: el corte del caño se llena de grasa desde la pared al centro; asoma la mecha y se prende; cae el palo de amasar ----
export const HCandle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark"
  cam={{ at: [0.08, 0.15, 0], az: [-0.35, 0.18], el: [0.26, 0.18], r: [1.2, 1.0], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="LIKE A CANDLE" col={AMB} />}>{(tt) => {
  const fill = eio(tt, 0.4, 3.0), ri = lerp(0.1, 0.006, fill), wick = cl(phys(tt, 3.1, 6, 0.6)), lit = cl((tt - 3.7) / 0.4);
  const fl = 1 + 0.08 * Math.sin(tt * 2 * PI * 1.6) + 0.05 * Math.sin(tt * 2 * PI * 0.7);
  const pinY = 0.36 * (1 - phys(tt, 4.4, 9, 0.35)), roll = cl((tt - 4.8) / 1.2);
  return <>
    <group position={[0, 0.14, 0]} rotation={[0, 0.2, 0]}>
      <mesh geometry={ringG(0.13, 0.112, 0.22)} castShadow receiveShadow>{M.steel({ col: "#6b6f73" })}</mesh>
      <mesh geometry={ringG(0.112, ri, 0.2)}>{M.grease({ col: "#efdca2" })}</mesh>
      {wick > 0 && <mesh position={[0, 0, 0.1 + 0.02 * wick]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.003, 0.003, 0.05 * wick, 8]} />{M.matte({ col: "#1a1612" })}</mesh>}
      {lit > 0 && <group position={[0, 0.0, 0.14]} scale={[lit, lit * fl, lit]}>
        <mesh position={[0, 0.025, 0]}><sphereGeometry args={[0.012, 16, 12]} />{M.glow({ col: "#ffd27a" })}</mesh>
        <mesh position={[0, 0.045, 0]}><coneGeometry args={[0.01, 0.04, 16]} />{M.glow({ col: "#ffb03a", op: 0.85 })}</mesh>
      </group>}
      <pointLight position={[0, 0.05, 0.2]} intensity={0.4 * lit * fl} distance={0.7} color="#ffb24a" />
    </group>
    {/* el palo de amasar cae, rebota y rueda un poco */}
    {tt > 4.1 && <group position={[0.27 - 0.05 * roll, 0.03 + pinY, 0.16]} rotation={[roll * 2.4, 0.4, 0]}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.03, 0.03, 0.22, 32]} />{M.wood({ base: [196, 150, 98], rx: 1, ry: 1 })}</mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.15, 0, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.012, 0.014, 0.08, 16]} />{M.wood({ base: [150, 100, 58] })}</mesh>)}
    </group>}
  </>;
}}</Scene3D>;

const FL_P = new THREE.Vector3(0.27, 0.355, 0), FL_W = new THREE.Vector3(0.05, 0.7, -1.594);
const FL_D = FL_W.clone().sub(FL_P).normalize(), FL_Q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), FL_D);
const FL_S = FL_P.clone().add(FL_D.clone().multiplyScalar(0.13)), FL_L = FL_W.distanceTo(FL_S), FL_MID = FL_S.clone().add(FL_W).multiplyScalar(0.5).toArray() as [number, number, number];
// ---- 7:14 · LA REPISA: balde, toalla, guantes, linterna y cepillo caen de a uno sobre la repisa; la linterna dibuja su haz en la pared ----
export const HToolFan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="tile"
  cam={{ at: [0, 0.36, 0], az: [-0.25, 0.22], el: [0.18, 0.12], r: [1.62, 1.42], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="WHAT YOU NEED" col={AMB} />}>{(tt) => {
  const A = [0.6, 1.5, 2.4, 3.3, 4.2], Y = 0.3;
  const dropY = (i: number) => 0.5 * (1 - phys(tt, A[i] - 0.3, 9, 0.22));
  const pulse = (i: number) => 1 + 0.08 * Math.sin(PI * cl((tt - A[i]) / 0.35));
  const show = (i: number) => tt > A[i] - 0.32;
  const beam = cl((tt - A[3] - 0.2) / 0.5);
  return <>
    <RBox s={[1.12, 0.03, 0.24]} r={0.006} p={[0, Y - 0.015, 0]}>{M.wood({ base: [150, 98, 56], rx: 3, ry: 1 })}</RBox>
    {[-0.44, 0.44].map((x) => <mesh key={x} position={[x, Y - 0.09, -0.08]}><boxGeometry args={[0.03, 0.14, 0.08]} />{M.steel({ col: "#5a5d60" })}</mesh>)}
    {/* balde */}
    {show(0) && <group position={[-0.42, Y + dropY(0), 0]} scale={pulse(0)}>
      <mesh position={[0, 0.09, 0]} castShadow><cylinderGeometry args={[0.1, 0.08, 0.18, 40, 1, true]} />{M.plastic({ col: "#e6762a", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.08, 0.08, 0.004, 40]} />{M.plastic({ col: "#c95f1c" })}</mesh>
      <mesh position={[0, 0.18, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.1, 0.004, 8, 40, PI]} />{M.steel()}</mesh>
    </group>}
    {/* toalla doblada con pliegues */}
    {show(1) && <group position={[-0.22, Y + dropY(1), 0.02]} rotation={[0, 0.2, 0]} scale={pulse(1)}>
      {[0, 1, 2].map((i) => <RBox key={i} s={[0.2, 0.026, 0.15]} r={0.012} p={[0.004 * i, 0.013 + i * 0.024, 0]}>{M.matte({ col: i % 2 ? "#3f7fb8" : "#4a8cc6" })}</RBox>)}
      {[0, 1, 2].map((i) => <mesh key={"f" + i} position={[-0.1 + 0.004 * i, 0.013 + i * 0.024, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.0135, 0.0135, 0.15, 16]} />{M.matte({ col: i % 2 ? "#3a75aa" : "#4583bb" })}</mesh>)}
      {[-0.04, 0.0, 0.04].map((z, i) => <mesh key={"p" + i} position={[0.0, 0.074, z]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.003, 0.003, 0.19, 8]} />{M.matte({ col: "#356c9e" })}</mesh>)}
      <mesh position={[0.1, 0.04, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.035, 0.15, 24, 1, true, -PI / 2, PI]} />{M.matte({ col: "#3f7fb8", side: THREE.DoubleSide })}</mesh>
    </group>}
    {/* guantes de goma amarillos */}
    {show(2) && <group position={[0.02, Y + dropY(2), 0.02]} scale={pulse(2)}>
      {[-1, 1].map((s) => <group key={s} position={[s * 0.05, 0.018, 0]} rotation={[PI / 2, 0, s * 0.35]}>
        <mesh castShadow><capsuleGeometry args={[0.032, 0.09, 8, 16]} />{M.rubber({ col: "#f0c62e" })}</mesh>
        {[0, 1, 2, 3].map((f) => <mesh key={f} position={[-0.027 + f * 0.018, 0.1, 0]} castShadow><capsuleGeometry args={[0.008, 0.045, 6, 10]} />{M.rubber({ col: "#f0c62e" })}</mesh>)}
      </group>)}
    </group>}
    {/* linterna con su haz en la pared */}
    {show(3) && <group position={[0.27, Y + dropY(3) + 0.025, 0]} quaternion={FL_Q} scale={pulse(3)}>
      <mesh castShadow><cylinderGeometry args={[0.022, 0.022, 0.16, 24]} />{M.matte({ col: "#1c1d20" })}</mesh>
      <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.034, 0.024, 0.05, 24]} />{M.chrome()}</mesh>
      <mesh position={[0, 0.126, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.03, 24]} />{M.glow({ col: "#fff3d0", op: beam })}</mesh>
    </group>}
    {beam > 0 && [0.26, 0.19, 0.12].map((r, i) => <mesh key={"bm" + i} position={[FL_W.x, FL_W.y, -1.594 + 0.001 * i]} scale={[1.35, 0.85, 1]}><circleGeometry args={[r, 64]} /><meshBasicMaterial color="#fff1c8" transparent opacity={[0.16, 0.2, 0.26][i] * beam} toneMapped={false} depthWrite={false} /></mesh>)}
    {beam > 0 && <mesh position={FL_MID} quaternion={FL_Q}><cylinderGeometry args={[0.2, 0.03, FL_L, 40, 1, true]} /><meshBasicMaterial color="#fff3d0" transparent opacity={0.09 * beam} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} /></mesh>}
    {/* cepillo de cerdas */}
    {show(4) && <group position={[0.44, Y + dropY(4), 0.02]} rotation={[0, -0.4, 0]} scale={pulse(4)}>
      <RBox s={[0.16, 0.03, 0.05]} r={0.01} p={[0, 0.03, 0]}>{M.wood({ base: [170, 112, 60] })}</RBox>
      <mesh position={[0, 0.008, 0]} castShadow><boxGeometry args={[0.15, 0.018, 0.045]} />{M.matte({ col: "#2a2724" })}</mesh>
    </group>}
  </>;
}}</Scene3D>;

// ---- 8:19 · EL DESPIECE: el sifón cromado se abre en el aire en sus piezas; la U se adelanta con su luz ----
const UPATH = [[-0.12, 0.12, 0], [-0.12, 0.02, 0], [-0.08, -0.06, 0], [0, -0.08, 0], [0.08, -0.06, 0], [0.12, 0.02, 0], [0.12, 0.08, 0]];
export const HExploded: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark"
  cam={{ at: [0.07, 0.44, 0.06], az: [-0.42, 0.3], el: [0.16, 0.22], r: [1.7, 1.5], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THE U COMES OFF" col={ICE} />}>{(tt) => {
  const back = eio(tt, 5.3, 6.4), ex = cl(phys(tt, 0.9, 5, 0.5)) * (1 - back), U = cl(phys(tt, 2.6, 5, 0.55)) * (1 - back), Y = 0.34;
  const part = (dx: number, dy: number, dz: number, ch: React.ReactNode, key: string, rot: number[] = [0, 0, 0]) =>
    <group key={key} position={[dx * ex, Y + dy * ex, dz * ex]} rotation={[rot[0] * ex, rot[1] * ex, rot[2] * ex]}>{ch}</group>;
  return <>
    {part(-0.12, 0.2, 0, <mesh position={[-0.12, 0.22, 0]} castShadow><cylinderGeometry args={[0.026, 0.026, 0.2, 32]} />{M.chrome()}</mesh>, "tail")}
    {part(-0.1, 0.12, 0, <mesh position={[-0.12, 0.12, 0]} geometry={hexNutG(0.04, 0.03, 0.027)} castShadow>{M.chrome()}</mesh>, "n1", [0.3, 0, 0])}
    {part(-0.08, 0.07, 0.05, <mesh position={[-0.12, 0.1, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.027, 0.006, 10, 32]} />{M.rubber({ col: "#222" })}</mesh>, "w1", [0.6, 0, 0])}
    {part(0.12, 0.12, 0, <mesh position={[0.12, 0.1, 0]} geometry={hexNutG(0.04, 0.03, 0.027)} castShadow>{M.chrome()}</mesh>, "n2", [-0.3, 0, 0])}
    {part(0.12, 0.07, 0.05, <mesh position={[0.12, 0.08, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.027, 0.006, 10, 32]} />{M.rubber({ col: "#222" })}</mesh>, "w2", [0.6, 0, 0])}
    {part(0.26, 0.12, -0.04, <mesh geometry={tubeG("arm", [[0.12, 0.1, 0], [0.12, 0.13, 0], [0.16, 0.16, 0], [0.3, 0.16, 0]], 0.026, 60, 24)} castShadow>{M.chrome()}</mesh>, "arm")}
    {/* la U: se adelanta hacia cámara con un aro de luz */}
    <group position={[0, Y - 0.03 * ex, 0.22 * U]} rotation={[0.25 * U, 0.3 * U, 0]}>
      <mesh geometry={tubeG("u", UPATH, 0.028, 80, 28)} castShadow>{M.chrome({ col: "#c9ced3" })}</mesh>
      <pointLight position={[0.1, 0.1, 0.25]} intensity={0.35 * U} distance={0.5} color="#cfe6ff" />
    </group>
    <mesh position={[0, 0.002, 0.22 * U]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.15, 0.17, 64]} />{M.glow({ col: ICE, op: 0.5 * U })}</mesh>
  </>;
}}</Scene3D>;

// ---- 9:30 · EL CUARTO DE VUELTA: la tuerca gira 90° y la arandela se aplasta; si sigue, la arandela se raja y gotea ----
export const HQuarter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark"
  cam={{ at: [0, 0.18, 0], az: [0.4, -0.1], el: [0.2, 0.14], r: [0.58, 0.48], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="A QUARTER TURN" col={AMB} />}>{(tt) => {
  const q = eio(tt, 0.9, 2.3), over = eio(tt, 3.4, 4.3), rot = (q + 0.6 * over) * PI / 2;
  const sq = 1 - 0.4 * q - 0.25 * over, crack = cl((tt - 3.9) / 0.5);
  return <>
    <mesh position={[0, 0.14, 0]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.28, 40]} />{M.pvc()}</mesh>
    <mesh position={[0, 0.215, 0]} geometry={threadG(0.041, 0.05, 6)}>{M.pvc({ col: "#dcd8cd" })}</mesh>
    {/* arandela de goma negra que se aplasta */}
    <mesh position={[0, 0.172, 0]} rotation={[PI / 2, 0, 0]} scale={[1 + 0.28 * (1 - sq), 1 + 0.28 * (1 - sq), sq]}><torusGeometry args={[0.062, 0.017, 16, 48]} />{M.rubber({ col: "#f07a1e" })}</mesh>
    {crack > 0 && <mesh position={[0.07, 0.172, 0.03]} rotation={[0, 0.4, 0]} scale={[1, crack, 1]}><boxGeometry args={[0.03, 0.022, 0.012]} />{M.matte({ col: "#050505" })}</mesh>}
    {crack > 0 && (() => { const k = cl((tt - 4.3) / 0.7); return k > 0 && k < 1 ? <mesh position={[0.08, 0.16 - 0.15 * k * k, 0.035]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.02, 16, 12]} />{M.water({ op: 0.95, emI: 0.6 })}</mesh> : null; })()}
    {/* la tuerca hexagonal: gira el gajo de 90° iluminado */}
    <group position={[0, 0.2, 0]} rotation={[0, -rot, 0]}>
      <mesh geometry={hexNutG(0.07, 0.04, 0.042)} castShadow>{M.chrome()}</mesh>
      <mesh geometry={hexNutG(0.07, 0.004, 0.064)} position={[0, -0.019, 0]}>{M.chrome()}</mesh>
      <mesh geometry={hexNutG(0.07, 0.004, 0.064)} position={[0, 0.019, 0]}>{M.chrome()}</mesh>
      <mesh position={[0.055, 0.021, 0]}><cylinderGeometry args={[0.007, 0.007, 0.002, 16]} />{M.glow({ col: over > 0 ? RED : AMB })}</mesh>
    </group>
    {/* el gajo de 90° que dibuja la vuelta permitida; si se pasa, la cinta se pone roja */}
    <mesh position={[0, 0.228, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.085, 0.1, 48, 1, 0, (PI / 2) * cl(q * 1.02)]} />{M.glow({ col: AMB, op: 0.85 })}</mesh>
    {over > 0 && <mesh position={[0, 0.229, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.085, 0.1, 48, 1, PI / 2, (PI / 2) * 0.6 * over]} />{M.glow({ col: RED, op: 0.9 })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 10:30 · DONDE SE ENFRÍA: el agua corre caliente por el brazo; en la curva se frena, pasa a azul y la grasa se pega y achica el paso ----
const SP = [[-0.62, 0.2, 0.14], [-0.2, 0.18, 0.14], [0.1, 0.16, 0.1], [0.26, 0.15, -0.05], [0.3, 0.15, -0.4]];
export const HSlowCool: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="tile"
  cam={{ at: [0, 0.16, 0], at1: [0.2, 0.16, -0.06], az: [-0.1, 0.35], el: [0.55, 0.42], r: [1.35, 0.85], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="IT SLOWS. IT COOLS." col={ICE} />}>{(tt) => {
  const c = curve(SP), gr = eio(tt, 1.2, 5.0);
  const hot = new THREE.Color("#ff8a3a"), cold = new THREE.Color("#5fb2e6");
  return <>
    <mesh geometry={tubeG("sglass", SP, 0.05, 140, 30)}>{M.glass({ op: 0.2 })}</mesh>
    {/* gotas de agua que corren: rápidas y naranjas al entrar, lentas y azules en la curva */}
    {Array.from({ length: 36 }, (_, i) => {
      const ph = (tt * 0.32 + i / 36) % 1, u = ph < 0.5 ? ph * 1.3 : 0.65 + (ph - 0.5) * 0.7;
      const p = c.getPointAt(Math.min(u, 0.999)), cc = hot.clone().lerp(cold, cl((u - 0.4) / 0.3));
      return <mesh key={i} position={[p.x + (rn(i, 2) - 0.5) * 0.02, p.y - 0.022 + (rn(i, 3) - 0.5) * 0.01, p.z + (rn(i, 4) - 0.5) * 0.02]}><sphereGeometry args={[0.014, 12, 10]} /><meshPhysicalMaterial color={cc} emissive={cc} emissiveIntensity={0.6} roughness={0.1} clearcoat={1} transparent opacity={0.85} /></mesh>;
    })}
    {/* la grasa blanca que se pega por dentro de la curva y achica el paso */}
    {Array.from({ length: 16 }, (_, i) => { const u = 0.55 + 0.25 * (i / 15), p = c.getPointAt(u), tg = c.getTangentAt(u), side = new THREE.Vector3(-tg.z, 0, tg.x).normalize(); const r = 0.012 + 0.022 * gr * (0.6 + 0.4 * rn(i, 5)); return <mesh key={i} position={[p.x + side.x * 0.034, p.y - 0.012 + 0.02 * rn(i, 6), p.z + side.z * 0.034]}><sphereGeometry args={[r, 18, 14]} />{M.grease({ col: "#f4ecd6" })}</mesh>; })}
    <mesh position={[0.3, 0.15, -0.42]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.058, 0.012, 12, 40]} />{M.chrome()}</mesh>
    {/* el anillo de grasa que va cerrando la luz del caño en la curva */}
    {(() => { const u = 0.7, p = c.getPointAt(u), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), c.getTangentAt(u)), ri = lerp(0.046, 0.014, gr); return <group position={[p.x, p.y, p.z]} quaternion={q}>
      <mesh><cylinderGeometry args={[ri, ri, 0.07, 40, 1, true]} />{M.grease({ col: "#efe7cf", side: THREE.DoubleSide })}</mesh>
      {[-0.035, 0.035].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><ringGeometry args={[ri, 0.048, 40]} />{M.grease({ col: "#e6dcc0", side: THREE.DoubleSide })}</mesh>)}
      <pointLight position={[0, -0.09, 0]} intensity={0.3 * (1 - gr)} distance={0.25} color="#ffe2b0" />
    </group>; })()}
  </>;
}}</Scene3D>;
