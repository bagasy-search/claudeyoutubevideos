// OleDutchOven3D — olla de hierro fundido (Dutch oven) 3D real sobre la hornalla de una cocina a leña (o sobre brasas).
// La tapa se levanta (o queda torcida = "throttle") y deja ver los porotos pinto en su caldo; el hervor cambia de estado
// por props: rolling (hervor fuerte) · whisper (una burbuja perezosa) · still · cold. Vapor, espuma y porotos que se sacuden.
// Todo animado por useCurrentFrame (nada de useFrame); partículas y texturas deterministas (rnd).
// También exporta las piezas compartidas (olla de hierro, texturas, cámara) que usa OleBeanHole3D.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OLE, LABEL, HAND, rnd, hexA, kraftBg } from "./OleTheme";

// ───────────────────────── utilidades compartidas ─────────────────────────
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const ease = Easing.bezier(0.33, 0, 0.2, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const smooth = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
/** ruido 1D suave determinista */
export function noise1(x: number, seed = 0) {
  const i = Math.floor(x), f = x - i;
  const a = rnd(seed * 7919 + i), b = rnd(seed * 7919 + i + 1);
  const u = f * f * (3 - 2 * f);
  return a + (b - a) * u;
}

export function canvasTex(draw: (c: CanvasRenderingContext2D, W: number, H: number) => void, W = 512, H = W, rx = 1, ry = rx) {
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const c = cv.getContext("2d")!; draw(c, W, H);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  if (rx !== 1 || ry !== 1) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); }
  t.anisotropy = 4;
  return t;
}
export function dots(c: CanvasRenderingContext2D, W: number, H: number, seed: number, n: number, col: string, rMin: number, rMax: number, alpha = 1) {
  c.fillStyle = col; c.globalAlpha = alpha;
  for (let i = 0; i < n; i++) {
    const x = rnd(seed + i * 3) * W, y = rnd(seed + i * 3 + 1) * H, r = rMin + rnd(seed + i * 3 + 2) * (rMax - rMin);
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
  }
  c.globalAlpha = 1;
}
/** sprite blando (vapor / humo) */
export function softTex(inner = "rgba(255,255,255,0.95)", S = 128) {
  return canvasTex((c, W) => {
    const g = c.createRadialGradient(W / 2, W / 2, 0, W / 2, W / 2, W / 2);
    g.addColorStop(0, inner); g.addColorStop(0.45, inner.replace(/[\d.]+\)$/, "0.45)")); g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g; c.fillRect(0, 0, W, W);
  }, S);
}

/** la cámara por defecto del ThreeCanvas, reubicada en cada cuadro (sin useFrame) */
export const CamRig: React.FC<{ pos: [number, number, number]; target: [number, number, number]; fov?: number; clip?: boolean }> = ({ pos, target, fov, clip }) => {
  const { camera, gl } = useThree();
  if (clip) gl.localClippingEnabled = true;
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.lookAt(target[0], target[1], target[2]);
  if (fov) (camera as any).fov = fov;
  camera.updateProjectionMatrix();
  return null;
};

/** proyecta un punto 3D a píxeles de pantalla con la misma cámara (para rótulos con línea guía) */
export function projectTo(p: [number, number, number], pos: [number, number, number], target: [number, number, number], fov: number, W: number, H: number) {
  const cam = new THREE.PerspectiveCamera(fov, W / H, 0.1, 100);
  cam.position.set(pos[0], pos[1], pos[2]); cam.lookAt(target[0], target[1], target[2]); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = new THREE.Vector3(p[0], p[1], p[2]).project(cam);
  return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H] as [number, number];
}

// ───────────────────────── la olla de hierro (compartida) ─────────────────────────
// radio exterior 1, alto 0.88 (sin tapa). La tapa apoya en y = RIM.
export const RIM = 0.88;
export const INNER_R = 0.93;
export const BODY_PROFILE: [number, number][] = [[0, 0], [0.86, 0], [0.96, 0.035], [1.0, 0.13], [1.0, 0.8], [1.035, 0.83], [1.035, 0.875], [0.95, 0.88], [0.93, 0.85], [0.93, 0.13], [0.87, 0.075], [0, 0.075]];
export const LID_PROFILE: [number, number][] = [[0, 0.155], [0.45, 0.135], [0.82, 0.075], [1.03, 0.022], [1.055, 0.0], [0.99, -0.004], [0.925, -0.045], [0.9, -0.045], [0.9, 0.01], [0.6, 0.06], [0, 0.1]];

