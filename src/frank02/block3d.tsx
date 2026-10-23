// frank02 · EL MUNDO: el patio-taller de Frank (New Jersey) con dos cosas en la misma escena y UNA cámara:
//  1) el BLOQUE GIGANTE en corte, como maqueta de laboratorio: piedras, arena y granos de cemento; las agujas que crecen
//     (hidratación), el aceite que los envuelve como impermeable y corre en venas negras, las burbujitas de aire, el hielo
//     que crece y empuja (o se mete en las burbujas), la cara de arriba que se descascara;
//  2) el BANCO DE PRUEBAS: la carretilla con el chorro de aceite, los 3 encofrados, los 3 bloques en la balanza de pruebas
//     con sus barras de puntaje, gotas de agua, la llave, el martillo, el freezer, el bloque 2 al volquete.
// TODO clavado a la voz con at() (estados en states.ts). Render SÓLO en el farm (acá sólo stills).
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

// ---------------- geometría (metros de maqueta) ----------------
// bloque gigante: cubo de 3 m centrado en x=0, apoyado en y=0; la cara del corte mira a la cámara (z = +1.5)
export const MB = { s: 3, zf: 1.5 };
// banco de pruebas a la derecha: 3 bloques de 0.5 m sobre la balanza
export const BX = [6.2, 7.2, 8.2], BY = 1.0, BZ = 0.6, BS = 0.5;
export const WB = { x: 4.0, z: 3.6 }; // carretilla (adelante, entre los dos)

// ---------------- CÁMARA (igual que frank01) ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
  p.x += Math.sin(t * 0.7) * 0.012; p.y += Math.sin(t * 0.9 + 1) * 0.008;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.02, 400); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: [number, number, number]) => project(camAt(t), v3(q));
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.02; c.far = 400; c.updateProjectionMatrix();
  return null;
};

// ---------------- texturas propias (deterministas) ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useTex = () => useMemo(() => ({
  // pasta de cemento vista de cerca (matriz gris con poros)
  paste: mk(512, 512, (g) => {
    g.fillStyle = "#8b8781"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 5000; i++) { const v = 100 + rnd(i, 1) * 70; g.fillStyle = `rgba(${v},${v - 2},${v - 6},.5)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 1.5, 1.5); }
    for (let i = 0; i < 160; i++) { g.fillStyle = "rgba(40,38,36,.35)"; g.beginPath(); g.arc(rnd(i, 4) * 512, rnd(i, 5) * 512, 1 + rnd(i, 6) * 3, 0, 6.3); g.fill(); }
  }, [2, 2]),
  // concreto curado (los bloques de prueba)
  conc: mk(256, 256, (g) => {
    g.fillStyle = "#a3a09a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2200; i++) { const v = 120 + rnd(i, 1) * 80; g.fillStyle = `rgba(${v},${v - 2},${v - 6},.55)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 1.4, 1.4); }
    for (let i = 0; i < 60; i++) { g.fillStyle = "rgba(60,58,54,.4)"; g.beginPath(); g.arc(rnd(i, 4) * 256, rnd(i, 5) * 256, 0.8 + rnd(i, 6) * 1.8, 0, 6.3); g.fill(); }
  }),
  // concreto con aceite: marrón oscuro, manchado y brilloso
  oily: mk(256, 256, (g) => {
    g.fillStyle = "#5a4d40"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 40; i++) { const r = 20 + rnd(i, 1) * 60; const gr = g.createRadialGradient(rnd(i, 2) * 256, rnd(i, 3) * 256, 0, rnd(i, 2) * 256, rnd(i, 3) * 256, r); gr.addColorStop(0, "rgba(25,20,16,.55)"); gr.addColorStop(1, "rgba(25,20,16,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); }
    for (let i = 0; i < 1800; i++) { const v = 70 + rnd(i, 4) * 60; g.fillStyle = `rgba(${v},${v - 8},${v - 16},.5)`; g.fillRect(rnd(i, 5) * 256, rnd(i, 6) * 256, 1.4, 1.4); }
  }),
  // madera terciada (encofrados)
  ply: mk(256, 256, (g) => {
    g.fillStyle = "#c9a874"; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 3) { g.fillStyle = `rgba(${rnd(y, 1) > 0.5 ? "150,110,60" : "220,190,140"},${0.15 + rnd(y, 2) * 0.2})`; g.fillRect(0, y, 256, 1 + rnd(y, 3) * 2); }
    for (let i = 0; i < 6; i++) { g.strokeStyle = "rgba(120,80,40,.35)"; g.lineWidth = 2; g.beginPath(); g.ellipse(rnd(i, 4) * 256, rnd(i, 5) * 256, 18, 6, 0, 0, 6.3); g.stroke(); }
  }),
  dot: mk(64, 64, (g) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.35, "rgba(255,255,255,.45)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); }),
  frost: mk(256, 256, (g) => {
    g.fillStyle = "rgba(235,246,255,0.0)"; g.clearRect(0, 0, 256, 256);
    g.strokeStyle = "rgba(255,255,255,.95)"; g.lineWidth = 1.6;
    for (let i = 0; i < 90; i++) { const x = rnd(i, 1) * 256, y = rnd(i, 2) * 256, r = 4 + rnd(i, 3) * 12; for (let k = 0; k < 3; k++) { const a = k * 1.047 + rnd(i, 4); g.beginPath(); g.moveTo(x - Math.cos(a) * r, y - Math.sin(a) * r); g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); g.stroke(); } }
  }, [2, 2]),
}), []);

