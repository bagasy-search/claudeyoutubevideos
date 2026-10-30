// lin29d · componentes 1-10 (alquiler de autos)
import React from "react";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, eio, lerp, phys, rn, cl, tubeG } from "./h3d";
import { Coin, PI, PriceTag, Sheet, fallY, pop, txt } from "./lkit3d";
import { Phone } from "./lkit_b";

// auto de juguete (frente hacia +x); hi = carrocería alta (SUV)
export const Car: React.FC<{ p?: number[]; r?: number[]; s?: number; col?: string; hi?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, col = "#b8302a", hi = 0 }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <RBox s={[0.16, 0.04 + hi, 0.08]} p={[0, 0.03 + hi / 2, 0]} r={0.014}>{M.pvc({ col })}</RBox>
    <RBox s={[0.09 + hi * 0.6, 0.035, 0.07]} p={[-0.01, 0.065 + hi, 0]} r={0.014}>{M.glass({ col: "#bcd6ea", op: 0.75 })}</RBox>
    {[[-0.05, -0.04], [0.05, -0.04], [-0.05, 0.04], [0.05, 0.04]].map(([x, z], i) => <mesh key={i} position={[x, 0.014, z]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.014 + hi * 0.15, 0.014 + hi * 0.15, 0.012, 20]} />{M.rubber({ col: "#151515" })}</mesh>)}
    {[-0.022, 0.022].map((z) => <mesh key={z} position={[0.081, 0.032 + hi / 2, z]}><sphereGeometry args={[0.007, 12, 10]} />{M.glow({ col: "#fff2c0" })}</mesh>)}
  </group>;

// tambor de N cifras con signo $
export const Drums: React.FC<{ id: string; v: number; n: number; p?: number[]; s?: number; fg?: string; bg?: string }> = ({ id, v, n, p = [0, 0, 0], s = 1, fg = "#f2d23a", bg = "#1b1d22" }) => {
  const d = Array.from({ length: n }, (_, i) => Math.floor(Math.max(0, v) / Math.pow(10, n - 1 - i)) % 10);
  const w = 0.045 * n + 0.05;
  return <group position={p as [number, number, number]} scale={s}>
    <RBox s={[w, 0.08, 0.06]} r={0.01}>{M.plastic({ col: bg })}</RBox>
    <Sheet map={txt("dr$" + id, ["$"], { w: 64, h: 64, bg, fg, size: 54 })} w={0.03} h={0.03} p={[-w / 2 + 0.022, 0, 0.031]} />
    {d.map((x, i) => <DigitDrum key={i} v={x} p={[-w / 2 + 0.06 + i * 0.045, 0, 0.032]} r={0.026} w={0.036} />)}
  </group>;
};

// tarjeta de mostrador con texto
const Card: React.FC<{ id: string; lines: string[]; col: string; fg?: string; p?: number[]; r?: number[]; s?: number }> = ({ id, lines, col, fg = "#ffffff", p = [0, 0, 0], r = [0, 0, 0], s = 1 }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <RBox s={[0.14, 0.004, 0.08]} r={0.002}>{M.plastic({ col })}</RBox>
    <Sheet map={txt("cd" + id, lines, { w: 320, h: 180, bg: col, fg, size: 46, lh: 58 })} w={0.13} h={0.073} p={[0, 0.0025, 0]} r={[-PI / 2, 0, 0]} />
  </group>;

const Umbrella: React.FC<{ col: string; p?: number[]; r?: number[]; s?: number; open?: number }> = ({ col, p = [0, 0, 0], r = [0, 0, 0], s = 1, open = 1 }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <mesh position={[0, 0.16, 0]} scale={[Math.max(0.15, open), 1, Math.max(0.15, open)]}><coneGeometry args={[0.11, 0.05, 8, 1, true]} /><meshStandardMaterial color={col} roughness={0.55} side={2} /></mesh>
    <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.003, 0.003, 0.15, 8]} />{M.chrome({})}</mesh>
    <mesh position={[0.012, 0.015, 0]} rotation={[0, 0, PI]}><torusGeometry args={[0.012, 0.003, 8, 16, PI]} />{M.wood({})}</mesh>
  </group>;

