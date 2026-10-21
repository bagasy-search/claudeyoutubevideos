// chuy01 · EL MUNDO: el taller de concreto de Don Chuy en Monterrey (block, tubos fluorescentes, portón al sol de la calle,
// llantas apiladas, carrito azul) con UN compacto plateado sin marca sobre el elevador de dos postes y su motor turbo 1.5
// en corte: tapa de punterías que se levanta, árboles de levas, pistones, cadena, turbo que se pone al rojo, arnés,
// carcasa del termostato, cárter con aceite negro, discos, bujes y las soldaduras de punto del piso.
// UNA escena y UNA cámara para todo el video: los estados (sala de exhibición, taller, rayos X, despiece) se mezclan por tiempo.
// Render SÓLO en el farm (acá sólo stills).
import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { sceneAt } from "./escenas";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];

// ---------------- LÍNEA DE TIEMPO DEL MUNDO (segundos globales, anclados a la voz en Min1.tsx) ----------------
export type Ev = {
  show: [number, number];       // sala de exhibición: se apaga el taller y un cenital pinta el carro nuevo
  lights: number;               // los tubos se encienden (titilan) en este segundo
  drive: [number, number];      // el carro entra por el portón
  lift: [number, number, number][]; // [t0, t1, altura] tramos del elevador
  hood: [number, number];       // se abre el cofre
  cover: [number, number];      // se levanta la tapa de punterías
  xray: [number, number, number, number]; // carrocería fantasma: entra a/b, sale c/d
  oil: [number, number];        // chorro de aceite negro del cárter
  turbo: [number, number];      // el turbo se pone al rojo
  harness: [number, number];    // pulso de luz por el arnés
  welds: [number, number];      // las soldaduras de punto se encienden
  brakes: [number, number];     // los discos se ponen al rojo
  explode: [number, number, number, number]; // despiece: abre a/b, cierra c/d
};
export const EV: Ev = {
  show: [8.4, 18.2], lights: 32.15, drive: [32.2, 34.4],
  lift: [[34.55, 35.6, 0.42]], hood: [35.8, 36.5], cover: [36.3, 37.4],
  xray: [37.55, 38.0, 1e9, 1e9], oil: [37.75, 39.6], turbo: [39.45, 41.2], harness: [40.25, 41.6], welds: [40.9, 42.2], brakes: [41.7, 43.2],
  explode: [42.45, 43.35, 1e9, 1e9],
};
const liftAt1 = (t: number) => { let y = 0; for (const [a, b, h] of EV.lift) y = lerp(y, h, ease((t - a) / (b - a))); return y; };
const carX1 = (t: number) => lerp(9.5, 0, ease((t - EV.drive[0]) / (EV.drive[1] - EV.drive[0])) * (t >= EV.show[1] + 2 ? 1 : 0) + (t < EV.show[1] + 2 ? 1 : 0));

// ---------------- ESTADO del mundo: minuto 1 = línea de tiempo EV; después = escena activa (escenas.ts) ----------------
export const T1 = 72.3;
const anim = (t: number, v: number | [number, number, number, number] | undefined, def: number) =>
  v === undefined ? def : typeof v === "number" ? v : lerp(v[2], v[3], ease((t - v[0]) / (v[1] - v[0])));
const liftAt = (t: number) => (t < T1 ? liftAt1(t) : anim(t, sceneAt(t).ly, 0.42));
const carX = (t: number) => (t < T1 ? carX1(t) : anim(t, sceneAt(t).cx, 0));
// efecto de la escena con fundido de entrada/salida (0..1)
export const fx = (t: number, name: string, fade = 0.35) => {
  if (t < T1) {
    const m: Record<string, [number, number]> = { hot: EV.turbo, harness: EV.harness, welds: EV.welds, brakes: EV.brakes };
    const w = m[name]; if (!w) return 0;
    return win(t, w[0], w[0] + 0.5) * (1 - win(t, w[1] - 0.3, w[1]));
  }
  const w = sceneAt(t).fx?.[name]; if (!w) return 0;
  return win(t, w[0], w[0] + fade) * (1 - win(t, w[1] - fade, w[1]));
};
export const fx0 = (t: number, name: string) => (t < T1 ? ({ harness: EV.harness[0], welds: EV.welds[0] } as Record<string, number>)[name] ?? 0 : sceneAt(t).fx?.[name]?.[0] ?? 0);
const xrayAt = (t: number) => (t < T1 ? (t > 30 ? win(t, EV.xray[0], EV.xray[1]) * (1 - win(t, EV.xray[2], EV.xray[3])) : 0) : sceneAt(t).xr ?? 0);
const explodeAt = (t: number) => (t < T1 ? (t > 30 ? ease((t - EV.explode[0]) / (EV.explode[1] - EV.explode[0])) * (1 - ease((t - EV.explode[2]) / (EV.explode[3] - EV.explode[2]))) : 0) : sceneAt(t).X ?? 0);
const coverAt = (t: number) => {
  if (t < T1) return t > 30 ? ease((t - EV.cover[0]) / (EV.cover[1] - EV.cover[0])) : 0;
  const sc = sceneAt(t), w = sc.fx?.cover;
  return w ? ease((t - w[0]) / 1.1) : sc.cov ?? 0;
};

