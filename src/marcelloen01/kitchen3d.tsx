// marcelloen01 · EL MUNDO: una sola escena three.js y UNA cámara para todo el minuto 1.
//  · Set 1 (origen): el departamento de quien vive solo, 7 de la tarde, noche fría: heladera casi vacía que se abre y se cierra,
//    microondas con 7:00, celular que se prende (delivery), mesa para dos con una sola silla usada, ventana a la ciudad.
//  · Set 2 (z = -30, detrás de la ventana): la cocina de piedra de la nonna Rosa en Abruzzo, al atardecer: cocina a leña con
//    fuego, la olla negra con vapor, mesa larga de roble donde aparecen 9 platos, estante de frascos, ajos, cobres.
//  La cámara pasa del uno al otro ATRAVESANDO la ventana ("And then one night I remembered my nonna's kitchen"): nunca hay corte.
//  Todo lo que pasa está clavado a la palabra con at("frase"). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { at, rnd } from "./lib";
import { REST_KEYS, potLook, CH, type PotLook } from "./restkeys";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ZK = -30; // la cocina de la nonna vive 30 m detrás de la ventana del departamento

// ---------------- momentos clavados a la voz ----------------
export const M = {
  close: at("you close the door"),
  order: at("order something"),
  price: at("for14"),
  box: at("tastes like the box"),
  years: at("for two years"),
  remember: at("and then one night"),
  kitchen: at("nonna's kitchen"),
  rosa: at("nonna rosa fed"),
  kids: at("9 kids"),
  nine: at("9", at("kids")),
  onePot: at("with 1 pot"),
  blackPot: at("1 black pot"),
  stove: at("wood stove"),
  neverYou: at("it was never you"),
  recipe: at("every recipe"),
  tenDinners: at("ten dinners"),
  coffee: at("less than a cup"),
  trick: at("the old trick"),
};

// ---------------- CÁMARA: keyframes [t, pos, look, fov]; easing cúbico + arco en los traslados largos ----------------
export type Key = { t: number; p: [number, number, number]; l: [number, number, number]; fov?: number; arc?: number };
const k = (z: number) => z + ZK;
export const KEYS: Key[] = [
  // B · match con el 7:00 que flotaba al lado del avatar: el reloj del microondas en primer plano
  { t: 2.9, p: [-0.42, 1.13, -0.6], l: [-0.2, 1.045, -1.31], fov: 30 },
  { t: 3.55, p: [-0.45, 1.13, -0.55], l: [-0.16, 1.035, -1.31], fov: 32 },
  // "...stand there with the door open": se abre a la cocina entera, la heladera abierta es la única luz
  { t: 4.9, p: [0.55, 1.45, 1.7], l: [-1.1, 1.0, -1.1], fov: 40 },
  // "Half an onion": se mete en la heladera (portal a la toma real)
  { t: 5.75, p: [-1.0, 1.15, -0.25], l: [-1.4, 1.0, -1.5], fov: 40 },
  { t: 10.3, p: [-0.95, 1.18, -0.3], l: [-1.4, 1.0, -1.5], fov: 39 },
  // "you close the door": retrocede mientras la puerta se cierra
  { t: M.close + 0.7, p: [-0.35, 1.3, 0.85], l: [-1.2, 1.0, -1.2], fov: 38 },
  // "order something for $14": el celular en la mesada
  { t: M.order + 0.45, p: [0.62, 1.22, -0.62], l: [0.78, 0.93, -1.42], fov: 34 },
  { t: 15.7, p: [0.66, 1.17, -0.75], l: [0.78, 0.93, -1.42], fov: 32 },
  // D · la mesa para dos: un plato, una silla
  { t: 19.6, p: [2.75, 1.35, 1.95], l: [1.4, 0.72, 0.45], fov: 34 },
  { t: M.remember, p: [2.35, 1.22, 1.5], l: [1.4, 0.72, 0.45], fov: 33 },
  // "remembered my nonna's kitchen": gira a la ventana... y la atraviesa
  { t: M.kitchen - 0.15, p: [0.35, 1.52, 0.1], l: [0.32, 1.52, -1.8], fov: 40 },
  { t: M.rosa - 0.2, p: [0.4, 2.1, k(2.7)], l: [-0.2, 1.15, k(-1.2)], fov: 52, arc: 0.25 },
  // "fed 9 kids, 9": hacia la mesa larga
  { t: M.nine + 0.2, p: [2.25, 1.75, k(2.9)], l: [0.8, 0.82, k(0.3)], fov: 40 },
  // "with 1 pot, 1 black pot on a wood stove": a la cocina a leña
  { t: M.blackPot - 0.05, p: [-1.75, 1.62, k(2.2)], l: [-2.6, 1.0, k(-2.1)], fov: 34 },
  { t: 31.8, p: [-1.85, 1.55, k(1.85)], l: [-2.6, 1.0, k(-2.1)], fov: 33 },
  // F · la mesa de cerca (la receta "SERVES 6")
  { t: 36.85, p: [1.25, 1.55, k(1.75)], l: [0.85, 0.78, k(0.2)], fov: 36 },
  { t: 48.6, p: [0.95, 1.38, k(1.95)], l: [0.85, 0.78, k(0.2)], fov: 34 },
  // H · sobre la olla: "Ten dinners, one pot"
  { t: 53.0, p: [-2.25, 1.95, k(-0.65)], l: [-2.6, 1.0, k(-2.15)], fov: 36 },
  { t: M.coffee - 0.4, p: [-2.0, 2.45, k(0.2)], l: [-2.6, 1.0, k(-2.15)], fov: 38 },
  // "less than a cup of coffee": se abre a la cocina entera, cálida
  { t: M.coffee + 0.9, p: [1.7, 2.2, k(2.7)], l: [-0.6, 1.1, k(-1.2)], fov: 52 },
  { t: M.trick - 0.2, p: [1.4, 2.05, k(2.5)], l: [-0.8, 1.1, k(-1.3)], fov: 50 },
  // "the old trick inside each one": a la olla otra vez (portal a la toma de Marcello revolviendo)
  { t: M.trick + 0.75, p: [-1.85, 1.5, k(0.9)], l: [-2.6, 1.05, k(-2.15)], fov: 34 },
  { t: 64.0, p: [-1.9, 1.45, k(0.7)], l: [-2.6, 1.05, k(-2.15)], fov: 33 },
  // J · después de "You will be eating": la cocina entera, cálida, donde vive Marcello (rótulo)
  { t: 71.9, p: [3.3, 2.0, k(2.6)], l: [0.0, 1.0, k(-1.0)], fov: 52 },
  { t: 76.5, p: [2.6, 1.8, k(2.2)], l: [-0.2, 1.0, k(-1.0)], fov: 48 },
  // el RESTO del video sigue en la misma cocina con la misma cámara (restkeys.ts): ni un corte en 76 s
  ...REST_KEYS.filter((q) => q.t > 76.9),
];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const kk = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), kk), l = v3(a.l).lerp(v3(b.l), kk);
  if (b.arc) p.y += Math.sin(Math.PI * kk) * b.arc * 3;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, kk) };
};
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.03, 400); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: [number, number, number]) => project(camAt(t), v3(q));
// velocidad de la cámara en píxeles de pantalla → blur de movimiento real
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};

