// len29b · 2ª vuelta en 3D real (kit h3d): bidones, árbol, glug, tablero, tapa, rayos X, anillos, manómetros, víbora.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, RED, H } from "./hkit";
import { Hair, M, RBox, Scene3D, cl, curve, eio, hexNutG, lerp, phys, rn, tex, tubeG } from "./h3d";

const PI = Math.PI;
const at = (pts: number[][], u: number) => { const p = curve(pts).getPointAt(cl(u)); return [p.x, p.y, p.z] as [number, number, number]; };
const sub = (pts: number[][], u: number, n = 30) => { const c = curve(pts), o: number[][] = []; for (let i = 0; i <= n; i++) { const p = c.getPointAt(Math.max(0.002, u) * i / n); o.push([p.x, p.y, p.z]); } return o; };

// la pileta de acero en corte (frente abierto): sirve a bidones y glug
const Basin: React.FC<{ y?: number; w?: number; d?: number; hgt?: number }> = ({ y = 0.3, w = 0.5, d = 0.34, hgt = 0.18 }) => <group position={[0, y, 0]}>
  <mesh position={[0, -hgt, 0]}><boxGeometry args={[w, 0.01, d]} />{M.steel()}</mesh>
  <mesh position={[0, -hgt / 2, -d / 2]}><boxGeometry args={[w, hgt, 0.01]} />{M.steel()}</mesh>
  {[-1, 1].map((s) => <mesh key={s} position={[s * w / 2, -hgt / 2, 0]}><boxGeometry args={[0.01, hgt, d]} />{M.steel()}</mesh>)}
  <mesh position={[0, -hgt / 2, d / 2]}><boxGeometry args={[w, hgt, 0.006]} />{M.glass({ op: 0.12 })}</mesh>
  {[-1, 1].map((s) => <mesh key={s} position={[s * (w / 2 + 0.06), 0.005, 0]}><boxGeometry args={[0.12, 0.02, d + 0.12]} />{M.steel({ col: "#b9bec3" })}</mesh>)}
</group>;

// ---- 4:46 · LOS DOS GALONES: dos bidones translúcidos se vuelcan en la pileta; el caño angosto no traga y el agua sube hasta el borde ----
const Jug: React.FC<{ lvl: number }> = ({ lvl }) => <group>
  <RBox s={[0.16, 0.24, 0.12]} r={0.03} p={[0, 0, 0]}>{M.plastic({ col: "#eef3f6", op: 0.45 } as never)}</RBox>
  <mesh position={[0, 0.14, 0.03]}><cylinderGeometry args={[0.022, 0.026, 0.04, 20]} />{M.plastic({ col: "#3f7fb8" })}</mesh>
  <mesh position={[0, 0.06, -0.06]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.04, 0.012, 10, 24, PI]} />{M.plastic({ col: "#eef3f6", op: 0.5 } as never)}</mesh>
  {lvl > 0.01 && <mesh position={[0, -0.115 + 0.11 * lvl, 0]}><boxGeometry args={[0.14, 0.22 * lvl, 0.1]} />{M.water({ op: 0.6 })}</mesh>}
