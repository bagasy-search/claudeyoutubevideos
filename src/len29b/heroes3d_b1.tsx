// len29b · 2ª vuelta en 3D real (kit h3d): teléfono, ladrones, fuente, techo, sándwich, géiser.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, RED, H } from "./hkit";
import { M, RBox, Scene3D, cl, curve, eio, lerp, phys, rn, tex, tubeG } from "./h3d";

const PI = Math.PI;
const sub = (pts: number[][], u: number, n = 30) => { const c = curve(pts), o: number[][] = []; for (let i = 0; i <= n; i++) { const p = c.getPointAt(Math.max(0.002, u) * i / n); o.push([p.x, p.y, p.z]); } return o; };
const at = (pts: number[][], u: number) => { const p = curve(pts).getPointAt(cl(u)); return [p.x, p.y, p.z]; };

// ---- 0:42 · LA NOCHE MÁS LARGA: el teléfono de pared suena sin parar; las notas con una pileta dibujada se pegan alrededor, una tras otra ----
const noteTex = (i: number) => tex.text("note" + (i % 3), 128, 128, (g) => {
  g.fillStyle = ["#f6d64a", "#f2c13a", "#f7dc6a"][i % 3]; g.fillRect(0, 0, 128, 128);
  g.strokeStyle = "#3a3a3a"; g.lineWidth = 6; g.lineCap = "round";
  g.beginPath(); g.moveTo(26, 56); g.lineTo(34, 92); g.lineTo(94, 92); g.lineTo(102, 56); g.stroke();
  g.beginPath(); g.moveTo(64, 56); g.lineTo(64, 34); g.lineTo(82, 34); g.stroke();
  g.strokeStyle = "#c2302a"; g.beginPath(); g.moveTo(40, 104); g.lineTo(88, 116); g.stroke();
});
export const HPhoneWall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.2, 0.9, 0.2]}
  cam={{ at: [0, 0.6, -1.5], az: [-0.22, 0.16], el: [0.05, 0.02], r: [1.12, 0.96], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="BUSIEST NIGHT OF THE YEAR" col={AMB} />}>{(tt) => {
  const ring = (k: number) => Math.abs(Math.sin(k * 2 * PI * 0.9)) > 0.55 ? 1 : 0, rg = ring(tt) * (tt > 0.5 ? 1 : 0);
  const sh = rg * 0.03 * Math.sin(tt * 90), Z = -1.585;
  const notes = [[-0.32, 0.78], [0.3, 0.74], [-0.28, 0.44], [0.34, 0.46], [-0.12, 0.9], [0.14, 0.92], [-0.42, 0.62], [0.44, 0.62], [0.0, 0.3]];
  const coil: number[][] = []; for (let i = 0; i <= 160; i++) { const u = i / 160, a = u * 26 * PI; const x = lerp(0.085, 0.06, u) + 0.05 * Math.sin(PI * u), y = lerp(0.6, 0.48, u) - 0.2 * Math.sin(PI * u); coil.push([x + 0.012 * Math.cos(a), y, Z + 0.09 + 0.012 * Math.sin(a)]); }
  return <>
    {/* el teléfono beige de pared, con su tubo que tiembla cuando suena */}
    <group position={[0, 0.6, Z + 0.02]} rotation={[0, 0, sh * 0.2]}>
      <RBox s={[0.16, 0.26, 0.06]} r={0.02} p={[0, 0, 0.03]}>{M.plastic({ col: "#e9dfc6" })}</RBox>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.035 + (i % 3) * 0.035, -0.035 - Math.floor(i / 3) * 0.026, 0.062]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.009, 0.009, 0.008, 16]} />{M.plastic({ col: "#3a3a3a" })}</mesh>)}
      <mesh position={[0, 0.06, 0.061]}><boxGeometry args={[0.13, 0.05, 0.004]} />{M.plastic({ col: "#cfc3a6" })}</mesh>
      <group position={[0.0, 0.06 + rg * 0.004 * Math.sin(tt * 70), 0.075]} rotation={[0, 0, PI / 2 + sh]}>
        <mesh castShadow><capsuleGeometry args={[0.018, 0.14, 8, 16]} />{M.plastic({ col: "#e2d6ba" })}</mesh>
        {[-1, 1].map((s) => <mesh key={s} position={[0, s * 0.085, 0.012]} castShadow><sphereGeometry args={[0.03, 20, 14]} />{M.plastic({ col: "#e2d6ba" })}</mesh>)}
      </group>
    </group>
    <mesh geometry={tubeG("coilb", coil, 0.004, 400, 6)}>{M.plastic({ col: "#d8ccb0" })}</mesh>
    {/* ondas del timbre: aros que salen del teléfono cuando suena */}
    {[0, 1, 2].map((i) => { const k = ((tt * 0.9 + i / 3) % 1); return rg ? <mesh key={i} position={[0, 0.6, Z + 0.03]}><ringGeometry args={[0.16 + 0.25 * k, 0.168 + 0.25 * k, 64]} />{M.glow({ col: AMB, op: 0.35 * (1 - k) })}</mesh> : null; })}
    {/* las notas adhesivas: cada una un llamado, con la pileta dibujada */}
    {notes.map(([x, y], i) => { const a = 0.9 + i * 0.5, k = cl(phys(tt, a, 7, 0.45)); return k > 0.01 ? <group key={i} position={[x, y, Z + 0.004 + 0.002 * i]} rotation={[0, 0, (rn(i, 2) - 0.5) * 0.4 + (1 - k) * 0.8]} scale={k}>
      <mesh castShadow><planeGeometry args={[0.1, 0.1]} /><meshStandardMaterial map={noteTex(i)} roughness={0.9} side={THREE.DoubleSide} /></mesh>
    </group> : null; })}
  </>;
}}</Scene3D>;

