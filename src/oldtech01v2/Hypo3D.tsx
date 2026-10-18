// Hypo3D — corte 3D de una sala con hipocausto (three.js), hecho a mano para oldtech01v2.
// La sala está cortada al frente (se ven las capas del piso en sección) y la pared del fondo tiene una ventana de corte
// que deja ver los tubuli. Gases calientes: del horno al bajo piso, entre las pilae, y suben por los tubuli.
import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame } from "remotion";
import { FPS, W, H, k01, lerp, ease, easeOut, rnd, SANS, EMBER, shadow, interp } from "./lib";

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep = [1, 1]) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
const speck = (g: CanvasRenderingContext2D, w: number, h: number, n: number, seed: number, a = 0.1) => {
  for (let i = 0; i < n; i++) { const v = rnd(i, seed); g.fillStyle = `rgba(${v > 0.5 ? "255,240,220" : "20,10,5"},${a * rnd(i, seed + 1)})`; g.fillRect(rnd(i, seed + 2) * w, rnd(i, seed + 3) * h, 1 + v * 2, 1 + v * 2); }
};
// pila: una ladrillo cuadrado por hilada, juntas de mortero claras
const pilaTex = () => canvasTex(64, 256, (g) => {
  for (let r = 0; r < 8; r++) { const v = rnd(r, 21); g.fillStyle = `rgb(${142 + v * 30 | 0},${88 + v * 18 | 0},${62 + v * 12 | 0})`; g.fillRect(0, r * 32, 64, 32); g.fillStyle = "#c9b79e"; g.fillRect(0, r * 32 + 29, 64, 3); }
  speck(g, 64, 256, 500, 5, 0.18);
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "rgba(0,0,0,.35)"); gr.addColorStop(0.5, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 256); // hollín arriba
});
// muro de ladrillo en sección (hiladas con traba)
const brickTex = (seed: number, rep: number[]) => canvasTex(256, 128, (g) => {
  g.fillStyle = "#cdbca2"; g.fillRect(0, 0, 256, 128);
  for (let r = 0; r < 8; r++) for (let c = -1; c < 5; c++) {
    const x = c * 64 + (r % 2 ? 32 : 0), v = rnd(r * 9 + c, seed);
    g.fillStyle = `rgb(${138 + v * 36 | 0},${84 + v * 22 | 0},${60 + v * 14 | 0})`; g.fillRect(x + 1.5, r * 16 + 1.5, 61, 13);
  }
  speck(g, 256, 128, 900, seed, 0.15);
}, rep);
// revoque pintado romano: zócalo rojo, banda negra, campo ocre
const frescoTex = () => canvasTex(512, 256, (g) => {
  g.fillStyle = "#d9b77f"; g.fillRect(0, 0, 512, 256);
  g.fillStyle = "#8f2a22"; g.fillRect(0, 170, 512, 86); g.fillStyle = "#1e1714"; g.fillRect(0, 162, 512, 9);
  for (let x = 0; x < 512; x += 128) { g.fillStyle = "#1e1714"; g.fillRect(x + 60, 20, 4, 140); }
  speck(g, 512, 256, 2500, 9, 0.08);
}, [3, 1]);
const mosaicTex = () => canvasTex(512, 512, (g) => {
  g.fillStyle = "#e7dfcc"; g.fillRect(0, 0, 512, 512); const s = 8;
  for (let y = 0; y < 512; y += s) for (let x = 0; x < 512; x += s) {
    const cx = (x - 256) / 256, cy = (y - 256) / 256, d = Math.max(Math.abs(cx), Math.abs(cy)), r = Math.hypot(cx, cy);
    let col = "#e7dfcc";
    if (d > 0.92) col = "#1d1b19"; else if (d > 0.86) col = "#9b2f27"; else if (d > 0.82) col = "#1d1b19";
    else if (Math.abs(r - 0.55) < 0.04) col = "#1d1b19"; else if (Math.abs(r - 0.45) < 0.025) col = "#9b2f27";
    else if (r < 0.25 && (Math.abs(cx - cy) < 0.05 || Math.abs(cx + cy) < 0.05)) col = "#1d1b19";
    const v = rnd(x * 3 + y, 7) * 16 - 8;
    g.fillStyle = "#b9ae98"; g.fillRect(x, y, s, s);
    g.fillStyle = col; g.fillRect(x + 0.8, y + 0.8, s - 1.6, s - 1.6);
    g.fillStyle = `rgba(${v > 0 ? "255,255,255" : "0,0,0"},${Math.abs(v) / 80})`; g.fillRect(x + 0.8, y + 0.8, s - 1.6, s - 1.6);
  }
}, [2, 1.15]);
const concreteTex = () => canvasTex(256, 64, (g) => { g.fillStyle = "#a59f93"; g.fillRect(0, 0, 256, 64); speck(g, 256, 64, 1400, 11, 0.35); }, [8, 1]);
const tileTex = () => canvasTex(256, 64, (g) => { g.fillStyle = "#8a5a40"; g.fillRect(0, 0, 256, 64); for (let x = 0; x < 256; x += 32) { g.fillStyle = "#c4b199"; g.fillRect(x, 0, 2, 64); } speck(g, 256, 64, 600, 13, 0.2); }, [10, 1]);
const softDot = () => canvasTex(64, 64, (g) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.35, "rgba(255,255,255,.4)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });

// ---------- medidas (1 unidad ≈ 0,3 m) ----------
export const X0 = -6, X1 = 6, Z0 = -3.4, Z1 = 3.4, PH = 0.8, WH = 4.2;
const PILAE: [number, number][] = [];
for (let x = X0 + 0.45; x < X1 - 0.2; x += 0.62) for (let z = Z0 + 0.4; z < Z1 - 0.15; z += 0.62) PILAE.push([x, z]);
const NOTCH = [X0 + 0.6, X0 + 6.2];                                // ventana de corte en la pared del fondo
const FLUES = Array.from({ length: 7 }, (_, i) => NOTCH[0] + 0.45 + i * 0.8);
const FLOOR_TOP = PH + 0.1 + 0.26 + 0.06;

// build (opcionales, 1 = terminado): pil = pilae subiendo hilada por hilada · tile = tejas que caen sobre las pilae ·
// conc = hormigón que se vuelca desde el horno · mos = mosaico · wall = pared del fondo con tubuli · ball = pelota rodando (0..1) ·
// slope = inclinación exagerada del piso hacia el horno (0..1)
export type Fase = { open: number; gas: number; flue: number; glow: number; room: number; pil?: number; tile?: number; conc?: number; mos?: number; wall?: number; ball?: number; slope?: number };
const NTX = Math.round((X1 - X0) / 0.62), NTZ = Math.round((Z1 - Z0) / 0.62);

const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3; fov: number }> = ({ pos, look, fov }) => {
  const { camera } = useThree();
  camera.position.copy(pos); camera.lookAt(look);
  const c = camera as THREE.PerspectiveCamera; if (c.fov !== fov) { c.fov = fov; c.updateProjectionMatrix(); }
  return null;
};