// ---- 0:10 · LA PILA DEL MOSTRADOR: sobre el contrato caen de a una las ofertas y el tambor del precio diario trepa ----
export const HCounterStack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0.04, 0.05, 0], az: [-0.25, 0.08], el: [0.5, 0.42], r: [0.6, 0.54], fov: 30 }}>{(tt) => {
  const offers = [["PROTECTION", "+$30/DAY"], ["PREPAID FUEL", "+$65"], ["TOLL PASS", "+$12/DAY"], ["UPGRADE", "+$12/DAY"]];
  const v = Math.round(39 + 53 * eio(tt, 0.9, 3.6));
  return <>
    <group position={[-0.06, 0, 0.02]} scale={pop(tt, 0.1)}>
      <Sheet map={txt("ctr", ["RENTAL AGREEMENT", "", "Compact · 7 days", "", "Sign here ______"], { w: 300, h: 400, bg: "#f6f1e4", size: 24, lh: 40, cols: ["#1d2f5a", "#555", "#555", "#555", "#555"] })} w={0.17} h={0.226} p={[0, 0.002, 0]} r={[-PI / 2, 0, 0.06]} />
    </group>
    {offers.map((o, i) => <Card key={i} id={"of" + i} lines={o} col={["#b8302a", "#e8822a", "#2f6fb0", "#6a3fa0"][i]} p={[-0.06 + rn(i) * 0.03 - 0.015, 0.006 + i * 0.006 + fallY(tt, 0.8 + i * 0.7, 0.3), 0.02 + (rn(i, 2) - 0.5) * 0.06]} r={[0, (rn(i, 3) - 0.5) * 0.6, 0]} s={pop(tt, 0.8 + i * 0.7) * 1.25} />)}
    <Drums id="ctr" v={v} n={2} p={[0.14, 0.1, -0.02]} s={1.5 * pop(tt, 0.3)} />
    <Sheet map={txt("ctrpd", ["PER DAY"], { w: 256, h: 64, bg: "#1b1d22", fg: "#f2d23a", size: 40 })} w={0.13} h={0.032} p={[0.14, 0.03, 0.03]} s={pop(tt, 0.4)} />
  </>;
}}</Scene3D>;

// ---- 1:00 · CASI A LA MITAD: la etiqueta entera de $412 se parte de un tajo, la mitad cae y la otra se vuelve $248 verde ----
export const HHalfPrice: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [0, 0.1, 0], az: [-0.15, 0.12], el: [0.16, 0.14], r: [0.66, 0.6], fov: 30 }}>{(tt) => {
  const cut = eio(tt, 1.5, 1.8), drop = phys(tt, 1.9, 6, 0.4), turn = eio(tt, 2.6, 3.1), whole = tt < 1.85;
  return <>
    <Car p={[0.0, 0, 0.1]} r={[0, 0.4, 0]} s={1.2 * pop(tt, 0.1)} col="#2f6fb0" />
    <group position={[0, 0.135, -0.04]} scale={pop(tt, 0.4) * 1.1}>
      {whole ? <group>
        <RBox s={[0.24, 0.09, 0.016]} r={0.008}>{M.pvc({ col: "#b8302a" })}</RBox>
        <Sheet map={txt("hpw", ["$412"], { w: 320, h: 120, bg: "#b8302a", fg: "#fff4e6", size: 100 })} w={0.23} h={0.085} p={[0, 0, 0.0085]} />
        <mesh position={[0, 0, 0.012]} rotation={[0, 0, -1.1]} scale={[1, Math.max(0.001, cut), 1]}><planeGeometry args={[0.004, 0.13]} /><meshBasicMaterial color="#ffffff" /></mesh>
      </group> : <>
        <group position={[-0.06 - drop * 0.05, -drop * 0.3, drop * 0.05]} rotation={[0, 0, drop * 1.1]}>
          <RBox s={[0.12, 0.09, 0.016]} r={0.006}>{M.pvc({ col: "#b8302a" })}</RBox>
          <Sheet map={txt("hp1", ["$4"], { w: 160, h: 120, bg: "#b8302a", fg: "#fff4e6", size: 100 })} w={0.115} h={0.085} p={[0, 0, 0.0085]} />
        </group>
        <group position={[0.06 - turn * 0.06, 0, 0]} rotation={[0, turn * PI * 2, 0]} scale={1 + turn * 0.25}>
          <RBox s={[0.12 + turn * 0.06, 0.09, 0.016]} r={0.006}>{M.pvc({ col: turn > 0.5 ? "#2e8b57" : "#b8302a" })}</RBox>
          <Sheet map={turn > 0.5 ? txt("hp3", ["$248"], { w: 240, h: 120, bg: "#2e8b57", fg: "#ffffff", size: 96 }) : txt("hp2", ["12"], { w: 160, h: 120, bg: "#b8302a", fg: "#fff4e6", size: 100 })} w={0.115 + turn * 0.06} h={0.085} p={[0, 0, 0.0085]} />
        </group>
      </>}
    </group>
  </>;
}}</Scene3D>;

