// lhh29b · componentes únicos 9-16 (kit h3d): la balanza de 40 libras y los 300 tazones, la mano que pasa de cebolla a pastel,
// la caja del microondas de 1993, el vidrio que se empaña, la pasada única, las seis ollas con su placa, el cobre que se pone rosa y el acta de 1979.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn } from "./h3d";
import { Lemon, LemonHalf, lathe, SERIF } from "./lemonkit";

const PI = Math.PI;
const kraft = () => tex.text("kraftbox", 256, 256, (g) => { g.fillStyle = "#b98d5a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(90,60,30,${0.08 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 3, 1); } });

// ---- 4:29 · 40 LIBRAS, 300 TAZONES: la balanza colgante de verdulería marca 40; al lado se arma una grilla de 300 tazones de chili ----
export const HBowls300: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark"
  cam={{ at: [-0.05, 0.14, 0], az: [-0.2, 0.08], el: [0.3, 0.26], r: [1.05, 0.92], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="CHILI FOR 300" col={RED} />
    <Tag tt={tt} at={2.4 + 3.6} x={1330} y={230} txt={`${Math.min(300, Math.max(0, Math.round(300 * cl((tt - 2.4) / 3.6))))} BOWLS`} col={RED} size={44} /></>}>{(tt) => {
  const nd = phys(tt, 0.4, 4, 0.35), ang = 0.7 - 1.2 * cl(nd) * (40 / 50);
  const dial = tex.text("dial40", 256, 256, (g) => { g.fillStyle = "#f4efe2"; g.beginPath(); g.arc(128, 128, 124, 0, 6.3); g.fill(); g.strokeStyle = "#222"; g.lineWidth = 3;
    for (let i = 0; i <= 50; i += 5) { const a = 0.7 * PI + (i / 50) * 1.6 * PI; g.beginPath(); g.moveTo(128 + Math.cos(a) * 100, 128 + Math.sin(a) * 100); g.lineTo(128 + Math.cos(a) * 116, 128 + Math.sin(a) * 116); g.stroke();
      if (i % 10 === 0) { g.fillStyle = "#222"; g.font = "bold 20px sans-serif"; g.fillText(String(i), 120 + Math.cos(a) * 80, 134 + Math.sin(a) * 80); } } });
  return <>
    <group position={[-0.32, 0.22, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.09, 0.09, 0.03, 48]} />{M.steel({})}</mesh>
      <mesh position={[0, 0, 0.0155]}><circleGeometry args={[0.082, 48]} /><meshStandardMaterial map={dial} roughness={0.6} /></mesh>
      <mesh position={[0, 0, 0.017]} rotation={[0, 0, ang]}><boxGeometry args={[0.004, 0.07, 0.001]} />{M.rubber({ col: "#c62828" })}</mesh>
      <mesh position={[0, -0.16, 0]}><cylinderGeometry args={[0.1, 0.06, 0.08, 32, 1, true]} /><meshStandardMaterial color="#c9b98f" roughness={1} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.12, -0.14 + rn(i, 3) * 0.04, (rn(i, 4) - 0.5) * 0.1]} scale={[1, 0.85, 1]}><sphereGeometry args={[0.022, 16, 12]} /><meshPhysicalMaterial color="#c79a4a" roughness={0.5} clearcoat={0.5} /></mesh>)}
    </group>
    {/* tres torres de cuencos de chili que se apilan de a uno, con peso */}
    {Array.from({ length: 30 }, (_, i) => { const c = i % 3, r = Math.floor(i / 3), k = phys(tt, 2.2 + i * 0.12, 8, 0.45); if (k <= 0) return null;
      return <group key={i} position={[0.0 + c * 0.13, 0.024 * r + (1 - cl(k)) * 0.25, 0.02 * Math.sin(c * 2)]} rotation={[0, i * 0.7, 0]}>
        <mesh position={[0, 0.012, 0]} castShadow><cylinderGeometry args={[0.05, 0.032, 0.024, 32, 1, true]} />{M.porcelain({ side: THREE.DoubleSide })}</mesh>
        <mesh position={[0, 0.001, 0]}><cylinderGeometry args={[0.032, 0.032, 0.002, 32]} />{M.porcelain({})}</mesh>
        <mesh position={[0, 0.02, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.046, 32]} /><meshStandardMaterial color="#8e2c16" roughness={0.55} /></mesh></group>; })}
  </>;
}}</Scene3D>;

