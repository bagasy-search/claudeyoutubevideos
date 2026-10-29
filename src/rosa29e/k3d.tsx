// k3d · la COCINA DE ROSA en 3D para los componentes únicos (evaluador 29-oct: «¿por qué no lo hacés en 3D?»).
// Una escena chica por componente: mesa de tablas, azulejo de talavera, luz de ventana cálida con sombras, PBR + AO + bloom alto.
// Objetos con material de verdad: hierro fundido, madera barnizada, esmalte, oro, papel, tela. Todo determinista en tt.
// Entrada: nace de la foto del momento (se funde y la cámara empuja hacia adentro), nunca persianas. Render SÓLO en el farm.
import React, { useMemo } from "react";
import { AbsoluteFill, Img } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { H, img, cl, phys } from "./hkit";

export const W = 1920, HH = 1080;
export type V = [number, number, number];
export const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const ramp = (tt: number, a: number, b: number) => ease((tt - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const lv = (a: V, b: V, k: number): V => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
export const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
// resorte con peso (0→1 con rebote)
export const spr = (tt: number, a: number, w = 9, z = 0.38) => phys(tt, a, w, z);

// ---------------- texturas procedurales ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const TEX: Record<string, THREE.Texture> = {};
const tex = (k: string, f: () => THREE.Texture) => TEX[k] ?? (TEX[k] = f());
export const T = {
  planks: () => tex("planks", () => mk(1024, 1024, (g) => {
    for (let r = 0; r < 6; r++) {
      const base = 92 + rnd(r, 1) * 34; g.fillStyle = `rgb(${base + 34},${base - 4},${base - 46})`; g.fillRect(0, r * 171, 1024, 171);
      for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(55,30,12,${0.06 + rnd(r, k) * 0.12})`; g.lineWidth = 1 + rnd(r, k + 3) * 2.5; g.beginPath(); const y = r * 171 + 4 + k * 4.2; g.moveTo(0, y); g.bezierCurveTo(300, y + 6 * rnd(r, k), 700, y - 5, 1024, y + 3); g.stroke(); }
      for (let n = 0; n < 2; n++) { const x = rnd(r, n + 9) * 1000, y = r * 171 + 40 + rnd(r, n + 11) * 90; const gr = g.createRadialGradient(x, y, 2, x, y, 26); gr.addColorStop(0, "rgba(40,20,8,.7)"); gr.addColorStop(1, "rgba(40,20,8,0)"); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, 30, 12, 0, 0, 6.3); g.fill(); }
      g.fillStyle = "rgba(25,12,4,.75)"; g.fillRect(0, r * 171, 1024, 3);
    }
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(255,235,200,${0.03 * rnd(i, 4)})`; g.fillRect(rnd(i, 5) * 1024, rnd(i, 6) * 1024, 40 + rnd(i, 7) * 120, 1); }
  }, [2, 2])),
  talavera: () => tex("talavera", () => mk(512, 512, (g) => {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const x = c * 128, y = r * 128; g.fillStyle = "#efe8da"; g.fillRect(x, y, 128, 128);
      g.strokeStyle = "#1f4f9a"; g.fillStyle = "#1f4f9a"; g.lineWidth = 5;
      g.beginPath(); g.arc(x + 64, y + 64, 26, 0, 6.3); g.stroke();
      for (let p = 0; p < 4; p++) { const a = p * Math.PI / 2 + Math.PI / 4; g.beginPath(); g.ellipse(x + 64 + Math.cos(a) * 44, y + 64 + Math.sin(a) * 44, 15, 7, a, 0, 6.3); g.fill(); }
      g.fillStyle = "#e3a23a"; g.beginPath(); g.arc(x + 64, y + 64, 11, 0, 6.3); g.fill();
      for (const [cx, cy] of [[x, y], [x + 128, y], [x, y + 128], [x + 128, y + 128]]) { g.fillStyle = "#1f4f9a"; g.beginPath(); g.arc(cx, cy, 16, 0, 6.3); g.fill(); }
      g.fillStyle = "rgba(120,110,95,.6)"; g.fillRect(x, y, 128, 3); g.fillRect(x, y, 3, 128);
    }
  }, [6, 3])),
  cloth: (a = "#c23b2e", b = "#f1e9da") => tex("cloth" + a + b, () => mk(256, 256, (g) => {
    g.fillStyle = b; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 8; i++) { g.fillStyle = a + "99"; g.fillRect(i * 32, 0, 14, 256); g.fillRect(0, i * 32, 256, 14); }
    for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(0,0,0,${0.05 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 2, 1); }
  }, [3, 3])),
  paper: () => tex("paper", () => mk(512, 512, (g) => {
    g.fillStyle = "#efe4c8"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(140,110,60,${0.06 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 512, rnd(i, 4) * 512, 2 + rnd(i, 5) * 3, 2); }
    const gr = g.createRadialGradient(256, 256, 120, 256, 256, 380); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(120,80,30,.35)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  })),
  meat: (raw = 0) => tex("meat" + raw, () => mk(256, 256, (g) => {
    g.fillStyle = raw ? "#9b2f2a" : "#6e4a36"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 70; i++) { g.strokeStyle = raw ? `rgba(240,215,200,${0.25 + 0.3 * rnd(i, 1)})` : `rgba(40,22,14,${0.3 * rnd(i, 1)})`; g.lineWidth = 1 + 3 * rnd(i, 2); g.beginPath(); const y = rnd(i, 3) * 256; g.moveTo(0, y); g.bezierCurveTo(90, y + 30 * rnd(i, 4) - 15, 170, y - 20, 256, y + 10); g.stroke(); }
    for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(${raw ? "255,200,190" : "20,10,5"},${0.12 * rnd(i, 5)})`; g.fillRect(rnd(i, 6) * 256, rnd(i, 7) * 256, 3, 3); }
  })),
  soft: () => tex("soft", () => mk(128, 128, (g) => {
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 62); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.4, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  })),
  // texto en papel (renglones a mano): una línea por renglón; lo escrito se dibuja en la textura
  card: (lines: string[], col = "#2b2118", size = 64) => tex("card" + lines.join("|") + col + size, () => mk(1024, 640, (g) => {
    g.fillStyle = "#f3e8cc"; g.fillRect(0, 0, 1024, 640);
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(140,110,60,${0.07 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 1024, rnd(i, 4) * 640, 3, 2); }
    g.strokeStyle = "rgba(60,90,160,.35)"; g.lineWidth = 2; for (let y = 150; y < 640; y += 90) { g.beginPath(); g.moveTo(40, y); g.lineTo(984, y); g.stroke(); }
    g.strokeStyle = "rgba(200,60,60,.45)"; g.beginPath(); g.moveTo(110, 0); g.lineTo(110, 640); g.stroke();
    g.fillStyle = col; g.font = `italic 700 ${size}px Georgia, serif`; g.textBaseline = "alphabetic";
    lines.forEach((l, i) => g.fillText(l, 140, 130 + i * 90));
  })),
};

// ---------------- materiales ----------------
const MAT: Record<string, THREE.Material> = {};
const mat = (k: string, f: () => THREE.Material) => MAT[k] ?? (MAT[k] = f());
export const M = {
  iron: () => mat("iron", () => new THREE.MeshStandardMaterial({ color: "#232120", metalness: 0.75, roughness: 0.42 })),
  enamel: (c = "#f2efe8") => mat("en" + c, () => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 })),
  wood: (c = "#b9824e") => mat("wd" + c, () => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.4 })),
  gold: () => mat("gold", () => new THREE.MeshStandardMaterial({ color: "#f2c45a", metalness: 1, roughness: 0.16 })),
  chrome: () => mat("chrome", () => new THREE.MeshStandardMaterial({ color: "#e8eaee", metalness: 1, roughness: 0.12 })),
  clay: (c = "#a4532c") => mat("cl" + c, () => new THREE.MeshStandardMaterial({ color: c, roughness: 0.78 })),
  plastic: (c = "#eaf3f6") => mat("pl" + c, () => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.25, transparent: true, opacity: 0.72, clearcoat: 0.6 })),
  matte: (c: string, r = 0.7) => mat("mt" + c + r, () => new THREE.MeshStandardMaterial({ color: c, roughness: r })),
  glow: (c: string) => mat("gl" + c, () => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 2.4, roughness: 0.4 })),
};
// material que cambia por cuadro (color/emisión animados): uno por componente+clave
export const useMat = (k: string, f: () => THREE.MeshStandardMaterial) => useMemo(f, [k]);

// ---------------- cámara orgánica ----------------
export const Cam: React.FC<{ p: V; l: V; fov?: number }> = ({ p, l, fov = 34 }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  cm.position.set(...p); cm.up.set(0, 1, 0); cm.lookAt(...l); cm.fov = fov; cm.near = 0.02; cm.far = 120; cm.updateProjectionMatrix();
  return null;
};
// cámara que respira: curva lenta alrededor de un punto (nunca lineal) + empuje de entrada
export const orbit = (tt: number, base: V, look: V, push = 0.35, sway = 0.06): { p: V; l: V } => {
  const k = 1 - ease(tt / 1.4);
  const d: V = [base[0] - look[0], base[1] - look[1], base[2] - look[2]];
  const f = 1 + push * k;
  return { p: [look[0] + d[0] * f + Math.sin(tt * 0.33) * sway * 2, look[1] + d[1] * f + Math.sin(tt * 0.27 + 1) * sway, look[2] + d[2] * f + Math.cos(tt * 0.3) * sway], l: look };
};

// ---------------- el set: mesa + azulejo + luz de ventana ----------------
export const Kitchen: React.FC<{ wall?: boolean; warm?: number; table?: boolean; dark?: number }> = ({ wall = true, warm = 1, table = true, dark = 0 }) => (
  <>
    <color attach="background" args={[new THREE.Color("#1b130d").lerp(new THREE.Color("#050302"), dark).getStyle()]} />
    <fog attach="fog" args={["#1b130d", 6, 16]} />
    <hemisphereLight args={[0xffe2c0, 0x2a1a10, 0.45 * warm]} />
    {/* la ventana de la izquierda: luz cálida de tarde con sombras suaves */}
    <directionalLight position={[-4, 6, 3]} intensity={1.6 * warm} color="#ffd9a8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
      shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-3} shadow-bias={-0.0004} shadow-normalBias={0.02} />
    <pointLight position={[2.2, 1.6, 2.4]} intensity={1.4} distance={8} color="#ffb070" />
    <pointLight position={[0, 2.2, 1.2]} intensity={0.6} distance={6} color="#ffd6a0" />
    {table && <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[14, 8]} /><meshStandardMaterial map={T.planks()} roughness={0.62} color="#c9a07a" /></mesh>}
    {wall && <mesh position={[0, 2, -1.9]}><planeGeometry args={[14, 5]} /><meshStandardMaterial map={T.talavera()} roughness={0.22} metalness={0.02} /></mesh>}
  </>
);

// el lienzo 3D de un componente (sin Post en stills chicos sería distinto: siempre con Post)
export const C3: React.FC<{ children: React.ReactNode; bloom?: number; exposure?: number }> = ({ children, bloom = 0.35, exposure = 0.92 }) => (
  <ThreeCanvas width={W} height={HH} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
    <Post bloom={bloom} threshold={0.97} exposure={exposure} env={0.45} ao={false} />
    {children}
  </ThreeCanvas>
);

// escenario 3D: nace de la foto del momento (zoom a través + fundido), sale fundiéndose hacia atrás. Nada de persianas.
export const Stage3: React.FC<{ t: number; h: H; children: (tt: number) => React.ReactNode; over?: (tt: number) => React.ReactNode }> = ({ t, h, children, over }) => {
  const { at, out } = h;
  if (t < at - 0.35 || t > out + 0.6) return null;
  const tt = t - at, a = ease((t - (at - 0.35)) / 0.7), x = ease((t - (out - 0.1)) / 0.7), o = a * (1 - x);
  if (o <= 0.003) return null;
  return <AbsoluteFill>
    {/* la foto del momento crece y se desenfoca: la cámara "entra" en ella */}
    {h.bg && a < 1 && <AbsoluteFill style={{ opacity: 1 - a }}><Img src={img(h.bg)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + 0.35 * a})`, filter: `blur(${a * 18}px)` }} /></AbsoluteFill>}
    <AbsoluteFill style={{ opacity: o, transform: `scale(${1.06 - 0.06 * a + 0.04 * x})`, filter: x > 0.01 ? `blur(${x * 10}px)` : undefined }}>
      {children(tt)}
      {over && <AbsoluteFill>{over(tt)}</AbsoluteFill>}
      {/* viñeta suave de lente (no filtro: la luz de la escena) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 60%, rgba(0,0,0,.4))" }} />
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------------- objetos ----------------
const lathe = (pts: [number, number][], seg = 64) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
const GEO: Record<string, THREE.BufferGeometry> = {};
const geo = (k: string, f: () => THREE.BufferGeometry) => GEO[k] ?? (GEO[k] = f());

// olla de hierro fundido (r ≈ 0,5): fill 0..1 = altura del contenido; col = color del contenido; lid = cuánto se levantó la tapa (0 puesta, 1 arriba)
export const Pot: React.FC<{ p?: V; s?: number; fill?: number; col?: string; lid?: number; lidTilt?: number; lidOff?: boolean; content?: React.ReactNode; rough?: number }> = ({ p = [0, 0, 0], s = 1, fill = 0.75, col = "#7a4a2a", lid = 0, lidTilt = 0, lidOff, content, rough = 0.35 }) => {
  const body = geo("pot", () => lathe([[0, 0.02], [0.44, 0.0], [0.5, 0.04], [0.52, 0.12], [0.52, 0.5], [0.545, 0.53], [0.53, 0.55], [0.495, 0.53], [0.495, 0.06], [0.0, 0.07]]));
  const lidG = geo("potlid", () => lathe([[0, 0.12], [0.18, 0.11], [0.38, 0.07], [0.53, 0.0], [0.5, -0.01], [0, 0.1]]));
  const y = 0.08 + fill * 0.42;
  return <group position={p} scale={s}>
    <mesh geometry={body} material={M.iron()} castShadow receiveShadow />
    {[1, -1].map((d) => <mesh key={d} position={[d * 0.56, 0.44, 0]} rotation={[0, d > 0 ? 0 : Math.PI, Math.PI / 2]} material={M.iron()} castShadow><torusGeometry args={[0.07, 0.022, 12, 24, Math.PI]} /></mesh>)}
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[0.494, 64]} /><meshPhysicalMaterial color={col} roughness={rough} clearcoat={0.8} clearcoatRoughness={0.15} /></mesh>
    <group position={[0, y, 0]}>{content}</group>
    {!lidOff && <group position={[0.0 + lidTilt * 0.25, 0.54 + lid * 0.5, 0]} rotation={[0, 0, lidTilt * 0.6]}>
      <mesh geometry={lidG} material={M.iron()} castShadow />
      <mesh position={[0, 0.15, 0]} material={M.wood("#3a2416")} castShadow><cylinderGeometry args={[0.05, 0.065, 0.06, 24]} /></mesh>
    </group>}
  </group>;
};

// tapa suelta de la olla
export const Lid: React.FC<{ p?: V; r?: V; s?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1 }) => {
  const lidG = geo("potlid", () => lathe([[0, 0.12], [0.18, 0.11], [0.38, 0.07], [0.53, 0.0], [0.5, -0.01], [0, 0.1]]));
  return <group position={p} rotation={r} scale={s}><mesh geometry={lidG} material={M.iron()} castShadow /><mesh position={[0, 0.15, 0]} material={M.wood("#3a2416")} castShadow><cylinderGeometry args={[0.05, 0.065, 0.06, 24]} /></mesh></group>;
};

// sartén de hierro (r 0,42) con mango
export const Skillet: React.FC<{ p?: V; s?: number; ry?: number; col?: string; content?: React.ReactNode }> = ({ p = [0, 0, 0], s = 1, ry = 0, col = "#2a2522", content }) => {
  const g = geo("skillet", () => lathe([[0, 0.015], [0.36, 0.0], [0.42, 0.03], [0.45, 0.11], [0.43, 0.115], [0.4, 0.04], [0, 0.03]]));
  return <group position={p} scale={s} rotation={[0, ry, 0]}>
    <mesh geometry={g} material={M.iron()} castShadow receiveShadow />
    <mesh position={[0.72, 0.09, 0]} rotation={[0, 0, 0.12]} material={M.iron()} castShadow><boxGeometry args={[0.6, 0.035, 0.07]} /></mesh>
    <mesh position={[0, 0.034, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[0.39, 48]} /><meshPhysicalMaterial color={col} roughness={0.2} clearcoat={1} clearcoatRoughness={0.05} /></mesh>
    <group position={[0, 0.04, 0]}>{content}</group>
  </group>;
};

// cuchara de madera (largo ≈ 0,9); wear 0..1 = cuánto se gastó el cuenco (punta chata)
export const Spoon: React.FC<{ p?: V; r?: V; s?: number; wear?: number; c?: string }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, wear = 0, c = "#c08a52" }) => (
  <group position={p} rotation={r} scale={s}>
    <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]} material={M.wood(c)} castShadow><cylinderGeometry args={[0.022, 0.03, 0.62, 16]} /></mesh>
    <mesh position={[0, 0, -0.27 + wear * 0.05]} scale={[1 - wear * 0.2, 0.32 - wear * 0.1, 1.4 - wear * 0.9]} material={M.wood(c)} castShadow><sphereGeometry args={[0.1, 32, 16]} /></mesh>
  </group>
);

// tenedor de metal
export const Fork: React.FC<{ p?: V; r?: V; s?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1 }) => (
  <group position={p} rotation={r} scale={s}>
    <mesh position={[0, 0.32, 0]} material={M.chrome()} castShadow><boxGeometry args={[0.05, 0.5, 0.014]} /></mesh>
    <mesh position={[0, 0.05, 0]} material={M.chrome()} castShadow><boxGeometry args={[0.1, 0.05, 0.014]} /></mesh>
    {[-0.036, -0.012, 0.012, 0.036].map((x) => <mesh key={x} position={[x, -0.06, 0]} material={M.chrome()} castShadow><boxGeometry args={[0.011, 0.18, 0.012]} /></mesh>)}
  </group>
);

// trozo de carne (icosaedro deformado con semilla); cook 0..1 = de crudo rojo a dorado; gray = aguado gris
export const meatGeo = (seed: number, sq = 1) => geo("meat" + seed + sq, () => {
  const g = mergeVertices(new THREE.IcosahedronGeometry(0.16, 6)); const a = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < a.count; i++) {
    const x = a.getX(i), y = a.getY(i), z = a.getZ(i);
    const n = 1 + 0.22 * Math.sin(x * 9 + seed) * Math.cos(y * 7 + seed * 2) + 0.12 * Math.sin(z * 13 + seed * 3) + 0.05 * Math.sin((x + z) * 31 + seed);
    a.setXYZ(i, x * n * 1.35 * (1 + 0.25 * Math.sin(seed)), y * n * 0.62 * sq, z * n * (1 - 0.2 * Math.cos(seed)));
  }
  // vetas de grasa: hilos claros irregulares (por vértice; la textura plana dejaba anillos tipo madera)
  const col = new Float32Array(a.count * 3);
  for (let i = 0; i < a.count; i++) {
    const x = a.getX(i), y = a.getY(i), z = a.getZ(i);
    const v = Math.sin(x * 38 + Math.sin(z * 21 + seed) * 2.2 + seed) * Math.sin(z * 29 + Math.sin(y * 31) * 1.6 + seed * 2);
    const f = v > 0.72 ? 1 : v > 0.55 ? (v - 0.55) / 0.17 : 0, d = 0.82 + 0.18 * Math.sin(x * 13 + y * 17 + z * 11 + seed);
    col[i * 3] = lerp(d, 2.6, f); col[i * 3 + 1] = lerp(d, 3.4, f); col[i * 3 + 2] = lerp(d, 3.3, f);
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals(); return g;
});
export const Meat: React.FC<{ p?: V; r?: V; s?: number; seed?: number; col?: string; shine?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, seed = 1, col = "#7a4a30", shine = 0.4 }) => (
  <mesh geometry={meatGeo(seed)} position={p} rotation={r} scale={s} castShadow receiveShadow>
    <meshPhysicalMaterial color={col} vertexColors roughness={0.85 - shine * 0.5} clearcoat={shine * 0.5} clearcoatRoughness={0.35} />
  </mesh>
);

// vapor: sprites suaves que suben y se abren (≤1 Hz, nada titila)
export const Steam: React.FC<{ tt: number; p?: V; n?: number; h?: number; w?: number; o?: number; col?: string }> = ({ tt, p = [0, 0, 0], n = 14, h = 1.4, w = 0.35, o = 0.5, col = "#ffffff" }) => (
  <group position={p}>{Array.from({ length: n }, (_, i) => {
    const k = (tt * 0.32 + i / n) % 1, y = k * h, x = Math.sin(i * 2.1 + tt * 0.6) * w * (0.4 + k), z = Math.cos(i * 1.7 + tt * 0.5) * w * 0.5;
    const sc = 0.18 + k * 0.55, op = o * Math.sin(Math.PI * k) * 0.6;
    return <sprite key={i} position={[x, y, z]} scale={[sc, sc, sc]}><spriteMaterial map={T.soft()} color={col} transparent opacity={op} depthWrite={false} /></sprite>;
  })}</group>
);

// burbujas que nacen y revientan en una superficie (radio R): cada una vive ~1,2 s
export const Bubbles: React.FC<{ tt: number; R?: number; n?: number; size?: number; rate?: number; col?: string }> = ({ tt, R = 0.42, n = 10, size = 0.035, rate = 0.8, col = "#d9a46a" }) => (
  <group>{Array.from({ length: n }, (_, i) => {
    const per = 1.2 / rate, k = ((tt + rnd(i, 1) * per) % per) / per, a = rnd(i, 2) * 6.28, d = Math.sqrt(rnd(i, 3)) * R;
    const sc = size * (0.6 + rnd(i, 4)) * Math.sin(Math.PI * Math.min(1, k * 1.1));
    if (sc <= 0.002) return null;
    return <mesh key={i} position={[Math.cos(a) * d, sc * 0.3, Math.sin(a) * d]} scale={[sc, sc * 0.7, sc]}><sphereGeometry args={[1, 16, 10]} /><meshPhysicalMaterial color={col} roughness={0.05} clearcoat={1} transparent opacity={0.85} /></mesh>;
  })}</group>
);

// tarjeta de papel con renglones escritos (w×h en metros)
export const Card: React.FC<{ p?: V; r?: V; s?: number; lines: string[]; w?: number; h?: number; size?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, lines, w = 0.8, h = 0.5, size }) => (
  <mesh position={p} rotation={r} scale={s} castShadow receiveShadow><boxGeometry args={[w, h, 0.004]} /><meshStandardMaterial map={T.card(lines, "#2b2118", size)} roughness={0.85} /></mesh>
);

// paño de cocina a cuadros (plano con ondas suaves); press 0..1 = cuánto se aplastó
export const Towel: React.FC<{ p?: V; r?: V; s?: number; w?: number; d?: number; wave?: number; a?: string; b?: string; wet?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, w = 0.9, d = 0.6, wave = 0.03, a, b, wet = 0 }) => {
  const g = useMemo(() => { const g = new THREE.PlaneGeometry(w, d, 40, 28); const ps = g.attributes.position as THREE.BufferAttribute; for (let i = 0; i < ps.count; i++) { const x = ps.getX(i), y = ps.getY(i); ps.setZ(i, wave * (Math.sin(x * 9) * 0.6 + Math.cos(y * 11 + x * 3) * 0.4)); } g.computeVertexNormals(); return g; }, [w, d, wave]);
  return <group position={p} rotation={r} scale={s}>
    <mesh geometry={g} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow><meshStandardMaterial map={T.cloth(a, b)} roughness={0.95} side={THREE.DoubleSide} /></mesh>
    {wet > 0 && <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.16 * wet, 32]} /><meshStandardMaterial color="#8a2a20" transparent opacity={0.5 * Math.min(1, wet)} roughness={0.3} /></mesh>}
  </group>;
};

// plato hondo de esmalte (r 0,3)
export const Plate: React.FC<{ p?: V; s?: number; col?: string; content?: React.ReactNode }> = ({ p = [0, 0, 0], s = 1, col = "#8a5432", content }) => {
  const g = geo("plate", () => lathe([[0, 0.0], [0.16, 0.0], [0.24, 0.06], [0.33, 0.085], [0.34, 0.095], [0.32, 0.095], [0.23, 0.07], [0.15, 0.02], [0, 0.02]]));
  return <group position={p} scale={s}>
    <mesh geometry={g} material={M.enamel("#f4f1ea")} castShadow receiveShadow />
    <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.2, 40]} /><meshPhysicalMaterial color={col} roughness={0.3} clearcoat={0.7} /></mesh>
    <group position={[0, 0.05, 0]}>{content}</group>
  </group>;
};

export { rbox };
