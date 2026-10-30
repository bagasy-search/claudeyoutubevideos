// lin29b · componentes 21-30 (cruceros)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, eio, lerp, phys, rn, cl, tex, tubeG } from "./h3d";
import { Coin, KeyCard, PI, PriceTag, Sheet, pop, txt } from "./lkit3d";
import { Phone, Sea, Ship, StampMark, StampTool, WineGlass } from "./lkit_b";

// pulsera: anillo de cuentas con dije
const Bracelet: React.FC<{ col: string; gem: string; p: number[]; s?: number; shine?: number }> = ({ col, gem, p, s = 1, shine = 0 }) =>
  <group position={p as [number, number, number]} scale={s} rotation={[-PI / 2 + 0.25, 0, 0]}>
    <mesh><torusGeometry args={[0.06, 0.006, 12, 48]} />{M.chrome({ col })}</mesh>
    {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * 2 * PI; return <mesh key={i} position={[0.06 * Math.cos(a), 0.06 * Math.sin(a), 0]}><sphereGeometry args={[0.009, 14, 10]} /><meshPhysicalMaterial color={gem} roughness={0.05} clearcoat={1} emissive={gem} emissiveIntensity={0.15 + 0.5 * shine} /></mesh>; })}
  </group>;
// ---- 15:51 · LA MISMA PULSERA: en el puerto $25, en la tienda «recomendada» $80; la balanza se inclina ----
export const HBracelets: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0, 0.07, 0], az: [-0.12, 0.12], el: [0.26, 0.22], r: [0.98, 0.9], fov: 30 }}>{(tt) => {
  const tilt = 0.22 * phys(tt, 2.2, 6, 0.35);
  return <>
    <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.008, 0.012, 0.18, 16]} />{M.brass()}</mesh>
    <group position={[0, 0.18, 0]} rotation={[0, 0, tilt]} scale={pop(tt, 0.2)}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.5, 10]} />{M.brass()}</mesh>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.24, 0, 0]} rotation={[0, 0, -tilt]}>
        <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.001, 0.001, 0.1, 6]} />{M.brass()}</mesh>
        <mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.08, 0.07, 0.008, 40]} />{M.brass()}</mesh>
        <Bracelet col="#d9dce0" gem="#2f7ad9" p={[0, -0.09, 0]} s={0.9 * pop(tt, sd < 0 ? 0.6 : 1.0)} shine={sd > 0 ? 1 : 0} />
        <group position={[0, -0.165, 0.03]} scale={pop(tt, sd < 0 ? 1.4 : 1.8) * 1.3}><PriceTag lines={sd < 0 ? ["PORT", "$25"] : ["MALL", "$80"]} col={sd < 0 ? "#e6f2e6" : "#f6e0dc"} fg={sd < 0 ? "#2f5d4a" : "#b8302a"} s={1.2} /></group>
      </group>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 16:23 · EL PRECIO SUBE Y BAJA: una cinta de precios en ola; el barco la navega y en el valle aparece la bandera CALL ----
