// lin29e · componentes 25-37 (sitios de reservas)
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, eio, lerp, phys, rn } from "./h3d";
import { Coin, HANDF, PI, PriceTag, Sheet, fallY, pop, txt } from "./lkit3d";
import { Phone, Sea } from "./lkit_b";
import { Drums, Laptop, Mug, Notepad } from "./heroes_e1";

// ---- 13:23 · EL CÓDIGO POR MENSAJE: el celular muestra el código; el tubo del teléfono se levanta y se cuelga de un golpe ----
export const HSmsCode: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0, 0.1, 0], az: [-0.16, 0.08], el: [0.2, 0.17], r: [0.62, 0.56], fov: 30 }}>{(tt) => {
  const up = eio(tt, 0.6, 1.2) * (1 - eio(tt, 2.6, 2.9)), slam = 1 - phys(tt, 2.9, 12, 0.3) * 0, shake = tt > 2.9 && tt < 3.3 ? Math.sin(tt * 60) * 0.004 : 0;
  return <>
    <Phone map={txt("smph", ["CODE", "482 913", "", "don't share"], { w: 200, h: 400, bg: "#22252b", fg: "#ffffff", size: 44, lh: 76, cols: ["#9a9ea6", "#f2d23a", "#fff", "#ff8a78"] })} p={[-0.13, 0.1, 0]} r={[-0.15, 0.25, 0]} s={1.15 * pop(tt, 0.1)} />
    <group position={[0.1, shake, 0]} scale={pop(tt, 0.3) * slam}>
      <RBox s={[0.16, 0.05, 0.12]} p={[0, 0.025, 0]} r={0.016}><meshPhysicalMaterial color="#f1ece0" roughness={0.3} clearcoat={0.8} /></RBox>
      {[-0.05, 0.05].map((x) => <RBox key={x} s={[0.03, 0.016, 0.04]} p={[x, 0.055, 0]} r={0.006}>{M.plastic({ col: "#d6d0c2" })}</RBox>)}
      <group position={[0, 0.075 + 0.12 * up, 0.01 * up]} rotation={[0.5 * up, 0, 0.3 * up]}>
        <RBox s={[0.16, 0.022, 0.03]} r={0.01}>{M.plastic({ col: "#e9e4d8" })}</RBox>
        {[-0.065, 0.065].map((x) => <RBox key={x} s={[0.035, 0.03, 0.035]} p={[x, -0.012, 0]} r={0.01}>{M.plastic({ col: "#e9e4d8" })}</RBox>)}
      </group>
    </group>
    <group position={[0.1, 0.19, 0.03]} scale={pop(tt, 3.0) * 0.75}><PriceTag lines={["HANG UP"]} col="#b8302a" fg="#fff4e6" /></group>
  </>;
}}</Scene3D>;