// ---- 2:10 · $20-35 POR DÍA: día tras día la torre de la protección crece hasta pasar la del auto ----
export const HDailyMeter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="dark"
  cam={{ at: [0, 0.09, 0], az: [-0.2, 0.08], el: [0.2, 0.17], r: [0.52, 0.47], fov: 30 }}>{(tt) => {
  const days = Math.min(7, Math.floor(eio(tt, 0.8, 4.2) * 7.99));
  return <>
    <group position={[-0.12, 0, 0]}>
      <Car p={[0, 0.09, -0.02]} s={0.7 * pop(tt, 0.1)} col="#2f6fb0" />
      {Array.from({ length: 7 }, (_, i) => <Coin key={i} p={[0, 0.006 + i * 0.012, -0.02]} s={1.4 * pop(tt, 0.2 + i * 0.05)} />)}
      
    </group>
    <group position={[0.1, 0, 0]}>
      {Array.from({ length: 7 }, (_, i) => <group key={i} position={[0, 0.008 + i * 0.016 + (i < days ? fallY(tt, 0.8 + i * 0.49, 0.25) : 5), -0.02]}><Coin s={1.4} col="#c9453a" /></group>)}
      {Array.from({ length: 7 }, (_, i) => <mesh key={"d" + i} position={[-0.05 + i * 0.017, 0.006, 0.08]} scale={i < days ? 1 : 0.001}><boxGeometry args={[0.013, 0.01, 0.013]} />{M.plastic({ col: "#f2d23a" })}</mesh>)}
      <group position={[0.062, 0.03, 0.02]} rotation={[0, -0.3, 0]} scale={pop(tt, 0.6)}><mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.03, 0.03, 0.008, 6]} />{M.pvc({ col: "#b8302a" })}</mesh><Sheet map={txt("dmsh", ["$35", "A DAY"], { w: 160, h: 140, bg: "#b8302a", fg: "#fff4e6", size: 50, lh: 60 })} w={0.06} h={0.052} p={[0, 0.06, 0.0]} /></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 2:40 · CUBIERTA DOS VECES: el auto ya tiene dos paraguas (póliza y tarjeta) y le bajan un tercero de $300 que rebota ----
export const HTwiceCover: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="none" bg="#d6dfe6"
  cam={{ at: [0, 0.1, 0], az: [-0.2, 0.12], el: [0.24, 0.2], r: [0.66, 0.6], fov: 30 }}>{(tt) => {
  const bounce = phys(tt, 2.4, 7, 0.3), out = eio(tt, 3.0, 3.8);
  return <>
    <Car s={1.2 * pop(tt, 0.1)} col="#f2f2ee" />
    <Umbrella col="#2f6fb0" p={[-0.07, 0, -0.03]} r={[0, 0, 0.2]} s={pop(tt, 0.5)} open={eio(tt, 0.5, 1.0)} />
    <Umbrella col="#2e8b57" p={[0.07, 0, -0.03]} r={[0, 0, -0.2]} s={pop(tt, 1.0)} open={eio(tt, 1.0, 1.5)} />
        <group position={[lerp(0, 0.6, out), lerp(0.5, 0.06, eio(tt, 1.6, 2.4)) + 0.03 * Math.sin(bounce * 6) * (1 - out), 0.0]} rotation={[0, 0, out * -1.2]}>
      <Umbrella col="#b8302a" s={1.1} />
      <PriceTag lines={["$300"]} col="#b8302a" fg="#fff4e6" p={[0.0, 0.08, 0.05]} s={0.8} />
    </group>
  </>;
}}</Scene3D>;

