// ohf8pd · componentes únicos 7-17: el círculo, el diente, la luz rasante, la huella de grasa, la harina, la escoba al revés, 1+9, la cinta azul, cinco paradas, la espuma, la mordida
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Tape } from "./okit";
import { CopperWad, Mouse, PI, stoneTex, sv } from "./rkit";

const paper = (a: string) => <meshStandardMaterial color={a} roughness={0.9} />;

// ---- EL CÍRCULO: planta de la casa vista desde arriba; el ratón gira siempre por la misma vuelta y va gastando el anillo ----
export const HHomeRange: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[0.5, 3, 0.8]}
  cam={{ at: [0, 0.05, 0.06], az: [-0.35, 0.3], el: [1.2, 1.05], r: [2.3, 2.05], fov: 32 }}>{(tt) => {
  const ring = eio(tt, 0.3, 3.2), a = tt * 1.45, R = 0.56, x = Math.cos(a) * R, z = Math.sin(a) * R, ry = Math.atan2(-Math.cos(a), -Math.sin(a));
  return <>
    <RBox s={[2.5, 0.14, 0.05]} p={[0, 0.11, -0.9]} r={0.008}>{paper("#d7ccb4")}</RBox>
    <RBox s={[0.05, 0.14, 1.85]} p={[-1.25, 0.11, 0]} r={0.008}>{paper("#d7ccb4")}</RBox>
    <RBox s={[0.05, 0.14, 1.85]} p={[1.25, 0.11, 0]} r={0.008}>{paper("#d7ccb4")}</RBox>
    <RBox s={[0.55, 0.34, 0.5]} p={[-0.95, 0.21, -0.6]} r={0.03}><meshStandardMaterial color="#3a3a3c" metalness={0.6} roughness={0.4} /></RBox>
    <RBox s={[0.42, 0.28, 0.9]} p={[1.0, 0.18, 0.25]} r={0.05}><meshStandardMaterial color="#7d5a42" roughness={0.85} /></RBox>
    <mesh rotation={[-PI / 2, 0, PI / 2]} position={[0, 0.05, 0]}><torusGeometry args={[R, 0.022, 10, 120, Math.max(0.01, ring * PI * 2)]} /><meshStandardMaterial color="#efe7d2" roughness={1} /></mesh>
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.14, 0.06 + rn(i, 4) * 0.04, (rn(i, 5) - 0.5) * 0.14]} scale={[1, 0.5, 0.6]}><sphereGeometry args={[0.05, 10, 8]} />{paper(i % 2 ? "#a58f6f" : "#c7b797")}</mesh>)}
    <Mouse p={[x, 0.05, z]} ry={ry} run={tt} s={1.8} />
    <Tape txt="10 TO 20 FEET" p={[0, 0.24, 0.08]} rot={[-1.1, 0, 0]} w={0.72} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.9)} />
  </>;
}}</Scene3D>;