// ---- 14:11 · LOS NÚMEROS EN ROJO: la lapicera encierra el teléfono real en la hoja impresa y la hoja entra al sobre de viaje ----
export const HRedCircles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#e7e0cf" warm={0.9}
  cam={{ at: [0.02, 0.03, 0.01], az: [-0.1, 0.08], el: [0.86, 0.8], r: [0.6, 0.55], fov: 30 }}>{(tt) => {
  const ring = eio(tt, 0.6, 1.6), slide = eio(tt, 2.2, 3.2);
  return <>
    <group position={[0.07, 0.003, 0.0]} scale={pop(tt, 0.1)}>
      <RBox s={[0.2, 0.012, 0.14]} p={[0, 0.0, 0]} r={0.004}>{M.matte({ col: "#d9c8a0" })}</RBox>
      <Sheet map={txt("rcenv", ["TRAVEL", "MAINE · MAY"], { w: 320, h: 200, bg: "#d9c8a0", fg: "#6b4f3a", size: 54, lh: 70, font: "italic 700 {s}px Georgia" })} w={0.16} h={0.1} p={[0, 0.0065, 0.0]} r={[-PI / 2, 0, 0]} />
    </group>
    <group position={[lerp(-0.12, 0.07, slide), 0.012 + 0.012 * slide, lerp(0.02, -0.01, slide)]} rotation={[0, slide * 0.1, 0]} scale={(1 - 0.35 * slide) * pop(tt, 0.2)}>
      <Sheet map={txt("rcpg", ["CONFIRMATION", "Harbor Hotel", "3 nights · $612", "CALL", "(207) 555-0142"], { w: 300, h: 400, bg: "#fdfbf4", size: 32, lh: 70, cols: ["#1d2f5a", "#555", "#555", "#b8302a", "#1d2f5a"] })} w={0.15} h={0.2} r={[-PI / 2, 0, 0]} />
      <mesh position={[0, 0.001, 0.065]} rotation={[-PI / 2, 0, 0]} scale={[1.4, 0.55, 1]} visible={ring > 0.01}><ringGeometry args={[0.05, 0.055, 64, 1, 0, ring * 2 * PI]} /><meshBasicMaterial color="#c9302a" /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 15:19 · DOS NÚMEROS: en la libreta "PACKAGE" y "SEPARATE"; un "<" gigante cae entre los dos y gana el más chico ----
export const HPackageMath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0, 0.07, 0.02], az: [-0.12, 0.08], el: [0.46, 0.4], r: [0.62, 0.56], fov: 30 }}>{(tt) => {
  const gt = fallY(tt, 1.8, 0.3), win = eio(tt, 2.6, 3.2);
  const Card = ({ x, l, v, col, a }: { x: number; l: string; v: string; col: string; a: number }) => <group position={[x, 0.04, 0]} rotation={[-0.5, 0, 0]} scale={pop(tt, a)}>
    <RBox s={[0.15, 0.1, 0.008]} r={0.008}>{M.matte({ col: "#fbf6e6" })}</RBox>
    <Sheet map={txt("pm" + l, [l, v], { w: 320, h: 220, bg: "#fbf6e6", size: 44, lh: 96, font: "italic 700 {s}px Georgia", cols: ["#555", col] })} w={0.14} h={0.096} p={[0, 0, 0.0045]} />
  </group>;
  return <>
    <Card x={-0.12} l="PACKAGE" v="$1,960" col="#b8302a" a={0.1} />
    <Card x={0.12} l="SEPARATE" v="$1,812" col="#2e8b57" a={0.5} />
    <group position={[0, 0.06 + gt, 0.0]} visible={tt > 1.8}>
      <mesh rotation={[0, 0, 0.5]} position={[0.0, 0.018, 0]}><boxGeometry args={[0.05, 0.012, 0.012]} />{M.pvc({ col: "#1d2f5a" })}</mesh>
      <mesh rotation={[0, 0, -0.5]} position={[0.0, -0.018, 0]}><boxGeometry args={[0.05, 0.012, 0.012]} />{M.pvc({ col: "#1d2f5a" })}</mesh>
    </group>
    <mesh position={[0.12, 0.045, 0.03]} rotation={[-0.5, 0, 0]} scale={Math.max(0.001, win)}><ringGeometry args={[0.085, 0.092, 64]} /><meshBasicMaterial color="#2e8b57" /></mesh>
  </>;
}}</Scene3D>;

// ---- 15:33 · LA COMISIÓN: la torta del precio pierde una tajada que se va al sitio; si llamás, la tajada vuelve como desayuno ----
export const HCommission: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="dark"
  cam={{ at: [0.02, 0.08, 0], az: [-0.18, 0.06], el: [0.34, 0.3], r: [0.72, 0.66], fov: 30 }}>{(tt) => {
  const go = eio(tt, 0.9, 1.9), back = eio(tt, 2.6, 3.6);
  const sx = lerp(lerp(-0.1, 0.17, go), -0.1, back), sy = 0.03 + Math.sin(go * PI) * 0.08 + Math.sin(back * PI) * 0.08;
  return <>
    <group position={[-0.1, 0.03, 0]} scale={pop(tt, 0.1)}>
      <mesh rotation={[0, 0.6, 0]}><cylinderGeometry args={[0.09, 0.09, 0.03, 48, 1, false, 0, PI * 1.6]} /><meshPhysicalMaterial color="#e8b53a" roughness={0.3} clearcoat={0.6} /></mesh>
      <Sheet map={txt("cmh", ["HOTEL"], { w: 256, h: 64, bg: "#22252b", fg: "#f2d23a", size: 48 })} w={0.1} h={0.025} p={[0, 0.09, 0]} />
    </group>
    <group position={[sx, sy, 0]} rotation={[0, 0.6 + go * 2, 0]}>
      <mesh visible={back < 0.5}><cylinderGeometry args={[0.09, 0.09, 0.03, 24, 1, false, PI * 1.6, PI * 0.4]} /><meshPhysicalMaterial color="#c9302a" roughness={0.3} clearcoat={0.6} /></mesh>
      <group visible={back >= 0.5} position={[0.05, 0, 0.03]}>
        <mesh><cylinderGeometry args={[0.05, 0.04, 0.008, 32]} />{M.porcelain({})}</mesh>
        <mesh position={[0, 0.012, 0]} rotation={[0, 0, 0.3]} scale={[1, 0.55, 0.6]}><sphereGeometry args={[0.024, 20, 14]} /><meshStandardMaterial color="#c88a3a" roughness={0.6} /></mesh>
      </group>
    </group>
    <Laptop p={[0.2, 0, -0.04]} r={[0, -0.4, 0]} s={0.75 * pop(tt, 0.4)} map={txt("cmweb", ["BOOKING", "SITE", "+15%"], { w: 384, h: 240, bg: "#7a5a8a", fg: "#ffffff", size: 50, lh: 66 })} />
  </>;
}}</Scene3D>;

