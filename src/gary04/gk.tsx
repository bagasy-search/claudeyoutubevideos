// gary · piezas 3D comunes de los componentes únicos: texto DENTRO de la escena (sobre la pieza, nunca en una esquina),
// la power station genérica (sin marca), heladera, enchufe con cable, medidor de enchufe con pantalla, bombita, termómetro.
// Todo determinista (sale de tt). Render SÓLO en el farm.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, phys, tex, tubeG } from "./h3d";

export const PI = Math.PI;
type V = [number, number, number];

// texto pintado sobre un plano (rótulo de la pieza, pantalla, etiqueta). w en metros; el alto sale del largo del texto.
export const Txt3: React.FC<{ txt: string; w: number; h?: number; col?: string; bg?: string; p?: V; r?: V; glow?: boolean; weight?: number; font?: string; op?: number; s?: number }> =
  ({ txt, w, h, col = "#f7f4ee", bg, p = [0, 0, 0], r = [0, 0, 0], glow, weight = 900, font = "Arial", op = 1, s = 1 }) => {
  const hh = h ?? w * 0.24, W = 512, Hp = Math.max(32, Math.round(512 * hh / w));
  const map = tex.text(`o|${txt}|${col}|${bg}|${weight}|${font}|${Hp}`, W, Hp, (g) => {
    if (bg) { g.fillStyle = bg; g.fillRect(0, 0, W, Hp); }
    let fs = Hp * 0.78; g.font = `${weight} ${fs}px ${font}`;
    while (g.measureText(txt).width > W * 0.92 && fs > 8) { fs -= 2; g.font = `${weight} ${fs}px ${font}`; }
    g.textAlign = "center"; g.textBaseline = "middle";
    if (!bg) { g.lineJoin = "round"; g.lineWidth = Math.max(3, fs * 0.14); g.strokeStyle = "rgba(10,10,12,.85)"; g.strokeText(txt, W / 2, Hp / 2 + fs * 0.04); }
    g.fillStyle = col; g.fillText(txt, W / 2, Hp / 2 + fs * 0.04);
  });
  return <mesh position={p} rotation={r} scale={Math.max(0.001, s)}>
    <planeGeometry args={[w, hh]} />
    {glow ? <meshBasicMaterial map={map} transparent opacity={op} toneMapped={false} depthWrite={false} /> : <meshStandardMaterial map={map} transparent opacity={op} roughness={0.6} />}
  </mesh>;
};

// la power station genérica: cuerpo redondeado, panel oscuro, pantalla con texto, tomas y manija
export const PBox: React.FC<{ w?: number; h?: number; d?: number; col?: string; scr?: string; scrCol?: string; on?: number; sticker?: string; stickerBg?: string; p?: V; r?: V; s?: number; asa?: boolean }> =
  ({ w = 0.3, h = 0.22, d = 0.2, col = "#4a4e53", scr = "", scrCol = "#4dff9a", on = 1, sticker, stickerBg = "#d8361f", p = [0, 0, 0], r = [0, 0, 0], s = 1, asa = true }) =>
  <group position={p} rotation={r} scale={Math.max(0.001, s)}>
    <RBox s={[w, h, d]} p={[0, h / 2, 0]} r={0.016}><meshPhysicalMaterial color={col} roughness={0.5} clearcoat={0.3} /></RBox>
    <RBox s={[w * 0.86, h * 0.6, 0.004]} p={[0, h * 0.42, d / 2 + 0.001]} r={0.006} shadow={false}>{M.matte({ col: "#16181b" })}</RBox>
    <mesh position={[-w * 0.18, h * 0.55, d / 2 + 0.0045]}><planeGeometry args={[w * 0.38, h * 0.2]} /><meshStandardMaterial color="#071209" emissive={scrCol} emissiveIntensity={0.04 + 0.25 * on} /></mesh>
    {scr && <Txt3 txt={scr} w={w * 0.34} h={h * 0.15} col={scrCol} p={[-w * 0.18, h * 0.55, d / 2 + 0.006]} glow op={0.15 + 0.85 * on} />}
    {[0, 1].map((k) => <group key={k} position={[w * (0.1 + k * 0.17), h * 0.33, d / 2 + 0.004]}>
      <mesh><planeGeometry args={[w * 0.13, h * 0.2]} /><meshStandardMaterial color="#e8e6e0" roughness={0.6} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * w * 0.025, h * 0.02, 0.0006]}><planeGeometry args={[w * 0.012, h * 0.06]} /><meshBasicMaterial color="#111" /></mesh>)}
    </group>)}
    {asa && [-1, 1].map((sd) => <mesh key={"hp" + sd} position={[sd * w * 0.32, h + 0.02, 0]}><boxGeometry args={[0.016, 0.04, 0.034]} />{M.matte({ col: "#1c1d20" })}</mesh>)}
    {asa && <RBox s={[w * 0.72, 0.018, 0.034]} p={[0, h + 0.04, 0]} r={0.007}>{M.matte({ col: "#1c1d20" })}</RBox>}
    {sticker && <Txt3 txt={sticker} w={w * 0.86} h={h * 0.2} bg={stickerBg} col="#fff6e6" p={[0, h * 0.86, d / 2 + 0.0015]} />}
  </group>;

