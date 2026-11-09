// ohf9na · piezas 3D del moho: mancha negra, botellas, cronómetro, placas, sobres. Todo en metros de escena.
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { continueRender, delayRender, staticFile } from "remotion";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, rn, tex } from "./h3d";

export type V = [number, number, number];
export const PI = Math.PI;

export const moldTex = (seed: number, base = "#0c0b0a") => tex.text("mold" + seed + base, 512, 512, (g) => {
  g.clearRect(0, 0, 512, 512);
  for (let i = 0; i < 1500; i++) {
    const a = rn(i, seed + 1) * PI * 2, d = Math.pow(rn(i, seed + 2), 1.5) * 235, x = 256 + Math.cos(a) * d * (0.8 + 0.3 * Math.sin(a * 3 + seed)), y = 256 + Math.sin(a) * d * (0.85 + 0.25 * Math.cos(a * 2 + seed));
    g.globalAlpha = (1 - d / 300) * 0.8; g.fillStyle = base;
    g.beginPath(); g.arc(x, y, 2 + rn(i, seed + 3) * (d < 120 ? 26 : 8), 0, PI * 2); g.fill();
  }
  g.globalAlpha = 1;
});

export const Patch: React.FC<{ p?: V; rot?: V; w?: number; k?: number; op?: number; seed?: number; base?: string }> = ({ p = [0, 0.5, -0.49], rot = [0, 0, 0], w = 0.7, k = 1, op = 1, seed = 1, base }) =>
  <mesh position={p} rotation={rot} scale={[Math.max(0.001, k), Math.max(0.001, k), 1]}><planeGeometry args={[w, w]} /><meshStandardMaterial map={moldTex(seed, base)} transparent opacity={op} depthWrite={false} roughness={0.95} /></mesh>;

// una palabra grande pintada en un plano
export const Word: React.FC<{ txt: string; p?: V; rot?: V; w?: number; col?: string; k?: number; op?: number; font?: string }> = ({ txt, p = [0, 0.5, 0], rot = [0, 0, 0], w = 0.8, col = "#f7f4ee", k = 1, op = 1, font = "800 150px Georgia, serif" }) => {
  const W = Math.max(256, Math.round(txt.length * 104 + 80));
  const tx = tex.text("word" + txt + col + font, W, 220, (g) => { g.clearRect(0, 0, W, 220); g.fillStyle = col; g.font = font; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, W / 2, 116); });
  return <mesh position={p} rotation={rot} scale={[Math.max(0.001, k), Math.max(0.001, k), 1]}><planeGeometry args={[w, w * 220 / W]} /><meshBasicMaterial map={tx} transparent opacity={op} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} /></mesh>;
};

export const Bottle: React.FC<{ p?: V; rot?: V; s?: number; col?: string; fill?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, col = "#f3f1ea", fill = 0.7 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.13, 0]} castShadow><cylinderGeometry args={[0.058, 0.066, 0.26, 32]} />{M.plastic({ col, op: 0.82 })}</mesh>
  <mesh position={[0, 0.02 + 0.12 * fill, 0]}><cylinderGeometry args={[0.054, 0.06, 0.24 * fill, 32]} />{M.water({ col: "#9cc7de", op: 0.55 })}</mesh>
  <mesh position={[0, 0.285, 0]} castShadow><cylinderGeometry args={[0.024, 0.04, 0.05, 20]} />{M.plastic({ col: "#e9e4d8" })}</mesh>
  <RBox s={[0.13, 0.04, 0.05]} p={[0.03, 0.325, 0]} r={0.012}>{M.plastic({ col: "#2f6fa8" })}</RBox>
  <RBox s={[0.022, 0.08, 0.028]} p={[-0.012, 0.272, 0]} r={0.006}>{M.plastic({ col: "#2f6fa8" })}</RBox>
</group>;

export const Jug: React.FC<{ p?: V; s?: number; col?: string; ghost?: number }> = ({ p = [0, 0, 0], s = 1, col = "#f4f2ec", ghost = 0 }) => <group position={p} scale={s}>
  <RBox s={[0.26, 0.36, 0.17]} p={[0, 0.18, 0]} r={0.04}>{M.plastic({ col, op: 1 - 0.78 * ghost })}</RBox>
  <mesh position={[0, 0.39, 0]} castShadow><cylinderGeometry args={[0.042, 0.05, 0.07, 24]} />{M.plastic({ col: "#2f6fa8" })}</mesh>
</group>;

