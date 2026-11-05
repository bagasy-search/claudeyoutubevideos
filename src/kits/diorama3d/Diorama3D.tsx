// DIORAMA 3D — una foto se vuelve un mundo con relieve (mapa de profundidad -> malla desplazada) y la cámara
// lo recorre en UNA sola toma, con niebla y nubes en capas como transición. Unidades: metros. Y arriba, la
// cámara mira hacia -Z (convención three.js). Todo unlit (MeshBasicMaterial): la foto se ve tal cual es.
// Piezas: <Relieve/> (foto + profundidad), <Recorte/> (PNG con alfa: nubes, plantas), <Toma/> (cámara por
// keyframes con curva Catmull-Rom + balanceo de mano lento), <Atmosfera/> (fondo + niebla animados).
import React, { useEffect, useMemo, useState } from "react";
import { ThreeCanvas } from "@remotion/three";
import { continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// ---------- carga de texturas con redibujo (gotcha: ThreeCanvas no redibuja si la textura llega tarde) ----------
const cacheTex = new Map<string, THREE.Texture>();
const cacheDepth = new Map<string, { w: number; h: number; d: Float32Array }>();
function cargarImg(src: string): Promise<HTMLImageElement> {
  return new Promise((ok, mal) => { const im = new Image(); im.crossOrigin = "anonymous"; im.onload = () => ok(im); im.onerror = mal; im.src = staticFile(src); });
}
// redibujar DESPUÉS de que React montó la malla con la textura (varias veces por las dudas) y recién ahí soltar el cuadro
function avisar(h: number | null) {
  const ev = () => window.dispatchEvent(new Event("img3d"));
  [30, 90, 180].forEach((ms) => setTimeout(ev, ms));
  setTimeout(() => h !== null && continueRender(h), 260);
}
function useTextura(src: string, aniso = 4) {
  const [tex, setTex] = useState<THREE.Texture | null>(cacheTex.get(src) ?? null);
  const [h] = useState(() => (cacheTex.has(src) ? null : delayRender("tex " + src)));
  useEffect(() => {
    if (tex) return;
    cargarImg(src).then((im) => {
      const t = new THREE.Texture(im); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.needsUpdate = true;
      cacheTex.set(src, t); setTex(t); avisar(h);
    });
  }, [src]);
  return tex;
}
function useProfundidad(src: string) {
  const [dp, setDp] = useState(cacheDepth.get(src) ?? null);
  const [h] = useState(() => (cacheDepth.has(src) ? null : delayRender("depth " + src)));
  useEffect(() => {
    if (dp) return;
    cargarImg(src).then((im) => {
      const c = document.createElement("canvas"); c.width = im.width; c.height = im.height;
      const cx = c.getContext("2d")!; cx.drawImage(im, 0, 0);
      const px = cx.getImageData(0, 0, im.width, im.height).data; const d = new Float32Array(im.width * im.height);
      for (let i = 0; i < d.length; i++) d[i] = px[i * 4] / 255;
      const r = { w: im.width, h: im.height, d }; cacheDepth.set(src, r); setDp(r); avisar(h);
    });
  }, [src]);
  return dp;
}
export const Redibuja: React.FC = () => {
  const advance = useThree((s) => s.advance);
  useEffect(() => { const f = () => advance(performance.now()); window.addEventListener("img3d", f); return () => window.removeEventListener("img3d", f); }, [advance]);
  return null;
};

// ---------- foto con relieve ----------
type V3 = [number, number, number];
// rasgar: los triángulos que unen un objeto cercano con el fondo (salto de profundidad) se cortan, en vez de
// estirarse como goma; detrás queda una copia plana de la foto que tapa el hueco.
export const Relieve: React.FC<{ foto: string; prof: string; ancho: number; relieve: number; pos: V3; rot?: V3; seg?: number; aspecto?: number; piso?: number; rasgar?: number; niebla?: boolean; visible?: boolean }> =
  ({ foto, prof, ancho, relieve, pos, rot = [0, 0, 0], seg = 320, aspecto = 16 / 9, piso = 0, rasgar = 0.07, niebla = true, visible = true }) => {
  const tex = useTextura(foto); const dp = useProfundidad(prof);
  const geo = useMemo(() => {
    const alto = ancho / aspecto; const sx = seg, sy = Math.round(seg / aspecto);
    const g = new THREE.PlaneGeometry(ancho, alto, sx, sy);
    if (dp) {
      const p = g.attributes.position as THREE.BufferAttribute; const uv = g.attributes.uv as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        const u = uv.getX(i), v = 1 - uv.getY(i);
        // muestreo bilineal del mapa de profundidad (disparidad: 1 = cerca)
        const fx = u * (dp.w - 1), fy = v * (dp.h - 1); const x0 = Math.floor(fx), y0 = Math.floor(fy);
        const x1 = Math.min(dp.w - 1, x0 + 1), y1 = Math.min(dp.h - 1, y0 + 1); const ax = fx - x0, ay = fy - y0;
        const s = (xx: number, yy: number) => dp.d[yy * dp.w + xx];
        let d = (s(x0, y0) * (1 - ax) + s(x1, y0) * ax) * (1 - ay) + (s(x0, y1) * (1 - ax) + s(x1, y1) * ax) * ay;
        d = d < piso ? 0 : (d - piso) / (1 - piso);
        p.setZ(i, Math.pow(d, 1.25) * relieve);
      }
      if (rasgar > 0) {
        const idx = g.index!.array; const keep: number[] = []; const lim = rasgar * relieve;
        for (let k = 0; k < idx.length; k += 3) {
          const a = p.getZ(idx[k]), b = p.getZ(idx[k + 1]), c = p.getZ(idx[k + 2]);
          if (Math.max(a, b, c) - Math.min(a, b, c) <= lim) keep.push(idx[k], idx[k + 1], idx[k + 2]);
        }
        g.setIndex(keep);
      }
      g.computeVertexNormals();
    }
    return g;
  }, [dp, ancho, relieve, seg, aspecto, piso]);
  if (!tex) return null;
  return (
    <group position={pos} rotation={rot} visible={visible}>
      <mesh geometry={geo}><meshBasicMaterial map={tex} fog={niebla} side={THREE.DoubleSide} /></mesh>
      {rasgar > 0 && <mesh position={[0, 0, -0.05]}><planeGeometry args={[ancho, ancho / aspecto]} /><meshBasicMaterial map={tex} fog={niebla} /></mesh>}
    </group>
  );
};

