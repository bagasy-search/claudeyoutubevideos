// cermarcas · EL MUNDO: una cuadra de barrio de noche y LA CASA de la señora, vista como la mira el ladrón.
// Una sola escena y una sola cámara. Dos ojos: el normal (farol, luz del porche) y el TÉRMICO del ladrón
// (pase de posproceso: luminancia → paleta hierro, las MARCAS arden blanco). Las 7 marcas viven en la casa:
// plástico en el marco, cinta en la cerradura, tiza en la pared, volante en el picaporte, precinto en el portón,
// moneda arriba del marco y la que dejas tú (diarios + buzón lleno). El PORTAL es el ojo de la cerradura:
// del otro lado, el recibidor de la casa con la mesita, la lámpara y LA GUÍA (páginas REALES del PDF).
// Eventos clavados a la voz (segundos globales que salen de words.json). Render SÓLO en el farm.
import React, { useEffect, useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useTextures, rbox } from "./fx3d";
import { P } from "./lib";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
export type V3 = [number, number, number];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

// ---------------- puntos del mundo (metros; la fachada en z = 0, la calle hacia +z) ----------------
export const HX = 40; // el recibidor (del otro lado de la cerradura) vive lejos, en x = 40
export const PT = {
  door: [0, 1.0, 0.05] as V3,
  lock: [0.34, 1.07, 0.075] as V3,          // el ojo de la cerradura (cilindro del cerrojo)
  knob: [0.34, 0.93, 0.09] as V3,
  plast: [0.47, 0.5, 0.07] as V3,           // 1 · plástico en el marco, a la altura de la rodilla
  cinta: [0.47, 1.07, 0.07] as V3,          // 2 · cinta sobre la ranura, al lado del cerrojo
  tiza: [0.95, 1.35, 0.012] as V3,          // 3 · tiza en la pared, al lado del marco
  volante: [0.34, 0.8, 0.1] as V3,          // 4 · volante colgado del picaporte
  precinto: [1.05, 0.82, 4.02] as V3,       // 5 · precinto en el portón
  moneda: [0.15, 2.115, 0.07] as V3,        // 6 · moneda arriba del marco
  diarios: [-0.55, 0.05, 3.1] as V3,        // 7 · los diarios tirados en el camino
  buzon: [-2.2, 1.12, 4.25] as V3,          //     y el buzón que rebalsa
  vecino: [-10.0, 1.07, 0.075] as V3,       // la cerradura del vecino (también con cinta)
  book: [HX + 0.18, 0.835, -0.02] as V3,
};
export const MARKS = ["plast", "cinta", "tiza", "volante", "precinto", "moneda", "diarios"] as const;
export type MarkId = typeof MARKS[number];

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
export const KEYS: Key[] = [
  // C · "en el marco de tu puerta, a la altura de la rodilla": de la vereda al marco
  { t: 8.0, p: [0.9, 1.55, 7.2], l: [0.1, 1.0, 0], fov: 40 },
  { t: 10.4, p: [0.15, 0.85, 2.0], l: [0.42, 0.55, 0], fov: 34 },
  { t: 12.9, p: [0.22, 0.58, 0.62], l: [0.46, 0.5, 0.06], fov: 28 },
  { t: 17.5, p: [0.3, 0.54, 0.42], l: [0.46, 0.5, 0.07], fov: 24 },
  // F · térmica: "el hombre que lo puso" — desde la vereda de enfrente, el ladrón pasa
  { t: 22.2, p: [-3.2, 1.7, 12.6], l: [0.0, 1.1, 1.0], fov: 36 },
  { t: 25.6, p: [-2.2, 1.5, 11.0], l: [0.3, 1.0, 1.0], fov: 32 },
  // J · térmica: la puerta se abre, el plástico se cae
  { t: 38.7, p: [1.9, 1.3, 3.8], l: [0.1, 0.95, 0], fov: 38 },
  { t: 44.9, p: [1.4, 1.15, 3.0], l: [0.2, 0.85, 0], fov: 36 },
  // M · térmica: la fachada entera; las marcas se encienden una por una
  { t: 57.2, p: [0.2, 1.75, 8.6], l: [0, 1.1, 0], fov: 42 },
  { t: 65.2, p: [0.5, 1.35, 4.4], l: [0.3, 1.05, 0], fov: 40 },
  // N · "son siete señales": se eleva y se ven las siete
  { t: 66.4, p: [3.2, 4.4, 11.5], l: [0, 0.8, 1.6], fov: 44, arc: 0.15 },
  { t: 69.2, p: [2.6, 4.0, 10.6], l: [0, 0.8, 1.6], fov: 44 },
  // P · "la dejas tú": los diarios y el buzón
  { t: 75.2, p: [1.6, 1.5, 7.4], l: [-1.2, 0.6, 3.6], fov: 40 },
  { t: 79.6, p: [-0.6, 0.95, 5.8], l: [-1.4, 0.55, 3.7], fov: 36 },
  { t: 81.3, p: [-0.7, 1.0, 5.9], l: [-1.4, 0.6, 3.7], fov: 36 },
  // Q · al ojo de la cerradura
  { t: 82.9, p: [0.9, 1.25, 1.6], l: [0.34, 1.07, 0], fov: 34, arc: 0.05 },
  { t: 83.9, p: [0.36, 1.072, 0.32], l: [0.34, 1.07, 0], fov: 30 },
  { t: 84.3, p: [0.343, 1.0705, 0.13], l: [0.34, 1.07, 0], fov: 24 },
  // R/S · EL RECIBIDOR: la mesita con la guía (corte por la cerradura)
  { t: 84.31, p: [HX + 0.1, 1.62, 2.6], l: [HX + 0.1, 0.95, 0], fov: 40 },
  { t: 88.9, p: [HX + 0.55, 1.4, 1.35], l: [HX + 0.05, 0.88, 0], fov: 38 },
  { t: 91.4, p: [HX + 0.35, 1.32, 0.95], l: [HX + 0.12, 0.84, 0], fov: 36 },
  // "libro 1, página 61": baja sobre la página
  { t: 93.2, p: [HX + 0.2, 1.36, 0.42], l: [HX + 0.19, 0.84, 0.0], fov: 34 },
  { t: 101.8, p: [HX + 0.19, 1.3, 0.38], l: [HX + 0.19, 0.84, 0.02], fov: 32 },
  // T · "el link": se aleja un poco (el avatar y la descripción encima)
  { t: 102.6, p: [HX - 0.25, 1.45, 1.4], l: [HX + 0.1, 0.9, 0], fov: 40 },
  { t: 107.9, p: [HX - 0.3, 1.45, 1.5], l: [HX + 0.1, 0.9, 0], fov: 40 },
  // U · "vamos a la puerta": de nuevo afuera, frente a la puerta (corte por la cerradura al revés)
  { t: 108.4, p: [0.343, 1.0705, 0.13], l: [0.34, 1.07, 0], fov: 24 },
  { t: 110.3, p: [1.1, 1.2, 2.4], l: [0.2, 0.95, 0], fov: 38 },
  { t: 112, p: [1.0, 1.15, 2.2], l: [0.2, 0.95, 0], fov: 38 },
];
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.005, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  if (a.p.distanceTo(b.p) > 3) return { bx: 0, by: 0 }; // corte por la cerradura: no es velocidad
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

