// ctrinodoro · EL MUNDO: baño en corte (maqueta de arquitecto) con el INODORO abierto como un corte de vidrio:
// la loza cortada muestra el agua en sección y, en la línea del agua, el sarro como ESTRATOS DE ROCA
// (3 capas grises de cal abajo, 4 marrones de mugre arriba). La pastilla cae, suelta burbujas que suben y van
// carcomiendo las capas de arriba hacia abajo; las marrones se despegan en hojuelas que flotan.
// En la pared: el RELOJ DE LA NOCHE (22:00 → 06:00). Al costado: el tanque (con la pastilla de cloro que hay que sacar),
// la pileta con el jarro de agua caliente y la caja de pastillas.
// Una sola escena y UNA cámara (keyframes desde Min1/Body anclados a la voz). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const makeCam = (KEYS: Key[]) => {
  const camAt = (t: number) => {
    let i = 0;
    while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
    const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
    const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
    const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
    if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
    return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
  };
  const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
    const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.01, 200); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
    const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
  };
  const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
  const camSpeed = (t: number) => {
    const a = camAt(t), b = camAt(t + 1 / FPS);
    const pa = project(a, b.l), pb = project(b, b.l);
    const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
    return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
  };
  return { camAt, screenOf, camSpeed };
};

// ---------------- geometría del inodoro ----------------
// perfil (r, y) de la loza: pared de adentro desde el desagüe hasta el borde, labio, y pared de afuera hasta el piso
const ZS = 1.22;                     // la taza es ovalada: escala en z
const YW = 0.3;                      // línea del agua (nivel normal)
const INNER: [number, number][] = [[0.055, 0.17], [0.1, 0.2], [0.155, 0.24], [0.19, 0.27], [0.212, 0.3], [0.232, 0.33], [0.25, 0.37], [0.262, 0.405], [0.268, 0.425]];
const OUTER: [number, number][] = [[0.3, 0.432], [0.305, 0.418], [0.298, 0.39], [0.278, 0.33], [0.245, 0.27], [0.2, 0.21], [0.16, 0.15], [0.15, 0.07], [0.165, 0.0], [0.12, 0.0]];
const rIn = (y: number) => { for (let i = 0; i < INNER.length - 1; i++) { const [r0, y0] = INNER[i], [r1, y1] = INNER[i + 1]; if (y <= y1) return lerp(r0, r1, cl((y - y0) / (y1 - y0))); } return INNER[INNER.length - 1][0]; };
const PHI0 = Math.PI * 0.36, PHIL = Math.PI * 2 - PHI0 * 2;   // abierto hacia la cámara (+z)
const PROFILE = [...INNER, ...OUTER];

// marcadores 3D (mundo) para portales y rótulos
export const PT = {
  ring: [0.0, YW, 0.2] as V3,            // la línea del agua, de frente en el corte
  ringBack: [0.0, YW, -0.24] as V3,
  water: [0.0, 0.24, 0.0] as V3,
  drain: [0.0, 0.17, 0.0] as V3,
  rim: [0.0, 0.43, 0.25] as V3,
  holes: [0.0, 0.405, -0.3] as V3,
  tank: [0.0, 0.68, -0.38] as V3,
  clock: [-0.95, 1.55, -0.68] as V3,
  sink: [0.95, 0.82, -0.35] as V3,
  jar: [0.82, 0.92, -0.32] as V3,
  box: [1.12, 0.93, -0.42] as V3,
  window: [-1.39, 1.35, -0.1] as V3,
  valve: [0.17, 0.22, -0.66] as V3,
};

