// ole29e · EL MUNDO: la cocina del campamento maderero de Ole, en pleno invierno de Minnesota, en corte (le falta la pared del frente).
// Atrás a la derecha la COCINA A LEÑA de hierro con la olla de porotos humeando y la cafetera; adelante a la izquierda la MESA LARGA
// de tablones con los platos de lata; atrás a la izquierda la ventana con nieve y pinos; el farol colgado de la viga; el estante con
// los libros de Ole; la bolsa de porotos, el barril y la leña. UNA escena y UNA cámara (KEYS en tl.ts). Render SÓLO en el farm.
// Luces SIEMPRE montadas (rampa de intensidad, nunca `cond && <Light>`), fuego ≤2 Hz, sin Math.random.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { KEYS, ST } from "./tl";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V = [number, number, number];

// ---------------- medidas ----------------
export const RANGE: V = [1.5, 0, -2.2];           // la cocina a leña (base en el piso)
const RW = 1.35, RH = 0.8, RD = 0.75;
export const POT: V = [1.32, RH, -2.18];          // la olla de porotos sobre la plancha
export const TABLE: V = [-1.25, 0, 0.15];
const TW = 3.3, TD = 0.92, TH = 0.78;
export const LANTERN: V = [-1.2, 2.15, 0.15];
export const WINDOW: V = [-1.8, 1.62, -2.98];