export const HPriceWave: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#e9eef3" warm={0.85}
  cam={{ at: [0, 0.15, 0], az: [-0.1, 0.08], el: [0.15, 0.13], r: [0.95, 0.88], fov: 30 }}>{(tt) => {
  const f = (x: number) => 0.14 + 0.08 * Math.sin(x * 9 + 0.6) + 0.03 * Math.sin(x * 23);
  const gq = Math.round(eio(tt, 0.2, 2.0) * 24), grow = gq / 24, N = 120;
  const pts = Array.from({ length: N }, (_, i) => { const x = -0.3 + 0.6 * i / (N - 1); return new THREE.Vector3(x, f(x), 0); }).filter((v) => v.x < -0.3 + 0.6 * grow + 0.01);
  const sx = lerp(-0.28, 0.28, eio(tt, 1.0, 4.4)), lowX = Array.from({ length: 61 }, (_, i) => -0.3 + i * 0.01).reduce((m, x) => (f(x) < f(m) ? x : m), 0);
  const flag = phys(tt, 3.0, 8, 0.4);
  return <>
    {pts.length > 2 && <mesh geometry={tubeG("pw" + gq, pts.map((v) => [v.x, v.y, 0]), 0.006, 160, 12)}><meshStandardMaterial color="#2f6f9a" roughness={0.4} /></mesh>}
    {pts.length > 2 && <mesh position={[0, -0.012, -0.02]} geometry={tubeG("pw" + gq, pts.map((v) => [v.x, v.y, 0]), 0.006, 160, 12)}>{M.glass({ col: "#8ec3e6", op: 0.4 })}</mesh>}
    {["$1,890", "$1,640", "$2,100", "$1,510", "$1,980"].map((p, i) => { const x = -0.24 + i * 0.12; return <group key={i} position={[x, f(x) + 0.07, 0.02]} scale={pop(tt, 0.4 + i * 0.3) * 1.0}><PriceTag lines={[p]} col="#fbf8f0" fg={i === 3 ? "#2f5d4a" : "#1d2f5a"} /></group>; })}
    <group position={[sx, f(sx) + 0.005, 0]} rotation={[0, 0, Math.atan2(f(sx + 0.01) - f(sx - 0.01), 0.02)]} scale={0.34 * pop(tt, 0.9)}><Ship /></group>
    <group position={[lowX, f(lowX) + 0.11, 0.03]} scale={Math.max(0.001, flag) * 1.6}>
      <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.002, 0.002, 0.1, 8]} />{M.steel()}</mesh>
      <mesh position={[0.03, -0.015, 0]}><planeGeometry args={[0.06, 0.035]} /><meshStandardMaterial side={THREE.DoubleSide} map={txt("callflag", ["CALL"], { w: 192, h: 112, bg: "#b8302a", fg: "#fff", size: 70 })} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 17:39 · $380 DE CRÉDITO: las monedas suben del mar y forman la cola de la ballena ----
export const HWhaleTail: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#9db2c2" warm={0.75}
  cam={{ at: [0, 0.14, 0], az: [-0.2, 0.05], el: [0.18, 0.15], r: [0.9, 0.82], fov: 30 }}>{(tt) => {
  const tail: [number, number][] = [];
  for (let i = 0; i < 7; i++) tail.push([0, 0.04 + i * 0.022]);
  for (let k = 1; k <= 7; k++) { const a = k / 7; tail.push([-a * 0.15, 0.19 + 0.06 * Math.sin(a * PI * 0.8)]); tail.push([a * 0.15, 0.19 + 0.06 * Math.sin(a * PI * 0.8)]); }
  return <>
    <Sea t={tt} col="#4d6f86" />
    {[[-0.6, -0.5], [0.5, -0.6]].map(([x, z], i) => <mesh key={i} position={[x, 0, z]}><coneGeometry args={[0.25, 0.35, 5]} /><meshStandardMaterial color="#e9eef3" roughness={0.9} flatShading /></mesh>)}
    <group position={[0, 0, -0.03]} scale={Math.max(0.001, eio(tt, 1.6, 2.6))}>
      <mesh position={[0, 0.09, 0]} castShadow><cylinderGeometry args={[0.022, 0.04, 0.18, 24]} /><meshPhysicalMaterial color="#2c3e50" roughness={0.35} clearcoat={0.8} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.08, 0.2, 0]} rotation={[0, 0, sd * 0.35]} scale={[0.1, 0.03, 0.014]}><sphereGeometry args={[1, 32, 16]} /><meshPhysicalMaterial color="#2c3e50" roughness={0.35} clearcoat={0.8} /></mesh>)}
      {Array.from({ length: 14 }, (_, i) => { const ph = (tt * 0.9 + rn(i, 4)) % 1; return <mesh key={i} position={[(rn(i, 5) - 0.5) * 0.2, 0.17 - ph * 0.17, 0.02]} scale={1 - ph}><sphereGeometry args={[0.006, 8, 6]} />{M.water({ op: 0.8 })}</mesh>; })}
    </group>
    {tail.map(([x, y], i) => { const a = 0.3 + i * 0.1, k = eio(tt, a, a + 0.8);
      return <Coin key={i} p={[x * k + (rn(i, 1) - 0.5) * 0.3 * (1 - k), lerp(-0.02, y, k), 0.02]} r={[PI / 2 * k, 0, 0]} s={1.3 * (tt > a ? 1 : 0.001) * Math.max(0.001, 1 - eio(tt, a + 0.9, a + 1.3))} col="#e2b84a" />; })}
    <group position={[0.22, 0.25, 0.06]} scale={pop(tt, 3.2)}><PriceTag lines={["$380", "CREDIT"]} col="#fbf8f0" fg="#2f5d4a" s={1.4} /></group>
  </>;
}}</Scene3D>;

