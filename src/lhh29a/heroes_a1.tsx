// lhh29a · componentes únicos 1-8 (kit h3d: objeto real con material, luz con motivo, cámara que orbita en curva).
// ronda 2 (eval r1): cada tacita con su trabajo, cristal sobre platillo, macetas + regadera, ondas y vapor, campanita del reloj, balanza, lupa, dedo + pinza.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED } from "./hkit";
import { M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn, tubeG } from "./h3d";

const PI = Math.PI;
// textura de bolsa de papel kraft con el rótulo sencillo
const bagTex = () => tex.text("bagEpsom", 256, 384, (g) => {
  g.fillStyle = "#efe7d6"; g.fillRect(0, 0, 256, 384);
  for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(140,110,70,${0.05 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 384, 3, 3); }
  g.fillStyle = "#1f4f8a"; g.fillRect(0, 120, 256, 70); g.fillStyle = "#fff"; g.font = "900 38px Arial"; g.textAlign = "center"; g.fillText("EPSOM", 128, 152); g.font = "700 22px Arial"; g.fillText("SALT", 128, 180);
  g.fillStyle = "#3a2f22"; g.font = "700 20px Arial"; g.fillText("MAGNESIUM SULFATE", 128, 230);
});
// cristales: prismas chiquitos esparcidos
const Crystals: React.FC<{ n: number; c: number[]; r: number; s?: number; seed?: number; k?: number }> = ({ n, c, r, s = 0.006, seed = 1, k = 1 }) => <>
  {Array.from({ length: n }, (_, i) => { const a = rn(i, seed) * PI * 2, d = Math.sqrt(rn(i, seed + 1)) * r, hh = rn(i, seed + 2) * r * 0.5 * (1 - d / r);
    return k * n > i && <mesh key={i} position={[c[0] + Math.cos(a) * d, c[1] + hh + s / 2, c[2] + Math.sin(a) * d]} rotation={[rn(i, 5) * 3, rn(i, 6) * 3, rn(i, 7) * 3]} castShadow><boxGeometry args={[s, s * 1.6, s]} /><meshPhysicalMaterial color="#fbfdff" roughness={0.15} transmission={0.4} clearcoat={1} /></mesh>; })}
</>;
const leafShape = (() => { const s = new THREE.Shape(); s.moveTo(0, 0); s.bezierCurveTo(0.05, 0.03, 0.055, 0.11, 0, 0.16); s.bezierCurveTo(-0.055, 0.11, -0.05, 0.03, 0, 0); return new THREE.ShapeGeometry(s, 24); })();

// mini objeto de cada trabajo (sale de la tacita cuando se llena): hoja, aguja, esponja, tomate, pie, cepillo…
const Job: React.FC<{ i: number; s: number }> = ({ i, s }) => {
  const k = i % 8;
  return <group scale={Math.max(0.001, s)}>
    {k === 0 && <mesh geometry={leafShape} scale={0.45} rotation={[-0.4, 0, 0.2]}><meshStandardMaterial color="#3d8a34" side={THREE.DoubleSide} /></mesh>}
    {k === 1 && <mesh rotation={[0, 0, 0.6]} position={[0, 0.02, 0]}><cylinderGeometry args={[0.0018, 0.0018, 0.06, 8]} />{M.chrome()}</mesh>}
    {k === 2 && <RBox s={[0.04, 0.02, 0.03]} p={[0, 0.012, 0]} r={0.006}><meshStandardMaterial color="#f2c230" roughness={0.9} /></RBox>}
    {k === 3 && <mesh position={[0, 0.02, 0]}><sphereGeometry args={[0.02, 20, 14]} /><meshPhysicalMaterial color="#d8402c" roughness={0.3} clearcoat={0.8} /></mesh>}
    {k === 4 && <mesh position={[0, 0.016, 0]} scale={[0.7, 0.45, 1.3]}><sphereGeometry args={[0.025, 18, 12]} /><meshStandardMaterial color="#e9b9a0" roughness={0.6} /></mesh>}
    {k === 5 && <group rotation={[0, 0, 0.5]}><mesh position={[0, 0.025, 0]}><boxGeometry args={[0.006, 0.05, 0.006]} /><meshStandardMaterial color="#e86a9a" /></mesh><mesh position={[0, 0.052, 0.004]}><boxGeometry args={[0.008, 0.012, 0.01]} /><meshStandardMaterial color="#ffffff" /></mesh></group>}
    {k === 6 && <mesh position={[0, 0.02, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.016, 0.005, 10, 24]} /><meshStandardMaterial color="#6b8fd0" roughness={0.8} /></mesh>}
    {k === 7 && <mesh position={[0, 0.022, 0]}><coneGeometry args={[0.014, 0.04, 6]} /><meshStandardMaterial color="#8a5a2a" roughness={0.9} /></mesh>}
  </group>;
};

