// lsm29b · utilería de Thanksgiving para los componentes únicos (kit h3d): vajilla de la iglesia, mantel, velas, sillas, pavo, vapor.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, rn, tex } from "./h3d";

const PI = Math.PI;
type V = [number, number, number];

// texto escrito a mano / impreso sobre papel (una textura por contenido)
export const paperTex = (key: string, lines: string[], o: { w?: number; h?: number; font?: string; bg?: string; ink?: string; rule?: boolean } = {}) =>
  tex.text("tg" + key, o.w ?? 512, o.h ?? 320, (g) => {
    const w = o.w ?? 512, h = o.h ?? 320;
    g.fillStyle = o.bg ?? "#f6f1e4"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(140,110,70,${0.04 * rn(i, 2)})`; g.fillRect(rn(i, 3) * w, rn(i, 4) * h, 2, 2); }
    if (o.rule) { g.strokeStyle = "rgba(90,140,200,.35)"; g.lineWidth = 2; for (let y = h * 0.28; y < h; y += h * 0.2) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } g.strokeStyle = "rgba(210,80,80,.4)"; g.beginPath(); g.moveTo(w * 0.1, 0); g.lineTo(w * 0.1, h); g.stroke(); }
    g.fillStyle = o.ink ?? "#2b2420"; g.textAlign = "center"; g.textBaseline = "middle";
    const n = lines.length, fs = Math.min(h / (n + 1.2), (w * 1.5) / Math.max(...lines.map((l) => l.length), 1));
    g.font = `${o.font ?? "italic 700"} ${Math.round(fs)}px Georgia`;
    lines.forEach((l, i) => g.fillText(l, w / 2, h * (0.5 + (i - (n - 1) / 2) / (n + 0.6))));
  });

// mantel blanco de lino (tramado suave)
export const linenTex = () => tex.text("linen", 256, 256, (g) => {
  g.fillStyle = "#f3efe6"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 4) { g.fillStyle = `rgba(160,150,130,${0.05 + 0.04 * rn(i, 2)})`; g.fillRect(i, 0, 1, 256); g.fillRect(0, i, 256, 1); }
});
// repasador a cuadros azules
export const checkTex = (c = "#4f78b0") => tex.text("check" + c, 256, 256, (g) => {
  g.fillStyle = "#f4f1ea"; g.fillRect(0, 0, 256, 256); g.fillStyle = c; g.globalAlpha = 0.55;
  for (let i = 0; i < 8; i++) { g.fillRect(i * 32, 0, 14, 256); g.fillRect(0, i * 32, 256, 14); }
});
// porcelana con rositas rosadas y filete dorado
export const roseTex = () => tex.text("roses", 512, 128, (g) => {
  g.fillStyle = "#fbf8f2"; g.fillRect(0, 0, 512, 128); g.fillStyle = "#d4a63e"; g.fillRect(0, 0, 512, 7);
  for (let i = 0; i < 9; i++) { const x = 30 + i * 56, y = 62 + 14 * Math.sin(i * 1.7);
    g.fillStyle = "#6f9a5a"; g.beginPath(); g.ellipse(x - 12, y + 8, 9, 4, 0.5, 0, 6.3); g.fill(); g.beginPath(); g.ellipse(x + 12, y + 8, 9, 4, -0.5, 0, 6.3); g.fill();
    g.fillStyle = "#e89aae"; g.beginPath(); g.arc(x, y, 11, 0, 6.3); g.fill(); g.fillStyle = "#cf6f88"; g.beginPath(); g.arc(x + 2, y - 1, 5, 0, 6.3); g.fill(); }
});

export const Table: React.FC<{ w?: number; d?: number; top?: number }> = ({ w = 1.6, d = 0.9, top = 0 }) => <group position={[0, top, 0]}>
  <mesh position={[0, -0.012, 0]} receiveShadow castShadow><boxGeometry args={[w, 0.024, d]} /><meshStandardMaterial map={linenTex()} roughness={0.85} /></mesh>
  {/* caída del mantel */}
  {[-1, 1].map((k) => <mesh key={k} position={[0, -0.09, k * (d / 2 + 0.001)]}><planeGeometry args={[w, 0.16]} /><meshStandardMaterial map={linenTex()} roughness={0.85} side={THREE.DoubleSide} /></mesh>)}
</group>;

export const Plate: React.FC<{ p?: V; r?: number; rim?: string }> = ({ p = [0, 0, 0], r = 0.12, rim = "#d4a63e" }) => <group position={p}>
  <mesh position={[0, 0.007, 0]} castShadow receiveShadow><cylinderGeometry args={[r, r * 0.8, 0.014, 48]} />{M.porcelain()}</mesh>
  <mesh position={[0, 0.0145, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[r * 0.9, r * 0.95, 48]} /><meshStandardMaterial color={rim} metalness={0.8} roughness={0.3} /></mesh>
</group>;

export const Fork: React.FC<{ p?: V; ry?: number }> = ({ p = [0, 0, 0], ry = 0 }) => <group position={p} rotation={[0, ry, 0]}>
  <RBox s={[0.014, 0.004, 0.13]} r={0.002} p={[0, 0.003, 0.03]}>{M.steel()}</RBox>
  {[-0.0045, -0.0015, 0.0015, 0.0045].map((x) => <mesh key={x} position={[x, 0.003, -0.06]}><boxGeometry args={[0.0018, 0.003, 0.05]} />{M.steel()}</mesh>)}
</group>;

export const Glass: React.FC<{ p?: V; lv?: number; col?: string }> = ({ p = [0, 0, 0], lv = 0.6, col = "#f6f3ea" }) => <group position={p}>
  <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.032, 0.028, 0.12, 24, 1, true]} />{M.glass()}</mesh>
  <mesh position={[0, 0.06 * lv, 0]}><cylinderGeometry args={[0.029, 0.027, 0.12 * lv, 24]} /><meshPhysicalMaterial color={col} roughness={0.2} transparent opacity={0.85} /></mesh>
</group>;

// vela blanca: llama lenta (≤2 Hz) y halo; sin luces condicionales
export const Candle: React.FC<{ p?: V; tt: number; on: number; h?: number }> = ({ p = [0, 0, 0], tt, on, h = 0.12 }) => <group position={p}>
  <mesh position={[0, h / 2, 0]} castShadow><cylinderGeometry args={[0.02, 0.021, h, 24]} /><meshStandardMaterial color="#f5efe0" roughness={0.55} /></mesh>
  <mesh position={[0, h + 0.004, 0]}><cylinderGeometry args={[0.0015, 0.0015, 0.012, 6]} /><meshStandardMaterial color="#222" /></mesh>
  <mesh position={[0, h + 0.022 + 0.002 * Math.sin(tt * 2 * PI * 1.4), 0]} scale={[1, 2 + 0.15 * Math.sin(tt * 2 * PI * 1.1), 1]} visible={on > 0.02}><sphereGeometry args={[0.009, 14, 10]} />{M.glow({ col: "#ffd27a", op: on })}</mesh>
  <mesh position={[0, h + 0.02, 0]} visible={on > 0.02}><sphereGeometry args={[0.05, 16, 12]} />{M.glow({ col: "#ffb860", op: 0.16 * on })}</mesh>
</group>;

// silla de roble con brazos (la de la cabecera)
export const OakChair: React.FC<{ p?: V; ry?: number }> = ({ p = [0, 0, 0], ry = 0 }) => {
  const w = M.wood({ base: [128, 82, 44], rx: 1, ry: 1 });
  return <group position={p} rotation={[0, ry, 0]}>
    <RBox s={[0.46, 0.04, 0.44]} r={0.01} p={[0, 0.46, 0]}>{w}</RBox>
    {[[-0.2, -0.19], [0.2, -0.19], [-0.2, 0.19], [0.2, 0.19]].map(([x, z], i) => <mesh key={i} position={[x, 0.22, z]} castShadow><cylinderGeometry args={[0.02, 0.018, 0.46, 12]} />{w}</mesh>)}
    {[-0.2, 0.2].map((x) => <mesh key={x} position={[x, 0.75, -0.2]} castShadow><cylinderGeometry args={[0.02, 0.02, 0.6, 12]} />{w}</mesh>)}
    <RBox s={[0.44, 0.12, 0.03]} r={0.012} p={[0, 0.98, -0.2]}>{w}</RBox>
    {[0.66, 0.78].map((y) => <RBox key={y} s={[0.4, 0.03, 0.02]} r={0.008} p={[0, y, -0.2]}>{w}</RBox>)}
    {[-0.23, 0.23].map((x) => <RBox key={x} s={[0.05, 0.03, 0.42]} r={0.012} p={[x, 0.68, 0]}>{w}</RBox>)}
    {[-0.23, 0.23].map((x) => <mesh key={"a" + x} position={[x, 0.57, 0.18]}><cylinderGeometry args={[0.016, 0.016, 0.22, 10]} />{w}</mesh>)}
  </group>;
};

export const FoldChair: React.FC<{ p?: V; ry?: number; col?: string }> = ({ p = [0, 0, 0], ry = 0, col = "#9c8c72" }) => <group position={p} rotation={[0, ry, 0]}>
  <RBox s={[0.4, 0.035, 0.38]} r={0.012} p={[0, 0.45, 0]}>{M.matte({ col })}</RBox>
  <RBox s={[0.4, 0.2, 0.025]} r={0.01} p={[0, 0.78, -0.19]} rot={[-0.08, 0, 0]}>{M.matte({ col })}</RBox>
  {[-0.19, 0.19].map((x) => <React.Fragment key={x}>
    <mesh position={[x, 0.42, -0.17]} rotation={[-0.1, 0, 0]}><cylinderGeometry args={[0.011, 0.011, 0.84, 8]} />{M.steel()}</mesh>
    <mesh position={[x, 0.22, 0.12]} rotation={[0.25, 0, 0]}><cylinderGeometry args={[0.011, 0.011, 0.46, 8]} />{M.steel()}</mesh>
  </React.Fragment>)}
</group>;

export const Turkey: React.FC<{ p?: V; s?: number; platter?: boolean }> = ({ p = [0, 0, 0], s = 1, platter = true }) => <group position={p} scale={s}>
  {platter && <mesh scale={[1.5, 1, 1.05]} receiveShadow castShadow position={[0, 0.006, 0]}><cylinderGeometry args={[0.15, 0.13, 0.012, 48]} />{M.porcelain()}</mesh>}
  <mesh position={[0, 0.075, 0]} scale={[1.25, 0.72, 0.95]} castShadow><sphereGeometry args={[0.11, 32, 24]} /><meshPhysicalMaterial color="#b0611f" roughness={0.3} clearcoat={0.7} clearcoatRoughness={0.3} /></mesh>
  {[-1, 1].map((k) => <group key={k}>
    <mesh position={[0.11, 0.08, k * 0.06]} rotation={[0, 0, -0.9]} castShadow><capsuleGeometry args={[0.025, 0.07, 6, 12]} /><meshPhysicalMaterial color="#a35a1e" roughness={0.3} clearcoat={0.6} /></mesh>
    <mesh position={[0.155, 0.125, k * 0.06]}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#f3e9d6" roughness={0.5} /></mesh>
  </group>)}
  {platter && [-0.15, 0.15, -0.05, 0.08].map((x, i) => <mesh key={x} position={[x, 0.02, (i % 2 ? -1 : 1) * 0.12]}><sphereGeometry args={[0.018, 10, 8]} /><meshStandardMaterial color="#4c7a2c" roughness={0.6} /></mesh>)}
</group>;

// vapor: volutas que suben y se desvanecen (deterministas)
export const Steam: React.FC<{ p?: V; tt: number; n?: number; on?: number; w?: number; hgt?: number; sz?: number }> = ({ p = [0, 0, 0], tt, n = 34, on = 1, w = 0.06, hgt = 0.25, sz = 1 }) => <group position={p}>
  {Array.from({ length: n }, (_, i) => { const ph = (tt * 0.35 + rn(i, 2)) % 1; return <mesh key={i} position={[(rn(i, 3) - 0.5) * w + 0.02 * Math.sin(ph * 6 + i), ph * hgt, (rn(i, 4) - 0.5) * w]} scale={[sz * (0.005 + 0.012 * ph), sz * (0.005 + 0.012 * ph) * 2.6, sz * (0.005 + 0.012 * ph)]} rotation={[0, 0, 0.5 * Math.sin(ph * 5 + i)]}>
    <sphereGeometry args={[1, 12, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={on * 0.08 * Math.sin(PI * ph)} depthWrite={false} /></mesh>; })}
</group>;

// motas/partículas genéricas
export const Dots: React.FC<{ n: number; r?: number; col?: string; pos: (i: number) => number[]; op?: number | ((i: number) => number); glow?: boolean }> = ({ n, r = 0.004, col = "#fff", pos, op = 1, glow }) => <>
  {Array.from({ length: n }, (_, i) => { const o = typeof op === "number" ? op : op(i); return o > 0.01 && <mesh key={i} position={pos(i) as V}><sphereGeometry args={[r, 8, 6]} />
    {glow ? M.glow({ col, op: o }) : <meshStandardMaterial color={col} transparent opacity={o} roughness={0.8} />}</mesh>; })}
</>;

// papel/cartón con textura (tarjeta, etiqueta, foto)
export const Card: React.FC<{ map: THREE.Texture; w: number; h: number; p?: V; rot?: V; th?: number }> = ({ map, w, h, p = [0, 0, 0], rot = [0, 0, 0], th = 0.002 }) => <mesh position={p} rotation={rot} castShadow receiveShadow>
  <boxGeometry args={[w, th, h]} />
  {[0, 1].map((i) => <meshStandardMaterial key={i} attach={`material-${i}`} color="#efe9da" roughness={0.8} />)}
  <meshStandardMaterial attach="material-2" map={map} roughness={0.75} />
  <meshStandardMaterial attach="material-3" color="#efe9da" roughness={0.8} />
  {[4, 5].map((i) => <meshStandardMaterial key={i} attach={`material-${i}`} color="#efe9da" roughness={0.8} />)}
</mesh>;

// taza de té con platito (rositas)
export const Teacup: React.FC<{ p?: V; ry?: number; steam?: number; tt?: number }> = ({ p = [0, 0, 0], ry = 0, steam = 0, tt = 0 }) => <group position={p} rotation={[0, ry, 0]}>
  <mesh position={[0, 0.005, 0]} castShadow receiveShadow><cylinderGeometry args={[0.075, 0.055, 0.01, 40]} />{M.porcelain()}</mesh>
  <mesh position={[0, 0.0105, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.066, 0.072, 40]} /><meshStandardMaterial color="#d4a63e" metalness={0.8} roughness={0.3} /></mesh>
  <mesh position={[0, 0.045, 0]} castShadow><cylinderGeometry args={[0.05, 0.03, 0.065, 40, 1, true]} /><meshPhysicalMaterial map={roseTex()} roughness={0.15} clearcoat={1} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.013, 0]}><cylinderGeometry args={[0.03, 0.03, 0.004, 30]} />{M.porcelain()}</mesh>
  <mesh position={[0, 0.066, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.046, 30]} /><meshPhysicalMaterial color="#4a2a16" roughness={0.1} clearcoat={1} /></mesh>
  <mesh position={[0.056, 0.048, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.016, 0.004, 8, 20, PI]} />{M.porcelain()}</mesh>
  {steam > 0 && <Steam p={[0, 0.07, 0]} tt={tt} on={steam} n={14} w={0.022} hgt={0.24} />}
</group>;

// pastel de calabaza; crust 0..1 = qué tan oscuro quedó el borde
export const Pie: React.FC<{ p?: V; crust?: number; cut?: number }> = ({ p = [0, 0, 0], crust = 0, cut = 0 }) => {
  const c = new THREE.Color("#d9a35c").lerp(new THREE.Color("#5a2f12"), crust);
  const arc = PI * 2 - (cut > 0 ? PI / 4 : 0);
  return <group position={p}>
    <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.15, 0.13, 0.012, 48]} />{M.glass({ op: 0.4, col: "#dfeee8" })}</mesh>
    <mesh position={[0, 0.025, 0]} rotation={[0, PI / 8, 0]}><cylinderGeometry args={[0.125, 0.11, 0.035, 48, 1, false, 0, arc]} /><meshStandardMaterial color="#c4702a" roughness={0.45} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.042, 0]} rotation={[PI / 2, 0, PI / 8]}><torusGeometry args={[0.128, 0.016, 12, 48, arc]} /><meshStandardMaterial color={c} roughness={0.6} /></mesh>
  </group>;
};

export const Roll: React.FC<{ p?: V; s?: number }> = ({ p = [0, 0, 0], s = 1 }) => <mesh position={p} scale={[s, s * 0.7, s]} castShadow><sphereGeometry args={[0.035, 18, 14]} /><meshPhysicalMaterial color="#d79a52" roughness={0.4} clearcoat={0.5} /></mesh>;

// canasta de pan (mimbre) con servilleta
export const Basket: React.FC<{ p?: V; s?: number }> = ({ p = [0, 0, 0], s = 1 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.05, 0]} scale={[1.4, 1, 1]} castShadow receiveShadow><cylinderGeometry args={[0.15, 0.11, 0.1, 40, 4, true]} /><meshStandardMaterial map={tex.wood(8, 1, [170, 120, 64])} roughness={0.85} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.004, 0]} scale={[1.4, 1, 1]}><cylinderGeometry args={[0.11, 0.11, 0.008, 40]} /><meshStandardMaterial map={tex.wood(8, 1, [150, 104, 56])} roughness={0.85} /></mesh>
  <mesh position={[0, 0.1, 0]} scale={[1.4, 1, 1]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.15, 0.012, 10, 48]} /><meshStandardMaterial map={tex.wood(8, 1, [160, 112, 60])} roughness={0.85} /></mesh>
  {/* la servilleta que forra la canasta y asoma por el borde */}
  <mesh position={[0, 0.07, 0]} scale={[1.4, 1, 1]}><cylinderGeometry args={[0.143, 0.1, 0.07, 40, 2, true]} /><meshStandardMaterial map={checkTex("#c25a4a")} roughness={0.9} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.012, 0]} scale={[1.4, 1, 1]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.1, 32]} /><meshStandardMaterial map={checkTex("#c25a4a")} roughness={0.9} /></mesh>
  {[0, 1].map((i) => <mesh key={i} position={[(i ? 1 : -1) * 0.205, 0.09, 0]} rotation={[0, 0, (i ? -1 : 1) * 1.2]}><planeGeometry args={[0.07, 0.12]} /><meshStandardMaterial map={checkTex("#c25a4a")} roughness={0.9} side={THREE.DoubleSide} /></mesh>)}
</group>;
export { cl };