// ---- 18:33 · REVISÁ LA TELE CADA DOS DÍAS: en la lista de la cuenta, una línea se pone roja y salta afuera con un «?» ----
export const HTvCheck: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0, 0.2, 0], az: [-0.12, 0.1], el: [0.08, 0.1], r: [0.72, 0.65], fov: 30 }}>{(tt) => {
  const red = eio(tt, 1.6, 2.0), out = phys(tt, 2.2, 7, 0.45);
  const scr = txt("tvlist" + (red > 0.5 ? 1 : 0), ["MY ACCOUNT", "DINNER  $0", "SPA  $0", "WINE PKG  $96", "PHOTO  $0"], { w: 640, h: 380, bg: "#14315a", fg: "#e9f2ff", size: 44, lh: 66, cols: ["#f2d23a", "#e9f2ff", "#e9f2ff", red > 0.5 ? "#ff5a4a" : "#e9f2ff", "#e9f2ff"] });
  return <>
    <group position={[0, 0.2, -0.05]} scale={pop(tt, 0.1)}>
      <RBox s={[0.46, 0.28, 0.02]} r={0.008}>{M.plastic({ col: "#141414" })}</RBox>
      <mesh position={[0, 0, 0.0105]}><planeGeometry args={[0.44, 0.26]} /><meshStandardMaterial map={scr} emissive="#ffffff" emissiveMap={scr} emissiveIntensity={0.85} /></mesh>
    </group>
    <group position={[0.02 + 0.03 * out, lerp(0.15, 0.09, out), -0.035 + 0.1 * out]} rotation={[0, -0.2 * out, 0.06 * out]} scale={Math.max(0.001, out) * 1.15}>
      <Sheet map={txt("tvline2", ["WINE PKG $96 ?"], { w: 640, h: 110, bg: "#b8302a", fg: "#fff", size: 56 })} w={0.3} h={0.052} />
    </group>
  </>;
}}</Scene3D>;

// ---- 18:49 · LA TARJETA TIENE TOPE: la llave de la cabina avanza hasta la barrera con su límite y la barrera baja ----
export const HCardLimit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="dark"
  cam={{ at: [0, 0.06, 0], az: [-0.35, -0.2], el: [0.32, 0.28], r: [0.66, 0.6], fov: 30 }}>{(tt) => {
  const slide = eio(tt, 0.6, 2.4), gate = phys(tt, 2.2, 8, 0.45);
  return <>
    <group position={[0.1, 0, 0]} scale={pop(tt, 0.2)}>
      <RBox s={[0.04, 0.12, 0.04]} p={[0, 0.06, -0.06]} r={0.006}>{M.plastic({ col: "#e9eef3" })}</RBox>
      <group position={[0, 0.1, -0.04]} rotation={[0, 0, -(1 - gate) * (PI / 2)]}>
        <RBox s={[0.008, 0.008, 0.0]} r={0.001}>{M.steel()}</RBox>
        <group>
          {[0, 1, 2, 3, 4].map((i) => <RBox key={i} s={[0.05, 0.016, 0.012]} p={[-0.025 - i * 0.05, 0, 0]} r={0.004}>{M.plastic({ col: i % 2 ? "#f2f2ee" : "#d9342a" })}</RBox>)}
        </group>
      </group>
    </group>
    <group position={[-0.02, 0.004, lerp(0.34, 0.06, slide)]} rotation={[-PI / 2, 0, 0]} scale={pop(tt, 0.3) * 2.2}><KeyCard label="CABIN 8214" /></group>
    <group position={[0.18, 0.15, 0.04]} scale={pop(tt, 2.6)}><PriceTag lines={["LIMIT", "$500"]} col="#fbf8f0" fg="#b8302a" s={1.4} /></group>
  </>;
}}</Scene3D>;

