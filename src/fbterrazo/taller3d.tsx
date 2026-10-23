// fbterrazo · EL MUNDO: el taller del fondo de Claudio (piso de lajas, muro de bloque gris, banco con la radio, el mate,
// una botella verde contra el sol y LA COLECCIÓN; el cajón de botellas vacías, limonero) y en el medio, sobre dos caballetes,
// LA BALDOSA gigante de terrazo de vidrio: pulida (piedras de botella en cemento blanco) o con la piel gris del desmolde,
// que la ola de pulido barre. Se vuelve "de vidrio" para mostrar las piedras flotando adentro. Al costado, el quincho con su
// alisado gris que envejece en dos años (aceite, sillas, polvillo, fisuras como un mapa).
// UNA escena y UNA cámara; eventos clavados a la voz (EV, segundos globales). Render SÓLO en el farm (acá sólo stills).
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { P } from "./lib";
import { KEYS as KEYS0, EV } from "./cam";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V = [number, number, number];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

// ---------------- puntos del mundo ----------------
export const TS = 0.8, TH = 0.06;                         // LA BALDOSA (lado, espesor)
export const TILE: V = [0, 0.66, 0.3];                     // centro de la cara de arriba
export const BENCH: V = [1.9, 0, -2.45];
export const BOOK: V = [1.5, 0.935, -2.42];
export const QUINCHO: V = [3.5, 0, 0.8];
export const CRATE: V = [-1.45, 0, -1.4];
export const BOTTLE0: V = [-1.38, 0, -1.08];               // la botella que estalla (en el piso, delante del cajón)
const GLASS = ["#1f6b2a", "#7a3c0e", "#d6eeee"];
export const PT = {
  tile: TILE,
  edge: (u: number): V => [-TS / 2 + TS * u, TILE[1], TILE[2]],        // el frente de la ola de pulido
  crate: [CRATE[0], 0.3, CRATE[2]] as V, bottle: [BOTTLE0[0], 0.15, BOTTLE0[2]] as V,
  oil: [QUINCHO[0] - 0.25, 0.05, QUINCHO[2] + 0.1] as V, crack: [QUINCHO[0] + 0.3, 0.05, QUINCHO[2] - 0.1] as V,
  radio: [2.7, 1.05, -2.72] as V, mate: [1.08, 1.0, -2.3] as V, green: [2.3, 1.08, -2.5] as V,
  lemon: [-3.6, 1.8, -2.65] as V,
};

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V; l: V; fov?: number; arc?: number };
export const KEYS: Key[] = [...(KEYS0 as Key[])].sort((a, b) => a.t - b.t);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  const d = Math.min(1, p.distanceTo(l) / 2);
  p.x += Math.sin(t * 0.7) * 0.004 * d; p.y += Math.sin(t * 0.53 + 1) * 0.003 * d;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.002, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.002; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- texturas de archivo (el render espera a que carguen) ----------------
const useJpg = (spec: Record<string, [number, number]>, flipIds: string[] = []) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader(); const r: Record<string, THREE.Texture> = {};
    const h = delayRender("texturas jpg", { timeoutInMilliseconds: 170000 }); let n = Object.keys(spec).length;
    for (const [id, rep] of Object.entries(spec)) {
      const flip = flipIds.includes(id) ? new THREE.Texture() : null;
      if (flip) { flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16; r[id + "_r"] = flip; }
      const tx = L.load(staticFile(P + id + ".jpg"), (tt) => { if (flip) { flip.image = tt.image; flip.needsUpdate = true; } if (--n === 0) { bump((x) => x + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(rep[0], rep[1]); r[id] = tx;
    }
    return r;
  }, []);
};


// sube TODAS las texturas a la GPU antes de soltar el cuadro: sin esto, la 1ª vez que algo entra en cuadro (la baldosa,
// las páginas) puede salir NEGRO en un cuadro suelto (pasó en los stills)
const Warm: React.FC<{ tex: THREE.Texture[] }> = ({ tex }) => {
  const { gl, advance } = useThree();
  const h = useRef<number | null>(null);
  if (h.current === null) h.current = delayRender("texturas en GPU", { timeoutInMilliseconds: 170000 });
  // con el runner cargado (swangle, 4 pestañas) una textura puede no llegar nunca: a los 80 s se sube lo que haya y se sigue
  const [late, setLate] = useState(false);
  useEffect(() => { const k = setTimeout(() => setLate(true), 80000); return () => clearTimeout(k); }, []);
  const ready = late || tex.every((x) => x.image);
  // cuando llegan (aunque sea tarde, con la máquina cargada): subirlas y VOLVER A DIBUJAR la escena; el lienzo
  // sólo se dibuja al cambiar de cuadro, así que sin este advance el cuadro queda con las texturas en negro
  useLayoutEffect(() => {
    if (!ready) return;
    tex.forEach((x) => gl.initTexture(x));
    advance(performance.now());
    const id = h.current!; h.current = -1;
    if (id >= 0) requestAnimationFrame(() => requestAnimationFrame(() => { advance(performance.now()); continueRender(id); }));
  }, [ready]);
  return null;
};

// ---------------- texturas procedurales ----------------
const mkCv = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!); return cv; };
const toTex = (cv: HTMLCanvasElement, rep: [number, number] = [1, 1], srgb = true) => {
  const t = new THREE.CanvasTexture(cv); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 16; return t;
};
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => toTex(mkCv(w, h, draw), rep);
const cementDraw = (g: CanvasRenderingContext2D, w: number, h: number, tone = 152) => {
  g.fillStyle = `rgb(${tone},${tone - 2},${tone - 6})`; g.fillRect(0, 0, w, h);
  for (let i = 0; i < (w * h) / 90; i++) { const v = rnd(i, 7); g.fillStyle = v < 0.5 ? `rgba(90,88,84,${0.15 + 0.25 * rnd(i, 8)})` : `rgba(210,206,198,${0.15 + 0.25 * rnd(i, 8)})`; g.beginPath(); g.arc(rnd(i, 9) * w, rnd(i, 10) * h, 0.5 + rnd(i, 11) * 1.6, 0, 6.3); g.fill(); }
};

