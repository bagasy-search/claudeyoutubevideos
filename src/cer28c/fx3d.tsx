// gary01 · capa de CALIDAD para cualquier mundo three.js: entorno PBR (reflejos), tono ACES, sombras suaves,
// oclusión ambiental (GTAO), bloom real en lo que emite luz (LED, farol, faroles, ventanas), SMAA.
// Se monta dentro del <ThreeCanvas>: toma el render (useFrame con prioridad 1) y dibuja por el composer.
// Más texturas procedurales (CanvasTexture): piso de tablas, azulejo, empapelado, alfombra, copo de nieve redondo.
import React, { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
// nitidez: máscara de enfoque suave (unsharp 3x3) al final, después del SMAA — devuelve el detalle que el AA y el bloom ablandan
const Sharpen = { uniforms: { tDiffuse: { value: null }, px: { value: new THREE.Vector2(1 / 1920, 1 / 1080) }, amt: { value: 0.45 } },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
  fragmentShader: "uniform sampler2D tDiffuse; uniform vec2 px; uniform float amt; varying vec2 vUv; void main(){ vec4 c = texture2D(tDiffuse, vUv); vec3 b = (texture2D(tDiffuse, vUv + vec2(px.x, 0.0)).rgb + texture2D(tDiffuse, vUv - vec2(px.x, 0.0)).rgb + texture2D(tDiffuse, vUv + vec2(0.0, px.y)).rgb + texture2D(tDiffuse, vUv - vec2(0.0, px.y)).rgb) * 0.25; gl_FragColor = vec4(clamp(c.rgb + (c.rgb - b) * amt, 0.0, 1.0), c.a); }" };
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export const Post: React.FC<{ bloom?: number; threshold?: number; ao?: boolean; exposure?: number; env?: number }> = ({ bloom = 0.6, threshold = 0.95, ao = true, exposure = 1.0, env = 0.5 }) => {
  const { gl, scene, camera, size } = useThree();
  const comp = useMemo(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = true; gl.shadowMap.type = THREE.PCFSoftShadowMap;
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    if (ao) { const g = new GTAOPass(scene, camera, size.width, size.height); g.blendIntensity = 0.85; c.addPass(g); }
    const b = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), bloom, 0.22, threshold); c.addPass(b);
    c.addPass(new OutputPass());
    c.addPass(new SMAAPass(size.width, size.height));
    const sh = new ShaderPass(Sharpen); sh.uniforms.px.value.set(1 / size.width, 1 / size.height); c.addPass(sh);
    return { c, b };
  }, [gl, scene, camera, size.width, size.height, ao]);
  useEffect(() => () => comp.c.dispose(), [comp]);
  // intensidad del entorno y exposición pueden cambiar por cuadro (día/noche)
  (scene as unknown as { environmentIntensity: number }).environmentIntensity = env;
  gl.toneMappingExposure = exposure;
  comp.b.strength = bloom; comp.b.threshold = threshold;
  useFrame(() => { comp.c.render(); }, 1);
  return null;
};