// ---------------- texturas propias ----------------
const mkTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
// mugre marrón (moteado, con chorreaduras verticales finas)
const useGrime = () => useMemo(() => mkTex(512, 128, (g) => {
  g.fillStyle = "#7a4a22"; g.fillRect(0, 0, 512, 128);
  for (let i = 0; i < 1400; i++) { const v = rnd(i, 1); g.fillStyle = `rgba(${60 + v * 90},${35 + v * 45},${12 + v * 18},${0.25 + rnd(i, 2) * 0.4})`; g.beginPath(); g.arc(rnd(i, 3) * 512, rnd(i, 4) * 128, 1 + rnd(i, 5) * 4, 0, 6.3); g.fill(); }
  for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(80,45,15,${0.2 + rnd(i, 6) * 0.3})`; g.lineWidth = 1 + rnd(i, 7) * 2; const x = rnd(i, 8) * 512; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (rnd(i, 9) - 0.5) * 6, 40 + rnd(i, 10) * 88); g.stroke(); }
}), []);
// cal: gris-blanco áspero
const useScale = () => useMemo(() => mkTex(512, 128, (g) => {
  g.fillStyle = "#c9c4b6"; g.fillRect(0, 0, 512, 128);
  for (let i = 0; i < 1800; i++) { const v = 150 + rnd(i, 1) * 90; g.fillStyle = `rgba(${v},${v - 4},${v - 14},.5)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 128, 1 + rnd(i, 4) * 3, 1 + rnd(i, 5) * 3); }
}), []);
// esfera del reloj de la noche: 12 h, arco azul de 22:00 a la hora actual, luna → sol
const drawClock = (g: CanvasRenderingContext2D, hour: number, glow: number) => {
  const N = 1024, c = N / 2;
  g.clearRect(0, 0, N, N);
  const gr = g.createRadialGradient(c, c * 0.8, 50, c, c, c); gr.addColorStop(0, "#fbfaf6"); gr.addColorStop(1, "#e2ddd2");
  g.fillStyle = gr; g.beginPath(); g.arc(c, c, c - 4, 0, 6.3); g.fill();
  const ang = (h: number) => ((h % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  if (hour > 22.01) { g.strokeStyle = `rgba(70,110,${190 + glow * 40},.85)`; g.lineWidth = 46; g.beginPath(); g.arc(c, c, c - 70, ang(22), ang(22) + ((hour - 22) / 12) * Math.PI * 2); g.stroke(); }
  for (let k = 0; k < 60; k++) {
    const a = (k / 60) * Math.PI * 2 - Math.PI / 2, big = k % 5 === 0;
    g.strokeStyle = big ? "#1d1f22" : "#55585d"; g.lineWidth = big ? 12 : 4;
    g.beginPath(); g.moveTo(c + Math.cos(a) * (c - (big ? 130 : 110)), c + Math.sin(a) * (c - (big ? 130 : 110))); g.lineTo(c + Math.cos(a) * (c - 96), c + Math.sin(a) * (c - 96)); g.stroke();
    if (big) { g.fillStyle = "#1d1f22"; g.font = "bold 70px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(k / 5 || 12), c + Math.cos(a) * (c - 195), c + Math.sin(a) * (c - 195)); }
  }
  const hh = Math.floor(hour) % 24, mm = Math.floor((hour % 1) * 60);
  g.fillStyle = "#111"; g.fillRect(c - 190, c + 120, 380, 130); g.fillStyle = "#8fd6ff"; g.font = "bold 108px 'Courier New', monospace"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`, c, c + 188);
  // luna (de noche) que se vuelve sol (06:00)
  const sun = cl((hour - 28.5) / 1.5);
  g.fillStyle = sun > 0.5 ? "#ffcf5a" : "#ffe7a3"; g.beginPath(); g.arc(c, c - 170, 54, 0, 6.3); g.fill();
  if (sun < 0.5) { g.fillStyle = "#e9e4d8"; g.beginPath(); g.arc(c + 26, c - 186, 48, 0, 6.3); g.fill(); }
  else for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g.strokeStyle = "#ffb52e"; g.lineWidth = 8; g.beginPath(); g.moveTo(c + Math.cos(a) * 66, c - 170 + Math.sin(a) * 66); g.lineTo(c + Math.cos(a) * 88, c - 170 + Math.sin(a) * 88); g.stroke(); }
};
const useClockTex = (hour: number, glow: number) => {
  const { cv, tex } = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 1024; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; return { cv, tex }; }, []);
  drawClock(cv.getContext("2d")!, hour, glow); tex.needsUpdate = true; return tex;
};
const useDot = () => useMemo(() => mkTex(64, 64, (g) => {
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.5, "rgba(255,255,255,.65)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
}), []);
// burbuja: aro brillante con centro transparente
const useBubble = () => useMemo(() => mkTex(64, 64, (g) => {
  g.strokeStyle = "rgba(255,255,255,.95)"; g.lineWidth = 4; g.beginPath(); g.arc(32, 32, 24, 0, 6.3); g.stroke();
  g.fillStyle = "rgba(255,255,255,.9)"; g.beginPath(); g.arc(24, 23, 5, 0, 6.3); g.fill();
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; map?: Tx; rad?: number; rot?: V3; o?: number }> = ({ p, s, c, r = 0.8, m = 0, e, ei = 0, map, rad = 0.02, rot, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={o < 1} opacity={o} /></mesh>
);
const Slab: React.FC<{ p: V3; s: V3; c: string; cut?: string; map?: Tx }> = ({ p, s, c, cut = "#efe8da", map }) => (
  <group position={p}>
    <mesh receiveShadow castShadow><boxGeometry args={s} /><meshStandardMaterial color={c} roughness={0.92} map={map} /></mesh>
    <mesh position={[0, 0, s[2] / 2 + 0.002]}><planeGeometry args={[s[0], s[1]]} /><meshStandardMaterial color={cut} roughness={1} /></mesh>
  </group>
);
// tapa del corte en un ángulo phi (forma en el plano r-y)
const Cap: React.FC<{ pts: [number, number][]; phi: number; c: string; o?: number; e?: number }> = ({ pts, phi, c, o = 1, e = 0 }) => {
  const geo = useMemo(() => { const sh = new THREE.Shape(); pts.forEach(([r, y], i) => (i ? sh.lineTo(r, y) : sh.moveTo(r, y))); sh.closePath(); return new THREE.ShapeGeometry(sh); }, [pts]);
  return <mesh geometry={geo} rotation={[0, phi - Math.PI / 2, 0]}><meshStandardMaterial color={c} roughness={0.85} side={THREE.DoubleSide} transparent={o < 1} opacity={o} emissive={c} emissiveIntensity={e} polygonOffset polygonOffsetFactor={-1} /></mesh>;
};

export type Ev = {
  day: number;            // 0 noche · 1 día
  hour: number;           // reloj de la noche: 22 → 30 (06:00)
  glow: number;           // brillo del reloj
  brown: number;          // capas marrones que quedan (0..1)
  cal: number;            // capas de cal que quedan (0..1)
  eat: number;            // las burbujas carcomiendo (resalta la capa que se está comiendo)
  lift: number;           // hojuelas marrones que se sueltan y flotan (0..1)
  bub: number;            // burbujas subiendo
  tab: number; tabDrop: number;  // pastilla (escala) · caída al agua
  cloud: number;          // agua turbia
  level: number;          // nivel del agua (1 normal, 0 sin agua: paso 6)
  paper?: number;         // vendaje de papel con vinagre sobre la línea
  flush?: number;         // descarga (remolino)
  brush?: number;         // cepillo: 0 fuera · 0..1 una vuelta por la línea
  card?: number;          // tarjeta de plástico raspando
  tank?: number;          // tapa del tanque levantada
  puck?: number;          // pastilla de cloro azul en el tanque (1 está · 0 sacada)
  jar?: number;           // jarro con la pastilla burbujeando en la pileta
  pour?: number;          // el jarro vuela y se vuelca desde el borde (0..1)
  holes?: number;         // agujeritos del borde sucios (1) → limpios (0)
  curtain?: number;       // la descarga pareja en cortina (bonus)
  hi?: number;            // resalta los estratos (brillo)
  glaze?: number;         // raya negra metida en el esmalte (el desgaste)
};
export const EV0: Ev = { day: 0.75, hour: 22, glow: 0, brown: 1, cal: 1, eat: 0, lift: 0, bub: 0, tab: 0, tabDrop: 0, cloud: 0, level: 1 };

// LOS ESTRATOS: 7 bandas finas en la línea del agua (3 de cal abajo · 4 marrones arriba), cada una con su tapa en el corte
const NB = 7, BH = 0.0075, Y0 = YW - 0.026;
const Strata: React.FC<{ ev: Ev; t: number; grime: THREE.Texture; scale: THREE.Texture; yOff: number }> = ({ ev, t, grime, scale, yOff }) => {
  const bands = useMemo(() => Array.from({ length: NB }, (_, i) => {
    const y = Y0 + i * BH, r = rIn(y + BH / 2) - 0.001, isCal = i < 3;
    const th = isCal ? 0.006 + i * 0.0012 : 0.007 - (i - 3) * 0.0009;
    const geo = new THREE.CylinderGeometry(r - 0.0005, r - 0.0005, BH * 0.96, 96, 1, true, PHI0, PHIL);
    return { y, r, isCal, th, geo };
  }), []);
  return (
    <group position={[0, yOff, 0]}>
      {bands.map((b, i) => {
        // las marrones se van de arriba hacia abajo (la 6 primero); la cal de arriba hacia abajo también
        const keep = b.isCal ? cl(ev.cal * 3 - (2 - i)) : cl(ev.brown * 4 - (6 - i));
        if (keep <= 0.01) return null;
        const hiB = ev.eat * (b.isCal ? (ev.brown < 0.05 ? 1 : 0) : 1) * (0.5 + 0.5 * Math.sin(t * 6 + i));
        const col = b.isCal ? new THREE.Color("#cfc9b9").lerp(new THREE.Color("#a9a493"), (2 - i) * 0.25) : new THREE.Color("#8a5428").lerp(new THREE.Color("#4e2c12"), (i - 3) * 0.28);
        const th = b.th * keep, rr = b.r - th / 2;
        const capPts: [number, number][] = [[b.r - th, b.y], [b.r, b.y], [b.r, b.y + BH * 0.96], [b.r - th, b.y + BH * 0.96]];
        return (
          <group key={i}>
            <mesh position={[0, b.y + BH / 2, 0]} geometry={b.geo} scale={[(rr) / (b.r - 0.0005), 1, (rr) / (b.r - 0.0005)]}>
              <meshStandardMaterial map={b.isCal ? scale : grime} color={col} roughness={b.isCal ? 0.95 : 0.7} side={THREE.DoubleSide} emissive={b.isCal ? "#d8e8ff" : "#ff9a4a"} emissiveIntensity={0.05 * (ev.hi ?? 0) + 0.18 * hiB} transparent={keep < 0.98} opacity={0.35 + 0.65 * keep} />
            </mesh>
            <Cap pts={capPts} phi={PHI0} c={`#${col.getHexString()}`} e={0.12 * (ev.hi ?? 0) + 0.25 * hiB} />
            <Cap pts={capPts} phi={PHI0 + PHIL} c={`#${col.getHexString()}`} e={0.12 * (ev.hi ?? 0) + 0.25 * hiB} />
          </group>
        );
      })}
    </group>
  );
};