export function ironTextures() {
  const rough = canvasTex((c, W, H) => {
    c.fillStyle = "#8a8a8a"; c.fillRect(0, 0, W, H);
    dots(c, W, H, 3, 2600, "#b5b5b5", 0.6, 2.2, 0.55); dots(c, W, H, 9, 1800, "#5a5a5a", 0.6, 2.5, 0.5);
  }, 256, 256, 4, 2);
  const col = canvasTex((c, W, H) => {
    c.fillStyle = "#2f2c29"; c.fillRect(0, 0, W, H);
    dots(c, W, H, 13, 2200, "#3f3a35", 0.5, 2, 0.6); dots(c, W, H, 17, 900, "#1d1b19", 0.6, 2.4, 0.5);
    dots(c, W, H, 23, 60, "#5a3a24", 2, 6, 0.10); // pátina de óxido muy leve
  }, 256, 256, 4, 2);
  return { rough, col };
}
export function makeIronMats(clip?: any[]) {
  const { rough, col } = ironTextures();
  const base = { clippingPlanes: clip ?? null, side: THREE.DoubleSide };
  return {
    iron: new THREE.MeshStandardMaterial({ map: col, roughnessMap: rough, roughness: 0.62, metalness: 0.45, color: "#ffffff", ...base }),
    ironLid: new THREE.MeshStandardMaterial({ map: col, roughnessMap: rough, roughness: 0.5, metalness: 0.5, color: "#ffffff", ...base }),
    wire: new THREE.MeshStandardMaterial({ color: "#3b3834", roughness: 0.45, metalness: 0.7, ...base }),
  };
}
export function tube(points: [number, number, number][], r: number, seg = 40) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
  return new THREE.TubeGeometry(curve, seg, r, 8, false);
}
export function usePotGeoms() {
  return useMemo(() => {
    const body = new THREE.LatheGeometry(BODY_PROFILE.map(([x, y]) => new THREE.Vector2(x, y)), 64);
    const lid = new THREE.LatheGeometry(LID_PROFILE.map(([x, y]) => new THREE.Vector2(x, y)), 64);
    const handle = (s: number) => tube([[s * 0.99, 0.66, -0.22], [s * 1.16, 0.7, -0.2], [s * 1.23, 0.72, 0], [s * 1.16, 0.7, 0.2], [s * 0.99, 0.66, 0.22]], 0.034);
    const knob = tube([[-0.24, 0.1, 0], [-0.2, 0.25, 0], [0, 0.31, 0], [0.2, 0.25, 0], [0.24, 0.1, 0]], 0.038);
    const lug = new THREE.CylinderGeometry(0.05, 0.06, 0.1, 10);
    return { body, lid, hL: handle(-1), hR: handle(1), knob, lug };
  }, []);
}
/** bail (asa de alambre) que pivota en las orejas; angle 0 = parada, ±1.4 = acostada */
export function bailGeom() {
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= 16; i++) { const a = Math.PI * (i / 16); pts.push([Math.cos(a) * 1.1, Math.sin(a) * 0.95, 0]); }
  return tube(pts.reverse(), 0.022, 60);
}

export const IronPot: React.FC<{
  mats: ReturnType<typeof makeIronMats>; geo: ReturnType<typeof usePotGeoms>;
  lid?: { y: number; x?: number; z?: number; rx?: number; rz?: number; ry?: number } | null; bail?: number | null; bailGeo?: any;
  children?: React.ReactNode;
}> = ({ mats, geo, lid, bail, bailGeo, children }) => (
  <group>
    <mesh geometry={geo.body} material={mats.iron} />
    <mesh geometry={geo.hL} material={mats.iron} />
    <mesh geometry={geo.hR} material={mats.iron} />
    {bail != null && bailGeo ? (
      <>
        <mesh geometry={geo.lug} material={mats.iron} position={[-1.05, 0.7, 0]} rotation={[0, 0, Math.PI / 2]} />
        <mesh geometry={geo.lug} material={mats.iron} position={[1.05, 0.7, 0]} rotation={[0, 0, Math.PI / 2]} />
        <group position={[0, 0.7, 0]} rotation={[bail, 0, 0]}><mesh geometry={bailGeo} material={mats.wire} /></group>
      </>
    ) : null}
    {children}
    {lid ? (
      <group position={[lid.x ?? 0, RIM + lid.y, lid.z ?? 0]} rotation={[lid.rx ?? 0, lid.ry ?? 0, lid.rz ?? 0]}>
        <mesh geometry={geo.lid} material={mats.ironLid} />
        <mesh geometry={geo.knob} material={mats.ironLid} position={[0, 0.1, 0]} />
      </group>
    ) : null}
  </group>
);

/** poroto: elipsoide liso con curva de riñón (radio largo ~0.075) */
export function beanGeom(L = 0.06) {
  const g = new THREE.SphereGeometry(1, 20, 12);
  const p = g.attributes.position as any;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    p.setXYZ(i, x * L, y * L * 0.5, z * L * 0.6 + L * 0.16 * (x * x - 0.5));
  }
  g.computeVertexNormals(); return g;
}
export function beanTex() {
  return canvasTex((c, W, H) => {
    c.fillStyle = "#AE7456"; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 26; i++) { // moteado suave del pinto cocido
      const x = rnd(400 + i) * W, y = rnd(500 + i) * H, r = 8 + rnd(600 + i) * 14;
      c.fillStyle = `rgba(118,66,42,${0.16 + rnd(i + 3) * 0.14})`;
      c.beginPath(); c.ellipse(x, y, r, r * 0.6, rnd(i + 5) * 3, 0, Math.PI * 2); c.fill();
    }
    dots(c, W, H, 71, 160, "#C99274", 1, 2.5, 0.35);
  }, 256, 128);
}

