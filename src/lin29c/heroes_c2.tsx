// lin29c · componentes 12-22 (aeropuertos)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, eio, lerp, phys, rn, cl, tex, tubeG } from "./h3d";
import { Bill, Coin, KeyCard, PI, PriceTag, Sheet, fallY, pop, txt } from "./lkit3d";
import { Phone, Plane, Suitcase } from "./lkit_b";
import { Car } from "./heroes_c1";

// ---- 8:02 · .GOV CONTRA EL INTERMEDIARIO: dos pantallas; la .COM cobra de más y se tacha, la .GOV queda con $78 ----
export const HFakeSite: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0, 0.13, 0], az: [-0.12, 0.12], el: [0.14, 0.12], r: [0.82, 0.74], fov: 30 }}>{(tt) => {
  const x = eio(tt, 2.0, 2.6), win = eio(tt, 2.8, 3.4);
  const Screen: React.FC<{ px: number; id: string; lines: string[]; bg: string; fg: string; d: number }> = ({ px, id, lines, bg, fg, d }) => <group position={[px, 0, 0]} scale={pop(tt, d)}>
    <RBox s={[0.26, 0.17, 0.012]} p={[0, 0.16, 0]} r={0.008}>{M.plastic({ col: "#1b1d22" })}</RBox>
    <Sheet map={txt(id, lines, { w: 360, h: 230, bg, fg, size: 48, lh: 72 })} w={0.24} h={0.15} p={[0, 0.16, 0.007]} />
    <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.008, 0.008, 0.07, 12]} />{M.steel()}</mesh>
    <RBox s={[0.1, 0.008, 0.06]} p={[0, 0.014, 0]} r={0.004}>{M.steel()}</RBox>
  </group>;
  return <>
    <Screen px={-0.16} id="sitecom" lines={["SUPER-FAST", "PRECHECK.COM", "$148"]} bg="#fff4e6" fg="#b8302a" d={0.1} />
    <Screen px={0.16} id="sitegov" lines={["OFFICIAL", "SITE .GOV", "$78"]} bg="#e9f2ff" fg="#1d2f5a" d={0.5} />
    {[-1, 1].map((s) => <mesh key={s} position={[-0.16, 0.16, 0.02]} rotation={[0, 0, s * 0.55]} scale={[Math.max(0.001, x), 1, 1]}><boxGeometry args={[0.3, 0.014, 0.004]} /><meshBasicMaterial color="#d9342a" toneMapped={false} /></mesh>)}
    <group position={[0.16, 0.27, 0.06]} scale={pop(tt, 2.8) * 1.2 * (1 + 0.06 * Math.sin(tt * 4) * win)}><PriceTag lines={["✓ .GOV"]} col="#e6f2e6" fg="#2f5d4a" /></group>
  </>;
}}</Scene3D>;

// ---- 8:49 · $39 CONTRA $12: el cargador del aeropuerto pesa en el gancho; el de casa salta a la valija ----
export const HChargerPrice: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark"
  cam={{ at: [0, 0.16, 0], az: [-0.15, 0.12], el: [0.1, 0.1], r: [0.75, 0.68], fov: 30 }}>{(tt) => {
  const sw = Math.sin(tt * 2.4) * 0.12 * (1 - eio(tt, 0.3, 3.5) * 0.7);
  const Pack: React.FC<{ col: string }> = ({ col }) => <group>
    <RBox s={[0.1, 0.15, 0.03]} r={0.008}>{M.plastic({ col, op: 0.55 })}</RBox>
    <RBox s={[0.04, 0.05, 0.02]} p={[0, 0.02, 0]} r={0.006}>{M.plastic({ col: "#f2f2ee" })}</RBox>
    <mesh position={[0, -0.03, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.022, 0.004, 8, 24]} />{M.plastic({ col: "#f2f2ee" })}</mesh>
  </group>;
  return <>
    <RBox s={[0.6, 0.02, 0.02]} p={[0, 0.32, -0.04]} r={0.004}>{M.steel()}</RBox>
    <group position={[-0.13, 0.31, -0.03]} rotation={[0, 0, sw]} scale={pop(tt, 0.1)}>
      <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.003, 0.003, 0.06, 8]} />{M.steel()}</mesh>
      <group position={[0, -0.14, 0]}><Pack col="#b8302a" /></group>
      <group position={[0, -0.24, 0.03]} scale={1.5}><PriceTag lines={["AIRPORT", "$39"]} col="#b8302a" fg="#fff4e6" /></group>
    </group>
    <group position={[0.15, 0.17 + 0.12 * Math.max(0, Math.sin(PI * eio(tt, 1.5, 2.5))), 0.0]} rotation={[0, -0.2, 0]} scale={pop(tt, 1.2)}>
      <Pack col="#2f7a4a" />
      <group position={[0, -0.12, 0.03]} scale={1.5}><PriceTag lines={["HOME", "$12"]} col="#e6f2e6" fg="#2f5d4a" /></group>
    </group>
    <group position={[0.15, 0.0, 0.05]} scale={0.9 * pop(tt, 0.6)}><Suitcase col="#1d2f5a" lid={eio(tt, 0.8, 1.4)} s={0.9} /></group>
  </>;
}}</Scene3D>;