// ---------------- posproceso con OJO TÉRMICO ----------------
const ThermalShader = {
  uniforms: { tDiffuse: { value: null }, amt: { value: 0 }, time: { value: 0 } },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float amt; uniform float time; varying vec2 vUv;
    vec3 iron(float x){
      vec3 c0=vec3(0.03,0.0,0.10), c1=vec3(0.30,0.02,0.52), c2=vec3(0.78,0.08,0.38), c3=vec3(0.98,0.42,0.06), c4=vec3(1.0,0.82,0.18), c5=vec3(1.0,1.0,0.92);
      if(x<0.2) return mix(c0,c1,x/0.2); if(x<0.42) return mix(c1,c2,(x-0.2)/0.22); if(x<0.62) return mix(c2,c3,(x-0.42)/0.2);
      if(x<0.82) return mix(c3,c4,(x-0.62)/0.2); return mix(c4,c5,(x-0.82)/0.18);
    }
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      if (amt <= 0.001) { gl_FragColor = c; return; }
      // un poco de difusión (las cámaras térmicas no son nítidas como una foto)
      vec2 px = vec2(1.0/1920.0, 1.0/1080.0) * 1.6;
      vec3 s = c.rgb*0.4 + (texture2D(tDiffuse, vUv+vec2(px.x,0.)).rgb + texture2D(tDiffuse, vUv-vec2(px.x,0.)).rgb + texture2D(tDiffuse, vUv+vec2(0.,px.y)).rgb + texture2D(tDiffuse, vUv-vec2(0.,px.y)).rgb)*0.15;
      float l = dot(s, vec3(0.30,0.59,0.11));
      float x = clamp(pow(l*1.05, 0.95), 0.0, 1.0);
      x += (h(vUv*vec2(1920.,1080.) + floor(time*30.)) - 0.5) * 0.035;
      vec3 th = iron(clamp(x,0.,1.));
      float vig = smoothstep(1.25, 0.35, length((vUv-0.5)*vec2(1.6,1.0)));
      gl_FragColor = vec4(mix(c.rgb, th * (0.82 + 0.18*vig), amt), 1.0);
    }`,
};
const Post: React.FC<{ bloom: number; threshold: number; exposure: number; env: number; therm: number; t: number }> = ({ bloom, threshold, exposure, env, therm, t }) => {
  const { gl, scene, camera, size } = useThree();
  const comp = useMemo(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping; gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = true; gl.shadowMap.type = THREE.PCFSoftShadowMap;
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    const g = new GTAOPass(scene, camera, size.width, size.height); g.blendIntensity = 0.8; c.addPass(g);
    const b = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), bloom, 0.55, threshold); c.addPass(b);
    c.addPass(new OutputPass());
    const th = new ShaderPass(ThermalShader); c.addPass(th);
    c.addPass(new SMAAPass(size.width, size.height));
    return { c, b, th };
  }, [gl, scene, camera, size.width, size.height]);
  useEffect(() => () => comp.c.dispose(), [comp]);
  (scene as unknown as { environmentIntensity: number }).environmentIntensity = env;
  gl.toneMappingExposure = exposure;
  comp.b.strength = bloom; comp.b.threshold = threshold;
  comp.th.uniforms.amt.value = therm; comp.th.uniforms.time.value = t;
  useFrame(() => { comp.c.render(); }, 1);
  return null;
};

// ---------------- páginas REALES de la guía (el render espera a que carguen) ----------------
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader(); const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas guia"); let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (tt) => { flip.image = tt.image; flip.needsUpdate = true; if (--n === 0) { bump((x) => x + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);
};

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useCasaTex = () => useMemo(() => ({
  stucco: mk(512, 512, (g) => {
    g.fillStyle = "#d7c9ad"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) { const v = rnd(i, 1); g.fillStyle = v > 0.5 ? `rgba(255,250,235,${0.12 * rnd(i, 2)})` : `rgba(90,70,40,${0.1 * rnd(i, 3)})`; g.fillRect(rnd(i, 4) * 512, rnd(i, 5) * 512, 1 + rnd(i, 6) * 3, 1 + rnd(i, 7) * 3); }
    for (let i = 0; i < 6; i++) { g.strokeStyle = "rgba(80,60,35,.12)"; g.lineWidth = 1; g.beginPath(); let x = rnd(i, 8) * 512, y = rnd(i, 9) * 512; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (rnd(i * 7 + k, 2) - 0.5) * 40; y += 12 + rnd(k, i) * 18; g.lineTo(x, y); } g.stroke(); }
  }, [3, 2]),
  door: mk(256, 512, (g) => {
    g.fillStyle = "#3d5b4a"; g.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(20,30,25,${0.15 * rnd(i, 1)})`; g.lineWidth = 1; g.beginPath(); g.moveTo(rnd(i, 2) * 256, 0); g.lineTo(rnd(i, 3) * 256, 512); g.stroke(); }
    const panel = (x: number, y: number, w: number, h: number) => { g.strokeStyle = "rgba(10,20,15,.55)"; g.lineWidth = 6; g.strokeRect(x, y, w, h); g.strokeStyle = "rgba(160,190,170,.25)"; g.lineWidth = 2; g.strokeRect(x + 5, y + 5, w - 10, h - 10); };
    panel(30, 30, 196, 190); panel(30, 260, 196, 220);
    for (let i = 0; i < 80; i++) { g.fillStyle = `rgba(200,190,160,${0.25 * rnd(i, 4)})`; g.fillRect(rnd(i, 5) * 256, 440 + rnd(i, 6) * 72, 2 + rnd(i, 7) * 5, 1); }
  }),
  grass: mk(256, 256, (g) => { g.fillStyle = "#2f3d24"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(${60 + rnd(i, 1) * 50},${80 + rnd(i, 2) * 60},${30 + rnd(i, 3) * 20},.6)`; g.fillRect(rnd(i, 4) * 256, rnd(i, 5) * 256, 1, 2 + rnd(i, 6) * 4); } }, [8, 4]),
  asphalt: mk(256, 256, (g) => { g.fillStyle = "#2b2c2e"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 3000; i++) { const v = 40 + rnd(i, 1) * 50; g.fillStyle = `rgba(${v},${v},${v},.5)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); } }, [10, 2]),
  walk: mk(256, 256, (g) => { g.fillStyle = "#8d8a83"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1500; i++) { const v = 110 + rnd(i, 1) * 50; g.fillStyle = `rgba(${v},${v},${v - 6},.35)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); } g.fillStyle = "rgba(40,40,40,.5)"; g.fillRect(0, 0, 256, 3); g.fillRect(0, 0, 3, 256); }, [12, 1]),
  roof: mk(256, 256, (g) => { for (let r = 0; r < 16; r++) for (let c = -1; c < 9; c++) { const v = 70 + rnd(r * 9 + c, 1) * 30; g.fillStyle = `rgb(${v + 50},${v},${v - 20})`; g.fillRect(c * 32 + (r % 2) * 16, r * 16, 30, 14); } }, [6, 3]),
  hall: mk(256, 256, (g) => { g.fillStyle = "#e9dfc9"; g.fillRect(0, 0, 256, 256); for (let x = 0; x < 256; x += 42) { g.fillStyle = "rgba(160,130,90,.14)"; g.fillRect(x, 0, 16, 256); g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(x + 20, 0, 3, 256); } }, [3, 2]),
  // la tiza: un círculo con una cruz adentro, trazo de tiza sobre transparente
  chalk: mk(256, 256, (g) => {
    g.clearRect(0, 0, 256, 256); g.strokeStyle = "rgba(250,250,245,.95)"; g.lineCap = "round";
    for (let p = 0; p < 3; p++) { g.lineWidth = 9 - p * 2; g.globalAlpha = 0.45 + 0.2 * p; g.beginPath(); g.arc(128 + p, 128 - p, 78 + p * 2, 0.2, 6.2); g.stroke(); g.beginPath(); g.moveTo(80, 82 + p); g.lineTo(176, 178); g.moveTo(176 - p, 82); g.lineTo(80, 176 + p); g.stroke(); }
    for (let i = 0; i < 400; i++) { g.globalAlpha = 1; g.fillStyle = `rgba(0,0,0,${0.5 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 3, 3); }
  }),
  // el volante de pizzería (sin texto legible: bloques de color)
  flyer: mk(256, 360, (g) => {
    g.fillStyle = "#f4efe2"; g.fillRect(0, 0, 256, 360); g.fillStyle = "#c8312a"; g.fillRect(0, 0, 256, 90);
    g.fillStyle = "#f6c64a"; g.beginPath(); g.arc(128, 190, 70, 0, 6.3); g.fill(); g.fillStyle = "#b7442b"; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(128 + Math.cos(i) * 40 * rnd(i, 2), 190 + Math.sin(i * 2) * 40 * rnd(i, 3), 9, 0, 6.3); g.fill(); }
    g.fillStyle = "#333"; for (let r = 0; r < 4; r++) g.fillRect(30, 285 + r * 16, 196 * (0.6 + 0.4 * rnd(r, 4)), 7);
    g.fillStyle = "#fff"; g.fillRect(40, 30, 176, 14); g.fillRect(60, 54, 136, 10);
  }),
  news: mk(256, 256, (g) => { g.fillStyle = "#ddd8cb"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#2a2a2a"; g.fillRect(20, 20, 216, 26); for (let r = 0; r < 12; r++) for (let c = 0; c < 3; c++) g.fillRect(20 + c * 74, 60 + r * 15, 64 * (0.5 + 0.5 * rnd(r * 3 + c, 1)), 5); }),
  sky: mk(64, 512, (g) => { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#03060d"); gr.addColorStop(0.42, "#0b1530"); gr.addColorStop(0.52, "#1b2747"); gr.addColorStop(0.6, "#0d1220"); gr.addColorStop(1, "#05070b"); g.fillStyle = gr; g.fillRect(0, 0, 64, 512); }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3 }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
const BRASS = { color: "#c9a457", metalness: 1, roughness: 0.28 };

// una MARCA encendida: halo que respira en el lugar (en el ojo térmico arde blanca)
const Glow: React.FC<{ p: V3; on: number; t: number; therm: number; r?: number }> = ({ p, on, t, therm, r = 0.05 }) => {
  if (on < 0.01) return null;
  const pulse = 0.75 + 0.25 * Math.sin(t * 6);
  return (
    <group position={p}>
      <mesh><sphereGeometry args={[r * 0.18, 12, 8]} /><meshBasicMaterial color={therm > 0.5 ? "#ffffff" : "#ffe9a8"} transparent opacity={0.8 * on} toneMapped={false} /></mesh>
      <mesh><sphereGeometry args={[r * (0.7 + 0.3 * pulse), 20, 14]} /><meshBasicMaterial color="#ffcf6a" transparent opacity={0.07 * on * pulse} depthWrite={false} toneMapped={false} /></mesh>
      <pointLight intensity={0.3 * on * (0.5 + therm)} distance={0.6} color="#ffd890" />
    </group>
  );
};

// LA PUERTA con su marco, el cerrojo, el picaporte, la mirilla y las marcas propias de la puerta
const Door: React.FC<{ tx: ReturnType<typeof useCasaTex>; open: number; heat: number; plast: number; plastFall: number; cinta: number; volante: number; moneda: number }> = ({ tx, open, heat, plast, plastFall, cinta, volante, moneda }) => {
  const hot = (k: number) => ({ emissive: "#fff2c8", emissiveIntensity: 2.6 * heat * k });
  return (
    <group>
      {/* marco */}
      <Box p={[-0.5, 1.06, 0.03]} s={[0.07, 2.18, 0.12]} c="#e6e0d2" r={0.6} rad={0.006} />
      <Box p={[0.5, 1.06, 0.03]} s={[0.07, 2.18, 0.12]} c="#e6e0d2" r={0.6} rad={0.006} />
      <Box p={[0, 2.13, 0.03]} s={[1.07, 0.08, 0.12]} c="#e6e0d2" r={0.6} rad={0.006} />
      {/* hoja: bisagras a la izquierda (x = -0.45), se abre hacia adentro */}
      <group position={[-0.455, 0, 0.0]} rotation={[0, -open * 1.25, 0]}>
        <group position={[0.455, 0, 0]}>
          <mesh position={[0, 1.04, 0]} castShadow receiveShadow geometry={rbox(0.9, 2.06, 0.045, 0.006)}><meshStandardMaterial map={tx.door} roughness={0.55} /></mesh>
          {/* cerrojo: roseta + cilindro con su ojo */}
          <mesh position={[0.34, 1.07, 0.03]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.012, 32]} /><meshStandardMaterial {...BRASS} /></mesh>
          <mesh position={[0.34, 1.07, 0.04]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.016, 0.017, 0.016, 32]} /><meshStandardMaterial {...BRASS} roughness={0.2} /></mesh>
          <mesh position={[0.34, 1.073, 0.0485]}><circleGeometry args={[0.0032, 16]} /><meshBasicMaterial color="#050505" /></mesh>
          <mesh position={[0.34, 1.064, 0.0485]}><planeGeometry args={[0.0022, 0.012]} /><meshBasicMaterial color="#050505" /></mesh>
          {/* picaporte */}
          <mesh position={[0.34, 0.93, 0.03]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.032, 0.032, 0.012, 32]} /><meshStandardMaterial {...BRASS} /></mesh>
          <mesh position={[0.34, 0.93, 0.07]}><sphereGeometry args={[0.032, 32, 20]} /><meshStandardMaterial {...BRASS} /></mesh>
          <mesh position={[0.34, 0.93, 0.045]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.009, 0.009, 0.04, 12]} /><meshStandardMaterial {...BRASS} /></mesh>
          {/* mirilla */}
          <mesh position={[0, 1.55, 0.026]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.01, 20]} /><meshStandardMaterial {...BRASS} /></mesh>
          {/* 4 · volante colgado del picaporte (se balancea apenas) */}
          {volante > 0.01 && <group position={[0.34, 0.93, 0.085]} rotation={[0, 0, 0.04 * Math.sin(open * 3)]}>
            <mesh position={[0, -0.11, 0.004]} scale={[1, volante, 1]}><planeGeometry args={[0.15, 0.21]} /><meshStandardMaterial map={tx.flyer} roughness={0.9} side={THREE.DoubleSide} {...hot(1)} /></mesh>
            <mesh position={[0, -0.006, 0.0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.03, 0.002, 6, 24, Math.PI]} /><meshStandardMaterial color="#e4e0d6" /></mesh>
          </group>}
        </group>
      </group>
      {/* 1 · el plástico metido en la ranura (del lado del cerrojo, a la rodilla); plastFall = se cae al abrir */}
      {plast > 0.01 && <mesh position={[0.458 - plastFall * 0.05, 0.5 - plastFall * 0.47, 0.075 + plastFall * 0.16]} rotation={[plastFall * 1.4, -0.35 + plastFall * 0.5, 0.08 + plastFall * 1.2]} scale={plast}>
        <boxGeometry args={[0.0016, 0.05, 0.1]} /><meshPhysicalMaterial color="#f4f8ff" transparent opacity={0.85} roughness={0.08} clearcoat={1} emissive="#eef4ff" emissiveIntensity={0.5 + 2.6 * heat} /></mesh>}
      {/* 2 · cinta sobre la ranura, al lado del cerrojo */}
      {cinta > 0.01 && <mesh position={[0.455, 1.07, 0.072]} scale={[cinta, 1, 1]}><planeGeometry args={[0.07, 0.018]} /><meshPhysicalMaterial color="#f3ead0" transparent opacity={0.7} roughness={0.3} clearcoat={0.6} {...hot(1)} /></mesh>}
      {/* 6 · la moneda apoyada arriba, en la ranura del marco */}
      {moneda > 0.01 && <mesh position={[0.15, 2.0905, 0.06]} rotation={[0, 0, Math.PI / 2]} scale={moneda}><cylinderGeometry args={[0.011, 0.011, 0.0018, 24]} /><meshStandardMaterial color="#b8a27a" metalness={1} roughness={0.35} {...hot(1)} /></mesh>}
    </group>
  );
};

