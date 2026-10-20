// cme3d01 · EL MUNDO: una cuadra latinoamericana de casas de block con techo plano y tinaco, de noche,
// el poste con el transformador de la esquina, y la casa de Claudio en corte (garaje-taller + cocina).
// UNA escena y UNA cámara para todo el minuto 1 y la guía: la cámara vuela de la calle al transformador,
// a la cuadra apagada, a la casa encendida, a la batería, a la mesa y ADENTRO de la guía que se abre.
// Eventos clavados a la voz (segundos globales). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { P } from "./lib";

export const FPS = 30, W = 1920, H = 1080;
export const C1 = 69.8; // arranque de la locución de la guía (cta1) en el tiempo global
export const C2 = 308.8; // segundo momento de la guía (cta2, pág. 56): arranque real de voz_cta2
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------------- puntos del mundo (para portales y rótulos HTML) ----------------
export const POLE: [number, number, number] = [-6, 0, 4.4];
export const PT = {
  trafo: [-6, 6.55, 4.4] as [number, number, number],
  winN: [-7.1, 1.7, 2.6] as [number, number, number],   // ventana de la casa vecina → portal a la heladera
  house: [0, 1.6, 2.5] as [number, number, number],
  fridge: [2.95, 1.25, -1.65] as [number, number, number],
  bulb: [0.6, 2.75, -0.2] as [number, number, number],
  router: [-3.15, 1.95, -2.2] as [number, number, number],
  fan: [3.0, 1.25, 0.9] as [number, number, number],
  bat: [-1.75, 0.45, -1.55] as [number, number, number],
  book: [0.3, 0.99, -1.2] as [number, number, number],
  lantern: [1.25, 1.1, -1.45] as [number, number, number],
};

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: [number, number, number]; l: [number, number, number]; fov?: number; arc?: number };
const c = C1;
export const KEYS: Key[] = [
  // B · "pero no un ratito": desde el portal del avatar, a la altura de la calle mirando al poste de la esquina
  { t: 2.9, p: [7.5, 1.6, 10.5], l: [-6, 4.6, 4.4], fov: 40 },
  { t: 3.4, p: [6.6, 1.7, 10.2], l: [-6, 4.8, 4.4], fov: 39 },
  // "El transformador de la esquina": la cámara sube hasta el tacho del transformador
  { t: 6.25, p: [-2.4, 5.6, 8.6], l: [-6, 6.4, 4.4], fov: 33 },
  { t: 6.55, p: [-2.5, 5.55, 8.75], l: [-6, 6.4, 4.4], fov: 34 },
  // la onda expansiva empuja la cámara hacia atrás y arriba: la cuadra entera se apaga (dominó)
  { t: 8.9, p: [9.5, 6.2, 11.3], l: [-12, 1.0, 3.2], fov: 44, arc: 0.5 },
  { t: 11.2, p: [6.5, 5.0, 11.0], l: [-10, 1.3, 2.8], fov: 42 },
  // vuelo a la ventana de la vecina (portal a la heladera)
  { t: 11.75, p: [-6.2, 2.0, 7.4], l: [-7.0, 1.7, 2.6], fov: 36, arc: 0.6 },
  // G · "Tres días después": la cuadra negra y UNA casa encendida
  { t: 27.3, p: [16, 7.5, 11.2], l: [-2, 1.0, 1.5], fov: 44 },
  { t: 29.9, p: [1.2, 3.4, 12.5], l: [0, 1.5, 0], fov: 38 },
  { t: 34.9, p: [1.0, 2.0, 6.0], l: [0.4, 1.35, -1.2], fov: 40 },
  // H2 · "con una sola batería": la batería en el piso del garaje
  { t: 38.45, p: [-0.75, 1.15, 0.35], l: [-1.75, 0.45, -1.55], fov: 30 },
  { t: 40.5, p: [-0.95, 0.95, 0.15], l: [-1.75, 0.5, -1.55], fov: 28 },
  // J · el orden: casa en corte entera, cables que se encienden
  { t: 47.2, p: [0.3, 2.7, 8.6], l: [0.0, 1.35, -1.0], fov: 40 },
  { t: 54.3, p: [0.6, 2.5, 7.4], l: [0.0, 1.35, -1.0], fov: 38 },
  // CTA1 · la mesa con la guía: se abre desde el farol del avatar
  { t: c - 0.3, p: [1.6, 1.75, 1.2], l: [0.25, 0.98, -1.25], fov: 40 },
  { t: c + 1.0, p: [1.45, 1.7, 0.95], l: [0.27, 0.98, -1.25], fov: 38 },
  // "en mi guía: El Sistema Luz Cero" → la tapa llena el cuadro
  { t: c + 4.4, p: [0.75, 1.55, 0.05], l: [0.3, 0.99, -1.22], fov: 34 },
  { t: c + 6.9, p: [0.36, 1.72, -0.68], l: [0.3, 0.99, -1.24], fov: 34 },
  // "Mira, página 23": la tapa se abre y la cámara se acomoda arriba del libro abierto
  { t: c + 8.2, p: [0.16, 1.82, -0.78], l: [0.17, 0.99, -1.27], fov: 33 },
  // la pinza / el medidor / el reloj: baja sobre la tabla de la página
  { t: c + 11.3, p: [0.34, 1.47, -0.80], l: [0.33, 0.99, -1.11], fov: 30 },
  { t: c + 16.4, p: [0.34, 1.45, -0.79], l: [0.33, 0.99, -1.10], fov: 30 },
  // "en el combo viene el Plan Apagón": paneo al segundo libro que se desliza sobre la mesa
  { t: c + 18.4, p: [0.85, 1.62, -0.55], l: [0.62, 0.99, -1.25], fov: 36 },
  { t: c + 22.6, p: [0.75, 1.68, -0.42], l: [0.5, 0.99, -1.25], fov: 37 },
  // "el link está en la primera línea": la cámara se aleja un poco (la tarjeta flota sobre la mesa)
  { t: c + 26.3, p: [0.9, 1.95, 0.3], l: [0.4, 1.05, -1.2], fov: 40 },
  // "Pero vamos a lo que pasó el segundo día": sale por el frente abierto a la calle, amanece
  { t: c + 29.6, p: [5.5, 3.6, 11.6], l: [-1.5, 1.6, 0.5], fov: 44, arc: 0.4 },
  // ===== EL RESTO (día 2 → día 3): mismas tomas del mismo mundo; entre escenas la cámara viaja tapada por avatar/tomas =====
  // "59 %": la batería de cerca, las rayitas bajan
  { t: 105.0, p: [-0.9, 1.05, -0.2], l: [-1.75, 0.5, -1.55], fov: 32 },
  { t: 115.2, p: [-1.08, 0.9, -0.5], l: [-1.75, 0.5, -1.55], fov: 29 },
  // "una cajita": el inversor en la pared, "prendido gasta"
  { t: 122.2, p: [-1.0, 1.62, -0.9], l: [-1.75, 1.52, -2.15], fov: 32 },
  { t: 133.6, p: [-1.15, 1.62, -1.0], l: [-1.75, 1.5, -2.15], fov: 31 },
  // la cuenta 15 W x 24 h: garaje entero de fondo
  { t: 138.1, p: [0.2, 1.6, 1.2], l: [-1.6, 0.9, -1.7], fov: 38 },
  { t: 149.4, p: [-0.2, 1.4, 0.6], l: [-1.6, 0.9, -1.7], fov: 36 },
  // "3 de la mañana": el compresor arranca
  { t: 155.85, p: [1.4, 1.4, 0.4], l: [2.95, 0.95, -1.7], fov: 36 },
  { t: 161.5, p: [1.75, 1.2, 0.0], l: [2.95, 0.9, -1.7], fov: 34 },
  // "el cable finito": baja a los bornes, se pone al rojo
  { t: 161.9, p: [-1.5, 1.3, -0.7], l: [-1.85, 0.95, -1.6], fov: 32 },
  { t: 166.9, p: [-1.6, 1.15, -0.95], l: [-1.88, 1.0, -1.7], fov: 28 },
  // "se quema el garaje": plano general con el cable rojo
  { t: 171.45, p: [0.6, 1.9, 2.2], l: [-1.2, 0.8, -1.5], fov: 40 },
  { t: 184.7, p: [0.15, 1.7, 1.3], l: [-1.3, 0.85, -1.6], fov: 38 },
  // "la batería exacta": órbita alrededor de la LiFePO4
  { t: 187.94, p: [-0.6, 0.9, -0.3], l: [-1.75, 0.45, -1.55], fov: 34 },
  { t: 193.5, p: [-1.75, 0.95, 0.05], l: [-1.75, 0.45, -1.55], fov: 33 },
  { t: 200.0, p: [-2.75, 1.15, -0.55], l: [-1.75, 0.45, -1.55], fov: 32 },
  // la lista de precios: casa en corte entera
  { t: 204.5, p: [0.3, 2.7, 8.6], l: [0.0, 1.35, -1.0], fov: 40 },
  { t: 217.0, p: [0.6, 2.5, 7.4], l: [0.0, 1.35, -1.0], fov: 38 },
  { t: 220.62, p: [-0.4, 2.3, 6.6], l: [0.0, 1.3, -1.0], fov: 38 },
  { t: 236.0, p: [0.4, 2.1, 5.8], l: [0.0, 1.3, -1.0], fov: 38 },
  // "el orden": todo apagado, primero el refrigerador
  { t: 239.38, p: [0.6, 2.5, 7.6], l: [0.0, 1.35, -1.0], fov: 40 },
  { t: 245.0, p: [0.5, 2.3, 6.4], l: [0.6, 1.3, -1.2], fov: 38 },
  { t: 245.6, p: [0.7, 1.65, 1.0], l: [2.8, 1.0, -1.6], fov: 40 },
  { t: 249.5, p: [1.0, 1.55, 0.7], l: [2.8, 1.0, -1.6], fov: 38 },
  // "segundo luces": 200 vs 1000 de fondo y el foco
  { t: 258.88, p: [0.3, 2.6, 8.0], l: [0.0, 1.4, -1.0], fov: 40 },
  { t: 262.5, p: [0.3, 2.45, 7.0], l: [0.2, 1.6, -0.8], fov: 38 },
  { t: 263.1, p: [-0.9, 1.55, 2.3], l: [0.5, 2.2, -0.6], fov: 44 },
  { t: 269.7, p: [-0.5, 1.6, 2.0], l: [0.5, 2.2, -0.6], fov: 42 },
  // "tercero internet": el router
  { t: 274.16, p: [-1.7, 2.15, -0.4], l: [-3.15, 1.85, -2.2], fov: 38 },
  { t: 283.1, p: [-2.0, 2.0, -0.8], l: [-3.15, 1.85, -2.2], fov: 34 },
  // 330 vs 520: la casa entera encendida
  { t: 287.62, p: [0.8, 2.6, 7.8], l: [0.0, 1.35, -1.0], fov: 40 },
  { t: 298.0, p: [0.2, 2.4, 6.6], l: [0.0, 1.35, -1.0], fov: 38 },
  // la factura: la cámara vuelve a la mesa (entra al CTA2 sin corte)
  { t: 302.46, p: [1.5, 1.95, 1.8], l: [0.3, 1.0, -1.2], fov: 40 },
  // CTA2 · "Esto está en la página 56": de la mesa al libro, las hojas pasan, las barras saltan de la página
  { t: C2 - 0.2, p: [0.95, 1.7, 0.1], l: [0.3, 0.99, -1.2], fov: 38 },
  { t: C2 + 1.6, p: [0.34, 1.62, -0.62], l: [0.31, 0.99, -1.25], fov: 34 },
  { t: C2 + 3.4, p: [0.36, 1.44, -0.55], l: [0.32, 1.02, -1.28], fov: 34 },
  // "Juntos te ahorran": la cámara baja de costado para ver las barras como edificios
  { t: C2 + 7.6, p: [0.62, 1.2, -0.72], l: [0.3, 1.05, -1.3], fov: 36 },
  { t: C2 + 12.6, p: [0.66, 1.22, -0.68], l: [0.3, 1.06, -1.3], fov: 37 },
  { t: C2 + 16.4, p: [0.9, 1.85, 0.2], l: [0.4, 1.05, -1.2], fov: 40 },
  { t: C2 + 20, p: [0.95, 1.9, 0.3], l: [0.4, 1.05, -1.2], fov: 40 },
  // "tercer día… volvió": la cuadra entera se vuelve a encender
  { t: 334.46, p: [13, 5.6, 13.2], l: [-4, 2.0, 3.0], fov: 44 },
  { t: 337.4, p: [9.5, 4.2, 12.0], l: [-3, 1.6, 2.0], fov: 42 },
  // "8 %": la batería, casi vacía, empieza a cargar
  { t: 337.9, p: [-0.9, 1.05, -0.2], l: [-1.75, 0.5, -1.55], fov: 32 },
  { t: 347.1, p: [-1.08, 0.95, -0.45], l: [-1.75, 0.5, -1.55], fov: 29 },
  // la fórmula: batería ÷ consumo = días
  { t: 370.6, p: [-0.3, 1.4, 0.6], l: [-1.7, 0.6, -1.6], fov: 36 },
  { t: 377.8, p: [-0.5, 1.3, 0.3], l: [-1.7, 0.6, -1.6], fov: 34 },
  // las tres cosas que nunca: cable finito, inversor prendido, batería de auto
  { t: 381.48, p: [-1.5, 1.3, -0.7], l: [-1.85, 0.95, -1.6], fov: 32 },
  { t: 384.4, p: [-1.6, 1.15, -0.95], l: [-1.88, 1.0, -1.7], fov: 28 },
  { t: 384.9, p: [-1.0, 1.62, -0.9], l: [-1.75, 1.52, -2.15], fov: 32 },
  { t: 389.0, p: [-1.2, 1.6, -1.15], l: [-1.75, 1.52, -2.15], fov: 29 },
  { t: 389.5, p: [0.3, 1.6, 1.3], l: [-1.4, 0.7, -1.6], fov: 38 },
  { t: 393.6, p: [0.1, 1.5, 0.9], l: [-1.4, 0.7, -1.6], fov: 36 },
  // la guía otra vez sobre la mesa + el link
  { t: 399.08, p: [0.95, 1.7, 0.1], l: [0.3, 0.99, -1.2], fov: 38 },
  { t: 405.4, p: [0.9, 1.95, 0.3], l: [0.4, 1.05, -1.2], fov: 40 },
];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  // sacudón de la explosión del transformador
  const sh = Math.exp(-Math.max(0, t - 6.42) * 3.2) * (t > 6.42 ? 1 : 0);
  if (sh > 0.01) { p.x += Math.sin(t * 61) * 0.09 * sh; p.y += Math.sin(t * 47 + 1) * 0.07 * sh; }
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.02, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: [number, number, number]) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.02; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- texturas de la guía (páginas REALES del PDF) ----------------
// páginas reales de la guía: el render ESPERA a que carguen (sin esto un chunk del farm puede salir con páginas negras)
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  const o = useMemo(() => {
    const L = new THREE.TextureLoader();
    const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas guia");
    let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (t) => { flip.image = t.image; flip.needsUpdate = true; if (--n === 0) { bump((x) => x + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip; // _r = caras que quedan dadas vuelta al abrir
    }
    return r;
  }, [ids.join("|")]);
  return o;
};

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: [number, number, number]; s: [number, number, number]; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: [number, number, number] }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.025, rot }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
const Glow: React.FC<{ p: [number, number, number]; s: [number, number]; col: string; o: number; rot?: [number, number, number] }> = ({ p, s, col, o, rot }) => (
  <mesh position={p} rotation={rot}><planeGeometry args={s} /><meshBasicMaterial color={new THREE.Color("#1a2130").lerp(new THREE.Color(col), o)} toneMapped={false} /></mesh>
);