// ---- 9:22 · EL POSTE DE CARGA GRATIS: el cable se enchufa y la batería del teléfono se llena ----
export const HChargePost: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="dark"
  cam={{ at: [0, 0.16, 0], az: [-0.3, -0.1], el: [0.12, 0.1], r: [0.72, 0.65], fov: 30 }}>{(tt) => {
  const plug = eio(tt, 0.6, 1.3), fill = eio(tt, 1.4, 4.2);
  const scr = txt("bat" + Math.round(fill * 10), ["", Math.round(8 + fill * 92) + "%"], { w: 256, h: 512, bg: "#16202c", fg: fill > 0.6 ? "#3fd27a" : "#f2d23a", size: 80, lh: 200 });
  return <>
    <group scale={pop(tt, 0.1)}>
      <mesh position={[0, 0.17, -0.02]}><cylinderGeometry args={[0.05, 0.06, 0.34, 32]} />{M.steel()}</mesh>
      <mesh position={[0, 0.345, -0.02]}><cylinderGeometry args={[0.07, 0.07, 0.012, 32]} />{M.plastic({ col: "#2f6f9a" })}</mesh>
      {[0.24, 0.2, 0.16].map((y, i) => <RBox key={i} s={[0.03, 0.02, 0.01]} p={[0, y, 0.035]} r={0.004}>{M.plastic({ col: "#f2f2ee" })}</RBox>)}
      <Sheet map={txt("freechg", ["FREE", "CHARGING"], { w: 256, h: 160, bg: "#2f6f9a", fg: "#fff", size: 46, lh: 64 })} w={0.08} h={0.05} p={[0, 0.3, 0.04]} />
    </group>
    <mesh geometry={tubeG("chg" + Math.round(plug * 10), [[0, 0.24, 0.04], [0.06, 0.2 + 0.03 * plug, 0.1], [0.14, 0.13, 0.1], [0.17, 0.08, 0.06]].map((p, i) => i === 0 ? [0, 0.24, 0.04 + 0.04 * (1 - plug)] : p), 0.004)}>{M.plastic({ col: "#f2f2ee" })}</mesh>
    <Phone map={scr} p={[0.2, 0.1, 0.06]} r={[-0.2, -0.4, 0]} s={0.9 * pop(tt, 0.3)} em={0.9} />
    <mesh position={[0.2, 0.1 - 0.04 + 0.08 * fill * 0.5, 0.075]} rotation={[-0.2, -0.4, 0]} scale={[1, Math.max(0.001, fill), 1]}><planeGeometry args={[0.04, 0.08]} /><meshBasicMaterial color={fill > 0.6 ? "#3fd27a" : "#f2d23a"} transparent opacity={0.25} toneMapped={false} /></mesh>
  </>;
}}</Scene3D>;