const ROOF = (() => { const sh = new THREE.Shape(); sh.moveTo(-4.0, 0); sh.lineTo(4.0, 0); sh.lineTo(0, 1.7); sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: 8.4, bevelEnabled: false }); const uv = g.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.25, uv.getY(i) * 0.25); return g; })();
// fachada de una casa (frente en z = 0); la del vecino usa la misma pieza en chico
const Facade: React.FC<{ tx: ReturnType<typeof useCasaTex>; x: number; lit: number; col?: string }> = ({ tx, x, lit, col = "#ffffff" }) => (
  <group position={[x, 0, 0]}>
    <mesh position={[-2.2175, 1.5, -4]} castShadow receiveShadow geometry={rbox(3.365, 3.0, 8, 0.02)}><meshStandardMaterial map={tx.stucco} color={col} roughness={0.95} /></mesh>
    <mesh position={[2.2175, 1.5, -4]} castShadow receiveShadow geometry={rbox(3.365, 3.0, 8, 0.02)}><meshStandardMaterial map={tx.stucco} color={col} roughness={0.95} /></mesh>
    <mesh position={[0, 2.585, -4]} castShadow receiveShadow geometry={rbox(1.07, 0.83, 8, 0.02)}><meshStandardMaterial map={tx.stucco} color={col} roughness={0.95} /></mesh>
    {/* adentro: el pasillo de la casa con su luz tibia (se ve sólo con la puerta abierta) */}
    <mesh position={[0, 1.1, -2.2]}><planeGeometry args={[1.07, 2.2]} /><meshBasicMaterial color="#a8642a" toneMapped={false} /></mesh>
    <mesh position={[0, 0.005, -1.1]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.07, 2.2]} /><meshBasicMaterial color="#5a3518" /></mesh>
    {/* techo a dos aguas */}
    <mesh position={[0, 3.0, -8.2]} castShadow geometry={ROOF}><meshStandardMaterial map={tx.roof} roughness={0.8} /></mesh>
    <Box p={[0, 3.0, 0.15]} s={[8.0, 0.1, 0.12]} c="#e6e0d2" r={0.6} rad={0.01} />
    {/* ventanas: marco + vidrio con luz de adentro */}
    {[-2.4, 2.4].map((wx, i) => <group key={wx} position={[wx, 1.45, 0.005]}>
      <Box p={[0, 0, 0]} s={[1.2, 1.1, 0.06]} c="#ece6d8" r={0.6} rad={0.008} />
      <mesh position={[0, 0, 0.035]}><planeGeometry args={[1.08, 0.98]} /><meshStandardMaterial color="#1a1a14" emissive={i ? "#ffb35c" : "#ffcf87"} emissiveIntensity={lit * (i ? 1.3 : 0.25)} roughness={0.15} metalness={0.3} /></mesh>
      <Box p={[0, 0, 0.045]} s={[0.04, 0.98, 0.02]} c="#ece6d8" r={0.6} rad={0.004} />
      <Box p={[0, -0.6, 0.08]} s={[1.3, 0.05, 0.16]} c="#d9d2c2" r={0.7} rad={0.008} />
    </group>)}
  </group>
);

