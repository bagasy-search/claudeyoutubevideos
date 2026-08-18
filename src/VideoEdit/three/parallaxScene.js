// parallaxScene.js — 2.5D parallax on a single still: the photo is mapped onto a finely
// subdivided plane and displaced in Z by a depth estimate (blurred luminance + a radial
// subject bias), then a slow camera parallax move gives real depth. Deterministic in t.
// Async: the texture loads, so createParallax returns { render, ready } and Scene3D awaits it.
import * as THREE from "three";

export function createParallax(renderer, width, height, opts = {}) {
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05070c);
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  const CAMZ = 10;
  camera.position.set(0, 0, CAMZ);

  // plane sized to fill the frame at z=0
  const h = 2 * CAMZ * Math.tan((camera.fov * Math.PI / 180) / 2);
  const w = h * (width / height);
  const geo = new THREE.PlaneGeometry(w * 1.14, h * 1.14, 160, 90); // slight overscan for the sway

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: null },
      depthScale: { value: opts.depthScale ?? 1.5 },
      hasMap: { value: 0 },
      bright: { value: opts.bright ?? 1.0 },
    },
    vertexShader: `
      uniform sampler2D map; uniform float depthScale; uniform float hasMap;
      varying vec2 vUv;
      void main(){
        vUv = uv;
        float depth = 0.0;
        if (hasMap > 0.5) {
          // soft luminance (average a small cross) so high-freq detail doesn't spike
          vec3 c0 = texture2D(map, uv).rgb;
          vec3 c1 = texture2D(map, uv + vec2(0.01,0.0)).rgb;
          vec3 c2 = texture2D(map, uv - vec2(0.01,0.0)).rgb;
          vec3 c3 = texture2D(map, uv + vec2(0.0,0.01)).rgb;
          vec3 c4 = texture2D(map, uv - vec2(0.0,0.01)).rgb;
          vec3 c = (c0+c1+c2+c3+c4)/5.0;
          float luma = dot(c, vec3(0.299,0.587,0.114));
          float rad = 1.0 - length(uv - 0.5) * 1.3;      // center (subject) closer
          depth = mix(rad, luma, 0.35);
        }
        vec3 p = position;
        p.z += (depth - 0.45) * depthScale;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: `
      uniform sampler2D map; uniform float hasMap; uniform float bright;
      varying vec2 vUv;
      void main(){
        vec3 c = hasMap > 0.5 ? texture2D(map, vUv).rgb * bright : vec3(0.03,0.04,0.06);
        float vig = smoothstep(1.15, 0.35, length(vUv - 0.5));   // gentle vignette
        gl_FragColor = vec4(c * mix(0.72, 1.0, vig), 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat); scene.add(mesh);

  let ready = Promise.resolve();
  if (opts.img) {
    ready = new Promise((resolve) => {
      new THREE.TextureLoader().load(opts.img, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace; tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
        mat.uniforms.map.value = tex; mat.uniforms.hasMap.value = 1; resolve();
      }, undefined, () => resolve());
    });
  }

  function render(t) {
    // slow parallax: camera sways + eases in; near parts of the relief move more than far
    const ez = Math.min(1, t / 8);
    const x = Math.sin(t * 0.28) * 0.9;
    const y = Math.cos(t * 0.22) * 0.55;
    camera.position.set(x, y, CAMZ - ez * 1.1);
    camera.lookAt(x * 0.35, y * 0.35, 0);
    renderer.render(scene, camera);
  }
  return { render, ready };
}