// ---- 3:05 · DOS LLAMADAS: dos teléfonos vibran sobre la mesa; cada respuesta queda sellada en la tarjeta de la billetera ----
export const HTwoCalls: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood"
  cam={{ at: [0, 0.1, 0.02], az: [-0.12, 0.08], el: [0.3, 0.26], r: [0.74, 0.68], fov: 30 }}>{(tt) => {
  const ring1 = tt > 0.5 && tt < 1.5 ? Math.sin(tt * 45) * 0.06 : 0, ring2 = tt > 1.7 && tt < 2.7 ? Math.sin(tt * 45) * 0.06 : 0;
  const s1 = pop(tt, 1.5, 9, 0.35), s2 = pop(tt, 2.7, 9, 0.35);
  return <>
    <Phone map={txt("tc1c", ["☎", "CAR", "INSUR-", "ANCE"], { w: 200, h: 400, bg: "#1d2f5a", fg: "#ffffff", size: 58, lh: 90 })} p={[-0.16, 0.1, -0.04]} r={[-0.25, 0.25, ring1]} s={1.25 * pop(tt, 0.2)} />
    <Phone map={txt("tc2c", ["☎", "CREDIT", "CARD", ""], { w: 200, h: 400, bg: "#2e8b57", fg: "#ffffff", size: 58, lh: 90 })} p={[0.16, 0.1, -0.04]} r={[-0.25, -0.25, ring2]} s={1.25 * pop(tt, 0.4)} />
    {[[-0.16, 0.5], [0.16, 1.7]].map(([x, a]) => [0, 1, 2].map((j) => { const k = ((tt - a - j * 0.33) % 1 + 1) % 1, on = tt > a + j * 0.33 && tt < a + 1.0; return <mesh key={x + "r" + j} visible={on} position={[x, 0.1, -0.05]} rotation={[-0.25, x > 0 ? -0.25 : 0.25, 0]} scale={0.05 + k * 0.12}><torusGeometry args={[1, 0.035, 8, 40]} /><meshBasicMaterial color={x < 0 ? "#7fb2ff" : "#7cff8a"} transparent opacity={0.55 * (1 - k)} /></mesh>; }))}
    <group position={[0, 0.006, 0.09]} rotation={[-PI / 2, 0, 0]} scale={pop(tt, 0.6) * 1.3}>
      <RBox s={[0.15, 0.09, 0.003]} r={0.006}>{M.plastic({ col: "#fffdf4" })}</RBox>
      <Sheet map={txt("tcc1b", ["POLICY ✓"], { w: 320, h: 80, bg: "#1d2f5a", fg: "#ffffff", size: 54 })} w={0.12} h={0.03} p={[0, 0.02, 0.002]} s={Math.max(0.001, s1)} />
      <Sheet map={txt("tcc2b", ["CARD ✓"], { w: 320, h: 80, bg: "#2e8b57", fg: "#ffffff", size: 54 })} w={0.12} h={0.03} p={[0, -0.02, 0.002]} s={Math.max(0.001, s2)} />
    </group>
  </>;
}}</Scene3D>;