// ---------------- puntos del mundo (para portales y rótulos HTML) — en coordenadas del CARRO (se les suma el elevador) ----------------
export const PT = {
  windshield: [-0.55, 1.18, 0] as V3,
  engine: [-1.42, 0.63, 0] as V3,
  cover: [-1.42, 0.81, 0] as V3,
  pan: [-1.42, 0.17, 0] as V3,
  turbo: [-1.1, 0.45, -0.2] as V3,
  harness: [-1.62, 0.81, 0.1] as V3,
  welds: [0.6, 0.27, 0.8] as V3,
  brake: [-1.25, 0.31, 0.62] as V3,
  thermo: [-1.38, 0.63, -0.38] as V3,
  chain: [-1.42, 0.51, 0.34] as V3,
  headlight: [-1.96, 0.7, 0.58] as V3,
};
export const wpt = (t: number, q: V3): V3 => [q[0] + carX(t), q[1] + liftAt(t), q[2]];

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
export const KEYS: Key[] = [
  // sala de exhibición: el carro "nuevecito" bajo el cenital, órbita lenta a la altura de las rodillas
  { t: 8.4, p: [4.6, 0.85, 3.9], l: [-0.2, 0.62, 0], fov: 34 },
  { t: 13.0, p: [3.4, 0.8, 4.6], l: [-0.4, 0.66, 0], fov: 33 },
  { t: 17.6, p: [1.2, 1.05, 4.2], l: [-0.55, 0.95, 0], fov: 30 },
  // hacia el parabrisas (portal al POV de la avenida)
  { t: 18.3, p: [-0.1, 1.2, 2.2], l: [-0.55, 1.12, 0], fov: 30 },
  // "pues ese carro llegó ayer a mi taller": desde adentro, mirando al portón; el carro entra
  { t: 32.1, p: [-2.4, 1.6, 5.6], l: [5.5, 0.9, 0], fov: 44 },
  { t: 34.4, p: [-1.6, 1.75, 4.6], l: [0.3, 0.8, 0], fov: 42 },
  // "lo subí al elevador … le quité la tapa": 3/4 de frente, abierto
  { t: 35.7, p: [-4.8, 2.3, 3.8], l: [-1.0, 1.0, 0], fov: 38 },
  { t: 37.3, p: [-3.4, 1.95, 1.4], l: [-1.42, 1.3, 0], fov: 34 },
  // "le saqué el aceite": rayos X de costado, el cárter y el chorro
  { t: 38.05, p: [-2.4, 1.35, 3.3], l: [-1.4, 0.85, 0], fov: 34, arc: 0.12 },
  // "el turbo" (del otro lado)
  { t: 39.55, p: [-2.6, 2.3, -2.4], l: [-1.15, 1.1, -0.2], fov: 32 },
  // "los cables"
  { t: 40.5, p: [-3.0, 1.9, 1.2], l: [-1.55, 1.3, 0.1], fov: 32 },
  // "las soldaduras": abajo, mirando el piso del carro
  { t: 41.5, p: [2.7, 0.32, 2.3], l: [0.5, 0.72, 0.6], fov: 40 },
  // "los frenos"
  { t: 42.4, p: [-1.4, 0.65, 3.1], l: [-1.25, 0.75, 0.62], fov: 34 },
  // "pieza por pieza": se aleja y el motor se despieza en el aire
  { t: 43.6, p: [-0.4, 2.1, 4.8], l: [-1.3, 1.05, 0], fov: 40 },
];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
const camScene = (t: number) => {
  const ks = sceneAt(t).keys;
  let i = 0;
  while (i < ks.length - 1 && ks[i + 1].t <= t) i++;
  const a = ks[i], b = ks[Math.min(i + 1, ks.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  l.y += liftAt(t) * 0.9;
  // arranque en frío: el motor tiembla y la cámara con él
  const rt = fx(t, "rattle", 0.15); if (rt > 0.01) { p.x += Math.sin(t * 63) * 0.012 * rt; p.y += Math.sin(t * 51 + 1) * 0.01 * rt; }
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const camAt = (t: number) => {
  if (t >= T1) return camScene(t);
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  // entre la sala (≤18,3) y el taller (≥32,1) la cámara no viaja: el mundo está tapado por la toma y el avatar
  const jump = a.t < 20 && b.t > 30;
  const k = b.t > a.t && !jump ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  // el elevador sube: la mirada sube con el carro
  const ly = liftAt(t); if (t > 30) l.y += ly * 0.9;
  // tirón del motor al arrancar el despiece
  const sh = Math.exp(-Math.max(0, t - EV.explode[0]) * 4) * (t > EV.explode[0] ? 1 : 0);
  if (sh > 0.01) { p.x += Math.sin(t * 57) * 0.03 * sh; p.y += Math.sin(t * 43 + 1) * 0.025 * sh; }
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.02, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
export const screenCar = (t: number, q: V3) => screenOf(t, wpt(t, q));
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

// ---------------- piezas básicas ----------------
type Tx = THREE.Texture | undefined;
type M = { c: string; r?: number; m?: number; e?: string; ei?: number; map?: Tx; o?: number };
const Mat: React.FC<M> = ({ c, r = 0.8, m = 0, e, ei = 0, map, o = 1 }) => (
  <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={o < 0.999} opacity={o} depthWrite={o > 0.6} />
);
const Box: React.FC<{ p: V3; s: V3; rot?: V3; rad?: number; cast?: boolean } & M> = ({ p, s, rot, rad = 0.02, cast = true, ...m }) => (
  <mesh position={p} rotation={rot} castShadow={cast && (m.o ?? 1) > 0.6} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><Mat {...m} /></mesh>
);
const Cyl: React.FC<{ p: V3; R: number; h: number; rot?: V3; seg?: number; r2?: number } & M> = ({ p, R, h, rot, seg = 28, r2, ...m }) => (
  <mesh position={p} rotation={rot} castShadow={(m.o ?? 1) > 0.6} receiveShadow><cylinderGeometry args={[r2 ?? R, R, h, seg]} /><Mat {...m} /></mesh>
);

// tubo por una curva (arnés, mangueras, runners de admisión)
const Tube: React.FC<{ pts: V3[]; R: number; seg?: number } & M> = ({ pts, R, seg = 48, ...m }) => {
  const g = React.useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((q) => v3(q))), seg, R, 10, false), [JSON.stringify(pts), R, seg]);
  return <mesh geometry={g} castShadow receiveShadow><Mat {...m} /></mesh>;
};

// ---------------- EL CARRO (compacto plateado SIN marca) ----------------
const Wheel: React.FC<{ p: V3; spin: number; brakeHot: number; side: number; xo: number }> = ({ p, spin, brakeHot, side, xo }) => (
  <group position={p}>
    <group rotation={[Math.PI / 2, 0, 0]}>
      <group rotation={[0, spin, 0]}>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.235, 0.085, 16, 40]} /><meshStandardMaterial color="#141516" roughness={0.92} /></mesh>
        <Cyl p={[0, 0, 0]} R={0.2} h={0.14} c="#c9ccd0" m={0.85} r2={0.2} />
        {Array.from({ length: 5 }, (_, i) => <Box key={i} p={[Math.cos(i * 1.2566) * 0.1, side * 0.075, Math.sin(i * 1.2566) * 0.1]} s={[0.15, 0.02, 0.045]} rot={[0, -i * 1.2566, 0]} c="#e6e8ea" m={0.9} r={0.25} rad={0.008} />)}
        <Cyl p={[0, side * 0.08, 0]} R={0.045} h={0.02} c="#3a3c40" m={0.7} />
      </group>
    </group>
    {/* disco y caliper (adentro de la rueda) */}
    {xo !== 0 && <>
      <Cyl p={[0, 0, -side * 0.09]} R={0.15} h={0.024} rot={[Math.PI / 2, 0, 0]} c="#8b8e92" m={0.9} r={0.35} e="#ff3b12" ei={brakeHot * 2.4} />
      <Box p={[-0.11, 0.06, -side * 0.12]} s={[0.07, 0.12, 0.05]} c="#2c2d30" m={0.5} r={0.5} rad={0.012} />
    </>}
  </group>
);

// perfil lateral de un hatchback compacto (x: -2 nariz … +2 cola, y: piso), con los arcos de las ruedas recortados
const ARCH = (cx: number, r: number, from: number, to: number, n = 18): [number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = from + ((to - from) * i) / n; return [cx + Math.cos(a) * r, 0.31 + Math.sin(a) * r]; });
const PROFILE: [number, number][] = [
  [-2.0, 0.36], [-1.66, 0.33], ...ARCH(-1.25, 0.38, Math.PI, 0), [0.87, 0.3], ...ARCH(1.25, 0.38, Math.PI, 0), [1.98, 0.36],
  [2.04, 0.55], [2.03, 0.92], [1.95, 1.12], [1.76, 1.34], [1.5, 1.43], [0.3, 1.46], [0.0, 1.43], [-0.72, 1.0], [-0.86, 0.95],
  [-1.7, 0.86], [-1.92, 0.8], [-2.04, 0.68], [-2.08, 0.5],
];
const shapeOf = (pts: [number, number][]) => { const s = new THREE.Shape(); pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y))); s.closePath(); return s; };
const useExtrude = (pts: [number, number][], depth: number, bevel: number, seg = 4) => React.useMemo(() => {
  const g = new THREE.ExtrudeGeometry(shapeOf(pts), { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: seg, curveSegments: 24 });
  g.translate(0, 0, -depth / 2); g.computeVertexNormals(); return g;
}, [depth, bevel]);
// ventanas laterales (se pegan sobre los paneles)
const SIDE_WIN: [number, number][] = [[-0.6, 1.02], [-0.02, 1.37], [0.3, 1.4], [1.48, 1.38], [1.7, 1.18], [1.76, 1.02]];
// el cofre: losa curva con bisagra en el muro de fuego
const HOOD: [number, number][] = [[-1.16, -0.05], [-0.85, 0.01], [-0.5, 0.035], [0.0, 0.045], [0.0, 0.005], [-0.5, -0.005], [-0.85, -0.03], [-1.16, -0.09]];

