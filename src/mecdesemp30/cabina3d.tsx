// mecdesemp · EL MUNDO: un sedán plateado de 2012 estacionado en una calle helada al amanecer. La cámara vive ADENTRO:
// el parabrisas empañado (shader: niebla que se abre desde abajo, el agujerito del tamaño de un plato, la mancha del
// trapo, la película grasosa del refrigerante), el tablero con LOS CONTROLES reales (ventilador, salida, temperatura,
// A/C con su lucecita, recirculación), los limpiaparabrisas que no sirven, la luneta y el auto de atrás con las luces.
// UNA escena y UNA cámara; eventos clavados a la voz con at(). Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { at } from "./at";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];

// ---------------- tiempos de la voz (minuto 1) ----------------
export const T = {
  capo: at("no ves el capo"), limpia: at("limpia parabrisas"), nosirve: at("no sirve de nada"),
  mancha: at("una mancha gris"), atras: at("y el de atras"), bocina: at("la bocina"), casi: at("lo que hacen casi"),
  calef: at("calefaccion al maximo"), recirc: at("con la recirculacion"), esperar: at("y esperar"),
  agujero: at("mirando por un agujerito"), plato: at("tamano de un plato"), hay: at("hay un boton"), tablero: at("esta en tu tablero"),
  orden: at("orden exacto"), otro: at("en otro orden"), errores: at("los cinco errores"), trapo: at("mi maestro la noche"), senal: at("una senal en el vidrio"),
  nada: at("nada que ver"), taller: at("ir al taller"), dinero: at("mas dinero"),
};

// ---------------- geometría del auto (frente hacia -z, conductor a la izquierda) ----------------
const WS = { p: [0, 1.185, -0.6] as V3, rx: 0.75, w: 1.36, h: 0.64 }; // parabrisas
const RW = { p: [0, 1.17, 1.6] as V3, rx: -0.85, w: 1.2, h: 0.5 };    // luneta
const PANEL = { p: [0, 0.79, -0.47] as V3, rx: -0.38 };               // consola del aire (cara hacia el conductor)
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
const onPlane = (pl: { p: V3; rx: number }, x: number, y: number, z = 0): V3 => {
  const c = Math.cos(pl.rx), s = Math.sin(pl.rx);
  return [pl.p[0] + x, pl.p[1] + y * c - z * s, pl.p[2] + y * s + z * c];
};
// un punto del parabrisas en coordenadas uv (0..1, desde adentro: u izquierda→derecha, v abajo→arriba)
export const wsPt = (u: number, v: number): V3 => onPlane(WS, (u - 0.5) * WS.w, (v - 0.5) * WS.h, 0.01);
// controles del panel (coordenadas locales del panel)
const CTRL = { fan: [-0.1, -0.03], mode: [0, -0.03], temp: [0.1, -0.03], ac: [-0.05, 0.065], rec: [0.05, 0.065] } as const;
export const ctrlPt = (k: keyof typeof CTRL): V3 => onPlane(PANEL, CTRL[k][0], CTRL[k][1], 0.03);

export const PT = {
  glass: wsPt(0.5, 0.55), smear: wsPt(0.3, 0.45), hole: wsPt(0.25, 0.3), film: wsPt(0.62, 0.55),
  wiper: wsPt(0.35, 0.12), rear: [0, 1.15, 1.6] as V3, lights: [0, 0.72, 4.6] as V3,
  fan: ctrlPt("fan"), mode: ctrlPt("mode"), temp: ctrlPt("temp"), ac: ctrlPt("ac"), rec: ctrlPt("rec"),
};
export const HOLE_UV: [number, number] = [0.25, 0.3];