// ---- 5:17 · DE CEBOLLA A PASTEL: una mano abierta envuelta en remolinos violeta de cebolla; el limón pasa y el aire se vuelve amarillo; aparece un pastel ----
export const HScentSwap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile"
  cam={{ at: [0, 0.1, 0], az: [-0.15, 0.15], el: [0.4, 0.32], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="SMELLS LIKE A PIE" col={AMB} />
    </>}>{(tt, u) => {
  const sw = eio(u, 0.25, 0.8), pie = 0, skin = <meshPhysicalMaterial color="#e3b79a" roughness={0.55} clearcoat={0.2} sheen={0.5} />;
  const col = new THREE.Color("#8f4fc0").lerp(new THREE.Color("#ffd84a"), sw).getStyle();
  return <>
    <group position={[-0.06, 0.02, 0]} rotation={[0, 0.2, 0]}>
      <RBox s={[0.1, 0.022, 0.11]} p={[0, 0.011, 0]} r={0.01}>{skin}</RBox>
      {[-0.036, -0.012, 0.012, 0.036].map((x, i) => { const L = 0.07 - Math.abs(x) * 0.4; return <mesh key={i} position={[x, 0.014, -0.055 - L / 2 + Math.abs(x) * 0.2]} rotation={[PI / 2 - 0.12, 0, 0]}><capsuleGeometry args={[0.0095, L, 8, 16]} />{skin}</mesh>; })}
      <mesh position={[0.068, 0.014, 0.02]} rotation={[PI / 2, 0, 0.7]}><capsuleGeometry args={[0.0105, 0.045, 8, 16]} />{skin}</mesh>
    </group>
    <LemonHalf p={[lerp(0.25, -0.06, eio(u, 0.04, 0.18)) + (u > 0.18 && u < 0.85 ? 0.015 * Math.sin(u * 60) : 0), 0.06 + 0.1 * (1 - eio(u, 0.04, 0.18)) + 0.12 * eio(u, 0.85, 0.97), 0]} rot={[PI, 0, 0]} s={1.1} />
    {u > 0.84 && (() => { const k = 1 - Math.exp(-(u - 0.84) * 40) * Math.cos((u - 0.84) * 70); return <group position={[-0.06, 0.03, 0]} scale={Math.max(0.001, k)}>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.05, 0.052, 0.04, 40]} /><meshPhysicalMaterial color="#e9c27a" roughness={0.6} /></mesh>
      <mesh position={[0, 0.041, 0]}><cylinderGeometry args={[0.05, 0.05, 0.004, 40]} /><meshPhysicalMaterial color="#fff6e6" roughness={0.4} clearcoat={0.6} /></mesh>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.003, 0.003, 0.035, 10]} /><meshStandardMaterial color="#f2e4c8" /></mesh>
      <mesh position={[0, 0.082, 0]} scale={[1, 1.7, 1]}><sphereGeometry args={[0.005, 12, 8]} />{M.glow({ col: "#ffc35a" })}</mesh>
      <pointLight position={[0, 0.1, 0.02]} intensity={0.6} distance={0.3} color="#ffc35a" /></group>; })()}
    {Array.from({ length: 8 }, (_, i) => { const f = ((u * 6 + rn(i, 31)) % 1), rg = cl((f - 0.85) / 0.15); return u > 0.2 && <group key={"pl" + i}>
      <mesh position={[-0.06 + (rn(i, 32) - 0.5) * 0.03, 0.0235, (rn(i, 33) - 0.5) * 0.03]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.004 + 0.006 * f, 16]} /><meshBasicMaterial color="#5a3a20" transparent opacity={0.25 * f} depthWrite={false} /></mesh>
      {rg > 0 && <mesh position={[-0.06 + (rn(i, 32) - 0.5) * 0.03, 0.024, (rn(i, 33) - 0.5) * 0.03]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.004 + 0.012 * rg, 0.006 + 0.012 * rg, 20]} />{M.glow({ col: "#fff4b0", op: 0.8 * (1 - rg) })}</mesh>}</group>; })}
    {Array.from({ length: 26 }, (_, i) => { const a = i * 0.9 + tt * 1.4, r = 0.05 + 0.06 * rn(i, 2), y = 0.04 + ((tt * 0.07 + rn(i, 3) * 0.25) % 0.25);
      return <mesh key={i} position={[-0.06 + Math.cos(a) * r, y, Math.sin(a) * r]}><sphereGeometry args={[0.006 + 0.005 * rn(i, 4), 10, 8]} />{M.glow({ col, op: 0.35 + 0.2 * rn(i, 5) })}</mesh>; })}
    {Array.from({ length: 8 }, (_, i) => { const f = ((u * 6 + rn(i, 31)) % 1); return u > 0.2 && <mesh key={"dr" + i} position={[-0.06 + (rn(i, 32) - 0.5) * 0.03, lerp(0.2, 0.03, f * f), (rn(i, 33) - 0.5) * 0.03]} scale={[1, 1.5, 1]} castShadow><sphereGeometry args={[0.005, 10, 8]} />{M.water({ op: 0.85, col: "#fff1a0" })}</mesh>; })}
    {pie > 0 && <group position={[0.2, 0, 0.08]} scale={cl(pie)}>
      <mesh geometry={lathe([[0, 0], [0.07, 0], [0.085, 0.025], [0.08, 0.028], [0, 0.028]])} castShadow><meshStandardMaterial color="#d79a52" roughness={0.75} /></mesh>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, 0.03, 0]} rotation={[0, i * PI / 3, 0]}><boxGeometry args={[0.15, 0.006, 0.01]} /><meshStandardMaterial color="#e7b469" roughness={0.7} /></mesh>)}
    </group>}
  </>;
}}</Scene3D>;