// ---- 9:56 · EL CARGADOR VIVE EN LA CARTERA: el cable estirado se enrolla en espiral, salta y entra por la boca de la cartera ----
export const HPurseCharger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark"
  cam={{ at: [0, 0.07, 0], az: [-0.2, 0.1], el: [0.42, 0.36], r: [0.52, 0.47], fov: 30 }}>{(tt) => {
  const coil = eio(tt, 0.4, 1.9), drop = eio(tt, 2.0, 2.8), flap = eio(tt, 1.4, 1.9) * (1 - eio(tt, 3.0, 3.5));
  const N = 48, pts: number[][] = [];
  for (let i = 0; i < N; i++) { const u = i / (N - 1); const a = u * 4 * PI * coil; const r = lerp(0.0, 0.045 * (1 - 0.45 * u), coil);
    pts.push([lerp(-0.2 + u * 0.3, r * Math.cos(a), coil), 0.008 + u * 0.012 * coil, lerp(0.08, r * Math.sin(a), coil)]); }
  const bx = 0.1, land = 1 - phys(tt, 2.8, 8, 0.3);
  return <>
    <group position={[bx, 0, -0.04]} scale={pop(tt, 0.1)}>
      <RBox s={[0.2, 0.12, 0.09]} p={[0, 0.06, 0]} r={0.022}><meshStandardMaterial color="#7a3a2a" roughness={0.55} /></RBox>
      <mesh position={[0, 0.121, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.16, 0.06]} /><meshStandardMaterial color="#2a1410" roughness={0.9} /></mesh>
      <mesh position={[0, 0.12, 0]}><torusGeometry args={[0.065, 0.007, 10, 40, PI]} /><meshStandardMaterial color="#5a2a1a" roughness={0.5} /></mesh>
      <group position={[0, 0.121, -0.045]} rotation={[-1.9 * flap, 0, 0]}>
        <RBox s={[0.2, 0.008, 0.06]} p={[0, 0, 0.03]} r={0.004}><meshStandardMaterial color="#6a3020" roughness={0.55} /></RBox>
        <RBox s={[0.03, 0.006, 0.014]} p={[0, -0.002, 0.058]} r={0.003}>{M.brass()}</RBox>
      </group>
    </group>
    <group position={[lerp(-0.08, bx, drop), lerp(0, 0.1, drop) + 0.13 * Math.sin(PI * drop) + 0.015 * land * (drop > 0.99 ? 1 : 0), lerp(0.04, -0.04, drop)]} scale={1 - 0.45 * drop}>
      <group position={[0.08, 0, -0.04]}>
        <mesh geometry={tubeG("pcoil2_" + Math.round(coil * 24), pts, 0.007, 140)}>{M.plastic({ col: "#f2f2ee" })}</mesh>
        <RBox s={[0.05, 0.04, 0.04]} p={[pts[0][0], 0.022, pts[0][2]]} r={0.008}>{M.plastic({ col: "#f2f2ee" })}</RBox>
        {[-0.01, 0.01].map((z) => <mesh key={z} position={[pts[0][0] - 0.03, 0.022, pts[0][2] + z]} rotation={[0, 0, PI / 2]}><boxGeometry args={[0.002, 0.016, 0.004]} />{M.steel()}</mesh>)}
      </group>
    </group>
    <group position={[-0.17, 0.12, 0.02]} scale={pop(tt, 3.0) * 1.1}><PriceTag lines={["IN THE", "PURSE"]} col="#fbf8f0" fg="#7a3a2a" /></group>
  </>;
}}</Scene3D>;

