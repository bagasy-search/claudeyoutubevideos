// lin29e · componentes 1-12 (sitios de reservas)
import React from "react";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, eio, lerp, phys, rn } from "./h3d";
import { Bill, PI, PriceTag, Sheet, HANDF, fallY, pop, txt } from "./lkit3d";

// encuadre: medio alto visible = r·0,27 · medio ancho = r·0,48 (fov 30)

// notebook: tapa con pantalla (map); children van en el plano de la pantalla (centro en y 0,08)
export const Laptop: React.FC<{ map: any; p?: number[]; r?: number[]; s?: number; open?: number; em?: number; children?: React.ReactNode }> = ({ map, p = [0, 0, 0], r = [0, 0, 0], s = 1, open = 1, em = 0.35, children }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <RBox s={[0.24, 0.012, 0.16]} p={[0, 0.006, 0]} r={0.006}>{M.steel({})}</RBox>
    <RBox s={[0.2, 0.002, 0.08]} p={[0, 0.0125, -0.015]} r={0.001}>{M.matte({ col: "#2a2c31" })}</RBox>
    <RBox s={[0.07, 0.002, 0.04]} p={[0, 0.0125, 0.05]} r={0.002}>{M.matte({ col: "#9a9ea6" })}</RBox>
    <group position={[0, 0.012, -0.078]} rotation={[lerp(PI / 2, -0.2, open), 0, 0]}>
      <RBox s={[0.24, 0.155, 0.008]} p={[0, 0.0775, -0.002]} r={0.006}>{M.steel({})}</RBox>
      <Sheet map={map} w={0.22} h={0.135} p={[0, 0.08, 0.0025]} em={em} />
      <group position={[0, 0, 0.003]}>{children}</group>
    </group>
  </group>;

// taza de café
export const Mug: React.FC<{ p?: number[]; s?: number; col?: string }> = ({ p = [0, 0, 0], s = 1, col = "#f2efe8" }) =>
  <group position={p as [number, number, number]} scale={s}>
    <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.024, 0.021, 0.06, 28]} />{M.porcelain({ col })}</mesh>
    <mesh position={[0, 0.056, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.021, 24]} /><meshStandardMaterial color="#4a2c1a" roughness={0.3} /></mesh>
    <mesh position={[0.026, 0.032, 0]}><torusGeometry args={[0.013, 0.004, 10, 20]} />{M.porcelain({ col })}</mesh>
  </group>;

// dedo índice (apunta hacia -y)
export const Finger: React.FC<{ p?: number[]; r?: number[]; s?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1 }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <mesh position={[0, 0.05, 0]}><capsuleGeometry args={[0.011, 0.08, 8, 16]} /><meshStandardMaterial color="#e2b79c" roughness={0.6} /></mesh>
    <mesh position={[0, 0.006, 0.008]} rotation={[0.3, 0, 0]}><boxGeometry args={[0.014, 0.012, 0.002]} /><meshStandardMaterial color="#f3d6c8" roughness={0.3} /></mesh>
    <mesh position={[0, 0.13, -0.004]}><sphereGeometry args={[0.03, 20, 16]} /><meshStandardMaterial color="#e2b79c" roughness={0.6} /></mesh>
  </group>;