// ---------- recorte con alfa (nube, planta) ----------
export const Recorte: React.FC<{ src: string; ancho: number; aspecto: number; pos: V3; rot?: V3; opacidad?: number; nube?: boolean; tinte?: string; visible?: boolean }> =
  ({ src, ancho, aspecto, pos, rot = [0, 0, 0], opacidad = 1, nube = false, tinte = "#ffffff", visible = true }) => {
  const tex = useTextura(src, 1);
  if (!tex) return null;
  return (
    <mesh position={pos} rotation={rot} visible={visible} renderOrder={nube ? 2 : 1}>
      <planeGeometry args={[ancho, ancho / aspecto]} />
      <meshBasicMaterial map={tex} color={tinte} transparent opacity={opacidad} alphaTest={nube ? 0.05 : 0.35} depthWrite={!nube} fog side={THREE.DoubleSide} />
    </mesh>
  );
};

// ---------- cámara: keyframes (s, posición, mira) por curva suave + balanceo de mano lento ----------
export type Clave = { t: number; pos: V3; mira: V3 };
const suave = Easing.bezier(0.42, 0, 0.58, 1);
export function muestreo(claves: Clave[], t: number) {
  const pc = new THREE.CatmullRomCurve3(claves.map((k) => new THREE.Vector3(...k.pos)), false, "centripetal");
  const mc = new THREE.CatmullRomCurve3(claves.map((k) => new THREE.Vector3(...k.mira)), false, "centripetal");
  let i = 0; while (i < claves.length - 2 && t > claves[i + 1].t) i++;
  const a = claves[i], b = claves[i + 1]; const f = Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t)));
  // velocidad: suave dentro de cada tramo pero sin frenar a cero entre tramos (mezcla 50 % lineal)
  const fe = 0.5 * f + 0.5 * suave(f);
  const u = (i + fe) / (claves.length - 1);
  return { pos: pc.getPoint(u), mira: mc.getPoint(u) };
}
export const Toma: React.FC<{ claves: Clave[]; fov: number; mano?: number }> = ({ claves, fov, mano = 1 }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const { pos, mira } = muestreo(claves, t);
  const bx = Math.sin(t * 0.63) * 0.06 * mano + Math.sin(t * 1.37 + 1) * 0.025 * mano;
  const by = Math.sin(t * 0.81 + 2) * 0.05 * mano;
  cam.position.set(pos.x + bx, pos.y + by, pos.z);
  cam.fov = fov; cam.near = 0.05; cam.far = 600; cam.updateProjectionMatrix();
  cam.lookAt(mira.x + bx * 0.6, mira.y + by * 0.6, mira.z);
  cam.rotateZ(Math.sin(t * 0.45) * 0.006 * mano);
  return null;
};

// ---------- atmósfera: fondo + niebla interpolados por tiempo ----------
export type Aire = { t: number; color: string; cerca: number; lejos: number; fondo?: string };  // fondo: color del cielo detrás (si no, = niebla)
export const Atmosfera: React.FC<{ aire: Aire[] }> = ({ aire }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const scene = useThree((s) => s.scene);
  let i = 0; while (i < aire.length - 2 && t > aire[i + 1].t) i++;
  const a = aire[i], b = aire[Math.min(i + 1, aire.length - 1)];
  const f = b.t === a.t ? 0 : suave(Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t))));
  const c = new THREE.Color(a.color).lerp(new THREE.Color(b.color), f);
  const fa = new THREE.Color(a.fondo ?? a.color), fb = new THREE.Color(b.fondo ?? b.color);
  scene.background = fa.lerp(fb, f);
  scene.fog = new THREE.Fog(c, a.cerca + (b.cerca - a.cerca) * f, a.lejos + (b.lejos - a.lejos) * f);
  return null;
};

export const Lienzo: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} gl={{ antialias: false, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Redibuja />
      {children}
    </ThreeCanvas>
  );
};