// ---- 10:26 · LA FARMACIA DE BOLSILLO: pastillas, curitas, gotas y pañuelos saltan uno por uno al estuche y se cierra ----
export const HPharmaPouch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0, 0.06, 0], az: [-0.2, 0.15], el: [0.45, 0.4], r: [0.66, 0.6], fov: 30 }}>{(tt) => {
  const zip = eio(tt, 3.2, 4.0);
  const items = [
    { c: "#e8822a", s: [0.04, 0.05, 0.03], x: -0.22 }, { c: "#f2c8a8", s: [0.07, 0.01, 0.025], x: -0.12 },
    { c: "#4f8fd8", s: [0.02, 0.05, 0.02], x: 0.12 }, { c: "#f2f2ee", s: [0.06, 0.03, 0.04], x: 0.22 }];
  return <>
    <group scale={pop(tt, 0.1)}>
      <RBox s={[0.2, 0.05, 0.13]} p={[0, 0.025, 0]} r={0.022}><meshStandardMaterial color="#2f5d4a" roughness={0.85} /></RBox>
      <mesh position={[0, 0.052, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.16, 0.09]} /><meshStandardMaterial color="#1f3d30" roughness={0.95} /></mesh>
      <group position={[0, 0.05 + 0.002, -0.065]} rotation={[-(1 - zip) * 1.9, 0, 0]}>
        <RBox s={[0.2, 0.012, 0.13]} p={[0, 0, 0.065]} r={0.012}><meshStandardMaterial color="#2f5d4a" roughness={0.85} /></RBox>
        <mesh position={[0, 0.007, 0.065]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.02, 6]} /><meshStandardMaterial color="#f2f2ee" /></mesh>
      </group>
    </group>
    {items.map((it, i) => { const a = 0.5 + i * 0.6, k = eio(tt, a, a + 0.5); const hop = Math.sin(PI * k) * 0.14;
      return <RBox key={i} s={it.s as [number, number, number]} p={[lerp(it.x, (i - 1.5) * 0.035, k), lerp(0.03, 0.04, k) + hop, lerp(0.14, 0, k)]} r={0.008}>{M.plastic({ col: it.c })}</RBox>; })}
    <group position={[0.18, 0.16, 0.02]} scale={pop(tt, 3.6) * 1.5}><PriceTag lines={["READY", "✓"]} col="#e6f2e6" fg="#2f5d4a" /></group>
  </>;
}}</Scene3D>;