// ---- 5:35 · LA CAJA DE 1993: una caja de cartón sellada con el año; las cuatro solapas se abren y sube el microondas que regaló Becky ----
export const HBox1993: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0, 0.15, 0], az: [0.55, 0.25], el: [0.38, 0.3], r: [0.95, 0.8], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="BECKY'S GIFT · 1993" col={AMB} />
    </>}>{(tt) => {
  const op = eio(tt, 1.0, 2.0), up = eio(tt, 1.8, 3.4), W = 0.36, D = 0.26, Ht = 0.22;
  const side = tex.text("box1993", 512, 320, (g) => { g.fillStyle = "#b98d5a"; g.fillRect(0, 0, 512, 320); g.strokeStyle = "#5a3a1c"; g.lineWidth = 6; g.strokeRect(30, 40, 452, 240);
    g.fillStyle = "#3b2512"; g.font = "bold 58px sans-serif"; g.fillText("MICROWAVE", 90, 140); g.font = "bold 80px " + SERIF; g.fillText("1993", 170, 250); });
  return <>
    <RBox s={[W, Ht, D]} p={[0, Ht / 2, 0]} r={0.004}><meshStandardMaterial map={kraft()} roughness={0.9} /></RBox>
    <mesh position={[0, Ht / 2, D / 2 + 0.001]}><planeGeometry args={[W * 0.95, Ht * 0.9]} /><meshStandardMaterial map={side} roughness={0.9} /></mesh>
    {[[0, D / 2, W, D / 2, 1, 0], [0, -D / 2, W, D / 2, -1, 0], [W / 2, 0, D, W / 2, 0, 1], [-W / 2, 0, D, W / 2, 0, -1]].map(([x, z, w, d, sz, sx], i) =>
      <group key={i} position={[x, Ht, z]} rotation={[sz * op * 2.1, 0, -sx * op * 2.1]}>
        <mesh position={[-(sx as number) * (d as number) / 2, 0.001, -(sz as number) * (d as number) / 2]} rotation={[-PI / 2, 0, sx ? PI / 2 : 0]}><planeGeometry args={[w as number, d as number]} /><meshStandardMaterial map={kraft()} roughness={0.9} side={THREE.DoubleSide} /></mesh></group>)}
    <group position={[0, -0.02 + up * 0.26, 0]}>
      <RBox s={[0.3, 0.17, 0.2]} p={[0, 0.085, 0]} r={0.012}>{M.porcelain({ col: "#efeeea" })}</RBox>
      <mesh position={[-0.03, 0.085, 0.1005]}><planeGeometry args={[0.18, 0.12]} /><meshPhysicalMaterial color="#1a1c1f" roughness={0.1} clearcoat={1} /></mesh>
      <mesh position={[0.11, 0.11, 0.101]}><planeGeometry args={[0.05, 0.02]} />{M.glow({ col: "#7dff9a", op: 0.9 })}</mesh>
      {[0.07, 0.04].map((y, i) => <mesh key={i} position={[0.11, y, 0.105]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.01, 24]} />{M.steel({})}</mesh>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 6:10 · TRES MINUTOS DE VAPOR: el frente del microondas; el reloj baja de 3:00 a 0:00 y el vidrio se empaña desde los bordes ----
export const HFogWindow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile"
  cam={{ at: [0, 0.12, 0], az: [-0.12, 0.1], el: [0.12, 0.08], r: [0.62, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="3 MINUTES ON HIGH" col={AMB} />
    </>}>{(tt, u) => {
  const wp = Math.round(eio(u, 0.66, 0.94) * 12) / 12, fx = lerp(-0.2, 0.1, eio(u, 0.66, 0.94));
  const p = cl((tt - 0.6) / 4.6), secs = Math.round(180 * (1 - p)), lbl = `${Math.floor(secs / 60)}:${String(Math.floor((secs % 60) / 15) * 15).padStart(2, "0")}`;
  const timer = tex.text("mw" + lbl, 256, 96, (g) => { g.fillStyle = "#0b120c"; g.fillRect(0, 0, 256, 96); g.fillStyle = "#7dff9a"; g.font = "bold 72px monospace"; g.fillText(lbl, 40, 74); });
  const fog = tex.text("fogedge" + wp, 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 30, 128, 128, 180); gr.addColorStop(0, "rgba(255,255,255,0.55)"); gr.addColorStop(1, "rgba(255,255,255,1)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(255,255,255,${0.5 * rn(i, 2)})`; g.beginPath(); g.arc(rn(i, 3) * 256, rn(i, 4) * 256, 2 + 5 * rn(i, 5), 0, 6.3); g.fill(); }
    if (wp > 0) { g.save(); g.globalCompositeOperation = "destination-out"; g.lineCap = "round"; g.lineWidth = 60; g.beginPath(); g.moveTo(-20, 178); g.lineTo(-20 + 280 * wp, 170 - 20 * wp); g.stroke(); g.restore(); } });
  return <>
    <RBox s={[0.48, 0.28, 0.3]} p={[0, 0.14, -0.15]} r={0.014}>{M.porcelain({ col: "#efeeea" })}</RBox>
    <mesh position={[-0.05, 0.14, 0.0015]}><planeGeometry args={[0.3, 0.2]} /><meshPhysicalMaterial map={tex.text("mwin", 384, 256, (g) => { const gr = g.createRadialGradient(192, 150, 20, 192, 140, 260); gr.addColorStop(0, "#ffe6a8"); gr.addColorStop(1, "#4a3a22"); g.fillStyle = gr; g.fillRect(0, 0, 384, 256);
      g.fillStyle = "rgba(255,255,255,.25)"; g.beginPath(); g.ellipse(192, 222, 150, 26, 0, 0, 6.3); g.fill();
      g.fillStyle = "rgba(230,240,250,.55)"; g.beginPath(); g.moveTo(112, 150); g.quadraticCurveTo(192, 250, 272, 150); g.closePath(); g.fill(); g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 3; g.stroke();
      g.fillStyle = "#fff0a0"; g.fillRect(118, 150, 148, 10);
      [[160, 160], [215, 165]].forEach(([x, y]) => { g.fillStyle = "#f2c81e"; g.beginPath(); g.arc(x, y, 26, Math.PI, 0); g.fill(); g.fillStyle = "#fff4b8"; g.beginPath(); g.arc(x, y, 20, Math.PI, 0); g.fill(); }); })} roughness={0.1} clearcoat={1} /></mesh>
    <pointLight position={[-0.05, 0.2, -0.12]} intensity={1.6} distance={0.5} color="#ffe2a0" />
    <group position={[-0.05, 0.045, -0.12]} rotation={[0, tt * 0.8, 0]}>
      <mesh geometry={lathe([[0, 0], [0.05, 0], [0.065, 0.045], [0.06, 0.045], [0.045, 0.004], [0, 0.004]])}>{M.glass({ op: 0.35 })}</mesh>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.058, 0.05, 0.004, 32]} />{M.water({ op: 0.5, col: "#fff2b0" })}</mesh>
      <LemonHalf p={[0.015, 0.034, 0]} rot={[0.3, 0, 0.2]} s={0.7} /><LemonHalf p={[-0.02, 0.034, 0.01]} rot={[-0.2, 1, -0.3]} s={0.7} />
    </group>
    {Array.from({ length: 14 }, (_, i) => { const d = ((tt * 0.5 + rn(i, 2)) % 1); return p > 0.1 && <mesh key={i} position={[-0.05 + (rn(i, 3) - 0.5) * 0.08, 0.09 + d * 0.12, -0.12]}><sphereGeometry args={[0.01 + 0.012 * d, 10, 8]} />{M.glow({ col: "#ffffff", op: 0.25 * (1 - d) * p })}</mesh>; })}
    <mesh position={[-0.05, 0.14, 0.003]}><planeGeometry args={[0.3, 0.2]} /><meshBasicMaterial map={fog} transparent opacity={0.92 * eio(tt, 1.0, 4.8)} depthWrite={false} /></mesh>
    <mesh position={[0.165, 0.2, 0.0015]}><planeGeometry args={[0.1, 0.0375]} /><meshBasicMaterial map={timer} toneMapped={false} /></mesh>
    {u > 0.62 && <mesh position={[fx, 0.088 + 0.015 * eio(u, 0.66, 0.94) + 0.06 * (1 - eio(u, 0.62, 0.68)), 0.03]} rotation={[0.3, 0, -0.5]}><capsuleGeometry args={[0.014, 0.12, 8, 16]} /><meshPhysicalMaterial color="#e3b79a" roughness={0.55} sheen={0.5} /></mesh>}
  </>;
}}</Scene3D>;

// ---- 6:40 · UNA SOLA PASADA: la pared de adentro del microondas salpicada de salsa; un trapo la recorre de un lado a otro y la deja blanca ----
export const HOnePass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="tile"
  cam={{ at: [0, 0.12, 0], az: [0.42, 0.3], el: [0.12, 0.08], r: [0.72, 0.62], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="OFF IN ONE PASS" col={GRN} />
    </>}>{(tt, u) => {
  const w = eio(u, 0.12, 0.86), x0 = -0.22, W = 0.36, ry = 0.12 + 0.045 * Math.sin(PI * w * 2);
  const splat = tex.text("splat2", 512, 320, (g) => { g.fillStyle = "#f2efe8"; g.fillRect(0, 0, 512, 320); g.strokeStyle = "#c9c4b8"; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, 320); g.stroke(); } for (let i = 0; i <= 5; i++) { g.beginPath(); g.moveTo(0, i * 64); g.lineTo(512, i * 64); g.stroke(); } for (let i = 0; i < 160; i++) { const r = 2 + 10 * Math.pow(rn(i, 2), 2); g.fillStyle = `rgba(${150 + rn(i, 3) * 50},${30 + rn(i, 4) * 25},20,${0.6 + 0.4 * rn(i, 5)})`; g.beginPath(); g.ellipse(rn(i, 6) * 512, rn(i, 7) * 320, r, r * (0.6 + rn(i, 8)), rn(i, 9) * 3, 0, 6.3); g.fill(); } });
  return <>
    <mesh position={[0, 0.12, 0]}><planeGeometry args={[W, 0.26]} /><meshPhysicalMaterial map={splat} roughness={0.35} clearcoat={0.5} /></mesh>
    {w > 0 && <mesh position={[x0 + (W * w) / 2, 0.12, 0.001]}><planeGeometry args={[W * w, 0.26]} /><meshPhysicalMaterial map={tex.tile(7 * w + 0.01, 4, "#f7f5f0", "#c9c4b8")} roughness={0.05} clearcoat={1} clearcoatRoughness={0.02} /></mesh>}
    {/* caja del microondas: piso con plato, laterales y techo esmaltados, luz interior */}
    <mesh position={[0, -0.012, 0.15]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[W + 0.08, 0.32]} /><meshPhysicalMaterial color="#e9e6df" roughness={0.3} clearcoat={0.6} /></mesh>
    <mesh position={[0, -0.006, 0.15]}><cylinderGeometry args={[0.15, 0.15, 0.006, 48]} />{M.glass({ op: 0.35 })}</mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[k * (W / 2 + 0.04), 0.12, 0.15]} rotation={[0, -k * PI / 2, 0]}><planeGeometry args={[0.32, 0.28]} /><meshPhysicalMaterial color="#dcd8cf" roughness={0.35} clearcoat={0.5} side={THREE.DoubleSide} /></mesh>)}
    <mesh position={[0, 0.262, 0.15]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[W + 0.08, 0.32]} /><meshPhysicalMaterial color="#d6d2c8" roughness={0.4} side={THREE.DoubleSide} /></mesh>
    <pointLight position={[0.15, 0.24, 0.12]} intensity={0.9} distance={0.7} color="#ffe6b8" />
    {w > 0.02 && <mesh position={[x0 + W * w - 0.035, ry, 0.004]}><planeGeometry args={[0.07, 0.24]} />{M.glow({ col: "#ffffff", op: 0.45 * (1 - eio(u, 0.86, 0.98)) })}</mesh>}
    {u > 0.86 && <mesh position={[0.14, 0.18, 0.01]} rotation={[0, 0, u * 6]} scale={Math.sin(PI * eio(u, 0.86, 0.99)) * 0.03 + 0.0001}><octahedronGeometry args={[1, 0]} />{M.glow({ col: "#ffffff", op: 0.9 })}</mesh>}
    {w > 0.02 && <mesh position={[x0 + W * w / 2, 0.13, 0.012]}><planeGeometry args={[W * w, 0.05]} />{M.glow({ col: "#ffffff", op: 0.22 })}</mesh>}
    {w > 0.02 && Array.from({ length: 10 }, (_, i) => { const xx = x0 + W * w * rn(i, 71); return <mesh key={"wd" + i} position={[xx, 0.1 - 0.06 * ((u * 3 + rn(i, 72)) % 1), 0.013]}><sphereGeometry args={[0.003, 8, 6]} />{M.water({ op: 0.8 })}</mesh>; })}
    <group position={[x0 + W * w, ry + 0.008 * Math.sin(tt * 9), 0.02]} rotation={[0, 0, PI / 2 + 0.06 * Math.sin(PI * w * 6)]}>
      <RBox s={[0.07, 0.22, 0.03]} r={0.012}><meshStandardMaterial map={tex.text("check", 128, 128, (g) => { g.fillStyle = "#f4f4f4"; g.fillRect(0, 0, 128, 128); g.fillStyle = "rgba(40,90,170,.55)"; for (let i = 0; i < 8; i++) { g.fillRect(i * 16, 0, 8, 128); g.fillRect(0, i * 16, 128, 8); } })} roughness={0.95} /></RBox>
    </group>
  </>;
}}</Scene3D>;