// ---- 16:07 · LA FRASE MÁGICA: sobre el mostrador del hotel el precio queda igual y caen el desayuno y el cartel de parking ----
export const HMatchAsk: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="wood"
  cam={{ at: [0.01, 0.09, 0], az: [-0.14, 0.08], el: [0.2, 0.17], r: [0.58, 0.53], fov: 30 }}>{(tt) => {
  const ring = tt > 0.5 && tt < 1.3 ? Math.sin(tt * 45) * 0.05 : 0;
  return <>
    <group scale={pop(tt, 0.1)}>
      <mesh position={[-0.17, 0.012, 0.03]}><cylinderGeometry args={[0.03, 0.035, 0.012, 32]} />{M.brass({})}</mesh>
      <mesh position={[-0.17, 0.03, 0.03]}><sphereGeometry args={[0.028, 32, 16, 0, PI * 2, 0, PI / 2]} />{M.brass({})}</mesh>
      <Phone map={txt("mtph", ["", "FRONT", "DESK"], { w: 200, h: 400, bg: "#1d2f5a", fg: "#ffffff", size: 54, lh: 80 })} p={[-0.06, 0.1, -0.03]} r={[0, 0.2, ring]} s={0.8} />
    </group>
    <group position={[0.03, 0.17, -0.04]} scale={pop(tt, 0.6) * 0.85}><PriceTag lines={["SAME", "$612"]} col="#1d2f5a" fg="#ffffff" /></group>
    <group position={[0.06, fallY(tt, 1.8, 0.25), 0.06]} visible={tt > 1.8} scale={1.35}>
      <mesh position={[0, 0.004, 0]}><cylinderGeometry args={[0.05, 0.042, 0.008, 32]} />{M.porcelain({})}</mesh>
      <mesh position={[-0.015, 0.016, 0]} rotation={[0, 0, 0.3]} scale={[1, 0.55, 0.6]}><sphereGeometry args={[0.022, 20, 14]} /><meshStandardMaterial color="#c88a3a" roughness={0.6} /></mesh>
      <Mug p={[0.02, 0.008, -0.01]} s={0.6} />
    </group>
    <group position={[0.17, fallY(tt, 2.5, 0.3), 0.0]} visible={tt > 2.5} scale={1.15}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.003, 0.003, 0.12, 8]} />{M.steel({})}</mesh>
      <RBox s={[0.06, 0.06, 0.006]} p={[0, 0.12, 0]} r={0.008}>{M.pvc({ col: "#2f6fb0" })}</RBox>
      <Sheet map={txt("mtP", ["P"], { w: 128, h: 128, bg: "#2f6fb0", fg: "#ffffff", size: 110 })} w={0.05} h={0.05} p={[0, 0.12, 0.0035]} />
      <group position={[0, 0.06, 0.01]} scale={pop(tt, 3.0) * 0.55}><PriceTag lines={["FREE"]} col="#2e8b57" fg="#ffffff" /></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 16:39 · $190 DE REGALO: el tambor cuenta de 0 a 190 mientras se apilan tazas de desayuno y fichas de parking ----