// ---- 11:04 · LAS TORRES DE PRECIO: el mismo frasco de pastillas sobre dos torres de bloques: casa $15, aeropuerto $60 ----
export const HPriceTowers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0, 0.18, 0], az: [-0.2, 0.15], el: [0.12, 0.1], r: [0.9, 0.82], fov: 30 }}>{(tt) => {
  const T = [{ x: -0.13, n: 2, col: "#3f8f5a", l: ["HOME", "$15"] }, { x: 0.13, n: 8, col: "#d9342a", l: ["AIRPORT", "$60"] }];
  return <>
    {T.map((g, j) => { let top = 0; return <group key={j}>
      {Array.from({ length: g.n }, (_, i) => { const a = 0.3 + i * 0.22 + j * 0.2, k = eio(tt, a, a + 0.3); top = Math.max(top, k > 0 ? (i + 1) * 0.04 : top);
        return <RBox key={i} s={[0.09, 0.036, 0.09]} p={[g.x + (rn(i, j) - 0.5) * 0.008, 0.02 + i * 0.04 + 0.2 * (1 - k), 0]} r={0.006}>{M.pvc({ col: i % 2 ? g.col : "#f2f2ee" })}</RBox>; })}
      <group position={[g.x, top + 0.04, 0]} scale={pop(tt, 0.2)}>
        <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.05, 20]} />{M.plastic({ col: "#e8822a", op: 0.85 })}</mesh>
        <mesh position={[0, 0.032, 0]}><cylinderGeometry args={[0.021, 0.021, 0.014, 20]} />{M.plastic({ col: "#f2f2ee" })}</mesh>
      </group>
      <group position={[g.x, -0.0, 0.08]} scale={pop(tt, 2.5 + j * 0.4) * 1.5}><PriceTag lines={g.l} col={j ? "#b8302a" : "#e6f2e6"} fg={j ? "#fff4e6" : "#2f5d4a"} /></group>
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 11:35 · LA TARIFA DINÁMICA: la aguja del medidor se va al rojo y marca 2x ----
export const HSurge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark"
  cam={{ at: [0, 0.14, 0], az: [-0.12, 0.12], el: [0.08, 0.08], r: [0.68, 0.62], fov: 30 }}>{(tt) => {
  const k = phys(tt, 0.6, 5, 0.35), ang = lerp(PI * 0.85, PI * 0.15, cl(k)) + 0.03 * Math.sin(tt * 18) * eio(tt, 2.0, 2.4);
  const segs = ["#3f8f5a", "#e8c23a", "#e8822a", "#d9342a"];
  return <>
    <group position={[0, 0.12, 0]} scale={pop(tt, 0.1)}>
      <mesh position={[0, 0, -0.015]}><cylinderGeometry args={[0.2, 0.2, 0.02, 64, 1, false, 0, PI]} />{M.steel()}</mesh>
      {segs.map((c, i) => <mesh key={i} position={[0, 0, 0.0]} rotation={[0, 0, 0]}><ringGeometry args={[0.13, 0.18, 32, 1, PI - (i + 1) * PI / 4 + 0.01, PI / 4 - 0.02]} /><meshStandardMaterial color={c} roughness={0.5} side={THREE.DoubleSide} /></mesh>)}
      <group rotation={[0, 0, ang - PI / 2]}><mesh position={[0, 0.07, 0.008]}><boxGeometry args={[0.008, 0.15, 0.004]} />{M.plastic({ col: "#141414" })}</mesh></group>
      <mesh position={[0, 0, 0.01]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.014, 0.014, 0.01, 20]} />{M.chrome()}</mesh>
      <Sheet map={txt("surge2x", ["2x"], { w: 128, h: 96, bg: "#d9342a", fg: "#fff", size: 80 })} w={0.06} h={0.045} p={[0.16, 0.12, 0.01]} s={Math.max(0.001, eio(tt, 1.8, 2.3))} />
    </group>
    <group position={[-0.19, 0.27, 0.06]} scale={pop(tt, 2.6) * 1.2}><PriceTag lines={["RAINY", "ARRIVAL"]} col="#fbf8f0" fg="#1d2f5a" /></group>
  </>;
}}</Scene3D>;

// ---- 11:53 · LA COMBI GRATIS: la combi del hotel da la vuelta sola; el taxímetro de al lado sube a $80 ----
export const HShuttleVan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#d6dde2" warm={0.85}
  cam={{ at: [0, 0.04, 0], az: [-0.25, 0.15], el: [0.55, 0.5], r: [0.95, 0.86], fov: 30 }}>{(tt) => {
  const a = eio(tt, 0.3, 4.6) * 1.4 * PI, m = Math.round(80 * eio(tt, 0.6, 3.6));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.6, 1.0]} /><meshStandardMaterial color="#5a5e66" roughness={0.95} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[-0.12, 0.001, 0]}><ringGeometry args={[0.15, 0.165, 64]} /><meshBasicMaterial color="#f2f2ee" transparent opacity={0.6} /></mesh>
    <group position={[-0.12 + 0.157 * Math.cos(a), 0, 0.157 * Math.sin(a)]} rotation={[0, -a - PI / 2, 0]} scale={pop(tt, 0.1)}>
      <RBox s={[0.2, 0.08, 0.09]} p={[0, 0.05, 0]} r={0.016}>{M.pvc({ col: "#f2f2ee" })}</RBox>
      <RBox s={[0.17, 0.03, 0.092]} p={[0.0, 0.065, 0]} r={0.006}>{M.glass({ col: "#7fa6c4", op: 0.85 })}</RBox>
      <Sheet map={txt("vfree", ["FREE"], { w: 192, h: 64, bg: "#2f7a4a", fg: "#fff", size: 50 })} w={0.07} h={0.022} p={[0, 0.03, 0.047]} />
      {[[-0.065, -0.045], [0.065, -0.045], [-0.065, 0.045], [0.065, 0.045]].map(([x, z], i) => <mesh key={i} position={[x, 0.014, z]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.015, 0.015, 0.012, 18]} />{M.rubber({ col: "#151515" })}</mesh>)}
    </group>
    <group position={[0.24, 0, 0.04]} scale={pop(tt, 0.4)}>
      <Car col="#e8c23a" s={1.1} r={[0, -0.6, 0]} />
      <group position={[0, 0.17, 0.0]} scale={1.2}>
        <RBox s={[0.13, 0.05, 0.03]} r={0.008}>{M.plastic({ col: "#141414" })}</RBox>
        <Sheet map={txt("txm$", ["$"], { w: 64, h: 64, bg: "#141414", fg: "#ff5a4a", size: 54 })} w={0.022} h={0.022} p={[-0.045, 0, 0.016]} />
        {[0, 1].map((d) => <DigitDrum key={d} v={d === 0 ? Math.floor(m / 10) : m % 10} p={[-0.012 + d * 0.035, 0, 0.016]} r={0.018} w={0.028} />)}
      </group>
    </group>
  </>;
}}</Scene3D>;

