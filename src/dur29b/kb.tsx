// dur29b · kit compartido de los componentes 3D: contador de rodillos de latón, roca, caballo, rótulos grabados y el stickman en el lugar.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { U3, dirtT, sec, useImg } from "./k3";
import { F } from "./ukit";
import { Stickman } from "../stickman3d";

type UP = { d: number; p: any };
const PI = Math.PI;
const rock = (key: string, base: number[], rx = 2, ry = 2) => tex.text("rock" + key + rx + ry, 512, 512, (g) => {
  g.fillStyle = `rgb(${base.join(",")})`; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2200; i++) { const v = (rn(i, 1) - 0.5) * 60; g.fillStyle = `rgba(${base[0] + v},${base[1] + v * 0.8},${base[2] + v * 0.6},.5)`; const r = 1 + rn(i, 2) * 5; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 512, r, r); }
  for (let i = 0; i < 26; i++) { g.strokeStyle = `rgba(20,10,5,${0.15 + 0.2 * rn(i, 5)})`; g.lineWidth = 1 + 2 * rn(i, 6); g.beginPath(); let x = rn(i, 7) * 512, y = rn(i, 8) * 512; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (rn(i, 9 + k) - 0.5) * 80; y += (rn(i, 19 + k) - 0.3) * 60; g.lineTo(x, y); } g.stroke(); }
});
const rockT = (key: string, base: number[], rx: number, ry: number) => { const t = rock(key, base, rx, ry); t.repeat.set(rx, ry); return t; };

// ---------- contador mecánico de rodillos (HTML sobre la escena, latón): el número rueda, nunca salta ----------
export const Drums: React.FC<{ v: number; n?: number; x: number; y: number; s?: number; unit?: string; op?: number }> = ({ v, n = 3, x, y, s = 1, unit, op = 1 }) => {
  const digs = Array.from({ length: n }, (_, i) => { const p = Math.pow(10, n - 1 - i), raw = v / p; const d = Math.floor(raw) % 10, fr = raw - Math.floor(raw); const roll = i === n - 1 ? raw % 10 : d + (fr > 0.9 && (v % p) > p - p / 10 - 1e-6 ? (fr - 0.9) * 10 : 0); return roll; });
  return <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, transformOrigin: "left top", opacity: op, display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRadius: 18,
    background: "linear-gradient(180deg,#d9b260,#8a6424 55%,#c99a46)", boxShadow: "0 18px 40px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,240,200,.6), inset 0 -3px 0 rgba(60,35,10,.6)" }}>
    {digs.map((r, i) => <div key={i} style={{ width: 70, height: 96, overflow: "hidden", borderRadius: 8, background: "#141210", boxShadow: "inset 0 10px 14px rgba(0,0,0,.9), inset 0 -10px 14px rgba(0,0,0,.9)", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: -r * 96, width: 70 }}>{Array.from({ length: 11 }, (_, k) => <div key={k} style={{ height: 96, lineHeight: "96px", textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 70, color: "#f3ead6" }}>{k % 10}</div>)}</div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.55),transparent 30%,transparent 70%,rgba(0,0,0,.55))" }} />
    </div>)}
    {unit && <div style={{ fontFamily: F, fontWeight: 900, fontSize: 52, color: "#2a1a08", marginLeft: 6 }}>{unit}</div>}
  </div>;
};

export { rockT };