// ---------------- el corte: piedras, arena, granos de cemento (posiciones fijas) ----------------
// todo vive en una capa fina pegada a la cara del corte (z ≈ zf) para que se lea como "lo de adentro"
type Grain = { x: number; y: number; z: number; r: number; kind: 0 | 1 | 2 }; // 0 piedra, 1 arena, 2 cemento
const GRAINS: Grain[] = (() => {
  const out: Grain[] = []; const h = MB.s / 2;
  const free = (x: number, y: number, r: number) => out.every((q) => Math.hypot(q.x - x, q.y - y) > q.r + r + 0.015);
  let i = 0;
  for (const [kind, n, r0, r1] of [[0, 34, 0.11, 0.2], [1, 150, 0.035, 0.06], [2, 260, 0.016, 0.026]] as [0 | 1 | 2, number, number, number][]) {
    let made = 0, tries = 0;
    while (made < n && tries < n * 60) {
      tries++; i++;
      const r = r0 + rnd(i, 1) * (r1 - r0), x = (rnd(i, 2) - 0.5) * (MB.s - 2 * r - 0.06), y = 0.04 + r + rnd(i, 3) * (MB.s - 2 * r - 0.1);
      if (!free(x, y, r)) continue;
      out.push({ x, y, z: MB.zf - r * 0.35, r, kind }); made++;
    }
  }
  void h; return out;
})();
const CEM = GRAINS.filter((g) => g.kind === 2);
// agujas: de cada grano de cemento salen 6 hacia afuera (apuntando a su vecino más cercano de arena/piedra cuando hay)
const NEEDLES = CEM.flatMap((g, gi) => Array.from({ length: 6 }, (_, k) => {
  const a = (k / 6) * Math.PI * 2 + rnd(gi, k + 3) * 0.6;
  return { g, a, len: 0.03 + rnd(gi * 7 + k, 9) * 0.045, d: rnd(gi * 7 + k, 11) };
}));
// venas de aceite: caminos que serpentean ENTRE los granos (de arriba hacia abajo, como chorreado)
const VEINS = Array.from({ length: 14 }, (_, i) => {
  const pts: THREE.Vector3[] = []; let x = (rnd(i, 1) - 0.5) * 2.5, y = MB.s - 0.05;
  for (let k = 0; k < 26; k++) {
    pts.push(new THREE.Vector3(x, y, MB.zf + 0.005));
    // esquiva granos: empuja hacia afuera del grano más cercano
    const q = GRAINS.reduce((b, g) => (Math.hypot(g.x - x, g.y - y) < Math.hypot(b.x - x, b.y - y) ? g : b), GRAINS[0]);
    const dx = x - q.x; x += (rnd(i * 31 + k, 2) - 0.5) * 0.14 + (Math.abs(dx) < q.r + 0.02 ? Math.sign(dx || 1) * 0.06 : 0);
    y -= 0.08 + rnd(i * 31 + k, 3) * 0.05; if (y < 0.06) break;
  }
  return new THREE.CatmullRomCurve3(pts);
});
// burbujitas de aire (aire incorporado): chiquitas y repartidas por la pasta
const BUBS = Array.from({ length: 420 }, (_, i) => ({ x: (rnd(i, 21) - 0.5) * (MB.s - 0.1), y: 0.06 + rnd(i, 22) * (MB.s - 0.12), r: 0.013 + rnd(i, 23) * 0.016, d: rnd(i, 24) })).filter((b) => GRAINS.every((g) => Math.hypot(g.x - b.x, g.y - b.y) > g.r + b.r + 0.006));
// canales capilares donde entra el agua (líneas finas azules) → se congelan
const CHANNELS = Array.from({ length: 10 }, (_, i) => {
  const pts: THREE.Vector3[] = []; let x = (rnd(i, 41) - 0.5) * 2.6, y = MB.s;
  for (let k = 0; k < 10; k++) { pts.push(new THREE.Vector3(x, y, MB.zf + 0.006)); x += (rnd(i * 13 + k, 42) - 0.5) * 0.12; y -= 0.06 + rnd(i * 13 + k, 43) * 0.04; }
  return new THREE.CatmullRomCurve3(pts);
});

// ---------------- estado (lo arma states.ts) ----------------
export type S = {
  // bloque gigante
  macro: number;       // 0 = escondido bajo el piso, 1 = en su lugar
  water: number;       // agua en la pasta (brillo azulado) 0..1
  hyd: number;         // agujas que crecen 0..1
  grab: number;        // agujas que se agarran de la arena/piedra (se alargan hasta tocar) 0..1
  oil: number;         // impermeable negro alrededor de los granos 0..1
  veins: number;       // venas de aceite que chorrean entre los granos 0..1
  bub: number;         // burbujitas de aire 0..1 (cantidad visible)
  ice: number;         // agua en los canales → hielo 0..1
  push: number;        // el hielo empuja: grietas en la cara de arriba 0..1
  relief: number;      // el hielo se mete en las burbujas (se iluminan) 0..1
  flake: number;       // la cara de arriba se descascara 0..1
  // banco y carretilla
  wheel: number;       // carretilla visible 0..1
  pourOil: number;     // chorro de aceite 0..1
  swirl: number;       // remolino negro en la carretilla 0..1
  dose: number;        // cuchara vs bidón 0..1
  forms: number;       // encofrados armados 0..1
  fill: number;        // concreto en los encofrados 0..1
  plastic: number;     // plástico encima 0..1
  demold: number;      // se sacan los encofrados → bloques 0..1
  blocks: number;      // 3 bloques sobre la balanza 0..1
  drops: number;       // prueba del agua 0..1
  scratch: number;     // prueba de la llave 0..1
  hammer: number;      // prueba del martillo 0..1 (el golpe a 0.5)
  frost: number;       // freezer 0..1
  crumble: number;     // el bloque 2 se desgrana 0..1
  dump: number;        // el bloque 2 se va 0..1
  bars: [number, number, number]; // barras de puntaje de cada bloque (0..1)
  barsOn: number;      // barras visibles 0..1
  hi: number;          // resaltar bloque: 0 nada, 1/2/3
};

