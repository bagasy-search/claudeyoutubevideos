// lch29a · componentes únicos 23-29.
import React from "react";
import * as THREE from "three";
import { AMB, GRN, H, ICE, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Motes, Sock, SockMitt, WallBB } from "./bb";

const PI = Math.PI;

// pelusa: bola despeinada de esferitas grises
const Bunny: React.FC<{ s?: number; seed?: number; wob?: number }> = ({ s = 1, seed = 0, wob = 0 }) => <group scale={s} rotation={[0, wob, 0]}>
  {Array.from({ length: 22 }, (_, i) => { const a = rn(i, seed + 2) * PI * 2, b = rn(i, seed + 3) * PI, r = 0.012 + 0.008 * rn(i, seed + 4); return <mesh key={i} position={[Math.cos(a) * Math.sin(b) * r, 0.012 + Math.cos(b) * r * 0.6, Math.sin(a) * Math.sin(b) * r]}><sphereGeometry args={[0.006 + 0.004 * rn(i, seed + 5), 7, 6]} /><meshStandardMaterial color={i % 3 ? "#9a948a" : "#7f796f"} roughness={1} /></mesh>; })}
  {Array.from({ length: 5 }, (_, i) => <mesh key={"h" + i} position={[0, 0.014, 0]} rotation={[rn(i, seed + 7) * 3, rn(i, seed + 8) * 3, 0]}><torusGeometry args={[0.02, 0.0006, 4, 24, 2.2]} /><meshStandardMaterial color="#3b332b" /></mesh>)}
</group>;