// hojuelas marrones que se despegan de la pared y flotan
const FLK = 60;
const Flakes: React.FC<{ ev: Ev; t: number; grime: THREE.Texture; wy: number }> = ({ ev, t, grime, wy }) => {
  const fl = useMemo(() => Array.from({ length: FLK }, (_, i) => {
    const sh = new THREE.Shape(), n = 9, rr = 0.006 + rnd(i, 7) * 0.007;
    for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2, q = rr * (0.55 + rnd(i, k + 9) * 0.7); const x = Math.cos(a) * q, y = Math.sin(a) * q; k ? sh.lineTo(x, y) : sh.moveTo(x, y); }
    const phi = PHI0 + rnd(i, 3) * PHIL;
    return { g: new THREE.ShapeGeometry(sh), phi, y: YW - 0.004 + rnd(i, 4) * 0.02 };
  }), []);
  if (ev.lift <= 0.001) return null;
  return (
    <group>
      {fl.map((f, i) => {
        const k = cl((ev.lift - rnd(i, 5) * 0.5) / 0.5);
        if (k <= 0) return null;
        const r0 = rIn(f.y) - 0.004, r = r0 * (1 - 0.55 * k);
        const ang = f.phi + k * 0.6 * (rnd(i, 6) - 0.5) + Math.sin(t * 0.7 + i) * 0.02 * k;
        const y = lerp(f.y, wy - 0.006 - rnd(i, 8) * 0.05, k) + Math.sin(t * 1.1 + i) * 0.002 * k;
        return <mesh key={i} geometry={f.g} position={[Math.sin(ang) * r, y, Math.cos(ang) * r]} rotation={[-Math.PI / 2 + (rnd(i, 12) - 0.5) * 1.4 * k, ang, rnd(i, 14) * 6]}>
          <meshStandardMaterial map={grime} color="#6a3e1c" roughness={0.75} side={THREE.DoubleSide} />
        </mesh>;
      })}
    </group>
  );
};