</group>;
export const HJugs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="tile"
  cam={{ at: [0, 0.44, 0], az: [-0.28, 0.18], el: [0.2, 0.14], r: [1.55, 1.35], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="2 GALLONS, NOWHERE TO GO" col={ICE} />}>{(tt) => {
  const tilt = (a: number) => eio(tt, a, a + 0.7) * 1.9, pour = (a: number) => cl((tt - a - 0.6) / 1.6);
  const fill = cl(pour(0.6) * 0.55 + pour(1.6) * 0.5), over = cl((tt - 4.2) / 1.4);
  const lvl = Math.min(0.17, 0.02 + 0.15 * fill);
  return <>
    <Basin y={0.3} w={0.5} d={0.34} hgt={0.18} />
    {/* el caño angosto que no da abasto: una sola gotera baja */}
    <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.02, 0.02, 0.17, 24, 1, true]} />{M.glass({ op: 0.24 })}</mesh>
    <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.016, 0.016, 0.17, 20]} />{M.water({ op: 0.5 })}</mesh>
    {lvl > 0.02 && <mesh position={[0, 0.12 + lvl / 2, 0]}><boxGeometry args={[0.488, lvl, 0.33]} />{M.water({ op: 0.55 })}</mesh>}
    {/* los dos bidones se vuelcan desde arriba, uno tras otro, por debajo del título */}
    {[[-0.12, 0.6], [0.14, 1.6]].map(([x, a], i) => { const k = tilt(a), lv = 1 - pour(a); return <group key={i} position={[x, 0.5 + 0.08 * (1 - phys(tt, a - 0.4, 6, 0.5)), 0.02]} rotation={[0, 0, (i ? 1 : -1) * k]}>
      <Jug lvl={lv} />
      {pour(a) > 0 && pour(a) < 1 && <mesh position={[0, 0.17, 0.03]} rotation={[0, 0, -(i ? 1 : -1) * k]}><cylinderGeometry args={[0.012, 0.016, 0.3, 16]} />{M.water({ op: 0.7, emI: 0.4 })}</mesh>}
    </group>; })}
    {/* el agua desborda por el borde: una lámina que cae al frente */}
    {over > 0 && <mesh position={[0, 0.3 - 0.12 * over, 0.172]}><boxGeometry args={[0.36, 0.24 * over, 0.006]} />{M.water({ op: 0.55, emI: 0.4 })}</mesh>}
    {over > 0 && <mesh position={[0, 0.002, 0.3]} rotation={[-PI / 2, 0, 0]} scale={[1.6 * over, over, 1]}><circleGeometry args={[0.16, 40]} />{M.water({ op: 0.5 })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 5:19 · LEÉ TU PILETA: tres caños bajan como raíces; un nudo de grasa cae en cada uno y el que importa se enciende ----
const ROOTS = [[[-0.38, 0.62, 0], [-0.36, 0.42, 0], [-0.22, 0.26, 0], [0, 0.16, 0]], [[0, 0.62, 0], [0, 0.4, 0], [0, 0.16, 0]], [[0.38, 0.62, 0], [0.36, 0.42, 0], [0.22, 0.26, 0], [0, 0.16, 0]]];
export const HTree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark"
  cam={{ at: [0, 0.46, 0], az: [-0.18, 0.18], el: [0.12, 0.08], r: [2.0, 1.82], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="READ YOUR SINK" col={AMB} />}>{(tt) => {
  const grow = eio(tt, 0.3, 1.4);
  return <>
    {/* las tres bocas: pileta, lavavajillas, pileta del baño */}
    {[-0.38, 0, 0.38].map((x, i) => <group key={i} position={[x, 0.7, 0]} scale={1.9}>
      {i === 0 && <mesh><cylinderGeometry args={[0.1, 0.035, 0.08, 4, 1, true, PI / 4]} />{M.steel({ side: THREE.DoubleSide })}</mesh>}
      {i === 1 && <RBox s={[0.16, 0.12, 0.14]} r={0.01} p={[0, 0.03, 0]}>{M.steel({ col: "#b9bec3" })}</RBox>}
      {i === 2 && <mesh scale={[1, 0.5, 0.8]}><sphereGeometry args={[0.1, 32, 16, 0, PI * 2, PI / 2, PI / 2]} />{M.porcelain({ side: THREE.DoubleSide })}</mesh>}
    </group>)}
    {ROOTS.map((p, i) => <mesh key={i} geometry={tubeG("root" + i + Math.round(grow * 20), sub(p, grow), 0.026, 40, 20)}>{M.pvc()}</mesh>)}
    <mesh geometry={tubeG("trunk", [[0, 0.16, 0], [0, 0.0, 0]], 0.036, 10, 20)}>{M.pvc()}</mesh>
    {/* los tres nudos de grasa caen con resorte; el del tronco común es el que se enciende */}
    {[0, 1, 2].map((i) => { const a = 1.5 + i * 0.6, k = cl(phys(tt, a, 8, 0.4)); if (tt < a) return null; const p = at(ROOTS[i], 0.45); return <mesh key={i} position={[p[0], p[1] + 0.25 * (1 - k), p[2] + 0.04]} scale={0.6 + 0.4 * k}><sphereGeometry args={[0.03, 24, 16]} />{M.grease({ col: "#b48a3c" })}</mesh>; })}
    {(() => { const k = cl((tt - 3.6) / 0.6); return k > 0 ? <group position={[0, 0.1, 0.0]}>
      <mesh scale={0.6 + 0.4 * k}><sphereGeometry args={[0.042, 28, 18]} />{M.grease({ col: "#a8642c" })}</mesh>
      <mesh position={[0, 0, 0.05]}><ringGeometry args={[0.06, 0.078, 48]} />{M.glow({ col: RED, op: 0.85 * k * (0.7 + 0.3 * Math.sin(tt * 6)) })}</mesh>
    </group> : null; })()}
  </>;
}}</Scene3D>;

// ---- 5:39 · EL AIRE NO ENTRA: burbujas gordas suben por el desagüe, se traban contra el tapón y revientan en la superficie, una por glug ----
export const HGlug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="tile"
  cam={{ at: [0, 0.32, 0], az: [-0.3, 0.1], el: [0.22, 0.18], r: [1.45, 1.3], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="AIR CAN'T GET IN" col={ICE} />}>{(tt) => {
  const B = [0.8, 1.7, 2.6, 3.5, 4.4], PY = 0.16, SY = 0.44;
  let bob = 0; B.forEach((b) => { const d = tt - b - 1.1; if (d > 0) bob += 0.01 * Math.sin(d * 18) * Math.exp(-d * 5); });
  return <>
    <Basin y={0.52} w={0.5} d={0.32} hgt={0.12} />
    <mesh position={[0, SY - 0.015 + bob, 0]}><boxGeometry args={[0.49, 0.05, 0.31]} />{M.water({ op: 0.5 })}</mesh>
    {/* el caño ancho de vidrio con agua quieta */}
    <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.07, 0.07, 0.42, 40, 1, true]} />{M.glass({ op: 0.22 })}</mesh>
    <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.064, 0.064, 0.42, 32]} />{M.water({ op: 0.32 })}</mesh>
    {/* el tapón de pelo y grasa que traba el caño */}
    <group position={[0, PY, 0]}>
      <mesh scale={[1, 0.45, 1]}><sphereGeometry args={[0.06, 28, 16]} />{M.grease({ col: "#6a4a22" })}</mesh>
      <Hair id="gplug" n={40} spread={0.05} r={0.0016} pts={[[-0.06, 0, 0], [-0.02, 0.014, 0.03], [0.02, -0.012, -0.02], [0.06, 0.008, 0.01]]} />
      <Hair id="gplug2" n={18} spread={0.03} r={0.0014} col="#3a2a1a" pts={[[0, 0.01, -0.06], [0.02, -0.01, -0.02], [-0.02, 0.012, 0.02], [0.01, -0.006, 0.06]]} />
    </group>
    {/* cada burbuja gorda sube, se aplasta contra el tapón, se cuela y revienta arriba con onda y gota */}
    {B.map((b, i) => {
      const rise = cl((tt - b) / 0.35), squash = cl((tt - b - 0.35) / 0.35), pass = cl((tt - b - 0.7) / 0.4), pop = cl((tt - b - 1.1) / 0.45);
      if (rise <= 0 || pop >= 1) return null;
      const y = pass > 0 ? lerp(PY + 0.04, SY, eio(pass, 0, 1)) : lerp(0.04, PY - 0.055, rise);
      const sc: [number, number, number] = pass > 0 ? [0.85, 1.25, 0.85] : [1 + 0.35 * squash, 1 - 0.3 * squash, 1 + 0.35 * squash];
      return <group key={i}>
        {pop <= 0 && <mesh position={[0.006 * Math.sin(tt * 20 + i), y, 0]} scale={sc}><sphereGeometry args={[0.052, 28, 18]} /><meshPhysicalMaterial color="#eaf7ff" roughness={0.02} clearcoat={1} transparent opacity={0.72} emissive="#9fd8ff" emissiveIntensity={0.25} /></mesh>}
        {pop > 0 && <>
          <mesh position={[0, SY + 0.012, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03 + 0.16 * pop, 0.04 + 0.16 * pop, 48]} />{M.glow({ col: "#d8f0ff", op: 0.55 * (1 - pop) })}</mesh>
          {Array.from({ length: 10 }, (_, j) => { const a = j / 10 * 2 * PI + i; return <mesh key={j} position={[Math.cos(a) * 0.09 * pop, SY + 0.02 + 0.1 * Math.sin(PI * pop), Math.sin(a) * 0.09 * pop]}><sphereGeometry args={[0.008, 10, 8]} />{M.water({ op: 0.85 })}</mesh>; })}
          <mesh position={[0, SY + 0.02 + 0.18 * Math.sin(PI * pop), 0]} scale={[1, 1.3, 1]}><sphereGeometry args={[0.015, 14, 10]} />{M.water({ op: 0.9 })}</mesh>
        </>}
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 6:28 · LO QUE NECESITÁS: tablero perforado con siluetas blancas pintadas; cada herramienta vuela en arco a la suya ----
const boardTex = () => tex.text("pegb", 512, 320, (g) => {
  g.fillStyle = "#9a6a3a"; g.fillRect(0, 0, 512, 320);
  g.fillStyle = "#5a3a1c"; for (let y = 10; y < 320; y += 20) for (let x = 10; x < 512; x += 20) { g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); }
  g.strokeStyle = "#f1ead9"; g.lineWidth = 6; g.lineJoin = "round";
  g.beginPath(); g.arc(90, 110, 46, PI, 0); g.lineTo(98, 110); g.lineTo(98, 270); g.lineTo(82, 270); g.lineTo(82, 110); g.closePath(); g.stroke(); // sopapo
  g.strokeRect(190, 90, 34, 170); g.beginPath(); g.arc(207, 80, 22, 0, 7); g.stroke(); // linterna
  g.beginPath(); g.moveTo(300, 70); g.lineTo(390, 70); g.lineTo(372, 220); g.lineTo(318, 220); g.closePath(); g.stroke(); // balde
  g.beginPath(); g.moveTo(440, 60); g.lineTo(460, 60); g.lineTo(460, 250); g.lineTo(440, 250); g.closePath(); g.stroke(); g.strokeRect(426, 40, 48, 26); // llave
});
export const HPegboard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#24201c" key1={[-1.6, 1.6, 1.4]}
  cam={{ at: [0, 0.5, -0.9], az: [-0.12, 0.1], el: [0.04, 0.0], r: [1.25, 1.1], fov: 34 }}
  over={(tt) => <Head tt={tt} kick="" title="WHAT YOU NEED" col={AMB} />}>{(tt) => {
  const W = 1.1, Hh = 0.69, Z = -1.0, map = (px: number, py: number) => [-W / 2 + px / 512 * W, 0.5 + Hh / 2 - py / 320 * Hh, Z + 0.03] as [number, number, number];
  const fly = (a: number, to: [number, number, number], from: [number, number, number]) => { const k = cl(phys(tt, a, 6.5, 0.5)), u = cl((tt - a) / 0.55); const p = [lerp(from[0], to[0], k), lerp(from[1], to[1], k) + 0.18 * Math.sin(PI * u) * (1 - u * 0.4), lerp(from[2], to[2], k)]; return { p: p as [number, number, number], r: (1 - k) * 2.2, on: tt > a };
  };
  const T = [
    { a: 0.8, to: map(90, 170), el: <group><mesh position={[0, 0.07, 0]} scale={[1, 0.6, 1]} rotation={[PI / 2, 0, 0]}><sphereGeometry args={[0.07, 32, 16, 0, PI * 2, 0, PI / 2]} />{M.matte({ col: "#c2302a", side: THREE.DoubleSide })}</mesh><mesh position={[0, -0.05, 0.02]}><cylinderGeometry args={[0.01, 0.01, 0.2, 12]} />{M.wood({ base: [170, 112, 60] })}</mesh></group> },
    { a: 1.6, to: map(207, 160), el: <group><mesh><cylinderGeometry args={[0.022, 0.022, 0.16, 24]} />{M.plastic({ col: "#2b2b2b" })}</mesh><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.03, 0.022, 0.04, 24]} />{M.chrome()}</mesh></group> },
    { a: 2.4, to: map(345, 145), el: <mesh><cylinderGeometry args={[0.1, 0.075, 0.2, 32, 1, true]} />{M.plastic({ col: "#e6762a", side: THREE.DoubleSide } as never)}</mesh> },
    { a: 3.2, to: map(450, 150), el: <group><RBox s={[0.026, 0.24, 0.012]} r={0.004} p={[0, 0, 0]}>{M.steel()}</RBox><RBox s={[0.06, 0.03, 0.014]} r={0.004} p={[0, 0.13, 0]}>{M.steel()}</RBox></group> },
  ];
  return <>
    <mesh position={[0, 0.5, Z]} receiveShadow><planeGeometry args={[W, Hh]} /><meshStandardMaterial map={boardTex()} roughness={0.85} /></mesh>
    <mesh position={[0, 0.5, Z - 0.02]}><boxGeometry args={[W + 0.06, Hh + 0.06, 0.02]} />{M.wood({ base: [90, 58, 30] })}</mesh>
    {T.map((o, i) => { const f = fly(o.a, o.to, [o.to[0] * 0.3 + 0.2, -0.2, Z + 0.7]); return f.on ? <group key={i} position={[f.p[0], f.p[1], f.p[2] + 0.03]} rotation={[0, 0, f.r]}>{o.el}</group> : null; })}
  </>;
}}</Scene3D>;

// ---- 7:03 · MISMA MEDIDA: la tuerca del sifón baja sobre la tapa de un frasco y el contorno calza justo ----
export const HJarLid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile"
  cam={{ at: [0, 0.04, 0], az: [0.3, 0.1], el: [1.0, 1.42], r: [0.6, 0.48], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="SAME SIZE" col={AMB} />}>{(tt) => {
  const d = eio(tt, 1.0, 2.6), match = cl((tt - 2.7) / 0.6);
  return <>
    {/* la tapa dorada de un frasco, con su estriado */}
    <mesh position={[0, 0.015, 0]} castShadow><cylinderGeometry args={[0.07, 0.07, 0.03, 64]} />{M.brass({ col: "#c9a34a" })}</mesh>
    {Array.from({ length: 48 }, (_, i) => { const a = i / 48 * 2 * PI; return <mesh key={i} position={[Math.cos(a) * 0.071, 0.015, Math.sin(a) * 0.071]} rotation={[0, -a, 0]}><boxGeometry args={[0.003, 0.026, 0.004]} />{M.brass({ col: "#b08a3a" })}</mesh>; })}
    <mesh position={[0, 0.031, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.045, 0.06, 64]} />{M.brass({ col: "#e0bc62" })}</mesh>
    {/* la tuerca cromada del sifón baja y se apoya: los bordes coinciden */}
    <mesh geometry={hexNutG(0.066, 0.026, 0.036)} position={[0, 0.046 + 0.3 * (1 - d), 0]} rotation={[0, PI / 6, 0]} castShadow>{M.chrome({ col: "#b8bec6" })}</mesh>
    {match > 0 && <mesh position={[0, 0.034, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.07, 0.077, 64]} />{M.glow({ col: AMB, op: 0.75 * Math.sin(PI * cl(match * 0.8 + 0.2)) })}</mesh>}
    {match > 0 && <mesh position={[0, 0.034, 0]} rotation={[-PI / 2, 0, 0]} scale={1 + 0.5 * match}><ringGeometry args={[0.07, 0.073, 64]} />{M.glow({ col: AMB, op: 0.4 * (1 - match) })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 8:09 · ¿ENTONCES DÓNDE ESTÁ?: una banda de rayos X recorre los azulejos y deja ver los caños detrás; termina sobre el tapón rojo ----
export const HXray: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="none" bg="#1a1c1f"
  cam={{ at: [0, 0.58, -0.8], az: [-0.1, 0.06], el: [0.06, 0.04], r: [1.3, 1.15], fov: 34 }}
  over={(tt) => <Head tt={tt} kick="" title="SO WHERE IS IT?" col={ICE} />}>{(tt) => {
  const bx = lerp(-0.62, 0.0, eio(tt, 0.6, 3.8)), hw = 0.26, cy = 0.56, hh = 0.22, Z = -0.8, beat = cl((tt - 3.6) / 0.4) * (0.7 + 0.3 * Math.sin(tt * 7));
  const PIPE = [[-1.0, 0.7, Z - 0.09], [-0.14, 0.7, Z - 0.09], [-0.08, 0.64, Z - 0.09], [-0.08, 0.5, Z - 0.09], [0.0, 0.43, Z - 0.09], [0.08, 0.5, Z - 0.09], [0.08, 0.6, Z - 0.09], [0.15, 0.65, Z - 0.09], [1.0, 0.65, Z - 0.09]];
  return <>
    {/* detrás de la pared: oscuro, el sifón cromado y el tapón rojo que late en el codo */}
    <mesh position={[0, 0.6, Z - 0.18]}><planeGeometry args={[2.4, 1.4]} />{M.matte({ col: "#0b141a" })}</mesh>
    <mesh geometry={tubeG("xr2", PIPE, 0.036, 160, 20)}>{M.chrome()}</mesh>
    <group position={[0, 0.45, Z - 0.09]} scale={1 + 0.08 * beat}>
      <mesh scale={[1.3, 1, 1]}><sphereGeometry args={[0.045, 28, 18]} />{M.plastic({ col: "#d83a2a", em: RED, emI: 0.3 + 0.6 * beat })}</mesh>
      <Hair id="xrh" n={18} spread={0.05} r={0.0015} pts={[[-0.06, 0.02, 0.02], [-0.02, -0.02, 0.04], [0.03, 0.02, 0.03], [0.07, -0.01, 0.0]]} />
    </group>
    <pointLight position={[bx, cy, Z + 0.05]} intensity={0.3} distance={0.6} color="#9fd8ff" />
    {/* los azulejos uno por uno: dentro del escáner se vuelven vidrio azul */}
    {Array.from({ length: 15 * 7 }, (_, n) => { const i = n % 15, j = Math.floor(n / 15), x = -0.84 + 0.12 * i, y = 0.2 + 0.12 * j;
      const f = cl((hw - Math.abs(x - bx)) / 0.07) * cl((hh - Math.abs(y - cy)) / 0.07);
      return <RBox key={n} s={[0.114, 0.114, 0.012]} r={0.004} p={[x, y, Z]}><meshStandardMaterial color={f > 0.5 ? "#9fd8ff" : "#e4e9ec"} roughness={0.22} metalness={0.05} transparent opacity={1 - 0.9 * f} emissive="#3aa6e0" emissiveIntensity={0.3 * f} depthWrite={f < 0.5} /></RBox>; })}
    {/* el escáner: marco de metal con su línea de barrido */}
    <group position={[bx, cy, Z + 0.03]}>
      {[-1, 1].map((s) => <RBox key={"h" + s} s={[2 * hw + 0.06, 0.03, 0.03]} r={0.006} p={[0, s * (hh + 0.015), 0]}>{M.steel({ col: "#6d757b" })}</RBox>)}
      {[-1, 1].map((s) => <RBox key={"v" + s} s={[0.03, 2 * hh + 0.06, 0.03]} r={0.006} p={[s * (hw + 0.015), 0, 0]}>{M.steel({ col: "#6d757b" })}</RBox>)}
      <RBox s={[0.12, 0.03, 0.04]} r={0.008} p={[0, hh + 0.05, 0]}>{M.plastic({ col: "#222" })}</RBox>
      <mesh position={[0, hh * 0.9 * Math.sin(tt * 2.2), 0.01]}><planeGeometry args={[2 * hw, 0.006]} />{M.glow({ col: "#bfeaff", op: 0.7 })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 8:58 · CRECE COMO UN ÁRBOL: el caño cortado de frente junta grasa en anillos, año tras año, hasta que solo entra un lápiz ----
const ringG = (() => { const C = new Map<string, THREE.BufferGeometry>(); return (ro: number, ri: number, d: number) => { const k = `${ro.toFixed(3)}|${ri.toFixed(3)}|${d}`; let g = C.get(k); if (!g) { const s = new THREE.Shape(); s.absarc(0, 0, ro, 0, 2 * PI, false); const ho = new THREE.Path(); ho.absarc(0, 0, ri, 0, 2 * PI, true); s.holes.push(ho); g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 64 }); C.set(k, g); } return g; }; })();
export const HTreeRings: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark"
  cam={{ at: [0, 0.2, 0], az: [-0.45, -0.2], el: [0.25, 0.15], r: [0.94, 0.76], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="IT GROWS LIKE A TREE" col={AMB} />}>{(tt) => {
  const R0 = 0.15, cols = ["#e3cf8c", "#c9a85e", "#b48a3c", "#d6b870", "#9a6a2c", "#c49a52"];
  const n = cols.length, step = (R0 - 0.022) / n;
  const pen = eio(tt, 5.0, 6.4);
  return <group position={[0, 0.18, 0]}>
    {/* el caño de PVC cortado, largo hacia atrás */}
    <mesh geometry={ringG(R0 + 0.012, R0, 0.6)} position={[0, 0, -0.6]}>{M.pvc()}</mesh>
    {/* los anillos de grasa: uno por año, de afuera hacia adentro */}
    {cols.map((c, i) => { const k = cl(phys(tt, 0.7 + i * 0.65, 7, 0.55)); if (k <= 0.01) return null; const ro = R0 - i * step, ri = ro - step * k; return <mesh key={i} geometry={ringG(ro, Math.max(0.022, ri), 0.3 + 0.02 * i)} position={[0, 0, -0.3 - 0.02 * i + 0.004]}>{M.grease({ col: c })}</mesh>; })}
    {/* el lápiz amarillo que entra justo por el agujero que queda */}
    {tt > 4.9 && <group position={[0, 0, 0.5 - 0.42 * pen]} rotation={[PI / 2, 0, 0]}>
      <mesh><cylinderGeometry args={[0.018, 0.018, 0.4, 6]} />{M.plastic({ col: "#f2c13a" })}</mesh>
      <mesh position={[0, -0.23, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.018, 0.06, 6]} />{M.wood({ base: [214, 170, 120] })}</mesh>
      <mesh position={[0, 0.21, 0]}><cylinderGeometry args={[0.019, 0.019, 0.025, 12]} />{M.brass({ col: "#b8b8b0" })}</mesh>
      <mesh position={[0, 0.235, 0]}><cylinderGeometry args={[0.017, 0.017, 0.025, 12]} />{M.matte({ col: "#e98aa0" })}</mesh>
    </group>}
  </group>;
}}</Scene3D>;

// ---- 9:20 · SE MUERE EN EL CAMINO: el caño pasa por cuatro manómetros; la aguja de cada uno marca menos que la anterior y el último no se mueve ----
const Gauge: React.FC<{ v: number; p: [number, number, number] }> = ({ v, p }) => <group position={p}>
  <mesh position={[0, -0.07, 0]}><cylinderGeometry args={[0.008, 0.008, 0.06, 12]} />{M.brass()}</mesh>
  <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.055, 0.055, 0.025, 48]} />{M.chrome()}</mesh>
  <mesh position={[0, 0, 0.0128]}><circleGeometry args={[0.048, 48]} />{M.matte({ col: "#f4efe2" })}</mesh>
  {Array.from({ length: 9 }, (_, i) => { const a = PI * 1.25 - i / 8 * PI * 1.5; return <mesh key={i} position={[Math.cos(a) * 0.04, Math.sin(a) * 0.04, 0.0135]} rotation={[0, 0, a]}><planeGeometry args={[0.01, 0.002]} />{M.matte({ col: i > 6 ? "#c2302a" : "#222" })}</mesh>; })}
  <mesh position={[0, 0, 0.015]} rotation={[0, 0, PI * 1.25 - v * PI * 1.5]}><mesh position={[0.018, 0, 0]}><boxGeometry args={[0.038, 0.004, 0.002]} />{M.matte({ col: "#c2302a" })}</mesh></mesh>
  <mesh position={[0, 0, 0.0145]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.004, 16]} />{M.chrome()}</mesh>
  <mesh position={[0, 0, 0.026]}><circleGeometry args={[0.05, 48]} />{M.glass({ op: 0.12 })}</mesh>
</group>;
export const HRelay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="dark"
  cam={{ at: [-0.4, 0.24, 0], at1: [0.4, 0.24, 0], az: [-0.12, 0.12], el: [0.12, 0.08], r: [1.75, 1.6], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="IT DIES ON THE WAY" col={RED} />}>{(tt) => {
  const X = [-0.6, -0.2, 0.2, 0.6], peak = [0.92, 0.6, 0.3, 0.04];
  return <>
    <mesh geometry={tubeG("rel", [[-0.85, 0.1, 0], [0.85, 0.1, 0]], 0.03, 20, 24)}>{M.pvc({ col: "#a9adb1" })}</mesh>
    <mesh position={[0.86, 0.1, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.031, 0.031, 0.05, 24]} />{M.grease({ col: "#7a5a2c" })}</mesh>
    {X.map((x, i) => { const a = 0.9 + i * 0.75, k = Math.max(0, Math.sin(PI * cl((tt - a) / 1.1))), v = 0.02 + (peak[i] - 0.02) * k + 0.01 * Math.sin(tt * 40) * k;
      return <group key={i} position={[x, 0.24, 0]} scale={1.5}><Gauge v={v} p={[0, 0, 0]} /></group>; })}
  </>;
}}</Scene3D>;

// ---- 9:50 · 40 PIES DE GRASA: una víbora cerosa sale de la boca de limpieza y se enrolla en el piso del sótano junto a la cinta métrica que se estira ----
const tapeTex = () => tex.text("tape40", 1024, 64, (g) => {
  g.fillStyle = "#f2c13a"; g.fillRect(0, 0, 1024, 64); g.fillStyle = "#1b1b1b";
  for (let i = 0; i <= 160; i++) { const x = i * 6.4, l = i % 4 === 0 ? 26 : 12; g.fillRect(x, 0, 2, l); }
  g.font = "bold 30px sans-serif"; [10, 20, 30, 40].forEach((n, i) => g.fillText(String(n), (i + 1) * 256 - 40, 56));
});
const tapeG = (L: number) => { const g = new THREE.PlaneGeometry(1.2 * L, 0.05), uv = g.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * L); return g; };
export const HSnakeOut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark" warm={0.9}
  cam={{ at: [0.1, 0.02, 0.0], az: [-0.1, 0.25], el: [0.7, 0.6], r: [1.68, 1.48], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="40 FEET OF GREASE" col={AMB} />}>{(tt) => {
  const len = eio(tt, 0.6, 5.6);
  const path: number[][] = []; for (let i = 0; i <= 80; i++) { const u = i / 80, a = u * 3.4 * PI; const r = 0.5 - 0.36 * u; path.push([-0.55 + 0.55 + Math.cos(a + PI) * r + 0.05, 0.025, Math.sin(a + PI) * r * 0.7]); }
  path[0] = [-0.55, 0.06, 0];
  return <>
    {/* la boca de limpieza en el piso */}
    <mesh position={[-0.55, 0.01, 0]}><cylinderGeometry args={[0.06, 0.06, 0.02, 32]} />{M.steel({ col: "#7d8288" })}</mesh>
    <mesh position={[-0.55, 0.021, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.04, 32]} />{M.matte({ col: "#0a0a0a" })}</mesh>
    {len > 0.01 && <mesh geometry={tubeG("snk" + Math.round(len * 60), sub(path, len, 120), (u) => 0.022 * (0.85 + 0.15 * Math.sin(u * 60)), 240, 16)} castShadow>{M.grease({ col: "#d6c48a" })}</mesh>}
    {/* la cinta métrica que se estira al costado */}
    <group position={[-0.5, 0.003, 0.34]}>
      <RBox s={[0.1, 0.1, 0.05]} r={0.02} p={[-0.05, 0.05, 0]}>{M.plastic({ col: "#e6c23a" })}</RBox>
      {len > 0.01 && <mesh position={[0.6 * len, 0.004, 0]} rotation={[-PI / 2, 0, 0]} geometry={tapeG(len)}><meshStandardMaterial map={tapeTex()} roughness={0.5} /></mesh>}
    </group>
  </>;
}}</Scene3D>;