// el ladrón (silueta simple): sólo se ve con el ojo térmico, caminando por la vereda de enfrente
const Walker: React.FC<{ t: number; t0: number; t1: number; therm: number }> = ({ t, t0, t1, therm }) => {
  if (t < t0 || t > t1) return null;
  const k = (t - t0) / (t1 - t0), x = lerp(-4.5, 3.0, k), ph = t * 7.5, sw = Math.sin(ph) * 0.35;
  const mat = <meshStandardMaterial color="#2a2c33" roughness={0.9} emissive="#ffd8a0" emissiveIntensity={0.55 * therm} />;
  return (
    <group position={[x, 0, 5.3]} rotation={[0, Math.PI / 2 - 0.25 * Math.sin(k * Math.PI), 0]}>
      <mesh position={[0, 1.22, 0]} scale={[0.75, 1, 1]} castShadow><capsuleGeometry args={[0.19, 0.48, 8, 16]} />{mat}</mesh>
      <mesh position={[0.02, 1.7, 0]} scale={[1, 1.12, 0.95]} castShadow><sphereGeometry args={[0.135, 24, 16]} />{mat}</mesh>
      <mesh position={[-0.03, 1.72, 0]} scale={[1.05, 1.15, 1.05]}><sphereGeometry args={[0.14, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.62]} />{mat}</mesh>
      {[-1, 1].map((s) => <group key={s} position={[0, 0.9, s * 0.09]} rotation={[0, 0, s * sw]}><mesh position={[0, -0.22, 0]} castShadow><capsuleGeometry args={[0.07, 0.34, 4, 10]} />{mat}</mesh>
        <group position={[0, -0.42, 0]} rotation={[0, 0, -Math.max(0, s * sw) * 0.8]}><mesh position={[0, -0.2, 0]} castShadow><capsuleGeometry args={[0.06, 0.32, 4, 10]} />{mat}</mesh></group></group>)}
      {[-1, 1].map((s) => <group key={"a" + s} position={[0, 1.44, s * 0.21]} rotation={[s * 0.08, 0, -s * sw * 0.6]}><mesh position={[0, -0.26, 0]} castShadow><capsuleGeometry args={[0.05, 0.42, 4, 10]} />{mat}</mesh></group>)}
    </group>
  );
};