// ---- 1:08 · LOS DOS LADRONES: el empujón baja como una bola de luz; en la T se parte y los dos caños de costado se lo roban antes del tapón ----
const MAIN = [[0, 0.62, 0], [0, 0.32, 0], [0, 0.05, 0]], LB = [[0, 0.32, 0], [-0.12, 0.34, 0], [-0.32, 0.46, 0], [-0.42, 0.6, 0]], RB = [[0, 0.32, 0], [0.14, 0.32, 0.02], [0.32, 0.26, 0.05], [0.46, 0.22, 0.05]];
export const HThieves: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="tile"
  cam={{ at: [0.06, 0.38, 0], az: [-0.2, 0.2], el: [0.16, 0.12], r: [1.95, 1.75], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="TWO THIEVES" col={RED} />}>{(tt) => {
  const down = eio(tt, 0.8, 1.7), split = eio(tt, 1.7, 3.0), rest = cl((tt - 1.7) / 1.4);
  const ball = (p: number[], r: number, k = 1) => <mesh position={p as [number, number, number]} scale={k}><sphereGeometry args={[r, 24, 16]} /><meshBasicMaterial color="#9fd8ff" toneMapped={false} /></mesh>;
  return <>
    {[MAIN, LB, RB].map((p, i) => <mesh key={i} geometry={tubeG("thv" + i, p, 0.04, 60, 24)}>{M.glass({ op: 0.2 })}</mesh>)}
    {[[0, 0.32, 0]].map((p, i) => <mesh key={i} position={p as [number, number, number]}><sphereGeometry args={[0.048, 24, 16]} />{M.chrome({ op: 0.5 })}</mesh>)}
    {/* el tapón abajo, quieto */}
    <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.036, 0.036, 0.07, 32]} />{M.grease({ col: "#7a5a2c" })}</mesh>
    {/* el sopapo rojo arriba */}
    <group position={[0, 0.66 - 0.03 * Math.sin(PI * cl((tt - 0.5) / 0.4)), 0]}>
      <mesh scale={[1, 0.6, 1]} castShadow><sphereGeometry args={[0.09, 32, 20, 0, PI * 2, 0, PI / 2]} />{M.matte({ col: "#c2302a", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.012, 0.012, 0.34, 16]} />{M.wood({ base: [170, 112, 60] })}</mesh>
    </group>
    {/* los dos ladrones: la otra pileta (izquierda) y el lavavajillas (derecha) */}
    <group position={[-0.44, 0.66, 0]}><mesh><cylinderGeometry args={[0.13, 0.05, 0.1, 4, 1, true, PI / 4]} />{M.steel({ side: THREE.DoubleSide })}</mesh>{[-1, 1].map((s) => <mesh key={s} position={[s * 0.115, 0.05, 0]}><boxGeometry args={[0.04, 0.015, 0.26]} />{M.steel({ col: "#b9bec3" })}</mesh>)}{[-1, 1].map((s) => <mesh key={s} position={[0, 0.05, s * 0.115]}><boxGeometry args={[0.26, 0.015, 0.04]} />{M.steel({ col: "#b9bec3" })}</mesh>)}</group>
    <group position={[0.6, 0.2, 0.05]}>
      <RBox s={[0.22, 0.3, 0.2]} r={0.01} p={[0, 0, 0]}>{M.steel({ col: "#b9bec3" })}</RBox>
      <mesh position={[0, 0.1, 0.101]}><planeGeometry args={[0.18, 0.02]} />{M.matte({ col: "#222" })}</mesh>
    </group>
    {/* la bola de luz baja, se parte en la T y se va por los costados */}
    {tt > 0.7 && down < 1 && ball([0, lerp(0.6, 0.32, down), 0], 0.03)}
    {split > 0 && split < 1 && <>{ball(at(LB, split), 0.024)}{ball(at(RB, split), 0.024)}</>}
    {split > 0 && ball([0, lerp(0.3, 0.12, rest), 0], 0.012, 1 - rest)}
    {split >= 1 && [[-0.42, 0.6, 0], [0.46, 0.22, 0.05]].map((p, i) => { const k = cl((tt - 3.0) / 0.6); return k < 1 ? <mesh key={i} position={p as [number, number, number]}><ringGeometry args={[0.03 + 0.1 * k, 0.036 + 0.1 * k, 40]} />{M.glow({ col: "#9fd8ff", op: 1 - k })}</mesh> : null; })}
    <pointLight position={[0, 0.34, 0.2]} intensity={0.4 * (down > 0 && split < 1 ? 1 : 0)} distance={0.6} color="#9fd8ff" />
  </>;
}}</Scene3D>;