export const HExtras190: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark"
  cam={{ at: [0, 0.1, 0], az: [-0.2, 0.08], el: [0.22, 0.19], r: [0.72, 0.66], fov: 30 }}>{(tt) => {
  const nb = Math.min(6, Math.floor(eio(tt, 0.6, 2.4) * 6.99)), np = Math.min(3, Math.floor(eio(tt, 2.0, 3.2) * 3.99));
  const v = nb * 18 + np * 25;
  return <>
    <group position={[-0.17, 0, 0]}>
      {Array.from({ length: nb }, (_, i) => <group key={i} position={[(i % 3) * 0.06 - 0.06, Math.floor(i / 3) * 0.07 + fallY(tt, 0.6 + i * 0.3, 0.2), (i % 2) * 0.02]}><Mug s={1.1} /></group>)}
      <group position={[0, 0.2, 0]} scale={pop(tt, 0.4) * 0.6}><PriceTag lines={["BREAKFAST", "$18 x 2 x 3"]} col="#f6f1e4" fg="#1d2f5a" /></group>
    </group>
    <group position={[0.08, 0, 0.02]}>
      {Array.from({ length: np }, (_, i) => <group key={i} position={[0, 0.008 + i * 0.016 + fallY(tt, 2.0 + i * 0.4, 0.2), 0]}>
        <mesh><cylinderGeometry args={[0.035, 0.035, 0.014, 32]} />{M.pvc({ col: "#2f6fb0" })}</mesh>
        <Sheet map={txt("e19P", ["P"], { w: 96, h: 96, bg: "#2f6fb0", fg: "#ffffff", size: 80 })} w={0.04} h={0.04} p={[0, 0.0075, 0]} r={[-PI / 2, 0, 0]} />
      </group>)}
      <group position={[0, 0.14, 0]} scale={pop(tt, 2.0) * 0.6}><PriceTag lines={["PARKING", "$25 x 3"]} col="#f6f1e4" fg="#1d2f5a" /></group>
    </group>
    <Drums id="e19" v={v} n={3} p={[0.03, 0.22, -0.08]} s={1.15 * pop(tt, 0.3)} fg="#7cff8a" />
  </>;
}}</Scene3D>;

// ---- 17:46 · LA FOTO DE LA ÚLTIMA PANTALLA: flash, y de la notebook sale una instantánea con el total que cae en la carpeta PROOF ----
export const HScreenPolaroid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0.02, 0.12, 0], az: [-0.18, 0.06], el: [0.2, 0.17], r: [0.72, 0.66], fov: 30 }}>{(tt) => {
  const flash = Math.max(0, 1 - Math.abs(tt - 1.0) * 5), out = eio(tt, 1.2, 2.2), drop = eio(tt, 2.4, 3.2);
  return <>
    <pointLight position={[-0.08, 0.2, 0.25]} intensity={flash * 2.5} distance={1.2} color="#ffffff" />
    <mesh position={[-0.08, 0.13, 0.06]} scale={Math.max(0.001, flash) * 0.25}><circleGeometry args={[1, 32]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85 * flash} /></mesh>
    <Laptop p={[-0.08, 0, 0]} s={1.0 * pop(tt, 0.1)} em={0.35 + flash * 2} map={txt("spl", ["TOTAL $612", "free cancel", "until May 14"], { w: 384, h: 240, bg: "#eef3f7", size: 48, lh: 70, cols: ["#1d2f5a", "#2e8b57", "#555"] })} />
    <group position={[lerp(-0.08, 0.15, out), lerp(0.12, 0.2, out) - drop * 0.18, lerp(0.0, 0.05, out)]} rotation={[-drop * 1.3, 0, -0.2 * out]} scale={Math.max(0.001, out) * 1.5}>
      <RBox s={[0.1, 0.12, 0.003]} r={0.003}>{M.matte({ col: "#fbfaf6" })}</RBox>
      <Sheet map={txt("splph", ["TOTAL $612", "free cancel"], { w: 256, h: 200, bg: "#dfe8ef", fg: "#1d2f5a", size: 38, lh: 64 })} w={0.086} h={0.07} p={[0, 0.012, 0.002]} />
    </group>
    <group position={[0.15, 0.004, 0.07]} scale={pop(tt, 2.0) * 1.35}>
      <RBox s={[0.15, 0.008, 0.11]} r={0.004}>{M.matte({ col: "#b8302a" })}</RBox>
      <Sheet map={txt("splf", ["PROOF"], { w: 256, h: 80, bg: "#b8302a", fg: "#fff4e6", size: 56 })} w={0.1} h={0.03} p={[0, 0.0045, 0.035]} r={[-PI / 2, 0, 0]} />
    </group>
  </>;
}}</Scene3D>;