// ---- 4:05 · GASOLINA DE REGALO: el tanque vuelve a la mitad y esa mitad se va en una caja de regalo con moño ----
export const HFuelTank: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0.02, 0.1, 0], az: [-0.2, 0.08], el: [0.2, 0.16], r: [0.6, 0.55], fov: 30 }}>{(tt) => {
  const lvl = 1 - 0.5 * eio(tt, 0.6, 1.6), gift = eio(tt, 1.9, 2.8);
  return <>
    <group position={[-0.1, 0, 0]} scale={pop(tt, 0.1)}>
      <mesh position={[0, 0.1, 0]}><boxGeometry args={[0.12, 0.2, 0.08]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.005 + 0.095 * lvl, 0]} scale={[1, lvl, 1]}><boxGeometry args={[0.115, 0.19, 0.075]} /><meshStandardMaterial color="#e8b03a" roughness={0.2} transparent opacity={0.85} /></mesh>
      <mesh position={[0, 0.21, 0]}><cylinderGeometry args={[0.015, 0.015, 0.02, 20]} />{M.plastic({ col: "#b8302a" })}</mesh>
    </group>
    <group position={[0.11, 0, 0.0]}>
      <group position={[lerp(-0.1, 0, gift), 0.05 * (1 - gift), 0]} scale={Math.max(0.001, gift)}>
        <RBox s={[0.12, 0.1, 0.1]} p={[0, 0.05, 0]} r={0.006}>{M.pvc({ col: "#2f6fb0" })}</RBox>
        <mesh position={[0, 0.05, 0]}><boxGeometry args={[0.122, 0.102, 0.02]} />{M.pvc({ col: "#f2d23a" })}</mesh>
        <mesh position={[0, 0.05, 0]}><boxGeometry args={[0.02, 0.102, 0.102]} />{M.pvc({ col: "#f2d23a" })}</mesh>
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.018, 0.11, 0]} rotation={[0, 0, s * 0.6]} scale={[1, 0.6, 0.5]}><torusGeometry args={[0.016, 0.006, 8, 20]} />{M.pvc({ col: "#f2d23a" })}</mesh>)}
      </group>
      <PriceTag lines={["$0 BACK"]} col="#b8302a" fg="#fff4e6" p={[0.0, 0.2, 0.0]} s={pop(tt, 3.0) * 0.9} />
    </group>
  </>;
}}</Scene3D>;

const Pump: React.FC<{ id: string; price: string; col: string; p?: number[]; s?: number }> = ({ id, price, col, p = [0, 0, 0], s = 1 }) =>
  <group position={p as [number, number, number]} scale={s}>
    <RBox s={[0.07, 0.16, 0.05]} p={[0, 0.08, 0]} r={0.008}>{M.pvc({ col })}</RBox>
    <RBox s={[0.055, 0.035, 0.005]} p={[0, 0.125, 0.026]} r={0.003}>{M.plastic({ col: "#141414" })}</RBox>
    <Sheet map={txt("pp" + id, [price], { w: 200, h: 100, bg: "#141414", fg: "#7cff8a", size: 64 })} w={0.05} h={0.025} p={[0, 0.125, 0.029]} />
    <mesh position={[0.04, 0.07, 0.0]}><boxGeometry args={[0.012, 0.04, 0.02]} />{M.rubber({ col: "#222" })}</mesh>
  </group>;