// ---------------- piezas ----------------
const Box: React.FC<{ p: [number, number, number]; s: [number, number, number]; c: string; r?: number; m?: number; map?: THREE.Texture; rad?: number; rot?: [number, number, number]; e?: string; ei?: number; o?: number }> = ({ p, s, c, r = 0.85, m = 0, map, rad = 0.02, rot, e, ei = 0, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e ?? "#000000"} emissiveIntensity={ei} transparent={o < 1} opacity={o} />
  </mesh>
);
const Dots: React.FC<{ pts: Float32Array; size: number; color: string; opacity: number; map: THREE.Texture; add?: boolean }> = ({ pts, size, color, opacity, map, add }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
  if (opacity <= 0.01) return null;
  return <points geometry={geo}><pointsMaterial map={map} color={color} size={size} sizeAttenuation transparent opacity={opacity} depthWrite={false} alphaTest={0.01} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} toneMapped={false} /></points>;
};
// instancias (granos, agujas, burbujas) — una malla por tipo
const Inst: React.FC<{ n: number; geo: THREE.BufferGeometry; set: (i: number, m: THREE.Matrix4) => boolean; mat: THREE.Material; key2: string }> = ({ n, geo, set, mat, key2 }) => {
  const mesh = useMemo(() => new THREE.InstancedMesh(geo, mat, n), [geo, mat, n]);
  useMemo(() => {
    const m = new THREE.Matrix4(); let c = 0;
    for (let i = 0; i < n; i++) if (set(i, m)) mesh.setMatrixAt(c++, m);
    mesh.count = c; mesh.instanceMatrix.needsUpdate = true; mesh.castShadow = false; mesh.receiveShadow = true;
  }, [key2]); // eslint-disable-line react-hooks/exhaustive-deps
  return <primitive object={mesh} />;
};

// el bloque de prueba (0.5 m), con su número pintado en la cara de adelante y estados de cada prueba
const numTex = (n: number) => mk(128, 128, (g) => { g.clearRect(0, 0, 128, 128); g.fillStyle = "rgba(250,248,240,.92)"; g.font = "bold 92px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(n), 64, 70); });
const TestBlock: React.FC<{ i: number; s: S; tx: ReturnType<typeof useTex>; nt: THREE.Texture }> = ({ i, s, tx, nt }) => {
  const oily = i === 1, x = BX[i];
  const lift = s.dump * (oily ? 1 : 0);
  const corner = oily && s.hammer > 0.5;
  const hi = s.hi === i + 1 ? 1 : 0;
  const y = BY + BS / 2 + lift * 2.4, z = BZ - lift * 3, rot = lift * 2.5;
  if (s.blocks < 0.01) return null;
  const sc = Math.min(1, s.blocks * 1.2);
  return (
    <group position={[x, y, z]} rotation={[rot * 0.4, rot, 0]} scale={sc}>
      <Box p={[0, 0, 0]} s={[BS, BS * (1 - (oily ? 0.04 * s.crumble : 0)), BS]} c={oily ? "#ffffff" : "#ffffff"} r={oily ? 0.35 : 0.95} m={oily ? 0.08 : 0} map={oily ? tx.oily : tx.conc} rad={0.012 + (oily ? 0.05 * s.crumble : 0)} e={hi ? "#ffb257" : undefined} ei={hi * 0.12} />
      {/* número pintado */}
      <mesh position={[0, 0.02, BS / 2 + 0.003]}><planeGeometry args={[0.26, 0.26]} /><meshBasicMaterial map={nt} transparent toneMapped={false} depthWrite={false} /></mesh>
      {/* esquina que salta con el martillo (bloque 2) */}
      {corner && <mesh position={[BS / 2 - 0.08 + (s.hammer - 0.5) * 0.6, Math.max(-BS / 2 + 0.09, BS / 2 - 0.08 - Math.pow((s.hammer - 0.5) * 2, 2) * 0.9), BS / 2 - 0.06]} rotation={[s.hammer * 4, s.hammer * 3, 0]} castShadow><dodecahedronGeometry args={[0.1, 0]} /><meshStandardMaterial color="#5a4d40" roughness={0.6} map={tx.oily} /></mesh>}
      {/* gotas: perlas en el 2, manchita que se absorbe en el 1 y el 3 */}
      {s.drops > 0.01 && [0, 1, 2, 3, 4].map((k) => {
        const px = -0.15 + k * 0.075, pz = -0.05 + rnd(k + i * 5, 3) * 0.12, show = cl(s.drops * 5 - k);
        return oily
          ? <mesh key={k} position={[px, BS / 2 + 0.018 * show, pz]} scale={[show, show * 0.75, show]}><sphereGeometry args={[0.024, 16, 12]} /><meshPhysicalMaterial color="#e8f4ff" roughness={0.02} transmission={0.9} thickness={0.02} ior={1.33} /></mesh>
          : <mesh key={k} position={[px, BS / 2 + 0.002, pz]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.035 * show, 24]} /><meshStandardMaterial color="#6e6b66" roughness={0.6} transparent opacity={0.75 * show} /></mesh>;
      })}
      {/* la llave: raya plateada fina (1 y 3) o surco con polvo (2) */}
      {s.scratch > 0.01 && <mesh position={[-0.2 + 0.2 * s.scratch, BS / 2 + 0.002, 0.12]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.4 * s.scratch, oily ? 0.016 : 0.004]} /><meshStandardMaterial color={oily ? "#c9c3b6" : "#e9eef2"} roughness={oily ? 1 : 0.2} metalness={oily ? 0 : 0.7} /></mesh>}
      {/* escarcha del freezer */}
      {s.frost > 0.01 && <mesh position={[0, 0, 0]} scale={1.004}><boxGeometry args={[BS, BS, BS]} /><meshStandardMaterial map={tx.frost} transparent opacity={0.9 * s.frost * (1 - s.dump)} color="#ffffff" roughness={0.6} depthWrite={false} /></mesh>}
    </group>
  );
};