// ───────────────────────── estados del hervor ─────────────────────────
export type BoilMode = "rolling" | "whisper" | "still" | "cold";
type BoilP = { roll: number; lazy: number; steam: number; wobble: number; foam: number; shake: number; cold: number };
const MODE_P: Record<BoilMode, BoilP> = {
  rolling: { roll: 1, lazy: 0, steam: 1, wobble: 1, foam: 1, shake: 1, cold: 0 },
  whisper: { roll: 0, lazy: 1, steam: 0.4, wobble: 0.06, foam: 0.12, shake: 0.04, cold: 0 },
  still: { roll: 0, lazy: 0, steam: 0.2, wobble: 0, foam: 0, shake: 0, cold: 0 },
  cold: { roll: 0, lazy: 0, steam: 0, wobble: 0, foam: 0, shake: 0, cold: 1 },
};
function boilAt(states: { at: number; mode: BoilMode }[], t: number): BoilP {
  const st = [...states].sort((a, b) => a.at - b.at);
  let cur = MODE_P[st[0]?.mode ?? "rolling"];
  for (let i = 1; i < st.length; i++) {
    const k = clamp01((t - st[i].at) / 1.1);
    if (k <= 0) break;
    const nx = MODE_P[st[i].mode];
    const e = smooth(k);
    cur = Object.fromEntries(Object.keys(cur).map((key) => [key, (cur as any)[key] * (1 - e) + (nx as any)[key] * e])) as BoilP;
  }
  return cur;
}
function levelAt(level: number | { at: number; level: number }[], t: number) {
  if (typeof level === "number") return level;
  const ks = [...level].sort((a, b) => a.at - b.at);
  if (!ks.length) return 0.7;
  return interpolate(t, ks.map((k) => k.at).concat(ks.length === 1 ? [ks[0].at + 1] : []), ks.map((k) => k.level).concat(ks.length === 1 ? [ks[0].level] : []), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
}

// ───────────────────────── interior: caldo, porotos, burbujas, espuma, vapor ─────────────────────────
const NB = 300, NBUB = 70, NFOAM = 60, NSTEAM = 34;

const PotInterior: React.FC<{ t: number; bp: BoilP; surfY: number; lidOpenAmt: number; crack: number; closedLeak: number }> = ({ t, bp, surfY, lidOpenAmt, crack, closedLeak }) => {
  const res = useMemo(() => {
    const surf = new THREE.RingGeometry(0.001, INNER_R - 0.004, 72, 14);
    surf.rotateX(-Math.PI / 2);
    const base = (surf.attributes.position.array as Float32Array).slice();
    const liquid = new THREE.MeshStandardMaterial({ color: "#7A4526", roughness: 0.16, metalness: 0.05 });
    const beanGeo = beanGeom();
    const beanMat = new THREE.MeshStandardMaterial({ map: beanTex(), roughness: 0.34, metalness: 0 });
    const beans = new THREE.InstancedMesh(beanGeo, beanMat, NB);
    const bubGeo = new THREE.SphereGeometry(1, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const bubMat = new THREE.MeshStandardMaterial({ color: "#DDB892", roughness: 0.04, metalness: 0.2, transparent: true, opacity: 0.66 });
    const bubs = new THREE.InstancedMesh(bubGeo, bubMat, NBUB + 3);
    const foamGeo = new THREE.SphereGeometry(1, 8, 6);
    const foamMat = new THREE.MeshStandardMaterial({ color: "#EFDDBE", roughness: 0.55 });
    const foam = new THREE.InstancedMesh(foamGeo, foamMat, NFOAM);
    const ringGeo = new THREE.TorusGeometry(1, 0.012, 6, 48); ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshStandardMaterial({ color: "#B98458", roughness: 0.15, transparent: true, opacity: 0.6 });
    const ripple = new THREE.Mesh(ringGeo, ringMat);
    const steamTex = softTex("rgba(255,255,255,0.9)");
    const steams = Array.from({ length: NSTEAM }, () => new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, depthWrite: false, opacity: 0 })));
    const beanData = Array.from({ length: NB }, (_, i) => {
      // espiral de Vogel con jitter: reparto parejo, sin montoncitos
      const a = i * 2.39996 + (rnd(i * 5 + 1) - 0.5) * 0.5, r = Math.sqrt((i + 0.5) / NB) * (INNER_R - 0.07) * (0.97 + rnd(i * 5 + 2) * 0.05);
      return { x: Math.cos(a) * r, z: Math.sin(a) * r, dy: -0.024 + rnd(i * 5 + 3) * 0.024, ry: rnd(i * 5 + 4) * 6.28, rx: (rnd(i * 5 + 5) - 0.5) * 0.5, s: 0.9 + rnd(i * 7 + 9) * 0.22, ph: rnd(i * 13) * 20 };
    });
    return { surf, base, liquid, beans, bubs, foam, ripple, steams, beanData };
  }, []);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();

  // superficie: tiembla con el hervor
  const pos = res.surf.attributes.position as any;
  const arr = pos.array as Float32Array;
  for (let i = 0; i < pos.count; i++) {
    const x = res.base[i * 3], z = res.base[i * 3 + 2];
    const w = bp.wobble * (0.012 * Math.sin(x * 11 + t * 9) * Math.cos(z * 9 - t * 7) + 0.008 * Math.sin((x + z) * 23 + t * 15))
      + bp.lazy * 0.004 * Math.sin(Math.hypot(x - 0.25, z + 0.1) * 30 - t * 6) * Math.exp(-Math.hypot(x - 0.25, z + 0.1) * 3);
    arr[i * 3 + 1] = w;
  }
  pos.needsUpdate = true; res.surf.computeVertexNormals();
  const coldCol = new THREE.Color("#7A4526").lerp(new THREE.Color("#8FA0A6"), bp.cold);
  res.liquid.color.copy(coldCol);
  res.liquid.opacity = 1 - 0.55 * bp.cold; res.liquid.transparent = bp.cold > 0.01; res.liquid.depthWrite = bp.cold < 0.01;

  // porotos: algunos flotan, se sacuden con el hervor
  res.beanData.forEach((b, i) => {
    const sh = bp.shake;
    const jx = sh * 0.02 * (noise1(t * 6 + b.ph, i) - 0.5), jz = sh * 0.02 * (noise1(t * 6 + b.ph, i + 999) - 0.5);
    const jy = sh * 0.02 * Math.sin(t * 14 + b.ph) + bp.lazy * 0.003 * Math.sin(t * 1.3 + b.ph);
    p.set(b.x + jx, surfY + b.dy + jy - bp.cold * 0.09, b.z + jz);
    e.set(b.rx + sh * 0.5 * Math.sin(t * 8 + b.ph), b.ry + sh * 0.6 * (noise1(t * 3 + b.ph, i + 7) - 0.5), 0); q.setFromEuler(e);
    s.set(b.s, b.s, b.s);
    m.compose(p, q, s); res.beans.setMatrixAt(i, m);
  });
  res.beans.instanceMatrix.needsUpdate = true;

  // burbujas grandes (rolling) + la perezosa (whisper)
  for (let i = 0; i < NBUB; i++) {
    const per = 0.45 + rnd(i * 3 + 700) * 0.6, ph = rnd(i * 3 + 701) * per;
    const cyc = Math.floor((t + ph) / per), lt = ((t + ph) % per) / per;
    const a = rnd(i * 31 + cyc * 7) * 6.28, r = Math.sqrt(rnd(i * 37 + cyc * 11)) * (INNER_R - 0.1);
    const on = i < NBUB * bp.roll ? 1 : 0;
    const sz = on * (0.025 + rnd(i * 41 + cyc) * 0.06) * Math.sin(Math.min(1, lt * 1.15) * Math.PI) ** 0.6;
    p.set(Math.cos(a) * r, surfY - 0.004, Math.sin(a) * r); q.identity(); s.set(sz + 1e-5, sz * 0.7 + 1e-5, sz + 1e-5);
    m.compose(p, q, s); res.bubs.setMatrixAt(i, m);
  }
  // perezosa: UNA burbuja cada ~1.5 s en un lugar nuevo; crece lento, revienta y deja una onda
  let rippleOn = 0, rippleR = 0, rx = 0, rz = 0;
  {
    const per = 1.5, cyc = Math.floor(t / per), lt = (t % per) / per;
    const spot = (c: number) => { const a = rnd(900 + c * 17) * 6.28, r = 0.12 + rnd(910 + c * 13) * 0.5; return [Math.cos(a) * r, Math.sin(a) * r]; };
    const [bx, bz] = spot(cyc);
    const grow = lt < 0.72 ? Math.sin((lt / 0.72) * Math.PI / 2) : 0;
    const sz = bp.lazy * 0.1 * grow;
    p.set(bx, surfY - 0.004, bz); q.identity(); s.set(sz + 1e-5, sz * 0.85 + 1e-5, sz + 1e-5);
    m.compose(p, q, s); res.bubs.setMatrixAt(NBUB, m);
    for (let k = 1; k < 3; k++) { m.compose(p, q, new THREE.Vector3(1e-5, 1e-5, 1e-5)); res.bubs.setMatrixAt(NBUB + k, m); }
    if (lt >= 0.72) { const u = (lt - 0.72) / 0.28; rippleOn = bp.lazy * (1 - u); rippleR = 0.06 + u * 0.3; rx = bx; rz = bz; }
    else if (lt < 0.2 && cyc > 0) { const [px, pz] = spot(cyc - 1); const u = 1 + lt / 0.28; rippleOn = bp.lazy * Math.max(0, 1 - u) ; rippleR = 0.06 + u * 0.3; rx = px; rz = pz; }
  }
  res.bubs.instanceMatrix.needsUpdate = true;
  res.ripple.position.set(rx, surfY + 0.004, rz); res.ripple.scale.set(rippleR, 1, rippleR);
  (res.ripple.material as any).opacity = 0.7 * rippleOn; res.ripple.visible = rippleOn > 0.02;

  // espuma clara contra el borde
  for (let i = 0; i < NFOAM; i++) {
    const a = (i / NFOAM) * 6.28 + rnd(i + 300) * 0.12, r = INNER_R - 0.03 - rnd(i + 310) * 0.05;
    const sz = bp.foam * (0.028 + rnd(i + 320) * 0.03) * (0.8 + 0.25 * Math.sin(t * 7 + i));
    p.set(Math.cos(a) * r, surfY + 0.005, Math.sin(a) * r); q.identity(); s.set(sz + 1e-5, sz * 0.45 + 1e-5, sz + 1e-5);
    m.compose(p, q, s); res.foam.setMatrixAt(i, m);
  }
  res.foam.instanceMatrix.needsUpdate = true;

  // vapor: sube del caldo si la tapa está abierta; por la rendija si está torcida; hilitos por el borde si está cerrada
  const openSteam = bp.steam * (0.25 + 0.75 * lidOpenAmt);
  res.steams.forEach((sp, i) => {
    const per = 2.6 + rnd(i + 50) * 1.6, ph = rnd(i + 60) * per;
    const lt = ((t + ph) % per) / per, cyc = Math.floor((t + ph) / per);
    const fromGap = i % 2 === 0 && crack > 0.01 && lidOpenAmt < 0.5;
    let x0: number, z0: number, y0: number;
    if (fromGap) { const a = Math.PI * (0.3 + rnd(i * 3 + cyc) * 0.4); x0 = Math.cos(a) * 0.82; z0 = Math.sin(a) * 0.82; y0 = RIM + 0.02; }
    else if (lidOpenAmt < 0.5) { const a = rnd(i * 5 + cyc) * 6.28; x0 = Math.cos(a) * 1.02; z0 = Math.sin(a) * 1.02; y0 = RIM + 0.02; }
    else { const a = rnd(i * 5 + cyc) * 6.28, r = Math.sqrt(rnd(i * 9 + cyc)) * 0.75; x0 = Math.cos(a) * r; z0 = Math.sin(a) * r; y0 = surfY; }
    const rise = lt * (1.6 + rnd(i + 70) * 1.2);
    const drift = (noise1(t * 0.6 + i, i) - 0.5) * 0.7 * lt + lt * 0.35;
    sp.position.set(x0 + drift, y0 + rise, z0 - lt * 0.2);
    const sc = 0.25 + lt * (1.1 + rnd(i + 80) * 0.6);
    sp.scale.set(sc, sc, 1);
    const w = fromGap ? crack * Math.max(0.55, bp.steam) * 1.1 : lidOpenAmt < 0.5 ? closedLeak * bp.steam * 0.35 : openSteam;
    (sp.material as any).opacity = Math.max(0, Math.sin(lt * Math.PI) ** 1.3 * 0.42 * w);
    sp.visible = (sp.material as any).opacity > 0.004;
  });

  return (
    <group>
      <mesh geometry={res.surf} material={res.liquid} position={[0, surfY, 0]} />
      <primitive object={res.beans} />
      <primitive object={res.bubs} />
      <primitive object={res.foam} />
      <primitive object={res.ripple} />
      {res.steams.map((sp, i) => <primitive key={i} object={sp} />)}
    </group>
  );
};