// burbujas: suben desde la pastilla (en el fondo) y se juntan en la línea del agua, donde muerden
const Bubbles: React.FC<{ ev: Ev; t: number; bub: THREE.Texture; wy: number }> = ({ ev, t, bub, wy }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const n = 700, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const ph = (rnd(i, 1) + t * (0.22 + rnd(i, 2) * 0.25)) % 1;
    const toRing = i % 3 !== 0;   // 2 de cada 3 van a la pared
    const ang = rnd(i, 3) * Math.PI * 2;
    const yb = 0.18 + (wy - 0.19) * ph;
    const r = toRing ? lerp(0.02, rIn(yb) - 0.008, Math.pow(ph, 0.6)) : 0.03 * rnd(i, 4) + ph * 0.05;
    p.set([Math.sin(ang) * r + Math.sin(t * 2 + i) * 0.003, yb, (Math.cos(ang) * r) * ZS], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
  return ev.bub > 0.01 ? <points geometry={geo}><pointsMaterial map={bub} color="#eaf6ff" size={0.012} transparent opacity={0.85 * ev.bub} depthWrite={false} sizeAttenuation /></points> : null;
};

// EL INODORO
const Toilet: React.FC<{ t: number; ev: Ev; grime: THREE.Texture; scale: THREE.Texture; dot: THREE.Texture; bub: THREE.Texture }> = ({ t, ev, grime, scale, dot, bub }) => {
  const loza = useMemo(() => new THREE.LatheGeometry(PROFILE.map(([r, y]) => new THREE.Vector2(r, y)), 120, PHI0, PHIL), []);
  const glass = useMemo(() => new THREE.LatheGeometry(OUTER.slice(0, 8).map(([r, y]) => new THREE.Vector2(r + 0.004, y)), 120, -PHI0, PHI0 * 2), []);
  // agua: nivel según ev.level (de YW a casi el desagüe)
  const wy = lerp(0.185, YW, ev.level);
  const waterPts = useMemo(() => {
    const pts: [number, number][] = [[0, 0.17]];
    for (const [r, y] of INNER) if (y <= wy) pts.push([r - 0.0015, y]);
    pts.push([rIn(wy) - 0.0015, wy], [0, wy]);
    return pts;
  }, [wy]);
  const waterBody = useMemo(() => new THREE.LatheGeometry(waterPts.map(([r, y]) => new THREE.Vector2(r, y)), 96, PHI0, PHIL), [waterPts]);
  const wr = rIn(wy) - 0.0015;
  const flushA = (ev.flush ?? 0);
  const wCol = new THREE.Color("#9cc4d6").lerp(new THREE.Color("#d9d4c4"), ev.cloud);
  const brushAng = PHI0 + 0.15 + (ev.brush ?? 0) * (PHIL - 0.3);
  return (
    <group>
      <group scale={[1, 1, ZS]}>
        {/* loza (cortada) + tapas del corte en crema */}
        <mesh geometry={loza} castShadow receiveShadow><meshPhysicalMaterial color="#f7f7f4" roughness={0.12} metalness={0} clearcoat={1} clearcoatRoughness={0.08} side={THREE.DoubleSide} /></mesh>
        <Cap pts={PROFILE} phi={PHI0} c="#efe8da" />
        <Cap pts={PROFILE} phi={PHI0 + PHIL} c="#efe8da" />
        {/* el frente que falta: VIDRIO (el corte se ve a través) */}
        <mesh geometry={glass}><meshPhysicalMaterial color="#e8f4ff" roughness={0.03} metalness={0} transmission={0.92} thickness={0.01} transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        {/* raya del esmalte gastado (sólo cuando se habla del desgaste) */}
        {(ev.glaze ?? 0) > 0.01 && <mesh position={[0, YW + 0.006, 0]}><cylinderGeometry args={[rIn(YW + 0.006) - 0.0003, rIn(YW + 0.006) - 0.0003, 0.0022, 96, 1, true, PHI0, PHIL]} /><meshBasicMaterial color="#1a1612" transparent opacity={ev.glaze} side={THREE.DoubleSide} /></mesh>}
        {/* LOS ESTRATOS */}
        <Strata ev={ev} t={t} grime={grime} scale={scale} yOff={0} />
        {/* vendaje de papel con vinagre */}
        {(ev.paper ?? 0) > 0.01 && <mesh position={[0, YW, 0]}><cylinderGeometry args={[rIn(YW) - 0.012, rIn(YW) - 0.012, 0.045, 96, 1, true, PHI0, PHIL * (ev.paper ?? 0)]} /><meshStandardMaterial color="#f2efe6" roughness={0.95} transparent opacity={0.92} side={THREE.DoubleSide} /></mesh>}
        {/* agua en sección (cuerpo) + superficie */}
        {ev.level > 0.02 && <>
          <mesh geometry={waterBody}><meshPhysicalMaterial color={wCol} roughness={0.05} transmission={0.5} transparent opacity={0.32 + 0.4 * ev.cloud} side={THREE.DoubleSide} depthWrite={false} /></mesh>
          <Cap pts={waterPts} phi={PHI0} c={`#${wCol.getHexString()}`} o={0.2 + 0.3 * ev.cloud} />
          <Cap pts={waterPts} phi={PHI0 + PHIL} c={`#${wCol.getHexString()}`} o={0.2 + 0.3 * ev.cloud} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, wy, 0]}><circleGeometry args={[wr, 96, PHI0 - Math.PI / 2, PHIL]} /><meshStandardMaterial color={wCol} roughness={0.04} metalness={0.1} transparent opacity={0.5 + 0.3 * ev.cloud} depthWrite={false} side={THREE.DoubleSide} /></mesh>
          {/* ondas de la pastilla y remolino de la descarga */}
          {[0, 1, 2, 3].map((k) => { const ph = (t * (0.4 + flushA * 1.6) + k / 4) % 1; const a = Math.max(ev.bub, flushA); return a > 0.02 ? <mesh key={"rw" + k} rotation={[-Math.PI / 2, 0, flushA * t * 6]} position={[0, wy + 0.001, 0]}><ringGeometry args={[0.02 + ph * wr * 0.9, 0.024 + ph * wr * 0.9, 96, 1, PHI0 - Math.PI / 2, PHIL]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.22 * (1 - ph) * a} depthWrite={false} side={THREE.DoubleSide} /></mesh> : null; })}
        </>}
        <Flakes ev={ev} t={t} grime={grime} wy={wy} />
        {/* agujeritos debajo del borde (bonus) */}
        {Array.from({ length: 28 }, (_, i) => { const a = PHI0 + (i + 0.5) / 28 * PHIL, r = rIn(0.41) - 0.002; const dirty = ev.holes ?? 0.6; return <mesh key={"h" + i} position={[Math.sin(a) * r, 0.41, Math.cos(a) * r]} rotation={[0, a, 0]}><circleGeometry args={[0.006, 12]} /><meshStandardMaterial color={new THREE.Color("#3a352e").lerp(new THREE.Color("#1a1410"), dirty)} roughness={0.9} side={THREE.DoubleSide} /></mesh>; })}
        {/* la cortina de agua pareja desde los agujeros */}
        {(ev.curtain ?? 0) > 0.01 && <mesh position={[0, 0.355, 0]}><cylinderGeometry args={[rIn(0.405) - 0.004, rIn(0.3) - 0.004, 0.105, 96, 1, true, PHI0, PHIL]} /><meshPhysicalMaterial color="#cfe9f5" roughness={0.02} transmission={0.6} transparent opacity={0.28 * (ev.curtain ?? 0) * (0.85 + 0.15 * Math.sin(t * 18))} side={THREE.DoubleSide} depthWrite={false} /></mesh>}
      </group>
      {/* burbujas (ya llevan el óvalo) */}
      <Bubbles ev={ev} t={t} bub={bub} wy={wy} />
      {/* la pastilla: cae y se deshace en el fondo */}
      {ev.tab > 0.01 && <group position={[0.01, lerp(0.75, 0.185, ev.tabDrop) , 0.02]} rotation={[0, 0.5, (1 - ev.tabDrop) * 3]} scale={[ev.tab, ev.tab * 0.85, ev.tab]}>
        <mesh castShadow geometry={rbox(0.05, 0.022, 0.036, 0.004)}><meshStandardMaterial color="#f4f3ef" roughness={0.8} /></mesh>
        <mesh position={[0, -0.006, 0]} geometry={rbox(0.051, 0.009, 0.037, 0.003)}><meshStandardMaterial color="#2f74d0" roughness={0.6} /></mesh>
      </group>}
      {/* tapa y asiento levantados contra el tanque */}
      <group position={[0, 0.44, -0.3]} rotation={[-1.45, 0, 0]}>
        <mesh position={[0, 0, 0.28]} scale={[1, 1, 1.2]}><torusGeometry args={[0.2, 0.025, 12, 48]} /><meshPhysicalMaterial color="#f4f4f1" roughness={0.2} clearcoat={0.8} /></mesh>
        <mesh position={[0, -0.03, 0.28]} scale={[1, 0.12, 1.25]}><sphereGeometry args={[0.24, 32, 12]} /><meshPhysicalMaterial color="#f4f4f1" roughness={0.2} clearcoat={0.8} /></mesh>
      </group>
      {/* el tanque */}
      <Tank t={t} ev={ev} />
      {/* el cepillo: entra y da UNA vuelta por la línea */}
      {(ev.brush ?? 0) > 0.001 && <group position={[Math.sin(brushAng) * (rIn(YW) - 0.03), YW + 0.01, Math.cos(brushAng) * (rIn(YW) - 0.03) * ZS]} rotation={[0, brushAng, 0]}>
        <group rotation={[0.55, 0, 0]}>
          <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.07, 16]} /><meshStandardMaterial color="#f2f2f2" roughness={0.95} /></mesh>
          <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.009, 0.009, 0.5, 12]} /><meshStandardMaterial color="#e9e9e9" roughness={0.4} /></mesh>
        </group>
      </group>}
      {/* la tarjeta de plástico que raspa (paso 2) */}
      {(ev.card ?? 0) > 0.001 && <group position={[0.06, YW + 0.035, rIn(YW) * ZS - 0.03]} rotation={[0.2, -0.5 + Math.sin(t * 7) * 0.08 * (ev.card ?? 0), 0.9]}>
        <mesh castShadow geometry={rbox(0.085, 0.054, 0.0015, 0.004)}><meshStandardMaterial color="#d63a2f" roughness={0.35} /></mesh>
      </group>}
    </group>
  );
};