// ---- 0:24 · UNA BOLSA, 15 TRABAJOS: la bolsa se inclina y vuelca un chorro que viaja por las quince tacitas; de cada una sale su trabajo ----
export const HBag15: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark"
  cam={{ at: [0.1, 0.13, 0], az: [-0.45, 0.25], el: [0.42, 0.36], r: [1.22, 1.06], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="ONE $4 BAG · 15 JOBS" col={AMB} />}>{(tt) => {
  const tilt = eio(tt, 0.3, 1.0) * 1.9, run = cl((tt - 1.0) / 4.2), cur = Math.min(14, Math.floor(run * 15));
  const cx = -0.12 + (cur % 5) * 0.12, cz = -0.14 + Math.floor(cur / 5) * 0.14;
  // la bolsa viaja sobre la tacita que se está llenando
  const bx = lerp(-0.3, cx + 0.06, eio(tt, 0.6, 1.2)), bz = lerp(-0.05, cz, eio(tt, 0.6, 1.2));
  return <>
    <group position={[bx, 0.24 + 0.04 * Math.sin(tt * 3), bz]} rotation={[0, 0.3, -tilt]}>
      <RBox s={[0.12, 0.2, 0.08]} r={0.008}><meshStandardMaterial map={bagTex()} roughness={0.85} /></RBox>
    </group>
    {run > 0 && run < 1 && <mesh position={[cx + 0.01, 0.15, cz]}><cylinderGeometry args={[0.004, 0.007, 0.16, 8]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.75} /></mesh>}
    {Array.from({ length: 15 }, (_, i) => {
      const r = Math.floor(i / 5), c = i % 5, a = 1.0 + i * 0.28, fill = cl((tt - a) / 0.28), pop = phys(tt, 0.1 + i * 0.03, 9, 0.45), job = phys(tt, a + 0.28, 8, 0.4);
      const x = -0.12 + c * 0.12, z = -0.14 + r * 0.14;
      return <group key={i} position={[x, (1 - cl(pop)) * 0.2, z]}>
        <mesh position={[0, 0.03, 0]} castShadow receiveShadow><cylinderGeometry args={[0.042, 0.036, 0.06, 32, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
        <mesh position={[0, 0.001, 0]}><cylinderGeometry args={[0.036, 0.036, 0.002, 32]} />{M.steel()}</mesh>
        <mesh position={[0, 0.005 + 0.045 * fill, 0]} scale={[1, Math.max(0.001, fill), 1]}><cylinderGeometry args={[0.04, 0.036, 0.008, 32]} /><meshPhysicalMaterial color="#f8fbff" roughness={0.35} clearcoat={0.6} /></mesh>
        <group position={[0, 0.06 + 0.035 * cl(job), 0]}><Job i={i} s={cl(job) * 2.1} /></group>
      </group>;
    })}
  </>;
}}</Scene3D>;

// ---- 0:57 · NADA MÁS QUE LA SAL: un cristal grande de sulfato de magnesio gira sobre un platillo, luz rasante que lo atraviesa; la bolsa atrás ----
const ICEM = () => <meshPhysicalMaterial color="#eef8ff" roughness={0.03} transmission={0.75} thickness={0.3} ior={1.5} clearcoat={1} attenuationColor="#cfe8ff" attenuationDistance={0.6} />;
const CL: [number, number, number, number, number][] = [[0, 0, 0, 0.1, 0], [0.09, -0.03, 0.03, 0.065, 0.7], [-0.085, -0.04, 0.02, 0.06, -0.6], [0.04, -0.06, -0.07, 0.05, 1.3], [-0.04, -0.07, 0.08, 0.045, -1.1], [0.13, -0.08, -0.03, 0.035, 0.4], [-0.12, -0.085, -0.05, 0.04, -0.3]];
export const HCrystals: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" key1={[-1.6, 0.9, 0.4]}
  cam={{ at: [0.06, 0.16, 0], az: [0.6, -0.35], el: [0.3, 0.38], r: [1.1, 0.95], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="NOTHING BUT THE SALT" col={ICE} />}>{(tt) => {
  const set = phys(tt, 0.1, 6, 0.5), spin = tt * 0.32, pour = eio(tt, 2.0, 2.8);
  return <>
    {/* platillo de loza con filete azul */}
    <mesh position={[0, 0.008, 0]} castShadow receiveShadow><cylinderGeometry args={[0.2, 0.15, 0.016, 64]} />{M.porcelain()}</mesh>
    <mesh position={[0, 0.0165, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.17, 0.178, 64]} /><meshStandardMaterial color="#2f5fa8" /></mesh>
    <group position={[0, 0.1 + (1 - cl(set)) * 0.25, 0]} rotation={[0.12, spin, 0.06]}>
      {CL.map(([x, y, z, r, ry], i) => <mesh key={i} position={[x, y, z]} rotation={[0.2 * ry, ry, 0.35 * ry]} scale={[1, 1.7, 1]} castShadow><octahedronGeometry args={[r, 0]} />{ICEM()}</mesh>)}
    </group>
    <Crystals n={120} c={[0, 0.016, 0]} r={0.17} s={0.01} k={eio(tt, 0.4, 1.8)} />
    {/* la bolsa atrás se inclina y deja caer su hilo de sal sobre el platillo */}
    <group position={[0.3, 0.2, -0.22]} rotation={[0, -0.4, 0.9 * pour]}><RBox s={[0.16, 0.26, 0.1]} r={0.008}><meshStandardMaterial map={bagTex()} roughness={0.85} /></RBox></group>
    {pour > 0.5 && <mesh position={[0.17, 0.1, -0.12]}><cylinderGeometry args={[0.003, 0.006, 0.16, 8]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.7 * cl((pour - 0.5) * 3)} /></mesh>}
  </>;
}}</Scene3D>;

// ---- 1:11 · NUEVE DÍAS: nueve macetas de barro en fila; la regadera pasa por encima de cada una y esa planta pasa de amarilla a verde ----
const Pot: React.FC<{ g: number; up: number }> = ({ g, up }) => {
  const col = new THREE.Color("#d9bf3a").lerp(new THREE.Color("#2f7a2a"), g);
  return <>
    <mesh position={[0, 0.03, 0]} castShadow receiveShadow><cylinderGeometry args={[0.038, 0.028, 0.06, 28]} /><meshStandardMaterial color="#b4643a" roughness={0.85} /></mesh>
    <mesh position={[0, 0.062, 0]}><cylinderGeometry args={[0.042, 0.042, 0.01, 28]} /><meshStandardMaterial color="#a2552f" roughness={0.85} /></mesh>
    <mesh position={[0, 0.064, 0]}><cylinderGeometry args={[0.035, 0.035, 0.004, 24]} /><meshStandardMaterial color={new THREE.Color("#8a6a48").lerp(new THREE.Color("#3a2614"), g)} roughness={1} /></mesh>
    <mesh position={[0, 0.064 + 0.05 * up, 0]} castShadow><cylinderGeometry args={[0.003, 0.004, 0.1 * up, 8]} />{M.matte({ col: "#4c6a2a" })}</mesh>
    {[0, 1, 2].map((j) => <mesh key={j} geometry={leafShape} position={[0, 0.07 + (0.03 + j * 0.028) * up, 0]} rotation={[-0.5 + 0.35 * g, j * 2.1, (j % 2 ? 1 : -1) * (0.9 - 0.25 * g)]} scale={Math.max(0.001, up * (0.42 + 0.12 * g))} castShadow>
      <meshStandardMaterial color={col} roughness={0.55} side={THREE.DoubleSide} /></mesh>)}
  </>;
};
export const HNineDays: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood"
  cam={{ at: [0, 0.1, 0], az: [-0.25, 0.2], el: [0.42, 0.34], r: [1.15, 0.98], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="GREEN AGAIN IN 9 DAYS" col={GRN} />}>{(tt) => {
  const step = 0.52, t0 = 1.1, run = (tt - t0) / step, cur = Math.max(0, Math.min(8, Math.floor(run)));
  const cx = lerp(-0.4 + cur * 0.1, -0.4 + Math.min(8, cur + 1) * 0.1, eio(run - cur, 0.6, 1));
  return <>
    {Array.from({ length: 9 }, (_, i) => {
      const a = t0 + i * step + 0.15, g = eio(tt, a, a + 0.45), up = phys(tt, 0.1 + i * 0.05, 8, 0.45);
      return <group key={i} position={[-0.4 + i * 0.1, 0, (i % 2) * 0.03]}><Pot g={g} up={cl(up)} /></group>;
    })}
    {/* regadera de lata verde: viaja de maceta en maceta y se inclina */}
    {tt > t0 - 0.5 && <group position={[cx + 0.08, 0.3 + (1 - eio(tt, t0 - 0.5, t0)) * 0.3, -0.02]} rotation={[0, 0, 0.55 * (0.5 + 0.5 * Math.sin((run % 1) * PI))]}>
      <mesh castShadow><cylinderGeometry args={[0.05, 0.055, 0.09, 32]} /><meshStandardMaterial color="#5f8a5a" metalness={0.6} roughness={0.35} /></mesh>
      <mesh position={[-0.075, 0.015, 0]} rotation={[0, 0, 1.0]} castShadow><cylinderGeometry args={[0.006, 0.01, 0.12, 12]} /><meshStandardMaterial color="#5f8a5a" metalness={0.6} roughness={0.35} /></mesh>
      <mesh position={[0.02, 0.07, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.035, 0.006, 8, 24, PI]} /><meshStandardMaterial color="#4c7448" metalness={0.6} roughness={0.35} /></mesh>
      {Array.from({ length: 7 }, (_, j) => { const f = ((tt * 2.2 + j / 7) % 1); return <mesh key={j} position={[-0.125 + rn(j, 3) * 0.01, -0.025 - f * 0.17, rn(j, 4) * 0.01]}><sphereGeometry args={[0.0035, 8, 6]} />{M.water({ op: 0.8 })}</mesh>; })}
    </group>}
  </>;
}}</Scene3D>;

// ---- 1:49 · LA PALANGANA DE SU MADRE: esmaltada blanca de borde azul; se llena, la cuchara vuelca la sal, anillos en el agua y vapor tibio ----
export const HBasin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="tile"
  cam={{ at: [0.02, 0.08, 0], az: [0.55, 0.1], el: [0.6, 0.42], r: [0.95, 0.78], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="THE SUNDAY BASIN" col={ICE} />}>{(tt, u) => {
  const w = eio(tt, 0.2, 1.4), spoon = phys(tt, 1.2, 5, 0.5), tip = eio(tt, 2.0, 2.6), salt = cl((tt - 2.2) / 0.5), dis = eio(tt, 3.0, 5.6);
  const geo = new THREE.LatheGeometry([[0, 0], [0.15, 0], [0.2, 0.06], [0.235, 0.12], [0.25, 0.125], [0.245, 0.13]].map(([x, y]) => new THREE.Vector2(x, y)), 64);
  const lv = 0.012 + 0.09 * w;
  return <>
    <mesh geometry={geo} castShadow receiveShadow>{M.porcelain({ side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.127, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.248, 0.006, 10, 80]} /><meshStandardMaterial color="#2f5fa8" roughness={0.3} /></mesh>
    <group position={[0.17, 0.085, 0.165]} rotation={[0, 0.8, 0.25]}>
      <mesh><circleGeometry args={[0.03, 9]} /><meshStandardMaterial color="#8d97a3" roughness={0.4} metalness={0.5} /></mesh>
      <mesh position={[0, 0, 0.0005]} scale={[0.75, 0.62, 1]}><circleGeometry args={[0.03, 7]} /><meshStandardMaterial color="#3f4854" roughness={0.55} metalness={0.6} /></mesh>
    </group>
    <mesh position={[0, lv, 0]} scale={[1, 1, 1]}><cylinderGeometry args={[0.15 + 0.085 * w, 0.15, 0.004, 64]} />{M.water({ op: 0.6 * cl(w * 4) + 0.25 * Math.sin(PI * dis), col: "#" + new THREE.Color("#a9d6ee").lerp(new THREE.Color("#eef2f2"), 0.8 * Math.sin(PI * dis)).getHexString() })}</mesh>
    {/* cuchara de lata con sal que entra y se vuelca */}
    <group position={[0.06, 0.24 + (1 - cl(spoon)) * 0.25 + 0.45 * eio(tt, 3.0, 4.0), 0.02]} rotation={[0, -0.5, -1.3 * tip]}>
      <mesh position={[0.12, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.006, 0.008, 0.18, 12]} />{M.steel()}</mesh>
      <mesh scale={[1, 0.38, 0.8]}><sphereGeometry args={[0.04, 24, 12, 0, PI * 2, PI / 2, PI / 2]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      {salt < 0.3 && <Crystals n={40} c={[0, -0.006, 0]} r={0.03} s={0.01} seed={7} />}
    </group>
    {salt > 0 && salt < 1 && Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[0.03 + rn(i, 8) * 0.02, 0.22 - ((tt - 2.2 + rn(i, 9) * 0.4) % 0.5) * 0.25, 0.02 + rn(i, 10) * 0.02]}><boxGeometry args={[0.01, 0.016, 0.01]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1} /></mesh>)}
    {salt > 0 && <Crystals n={110} c={[0.02, lv - 0.004, 0.01]} r={0.05 + 0.13 * dis} s={0.013} k={cl(salt * 1.5) * (1 - dis)} seed={3} />}
    {/* anillos concéntricos donde cae la sal */}
    {Array.from({ length: 8 }, (_, j) => { const k = ((tt - 2.3 - j * 0.3) / 1.5), ox = (rn(j, 11) - 0.5) * 0.12, oz = (rn(j, 12) - 0.5) * 0.12; return k > 0 && k < 1 && <mesh key={j} position={[0.03 + ox, lv + 0.003, 0.02 + oz]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.006 + 0.13 * k, 0.014 + 0.13 * k, 64]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8 * (1 - k)} depthWrite={false} /></mesh>; })}
    {/* un cristal grande, cerca de cámara, que se va achicando en el agua tibia */}
    {salt > 0 && <group position={[0.07, lv + 0.012, 0.1]} rotation={[0.3, tt * 0.4, 0.2]} scale={Math.max(0.001, 0.05 * cl(salt * 2) * (1 - 0.95 * dis))}><mesh scale={[1, 1.6, 1]}><octahedronGeometry args={[1, 0]} />{ICEM()}</mesh></group>}
    {/* vapor tibio: hilos que suben y se abren */}
    {Array.from({ length: 6 }, (_, j) => { const f = ((tt * 0.35 + j / 6) % 1); return <mesh key={"v" + j} position={[-0.1 + j * 0.04 + 0.03 * Math.sin(tt + j), lv + 0.02 + f * 0.28, -0.05 + 0.02 * j]} scale={0.6 + f * 1.6}><sphereGeometry args={[0.02, 12, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.16 * w * Math.sin(f * PI)} depthWrite={false} /></mesh>; })}
    {(() => { const st = eio(tt, 3.6, 5.8); return <>
      {[[0.66, -0.05, -0.03], [0.86, 0.06, 0.05]].map(([u0, gx, gz], g) => { const dp = cl((u - u0) / 0.08), rg = cl((u - u0 - 0.08) / 0.16); return <group key={"gota" + g}>
        {dp > 0 && dp < 1 && <mesh position={[gx, lerp(0.42, lv, dp * dp), gz]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.014, 16, 12]} />{M.water({ op: 0.9, col: "#cfe8f6" })}</mesh>}
        {rg > 0 && rg < 1 && [0, 1, 2].map((k) => <mesh key={k} position={[gx, lv + 0.003, gz]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.01 + (0.15 - k * 0.04) * rg, 0.02 + (0.15 - k * 0.04) * rg, 48]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.9 * (1 - rg * 0.8)} depthWrite={false} /></mesh>)}
        {rg > 0 && rg < 0.5 && <mesh position={[gx, lv + 0.02 * Math.sin(PI * rg * 2), gz]}><cylinderGeometry args={[0.006, 0.012, 0.04 * Math.sin(PI * rg * 2) + 0.001, 12]} />{M.water({ op: 0.8, col: "#e6f3fa" })}</mesh>}
      </group>; })}
      {Array.from({ length: 30 }, (_, k) => <mesh key={"tb" + k} position={[(rn(k, 21) - 0.5) * 0.3, lerp(lv - 0.01, 0.006, st * (0.6 + 0.4 * rn(k, 22))), (rn(k, 23) - 0.5) * 0.3]}><sphereGeometry args={[0.003, 8, 6]} /><meshStandardMaterial color="#e9eef2" transparent opacity={0.6 * cl((tt - 3.4) * 2)} /></mesh>)}
    </>; })()}
  </>;
}}</Scene3D>;

// ---- 2:39 · QUINCE MINUTOS: el reloj de cuerda gira hasta el 15; al final la campanita con martillo suena (martillo que golpea, anillos de sonido) ----
const dialTex = () => tex.text("eggdial3", 1024, 160, (g) => {
  g.fillStyle = "#f6f1e6"; g.fillRect(0, 0, 1024, 160); g.fillStyle = "#2a2018"; g.font = "900 40px Arial"; g.textAlign = "center";
  for (let m = 0; m < 60; m += 5) { g.fillStyle = m === 15 ? "#c4302b" : "#2a2018"; g.font = m === 15 ? "900 52px Arial" : "900 40px Arial"; g.fillText(String(m), (m / 60) * 1024 + 20, 76); }
  g.fillStyle = "#2a2018"; for (let m = 0; m < 60; m++) g.fillRect((m / 60) * 1024, 108, 3, m % 5 ? 18 : 40);
});
export const HEggTimer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile"
  cam={{ at: [0.07, 0.11, 0], az: [-0.08, 0.16], el: [0.2, 0.16], r: [0.56, 0.48], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="15 MINUTES · NOT ONE MORE" col={AMB} />}>{(tt) => {
  // gira hasta el 15 (la cifra roja queda al frente) y después corre de vuelta a cero: suena
  const wind = eio(tt, 0.5, 1.8) * 15 * (1 - eio(tt, 2.4, 4.6)), ang = PI / 2 + (wind / 60) * PI * 2 - 0.16;
  const ring = cl((tt - 4.6) / 1.6), ham = ring > 0 ? Math.sin(ring * PI * 9) * (1 - ring) : 0;
  const land = (1 - phys(tt, 0.05, 8, 0.38)) * 0.35;
  return <group position={[0, land, 0]}>
    <mesh position={[0, 0.04, 0]} castShadow><cylinderGeometry args={[0.07, 0.075, 0.08, 48]} /><meshStandardMaterial color="#c4302b" metalness={0.4} roughness={0.35} /></mesh>
    <mesh position={[0, 0.105, 0]} rotation={[0, ang, 0]} castShadow><cylinderGeometry args={[0.071, 0.071, 0.05, 64, 1, true]} /><meshStandardMaterial map={dialTex()} roughness={0.5} /></mesh>
    <mesh position={[0, 0.13, 0]} rotation={[0, ang, 0]} castShadow><sphereGeometry args={[0.071, 48, 24, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#f6f1e6" roughness={0.4} /></mesh>
    <mesh position={[0, 0.2, 0]} rotation={[0, ang, 0]}><cylinderGeometry args={[0.012, 0.016, 0.03, 20]} />{M.chrome()}</mesh>
    <mesh position={[0, 0.135, 0.075]} rotation={[-PI / 2, 0, 0]}><coneGeometry args={[0.009, 0.022, 3]} /><meshStandardMaterial color="#1b1b1b" /></mesh>
    {/* campanita de bronce a la derecha y su martillo */}
    <group position={[0.17, 0, 0.02]}>
      <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.012, 0.03, 0.06, 24]} />{M.chrome({ col: "#c9ccd0" })}</mesh>
      <mesh position={[0, 0.1, 0]} castShadow><sphereGeometry args={[0.045, 36, 18, 0, PI * 2, 0, PI / 2]} />{M.brass({ em: "#ffb84a", emI: 0.3 * Math.abs(ham) })}</mesh>
      <mesh position={[0, 0.148, 0]}><sphereGeometry args={[0.008, 12, 8]} />{M.brass()}</mesh>
      <group position={[-0.06, 0.06, 0]} rotation={[0, 0, -0.5 + 0.45 * ham]}>
        <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.003, 0.003, 0.08, 8]} />{M.steel()}</mesh>
        <mesh position={[0, 0.082, 0]}><sphereGeometry args={[0.009, 12, 8]} />{M.steel({ col: "#555" })}</mesh>
      </group>
      {[0, 1, 2].map((j) => { const k = ((ring * 3 - j * 0.6) % 1); return ring > 0 && ring < 1 && k > 0 && <mesh key={j} position={[0, 0.12, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.05 + 0.12 * k, 0.0015, 6, 48]} />{M.glow({ col: AMB, op: 0.6 * (1 - k) })}</mesh>; })}
    </group>
    {/* la palangana a la izquierda, entera en cuadro, con vapor */}
    <mesh position={[-0.24, 0.03, -0.12]} castShadow><cylinderGeometry args={[0.13, 0.1, 0.06, 48]} />{M.porcelain()}</mesh>
    <mesh position={[-0.24, 0.058, -0.12]}><cylinderGeometry args={[0.122, 0.122, 0.003, 48]} />{M.water({ op: 0.55, col: "#a9d6ee" })}</mesh>
  </group>;
}}</Scene3D>;

// ---- 3:09 · ONCE CENTAVOS: balanza de dos platillos; de un lado la media taza de sal, del otro caen la moneda de 10 y la de 1 y la balanza se equilibra ----
const coinTex = (k: string, col: string, txt: string) => tex.text("coin" + k, 128, 128, (g) => { g.fillStyle = col; g.beginPath(); g.arc(64, 64, 64, 0, 7); g.fill(); g.strokeStyle = "rgba(0,0,0,.25)"; g.lineWidth = 6; g.beginPath(); g.arc(64, 64, 56, 0, 7); g.stroke(); g.fillStyle = "rgba(0,0,0,.45)"; g.font = "900 40px Arial"; g.textAlign = "center"; g.fillText(txt, 64, 78); });
export const HCoins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [0.05, 0.23, 0], az: [0.12, -0.08], el: [0.24, 0.2], r: [0.84, 0.76], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="11¢ A SOAK" col={AMB} />}>{(tt) => {
  const c1 = phys(tt, 1.2, 9, 0.3), c2 = phys(tt, 2.0, 9, 0.3);
  // sin monedas la sal tira hacia abajo; cada moneda devuelve la viga (resorte con peso)
  const tiltA = -0.32 + 0.2 * cl(phys(tt, 1.35, 5, 0.35)) + 0.12 * cl(phys(tt, 2.15, 5, 0.35)) + [2.8, 3.4, 4.0].reduce((a, s) => a + 0.035 * cl(phys(tt, s + 0.15, 5, 0.3)), 0) - 0.105 + 0.04 * Math.sin(tt * 5) * Math.exp(-Math.max(0, tt - 4.1) * 0.9) * cl(tt - 1.2);
  const L = 0.2, yA = Math.sin(tiltA) * L;
  const Pan: React.FC<{ x: number; y: number; children?: React.ReactNode }> = ({ x, y, children }) => <group position={[x, 0.26 + y, 0]}>
    {[0, 1, 2].map((j) => <mesh key={j} position={[Math.cos(j * 2.1) * 0.035, -0.05, Math.sin(j * 2.1) * 0.035]} rotation={[Math.sin(j * 2.1) * 0.6, 0, -Math.cos(j * 2.1) * 0.6]}><cylinderGeometry args={[0.0008, 0.0008, 0.11, 4]} />{M.brass()}</mesh>)}
    <group position={[0, -0.105, 0]}>
      <mesh castShadow receiveShadow><cylinderGeometry args={[0.095, 0.08, 0.01, 40]} />{M.brass()}</mesh>
      {children}
    </group>
  </group>;
  return <>
    <mesh position={[0, 0.002, 0]} castShadow receiveShadow><cylinderGeometry args={[0.09, 0.1, 0.012, 40]} /><meshStandardMaterial color="#3a2414" roughness={0.6} /></mesh>
    <mesh position={[0, 0.135, 0]} castShadow><cylinderGeometry args={[0.008, 0.012, 0.25, 16]} />{M.brass()}</mesh>
    <mesh position={[0, 0.265, 0]} rotation={[0, 0, tiltA]} castShadow><boxGeometry args={[2 * L + 0.02, 0.01, 0.012]} />{M.brass()}</mesh>
    <mesh position={[0, 0.265, 0.008]}><sphereGeometry args={[0.012, 16, 12]} />{M.brass()}</mesh>
    <Pan x={-L} y={-yA}>
      <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.045, 0.04, 0.05, 32, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.043, 0.043, 0.006, 32]} /><meshPhysicalMaterial color="#f8fbff" roughness={0.4} /></mesh>
      <Crystals n={30} c={[0, 0.053, 0]} r={0.035} s={0.007} seed={9} />
    </Pan>
    <Pan x={L} y={yA}>
      <mesh position={[-0.01, 0.01 + (1 - cl(c1)) * 0.3, 0.005]} rotation={[0.25, 0, 0.1]} castShadow><cylinderGeometry args={[0.062, 0.062, 0.008, 48]} /><meshStandardMaterial map={coinTex("d", "#c9ccd0", "10¢")} metalness={0.9} roughness={0.25} /></mesh>
      <mesh position={[0.012, 0.019 + (1 - cl(c2)) * 0.3, -0.008]} rotation={[0.25, 0, -0.08]} castShadow><cylinderGeometry args={[0.07, 0.07, 0.008, 48]} /><meshStandardMaterial map={coinTex("p", "#b96a3a", "1¢")} metalness={0.9} roughness={0.3} /></mesh>
      {[2.8, 3.4, 4.0].map((s, k) => { const c = phys(tt, s, 9, 0.3); return c > 0 && <mesh key={k} position={[(k - 1) * 0.02, 0.028 + k * 0.009 + (1 - cl(c)) * 0.3, 0.01 * k]} rotation={[0.2, k, 0.05 * k]} castShadow><cylinderGeometry args={[0.055, 0.055, 0.008, 48]} /><meshStandardMaterial map={coinTex("p", "#b96a3a", "1¢")} metalness={0.9} roughness={0.3} /></mesh>; })}
    </Pan>
  </>;
}}</Scene3D>;

