// numberScene.js — a huge beveled EXTRUDED 3D numeral (07..01) + country name, on a dark
// cinematic stage with rim-lit gold edges + bloom. Deterministic function of t. Pure three.js.
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import helvetiker from "three/examples/fonts/helvetiker_bold.typeface.json";

const FONT = new FontLoader().parse(helvetiker);

function centeredText(str, size, depth) {
  const geo = new TextGeometry(str, { font: FONT, size, depth, curveSegments: 6,
    bevelEnabled: true, bevelThickness: size * 0.05, bevelSize: size * 0.03, bevelSegments: 4 });
  geo.computeBoundingBox(); const bb = geo.boundingBox;
  geo.translate(-(bb.max.x + bb.min.x) / 2, -(bb.max.y + bb.min.y) / 2, -depth / 2);
  return geo;
}

export function createNumber(renderer, width, height, opts = {}) {
  const num = opts.num || "04", country = (opts.country || "THAILAND").toUpperCase();
  const accent = new THREE.Color(opts.accent || "#FFC400");
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const bg = document.createElement("canvas"); bg.width = 8; bg.height = 512;
  const bgg = bg.getContext("2d"); const grd = bgg.createRadialGradient(4, 200, 20, 4, 240, 380);
  grd.addColorStop(0, "#15243a"); grd.addColorStop(0.6, "#0a1220"); grd.addColorStop(1, "#05070d");
  bgg.fillStyle = grd; bgg.fillRect(0, 0, 8, 512);
  scene.background = new THREE.CanvasTexture(bg); scene.background.colorSpace = THREE.SRGBColorSpace;

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 3000);
  camera.position.set(0, 0, 360);

  // materials: brushed metal front + accent-tinted bevel that catches the rim light
  const matFront = new THREE.MeshStandardMaterial({ color: 0xdfe6f0, roughness: 0.32, metalness: 0.9, envMapIntensity: 1 });
  const matSide = new THREE.MeshStandardMaterial({ color: accent.clone().multiplyScalar(0.9), roughness: 0.35, metalness: 0.85, emissive: accent.clone().multiplyScalar(0.25), emissiveIntensity: 1 });

  const numGeo = centeredText(num, 150, 46);
  const numMesh = new THREE.Mesh(numGeo, [matFront, matSide]); // group 0 = faces, 1 = sides/bevel
  numMesh.position.y = 26; scene.add(numMesh);

  // country name (smaller, in front, accent)
  const ctGeo = centeredText(country, country.length > 9 ? 20 : 26, 8);
  const ctMesh = new THREE.Mesh(ctGeo, new THREE.MeshStandardMaterial({ color: accent, roughness: 0.4, metalness: 0.6, emissive: accent, emissiveIntensity: 0.5 }));
  ctMesh.position.set(0, -86, 40); scene.add(ctMesh);

  // lights: dramatic rim setup
  scene.add(new THREE.AmbientLight(0x223049, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(-160, 130, 220); scene.add(key);
  const rimA = new THREE.PointLight(accent.getHex(), 900, 900, 2); rimA.position.set(210, 40, 60); scene.add(rimA);
  const rimB = new THREE.PointLight(0x3f7bff, 700, 900, 2); rimB.position.set(-200, -60, 90); scene.add(rimB);
  const top = new THREE.SpotLight(0xffffff, 600, 900, 0.6, 0.5, 1.5); top.position.set(0, 260, 160); top.target = numMesh; scene.add(top);

  const composer = new EffectComposer(renderer);
  composer.setSize(width, height);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(width, height), 0.6, 0.6, 0.55));

  function render(t) {
    const sway = Math.sin(t * 0.7) * 0.28;
    numMesh.rotation.y = -0.35 + sway; numMesh.rotation.x = 0.06 + Math.sin(t * 0.5) * 0.03;
    ctMesh.rotation.y = numMesh.rotation.y * 0.4;
    const intro = Math.min(1, t / 0.9);
    numMesh.position.z = -60 * (1 - intro); numMesh.scale.setScalar(0.9 + 0.1 * intro);
    composer.render();
  }
  return { scene, camera, render };
}