// ───────────────────────── escenario: cocina a leña / brasas, pared de troncos ─────────────────────────
function useSetMats(on: "stove" | "coals") {
  return useMemo(() => {
    const logTex = canvasTex((c, W, H) => {
      // u = alrededor del tronco (W), v = a lo largo (H): la veta corre a lo largo
      const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, "#9C7248"); g.addColorStop(0.25, "#D9B07C"); g.addColorStop(0.5, "#E2BC88"); g.addColorStop(0.75, "#C49460"); g.addColorStop(1, "#9C7248");
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 70; i++) { c.strokeStyle = `rgba(110,68,32,${0.08 + rnd(i) * 0.16})`; c.lineWidth = 0.6 + rnd(i + 3) * 1.6; const x = rnd(i + 9) * W; c.beginPath(); c.moveTo(x, 0); c.bezierCurveTo(x + (rnd(i + 1) - 0.5) * 10, H / 3, x + (rnd(i + 2) - 0.5) * 10, H * 2 / 3, x + (rnd(i + 4) - 0.5) * 6, H); c.stroke(); }
      for (let i = 0; i < 14; i++) { const x = W * (0.3 + rnd(i + 41) * 0.4), y = rnd(i + 40) * H; c.fillStyle = "rgba(96,56,26,0.6)"; c.beginPath(); c.ellipse(x, y, 4, 8 + rnd(i) * 8, 0, 0, 6.28); c.fill(); }
    }, 128, 1024, 1, 2);
    const chink = new THREE.MeshStandardMaterial({ color: "#E6D6B6", roughness: 0.95 });
    const log = new THREE.MeshStandardMaterial({ map: logTex, roughness: 0.8 });
    const stoveTex = canvasTex((c, W, H) => { c.fillStyle = "#4A4640"; c.fillRect(0, 0, W, H); dots(c, W, H, 5, 3000, "#5A554D", 0.6, 2, 0.6); dots(c, W, H, 7, 1500, "#34312D", 0.6, 2, 0.5); }, 256, 256, 3, 2);
    const stove = new THREE.MeshStandardMaterial({ map: stoveTex, roughness: 0.55, metalness: 0.45 });
    const groove = new THREE.MeshBasicMaterial({ color: "#211F1C" });
    const floorTex = canvasTex((c, W, H) => { c.fillStyle = "#C49A68"; c.fillRect(0, 0, W, H); for (let k = 0; k < 6; k++) { c.fillStyle = `rgba(90,55,25,${0.05 + rnd(k) * 0.1})`; c.fillRect(0, k * H / 6, W, H / 6); c.fillStyle = "rgba(70,40,18,0.5)"; c.fillRect(0, k * H / 6, W, 3); } for (let i = 0; i < 80; i++) { c.strokeStyle = `rgba(110,68,32,${0.08 + rnd(i) * 0.14})`; c.lineWidth = 1; const y = rnd(i + 5) * H; c.beginPath(); c.moveTo(0, y); c.lineTo(W, y + (rnd(i) - 0.5) * 8); c.stroke(); } }, 512, 512, 4, 4);
    const floor = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.85 });
    const nickel = new THREE.MeshStandardMaterial({ color: "#C9CDD0", roughness: 0.22, metalness: 0.85 });
    const enamel = new THREE.MeshStandardMaterial({ color: "#E9E3D2", roughness: 0.35 });
    const frame = new THREE.MeshStandardMaterial({ color: "#EDE3CC", roughness: 0.7 });
    const pane = new THREE.MeshBasicMaterial({ color: "#E8F0F6" });
    const dirtTex = canvasTex((c, W, H) => { c.fillStyle = "#A98B68"; c.fillRect(0, 0, W, H); dots(c, W, H, 3, 5000, "#95775A", 0.6, 2, 0.45); dots(c, W, H, 5, 3000, "#BFA380", 0.6, 1.8, 0.45); dots(c, W, H, 8, 60, "#8C857A", 2, 5, 0.35); }, 512, 512, 8, 8);
    const dirt = new THREE.MeshStandardMaterial({ map: dirtTex, roughness: 1 });
    const ashTex = canvasTex((c, W, H) => { c.fillStyle = "#9C958C"; c.fillRect(0, 0, W, H); dots(c, W, H, 13, 1800, "#C8C2B8", 1, 4, 0.5); dots(c, W, H, 15, 900, "#5C5650", 1, 4, 0.5); }, 256);
    const ash = new THREE.MeshStandardMaterial({ map: ashTex, roughness: 1, transparent: true, opacity: 0.95 });
    const coalTex = canvasTex((c, W, H) => {
      c.fillStyle = "#000"; c.fillRect(0, 0, W, H); c.strokeStyle = "#FF7A2A"; c.lineCap = "round";
      for (let i = 0; i < 70; i++) { let x = rnd(i * 3) * W, y = rnd(i * 3 + 1) * H; c.lineWidth = 1 + rnd(i) * 3; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (rnd(i * 9 + k) - 0.5) * 50; y += (rnd(i * 7 + k) - 0.5) * 50; c.lineTo(x, y); } c.stroke(); }
      dots(c, W, H, 99, 90, "#FFB25A", 3, 10, 0.7);
    }, 256);
    const coal = new THREE.MeshStandardMaterial({ color: "#2A2522", roughness: 0.9, emissive: "#FF5A1A", emissiveMap: coalTex, emissiveIntensity: 1.4 });
    const stone = new THREE.MeshStandardMaterial({ color: "#B3ADA3", roughness: 0.85 });
    return { groove, floor, chink, log, stove, nickel, enamel, frame, pane, dirt, ash, coal, stone, on };
  }, [on]);
}
export function rockGeom(seed: number, detail = 1) {
  const g = new THREE.DodecahedronGeometry(1, detail);
  const p = g.attributes.position as any; const v = new THREE.Vector3();
  const map = new Map<string, number>();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
    if (!map.has(key)) map.set(key, 0.78 + rnd(seed + map.size * 7) * 0.36);
    v.multiplyScalar(map.get(key)!); p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals(); return g;
}

