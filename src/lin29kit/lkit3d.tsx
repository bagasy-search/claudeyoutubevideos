// lin29 · piezas 3D chicas que comparten los componentes de Linda (papel con texto, tarjeta llave, etiqueta de precio,
// moneda, alfiler, monedero). Todo sale de h3d (materiales y texturas en caché); escala nunca 0.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, phys, tex } from "./h3d";

export const PI = Math.PI;
// aparece con resorte con peso (nunca escala 0: bloom → NaN)
export const pop = (tt: number, a: number, w = 7, z = 0.45) => 0.001 + Math.max(0, phys(tt, a, w, z));
export const fallY = (tt: number, a: number, h: number, w = 8, z = 0.35) => (1 - phys(tt, a, w, z)) * h;

type TO = { w?: number; h?: number; bg?: string; fg?: string; size?: number; font?: string; align?: CanvasTextAlign; lh?: number; pad?: number; rule?: boolean; cols?: string[] };
// textura con renglones; cada renglón puede llevar su color en cols[i]
export const txt = (key: string, lines: string[], o: TO = {}) => {
  const w = o.w ?? 512, h = o.h ?? 256, size = o.size ?? 64, lh = o.lh ?? size * 1.25, pad = o.pad ?? 24, al = o.align ?? "center";
  return tex.text(key + w + "x" + h, w, h, (g) => {
    g.fillStyle = o.bg ?? "#f4efe3"; g.fillRect(0, 0, w, h);
    if (o.rule) { g.strokeStyle = "rgba(70,110,170,.35)"; g.lineWidth = 2; for (let y = lh; y < h; y += lh) { g.beginPath(); g.moveTo(0, y + 10); g.lineTo(w, y + 10); g.stroke(); } }
    g.textAlign = al; g.textBaseline = "middle";
    const y0 = h / 2 - (lines.length - 1) * lh / 2;
    lines.forEach((l, i) => { g.fillStyle = o.cols?.[i] ?? o.fg ?? "#24262c"; g.font = (o.font ?? "900 {s}px Arial").replace("{s}", String(i === 0 ? size : Math.round(size * 0.72))); g.fillText(l, al === "left" ? pad : al === "right" ? w - pad : w / 2, y0 + i * lh); });
  });
};
export const HANDF = "italic 700 {s}px Georgia";

// hoja plana con textura (parada: rot por defecto mirando a cámara)
export const Sheet: React.FC<{ map: THREE.Texture; w: number; h: number; p?: number[]; r?: number[]; s?: number | number[]; rough?: number; em?: number }> = ({ map, w, h, p = [0, 0, 0], r = [0, 0, 0], s = 1, rough = 0.9, em = 0 }) =>
  <mesh position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s as any} castShadow receiveShadow><planeGeometry args={[w, h]} /><meshStandardMaterial map={map} roughness={rough} side={THREE.DoubleSide} emissive="#ffffff" emissiveMap={em ? map : undefined} emissiveIntensity={em} /></mesh>;

// tarjeta llave de hotel (con banda y textura de cara)
export const KeyCard: React.FC<{ col?: string; label?: string; p?: number[]; r?: number[]; s?: number }> = ({ col = "#1d2f5a", label = "ROOM KEY", p = [0, 0, 0], r = [0, 0, 0], s = 1 }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <RBox s={[0.086, 0.054, 0.0025]} r={0.004}><meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.6} /></RBox>
    <mesh position={[0, 0, 0.0014]}><planeGeometry args={[0.08, 0.048]} /><meshStandardMaterial map={txt("kc" + label + col, [label], { w: 256, h: 160, bg: col, fg: "#f4efe3", size: 34 })} roughness={0.4} /></mesh>
    <mesh position={[0, -0.016, -0.0014]} rotation={[0, PI, 0]}><planeGeometry args={[0.086, 0.01]} />{M.matte({ col: "#141414" })}</mesh>
  </group>;

