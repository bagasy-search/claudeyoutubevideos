// Enzo (Enzo the HVAC Tech) · EL MUNDO: el sótano de ladrillo de un bungalow de Chicago en corte de casa de muñecas (frente abierto),
// el mismo de la ref del avatar. Adentro: la furnace gris de 1987 con el frente que se saca (quemadores que se prenden azul, el sensor de
// llama que brilla), el caño de humos galvanizado y el pleno; la escalera de madera con el interruptor de la furnace arriba (la cinta
// "DO NOT TURN ON"); el tablero eléctrico con los breakers rotulados en cinta (uno salta y se apaga la lamparita); el rincón de la
// costura con el tomacorriente bajo, la zapatilla blanca con 6 enchufes y la estufa de aceite (la zapatilla se pone marrón y humea);
// el termostato de pared (HEAT / AUX / EM HEAT); el banco de trabajo con la linterna de Walt, el termo y la bolsa con la zapatilla.
// Afuera (x < -6.2): el patio nevado con la bomba de calor (ventilador, escarcha, vapor de defrost, bloque de hielo, montaña de nieve) y el
// medidor de luz en la pared de ladrillo. Ventanita alta con nieve. UNA escena, UNA cámara (balanceo de mano). Cámara y eventos: cam.json /
// ev.json (plan.py, at() sobre la voz). Render SÓLO en el farm.
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

