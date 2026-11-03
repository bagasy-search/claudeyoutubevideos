// mk01a · KIT 3D de los componentes premium. Diferencia con lin29kit/h3d: el lienzo es TRANSPARENTE (sin composer: el bloom
// mata el alfa) y vive DENTRO del Stage de base.tsx → detrás corre el clip Veo de ese momento, hundido y desenfocado.
// PBR igual (entorno RoomEnvironment, ACES, sombras suaves). Las superficies (colcha, mesa) son FINITAS y se funden en el borde.
// Todo es f(t). Render SÓLO en el farm; stills SÓLO por still.mjs.
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { M, RBox, rn, lerp, cl, tubeG, rbox } from "../lin29kit/h3d";
import { sm } from "./lib";

export { M, RBox, rn, lerp, cl, tubeG, rbox };
export const { fontFamily: HAND } = loadHand("normal", { weights: ["700"], subsets: ["latin"] });
export type V3 = [number, number, number];
export type Pose = { p: V3; l: V3; fov?: number };

// ---------- tiempo ----------
// resorte con masa: 0 → 1, se pasa un poco y asienta (nunca negativo antes de a)
export const spr = (t: number, a: number, k = 1, z = 1.9) => { const x = Math.max(0, (t - a) * 6 * k); return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * z); };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
// cámara: de una pose a otra en curva (ease + deriva senoidal + respiración de mano); llega desde la profundidad (back)
export const camA = (t: number, a: number, b: number, p0: Pose, p1: Pose, sway = 1): Pose => {
  const k = sm((t - a) / Math.max(0.5, b - a)), arr = 1 - spr(t, a - 0.05, 0.55, 1.2);
  const lp = (u: V3, v: V3) => [lerp(u[0], v[0], k), lerp(u[1], v[1], k), lerp(u[2], v[2], k)] as V3;
  const P = lp(p0.p, p1.p), L = lp(p0.l, p1.l), d = [P[0] - L[0], P[1] - L[1], P[2] - L[2]];
  const ang = 0.05 * sway * Math.sin((t - a) * 0.7), ca = Math.cos(ang), sa = Math.sin(ang), back = 1 + 0.22 * arr;
  const hx = 0.004 * Math.sin(t * 1.7) + 0.003 * Math.sin(t * 2.9 + 1), hy = 0.003 * Math.sin(t * 1.3 + 2);
  return { p: [L[0] + (d[0] * ca - d[2] * sa) * back + hx, L[1] + d[1] * back + hy, L[2] + (d[0] * sa + d[2] * ca) * back], l: L, fov: lerp(p0.fov ?? 32, p1.fov ?? 32, k) };
};