// ---- 2:28 · EL CAMINO FÁCIL: el émbolo empuja; abajo el caño está tapado, así que el agua sube por el otro brazo y sale en arco al cuenco de cobre ----
const FT = [[0, 0.5, 0], [0, 0.12, 0]], FS = [[0, 0.22, 0], [0.12, 0.22, 0], [0.2, 0.3, 0], [0.22, 0.52, 0]];
export const HFountain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="tile"
  cam={{ at: [0.12, 0.34, 0], az: [-0.3, 0.2], el: [0.22, 0.14], r: [1.45, 1.25], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="IT GOES THE EASY WAY" col={ICE} />}>{(tt) => {
  const pump = (k: number) => Math.max(0, Math.sin(PI * ((k - 0.8) / 0.9) % PI)) * (k > 0.8 ? 1 : 0);
  const p = pump(tt), jet = cl((tt - 1.1) / 0.3) * (0.6 + 0.4 * p);
  return <>
    <mesh geometry={tubeG("ft", FT, 0.04, 40, 24)}>{M.glass({ op: 0.22 })}</mesh>
    <mesh geometry={tubeG("fs", FS, 0.032, 50, 24)}>{M.glass({ op: 0.22 })}</mesh>
    <mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.035, 0.035, 0.16, 24]} />{M.water({ op: 0.6 })}</mesh>
    <mesh geometry={tubeG("fsw", FS, 0.027, 50, 16)}>{M.water({ op: 0.55 })}</mesh>
    {/* el tapón abajo, que no deja pasar */}
    <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.036, 0.036, 0.06, 32]} />{M.grease({ col: "#7a5a2c" })}</mesh>
    {/* el émbolo arriba */}
    <group position={[0, 0.48 - 0.1 * p, 0]}>
      <mesh><cylinderGeometry args={[0.036, 0.036, 0.02, 24]} />{M.rubber()}</mesh>
      <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.008, 0.008, 0.3, 12]} />{M.chrome()}</mesh>
      <mesh position={[0, 0.31, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.1, 16]} />{M.wood({ base: [170, 112, 60] })}</mesh>
    </group>
    {/* el arco de agua que sale por el brazo libre y cae al cuenco */}
    {jet > 0 && <mesh geometry={tubeG("farc" + Math.round(jet * 20), [[0.22, 0.52, 0], [0.26, 0.52 + 0.14 * jet, 0], [0.36, 0.56 * jet + 0.1, 0], [0.48, 0.12, 0]], (u) => 0.012 * (1 - 0.4 * u), 50, 12)}>{M.water({ op: 0.75, emI: 0.6 })}</mesh>}
    {jet > 0 && Array.from({ length: 14 }, (_, i) => { const k = ((tt * 1.3 + i / 14) % 1); return <mesh key={i} position={[lerp(0.24, 0.5, k) + 0.02 * (rn(i, 2) - 0.5), 0.52 + 0.3 * Math.sin(PI * k) * jet - 0.4 * k * k, 0.03 * (rn(i, 3) - 0.5)]}><sphereGeometry args={[0.006, 10, 8]} />{M.water({ op: 0.8 })}</mesh>; })}
    <group position={[0.5, 0, 0]}>
      <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.12, 0.08, 0.12, 48, 1, true]} />{M.brass({ col: "#c07a4a" })}</mesh>
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.08, 0.08, 0.004, 40]} />{M.brass({ col: "#a8643a" })}</mesh>
      <mesh position={[0, 0.03 + 0.06 * cl((tt - 1.2) / 4), 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.1, 40]} />{M.water({ op: 0.7, emI: 0.5 })}</mesh>
      {[0, 1].map((i) => { const k = ((tt * 1.1 + i / 2) % 1); return tt > 1.3 ? <mesh key={i} position={[-0.02, 0.04 + 0.06 * cl((tt - 1.2) / 4), 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.01 + 0.07 * k, 0.015 + 0.07 * k, 40]} />{M.glow({ col: "#d8f0ff", op: 0.5 * (1 - k) })}</mesh> : null; })}
    </group>
  </>;
}}</Scene3D>;

