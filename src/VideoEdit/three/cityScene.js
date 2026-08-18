// cityScene.js — procedural night city, reusable by BOTH the standalone preview and the
// Remotion @remotion/three component. Pure three.js (no R3F) so it renders identically in
// the farm's headless Chrome. Deterministic: everything is a function of t (seconds).
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// deterministic PRNG
const mulberry = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

// window emissive texture (shared): sparse punchy lit cells on near-black, warm + a few cool
function windowTexture(seed = 7) {
  const c = document.createElement("canvas"); c.width = 128; c.height = 256;
  const g = c.getContext("2d"); g.fillStyle = "#04060a"; g.fillRect(0, 0, 128, 256);
  const r = mulberry(seed); const cols = 5, rows = 10, cw = 128 / cols, ch = 256 / rows;
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const on = r() > 0.6; if (!on) continue;              // sparser, larger windows
    const warm = r() > 0.2;
    g.fillStyle = warm ? `rgb(255,${205 + (r() * 40) | 0},${140 + (r() * 60) | 0})`
      : `rgb(150,195,255)`;
    g.fillRect(x * cw + 3, y * ch + 4, cw - 6, ch - 8);
  }
  const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter; return tex;
}

// dusk sky gradient backdrop (deep navy → purple horizon → warm band)
function skyTexture() {
  const c = document.createElement("canvas"); c.width = 8; c.height = 512;
  const g = c.getContext("2d"); const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, "#070c1c"); grad.addColorStop(0.42, "#12193a");
  grad.addColorStop(0.66, "#2b1f42"); grad.addColorStop(0.82, "#5a3320");
  grad.addColorStop(0.94, "#8a4a18"); grad.addColorStop(1.0, "#26160c");
  g.fillStyle = grad; g.fillRect(0, 0, 8, 512);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; return tex;
}

export function createCity(renderer, width, height) {
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = skyTexture();
  scene.fog = new THREE.FogExp2(0x1a1730, 0.0055);

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 900);

  // ── big backdrop dome so the sky fills the frame behind the skyline ──
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(600, 32, 16),
    new THREE.MeshBasicMaterial({ map: skyTexture(), side: THREE.BackSide, fog: false, depthWrite: false })
  );
  scene.add(sky);
  // soft moon glow
  const moon = new THREE.Mesh(new THREE.SphereGeometry(18, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xffe6c0, fog: false }));
  moon.position.set(180, 140, -320); scene.add(moon);

  // ── ground ──
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshStandardMaterial({ color: 0x080b14, roughness: 0.9, metalness: 0.1 })
  );
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  // ── lights: warm horizon key + cool moon fill + blue rim ──
  const key = new THREE.DirectionalLight(0xffb673, 1.5);
  key.position.set(120, 60, -160); key.castShadow = true;    // from the warm horizon
  key.shadow.mapSize.set(2048, 2048);
  const d = 220; Object.assign(key.shadow.camera, { left: -d, right: d, top: d, bottom: -d, near: 1, far: 600 });
  key.shadow.bias = -0.0006; scene.add(key);
  scene.add(new THREE.HemisphereLight(0x35406a, 0x0a0c14, 0.9));
  const rim = new THREE.DirectionalLight(0x5f86ff, 0.7); rim.position.set(-90, 50, 80); scene.add(rim);
  scene.add(new THREE.AmbientLight(0x20284a, 0.5));

  // ── buildings ──
  const winTex = windowTexture(9);
  const bmats = [0x141b28, 0x101725, 0x18202f, 0x0e1420].map((col) =>
    new THREE.MeshStandardMaterial({ color: col, roughness: 0.72, metalness: 0.12,
      emissive: 0xffcaa0, emissiveIntensity: 0.85, emissiveMap: winTex }));
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x0c111b, roughness: 0.9 });

  const rnd = mulberry(4242);
  const group = new THREE.Group(); scene.add(group);
  const GRID = 15, STEP = 15;
  for (let gx = -GRID; gx <= GRID; gx++) for (let gz = -GRID; gz <= GRID; gz++) {
    if (rnd() > 0.82) continue; // gaps = streets/plazas
    const dist = Math.hypot(gx, gz);
    const base = 6 + rnd() * 10;
    const h = base + Math.max(0, (GRID - dist)) * (2.2 + rnd() * 3.4) + (dist < 2 ? 40 : 0);
    const w = 6 + rnd() * 4, dp = 6 + rnd() * 4;
    const mat = bmats[(rnd() * bmats.length) | 0];
    const geo = new THREE.BoxGeometry(w, h, dp);
    const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true;
    m.position.set(gx * STEP + (rnd() - 0.5) * 3, h / 2, gz * STEP + (rnd() - 0.5) * 3);
    m.userData.uv = [Math.max(1, Math.round(w / 4.5)), Math.max(2, Math.round(h / 6))];
    // per-mesh emissive map repeat via cloned material (cheap enough at this count)
    const cm = mat.clone(); cm.emissiveMap = winTex.clone();
    cm.emissiveMap.wrapS = cm.emissiveMap.wrapT = THREE.RepeatWrapping;
    cm.emissiveMap.repeat.set(m.userData.uv[0], m.userData.uv[1]);
    cm.emissiveMap.offset.set(rnd(), rnd());
    // tonal variety: ~28% dark towers, ~18% cool-lit, rest warm — cinematic contrast
    const kind = rnd();
    if (kind < 0.28) { cm.emissiveIntensity = 0.18 + rnd() * 0.25; cm.emissive = new THREE.Color(0x2a3550); }
    else if (kind < 0.46) { cm.emissiveIntensity = 1.1 + rnd() * 0.9; cm.emissive = new THREE.Color(0x8fb6ff); }
    else { cm.emissiveIntensity = 1.5 + rnd() * 1.4; cm.emissive = new THREE.Color(0xffcf9c); }
    if (dist < 2.2) { cm.emissiveIntensity = 2.4; cm.emissive = new THREE.Color(0xffd8a6); } // hero towers pop
    m.material = cm;
    group.add(m);
    // roof cap
    const roof = new THREE.Mesh(new THREE.BoxGeometry(w * 1.02, 0.6, dp * 1.02), roofMat);
    roof.position.set(m.position.x, h, m.position.z); group.add(roof);
  }

  // subtle warm point-glows scattered (street lights / bloom seeds)
  for (let i = 0; i < 10; i++) {
    const p = new THREE.PointLight(0xffb060, 6, 40, 2.2);
    p.position.set((rnd() - 0.5) * 260, 3 + rnd() * 6, (rnd() - 0.5) * 260); group.add(p);
  }

  // ── post: bloom for glowing windows ──
  const composer = new EffectComposer(renderer);
  composer.setSize(width, height);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 1.05, 0.72, 0.32);
  composer.addPass(bloom);

  function render(t) {
    // slow crane: sweep + descend + push in, ending looking slightly up at the skyline vs the dusk sky
    const a = 0.06 * t - 0.35;
    const radius = 300 - Math.min(120, t * 8);
    const hgt = 150 - Math.min(96, t * 7.2);
    camera.position.set(Math.sin(a) * radius, Math.max(34, hgt), Math.cos(a) * radius);
    camera.lookAt(0, 40 + Math.min(24, t * 1.6), 0);
    composer.render();
  }
  return { scene, camera, render, composer, renderer };
}