const Tank: React.FC<{ t: number; ev: Ev }> = ({ t, ev }) => {
  const up = ev.tank ?? 0, puck = ev.puck ?? 0;
  return (
    <group position={[0, 0, -0.42]}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow geometry={rbox(0.5, 0.42, 0.2, 0.03)}><meshPhysicalMaterial color="#f7f7f4" roughness={0.14} clearcoat={1} /></mesh>
      <group position={[0, 0.68 + up * 0.3, 0.02 - up * 0.12]} rotation={[-up * 1.15, 0, 0]}>
        <mesh castShadow geometry={rbox(0.53, 0.04, 0.23, 0.015)}><meshPhysicalMaterial color="#f7f7f4" roughness={0.14} clearcoat={1} /></mesh>
        <mesh position={[0.16, 0.026, 0.0]}><cylinderGeometry args={[0.018, 0.018, 0.012, 20]} /><meshStandardMaterial color="#c9ccd0" metalness={0.95} roughness={0.2} /></mesh>
      </group>
      {/* la pastilla de cloro azul: se ve con la tapa levantada y sale volando */}
      {up > 0.05 && puck > 0.01 && <mesh position={[0.06, 0.6 + (1 - puck) * 0.5, 0.0 + (1 - puck) * 0.3]} rotation={[0.3, t, 0]} scale={puck}><cylinderGeometry args={[0.035, 0.035, 0.022, 24]} /><meshStandardMaterial color="#2a7de0" roughness={0.4} emissive="#2a7de0" emissiveIntensity={0.2} /></mesh>}
      {up > 0.05 && <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.44, 0.15]} /><meshStandardMaterial color={puck > 0.3 ? "#5aa0e8" : "#bcd8e6"} transparent opacity={0.55} roughness={0.05} /></mesh>}
      {/* llave de paso en la pared (paso 6) */}
      <group position={[0.17, 0.22, -0.22]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.08, 12]} /><meshStandardMaterial color="#c9ccd0" metalness={0.95} roughness={0.2} /></mesh>
        <mesh position={[0, 0, 0.05]} rotation={[0, 0, (ev.level < 0.95 ? 1 : 0) * Math.PI / 2]}><boxGeometry args={[0.06, 0.012, 0.012]} /><meshStandardMaterial color="#c8402f" roughness={0.4} /></mesh>
      </group>
    </group>
  );
};