// ---- 2:46 · EL TECHO DE LA SEÑORA NOVAK: desde abajo, la mancha amarilla crece en el yeso, se hincha y suelta una gota gorda a la olla ----
const stainTex = () => tex.text("stain", 256, 256, (g) => {
  const gr = g.createRadialGradient(128, 128, 10, 128, 128, 126); gr.addColorStop(0, "rgba(150,110,40,.9)"); gr.addColorStop(0.6, "rgba(190,150,70,.6)"); gr.addColorStop(0.85, "rgba(150,100,40,.75)"); gr.addColorStop(1, "rgba(200,170,110,0)");
  g.fillStyle = gr; g.beginPath(); for (let a = 0; a < 6.3; a += 0.1) { const r = 112 + 14 * Math.sin(a * 5) + 8 * Math.sin(a * 11); g.lineTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r); } g.fill();
});
export const HCeiling: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="none" bg="#3a3630" warm={0.8}
  cam={{ at: [0.05, 0.6, 0.02], az: [0.25, 0.1], el: [-0.12, -0.1], r: [1.6, 1.5], fov: 46 }}
  over={(tt) => <Head tt={tt} kick="" title="WATER ON THE CEILING" col={AMB} />}>{(tt) => {
  const C = 1.0, grow = eio(tt, 0.3, 3.4), bulge = eio(tt, 2.4, 4.2);
  const drops = [3.4, 4.3, 5.1];
  return <>
    <mesh position={[0, C, 0]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[4, 4]} />{M.matte({ col: "#ece8df", side: THREE.DoubleSide })}</mesh>
    <mesh position={[0.05, C - 0.002, 0.02]} rotation={[PI / 2, 0, 0]} scale={0.1 + 0.9 * grow}><planeGeometry args={[0.7, 0.7]} /><meshStandardMaterial map={stainTex()} transparent roughness={0.9} depthWrite={false} /></mesh>
    {/* el yeso hinchado: una ampolla que baja del techo */}
    <mesh position={[0.05, C, 0.02]} scale={[0.12, 0.05 * bulge + 0.001, 0.12]}><sphereGeometry args={[1, 32, 16, 0, PI * 2, PI / 2, PI / 2]} /><meshStandardMaterial color="#c8a65e" roughness={0.6} /></mesh>
    {/* la lámpara colgante para dar escala */}
    <mesh position={[-0.35, C - 0.15, -0.1]}><cylinderGeometry args={[0.003, 0.003, 0.3, 8]} />{M.matte({ col: "#222" })}</mesh>
    <mesh position={[-0.35, C - 0.32, -0.1]}><coneGeometry args={[0.07, 0.06, 32, 1, true]} />{M.brass({ side: THREE.DoubleSide } as never)}</mesh>
    {/* las gotas gordas que caen a la olla, con su onda */}
    {drops.map((a, i) => { const k = cl((tt - a + 0.5) / 0.5), hang = cl((tt - a + 1.0) / 0.5); return <group key={i}>
      {k <= 0 && hang > 0 && <mesh position={[0.05, C - 0.05 * bulge - 0.012 * hang, 0.02]} scale={[1, 1 + 0.5 * hang, 1]}><sphereGeometry args={[0.014, 16, 12]} />{M.water({ op: 0.9, col: "#c9a85a" })}</mesh>}
      {k > 0 && k < 1 && <mesh position={[0.05, lerp(C - 0.07, 0.14, k * k), 0.02]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.015, 16, 12]} />{M.water({ op: 0.9, col: "#c9a85a" })}</mesh>}
      {k >= 1 && (() => { const r = cl((tt - a) / 0.8); return r < 1 ? <mesh position={[0.05, 0.141, 0.02]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.01 + 0.08 * r, 0.016 + 0.08 * r, 40]} />{M.glow({ col: "#e8f4ff", op: 0.6 * (1 - r) })}</mesh> : null; })()}
    </group>; })}
    <group position={[0.05, 0, 0.02]}>
      <mesh position={[0, 0.07, 0]} castShadow><cylinderGeometry args={[0.12, 0.11, 0.14, 40, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.13, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.115, 40]} />{M.water({ op: 0.6, col: "#c9b07a" })}</mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.13, 0.12, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.02, 0.005, 8, 20, PI]} />{M.steel()}</mesh>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 3:22 · EL SÁNDWICH: trapo mojado, plato y mano caen de a uno sobre el otro desagüe; recién ahí el empujón baja y mueve el tapón ----
