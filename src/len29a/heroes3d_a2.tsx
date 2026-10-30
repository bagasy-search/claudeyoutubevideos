// len29a · 3ª vuelta en 3D (tanda 2): espuma, cajas, balanza, Cicero, arriba/abajo.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, RED, H } from "./hkit";
import { DigitDrum, Hair, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";

const PI = Math.PI;
const ring = (tt: number, a: number, x: number, y: number, z: number, r: number, col = "#d8f0ff", d = 0.65) => {
  const k = cl((tt - a) / d);
  return k > 0 && k < 1 ? <mesh position={[x, y + 0.001, z]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[r * (1 + 5 * k), r * (1.35 + 5 * k), 48]} /><meshBasicMaterial color={col} transparent opacity={0.75 * (1 - k)} depthWrite={false} /></mesh> : null;
};

const polTex = () => tex.text("polaroid_casa", 256, 240, (g) => {
  const sky = g.createLinearGradient(0, 0, 0, 150); sky.addColorStop(0, "#8fb4d6"); sky.addColorStop(1, "#e9d9b8"); g.fillStyle = sky; g.fillRect(0, 0, 256, 240);
  g.fillStyle = "#6f8a4a"; g.fillRect(0, 165, 256, 75);
  g.fillStyle = "#e4d2b4"; g.fillRect(64, 100, 128, 75);
  g.fillStyle = "#8a3a2a"; g.beginPath(); g.moveTo(52, 104); g.lineTo(128, 52); g.lineTo(204, 104); g.closePath(); g.fill();
  g.fillStyle = "#60361e"; g.fillRect(92, 128, 24, 47);
  g.fillStyle = "#ffd38a"; g.fillRect(138, 120, 34, 24); g.strokeStyle = "#f6f3ea"; g.lineWidth = 3; g.strokeRect(138, 120, 34, 24);
  g.fillStyle = "#7a6a5a"; g.fillRect(160, 60, 14, 32);
  g.fillStyle = "rgba(255,230,180,0.18)"; g.fillRect(0, 0, 256, 240);
});

// ---- 0:24 · LA PARED DE AGUA: 12 bolas de espuma caen por el caño de vidrio, pegan en el agua quieta, rebotan y se apilan; el tapón de abajo, quieto ----
export const HFoamWall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile"
  cam={{ at: [0, 0.42, 0], at1: [0, 0.38, 0], az: [0.5, -0.2], el: [0.16, 0.1], r: [1.95, 1.75], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="IT NEVER TOUCHES IT" col={ICE} />}>{(tt) => {
  const W = 0.32, pipeIn = cl(phys(tt, 0.1, 6, 0.6));
  return <group position={[0, 0.4 * (1 - pipeIn), 0]}>
    {/* caño de vidrio parado en su abrazadera, agua quieta hasta W, tapón de grasa abajo */}
    <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.075, 0.075, 0.72, 48, 1, true]} />{M.glass({ op: 0.24 })}</mesh>
    <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.07, 0.07, W - 0.02, 40]} />{M.water({ op: 0.55 })}</mesh>
    <mesh position={[0, W - 0.004, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 40]} />{M.water({ op: 0.4, emI: 0.6 })}</mesh>
    <mesh position={[0, 0.055, 0]} castShadow><cylinderGeometry args={[0.07, 0.07, 0.09, 40]} />{M.plastic({ col: "#c8261e", em: "#6a0a05", emI: 0.55 })}</mesh>
    <pointLight position={[0.12, 0.08, 0.14]} intensity={0.36} distance={0.45} color="#ffb0a0" />
    {[0, 1].map((j) => { const k = ((tt * 0.45 + j / 2) % 1); return <mesh key={"wv" + j} position={[0, W - 0.002, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.012 + 0.05 * k, 0.016 + 0.05 * k, 40]} />{M.glow({ col: "#e8f4ff", op: 0.5 * (1 - k) })}</mesh>; })}
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[Math.cos(i * 2.1) * 0.05, 0.1 + 0.004 * i, Math.sin(i * 2.1) * 0.05]} rotation={[0.4 * i, i, 0.3]}><torusGeometry args={[0.018, 0.0012, 4, 24]} />{M.hair()}</mesh>)}
    {/* la gota quieta que cuelga del tapón: nadie la molesta */}
    <mesh position={[0.02, 0.092 + 0.004 * Math.sin(tt * 2), 0.04]} scale={[1, 1.3 + 0.1 * Math.sin(tt * 3), 1]}><sphereGeometry args={[0.012, 16, 12]} />{M.water({ op: 0.9, col: "#a8d6f5" })}</mesh>
    {[0.02, 0.72].map((y, i) => <mesh key={i} position={[0, y, 0]}><torusGeometry args={[0.078, 0.008, 10, 48]} />{M.chrome()}</mesh>)}
    {Array.from({ length: 12 }, (_, i) => {
      const a = 0.7 + i * 0.32, layer = i < 6 ? 0 : i < 10 ? 1 : 2, ang = i * 2.39, rr = layer === 2 ? 0.012 : 0.038;
      const rest = [Math.cos(ang) * rr, W + 0.022 + layer * 0.034, Math.sin(ang) * rr];
      if (tt < a - 0.4) return null;
      const k = cl((tt - (a - 0.4)) / 0.4), y = tt < a ? lerp(0.78, rest[1], k * k) : rest[1] + 0.045 * Math.sin(PI * cl((tt - a) / 0.32)) * Math.exp(-(tt - a) * 3);
      return <group key={i}>
        <mesh position={[rest[0], y, rest[2]]} castShadow><sphereGeometry args={[0.027, 28, 18]} /><meshPhysicalMaterial color="#fbfdff" roughness={0.05} clearcoat={1} clearcoatRoughness={0.02} sheen={1} sheenColor="#cfe9ff" emissive="#cfe9ff" emissiveIntensity={0.12} /></mesh>
        {ring(tt, a, rest[0], W, rest[2], 0.02)}
      </group>;
    })}
  </group>;
}}</Scene3D>;

