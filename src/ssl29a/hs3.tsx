// ssl29a · componentes únicos en 3D (vuelta 2 del evaluador: «hacelo en 3D»). Cada uno = UNA idea con un objeto que se
// entiende sin leer, en el set de la casa de Sachiko (set3d.tsx) con Blanquito-Sachiko haciendo lo que ella cuenta.
// La palabra va dentro de la escena y grande; nada arriba a la izquierda. Luces siempre montadas; lo que aparece se monta
// (nunca escala 0). Ninguno se repite en la tanda ssl29.
import React, { useMemo } from "react";
import * as THREE from "three";
import { H, Stage, cl, phys, eio, AMB, GRN, ICE, RED, TX, img } from "./hkit";
import { Set3D, Sachi, PZ, secuencia, sv, orbita, Box, Cyl, Cam3, V } from "./set3d";
import { mk, Zabuton, useCasaTex } from "./casa3d";
import { useTextures } from "./fx3d";
import { mezclar, Pose, resolver } from "./s3d/rig";
import { pose } from "./s3d/acciones";
import { staticFile } from "remotion";
import { P } from "./lib";

// palabra grande con contorno de tinta: se lee sobre el tatami claro y en el celular
const Tag: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; col?: string; size?: number }> = ({ tt, at, x, y, txt, col = TX, size = 60 }) => {
  const s = phys(tt, at, 7, 0.45); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -40}px) scale(${0.8 + 0.2 * s})`, opacity: cl(s * 2), fontWeight: 900, fontSize: Math.max(size, 56) * 1.12, letterSpacing: 2, color: col, whiteSpace: "nowrap",
    WebkitTextStroke: `${Math.max(6, size * 0.13)}px #2a1d12`, paintOrder: "stroke fill", textShadow: "0 8px 26px rgba(40,25,10,.45)" } as React.CSSProperties}>{txt}</div>;
};
const it = (h: H, i: number, d = 99) => h.items?.[i]?.at ?? d;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const S = 0.42;                                   // escala de Blanquito (≈1,78 de alto, a escala del tatami)
const HIP = 1.47;
// dónde queda la cabeza / un pie de una pose (en el mundo), para colgarle cosas (sombrero, plomada)
const headOf = (p: Pose, x = 0, z = 0, s = S): V => { const e = resolver(p); const c = e.cabeza.centro; return [x + c.x * s, c.y * s, z + c.z * s]; };
const toeOf = (p: Pose, d: "I" | "D", x = 0, z = 0, s = S): V => { const e = resolver(p); const c = d === "I" ? e.pieI.centro : e.pieD.centro; return [x + c.x * s, c.y * s, z + (c.z + 0.12) * s]; };
// sentada en silla (la del kit)
const chairSit = pose({ raiz: [0, -0.62, -0.3], torso: { x: 4 }, cabeza: { x: -3 } });
// piernas dobladas que caen a un lado (el péndulo); k = -1 izquierda … 1 derecha
const crook = (k: number): Pose => pose({ raiz: [0, 0.22 - HIP, -0.1], torso: { x: -18 }, cabeza: { x: 12 },
  manoI: { p: [0.35, -1.0, -0.45], polo: [1, 0, 0], forma: [0, 0, 1, 0, 0], giro: 0, dobla: 0, goma: 0.2, arqueo: 0 } as any,
  manoD: { p: [-0.35, -1.0, -0.45], polo: [-1, 0, 0], forma: [0, 0, 1, 0, 0], giro: 0, dobla: 0, goma: 0.2, arqueo: 0 } as any,
  pieI: { p: [0.18 + 0.5 * k, 0.09, 0.62], polo: [k * 1.4, 0.6, 1], yaw: 0, pitch: 0, goma: 0.3, arqueo: 0, ...({ p: [0.18 + 0.32 * k, 0.09, 0.62 - 0.12 * Math.abs(k)] }) } as any,
  pieD: { p: [-0.18 + 0.32 * k, 0.09, 0.62 - 0.12 * Math.abs(k)], polo: [k * 1.4, 0.6, 1], yaw: 0, pitch: 0, goma: 0.3, arqueo: 0 } as any });

// ---------------- texturas chicas ----------------
const txt = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => mk(w, h, draw);
const useTx = () => useMemo(() => ({
  checker: txt(256, 256, (g) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? "#c62828" : "#f6f1e7"; g.fillRect(x * 32, y * 32, 32, 32); } }),
  ruler: txt(64, 512, (g) => { g.fillStyle = "#f2c94c"; g.fillRect(0, 0, 64, 512); g.fillStyle = "#222"; for (let i = 0; i <= 30; i++) g.fillRect(0, 512 - i * 16, i % 5 ? 22 : 44, 3); }),
  carpet: txt(256, 256, (g) => { g.fillStyle = "#a8957a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(${90 + (i % 60)},${70 + (i % 40)},50,.35)`; g.fillRect((i * 37) % 256, (i * 91) % 256, 2, 2); } }),
  blanket: txt(256, 256, (g) => { g.fillStyle = "#7d8fa8"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#5d6f88"; g.lineWidth = 6; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(0, i * 32); g.lineTo(256, i * 32); g.stroke(); } }),
  bars: txt(256, 192, (g) => { ["#fff", "#ff0", "#0ff", "#0f0", "#f0f", "#f00", "#00f"].forEach((c, i) => { g.fillStyle = c; g.fillRect(i * 37, 0, 37, 150); }); g.fillStyle = "#111"; g.fillRect(0, 150, 256, 42); g.fillStyle = "#fff"; g.font = "bold 34px sans-serif"; g.textAlign = "center"; g.fillText("CM", 128, 184); }),
  sand: txt(32, 32, (g) => { g.fillStyle = "#e8c27a"; g.fillRect(0, 0, 32, 32); }),
}), []);
const numTx = (n: string | number, col = "#fff", bg = "") => txt(128, 128, (g) => { if (bg) { g.fillStyle = bg; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); } g.fillStyle = col; g.font = "bold 84px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(n), 64, 70); });
const usePhoto = (id: string) => useMemo(() => { const t = new THREE.TextureLoader().load(staticFile("img/" + P + id + ".jpg")); t.colorSpace = THREE.SRGBColorSpace; return t; }, [id]);
// un número/letrero apoyado en el piso o en una pared (plano con textura)
const Plate: React.FC<{ p: V; s: number; map: THREE.Texture; rot?: V; op?: number; glow?: number }> = ({ p, s, map, rot = [-Math.PI / 2, 0, 0], op = 1, glow = 0 }) =>
  <mesh position={p} rotation={rot}><planeGeometry args={[s, s]} /><meshStandardMaterial map={map} transparent opacity={op} emissive="#ffffff" emissiveMap={map} emissiveIntensity={glow} depthWrite={false} /></mesh>;
// anillo de luz en el piso (lo nombrado se ilumina)
const Ring: React.FC<{ p: V; r: number; k: number; col?: string }> = ({ p, r, k, col = "#ffb347" }) =>
  k < 0.01 ? null : <mesh position={p} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[r * 0.8, r, 64]} /><meshBasicMaterial color={col} transparent opacity={0.75 * cl(k)} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} /></mesh>;

// ---------------- objetos ----------------
const Table: React.FC<{ p: V; w?: number; d?: number; h?: number; rotZ?: number; c?: string; glow?: number }> = ({ p, w = 1.0, d = 0.6, h = 0.33, rotZ = 0, c = "#7a4e2c", glow = 0 }) =>
  <group position={p} rotation={[0, 0, rotZ]}>
    <Box p={[0, h - 0.025, 0]} s={[w, 0.05, d]} c={c} r={0.55} e="#ffb347" ei={0.3 * glow} />
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <Box key={i} p={[a * (w / 2 - 0.06), (h - 0.05) / 2, b * (d / 2 - 0.06)]} s={[0.05, h - 0.05, 0.05]} c="#5a3820" />)}
  </group>;
const RoundTable: React.FC<{ p: V; r?: number; glow?: number }> = ({ p, r = 0.45, glow = 0 }) =>
  <group position={p}><Cyl p={[0, 0.31, 0]} r={r} h={0.04} c="#8a5a34" rough={0.45} e="#ffb347" ei={0.3 * glow} />{[0, 1, 2, 3].map((i) => <Box key={i} p={[Math.cos(i * 1.57) * r * 0.6, 0.15, Math.sin(i * 1.57) * r * 0.6]} s={[0.05, 0.3, 0.05]} c="#5a3820" />)}</group>;
const Couch: React.FC<{ p: V; armGlow?: number }> = ({ p, armGlow = 0 }) =>
  <group position={p}>
    <Box p={[0, 0.42, 0]} s={[1.5, 0.28, 0.75]} c="#8f7a63" r={0.95} rad={0.08} />
    <Box p={[0, 0.78, -0.3]} s={[1.5, 0.5, 0.18]} c="#7d6a55" r={0.95} rad={0.08} />
    {[-1, 1].map((k) => <Box key={k} p={[k * 0.8, 0.6, 0]} s={[0.16, 0.5, 0.75]} c="#8f7a63" r={0.95} rad={0.07} e="#ffb347" ei={k === -1 ? 0.6 * armGlow : 0} />)}
    {[[-0.7, -0.3], [0.7, -0.3], [-0.7, 0.3], [0.7, 0.3]].map(([x, z], i) => <Cyl key={i} p={[x, 0.14, z]} r={0.03} h={0.28} c="#3a2a1c" />)}
  </group>;
const Glasses: React.FC<{ p: V; rotY?: number; dim?: number }> = ({ p, rotY = 0, dim = 0 }) =>
  <group position={p} rotation={[0, rotY, 0]}>
    {[-0.055, 0.055].map((x) => <mesh key={x} position={[x, 0.03, 0]} rotation={[Math.PI / 2.3, 0, 0]}><torusGeometry args={[0.045, 0.007, 8, 32]} /><meshStandardMaterial color="#d9b25a" metalness={0.8} roughness={0.25} emissive="#d9b25a" emissiveIntensity={0.3 * (1 - dim)} /></mesh>)}
    <Box p={[0, 0.035, 0]} s={[0.03, 0.008, 0.008]} c="#d9b25a" m={0.8} />
  </group>;
const Hourglass: React.FC<{ p: V; k: number; glow?: number; s?: number }> = ({ p, k, glow = 0, s = 1 }) =>
  <group position={p} scale={s}>
    <Cyl p={[0, 0.02, 0]} r={0.16} h={0.04} c="#6b4a2c" /><Cyl p={[0, 0.62, 0]} r={0.16} h={0.04} c="#6b4a2c" />
    {[0, 1, 2].map((i) => <Cyl key={i} p={[Math.cos(i * 2.1) * 0.13, 0.32, Math.sin(i * 2.1) * 0.13]} r={0.012} h={0.6} c="#6b4a2c" />)}
    <Cyl p={[0, 0.465, 0]} r={0.12} r2={0.012} h={0.27} c="#dfeefa" op={0.25} rough={0.05} e="#ffb347" ei={0.4 * glow} />
    <Cyl p={[0, 0.175, 0]} r={0.012} r2={0.12} h={0.27} c="#dfeefa" op={0.25} rough={0.05} e="#ffb347" ei={0.4 * glow} />
    {k < 0.98 && <Cyl p={[0, 0.34 + 0.12 * (1 - k) * 0.5 + 0.005, 0]} r={0.1 * (1 - k) + 0.01} r2={0.012} h={0.2 * (1 - k) + 0.02} c="#e8c27a" />}
    {k > 0.02 && <Cyl p={[0, 0.05 + 0.08 * k, 0]} r={0.02} r2={0.1 * Math.sqrt(k) + 0.012} h={0.16 * k + 0.01} c="#e8c27a" />}
    {k > 0.02 && k < 0.98 && <Cyl p={[0, 0.2, 0]} r={0.004} h={0.28} c="#e8c27a" />}
  </group>;
const Dial: React.FC<{ p: V; ang: number; s?: number; c?: string; rim?: string; sweep?: number; rotY?: number; marks?: number }> = ({ p, ang, s = 1, c = "#f6f1e7", rim = "#c9ccd2", sweep = 0, rotY = 0, marks = 12 }) =>
  <group position={p} rotation={[0, rotY, 0]} scale={s}>
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.5, 0.5, 0.12, 64]} /><meshStandardMaterial color={rim} metalness={0.6} roughness={0.3} /></mesh>
    <mesh position={[0, 0, 0.062]}><circleGeometry args={[0.44, 64]} /><meshStandardMaterial color={c} roughness={0.6} /></mesh>
    {sweep > 0.005 && <mesh position={[0, 0, 0.064]}><circleGeometry args={[0.43, 64, Math.PI / 2 - sweep * Math.PI * 2, sweep * Math.PI * 2]} /><meshBasicMaterial color="#ff6a5a" transparent opacity={0.55} toneMapped={false} /></mesh>}
    {Array.from({ length: marks }, (_, i) => { const a = (i / marks) * Math.PI * 2; return <Box key={i} p={[Math.sin(a) * 0.38, Math.cos(a) * 0.38, 0.066]} s={[0.018, 0.06, 0.004]} c="#333" rot={[0, 0, -a]} cast={false} />; })}
    <group position={[0, 0, 0.07]} rotation={[0, 0, -ang]}><Box p={[0, 0.17, 0]} s={[0.03, 0.34, 0.01]} c="#c0392b" cast={false} /></group>
    <Cyl p={[0, 0, 0.075]} r={0.03} h={0.01} c="#222" rot={[Math.PI / 2, 0, 0]} />
  </group>;