// casa de block de un piso, techo plano con pretil y tinaco; ventanas que se apagan
const House: React.FC<{ x: number; z: number; flip?: boolean; lit: number; tint: string; i: number; block?: Tx }> = ({ x, z, flip, lit, tint, i, block }) => {
  const warm = ["#ffb85c", "#ffd08a", "#ffe6b0"][i % 3];
  const tall = i % 3 === 1;            // algunas con segundo piso a medio hacer (block a la vista)
  const h = 3.2;
  return (
    <group position={[x, 0, z]} rotation={[0, flip ? Math.PI : 0, 0]}>
      <Box p={[0, h / 2, 0]} s={[7.4, h, 5]} c={tint} r={0.95} map={block} rad={0.03} />
      {/* zócalo y franja de pintura */}
      <Box p={[0, 0.35, 2.52]} s={[7.42, 0.7, 0.04]} c={["#7a4b3a", "#3f5d6e", "#5d6b3f"][i % 3]} r={0.8} rad={0.005} />
      <Box p={[0, h + 0.12, 0]} s={[7.6, 0.24, 5.2]} c="#5f5c57" r={1} />
      <Box p={[0, h + 0.42, 2.52]} s={[7.6, 0.4, 0.15]} c={tint} r={1} map={block} />
      {tall && <>
        <Box p={[-1.6, h + 1.4, -0.6]} s={[4.0, 2.4, 3.6]} c="#9a9a96" r={1} map={block} rad={0.02} />
        {[-3.5, 0.3].map((rx) => <mesh key={rx} position={[rx, h + 2.9, 1.1]}><cylinderGeometry args={[0.025, 0.025, 0.9, 5]} /><meshStandardMaterial color="#5a3b28" metalness={0.5} roughness={0.6} /></mesh>)}
      </>}
      {/* hierros de columna que asoman del techo (casa que sigue creciendo) */}
      {[-3.4, 3.4].map((rx) => [0, 1, 2, 3].map((k) => <mesh key={rx + "_" + k} position={[rx + (k % 2) * 0.12, h + 0.75, 2.2 + Math.floor(k / 2) * 0.12]}><cylinderGeometry args={[0.014, 0.014, 0.9, 4]} /><meshStandardMaterial color="#6a4330" metalness={0.4} roughness={0.7} /></mesh>))}
      {/* tinaco */}
      <mesh position={[2.3 - (i % 2) * 4, h + 0.8, -1.2]} castShadow><cylinderGeometry args={[0.55, 0.6, 1.1, 20]} /><meshStandardMaterial color={i % 2 ? "#2d4f7a" : "#1d1f22"} roughness={0.6} /></mesh>
      {/* puerta y ventanas con cortina iluminada y reja */}
      <Box p={[-0.6, 1.05, 2.53]} s={[1.0, 2.1, 0.08]} c={["#5b3b26", "#2f4a5a", "#6b2a24"][i % 3]} r={0.7} />
      {[-2.6, 2.1].map((wx, k) => (
        <group key={k} position={[wx, 1.7, 2.52]}>
          <Box p={[0, 0, -0.01]} s={[1.6, 1.3, 0.05]} c="#d9d2c4" r={0.9} rad={0.01} />
          <Glow p={[0, 0, 0.02]} s={[1.4, 1.1]} col={warm} o={lit * (0.8 + 0.2 * rnd(i, k))} />
          {/* cortina: pliegues oscuros encima del vidrio */}
          {Array.from({ length: 6 }, (_, q) => <mesh key={q} position={[-0.6 + q * 0.24, 0, 0.03]}><planeGeometry args={[0.08, 1.1]} /><meshBasicMaterial color="#000" transparent opacity={0.18 + 0.12 * lit} /></mesh>)}
          {[-0.45, 0, 0.45].map((bx) => <mesh key={bx} position={[bx, 0, 0.06]}><boxGeometry args={[0.03, 1.1, 0.03]} /><meshStandardMaterial color="#1b1b1b" metalness={0.6} roughness={0.5} /></mesh>)}
          {lit > 0.05 && <pointLight position={[0, 0, 1.2]} intensity={lit * 2.6} distance={6} color={warm} />}
        </group>
      ))}
    </group>
  );
};