// libreta con renglones y texto a mano
export const Notepad: React.FC<{ id: string; lines: string[]; p?: number[]; r?: number[]; s?: number; cols?: string[]; sz?: number }> = ({ id, lines, p = [0, 0, 0], r = [0, 0, 0], s = 1, cols, sz = 44 }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <RBox s={[0.15, 0.006, 0.2]} p={[0, 0.003, 0]} r={0.003}>{M.matte({ col: "#fbf6e6" })}</RBox>
    <mesh position={[0, 0.007, -0.092]}><boxGeometry args={[0.15, 0.006, 0.016]} />{M.plastic({ col: "#1d2f5a" })}</mesh>
    <Sheet map={txt("np" + id + sz, lines, { w: 300, h: 380, bg: "#fbf6e6", fg: "#1d2f5a", size: sz, lh: 70, font: HANDF, rule: true, cols })} w={0.14} h={0.177} p={[0, 0.0065, 0.008]} r={[-PI / 2, 0, 0]} />
  </group>;

// tambor de N cifras con signo $
export const Drums: React.FC<{ id: string; v: number; n: number; p?: number[]; s?: number; fg?: string; bg?: string }> = ({ id, v, n, p = [0, 0, 0], s = 1, fg = "#f2d23a", bg = "#1b1d22" }) => {
  const d = Array.from({ length: n }, (_, i) => Math.floor(Math.max(0, v) / Math.pow(10, n - 1 - i)) % 10);
  const w = 0.045 * n + 0.05;
  return <group position={p as [number, number, number]} scale={s}>
    <RBox s={[w, 0.08, 0.06]} r={0.01}>{M.plastic({ col: bg })}</RBox>
    <Sheet map={txt("edr$" + id + fg, ["$"], { w: 64, h: 64, bg, fg, size: 54 })} w={0.03} h={0.03} p={[-w / 2 + 0.022, 0, 0.031]} />
    {d.map((x, i) => <DigitDrum key={i} v={x} p={[-w / 2 + 0.06 + i * 0.045, 0, 0.032]} r={0.026} w={0.036} />)}
  </group>;
};

const scr = (id: string, lines: string[], cols: string[], bg = "#eef3f7", size = 46) => txt(id, lines, { w: 384, h: 240, bg, size, lh: 64, cols });

// ---- 0:21 · LA ÚLTIMA PANTALLA: el $119 de la notebook se tapa con el total real $203 y el tambor sube ----
export const HLastScreen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [0, 0.13, 0], az: [-0.2, 0.08], el: [0.2, 0.17], r: [0.7, 0.64], fov: 30 }}>{(tt) => {
  const k = eio(tt, 1.8, 2.6), v = Math.round(lerp(119, 203, eio(tt, 2.0, 3.4)));
  return <>
    <Laptop p={[0, 0, 0]} s={1.15 * pop(tt, 0.1)} open={eio(tt, 0.1, 0.8)} map={scr("lsA", ["SEASIDE INN", "$119", "per night"], ["#1d2f5a", "#2e8b57", "#555"])}>
      <group position={[0.11 - 0.11 * k, 0.08, 0.001]} scale={[Math.max(0.001, k), 1, 1]}>
        <Sheet map={scr("lsB", ["LAST SCREEN", "$203", "per night"], ["#555", "#b8302a", "#555"], "#fff3ef")} w={0.22} h={0.135} em={0.35} />
      </group>
    </Laptop>
    <Drums id="ls" v={v} n={3} p={[0, 0.27, -0.1]} s={0.85 * pop(tt, 1.6)} fg={v > 160 ? "#ff8a78" : "#f2d23a"} />
    <Mug p={[-0.21, 0, 0.05]} s={1.1 * pop(tt, 0.4)} />
  </>;
}}</Scene3D>;

