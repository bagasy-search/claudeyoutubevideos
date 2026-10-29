// lou29 · UTILERÍA 3D del diner para los componentes (vuelta 2, 29-oct: el evaluador pidió OBJETOS 3D reales, no placas 2D).
// Un <Bench> = un ThreeCanvas con la mesada de fórmica del Blue Moon, la foto del momento desenfocada atrás (con paralaje),
// luz principal con sombra de contacto, contraluz cálido, entorno PBR + AO, y una cámara que entra desde atrás, deriva en curva
// y se va hacia atrás. Adentro, piezas de utilería (olla, plato con la FOTO REAL del plato encima, sartén de hierro, frasco,
// moneda, papel escrito, reloj, termómetro…) que cada componente mueve con física desde tt (segundos desde que entra).
// Luces SIEMPRE montadas. Texturas (fotos y texto en canvas) con delayRender hasta que cargan las fuentes y las imágenes.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { continueRender, delayRender, staticFile } from "remotion";
import * as THREE from "three";
import { Post } from "./fx3d";
import { P, FONT } from "./lib";
import { HAND, MARK } from "./hkit";

export type V3 = [number, number, number];
const cl = (x: number) => Math.max(0, Math.min(1, x));
export const sp = (t: number, a: number, w = 7, z = 0.45) => { const x = t - a; if (x <= 0) return 0; const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x)); };
export const ez = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- texturas ----------
const texCache = new Map<string, THREE.Texture>();
const fontsReady = () => Promise.all([`900 40px ${FONT}`, `700 40px ${HAND}`, `400 40px ${MARK}`].map((f) => document.fonts.load(f))).then(() => document.fonts.ready);
const loadImg = (src: string) => new Promise<HTMLImageElement>((res, rej) => { const im = new Image(); im.crossOrigin = "anonymous"; im.onload = () => res(im); im.onerror = rej; im.src = src; });
export type Draw = (g: CanvasRenderingContext2D, w: number, h: number, im?: HTMLImageElement) => void;
// PRECARGA (antes del primer cuadro): fuentes + todas las fotos que usan los componentes. El ThreeCanvas de Remotion no vuelve
// a dibujar cuando llega algo asíncrono, así que las texturas se dibujan SINCRÓNICAS desde esta caché (si no, salen blancas).
const imgCache = new Map<string, HTMLImageElement>();
export const preload = (ids: string[]) => {
  const hd = delayRender("preload lou29 3D");
  Promise.all([fontsReady(), ...ids.map((id) => loadImg(staticFile("img/" + P + id + ".jpg")).then((im) => { imgCache.set(id, im); }).catch(() => undefined))]).finally(() => continueRender(hd));
};
export const useTex = (key: string, w: number, h: number, draw: Draw, photo?: string): THREE.Texture | null => useMemo(() => {
  const c = texCache.get(key); if (c) return c;
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!, w, h, photo ? imgCache.get(photo) : undefined);
  const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; texCache.set(key, tx); return tx;
}, [key]);
// foto del video recortada al centro (cuadrada) — para la comida dentro de un plato/olla
export const usePhoto = (id: string | undefined, blur = 0, bright = 1, zoom = 1) => { const tx = useTex(`ph:${id}:${blur}:${bright}:${zoom}`, 1024, blur ? 576 : 1024, (g, w, h, im) => {
  // sin foto cargada: pared cálida de diner (nunca negro)
  const gr = g.createRadialGradient(w * 0.5, h * 0.35, 40, w * 0.5, h * 0.5, w * 0.75); gr.addColorStop(0, "#c9a27c"); gr.addColorStop(0.6, "#7a5a44"); gr.addColorStop(1, "#3e2e24");
  g.fillStyle = gr; g.fillRect(0, 0, w, h); if (!im) return;
  const s = Math.max(w / im.width, h / im.height) * zoom; g.filter = `${blur ? `blur(${blur}px) ` : ""}brightness(${bright})`;
  g.drawImage(im, (w - im.width * s) / 2, (h - im.height * s) / 2, im.width * s, im.height * s);
}, id); return id ? tx : null; };