// ---- 3:45 · LARGA COMO UNA AGUJA DE COSER: la lupa pasa sobre la astilla y la aguja acostadas en la cinta métrica: misma medida ----
const tapeTex = () => tex.text("tape2", 512, 96, (g) => { g.fillStyle = "#f3d65a"; g.fillRect(0, 0, 512, 96); g.fillStyle = "#2a1f12";
  for (let i = 0; i <= 64; i++) g.fillRect(i * 8, 0, 2, i % 8 ? (i % 4 ? 14 : 24) : 36); g.font = "700 26px Arial"; g.textAlign = "center"; for (let i = 0; i <= 8; i++) g.fillText(String(i), i * 64, 70); });
export const HNeedle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0.0, 0.03, -0.02], az: [-0.15, 0.1], el: [0.95, 0.82], r: [0.52, 0.46], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="AS LONG AS A SEWING NEEDLE" col={RED} />}>{(tt, u) => {
  const tp = eio(tt, 0.1, 0.8), a = phys(tt, 0.5, 7, 0.45), b = phys(tt, 1.1, 7, 0.45), m = phys(tt, 3.6, 6, 0.5);
  const lx = lerp(-0.16, 0.05, eio(u, 0.3, 0.95)), lz = 0;
  return <group scale={1.5}>
    <mesh position={[-0.11 + 0.11 * tp, 0.0012, 0]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, tp), 1, 1]}><planeGeometry args={[0.22, 0.04]} /><meshStandardMaterial map={tapeTex()} roughness={0.6} /></mesh>
    <mesh position={[0, 0.006, 0.03 + (1 - a) * 0.3]} rotation={[0, 0, PI / 2]} castShadow geometry={tubeG("splinter2", [[0, -0.06, 0], [0.002, 0, 0], [-0.001, 0.06, 0]], (u) => 0.0055 * (1 - Math.pow(Math.abs(u - 0.4) * 1.6, 2)) + 0.0009)}><meshStandardMaterial map={tex.wood(1, 2, [176, 132, 82])} roughness={0.8} /></mesh>
    <group position={[0, 0.004, -0.03 - (1 - b) * 0.3]} rotation={[0, 0, PI / 2]}>
      <mesh castShadow><cylinderGeometry args={[0.0022, 0.0022, 0.12, 12]} />{M.chrome()}</mesh>
      <mesh position={[0, -0.063, 0]}><coneGeometry args={[0.0022, 0.01, 12]} />{M.chrome()}</mesh>
      <mesh position={[0, 0.057, 0]}><torusGeometry args={[0.0035, 0.001, 8, 20]} />{M.chrome()}</mesh>
    </group>
    <pointLight position={[lx - 0.05, 0.03, 0.12]} intensity={0.5} distance={0.4} color="#ffe2b0" />
    {/* lupa de mango negro: lente que agranda lo que tiene debajo */}
    <group position={[lx, 0.05, lz]}>
      <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.05, 0.004, 12, 48]} />{M.chrome({ col: "#2a2a2a" })}</mesh>
      <mesh rotation={[-PI / 2, 0, 0]} scale={[1, 1, 0.18]}><sphereGeometry args={[0.05, 40, 20]} /><meshPhysicalMaterial color="#eef6ff" roughness={0} clearcoat={1} transparent opacity={0.16} depthWrite={false} /></mesh>
      <mesh position={[0.09, 0, 0.0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.006, 0.007, 0.08, 12]} /><meshStandardMaterial color="#1a1a1a" roughness={0.5} /></mesh>
    </group>
    {/* la lupa "agranda": burbuja ampliada flotando, astilla arriba y aguja abajo, mismo largo */}
    {(() => { const z = 0; return z > 0 && <group position={[-0.07, 0.035, -0.022]} rotation={[-1.0, 0, 0]} scale={Math.max(0.001, z * 0.55)}>
      <mesh position={[0, 0, -0.004]}><circleGeometry args={[0.1, 48]} /><meshStandardMaterial color="#d8b88a" roughness={0.8} bumpMap={tex.paper(2, 2)} bumpScale={4} /></mesh>
      <mesh><torusGeometry args={[0.1, 0.005, 10, 48]} />{M.chrome({ col: "#2a2a2a" })}</mesh>
      <mesh position={[0, 0.025, 0.006]} rotation={[0, 0, PI / 2]} geometry={tubeG("splinterBig", [[0, -0.075, 0], [0.003, 0, 0], [-0.002, 0.075, 0]], (u) => 0.011 * (1 - Math.pow(Math.abs(u - 0.4) * 1.6, 2)) + 0.002)}><meshStandardMaterial map={tex.wood(1, 2, [176, 132, 82])} roughness={0.8} /></mesh>
      <group position={[0, -0.025, 0.006]} rotation={[0, 0, PI / 2]}><mesh><cylinderGeometry args={[0.004, 0.004, 0.14, 12]} />{M.chrome()}</mesh><mesh position={[0, -0.075, 0]}><coneGeometry args={[0.004, 0.012, 12]} />{M.chrome()}</mesh></group>
      {[-0.075, 0.075].map((x, i) => <mesh key={i} position={[x, 0, 0.008]}><boxGeometry args={[0.003, 0.09, 0.002]} />{M.glow({ col: RED, op: 0.9 })}</mesh>)}
    </group>; })()}
    {/* dos marcas rojas caen en las puntas: mismo largo */}
  </group>;
}}</Scene3D>;