// ---- 18:33 · LA ESCALERA DE LA RUTINA: una bolita sube cinco escalones que se encienden: buscar, anotar, llamar, cancelar gratis, confirmar ----
export const HStepLadder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="none" bg="#dde4ea"
  cam={{ at: [0.0, 0.11, 0], az: [-0.3, -0.14], el: [0.2, 0.17], r: [0.84, 0.78], fov: 30 }}>{(tt) => {
  const S = [["SEARCH", "#3d6a8a"], ["WRITE", "#8a5a2b"], ["CALL", "#1d2f5a"], ["FREE CANCEL", "#2e6b4a"], ["CONFIRM", "#b8302a"]];
  const k = eio(tt, 0.6, 3.6) * 4, i0 = Math.floor(k), f = k - i0;
  const bx = -0.2 + (i0 + f) * 0.1, by = 0.03 + (i0 + 1) * 0.04 + Math.sin(f * PI) * 0.05 + (f > 0 ? 0 : 0);
  return <>
    {S.map(([l, c], i) => { const on = k >= i - 0.05; return <group key={i} position={[-0.2 + i * 0.1, 0, 0]} scale={pop(tt, 0.1 + i * 0.08)}>
      <RBox s={[0.095, 0.04 * (i + 1), 0.1]} p={[0, 0.02 * (i + 1), 0]} r={0.006}><meshPhysicalMaterial color={c} roughness={0.3} clearcoat={0.6} emissive={c} emissiveIntensity={on ? 0.35 : 0} /></RBox>
      <Sheet map={txt("sl" + i, [l], { w: 256, h: 64, bg: c, fg: "#ffffff", size: l.length > 8 ? 34 : 44 })} w={0.088} h={0.022} p={[0, 0.04 * (i + 1) - 0.016, 0.051]} />
    </group>; })}
    <mesh position={[bx, by + 0.012, 0]}><sphereGeometry args={[0.016, 20, 16]} /><meshPhysicalMaterial color="#f2d23a" roughness={0.2} clearcoat={1} emissive="#f2d23a" emissiveIntensity={0.3} /></mesh>
  </>;
}}</Scene3D>;

// ---- 19:32 · LEERLO EN VOZ ALTA: cada renglón de la hoja se ilumina mientras salen ondas de voz; nada se saltea ----
export const HReadAloud: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood"
  cam={{ at: [0, 0.12, 0], az: [-0.1, 0.06], el: [0.05, 0.04], r: [0.6, 0.55], fov: 30 }}>{(tt) => {
  const L = ["Dates: May 12-15", "Guests: 2", "Name: as on ID", "Cancel by May 9"], k = eio(tt, 0.6, 3.6) * 4;
  return <>
    <group position={[-0.05, 0.12, 0]} scale={pop(tt, 0.1)}>
      <RBox s={[0.2, 0.22, 0.004]} r={0.004}>{M.matte({ col: "#fdfbf4" })}</RBox>
      {L.map((l, i) => { const on = k > i, cur = k > i && k < i + 1; return <group key={i} position={[0, 0.06 - i * 0.045, 0.003]}>
        <mesh position={[0, 0, -0.0005]} scale={[on ? 1 : 0.001, 1, 1]}><planeGeometry args={[0.18, 0.034]} /><meshBasicMaterial color={cur ? "#ffe14a" : "#e7f3e6"} /></mesh>
        <Sheet map={txt("ra" + i + (on ? "y" : "n"), [(on ? "✓ " : "") + l], { w: 480, h: 80, bg: cur ? "#ffe14a" : on ? "#e7f3e6" : "#fdfbf4", fg: "#1d2f5a", size: 44, align: "left", pad: 12 })} w={0.18} h={0.03} />
      </group>; })}
    </group>
    <group position={[0.15, 0.12, 0.02]}>
      {[0, 1, 2].map((j) => { const q = ((tt * 1.4 + j / 3) % 1); return <mesh key={j} position={[0, 0, 0]} rotation={[0, -0.4, 0]} visible={tt > 0.6 && tt < 3.8} scale={0.02 + q * 0.07}><torusGeometry args={[1, 0.11, 8, 32, PI * 0.6]} /><meshBasicMaterial color="#e8822a" transparent opacity={0.8 * (1 - q)} /></mesh>; })}
      <group position={[0.03, 0, 0]} rotation={[0, 0.35, 0]} scale={1.35}>
        <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.04, 0.07, 32, 1, true]} /><meshPhysicalMaterial color="#e8822a" roughness={0.3} clearcoat={0.8} side={2} /></mesh>
        <mesh position={[-0.035, 0, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.04, 0.004, 10, 40]} />{M.plastic({ col: "#f6f1e4" })}</mesh>
        <mesh position={[0.045, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.022, 20]} />{M.plastic({ col: "#2a2c31" })}</mesh>
        <RBox s={[0.012, 0.04, 0.012]} p={[0.04, -0.025, 0]} r={0.004}>{M.plastic({ col: "#2a2c31" })}</RBox>
      </group>
    </group>
  </>;
}}</Scene3D>;