const Stage: React.FC<{ on: "stove" | "coals"; t: number }> = ({ on, t }) => {
  const M = useSetMats(on);
  const coals = useMemo(() => {
    const g = rockGeom(5, 0);
    const im = new THREE.InstancedMesh(g, M.coal, 150);
    const mm = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    for (let i = 0; i < 150; i++) {
      const a = rnd(i * 3 + 1) * 6.28, r = 0.3 + Math.sqrt(rnd(i * 3 + 2)) * 1.25;
      const sc = 0.07 + rnd(i * 3 + 3) * 0.08;
      e.set(rnd(i + 5) * 3, rnd(i + 6) * 3, rnd(i + 7) * 3); q.setFromEuler(e);
      mm.compose(new THREE.Vector3(Math.cos(a) * r, -0.02 + rnd(i + 8) * 0.06, Math.sin(a) * r), q, new THREE.Vector3(sc, sc * 0.7, sc));
      im.setMatrixAt(i, mm);
    }
    return im;
  }, [M]);
  const stones = useMemo(() => {
    const g = rockGeom(11, 1);
    const im = new THREE.InstancedMesh(g, M.stone, 16);
    const mm = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * 6.28 + rnd(i) * 0.1, r = 1.85;
      const sc = 0.2 + rnd(i * 3 + 3) * 0.08;
      e.set(rnd(i + 5), rnd(i + 6) * 3, rnd(i + 7)); q.setFromEuler(e);
      mm.compose(new THREE.Vector3(Math.cos(a) * r, sc * 0.4, Math.sin(a) * r), q, new THREE.Vector3(sc * 1.3, sc, sc));
      im.setMatrixAt(i, mm);
      im.setColorAt(i, new THREE.Color().setHSL(0.08, 0.06, 0.45 + rnd(i + 90) * 0.2));
    }
    return im;
  }, [M]);
  if (on === "coals") M.coal.emissiveIntensity = 1.2 + 0.35 * Math.sin(t * 2.3) + 0.15 * Math.sin(t * 5.1);
  const logs: number[] = []; for (let y = -1.6; y < 7.5; y += 0.62) logs.push(y);
  return (
    <group>
      {/* pared de troncos pelados, clara */}
      <group position={[0, 0, -2.6]}>
        <mesh material={M.chink} position={[0, 2.5, -0.25]}><planeGeometry args={[22, 12]} /></mesh>
        {logs.map((y, i) => (
          <mesh key={i} material={M.log} position={[(rnd(i) - 0.5) * 0.4, y, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.3, 0.3, 22, 20, 1, true]} /></mesh>
        ))}
        {/* ventana: fuente de la luz fría */}
        <group position={[-3.6, 2.6, 0.36]}>
          <mesh material={M.frame}><boxGeometry args={[2.1, 2.4, 0.12]} /></mesh>
          <mesh material={M.pane} position={[0, 0, 0.065]}><planeGeometry args={[1.8, 2.1]} /></mesh>
          <mesh material={M.frame} position={[0, 0, 0.08]}><boxGeometry args={[0.07, 2.1, 0.04]} /></mesh>
          <mesh material={M.frame} position={[0, 0, 0.08]}><boxGeometry args={[1.8, 0.07, 0.04]} /></mesh>
        </group>
      </group>
      {on === "stove" ? (
        <group>
          <mesh material={M.floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]}><planeGeometry args={[30, 30]} /></mesh>
          <mesh material={M.stove} position={[0.6, -0.16, -0.35]}><boxGeometry args={[4.8, 0.32, 3.0]} /></mesh>
          <mesh material={M.nickel} position={[0.6, -0.36, -0.35]}><boxGeometry args={[4.95, 0.1, 3.12]} /></mesh>
          <mesh material={M.stove} position={[0.6, -1.4, -0.4]}><boxGeometry args={[4.7, 2.0, 2.9]} /></mesh>
          <mesh material={M.nickel} position={[0.6, -0.9, 1.07]}><boxGeometry args={[4.75, 0.08, 0.06]} /></mesh>
          <mesh material={M.enamel} position={[1.9, -1.5, 1.06]}><boxGeometry args={[1.6, 1.0, 0.06]} /></mesh>
          <mesh material={M.nickel} position={[1.9, -1.2, 1.12]}><boxGeometry args={[0.7, 0.07, 0.07]} /></mesh>
          {/* hornallas (tapas redondas) */}
          {[[0, 0], [1.95, -0.15], [1.95, -1.25], [0, -1.35]].map(([x, z], i) => (
            <group key={i} position={[x, 0.004, z]}>
              <mesh material={M.groove} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.52, 0.545, 48]} /></mesh>
              <mesh material={M.groove} position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.05]} /></mesh>
            </group>
          ))}
          {/* caño de la cocina */}
          <mesh material={M.stove} position={[2.4, 3.2, -1.55]}><cylinderGeometry args={[0.24, 0.24, 7, 24]} /></mesh>
          <mesh material={M.nickel} position={[2.4, 0.5, -1.55]}><cylinderGeometry args={[0.28, 0.28, 0.12, 24]} /></mesh>
        </group>
      ) : (
        <group>
          <mesh material={M.dirt} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}><planeGeometry args={[30, 30]} /></mesh>
          <mesh material={M.ash} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}><circleGeometry args={[1.8, 48]} /></mesh>
          <primitive object={coals} />
          <primitive object={stones} />
        </group>
      )}
    </group>
  );
};