// ---- 4:29 · SALE POR DONDE ENTRÓ: la yema del dedo con la astilla clavada en ángulo; se remoja, la pinza la toma y sale por la misma línea de luz ----
export const HAngle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark"
  cam={{ at: [0.03, 0.09, 0], az: [0.5, -0.2], el: [0.36, 0.3], r: [0.42, 0.36], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="SAME ANGLE IT WENT IN" col={ICE} />}>{(tt) => {
  const soak = eio(tt, 0.4, 1.8), path = cl((tt - 1.9) * 1.6), grab = eio(tt, 2.6, 3.3), out = eio(tt, 3.5, 5.6), L = 0.08;
  const ang = -0.6, ex = Math.sin(-ang), ey = Math.cos(-ang);
  const y = -L / 2 + 0.02 + (L + 0.04) * out;
  return <>
    {/* el dedo: cápsula acostada con uña */}
    <group position={[-0.02, 0.05, 0]} rotation={[0, 0, PI / 2]}>
      <mesh castShadow receiveShadow><capsuleGeometry args={[0.045, 0.22, 12, 32]} /><meshPhysicalMaterial color="#e8a98e" roughness={0.55} clearcoat={0.15 + 0.5 * soak} sheen={0.5} sheenColor="#ffd9c8" /></mesh>
      {[-0.02, -0.008, 0.004, 0.06, 0.07].map((y, j) => <mesh key={j} position={[0, y - 0.04, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.0452, 0.0009, 6, 40]} /><meshStandardMaterial color="#c08672" roughness={0.8} /></mesh>)}
      <mesh position={[0.038, -0.118, 0]} rotation={[0, 0, 0.1]} scale={[0.2, 0.7, 0.72]}><sphereGeometry args={[0.05, 24, 12]} /><meshPhysicalMaterial color="#f0c9bc" roughness={0.25} clearcoat={1} /></mesh>
    </group>
    {/* gotas de agua tibia sobre la piel */}
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-0.12 + rn(i, 2) * 0.22, 0.093, -0.02 + rn(i, 3) * 0.04]} scale={soak}><sphereGeometry args={[0.004, 10, 8]} />{M.water({ op: 0.8 })}</mesh>)}
    <group position={[0.04, 0.094, 0]} rotation={[0, 0, ang]}>
      <mesh position={[0, y, 0]} castShadow><boxGeometry args={[0.016, L, 0.014]} /><meshStandardMaterial map={tex.wood(1, 2, [176, 132, 82])} roughness={0.8} /></mesh>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0, 0.03 + i * 0.016, 0]} visible={path > i / 10}><sphereGeometry args={[0.0055, 10, 8]} />{M.glow({ col: ICE, op: 0.95 * (1 - out * 0.6) })}</mesh>)}
    </group>
    {/* la pinza baja por la línea, toma la punta y sube con ella */}
    <group position={[0.04 + ex * (0.16 + (L + 0.04) * out - 0.1 * grab), 0.094 + ey * (0.16 + (L + 0.04) * out - 0.1 * grab), 0]} rotation={[0, 0, ang]}>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * (0.014 - 0.006 * grab), 0.08, 0]} rotation={[0, 0, sd * 0.06]} castShadow><boxGeometry args={[0.008, 0.17, 0.018]} />{M.steel()}</mesh>)}
    </group>
  </>;
}}</Scene3D>;