const Car: React.FC<{ t: number }> = ({ t }) => {
  const x = carX(t), ly = liftAt(t);
  const drv = cl((t - EV.drive[0]) / (EV.drive[1] - EV.drive[0]));
  const spin = t >= T1 ? -carX(t) / 0.31 : t > 30 ? -(9.5 * ease(drv)) / 0.31 : 0;
  const hood = t >= T1 ? 1 : ease((t - EV.hood[0]) / (EV.hood[1] - EV.hood[0])) * (t > 30 ? 1 : 0);
  const xr = xrayAt(t);
  const show = t < 30 ? 1 : 0;
  const body = lerp(1, 0.12, xr); // carrocería fantasma
  const paint = { c: show ? "#c9ced4" : "#b9bec4", m: 0.85, r: show ? 0.2 : 0.32, o: body };
  const glassO = lerp(0.95, 0.08, xr);
  const brakeHot = fx(t, "brakes");
  const side = useExtrude(PROFILE, 0.04, 0.025, 3);
  // habitáculo = el perfil desde el muro de fuego hacia atrás, a todo el ancho
  const cabinPts = React.useMemo(() => PROFILE.filter(([px]) => px >= -0.9).concat([[-0.9, 0.3]] as [number, number][]), []);
  const cabin = useExtrude(cabinPts, 1.5, 0.05, 4);
  const nosePts: [number, number][] = [[-2.08, 0.36], [-1.82, 0.33], [-1.82, 0.8], [-1.92, 0.8], [-2.04, 0.68], [-2.1, 0.5]];
  const nose = useExtrude(nosePts, 1.56, 0, 1);
  const hoodG = useExtrude(HOOD, 1.6, 0, 1);
  const winG = React.useMemo(() => new THREE.ShapeGeometry(shapeOf(SIDE_WIN)), []);
  const glass = <meshStandardMaterial color="#10161c" metalness={0.9} roughness={0.05} transparent opacity={glassO} depthWrite={glassO > 0.6} />;
  const pm = <meshStandardMaterial color={paint.c} metalness={paint.m} roughness={paint.r} transparent={body < 0.999} opacity={body} depthWrite={body > 0.6} envMapIntensity={1.2} />;
  return (
    <group position={[x, ly, 0]}>
      {/* chasis / piso con soldaduras de punto */}
      <Box p={[0.55, 0.29, 0]} s={[2.9, 0.05, 1.6]} c="#2b2c2e" r={0.7} m={0.3} o={Math.max(body, 0.5)} />
      <Welds t={t} />
      {/* paneles laterales con el perfil del hatchback */}
      {[-1, 1].map((sd) => <mesh key={sd} geometry={side} position={[0, 0, sd * 0.8]} castShadow={body > 0.6} receiveShadow>{pm}</mesh>)}
      {/* habitáculo y frente */}
      <mesh geometry={cabin} castShadow={body > 0.6} receiveShadow>{pm}</mesh>
      <mesh geometry={nose} castShadow={body > 0.6} receiveShadow>{pm}</mesh>
      {/* ventanas laterales, parabrisas y medallón */}
      {[-1, 1].map((sd) => <mesh key={"w" + sd} geometry={winG} position={[0, 0, sd * 0.852]} rotation={[0, sd < 0 ? Math.PI : 0, 0]} scale={[sd < 0 ? -1 : 1, 1, 1]}>{glass}</mesh>)}
      <mesh position={[-0.38, 1.27, 0]} rotation={[0, 0, Math.atan2(0.47, 0.72)]}><boxGeometry args={[0.84, 0.012, 1.46]} />{glass}</mesh>
      <mesh position={[1.925, 1.26, 0]} rotation={[0, 0, -1.04]}><boxGeometry args={[0.3, 0.012, 1.36]} />{glass}</mesh>
      {/* pilares negros entre cristales */}
      {[-1, 1].map((sd) => <Box key={"pb" + sd} p={[0.32, 1.22, sd * 0.853]} s={[0.07, 0.4, 0.01]} c="#0b0c0d" r={0.4} o={body} rad={0.004} cast={false} />)}
      {/* parrilla, faros y calaveras */}
      <Box p={[-2.09, 0.5, 0]} s={[0.03, 0.12, 0.74]} c="#0e0f10" r={0.4} m={0.5} o={body} rad={0.01} />
      <Box p={[-2.08, 0.38, 0]} s={[0.04, 0.06, 1.2]} c="#151617" r={0.6} o={body} rad={0.01} />
      {[-1, 1].map((sd) => <mesh key={"h" + sd} position={[-1.98, 0.72, sd * 0.56]} rotation={[0, 0, -0.35]}><boxGeometry args={[0.22, 0.09, 0.36]} /><meshStandardMaterial color="#e8eef3" metalness={0.6} roughness={0.08} emissive="#eaf4ff" emissiveIntensity={show ? 2.2 : 0.12} transparent opacity={Math.max(body, 0.4)} /></mesh>)}
      {[-1, 1].map((sd) => <Box key={"t" + sd} p={[2.03, 0.98, sd * 0.62]} s={[0.05, 0.16, 0.24]} c="#7a0f12" r={0.2} e="#ff2a1a" ei={0.9} o={Math.max(body, 0.4)} rad={0.02} />)}
      {/* espejos */}
      {[-1, 1].map((sd) => <Box key={"esp" + sd} p={[-0.6, 1.0, sd * 0.92]} s={[0.14, 0.09, 0.1]} {...paint} rad={0.035} />)}
      {/* manijas */}
      {[-1, 1].flatMap((sd) => [0.05, 0.95].map((hx) => <Box key={"mj" + sd + hx} p={[hx, 0.95, sd * 0.852]} s={[0.14, 0.03, 0.012]} c="#9da2a7" m={0.9} r={0.25} o={body} rad={0.006} cast={false} />))}
      {/* COFRE con bisagra en el muro de fuego */}
      <group position={[-0.86, 0.86, 0]} rotation={[0, 0, -hood * 1.15]}>
        <mesh geometry={hoodG} castShadow={body > 0.6}>{pm}</mesh>
      </group>
      {hood > 0.6 && <Cyl p={[-1.7, 1.25, 0.6]} R={0.007} h={0.62} rot={[0, 0, 0.35]} c="#8a8d90" m={0.8} />}
      <group position={[0, -0.17, 0]}><Engine t={t} />{t >= T1 && <Gearbox t={t} xr={xr} />}</group>
      {t >= T1 && <UnderExtras t={t} />}
      {/* ruedas */}
      {[[-1.25, 1], [-1.25, -1], [1.25, 1], [1.25, -1]].map(([wx, sd], i) => (
        <Wheel key={i} p={[wx, 0.31, sd * 0.74]} spin={spin} side={sd} brakeHot={wx < 0 ? brakeHot : 0} xo={wx < 0 ? 1 : 0} />
      ))}
      {[-1, 1].map((sd) => <mesh key={"bu" + sd} position={[-1.05, 0.25, sd * 0.42]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.03, 0.014, 10, 18]} /><meshStandardMaterial color="#121212" roughness={0.95} /></mesh>)}
      {[-1, 1].map((sd) => <Box key={"br" + sd} p={[-1.15, 0.24, sd * 0.56]} s={[0.36, 0.03, 0.05]} rot={[0, sd * 0.4, 0]} c="#2e2f31" m={0.6} r={0.5} rad={0.01} />)}
      <Tube pts={[[-1.12, 0.55, -0.22], [-1.0, 0.3, -0.25], [-0.6, 0.22, -0.3], [1.0, 0.22, -0.3], [1.9, 0.24, -0.45]]} R={0.028} c="#5d5650" m={0.7} r={0.45} />
    </group>
  );
};

// soldaduras de punto a lo largo de los largueros (debajo del piso): se encienden en ola
const Welds: React.FC<{ t: number }> = ({ t }) => {
  const on = fx(t, "welds", 0.25);
  const sweep = cl((t - fx0(t, "welds")) / (t < T1 ? 0.9 : 2.2));
  const N = 46;
  return (
    <group>
      {[-1, 1].map((sd) => <Box key={sd} p={[0.55, 0.255, sd * 0.78]} s={[2.9, 0.04, 0.07]} c="#232426" m={0.5} r={0.55} rad={0.008} />)}
      {[-1, 1].flatMap((sd) => Array.from({ length: N }, (_, i) => {
        const u = i / (N - 1), lit = on * cl((sweep - u) * 6 + 1) * (sweep >= u ? 1 : 0);
        return <mesh key={sd + "_" + i} position={[-0.85 + u * 2.8, 0.232, sd * 0.78]}><sphereGeometry args={[0.009, 8, 6]} /><meshStandardMaterial color="#9a9da1" metalness={0.9} roughness={0.3} emissive="#ffd27a" emissiveIntensity={lit * 3.5} /></mesh>;
      }))}
    </group>
  );
};