// ───────────────────────── overlays HTML: rótulo de papel y reloj de cocina ─────────────────────────
export const PaperTag: React.FC<{ text: string; sub?: string; appear: number; side?: "left" | "right"; top?: number }> = ({ text, sub, appear, side = "left", top = 70 }) => (
  <div style={{ position: "absolute", top, [side]: 80, opacity: appear, transform: `translateY(${(1 - appear) * -26}px) rotate(${side === "left" ? -2.2 : 2}deg)`, transformOrigin: "50% 0%" } as React.CSSProperties}>
    <div style={{ ...kraftBg(OLE.paper), padding: "26px 44px 24px", borderRadius: 6, boxShadow: `0 14px 30px ${hexA(OLE.forest2, 0.28)}, 0 2px 0 ${hexA("#FFFFFF", 0.6)} inset`, border: `2px solid ${OLE.line}`, maxWidth: 760 }}>
      <div style={{ position: "absolute", top: -16, left: "50%", width: 130, height: 34, marginLeft: -65, background: hexA("#EFE3C0", 0.85), transform: "rotate(-3deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }} />
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 72, letterSpacing: 5, color: OLE.forest, lineHeight: 1.02, textTransform: "uppercase" }}>{text}</div>
      {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: OLE.plaid, marginTop: 6, lineHeight: 1.1 }}>{sub}</div> : null}
    </div>
  </div>
);