// ---------------- CÁMARA ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  // viaje en curva: el punto de cámara se abre de costado y sube un poco en el medio del viaje (nunca recto)
  const side = Math.sin(Math.PI * k) * (b.arc ?? 0) * 6;
  p.x += side; if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  p.x += Math.sin(t * 0.53) * 0.012; p.y += Math.sin(t * 0.71 + 1) * 0.008;
  return { p, l, fov: lerp(a.fov ?? 40, b.fov ?? 40, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.02, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.02; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useCookTex = () => useMemo(() => ({
  // troncos apilados (pared): bandas redondeadas con corteza y la junta de barro
  logs: mk(512, 512, (g) => {
    for (let r = 0; r < 8; r++) {
      const y = r * 64, gr = g.createLinearGradient(0, y, 0, y + 64);
      gr.addColorStop(0, "#3d2817"); gr.addColorStop(0.18, "#7a5434"); gr.addColorStop(0.5, "#8e6640"); gr.addColorStop(0.85, "#5a3b22"); gr.addColorStop(1, "#2a1b10");
      g.fillStyle = gr; g.fillRect(0, y, 512, 64);
      for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(40,25,12,${0.2 + rnd(r * 40 + i, 1) * 0.3})`; g.lineWidth = 1 + rnd(i, 2) * 2; g.beginPath(); const x = rnd(r * 40 + i, 3) * 512; g.moveTo(x, y + 8 + rnd(i, 4) * 10); g.lineTo(x + 30 + rnd(i, 5) * 80, y + 10 + rnd(i, 6) * 44); g.stroke(); }
      g.fillStyle = "rgba(170,150,115,.55)"; g.fillRect(0, y + 60, 512, 4);
    }
  }, [2, 1]),
  // piso de tablones gastados
  floor: mk(512, 512, (g) => {
    for (let r = 0; r < 8; r++) { const c = 80 + rnd(r, 1) * 26; g.fillStyle = `rgb(${c},${c * 0.68},${c * 0.44})`; g.fillRect(0, r * 64, 512, 64); g.fillStyle = "rgba(0,0,0,.45)"; g.fillRect(0, r * 64 + 62, 512, 2);
      for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(30,18,8,${0.15 + rnd(r * 30 + i, 2) * 0.2})`; g.fillRect(rnd(r * 30 + i, 3) * 512, r * 64 + rnd(i, 4) * 60, 40 + rnd(i, 5) * 120, 1.5); } }
    for (let i = 0; i < 10; i++) { const gr = g.createRadialGradient(0, 0, 0, 0, 0, 50); gr.addColorStop(0, "rgba(20,12,6,.35)"); gr.addColorStop(1, "rgba(20,12,6,0)"); g.save(); g.translate(rnd(i, 6) * 512, rnd(i, 7) * 512); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 50, 0, 6.3); g.fill(); g.restore(); }
  }, [3, 2]),
  // hierro fundido de la cocina (negro con hollín y brillo gastado)
  iron: mk(256, 256, (g) => {
    g.fillStyle = "#1c1b1d"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1600; i++) { const v = 20 + rnd(i, 1) * 30; g.fillStyle = `rgba(${v},${v},${v + 2},.6)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); }
    for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(110,60,30,${0.08 + rnd(i, 4) * 0.12})`; g.beginPath(); g.arc(rnd(i, 5) * 256, rnd(i, 6) * 256, 4 + rnd(i, 7) * 14, 0, 6.3); g.fill(); }
  }),
  // tablones de la mesa (más claros, con vetas)
  plank: mk(512, 128, (g) => {
    for (let r = 0; r < 4; r++) { const c = 140 + rnd(r, 9) * 30; g.fillStyle = `rgb(${c},${c * 0.75},${c * 0.5})`; g.fillRect(0, r * 32, 512, 32); g.fillStyle = "rgba(0,0,0,.4)"; g.fillRect(0, r * 32 + 31, 512, 1.5);
      for (let i = 0; i < 18; i++) { g.strokeStyle = `rgba(80,50,25,${0.2 + rnd(r * 18 + i, 1) * 0.25})`; g.lineWidth = 1; g.beginPath(); const y = r * 32 + 4 + rnd(r * 18 + i, 2) * 24; g.moveTo(0, y); g.bezierCurveTo(170, y + 4, 340, y - 4, 512, y + 2); g.stroke(); } }
  }, [2, 1]),
  // tela de arpillera (bolsa de porotos)
  burlap: mk(128, 128, (g) => { g.fillStyle = "#b39566"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 128; i += 4) { g.fillStyle = "rgba(90,70,40,.35)"; g.fillRect(i, 0, 1.5, 128); g.fillRect(0, i, 128, 1.5); } }, [2, 2]),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; map?: Tx; rad?: number; rot?: V }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, map, rad = 0.02, rot }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; h: number; c: string; rough?: number; m?: number; rot?: V; e?: string; ei?: number; seg?: number; r2?: number; map?: Tx }> = ({ p, r, h, c, rough = 0.6, m = 0, rot, e, ei = 0, seg = 28, r2, map }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
const Dots: React.FC<{ pts: [number, number, number, number][]; col: string; size: number; glow: THREE.Texture; add?: boolean }> = ({ pts, col, size, glow, add = true }) => {
  const g = useMemo(() => {
    const geo = new THREE.BufferGeometry(), c = new THREE.Color(col);
    const pos = new Float32Array(pts.length * 3), cc = new Float32Array(pts.length * 3);
    pts.forEach(([x, y, z, o], i) => { pos.set([x, y, z], i * 3); cc.set([c.r * o, c.g * o, c.b * o], i * 3); });
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.BufferAttribute(cc, 3));
    return geo;
  }, [pts, col]);
  return <points geometry={g}><pointsMaterial map={glow} size={size} sizeAttenuation vertexColors transparent depthWrite={false} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} toneMapped={false} /></points>;
};
// vapor que sube enroscado (de la olla y de la cafetera)
const Steam: React.FC<{ t: number; at: V; amt: number; glow: THREE.Texture; n?: number; hgt?: number }> = ({ t, at, amt, glow, n = 26, hgt = 1.1 }) => {
  const pts = Array.from({ length: n }, (_, i) => {
    const ph = (t * (0.16 + rnd(i, 1) * 0.1) + rnd(i, 2)) % 1;
    return [at[0] + Math.sin(ph * 5 + i) * 0.07 * (0.4 + ph) + (rnd(i, 3) - 0.5) * 0.06, at[1] + ph * hgt, at[2] + Math.cos(ph * 4 + i) * 0.05 * (0.4 + ph), amt * Math.sin(ph * Math.PI) * 0.55] as [number, number, number, number];
  });
  return <Dots pts={pts} col="#e9eef4" size={0.22} glow={glow} />;
};
// nieve que cae afuera (detrás de la ventana y por el frente abierto)
const Snow: React.FC<{ t: number; glow: THREE.Texture }> = ({ t, glow }) => {
  const pts = Array.from({ length: 240 }, (_, i) => {
    const x = (rnd(i, 1) - 0.5) * 26, z = rnd(i, 2) < 0.55 ? 3.6 + rnd(i, 3) * 12 : -3.4 - rnd(i, 3) * 7;
    const y = 6 - ((t * (0.3 + rnd(i, 4) * 0.25) + rnd(i, 5) * 6) % 6.2);
    return [x + Math.sin(t * 0.7 + i) * 0.15, y, z, 0.8] as [number, number, number, number];
  });
  return <Dots pts={pts} col="#e4ecff" size={0.08} glow={glow} />;
};
// llamas dentro del hogar (ritmo lento: cada lengua tarda ≥0,7 s en subir → <1,5 Hz) y brasas
const Fire: React.FC<{ t: number; on: number; glow: THREE.Texture }> = ({ t, on, glow }) => <group>
  {Array.from({ length: 12 }, (_, i) => {
    const ph = (t * (0.7 + rnd(i, 1) * 0.6) + rnd(i, 2)) % 1;
    return <sprite key={i} position={[(rnd(i, 3) - 0.5) * 0.3, 0.02 + ph * 0.16, (rnd(i, 4) - 0.5) * 0.12]} scale={[0.15 * (1 - ph * 0.6), 0.2 * (1 - ph * 0.5), 1]}>
      <spriteMaterial map={glow} color={ph < 0.4 ? "#ffd27a" : "#ff6a1f"} transparent opacity={on * (1 - ph) * 0.95} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>;
  })}
  {Array.from({ length: 10 }, (_, i) => <mesh key={"b" + i} position={[(rnd(i, 7) - 0.5) * 0.3, 0.0, (rnd(i, 8) - 0.5) * 0.12]}><sphereGeometry args={[0.02 + rnd(i, 9) * 0.02, 8, 6]} /><meshBasicMaterial color={new THREE.Color("#3a0d04").lerp(new THREE.Color("#ff7a1a"), on * (0.65 + 0.35 * Math.sin(t * 1.6 + i)))} toneMapped={false} /></mesh>)}