// ---------------- EL MOTOR (turbo 1.5, en corte) ----------------
const Engine: React.FC<{ t: number }> = ({ t }) => {
  const xr = xrayAt(t);
  const X = explodeAt(t);
  const cov = coverAt(t);
  const run = t >= T1 ? fx(t, "run", 0.2) : t > 30 && t < EV.lift[0][0] ? 1 : 0; // el motor gira mientras entra el carro / al arrancar
  const rot = t * 14 * run + (t > EV.xray[0] ? (t - EV.xray[0]) * 3.2 : 0); // cigüeñal (lento en rayos X para ver los pistones)
  const turboHot = fx(t, "hot", 0.5);
  const ox = -1.42;
  const blockO = lerp(1, 0.32, xr);
  const zc = [-0.22, -0.075, 0.075, 0.22];
  const dx = (v: V3): V3 => [v[0] * X, v[1] * X, v[2] * X];
  const G: React.FC<{ d: V3; children: React.ReactNode }> = ({ d, children }) => { const o = dx(d); return <group position={o}>{children}</group>; };
  return (
    <group>
      {/* radiador y travesaño */}
      <G d={[-0.5, 0, 0]}><Box p={[-1.86, 0.58, 0]} s={[0.05, 0.36, 1.3]} c="#3d4247" m={0.6} r={0.45} rad={0.01} /></G>
      {/* bloque (rayos X: transparente para ver los pistones) */}
      <G d={[0, -0.05, 0]}>
        <Box p={[ox, 0.62, 0]} s={[0.4, 0.38, 0.62]} c="#6f7377" m={0.75} r={0.42} o={blockO} rad={0.02} />
        {/* cilindros y pistones */}
        {zc.map((z, i) => {
          const ph = rot + [0, Math.PI, Math.PI, 0][i];
          const py = 0.62 + Math.cos(ph) * 0.06;
          return (
            <group key={i}>
              {xr > 0.05 && <Cyl p={[ox, 0.66, z]} R={0.062} h={0.3} c="#c4c8cc" m={0.9} r={0.18} o={0.5 * xr} seg={24} />}
              <Cyl p={[ox, py, z]} R={0.058} h={0.07} c="#d3d6d9" m={0.85} r={0.3} o={xr > 0.05 ? 1 : 0.0001} seg={24} />
              {xr > 0.05 && <Box p={[ox, py - 0.12, z]} s={[0.025, 0.18, 0.025]} rot={[0, 0, Math.sin(ph) * 0.25]} c="#9ea2a6" m={0.85} r={0.35} rad={0.005} />}
            </group>
          );
        })}
      </G>
      {/* cárter con el aceite negro */}
      <G d={[0, -0.32, 0]}>
        <Box p={[ox, 0.37, 0]} s={[0.36, 0.1, 0.56]} c="#4b4f53" m={0.7} r={0.5} o={lerp(1, 0.4, xr)} rad={0.02} />
        {xr > 0.05 && <Box p={[ox, 0.35, 0]} s={[0.33, 0.05, 0.52]} c="#050403" m={0.2} r={0.08} o={xr * (t < T1 ? 1 - 0.6 * win(t, EV.oil[0] + 0.4, EV.oil[1]) : 1)} rad={0.01} />}
      </G>
      {/* cabeza */}
      <G d={[0, 0.16, 0]}><Box p={[ox, 0.86, 0]} s={[0.42, 0.12, 0.6]} c="#8b8f93" m={0.75} r={0.38} o={lerp(1, 0.6, xr)} rad={0.015} /></G>
      {/* árboles de levas (se ven al levantar la tapa) */}
      <G d={[0, 0.3, 0]}>
        {[-0.08, 0.08].map((cx, j) => (
          <group key={j} position={[ox + cx, 0.935, 0]}>
            <Cyl p={[0, 0, 0]} R={0.018} h={0.58} rot={[Math.PI / 2, 0, 0]} c="#c9b98e" m={0.85} r={0.25} seg={16} />
            {Array.from({ length: 8 }, (_, k) => (
              <mesh key={k} position={[0, 0, -0.25 + k * 0.071]} rotation={[0, 0, rot * 0.5 + k * 0.8 + j]}><boxGeometry args={[0.05, 0.034, 0.022]} /><meshStandardMaterial color="#d8c79a" metalness={0.85} roughness={0.22} emissive="#ffd9a0" emissiveIntensity={fx(t, "camglow") * 0.35} /></mesh>
            ))}
          </group>
        ))}
      </G>
      {/* TAPA DE PUNTERÍAS (negra, con nervios) — se levanta y flota */}
      <group position={[0, cov * 0.42 + X * 0.35, 0]} rotation={[cov * 0.12, 0, cov * -0.08]}>
        <Box p={[ox, 0.965, 0]} s={[0.36, 0.06, 0.58]} c="#141516" m={0.3} r={0.55} o={lerp(1, 0.5, xr)} rad={0.025} />
        {Array.from({ length: 5 }, (_, k) => <Box key={k} p={[ox, 1.0, -0.2 + k * 0.1]} s={[0.26, 0.012, 0.03]} c="#1e2022" r={0.5} o={lerp(1, 0.5, xr)} rad={0.005} />)}
        <Cyl p={[ox + 0.1, 1.01, 0.22]} R={0.025} h={0.03} c="#f2b01e" r={0.4} />
      </group>
      {/* bobinas */}
      <G d={[0, 0.5, 0]}>{zc.map((z, i) => <Cyl key={i} p={[ox - 0.02, 1.03 + cov * 0.42, z]} R={0.018} h={0.07} c="#1a1a1a" r={0.5} o={cov > 0.5 ? 0 : 1} seg={12} />)}</G>
      {/* CADENA DE DISTRIBUCIÓN (costado) */}
      <G d={[0, 0, 0.32]}><Chain t={t} rot={rot} x={ox} glow={fx(t, "chain")} dirty={fx(t, "dirty")} slack={fx(t, "slack", 0.8)} rattle={fx(t, "rattle", 0.15)} /></G>
      {/* múltiple de admisión con 4 runners (frente) */}
      <G d={[-0.36, 0.05, 0]}>
        <Box p={[-1.76, 0.7, 0]} s={[0.1, 0.11, 0.5]} c="#2a2c2f" r={0.6} m={0.2} o={lerp(1, 0.55, xr)} rad={0.03} />
        {zc.map((z, i) => <Tube key={i} pts={[[-1.62, 0.84, z], [-1.7, 0.86, z * 0.95], [-1.76, 0.78, z * 0.8]]} R={0.026} c="#2f3134" m={0.2} r={0.55} o={lerp(1, 0.55, xr)} seg={16} />)}
      </G>
      {/* TURBO (lado del muro de fuego) */}
      <G d={[0.42, -0.05, -0.2]}>
        <group position={[-1.1, 0.62, -0.2]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow><torusGeometry args={[0.07, 0.04, 16, 32]} /><meshStandardMaterial color="#8d8378" metalness={0.75} roughness={0.42} emissive="#ff4a10" emissiveIntensity={turboHot * 2.6} /></mesh>
          <Cyl p={[0, 0, 0.05]} R={0.055} h={0.07} rot={[Math.PI / 2, 0, 0]} c="#b7b2aa" m={0.85} r={0.3} />
          <Cyl p={[0, 0, -0.06]} R={0.06} h={0.06} rot={[Math.PI / 2, 0, 0]} c="#7b736a" m={0.8} r={0.4} e="#ff5a14" ei={turboHot * 3.2} />
          {/* rueda que gira */}
          <group position={[0, 0, 0.09]} rotation={[0, 0, t * (turboHot > 0.1 || fx(t, "spin") > 0.1 ? 60 : 2)]}>{Array.from({ length: 8 }, (_, k) => <Box key={k} p={[Math.cos(k * 0.785) * 0.025, Math.sin(k * 0.785) * 0.025, 0]} s={[0.032, 0.006, 0.012]} rot={[0, 0, k * 0.785]} c="#d9dcdf" m={0.9} r={0.2} rad={0.002} />)}</group>
        </group>
        <Tube pts={[[-1.25, 0.72, -0.25], [-1.16, 0.7, -0.24], [-1.1, 0.66, -0.2]]} R={0.03} c="#6b5f55" m={0.7} r={0.5} e="#ff4a10" ei={turboHot * 1.8} seg={12} />
        {/* línea de aceite del turbo (delgada, dorada) */}
        <Tube pts={[[-1.3, 0.86, -0.3], [-1.18, 0.82, -0.32], [-1.12, 0.7, -0.24]]} R={0.006} c="#c99a42" m={0.9} r={0.25} seg={16} />
      </G>
      {/* carcasa del termostato (plástico) con la grieta */}
      <G d={[0, 0.12, -0.38]}>
        <Cyl p={[-1.38, 0.8, -0.38]} R={0.035} h={0.06} rot={[Math.PI / 2, 0, 0]} c="#d9d4c7" r={0.7} />
        <Tube pts={[[-1.38, 0.8, -0.41], [-1.5, 0.78, -0.5], [-1.74, 0.6, -0.55]]} R={0.022} c="#151617" r={0.85} seg={16} />
      </G>
      {/* batería */}
      <G d={[-0.1, 0.2, 0.45]}><Box p={[-1.6, 0.74, 0.6]} s={[0.22, 0.18, 0.28]} c="#1b1c1e" r={0.6} rad={0.02} /><Cyl p={[-1.6, 0.84, 0.52]} R={0.015} h={0.02} c="#c0392b" r={0.5} /></G>
      {/* ARNÉS (tubo corrugado negro) con el pulso de luz */}
      <G d={[-0.2, 0.42, 0.1]}><Harness t={t} /></G>
      {t >= T1 && <EngineExtras t={t} xr={xr} ox={ox} zc={zc} rot={rot} />}
    </group>
  );
};

// ---------------- PIEZAS DE LAS ESCENAS DEL MINUTO 2 EN ADELANTE (todas prendidas por fx(t, nombre)) ----------------
const OIL_LINE: V3[] = [[-1.3, 0.86, -0.3], [-1.18, 0.82, -0.32], [-1.12, 0.7, -0.24]];
const EngineExtras: React.FC<{ t: number; xr: number; ox: number; zc: number[]; rot: number }> = ({ t, ox, zc }) => {
  const oil = fx(t, "oilflow"), comp = fx(t, "comp", 0.5), tired = fx(t, "tired", 0.4), belt = fx(t, "belt", 0.3);
  const carbon = fx(t, "carbon", 0.5), spray = fx(t, "spray", 0.2), pcv = fx(t, "pcv", 0.5), crack = fx(t, "crack", 0.3);
  const oilC = React.useMemo(() => new THREE.CatmullRomCurve3(OIL_LINE.map((q) => v3(q))), []);
  const cg = cl((t - fx0(t, "comp")) / 1.6); // las columnas crecen
  return (
    <group>
      {/* aceite dorado corriendo por la línea del turbo */}
      {oil > 0.02 && Array.from({ length: 9 }, (_, i) => { const q = oilC.getPoint((t * 0.9 + i / 9) % 1); return <mesh key={i} position={[q.x, q.y, q.z]}><sphereGeometry args={[0.011, 10, 8]} /><meshStandardMaterial color="#ffb02e" emissive="#ffa21a" emissiveIntensity={oil * 2.4} transparent opacity={oil} /></mesh>; })}
      {/* compresión: 4 columnas de luz sobre los cilindros (parejas); "un motor cansado" = una se cae a rojo */}
      {comp > 0.02 && zc.map((z, i) => {
        const h = 0.42 * cg * [1, 0.994, 1, 0.989][i];
        const bad = tired * (i === 2 ? 1 : 0);
        return (
          <group key={i}>
            <mesh position={[ox, 1.02 + (h * (1 - bad * 0.45)) / 2, z]}><boxGeometry args={[0.07, Math.max(0.001, h * (1 - bad * 0.45)), 0.07]} /><meshStandardMaterial color={bad > 0.5 ? "#ff4a3d" : "#2ee86a"} emissive={bad > 0.5 ? "#ff4a3d" : "#2ee86a"} emissiveIntensity={1.6 * comp} transparent opacity={0.85 * comp} toneMapped={false} /></mesh>
            {bad > 0.02 && <mesh position={[ox, 1.02 + h * 0.775, z]}><boxGeometry args={[0.074, h * 0.45, 0.074]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.25 * bad} wireframe /></mesh>}
          </group>
        );
      })}
      {/* la banda de hule (fantasma, roja) junto a la cadena: lo que NO trae */}
      {belt > 0.02 && <group position={[ox, 0.62, 0.38]}>
        <mesh scale={[1, 1.9, 1]}><torusGeometry args={[0.14, 0.008, 6, 40]} /><meshStandardMaterial color="#111111" emissive="#ff4a3d" emissiveIntensity={belt * (0.6 + 0.4 * Math.sin(t * 6))} transparent opacity={0.55 * belt} /></mesh>
      </group>}
      {/* inyección directa: chorro de gasolina dentro del cilindro + costra en las válvulas de admisión */}
      {zc.map((z, i) => (
        <group key={"v" + i}>
          {carbon > 0.02 && Array.from({ length: 7 }, (_, k) => <mesh key={k} position={[ox - 0.12 + rnd(i * 7 + k, 1) * 0.04, 0.8 + rnd(i * 7 + k, 2) * 0.03, z - 0.02 + rnd(i * 7 + k, 3) * 0.04]} scale={carbon}><dodecahedronGeometry args={[0.012 + rnd(k, i) * 0.008, 0]} /><meshStandardMaterial color="#0d0b09" roughness={1} /></mesh>)}
          {carbon > 0.02 && <Cyl p={[ox - 0.11, 0.84, z]} R={0.006} h={0.1} c="#9aa0a5" m={0.9} r={0.3} />}
          {spray > 0.02 && Math.sin(t * 9 + i * 1.6) > -0.2 && <mesh position={[ox + 0.02, 0.73, z]} rotation={[0, 0, 0.35]}><coneGeometry args={[0.03 * spray, 0.09, 16, 1, true]} /><meshStandardMaterial color="#ffd36a" emissive="#ffb21a" emissiveIntensity={1.8 * spray} transparent opacity={0.6 * spray} side={THREE.DoubleSide} depthWrite={false} /></mesh>}
        </group>
      ))}
      {/* ventilación del cárter: vapores grises que suben a la admisión y se pegan */}
      {pcv > 0.02 && Array.from({ length: 22 }, (_, i) => {
        const u = (t * 0.35 + i / 22) % 1;
        const x = lerp(ox + 0.05, -1.76, u), y = 0.42 + Math.sin(u * Math.PI) * 0.5 + u * 0.28, z = (rnd(i, 5) - 0.5) * 0.4 * (1 - u * 0.6);
        return <mesh key={i} position={[x, y, z]}><sphereGeometry args={[0.018 + u * 0.012, 8, 6]} /><meshStandardMaterial color="#b9b4a8" transparent opacity={0.45 * pcv * Math.sin(u * Math.PI)} depthWrite={false} /></mesh>;
      })}
      {/* la grieta del termostato: línea roja + costra blanca + gotas de anticongelante */}
      {crack > 0.02 && <group position={[0, 0, 0]}>
        <Box p={[-1.38, 0.837, -0.38]} s={[0.004, 0.003, 0.058]} rot={[0, 0.25, 0]} c="#ff3b2f" e="#ff3b2f" ei={2.5 * crack} rad={0.001} cast={false} />
        {Array.from({ length: 6 }, (_, k) => <Box key={k} p={[-1.385 + rnd(k, 9) * 0.01, 0.836, -0.405 + k * 0.01]} s={[0.006, 0.003, 0.006]} c="#f2efe6" r={1} rad={0.001} cast={false} />)}
        {Array.from({ length: 3 }, (_, k) => { const u = (t * 0.8 + k / 3) % 1; return <mesh key={"d" + k} position={[-1.34, 0.78 - u * 0.4, -0.38]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.007, 10, 8]} /><meshStandardMaterial color="#ff6fae" emissive="#ff4f9a" emissiveIntensity={0.6} transparent opacity={crack * (1 - u)} /></mesh>; })}
      </group>}
    </group>
  );
};