// ---- 7:14 · SEIS OLLAS DE 1952: un riel de cocina con seis ollas de fondo de cobre ennegrecidas; abajo se enciende la placa de bronce de los Lindquist ----
export const HSixPots: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="tile" lamp={[0, 0.5, 0.5]}
  cam={{ at: [0.06, 0.18, 0], az: [-0.2, 0.2], el: [0.12, 0.05], r: [1.42, 1.26], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="SIX POTS FROM 1952" col={AMB} /></>}>{(tt, u) => {
  const dark = tex.text("cudark", 256, 256, (g) => { g.fillStyle = "#4a2a18"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(${60 + rn(i, 2) * 40},${140 + rn(i, 3) * 40},${110},${0.35 * rn(i, 4)})`; g.beginPath(); g.arc(rn(i, 5) * 256, rn(i, 6) * 256, 3 + 10 * rn(i, 7), 0, 6.3); g.fill(); } });
  const plaque = tex.text("plaque52b", 512, 160, (g) => { g.fillStyle = "#b8893a"; g.fillRect(0, 0, 512, 160); g.strokeStyle = "#6b4a14"; g.lineWidth = 6; g.strokeRect(10, 10, 492, 140); g.fillStyle = "#3a2608"; g.font = "bold 110px " + SERIF; g.fillText("1952", 140, 120); });
  const _old = tex.text("plaque52", 512, 160, (g) => { g.fillStyle = "#b8893a"; g.fillRect(0, 0, 512, 160); g.strokeStyle = "#6b4a14"; g.lineWidth = 6; g.strokeRect(10, 10, 492, 140);
    g.fillStyle = "#3a2608"; g.font = "bold 30px " + SERIF; g.fillText("IN LOVING MEMORY", 120, 62); g.font = "bold 34px " + SERIF; g.fillText("THE LINDQUIST FAMILY · 1952", 28, 116); });
  const pl = (u > 0.42 ? 1 - Math.exp(-(u - 0.42) * 30) * Math.cos((u - 0.42) * 60) : 0);
  return <>
    <mesh position={[0, 0.36, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.95, 16]} />{M.steel({})}</mesh>
    {Array.from({ length: 6 }, (_, i) => { const k = phys(tt, 0.2 + i * 0.22, 6, 0.45), sw = 0.3 * Math.sin(u * 13 - i * 0.12) * eio(u, 0.08, 0.2) * (1 - 0.4 * eio(u, 0.8, 1));
      return k > 0 && <group key={i} position={[-0.39 + i * 0.156, 0.36, 0]} rotation={[0, 0, sw]} scale={cl(k)}>
        <mesh position={[0, -0.02, 0]}><torusGeometry args={[0.012, 0.0025, 8, 20]} />{M.steel({})}</mesh>
        <group position={[0, -0.17, 0]} rotation={[PI / 2 - 0.25, 0, 0]}>
          <mesh geometry={lathe([[0, 0], [0.065, 0], [0.068, 0.12], [0.064, 0.12], [0.061, 0.004], [0, 0.004]])}>{M.steel({ side: THREE.DoubleSide })}</mesh>
          <mesh position={[0, -0.001, 0]} rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.066, 40]} /><meshStandardMaterial map={dark} metalness={0.6} roughness={0.55} /></mesh></group>
      </group>; })}
    <pointLight position={[0, 0.06, 0.25]} intensity={0.9 * cl(pl)} distance={0.6} color="#ffd38a" />
    {pl > 0 && <group position={[0, 0.06, 0.12]} scale={0.8 * Math.max(0.001, pl)}><RBox s={[0.42, 0.13, 0.012]} r={0.01}>{M.brass({})}</RBox>
      <mesh position={[0, 0, 0.0065]}><planeGeometry args={[0.4, 0.125]} /><meshStandardMaterial map={plaque} metalness={0.7} roughness={0.3} /></mesh></group>}
  </>;
}}</Scene3D>;

// ---- 7:46 · EL COBRE SE PONE ROSA: el fondo oscuro de una olla de frente; el medio limón con sal da vueltas en espiral y detrás aparece el cobre rosado ----
export const HPinkSweep: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" lamp={[0.2, 0.3, 0.5]}
  cam={{ at: [0, 0, 0], az: [0.15, -0.1], el: [0.1, 0.06], r: [0.9, 0.8], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="PINK, LIKE MAGIC" col={AMB} />
    </>}>{(tt, u) => {
  const p = eio(u, 0.08, 0.9), a = p * PI * 2 * 4, rr = 0.15 * p, R = 0.17;
  const dark = tex.text("cudark2", 256, 256, (g) => { g.fillStyle = "#3a2214"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(${70 + rn(i, 2) * 40},${130 + rn(i, 3) * 40},${100},${0.4 * rn(i, 4)})`; g.beginPath(); g.arc(rn(i, 5) * 256, rn(i, 6) * 256, 3 + 12 * rn(i, 7), 0, 6.3); g.fill(); } });
  return <group rotation={[0, 0, 0]}>
    <mesh><circleGeometry args={[R, 64]} /><meshStandardMaterial map={dark} metalness={0.7} roughness={0.5} /></mesh>
    <mesh><torusGeometry args={[R, 0.012, 16, 64]} />{M.steel({})}</mesh>
    {p > 0 && <mesh position={[0, 0, 0.001]}><circleGeometry args={[Math.min(R, rr + 0.03), 64]} /><meshStandardMaterial color="#f0a07a" metalness={1} roughness={0.18} emissive="#7a3a20" emissiveIntensity={0.25} /></mesh>}
    {p > 0 && <mesh position={[0, 0, 0.003]}><ringGeometry args={[Math.max(0, rr - 0.004), rr + 0.03, 64, 1, a - 2.4, 2.4]} />{M.glow({ col: "#ff9a7a", op: 0.55 })}</mesh>}
    {Array.from({ length: 18 }, (_, i) => { const ph = (u * 9 + rn(i, 2)) % 1, aa = a + (rn(i, 3) - 0.5) * 1.2, d = rr + 0.02 + ph * 0.12; return p > 0.02 && p < 0.99 && <mesh key={"sp" + i} position={[Math.cos(aa) * d, Math.sin(aa) * d, 0.03 + 0.05 * Math.sin(PI * ph)]}><sphereGeometry args={[0.004 + 0.003 * rn(i, 4), 8, 6]} />{M.water({ op: 0.85 * (1 - ph), col: "#fff2a8" })}</mesh>; })}
    <group position={[Math.cos(a) * rr, Math.sin(a) * rr, 0.035 - 0.006 * Math.abs(Math.sin(a * 2))]} rotation={[0, 0, a * 0.6]}><LemonHalf p={[0, 0, 0]} rot={[-PI / 2, 0, 0]} s={1.3} /></group>
    {Array.from({ length: 30 }, (_, i) => { const aa = a - i * 0.25, r2 = Math.max(0, rr - i * 0.004); return p > 0 && <mesh key={i} position={[Math.cos(aa) * r2 + (rn(i, 2) - 0.5) * 0.02, Math.sin(aa) * r2 + (rn(i, 3) - 0.5) * 0.02, 0.004]}><boxGeometry args={[0.004, 0.004, 0.003]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.5} /></mesh>; })}
  </group>;
}}</Scene3D>;