// ---- 1:29 · EL BOTÓN GRANDE: un botón naranja enorme NEXT y uno gris diminuto; el dedo siempre cae en el grande ----
export const HBigButton: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0, 0.07, 0], az: [-0.18, 0.1], el: [0.36, 0.3], r: [0.6, 0.54], fov: 30 }}>{(tt) => {
  const press = (a: number) => Math.max(0, Math.sin(Math.min(1, Math.max(0, (tt - a) / 0.5)) * PI));
  const pr = Math.max(press(1.2), press(2.4), press(3.6)), fy = 0.2 - 0.1 * eio(tt, 0.8, 1.2) - 0.085 * pr;
  return <>
    <group scale={pop(tt, 0.1)}>
      <mesh position={[-0.03, 0.012, 0]}><cylinderGeometry args={[0.09, 0.1, 0.024, 48]} />{M.steel({})}</mesh>
      <mesh position={[-0.03, 0.04 - 0.016 * pr, 0]}><cylinderGeometry args={[0.078, 0.08, 0.04, 48]} /><meshPhysicalMaterial color="#e8822a" roughness={0.25} clearcoat={1} emissive="#e8822a" emissiveIntensity={0.15 + 0.5 * pr} /></mesh>
      <Sheet map={txt("bbn", ["NEXT"], { w: 256, h: 128, bg: "#e8822a", fg: "#ffffff", size: 96 })} w={0.12} h={0.06} p={[-0.03, 0.061 - 0.016 * pr, 0]} r={[-PI / 2, 0, 0]} />
    </group>
    <group position={[0.16, 0, 0.06]} scale={pop(tt, 0.3)}>
      <mesh position={[0, 0.004, 0]}><cylinderGeometry args={[0.018, 0.018, 0.008, 20]} />{M.plastic({ col: "#9a9ea6" })}</mesh>
      <Sheet map={txt("bbs2", ["no thanks"], { w: 256, h: 64, bg: "#3a3d42", fg: "#c8ccd4", size: 44 })} w={0.08} h={0.02} p={[0, 0.001, 0.036]} r={[-PI / 2, 0, 0]} />
    </group>
    <Finger p={[-0.03, 0.04 + fy, 0]} s={1.1 * pop(tt, 0.6)} />
    {[0, 1, 2].map((j) => { const a = 1.45 + j * 1.2, k = Math.min(1, Math.max(0, (tt - a) / 0.6)); return <mesh key={j} visible={tt > a && k < 1} position={[-0.03, 0.062, 0]} rotation={[-PI / 2, 0, 0]} scale={0.08 + k * 0.08}><ringGeometry args={[0.9, 1, 48]} /><meshBasicMaterial color="#ffd09a" transparent opacity={0.6 * (1 - k)} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 1:46 · LA PILA DE CARGOS: sobre la etiqueta de $119 caen de a uno los bloques de cargos y el tambor llega a 203 ----
export const HFeeStack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0.02, 0.13, 0], az: [-0.22, 0.08], el: [0.2, 0.17], r: [0.72, 0.66], fov: 30 }}>{(tt) => {
  const F = [["TAXES", "#5a6b7d", 26], ["RESORT FEE", "#b8302a", 30], ["DESTINATION", "#8a5a2b", 14], ["FACILITY", "#3d6a8a", 14]] as const;
  const n = F.filter((_, i) => tt > 1.0 + i * 0.6).length, v = 119 + F.slice(0, n).reduce((a, f) => a + f[2], 0);
  return <>
    <group position={[-0.06, 0, 0]}>
      <RBox s={[0.17, 0.05, 0.1]} p={[0, 0.025, 0]} r={0.01}>{M.pvc({ col: "#1d2f5a" })}</RBox>
      <Sheet map={txt("fsroom", ["ROOM $119"], { w: 384, h: 96, bg: "#1d2f5a", fg: "#ffffff", size: 60 })} w={0.15} h={0.037} p={[0, 0.025, 0.051]} s={pop(tt, 0.2)} />
      {F.map(([l, c], i) => <group key={l} position={[0, 0.05 + 0.034 * i + 0.017 + fallY(tt, 1.0 + i * 0.6, 0.35), 0]} rotation={[0, (rn(i) - 0.5) * 0.12, 0]} visible={tt > 1.0 + i * 0.6}>
        <RBox s={[0.16, 0.032, 0.09]} r={0.006}>{M.plastic({ col: c })}</RBox>
        <Sheet map={txt("fs" + l, [l], { w: 384, h: 80, bg: c, fg: "#ffffff", size: 54 })} w={0.14} h={0.029} p={[0, 0, 0.046]} />
      </group>)}
    </group>
    <Drums id="fs" v={v} n={3} p={[0.17, 0.1, 0]} s={0.85 * pop(tt, 0.5)} fg={v > 150 ? "#ff8a78" : "#f2d23a"} />
  </>;
}}</Scene3D>;

// ---- 2:16 · LA CALCOMANÍA: el sticker de $119 se despega como una pegatina y abajo estaba el $203 ----
export const HStickerPeel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="wood"
  cam={{ at: [0, 0.1, 0], az: [-0.12, 0.1], el: [0.08, 0.06], r: [0.56, 0.5], fov: 30 }}>{(tt) => {
  const peel = eio(tt, 1.4, 2.8);
  return <>
    <group position={[0, 0.1, 0]} scale={pop(tt, 0.1)}>
      <RBox s={[0.3, 0.2, 0.012]} r={0.012}>{M.pvc({ col: "#f6f1e4" })}</RBox>
      <Sheet map={txt("spbase", ["THE GRAND BAY", "$203", "per night, all in"], { w: 480, h: 320, bg: "#f6f1e4", size: 54, lh: 100, cols: ["#1d2f5a", "#b8302a", "#555"] })} w={0.28} h={0.187} p={[0, 0, 0.0065]} />
      <group position={[peel * 0.14, 0.055 + peel * 0.1, 0.009 + peel * 0.08]} rotation={[-peel * 1.2, peel * 0.6, peel * 0.5]} scale={Math.max(0.001, 1 - eio(tt, 2.4, 3.0))}>
        <mesh position={[0, -0.05, 0]} scale={[1, 1, 1]}><circleGeometry args={[0.056, 48]} /><meshStandardMaterial color="#f2d23a" roughness={0.5} side={2} emissive="#f2d23a" emissiveIntensity={0.25} /></mesh>
        <Sheet map={txt("spst", ["ONLY", "$119"], { w: 256, h: 256, bg: "#f2d23a", fg: "#1d2f5a", size: 64, lh: 90 })} w={0.072} h={0.072} p={[0, -0.05, 0.0008]} />
      </group>
    </group>
  </>;
}}</Scene3D>;

// ---- 3:08 · SÓLO TOTALES: en la libreta aparecen tres totales escritos y el más chico queda encerrado en un círculo ----
export const HNoteTotals: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#e9e2d2" warm={0.9}
  cam={{ at: [0, 0.02, 0.01], az: [-0.08, 0.06], el: [1.05, 0.98], r: [0.5, 0.46], fov: 30 }}>{(tt) => {
  const L = ["Bay  $203", "Inn  $171", "Harbor  $188"], n = L.filter((_, i) => tt > 0.8 + i * 0.8).length, ring = eio(tt, 3.3, 4.1);
  const pz = -0.035 + Math.min(2, n) * 0.04;
  return <>
    <Notepad id={"nt" + n} lines={["TOTALS", ...L.slice(0, n), ...Array(3 - n).fill("")]} s={1.2 * pop(tt, 0.1)} cols={["#b8302a", "#1d2f5a", "#2e8b57", "#1d2f5a"]} />
    <mesh position={[-0.005, 0.012, 0.034]} rotation={[-PI / 2, 0, 0]} visible={ring > 0.01} scale={[1, 0.55, 1]}><ringGeometry args={[0.06, 0.066, 64, 1, 0, ring * 2 * PI]} /><meshBasicMaterial color="#b8302a" /></mesh>
    <group position={[0.06 + Math.sin(tt * 9) * 0.01 * (tt < 3.2 ? 1 : 0), 0.02, pz]} rotation={[0.5, 0, -0.6]} scale={pop(tt, 0.4)}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.005, 0.005, 0.12, 12]} />{M.plastic({ col: "#e8b53a" })}</mesh>
      <mesh position={[0, -0.005, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.005, 0.014, 12]} />{M.wood({})}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 3:25 · LA SIRENA ROJA: una baliza gira sobre la notebook "ONLY 1 LEFT" y el corazón late cada vez más rápido ----
export const HRedSiren: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="dark"
  cam={{ at: [0.02, 0.13, 0], az: [-0.2, 0.06], el: [0.18, 0.15], r: [0.74, 0.68], fov: 30 }}>{(tt) => {
  const rate = 2 + 6 * eio(tt, 0.8, 3.5), beat = Math.pow(Math.max(0, Math.sin(tt * rate * PI)), 6);
  return <>
    <Laptop p={[-0.05, 0, 0]} s={1.05 * pop(tt, 0.1)} map={scr("rsA", ["ONLY 1 ROOM", "LEFT!", "12 people looking"], ["#b8302a", "#b8302a", "#555"], "#fff1ee")}>
      <group position={[0, 0.17, -0.004]} scale={1.8}>
        <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.022, 0.024, 0.012, 24]} />{M.plastic({ col: "#1b1b1f" })}</mesh>
        <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.018, 0.02, 0.036, 24]} /><meshPhysicalMaterial color="#ff3a2a" transparent opacity={0.8} roughness={0.1} emissive="#ff2a1a" emissiveIntensity={0.6} /></mesh>
        <mesh position={[0, 0.03, 0]} rotation={[0, tt * 9, 0]}><boxGeometry args={[0.03, 0.012, 0.004]} />{M.glow({ col: "#ffd0c0" })}</mesh>
      </group>
    </Laptop>
    <group position={[0.2, 0.12, 0]} scale={(0.9 + 0.18 * beat) * pop(tt, 0.6)}>
      <mesh position={[-0.017, 0.01, 0]}><sphereGeometry args={[0.026, 24, 20]} /><meshPhysicalMaterial color="#c9302a" roughness={0.3} clearcoat={0.8} /></mesh>
      <mesh position={[0.017, 0.01, 0]}><sphereGeometry args={[0.026, 24, 20]} /><meshPhysicalMaterial color="#c9302a" roughness={0.3} clearcoat={0.8} /></mesh>
      <mesh position={[0, -0.018, 0]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.04, 0.04, 0.04]} /><meshPhysicalMaterial color="#c9302a" roughness={0.3} clearcoat={0.8} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 4:19 · TRES PANTALLAS: tres notebooks en arco con el mismo cuarto; la más barata se ilumina ----