// ---- 19:10 · EL PASAPORTE DE LOS PASOS: el sello baja una y otra vez; cada golpe deja un paso en la hoja ----
export const HPassport: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [0, 0.03, 0.02], az: [0.05, -0.05], el: [0.95, 0.88], r: [0.58, 0.52], fov: 30 }}>{(tt) => {
  const W = ["BOOK", "CHECK", "INSURE", "FLY", "BOARD", "READ"], slot = (i: number): [number, number] => [-0.1 + (i % 3) * 0.1, -0.055 + Math.floor(i / 3) * 0.11];
  const k = cl((tt - 0.6) / 0.55), cur = Math.min(5, Math.floor(k * 6 / 6 + (tt - 0.6) / 0.55)), ph = ((tt - 0.6) / 0.55) % 1;
  const [sx, sz] = slot(Math.max(0, Math.min(5, Math.floor((tt - 0.6) / 0.55))));
  const down = tt > 0.6 && tt < 0.6 + 6 * 0.55 ? Math.max(0, Math.sin(ph * PI)) : 0;
  return <>
    <group scale={pop(tt, 0.1)}>
      <RBox s={[0.34, 0.006, 0.24]} p={[0, 0.003, 0]} r={0.004}><meshStandardMaterial color="#1d2f5a" roughness={0.7} /></RBox>
      <RBox s={[0.32, 0.004, 0.225]} p={[0, 0.008, 0]} r={0.003}><meshStandardMaterial color="#f3ecd8" roughness={0.9} /></RBox>
      <mesh position={[0, 0.0105, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.002, 0.22]} />{M.matte({ col: "#c9b38a" })}</mesh>
    </group>
    {W.map((w, i) => { const [x, z] = slot(i), on = tt > 0.6 + i * 0.55 + 0.27; return on ? <StampMark key={i} id={"pp" + i} lines={[w, String(i + 1)]} col={["#b8302a", "#1d5fa8", "#2f7a4a"][i % 3]} p={[x, 0.0106, z]} r={[-PI / 2, 0, (rn(i, 3) - 0.5) * 0.5]} s={1.05} /> : null; })}
    {tt < 0.6 + 6 * 0.55 + 0.4 && <StampTool p={[sx, 0.011 + 0.09 * (1 - down), sz]} s={0.9} col="#b8302a" />}
    {void cur}
  </>;
}}</Scene3D>;

// pintura en atril
const paintTex = tex.text("easelpaint", 256, 320, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 320); gr.addColorStop(0, "#f2a65a"); gr.addColorStop(0.55, "#f7d9a0"); gr.addColorStop(0.56, "#2f6f9a"); gr.addColorStop(1, "#1d3f5a"); g.fillStyle = gr; g.fillRect(0, 0, 256, 320);
  g.fillStyle = "#fff4d0"; g.beginPath(); g.arc(128, 170, 30, PI, 2 * PI); g.fill(); g.fillStyle = "#f4f4f1"; g.fillRect(70, 200, 110, 14);
});
// ---- 20:47 · LA COPA ES GRATIS, EL CUADRO NO: brindis gratis adelante; detrás, el cuadro en el atril y su etiqueta de $2,400 ----
export const HEasel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0, 0.16, 0], az: [-0.25, 0.15], el: [0.16, 0.14], r: [0.8, 0.72], fov: 30 }}>{(tt) => {
  const fill = eio(tt, 0.6, 1.6), tag = phys(tt, 2.4, 7, 0.4);
  return <>
    <group position={[0.08, 0, -0.12]} scale={pop(tt, 0.1)}>
      {[-0.07, 0.07].map((x) => <mesh key={x} position={[x, 0.17, 0.02]} rotation={[-0.15, 0, x > 0 ? -0.12 : 0.12]}><cylinderGeometry args={[0.005, 0.006, 0.36, 10]} />{M.wood({ base: [120, 80, 46] })}</mesh>)}
      <mesh position={[0, 0.16, -0.06]} rotation={[0.35, 0, 0]}><cylinderGeometry args={[0.005, 0.006, 0.34, 10]} />{M.wood({ base: [120, 80, 46] })}</mesh>
      <RBox s={[0.22, 0.008, 0.03]} p={[0, 0.115, 0.03]} r={0.003}>{M.wood({ base: [120, 80, 46] })}</RBox>
      <group position={[0, 0.24, 0.035]} rotation={[-0.12, 0, 0]}>
        <RBox s={[0.2, 0.25, 0.012]} r={0.004}>{M.brass()}</RBox>
        <mesh position={[0, 0, 0.0065]}><planeGeometry args={[0.18, 0.23]} /><meshStandardMaterial map={paintTex} roughness={0.7} /></mesh>
      </group>
      <group position={[0.14, 0.12, 0.1]} rotation={[0, 0, 0.3 * (1 - tag)]} scale={Math.max(0.001, tag) * 1.5}><PriceTag lines={["ART", "$2,400"]} col="#b8302a" fg="#fff4e6" /></group>
    </group>
    <group position={[-0.16, 0, 0.1]} scale={pop(tt, 0.3)}>
      <WineGlass p={[0, 0, 0]} s={1.6} fill={fill} col="#f2d27a" />
      {Array.from({ length: 8 }, (_, i) => { const ph = (tt * 0.8 + rn(i, 1)) % 1; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.02, 0.1 + ph * 0.03, 0]} scale={fill > 0.3 ? 1 : 0.001}><sphereGeometry args={[0.0018, 6, 6]} />{M.glass({ op: 0.7 })}</mesh>; })}
    </group>
    <group position={[-0.16, 0.24, 0.12]} scale={pop(tt, 1.6)}><PriceTag lines={["FREE"]} col="#e6f2e6" fg="#2f5d4a" s={1.3} /></group>
  </>;
}}</Scene3D>;