// ---- 20:36 · ¿TARIFA SENIOR?: tres precios cuelgan de un riel; la "SENIOR" no es la más baja y el aro verde va a otra ----
export const HSeniorRate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark"
  cam={{ at: [0, 0.14, 0], az: [-0.1, 0.08], el: [0.06, 0.05], r: [0.66, 0.6], fov: 30 }}>{(tt) => {
  const R = [["SENIOR", "$159", "#7a5a8a"], ["REGULAR", "$149", "#1d2f5a"], ["WEBSITE", "$152", "#3d6a8a"]], win = eio(tt, 2.6, 3.2);
  return <>
    <mesh position={[0, 0.27, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.6, 12]} />{M.brass({})}</mesh>
    {R.map(([a, b, c], i) => { const y = 0.16 + fallY(tt, 0.3 + i * 0.4, 0.25, 7, 0.3) * 0 - (1 - pop(tt, 0.3 + i * 0.4)) * 0.0; const sw = Math.sin(tt * 2.5 + i) * 0.05 * (1 - eio(tt, 0, 3));
      return <group key={i} position={[(i - 1) * 0.17, 0.27, 0]} rotation={[0, 0, sw]} scale={pop(tt, 0.3 + i * 0.4)}>
        <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.0012, 0.0012, 0.06, 6]} />{M.steel({})}</mesh>
        <group position={[0, -0.11, 0]}>
          <RBox s={[0.15, 0.1, 0.006]} r={0.008}><meshPhysicalMaterial color={c} roughness={0.35} clearcoat={0.5} /></RBox>
          <Sheet map={txt("srb" + i, [b, a], { w: 320, h: 220, bg: c, fg: "#ffffff", size: 80, lh: 100 })} w={0.14} h={0.096} p={[0, 0, 0.0035]} />
        </group>
      </group>; })}
    <mesh position={[0, 0.16, -0.004]} scale={Math.max(0.001, win)}><ringGeometry args={[0.095, 0.104, 64]} /><meshBasicMaterial color="#7cff8a" /></mesh>
    <group position={[-0.17, 0.05, 0.02]} scale={pop(tt, 3.0) * 0.6}><PriceTag lines={["ALWAYS", "ASK"]} col="#f2d23a" fg="#1d2f5a" /></group>
  </>;
}}</Scene3D>;