const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  const kk = camAt(t);
  c.position.copy(kk.p); c.up.set(0, 1, 0); c.lookAt(kk.l); c.fov = kk.fov; c.near = 0.03; c.far = 400; c.updateProjectionMatrix();
  return null;
};

// ---------------- primitivas ----------------
type Tx = THREE.Texture | undefined;
type V3 = [number, number, number];
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; bump?: Tx; bs?: number; rad?: number; rot?: V3; o?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, bump, bs = 0.02, rad = 0.02, rot, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} bumpMap={bump} bumpScale={bs} transparent={o < 1} opacity={o} />
  </mesh>
);
const Cyl: React.FC<{ p: V3; r: number; r2?: number; h: number; c: string; ro?: number; m?: number; rot?: V3; seg?: number; e?: string; ei?: number; open?: boolean; o?: number }> = ({ p, r, r2, h, c, ro = 0.6, m = 0, rot, seg = 32, e, ei = 0, open, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow>
    <cylinderGeometry args={[r, r2 ?? r, h, seg, 1, open]} />
    <meshStandardMaterial color={c} roughness={ro} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} side={open ? THREE.DoubleSide : THREE.FrontSide} transparent={o < 1} opacity={o} />
  </mesh>
);

// reloj LED del microondas (CanvasTexture)
const useLed = (txt: string, color: string, glow: number) => {
  const { cv, tex } = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 256; cv.height = 96; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; return { cv, tex }; }, []);
  const g = cv.getContext("2d")!;
  g.fillStyle = "#040506"; g.fillRect(0, 0, 256, 96);
  g.font = "bold 70px 'Courier New', monospace"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = "rgba(255,255,255,0.05)"; g.fillText("8:88", 128, 52);
  g.shadowColor = color; g.shadowBlur = 20 * glow; g.globalAlpha = glow; g.fillStyle = color; g.fillText(txt, 128, 52); g.globalAlpha = 1; g.shadowBlur = 0;
  tex.needsUpdate = true;
  return tex;
};
const Led: React.FC<{ pos: V3; w: number; txt: string; color: string; glow: number }> = ({ pos, w, txt, color, glow }) => {
  const tex = useLed(txt, color, glow);
  return <mesh position={pos}><planeGeometry args={[w, w * 0.375]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>;
};

// pantalla del celular (aviso de delivery) — CanvasTexture
const usePhone = (on: number) => {
  const { cv, tex } = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 180; cv.height = 360; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; return { cv, tex }; }, []);
  const g = cv.getContext("2d")!;
  g.fillStyle = "#050608"; g.fillRect(0, 0, 180, 360);
  if (on > 0.02) {
    g.globalAlpha = on;
    const gr = g.createLinearGradient(0, 0, 0, 360); gr.addColorStop(0, "#1b2a44"); gr.addColorStop(1, "#0b1220"); g.fillStyle = gr; g.fillRect(0, 0, 180, 360);
    g.fillStyle = "#ff5a3c"; g.beginPath(); g.roundRect(18, 120, 144, 96, 14); g.fill();
    g.fillStyle = "#fff"; g.font = "bold 22px sans-serif"; g.textAlign = "center"; g.fillText("ORDER", 90, 158); g.font = "bold 34px sans-serif"; g.fillText("$14.00", 90, 198);
    g.fillStyle = "rgba(255,255,255,.5)"; g.font = "16px sans-serif"; g.fillText("7:02 PM", 90, 60);
    g.globalAlpha = 1;
  }
  tex.needsUpdate = true;
  return tex;
};

// vapor que sube (sprites deterministas)
const Steam: React.FC<{ t: number; p: V3; n?: number; amp?: number; h?: number; spread?: number; map: Tx; o?: number }> = ({ t, p, n = 40, amp = 1, h = 1.2, spread = 0.18, map, o = 1 }) => {
  if (o < 0.02) return null;
  return (
    <group position={p} userData={{ noAO: true }}>
      {Array.from({ length: n }, (_, i) => {
        const life = 2.6 + rnd(i, 1) * 1.6, ph = ((t + rnd(i, 2) * life) % life) / life;
        const x = (rnd(i, 3) - 0.5) * spread + Math.sin(t * 0.9 + i) * 0.06 * ph + ph * 0.12 * Math.sin(i);
        const z = (rnd(i, 4) - 0.5) * spread;
        const sc = (0.12 + ph * 0.55) * amp;
        return (
          <sprite key={i} position={[x, ph * h, z]} scale={[sc, sc, sc]}>
            <spriteMaterial map={map} transparent opacity={o * 0.42 * Math.sin(ph * Math.PI) * amp} depthWrite={false} color="#fff6ea" />
          </sprite>
        );
      })}
    </group>
  );
};

