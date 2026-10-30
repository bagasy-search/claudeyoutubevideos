// len29 · KIT 3D de los componentes únicos (29-oct, tras el evaluador: «¿por qué no lo hacés en 3D?» en las 21 hojas).
// Cada componente es UNA escena three.js chica: objeto real con material (PVC, cromo, vidrio, agua, grasa, pelo, madera),
// luz con motivo y sombra de contacto sobre una mesa; cámara que orbita en curva TODO el tramo (nunca dos cuadros iguales),
// entrada por iris/barrido desde la escena y salida fundida. Título arriba a la izquierda (Head del hkit, sin kicker);
// a lo sumo UN rótulo. Determinista: todo sale de t. Render SÓLO en el farm (acá sólo stills).
import React from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "../kits/yanqui3d/fx3d";
import { FONT, H, TX, cl, eIn, eio, phys } from "./hkit";

export { cl, eio, phys, rbox };
export const rn = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
export const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------- cámara: órbita esférica alrededor de un blanco, de [az0,el0,r0] a [az1,el1,r1] a lo largo del tramo ----------
export type Cam = { at: number[]; at1?: number[]; az: [number, number]; el: [number, number]; r: [number, number]; fov?: number };
const CamRig: React.FC<{ tt: number; dur: number; c: Cam; inn: number }> = ({ tt, dur, c, inn }) => {
  const { camera } = useThree();
  // 29-oct (eval: «últimos cuadros iguales»): mitad curva, mitad lineal -> la cámara nunca se frena antes del corte
  const k = 0.45 * eio(tt, 0, dur + 0.6) + 0.55 * cl(tt / (dur + 0.6)), back = 1 + 0.35 * (1 - inn);
  const az = lerp(c.az[0], c.az[1], k) + 0.05 * k + 0.04 * Math.sin(tt * 0.6), el = lerp(c.el[0], c.el[1], k) + 0.02 * Math.sin(tt * 0.45 + 1);
  const r = lerp(c.r[0], c.r[1], k) * back;
  const a = c.at1 ? c.at.map((v, i) => lerp(v, c.at1![i], k)) : c.at;
  camera.position.set(a[0] + r * Math.sin(az) * Math.cos(el), a[1] + r * Math.sin(el), a[2] + r * Math.cos(az) * Math.cos(el));
  camera.lookAt(a[0], a[1], a[2]);
  (camera as THREE.PerspectiveCamera).fov = c.fov ?? 30; (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  return null;
};

// ---------- texturas procedurales (cache global, deterministas) ----------
const TX3 = new Map<string, THREE.Texture>();
const canv = (key: string, w: number, h: number, rep: [number, number], draw: (g: CanvasRenderingContext2D) => void) => {
  const k = key + rep.join("x"); let t = TX3.get(k); if (t) return t;
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; TX3.set(k, t); return t;
};
export const tex = {
  wood: (rx = 2, ry = 1, base: number[] = [150, 100, 58]) => canv("wood" + base.join(","), 256, 512, [rx, ry], (g) => {
    g.fillStyle = `rgb(${base.join(",")})`; g.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(55,28,10,${0.06 + 0.12 * rn(i, 3)})`; g.lineWidth = 1 + 3 * rn(i, 4); g.beginPath(); const x = rn(i, 5) * 256; g.moveTo(x, 0); g.bezierCurveTo(x + 14 * rn(i, 6), 170, x - 14 * rn(i, 7), 340, x + 8 * rn(i, 8), 512); g.stroke(); }
  }),
  tile: (rx = 4, ry = 4, col = "#ecebe6", grout = "#b9b6ad") => canv("tile" + col, 256, 256, [rx, ry], (g) => {
    g.fillStyle = grout; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = rn(r * 4 + c, 2) * 10; g.fillStyle = col; g.globalAlpha = 1; g.fillRect(c * 64 + 3, r * 64 + 3, 58, 58); g.fillStyle = `rgba(255,255,255,${0.05 + v / 200})`; g.fillRect(c * 64 + 6, r * 64 + 6, 30, 8); }
  }),
  counter: (rx = 2, ry = 2) => canv("counter", 256, 256, [rx, ry], (g) => {
    g.fillStyle = "#a89f90"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1400; i++) { const v = 110 + rn(i, 1) * 80; g.fillStyle = `rgba(${v},${v - 8},${v - 20},.35)`; g.fillRect(rn(i, 2) * 256, rn(i, 3) * 256, 1 + rn(i, 4) * 2, 1 + rn(i, 5) * 2); }
  }),
  paper: (rx = 1, ry = 1) => canv("paper", 256, 256, [rx, ry], (g) => {
    g.fillStyle = "#f1ead9"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(150,120,80,${0.05 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 2, 2); }
  }),
  rust: () => canv("rust", 256, 256, [1, 1], (g) => {
    g.fillStyle = "#8a8f93"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 260; i++) { const r = 3 + rn(i, 1) * 16; g.fillStyle = `rgba(${150 + rn(i, 2) * 60},${70 + rn(i, 3) * 40},${20},${0.25 + 0.4 * rn(i, 4)})`; g.beginPath(); g.arc(rn(i, 5) * 256, rn(i, 6) * 256, r, 0, 6.3); g.fill(); }
  }),
  // texto pintado (cartel, almanaque, libreta): una textura por contenido
  text: (key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => canv("txt" + key, w, h, [1, 1], draw),
};

// cable de espiral (resorte de acero): rayas diagonales que, al girar el cilindro, «avanzan»
export const coilTex = () => canv("coil", 64, 256, [1, 1], (g) => {
  g.fillStyle = "#5c6166"; g.fillRect(0, 0, 64, 256);
  for (let y = -64; y < 320; y += 10) { const gr = g.createLinearGradient(0, y, 0, y + 10); gr.addColorStop(0, "#3a3e42"); gr.addColorStop(0.45, "#f2f4f6"); gr.addColorStop(1, "#3a3e42"); g.fillStyle = gr; g.beginPath(); g.moveTo(0, y); g.lineTo(64, y + 14); g.lineTo(64, y + 24); g.lineTo(0, y + 10); g.fill(); }
});

export const digitsTex = (fg = "#1b1b1b", bg = "#f1ead9") => canv("dig3" + fg + bg, 1280, 128, [1, 1], (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, 1280, 128); g.fillStyle = fg; g.font = "900 104px Arial"; g.textAlign = "center"; g.textBaseline = "middle";
  for (let d = 0; d < 10; d++) { g.save(); g.translate((d + 0.5) * 128, 64); g.rotate(Math.PI / 2); g.fillText(String(d), 0, 4); g.restore(); }
});
// tambor de un dígito (eje X): muestra el valor v (puede ser fraccionario = rodando)
export const DigitDrum: React.FC<{ v: number; p?: number[]; r?: number; w?: number }> = ({ v, p = [0, 0, 0], r = 0.03, w = 0.035 }) =>
  <mesh position={p as [number, number, number]} rotation={[((v + 0.5) / 10) * Math.PI * 2, 0, Math.PI / 2]}><cylinderGeometry args={[r, r, w, 40]} /><meshStandardMaterial map={digitsTex()} roughness={0.5} /></mesh>;

// ---------- materiales con nombre (JSX para usar como hijo de <mesh>) ----------
type MP = { op?: number; col?: string; em?: string; emI?: number; side?: THREE.Side };
export const M = {
  pvc: (p: MP = {}) => <meshPhysicalMaterial color={p.col ?? "#f3f1ea"} roughness={0.32} clearcoat={0.5} clearcoatRoughness={0.3} transparent={(p.op ?? 1) < 1} opacity={p.op ?? 1} side={p.side} />,
  chrome: (p: MP = {}) => <meshStandardMaterial color={p.col ?? "#eef1f4"} metalness={1} roughness={0.12} transparent={(p.op ?? 1) < 1} opacity={p.op ?? 1} emissive={p.em ?? "#000"} emissiveIntensity={p.emI ?? 0} />,
  steel: (p: MP = {}) => <meshStandardMaterial color={p.col ?? "#c9ced3"} metalness={0.85} roughness={0.28} transparent={(p.op ?? 1) < 1} opacity={p.op ?? 1} side={p.side} />,
  brass: (p: MP = {}) => <meshStandardMaterial color={p.col ?? "#d9a84a"} metalness={1} roughness={0.25} emissive={p.em ?? "#000"} emissiveIntensity={p.emI ?? 0} />,
  glass: (p: MP = {}) => <meshPhysicalMaterial color={p.col ?? "#e9f6ff"} roughness={0.04} metalness={0} transparent opacity={p.op ?? 0.22} clearcoat={1} side={p.side ?? THREE.DoubleSide} depthWrite={false} />,
  water: (p: MP = {}) => <meshPhysicalMaterial color={p.col ?? "#5fb2e6"} roughness={0.05} transparent opacity={p.op ?? 0.62} clearcoat={1} side={p.side ?? THREE.DoubleSide} depthWrite={false} emissive={p.em ?? "#0c2a40"} emissiveIntensity={p.emI ?? 0.35} />,
  grease: (p: MP = {}) => <meshPhysicalMaterial color={p.col ?? "#e3cf8c"} roughness={0.45} clearcoat={0.6} transparent={(p.op ?? 1) < 1} opacity={p.op ?? 1} side={p.side} />,
  rubber: (p: MP = {}) => <meshStandardMaterial color={p.col ?? "#c2302a"} roughness={0.55} transparent={(p.op ?? 1) < 1} opacity={p.op ?? 1} />,
  plastic: (p: MP = {}) => <meshPhysicalMaterial color={p.col ?? "#e6762a"} roughness={0.4} clearcoat={0.4} transparent={(p.op ?? 1) < 1} opacity={p.op ?? 1} emissive={p.em ?? "#000"} emissiveIntensity={p.emI ?? 0} side={p.side} />,
  hair: (p: MP = {}) => <meshStandardMaterial color={p.col ?? "#3a2618"} roughness={0.45} metalness={0.1} transparent={(p.op ?? 1) < 1} opacity={p.op ?? 1} />,
  porcelain: (p: MP = {}) => <meshPhysicalMaterial color={p.col ?? "#fbfaf7"} roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} transparent={(p.op ?? 1) < 1} opacity={p.op ?? 1} side={p.side} />,
  wood: (p: MP & { rx?: number; ry?: number; base?: number[] } = {}) => <meshStandardMaterial map={tex.wood(p.rx ?? 2, p.ry ?? 1, p.base)} roughness={0.7} />,
  glow: (p: MP = {}) => <meshBasicMaterial color={p.col ?? "#ffcf7a"} transparent opacity={p.op ?? 1} toneMapped={false} depthWrite={false} />,
  matte: (p: MP = {}) => <meshStandardMaterial color={p.col ?? "#888"} roughness={0.85} transparent={(p.op ?? 1) < 1} opacity={p.op ?? 1} emissive={p.em ?? "#000"} emissiveIntensity={p.emI ?? 0} side={p.side} />,
};

// ---------- geometrías ----------
const GC = new Map<string, THREE.BufferGeometry>();
const gk = <T extends THREE.BufferGeometry>(k: string, mk: () => T): T => { const c = GC.get(k) as T | undefined; if (c) return c; const g = mk(); GC.set(k, g); return g; };
export const curve = (pts: number[][]) => new THREE.CatmullRomCurve3(pts.map(v3), false, "centripetal");
// tubo por una curva (caño, cable, pelo, chorro); r puede variar a lo largo (u 0..1)
export const tubeG = (key: string, pts: number[][], r: number | ((u: number) => number), seg = 120, rs = 24) => gk("tube" + key, () => {
  const c = curve(pts);
  if (typeof r === "number") return new THREE.TubeGeometry(c, seg, r, rs, false);
  const g = new THREE.TubeGeometry(c, seg, 1, rs, false), pos = g.attributes.position as THREE.BufferAttribute, nrm = g.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i <= seg; i++) { const p = c.getPointAt(i / seg), rr = r(i / seg); for (let j = 0; j <= rs; j++) { const k = i * (rs + 1) + j; pos.setXYZ(k, p.x + nrm.getX(k) * rr, p.y + nrm.getY(k) * rr, p.z + nrm.getZ(k) * rr); } }
  pos.needsUpdate = true; g.computeVertexNormals(); return g;
});
// tuerca hexagonal con agujero y bisel (eje Y)
export const hexNutG = (r: number, h: number, hole: number) => gk(`hex${r}|${h}|${hole}`, () => {
  const s = new THREE.Shape(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + Math.PI / 6; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  const hp = new THREE.Path(); hp.absarc(0, 0, hole, 0, Math.PI * 2, true); s.holes.push(hp);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: h * 0.12, bevelSize: r * 0.06, bevelSegments: 3, curveSegments: 32 });
  g.rotateX(-Math.PI / 2); g.translate(0, -h / 2, 0); return g;
});
// rosca: hélice fina alrededor de un perno (eje Y)
export const threadG = (r: number, len: number, turns: number) => gk(`thr${r}|${len}|${turns}`, () => {
  const pts: number[][] = []; const N = turns * 24; for (let i = 0; i <= N; i++) { const a = i / 24 * Math.PI * 2; pts.push([Math.cos(a) * r, -len / 2 + len * i / N, Math.sin(a) * r]); }
  return new THREE.TubeGeometry(curve(pts), N * 2, r * 0.09, 8, false);
});
// caja redondeada (mata el look de bloques)
export const RBox: React.FC<{ s: number[]; r?: number; p?: number[]; rot?: number[]; children: React.ReactNode; shadow?: boolean }> = ({ s, r = 0.01, p = [0, 0, 0], rot = [0, 0, 0], children, shadow = true }) =>
  <mesh geometry={rbox(s[0], s[1], s[2], r)} position={p as [number, number, number]} rotation={rot as [number, number, number]} castShadow={shadow} receiveShadow>{children}</mesh>;

// mechón de pelo: N hebras finas que siguen un camino con ruido (cada hebra un tubo)
export const Hair: React.FC<{ id: string; pts: number[][]; n?: number; spread?: number; r?: number; op?: number; col?: string }> = ({ id, pts, n = 14, spread = 0.02, r = 0.0016, op = 1, col }) => <>
  {Array.from({ length: n }, (_, i) => <mesh key={i} castShadow geometry={tubeG(`hair${id}${i}`, pts.map((q, j) => [q[0] + (rn(i, 3 + j) - 0.5) * spread, q[1] + (rn(i, 13 + j) - 0.5) * spread, q[2] + (rn(i, 23 + j) - 0.5) * spread]), r, 40, 5)}>{M.hair({ op, col })}</mesh>)}
</>;

// gota que cae de [x,y0,z] a y1 entre a y b (s); después, anillo que se abre en la superficie
export const Drop: React.FC<{ tt: number; a: number; b: number; x: number; y0: number; y1: number; z?: number; r?: number; mat?: React.ReactNode; ring?: boolean }> = ({ tt, a, b, x, y0, y1, z = 0, r = 0.012, mat, ring = true }) => {
  const k = cl((tt - a) / (b - a)), f = k * k, rk = cl((tt - b) / 0.7);
  return <>
    {k > 0 && k < 1 && <mesh position={[x, lerp(y0, y1, f), z]} scale={[1, 1.35, 1]} castShadow><sphereGeometry args={[r, 20, 14]} />{mat ?? M.water({ op: 0.85 })}</mesh>}
    {ring && rk > 0 && rk < 1 && <mesh position={[x, y1 + 0.001, z]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[r * (1 + 6 * rk), r * (1.4 + 6 * rk), 48]} /><meshBasicMaterial color="#d8f0ff" transparent opacity={0.7 * (1 - rk)} depthWrite={false} /></mesh>}
  </>;
};

// llegada con peso: cae desde h arriba y rebota (resorte); devuelve el desplazamiento en Y
export const fall = (tt: number, a: number, h = 0.5, w = 9, z = 0.35) => (1 - phys(tt, a, w, z)) * h * (tt < a ? 1 : 1);
export const seen = (tt: number, a: number) => tt >= a;

// ---------- escenario ----------
export type Floor = "wood" | "counter" | "tile" | "dark" | "none";
const maskOf = (m: string, p: number) => m === "wipe" ? `linear-gradient(105deg, #000 ${p * 150 - 30}%, transparent ${p * 150}%)`
  : m === "split" ? `linear-gradient(90deg, transparent ${50 - p * 62}%, #000 ${60 - p * 62}%, #000 ${40 + p * 62}%, transparent ${50 + p * 62}%)`
  : m === "drop" ? `linear-gradient(180deg, #000 ${p * 150 - 30}%, transparent ${p * 150}%)`
  : `radial-gradient(circle at 50% 52%, #000 ${p * 1500}px, transparent ${p * 1500 + 480}px)`;

const ClampScales: React.FC = () => {
  const { scene } = useThree();
  React.useLayoutEffect(() => { scene.traverse((o: THREE.Object3D) => {
    const s = o.scale, z = Math.abs(s.x) <= 1e-3 || Math.abs(s.y) <= 1e-3 || Math.abs(s.z) <= 1e-3;
    if (z) { s.set(Math.max(Math.abs(s.x), 1e-3), Math.max(Math.abs(s.y), 1e-3), Math.max(Math.abs(s.z), 1e-3)); if (o.visible) { o.visible = false; o.userData.cz = true; } }
    else if (o.userData.cz) { o.visible = true; delete o.userData.cz; }
  }); });
  return null;
};

export const Scene3D: React.FC<{
  t: number; h: H; cam: Cam; mode?: "iris" | "wipe" | "split" | "drop"; floor?: Floor; wall?: "tile" | "dark" | "wood" | "none";
  bg?: string; key1?: number[]; warm?: number; lamp?: number[]; children: (tt: number, u: number) => React.ReactNode; over?: (tt: number) => React.ReactNode;
}> = ({ t, h, cam, mode = "iris", floor = "counter", wall = "dark", bg = "#0e1013", key1 = [-1.2, 2.4, 1.6], warm = 1, lamp, children, over }) => {
  const { at, out } = h;
  if (t < at - 0.05 || t > out + 0.85) return null;
  const inn = phys(t, at, 3.8, 0.72), xo = eIn(t, out - 0.25, out + 0.75), p = cl(inn) * (1 - xo);
  if (p <= 0.004) return null;
  const dur = out - at, tt = (t - at) * Math.min(1, Math.max(0.6, 5.6 / Math.max(1, dur - 0.6))), mk = maskOf(mode, p);
  return <AbsoluteFill style={{ WebkitMaskImage: mk, maskImage: mk, fontFamily: FONT, color: TX, background: bg } as React.CSSProperties}>
    <AbsoluteFill style={{ opacity: cl(inn * 1.5) * (1 - xo * 0.8) }}>
      <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: true, preserveDrawingBuffer: true, localClippingEnabled: true } as unknown as THREE.WebGLRendererParameters} style={{ position: "absolute", inset: 0 }}>
        <CamRig tt={tt} dur={dur} c={cam} inn={cl(inn)} />
        <Post bloom={0.14} threshold={0.97} exposure={0.84} env={0.32} ao={false} />
        <color attach="background" args={[bg]} />
        <fog attach="fog" args={[bg, 3.5, 11]} />
        <hemisphereLight args={["#e6ecf2", "#2a2420", 0.28]} />
        {/* luz principal cálida con sombra suave; contra luz fría que dibuja el borde; relleno bajo */}
        <spotLight position={key1 as [number, number, number]} angle={0.55} penumbra={0.85} intensity={13 * warm} distance={9} castShadow color="#fff0dc" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />
        <spotLight position={[1.6, 1.4, -1.4]} angle={0.6} penumbra={0.9} intensity={7} distance={7} color="#cfe2ff" />
        <pointLight position={[0.9, 0.5, 1.6]} intensity={0.7} distance={5} color="#ffe6c4" />
        {<pointLight position={(lamp ?? [0, 1, 0]) as [number, number, number]} intensity={lamp ? 2.4 : 0} distance={2.2} color="#ffd08a" />}
        {floor !== "none" && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow><planeGeometry args={[8, 8]} />
          {floor === "wood" ? <meshStandardMaterial map={tex.wood(6, 3, [104, 66, 36])} roughness={0.65} /> : floor === "tile" ? <meshStandardMaterial map={tex.tile(10, 10)} roughness={0.3} /> : floor === "dark" ? <meshStandardMaterial color="#1d1f22" roughness={0.6} /> : <meshStandardMaterial map={tex.counter(4, 4)} roughness={0.5} />}</mesh>}
        {wall !== "none" && <mesh position={[0, 2, -1.6]} receiveShadow><planeGeometry args={[10, 5]} />
          {wall === "tile" ? <meshStandardMaterial map={tex.tile(14, 7, "#8d8a84", "#5d5a55")} roughness={0.35} /> : wall === "wood" ? <meshStandardMaterial map={tex.wood(8, 2, [96, 62, 36])} roughness={0.8} /> : <meshStandardMaterial color="#24262a" roughness={0.9} />}</mesh>}
        {children(tt, cl((t - at) / Math.max(0.5, dur)))}
        <ClampScales />
      </ThreeCanvas>
    </AbsoluteFill>
    {/* viñeta suave y luz cálida de arriba (no es filtro: es la luz del cuarto) */}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 58%, rgba(0,0,0,.5))", pointerEvents: "none" }} />
    {over && over(tt)}
  </AbsoluteFill>;
};
