// lin29d · componentes 11-20 (alquiler de autos)
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, eio, lerp, phys, rn, tubeG } from "./h3d";
import { Coin, PI, PriceTag, Sheet, fallY, pop, txt } from "./lkit3d";
import { Phone } from "./lkit_b";
import { Car, Drums } from "./heroes_d1";

// ---- 8:10 · EL SOPORTE DE $10: el clip se calza en la rejilla del aire y el teléfono entra con el mapa encendido ----
export const HVentHolder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark"
  cam={{ at: [0.02, 0.11, 0], az: [-0.26, 0.04], el: [0.12, 0.1], r: [0.58, 0.53], fov: 30 }}>{(tt) => {
  const clip = eio(tt, 0.6, 1.3), ph = eio(tt, 1.6, 2.4), snap = 1 + 0.04 * (1 - phys(tt, 2.4, 10, 0.3));
  return <>
    <RBox s={[0.5, 0.14, 0.08]} p={[0, 0.07, -0.06]} r={0.03}>{M.plastic({ col: "#2a2c31" })}</RBox>
    <RBox s={[0.16, 0.07, 0.02]} p={[0, 0.09, -0.015]} r={0.008}>{M.plastic({ col: "#1b1c20" })}</RBox>
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0, 0.067 + i * 0.012, -0.004]} rotation={[0.3, 0, 0]}><boxGeometry args={[0.15, 0.003, 0.012]} />{M.chrome({})}</mesh>)}
    <group position={[0, 0.09, lerp(0.1, 0.0, clip)]} scale={pop(tt, 0.5)}>
      <RBox s={[0.02, 0.02, 0.03]} p={[0, 0, 0.01]} r={0.004}>{M.plastic({ col: "#141414" })}</RBox>
      <RBox s={[0.08, 0.012, 0.012]} p={[0, -0.02, 0.025]} r={0.004}>{M.plastic({ col: "#141414" })}</RBox>
    </group>
    <group position={[0, lerp(0.3, 0.12, ph), 0.035]} scale={snap * pop(tt, 1.5)}>
      <Phone map={txt("vhph", ["", "▲", "", "Turn right", "0.4 mi"], { w: 200, h: 400, bg: "#3d6a8a", fg: "#ffffff", size: 38, lh: 54 })} s={0.9} />
    </group>
    <group position={[0.05, 0.065, 0.04]} rotation={[0, 0, 0.15 * Math.sin(tt * 3) * (1 - eio(tt, 2.8, 4.5))]}><mesh position={[0, -0.012, 0]}><boxGeometry args={[0.0015, 0.024, 0.0015]} />{M.steel({})}</mesh><PriceTag lines={["$10"]} col="#2e8b57" fg="#ffffff" p={[0, -0.04, 0]} s={0.6 * pop(tt, 2.8)} /></group>
  </>;
}}</Scene3D>;