// ---- 21:06 · EL CELULAR SE MUERE: la batería baja a cero y del bolsillo sale la nota de papel con todo anotado ----
export const HDeadPhone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0, 0.14, 0], az: [-0.18, 0.12], el: [0.2, 0.18], r: [0.78, 0.7], fov: 30 }}>{(tt) => {
  const bat = 1 - eio(tt, 0.4, 2.2), dead = bat < 0.05, note = phys(tt, 2.6, 7, 0.45);
  const scr = tex.text("bat" + Math.round(bat * 10), 160, 330, (g) => {
    g.fillStyle = dead ? "#050505" : "#1b2430"; g.fillRect(0, 0, 160, 330); if (dead) { g.strokeStyle = "#ff3a2a"; g.lineWidth = 6; g.strokeRect(40, 90, 80, 150); g.fillStyle = "#ff3a2a"; g.fillRect(62, 76, 36, 14); g.font = "900 60px Arial"; g.textAlign = "center"; g.fillText("0%", 80, 290); return; }
    g.strokeStyle = "#e9eef3"; g.lineWidth = 6; g.strokeRect(40, 90, 80, 150); g.fillStyle = "#e9eef3"; g.fillRect(62, 76, 36, 14);
    g.fillStyle = bat < 0.25 ? "#ff4a3a" : "#5fd27a"; const hh = 140 * bat; g.fillRect(45, 235 - hh, 70, hh);
  });
  return <>
    <Phone map={scr} p={[-0.14, 0.12, 0]} r={[0, 0.2, 0]} s={1.15 * pop(tt, 0.1)} em={dead ? 0.5 * (0.5 + 0.5 * Math.sin(tt * 9)) : 0.9} />
    <group position={[0.07, 0, -0.02]} scale={pop(tt, 0.3)}>
      <RBox s={[0.2, 0.2, 0.03]} p={[0, 0.1, 0]} r={0.02}><meshStandardMaterial color="#1d2f5a" roughness={0.95} /></RBox>
      <RBox s={[0.12, 0.07, 0.034]} p={[0, 0.07, 0.002]} r={0.01}><meshStandardMaterial color="#22365f" roughness={0.95} /></RBox>
    </group>
    <group position={[0.07, 0.09 + 0.1 * note, 0.03 + 0.04 * note]} rotation={[0, 0, 0.15 * (1 - note)]} scale={Math.max(0.001, cl(note * 3)) * 1.0}>
      <Sheet map={txt("pnote3", ["ALL ABOARD", "4:30 PM", "PIER 2"], { w: 320, h: 280, bg: "#fbf6e6", size: 40, lh: 84, cols: ["#b8302a", "#b8302a", "#1d2f5a"] })} w={0.17} h={0.15} />
    </group>
  </>;
}}</Scene3D>;