// cuenco de cerámica con sopa (aparece con resorte)
const Bowl: React.FC<{ p: V3; k: number; i: number; steamMap: Tx; t: number; soup?: string }> = ({ p, k: kk, i, steamMap, t, soup }) => {
  if (kk <= 0.01) return null;
  const sc = Math.min(1.15, kk);
  return (
    <group position={[p[0], p[1] + (1 - Math.min(1, kk)) * 0.5, p[2]]} scale={[sc, sc, sc]}>
      <mesh castShadow receiveShadow position={[0, 0.06, 0]}><sphereGeometry args={[0.14, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#efe6d2" roughness={0.35} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.125, 28]} /><meshStandardMaterial color={soup ?? ["#8a4a26", "#9b5a2a", "#7d4524"][i % 3]} roughness={0.45} /></mesh>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.132, 0.145, 32]} /><meshStandardMaterial color="#2f5e8c" roughness={0.4} /></mesh>
      <Steam t={t + i} p={[0, 0.05, 0]} n={8} amp={0.5} h={0.55} spread={0.08} map={steamMap} o={Math.min(1, kk)} />
    </group>
  );
};

// lo que flota en la olla según la cena (pasta corta, verdes, ñoquis, huevos en el tomate)
const PotStuff: React.FC<{ look: PotLook; t: number }> = ({ look, t }) => (
  <group position={[0, 0.327, 0]}>
    {look.pasta && Array.from({ length: 22 }, (_, i) => <mesh key={"p" + i} position={[(rnd(i, 5) - 0.5) * 0.38, 0, (rnd(i, 6) - 0.5) * 0.38]} rotation={[Math.PI / 2, 0, rnd(i, 7) * 6 + t * 0.2]}><cylinderGeometry args={[0.011, 0.011, 0.03, 10, 1, true]} /><meshStandardMaterial color="#e9c27a" roughness={0.5} side={THREE.DoubleSide} /></mesh>)}
    {look.greens && Array.from({ length: 16 }, (_, i) => <mesh key={"g" + i} position={[(rnd(i, 8) - 0.5) * 0.36, 0.002, (rnd(i, 9) - 0.5) * 0.36]} rotation={[-Math.PI / 2, 0, rnd(i, 10) * 6]}><circleGeometry args={[0.025 + rnd(i, 11) * 0.02, 5]} /><meshStandardMaterial color={i % 3 ? "#2f5a1e" : "#4f7a2a"} roughness={0.7} /></mesh>)}
    {look.gnocchi && Array.from({ length: 12 }, (_, i) => <mesh key={"n" + i} position={[(rnd(i, 12) - 0.5) * 0.34, 0.006, (rnd(i, 13) - 0.5) * 0.34]} scale={[1, 0.6, 0.8]}><sphereGeometry args={[0.024, 12, 8]} /><meshStandardMaterial color="#efdcae" roughness={0.6} /></mesh>)}
    {look.eggs && [[-0.08, -0.04], [0.09, 0.06]].map(([x, z], i) => (
      <group key={"e" + i} position={[x, 0.003, z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.07, 24]} /><meshStandardMaterial color="#f5f0e6" roughness={0.4} /></mesh>
        <mesh position={[0, 0.008, 0]} scale={[1, 0.55, 1]}><sphereGeometry args={[0.028, 16, 10]} /><meshStandardMaterial color="#f2a516" roughness={0.25} /></mesh>
      </group>
    ))}
  </group>
);

// fuego dentro de la cocina a leña (llamas emisivas que titilan)
const Fire: React.FC<{ t: number; p: V3; amt: number }> = ({ t, p, amt }) => (
  <group position={p}>
    {Array.from({ length: 9 }, (_, i) => {
      const f = 0.75 + 0.25 * Math.sin(t * (7 + i) + i * 2.1) * Math.sin(t * 3.3 + i);
      return <mesh key={i} position={[(i - 4) * 0.07, 0.06 * f, (rnd(i, 3) - 0.5) * 0.12]} scale={[0.06, 0.16 * f * amt, 0.06]}>
        <coneGeometry args={[1, 1, 8]} /><meshBasicMaterial color={i % 2 ? "#ffb347" : "#ff6a1a"} toneMapped={false} transparent opacity={0.85} />
      </mesh>;
    })}
  </group>
);

// ---------------- LA ESCENA ----------------
export const KitchenWorld: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures();
  // memoria: 0 = departamento de noche, 1 = cocina de la nonna al atardecer
  const mem = win(t, M.kitchen - 0.3, M.rosa + 0.3);
  // heladera: abierta desde el arranque, se cierra en "you close the door"
  const door = 1 - win(t, M.close + 0.1, M.close + 0.75);
  const fridgeLight = door;
  const phone = win(t, M.order, M.order + 0.25);
  const cityO = 1 - win(t, M.remember + 0.4, M.kitchen - 0.1);           // la ciudad de la ventana se apaga y aparece el resplandor cálido
  const warmWin = win(t, M.remember + 0.3, M.kitchen - 0.6);
  const nineK = (i: number) => spr3(t, M.kids + i * 0.13);
  const fire = 0.8 + 0.2 * win(t, M.stove - 0.2, M.stove + 0.3) + 0.08 * Math.sin(t * 9) * Math.sin(t * 4.3);
  const kk = camAt(t);
  const look = potLook(t);
  const bub = new THREE.Color(look.col).lerp(new THREE.Color("#fff1d6"), 0.35).getStyle();
  // desde la cena 1 se cocina PARA UNO: los otros 8 platos se van y queda uno solo, servido con la cena de turno
  const solo = win(t, CH.d1 - 1.2, CH.d1 + 0.2);
  const bowlK = (i: number) => nineK(i) * (i === 7 ? 1 : 1 - solo);

  const skyN = new THREE.Color("#070b14"), skyW = new THREE.Color("#140b06");
  const bg = skyN.clone().lerp(skyW, mem);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.55 + 0.2 * mem} threshold={0.82} exposure={0.95 + 0.15 * mem} env={0.1 + 0.12 * mem} />
      <color attach="background" args={[bg.getHex()]} />
      <fogExp2 attach="fog" args={[bg.getHex(), 0.02 * (1 - mem) + 0.012 * mem]} />
      <hemisphereLight args={[new THREE.Color("#5d7398").lerp(new THREE.Color("#ffd9ae"), mem).getHex(), new THREE.Color("#0c0f16").lerp(new THREE.Color("#3a2414"), mem).getHex(), 0.35 + 0.25 * mem]} />

      {/* ===================== SET 1 · EL DEPARTAMENTO (noche, 7 PM) ===================== */}
      <group visible={t < M.rosa + 0.6}>
        {/* luz de luna/ciudad que entra por la ventana + luz bajo alacena */}
        <directionalLight position={[0.3, 4, -6]} intensity={0.45 * (1 - mem)} color="#7f9ccc" />
        <pointLight position={[0.2, 1.75, -1.35]} intensity={0.35 * (1 - mem)} distance={2.2} color="#9fb6dd" />
        {/* piso, paredes (frente abierto), techo */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, 0, 0]} receiveShadow><planeGeometry args={[5.4, 4.2]} /><meshStandardMaterial map={tx.tile} color="#6d7278" roughness={0.45} /></mesh>
        {/* pared del fondo con el HUECO de la ventana (x 0.3 ± 0.5, y 1.55 ± 0.45) */}
        <Box p={[-1.35, 1.35, -1.8]} s={[2.3, 2.7, 0.12]} c="#c9c4ba" rad={0.005} />
        <Box p={[1.9, 1.35, -1.8]} s={[2.2, 2.7, 0.12]} c="#c9c4ba" rad={0.005} />
        <Box p={[0.3, 0.55, -1.8]} s={[1.0, 1.1, 0.12]} c="#c9c4ba" rad={0.005} />
        <Box p={[0.3, 2.35, -1.8]} s={[1.0, 0.7, 0.12]} c="#c9c4ba" rad={0.005} />
        <Box p={[-2.45, 1.35, 0]} s={[0.12, 2.7, 3.7]} c="#bdb8ae" rad={0.005} />
        <Box p={[3.0, 1.35, 0]} s={[0.12, 2.7, 3.7]} c="#bdb8ae" rad={0.005} />
        {/* marco de ventana */}
        {([[0.3, 2.0, 1.08, 0.06], [0.3, 1.1, 1.08, 0.08], [-0.2, 1.55, 0.06, 0.96], [0.8, 1.55, 0.06, 0.96], [0.3, 1.55, 0.04, 0.9]] as number[][]).map(([x, y, w, h], i) => <Box key={i} p={[x, y, -1.74]} s={[w, h, 0.06]} c="#e9e6df" rad={0.004} />)}
        {/* la ciudad de noche afuera (se apaga cuando recuerda) */}
        <group position={[0.3, 1.55, -2.6]} visible={cityO > 0.01 || warmWin * (1 - win(t, M.kitchen - 0.55, M.kitchen - 0.15)) > 0.01}>
          <mesh><planeGeometry args={[3.5, 2.4]} /><meshBasicMaterial color="#0b1424" transparent opacity={cityO} toneMapped={false} /></mesh>
          {Array.from({ length: 70 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 3.2, (rnd(i, 2) - 0.6) * 1.6, 0.01]}><planeGeometry args={[0.018, 0.026]} /><meshBasicMaterial color={rnd(i, 3) > 0.3 ? "#ffcf7a" : "#bfe0ff"} transparent opacity={cityO * (0.4 + rnd(i, 4) * 0.6)} toneMapped={false} /></mesh>)}
          {/* resplandor cálido de la memoria */}
          <mesh position={[0, 0, -0.02]}><planeGeometry args={[3.5, 2.4]} /><meshBasicMaterial color="#ffb25e" transparent opacity={warmWin * 0.8 * (1 - win(t, M.kitchen - 0.55, M.kitchen - 0.15))} toneMapped={false} /></mesh>
        </group>
        {/* mesada + bajo mesada + alacenas */}
        <Box p={[0.05, 0.45, -1.45]} s={[1.9, 0.9, 0.6]} c="#3d4148" r={0.6} />
        <Box p={[0.05, 0.92, -1.45]} s={[1.94, 0.04, 0.64]} c="#d7d4cd" r={0.25} m={0.05} />
        <Box p={[-0.55, 2.15, -1.58]} s={[0.9, 0.6, 0.34]} c="#43474e" r={0.5} />
        <Box p={[1.3, 2.15, -1.58]} s={[1.1, 0.6, 0.34]} c="#43474e" r={0.5} />
        {/* pileta con canilla y una taza sucia */}
        <Box p={[0.3, 0.9, -1.45]} s={[0.55, 0.05, 0.42]} c="#8e959c" m={0.8} r={0.25} />
        <Cyl p={[0.3, 1.08, -1.66]} r={0.015} h={0.32} c="#b8bec5" m={0.9} ro={0.2} />
        <Cyl p={[0.15, 0.95, -1.4]} r={0.04} h={0.09} c="#e9e4da" ro={0.4} />
        {/* microondas con el 7:00 */}
        <Box p={[-0.55, 1.08, -1.5]} s={[0.5, 0.28, 0.36]} c="#2c2f34" r={0.35} m={0.3} />
        <Box p={[-0.6, 1.08, -1.315]} s={[0.32, 0.2, 0.01]} c="#0d0f12" r={0.1} m={0.5} />
        <Led pos={[-0.38, 1.12, -1.31]} w={0.11} txt="7:00" color="#4dff8a" glow={0.95} />
        {/* celular en la mesada */}
        <group position={[0.78, 0.945, -1.42]} rotation={[-Math.PI / 2, 0, 0.25]}>
          <Box p={[0, 0, -0.004]} s={[0.085, 0.17, 0.01]} c="#15171a" r={0.3} m={0.4} rad={0.004} />
          <PhoneScreen on={phone} />
          {phone > 0.05 && <pointLight position={[0, 0, 0.12]} intensity={phone * 0.18} distance={0.6} color="#ff9a7a" />}
        </group>
        {/* LA HELADERA: casi vacía, la puerta se cierra en "you close the door" */}
        <group position={[-1.75, 0, -1.0]}>
          {/* carcasa HUECA (fondo, lados, techo, piso) para que se vea lo poco que hay adentro */}
          <Box p={[0.42, 0.93, -0.71]} s={[0.84, 1.86, 0.04]} c="#d9dcdf" r={0.25} m={0.25} rad={0.005} />
          <Box p={[0.02, 0.93, -0.38]} s={[0.04, 1.86, 0.7]} c="#d9dcdf" r={0.25} m={0.25} rad={0.005} />
          <Box p={[0.82, 0.93, -0.38]} s={[0.04, 1.86, 0.7]} c="#d9dcdf" r={0.25} m={0.25} rad={0.005} />
          <Box p={[0.42, 1.84, -0.38]} s={[0.84, 0.04, 0.7]} c="#d9dcdf" r={0.25} m={0.25} rad={0.005} />
          <Box p={[0.42, 0.04, -0.38]} s={[0.84, 0.08, 0.7]} c="#d9dcdf" r={0.25} m={0.25} rad={0.005} />
          <mesh position={[0.42, 0.95, -0.685]}><planeGeometry args={[0.76, 1.76]} /><meshStandardMaterial color="#e8f1f7" emissive="#d8ecff" emissiveIntensity={0.12 * fridgeLight} roughness={0.5} /></mesh>
          {[0.55, 0.95, 1.35].map((y) => <Box key={y} p={[0.42, y, -0.18]} s={[0.72, 0.012, 0.36]} c="#dfefff" r={0.05} o={0.6} rad={0.003} />)}
          {/* media cebolla con film */}
          <mesh position={[0.25, 1.0, -0.15]} rotation={[0, 0, -Math.PI / 2]} castShadow><sphereGeometry args={[0.06, 20, 14, 0, Math.PI]} /><meshStandardMaterial color="#efe7d6" roughness={0.6} side={THREE.DoubleSide} /></mesh>
          {/* un huevo */}
          <mesh position={[0.52, 0.61, -0.12]} scale={[1, 1.28, 1]} castShadow><sphereGeometry args={[0.032, 16, 12]} /><meshStandardMaterial color="#c99a6a" roughness={0.6} /></mesh>
          {/* bolsa de porotos sin abrir */}
          <Box p={[0.48, 1.44, -0.15]} s={[0.2, 0.15, 0.08]} c="#c79a6a" r={0.3} o={0.9} rad={0.02} />
          {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0.4 + rnd(i, 1) * 0.16, 1.39 + rnd(i, 2) * 0.1, -0.105]} scale={[1.4, 1, 1]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#9a5f3a" roughness={0.5} /></mesh>)}
          {/* frasco de mostaza a medias y botella de agua */}
          <Cyl p={[0.66, 1.04, -0.2]} r={0.035} h={0.1} c="#d8b43a" ro={0.35} />
          <Cyl p={[0.12, 0.66, -0.22]} r={0.03} h={0.2} c="#cfe6f2" ro={0.1} o={0.7} />
          {fridgeLight > 0.02 && <pointLight position={[0.42, 1.65, -0.3]} intensity={fridgeLight * 1.1} distance={3.2} decay={1.6} color="#dcefff" castShadow />}
          {fridgeLight > 0.02 && <pointLight position={[0.42, 1.0, 0.6]} intensity={fridgeLight * 0.5} distance={3.5} color="#cfe4ff" />}
          {/* la puerta, con bisagra a la izquierda */}
          <group position={[0.0, 0, 0.0]} rotation={[0, -door * 1.9, 0]}>
            <Box p={[0.42, 0.93, 0.03]} s={[0.84, 1.84, 0.07]} c="#e3e6e9" r={0.22} m={0.3} />
            <Box p={[0.76, 1.1, 0.09]} s={[0.03, 0.55, 0.04]} c="#9aa1a8" m={0.8} r={0.2} />
            {[0.45, 0.95, 1.4].map((y) => <Box key={y} p={[0.42, y, -0.03]} s={[0.66, 0.1, 0.08]} c="#eef4f8" r={0.3} o={0.85} />)}
          </group>
        </group>
        {/* mesa redonda para dos: un plato, una silla corrida, la otra prolija */}
        <Cyl p={[1.4, 0.72, 0.45]} r={0.48} h={0.04} c="#6b4a33" ro={0.55} seg={40} />
        <Cyl p={[1.4, 0.36, 0.45]} r={0.05} h={0.7} c="#3b2a1e" />
        <Cyl p={[1.4, 0.75, 0.62]} r={0.12} h={0.012} c="#ecebe6" ro={0.3} />
        <Box p={[1.4, 0.45, 1.05]} s={[0.42, 0.04, 0.42]} c="#5a3e2b" />
        <Box p={[1.4, 0.72, 1.24]} s={[0.42, 0.5, 0.04]} c="#5a3e2b" />
        <Box p={[1.4, 0.45, -0.12]} s={[0.42, 0.04, 0.42]} c="#5a3e2b" />
        <Box p={[1.4, 0.72, -0.31]} s={[0.42, 0.5, 0.04]} c="#5a3e2b" />
        {/* un portarretrato apagado en la mesa */}
        <Box p={[1.62, 0.83, 0.28]} s={[0.14, 0.18, 0.015]} c="#2a2520" rot={[-0.2, -0.5, 0]} rad={0.004} />
      </group>

      {/* ===================== SET 2 · LA COCINA DE PIEDRA DE LA NONNA (z = -30) ===================== */}
      <group position={[0, 0, ZK]} visible={t > M.remember}>
        {/* sol de la tarde que entra por la ventana chica + fuego + lámpara */}
        <directionalLight position={[6, 7, -6]} intensity={1.6 * mem} color="#ffc98a" castShadow
          shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0004} />
        <pointLight position={[-2.6, 0.6, -1.6]} intensity={6 * fire * mem} distance={6} color="#ff8a3a" />
        <pointLight position={[0.8, 2.3, 0.3]} intensity={3.2 * mem} distance={6} color="#ffd29a" castShadow />
        <pointLight position={[0, 2.4, 3.5]} intensity={2.2 * mem} distance={9} color="#ffcf9e" />
        {/* piso de terracota y paredes de piedra (frente abierto) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[9.4, 6]} /><meshStandardMaterial map={tx.terra} roughness={0.75} /></mesh>
        <mesh position={[0, 1.85, -2.85]} receiveShadow><planeGeometry args={[9.4, 3.7]} /><meshStandardMaterial map={tx.stone} color="#bfa98c" bumpMap={tx.stone} bumpScale={2.2} roughness={0.95} /></mesh>
        <mesh position={[-4.7, 1.85, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[6, 3.7]} /><meshStandardMaterial map={tx.stone} color="#bfa98c" bumpMap={tx.stone} bumpScale={2.2} roughness={0.95} /></mesh>
        <mesh position={[4.7, 1.85, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow><planeGeometry args={[6, 3.7]} /><meshStandardMaterial map={tx.stone} color="#bfa98c" bumpMap={tx.stone} bumpScale={2.2} roughness={0.95} /></mesh>
        {/* corte de la pared: canto grueso de piedra (maqueta) */}
        <Box p={[-4.85, 1.85, 0]} s={[0.3, 3.7, 6]} c="#7a7064" map={tx.stone} rad={0.01} />
        <Box p={[4.85, 1.85, 0]} s={[0.3, 3.7, 6]} c="#7a7064" map={tx.stone} rad={0.01} />
        {/* pared del frente (cierra la cocina: desde adentro nunca se ve el "corte" de maqueta) con la puerta de madera */}
        <mesh position={[0, 1.85, 2.98]} rotation={[0, Math.PI, 0]} receiveShadow><planeGeometry args={[9.4, 3.7]} /><meshStandardMaterial map={tx.stone} color="#bfa98c" bumpMap={tx.stone} bumpScale={2.2} roughness={0.95} /></mesh>
        <Box p={[-2.2, 1.05, 2.93]} s={[1.0, 2.1, 0.08]} c="#4a2f1c" map={tx.oak} />
        {/* techo de tablas con vigas de roble */}
        <Box p={[0, 3.72, 0]} s={[9.6, 0.08, 6]} c="#3a2618" map={tx.oak} />
        {[-3.3, -1.1, 1.1, 3.3].map((x) => <Box key={x} p={[x, 3.55, 0]} s={[0.28, 0.26, 6]} c="#5a3a22" map={tx.oak} rad={0.03} />)}
        {/* ventana chica y honda con el campo de Abruzzo al atardecer */}
        <group position={[2.6, 2.0, -2.84]}>
          <Box p={[0, 0, -0.05]} s={[1.0, 0.9, 0.1]} c="#2b1a10" />
          <mesh position={[0, 0, -0.02]}><planeGeometry args={[0.86, 0.76]} /><meshBasicMaterial color="#ffb25a" toneMapped={false} /></mesh>
          <mesh position={[0, -0.18, -0.01]}><planeGeometry args={[0.86, 0.36]} /><meshBasicMaterial color="#7d6a3a" toneMapped={false} /></mesh>
          {[[-0.43, 0], [0.43, 0]].map(([x], i) => <Box key={i} p={[x, 0, 0.04]} s={[0.06, 0.82, 0.12]} c="#4a2f1c" />)}
          <Box p={[0, 0, 0.04]} s={[0.04, 0.8, 0.06]} c="#4a2f1c" />
          <Box p={[0, -0.44, 0.12]} s={[1.1, 0.06, 0.3]} c="#857a6c" map={tx.stone} />
          {/* maceta de albahaca en el alféizar */}
          <Cyl p={[0.3, -0.36, 0.14]} r={0.07} r2={0.055} h={0.12} c="#b5603a" />
          <mesh position={[0.3, -0.25, 0.14]} castShadow><sphereGeometry args={[0.1, 12, 10]} /><meshStandardMaterial color="#3f7a2e" roughness={0.8} /></mesh>
        </group>
        {/* LA COCINA A LEÑA (cucina economica) con la olla negra */}
        <group position={[-2.6, 0, -2.15]}>
          <Box p={[0, 0.42, 0]} s={[1.35, 0.84, 0.72]} c="#1c1c1e" r={0.45} m={0.6} />
          <Box p={[0, 0.86, 0]} s={[1.42, 0.05, 0.78]} c="#2a2a2c" r={0.3} m={0.7} />
          {/* puerta del fuego con la rendija encendida */}
          <Box p={[-0.33, 0.52, 0.37]} s={[0.42, 0.3, 0.03]} c="#26262a" m={0.7} r={0.35} />
          <mesh position={[-0.33, 0.39, 0.39]}><planeGeometry args={[0.36, 0.04]} /><meshBasicMaterial color="#ffa040" toneMapped={false} /></mesh>
          <Fire t={t} p={[-0.33, 0.3, 0.2]} amt={fire} />
          {/* horno con perilla de bronce */}
          <Box p={[0.32, 0.45, 0.37]} s={[0.5, 0.42, 0.03]} c="#26262a" m={0.7} r={0.35} />
          <Box p={[0.32, 0.6, 0.4]} s={[0.3, 0.025, 0.03]} c="#b88a4a" m={0.9} r={0.25} />
          {/* caño de la estufa */}
          <Cyl p={[0.5, 2.2, -0.2]} r={0.08} h={2.7} c="#232325" m={0.6} ro={0.45} />
          {/* LA OLLA NEGRA */}
          <group position={[-0.2, 0.89, 0.0]}>
            <Cyl p={[0, 0.17, 0]} r={0.27} r2={0.24} h={0.34} c="#141416" m={0.55} ro={0.4} seg={40} open={t > 76} />
            <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.255, 36]} /><meshStandardMaterial color={look.col} roughness={0.35} /></mesh>
            {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.36, 0.325, (rnd(i, 2) - 0.5) * 0.36]}><sphereGeometry args={[0.016 + 0.008 * Math.max(0, Math.sin(t * 5 + i)), 8, 6]} /><meshStandardMaterial color={bub} roughness={0.3} /></mesh>)}
            <PotStuff look={look} t={t} />
            {[-1, 1].map((sx) => <mesh key={sx} position={[sx * 0.29, 0.26, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.05, 0.014, 8, 16, Math.PI]} /><meshStandardMaterial color="#141416" metalness={0.6} /></mesh>)}
            {/* cuchara de madera apoyada */}
            <mesh position={[0.12, 0.42, 0.05]} rotation={[0.2, 0, -0.9]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.6, 8]} /><meshStandardMaterial color="#b88a56" roughness={0.7} /></mesh>
            <Steam t={t} p={[0, 0.34, 0]} n={46} amp={1.2} h={1.5} spread={0.3} map={tx.steam} o={mem} />
          </group>
        </group>
        {/* ajos y ají colgados, riel con cobres */}
        <group position={[-1.0, 2.55, -2.78]}>
          {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[(i % 2 ? 0.05 : -0.05), -i * 0.11, 0]} castShadow><sphereGeometry args={[0.065, 12, 10]} /><meshStandardMaterial color="#efe6d6" roughness={0.7} /></mesh>)}
          {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[0.32 + (i % 2 ? 0.03 : -0.03), -i * 0.085, 0.02]} rotation={[0, 0, 0.3 * (i % 2 ? 1 : -1)]} castShadow><coneGeometry args={[0.03, 0.12, 8]} /><meshStandardMaterial color="#b3261e" roughness={0.45} /></mesh>)}
        </group>
        <Cyl p={[0.6, 2.75, -2.7]} r={0.015} h={2.2} c="#2a2a2a" m={0.8} rot={[0, 0, Math.PI / 2]} />
        {[-0.2, 0.35, 0.95, 1.45].map((x, i) => (
          <group key={i} position={[x, 2.45 - i * 0.04, -2.68]}>
            <Cyl p={[0, 0, 0]} r={0.14 + i * 0.02} h={0.05} c="#b86b3c" m={0.95} ro={0.28} rot={[Math.PI / 2, 0, 0]} />
            <Box p={[0, 0.2, 0]} s={[0.03, 0.3, 0.02]} c="#b86b3c" m={0.95} r={0.3} />
          </group>
        ))}
        {/* estante de roble con frascos (uno es el frasco de las cáscaras de queso) */}
        <group position={[4.45, 1.6, -0.8]} rotation={[0, -Math.PI / 2, 0]}>
          {[0, 0.55].map((y) => <Box key={y} p={[0, y, 0]} s={[2.0, 0.06, 0.32]} c="#5a3a22" map={tx.oak} />)}
          {Array.from({ length: 11 }, (_, i) => {
            const y = i < 6 ? 0.03 : 0.58, x = -0.85 + (i % 6) * 0.33 + (i >= 6 ? 0.16 : 0);
            const h = 0.18 + rnd(i, 2) * 0.12, col = ["#c9a14a", "#8a3a22", "#e8d9b0", "#6a7a3a", "#d8c690", "#9c6a3a"][i % 6];
            return <group key={i} position={[x, y, 0]}>
              <Cyl p={[0, h / 2 + 0.01, 0]} r={0.07} h={h * 0.9} c={col} ro={0.6} />
              <Cyl p={[0, h / 2 + 0.01, 0]} r={0.08} h={h} c="#dfeff2" ro={0.05} o={0.28} />
              <Cyl p={[0, h + 0.03, 0]} r={0.075} h={0.03} c="#8a6a4a" ro={0.5} m={0.3} />
            </group>;
          })}
        </group>
        {/* aparador de roble con platos de cerámica azul (pared izquierda) */}
        <group position={[-4.35, 0, 0.6]} rotation={[0, Math.PI / 2, 0]}>
          <Box p={[0, 0.45, 0]} s={[1.6, 0.9, 0.5]} c="#5a3a22" map={tx.oak} />
          <Box p={[0, 0.92, 0]} s={[1.66, 0.05, 0.55]} c="#6a4529" map={tx.oak} />
          <Box p={[0, 1.6, -0.18]} s={[1.6, 1.3, 0.06]} c="#4a2f1c" map={tx.oak} />
          {[1.25, 1.75].map((y) => <Box key={y} p={[0, y, -0.08]} s={[1.56, 0.04, 0.18]} c="#5a3a22" map={tx.oak} />)}
          {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-0.65 + (i % 5) * 0.32, (i < 5 ? 1.27 : 1.77) + 0.14, -0.12]} rotation={[0.18, 0, 0]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.015, 28]} /><meshStandardMaterial color={i % 2 ? "#e9e1cf" : "#2f5e8c"} roughness={0.3} /></mesh>)}
          <Cyl p={[0.5, 1.1, 0.05]} r={0.06} h={0.3} c="#3a1418" ro={0.15} />
          <Cyl p={[0.5, 1.3, 0.05]} r={0.02} h={0.12} c="#3a1418" ro={0.15} />
          <mesh position={[-0.35, 1.02, 0.05]} scale={[1.4, 0.55, 1]} castShadow><sphereGeometry args={[0.16, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#a8773e" roughness={0.9} side={THREE.DoubleSide} /></mesh>
        </group>
        {/* sillas de paja */}
        {[[-1.2, 1.25, 0.2], [2.6, 1.2, -0.3], [0.1, -0.55, 3.1]].map(([x, z, r], i) => (
          <group key={i} position={[x, 0, z]} rotation={[0, r, 0]}>
            <Box p={[0, 0.46, 0]} s={[0.44, 0.05, 0.42]} c="#c9a35a" r={0.9} />
            {[[-0.19, -0.18], [0.19, -0.18], [-0.19, 0.18], [0.19, 0.18]].map(([a, b], j) => <Box key={j} p={[a, 0.23, b]} s={[0.04, 0.46, 0.04]} c="#4a2f1c" />)}
            <Box p={[0, 0.78, 0.19]} s={[0.44, 0.6, 0.04]} c="#4a2f1c" />
          </group>
        ))}
        {/* luz de la ventana que cae al piso */}
        <mesh position={[2.0, 0.01, -1.2]} rotation={[-Math.PI / 2, 0, 0.35]}><planeGeometry args={[1.2, 2.2]} /><meshBasicMaterial color="#ffcf8a" transparent opacity={0.16 * mem} toneMapped={false} depthWrite={false} /></mesh>
        {/* LA MESA LARGA de roble con bancos; los 9 platos aparecen en "fed 9 kids" */}
        <group position={[0.8, 0, 0.3]}>
          <Box p={[0, 0.78, 0]} s={[3.3, 0.08, 1.05]} c="#6a4529" map={tx.oak} r={0.6} />
          {[[-1.5, -0.4], [1.5, -0.4], [-1.5, 0.4], [1.5, 0.4]].map(([x, z], i) => <Box key={i} p={[x, 0.38, z]} s={[0.1, 0.76, 0.1]} c="#4a2f1c" map={tx.oak} />)}
          <Box p={[0, 0.45, -0.8]} s={[3.1, 0.06, 0.32]} c="#5a3a22" map={tx.oak} />
          <Box p={[0, 0.45, 0.8]} s={[3.1, 0.06, 0.32]} c="#5a3a22" map={tx.oak} />
          {/* pan, jarra de agua, aceite */}
          <mesh position={[-0.15, 0.88, 0.05]} scale={[1.6, 0.8, 1]} castShadow><sphereGeometry args={[0.1, 18, 12]} /><meshStandardMaterial color="#c58a45" roughness={0.75} /></mesh>
          <Cyl p={[0.25, 0.92, -0.05]} r={0.07} r2={0.08} h={0.22} c="#e9e2d2" ro={0.3} />
          {[[-1.3, -0.28], [-0.9, -0.28], [-0.5, -0.28], [0.5, -0.28], [0.9, -0.28], [1.3, -0.28], [-1.1, 0.28], [0.7, 0.28], [1.25, 0.28]].map(([x, z], i) => (
            <Bowl key={i} p={[x, 0.82, z]} k={bowlK(i)} i={i} steamMap={tx.steam} t={t} soup={solo > 0.5 ? look.col : undefined} />
          ))}
        </group>
        {/* lámpara de aceite colgando sobre la mesa */}
        <group position={[0.8, 2.6, 0.3]}>
          <Cyl p={[0, 0.5, 0]} r={0.005} h={1.0} c="#222" />
          <Cyl p={[0, 0, 0]} r={0.09} r2={0.14} h={0.18} c="#b88a4a" m={0.85} ro={0.3} />
          <mesh position={[0, -0.12, 0]}><sphereGeometry args={[0.05, 12, 10]} /><meshBasicMaterial color="#ffd38a" toneMapped={false} /></mesh>
        </group>
      </group>
    </ThreeCanvas>
  );
};
// resorte local (igual que spr de lib, sin importarlo dos veces)
const spr3 = (t: number, a: number) => { const x = Math.max(0, (t - a) * 6); return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.9); };
const PhoneScreen: React.FC<{ on: number }> = ({ on }) => {
  const tex = usePhone(on);
  return <mesh position={[0, 0, 0.002]}><planeGeometry args={[0.075, 0.15]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>;
};

// marcadores 3D (para portales y rótulos)
export const PT = {
  micro: [-0.38, 1.12, -1.31] as V3,
  fridge: [-1.33, 1.0, -1.2] as V3,
  onion: [-1.5, 1.0, -1.15] as V3,
  egg: [-1.23, 0.61, -1.12] as V3,
  beans: [-1.27, 1.44, -1.15] as V3,
  phone: [0.78, 0.95, -1.42] as V3,
  counter: [0.45, 0.95, -1.3] as V3,
  table2: [1.4, 0.76, 0.45] as V3,
  window: [0.3, 1.55, -1.8] as V3,
  pot: [-2.8, 1.22, ZK - 2.15] as V3,
  table: [0.8, 0.85, ZK + 0.3] as V3,
  stove: [-2.6, 0.8, ZK - 2.15] as V3,
};