export const HThreeLaptops: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood"
  cam={{ at: [0, 0.09, 0], az: [-0.08, 0.06], el: [0.26, 0.22], r: [0.84, 0.78], fov: 30 }}>{(tt) => {
  const P = [["SITE A", "$189"], ["HOTEL'S OWN", "$174"], ["SITE B", "$181"]], win = eio(tt, 2.8, 3.4);
  return <>
    {P.map(([a, b], i) => <Laptop key={i} p={[(i - 1) * 0.23, i === 1 ? 0.03 * win : 0, i === 1 ? 0.03 : -0.02]} r={[0, (1 - i) * 0.35, 0]} s={0.95 * pop(tt, 0.2 + i * 0.3)}
      map={scr("tl2" + i, ["SAME ROOM", b, a], ["#555", i === 1 ? "#2e8b57" : "#1d2f5a", "#555"], i === 1 && win > 0.5 ? "#eefaf0" : "#eef3f7", 62)} em={i === 1 ? 0.35 + 0.4 * win : 0.3} />)}
    <mesh position={[0, 0.002, 0.04]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, win)}><ringGeometry args={[0.13, 0.145, 64]} /><meshBasicMaterial color="#2e8b57" transparent opacity={0.8} /></mesh>
  </>;
}}</Scene3D>;