// ---- 5:10 · LA BOMBA A 5 MILLAS: junto al aeropuerto el galón es caro; el autito sigue hasta la de afuera y sale el ticket ----
export const HPumpMiles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="none" bg="#cfd9e2"
  cam={{ at: [0.02, 0.11, 0], az: [-0.18, -0.06], el: [0.4, 0.36], r: [0.84, 0.78], fov: 30 }}>{(tt) => {
  const x = lerp(-0.34, 0.16, eio(tt, 0.8, 2.6)) + 0.012 * (1 - phys(tt, 2.6, 9, 0.35)), rc = eio(tt, 3.0, 4.2);
  return <>
    <mesh position={[0, 0.001, 0.07]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.8, 0.07]} />{M.matte({ col: "#3a3d42" })}</mesh>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.36 + i * 0.09, 0.002, 0.07]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.04, 0.004]} />{M.matte({ col: "#f2f2ee" })}</mesh>)}
    <Pump id="air" price="$5.29" col="#b8302a" p={[-0.14, 0, -0.03]} s={pop(tt, 0.2)} />
    <Sheet map={txt("pmair", ["NEXT TO AIRPORT"], { w: 480, h: 72, bg: "#cfd9e2", fg: "#b8302a", size: 40 })} w={0.2} h={0.03} p={[-0.14, 0.21, -0.03]} s={pop(tt, 0.3)} />
    <Pump id="out" price="$3.19" col="#2e8b57" p={[0.16, 0, -0.03]} s={pop(tt, 0.5)} />
    <Sheet map={txt("pmout", ["5 MILES OUT"], { w: 480, h: 72, bg: "#cfd9e2", fg: "#2e8b57", size: 40 })} w={0.2} h={0.03} p={[0.16, 0.21, -0.03]} s={pop(tt, 0.6)} />
    <Car p={[x, 0, 0.07]} s={0.8} col="#f2f2ee" />
    <group position={[0.16, 0.002, 0.03 + 0.07 * rc]} rotation={[-PI / 2, 0, 0]} scale={[1, Math.max(0.001, rc), 1]}>
      <Sheet map={txt("pmrc", ["RECEIPT", "FULL TANK", "$3.19 / GAL", "SAVED $21"], { w: 200, h: 440, bg: "#fffdf4", size: 30, lh: 90, cols: ["#1d2f5a", "#555", "#2e8b57", "#2e8b57"] })} w={0.07} h={0.15} />
    </group>
  </>;
}}</Scene3D>;

// ---- 6:20 · $2 DE PEAJE, $50 DE CARGOS: una moneda de peaje y nueve días que tiran cada uno su cargo ----
export const HTollFee: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0.02, 0.08, 0], az: [-0.22, 0.1], el: [0.3, 0.26], r: [0.64, 0.58], fov: 30 }}>{(tt) => {
  const n = Math.min(9, Math.floor(eio(tt, 0.9, 3.6) * 9.99)), v = Math.round(2 + n * 5.7);
  return <>
    <group position={[-0.17, 0, 0.04]} scale={pop(tt, 0.2)}>
      <Coin p={[0, 0.006, 0]} s={1.8} />
      <PriceTag lines={["1 TOLL", "$2"]} p={[0, 0.08, 0]} s={0.8} />
    </group>
    {Array.from({ length: 9 }, (_, i) => <group key={i} position={[-0.06 + (i % 5) * 0.045, (i < n ? fallY(tt, 0.9 + i * 0.3, 0.3) : 5) + 0.012 + Math.floor(i / 5) * 0.03, 0.02 - Math.floor(i / 5) * 0.05]}>
      <RBox s={[0.04, 0.024, 0.03]} r={0.004}>{M.pvc({ col: "#b8302a" })}</RBox>
      <Sheet map={txt("tfd" + i, ["DAY " + (i + 1)], { w: 128, h: 64, bg: "#b8302a", fg: "#fff4e6", size: 36 })} w={0.036} h={0.018} p={[0, 0.0125, 0]} r={[-PI / 2, 0, 0]} />
    </group>)}
    <Drums id="tf" v={v} n={2} p={[0.18, 0.1, -0.06]} s={1.1 * pop(tt, 0.4)} />
  </>;
}}</Scene3D>;

