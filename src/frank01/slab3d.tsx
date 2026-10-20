// frank01 · EL MUNDO: la vereda de Frank (New Jersey) con la losa en CORTE como maqueta de arquitecto.
// Una sola escena y UNA cámara: la grieta que avanza por la vereda, el corte que muestra lo que no se ve (losa en V,
// grava, tierra), el agua que entra, el hielo que empuja, la lechada que llena desde el fondo, la masilla que se pela,
// el parche que salta, el curado, la prueba de la manguera. TODO clavado a la voz con at() (estados en states.ts).
// Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "../kits/yanqui3d/fx3d";
import { KEYS, stateAt, ST } from "./states";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------------- geometría de la vereda (metros, exagerada como maqueta) ----------------
export const G = {
  w: 0.8,          // media ancho de la vereda (x ∈ [-w, w])
  top: 0.06, bot: -0.16,   // losa (canto ~22 cm: exagerado ×2)
  base: -0.42,     // grava
  soil: -1.5,      // fondo de la maqueta
  zCut: 2.0,       // plano del corte (cara que mira a la cámara)
  zSteps: -4.25,    // escalones del porche
};
// recorrido de la grieta en planta: nace en el borde del pasto (frente, z=4), cruza el corte en x≈0.08 y corre hasta casi los escalones
export const crackX = (z: number) => {
  if (z > 2.6) return 0.08 + (z - 2.6) / 1.4 * (G.w - 0.08) * 1.0 + 0.04 * Math.sin(z * 9);
  return 0.08 + 0.05 * Math.sin(z * 3.1) + 0.025 * Math.sin(z * 11.3 + 1) + 0.012 * Math.sin(z * 29);
};
const Z0 = -3.75, Z1 = G.zCut; // tramo de la grieta dentro de la maqueta (corte → casi los escalones)

// ---------------- CÁMARA ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
  // respiración de cámara en mano (muy leve) para que nunca quede congelada
  p.x += Math.sin(t * 0.7) * 0.012; p.y += Math.sin(t * 0.9 + 1) * 0.008;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.02, 400); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: [number, number, number]) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.02; c.far = 400; c.updateProjectionMatrix();
  return null;
};

// ---------------- texturas propias del concreto (deterministas) ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useConcrete = () => useMemo(() => ({
  // superficie de vereda con terminación de escoba (rayitas finas) y manchas de años
  top: mk(512, 512, (g) => {
    g.fillStyle = "#a9a6a0"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 60; i++) { const r = 30 + rnd(i, 1) * 90; const gr = g.createRadialGradient(rnd(i, 2) * 512, rnd(i, 3) * 512, 0, rnd(i, 2) * 512, rnd(i, 3) * 512, r); const v = rnd(i, 4) > 0.5 ? "120,116,108" : "190,186,178"; gr.addColorStop(0, `rgba(${v},.22)`); gr.addColorStop(1, `rgba(${v},0)`); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); }
    for (let y = 0; y < 512; y += 2) { g.fillStyle = `rgba(${rnd(y, 5) > 0.5 ? "70,68,64" : "230,228,222"},${0.05 + rnd(y, 6) * 0.07})`; g.fillRect(0, y, 512, 1); }
    for (let i = 0; i < 2600; i++) { const v = 80 + rnd(i, 7) * 120; g.fillStyle = `rgba(${v},${v},${v - 4},.5)`; g.fillRect(rnd(i, 8) * 512, rnd(i, 9) * 512, 1 + rnd(i, 10) * 2, 1 + rnd(i, 11) * 2); }
  }, [1.4, 1.4]),
  // canto del corte: pasta gris con piedras partidas (agregado)
  sec: mk(512, 512, (g) => {
    g.fillStyle = "#8f8c86"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 4000; i++) { const v = 110 + rnd(i, 1) * 70; g.fillStyle = `rgba(${v},${v - 2},${v - 6},.55)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 1.5, 1.5); }
    for (let i = 0; i < 260; i++) {
      const x = rnd(i, 4) * 512, y = rnd(i, 5) * 512, r = 3 + rnd(i, 6) * 8, n = 7;
      const c = [[120, 112, 100], [150, 140, 126], [96, 92, 88], [170, 160, 140], [128, 118, 112]][i % 5];
      g.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`; g.beginPath();
      for (let k = 0; k < n; k++) { const a = (k / n) * 6.283, rr = r * (0.7 + rnd(i * 9 + k, 7) * 0.45); k ? g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.8) : g.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.8); }
      g.closePath(); g.fill(); g.strokeStyle = "rgba(40,38,34,.35)"; g.lineWidth = 1.2; g.stroke();
      g.fillStyle = "rgba(255,255,255,.12)"; g.beginPath(); g.arc(x - r * 0.25, y - r * 0.25, r * 0.35, 0, 6.3); g.fill();
    }
  }, [1.6, 1.6]),
  gravel: mk(512, 256, (g) => {
    g.fillStyle = "#5e5a53"; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 900; i++) {
      const x = rnd(i, 1) * 512, y = rnd(i, 2) * 256, r = 2 + rnd(i, 3) * 6;
      const v = 70 + rnd(i, 4) * 70; g.fillStyle = `rgb(${v},${v - 4},${v - 12})`; g.beginPath(); g.ellipse(x, y, r, r * 0.75, rnd(i, 5) * 3, 0, 6.3); g.fill();
      g.fillStyle = "rgba(255,255,255,.18)"; g.beginPath(); g.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, 6.3); g.fill();
    }
  }, [5, 1.4]),
  soil: mk(512, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#5a4330"); gr.addColorStop(0.5, "#6b4f36"); gr.addColorStop(1, "#4c3826"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 3000; i++) { const v = rnd(i, 1); g.fillStyle = v > 0.7 ? "rgba(140,110,80,.35)" : "rgba(40,28,18,.35)"; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
    for (let i = 0; i < 70; i++) { const v = 120 + rnd(i, 4) * 60; g.fillStyle = `rgb(${v},${v - 20},${v - 40})`; g.beginPath(); g.ellipse(rnd(i, 5) * 512, rnd(i, 6) * 512, 3 + rnd(i, 7) * 7, 2 + rnd(i, 8) * 5, rnd(i, 9) * 3, 0, 6.3); g.fill(); }
    g.strokeStyle = "rgba(200,170,120,.25)"; g.lineWidth = 1.5;
    for (let i = 0; i < 18; i++) { g.beginPath(); let x = rnd(i, 10) * 512, y = rnd(i, 11) * 160; g.moveTo(x, y); for (let k = 0; k < 8; k++) { x += (rnd(i * 13 + k, 12) - 0.5) * 30; y += 12 + rnd(i * 13 + k, 13) * 18; g.lineTo(x, y); } g.stroke(); }
  }, [2, 1.4]),
  grass: mk(512, 512, (g) => {
    g.fillStyle = "#5d7a3a"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) { const h = 70 + rnd(i, 1) * 60, l = 28 + rnd(i, 2) * 26; g.fillStyle = `hsla(${h},45%,${l}%,.6)`; g.fillRect(rnd(i, 3) * 512, rnd(i, 4) * 512, 1.3, 3 + rnd(i, 5) * 4); }
    for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(150,130,70,.25)"; g.beginPath(); g.arc(rnd(i, 6) * 512, rnd(i, 7) * 512, 8 + rnd(i, 8) * 20, 0, 6.3); g.fill(); }
  }, [8, 8]),
  dot: mk(64, 64, (g) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.35, "rgba(255,255,255,.45)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); }),
  // hielo: cristales blancos/celestes
  ice: mk(256, 256, (g) => {
    g.fillStyle = "#cfe9ff"; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 2;
    for (let i = 0; i < 60; i++) { const x = rnd(i, 1) * 256, y = rnd(i, 2) * 256, r = 6 + rnd(i, 3) * 18; for (let k = 0; k < 3; k++) { const a = k * 1.047 + rnd(i, 4); g.beginPath(); g.moveTo(x - Math.cos(a) * r, y - Math.sin(a) * r); g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); g.stroke(); } }
  }, [3, 3]),
}), []);