// caja de doble embrague (al costado del motor): dos discos; en rayos X se ve el aceite adentro (rojo sano → café quemado)
const Gearbox: React.FC<{ t: number; xr: number }> = ({ t, xr }) => {
  const g = fx(t, "gear", 0.4), dirty = fx(t, "dirtyatf", 0.6);
  const o = lerp(1, 0.3, xr);
  return (
    <group position={[-1.42, 0.5, -0.5]}>
      <Box p={[0, 0, 0]} s={[0.36, 0.3, 0.26]} c="#8c9095" m={0.7} r={0.45} o={o} rad={0.04} />
      {xr > 0.05 && [-0.05, 0.05].map((dz, j) => (
        <group key={j} position={[0, 0.03, dz]} rotation={[0, 0, t * (j ? 3 : -4) * (0.3 + g)]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.1 - j * 0.02, 0.1 - j * 0.02, 0.025, 24]} /><meshStandardMaterial color="#c9ccd0" metalness={0.9} roughness={0.25} emissive="#3fa9ff" emissiveIntensity={g * 1.2} /></mesh>
          {Array.from({ length: 12 }, (_, k) => <Box key={k} p={[Math.cos(k * 0.5236) * (0.105 - j * 0.02), Math.sin(k * 0.5236) * (0.105 - j * 0.02), 0]} s={[0.02, 0.014, 0.026]} rot={[0, 0, k * 0.5236]} c="#b3b7bb" m={0.9} r={0.3} rad={0.002} cast={false} />)}
        </group>
      ))}
      {xr > 0.05 && <Box p={[0, -0.1, 0]} s={[0.33, 0.07, 0.23]} c={dirty > 0.5 ? "#3a2412" : "#b8322a"} r={0.1} m={0.2} o={0.8 * xr} rad={0.02} cast={false} />}
    </group>
  );
};