// ---------- el caballo de primitivas (galope por fase) ----------
export const Horse: React.FC<{ tt: number; col?: string; gallop?: number; ears?: number; horns?: boolean; s?: number; op?: number }> = ({ tt, col = "#8a5a36", gallop = 1, ears = 0.04, horns = false, s = 1, op = 1 }) => {
  const ph = tt * 2 * PI * 1.8 * gallop, bob = 0.012 * Math.sin(ph * 2) * gallop;
  const mat = <meshStandardMaterial color={col} roughness={0.7} transparent={op < 1} opacity={op} depthWrite={op > 0.5} />;
  return <group scale={s} position={[0, bob, 0]}>
    <mesh position={[0, 0.34, 0]} rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.085, 0.26, 10, 20]} />{mat}</mesh>
    <mesh position={[0.2, 0.45, 0]} rotation={[0, 0, -0.7]} castShadow><capsuleGeometry args={[0.045, 0.14, 8, 16]} />{mat}</mesh>
    <mesh position={[0.28, 0.52, 0]} rotation={[0, 0, -1.9]} castShadow><capsuleGeometry args={[0.035, 0.09, 8, 16]} />{mat}</mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[0.25, 0.58, sd * 0.02]} rotation={[0, 0, horns ? -0.2 : -0.1]} castShadow><coneGeometry args={[0.012, horns ? 0.09 : ears, 8]} />{horns ? <meshStandardMaterial color="#e8dcc0" roughness={0.5} /> : mat}</mesh>)}
    {[[0.13, 0.04], [0.13, -0.04], [-0.13, 0.04], [-0.13, -0.04]].map(([x, z], i) => { const a = Math.sin(ph + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * 0.5 * gallop; return <group key={i} position={[x, 0.3, z]} rotation={[0, 0, a]}>
      <mesh position={[0, -0.14, 0]} castShadow><cylinderGeometry args={[0.018, 0.014, 0.28, 10]} />{mat}</mesh>
      <mesh position={[0, -0.285, 0]}><cylinderGeometry args={[0.02, 0.02, 0.025, 10]} /><meshStandardMaterial color="#2a1d14" roughness={0.6} /></mesh>
    </group>; })}
    <mesh position={[-0.22, 0.34, 0]} rotation={[0, 0, 0.9 + 0.2 * Math.sin(ph)]} castShadow><coneGeometry args={[0.03, 0.18, 10]} /><meshStandardMaterial color="#2a1d14" roughness={0.8} /></mesh>
  </group>;
};


// ---------- piezas comunes ----------
export const pop = (tt: number, a: number) => Math.max(0.001, cl(phys(tt, a, 7, 0.42)));
export const fallY = (tt: number, a: number, h = 0.8) => (1 - cl(phys(tt, a, 8, 0.36))) * h;
const LG = new Map<string, THREE.LatheGeometry>();
export const latheG = (k: string, P: number[][], seg = 40) => { let g = LG.get(k); if (!g) { g = new THREE.LatheGeometry(P.map(([r, y]) => new THREE.Vector2(r, y)), seg); LG.set(k, g); } return g; };
// rótulo grabado: va pegado al objeto (madera, piedra, latón), nunca suelto en pantalla
export const label = (key: string, txt: string, w = 512, h = 128, col = "#3a2210", font = "800 64px Georgia") => tex.text("lbl" + key, w, h, (g) => {
  g.clearRect(0, 0, w, h); g.font = font; const mw = g.measureText(txt).width; if (mw > w * 0.92) { const px = parseFloat(font.match(/(\d+)px/)![1]) * w * 0.92 / mw; g.font = font.replace(/\d+px/, Math.floor(px) + "px"); } g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "rgba(255,240,210,.35)"; g.fillText(txt, w / 2 + 2, h / 2 + 3); g.fillStyle = col; g.fillText(txt, w / 2, h / 2); });
export const Plate: React.FC<{ k: string; txt: string; w?: number; h?: number; p?: number[]; rot?: number[]; mat?: "wood" | "brass" | "stone"; font?: number }> = ({ k, txt, w = 0.5, h = 0.12, p = [0, 0, 0], rot = [0, 0, 0], mat = "wood", font = 66 }) =>
  <group position={p as any} rotation={rot as any}>
    <RBox s={[w, h, 0.025]} r={0.008}>{mat === "brass" ? M.brass({ col: "#c8963e" }) : mat === "stone" ? <meshStandardMaterial map={dirtT([170, 160, 146])} roughness={0.95} /> : <meshStandardMaterial map={tex.wood(1, 1, [120, 80, 44])} roughness={0.7} />}</RBox>
    <mesh position={[0, 0, 0.0135]}><planeGeometry args={[w * 0.94, h * 0.9]} /><meshStandardMaterial map={label(k, txt, Math.min(2048, Math.max(256, Math.round(128 * w / h))), 128, mat === "brass" ? "#3a2008" : "#2e1a0c", `800 ${font}px Georgia`)} transparent roughness={0.6} /></mesh>
  </group>;
// stickman que camina/corre EN EL LUGAR: el motor lo traslada v·t sobre z (rotY del guion = 0), acá se descuenta
export const EnSitio: React.FC<{ tt: number; accion: "caminar" | "correr"; escala: number; rotY?: number; expr?: string; semilla?: number; contacto?: number }> = ({ tt, accion, escala, rotY = 0, expr = "decidido", semilla = 1, contacto = 0.4 }) => {
  const v = accion === "correr" ? 2.5 : 0.95, r = rotY * PI / 180;
  return <group rotation={[0, r, 0]}><Stickman escala={escala} z={-v * tt} guion={[{ t: 0, accion, expr: expr as any }]} semilla={semilla} contacto={contacto} colorContacto="#1a120c" /></group>;
};