// ---- 4:47 · ¿COMPARADO CON QUÉ?: el $289 tachado gigante y el $179 verde; el tachado se encoge hasta ser un fantasma ----
export const HCrossed289: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark"
  cam={{ at: [0, 0.12, 0], az: [-0.14, 0.1], el: [0.12, 0.1], r: [0.62, 0.56], fov: 30 }}>{(tt) => {
  const cut = eio(tt, 0.8, 1.3), shrink = eio(tt, 2.6, 3.6);
  return <>
    <group position={[-0.08, 0.14 + 0.03 * shrink, -0.03]} scale={pop(tt, 0.1) * (1.4 - 0.65 * shrink)}>
      <RBox s={[0.15, 0.07, 0.014]} r={0.01}>{M.pvc({ col: "#e6e1d6" })}</RBox>
      <Sheet map={txt("c289", ["$289"], { w: 320, h: 140, bg: "#e6e1d6", fg: "#6b6f78", size: 110 })} w={0.14} h={0.061} p={[0, 0, 0.0075]} />
      <mesh position={[0, 0, 0.012]} rotation={[0, 0, 0.12]} scale={[Math.max(0.001, cut), 1, 1]}><boxGeometry args={[0.16, 0.008, 0.006]} /><meshStandardMaterial color="#b8302a" roughness={0.4} /></mesh>
    </group>
    <group position={[0.09, 0.08, 0.03]} scale={pop(tt, 1.4) * (1 + 0.25 * shrink)}>
      <RBox s={[0.15, 0.07, 0.014]} r={0.01}>{M.pvc({ col: "#2e8b57" })}</RBox>
      <Sheet map={txt("c179", ["$179"], { w: 320, h: 140, bg: "#2e8b57", fg: "#ffffff", size: 110 })} w={0.14} h={0.061} p={[0, 0, 0.0075]} />
    </group>
  </>;
}}</Scene3D>;