// chispas deterministas de la explosión (con gravedad) + humo
const Sparks: React.FC<{ t: number; at: number; p: [number, number, number]; glow?: THREE.Texture }> = ({ t, at, p, glow }) => {
  const dt = t - at;
  if (dt < 0 || dt > 3.2) return null;
  return (
    <group position={p}>
      {Array.from({ length: 90 }, (_, i) => {
        const a = rnd(i, 1) * Math.PI * 2, el = rnd(i, 2) * 1.2 - 0.2, v = 2 + rnd(i, 3) * 5.5;
        const life = 0.5 + rnd(i, 4) * 1.6; if (dt > life) return null;
        const x = Math.cos(a) * Math.cos(el) * v * dt, z = Math.sin(a) * Math.cos(el) * v * dt, y = Math.sin(el) * v * dt - 4.9 * dt * dt;
        const k = 1 - dt / life;
        return <mesh key={i} position={[x, y, z]}><sphereGeometry args={[0.025 + 0.03 * k, 6, 4]} /><meshBasicMaterial color={new THREE.Color("#ff7a1a").lerp(new THREE.Color("#fff6c0"), k)} toneMapped={false} /></mesh>;
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const k = cl((dt - 0.1) / 3), s = 0.18 + k * (0.7 + 0.6 * rnd(i, 5));
        return <mesh key={"s" + i} position={[(rnd(i, 6) - 0.5) * 1.4 + k * 1.2, 0.2 + k * (1.5 + rnd(i, 7) * 2), (rnd(i, 8) - 0.5) * 1.2]}><sphereGeometry args={[s, 10, 8]} />
          <meshBasicMaterial color="#121214" transparent opacity={0.45 * (1 - k)} depthWrite={false} /></mesh>;
      })}
      <pointLight intensity={260 * Math.exp(-dt * 6)} distance={30} color="#ffb060" />
      {glow && <sprite scale={[3 + 6 * cl(dt * 5), 3 + 6 * cl(dt * 5), 1]}><spriteMaterial map={glow} color="#ffe2a0" transparent opacity={0.55 * Math.max(0, 1 - dt * 3)} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>}
    </group>
  );
};