// sombrero de hongo
const Cap: React.FC<{ p: V; rot?: V }> = ({ p, rot = [0, 0, 0] }) =>
  <group position={p} rotation={rot}>
    <mesh castShadow><sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#b5523b" roughness={0.5} /></mesh>
    {[[0.08, 0.15, 0.05], [-0.09, 0.13, 0.08], [0.02, 0.18, -0.08], [-0.05, 0.1, -0.15], [0.14, 0.08, -0.09]].map((q, i) => <mesh key={i} position={q as V}><sphereGeometry args={[0.03, 12, 8]} /><meshStandardMaterial color="#f6e6cc" /></mesh>)}
  </group>;
const Wall: React.FC<{ p: V; w?: number; h?: number; glow?: number }> = ({ p, w = 2.4, h = 1.7, glow = 0 }) =>
  <group position={p}><Box p={[0, h / 2, 0]} s={[w, h, 0.1]} c="#efe6d4" r={0.95} e="#ffd9a0" ei={0.25 * glow} /><Box p={[0, 0.06, 0.06]} s={[w, 0.12, 0.03]} c="#6b4a2c" /></group>;

// ---------------- un componente = Stage (transición) + Set3D (escena) + palabras ----------------
type F = React.FC<{ t: number; h: H }>;
const dolly = (c: Cam3, d: number, ly: number): Cam3 => { const l: V = [c.l[0], c.l[1] + ly, c.l[2]]; return { p: [l[0] + (c.p[0] - c.l[0]) * d, l[1] + (c.p[1] - c.l[1]) * d, l[2] + (c.p[2] - c.l[2]) * d], l, fov: c.fov }; };
const Hero: React.FC<{ t: number; h: H; mode: any; cam: (tt: number) => Cam3; set?: any; scene: (tt: number) => React.ReactNode; over?: (tt: number) => React.ReactNode; d?: number; ly?: number }> = ({ t, h, mode, cam, set = {}, scene, over, d = 1.3, ly = 0.12 }) =>
  <Stage t={t} h={h} mode={mode} bare>{(tt) => <>
    <Set3D cam={dolly(cam(tt), d, ly)} {...(typeof set === "function" ? set(tt) : set)}>{scene(tt)}</Set3D>
    {over?.(tt)}
  </>}</Stage>;
const C = (p: V, l: V, fov = 32): Cam3 => ({ p, l, fov });
const brass = "#b08a3e";

// ---------------- piezas de la vuelta 3 ----------------
// odómetro de rodillos: cada rueda es un decágono de caras con dígitos; las unidades ruedan continuo y arrastran a las decenas
const DIG = Array.from({ length: 10 }, (_, i) => i);
const Wheel: React.FC<{ v: number; r: number; maps: THREE.Texture[] }> = ({ v, r, maps }) =>
  <group rotation={[-v * (Math.PI / 5), 0, 0]}>
    {DIG.map((i) => { const f = i * (Math.PI / 5); return <mesh key={i} position={[0, -r * Math.sin(f), r * Math.cos(f)]} rotation={[f, 0, 0]}><planeGeometry args={[r * 0.95, r * 0.62]} /><meshStandardMaterial map={maps[i]} roughness={0.5} /></mesh>; })}
    <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[r * 0.93, r * 0.93, r * 0.9, 10]} /><meshStandardMaterial color="#1c1612" /></mesh>
  </group>;
const Odo: React.FC<{ p: V; n: number; digits: number; s?: number; glow?: number; rotY?: number }> = ({ p, n, digits, s = 1, glow = 0, rotY = 0 }) => {
  const maps = useMemo(() => DIG.map((d) => txt(160, 104, (g) => { g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, 160, 104); g.fillStyle = "#1e1813"; g.font = "bold 92px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(d), 80, 58); })), []);
  const r = 0.16, w = r * 0.95, W = digits * (w + 0.02) + 0.08;
  const val = (k: number) => { const P10 = 10 ** k, base = Math.floor(n / P10) % 10; if (k === 0) return n % 10; const rest = n % P10; return base + cl(rest - (P10 - 1)); };
  return <group position={p} rotation={[0, rotY, 0]} scale={s}>
    <Box p={[0, 0, -0.04]} s={[W + 0.1, r * 2.3, r * 2]} c={brass} m={0.7} r={0.3} />
    {Array.from({ length: digits }, (_, i) => <group key={i} position={[(digits - 1 - i - (digits - 1) / 2) * (w + 0.02), 0, r * 0.15]}><Wheel v={val(i)} r={r} maps={maps} /></group>)}
    <Box p={[0, r * 0.62, r * 1.2]} s={[W + 0.1, r * 0.75, 0.06]} c={brass} m={0.75} r={0.25} e="#ffb347" ei={0.4 * glow} />
    <Box p={[0, -r * 0.62, r * 1.2]} s={[W + 0.1, r * 0.75, 0.06]} c={brass} m={0.75} r={0.25} e="#ffb347" ei={0.4 * glow} />
    {[-1, 1].map((k) => <Box key={k} p={[k * (W / 2 + 0.02), 0, r * 1.2]} s={[0.07, r * 2.0, 0.06]} c={brass} m={0.75} r={0.25} />)}
  </group>;
};
// vapor: bolitas translúcidas que suben, crecen y se apagan (nunca titila)
const Steam: React.FC<{ p: V; t: number; k?: number; n?: number }> = ({ p, t, k = 1, n = 7 }) => k < 0.01 ? null :
  <group position={p}>{Array.from({ length: n }, (_, i) => { const u = (t * 0.35 + i / n) % 1; return <mesh key={i} position={[0.03 * Math.sin(u * 6 + i), u * 0.42, 0.02 * Math.cos(u * 5 + i)]}><sphereGeometry args={[0.025 + u * 0.05, 12, 8]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.35 * k * Math.sin(Math.PI * u)} depthWrite={false} /></mesh>; })}</group>;
// flecha 3D gruesa (objeto, no texto)
const Arrow: React.FC<{ p: V; rot?: V; c: string; s?: number; k?: number }> = ({ p, rot = [0, 0, 0], c, s = 1, k = 1 }) => k < 0.01 ? null :
  <group position={p} rotation={rot} scale={s * Math.max(0.05, Math.min(1, k))}>
    <Cyl p={[0, 0.16, 0]} r={0.035} h={0.32} c={c} e={c} ei={0.5} />
    <mesh position={[0, 0.38, 0]} castShadow><coneGeometry args={[0.08, 0.14, 24]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} /></mesh>
  </group>;
// taco de calendario: bloque con la hoja de arriba; las arrancadas vuelan con giro y caen
const tearTex = (label: string, big: string, col: string) => txt(256, 300, (g) => { g.fillStyle = "#fbf7ee"; g.fillRect(0, 0, 256, 300); g.fillStyle = col; g.fillRect(0, 0, 256, 74); g.fillStyle = "#fff"; g.font = "bold 40px sans-serif"; g.textAlign = "center"; g.fillText(label, 128, 52); g.fillStyle = "#2a2420"; g.font = "bold 130px Georgia, serif"; g.fillText(big, 128, 230); });
const TearPad: React.FC<{ p: V; pages: THREE.Texture[]; tears: number[]; t: number; s?: number; stamp?: number; stampMap?: THREE.Texture }> = ({ p, pages, tears, t, s = 1, stamp = 0, stampMap }) => {
  const cur = tears.filter((a) => t > a).length;
  return <group position={p} scale={s}>
    <Box p={[0, 0, -0.03]} s={[0.56, 0.66, 0.06]} c="#ece4d2" r={0.9} />
    <Box p={[0, 0.36, 0]} s={[0.6, 0.08, 0.09]} c="#8a2a22" r={0.6} />
    {cur < pages.length && <mesh position={[0, -0.02, 0.006]}><planeGeometry args={[0.52, 0.6]} /><meshStandardMaterial map={pages[cur]} roughness={0.9} /></mesh>}
    {tears.map((a, i) => { const u = t - a; if (u < 0 || u > 1.6 || i >= pages.length) return null; const k = phys(t, a, 3, 0.5);
      return <mesh key={i} position={[0.35 * u, -0.02 + 0.5 * u - 1.2 * u * u, 0.05 + 0.3 * u]} rotation={[-1.4 * u, 0.6 * u, 1.1 * Math.min(1, k)]}><planeGeometry args={[0.52, 0.6]} /><meshStandardMaterial map={pages[i]} side={THREE.DoubleSide} transparent opacity={cl(1.6 - u)} /></mesh>; })}
    {stamp > 0.01 && stampMap && <mesh position={[0.1, -0.12, 0.012]} rotation={[0, 0, -0.2]} scale={1 + 0.4 * (1 - Math.min(1, stamp))}><planeGeometry args={[0.44, 0.44]} /><meshBasicMaterial map={stampMap} transparent opacity={Math.min(1, stamp)} toneMapped={false} /></mesh>}
  </group>;
};
const stampTex = (word: string, col: string) => txt(256, 256, (g) => { g.strokeStyle = col; g.lineWidth = 16; g.beginPath(); g.arc(128, 128, 110, 0, 7); g.stroke(); g.fillStyle = col; g.font = "bold 62px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(word, 128, 132); });
// dedo de arcilla que baja y aprieta (el mismo material que Blanquito)
const Finger: React.FC<{ p: V; n: number; press: number }> = ({ p, n, press }) =>
  <group position={[p[0], p[1] + 0.32 * (1 - press), p[2]]}>{Array.from({ length: n }, (_, i) => { const x = (i - (n - 1) / 2) * 0.07;
    return <group key={i} position={[x, 0, 0]}><Cyl p={[0, 0.2, 0]} r={0.028} h={0.36} c="#f1ede6" rough={0.7} /><mesh position={[0, 0.02, 0]}><sphereGeometry args={[0.028, 16, 10]} /><meshStandardMaterial color="#f1ede6" roughness={0.7} /></mesh></group>; })}</group>;
// cuerda de plomada (desde a hasta b, gruesa) con la pesa de bronce
const Cord: React.FC<{ a: V; b: V; w?: number; c?: string }> = ({ a, b, w = 0.012, c = "#c9a24e" }) => {
  const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), L = d.length(), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  return <mesh position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]} quaternion={q}><cylinderGeometry args={[w, w, L, 10]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.25} /></mesh>;
};
const bodyOf = (p: Pose, x = 0, z = 0, s = S) => { const e = resolver(p); return { pel: [x + e.pelvis.x * s, e.pelvis.y * s, z + e.pelvis.z * s] as V, hom: [x + e.hombro.x * s, e.hombro.y * s, z + e.hombro.z * s] as V, cue: [x + e.cuello.x * s, e.cuello.y * s, z + e.cuello.z * s] as V }; };
const withHands = (p: Pose, f: (q: Pose) => void): Pose => { const q: Pose = JSON.parse(JSON.stringify(p)); f(q); return q; };
const Big: React.FC<{ tt: number; at: number; txt: string; col?: string; y?: number; x?: number; size?: number }> = ({ tt, at, txt: w, col = AMB, y = 930, x = 960, size = 84 }) => <Tag tt={tt} at={at} x={x} y={y} txt={w} col={col} size={size} />;

// 0:04 · los lentes se escapan bajo el sillón (a ras del piso); ella estira el brazo y no llega; la rodilla late roja
export const G_glasses: F = ({ t, h }) => { const a1 = it(h, 0), a2 = Math.min(it(h, 1), 6.2);
  return <Hero d={1.75} ly={0.15} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.0, 0.32, 1.9], [0.15, 0.12, -0.2]), C([-0.5, 0.45, 2.1], [0.0, 0.2, -0.2]), 9)}
    set={(tt: number) => ({ spot: [-0.6, 0, 0.2] as V, spotK: cl((tt - a1) * 1.5) })}
    scene={(tt) => { const sl = phys(tt, 0.3, 2.6, 0.75), hurt = tt > a1 ? (0.5 + 0.5 * Math.sin((tt - a1) * 7)) * Math.exp(-(tt - a1) * 0.5) : 0, reach = sv(tt, a2 - 1.2, a2);
      const gx = lerp(0.1, 0.95, sl), dark = cl((sl - 0.55) * 2.2);
      const p = withHands(secuencia([[0, PZ.kneel], [0.5, PZ.four]], tt), (q) => { q.manoD.p = [-0.2 - 0.0 * reach, -0.18 + 0.1 * reach, 0.92 + 0.45 * reach]; q.torso.x += 6 * reach; });
      return <>
        <Couch p={[1.25, 0, -0.35]} armGlow={0} />
        <mesh position={[1.25, 0.045, -0.3]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.6, 0.9]} /><meshBasicMaterial color="#120c06" transparent opacity={0.55} depthWrite={false} /></mesh>
        <group scale={3.6} position={[gx, 0.05, lerp(0.7, -0.25, sl)]}><Glasses p={[0, 0, 0]} rotY={sl * 1.6} dim={dark} /></group>
        <Sachi p={p} t={tt} x={-0.85} z={0.25} rotY={70} s={S} expr={tt > a1 ? "triste" : "sorprendido"} />
        <mesh position={[-0.82, 0.1, 0.36]}><sphereGeometry args={[0.1 + 0.05 * hurt, 20, 14]} /><meshBasicMaterial color="#ff4a3d" transparent opacity={0.85 * hurt} toneMapped={false} depthWrite={false} /></mesh>
        <Ring p={[-0.82, 0.06, 0.36]} r={0.16 + 0.14 * hurt} k={hurt} col="#ff5a4a" />
        {reach > 0.3 && Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[lerp(-0.35, 0.75, i / 5), 0.12, lerp(0.3, -0.1, i / 5)]}><sphereGeometry args={[0.012, 8, 6]} /><meshBasicMaterial color="#ffb347" transparent opacity={0.8 * cl((reach - 0.3) * 3 - i * 0.2)} toneMapped={false} /></mesh>)}
      </>; }} />; };