// ---- 9:20 · LA ESPOSA MANEJA GRATIS: la segunda llave cuelga con su etiqueta de $15/día y al girar dice FREE ----
export const HSpouseFree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0.04, 0.2, 0], az: [-0.12, 0.1], el: [0.1, 0.08], r: [0.56, 0.52], fov: 30 }}>{(tt) => {
  const flip = eio(tt, 2.6, 3.3), spin = eio(tt, 0.8, 2.4), sw = Math.sin(tt * 3) * 0.12 * (1 - eio(tt, 0, 2));
  const Key = ({ x, c }: { x: number; c: string }) => <group position={[x, 0, 0]}>
    <mesh position={[0, 0.03, 0]}><torusGeometry args={[0.018, 0.006, 10, 24]} />{M.brass({})}</mesh>
    <RBox s={[0.012, 0.07, 0.006]} p={[0, -0.02, 0]} r={0.002}>{M.brass({})}</RBox>
    <RBox s={[0.05, 0.035, 0.016]} p={[0, 0.07, 0]} r={0.008}>{M.plastic({ col: c })}</RBox>
  </group>;
  return <>
    <group position={[0, 0.32, 0]} scale={pop(tt, 0.1)}>
      <mesh><torusGeometry args={[0.03, 0.004, 10, 32]} />{M.chrome({})}</mesh>
      <group position={[-0.02, -0.085, 0]} rotation={[0, 0, PI + sw]}><Key x={0} c="#1b1d22" /></group>
      <group position={[0.02, -0.085, 0]} rotation={[0, spin * 2 * PI, -sw]}><group rotation={[0, 0, PI]}><Key x={0} c="#1b1d22" /></group></group>
      <group position={[0.12, 0, 0]} rotation={[0, 0, -sw * 0.6 + 0.25 * Math.sin(flip * PI)]}>
        <mesh position={[-0.04, -0.06, 0]} rotation={[0, 0, 0.6]}><boxGeometry args={[0.0015, 0.15, 0.0015]} />{M.steel({})}</mesh>
        <group position={[0, -0.17, 0]} rotation={[0, flip * PI, 0]}>
          <group position={[0, 0, 0.001]}><PriceTag lines={["2ND DRIVER", "$15/DAY"]} col="#b8302a" fg="#fff4e6" s={0.9} /></group>
          <group rotation={[0, PI, 0]} position={[0, 0, -0.001]}><PriceTag lines={["SPOUSE", "FREE"]} col="#2e8b57" fg="#ffffff" s={0.9} /></group>
        </group>
      </group>
    </group>
  </>;
}}</Scene3D>;

// ---- 10:00 · EL AUTO QUE QUIEREN TUS RODILLAS: auto bajo y SUV lado a lado; la regla marca la altura del asiento ----
export const HKneeCar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="none" bg="#d9e2e8"
  cam={{ at: [0, 0.1, 0], az: [-0.05, 0.05], el: [0.12, 0.1], r: [0.74, 0.68], fov: 30 }}>{(tt) => {
  const m1 = eio(tt, 1.0, 1.6), m2 = eio(tt, 1.8, 2.4);
  return <>
    <Car p={[-0.13, 0, 0]} r={[0, -PI / 2 + 0.3, 0]} s={1.1 * pop(tt, 0.1)} col="#c9453a" />
    <Car p={[0.13, 0, 0]} r={[0, -PI / 2 - 0.3, 0]} s={1.1 * pop(tt, 0.4)} col="#2f6fb0" hi={0.035} />
    {[[-0.13, 0.05, m1, "#b8302a"], [0.13, 0.09, m2, "#2e8b57"]].map(([x, y, m, c], i) => <group key={i}>
      <mesh position={[x as number, (y as number) * (m as number) / 2, 0.08]} scale={[1, Math.max(0.001, m as number), 1]}><boxGeometry args={[0.012, y as number, 0.012]} /><meshStandardMaterial color={c as string} roughness={0.4} /></mesh>
    </group>)}
    <PriceTag lines={["LOW SEAT"]} col="#b8302a" fg="#fff4e6" p={[-0.13, 0.16, 0.02]} s={pop(tt, 1.6) * 0.85} />
    <PriceTag lines={["RESERVE", "AT HOME"]} col="#2e8b57" fg="#ffffff" p={[0.13, 0.2, 0.02]} s={pop(tt, 2.4) * 0.85} />
  </>;
}}</Scene3D>;