// cable de la batería a un aparato, con pulso de luz que viaja
const Cable: React.FC<{ a: [number, number, number]; b: [number, number, number]; on: number; t: number; sag?: number; col?: string }> = ({ a, b, on, t, sag = 0.5, col = "#ffc04d" }) => {
  const curve = useMemo(() => {
    const A = v3(a), B = v3(b), M = A.clone().lerp(B, 0.5); M.y = Math.min(A.y, B.y) - sag;
    return new THREE.CatmullRomCurve3([A, A.clone().lerp(M, 0.5).setY(A.y - sag * 0.5), M, M.clone().lerp(B, 0.5).setY(B.y - sag * 0.4), B]);
  }, [a.join(), b.join(), sag]);
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 48, 0.018, 8, false), [curve]);
  const pulses = on > 0.02 ? [0, 0.33, 0.66].map((o) => curve.getPoint(((t * 0.7 + o) % 1))) : [];
  return (
    <group>
      <mesh geometry={geo} castShadow><meshStandardMaterial color="#141414" emissive={col} emissiveIntensity={on * 0.9} roughness={0.5} toneMapped={false} /></mesh>
      {pulses.map((q, i) => <mesh key={i} position={q}><sphereGeometry args={[0.045, 10, 8]} /><meshBasicMaterial color="#fff4cf" toneMapped={false} transparent opacity={on} /></mesh>)}
    </group>
  );
};

// cable del borne + de la batería al inversor (coordenadas locales del grupo de la batería)
const BatCable: React.FC<{ heat: number; thick: boolean; t: number }> = ({ heat, thick, t }) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3([v3([-0.22, 0.84, 0.06]), v3([-0.3, 1.0, 0.02]), v3([-0.3, 1.25, -0.35]), v3([-0.16, 1.42, -0.53])]), []);
  const r = thick ? 0.016 : 0.006;
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 40, r, 8, false), [curve, r]);
  const hot = new THREE.Color("#2a0a06").lerp(new THREE.Color("#ff3b12"), heat);
  const fp = curve.getPoint(0.45);
  return (
    <group>
      <mesh geometry={geo} castShadow><meshStandardMaterial color={thick ? "#b3201a" : "#5a1410"} emissive={hot} emissiveIntensity={heat * (1.6 + 0.4 * Math.sin(t * 13))} roughness={0.5} toneMapped={false} /></mesh>
      {heat > 0.3 && <pointLight position={[-0.25, 0.95, 0.1]} intensity={heat * 1.4} distance={1.2} color="#ff5a1f" />}
      {thick && <group position={fp}><Box p={[0, 0, 0]} s={[0.07, 0.11, 0.05]} c="#c9302c" r={0.5} rad={0.008} /><Box p={[0, 0, 0.026]} s={[0.04, 0.03, 0.004]} c="#f2f2f2" r={0.6} /></group>}
    </group>
  );
};

const PAPER = "#a39e95"; // el papel blanco bajo la lámpara se quemaba: multiplicador más bajo
// hoja que se da vuelta con curva (la "panza" de la página al pasar)
const Leaf: React.FC<{ ang: number; w: number; d: number; front?: THREE.Texture; back?: THREE.Texture; y: number }> = ({ ang, w, d, front, back, y }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(w, d, 28, 1), [w, d]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const N = 28, curl = Math.sin(ang) * 1.6;
  let x = 0, yy = 0; const xs: number[] = [], ys: number[] = [];
  for (let k = 0; k <= N; k++) { xs.push(x); ys.push(yy); const s = k / N; const phi = ang + curl * s * (1 - s * 0.4); x += Math.cos(phi) * w / N; yy += Math.sin(phi) * w / N; }
  for (let i = 0; i < pos.count; i++) {
    const k = i % (N + 1), row = Math.floor(i / (N + 1));
    pos.setXYZ(i, xs[k], ys[k], row === 0 ? -d / 2 : d / 2);
  }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return (
    <group position={[0, y, 0]}>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.FrontSide} color={PAPER} roughness={0.92} map={back} envMapIntensity={0.2} /></mesh>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.BackSide} color={PAPER} roughness={0.92} map={front} envMapIntensity={0.2} /></mesh>
    </group>
  );
};