const useTallerTex = () => useMemo(() => ({
  floor: mk(512, 512, (g) => {
    g.fillStyle = "#77736b"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 2; r++) for (let q = 0; q < 2; q++) { const c = mkCv(250, 250, (gg) => cementDraw(gg, 250, 250, 150 + rnd(r * 2 + q, 1) * 22)); g.drawImage(c, q * 256 + 3, r * 256 + 3); }
    for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(60,50,40,${0.06 + rnd(i, 4) * 0.08})`; g.beginPath(); g.arc(rnd(i, 1) * 512, rnd(i, 2) * 512, 10 + rnd(i, 3) * 40, 0, 6.3); g.fill(); }
  }, [10, 10]),
  // alisado nuevo del quincho (gris parejo, llaneado)
  alisado: mk(1024, 768, (g) => { cementDraw(g, 1024, 768, 158); for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(255,255,255,${0.03 + rnd(i, 2) * 0.04})`; g.lineWidth = 18 + rnd(i, 3) * 30; g.beginPath(); const x = rnd(i, 4) * 1024, y = rnd(i, 5) * 768; g.arc(x, y, 60 + rnd(i, 6) * 120, rnd(i, 7) * 6, rnd(i, 7) * 6 + 1.2); g.stroke(); } }),
  // los dos años, capa por capa (transparentes, sobre el alisado)
  oil: mk(1024, 768, (g) => {
    const blot = (x: number, y: number, r: number, a: number) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(38,30,20,${a})`); gr.addColorStop(0.7, `rgba(45,36,24,${a * 0.75})`); gr.addColorStop(1, "rgba(45,36,24,0)"); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, r * 1.2, r, 0.4, 0, 6.3); g.fill(); };
    blot(330, 420, 120, 0.7); blot(410, 470, 70, 0.6); blot(270, 360, 50, 0.55); blot(760, 250, 60, 0.45); for (let i = 0; i < 40; i++) blot(250 + rnd(i, 1) * 260, 330 + rnd(i, 2) * 220, 6 + rnd(i, 3) * 16, 0.5);
  }),
  scuff: mk(1024, 768, (g) => {
    for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(20,18,16,${0.25 + rnd(i, 1) * 0.35})`; g.lineWidth = 2 + rnd(i, 2) * 4; const x = 500 + (rnd(i, 3) - 0.5) * 700, y = 380 + (rnd(i, 4) - 0.5) * 500; g.beginPath(); g.arc(x, y, 40 + rnd(i, 5) * 80, rnd(i, 6) * 6, rnd(i, 6) * 6 + 0.3 + rnd(i, 7) * 0.5); g.stroke(); }
  }),
  dust: mk(1024, 768, (g) => {
    for (let i = 0; i < 14; i++) { const x = rnd(i, 2) < 0.5 ? rnd(i, 3) * 260 : 764 + rnd(i, 3) * 260, y = rnd(i, 4) * 768, r = 60 + rnd(i, 6) * 120; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(240,236,224,.55)'); gr.addColorStop(1, 'rgba(240,236,224,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    for (let i = 0; i < 9000; i++) { const x = rnd(i, 7) * 1024, y = rnd(i, 8) * 768; g.fillStyle = `rgba(245,242,232,${0.05 + rnd(i, 5) * 0.12})`; g.fillRect(x, y, 1.5, 1.5); }
  }),
  crack: mk(1024, 768, (g) => {
    const walk = (x: number, y: number, a: number, n: number, k: number, wd: number) => {
      g.strokeStyle = "rgba(25,22,18,.85)"; g.lineWidth = wd; g.beginPath(); g.moveTo(x, y);
      for (let s = 0; s < n; s++) { a += (rnd(k * 97 + s, 1) - 0.5) * 0.9; x += Math.cos(a) * 9; y += Math.sin(a) * 9; g.lineTo(x, y); if (rnd(k * 97 + s, 2) < 0.06 && wd > 0.9) { g.stroke(); walk(x, y, a + (rnd(s, k) < 0.5 ? 1.1 : -1.1), n * 0.5, k * 7 + s, wd * 0.7); g.beginPath(); g.moveTo(x, y); } }
      g.stroke();
    };
    for (let k = 0; k < 7; k++) walk(rnd(k, 1) * 1024, rnd(k, 2) * 768, rnd(k, 3) * 6.3, 70, k + 1, 2.4);
  }),
  bag: mk(512, 256, (g) => {
    g.fillStyle = "#c9b48c"; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(120,100,70,${0.05 + rnd(i, 1) * 0.08})`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 256, 2 + rnd(i, 4) * 30, 1.5); }
    g.fillStyle = "#e9e6dc"; g.fillRect(40, 60, 432, 70); g.fillStyle = "#2a4a7a"; g.font = "900 44px sans-serif"; g.textAlign = "center"; g.fillText("CEMENTO BLANCO", 256, 112);
    g.fillStyle = "#3a3a3a"; g.font = "800 40px sans-serif"; g.fillText("25 kg", 256, 190);
  }),
  sky: mk(1024, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#5a95cf"); gr.addColorStop(0.45, "#a9cbe8"); gr.addColorStop(0.52, "#eef0ea"); gr.addColorStop(1, "#c9c2b0"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 40; i++) { const x = rnd(i, 1) * 1024, y = 60 + rnd(i, 2) * 160, r = 30 + rnd(i, 3) * 70; const cg = g.createRadialGradient(x, y, 0, x, y, r * 1.8); cg.addColorStop(0, "rgba(255,255,255,.5)"); cg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = cg; g.beginPath(); g.ellipse(x, y, r * 1.8, r * 0.6, 0, 0, 6.3); g.fill(); }
  }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; map?: Tx; rad?: number; rot?: V; o?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, map, rad = 0.02, rot, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={o < 1} opacity={o} /></mesh>
);
const Tube: React.FC<{ pts: V[]; r: number; col: string; seg?: number; m?: number; rough?: number }> = ({ pts, r, col, seg = 40, m = 0, rough = 0.7 }) => {
  const geo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(v3)), seg, r, 8, false), [pts.map((q) => q.join()).join("|"), r, seg]);
  return <mesh geometry={geo} castShadow><meshStandardMaterial color={col} roughness={rough} metalness={m} /></mesh>;
};

// LA COLECCIÓN: libro de tapa dura, tapa con bisagra, hoja que pasa con curva
const PAPER = "#b3ada3";
const Sheet: React.FC<{ ang: number; w: number; d: number; front?: Tx; back?: Tx }> = ({ ang, w, d, front, back }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(w, d, 28, 1), [w, d]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const N = 28, curl = Math.sin(ang) * 1.6;
  let x = 0, yy = 0; const xs: number[] = [], ys: number[] = [];
  for (let k = 0; k <= N; k++) { xs.push(x); ys.push(yy); const s = k / N; const phi = ang + curl * s * (1 - s * 0.4); x += Math.cos(phi) * w / N; yy += Math.sin(phi) * w / N; }
  for (let i = 0; i < pos.count; i++) { const k = i % (N + 1), row = Math.floor(i / (N + 1)); pos.setXYZ(i, xs[k], ys[k], row === 0 ? -d / 2 : d / 2); }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return (
    <group position={[0, 0.001, 0]}>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.FrontSide} color={PAPER} roughness={0.92} map={back} envMapIntensity={0.2} /></mesh>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.BackSide} color={PAPER} roughness={0.92} map={front} envMapIntensity={0.2} /></mesh>
    </group>
  );
};
export const BW = 0.3, BD = 0.42;
export const pageAt = (u: number, v: number): V => [BOOK[0] + 0.004 + (u - 0.5) * (BW - 0.01), BOOK[1] + 0.046, BOOK[2] + (v - 0.5) * (BD - 0.012)];
const Book: React.FC<{ p: V; open: number; cover: THREE.Texture; inside: THREE.Texture; right: THREE.Texture; spine: string; flips?: { k: number; tex: [THREE.Texture, THREE.Texture] }[] }> = ({ p, open, cover, inside, right, spine, flips = [] }) => {
  const w = BW, d = BD, th = 0.034;
  const ang = Math.PI * ease(open);
  return (
    <group position={p}>
      <Box p={[0, 0.003, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.55} rad={0.003} />
      <mesh position={[0.004, 0.006 + th / 2, 0]} castShadow receiveShadow><boxGeometry args={[w - 0.004, th, d - 0.006]} /><meshStandardMaterial color="#c4bcab" roughness={0.95} /></mesh>
      <mesh position={[0.004, 0.0065 + th, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w - 0.01, d - 0.012]} /><meshStandardMaterial map={right} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
      <Box p={[-w / 2 - 0.004, 0.006 + th / 2, 0]} s={[0.012, th + 0.014, d + 0.012]} c={spine} r={0.5} rad={0.005} />
      {flips.filter((f) => f.k > 0.001 && f.k < 0.999).map((f, i) => <group key={i} position={[-w / 2 + 0.006, 0.007 + th + i * 0.0008, 0]}><Sheet ang={Math.PI * ease(f.k)} w={w - 0.012} d={d - 0.014} front={f.tex[0]} back={f.tex[1]} /></group>)}
      <group position={[-w / 2, 0.006 + th + 0.004, 0]} rotation={[0, 0, ang]}>
        <group position={[w / 2 + 0.006, 0, 0]}>
          <Box p={[0, 0, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.45} rad={0.003} />
          <mesh position={[0, 0.0032, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w + 0.008, d + 0.008]} /><meshStandardMaterial map={cover} roughness={0.38} metalness={0.05} /></mesh>
          <mesh position={[0, -0.0032, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[w - 0.006, d - 0.01]} /><meshStandardMaterial map={inside} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
        </group>
      </group>
    </group>
  );
};

// LA BALDOSA. skin = fracción de la cara que todavía tiene la piel gris (se barre de izquierda a derecha: la ola de pulido);
// ghost = el cemento se vuelve vidrio y las piedras de botella flotan adentro; wet = recién pulida (brilla)
const GEMS = 240;
const Tile: React.FC<{ terr: THREE.Texture; gris: THREE.Texture; skin: number; ghost: number; wet: number; t: number }> = ({ terr, gris, skin, ghost, wet, t }) => {
  const [x0, y0, z0] = TILE;
  const gems = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 0);
    const m = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.92, emissiveIntensity: 0.25 }), GEMS);
    const c = new THREE.Color(); for (let i = 0; i < GEMS; i++) m.setColorAt(i, c.set(GLASS[Math.floor(rnd(i, 9) * 3)]));
    return m;
  }, []);
  const o = new THREE.Object3D();
  for (let i = 0; i < GEMS; i++) {
    const s = 0.005 + rnd(i, 3) ** 2 * 0.016, lift = ghost * (0.01 + rnd(i, 4) * 0.07);
    o.position.set(x0 + (rnd(i, 1) - 0.5) * (TS - 0.04), y0 - TH * (0.15 + rnd(i, 5) * 0.7) + lift, z0 + (rnd(i, 2) - 0.5) * (TS - 0.04));
    o.rotation.set(rnd(i, 6) * 6 + t * 0.6 * ghost, rnd(i, 7) * 6 + t * 0.4 * ghost, rnd(i, 8) * 6);
    o.scale.set(s, s * (0.4 + rnd(i, 10) * 0.4), s * (0.7 + rnd(i, 11) * 0.3)); o.updateMatrix(); gems.setMatrixAt(i, o.matrix);
  }
  gems.instanceMatrix.needsUpdate = true;
  const op = 1 - 0.66 * ghost, ks = cl(skin);
  const gloss = 0.35 - 0.25 * wet;
  return (
    <group>
      {/* cuerpo: cemento blanco con piedras (los cantos también muestran el terrazo) */}
      <mesh position={[x0, y0 - TH / 2, z0]} castShadow receiveShadow geometry={rbox(TS, TH, TS, 0.006)}>
        <meshStandardMaterial map={terr} color="#f2efe8" roughness={0.6} transparent={ghost > 0.01} opacity={op} depthWrite={ghost < 0.3} />
      </mesh>
      {/* cara pulida */}
      <mesh position={[x0, y0 + 0.0008, z0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[TS - 0.006, TS - 0.006]} />
        <meshStandardMaterial map={terr} roughness={gloss} metalness={0.05} envMapIntensity={1.1} transparent={ghost > 0.01} opacity={op} />
      </mesh>
      {/* la piel gris del desmolde: tapa desde el frente de la ola hasta el borde derecho */}
      {ks > 0.002 && ghost < 0.99 && <mesh position={[x0 + TS / 2 - (TS * ks) / 2, y0 + 0.0016, z0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[(TS - 0.006) * ks, TS - 0.006]} />
        <meshStandardMaterial map={gris} roughness={0.95} transparent={ghost > 0.01} opacity={op} />
      </mesh>}
      {/* el frente de la ola: una franja de agua que brilla */}
      {ks > 0.01 && ks < 0.99 && <mesh position={[x0 + TS / 2 - TS * ks, y0 + 0.0024, z0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.03, TS - 0.006]} />
        <meshStandardMaterial color="#ffffff" emissive="#fff6e0" emissiveIntensity={1.6} transparent opacity={0.75} />
      </mesh>}
      {ghost > 0.01 && <primitive object={gems} />}
    </group>
  );
};

// caballete de madera
const Horse: React.FC<{ x: number; map: THREE.Texture }> = ({ x, map }) => (
  <group position={[x, 0.005, TILE[2]]}>
    <Box p={[0, 0.57, 0]} s={[0.09, 0.05, 0.7]} c="#b8a48c" r={0.85} map={map} rad={0.004} />
    {[-1, 1].map((sz) => [-1, 1].map((sx) => <Box key={sz + "" + sx} p={[sx * 0.1, 0.28, sz * 0.25]} s={[0.045, 0.6, 0.035]} c="#a8937a" map={map} rad={0.004} rot={[0, 0, sx * 0.3]} />))}
  </group>
);

// botella (torno): verde, ámbar o transparente
const bottleGeo = (() => {
  const pr: [number, number][] = [[0, 0], [0.034, 0], [0.037, 0.006], [0.037, 0.19], [0.032, 0.215], [0.016, 0.245], [0.013, 0.285], [0.015, 0.29], [0.015, 0.3], [0, 0.3]];
  return new THREE.LatheGeometry(pr.map(([r, y]) => new THREE.Vector2(r, y)), 24);
})();
const Bottle: React.FC<{ p: V; col: string; rot?: V; s?: number }> = ({ p, col, rot, s = 1 }) => (
  <mesh position={p} rotation={rot} scale={s} geometry={bottleGeo} castShadow>
    <meshPhysicalMaterial color={col} roughness={0.04} metalness={0} transparent opacity={col === GLASS[2] ? 0.38 : 0.62} clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1.6} side={THREE.DoubleSide} depthWrite={false} />
  </mesh>
);

// el cajón de botellas vacías + la botella que estalla (t0 = el golpe)
const SH = 80;
const Crate: React.FC<{ map: THREE.Texture; t: number; t0: number }> = ({ map, t, t0 }) => {
  const [cx, , cz] = CRATE; const w = 0.5, d = 0.36, h = 0.26;
  const shards = useMemo(() => {
    const m = new THREE.InstancedMesh(new THREE.TetrahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.85 }), SH);
    const c = new THREE.Color(); for (let i = 0; i < SH; i++) m.setColorAt(i, c.set(i % 5 === 0 ? "#cfe8e8" : "#2f8a3a")); m.castShadow = true; return m;
  }, []);
  const dt = t - t0, o = new THREE.Object3D();
  for (let i = 0; i < SH; i++) {
    const a = rnd(i, 1) * 6.3, sp = 0.4 + rnd(i, 2) * 1.3, vy = 0.6 + rnd(i, 3) * 1.8, k = Math.max(0, dt);
    const tl = Math.min(k, (vy + Math.sqrt(vy * vy + 2 * 9.8 * 0.15)) / 9.8);   // hasta que toca el piso
    const slide = Math.max(0, k - tl) * 0.3 * Math.exp(-(k - tl) * 3);
    const y = Math.max(0.004, BOTTLE0[1] + 0.15 * (1 - rnd(i, 4)) + vy * tl - 4.9 * tl * tl);
    o.position.set(BOTTLE0[0] + Math.cos(a) * (sp * tl * 0.45 + slide), y, BOTTLE0[2] + Math.sin(a) * (sp * tl * 0.45 + slide));
    o.rotation.set(rnd(i, 5) * 6 + tl * 9, rnd(i, 6) * 6 + tl * 7, 0);
    const s = 0.006 + rnd(i, 7) * 0.016; o.scale.set(s, s * 0.35, s * 1.3); o.updateMatrix(); shards.setMatrixAt(i, o.matrix);
  }
  shards.instanceMatrix.needsUpdate = true;
  return (
    <group>
      <group position={[cx, 0, cz]}>
        <Box p={[0, 0.012, 0]} s={[w, 0.024, d]} c="#a8937a" map={map} rad={0.004} />
        {[-1, 1].map((sx) => <Box key={"x" + sx} p={[sx * (w / 2 - 0.009), h / 2, 0]} s={[0.018, h, d]} c="#a8937a" map={map} rad={0.004} />)}
        {[-1, 1].map((sz) => <Box key={"z" + sz} p={[0, h * 0.62, sz * (d / 2 - 0.009)]} s={[w, h * 0.5, 0.018]} c="#b8a48c" map={map} rad={0.004} />)}
        {Array.from({ length: 12 }, (_, i) => { const q = i % 4, r = Math.floor(i / 4); return <Bottle key={i} p={[(q - 1.5) * 0.105, 0.024, (r - 1) * 0.105]} col={GLASS[(i * 5) % 3]} rot={[0, rnd(i, 3) * 6, (rnd(i, 4) - 0.5) * 0.06]} />; })}
      </group>
      {dt < 0 ? <Bottle p={BOTTLE0} col={GLASS[0]} /> : <>
        <Bottle p={[BOTTLE0[0], 0, BOTTLE0[2]]} col={GLASS[0]} s={0.32} />
        <primitive object={shards} />
        {dt < 0.25 && <mesh position={[BOTTLE0[0], 0.15, BOTTLE0[2]]}><sphereGeometry args={[0.05 + dt * 0.6, 16, 12]} /><meshBasicMaterial color="#e9fff0" transparent opacity={0.7 * (1 - dt / 0.25)} /></mesh>}
      </>}
    </group>
  );
};

// el quincho: losa de alisado gris + parrilla de ladrillo + silla de plástico; age = capas de los dos años
const Quincho: React.FC<{ tx: ReturnType<typeof useTallerTex>; real: THREE.Texture; age: { oil: number; scuff: number; dust: number; crack: number; real: number } }> = ({ tx, real, age }) => {
  const [qx, , qz] = QUINCHO; const L = 2.4, D = 1.8;
  const layer = (map: THREE.Texture, o: number, k: number) => o > 0.005 && <mesh key={k} position={[qx, 0.04 + 0.0006 * (k + 1), qz]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[L - 0.01, D - 0.01]} /><meshStandardMaterial map={map} transparent opacity={o} roughness={0.9} depthWrite={false} /></mesh>;
  return (
    <group>
      <mesh position={[qx, 0.02, qz]} castShadow receiveShadow geometry={rbox(L, 0.04, D, 0.006)}><meshStandardMaterial map={tx.alisado} roughness={0.8} /></mesh>
      {layer(real, age.real, 0)}{layer(tx.oil, age.oil, 1)}{layer(tx.scuff, age.scuff, 2)}{layer(tx.dust, age.dust, 3)}{layer(tx.crack, age.crack, 4)}
      {/* parrilla de ladrillo al fondo */}
      <Box p={[qx + 0.6, 0.5, qz - D / 2 - 0.25]} s={[1.1, 1.0, 0.5]} c="#9a4a32" r={0.9} rad={0.01} />
      <Box p={[qx + 0.6, 1.02, qz - D / 2 - 0.25]} s={[0.9, 0.04, 0.4]} c="#2a2a2a" m={0.6} r={0.5} rad={0.004} />
      {/* silla de plástico blanca */}
      <group position={[qx - 0.5, 0.04, qz + 0.15]} rotation={[0, 0.5, 0]}>
        <Box p={[0, 0.42, 0]} s={[0.44, 0.03, 0.42]} c="#efeee8" r={0.5} rad={0.01} />
        <Box p={[0, 0.66, -0.2]} s={[0.44, 0.46, 0.03]} c="#efeee8" r={0.5} rad={0.01} rot={[-0.15, 0, 0]} />
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <Box key={i} p={[a * 0.19, 0.2, b * 0.18]} s={[0.035, 0.42, 0.035]} c="#e6e4dc" r={0.5} rad={0.008} />)}
      </group>
      {/* la pileta al costado */}
      <mesh position={[qx + L / 2 + 1.05, 0.02, qz]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.8, 2.6]} /><meshStandardMaterial color="#3aa6c8" roughness={0.08} metalness={0.3} /></mesh>
      <Box p={[qx + L / 2 + 0.1, 0.03, qz]} s={[0.1, 0.06, 2.6]} c="#d8d2c4" />
    </group>
  );
};

// bolsa de cemento: almohadón de papel
const Bag: React.FC<{ p: V; rot?: V; tex: THREE.Texture }> = ({ p, rot, tex }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(0.62, 0.15, 0.42, 0.06)}><meshStandardMaterial map={tex} roughness={0.95} /></mesh>
);

// limonero: tronco + copa de hojas instanciadas + limones
const Lemon: React.FC<{ p: V }> = ({ p }) => {
  const items = useMemo(() => Array.from({ length: 700 }, (_, i) => { const a = rnd(i, 1) * 6.3, b = rnd(i, 2) * 3.1, r = 0.55 + rnd(i, 3) * 0.35; return { p: [Math.cos(a) * Math.sin(b) * r, 1.9 + Math.cos(b) * r * 0.75, Math.sin(a) * Math.sin(b) * r] as V, r: [rnd(i, 4) * 6, rnd(i, 5) * 6, rnd(i, 6) * 6] as V, c: rnd(i, 7) > 0.3 ? "#2f5a24" : "#3f7a2e" }; }), []);
  const mesh = useMemo(() => {
    const m = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 6, 4), new THREE.MeshStandardMaterial({ roughness: 0.6 }), items.length); const o = new THREE.Object3D(); const c = new THREE.Color();
    items.forEach((it, i) => { o.position.set(...it.p); o.rotation.set(...it.r); o.scale.set(0.06, 0.008, 0.03); o.updateMatrix(); m.setMatrixAt(i, o.matrix); m.setColorAt(i, c.set(it.c)); });
    m.castShadow = true; return m;
  }, [items]);
  return (
    <group position={p}>
      <Tube pts={[[0, 0, 0], [0.04, 0.8, 0.02], [-0.02, 1.5, 0], [0.02, 1.9, 0]]} r={0.06} col="#5a4632" seg={12} />
      <primitive object={mesh} />
      {Array.from({ length: 14 }, (_, i) => { const a = rnd(i, 8) * 6.3, r = 0.6 + rnd(i, 9) * 0.2; return <mesh key={i} position={[Math.cos(a) * r, 1.75 + rnd(i, 10) * 0.5, Math.sin(a) * r]} scale={[0.045, 0.035, 0.035]} castShadow><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#f2d23a" roughness={0.45} /></mesh>; })}
    </group>
  );
};

const SkyDome: React.FC<{ tex: THREE.Texture }> = ({ tex }) => <mesh><sphereGeometry args={[150, 48, 24]} /><meshBasicMaterial map={tex} side={THREE.BackSide} fog={false} toneMapped={false} /></mesh>;

export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTallerTex();
  const ft = useJpg({ x_tabla: [1, 1], x_pino: [1, 1], x_muro: [2.4, 1], x_terrazo: [1, 1], x_gris: [1, 1], x_alisado: [1, 1], p001: [1, 1], p002: [1, 1], p054: [1, 1], p055: [1, 1], p056: [1, 1] }, ["p002"]);
  // la baldosa: pulida al principio; mientras la cámara está en el quincho le vuelve la piel gris; la ola la pule en "hoy te muestro"
  const skin = t < EV.quinchoIn + 0.5 ? 0 : 1 - win(t, EV.polish, EV.polish + 5.5);
  const ghost = win(t, EV.piedras - 0.8, EV.piedras + 0.3) * (1 - win(t, EV.ghostOff, EV.ghostOff + 0.7));
  const wet = t < EV.quinchoIn ? 0.6 : win(t, EV.polish, EV.polish + 1) * 0.9;
  // el quincho: dos años, capa por capa a la voz
  const age = { oil: win(t, EV.aceite, EV.aceite + 0.8), scuff: win(t, EV.sillas, EV.sillas + 0.8), dust: win(t, EV.polvillo, EV.polvillo + 0.8), crack: win(t, EV.fisuras, EV.fisuras + 1.6), real: 0.55 * win(t, EV.anos, EV.anos + 1.2) };
  const open = win(t, EV.c1open, EV.c1open + 1.1);
  const flip = cl((t - EV.c1page) / 0.6);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Warm tex={[...Object.values(ft), ...Object.values(tx)]} />
      <Post bloom={0.3} threshold={0.92} exposure={0.95} env={0.35} />
      <color attach="background" args={["#a9cbe8"]} />
      <fogExp2 attach="fog" args={[0xb9c9d6, 0.02]} />
      <hemisphereLight args={[0xd7e6ff, 0x5a4a38, 0.75]} />
      <directionalLight position={[6, 9, 5]} intensity={2.6} color="#ffe2b8" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0004} />
      {/* luz rasante sobre la baldosa: el vidrio brilla */}
      <spotLight position={[-1.4, 1.3, 1.2]} target-position={[0, TILE[1], TILE[2]]} angle={0.55} penumbra={0.8} intensity={5} distance={4} color="#fff0d8" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial map={tx.floor} roughness={0.95} /></mesh>
      <mesh position={[0, 1.1, -3.25]} receiveShadow><boxGeometry args={[11, 2.2, 0.2]} /><meshStandardMaterial map={ft.x_muro} roughness={0.95} /></mesh>
      <mesh position={[-4.6, 1.1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow><boxGeometry args={[7, 2.2, 0.2]} /><meshStandardMaterial map={ft.x_muro} roughness={0.95} /></mesh>
      <Box p={[0, 2.23, -3.25]} s={[11, 0.06, 0.26]} c="#8c8a84" />

      {/* LA BALDOSA en los caballetes */}
      <Horse x={-0.28} map={ft.x_pino} /><Horse x={0.28} map={ft.x_pino} />
      <Tile terr={ft.x_terrazo} gris={ft.x_gris} skin={skin} ghost={ghost} wet={wet} t={t} />

      {/* el banco de trabajo */}
      <group>
        {[[-1.1, -0.32], [1.1, -0.32], [-1.1, 0.32], [1.1, 0.32]].map(([x, z], i) => <Box key={i} p={[BENCH[0] + x, 0.45, BENCH[2] + z]} s={[0.08, 0.9, 0.08]} c="#8a7660" map={ft.x_pino} />)}
        <Box p={[BENCH[0], 0.91, BENCH[2]]} s={[2.4, 0.05, 0.8]} c="#a08a72" map={ft.x_tabla} rad={0.01} />
        <Box p={[BENCH[0], 0.25, BENCH[2]]} s={[2.25, 0.03, 0.7]} c="#8a7660" map={ft.x_tabla} />
        <group position={PT.radio}>
          <Box p={[0, 0, 0]} s={[0.32, 0.18, 0.12]} c="#6a2a1e" r={0.5} rad={0.02} />
          <mesh position={[-0.06, 0, 0.061]}><circleGeometry args={[0.055, 24]} /><meshStandardMaterial color="#2a2522" roughness={0.9} /></mesh>
          <Box p={[0.09, 0.03, 0.062]} s={[0.1, 0.04, 0.004]} c="#e8d8a8" e="#ffcc66" ei={0.4} rad={0.002} />
          <Tube pts={[[0.13, 0.09, -0.03], [0.2, 0.3, -0.05], [0.28, 0.48, -0.07]]} r={0.003} col="#c8c8c8" m={0.9} rough={0.3} seg={6} />
        </group>
        <group position={PT.mate}>
          <mesh position={[0, -0.02, 0]} scale={[0.05, 0.06, 0.05]} castShadow><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#6b4a2a" roughness={0.6} /></mesh>
          <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[0.035, 0.04, 0.02, 20]} /><meshStandardMaterial color="#b9b2a2" metalness={0.8} roughness={0.3} /></mesh>
          <Tube pts={[[0.01, 0.0, 0], [0.02, 0.08, 0], [0.035, 0.13, 0]]} r={0.004} col="#d0d0d0" m={0.9} rough={0.25} seg={6} />
        </group>
        {/* "una botella vacía no es basura": la verde, contra el sol */}
        <Bottle p={[PT.green[0], 0.935, PT.green[2]]} col={GLASS[0]} />
        <Bottle p={[PT.green[0] + 0.12, 0.935, PT.green[2] - 0.06]} col={GLASS[1]} />
        {/* llana y lija de diamante */}
        <Box p={[2.75, 0.945, -2.25]} s={[0.24, 0.006, 0.1]} c="#9aa0a6" m={0.85} r={0.3} rad={0.002} />
        <mesh position={[0.95, 0.95, -2.62]}><cylinderGeometry args={[0.05, 0.05, 0.012, 24]} /><meshStandardMaterial color="#3a6ac8" roughness={0.6} /></mesh>
        <Book p={BOOK} open={open} cover={ft.p001} inside={ft.p002_r} right={flip > 0 ? ft.p055 : ft.p054} spine="#8a2c22"
          flips={[{ k: flip, tex: [ft.p054, ft.p056] }]} />
      </group>

      {/* bolsas de cemento blanco */}
      <Bag p={[-2.25, 0.08, -2.6]} tex={tx.bag} />
      <Bag p={[-2.2, 0.23, -2.58]} rot={[0, 0.15, 0]} tex={tx.bag} />
      <Crate map={ft.x_pino} t={t} t0={EV.botellas + 0.95} />
      {/* balde con mezcla blanca */}
      <group position={[0.95, 0, -1.35]}>
        <mesh position={[0, 0.16, 0]} castShadow><cylinderGeometry args={[0.16, 0.13, 0.32, 28, 1, true]} /><meshStandardMaterial color="#1e1e1e" roughness={0.6} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.155, 28]} /><meshStandardMaterial color="#d9d6cf" roughness={0.75} /></mesh>
      </group>

      <Quincho tx={tx} real={ft.x_alisado} age={age} />
      <Lemon p={[-3.6, 0, -2.6]} />
      <SkyDome tex={tx.sky} />
    </ThreeCanvas>
  );
};