// ---- 8:02 · EL ACTA DE 1979: el cuaderno de actas de la Sociedad de Damas; un lápiz escribe «Edna P.: lemon & salt» y abajo «we let it go» ----
const MIN_L = ["LADIES AID · MINUTES · 1979", "Coffee & opening prayer.", "Edna P. announced a NEW way", "to polish copper: lemon & salt!", "(we let it go)"];
export const HMinutes1979: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" lamp={[-0.2, 0.4, 0.3]}
  cam={{ at: [0, 0, 0], az: [0.15, -0.05], el: [0.95, 0.85], r: [0.55, 0.47], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="LADIES AID, 1979" col={AMB} /></>}>{(tt, u) => {
  const n = Math.floor(MIN_L.length * 10 * eio(u, 0.04, 0.74)), ul = eio(u, 0.76, 0.9);
  const page = tex.text("min79_" + n, 512, 640, (g) => { g.fillStyle = "#f3ecd8"; g.fillRect(0, 0, 512, 640); g.strokeStyle = "rgba(90,120,170,.35)"; g.lineWidth = 2;
    for (let i = 0; i < 14; i++) { g.beginPath(); g.moveTo(30, 90 + i * 40); g.lineTo(490, 90 + i * 40); g.stroke(); } g.strokeStyle = "rgba(200,60,60,.4)"; g.beginPath(); g.moveTo(60, 0); g.lineTo(60, 640); g.stroke();
    let left = n; MIN_L.forEach((l, i) => { const k = Math.min(l.length, Math.max(0, Math.round(left * l.length / 10))); left -= 10;
      g.fillStyle = i === 0 ? "#1d2a55" : i === 4 ? "#8a1f1f" : "#22305e"; g.font = (i === 0 ? "bold 26px " : "italic 30px ") + SERIF; g.fillText(l.slice(0, k), 72, 80 + i * 80 + (i === 0 ? 0 : 6)); }); });
  const li = Math.min(4, Math.floor(n / 10)), px = 72 + Math.min(1, (n % 10) / 10) * 380, py = 80 + li * 80;
  return <>
    <mesh rotation={[-PI / 2, 0, 0.05]} position={[0, 0.002, 0]} receiveShadow><planeGeometry args={[0.32, 0.4]} /><meshStandardMaterial map={page} roughness={0.9} /></mesh>
    {ul > 0 && <group rotation={[0, 0.05, 0]}><mesh rotation={[-PI / 2, 0, 0]} position={[-0.115 + 0.07 * ul, 0.004, 0.062]}><planeGeometry args={[0.14 * ul, 0.005]} />{M.glow({ col: "#ff6a3a", op: 0.9 })}</mesh>
      <pointLight position={[-0.05, 0.05, 0.06]} intensity={0.6 * ul} distance={0.3} color="#ffb070" /></group>}
    <group position={[-0.16 + (px / 512) * 0.32, 0.03, -0.2 + (py / 640) * 0.4]} rotation={[0.9, 0.4, 0.4]}>
      <mesh><cylinderGeometry args={[0.005, 0.005, 0.15, 6]} /><meshStandardMaterial color="#e8b828" roughness={0.6} /></mesh>
      <mesh position={[0, -0.08, 0]}><coneGeometry args={[0.005, 0.014, 6]} /><meshStandardMaterial color="#e2c79a" /></mesh>
      <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.0052, 0.0052, 0.012, 8]} /><meshStandardMaterial color="#e48a9a" /></mesh></group>
    <group position={[0.24, 0, 0.08]}><mesh geometry={lathe([[0, 0], [0.03, 0], [0.036, 0.07], [0.033, 0.07], [0.027, 0.004], [0, 0.004]])} castShadow>{M.porcelain({})}</mesh>
      <mesh position={[0, 0.062, 0]}><cylinderGeometry args={[0.033, 0.03, 0.002, 24]} /><meshStandardMaterial color="#3a2010" roughness={0.2} /></mesh></group>
  </>;
}}</Scene3D>;