// RELOJ DE LA NOCHE en la pared
const NightClock: React.FC<{ hour: number; glow: number }> = ({ hour, glow }) => {
  const tex = useClockTex(hour, glow);
  const aH = -((hour % 12) / 12) * Math.PI * 2, aM = -((hour % 1)) * Math.PI * 2;
  return (
    <group position={PT.clock} scale={0.55}>
      <mesh castShadow><torusGeometry args={[0.62, 0.07, 24, 96]} /><meshStandardMaterial color="#d7dadf" metalness={0.95} roughness={0.2} /></mesh>
      <mesh position={[0, 0, -0.03]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.64, 0.64, 0.08, 96]} /><meshStandardMaterial color="#2a2c30" metalness={0.6} roughness={0.4} /></mesh>
      <mesh position={[0, 0, 0.012]}><circleGeometry args={[0.6, 96]} /><meshStandardMaterial map={tex} roughness={0.5} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.06 + glow * 0.25} /></mesh>
      <group position={[0, 0, 0.03]} rotation={[0, 0, aH]}><mesh position={[0, 0.16, 0]}><boxGeometry args={[0.035, 0.34, 0.01]} /><meshStandardMaterial color="#1d1f22" /></mesh></group>
      <group position={[0, 0, 0.035]} rotation={[0, 0, aM]}><mesh position={[0, 0.23, 0]}><boxGeometry args={[0.02, 0.48, 0.01]} /><meshBasicMaterial color="#3a6fd0" toneMapped={false} /></mesh></group>
      <mesh position={[0, 0, 0.04]}><cylinderGeometry args={[0.035, 0.035, 0.02, 20]} /><meshStandardMaterial color="#3a6fd0" /></mesh>
      <mesh position={[0, 0, 0.05]}><circleGeometry args={[0.6, 64]} /><meshStandardMaterial color="#ffffff" roughness={0.02} metalness={0.3} transparent opacity={0.05} depthWrite={false} /></mesh>
    </group>
  );
};