// 0:41 · un día entero en el piso: cuenco, té y ropa caen con rebote; el odómetro de bronce rueda y clava 101 cuando ella se para
export const G_floorday: F = ({ t, h }) => { const A = [0.4, it(h, 0), it(h, 1)], up = it(h, 2);
  const yrs = useMemo(() => txt(256, 96, (g) => { g.fillStyle = "#b08a3e"; g.fillRect(0, 0, 256, 96); g.fillStyle = "#2a1d12"; g.font = "bold 64px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("YEARS", 128, 52); }), []);
  return <Hero d={0.85} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([2.0, 1.7, 3.0], [-0.2, 0.45, 0]), C([1.0, 1.3, 3.1], [-0.2, 0.5, 0]), 9)}
    set={(tt: number) => ({ spot: [0, 0, 0] as V, spotK: cl((tt - up) * 1.5) })}
    scene={(tt) => { const d = A.map((a) => phys(tt, a, 6, 0.38)), n = Math.min(101, 101 * eio(tt, 0.3, up + 0.6));
      return <>
        {d[0] > 0.01 && <group position={[0.55, 0.05 + (1 - d[0]) * 1.4, 0.45]} scale={1.8}><Cyl p={[0, 0.06, 0]} r={0.11} r2={0.06} h={0.12} c="#f4f0e6" rough={0.3} /><mesh position={[0, 0.115, 0]}><sphereGeometry args={[0.095, 24, 12, 0, 6.3, 0, 1.4]} /><meshStandardMaterial color="#ffffff" roughness={0.8} /></mesh></group>}
        {d[1] > 0.01 && <group position={[-0.55, 0.05 + (1 - d[1]) * 1.4, 0.5]} scale={1.8}><Cyl p={[0, 0.07, 0]} r={0.07} h={0.14} c="#6f8a5a" rough={0.4} /></group>}
        <Steam p={[-0.55, 0.32, 0.5]} t={tt} k={cl((tt - A[1] - 0.4) * 2)} />
        {d[2] > 0.01 && <group position={[0.7, 0.05 + (1 - d[2]) * 1.4, -0.45]} scale={1.5}>{[0, 1, 2].map((i) => <Box key={i} p={[0, 0.03 + i * 0.055, 0]} s={[0.4, 0.05, 0.3]} c={["#e8e2d4", "#b8cde0", "#e8d4c4"][i]} r={0.95} rad={0.02} />)}</group>}
        <Sachi p={secuencia([[0, PZ.seiza], [up, PZ.halfLean], [up + 0.8, PZ.stand]], tt)} t={tt} s={S} expr="feliz" />
        <Odo p={[-1.25, 0.75, -0.6]} n={n} digits={3} s={1.3} rotY={0.35} glow={cl((tt - up - 0.4) * 2)} />
        <Box p={[-1.25, 0.25, -0.6]} s={[0.12, 0.5, 0.12]} c="#6b4a2c" />
        <Plate p={[-1.2, 0.47, -0.48]} s={0.42} map={yrs} rot={[0, 0.35, 0]} glow={0.3 * cl((tt - up - 0.4) * 2)} />
      </>; }} />; };

// 1:01 · diez minutos por día: baja y sube sobre el zabuton; cada vuelta suma un cubito a la pila; al lado la arena cae
export const G_tenmin: F = ({ t, h }) => { const b = 0.6, per = 1.5;
  return <Hero d={0.9} ly={0.18} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([1.8, 1.0, 2.6], [0.25, 0.5, 0]), C([0.8, 0.95, 2.9], [0.25, 0.5, 0]), 7.5)}
    scene={(tt) => { const u = Math.max(0, tt - b), cyc = (1 - Math.cos(u / per * Math.PI * 2)) / 2, reps = Math.floor((u + per / 2) / per);
      return <>
        <Zabuton p={[0, 0.05, 0]} c="#3b4f7a" />
        <Sachi p={mezclar(PZ.stand, PZ.seiza, cyc)} t={tt} s={S} rotY={20} expr="feliz" />
        {Array.from({ length: Math.min(6, reps) }, (_, i) => { const s = phys(tt, b + per / 2 + i * per, 7, 0.4); return <Box key={i} p={[0.8, 0.07 + i * 0.13 + (1 - Math.min(1, s)) * 0.5, 0.15]} s={[0.12, 0.12, 0.12]} c={i % 2 ? "#e9b44c" : "#d9773a"} r={0.5} rad={0.02} />; })}
        <Hourglass p={[-0.85, 0.05, -0.15]} k={cl(tt / 7.5)} s={1.3} glow={0.3} />
      </>; }} />; };

// 1:13 · nueve escalones; el 9 crece al doble y se enciende, los otros se apagan; ella sube sin manos (las manos abiertas a los costados)
export const G_ninesteps: F = ({ t, h }) => { const n9 = it(h, 0);
  const nums = useMemo(() => Array.from({ length: 9 }, (_, i) => numTx(i + 1, i === 8 ? "#1f6aa8" : "#2a2420")), []);
  const tt0 = useCasaTex();
  return <Hero d={1.15} ly={0.35} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.6, 1.7, 3.6], [0.9, 0.8, -0.9]), C([2.0, 1.5, 2.9], [1.8, 1.0, -1.2]), 8.5)}
    set={(tt: number) => ({ spot: [2.6, 0.9, -1.6] as V, spotK: cl((tt - n9) * 2) })}
    scene={(tt) => { const g9 = sv(tt, n9 - 0.4, n9 + 0.4), up = sv(tt, n9 + 0.6, n9 + 2.0);
      const p = withHands(mezclar(PZ.seiza, PZ.stand, up), (q) => { q.manoI.p = [0.55, -0.7, 0.15]; q.manoD.p = [-0.55, -0.7, 0.15]; });
      return <>
        {Array.from({ length: 9 }, (_, i) => { const s = phys(tt, 0.2 + i * 0.32, 7, 0.45); if (s <= 0.01) return null; const last = i === 8, x = -2.2 + i * 0.6, z = 0.4 - i * 0.25, y = i * 0.1, gs = last ? 1 + g9 : 1;
          return <group key={i} position={[x, (1 - s) * 1.0, z]} scale={[gs, 1 + (last ? 0.3 * g9 : 0), gs]}>
            <Box p={[0, y / 2 + 0.06, 0]} s={[0.56, y + 0.12, 0.62]} c={last ? "#ffffff" : new THREE.Color("#ffffff").lerp(new THREE.Color("#9a9080"), 0.5 * g9).getStyle()} map={tt0.tatami} r={0.9} e="#ffd27a" ei={last ? 0.45 * g9 : 0} />
            <Plate p={[0, y / 2 + 0.06, 0.315]} s={last ? 0.46 : 0.4} rot={[0, 0, 0]} map={nums[i]} op={last ? 1 : 1 - 0.5 * g9} glow={last ? 0.5 * g9 : 0} />
          </group>; })}
        <group position={[2.6, 0.92 * (1 + 0.3 * g9), -1.6]}><Sachi p={p} t={tt} rotY={-30} s={S} expr="feliz" /></group>
        {g9 > 0.1 && Array.from({ length: 14 }, (_, i) => { const u = (tt * 0.4 + i / 14) % 1; return <mesh key={i} position={[2.6 + 0.6 * Math.cos(i * 2.4), 1.0 + u * 1.2, -1.6 + 0.6 * Math.sin(i * 2.4)]}><sphereGeometry args={[0.018, 8, 6]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.8 * g9 * Math.sin(Math.PI * u)} toneMapped={false} /></mesh>; })}
      </>; }} />; };

// 1:32 · no soy médica: el estetoscopio cae y se enrosca en el piso; el delantal de cuadros vuela del gancho y se le anuda en la cintura
export const G_apron: F = ({ t, h }) => { const g = it(h, 0); const T = useTx();
  const B = useMemo(() => bodyOf(PZ.stand, 0, 0), []);
  return <Hero d={1.25} ly={0.2} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.5, 0.95, 2.3], [0.15, 0.6, -0.3]), C([-0.4, 0.85, 2.1], [0.1, 0.55, -0.3]), 7)}
    set={(tt: number) => ({ spot: [0, 0, -0.3] as V, spotK: cl((tt - g) * 2), warm: 0.5 })}
    scene={(tt) => { const fall = phys(tt, 1.0, 3.5, 0.45), tie = phys(tt, g, 4.5, 0.5), tk = Math.min(1, tie);
      const ap: V = [lerp(0.75, B.pel[0], tk), lerp(1.25, B.pel[1] - 0.12, tk), lerp(-0.9, B.pel[2] + 0.11, tk)];
      return <>
        <Box p={[0.75, 1.55, -0.95]} s={[0.04, 0.04, 0.12]} c="#6b4a2c" />
        <group position={ap} rotation={[0.25 * (1 - tk), 0, 0.3 * (1 - tk) * Math.sin(tt * 3)]}>
          <Box p={[0, 0, 0]} s={[0.36, 0.42, 0.025]} c="#ffffff" map={T.checker} r={0.9} rad={0.01} e="#ffb347" ei={0.25 * cl((tt - g) * 2)} />
          <Box p={[0, 0.26, 0]} s={[0.2, 0.12, 0.02]} c="#ffffff" map={T.checker} rad={0.008} />
          <Box p={[0.07, -0.06, 0.016]} s={[0.12, 0.1, 0.01]} c="#f6f1e7" rad={0.004} />
          {tk > 0.8 && <><Box p={[0, 0.17, -0.04]} s={[0.4, 0.025, 0.1]} c="#c62828" rad={0.008} /><mesh position={[0.21, 0.17, -0.02]}><torusGeometry args={[0.03, 0.01, 8, 16]} /><meshStandardMaterial color="#c62828" /></mesh></>}
        </group>
        <group position={[lerp(B.cue[0], -0.4, cl(fall)), lerp(B.cue[1] - 0.05, 0.03, cl(fall)), lerp(B.cue[2] + 0.1, 0.35, cl(fall))]} rotation={[Math.PI / 2 * cl(fall), 0, 0.5 * cl(fall)]} scale={2.8}>
          <mesh><torusGeometry args={[0.1, 0.009, 8, 40, Math.PI * (1 + 0.6 * cl(fall))]} /><meshStandardMaterial color="#5d636b" metalness={0.5} roughness={0.35} /></mesh>
          <mesh position={[0.1, -0.02, 0]}><cylinderGeometry args={[0.035, 0.035, 0.015, 24]} /><meshStandardMaterial color="#c9ccd2" metalness={0.8} roughness={0.2} /></mesh>
        </group>
        <Sachi p={PZ.stand} t={tt} s={S} rotY={-5} expr={tt > g ? "feliz" : "neutral"} />
      </>; }} />; };

// 2:24 · la tía en la silla, adelante y sola; atrás la familia llega de a uno a la mesa con comida humeante; ella gira la cabeza y baja los hombros
export const G_cornerchair: F = ({ t, h }) => { const a = it(h, 0), fam = it(h, 1);
  return <Hero d={1.5} ly={0.25} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([1.9, 1.1, 2.4], [0.5, 0.55, -0.6]), C([1.5, 0.95, 2.0], [0.65, 0.55, -0.4]), 8)}
    set={(tt: number) => ({ spot: [1.0, 0, 0.2] as V, spotK: cl((tt - a) * 1.5), warm: 0.6 })}
    scene={(tt) => { const look = sv(tt, fam, fam + 1.2);
      return <>
        <RoundTable p={[-0.7, 0.05, -1.4]} r={0.5} />
        {[[-0.85, -1.3], [-0.55, -1.5], [-0.7, -1.2]].map(([x, z], i) => <group key={i}><Cyl p={[x, 0.4, z]} r={0.085} r2={0.05} h={0.08} c="#f4f0e6" /><mesh position={[x, 0.44, z]}><sphereGeometry args={[0.06, 16, 8, 0, 6.3, 0, 1.3]} /><meshStandardMaterial color={["#f2e8d0", "#d9773a", "#7fae5a"][i]} roughness={0.7} /></mesh><Steam p={[x, 0.42, z]} t={tt + i} k={0.8} n={4} /></group>)}
        {[[-0.7, -2.15, 0], [-1.45, -1.4, 90], [0.05, -1.4, -90], [-0.7, -0.65, 180]].map(([x, z, r], i) => { const s = phys(tt, 0.4 + i * 0.7, 6, 0.45); if (s <= 0.01) return null;
          return <group key={i} position={[0, (1 - Math.min(1, s)) * 0.6, 0]}><Sachi p={PZ.seiza} t={tt + i} x={x} z={z} rotY={r} s={S * 0.85} color={["#e9d8c0", "#d8e4ee", "#ecd9d9", "#e6e6d0"][i]} expr="feliz" /></group>; })}
        <group position={[1.0, 0.05, 0.2]} rotation={[0, -0.4, 0]}>
          <Box p={[0, 0.42, 0]} s={[0.42, 0.05, 0.42]} c="#7a4e2c" /><Box p={[0, 0.75, -0.19]} s={[0.42, 0.6, 0.04]} c="#7a4e2c" />
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([p, q], i) => <Box key={i} p={[p * 0.18, 0.2, q * 0.18]} s={[0.04, 0.4, 0.04]} c="#5a3820" />)}
        </group>
        <Sachi p={withHands(chairSit, (q) => { q.cabeza.y += -40 * look; q.torso.x += 22 * look; q.cabeza.x += 28 * look; })} t={tt} x={1.0} z={0.25} rotY={-23} s={S} color="#cfc8be" expr={look > 0.5 ? "triste" : "neutral"} />
      </>; }} />; };