const NG = 900;
const Gas: React.FC<{ t: number; fz: Fase }> = ({ t, fz }) => {
  const ref = React.useRef<THREE.InstancedMesh>(null);
  const tex = useMemo(softDot, []);
  const m = useMemo(() => new THREE.Matrix4(), []), q = useMemo(() => new THREE.Quaternion(), []), col = useMemo(() => new THREE.Color(), []);
  React.useLayoutEffect(() => {
    const im = ref.current; if (!im) return;
    for (let i = 0; i < NG; i++) {
      const sp = 0.14 + rnd(i, 4) * 0.1, life = ((t * sp + rnd(i, 5)) % 1 + 1) % 1;
      const up = i % 4 === 0, fl = FLUES[i % FLUES.length];
      const zz = lerp(Z0 + 0.25, Z1 - 0.1, rnd(i, 6));
      let x, y, z, heat, s, vis;
      if (!up || life < 0.6) {
        const u = up ? life / 0.6 : life;
        x = lerp(X0 - 1.6, up ? fl : X1 - 0.2, u);
        y = 0.1 + rnd(i, 7) * 0.62 + 0.06 * Math.sin(u * 22 + i);
        z = up ? lerp(zz, Z0 + 0.12, Math.max(0, (u - 0.55) / 0.45)) : zz + 0.18 * Math.sin(u * 11 + i);
        heat = 1 - u * 0.75; s = 0.09 + u * 0.16 + rnd(i, 8) * 0.06; vis = fz.gas;
      } else {
        const u = (life - 0.6) / 0.4;
        x = fl + 0.05 * Math.sin(u * 30 + i); z = Z0 + 0.06; y = lerp(PH + 0.3, WH - 0.2, u);
        heat = 0.6 - u * 0.4; s = 0.07 + u * 0.06; vis = fz.flue;
      }
      const a = Math.sin(Math.PI * life) * vis;
      m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(s * a + 1e-4, s * a + 1e-4, s * a + 1e-4));
      im.setMatrixAt(i, m);
      col.setRGB(1, lerp(0.32, 0.78, heat), lerp(0.06, 0.32, heat)).multiplyScalar(0.35 + 0.45 * heat);
      im.setColorAt(i, col);
    }
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, NG]} frustumCulled={false} renderOrder={10}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </instancedMesh>
  );
};