// etiqueta de precio de cartulina con ojal e hilo
export const PriceTag: React.FC<{ lines: string[]; col?: string; fg?: string; p?: number[]; r?: number[]; s?: number; string?: number }> = ({ lines, col = "#f6f1e4", fg = "#1d2f5a", p = [0, 0, 0], r = [0, 0, 0], s = 1, string = 0 }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <RBox s={[0.14, 0.07, 0.003]} r={0.006}><meshStandardMaterial color={col} roughness={0.85} /></RBox>
    <mesh position={[0.008, 0, 0.0018]}><planeGeometry args={[0.112, 0.064]} /><meshStandardMaterial map={txt("pt" + lines.join("|") + col + fg, lines, { w: 384, h: 224, bg: col, fg, size: Math.min(70, Math.floor(560 / Math.max(...lines.map((l) => l.length)))) })} roughness={0.85} /></mesh>
    <mesh position={[-0.058, 0, 0.002]}><torusGeometry args={[0.006, 0.0018, 8, 20]} />{M.brass()}</mesh>
    {string > 0 && <mesh position={[-0.058, string / 2, 0]}><cylinderGeometry args={[0.0008, 0.0008, string, 6]} />{M.matte({ col: "#d8cdb4" })}</mesh>}
  </group>;

export const Coin: React.FC<{ p?: number[]; r?: number[]; s?: number; col?: string }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, col }) =>
  <mesh position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s} castShadow><cylinderGeometry args={[0.02, 0.02, 0.004, 32]} /><meshPhysicalMaterial color={col ?? "#efc04e"} metalness={0.5} roughness={0.28} clearcoat={1} emissive="#5a3a00" emissiveIntensity={0.35} /></mesh>;

export const Bill: React.FC<{ p?: number[]; r?: number[]; s?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1 }) =>
  <Sheet map={txt("bill1", ["$1"], { w: 256, h: 112, bg: "#b9c9a4", fg: "#3c5a32", size: 70 })} w={0.11} h={0.048} p={p} r={r} s={s} />;

// alfiler de mapa
export const Pin: React.FC<{ col: string; p?: number[]; s?: number }> = ({ col, p = [0, 0, 0], s = 1 }) =>
  <group position={p as [number, number, number]} scale={s}>
    <mesh position={[0, 0.035, 0]} castShadow><sphereGeometry args={[0.012, 20, 16]} />{M.plastic({ col })}</mesh>
    <mesh position={[0, 0.015, 0]}><cylinderGeometry args={[0.0012, 0.0005, 0.03, 8]} />{M.steel()}</mesh>
  </group>;

// cinta azul de pintor que se desenrolla (largo len)
export const TapeStrip: React.FC<{ len: number; w?: number; p?: number[]; r?: number[]; label?: string }> = ({ len, w = 0.035, p = [0, 0, 0], r = [0, 0, 0], label }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]}>
    <mesh position={[len / 2, 0, 0]} scale={[Math.max(0.001, len), 1, 1]} castShadow><planeGeometry args={[1, w]} /><meshStandardMaterial color="#4f8fd8" roughness={0.8} side={THREE.DoubleSide} /></mesh>
    {label && <mesh position={[len / 2, 0, 0.0006]} scale={[Math.max(0.001, len), 1, 1]}><planeGeometry args={[1, w * 0.9]} /><meshStandardMaterial map={txt("tp" + label, [label], { w: 768, h: 96, bg: "#4f8fd8", fg: "#10213f", size: 60, font: HANDF })} transparent roughness={0.8} side={THREE.DoubleSide} /></mesh>}
  </group>;
export const TapeRoll: React.FC<{ p?: number[]; r?: number[]; s?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1 }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <mesh castShadow><torusGeometry args={[0.03, 0.012, 16, 40]} /><meshStandardMaterial color="#4f8fd8" roughness={0.75} /></mesh>
    <mesh><cylinderGeometry args={[0.02, 0.02, 0.024, 32, 1, true]} /><meshStandardMaterial color="#c9a477" roughness={0.9} side={THREE.DoubleSide} /></mesh>
  </group>;

export const clamp01 = cl;