// martillo de 4 libras (cabeza + mango)
const Hammer: React.FC<{ h: number }> = ({ h }) => {
  if (h < 0.01 || h > 0.98) return null;
  const sw = h < 0.5 ? -1.2 + 1.2 * ease(h * 2) : -0.15 * Math.sin((h - 0.5) * 12) * (1 - h); // sube y baja al golpe
  return (
    <group position={[BX[1] + BS / 2 + 0.05, BY + BS + 0.02, BZ + BS / 2 - 0.06]} rotation={[0, 0, sw]}>
      <Box p={[0.05, 0.08, 0]} s={[0.12, 0.16, 0.12]} c="#3b3d40" m={0.8} r={0.35} rad={0.01} />
      <mesh position={[0.5, 0.08, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.025, 0.03, 0.8, 10]} /><meshStandardMaterial color="#b98a52" roughness={0.6} /></mesh>
    </group>
  );
};

// carretilla con concreto (el chorro de aceite y el remolino negro)
// varilla entre dos puntos
const Rod: React.FC<{ a: number[]; b: number[]; r: number; c: string; m?: number }> = ({ a, b, r, c, m = 0 }) => {
  const A = new THREE.Vector3(...(a as [number, number, number])), B = new THREE.Vector3(...(b as [number, number, number]));
  const mid = A.clone().add(B).multiplyScalar(0.5), d = B.clone().sub(A), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  return <mesh position={mid} quaternion={q} castShadow><cylinderGeometry args={[r, r, d.length(), 8]} /><meshStandardMaterial color={c} metalness={m} roughness={0.6} /></mesh>;
};

const Wheelbarrow: React.FC<{ s: S; tx: ReturnType<typeof useTex>; t: number }> = ({ s, tx, t }) => {
  const swirl = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 90; i++) { const a = i * 0.22, r = 0.02 + i * 0.0034; pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r * 0.8)); }
    return new THREE.CatmullRomCurve3(pts);
  }, []);
  if (s.wheel < 0.01) return null;
  const up = (1 - s.wheel) * -2;
  return (
    <group position={[WB.x, up, WB.z]}>
      {/* batea */}
      <mesh position={[0, 0.62, 0]} castShadow receiveShadow><cylinderGeometry args={[0.55, 0.38, 0.32, 28, 1, true]} /><meshStandardMaterial color="#5f6b5a" metalness={0.6} roughness={0.45} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.74, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[0.52, 40]} /><meshStandardMaterial color="#8d887e" map={tx.conc} roughness={0.55} metalness={0.02} /></mesh>
      {/* remolino negro */}
      {s.swirl > 0.01 && <mesh position={[0, 0.745, 0]} rotation={[0, t * 0.5, 0]} scale={[1, 1, 1]}><tubeGeometry args={[swirl, 140, 0.012 + 0.018 * s.swirl, 6, false]} /><meshStandardMaterial color="#120e0b" roughness={0.08} metalness={0.25} transparent opacity={Math.min(1, s.swirl * 1.4)} /></mesh>}
      {s.swirl > 0.01 && <mesh position={[0.02, 0.744, 0.01]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.1 + 0.28 * s.swirl, 40]} /><meshStandardMaterial color="#1a1410" roughness={0.06} metalness={0.3} transparent opacity={0.55 * s.swirl} /></mesh>}
      {/* bastidor: dos largueros del eje de la rueda a las manijas, patas, rueda pegada bajo la batea */}
      {[-0.3, 0.3].map((x) => <Rod key={x} a={[x * 0.55, 0.22, 0.78]} b={[x, 0.62, -1.05]} r={0.024} c="#6b4b2a" />)}
      {[-0.3, 0.3].map((x) => <Rod key={"l" + x} a={[x * 0.9, 0.46, -0.42]} b={[x, 0.0, -0.5]} r={0.018} c="#3a3a3a" m={0.6} />)}
      {[-0.3, 0.3].map((x) => <Rod key={"g" + x} a={[x * 0.55, 0.22, 0.78]} b={[x * 0.7, 0.5, 0.3]} r={0.016} c="#3a3a3a" m={0.6} />)}
      <mesh position={[0, 0.22, 0.78]} rotation={[0, Math.PI / 2, 0]} castShadow><torusGeometry args={[0.16, 0.06, 12, 24]} /><meshStandardMaterial color="#1c1c1c" roughness={0.9} /></mesh>
      <mesh position={[0, 0.22, 0.78]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.36, 8]} /><meshStandardMaterial color="#555" metalness={0.7} roughness={0.4} /></mesh>
      {/* bidón que se inclina y chorrea */}
      {s.pourOil > 0.01 && (
        <group position={[0.1, 1.45, -0.05]} rotation={[0, 0, -1.9 * ease(Math.min(1, s.pourOil * 3))]}>
          <Box p={[0, 0, 0]} s={[0.2, 0.3, 0.12]} c="#e8e2d0" r={0.5} o={0.85} rad={0.03} />
          <Box p={[0, -0.04, 0]} s={[0.18, 0.18, 0.1]} c="#1a1410" r={0.2} rad={0.02} />
          <mesh position={[0.06, 0.19, 0]} castShadow><cylinderGeometry args={[0.03, 0.03, 0.06, 12]} /><meshStandardMaterial color="#d8d2c0" roughness={0.5} /></mesh>
        </group>
      )}
      {s.pourOil > 0.15 && s.pourOil < 0.97 && <mesh position={[0.05, 1.1, -0.02]}><cylinderGeometry args={[0.022, 0.034, 0.72, 14]} /><meshStandardMaterial color="#2a1a0c" roughness={0.03} metalness={0.45} emissive="#3a2208" emissiveIntensity={0.25} /></mesh>}
    </group>
  );
};