// ---------------- LA GUÍA (proporción real 1700x2200) ----------------
const PAPER = "#cfc9be";
export const BW = 0.24, BD = BW * 2200 / 1700;
const Leaf: React.FC<{ ang: number; w: number; d: number; front?: THREE.Texture; back?: THREE.Texture; y: number }> = ({ ang, w, d, front, back, y }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(w, d, 28, 1), [w, d]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const N = 28, curl = Math.sin(ang) * 1.6;
  let x = 0, yy = 0; const xs: number[] = [], ys: number[] = [];
  for (let k = 0; k <= N; k++) { xs.push(x); ys.push(yy); const s = k / N; const phi = ang + curl * s * (1 - s * 0.4); x += Math.cos(phi) * w / N; yy += Math.sin(phi) * w / N; }
  for (let i = 0; i < pos.count; i++) { const k = i % (N + 1), row = Math.floor(i / (N + 1)); pos.setXYZ(i, xs[k], ys[k], row === 0 ? -d / 2 : d / 2); }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return (
    <group position={[0, y, 0]}>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.FrontSide} color={PAPER} roughness={0.92} map={back} envMapIntensity={0.2} /></mesh>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.BackSide} color={PAPER} roughness={0.92} map={front} envMapIntensity={0.2} /></mesh>
    </group>
  );
};
export const Book: React.FC<{ p: V3; rotY?: number; open: number; cover: THREE.Texture; inside?: THREE.Texture; right?: THREE.Texture; spine: string; flips?: { k: number; tex: [THREE.Texture, THREE.Texture] }[]; children?: React.ReactNode }> = ({ p, rotY = 0, open, cover, inside, right, spine, flips = [], children }) => {
  const w = BW, d = BD, th = 0.024;
  const ang = Math.PI * ease(open);
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <Box p={[0, 0.003, 0]} s={[w + 0.01, 0.005, d + 0.01]} c={spine} r={0.55} rad={0.002} />
      <mesh position={[0.004, 0.006 + th / 2, 0]} castShadow receiveShadow><boxGeometry args={[w - 0.004, th, d - 0.006]} /><meshStandardMaterial color="#e3dccd" roughness={0.95} /></mesh>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[w / 2 + 0.0025, 0.009 + i * (th / 7), 0]}><boxGeometry args={[0.001, 0.001, d - 0.01]} /><meshBasicMaterial color="#c4b9a2" /></mesh>)}
      {right && <mesh position={[0.004, 0.0065 + th, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w - 0.01, d - 0.012]} /><meshStandardMaterial map={right} color="#ece6da" roughness={0.92} envMapIntensity={0.2} /></mesh>}
      <Box p={[-w / 2 - 0.004, 0.006 + th / 2, 0]} s={[0.01, th + 0.012, d + 0.01]} c={spine} r={0.5} rad={0.004} />
      {flips.filter((f) => f.k > 0.001 && f.k < 0.999).map((f, i) => <group key={i} position={[-w / 2 + 0.006, 0.007 + th + i * 0.0008, 0]}><Leaf ang={Math.PI * ease(f.k)} w={w - 0.012} d={d - 0.014} front={f.tex[0]} back={f.tex[1]} y={0.001} /></group>)}
      <group position={[0.004, 0.0065 + th, 0]}>{children}</group>
      <group position={[-w / 2, 0.006 + th + 0.003, 0]} rotation={[0, 0, ang]}>
        <group position={[w / 2 + 0.005, 0, 0]}>
          <Box p={[0, 0, 0]} s={[w + 0.01, 0.005, d + 0.01]} c={spine} r={0.45} rad={0.002} />
          <mesh position={[0, 0.0027, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w + 0.008, d + 0.008]} /><meshStandardMaterial map={cover} roughness={0.4} metalness={0.03} color="#ffffff" /></mesh>
          {inside && <mesh position={[0, -0.0027, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[w - 0.006, d - 0.01]} /><meshStandardMaterial map={inside} color="#ece6da" roughness={0.92} envMapIntensity={0.2} /></mesh>}
        </group>
      </group>
    </group>
  );
};
// marcador fosforito que se PINTA sobre un renglón de la página (coordenadas normalizadas de la página real)
export const Marker: React.FC<{ t: number; at: number; out?: number; box: [number, number, number, number]; col?: string }> = ({ t, at, out = 1e9, box, col = "#ffd60a" }) => {
  const a = ease((t - at) / 0.4), o = 1 - win(t, out, out + 0.3);
  if (a <= 0.01 || o <= 0.01) return null;
  const pw = BW - 0.01, pd = BD - 0.012;
  const [x0, y0, x1, y1] = box, ww = (x1 - x0) * pw * a, hh = (y1 - y0) * pd;
  return <mesh position={[(x0 - 0.5) * pw + ww / 2, 0.0009, (y0 - 0.5) * pd + hh / 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[ww, hh]} /><meshBasicMaterial color={col} transparent opacity={0.5 * o} depthWrite={false} /></mesh>;
};
export const pagePt = (u: number, v: number): V3 => [PT.book[0] + 0.004 + (u - 0.5) * (BW - 0.01), PT.book[1] + 0.031, PT.book[2] + (v - 0.5) * (BD - 0.012)];

// el RECIBIDOR (del otro lado de la cerradura): piso de madera, pared empapelada, mesita, lámpara, perchero, la guía
const Hall: React.FC<{ tx: ReturnType<typeof useCasaTex>; ft: ReturnType<typeof useTextures>; pg: Record<string, THREE.Texture>; t: number; open: number; fan: number; children?: React.ReactNode }> = ({ tx, ft, pg, t, open, fan, children }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[HX, 0.001, 0]} receiveShadow><planeGeometry args={[6, 5]} /><meshStandardMaterial map={ft.planks} roughness={0.55} /></mesh>
    <Box p={[HX, 1.4, -0.45]} s={[6, 2.8, 0.1]} c="#efe6d2" r={0.9} map={tx.hall} rad={0.01} />
    <Box p={[HX, 0.45, -0.395]} s={[6, 0.9, 0.02]} c="#6b4a33" r={0.6} rad={0.004} />
    {/* la mesita de entrada */}
    <Box p={[HX, 0.81, -0.12]} s={[1.1, 0.04, 0.5]} c="#5a3a24" r={0.45} rad={0.008} />
    {[[-0.5, -0.33], [0.5, -0.33], [-0.5, 0.09], [0.5, 0.09]].map(([x, z], i) => <Box key={i} p={[HX + x, 0.4, z]} s={[0.04, 0.8, 0.04]} c="#4a2f1d" r={0.5} rad={0.006} />)}
    {/* lámpara de mesa */}
    <group position={[HX - 0.47, 0.83, -0.27]}>
      <mesh position={[0, 0.16, 0]} castShadow><cylinderGeometry args={[0.05, 0.08, 0.32, 24]} /><meshStandardMaterial color="#c2b49a" roughness={0.4} /></mesh>
      <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.1, 0.17, 0.2, 32, 1, true]} /><meshStandardMaterial color="#f6ead0" emissive="#ffd9a0" emissiveIntensity={0.9} side={THREE.DoubleSide} roughness={0.9} /></mesh>
      <pointLight position={[0, 0.38, 0.05]} intensity={2.4} distance={3} color="#ffd8a2" castShadow />
    </group>
    {/* platito con las llaves */}
    <mesh position={[HX + 0.42, 0.835, -0.2]}><cylinderGeometry args={[0.07, 0.05, 0.015, 32]} /><meshStandardMaterial color="#d8d0c0" roughness={0.3} /></mesh>
    {[0, 1, 2].map((i) => <mesh key={i} position={[HX + 0.41 + i * 0.015, 0.846, -0.2 + i * 0.01]} rotation={[-Math.PI / 2, 0, i * 0.8]}><torusGeometry args={[0.018, 0.0025, 8, 24]} /><meshStandardMaterial {...BRASS} /></mesh>)}
    {/* espejo y perchero */}
    <Box p={[HX + 0.1, 1.65, -0.385]} s={[0.7, 0.8, 0.03]} c="#7a5634" r={0.4} rad={0.01} />
    <mesh position={[HX + 0.1, 1.65, -0.368]}><planeGeometry args={[0.62, 0.72]} /><meshStandardMaterial color="#cfd6da" metalness={1} roughness={0.06} /></mesh>
    <Box p={[HX + 1.5, 1.7, -0.37]} s={[0.6, 0.06, 0.05]} c="#5a3a24" r={0.5} rad={0.006} />
    <Box p={[HX + 1.45, 1.35, -0.31]} s={[0.36, 0.7, 0.1]} c="#5c2f2a" r={0.95} rad={0.04} />
    {/* los otros 4 libros de la colección, apilados en abanico (se abren con fan) */}
    {["l2", "l3", "l4", "l5"].map((id, i) => (
      <group key={id} position={[HX - 0.31 - fan * 0.02, 0.832 + i * 0.03, -0.02 - fan * i * 0.02]} rotation={[0, 0.18 + fan * (0.12 * i), 0]}>
        <Book p={[0, 0, 0]} open={0} cover={pg[id + "_p001"]} spine={["#c8a31c", "#c27a92", "#5f9ec0", "#58a383", "#9a7cc0"][i + 1]} />
      </group>))}
    <Book p={PT.book} open={open} cover={pg.l1_p001} inside={pg.l1_p060_r} right={pg.l1_p061} spine="#c8a31c">{children}</Book>
    <spotLight position={[HX + 0.2, 2.3, 1.0]} angle={0.45} penumbra={0.9} intensity={6} distance={4} color="#fff2dc" target-position={PT.book} />
    {void t}
  </group>
);

