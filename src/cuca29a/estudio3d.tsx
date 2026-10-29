// estudio3d · bodegón 3D para los componentes únicos de Cuca: mesa de tablas, luz cálida de ventana (clave + recorte),
// reflejos PBR (RoomEnvironment), sombras suaves de contacto y cámara curva. Fondo TRANSPARENTE: detrás queda la foto del
// momento desenfocada que pone Stage. Sin post-proceso (el composer perdería el alfa). Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { rbox, useTextures } from "./fx3d";

export type V3 = [number, number, number];
const cl = (x: number) => Math.max(0, Math.min(1, x));
export const rn = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- texturas por canvas (deterministas) ----------
const texCache = new Map<string, THREE.Texture>();
export const ctex = (key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  let t = texCache.get(key);
  if (!t) { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!); t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; texCache.set(key, t); }
  return t;
};
// papel con letra a mano (etiquetas, libreta, calendario)
export const papel = (key: string, lines: string[], o: { w?: number; h?: number; bg?: string; ink?: string; size?: number; font?: string; rule?: boolean } = {}) =>
  ctex("p:" + key, o.w ?? 512, o.h ?? 256, (g) => {
    const W = o.w ?? 512, H = o.h ?? 256;
    g.fillStyle = o.bg ?? "#efe4c8"; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(120,90,50,${0.05 * rn(i, 7)})`; g.fillRect(rn(i, 2) * W, rn(i, 3) * H, 3, 3); }
    if (o.rule) { g.strokeStyle = "rgba(80,110,160,.25)"; g.lineWidth = 2; for (let y = 60; y < H; y += 48) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } }
    const sz = o.size ?? 96; g.fillStyle = o.ink ?? "#2a1c12"; g.textAlign = "center"; g.textBaseline = "middle";
    g.font = o.font ?? `700 ${sz}px Caveat, "Segoe Script", cursive`;
    lines.forEach((l, i) => g.fillText(l, W / 2, H / 2 + (i - (lines.length - 1) / 2) * sz * 1.05));
  });
const yuteTex = () => ctex("yute", 256, 256, (g) => {
  g.fillStyle = "#a88a58"; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 6) for (let x = 0; x < 256; x += 6) { const v = rn(x * 7 + y, 1); g.fillStyle = `rgba(${90 + v * 60},${66 + v * 40},${30 + v * 20},.55)`; g.fillRect(x + ((y / 6) % 2) * 3, y, 4, 3); }
});
const humoTex = () => ctex("humo", 64, 64, (g) => {
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.5, "rgba(255,255,255,.45)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
});

// ---------- cámara: sube despacio y orbita en curva (nunca zoom lineal) ----------
const Cam: React.FC<{ t: number; p: V3; l: V3; orbit: number; fov: number }> = ({ t, p, l, orbit, fov }) => {
  const { camera } = useThree();
  const k = 1 - Math.exp(-t * 0.45), a = orbit * (Math.sin(t * 0.32) * 0.6 + (k - 0.5) * 0.8);
  const dx = p[0] - l[0], dz = p[2] - l[2], r = Math.hypot(dx, dz) * (1.06 - 0.08 * k), base = Math.atan2(dx, dz) + a;
  camera.position.set(l[0] + Math.sin(base) * r, p[1] + 0.08 * Math.sin(t * 0.27) - 0.12 * k, l[2] + Math.cos(base) * r);
  (camera as THREE.PerspectiveCamera).fov = fov; (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(l[0], l[1], l[2]);
  // la escena baja 90 px: arriba queda aire para el título (nada lo pisa ni se corta contra el borde)
  (camera as THREE.PerspectiveCamera).setViewOffset(1920, 1080, 0, -90, 1920, 1080);
  return null;
};
const Env: React.FC = () => {
  const { gl, scene } = useThree();
  useMemo(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = true; gl.shadowMap.type = THREE.PCFSoftShadowMap; gl.setClearColor(0x000000, 0);
    const pm = new THREE.PMREMGenerator(gl); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    (scene as unknown as { environmentIntensity: number }).environmentIntensity = 0.55;
  }, [gl, scene]);
  return null;
};

// ---------- el estudio ----------
export const Estudio: React.FC<{ t: number; cam?: V3; look?: V3; orbit?: number; fov?: number; mesa?: boolean; children: React.ReactNode }> = ({ t, cam = [0, 2.1, 4.6], look = [0, 0.7, 0], orbit = 0.22, fov = 34, mesa = true, children }) => {
  const tx = useTextures();
  return <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
    <Env />
    <Cam t={t} p={cam} l={look} orbit={orbit} fov={fov} />
    <hemisphereLight args={[0xffe6c8, 0x3a2414, 0.55]} />
    {/* clave: luz de ventana cálida desde arriba-izquierda, con sombra suave */}
    <directionalLight position={[-3.2, 5.5, 3.4]} intensity={2.7} color="#ffd9a8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
      shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-0.0003} shadow-radius={6} />
    {/* recorte: separa los objetos del fondo */}
    <pointLight position={[2.6, 2.4, -2.4]} intensity={9} distance={9} color="#ffb070" />
    <pointLight position={[0.5, 1.2, 3.5]} intensity={1.6} distance={8} color="#fff1dc" />
    {mesa && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.6]} receiveShadow>
      <planeGeometry args={[9, 5.2]} /><meshStandardMaterial map={tx.planks} color="#a07a56" roughness={0.78} metalness={0} />
    </mesh>}
    {mesa && <mesh position={[0, -0.06, 1.99]} receiveShadow><boxGeometry args={[9, 0.12, 0.02]} /><meshStandardMaterial color="#4a2e1a" roughness={0.9} /></mesh>}
    {children}
  </ThreeCanvas>;
};

// ---------- materiales ----------
export const M = {
  vidrio: () => <meshPhysicalMaterial color="#e8f2f4" roughness={0.04} metalness={0} transparent opacity={0.22} envMapIntensity={1.6} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} />,
  cromo: (c = "#d8dade") => <meshStandardMaterial color={c} roughness={0.18} metalness={1} envMapIntensity={1.4} />,
  hierro: () => <meshStandardMaterial color="#1c1a19" roughness={0.45} metalness={0.6} />,
  barro: (c = "#9a4f2c") => <meshStandardMaterial color={c} roughness={0.62} metalness={0.02} />,
  madera: (c = "#7a5232") => <meshStandardMaterial color={c} roughness={0.75} />,
  liquido: (c: string, o = 0.92) => <meshPhysicalMaterial color={c} roughness={0.12} transparent opacity={o} clearcoat={0.8} />,
};
export const Yute: React.FC = () => <meshStandardMaterial map={yuteTex()} color="#c6a674" roughness={0.95} />;

// torno: puntos [radio, alto]
export const lathe = (pts: [number, number][], seg = 40) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(Math.max(0.001, r), y)), seg);
export const RBox: React.FC<{ p?: V3; s: V3; r?: number; rot?: V3; children: React.ReactNode }> = ({ p, s, r = 0.03, rot, children }) =>
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], r)} castShadow receiveShadow>{children}</mesh>;

// vapor que sube (sprites deterministas)
export const Vapor: React.FC<{ t: number; p: V3; n?: number; h?: number; o?: number; s?: number; spread?: number }> = ({ t, p, n = 12, h = 1.1, o = 0.3, s = 0.35, spread = 0.18 }) => (
  <group position={p}>{Array.from({ length: n }, (_, i) => {
    const per = 2.6 + rn(i, 1) * 1.6, k = ((t + rn(i, 2) * per) % per) / per, sc = s * (0.5 + k * 1.6);
    return <sprite key={i} position={[(rn(i, 4) - 0.5) * spread + Math.sin(t * 0.8 + i) * 0.08 * k, k * h, (rn(i, 5) - 0.5) * spread]} scale={[sc, sc, 1]}>
      <spriteMaterial map={humoTex()} color="#f4efe6" transparent opacity={o * Math.sin(k * Math.PI)} depthWrite={false} />
    </sprite>;
  })}</group>
);

// granos (frijol): elipsoides con brillo; cada uno con su transformación
const beanGeo = new THREE.SphereGeometry(1, 14, 10);
export const Frijol: React.FC<{ p: V3; s?: number; rot?: V3; c?: string; hinchado?: number }> = ({ p, s = 0.05, rot = [0, 0, 0], c = "#6b2a1c", hinchado = 0 }) => (
  <mesh position={p} rotation={rot} scale={[s * (1.5 + 0.35 * hinchado), s * (0.78 + 0.25 * hinchado), s * (0.95 + 0.3 * hinchado)]} geometry={beanGeo} castShadow>
    <meshPhysicalMaterial color={new THREE.Color(c).lerp(new THREE.Color("#b07a5a"), 0.45 * hinchado)} roughness={0.28 + 0.4 * hinchado} clearcoat={0.7 * (1 - hinchado)} />
  </mesh>
);
export const fall = (t: number, a: number, h: number) => { const x = t - a; if (x <= 0) return h; const y = h - 4.9 * x * x; if (y > 0) return y; const t0 = Math.sqrt(h / 4.9), v = 9.8 * t0 * 0.32, x2 = x - t0, b = v * x2 - 4.9 * x2 * x2; return Math.max(0, b); };
export { cl };