// la cámara mira siempre a las partículas de frente (billboard) — se orientan las instancias a la cámara
const Billboard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { camera } = useThree(); const g = React.useRef<THREE.Group>(null);
  React.useLayoutEffect(() => { /* las partículas son planos chicos; orientar el grupo entero alcanza a esta distancia */
    g.current?.quaternion.copy(camera.quaternion);
  });
  return <group ref={g}>{children}</group>;
};

const Scene: React.FC<{ t: number; fz: Fase; cam: { pos: THREE.Vector3; look: THREE.Vector3; fov: number } }> = ({ t, fz, cam }) => {
  const tx = useMemo(() => ({ pila: pilaTex(), wall: brickTex(2, [5, 3]), side: brickTex(3, [3, 3]), fresco: frescoTex(), mos: mosaicTex(), con: concreteTex(), tile: tileTex(), base: tileTex() }), []);
  const flick = 0.85 + 0.15 * Math.sin(t * 23) * Math.sin(t * 7.3 + 1);
  const L = fz.open, warm = fz.room;
  const roomTint = new THREE.Color("#ffffff").lerp(new THREE.Color("#ffd2a8"), warm * 0.6);
  const hot = (x: number) => (0.25 + 0.5 * Math.max(0, Math.sin(t * 1.8 - x * 0.5))) * fz.glow;
  const lw = X1 - X0, ld = Z1 - Z0;
  return (
    <>
      <Cam {...cam} />
      <color attach="background" args={["#0c0b0d"]} />
      <hemisphereLight args={["#c9d6ea", "#3a2a20", 0.85]} />
      <directionalLight position={[8, 14, 10]} intensity={2.1} color="#fff4e6" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-bias={-0.0004} />
      <pointLight position={[X0 - 1.6, 0.45, 0.4]} intensity={30 * flick} distance={9} decay={1.6} color="#ff7a2a" />
      {[-3.5, -0.5, 2.5].map((x, i) => <pointLight key={i} position={[x, 0.35, 0.5]} intensity={7 * fz.glow * flick} distance={4.5} decay={1.7} color="#ff6a1a" />)}
      {/* sombra en el "piso del estudio" */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.32, 0]} receiveShadow><planeGeometry args={[80, 80]} /><shadowMaterial opacity={0.45} /></mesh>
      <group rotation={[0, 0, 0.07 * (fz.slope ?? 0)]} position={[0, 0, 0]}>
      {/* base de la sala */}
      <mesh position={[-1, -0.16, -0.2]} receiveShadow castShadow><boxGeometry args={[lw + 4.5, 0.32, ld + 1.2]} /><meshStandardMaterial map={tx.base} color="#9d8a78" roughness={1} /></mesh>
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[lw, ld]} /><meshStandardMaterial map={tx.tile} color="#6a4c3c" roughness={0.95} emissive="#ff4a10" emissiveIntensity={0.12 * fz.glow} /></mesh>
      {PILAE.map(([x, z], i) => {
        const pil = fz.pil ?? 1, d = ((x - X0) / lw) * 0.7 + rnd(i, 31) * 0.3;
        const hk = pil >= 1 ? 1 : Math.floor(Math.min(1, Math.max(0, (pil - d * 0.75) / 0.25)) * 8) / 8;
        if (hk <= 0) return null;
        return <mesh key={i} position={[x, (PH * hk) / 2, z]} castShadow receiveShadow>
          <boxGeometry args={[0.26, PH * hk, 0.26]} />
          <meshStandardMaterial map={tx.pila} roughness={0.9} emissive="#ff4a10" emissiveIntensity={hot(x) * 0.22} />
        </mesh>;
      })}
      {/* suspensura (sección visible al frente): tejas · hormigón · mosaico */}
      {(fz.tile ?? 1) >= 1 ? <mesh position={[0, PH + 0.05 + L * 1.1, 0]} castShadow receiveShadow><boxGeometry args={[lw, 0.1, ld]} /><meshStandardMaterial map={tx.tile} color="#c78a68" roughness={0.9} /></mesh>
        : Array.from({ length: NTX * NTZ }, (_, n) => {
          const ix = n % NTX, iz = Math.floor(n / NTX), d = (ix / NTX) * 0.75 + rnd(n, 41) * 0.25;
          const k = easeOut(Math.min(1, Math.max(0, ((fz.tile ?? 1) - d * 0.8) / 0.2))); if (k <= 0) return null;
          const tw = lw / NTX, td = ld / NTZ;
          return <mesh key={n} position={[X0 + tw * (ix + 0.5), PH + 0.05 + (1 - k) * 1.6, Z0 + td * (iz + 0.5)]} rotation={[0, (1 - k) * 0.6 * (rnd(n, 42) - 0.5), 0]} castShadow receiveShadow>
            <boxGeometry args={[tw - 0.03, 0.1, td - 0.03]} /><meshStandardMaterial color={`hsl(18, ${38 + rnd(n, 43) * 10}%, ${50 + rnd(n, 44) * 8}%)`} roughness={0.9} /></mesh>;
        })}
      {(fz.conc ?? 1) > 0 && <mesh position={[X0 + (lw * (fz.conc ?? 1)) / 2, PH + 0.23 + L * 2.2, 0]} castShadow receiveShadow><boxGeometry args={[lw * (fz.conc ?? 1), 0.26, ld]} /><meshStandardMaterial map={tx.con} roughness={1} /></mesh>}
      {(fz.mos ?? 1) > 0 && <mesh position={[X1 - (lw * (fz.mos ?? 1)) / 2, PH + 0.39 + L * 3.3, 0]} scale={[fz.mos ?? 1, 1, 1]} castShadow receiveShadow>
        <boxGeometry args={[lw, 0.06, ld]} />
        {[0, 1, 2, 3, 4, 5].map((n) => n === 2
          ? <meshStandardMaterial key={n} attach={`material-${n}`} map={tx.mos} roughness={0.5} color={roomTint} emissive="#ff6a2a" emissiveIntensity={0.18 * warm} />
          : <meshStandardMaterial key={n} attach={`material-${n}`} color="#d9cfbb" roughness={0.8} />)}
      </mesh>}
      {/* pared del fondo: revoque pintado con una ventana de corte que muestra los tubuli */}
      <group position={[0, 0, Z0]} scale={[1, Math.max(0.001, fz.wall ?? 1), 1]} visible={(fz.wall ?? 1) > 0}>
        <mesh position={[0, WH / 2, -0.32]} castShadow receiveShadow><boxGeometry args={[lw + 0.6, WH, 0.36]} /><meshStandardMaterial map={tx.wall} roughness={0.95} /></mesh>
        {/* revoque: a la derecha de la ventana y por encima/debajo de ella */}
        <mesh position={[(NOTCH[1] + X1) / 2, FLOOR_TOP + (WH - FLOOR_TOP) / 2, -0.06]} receiveShadow><boxGeometry args={[X1 - NOTCH[1], WH - FLOOR_TOP, 0.16]} /><meshStandardMaterial map={tx.fresco} color={roomTint} roughness={0.9} emissive="#ff6a2a" emissiveIntensity={0.15 * warm} /></mesh>
        <mesh position={[(X0 + NOTCH[0]) / 2, FLOOR_TOP + (WH - FLOOR_TOP) / 2, -0.06]} receiveShadow><boxGeometry args={[NOTCH[0] - X0, WH - FLOOR_TOP, 0.16]} /><meshStandardMaterial map={tx.fresco} color={roomTint} roughness={0.9} emissive="#ff6a2a" emissiveIntensity={0.15 * warm} /></mesh>
        {FLUES.map((x, i) => (
          <group key={i}>
            <mesh position={[x, (FLOOR_TOP - 0.2 + WH - 0.25) / 2, -0.12]} castShadow><boxGeometry args={[0.5, WH - FLOOR_TOP - 0.05, 0.08]} /><meshStandardMaterial color="#a8694a" roughness={0.9} /></mesh>
            <mesh position={[x, (FLOOR_TOP - 0.2 + WH - 0.25) / 2, -0.04]}><boxGeometry args={[0.36, WH - FLOOR_TOP - 0.05, 0.02]} /><meshStandardMaterial color="#2a1610" emissive="#ff5a18" emissiveIntensity={(0.2 + 0.8 * fz.flue) * (0.55 + 0.45 * Math.sin(t * 2.6 + i)) * 0.9} /></mesh>
            {[-0.25, 0.25].map((dx, j) => <mesh key={j} position={[x + dx, (FLOOR_TOP - 0.2 + WH - 0.25) / 2, 0.0]} castShadow><boxGeometry args={[0.07, WH - FLOOR_TOP - 0.05, 0.16]} /><meshStandardMaterial color="#b27455" roughness={0.9} /></mesh>)}
          </group>
        ))}
        {/* borde del corte (revoque cortado) */}
        <mesh position={[(NOTCH[0] + NOTCH[1]) / 2, WH - 0.1, -0.06]}><boxGeometry args={[NOTCH[1] - NOTCH[0], 0.2, 0.16]} /><meshStandardMaterial map={tx.fresco} roughness={0.9} /></mesh>
      </group>
      {/* pared izquierda con el paso del horno */}
      <mesh position={[X0 - 0.2, WH / 2, -0.2]} castShadow receiveShadow><boxGeometry args={[0.4, WH, ld + 0.8]} /><meshStandardMaterial map={tx.side} roughness={0.95} /></mesh>
      {/* praefurnium: bóveda de ladrillo afuera, con fuego */}
      <mesh position={[X0 - 1.6, 0.55, 0.4]} castShadow receiveShadow><boxGeometry args={[2.4, 1.1, 1.3]} /><meshStandardMaterial map={tx.side} roughness={0.9} /></mesh>
      <mesh position={[X0 - 1.6, 0.42, 1.06]}><planeGeometry args={[1.6, 0.6]} /><meshBasicMaterial color="#1a0702" /></mesh>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const h = 0.22 + 0.2 * Math.abs(Math.sin(t * (6 + i) + i * 2));
        return <mesh key={i} position={[X0 - 2.2 + i * 0.2, 0.14 + h / 2, 1.08]}><coneGeometry args={[0.1, h, 8]} /><meshBasicMaterial color={i % 2 ? "#ffc067" : "#ff6a14"} toneMapped={false} transparent opacity={0.9} /></mesh>;
      })}
      {fz.ball != null && fz.ball > 0 && fz.ball < 1 && (() => {
        const u = ease(fz.ball), bx = lerp(X1 - 0.8, X0 + 0.25, u);
        return <mesh position={[bx, 0.16, 1.6]} rotation={[0, 0, u * 34]} castShadow><sphereGeometry args={[0.16, 24, 16]} /><meshStandardMaterial color="#b8673f" roughness={0.7} /></mesh>;
      })()}
      </group>
      <Gas t={t} fz={fz} />
    </>
  );
};