// ---- 12:28 · EL PRECIO SE DERRITE: la etiqueta de $6 se encoge al lado del café de casa en el termo ----
export const HPriceMelt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0, 0.1, 0], az: [-0.15, 0.15], el: [0.15, 0.13], r: [0.62, 0.56], fov: 30 }}>{(tt) => {
  const melt = eio(tt, 1.2, 3.6);
  return <>
    <group position={[-0.08, 0, 0]} scale={pop(tt, 0.1)}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.045, 0.035, 0.12, 32, 1, true]} /><meshStandardMaterial color="#f2f2ee" roughness={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.055, 0]}><cylinderGeometry args={[0.046, 0.04, 0.04, 32, 1, true]} /><meshStandardMaterial color="#8a5a34" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.125, 0]}><cylinderGeometry args={[0.048, 0.048, 0.012, 32]} />{M.plastic({ col: "#f2f2ee" })}</mesh>
      {Array.from({ length: 3 }, (_, i) => { const ph = (tt * 0.5 + i / 3) % 1; return <mesh key={i} position={[0.01 * Math.sin(tt * 2 + i), 0.15 + ph * 0.12, 0]} scale={(1 - ph) * 0.9}><sphereGeometry args={[0.012, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.35 * (1 - ph)} /></mesh>; })}
    </group>
    <group position={[0.12, 0.12 - 0.08 * melt, 0.03]} scale={[1.8 * (1 - 0.5 * melt), 1.8 * (1 - 0.75 * melt), 1.8] as any}>
      <PriceTag lines={["$6"]} col="#b8302a" fg="#fff4e6" />
    </group>
    <mesh position={[0.12, 0.002, 0.03]} rotation={[-PI / 2, 0, 0]} scale={[1 + melt, 0.6 + 0.4 * melt, 1]}><circleGeometry args={[0.03 * melt + 0.0001, 32]} /><meshStandardMaterial color="#b8302a" roughness={0.3} /></mesh>
    <group position={[0.12, 0.2, 0.06]} scale={pop(tt, 3.2) * 1.4}><PriceTag lines={["HOME", "25¢"]} col="#e6f2e6" fg="#2f5d4a" /></group>
  </>;
}}</Scene3D>;

// ---- 13:28 · EL WI-FI CON ANZUELO: del router falso cuelga un anzuelo que pesca la tarjeta con la contraseña ----
export const HWifiHook: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark"
  cam={{ at: [0, 0.17, 0], az: [-0.15, 0.12], el: [0.1, 0.1], r: [0.8, 0.72], fov: 30 }}>{(tt) => {
  const reel = eio(tt, 1.8, 3.4), y = lerp(0.03, 0.2, reel);
  return <>
    <group position={[0, 0.29, 0]} scale={pop(tt, 0.1)}>
      <RBox s={[0.2, 0.04, 0.1]} r={0.012}>{M.plastic({ col: "#1b1d22" })}</RBox>
      {[-0.07, 0.07].map((x) => <mesh key={x} position={[x, 0.06, -0.03]}><cylinderGeometry args={[0.005, 0.005, 0.08, 10]} />{M.plastic({ col: "#1b1d22" })}</mesh>)}
      {[0, 1, 2].map((i) => <mesh key={i} position={[-0.06 + i * 0.025, 0.0, 0.051]}><sphereGeometry args={[0.004, 8, 6]} /><meshBasicMaterial color={Math.sin(tt * 8 + i * 2) > 0 ? "#3fd27a" : "#1a3a2a"} toneMapped={false} /></mesh>)}
      <Sheet map={txt("ssidfree", ["FREE_AIRPORT_WIFI"], { w: 512, h: 64, bg: "rgba(0,0,0,0)", fg: "#ff5a4a", size: 44 })} w={0.24} h={0.03} p={[0, 0.045, 0.051]} />
      {[0.05, 0.08, 0.11].map((r, i) => <mesh key={i} position={[0, 0.12, -0.03]} rotation={[0, 0, PI / 4]}><torusGeometry args={[r, 0.004, 8, 32, PI / 2]} /><meshBasicMaterial color="#ff5a4a" transparent opacity={0.3 + 0.5 * Math.max(0, Math.sin(tt * 4 - i))} toneMapped={false} /></mesh>)}
    </group>
    <mesh position={[0, (0.27 + y) / 2, 0]}><cylinderGeometry args={[0.0012, 0.0012, 0.27 - y, 6]} /><meshBasicMaterial color="#d0d4da" /></mesh>
    <group position={[0, y, 0]}>
      <mesh rotation={[0, 0, 0]}><torusGeometry args={[0.018, 0.0025, 8, 24, PI * 1.2]} />{M.chrome()}</mesh>
      <group position={[0.0, -0.045, 0.0]} rotation={[0, 0, 0.15 * Math.sin(tt * 3)]}>
        <Sheet map={txt("pwcard", ["PASSWORD", "••••••"], { w: 256, h: 160, bg: "#fbf8f0", size: 40, lh: 64, cols: ["#1d2f5a", "#b8302a"] })} w={0.1} h={0.062} />
      </group>
    </group>
    <group position={[0.2, 0.1, 0.05]} scale={pop(tt, 3.6) * 1.5}><PriceTag lines={["ASK THE", "DESK"]} col="#e6f2e6" fg="#2f5d4a" /></group>
  </>;
}}</Scene3D>;