export const Dial: React.FC<{ id: string; v: number; p?: V; rot?: V; r?: number; marks?: number; col?: string; red?: [number, number]; green?: [number, number]; rim?: "chrome" | "brass" }> = ({ id, v, p = [0, 0.5, 0], rot = [0, 0, 0], r = 0.22, marks = 60, col = "#f3ecdc", red, green, rim = "chrome" }) => {
  const a = v * PI * 2;
  const face = tex.text("dial" + id, 512, 512, (g) => {
    g.fillStyle = col; g.beginPath(); g.arc(256, 256, 256, 0, PI * 2); g.fill();
    const arc = (q: [number, number], c: string) => { g.strokeStyle = c; g.lineWidth = 42; g.beginPath(); g.arc(256, 256, 196, q[0] * PI * 2 - PI / 2, q[1] * PI * 2 - PI / 2); g.stroke(); };
    if (green) arc(green, "#3f9a60"); if (red) arc(red, "#b3261e");
    g.strokeStyle = "#1b1b1b"; for (let i = 0; i < marks; i++) { const b = i / marks * PI * 2, big = i % 5 === 0; g.lineWidth = big ? 6 : 2; g.beginPath(); g.moveTo(256 + Math.sin(b) * 232, 256 - Math.cos(b) * 232); g.lineTo(256 + Math.sin(b) * (big ? 200 : 216), 256 - Math.cos(b) * (big ? 200 : 216)); g.stroke(); }
  });
  return <group position={p} rotation={rot}>
    <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[r * 1.08, r * 1.08, 0.04, 56]} />{rim === "brass" ? M.brass() : M.chrome()}</mesh>
    <mesh position={[0, 0, 0.021]}><circleGeometry args={[r, 56]} /><meshStandardMaterial map={face} roughness={0.5} /></mesh>
    <group position={[0, 0, 0.03]} rotation={[0, 0, -a]}><RBox s={[r * 0.05, r * 0.92, 0.004]} p={[0, r * 0.4, 0]} r={0.001} shadow={false}>{M.matte({ col: "#b3261e" })}</RBox></group>
    <mesh position={[0, 0, 0.034]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[r * 0.06, r * 0.06, 0.008, 20]} />{M.brass()}</mesh>
  </group>;
};

export const Petri: React.FC<{ p?: V; s?: number; seed?: number; k?: number; base?: string; ry?: number }> = ({ p = [0, 0, 0], s = 1, seed = 2, k = 1, base, ry = 0 }) => <group position={p} scale={s} rotation={[0, ry, 0]}>
  <mesh position={[0, 0.012, 0]} castShadow><cylinderGeometry args={[0.15, 0.15, 0.024, 48]} />{M.matte({ col: "#d8cfae" })}</mesh>
  <Patch p={[0, 0.0255, 0]} rot={[-PI / 2, 0, 0]} w={0.27} k={k} seed={seed} base={base} />
  <mesh position={[0, 0.022, 0]}><cylinderGeometry args={[0.158, 0.158, 0.044, 48, 1, true]} />{M.glass({ op: 0.3, side: THREE.DoubleSide })}</mesh>
</group>;

const FLAP = new THREE.Shape(); FLAP.moveTo(-0.3, 0); FLAP.lineTo(0.3, 0); FLAP.lineTo(0, -0.27); FLAP.closePath();
export const Envelope: React.FC<{ p?: V; rot?: V; s?: number; open?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, open = 0 }) => <group position={p} rotation={rot} scale={s}>
  <RBox s={[0.6, 0.38, 0.014]} r={0.004}>{M.matte({ col: "#d9c49b" })}</RBox>
  {open > 0.2 && <>
    <RBox s={[0.355, 0.007, 0.002]} p={[-0.15, -0.095, 0.009]} rot={[0, 0, 0.564]} r={0.001} shadow={false}>{M.matte({ col: "#8f7a54" })}</RBox>
    <RBox s={[0.355, 0.007, 0.002]} p={[0.15, -0.095, 0.009]} rot={[0, 0, -0.564]} r={0.001} shadow={false}>{M.matte({ col: "#8f7a54" })}</RBox>
    <mesh position={[-0.05, 0.08, 0.012]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.034, 0.012, 7]} />{M.rubber({ col: "#8c1d18" })}</mesh>
    <mesh position={[0.045, 0.045, 0.012]} rotation={[PI / 2, 0.5, 0]}><cylinderGeometry args={[0.026, 0.03, 0.012, 6]} />{M.rubber({ col: "#8c1d18" })}</mesh>
  </>}
  <group position={[0, 0.19, 0.0085]} rotation={[-open * 2.7, 0, 0]}>
    <mesh><shapeGeometry args={[FLAP]} /><meshStandardMaterial color="#cdb68a" roughness={0.9} side={THREE.DoubleSide} /></mesh>
    {open < 0.15 && <mesh position={[0, -0.215, 0.009]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.052, 0.058, 0.016, 30]} />{M.rubber({ col: "#8c1d18" })}</mesh>}
  </group>