// ---- 0:41 · LA SEMANA DE VOLCANES: cada noche cae otra caja de bicarbonato y otro bidón vacío; el contador mecánico rueda hasta 7 ----
const sodaTex = () => tex.text("soda", 128, 192, (g) => {
  g.fillStyle = "#f08a24"; g.fillRect(0, 0, 128, 192); g.fillStyle = "#fff6e6"; g.fillRect(0, 70, 128, 44);
  g.fillStyle = "#c2302a"; g.beginPath(); g.arc(64, 40, 18, 0, 6.3); g.fill(); g.fillStyle = "#2a4f8a"; g.fillRect(0, 160, 128, 32);
});
export const HPipeBoxes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="wood"
  cam={{ at: [0.02, 0.1, 0], az: [-0.12, 0.08], el: [0.24, 0.18], r: [1.62, 1.5], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="EVERY NIGHT, AGAIN" col={AMB} />}>{(tt) => {
  const n = (i: number) => 0.55 + i * 0.6, landed = cl(Array.from({ length: 7 }, (_, i) => cl((tt - n(i)) / 0.35)).reduce((a, b) => a + b, 0) / 7) * 7;
  const flash = cl(phys(tt, n(6) + 0.3, 7, 0.5)) * (1 - cl((tt - n(6) - 1.1) / 0.8));
  return <>
    {Array.from({ length: 7 }, (_, i) => {
      if (tt < n(i) - 0.3) return null;
      const x = -0.48 + i * 0.115, s = 0.85 + 0.3 * rn(i, 2), y = 0.32 * (1 - phys(tt, n(i) - 0.3, 9, 0.38)), rz = (rn(i, 4) - 0.5) * 0.3 * (1 - cl((tt - n(i)) / 0.5));
      return <group key={i}>
        <group position={[x, y, -0.05 + 0.05 * rn(i, 6)]} rotation={[0, (rn(i, 7) - 0.5) * 0.6, rz]} scale={s}>
          <mesh position={[0, 0.055, 0]} castShadow receiveShadow><boxGeometry args={[0.07, 0.11, 0.042]} /><meshStandardMaterial map={sodaTex()} roughness={0.6} /></mesh>
        </group>
        <group position={[x + 0.05, 0.36 * (1 - phys(tt, n(i) - 0.15, 9, 0.38)), 0.12 + 0.04 * rn(i, 8)]} rotation={[0, rn(i, 9) * 2, rz]} scale={s * 0.9}>
          <mesh position={[0, 0.07, 0]} castShadow><cylinderGeometry args={[0.04, 0.045, 0.14, 32]} />{M.plastic({ col: "#f1f0e8", op: 0.62 })}</mesh>
          <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.016, 0.02, 0.025, 20]} />{M.plastic({ col: "#e5c240" })}</mesh>
          <mesh position={[0.035, 0.1, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.022, 0.006, 8, 24, PI]} />{M.plastic({ col: "#f1f0e8", op: 0.7 })}</mesh>
        </group>
      </group>;
    })}
    {/* el contador mecánico: caja de bronce con un tambor que rueda una noche por caja */}
    <group position={[0.48, 0.012 * Array.from({ length: 7 }, (_, i) => Math.sin(PI * cl((tt - n(i)) / 0.25))).reduce((a, b) => a + b, 0), -0.02]} scale={1.9}>
      <RBox s={[0.16, 0.12, 0.1]} r={0.012} p={[0, 0.06, 0]}>{M.brass({ col: "#b8873a" })}</RBox>
      <mesh position={[0, 0.07, 0.051]}><planeGeometry args={[0.07, 0.07]} />{M.matte({ col: "#151515" })}</mesh>
      <DigitDrum v={landed} p={[0, 0.07, 0.03]} r={0.038} w={0.05} />
      {[-1, 1].map((k) => <RBox key={k} s={[0.1, 0.03, 0.01]} r={0.003} p={[0, 0.07 + k * 0.033, 0.072]}>{M.brass({ col: "#b8873a" })}</RBox>)}
      <mesh position={[0, 0.07, 0.07]} scale={1 + flash * 0.3}><ringGeometry args={[0.05, 0.056, 48]} />{M.glow({ col: AMB, op: 0.7 * flash })}</mesh>
      <pointLight position={[0, 0.1, 0.15]} intensity={0.3 * flash} distance={0.4} color="#ffb24a" />
    </group>
  </>;
}}</Scene3D>;

