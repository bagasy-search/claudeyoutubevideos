// Héctor (Hector the Car Dealer) · EL MUNDO: el salón de una concesionaria de Miami en corte de casa de muñecas (frente
// abierto), visto como maqueta. Adentro: el sedán nuevo sobre el piso brillante (la puerta del conductor se abre y se ve la
// etiqueta de fabricación en el marco), el escritorio de Héctor con el BLOC AMARILLO donde se dibuja el four-square, el
// calendario de pared que pasa de mes y marca días, la pizarra de ventas del mes con la meta del bono y el reloj de pared.
// Por el ventanal: el lote con la primera fila de autos, palmeras, banderines y, al frente, el sedán marrón de Irving con el
// precio en grasa blanca en el parabrisas. Cielo de día → atardecer → noche; tormenta (Andrew) con lluvia.
// UNA escena y UNA cámara (balanceo de mano). Cámara y eventos vienen de cam.json / ev.json (plan.py, at() sobre la voz).
// Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { manoCam } from "../kits/camara/CamaraMano";
import CAM from "./cam.json";
import EV from "./ev.json";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

// ---------------- transformaciones fijas (las repite plan.py para las vistas) ----------------
const CAR_A = { p: [0.5, 0, -1.0] as V3, ry: 0.5 };   // el sedán nuevo del salón
const CAR_B = { p: [-9.0, 0, 1.6] as V3, ry: 0 };     // el sedán marrón de Irving, primera fila del lote
const DESK = [6.2, 0, 1.0] as V3;
const toW = (c: { p: V3; ry: number }, l: V3): V3 => [c.p[0] + l[0] * Math.cos(c.ry) + l[2] * Math.sin(c.ry), c.p[1] + l[1], c.p[2] - l[0] * Math.sin(c.ry) + l[2] * Math.cos(c.ry)];

// ---------------- puntos del mundo ----------------
export const PT = {
  car: toW(CAR_A, [0, 0.9, 0]),
  ws: toW(CAR_A, [1.15, 1.14, 0]),
  jamb: toW(CAR_A, [-0.3, 0.8, -0.9]),
  pad: [6.0, 0.78, 1.0] as V3,
  keys: [5.75, 0.78, 1.45] as V3,
  cal: [5.4, 2.1, -4.93] as V3,
  board: [-2.4, 2.3, -4.93] as V3,
  clock: [7.93, 2.75, 1.0] as V3,
  sign: [1.2, 3.85, -4.9] as V3,
  lot: [-12, 1.0, 0] as V3,
  trade: toW(CAR_B, [0, 0.9, 0]),
  tradews: toW(CAR_B, [1.15, 1.14, 0]),
};

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
export const KEYS: Key[] = (CAM as { keys: Key[] }).keys;
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.01, 600); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t), m = manoCam(t, 1, 7);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l);
  cm.rotateY((m.pan * Math.PI) / 180); cm.rotateX((m.tilt * Math.PI) / 180); cm.rotateZ((m.roll * Math.PI) / 180);
  cm.fov = k.fov; cm.near = 0.01; cm.far = 600; cm.updateProjectionMatrix();
  return null;
};

// ---------------- eventos ----------------
type WS = { a: number; b: number; tx: string; car?: "A" | "B" };
type HL = [number, number, string];
const E = EV as unknown as Record<string, [number, number][]> & {
  cal?: [number, number][]; calhl?: HL[]; calyear?: number; pad?: [number, number][]; padv?: string[]; board?: [number, number][]; goal?: number;
  clock?: [number, number][]; night?: [number, number][]; ws?: WS[]; sign?: string;
};
const onR = (t: number, k: string, fi = 0.5, fo = 0.5) => { for (const [a, b] of (E[k] as [number, number][]) || []) if (t >= a - fi && t < b + fo) return win(t, a - fi, a) * (1 - win(t, b, b + fo)); return 0; };
const kf = (t: number, pts: [number, number][] | undefined, d = 0) => {
  if (!pts || !pts.length) return d; if (t <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) if (t < pts[i + 1][0]) return lerp(pts[i][1], pts[i + 1][1], sm((t - pts[i][0]) / Math.max(0.01, Math.min(1.2, pts[i + 1][0] - pts[i][0]))));
  return pts[pts.length - 1][1];
};
const step = (t: number, pts: [number, number][] | undefined, d = 0) => { let v = d; for (const [a, x] of pts || []) if (t >= a) v = x; return v; };

// ---------------- texturas (canvas, cacheadas por contenido) ----------------
const CACHE = new Map<string, THREE.CanvasTexture>();
const mk = (key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const hit = CACHE.get(key); if (hit) return hit;
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8;
  CACHE.set(key, t); return t;
};
const HAND = "italic 700 {s}px 'Segoe Print','Bradley Hand','Marker Felt','Comic Sans MS',sans-serif";
const hand = (s: number) => HAND.replace("{s}", String(s));
const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