// ---- 10:20 · $12 × 7 = $84: siete días del almanaque sueltan cada uno su moneda y el tambor llega a 84 ----
export const HUpgrade84: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0, 0.08, 0], az: [-0.2, 0.1], el: [0.28, 0.24], r: [0.62, 0.56], fov: 30 }}>{(tt) => {
  const n = Math.min(7, Math.floor(eio(tt, 0.8, 3.3) * 7.99)), v = n * 12;
  return <>
    {Array.from({ length: 7 }, (_, i) => <group key={i} position={[-0.18 + i * 0.05, 0.16, -0.04]} scale={pop(tt, 0.1 + i * 0.05)}>
      <RBox s={[0.042, 0.05, 0.008]} r={0.004}>{M.plastic({ col: i < n ? "#e8e2d4" : "#ffffff" })}</RBox>
      <RBox s={[0.042, 0.012, 0.009]} p={[0, 0.02, 0]} r={0.003}>{M.pvc({ col: "#b8302a" })}</RBox>
      <Sheet map={txt("ud" + i, [String(i + 1)], { w: 64, h: 64, bg: "#ffffff", fg: "#1d2f5a", size: 44 })} w={0.028} h={0.028} p={[0, -0.006, 0.0045]} />
    </group>)}
    {Array.from({ length: 7 }, (_, i) => <Coin key={"c" + i} p={[-0.02, 0.006 + i * 0.012 + (i < n ? fallY(tt, 0.8 + i * 0.36, 0.2) : 5), 0.06]} s={1.5} />)}
    <PriceTag lines={["UPGRADE", "$12/DAY"]} col="#6a3fa0" fg="#ffffff" p={[-0.15, 0.06, 0.05]} s={pop(tt, 0.4) * 0.85} />
    <Drums id="u84" v={v} n={2} p={[0.15, 0.06, 0.04]} s={1.1 * pop(tt, 0.6)} />
  </>;
}}</Scene3D>;

// ---- 10:45 · EL TREN DE LOS CARGOS: atrás del autito se van enganchando vagones de cargos del aeropuerto ----
export const HFeeTrain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="none" bg="#cfd9e2"
  cam={{ at: [0.0, 0.05, 0], az: [-0.35, -0.25], el: [0.3, 0.26], r: [0.9, 0.84], fov: 30 }}>{(tt) => {
  const fees = [["CONCESSION", "FEE"], ["FACILITY", "CHARGE"], ["AIRPORT", "TAX"], ["CUSTOMER", "FEE"]];
  const run = eio(tt, 0.4, 4.0) * 0.12;
  return <>
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.2, 0.09]} />{M.matte({ col: "#3a3d42" })}</mesh>
    <Car p={[0.18 + run, 0, 0]} s={0.9 * pop(tt, 0.1)} col="#f2f2ee" />
    {fees.map((f, i) => {
      const k = eio(tt, 0.7 + i * 0.7, 1.2 + i * 0.7), x = 0.06 - i * 0.12 + run;
      return <group key={i} position={[x, (1 - k) * 0.25, 0]} scale={Math.max(0.001, k)}>
        <RBox s={[0.1, 0.05, 0.07]} p={[0, 0.035, 0]} r={0.006}>{M.pvc({ col: ["#b8302a", "#e8822a", "#6a3fa0", "#2f6fb0"][i] })}</RBox>
        <Sheet map={txt("ft" + i, f, { w: 256, h: 128, bg: ["#b8302a", "#e8822a", "#6a3fa0", "#2f6fb0"][i], fg: "#ffffff", size: 44, lh: 56 })} w={0.09} h={0.045} p={[0, 0.035, 0.036]} />
        <mesh position={[0.055, 0.02, 0]}><boxGeometry args={[0.02, 0.004, 0.004]} />{M.steel({})}</mesh>
        {[-0.03, 0.03].map((xx) => <mesh key={xx} position={[xx, 0.01, 0.036]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.006, 16]} />{M.rubber({ col: "#151515" })}</mesh>)}
      </group>;
    })}
  </>;
}}</Scene3D>;