// 2:53 · los zabuton caen de a uno con rebote; la regla de madera se ilumina y el cursor sube a 15; ella se sienta arriba
export const G_cushheight: F = ({ t, h }) => { const dn = it(h, 0);
  const lab = useMemo(() => txt(256, 128, (g) => { g.fillStyle = "#c0392b"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#fff"; g.font = "bold 86px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("15 cm", 128, 68); }), []);
  const rul = useMemo(() => txt(96, 512, (g) => { g.fillStyle = "#d9b27a"; g.fillRect(0, 0, 96, 512); g.fillStyle = "#3a2618"; for (let i = 0; i <= 20; i++) g.fillRect(0, 500 - i * 24, i % 5 ? 30 : 60, 4); g.font = "bold 30px sans-serif"; [5, 10, 15, 20].forEach((n) => g.fillText(String(n), 60, 512 - n * 24 + 4)); }), []);
  return <Hero d={1.2} ly={0.22} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([1.6, 0.75, 2.1], [0.1, 0.35, 0]), C([1.1, 0.85, 2.4], [0.05, 0.4, 0]), 9)}
    set={(tt: number) => ({ spot: [0, 0, 0] as V, spotK: cl((tt - 1.6) * 1.5) })}
    scene={(tt) => { const c1 = phys(tt, 0.2, 5, 0.38), c2 = phys(tt, 1.0, 5, 0.38), cur = phys(tt, 1.8, 4, 0.5), sit = sv(tt, dn, dn + 1.5), sq = tt > dn + 1.4 ? 0.06 * Math.exp(-(tt - dn - 1.4) * 4) * Math.sin((tt - dn - 1.4) * 20) : 0;
      return <>
        {c1 > 0.01 && <group position={[0, (1 - c1) * 1.2, 0]}><Zabuton p={[0, 0.05, 0]} c="#3b4f7a" fold={1} /></group>}
        {c2 > 0.01 && <group position={[0, (1 - c2) * 1.4, 0]} scale={[1, 1 - sq * (sit > 0.95 ? 1 : 0), 1]}><Zabuton p={[0, 0.21, 0]} c="#e8b8a0" fold={1} /></group>}
        <group position={[0.45, 0.05, 0.12]}>
          <mesh position={[0, 0.25, 0]}><boxGeometry args={[0.06, 0.5, 0.02]} /><meshStandardMaterial map={rul} roughness={0.6} emissive="#ffd27a" emissiveIntensity={0.15 * cl(cur)} /></mesh>
          <group position={[0, 0.36 * Math.min(1.05, cur) + 0.002, 0.02]}><Box p={[0, 0, 0]} s={[0.12, 0.02, 0.04]} c="#c0392b" /><mesh position={[0.17, 0.0, 0.0]}><planeGeometry args={[0.2, 0.1]} /><meshBasicMaterial map={lab} toneMapped={false} transparent opacity={cl(cur * 2)} /></mesh></group>
        </group>
        <group position={[0, 0.33 * sit ** 4, 0]}><Sachi p={mezclar(PZ.stand, PZ.seiza, sit)} t={tt} x={-0.05} z={lerp(-0.55, 0.05, sv(tt, dn - 0.8, dn))} s={S} rotY={60} expr="feliz" /></group>
      </>; }} />; };

// 3:30 · la tía Fumi: el taco del calendario pierde hojas (vuelan); con cada hoja un almohadón menos; en primavera, directo al tatami
export const G_springcal: F = ({ t, h }) => { const m2 = it(h, 0), sp = it(h, 1);
  const pages = useMemo(() => [tearTex("WINTER", "1", "#5b7fa8"), tearTex("WINTER", "2", "#5b7fa8"), tearTex("SPRING", "3", "#e98aa0")], []);
  return <Hero d={0.9} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([1.4, 0.95, 2.5], [0.2, 0.55, -0.4]), C([0.7, 0.9, 2.6], [0.15, 0.5, -0.4]), 9)} set={(tt: number) => ({ warm: 0.3 + 0.4 * cl(tt - sp) })}
    scene={(tt) => { const k2 = sv(tt, m2, m2 + 0.6), k1 = sv(tt, sp, sp + 0.6), lift = 0.16 * (1 - k2) + 0.16 * (1 - k1);
      return <>
        <Box p={[0.85, 0.45, -0.75]} s={[0.08, 0.9, 0.08]} c="#6b4a2c" />
        <TearPad p={[0.85, 0.82, -0.68]} pages={pages} tears={[m2, sp]} t={tt} s={1.2} />
        {k1 < 0.99 && <group position={[k1 * -1.2, 0, k1 * 0.3]} rotation={[0, 0, k1 * 0.8]}><Zabuton p={[-0.2, 0.05, -0.3]} c="#3b4f7a" fold={1} /></group>}
        {k2 < 0.99 && <group position={[k2 * -1.4, k2 * 0.1, k2 * -0.2]} rotation={[0, 0, k2 * 0.9]}><Zabuton p={[-0.2, 0.21, -0.3]} c="#e8b8a0" fold={1} /></group>}
        <group position={[0, lift + 0.01, 0]}><Sachi p={PZ.seiza} t={tt} x={-0.2} z={-0.3} rotY={30} s={S} color="#e4ddd2" expr={tt > sp + 0.6 ? "feliz" : tt > m2 ? "decidido" : "neutral"} /></group>
        {tt > sp && Array.from({ length: 14 }, (_, i) => { const k = (tt - sp) * (0.2 + (i % 5) * 0.03) + i * 0.071; const y = 2.0 - (k % 1) * 2.1, x = -1.4 + ((i * 0.37) % 2.8) + 0.12 * Math.sin(k * 7 + i);
          return <mesh key={i} position={[x, y, -0.8 + (i % 4) * 0.45]} rotation={[k * 9, k * 6 + i, 0]}><circleGeometry args={[0.055, 5, 0, 2.6]} /><meshStandardMaterial color="#f6b6c8" emissive="#f08aa8" emissiveIntensity={0.25} side={THREE.DoubleSide} /></mesh>; })}
      </>; }} />; };

// 4:00 · seiza de perfil, plano lateral bajo: rodillas primero, después los talones; al lado el set de té echa vapor
export const G_seizaleg: F = ({ t, h }) => { const tea = it(h, 0);
  return <Hero d={1.3} ly={0.2} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([2.6, 0.55, 0.7], [0.15, 0.4, 0.1]), C([2.3, 0.5, 1.4], [0.15, 0.38, 0.1]), 9)}
    set={(tt: number) => ({ spot: [0, 0, 0.1] as V, spotK: cl((tt - 2.4) * 1.5), warm: 0.5 })}
    scene={(tt) => { const kn = sv(tt, 0.4, 1.6), hl = sv(tt, 1.6, 2.6), b = phys(tt, tea - 0.6, 5, 0.5);
      const p = hl > 0 ? mezclar(PZ.kneel, PZ.seiza, hl) : mezclar(PZ.stand, PZ.kneel, kn);
      return <>
        <Sachi p={p} t={tt} s={S} expr="feliz" />
        <Ring p={[0, 0.06, -0.08]} r={0.12} k={cl((tt - 2.5) * 2)} />
        {b > 0.01 && <group position={[0.15, (1 - Math.min(1, b)) * 0.5, 0.55]} scale={1.4}>
          <Box p={[0, 0.03, 0]} s={[0.6, 0.04, 0.4]} c="#2a1e18" r={0.4} rad={0.01} />
          <group position={[-0.15, 0.05, 0]}><mesh position={[0, 0.1, 0]} scale={[1, 0.8, 1]}><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color="#3b2a22" roughness={0.35} /></mesh><Cyl p={[0.11, 0.12, 0]} r={0.015} h={0.12} c="#3b2a22" rot={[0, 0, -0.8]} /><Cyl p={[0, 0.19, 0]} r={0.03} h={0.02} c="#3b2a22" /></group>
          <group position={[0.15, 0.05, 0.03]}><Cyl p={[0, 0.045, 0]} r={0.06} r2={0.045} h={0.09} c="#e8dcc8" rough={0.3} /><mesh position={[0, 0.088, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.052, 24]} /><meshStandardMaterial color="#7fae5a" /></mesh></group>
          <Steam p={[0.15, 0.1, 0.03]} t={tt} k={cl((tt - tea) * 2)} />
          <Box p={[0.05, 0.065, -0.12]} s={[0.22, 0.01, 0.02]} c="#c9a96e" rot={[0, 0.3, 0]} />
        </group>}
      </>; }} />; };

// 4:18 · la toalla se enrolla como un maki (bandas de nori); ella la pone bajo los tobillos y el rollo se aplasta un poco
export const G_sushiroll: F = ({ t, h }) => { const put = it(h, 0);
  return <Hero d={1.4} ly={0.3} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([1.1, 1.0, 2.0], [0.0, 0.3, 0]), C([1.9, 0.75, 1.0], [0, 0.32, -0.05]), 9.5)}
    scene={(tt) => { const r = eio(tt, 0.4, Math.min(4.2, put - 0.5)), mv = eio(tt, put - 0.4, put + 0.8), sit = sv(tt, put + 0.5, put + 1.6), W = 0.8, w = W * (1 - r), rad = 0.02 + 0.055 * Math.sqrt(r), sq = sit > 0.9 ? 0.8 : 1;
      const x0 = -0.8 + (W - w);
      return <>
        {w > 0.02 && <Box p={[x0 + w / 2, 0.063, 0.5]} s={[w, 0.012, 0.35]} c="#f3efe6" r={0.95} rad={0.004} />}
        <group position={[lerp(x0, 0.0, mv), 0.06 + rad * sq, lerp(0.5, -0.24, mv)]} rotation={[0, mv * Math.PI / 2, -r * 14]} scale={[1, sq, 1]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[rad, rad, 0.35, 32]} /><meshStandardMaterial color="#f3efe6" roughness={0.95} /></mesh>
          {r > 0.6 && [-0.1, 0.1].map((z) => <mesh key={z} position={[0, 0, z]}><torusGeometry args={[rad + 0.004, 0.006, 8, 32]} /><meshStandardMaterial color="#26402a" roughness={0.6} /></mesh>)}
          <mesh position={[0, 0, 0.176]}><circleGeometry args={[rad * 0.98, 32]} /><meshStandardMaterial color="#e8e0cc" /></mesh>
          <mesh position={[0, 0, 0.177]}><torusGeometry args={[rad * 0.55, 0.003, 6, 32]} /><meshStandardMaterial color="#b9ae94" /></mesh>
        </group>
        <Sachi p={mezclar(PZ.kneel, PZ.seiza, sit)} t={tt} s={S} rotY={-90} x={0.05} z={0} expr="feliz" />
      </>; }} />; };

// 4:49 · un minuto: el timer entra girando hacia cámara y la aguja da UNA vuelta con estela; al cerrar la vuelta los relojes de arena se apagan y ella se para
export const G_timer60: F = ({ t, h }) => { const up = Math.min(it(h, 1), 6.6), end = up - 0.4;
  const sixty = useMemo(() => numTx(60, "#c0392b"), []);
  return <Hero d={1.1} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.5, 0.95, 2.9], [0, 0.55, 0]), C([-0.3, 1.05, 2.7], [0, 0.55, 0]), 8)}
    scene={(tt) => { const sw = eio(tt, 0.6, end), inn = phys(tt, 0.1, 4, 0.55), off = sv(tt, end, end + 0.8);
      return <>
        <group position={[0.7, 0.62, 0.1]} rotation={[0, lerp(-1.4, -0.25, Math.min(1.1, inn)), 0]} scale={0.95}><Dial p={[0, 0, 0]} ang={sw * Math.PI * 2} sweep={sw * 0.999} marks={60} /><Plate p={[0, -0.17, 0.08]} s={0.3} map={sixty} rot={[0, 0, 0]} /></group>
        <Box p={[0.7, 0.04, 0.1]} s={[0.45, 0.08, 0.25]} c="#d8d2c4" />
        <group position={[-0.95, 0.05, -0.7]} rotation={[0, 0, 1.45 * off]}><Hourglass p={[0, 0, 0]} k={0.12} s={1.2} /></group><group position={[-1.35, 0.05, -0.45]} rotation={[0, 0, 1.45 * sv(tt, end + 0.2, end + 1.0)]}><Hourglass p={[0, 0, 0]} k={0.06} s={1.4} /></group>
        <Sachi p={PZ.seiza} t={tt} x={-0.2} z={0.25} s={S} rotY={15} expr={off > 0.5 ? "feliz" : "neutral"} />
      </>; }} />; };