// ---- 5:38 · EL DEDO DE LINDA: el dedo se apoya sobre el precio tachado y sólo queda el que vas a pagar ----
export const HFingerCover: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [-0.02, 0.13, 0], az: [-0.1, 0.06], el: [0.12, 0.1], r: [0.48, 0.43], fov: 30 }}>{(tt) => {
  const f = eio(tt, 1.0, 1.9), glow = eio(tt, 2.2, 2.8);
  return <>
    <Laptop s={1.25 * pop(tt, 0.1)} em={0.35 + 0.3 * glow} map={txt("fcs2", ["DELUXE KING", "$289   $179", "tonight"], { w: 384, h: 240, bg: "#eef3f7", size: 52, lh: 70, cols: ["#1d2f5a", "#2e8b57", "#555"] })}>
      <mesh position={[-0.047, 0.08, 0.001]} rotation={[0, 0, 0.1]}><boxGeometry args={[0.07, 0.003, 0.001]} /><meshBasicMaterial color="#b8302a" /></mesh>
      <group position={[lerp(-0.3, -0.05, f), lerp(-0.05, 0.078, f), 0.022]} rotation={[0, 0, lerp(0.6, 0.15, f)]}>
        <mesh position={[-0.1, 0, 0]} rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.019, 0.2, 10, 24]} /><meshPhysicalMaterial color="#e2b192" roughness={0.55} sheen={0.6} /></mesh>
        <mesh position={[0.004, 0, 0.012]} scale={[1.1, 0.8, 0.3]}><sphereGeometry args={[0.014, 20, 14]} /><meshPhysicalMaterial color="#f3d6cc" roughness={0.2} clearcoat={1} /></mesh>
        {[-0.05, -0.1].map((x) => <mesh key={x} position={[x, 0, 0.018]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.012, 0.0012, 6, 20, PI]} /><meshBasicMaterial color="#b98a70" /></mesh>)}
      </group>
      <mesh position={[0.05, 0.08, 0.002]} scale={[Math.max(0.001, glow) * 1.3, Math.max(0.001, glow) * 0.75, 1]}><ringGeometry args={[0.04, 0.046, 48]} /><meshBasicMaterial color="#2e8b57" /></mesh>
    </Laptop>
  </>;
}}</Scene3D>;

// ---- 5:54 · DOS LLAVES, DOS TARIFAS: la tarifa sin reembolso viene "elegida" con un aro de luz; el aro se muda a FREE CANCEL ----
export const HTwoKeysRate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="wood"
  cam={{ at: [0, 0.12, 0], az: [-0.1, 0.08], el: [0.06, 0.05], r: [0.6, 0.55], fov: 30 }}>{(tt) => {
  const mv = eio(tt, 2.2, 3.0), lock = eio(tt, 1.0, 1.5);
  const Rate = ({ x, col, l, a }: { x: number; col: string; l: string[]; a: number }) => <group position={[x, 0.12, 0]} scale={pop(tt, a)} rotation={[0, 0, 0.06 * Math.sin(tt * 2 + x * 9)]}>
    <mesh position={[0, 0.075, 0]}><cylinderGeometry args={[0.0015, 0.0015, 0.05, 6]} />{M.steel({})}</mesh>
    <mesh position={[0, 0.1, -0.006]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.006, 0.006, 0.02, 12]} />{M.brass({})}</mesh>
    <RBox s={[0.16, 0.1, 0.006]} r={0.008}><meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.6} /></RBox>
    <Sheet map={txt("tk" + l.join(""), l, { w: 384, h: 240, bg: col, fg: "#ffffff", size: 54, lh: 78 })} w={0.15} h={0.094} p={[0, 0, 0.0035]} />
  </group>;
  return <>
    <Rate x={-0.1} col="#7a2a2a" l={["PAY NOW", "$149", "NON-REFUNDABLE"]} a={0.1} />
    <Rate x={0.1} col="#2e6b4a" l={["PAY LATER", "$162", "FREE CANCEL"]} a={0.3} />
    <group position={[-0.1, 0.085, 0.02]} scale={Math.max(0.001, lock * (1 - mv))}>
      <mesh position={[0, 0.012, 0]}><torusGeometry args={[0.012, 0.003, 8, 20, PI]} />{M.chrome({})}</mesh>
      <RBox s={[0.03, 0.024, 0.01]} p={[0, -0.002, 0]} r={0.003}>{M.brass({})}</RBox>
    </group>
    <mesh position={[lerp(-0.1, 0.1, mv), 0.12, -0.004]}><ringGeometry args={[0.095, 0.104, 64]} /><meshBasicMaterial color={mv > 0.5 ? "#7cff8a" : "#ffb070"} /></mesh>
  </>;
}}</Scene3D>;