export const HSandwich: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="tile"
  cam={{ at: [0.05, 0.3, 0], az: [0.35, 0.1], el: [0.95, 0.82], r: [1.4, 1.2], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="NOWHERE BUT DOWN" col={ICE} />}>{(tt) => {
  const X = 0.24, top = 0.5;
  const dropIn = (a: number, h0 = 0.35) => h0 * (1 - phys(tt, a, 9, 0.38));
  const push = Math.max(0, Math.sin(PI * cl((tt - 3.4) / 0.6))) + Math.max(0, Math.sin(PI * cl((tt - 4.3) / 0.6)));
  const plug = 0.1 * eio(tt, 3.5, 5.0);
  return <>
    {[-X, X].map((x) => <group key={x}>
      {[-1, 1].map((s) => <mesh key={"a" + s} position={[x + s * 0.17, top, 0]}><boxGeometry args={[0.1, 0.02, 0.36]} />{M.steel({ col: "#b9bec3" })}</mesh>)}{[-1, 1].map((s) => <mesh key={"b" + s} position={[x, top, s * 0.15]}><boxGeometry args={[0.24, 0.02, 0.06]} />{M.steel({ col: "#b9bec3" })}</mesh>)}
      <mesh position={[x, top - 0.06, 0]}><cylinderGeometry args={[0.17, 0.05, 0.12, 4, 1, true, PI / 4]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[x, top - 0.2, 0]}><cylinderGeometry args={[0.035, 0.035, 0.16, 32, 1, true]} />{M.glass({ op: 0.24 })}</mesh>
    </group>)}
    <mesh geometry={tubeG("sj", [[-X, 0.3, 0], [-X + 0.04, 0.24, 0], [X - 0.04, 0.24, 0], [X, 0.3, 0]], 0.035, 40, 24)}>{M.glass({ op: 0.24 })}</mesh>
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.035, 0.035, 0.24, 32, 1, true]} />{M.glass({ op: 0.24 })}</mesh>
    {/* la columna de agua que baja y el tapón que recién ahora se mueve */}
    <mesh position={[0, 0.2 - plug / 2, 0]}><cylinderGeometry args={[0.03, 0.03, 0.12 + plug, 24]} />{M.water({ op: 0.6 })}</mesh>
    <mesh position={[0, 0.1 - plug, 0]}><cylinderGeometry args={[0.034, 0.034, 0.05, 24]} />{M.grease({ col: "#7a5a2c" })}</mesh>
    {/* el sopapo en la pileta izquierda */}
    <group position={[-X, top - 0.03 - 0.035 * push, 0]}>
      <mesh scale={[1, 0.6 - 0.15 * push, 1]} castShadow><sphereGeometry args={[0.08, 32, 20, 0, PI * 2, 0, PI / 2]} />{M.matte({ col: "#c2302a", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.36, 16]} />{M.wood({ base: [170, 112, 60] })}</mesh>
    </group>
    {/* el sándwich en la derecha: trapo mojado, plato, mano */}
    {tt > 0.5 && <group position={[X, top - 0.035 + dropIn(0.6), 0]}>
      <RBox s={[0.16, 0.02, 0.14]} r={0.008} p={[0, 0.01, 0]}>{M.matte({ col: "#3f7fb8" })}</RBox>
      <mesh position={[0.06, 0.02, 0.0]} rotation={[0, 0, 0.3]}><boxGeometry args={[0.06, 0.012, 0.13]} />{M.matte({ col: "#4a8cc6" })}</mesh>
    </group>}
    {tt > 1.3 && <mesh position={[X, top - 0.008 + dropIn(1.4), 0]} castShadow><cylinderGeometry args={[0.11, 0.09, 0.014, 48]} />{M.porcelain()}</mesh>}
    {tt > 2.1 && <group position={[X, top + 0.012 + dropIn(2.2), 0.01]} rotation={[0, 0.3, 0]}>
      <RBox s={[0.09, 0.025, 0.1]} r={0.012} p={[0, 0.012, 0]}>{M.matte({ col: "#d9a07a" })}</RBox>
      {[0, 1, 2, 3].map((f) => <mesh key={f} position={[-0.033 + f * 0.022, 0.014, 0.075]} rotation={[PI / 2, 0, 0]} castShadow><capsuleGeometry args={[0.009, 0.05, 6, 10]} />{M.matte({ col: "#d9a07a" })}</mesh>)}
      <mesh position={[0.058, 0.014, 0.01]} rotation={[PI / 2, 0, -0.8]} castShadow><capsuleGeometry args={[0.01, 0.04, 6, 10]} />{M.matte({ col: "#d9a07a" })}</mesh>
    </group>}
  </>;
}}</Scene3D>;

