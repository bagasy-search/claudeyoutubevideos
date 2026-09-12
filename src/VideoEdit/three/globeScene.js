// globeScene.js — holographic 3D globe with the 7 countries pinned, glowing great-circle
// arcs, atmosphere fresnel and bloom. Deterministic function of t (seconds). Pure three.js.
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const R = 100;
const COUNTRIES = [
  ["Mexico", 23, -102, "#3aa76d"], ["Colombia", 4, -73, "#f5d020"], ["Ecuador", -1.5, -78, "#f5b31b"],
  ["Thailand", 15, 101, "#e0483c"], ["Philippines", 13, 122, "#2b6fe0"],
  ["Vietnam", 16, 106, "#e0322f"], ["Panama", 9, -80, "#ffcf6a"],
];
const toVec = (lat, lon, r = R) => {
  const phi = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
};
function labelSprite(text, color) {
  const c = document.createElement("canvas"); c.width = 512; c.height = 128;
  const g = c.getContext("2d"); g.clearRect(0, 0, 512, 128);
  g.font = "700 60px Montserrat, Arial, sans-serif"; g.textAlign = "left"; g.textBaseline = "middle";
  g.shadowColor = "rgba(0,0,0,.9)"; g.shadowBlur = 12;
  g.fillStyle = "#0c1018"; g.globalAlpha = 0.0;
  g.fillStyle = color; g.fillRect(6, 44, 18, 40);       // color chip
  g.fillStyle = "#ffffff"; g.globalAlpha = 1; g.fillText(text.toUpperCase(), 40, 66);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  sp.scale.set(64, 16, 1); return sp;
}

export function createGlobe(renderer, width, height) {
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new THREE.Scene();
  // dusk gradient backdrop
  const bg = document.createElement("canvas"); bg.width = 8; bg.height = 512;
  const bgg = bg.getContext("2d"); const grd = bgg.createLinearGradient(0, 0, 0, 512);
  grd.addColorStop(0, "#05070f"); grd.addColorStop(0.55, "#0a1024"); grd.addColorStop(1, "#160f2a");
  bgg.fillStyle = grd; bgg.fillRect(0, 0, 8, 512);
  scene.background = new THREE.CanvasTexture(bg); scene.background.colorSpace = THREE.SRGBColorSpace;

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 2000);

  const world = new THREE.Group(); scene.add(world);
  world.rotation.z = 0.32; // tilt

  // ── globe body (deep navy, subtle) ──
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(R, 64, 64),
    new THREE.MeshStandardMaterial({ color: 0x0e1c38, roughness: 0.55, metalness: 0.2, emissive: 0x081226, emissiveIntensity: 0.6 })
  );
  world.add(globe);

  // ── lat/long wire grid (holographic) ──
  const grid = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(R * 1.003, 36, 24)),
    new THREE.LineBasicMaterial({ color: 0x2f6cff, transparent: true, opacity: 0.16 })
  );
  world.add(grid);

  // ── land dots (fibonacci sphere, brighter cluster near the equatorial belt) ──
  const N = 2600, pos = new Float32Array(N * 3);
  const gA = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - y * y), th = gA * i;
    pos[i * 3] = Math.cos(th) * rr * R * 1.004; pos[i * 3 + 1] = y * R * 1.004; pos[i * 3 + 2] = Math.sin(th) * rr * R * 1.004;
  }
  const dots = new THREE.Points(
    new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(pos, 3)),
    new THREE.PointsMaterial({ color: 0x59d0ff, size: 0.9, transparent: true, opacity: 0.5, sizeAttenuation: true })
  );
  world.add(dots);

  // ── atmosphere fresnel shell ──
  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.14, 48, 48),
    new THREE.ShaderMaterial({
      transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      uniforms: { c: { value: new THREE.Color(0x3f7bff) } },
      vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
      fragmentShader: `uniform vec3 c; varying vec3 vN; void main(){ float i = pow(0.72 - dot(vN, vec3(0,0,1.0)), 3.0); gl_FragColor = vec4(c, clamp(i,0.0,1.0)); }`,
    })
  );
  world.add(atmo);

  // ── country pins + rings + labels + arcs ──
  const pinsG = new THREE.Group(); world.add(pinsG);
  const pins = COUNTRIES.map(([n, la, lo, col]) => {
    const v = toVec(la, lo, R); const col3 = new THREE.Color(col); const up = v.clone().normalize();
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 16, 8), new THREE.MeshBasicMaterial({ color: col3, transparent: true }));
    beam.position.copy(v.clone().addScaledVector(up, 8)); beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up); pinsG.add(beam);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(2.4, 16, 16), new THREE.MeshBasicMaterial({ color: col3, transparent: true }));
    dot.position.copy(v.clone().addScaledVector(up, 16)); pinsG.add(dot);
    const ring = new THREE.Mesh(new THREE.RingGeometry(3, 4.2, 24), new THREE.MeshBasicMaterial({ color: col3, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
    ring.position.copy(v.clone().addScaledVector(up, 0.4)); ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), up); pinsG.add(ring);
    const lab = labelSprite(n, col); lab.position.copy(v.clone().addScaledVector(up, 30)); pinsG.add(lab);
    return { up, ring, dot, beam, lab };
  });
  const pinVecs = COUNTRIES.map(([n, la, lo]) => ({ v: toVec(la, lo, R) }));

  // arcs between consecutive countries (great-circle-ish via quadratic bezier lifted off surface)
  const arcMat = new THREE.LineBasicMaterial({ color: 0xffcf6a, transparent: true, opacity: 0.55 });
  for (let i = 0; i < pinVecs.length; i++) {
    const a = pinVecs[i].v, b = pinVecs[(i + 1) % pinVecs.length].v;
    const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.35);
    const curve = new THREE.QuadraticBezierCurve3(a.clone().multiplyScalar(1.01), mid, b.clone().multiplyScalar(1.01));
    const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
    world.add(new THREE.Line(g, arcMat));
  }

  // lights
  scene.add(new THREE.HemisphereLight(0x4060a0, 0x0a0c14, 1.0));
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-120, 80, 160); scene.add(key);

  // post
  const composer = new EffectComposer(renderer);
  composer.setSize(width, height);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(width, height), 0.85, 0.7, 0.1));

  const camDir = new THREE.Vector3();
  function render(t) {
    world.rotation.y = -0.9 + t * 0.16;                 // slow spin
    const push = 320 - Math.min(70, t * 6);              // gentle push-in
    camera.position.set(0, 26, push); camera.lookAt(0, 4, 0);
    world.updateMatrixWorld();
    camDir.copy(camera.position).normalize();            // camera direction from globe center
    pins.forEach((p, i) => {
      const wUp = p.up.clone().applyQuaternion(world.quaternion);
      const facing = wUp.dot(camDir);                    // 1 = front, -1 = back
      const vis = Math.max(0, Math.min(1, (facing - 0.05) / 0.35));  // fade near the limb
      const pulse = 0.5 + 0.5 * Math.sin(t * 3 + i);
      p.ring.scale.setScalar(1 + 0.35 * pulse); p.ring.material.opacity = vis * (0.45 + 0.45 * pulse);
      p.lab.material.opacity = vis; p.dot.material.opacity = vis; p.beam.material.opacity = vis;
    });
    composer.render();
  }
  return { scene, camera, render };
}