// ---- 1:56 · LA BALANZA: se equilibran, se vuelcan al vaso, los cristales se disuelven y los platillos suben vacíos ----
export const HScale: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" lamp={[0, 0.9, 0.4]}
  cam={{ at: [0, 0.34, 0.08], at1: [0, 0.3, 0.14], az: [-0.25, 0.2], el: [0.16, 0.2], r: [1.55, 1.3], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THEY CANCEL OUT" col={AMB} />}>{(tt) => {
  const tilt = 0.3 * Math.exp(-tt * 1.1) * Math.sin(tt * 4.2), pour = eio(tt, 2.0, 2.8), up = 0.06 * phys(tt, 2.8, 7, 0.32);
  const lvl = eio(tt, 2.2, 3.4), standIn = cl(phys(tt, 0.05, 6, 0.6));
  const pan = (side: number) => {
    const x = side * 0.27, y = 0.25 + side * Math.sin(tilt) * 0.27 + up;
    return <group position={[x, y, 0]}>
      {[0, 1, 2].map((i) => { const a = i * 2.1; return <mesh key={i} position={[Math.cos(a) * 0.04, 0.09, Math.sin(a) * 0.04]} rotation={[Math.sin(a) * 0.38, 0, -Math.cos(a) * 0.38]}><cylinderGeometry args={[0.0015, 0.0015, 0.19, 6]} />{M.steel()}</mesh>; })}
      <mesh castShadow><cylinderGeometry args={[0.1, 0.075, 0.02, 48]} />{M.brass()}</mesh>
      {side < 0 ? <mesh position={[0, 0.03, 0]} scale={1 - pour}><coneGeometry args={[0.07, 0.05, 32]} />{M.matte({ col: "#f4f2ee" })}</mesh>
        : <mesh position={[0, 0.012, 0]} scale={[1 - pour, 1, 1 - pour]}><cylinderGeometry args={[0.085, 0.085, 0.008, 40]} />{M.water({ col: "#d8a640", op: 0.8, em: "#3a2405" })}</mesh>}
    </group>;
  };
  return <>
    <group scale={[1, standIn, 1]}>
      <mesh position={[0, 0.005, -0.05]} castShadow><cylinderGeometry args={[0.08, 0.09, 0.01, 40]} />{M.brass()}</mesh>
      <mesh position={[0, 0.22, -0.05]} castShadow><cylinderGeometry args={[0.009, 0.012, 0.44, 16]} />{M.brass()}</mesh>
      <group position={[0, 0.44, -0.05]} rotation={[0, 0, tilt]}>
        <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.007, 0.007, 0.56, 16]} />{M.brass()}</mesh>
        <mesh><sphereGeometry args={[0.018, 20, 14]} />{M.brass({ col: "#e9bd5c" })}</mesh>
      </group>
    </group>
    <group position={[0, 0, -0.05]}>{pan(-1)}{pan(1)}</group>
    {/* chorros que caen al vaso mientras se vuelcan */}
    {pour > 0 && pour < 1 && [-1, 1].map((s) => <mesh key={s} geometry={tubeG("pour" + s, [[s * 0.2, 0.27, -0.03], [s * 0.12, 0.27, 0.06], [s * 0.03, 0.2, 0.2], [s * 0.01, 0.13, 0.22]], 0.006, 40, 8)}>{s < 0 ? M.matte({ col: "#f4f2ee" }) : M.water({ col: "#d8a640", op: 0.8 })}</mesh>)}
    {/* EL VASO: se llena de agua salada con menisco y burbujas; los 6 cristales caen y se disuelven */}
    <group position={[0, 0, 0.22]}>
      <mesh position={[0, 0.09, 0]} castShadow><cylinderGeometry args={[0.065, 0.058, 0.18, 48, 1, true]} />{M.glass({ op: 0.26 })}</mesh>
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.058, 0.058, 0.004, 40]} />{M.glass({ op: 0.45 })}</mesh>
      {lvl > 0 && <mesh position={[0, 0.006 + lvl * 0.06, 0]}><cylinderGeometry args={[0.061, 0.057, lvl * 0.12, 40]} />{M.water({ op: 0.5, col: "#cfe8f5" })}</mesh>}
      {lvl > 0 && <mesh position={[0, 0.006 + lvl * 0.12, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.05, 0.062, 40]} />{M.water({ op: 0.6, emI: 0.8 })}</mesh>}
      {Array.from({ length: 14 }, (_, i) => { const a = 2.3 + i * 0.16, k = cl((tt - a) / 1.2); return k > 0 && k < 1 && lvl > 0.2 ? <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.08, 0.01 + k * lvl * 0.11, (rn(i, 3) - 0.5) * 0.08]}><sphereGeometry args={[0.004 + 0.003 * rn(i, 4), 10, 8]} />{M.glass({ op: 0.6 })}</mesh> : null; })}
      {Array.from({ length: 6 }, (_, i) => {
        const a = 2.9 + i * 0.42, k = cl((tt - a + 0.35) / 0.35), dis = 1 - cl((tt - a - 0.3) / 1.1);
        if (k <= 0 || dis <= 0) return null;
        const y = lerp(0.42, 0.02 + 0.02 * rn(i, 5), k * k);
        return <mesh key={i} position={[(rn(i, 6) - 0.5) * 0.06, y, (rn(i, 7) - 0.5) * 0.06]} rotation={[rn(i, 8) * 3, rn(i, 9) * 3, 0]} scale={0.001 + 0.036 * dis}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} clearcoat={1} transparent opacity={0.85} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>;
      })}
      {Array.from({ length: 36 }, (_, q) => { const i = q % 6, a = 2.9 + i * 0.42 + 0.05 + 0.12 * Math.floor(q / 6), k = cl((tt - a) / 0.9); if (k <= 0 || k >= 1 || lvl < 0.3) return null; return <mesh key={"b" + q} position={[(rn(i, 6) - 0.5) * 0.06 + 0.01 * (rn(q, 11) - 0.5), 0.03 + k * 0.08, (rn(i, 7) - 0.5) * 0.06 + 0.01 * (rn(q, 12) - 0.5)]}><sphereGeometry args={[0.003 + 0.002 * rn(q, 13), 8, 6]} />{M.glass({ op: 0.7 * (1 - k) })}</mesh>; })}
    </group>
  </>;
}}</Scene3D>;