// debajo del carro (coordenadas del carro): regla sobre las soldaduras, franja de óxido, soportes, amortiguadores, aros verdes del veredicto
const UnderExtras: React.FC<{ t: number }> = ({ t }) => {
  const ruler = fx(t, "ruler", 0.4), rust = fx(t, "rust", 0.6), mounts = fx(t, "mounts", 0.3), shocks = fx(t, "shocks", 0.3);
  const ok = fx(t, "glowok", 0.6), rep2 = fx(t, "repaired", 0.5);
  const ru = cl((t - fx0(t, "ruler")) / 1.2);
  const ra = cl((t - fx0(t, "rust")) / 1.5);
  return (
    <group>
      {/* cinta métrica amarilla a lo largo del larguero */}
      {ruler > 0.02 && <group>
        <Box p={[-0.85 + 1.4 * ru, 0.205, 0.85]} s={[Math.max(0.001, 2.8 * ru), 0.003, 0.04]} c="#f2c21b" r={0.5} e="#f2c21b" ei={0.3 * ruler} rad={0.001} cast={false} />
        {Array.from({ length: 29 }, (_, k) => (k / 28 <= ru ? <Box key={k} p={[-0.85 + k * 0.1, 0.2, 0.84]} s={[0.004, 0.002, k % 5 ? 0.012 : 0.022]} c="#111111" r={1} rad={0.0005} cast={false} /> : null))}
      </group>}
      {/* franja de óxido (10 cm) donde falta el sellador, con su cota */}
      {rust > 0.02 && <group>
        <Box p={[1.35, 0.262, 0.74]} s={[0.1 * (0.3 + 0.7 * ra), 0.004, 0.035]} c="#b5521b" r={1} e="#ff7a2a" ei={0.5 * rust * (0.7 + 0.3 * Math.sin(t * 4))} rad={0.001} cast={false} />
        {[-1, 1].map((sd) => <Box key={sd} p={[1.35 + sd * 0.05, 0.25, 0.7]} s={[0.003, 0.02, 0.003]} c="#ffffff" e="#ffffff" ei={rust} rad={0.0005} cast={false} />)}
        <Box p={[1.35, 0.25, 0.7]} s={[0.1, 0.002, 0.002]} c="#ffffff" e="#ffffff" ei={rust} rad={0.0005} cast={false} />
      </group>}
      {/* soportes del motor (hule) en verde */}
      {mounts > 0.02 && ([[-1.42, 0.3, 0.38], [-1.42, 0.3, -0.36], [-1.0, 0.28, 0]] as V3[]).map((q, i) => <Box key={i} p={q} s={[0.09, 0.06, 0.09]} c="#1a1a1a" r={0.9} e="#2ee86a" ei={mounts * (1.2 + 0.6 * Math.sin(t * 5 + i))} rad={0.015} />)}
      {/* amortiguadores delanteros con resorte, trabajando */}
      {shocks > 0.02 && [-1, 1].map((sd) => {
        const k = 0.5 + 0.5 * Math.sin(t * 5 + sd);
        const h = 0.34 - k * 0.05;
        return (
          <group key={sd} position={[-1.25, 0.52, sd * 0.56]}>
            <Cyl p={[0, 0, 0]} R={0.02} h={h} c="#2e3135" m={0.6} r={0.4} e="#2ee86a" ei={shocks * 0.9} seg={14} />
            {Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[0, -h / 2 + (j + 0.5) * (h / 6), 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.045, 0.007, 6, 18]} /><meshStandardMaterial color="#b0291f" metalness={0.5} roughness={0.4} emissive="#2ee86a" emissiveIntensity={shocks * 0.4} /></mesh>)}
          </group>
        );
      })}
      {/* veredicto: aros verdes en lo que salió bien (motor, cadena, piso, arnés) */}
      {ok > 0.02 && ([[-1.42, 1.0, 0], [-1.42, 0.6, 0.4], [0.55, 0.24, 0.78], [-1.64, 0.97, 0.0]] as V3[]).map((q, i) => {
        const u = cl((t - fx0(t, "glowok")) * 1.2 - i * 0.35);
        return u > 0 ? <mesh key={i} position={q} rotation={[Math.PI / 2, 0, 0]} scale={0.6 + 0.4 * ease(u)}><torusGeometry args={[0.22, 0.012, 8, 48]} /><meshStandardMaterial color="#2ee86a" emissive="#2ee86a" emissiveIntensity={2.2 * ok} transparent opacity={ok * ease(u)} toneMapped={false} /></mesh> : null;
      })}
      {/* entregado: la etiqueta de servicio colgando del espejo */}
      {rep2 > 0.02 && <group position={[-0.25, 1.18, 0]} rotation={[0, 0, Math.sin(t * 3) * 0.12]}>
        <Box p={[0, -0.06, 0]} s={[0.004, 0.12, 0.004]} c="#dddddd" rad={0.0005} cast={false} />
        <Box p={[0, -0.14, 0]} s={[0.003, 0.07, 0.045]} c="#f4f1e8" e="#2ee86a" ei={0.35 * rep2} rad={0.002} cast={false} />
      </group>}
    </group>
  );
};

// la cortina del portón baja al cierre
const Shutter: React.FC<{ t: number }> = ({ t }) => {
  const s = fx(t, "shutter", 0.2);
  if (s < 0.01) return null;
  const u = ease((t - fx0(t, "shutter")) / 1.4), h = 3.4 * u;
  return (
    <group>
      <mesh position={[7.85, 3.4 - h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[4.9, Math.max(0.01, h)]} /><meshStandardMaterial color="#7d8288" metalness={0.6} roughness={0.5} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: Math.floor(h / 0.12) }, (_, k) => <Box key={k} p={[7.83, 3.4 - k * 0.12 - 0.06, 0]} s={[0.012, 0.012, 4.9]} c="#5d6268" m={0.6} r={0.5} rad={0.002} cast={false} />)}
    </group>
  );
};

const HPTS: V3[] = [[-1.6, 0.84, 0.5], [-1.66, 0.97, 0.3], [-1.64, 0.99, 0.0], [-1.6, 0.97, -0.25], [-1.48, 0.92, -0.46], [-1.22, 0.9, -0.6]];
const Harness: React.FC<{ t: number }> = ({ t }) => {
  const on = fx(t, "harness", 0.2);
  const curve = React.useMemo(() => new THREE.CatmullRomCurve3(HPTS.map((q) => v3(q))), []);
  const u = ((t - fx0(t, "harness")) * 0.9) % 1;
  const p = curve.getPoint(cl(u));
  return (
    <group>
      <Tube pts={HPTS} R={0.014} c="#111213" r={0.7} e="#3fa9ff" ei={on * 0.5} seg={60} />
      {/* conectores sellados */}
      {(t < T1 ? [0.15, 0.4, 0.62, 0.86] : Array.from({ length: 12 }, (_, i) => 0.06 + i * 0.08)).map((k, i, arr) => {
        const q = curve.getPoint(k);
        const ck = fx(t, "check", 0.2), lit = ck > 0 && (t - fx0(t, "check")) * 3.2 > i ? ck : 0, seal = fx(t, "seals");
        return (
          <group key={i}>
            <Box p={[q.x, q.y + 0.012, q.z]} s={[0.04, 0.028, 0.035]} c="#2b2d30" r={0.5} e={lit > 0 ? "#2ee86a" : "#3fa9ff"} ei={lit > 0 ? lit * 2.2 : on * 0.8} rad={0.006} />
            {seal > 0.02 && i % 2 === 0 && <mesh position={[q.x, q.y + 0.012, q.z + 0.02]}><torusGeometry args={[0.016, 0.004, 8, 20]} /><meshStandardMaterial color="#ff8a2a" emissive="#ff8a2a" emissiveIntensity={seal * 1.6} /></mesh>}
            {void arr}
          </group>
        );
      })}
      {on > 0.05 && <mesh position={p}><sphereGeometry args={[0.022, 12, 10]} /><meshBasicMaterial color="#9fdcff" toneMapped={false} transparent opacity={on} /></mesh>}
    </group>
  );
};

