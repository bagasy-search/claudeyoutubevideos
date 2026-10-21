// keikoes01 (base gary01) · capa de CALIDAD para cualquier mundo three.js: entorno PBR (reflejos), tono ACES, sombras suaves,
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
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// GTAO sin sprites ni piezas marcadas userData.noAO (vapor, llamas): si no, el pase de normales los pinta como cuadrados negros
class GTAONoSprites extends GTAOPass {
  overrideVisibility() {
    super.overrideVisibility();
    this.scene.traverse((o: any) => { if (o.isSprite || o.userData?.noAO || (o.material && o.material.blending === 2)) o.visible = false; });
  }
}
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
    if (ao) { const g = new GTAONoSprites(scene, camera, size.width, size.height); g.blendIntensity = 0.85; c.addPass(g); }
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