// ---------- texturas procedurales (deterministas) ----------
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w * 2; cv.height = h * 2; const g2 = cv.getContext("2d")!; g2.scale(2, 2); draw(g2);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 16; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; return t;
};
export const useTextures = () => useMemo(() => ({
  planks: mk(512, 512, (g) => {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 3; c++) {
      const i = r * 3 + c, off = (r % 2) * 85;
      const base = 120 + rnd(i, 1) * 40;
      g.fillStyle = `rgb(${base + 30},${base - 10},${base - 55})`; g.fillRect(c * 170 + off - 170, r * 64, 170, 64); g.fillRect(c * 170 + off, r * 64, 170, 64);
      for (let k = 0; k < 9; k++) { g.strokeStyle = `rgba(60,35,15,${0.08 + rnd(i, k) * 0.12})`; g.lineWidth = 1 + rnd(i, k + 3) * 2; g.beginPath(); const y = r * 64 + 6 + k * 6.5; g.moveTo(0, y); g.bezierCurveTo(170, y + 3 * rnd(i, k), 340, y - 3, 512, y + 2); g.stroke(); }
      g.fillStyle = "rgba(30,18,8,.55)"; g.fillRect(0, r * 64, 512, 2); g.fillRect(c * 170 + off, r * 64, 2, 64);
    }
  }, [2, 2]),
  tile: mk(256, 256, (g) => {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const w = (r + c) % 2; g.fillStyle = w ? "#e8e4dc" : "#2d3138"; g.fillRect(c * 64, r * 64, 64, 64); }
    g.strokeStyle = "rgba(0,0,0,.25)"; g.lineWidth = 2; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * 64, 0); g.lineTo(k * 64, 256); g.stroke(); g.beginPath(); g.moveTo(0, k * 64); g.lineTo(256, k * 64); g.stroke(); }
  }, [3, 3]),
  paper: mk(256, 256, (g) => {
    g.fillStyle = "#d9cdb6"; g.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 32) { g.fillStyle = "rgba(150,120,80,.18)"; g.fillRect(x, 0, 10, 256); g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(x + 14, 0, 3, 256); }
    for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(120,95,60,${0.15 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 3) * 256, rnd(i, 4) * 256, 2 + rnd(i, 5) * 3, 0, 6.3); g.fill(); }
  }, [4, 2]),
  rug: mk(256, 256, (g) => {
    g.fillStyle = "#7a2e2a"; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "#d9b77a"; g.lineWidth = 8; g.strokeRect(14, 14, 228, 228); g.lineWidth = 3; g.strokeRect(34, 34, 188, 188);
    g.fillStyle = "#2f3f5a"; g.beginPath(); g.moveTo(128, 60); g.lineTo(196, 128); g.lineTo(128, 196); g.lineTo(60, 128); g.closePath(); g.fill();
    g.fillStyle = "#d9b77a"; g.beginPath(); g.arc(128, 128, 18, 0, 6.3); g.fill();
  }),
  concrete: mk(256, 256, (g) => {
    g.fillStyle = "#77787a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) { const v = 90 + rnd(i, 1) * 60; g.fillStyle = `rgba(${v},${v},${v},.35)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); }
    g.strokeStyle = "rgba(30,30,30,.35)"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 128); g.lineTo(256, 128); g.stroke();
  }, [3, 2]),
  block: mk(256, 256, (g) => {
    g.fillStyle = "#8f9192"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++) { const off = (r % 2) * 32; g.fillStyle = `rgb(${150 + rnd(r * 4 + c, 1) * 25},${150 + rnd(r * 4 + c, 1) * 25},${148 + rnd(r * 4 + c, 1) * 25})`; g.fillRect(c * 64 + off + 2, r * 32 + 2, 60, 28); g.fillRect(c * 64 + off - 64 + 2, r * 32 + 2, 60, 28); }
  }, [3, 2]),
  siding: mk(256, 256, (g) => {
    for (let r = 0; r < 16; r++) { g.fillStyle = r % 2 ? "#d8d4ca" : "#cdc8bd"; g.fillRect(0, r * 16, 256, 16); g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(0, r * 16 + 14, 256, 2); }
  }, [3, 2]),
  // v2 (28-oct, «componentes de baja calidad»): empapelado, lambrín, vista nocturna por la ventana, cortina, cuadros, hoja
  wallpaper: mk(512, 512, (g) => {
    g.fillStyle = "#d9ccb2"; g.fillRect(0, 0, 512, 512);
    for (let x = 0; x < 512; x += 64) { g.fillStyle = "rgba(255,250,235,.22)"; g.fillRect(x, 0, 26, 512); g.fillStyle = "rgba(120,96,60,.10)"; g.fillRect(x + 30, 0, 3, 512); }
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {   // ramito chico de damasco entre las rayas
      const cx = c * 64 + 45, cy = r * 64 + (c % 2) * 32 + 16; g.fillStyle = "rgba(140,104,64,.22)";
      for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(cx + Math.cos(k * 1.57) * 5, cy + Math.sin(k * 1.57) * 5, 4.5, 2.2, k * 1.57, 0, 6.3); g.fill(); }
      g.fillStyle = "rgba(160,70,60,.25)"; g.beginPath(); g.arc(cx, cy, 2.2, 0, 6.3); g.fill();
    }
    for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(90,70,40,${0.04 * rnd(i, 7)})`; g.fillRect(rnd(i, 8) * 512, rnd(i, 9) * 512, 2, 2); }
  }, [3, 1.4]),
  wainscot: mk(512, 256, (g) => {
    g.fillStyle = "#e9e1d0"; g.fillRect(0, 0, 512, 256);
    for (let c = 0; c < 4; c++) { const x = c * 128 + 14;
      g.fillStyle = "rgba(0,0,0,.13)"; g.fillRect(x, 26, 100, 4); g.fillRect(x, 26, 4, 200);
      g.fillStyle = "rgba(255,255,255,.55)"; g.fillRect(x, 222, 100, 4); g.fillRect(x + 96, 26, 4, 200);
      g.fillStyle = "rgba(0,0,0,.05)"; g.fillRect(x + 10, 36, 80, 180); }
  }, [3, 1]),
  night: mk(1024, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#0a1330"); gr.addColorStop(0.62, "#1c2c55"); gr.addColorStop(1, "#2a3350");
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 140; i++) { g.fillStyle = `rgba(255,255,255,${0.25 + 0.6 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 1024, rnd(i, 4) * 260, 1.6, 1.6); }
    const mg = g.createRadialGradient(780, 90, 0, 780, 90, 70); mg.addColorStop(0, "rgba(255,250,225,1)"); mg.addColorStop(0.35, "rgba(255,245,210,.95)"); mg.addColorStop(0.4, "rgba(200,210,255,.35)"); mg.addColorStop(1, "rgba(120,140,220,0)");
    g.fillStyle = mg; g.fillRect(680, 0, 200, 200);
    // resplandor de la ciudad en el horizonte
    const hz = g.createLinearGradient(0, 260, 0, 380); hz.addColorStop(0, "rgba(90,80,120,0)"); hz.addColorStop(1, "rgba(150,110,110,.35)"); g.fillStyle = hz; g.fillRect(0, 260, 1024, 120);
    // árboles de atrás: copas en racimos, un poco más claras en el borde de arriba (luna)
    for (let i = 0; i < 11; i++) { const x = rnd(i, 11) * 1024, r = 30 + rnd(i, 12) * 34;
      for (let k = 0; k < 6; k++) { const cx = x + (rnd(i * 7 + k, 13) - 0.5) * r * 1.6, cy = 318 - r * 0.5 + (rnd(i * 7 + k, 14) - 0.5) * r, cr = r * (0.45 + 0.35 * rnd(i * 7 + k, 15));
        g.fillStyle = "#0a1220"; g.beginPath(); g.arc(cx, cy, cr, 0, 6.3); g.fill(); g.fillStyle = "rgba(70,90,130,.22)"; g.beginPath(); g.arc(cx, cy - cr * 0.25, cr * 0.75, Math.PI * 1.1, Math.PI * 1.9); g.fill(); }
      g.fillStyle = "#0a1220"; g.fillRect(x - 4, 318, 8, 80); }
    // casas del barrio: fachada azul pizarra, techo más oscuro, 2-3 ventanas cálidas con su halo, puerta
    for (let h = 0; h < 7; h++) { const x = h * 155 - 30 + rnd(h, 4) * 20, w = 120 + rnd(h, 5) * 30, y = 340 + rnd(h, 6) * 28;
      g.fillStyle = "#121a2c"; g.fillRect(x, y, w, 512 - y);
      g.fillStyle = "#0b1120"; g.beginPath(); g.moveTo(x - 10, y + 2); g.lineTo(x + w / 2, y - 46); g.lineTo(x + w + 10, y + 2); g.fill();
      g.strokeStyle = "rgba(120,140,180,.25)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x - 10, y + 2); g.lineTo(x + w / 2, y - 46); g.lineTo(x + w + 10, y + 2); g.stroke();
      const nw = 2 + (rnd(h, 8) > 0.5 ? 1 : 0);
      for (let k = 0; k < nw; k++) { const wx = x + 16 + k * (w - 40) / Math.max(1, nw - 1) - 8, wy = y + 30, lit = rnd(h * 5 + k, 9) > 0.3;
        if (lit) { const hg = g.createRadialGradient(wx + 11, wy + 13, 0, wx + 11, wy + 13, 34); hg.addColorStop(0, "rgba(255,200,120,.35)"); hg.addColorStop(1, "rgba(255,200,120,0)"); g.fillStyle = hg; g.fillRect(wx - 30, wy - 30, 82, 86); }
        g.fillStyle = lit ? "#ffcf86" : "#1d2740"; g.fillRect(wx, wy, 22, 26); g.fillStyle = "#121a2c"; g.fillRect(wx + 10, wy, 2, 26); g.fillRect(wx, wy + 12, 22, 2); }
      g.fillStyle = "#0a0f1c"; g.fillRect(x + w / 2 - 9, 512 - 70, 18, 40); }
    // faroles de la calle con su cono de luz
    for (const x of [140, 520, 900]) { g.fillStyle = "#0a0f1c"; g.fillRect(x - 2, 360, 4, 120);
      const lg = g.createRadialGradient(x, 360, 0, x, 360, 60); lg.addColorStop(0, "rgba(255,225,160,.9)"); lg.addColorStop(0.15, "rgba(255,210,140,.45)"); lg.addColorStop(1, "rgba(255,200,120,0)"); g.fillStyle = lg; g.fillRect(x - 60, 300, 120, 120); }
    g.fillStyle = "#06090f"; g.fillRect(0, 478, 1024, 34); g.fillStyle = "rgba(255,210,140,.12)"; g.fillRect(0, 478, 1024, 3);
  }),
  curtain: mk(256, 256, (g) => {
    for (let x = 0; x < 256; x++) { const v = 0.5 + 0.5 * Math.sin(x / 256 * Math.PI * 10); g.fillStyle = `rgb(${Math.round(150 + 50 * v)},${Math.round(120 + 40 * v)},${Math.round(95 + 30 * v)})`; g.fillRect(x, 0, 1, 256); }
    for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(255,255,255,${0.05 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 1, 3); }
  }),
  art: [0, 1, 2, 3].map((n) => mk(256, 320, (g) => {   // cuadritos: paisaje de campo, mar, flores, retrato de familia
    const sky = [["#9ec3dc", "#f1e3c2"], ["#7fa8c9", "#d9e6ea"], ["#e7d9c2", "#f6efe2"], ["#b9a58a", "#d8c8ad"]][n];
    const gr = g.createLinearGradient(0, 0, 0, 320); gr.addColorStop(0, sky[0]); gr.addColorStop(1, sky[1]); g.fillStyle = gr; g.fillRect(0, 0, 256, 320);
    if (n === 0) { g.fillStyle = "#6f8f4a"; g.beginPath(); g.moveTo(0, 220); g.quadraticCurveTo(120, 170, 256, 210); g.lineTo(256, 320); g.lineTo(0, 320); g.fill(); g.fillStyle = "#4e6b33"; g.beginPath(); g.moveTo(0, 260); g.quadraticCurveTo(140, 230, 256, 270); g.lineTo(256, 320); g.lineTo(0, 320); g.fill(); g.fillStyle = "#8a4a32"; g.fillRect(150, 185, 40, 30); g.fillStyle = "#5a2a1a"; g.beginPath(); g.moveTo(144, 186); g.lineTo(170, 166); g.lineTo(196, 186); g.fill(); }
    if (n === 1) { g.fillStyle = "#3f6f93"; g.fillRect(0, 190, 256, 130); g.fillStyle = "rgba(255,255,255,.5)"; for (let k = 0; k < 9; k++) g.fillRect(rnd(k, 1) * 220, 200 + k * 12, 30, 2); g.fillStyle = "#f5f0e0"; g.beginPath(); g.moveTo(110, 185); g.lineTo(128, 120); g.lineTo(128, 185); g.fill(); }
    if (n === 2) { g.fillStyle = "#7a5a3a"; g.fillRect(96, 230, 64, 70); for (let k = 0; k < 9; k++) { g.fillStyle = ["#c2283c", "#e8a33a", "#f2f2f2"][k % 3]; g.beginPath(); g.arc(80 + rnd(k, 2) * 100, 120 + rnd(k, 3) * 100, 16, 0, 6.3); g.fill(); } }
    if (n === 3) { g.fillStyle = "#6b5a48"; for (const [x, s] of [[90, 1], [160, 0.9]]) { g.beginPath(); g.arc(x, 150, 30 * s, 0, 6.3); g.fill(); g.fillRect(x - 40 * s, 185, 80 * s, 140); } }
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(0,0,0,${0.05 * rnd(i, 5 + n)})`; g.fillRect(rnd(i, 6) * 256, rnd(i, 7) * 320, 2, 2); }
  })),
  leaf: mk(64, 64, (g) => {
    g.clearRect(0, 0, 64, 64); g.fillStyle = "#3d6b33"; g.beginPath(); g.moveTo(32, 2); g.quadraticCurveTo(62, 30, 32, 62); g.quadraticCurveTo(2, 30, 32, 2); g.fill();
    g.strokeStyle = "rgba(200,230,170,.5)"; g.lineWidth = 2; g.beginPath(); g.moveTo(32, 6); g.lineTo(32, 58); g.stroke();
  }),
  flake: mk(64, 64, (g) => {
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,.7)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  }),
}), []);

// caja con bordes redondeados (mata el look "Minecraft")
const rbCache = new Map<string, THREE.BufferGeometry>();
export const rbox = (w: number, h: number, d: number, r = 0.03) => {
  const k = `${w}|${h}|${d}|${r}`; let g = rbCache.get(k);
  if (!g) { g = new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.1, h / 2.1, d / 2.1)); rbCache.set(k, g); }
  return g;
};
