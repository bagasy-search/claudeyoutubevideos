// v3: contadores tipo odómetro, gráfico de PBI real (Maddison 2023) y relieve 3D real (Terrarium/AWS + three.js)
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, staticFile, spring, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const pop = (f: number, t0: number, damping = 11) => spring({ frame: f - t0 * FPS, fps: FPS, config: { damping, stiffness: 180, mass: 0.6 } });

// ───────── odómetro: cada dígito rueda en su columna ─────────
export const Odometer: React.FC<{ value: number; p: number; size: number; color?: string; prefix?: string; font: string }> = ({ value, p, size, color = "#fff", prefix = "$", font }) => {
  const v = Math.round(value) * p;
  const digits = String(Math.round(value)).length;
  const cols: React.ReactNode[] = [];
  for (let k = digits - 1; k >= 0; k--) {
    // odómetro real: un dígito sólo rueda cuando el de abajo está pasando de 9 a 0
    const low = k === 0 ? 0 : (v % 10 ** k) / 10 ** k;
    const d = k === 0 ? v % 10 : (Math.floor(v / 10 ** k) % 10) + Math.min(1, Math.max(0, low * 10 - 9));
    cols.push(
      <span key={k} style={{ display: "inline-block", height: size * 1.1, overflow: "hidden", verticalAlign: "top" }}>
        <span style={{ display: "block", transform: `translateY(${-d * size * 1.1}px)` }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, i) => <span key={i} style={{ display: "block", height: size * 1.1, lineHeight: `${size * 1.1}px` }}>{n}</span>)}
        </span>
      </span>,
    );
    if (k % 3 === 0 && k > 0) cols.push(<span key={"c" + k} style={{ display: "inline-block", lineHeight: `${size * 1.1}px` }}>,</span>);
  }
  return <span style={{ fontFamily: font, fontWeight: 900, fontSize: size, color, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", display: "inline-flex" }}><span style={{ lineHeight: `${size * 1.1}px` }}>{prefix}</span>{cols}</span>;
};

// contador anclado a pantalla: caja + odómetro + rótulo
export const Counter: React.FC<{ f: number; t: number; t0: number; t1: number; x: number; y: number; value: number; label: string; color?: string; size?: number; font: string; bg?: string }> = ({ f, t, t0, t1, x, y, value, label, color = "#ffd23a", size = 46, font, bg = "rgba(12,14,20,.9)" }) => {
  if (t < t0 - 0.05 || t > t1 + 0.05) return null;
  const s = pop(f, t0, 12) * interpolate(t, [t1 - 0.3, t1], [1, 0], clamp);
  const p = interpolate(t, [t0 + 0.05, t0 + 1.1], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, background: bg, border: "2px solid rgba(255,255,255,.85)", borderRadius: 10, padding: "6px 16px 8px", boxShadow: "0 8px 22px rgba(0,0,0,.5)", textAlign: "center" }}>
      <Odometer value={value} p={p} size={size} color={color} font={font} />
      <div style={{ fontFamily: font, fontWeight: 800, fontSize: size * 0.36, color: "#fff", letterSpacing: 1, textTransform: "uppercase", opacity: 0.85 }}>{label}</div>
    </div>
  );
};

// ───────── relieve 3D real ─────────
type Box = { L: number; R: number; T: number; B: number };
export const TERRAINS: Record<string, Box> = { nbc: { L: -134.5, R: -119.5, T: 60, B: 52 } };
// cámara: [t, lon, lat, alto, lookLon, lookLat, lookAlto]
export type TKey = [number, number, number, number, number, number, number];

// precarga: se llama desde Main (siempre montado) para que ningún cuadro se capture sin textura
export let TEX: Record<string, THREE.Texture> = {};
export const useTerrainTextures = () => {
  const [h] = useState(() => delayRender("terrain textures"));
  const [tex, setTex] = useState<Record<string, THREE.Texture>>({});
  useEffect(() => {
    const names = Object.keys(TERRAINS).flatMap((n) => [`terrain_${n}_c.jpg`, `terrain_${n}_h.png`]);
    const out: Record<string, THREE.Texture> = {};
    let left = names.length;
    for (const nm of names) {
      new THREE.TextureLoader().load(staticFile("cgordie1/" + nm), (x) => {
        if (nm.endsWith("_c.jpg")) x.colorSpace = THREE.SRGBColorSpace;
        x.anisotropy = 8; x.generateMipmaps = true; x.minFilter = THREE.LinearMipmapLinearFilter;
        out[nm] = x;
        // también guardo los píxeles del mapa de altura para que la cámara nunca atraviese una montaña
        if (nm.endsWith("_h.png")) { const img = x.image as HTMLImageElement; const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; const g = c.getContext("2d")!; g.drawImage(img, 0, 0); HEIGHTS[nm] = { w: img.width, h: img.height, d: g.getImageData(0, 0, img.width, img.height).data }; }
        if (--left === 0) { TEX = { ...out }; setTex({ ...out }); requestAnimationFrame(() => continueRender(h)); }
      }, undefined, () => { if (--left === 0) continueRender(h); });
    }
  }, [h]);
  return tex;
};
const HEIGHTS: Record<string, { w: number; h: number; d: Uint8ClampedArray }> = {};
const DISP = 0.6;
// altura del terreno (unidades de escena) en lon/lat, tomando el máximo en un radio para dejar margen
const groundAt = (name: string, b: Box, lon: number, lat: number) => {
  const H = HEIGHTS[`terrain_${name}_h.png`]; if (!H) return 0;
  let m = 0;
  for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++) {
    const x = Math.round((lon - b.L) / (b.R - b.L) * H.w) + dx * 6, y = Math.round((b.T - lat) / (b.T - b.B) * H.h) + dy * 6;
    if (x < 0 || y < 0 || x >= H.w || y >= H.h) continue;
    m = Math.max(m, H.d[(y * H.w + x) * 4]);
  }
  return m / 255 * DISP;
};
const useTex = (src: string, color: boolean) => {
  const [h] = useState(() => delayRender("tex " + src));
  const [tx, setTx] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    new THREE.TextureLoader().load(staticFile("cgordie1/" + src), (x) => { if (color) x.colorSpace = THREE.SRGBColorSpace; x.anisotropy = 8; setTx(x); continueRender(h); }, undefined, () => continueRender(h));
  }, [src, h, color]);
  return tx;
};
// al desmontar, soltar el contexto WebGL: si no, tras varios montajes el navegador pierde contextos y salen cuadros sin relieve
const FreeGL: React.FC = () => {
  const { gl } = useThree();
  useEffect(() => () => { gl.dispose(); gl.forceContextLoss(); }, [gl]);
  return null;
};
const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3 }> = ({ pos, look }) => {
  const { camera } = useThree();
  camera.position.copy(pos); camera.lookAt(look);
  return null;
};