// ---------- texturas procedurales ----------
const TXC = new Map<string, THREE.Texture>();
export const canv = (key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1], srgb = true) => {
  const k = key + rep.join("x"); let t = TXC.get(k); if (t) return t;
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  t = new THREE.CanvasTexture(cv); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; TXC.set(k, t); return t;
};
// colcha de crochet de Carol: cuadrados granny crema con calados (mapa de color + mapa de alfa para que se vea lo de abajo)
const crochetDraw = (g: CanvasRenderingContext2D, alpha: boolean) => {
  const N = 4, C = 512 / N;
  g.fillStyle = alpha ? "#fff" : "#d8c9aa"; g.fillRect(0, 0, 512, 512);
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const cx = c * C + C / 2, cy = r * C + C / 2;
    for (let ring = 0; ring < 4; ring++) {
      const R = 10 + ring * 14;
      for (let k = 0; k < 4; k++) for (let j = 0; j < 2 + ring; j++) {   // racimos de puntos + calado entre racimos
        const side = k, u = (j + 0.5) / (2 + ring) * 2 - 1;
        const x = side % 2 === 0 ? cx + u * R : cx + (side === 1 ? R : -R), y = side % 2 === 0 ? cy + (side === 0 ? -R : R) : cy + u * R;
        g.fillStyle = alpha ? "#000" : "rgba(70,55,38,.75)"; g.beginPath(); g.ellipse(x, y, 3.2, 3.2, 0, 0, 6.3); g.fill();
      }
      if (!alpha) { g.strokeStyle = `rgba(255,250,238,${0.35 + 0.1 * ring})`; g.lineWidth = 2.2; g.strokeRect(cx - R - 6, cy - R - 6, 2 * R + 12, 2 * R + 12); }
    }
    if (!alpha) { g.fillStyle = r % 2 === c % 2 ? "rgba(214,120,92,.55)" : "rgba(122,150,120,.45)"; g.beginPath(); g.arc(cx, cy, 7, 0, 6.3); g.fill(); }
    g.fillStyle = alpha ? "#000" : "rgba(80,64,44,.6)"; g.fillRect(c * C, r * C, C, 2.5); g.fillRect(c * C, r * C, 2.5, C);
  }
  if (!alpha) for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${rn(i, 1) > 0.5 ? "255,250,240" : "120,100,70"},${0.08 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 512, 2, 2); }
};
export const crochetTex = (rep: [number, number]) => canv("crochet", 512, 512, (g) => crochetDraw(g, false), rep);
export const crochetAlpha = (rep: [number, number]) => canv("crochetA", 512, 512, (g) => crochetDraw(g, true), rep, false);
// fundido del borde de una superficie finita (alfa radial): la colcha se pierde en el clip de fondo
export const edgeAlpha = () => canv("edgeA", 256, 256, (g) => {
  const gr = g.createRadialGradient(128, 128, 60, 128, 128, 128); gr.addColorStop(0, "#fff"); gr.addColorStop(0.72, "#fff"); gr.addColorStop(1, "#000");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
}, [1, 1], false);
// atrapa-sombras: plano invisible que sólo muestra la sombra (el objeto se apoya sobre el clip de fondo)
export const Sombra: React.FC<{ w?: number; d?: number; o?: number; y?: number }> = ({ w = 3, d = 3, o = 0.38, y = 0 }) => <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow><planeGeometry args={[w, d]} /><shadowMaterial transparent opacity={o} /></mesh>;
// borde deshilachado de una muestra de tela (alphaMap)
export const flecos = () => canv("flecos", 256, 256, (g) => {
  g.fillStyle = "#000"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#fff"; g.fillRect(10, 10, 236, 236);
  for (let i = 0; i < 236; i += 2) { [[10 + i, 10, 0, -1], [10 + i, 246, 0, 1], [10, 10 + i, -1, 0], [246, 10 + i, 1, 0]].forEach(([x, y, dx, dy], k) => { const L = 2 + 8 * rn(i * 4 + k, 9); g.fillRect(x - (dx ? (dx < 0 ? L : 0) : 0), y - (dy ? (dy < 0 ? L : 0) : 0), dx ? L : 1.2, dy ? L : 1.2); }); }
}, [1, 1], false);
// cuero tostado gastado: moteado, rayones, bordes oscurecidos por el uso
export const leatherTex = (base = [124, 70, 36], key = "") => canv("leather" + base.join(",") + key, 512, 512, (g) => {
  g.fillStyle = `rgb(${base.join(",")})`; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 900; i++) { const v = rn(i, 1); g.fillStyle = v > 0.5 ? `rgba(255,210,160,${0.08 * rn(i, 2)})` : `rgba(40,18,6,${0.14 * rn(i, 2)})`; g.beginPath(); g.arc(rn(i, 3) * 512, rn(i, 4) * 512, 4 + 22 * rn(i, 5), 0, 6.3); g.fill(); }
  for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(40,20,8,${0.12 * rn(i, 6)})`; g.fillRect(rn(i, 7) * 512, rn(i, 8) * 512, 1.5, 1.5); }
  for (let i = 0; i < 18; i++) { g.strokeStyle = `rgba(235,200,160,${0.08 + 0.1 * rn(i, 9)})`; g.lineWidth = 0.8 + rn(i, 10); g.beginPath(); const x = rn(i, 11) * 512, y = rn(i, 12) * 512; g.moveTo(x, y); g.quadraticCurveTo(x + 20 * rn(i, 13), y + 8, x + 30 * rn(i, 14) + 6, y + 14 * rn(i, 15) - 7); g.stroke(); }
  const ed = g.createRadialGradient(256, 256, 140, 256, 256, 380); ed.addColorStop(0, "rgba(0,0,0,0)"); ed.addColorStop(1, "rgba(30,14,4,.45)"); g.fillStyle = ed; g.fillRect(0, 0, 512, 512);
});
export const leatherRough = () => canv("leatherR", 256, 256, (g) => {
  g.fillStyle = "#b0b0b0"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 400; i++) { const v = 120 + rn(i, 1) * 110; g.fillStyle = `rgb(${v},${v},${v})`; g.beginPath(); g.arc(rn(i, 2) * 256, rn(i, 3) * 256, 3 + 14 * rn(i, 4), 0, 6.3); g.fill(); }
}, [1, 1], false);
// forro escocés (tartán rojo, verde y crema)
export const tartanTex = (rep: [number, number] = [2, 2]) => canv("tartan", 256, 256, (g) => {
  g.fillStyle = "#7d1d22"; g.fillRect(0, 0, 256, 256);
  const band = (x: number, w: number, col: string, a = 0.8) => { g.globalAlpha = a; g.fillStyle = col; g.fillRect(x, 0, w, 256); g.fillRect(0, x, 256, w); g.globalAlpha = 1; };
  band(20, 46, "#1e4232", 0.72); band(150, 46, "#1e4232", 0.72); band(100, 18, "#14233f", 0.6); band(90, 3, "#e9d9a8", 0.85); band(230, 3, "#e9d9a8", 0.85); band(40, 2, "#d9b44a", 0.8);
  for (let y = 0; y < 256; y += 2) { g.fillStyle = "rgba(0,0,0,.06)"; g.fillRect(0, y, 256, 1); }
  for (let i = 0; i < 2200; i++) { g.fillStyle = `rgba(255,255,255,${0.05 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 256, rn(i, 3) * 256, 1, 2); }
}, rep);
// tarjeta crema con escritura a mano que se va escribiendo (p 0..1, cuantizado a 24 pasos); sub = línea chica abajo
export const handCard = (txt: string, p: number, w = 512, h = 320, opts: { bg?: string; ink?: string; size?: number; sub?: string; line?: boolean } = {}) => {
  const q = Math.round(cl(p) * 24) / 24, ready = typeof document !== "undefined" && document.fonts.check(`700 40px "${HAND}"`);
  return canv(`hc|${txt}|${q}|${w}|${h}|${opts.sub}|${opts.bg}|${opts.size}|${ready}`, w, h, (g) => {
    g.fillStyle = opts.bg ?? "#efe4c8"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(140,110,70,${0.06 * rn(i, 2)})`; g.fillRect(rn(i, 3) * w, rn(i, 4) * h, 2, 2); }
    if (opts.line !== false) { g.strokeStyle = "rgba(120,140,170,.35)"; g.lineWidth = 2; for (let y = h * 0.72; y < h; y += h * 0.18) { g.beginPath(); g.moveTo(16, y); g.lineTo(w - 16, y); g.stroke(); } }
    g.font = `700 ${opts.size ?? h * 0.62}px "${HAND}"`; g.textAlign = "center"; g.textBaseline = "middle";
    const m = g.measureText(txt), x0 = w / 2 - m.width / 2;
    g.save(); g.beginPath(); g.rect(0, 0, x0 + m.width * q + 2, h); g.clip();   // la pluma avanza de izquierda a derecha
    g.fillStyle = opts.ink ?? "#1d2a4a"; g.fillText(txt, w / 2, h * 0.47); g.restore();
    if (opts.sub && q >= 1) { g.font = `700 ${h * 0.16}px "${HAND}"`; g.fillStyle = "rgba(29,42,74,.8)"; g.fillText(opts.sub, w / 2, h * 0.86); }
  });
};

// ---------- imagen → textura (espera la carga: delayRender + advance) ----------
const IMC = new Map<string, THREE.Texture>();
export const useImg = (path?: string) => {
  const url = path ? staticFile(path) : undefined;
  const [tex, setTex] = useState<THREE.Texture | null>(() => (url ? IMC.get(url) ?? null : null));
  const [h] = useState(() => (url && !IMC.get(url) ? delayRender("img " + url) : 0));
  useEffect(() => {
    if (!url || tex) return;
    new THREE.TextureLoader().load(url, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; IMC.set(url, t); setTex(t); }, undefined, () => h && continueRender(h));
  }, [url]);
  const [st] = useState(() => ({ ok: false }));
  const done = () => { if (!st.ok && h) { st.ok = true; continueRender(h); } };
  return [tex, done] as const;
};
// se monta dentro del canvas: cuando una textura llegó, fuerza el dibujo y recién ahí suelta la captura
export const Ready: React.FC<{ dep: unknown; done: () => void }> = ({ dep, done }) => {
  const { advance } = useThree();
  useEffect(() => { if (!dep) return; advance(performance.now()); requestAnimationFrame(() => { advance(performance.now()); done(); }); }, [dep]);
  return null;
};

// ---------- escenario 3D transparente ----------
const ENV = new WeakMap<object, THREE.Texture>();
const Lite: React.FC<{ exposure: number; env: number }> = ({ exposure, env }) => {
  const { gl, scene } = useThree();
  gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = exposure; gl.outputColorSpace = THREE.SRGBColorSpace;
  gl.shadowMap.type = THREE.PCFSoftShadowMap; gl.setClearColor(0x000000, 0); gl.localClippingEnabled = true;
  let e = ENV.get(gl); if (!e) { e = new THREE.PMREMGenerator(gl).fromScene(new RoomEnvironment(), 0.04).texture; ENV.set(gl, e); }
  scene.environment = e; (scene as unknown as { environmentIntensity: number }).environmentIntensity = env; scene.background = null;
  return null;
};
const Rig: React.FC<{ c: Pose }> = ({ c }) => {
  const k = useThree().camera as THREE.PerspectiveCamera;
  k.position.set(...c.p); k.up.set(0, 1, 0); k.lookAt(...c.l); k.fov = c.fov ?? 32; k.near = 0.01; k.far = 60; k.updateProjectionMatrix();
  return null;
};
// escala 0 = matriz singular → NaN en sombras: lleva toda escala a ≥0,001 y oculta lo aplastado (igual que h3d)
const ClampScales: React.FC = () => {
  const { scene } = useThree();
  React.useLayoutEffect(() => { scene.traverse((o: THREE.Object3D) => {
    const s = o.scale, z = Math.abs(s.x) <= 1e-3 || Math.abs(s.y) <= 1e-3 || Math.abs(s.z) <= 1e-3;
    if (z) { s.set(Math.max(Math.abs(s.x), 1e-3), Math.max(Math.abs(s.y), 1e-3), Math.max(Math.abs(s.z), 1e-3)); if (o.visible) { o.visible = false; o.userData.cz = true; } }
    else if (o.userData.cz) { o.visible = true; delete o.userData.cz; }
  }); });
  return null;
};
// luz con motivo: ventana cálida de la izquierda (la del cuarto de Carol), contra fría que dibuja el borde, relleno bajo
export const Esc: React.FC<{ cam: Pose; children: React.ReactNode; key1?: V3; warm?: number; exposure?: number; env?: number; cool?: number }> = ({ cam, children, key1 = [-1.6, 2.6, 1.4], warm = 1, exposure = 1, env = 0.55, cool = 1 }) => (
  <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true, premultipliedAlpha: true, localClippingEnabled: true } as unknown as THREE.WebGLRendererParameters} style={{ position: "absolute", inset: 0 }}>
    <Rig c={cam} />
    <Lite exposure={exposure} env={env} />
    <hemisphereLight args={["#e9eef5", "#3a2a1c", 0.35]} />
    <spotLight position={key1} angle={0.6} penumbra={0.9} intensity={16 * warm} distance={10} decay={1.6} castShadow color="#ffe7c8" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />
    <spotLight position={[1.8, 1.5, -1.6]} angle={0.7} penumbra={0.9} intensity={6 * cool} distance={8} color="#cfe0ff" />
    <pointLight position={[0.8, 0.45, 1.8]} intensity={0.8} distance={5} color="#ffe2bd" />
    {children}
    <ClampScales />
  </ThreeCanvas>
);

// colcha de crochet (superficie finita, ondulada, fundida en el borde)
const quiltG = (w: number, d: number) => {
  const k = `quilt${w}|${d}`; const c = GEO.get(k); if (c) return c;
  const g = new THREE.PlaneGeometry(w, d, 90, 60), p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, 0.012 * Math.sin(x * 5.1 + 1.3) * Math.cos(y * 4.3) + 0.008 * Math.sin(x * 11 + y * 7) + 0.02 * Math.max(0, Math.abs(y) / (d / 2) - 0.6)); }
  g.computeVertexNormals(); GEO.set(k, g); return g;
};
const GEO = new Map<string, THREE.BufferGeometry>();
export const Colcha: React.FC<{ w?: number; d?: number; y?: number }> = ({ w = 3.2, d = 2.2, y = 0 }) => (
  <group position={[0, y, 0]}>
    {/* la sábana de abajo (se ve por los calados) */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.006, 0]} receiveShadow geometry={quiltG(w, d)}><meshStandardMaterial color="#b9a88c" roughness={0.95} alphaMap={edgeAlpha()} transparent depthWrite={false} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={quiltG(w, d)}>
      <meshPhysicalMaterial map={crochetTex([w * 0.9, d * 0.9])} bumpMap={crochetAlpha([w * 0.9, d * 0.9])} bumpScale={3} roughness={0.92} sheen={1} sheenColor={"#fff4e0"} sheenRoughness={0.6} alphaMap={edgeAlpha()} transparent alphaTest={0.02} />
    </mesh>
  </group>
);

// ---------- geometrías con cache ----------
export const geo = <T extends THREE.BufferGeometry>(k: string, mk: () => T): T => { const c = GEO.get(k) as T | undefined; if (c) return c; const g = mk(); GEO.set(k, g); return g; };
export const extr = (k: string, pts: number[][], depth: number, bevel = 0.003, holes: number[][][] = []) => geo("ex" + k, () => {
  const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 24 });
  g.translate(0, 0, -depth / 2); g.computeVertexNormals(); return g;
});
// texto impreso (sans) sobre papel/cartón: líneas [texto, x, y, tamaño, color, peso]
export const printTex = (key: string, w: number, h: number, bg: string, lines: [string, number, number, number, string?, string?][], extra?: (g: CanvasRenderingContext2D) => void) => canv("pr" + key, w, h, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(120,100,70,${0.05 * rn(i, 2)})`; g.fillRect(rn(i, 3) * w, rn(i, 4) * h, 2, 2); }
  extra?.(g);
  for (const [s, x, y, size, col, wt] of lines) { g.font = `${wt ?? "800"} ${size}px Montserrat, Arial`; g.fillStyle = col ?? "#1d2430"; g.textBaseline = "middle"; g.fillText(s, x, y); }
});
// tela: jersey de algodón, lino, lana, poliéster brillante estampado, sarga azul marino (uniforme)
export const fabricTex = (kind: "jersey" | "lino" | "lana" | "poli" | "navy", rep: [number, number] = [1, 1]) => canv("fab" + kind, 512, 512, (g) => {
  const B: Record<string, string> = { jersey: "#f1eee8", lino: "#cdbf9f", lana: "#8e8f92", poli: "#e9792e", navy: "#1c2740" };
  g.fillStyle = B[kind]; g.fillRect(0, 0, 512, 512);
  if (kind === "jersey") for (let y = 0; y < 512; y += 8) for (let x = 0; x < 512; x += 6) { g.strokeStyle = `rgba(150,140,125,${0.25 + 0.15 * rn(x * 7 + y, 1)})`; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 3, y + 7); g.lineTo(x + 6, y); g.stroke(); }
  if (kind === "lino") for (let i = 0; i < 512; i += 3) { g.fillStyle = `rgba(${rn(i, 1) > 0.5 ? "255,245,220" : "90,75,50"},${0.12 + 0.2 * rn(i, 2)})`; g.fillRect(0, i, 512, 1 + rn(i, 3) * 2); g.fillRect(i, 0, 1 + rn(i, 4) * 2, 512); }
  if (kind === "lana") for (let c = 0; c < 8; c++) for (let y = 0; y < 512; y += 16) { const x = c * 64 + 32; g.strokeStyle = "rgba(210,210,214,.55)"; g.lineWidth = 7; g.beginPath(); g.moveTo(x - 14, y); g.quadraticCurveTo(x, y + 12, x + 14, y); g.stroke(); g.strokeStyle = "rgba(40,40,44,.4)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 14, y + 4); g.quadraticCurveTo(x, y + 16, x + 14, y + 4); g.stroke(); }
  if (kind === "poli") { for (let i = 0; i < 70; i++) { const x = rn(i, 1) * 512, y = rn(i, 2) * 512, r = 9 + 8 * rn(i, 3); g.fillStyle = i % 3 ? "#ffb35a" : "#c4421c"; for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(x + Math.cos(k * 1.256) * r, y + Math.sin(k * 1.256) * r, r * 0.7, r * 0.42, k * 1.256, 0, 6.3); g.fill(); } g.fillStyle = "#fff1b0"; g.beginPath(); g.arc(x, y, r * 0.35, 0, 6.3); g.fill(); } }
  if (kind === "navy") for (let i = 0; i < 512; i += 2) { g.fillStyle = `rgba(${i % 4 ? "60,80,120" : "8,12,24"},.35)`; g.save(); g.translate(0, i); g.transform(1, 0, 0.6, 1, 0, 0); g.fillRect(-300, 0, 1200, 1); g.restore(); }
  for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(${rn(i, 9) > 0.5 ? "255,255,255" : "0,0,0"},${0.05 * rn(i, 8)})`; g.fillRect(rn(i, 6) * 512, rn(i, 7) * 512, 1.5, 1.5); }
}, rep);
// sombra de contacto falsa (mancha radial): sin bordes duros cuando la sombra real se iría lejos del objeto
export const Blob: React.FC<{ w?: number; d?: number; o?: number; y?: number }> = ({ w = 1, d = 1, o = 0.5, y = 0.001 }) => <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}><planeGeometry args={[w, d]} /><meshBasicMaterial map={canv("blob", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 10, 128, 128, 128); gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(0.55, "rgba(0,0,0,.6)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); })} transparent opacity={o} depthWrite={false} /></mesh>;