const calTex = (m: number, hl: string, yr: number) => mk(`cal${m}|${hl}|${yr}`, 512, 640, (g) => {
  g.fillStyle = "#fbf8f1"; g.fillRect(0, 0, 512, 640);
  // foto de la hoja: un auto clásico al sol (ilustración plana)
  const gr = g.createLinearGradient(0, 0, 0, 230); gr.addColorStop(0, "#5fb6e8"); gr.addColorStop(1, "#cfe9f5"); g.fillStyle = gr; g.fillRect(0, 0, 512, 230);
  g.fillStyle = "#e0c58a"; g.fillRect(0, 180, 512, 50); g.fillStyle = "#2e7d4f"; for (let i = 0; i < 3; i++) { g.fillRect(60 + i * 170, 70, 8, 115); }
  g.fillStyle = ["#b3261e", "#1f5fa8", "#d98b1f", "#2b8a57"][m % 4]; g.beginPath(); g.roundRect(150, 135, 220, 50, 18); g.fill(); g.beginPath(); g.roundRect(195, 105, 120, 40, 14); g.fill();
  g.fillStyle = "#222"; g.beginPath(); g.arc(195, 188, 18, 0, 6.3); g.arc(325, 188, 18, 0, 6.3); g.fill();
  g.fillStyle = "#b3261e"; g.fillRect(0, 230, 512, 64);
  g.fillStyle = "#fff"; g.font = "900 46px Arial, sans-serif"; g.textAlign = "center"; g.fillText(`${MONTHS[m]} ${yr}`, 256, 280);
  const first = new Date(yr, m, 1).getDay(), days = new Date(yr, m + 1, 0).getDate();
  g.fillStyle = "#555"; g.font = "800 20px Arial"; ["S", "M", "T", "W", "T", "F", "S"].forEach((d, i) => g.fillText(d, 37 + i * 73, 322));
  const cell = (d: number) => { const k = first + d - 1; return { x: 37 + (k % 7) * 73, y: 360 + Math.floor(k / 7) * 52 }; };
  g.font = "800 30px Arial";
  for (let d = 1; d <= days; d++) { const c = cell(d); g.fillStyle = (first + d - 1) % 7 === 0 ? "#b3261e" : "#222"; g.fillText(String(d), c.x, c.y); }
  g.lineWidth = 6; g.strokeStyle = "#d81b1b";
  const circ = (d: number) => { const c = cell(d); g.beginPath(); g.ellipse(c.x, c.y - 10, 30, 24, -0.1, 0.2, 6.6); g.stroke(); };
  if (hl === "last3") for (let d = days - 2; d <= days; d++) circ(d);
  else if (hl.startsWith("d")) hl.slice(1).split(",").forEach((d) => circ(+d));
  else if (hl === "montue") for (let d = 1; d <= days; d++) { const w = (first + d - 1) % 7; if (w === 1 || w === 2) circ(d); }
  else if (hl === "x") { g.lineWidth = 14; g.beginPath(); g.moveTo(30, 310); g.lineTo(482, 620); g.moveTo(482, 310); g.lineTo(30, 620); g.stroke(); }
  else if (hl === "ok") { g.strokeStyle = "#1f9d55"; g.lineWidth = 16; g.beginPath(); g.moveTo(140, 470); g.lineTo(230, 570); g.lineTo(400, 360); g.stroke(); }
  else if (hl === "bday") { g.fillStyle = "rgba(255,214,10,.55)"; const c = cell(Math.min(days, 14)); g.beginPath(); g.arc(c.x, c.y - 10, 30, 0, 6.3); g.fill(); g.fillStyle = "#b3261e"; g.font = hand(26); g.fillText("my birthday", c.x + 40, c.y + 30); }
});
const padTex = (st: number, v: string[]) => mk(`pad${st}|${v.join("|")}`, 512, 704, (g) => {
  g.fillStyle = "#fbe98a"; g.fillRect(0, 0, 512, 704);
  g.strokeStyle = "rgba(70,120,190,.45)"; g.lineWidth = 2; for (let y = 90; y < 704; y += 30) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
  g.strokeStyle = "rgba(200,60,60,.55)"; g.beginPath(); g.moveTo(60, 0); g.lineTo(60, 704); g.stroke();
  g.fillStyle = "#8d1f1f"; g.fillRect(0, 0, 512, 46);
  g.strokeStyle = "#1b1f2a"; g.lineWidth = 7; g.lineCap = "round";
  const n = Math.floor(st);
  if (n >= 1) { g.beginPath(); g.moveTo(256, 110); g.lineTo(256, 660); g.moveTo(40, 385); g.lineTo(480, 385); g.stroke(); }
  const Q = [[150, 250, "PRICE"], [360, 250, "TRADE"], [150, 530, "DOWN"], [360, 530, "MONTHLY"]] as const;
  g.textAlign = "center";
  Q.forEach(([x, y, lab], i) => {
    if (n < 1) return;
    g.fillStyle = "#34405a"; g.font = "800 24px Arial"; g.fillText(lab, x, y - 95);
    if (n >= i + 2) { g.fillStyle = "#14223f"; g.font = hand(54); g.fillText(v[i] ?? "", x, y, 190); }
  });
  if (n >= 6) { g.strokeStyle = "#d81b1b"; g.lineWidth = 8; g.beginPath(); g.ellipse(360, 515, 120, 62, 0, 0, 6.3); g.stroke(); }
  if (n >= 7) { g.strokeStyle = "#d81b1b"; g.lineWidth = 9; g.beginPath(); g.moveTo(280, 250); g.lineTo(450, 210); g.stroke(); }
});
const NAMES = ["HECTOR", "RICKY", "MANNY", "JOE"];
const boardTex = (n: number, goal: number) => mk(`brd${n}|${goal}`, 1024, 560, (g) => {
  g.fillStyle = "#f6f7f5"; g.fillRect(0, 0, 1024, 560);
  g.strokeStyle = "#9aa0a6"; g.lineWidth = 18; g.strokeRect(0, 0, 1024, 560);
  g.fillStyle = "#1c3d8f"; g.font = "900 52px Arial"; g.textAlign = "left"; g.fillText("SALES THIS MONTH", 40, 80);
  g.fillStyle = "#b3261e"; g.font = "900 40px Arial"; g.textAlign = "right"; g.fillText(`BONUS @ ${goal}`, 990, 80);
  const per = [0.34, 0.28, 0.22, 0.16];
  let left = n;
  NAMES.forEach((nm, i) => {
    const y = 160 + i * 88, k = i === 3 ? left : Math.min(left, Math.round(n * per[i])); left -= k;
    g.fillStyle = "#222"; g.font = "800 40px Arial"; g.textAlign = "left"; g.fillText(nm, 40, y);
    g.strokeStyle = "#1c3d8f"; g.lineWidth = 6;
    for (let j = 0; j < k; j++) { const gx = 260 + Math.floor(j / 5) * 70 + (j % 5) * 12; if (j % 5 === 4) { g.beginPath(); g.moveTo(gx - 52, y - 8); g.lineTo(gx + 4, y - 36); g.stroke(); } else { g.beginPath(); g.moveTo(gx, y - 44); g.lineTo(gx, y + 4); g.stroke(); } }
  });
  g.fillStyle = n >= goal ? "#1f9d55" : "#b3261e"; g.font = "900 120px Arial"; g.textAlign = "right"; g.fillText(`${n}/${goal}`, 990, 520);
});
const wsTex = (tx: string) => mk(`ws|${tx}`, 1024, 512, (g) => {
  g.clearRect(0, 0, 1024, 512); g.fillStyle = "rgba(255,255,255,.96)"; g.textAlign = "center";
  const lines = tx.split("\n"); const s = lines.length > 1 ? 150 : 230;
  g.font = hand(s); lines.forEach((l, i) => g.fillText(l, 512, 260 + (i - (lines.length - 1) / 2) * s * 1.05 + s * 0.33, 820));
});
const stickerTex = () => mk("sticker", 512, 320, (g) => {
  g.fillStyle = "#f2f2ef"; g.fillRect(0, 0, 512, 320); g.strokeStyle = "#333"; g.lineWidth = 4; g.strokeRect(6, 6, 500, 308);
  g.fillStyle = "#111"; g.font = "900 34px Arial"; g.textAlign = "left"; g.fillText("MFD. BY: AUTO CORP.", 24, 56);
  g.font = "800 28px Arial"; g.fillText("DATE:", 24, 112); g.fillStyle = "#b3261e"; g.font = "900 64px Arial"; g.fillText("09/87", 130, 120);
  g.fillStyle = "#111"; g.font = "700 18px Arial"; ["GVWR 4,320 LB   GAWR FR 2,210 LB", "THIS VEHICLE CONFORMS TO ALL APPLICABLE", "FEDERAL MOTOR VEHICLE SAFETY STANDARDS", "VIN 1A4BC3D5XHN000000"].forEach((l, i) => g.fillText(l, 24, 170 + i * 30));
  for (let i = 0; i < 70; i++) { g.fillRect(300 + i * 2.8, 250, rnd(i, 4) > 0.5 ? 2 : 1, 50); }
});
const signTex = (tx: string) => mk(`sign|${tx}`, 1536, 192, (g) => {
  g.clearRect(0, 0, 1536, 192); g.fillStyle = "#ffffff"; g.font = "900 128px Arial"; g.textAlign = "center"; g.fillText(tx, 768, 140, 1460);
});
const saleTex = (i: number) => mk(`sale${i}`, 512, 256, (g) => {
  g.clearRect(0, 0, 512, 256); g.fillStyle = ["#ffd60a", "#ffffff", "#ffd60a"][i % 3]; g.textAlign = "center";
  g.font = hand(96); g.fillText(["SALE!", "$5,995", "LOW MI"][i % 3], 256, 160);
});
const tex = () => ({
  tile: mk("tile", 512, 512, (g) => {
    g.fillStyle = "#d9d9d6"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = 222 + rnd(r * 4 + c, 2) * 16; g.fillStyle = `rgb(${v},${v},${v - 3})`; g.fillRect(c * 128 + 2, r * 128 + 2, 124, 124); }
  }, [14, 10]),
  asphalt: mk("asph", 512, 512, (g) => {
    g.fillStyle = "#3b3d40"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2500; i++) { const v = 40 + rnd(i, 1) * 50; g.fillStyle = `rgba(${v},${v},${v},.6)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
  }, [8, 8]),
  leaf: mk("leaf", 128, 512, (g) => {
    g.clearRect(0, 0, 128, 512); g.fillStyle = "#2f7a3a"; g.beginPath(); g.moveTo(64, 0); g.quadraticCurveTo(128, 200, 64, 512); g.quadraticCurveTo(0, 200, 64, 0); g.fill();
    g.strokeStyle = "#1f5627"; g.lineWidth = 3; g.beginPath(); g.moveTo(64, 0); g.lineTo(64, 512); g.stroke();
    for (let y = 30; y < 500; y += 22) { g.beginPath(); g.moveTo(64, y); g.lineTo(10, y + 30); g.moveTo(64, y); g.lineTo(118, y + 30); g.stroke(); }
  }),
  wall: mk("wall", 256, 256, (g) => { g.fillStyle = "#efe9de"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(150,130,100,${0.05 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 3, 3); } }, [6, 3]),
});

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op < 1} opacity={op} depthWrite={op >= 1} /></mesh>
);
const CHROME = { color: "#eef1f3", metalness: 1, roughness: 0.15 };

// perfil lateral de la cabina (x adelante, y arriba) extruido al ancho
const cabinGeo = (() => {
  const s = new THREE.Shape(); s.moveTo(-1.4, 0); s.lineTo(1.45, 0); s.lineTo(0.75, 0.56); s.lineTo(-0.9, 0.56); s.lineTo(-1.4, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 1.58, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3 }); g.translate(0, 0, -0.79); return g;
})();
const Wheel: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p} rotation={[Math.PI / 2, 0, 0]}>
    <mesh castShadow><cylinderGeometry args={[0.33, 0.33, 0.24, 32]} /><meshStandardMaterial color="#141414" roughness={0.85} /></mesh>
    <mesh position={[0, 0.125, 0]}><cylinderGeometry args={[0.2, 0.2, 0.01, 24]} /><meshStandardMaterial {...CHROME} /></mesh>
    <mesh position={[0, -0.125, 0]}><cylinderGeometry args={[0.2, 0.2, 0.01, 24]} /><meshStandardMaterial {...CHROME} /></mesh>
  </group>
);
// sedán de 4 puertas (largo en x). door 0..1 abre la del conductor; ws = textura del parabrisas (grasa blanca) con revelado
const Car: React.FC<{ c: { p: V3; ry: number }; col: string; door?: number; ws?: Tx; wsK?: number; sticker?: Tx; glow?: number; tint?: number }> = ({ c, col, door = 0, ws, wsK = 1, sticker, glow = 0, tint = 0.55 }) => {
  const paint = { color: col, metalness: 0.55, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08 };
  if (ws) { ws.repeat.set(Math.max(0.001, wsK), 1); ws.offset.set(0, 0); }
  return (
    <group position={c.p} rotation={[0, c.ry, 0]}>
      <mesh position={[0, 0.58, 0]} castShadow receiveShadow geometry={rbox(4.6, 0.62, 1.8, 0.18)}><meshPhysicalMaterial {...paint} /></mesh>
      <mesh position={[0, 0.86, 0]} geometry={cabinGeo} castShadow><meshPhysicalMaterial color="#16222e" roughness={0.04} metalness={0.7} clearcoat={1} transmission={0} transparent opacity={0.82 + 0.15 * tint} /></mesh>
      <mesh position={[-0.075, 1.43, 0]} castShadow geometry={rbox(1.72, 0.05, 1.6, 0.02)}><meshPhysicalMaterial {...paint} /></mesh>
      {/* faros, parrilla, luces de atrás, manijas */}
      <Box p={[2.29, 0.66, 0.6]} s={[0.04, 0.16, 0.38]} c="#fffbe6" e="#fff2c0" ei={0.9} r={0.2} />
      <Box p={[2.29, 0.66, -0.6]} s={[0.04, 0.16, 0.38]} c="#fffbe6" e="#fff2c0" ei={0.9} r={0.2} />
      <Box p={[2.3, 0.6, 0]} s={[0.03, 0.18, 0.7]} c="#222" r={0.4} m={0.6} />
      <Box p={[-2.29, 0.68, 0.62]} s={[0.04, 0.14, 0.36]} c="#b31212" e="#7a0000" ei={0.6} r={0.3} />
      <Box p={[-2.29, 0.68, -0.62]} s={[0.04, 0.14, 0.36]} c="#b31212" e="#7a0000" ei={0.6} r={0.3} />
      <Box p={[2.33, 0.38, 0]} s={[0.08, 0.14, 1.78]} c="#cfd3d6" m={1} r={0.2} />
      <Box p={[-2.33, 0.38, 0]} s={[0.08, 0.14, 1.78]} c="#cfd3d6" m={1} r={0.2} />
      {[[1.45, 0.92], [1.45, -0.92], [-1.45, 0.92], [-1.45, -0.92]].map(([x, z], i) => <Wheel key={i} p={[x, 0.33, z]} />)}
      {/* puerta del conductor (lado -z), bisagra adelante */}
      <group position={[0.8, 0.6, -0.905]} rotation={[0, -1.15 * door, 0]}>
        <mesh position={[-0.55, 0, 0]} castShadow geometry={rbox(1.1, 0.58, 0.05, 0.02)}><meshPhysicalMaterial {...paint} /></mesh>
        <Box p={[-0.95, 0.12, -0.035]} s={[0.16, 0.03, 0.02]} c="#cfd3d6" m={1} r={0.2} />
      </group>
      {/* la etiqueta de fabricación en el marco de la puerta */}
      {sticker && <group position={[-0.28, 0.7, -0.91]} rotation={[0, Math.PI, 0]}>
        <mesh><planeGeometry args={[0.26, 0.16]} /><meshStandardMaterial map={sticker} roughness={0.6} emissive="#ffffff" emissiveIntensity={0.08 + 0.4 * glow} emissiveMap={sticker} /></mesh>
        {glow > 0.01 && <mesh position={[0, 0, 0.005]}><ringGeometry args={[0.17, 0.2, 40]} /><meshBasicMaterial color="#ffd60a" transparent opacity={glow} toneMapped={false} /></mesh>}
      </group>}
      {/* precio en el parabrisas */}
      {ws && wsK > 0.001 && <group position={[1.15, 1.14, 0]} rotation={[0, 0, 0.82]}>
        <mesh rotation={[0, Math.PI / 2, 0]} position={[0.07, 0, (1 - wsK) * 0.7]}><planeGeometry args={[1.4 * wsK, 0.7]} /><meshBasicMaterial map={ws} transparent depthWrite={false} toneMapped={false} /></mesh>
      </group>}
    </group>
  );
};

const Palm: React.FC<{ p: V3; h?: number; lean?: number; t: number; i: number; leaf: THREE.Texture }> = ({ p, h = 6.5, lean = 0.08, t, i, leaf }) => (
  <group position={p} rotation={[0, i, lean]}>
    <mesh position={[0, h / 2, 0]} castShadow><cylinderGeometry args={[0.13, 0.22, h, 12]} /><meshStandardMaterial color="#8a7356" roughness={0.95} /></mesh>
    {Array.from({ length: 9 }, (_, k) => {
      const a = (k / 9) * Math.PI * 2, sw = Math.sin(t * 1.3 + k + i) * 0.06;
      return <group key={k} position={[0, h, 0]} rotation={[0, a, 0]}><group rotation={[0, 0, -1.0 - 0.25 * rnd(k, i) + sw]}>
        <mesh position={[0, 1.3, 0]}><planeGeometry args={[0.7, 2.7]} /><meshStandardMaterial map={leaf} transparent alphaTest={0.4} side={THREE.DoubleSide} roughness={0.8} /></mesh>
      </group></group>;
    })}
  </group>
);

const Clock: React.FC<{ h: number }> = ({ h }) => {
  const hr = (h % 12) / 12 * Math.PI * 2, mn = (h % 1) * Math.PI * 2;
  return (
    <group position={PT.clock} rotation={[0, -Math.PI / 2, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.36, 0.36, 0.06, 48]} /><meshStandardMaterial color="#1b1b1b" roughness={0.4} /></mesh>
      <mesh position={[0, 0, 0.032]}><circleGeometry args={[0.32, 48]} /><meshStandardMaterial color="#f8f6ef" roughness={0.6} /></mesh>
      {Array.from({ length: 12 }, (_, k) => <mesh key={k} position={[Math.sin(k / 12 * 6.283) * 0.27, Math.cos(k / 12 * 6.283) * 0.27, 0.036]}><boxGeometry args={[0.02, 0.05, 0.004]} /><meshBasicMaterial color="#222" /></mesh>)}
      <group position={[0, 0, 0.04]} rotation={[0, 0, -hr]}><mesh position={[0, 0.08, 0]}><boxGeometry args={[0.03, 0.17, 0.006]} /><meshBasicMaterial color="#111" /></mesh></group>
      <group position={[0, 0, 0.045]} rotation={[0, 0, -mn]}><mesh position={[0, 0.12, 0]}><boxGeometry args={[0.018, 0.25, 0.006]} /><meshBasicMaterial color="#b3261e" /></mesh></group>
    </group>
  );
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useMemo(tex, []);
  const night = kf(t, E.night, 0);
  const storm = onR(t, "storm", 0.8, 0.8);
  const door = onR(t, "door", 0.7, 0.7);
  const glow = onR(t, "jamb", 0.3, 0.3);
  const keys = onR(t, "keys", 0.4, 0.4);
  const appraise = onR(t, "appraise", 0.4, 0.4);
  const yr = Math.round(step(t, (E as any).calyr, E.calyear ?? 1988)); // eslint-disable-line @typescript-eslint/no-explicit-any
  const mon = Math.round(step(t, E.cal, 3));
  const hlNow = (E.calhl || []).find(([a, b]) => t >= a && t < b);
  const cal = calTex(mon, hlNow ? hlNow[2] : "", yr);
  const pad = padTex(step(t, E.pad, 1), E.padv ?? ["$18,995", "$1,500", "$2,000", "$389"]);
  const goal = E.goal ?? 30;
  const brd = boardTex(Math.round(step(t, E.board, 18)), goal);
  const hr = kf(t, E.clock, 14.5);
  const wsNow = (E.ws || []).find((x) => t >= x.a - 0.2 && t < x.b + 0.5);
  const wsT = wsNow ? wsTex(wsNow.tx) : undefined;
  const wsK = wsNow ? cl((t - wsNow.a) / 1.4) * (1 - win(t, wsNow.b, wsNow.b + 0.5)) : 0;
  const onB = wsNow?.car === "B";
  const sky = new THREE.Color("#7fc3ec").lerp(new THREE.Color("#ff9a5a"), cl(night * 2) * (1 - cl(night * 2 - 1))).lerp(new THREE.Color("#0c1424"), cl(night * 1.6 - 0.6)).lerp(new THREE.Color("#4a5560"), storm * 0.8);
  const sun = (1 - cl(night * 1.4)) * (1 - 0.7 * storm);
  const st = stickerTex(), sign = signTex((((E as any).signs || []) as [number, string][]).filter(([a]) => t >= a).pop()?.[1] ?? E.sign ?? "CORAL WAY MOTORS"); // eslint-disable-line @typescript-eslint/no-explicit-any

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.25 + 0.3 * night} threshold={0.92} exposure={0.9 - 0.15 * night} env={0.4 - 0.15 * night} />
      <color attach="background" args={[sky.getStyle()]} />
      <mesh><sphereGeometry args={[300, 32, 16]} /><meshBasicMaterial color={sky} side={THREE.BackSide} toneMapped={false} /></mesh>
      <hemisphereLight args={[0xdfeefc, 0x3a332a, 0.35 + 0.35 * sun]} />
      <directionalLight position={[-14, 16, 8]} intensity={2.6 * sun} color="#fff1d8" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-20} shadow-camera-right={14} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-0.0004} />
      {/* luces del techo del salón (pesan más de noche) */}
      {[[-3, -2], [1, -2], [5, -2], [-3, 2], [1, 2], [5, 2]].map(([x, z], i) => <group key={i}>
        <Box p={[x, 4.4, z]} s={[1.6, 0.06, 0.5]} c="#ffffff" e="#fff6e6" ei={1.6} r={0.3} cast={false} />
        <pointLight position={[x, 4.1, z]} intensity={4 + 6 * night} distance={9} color="#fff3e0" />
      </group>)}
      <spotLight position={[4.6, 4.2, 2.6]} angle={0.55} penumbra={0.8} intensity={14} distance={9} color="#fff4e2" target-position={PT.pad} castShadow />
      <spotLight position={[1.5, 4.3, 2.5]} angle={0.6} penumbra={0.9} intensity={18} distance={10} color="#ffffff" target-position={PT.car} />

      {/* ===== EL SALÓN ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0.001, -0.5]} receiveShadow><planeGeometry args={[14, 9]} /><meshPhysicalMaterial map={tx.tile} roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} /></mesh>
      <Box p={[1, -0.15, -0.5]} s={[14.2, 0.3, 9.2]} c="#8f8a82" r={0.9} rad={0.02} />
      <Box p={[1, 2.25, -5.05]} s={[14.2, 4.5, 0.12]} c="#efe9de" r={0.85} map={tx.wall} rad={0.01} />
      <Box p={[8.05, 2.25, -0.5]} s={[0.12, 4.5, 9.2]} c="#efe9de" r={0.85} map={tx.wall} rad={0.01} />
      <Box p={[1, 0.08, -4.97]} s={[14.0, 0.16, 0.04]} c="#5b4636" r={0.6} />
      {/* letrero */}
      <Box p={[1.2, 3.85, -4.98]} s={[7.4, 0.9, 0.06]} c="#9b1c1c" r={0.4} rad={0.03} />
      <mesh position={[1.2, 3.85, -4.94]}><planeGeometry args={[7.0, 0.875]} /><meshBasicMaterial map={sign} transparent toneMapped={false} /></mesh>
      {/* pizarra de ventas */}
      <Box p={[PT.board[0], PT.board[1], -4.98]} s={[3.25, 1.8, 0.05]} c="#9aa0a6" m={0.6} r={0.3} />
      <mesh position={PT.board}><planeGeometry args={[3.2, 1.75]} /><meshStandardMaterial map={brd} roughness={0.35} /></mesh>
      <Box p={[PT.board[0], PT.board[1] - 0.95, -4.92]} s={[3.0, 0.05, 0.12]} c="#9aa0a6" m={0.6} r={0.3} />
      {/* calendario de pared */}
      <mesh position={PT.cal}><planeGeometry args={[1.0, 1.25]} /><meshStandardMaterial map={cal} roughness={0.7} /></mesh>
      <mesh position={[PT.cal[0], PT.cal[1] + 0.64, -4.95]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 1.0, 8]} /><meshStandardMaterial {...CHROME} /></mesh>
      {/* póster de un auto + planta + dispensador */}
      <Box p={[-4.6, 2.2, -4.97]} s={[1.6, 1.0, 0.03]} c="#1f5fa8" r={0.4} />
      <mesh position={[-4.6, 0.45, -4.4]} castShadow><cylinderGeometry args={[0.25, 0.2, 0.5, 20]} /><meshStandardMaterial color="#c9b18a" roughness={0.8} /></mesh>
      {Array.from({ length: 7 }, (_, k) => <mesh key={k} position={[-4.6 + Math.sin(k) * 0.15, 0.95 + rnd(k, 3) * 0.4, -4.4 + Math.cos(k) * 0.15]} rotation={[Math.sin(k) * 0.5, k, Math.cos(k) * 0.5]}><planeGeometry args={[0.3, 0.9]} /><meshStandardMaterial map={tx.leaf} transparent alphaTest={0.4} side={THREE.DoubleSide} /></mesh>)}
      <Clock h={hr} />

      {/* ventanal hacia el lote (x = -6) */}
      {Array.from({ length: 6 }, (_, k) => <Box key={k} p={[-6, 2.25, -5 + k * 1.84]} s={[0.1, 4.5, 0.1]} c="#2a2d31" m={0.7} r={0.3} />)}
      <Box p={[-6, 4.47, -0.5]} s={[0.12, 0.08, 9.2]} c="#2a2d31" m={0.7} r={0.3} />
      <mesh position={[-6, 2.25, -0.5]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[9.2, 4.5]} /><meshPhysicalMaterial color="#cfe6f2" roughness={0.02} metalness={0} transparent opacity={0.12 + 0.12 * night} depthWrite={false} side={THREE.DoubleSide} /></mesh>

      {/* el auto nuevo del salón */}
      <Car c={CAR_A} col="#8e1c1c" door={door} sticker={st} glow={glow} ws={!onB ? wsT : undefined} wsK={!onB ? wsK : 0} />
      <mesh position={[CAR_A.p[0], 0.004, CAR_A.p[2]]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[3.0, 64]} /><meshStandardMaterial color="#b9b6b0" roughness={0.3} /></mesh>

      {/* el escritorio de Héctor */}
      <group position={DESK}>
        <Box p={[0, 0.74, 0]} s={[1.0, 0.05, 1.8]} c="#5a3c28" r={0.5} rad={0.01} />
        <Box p={[0.45, 0.37, 0]} s={[0.06, 0.72, 1.7]} c="#4a3121" r={0.6} />
        <Box p={[-0.1, 0.37, -0.8]} s={[1.0, 0.72, 0.06]} c="#4a3121" r={0.6} />
        <Box p={[-0.1, 0.37, 0.8]} s={[1.0, 0.72, 0.06]} c="#4a3121" r={0.6} />
        {/* teléfono, portalápices, plaquita, carpeta */}
        <Box p={[0.25, 0.8, -0.55]} s={[0.22, 0.08, 0.26]} c="#2b2b2b" r={0.4} />
        <mesh position={[0.3, 0.83, 0.6]}><cylinderGeometry args={[0.05, 0.05, 0.12, 16]} /><meshStandardMaterial color="#333" roughness={0.5} /></mesh>
        <Box p={[-0.35, 0.79, -0.65]} s={[0.06, 0.06, 0.34]} c="#c8a74e" m={0.8} r={0.3} />
        <Box p={[0.05, 0.775, 0.45]} s={[0.32, 0.015, 0.24]} c="#d8c39a" r={0.8} />
        {/* silla de Héctor (detrás) y 2 de clientes */}
        <Box p={[0.85, 0.48, 0]} s={[0.5, 0.08, 0.5]} c="#1d1d1d" r={0.6} />
        <Box p={[1.08, 0.85, 0]} s={[0.07, 0.7, 0.5]} c="#1d1d1d" r={0.6} />
        {[-0.45, 0.45].map((z, i) => <group key={i} position={[-0.95, 0, z]}><Box p={[0, 0.45, 0]} s={[0.46, 0.07, 0.46]} c="#7a2e2a" r={0.7} /><Box p={[-0.22, 0.75, 0]} s={[0.06, 0.55, 0.46]} c="#7a2e2a" r={0.7} /></group>)}
      </group>
      {/* EL BLOC AMARILLO (four-square) */}
      <group position={PT.pad} rotation={[0, 0.12, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.44, 0.6]} /><meshStandardMaterial map={pad} roughness={0.9} /></mesh>
        <mesh position={[0, -0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.455, 0.62]} /><meshStandardMaterial color="#6b4a2e" /></mesh>
      </group>
      <mesh position={[PT.pad[0] - 0.02, PT.pad[1] + 0.01, PT.pad[2] + 0.25]} rotation={[Math.PI / 2, 0, 0.6]}><cylinderGeometry args={[0.006, 0.006, 0.15, 10]} /><meshStandardMaterial color="#1c2f6b" roughness={0.3} /></mesh>
      {/* llaves */}
      <group position={[PT.keys[0], PT.keys[1] + keys * 0.35, PT.keys[2]]} rotation={[keys * 1.2, keys * t, 0]}>
        <Box p={[0, 0, 0]} s={[0.07, 0.02, 0.04]} c="#111" r={0.4} rad={0.008} />
        <mesh position={[0.06, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.022, 0.004, 8, 20]} /><meshStandardMaterial {...CHROME} /></mesh>
        <Box p={[0.11, 0, 0]} s={[0.07, 0.008, 0.016]} c="#d9d9d9" m={1} r={0.2} rad={0.003} />
      </group>

      {/* ===== EL LOTE ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-16, 0.0, 0]} receiveShadow><planeGeometry args={[20, 22]} /><meshStandardMaterial map={tx.asphalt} roughness={0.9} color={storm > 0.1 ? "#9aa3ab" : "#ffffff"} metalness={0.25 * storm} /></mesh>
      {Array.from({ length: 9 }, (_, k) => <mesh key={k} rotation={[-Math.PI / 2, 0, 0]} position={[-10.5, 0.003, -9 + k * 2.9]}><planeGeometry args={[3.6, 0.08]} /><meshBasicMaterial color="#e8e6dd" /></mesh>)}
      <Car c={CAR_B} col="#5b3b22" tint={0.4} ws={onB ? wsT : undefined} wsK={onB ? wsK : 0} />
      {appraise > 0.01 && <mesh position={[CAR_B.p[0], 0.02, CAR_B.p[2]]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[2.6, 2.8, 64]} /><meshBasicMaterial color="#ffd60a" transparent opacity={appraise * 0.9} toneMapped={false} /></mesh>}
      {[[-9, -4.2, "#e8e8e6"], [-9, -1.3, "#1f3f7a"], [-9, 4.5, "#2f2f30"], [-9, 7.4, "#8a8f94"], [-14.5, -4.2, "#7b1d1d"], [-14.5, -1.3, "#d9d2bd"], [-14.5, 1.6, "#2d5a3a"], [-14.5, 4.5, "#c7c9cc"]].map(([x, z, col], i) => (
        <group key={i}><Car c={{ p: [x as number, 0, z as number], ry: 0 }} col={col as string} tint={0.6} />
          <group position={[(x as number) + 1.15, 1.14, z as number]} rotation={[0, 0, 0.82]}><mesh rotation={[0, Math.PI / 2, 0]} position={[0.012, 0, 0]}><planeGeometry args={[1.2, 0.6]} /><meshBasicMaterial map={saleTex(i)} transparent depthWrite={false} toneMapped={false} /></mesh></group>
        </group>))}
      {/* banderines */}
      {Array.from({ length: 2 }, (_, r) => <group key={r}>
        <mesh position={[-11.5, 3.2, -2.5 + r * 6]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.01, 0.01, 9, 6]} /><meshBasicMaterial color="#444" /></mesh>
        {Array.from({ length: 16 }, (_, k) => <mesh key={k} position={[-16 + k * 0.56, 3.05, -2.5 + r * 6]} rotation={[Math.sin(t * 4 + k) * 0.35, 0, Math.PI]}><coneGeometry args={[0.15, 0.32, 3]} /><meshStandardMaterial color={["#d81b1b", "#ffffff", "#1f5fa8", "#ffd60a"][k % 4]} roughness={0.7} side={THREE.DoubleSide} /></mesh>)}
      </group>)}
      {[[-7, 0, 6.6], [-18, 0, -6], [-18.5, 0, 3], [-7.2, 0, -7.4], [-21, 0, 8]].map((p, i) => <Palm key={i} p={p as V3} i={i} t={t} leaf={tx.leaf} h={6 + rnd(i, 2) * 2} lean={0.04 + rnd(i, 5) * 0.1} />)}
      {[[-12, -8.5], [-12, 8.5]].map(([x, z], i) => <group key={i}><mesh position={[x, 3.5, z]}><cylinderGeometry args={[0.08, 0.1, 7, 10]} /><meshStandardMaterial color="#6d7176" metalness={0.6} /></mesh>
        <Box p={[x, 7.0, z]} s={[0.8, 0.15, 0.4]} c="#cfd3d6" e="#fff3d0" ei={night * 3} /></group>)}
      {/* lluvia de tormenta sobre el lote */}
      {storm > 0.01 && Array.from({ length: 260 }, (_, i) => { const u = ((t * 1.6 + rnd(i, 1)) % 1); return <mesh key={i} position={[-20 + rnd(i, 2) * 14, 9 - u * 9, -9 + rnd(i, 3) * 18]} rotation={[0, 0, 0.25]}><boxGeometry args={[0.012, 0.5, 0.012]} /><meshBasicMaterial color="#cfe0ef" transparent opacity={0.5 * storm} depthWrite={false} /></mesh>; })}
    </ThreeCanvas>
  );
};