export type HypoKey = { at: number; pos: [number, number, number]; look: [number, number, number]; fov?: number };
export type HypoDim = { at: number; out?: number; a: [number, number, number]; b: [number, number, number]; text: string };
export type HypoLabel = { at: number; out?: number; x: number; y: number; z: number; text: string; sub?: string; side?: "l" | "r" };
export const Hypo3D: React.FC<{ t0: number; keys: HypoKey[]; fase: (t: number) => Fase; labels?: HypoLabel[]; dims?: HypoDim[]; title?: string; titleAt?: number }> = ({ t0, keys, fase, labels = [], dims = [], title, titleAt = 0.3 }) => {
  const f = useCurrentFrame(), t = f / FPS - t0;
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1].at) i++;
  const A = keys[i], B = keys[Math.min(i + 1, keys.length - 1)];
  const u = ease(k01(t, A.at, B.at));
  const pos = new THREE.Vector3(...A.pos.map((v, n) => lerp(v, B.pos[n], u)) as [number, number, number]);
  const look = new THREE.Vector3(...A.look.map((v, n) => lerp(v, B.look[n], u)) as [number, number, number]);
  const fov = lerp(A.fov ?? 40, B.fov ?? 40, u);
  const fz = fase(t);
  const cam = useMemo(() => new THREE.PerspectiveCamera(40, W / H, 0.1, 200), []);
  cam.fov = fov; cam.position.copy(pos); cam.lookAt(look); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, #1d1a1c, #070607 75%)" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }} camera={{ fov: 40, position: [0, 6, 12], near: 0.05, far: 200 }}>
        <Scene t={t} fz={fz} cam={{ pos, look, fov }} />
      </ThreeCanvas>
      {labels.map((l, n) => {
        const a = interp(t, [l.at, l.at + 0.35, (l.out ?? 99) - 0.3, l.out ?? 99], [0, 1, 1, 0]);
        if (a <= 0) return null;
        const p = new THREE.Vector3(l.x, l.y, l.z).project(cam);
        const sx = (p.x * 0.5 + 0.5) * W, sy = (-p.y * 0.5 + 0.5) * H, r = l.side !== "l";
        const len = 120 * easeOut(k01(t, l.at, l.at + 0.45));
        return (
          <div key={n} style={{ position: "absolute", left: sx, top: sy, opacity: a }}>
            <div style={{ position: "absolute", left: -8, top: -8, width: 16, height: 16, borderRadius: 8, border: "3px solid #fff", background: EMBER, boxShadow: `0 0 18px ${EMBER}` }} />
            <div style={{ position: "absolute", top: -1, [r ? "left" : "right"]: 10, width: len, height: 2, background: "#fff", boxShadow: shadow }} />
            <div style={{ position: "absolute", top: -28, [r ? "left" : "right"]: 10 + len + 14, whiteSpace: "nowrap", textAlign: r ? "left" : "right", color: "#fff", textShadow: shadow }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 4 }}>{l.text}</div>
              {l.sub && <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 28, opacity: 0.92, marginTop: 2 }}>{l.sub}</div>}
            </div>
          </div>
        );
      })}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {dims.map((d, n) => {
          const a = interp(t, [d.at, d.at + 0.3, (d.out ?? 99) - 0.3, d.out ?? 99], [0, 1, 1, 0]); if (a <= 0) return null;
          const P = (v: [number, number, number]) => { const p = new THREE.Vector3(...v).project(cam); return [(p.x * 0.5 + 0.5) * W, (-p.y * 0.5 + 0.5) * H]; };
          const [x0, y0] = P(d.a), [x1, y1] = P(d.b), g = easeOut(k01(t, d.at, d.at + 0.5));
          const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, ex = lerp(mx, x0, g), ey = lerp(my, y0, g), fx = lerp(mx, x1, g), fy = lerp(my, y1, g);
          const ang = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(ang) * 12, ny = Math.cos(ang) * 12;
          return <g key={n} opacity={a} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.8))" }}>
            <line x1={ex} y1={ey} x2={fx} y2={fy} stroke="#fff" strokeWidth={3} />
            <line x1={ex - nx} y1={ey - ny} x2={ex + nx} y2={ey + ny} stroke="#fff" strokeWidth={3} />
            <line x1={fx - nx} y1={fy - ny} x2={fx + nx} y2={fy + ny} stroke="#fff" strokeWidth={3} />
            <text x={mx + nx * 3.2} y={my + ny * 3.2 + 12} textAnchor="middle" fill="#fff" fontFamily={SANS} fontWeight={800} fontSize={38} letterSpacing={3} opacity={k01(t, d.at + 0.3, d.at + 0.6)}>{d.text}</text>
          </g>;
        })}
      </svg>
      {title && (() => {
        const a = interp(t, [titleAt, titleAt + 0.4], [0, 1]);
        return <div style={{ position: "absolute", left: 120, top: 190, opacity: a, color: "#fff", textShadow: shadow, fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 9 }}>
          <span style={{ color: EMBER }}>■ </span>{title}</div>;
      })()}
    </div>
  );
};
export { Billboard };