// cadena: eslabones que avanzan por un estadio entre el engrane del árbol y el del cigüeñal
const Chain: React.FC<{ t: number; rot: number; x: number; glow?: number; dirty?: number; slack?: number; rattle?: number }> = ({ t, rot, x, glow = 0, dirty = 0, slack = 0, rattle = 0 }) => {
  const top = 0.9, bot = 0.45, R1 = 0.06, R2 = 0.042, N = 44;
  const L = Math.PI * (R1 + R2) + 2 * (top - bot);
  const at = (s: number): [number, number] => {
    s = ((s % L) + L) % L;
    const a1 = Math.PI * R1, st = top - bot;
    if (s < st) return [R1 - (R1 - R2) * (s / st), top - s];
    s -= st; if (s < Math.PI * R2) { const a = s / R2; return [R2 * Math.cos(a), bot - R2 * Math.sin(a)]; }
    s -= Math.PI * R2; if (s < st) return [-R2 - (R1 - R2) * (s / st), bot + s];
    s -= st; const a = Math.PI + s / R1; void a1; return [R1 * Math.cos(a), top - R1 * Math.sin(a)];
  };
  const off = rot * 0.02;
  return (
    <group position={[x, 0, 0.33]}>
      <Cyl p={[0, top, 0]} R={R1} h={0.02} rot={[Math.PI / 2, 0, 0]} c="#9ea3a8" m={0.9} r={0.3} />
      <Cyl p={[0, bot, 0]} R={R2} h={0.02} rot={[Math.PI / 2, 0, 0]} c="#9ea3a8" m={0.9} r={0.3} />
      {Array.from({ length: N }, (_, i) => {
        let [u, v] = at(off + (i * L) / N);
        // lado del tensor (x>0, tramo recto): se afloja y se comba hacia afuera
        if (u > 0 && v < top - 0.01 && v > bot + 0.01) u += Math.sin(((top - v) / (top - bot)) * Math.PI) * 0.035 * slack * (1 + 0.3 * Math.sin(t * 9));
        if (rattle > 0.01) { u += Math.sin(t * 90 + i * 1.7) * 0.004 * rattle; v += Math.sin(t * 77 + i) * 0.003 * rattle; }
        return <Box key={i} p={[u, v, 0.012]} s={[0.012, 0.012, 0.014]} c={dirty > 0.5 ? "#2e2a24" : "#5d6166"} m={0.9} r={0.35} e="#ffb257" ei={glow * 0.9 * (1 - dirty * 0.7)} rad={0.003} cast={false} />;
      })}
      {/* guía del tensor (se retira cuando la cadena se afloja) */}
      <Box p={[R1 + 0.02 - slack * 0.012, (top + bot) / 2, 0.012]} s={[0.012, 0.3, 0.02]} c="#2b2b2b" r={0.6} e="#ff4a3d" ei={slack * 1.2} rad={0.004} />
    </group>
  );
};

// chorro de aceite negro del cárter a la charola roja del piso
const OilStream: React.FC<{ t: number }> = ({ t }) => {
  if (t < EV.oil[0] || t > EV.oil[1] + 0.6) return null;
  const k = win(t, EV.oil[0], EV.oil[0] + 0.25) * (1 - win(t, EV.oil[1], EV.oil[1] + 0.5));
  const x = carX(t) - 1.42, y0 = liftAt(t) + 0.15, y1 = 0.12, h = Math.max(0.01, y0 - y1);
  return (
    <group>
      <mesh position={[x + 0.12, y1 + h / 2, 0.05]}><cylinderGeometry args={[0.012 * k, 0.018 * k, h, 12]} /><meshStandardMaterial color="#070504" roughness={0.05} metalness={0.3} /></mesh>
      {Array.from({ length: 10 }, (_, i) => { const u = ((t * 2.2 + i / 10) % 1); return <mesh key={i} position={[x + 0.12, y0 - u * h, 0.05]}><sphereGeometry args={[0.022 * k, 10, 8]} /><meshStandardMaterial color="#0a0705" roughness={0.04} metalness={0.4} /></mesh>; })}
    </group>
  );
};

// ---------------- EL TALLER ----------------
const Shop: React.FC<{ t: number; tx: ReturnType<typeof useTextures> }> = ({ t, tx }) => {
  return (
    <group>
      {/* piso de concreto con manchas de aceite */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[22, 16]} /><meshStandardMaterial color="#8a8987" roughness={0.88} map={tx.concrete} /></mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, rnd(i, 3) * 6]} position={[-6 + rnd(i, 1) * 12, 0.003, -4 + rnd(i, 2) * 8]}><circleGeometry args={[0.25 + rnd(i, 4) * 0.6, 24]} /><meshStandardMaterial color="#1b1712" roughness={0.25} transparent opacity={0.45} depthWrite={false} /></mesh>
      ))}
      {/* paredes de block */}
      <mesh position={[0, 2.2, -5]} receiveShadow><planeGeometry args={[22, 4.4]} /><meshStandardMaterial color="#b3b2ad" roughness={0.95} map={tx.block} /></mesh>
      <mesh position={[-8, 2.2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[16, 4.4]} /><meshStandardMaterial color="#aaa9a4" roughness={0.95} map={tx.block} /></mesh>
      {/* pared derecha con el portón abierto a la calle (sol) */}
      <mesh position={[8, 3.9, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[16, 1.0]} /><meshStandardMaterial color="#a5a49f" roughness={0.95} map={tx.block} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[8, 1.7, sd * 5.2]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[5.6, 3.4]} /><meshStandardMaterial color="#a5a49f" roughness={0.95} map={tx.block} /></mesh>)}
      <mesh position={[8.6, 1.7, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[4.9, 3.4]} /><meshBasicMaterial color={t >= T1 && fx(t, "dusk", 1.2) > 0.3 ? "#ffc58a" : t >= T1 && fx(t, "cold") > 0.3 ? "#cfe1ff" : "#fff2d6"} toneMapped={false} /></mesh>
      {t >= T1 && <Shutter t={t} />}
      {/* cortina enrollada arriba del portón */}
      <Cyl p={[7.9, 3.48, 0]} R={0.16} h={4.9} rot={[Math.PI / 2, 0, 0]} c="#7d8288" m={0.6} r={0.5} />
      {/* techo y tubos fluorescentes */}
      <mesh position={[0, 4.4, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[22, 16]} /><meshStandardMaterial color="#56585a" roughness={1} /></mesh>
      {/* bajada de luz: un tubo de pared como el del avatar */}
      <Box p={[-3, 3.4, -4.92]} s={[1.5, 0.06, 0.06]} c="#ffffff" e="#ffffff" ei={2} rad={0.02} cast={false} />
      {/* llantas apiladas */}
      {[[-6.2, -3.8], [-5.4, -4.1], [-6.6, -2.6]].map(([lx, lz], j) => Array.from({ length: 4 + j }, (_, k) => (
        <mesh key={j + "_" + k} position={[lx, 0.12 + k * 0.22, lz]} rotation={[Math.PI / 2, 0, rnd(k, j) * 2]} castShadow receiveShadow><torusGeometry args={[0.3, 0.11, 14, 32]} /><meshStandardMaterial color="#151515" roughness={0.93} /></mesh>
      )))}
      {/* carrito de herramientas azul */}
      <group position={[-2.9, 0, -3.7]} rotation={[0, 0.3, 0]}>
        {[0.25, 0.6, 0.95].map((y, i) => <Box key={i} p={[0, y, 0]} s={[1.2, 0.05, 0.6]} c="#1f4fa8" m={0.4} r={0.45} rad={0.02} />)}
        {[[-0.58, -0.28], [0.58, -0.28], [-0.58, 0.28], [0.58, 0.28]].map(([a, b], i) => <Box key={"l" + i} p={[a, 0.5, b]} s={[0.04, 0.95, 0.04]} c="#1a438f" m={0.4} r={0.5} rad={0.01} />)}
        {Array.from({ length: 9 }, (_, i) => <Box key={"h" + i} p={[-0.45 + i * 0.11, 1.0, -0.05 + rnd(i, 7) * 0.1]} s={[0.05, 0.04, 0.22]} c="#c2c5c9" m={0.9} r={0.3} rad={0.01} />)}
        <Box p={[0.3, 0.68, 0.05]} s={[0.25, 0.14, 0.18]} c="#c62828" r={0.6} rad={0.02} />
      </group>
      {/* banco de trabajo con tornillo de banco, a lo largo de la pared */}
      <Box p={[2.2, 0.9, -4.6]} s={[3.2, 0.08, 0.7]} c="#5a4632" r={0.8} rad={0.02} />
      {[0.8, 3.6].map((bx) => <Box key={bx} p={[bx, 0.45, -4.6]} s={[0.08, 0.9, 0.6]} c="#3a3c40" m={0.5} r={0.6} rad={0.01} />)}
      <Box p={[1.2, 1.02, -4.5]} s={[0.24, 0.16, 0.14]} c="#2f5c8f" m={0.5} r={0.5} rad={0.02} />
      {/* tablero de herramientas */}
      <Box p={[2.2, 2.1, -4.96]} s={[2.6, 1.1, 0.04]} c="#6a6f66" r={0.9} rad={0.01} />
      {Array.from({ length: 14 }, (_, i) => <Box key={"tb" + i} p={[1.1 + (i % 7) * 0.36, 1.85 + Math.floor(i / 7) * 0.5, -4.92]} s={[0.05, 0.3 + rnd(i, 2) * 0.12, 0.03]} c="#b9bcc0" m={0.85} r={0.35} rad={0.01} />)}
      {/* bidón y charola roja de aceite junto al elevador */}
      <Cyl p={[-1.3, 0.05, 0.05]} R={0.2} h={0.08} r2={0.23} c="#8e231c" r={0.6} />
      <Cyl p={[3.6, 0.45, -3.9]} R={0.29} h={0.9} c="#2a6b3a" r={0.6} m={0.2} />
      {/* elevador de dos postes (azul) */}
      <Lift t={t} />
    </group>
  );
};

