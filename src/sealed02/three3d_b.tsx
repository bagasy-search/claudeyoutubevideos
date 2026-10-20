// sealed02 · escenas 3D del RESTO del video (misma vara que el minuto 1 v2: luz real, sombra, niebla, polvo, cámara viva).
// Todas reciben tiempos LOCALES en segundos (0 = arranque de su Sequence) para clavarlas a la voz desde Full.tsx.
// Sólo stills locales; el video sale del farm.
import React, { useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { C, FONT, KeyLine } from "../kits/btg/kit";

const FPS = 30, W = 1920, H = 1080;
const s = (t: number) => Math.round(t * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sm = (x: number) => x * x * (3 - 2 * x);
const e = (f: number, a: number, b: number) => sm(interpolate(f, [a, b], [0, 1], cl));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const sp = (f: number, a: number, damping = 14, mass = 1) => spring({ frame: f - a, fps: FPS, config: { damping, mass } });

const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3; fov?: number; near?: number }> = ({ pos, look, fov = 35, near = 0.01 }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  c.position.copy(pos); c.up.set(0, 1, 0); c.lookAt(look);
  c.fov = fov; c.near = near; c.far = 400; c.updateProjectionMatrix();
  return null;
};
const project = (pos: THREE.Vector3, look: THREE.Vector3, fov: number, p: THREE.Vector3) => {
  const c = new THREE.PerspectiveCamera(fov, W / H, 0.01, 400); c.position.copy(pos); c.up.set(0, 1, 0); c.lookAt(look); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = p.clone().project(c); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H, behind: v.z > 1 };
};
const useTex = (src: string) => {
  const [h] = useState(() => delayRender("tex " + src));
  const [ok, setOk] = useState(false);
  const t = useMemo(() => {
    const x = new THREE.TextureLoader().load(staticFile(src), () => { setOk(true); continueRender(h); }, undefined, () => { setOk(true); continueRender(h); });
    x.colorSpace = THREE.SRGBColorSpace; x.anisotropy = 8; return x;
  }, [src, h]);
  return ok ? t : null;
};
const extrude = (n: number, col: string, dx = 0.6, dy = 1) =>
  Array.from({ length: n }, (_, i) => `${(i + 1) * dx}px ${(i + 1) * dy}px 0 ${col}`).join(", ") + `, ${n * dx + 6}px ${n * dy + 16}px 34px rgba(0,0,0,.65)`;