// ---------- materiales ----------
const M = {
  steel: () => new THREE.MeshStandardMaterial({ color: "#d9dde2", metalness: 1, roughness: 0.22 }),
  iron: () => new THREE.MeshStandardMaterial({ color: "#26231f", metalness: 0.65, roughness: 0.52 }),
  china: () => new THREE.MeshPhysicalMaterial({ color: "#f6f1e7", roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 }),
  glass: () => new THREE.MeshPhysicalMaterial({ color: "#e8f2f0", roughness: 0.04, metalness: 0, transparent: true, opacity: 0.28, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false }),
};
export const useMat = (k: keyof typeof M) => useMemo(() => M[k](), [k]);
export const Std: React.FC<{ c: string; r?: number; m?: number; e?: string; ei?: number; cc?: number }> = ({ c, r = 0.6, m = 0, e, ei = 0, cc = 0 }) =>
  <meshPhysicalMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} clearcoat={cc} />;

// lathe a partir de un perfil [radio, alto]
const lathe = (pts: [number, number][], seg = 72) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);

// ---------- cámara ----------
export type Cam = { p: V3; l: V3; fov?: number };
const CamRig: React.FC<{ tt: number; dur: number; cam: Cam; cam2?: Cam }> = ({ tt, dur, cam, cam2 }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  const k2 = cam2 ? ez(tt, 0.8, Math.max(2, dur - 0.8)) : 0;
  const p = cam.p.map((v, i) => lerp(v, cam2?.p[i] ?? v, k2)), l = cam.l.map((v, i) => lerp(v, cam2?.l[i] ?? v, k2));
  // entra desde atrás y arriba (resorte con peso), deriva en curva, y al salir se aleja y sube
  const inn = sp(tt, 0, 3.2, 0.78), out = ez(tt, dur - 0.35, dur + 0.8);
  const dz = 1.6 * (1 - inn) + 2.2 * out, dy = 0.5 * (1 - inn) + 0.6 * out;
  c.position.set(p[0] + 0.08 * Math.sin(tt * 0.37) + 0.02 * Math.sin(tt * 1.1), p[1] + dy + 0.04 * Math.sin(tt * 0.29 + 1), p[2] + dz + 0.05 * Math.sin(tt * 0.23));
  c.up.set(0, 1, 0); c.lookAt(l[0] + 0.03 * Math.sin(tt * 0.31), l[1], l[2]); c.fov = lerp(cam.fov ?? 34, cam2?.fov ?? cam.fov ?? 34, k2); c.near = 0.02; c.far = 60; c.updateProjectionMatrix();
  return null;
};

