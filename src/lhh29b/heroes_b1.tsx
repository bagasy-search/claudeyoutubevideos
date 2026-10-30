// lhh29b · componentes únicos 1-8 (kit h3d): los quince gajos, tres limones sobre el dólar, la fila de aerosoles que cae,
// la tabla gruesa como una Biblia, la tabla acostada que se tuerce, el caño que se cierra de sarro, la escala del ácido y la mancha opaca en el granito.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, DigitDrum, cl, tex, eio, lerp, phys, rn } from "./h3d";
import { Lemon, LemonHalf, Spray, QuartJar, lathe, SERIF } from "./lemonkit";

const PI = Math.PI;

// ---- 0:25 · QUINCE GAJOS: medio limón gigante de frente; sus quince gajos se encienden uno por uno como un contador ----
export const HSegments15: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" lamp={[0.3, 0.6, 0.5]}
  cam={{ at: [0.03, 0.04, 0.08], az: [-0.2, 0.1], el: [0.62, 0.54], r: [0.72, 0.64], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="ONE LEMON · 15 JOBS" col={AMB} />
    </>}>{(tt, u) => {
  const spu = (x: number) => x <= 0 ? 0 : 1 - Math.exp(-x * 22) * Math.cos(x * 40);
  // el limón entero se abre en 15 gajos que se despegan de a uno y caen en abanico sobre la tabla, cada uno con su rebote
  const R = 0.07, len = (PI * 2) / 15;
  return <>
    <RBox s={[0.62, 0.02, 0.36]} p={[0, 0.01, 0.03]} r={0.012}>{M.wood({ rx: 1, ry: 1, base: [200, 160, 110] })}</RBox>
    {/* el limón se abre como una flor: cada gajo se desliza hacia afuera de a uno, con salto chico, y el rodillo cuenta */}
    {Array.from({ length: 15 }, (_, i) => { const st = 0.06 + i * 0.05, k = spu(u - st), m = cl(k), a = i * len + len / 2, d = 0.085 * k, hop = Math.sin(m * PI) * 0.035;
      return <group key={i} position={[Math.sin(a) * d, 0.02 + R * 0.625 + hop, 0.03 + Math.cos(a) * d]} rotation={[0, 0, 0]}>
        <group rotation={[0, i * len, 0]} scale={[1, 1.25, 1]}>
          <mesh castShadow><cylinderGeometry args={[R, R, R * 0.5, 12, 1, false, 0, len * 0.96]} /><meshPhysicalMaterial color="#f2d23a" roughness={0.45} clearcoat={0.3} /></mesh>
          <mesh scale={[0.9, 1.02, 0.9]}><cylinderGeometry args={[R, R, R * 0.5, 12, 1, false, len * 0.03, len * 0.9]} /><meshPhysicalMaterial color="#f7e27a" roughness={0.25} clearcoat={0.9} /></mesh>
        </group>
        <mesh position={[0, -(R * 0.625 + hop) + 0.0012, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[R * 0.7 * (0.5 + 0.5 * m), 16]} /><meshBasicMaterial color="#000" transparent opacity={0.35 * m} depthWrite={false} /></mesh>
      </group>; })}
    {(() => { const n = Math.round(Array.from({ length: 15 }, (_, i) => cl((u - 0.06 - i * 0.05) * 20)).reduce((x, y) => x + y, 0)); return <group position={[0.24, 0.1, 0.22]} rotation={[-0.5, -0.2, 0]} scale={1.7}>
      <RBox s={[0.17, 0.1, 0.035]} r={0.01}>{M.wood({ base: [120, 80, 50] })}</RBox>
      <DigitDrum v={Math.floor(n / 10)} p={[-0.038, 0, 0.018]} r={0.036} w={0.05} /><DigitDrum v={n % 10} p={[0.038, 0, 0.018]} r={0.036} w={0.05} /></group>; })()}
    <LemonHalf p={[0, 0.02, 0.03]} rot={[0, 0, 0]} s={Math.max(0.001, 1.5 * (1 - 0.75 * eio(u, 0.06, 0.8)))} />
  </>;
}}</Scene3D>;

// ---- 0:53 · TRES POR UN DÓLAR: un billete de un dólar sobre la mesa; caen tres limones con peso, uno por uno, y el cartelito de precio ----
export const HThreeFor1: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0, 0.03, 0], az: [0.35, -0.1], el: [0.62, 0.55], r: [0.78, 0.66], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="THREE FOR A DOLLAR" col={GRN} />
    </>}>{(tt, u) => {
  const sp = (x: number) => x <= 0 ? 0 : 1 - Math.exp(-x * 5) * Math.cos(x * 11);
  const bill = tex.text("dollar", 512, 218, (g) => { g.fillStyle = "#cfdcc0"; g.fillRect(0, 0, 512, 218); g.strokeStyle = "#3c6b45"; g.lineWidth = 10; g.strokeRect(10, 10, 492, 198);
    g.fillStyle = "#3c6b45"; g.font = "bold 64px " + SERIF; g.fillText("1", 30, 80); g.fillText("1", 450, 196); g.beginPath(); g.ellipse(256, 109, 58, 70, 0, 0, 6.3); g.fillStyle = "#a9bf9c"; g.fill();
    g.fillStyle = "#3c6b45"; g.font = "bold 26px " + SERIF; g.fillText("ONE DOLLAR", 190, 200); for (let i = 0; i < 40; i++) { g.strokeStyle = "rgba(60,107,69,.25)"; g.beginPath(); g.arc(256, 109, 20 + i * 4, 0, 6.3); g.stroke(); } });
  return <>
    <mesh rotation={[-PI / 2, 0, 0.12]} position={[0, 0.001, 0]} receiveShadow><planeGeometry args={[0.36, 0.153]} /><meshStandardMaterial map={bill} roughness={0.85} /></mesh>
    {[0, 1, 2].map((i) => { const k = phys(tt, 0.5 + i * 0.7, 7, 0.4);
      return k > 0 && <group key={i}><Lemon p={[-0.1 + i * 0.1, 0.04 + (1 - cl(k)) * 0.5 + Math.max(0, k - 1) * 0.04, 0.01 * (i - 1)]} rot={[0, 0.4 + i * 0.9, 0.08]} s={1} />
        <mesh position={[-0.1 + i * 0.1, 0.0025, 0.01 * (i - 1)]} rotation={[-PI / 2, 0, 0]} scale={[1.3, 1, 1]}><circleGeometry args={[0.045 * (0.4 + 0.6 * cl(k)), 24]} /><meshBasicMaterial color="#000000" transparent opacity={0.35 * cl(k)} depthWrite={false} /></mesh></group>; })}
    {(() => { const k = sp(cl((u - 0.5) / 0.3)), sw = 0.35 * Math.exp(-cl((u - 0.62) / 0.4) * 2.5) * Math.sin((u - 0.62) * 40) * (u > 0.62 ? 1 : 0); return u > 0.5 && <group position={[0.02, 0.66, -0.06]} rotation={[0, -0.25, sw]} scale={1.9}>
      <mesh position={[0, -0.13 + (1 - k) * 0.25, 0]} ><cylinderGeometry args={[0.0012, 0.0012, 0.26, 6]} /><meshStandardMaterial color="#e8e2d0" /></mesh>
      <group position={[0, -0.27 + (1 - k) * 0.25, 0]}>
      <RBox s={[0.1, 0.06, 0.004]} r={0.006}><meshStandardMaterial map={tex.text("tag3", 256, 154, (g) => { g.fillStyle = "#fff8dc"; g.fillRect(0, 0, 256, 154); g.fillStyle = "#c0392b"; g.font = "bold 70px " + SERIF; g.fillText("3 / $1", 22, 100); })} roughness={0.8} /></RBox></group></group>; })()}
  </>;
}}</Scene3D>;