// ---------------- loft: secciones (x,y) a lo largo de z → malla con grupos (0 = caras largas, 1 = tapas/corte) ----------------
type Ring = [number, number][];
const loft = (zs: number[], ring: (z: number) => Ring, caps = true) => {
  const pos: number[] = [], uv: number[] = [], groups: [number, number, number][] = [];
  const tri = (a: number[], b: number[], c: number[], ua: number[], ub: number[], uc: number[]) => { pos.push(...a, ...b, ...c); uv.push(...ua, ...ub, ...uc); };
  const R = zs.map((z) => ring(z).map(([x, y]) => [x, y, z]));
  const n = R[0].length;
  let s0 = 0;
  for (let i = 0; i < zs.length - 1; i++) for (let k = 0; k < n; k++) {
    const a = R[i][k], b = R[i][(k + 1) % n], c = R[i + 1][(k + 1) % n], d = R[i + 1][k];
    const horiz = Math.abs(a[1] - b[1]) < 1e-4; // cara de arriba/abajo → uv (x,z); cara vertical → uv (z,y)
    const U = (p: number[]) => (horiz ? [p[0], p[2]] : [p[2] + p[0], p[1] * 2]);
    tri(a, b, c, U(a), U(b), U(c)); tri(a, c, d, U(a), U(c), U(d));
  }
  groups.push([s0, pos.length / 3 - s0, 0]); s0 = pos.length / 3;
  if (caps) for (const [ri, flip] of [[0, true], [zs.length - 1, false]] as [number, boolean][]) {
    const r = R[ri];
    for (let k = 1; k < n - 1; k++) { const A = r[0], B = r[k], C = r[k + 1]; const u = (p: number[]) => [p[0] * 1.6, p[1] * 1.6]; if (flip) tri(A, C, B, u(A), u(C), u(B)); else tri(A, B, C, u(A), u(B), u(C)); }
  }
  groups.push([s0, pos.length / 3 - s0, 1]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  for (const [s, c, m] of groups) geo.addGroup(s, c, m);
  return geo;
};
const ZS = Array.from({ length: 90 }, (_, i) => Z0 + (Z1 - Z0) * (i / 89));

// ---------------- piezas ----------------
const Box: React.FC<{ p: [number, number, number]; s: [number, number, number]; c: string; r?: number; m?: number; map?: THREE.Texture; rad?: number; rot?: [number, number, number]; cast?: boolean }> = ({ p, s, c, r = 0.85, m = 0, map, rad = 0.02, rot, cast = true }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} /></mesh>
);
// bloque de maqueta con cara de corte texturada al frente (z+)
const Block: React.FC<{ x0: number; x1: number; y0: number; y1: number; z0: number; z1: number; side: THREE.Texture; c?: string; front?: THREE.Texture; fc?: string; tile?: number }> = ({ x0, x1, y0, y1, z0, z1, side, c = "#ffffff", front: front0, fc = "#ffffff", tile = 1 }) => {
  const front = useMemo(() => { if (!front0) return undefined; const t = front0.clone(); t.repeat.set((x1 - x0) / tile, (y1 - y0) / tile); t.needsUpdate = true; return t; }, [front0, x0, x1, y0, y1, tile]);
  return (
  <group>
    <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]} receiveShadow><boxGeometry args={[x1 - x0, y1 - y0, z1 - z0]} /><meshStandardMaterial color={c} roughness={1} map={side} /></mesh>
    {front && <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, z1 + 0.002]} receiveShadow><planeGeometry args={[x1 - x0, y1 - y0]} /><meshStandardMaterial color={fc} roughness={1} map={front} /></mesh>}
  </group>
  );
};