// 5:51 · desde arriba: las rodillas barren un arco amplio de un lado al otro; ondas de agua nacen de los pies; la cámara baja y acompaña
export const G_pendulum: F = ({ t, h }) => {
  return <Hero d={1.15} ly={0.12} t={t} h={h} mode="split" cam={(tt) => { const k = Math.sin(tt * 0.95) * eio(tt, 0, 1.2); return orbita(tt, C([0.9 + 0.2 * k, 1.5, 2.1], [0.12 * k, 0.25, 0.15]), C([0.5 + 0.2 * k, 1.3, 2.3], [0.12 * k, 0.25, 0.15]), 9.5); }} set={{ warm: 0.4 }}
    scene={(tt) => { const k = Math.sin(tt * 0.95) * eio(tt, 0, 1.2), kk = Math.sin((tt - 0.25) * 0.95) * eio(tt - 0.25, 0, 1.2);
      return <>
        <Sachi p={crook(k * 1.15)} t={tt} s={S} expr="feliz" />
                {Array.from({ length: 10 }, (_, i) => { const u = tt - i * 0.12; const kx = Math.sin(u * 0.95) * eio(u, 0, 1.2); return <mesh key={i} position={[0.12 + 0.13 * kx * 1.15, 0.065, 0.3 - 0.03 * Math.abs(kx)]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.05 + i * 0.012, 24]} /><meshBasicMaterial color="#7fd1ff" transparent opacity={0.55 * (1 - i / 10)} toneMapped={false} depthWrite={false} /></mesh>; })}
      </>; }} />; };

// 6:24 · el lado duro: los relojes de arena caen de a uno; el izquierdo (más grande) sigue cayendo con halo cálido; el derecho se vacía y se apaga
export const G_stiffside: F = ({ t, h }) => { const L = it(h, 0);
  return <Hero d={1.1} ly={0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 0.95, 2.4], [0, 0.55, 0]), C([0.45, 0.85, 2.2], [0, 0.5, 0]), 9)}
    set={(tt: number) => ({ spot: [-0.45, 0, 0] as V, spotK: cl((tt - L) * 1.5) })}
    scene={(tt) => { const a = phys(tt, 0.2, 5, 0.4), b = phys(tt, 1.5, 5, 0.4), dimR = sv(tt, 3.6, 4.4);
      return <>
        <Table p={[0, 0.05, 0]} w={1.6} d={0.6} h={0.2} />
        {a > 0.01 && <group position={[0, (1 - Math.min(1, a)) * 1.2, 0]}><Hourglass p={[-0.45, 0.25, 0]} k={cl((tt - 0.4) / 9.5)} glow={0.6 * cl((tt - L) * 2)} s={1.35} /></group>}
        {b > 0.01 && <group position={[0, (1 - Math.min(1, b)) * 1.2, 0]}><Hourglass p={[0.45, 0.25, 0]} k={cl((tt - 1.0) / 2.6)} s={1.0} /></group>}
        <mesh position={[-0.45, 0.62, -0.15]}><sphereGeometry args={[0.42, 24, 16]} /><meshBasicMaterial color="#ffc070" transparent opacity={0.22 * cl((tt - L) * 1.5)} toneMapped={false} depthWrite={false} /></mesh>
        <mesh position={[0.45, 0.26, 0.001]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.3, 30]} /><meshBasicMaterial color="#120c06" transparent opacity={0.35 * dimR} depthWrite={false} /></mesh>
      </>; }} />; };

// 7:14 · contra la pared, de perfil: una línea de luz baja por la columna vértebra por vértebra; se encienden los hombros y después la cadera
export const G_spine: F = ({ t, h }) => { const sh = it(h, 0), hip = it(h, 1);
  return <Hero d={1} ly={0} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([1.6, 0.65, 0.6], [0, 0.42, -0.62]), C([1.3, 0.7, 1.2], [0, 0.42, -0.6]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.6] as V, spotK: cl((tt - 0.8) * 1.5) })}
    scene={(tt) => { const st = sv(tt, 0.2, 1.4), op = phys(tt, sh, 4, 0.5);
      const p = withHands(mezclar(PZ.slump, PZ.cross, st), (q) => { q.manoI.p = [0.32 + 0.14 * op, -1.0, 0.5 - 0.18 * op]; q.manoD.p = [-0.32 - 0.14 * op, -1.0, 0.5 - 0.18 * op]; q.torso.y = 0; });
      const B = bodyOf(p, 0, -0.72), lit = cl((tt - 0.9) / 1.2);
      return <>
        <Wall p={[0, 0, -0.95]} w={2.6} h={1.6} />
        <mesh position={[0, 0.5, -0.89]}><planeGeometry args={[0.5, 0.9]} /><meshBasicMaterial color="#1a1208" transparent opacity={0.18} depthWrite={false} /></mesh>
        <Sachi p={p} t={tt} z={-0.72} s={S} expr="feliz" />
        {Array.from({ length: 9 }, (_, i) => { const u = i / 8, k = cl(lit * 9 - i); const y = lerp(B.cue[1], B.pel[1] + 0.02, u), z = lerp(B.cue[2], B.pel[2], u) - 0.06;
          return <mesh key={i} position={[0, y, z]}><sphereGeometry args={[0.03, 14, 10]} /><meshBasicMaterial color="#6fe39a" transparent opacity={0.15 + 0.85 * k} toneMapped={false} /></mesh>; })}
        {[-1, 1].map((sx) => <mesh key={sx} position={[B.hom[0] + sx * 0.08, B.hom[1], B.hom[2]]}><sphereGeometry args={[0.035, 16, 10]} /><meshBasicMaterial color="#ffb347" transparent opacity={0.85 * cl((tt - sh) * 2)} toneMapped={false} /></mesh>)}
        <Ring p={[B.pel[0], 0.06, B.pel[2] + 0.05]} r={0.3} k={cl((tt - hip) * 1.5)} col="#7fd1ff" />
      </>; }} />; };

// 7:48 · el hongo triste: encorvada con sombrero de hongo; la pared sube del piso con polvo; se endereza con resorte y el sombrero cae entero al tatami
export const G_mushroom: F = ({ t, h }) => { const w = Math.min(it(h, 0), 6.0);
  return <Hero d={1.05} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([1.9, 0.9, 1.9], [0.1, 0.45, -0.3]), C([1.4, 0.8, 2.3], [0.15, 0.45, -0.35]), 9)}
    scene={(tt) => { const wall = phys(tt, w - 0.4, 4, 0.55), fix = phys(tt, w + 0.3, 4, 0.5), z = lerp(-0.2, -0.72, sv(tt, w, w + 0.8));
      const p = mezclar(PZ.slump, PZ.cross, cl(fix)), hd = headOf(p, 0, z), fall = phys(tt, w + 0.6, 3, 0.4), fk = Math.min(1, fall), dust = tt > w ? Math.exp(-(tt - w) * 2) : 0;
      const cap: V = tt < w + 0.6 ? [hd[0], hd[1] + 0.12, hd[2]] : [lerp(hd[0], -0.45, fk), lerp(hd[1] + 0.12, 0.05, fk), lerp(hd[2], 0.15, fk)];
      return <>
        <group position={[0, -(1 - Math.min(1, wall)) * 1.65, 0]}><Wall p={[0, 0, -0.95]} w={2.6} h={1.6} /></group>
        {dust > 0.05 && Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-1.2 + i * 0.22, 0.06 + (1 - dust) * 0.3 * ((i % 3) + 1), -0.85]}><sphereGeometry args={[0.04, 8, 6]} /><meshStandardMaterial color="#d8c8a8" transparent opacity={dust * 0.8} /></mesh>)}
        <Sachi p={p} t={tt} z={z} s={S} expr={fix > 0.5 ? "feliz" : "triste"} />
        <Cap p={cap} rot={[0, 0, tt < w + 0.6 ? 0.25 * (1 - cl(fix)) : fk * 0.45]} />
      </>; }}
    over={(tt) => <>{tt < w - 0.2 && <Big tt={tt} at={0.7} txt="SAD OLD MUSHROOM" col="#e0866a" y={180} size={70} />}</>} />; };

// 8:22 · tirar vs empujar: primero tira y la mesa patina hacia ella (estela de polvo, flecha roja); después aprieta hacia abajo, la mesa ni se mueve (se hunde un pelo) y ella sube
export const G_pushpull: F = ({ t, h }) => { const pushT = Math.max(4.2, it(h, 0) - 0.6);
  return <Hero d={1.45} ly={0.32} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([1.5, 0.75, 1.6], [-0.05, 0.62, 0.35]), C([1.2, 0.9, 1.9], [-0.05, 0.66, 0.3]), 9)}
    scene={(tt) => { const pull = sv(tt, 0.8, 1.4), slide = phys(tt, 1.0, 4, 0.5) * (1 - sv(tt, pushT - 1.0, pushT - 0.4)), push = sv(tt, pushT, pushT + 0.4), rise = sv(tt, pushT + 0.3, pushT + 1.8);
      const tx = -0.05 + 0.32 * slide;
      const q = withHands(rise > 0 ? mezclar(PZ.half, PZ.stand, rise) : PZ.half, (r) => { r.manoD.p = push > 0 ? [-0.25, -0.62 - 0.15 * push * (1 - rise), 0.62] : [-0.25, -0.62, 0.62 + 0.15 * (1 - pull) - 0.25 * slide]; });
      return <>
        <Table p={[tx, 0.05 - 0.012 * push * (1 - rise), 0.6]} w={0.8} d={0.5} h={0.35} rotZ={0.08 * slide * (1 - push)} />
        {slide > 0.05 && push < 0.5 && Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[tx - 0.4 - i * 0.06, 0.07 + 0.03 * Math.sin(i + tt * 3), 0.6 + 0.2 * Math.sin(i * 1.7)]}><sphereGeometry args={[0.03 + 0.01 * (i % 3), 8, 6]} /><meshStandardMaterial color="#d8c8a8" transparent opacity={0.6 * slide * (1 - i / 8)} /></mesh>)}
        <Sachi p={q} t={tt} x={0.2} z={0.05} rotY={-35} s={S} expr={slide > 0.3 && push === 0 ? "asustado" : "decidido"} />
        <Arrow p={[0.25, 0.62, 0.62]} rot={[0, 0, Math.PI / 2]} c="#ff5a4a" s={1.6} k={pull * (1 - push)} />
        <Arrow p={[-0.02, 1.05, 0.6]} rot={[Math.PI, 0, 0]} c="#6fe39a" s={1.6} k={push * (1 - sv(tt, pushT + 2.2, pushT + 2.8))} />
      </>; }} />; };

// 9:09 · lo que se cae: se apoya en la mesa plegable y se dobla con rebote; la lámpara de pie se va en arco al piso; en la mesa pesada se apoya y nada se mueve
export const G_lamp: F = ({ t, h }) => { const lp = it(h, 0), solid = lp + 2.0;
  return <Hero d={1.25} ly={0.35} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([-0.2, 1.1, 2.9], [-0.1, 0.5, -0.1]), C([0.5, 1.0, 2.7], [0.3, 0.45, -0.1]), 8.5)}
    set={(tt: number) => ({ spot: [1.0, 0, -0.1] as V, spotK: cl((tt - solid) * 1.5) })}
    scene={(tt) => { const fold = phys(tt, 1.0, 3.2, 0.42), fk = Math.min(1.08, fold), fall = Math.min(1, phys(tt, lp, 2.2, 0.55)), at2 = sv(tt, solid - 0.9, solid - 0.1);
      const sx = lerp(-0.55, 1.0, at2), p = withHands(PZ.half, (q) => { q.manoD.p = [-0.25, -0.62 - (tt < 1.2 ? 0 : 0.1 * (1 - at2)), 0.62]; });
      return <>
        <group position={[-0.95, 0.05, -0.1]}>
          <group position={[0, 0.48 - 0.4 * cl(fk), 0]} rotation={[0, 0, 0.55 * fk]}><Box p={[0, 0, 0]} s={[0.75, 0.035, 0.5]} c="#c8ccd0" m={0.35} /></group>
          {[-1, 1].map((k) => <group key={k} position={[0, 0.25 - 0.18 * cl(fk), 0]} rotation={[0, 0, k * (0.45 + 0.95 * cl(fk))]}><Box p={[0, 0, 0]} s={[0.035, 0.6, 0.035]} c="#8a8f96" m={0.4} /></group>)}
        </group>
        <group position={[-0.15, 0.05, -0.75]} rotation={[0, 0, 1.45 * fall]}>
          <Cyl p={[0, 0.02, 0]} r={0.14} h={0.03} c="#2a2a2a" m={0.4} /><Cyl p={[0, 0.7, 0]} r={0.02} h={1.36} c={brass} m={0.6} />
          <Cyl p={[0, 1.45, 0]} r={0.12} r2={0.24} h={0.24} c="#f4ead4" e="#ffe2a8" ei={0.7 * (1 - fall)} />
        </group>
        <Table p={[1.0, 0.05, 0.05]} w={0.85} d={0.55} h={0.38} c="#5a3820" />
        {fall > 0.97 && tt < lp + 2.2 && Array.from({ length: 9 }, (_, i) => { const u = cl((tt - lp - 0.55) / 1.4); return <mesh key={i} position={[-1.45 + i * 0.12, 0.06 + u * 0.12 * ((i % 3) + 1), -0.75 + 0.15 * Math.sin(i * 2)]}><sphereGeometry args={[0.035 + 0.04 * u, 8, 6]} /><meshStandardMaterial color="#d8c8a8" transparent opacity={0.7 * (1 - u)} depthWrite={false} /></mesh>; })}
        <Sachi p={p} t={tt} x={sx} z={0.5} rotY={180} s={S} expr={tt > solid ? "feliz" : "asustado"} />
      </>; }} />; };