// ---- 13:58 · DETRÁS DE LA PUERTA: la puerta se cierra sobre su bisagra y aparece la familia de pelusas + la marca del picaporte ----
export const HDustBunnies: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none"
  cam={{ at: [0.05, 0.12, 0.1], az: [0.35, 0.15], el: [0.25, 0.3], r: [1.0, 0.8], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={150} txt="A WHOLE FAMILY" col={AMB} size={46} />}>{(tt) => {
  const shut = eio(tt, 0.5, 2.6), ang = lerp(-0.03, -1.5, shut);
  return <>
    <WallBB L={1.0} dust={0.2} />
    {/* marca negra del picaporte en la pared */}
    <mesh position={[-0.06, 0.38, -0.011]}><circleGeometry args={[0.022, 20]} /><meshStandardMaterial color="#3e3832" roughness={1} transparent opacity={0.85 * shut} /></mesh>
    {[0, 1, 2, 3, 4].map((i) => <group key={i} position={[-0.35 + i * 0.12 + 0.02 * rn(i, 9), 0, 0.03 + 0.02 * rn(i, 6)]}><Bunny s={(1.4 + 0.8 * rn(i, 4)) * (i === 2 ? 1.5 : 1)} seed={i * 3} wob={Math.sin(tt * 2 + i) * 0.15 * shut} /></group>)}
    {/* puerta: bisagra a la derecha, gira y se cierra hacia la pared */}
    <group position={[0.45, 0, 0.02]} rotation={[0, ang, 0]}>
      <RBox s={[0.8, 0.95, 0.035]} p={[-0.4, 0.48, 0.02]} r={0.006}><meshPhysicalMaterial color="#f1ece2" roughness={0.45} clearcoat={0.4} /></RBox>
      {[0.25, 0.7].map((y) => <RBox key={y} s={[0.6, 0.3, 0.006]} p={[-0.4, y, 0.04]} r={0.01}><meshPhysicalMaterial color="#ebe5d9" roughness={0.5} /></RBox>)}
      <mesh position={[-0.72, 0.42, 0.06]}><sphereGeometry args={[0.022, 20, 14]} />{M.brass()}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 14:40 · DOS SAQUITOS DE TÉ: caen al agua hirviendo en la jarra de vidrio y el ámbar se abre en espiral ----
export const HTeaBags: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile"
  cam={{ at: [0, 0.13, 0], az: [-0.2, 0.15], el: [0.18, 0.22], r: [0.62, 0.52], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={140} txt="2 BAGS · 1 QUART" col={AMB} size={46} />}>{(tt) => {
  const d1 = phys(tt, 0.6, 9, 0.5), d2 = phys(tt, 1.3, 9, 0.5), steep = eio(tt, 1.2, 5.5);
  const col = new THREE.Color("#dcebf0").lerp(new THREE.Color("#8a4a1c"), steep).getStyle();
  return <>
    {/* jarra medidora de vidrio */}
    <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.1, 0.09, 0.24, 48, 1, true]} />{M.glass({ side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.096, 0.088, 0.19, 48]} />{M.water({ col, op: 0.55 + 0.3 * steep })}</mesh>
    <mesh position={[0.12, 0.15, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.05, 0.008, 10, 30, PI]} />{M.glass()}</mesh>
    {[0.05, 0.1, 0.15].map((y, i) => <mesh key={i} position={[-0.075, y, 0.06]} rotation={[0, -0.7, 0]}><boxGeometry args={[0.03, 0.002, 0.001]} /><meshStandardMaterial color="#c43" /></mesh>)}
    {/* nubes de ámbar que bajan en espiral */}
    {Array.from({ length: 12 }, (_, i) => { const k = cl((tt - 1.0 - i * 0.2) / 2.5), a = i * 1.7 + tt; return k > 0 && <mesh key={i} position={[Math.cos(a) * 0.04 * k, lerp(0.17, 0.04, k), Math.sin(a) * 0.04 * k]} scale={0.02 + 0.03 * k}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#6b3510" transparent opacity={0.35 * (1 - k * 0.6)} depthWrite={false} /></mesh>; })}
    {/* saquitos con su hilo y etiqueta */}
    {[[d1, -0.03], [d2, 0.035]].map(([d, x], i) => <group key={i} position={[x, lerp(0.42, 0.15, cl(d)), 0.01 * i]} rotation={[0, i * 0.6, 0.1 * Math.sin(tt * 2 + i)]}>
      <RBox s={[0.04, 0.05, 0.008]} r={0.003}><meshStandardMaterial map={tex.paper(1, 1)} color="#e9dcc0" roughness={1} /></RBox>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.0008, 0.0008, 0.15, 4]} /><meshStandardMaterial color="#f2f2f2" /></mesh>
      <mesh position={[0.06 * (i ? 1 : -1), 0.18, 0.0]}><boxGeometry args={[0.025, 0.018, 0.001]} /><meshStandardMaterial color={i ? "#c9a24b" : "#3e7d4f"} /></mesh>
    </group>)}
    <Motes n={20} r={0.008} col="#ffffff" op={(i) => 0.18 * cl(tt - 0.3)} pos={(i) => { const k = (tt * 0.25 + rn(i, 2)) % 1; return [(rn(i, 3) - 0.5) * 0.12 + 0.02 * Math.sin(tt + i), 0.25 + k * 0.25, (rn(i, 4) - 0.5) * 0.1]; }} />
  </>;
}}</Scene3D>;

// ---- 15:22 · COMO PRENDER UNA VELA: zócalo de nogal opaco; el trapo con té pasa y la madera vuelve cálida, con su luz ----
const walnut = () => tex.text("walnut", 512, 128, (g) => { g.fillStyle = "#4a2c1a"; g.fillRect(0, 0, 512, 128); for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(${30 + rn(i, 2) * 30},${15 + rn(i, 3) * 15},8,.5)`; g.lineWidth = 1 + rn(i, 4) * 3; g.beginPath(); const y = rn(i, 5) * 128; g.moveTo(0, y); for (let x = 0; x < 512; x += 32) g.lineTo(x, y + 6 * Math.sin(x / 60 + i)); g.stroke(); } });
export const HCandle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" warm={0.7}
  cam={{ at: [0.08, 0.1, 0.04], az: [0.3, 0.12], el: [0.14, 0.16], r: [0.8, 0.72], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={150} txt="WARM AGAIN" col={AMB} size={48} />}>{(tt) => {
  const w = eio(tt, 0.6, 4.2), xw = lerp(-0.42, 0.42, w);
  return <>
    <mesh position={[0, 0.45, -0.012]}><planeGeometry args={[1.4, 0.9]} /><meshStandardMaterial color="#cfc2a8" roughness={0.95} /></mesh>
    <RBox s={[0.84, 0.17, 0.02]} p={[0, 0.085, 0]} r={0.003}><meshPhysicalMaterial map={walnut()} roughness={0.35} clearcoat={0.9} clearcoatRoughness={0.15} /></RBox>
    {/* velo gris que cubre lo que todavía no se pasó */}
    <mesh position={[(xw + 0.42) / 2, 0.085, 0.0106]} scale={[Math.max(0.001, 0.42 - xw) / 0.84, 1, 1]}><planeGeometry args={[0.84, 0.17]} /><meshStandardMaterial color="#8d8a84" transparent opacity={0.62} roughness={1} depthWrite={false} /></mesh>
    {/* trapo con té */}
    {w < 1 && <group position={[xw, 0.09, 0.03]} rotation={[0, 0, 0.1 * Math.sin(tt * 9)]}><RBox s={[0.07, 0.1, 0.025]} r={0.012}><meshStandardMaterial color="#b98a5a" roughness={1} /></RBox></group>}
    {/* la luz cálida «vela» crece y se queda */}
    <pointLight position={[0.3, 0.14, 0.14]} intensity={0.2 + 0.9 * cl((tt - 3.2) / 1.5)} distance={0.7} color="#ffb060" />
    <group position={[0.2, 0, 0.13]} scale={1.5}>
      <mesh position={[0, 0.04, 0]} castShadow><cylinderGeometry args={[0.018, 0.018, 0.08, 24]} /><meshStandardMaterial color="#f4ead6" roughness={0.6} /></mesh>
      <mesh position={[0, 0.087, 0]}><cylinderGeometry args={[0.0012, 0.0012, 0.012, 6]} /><meshStandardMaterial color="#222" /></mesh>
      <mesh position={[0, 0.1 + 0.002 * Math.sin(tt * 9), 0]} scale={[1, 1.8 + 0.15 * Math.sin(tt * 1.7), 1].map((v) => v * Math.max(0.001, cl((tt - 3.2) / 0.6))) as [number, number, number]}><sphereGeometry args={[0.011, 14, 10]} />{M.glow({ col: "#ffb347" })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 16:02 · SATINADO VS MATE: la misma mancha en dos zócalos; en el semibrillante sale entera, en el mate queda la sombra ----
const canTex = (k: string, t1: string) => tex.text("can" + k, 256, 128, (g) => { g.fillStyle = "#ffffff"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#1d3c6e"; g.fillRect(0, 0, 256, 34); g.fillStyle = "#1d3c6e"; g.font = "900 36px Arial"; g.textAlign = "center"; g.fillText(t1, 128, 90); });
export const HSheen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none"
  cam={{ at: [0, 0.1, 0], az: [-0.08, 0.08], el: [0.16, 0.2], r: [0.95, 0.85], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={0.8} x={620} y={160} txt="FLAT" col={RED} size={38} /><Tag tt={tt} at={1.0} x={1300} y={160} txt="SEMI-GLOSS" col={GRN} size={38} /></>}>{(tt) => {
  const w = eio(tt, 1.2, 3.6);
  const Side: React.FC<{ x: number; gl: number; left: number }> = ({ x, gl, left }) => <group position={[x, 0, 0]}>
    <RBox s={[0.36, 0.12, 0.018]} p={[0, 0.06, 0]} r={0.003}><meshPhysicalMaterial color="#f4f1ea" roughness={0.65 - 0.6 * gl} clearcoat={gl} clearcoatRoughness={0.05} /></RBox>
    <mesh position={[0, 0.06, 0.0102]} scale={[1, 1, 1]}><circleGeometry args={[0.035, 28]} /><meshStandardMaterial color="#5d564c" transparent opacity={0.85 * lerp(1, left, w)} depthWrite={false} roughness={1} /></mesh>
    {w > 0 && w < 1 && <group position={[0.03 * Math.sin(tt * 13), 0.06, 0.03]}><Sock s={0.45} /></group>}
  </group>;
  return <>
    <mesh position={[0, 0.45, -0.012]}><planeGeometry args={[1.4, 0.9]} /><meshStandardMaterial color="#d9cdb8" roughness={0.92} /></mesh>
    <Side x={-0.22} gl={0} left={0.45} /><Side x={0.22} gl={1} left={0} />
    {/* la lata «semi-gloss», con «+$2» */}
    <group position={[0.26, 0, 0.22]} scale={Math.max(0.001, cl(phys(tt, 3.8, 8, 0.45)))}>
      <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.055, 0.055, 0.12, 36]} />{M.steel({ col: "#cfd4d9" })}</mesh>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.0555, 0.0555, 0.07, 36, 1, true, -1, 2]} /><meshStandardMaterial map={canTex("sg", "SEMI")} side={THREE.DoubleSide} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 16:40 · HÚMEDO, SECO, MUEVO: vista de arriba de un zócalo largo; tres tramos de un brazo, cada uno se limpia a ritmo ----
export const HDampDry: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none"
  cam={{ at: [-0.15, 0.08, 0.05], at1: [0.3, 0.08, 0.05], az: [0.25, 0.15], el: [0.3, 0.26], r: [0.62, 0.58], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={0.6} x={960} y={150} txt="DAMP · DRY · MOVE" col={AMB} size={46} />}>{(tt) => {
  const seg = (i: number) => ({ damp: eio(tt, 0.4 + i * 1.8, 1.0 + i * 1.8), dry: eio(tt, 1.0 + i * 1.8, 1.6 + i * 1.8) });
  const cur = Math.min(2, Math.floor((tt - 0.4) / 1.8)), s = seg(Math.max(0, cur)), ph = (tt - 0.4) - Math.max(0, cur) * 1.8;
  const x0 = -0.3 + Math.max(0, cur) * 0.3;
  return <>
    <WallBB L={1.8} dust={0} line={0} top={0} />
    {[0, 1, 2, 3].map((i) => { const k = seg(i); return <group key={i}>
      <mesh position={[-0.3 + i * 0.3, 0.1255, 0.003]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.29, 0.016]} /><meshStandardMaterial color="#8a857c" transparent opacity={0.85 * (1 - k.damp)} roughness={1} depthWrite={false} /></mesh>
      {/* brillo húmedo que el seco se lleva */}
      <mesh position={[-0.3 + i * 0.3, 0.06, 0.0103]}><planeGeometry args={[0.29, 0.1]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.25 * k.damp * (1 - k.dry)} roughness={0} clearcoat={1} depthWrite={false} /></mesh>
    </group>; })}
    {tt > 0.4 && tt < 5.8 && (ph < 0.6 ? <group position={[x0 - 0.13 + 0.26 * cl(ph / 0.6), 0.07, 0.05]} rotation={[-1.2, 0, PI / 2]}><SockMitt g={0.3} press={1} /></group>
      : ph < 1.2 ? <group position={[x0 - 0.13 + 0.26 * cl((ph - 0.6) / 0.6), 0.07, 0.035]} rotation={[0, 0, 0.1]}><RBox s={[0.11, 0.07, 0.03]} r={0.012}><meshStandardMaterial map={tex.text("towelstripe", 64, 64, (g) => { g.fillStyle = "#f2ede2"; g.fillRect(0, 0, 64, 64); g.fillStyle = "#c0392b"; g.fillRect(0, 40, 64, 8); })} roughness={1} /></RBox></group> : null)}
  </>;
}}</Scene3D>;

// ---- 17:18 · LA ROTACIÓN: maqueta de la casa; cada sábado se ilumina un cuarto y en 7 semanas la casa entera queda hecha ----
const ROOMS: [number, number, number, number][] = [[-0.3, -0.15, 0.28, 0.28], [0, -0.15, 0.3, 0.28], [0.3, -0.15, 0.28, 0.28], [-0.3, 0.15, 0.28, 0.3], [0, 0.15, 0.3, 0.3], [0.3, 0.15, 0.28, 0.3], [0.55, 0, 0.2, 0.58]];
export const HRotation: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none"
  cam={{ at: [0.1, 0, 0], az: [-0.5, -0.2], el: [0.85, 0.75], r: [1.5, 1.35], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={0.5} x={1500} y={140} txt={"WEEK " + Math.max(1, Math.min(7, Math.ceil((tt - 0.4) / 0.75)))} col={AMB} size={46} />}>{(tt) => <>
  {ROOMS.map(([x, z, w, d], i) => { const on = cl((tt - 0.4 - i * 0.75) / 0.35), cur = on > 0 && tt < 0.4 + (i + 1) * 0.75; return <group key={i} position={[x, 0, z]}>
    <mesh position={[0, 0.005, 0]} receiveShadow><boxGeometry args={[w - 0.01, 0.01, d - 0.01]} /><meshStandardMaterial map={tex.paper(2, 2)} color={new THREE.Color("#c9b393").lerp(new THREE.Color("#e9f4e6"), on).getStyle()} roughness={0.9} /></mesh>
    {/* paredes bajas con su zócalo que pasa a blanco limpio */}
    {[[0, d / 2, w, 0.008], [0, -d / 2, w, 0.008], [w / 2, 0, 0.008, d], [-w / 2, 0, 0.008, d]].map(([px, pz, sx, sz], j) => <mesh key={j} position={[px, 0.03, pz]} castShadow><boxGeometry args={[sx, 0.06, sz]} /><meshStandardMaterial color={new THREE.Color("#8d867a").lerp(new THREE.Color("#fbfaf6"), on).getStyle()} roughness={0.7} /></mesh>)}
    <mesh position={[0, 0.07, 0]} scale={cur ? 1 + 0.08 * Math.sin(tt * 8) : 0.001}><ringGeometry args={[0.04, 0.05, 32]} />{M.glow({ col: GRN })}</mesh>
  </group>; })}
</>}</Scene3D>;

// ---- 17:52 · 45 MINUTOS: un timer de cocina gira hasta 45 y la cuña roja se va comiendo mientras la sala queda limpia ----
const dialTex = () => tex.text("dial45", 512, 512, (g) => { g.fillStyle = "#fbf7ee"; g.fillRect(0, 0, 512, 512); g.translate(256, 256); g.fillStyle = "#2b2b2b"; g.font = "700 38px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; for (let m = 0; m < 60; m += 5) { const a = -PI / 2 + m / 60 * PI * 2; g.fillText(String(m), Math.cos(a) * 195, Math.sin(a) * 195); } for (let m = 0; m < 60; m++) { const a = -PI / 2 + m / 60 * PI * 2; g.fillRect(Math.cos(a) * 225 - 2, Math.sin(a) * 225 - 2, m % 5 ? 3 : 6, m % 5 ? 3 : 6); } });
export const HFortyFive: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile"
  cam={{ at: [0, 0.1, 0], az: [-0.25, 0.1], el: [0.3, 0.26], r: [0.62, 0.55], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={2.0} x={1440} y={200} txt="45 MIN" col={AMB} size={56} />}>{(tt) => {
  const wind = eio(tt, 0.4, 1.8), run = cl((tt - 2.4) / 4.4), left = wind * (1 - run * 0.5), th = Math.max(0.001, left * 0.75 * PI * 2);
  return <group position={[0, 0.1, 0]} rotation={[-0.15, 0, 0]}>
    <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.12, 0.13, 0.06, 48]} /><meshPhysicalMaterial color="#d8483c" roughness={0.3} clearcoat={0.8} /></mesh>
    <mesh position={[0, 0, 0.031]}><circleGeometry args={[0.11, 48]} /><meshStandardMaterial map={dialTex()} roughness={0.5} /></mesh>
    {/* cuña de tiempo restante (gira con el dial, sentido reloj desde las 12) */}
    <mesh position={[0, 0, 0.032]} rotation={[0, 0, PI / 2]} scale={[-1, 1, 1]}><circleGeometry args={[0.085, 64, 0, th]} /><meshBasicMaterial color={RED} transparent opacity={0.55} /></mesh>
    <mesh position={[0, 0, 0.04]} rotation={[0, 0, -left * 0.75 * PI * 2]}><boxGeometry args={[0.006, 0.1, 0.006]} /><meshStandardMaterial color="#222" /></mesh>
    <mesh position={[0, 0, 0.042]}><cylinderGeometry args={[0.012, 0.012, 0.012, 20]} />{M.steel()}</mesh>
    <mesh position={[0, 0.135, 0]}><cylinderGeometry args={[0.012, 0.012, 0.02, 16]} />{M.steel()}</mesh>
  </group>;
}}</Scene3D>;
