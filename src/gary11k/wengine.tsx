// gary · motor del MUNDO (desde sink3d de len29a): paradas de cámara con nombre ancladas a frases (world.json → cams) y
// efectos que se funden en 1 s (world.json → fx). La cámara viaja en arco, nunca en zoom recto, y respira siempre.
import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post } from "../kits/yanqui3d/fx3d";
import WJ from "./world.json";

export const FPS = 30, W = 1920, H = 1080;
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
export const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

export type C = { p: number[]; l: number[]; fov: number };
type Stop = [number, string];
type FXK = [number, Record<string, number>];
const ST = (WJ as unknown as { cams: Stop[] }).cams ?? [[0, "wide"]];
const FK = (WJ as unknown as { fx: FXK[] }).fx ?? [];

export const mkCamAt = (CAMS: Record<string, C>) => (t: number) => {
  let i = 0; while (i < ST.length - 1 && ST[i + 1][0] <= t) i++;
  const cur = CAMS[ST[i][1]] ?? CAMS.wide, prev = i > 0 ? CAMS[ST[i - 1][1]] ?? CAMS.wide : cur;
  const D = Math.min(2.6, Math.max(1.2, (ST[i + 1]?.[0] ?? t + 9) - ST[i][0]) * 0.45);
  const k = i > 0 ? ease((t - ST[i][0]) / D) : 1;
  const p = v3(prev.p).lerp(v3(cur.p), k), l = v3(prev.l).lerp(v3(cur.l), k);
  const arc = Math.sin(Math.PI * k) * Math.min(0.18, p.distanceTo(v3(prev.p)) * 0.25);
  p.y += arc; p.x += arc * 0.6 * (i % 2 ? 1 : -1);
  // después de llegar, la cámara sigue avanzando muy despacio hacia lo que mira (dolly en curva) y respira
  const since = t - ST[i][0], drift = 0.05 * ease(since / 12);
  p.lerp(l, drift);
  p.x += 0.008 * Math.sin(t * 0.31); p.y += 0.006 * Math.sin(t * 0.23 + 1);
  return { p, l, fov: prev.fov + (cur.fov - prev.fov) * k };
};
export const mkCamSpeed = (camAt: (t: number) => { p: THREE.Vector3; l: THREE.Vector3 }) => (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const dp = a.p.distanceTo(b.p) * 90 + a.l.distanceTo(b.l) * 40;
  return { bx: Math.min(12, dp * 0.5), by: Math.min(8, dp * 0.25) };
};
// efectos: cada clave se funde en 1 s desde su valor anterior
export const fxAt = (t: number): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const [a, kv] of FK) {
    if (a > t) break;
    for (const [k, v] of Object.entries(kv)) { const from = out[k] ?? 0; out[k] = a <= 0 ? v : from + (v - from) * ease((t - a) / 1.0); }  // lo de t=0 ya está puesto en el cuadro 0
  }
  return out;
};
const CamSet: React.FC<{ k: { p: THREE.Vector3; l: THREE.Vector3; fov: number } }> = ({ k }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.01; c.far = 200; c.updateProjectionMatrix(); return null;
};
const Redibuja: React.FC = () => {
  const advance = useThree((s) => s.advance);
  React.useEffect(() => { const f = () => advance(performance.now()); window.addEventListener("img3d", f); return () => window.removeEventListener("img3d", f); }, [advance]);
  return null;
};
// escala 0 = matriz singular → NaN con bloom → rectángulo negro (reference_3d_escala_cero_rectangulo_negro)
const ClampScales: React.FC = () => {
  const { scene } = useThree();
  React.useLayoutEffect(() => { scene.traverse((o: THREE.Object3D) => {
    const s = o.scale, z = Math.abs(s.x) <= 1e-3 || Math.abs(s.y) <= 1e-3 || Math.abs(s.z) <= 1e-3;
    if (z) { s.set(Math.max(Math.abs(s.x), 1e-3), Math.max(Math.abs(s.y), 1e-3), Math.max(Math.abs(s.z), 1e-3)); if (o.visible) { o.visible = false; o.userData.cz = true; } }
    else if (o.userData.cz) { o.visible = true; delete o.userData.cz; }
  }); });
  return null;
};
// el lienzo del mundo: cámara de la parada, post (bloom suave + env), fondo y niebla. Las luces las pone cada mundo.
export const WorldCanvas: React.FC<{ cam: { p: THREE.Vector3; l: THREE.Vector3; fov: number }; bg: string; fog?: [number, number]; children: React.ReactNode }> = ({ cam, bg, fog = [5, 18], children }) =>
  <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true, localClippingEnabled: true } as unknown as THREE.WebGLRendererParameters} style={{ position: "absolute", inset: 0 }}>
    <CamSet k={cam} />
    <Post bloom={0.12} threshold={1.0} exposure={0.95} env={0.45} />
    <color attach="background" args={[bg]} />
    <fog attach="fog" args={[bg, fog[0], fog[1]]} />
    {children}
    <ClampScales />
    <Redibuja />
  </ThreeCanvas>;

// textura pintada a mano (tiza, cartel, etiqueta): una por contenido, en caché
const TXC = new Map<string, THREE.Texture>();
export const paint = (key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  let t = TXC.get(key); if (t) return t;
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; TXC.set(key, t); return t;
};
