// r3k · componentes 3D de verdad (three.js) para la tanda mar29 (29-oct, vuelta 3 del evaluador: «cajas por CSS sin luz real = máx 6»).
// Escena con lienzo TRANSPARENTE (detrás se ve la foto desenfocada del Stage), tono ACES, reflejos de entorno (RoomEnvironment),
// sombras suaves reales y un piso que se funde en los bordes. Todo depende del tiempo por props: cero useFrame, determinista.
// Unidades ≈ metros. Render SÓLO en el farm (acá sólo stills).
import React, { createContext, useContext, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type V3 = [number, number, number];
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
export const win = (u: number, a: number, b: number) => sm((u - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const lv = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
export const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
// caída con rebote (0 → 1 con un pique), para cosas pesadas que aterrizan
export const drop = (u: number, a: number, b: number) => { const x = cl((u - a) / (b - a)); if (x < 0.62) return (x / 0.62) ** 2; const y = (x - 0.62) / 0.38; return 1 - 0.12 * Math.sin(y * Math.PI) * (1 - y); };
export const D2R = Math.PI / 180;

// ---------- geometrías y texturas en caché ----------
const G = new Map<string, THREE.BufferGeometry>();
export const rb = (w: number, h: number, d: number, r = 0.02) => { const k = `rb${w}|${h}|${d}|${r}`; let g = G.get(k); if (!g) { g = new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.1, h / 2.1, d / 2.1)); G.set(k, g); } return g; };
const T = new Map<string, THREE.Texture>();
export const tex = (key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  let t = T.get(key); if (t) return t;
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; T.set(key, t); return t;
};
export const BOLD = (px: number) => `900 ${px}px "Arial Black", "Helvetica Neue", Arial, sans-serif`;
export const HANDF = (px: number) => `italic 700 ${px}px "Segoe Print", "Comic Sans MS", "Bradley Hand", cursive`;
export const MONO = (px: number) => `700 ${px}px "Courier New", monospace`;

const fade = () => tex("fade", 256, 256, (g) => { const r = g.createRadialGradient(128, 128, 20, 128, 128, 128); r.addColorStop(0, "#fff"); r.addColorStop(0.55, "#fff"); r.addColorStop(1, "#000"); g.fillStyle = r; g.fillRect(0, 0, 256, 256); });
export const PLANKS = () => tex("planks", 512, 512, (g) => {
  for (let r = 0; r < 8; r++) for (let c = -1; c < 3; c++) { const i = r * 4 + c + 4, off = (r % 2) * 85, b = 118 + rnd(i, 1) * 34;
    g.fillStyle = `rgb(${b + 34},${b - 6},${b - 52})`; g.fillRect(c * 170 + off, r * 64, 170, 64);
    for (let k = 0; k < 9; k++) { g.strokeStyle = `rgba(60,35,15,${0.07 + rnd(i, k) * 0.12})`; g.lineWidth = 1 + rnd(i, k + 3) * 2; g.beginPath(); const y = r * 64 + 6 + k * 6.5; g.moveTo(c * 170 + off, y); g.bezierCurveTo(c * 170 + off + 60, y + 3 * rnd(i, k), c * 170 + off + 110, y - 3, c * 170 + off + 170, y + 2); g.stroke(); }
    g.fillStyle = "rgba(30,18,8,.55)"; g.fillRect(0, r * 64, 512, 2); g.fillRect(c * 170 + off, r * 64, 2, 64); }
}, [3, 3]);
export const CONC = () => tex("conc", 512, 512, (g) => { g.fillStyle = "#8a857c"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${rnd(i) > 0.5 ? "255,255,255" : "0,0,0"},${0.03 + rnd(i, 2) * 0.05})`; g.fillRect(rnd(i, 3) * 512, rnd(i, 4) * 512, 2 + rnd(i, 5) * 5, 2 + rnd(i, 6) * 5); } g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(0, 255, 512, 3); g.fillRect(255, 0, 3, 512); }, [4, 4]);
export const BLOCKS = () => tex("blocks", 512, 512, (g) => { g.fillStyle = "#6f6a62"; g.fillRect(0, 0, 512, 512); for (let r = 0; r < 4; r++) for (let c = -1; c < 3; c++) { const x = c * 256 + (r % 2) * 128, y = r * 128, b = 150 + rnd(r * 7 + c, 2) * 25; g.fillStyle = `rgb(${b},${b - 4},${b - 12})`; g.fillRect(x + 6, y + 6, 244, 116); for (let k = 0; k < 120; k++) { g.fillStyle = `rgba(0,0,0,${rnd(k, r + c + 9) * 0.08})`; g.fillRect(x + 6 + rnd(k, 1) * 240, y + 6 + rnd(k, 2) * 112, 3, 3); } } }, [2, 2]);
export const PLASTER = () => tex("plaster", 256, 256, (g) => { g.fillStyle = "#cfc4ae"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(${rnd(i) > 0.5 ? "255,255,255" : "60,50,40"},${0.03 + rnd(i, 2) * 0.04})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 3, 3); } }, [3, 3]);

// ---------- cámara, luz y entorno ----------
const Rig: React.FC<{ p: V3; l: V3; fov: number; env: number; exp: number }> = ({ p, l, fov, env, exp }) => {
  const { camera, gl, scene } = useThree();
  useMemo(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping; gl.outputColorSpace = THREE.SRGBColorSpace; gl.shadowMap.type = THREE.PCFSoftShadowMap;
    const pm = new THREE.PMREMGenerator(gl); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; pm.dispose();
  }, [gl, scene]);
  (scene as unknown as { environmentIntensity: number }).environmentIntensity = env; gl.toneMappingExposure = exp;
  const c = camera as THREE.PerspectiveCamera; c.fov = fov; c.near = 0.05; c.far = 80; c.position.set(...p); c.lookAt(...l); c.updateProjectionMatrix();
  return null;
};
export type Floor = "wood" | "conc" | "dark" | null;
// escena: cámara (p → mira l), piso que se funde con la foto de atrás, luz principal cálida arriba-izquierda con sombra suave y contraluz fría
// reloj del plano (lo da el Stage de afuera; el lienzo de three no hereda contextos, por eso se lee acá y se pasa como props)
export const R3T = createContext<{ tt: number; d: number; k: string }>({ tt: 99, d: 999, k: "" });
const hashK = (k: string) => { let x = 0; for (let i = 0; i < k.length; i++) x = (x * 31 + k.charCodeAt(i)) % 9973; return x; };
// llegada con peso (4 maneras, según la pieza) y salida que se aleja: los objetos NACEN en la escena, nunca aparecen de golpe
const arrive = (tt: number, d: number, k: string) => {
  const a = sm(tt / 0.85), b = drop(tt, 0, 0.9), x = sm((tt - (d - 0.75)) / 0.75), kind = hashK(k) % 4;
  const pos: V3 = [0, 0, 0], rot: V3 = [0, 0, 0]; let s = 1;
  if (kind === 0) pos[1] = (1 - b) * 0.9;
  else if (kind === 1) { pos[0] = (1 - a) * 1.4; rot[1] = (1 - a) * -0.5; }
  else if (kind === 2) { pos[2] = (1 - a) * -1.6; s = 0.8 + 0.2 * a; }
  else { rot[1] = (1 - a) * 0.6; pos[0] = (1 - a) * -0.9; }
  pos[2] -= x * 0.9; pos[1] -= x * 0.12; rot[1] += x * 0.18; s *= 1 - x * 0.06;
  return { pos, rot, s };
};
export const S3: React.FC<{ p: V3; l: V3; fov?: number; floor?: Floor; fs?: number; env?: number; exp?: number; key2?: V3; warm?: string; children: React.ReactNode }> = ({ p, l, fov = 34, floor = "wood", fs = 9, env = 0.55, exp = 1.05, key2 = [-3, 6, 4], warm = "#ffe2c0", children }) => {
  const { tt, d, k } = useContext(R3T), ar = arrive(tt, d, k);
  return <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
    <Rig p={p} l={l} fov={fov} env={env} exp={exp} />
    <hemisphereLight args={["#c9d6ee", "#3a2f26", 0.55]} />
    <directionalLight position={key2} intensity={2.4} color={warm} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
      shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-0.0005} shadow-normalBias={0.02} shadow-radius={6} />
    <directionalLight position={[3.5, 2.5, -4]} intensity={1.1} color="#a9c4ff" />
    {floor && <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[fs, fs]} />
      <meshStandardMaterial map={floor === "wood" ? PLANKS() : floor === "conc" ? CONC() : undefined} color={floor === "dark" ? "#24221f" : "#ffffff"} roughness={floor === "wood" ? 0.55 : 0.9} alphaMap={fade()} transparent />
    </mesh>}
    <group position={ar.pos} rotation={ar.rot} scale={ar.s}>{children}</group>
  </ThreeCanvas>;
};

// ---------- primitivas ----------
type M = { c?: string; m?: number; ro?: number; e?: string; ei?: number; o?: number; map?: THREE.Texture; side?: THREE.Side };
const Mat: React.FC<M> = ({ c = "#ddd", m = 0, ro = 0.6, e, ei = 1, o, map, side }) =>
  <meshStandardMaterial color={c} metalness={m} roughness={ro} emissive={e ?? "#000"} emissiveIntensity={e ? ei : 0} transparent={o !== undefined && o < 1} opacity={o ?? 1} map={map} side={side} />;
type Tr = { p?: V3; r?: V3; sc?: number | V3 };
const sc3 = (s?: number | V3): V3 => (s === undefined ? [1, 1, 1] : typeof s === "number" ? [s, s, s] : s);
// caja redondeada: s = [ancho, alto, prof], p = centro
export const Bx: React.FC<Tr & M & { s: V3; rad?: number; ns?: boolean }> = ({ s, rad = 0.015, p = [0, 0, 0], r = [0, 0, 0], sc, ns, ...m }) =>
  <mesh geometry={rb(s[0], s[1], s[2], rad)} position={p} rotation={r} scale={sc3(sc)} castShadow={!ns} receiveShadow><Mat {...m} /></mesh>;
export const Cy: React.FC<Tr & M & { rt: number; rb?: number; h: number; seg?: number; open?: boolean }> = ({ rt, rb: rbot, h, seg = 40, open, p = [0, 0, 0], r = [0, 0, 0], sc, ...m }) =>
  <mesh position={p} rotation={r} scale={sc3(sc)} castShadow receiveShadow><cylinderGeometry args={[rt, rbot ?? rt, h, seg, 1, open]} /><Mat {...m} /></mesh>;
export const Sp: React.FC<Tr & M & { rad: number; seg?: number; ns?: boolean }> = ({ rad, seg = 20, p = [0, 0, 0], r = [0, 0, 0], sc, ns, ...m }) =>
  <mesh position={p} rotation={r} scale={sc3(sc)} castShadow={!ns}><sphereGeometry args={[rad, seg, Math.max(8, seg / 2)]} /><Mat {...m} /></mesh>;
export const To: React.FC<Tr & M & { R: number; t: number; arc?: number }> = ({ R, t, arc = Math.PI * 2, p = [0, 0, 0], r = [0, 0, 0], sc, ...m }) =>
  <mesh position={p} rotation={r} scale={sc3(sc)} castShadow receiveShadow><torusGeometry args={[R, t, 16, 64, arc]} /><Mat {...m} /></mesh>;
// plano con textura (cartel, papel, cara de un objeto); w×h en metros
export const Pl: React.FC<Tr & M & { w: number; h: number; ns?: boolean; add?: boolean }> = ({ w, h, p = [0, 0, 0], r = [0, 0, 0], sc, ns, add, ...m }) =>
  <mesh position={p} rotation={r} scale={sc3(sc)} castShadow={!ns} receiveShadow>
    <planeGeometry args={[w, h]} />
    {add ? <meshBasicMaterial color={m.c ?? "#fff"} map={m.map} transparent opacity={m.o ?? 1} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /> : <Mat side={THREE.DoubleSide} {...m} />}
  </mesh>;
// tubo a lo largo de una curva (cables, mangueras, serpentinas, láminas que se doblan)
export const Tube: React.FC<M & { pts: V3[]; rad: number; seg?: number }> = ({ pts, rad, seg = 64, ...m }) => {
  const geo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q))), seg, rad, 12, false), [JSON.stringify(pts), rad, seg]);
  return <mesh geometry={geo} castShadow receiveShadow><Mat {...m} /></mesh>;
};
// texto en un plano (se lee de frente, en relieve si va sobre un objeto); ancho en metros, alto según el texto
export const Txt: React.FC<Tr & { t: string; w: number; c?: string; bg?: string; font?: (px: number) => string; px?: number; o?: number; e?: number; ns?: boolean }> = ({ t, w, c = "#fff", bg, font = BOLD, px = 160, o = 1, e = 0, p = [0, 0, 0], r = [0, 0, 0], sc, ns = true }) => {
  const key = `txt|${t}|${c}|${bg}|${font(px)}`;
  const tx = tex(key, 4, 4, () => {});
  const dims = useMemo(() => {
    const cv = document.createElement("canvas"), g = cv.getContext("2d")!; g.font = font(px); const tw = Math.ceil(g.measureText(t).width) + px * 0.5, th = Math.ceil(px * 1.35);
    cv.width = tw; cv.height = th; const g2 = cv.getContext("2d")!; if (bg) { g2.fillStyle = bg; g2.fillRect(0, 0, tw, th); }
    g2.font = font(px); g2.fillStyle = c; g2.textBaseline = "middle"; g2.textAlign = "center"; g2.fillText(t, tw / 2, th / 2 + px * 0.04);
    (tx as THREE.CanvasTexture).image = cv; tx.needsUpdate = true; tx.wrapS = tx.wrapT = THREE.ClampToEdgeWrapping; return th / tw;
  }, [key]);
  return <mesh position={p} rotation={r} scale={sc3(sc)} castShadow={!ns}>
    <planeGeometry args={[w, w * dims]} />
    <meshStandardMaterial map={tx} transparent opacity={o} roughness={0.7} emissive={c} emissiveIntensity={e} emissiveMap={e ? tx : undefined} side={THREE.DoubleSide} depthWrite={!!bg} />
  </mesh>;
};
// filtro de aire con marco de cartón y pliegues de verdad (zigzag); g = suciedad 0..1. Centro en p, de frente a +z
export const Filt: React.FC<Tr & { w: number; h: number; d?: number; g?: number; n?: number; frame?: string }> = ({ w, h, d = 0.06, g = 0, n = 22, frame = "#9c7a4a", p = [0, 0, 0], r = [0, 0, 0], sc }) => {
  const fw = 0.05, pw = (w - 2 * fw) / n, ang = Math.atan2(d * 0.8, pw / 2), L = Math.hypot(pw / 2, d * 0.8);
  const col = new THREE.Color("#f6f3ea").lerp(new THREE.Color("#6b6355"), g).getStyle(), col2 = new THREE.Color("#d9d2c2").lerp(new THREE.Color("#4f483d"), g).getStyle();
  return <group position={p} rotation={r} scale={sc3(sc)}>
    <Bx s={[w, fw, d]} p={[0, h / 2 - fw / 2, 0]} c={frame} ro={0.85} /><Bx s={[w, fw, d]} p={[0, -h / 2 + fw / 2, 0]} c={frame} ro={0.85} />
    <Bx s={[fw, h, d]} p={[-w / 2 + fw / 2, 0, 0]} c={frame} ro={0.85} /><Bx s={[fw, h, d]} p={[w / 2 - fw / 2, 0, 0]} c={frame} ro={0.85} />
    {Array.from({ length: n * 2 }, (_, i) => <mesh key={i} position={[-w / 2 + fw + (i + 0.5) * pw / 2, 0, 0]} rotation={[0, i % 2 ? ang : -ang, 0]} castShadow receiveShadow>
      <boxGeometry args={[L, h - 2 * fw, 0.003]} /><meshStandardMaterial color={i % 2 ? col2 : col} roughness={0.95} />
    </mesh>)}
  </group>;
};
// llama de gas (azul con punta cálida, aditiva); parpadeo ≤2 Hz (regla de destellos)
export const Flame: React.FC<{ p: V3; s?: number; u: number; i?: number; warm?: number }> = ({ p, s = 1, u, i = 0, warm = 0 }) => {
  const f = 1 + 0.08 * Math.sin(u * 60 * 1.6 + i * 1.7) + 0.05 * Math.sin(u * 60 * 0.7 + i);
  const h = 0.16 * s * f, cOut = new THREE.Color("#3d7cff").lerp(new THREE.Color("#ffb040"), warm).getStyle();
  return <group position={p}>
    <mesh position={[0, h / 2, 0]}><coneGeometry args={[0.035 * s, h, 16, 1, true]} /><meshBasicMaterial color={cOut} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, h * 0.3, 0]}><coneGeometry args={[0.018 * s, h * 0.55, 12, 1, true]} /><meshBasicMaterial color="#cfe8ff" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>
  </group>;
};
// mota/brillo aditivo (polvo con luz, chispa, gota)
export const Dot: React.FC<{ p: V3; r?: number; c?: string; o?: number; add?: boolean; st?: V3 }> = ({ p, r = 0.02, c = "#fff", o = 1, add, st }) =>
  <mesh position={p} scale={st ?? [1, 1, 1]} castShadow={!add}><sphereGeometry args={[r, 10, 8]} />
    {add ? <meshBasicMaterial color={c} transparent opacity={o} blending={THREE.AdditiveBlending} depthWrite={false} /> : <meshStandardMaterial color={c} roughness={0.9} transparent={o < 1} opacity={o} />}
  </mesh>;

// lienzo de un cuadrante (dial, pantalla, ticket): dibujo que cambia en pasos (k) para no regenerar cada cuadro
export const canvasTex = (key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => tex(key, w, h, draw);

// bocanada suave (vapor, humo, polvo en el aire): plano con degradé radial, aditivo o normal
const soft = () => tex("soft", 128, 128, (g) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.4, "rgba(255,255,255,.45)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });
export const Puff: React.FC<{ p: V3; s: number; c?: string; o?: number; add?: boolean; r?: V3 }> = ({ p, s, c = "#fff", o = 0.3, add = true, r = [0, 0, 0] }) =>
  <mesh position={p} rotation={r}><planeGeometry args={[s, s]} /><meshBasicMaterial map={soft()} color={c} transparent opacity={o} depthWrite={false} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} /></mesh>;