// 11:07 · el árbol cae entero en cuadro (polvo, rebote de la copa, temblor); al lado ella baja en cuatro tiempos y cada farol se enciende en su tiempo
export const G_timber: F = ({ t, h }) => { const tr = it(h, 0), st = it(h, 1);
  const N = useMemo(() => [1, 2, 3, 4].map((n) => numTx(n, "#fff", "#2f7a52")), []);
  return <Hero d={1} t={t} h={h} mode="drop" cam={(tt) => { const shake = tt > tr + 0.5 ? 0.025 * Math.exp(-(tt - tr - 0.5) * 6) * Math.sin(tt * 70) : 0; const c = orbita(tt, C([0.3, 1.4, 3.6], [0.1, 0.6, -0.3]), C([0.6, 1.2, 3.2], [0.3, 0.5, -0.2]), 9); return { ...c, p: [c.p[0] + shake, c.p[1] + shake, c.p[2]] }; }}
    scene={(tt) => { const fall = eIn2(tt, tr - 0.4, tr + 0.5), bounce = tt > tr + 0.5 ? 0.08 * Math.exp(-(tt - tr - 0.5) * 5) * Math.abs(Math.sin((tt - tr - 0.5) * 14)) : 0, dust = tt > tr + 0.5 ? Math.exp(-(tt - tr - 0.5) * 1.4) : 0;
      const steps = [PZ.stand, PZ.lean, PZ.half, PZ.kneel, PZ.seiza]; let p = steps[0]; for (let i = 1; i < 5; i++) p = mezclar(p, steps[i], sv(tt, st + (i - 1) * 0.55, st + (i - 1) * 0.55 + 0.45));
      return <>
        <group position={[-1.5, 0.05, -0.5]} rotation={[0, 0, -1.48 * fall + bounce]}>
          <Cyl p={[0, 0.5, 0]} r={0.06} r2={0.08} h={1.0} c="#6a4a30" />
          <mesh position={[0, 1.22, 0]} castShadow><sphereGeometry args={[0.32, 24, 16]} /><meshStandardMaterial color="#4f7a3a" roughness={0.9} /></mesh>
        </group>
        {dust > 0.04 && Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[-1.3 + i * 0.09, 0.06 + (1 - dust) * 0.35 * ((i % 4) + 1) * 0.6, -0.5 + 0.25 * Math.sin(i * 1.3)]}><sphereGeometry args={[0.03 + 0.05 * (1 - dust), 8, 6]} /><meshStandardMaterial color="#c8b48c" transparent opacity={dust * 0.8} depthWrite={false} /></mesh>)}
        <Sachi p={p} t={tt} x={0.75} z={0} rotY={-20} s={S} expr="decidido" />
        {[0, 1, 2, 3].map((i) => { const k = sv(tt, st + i * 0.55, st + i * 0.55 + 0.2); return <group key={i}><Plate p={[0.05 + i * 0.45, 0.07, 0.3]} s={0.42} map={N[i]} op={0.3 + 0.7 * k} glow={0.6 * k} /><Ring p={[0.05 + i * 0.45, 0.065, 0.3]} r={0.25} k={k * (1 - sv(tt, st + i * 0.55 + 0.5, st + i * 0.55 + 1.2)) } col="#6fe39a" /></group>; })}
      </>; }} />; };
const eIn2 = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c * c * c; };

// 12:09 · a ras de las rodillas: primero se deja caer derecha (las dos rodillas pegan: onda roja, sacudida); después baja con el paso de una rodilla, suave
export const G_softland: F = ({ t, h }) => { const soft = Math.max(4.6, it(h, 0) - 1.8), bang = 1.7;
  return <Hero d={1.45} ly={0.35} t={t} h={h} mode="wipe" cam={(tt) => { const hit = tt > bang + 0.3 && tt < soft ? 0.03 * Math.exp(-(tt - bang - 0.3) * 5) * Math.sin(tt * 60) : 0; const c = orbita(tt, C([1.6, 0.42, 1.5], [0, 0.6, 0.1]), C([1.8, 0.5, 0.9], [0, 0.62, 0.05]), 9.5); return { ...c, p: [c.p[0], c.p[1] + hit, c.p[2]] }; }}
    scene={(tt) => { const hit = tt > bang + 0.3 && tt < soft ? Math.exp(-(tt - bang - 0.3) * 0.9) : 0, B = soft - 0.6;
      const p = tt < B ? mezclar(PZ.stand, PZ.kneel, sv(tt, bang, bang + 0.3)) : tt < soft ? mezclar(PZ.kneel, PZ.stand, sv(tt, B, soft)) : secuencia([[0, PZ.stand], [0.15, PZ.half], [1.6, PZ.kneel]], tt - soft, 1.2);
      const sf = tt > soft + 1.6 ? Math.exp(-(tt - soft - 1.6) * 0.9) : 0;
      return <>
        <Sachi p={p} t={tt} s={S} rotY={-5} expr={hit > 0.3 ? "espantado" : "decidido"} />
        {[-0.07, 0.07].map((x) => <mesh key={x} position={[x, 0.08, 0.05]}><sphereGeometry args={[0.06, 16, 10]} /><meshBasicMaterial color="#ff3b2f" transparent opacity={0.75 * hit} toneMapped={false} depthWrite={false} /></mesh>)}
        {[0, 1, 2].map((i) => <Ring key={i} p={[0, 0.06, 0.05]} r={0.12 + (1 - hit) * 0.8 + i * 0.14} k={hit * (1 - i * 0.28)} col="#ff5a4a" />)}
        <Ring p={[0, 0.06, -0.1]} r={0.22 + 0.1 * (1 - sf)} k={sf * 0.8} col="#6fe39a" />
      </>; }} />; };

// 12:58 · la plomada de bronce cuelga de la nariz: primero cae detrás del talón (peso atrás); al inclinarse oscila y se clava sobre la punta del pie, que se enciende
export const G_plumb: F = ({ t, h }) => { const w = it(h, 0);
  return <Hero d={1.4} ly={0.2} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([1.9, 0.7, 0.45], [0, 0.42, 0.2]), C([1.7, 0.65, 0.9], [0, 0.4, 0.2]), 10)}
    set={(tt: number) => ({ spot: [0, 0, 0.3] as V, spotK: cl((tt - 3.4) * 1.5) })}
    scene={(tt) => { const lean = sv(tt, 1.6, 3.4), back = withHands(PZ.half, (q) => { q.torso.x = -8; q.raiz[2] = -0.12; }), p0 = mezclar(back, PZ.halfLean, lean), up = sv(tt, w, w + 1.4), pp = mezclar(p0, withHands(PZ.lean, () => {}), up * 0.0);
      const hd = headOf(pp), toe = toeOf(pp, "D"), sw = Math.sin(tt * 3.0) * 0.07 * Math.exp(-Math.max(0, tt - 3.4) * 1.2) * (tt > 1.6 ? 1 : 0.3);
      const nose: V = [hd[0], hd[1], hd[2] + 0.12], bob: V = [nose[0], 0.13, nose[2] + sw], hit = Math.abs(bob[2] - toe[2]) < 0.06 && lean > 0.95;
      return <>
        <Sachi p={pp} t={tt} s={S} expr="decidido" />
        <Cord a={nose} b={[bob[0], bob[1] + 0.1, bob[2]]} w={0.02} />
        <mesh position={bob} rotation={[Math.PI, 0, 0]} castShadow><coneGeometry args={[0.08, 0.2, 28]} /><meshStandardMaterial color="#c9952f" metalness={0.85} roughness={0.22} emissive={hit ? "#3fbf6a" : "#000000"} emissiveIntensity={hit ? 0.6 : 0} /></mesh>
        <Ring p={[toe[0], 0.06, toe[2]]} r={0.14} k={hit ? 1 : 0.6} col={hit ? "#6fe39a" : "#ff5a4a"} />
      </>; }} />; };

// 13:18 · el soldado: rígida como una tabla, el cuerpo entero se va para atrás desde los tobillos; al lado la bisagra: el torso va adelante y sube
export const G_soldier: F = ({ t, h }) => { const good = Math.max(3.4, it(h, 0) - 1.6);
  return <Hero d={1} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 0.9, 3.4], [0, 0.55, 0]), C([0.4, 0.85, 3.1], [0, 0.55, 0]), 9)}
    scene={(tt) => { const back = phys(tt, 0.8, 2.6, 0.38), rise = sv(tt, good + 0.9, good + 2.3);
      const hinge = withHands(PZ.lean, (q) => { q.torso.x = 62; q.cabeza.x = -30; });
      return <>
        <group position={[-0.7, 0.05, 0]} rotation={[0, 0, 0.62 * Math.min(1.05, back)]}><Sachi p={PZ.stiff} t={0} x={0} rotY={90} s={S} expr="asustado" /></group>
        <mesh position={[-0.7 - 0.3 * Math.min(1, back), 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.3 + 0.6 * Math.min(1, back), 0.18]} /><meshBasicMaterial color="#1a120a" transparent opacity={0.25} depthWrite={false} /></mesh>
        <Sachi p={secuencia([[0, PZ.half], [good, PZ.halfLean], [good + 1.3, PZ.stand]], tt)} x={0.75} t={tt} rotY={90} s={S} expr="feliz" />
        <Ring p={[-0.7, 0.06, 0]} r={0.4} k={cl((tt - 1.2) * 2)} col="#ff5a4a" />
        <Ring p={[0.75, 0.06, 0]} r={0.4} k={rise} col="#6fe39a" />
      </>; }} />; };

// 14:07 · diez veces por día: odómetro de bronce de dos rodillos; cada vez que ella se para, rueda y se enciende un farol; en 10 se prenden todos
export const G_tentimes: F = ({ t, h }) => {
  return <Hero d={1} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.4, 1.15, 3.2], [0.2, 0.75, -0.6]), C([-0.1, 1.05, 3.0], [0.2, 0.75, -0.6]), 8.5)} set={(tt: number) => ({ warm: eio(tt, 0, 8) })}
    scene={(tt) => { const per = 0.72, u = Math.max(0, tt - 0.4), n = Math.min(10, u / per), cyc = n < 10 ? (1 - Math.cos(u / per * Math.PI * 2)) / 2 : 0, all = cl((tt - 0.4 - 10 * per) * 2);
      return <>
        {Array.from({ length: 10 }, (_, i) => <group key={i}><Box p={[-1.35 + i * 0.3, 1.25, -1.4]} s={[0.02, 0.25, 0.02]} c="#3a2a1c" cast={false} /><mesh position={[-1.35 + i * 0.3, 1.08, -1.4]}><sphereGeometry args={[0.075, 16, 12]} /><meshStandardMaterial color={i < Math.floor(n) ? "#ffcf7a" : "#6b5a48"} emissive="#ffb347" emissiveIntensity={i < Math.floor(n) ? 1.2 + 1.2 * all : 0} /></mesh></group>)}
        <Box p={[0, 1.38, -1.4]} s={[3.2, 0.04, 0.06]} c="#5a3a22" cast={false} />
        <Sachi p={mezclar(PZ.stand, PZ.seiza, cyc)} t={tt} x={-0.45} z={-0.2} s={S} expr="feliz" />
        <Odo p={[0.75, 0.66, -0.2]} n={Math.floor(n) + cl((n % 1 - 0.75) * 4)} digits={2} s={2.1} rotY={-0.25} glow={all} />
        <Box p={[0.75, 0.2, -0.2]} s={[0.14, 0.4, 0.14]} c="#6b4a2c" />
      </>; }} />; };