// ---- 4:03 · EL GÉISER DEL AIR GAP: a cada bombeo el cilindrito cromado de la mesada escupe agua marrón por sus ranuras; el charco crece ----
export const HGeyser: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile"
  cam={{ at: [0, 0.1, 0], az: [0.35, -0.2], el: [0.42, 0.32], r: [0.8, 0.66], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THE LITTLE CHROME CAP" col={AMB} />}>{(tt) => {
  const beats = [1.0, 2.0, 3.0, 4.0, 5.0], puddle = eio(tt, 1.2, 5.6);
  return <>
    {/* la canilla y el cilindro cromado del air gap sobre la mesada */}
    <mesh position={[-0.24, 0.12, -0.1]}><cylinderGeometry args={[0.02, 0.024, 0.24, 24]} />{M.chrome()}</mesh>
    <mesh position={[-0.18, 0.23, -0.1]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.12, 16]} />{M.chrome()}</mesh>
    <mesh position={[0, 0.04, 0]} castShadow><cylinderGeometry args={[0.032, 0.035, 0.08, 40]} />{M.chrome()}</mesh>
    <mesh position={[0, 0.085, 0]} castShadow><sphereGeometry args={[0.032, 32, 16, 0, PI * 2, 0, PI / 2]} />{M.chrome()}</mesh>
    {[0, 1, 2, 3].map((i) => <mesh key={i} position={[Math.cos(i * PI / 2 + PI / 4) * 0.0335, 0.07, Math.sin(i * PI / 2 + PI / 4) * 0.0335]} rotation={[0, -(i * PI / 2 + PI / 4), 0]}><boxGeometry args={[0.003, 0.016, 0.012]} />{M.matte({ col: "#111" })}</mesh>)}
    {/* a cada bombeo: cuatro chorros marrones por las ranuras, con gotas */}
    {beats.map((b, j) => { const k = cl((tt - b) / 0.55); if (k <= 0 || k >= 1) return null; return <group key={j}>
      {[0, 1, 2, 3].map((i) => { const a = i * PI / 2 + PI / 4, d = 0.05 + 0.22 * k, y = 0.07 + 0.16 * Math.sin(PI * k) - 0.05 * k; return <mesh key={i} geometry={tubeG(`gj${i}_${Math.round(k * 16)}`, [[Math.cos(a) * 0.035, 0.07, Math.sin(a) * 0.035], [Math.cos(a) * d * 0.5, 0.07 + 0.12 * Math.sin(PI * Math.min(1, k * 1.4)), Math.sin(a) * d * 0.5], [Math.cos(a) * d, Math.max(0.005, y), Math.sin(a) * d]], (u) => 0.007 * (1 - 0.5 * u), 20, 8)}>{M.water({ col: "#7a5a32", op: 0.88, em: "#2a1a08", emI: 0.2 })}</mesh>; })}
      {Array.from({ length: 10 }, (_, i) => { const a = rn(i + j * 10, 2) * 2 * PI, d = 0.08 + 0.2 * k; return <mesh key={"d" + i} position={[Math.cos(a) * d, 0.02 + 0.1 * Math.sin(PI * k), Math.sin(a) * d]}><sphereGeometry args={[0.006, 10, 8]} />{M.water({ col: "#7a5a32", op: 0.9 })}</mesh>; })}
    </group>; })}
    {/* manchas donde pegan las gotas y el charco que crece */}
    {Array.from({ length: 14 }, (_, i) => { const a = rn(i, 5) * 2 * PI, d = 0.12 + 0.18 * rn(i, 6), on = cl((tt - 1.3 - i * 0.28) / 0.2); return on > 0 ? <mesh key={i} position={[Math.cos(a) * d, 0.001, Math.sin(a) * d]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.008 + 0.01 * rn(i, 7), 16]} />{M.water({ col: "#6a4a28", op: 0.8 * on })}</mesh> : null; })}
    <mesh position={[0, 0.0015, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.036, 0.04 + 0.1 * puddle, 64]} />{M.water({ col: "#6a4a28", op: 0.6 })}</mesh>
  </>;
}}</Scene3D>;
