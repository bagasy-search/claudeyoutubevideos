// onerScene.js — the SIGNATURE continuous "oner": one unbroken camera flies from deep
// space → the globe forms → dives to a pin → (flash-cut hidden by a light burst) → emerges
// over the 3D city → cranes down toward street level. Deterministic function of t (seconds).
// Total ~20s. Pure three.js; renders on the farm (swangle). Globe + city live in ONE scene at
// separate coordinates; the camera "teleports" under a white flash (the editor's seamless cut).
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const mul = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const CITY_ORIGIN = V(0, -6000, 0); // the city lives far below the globe

export function createOner(renderer, width, height) {
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();
  scene.fog = null;
  const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 20000);
  scene.add(camera);

  // ── starfield ──
  const sN = 2200, sp = new Float32Array(sN * 3);
  const sr = mul(11);
  for (let i = 0; i < sN; i++) { const r = 2500 + sr() * 6000, th = sr() * 6.28, ph = Math.acos(2 * sr() - 1); sp[i*3]=r*Math.sin(ph)*Math.cos(th); sp[i*3+1]=r*Math.sin(ph)*Math.sin(th); sp[i*3+2]=r*Math.cos(ph); }
  const stars = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(sp, 3)),
    new THREE.PointsMaterial({ color: 0xbfd4ff, size: 6, sizeAttenuation: true, transparent: true, opacity: 0.9 }));
  scene.add(stars);

  scene.add(new THREE.HemisphereLight(0x40608f, 0x080a12, 1.0));
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.2); sun.position.set(-300, 200, 400); scene.add(sun);

  // ── GLOBE (near origin) ──
  const globe = new THREE.Group(); scene.add(globe); globe.rotation.z = 0.3;
  const R = 100;
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(R, 64, 64),
    new THREE.MeshStandardMaterial({ color: 0x0e2044, roughness: 0.5, metalness: 0.2, emissive: 0x08152e, emissiveIntensity: 0.7 })));
  globe.add(new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(R*1.004, 40, 26)),
    new THREE.LineBasicMaterial({ color: 0x3f7bff, transparent: true, opacity: 0.18 })));
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(R*1.18, 48, 48), new THREE.ShaderMaterial({
    transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
    uniforms: { c: { value: new THREE.Color(0x4f8bff) } },
    vertexShader: `varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
    fragmentShader: `uniform vec3 c; varying vec3 vN; void main(){ float i=pow(0.7-dot(vN,vec3(0,0,1.0)),3.0); gl_FragColor=vec4(c,clamp(i,0.0,1.0)); }`,
  })); globe.add(atmo);
  // one hero pin on the front (the country we dive into)
  const pinDir = V(-0.15, 0.28, 1).normalize();
  const pinPos = pinDir.clone().multiplyScalar(R);
  const pin = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffcf6a }));
  pin.position.copy(pinPos.clone().addScaledVector(pinDir, 4)); globe.add(pin);
  const ring = new THREE.Mesh(new THREE.RingGeometry(5, 7, 32), new THREE.MeshBasicMaterial({ color: 0xffcf6a, side: THREE.DoubleSide, transparent: true }));
  ring.position.copy(pinPos.clone().addScaledVector(pinDir, 0.5)); ring.quaternion.setFromUnitVectors(V(0,0,1), pinDir); globe.add(ring);
  // land dots
  const dN = 1800, dp = new Float32Array(dN*3), gA = Math.PI*(3-Math.sqrt(5));
  for (let i=0;i<dN;i++){ const y=1-(i/(dN-1))*2, rr=Math.sqrt(1-y*y), th=gA*i; dp[i*3]=Math.cos(th)*rr*R*1.005; dp[i*3+1]=y*R*1.005; dp[i*3+2]=Math.sin(th)*rr*R*1.005; }
  globe.add(new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(dp,3)),
    new THREE.PointsMaterial({ color: 0x59d0ff, size: 0.8, transparent: true, opacity: 0.5 })));

  // ── CITY (far below) ──
  const city = new THREE.Group(); city.position.copy(CITY_ORIGIN); scene.add(city); city.visible = false;
  const cr = mul(4242);
  const winTex = (() => { const c=document.createElement("canvas"); c.width=64;c.height=128; const g=c.getContext("2d"); g.fillStyle="#04060a";g.fillRect(0,0,64,128); const r=mul(9); for(let y=0;y<10;y++)for(let x=0;x<5;x++){ if(r()<0.5)continue; g.fillStyle=r()>0.2?`rgb(255,${205+(r()*40|0)},${150+(r()*50|0)})`:`rgb(150,195,255)`; g.fillRect(x*12+2,y*12+2,8,9);} const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.magFilter=THREE.NearestFilter; return t; })();
  const cityGround = new THREE.Mesh(new THREE.PlaneGeometry(4000,4000), new THREE.MeshStandardMaterial({ color:0x070a12, roughness:0.9 }));
  cityGround.rotation.x=-Math.PI/2; city.add(cityGround);
  const GRID=16, STEP=16;
  for(let gx=-GRID; gx<=GRID; gx++) for(let gz=-GRID; gz<=GRID; gz++){
    if(cr()>0.82) continue; const dist=Math.hypot(gx,gz);
    const h= 8 + cr()*12 + Math.max(0,(GRID-dist))*(2.4+cr()*3.2) + (dist<2?46:0);
    const w=7+cr()*4, dp2=7+cr()*4;
    const uv=[Math.max(1,Math.round(w/4.5)), Math.max(2,Math.round(h/6))];
    const mat=new THREE.MeshStandardMaterial({ color:0x121a28, roughness:0.72, metalness:0.1, emissiveMap:winTex.clone(), emissive:new THREE.Color(0xffcf9c) });
    mat.emissiveMap.wrapS=mat.emissiveMap.wrapT=THREE.RepeatWrapping; mat.emissiveMap.repeat.set(uv[0],uv[1]); mat.emissiveMap.offset.set(cr(),cr());
    const kind=cr(); mat.emissiveIntensity = kind<0.28?0.2: kind<0.46?1.2:2.0; if(kind>=0.28&&kind<0.46) mat.emissive=new THREE.Color(0x8fb6ff);
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,dp2), mat); m.position.set(gx*STEP+(cr()-0.5)*3, h/2, gz*STEP+(cr()-0.5)*3); city.add(m);
  }
  const cityMoon=new THREE.Mesh(new THREE.SphereGeometry(60,24,24), new THREE.MeshBasicMaterial({ color:0xffe6c0 })); cityMoon.position.copy(CITY_ORIGIN.clone().add(V(700,520,-1200))); scene.add(cityMoon);
  const cityKey=new THREE.DirectionalLight(0xffb673,1.3); cityKey.position.copy(CITY_ORIGIN.clone().add(V(400,300,-600))); scene.add(cityKey);

  // ── flash plane parented to camera (hides the globe→city cut) ──
  const flash = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.4), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthTest: false, blending: THREE.AdditiveBlending, fog: false }));
  flash.position.set(0, 0, -2.2); camera.add(flash);

  // ── post ──
  const composer = new EffectComposer(renderer); composer.setSize(width, height);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.9, 0.7, 0.15); composer.addPass(bloom);

  // camera keyframes (position, lookAt)
  const near = pinPos.clone().multiplyScalar(1.0);
  function render(t) {
    globe.rotation.y = -0.5 + t * 0.05;
    // TIMELINE
    const swap = 11.2;
    if (t < swap) { globe.visible = true; city.visible = false; }
    else { globe.visible = false; city.visible = true; }

    let pos, look;
    if (t < 4) {                         // SPACE → approach
      const k = smooth(0, 4, t);
      pos = V(lerp(40, 20, k), lerp(30, 12, k), lerp(560, 300, k));
      look = V(0, 0, 0);
    } else if (t < 8) {                  // orbit closer, aim toward the pin
      const k = smooth(4, 8, t);
      pos = V(lerp(20, near.x*1.9, k), lerp(12, near.y*1.9+8, k), lerp(300, 190, k));
      look = V(lerp(0, pinPos.x*0.5, k), lerp(0, pinPos.y*0.5, k), lerp(0, pinPos.z*0.5, k));
    } else if (t < swap) {               // DIVE to the surface
      const k = smooth(8, swap, t); const kk = k*k;
      const target = pinPos.clone().addScaledVector(pinDir, lerp(70, 6, kk));
      pos = target; look = pinPos.clone().addScaledVector(pinDir, -20);
      bloom.strength = 0.9 + kk * 1.2;   // energy builds into the flash
    } else if (t < 13.2) {               // EMERGE over the city (high), begin crane
      const k = smooth(swap, 13.2, t);
      pos = CITY_ORIGIN.clone().add(V(lerp(-120, -80, k), lerp(360, 250, k), lerp(360, 300, k)));
      look = CITY_ORIGIN.clone().add(V(0, lerp(70, 55, k), 0));
      bloom.strength = 0.9;
    } else {                             // CRANE down toward street level
      const k = smooth(13.2, 20, t);
      pos = CITY_ORIGIN.clone().add(V(lerp(-80, -30, k), lerp(250, 60, k), lerp(300, 150, k)));
      look = CITY_ORIGIN.clone().add(V(0, lerp(55, 40, k), 0));
    }
    camera.position.copy(pos); camera.lookAt(look);

    // flash burst around the swap
    flash.material.opacity = Math.max(0, 1 - Math.abs(t - swap) / 0.85) ** 1.5;

    composer.render();
    bloom.strength = Math.min(bloom.strength ?? 0.9, 2.1);
  }
  return { scene, camera, render };
}