// ---- 21:21 · "SAVE 22%": las letras naranjas gigantes se rajan y caen; detrás quedan los dos números de la libreta ----
export const HSave22: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood"
  cam={{ at: [0, 0.07, 0.02], az: [-0.12, 0.08], el: [0.6, 0.52], r: [0.66, 0.6], fov: 30 }}>{(tt) => {
  const crack = eio(tt, 1.8, 2.0), blink = Math.sin(tt * 10) > 0 ? 1 : 0.4;
  return <>
    <Notepad id="s22" lines={["Package $980", "Separate $947", "+ water view", "+ breakfast"]} sz={40} p={[0, 0, 0.04]} r={[0, 0, 0]} s={1.25 * pop(tt, 1.6)} cols={["#b8302a", "#2e8b57", "#2e8b57", "#2e8b57"]} />
    {[[-0.08, "SAVE"], [0.0, "22"], [0.08, "%"]].map(([x, l], i) => { const k = Math.max(0, tt - 2.0 - i * 0.1);
      return <group key={i} position={[(x as number) + k * (i - 1) * 0.05, 0.14 - 0.5 * k * k * (crack > 0 ? 1 : 0), 0.02 - k * 0.06]} rotation={[k * 2, 0, (i - 1) * k * 2]} visible={0.14 - 0.5 * k * k > -0.05}>
        {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.019 * (1 + 2 * Math.min(1, k * 2)), 0, 0]} rotation={[0, 0, sd * Math.min(1, k * 2) * 0.5]}>
          <RBox s={[0.037, 0.08, 0.02]} p={[0, 0, 0]} r={0.006}><meshPhysicalMaterial color="#e8822a" roughness={0.25} clearcoat={1} /></RBox>
        </group>)}
        <Sheet map={txt("s22" + i, [l as string], { w: 200, h: 200, bg: "#e8822a", fg: "#ffffff", size: (l as string).length > 2 ? 64 : 120 })} w={0.07} h={0.07} p={[0, 0, 0.011]} s={pop(tt, 0.1 + i * 0.15) * (k > 0 ? 0.001 : 1)} />
        {crack > 0 && k <= 0 && <mesh position={[0, 0, 0.0125]} rotation={[0, 0, 0.2]} scale={[1, crack, 1]}><boxGeometry args={[0.003, 0.08, 0.001]} /><meshBasicMaterial color="#5a2a0a" /></mesh>}
      </group>; })}
    <group position={[0.2, 0.2, 0]} scale={pop(tt, 0.7) * 0.6 * (tt > 2.0 ? Math.max(0.001, 1 - (tt - 2.0) * 2) : 1)}><PriceTag lines={["ONLY 3", "LEFT!"]} col={blink > 0.5 ? "#c9302a" : "#7a2a2a"} fg="#ffffff" /></group>
  </>;
}}</Scene3D>;

// ---- 22:11 · UNA VENTANA LLENA DE MAR: las cortinas se abren y aparece el océano con el sol; en el alféizar, el desayuno ----
export const HOceanWindow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#bfd6e6" warm={0.95}
  cam={{ at: [0, 0.14, 0.1], az: [-0.08, 0.06], el: [0.06, 0.04], r: [0.62, 0.56], fov: 30 }}>{(tt) => {
  const op = eio(tt, 0.8, 2.2);
  return <>
    <group position={[0, 0.0, -0.8]}><Sea t={tt} w={3} d={1.6} y={0.02} /></group>
    <mesh position={[0, 0.5, -1.4]}><planeGeometry args={[3, 1.2]} /><meshBasicMaterial color="#cfe4f2" /></mesh>
    <mesh position={[0.2, 0.3, -1.3]}><circleGeometry args={[0.12, 40]} />{M.glow({ col: "#fff1c0" })}</mesh>
    <mesh position={[0.2, 0.3, -1.31]}><circleGeometry args={[0.22, 40]} /><meshBasicMaterial color="#fff6d8" transparent opacity={0.45} /></mesh>
    {Array.from({ length: 10 }, (_, i) => <mesh key={"gl" + i} position={[0.2 + Math.sin(i * 2.3 + tt * 1.5) * 0.04, 0.03, -0.6 - i * 0.07]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.06 - i * 0.003, 0.012]} /><meshBasicMaterial color="#fff6d8" transparent opacity={0.5 + 0.3 * Math.sin(tt * 4 + i)} /></mesh>)}
    <group scale={pop(tt, 0.1)}>
      {[[0, 0.27, 0.36, 0.02], [0, 0.03, 0.36, 0.02], [-0.17, 0.15, 0.02, 0.26], [0.17, 0.15, 0.02, 0.26], [0, 0.15, 0.012, 0.24]].map(([x, y, w, hh], i) => <RBox key={i} s={[w, hh, 0.03]} p={[x, y, 0]} r={0.004}>{M.pvc({ col: "#f6f3ec" })}</RBox>)}
      <RBox s={[0.42, 0.012, 0.08]} p={[0, 0.02, 0.04]} r={0.004}>{M.pvc({ col: "#f6f3ec" })}</RBox>
      {[-1, 1].map((s) => <mesh key={s} position={[s * lerp(0.08, 0.21, op), 0.15, 0.03]} scale={[lerp(1, 0.35, op), 1, 1]}><planeGeometry args={[0.18, 0.28]} /><meshStandardMaterial color="#f4ece0" roughness={0.9} side={2} transparent opacity={0.92} /></mesh>)}
      <Mug p={[-0.11, 0.026, 0.05]} s={1.0} />
      <group position={[0.09, 0.026, 0.05]} scale={1.5}>
        <mesh><cylinderGeometry args={[0.04, 0.034, 0.006, 32]} />{M.porcelain({})}</mesh>
        <mesh position={[0, 0.012, 0]} rotation={[0, 0, 0.3]} scale={[1, 0.55, 0.6]}><sphereGeometry args={[0.02, 20, 14]} /><meshStandardMaterial color="#c88a3a" roughness={0.6} /></mesh>
      </group>
    </group>
  </>;
}}</Scene3D>;