const Vignette: React.FC<{ k?: number; tint?: string }> = ({ k = 0.55, tint = "0,0,0" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 48%, transparent 52%, rgba(${tint},${k}) 100%)` }} />
);
// rótulo HTML anclado a un punto 3D (con palito hasta el objeto)
const Tag: React.FC<{ q: { x: number; y: number }; o: number; text: string; dy?: number; hot?: boolean; size?: number }> = ({ q, o, text, dy = -90, hot, size = 34 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
    <div style={{ position: "absolute", left: q.x - 1, top: Math.min(q.y, q.y + dy), width: 2, height: Math.abs(dy), background: "rgba(244,239,230,.55)" }} />
    <div style={{ position: "absolute", left: q.x - 6, top: q.y - 6, width: 12, height: 12, borderRadius: 6, background: hot ? C.red : C.orange, boxShadow: `0 0 14px ${hot ? C.red : C.orange}` }} />
    <div style={{ position: "absolute", left: q.x - 400, width: 800, top: q.y + dy - size * 1.3, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 3, color: hot ? C.red : C.ink, textShadow: extrude(4, hot ? "#6a1210" : "#3a3026") }}>{text}</div>
  </div>
);
// número grande extruido que nace desde el fondo
export const Big3D: React.FC<{ a: number; text: string; y?: number; size?: number; hot?: boolean; out?: number; x?: number }> = ({ a, text, y = 400, size = 170, hot, out, x }) => {
  const f = useCurrentFrame();
  const t = sp(f, a, 13);
  const o = Math.min(1, t * 1.4) * (out !== undefined ? 1 - e(f, out, out + 8) : 1);
  return (
    <div style={{ position: "absolute", left: x ?? 0, right: x === undefined ? 0 : undefined, top: y, textAlign: x === undefined ? "center" : "left", perspective: 1000, opacity: o }}>
      <div style={{ display: "inline-block", fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 4, color: hot ? C.red : C.ink, transform: `translateZ(${(1 - t) * 640}px) rotateX(${(1 - t) * 24}deg) rotateY(${-6 + f * 0.04}deg)`, textShadow: extrude(12, hot ? "#6a1210" : "#3c352c") }}>{text}</div>
    </div>
  );
};

const Dust: React.FC<{ cx: number; cz?: number; on: number; n?: number; seed?: number; top?: number; r?: number; col?: string }> = ({ cx, cz = 0, on, n = 220, seed = 1, top = 8, r = 2.6, col = "#ffe6c2" }) => {
  const f = useCurrentFrame();
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const yy = (rnd(i, seed) * top + f * 0.004 * (0.4 + rnd(i, seed + 3))) % top;
    const rr = (1 - yy / top) * r * Math.sqrt(rnd(i, seed + 1)) + 0.1, a = rnd(i, seed + 2) * 6.283 + f * 0.003;
    p.set([cx + Math.cos(a) * rr, yy, cz + Math.sin(a) * rr * 0.8], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
  return <points geometry={geo}><pointsMaterial color={col} size={0.035} sizeAttenuation transparent opacity={0.8 * on} blending={THREE.AdditiveBlending} depthWrite={false} /></points>;
};
const SpotCone: React.FC<{ x: number; z?: number; on: number; color?: string; top?: number; r?: number; inten?: number }> = ({ x, z = 0, on, color = "#ffd6a0", top = 10, r = 3, inten = 1100 }) => {
  const tgt = useMemo(() => { const o = new THREE.Object3D(); o.position.set(x, 0, z); return o; }, [x, z]);
  return (
    <>
      <primitive object={tgt} />
      <spotLight position={[x, top, z]} target={tgt} angle={0.38} penumbra={0.7} intensity={on * inten} distance={34} decay={2} color={color} castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0005} />
      {[r, r * 0.75].map((rb, i) => (
        <mesh key={i} position={[x, top / 2, z]}><cylinderGeometry args={[0.12, rb, top, 48, 1, true]} />
          <meshBasicMaterial color={color} transparent opacity={on * (i ? 0.045 : 0.03)} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} /></mesh>
      ))}
    </>
  );
};
// bloque "almohadillado" (cara inca): forma 2D extruida con bisel redondeado
const pillow = (pts: [number, number][], depth: number, bevel = 0.06) => {
  const sh = new THREE.Shape(); pts.forEach(([x, y], i) => (i ? sh.lineTo(x, y) : sh.moveTo(x, y))); sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: bevel * 1.4, bevelSize: bevel, bevelSegments: 4, curveSegments: 2 });
  g.computeVertexNormals(); return g;
};
// achica un polígono hacia su centro (la junta queda como una línea finísima)
const shrink = (pts: [number, number][], d: number): [number, number][] => {
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  return pts.map(([x, y]) => { const dx = x - cx, dy = y - cy, L = Math.hypot(dx, dy) || 1; return [x - (dx / L) * d, y - (dy / L) * d]; });
};
const stoneCol = (i: number, base = 30, l = 0.42) => new THREE.Color().setHSL((base + rnd(i, 4) * 10) / 360, 0.1 + rnd(i, 5) * 0.08, l + rnd(i, 6) * 0.1);

// muro inca: grilla de vértices desplazados → cuadriláteros que comparten aristas EXACTAS (cero huecos)
const incaWall = (cols: number, rows: number, w: number, h: number, seed = 1) => {
  const P: [number, number][][] = [];
  for (let r = 0; r <= rows; r++) { P.push([]); for (let c = 0; c <= cols; c++) {
    const jx = c === 0 || c === cols ? 0 : (rnd(r * 31 + c, seed) - 0.5) * (w / cols) * 0.55;
    const jy = r === 0 || r === rows ? 0 : (rnd(r * 17 + c, seed + 9) - 0.5) * (h / rows) * 0.5;
    P[r].push([c * (w / cols) + jx + (r % 2) * 0, r * (h / rows) + jy]);
  } }
  const cells: [number, number][][] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    // algunas celdas se parten en diagonal o se suman puntos medios → más ángulos, como los muros reales
    const a = P[r][c], b = P[r][c + 1], cc = P[r + 1][c + 1], d = P[r + 1][c];
    cells.push([a, b, cc, d]);
  }
  return cells;
};

// ============ A. TERREMOTO: iglesia de bloques que se cae vs muro inca que tiembla y vuelve a su lugar ============
export const Quake3D: React.FC<{ d: number; shake: number[]; year?: { a: number; t: string }[]; labelsAt?: number }> = ({ d, shake, year = [], labelsAt = 0.3 }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  // intensidad del temblor (varios temblores posibles)
  const q = shake.reduce((m, a) => Math.max(m, interpolate(t, [a, a + 0.25, a + 2.2, a + 3.2], [0, 1, 0.7, 0], cl)), 0);
  const jx = Math.sin(f * 2.1) * 0.09 * q, jz = Math.cos(f * 2.7) * 0.06 * q;
  // la iglesia cae en el PRIMER temblor (después ya está en el piso)
  const fall = shake.length ? interpolate(t, [shake[0] + 0.6, shake[0] + 2.4], [0, 1], cl) : 0;
  const church = useMemo(() => {
    const out: { p: [number, number, number]; s: [number, number, number]; i: number }[] = [];
    let i = 0;
    for (let y = 0; y < 7; y++) for (let x = 0; x < 6; x++) out.push({ p: [-6.6 + x * 0.62 + (y % 2) * 0.31, 0.2 + y * 0.4, 0], s: [0.6, 0.38, 0.6], i: i++ });
    for (let y = 0; y < 5; y++) for (let x = 0; x < 2; x++) out.push({ p: [-5.4 + x * 0.62, 3.0 + y * 0.4, 0], s: [0.6, 0.38, 0.6], i: i++ }); // campanario
    return out;
  }, []);
  const wall = useMemo(() => incaWall(6, 4, 5.2, 3.0, 3).map((c) => shrink(c, 0.012)), []);
  const k = e(f, 0, s(d));
  const pos = V(lerp(-1.5, 1.2, k), lerp(3.2, 2.6, k), lerp(11.5, 10.2, k)), look = V(lerp(-1.6, -1.2, k), 1.7, 0), fov = 38;
  const lA = project(pos, look, fov, V(-4.95, 0.02, 1.0)), lB = project(pos, look, fov, V(3.3, 0.02, 1.0));
  return (
    <AbsoluteFill style={{ background: "#0b0d12" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov, position: [0, 3, 11] }}>
        <Cam pos={V(pos.x + jx * 0.6, pos.y + jz * 0.4, pos.z)} look={look} fov={fov} />
        <color attach="background" args={["#0b0d12"]} />
        <fog attach="fog" args={["#0b0d12", 12, 30]} />
        <ambientLight intensity={0.22} />
        <hemisphereLight args={["#3a4a62", "#120c08", 0.4]} />
        <directionalLight position={[-7, 10, 7]} intensity={2.4} color="#ffd9b0" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
          shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={10} shadow-camera-bottom={-6} shadow-bias={-0.0005} />
        <pointLight position={[4, 3, 5]} intensity={14} color="#8fb4ff" distance={18} />
        <group position={[jx, 0, jz]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[60, 30]} /><meshStandardMaterial color="#2a241e" roughness={1} /></mesh>
          {/* grieta en el piso durante el temblor */}
          <mesh rotation={[-Math.PI / 2, 0, 0.3]} position={[-1.2, 0.01, 1.2]}><planeGeometry args={[0.05 * q + 0.0001, 3.2 * Math.min(1, q * 2)]} /><meshBasicMaterial color="#120d09" transparent opacity={0.8} /></mesh>
          {church.map((b) => {
            const r1 = rnd(b.i, 2), r2 = rnd(b.i, 3);
            const delay = (b.p[1] / 5) * 0.5 + r1 * 0.3;
            const ff = Math.max(0, Math.min(1, (fall - delay * 0.4) / 0.6));
            const g = ff * ff;
            const y = lerp(b.p[1], 0.19 + (rnd(b.i, 5) * 0.25), g);
            const x = b.p[0] + (r1 - 0.5) * 3.2 * ff + Math.sin(f * 1.7 + b.i) * 0.03 * q * (1 - ff);
            const z = b.p[2] + (r2 - 0.2) * 2.6 * ff;
            return <mesh key={b.i} castShadow receiveShadow position={[x, y, z]} rotation={[(r2 - 0.5) * 2.4 * ff, r1 * 2 * ff, (r1 - 0.5) * 2.8 * ff]}>
              <boxGeometry args={b.s} /><meshStandardMaterial color={b.i % 3 ? "#d8cdb8" : "#cbbfa6"} roughness={0.85} /></mesh>;
          })}
          {/* techo/cúpula que se desploma */}
          <mesh castShadow position={[-5.1 + fall * 0.8, lerp(5.2, 0.5, fall * fall), fall * 1.4]} rotation={[fall * 1.2, 0, fall * 0.9]}><coneGeometry args={[0.55, 0.9, 4]} /><meshStandardMaterial color="#b55a3c" roughness={0.8} /></mesh>
          {/* muro inca: cada piedra tiembla con su fase y vuelve exactamente a su lugar */}
          <group position={[0.6, 0.02, -0.3]}>
            {wall.map((c, i) => {
              const ph = rnd(i, 7) * 6.28;
              return <mesh key={i} castShadow receiveShadow geometry={pillow(c, 0.7, 0.07)} position={[Math.sin(f * 2.3 + ph) * 0.035 * q, Math.abs(Math.sin(f * 1.9 + ph)) * 0.05 * q, Math.cos(f * 2.1 + ph) * 0.03 * q]}>
                <meshStandardMaterial color={stoneCol(i, 28, 0.4)} roughness={0.92} /></mesh>;
            })}
          </group>
        </group>
        {/* polvo que se levanta con el derrumbe */}
        <Dust cx={-4.8} cz={0.8} on={Math.min(1, fall * 2) * (1 - e(f, s(d) - 30, s(d)))} n={420} top={4} r={3.4} col="#d9c7aa" seed={4} />
      </ThreeCanvas>
      <Tag q={lA} o={e(f, s(labelsAt), s(labelsAt) + 10)} text="SPANISH CHURCH" dy={70} size={30} />
      <Tag q={lB} o={e(f, s(labelsAt) + 6, s(labelsAt) + 16)} text="INCA WALL" dy={70} size={30} hot />
      {year.map((y, i) => <Big3D key={i} a={s(y.a)} text={y.t} y={90} size={150} hot out={year[i + 1] ? s(year[i + 1].a) - 6 : undefined} />)}
      <Vignette />
    </AbsoluteFill>
  );
};

// ============ B. LA PIEDRA DE 12 ÁNGULOS: 12-gono central + 12 vecinas que encajan exacto; se cuentan los ángulos ============
const TWELVE: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 + 0.2 + (rnd(i, 3) - 0.5) * 0.28; const r = 1.0 + (rnd(i, 5) - 0.5) * 0.38; out.push([Math.cos(a) * r * 1.25, Math.sin(a) * r]); }
  return out;
})();
export const Twelve3D: React.FC<{ d: number; countAt: number; countDur?: number; explodeAt?: number; shakeAt?: number }> = ({ d, countAt, countDur = 2.2, explodeAt, shakeAt }) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const outer = TWELVE.map(([x, y], i) => { const L = Math.hypot(x, y); const k = 2.1 + rnd(i, 8) * 0.7; return [(x / L) * k * 1.3, (y / L) * k] as [number, number]; });
  const ex = explodeAt !== undefined ? interpolate(t, [explodeAt, explodeAt + 0.7, explodeAt + 2.0], [0, 1, 0], cl) : 0;
  const qk = shakeAt !== undefined ? interpolate(t, [shakeAt, shakeAt + 0.3, shakeAt + 1.8, shakeAt + 2.5], [0, 1, 0.6, 0], cl) : 0;
  const k = e(f, 0, s(d));
  const ang = lerp(-0.35, 0.3, k);
  const pos = V(Math.sin(ang) * 7.2, 0.6 + k * 0.4, Math.cos(ang) * 7.2), look = V(0, 0, 0), fov = 34;
  const n = Math.floor(interpolate(t, [countAt, countAt + countDur], [0, 12], cl));
  return (
    <AbsoluteFill style={{ background: "#07090d" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov, position: [0, 0, 7] }}>
        <Cam pos={pos} look={look} fov={fov} />
        <color attach="background" args={["#07090d"]} />
        <fog attach="fog" args={["#07090d", 7, 16]} />
        <ambientLight intensity={0.2} />
        {/* luz rasante de la tarde que barre la piedra */}
        <directionalLight position={[lerp(-6, 4, k), 5, 4]} intensity={2.6} color="#ffd8a8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} />
        <pointLight position={[3, -2, 4]} intensity={8} color="#7fa6ff" distance={14} />
        <group position={[0, 0, -0.35]}>
          <mesh castShadow receiveShadow geometry={pillow(shrink(TWELVE, 0.012), 0.7, 0.09)} position={[Math.sin(f * 2.2) * 0.04 * qk, 0, ex * 1.6]}>
            <meshStandardMaterial color="#7d7468" roughness={0.9} /></mesh>
          {TWELVE.map((p, i) => {
            const j = (i + 1) % 12, poly = shrink([p, TWELVE[j], outer[j], outer[i]], 0.012);
            const mx = (p[0] + TWELVE[j][0]) / 2, my = (p[1] + TWELVE[j][1]) / 2, L = Math.hypot(mx, my);
            const ph = rnd(i, 7) * 6.28;
            return <mesh key={i} castShadow receiveShadow geometry={pillow(poly, 0.7, 0.08)} position={[(mx / L) * ex * 0.9 + Math.sin(f * 2 + ph) * 0.04 * qk, (my / L) * ex * 0.9, Math.cos(f * 2.4 + ph) * 0.03 * qk]}>
              <meshStandardMaterial color={stoneCol(i, 30, 0.36)} roughness={0.92} /></mesh>;
          })}
        </group>
      </ThreeCanvas>
      {/* los ángulos se encienden uno por uno */}
      {TWELVE.map(([x, y], i) => {
        const q = project(pos, look, fov, V(x, y, 0.42 + ex * 1.6));
        const on = i < n ? 1 : 0;
        return <div key={i} style={{ position: "absolute", left: q.x - 11, top: q.y - 11, width: 22, height: 22, borderRadius: 11, border: `4px solid ${C.red}`, opacity: on * (1 - ex), boxShadow: `0 0 18px ${C.red}`, transform: `scale(${on ? 1 : 0.2})` }} />;
      })}
      <div style={{ position: "absolute", right: 150, top: 120, fontFamily: FONT, fontWeight: 900, fontSize: 220, color: C.red, opacity: t >= countAt ? 1 - e(f, s(countAt + countDur + 1.5), s(countAt + countDur + 2)) : 0, textShadow: extrude(12, "#6a1210"), transform: `perspective(900px) rotateY(-16deg)` }}>{n}</div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ============ C. GOLPEAR (Protzen) y PRUEBA Y ERROR: percutor que golpea, polvo; piedra que baja, sube, puntos rojos ============
export const Pound3D: React.FC<{ d: number; mode: "pound" | "fit"; marks?: { a: number; t: string }[] }> = ({ d, mode, marks = [] }) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const k = e(f, 0, s(d));
  const period = 9; // cuadros por golpe
  const ph = (f % period) / period;
  const hy = mode === "pound" ? 0.95 + Math.abs(Math.cos(ph * Math.PI)) * 1.1 : 0;
  const hit = mode === "pound" && ph < 0.12;
  const blows = Math.floor(f / period) * 37 + 120;
  // prueba y error: la piedra de arriba baja (0-1) y sube en ciclos de 2,4 s
  const cyc = (t % 2.4) / 2.4;
  const down = mode === "fit" ? (cyc < 0.35 ? sm(cyc / 0.35) : cyc < 0.55 ? 1 : 1 - sm((cyc - 0.55) / 0.3)) : 0;
  const pass = Math.floor(t / 2.4);
  const spots = mode === "fit" ? Math.max(0, 6 - pass * 2) : 0;
  const dust = useMemo(() => new THREE.BufferGeometry(), []);
  const N = 120, dp = new Float32Array(N * 3);
  const age = (f % period) / period;
  for (let i = 0; i < N; i++) { const a = rnd(i, 2) * 6.28, v = 0.3 + rnd(i, 3); dp.set([0.2 + Math.cos(a) * v * age * 1.4, 0.82 + age * v * 0.9 - age * age * 0.8, 0.3 + Math.sin(a) * v * age * 1.2], i * 3); }
  dust.setAttribute("position", new THREE.BufferAttribute(dp, 3));
  const pos = mode === "pound" ? V(lerp(2.6, 1.6, k), lerp(2.1, 1.7, k), lerp(4.4, 3.6, k)) : V(lerp(-3.6, -2.6, k), 2.7, lerp(7.6, 6.8, k));
  const look = mode === "pound" ? V(0.1, 0.8, 0) : V(0, 1.45, 0), fov = 36;
  const lowerY = mode === "fit" ? lerp(2.4, 1.32, down) : 0;
  return (
    <AbsoluteFill style={{ background: "#0a0806" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov, position: [2, 2, 4] }}>
        <Cam pos={pos} look={look} fov={fov} />
        <color attach="background" args={["#0a0806"]} />
        <fog attach="fog" args={["#0a0806", 5, 14]} />
        <ambientLight intensity={0.25} />
        <hemisphereLight args={["#ffcf9a", "#1a120c", 0.35]} />
        <directionalLight position={[-4, 6, 3]} intensity={2.8} color="#ffc98e" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} />
        <pointLight position={[3, 2, 3]} intensity={6} color="#86a8ff" distance={10} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial color="#3a2e22" roughness={1} /></mesh>
        {/* bloque de base */}
        <mesh castShadow receiveShadow geometry={pillow([[-1.4, 0], [1.3, 0], [1.45, 0.75], [0.3, 0.86], [-1.3, 0.8]], 1.4, 0.07)} position={[0, 0, -0.7]}>
          <meshStandardMaterial color="#8a8073" roughness={0.95} /></mesh>
        {mode === "pound" && <>
          {/* percutor de río */}
          <mesh castShadow position={[0.2, hy, 0.3]} scale={[0.26, 0.22, 0.24]}><sphereGeometry args={[1, 18, 14]} /><meshStandardMaterial color="#4c463e" roughness={0.6} /></mesh>
          <points geometry={dust}><pointsMaterial color="#e9dcc4" size={0.03} sizeAttenuation transparent opacity={1 - age} depthWrite={false} /></points>
          {hit && <pointLight position={[0.2, 0.95, 0.4]} intensity={3} color="#ffe2b0" distance={2} />}
        </>}
        {mode === "fit" && <>
          {/* piedra de arriba que baja y sube */}
          <mesh castShadow receiveShadow geometry={pillow([[-1.3, 0], [0.2, -0.09], [1.35, 0], [1.25, 0.9], [-1.2, 0.85]], 1.3, 0.07)} position={[0.02, lowerY, -0.65]}>
            <meshStandardMaterial color="#7a7166" roughness={0.95} /></mesh>
          {/* cuerdas */}
          {[-0.8, 0.8].map((x) => <mesh key={x} position={[x, lowerY + 2.2, 0]}><cylinderGeometry args={[0.02, 0.02, 2.6, 6]} /><meshStandardMaterial color="#b89a64" /></mesh>)}
          {/* puntos de contacto que quedan marcados (se van achicando con cada pasada) */}
          {Array.from({ length: spots }).map((_, i) => (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-1.0 + rnd(i + pass, 2) * 2.2, 0.865, -0.5 + rnd(i + pass, 3) * 1.1]}>
              <circleGeometry args={[0.07 + rnd(i, 5) * 0.06, 20]} /><meshBasicMaterial color="#ff3b30" transparent opacity={(1 - down) * 0.95} toneMapped={false} /></mesh>
          ))}
        </>}
      </ThreeCanvas>
      {mode === "pound" && <div style={{ position: "absolute", right: 130, top: 120, textAlign: "right", fontFamily: FONT, fontWeight: 900, perspective: 900 }}>
        <div style={{ fontSize: 34, letterSpacing: 6, color: C.dim }}>BLOWS</div>
        <div style={{ fontSize: 130, color: C.ink, textShadow: extrude(10, "#3c352c"), transform: "rotateY(-14deg)" }}>{blows.toLocaleString("en-US")}</div>
      </div>}
      {marks.map((m, i) => <KeyLine key={i} a={s(m.a)} text={m.t} align="center" y={890} size={56} out={marks[i + 1] ? s(marks[i + 1].a) - 2 : undefined} />)}
      <Vignette />
    </AbsoluteFill>
  );
};

// ============ D. BLOQUE H de Puma Punku: perfil H extruido; copias idénticas salen del original; arman un muro ============
const H_PROFILE: [number, number][] = [
  [-1, -0.8], [-0.62, -0.8], [-0.62, -0.25], [-0.42, -0.25], [-0.42, -0.5], [0.42, -0.5], [0.42, -0.25], [0.62, -0.25], [0.62, -0.8], [1, -0.8],
  [1, 0.8], [0.62, 0.8], [0.62, 0.25], [0.42, 0.25], [0.42, 0.5], [-0.42, 0.5], [-0.42, 0.25], [-0.62, 0.25], [-0.62, 0.8], [-1, 0.8],
];
const hGeo = () => { const sh = new THREE.Shape(); H_PROFILE.forEach(([x, y], i) => (i ? sh.lineTo(x, y) : sh.moveTo(x, y))); sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: 0.9, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 1 }); g.translate(0, 0, -0.45); return g; };
export const HBlock3D: React.FC<{ d: number; copiesAt?: number; wallAt?: number; measureAt?: number }> = ({ d, copiesAt, wallAt, measureAt }) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const geo = useMemo(hGeo, []);
  const k = e(f, 0, s(d));
  const cp = copiesAt !== undefined ? e(f, s(copiesAt), s(copiesAt + 1.4)) : 0;
  const wl = wallAt !== undefined ? e(f, s(wallAt), s(wallAt + 1.6)) : 0;
  const N = 7;
  const pos = V(lerp(2.6, -1.4, k) - wl * 1.5, lerp(1.8, 2.6, k) + wl * 1.4, lerp(5.2, 6.8, k) + cp * 3 + wl * 1.6), look = V(cp * 2.2 * (1 - wl), 0.9 + wl * 0.6, 0), fov = 36;
  const ms = measureAt !== undefined ? e(f, s(measureAt), s(measureAt) + 12) : 0;
  return (
    <AbsoluteFill style={{ background: "#0a0c10" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov, position: [2, 2, 5] }}>
        <Cam pos={pos} look={look} fov={fov} />
        <color attach="background" args={["#0a0c10"]} />
        <fog attach="fog" args={["#0a0c10", 7 + wl * 8, 22 + wl * 14]} />
        <ambientLight intensity={0.25 + wl * 0.25} />
        <hemisphereLight args={["#bcd0ff", "#140e0a", 0.35 + wl * 0.3]} />
        <directionalLight position={[-5, 7, 5]} intensity={2.6 + wl * 1.8} color="#ffe0bc" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
          shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={8} shadow-camera-bottom={-4} shadow-bias={-0.0004} />
        <SpotCone x={0} on={1 - wl} top={9} inten={500} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[60, 40]} /><meshStandardMaterial color="#14171c" roughness={0.4} metalness={0.3} /></mesh>
        {Array.from({ length: N }).map((_, i) => {
          // i=0 es el original; las copias se deslizan a la derecha; en "muro" se acomodan en una fila trabada
          const dx = i * 2.25 * cp, op = i === 0 ? 1 : Math.min(1, cp * 2);
          const wx = (i - 3) * 2.02, wy = 0.8 + (i % 2) * 0, wz = -1;
          const x = lerp(dx, wx, wl), y = lerp(0.81, wy, wl), z = lerp(0, wz, wl);
          return op > 0.01 ? <mesh key={i} geometry={geo} castShadow receiveShadow position={[x, y, z]} rotation={[0, lerp(-0.25, 0, wl), 0]}>
            <meshStandardMaterial color="#5f6066" roughness={0.55} metalness={0.05} transparent={op < 1} opacity={op} /></mesh> : null;
        })}
        <Dust cx={0} on={1 - cp} n={160} top={6} r={2} />
      </ThreeCanvas>
      {measureAt !== undefined && ["SAME CORNERS", "SAME FACES", "SAME GROOVES"].map((txt, i) => {
        const q = project(pos, look, fov, V(i === 0 ? -0.62 : i === 1 ? 1 : 0.42, i === 0 ? 0.81 + 0.25 : i === 1 ? 0.81 + 0.3 : 0.81 - 0.5, 0.45));
        return <Tag key={i} q={q} o={e(f, s(measureAt + i * 1.1), s(measureAt + i * 1.1) + 8) * (1 - cp)} text={txt} dy={i === 2 ? 120 : -110} size={30} />;
      })}
      {ms > 0 && t < (copiesAt ?? 999) && null}
      <Vignette />
    </AbsoluteFill>
  );
};

// ============ E. GRAMPA DE METAL FUNDIDO: muesca en T entre dos bloques, se llena de metal al rojo y se enfría ============
const T_NOTCH: [number, number][] = [[-0.5, -0.12], [-0.12, -0.12], [-0.12, -0.45], [0.12, -0.45], [0.12, -0.12], [0.5, -0.12], [0.5, 0.12], [0.12, 0.12], [0.12, 0.45], [-0.12, 0.45], [-0.12, 0.12], [-0.5, 0.12]];
export const Clamp3D: React.FC<{ d: number; pourAt: number }> = ({ d, pourAt }) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const fill = interpolate(t, [pourAt, pourAt + 2.2], [0, 1], cl);
  const cool = interpolate(t, [pourAt + 2.4, pourAt + 4.4], [0, 1], cl);
  const k = e(f, 0, s(d));
  const notch = useMemo(() => { const sh = new THREE.Shape(); T_NOTCH.forEach(([x, y], i) => (i ? sh.lineTo(x, y) : sh.moveTo(x, y))); sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: false }); g.rotateX(-Math.PI / 2); g.rotateY(Math.PI / 2); return g; }, []);
  const hot = new THREE.Color("#ff7a1a").lerp(new THREE.Color("#8a6a3e"), cool);
  const pos = V(lerp(2.2, 1.0, k), lerp(3.4, 2.4, k), lerp(3.6, 2.6, k)), look = V(0, 1.0, 0), fov = 36;
  return (
    <AbsoluteFill style={{ background: "#08090c" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov, position: [2, 3, 3] }}>
        <Cam pos={pos} look={look} fov={fov} />
        <color attach="background" args={["#08090c"]} />
        <fog attach="fog" args={["#08090c", 4, 12]} />
        <ambientLight intensity={0.22} />
        <directionalLight position={[-3, 6, 2]} intensity={2.2} color="#ffe2c4" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial color="#17191d" roughness={0.6} /></mesh>
        {[-1, 1].map((sg) => <mesh key={sg} castShadow receiveShadow position={[sg * 1.003, 0.5, 0]}><boxGeometry args={[2, 1, 1.6]} /><meshStandardMaterial color="#6e6f74" roughness={0.6} /></mesh>)}
        {/* la muesca (hueco oscuro) */}
        <mesh geometry={notch} position={[0, 1.003, 0]}><meshBasicMaterial color="#050505" /></mesh>
        {/* el metal sube */}
        <mesh geometry={notch} position={[0, 1.004 - 0.12 * (1 - fill) + 0.002, 0]} scale={[1, Math.max(0.001, fill), 1]}><meshStandardMaterial color={hot} emissive={hot} emissiveIntensity={1.6 * (1 - cool)} roughness={0.3} metalness={0.6 * cool} /></mesh>
        {fill > 0 && cool < 1 && <pointLight position={[0, 1.4, 0]} intensity={6 * (1 - cool)} color="#ff8a2a" distance={4} />}
        {/* chorro */}
        {t > pourAt - 0.2 && fill < 1 && <mesh position={[0.05, 2.0, 0]}><cylinderGeometry args={[0.03, 0.045, 2, 10]} /><meshBasicMaterial color="#ffb050" toneMapped={false} /></mesh>}
      </ThreeCanvas>
      <KeyLine a={s(pourAt + 0.4)} text="not hammered in. *Poured.*" align="center" y={880} size={54} />
      <Vignette />
    </AbsoluteFill>
  );
};

// ============ F. 800 TONELADAS = 600 AUTOS: los autos se apilan en un cubo → se vuelve piedra → sube a 7 m junto a una casa ============
export const Cars3D: React.FC<{ d: number; stoneAt: number; liftAt: number }> = ({ d, stoneAt, liftAt }) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const N = 600, NX = 15, NZ = 8; // 15 x 8 x 5 = 600
  const ref = React.useRef<THREE.InstancedMesh>(null);
  const toStone = e(f, s(stoneAt), s(stoneAt + 0.8));
  const lift = e(f, s(liftAt), s(liftAt + 1.8));
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mats = useMemo(() => {
    const m: THREE.Matrix4[] = [];
    for (let i = 0; i < N; i++) {
      const x = i % NX, z = Math.floor(i / NX) % NZ, y = Math.floor(i / (NX * NZ));
      const drop = sp(f, i * 0.06, 16);
      dummy.position.set(-5.6 + x * 0.8, 0.2 + y * 0.42 + (1 - drop) * 6, -1.8 + z * 0.5);
      dummy.rotation.set(0, (1 - drop) * (rnd(i) - 0.5) * 2, 0);
      dummy.scale.setScalar(drop * (1 - toStone) + 0.0001);
      dummy.updateMatrix(); m.push(dummy.matrix.clone());
    }
    return m;
  }, [f, toStone, dummy]);
  if (ref.current) { mats.forEach((m, i) => ref.current!.setMatrixAt(i, m)); ref.current.instanceMatrix.needsUpdate = true; }
  const colors = useMemo(() => { const c = new Float32Array(N * 3); const pal = ["#c8302c", "#2c5fa8", "#e8e8e8", "#1d1d1d", "#9aa3ad", "#d8a12a"]; for (let i = 0; i < N; i++) { const q = new THREE.Color(pal[Math.floor(rnd(i, 3) * pal.length)]); c.set([q.r, q.g, q.b], i * 3); } return c; }, []);
  const k = e(f, 0, s(d));
  const pos = V(lerp(11, 13, k), lerp(5, 6, k) + lift * 2.5, lerp(16, 18, k)), look = V(0.6, 1.6 + lift * 4.2, 0), fov = 42;
  const blockY = 1.05 + lift * 7;
  const lbl = project(pos, look, fov, V(-5.95 - 0.4, blockY, 1.8));
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#1b2433 0%,#3a4252 60%,#5b5a58 100%)" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }} camera={{ fov, position: [9, 5, 12] }}>
        <Cam pos={pos} look={look} fov={fov} />
        <fog attach="fog" args={["#3a4252", 18, 50]} />
        <ambientLight intensity={0.4} />
        <hemisphereLight args={["#cfe0ff", "#3a2e24", 0.5]} />
        <directionalLight position={[-8, 14, 9]} intensity={2.6} color="#fff0dc" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
          shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={16} shadow-camera-bottom={-6} shadow-bias={-0.0005} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial color="#6a6258" roughness={1} /></mesh>
        <instancedMesh ref={ref} args={[undefined, undefined, N]} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.36, 0.44]}><instancedBufferAttribute attach="attributes-color" args={[colors, 3]} /></boxGeometry>
          <meshStandardMaterial vertexColors roughness={0.4} metalness={0.4} />
        </instancedMesh>
        {/* la piedra: mismo volumen que la pila */}
        <mesh castShadow receiveShadow position={[0.0, blockY, 0.0]} scale={[toStone + 0.0001, toStone + 0.0001, toStone + 0.0001]}><boxGeometry args={[12, 2.1, 4]} /><meshStandardMaterial color="#c9a678" roughness={0.95} /></mesh>
        {/* casa de dos pisos (≈7 m) para escala */}
        <group position={[9.2, 0, -0.5]} scale={0.85}>
          <mesh castShadow receiveShadow position={[0, 1.75, 0]}><boxGeometry args={[3, 3.5, 3]} /><meshStandardMaterial color="#e8e2d6" roughness={0.9} /></mesh>
          <mesh castShadow position={[0, 4.2, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[2.5, 1.5, 4]} /><meshStandardMaterial color="#8c3b2a" roughness={0.8} /></mesh>
          {[[-0.7, 1.0], [0.7, 1.0], [-0.7, 2.5], [0.7, 2.5]].map(([x, y], i) => <mesh key={i} position={[x, y, 1.51]}><planeGeometry args={[0.6, 0.7]} /><meshStandardMaterial color="#ffd27a" emissive="#ffb84a" emissiveIntensity={0.6} /></mesh>)}
        </group>
        {/* cables de izado */}
        {lift > 0.02 && [-4, 4].map((x) => <mesh key={x} position={[x, blockY + 1.05 + 5, 0]}><cylinderGeometry args={[0.03, 0.03, 10, 6]} /><meshStandardMaterial color="#c9a46a" /></mesh>)}
      </ThreeCanvas>
      <div style={{ position: "absolute", left: Math.max(60, Math.min(1360, lbl.x - 520)), width: 500, top: Math.max(60, Math.min(980, lbl.y - 40)), textAlign: "right", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.ink, opacity: 1 - toStone * 0.0, textShadow: extrude(8, "#3c352c") }}>
        {toStone < 0.5 ? `${Math.min(600, Math.floor(interpolate(f, [0, s(stoneAt - 0.3)], [0, 600], cl)))} CARS` : "800 TONS"}
      </div>
      <Vignette k={0.45} />
    </AbsoluteFill>
  );
};

// ============ G. GRÚA ROMANA DE RUEDA (hámster gigante): rueda que gira con hombres adentro, el bloque sube ============
const Walker: React.FC<{ a: number; R: number; f: number; i: number }> = ({ a, R, f, i }) => {
  const st = Math.sin(f / 4 + i * 1.7);
  return (
    <group position={[Math.sin(a) * (R - 0.62), -Math.cos(a) * (R - 0.62), (i - 1) * 0.42]} rotation={[0, 0, a]}>
      <mesh castShadow position={[0, 0.42, 0]}><capsuleGeometry args={[0.13, 0.42, 6, 12]} /><meshStandardMaterial color="#7a4a2c" roughness={0.9} /></mesh>
      <mesh castShadow position={[0, 0.85, 0]}><sphereGeometry args={[0.11, 14, 10]} /><meshStandardMaterial color="#3a2218" roughness={0.9} /></mesh>
      {[-1, 1].map((sg) => <mesh key={sg} castShadow position={[sg * st * 0.08, 0.1, 0]} rotation={[0, 0, sg * st * 0.4]}><capsuleGeometry args={[0.05, 0.28, 4, 8]} /><meshStandardMaterial color="#3a2218" /></mesh>)}
    </group>
  );
};
export const Crane3D: React.FC<{ d: number; liftAt: number; manyAt?: number }> = ({ d, liftAt, manyAt }) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const R = 2.2;
  const rot = Math.max(0, t - liftAt) * 0.55;
  const up = Math.min(2.6, Math.max(0, t - liftAt) * 0.35);
  const many = manyAt !== undefined ? e(f, s(manyAt), s(manyAt + 2)) : 0;
  const k = e(f, 0, s(d));
  const pos = V(lerp(7.5, 5.5, k) + many * 6, lerp(3.2, 4.2, k) + many * 5, lerp(9.5, 8.2, k) + many * 9), look = V(1.4 + many * 3, 2.4, 0), fov = 36;
  const Crane = ({ x, z, ph }: { x: number; z: number; ph: number }) => (
    <group position={[x, 0, z]}>
      {/* rueda */}
      <group position={[0, R + 0.2, 0]} rotation={[0, 0, -rot - ph]}>
        {[-0.7, 0.7].map((zz) => <mesh key={zz} castShadow position={[0, 0, zz]}><torusGeometry args={[R, 0.07, 10, 64]} /><meshStandardMaterial color="#7b5532" roughness={0.85} /></mesh>)}
        {Array.from({ length: 12 }).map((_, i) => <mesh key={i} castShadow rotation={[0, 0, (i / 12) * Math.PI * 2]}><boxGeometry args={[0.07, 2 * R, 0.07]} /><meshStandardMaterial color="#6a4628" /></mesh>)}
        {Array.from({ length: 28 }).map((_, i) => { const a = (i / 28) * Math.PI * 2; return <mesh key={"p" + i} castShadow position={[Math.cos(a) * R, Math.sin(a) * R, 0]}><boxGeometry args={[0.09, 0.09, 1.45]} /><meshStandardMaterial color="#8a6238" /></mesh>; })}
      </group>
      {/* los que caminan adentro (quedan abajo mientras la rueda gira) */}
      <group position={[0, R + 0.2, 0]}>{[0, 1, 2].map((i) => <Walker key={i} a={-0.18 + i * 0.02} R={R} f={f} i={i} />)}</group>
      {/* caballetes */}
      {[-1, 1].map((sg) => <mesh key={sg} castShadow position={[sg * 0.9, R * 0.55, -1.0]} rotation={[0, 0, sg * 0.35]}><boxGeometry args={[0.14, R * 1.3, 0.14]} /><meshStandardMaterial color="#5d3e22" /></mesh>)}
      {/* pluma (A) inclinada hacia el bloque */}
      <group position={[1.2, 0.2, 0]} rotation={[0, 0, -0.42]}>
        {[-0.6, 0.6].map((zz) => <mesh key={zz} castShadow position={[0, 4.2, zz]} rotation={[zz * 0.12, 0, 0]}><cylinderGeometry args={[0.09, 0.12, 8.4, 10]} /><meshStandardMaterial color="#7a5430" roughness={0.85} /></mesh>)}
      </group>
      {/* cuerda y bloque */}
      <mesh position={[4.6, 4.6 + up / 2, 0]}><cylinderGeometry args={[0.025, 0.025, 6.6 - up, 6]} /><meshStandardMaterial color="#d2b37a" /></mesh>
      <mesh castShadow receiveShadow position={[4.6, 0.55 + up, 0]}><boxGeometry args={[2.0, 1.1, 1.3]} /><meshStandardMaterial color="#d6c09a" roughness={0.95} /></mesh>
    </group>
  );
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#2a2440 0%,#83504a 45%,#e8995a 75%,#f6c27a 100%)" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }} camera={{ fov, position: [7, 3, 9] }}>
        <Cam pos={pos} look={look} fov={fov} />
        <fog attach="fog" args={["#d9905a", 14, 46]} />
        <ambientLight intensity={0.35} color="#ffd8b0" />
        <hemisphereLight args={["#ffb27a", "#3a2216", 0.55]} />
        <directionalLight position={[12, 6, 10]} intensity={3.2} color="#ffb070" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
          shadow-camera-left={-20} shadow-camera-right={25} shadow-camera-top={14} shadow-camera-bottom={-8} shadow-bias={-0.0006} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[6, 0, 0]}><planeGeometry args={[100, 70]} /><meshStandardMaterial color="#b88a5c" roughness={1} /></mesh>
        <Crane x={0} z={0} ph={0} />
        {many > 0.01 && [[9, -4, 1], [-8, -6, 2], [16, -9, 3], [3, -12, 4]].map(([x, z, p], i) => <group key={i} scale={many}><Crane x={x} z={z} ph={p} /></group>)}
      </ThreeCanvas>
      <KeyLine a={s(liftAt + 0.4)} text="basically a giant *hamster wheel.*" align="center" y={120} size={52} />
      <Vignette k={0.4} tint="30,10,10" />
    </AbsoluteFill>
  );
};

// ============ H. JUNTA DE MEDIO MILÍMETRO: dos piedras de revestimiento se juntan; picada a la junta; 5 hojas de papel ============
export const Gap3D: React.FC<{ d: number; closeAt: number; diveAt: number; paperAt: number; cementAt?: number }> = ({ d, closeAt, diveAt, paperAt, cementAt }) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const close = e(f, s(closeAt), s(closeAt + 1.4));
  const dive = interpolate(t, [diveAt, diveAt + 2.2], [0, 1], { ...cl, easing: (x) => x * x * (3 - 2 * x) });
  const G = 0.06; // ancho de la junta en escena (se "lee" como 0,5 mm)
  const gap = lerp(1.6, G, close);
  // la cámara pica de plano general (6 m) a macro (0,25 m) sobre la junta
  const dist = Math.exp(lerp(Math.log(7.5), Math.log(0.42), dive));
  const pos = V(lerp(-2.5, 0, dive) + Math.sin(t * 0.4) * 0.05, lerp(2.4, 1.15, dive), dist), look = V(0, lerp(1.1, 1.15, dive), 0), fov = 36;
  const nP = Math.floor(interpolate(t, [paperAt, paperAt + 1.6], [0, 5], cl));
  const cem = cementAt !== undefined ? e(f, s(cementAt), s(cementAt) + 14) : 0;
  return (
    <AbsoluteFill style={{ background: "#e9dcc6" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov, position: [0, 2, 7] }}>
        <Cam pos={pos} look={look} fov={fov} near={0.005} />
        <color attach="background" args={["#d9c7a8"]} />
        <fog attach="fog" args={["#d9c7a8", 9, 30]} />
        <ambientLight intensity={0.55} />
        <hemisphereLight args={["#fff4e0", "#8a6a44", 0.6]} />
        <directionalLight position={[-5, 8, 6]} intensity={2.6} color="#fff0d8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[60, 60]} /><meshStandardMaterial color="#cfb58c" roughness={1} /></mesh>
        {[-1, 1].map((sg) => (
          <mesh key={sg} castShadow receiveShadow position={[sg * (1.5 + gap / 2), 1.1, 0]}><boxGeometry args={[3, 2.2, 1.8]} /><meshStandardMaterial color="#efe8da" roughness={0.55} /></mesh>
        ))}
        {/* cemento finísimo en la junta */}
        {cem > 0 && <mesh position={[0, 1.1, 0.0]}><boxGeometry args={[gap * 0.98, 2.2 * cem, 1.79]} /><meshStandardMaterial color="#cbbfa8" roughness={1} /></mesh>}
        {/* hojas de papel que entran en la junta */}
        {Array.from({ length: nP }).map((_, i) => <mesh key={i} position={[-G / 2 + (i + 0.5) * (G / 5), 1.15, 0.92 - 0.0]}><boxGeometry args={[G / 5 * 0.7, 0.6, 0.02]} /><meshStandardMaterial color={i % 2 ? "#ffffff" : "#f2f2f2"} roughness={0.8} /></mesh>)}
      </ThreeCanvas>
      <Big3D a={s(closeAt + 1.3)} text="0.5 mm" y={110} size={150} hot out={s(paperAt) - 4} />
      <Big3D a={s(paperAt + 0.2)} text="= 5 SHEETS OF PAPER" y={120} size={96} />
      <Vignette k={0.35} tint="40,25,10" />
    </AbsoluteFill>
  );
};

// ============ I. GÖBEKLI TEPE: círculo de pilares en T con brazos tallados, al atardecer; grúa que baja en espiral ============
const TPillar: React.FC<{ x: number; z: number; rotY: number; h?: number; i: number; rise?: number }> = ({ x, z, rotY, h = 3.2, i, rise = 1 }) => (
  <group position={[x, (rise - 1) * h, z]} rotation={[0, rotY, 0]}>
    <mesh castShadow receiveShadow position={[0, h / 2, 0]}><boxGeometry args={[0.55, h, 0.3]} /><meshStandardMaterial color={stoneCol(i, 36, 0.62)} roughness={0.95} /></mesh>
    <mesh castShadow receiveShadow position={[0.2, h + 0.3, 0]}><boxGeometry args={[1.25, 0.6, 0.36]} /><meshStandardMaterial color={stoneCol(i + 3, 36, 0.62)} roughness={0.95} /></mesh>
    {/* brazos en relieve que bajan y se juntan sobre el cinturón */}
    {[-1, 1].map((sg) => <mesh key={sg} castShadow position={[0, h * 0.62, sg * 0.165]} rotation={[0, 0, 0.5]}><boxGeometry args={[0.07, h * 0.5, 0.02]} /><meshStandardMaterial color="#b9a17c" roughness={1} /></mesh>)}
    {[-1, 1].map((sg) => <mesh key={"b" + sg} position={[0, h * 0.42, sg * 0.165]}><boxGeometry args={[0.56, 0.06, 0.02]} /><meshStandardMaterial color="#a88f6a" roughness={1} /></mesh>)}
    {/* animal tallado (zorro/jabalí simplificado) */}
    {i % 2 === 0 && <mesh position={[0.16, h * 0.78, 0.165]}><boxGeometry args={[0.22, 0.12, 0.02]} /><meshStandardMaterial color="#8f7a58" roughness={1} /></mesh>}
  </group>
);
export const Gobekli3D: React.FC<{ d: number; riseAt?: number; armsAt?: number; tags?: { a: number; t: string }[] }> = ({ d, riseAt, armsAt, tags = [] }) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const k = e(f, 0, s(d));
  const ang = -0.6 + t * 0.06;
  const r = lerp(16, 9, k), hgt = lerp(11, 3.6, k);
  const pos = V(Math.sin(ang) * r, hgt, Math.cos(ang) * r), look = V(0, 1.8, 0), fov = 36;
  const armsK = armsAt !== undefined ? e(f, s(armsAt), s(armsAt + 1.4)) : 0;
  const posA = V(lerp(pos.x, 0.9, armsK), lerp(pos.y, 2.4, armsK), lerp(pos.z, 3.0, armsK)), lookA = V(0, lerp(1.8, 2.6, armsK), 0);
  const P = Array.from({ length: 10 }).map((_, i) => { const a = (i / 10) * Math.PI * 2; return { x: Math.cos(a) * 5.2, z: Math.sin(a) * 5.2, ry: -a + Math.PI / 2 }; });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#26203a 0%,#7c4a48 45%,#e39a5c 78%,#f4c27e 100%)" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }} camera={{ fov, position: [0, 8, 14] }}>
        <Cam pos={posA} look={lookA} fov={fov} />
        <fog attach="fog" args={["#d58d58", 16, 48]} />
        <ambientLight intensity={0.35} color="#ffd6ae" />
        <hemisphereLight args={["#ffb27a", "#2c1a12", 0.6]} />
        <directionalLight position={[14, 5, 8]} intensity={3.4} color="#ffae6a" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
          shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={12} shadow-camera-bottom={-8} shadow-bias={-0.0006} />
        {/* hondonada circular excavada */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[120, 120]} /><meshStandardMaterial color="#c49466" roughness={1} /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow><ringGeometry args={[5.6, 6.6, 64]} /><meshStandardMaterial color="#9a7452" roughness={1} /></mesh>
        {P.map((p, i) => <TPillar key={i} x={p.x} z={p.z} rotY={p.ry} i={i} rise={riseAt !== undefined ? sp(f, s(riseAt) + i * 3, 13) : 1} />)}
        <TPillar x={-1.1} z={0} rotY={Math.PI / 2} h={5.0} i={20} rise={riseAt !== undefined ? sp(f, s(riseAt) + 34, 13) : 1} />
        <TPillar x={1.1} z={0} rotY={Math.PI / 2} h={5.0} i={21} rise={riseAt !== undefined ? sp(f, s(riseAt) + 38, 13) : 1} />
        <Dust cx={0} on={0.6} n={240} top={7} r={7} col="#ffd0a0" />
      </ThreeCanvas>
      {tags.map((tg, i) => <KeyLine key={i} a={s(tg.a)} text={tg.t} align="center" y={i % 2 ? 900 : 120} size={52} out={tags[i + 1] ? s(tags[i + 1].a) - 3 : undefined} />)}
      <Vignette k={0.45} tint="30,10,10" />
    </AbsoluteFill>
  );
};

// ============ J. LÍNEA DE TIEMPO EN PROFUNDIDAD: un riel que se pierde; monolitos con fechas; la cámara retrocede 11.600 años ============
export const Timeline3D: React.FC<{ d: number; marks: { a: number; t: string; sub: string; yr: number; hot?: boolean }[]; stamps?: { a: number; t: string }[] }> = ({ d, marks, stamps = [] }) => {
  const f = useCurrentFrame(); const t = f / FPS;
  // eje: z = -(años antes de hoy)/400 ; hoy en z=0
  const Z = (yr: number) => -yr / 420;
  const k = e(f, 0, s(d));
  const camZ = lerp(Z(11600) + 7, Z(2600) + 9, k);
  const pos = V(lerp(3.2, 4.2, k), lerp(2.2, 3.4, k), camZ), look = V(0, 1.0, camZ - 9), fov = 40;
  return (
    <AbsoluteFill style={{ background: "#04060a" }}>
      <ThreeCanvas width={W} height={H} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov, position: [3, 2, 0] }}>
        <Cam pos={pos} look={look} fov={fov} />
        <color attach="background" args={["#04060a"]} />
        <fog attach="fog" args={["#04060a", 6, 26]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[4, 8, 4]} intensity={1.2} color="#ffe2c0" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -15]}><planeGeometry args={[60, 80]} /><meshStandardMaterial color="#0b0f16" roughness={0.4} metalness={0.4} /></mesh>
        {/* riel de luz */}
        <mesh position={[0, 0.02, -15]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.06, 80]} /><meshBasicMaterial color={C.orange} toneMapped={false} /></mesh>
        {Array.from({ length: 30 }).map((_, i) => <mesh key={i} position={[0, 0.02, Z(i * 500)]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[i % 2 ? 0.4 : 0.8, 0.03]} /><meshBasicMaterial color="#7d8696" /></mesh>)}
        {marks.map((m, i) => {
          const on = e(f, s(m.a), s(m.a) + 10);
          return <group key={i} position={[i % 2 ? -1.6 : 0.9, 0, Z(m.yr)]}>
            <mesh castShadow position={[0, 0.9 * on + 0.001, 0]} scale={[1, on + 0.001, 1]}><boxGeometry args={[0.5, 1.8, 0.3]} /><meshStandardMaterial color={m.hot ? "#c98b5a" : "#8d8a84"} roughness={0.8} emissive={m.hot ? "#5a2a10" : "#000"} /></mesh>
            <pointLight position={[0, 2.4, 0.6]} intensity={on * 2.5} distance={4} color={m.hot ? "#ff9a5a" : "#cfe0ff"} />
          </group>;
        })}
      </ThreeCanvas>
      {marks.map((m, i) => {
        const q = project(pos, look, fov, V(i % 2 ? -1.6 : 0.9, i % 2 ? 2.6 : 2.05, Z(m.yr)));
        const on = e(f, s(m.a), s(m.a) + 10);
        if (q.behind) return null;
        return <div key={i} style={{ position: "absolute", left: q.x - 300, width: 600, top: q.y - 90, textAlign: "center", fontFamily: FONT, opacity: on }}>
          <div style={{ fontWeight: 900, fontSize: 44, color: m.hot ? C.red : C.ink, textShadow: extrude(5, m.hot ? "#6a1210" : "#3a3026") }}>{m.t}</div>
          <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: 3, color: C.dim, textShadow: "0 2px 8px #000" }}>{m.sub}</div>
        </div>;
      })}
      {stamps.map((st, i) => {
        const tt = sp(f, s(st.a), 12);
        return <div key={i} style={{ position: "absolute", left: 120, top: 640 + i * 78, fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 4, color: C.ink, opacity: Math.min(1, tt * 1.4), transform: `perspective(900px) translateZ(${(1 - tt) * 400}px) rotateY(18deg)`, textShadow: extrude(6, "#3c352c") }}>
          <span style={{ color: C.red }}>✕ </span>{st.t}</div>;
      })}
      <Vignette />
    </AbsoluteFill>
  );
};

// ============ K. STONEHENGE: unión caja-espiga (dintel que baja sobre los tetones) + machihembrado + anillo curvo ============
export const Lintel3D: React.FC<{ d: number; dropAt: number; xrayAt: number; tongueAt: number; ringAt?: number }> = ({ d, dropAt, xrayAt, tongueAt, ringAt }) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const drop = sp(f, s(dropAt), 15);
  const xr = e(f, s(xrayAt), s(xrayAt) + 12);
  const tg = sp(f, s(tongueAt), 15);
  const ring = ringAt !== undefined ? e(f, s(ringAt), s(ringAt + 2.4)) : 0;
  const k = e(f, 0, s(d));
  const pos0 = V(lerp(4.5, 3.2, k), lerp(3.4, 4.6, k), lerp(8, 7, k));
  const pos = V(lerp(pos0.x, 0.01, ring), lerp(pos0.y, 26, ring), lerp(pos0.z, 0.02, ring)), look = V(lerp(0.8, 0, ring), lerp(3.6, 0, ring), lerp(0, 0, ring)), fov = 36;
  const stoneMat = (o = 1) => <meshStandardMaterial color="#9b958a" roughness={0.95} transparent={o < 1} opacity={o} />;
  const arc = useMemo(() => {
    // anillo de 30 dinteles curvos (sector anular extruido)
    const R0 = 4.5, R1 = 5.3, out: THREE.ExtrudeGeometry[] = [];
    for (let i = 0; i < 30; i++) { const a0 = (i / 30) * Math.PI * 2 + 0.004, a1 = ((i + 1) / 30) * Math.PI * 2 - 0.004, sh = new THREE.Shape();
      sh.absarc(0, 0, R1, a0, a1, false); sh.absarc(0, 0, R0, a1, a0, true); sh.closePath();
      const g = new THREE.ExtrudeGeometry(sh, { depth: 0.7, bevelEnabled: false, curveSegments: 8 }); g.rotateX(-Math.PI / 2); out.push(g); }
    return out;
  }, []);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#1c2430 0%,#46536a 55%,#8a8f94 100%)" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }} camera={{ fov, position: [4, 3, 8] }}>
        <Cam pos={pos} look={look} fov={fov} />
        <fog attach="fog" args={["#46536a", 14, 60]} />
        <ambientLight intensity={0.45} />
        <hemisphereLight args={["#c8d8ff", "#2a2a22", 0.6]} />
        <directionalLight position={[-6, 10, 7]} intensity={2.4} color="#fff0dc" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
          shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-4} shadow-bias={-0.0005} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial color="#56653e" roughness={1} /></mesh>
        <group visible={ring < 0.6}>
          {/* dos pilares con tetón */}
          {[-1.1, 1.1].map((x) => <group key={x} position={[x, 0, 0]}>
            <mesh castShadow receiveShadow position={[0, 1.6, 0]}><boxGeometry args={[0.9, 3.2, 0.8]} />{stoneMat(1 - xr * 0.55)}</mesh>
            <mesh castShadow position={[0, 3.27, 0]}><cylinderGeometry args={[0.16, 0.2, 0.16, 20]} /><meshStandardMaterial color={xr > 0.3 ? C.red : "#9b958a"} emissive={xr > 0.3 ? "#5a0a06" : "#000"} roughness={0.9} /></mesh>
          </group>)}
          {/* dintel que baja (con las cajas abajo) */}
          <group position={[0, 3.2 + 0.35 + (1 - drop) * 2.6, 0]}>
            <mesh castShadow receiveShadow><boxGeometry args={[3.4, 0.7, 0.8]} />{stoneMat(1 - xr * 0.55)}</mesh>
            {[-1.1, 1.1].map((x) => <mesh key={x} position={[x, -0.27, 0]}><cylinderGeometry args={[0.18, 0.22, 0.18, 20]} /><meshBasicMaterial color="#222" transparent opacity={0.3 + xr * 0.6} /></mesh>)}
            {/* lengüeta del machihembrado (hacia el próximo dintel) */}
            <mesh position={[1.82, 0, 0]}><boxGeometry args={[0.26, 0.3, 0.3]} /><meshStandardMaterial color={tg > 0.05 ? C.orange : "#9b958a"} roughness={0.9} /></mesh>
          </group>
          {/* el dintel vecino que se acerca y encastra */}
          <group position={[3.4 + 0.02 + (1 - tg) * 1.8, 3.55 + (1 - drop) * 2.6, 0]}>
            <mesh castShadow receiveShadow><boxGeometry args={[3.4, 0.7, 0.8]} />{stoneMat(Math.min(1, tg * 2) * (1 - xr * 0.4))}</mesh>
          </group>
        </group>
        {/* el anillo de dinteles curvos visto desde arriba */}
        {ring > 0.3 && arc.map((g, i) => <mesh key={i} geometry={g} castShadow receiveShadow position={[0, 3.2 + (1 - sp(f, s(ringAt!) + i * 1.2, 14)) * 3, 0]}><meshStandardMaterial color={stoneCol(i, 40, 0.55)} roughness={0.95} /></mesh>)}
        {ring > 0.3 && Array.from({ length: 30 }).map((_, i) => { const a = (i / 30) * Math.PI * 2; return <mesh key={"u" + i} castShadow position={[Math.cos(a) * 4.9, 1.6, -Math.sin(a) * 4.9]}><boxGeometry args={[0.7, 3.2, 0.9]} /><meshStandardMaterial color={stoneCol(i + 9, 40, 0.5)} roughness={0.95} /></mesh>; })}
      </ThreeCanvas>
      <KeyLine a={s(xrayAt + 0.3)} text="*mortise* and *tenon.*" align="center" y={120} size={56} out={s(tongueAt) - 3} />
      <KeyLine a={s(tongueAt + 0.4)} text="tongue and *groove.*" align="center" y={120} size={56} out={ringAt !== undefined ? s(ringAt) - 3 : undefined} />
      <Vignette k={0.45} />
    </AbsoluteFill>
  );
};

// ============ L. SALTO DE GLOBO (motivo que vuelve): de un pilar al siguiente, con arcos de distancia opcionales ============
const D2R = Math.PI / 180;
const onSphere = (lat: number, lon: number, r = 1) => {
  const phi = (lon + 180) * D2R, th = (90 - lat) * D2R;
  return V(-r * Math.cos(phi) * Math.sin(th), r * Math.cos(th), r * Math.sin(phi) * Math.sin(th));
};
export const SITES7: [number, number][] = [[-13.5, -72], [-16.55, -68.68], [34.0, 36.2], [29.98, 31.13], [37.22, 38.92], [38.48, 22.5], [51.18, -1.83]];
const ATMO_V = `varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(normalMatrix*normal); vec4 p = modelViewMatrix*vec4(position,1.0); vP = p.xyz; gl_Position = projectionMatrix*p; }`;
const ATMO_F = `varying vec3 vN; varying vec3 vP; uniform float uI; void main(){ float f = pow(1.0 - abs(dot(normalize(-vP), vN)), 2.6); gl_FragColor = vec4(vec3(0.35,0.62,1.0)*f*uI, f*uI); }`;
const slerpLL = (a: [number, number], b: [number, number], k: number) => {
  const A = onSphere(a[0], a[1]).normalize(), B = onSphere(b[0], b[1]).normalize();
  const om = Math.acos(Math.min(1, Math.max(-1, A.dot(B))));
  if (om < 1e-4) return A;
  return A.clone().multiplyScalar(Math.sin((1 - k) * om) / Math.sin(om)).add(B.clone().multiplyScalar(Math.sin(k * om) / Math.sin(om))).normalize();
};
type Arc = { a: [number, number]; b: [number, number]; at: number; label: string; hot?: boolean };
export const Hop3D: React.FC<{ d: number; from: number; to: number; title?: string; sub?: string; titleAt?: number; arcs?: Arc[]; endDist?: number; recap?: { a: number }[]; hold?: boolean }> = ({ d, from, to, title, sub, titleAt = 0.6, arcs = [], endDist = 1.32, recap, hold }) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const tex = useTex("sealed02/earth.jpg");
  const stars = useMemo(() => {
    const g = new THREE.BufferGeometry(), n = 1600, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const v = V(rnd(i) - 0.5, rnd(i, 9) - 0.5, rnd(i, 37) - 0.5).normalize().multiplyScalar(60); p.set([v.x, v.y, v.z], i * 3); }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3)); return g;
  }, []);
  // salida → viaje por el arco → picada (si hold: queda alto mirando la zona)
  const out = e(f, 0, s(Math.min(1.2, d * 0.3)));
  const trav = e(f, s(d * 0.15), s(d * 0.7));
  const dive = hold ? 0 : e(f, s(d * 0.62), s(d));
  const dirV = slerpLL(SITES7[from], SITES7[to], trav);
  const dist = Math.exp(lerp(lerp(Math.log(1.45), Math.log(3.1), out), Math.log(endDist), Math.pow(dive, 1.3)));
  const pos = dirV.clone().multiplyScalar(dist);
  // un poco de inclinación para que no sea plano
  const tilt = V(0, 0.18 * (1 - dive), 0);
  const look = dirV.clone().multiplyScalar(lerp(0, 1, dive)).add(tilt);
  const light = onSphere(SITES7[to][0] + 22, SITES7[to][1] + 28, 5);
  return (
    <AbsoluteFill style={{ background: "#03060b" }}>
      {tex && <ThreeCanvas width={W} height={H} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 35, position: [0, 0, 4] }}>
        <Cam pos={pos} look={look} fov={35} near={0.002} />
        <color attach="background" args={["#03060b"]} />
        <points geometry={stars}><pointsMaterial color="#cfd8ff" size={0.1} sizeAttenuation transparent opacity={0.7} /></points>
        <ambientLight intensity={0.14} />
        <directionalLight position={[light.x, light.y, light.z]} intensity={2.4} color="#fff1dc" />
        <mesh><sphereGeometry args={[1, 160, 120]} /><meshStandardMaterial map={tex} roughness={0.95} color="#9aa6b8" /></mesh>
        <mesh scale={1.03}><sphereGeometry args={[1, 96, 64]} /><shaderMaterial key={f} vertexShader={ATMO_V} fragmentShader={ATMO_F} uniforms={{ uI: { value: 1.1 - dive * 0.7 } }} transparent side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
        {SITES7.map(([la, lo], i) => {
          const n = onSphere(la, lo, 1), qn = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), n.clone().normalize());
          const visited = i <= from && !recap; const target = i === to && !recap;
          const rc = recap ? e(f, s(recap[i]?.a ?? 0), s(recap[i]?.a ?? 0) + 8) : 1;
          const col = target ? "#ff3b30" : visited ? "#8a8f99" : "#ffcf86";
          const h = (target ? 0.16 : 0.09) * rc * (1 - dive * 0.7);
          return <group key={i} position={n} quaternion={qn}>
            <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[0.004, 0.012, h + 0.0001, 10]} /><meshBasicMaterial color={col} toneMapped={false} transparent opacity={rc} /></mesh>
            <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[0.008, 0.024, h + 0.0001, 16, 1, true]} /><meshBasicMaterial color={col} transparent opacity={0.22 * rc} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>
            <mesh><sphereGeometry args={[0.011 * rc + 0.0001, 16, 12]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>
          </group>;
        })}
        {/* arcos de distancia (tubo que se dibuja) */}
        {arcs.map((ar, i) => {
          const k = interpolate(t, [ar.at, ar.at + 1.2], [0, 1], cl);
          if (k <= 0) return null;
          const A = onSphere(ar.a[0], ar.a[1]).normalize(), B = onSphere(ar.b[0], ar.b[1]).normalize();
          const L = A.distanceTo(B);
          const pts = Array.from({ length: 40 }).map((_, j) => { const u = (j / 39) * k; return slerpLL(ar.a, ar.b, u).multiplyScalar(1 + Math.sin(Math.PI * u / Math.max(k, 0.0001) * k) * L * 0.25 + 0.001); });
          const curve = new THREE.CatmullRomCurve3(pts);
          return <mesh key={i}><tubeGeometry args={[curve, 60, 0.0016 + L * 0.004, 8, false]} /><meshBasicMaterial color={ar.hot ? "#ff3b30" : "#ffcf86"} toneMapped={false} /></mesh>;
        })}
      </ThreeCanvas>}
      {arcs.map((ar, i) => {
        const B = onSphere(ar.b[0], ar.b[1], 1.0);
        const q = project(pos, look, 35, B);
        const o = e(f, s(ar.at + 0.9), s(ar.at + 1.2)) * (arcs[i + 1] ? 1 - e(f, s(arcs[i + 1].at + 0.8), s(arcs[i + 1].at + 1.1)) * 0.5 : 1);
        return q.behind ? null : <Tag key={i} q={q} o={o} text={ar.label} dy={-80 - i * 10} size={36} hot={ar.hot} />;
      })}
      {title && <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: FONT, perspective: 900, opacity: e(f, s(titleAt), s(titleAt) + 6) * (1 - e(f, s(d) - 10, s(d) - 2)) }}>
        <div style={{ display: "inline-block", fontWeight: 900, fontSize: 128, letterSpacing: 10, color: C.ink, transform: `translateZ(${(1 - e(f, s(titleAt), s(titleAt) + 14)) * 300}px) rotateX(${8 - 8 * e(f, s(titleAt), s(titleAt) + 14)}deg)`, textShadow: extrude(10, "#3c352c") }}>{title}</div>
        {sub && <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.orange, marginTop: 6, textShadow: "0 3px 12px #000" }}>{sub}</div>}
      </div>}
      <Vignette k={0.6} />
    </AbsoluteFill>
  );
};