// LA GUÍA: libro de tapa dura sobre la mesa; open 0..1 abre la tapa; leaves = hojas que pasan
export const Book: React.FC<{ p: [number, number, number]; rotY?: number; open: number; cover: THREE.Texture; inside: THREE.Texture; right: THREE.Texture; spine: string; flip?: number; flipTex?: [THREE.Texture, THREE.Texture]; lift?: number; flips?: { k: number; tex: [THREE.Texture, THREE.Texture] }[]; children?: React.ReactNode }> = ({ p, rotY = 0, open, cover, inside, right, spine, flip = 0, flipTex, lift = 0, flips = [], children }) => {
  const w = 0.30, d = 0.45, th = 0.038;
  const ang = Math.PI * ease(open);
  return (
    <group position={[p[0], p[1] + lift, p[2]]} rotation={[0, rotY, 0]}>
      {/* contratapa + bloque de páginas */}
      <Box p={[0, 0.003, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.55} rad={0.003} />
      <mesh position={[0.004, 0.006 + th / 2, 0]} castShadow receiveShadow><boxGeometry args={[w - 0.004, th, d - 0.006]} /><meshStandardMaterial color="#b9b2a2" roughness={0.95} /></mesh>
      {/* cantos de páginas (rayado) */}
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[w / 2 + 0.0025, 0.009 + i * (th / 9), 0]}><boxGeometry args={[0.001, 0.0012, d - 0.01]} /><meshBasicMaterial color="#cbbfa6" /></mesh>)}
      {/* página derecha (la que queda arriba al abrir) */}
      <mesh position={[0.004, 0.0065 + th, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w - 0.01, d - 0.012]} /><meshStandardMaterial map={right} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
      {/* lomo */}
      <Box p={[-w / 2 - 0.004, 0.006 + th / 2, 0]} s={[0.012, th + 0.014, d + 0.012]} c={spine} r={0.5} rad={0.005} />
      {/* hoja que pasa (desde la derecha a la izquierda) */}
      {flip > 0.001 && flip < 0.999 && flipTex && <group position={[-w / 2 + 0.006, 0.007 + th, 0]}><Leaf ang={Math.PI * ease(flip)} w={w - 0.012} d={d - 0.014} front={flipTex[0]} back={flipTex[1]} y={0.001} /></group>}
      {flips.filter((f) => f.k > 0.001 && f.k < 0.999).map((f, i) => <group key={i} position={[-w / 2 + 0.006, 0.007 + th + i * 0.0008, 0]}><Leaf ang={Math.PI * ease(f.k)} w={w - 0.012} d={d - 0.014} front={f.tex[0]} back={f.tex[1]} y={0.001} /></group>)}
      {/* lo que salta de la página derecha (coordenadas de página: x a lo ancho, z de arriba a abajo) */}
      <group position={[0.004, 0.0065 + th, 0]}>{children}</group>
      {/* tapa con bisagra en el lomo */}
      <group position={[-w / 2, 0.006 + th + 0.004, 0]} rotation={[0, 0, ang]}>
        <group position={[w / 2 + 0.006, 0, 0]}>
          <Box p={[0, 0, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.45} rad={0.003} />
          <mesh position={[0, 0.0032, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w + 0.008, d + 0.008]} /><meshStandardMaterial map={cover} roughness={0.38} metalness={0.05} /></mesh>
          <mesh position={[0, -0.0032, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[w - 0.006, d - 0.01]} /><meshStandardMaterial map={inside} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
        </group>
      </group>
    </group>
  );
};