// ---------- escenario ----------
const formica = (g: CanvasRenderingContext2D, w: number, h: number) => {
  g.fillStyle = "#e9e1cf"; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 1400; i++) { const c = ["#c9b99a", "#9fb6b0", "#d9b48a", "#b5aa98"][i % 4]; g.fillStyle = c; g.globalAlpha = 0.35 + rnd(i, 2) * 0.4; g.beginPath(); g.ellipse(rnd(i, 3) * w, rnd(i, 4) * h, 1.5 + rnd(i, 5) * 3.5, 1 + rnd(i, 6) * 2, rnd(i, 7) * 3, 0, 6.3); g.fill(); }
  g.globalAlpha = 1; for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(90,70,50,${0.05 + 0.06 * rnd(i, 8)})`; g.lineWidth = 1; g.beginPath(); const x = rnd(i, 9) * w, y = rnd(i, 10) * h; g.moveTo(x, y); g.lineTo(x + 80 * (rnd(i, 11) - 0.5), y + 30 * (rnd(i, 12) - 0.5)); g.stroke(); }
};
export const Bench: React.FC<{ tt: number; dur: number; bg?: string; cam: Cam; cam2?: Cam; top?: "formica" | "steel" | "wood"; key2?: number; children: React.ReactNode }> = ({ tt, dur, bg, cam, cam2, top = "formica", key2 = 1, children }) => {
  const back = usePhoto(bg, 22, 0.6);
  const fm = useTex("formica", 1024, 1024, formica);
  useMemo(() => { if (fm) { fm.wrapS = fm.wrapT = THREE.RepeatWrapping; fm.repeat.set(3, 2); } }, [fm]);
  return <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
    <CamRig tt={tt} dur={dur} cam={cam} cam2={cam2} />
    <Post bloom={0.3} threshold={0.97} exposure={0.92} env={0.45} />
    <color attach="background" args={["#0b0907"]} />
    {/* la foto del momento, desenfocada, como pared lejana con paralaje propio */}
    <mesh position={[0.4 * Math.sin(tt * 0.12), 1.6, -7]}><planeGeometry args={[19, 10.7]} /><meshBasicMaterial key={back ? "t" : "n"} map={back ?? undefined} color={back ? "#9a8f84" : "#5e4636"} toneMapped={false} /></mesh>
    <hemisphereLight args={[0xfff1dc, 0x2a2018, 0.3]} />
    <spotLight position={[-2.6, 4.2, 3.2]} angle={0.55} penumbra={0.8} intensity={16 * key2} distance={14} decay={2} color="#fff0d8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0002} shadow-normalBias={0.02} />
    <pointLight position={[2.8, 1.8, -2.4]} intensity={4} distance={9} color="#ffb870" />
    <pointLight position={[0, 2.5, 4]} intensity={1.2} distance={10} color="#ffe9cf" />
    {/* mesada: fórmica moteada con canto cromado; o acero de la plancha; o madera */}
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, -1]} receiveShadow><planeGeometry args={[14, 9]} />
      {top === "formica" ? <meshPhysicalMaterial key={fm ? "t" : "n"} map={fm ?? undefined} roughness={0.42} clearcoat={0.6} clearcoatRoughness={0.25} /> : top === "steel" ? <meshStandardMaterial color="#5a5c60" metalness={0.9} roughness={0.38} /> : <meshStandardMaterial color="#6b4628" roughness={0.6} />}
    </mesh>
    <mesh position={[0, -0.03, 3.5]}><boxGeometry args={[14, 0.06, 0.06]} /><meshStandardMaterial color="#dfe3e8" metalness={1} roughness={0.15} /></mesh>
    {children}
  </ThreeCanvas>;
};

// ---------- piezas ----------
type T = { p?: V3; r?: V3; s?: number | V3; children?: React.ReactNode };
export const G: React.FC<T> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, children }) => <group position={p} rotation={r} scale={typeof s === "number" ? [s, s, s] : s}>{children}</group>;

// olla de acero (radio, alto); fill = color del contenido, level 0..1; photo = foto del contenido vista desde arriba
export const Pot: React.FC<T & { rad?: number; h?: number; fill?: string; level?: number; photo?: string; zoom?: number; handles?: boolean }> = ({ rad = 0.5, h = 0.55, fill, level = 0.85, photo, zoom = 2.1, handles = true, ...t }) => {
  const steel = useMat("steel"); const ph = usePhoto(photo, 0, 1, zoom);
  const geo = useMemo(() => lathe([[0.001, 0], [rad * 0.96, 0], [rad, 0.03], [rad, h], [rad + 0.03, h + 0.01], [rad + 0.03, h + 0.03], [rad - 0.015, h + 0.03], [rad - 0.015, 0.03], [0.001, 0.03]]), [rad, h]);
  return <G {...t}>
    <mesh geometry={geo} material={steel} castShadow receiveShadow />
    {(fill || ph) && <mesh position={[0, 0.03 + (h - 0.06) * level, 0]} rotation-x={-Math.PI / 2}><circleGeometry args={[rad - 0.02, 64]} /><meshStandardMaterial key={ph ? "t" : "n"} map={ph ?? undefined} color={ph ? "#fff" : fill} roughness={0.35} /></mesh>}
    {handles && [-1, 1].map((sx) => <mesh key={sx} position={[sx * (rad + 0.06), h * 0.8, 0]} rotation={[0, 0, Math.PI / 2]} material={steel} castShadow><torusGeometry args={[0.07, 0.016, 12, 24, Math.PI]} /></mesh>)}
  </G>;
};
// plato de loza con la FOTO REAL del plato encima (centro de la foto vista desde arriba)
export const Plate: React.FC<T & { rad?: number; photo?: string; zoom?: number; food?: string; deep?: boolean }> = ({ rad = 0.42, photo, zoom = 1.45, food, deep, ...t }) => {
  const china = useMat("china"); const ph = usePhoto(photo, 0, 1, zoom);
  const geo = useMemo(() => lathe(deep ? [[0.001, 0], [rad * 0.45, 0], [rad * 0.55, 0.012], [rad * 0.8, 0.08], [rad, 0.11], [rad * 0.98, 0.115], [rad * 0.78, 0.09], [rad * 0.5, 0.02], [0.001, 0.02]]
    : [[0.001, 0], [rad * 0.55, 0], [rad * 0.62, 0.012], [rad * 0.72, 0.016], [rad, 0.045], [rad * 0.99, 0.052], [rad * 0.72, 0.026], [rad * 0.6, 0.02], [0.001, 0.02]]), [rad, deep]);
  return <G {...t}>
    <mesh geometry={geo} material={china} castShadow receiveShadow />
    <mesh position={[0, 0.0105, 0]} rotation-x={-Math.PI / 2}><ringGeometry args={[rad * 0.9, rad * 0.93, 64]} /><meshStandardMaterial color="#b3241b" roughness={0.3} /></mesh>
    {(ph || food) && <mesh position={[0, deep ? 0.05 : 0.026, 0]} rotation-x={-Math.PI / 2}><circleGeometry args={[rad * (deep ? 0.74 : 0.66), 64]} /><meshStandardMaterial key={ph ? "t" : "n"} map={ph ?? undefined} color={ph ? "#fff" : food} roughness={0.5} /></mesh>}
  </G>;
};
// sartén de hierro con mango
export const Skillet: React.FC<T & { rad?: number; inside?: string; photo?: string; zoom?: number }> = ({ rad = 0.5, inside, photo, zoom = 1.6, ...t }) => {
  const iron = useMat("iron"); const ph = usePhoto(photo, 0, 1, zoom);
  const geo = useMemo(() => lathe([[0.001, 0], [rad * 0.9, 0], [rad, 0.1], [rad + 0.02, 0.11], [rad - 0.02, 0.11], [rad * 0.88, 0.025], [0.001, 0.025]]), [rad]);
  return <G {...t}>
    <mesh geometry={geo} material={iron} castShadow receiveShadow />
    <mesh position={[rad + 0.32, 0.09, 0]} rotation={[0, 0, 0.12]} material={iron} castShadow><boxGeometry args={[0.62, 0.035, 0.09]} /></mesh>
    {(inside || ph) && <mesh position={[0, 0.03, 0]} rotation-x={-Math.PI / 2}><circleGeometry args={[rad * 0.86, 64]} /><meshStandardMaterial key={ph ? "t" : "n"} map={ph ?? undefined} color={ph ? "#fff" : inside} roughness={0.4} /></mesh>}
  </G>;
};
// frasco de vidrio con contenido y etiqueta escrita
export const Jar: React.FC<T & { rad?: number; h?: number; fill?: string; level?: number; label?: string; lid?: string }> = ({ rad = 0.22, h = 0.5, fill = "#c9b56a", level = 0.8, label, lid = "#8e1c14", ...t }) => {
  const glass = useMat("glass");
  const lab = useTex("jar:" + label, 512, 256, (g, w, hh) => { g.fillStyle = "#f3ead4"; g.fillRect(0, 0, w, hh); g.strokeStyle = "#b3241b"; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, hh - 28); g.fillStyle = "#1d2440"; g.font = `400 84px ${MARK}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(label ?? "", w / 2, hh / 2 + 4); });
  return <G {...t}>
    <mesh position={[0, h / 2, 0]} material={glass}><cylinderGeometry args={[rad, rad, h, 48, 1, true]} /></mesh>
    <mesh position={[0, (h * level) / 2, 0]} castShadow><cylinderGeometry args={[rad * 0.95, rad * 0.95, h * level, 48]} /><Std c={fill} r={0.7} /></mesh>
    <mesh position={[0, h + 0.03, 0]} castShadow><cylinderGeometry args={[rad * 1.02, rad * 1.02, 0.07, 48]} /><Std c={lid} r={0.35} m={0.4} /></mesh>
    {label && <mesh position={[0, h * 0.5, 0]}><cylinderGeometry args={[rad * 1.005, rad * 1.005, h * 0.36, 48, 1, true, -0.9, 1.8]} /><meshStandardMaterial key={lab ? "t" : "n"} map={lab ?? undefined} roughness={0.7} /></mesh>}
  </G>;
};
// vaso de vidrio (para el vaso de jugo que corta biscuits)
export const Glass: React.FC<T & { rad?: number; h?: number }> = ({ rad = 0.13, h = 0.3, ...t }) => {
  const glass = useMat("glass");
  return <G {...t}><mesh position={[0, h / 2, 0]} material={glass} castShadow><cylinderGeometry args={[rad, rad * 0.88, h, 48, 1, true]} /></mesh>
    <mesh position={[0, 0.012, 0]} material={glass}><cylinderGeometry args={[rad * 0.88, rad * 0.88, 0.024, 48]} /></mesh></G>;
};
// moneda con su cara escrita
export const Coin: React.FC<T & { rad?: number; txt: string; col?: string }> = ({ rad = 0.3, txt, col = "#c9ced4", ...t }) => {
  const face = useTex("coin:" + txt + col, 512, 512, (g, w) => {
    const gr = g.createRadialGradient(w / 2, w / 2, 20, w / 2, w / 2, w / 2); gr.addColorStop(0, col === "#c9ced4" ? "#f2f4f6" : "#ffe3a3"); gr.addColorStop(1, col === "#c9ced4" ? "#8d939a" : "#a6762a");
    g.fillStyle = gr; g.fillRect(0, 0, w, w); g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 14; g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 30, 0, 6.3); g.stroke();
    g.fillStyle = "#2b2f35"; g.font = `900 ${txt.length > 3 ? 120 : 170}px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, w / 2, w / 2 + 8);
  });
  return <G {...t}>
    <mesh castShadow><cylinderGeometry args={[rad, rad, 0.05, 64]} /><meshStandardMaterial color={col} metalness={1} roughness={0.28} /></mesh>
    <mesh position={[0, 0.026, 0]} rotation-x={-Math.PI / 2}><circleGeometry args={[rad * 0.985, 64]} /><meshStandardMaterial key={face ? "t" : "n"} map={face ?? undefined} metalness={0.85} roughness={0.3} /></mesh>
  </G>;
};
// hoja de papel/cartón con dibujo en canvas (comanda, postal, servilleta, página de calendario, billete)
export const Sheet: React.FC<T & { w?: number; h?: number; th?: number; id: string; draw: Draw; photo?: string; px?: number; col?: string; rough?: number }> = ({ w = 1, h = 0.7, th = 0.006, id, draw, photo, px = 1024, col = "#ffffff", rough = 0.8, ...t }) => {
  const tx = useTex("sh:" + id, px, Math.round((px * h) / w), draw, photo);
  return <G {...t}><mesh castShadow receiveShadow><boxGeometry args={[w, h, th]} />
    {[0, 1, 2, 3].map((i) => <meshStandardMaterial key={i} attach={`material-${i}`} color="#e9e2d0" roughness={0.9} />)}
    <meshStandardMaterial attach="material-4" key={tx ? "t" : "n"} map={tx ?? undefined} color={col} roughness={rough} />
    <meshStandardMaterial attach="material-5" color="#ddd5c2" roughness={0.9} />
  </mesh></G>;
};
// reloj de pared (hora decimal: 2.5 = 2:30)
export const Clock: React.FC<T & { rad?: number; hour: number }> = ({ rad = 0.5, hour, ...t }) => {
  const face = useTex("clockface", 512, 512, (g, w) => {
    g.fillStyle = "#f7f1e3"; g.fillRect(0, 0, w, w); g.fillStyle = "#1d2440"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `900 52px ${FONT}`;
    for (let i = 1; i <= 12; i++) { const a = (i / 12) * Math.PI * 2; g.fillText(String(i), w / 2 + Math.sin(a) * 196, w / 2 - Math.cos(a) * 196); }
    for (let i = 0; i < 60; i++) { const a = (i / 60) * Math.PI * 2, r1 = i % 5 ? 236 : 226; g.strokeStyle = "#1d2440"; g.lineWidth = i % 5 ? 2 : 5; g.beginPath(); g.moveTo(w / 2 + Math.sin(a) * r1, w / 2 - Math.cos(a) * r1); g.lineTo(w / 2 + Math.sin(a) * 248, w / 2 - Math.cos(a) * 248); g.stroke(); }
  });
  const ha = -((hour % 12) / 12) * Math.PI * 2, ma = -((hour % 1)) * Math.PI * 2;
  return <G {...t}>
    <mesh rotation-x={Math.PI / 2} castShadow><cylinderGeometry args={[rad * 1.08, rad * 1.08, 0.08, 64]} /><Std c="#b3241b" r={0.3} cc={1} /></mesh>
    <mesh position={[0, 0, 0.041]}><circleGeometry args={[rad, 64]} /><meshStandardMaterial key={face ? "t" : "n"} map={face ?? undefined} roughness={0.5} /></mesh>
    <mesh position={[0, 0, 0.05]} rotation-z={ha}><mesh position={[0, rad * 0.27, 0]}><boxGeometry args={[0.035, rad * 0.55, 0.01]} /><Std c="#1d2440" /></mesh></mesh>
    <mesh position={[0, 0, 0.056]} rotation-z={ma}><mesh position={[0, rad * 0.38, 0]}><boxGeometry args={[0.022, rad * 0.78, 0.01]} /><Std c="#1d2440" /></mesh></mesh>
    <mesh position={[0, 0, 0.06]}><cylinderGeometry args={[0.03, 0.03, 0.02, 24]} /><Std c="#b3241b" /></mesh>
  </G>;
};
// termómetro de vidrio con mercurio (lvl 0..1)
export const Thermo: React.FC<T & { h?: number; lvl: number }> = ({ h = 1.2, lvl, ...t }) => {
  const glass = useMat("glass");
  return <G {...t}>
    <mesh position={[0, h / 2, 0]} material={glass} castShadow><cylinderGeometry args={[0.05, 0.05, h, 32]} /></mesh>
    <mesh position={[0, 0.02, 0]}><sphereGeometry args={[0.075, 32, 16]} /><Std c="#d42a1e" r={0.2} e="#ff3a20" ei={0.25} /></mesh>
    <mesh position={[0, (h * lvl) / 2, 0]}><cylinderGeometry args={[0.022, 0.022, Math.max(0.001, h * lvl), 16]} /><Std c="#d42a1e" r={0.2} e="#ff3a20" ei={0.3} /></mesh>
  </G>;
};
// carne picada / masa / pan: textura de motas (determinista)
const speck = (base: string, cols: string[], n = 2600) => (g: CanvasRenderingContext2D, w: number, h: number) => {
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; g.globalAlpha = 0.3 + 0.5 * rnd(i, 3); g.beginPath(); g.ellipse(rnd(i, 1) * w, rnd(i, 2) * h, 1 + 3 * rnd(i, 4), 1 + 2 * rnd(i, 5), rnd(i, 6) * 3, 0, 6.3); g.fill(); }
  g.globalAlpha = 1;
};
const FOODTEX: Record<string, Draw> = {
  beef: speck("#9a5248", ["#b4665c", "#7a3a32", "#a85a50", "#c27a70", "#844038"], 6000), cooked: speck("#4e2a18", ["#3a1e12", "#6a3c22", "#2a150c", "#7a4a2e"], 6000),
  dough: speck("#e9d6ae", ["#f5e6c8", "#d6b98a", "#fff3dc"], 900), crust: speck("#c98a45", ["#a86a2e", "#e0a865", "#7d4c1e"], 1600),
  breaded: speck("#c58b3e", ["#e6b066", "#9a6424", "#f0c987", "#7a4a18"], 3000),
};
export const useFoodTex = (k?: string) => useTex("food:" + k, 512, 512, k ? FOODTEX[k] : () => undefined);
// trozos de comida (forma + color): medallón, albóndiga, biscuit, cubo, rodaja
export const Food: React.FC<T & { kind: "patty" | "ball" | "biscuit" | "cube" | "slice" | "cutlet" | "bean"; c?: string; rough?: number; tex?: string }> = ({ kind, c = "#6b3a1e", rough = 0.75, tex, ...t }) => { const ft = useFoodTex(tex); const Std = (p: { c: string; r?: number; cc?: number }) => <meshPhysicalMaterial key={tex ? "t" : "n"} map={tex ? ft ?? undefined : undefined} color={tex ? "#ffffff" : p.c} roughness={p.r ?? 0.6} clearcoat={p.cc ?? 0} />; return <G {...t}>
  {kind === "patty" && <mesh castShadow scale={[1, 0.32, 1]}><sphereGeometry args={[0.2, 40, 20]} /><Std c={c} r={rough} /></mesh>}
  {kind === "ball" && <mesh castShadow><sphereGeometry args={[0.12, 40, 20]} /><Std c={c} r={rough} /></mesh>}
  {kind === "biscuit" && <mesh castShadow><cylinderGeometry args={[0.15, 0.16, 0.16, 40]} /><Std c={c} r={rough} /></mesh>}
  {kind === "cube" && <mesh castShadow><boxGeometry args={[0.12, 0.1, 0.12]} /><Std c={c} r={rough} /></mesh>}
  {kind === "slice" && <mesh castShadow><cylinderGeometry args={[0.18, 0.18, 0.03, 40]} /><Std c={c} r={rough} /></mesh>}
  {kind === "cutlet" && <mesh castShadow scale={[1.4, 0.18, 1]}><sphereGeometry args={[0.2, 40, 20]} /><Std c={c} r={rough} /></mesh>}
  {kind === "bean" && <mesh castShadow scale={[1.3, 0.8, 0.8]}><sphereGeometry args={[0.03, 16, 10]} /><Std c={c} r={0.4} cc={0.6} /></mesh>}
</G>; };
// cubierto simple: cuchara, tenedor, cuchillo, espátula
export const Tool: React.FC<T & { kind: "spoon" | "fork" | "knife" | "spatula" | "mallet" | "wspoon" }> = ({ kind, ...t }) => {
  const steel = useMat("steel");
  return <G {...t}>
    {kind !== "mallet" && kind !== "wspoon" && <mesh position={[0, 0, 0.36]} material={steel} castShadow><boxGeometry args={[0.05, 0.015, 0.6]} /></mesh>}
    {kind === "spoon" && <mesh position={[0, 0, -0.02]} scale={[1, 0.3, 1.4]} material={steel} castShadow><sphereGeometry args={[0.08, 32, 16]} /></mesh>}
    {kind === "fork" && [-0.045, -0.015, 0.015, 0.045].map((x) => <mesh key={x} position={[x, 0, -0.06]} material={steel} castShadow><boxGeometry args={[0.014, 0.012, 0.2]} /></mesh>)}
    {kind === "knife" && <mesh position={[0, 0, -0.12]} material={steel} castShadow><boxGeometry args={[0.07, 0.008, 0.36]} /></mesh>}
    {kind === "spatula" && <mesh position={[0, 0, -0.12]} material={steel} castShadow><boxGeometry args={[0.3, 0.008, 0.3]} /></mesh>}
    {kind === "mallet" && <><mesh position={[0, 0, 0.3]} castShadow><cylinderGeometry args={[0.03, 0.03, 0.6, 16]} /><Std c="#7a4a26" r={0.6} /></mesh><mesh rotation-x={Math.PI / 2} position={[0, 0, 0]} material={steel} castShadow><boxGeometry args={[0.24, 0.12, 0.12]} /></mesh></>}
    {kind === "wspoon" && <><mesh position={[0, 0, 0.32]} castShadow><cylinderGeometry args={[0.022, 0.026, 0.6, 16]} /><Std c="#a0703e" r={0.6} /></mesh><mesh scale={[1, 0.35, 1.3]} castShadow><sphereGeometry args={[0.07, 24, 12]} /><Std c="#a0703e" r={0.6} /></mesh></>}
  </G>;
};
// chorro que cae (salsa, agua, café): de y0 a y1
export const Pour: React.FC<{ x: number; z: number; y0: number; y1: number; c: string; w?: number; o?: number }> = ({ x, z, y0, y1, c, w = 0.03, o = 1 }) =>
  y0 - y1 > 0.01 && o > 0.01 ? <mesh position={[x, (y0 + y1) / 2, z]}><cylinderGeometry args={[w, w * 0.8, y0 - y1, 16]} /><meshStandardMaterial color={c} roughness={0.2} transparent opacity={o} /></mesh> : null;
// vapor: esferas translúcidas que suben (deterministas)
export const Steam3: React.FC<{ tt: number; p: V3; n?: number; spread?: number; a?: number }> = ({ tt, p, n = 7, spread = 0.3, a = 1 }) => <>{Array.from({ length: n }, (_, i) => {
  const ph = (tt * 0.35 + i / n) % 1;
  return <mesh key={i} position={[p[0] + spread * (rnd(i, 1) - 0.5) + 0.06 * Math.sin(tt * 1.2 + i), p[1] + ph * 0.9, p[2] + spread * (rnd(i, 2) - 0.5)]} scale={0.6 + ph * 1.4}>
    <sphereGeometry args={[0.07, 16, 10]} /><meshBasicMaterial color="#fff6ea" transparent opacity={a * 0.16 * Math.sin(ph * Math.PI)} depthWrite={false} /></mesh>;
})}</>;
// rótulo pintado sobre la mesada o un cartelito parado (texto en 3D, dentro de la escena)
export const Label3: React.FC<T & { txt: string; col?: string; w?: number; font?: "sans" | "hand" | "mark"; bgc?: string }> = ({ txt, col = "#1d2440", w = 0.9, font = "sans", bgc, ...t }) => {
  const ff = font === "hand" ? `700 150px ${HAND}` : font === "mark" ? `400 130px ${MARK}` : `900 120px ${FONT}`;
  const tx = useTex(`lb:${txt}:${col}:${font}:${bgc}`, 1024, 256, (g, ww, hh) => { if (bgc) { g.fillStyle = bgc; g.fillRect(0, 0, ww, hh); } g.fillStyle = col; g.font = ff; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, ww / 2, hh / 2 + 6, ww - 40); });
  return <G {...t}><mesh><planeGeometry args={[w, w / 4]} /><meshStandardMaterial key={tx ? "t" : "n"} map={tx ?? undefined} transparent={!bgc} roughness={0.8} depthWrite={!!bgc} /></mesh></G>;
};