// ---- 11:10 · BUSCAR DOS VECES: dos podios, aeropuerto e in town; el de la ciudad suma el taxi y aun así gana ----
export const HSearchTwice: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark"
  cam={{ at: [0, 0.14, 0], az: [-0.1, 0.08], el: [0.16, 0.14], r: [0.78, 0.72], fov: 30 }}>{(tt) => {
  const a = Math.round(520 * eio(tt, 0.6, 2.0)), b = Math.round(365 * eio(tt, 0.9, 2.3) + 25 * eio(tt, 2.6, 3.2)), win = eio(tt, 3.3, 3.8);
  return <>
    {[[-0.13, "AIRPORT", "#b8302a", a, 0], [0.13, "IN TOWN + TAXI", "#2e8b57", b, win]].map(([x, l, c, v, w], i) => <group key={i} position={[x as number, 0, 0]} scale={pop(tt, 0.1 + i * 0.2)}>
      <RBox s={[0.18, 0.05 + (w as number) * 0.05, 0.12]} p={[0, 0.025 + (w as number) * 0.025, 0]} r={0.008}>{M.pvc({ col: c as string })}</RBox>
      <Sheet map={txt("st" + i, [l as string], { w: 320, h: 64, bg: c as string, fg: "#ffffff", size: 34 })} w={0.16} h={0.032} p={[0, 0.03, 0.061]} />
      <Car p={[0, 0.05 + (w as number) * 0.05, 0]} r={[0, 0.4, 0]} s={0.8} col={i ? "#2f6fb0" : "#f2f2ee"} />
      <Drums id={"st" + i} v={v as number} n={3} p={[0, 0.2, 0]} s={1.1} />
    </group>)}
    <group position={[0.22, fallY(tt, 2.6, 0.2) + 0.006, 0.08]} scale={pop(tt, 2.6)}><Coin s={1.4} /></group>
  </>;
}}</Scene3D>;

// ---- 11:35 · EL RAYÓN Y LA CARTA: una linterna barre el paragolpes y descubre el rayón; del sobre sube la factura de $450 ----
export const HScratchBill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0.03, 0.12, 0], az: [-0.18, 0.08], el: [0.16, 0.14], r: [0.76, 0.7], fov: 30 }}>{(tt) => {
  const sweep = eio(tt, 0.4, 1.4), sc = eio(tt, 0.7, 1.2), up = eio(tt, 2.0, 2.9);
  return <>
    <group position={[-0.09, 0, -0.02]} scale={pop(tt, 0.1)}>
      <RBox s={[0.3, 0.09, 0.07]} p={[0, 0.06, 0]} r={0.03}>{M.pvc({ col: "#b9bec6" })}</RBox>
      <RBox s={[0.26, 0.012, 0.075]} p={[0, 0.03, 0]} r={0.005}>{M.rubber({ col: "#2a2c31" })}</RBox>
      {[[-0.07, 0.07, 0.3], [-0.045, 0.077, -0.25], [-0.02, 0.072, 0.4], [0.005, 0.08, -0.1], [0.03, 0.076, 0.35], [0.052, 0.083, -0.3]].map(([x, y, a], i) => <mesh key={i} position={[x, y, 0.036]} rotation={[0, 0, a]} visible={sc > i / 6} scale={[1, 0.6 + 0.5 * rn(i, 7), 1]}><boxGeometry args={[0.03, 0.006, 0.003]} /><meshStandardMaterial color="#4a3a32" roughness={1} /></mesh>)}
      {Array.from({ length: 14 }, (_, i) => { const k = Math.max(0, Math.min(1, (tt - 0.8 - rn(i, 4) * 0.5) / 0.6)); return <mesh key={"c" + i} visible={k > 0} position={[-0.07 + rn(i, 5) * 0.13, 0.075 - k * k * 0.07, 0.04 + k * 0.03]} rotation={[k * 6, k * 4, 0]}><boxGeometry args={[0.005, 0.004, 0.001]} />{M.pvc({ col: "#b9bec6" })}</mesh>; })}
      <mesh position={[lerp(-0.16, 0.06, sweep), 0.07, 0.037]}><circleGeometry args={[0.045, 32]} /><meshBasicMaterial color="#fff6c8" transparent opacity={0.28 * (1 - eio(tt, 1.6, 2.0))} /></mesh>
    </group>
    <group position={[0.15, 0, 0.04]} rotation={[0, -0.35, 0]} scale={pop(tt, 1.2)}>
      <RBox s={[0.12, 0.08, 0.006]} p={[0, 0.04, 0]} r={0.003}>{M.matte({ col: "#e8dcc0" })}</RBox>
      <group position={[0, 0.07 + up * 0.03, 0.004]} scale={1.15}>
        <group position={[0, 0.05 - 0.05 * up, 0]} scale={[1, Math.max(0.001, up), 1]}><Sheet map={txt("sbb4", ["DAMAGE", "$450"], { w: 256, h: 220, bg: "#fffdf4", size: 40, lh: 90, cols: ["#1d2f5a", "#b8302a"] })} w={0.1} h={0.1} /></group>
        <mesh position={[0, 0.05 - 0.1 * up, 0.004]} rotation={[0, 0, PI / 2]} visible={up < 0.98}><cylinderGeometry args={[0.008 * (1 - up) + 0.002, 0.008 * (1 - up) + 0.002, 0.1, 16]} />{M.matte({ col: "#fffdf4" })}</mesh>
      </group>
    </group>
  </>;
}}</Scene3D>;