// ---- 1:11 · LA FILA DE AEROSOLES: seis aerosoles de colores caen como fichas de dominó y del medio sube el frasco de cáscaras ----
export const HSprayFall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="tile"
  cam={{ at: [0, 0.1, 0], az: [-0.5, -0.2], el: [0.3, 0.22], r: [0.95, 0.78], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="NO SPRAYS SINCE 1991" col={AMB} />
    </>}>{(tt, u) => {
  const cols = ["#3f8fd8", "#e2523a", "#4fb36a", "#9a5bd1", "#f0a830", "#27b5b0"], jar = (u < 0.1 ? 0 : 1 - Math.exp(-(u - 0.1) * 22) * Math.cos((u - 0.1) * 40)), fill = eio(u, 0.2, 0.92);
  return <>
    {cols.map((c, i) => { const f = eio(u, 0.14 + i * 0.12, 0.24 + i * 0.12);
      const sx = -0.3 + i * 0.12 + 0.19 * f, sy = 0.2 - 0.13 * f, act = Math.sin(PI * cl((u - 0.16 - i * 0.12) / 0.26));
      return <group key={i}><group position={[-0.3 + i * 0.12, 0, -0.2]} rotation={[0, 0, -f * 1.25]}><Spray col={c} p={[0, 0, 0]} rot={[0, 0.6, 0]} /></group>
        {act > 0.02 && Array.from({ length: 16 }, (_, j) => { const q = ((u * 9 + j / 16) % 1); return <mesh key={j} position={[lerp(sx, 0, q), lerp(sy, 0.12, q) + 0.14 * Math.sin(PI * q), lerp(-0.2, 0.2, q)]} scale={0.011 + 0.008 * q}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color={c} emissive={c} emissiveIntensity={0.5} roughness={0.1} clearcoat={1} transparent opacity={Math.min(1, 1.6 * act)} /></mesh>; })}</group>; })}
    {jar > 0 && <group position={[0, 0, 0.2]} scale={cl(jar) * 1.35}><QuartJar liq={0.15 + 0.8 * fill} peel={0.3 + 0.6 * fill} />
      <mesh position={[0, 0.005 + 0.075 * (0.15 + 0.8 * fill), 0]}><cylinderGeometry args={[0.049, 0.049, 0.15 * (0.15 + 0.8 * fill), 40]} /><meshPhysicalMaterial color="#e8b92e" roughness={0.1} transparent opacity={0.96} clearcoat={1} emissive="#5a3a00" emissiveIntensity={0.25} /></mesh>
      {cols.map((c, i) => { const s = Math.sin(PI * cl((u - 0.2 - i * 0.12) / 0.12)); return s > 0.02 && <group key={"ch" + i}>
        <mesh position={[0, 0.3, 0]} scale={[s, 1, s]}><cylinderGeometry args={[0.012, 0.008, 0.26, 12]} /><meshPhysicalMaterial color={c} roughness={0.1} clearcoat={1} emissive={c} emissiveIntensity={0.25} /></mesh>
        <mesh position={[0, 0.005 + 0.15 * (0.15 + 0.8 * fill) + 0.002, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.01 + 0.02 * s, 0.014 + 0.02 * s, 24]} />{M.glow({ col: c, op: 0.8 * s })}</mesh></group>; })}</group>}
  </>;
}}</Scene3D>;

// ---- 1:50 · GRUESA COMO UNA BIBLIA: la tabla de arce de 1956 al lado de una Biblia negra de cantos dorados; una regla de bronce las mide iguales ----
export const HThickBible: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[-0.3, 0.5, 0.4]}
  cam={{ at: [0.03, 0.06, 0], az: [0.5, 0.2], el: [0.24, 0.18], r: [0.82, 0.7], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="THICK AS A BIBLE" col={AMB} />
    </>}>{(tt, u) => {
  const sp = (x: number) => x <= 0 ? 0 : 1 - Math.exp(-x * 5) * Math.cos(x * 11);
  const b = phys(tt, 0.3, 6, 0.5), bi = phys(tt, 0.9, 6, 0.5), ru = eio(tt, 2.0, 3.0), lv = sp(cl((u - 0.55) / 0.3)), bub = eio(u, 0.75, 0.95);
  return <>
    <group position={[-0.13, (1 - cl(b)) * 0.3, 0]}><RBox s={[0.3, 0.07, 0.2]} p={[0, 0.035, 0]} r={0.01}>{M.wood({ rx: 1, ry: 1, base: [196, 150, 98] })}</RBox>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.12 + i * 0.03, 0.0705, -0.05 + rn(i, 2) * 0.1]} rotation={[-PI / 2, 0, rn(i, 3)]}><planeGeometry args={[0.05, 0.0015]} />{M.matte({ col: "#7a5434", op: 0.5 })}</mesh>)}</group>
    <group position={[0.18, (1 - cl(bi)) * 0.3, 0.02]} rotation={[0, -0.25, 0]}>
      <RBox s={[0.16, 0.07, 0.22]} p={[0, 0.035, 0]} r={0.008}><meshPhysicalMaterial color="#141210" roughness={0.6} clearcoat={0.3} /></RBox>
      <mesh position={[0.081, 0.035, 0]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.2, 0.06]} />{M.brass({})}</mesh>
      <mesh position={[0, 0.0705, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.03, 0.06]} />{M.brass({ col: "#e7c46a" })}</mesh>
      <mesh position={[0, 0.0706, 0.02]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.06, 0.01]} />{M.brass({ col: "#e7c46a" })}</mesh></group>
    {ru > 0 && <group position={[0.02, 0.0005 + 0.07 * 0.5, 0.13 + (1 - ru) * 0.2]}>
      <RBox s={[0.012, 0.09, 0.012]} p={[0, 0.01, 0]} r={0.002}>{M.brass({})}</RBox>
      {[0, 0.07].map((y, i) => <mesh key={i} position={[0, y - 0.035, 0]}><boxGeometry args={[0.5 * ru, 0.002, 0.002]} />{M.glow({ col: AMB, op: 0.9 })}</mesh>)}</group>}
    {u > 0.55 && <group position={[0.02, 0.074 + (1 - lv) * 0.2, 0.0]} rotation={[0, -0.1, 0.12 * (1 - lv)]}>
      <RBox s={[0.44, 0.014, 0.04]} p={[0, 0.007, 0]} r={0.004}>{M.brass({})}</RBox>
      <mesh position={[0, 0.02, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.08, 16]} /><meshPhysicalMaterial color="#c8f07a" roughness={0.1} transparent opacity={0.75} clearcoat={1} /></mesh>
      <mesh position={[lerp(0.03, 0, bub), 0.027, 0]} scale={[1.6, 1, 1]}><sphereGeometry args={[0.0065, 14, 10]} /><meshPhysicalMaterial color="#ffffff" roughness={0} clearcoat={1} emissive="#ffffff" emissiveIntensity={0.3 * bub} /></mesh>
      {[-0.012, 0.012].map((x, i) => <mesh key={i} position={[x, 0.02, 0.0085]}><boxGeometry args={[0.0012, 0.014, 0.001]} /><meshBasicMaterial color="#222" /></mesh>)}
    </group>}
    {u > 0.55 && [-0.15, 0.17].map((x, i) => <mesh key={"ls" + i} position={[x, 0.0712, 0.004]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.12, 0.05]} /><meshBasicMaterial color="#000" transparent opacity={0.45 * cl(lv)} depthWrite={false} /></mesh>)}
    {u > 0.8 && <><pointLight position={[0.02, 0.15, 0.08]} intensity={0} distance={0.5} color="#c8f07a" />
      {[-0.13, 0.18].map((x, i) => <mesh key={"tp" + i} position={[x, 0.0712, 0.01]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[i ? 0.16 : 0.3, 0.2]} />{M.glow({ col: "#c8f07a", op: 0 })}</mesh>)}</>}
    {[[-0.13, 0.32, 0.22], [0.18, 0.18, 0.24]].map(([x, w, d], i) => <mesh key={"cs" + i} position={[x, 0.001, 0.0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[w + 0.03, d + 0.03]} /><meshBasicMaterial color="#000" transparent opacity={0.3} depthWrite={false} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 2:35 · ACOSTADA SE TUERCE: a la izquierda la tabla mojada acostada se arquea y se raja; a la derecha, parada de canto, chorrea y queda recta ----
export const HWarp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile"
  cam={{ at: [-0.08, 0.07, 0], az: [-0.15, 0.12], el: [0.34, 0.28], r: [0.9, 0.8], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="NEVER LET IT LIE FLAT" col={RED} />
</>}>{(tt, u) => {
  const bow = eio(u, 0.08, 0.6), crack = cl((u - 0.55) / 0.2), N = 12;
  return <>
    <group position={[-0.2, 0.01, 0]}>
      {Array.from({ length: N }, (_, i) => { const q = (i + 0.5) / N - 0.5, y = bow * 0.07 * (q * q * 4), r = -bow * 0.28 * q * 2;
        return <RBox key={i} s={[0.3 / N + 0.0008, 0.022, 0.18]} p={[q * 0.3, 0.011 + y, 0]} rot={[0, 0, r]} r={0.002}>{M.wood({ rx: 0.2, ry: 1, base: [176, 130, 84] })}</RBox>; })}
      {Array.from({ length: 8 }, (_, i) => { const x0 = -0.12 + rn(i, 2) * 0.24, x = x0 * (1 - 0.85 * eio(u, 0.15 + rn(i, 4) * 0.2, 0.5 + rn(i, 4) * 0.2)), sk = eio(u, 0.55 + rn(i, 4) * 0.2, 0.75 + rn(i, 4) * 0.2); return <mesh key={i} position={[x, 0.026 + 0.07 * bow * Math.pow(x / 0.15, 2) - 0.018 * sk, -0.07 + rn(i, 3) * 0.14]} scale={[1.4 * (1 - 0.7 * sk) + 0.01, 0.55 * (1 - 0.8 * sk) + 0.01, 1.2 * (1 + 0.4 * sk)]}><sphereGeometry args={[0.016, 20, 14]} />{M.water({ op: 0.8 })}</mesh>; })}
      <mesh position={[0, 0.024, 0]} rotation={[-PI / 2, 0, 0]} scale={[1, 1.6, 1]}><circleGeometry args={[0.05 * eio(u, 0.4, 0.8) + 0.001, 40]} />{M.water({ op: 0.7 })}</mesh>
      {crack > 0 && [0, 1, 2].map((k) => <mesh key={"ck" + k} position={[0.005 + 0.012 * k * (k % 2 ? 1 : -1), 0.0245, 0.07 - 0.05 * k * crack]} rotation={[-PI / 2, 0, 0.2 + 0.5 * (k % 2 ? 1 : -1)]}><planeGeometry args={[0.005, 0.07 * crack]} /><meshBasicMaterial color="#1a0f08" /></mesh>)}
    </group>
    <group position={[0.22, 0, 0]} rotation={[0, -0.3, 0]}>
      <RBox s={[0.022, 0.3, 0.18]} p={[0, 0.15, 0]} r={0.003}>{M.wood({ rx: 0.2, ry: 1, base: [176, 130, 84] })}</RBox>
      {Array.from({ length: 7 }, (_, i) => { const d = ((u * 5 + rn(i, 4)) % 1); return <mesh key={i} position={[0.013, 0.29 - d * 0.28, -0.07 + rn(i, 5) * 0.14]}><sphereGeometry args={[0.005, 10, 8]} />{M.water({ op: 0.85 * (1 - d) })}</mesh>; })}
    </group>
  </>;
}}</Scene3D>;

// ---- 3:08 · DURA COMO PIEDRA: corte de un caño de cobre visto de punta; capa tras capa de sarro blanco lo va cerrando y el agua se frena ----
export const HPipeScale: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" lamp={[0.2, 0.3, 0.6]}
  cam={{ at: [-0.2, 0.15, 0], az: [-1.15, -1.3], el: [0.16, 0.1], r: [0.5, 0.36], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="HARD WATER, LIKE A ROCK" col={ICE} />
    </>}>{(tt, u) => {
  const g = eio(u, 0.08, 0.95), L = 0.42;
  const chalk = tex.text("chalk", 128, 128, (c) => { c.fillStyle = "#e9e5da"; c.fillRect(0, 0, 128, 128); for (let i = 0; i < 400; i++) { c.fillStyle = `rgba(170,160,140,${0.2 * rn(i, 2)})`; c.fillRect(rn(i, 3) * 128, rn(i, 4) * 128, 2, 2); } });
  return <group position={[0, 0.15, 0]} rotation={[0, 0, PI / 2]}>
    <mesh><cylinderGeometry args={[0.1, 0.1, L, 64, 1, true]} />{M.brass({ col: "#c7764a", em: "#3a1a0a", emI: 0.2 })}</mesh>
    <mesh position={[0, L / 2, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.088, 0.1, 64]} />{M.brass({ col: "#d58a5a" })}</mesh>
    <mesh><cylinderGeometry args={[0.088, 0.088, L, 64, 1, true]} /><meshStandardMaterial color="#8b4a2a" metalness={0.6} roughness={0.4} side={THREE.BackSide} /></mesh>
    {[0, 1, 2, 3, 4].map((i) => { const k = cl(g * 5 - i); if (k <= 0) return null; const r = 0.088 - i * 0.012 - k * 0.012;
      return <group key={i}><mesh><cylinderGeometry args={[r, r, L * 0.999, 64, 1, true]} /><meshStandardMaterial map={chalk} bumpMap={chalk} bumpScale={6} roughness={0.95} side={THREE.BackSide} /></mesh>
        <mesh position={[0, L / 2 + 0.0005 * i, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[r, 0.088 - i * 0.012, 64]} /><meshStandardMaterial map={chalk} bumpMap={chalk} bumpScale={6} color={i % 2 ? "#e6dfcf" : "#f3efe6"} roughness={0.95} /></mesh></group>; })}
    {Array.from({ length: 40 }, (_, i) => { const sp = 0.9 - 0.75 * g, d = ((tt * sp + rn(i, 2)) % 1), rr = (0.03 - 0.022 * g) * rn(i, 3), a = rn(i, 4) * 6.3;
      return <mesh key={i} position={[Math.cos(a) * rr, -L / 2 + d * L, Math.sin(a) * rr]}><sphereGeometry args={[0.007, 10, 8]} />{M.water({ op: 0.9 })}</mesh>; })}
  </group>;
}}</Scene3D>;

// ---- 3:42 · LA ESCALA DEL ÁCIDO: catorce bloques de color (pH 0 a 14) suben en ola; el limón cae en el 2 y el cristal blanco del 9 se achica ----
export const HPhScale: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark"
  cam={{ at: [-0.06, 0.05, 0], az: [-0.25, 0.15], el: [0.32, 0.26], r: [0.7, 0.6], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="ACID EATS THE CRUST" col={AMB} />
</>}>{(tt, u) => {
  const cols = Array.from({ length: 14 }, (_, i) => "#" + new THREE.Color("#e8c34a").lerp(new THREE.Color("#55606a"), i / 13).getHexString());
  const lem = phys(tt, 1.4, 7, 0.45), cr = 1 - eio(u, 0.45, 0.95), pul = Math.exp(-Math.max(0, tt - 1.75) * 2.5) * (tt > 1.75 ? 1 : 0);
  return <>
    {cols.map((c, i) => { const k = phys(tt, 0.2 + i * 0.06, 6, 0.5), hgt = 0.02 + 0.03 * Math.abs(i - 7) / 7;
      return k > 0 && <RBox key={i} s={[0.042, hgt, 0.08]} p={[-0.3 + i * 0.046, hgt / 2 * cl(k), 0]} r={0.004}><meshPhysicalMaterial color={c} roughness={0.5} clearcoat={0.3} /></RBox>; })}
    {lem > 0 && <Lemon p={[-0.3 + 2 * 0.046, 0.075 + (1 - cl(lem)) * 0.35, 0]} rot={[0, 0.3, 0]} s={0.9} />}
    <pointLight position={[-0.208, 0.12, 0.06]} intensity={2.5 * pul} distance={0.35} color="#ffe36a" />
    {pul > 0.02 && <mesh position={[-0.208, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03 + 0.2 * (1 - pul), 0.036 + 0.2 * (1 - pul), 48]} />{M.glow({ col: "#ffe36a", op: 0.7 * pul })}</mesh>}
    {Array.from({ length: 12 }, (_, i) => { const f = cl((u - 0.5 - rn(i, 7) * 0.35) / 0.15); return f > 0 && f < 1 && <mesh key={"fl" + i} position={[-0.3 + 9 * 0.046 + (rn(i, 8) - 0.5) * 0.05, 0.06 - 0.055 * f, (rn(i, 9) - 0.5) * 0.05 + 0.02]} rotation={[i, i, 0]}><octahedronGeometry args={[0.005]} /><meshStandardMaterial color="#f1eee6" transparent opacity={1 - f} /></mesh>; })}
    <group position={[-0.3 + 9 * 0.046, 0.045, 0]} scale={0.4 + 0.6 * cr}>
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.03, 0.012 + rn(i, 3) * 0.02, (rn(i, 4) - 0.5) * 0.03]} rotation={[rn(i, 5) * 3, rn(i, 6) * 3, 0]}><octahedronGeometry args={[0.022]} /><meshStandardMaterial color="#f1eee6" roughness={0.9} transparent opacity={0.3 + 0.7 * cr} /></mesh>)}
      {cr < 1 && cr > 0.02 && Array.from({ length: 16 }, (_, i) => { const d = (u * 8 + rn(i, 61)) % 1; return <mesh key={"fz" + i} position={[(rn(i, 62) - 0.5) * 0.05, 0.02 + d * 0.12, (rn(i, 63) - 0.5) * 0.05]}><sphereGeometry args={[0.003 + 0.004 * d, 8, 6]} />{M.glow({ col: "#ffffff", op: 0.7 * (1 - d) })}</mesh>; })}
    </group>
    {lem > 1 && cr < 1 && Array.from({ length: 10 }, (_, i) => { const q = cl(((u * 10) % 1.6 - i * 0.12) / 0.6); return q > 0 && q < 1 && <mesh key={i} position={[lerp(-0.208, 0.114, q), 0.09 + 0.06 * Math.sin(q * PI), (rn(i, 2) - 0.5) * 0.04]}><sphereGeometry args={[0.005, 8, 6]} />{M.glow({ col: "#ffe36a", op: 0.9 })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 3:56 · LA MANCHA OPACA: granito lustrado; cae una gota de limón, se abre, y donde estuvo queda un anillo mate que la luz delata ----
export const HEtchRing: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark"
  cam={{ at: [0, 0.06, 0], az: [0.2, -0.15], el: [0.42, 0.5], r: [0.55, 0.42], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="NEVER ON STONE" col={RED} />
    </>}>{(tt, u) => {
  const gran = tex.text("granite3", 512, 512, (g) => { g.fillStyle = "#2d2a28"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 2600; i++) { const v = rn(i, 2); g.fillStyle = v < 0.5 ? `rgba(${120 + v * 40},${110 + v * 30},${100},.12)` : `rgba(10,10,10,.25)`; g.beginPath(); g.arc(rn(i, 3) * 512, rn(i, 4) * 512, 1 + 4 * rn(i, 5), 0, 6.3); g.fill(); } });
  const etch = tex.text("etchmat", 256, 256, (g) => { g.fillStyle = "#a49d93"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1800; i++) { g.fillStyle = rn(i, 61) < 0.5 ? "rgba(70,64,58,.5)" : "rgba(225,220,212,.6)"; g.fillRect(rn(i, 62) * 256, rn(i, 63) * 256, 1 + 2 * rn(i, 64), 1 + 2 * rn(i, 65)); } });
  const rake = tex.text("rake1", 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 2, 64, 64, 64); gr.addColorStop(0, "rgba(255,244,224,.8)"); gr.addColorStop(1, "rgba(255,244,224,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  const drop = cl((u - 0.1) / 0.1), spread = eio(u, 0.2, 0.34), gone = eio(u, 0.42, 0.54), lx = lerp(-0.45, 0.45, eio(u, 0.5, 0.96));
  return <>
    <pointLight position={[lx, 0.12, -0.35]} intensity={0.25 + 0.35 * eio(u, 0.48, 0.56)} distance={0.6} color="#fff4e0" />
    {u > 0.5 && <mesh position={[lx * 0.3, 0.0035, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.12, 0.34]} /><meshBasicMaterial map={rake} transparent opacity={0.5 * eio(u, 0.5, 0.58)} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>}
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.4, 1]} /><meshStandardMaterial map={gran} roughness={0.8} /></mesh>
    {u < 0.44 && <LemonHalf p={[0.02, 0.14 + 0.4 * eio(u, 0.3, 0.44), 0]} rot={[PI - 0.5, 0, 0.2]} s={1.4} squeeze={Math.sin(PI * cl((u - 0.02) / 0.12))} />}
    {u > 0.06 && drop < 1 && <mesh position={[0, lerp(0.125, 0.008, drop * drop), 0]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.011, 16, 12]} />{M.water({ col: "#f6e47a", op: 0.9 })}</mesh>}
    {(() => { const land = phys(tt, 0.1, 6, 0.5), lift = eio(u, 0.36, 0.44); return false && land > 0 && lift < 1 && <group position={[-0.7 * lift, (1 - cl(land)) * 0.25 + lift * 0.03, 0.05 * lift]}>
      <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.062, 0.055, 0.12, 48, 1, true]} />{M.glass({ op: 0.3, side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.058, 0.052, 0.085, 48]} />{M.water({ col: "#f6e47a", op: 0.7 })}</mesh>
      <mesh position={[0.03, 0.1, 0]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.02, 0.02, 0.005, 24]} /><meshStandardMaterial color="#f3dc4a" roughness={0.4} /></mesh></group>; })()}
    {drop >= 1 && gone < 1 && <mesh position={[0, 0.0015, 0]} rotation={[-PI / 2, 0, 0]} scale={0.3 + 0.7 * spread}><circleGeometry args={[0.096, 48]} />{M.water({ col: "#f6e47a", op: 0.55 * (1 - gone) })}</mesh>}
    {gone > 0 && <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.07, 0.096, 64]} /><meshStandardMaterial map={etch} bumpMap={etch} bumpScale={5} color="#c8c1b6" roughness={1} emissive="#3a3630" emissiveIntensity={cl(1 - Math.abs(lx) / 0.2)} transparent opacity={0.9 * gone} /></mesh>}
    {gone > 0 && <mesh position={[0, 0.002, 0]} rotation={[PI / 2, 0, 0]} scale={[1, 1, 0.25]}><torusGeometry args={[0.083, 0.011, 10, 64]} /><meshStandardMaterial map={etch} bumpMap={etch} bumpScale={5} color="#cfc8bd" roughness={1} emissive="#6a6258" emissiveIntensity={0.8 * cl(1 - Math.abs(lx) / 0.25)} transparent opacity={0.9 * gone} /></mesh>}
    {gone > 0 && <mesh position={[0, 0.0012, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.056, 48]} /><meshStandardMaterial color="#6e6862" roughness={1} transparent opacity={0.35 * gone} /></mesh>}
  </>;
}}</Scene3D>;