</group>;
// pino de afuera (tres conos)
const Pine: React.FC<{ p: V; s: number }> = ({ p, s }) => <group position={p} scale={s}>
  <Cyl p={[0, 0.3, 0]} r={0.08} h={0.6} c="#3a2a1c" />
  {[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.9 + i * 0.7, 0]} castShadow><coneGeometry args={[0.9 - i * 0.22, 1.3, 10]} /><meshStandardMaterial color={i === 2 ? "#dfe8f2" : "#1f3a2c"} roughness={0.9} /></mesh>)}
</group>;

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures(), ct = useCookTex();
  const s = ST(t);
  // parpadeo del fuego lento (0,2-0,35 Hz combinados): nada de destellos
  const fireL = s.fire * (0.92 + 0.08 * Math.sin(t * 2.1) * Math.sin(t * 1.3 + 0.7));
  const lampL = s.lamp * (0.96 + 0.04 * Math.sin(t * 1.7));
  const RT = RANGE[2] + RD / 2;   // frente de la cocina
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.55} threshold={0.97} exposure={1.25 + 0.2 * s.dawn} env={0.5} />
      <color attach="background" args={[new THREE.Color("#0c1522").lerp(new THREE.Color("#5d7594"), s.dawn).getStyle()]} />
      <fogExp2 attach="fog" args={["#0d1726", 0.028]} />
      <hemisphereLight args={[0x7a92c4, 0x3a2a1c, 0.9 + 0.5 * s.dawn]} />
      {/* luz fría de invierno por el frente abierto y la ventana */}
      <directionalLight position={[-8, 11, 12]} intensity={0.7} color="#a8bfff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[0, 2.6, 3.2]} intensity={1.6} distance={12} color="#9fb8ff" />
      <Snow t={t} glow={tx.flake} />

      {/* afuera: nieve y pinos (se ven por la ventana y por el frente) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow><planeGeometry args={[120, 120]} /><meshStandardMaterial color="#cdd8ea" roughness={0.95} /></mesh>
      {Array.from({ length: 9 }, (_, i) => <Pine key={i} p={[-9 + i * 2.3 + rnd(i, 1), 0, -6 - rnd(i, 2) * 4]} s={1.1 + rnd(i, 3) * 0.7} />)}
      {Array.from({ length: 6 }, (_, i) => <Pine key={"f" + i} p={[-10 + i * 4 + rnd(i, 4) * 2, 0, 9 + rnd(i, 5) * 4]} s={1.2 + rnd(i, 6) * 0.6} />)}

      {/* ===== LA COCINA DE TRONCOS (frente abierto en z=+3) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow><planeGeometry args={[10, 6]} /><meshStandardMaterial map={ct.floor} color="#a08a70" roughness={0.88} /></mesh>
      {/* pared del fondo con el hueco de la ventana */}
      <Box p={[-3.95, 1.5, -3.05]} s={[2.1, 3.0, 0.16]} c="#b09070" map={ct.logs} r={0.9} rad={0.01} />
      <Box p={[1.85, 1.5, -3.05]} s={[6.3, 3.0, 0.16]} c="#b09070" map={ct.logs} r={0.9} rad={0.01} />
      <Box p={[-1.8, 0.55, -3.05]} s={[1.5, 1.1, 0.16]} c="#b09070" map={ct.logs} r={0.9} rad={0.01} />
      <Box p={[-1.8, 2.6, -3.05]} s={[1.5, 0.8, 0.16]} c="#b09070" map={ct.logs} r={0.9} rad={0.01} />
      <Box p={[-5.05, 1.5, 0]} s={[0.16, 3.0, 6.2]} c="#a88868" map={ct.logs} r={0.9} rad={0.01} />
      <Box p={[5.05, 1.5, 0]} s={[0.16, 3.0, 6.2]} c="#a88868" map={ct.logs} r={0.9} rad={0.01} />
      <Box p={[0, 3.05, -1.4]} s={[10.3, 0.1, 3.6]} c="#4d3826" r={0.9} rad={0.01} />
      {[-4, -2, 0, 2, 4].map((x) => <Cyl key={x} p={[x, 2.9, 0]} r={0.09} h={6.1} c="#5a3f28" rough={0.9} rot={[Math.PI / 2, 0, 0]} />)}

      {/* LA VENTANA: noche azul o amanecer, con escarcha en las esquinas */}
      <group position={WINDOW}>
        <Box p={[0, 0, 0]} s={[1.5, 1.0, 0.1]} c="#3a2a1c" r={0.85} rad={0.01} />
        <mesh position={[0, 0, 0.055]}><planeGeometry args={[1.36, 0.88]} /><meshBasicMaterial color={new THREE.Color("#4a6ea8").lerp(new THREE.Color("#d5e2f3"), s.dawn).getStyle()} transparent opacity={0.4} toneMapped={false} /></mesh>
        <Box p={[0, 0, 0.07]} s={[0.04, 0.88, 0.03]} c="#3a2a1c" r={0.8} rad={0.005} />
        <Box p={[0, 0, 0.07]} s={[1.36, 0.04, 0.03]} c="#3a2a1c" r={0.8} rad={0.005} />
        <Box p={[0, -0.52, 0.12]} s={[1.6, 0.05, 0.2]} c="#4a3624" r={0.85} rad={0.01} />
        <pointLight position={[0, 0, 0.7]} intensity={0.8 + 0.6 * s.dawn} distance={4} color="#a8c0ff" />
      </group>

      {/* ===== LA COCINA A LEÑA DE HIERRO ===== */}
      <group position={RANGE}>
        <Box p={[0, RH / 2 + 0.08, 0]} s={[RW, RH - 0.16, RD]} c="#ffffff" map={ct.iron} r={0.5} m={0.55} rad={0.03} />
        <Box p={[0, RH - 0.03, 0]} s={[RW + 0.08, 0.06, RD + 0.06]} c="#2a2a2d" r={0.35} m={0.75} rad={0.012} />
        {/* patas */}
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <Cyl key={i} p={[a * (RW / 2 - 0.08), 0.04, b * (RD / 2 - 0.08)]} r={0.05} r2={0.035} h={0.08} c="#1a1a1c" m={0.7} rough={0.4} />)}
        {/* la puerta del hogar (izquierda) con la rendija encendida */}
        <Box p={[-0.38, 0.45, RD / 2 + 0.01]} s={[0.42, 0.3, 0.03]} c="#222224" r={0.45} m={0.7} rad={0.01} />
        <mesh position={[-0.38, 0.33, RD / 2 + 0.03]}><planeGeometry args={[0.34, 0.035]} /><meshBasicMaterial color={new THREE.Color("#200602").lerp(new THREE.Color("#ff8a2a"), fireL)} toneMapped={false} /></mesh>
        <Box p={[-0.2, 0.47, RD / 2 + 0.04]} s={[0.05, 0.03, 0.03]} c="#9a9a9e" m={0.85} r={0.3} rad={0.008} />
        {/* el horno (derecha) con su termómetro de esfera */}
        <Box p={[0.3, 0.45, RD / 2 + 0.01]} s={[0.6, 0.48, 0.03]} c="#222224" r={0.45} m={0.7} rad={0.01} />
        <Cyl p={[0.3, 0.55, RD / 2 + 0.035]} r={0.055} h={0.015} c="#efe7d6" rough={0.5} rot={[Math.PI / 2, 0, 0]} />
        <Box p={[0.3, 0.27, RD / 2 + 0.05]} s={[0.4, 0.025, 0.025]} c="#b8b8bc" m={0.9} r={0.25} rad={0.008} />
        {/* la barra de toallas de adelante */}
        <Cyl p={[0, RH - 0.12, RD / 2 + 0.1]} r={0.012} h={RW} c="#c9c9cd" m={0.9} rough={0.25} rot={[0, 0, Math.PI / 2]} />
        {/* hornallas */}
        {[-0.4, 0.1].map((x, i) => <Cyl key={i} p={[x, RH + 0.003, -0.1]} r={0.13} h={0.008} c="#141416" m={0.6} rough={0.5} />)}
        {/* el caño del humo */}
        <Cyl p={[0.5, RH + 1.15, -0.25]} r={0.08} h={2.3} c="#202022" m={0.7} rough={0.45} />
        <group position={[-0.38, 0.3, 0.1]}><Fire t={t} on={fireL} glow={tx.flake} /></group>
      </group>
      <pointLight position={[RANGE[0] - 0.38, 0.38, RT + 0.45]} intensity={fireL * 3.2} distance={5} color="#ff8a3d" castShadow />

      {/* ===== LA OLLA DE POROTOS (hierro, con tapa y asa) + la cafetera de lata ===== */}
      <group position={POT}>
        <Cyl p={[0, 0.14, 0]} r={0.2} r2={0.18} h={0.26} c="#161618" m={0.7} rough={0.4} />
        <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.185, 0.185, 0.01, 28]} /><meshStandardMaterial color="#5a2e12" roughness={0.45} emissive="#3a1405" emissiveIntensity={0.25} /></mesh>
        <group position={[0.24 * s.lid, 0.28 + 0.12 * s.lid, 0]} rotation={[0, 0, -0.5 * s.lid]}>
          <Cyl p={[0, 0, 0]} r={0.21} h={0.025} c="#1d1d20" m={0.7} rough={0.4} />
          <Cyl p={[0, 0.03, 0]} r={0.03} h={0.04} c="#2a2a2d" m={0.7} rough={0.4} />
        </group>
        <mesh position={[0, 0.3, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.21, 0.008, 6, 32, Math.PI]} /><meshStandardMaterial color="#3a3a3e" metalness={0.85} roughness={0.35} /></mesh>
      </group>
      <Steam t={t} at={[POT[0], POT[1] + 0.32, POT[2]]} amt={s.steam} glow={tx.flake} n={30} />
      <group position={[RANGE[0] + 0.42, RH, RANGE[2] - 0.05]}>
        <Cyl p={[0, 0.13, 0]} r={0.08} r2={0.11} h={0.26} c="#9aa0a8" m={0.8} rough={0.32} />
        <Cyl p={[0, 0.28, 0]} r={0.05} r2={0.08} h={0.04} c="#8a9098" m={0.8} rough={0.32} />
        <Cyl p={[0.12, 0.17, 0]} r={0.012} r2={0.02} h={0.16} c="#9aa0a8" m={0.8} rough={0.32} rot={[0, 0, -0.9]} />
      </group>
      <Steam t={t + 3} at={[RANGE[0] + 0.58, RH + 0.26, RANGE[2] - 0.05]} amt={s.steam * 0.6} glow={tx.flake} n={12} hgt={0.6} />

      {/* leña al lado de la cocina */}
      {Array.from({ length: 12 }, (_, i) => <Cyl key={"w" + i} p={[0.2 + (i % 4) * 0.13 - Math.floor(i / 4) * 0.02, 0.07 + Math.floor(i / 4) * 0.12, -2.65]} r={0.06 + rnd(i, 1) * 0.015} h={0.5} c={rnd(i, 2) > 0.5 ? "#7a5636" : "#8e6a44"} rough={0.95} rot={[Math.PI / 2, 0, 0]} />)}

      {/* ===== LA MESA LARGA DE TABLONES, con los platos de lata y las tazas ===== */}
      <group position={TABLE}>
        <Box p={[0, TH, 0]} s={[TW, 0.06, TD]} c="#c8a47c" map={ct.plank} r={0.75} rad={0.012} />
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <Box key={i} p={[a * (TW / 2 - 0.15), TH / 2, b * (TD / 2 - 0.1)]} s={[0.08, TH, 0.08]} c="#6e4e30" r={0.9} rad={0.01} />)}
        {[-1, 1].map((b) => <Box key={b} p={[0, 0.44, b * (TD / 2 + 0.28)]} s={[TW - 0.2, 0.05, 0.26]} c="#9c7a54" map={ct.plank} r={0.8} rad={0.01} />)}
        {Array.from({ length: 8 }, (_, i) => {
          const x = -TW / 2 + 0.3 + (i % 4) * 0.9, z = i < 4 ? -0.26 : 0.26, full = cl(s.plates * 8 - i);
          return <group key={i} position={[x, TH + 0.035, z]}>
            <Cyl p={[0, 0, 0]} r={0.13} r2={0.1} h={0.018} c="#b9bec4" m={0.85} rough={0.35} />
            <mesh position={[0, 0.012, 0]} scale={[1, 0.35 * full + 0.001, 1]}><sphereGeometry args={[0.075, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#7a3b18" roughness={0.5} /></mesh>
            <Cyl p={[0.2, 0.045, 0.02]} r={0.04} h={0.09} c="#c3c8ce" m={0.8} rough={0.3} />
          </group>;
        })}
        {/* el pan de maíz en su sartén y la jarra de melaza */}
        <Cyl p={[0, TH + 0.05, 0]} r={0.17} h={0.04} c="#141416" m={0.7} rough={0.45} />
        <Cyl p={[0, TH + 0.07, 0]} r={0.15} h={0.015} c="#d7a84e" rough={0.7} />
        <Cyl p={[0.55, TH + 0.12, 0.05]} r={0.07} r2={0.09} h={0.2} c="#5b3a1e" rough={0.35} />
      </group>

      {/* EL FAROL colgado de la viga (luz siempre montada) */}
      <group position={LANTERN} rotation={[0, 0, 0.04 * Math.sin(t * 0.6)]}>
        <Cyl p={[0, 0.35, 0]} r={0.004} h={0.6} c="#333" m={0.8} />
        <Cyl p={[0, 0, 0]} r={0.07} h={0.16} c="#fff3d6" rough={0.1} e="#ffcf7a" ei={1.4 * lampL} />
        <Cyl p={[0, 0.1, 0]} r={0.08} r2={0.05} h={0.05} c="#2a2a2d" m={0.8} rough={0.35} />
        <Cyl p={[0, -0.09, 0]} r={0.085} h={0.03} c="#2a2a2d" m={0.8} rough={0.35} />
      </group>
      <pointLight position={[LANTERN[0], LANTERN[1] - 0.05, LANTERN[2]]} intensity={2.4 * lampL} distance={6} color="#ffc27a" castShadow />

      {/* el estante con los libros de Ole (pared izquierda) */}
      <group position={[-4.9, 1.4, -1.0]}>
        <Box p={[0.08, 0, 0]} s={[0.2, 0.04, 1.2]} c="#6e4e30" r={0.85} rad={0.008} />
        {["#8a2c1c", "#2f5a3a", "#c9a24a", "#3d4f7a", "#6b3a5a"].map((c, i) => <Box key={i} p={[0.1, 0.15, -0.4 + i * 0.12]} s={[0.15, 0.24 + rnd(i, 1) * 0.04, 0.09]} c={c} r={0.7} e={c} ei={0.25 * s.books} rad={0.006} />)}
        {Array.from({ length: 3 }, (_, i) => <Cyl key={"j" + i} p={[0.1, 0.12, 0.25 + i * 0.13]} r={0.05} h={0.17} c="#d7e3ea" rough={0.08} />)}
      </group>
      <pointLight position={[-4.3, 1.75, -1.0]} intensity={0.9 * s.books} distance={2} color="#ffd9a0" />

      {/* la bolsa de porotos de 100 lb, el barril y la caja */}
      <group position={[2.85, 0, -1.55]}>
        <mesh position={[0, 0.36, 0]} castShadow receiveShadow><sphereGeometry args={[0.3, 20, 14]} /><meshStandardMaterial map={ct.burlap} color="#c9ad7c" roughness={1} /></mesh>
        <Cyl p={[0, 0.2, 0]} r={0.29} r2={0.31} h={0.4} c="#c2a576" map={ct.burlap} rough={1} />
        <Cyl p={[0, 0.7, 0]} r={0.06} r2={0.15} h={0.16} c="#b39566" map={ct.burlap} rough={1} />
      </group>
      <group position={[3.7, 0, -2.35]}>
        <Cyl p={[0, 0.42, 0]} r={0.3} r2={0.27} h={0.84} c="#7a5434" rough={0.85} seg={24} />
        {[0.12, 0.42, 0.72].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.3, 0.012, 6, 32]} /><meshStandardMaterial color="#2a2a2c" metalness={0.7} roughness={0.5} /></mesh>)}
      </group>
      <Box p={[3.0, 0.15, -2.6]} s={[0.6, 0.3, 0.4]} c="#8a6a44" r={0.9} rad={0.01} />

      {/* ambiente cálido */}
      <pointLight position={[0.4, 1.9, 0.6]} intensity={0.6 + 0.8 * fireL} distance={9} color="#ffb877" />
    </ThreeCanvas>
  );
};