// 15:42 · la tele vieja con el drama; el reloj de pared avanza a los 30; en la tanda la pantalla parpadea a barras y ella salta parada, mirando la tele
export const G_commercial: F = ({ t, h }) => { const cm = it(h, 1); const T = useTx(); const ph = usePhoto("n_tele_vieja");
  return <Hero d={1.15} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([1.5, 1.0, 2.6], [-0.1, 0.55, -0.6]), C([0.7, 1.05, 2.8], [-0.15, 0.6, -0.65]), 9.5)} set={{ warm: 0.5 }}
    scene={(tt) => { const blink = tt > cm - 0.15 && tt < cm + 0.1 ? 1 : 0, on = tt > cm + 0.1, up = phys(tt, cm + 0.15, 4, 0.4), ring = eio(tt, 0.3, cm);
      return <>
        <group position={[-0.65, 0.05, -1.1]} scale={1.35}>
          <Box p={[0, 0.35, 0]} s={[0.9, 0.7, 0.6]} c="#6a4a30" r={0.6} />
          <mesh position={[-0.1, 0.38, 0.305]}><planeGeometry args={[0.58, 0.46]} /><meshBasicMaterial key={blink ? "w" : on ? "b" : "p"} map={blink ? null : on ? T.bars : ph} color="#fff" toneMapped={false} /></mesh>
          {[0, 1].map((i) => <Cyl key={i} p={[0.33, 0.5 - i * 0.2, 0.31]} r={0.05} h={0.03} c="#c8b89a" rot={[Math.PI / 2, 0, 0]} />)}
        </group>
        <Dial p={[1.15, 1.4, -1.33]} ang={ring * Math.PI} sweep={ring * 0.5} s={0.95} c="#fffaf0" rim="#7a4e2c" />
        <Wall p={[0.4, 0, -1.45]} w={3.4} h={2.2} />
        <group position={[0, 0.12 * Math.max(0, Math.sin(Math.PI * cl((tt - cm - 0.15) / 0.6))), 0]}><Sachi p={mezclar(withHands(PZ.seiza, (q) => { q.torso.x = 14; q.raiz[1] -= 0.04; }), PZ.stand, Math.min(1, up))} t={tt} x={0.3} z={-0.35} rotY={-90} s={S} expr={up > 0.5 ? "feliz" : "neutral"} /></group>
      </>; }} />; };

// 15:59 · el banquito tambalea (oscilaciones que se apagan) y se vuelca; para lo de abajo dobla las rodillas; lo de arriba la ayudante lo baja y se lo da
export const G_stool: F = ({ t, h }) => { const sq = it(h, 0), hp = Math.min(it(h, 1), 6.2);
  return <Hero d={1.2} ly={0.1} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.3, 1.25, 3.6], [0.1, 0.75, -0.3]), C([0.8, 1.2, 3.4], [0.3, 0.75, -0.3]), 9)}
    scene={(tt) => { const wob = tt < 2.2 ? Math.sin(tt * 11) * 0.12 * Math.exp(-tt * 0.7) * cl((tt - 0.3) * 3) : 0, tip = phys(tt, 2.2, 3, 0.5), d = sv(tt, sq - 0.2, sq + 0.8) * (1 - sv(tt, hp - 0.8, hp - 0.2)), give = sv(tt, hp, hp + 1.6), take = sv(tt, hp - 0.6, hp);
      const helper = withHands(PZ.reach, (q) => { q.manoD.p = [-0.2, lerp(1.3, 0.1, give), lerp(0.3, 0.55, give)]; });
      const boxP: V = give > 0 ? [lerp(1.15, 0.35, give), lerp(1.68, 0.85, give), lerp(-0.85, -0.1, give)] : [1.15, 1.68, -0.85];
      return <>
        <group position={[-0.75, 0.05, 0.2]} scale={1.5} rotation={[0, 0, wob + 1.45 * Math.min(1, tip)]}><Box p={[0, 0.32, 0]} s={[0.4, 0.04, 0.3]} c="#b98a5a" />{[-1, 1].map((k) => <Box key={k} p={[k * 0.16, 0.15, 0]} s={[0.04, 0.3, 0.26]} c="#8a5a34" />)}</group>
        <Sachi p={withHands(mezclar(PZ.stand, PZ.squat, d), (q) => { if (give > 0.7) q.manoD.p = [-0.25, -0.2, 0.5]; })} t={tt} x={0} s={S} rotY={20} expr="decidido" />
        <group position={[0.15, 0.05 + 0.32 * sv(tt, sq + 1.0, sq + 1.6) * (1 - sv(tt, hp - 0.8, hp - 0.2)), 0.28]}><Cyl p={[0, 0.07, 0]} r={0.12} r2={0.09} h={0.14} c="#c9a24e" rough={0.8} /></group>
        <Box p={[1.2, 1.6, -0.95]} s={[1.0, 0.04, 0.3]} c="#7a4e2c" />
        <Box p={boxP} s={[0.16, 0.18, 0.16]} c="#d9b25a" />
        {tt > hp - 1.2 && <Sachi p={mezclar(PZ.stand, helper, take)} t={tt} x={0.85} z={-0.5} rotY={-35} s={S} expr="feliz" />}
      </>; }} />; };

// 16:16 · el sello: la frase vieja se tacha y se cae de la hoja; la de ella aparece palabra por palabra; el hanko baja con peso, salpica y deja OK
export const G_hanko: F = ({ t, h }) => { const stamp = Math.min(it(h, 1), 5.2);
  const card = (n: number, x1: number, ok: number) => txt(1024, 640, (g) => {
    g.fillStyle = "#f4ecd8"; g.fillRect(0, 0, 1024, 640); for (let i = 0; i < 900; i++) { g.fillStyle = "rgba(160,140,100,.08)"; g.fillRect((i * 53) % 1024, (i * 97) % 640, 3, 1 + (i % 3)); }
    const W = ["At", "my", "age,", "I", "sit", "wherever", "I", "like."], L = [[0, 3], [3, 6], [6, 8]];
    g.fillStyle = "#1e1813"; g.font = "bold 112px Georgia, serif"; L.forEach(([a, b], i) => { const s = W.slice(a, Math.min(b, Math.max(a, n))).join(" "); if (s) g.fillText(s, 60, 170 + i * 130); });
    if (ok > 0) { g.globalAlpha = Math.min(1, ok); g.fillStyle = "#c62828"; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(880 + 120 * Math.cos(i * 2.1), 500 + 100 * Math.sin(i * 1.7), 6 + (i % 3) * 5, 0, 7); g.fill(); } g.strokeStyle = "#c62828"; g.lineWidth = 16; g.strokeRect(790, 410, 190, 190); g.font = "bold 110px sans-serif"; g.fillText("OK", 800, 545); g.globalAlpha = 1; }
    void x1;
  });
  const T0 = t - h.at, n = Math.min(8, Math.floor(cl((T0 - 1.4) / 2.6) * 8.99)), ok = T0 > stamp;
  const tex = useMemo(() => card(n, 0, ok ? 1 : 0), [n, ok]);
  const old = useMemo(() => txt(1024, 128, (g) => { g.fillStyle = "#f8f1de"; g.fillRect(0, 0, 1024, 128); g.fillStyle = "#6a6058"; g.font = "italic bold 66px Georgia, serif"; g.fillText("“At your age, sit in a chair.”", 30, 86); g.strokeStyle = "#c62828"; g.lineWidth = 10; g.beginPath(); g.moveTo(25, 64); g.lineTo(1000, 64); g.stroke(); }), []);
  return <Hero d={1} ly={0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 1.75, 0.95], [0, 0.36, 0.05]), C([0.15, 1.7, 0.95], [0.03, 0.36, 0.05]), 8)} set={{ warm: 0.5 }}
    scene={(tt) => { const y = tt < stamp ? lerp(1.0, 0.43, eIn2(tt, stamp - 0.45, stamp)) : lerp(0.43, 0.95, sv(tt, stamp + 0.3, stamp + 1.0)) + (tt < stamp + 0.3 ? -0.01 * Math.sin((tt - stamp) * 40) : 0);
      const drop = sv(tt, 1.0, 2.2), strike = cl((tt - 0.4) / 0.5);
      return <>
        <Table p={[0, 0.05, 0]} w={1.4} d={0.9} h={0.33} />
        <mesh position={[0, 0.385, 0.05]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.1, 0.69]} /><meshBasicMaterial map={tex} color="#efe7d6" toneMapped={false} /></mesh>
        <mesh position={[lerp(0, 0.2, drop), 0.39 - 0.32 * drop * drop, -0.3 - 0.35 * drop]} rotation={[-Math.PI / 2 + drop * 1.2, 0, drop * 0.5]} scale={[strike > 0 ? 1 : 1, 1, 1]}><planeGeometry args={[0.9, 0.11]} /><meshStandardMaterial map={old} side={THREE.DoubleSide} transparent opacity={1 - sv(tt, 1.8, 2.4)} /></mesh>
        <group position={[0.38, y, 0.18]}><Cyl p={[0, 0.12, 0]} r={0.055} h={0.24} c="#8a5a34" rough={0.4} /><mesh position={[0, 0.27, 0]}><sphereGeometry args={[0.065, 16, 12]} /><meshStandardMaterial color="#6a4222" /></mesh><Cyl p={[0, 0.003, 0]} r={0.055} h={0.006} c="#c62828" /></group>
      </>; }} />; };

// 17:50 · cualquier piso sirve: las cuatro texturas llegan de a una; ella pasa a cada una y se arrodilla; la manta doblada en capas, la colchoneta con la punta enrollada
export const G_floors: F = ({ t, h }) => { const A = [0.3, it(h, 0), it(h, 1), it(h, 2)]; const T = useTx(); const tx = useTextures();
  return <Hero d={1.55} ly={0.22} t={t} h={h} mode="wipe" cam={(tt) => { const cur = Math.max(0, A.filter((a) => tt > a).length - 1); const fx = -1.5 + cur * 1.0; const c = orbita(tt, C([-0.6, 1.3, 2.6], [-0.6, 0.25, 0]), C([0.7, 1.3, 2.6], [0.6, 0.25, 0]), 9); return { ...c, l: [lerp(c.l[0], fx, 0.5), c.l[1], c.l[2]] }; }} set={{ floor: "wood" }}
    scene={(tt) => { const cur = Math.max(0, A.filter((a) => tt > a).length - 1), from = Math.max(0, cur - 1), hop = sv(tt, A[cur] - 0.1, A[cur] + 0.5), x = lerp(-1.5 + from * 1.0, -1.5 + cur * 1.0, cur === 0 ? 1 : hop);
      const mats = [{ c: "#d9886a", map: T.carpet }, { c: "#a06a3c", map: tx.planks }, { c: "#ffffff", map: T.blanket }, { c: "#7a5ac8", map: undefined }];
      const kneel = sv(tt, A[cur] + 0.4, A[cur] + 1.0);
      return <>
        {mats.map((m, i) => { const s = phys(tt, A[i] - 0.3, 6, 0.42); if (s <= 0.01) return null; return <group key={i} position={[-1.5 + i * 1.0, 0.03 + (1 - Math.min(1, s)) * 0.9, 0]}>
          {i === 2 ? [0, 1, 2].map((j) => <Box key={j} p={[0, 0.02 + j * 0.035, 0]} s={[0.85 - j * 0.02, 0.03, 0.75 - j * 0.02]} c={m.c} map={m.map} r={0.95} rad={0.014} />)
            : <Box p={[0, 0.02, 0]} s={[0.85, 0.03, 0.75]} c={m.c} map={m.map} r={0.95} rad={0.01} />}
          {i === 3 && <mesh position={[0.42, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.75, 24]} /><meshStandardMaterial color="#7a5ac8" roughness={0.8} /></mesh>}
          <Ring p={[0, i === 2 ? 0.13 : 0.06, 0]} r={0.36} k={i === cur ? kneel : 0} col="#6fe39a" />
        </group>; })}
        <group position={[0, 0.03 + (cur === 2 ? 0.09 : 0) + 0.15 * Math.sin(Math.PI * hop) * (cur > 0 ? 1 : 0), 0]}><Sachi p={mezclar(PZ.stand, PZ.kneel, kneel)} t={tt} x={x} z={0.05} rotY={20} s={S} expr="feliz" /></group>
      </>; }} />; };