// ---- 12:10 · LA FOTO GANA: la foto con fecha cae sobre la factura y el tambor baja de 450 a 0 ----
export const HPhotoProof: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood"
  cam={{ at: [0.03, 0.06, 0], az: [-0.15, 0.1], el: [0.5, 0.44], r: [0.66, 0.6], fov: 30 }}>{(tt) => {
  const ph = eio(tt, 0.8, 1.5), v = Math.round(450 * (1 - eio(tt, 1.8, 3.2)));
  return <>
    <group position={[-0.06, 0.003, 0.02]} rotation={[-PI / 2, 0, 0.1]} scale={pop(tt, 0.1) * (1 - 0.3 * eio(tt, 2.2, 3.0))}>
      <Sheet map={txt("ppb", ["DAMAGE BILL", "", "Rear bumper", "", "$450"], { w: 240, h: 320, bg: "#fffdf4", size: 30, lh: 52, cols: ["#1d2f5a", "#555", "#555", "#555", "#b8302a"] })} w={0.13} h={0.173} />
    </group>
    <group position={[lerp(0.3, -0.04, ph), 0.006 + (1 - ph) * 0.1, 0.03]} rotation={[-PI / 2, 0, -0.15]} scale={pop(tt, 0.7) * 1.45}>
      <RBox s={[0.11, 0.13, 0.002]} r={0.002}>{M.matte({ col: "#fbfbf6" })}</RBox>
      <Sheet map={txt("pph", ["PICKUP", "MAR 14 · 9:02"], { w: 220, h: 220, bg: "#4f6f8a", fg: "#ffffff", size: 32, lh: 54 })} w={0.095} h={0.095} p={[0, 0.012, 0.0015]} />
    </group>
    <Drums id="pp" v={v} n={3} p={[0.13, 0.11, -0.06]} s={1.0 * pop(tt, 0.3)} />
  </>;
}}</Scene3D>;