export const KitchenTimer: React.FC<{ from: number; to: number; label?: string; p: number; appear: number; t: number }> = ({ from, to, label, p, appear, t }) => {
  const mins = from + (to - from) * p;
  const whole = Math.max(0, mins);
  const mm = Math.floor(whole), ss = Math.floor((whole - mm) * 60);
  const long = Math.max(from, to) >= 60;
  const txt = long ? `${Math.floor(whole / 60)}h ${String(Math.floor(whole % 60)).padStart(2, "0")}m` : `${mm}:${String(ss).padStart(2, "0")}`;
  const ang = ((whole % 60) / 60) * 360 + (long && whole % 60 < 0.001 && whole > 0 ? 360 : 0); // dial de 60 min
  const ring = to < from && whole <= 0.02 ? Math.sin(t * 40) * 3 : 0;
  return (
    <div style={{ position: "absolute", right: 80, top: 60, opacity: appear, transform: `scale(${0.85 + 0.15 * appear}) rotate(${ring}deg)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={300} height={300} viewBox="-150 -150 300 300" style={{ filter: `drop-shadow(0 12px 18px ${hexA(OLE.forest2, 0.3)})` }}>
        <rect x={-22} y={-150} width={44} height={26} rx={6} fill={OLE.ironL} />
        <circle r={128} fill={OLE.plaid} />
        <circle r={112} fill={OLE.cream} />
        {Array.from({ length: 60 }).map((_, i) => { const a = (i / 60) * Math.PI * 2; const l = i % 5 === 0 ? 16 : 7; return <line key={i} x1={Math.sin(a) * 104} y1={-Math.cos(a) * 104} x2={Math.sin(a) * (104 - l)} y2={-Math.cos(a) * (104 - l)} stroke={OLE.pencil} strokeWidth={i % 5 === 0 ? 4 : 2} />; })}
        <path d={`M 0 0 L 0 -96 A 96 96 0 ${ang > 180 ? 1 : 0} 1 ${Math.sin(ang * Math.PI / 180) * 96} ${-Math.cos(ang * Math.PI / 180) * 96} Z`} fill={hexA(OLE.fire, 0.28)} />
        <g transform={`rotate(${ang})`}><polygon points="-7,6 7,6 0,-92" fill={OLE.plaid} /></g>
        <circle r={14} fill={OLE.iron} />
      </svg>
      <div style={{ marginTop: 6, fontFamily: LABEL, fontWeight: 700, fontSize: 64, color: OLE.forest, letterSpacing: 3, textShadow: `0 2px 0 ${hexA("#FFFFFF", 0.7)}`, background: hexA(OLE.paper, 0.9), padding: "0 22px", borderRadius: 8 }}>{txt}</div>
      {label ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: OLE.plaid, background: hexA(OLE.paper, 0.9), padding: "0 18px", borderRadius: 8, marginTop: 4 }}>{label}</div> : null}
    </div>
  );
};

// ───────────────────────── componente ─────────────────────────
export type OleDutchOven3DProps = {
  on?: "stove" | "coals";
  lidOpen?: boolean;          // la tapa se levanta en lidAt
  lidAt?: number;             // s
  lidCracked?: boolean;       // tapa corrida dejando rendija (throttle); si hay lidAt, se corre en ese momento
  states?: { at: number; mode: BoilMode }[];
  level?: number | { at: number; level: number }[];
  label?: string; sub?: string; labelAt?: number;
  labels?: { at: number; text: string; sub?: string }[]; // rótulos que se reemplazan en el tiempo (p. ej. ROLLING BOIL → A WHISPER)
  timer?: { from: number; to: number; label?: string };
  push?: number;              // cuánto se acerca la cámara (0-1)
};

export const OleDutchOven3D: React.FC<OleDutchOven3DProps> = ({
  on = "stove", lidOpen = true, lidAt, lidCracked = false, states, level = 0.72, label, sub, labelAt, labels, timer, push = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const t = frame / fps, dur = durationInFrames / fps;
  const geo = usePotGeoms();
  const mats = useMemo(() => makeIronMats(), []);
  const st = states && states.length ? states : [{ at: 0, mode: "rolling" as BoilMode }, { at: dur * 0.55, mode: "whisper" as BoilMode }];
  const bp = boilAt(st, t);
  const lv = levelAt(level, t);
  const surfY = 0.13 + clamp01(lv) * (RIM - 0.2);

  const la = lidAt ?? Math.min(1.2, dur * 0.15);
  // tapa: abrir = se levanta y se va hacia atrás-izquierda; torcida = se corre dejando una media luna
  const openP = lidOpen && !lidCracked ? interpolate(t, [la, la + 1.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }) : 0;
  const crackP = lidCracked ? (lidAt != null ? interpolate(t, [la, la + 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }) : 1) : 0;
  const lift = Math.sin(openP * Math.PI * 0.5);
  const jiggle = bp.roll * (1 - openP) * (1 - crackP * 0.6) * 0.012 * Math.max(0, Math.sin(t * 17) * Math.sin(t * 5.3));
  const lid = openP >= 0.999 ? null : {
    y: lift * 1.25 + jiggle + crackP * 0.015,
    x: -openP * 1.9 - crackP * 0.06, z: -openP * 0.9 - crackP * 0.2,
    rx: openP * 0.95 - crackP * 0.05, rz: openP * 0.35, ry: crackP * 0.25,
  };
  const lidOpenAmt = openP;

  const dist = interpolate(t, [0, dur], [6.0, 6.0 - 1.35 * push], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const ang = interpolate(t, [0, dur], [0.42, 0.3]);
  const elev = interpolate(t, [0, dur], [0.66, 0.74]);
  const target: [number, number, number] = [0.05, 0.42, 0];
  const pos: [number, number, number] = [Math.sin(ang) * dist * Math.cos(elev), 0.42 + dist * Math.sin(elev), Math.cos(ang) * dist * Math.cos(elev)];

  const lanternFlicker = 1 + 0.06 * Math.sin(t * 7.3) + 0.04 * Math.sin(t * 13.1);
  const labIn = interpolate(t, [labelAt ?? 0.4, (labelAt ?? 0.4) + 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const timIn = interpolate(t, [0.2, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const tp = interpolate(t, [0.6, Math.max(1, dur - 0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#E6D6B6" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 34, position: pos, near: 0.1, far: 80 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamRig pos={pos} target={target} fov={34} />
        <color attach="background" args={["#E6D6B6"]} />
        <hemisphereLight args={["#FFF4DE", "#8C6A48", 1.1]} />
        {/* luz de día fría de la ventana (izquierda) */}
        <directionalLight position={[-5, 5, 3]} intensity={1.7} color="#DCE8FF" />
        {/* farol cálido (derecha) */}
        <pointLight position={[2.6, 2.6, 1.8]} intensity={16 * lanternFlicker} distance={0} decay={1.6} color="#FFB45E" />
        <directionalLight position={[3, 3, -4]} intensity={0.6} color="#FFD9A8" />
        {on === "coals" ? <pointLight position={[0, 0.25, 0.4]} intensity={(3 + Math.sin(t * 2.3)) * 1.5} distance={4} decay={1.5} color="#FF6A22" /> : null}
        <Stage on={on} t={t} />
        <IronPot mats={mats} geo={geo} lid={lid}>
          <PotInterior t={t} bp={bp} surfY={surfY} lidOpenAmt={lidOpenAmt} crack={crackP} closedLeak={1} />
        </IronPot>
      </ThreeCanvas>
      {label && !labels ? <PaperTag text={label} sub={sub} appear={labIn} side="left" /> : null}
      {(labels ?? []).map((L, i, all) => {
        const next = all[i + 1]?.at ?? 1e9;
        const a = interpolate(t, [L.at, L.at + 0.5, next - 0.01, next + 0.35], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
        return a > 0.001 ? <PaperTag key={i} text={L.text} sub={L.sub} appear={a} side="left" /> : null;
      })}
      {timer ? <KitchenTimer from={timer.from} to={timer.to} label={timer.label} p={tp} appear={timIn} t={t} /> : null}
    </AbsoluteFill>
  );
};
export default OleDutchOven3D;