</group>;

export const Plate: React.FC<{ txt: string; p?: V; rot?: V; w?: number; ink?: string; mate?: boolean }> = ({ txt, p = [0, 0.5, 0], rot = [0, 0, 0], w = 1, ink = "#2a1c0a", mate = false }) => <group position={p} rotation={rot}>
  <RBox s={[w, w * 0.34, 0.03]} r={0.01}>{mate ? M.matte({ col: "#bb9542" }) : M.brass()}</RBox>
  <Word txt={txt} p={[0, 0, 0.02]} w={w * 0.86} col={ink} />
</group>;

export const Slab: React.FC<{ s: V; p?: V; col?: string; rot?: V; op?: number }> = ({ s, p = [0, 0, 0], col = "#cfc8b4", rot = [0, 0, 0], op = 1 }) => <RBox s={s} p={p} rot={rot} r={0.004}>{M.matte({ col, op })}</RBox>;

export const Swab: React.FC<{ p?: V; rot?: V; s?: number; tip?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, tip = "#f6f4ef" }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.004, 0.004, 0.32, 10]} />{M.matte({ col: "#efe6d2" })}</mesh>
  <mesh position={[0, 0.33, 0]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.016, 18, 18]} />{M.matte({ col: tip })}</mesh>
</group>;

export const Tag: React.FC<{ p?: V; rot?: V; w?: number; h?: number; col?: string; children?: React.ReactNode }> = ({ p = [0, 0, 0], rot = [0, 0, 0], w = 0.32, h = 0.42, col = "#e8dcbc", children }) => <group position={p} rotation={rot}>
  <RBox s={[w, h, 0.008]} r={0.005}>{M.matte({ col })}</RBox>{children}
</group>;

// escena estándar frente a la pared de yeso verde: todos los componentes del moho viven en el mismo cuarto
export const W3: React.FC<{ t: number; h: H; mode?: "iris" | "wipe" | "split" | "drop"; cam?: { at: number[]; az: [number, number]; el: [number, number]; r: [number, number]; fov?: number }; wall?: "sage" | "plaster" | "peel" | "brick" | "paper"; floor?: "oak" | "wood" | "none" | "tile"; bg?: string; children: (tt: number) => React.ReactNode }> = ({ t, h, mode = "iris", cam, wall = "sage", floor = "oak", bg = "#171512", children }) =>
  <Scene3D t={t} h={h} mode={mode} floor={floor} wall={wall} wallZ={-0.5} bg={bg} key1={[-0.9, 2.2, 1.6]} cam={cam ?? { at: [0, 0.55, 0], az: [-0.26, 0.2], el: [0.09, 0.15], r: [2.05, 1.72], fov: 34 }}>{(tt) => children(tt)}</Scene3D>;

// una foto real como textura de un plano (espera a que cargue antes de renderizar)
const FOTOS = new Map<string, THREE.Texture>();
export const Foto: React.FC<{ src: string; p?: V; rot?: V; w: number; h: number }> = ({ src, p = [0, 0, 0], rot = [0, 0, 0], w, h }) => {
  const [t, setT] = useState<THREE.Texture | null>(FOTOS.get(src) ?? null);
  const adv = useThree((q) => q.advance);
  useEffect(() => {
    if (FOTOS.has(src)) return;
    const d = delayRender("foto " + src);
    new THREE.TextureLoader().load(staticFile(src), (x) => { x.colorSpace = THREE.SRGBColorSpace; FOTOS.set(src, x); setT(x); setTimeout(() => { adv(performance.now()); setTimeout(() => continueRender(d), 90); }, 60); }, undefined, () => continueRender(d));
  }, [src, adv]);
  return <mesh position={p} rotation={rot}><planeGeometry args={[w, h]} />{t ? <meshStandardMaterial key="foto" map={t} roughness={0.7} /> : <meshStandardMaterial key="gris" color="#222" />}</mesh>;
};

export const tick = cl;