// ---- EL DIENTE QUE NO PARA: el incisivo crece en arco contra la regla; llega la madera y lo gasta entre virutas ----
export const HTeeth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-0.8, 1.8, 2]}
  cam={{ at: [0.1, 0.5, 0], az: [-0.2, 0.1], el: [0.08, 0.04], r: [1.9, 1.72], fov: 32 }}>{(tt) => {
  const grow = eio(tt, 0.3, 3.4), grind = eio(tt, 4.1, 5.8), arc = lerp(0.35, 2.05, grow) - 1.5 * grind, wood = phys(tt, 3.6, 7, 0.4), rt = -0.05 + 0.03 * Math.sin(tt * 26) * (tt > 4.1 && tt < 5.8 ? 1 : 0);
  return <>
    <group position={[-0.3, 0.68, 0]} rotation={[0, 0, rt]}>
      <mesh scale={[1.8, 1, 1]} castShadow><sphereGeometry args={[0.22, 40, 28]} /><meshStandardMaterial color="#6d6052" roughness={0.92} /></mesh>
      <mesh position={[0.36, -0.06, 0]} scale={[1, 0.72, 0.8]} castShadow><sphereGeometry args={[0.13, 30, 22]} /><meshStandardMaterial color="#7a6c5d" roughness={0.9} /></mesh>
      <mesh position={[0.48, -0.03, 0]}><sphereGeometry args={[0.032, 16, 12]} /><meshStandardMaterial color="#cf8a86" roughness={0.5} /></mesh>
      <mesh position={[0.15, 0.09, 0.19]}><sphereGeometry args={[0.032, 20, 14]} /><meshPhysicalMaterial color="#120d0a" roughness={0.1} clearcoat={1} /></mesh>
      <mesh position={[-0.05, 0.2, 0.12]} rotation={[-0.3, 0.3, 0]} scale={[1, 1.1, 0.25]}><sphereGeometry args={[0.11, 22, 16]} /><meshStandardMaterial color="#b78f83" roughness={0.8} /></mesh>
      <group position={[0.36, -0.14, 0.0]} rotation={[0, 0, -0.1]}>
        <mesh position={[0, -0.3, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.3, 0.031, 14, 80, Math.max(0.05, arc)]} /><meshPhysicalMaterial color="#e39a2f" roughness={0.32} clearcoat={0.6} /></mesh>
      </group>
    </group>
    <RBox s={[0.1, 0.9, 0.012]} p={[0.72, 0.42, -0.02]} r={0.003}><meshStandardMaterial map={tex.text("rul", 64, 512, (g) => { g.fillStyle = "#e8c23a"; g.fillRect(0, 0, 64, 512); g.fillStyle = "#1a1a1a"; for (let i = 0; i < 26; i++) g.fillRect(0, i * 20, i % 4 ? 18 : 34, 3); })} roughness={0.5} /></RBox>
    <group position={[lerp(1.3, 0.34, wood), 0.09, 0]}>
      <RBox s={[0.6, 0.2, 0.34]} r={0.012}>{M.wood({ rx: 3, ry: 1, base: [168, 124, 76] })}</RBox>
    </group>
    {Array.from({ length: 26 }, (_, i) => { const a = 4.1 + rn(i, 1) * 1.7, u = cl((tt - a) / 0.9); if (u <= 0 || u >= 1) return null; return <mesh key={i} position={[0.1 + rn(i, 2) * 0.3 + u * (rn(i, 3) - 0.5) * 0.7, 0.26 + u * 0.3 - u * u * 0.62, (rn(i, 4) - 0.5) * 0.4]} rotation={[u * 9, i, u * 5]}><boxGeometry args={[0.03, 0.006, 0.012]} />{paper("#d7ae76")}</mesh>; })}
    <Tape txt="5 INCHES A YEAR" p={[0.3, 0.86, 0.12]} w={0.66} k={phys(tt, 1.7, 8, 0.45)} rev={cl((tt - 1.7) / 0.9)} />
  </>;
}}</Scene3D>;