export const Terrain3D: React.FC<{ name: string; t: number; t0: number; t1: number; keys: TKey[]; label?: string; font: string; tex: Record<string, THREE.Texture>; children?: React.ReactNode }> = ({ name, t, t0, t1, keys, label, font, tex, children }) => {
  const b = TERRAINS[name];
  const cosφ = Math.cos(((b.T + b.B) / 2) * Math.PI / 180);
  const cx = (b.L + b.R) / 2, cy = (b.T + b.B) / 2;
  const PW = (b.R - b.L) * cosφ, PH = b.T - b.B;
  const P3 = (lon: number, lat: number, h: number) => new THREE.Vector3((lon - cx) * cosφ, h, -(lat - cy));
  // cada montaje espera sus propias texturas (delayRender): ningún cuadro sale sin relieve aunque la precarga global falle
  const colL = useTex(`terrain_${name}_c.jpg`, true), hmL = useTex(`terrain_${name}_h.png`, false);
  const col = tex[`terrain_${name}_c.jpg`] ?? colL, hm = tex[`terrain_${name}_h.png`] ?? hmL;
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
  const a = keys[i], z = keys[i + 1];
  const k = ease(Math.min(1, Math.max(0, (t - a[0]) / (z[0] - a[0]))));
  const L = (j: number) => a[j] + (z[j] - a[j]) * k;
  // la cámara vuela siempre por encima del relieve (antes atravesaba los picos: montañas que aparecían y desaparecían)
  const camH = Math.max(L(3), groundAt(name, b, L(1), L(2)) + 0.35);
  const pos = P3(L(1), L(2), camH), look = P3(L(4), L(5), L(6));
  // entrada/salida: "atravesar" el mapa (escala + blur), sin corte
  const inn = interpolate(t, [t0, t0 + 0.35], [0, 1], clamp), out = interpolate(t, [t1 - 0.35, t1], [1, 0], clamp);
  const o = Math.min(inn, out);
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${1 + 0.18 * (1 - inn) - 0.06 * (1 - out)})`, filter: o < 0.99 ? `blur(${(1 - o) * 14}px)` : undefined }}>
      <AbsoluteFill style={{ background: "linear-gradient(#78acdb 0%, #b6d8f1 22%, #cfe6f6 34%, #cfe6f6 100%)" }} />
      <ThreeCanvas width={1920} height={1080} gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }} camera={{ fov: 42, near: 0.1, far: 400, position: [0, 5, 5] }}>
        <Cam pos={pos} look={look} />
        <FreeGL />
        <fog attach="fog" args={["#cfe6f6", 8, 26]} />
        <ambientLight intensity={1.15} />
        <directionalLight position={[-8, 6, -3]} intensity={2.0} color="#fff1dc" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
          <planeGeometry args={[PW * 60, PH * 60]} />
          <meshStandardMaterial color="#4b93d6" roughness={0.35} metalness={0.1} />
        </mesh>
        {col && hm ? (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[PW, PH, 1024, 900]} />
            <meshStandardMaterial map={col} displacementMap={hm} displacementScale={DISP} roughness={0.95} metalness={0} />
          </mesh>
        ) : null}
      </ThreeCanvas>
      {children}
      {label && (
        <div style={{ position: "absolute", left: 960, top: 860, transform: `translateX(-50%) scale(${interpolate(t, [t0 + 0.25, t0 + 0.55], [0.6, 1], { ...clamp, easing: Easing.out(Easing.back(2)) })})`, opacity: interpolate(t, [t0 + 0.25, t0 + 0.45], [0, 1], clamp), background: "#111", color: "#fff", fontFamily: font, fontWeight: 900, fontSize: 52, padding: "8px 26px 10px", borderRadius: 8, border: "3px solid rgba(255,255,255,.9)", textTransform: "uppercase", letterSpacing: 2, boxShadow: "0 10px 30px rgba(0,0,0,.45)" }}>
          {label}
        </div>
      )}
    </AbsoluteFill>
  );
};