// lápiz amarillo (la grieta "como una línea de lápiz")
const Pencil: React.FC<{ p: [number, number, number]; rotY: number; drop: number }> = ({ p, rotY, drop }) => (
  <group position={[p[0], p[1] + (1 - drop) * 0.6, p[2]]} rotation={[0, rotY, (1 - drop) * 0.6]}>
    <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.32, 6]} /><meshStandardMaterial color="#f2b51c" roughness={0.5} /></mesh>
    <mesh position={[0.175, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow><coneGeometry args={[0.012, 0.03, 6]} /><meshStandardMaterial color="#e8c9a0" roughness={0.8} /></mesh>
    <mesh position={[0.193, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.004, 0.008, 6]} /><meshStandardMaterial color="#222" /></mesh>
    <mesh position={[-0.168, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.0125, 0.0125, 0.02, 10]} /><meshStandardMaterial color="#b9b9b9" metalness={0.8} roughness={0.3} /></mesh>
    <mesh position={[-0.186, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.018, 10]} /><meshStandardMaterial color="#e88a9a" roughness={0.9} /></mesh>
  </group>
);

// casa de NJ: siding blanco, porche con 3 escalones de concreto, puerta, ventanas, buzón al frente
const House: React.FC<{ siding: THREE.Texture; cz: ReturnType<typeof useConcrete> }> = ({ siding, cz }) => {
  const roof = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-5.2, 0); s.lineTo(0, 2.6); s.lineTo(5.2, 0); s.lineTo(-5.2, 0); return new THREE.ExtrudeGeometry(s, { depth: 7.2, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2 }); }, []);
  return (
    <group position={[0, 0, -9.7]}>
      <Box p={[0, 2.7, 0]} s={[9.6, 5.4, 6.6]} c="#eceae4" r={0.9} map={siding} rad={0.03} />
      <Box p={[0, 0.25, 0]} s={[9.8, 0.5, 6.8]} c="#8f8c86" r={1} />
      <mesh geometry={roof} position={[0, 5.4, -3.6]} castShadow receiveShadow><meshStandardMaterial color="#3c3f45" roughness={0.85} /></mesh>
      {[[-3.0, 1.9], [3.0, 1.9], [-3.0, 4.1], [3.0, 4.1], [0, 4.1]].map(([x, y], i) => (
        <group key={i} position={[x, y, 3.31]}>
          <mesh><planeGeometry args={[1.2, 1.25]} /><meshStandardMaterial color="#26313c" roughness={0.1} metalness={0.6} /></mesh>
          {[[0, 0.66, 1.4, 0.1], [0, -0.66, 1.46, 0.14], [-0.66, 0, 0.1, 1.3], [0.66, 0, 0.1, 1.3], [0, 0, 0.05, 1.25], [0, 0, 1.2, 0.05]].map(([fx, fy, w, h], q) => (
            <mesh key={q} position={[fx, fy, 0.03]}><boxGeometry args={[w, h, 0.06]} /><meshStandardMaterial color="#f6f4ef" roughness={0.6} /></mesh>
          ))}
          {[-0.85, 0.85].map((sx) => <Box key={sx} p={[sx, 0, 0.04]} s={[0.3, 1.3, 0.05]} c="#2d3b4c" r={0.7} />)}
        </group>
      ))}
      {/* puerta + porche */}
      <Box p={[0, 1.55, 3.34]} s={[1.05, 2.15, 0.08]} c="#7c2a24" r={0.55} />
      <mesh position={[0.36, 1.5, 3.4]}><sphereGeometry args={[0.045, 10, 8]} /><meshStandardMaterial color="#c9a14a" metalness={1} roughness={0.25} /></mesh>
      <Box p={[0, 0.52, 4.0]} s={[2.8, 0.18, 1.4]} c="#b3afa7" r={0.9} map={cz.top} />
      {[0, 1, 2].map((k) => <Box key={k} p={[0, 0.35 - k * 0.17, 4.7 + k * 0.3]} s={[2.0, 0.17, 0.32]} c="#b3afa7" r={0.9} map={cz.top} rad={0.015} />)}
      {[-1.3, 1.3].map((x) => <Box key={x} p={[x, 1.6, 4.55]} s={[0.12, 2.2, 0.12]} c="#f6f4ef" r={0.6} />)}
      <Box p={[0, 2.75, 4.0]} s={[3.0, 0.14, 1.6]} c="#f0eee8" />
      {/* arbustos al pie */}
      {[-3.6, -2.4, 2.4, 3.6].map((x, i) => <mesh key={x} position={[x, 0.45, 3.7]} castShadow scale={[0.75, 0.55, 0.55]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color={i % 2 ? "#3d5a2a" : "#4a6a30"} roughness={0.95} flatShading /></mesh>)}
    </group>
  );
};
const Tree: React.FC<{ p: [number, number, number]; s?: number; leaf?: string }> = ({ p, s = 1, leaf = "#7fa451" }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 1.4, 0]} castShadow><cylinderGeometry args={[0.13, 0.2, 2.8, 8]} /><meshStandardMaterial color="#4a3a2c" roughness={1} /></mesh>
    {[[0, 3.3, 0, 1.4], [0.7, 2.9, 0.3, 1.0], [-0.6, 3.0, -0.2, 1.05], [0.1, 4.0, 0.2, 1.0]].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]} castShadow><icosahedronGeometry args={[r, 1]} /><meshStandardMaterial color={leaf} roughness={0.95} flatShading /></mesh>
    ))}
  </group>
);
const Mailbox: React.FC<{ p: [number, number, number] }> = ({ p }) => (
  <group position={p}>
    <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[0.09, 1.0, 0.09]} /><meshStandardMaterial color="#4a3a2c" roughness={0.9} /></mesh>
    <mesh position={[0, 1.08, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.5, 16, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#1d1f22" metalness={0.5} roughness={0.4} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 1.0, 0]} castShadow><boxGeometry args={[0.26, 0.16, 0.5]} /><meshStandardMaterial color="#1d1f22" metalness={0.5} roughness={0.4} /></mesh>
    <mesh position={[0.15, 1.12, 0.05]}><boxGeometry args={[0.02, 0.18, 0.05]} /><meshStandardMaterial color="#c8352b" /></mesh>
  </group>
);

// partículas (lluvia, vapor, burbujas, grava que se lava) con puntito suave (nunca cuadradas)
const Dots: React.FC<{ pts: Float32Array; size: number; color: string; opacity: number; map: THREE.Texture; add?: boolean }> = ({ pts, size, color, opacity, map, add }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
  if (opacity <= 0.01) return null;
  return <points geometry={geo}><pointsMaterial map={map} color={color} size={size} sizeAttenuation transparent opacity={opacity} depthWrite={false} alphaTest={0.01} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} toneMapped={false} /></points>;
};