const Lift: React.FC<{ t: number }> = ({ t }) => {
  const ly = liftAt(t);
  return (
    <group>
      {[-1, 1].map((sd) => (
        <group key={sd} position={[0.1, 0, sd * 1.32]}>
          <Box p={[0, 1.6, 0]} s={[0.26, 3.2, 0.3]} c="#1d4fb8" m={0.35} r={0.45} rad={0.03} />
          <Box p={[0, 0.03, 0]} s={[0.6, 0.06, 0.6]} c="#2b2d30" m={0.5} r={0.6} rad={0.02} />
          {/* carro del elevador y brazos que suben con el auto */}
          <Box p={[0, 0.32 + ly, -sd * 0.18]} s={[0.3, 0.3, 0.1]} c="#2a2b2e" m={0.5} r={0.5} rad={0.02} />
          {[-0.75, 0.85].map((ax) => <Box key={ax} p={[ax / 2, 0.2 + ly, -sd * 0.45]} s={[Math.abs(ax), 0.06, 0.08]} rot={[0, sd * (ax < 0 ? 0.35 : -0.35), 0]} c="#2f3236" m={0.6} r={0.45} rad={0.015} />)}
        </group>
      ))}
      <Box p={[0.1, 3.25, 0]} s={[0.2, 0.12, 2.9]} c="#1d4fb8" m={0.35} r={0.45} rad={0.03} />
    </group>
  );
};

// ---------------- LUCES (sala ↔ taller) ----------------
const Lights: React.FC<{ t: number }> = ({ t }) => {
  const show = t < 25 ? win(t, EV.show[0] - 0.3, EV.show[0] + 0.4) : 0;
  // los tubos se encienden titilando
  const dt = t - EV.lights;
  const tube = t < 25 ? 0 : dt < 0 ? 0 : dt < 0.55 ? (Math.sin(dt * 71) > 0.1 ? 1 : 0.15) * cl(dt * 3 + 0.3) : 1;
  const heat = t >= T1 ? fx(t, "heat", 0.8) : 0, cold = t >= T1 ? fx(t, "cold", 0.6) : 0, dusk = t >= T1 ? fx(t, "dusk", 1.2) : 0;
  const shut = t >= T1 ? fx(t, "shutter", 0.2) * ease((t - fx0(t, "shutter")) / 1.4) : 0;
  const sun = (t < 25 ? 0.15 : 0.35 + 0.65 * cl(dt * 2 + 1)) * (1 + 0.5 * heat - 0.6 * cold) * (1 - 0.92 * shut);
  return (
    <>
      <hemisphereLight args={["#dfe6ee", "#3a3632", 0.12 + 0.45 * tube]} />
      <ambientLight intensity={0.05 + 0.1 * tube} />
      {/* cenital de exhibición */}
      {show > 0.01 && <spotLight position={[0.3, 5.2, 1.2]} angle={0.42} penumbra={0.8} intensity={260 * show} distance={14} decay={2} color="#f4f8ff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} target-position={[-0.3, 0.6, 0]} />}
      {show > 0.01 && <spotLight position={[-5, 2.4, 4]} angle={0.5} penumbra={1} intensity={60 * show} distance={14} decay={2} color="#9cc7ff" />}
      {/* tubos del taller */}
      {tube > 0.01 && [[-2.5, 2.2], [1.5, 2.2], [-2.5, -1.8], [1.5, -1.8]].map(([x, z], i) => (
        <group key={i}>
          <Box p={[x, 4.3, z]} s={[1.6, 0.06, 0.1]} c="#ffffff" e="#ffffff" ei={3 * tube} rad={0.02} cast={false} />
          <pointLight position={[x, 3.9, z]} intensity={18 * tube} distance={10} decay={2} color="#eef4ff" />
        </group>
      ))}
      {tube > 0.01 && <spotLight position={[0.4, 4.2, 0.6]} angle={0.75} penumbra={0.9} intensity={70 * tube} distance={12} decay={2} color="#f2f6ff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />}
      {/* sol de la calle entrando por el portón */}
      {cold > 0.01 && <hemisphereLight args={["#7fb2ff", "#1b2a44", 0.9 * cold]} />}
      {heat > 0.01 && <pointLight position={[7.5, 1.6, 0]} intensity={30 * heat} distance={12} decay={2} color="#ff9a3c" />}
      <directionalLight position={dusk > 0.01 ? [16, 2.6, 4] : [16, 7, 3]} intensity={3.2 * sun * (1 - 0.25 * dusk)} color={dusk > 0.5 ? "#ffa860" : cold > 0.5 ? "#bcd6ff" : "#ffe2b8"} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* lámpara de trabajo colgada del cofre (cálida) */}
      {t > EV.hood[1] && <pointLight position={[-1.4, 1.55 + liftAt(t), 0.4]} intensity={0.7} distance={2.2} decay={2} color="#fff4e0" />}
      {/* el turbo al rojo ilumina el vano */}
      {fx(t, "hot") > 0.01 && <pointLight position={[-1.0, 0.75 + liftAt(t), -0.2]} intensity={1.6 * fx(t, "hot")} distance={1.4} decay={2} color="#ff6a2a" />}
    </>
  );
};

// sala de exhibición: estudio negro con tiras de luz horizontales altas (las verticales parecían antenas sobre el techo) (sin taller)
const Studio: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[40, 40]} /><meshStandardMaterial color="#060708" roughness={0.3} metalness={0.4} /></mesh>
    <mesh position={[0, 4, -7]}><planeGeometry args={[40, 10]} /><meshStandardMaterial color="#08090b" roughness={1} /></mesh>
    {[[-5, 3.9], [5, 3.9], [-5, 3.5], [5, 3.5]].map(([sx, sy], i) => <mesh key={i} position={[sx, sy, -6.9]}><boxGeometry args={[4.2, 0.07, 0.05]} /><meshBasicMaterial color="#cfe3ff" toneMapped={false} /></mesh>)}
    <mesh position={[0, 4.6, 0]} rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[2.4, 2.55, 64]} /><meshBasicMaterial color="#e8f1ff" toneMapped={false} side={THREE.DoubleSide} /></mesh>
  </group>
);

export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures();
  const show = t < 25 ? win(t, EV.show[0] - 0.3, EV.show[0] + 0.4) : 0;
  return (
    <ThreeCanvas width={W} height={H} style={{ background: "#07080a" }} gl={{ antialias: true, powerPreference: "high-performance" }}>
      <Cam t={t} />
      <color attach="background" args={[show > 0.5 ? "#050608" : "#1a1b1d"]} />
      <fog attach="fog" args={[show > 0.5 ? "#050608" : "#2a2a2a", 9, 26]} />
      <Lights t={t} />
      {show < 0.5 ? <Shop t={t} tx={tx} /> : <Studio />}
      {/* piso de exhibición brillante (sólo en la sala) */}
      {show > 0.01 && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} receiveShadow><circleGeometry args={[4.2, 64]} /><meshStandardMaterial color="#0d0e10" roughness={0.18} metalness={0.6} transparent opacity={show * 0.92} /></mesh>}
      <Car t={t} />
      <OilStream t={t} />
      <Post bloom={show > 0.5 ? 0.7 : 0.55} threshold={0.85} exposure={show > 0.5 ? 1.05 : 1.0} env={show > 0.5 ? 0.55 : 0.32} />
    </ThreeCanvas>
  );
};