// ---- 6:13 · $640 QUE NO VUELVEN: los billetes se meten en una caja fuerte NON-REFUNDABLE que se cierra con candado ----
export const HLost640: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0.02, 0.1, 0], az: [-0.24, 0.06], el: [0.22, 0.18], r: [0.66, 0.6], fov: 30 }}>{(tt) => {
  const door = eio(tt, 2.9, 3.4), clank = 1 + 0.03 * (1 - phys(tt, 3.4, 12, 0.3));
  return <>
    <group position={[0.08, 0, 0]} scale={pop(tt, 0.1) * clank}>
      <RBox s={[0.17, 0.15, 0.14]} p={[0, 0.075, 0]} r={0.012}>{M.steel({})}</RBox>
      <RBox s={[0.13, 0.11, 0.004]} p={[0, 0.075, 0.07]} r={0.004}>{M.matte({ col: "#7a808a" })}</RBox>
      <pointLight position={[0, 0.09, 0.05]} intensity={0.25 * (1 - door)} distance={0.25} color="#fff1d6" />
      <group position={[-0.075, 0.075, 0.072]} rotation={[0, -1.6 * (1 - door), 0]}>
        <RBox s={[0.15, 0.13, 0.014]} p={[0.075, 0, 0.007]} r={0.008}>{M.steel({})}</RBox>
        <mesh position={[0.11, 0, 0.016]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.016, 0.016, 0.008, 24]} />{M.chrome({})}</mesh>
        <Sheet map={txt("l6nr", ["NON-", "REFUNDABLE"], { w: 256, h: 120, bg: "#b8302a", fg: "#ffffff", size: 40, lh: 48 })} w={0.08} h={0.037} p={[0.055, 0.035, 0.0145]} />
      </group>
    </group>
    {Array.from({ length: 6 }, (_, i) => { const a = 0.6 + i * 0.32, k = eio(tt, a, a + 0.5); return <group key={i} position={[lerp(-0.17, 0.08, k), 0.03 + 0.004 * i + Math.sin(k * PI) * 0.08, lerp(0.04, 0.02, k)]} rotation={[-PI / 2, 0, 0.3 * k]} scale={1 - 0.3 * k} visible={k < 0.98}><Bill s={1.8} /></group>; })}
    <Drums id="l6" v={Math.round(640 * eio(tt, 0.6, 2.6))} n={3} p={[-0.12, 0.15, -0.04]} s={1.05 * pop(tt, 0.3)} fg="#ff8a78" />
  </>;
}}</Scene3D>;

// ---- 7:00 · EL DÍA EN ROJO: en el calendario de la cocina la lapicera roja encierra la fecha límite de cancelación ----
export const HRedPenDay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="tile"
  cam={{ at: [0, 0.12, 0], az: [-0.1, 0.08], el: [0.05, 0.04], r: [0.62, 0.56], fov: 30 }}>{(tt) => {
  const ring = eio(tt, 1.2, 2.4), note = pop(tt, 2.6);
  const px = 0.045 + Math.cos(ring * 2 * PI) * 0.03, py = 0.11 + Math.sin(ring * 2 * PI) * 0.024;
  return <>
    <group scale={pop(tt, 0.1)}>
      <RBox s={[0.3, 0.24, 0.006]} p={[0, 0.12, 0]} r={0.006}>{M.matte({ col: "#fbf6e6" })}</RBox>
      <Sheet map={txt("rpcal", ["MAY"], { w: 512, h: 72, bg: "#1d2f5a", fg: "#ffffff", size: 54 })} w={0.3} h={0.042} p={[0, 0.219, 0.0035]} />
      {Array.from({ length: 28 }, (_, i) => <Sheet key={i} map={txt("rpd" + (i + 1), [String(i + 1)], { w: 64, h: 52, bg: "#fbf6e6", fg: i === 16 ? "#b8302a" : "#555", size: 34, align: "left", pad: 6 })} w={0.04} h={0.032} p={[-0.123 + (i % 7) * 0.041, 0.175 - Math.floor(i / 7) * 0.034, 0.0035]} />)}
      <mesh position={[0.041, 0.107, 0.004]} visible={ring > 0.01}><ringGeometry args={[0.024, 0.028, 48, 1, PI / 2, ring * 2 * PI]} /><meshBasicMaterial color="#b8302a" /></mesh>
    </group>
    <group position={[px + 0.02, py - 0.01, 0.03]} rotation={[0.3, 0, -0.7]} visible={tt < 2.8}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.006, 0.006, 0.12, 14]} /><meshPhysicalMaterial color="#b8302a" roughness={0.3} clearcoat={1} /></mesh>
      <mesh position={[0, -0.006, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.006, 0.014, 14]} />{M.chrome({})}</mesh>
    </group>
    <group position={[0.12, 0.03, 0.05]} rotation={[0, 0, -0.12]} scale={note * 0.75}><PriceTag lines={["FREE CANCEL", "UNTIL 6 PM"]} col="#b8302a" fg="#fff4e6" /></group>
  </>;
}}</Scene3D>;