// heladera blanca de cocina; door = ángulo de apertura (0..1); lit = luz interior
export const Fridge: React.FC<{ door?: number; lit?: number; p?: V; r?: V; s?: number; col?: string }> = ({ door = 0, lit = 0, p = [0, 0, 0], r = [0, 0, 0], s = 1, col = "#eef0f0" }) =>
  <group position={p} rotation={r} scale={Math.max(0.001, s)}>
    <RBox s={[0.34, 0.66, 0.3]} p={[0, 0.33, 0]} r={0.02}>{M.porcelain({ col })}</RBox>
    <mesh position={[0, 0.44, 0.1505]}><planeGeometry args={[0.32, 0.004]} /><meshBasicMaterial color="#9aa0a4" /></mesh>
    <mesh position={[0.13, 0.25, 0.165]}><boxGeometry args={[0.012, 0.16, 0.02]} />{M.steel()}</mesh>
    <mesh position={[0.13, 0.55, 0.165]}><boxGeometry args={[0.012, 0.08, 0.02]} />{M.steel()}</mesh>
    {/* puerta de abajo que se abre sobre la bisagra izquierda */}
    <group position={[-0.17, 0.215, 0.152]} rotation={[0, -1.6 * door, 0]}>
      <RBox s={[0.34, 0.43, 0.025]} p={[0.17, 0, 0.012]} r={0.012}>{M.porcelain({ col })}</RBox>
    </group>
    <pointLight position={[0, 0.25, 0.05]} intensity={0.9 * lit} distance={0.6} color="#eaf4ff" />
    {/* hueco interior iluminado + lo que hay adentro (leche, huevos, frasco, verdura): sólo con la puerta abierta */}
    <mesh position={[0, 0.215, 0.1505]}><planeGeometry args={[0.3, 0.4]} /><meshStandardMaterial color="#cfd8de" emissive="#dbe8f2" emissiveIntensity={0.15 + 0.5 * lit} /></mesh>
    {door > 0.06 && <group position={[0, 0, 0.152]}>
      <RBox s={[0.06, 0.13, 0.04]} p={[-0.09, 0.09, 0.02]} r={0.006}>{M.plastic({ col: "#f6f6f2" })}</RBox>
      <RBox s={[0.06, 0.03, 0.04]} p={[-0.09, 0.165, 0.02]} r={0.004}>{M.plastic({ col: "#2b6fd6" })}</RBox>
      <RBox s={[0.12, 0.035, 0.05]} p={[0.06, 0.04, 0.025]} r={0.006}>{M.matte({ col: "#d9c39a" })}</RBox>
      {[0, 1, 2].map((i) => <mesh key={"eg" + i} position={[0.03 + i * 0.03, 0.068, 0.025]}><sphereGeometry args={[0.013, 14, 10]} />{M.porcelain({ col: "#f3e6cf" })}</mesh>)}
      <mesh position={[0.07, 0.29, 0.03]}><cylinderGeometry args={[0.03, 0.03, 0.08, 20]} />{M.glass({ op: 0.5, col: "#e0a040" })}</mesh>
      <mesh position={[-0.02, 0.27, 0.035]}><sphereGeometry args={[0.035, 16, 12]} />{M.matte({ col: "#4f9a3a" })}</mesh>
    </group>}
  </group>;

// enchufe de tres patas (US) con su cable que sale por atrás hacia `to`
export const Plug: React.FC<{ p: V; to: V; r?: V; col?: string; k?: string }> = ({ p, to, r = [0, 0, 0], col = "#1c1d20", k = "pl" }) => {
  const mid: V = [(p[0] + to[0]) / 2, Math.min(p[1], to[1]) - 0.03, (p[2] + to[2]) / 2];
  const key = k + p.map((x) => x.toFixed(3)).join(",") + to.map((x) => x.toFixed(3)).join(",");
  return <>
    <group position={p} rotation={r}>
      <RBox s={[0.045, 0.05, 0.03]} r={0.008}>{M.rubber({ col })}</RBox>
      {[-0.011, 0.011].map((x) => <mesh key={x} position={[x, 0.006, 0.026]}><boxGeometry args={[0.004, 0.012, 0.025]} />{M.brass()}</mesh>)}
      <mesh position={[0, -0.012, 0.026]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.0035, 0.0035, 0.025, 10]} />{M.brass()}</mesh>
    </group>
    <mesh geometry={tubeG(key, [[p[0], p[1], p[2] - 0.015], mid, to], 0.006, 60, 8)} castShadow>{M.rubber({ col })}</mesh>
  </>;
};