// ---------------- CÁMARA (maqueta: el auto cortado se ve desde afuera; el corte deja ver adentro) ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const tW = T.orden - 0.9;
export const KEYS: Key[] = [
  // S1 · la mancha en el vidrio (vista por el corte del lado derecho) → gira hacia el de atrás que toca bocina
  { t: T.mancha - 2.0, p: [1.75, 1.8, -0.15], l: [-0.15, 1.05, -0.5], fov: 37 },
  { t: T.atras, p: [1.55, 1.72, 0.1], l: [-0.12, 1.07, -0.45], fov: 34 },
  { t: T.atras + 1.4, p: [1.7, 1.65, 1.5], l: [0, 0.9, 3.4], fov: 42, arc: 0.05 },
  { t: T.casi + 0.4, p: [1.62, 1.62, 1.75], l: [0, 0.9, 3.6], fov: 40 },
  // S2 · desde adelante del capó: el agujerito del tamaño de un plato → sube por el techo cortado y baja al botón
  { t: T.agujero - 1.6, p: [-0.5, 1.32, -2.7], l: [-0.32, 1.1, -0.6], fov: 31 },
  { t: T.hay - 0.1, p: [-0.42, 1.26, -2.25], l: [-0.3, 1.08, -0.6], fov: 29 },
  { t: T.hay + 1.3, p: [0.55, 1.95, 0.35], l: [0, 0.86, -0.45], fov: 38, arc: 0.06 },
  { t: T.tablero + 1.0, p: [0.16, 1.06, -0.1], l: [-0.045, 0.85, -0.46], fov: 30 },
  // S3 · el panel entero (el orden 1-5) → se abre para ver el vidrio que se vuelve a empañar
  { t: tW, p: [0.42, 1.25, 0.22], l: [0, 0.8, -0.47], fov: 31 },
  { t: T.otro + 1.0, p: [0.38, 1.22, 0.16], l: [0, 0.8, -0.47], fov: 30 },
  { t: T.errores, p: [1.45, 1.85, -0.25], l: [0, 1.1, -0.55], fov: 38, arc: 0.04 },
  { t: T.errores + 4.2, p: [1.2, 1.65, -1.65], l: [0, 1.1, -0.6], fov: 36 },
];
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  return { p, l, fov: lerp(a.fov ?? 50, b.fov ?? 50, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.005, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.005; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- texturas ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useCarTex = () => useMemo(() => {
  // niebla: a = densidad (con gotitas más transparentes), g = ruido para el borde irregular
  const fog = mk(1024, 512, (g) => {
    const im = g.createImageData(1024, 512);
    for (let y = 0; y < 512; y++) for (let x = 0; x < 1024; x++) {
      const n = 0.5 + 0.25 * Math.sin(x * 0.013 + Math.sin(y * 0.02) * 2) * Math.sin(y * 0.017 + x * 0.004) + 0.25 * (rnd(x * 7 + y * 1031, 2) - 0.5) * 0.6;
      const i = (y * 1024 + x) * 4; im.data[i] = 255; im.data[i + 1] = Math.round(255 * cl(n)); im.data[i + 2] = 255; im.data[i + 3] = Math.round(255 * (0.86 + 0.1 * n));
    }
    g.putImageData(im, 0, 0);
    for (let k = 0; k < 420; k++) { // gotitas finas: apenas más claras, borde brillante
      const x = rnd(k, 3) * 1024, y = rnd(k, 4) * 512, r = 0.8 + rnd(k, 5) * (y > 400 ? 2.6 : 1.6);
      g.globalCompositeOperation = "destination-out"; g.fillStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill();
      g.globalCompositeOperation = "source-over"; g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 0.8; g.beginPath(); g.arc(x, y, r, 3.6, 5.8); g.stroke();
    }
    for (let k = 0; k < 0; k++) { // (sin chorritos: parecían rayas)
      const x = rnd(k, 8) * 1024, y0 = 300 + rnd(k, 9) * 150;
      g.globalCompositeOperation = "destination-out"; g.strokeStyle = "rgba(0,0,0,.6)"; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y0); g.lineTo(x + 3, 512); g.stroke();
    }
    g.globalCompositeOperation = "source-over";
  });
  fog.colorSpace = THREE.NoColorSpace;
  // vetas del trapo/la mano: arcos grasosos
  const smear = mk(512, 256, (g) => {
    g.fillStyle = "#000"; g.fillRect(0, 0, 512, 256);
    for (let k = 0; k < 60; k++) {
      g.strokeStyle = `rgba(255,255,255,${0.35 + rnd(k, 1) * 0.6})`; g.lineWidth = 2 + rnd(k, 2) * 9;
      g.beginPath(); const cy = 40 + rnd(k, 3) * 180; g.ellipse(256 + (rnd(k, 4) - 0.5) * 200, cy, 140 + rnd(k, 5) * 160, 30 + rnd(k, 6) * 60, (rnd(k, 7) - 0.5) * 0.4, 3.3, 6.1); g.stroke();
    }
  });
  smear.colorSpace = THREE.NoColorSpace;
  const asphalt = mk(512, 512, (g) => {
    g.fillStyle = "#2e3034"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 6000; i++) { const v = 40 + rnd(i, 1) * 60; g.fillStyle = `rgba(${v},${v},${v + 4},.5)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
    for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(230,240,255,${0.15 + rnd(i, 4) * 0.35})`; g.fillRect(rnd(i, 5) * 512, rnd(i, 6) * 512, 1.5, 1.5); } // escarcha
  }, [14, 14]);
  const frost = mk(256, 256, (g) => {
    g.fillStyle = "#c4c8cd"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(250,252,255,${0.2 + rnd(i, 7) * 0.6})`; g.beginPath(); g.arc(rnd(i, 8) * 256, rnd(i, 9) * 256, 0.6 + rnd(i, 10) * 1.6, 0, 6.3); g.fill(); }
  }, [3, 2]);
  const fabric = mk(128, 128, (g) => {
    g.fillStyle = "#55595f"; g.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 128; y += 2) for (let x = 0; x < 128; x += 2) { const v = 70 + ((x + y) % 4 ? 10 : -6) + rnd(x * 128 + y, 1) * 14; g.fillStyle = `rgb(${v},${v + 3},${v + 8})`; g.fillRect(x, y, 2, 2); }
  }, [3, 3]);
  const plastic = mk(128, 128, (g) => {
    g.fillStyle = "#1b1c1e"; g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 700; i++) { const v = 22 + rnd(i, 3) * 16; g.fillStyle = `rgb(${v},${v},${v + 2})`; g.fillRect(rnd(i, 1) * 128, rnd(i, 2) * 128, 2, 2); }
  }, [4, 2]);
  // aro de temperatura azul → rojo
  const ring = mk(256, 256, (g) => {
    g.clearRect(0, 0, 256, 256);
    for (let a = 0; a < 60; a++) { const k = a / 59, ang = Math.PI * 0.75 + k * Math.PI * 1.5; g.strokeStyle = `rgb(${Math.round(40 + 215 * k)},${Math.round(120 - 60 * k)},${Math.round(255 - 215 * k)})`; g.lineWidth = 14; g.beginPath(); g.arc(128, 128, 104, ang, ang + 0.09); g.stroke(); }
  });
  const sky = mk(512, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#0d1830"); gr.addColorStop(0.42, "#2c3d62"); gr.addColorStop(0.5, "#7d6f7c"); gr.addColorStop(0.53, "#c98a5a"); gr.addColorStop(0.56, "#2a2c33"); gr.addColorStop(1, "#15171b");
    g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  });
  return { fog, smear, asphalt, frost, fabric, plastic, ring, sky };
}, []);

// ---------------- la NIEBLA del vidrio (shader) ----------------
const FOG_VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const FOG_FS = `
uniform sampler2D uTex; uniform sampler2D uSm; uniform float uFog, uClear, uSmear, uFilm, uLum, uAsp; uniform vec3 uHole; uniform vec2 uSmC;
varying vec2 vUv;
void main(){
  vec4 f = texture2D(uTex, vUv);
  float n = f.g;
  float edge = uClear * 1.3 - 0.12;                                   // se abre desde abajo, como una cortina que sube
  float m = smoothstep(edge - 0.1, edge + 0.02, vUv.y + (n - 0.5) * 0.12);
  vec2 d = (vUv - uHole.xy) * vec2(uAsp, 1.0);
  float h = uHole.z < 0.001 ? 1.0 : smoothstep(uHole.z * 0.72, uHole.z * 1.06, length(d) + (n - 0.5) * 0.035);
  float a = uFog * f.a * m * h;
  vec2 sd = (vUv - uSmC) * vec2(uAsp, 1.0) / vec2(0.36, 0.22);
  float reg = 1.0 - smoothstep(0.65, 1.0, length(sd));
  float st = texture2D(uSm, vUv * vec2(2.2, 1.4)).r;
  a = mix(a, a * (0.22 + 0.7 * st), uSmear * reg);
  vec3 col = vec3(0.80, 0.85, 0.92) * uLum * (0.86 + 0.28 * n);
  col = mix(col, col * vec3(0.92, 0.86, 0.74), uSmear * reg * st * 0.7);
  float fl = uFilm * (0.5 + 0.5 * sin(vUv.x * 38.0 + vUv.y * 21.0 + n * 9.0));
  vec3 rb = 0.5 + 0.5 * cos(6.283 * (vec3(0.0, 0.33, 0.67) + vUv.x * 2.0 + n * 1.5));
  col = mix(col, rb * uLum * 1.15, fl * 0.55);
  a = max(a, uFilm * 0.36 * (0.4 + 0.6 * fl));
  gl_FragColor = vec4(col, a);
}`;
type FogU = { fog: number; clear: number; hole: [number, number, number]; smear: number; film: number; lum: number; smc?: [number, number] };
const FogGlass: React.FC<{ tex: ReturnType<typeof useCarTex>; w: number; h: number; u: FogU }> = ({ tex, w, h, u }) => {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: FOG_VS, fragmentShader: FOG_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: { uTex: { value: tex.fog }, uSm: { value: tex.smear }, uFog: { value: 1 }, uClear: { value: 0 }, uSmear: { value: 0 }, uFilm: { value: 0 }, uLum: { value: 0.6 }, uAsp: { value: w / h }, uHole: { value: new THREE.Vector3() }, uSmC: { value: new THREE.Vector2(0.3, 0.45) } },
  }), [tex, w, h]);
  mat.uniforms.uFog.value = u.fog; mat.uniforms.uClear.value = u.clear; mat.uniforms.uSmear.value = u.smear; mat.uniforms.uFilm.value = u.film; mat.uniforms.uLum.value = u.lum;
  (mat.uniforms.uHole.value as THREE.Vector3).set(u.hole[0], u.hole[1], u.hole[2]);
  if (u.smc) (mat.uniforms.uSmC.value as THREE.Vector2).set(u.smc[0], u.smc[1]);
  return <mesh material={mat} renderOrder={5}><planeGeometry args={[w, h]} /></mesh>;
};

// estado del vidrio por segundo (minuto 1)
const fogAt = (t: number): FogU => {
  const smear = t < T.mancha - 0.4 ? 0 : t < T.casi ? win(t, T.mancha - 0.3, T.mancha + 1.2) : t > T.trapo - 0.4 && t < T.senal + 9 ? win(t, T.trapo - 0.3, T.trapo + 1.4) : 0;
  const clear = t > T.orden - 1.2 && t < T.errores + 3.5 ? 1 - win(t, T.errores - 0.2, T.errores + 3.2) : 0; // ya abierto (lo que mostró la toma) → se vuelve a cerrar
  const hole: [number, number, number] = t > T.agujero - 1.5 && t < T.hay + 1.2 ? [HOLE_UV[0], HOLE_UV[1], 0.115 * win(t, T.agujero - 1.4, T.agujero + 0.2)] : [0, 0, 0];
  const film = t > T.senal - 0.2 && t < T.dinero + 4 ? win(t, T.senal, T.senal + 1.1) : 0;
  return { fog: 1, clear, hole, smear, film, lum: 0.47 };
};

// ---------------- piezas ----------------
type BP = { p: V3; s: V3; c?: string; r?: number; m?: number; map?: THREE.Texture; rad?: number; e?: string; ei?: number; rot?: V3; cast?: boolean };
const Box: React.FC<BP> = ({ p, s, c = "#888", r = 0.6, m = 0, map, rad = 0.01, e, ei = 0, rot, cast = true }) => (
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow={cast} receiveShadow>
    <meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} />
  </mesh>
);
const PAINT = { color: "#b9bec4", metalness: 0.75, roughness: 0.32 };
const GLASS = { color: "#9fb4c8", transparent: true, opacity: 0.14, roughness: 0.05, metalness: 0.2 };

const Knob: React.FC<{ p: [number, number]; ang: number; ring?: THREE.Texture }> = ({ p, ang, ring }) => (
  <group position={[p[0], p[1], 0]}>
    {ring && <mesh position={[0, 0, 0.004]}><planeGeometry args={[0.085, 0.085]} /><meshBasicMaterial map={ring} transparent toneMapped={false} /></mesh>}
    <mesh position={[0, 0, 0.016]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.03, 0.032, 0.026, 32]} /><meshStandardMaterial color="#232427" roughness={0.45} /></mesh>
    <group rotation={[0, 0, ang]}><mesh position={[0, 0.017, 0.031]}><boxGeometry args={[0.005, 0.024, 0.004]} /><meshStandardMaterial color="#f2f2f2" emissive="#ffffff" emissiveIntensity={0.25} /></mesh></group>
  </group>
);
const Button: React.FC<{ p: [number, number]; led: number; col: string; icon: "ac" | "rec"; press?: number }> = ({ p, led, col, icon, press = 0 }) => (
  <group position={[p[0], p[1], -0.004 * press]}>
    <mesh position={[0, 0, 0.012]} geometry={rbox(0.07, 0.034, 0.02, 0.006)} castShadow><meshStandardMaterial color="#2a2b2e" roughness={0.5} /></mesh>
    {icon === "ac" ? (
      <group position={[-0.012, 0.002, 0.0225]}>{[0, 1, 2].map((i) => <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}><boxGeometry args={[0.018, 0.0022, 0.001]} /><meshBasicMaterial color="#e8eef5" /></mesh>)}</group>
    ) : (
      <group position={[-0.008, 0.002, 0.0225]}>
        <mesh><boxGeometry args={[0.02, 0.006, 0.001]} /><meshBasicMaterial color="#e8eef5" /></mesh>
        <mesh position={[0, 0.006, 0]}><torusGeometry args={[0.008, 0.0012, 6, 16, Math.PI * 1.4]} /><meshBasicMaterial color="#e8eef5" /></mesh>
      </group>
    )}
    <mesh position={[0.02, -0.009, 0.0225]}><boxGeometry args={[0.012, 0.004, 0.002]} /><meshStandardMaterial color={led > 0.05 ? col : "#3a3a3a"} emissive={col} emissiveIntensity={led * 6} toneMapped={false} /></mesh>
  </group>
);

const Wiper: React.FC<{ pivot: [number, number]; ang: number }> = ({ pivot, ang }) => (
  <group position={onPlane(WS, pivot[0], pivot[1], -0.025)} rotation={[WS.rx, 0, 0]}>
    <group rotation={[0, 0, ang]}>
      <mesh position={[0.27, 0, 0]} castShadow><boxGeometry args={[0.54, 0.012, 0.012]} /><meshStandardMaterial color="#111" roughness={0.6} /></mesh>
      <mesh position={[0.29, 0, -0.008]}><boxGeometry args={[0.5, 0.008, 0.006]} /><meshStandardMaterial color="#050505" roughness={0.9} /></mesh>
    </group>
  </group>
);

// vapor del aliento: bocanadas que suben y se pegan al vidrio
const Breath: React.FC<{ t: number; on: number }> = ({ t, on }) => on <= 0.01 ? null : (
  <>{Array.from({ length: 7 }, (_, i) => {
    const ph = ((t * 0.55 + i / 7) % 1);
    const p: V3 = [-0.36 + Math.sin(i * 2.1) * 0.03, 1.1 + ph * 0.12, 0.2 - ph * 0.45];
    return <mesh key={i} position={p}><sphereGeometry args={[0.03 + ph * 0.07, 16, 12]} /><meshStandardMaterial color="#eef3f8" transparent opacity={on * 0.13 * Math.sin(Math.PI * ph)} depthWrite={false} roughness={1} /></mesh>;
  })}</>
);

// el trapo que pasa en círculos sobre el vidrio (y empeora la mancha)
const Cloth: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  if (t < a - 0.3 || t > b + 0.3) return null;
  const k = (t - a) / (b - a), ang = k * Math.PI * 5;
  const u = 0.3 + Math.cos(ang) * 0.09, v = 0.47 + Math.sin(ang) * 0.1;
  const o = win(t, a - 0.3, a) * (1 - win(t, b, b + 0.3));
  return <mesh position={onPlane(WS, (u - 0.5) * WS.w, (v - 0.5) * WS.h, 0.03 - 0.02 * o)} rotation={[WS.rx, 0, ang * 0.3]} castShadow>
    <primitive object={rbox(0.2, 0.15, 0.025, 0.012)} attach="geometry" />
    <meshStandardMaterial color="#5d7590" roughness={0.98} />
  </mesh>;
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useCarTex();
  const f = fogAt(t);
  const tempK = t < T.calef - 0.2 ? 0.35 : t < T.orden ? win(t, T.calef - 0.1, T.calef + 0.7) : 1;
  const recLed = t > T.recirc && t < T.orden ? 1 : 0;
  const acLed = t > T.orden + 0.2 ? 1 : 0;
  const fanAng = t < T.calef ? 0.4 : t < T.orden ? -1.6 : -1.9;
  // los limpias: dos pasadas inútiles después de "prendes el limpiaparabrisas"
  const wp = t > T.limpia - 0.2 && t < T.limpia + 2.6 ? Math.sin(Math.PI * cl((t - T.limpia + 0.2) / 1.25) * 2) : 0;
  const wAng = 0.05 + Math.abs(wp) * 1.45;
  // el de atrás: luces que parpadean con la bocina
  const flash = t > T.atras && t < T.casi + 1 ? (Math.sin((t - T.atras) * 14) > 0 ? 1 : 0.35) : 0.35;
  const dawn = 0.55;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.55} threshold={0.8} exposure={0.92} env={0.28} />
      <color attach="background" args={["#141a26"]} />
      <mesh><sphereGeometry args={[80, 32, 16]} /><meshBasicMaterial map={tx.sky} side={THREE.BackSide} toneMapped={false} /></mesh>
      <hemisphereLight args={[0x8aa4d6, 0x22201e, 0.55 * dawn + 0.25]} />
      <directionalLight position={[-6, 9, -10]} intensity={0.9} color="#b8c9ef" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-bias={-0.0004} />
      {/* luz fría que entra por el parabrisas + brillito del tablero */}
      <spotLight position={[0, 2.2, -2.4]} angle={0.7} penumbra={1} intensity={3} distance={6} color="#cfdcf5" target-position={[0, 0.8, 0]} />
      <pointLight position={[-0.36, 1.02, -0.5]} intensity={0.25} distance={0.6} color="#ffb070" />
      <spotLight position={[0.7, 3.2, 0.7]} angle={0.45} penumbra={1} intensity={3.2} distance={6} color="#e6eefc" target-position={[0, 0.85, -0.35]} castShadow />

      {/* ===== LA CALLE helada ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial map={tx.asphalt} roughness={0.55} metalness={0.1} /></mesh>
      <Box p={[3.4, 0.08, -10]} s={[2.2, 0.16, 60]} c="#8e9298" r={0.9} map={tx.frost} />
      {Array.from({ length: 7 }, (_, i) => <Box key={"nv" + i} p={[2.35, 0.15, -2 - i * 5.5 + rnd(i, 2)]} s={[0.5, 0.3 + rnd(i, 3) * 0.2, 2.2 + rnd(i, 4)]} c="#e6ecf3" r={0.95} rad={0.12} />)}
      {[-5, -15, -25, 8].map((z, i) => (
        <group key={"fa" + i} position={[3.0, 0, z]}>
          <mesh position={[0, 2.3, 0]} castShadow><cylinderGeometry args={[0.05, 0.07, 4.6, 12]} /><meshStandardMaterial color="#2a2d31" roughness={0.6} metalness={0.5} /></mesh>
          <Box p={[-0.45, 4.55, 0]} s={[0.95, 0.08, 0.12]} c="#2a2d31" m={0.5} />
          <mesh position={[-0.85, 4.48, 0]}><sphereGeometry args={[0.12, 16, 12]} /><meshStandardMaterial color="#ffb45a" emissive="#ffa040" emissiveIntensity={5} toneMapped={false} /></mesh>
          {i < 2 && <pointLight position={[-0.85, 4.3, 0]} intensity={14} distance={12} color="#ffa95a" />}
        </group>
      ))}
      {/* casas con ventanas prendidas a lo lejos */}
      {Array.from({ length: 6 }, (_, i) => (
        <group key={"cs" + i} position={[6.5 + rnd(i, 1) * 2, 0, -6 - i * 7]}>
          <Box p={[0, 1.8, 0]} s={[4, 3.6, 5]} c={i % 2 ? "#5d5650" : "#4b4f57"} r={0.9} />
          {[0, 1].map((j) => <mesh key={j} position={[-2.01, 1.6 + j * 1.1 * (i % 2), -1 + j * 1.6]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.8, 0.7]} /><meshStandardMaterial color="#ffd9a0" emissive="#ffc070" emissiveIntensity={rnd(i * 3 + j, 6) > 0.4 ? 2.2 : 0.1} toneMapped={false} /></mesh>)}
        </group>
      ))}

      {/* ===== EL AUTO (plateado, 2012) ===== */}
      <Box p={[0, 0.5, 0.2]} s={[1.72, 0.5, 4.1]} {...{ c: PAINT.color, m: PAINT.metalness, r: PAINT.roughness }} rad={0.12} />
      <Box p={[0, 0.82, -1.33]} s={[1.64, 0.1, 1.0]} c={PAINT.color} m={0.6} r={0.4} map={tx.frost} rad={0.05} />
      <Box p={[0, 0.82, 1.95]} s={[1.6, 0.12, 0.6]} c={PAINT.color} m={0.6} r={0.4} map={tx.frost} rad={0.05} />
      {[[-0.78, -1.25], [0.78, -1.25], [-0.78, 1.55], [0.78, 1.55]].map(([x, z], i) => (
        <mesh key={"rd" + i} position={[x, 0.3, z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.2, 28]} /><meshStandardMaterial color="#141414" roughness={0.85} /></mesh>
      ))}
      {/* techo, parantes, marco del parabrisas */}
      {/* corte de maqueta: sin techo; el canto del corte en gris claro */}
      {[-1, 1].map((sx) => <Box key={"ct" + sx} p={[sx * 0.71, 1.465, 0.6]} s={[0.07, 0.012, 0.11]} c="#e9e4da" r={0.9} rad={0.004} />)}
      {[-1, 1].map((sx) => <Box key={"ap" + sx} p={onPlane(WS, sx * (WS.w / 2 + 0.03), 0, 0)} s={[0.07, WS.h + 0.08, 0.05]} rot={[WS.rx, 0, 0]} c="#2a2b2e" r={0.7} rad={0.015} />)}
      <Box p={[-0.71, 1.15, 0.6]} s={[0.06, 0.62, 0.1]} c="#3a3b3e" r={0.8} rad={0.015} />
      <Box p={onPlane(WS, 0, WS.h / 2 + 0.03, 0)} s={[WS.w + 0.1, 0.05, 0.06]} rot={[WS.rx, 0, 0]} c="#2a2b2e" r={0.8} rad={0.01} />
      {/* vidrios + niebla */}
      <group position={WS.p} rotation={[WS.rx, 0, 0]}>
        <mesh renderOrder={4}><planeGeometry args={[WS.w, WS.h]} /><meshPhysicalMaterial {...GLASS} depthWrite={false} /></mesh>
        <group position={[0, 0, 0.006]}><FogGlass tex={tx} w={WS.w} h={WS.h} u={f} /></group>
      </group>
      <group position={RW.p} rotation={[RW.rx, 0, 0]}>
        <mesh renderOrder={4}><planeGeometry args={[RW.w, RW.h]} /><meshPhysicalMaterial {...GLASS} depthWrite={false} /></mesh>
        <group position={[0, 0, -0.006]}><FogGlass tex={tx} w={RW.w} h={RW.h} u={{ fog: 0.92, clear: 0, hole: [0, 0, 0], smear: 0, film: 0, lum: 0.42 + 0.25 * flash }} /></group>
      </group>
      {[-1].map((sx) => (
        <group key={"sv" + sx} position={[sx * 0.74, 1.17, 0.12]} rotation={[0, sx * Math.PI / 2, 0.08 * sx]}>
          <mesh renderOrder={4}><planeGeometry args={[1.05, 0.44]} /><meshPhysicalMaterial {...GLASS} depthWrite={false} /></mesh>
          <group position={[0, 0, -0.006]}><FogGlass tex={tx} w={1.05} h={0.44} u={{ fog: 0.95, clear: 0, hole: [0, 0, 0], smear: 0, film: 0, lum: 0.44 }} /></group>
        </group>
      ))}
      <Wiper pivot={[-0.5, -WS.h / 2 + 0.03]} ang={wAng} />
      <Wiper pivot={[0.12, -WS.h / 2 + 0.03]} ang={wAng} />

      {/* ===== ADENTRO ===== */}
      <Box p={[0, 0.765, 0.25]} s={[1.48, 0.03, 3.3]} c="#26272a" r={0.97} map={tx.fabric} rad={0.01} />
      <Box p={[0, 0.84, -0.68]} s={[1.5, 0.22, 0.42]} c="#1d1e20" r={0.75} map={tx.plastic} rad={0.06} />
      <Box p={[0, 0.955, -0.78]} s={[1.46, 0.02, 0.2]} c="#151617" r={0.8} rad={0.008} />
      {/* rejillas del desempañador (al pie del vidrio) */}
      {[-0.45, -0.15, 0.15, 0.45].map((x) => <Box key={"dv" + x} p={[x, 0.968, -0.8]} s={[0.22, 0.006, 0.035]} c="#0b0b0c" r={0.9} rad={0.002} />)}
      {/* cuadro de instrumentos */}
      <Box p={[-0.36, 1.0, -0.6]} s={[0.46, 0.12, 0.2]} c="#18191b" r={0.7} rad={0.05} />
      {[-0.08, 0.08].map((x) => <mesh key={"dl" + x} position={[-0.36 + x, 0.985, -0.495]}><circleGeometry args={[0.055, 32]} /><meshStandardMaterial color="#0d0f12" emissive="#ff9a3c" emissiveIntensity={0.02} /></mesh>)}
      {/* volante */}
      <group position={[-0.36, 1.0, -0.32]} rotation={[-0.35, 0, 0]}>
        <mesh castShadow><torusGeometry args={[0.185, 0.02, 14, 48]} /><meshStandardMaterial color="#141416" roughness={0.6} /></mesh>
        <Box p={[0, 0, 0]} s={[0.12, 0.09, 0.04]} c="#1c1d20" r={0.6} rad={0.02} />
        <mesh><boxGeometry args={[0.34, 0.025, 0.015]} /><meshStandardMaterial color="#1c1d20" /></mesh>
        <mesh position={[0, 0, -0.14]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.035, 0.26, 16]} /><meshStandardMaterial color="#141416" /></mesh>
      </group>
      {/* espejo retrovisor */}
      <Box p={[0, 1.36, -0.4]} s={[0.25, 0.07, 0.03]} c="#18191b" r={0.6} rad={0.012} />
      <mesh position={[0, 1.36, -0.384]}><planeGeometry args={[0.23, 0.055]} /><meshStandardMaterial color="#b9c4d2" metalness={1} roughness={0.08} emissive="#fff3d8" emissiveIntensity={0.6 * flash * (t > T.atras && t < T.casi + 1 ? 1 : 0)} /></mesh>
      {/* consola del aire: el panel con los 3 perillas y los 2 botones */}
      <Box p={[0, 0.66, -0.36]} s={[0.36, 0.06, 0.6]} c="#1b1c1e" r={0.7} map={tx.plastic} rad={0.02} />
      <group position={PANEL.p} rotation={[PANEL.rx, 0, 0]}>
        <mesh geometry={rbox(0.34, 0.2, 0.02, 0.012)} receiveShadow><meshStandardMaterial color="#202124" roughness={0.65} map={tx.plastic} /></mesh>
        <Knob p={CTRL.fan as unknown as [number, number]} ang={fanAng} />
        <Knob p={CTRL.mode as unknown as [number, number]} ang={t > T.orden ? -2.2 : 0} />
        <Knob p={CTRL.temp as unknown as [number, number]} ang={2.35 - 4.7 * tempK} ring={tx.ring} />
        <Button p={CTRL.ac as unknown as [number, number]} led={acLed} col="#4dff7a" icon="ac" />
        <Button p={CTRL.rec as unknown as [number, number]} led={recLed} col="#ffb02e" icon="rec" />
      </group>
      {/* asientos de tela gris */}
      {[-0.36, 0.36].map((x) => (
        <group key={"as" + x}>
          <Box p={[x, 0.52, 0.55]} s={[0.5, 0.13, 0.52]} c="#6a6e74" r={0.95} map={tx.fabric} rad={0.05} />
          <Box p={[x, 0.92, 0.84]} s={[0.5, 0.72, 0.13]} rot={[-0.18, 0, 0]} c="#6a6e74" r={0.95} map={tx.fabric} rad={0.06} />
          <Box p={[x, 1.36, 0.92]} s={[0.26, 0.16, 0.1]} rot={[-0.1, 0, 0]} c="#6a6e74" r={0.95} map={tx.fabric} rad={0.04} />
        </group>
      ))}
      <Box p={[0, 0.62, 1.5]} s={[1.3, 0.16, 0.5]} c="#6a6e74" r={0.95} map={tx.fabric} rad={0.05} />
      {[-1].map((sx) => <Box key={"pt" + sx} p={[sx * 0.76, 0.66, 0.3]} s={[0.05, 0.56, 2.0]} c="#2b2c2f" r={0.8} map={tx.plastic} rad={0.02} />)}
      
      <Cloth t={t} a={T.trapo - 0.2} b={T.senal - 0.1} />

      {/* ===== EL DE ATRÁS (con las luces encima) ===== */}
      <group position={[0.1, 0, 6.2]}>
        <Box p={[0, 0.55, 0]} s={[1.75, 0.6, 4.0]} c="#2c3540" m={0.6} r={0.35} rad={0.12} />
        <Box p={[0, 1.05, 0.4]} s={[1.45, 0.45, 1.9]} c="#2c3540" m={0.6} r={0.35} rad={0.1} />
        {[-0.58, 0.58].map((x) => <mesh key={"hl" + x} position={[x, 0.66, -2.01]}><circleGeometry args={[0.12, 24]} /><meshStandardMaterial color="#fff" emissive="#fff4dc" emissiveIntensity={8 * flash} toneMapped={false} side={THREE.DoubleSide} /></mesh>)}
        <spotLight position={[0, 0.7, -2.1]} angle={0.6} penumbra={0.7} intensity={18 * flash} distance={9} color="#fff1d6" target-position={[0, 0.8, -6]} />
      </group>
    </ThreeCanvas>
  );
};
void Breath;