// la pileta con el jarro (agua caliente + pastilla) y la caja de pastillas
const Sink: React.FC<{ t: number; ev: Ev; dot: THREE.Texture; boxTex: THREE.Texture }> = ({ t, ev, dot, boxTex }) => {
  const jar = ev.jar ?? 0, pour = ev.pour ?? 0;
  // el jarro: de la pileta → sobre el borde de la taza, inclinándose
  const jp: V3 = [lerp(PT.jar[0], 0.12, ease(pour)), lerp(PT.jar[1], 0.56, ease(pour)) + Math.sin(Math.PI * cl(pour)) * 0.15, lerp(PT.jar[2], 0.05, ease(pour))];
  const tilt = cl((pour - 0.55) / 0.3) * 1.5;
  const fizz = useMemo(() => new THREE.BufferGeometry(), []);
  const n = 180, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const ph = (rnd(i, 1) + t * (0.5 + rnd(i, 2) * 0.4)) % 1; const a = rnd(i, 3) * 6.28, r = rnd(i, 4) * 0.045; p.set([Math.cos(a) * r, 0.01 + ph * 0.12, Math.sin(a) * r], i * 3); }
  fizz.setAttribute("position", new THREE.BufferAttribute(p, 3));
  return (
    <group>
      {/* mueble + mesada + bacha */}
      <Box p={[0.95, 0.38, -0.38]} s={[0.62, 0.76, 0.46]} c="#6f8f8a" r={0.7} />
      <Box p={[0.95, 0.785, -0.38]} s={[0.66, 0.05, 0.5]} c="#e4e0d6" r={0.3} />
      <mesh position={[0.95, 0.79, -0.4]} scale={[1, 0.35, 0.8]}><sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#f7f7f4" roughness={0.12} clearcoat={1} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0.95, 0.9, -0.6]} rotation={[0.25, 0, 0]}><torusGeometry args={[0.07, 0.012, 12, 32, Math.PI]} /><meshStandardMaterial color="#c9ccd0" metalness={0.95} roughness={0.2} /></mesh>
      {/* la caja de pastillas (sin marca) */}
      <mesh position={PT.box} rotation={[0, -0.35, 0]} castShadow><boxGeometry args={[0.2, 0.12, 0.1]} /><meshStandardMaterial map={boxTex} roughness={0.5} /></mesh>
      {/* el jarro de vidrio */}
      <group position={jp} rotation={[0, 0, tilt]}>
        <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.055, 0.05, 0.16, 32, 1, true]} /><meshPhysicalMaterial transmission={0.95} roughness={0.04} thickness={0.01} transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0.06, 0.09, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.035, 0.008, 8, 20, Math.PI]} /><meshPhysicalMaterial transmission={0.9} transparent opacity={0.5} /></mesh>
        <mesh position={[0, 0.05 * (1 - cl((pour - 0.7) / 0.3)) + 0.005, 0]}><cylinderGeometry args={[0.05, 0.048, 0.1 * (1 - cl((pour - 0.7) / 0.3)) + 0.002, 32]} /><meshStandardMaterial color={new THREE.Color("#cfe2ea").lerp(new THREE.Color("#e8e6df"), jar)} transparent opacity={0.75} roughness={0.1} /></mesh>
        {jar > 0.01 && <points geometry={fizz}><pointsMaterial map={dot} color="#ffffff" size={0.01} transparent opacity={0.8 * jar} depthWrite={false} sizeAttenuation /></points>}
      </group>
      {/* chorrito que baña la línea */}
      {pour > 0.75 && pour < 0.99 && <mesh position={[0.06, 0.45, 0.1]} rotation={[0.2, 0, 0.3]}><cylinderGeometry args={[0.006, 0.01, 0.2, 10]} /><meshPhysicalMaterial color="#e6e8e2" transmission={0.5} transparent opacity={0.6} /></mesh>}
    </group>
  );
};