// ===================================================================================================
// estado de cada marca: cuándo existe (k) y cuándo arde (lit) — lo arma Min1/Rest y se lo pasa al mundo
export type MarkState = Partial<Record<MarkId, { k: number; lit: number }>>;
export const World: React.FC<{ t: number; therm?: number; marks?: MarkState; doorOpen?: number; plastFall?: number; walker?: [number, number]; vecino?: number; bookOpen?: number; fan?: number; children?: React.ReactNode }> = ({ t, therm = 0, marks = {}, doorOpen = 0, plastFall = 0, walker, vecino = 0, bookOpen = 0, fan = 0, children }) => {
  const ft = useTextures();
  const tx = useCasaTex();
  const pg = useImgTex(["l1_p001", "l1_p060", "l1_p061", "l2_p001", "l3_p001", "l4_p001", "l5_p001", "l5_p038", "l5_p039"]);
  const M = (id: MarkId) => marks[id] ?? { k: 0, lit: 0 };
  const lit = (id: MarkId) => M(id).lit;
  const inHall = camAt(t).p.x > HX - 10;
  const heat = 0.15 + 0.85 * therm; // en térmica las marcas arden

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={inHall ? 0.22 : 0.5 * (1 - 0.6 * therm)} threshold={inHall ? 0.95 : 0.78} exposure={inHall ? 0.9 : 0.8} env={inHall ? 0.3 : 0.08} therm={inHall ? 0 : therm} t={t} />
      <color attach="background" args={["#05070c"]} />
      <mesh><sphereGeometry args={[120, 32, 16]} /><meshBasicMaterial map={tx.sky} side={THREE.BackSide} toneMapped={false} /></mesh>
      {/* estrellas */}
      {Array.from({ length: 140 }, (_, i) => { const a = rnd(i, 1) * Math.PI * 2, e = 0.12 + rnd(i, 2) * 0.9; return <mesh key={"st" + i} position={[Math.cos(a) * Math.cos(e) * 110, Math.sin(e) * 110, Math.sin(a) * Math.cos(e) * 110]}><sphereGeometry args={[0.12 + rnd(i, 3) * 0.18, 6, 4]} /><meshBasicMaterial color="#dfe8ff" toneMapped={false} /></mesh>; })}
      <hemisphereLight args={[0x2a3a66, 0x0a0806, 0.14]} />
      {/* luna fría */}
      <directionalLight position={[-8, 12, 10]} intensity={0.28} color="#9fb4e6" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0004} />

      {/* ===== LA CUADRA ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 8.2]} receiveShadow><planeGeometry args={[60, 6]} /><meshStandardMaterial map={tx.asphalt} roughness={0.9} /></mesh>
      {Array.from({ length: 14 }, (_, i) => <mesh key={"lin" + i} rotation={[-Math.PI / 2, 0, 0]} position={[-26 + i * 4, 0.0, 8.2]}><planeGeometry args={[1.8, 0.1]} /><meshStandardMaterial color="#c9b979" roughness={0.8} /></mesh>)}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 5.1]} receiveShadow><planeGeometry args={[60, 2.2]} /><meshStandardMaterial map={tx.walk} roughness={0.9} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 11.2]} receiveShadow><planeGeometry args={[60, 2.2]} /><meshStandardMaterial map={tx.walk} roughness={0.9} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 2]} receiveShadow><planeGeometry args={[60, 4]} /><meshStandardMaterial map={tx.grass} roughness={1} /></mesh>
      {/* camino de baldosas de la vereda a la puerta + porche */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 2.4]} receiveShadow><planeGeometry args={[1.1, 3.2]} /><meshStandardMaterial map={tx.walk} roughness={0.9} /></mesh>
      <Box p={[0, 0.07, 0.55]} s={[2.4, 0.14, 1.1]} c="#9a958b" r={0.9} map={ft.concrete} rad={0.01} />
      {/* felpudo y maceta */}
      <Box p={[0, 0.15, 0.45]} s={[0.8, 0.02, 0.5]} c="#6e4f35" r={1} rad={0.008} />
      <group position={[-0.85, 0.14, 0.45]}><mesh position={[0, 0.14, 0]} castShadow><cylinderGeometry args={[0.16, 0.12, 0.28, 24]} /><meshStandardMaterial color="#a4563a" roughness={0.8} /></mesh>
        {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.2, 0.4 + rnd(i, 2) * 0.2, (rnd(i, 3) - 0.5) * 0.2]} rotation={[rnd(i, 4), rnd(i, 5) * 3, rnd(i, 6)]}><sphereGeometry args={[0.07, 8, 6]} /><meshStandardMaterial color="#2f5a2c" roughness={0.9} /></mesh>)}</group>
      {/* cerco bajo con portón (en z = 4) */}
      {[-1, 1].map((s) => <group key={s}>{Array.from({ length: 22 }, (_, i) => <Box key={i} p={[s * (1.2 + i * 0.22), 0.5, 4.0]} s={[0.07, 1.0, 0.03]} c="#e8e3d6" r={0.7} rad={0.005} />)}
        <Box p={[s * 3.6, 0.82, 4.0]} s={[4.9, 0.06, 0.04]} c="#e8e3d6" r={0.7} rad={0.005} /><Box p={[s * 3.6, 0.25, 4.0]} s={[4.9, 0.06, 0.04]} c="#e8e3d6" r={0.7} rad={0.005} /></group>)}
      <Box p={[-1.1, 0.6, 4.0]} s={[0.12, 1.2, 0.12]} c="#d5cfc0" r={0.7} rad={0.01} />
      <Box p={[1.1, 0.6, 4.0]} s={[0.12, 1.2, 0.12]} c="#d5cfc0" r={0.7} rad={0.01} />
      {/* portón de reja (cerrado) */}
      {Array.from({ length: 10 }, (_, i) => <mesh key={"g" + i} position={[-0.95 + i * 0.21, 0.5, 4.0]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.9, 8]} /><meshStandardMaterial color="#25272b" metalness={0.6} roughness={0.5} /></mesh>)}
      <Box p={[0, 0.88, 4.0]} s={[2.05, 0.04, 0.03]} c="#25272b" m={0.6} r={0.5} rad={0.004} />
      <Box p={[0, 0.15, 4.0]} s={[2.05, 0.04, 0.03]} c="#25272b" m={0.6} r={0.5} rad={0.004} />
      {/* 5 · precinto en el portón */}
      {M("precinto").k > 0.01 && <mesh position={PT.precinto} rotation={[0, 0, Math.PI / 2]} scale={M("precinto").k}><torusGeometry args={[0.028, 0.004, 8, 24]} /><meshStandardMaterial color="#f2f2ee" roughness={0.6} emissive="#fff2c8" emissiveIntensity={2.6 * heat} /></mesh>}
      {/* buzón sobre poste (7 · rebalsa) */}
      <group position={[-2.2, 0, 4.25]}>
        <Box p={[0, 0.5, 0]} s={[0.09, 1.0, 0.09]} c="#4a3a2a" r={0.8} rad={0.01} />
        <Box p={[0, 1.12, 0]} s={[0.24, 0.24, 0.42]} c="#2c3a4a" m={0.4} r={0.5} rad={0.04} />
        {M("diarios").k > 0.01 && <mesh position={[0, 1.13, 0.24]} rotation={[0.3, 0, 0]} scale={M("diarios").k}><planeGeometry args={[0.2, 0.12]} /><meshStandardMaterial color="#f2eee4" side={THREE.DoubleSide} emissive="#fff2c8" emissiveIntensity={2.2 * heat} /></mesh>}
      </group>
      {/* 7 · los diarios tirados en el camino (enrollados) */}
      {M("diarios").k > 0.01 && [0, 1, 2].map((i) => <mesh key={"d" + i} position={[PT.diarios[0] + i * 0.18, 0.1, PT.diarios[2] - i * 0.28]} rotation={[0, 0.6 + i * 0.7, Math.PI / 2]} scale={M("diarios").k} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.32, 20]} /><meshStandardMaterial map={tx.news} roughness={0.9} emissive="#fff2c8" emissiveIntensity={2.2 * heat} /></mesh>)}
      {/* farol de la calle */}
      <group position={[3.4, 0, 5.4]}>
        <mesh position={[0, 2.6, 0]} castShadow><cylinderGeometry args={[0.06, 0.08, 5.2, 12]} /><meshStandardMaterial color="#33363a" metalness={0.5} roughness={0.6} /></mesh>
        <Box p={[-0.4, 5.15, 0]} s={[0.9, 0.08, 0.12]} c="#33363a" m={0.5} r={0.6} rad={0.01} />
        <Box p={[-0.8, 5.08, 0]} s={[0.36, 0.08, 0.2]} c="#fff2cc" e="#ffd88a" ei={4} r={0.4} rad={0.01} />
        <spotLight position={[-0.8, 5.0, 0]} angle={0.85} penumbra={0.7} intensity={16} distance={14} decay={1.6} color="#ffcf8a" castShadow target-position={[-1.2, 0, 3.5]} />
      </group>
      {/* luz del porche (apagada en las escenas del ladrón) */}
      <Box p={[0.8, 2.25, 0.08]} s={[0.12, 0.2, 0.1]} c="#fff0d0" e="#ffcf8a" ei={therm > 0.5 ? 0.2 : 2.2} r={0.4} rad={0.02} />
      <pointLight position={[0.8, 2.2, 0.4]} intensity={therm > 0.5 ? 0.15 : 2.0} distance={4} color="#ffd6a0" castShadow />

      {/* ===== LA CASA ===== */}
      <Facade tx={tx} x={0} lit={1} />
      <Door tx={tx} open={doorOpen} heat={heat} plast={M("plast").k} plastFall={plastFall} cinta={M("cinta").k} volante={M("volante").k} moneda={M("moneda").k} />
      {/* 3 · la tiza en la pared */}
      {M("tiza").k > 0.01 && <mesh position={PT.tiza}><planeGeometry args={[0.13 * M("tiza").k, 0.13 * M("tiza").k]} /><meshStandardMaterial map={tx.chalk} transparent roughness={1} emissive="#fff2c8" emissiveMap={tx.chalk} emissiveIntensity={2.4 * heat} depthWrite={false} /></mesh>}
      {/* adentro, la luz cálida que se ve cuando la puerta se abre (en térmica: el calor de la casa) */}
      {doorOpen > 0.01 && <pointLight position={[0, 1.6, -0.8]} intensity={3 * doorOpen} distance={4} color="#ffc27a" />}

      {/* las casas vecinas (la de la izquierda también tiene cinta en la cerradura) */}
      <Facade tx={tx} x={-10} lit={0.3} col="#c9d2d8" />
      <group position={[-10, 0, 0]}>
        <mesh position={[0, 1.04, 0.0]} castShadow receiveShadow geometry={rbox(0.9, 2.06, 0.045, 0.006)}><meshStandardMaterial color="#6a3a2a" roughness={0.6} /></mesh>
        <mesh position={[0.34, 1.07, 0.03]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.012, 32]} /><meshStandardMaterial {...BRASS} /></mesh>
        {vecino > 0.01 && <mesh position={[0.455, 1.07, 0.03]}><planeGeometry args={[0.07 * vecino, 0.018]} /><meshStandardMaterial color="#f3ead0" emissive="#fff2c8" emissiveIntensity={2.6 * heat} /></mesh>}
        <Box p={[0, 0.07, 0.55]} s={[2.4, 0.14, 1.1]} c="#8f8a80" r={0.9} rad={0.01} />
      </group>
      <Facade tx={tx} x={10} lit={0.8} col="#e9d6c4" />
      <group position={[10, 0, 0]}><mesh position={[0, 1.04, 0.0]} castShadow receiveShadow geometry={rbox(0.9, 2.06, 0.045, 0.006)}><meshStandardMaterial color="#2c3f5c" roughness={0.6} /></mesh><Box p={[0, 0.07, 0.55]} s={[2.4, 0.14, 1.1]} c="#8f8a80" r={0.9} rad={0.01} /></group>
      {/* casas de enfrente (sólo siluetas con ventanas) */}
      {[-9, 0, 9].map((x, i) => <group key={"fr" + i} position={[x, 0, 16]}>
        <mesh position={[0, 1.6, 0]} geometry={rbox(7, 3.2, 3, 0.02)}><meshStandardMaterial color="#3a3c40" roughness={0.95} /></mesh>
        <mesh position={[1.5, 1.5, -1.51]} rotation={[0, Math.PI, 0]}><planeGeometry args={[1, 0.9]} /><meshStandardMaterial color="#111" emissive="#ffc77a" emissiveIntensity={i === 1 ? 0.9 : 0.15} /></mesh>
      </group>)}
      {walker && <Walker t={t} t0={walker[0]} t1={walker[1]} therm={therm} />}

      {/* las marcas encendidas: un halo en cada una */}
      {MARKS.map((id) => <Glow key={id} p={id === "diarios" ? [PT.diarios[0] + 0.18, 0.18, PT.diarios[2] - 0.28] : PT[id]} on={lit(id)} t={t} therm={therm} r={id === "diarios" ? 0.16 : id === "precinto" ? 0.07 : 0.05} />)}
      {lit("diarios") > 0.01 && <Glow p={PT.buzon} on={lit("diarios")} t={t + 0.7} therm={therm} r={0.12} />}

      {/* ===== EL RECIBIDOR con la guía ===== */}
      <Hall tx={tx} ft={ft} pg={pg} t={t} open={bookOpen} fan={fan}>{children}</Hall>
    </ThreeCanvas>
  );
};