// cuchara sopera vs bidón de un cuarto (la dosis)
const Dose: React.FC<{ d: number }> = ({ d }) => {
  if (d < 0.01) return null;
  const y = BY + 0.02, sc = ease(d);
  return (
    <group position={[5.75, y, BZ + 0.5]} scale={sc}>
      <Box p={[0.85, 0.42, 0]} s={[0.44, 0.84, 0.3]} c="#e8e2d0" r={0.5} o={0.8} rad={0.06} />
      <Box p={[0.85, 0.32, 0]} s={[0.4, 0.62, 0.26]} c="#120e0b" r={0.15} rad={0.04} />
      <mesh position={[0.85, 0.9, 0]}><cylinderGeometry args={[0.07, 0.07, 0.12, 16]} /><meshStandardMaterial color="#d8d2c0" roughness={0.5} /></mesh>
      <group position={[0, 0.05, 0]}>
        <mesh scale={[1, 0.35, 0.7]} castShadow><sphereGeometry args={[0.06, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#cfd3d6" metalness={0.9} roughness={0.25} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, -0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.7, 1]}><circleGeometry args={[0.052, 20]} /><meshStandardMaterial color="#120e0b" roughness={0.05} /></mesh>
        <mesh position={[-0.2, 0.01, 0]} rotation={[0, 0, Math.PI / 2 + 0.08]}><cylinderGeometry args={[0.008, 0.012, 0.3, 8]} /><meshStandardMaterial color="#cfd3d6" metalness={0.9} roughness={0.25} /></mesh>
      </group>
    </group>
  );
};

// ---------------- LA ESCENA ----------------
export const BlockWorld: React.FC<{ t: number }> = ({ t }) => {
  const s = stateAt(t);
  const tx0 = useTextures();
  const tx = useTex();
  const nts = useMemo(() => [1, 2, 3].map(numTex), []);

  // materiales del corte
  const M = useMemo(() => ({
    stone: new THREE.MeshStandardMaterial({ color: "#8a8174", roughness: 0.8, flatShading: true }),
    sand: new THREE.MeshStandardMaterial({ color: "#c7b28a", roughness: 0.9, flatShading: true }),
    cem: new THREE.MeshStandardMaterial({ color: "#7f8a92", roughness: 0.6 }),
    needle: new THREE.MeshStandardMaterial({ color: "#eef3f6", roughness: 0.3, emissive: new THREE.Color("#bfe0ff"), emissiveIntensity: 0.35 }),
    coat: new THREE.MeshStandardMaterial({ color: "#0f0b08", roughness: 0.06, metalness: 0.35, transparent: true, opacity: 0.92 }),
    bub: new THREE.MeshStandardMaterial({ color: "#2b2f36", roughness: 0.05, metalness: 0.3, emissive: new THREE.Color("#9fd4ff"), emissiveIntensity: 0.25 }),
  }), []);
  const G_ = useMemo(() => ({ ico: new THREE.IcosahedronGeometry(1, 0), sph: new THREE.SphereGeometry(1, 14, 10), cyl: new THREE.CylinderGeometry(0.0018, 0.0007, 1, 5).translate(0, 0.5, 0) }), []);
  const q = (x: number, n = 40) => Math.round(x * n) / n;

  // granos por tipo
  const stones = GRAINS.filter((g) => g.kind === 0), sands = GRAINS.filter((g) => g.kind === 1);
  const rot = (i: number) => new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(i, 51) * 3, rnd(i, 52) * 3, rnd(i, 53) * 3));
  const lift = (1 - s.macro) * -3.5;
  // agujas: crecen con hyd; con grab se alargan hasta tocar al vecino; con aceite se quedan cortas (no agarran)
  const needleOK = (i: number) => NEEDLES[i].d < s.hyd;
  const needleLen = (i: number) => NEEDLES[i].len * (0.35 + 0.65 * ease(s.hyd)) * (1 + 0.9 * s.grab) * (1 - 0.6 * s.oil);
  // burbujas visibles: cantidad por bub; con relief se iluminan de hielo
  const nb = Math.round(BUBS.length * cl(s.bub));
  // venas: largo visible por veins
  const veinGeos = useMemo(() => VEINS.map((c) => new THREE.TubeGeometry(c, 60, 0.012, 6, false)), []);
  const chanGeos = useMemo(() => CHANNELS.map((c) => new THREE.TubeGeometry(c, 30, 0.01, 5, false)), []);
  // escamas que saltan de la cara de arriba
  const flakes = useMemo(() => Array.from({ length: 40 }, (_, i) => ({ x: (rnd(i, 61) - 0.5) * 2.6, z: MB.zf - 0.05 - rnd(i, 62) * 1.2, r: 0.06 + rnd(i, 63) * 0.12, d: rnd(i, 64) })), []);
  // grietas del hielo en la cara de arriba
  const cracks = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const pts: THREE.Vector3[] = []; let x = (rnd(i, 71) - 0.5) * 2.4, z = MB.zf;
    for (let k = 0; k < 12; k++) { pts.push(new THREE.Vector3(x, MB.s + 0.004, z)); x += (rnd(i * 9 + k, 72) - 0.5) * 0.18; z -= 0.12; }
    return new THREE.CatmullRomCurve3(pts);
  }), []);
  const crackGeos = useMemo(() => cracks.map((c) => new THREE.TubeGeometry(c, 40, 0.008, 4, false)), [cracks]);

  // vapor frío del freezer alrededor de los bloques
  const fogPts = useMemo(() => new Float32Array(160 * 3), []);
  if (s.frost > 0.01) for (let i = 0; i < 160; i++) { const ph = (rnd(i, 81) + t * 0.2) % 1; fogPts.set([BX[0] - 0.4 + rnd(i, 82) * 2.8, BY + BS + ph * 0.5, BZ - 0.2 + rnd(i, 83) * 0.5], i * 3); }
  // polvo cuando salta la esquina
  const dust = useMemo(() => new Float32Array(90 * 3), []);
  const dustO = s.hammer > 0.5 ? Math.max(0, 1 - (s.hammer - 0.5) * 2.2) : 0;
  if (dustO > 0) for (let i = 0; i < 90; i++) { const r = (s.hammer - 0.5) * 1.6 * rnd(i, 91); const a = rnd(i, 92) * 6.28; dust.set([BX[1] + BS / 2 + Math.cos(a) * r, BY + BS * 0.8 + Math.sin(a) * r * 0.6 - (s.hammer - 0.5) * 0.3, BZ + BS / 2 + rnd(i, 93) * 0.2], i * 3); }

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.18} threshold={0.88} exposure={1.0} env={0.36} />
      <color attach="background" args={["#b9c7d3"]} />
      <fogExp2 attach="fog" args={["#b9c7d3", 0.022]} />
      <hemisphereLight args={["#e6edf5", "#5f5446", 0.8]} />
      <directionalLight position={[5, 9, 8]} intensity={2.4} color="#fff0d8" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-10} shadow-camera-right={12} shadow-camera-top={8} shadow-camera-bottom={-6} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* luz de maqueta sobre la cara del corte */}
      <pointLight position={[0.6, 1.8, 4.2]} intensity={5.5 * s.macro} distance={7} color="#fff4e6" />
      <pointLight position={[-1.8, 0.8, 3.4]} intensity={2.2 * s.macro} distance={6} color="#ffe2c4" />
      {/* luz del banco */}
      <pointLight position={[7.2, 3.0, 2.6]} intensity={3.5} distance={6} color="#fff1dc" />

      {/* ===== piso del patio (losa de concreto) + pared del garaje al fondo ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial map={tx0.concrete} color="#bdb8ae" roughness={0.95} /></mesh>
      <Box p={[3, 2.6, -4.5]} s={[22, 5.2, 0.3]} c="#e3ded3" r={0.95} map={tx0.siding} rad={0.02} />
      <Box p={[7.2, 1.7, -4.3]} s={[4.6, 3.2, 0.1]} c="#d7d3ca" r={0.7} />
      {[0, 1, 2, 3, 4, 5].map((k) => <Box key={k} p={[7.2, 0.25 + k * 0.53, -4.22]} s={[4.5, 0.03, 0.05]} c="#bfbab0" r={0.7} rad={0.005} />)}
      {/* cerco de madera a la izquierda */}
      {Array.from({ length: 16 }, (_, k) => <Box key={k} p={[-9 + k * 0.42, 1.0, -3.9]} s={[0.36, 2.0, 0.05]} c={k % 2 ? "#8a6a48" : "#957452"} r={0.95} map={tx0.planks} rad={0.01} />)}

      {/* ===== EL BLOQUE GIGANTE EN CORTE ===== */}
      <group position={[0, lift, 0]}>
        {/* cuerpo del bloque (atrás de la cara) */}
        <Box p={[0, MB.s / 2, 0]} s={[MB.s, MB.s, MB.s]} c="#ffffff" r={0.95} map={tx.paste} rad={0.03} />
        {/* cara del corte: pasta (algo más clara para que se lean los granos) */}
        <mesh position={[0, MB.s / 2, MB.zf + 0.001]} receiveShadow><planeGeometry args={[MB.s - 0.02, MB.s - 0.02]} />
          <meshStandardMaterial map={tx.paste} color={new THREE.Color("#bdb8b0").lerp(new THREE.Color("#7e8fa0"), s.water * 0.5).lerp(new THREE.Color("#6d6155"), s.oil * 0.45)} roughness={0.9 - 0.6 * s.water} /></mesh>
        {/* piedras, arena, granos de cemento */}
        <Inst n={stones.length} geo={G_.ico} mat={M.stone} key2="st" set={(i, m) => { const g = stones[i]; m.compose(new THREE.Vector3(g.x, g.y, g.z), rot(i), new THREE.Vector3(g.r, g.r * 0.85, g.r * 0.7)); return true; }} />
        <Inst n={sands.length} geo={G_.ico} mat={M.sand} key2="sa" set={(i, m) => { const g = sands[i]; m.compose(new THREE.Vector3(g.x, g.y, g.z), rot(i + 99), new THREE.Vector3(g.r, g.r, g.r * 0.7)); return true; }} />
        <Inst n={CEM.length} geo={G_.sph} mat={M.cem} key2="ce" set={(i, m) => { const g = CEM[i]; m.compose(new THREE.Vector3(g.x, g.y, g.z), new THREE.Quaternion(), new THREE.Vector3(g.r, g.r, g.r * 0.6)); return true; }} />
        {/* agujas de hidratación */}
        {s.hyd > 0.01 && <Inst n={NEEDLES.length} geo={G_.cyl} mat={M.needle} key2={`nd${q(s.hyd)}|${q(s.grab)}|${q(s.oil)}`} set={(i, m) => {
          if (!needleOK(i)) return false; const nd = NEEDLES[i], L = needleLen(i);
          const qt = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, nd.a - Math.PI / 2));
          m.compose(new THREE.Vector3(nd.g.x + Math.cos(nd.a) * nd.g.r * 0.9, nd.g.y + Math.sin(nd.a) * nd.g.r * 0.9, MB.zf + 0.008), qt, new THREE.Vector3(1, L, 1)); return true;
        }} />}
        {/* el impermeable de aceite: cáscara negra brillante sobre arena y piedras (y cemento) */}
        {s.oil > 0.01 && <Inst n={GRAINS.length} geo={G_.sph} mat={M.coat} key2={`oc${q(s.oil)}`} set={(i, m) => {
          const g = GRAINS[i]; if (rnd(i, 77) > s.oil * 1.15) return false;
          const k = 1.12 + 0.1 * (g.kind === 2 ? 1 : 0);
          m.compose(new THREE.Vector3(g.x, g.y, g.z + 0.004), new THREE.Quaternion(), new THREE.Vector3(g.r * k, g.r * k * 0.92, g.r * 0.75)); return true;
        }} />}
        {/* venas de aceite que chorrean entre los granos */}
        {s.veins > 0.01 && veinGeos.map((geo, i) => {
          const idx = geo.index ? geo.index.count : geo.attributes.position.count;
          const show = cl(s.veins * 1.4 - (i / veinGeos.length) * 0.4);
          geo.setDrawRange(0, Math.floor(idx * show / 6) * 6);
          return show > 0 ? <mesh key={i} geometry={geo}><meshStandardMaterial color="#0e0a07" roughness={0.04} metalness={0.4} /></mesh> : null;
        })}
        {/* burbujitas de aire incorporado (con alivio: el hielo se mete en ellas y se iluminan) */}
        {nb > 0 && <Inst n={BUBS.length} geo={G_.sph} mat={M.bub} key2={`bb${nb}`} set={(i, m) => { if (i >= nb) return false; const b = BUBS[i]; m.compose(new THREE.Vector3(b.x, b.y, MB.zf + 0.006), new THREE.Quaternion(), new THREE.Vector3(b.r, b.r, b.r * 0.5)); return true; }} />}
        {nb > 0 && s.relief > 0.01 && <Inst n={BUBS.length} geo={G_.sph} mat={M.needle} key2={`br${nb}|${q(s.relief)}`} set={(i, m) => { if (i >= nb || BUBS[i].d > s.relief) return false; const b = BUBS[i]; m.compose(new THREE.Vector3(b.x, b.y, MB.zf + 0.009), new THREE.Quaternion(), new THREE.Vector3(b.r * 0.7, b.r * 0.7, b.r * 0.4)); return true; }} />}
        {/* canales con agua → hielo */}
        {s.ice > 0.01 && chanGeos.map((geo, i) => <mesh key={i} geometry={geo} scale={[1, 1, 1]}><meshStandardMaterial color={new THREE.Color("#3f8fd6").lerp(new THREE.Color("#e6f4ff"), cl(s.ice * 1.6 - 0.6))} emissive={new THREE.Color("#2a6fb8").lerp(new THREE.Color("#a8d8ff"), cl(s.ice * 1.6 - 0.6))} emissiveIntensity={0.4} roughness={0.2} transparent opacity={Math.min(1, s.ice * 2)} /></mesh>)}
        {/* grietas que abre el hielo en la cara de arriba */}
        {s.push > 0.01 && crackGeos.map((geo, i) => { const idx = geo.index ? geo.index.count : 0; geo.setDrawRange(0, Math.floor(idx * cl(s.push * 1.3 - i * 0.05) / 6) * 6); return <mesh key={i} geometry={geo}><meshStandardMaterial color="#1e1d1b" roughness={1} /></mesh>; })}
        {/* escamas que saltan */}
        {s.flake > 0.01 && flakes.map((f, i) => {
          const k = cl((s.flake - f.d * 0.6) * 2.5); if (k <= 0) return null;
          return <mesh key={i} position={[f.x + k * (rnd(i, 65) - 0.5) * 0.6, MB.s + 0.01 + k * 0.5 - k * k * 0.3, f.z + k * 0.5]} rotation={[k * 3, k * 2, k]} castShadow><cylinderGeometry args={[f.r, f.r * 0.9, 0.018, 7]} /><meshStandardMaterial color="#a7a39b" roughness={1} map={tx.conc} /></mesh>;
        })}
      </group>

      {/* ===== BANCO DE PRUEBAS: mesa + balanza de pruebas + barras de puntaje ===== */}
      <group>
        <Box p={[7.2, BY - 0.06, BZ]} s={[3.6, 0.12, 1.3]} c="#8a6a48" r={0.8} map={tx0.planks} rad={0.02} />
        {[[5.55, 0.1], [8.85, 0.1], [5.55, 1.1], [8.85, 1.1]].map(([x, z], k) => <Box key={k} p={[x, (BY - 0.12) / 2, z]} s={[0.1, BY - 0.12, 0.1]} c="#6e5236" r={0.9} rad={0.01} />)}
        {/* plataformas de la balanza: una por bloque, con su riel */}
        {BX.map((x, i) => <Box key={i} p={[x, BY + 0.015, BZ]} s={[0.66, 0.03, 0.66]} c="#3b3f44" m={0.7} r={0.35} rad={0.008} e={s.hi === i + 1 ? "#ffb257" : undefined} ei={s.hi === i + 1 ? 0.5 : 0} />)}
        {/* barras de puntaje (atrás de cada bloque): verde si aguanta, roja la del aceite */}
        {s.barsOn > 0.01 && BX.map((x, i) => {
          const v = cl(s.bars[i]), h = 1.2 * v * s.barsOn;
          const col = i === 1 ? "#d9452b" : "#6fb04a";
          return (
            <group key={i} position={[x, BY + 0.03, BZ - 0.45]}>
              <Box p={[0, 0.6, -0.02]} s={[0.22, 1.2, 0.04]} c="#2b2e33" r={0.8} rad={0.01} o={0.85 * s.barsOn} />
              {h > 0.01 && <Box p={[0, h / 2, 0.01]} s={[0.16, h, 0.05]} c={col} r={0.5} e={col} ei={0.35} rad={0.01} />}
            </group>
          );
        })}
        {/* encofrados de terciado (antes de desmoldar) */}
        {s.forms > 0.01 && BX.map((x, i) => {
          const off = s.demold * 0.9;
          const sides: [number, number, number, number][] = [[0, BS / 2 + 0.03, 1, 0], [0, -(BS / 2 + 0.03), 1, 0], [BS / 2 + 0.03, 0, 0, 1], [-(BS / 2 + 0.03), 0, 0, 1]];
          return (
            <group key={i} position={[x, BY + BS / 2 + (1 - s.forms) * 1.5, BZ]}>
              {sides.map(([sx, sz, wx, wz], k) => <Box key={k} p={[sx * (1 + off * 2), -off * 0.4, sz * (1 + off * 2)]} s={[wx ? BS + 0.12 : 0.03, BS, wz ? BS + 0.12 : 0.03]} c="#ffffff" r={0.8} map={tx.ply} rad={0.005} o={1 - s.demold} />)}
              {/* concreto adentro (sube con fill) */}
              {s.fill > 0.01 && s.demold < 0.5 && <mesh position={[0, -BS / 2 + (BS * s.fill) / 2, 0]}><boxGeometry args={[BS, BS * s.fill, BS]} /><meshStandardMaterial map={i === 1 ? tx.oily : tx.conc} color="#ffffff" roughness={i === 1 ? 0.15 : 0.4} metalness={i === 1 ? 0.15 : 0} /></mesh>}
            </group>
          );
        })}
        {/* plástico de curado */}
        {s.plastic > 0.01 && <mesh position={[7.2, BY + BS + 0.06 + (1 - s.plastic) * 0.8, BZ]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3.0, 1.0, 8, 4]} /><meshPhysicalMaterial color="#e8f0f4" roughness={0.15} transmission={0.6} transparent opacity={0.6 * s.plastic} side={THREE.DoubleSide} /></mesh>}
        {[0, 1, 2].map((i) => <TestBlock key={i} i={i} s={s} tx={tx} nt={nts[i]} />)}
        <Hammer h={s.hammer} />
        <Dose d={s.dose} />
        {/* volquete (al fondo, cuando el bloque 2 se va) */}
        {s.dump > 0.01 && <group position={[10.5, 0, -2.2]}><Box p={[0, 0.55, 0]} s={[2.2, 1.1, 1.3]} c="#3d5a7a" m={0.5} r={0.6} rad={0.04} /><Box p={[0, 1.12, 0]} s={[2.25, 0.06, 1.35]} c="#2d4560" m={0.5} r={0.6} rad={0.02} /></group>}
      </group>

      <Wheelbarrow s={s} tx={tx} t={t} />
      <Dots pts={fogPts} size={0.14} color="#e8f4ff" opacity={s.frost * 0.45} map={tx.dot} />
      <Dots pts={dust} size={0.05} color="#7a6e60" opacity={dustO} map={tx.dot} />
    </ThreeCanvas>
  );
};

// marcadores 3D (para portales y rótulos)
export const PT = {
  face: [0, MB.s / 2, MB.zf] as [number, number, number],
  faceTop: [0, MB.s - 0.2, MB.zf] as [number, number, number],
  grain: [CEM[20].x, CEM[20].y, MB.zf] as [number, number, number],
  top: [0, MB.s, MB.zf - 0.4] as [number, number, number],
  wheel: [WB.x, 0.75, WB.z] as [number, number, number],
  b1: [BX[0], BY + BS / 2, BZ + BS / 2] as [number, number, number],
  b2: [BX[1], BY + BS / 2, BZ + BS / 2] as [number, number, number],
  b3: [BX[2], BY + BS / 2, BZ + BS / 2] as [number, number, number],
  b2top: [BX[1], BY + BS, BZ] as [number, number, number],
  dose: [5.75, BY + 0.1, BZ + 0.5] as [number, number, number],
};
export { ST };
