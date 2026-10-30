// Mar negro de estudio: espejo planar real (Reflector) con normales procedurales (oleaje mínimo + anillos de
// eventos: chapoteos, estelas, caídas), fresnel, brillo del reflector del helicóptero y niebla. Más gotas
// (salpicaduras con física) y espuma en la línea de flotación. Determinista: todo sale del tiempo t.
import React, { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { mulberry32 } from "../stickman3d/prng";

export const MAX_ONDAS = 48;
export type Onda = { x: number; z: number; t0: number; amp: number; vel?: number; ancho?: number };
export type LuzAgua = { pos: THREE.Vector3; dir: THREE.Vector3; cosExt: number; cosInt: number; int: number };

const VERT = /* glsl */ `
uniform mat4 textureMatrix;
varying vec4 vUvR;
varying vec3 vW;
void main() {
  vUvR = textureMatrix * vec4(position, 1.0);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const FRAG = /* glsl */ `
uniform vec3 color;
uniform sampler2D tDiffuse;
uniform float uT;
uniform vec4 uOnda[${MAX_ONDAS}];   // x, z, t0, amp
uniform vec2 uOndaP[${MAX_ONDAS}];  // velocidad, ancho
uniform int uN;
uniform vec3 uCam;
uniform vec3 uLuzDir; uniform float uLuzInt;
uniform vec3 uSpotPos; uniform vec3 uSpotDir; uniform float uSpotExt; uniform float uSpotInt; uniform float uSpotCosI;
uniform vec3 uNieblaC; uniform float uNiebla;
uniform float uRefl;
varying vec4 vUvR;
varying vec3 vW;

float altura(vec2 p) {
  // oleaje de estudio: muy chico, lento, varias direcciones
  float h = 0.0;
  h += 0.010 * sin(dot(p, vec2(0.83, 0.55)) * 2.1 + uT * 0.9);
  h += 0.007 * sin(dot(p, vec2(-0.42, 0.91)) * 3.3 + uT * 1.3);
  h += 0.004 * sin(dot(p, vec2(0.97, -0.24)) * 6.1 + uT * 1.9);
  h += 0.0025 * sin(dot(p, vec2(-0.7, -0.7)) * 11.0 + uT * 2.7);
  for (int i = 0; i < ${MAX_ONDAS}; i++) {
    if (i >= uN) break;
    float age = uT - uOnda[i].z;
    if (age <= 0.0) continue;
    float d = length(p - uOnda[i].xy);
    float fr = age * uOndaP[i].x;               // frente
    float w = uOndaP[i].y + age * 0.25;          // el tren se ensancha
    float x = (d - fr) / w;
    float env = exp(-x * x) * exp(-age * 0.9) / (1.0 + d * 1.2);
    h += uOnda[i].w * env * sin((d - fr) * 16.0 / (0.6 + age * 0.35));
  }
  return h;
}

void main() {
  vec2 p = vW.xz;
  float e = 0.02;
  float h0 = altura(p);
  vec3 n = normalize(vec3(-(altura(p + vec2(e, 0.0)) - h0) / e, 1.0, -(altura(p + vec2(0.0, e)) - h0) / e));
  vec3 v = normalize(uCam - vW);
  float fres = 0.02 + 0.98 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
  vec4 uv = vUvR; uv.xy += n.xz * 0.9 * uv.w * 0.06;
  vec3 refl = texture2DProj(tDiffuse, uv).rgb;
  vec3 c = color + refl * mix(0.32, 1.0, fres) * uRefl;
  // luz de luna (direccional): brillo especular alargado
  vec3 hL = normalize(uLuzDir + v);
  c += vec3(0.85, 0.9, 1.0) * pow(max(dot(n, hL), 0.0), 260.0) * 1.8 * uLuzInt;
  // reflector del helicóptero: charco de luz + destellos
  vec3 L = uSpotPos - vW; float dl = length(L); L /= dl;
  float cone = smoothstep(uSpotExt, uSpotCosI, dot(-L, uSpotDir));
  c += vec3(0.62, 0.66, 0.7) * cone * uSpotInt * 0.05 * (0.6 + 0.4 * max(dot(n, L), 0.0));
  vec3 hS = normalize(L + v);
  c += vec3(1.0, 0.98, 0.95) * cone * uSpotInt * pow(max(dot(n, hS), 0.0), 160.0) * 4.0;
  // niebla de profundidad
  float dc = length(uCam - vW);
  c = mix(c, uNieblaC, 1.0 - exp(-uNiebla * uNiebla * dc * dc));
  gl_FragColor = vec4(c, 1.0);
}`;

export const usarAgua = (tam = 140, res = 1024) => {
  const { gl } = useThree();
  return useMemo(() => {
    const geo = new THREE.PlaneGeometry(tam, tam);
    const r = new Reflector(geo, {
      textureWidth: res * 2, textureHeight: res, clipBias: 0.003, color: new THREE.Color(0.006, 0.0075, 0.009), // sin esto Reflector pone 0x7f7f7f (agua gris)
      shader: {
        name: "MarNegro",
        uniforms: {
          color: { value: new THREE.Color(0.006, 0.0075, 0.009) }, tDiffuse: { value: null }, textureMatrix: { value: null },
          uT: { value: 0 }, uOnda: { value: Array.from({ length: MAX_ONDAS }, () => new THREE.Vector4()) },
          uOndaP: { value: Array.from({ length: MAX_ONDAS }, () => new THREE.Vector2(1, 0.2)) }, uN: { value: 0 },
          uCam: { value: new THREE.Vector3() }, uLuzDir: { value: new THREE.Vector3(-0.4, 1, 0.3).normalize() }, uLuzInt: { value: 1 },
          uSpotPos: { value: new THREE.Vector3(0, 50, 0) }, uSpotDir: { value: new THREE.Vector3(0, -1, 0) }, uSpotExt: { value: 0.95 }, uSpotCosI: { value: 0.98 }, uSpotInt: { value: 0 },
          uNieblaC: { value: new THREE.Color(0.012, 0.014, 0.016) }, uNiebla: { value: 0.035 }, uRefl: { value: 1 },
        },
        vertexShader: VERT, fragmentShader: FRAG,
      },
    });
    r.rotation.x = -Math.PI / 2;
    // el espejo sólo se recalcula en el render principal (no en los pases de AO/profundidad del post)
    const orig = r.onBeforeRender.bind(r);
    r.onBeforeRender = (rd, sc, cam, ...rest) => { if (sc.overrideMaterial) return; (orig as (...a: unknown[]) => void)(rd, sc, cam, ...rest); };
    void gl;
    return r;
  }, [gl, tam, res]);
};

export const actualizarAgua = (r: Reflector, o: { t: number; cam: THREE.Vector3; ondas: Onda[]; spot?: LuzAgua; luzInt?: number; niebla?: number; refl?: number }) => {
  const u = (r.material as THREE.ShaderMaterial).uniforms;
  u.uT.value = o.t;
  (u.uCam.value as THREE.Vector3).copy(o.cam);
  // las ondas vivas más recientes
  const vivas = o.ondas.filter((w) => o.t >= w.t0 && o.t - w.t0 < 7).sort((a, b) => b.t0 - a.t0).slice(0, MAX_ONDAS);
  vivas.forEach((w, i) => { (u.uOnda.value[i] as THREE.Vector4).set(w.x, w.z, w.t0, w.amp); (u.uOndaP.value[i] as THREE.Vector2).set(w.vel ?? 1.1, w.ancho ?? 0.18); });
  u.uN.value = vivas.length;
  u.uLuzInt.value = o.luzInt ?? 1;
  u.uNiebla.value = o.niebla ?? 0.035;
  u.uRefl.value = o.refl ?? 1;
  if (o.spot) {
    (u.uSpotPos.value as THREE.Vector3).copy(o.spot.pos); (u.uSpotDir.value as THREE.Vector3).copy(o.spot.dir);
    u.uSpotExt.value = o.spot.cosExt; u.uSpotCosI.value = o.spot.cosInt; u.uSpotInt.value = o.spot.int;
  } else u.uSpotInt.value = 0;
};

// ───────────────────────── salpicaduras ─────────────────────────
export type Salpicon = { x: number; y?: number; z: number; t0: number; n: number; fuerza: number; dir?: [number, number]; semilla: number; corona?: boolean };
const G = 9.8 * 0.55; // gravedad «de maqueta» (un poco lenta, se lee mejor)

type Gota = { x: number; y: number; z: number; vx: number; vy: number; vz: number; t0: number; r: number };
export const gotasDe = (ss: Salpicon[]): Gota[] => {
  const out: Gota[] = [];
  ss.forEach((s) => {
    const rnd = mulberry32(s.semilla);
    for (let i = 0; i < s.n; i++) {
      const a = rnd() * Math.PI * 2, corona = s.corona !== false && rnd() < 0.55;
      const sube = corona ? 1.3 + rnd() * 1.6 : 2.2 + rnd() * 2.8;
      const lat = corona ? 0.9 + rnd() * 1.2 : 0.2 + rnd() * 0.8;
      const dx = s.dir ? s.dir[0] : 0, dz = s.dir ? s.dir[1] : 0;
      out.push({
        x: s.x + Math.cos(a) * 0.08, y: s.y ?? 0, z: s.z + Math.sin(a) * 0.08,
        vx: (Math.cos(a) * lat + dx * (0.5 + rnd())) * s.fuerza, vy: sube * s.fuerza, vz: (Math.sin(a) * lat + dz * (0.5 + rnd())) * s.fuerza,
        t0: s.t0 + rnd() * 0.06, r: (0.012 + rnd() * rnd() * 0.035) * Math.sqrt(s.fuerza),
      });
    }
  });
  return out;
};

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _v = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0);

export const Gotas: React.FC<{ gotas: Gota[]; t: number; mat: THREE.Material }> = ({ gotas, t, mat }) => {
  const im = useMemo(() => {
    const m = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), mat, Math.max(1, gotas.length));
    m.frustumCulled = false; m.userData.sinPost = true; m.castShadow = false;
    return m;
  }, [gotas, mat]);
  let k = 0;
  gotas.forEach((g) => {
    const a = t - g.t0;
    if (a < 0) return;
    const y = g.y + g.vy * a - 0.5 * G * a * a;
    if (y < -0.02) return;
    _p.set(g.x + g.vx * a, y, g.z + g.vz * a);
    _v.set(g.vx, g.vy - G * a, g.vz);
    const vel = _v.length();
    _q.setFromUnitVectors(_up, _v.normalize());
    const est = 1 + Math.min(2.2, vel * 0.22); // se estiran según la velocidad
    _s.set(g.r / Math.sqrt(est), g.r * est, g.r / Math.sqrt(est));
    _m.compose(_p, _q, _s);
    im.setMatrixAt(k++, _m);
  });
  im.count = k;
  im.instanceMatrix.needsUpdate = true;
  return <primitive object={im} visible={k > 0} />;
};

// espuma: manchitas blancas aplastadas que flotan y se apagan alrededor de un punto (línea de flotación)
export type Espuma = { x: number; z: number; t0: number; t1: number; radio: number; n: number; semilla: number };
export const EspumaMallas: React.FC<{ focos: Espuma[]; t: number; mat: THREE.Material; sigue?: (i: number, t: number) => [number, number] | null }> = ({ focos, t, mat, sigue }) => {
  const total = focos.reduce((s, f) => s + f.n, 0);
  const im = useMemo(() => {
    const m = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 6), mat, Math.max(1, total));
    m.frustumCulled = false; m.userData.sinPost = true;
    return m;
  }, [total, mat]);
  let k = 0;
  focos.forEach((f, fi) => {
    if (t < f.t0 || t > f.t1 + 1.2) return;
    const c = sigue?.(fi, t) ?? [f.x, f.z];
    const rnd = mulberry32(f.semilla);
    const vida = Math.min(1, (t - f.t0) / 0.25) * (t > f.t1 ? Math.max(0, 1 - (t - f.t1) / 1.2) : 1);
    for (let i = 0; i < f.n; i++) {
      const a = rnd() * Math.PI * 2 + t * (0.2 + rnd() * 0.3) * (rnd() < 0.5 ? -1 : 1);
      const rr = f.radio * (0.55 + 0.6 * Math.sqrt(rnd())) * (1 + 0.15 * Math.sin(t * 3 + i));
      const tam = (0.012 + 0.03 * rnd()) * vida * (0.75 + 0.25 * Math.sin(t * 4.3 + i * 1.7));
      if (tam < 0.002) continue;
      _p.set(c[0] + Math.cos(a) * rr, 0.004, c[1] + Math.sin(a) * rr);
      _q.identity(); _s.set(tam * 1.6, tam * 0.3, tam);
      _m.compose(_p, _q, _s);
      im.setMatrixAt(k++, _m);
    }
  });
  im.count = k;
  im.instanceMatrix.needsUpdate = true;
  return <primitive object={im} visible={k > 0} />;
};