// ---- 2:27 · CICERO, 1982: el mapa se desenrolla, el camino sale del taller y donde cae el pin se levanta la casita de la señora ----
const mapTex = () => tex.text("mapcicero", 1024, 640, (g) => {
  g.fillStyle = "#e9dfc4"; g.fillRect(0, 0, 1024, 640);
  g.fillStyle = "#cfe0c0"; g.fillRect(620, 60, 180, 120); g.fillRect(120, 420, 140, 140);
  g.strokeStyle = "#b9a985"; g.lineWidth = 6; for (let x = 40; x < 1024; x += 86) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 20, 640); g.stroke(); } for (let y = 30; y < 640; y += 74) { g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y - 10); g.stroke(); }
  g.strokeStyle = "#e1c27a"; g.lineWidth = 16; g.beginPath(); g.moveTo(0, 330); g.lineTo(1024, 300); g.stroke();
  g.strokeStyle = "#8fb6d6"; g.lineWidth = 22; g.beginPath(); g.moveTo(0, 590); g.bezierCurveTo(300, 520, 520, 640, 1024, 560); g.stroke();
  g.fillStyle = "#5a4a32"; g.font = "700 64px Georgia"; g.fillText("CICERO", 640, 260); g.fillText("CHICAGO", 90, 130);
});
export const HCicero: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" lamp={[0.1, 0.7, 0.2]}
  cam={{ at: [0, 0.05, 0], at1: [0.22, 0.08, 0], az: [-0.1, 0.35], el: [0.85, 0.55], r: [1.5, 0.95], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="CICERO, 1982" col={AMB} />}>{(tt) => {
  const un = eio(tt, 0.05, 1.1), W = 1.1, D = 0.68;
  const A = [-0.38, 0.002, -0.18], B = [0.22, 0.002, 0.06], path = eio(tt, 1.3, 2.9);
  const pin = 0.45 * (1 - phys(tt, 2.9, 9, 0.35)), house = cl(phys(tt, 3.3, 6, 0.5));
  const dash = 22;
  return <>
    {/* el mapa: se tiende desde el rollo que corre a la derecha */}
    <mesh position={[-W / 2 + (W * un) / 2, 0.003, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow scale={[Math.max(un, 0.001), 1, 1]}><planeGeometry args={[W, D]} /><meshStandardMaterial map={mapTex()} roughness={0.85} /></mesh>
    {un < 0.99 && <mesh position={[-W / 2 + W * un, 0.018, 0]} rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.018, 0.018, D, 24]} /><meshStandardMaterial color="#e1d6b8" roughness={0.85} /></mesh>}
    {/* el taller de Stan: un galponcito con techo a dos aguas */}
    <group position={[A[0], 0, A[2]]} scale={cl(phys(tt, 1.0, 7, 0.5))}>
      <RBox s={[0.13, 0.08, 0.09]} r={0.003} p={[0, 0.04, 0]}>{M.steel({ col: "#5e6a72" })}</RBox>
      <mesh position={[0, 0.082, 0]} castShadow><boxGeometry args={[0.14, 0.006, 0.1]} />{M.matte({ col: "#2a2e33" })}</mesh>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, 0.01 + i * 0.009, 0.0456]}><boxGeometry args={[0.08, 0.004, 0.002]} />{M.chrome({ col: "#9aa4aa" })}</mesh>)}
      <mesh position={[0, 0.1, 0.03]}><boxGeometry args={[0.07, 0.022, 0.004]} />{M.glow({ col: AMB })}</mesh>
    </group>
    {/* el camino: guiones rojos que salen del taller hacia Cicero */}
    {Array.from({ length: dash }, (_, i) => { const u = i / (dash - 1); if (u > path) return null; const x = lerp(A[0], B[0], u), z = lerp(A[2], B[2], u) + Math.sin(u * PI) * -0.1; return <mesh key={i} position={[x, 0.006, z]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.008, 16]} />{M.glow({ col: RED })}</mesh>; })}
    {/* el pin cae y clava */}
    <group position={[B[0] - 0.1, pin, B[2] + 0.06]}>
      <mesh position={[0, 0.06, 0]} castShadow><sphereGeometry args={[0.018, 24, 16]} />{M.plastic({ col: RED, em: "#5a0a05", emI: 0.3 })}</mesh>
      <mesh position={[0, 0.025, 0]}><cylinderGeometry args={[0.002, 0.0005, 0.05, 8]} />{M.steel()}</mesh>
    </group>
    {/* la casita de la señora: paredes de ladrillo claro, tejas, puerta y ventana con luz */}
    <group position={[B[0], 0, B[2]]} scale={[1.5, 1.5 * house, 1.5]}>
      <RBox s={[0.14, 0.1, 0.12]} r={0.004} p={[0, 0.05, 0]}>{M.matte({ col: "#e4d2b4" })}</RBox>
      {[-1, 1].map((s) => <mesh key={s} position={[0, 0.125, s * 0.034]} rotation={[s * 0.85, 0, 0]} castShadow><boxGeometry args={[0.16, 0.006, 0.09]} />{M.matte({ col: "#8a3a2a" })}</mesh>)}
      {Array.from({ length: 5 }, (_, i) => [-1, 1].map((s) => <mesh key={i + "_" + s} position={[-0.064 + i * 0.032, 0.128 - 0.0 * i, s * 0.034]} rotation={[s * 0.85, 0, 0]}><boxGeometry args={[0.003, 0.009, 0.09]} />{M.matte({ col: "#6e2a1e" })}</mesh>))}
      <mesh position={[-0.03, 0.03, 0.061]}><planeGeometry args={[0.03, 0.055]} />{M.wood({ base: [96, 52, 30] })}</mesh>
      <mesh position={[0.035, 0.06, 0.061]}><planeGeometry args={[0.035, 0.03]} />{M.glow({ col: "#ffd38a" })}</mesh>
      <mesh position={[0.045, 0.16, -0.02]} castShadow><boxGeometry args={[0.02, 0.05, 0.02]} />{M.matte({ col: "#7a6a5a" })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 3:19 · ARRIBA / ABAJO: base y ácido chocan arriba en la pileta (chispas y espuma); abajo, el tapón en la U ni se mueve ----
const UP = [[0, 0.5, 0], [0, 0.28, 0], [0, 0.14, 0], [0.03, 0.07, 0], [0.1, 0.055, 0], [0.17, 0.07, 0], [0.2, 0.14, 0], [0.2, 0.2, 0], [0.36, 0.22, 0]];
export const HUpDown: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="tile"
  cam={{ at: [0.06, 0.36, 0], at1: [0.06, 0.34, 0], az: [-0.3, 0.22], el: [0.2, 0.14], r: [1.42, 1.3], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="THEY FIGHT UP TOP" col={AMB} />}>{(tt) => {
  const hit = 1.7, mv = eio(tt, 0.4, hit), boom = cl((tt - hit) / 1.0);
  return <>
    {/* la pileta de acero arriba */}
    <mesh position={[0, 0.56, 0]}><cylinderGeometry args={[0.24, 0.05, 0.12, 56, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.62, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.24, 0.008, 10, 64]} />{M.chrome()}</mesh>
    {/* el caño de vidrio y la U con el agua y el tapón quieto */}
    <mesh geometry={tubeG("uglass", UP, 0.036, 120, 28)}>{M.glass({ op: 0.22 })}</mesh>
    <mesh geometry={tubeG("uwater", UP.slice(2, 8), 0.031, 80, 20)}>{M.water({ op: 0.5 })}</mesh>
    <mesh position={[0.1, 0.056, 0]} scale={[1.6, 0.98, 1]}><sphereGeometry args={[0.031, 28, 20]} />{M.plastic({ col: RED, em: "#ff2a1a", emI: 0.7 })}</mesh>
    <Hair id="udh" n={14} spread={0.01} r={0.0016} pts={[[0.06, 0.06, 0], [0.09, 0.07, 0.01], [0.12, 0.055, -0.01], [0.15, 0.065, 0]]} />
    {/* las dos esferas: base blanca desde la izquierda, ácido ámbar desde la derecha */}
    {boom < 0.15 && [-1, 1].map((s) => <mesh key={s} position={[s * lerp(0.2, 0.035, mv), 0.6 + 0.04 * Math.sin(PI * mv), 0]} castShadow><sphereGeometry args={[0.062, 32, 20]} />{s < 0 ? M.porcelain() : M.plastic({ col: "#f2a21e", em: "#6a3a00", emI: 0.5 })}</mesh>)}
    {/* chispas que salen radiales del choque */}
    {boom > 0 && boom < 1 && Array.from({ length: 34 }, (_, i) => { const a = rn(i, 2) * 2 * PI, e = (rn(i, 3) - 0.3) * 1.4, d = 0.05 + 0.3 * boom * (0.6 + 0.4 * rn(i, 4)); return <mesh key={i} position={[Math.cos(a) * Math.cos(e) * d, 0.6 + Math.sin(e) * d - 0.2 * boom * boom, Math.sin(a) * Math.cos(e) * d]}><sphereGeometry args={[0.008 * (1 - boom) + 0.003, 8, 6]} />{M.glow({ col: i % 3 ? "#ffd27a" : "#ffffff" })}</mesh>; })}
    <pointLight position={[0, 0.66, 0.05]} intensity={0.4 * cl(1 - boom) * (tt > hit ? 1 : 0)} distance={0.8} color="#ffcf7a" />
    <pointLight position={[0.1, 0.14, 0.16]} intensity={0.3} distance={0.35} color="#ffb0a0" />
    {/* la espuma que sube y se queda arriba */}
    {Array.from({ length: 26 }, (_, i) => { const a = hit + 0.1 + i * 0.09, k = cl((tt - a) / 1.4); if (k <= 0) return null; const r = 0.015 + 0.02 * rn(i, 5); return <mesh key={i} position={[(rn(i, 6) - 0.5) * 0.3, 0.6 + 0.1 * k * (0.5 + rn(i, 7)), (rn(i, 8) - 0.5) * 0.25]} scale={cl(k * 3)}><sphereGeometry args={[r, 16, 12]} /><meshPhysicalMaterial color="#fffaf0" roughness={0.2} clearcoat={1} transparent opacity={0.9 * (1 - k * 0.35)} /></mesh>; })}
  </>;
}}</Scene3D>;