// ---- 21:54 · EN EL MEDIO Y ABAJO: el barco se mece; la cabina del medio de abajo se ilumina y casi no se mueve ----
export const HMidShip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#2c3d50" warm={0.7}
  cam={{ at: [0, 0.1, 0], az: [-0.08, 0.06], el: [0.1, 0.09], r: [0.98, 0.9], fov: 30 }}>{(tt) => {
  const rock = 0.09 * Math.sin(tt * 1.6), glow = eio(tt, 1.2, 2.0);
  return <>
    <Sea t={tt} col="#28506b" />
    <group position={[0, 0.0, 0]} rotation={[0, 0, rock]} scale={pop(tt, 0.1)}>
      <group position={[0, 0, 0]}><Ship /></group>
      {[-0.2, 0.2].map((x) => <mesh key={x} position={[x, 0.07, 0.054]} scale={Math.max(0.001, glow)}><planeGeometry args={[0.06, 0.03]} />{M.glow({ col: "#ff6a5a" })}</mesh>)}
      <mesh position={[0, 0.045, 0.054]} scale={Math.max(0.001, glow)}><planeGeometry args={[0.06, 0.028]} />{M.glow({ col: "#7aff9a" })}</mesh>
    </group>
    <group position={[-0.2, 0.22, 0.1]} scale={pop(tt, 2.4)}><PriceTag lines={["MIDDLE", "+ LOW"]} col="#e6f2e6" fg="#2f5d4a" s={1.2} /></group>
  </>;
}}</Scene3D>;

// ---- 23:00 · EL SOBRE SE ADELGAZA: el sobre gordo de lo que te cobran suelta hoja tras hoja y queda flaquito ----
export const HThinEnvelope: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark"
  cam={{ at: [0, 0.08, 0], az: [-0.2, 0.12], el: [0.38, 0.33], r: [0.72, 0.65], fov: 30 }}>{(tt) => {
  const fly = ["WINE PKG", "PHOTOS", "SPA", "ART", "TOURS", "WIFI"], thin = eio(tt, 0.8, 3.6);
  return <>
    <group position={[0, 0, 0]} scale={pop(tt, 0.1)}>
      <RBox s={[0.26, 0.012 + 0.07 * (1 - thin), 0.17]} p={[0, (0.012 + 0.07 * (1 - thin)) / 2, 0]} r={0.006}><meshStandardMaterial color="#efe6d0" roughness={0.9} /></RBox>
      <mesh position={[0, 0.013 + 0.07 * (1 - thin), 0.03]} rotation={[-PI / 2, 0, PI]}><circleGeometry args={[0.12, 3]} /><meshStandardMaterial color="#e6dcc2" roughness={0.9} /></mesh>
      <mesh position={[0, 0.0135 + 0.07 * (1 - thin), -0.05]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.2, 0.05]} /><meshStandardMaterial transparent map={txt("envch", ["EXTRA CHARGES"], { w: 512, h: 128, bg: "rgba(0,0,0,0)", fg: "#b8302a", size: 60 })} /></mesh>
    </group>
    {fly.map((w, i) => { const a = 0.8 + i * 0.45, k = eio(tt, a, a + 0.9);
      return k > 0.001 && k < 0.999 ? <group key={i} position={[lerp(0, (i % 2 ? 1 : -1) * (0.25 + 0.04 * i), k), 0.05 + 0.3 * Math.sin(PI * k * 0.7), lerp(0, 0.12, k)]} rotation={[-0.6 + k * 2, k * 3 * (i % 2 ? 1 : -1), 0]}>
        <Sheet map={txt("efly" + i, [w], { w: 320, h: 200, bg: "#fbf8f0", fg: "#b8302a", size: 56 })} w={0.16} h={0.1} />
      </group> : null; })}
    <group position={[0.2, 0.12, 0.06]} scale={pop(tt, 3.8)}><PriceTag lines={["$380", "SAVED"]} col="#e6f2e6" fg="#2f5d4a" s={1.4} /></group>
  </>;
}}</Scene3D>;