// ---- 6:50 · EVITAR PEAJES: la ruta se bifurca, el pórtico del peaje queda solo y el autito toma el camino de al lado ----
export const HAvoidTolls: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#cfdcc8" warm={0.9}
  cam={{ at: [-0.03, 0.03, 0], az: [-0.3, -0.1], el: [0.62, 0.56], r: [0.8, 0.74], fov: 30 }}>{(tt) => {
  const k = eio(tt, 1.2, 3.6);
  const path = [[-0.3, 0.004, 0.12], [-0.12, 0.004, 0.12], [0.0, 0.004, 0.2], [0.14, 0.004, 0.17], [0.24, 0.004, 0.08]];
  const i = Math.min(3, Math.floor(k * 4)), f = k * 4 - i, a = path[i], b = path[i + 1];
  return <>
    <mesh position={[0, -0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.2, 0.8]} />{M.matte({ col: "#8fb27a" })}</mesh>
    <mesh position={[0, 0.001, 0.0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.7, 0.07]} />{M.matte({ col: "#3a3d42" })}</mesh>
    <mesh geometry={tubeG("avt", path.map((p) => [p[0], 0, p[2]]), 0.02, 80, 8)} scale={[1, 0.05, 1]}>{M.matte({ col: "#55595f" })}</mesh>
    <group position={[0.06, 0, 0]} scale={pop(tt, 0.3)}>
      {[-1, 1].map((s) => <mesh key={s} position={[0, 0.05, s * 0.045]}><boxGeometry args={[0.01, 0.1, 0.01]} />{M.steel({})}</mesh>)}
      <RBox s={[0.02, 0.025, 0.1]} p={[0, 0.1, 0]} r={0.004}>{M.pvc({ col: "#b8302a" })}</RBox>
      <Sheet map={txt("avtl", ["TOLL"], { w: 160, h: 64, bg: "#b8302a", fg: "#fff", size: 46 })} w={0.06} h={0.024} p={[-0.011, 0.1, 0]} r={[0, -PI / 2, 0]} />
    </group>
    <Car p={[lerp(a[0], b[0], f), 0.004, lerp(a[2], b[2], f)]} r={[0, -Math.atan2(b[2] - a[2], b[0] - a[0]), 0]} s={0.7 * pop(tt, 0.5)} col="#f2f2ee" />
    <Phone map={txt("avtp", ["", "AVOID", "TOLLS", "", "ON ●"], { w: 200, h: 400, bg: "#2e8b57", fg: "#ffffff", size: 40, lh: 56 })} p={[-0.2, 0.12, 0.0]} r={[-0.9, 0.3, 0]} s={1.3 * pop(tt, 0.8)} />
  </>;
}}</Scene3D>;

// ---- 7:30 · $150 POR UNA PANTALLITA: el GPS con su tambor de $150 se corre a un lado y el teléfono con el mapa ocupa su lugar con $0 ----
export const HGpsVsPhone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="dark"
  cam={{ at: [0, 0.16, 0], az: [-0.1, 0.06], el: [0.14, 0.12], r: [1.06, 1.0], fov: 30 }}>{(tt) => {
  const v = Math.round(150 * eio(tt, 0.5, 2.0)), out = eio(tt, 2.4, 3.1) + 0.03 * (1 - phys(tt, 3.1, 9, 0.35)), ph = pop(tt, 2.9);
  return <>
    <group position={[lerp(0, -0.24, out), 0, -0.06 * out]} rotation={[0, out * 0.6, 0]} scale={pop(tt, 0.1) * (1.15 - 0.55 * out)}>
      <RBox s={[0.18, 0.11, 0.025]} p={[0, 0.1, 0]} r={0.01}>{M.plastic({ col: "#1b1d22" })}</RBox>
      <Sheet map={txt("gpsc2", ["◄ 0.3 mi"], { w: 256, h: 160, bg: "#3d6a8a", fg: "#ffffff", size: 54 })} w={0.16} h={0.09} p={[0, 0.1, 0.0135]} em={0.6} />
      <mesh position={[0, 0.03, -0.01]}><cylinderGeometry args={[0.006, 0.006, 0.07, 10]} />{M.chrome({})}</mesh>
      <Drums id="gps2" v={v} n={3} p={[0, 0.2, 0]} s={0.9} />
    </group>
    <group position={[lerp(0.34, 0.07, eio(tt, 2.9, 3.6)), 0.0, 0.06]} scale={Math.max(0.001, ph) * 1.4}>
      <Phone map={txt("gpsph3", ["", "▲", "TURN", "RIGHT", "FREE"], { w: 200, h: 400, bg: "#2e8b57", fg: "#ffffff", size: 62, lh: 76 })} p={[0, 0.09, 0]} s={1.05} />
      <Drums id="gps0" v={0} n={1} p={[0, 0.2, 0]} s={0.85} fg="#7cff8a" />
    </group>
  </>;
}}</Scene3D>;