// ---- LA LUZ RASANTE: la linterna baja hasta el piso y cada grano escondido tira una sombra larga ----
export const HLowLight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none" key1={[0.2, 2.6, 1]}
  cam={{ at: [-0.12, 0.16, 0], az: [-0.24, 0.1], el: [0.42, 0.3], r: [2.3, 2.1], fov: 32 }}>{(tt) => {
  const low = eio(tt, 0.7, 3.2), ly = lerp(1.05, 0.09, low), rz = lerp(-1.1, 0, low), len = lerp(0.03, 0.62, low), pool = lerp(0.3, 1, low);
  const G: [number, number, number][] = Array.from({ length: 22 }, (_, i) => [-0.45 + rn(i, 7) * 1.3, 0.05, (rn(i, 8) - 0.5) * 0.85]);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0.1, 0.031, 0]}><planeGeometry args={[2.9, 1.9]} /><meshBasicMaterial map={tex.text("pool", 256, 256, (g) => { const a = g.createRadialGradient(128, 128, 4, 128, 128, 127); a.addColorStop(0, "rgba(255,230,180,1)"); a.addColorStop(0.55, "rgba(255,226,170,.42)"); a.addColorStop(1, "rgba(255,220,160,0)"); g.fillStyle = a; g.fillRect(0, 0, 256, 256); })} transparent opacity={0.16 + 0.34 * pool} depthWrite={false} /></mesh>
    {G.map(([x, y, z], i) => <group key={i}>
      <mesh position={[x, y - 0.012, z]} scale={[1.8, 0.8, 0.8]} castShadow rotation={[0, i, 0]}><sphereGeometry args={[0.012, 12, 8]} />{paper("#17120e")}</mesh>
      <mesh rotation={[-PI / 2, 0, 0]} position={[x + len / 2, 0.033, z]}><planeGeometry args={[Math.max(0.001, len), 0.03]} /><meshBasicMaterial map={tex.text("shd", 128, 16, (g) => { const a = g.createLinearGradient(0, 0, 128, 0); a.addColorStop(0, "rgba(0,0,0,.95)"); a.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = a; g.fillRect(0, 0, 128, 16); })} transparent opacity={0.2 + 0.8 * low} depthWrite={false} /></mesh>
    </group>)}
    <group position={[-0.95, ly, 0]} rotation={[0, 0, rz]}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.038, 0.038, 0.42, 22]} />{M.matte({ col: "#b3261e" })}</mesh>
      <mesh position={[0.25, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.07, 0.042, 0.12, 22]} />{M.chrome()}</mesh>
      <mesh position={[0.312, 0, 0]} rotation={[0, PI / 2, 0]}><circleGeometry args={[0.064, 24]} /><meshBasicMaterial color="#fff4cc" /></mesh>
    </group>
    <Tape txt="FLASHLIGHT DOWN LOW" p={[0.3, 0.5, -0.1]} w={0.8} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.9)} />
  </>;
}}</Scene3D>;