// ---------------- puntos fijos (los repite views.py) ----------------
const FURN: V3 = [1.2, 0, -3.25];
const HP: V3 = [-9.2, 0, 0.6];
export const PT = {
  furn: [1.2, 1.0, -2.85] as V3,
  burner: [1.2, 0.42, -2.9] as V3,
  flue: [1.2, 2.2, -3.25] as V3,
  switch: [-5.88, 2.05, -1.9] as V3,
  panel: [-5.88, 1.5, 1.0] as V3,
  outlet: [5.88, 0.35, 0.2] as V3,
  strip: [5.35, 0.03, 0.35] as V3,
  heater: [4.6, 0.35, 0.6] as V3,
  thermo: [3.3, 1.5, -3.93] as V3,
  bench: [-2.6, 0.95, -3.55] as V3,
  window: [-1.0, 2.15, -3.98] as V3,
  hp: [HP[0], 0.55, HP[2]] as V3,
  meter: [-6.78, 1.5, 2.2] as V3,
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
// rangos [a,b]: panel flame sensor hot heater smoke trip tape steam frost ice pile hpfan meter flash
// keyframes [t,v]: night (0 día gris → 1 noche) · temp (°F del termostato) · out (°F afuera)
// tstat: [t, "HEAT" | "AUX" | "EM HEAT" | "OFF"]
const E = EV as unknown as Record<string, [number, number][]> & { tstat?: [number, string][]; tlabels?: string[] };
const onR = (t: number, k: string, fi = 0.5, fo = 0.5) => { for (const [a, b] of (E[k] as [number, number][]) || []) if (t >= a - fi && t < b + fo) return win(t, a - fi, a) * (1 - win(t, b, b + fo)); return 0; };
const since = (t: number, k: string) => { let best = -1; for (const [a, b] of (E[k] as [number, number][]) || []) if (t >= a && t < b + 0.6) best = t - a; return best; };
const kf = (t: number, pts: [number, number][] | undefined, d = 0) => {
  if (!pts || !pts.length) return d; if (t <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) if (t < pts[i + 1][0]) return lerp(pts[i][1], pts[i + 1][1], sm((t - pts[i][0]) / Math.max(0.01, Math.min(1.2, pts[i + 1][0] - pts[i][0]))));
  return pts[pts.length - 1][1];
};

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
const tex = () => ({
  brick: mk("brick", 512, 512, (g) => {
    g.fillStyle = "#5b4636"; g.fillRect(0, 0, 512, 512);
    const bh = 32, bw = 96;
    for (let r = 0; r < 512 / bh; r++) for (let c = -1; c < 512 / bw + 1; c++) {
      const x = c * bw + (r % 2 ? bw / 2 : 0), i = r * 31 + c;
      const v = rnd(i, 2), base = [[122, 72, 52], [104, 62, 46], [138, 88, 62], [92, 58, 44]][Math.floor(v * 4)];
      g.fillStyle = `rgb(${base[0] + rnd(i, 3) * 14},${base[1] + rnd(i, 4) * 10},${base[2] + rnd(i, 5) * 8})`;
      g.fillRect(x + 3, r * bh + 3, bw - 6, bh - 6);
      for (let k = 0; k < 14; k++) { g.fillStyle = `rgba(0,0,0,${0.08 * rnd(i, k + 9)})`; g.fillRect(x + 3 + rnd(i, k) * (bw - 8), r * bh + 3 + rnd(i, k + 3) * (bh - 8), 4, 3); }
      if (rnd(i, 7) > 0.85) { g.fillStyle = "rgba(235,230,215,.18)"; g.fillRect(x + 3, r * bh + 3, bw - 6, bh - 6); } // eflorescencia
    }
    g.fillStyle = "rgba(205,195,175,.35)"; for (let r = 0; r <= 512 / bh; r++) g.fillRect(0, r * bh - 1, 512, 3);
  }, [5, 2]),
  concrete: mk("conc", 512, 512, (g) => {
    g.fillStyle = "#77736c"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 3000; i++) { const v = 90 + rnd(i, 1) * 50; g.fillStyle = `rgba(${v},${v - 3},${v - 8},.45)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
    g.strokeStyle = "rgba(40,36,32,.35)"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 260); g.bezierCurveTo(140, 250, 300, 300, 512, 270); g.stroke();
    for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(50,45,40,${0.12 * rnd(i, 7)})`; g.beginPath(); g.ellipse(rnd(i, 8) * 512, rnd(i, 9) * 512, 60, 30, 0, 0, 6.3); g.fill(); }
  }, [4, 3]),
  wood: mk("wood", 256, 512, (g) => {
    g.fillStyle = "#6b4a2e"; g.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(40,25,12,${0.25 * rnd(i, 2)})`; g.lineWidth = 1 + rnd(i, 3) * 2; g.beginPath(); const x = rnd(i, 4) * 256; g.moveTo(x, 0); g.bezierCurveTo(x + 12, 170, x - 12, 340, x + 6, 512); g.stroke(); }
  }),
  snow: mk("snow", 256, 256, (g) => { g.fillStyle = "#d3dbe4"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(120,140,170,${0.22 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 3, 2); } for (let i = 0; i < 9; i++) { g.fillStyle = `rgba(110,130,160,.10)`; g.beginPath(); g.ellipse(rnd(i, 4) * 256, rnd(i, 5) * 256, 50, 14, 0.3, 0, 6.3); g.fill(); } }, [8, 8]),
  grille: mk("grille", 256, 256, (g) => { g.fillStyle = "#2c2f33"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#8d949b"; g.lineWidth = 3; for (let i = 8; i < 256; i += 14) { g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); } }),
  fins: mk("fins", 256, 256, (g) => { g.fillStyle = "#6f777e"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#a7afb6"; g.lineWidth = 1; for (let i = 0; i < 256; i += 3) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke(); } }, [3, 1]),
  label: mk("furnlabel", 256, 160, (g) => {
    g.fillStyle = "#e9e3d2"; g.fillRect(0, 0, 256, 160); g.fillStyle = "#222"; g.font = "800 18px Arial"; g.fillText("GAS FURNACE · 80% AFUE", 12, 28);
    g.font = "600 14px Arial"; ["INPUT 100,000 BTU/H", "MFD. 10/1987", "SERIAL 87K401233"].forEach((l, i) => g.fillText(l, 12, 58 + i * 22));
    g.fillStyle = "#e3c544"; g.fillRect(150, 100, 96, 50); g.fillStyle = "#111"; g.font = hand(13); g.fillText("Service every", 154, 120); g.fillText("fall · Enzo", 158, 140);
  }),
});
const panelTex = (tripped: number) => mk(`panel${tripped > 0.5 ? 1 : 0}`, 320, 512, (g) => {
  g.fillStyle = "#a9aeb2"; g.fillRect(0, 0, 320, 512); g.fillStyle = "#3b3f44"; g.fillRect(30, 40, 260, 430);
  const labs = ["KITCHEN", "BATH", "FURNACE", "FRONT BED", "BACK BED", "SEWING RM", "LIVING RM", "WASHER", "FRIDGE", "BASEMENT"];
  labs.forEach((l, i) => {
    const y = 60 + i * 40, x = i % 2 ? 165 : 45, row = Math.floor(i / 2) * 2 * 20 + (i % 2) * 0;
    void row;
    g.fillStyle = "#16181b"; g.fillRect(x, y, 110, 30);
    const off = tripped > 0.5 && l === "SEWING RM";
    g.fillStyle = off ? "#d81b1b" : "#d9dcdf"; g.fillRect(off ? x + 12 : x + 62, y + 6, 36, 18);
    g.fillStyle = "#efe2b8"; g.fillRect(x - 2, y + 30, 114, 9); g.fillStyle = "#1a2a6a"; g.font = hand(9); g.fillText(l, x + 4, y + 38);
  });
  g.fillStyle = "#222"; g.font = "800 16px Arial"; g.fillText("100 A", 136, 495);
});
const tstatTex = (mode: string, temp: number, out: number) => mk(`ts|${mode}|${Math.round(temp)}|${Math.round(out)}`, 384, 384, (g) => {
  g.fillStyle = "#f3f3f0"; g.beginPath(); g.roundRect(0, 0, 384, 384, 40); g.fill();
  g.fillStyle = "#0e1a22"; g.beginPath(); g.roundRect(40, 50, 304, 230, 18); g.fill();
  g.fillStyle = "#c9eaff"; g.font = "800 120px Arial"; g.textAlign = "center"; g.fillText(`${Math.round(temp)}°`, 175, 195);
  g.font = "700 26px Arial"; g.fillStyle = "#8fb6cc"; g.fillText(`OUTSIDE ${Math.round(out)}°F`, 192, 250);
  const col = mode === "EM HEAT" ? "#ff3b30" : mode === "AUX" ? "#ffb020" : mode === "OFF" ? "#8e8e8e" : "#3fd17a";
  g.fillStyle = col; g.beginPath(); g.arc(300, 92, 14, 0, 6.3); g.fill();
  g.font = "900 34px Arial"; g.textAlign = "right"; g.fillText(mode, 280, 104);
  g.fillStyle = "#555"; g.font = "700 22px Arial"; g.textAlign = "center"; ["MODE", "FAN", "▲", "▼"].forEach((b, i) => g.fillText(b, 70 + i * 82, 335));
});
const tapeTex = () => mk("tape", 256, 64, (g) => { g.fillStyle = "#e6d9a8"; g.fillRect(0, 0, 256, 64); g.fillStyle = "#151515"; g.font = "900 26px Arial"; g.textAlign = "center"; g.fillText("DO NOT TURN ON", 128, 42); });

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op < 1} opacity={op} depthWrite={op >= 1} /></mesh>
);
const Pipe: React.FC<{ a: V3; b: V3; r: number; c: string; m?: number; ro?: number }> = ({ a, b, r, c, m = 0.6, ro = 0.4 }) => {
  const va = v3(a), vb = v3(b), mid = va.clone().add(vb).multiplyScalar(0.5), len = va.distanceTo(vb);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
  return <mesh position={mid} quaternion={q} castShadow><cylinderGeometry args={[r, r, len, 20]} /><meshStandardMaterial color={c} metalness={m} roughness={ro} /></mesh>;
};
const Smoke: React.FC<{ p: V3; t: number; k: number; n?: number; col?: string; spread?: number; rise?: number }> = ({ p, t, k, n = 34, col = "#d9d4cc", spread = 0.12, rise = 0.9 }) => k < 0.01 ? null : <group position={p}>{Array.from({ length: n }, (_, i) => {
  const u = (t * 0.45 + rnd(i, 1)) % 1;
  return <mesh key={i} position={[(rnd(i, 2) - 0.5) * spread + Math.sin(t * 1.3 + i) * 0.06 * u, u * rise, (rnd(i, 3) - 0.5) * spread]}><sphereGeometry args={[0.015 + u * 0.06, 10, 8]} /><meshStandardMaterial color={col} transparent opacity={k * 0.14 * (1 - u) * (0.4 + u)} depthWrite={false} roughness={1} /></mesh>;
})}</group>;

// estufa de aceite (radiador con aletas) · glow 0..1
const Heater: React.FC<{ p: V3; glow: number }> = ({ p, glow }) => (
  <group position={p} rotation={[0, -0.5, 0]}>
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[(i - 3) * 0.075, 0.33, 0]} castShadow geometry={rbox(0.05, 0.56, 0.24, 0.022)}><meshStandardMaterial color="#c9c3b6" roughness={0.6} metalness={0.15} emissive="#ff6a2a" emissiveIntensity={glow * 0.03} /></mesh>)}
    <Box p={[0, 0.06, 0]} s={[0.56, 0.05, 0.3]} c="#3a3a3a" r={0.5} />
    <Box p={[0.31, 0.5, 0]} s={[0.06, 0.12, 0.12]} c="#2d2d2d" r={0.5} e="#ff3b1f" ei={glow * 1.5} />
    {glow > 0.02 && <pointLight position={[0, 0.4, 0.3]} intensity={0.7 * glow} distance={2.0} color="#ff9150" />}
  </group>
);
// zapatilla blanca de 6 tomas con enchufes (hot 0..1 = se pone marrón/naranja)
const Strip: React.FC<{ p: V3; hot: number }> = ({ p, hot }) => {
  const col = new THREE.Color("#f2f0ea").lerp(new THREE.Color("#8a5a2b"), cl(hot * 1.2));
  return (
    <group position={p} rotation={[0, 0.25, 0]}>
      <mesh castShadow geometry={rbox(0.5, 0.045, 0.1, 0.02)} position={[0, 0.0225, 0]}><meshStandardMaterial color={col} roughness={0.6} emissive="#ff4a10" emissiveIntensity={0.35 * cl(hot * 1.5 - 0.4)} /></mesh>
      <Box p={[-0.21, 0.05, 0]} s={[0.035, 0.012, 0.035]} c="#d81b1b" e="#ff2a1a" ei={0.6} />
      {Array.from({ length: 6 }, (_, i) => <group key={i} position={[-0.13 + i * 0.065, 0.06, 0]}>
        <Box p={[0, 0, 0]} s={[0.04, 0.05, 0.05]} c={i === 0 ? "#2b2b2b" : ["#efefef", "#1d1d1d", "#cfcfcf", "#3b3b3b", "#efefef"][i - 1]} r={0.5} rad={0.008} />
        <Pipe a={[0, 0.02, 0]} b={[0.05 * Math.sin(i * 1.7), 0.03, -0.5 - 0.3 * rnd(i, 3)]} r={0.006} c={i === 0 ? "#2b2b2b" : "#bdbdbd"} m={0} ro={0.7} />
      </group>)}
    </group>
  );
};
// bomba de calor afuera: fan 0..1, frost 0..1, ice 0..1, pile 0..1
const HeatPump: React.FC<{ p: V3; t: number; fan: number; frost: number; ice: number; pile: number; tx: ReturnType<typeof tex> }> = ({ p, t, fan, frost, ice, pile, tx }) => (
  <group position={p}>
    <Box p={[0, 0.06, 0]} s={[1.2, 0.12, 1.2]} c="#8e8a84" r={0.95} />
    <mesh position={[0, 0.62, 0]} castShadow geometry={rbox(0.95, 1.0, 0.95, 0.03)}><meshStandardMaterial color="#d8dad6" roughness={0.5} metalness={0.3} /></mesh>
    {[0, 1, 2, 3].map((i) => <mesh key={i} position={[Math.sin(i * Math.PI / 2) * 0.48, 0.6, Math.cos(i * Math.PI / 2) * 0.48]} rotation={[0, i * Math.PI / 2, 0]}><planeGeometry args={[0.82, 0.8]} /><meshStandardMaterial map={tx.fins} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#f4f8ff"), frost)} roughness={0.5 - 0.3 * frost} metalness={0.4 * (1 - frost)} emissive="#e9f3ff" emissiveIntensity={0.25 * frost} /></mesh>)}
    <mesh position={[0, 1.125, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.38, 40]} /><meshStandardMaterial map={tx.grille} roughness={0.6} /></mesh>
    <group position={[0, 1.09, 0]} rotation={[0, t * 9 * fan, 0]}>{[0, 1, 2].map((i) => <mesh key={i} rotation={[0.25, (i * 2 * Math.PI) / 3, 0]} position={[Math.cos((i * 2 * Math.PI) / 3) * 0.16, 0, -Math.sin((i * 2 * Math.PI) / 3) * 0.16]}><boxGeometry args={[0.3, 0.01, 0.12]} /><meshStandardMaterial color="#1d1f22" /></mesh>)}</group>
    {ice > 0.01 && <mesh position={[0, 0.62, 0]}><boxGeometry args={[1.05, 1.12, 1.05]} /><meshPhysicalMaterial color="#d6ecff" roughness={0.08} transmission={0.3} transparent opacity={0.6 * ice} /></mesh>}
    {ice > 0.01 && Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-0.45 + i * 0.1, 1.07 - 0.12 * ice, 0.5]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.02, 0.22 * ice * (0.6 + rnd(i, 2) * 0.6), 6]} /><meshPhysicalMaterial color="#e6f4ff" roughness={0.05} transparent opacity={0.85} /></mesh>)}
    {pile > 0.01 && <mesh position={[-0.62, 0.0, 0.1]} scale={[0.42, 0.62 * pile, 0.95]}><sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial map={tx.snow} roughness={0.95} /></mesh>}
    <Box p={[0.75, 0.9, -0.55]} s={[0.25, 0.32, 0.12]} c="#9aa0a6" m={0.5} r={0.4} />
    <Pipe a={[0.4, 0.3, -0.5]} b={[0.4, 0.3, -1.3]} r={0.02} c="#b87333" m={0.9} ro={0.3} />
  </group>
);

export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useMemo(tex, []);
  const night = kf(t, E.night, 0.3);
  const panelOff = onR(t, "panel", 0.6, 0.6);
  const flame = onR(t, "flame", 0.4, 0.6);
  const sensor = onR(t, "sensor", 0.3, 0.3);
  const hot = onR(t, "hot", 1.2, 0.8);
  const heater = onR(t, "heater", 0.6, 0.6);
  const smoke = onR(t, "smoke", 0.8, 0.8);
  const trip = onR(t, "trip", 0.05, 0.5);
  const tape = onR(t, "tape", 0.4, 0.6);
  const steam = onR(t, "steam", 0.6, 0.8);
  const frost = onR(t, "frost", 0.8, 0.8);
  const ice = onR(t, "ice", 0.8, 0.8);
  const pile = onR(t, "pile", 0.8, 0.8);
  const fan = Math.max(onR(t, "hpfan", 0.6, 0.6) * (1 - steam), 0);
  const meter = onR(t, "meter", 0.4, 0.4);
  const flash = onR(t, "flash", 0.2, 0.4);
  const mode = (E.tstat || []).filter(([a]) => t >= a).pop()?.[1] ?? "HEAT";
  const temp = kf(t, E.temp, 68), out = kf(t, E.out, 9);
  const ts = tstatTex(mode, temp, out);
  const panel = panelTex(trip);
  const bulb = 1 - 0.85 * trip;
  const skyOut = new THREE.Color("#c7d2dc").lerp(new THREE.Color("#0d1726"), cl(night));

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.45} threshold={0.88} exposure={0.95} env={0.25} />
      <color attach="background" args={[skyOut.getStyle()]} />
      <mesh><sphereGeometry args={[300, 32, 16]} /><meshBasicMaterial color={skyOut} side={THREE.BackSide} toneMapped={false} /></mesh>
      <hemisphereLight args={[0xcfd8e3, 0x3a2f26, 0.28 + 0.2 * (1 - night)]} />
      {/* luz fría del invierno por la ventanita y sobre el patio */}
      <directionalLight position={[-16, 12, 6]} intensity={1.3 * (1 - 0.7 * night)} color="#dfe8f5" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-16} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-8} shadow-bias={-0.0004} />
      <spotLight position={[-1.0, 2.2, -3.6]} angle={0.7} penumbra={1} intensity={5 * (1 - 0.9 * night)} distance={7} color="#cfe0f5" target-position={[0.5, 0, -1]} />
      {/* la lamparita pelada del techo (se apaga cuando salta el breaker) */}
      <mesh position={[0.5, 2.38, -1.0]}><sphereGeometry args={[0.06, 16, 12]} /><meshStandardMaterial color="#fff6d8" emissive="#ffd99a" emissiveIntensity={3 * bulb} /></mesh>
      <Pipe a={[0.5, 2.62, -1.0]} b={[0.5, 2.44, -1.0]} r={0.008} c="#222" />
      <pointLight position={[0.5, 2.3, -1.0]} intensity={8 * bulb} distance={10} color="#ffd9a0" castShadow />
      <pointLight position={[4.0, 2.3, 0.4]} intensity={2.6 * bulb} distance={6} color="#ffe2b8" />
      <spotLight position={[1.2, 2.3, -1.6]} angle={0.5} penumbra={0.9} intensity={4 * bulb} distance={5} color="#fff0d8" target-position={PT.furn} />

      {/* ===== EL SÓTANO ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -0.5]} receiveShadow><planeGeometry args={[12.4, 7.2]} /><meshStandardMaterial map={tx.concrete} roughness={0.92} /></mesh>
      <Box p={[0, -0.15, -0.5]} s={[12.6, 0.3, 7.4]} c="#5e5953" r={0.95} rad={0.02} />
      <Box p={[0, 1.35, -4.05]} s={[12.4, 2.7, 0.14]} c="#ffffff" map={tx.brick} r={0.92} rad={0.01} />
      <Box p={[6.05, 1.35, -0.5]} s={[0.14, 2.7, 7.2]} c="#ffffff" map={tx.brick} r={0.92} rad={0.01} />
      <Box p={[-6.05, 1.35, -0.5]} s={[0.14, 2.7, 7.2]} c="#ffffff" map={tx.brick} r={0.92} rad={0.01} />
      {/* vigas del techo y caños negros */}
      {Array.from({ length: 13 }, (_, k) => <Box key={k} p={[-6 + k, 2.68, -0.5]} s={[0.06, 0.24, 7.2]} c="#4a3524" r={0.9} map={tx.wood} rad={0.005} />)}
      <Box p={[0, 2.82, -0.5]} s={[12.4, 0.04, 7.2]} c="#3b2a1d" r={0.95} cast={false} />
      <Pipe a={[-6, 2.45, -3.7]} b={[6, 2.45, -3.7]} r={0.03} c="#141414" />
      <Pipe a={[-6, 2.36, -3.5]} b={[6, 2.36, -3.5]} r={0.02} c="#7a5230" m={0.8} ro={0.35} />
      {/* ventanita alta con nieve afuera */}
      <group position={PT.window}>
        <Box p={[0, 0, 0.02]} s={[1.1, 0.62, 0.08]} c="#d9d4ca" r={0.6} />
        <mesh position={[0, 0, 0.065]}><planeGeometry args={[0.98, 0.5]} /><meshBasicMaterial color={new THREE.Color("#dfe9f2").lerp(new THREE.Color("#1a2638"), night)} toneMapped={false} /></mesh>
        <Box p={[0, 0, 0.07]} s={[0.03, 0.5, 0.02]} c="#d9d4ca" />
        <mesh position={[0, -0.17, 0.07]}><planeGeometry args={[0.98, 0.16]} /><meshBasicMaterial color="#f4f7fa" toneMapped={false} /></mesh>
        {Array.from({ length: 26 }, (_, i) => { const u = (t * 0.22 + rnd(i, 1)) % 1; return <mesh key={i} position={[-0.47 + rnd(i, 2) * 0.94 + Math.sin(t + i) * 0.02, 0.24 - u * 0.48, 0.072]}><circleGeometry args={[0.007, 6]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>; })}
      </group>

      {/* LA FURNACE de 1987 */}
      <group position={FURN}>
        <mesh position={[0, 0.68, 0]} castShadow receiveShadow geometry={rbox(0.62, 1.36, 0.74, 0.02)}><meshStandardMaterial color="#8d9196" roughness={0.45} metalness={0.55} /></mesh>
        {/* frente de abajo: se saca (panel) */}
        <group position={[0, 0.42, 0.375 + panelOff * 0.35]} rotation={[panelOff * -0.25, 0, 0]}>
          <mesh castShadow geometry={rbox(0.6, 0.62, 0.02, 0.01)}><meshStandardMaterial color="#9da2a7" roughness={0.4} metalness={0.55} /></mesh>
          {Array.from({ length: 6 }, (_, i) => <Box key={i} p={[0, 0.18 - i * 0.05, 0.012]} s={[0.4, 0.012, 0.01]} c="#2b2e31" />)}
        </group>
        {/* adentro: quemadores, llama y sensor */}
        <Box p={[0, 0.25, 0.1]} s={[0.5, 0.06, 0.3]} c="#3a3b3d" m={0.6} r={0.5} />
        {Array.from({ length: 4 }, (_, i) => <group key={i} position={[-0.18 + i * 0.12, 0.31, 0.2]}>
          <Pipe a={[0, 0, -0.15]} b={[0, 0, 0.12]} r={0.018} c="#58534c" m={0.7} />
          {flame > 0.01 && <mesh position={[0, 0.07, 0.13]} scale={[1, 0.9 + 0.15 * Math.sin(t * 23 + i * 2), 1]}><coneGeometry args={[0.03, 0.15 * flame, 12]} /><meshBasicMaterial color="#3d8bff" transparent opacity={0.85 * flame} toneMapped={false} /></mesh>}
        </group>)}
        <mesh position={[0.24, 0.38, 0.3]} rotation={[0, 0, 0.6]}><cylinderGeometry args={[0.006, 0.006, 0.12, 8]} /><meshStandardMaterial color="#cfd3d6" metalness={1} roughness={0.25} emissive="#ffd60a" emissiveIntensity={sensor * 2.5} /></mesh>
        {sensor > 0.01 && <mesh position={[0.24, 0.38, 0.31]}><ringGeometry args={[0.07, 0.085, 40]} /><meshBasicMaterial color="#ffd60a" transparent opacity={sensor} toneMapped={false} /></mesh>}
        {flame > 0.01 && <pointLight position={[0, 0.4, 0.3]} intensity={2.2 * flame} distance={1.6} color="#5aa0ff" />}
        <mesh position={[0.312, 1.0, 0.1]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.32, 0.2]} /><meshStandardMaterial map={tx.label} roughness={0.7} /></mesh>
        {/* pleno, conductos y caño de humos */}
        <Box p={[0, 1.65, 0]} s={[0.66, 0.6, 0.78]} c="#8d9399" m={0.55} r={0.55} rad={0.01} />
        <Box p={[1.4, 2.2, 0]} s={[2.4, 0.3, 0.45]} c="#8d9399" m={0.55} r={0.55} rad={0.01} />
        <Box p={[-1.6, 2.2, 0.1]} s={[2.6, 0.3, 0.45]} c="#868c92" m={0.55} r={0.55} rad={0.01} />
        <Pipe a={[0, 1.36, -0.25]} b={[0, 2.5, -0.25]} r={0.07} c="#c7ccd0" m={0.8} ro={0.3} />
        <Pipe a={[0, 2.5, -0.25]} b={[0, 2.5, -0.75]} r={0.07} c="#c7ccd0" m={0.8} ro={0.3} />
        <Pipe a={[-0.45, 0.35, -0.1]} b={[-0.45, 2.35, -0.1]} r={0.022} c="#141414" />
        <Box p={[-0.45, 0.55, 0.0]} s={[0.1, 0.1, 0.08]} c="#d4a017" r={0.4} m={0.4} />
      </group>

      {/* ESCALERA de madera (pared izquierda) + interruptor con la cinta */}
      {Array.from({ length: 10 }, (_, k) => <Box key={k} p={[-5.35, 0.13 + k * 0.26, 1.1 - k * 0.27]} s={[0.95, 0.04, 0.3]} c="#7a5634" r={0.8} map={tx.wood} rad={0.008} />)}
      <Box p={[-4.86, 1.25, -0.12]} s={[0.05, 0.22, 3.45]} c="#5a3c24" rot={[0.77, 0, 0]} />
      <Box p={[-5.84, 1.25, -0.12]} s={[0.05, 0.22, 3.45]} c="#5a3c24" rot={[0.77, 0, 0]} />
      <Box p={[-5.92, 2.05, -1.9]} s={[0.04, 0.16, 0.1]} c="#b8bcc0" m={0.6} r={0.4} />
      <Box p={[-5.89, 2.05, -1.9]} s={[0.02, 0.05, 0.02]} c="#202020" />
      {tape > 0.01 && <mesh position={[-5.865, 2.05, -1.9]} rotation={[0, Math.PI / 2, 0.08]} scale={[tape, 1, 1]}><planeGeometry args={[0.2, 0.05]} /><meshStandardMaterial map={tapeTex()} roughness={0.8} /></mesh>}

      {/* TABLERO ELÉCTRICO */}
      <group position={PT.panel} rotation={[0, Math.PI / 2, 0]}>
        <Box p={[0, 0, -0.04]} s={[0.42, 0.66, 0.08]} c="#8e9398" m={0.6} r={0.4} />
        <mesh position={[0, 0, 0.002]}><planeGeometry args={[0.38, 0.62]} /><meshStandardMaterial map={panel} roughness={0.55} /></mesh>
        {trip > 0.05 && <pointLight position={[0, 0, 0.3]} intensity={0.8 * trip} distance={1.2} color="#ff5a3a" />}
      </group>

      {/* TERMOSTATO */}
      <group position={PT.thermo}>
        <mesh position={[0, 0, -0.005]}><planeGeometry args={[0.3, 0.3]} /><meshStandardMaterial color="#e9e6de" roughness={0.8} /></mesh>
        <mesh position={[0, 0, 0.012]} geometry={rbox(0.16, 0.16, 0.025, 0.02)}><meshStandardMaterial color="#f3f3f0" roughness={0.4} /></mesh>
        <mesh position={[0, 0, 0.026]}><planeGeometry args={[0.15, 0.15]} /><meshStandardMaterial map={ts} emissive="#ffffff" emissiveMap={ts} emissiveIntensity={0.55} roughness={0.3} /></mesh>
      </group>

      {/* BANCO DE TRABAJO: linterna de Walt, termo, taza, bolsa con la zapatilla */}
      <group position={[-2.6, 0, -3.55]}>
        <Box p={[0, 0.88, 0]} s={[2.2, 0.06, 0.7]} c="#6b4a2e" map={tx.wood} r={0.8} />
        {[[-1.0, -0.3], [1.0, -0.3], [-1.0, 0.3], [1.0, 0.3]].map(([x, z], i) => <Box key={i} p={[x, 0.43, z]} s={[0.07, 0.86, 0.07]} c="#4a3121" />)}
        <Pipe a={[-0.6, 0.94, 0.1]} b={[-0.15, 0.94, 0.05]} r={0.025} c="#2c2c2c" m={0.8} ro={0.3} />
        <mesh position={[-0.62, 0.94, 0.1]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.035, 0.03, 0.06, 16]} /><meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.3} emissive="#fff3c0" emissiveIntensity={0.15} /></mesh>
        <mesh position={[0.3, 1.06, -0.15]} castShadow><cylinderGeometry args={[0.055, 0.055, 0.3, 20]} /><meshStandardMaterial color="#2f6e4a" metalness={0.6} roughness={0.35} /></mesh>
        <mesh position={[0.55, 0.95, 0.12]}><cylinderGeometry args={[0.04, 0.035, 0.09, 16]} /><meshStandardMaterial color="#efe9de" roughness={0.4} /></mesh>
        <Box p={[0.75, 0.93, -0.1]} s={[0.36, 0.04, 0.16]} c="#c7b48e" op={0.75} r={0.2} />
        <Box p={[0.75, 0.93, -0.1]} s={[0.3, 0.03, 0.06]} c="#8a5a2b" r={0.6} />
        <Box p={[-0.2, 0.92, -0.2]} s={[0.5, 0.03, 0.3]} c="#e8e3d5" r={0.9} />
        <Box p={[0, 1.55, -0.32]} s={[1.2, 0.8, 0.03]} c="#a8835a" r={0.95} />
        {[[-0.3, 1.65], [0.15, 1.5], [0.4, 1.75]].map(([x, y], i) => <Box key={i} p={[x, y, -0.3]} s={[0.22, 0.28, 0.005]} c={["#f4efe4", "#e6d9a8", "#f7f4ea"][i]} r={0.9} cast={false} />)}
      </group>

      {/* RINCÓN DE LA COSTURA: mesa, máquina, tomacorriente bajo, zapatilla, estufa */}
      <group position={[4.4, 0, -0.6]}>
        <Box p={[0, 0.74, 0]} s={[1.2, 0.05, 0.6]} c="#8a6a48" r={0.6} />
        {[[-0.55, -0.25], [0.55, -0.25], [-0.55, 0.25], [0.55, 0.25]].map(([x, z], i) => <Box key={i} p={[x, 0.37, z]} s={[0.05, 0.74, 0.05]} c="#5a4430" />)}
        <Box p={[0.05, 0.87, 0]} s={[0.42, 0.2, 0.18]} c="#2e2e2e" r={0.35} m={0.3} />
        <Box p={[-0.12, 0.98, 0]} s={[0.12, 0.05, 0.16]} c="#2e2e2e" r={0.35} m={0.3} />
        <mesh position={[0.4, 0.82, 0.12]}><cylinderGeometry args={[0.04, 0.04, 0.05, 16]} /><meshStandardMaterial color="#b0413e" roughness={0.6} /></mesh>
      </group>
      <group position={PT.outlet} rotation={[0, -Math.PI / 2, 0]}>
        <Box p={[0, 0, 0]} s={[0.08, 0.13, 0.01]} c="#efe8d5" r={0.5} />
        {[0.03, -0.03].map((y, i) => <Box key={i} p={[0, y, 0.008]} s={[0.035, 0.035, 0.006]} c="#2b2b2b" />)}
      </group>
      <Pipe a={[5.86, 0.32, 0.2]} b={[5.4, 0.03, 0.3]} r={0.008} c="#efefef" m={0} ro={0.7} />
      <Strip p={PT.strip} hot={hot} />
      <Smoke p={[PT.strip[0] - 0.1, 0.08, PT.strip[2]]} t={t} k={smoke} />
      <Heater p={[4.6, 0, 0.6]} glow={heater} />

      {/* ===== AFUERA: el patio nevado, la pared del bungalow, la bomba de calor y el medidor ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12, 0.02, -0.5]} receiveShadow><planeGeometry args={[11.5, 16]} /><meshStandardMaterial map={tx.snow} roughness={0.95} /></mesh>
      <Box p={[-6.4, 1.6, -0.5]} s={[0.5, 3.2, 7.4]} c="#ffffff" map={tx.brick} r={0.92} rad={0.01} />
      <group position={PT.meter} rotation={[0, -Math.PI / 2, 0]}>
        <Box p={[0, 0, 0]} s={[0.22, 0.32, 0.12]} c="#9aa0a6" m={0.6} r={0.35} />
        <mesh position={[0, 0.02, 0.07]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.06, 32]} /><meshPhysicalMaterial color="#e8f0f4" roughness={0.05} transparent opacity={0.5} /></mesh>
        <mesh position={[0, 0.02, 0.105]} rotation={[0, 0, t * (1 + 14 * meter)]}><boxGeometry args={[0.14, 0.012, 0.004]} /><meshBasicMaterial color="#111" /></mesh>
      </group>
      <HeatPump p={HP} t={t} fan={fan} frost={Math.max(frost, steam * 0.6)} ice={ice} pile={pile} tx={tx} />
      <Smoke p={[HP[0], 0.9, HP[2]]} t={t} k={steam} n={36} col="#f2f5f8" spread={0.9} rise={2.4} />
      {/* arbustos pelados y cerca del callejón */}
      {Array.from({ length: 9 }, (_, i) => <Box key={i} p={[-15.5, 0.6, -6 + i * 1.5]} s={[0.08, 1.2, 0.08]} c="#4b3a2b" />)}
      <Box p={[-15.5, 1.05, -0.0]} s={[0.04, 0.1, 13]} c="#4b3a2b" />
      {/* el barrio: garaje del callejón con nieve en el techo, el piso de arriba del bungalow y el two-flat del vecino con luces, el farol */}
      <Box p={[-12.5, 1.3, -6.7]} s={[5, 2.6, 2.6]} c="#ffffff" map={tx.brick} r={0.92} rad={0.01} />
      <Box p={[-12.5, 2.66, -6.7]} s={[5.3, 0.14, 2.9]} c="#e6ebf0" r={0.95} />
      <Box p={[-12.5, 1.0, -5.38]} s={[2.6, 2.0, 0.05]} c="#cfc8b8" r={0.7} />
      {[0, 1, 2, 3].map((i) => <Box key={"gd" + i} p={[-12.5, 0.3 + i * 0.5, -5.35]} s={[2.6, 0.02, 0.02]} c="#a39b8a" />)}
      <Box p={[-6.4, 4.6, -0.5]} s={[0.5, 2.8, 7.4]} c="#ffffff" map={tx.brick} r={0.92} rad={0.01} />
      <Box p={[-6.4, 6.05, -0.5]} s={[0.9, 0.12, 7.8]} c="#e6ebf0" r={0.95} />
      {[-2.6, -0.5, 1.6].map((z, i) => <Box key={"wu" + i} p={[-6.67, 4.4, z]} s={[0.04, 1.1, 0.8]} c="#26303c" e="#ffcf87" ei={0.15 + 1.6 * night * (i === 1 ? 1 : 0.6)} />)}
      <Box p={[-19.5, 3, -0.5]} s={[3, 6, 10]} c="#ffffff" map={tx.brick} r={0.92} rad={0.01} />
      <Box p={[-19.5, 6.06, -0.5]} s={[3.3, 0.14, 10.3]} c="#e6ebf0" r={0.95} />
      {[[1.3, -3.5], [1.3, -0.5], [1.3, 2.5], [4.2, -3.5], [4.2, -0.5], [4.2, 2.5]].map(([y, z], i) => <Box key={"wn" + i} p={[-17.98, y, z]} s={[0.04, 1.0, 0.7]} c="#26303c" e="#ffcf87" ei={(i % 3 === 1 ? 0.2 : 0.1) + 1.5 * night * (i % 2 ? 1 : 0.5)} />)}
      <Pipe a={[-15.2, 0, 5.2]} b={[-15.2, 4.6, 5.2]} r={0.06} c="#3a3f45" m={0.5} />
      <Pipe a={[-15.2, 4.6, 5.2]} b={[-14.4, 4.6, 5.2]} r={0.04} c="#3a3f45" m={0.5} />
      <mesh position={[-14.4, 4.45, 5.2]}><sphereGeometry args={[0.16, 16, 12]} /><meshStandardMaterial color="#fff2d0" emissive="#ffd28a" emissiveIntensity={0.3 + 3 * night} /></mesh>
      {night > 0.3 && <pointLight position={[-14.4, 4.2, 5.2]} intensity={6 * night} distance={12} color="#ffcf8a" />}
      <Box p={[-15.5, 1.1, -0.0]} s={[0.12, 0.05, 13]} c="#eef2f5" r={0.95} />
      {/* fondo del callejón (a donde miran las vistas de la bomba): cerco, garaje y la fila de two-flats de enfrente */}
      {Array.from({ length: 14 }).map((_, i) => <Box key={"cf" + i} p={[-16 + i * 0.75, 0.75, -7.2]} s={[0.7, 1.5, 0.06]} c={i % 2 ? "#6a5440" : "#5d4936"} r={0.9} />)}
      <Box p={[-9.5, 1.5, -6.9]} s={[10.5, 0.06, 0.1]} c="#eef2f5" r={0.95} />
      <Box p={[-8.2, 1.4, -9.6]} s={[4.5, 2.8, 3.2]} c="#ffffff" map={tx.brick} r={0.92} rad={0.01} />
      <Box p={[-8.2, 2.86, -9.6]} s={[4.8, 0.14, 3.5]} c="#e6ebf0" r={0.95} />
      {[[-17, 7], [-10.5, 6.2], [-4, 7.4]].map(([x, h], k) => <group key={"tf" + k}>
        <Box p={[x, h / 2, -14]} s={[5.6, h, 3]} c="#ffffff" map={tx.brick} r={0.92} rad={0.01} />
        <Box p={[x, h + 0.07, -14]} s={[5.9, 0.14, 3.3]} c="#e6ebf0" r={0.95} />
        {[-1.6, 0, 1.6].flatMap((dx, j) => [1.5, 4.2].map((y, m) => <Box key={j + "_" + m} p={[x + dx, y, -12.48]} s={[0.9, 1.1, 0.04]} c="#26303c" e="#ffcf87" ei={0.08 + 1.6 * night * ((j + m + k) % 3 ? 1 : 0.15)} />))}
      </group>)}
      {/* nieve que cae afuera */}
      {Array.from({ length: 160 }, (_, i) => { const u = ((t * 0.18 + rnd(i, 1)) % 1); return <mesh key={i} position={[-15 + rnd(i, 2) * 8.4 + Math.sin(t * 0.7 + i) * 0.2, 6 - u * 6, -7 + rnd(i, 3) * 13]}><sphereGeometry args={[0.018, 6, 4]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85} depthWrite={false} /></mesh>; })}
      {flash > 0.01 && <pointLight position={[0, 1.5, 1]} intensity={20 * flash} distance={14} color="#fff3d6" />}
    </ThreeCanvas>
  );
};