// 18:21 · si te quedás en el piso: rodar de costado → manos y rodillas → un pie adelante → arriba; la cámara la sigue y el paso en curso tiene su número grande
export const G_stuck: F = ({ t, h }) => { const up = Math.max(6.6, it(h, 1));
  const K: [number, Pose, string][] = [[0, PZ.lying, "ROLL TO THE SIDE"], [2.2, PZ.four, "HANDS AND KNEES"], [4.4, PZ.half, "ONE FOOT FORWARD"], [up, PZ.stand, "PUSH UP"]];
  return <Hero d={1.55} ly={0.2} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([1.5, 0.6, 1.9], [0, 0.25, 0]), C([1.9, 0.95, 1.6], [0, 0.6, 0]), 9.5)}
    scene={(tt) => <><Sachi p={secuencia([[0, PZ.lying], [2.2, PZ.four], [4.4, PZ.half], [up - 0.5, PZ.halfLean], [up, PZ.stand]], tt, 0.9)} t={tt} s={S} rotY={-15} expr="decidido" />
      <Ring p={[0, 0.06, 0]} r={0.5} k={cl((tt - up - 0.6) * 2)} col="#6fe39a" /></>}
    over={(tt) => { const i = K.filter((k) => tt > k[0]).length - 1; return <><div style={{ position: "absolute", left: 1400, top: 300, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * Math.min(1, phys(tt, K[i][0], 6, 0.4))})`, width: 190, height: 190, borderRadius: "50%", background: i === 3 ? GRN : AMB, border: "10px solid #2a1d12", color: "#1a1410", fontWeight: 900, fontSize: 130, textAlign: "center", lineHeight: "170px" }}>{i + 1}</div></>; }} />; };

// 18:56 · a los 98 se paró sin manos en tres segundos: cronómetro de bronce; al llegar a 3,0 salta con resorte y aparece un 98 de bronce enorme
export const G_stopwatch: F = ({ t, h }) => { const a = Math.max(0.6, it(h, 0) - 2.6);
  const n98 = useMemo(() => txt(512, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#f3d68a"); gr.addColorStop(1, "#9a6f22"); g.fillStyle = gr; g.font = "bold 240px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("98", 256, 140); g.strokeStyle = "#4a3410"; g.lineWidth = 6; g.strokeText("98", 256, 140); }), []);
  return <Hero d={1.2} ly={0.22} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.4, 1.0, 3.0], [0.0, 0.75, 0]), C([-0.2, 0.9, 2.8], [0.0, 0.7, 0]), 8)} set={{ bg: "#d6d0c4" }}
    scene={(tt) => { const k = cl((tt - a) / 3.0), up = sv(tt, a, a + 3.0), pop = phys(tt, a + 3.0, 6, 0.35), big = phys(tt, a + 3.1, 5, 0.45);
      return <>
        <group position={[-0.75, 0.75, -0.2]} scale={1 + 0.08 * Math.sin(Math.PI * Math.min(1, pop)) * (tt > a + 3 ? 1 : 0)}><Dial p={[0, 0, 0]} ang={k * Math.PI * 2} sweep={k * 0.999} s={0.9} c="#f6f1e7" rim={brass} rotY={0.25} /></group>
        <Cyl p={[-0.75, 1.25, -0.2]} r={0.05} h={0.08} c={brass} m={0.7} />
        <Box p={[-0.75, 0.15, -0.2]} s={[0.12, 0.2, 0.12]} c="#6b4a2c" />
        <Sachi p={mezclar(PZ.cross, PZ.stand, up)} t={tt} x={0.55} s={S} rotY={-15} color="#d9e4ee" expr={up > 0.9 ? "feliz" : "decidido"} />
        {big > 0.01 && <mesh position={[0.05, 1.2 + (1 - Math.min(1, big)) * 0.4, -0.6]} scale={Math.min(1.08, big)}><planeGeometry args={[1.1, 0.55]} /><meshStandardMaterial map={n98} transparent metalness={0.4} roughness={0.35} emissive="#c99a3a" emissiveIntensity={0.25} /></mesh>}
        <Ring p={[0.55, 0.06, 0]} r={0.45} k={cl((tt - a - 3.0) * 2)} col="#7fd1ff" />
      </>; }}
    over={(tt) => { const s = (cl((tt - a) / 3.0) * 3).toFixed(1); return <div style={{ position: "absolute", left: 560, top: 900, transform: "translateX(-50%)", fontWeight: 900, fontSize: 130, color: "#fff", WebkitTextStroke: "14px #2a1d12", paintOrder: "stroke fill" } as React.CSSProperties}>{s}s</div>; }} />; };

// 19:46 · la mesa en primer plano: la mano entera baja y deja una huella de luz; después dos dedos, después uno; al final la mesa vacía con un halo
export const G_fingerprint: F = ({ t, h }) => { const two = it(h, 0), one = it(h, 1);
  const prints = useMemo(() => [5, 2, 1].map((n) => txt(256, 256, (g) => { g.fillStyle = "rgba(255,214,140,1)"; if (n === 5) { g.beginPath(); g.ellipse(128, 170, 62, 70, 0, 0, 7); g.fill(); }
    [[60, 70, -0.4], [100, 40, -0.13], [140, 36, 0.07], [178, 52, 0.28], [215, 135, 0.9]].forEach(([x, y, r], i) => { if (n === 5 || (n === 2 && (i === 1 || i === 2)) || (n === 1 && i === 2)) { g.save(); g.translate(x, y + 40); g.rotate(r); g.beginPath(); g.ellipse(0, 0, 16, 46, 0, 0, 7); g.fill(); g.restore(); } }); })), []);
  const T3 = [0.4, two, one];
  return <Hero d={1.15} ly={0.08} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.5, 1.15, 1.3], [-0.05, 0.36, 0]), C([0.1, 1.2, 1.25], [-0.05, 0.36, 0]), 10)}
    set={(tt: number) => ({ spot: [0, 0, 0] as V, spotK: cl((tt - one - 1.2) * 1.2) })}
    scene={(tt) => { const st = tt < two ? 0 : tt < one ? 1 : 2, a0 = T3[st], press = sv(tt, a0, a0 + 0.45) * (1 - sv(tt, a0 + 0.9, a0 + 1.4));
      return <>
        <Table p={[0, 0.05, 0]} w={1.3} d={0.75} h={0.36} />
        {prints.map((m, i) => { const k = phys(tt, T3[i] + 0.15, 6, 0.4); if (k <= 0.01) return null; return <Plate key={i} p={[-0.38 + i * 0.38, 0.418, 0.05]} s={0.36 * Math.min(1.1, k)} map={m} op={cl(k * 2)} glow={1.4} />; })}
        {[0, 1, 2].map((i) => { const w = cl((tt - T3[i] - 0.3) / 1.0); return w > 0 && w < 1 ? <Ring key={i} p={[-0.38 + i * 0.38, 0.42, 0.05]} r={0.12 + 0.35 * w} k={1 - w} col="#ffd27a" /> : null; })}
        <mesh position={[0, 0.42, 0.05]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.32, 48]} /><meshBasicMaterial color="#ffe2a8" transparent opacity={0.25 * cl((tt - one - 1.4) * 1.5)} toneMapped={false} depthWrite={false} /></mesh>
      </>; }} />; };

// 20:20 · sus diez minutos, desde arriba: un anillo de diez sectores de tatami; cada minuto se enciende el suyo y ella toma esa postura en el centro
export const G_tenplan: F = ({ t, h }) => { const tt0 = useCasaTex();
  const seq: Pose[] = [PZ.seiza, PZ.seiza, PZ.side, PZ.side, PZ.cross, PZ.cross, PZ.stand, PZ.kneel, PZ.halfLean, PZ.stand];
  return <Hero d={1.4} ly={0} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.2, 3.6, 1.9], [0, 0.1, 0.05]), C([0.9, 3.3, 2.2], [0, 0.1, 0.05]), 7)}
    scene={(tt) => { const n = Math.min(9, Math.floor(cl((tt - 0.3) / 5.6) * 10));
      return <>
        {Array.from({ length: 10 }, (_, i) => { const a0 = (i / 10) * Math.PI * 2 + 0.02, on = i <= n, k = phys(tt, 0.3 + i * 0.56, 6, 0.45);
          return <mesh key={i} position={[0, 0.08 + (on ? 0.02 * Math.min(1, k) : 0), 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.75, 1.35, 16, 1, a0, Math.PI / 5 - 0.04]} /><meshStandardMaterial color={on ? (i === 9 ? "#9fdcff" : "#f2b45a") : "#b7ab92"} roughness={0.9} polygonOffset polygonOffsetFactor={-2} emissive={i === 9 ? "#7fd1ff" : "#ff9a2e"} emissiveIntensity={on ? (i === n ? 0.8 : 0.3) : 0} side={THREE.DoubleSide} /></mesh>; })}
        <Sachi p={secuencia(seq.map((p, i) => [0.3 + i * 0.56, p] as [number, Pose]), tt, 0.4)} t={tt} s={S * 1.15} rotY={-90 + n * 36} expr="feliz" />
      </>; }}
    over={(tt) => { const n = Math.min(9, Math.floor(cl((tt - 0.3) / 5.6) * 10)); return <div style={{ position: "absolute", left: 1560, top: 540, transform: "translate(-50%,-50%)", textAlign: "center", fontWeight: 900, fontSize: 220, lineHeight: 1, color: n === 9 ? ICE : AMB, WebkitTextStroke: "16px #2a1d12", paintOrder: "stroke fill" } as React.CSSProperties}>{n + 1}</div>; }} />; };

// 21:42 · dos días buenos: dos tacos de calendario en un corcho; un día ella se para sin manos, el otro con dos dedos en la mesa; a cada hoja le cae un sello verde
export const G_gooddays: F = ({ t, h }) => { const d2 = it(h, 0), both = it(h, 1);
  const P1 = useMemo(() => [tearTex("MONDAY", "12", "#c0392b"), tearTex("MONDAY", "12", "#c0392b")], []), P2 = useMemo(() => [tearTex("TUESDAY", "13", "#c0392b"), tearTex("TUESDAY", "13", "#c0392b")], []);
  const GOOD = useMemo(() => stampTex("GOOD", "#2f9a5a"), []);
  const cork = useMemo(() => txt(256, 128, (g) => { g.fillStyle = "#b98a5a"; g.fillRect(0, 0, 256, 128); for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(${80 + (i % 50)},${50 + (i % 30)},20,.45)`; g.fillRect((i * 37) % 256, (i * 53) % 128, 2, 2); } }), []);
  return <Hero d={1.25} ly={0.3} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 1.15, 3.4], [0, 0.85, -0.4]), C([0.25, 1.1, 3.2], [0, 0.85, -0.4]), 7.5)} set={(tt: number) => ({ warm: 0.4 + 0.3 * cl(tt - both) })}
    scene={(tt) => <>
      <mesh position={[0, 1.78, -1.25]}><boxGeometry args={[2.2, 0.85, 0.05]} /><meshStandardMaterial map={cork} roughness={0.95} /></mesh>
      <Box p={[0, 1.78, -1.28]} s={[2.3, 0.95, 0.03]} c="#6b4a2c" />
      <TearPad p={[-0.55, 1.78, -1.2]} pages={P1} tears={[]} t={tt} s={1.0} stamp={phys(tt, 1.9, 5, 0.4)} stampMap={GOOD} />
      <TearPad p={[0.55, 1.78, -1.2]} pages={P2} tears={[]} t={tt} s={1.0} stamp={phys(tt, d2 + 1.9, 5, 0.4)} stampMap={GOOD} />
      <Sachi p={withHands(mezclar(PZ.seiza, PZ.stand, sv(tt, 0.3, 1.8)), (q) => { q.manoI.p = [0.5, -0.75, 0.2]; q.manoD.p = [-0.5, -0.75, 0.2]; })} t={tt} x={-1.0} z={0.1} s={S} expr="feliz" />
      <Table p={[1.2, 0.05, 0.2]} w={0.5} d={0.45} h={0.35} />
      <Sachi p={withHands(mezclar(PZ.half, PZ.stand, sv(tt, d2, d2 + 1.8)), (q) => { q.manoD.p = [-0.32, -0.8, 0.55]; })} t={tt} x={0.85} z={0.1} rotY={30} s={S} expr="feliz" />
      <Ring p={[-1.0, 0.06, 0.1]} r={0.4} k={cl((tt - both) * 2)} col="#6fe39a" /><Ring p={[0.85, 0.06, 0.1]} r={0.4} k={cl((tt - both) * 2)} col="#6fe39a" />
    </>} />; };

// 23:06 · el primer y el último amigo: un tablón de madera de punta a punta; el bebé gatea en una punta, la abuela se apoya en la otra; una luz corre por el tablón y THE FLOOR queda grabado en él
export const G_firstfriend: F = ({ t, h }) => { const last = it(h, 0); const tx = useTextures();
  const word = useMemo(() => txt(1024, 160, (g) => { g.fillStyle = "#fff6d6"; g.font = "bold 140px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("THE FLOOR", 512, 86); }), []);
  return <Hero d={1.6} ly={0.38} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 1.25, 3.2], [0, 0.3, 0.1]), C([0.3, 1.15, 3.0], [0, 0.3, 0.1]), 8.5)} set={{ warm: 0.8 }}
    scene={(tt) => { const fl = eio(tt, 0.4, last + 0.6), cr = Math.sin(tt * 3) * 0.05, wk = sv(tt, last + 0.6, last + 1.6);
      const b: Pose = withHands(PZ.four, (q) => { q.manoI.p[2] += cr; q.manoD.p[2] -= cr; });
      return <>
        <Box p={[0, 0.07, 0.25]} s={[3.0, 0.07, 0.42]} c="#a06a3c" map={tx.planks} r={0.6} rad={0.012} />
        <Box p={[-1.5 + 1.5 * fl, 0.108, 0.25]} s={[3.0 * fl + 0.001, 0.006, 0.06]} c="#ffcf7a" e="#ffb347" ei={2} cast={false} />
        <mesh position={[0, 0.112, 0.27]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.2, 0.36]} /><meshBasicMaterial map={word} transparent opacity={wk} toneMapped={false} depthWrite={false} /></mesh>
        <group position={[0, 0.1, 0]}><Sachi p={b} t={tt} x={-1.2 + 0.12 * eio(tt, 0, 8)} z={0.2} rotY={90} s={0.28} color="#fbe9d8" expr="feliz" /></group>
        <group position={[0, 0.1, 0]}><Sachi p={secuencia([[0, PZ.seiza], [last, PZ.halfLean], [last + 0.9, PZ.stand]], tt)} t={tt} x={1.15} z={0.2} rotY={-70} s={S} expr="feliz" /></group>
      </>; }} />; };