// ---- 13:44 · EL CANDADO DEL BANCO: el pequeño edificio del banco y un candado de bronce que se cierra delante ----
export const HBankPadlock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0, 0.14, 0], az: [-0.25, 0.1], el: [0.12, 0.1], r: [0.72, 0.65], fov: 30 }}>{(tt) => {
  const close = eio(tt, 1.6, 2.2), bump = phys(tt, 2.2, 9, 0.2);
  return <>
    <group position={[0, 0, -0.08]} scale={pop(tt, 0.1)}>
      <RBox s={[0.3, 0.025, 0.14]} p={[0, 0.012, 0]} r={0.004}>{M.porcelain()}</RBox>
      {[-0.11, -0.055, 0, 0.055, 0.11].map((x) => <mesh key={x} position={[x, 0.11, 0.04]}><cylinderGeometry args={[0.012, 0.012, 0.17, 18]} />{M.porcelain()}</mesh>)}
      <RBox s={[0.28, 0.16, 0.08]} p={[0, 0.1, -0.02]} r={0.004}>{M.porcelain()}</RBox>
      <mesh position={[0, 0.205, -0.02]} rotation={[-PI / 2, 0, 0]} scale={[1, 1, 0.45]}><cylinderGeometry args={[0.165, 0.165, 0.09, 3, 1]} />{M.porcelain()}</mesh>
      <Sheet map={txt("bankw", ["BANK"], { w: 256, h: 64, bg: "#ece6da", fg: "#1d2f5a", size: 50 })} w={0.1} h={0.025} p={[0, 0.17, 0.021]} />
    </group>
    <group position={[0, 0.1, 0.1]} scale={(1 + 0.08 * (1 - bump) * close) * pop(tt, 0.6) * 1.2}>
      <RBox s={[0.1, 0.08, 0.03]} r={0.012}>{M.brass()}</RBox>
      <mesh position={[-0.0, 0.04 + 0.03 * (1 - close), 0]}><torusGeometry args={[0.032, 0.008, 12, 32, PI]} />{M.steel()}</mesh>
      <mesh position={[-0.032, 0.04 + 0.03 * (1 - close) - 0.012, 0]}><cylinderGeometry args={[0.008, 0.008, 0.025, 12]} />{M.steel()}</mesh>
      <mesh position={[0.032, 0.04 - 0.012, 0]}><cylinderGeometry args={[0.008, 0.008, 0.025, 12]} />{M.steel()}</mesh>
      <mesh position={[0, -0.01, 0.016]}><circleGeometry args={[0.008, 16]} /><meshBasicMaterial color="#1b1b1b" /></mesh>
    </group>
    <group position={[0.18, 0.22, 0.08]} scale={pop(tt, 2.6) * 1.15}><PriceTag lines={["NO BANK", "ON WI-FI"]} col="#fbf8f0" fg="#b8302a" /></group>
  </>;
}}</Scene3D>;