// ---- 13:00 · DOS VUELTAS AL AUTO: un camino punteado rodea el auto y en cada esquina salta un flash de foto ----
export const HWalkAround: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="none" bg="#d8e0e6"
  cam={{ at: [0, 0.06, 0], az: [-0.5, 0.4], el: [0.55, 0.5], r: [0.8, 0.74], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.6, 3.6), n = 6;
  return <>
    <Car s={1.6 * pop(tt, 0.1)} col="#c0c4ca" />
    {Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.2, 0.002, Math.sin(a) * 0.13]} scale={i / 24 < k ? 1 : 0.001}><cylinderGeometry args={[0.006, 0.006, 0.002, 10]} />{M.plastic({ col: "#f2d23a" })}</mesh>; })}
    {Array.from({ length: n }, (_, i) => { const a = (i / n) * PI * 2 + 0.3, on = k > i / n; const fl = on ? Math.max(0, 1 - (k - i / n) * 12) : 0; return <group key={"f" + i} position={[Math.cos(a) * 0.2, 0.05, Math.sin(a) * 0.13]} scale={on ? pop(tt, 0.6 + (i / n) * 3.0) : 0.001}>
      <RBox s={[0.03, 0.02, 0.012]} r={0.004}>{M.plastic({ col: "#1b1d22" })}</RBox>
      <mesh position={[0, 0, 0.007]}><cylinderGeometry args={[0.006, 0.006, 0.004, 12]} />{M.glass({ col: "#88aacc" })}</mesh>
      <mesh visible={fl > 0.02} scale={0.03 * fl + 0.001}><sphereGeometry args={[1, 12, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.5 * fl} /></mesh>
    </group>; })}
    <PriceTag lines={["2 MIN"]} col="#2e8b57" fg="#ffffff" p={[0, 0.15, -0.04]} s={pop(tt, 3.4)} />
  </>;
}}</Scene3D>;

// ---- 13:40 · LA ALFOMBRA CON ARENA: la alfombrita se sacude, cae la arena, y la multa de $200 se achica a $2 ----
export const HSandMat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="none" bg="#e6dfcf" warm={0.9}
  cam={{ at: [0, 0.1, 0], az: [-0.2, 0.08], el: [0.16, 0.12], r: [0.6, 0.54], fov: 30 }}>{(tt) => {
  const lift = eio(tt, 0.4, 1.0), sh = tt > 1.0 && tt < 2.8 ? Math.sin(tt * 30) * 0.03 : 0, sw = eio(tt, 2.8, 3.4);
  return <>
    <group position={[-0.06, 0.03 + lift * 0.1, 0]} rotation={[1.35 - lift * 0.45 + sh * 4, 0.3, sh * 2]} scale={pop(tt, 0.1) * 1.1}>
      <RBox s={[0.2, 0.15, 0.006]} r={0.012}>{M.rubber({ col: "#4a4d54" })}</RBox>
      {[[0, 0.072, 0.2, 0.008], [0, -0.072, 0.2, 0.008], [0.097, 0, 0.008, 0.15], [-0.097, 0, 0.008, 0.15]].map(([x, y, w, hh], i) => <RBox key={"b" + i} s={[w, hh, 0.012]} p={[x, y, 0.004]} r={0.003}>{M.rubber({ col: "#2a2c31" })}</RBox>)}
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.072 + i * 0.018, 0, 0.005]}><boxGeometry args={[0.005, 0.12, 0.004]} />{M.rubber({ col: "#33363c" })}</mesh>)}
    </group>
    {Array.from({ length: 90 }, (_, i) => { const a = 1.0 + rn(i) * 1.8, k = Math.max(0, Math.min(1, (tt - a) / 0.5)); return <mesh key={i} visible={tt > a} position={[-0.06 + (rn(i, 2) - 0.5) * 0.14, Math.max(0.004, 0.12 - k * k * 0.12), (rn(i, 3) - 0.5) * 0.08]}><sphereGeometry args={[0.004, 6, 5]} /><meshStandardMaterial color="#d9c08a" roughness={1} /></mesh>; })}
    <group position={[0.15, 0.12, -0.02]}>
      <group scale={Math.max(0.001, pop(tt, 0.5) * (1 - sw))}><PriceTag lines={["CLEANING", "$200"]} col="#b8302a" fg="#fff4e6" /></group>
      <group scale={Math.max(0.001, sw) * pop(tt, 2.9)}><PriceTag lines={["VACUUM", "$2"]} col="#2e8b57" fg="#ffffff" /></group>
    </group>
  </>;
}}</Scene3D>;