// cielo: domo con degradé, estrellas y luna con halo; cerros oscuros en el horizonte
const Sky: React.FC<{ dawn: number; flake: THREE.Texture }> = ({ dawn, flake }) => {
  const tex = useMemo(() => {
    const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 512; const g = cv.getContext("2d")!;
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#03060d"); gr.addColorStop(0.45, "#0b1528"); gr.addColorStop(0.5, "#1c2a44"); gr.addColorStop(1, "#0a0f18");
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 900; i++) { const y = rnd(i, 2) * 240; g.fillStyle = `rgba(255,255,255,${0.15 + 0.75 * rnd(i, 3) * (1 - y / 260)})`; const r = rnd(i, 4) < 0.92 ? 0.6 : 1.3; g.beginPath(); g.arc(rnd(i, 1) * 1024, y, r, 0, 6.3); g.fill(); }
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, []);
  return (
    <group>
      <mesh><sphereGeometry args={[180, 48, 24]} /><meshBasicMaterial map={tex} side={THREE.BackSide} fog={false} transparent opacity={1 - dawn} depthWrite={false} toneMapped={false} /></mesh>
      <group position={[-60, 55, -120]}>
        <mesh><circleGeometry args={[4.2, 40]} /><meshBasicMaterial color="#f3f0e2" fog={false} toneMapped={false} /></mesh>
        <sprite scale={[46, 46, 1]}><spriteMaterial map={flake} color="#9fb8ff" transparent opacity={0.45 * (1 - dawn)} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} /></sprite>
      </group>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-120 + i * 30, -2, -95 - rnd(i, 5) * 20]} scale={[26 + rnd(i, 6) * 20, 10 + rnd(i, 7) * 14, 10]}><sphereGeometry args={[1, 16, 8]} /><meshBasicMaterial color={new THREE.Color("#070a10").lerp(new THREE.Color("#5d6f86"), dawn)} fog={false} /></mesh>)}
    </group>
  );
};

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures();
  const pg = useImgTex(["p001", "p022", "p023", "bonus2", "p055", "p056"]);
  const batLabel = useMemo(() => {
    const cv = document.createElement("canvas"); cv.width = 512; cv.height = 340; const g = cv.getContext("2d")!;
    g.fillStyle = "#16191d"; g.fillRect(0, 0, 512, 340); g.fillStyle = "#38d96f"; g.fillRect(0, 0, 512, 16);
    g.fillStyle = "#f2f2f2"; g.font = "900 92px Arial"; g.fillText("LiFePO4", 34, 128);
    g.font = "800 64px Arial"; g.fillStyle = "#38d96f"; g.fillText("12 V · 100 Ah", 34, 214);
    g.font = "700 40px Arial"; g.fillStyle = "#9aa3ad"; g.fillText("1280 Wh", 34, 290);
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  }, []);
  // amanecer al final de la guía ("el segundo día")
  // día 2 de día; "3 de la mañana" (155-186) de noche; de nuevo de día desde 187 (los cambios quedan tapados por el avatar)
  const dawn = t < 150 ? win(t, C1 + 27.0, C1 + 29.6) : t < 186 ? 1 - win(t, 154.6, 155.7) : t < 330 ? win(t, 185.2, 187.6) : 1 - win(t, 330.0, 333.5); // día 3: vuelve la luz a las 8 de la noche
  const skyN = new THREE.Color("#070b14"), skyD = new THREE.Color("#8fa6c6");
  const sky = skyN.clone().lerp(skyD, dawn * 0.75);
  // la cuadra encendida hasta que explota el transformador (6,40 "explotó"): dominó desde la esquina
  const BOOM = 6.42;
  const litAt = (x: number) => t > 334 ? win(t, 336.15 + Math.abs(x - POLE[0]) * 0.035, 336.4 + Math.abs(x - POLE[0]) * 0.035) : t > 26 ? 0 : 1 - win(t, BOOM + 0.12 + Math.abs(x - POLE[0]) * 0.035, BOOM + 0.3 + Math.abs(x - POLE[0]) * 0.035);
  // la casa de Claudio: encendida con batería desde "Tres días después"
  const mine = t > 27.0 ? 1 : 0;
  // orden de encendido (J): refrigerador, luces, internet, ventilador
  const ordR = t > 239 && t < 300; // el orden otra vez en el resto: refrigerador, luces, internet, ventilador
  const ord = (ordR ? [245.3, 262.7, 269.9, 278.4] : [48.24, 49.26, 50.2, 51.0]).map((a) => (!ordR && t > 54.3 ? 1 : win(t, a, a + 0.35)));
  const allOn = t < 47 || (t > 99 && !ordR);
  const night3 = t > 155 && t < 186 ? 1 : 0; // 3 de la mañana: la casa a oscuras, sólo la lámpara de trabajo
  const onFr = allOn ? mine : ord[0], onBulb = allOn ? mine * (1 - night3) : ord[1], onRt = allOn ? mine * (1 - night3) : ord[2], onFan = allOn ? mine * 0.6 : ord[3];
  const lampOn = t > 27 ? 1 : litAt(0);
  const streetOn = (x: number) => (t < 26 ? litAt(x) : t > 334 ? litAt(x) : 0);
  // la carga de la batería (rayitas): 59 % → 41 % el día 2, 8 % al llegar la luz, después carga
  const soc = t < 105.2 ? 0.8 : t < 109.5 ? 0.59 : t < 143 ? 0.41 : t < 186 ? 0.41 - 0.12 * win(t, 143, 144) : t < 330 ? 0.6 : t < 338.6 ? 0.6 - 0.52 * win(t, 333, 338.2) : 0.08 + 0.72 * win(t, 339.5, 346);
  const nBars = t < 99 ? 4 : soc > 0.7 ? 4 : soc > 0.5 ? 3 : soc > 0.3 ? 2 : 1;
  const barCol = nBars === 1 ? (Math.sin(t * 9) > 0 ? "#ff4a3d" : "#4a1410") : "#38ff7a";
  // el inversor prendido gasta solo: brillo ámbar (día 2 y "nunca" nº 2)
  const invGlow = win(t, 132.2, 132.7) * (1 - win(t, 150.5, 151.2)) + win(t, 384.8, 385.3) * (1 - win(t, 389.3, 389.8));
  // el cable finito se pone al rojo (161-186 y "nunca" nº 1); desde "6 milímetros" queda el cable grueso con fusible
  const heat = win(t, 162.8, 165.6) * (1 - win(t, 185.5, 186)) + win(t, 382.0, 382.8) * (1 - win(t, 384.5, 385));
  const thick = t > 186 && !(t > 381.4 && t < 384.8);
  const fridgeKick = t > 158.2 && t < 161.6 ? Math.sin(t * 70) * 0.004 * (1 - win(t, 160.6, 161.6)) : 0;
  // la guía: se abre con "Mira" y la página 23
  const open = win(t, C1 + 7.0, C1 + 8.0);
  const inC2 = t >= C2 - 1;
  const fl = (a: number) => cl((t - a) / 0.55);
  const BW = 0.29, BD = 0.438, uv = (u: number, v: number): [number, number] => [(u - 0.5) * BW, (v - 0.5) * BD];
  const bars = [
    { u: 0.223, v: 0.407, w: 0.107, h: 4.5, at: C2 + 4.6, col: "#bfe0ff" },
    { u: 0.395, v: 0.407, w: 0.107, h: 10, at: C2 + 5.64, col: "#ffe1cc" },
    { u: 0.567, v: 0.407, w: 0.107, h: 9, at: C2 + 6.7, col: "#e9e0ff" },
    { u: 0.785, v: 0.407, w: 0.146, h: 23.5, at: C2 + 8.32, col: "#ffd60a" },
  ];
  const book2 = ei2(t, C1 + 17.0, C1 + 18.4);
  const fanAng = t * 8 * onFan;

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={(t > C1 - 1 ? 0.45 : 0.85) - dawn * 0.2} threshold={(t > C1 - 1 ? 0.95 : 0.8) + dawn * 0.3} exposure={0.95 + 0.25 * dawn} env={0.1 + 0.2 * dawn} />
      <color attach="background" args={[sky.getHex()]} />
      <fogExp2 attach="fog" args={[sky.getHex(), 0.022 - dawn * 0.014]} />
      <hemisphereLight args={[new THREE.Color("#5f7cb8").lerp(new THREE.Color("#ffd3b0"), dawn).getHex(), 0x1b1d24, 0.7 + dawn * 0.5]} />
      <Sky dawn={dawn} flake={tx.flake} />
      <directionalLight position={[-14, 22, 16]} intensity={1.05 + dawn * 1.2} color={new THREE.Color("#9fb8ff").lerp(new THREE.Color("#ffc995"), dawn)} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-bias={-0.0004} />

      {/* piso, vereda, calle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[240, 240]} /><meshStandardMaterial color="#3b3a37" roughness={1} map={tx.concrete} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 7.6]} receiveShadow><planeGeometry args={[240, 5.6]} /><meshStandardMaterial color="#26282b" roughness={0.92} /></mesh>
      {Array.from({ length: 34 }, (_, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-70 + i * 4.2, 0.02, 7.6]}><planeGeometry args={[1.8, 0.12]} /><meshBasicMaterial color="#b9a660" transparent opacity={0.4} /></mesh>)}
      <Box p={[0, 0.07, 3.85]} s={[200, 0.14, 1.9]} c="#8a867e" r={1} rad={0.02} />
      <Box p={[0, 0.07, 11.35]} s={[200, 0.14, 1.9]} c="#8a867e" r={1} rad={0.02} />

      {/* cuadra de enfrente y vecinos */}
      {[-27, -18, -9, 9, 18, 27].map((x, i) => <House key={"a" + x} x={x} z={0} lit={litAt(x)} tint={["#d8cfbf", "#c9b9a1", "#b8c4c0", "#d9c3a5", "#c7c0b3", "#cfd2c6"][i]} i={i} block={tx.block} />)}
      {[-22.5, -13.5, -4.5, 4.5, 13.5, 22.5].map((x, i) => <House key={"b" + x} x={x} z={15.2} flip lit={litAt(x)} tint={["#cdbfae", "#bcc8c4", "#d6c8b0", "#c3b8a6", "#d2cdbd", "#bfb5a5"][i]} i={i + 7} block={tx.block} />)}

      {/* poste, transformador y cables */}
      <group position={POLE}>
        <mesh position={[0, 3.7, 0]} castShadow><cylinderGeometry args={[0.13, 0.17, 7.4, 12]} /><meshStandardMaterial color="#8e8a82" roughness={0.9} /></mesh>
        <Box p={[0, 7.1, 0]} s={[2.4, 0.14, 0.14]} c="#5a4632" r={0.9} />
        <group position={[0.35, 6.2, 0.1]}>
          <mesh castShadow><cylinderGeometry args={[0.34, 0.34, 0.95, 18]} /><meshStandardMaterial color="#6f7377" metalness={0.5} roughness={0.45} emissive="#ff6a1a" emissiveIntensity={t > BOOM && t < 30 ? 0.08 * Math.exp(-(t - BOOM) * 0.8) : 0} /></mesh>
          {[-0.18, 0, 0.18].map((b) => <mesh key={b} position={[b, 0.6, 0]}><cylinderGeometry args={[0.04, 0.05, 0.28, 8]} /><meshStandardMaterial color="#c9c0a8" /></mesh>)}
        </group>
      </group>
      {[-1, 0, 1].map((k) => <mesh key={k} position={[0, 7.15, POLE[2] + k * 0.9]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 200, 4]} /><meshStandardMaterial color="#111" /></mesh>)}
      <Sparks t={t} at={BOOM} p={PT.trafo} glow={tx.flake} />
      {/* faroles de la calle */}
      {[-24, -14, 7.5, 16, 25].map((x) => {
        const o = streetOn(x);
        return <group key={x} position={[x, 0, 4.2]}>
          <mesh position={[0, 3.2, 0]}><cylinderGeometry args={[0.07, 0.09, 6.4, 8]} /><meshStandardMaterial color="#6b6b6b" /></mesh>
          <mesh position={[0, 6.35, 0.5]}><boxGeometry args={[0.5, 0.12, 0.26]} /><meshBasicMaterial color={new THREE.Color("#222").lerp(new THREE.Color("#ffdca0"), o)} toneMapped={false} /></mesh>
          {o > 0.05 && <spotLight position={[0, 6.2, 0.5]} angle={0.9} penumbra={0.8} intensity={o * 60} distance={14} color="#ffcf8a" target-position={[x, 0, 6]} />}
        </group>;
      })}

      {/* ===== LA CASA DE CLAUDIO (frente abierto en z=2.5) ===== */}
      <group>
        <Box p={[0, 1.6, -2.45]} s={[7.4, 3.2, 0.2]} c="#cfc6b6" r={0.95} map={tx.block} />
        <Box p={[-3.62, 1.6, 0]} s={[0.2, 3.2, 5]} c="#cfc6b6" r={0.95} map={tx.block} />
        <Box p={[3.62, 1.6, 0]} s={[0.2, 3.2, 5]} c="#cfc6b6" r={0.95} map={tx.block} />
        <Box p={[0, 3.32, 0]} s={[7.6, 0.24, 5.2]} c="#b9b3a8" r={1} />
        <mesh position={[2.3, 4.0, -1.2]} castShadow><cylinderGeometry args={[0.55, 0.55, 1.1, 20]} /><meshStandardMaterial color="#1d1f22" roughness={0.6} /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow><planeGeometry args={[7.2, 4.8]} /><meshStandardMaterial color="#7d7a74" map={tx.concrete} roughness={0.9} /></mesh>
        {/* tablero perforado con herramientas */}
        <Box p={[-0.2, 1.9, -2.33]} s={[2.6, 1.1, 0.03]} c="#b48a5a" r={0.9} />
        {Array.from({ length: 9 }, (_, i) => <Box key={i} p={[-1.3 + i * 0.27, 1.85 + (i % 2) * 0.12, -2.3]} s={[0.04, 0.42 + rnd(i, 3) * 0.2, 0.03]} c={["#c9302c", "#2a2a2a", "#d4a017", "#3a6ea5"][i % 4]} r={0.5} m={0.4} />)}
        {/* mesa de trabajo */}
        <Box p={[0.2, 0.93, -1.25]} s={[2.9, 0.07, 0.85]} c="#8b5e3c" r={0.75} map={tx.planks} rad={0.01} />
        {[[-1.15, -0.9], [1.55, -0.9], [-1.15, -1.6], [1.55, -1.6]].map(([x, z], i) => <Box key={i} p={[x, 0.46, z]} s={[0.08, 0.9, 0.08]} c="#5f3f27" />)}
        {/* lámpara de trabajo (a batería) */}
        <group position={[-0.75, 0.97, -1.55]}>
          <Box p={[0, 0.02, 0]} s={[0.18, 0.04, 0.18]} c="#222" m={0.5} r={0.4} />
          <mesh position={[0.08, 0.3, 0.05]} rotation={[0, 0, -0.35]}><cylinderGeometry args={[0.012, 0.012, 0.6, 6]} /><meshStandardMaterial color="#333" metalness={0.6} /></mesh>
          <mesh position={[0.22, 0.56, 0.12]} rotation={[0.5, 0, -0.9]}><coneGeometry args={[0.1, 0.16, 18, 1, true]} /><meshStandardMaterial color="#2b3a2b" side={THREE.DoubleSide} metalness={0.4} roughness={0.5} /></mesh>
          <mesh position={[0.25, 0.52, 0.16]}><sphereGeometry args={[0.035, 10, 8]} /><meshBasicMaterial color={new THREE.Color("#333").lerp(new THREE.Color("#fff1cf"), lampOn)} toneMapped={false} /></mesh>
          {lampOn > 0.05 && <spotLight position={[0.25, 0.52, 0.16]} angle={0.85} penumbra={0.7} intensity={lampOn * (t > C1 - 1 ? 2.6 : 6)} distance={4} color="#ffe2b0" castShadow target-position={[0.3, 0.95, -1.15]} />}
        </group>
        {/* farol de camping */}
        <group position={[1.25, 0.97, -1.45]}>
          <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.07, 0.08, 0.24, 14]} /><meshStandardMaterial color="#fff3d6" emissive="#ffcf7a" emissiveIntensity={1.6 * mine} toneMapped={false} /></mesh>
          <Box p={[0, 0.27, 0]} s={[0.16, 0.05, 0.16]} c="#2e5a3a" r={0.5} />
          {mine > 0 && <pointLight position={[0, 0.2, 0.05]} intensity={2.2} distance={3.5} color="#ffcf8a" />}
        </group>
        {/* LA BATERÍA (piso del garaje): LiFePO4 con placa, manija, bornes con cables y barra de carga */}
        <group position={[-1.75, 0, -1.55]}>
          <Box p={[0, 0.34, 0]} s={[0.62, 0.68, 0.36]} c="#8e959c" r={0.45} m={0.25} rad={0.035} />
          <Box p={[0, 0.71, 0]} s={[0.64, 0.07, 0.38]} c="#1e2125" r={0.5} rad={0.02} />
          <mesh position={[0, 0.79, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.07, 0.014, 8, 20, Math.PI]} /><meshStandardMaterial color="#111" roughness={0.4} /></mesh>
          <mesh position={[0, 0.42, 0.182]}><planeGeometry args={[0.46, 0.3]} /><meshStandardMaterial map={batLabel} roughness={0.5} /></mesh>
          {[[-0.22, "#c62828"], [0.22, "#222"]].map(([x, col]) => <group key={String(x)} position={[x as number, 0.77, 0.06]}>
            <mesh><cylinderGeometry args={[0.028, 0.032, 0.06, 12]} /><meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.3} /></mesh>
            <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.045, 0.045, 0.05, 12]} /><meshStandardMaterial color={col as string} roughness={0.5} /></mesh>
          </group>)}
          {[0, 1, 2, 3, 4].map((k) => <mesh key={k} position={[-0.12 + k * 0.06, 0.62, 0.182]}><planeGeometry args={[0.045, 0.018]} /><meshBasicMaterial color={mine ? (k < nBars ? barCol : "#1d4a2a") : "#1d4a2a"} toneMapped={false} /></mesh>)}
          {/* inversor en la pared */}
          <Box p={[0, 1.55, -0.6]} s={[0.5, 0.3, 0.14]} c="#2b2f35" r={0.5} m={0.3} />
          {invGlow > 0.01 && <><mesh position={[0, 1.55, -0.527]}><planeGeometry args={[0.46, 0.26]} /><meshBasicMaterial color="#ffb257" transparent opacity={0.22 * invGlow * (0.75 + 0.25 * Math.sin(t * 6))} toneMapped={false} /></mesh>
            <pointLight position={[0, 1.55, -0.3]} intensity={1.6 * invGlow} distance={1.6} color="#ffb257" /></>}
          {/* cable batería → inversor: finito (se pone al rojo) o grueso de 6 mm con fusible de 125 A */}
          {t > 99 && <BatCable heat={heat} thick={thick} t={t} />}
          {Array.from({ length: 7 }, (_, k) => <mesh key={k} position={[-0.18 + k * 0.06, 1.55, -0.528]}><planeGeometry args={[0.02, 0.2]} /><meshStandardMaterial color="#14171b" /></mesh>)}
          <mesh position={[0.2, 1.66, -0.528]}><circleGeometry args={[0.014, 10]} /><meshBasicMaterial color={mine ? "#38ff7a" : "#333"} toneMapped={false} /></mesh>
        </group>
        {/* cocina: refrigerador, foco, router, ventilador */}
        <group position={[2.95 + fridgeKick, 0, -1.75]}>
          <Box p={[0, 0.9, 0]} s={[0.8, 1.8, 0.7]} c="#e9ecee" r={0.35} m={0.1} rad={0.04} />
          <mesh position={[0.32, 1.25, 0.36]}><boxGeometry args={[0.03, 0.4, 0.03]} /><meshStandardMaterial color="#999" metalness={0.7} /></mesh>
          <mesh position={[-0.2, 1.5, 0.356]}><planeGeometry args={[0.1, 0.04]} /><meshBasicMaterial color={onFr > 0.5 ? "#7fd6ff" : "#223"} toneMapped={false} /></mesh>
        </group>
        <mesh position={PT.bulb}><sphereGeometry args={[0.07, 14, 10]} /><meshBasicMaterial color={new THREE.Color("#2a2a2a").lerp(new THREE.Color("#fff3d0"), onBulb)} toneMapped={false} /></mesh>
        <mesh position={[PT.bulb[0], 3.0, PT.bulb[2]]}><cylinderGeometry args={[0.006, 0.006, 0.4, 4]} /><meshStandardMaterial color="#111" /></mesh>
        {onBulb > 0.05 && <pointLight position={PT.bulb} intensity={onBulb * 6} distance={7} color="#ffd9a0" castShadow />}
        <group position={PT.router}>
          <Box p={[0, 0, 0]} s={[0.3, 0.06, 0.2]} c="#1c1c1e" r={0.4} />
          {[-0.08, 0.08].map((x) => <mesh key={x} position={[x, 0.12, -0.06]}><cylinderGeometry args={[0.008, 0.008, 0.2, 6]} /><meshStandardMaterial color="#111" /></mesh>)}
          {[0, 1, 2].map((k) => <mesh key={k} position={[-0.08 + k * 0.06, 0.0, 0.101]}><circleGeometry args={[0.01, 8]} /><meshBasicMaterial color={onRt > 0.5 && Math.sin(t * 9 + k) > -0.6 ? "#38ff7a" : "#173"} toneMapped={false} /></mesh>)}
        </group>
        <group position={[3.0, 0, 0.9]}>
          <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.02, 0.02, 1.2, 6]} /><meshStandardMaterial color="#ddd" /></mesh>
          <group position={[0, 1.25, 0]} rotation={[0, -0.6, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.26, 0.012, 6, 30]} /><meshStandardMaterial color="#ddd" /></mesh>
            <group rotation={[0, 0, fanAng]}>{[0, 1, 2].map((k) => <mesh key={k} rotation={[0, 0, (k * Math.PI * 2) / 3]} position={[0, 0, 0.01]}><boxGeometry args={[0.07, 0.42, 0.01]} /><meshStandardMaterial color="#7cb7e8" transparent opacity={0.85} /></mesh>)}</group>
          </group>
        </group>
        {/* cables de la batería a cada aparato (se encienden en orden) */}
        {((t > 46 && t < C1 - 0.5) || ordR) && <>
          <Cable a={[-1.6, 0.72, -1.5]} b={[2.6, 1.2, -1.45]} on={onFr} t={t} sag={0.55} />
          <Cable a={[-1.7, 0.72, -1.5]} b={[PT.bulb[0], 2.95, PT.bulb[2]]} on={onBulb} t={t} sag={-0.6} />
          <Cable a={[-1.8, 0.72, -1.55]} b={[PT.router[0] + 0.1, PT.router[1] - 0.03, PT.router[2] + 0.05]} on={onRt} t={t} sag={0.2} />
          <Cable a={[-1.6, 0.72, -1.4]} b={[3.0, 0.1, 0.9]} on={onFan} t={t} sag={0.6} />
        </>}
        {/* interior cálido de la casa (a batería) */}
        {mine > 0 && <>
          <pointLight position={[0, 2.4, 1.2]} intensity={7 * (1 - 0.8 * night3)} distance={9} color="#ffcf8a" />
          <spotLight position={[0, 2.8, 1.5]} angle={1.0} penumbra={0.9} intensity={40 * (1 - 0.85 * night3)} distance={14} color="#ffc677" target-position={[0, 0, 6]} />
        </>}

        {/* LA GUÍA sobre la mesa + el Plan Apagón que se desliza */}
        <Book p={PT.book} rotY={0.06} open={open} cover={pg.p001} inside={inC2 && t > C2 + 1.2 ? pg.p055_r : pg.p022_r} right={inC2 && t > C2 + 0.9 ? pg.p056 : pg.p023} spine="#c9a915"
          flips={inC2 ? [{ k: fl(C2 + 0.25), tex: [pg.p023, pg.p022] }, { k: fl(C2 + 0.5), tex: [pg.p056, pg.p055] }, { k: fl(C2 + 0.75), tex: [pg.p056, pg.p055] }] : []}>
          {inC2 && bars.map((b, i) => { const k = ease(cl((t - b.at) / 0.6)), hh = 0.0062 * b.h * k + 0.0005; const [x, z] = uv(b.u, b.v);
            return k > 0 && <group key={i} position={[x, 0, z]}>
              <mesh position={[0, hh / 2, -0.012]} castShadow><boxGeometry args={[b.w * BW * 0.92, hh, 0.024]} /><meshStandardMaterial color={b.col} roughness={0.35} emissive={b.col} emissiveIntensity={i === 3 ? 0.35 * k : 0.08} /></mesh>
              <mesh position={[0, hh + 0.0006, -0.012]}><boxGeometry args={[b.w * BW * 0.92 + 0.002, 0.0012, 0.026]} /><meshStandardMaterial color="#1b1b1b" /></mesh>
            </group>; })}
        </Book>
        {book2 > 0.001 && <Book p={[0.75 + (1 - book2) * 0.9, 0.97, -1.18]} rotY={-0.18 + (1 - book2) * 0.6} open={0} cover={pg.bonus2} inside={pg.p022_r} right={pg.p023} spine="#f28fc2" lift={Math.sin(book2 * Math.PI) * 0.05} />}
      </group>
    </ThreeCanvas>
  );
};
function ei2(t: number, a: number, b: number) { return ease((t - a) / (b - a)); }