// ---------------- LA ESCENA ----------------
export const BathWorld: React.FC<{ t: number; ev: Ev; cam: ReturnType<typeof makeCam> }> = ({ t, ev, cam }) => {
  const tx = useTextures(); const grime = useGrime(); const scale = useScale(); const dot = useDot(); const bub = useBubble();
  const boxTex = useMemo(() => mkTex(512, 320, (g) => { const gr = g.createLinearGradient(0, 0, 0, 320); gr.addColorStop(0, "#f4f4f2"); gr.addColorStop(1, "#dcdcd8"); g.fillStyle = gr; g.fillRect(0, 0, 512, 320); g.fillStyle = "#2f74d0"; g.fillRect(0, 230, 512, 90); for (let i = 0; i < 3; i++) { g.fillStyle = "#fff"; g.fillRect(150 + i * 80, 120, 60, 40); g.fillStyle = "#2f74d0"; g.fillRect(150 + i * 80, 143, 60, 17); } }), []);
  const tileTex = useMemo(() => { const c = tx.tile.clone(); c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(7, 5); c.needsUpdate = true; return c; }, [tx]);
  const wallTile = useMemo(() => mkTex(256, 256, (g) => { g.fillStyle = "#ece8de"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(120,115,100,.5)"; g.lineWidth = 3; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * 64, 0); g.lineTo(k * 64, 256); g.stroke(); g.beginPath(); g.moveTo(0, k * 64); g.lineTo(256, k * 64); g.stroke(); } }), []);
  const wallTex = useMemo(() => { const c = wallTile.clone(); c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(9, 7); c.needsUpdate = true; return c; }, [wallTile]);
  const k = cam.camAt(t);
  const day = ev.day;
  const sunCol = new THREE.Color("#8fa6d6").lerp(new THREE.Color("#fff1dc"), day);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <CamRig k={k} />
      <Post bloom={0.42} threshold={0.93} exposure={0.9 + 0.12 * day} env={0.2 + 0.14 * day} />
      <color attach="background" args={[new THREE.Color("#0c1118").lerp(new THREE.Color("#1d232b"), day).getHex()]} />
      <hemisphereLight args={[sunCol.getHex(), 0x24201c, 0.4 + 0.35 * day]} />
      <directionalLight position={[-5, 5, 3]} intensity={0.5 + 1.5 * day} color={sunCol} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-3} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <spotLight position={[0.3, 2.4, 1.3]} angle={0.5} penumbra={0.85} intensity={2.4} distance={6} color={new THREE.Color("#ffe2b8").lerp(new THREE.Color("#fff6ea"), day)} castShadow target-position={[0, 0.3, 0]} shadow-bias={-0.0004} />
      {/* bombita del techo (de noche es la única luz cálida) */}
      <pointLight position={[0, 2.2, 0.2]} intensity={(1 - day) * 1.4} distance={4} color="#ffcf8a" />
      {/* ===== maqueta en corte ===== */}
      <Slab p={[0, -0.1, 0]} s={[3.0, 0.2, 2.2]} c="#c9c3b6" cut="#d9cbb3" map={tileTex} />
      <Slab p={[0, 1.2, -0.95]} s={[3.0, 2.6, 0.2]} c="#ece8de" map={wallTex} />
      <Slab p={[-1.5, 1.2, 0.05]} s={[0.2, 2.6, 2.2]} c="#e2ddd2" map={wallTex} />
      {/* ventanita esmerilada (noche azul → día) */}
      <group position={[-1.39, 1.35, -0.1]} rotation={[0, Math.PI / 2, 0]}>
        <mesh><planeGeometry args={[0.6, 0.55]} /><meshBasicMaterial color={new THREE.Color("#33507e").lerp(new THREE.Color("#fff3d6"), day)} toneMapped={false} /></mesh>
        {[[0, 0.29, 0.66, 0.05], [0, -0.29, 0.66, 0.05], [-0.32, 0, 0.05, 0.62], [0.32, 0, 0.05, 0.62]].map(([x, y, a, b], i) => <mesh key={i} position={[x, y, 0.02]}><boxGeometry args={[a, b, 0.05]} /><meshStandardMaterial color="#f1ece2" /></mesh>)}
      </group>
      {/* alfombra azul gastada */}
      <mesh position={[0, 0.004, 0.42]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.62, 0.42]} /><meshStandardMaterial color="#5a7aa6" roughness={1} /></mesh>
      {/* portacepillo */}
      <mesh position={[-0.42, 0.13, -0.3]} castShadow><cylinderGeometry args={[0.06, 0.055, 0.26, 24]} /><meshStandardMaterial color="#f0f0ee" roughness={0.5} /></mesh>
      <Toilet t={t} ev={ev} grime={grime} scale={scale} dot={dot} bub={bub} />
      <Sink t={t} ev={ev} dot={dot} boxTex={boxTex} />
      <NightClock hour={ev.hour} glow={ev.glow} />
      {/* repisa con frasco marrón y rollo */}
      <Box p={[-0.95, 1.05, -0.78]} s={[0.6, 0.03, 0.2]} c="#9a7a55" r={0.7} />
      <mesh position={[-1.1, 1.13, -0.78]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.13, 20]} /><meshStandardMaterial color="#5b3a1f" roughness={0.3} /></mesh>
      <mesh position={[-0.85, 1.12, -0.78]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.055, 0.055, 0.1, 24]} /><meshStandardMaterial color="#f6f4ee" roughness={0.9} /></mesh>
    </ThreeCanvas>
  );
};
const CamRig: React.FC<{ k: { p: THREE.Vector3; l: THREE.Vector3; fov: number } }> = ({ k }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.01; c.far = 200; c.updateProjectionMatrix();
  return null;
};