// ---------------- LA ESCENA ----------------
export const SlabWorld: React.FC<{ t: number }> = ({ t }) => {
  const s = stateAt(t);
  const tx = useTextures();
  const cz = useConcrete();
  const k = camAt(t);

  // grieta: ancho arriba (g), en el fondo (gb), V del cincel (v); el borde derecho se levanta (lift, rad) o se hunde (sink)
  const g = s.gap, gb = Math.max(0.002, s.gap * 0.45), v = s.vee;
  const ringL = (z: number): Ring => { const xc = crackX(z); return [[-G.w, G.bot], [xc - gb / 2, G.bot], [xc - g / 2 - v, G.top - v * 1.6], [xc - g / 2 - v * 0.2, G.top], [-G.w, G.top]]; };
  const ringR = (z: number): Ring => { const xc = crackX(z); return [[xc + gb / 2, G.bot], [G.w, G.bot], [G.w, G.top], [xc + g / 2 + v * 0.2, G.top], [xc + g / 2 + v, G.top - v * 1.6]]; };
  const kg = `${g.toFixed(4)}|${v.toFixed(4)}`;
  const geoL = useMemo(() => loft(ZS, ringL), [kg]); // eslint-disable-line react-hooks/exhaustive-deps
  const geoR = useMemo(() => loft(ZS, ringR), [kg]); // eslint-disable-line react-hooks/exhaustive-deps
  // relleno de la grieta hasta el nivel lvl (0 = fondo de la losa, 1 = al ras): agua / hielo / lechada / arena
  const fill = (lvl: number, z: number): Ring => {
    const xc = crackX(z), y = G.bot + (G.top - G.bot) * lvl;
    const fx = (yy: number) => { const u = (yy - G.bot) / (G.top - G.bot); return lerp(gb / 2, g / 2 + v, u) + 0.0015; };
    return [[xc - gb / 2 - 0.0015, G.bot - 0.002], [xc + gb / 2 + 0.0015, G.bot - 0.002], [xc + fx(y), y], [xc - fx(y), y]];
  };
  const lv = (x: number) => Math.round(x * 60) / 60;
  const kSand = `${kg}|${lv(s.sand)}`, kSl = `${kg}|${lv(s.slurry)}|${s.slurryHump.toFixed(2)}`, kW = `${kg}|${lv(s.water)}`;
  const geoSand = useMemo(() => (s.sand > 0.01 ? loft(ZS, (z) => fill(s.sand, z)) : null), [kSand]); // eslint-disable-line react-hooks/exhaustive-deps
  const geoSl = useMemo(() => (s.slurry > 0.01 ? loft(ZS, (z) => { const r = fill(Math.min(1, s.slurry), z); if (s.slurry >= 0.99 && s.slurryHump > 0) { r[2][1] += s.slurryHump * 0.012; r[3][1] += s.slurryHump * 0.012; } return r; }) : null), [kSl]); // eslint-disable-line react-hooks/exhaustive-deps
  const geoW = useMemo(() => (s.water > 0.01 ? loft(ZS, (z) => fill(s.water, z)) : null), [kW]); // eslint-disable-line react-hooks/exhaustive-deps
  const matSlab = useMemo(() => [new THREE.MeshStandardMaterial({ map: cz.top, roughness: 0.92, color: "#ffffff" }), new THREE.MeshStandardMaterial({ map: cz.sec, roughness: 0.95 })], [cz]);
  const matCrack = useMemo(() => [new THREE.MeshStandardMaterial({ color: "#5d5a55", roughness: 1 }), new THREE.MeshStandardMaterial({ map: cz.sec, roughness: 0.95 })], [cz]);
  void matCrack;

  // decal de la grieta en planta (línea oscura serpenteante que crece con s.len, 0..1, desde el borde del pasto)
  const crackLine = useMemo(() => {
    const N = 160, pts: THREE.Vector3[] = [];
    for (let i = 0; i <= N; i++) { const z = 4.0 - (4.0 - Z0) * (i / N); pts.push(new THREE.Vector3(crackX(z), G.top + 0.0025, z)); }
    return pts;
  }, []);
  const lenPts = Math.max(2, Math.round(crackLine.length * cl(s.len)));
  const ghostPts = Math.max(2, Math.round(crackLine.length * cl(s.ghost)));
  const iCut = crackLine.findIndex((p) => p.z <= G.zCut + 0.001);
  const ribbon = (n: number, w: number, i0 = 0) => {
    const pos: number[] = [];
    for (let i = i0; i < n - 1; i++) {
      const a = crackLine[i], b = crackLine[i + 1];
      const ww = w * (0.6 + 0.4 * Math.sin(i * 0.7) ** 2) * (i > n - 6 ? (n - 1 - i) / 5 : 1);
      pos.push(a.x - ww, a.y, a.z, a.x + ww, a.y, a.z, b.x + ww, b.y, b.z, a.x - ww, a.y, a.z, b.x + ww, b.y, b.z, b.x - ww, b.y, b.z);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals(); return geo;
  };
  const decalW = Math.max(0.0022, g / 2 + v + 0.0012);
  const fr0 = s.front > 0.5 ? 0 : iCut;
  const geoLine = useMemo(() => ribbon(lenPts, decalW, fr0), [lenPts, decalW.toFixed(4), fr0]); // eslint-disable-line react-hooks/exhaustive-deps
  const geoGhost = useMemo(() => ribbon(ghostPts, decalW + 0.004, fr0), [ghostPts, fr0]); // eslint-disable-line react-hooks/exhaustive-deps

  // luz: día (1) / lluvia (gris) / noche helada (azul)
  const day = 1 - s.night, rain = s.rain;
  const sky = new THREE.Color("#a9c6e4").lerp(new THREE.Color("#6f7a86"), rain).lerp(new THREE.Color("#0c1526"), s.night);
  const sunI = (2.6 - 1.7 * rain) * day;
  const xS = crackX(G.zCut);

  // lluvia (puntos que caen) + charcos que corren hacia la grieta
  const rainGeo = useMemo(() => new THREE.BufferGeometry(), []);
  const rainPts = useMemo(() => new Float32Array(1400 * 6), []);
  if (rain > 0.01) {
    for (let i = 0; i < 1400; i++) {
      const Y = 3.2, y = Y - ((rnd(i, 2) * Y + t * (6.5 + rnd(i, 3) * 2)) % Y) - 0.15, x = k.l.x + (rnd(i, 1) - 0.5) * 3.2, z = k.l.z + 0.7 + (rnd(i, 4) - 0.5) * 3.2;
      rainPts.set([x, y, z, x + 0.006, y + 0.09, z], i * 6);
    }
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPts, 3)); rainGeo.attributes.position.needsUpdate = true;
  }
  // cascotes que se desgranan del borde de la grieta
  const chunks = useMemo(() => Array.from({ length: 46 }, (_, i) => { const z = G.zCut - 0.05 - rnd(i, 1) * 3.2, sd = rnd(i, 2) > 0.5 ? 1 : -1; return { z, sd, r: 0.006 + rnd(i, 3) * 0.014, ry: rnd(i, 4) * 6, off: 0.012 + rnd(i, 5) * 0.03 }; }), []);
  // vapor que sale de la losa al fraguar (encogimiento)
  const vapPts = useMemo(() => new Float32Array(260 * 3), []);
  if (s.vapor > 0.01) for (let i = 0; i < 260; i++) {
    const ph = (rnd(i, 1) + t * 0.35) % 1;
    vapPts.set([(rnd(i, 2) - 0.5) * 1.5, G.top + ph * 0.6, Z0 + rnd(i, 3) * (Z1 - Z0)], i * 3);
  }
  // burbujas que suben por la lechada (en la cara del corte)
  const bubPts = useMemo(() => new Float32Array(70 * 3), []);
  if (s.bubbles > 0.01) for (let i = 0; i < 70; i++) {
    const ph = (rnd(i, 1) + t * (0.5 + rnd(i, 4) * 0.4)) % 1, y = G.bot + 0.02 + ph * (G.top - G.bot) * Math.min(1, s.slurry);
    bubPts.set([xS + (rnd(i, 2) - 0.5) * g * 0.6, y, G.zCut - rnd(i, 3) * 1.6], i * 3);
  }
  // grava lavada: piedritas que el agua arrastra afuera por debajo de la losa (cara del corte)
  const washPts = useMemo(() => new Float32Array(120 * 3), []);
  if (s.wash > 0.01) for (let i = 0; i < 120; i++) {
    const ph = (rnd(i, 1) + t * 0.25) % 1;
    washPts.set([xS + 0.05 + ph * 1.6, G.bot - 0.05 - rnd(i, 2) * 0.18 - ph * 0.1, G.zCut + 0.01], i * 3);
  }

  // losa derecha: se levanta (hielo) o se hunde (tierra que se fue) pivotando en su borde exterior de abajo
  const ang = s.lift * 0.05 - s.sink * 0.07;

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.12 + 0.5 * s.night} threshold={0.9} exposure={1.0 - 0.18 * rain + 0.1 * s.night} env={0.32 * day + 0.08} />
      <color attach="background" args={[sky.getHex()]} />
      <fogExp2 attach="fog" args={[sky.getHex(), 0.018 + 0.02 * rain]} />
      <hemisphereLight args={[new THREE.Color("#dfe9f5").lerp(new THREE.Color("#5d7194"), s.night).getHex(), new THREE.Color("#6a5a45").lerp(new THREE.Color("#141822"), s.night).getHex(), 0.7 + 0.25 * day]} />
      <directionalLight position={[6, 9, 7]} intensity={sunI + s.night * 0.9} color={new THREE.Color("#fff1dc").lerp(new THREE.Color("#9fb8ff"), s.night)} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* luz de relleno sobre la cara del corte, para que el corte se lea siempre (como maqueta iluminada) */}
      <pointLight position={[1.2, 0.4, 4.2]} intensity={3.2 * (1 - s.front)} distance={6} color="#fff4e6" />
      <pointLight position={[-1.6, -0.6, 3.6]} intensity={2.0 * (1 - s.front)} distance={5} color={new THREE.Color("#ffe8cc").lerp(new THREE.Color("#8fb0ff"), s.night).getHex()} />

      {/* ===== suelo de la maqueta: base oscura + pasto a los lados + bloque de tierra con corte ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, G.soil - 0.01, 0]} receiveShadow><planeGeometry args={[200, 200]} /><meshStandardMaterial color="#2a2420" roughness={1} /></mesh>
      {/* tierra con cara de corte (z = zCut) */}
      <Block x0={-6} x1={6} y0={G.soil} y1={G.base} z0={-14} z1={G.zCut} side={cz.soil} front={cz.soil} tile={1.3} />
      {/* grava bajo la vereda (cara de corte) y tierra bajo el pasto */}
      <Block x0={-G.w} x1={G.w} y0={G.base} y1={G.bot} z0={G.zSteps} z1={G.zCut} side={cz.gravel} front={cz.gravel} tile={0.55} />
      <Block x0={-6} x1={-G.w} y0={G.base} y1={-0.02} z0={-14} z1={G.zCut} side={cz.soil} front={cz.soil} tile={1.3} />
      <Block x0={G.w} x1={6} y0={G.base} y1={-0.02} z0={-14} z1={G.zCut} side={cz.soil} front={cz.soil} tile={1.3} />
      {/* pasto (franja de 4 cm sobre la tierra, el corte la muestra) */}
      {[[-6, -G.w], [G.w, 6]].map(([a, b], i) => (
        <group key={i}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(a + b) / 2, 0.02, (G.zCut - 14) / 2]} receiveShadow><planeGeometry args={[b - a, G.zCut + 14]} /><meshStandardMaterial map={cz.grass} roughness={1} color="#ffffff" /></mesh>
          <mesh position={[(a + b) / 2, 0.0, G.zCut + 0.003]}><planeGeometry args={[b - a, 0.04]} /><meshStandardMaterial color="#3f5a26" roughness={1} /></mesh>
        </group>
      ))}
      {/* juntas entre la grava y el pasto (tierra suelta) */}
      <Box p={[0, (G.bot + G.base) / 2, G.zSteps - 0.5]} s={[1.8, G.bot - G.base, 1]} c="#5e5a53" r={1} map={cz.gravel} />

      {/* ===== LA VEREDA: losa del héroe (dos mitades separadas por la grieta, loft) + losas de atrás ===== */}
      <mesh geometry={geoL} material={matSlab} castShadow receiveShadow />
      <group position={[G.w, G.bot, 0]} rotation={[0, 0, -ang]}>
        <mesh geometry={geoR} material={matSlab} castShadow receiveShadow position={[-G.w, -G.bot, 0]} />
      </group>
      {/* losas entre la grieta y los escalones (con junta) */}
      <Box p={[0, (G.top + G.bot) / 2, (Z0 + G.zSteps) / 2 - 0.004]} s={[2 * G.w, G.top - G.bot, Z0 - G.zSteps - 0.012]} c="#ffffff" r={0.92} map={cz.top} rad={0.006} />
      {/* juntas de control dibujadas sobre la losa del héroe (destello cuando se nombran) */}
      {[-1.6, 0.2].map((z, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, G.top + 0.002, z]}><planeGeometry args={[2 * G.w, 0.012]} />
          <meshStandardMaterial color={new THREE.Color("#4a4844").lerp(new THREE.Color("#ffb257"), s.joints)} emissive={new THREE.Color("#ff9a3c")} emissiveIntensity={s.joints * 1.6} roughness={1} /></mesh>
      ))}
      {/* la grieta en planta + fantasma "el otoño pasado" */}
      {s.len > 0.01 && <mesh geometry={geoLine}><meshStandardMaterial color={new THREE.Color("#1e1d1b").lerp(new THREE.Color("#3e4650").lerp(new THREE.Color("#a29e95"), s.cured), Math.min(1, Math.max(0, (s.slurry - 0.9) / 0.1)))} roughness={s.slurry > 0.9 ? 0.15 + 0.8 * s.cured : 1} polygonOffset polygonOffsetFactor={-2} /></mesh>}
      {s.ghost > 0.01 && <mesh geometry={geoGhost} position={[0, 0.0015, 0]}><meshBasicMaterial color="#ffb257" transparent opacity={0.85 * s.ghostO} toneMapped={false} depthWrite={false} /></mesh>}

      {/* rellenos de la grieta */}
      {geoSand && <mesh geometry={geoSand}><meshStandardMaterial color="#cdb68c" roughness={1} /></mesh>}
      {geoW && <mesh geometry={geoW}><meshStandardMaterial color={new THREE.Color("#3f8fd6").lerp(new THREE.Color("#e6f4ff"), s.ice)} roughness={0.15 + 0.5 * s.ice} metalness={0.05} transparent opacity={0.78} emissive={new THREE.Color("#2a6fb8").lerp(new THREE.Color("#a8d8ff"), s.ice)} emissiveIntensity={0.25 + 0.3 * s.ice} map={s.ice > 0.3 ? cz.ice : undefined} /></mesh>}
      {geoSl && <mesh geometry={geoSl}><meshStandardMaterial color={new THREE.Color("#3e4650").lerp(new THREE.Color("#b3afa6"), s.cured)} roughness={0.12 + 0.8 * s.cured} metalness={0.15 * (1 - s.cured)} emissive={new THREE.Color("#0d1a26")} emissiveIntensity={0.6 * (1 - s.cured)} /></mesh>}
      {/* chorro de lechada que cae desde arriba */}
      {s.pour > 0.01 && <mesh position={[xS - 0.01, G.top + 0.5 * s.pour, G.zCut - 0.35]}><cylinderGeometry args={[0.012, 0.018, 1.0 * s.pour, 12]} /><meshStandardMaterial color="#77746f" roughness={0.3} /></mesh>}

      {/* agua bajo la losa → hielo (lente en la grava, dibujada en la cara del corte) */}
      {s.lens > 0.01 && (
        <group position={[xS + 0.04, G.bot - 0.09, G.zCut + 0.004]}>
          <mesh scale={[0.3 * s.lens + 0.04 * s.ice, 0.045 * s.lens * (1 + 0.7 * s.ice), 1]}><circleGeometry args={[1, 48]} />
            <meshStandardMaterial color={new THREE.Color("#3f8fd6").lerp(new THREE.Color("#bfe6ff"), s.ice)} emissive={new THREE.Color("#2a6fb8").lerp(new THREE.Color("#5fb4ff"), s.ice)} emissiveIntensity={0.35 + 0.15 * s.ice} roughness={0.3} map={s.ice > 0.3 ? cz.ice : undefined} transparent opacity={0.92} /></mesh>
        </group>
      )}
      {/* hueco donde el agua se llevó la base */}
      {s.wash > 0.01 && (
        <group position={[xS + 0.3, G.bot - 0.06, G.zCut + 0.003]}>
          <mesh scale={[0.32 * s.wash, 0.06 * s.wash, 1]}><circleGeometry args={[1, 40, 0, Math.PI]} /><meshStandardMaterial color="#231a12" roughness={1} /></mesh>
          <mesh scale={[0.32 * s.wash, 0.02 * s.wash, 1]} rotation={[0, 0, Math.PI]}><circleGeometry args={[1, 40, 0, Math.PI]} /><meshStandardMaterial color="#17130f" roughness={1} /></mesh>
        </group>
      )}
      <Dots pts={washPts} size={0.035} color="#8a847a" opacity={s.wash} map={cz.dot} />

      {/* masilla (cordón gris) que se cocina y se despega */}
      {s.caulk > 0.01 && (
        <group position={[xS, G.top + 0.006, G.zCut - 0.9]}>
          {[-1, 1].map((sd) => (
            <mesh key={sd} position={[sd * 0.012 * (1 + s.peel * 1.5), s.peel * 0.012, 0]} rotation={[0, 0, sd * s.peel * 0.35]} scale={[1, 1 - 0.35 * s.shrinkCaulk, 1]}>
              <boxGeometry args={[0.03 * (1 - 0.25 * s.shrinkCaulk), 0.014, 1.8 * s.caulk]} /><meshStandardMaterial color={new THREE.Color("#8d8f93").lerp(new THREE.Color("#b9a98e"), s.shrinkCaulk)} roughness={0.55} />
            </mesh>
          ))}
        </group>
      )}
      {/* parche que salta con la helada */}
      {s.patch > 0.01 && (
        <group position={[xS, G.top + 0.01 + s.pop * 0.45, G.zCut - 0.55 + s.pop * 0.6]} rotation={[s.pop * 2.2, s.pop * 1.3, s.pop * 0.8]}>
          <mesh scale={[0.12, 0.022, 0.4]} castShadow><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#bcb6aa" roughness={0.95} map={cz.top} /></mesh>
        </group>
      )}
      {/* trapo mojado del curado */}
      {s.cloth > 0.01 && (
        <mesh position={[xS, G.top + 0.006, G.zCut - 0.9 * s.cloth]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.22, 1.8 * s.cloth, 4, 16]} />
          <meshStandardMaterial color="#6f7f8f" roughness={0.35} metalness={0.05} transparent opacity={0.95} /></mesh>
      )}
      {/* lámina de agua de la manguera que corre por arriba (prueba de los 30 días) */}
      {s.sheet > 0.01 && (
        <mesh position={[0, G.top + 0.004, G.zCut - 2.2 + 1.2 * s.sheet]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2 * G.w - 0.05, 2.4 * s.sheet]} />
          <meshStandardMaterial color="#9fd4ff" roughness={0.05} metalness={0.2} transparent opacity={0.45} emissive="#4aa3ff" emissiveIntensity={0.2} /></mesh>
      )}

      {s.pencil > 0.02 && <Pencil p={[crackX(G.zCut - 0.55) + 0.07, G.top + 0.013, G.zCut - 0.55]} rotY={Math.PI / 2 + 0.05} drop={s.pencil} />}

      {/* ===== frente que existe ANTES del corte (vereda hasta la calle, buzón): se va al revelar lo que no se ve ===== */}
      {s.front > 0.01 && (
        <group position={[0, -(1 - s.front) * 3, 0]}>
          <Block x0={-6} x1={6} y0={G.soil} y1={-0.02} z0={G.zCut} z1={13} side={cz.soil} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 7.5]} receiveShadow><planeGeometry args={[12, 11]} /><meshStandardMaterial map={cz.grass} roughness={1} /></mesh>
          {[[3.0, 4.5], [5.4, 4.5], [7.8, 4.5]].map(([z], i) => <Box key={i} p={[0, (G.top + G.bot) / 2, z - 1.2 + 0.006]} s={[2 * G.w, G.top - G.bot, 2.388]} c="#ffffff" r={0.92} map={cz.top} rad={0.006} />)}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 11.4]} receiveShadow><planeGeometry args={[60, 2.6]} /><meshStandardMaterial color="#4a4c50" roughness={0.95} /></mesh>
          <Mailbox p={[-1.25, 0, 9.4]} />
        </group>
      )}
      {/* la grieta en el frente (desde el pasto hasta el corte) */}

      <House siding={tx.siding} cz={cz} />
      <Tree p={[-4.2, 0, -4.5]} s={1.25} />
      <Tree p={[4.8, 0, -3.2]} s={1.05} leaf="#8bb15a" />
      <Tree p={[-11, 0, -9]} s={1.4} leaf="#6d9446" />
      <Tree p={[11.5, 0, -10]} s={1.3} />
      {/* casas vecinas (para el plano general) */}
      {[-13, 13].map((x, i) => (
        <group key={x} position={[x, 0, -9.5]}>
          <Box p={[0, 2.4, 0]} s={[8, 4.8, 6]} c={i ? "#d9d3c4" : "#c8d0d6"} r={0.9} map={tx.siding} rad={0.03} />
          <Box p={[0, 5.0, 0]} s={[8.4, 0.5, 6.4]} c="#3c3f45" />
        </group>
      ))}

      {rain > 0.01 && <lineSegments geometry={rainGeo}><lineBasicMaterial color="#dbeaff" transparent opacity={0.55 * rain} depthWrite={false} /></lineSegments>}
      {s.crumb > 0.01 && chunks.map((c, i) => (i / chunks.length < s.crumb ? <mesh key={i} position={[crackX(c.z) + c.sd * (g / 2 + c.off), G.top + c.r * 0.5 + (c.sd > 0 ? s.lift * 0.03 : 0), c.z]} rotation={[c.ry, c.ry * 1.7, c.ry * 0.6]} castShadow><dodecahedronGeometry args={[c.r, 0]} /><meshStandardMaterial color="#9e9a92" roughness={1} map={cz.sec} /></mesh> : null))}
      <Dots pts={vapPts} size={0.08} color="#ffffff" opacity={s.vapor * 0.35} map={cz.dot} />
      <Dots pts={bubPts} size={0.02} color="#ffffff" opacity={s.bubbles * 0.9} map={cz.dot} add />
    </ThreeCanvas>
  );
};

// marcadores 3D (para portales y rótulos)
export const PT = {
  crackTop: [crackX(G.zCut - 0.5), G.top, G.zCut - 0.5] as [number, number, number],
  crackFar: [crackX(-3.4), G.top, -3.4] as [number, number, number],
  crackSec: [crackX(G.zCut), (G.top + G.bot) / 2, G.zCut] as [number, number, number],
  under: [crackX(G.zCut) + 0.04, G.bot - 0.09, G.zCut] as [number, number, number],
  slabR: [0.55, G.top, G.zCut - 0.3] as [number, number, number],
  gravel: [-0.4, (G.bot + G.base) / 2, G.zCut] as [number, number, number],
  slabSec: [-0.45, (G.top + G.bot) / 2, G.zCut] as [number, number, number],
  mailbox: [-1.25, 1.1, 9.4] as [number, number, number],
  steps: [0, 0.4, -4.6] as [number, number, number],
  joint: [0.4, G.top, 0.2] as [number, number, number],
};
export { ST };