// ---- 23:15 · YA SABÉS EL NÚMERO: el total de la última pantalla coincide con el de tu libreta y se tildan los dos ----
export const HLastNumber: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood"
  cam={{ at: [0, 0.1, 0], az: [-0.08, 0.06], el: [0.1, 0.08], r: [0.64, 0.58], fov: 30 }}>{(tt) => {
  const ok = eio(tt, 2.2, 2.8);
  return <>
    <Laptop p={[0.12, 0, -0.02]} r={[0, -0.25, 0]} s={1.05 * pop(tt, 0.1)} map={txt("lnA3", ["LAST SCREEN", "$612"], { w: 384, h: 240, bg: "#eefaf0", size: 46, lh: 90, cols: ["#555", "#1d2f5a"] })} />
    <group position={[-0.13, 0, 0]} rotation={[0, 0.25, 0]} scale={pop(tt, 0.6)}>
      <RBox s={[0.15, 0.19, 0.006]} p={[0, 0.105, 0]} rot={[-0.12, 0, 0]} r={0.004}>{M.matte({ col: "#fbf6e6" })}</RBox>
      <Sheet map={txt("ln4", ["MY TOTAL", "$612"], { w: 300, h: 380, bg: "#fbf6e6", size: 50, lh: 110, font: HANDF, cols: ["#555", "#1d2f5a"] })} w={0.14} h={0.177} p={[0, 0.105, 0.0035]} r={[-0.12, 0, 0]} />
      <RBox s={[0.04, 0.06, 0.03]} p={[0, 0.03, -0.03]} r={0.006}>{M.wood({})}</RBox>
    </group>
    {[-0.13, 0.12].map((x, i) => <group key={x} position={[x + 0.04, 0.19 + fallY(tt, 2.9 + i * 0.3, 0.2) * 0, 0.04]} scale={pop(tt, 2.9 + i * 0.3) * 1.3}>
      <mesh><sphereGeometry args={[0.02, 24, 16]} /><meshPhysicalMaterial color="#2e8b57" roughness={0.2} clearcoat={1} /></mesh>
      <Sheet map={txt("lnck", ["✓"], { w: 96, h: 96, bg: "#2e8b57", fg: "#ffffff", size: 84 })} w={0.024} h={0.024} p={[0, 0, 0.021]} />
    </group>)}
    <group position={[-0.01, 0.11 + 0.01 * Math.sin(ok * PI), 0.06]} scale={pop(tt, 2.2) * 1.5}>
      <mesh><sphereGeometry args={[0.025, 24, 16]} /><meshPhysicalMaterial color="#2e8b57" roughness={0.2} clearcoat={1} /></mesh>
      <Sheet map={txt("lnok", ["="], { w: 96, h: 96, bg: "#2e8b57", fg: "#ffffff", size: 84 })} w={0.03} h={0.03} p={[0, 0, 0.026]} />
    </group>
  </>;
}}</Scene3D>;