// ---- LA RUTA DE GRASA: la mancha aparece a lo largo de la viga y lleva al agujero ----
export const HGreaseRoad: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-0.4, 2, 1.6]}
  cam={{ at: [-0.5, 0.5, 0], at1: [0.95, 0.5, 0], az: [-0.3, 0.18], el: [0.1, 0.07], r: [1.75, 1.55], fov: 32 }}>{(tt) => { const k = eio(tt, 0.4, 3.6), W = 2.3, mx = lerp(-1.25, 0.82, eio(tt, 0.8, 4.0));
  return <>
    <RBox s={[3.2, 0.32, 0.2]} p={[0, 0.34, -0.05]} r={0.012}>{M.wood({ rx: 6, ry: 1, base: [146, 104, 62] })}</RBox>
    <RBox s={[3.2, 0.6, 0.05]} p={[0, 0.78, -0.2]} r={0.01}>{M.wood({ rx: 6, ry: 2, base: [92, 62, 36] })}</RBox>
    <mesh position={[-1.15 + W * k / 2, 0.45, 0.052]}><planeGeometry args={[Math.max(0.001, W * k), 0.075]} /><meshBasicMaterial map={tex.text("grs", 512, 32, (g) => { const a = g.createLinearGradient(0, 0, 0, 32); a.addColorStop(0, "rgba(14,10,6,0)"); a.addColorStop(0.5, "rgba(14,10,6,.86)"); a.addColorStop(1, "rgba(14,10,6,0)"); g.fillStyle = a; g.fillRect(0, 0, 512, 32); })} transparent depthWrite={false} /></mesh>
    <Mouse p={[mx, 0.5, 0.075]} run={tt < 4 ? tt : 0} s={1.4} />
    <mesh position={[1.24, 0.42, 0.056]}><circleGeometry args={[0.1, 30]} /><meshStandardMaterial color="#070503" /></mesh>
    <mesh position={[1.24, 0.42, 0.054]}><ringGeometry args={[0.1, 0.14, 30]} /><meshStandardMaterial color="#17110b" transparent opacity={0.6} /></mesh>
    <Tape txt="THE ROAD" p={[0.0, 0.28, 0.18]} w={0.36} k={phys(tt, 1.1, 8, 0.45)} rev={cl((tt - 1.1) / 0.7)} />
    <Tape txt="THE HOLE" col="#b3261e" p={[1.2, 0.68, 0.1]} w={0.36} k={phys(tt, 4.3, 8, 0.45)} rev={cl((tt - 4.3) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- EL MAPA DE HARINA: el cedazo cubre el plato, de noche pasan las patitas, y caen dos centavos ----
const Print: React.FC<{ x: number; z: number; a: number; k: number }> = ({ x, z, a, k }) => <group position={[x, 0.041, z]} rotation={[-PI / 2, 0, a]} scale={[sv(k), sv(k), 1]}>
  <mesh scale={[0.9, 1.1, 1]}><circleGeometry args={[0.021, 14]} /><meshBasicMaterial color="#4a3f33" /></mesh>
  {[-1.5, -0.5, 0.5, 1.5].map((m, i) => <mesh key={i} position={[m * 0.019, 0.032 - Math.abs(m) * 0.006, 0]}><circleGeometry args={[0.0085, 10]} /><meshBasicMaterial color="#4a3f33" /></mesh>)}
</group>;
export const HFlourMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[-0.3, 2.6, 1.2]}
  cam={{ at: [0, 0.1, 0.02], az: [-0.25, 0.14], el: [0.95, 0.8], r: [1.75, 1.52], fov: 32 }}>{(tt) => { const fl = eio(tt, 0.4, 2.0), sift = 1 - eio(tt, 2.1, 2.6), shake = 0.018 * Math.sin(tt * 34) * sift;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.04, 0]} scale={[sv(fl), sv(fl), 1]}><circleGeometry args={[0.56, 72]} /><meshStandardMaterial map={tex.text("flo", 512, 512, (g) => { g.fillStyle = "#f6f1e7"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 2400; i++) { g.fillStyle = `rgba(190,180,160,${0.06 + rn(i, 2) * 0.14})`; g.beginPath(); g.arc(rn(i, 3) * 512, rn(i, 4) * 512, 1 + rn(i, 5) * 3, 0, 7); g.fill(); } })} roughness={1} /></mesh>
    <group position={[shake, lerp(1.4, 0.62, eio(tt, 0, 0.3)) + 0.9 * eio(tt, 2.1, 2.7), 0]}>
      <mesh rotation={[0, 0, 0]} castShadow><cylinderGeometry args={[0.2, 0.17, 0.12, 40, 1, true]} />{M.steel({ col: "#c8ccd0" })}</mesh>
      <mesh position={[0, -0.04, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.17, 36]} /><meshStandardMaterial color="#8f9498" roughness={0.5} /></mesh>
    </group>
    {tt < 2.2 && Array.from({ length: 70 }, (_, i) => { const u = (tt * 1.8 + rn(i, 1)) % 1, a = rn(i, 2) * PI * 2, R = rn(i, 3) * 0.17 + u * 0.3; return <mesh key={i} position={[Math.cos(a) * R, 0.56 - u * 0.52, Math.sin(a) * R]}><sphereGeometry args={[0.005, 6, 4]} /><meshBasicMaterial color="#fbf7ef" /></mesh>; })}
    {Array.from({ length: 12 }, (_, i) => { const u = i / 11, s = i % 2 ? 0.05 : -0.05; return <Print key={i} x={-0.48 + u * 0.96} z={(0.2 - u * 0.4) + s} a={-1.57 + 0.39} k={phys(tt, 2.8 + i * 0.13, 11, 0.5)} />; })}
    {[0, 1].map((i) => { const k = phys(tt, 4.7 + i * 0.3, 7, 0.34); return <mesh key={i} position={[0.56 + i * 0.09, lerp(0.8, 0.05 + i * 0.012, k), 0.44 - i * 0.05]} rotation={[0.03, i, 0.04]} castShadow><cylinderGeometry args={[0.058, 0.058, 0.012, 34]} /><meshStandardMaterial color="#b56b3a" metalness={0.85} roughness={0.32} /></mesh>; })}
    <Tape txt="WHICH WAY THEY WENT" p={[-0.12, 0.28, 0.42]} rot={[-0.8, 0, 0]} w={0.8} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.9)} />
  </>;
}}</Scene3D>;

