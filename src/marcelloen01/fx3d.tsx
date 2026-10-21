// marcelloen01 (base gary01) · capa de CALIDAD para cualquier mundo three.js: entorno PBR (reflejos), tono ACES, sombras suaves,
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
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// un píxel NaN (bump a ras / normal nula) el bloom lo desparrama en un BLOQUE NEGRO: se limpia antes del bloom
const NoNaN = { uniforms: { tDiffuse: { value: null } }, vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
  fragmentShader: "uniform sampler2D tDiffuse; varying vec2 vUv; void main(){ vec4 c=texture2D(tDiffuse,vUv); if(!(c.r==c.r)||!(c.g==c.g)||!(c.b==c.b)||c.r>1e4||c.g>1e4||c.b>1e4) c=vec4(0.0,0.0,0.0,1.0); gl_FragColor=c; }" };
export const Post: React.FC<{ bloom?: number; threshold?: number; ao?: boolean; exposure?: number; env?: number }> = ({ bloom = 0.9, threshold = 0.82, ao = true, exposure = 1.0, env = 0.35 }) => {
  const { gl, scene, camera, size } = useThree();
  const comp = useMemo(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = true; gl.shadowMap.type = THREE.PCFSoftShadowMap;
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    if (ao) {
      const g = new GTAOPass(scene, camera, size.width, size.height); g.blendIntensity = 0.85;
      // lo transparente (vapor) no entra al AO: si entra, sale como cuadrados negros
      const orig = g.render.bind(g);
      g.render = (...a: Parameters<typeof orig>) => {
        const hid: THREE.Object3D[] = []; scene.traverse((o) => { if (o.userData.noAO && o.visible) { o.visible = false; hid.push(o); } });
        orig(...a); hid.forEach((o) => (o.visible = true));
      };
      c.addPass(g);
    }
    c.addPass(new ShaderPass(NoNaN));
    const b = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), bloom, 0.55, threshold); c.addPass(b);
    c.addPass(new OutputPass());
    c.addPass(new SMAAPass(size.width, size.height));
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
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
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
  // marcelloen01 · muro de piedra de la cocina de la nonna: piedras irregulares redondeadas con mortero, cada una con su tono y sus vetas
  stone: mk(1024, 1024, (g) => {
    g.fillStyle = "#6f665a"; g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 9000; i++) { const v = 80 + rnd(i, 9) * 50; g.fillStyle = `rgba(${v},${v - 6},${v - 14},.5)`; g.fillRect(rnd(i, 7) * 1024, rnd(i, 8) * 1024, 2, 2); }
    let y = 0, row = 0;
    while (y < 1024) {
      const h = 70 + rnd(row, 1) * 60; let x = -rnd(row, 2) * 80, k = 0;
      while (x < 1024) {
        const w = 90 + rnd(row * 31 + k, 3) * 120, id = row * 31 + k;
        const b = 150 + rnd(id, 4) * 55, warm = rnd(id, 5) * 18;
        const gr = g.createLinearGradient(x, y, x + w * 0.4, y + h);
        gr.addColorStop(0, `rgb(${b + warm + 14},${b + 8},${b - 10})`); gr.addColorStop(1, `rgb(${b + warm - 26},${b - 30},${b - 44})`);
        g.fillStyle = gr; g.beginPath();
        const r = 14 + rnd(id, 6) * 16, px = x + 5 + rnd(id, 7) * 4, py = y + 5 + rnd(id, 8) * 4, pw = w - 10 - rnd(id, 9) * 6, ph = h - 10 - rnd(id, 10) * 6;
        g.moveTo(px + r, py); g.lineTo(px + pw - r, py + rnd(id, 11) * 5); g.quadraticCurveTo(px + pw, py, px + pw, py + r); g.lineTo(px + pw - rnd(id, 12) * 5, py + ph - r);
        g.quadraticCurveTo(px + pw, py + ph, px + pw - r, py + ph); g.lineTo(px + r, py + ph - rnd(id, 13) * 4); g.quadraticCurveTo(px, py + ph, px, py + ph - r); g.lineTo(px + rnd(id, 14) * 4, py + r); g.quadraticCurveTo(px, py, px + r, py);
        g.fill();
        for (let q = 0; q < 26; q++) { g.fillStyle = `rgba(${rnd(id * 7 + q, 15) > 0.5 ? "255,250,240" : "40,32,24"},${0.06 + rnd(id * 7 + q, 16) * 0.08})`; g.beginPath(); g.arc(px + rnd(id * 7 + q, 17) * pw, py + rnd(id * 7 + q, 18) * ph, 2 + rnd(id * 7 + q, 19) * 7, 0, 6.3); g.fill(); }
        g.strokeStyle = "rgba(255,245,225,.18)"; g.lineWidth = 2; g.beginPath(); g.moveTo(px + r, py + 2); g.lineTo(px + pw - r, py + 3); g.stroke();
        x += w; k++;
      }
      y += h; row++;
    }
  }, [3, 1.5]),
  // piso de baldosas de terracota gastadas (cada una con su tono, juntas oscuras)
  terra: mk(512, 512, (g) => {
    g.fillStyle = "#3b2418"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const i = r * 4 + c, b = rnd(i, 1);
      g.fillStyle = `rgb(${170 + b * 40},${92 + b * 26},${58 + b * 18})`; g.fillRect(c * 128 + 4, r * 128 + 4, 120, 120);
      for (let q = 0; q < 60; q++) { g.fillStyle = `rgba(${rnd(i * 60 + q, 2) > 0.5 ? "230,170,130" : "90,45,25"},${0.08 + rnd(i * 60 + q, 3) * 0.1})`; g.fillRect(c * 128 + 4 + rnd(i * 60 + q, 4) * 116, r * 128 + 4 + rnd(i * 60 + q, 5) * 116, 3 + rnd(i * 60 + q, 6) * 8, 2 + rnd(i * 60 + q, 7) * 5); }
      const wear = g.createRadialGradient(c * 128 + 64, r * 128 + 64, 10, c * 128 + 64, r * 128 + 64, 80); wear.addColorStop(0, "rgba(255,210,170,.12)"); wear.addColorStop(1, "rgba(0,0,0,.12)");
      g.fillStyle = wear; g.fillRect(c * 128 + 4, r * 128 + 4, 120, 120);
    }
  }, [5, 3]),
  // madera vieja oscura (mesa larga, vigas, estante): vetas largas y nudos
  oak: mk(512, 512, (g) => {
    g.fillStyle = "#5a3b24"; g.fillRect(0, 0, 512, 512);
    for (let k = 0; k < 140; k++) { g.strokeStyle = `rgba(${rnd(k, 1) > 0.5 ? "30,16,6" : "140,95,55"},${0.12 + rnd(k, 2) * 0.18})`; g.lineWidth = 1 + rnd(k, 3) * 3; g.beginPath(); const y = rnd(k, 4) * 512; g.moveTo(0, y); g.bezierCurveTo(170, y + (rnd(k, 5) - 0.5) * 16, 340, y + (rnd(k, 6) - 0.5) * 16, 512, y + (rnd(k, 7) - 0.5) * 10); g.stroke(); }
    for (let n = 0; n < 4; n++) { const x = rnd(n, 8) * 512, y = rnd(n, 9) * 512; for (let r = 3; r < 22; r += 3) { g.strokeStyle = `rgba(35,18,8,${0.35 - r * 0.012})`; g.lineWidth = 1.5; g.beginPath(); g.ellipse(x, y, r * 2.2, r * 0.8, 0, 0, 6.3); g.stroke(); } }
    for (let r = 0; r < 4; r++) { g.fillStyle = "rgba(20,10,4,.6)"; g.fillRect(0, r * 128, 512, 3); }
  }, [1, 1]),
  // vapor (sprite suave)
  steam: mk(128, 128, (g) => {
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 62); gr.addColorStop(0, "rgba(255,255,255,.55)"); gr.addColorStop(0.5, "rgba(255,255,255,.18)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
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