// medidor de enchufe (el de US$20): cuerpo gris, pantalla LCD con el número
export const WattMeter: React.FC<{ val: string; p?: V; r?: V; s?: number; warn?: number }> = ({ val, p = [0, 0, 0], r = [0, 0, 0], s = 1, warn = 0 }) =>
  <group position={p} rotation={r} scale={Math.max(0.001, s)}>
    <RBox s={[0.08, 0.13, 0.04]} p={[0, 0.065, 0]} r={0.012}>{M.plastic({ col: "#e9e7e1" })}</RBox>
    <mesh position={[0, 0.095, 0.0205]}><planeGeometry args={[0.062, 0.036]} /><meshStandardMaterial color="#a9c3a2" emissive={warn > 0.5 ? "#ff6a4a" : "#9fd39a"} emissiveIntensity={0.35} /></mesh>
    <Txt3 txt={val} w={0.058} h={0.028} col="#14231a" p={[0, 0.095, 0.0215]} font="Courier New" />
    {[0, 1, 2].map((i) => <mesh key={i} position={[-0.02 + i * 0.02, 0.06, 0.0205]}><circleGeometry args={[0.006, 16]} />{M.plastic({ col: ["#2b6fd6", "#d8361f", "#f2c21b"][i] })}</mesh>)}
    <mesh position={[0, 0.03, 0.0205]}><planeGeometry args={[0.03, 0.03]} /><meshStandardMaterial color="#d8d5cc" /></mesh>
  </group>;

// bombita que se enciende (on 0..1)
export const Bulb: React.FC<{ on: number; p?: V; s?: number; col?: string }> = ({ on, p = [0, 0, 0], s = 1, col = "#ffd98a" }) =>
  <group position={p} scale={Math.max(0.001, s)}>
    <mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.035, 24, 18]} /><meshPhysicalMaterial color="#fff8e8" transparent opacity={0.55} roughness={0.1} emissive={col} emissiveIntensity={2.2 * on} /></mesh>
    <mesh position={[0, 0.012, 0]}><cylinderGeometry args={[0.016, 0.014, 0.024, 16]} />{M.brass()}</mesh>
    <pointLight position={[0, 0.06, 0.02]} intensity={0.8 * on} distance={0.6} color={col} />
  </group>;

// termómetro de vidrio con líquido rojo (k 0..1 de la escala) y rayas
export const Thermo: React.FC<{ k: number; p?: V; s?: number; col?: string }> = ({ k, p = [0, 0, 0], s = 1, col = "#e2352a" }) =>
  <group position={p} scale={Math.max(0.001, s)}>
    <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.014, 0.014, 0.3, 20, 1, true]} />{M.glass({ op: 0.3 })}</mesh>
    <mesh position={[0, 0.02, 0]}><sphereGeometry args={[0.024, 20, 16]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.3} /></mesh>
    <mesh position={[0, 0.03 + 0.14 * cl(k), 0]} scale={[1, Math.max(0.001, cl(k)), 1]}><cylinderGeometry args={[0.007, 0.007, 0.28, 12]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.3} /></mesh>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0.016, 0.05 + i * 0.03, 0]}><boxGeometry args={[0.008, 0.0015, 0.002]} /><meshBasicMaterial color="#e8e2d2" /></mesh>)}
  </group>;

// X roja o tilde verde de cinta luminosa (k 0..1 se dibuja)
export const Mark: React.FC<{ ok?: boolean; k: number; p?: V; r?: V; s?: number }> = ({ ok, k, p = [0, 0, 0], r = [0, 0, 0], s = 1 }) => {
  const col = ok ? "#6fe39a" : "#ff4a3a", a = cl(k * 2), b = cl(k * 2 - 1);
  const bar = (len: number, rot: number, kk: number, x = 0, y = 0) => <group position={[x, y, 0]} rotation={[0, 0, rot]}>
    <mesh position={[-len / 2 + len * Math.max(0.001, kk) / 2, 0, 0]} scale={[Math.max(0.001, kk), 1, 1]}><boxGeometry args={[len, len * 0.16, 0.012]} />{M.glow({ col })}</mesh>
  </group>;
  return <group position={p} rotation={r} scale={Math.max(0.001, s)}>
    {ok ? <>{bar(0.07, -0.8 + PI, a, -0.03, -0.01)}{bar(0.15, 0.95, b, 0.025, 0.02)}</> : <>{bar(0.2, 0.78, a)}{bar(0.2, -0.78, b)}</>}
  </group>;
};

// número que rueda (contador) con easing: de a a b entre t0 y t1
export const roll = (tt: number, t0: number, t1: number, a: number, b: number) => Math.round(lerp(a, b, eio(tt, t0, t1)));
// entrada con resorte de una pieza (0.001..~1.05..1)
export const pop = (tt: number, at: number) => Math.max(0.001, phys(tt, at, 7, 0.5));
export { cl, eio, lerp, phys };