// ---- LA ESCOBA AL REVÉS: barre, sube la nube… y todo vuelve para atrás: NO ----
export const HDustBroom: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" key1={[-0.7, 2.2, 1.5]}
  cam={{ at: [0, 0.42, 0.04], az: [-0.26, 0.1], el: [0.26, 0.18], r: [1.7, 1.5], fov: 32 }}>{(tt) => { const f = eio(tt, 0.3, 1.6) * (1 - eio(tt, 3.3, 4.9)), bx = lerp(0.62, -0.22, f);
  return <>
    {Array.from({ length: 34 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.46 - 0.2, 0.045, (rn(i, 3) - 0.5) * 0.32]} scale={[1.8, 0.8, 0.8]} rotation={[0, i, 0]} castShadow><sphereGeometry args={[0.014, 10, 8]} />{paper("#17120e")}</mesh>)}
    <group position={[bx, 0, 0.02]} rotation={[0, 0, -0.42]}>
      <mesh position={[0.12, 0.72, 0]} castShadow><cylinderGeometry args={[0.016, 0.016, 1.3, 14]} />{M.wood({ rx: 1, ry: 5, base: [172, 130, 82] })}</mesh>
      {Array.from({ length: 34 }, (_, i) => { const x = (i / 33 - 0.5) * 0.3; return <mesh key={i} position={[x, 0.14, (rn(i, 3) - 0.5) * 0.05]} rotation={[0, 0, x * 0.5]} castShadow><cylinderGeometry args={[0.005, 0.009, 0.24, 6]} />{paper("#c9a65c")}</mesh>; })}
      <RBox s={[0.34, 0.07, 0.07]} p={[0, 0.28, 0]} r={0.012}><meshStandardMaterial color="#a82420" roughness={0.6} /></RBox>
    </group>
    {Array.from({ length: 70 }, (_, i) => { const u = f * (0.5 + 0.5 * rn(i, 6)), x = -0.28 + (rn(i, 7) - 0.5) * 0.9 * u, y = 0.06 + u * (0.3 + rn(i, 8) * 0.75); return <mesh key={i} position={[x, y, (rn(i, 9) - 0.5) * 0.6 * u]} scale={[sv(u), sv(u), sv(u)]}><sphereGeometry args={[0.04 + rn(i, 10) * 0.06, 12, 8]} /><meshStandardMaterial color="#a89a84" roughness={1} transparent opacity={0.13 * f} depthWrite={false} /></mesh>; })}
    <Tape txt="DO NOT SWEEP" col="#b3261e" p={[0.1, 0.74, 0.1]} w={0.72} k={phys(tt, 3.0, 8, 0.45)} rev={cl((tt - 3.0) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- UNO MÁS NUEVE: frasco con diez rayas; cae una de lavandina y nueve de agua ----
export const HOneNine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="none" key1={[-0.7, 2, 1.8]}
  cam={{ at: [0, 0.54, 0], az: [-0.24, 0.14], el: [0.08, 0.04], r: [2.05, 1.9], fov: 32 }}>{(tt) => { const H0 = 0.1, S = 0.09, one = eio(tt, 0.5, 1.3), nine = eio(tt, 1.8, 4.6), lv = S * one + 9 * S * nine;
  const pouring = (tt > 0.5 && tt < 1.3) || (tt > 1.8 && tt < 4.6), pp = tt < 1.6 ? "#f0df7d" : "#8fc6e8";
  return <>
    <mesh position={[0, H0 + lv / 2, 0]} scale={[1, Math.max(0.001, lv), 1]}><cylinderGeometry args={[0.2, 0.2, 1, 48]} /><meshPhysicalMaterial color={nine > 0.02 ? "#a9d4ea" : "#f0df7d"} transparent opacity={0.72} roughness={0.08} clearcoat={1} /></mesh>
    {one > 0 && <mesh position={[0, H0 + S * one / 2, 0]} scale={[1.005, Math.max(0.001, S * one), 1.005]}><cylinderGeometry args={[0.2, 0.2, 1, 48]} /><meshPhysicalMaterial color="#e8cf52" transparent opacity={0.92} roughness={0.1} /></mesh>}
    <mesh position={[0, 0.56, 0]}><cylinderGeometry args={[0.215, 0.215, 1.02, 56, 1, true]} /><meshPhysicalMaterial color="#e9f4f7" transparent opacity={0.2} roughness={0.04} clearcoat={1} side={2} depthWrite={false} /></mesh>
    {Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[0, H0 + i * S, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.216, 0.0035, 6, 70]} /><meshStandardMaterial color={i === 1 ? "#b3261e" : "#2a2f33"} /></mesh>)}
    {pouring && <mesh position={[0, 0.82 + H0 * 0 + lv * 0.0 - 0.0, 0]} scale={[1, 1, 1]}><cylinderGeometry args={[0.014, 0.018, 0.82, 12]} /><meshPhysicalMaterial color={pp} transparent opacity={0.75} roughness={0.05} /></mesh>}
    <Tape txt="1 BLEACH" col="#b3261e" p={[-0.5, H0 + S * 0.9, 0.05]} w={0.34} k={phys(tt, 1.0, 9, 0.45)} rev={cl((tt - 1.0) / 0.5)} />
    <Tape txt="9 WATER" p={[0.5, 0.62, 0.05]} w={0.34} k={phys(tt, 4.2, 9, 0.45)} rev={cl((tt - 4.2) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- LA CINTA AZUL: la pared se va llenando de tiritas y el rollo cuenta ----
const BLUE = Array.from({ length: 40 }, (_, i) => ({ x: (rn(i, 21) - 0.5) * 2.6, y: 0.1 + Math.pow(rn(i, 22), 1.4) * 1.1, r: (rn(i, 23) - 0.5) * 0.7 }));
export const HTapeCount: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-0.5, 2.2, 2.4]}
  cam={{ at: [0, 0.65, 0], az: [-0.22, 0.2], el: [0.05, 0.03], r: [2.55, 2.2], fov: 32 }}>{(tt) => { const n = Math.round(40 * Math.pow(eio(tt, 0.4, 4.9), 0.86));
  return <>
    <RBox s={[3.8, 1.3, 0.08]} p={[0, 0.82, -0.05]} r={0.004}><meshStandardMaterial map={tex.text("sid", 512, 512, (g) => { g.fillStyle = "#d8d1bf"; g.fillRect(0, 0, 512, 512); g.fillStyle = "#918a78"; for (let i = 0; i < 16; i++) g.fillRect(0, i * 32 + 28, 512, 3); })} roughness={0.85} /></RBox>
    <RBox s={[3.8, 0.42, 0.26]} p={[0, -0.02, 0]} r={0.01}><meshStandardMaterial map={stoneTex("sf", 5, 1)} roughness={0.95} /></RBox>
    {BLUE.map((b, i) => { const k = phys(tt, 0.4 + i * 0.112, 11, 0.46); return <RBox key={i} s={[0.13, 0.045, 0.006]} p={[b.x, b.y + 0.05, 0.0 + (i % 3) * 0.001 + 0.002]} rot={[0, 0, b.r]} r={0.001}><meshStandardMaterial color="#2f78c8" roughness={0.7} transparent opacity={k > 0.05 ? 1 : 0} /></RBox>; })}
    <Tape txt={String(n)} p={[0.0, 1.15, 0.14]} w={0.34} k={phys(tt, 0.3, 8, 0.45)} />
  </>;
}}</Scene3D>;

// ---- CINCO PARADAS: la escalera contra la casa; la linterna sube peldaño por peldaño y clava una banderita ----
const STOPY = [0.2, 0.74, 1.3, 1.86, 2.42];
export const HFiveStops: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-0.4, 3.2, 2.2]}
  cam={{ at: [0, 0.55, 0], at1: [0, 2.5, 0], az: [-0.36, 0.22], el: [0.02, -0.02], r: [2.4, 2.15], fov: 32 }}>{(tt) => { const stg = cl(tt / 5.2) * 4, i0 = Math.floor(stg), yy = lerp(STOPY[Math.min(4, i0)], STOPY[Math.min(4, i0 + 1)], eio(stg - i0, 0.5, 1));
  return <>
    <RBox s={[3, 3.2, 0.08]} p={[0, 1.6, -0.1]} r={0.004}><meshStandardMaterial map={tex.text("sid2", 512, 512, (g) => { g.fillStyle = "#c9c1ab"; g.fillRect(0, 0, 512, 512); g.fillStyle = "#857e6c"; for (let i = 0; i < 22; i++) g.fillRect(0, i * 23 + 20, 512, 3); })} roughness={0.85} /></RBox>
    <RBox s={[3, 0.5, 0.3]} p={[0, 0.1, 0]} r={0.01}><meshStandardMaterial map={stoneTex("fs", 4, 1)} roughness={0.95} /></RBox>
    {[-0.22, 0.22].map((x) => <RBox key={x} s={[0.05, 3.2, 0.03]} p={[x, 1.6, 0.25]} r={0.006}><meshStandardMaterial color="#c0c4c6" metalness={0.8} roughness={0.35} /></RBox>)}
    {STOPY.map((y, i) => <RBox key={i} s={[0.46, 0.03, 0.03]} p={[0, y, 0.25]} r={0.006}><meshStandardMaterial color="#d0d3d4" metalness={0.75} roughness={0.35} /></RBox>)}
    {STOPY.map((y, i) => <group key={i} position={[0.62, y + 0.08, 0.02]}><Tape txt={(i + 1) + " " + ["FOUNDATION", "PIPES", "GARAGE DOOR", "COAL DOOR", "ROOF LINE"][i]} col="#2f78c8" p={[0, 0, 0]} w={0.5} k={phys(tt, 0.4 + i * 1.25, 9, 0.45)} /></group>)}
    <group position={[-0.12, yy + 0.06, 0.42]} rotation={[0, 0.55, 0]}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.34, 20]} />{M.matte({ col: "#b3261e" })}</mesh>
      <mesh position={[0.2, 0, 0]} rotation={[0, PI / 2, 0]}><circleGeometry args={[0.06, 22]} /><meshBasicMaterial color="#fff4cc" /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- ES UNA GOLOSINA: el bollo de espuma tapa el hueco; bocado a bocado se abre un túnel y sale el ratón ----
const LUMPS = Array.from({ length: 150 }, (_, i) => ({ x: (rn(i, 31) - 0.5) * 0.9, y: 0.5 + (rn(i, 32) - 0.5) * 0.52, z: rn(i, 33) * 0.1, r: 0.04 + rn(i, 34) * 0.045 }));
export const HFoamSnack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-0.7, 1.9, 2]}
  cam={{ at: [0, 0.48, 0], az: [0.3, 0.08], el: [0.14, 0.09], r: [1.45, 1.25], fov: 32 }}>{(tt) => { const front = lerp(0.48, -0.5, eio(tt, 1.0, 5.2)), mx = front + 0.04;
  return <>
    <RBox s={[2.2, 1.3, 0.08]} p={[0, 0.5, -0.12]} r={0.004}><meshStandardMaterial map={stoneTex("fo", 3, 2)} roughness={0.95} /></RBox>
    <mesh position={[0, 0.5, -0.075]} scale={[1.45, 0.82, 1]}><circleGeometry args={[0.3, 40]} /><meshStandardMaterial color="#090705" /></mesh>
    {LUMPS.map((l, i) => { const eaten = Math.abs(l.y - 0.5) < 0.1 && l.x > front - l.r * 0.4; if (eaten) return null; return <mesh key={i} position={[l.x, l.y, l.z - 0.02]} castShadow><sphereGeometry args={[l.r, 12, 9]} /><meshStandardMaterial color={i % 3 ? "#e2c267" : "#ecd388"} roughness={0.92} /></mesh>; })}
    <Mouse p={[mx, 0.47, 0.12]} ry={PI} run={tt} s={1.6} />
    {Array.from({ length: 22 }, (_, i) => { const a = 1.2 + rn(i, 5) * 3.8, u = cl((tt - a) / 1.0); if (u <= 0 || u >= 1) return null; const x0 = lerp(0.48, -0.5, eio(a, 1.0, 5.2)); return <mesh key={i} position={[x0 + (rn(i, 6) - 0.5) * 0.3 * u, 0.5 + u * 0.08 - u * u * 0.7, 0.16 + u * 0.12]}><sphereGeometry args={[0.014 + rn(i, 7) * 0.012, 8, 6]} /><meshStandardMaterial color="#e8cd7b" roughness={0.9} /></mesh>; })}
    <Tape txt="IT'S A SNACK" p={[0.05, 0.76, 0.2]} w={0.56} k={phys(tt, 2.0, 8, 0.45)} rev={cl((tt - 2.0) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- LA MORDIDA QUE NO ENTRA: el incisivo cierra sobre el cobre, los hilos se doblan, el ratón retrocede ----
export const HBiteTest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-0.6, 1.9, 2]}
  cam={{ at: [-0.12, 0.5, 0], az: [-0.2, 0.14], el: [0.08, 0.05], r: [1.6, 1.42], fov: 32 }}>{(tt) => { const bite = (a: number) => eio(tt, a, a + 0.22) * (1 - eio(tt, a + 0.35, a + 0.75)); const b = Math.max(bite(1.0), bite(2.5), bite(4.0)); const back = eio(tt, 4.7, 5.6);
  return <>
    <CopperWad id="bt" p={[0.32, 0.5, 0]} w={0.42} h={lerp(0.42, 0.26, b)} d={0.36} n={70} k={1} />
    <group position={[lerp(-0.46, -0.18, b) - back * 0.42, 0.5, 0]}>
      <mesh scale={[1.7, 0.95, 0.95]} position={[-0.32, 0, 0]} castShadow><sphereGeometry args={[0.24, 36, 26]} /><meshStandardMaterial color="#6d6052" roughness={0.92} /></mesh>
      <mesh position={[0, 0.19 - b * 0.03, 0]} rotation={[0, 0, -0.08]} castShadow><boxGeometry args={[0.3, 0.05, 0.1]} /><meshPhysicalMaterial color="#e39a2f" roughness={0.3} clearcoat={0.6} /></mesh>
      <mesh position={[0, -0.19 + b * 0.03, 0]} rotation={[0, 0, 0.08]} castShadow><boxGeometry args={[0.36, 0.05, 0.1]} /><meshPhysicalMaterial color="#e39a2f" roughness={0.3} clearcoat={0.6} /></mesh>
      <mesh position={[-0.34, 0.11, 0.222]}><sphereGeometry args={[0.03, 18, 12]} /><meshPhysicalMaterial color="#120d0a" roughness={0.1} clearcoat={1} /></mesh>
      <mesh position={[0.075, 0.07, 0]}><sphereGeometry args={[0.03, 16, 12]} /><meshStandardMaterial color="#cf8a86" roughness={0.5} /></mesh>
      <mesh position={[-0.52, 0.2, 0.13]} rotation={[-0.3, 0.3, 0]} scale={[1, 1.1, 0.25]}><sphereGeometry args={[0.11, 22, 16]} /><meshStandardMaterial color="#b78f83" roughness={0.8} /></mesh>
    </group>
    {b > 0.6 && Array.from({ length: 10 }, (_, i) => <mesh key={i} geometry={tubeG("sp" + i, [[0.1, 0.5 + (rn(i, 1) - 0.5) * 0.2, (rn(i, 2) - 0.5) * 0.25], [-0.02 - rn(i, 3) * 0.05, 0.5 + (rn(i, 4) - 0.5) * 0.3, (rn(i, 5) - 0.5) * 0.3]], 0.004, 8, 5)}><meshStandardMaterial color="#d08a4a" metalness={0.9} roughness={0.3} /></mesh>)}
    <Tape txt="THE STRANDS BEND" p={[0.0, 0.84, 0.14]} w={0.62} k={phys(tt, 2.2, 8, 0.45)} rev={cl((tt - 2.2) / 0.8)} />
  </>;
}}</Scene3D>;
