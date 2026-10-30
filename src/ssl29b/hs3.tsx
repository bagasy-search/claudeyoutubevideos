// ssl29b · el calor de la noche: componentes únicos en 3D. Cada uno = UNA idea con un objeto que se entiende sin leer,
// en el set de la casa de Sachiko con Blanquito-Sachiko haciendo lo que ella cuenta.
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


// ---------------- piezas de ssl29b (el calor de la noche) ----------------
const lab = (s: string, bg: string, fg = "#ffffff", w = 256, h = 110, fs = 64) => txt(w, h, (g) => { if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); } g.fillStyle = fg; g.font = `bold ${fs}px Georgia, serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, w / 2, h / 2 + 4); });
const Sign: React.FC<{ p: V; w: number; h: number; map: THREE.Texture; rot?: V; glow?: number; op?: number }> = ({ p, w, h, map, rot = [0, 0, 0], glow = 0, op = 1 }) =>
  <mesh position={p} rotation={rot}><planeGeometry args={[w, h]} /><meshStandardMaterial map={map} transparent opacity={op} emissive="#ffffff" emissiveMap={map} emissiveIntensity={glow} side={THREE.DoubleSide} /></mesh>;
const Glow: React.FC<{ p: V; r: number; k: number; c?: string; op?: number }> = ({ p, r, k, c = "#ff9a3c", op = 0.3 }) => k < 0.01 ? null :
  <mesh position={p}><sphereGeometry args={[r, 32, 20]} /><meshBasicMaterial color={c} transparent opacity={op * cl(k)} toneMapped={false} depthWrite={false} /></mesh>;
// tejido de punto (funda, suéter, medias de lana): v-es en filas
const knitTx = (c: string, d: string) => txt(256, 256, (g) => { g.fillStyle = c; g.fillRect(0, 0, 256, 256); g.strokeStyle = d; g.lineWidth = 5; for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { g.beginPath(); g.moveTo(x * 16, y * 16); g.lineTo(x * 16 + 8, y * 16 + 12); g.lineTo(x * 16 + 16, y * 16); g.stroke(); } });
const useKnit = () => useMemo(() => ({ red: knitTx("#b8483a", "#8e2f24"), grn: knitTx("#7a8f6a", "#5b6e4d"), crm: knitTx("#e7d4ae", "#c9b184"), wool: knitTx("#efe3c8", "#d8c7a2") }), []);
// futón en el piso, a lo largo de x; la almohada del lado +x (ahí queda la cabeza de la pose «lying»)
const Futon: React.FC<{ p: V; quilt?: string; qk?: number; rotY?: number; pillow?: boolean; ql?: number }> = ({ p, quilt = "#3f5f8f", qk = 1, rotY = 0, pillow = true, ql = 1.5 }) =>
  <group position={p} rotation={[0, rotY, 0]}>
    <Box p={[0, 0.06, 0]} s={[1.95, 0.1, 0.95]} c="#f3eee4" r={0.95} rad={0.04} />
    {pillow && <Box p={[0.72, 0.15, 0]} s={[0.3, 0.08, 0.5]} c="#e9e1cf" r={0.95} rad={0.04} />}
    {qk > 0.01 && <Box p={[-0.975 + ql / 2, 0.2 + (1 - qk) * 0.8, 0]} s={[ql, 0.1, 1.0]} c={quilt} r={0.95} rad={0.05} />}
  </group>;
// partículas que viajan de a a b en loop (calor naranja / frío celeste); stop < 1 = se frenan antes de llegar
const Flow: React.FC<{ a: V; b: V; t: number; k: number; c: string; n?: number; r?: number; speed?: number; stop?: number }> = ({ a, b, t, k, c, n = 10, r = 0.02, speed = 0.5, stop = 1 }) => k < 0.01 ? null :
  <>{Array.from({ length: n }, (_, i) => { const u = ((t * speed + i / n) % 1) * stop; return <mesh key={i} position={[lerp(a[0], b[0], u), lerp(a[1], b[1], u) + 0.03 * Math.sin(u * 9 + i), lerp(a[2], b[2], u)]}><sphereGeometry args={[r, 10, 8]} /><meshBasicMaterial color={c} transparent opacity={0.85 * cl(k) * Math.sin(Math.PI * Math.min(0.999, u / stop))} toneMapped={false} depthWrite={false} /></mesh>; })}</>;
// llama: cono emisivo que respira despacio (≤ 2 Hz, nunca titila)
const Flame: React.FC<{ p: V; k: number; r?: number; h?: number; c?: string; t: number; ph?: number }> = ({ p, k, r = 0.06, h = 0.16, c = "#ffb347", t, ph = 0 }) => k < 0.02 ? null :
  <group position={p} scale={[k, k * (0.92 + 0.08 * Math.sin(t * 2 * Math.PI * 1.1 + ph)), k]}>
    <mesh position={[0, h / 2, 0]}><coneGeometry args={[r, h, 24]} /><meshBasicMaterial color={c} transparent opacity={0.9} toneMapped={false} /></mesh>
    <mesh position={[0, h * 0.32, 0]}><coneGeometry args={[r * 0.55, h * 0.55, 20]} /><meshBasicMaterial color="#fff3c4" toneMapped={false} /></mesh>
  </group>;
// hilo de humo que sube cuando una llama se apaga
const Smoke: React.FC<{ p: V; t: number; k: number }> = ({ p, t, k }) => k < 0.01 || k > 0.99 ? null :
  <group position={p}>{Array.from({ length: 6 }, (_, i) => { const u = (k * 1.5 + i / 6) % 1; return <mesh key={i} position={[0.02 * Math.sin(u * 8 + t), u * 0.5, 0]}><sphereGeometry args={[0.015 + 0.03 * u, 10, 8]} /><meshBasicMaterial color="#9aa0a6" transparent opacity={0.45 * Math.sin(Math.PI * k) * (1 - u)} depthWrite={false} /></mesh>; })}</group>;
// yutampo: la bolsa de metal con forma de caparazón de tortuga (domo con aros); cover = la funda tejida (deja ver el relieve)
const Yutampo: React.FC<{ p: V; s?: number; cover?: number; glow?: number; rot?: V; knit?: THREE.Texture }> = ({ p, s = 1, cover = 0, glow = 0, rot = [0, 0, 0], knit }) =>
  <group position={p} scale={s} rotation={rot}>
    <mesh scale={[1, 0.38, 0.72]} position={[0, 0.02, 0]} castShadow><sphereGeometry args={[0.22, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#c9ccd2" metalness={0.85} roughness={0.28} emissive="#ff8a3c" emissiveIntensity={0.25 * glow} /></mesh>
    {[0.06, 0.12, 0.17].map((r, i) => <mesh key={i} position={[0, 0.02 + lerp(0.0836 * Math.sqrt(1 - (r / 0.22) ** 2), 0.1058 * Math.sqrt(1 - (r * 1.06 / 0.2484) ** 2) + 0.006, cover > 0.5 ? 1 : 0), 0]} scale={[1 + 0.06 * (cover > 0.5 ? 1 : 0), 0.72, 1]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r, 0.006 + 0.006 * cover, 8, 48]} /><meshStandardMaterial color={cover > 0.5 ? "#8e2f24" : "#a9adb4"} metalness={cover > 0.5 ? 0 : 0.9} roughness={0.25 + 0.7 * cover} /></mesh>)}
    <Cyl p={[0.13, 0.085, 0]} r={0.026} h={0.04} c="#8a8f97" m={0.8} />
    {cover > 0.01 && <mesh scale={[1.08, 0.46, 0.8]} position={[0, 0.02 + (1 - cover) * 0.5, 0]}><sphereGeometry args={[0.23, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#b8483a" map={knit} roughness={1} /></mesh>}
  </group>;
const Kettle: React.FC<{ p: V; s?: number; rotZ?: number }> = ({ p, s = 1, rotZ = 0 }) =>
  <group position={p} scale={s} rotation={[0, 0, rotZ]}>
    <Cyl p={[0, 0.12, 0]} r={0.15} r2={0.17} h={0.24} c="#c9ccd2" m={0.8} rough={0.3} />
    <mesh position={[0, 0.24, 0]}><sphereGeometry args={[0.15, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#c9ccd2" metalness={0.8} roughness={0.3} /></mesh>
    <Cyl p={[0, 0.4, 0]} r={0.025} h={0.04} c="#222" />
    <Cyl p={[0.2, 0.2, 0]} r={0.02} r2={0.035} h={0.18} c="#c9ccd2" m={0.8} rot={[0, 0, -0.9]} />
    <mesh position={[0, 0.34, 0]}><torusGeometry args={[0.12, 0.012, 8, 24, Math.PI]} /><meshStandardMaterial color="#2a2420" /></mesh>
  </group>;
// casa en corte (sin pared del frente): se ve el brillo adentro
const House: React.FC<{ p: V; s?: number; glow?: number }> = ({ p, s = 1, glow = 0 }) =>
  <group position={p} scale={s}>
    <Box p={[0, 0.3, -0.28]} s={[0.8, 0.6, 0.04]} c="#e6dccb" r={0.9} />
    {[-1, 1].map((k) => <Box key={k} p={[k * 0.38, 0.3, 0]} s={[0.04, 0.6, 0.6]} c="#e6dccb" r={0.9} />)}
    <Box p={[0, 0.02, 0]} s={[0.8, 0.04, 0.6]} c="#c9a676" e="#ff9a3c" ei={0.6 * glow} />
    <mesh position={[0, 0.79, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[0.62, 0.38, 4]} /><meshStandardMaterial color="#7a3b2e" roughness={0.8} /></mesh>
    <Cyl p={[0.12, 0.2, -0.1]} r={0.08} h={0.2} c="#3d4a5c" e="#ff6a1c" ei={1.0 * glow} />
  </group>;
const Hat: React.FC<{ p: V; c?: string; s?: number; map?: THREE.Texture }> = ({ p, c = "#8a8f97", s = 1, map }) =>
  <group position={p} scale={s}>
    <mesh castShadow><sphereGeometry args={[0.14, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={c} map={map} roughness={1} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.14, 0.025, 10, 32]} /><meshStandardMaterial color={c} roughness={1} /></mesh>
    <mesh position={[0, 0.16, 0]}><sphereGeometry args={[0.045, 16, 10]} /><meshStandardMaterial color="#f3eee4" roughness={1} /></mesh>
  </group>;
const Sock: React.FC<{ p: V; c: string; rotY?: number; s?: number; map?: THREE.Texture }> = ({ p, c, rotY = 0, s = 1, map }) =>
  <group position={p} rotation={[0, rotY, 0]} scale={s}>
    <Box p={[0, 0.2, 0]} s={[0.13, 0.34, 0.07]} c={c} map={map} r={1} rad={0.03} />
    <Box p={[0.08, 0.05, 0]} s={[0.28, 0.12, 0.07]} c={c} map={map} r={1} rad={0.04} />
    <Box p={[0, 0.36, 0]} s={[0.14, 0.05, 0.075]} c="#f3eee4" r={1} rad={0.02} />
  </group>;
const degTx = (n: string, bg = "#1f2a40", fg = "#ffd27a") => lab(n, bg, fg, 256, 256, 116);
// cortina que se corre: k = 1 cerrada, 0 abierta hacia «side»
const Curtain: React.FC<{ p: V; w: number; h: number; c: string; k: number; side: number }> = ({ p, w, h, c, k, side }) =>
  <group position={[p[0] + side * (1 - k) * w * 0.8, p[1], p[2]]} scale={[0.35 + 0.65 * k, 1, 1]}>
    {Array.from({ length: 5 }, (_, i) => <Box key={i} p={[(i - 2) * w / 5, h / 2, (i % 2) * 0.03]} s={[w / 5 + 0.01, h, 0.04]} c={c} r={1} rad={0.02} />)}
  </group>;
// ventana con cielo detrás (marco de madera), delante de la pared
const Win: React.FC<{ p: V; w?: number; h?: number; sky?: string }> = ({ p, w = 1.2, h = 1.0, sky = "#9cc3e6" }) =>
  <group position={p}>
    <mesh position={[0, 0, 0.005]}><planeGeometry args={[w, h]} /><meshBasicMaterial color={sky} toneMapped={false} /></mesh>
    {[[0, h / 2], [0, -h / 2]].map(([x, y], i) => <Box key={i} p={[x, y, 0.03]} s={[w + 0.1, 0.06, 0.06]} c="#6b4a2c" />)}
    {[-1, 0, 1].map((k) => <Box key={"v" + k} p={[k * w / 2, 0, 0.03]} s={[0.06, h, 0.06]} c="#6b4a2c" />)}
  </group>;
const Wallp: React.FC<{ p: V; w: number; h: number; c?: string }> = ({ p, w, h, c = "#ece3d1" }) => <Box p={[p[0], p[1] + h / 2, p[2]]} s={[w, h, 0.08]} c={c} r={0.95} />;
// pared de shoji: marco de madera y papel con luz
const Shoji: React.FC<{ p: V; w: number; h: number; glow?: number }> = ({ p, w, h, glow = 0.2 }) =>
  <group position={p}>
    <Box p={[0, h / 2, -0.02]} s={[w, h, 0.02]} c="#f4ecd8" e="#ffe2a8" ei={glow} />
    {Array.from({ length: Math.round(w / 0.3) + 1 }, (_, i) => <Box key={"v" + i} p={[-w / 2 + i * 0.3, h / 2, 0]} s={[0.025, h, 0.03]} c="#7a5634" />)}
    {Array.from({ length: Math.round(h / 0.3) + 1 }, (_, i) => <Box key={"h" + i} p={[0, i * 0.3, 0]} s={[w, 0.025, 0.03]} c="#7a5634" />)}
  </group>;
const LIE = PZ.lying;
const night = { bg: "#c9bfae", warm: 0.75 };
// inclinar el torso (reverencia, lavarse la cara)
const bend = (p: Pose, deg: number, f?: (q: any) => void): Pose => withHands(p, (q: any) => { q.torso = { ...(q.torso || {}), x: ((q.torso && q.torso.x) || 0) + deg }; if (q.cabeza) q.cabeza = { ...q.cabeza, x: (q.cabeza.x || 0) + deg * 0.2 }; f?.(q); });
// llega de a uno: 0 → 1 con resorte (en y cae desde arriba)
const drop = (tt: number, at: number, hgt = 0.9) => { const s = phys(tt, at, 6, 0.45); return { on: s > 0.01, y: (1 - Math.min(1, s)) * hgt, s }; };

// 0:14 · la factura de enero: ella acostada; la rejilla sopla cintas de aire tibio que cruzan hacia ella y el contador de bronce rueda hasta 298
export const G_bill: F = ({ t, h }) => {
  const usd = useMemo(() => lab("$", "#b08a3e", "#2a1d12", 128, 128, 96), []);
  return <Hero d={1.25} ly={0.3} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.5, 1.0, 2.0], [-0.3, 0.55, -0.5]), C([0.0, 0.95, 2.15], [-0.25, 0.55, -0.5]), 8.5)}
    set={(tt: number) => ({ ...night, spot: [0.75, 0, -1.0] as V, spotK: cl((tt - 4.4) * 1.5) })}
    scene={(tt) => { const n = Math.round(298 * eio(tt, 0.8, 4.6)), g = cl((tt - 4.6) * 2), od = drop(tt, 0.5, 0.8), air = sv(tt, 0.3, 1.2);
      return <>
        <Futon p={[-0.3, 0.04, 0.35]} quilt="#6d7f99" ql={1.4} />
        <group position={[-0.25, 0.1, 0.35]}><Sachi p={LIE} t={tt} s={S} expr={tt > 4.6 ? "triste" : "neutral"} /></group>
        <Shoji p={[0.3, 0.0, -1.32]} w={3.6} h={1.9} glow={0.12} />
        <Box p={[-0.9, 0.35, -1.25]} s={[0.66, 0.26, 0.05]} c="#d8d2c6" m={0.4} />
        {[0, 1, 2, 3, 4].map((i) => <Box key={i} p={[-0.9, 0.26 + i * 0.045, -1.22]} s={[0.6, 0.014, 0.02]} c="#8e8a82" />)}
        {[0, 1, 2].map((j) => <Flow key={j} a={[-0.9 + (j - 1) * 0.18, 0.35, -1.18]} b={[-0.3 + (j - 1) * 0.3, 0.42, 0.25]} t={tt + j * 0.33} k={air} c="#ffa25a" n={14} r={0.05} speed={0.42} />)}
        {od.on && <group position={[0.35, 0.95 + od.y, -1.2]}><Odo p={[0, 0, 0]} n={n} digits={3} s={1.7} glow={g} /></group>}
        {od.on && <Plate p={[0.0, 0.95 + od.y, -1.06]} s={0.28} map={usd} rot={[0, 0, 0]} glow={0.3 * g} />}
        <Ring p={[0.35, 0.06, -0.9]} r={0.4} k={g} col="#ff3b2f" />
      </>; }} />; };

// 0:47 · «calentás la casa»: flechas de calor gruesas salen por el techo de la casa en corte; la casa se apaga y una burbuja dorada se cierra sobre ella
export const G_heatperson: F = ({ t, h }) => { const a = it(h, 0);
  return <Hero d={1.2} ly={0.25} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.3, 1.3, 3.0], [0, 0.9, -0.3]), C([-0.3, 1.25, 3.0], [0, 0.9, -0.3]), 8)}
    set={(tt: number) => ({ spot: [0.75, 0, 0] as V, spotK: cl((tt - a) * 1.5) })}
    scene={(tt) => { const hs = drop(tt, 0.55, 0.9), off = sv(tt, a - 0.3, a + 0.8), me = drop(tt, 1.2, 0.0), hug = sv(tt, a + 0.2, a + 1.0);
      return <>
        {hs.on && <House p={[-0.75, 0.04 + hs.y, -0.4]} s={1.5} glow={1 - off} />}
        {hs.on && [-0.25, 0, 0.25].map((dx, i) => { const u = (tt * 0.45 + i / 3) % 1, k = (1 - off) * cl((tt - 0.6) * 2.5); return k < 0.01 ? null :
          <mesh key={i} position={[-0.75 + dx, 1.35 + 0.8 * u, -0.4]}><coneGeometry args={[0.09, 0.24, 20]} /><meshBasicMaterial color="#ff8a2c" transparent opacity={0.9 * k * Math.sin(Math.PI * u)} toneMapped={false} /></mesh>; })}
        {me.on && <Sachi p={PZ.stand} t={tt} x={0.75} z={0} rotY={-20} s={S} expr={tt > a ? "feliz" : "neutral"} />}
        {hug > 0.01 && <mesh position={[0.75, 0.62, 0]} scale={0.3 + 0.7 * hug}><sphereGeometry args={[0.55, 40, 24]} /><meshStandardMaterial color="#ffc46b" transparent opacity={0.22} emissive="#ffb347" emissiveIntensity={0.4} depthWrite={false} /></mesh>}
        <Ring p={[0.75, 0.06, 0]} r={0.5} k={hug} />
      </>; }} />; };

// 1:10 · nueve trucos: nueve objetos grandes llegan de a uno en abanico; el noveno es el futón, se enciende y ella se acuesta
export const G_ninetricks: F = ({ t, h }) => { const end = it(h, 0);
  const nums = useMemo(() => Array.from({ length: 9 }, (_, i) => numTx(i + 1, "#fff", i === 8 ? "#d9773a" : "#3b4f7a")), []);
  const T = useTx(), K = useKnit();
  const OB: ((g: number) => React.ReactNode)[] = [
    (g) => <Yutampo p={[0, 0, 0]} s={1.3} glow={g} />,
    () => <group><Cyl p={[0, 0.1, 0]} r={0.15} h={0.16} c="#b8483a" map={K.red} rough={1} /></group>,
    () => <Sock p={[-0.05, 0, 0]} c="#e7d4ae" map={K.crm} s={0.9} />,
    () => <Hat p={[0, 0.02, 0]} s={1.3} c="#8a8f97" />,
    () => <Box p={[0, 0.03, 0]} s={[0.42, 0.05, 0.32]} c="#5d6f88" map={T.blanket} />,
    () => <Cyl p={[0, 0.1, 0]} r={0.2} r2={0.16} h={0.2} c="#a57a4e" rough={0.6} />,
    () => <Cyl p={[0, 0.22, 0]} r={0.08} h={0.44} c="#e88aa6" rough={0.35} />,
    () => <Box p={[0, 0.04, 0]} s={[0.4, 0.06, 0.3]} c="#efe3c8" map={K.wool} />,
    (g) => <group><Box p={[0, 0.05, 0]} s={[0.75, 0.08, 0.45]} c="#efe8da" /><Box p={[0, 0.11, 0]} s={[0.75, 0.04, 0.45]} c="#e88aa6" /><Box p={[0, 0.17, 0]} s={[0.75, 0.08, 0.45]} c="#3f5f8f" e="#ffb347" ei={0.6 * g} /></group>,
  ];
  return <Hero d={1.05} ly={0.1} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.3, 1.95, 2.9], [0.05, 0.2, -0.4]), C([-0.4, 1.8, 2.9], [0.05, 0.2, -0.4]), 8.5)}
    set={(tt: number) => ({ spot: [1.3, 0, -0.35] as V, spotK: cl((tt - end) * 1.5) })}
    scene={(tt) => { const g9 = sv(tt, end - 0.2, end + 0.6), lie = sv(tt, end + 0.4, end + 1.6);
      return <>{OB.map((o, i) => { const s = phys(tt, 0.5 + i * 0.36, 6.5, 0.42); if (s <= 0.01) return null; const a = Math.PI * (0.94 - i * 0.11), x = Math.cos(a) * 1.4, z = Math.sin(a) * 0.75 - 0.8;
        return <group key={i} position={[x, 0.05 + (1 - Math.min(1, s)) * 0.9, z]} scale={i === 8 ? 1.3 : 1.5}>
          {o(i === 8 ? g9 : 0)}
          <Plate p={[0, 0.06, i === 8 ? 0.38 : 0.3]} s={0.26} map={nums[i]} glow={i === 8 ? 0.5 * g9 : 0.1} />
          {i === 8 && <Ring p={[0, 0.07, 0]} r={0.55} k={g9} />}
          {i === 8 && <Glow p={[0, 0.2, 0]} r={0.5} k={g9} op={0.18} />}
        </group>; })}
        <Sachi p={mezclar(PZ.seiza, PZ.lying, lie)} t={tt} x={lerp(0, 1.2, lie)} z={lerp(0.15, -0.35, lie)} rotY={lerp(0, -90, lie)} s={S} expr="feliz" />
      </>; }} />; };

// 2:05 · nunca la estufa a kerosén de noche: una estufa de verdad (rejilla, llama, asa) junto al futón; la cruz roja cae con peso y la llama se apaga
export const G_noheater: F = ({ t, h }) => { const k2 = it(h, 0);
  return <Hero d={1.2} ly={0.25} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([1.4, 1.2, 2.5], [0.4, 0.4, -0.2]), C([0.7, 1.1, 2.7], [0.4, 0.4, -0.2]), 8)}
    set={(tt: number) => ({ ...night, spot: [1.15, 0, -0.35] as V, spotK: cl((tt - k2) * 1.5) })}
    scene={(tt) => { const st = drop(tt, 0.4, 1.0), x = phys(tt, k2 + 0.2, 5, 0.45), xk = Math.min(1, x), dim = sv(tt, k2 + 0.5, k2 + 1.4);
      return <>
        <Futon p={[-0.55, 0.04, 0.1]} quilt="#6d7f99" ql={1.4} />
        <group position={[-0.5, 0.1, 0.1]}><Sachi p={LIE} t={tt} s={S} expr="neutral" /></group>
        {st.on && <group position={[1.15, 0.04 + st.y, -0.35]}>
          <Cyl p={[0, 0.06, 0]} r={0.26} h={0.12} c="#2d3540" m={0.5} rough={0.4} />
          {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <Cyl key={i} p={[Math.cos(a) * 0.2, 0.32, Math.sin(a) * 0.2]} r={0.008} h={0.4} c="#c9ccd2" m={0.8} />; })}
          <Cyl p={[0, 0.3, 0]} r={0.13} h={0.36} c="#ff7a2c" e="#ff6a1c" ei={1.4 * (1 - dim)} op={0.85} />
          <Cyl p={[0, 0.53, 0]} r={0.22} h={0.04} c="#2d3540" m={0.5} />
          <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.12, 0.015, 8, 24, Math.PI]} /><meshStandardMaterial color="#c9ccd2" metalness={0.8} /></mesh>
          <Flame p={[0, 0.55, 0]} k={1 - dim} r={0.07} h={0.2} t={tt} />
          <Smoke p={[0, 0.6, 0]} t={tt} k={dim} />
        </group>}
        <Glow p={[1.15, 0.4, -0.35]} r={0.5} k={(1 - dim) * cl(tt - 0.6)} op={0.25} />
        <Ring p={[1.15, 0.06, -0.35]} r={0.42} k={sv(tt, k2, k2 + 0.4)} col="#ff3b2f" />
        {x > 0.01 && <group position={[1.15, 0.36 + (1 - xk) * 1.3, 0.05]} rotation={[0, 0, Math.PI / 4]} scale={0.6}>
          <Box p={[0, 0, 0]} s={[0.8, 0.11, 0.07]} c="#d63a2a" e="#d63a2a" ei={0.4} /><Box p={[0, 0, 0]} s={[0.11, 0.8, 0.07]} c="#d63a2a" e="#d63a2a" ei={0.4} />
        </group>}
      </>; }} />; };

// 2:42 · la yutampo de metal (caparazón de tortuga) gira despacio; la funda tejida baja encima y el relieve de los aros se marca a través
export const G_turtle: F = ({ t, h }) => { const cv = it(h, 0); const K = useKnit();
  return <Hero d={1.1} ly={0.08} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.7, 0.75, 1.4], [0, 0.15, 0]), C([-0.5, 0.7, 1.4], [0, 0.15, 0]), 9)}
    set={(tt: number) => ({ spot: [0, 0, 0] as V, spotK: 0.6 })}
    scene={(tt) => { const y = drop(tt, 0.55, 0.8), c = sv(tt, cv - 0.2, cv + 1.0), kt = drop(tt, 1.0, 0.8);
      return <>
        {y.on && <group position={[0, y.y, 0]} rotation={[0, tt * 0.35, 0]}><Yutampo p={[0, 0.05, 0]} s={2.2} cover={c} glow={0.4} knit={K.red} /></group>}
        <Steam p={[0.3, 0.3, 0]} t={tt} k={0.8 * (1 - c) * cl(tt - 0.8)} />
        {void kt}
      </>; }} />; };

// 3:15 · a la mañana: primer plano de la palangana; la yutampo vuelca un chorro grueso de agua tibia que humea, y dos manos en cuenco la levantan
export const G_washface: F = ({ t, h }) => { const nw = it(h, 0);
  return <Hero d={0.9} ly={0.05} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.55, 0.6, 1.1], [0, 0.18, 0]), C([-0.35, 0.6, 1.15], [0, 0.18, 0]), 8)}
    set={(tt: number) => ({ spot: [0, 0, 0] as V, spotK: 0.6, warm: 0.5 })}
    scene={(tt) => { const bs = drop(tt, 0.55, 0.6), pour = sv(tt, 1.1, 1.6) - sv(tt, 3.4, 3.9), lvl = eio(tt, 1.3, 3.6), cup = sv(tt, nw - 1.0, nw - 0.2) - sv(tt, nw + 1.2, nw + 1.8);
      return <>
        {bs.on && <group position={[0, bs.y, 0]}>
          <Cyl p={[0, 0.1, 0]} r={0.34} r2={0.26} h={0.2} c="#a57a4e" rough={0.6} />
          <Cyl p={[0, 0.03 + 0.15 * lvl, 0]} r={0.26 + 0.07 * lvl} h={0.012} c="#7fc4f0" op={0.85} />
        </group>}
        <Steam p={[0, 0.2, 0]} t={tt} k={lvl} n={10} /><Steam p={[0.12, 0.2, 0.08]} t={tt + 0.7} k={lvl} n={8} />
        <group position={[0.3, 0.4 + 0.6 * (1 - cl((tt - 0.7) * 2)), -0.05]} rotation={[0, 0, 0.9 * pour]}><Yutampo p={[0, 0, 0]} s={1.3} /></group>
        {pour > 0.15 && <Cyl p={[0.14, 0.24, -0.05]} r={0.045} r2={0.035} h={0.3} c="#bfe4f2" op={0.85 * pour} />}
        {pour > 0.15 && Array.from({ length: 8 }, (_, i) => { const u = (tt * 1.6 + i / 8) % 1, a = i * 0.8; return <mesh key={i} position={[0.12 + 0.12 * u * Math.cos(a), 0.05 + 0.12 * lvl + 0.1 * Math.sin(Math.PI * u), -0.05 + 0.12 * u * Math.sin(a)]}><sphereGeometry args={[0.014, 10, 8]} /><meshStandardMaterial color="#bfe4f2" transparent opacity={0.85 * pour} /></mesh>; })}
        {cup > 0.01 && [-1, 1].map((k) => <mesh key={k} position={[k * 0.06, 0.12 + 0.3 * cup, 0.05]} scale={[1, 0.55, 1.2]} rotation={[0, 0, k * 0.35]}><sphereGeometry args={[0.08, 24, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#f1ede6" roughness={0.7} side={THREE.DoubleSide} /></mesh>)}
        {cup > 0.3 && <Cyl p={[0, 0.1 + 0.3 * cup, 0.05]} r={0.07} h={0.01} c="#7fc4f0" op={0.8} />}
      </>; }} />; };

// 3:29 · un termómetro gigante junto a la pava: la columna roja sube y se frena con rebote antes de la banda ancha del hervor
export const G_kettle: F = ({ t, h }) => { const st = it(h, 0);
  const boil = useMemo(() => lab("BOIL", "#d63a2a", "#fff", 300, 130, 90), []);
  return <Hero d={1.1} ly={0.35} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.8, 1.25, 2.8], [0.15, 0.75, -0.3]), C([0.0, 1.15, 2.9], [0.15, 0.75, -0.3]), 9)}
    set={(tt: number) => ({ spot: [0.45, 0, -0.4] as V, spotK: cl((tt - st) * 1.5) })}
    scene={(tt) => { const rise = phys(tt, 0.6, 3.2, 0.32), lv = 0.12 + 0.62 * Math.min(1.08, rise), ok = sv(tt, st + 0.2, st + 0.8), th = drop(tt, 0.55, 1.2), kt = drop(tt, 0.2, 0.8);
      return <>
        {kt.on && <group position={[0, kt.y, 0]}><Box p={[-0.5, 0.18, -0.35]} s={[0.62, 0.3, 0.5]} c="#4a4f57" m={0.3} /><Kettle p={[-0.5, 0.33, -0.35]} s={1.25} /></group>}
        <Steam p={[-0.16, 0.66, -0.35]} t={tt} k={(0.3 + 0.7 * lv) * cl(tt - 0.6)} n={9} />
        {th.on && <group position={[0.5, 0.05 + th.y, -0.4]} scale={1.2}>
          <Cyl p={[0, 0.72, 0]} r={0.13} h={1.32} c="#e6eef4" op={0.55} rough={0.05} />
          <mesh position={[0, 0.08, 0]}><sphereGeometry args={[0.17, 28, 18]} /><meshStandardMaterial color="#d63a2a" emissive="#d63a2a" emissiveIntensity={0.5} /></mesh>
          <Cyl p={[0, 0.08 + 0.6 * lv, 0.0]} r={0.09} h={1.2 * lv} c="#e23b2a" e="#e23b2a" ei={0.6} />
          <mesh position={[0, 1.24, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.15, 0.05, 12, 40]} /><meshStandardMaterial color="#d63a2a" emissive="#d63a2a" emissiveIntensity={0.5} /></mesh>
          <Sign p={[0.5, 1.24, 0]} w={0.6} h={0.26} map={boil} glow={0.3} />
          {[0.3, 0.5, 0.7, 0.9, 1.1].map((y) => <Box key={y} p={[0.13, y, 0]} s={[0.05, 0.012, 0.02]} c="#333" />)}
          <Ring p={[0, 0.08 + 1.2 * lv, 0]} r={0.22} k={ok} col={GRN} />
        </group>}
      </>; }} />; };

// 3:52 · media hora antes: la yutampo a los pies del futón; el calor sube por las capas mientras el gajo del reloj se llena; al cerrar, el futón brilla
export const G_thirtymin: F = ({ t, h }) => { const late = it(h, 0);
  return <Hero d={1.15} ly={0.2} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.6, 1.55, 2.2], [0.1, 0.3, -0.25]), C([-0.2, 1.45, 2.3], [0.1, 0.3, -0.25]), 9)}
    set={(tt: number) => ({ ...night, spot: [0, 0, 0] as V, spotK: 0.3 + 0.5 * sv(tt, 5.0, 6.0) })}
    scene={(tt) => { const sw = eio(tt, 0.8, 5.8), heat = eio(tt, 1.0, 5.8), y = drop(tt, 0.4, 0.8), dl = drop(tt, 0.2, 0.8), done = sv(tt, 5.6, 6.4);
      return <>
        <Futon p={[0, 0.04, 0]} quilt="#6d7f99" qk={0} />
        <Box p={[-0.95 + 1.75 * heat / 2, 0.165, 0]} s={[Math.max(0.05, 1.75 * heat), 0.014, 0.85]} c="#ff9a3c" e="#ff7a2c" ei={0.6 + 0.6 * done} op={0.8} />
        {[0, 1, 2].map((i) => <Flow key={i} a={[-0.75, 0.2, -0.25 + i * 0.25]} b={[0.6, 0.3, -0.25 + i * 0.25]} t={tt + i * 0.3} k={heat} c="#ffb26b" n={8} r={0.028} speed={0.35} />)}
        {y.on && <Yutampo p={[-0.75, 0.17 + y.y, 0]} s={1.4} cover={0} glow={0.6} />}
        <Glow p={[0, 0.25, 0]} r={0.9} k={done} op={0.16} />
        {dl.on && <Dial p={[0.25, 0.85 + dl.y, -0.95]} ang={sw * Math.PI} sweep={sw * 0.5} s={0.95} />}
        <Ring p={[0.25, 0.06, -0.7]} r={0.35} k={tt > late ? 1 : 0} />
      </>; }} />; };

// 4:37 · la panza es la estufa del cuerpo: la faja brilla como un hornillo y venas de luz corren de a una a las manos y a los pies
export const G_bellystove: F = ({ t, h }) => { const w = it(h, 0); const K = useKnit();
  const B = useMemo(() => bodyOf(PZ.stand, 0, 0), []), tI = useMemo(() => toeOf(PZ.stand, "I"), []), tD = useMemo(() => toeOf(PZ.stand, "D"), []);
  return <Hero d={1.3} ly={0.35} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.5, 0.85, 1.85], [0, 0.6, 0]), C([-0.4, 0.85, 1.9], [0, 0.6, 0]), 8.5)}
    set={(tt: number) => ({ spot: [0, 0, 0] as V, spotK: 0.6, warm: 0.5 })}
    scene={(tt) => { const band = sv(tt, 0.4, 1.3), fl = sv(tt, w - 0.2, w + 0.8);
      const belly: V = [B.pel[0], B.pel[1] + 0.1, B.pel[2]];
      const tgt: V[] = [[B.hom[0] + 0.28, B.pel[1] - 0.05, B.hom[2]], [B.hom[0] - 0.28, B.pel[1] - 0.05, B.hom[2]], [tI[0], 0.08, tI[2]], [tD[0], 0.08, tD[2]]];
      return <>
        <Sachi p={PZ.stand} t={tt} s={S} expr="feliz" />
        {band > 0.01 && <mesh position={belly} scale={[1, Math.max(0.05, band), 1]}><cylinderGeometry args={[0.13, 0.13, 0.16, 40, 1, true]} /><meshStandardMaterial color="#b8483a" map={K.red} roughness={1} side={THREE.DoubleSide} emissive="#ff6a1c" emissiveIntensity={0.25 + 0.9 * fl} /></mesh>}
        <Glow p={belly} r={0.24} k={band * (0.4 + 0.6 * fl)} op={0.35} />
        {tgt.map((b, i) => { const k = sv(tt, w + i * 0.45, w + i * 0.45 + 0.5); return <React.Fragment key={i}>{k > 0.01 && <Cord a={belly} b={[lerp(belly[0], b[0], k), lerp(belly[1], b[1], k), lerp(belly[2], b[2], k) + 0.06]} w={0.012} c="#ffb26b" />}<Flow a={belly} b={b} t={tt + i * 0.2} k={k} c="#ffcf8a" n={10} r={0.03} /><Glow p={b} r={0.09} k={k} op={0.5} /></React.Fragment>; })}
      </>; }} />; };

// 5:00 · un suéter viejo (punto, cuello, puños): la tijera corta las mangas, caen; el cuerpo se enrolla en tubo y queda como faja
export const G_sweatertube: F = ({ t, h }) => { const tb = it(h, 0); const K = useKnit();
  return <Hero d={1.1} ly={0.0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 1.5, 1.6], [0, 0.05, -0.05]), C([-0.3, 1.4, 1.7], [0, 0.05, -0.05]), 8.5)}
    set={(tt: number) => ({ spot: [0, 0, 0] as V, spotK: 0.6 })}
    scene={(tt) => { const sw = drop(tt, 0.55, 0.6), cutL = sv(tt, 0.9, 1.5), cutR = sv(tt, 1.5, 2.1), offL = sv(tt, 1.5, 2.3), offR = sv(tt, 2.1, 2.9), roll = sv(tt, tb, tb + 1.4);
      const sc = (k: number) => cutL < 1 ? [-0.36, 0.2 - 0.4 * cutL] : [0.36, 0.2 - 0.4 * k];
      const [sx, sz] = sc(cutR);
      return sw.on ? <group position={[0, sw.y, 0]}>
        {roll < 0.98 && <Box p={[0, 0.07, 0.05 * roll]} s={[0.66, 0.05, 0.8 * (1 - 0.55 * roll)]} c="#7a8f6a" map={K.grn} r={1} rad={0.02} />}
        {roll < 0.6 && <mesh position={[0, 0.1, -0.38]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.11, 0.03, 10, 30]} /><meshStandardMaterial color="#5b6e4d" roughness={1} /></mesh>}
        {roll > 0.3 && <group position={[0, 0.07 + 0.1 * roll, 0.18]} rotation={[0, 0, Math.PI / 2]}><mesh><cylinderGeometry args={[0.13, 0.13, 0.66, 40, 1, true]} /><meshStandardMaterial color="#7a8f6a" map={K.grn} roughness={1} side={THREE.DoubleSide} /></mesh></group>}
        {[-1, 1].map((k) => { const o = k < 0 ? offL : offR; return <group key={k} position={[k * (0.62 + 0.45 * o), 0.07, -0.05 + 0.25 * o]} rotation={[0, k * (0.5 + 0.6 * o), 0]}>
          <Box p={[0, 0, 0]} s={[0.55, 0.045, 0.2]} c="#6d8160" map={K.grn} r={1} rad={0.02} /><Box p={[k * 0.29, 0, 0]} s={[0.06, 0.05, 0.21]} c="#5b6e4d" r={1} rad={0.02} />
        </group>; })}
        {[-1, 1].map((k) => { const c = k < 0 ? cutL : cutR; return c > 0.01 && (k < 0 ? offL : offR) < 0.5 ? Array.from({ length: 6 }, (_, i) => i / 6 < c ? <Box key={k + "_" + i} p={[k * 0.35, 0.1, 0.2 - i * 0.075]} s={[0.014, 0.006, 0.04]} c="#ffe08a" e="#ffd060" ei={0.8} cast={false} /> : null) : null; })}
        {cutR < 1 && tt > 0.7 && <group position={[sx, 0.2, sz]} scale={2} rotation={[0, 0, 0.3 * Math.sin(tt * 2 * Math.PI * 1.5)]}>
          {[-1, 1].map((k) => <group key={k} rotation={[0, k * 0.25, 0]}><Box p={[0, 0, -0.1]} s={[0.025, 0.012, 0.2]} c="#c9ccd2" m={0.85} /><mesh position={[k * 0.04, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.04, 0.012, 8, 20]} /><meshStandardMaterial color="#d63a2a" /></mesh></group>)}
        </group>}
      </group> : null; }} />; };

// 5:37 · medias de día húmedas (gotean y dejan un charquito) contra medias de lana de noche (tibias, con vapor)
export const G_dampsocks: F = ({ t, h }) => { const cold = it(h, 0); const K = useKnit();
  return <Hero d={1.15} ly={0.3} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.4, 1.05, 2.3], [0, 0.75, 0]), C([-0.4, 1.0, 2.3], [0, 0.75, 0]), 8)}
    set={(tt: number) => ({ spot: [0.6, 0, 0] as V, spotK: 0.5 })}
    scene={(tt) => { const ck = sv(tt, cold - 0.3, cold + 0.6), pud = sv(tt, 1.5, 4);
      return <>
        <Cord a={[-1.2, 1.35, 0]} b={[1.2, 1.35, 0]} w={0.008} c="#8a6a48" />
        {[-1.2, 1.2].map((x) => <Box key={x} p={[x, 0.68, 0]} s={[0.05, 1.35, 0.05]} c="#6b4a2c" />)}
        {[[-0.8, 1], [-0.45, 1], [0.45, 0], [0.8, 0]].map(([x, d], i) => { const s = phys(tt, 0.3 + i * 0.3, 6, 0.4); if (s <= 0.01) return null;
          return <group key={i} position={[x, 0.93 + (1 - Math.min(1, s)) * 0.6, 0]}>
            <Box p={[0, 0.42, 0]} s={[0.04, 0.08, 0.08]} c="#d9b25a" />
            <Sock p={[0, 0, 0]} c={d ? "#7d8a96" : "#d9773a"} map={d ? undefined : K.red} s={1.15} />
            {d ? Array.from({ length: 4 }, (_, j) => { const u = (tt * 0.7 + j / 4) % 1; return <mesh key={j} position={[0.06 * j - 0.06, -0.02 - u * 0.86, 0]}><sphereGeometry args={[0.036, 12, 10]} /><meshStandardMaterial color="#7fc4f0" transparent opacity={0.9 * (1 - u * 0.6)} roughness={0.05} /></mesh>; }) : <><Steam p={[0.02, 0.3, 0]} t={tt + i} k={1} n={9} /><Steam p={[0.1, 0.25, 0]} t={tt + i + 0.6} k={1} n={7} /></>}
          </group>; })}
        {[-0.8, -0.45].map((x) => <mesh key={x} position={[x, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={Math.max(0.05, pud)}><circleGeometry args={[0.24, 32]} /><meshStandardMaterial color="#7fb5d6" transparent opacity={0.75} roughness={0.02} metalness={0.3} /></mesh>)}
        <Glow p={[0.62, 1.05, 0]} r={0.42} k={cl(tt - 1.5)} op={0.16} />
        <Glow p={[-0.62, 1.05, 0]} r={0.42} k={ck} c="#7fc4f0" op={0.2} />
      </>; }} />; };

// 6:06 · el elástico que aprieta: pierna y pie de arcilla; la banda roja se hunde en el tobillo, el calor baja y se frena ahí; los dedos se ponen celestes con escarcha
export const G_tightankle: F = ({ t, h }) => { const toes = it(h, 0);
  return <Hero d={1.05} ly={0.05} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([1.2, 0.7, 1.7], [0.1, 0.45, 0]), C([0.6, 0.75, 1.9], [0.1, 0.45, 0]), 7.5)}
    set={(tt: number) => ({ spot: [0.1, 0, 0] as V, spotK: 0.5 })}
    scene={(tt) => { const lg = drop(tt, 0.55, 0.0), bd = drop(tt, 0.8, 0.8), sq = sv(tt, 1.4, 2.2), blue = sv(tt, toes - 0.4, toes + 0.6);
      const skin = new THREE.Color("#f1ede6").lerp(new THREE.Color("#8cc8ec"), blue).getStyle();
      return lg.on ? <group scale={Math.min(1, lg.s)}>
        <Cyl p={[0, 0.85, 0]} r={0.13} r2={0.115} h={0.6} c="#f1ede6" rough={0.7} />
        <Cyl p={[0, 0.4, 0]} r={0.115} r2={0.09 - 0.025 * sq} h={0.3} c="#f1ede6" rough={0.7} />
        <mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color={skin} roughness={0.7} /></mesh>
        <Box p={[0.17, 0.09, 0]} s={[0.42, 0.14, 0.22]} c={skin} r={0.7} rad={0.07} />
        {[-0.08, -0.04, 0, 0.04, 0.08].map((z, i) => <mesh key={i} position={[0.4, 0.08, z]}><sphereGeometry args={[0.03 - Math.abs(z) * 0.08, 14, 10]} /><meshStandardMaterial color={skin} roughness={0.7} /></mesh>)}
        {bd.on && <mesh position={[0, 0.3 + bd.y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.1 - 0.022 * sq, 0.026, 10, 36]} /><meshStandardMaterial color="#c0392b" emissive="#c0392b" emissiveIntensity={0.3} /></mesh>}
        <Flow a={[0.02, 1.15, 0.14]} b={[0.25, 0.1, 0.14]} t={tt} k={cl(tt - 1)} c="#ff7a4a" n={12} r={0.026} speed={0.55} stop={0.78 - 0.1 * sq} />
        {blue > 0.05 && Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0.3 + 0.03 * (i % 5), 0.17 + 0.02 * Math.sin(i * 3), -0.1 + 0.022 * i]}><octahedronGeometry args={[0.012 * blue, 0]} /><meshStandardMaterial color="#e8f6ff" emissive="#bfe6ff" emissiveIntensity={0.5} /></mesh>)}
        <Glow p={[0.3, 0.1, 0]} r={0.22} k={blue} c="#7fc4f0" op={0.25} />
      </group> : null; }} />; };

// 6:57 · tres gorros tejidos, tres monjitas: la mamá y las dos hijas sentadas; los gorros caen de a uno con rebote y ellas se ríen
export const G_threehats: F = ({ t, h }) => {
  const P3: [number, number, number, string][] = [[-0.7, 1.0, 0.0, "#8a8f97"], [0.05, 0.8, 0.12, "#b8483a"], [0.7, 0.72, 0.0, "#5d6f88"]];
  return <Hero d={1.25} ly={0.3} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.3, 1.0, 2.5], [0, 0.45, 0]), C([-0.3, 0.95, 2.5], [0, 0.45, 0]), 8)}
    set={(tt: number) => ({ ...night, spot: [0, 0, 0] as V, spotK: 0.5 })}
    scene={(tt) => <>
      <Futon p={[0, 0.04, 0.0]} quilt="#6d7f99" qk={0} pillow={false} />
      {P3.map(([x, s, z, c], i) => { const hd = headOf(PZ.seiza, 0, 0, S * s), at = 1.0 + i * 0.75, d = phys(tt, at, 5.5, 0.4), laugh = sv(tt, at + 0.3, at + 0.7), sway = Math.sin(tt * 2.2 + i) * 7 * laugh, ap = drop(tt, 0.3 + i * 0.15, 0.0);
        return ap.on ? <group key={i} position={[x, 0.1, z]} rotation={[0, 0, sway * Math.PI / 180]} scale={Math.min(1, ap.s)}>
          <Sachi p={PZ.seiza} t={tt} s={S * s} expr={laugh > 0.5 ? "feliz" : "neutral"} />
          {d > 0.01 && <Hat p={[hd[0], hd[1] + 0.17 * s + (1 - Math.min(1, d)) * 1.2, hd[2]]} c={c} s={s * 1.45} />}
        </group> : null; })}
    </>} />; };

// 7:30 · antes de que baje el sol: el sol grande baja detrás de la ventana, la luz entra y se alarga en el tatami; el reloj grande llega a las 4:30 y las cortinas se cierran de a una
export const G_sunset: F = ({ t, h }) => { const cl0 = it(h, 0);
  return <Hero d={1.2} ly={0.25} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.5, 1.2, 2.4], [0, 0.85, -1.0]), C([-0.4, 1.15, 2.4], [0, 0.85, -1.0]), 9)}
    set={(tt: number) => ({ spot: [0.15, 0, -0.5] as V, spotK: 0.5 * (1 - sv(tt, cl0, cl0 + 2)), warm: 0.3 + 0.5 * cl(tt / 5) })}
    scene={(tt) => { const sun = eio(tt, 0.3, cl0 + 0.3), czL = sv(tt, cl0, cl0 + 0.9), czR = sv(tt, cl0 + 0.7, cl0 + 1.6), dl = drop(tt, 0.4, 0.8);
      const sky = new THREE.Color("#9cc3e6").lerp(new THREE.Color("#f08a4a"), sun).getStyle();
      return <>
        <Wallp p={[0, 0.0, -1.3]} w={3.6} h={2.2} />
        <Win p={[0.35, 1.1, -1.25]} w={1.2} h={1.0} sky={sky} />
        <mesh position={[0.35, 1.48 - 0.36 * sun, -1.237]}><circleGeometry args={[0.2, 40]} /><meshBasicMaterial color={new THREE.Color("#ffd27a").lerp(new THREE.Color("#ff7a3c"), sun).getStyle()} toneMapped={false} /></mesh>
        <Curtain p={[0.0, 0.6, -1.15]} w={0.66} h={1.1} c="#8a3b2e" k={czL} side={-1} />
        <Curtain p={[0.7, 0.6, -1.15]} w={0.66} h={1.1} c="#8a3b2e" k={czR} side={1} />
        <mesh position={[0.35 - 0.1 * sun, 0.052, -0.6 + 0.35 * sun]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1 + 1.2 * sun, 1]}><planeGeometry args={[1.1, 0.7]} /><meshBasicMaterial color="#ffc27a" transparent opacity={0.35 * (1 - Math.max(czL, czR) * 0.9)} toneMapped={false} depthWrite={false} /></mesh>
        {dl.on && <Dial p={[-0.95, 1.15 + dl.y, -1.2]} ang={(4.5 / 12) * Math.PI * 2 * eio(tt, 0.5, cl0)} s={0.9} />}
      </>; }} />; };

// 8:21 · la víbora de puerta: una ráfaga celeste con escarcha se cuela por la rendija; la toalla enrollada con ojitos llega ondulando, la frena y el tatami se entibia
export const G_doorsnake: F = ({ t, h }) => {
  return <Hero d={1.15} ly={0.0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.9, 0.55, 1.6], [0, 0.25, -0.8]), C([0.2, 0.5, 1.7], [0, 0.25, -0.8]), 8)}
    set={(tt: number) => ({ spot: [0, 0, -0.5] as V, spotK: 0.6 * sv(tt, 3.4, 4.4) })}
    scene={(tt) => { const roll = phys(tt, 1.6, 3.2, 0.6), rk = Math.min(1, roll), stop = sv(tt, 2.8, 3.4), wig = 0.05 + (1 - rk) * 0.1;
      return <>
        <Wallp p={[0, 0.0, -1.05]} w={3.4} h={2.0} />
        <Box p={[0, 0.97, -1.0]} s={[0.85, 1.75, 0.06]} c="#8a5a34" r={0.6} />
        <mesh position={[0, 0.07, -1.0]}><planeGeometry args={[0.85, 0.05]} /><meshBasicMaterial color="#1a2433" toneMapped={false} /></mesh>
        {Array.from({ length: 6 }, (_, i) => <Flow key={i} a={[-0.35 + i * 0.14, 0.08, -0.98]} b={[-0.5 + i * 0.2, 0.1, 0.5]} t={tt + i * 0.17} k={sv(tt, 0.2, 0.8) * (1 - stop)} c="#e2f4ff" n={9} r={0.03} speed={0.55} />)}
        <mesh position={[0, 0.052, -0.4]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.6, 1.3]} /><meshBasicMaterial color={stop > 0.5 ? "#ffb35a" : "#9fd2ff"} transparent opacity={0.5 * Math.max(sv(tt, 0.4, 1.2) * (1 - stop), sv(tt, 3.4, 4.4))} toneMapped={false} depthWrite={false} /></mesh>
        <group position={[lerp(-1.7, 0, rk), 0.1, -0.86]}>
          {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.4 + i * 0.16, 0.02, Math.sin(tt * 3 * (1 - rk) + i * 1.1) * wig]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.11, 0.11, 0.17, 28]} /><meshStandardMaterial color={i % 2 ? "#e8dcc4" : "#d9c9a8"} roughness={1} /></mesh>)}
          {[0.05, -0.05].map((z) => <group key={z} position={[0.42, 0.13, z + Math.sin(tt * 3 * (1 - rk) + 5 * 1.1) * wig]}><mesh><sphereGeometry args={[0.04, 16, 12]} /><meshStandardMaterial color="#ffffff" /></mesh><mesh position={[0.025, 0.01, 0]}><sphereGeometry args={[0.022, 12, 8]} /><meshStandardMaterial color="#1a1a1a" /></mesh></group>)}
          <group position={[0.5 + 0.04 * Math.max(0, Math.sin(tt * 2 * Math.PI * 1.2)), 0.0, Math.sin(tt * 3 * (1 - rk) + 5 * 1.1) * wig]}><Box p={[0.04, 0, 0]} s={[0.1, 0.008, 0.025]} c="#d63a2a" /><Box p={[0.1, 0, 0.012]} s={[0.04, 0.008, 0.012]} c="#d63a2a" rot={[0, 0.5, 0]} /><Box p={[0.1, 0, -0.012]} s={[0.04, 0.008, 0.012]} c="#d63a2a" rot={[0, -0.5, 0]} /></group>
        </group>
      </>; }} />; };

// 9:08 · la casa en maqueta: cinco cuartos se levantan de a uno, cada uno con su brasero encendido; se apagan de a uno y sólo queda el de ella
export const G_emptyrooms: F = ({ t, h }) => {
  const R5: [number, number, number, number][] = [[-0.9, -0.5, 0.9, 0.8], [0.15, -0.5, 1.1, 0.8], [1.05, -0.2, 0.6, 1.4], [-0.9, 0.45, 0.9, 1.0], [0.15, 0.45, 1.1, 1.0]];
  const OFF = [3.0, 3.6, 4.2, 99, 4.8];
  return <Hero d={1.15} ly={0.0} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.1, 2.6, 2.5], [0.1, 0, -0.05]), C([-0.2, 2.5, 2.6], [0.1, 0, -0.05]), 8.5)}
    set={(tt: number) => ({ spot: [-0.9, 0, 0.45] as V, spotK: 0.8, floor: "wood" })}
    scene={(tt) => <>
      {R5.map(([x, z, w, d], i) => { const up = phys(tt, 0.5 + i * 0.4, 6, 0.45); if (up <= 0.01) return null; const uk = Math.min(1, up), off = sv(tt, OFF[i], OFF[i] + 0.6);
        const c = new THREE.Color("#ffc58a").lerp(new THREE.Color("#8f9aa6"), off).getStyle();
        return <group key={i} scale={[1, uk, 1]}>
          <Box p={[x, 0.04, z]} s={[w - 0.04, 0.02, d - 0.04]} c={c} e="#ff8a3c" ei={0.45 * (1 - off)} r={0.9} cast={false} />
          {[[0, d / 2], [0, -d / 2]].map(([ox, oz], j) => <Box key={j} p={[x + ox + (j ? 0 : 0.15), 0.16, z + oz]} s={[j ? w : w - 0.3, 0.28, 0.04]} c="#efe6d4" />)}
          {[[w / 2, 0], [-w / 2, 0]].map(([ox, oz], j) => <Box key={"v" + j} p={[x + ox, 0.16, z + oz]} s={[0.04, 0.28, d]} c="#efe6d4" />)}
          <Cyl p={[x + w / 2 - 0.18, 0.1, z - d / 2 + 0.18]} r={0.11} r2={0.08} h={0.12} c="#3a3a3a" m={0.4} /><Glow p={[x + w / 2 - 0.18, 0.25, z - d / 2 + 0.18]} r={0.3} k={1 - off} op={0.35} />
          <Flame p={[x + w / 2 - 0.18, 0.16, z - d / 2 + 0.18]} k={1 - off} r={0.08} h={0.2} t={tt} ph={i} />
          <Smoke p={[x + w / 2 - 0.18, 0.2, z - d / 2 + 0.18]} t={tt} k={off} />
        </group>; })}
      <Box p={[-0.95, 0.1, 0.45]} s={[0.5, 0.06, 0.3]} c="#f3eee4" />
      <Box p={[-1.0, 0.15, 0.45]} s={[0.3, 0.06, 0.32]} c="#6d7f99" />
      <mesh position={[-0.75, 0.15, 0.45]}><sphereGeometry args={[0.07, 20, 14]} /><meshStandardMaterial color="#f1ede6" /></mesh>
    </>} />; };

// 9:36 · cinco frazadas caen de a una sobre ella y no alcanza: una niebla helada sube desde el colchón y atraviesa la pila; ella tirita
export const G_underneath: F = ({ t, h }) => { const u = it(h, 0); const T = useTx();
  const cols = ["#6d7f99", "#b8483a", "#7a8f6a", "#d9b25a", "#5d6f88"];
  return <Hero d={1.15} ly={0.2} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.4, 0.8, 2.4], [0, 0.4, 0]), C([-0.3, 0.75, 2.4], [0, 0.4, 0]), 9)}
    set={(tt: number) => ({ ...night, spot: [0, 0, 0] as V, spotK: cl((tt - u) * 1.5) })}
    scene={(tt) => { const ck = sv(tt, u - 0.4, u + 0.6), sh = 0.03 * ck * Math.sin(tt * 2 * Math.PI * 1.8);
      return <>
        <Box p={[0, 0.12, 0]} s={[1.95, 0.22, 0.95]} c="#f3eee4" r={0.95} rad={0.04} />
        <Box p={[0.5, 0.27, 0]} s={[0.3, 0.08, 0.5]} c="#e9e1cf" r={0.95} rad={0.04} />
        <group position={[-0.25, 0.22, sh]}><Sachi p={LIE} t={tt} s={S} expr={tt > u ? "triste" : "neutral"} /></group>
        {cols.map((c, i) => { const s = phys(tt, 0.7 + i * 0.75, 6, 0.42); if (s <= 0.01) return null; return <Box key={i} p={[-0.42, 0.3 + i * 0.065 + (1 - Math.min(1, s)) * 1.2, sh]} s={[1.15, 0.06, 1.0]} c={c} map={i === 0 ? T.blanket : undefined} r={0.95} rad={0.025} />; })}
        <Glow p={[-0.2, 0.15, 0]} r={0.85} k={ck} c="#7fc4f0" op={0.35} />
        {Array.from({ length: 5 }, (_, i) => <Flow key={i} a={[-0.85 + i * 0.3, -0.02, -0.3 + 0.15 * (i % 3)]} b={[-0.8 + i * 0.3, 0.75, -0.3 + 0.15 * (i % 3)]} t={tt + i * 0.21} k={ck} c="#cfeeff" n={10} r={0.032} speed={0.4} />)}
        {ck > 0.05 && Array.from({ length: 14 }, (_, i) => <mesh key={"x" + i} position={[-0.95 + i * 0.13, 0.28 + 0.25 * ((tt * 0.3 + i * 0.37) % 1), -0.45 + 0.07 * (i % 4)]}><octahedronGeometry args={[0.02 * ck, 0]} /><meshStandardMaterial color="#e8f6ff" emissive="#bfe6ff" emissiveIntensity={0.6} /></mesh>)}
      </>; }} />; };

// 10:25 · el ofuro: tina de madera con el frente transparente; el agua sube hasta los hombros con vapor; el reloj barre 10 minutos y ella pasa de pálida a rosada
export const G_ofuro: F = ({ t, h }) => {
  return <Hero d={1.15} ly={0.3} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.9, 1.1, 2.2], [0.2, 0.5, 0]), C([0.1, 1.05, 2.3], [0.2, 0.5, 0]), 9)}
    set={(tt: number) => ({ spot: [0, 0, 0] as V, spotK: 0.6, warm: 0.6 })}
    scene={(tt) => { const sw = eio(tt, 1.0, 7.5), lv = eio(tt, 0.4, 1.8), warmk = eio(tt, 1.5, 6.5), tb = drop(tt, 0.2, 0.0), dl = drop(tt, 0.8, 0.8);
      const skin = new THREE.Color("#f1ede6").lerp(new THREE.Color("#f6b9a6"), warmk).getStyle();
      return <>
        <Sachi p={PZ.seiza} t={tt} s={S} expr="feliz" color={skin} />
        {tb.on && <group scale={[1, Math.min(1, tb.s), 1]}>
          <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.52, 0.52, 0.7, 48, 1, true, -Math.PI * 0.75, Math.PI * 1.5]} /><meshStandardMaterial color="#b98a56" roughness={0.55} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.52, 0.52, 0.7, 48, 1, true, Math.PI * 0.75, Math.PI * 0.5]} /><meshStandardMaterial color="#d8b07a" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} /></mesh>
          {Array.from({ length: 18 }, (_, i) => { const a = -Math.PI * 0.75 + i * Math.PI * 1.5 / 18 + Math.PI / 2; return <Box key={"d" + i} p={[0.53 * Math.sin(a), 0.36, 0.53 * Math.cos(a)]} s={[0.008, 0.7, 0.01]} c="#8a6238" rot={[0, a, 0]} cast={false} />; })}
          {[0.12, 0.62].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.525, 0.012, 8, 48]} /><meshStandardMaterial color="#6b4a2c" metalness={0.3} /></mesh>)}
          <mesh position={[0, 0.03 + 0.31 * lv, 0]}><cylinderGeometry args={[0.5, 0.5, Math.max(0.02, 0.62 * lv), 48]} /><meshStandardMaterial color="#9ad0e8" transparent opacity={0.45} depthWrite={false} /></mesh>
        </group>}
        <Steam p={[0.15, 0.66, 0.1]} t={tt} k={lv} n={9} />
        <Steam p={[-0.2, 0.66, -0.1]} t={tt + 1.2} k={lv} n={9} /><Steam p={[0.0, 0.7, 0.2]} t={tt + 0.6} k={lv} n={9} /><Glow p={[0, 0.8, 0]} r={0.45} k={lv} c="#ffffff" op={0.18} />
        {dl.on && <Dial p={[1.0, 0.85 + dl.y, -0.4]} ang={sw * Math.PI * 2} sweep={sw} s={0.65} rotY={-0.3} />}
      </>; }} />; };

// 10:58 · baño de pies: sentada con el libro abierto, los pies en la palangana con vapor; el paño los seca, la palangana se va y aparecen las medias tibias
export const G_footbath: F = ({ t, h }) => { const dry = it(h, 0); const K = useKnit();
  const tI = useMemo(() => toeOf(chairSit, "I"), []), tD = useMemo(() => toeOf(chairSit, "D"), []);
  const pz = withHands(chairSit, (q: any) => { q.manoI = { ...q.manoI, p: [0.14, -0.45, 0.62] }; q.manoD = { ...q.manoD, p: [-0.14, -0.45, 0.62] }; });
  const hb = useMemo(() => bodyOf(pz, 0, -0.3), []);
  return <Hero d={1.0} ly={0.15} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.9, 0.75, 1.9], [0, 0.4, -0.1]), C([0.3, 0.7, 2.0], [0, 0.4, -0.1]), 9)}
    set={(tt: number) => ({ spot: [0, 0, 0] as V, spotK: 0.5, warm: 0.5 })}
    scene={(tt) => { const towel = sv(tt, dry - 0.3, dry + 0.5) - sv(tt, dry + 0.9, dry + 1.3), away = sv(tt, dry + 0.5, dry + 1.2), sock = phys(tt, dry + 1.2, 6, 0.45), bk = drop(tt, 0.5, 0.5);
      const fz = (tI[2] + tD[2]) / 2 - 0.3, fx = (tI[0] + tD[0]) / 2;
      return <>
        <Box p={[0, 0.25, -0.3]} s={[0.42, 0.05, 0.42]} c="#8a5a34" />
        <Box p={[0, 0.5, -0.5]} s={[0.42, 0.5, 0.05]} c="#8a5a34" />
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <Box key={i} p={[a * 0.18, 0.12, -0.3 + b * 0.18]} s={[0.04, 0.24, 0.04]} c="#5a3820" />)}
        <Sachi p={pz} t={tt} z={-0.3} s={S} expr="feliz" />
        {bk.on && <group position={[hb.pel[0], hb.pel[1] + 0.12 + bk.y, hb.pel[2] + 0.2]} rotation={[-0.6, 0, 0]}>
          <Box p={[-0.08, 0, 0]} s={[0.16, 0.01, 0.22]} c="#f6f0e2" rot={[0, 0, 0.15]} /><Box p={[0.08, 0, 0]} s={[0.16, 0.01, 0.22]} c="#f6f0e2" rot={[0, 0, -0.15]} />
          <Box p={[0, -0.01, 0]} s={[0.34, 0.012, 0.24]} c="#8a2a22" />
        </group>}
        <group position={[fx + 0.9 * away, 0.04, fz]}>
          <Cyl p={[0, 0.08, 0]} r={0.24} r2={0.2} h={0.16} c="#a57a4e" rough={0.6} />
          <Cyl p={[0, 0.13, 0]} r={0.22} h={0.01} c="#9ad0e8" op={0.85} />
        </group>
        <Steam p={[fx, 0.2, fz]} t={tt} k={1 - away} n={9} />
        {towel > 0.01 && <Box p={[fx + 0.25 * Math.sin(tt * 3), 0.17, fz]} s={[0.3, 0.05, 0.25]} c="#f3eee4" r={1} rad={0.02} />}
        {sock > 0.01 && [tI, tD].map((q, i) => <group key={i} position={[q[0], q[1] + 0.03, q[2] - 0.3]} scale={Math.max(0.1, Math.min(1.1, sock))}><mesh scale={[1, 0.8, 1.5]}><sphereGeometry args={[0.06, 20, 14]} /><meshStandardMaterial color="#d9773a" map={K.red} roughness={1} emissive="#ff8a3c" emissiveIntensity={0.25} /></mesh></group>)}
        <Glow p={[fx, 0.1, fz]} r={0.28} k={cl(sock)} op={0.45} />
      </>; }} />; };

// 11:49 · al lado del futón: el termo rosa entra, sirve un chorro con vapor en la taza y una gota de miel dorada se estira y cae
export const G_thermos: F = ({ t, h }) => { const hon = it(h, 0);
  return <Hero d={0.85} ly={0.12} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.85, 0.95, 2.0], [0.0, 0.3, 0]), C([0.15, 0.9, 2.1], [0.0, 0.3, 0]), 9)}
    set={(tt: number) => ({ ...night, spot: [0.3, 0, 0] as V, spotK: 0.6 })}
    scene={(tt) => { const ent = phys(tt, 0.5, 5, 0.5), ek = Math.min(1, ent), pour = sv(tt, 1.0, 1.6) - sv(tt, hon - 0.8, hon - 0.2), lv = eio(tt, 1.3, hon - 0.3), dr = tt - hon;
      return <>
        <Futon p={[-0.9, 0.04, -0.1]} quilt="#6d7f99" ql={1.2} />
        <group position={[-0.55, 0.1, -0.1]}><Sachi p={PZ.seiza} t={tt} s={S} rotY={60} expr="feliz" /></group>
        <Box p={[0.3, 0.06, 0]} s={[0.6, 0.04, 0.4]} c="#7a4e2c" r={0.5} />
        {ent > 0.01 && <group position={[lerp(1.3, 0.38, ek) - 0.06 * pour, 0.08 + 0.12 * pour, 0]} rotation={[0, 0, 1.25 * pour]}>
          <Cyl p={[0, 0.2, 0]} r={0.07} h={0.4} c="#e88aa6" rough={0.35} />
          <Cyl p={[0, 0.43, 0]} r={0.06} h={0.06} c="#c9ccd2" m={0.8} />
        </group>}
        <Cyl p={[0.12, 0.14, 0.05]} r={0.08} r2={0.06} h={0.14} c="#f3eee4" rough={0.3} />
        <Cyl p={[0.12, 0.08 + 0.12 * lv, 0.05]} r={0.07} h={0.01} c="#f4e6c4" op={0.9} />
        {pour > 0.3 && <Cyl p={[0.13, 0.32, 0.05]} r={0.018} h={0.3} c="#dff1fa" op={0.8} />}
        <Steam p={[0.12, 0.22, 0.05]} t={tt} k={lv} n={7} />
        <group position={[0.45, 0.08, 0.17]}><Cyl p={[0, 0.07, 0]} r={0.06} h={0.14} c="#d9a23a" op={0.85} /><Cyl p={[0, 0.16, 0]} r={0.045} h={0.04} c="#7a4e2c" /></group>
        {dr > -0.6 && dr < 1.4 && <group position={[0.12, 0.5 - 0.3 * cl(dr * dr * 2.5) * (dr > 0 ? 1 : 0), 0.05]}>
          <Cyl p={[0, 0.08, 0]} r={0.008} h={0.16} c="#7a4e2c" />
          <mesh position={[0, -0.02 - 0.04 * cl(dr + 0.6), 0]} scale={[1, 1 + 0.8 * cl(dr + 0.6), 1]}><sphereGeometry args={[0.024, 14, 10]} /><meshStandardMaterial color="#e2a63a" emissive="#d9a23a" emissiveIntensity={0.4} roughness={0.15} /></mesh>
        </group>}
      </>; }} />; };

// 12:44 · la misma estufita en dos cuartos: el chico se llena de calor naranja en segundos; el grande apenas se entibia en una esquina
export const G_smallroom: F = ({ t, h }) => {
  const RM: [number, number, number][] = [[-0.75, 1.3, 1.1], [0.8, 0.8, 0.8]];
  return <Hero d={0.95} ly={0.1} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.2, 1.7, 2.8], [0, 0.25, -0.2]), C([-0.3, 1.65, 2.9], [0, 0.25, -0.2]), 9)}
    set={(tt: number) => ({ spot: [0.8, 0, -0.2] as V, spotK: cl((tt - 3) * 0.8) })}
    scene={(tt) => <>
      {RM.map(([x, w, d], i) => { const up = drop(tt, 0.3 + i * 0.4, 0.0), k = i ? eio(tt, 1.2, 3.4) : 0.22 * eio(tt, 1.2, 6);
        return up.on ? <group key={i} position={[x, 0, -0.2]} scale={[1, Math.min(1, up.s), 1]}>
          <Box p={[0, 0.04, 0]} s={[w, 0.02, d]} c="#efe6d4" cast={false} />
          <Box p={[0, 0.3, -d / 2]} s={[w, 0.6, 0.04]} c="#e6dccb" />
          {[-1, 1].map((s) => <Box key={s} p={[s * w / 2, 0.3, 0]} s={[0.04, 0.6, d]} c="#e6dccb" />)}
          <Box p={[i ? 0 : -w / 2 + 0.25, 0.03 + 0.28 * (i ? k : 1), i ? 0 : -d / 2 + 0.25]} s={[i ? w - 0.06 : 0.42, Math.max(0.02, 0.56 * (i ? k : 0.55 * k / 0.22)), i ? d - 0.06 : 0.42]} c="#ff9a3c" op={0.35} e="#ff7a2c" ei={0.5} cast={false} />
          <group position={[i ? w / 2 - 0.15 : -w / 2 + 0.18, 0.05, -d / 2 + 0.15]}><Cyl p={[0, 0.07, 0]} r={0.07} h={0.14} c="#3d4a5c" /><Flame p={[0, 0.15, 0]} k={1} r={0.04} h={0.1} t={tt} ph={i} /></group>
        </group> : null; })}
      <Box p={[0.85, 0.08, -0.2]} s={[0.4, 0.05, 0.55]} c="#6d7f99" />
      {[-0.13, 0.0, 0.13].map((z, i) => <mesh key={i} position={[0.7, 0.12, -0.2 + z * 1.6]}><sphereGeometry args={[0.055, 16, 12]} /><meshStandardMaterial color="#f1ede6" /></mesh>)}
    </>} />; };

// 13:20 · el medidor de gas en macro: los rodillos casi no se mueven; ella se asoma de costado, pegada, y se rasca la cabeza
export const G_meter: F = ({ t, h }) => {
  return <Hero d={0.85} ly={0.3} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.6, 1.0, 1.8], [0.3, 0.85, -0.7]), C([0.1, 1.0, 1.9], [0.3, 0.85, -0.7]), 8)}
    set={(tt: number) => ({ spot: [0.4, 0, -0.8] as V, spotK: 0.6 })}
    scene={(tt) => { const n = 4810 + 40 * (1 - Math.exp(-tt * 0.9)) + 0.3 * tt, mt = drop(tt, 0.55, 0.6), peek = sv(tt, 1.2, 2.2);
      return <>
        <Wallp p={[0, 0, -1.05]} w={3.4} h={2.0} />
        {mt.on && <group position={[0, mt.y, 0]}>
          <Box p={[0.45, 0.95, -0.92]} s={[0.8, 0.62, 0.2]} c="#a9b1b8" m={0.5} r={0.35} />
          <Odo p={[0.45, 1.02, -0.8]} n={Math.floor(n)} digits={4} s={0.85} glow={0.2} />
          <group position={[0.45, 0.78, -0.81]} rotation={[0, 0, -tt * 0.4]}><Box p={[0, 0.04, 0]} s={[0.012, 0.08, 0.006]} c="#c0392b" /></group>
          <mesh position={[0.45, 0.78, -0.815]}><circleGeometry args={[0.07, 32]} /><meshStandardMaterial color="#f6f1e4" /></mesh>
          <Cyl p={[0.3, 0.45, -0.95]} r={0.03} h={0.5} c="#d9b25a" m={0.6} />
          <Cyl p={[0.6, 0.45, -0.95]} r={0.03} h={0.5} c="#d9b25a" m={0.6} />
        </group>}
        <Sachi p={bend(PZ.stand, 14 * peek, (q) => { q.manoD = { ...q.manoD, p: [-0.25, 1.15 + 0.05 * Math.sin(tt * 2 * Math.PI * 1.5) * peek, 0.15] }; })} t={tt} x={lerp(-1.1, -0.15, peek)} z={-0.4} rotY={55} s={S} expr="sorprendido" />
      </>; }} />; };

// 14:06 · la ronda de las llamas: la hornalla (corona azul), la estufa (brasa) y la vela; al pasar ella, cada llama se achica y deja un hilo de humo
export const G_flames: F = ({ t, h }) => {
  const X = [-0.9, 0, 0.9], OFF = [1.4, 3.0, 4.6];
  return <Hero d={1.15} ly={0.3} t={t} h={h} mode="split" cam={(tt) => { const wx = lerp(-1.3, 0.9, eio(tt, 0.6, 5.6)); return orbita(tt, C([wx * 0.7 + 0.3, 1.0, 2.4], [wx * 0.7, 0.55, -0.4]), C([wx * 0.7 - 0.3, 0.95, 2.4], [wx * 0.7, 0.55, -0.4]), 8.5); }}
    set={(tt: number) => ({ ...night, spot: [0, 0, -0.3] as V, spotK: 0.4 })}
    scene={(tt) => { const wx = lerp(-1.3, 0.9, eio(tt, 0.6, 5.6));
      return <>
        {X.map((x, i) => { const off = sv(tt, OFF[i], OFF[i] + 0.6), ap = drop(tt, 0.2 + i * 0.2, 0.6);
          return ap.on ? <group key={i} position={[x * 1.25, 0.05 + ap.y, -0.6]} scale={1.5}>
            {i === 0 && <><Box p={[0, 0.2, 0]} s={[0.5, 0.4, 0.4]} c="#d8d2c6" m={0.3} /><Cyl p={[0, 0.41, 0]} r={0.11} h={0.02} c="#333" />{Array.from({ length: 10 }, (_, j) => { const a = j / 10 * Math.PI * 2; return <Flame key={j} p={[Math.cos(a) * 0.09, 0.42, Math.sin(a) * 0.09]} k={1 - off} r={0.026} h={0.11} c="#5fb4ff" t={tt} ph={j} />; })}</>}
            {i === 1 && <><Cyl p={[0, 0.22, 0]} r={0.17} h={0.44} c="#3d4a5c" m={0.4} />{[0, 1, 2, 3].map((j) => <mesh key={j} position={[0, 0.12 + j * 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.175, 0.008, 6, 40]} /><meshStandardMaterial color="#ff8a3c" emissive="#ff6a1c" emissiveIntensity={1.2 * (1 - off)} toneMapped={false} /></mesh>)}<Flame p={[0, 0.45, 0]} k={1 - off} r={0.06} h={0.15} t={tt} /></>}
            {i === 2 && <><Box p={[0, 0.12, 0]} s={[0.26, 0.24, 0.26]} c="#7a4e2c" /><Cyl p={[0, 0.33, 0]} r={0.035} h={0.18} c="#f3eee4" /><Flame p={[0, 0.42, 0]} k={1 - off} r={0.025} h={0.09} t={tt} /></>}
            <Smoke p={[0, 0.5, 0]} t={tt} k={off} />
            <Glow p={[0, 0.45, 0]} r={0.22} k={1 - off} op={0.2} />
            <Ring p={[0, 0.02, 0.32]} r={0.18} k={off} col={GRN} />
          </group> : null; })}
        <Sachi p={PZ.stand} t={tt} x={wx * 1.25} z={0.2} rotY={90} s={S} expr="decidido" />
      </>; }} />; };

// 15:12 · el trato con el marido: el termostato de pared con perilla baja 3 grados con un clic, después 2 más; los dos se dan la mano
export const G_thermostat: F = ({ t, h }) => { const two = it(h, 0);
  const T = useMemo(() => ({ a: degTx("68°"), b: degTx("65°"), c: degTx("63°") }), []);
  return <Hero d={1.05} ly={0.25} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.4, 1.15, 2.6], [0, 0.8, -0.5]), C([-0.4, 1.15, 2.6], [0, 0.8, -0.5]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.6] as V, spotK: 0.5 })}
    scene={(tt) => { const st = tt < 1.6 ? 0 : tt < two ? 1 : 2, kn = 0.6 * sv(tt, 1.2, 1.6) + 0.4 * sv(tt, two - 0.4, two), shake = sv(tt, two + 0.8, two + 1.5), wob = 0.04 * Math.sin(tt * 2 * Math.PI * 1.6) * (shake > 0.9 ? 1 : 0), th = drop(tt, 0.55, 0.6);
      const mh: V = [0, 0.95 + wob, 0];
      return <>
        <Wallp p={[0, 0, -1.05]} w={3.4} h={2.0} />
        {th.on && <group position={[-0.95, 1.15 + th.y, -0.98]} scale={1.5}>
          <Box p={[0, 0, -0.02]} s={[0.55, 0.75, 0.06]} c="#efeae0" r={0.4} rad={0.04} />
          <mesh position={[0, 0.12, 0.02]}><circleGeometry args={[0.2, 48]} /><meshStandardMaterial map={[T.a, T.b, T.c][st]} emissive="#ffffff" emissiveMap={[T.a, T.b, T.c][st]} emissiveIntensity={0.35} /></mesh>
          <group position={[0, -0.22, 0.04]} rotation={[0, 0, kn * 1.2]}><Cyl p={[0, 0, 0]} r={0.09} h={0.05} c="#c9ccd2" m={0.7} rot={[Math.PI / 2, 0, 0]} /><Box p={[0, 0.055, 0.03]} s={[0.015, 0.05, 0.01]} c="#c0392b" /></group>
        </group>}
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [lerp(-0.3, -0.05, shake), lerp(-0.9, 0.0, shake) + wob, lerp(0.3, 0.55, shake)] }; })} t={tt} x={0.0} z={-0.3} rotY={70} s={S} expr="feliz" />
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [lerp(0.3, 0.05, shake), lerp(-0.9, 0.0, shake) + wob, lerp(0.3, 0.55, shake)] }; })} t={tt} x={0.87} z={-0.3} rotY={-70} s={S * 1.1} color="#dfe6ee" expr={st ? "sorprendido" : "neutral"} />
        <Ring p={[0.43, 0.06, -0.3]} r={0.3} k={shake} />
        {void mh}
      </>; }} />; };

// 15:57 · un arco de cielo: el sol cruza y la luz se pone cálida (68); entra la luna y todo se enfría (62); abajo, de la pila de monedas se cae una
export const G_daynight: F = ({ t, h }) => { const nt = it(h, 0), s10 = it(h, 1);
  const T = useMemo(() => ({ d: degTx("68°", "#d9773a", "#fff"), n: degTx("62°", "#3b4f7a", "#fff") }), []);
  return <Hero d={1.1} ly={0.3} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.3, 1.2, 2.9], [0, 0.7, -0.4]), C([-0.3, 1.15, 2.9], [0, 0.7, -0.4]), 9.5)}
    set={(tt: number) => ({ spot: [0, 0, -0.1] as V, spotK: 0.6, warm: lerp(0.15, 0.85, sv(tt, nt - 0.3, nt + 0.6)) })}
    scene={(tt) => { const a1 = eio(tt, 0.2, nt), a2 = eio(tt, nt - 0.2, s10), fall = phys(tt, nt + 0.5, 4, 0.5), fk = Math.min(1, fall), st = drop(tt, 0.5, 0.6);
      const arc = (u: number): V => [lerp(-1.4, 1.4, u), 0.6 + 1.1 * Math.sin(Math.PI * u), -1.0];
      const sp = arc(0.15 + 0.7 * a1), mp = arc(0.05 + 0.5 * a2);
      return <>
        <mesh position={[0, 1.1, -1.32]}><planeGeometry args={[4.2, 2.4]} /><meshBasicMaterial color={new THREE.Color("#9cc3e6").lerp(new THREE.Color("#f0a060"), sv(tt, 0.5, nt - 0.3)).lerp(new THREE.Color("#1d2a4a"), sv(tt, nt - 0.3, nt + 0.6)).getStyle()} toneMapped={false} /></mesh>
        <mesh position={[0, 0.6, -1.3]}><torusGeometry args={[1.4, 0.008, 6, 64, Math.PI]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.35} toneMapped={false} /></mesh>
        {tt < nt + 0.6 && <group position={sp}><mesh><sphereGeometry args={[0.32, 32, 20]} /><meshBasicMaterial color="#ffc04a" toneMapped={false} transparent opacity={1 - sv(tt, nt - 0.2, nt + 0.6)} /></mesh><Plate p={[0, -0.38, 0.1]} s={0.34} map={T.d} rot={[0, 0, 0]} op={1 - sv(tt, nt - 0.2, nt + 0.6)} glow={0.3} /></group>}
        {tt > nt - 0.4 && <group position={mp}><mesh><sphereGeometry args={[0.2, 32, 20]} /><meshStandardMaterial color="#e8ecf4" emissive="#cfd8ff" emissiveIntensity={0.5} /></mesh><Plate p={[0, -0.34, 0.1]} s={0.32} map={T.n} rot={[0, 0, 0]} glow={0.3} /></group>}
        {st.on && Array.from({ length: 10 }, (_, i) => { const top = i === 9; return <Cyl key={i} p={[0.75 + (top ? 0.4 * fk : 0), 0.1 + st.y + i * 0.06 + (top ? 0.2 * Math.sin(Math.PI * fk) - (i * 0.06 + 0.04) * fk : 0), -0.45 + (top ? 0.25 * fk : 0)]} r={0.24} h={0.06} c="#d9b25a" m={0.8} rough={0.25} e={top ? "#ffb347" : undefined} ei={top ? 0.5 : 0} rot={top ? [0, 0, 1.2 * fk] : [0, 0, 0]} />; })}
      </>; }} />; };

// 16:51 · capa 1, en corte: el frío sube del piso en flechas celestes; cae la frazada de lana gruesa sobre el colchón y las flechas se frenan contra ella y se deshacen
export const G_woolunder: F = ({ t, h }) => { const K = useKnit();
  return <Hero d={0.95} ly={0.05} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.4, 0.75, 2.2], [0, 0.3, 0]), C([-0.4, 0.75, 2.2], [0, 0.3, 0]), 9)}
    set={(tt: number) => ({ ...night, spot: [0, 0, 0] as V, spotK: 0.5 })}
    scene={(tt) => { const wl = drop(tt, 1.6, 0.9), block = sv(tt, 1.8, 2.4), mt = drop(tt, 0.55, 0.6);
      return <>
        {mt.on && <Box p={[0, 0.14 + mt.y, 0]} s={[1.5, 0.2, 0.6]} c="#f3eee4" r={0.95} rad={0.03} />}
        {wl.on && <group position={[0, wl.y, 0]}><Box p={[0, 0.33, 0]} s={[1.52, 0.16, 0.62]} c="#efe3c8" map={K.wool} r={1} rad={0.06} />
          {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[-0.7 + i * 0.108, 0.33, 0.31]}><sphereGeometry args={[0.07, 14, 10]} /><meshStandardMaterial color="#f2e8d2" map={K.wool} roughness={1} /></mesh>)}</group>}
        {[-0.5, -0.17, 0.17, 0.5].map((x, i) => { const u = (tt * 0.5 + i * 0.27) % 1, top = lerp(1.0, 0.18, block), y = 0.05 + top * u, k = cl((tt - 0.6) * 2);
          return k < 0.01 ? null : <group key={i}>
            <mesh position={[x, y + 0.05, 0.36]}><coneGeometry args={[0.06, 0.16, 18]} /><meshBasicMaterial color="#5fb4ff" transparent opacity={0.9 * k * Math.sin(Math.PI * u)} toneMapped={false} /></mesh>
            {block > 0.5 && u > 0.85 && <Glow p={[x, 0.26, 0.36]} r={0.07} k={1} c="#cfeeff" op={0.6} />}
          </group>; })}
        <Glow p={[0, 0.35, 0.2]} r={0.5} k={block} c="#ffcf8a" op={0.15} />
      </>; }} />; };

// 17:24 · capa 3 = la tapa de la olla: la olla grande humea suelto; la colcha pesada cae encima como tapa, el vapor queda atrapado y la olla brilla tibia
export const G_potlid: F = ({ t, h }) => { const lid = it(h, 0);
  return <Hero d={1.0} ly={0.15} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.6, 1.0, 1.9], [0, 0.35, 0]), C([-0.5, 0.95, 1.95], [0, 0.35, 0]), 9)}
    set={(tt: number) => ({ ...night, spot: [0, 0, 0] as V, spotK: 0.6 })}
    scene={(tt) => { const pot = drop(tt, 0.55, 0.8), q = phys(tt, lid, 4.5, 0.5), qk = Math.min(1, q), seal = sv(tt, lid + 0.3, lid + 1.0);
      return pot.on ? <group position={[0, pot.y, 0]}>
        <Cyl p={[0, 0.25, 0]} r={0.42} h={0.5} c="#3a3a3a" m={0.6} rough={0.35} />
        {[-1, 1].map((k) => <Box key={k} p={[k * 0.48, 0.4, 0]} s={[0.12, 0.05, 0.1]} c="#222" />)}
        <Cyl p={[0, 0.49, 0]} r={0.4} h={0.01} c="#bfe4f2" op={0.8} />
        {[-0.15, 0.1, 0.0].map((x, i) => <Steam key={i} p={[x, 0.52, i * 0.1 - 0.1]} t={tt + i * 0.6} k={1 - seal} n={10} />)}
        {q > 0.01 && <group position={[0, 0.56 + (1 - qk) * 1.3, 0]}>
          <Box p={[0, 0, 0]} s={[1.05, 0.1, 1.05]} c="#35609e" r={0.95} rad={0.05} />
          {[-1, 1].map((k) => <Box key={k} p={[k * 0.52, -0.16, 0]} s={[0.04, 0.32, 1.0]} c="#35609e" r={0.95} rad={0.02} />)}
        </group>}
        <Glow p={[0, 0.62, 0]} r={0.4} k={seal} c="#ffe2b0" op={0.08} />
        {seal > 0.05 && Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.3 + i * 0.12, 0.52 + 0.015 * Math.sin(tt * 3 + i), 0]}><sphereGeometry args={[0.05, 12, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.4 * seal} depthWrite={false} /></mesh>)}
        <Ring p={[0, 0.02, 0]} r={0.55} k={seal} />
      </group> : null; }} />; };

// 18:41 · a la mañana: bajo la colcha se estira largo como un gato, despacio; un haz cálido cae sobre el cárdigan doblado junto a la almohada
export const G_catstretch: F = ({ t, h }) => { const cd = it(h, 0); const K = useKnit();
  return <Hero d={1.1} ly={0.15} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.5, 1.0, 2.2], [0.2, 0.25, 0]), C([-0.3, 0.95, 2.3], [0.2, 0.25, 0]), 9)}
    set={(tt: number) => ({ spot: [0.95, 0, -0.45] as V, spotK: cl((tt - cd) * 1.5), warm: 0.2 })}
    scene={(tt) => { const s = sv(tt, 0.6, 2.0) - sv(tt, cd - 0.6, cd + 0.2), up = sv(tt, cd + 0.4, cd + 1.6), qu = 0.08 * s;
      return <>
        <Futon p={[0, 0.04, 0]} quilt="#6d7f99" ql={1.3} qk={0} />
        <group position={[0.05 - 0.12 * s, 0.1, 0]} scale={[1 + 0.14 * s * (1 - up), 1, 1]}><Sachi p={up > 0.01 ? mezclar(LIE, PZ.seiza, up) : mezclar(LIE, PZ.four, 0.55 * s)} t={tt} s={S} expr={s > 0.5 ? "sorprendido" : "feliz"} /></group>
        <Box p={[-0.325 - 0.08 * s - 0.55 * up, 0.25 + qu - 0.08 * up, 0]} s={[1.3 + 0.1 * s, 0.1, 1.0]} c="#6d7f99" r={0.95} rad={0.05} />
        <group position={[0.95, 0.14, -0.45]}><Box p={[0, 0.02, 0]} s={[0.55, 0.13, 0.42]} c="#d9a23a" map={K.crm} r={1} rad={0.04} e="#ffb347" ei={0.6 * cl((tt - cd) * 2)} /><Box p={[0, 0.05, 0.08]} s={[0.36, 0.01, 0.02]} c="#a87a2a" /></group>
        {tt > cd - 0.2 && <mesh position={[0.95, 0.9, -0.45]}><cylinderGeometry args={[0.06, 0.3, 1.6, 32, 1, true]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.18 * cl((tt - cd) * 2)} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} /></mesh>}
        <Ring p={[0.95, 0.12, -0.45]} r={0.3} k={cl((tt - cd) * 2)} />
      </>; }} />; };

// 19:19 · el lado del sol: la cortina se corre y entra un haz dorado con polvo hasta el tatami; del lado de la sombra todo queda cerrado, azul y oscuro
export const G_sunnyside: F = ({ t, h }) => { const sh = it(h, 0);
  return <Hero d={1.15} ly={0.2} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.2, 1.25, 2.6], [0, 0.8, -0.9]), C([-0.4, 1.2, 2.6], [0, 0.8, -0.9]), 9)}
    set={(tt: number) => ({ spot: [-0.75, 0, -0.2] as V, spotK: sv(tt, 0.9, 2.0), warm: 0.2 })}
    scene={(tt) => { const op = sv(tt, 0.8, 2.0), sd = cl((tt - sh) * 2);
      return <>
        <Wallp p={[-0.75, 0, -1.3]} w={1.8} h={2.2} />
        <Wallp p={[0.95, 0, -1.3]} w={1.6} h={2.2} c="#b7bcc6" />
        <Win p={[-0.75, 1.15, -1.25]} w={0.95} h={0.9} sky="#ffe2a0" />
        <mesh position={[-0.75, 1.25, -1.238]}><circleGeometry args={[0.16, 32]} /><meshBasicMaterial color="#ffd060" toneMapped={false} /></mesh>
        <Win p={[0.95, 1.15, -1.25]} w={0.95} h={0.9} sky="#6f84a3" />
        <Curtain p={[-1.0, 0.68, -1.15]} w={0.5} h={1.0} c="#8a3b2e" k={1 - op} side={-1} />
        <Curtain p={[-0.5, 0.68, -1.15]} w={0.5} h={1.0} c="#8a3b2e" k={1 - op} side={1} />
        <Curtain p={[0.7, 0.68, -1.15]} w={0.5} h={1.0} c="#3f4f6a" k={1} side={-1} />
        <Curtain p={[1.2, 0.68, -1.15]} w={0.5} h={1.0} c="#3f4f6a" k={1} side={1} />
        {op > 0.05 && <mesh position={[-0.6, 0.6, -0.55]} rotation={[-0.85, 0, 0]}><planeGeometry args={[0.95, 1.7]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.45 * op} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} /></mesh>}
        {op > 0.05 && Array.from({ length: 14 }, (_, i) => { const u = (tt * 0.08 + i / 14) % 1; return <mesh key={i} position={[-0.95 + 0.3 * Math.sin(i * 2.1) + 0.2 * u, 1.1 - 1.0 * u, -1.0 + 0.95 * u]}><sphereGeometry args={[0.013, 6, 6]} /><meshBasicMaterial color="#fff2c4" transparent opacity={0.8 * op * Math.sin(Math.PI * u)} toneMapped={false} /></mesh>; })}
        <mesh position={[-0.55, 0.053, 0.05]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.0, 1.0]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.6 * op} toneMapped={false} depthWrite={false} /></mesh>
        <Glow p={[0.95, 0.6, -0.9]} r={0.5} k={sd} c="#5f7ab0" op={0.15} />
        <Sachi p={PZ.stand} t={tt} x={1.1} z={0.35} rotY={-50} s={S} expr="feliz" />
      </>; }} />; };

// 20:09 · la tarde en un sendero de cinco piedras que va del atardecer a la noche: ella pisa cada piedra y se enciende su número y su objeto (cortinas, sopa, termostato, yutampo, la ronda)
export const G_evening: F = ({ t, h }) => {
  const L = useMemo(() => ["4:30", "6", "8", "9", "10"].map((s) => lab(s, "", "#fff", 220, 160, 110)), []), K = useKnit();
  const Lb = useMemo(() => degTx("63°"), []);
  const OB: React.ReactNode[] = [
    <group><Box p={[-0.1, 0.3, 0]} s={[0.18, 0.55, 0.05]} c="#8a3b2e" /><Box p={[0.1, 0.3, 0]} s={[0.18, 0.55, 0.05]} c="#8a3b2e" /></group>,
    <group><Cyl p={[0, 0.08, 0]} r={0.16} r2={0.1} h={0.14} c="#6b2a20" rough={0.35} /><Steam p={[0, 0.15, 0]} t={0} k={1} n={5} /></group>,
    <group><Box p={[0, 0.3, 0]} s={[0.3, 0.42, 0.05]} c="#efeae0" /><mesh position={[0, 0.34, 0.03]}><circleGeometry args={[0.11, 32]} /><meshStandardMaterial map={Lb} /></mesh></group>,
    <Yutampo p={[0, 0.02, 0]} s={1.2} cover={1} knit={K.red} />,
    <group><Cyl p={[0, 0.03, 0]} r={0.06} h={0.05} c="#f3eee4" /><mesh position={[0, 0.14, 0]}><sphereGeometry args={[0.07, 16, 12]} /><meshStandardMaterial color="#ffd27a" emissive="#ffb347" emissiveIntensity={0.6} /></mesh></group>,
  ];
  const P5: V[] = [[-1.6, 0, 0.1], [-0.85, 0, -0.35], [0, 0, -0.1], [0.8, 0, -0.45], [1.55, 0, -0.1]];
  return <Hero d={1.2} ly={0.25} t={t} h={h} mode="wipe" cam={(tt) => { const u = sv(tt, 0.6, 8.0), cx = lerp(-1.1, 1.1, u); return orbita(tt, C([cx + 0.3, 1.45, 2.7], [cx, 0.45, -0.2]), C([cx - 0.3, 1.4, 2.8], [cx, 0.45, -0.2]), 9.5); }}
    set={(tt: number) => ({ spot: [0, 0, -0.2] as V, spotK: 0.4, warm: 0.85 - 0.7 * sv(tt, 0.5, 8.5), bg: new THREE.Color("#e9b98a").lerp(new THREE.Color("#34405e"), sv(tt, 0.5, 8.5)).getStyle() })}
    scene={(tt) => { const step = Math.min(4, Math.max(0, (tt - 0.8) / 1.7)), i0 = Math.floor(step), fr = step - i0, a = P5[i0], b = P5[Math.min(4, i0 + 1)], hop = Math.sin(Math.PI * cl((fr - 0.55) / 0.45)) * 0.15;
      const x = lerp(a[0], b[0], cl((fr - 0.55) / 0.45)), z = lerp(a[2], b[2], cl((fr - 0.55) / 0.45));
      return <>
        {P5.map((p, i) => { const s = phys(tt, 0.3 + i * 0.2, 6, 0.42); if (s <= 0.01) return null; const lit = sv(tt, 0.8 + i * 1.7, 1.2 + i * 1.7);
          return <group key={i} position={[p[0], (1 - Math.min(1, s)) * 0.6, p[2]]}>
            <mesh position={[0, 0.04, 0]} scale={[1, 0.25, 0.8]}><sphereGeometry args={[0.32, 24, 12]} /><meshStandardMaterial color="#b9b0a2" roughness={0.85} emissive="#ffb347" emissiveIntensity={0.35 * lit} /></mesh>
            <group position={[0.05, 0.08, -0.32]} scale={1.4 + 0.4 * lit}>{OB[i]}</group>
            <Sign p={[-0.05, 1.05, -0.35]} w={0.62} h={0.45} map={L[i]} glow={0.3 + 0.8 * lit} op={0.6 + 0.4 * lit} />
            <Ring p={[0, 0.1, 0]} r={0.34} k={lit} />
          </group>; })}
        <Sachi p={PZ.stand} t={tt} x={x} z={z + 0.05} rotY={90} s={S} expr="feliz" />
        {void hop}
      </>; }} />; };

// 22:15 · el invierno es un invitado: la puerta gira en su bisagra, entra la nieve en tres capas y una niebla fría por el piso; ella hace una reverencia; la taza humea en primer plano
export const G_guest: F = ({ t, h }) => {
  return <Hero d={1.1} ly={0.25} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.8, 1.05, 2.4], [0, 0.6, -0.6]), C([0.0, 1.0, 2.5], [0, 0.6, -0.6]), 8)}
    set={(tt: number) => ({ spot: [0.1, 0, -0.4] as V, spotK: 0.5, warm: 0.6 })}
    scene={(tt) => { const op = sv(tt, 1.0, 2.6), bow = sv(tt, 2.8, 3.8) - sv(tt, 5.4, 6.4);
      return <>
        <Wallp p={[0, 0, -1.05]} w={3.6} h={2.1} />
        <mesh position={[0.45, 0.95, -1.005]}><planeGeometry args={[0.85, 1.75]} /><meshBasicMaterial color="#9fbad6" toneMapped={false} /></mesh>
        <mesh position={[0.45, 0.25, -1.003]}><planeGeometry args={[0.85, 0.35]} /><meshBasicMaterial color="#f4f8fc" toneMapped={false} /></mesh>
        <group position={[0.6, 0.42, -1.002]}><mesh><coneGeometry args={[0.2, 0.55, 16]} /><meshBasicMaterial color="#5f7d6e" toneMapped={false} /></mesh></group>
        <group position={[0.03, 0, -0.975]} rotation={[0, -1.7 * op, 0]}><Box p={[0.42, 0.95, 0]} s={[0.84, 1.75, 0.05]} c="#8a5a34" r={0.6} /><Cyl p={[0.75, 0.95, 0.04]} r={0.025} h={0.06} c="#d9b25a" m={0.8} rot={[Math.PI / 2, 0, 0]} /></group>
        {op > 0.05 && [0.012, 0.018, 0.026].map((r, L) => Array.from({ length: 14 }, (_, i) => { const u = (tt * (0.08 + 0.03 * L) + i / 14 + L * 0.3) % 1; return <mesh key={L + "_" + i} position={[0.45 + (0.45 + 0.25 * L) * Math.sin(i * 1.7 + L) * u, 1.7 - 1.6 * ((u * 1.2 + i * 0.07) % 1), -1.0 + (1.2 + 0.4 * L) * u]}><sphereGeometry args={[r, 8, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.9 * op * Math.sin(Math.PI * u)} toneMapped={false} /></mesh>; }))}
        {op > 0.05 && <mesh position={[0.3, 0.06, -0.45]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.4 + 0.6 * op, 1]}><circleGeometry args={[0.95, 40]} /><meshBasicMaterial color="#dfeeff" transparent opacity={0.5 * op} toneMapped={false} depthWrite={false} /></mesh>}
        <Sachi p={bend(PZ.stand, 42 * bow)} t={tt} x={-0.55} z={-0.25} rotY={60} s={S} expr="feliz" />
        <Box p={[1.0, 0.08, 0.05]} s={[0.55, 0.06, 0.4]} c="#7a4e2c" />
        <Cyl p={[1.0, 0.22, 0.05]} r={0.12} r2={0.095} h={0.22} c="#f3eee4" /><Cyl p={[1.0, 0.32, 0.05]} r={0.105} h={0.01} c="#9bb06a" />
        <Steam p={[1.0, 0.35, 0.05]} t={tt} k={1} n={9} />
      </>; }} />; };

// CUADRO 0 · la miniatura rehecha en código, sin texto ni flecha: Sachiko en el kotatsu abraza la yutampo con su funda tejida; a la derecha el termostato en OFF; mandarinas y té
export const G_cuadro0: F = ({ t, h }) => { const K = useKnit(); const T = useMemo(() => ({ off: degTx("OFF", "#20262e", "#e9edf2") }), []);
  return <Hero d={1.0} ly={0.3} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 1.2, 2.7], [0.15, 0.5, -0.2]), C([0.15, 1.2, 2.7], [0.15, 0.5, -0.2]), 12)}
    set={(tt: number) => ({ spot: [0, 0, -0.3] as V, spotK: 0.7, warm: 0.6 })}
    scene={(tt) => <>
      <Wallp p={[0, 0, -1.05]} w={3.6} h={2.2} />
      <group position={[1.05, 1.0, -0.98]} scale={1.3}>
        <Box p={[0, 0, -0.02]} s={[0.42, 0.6, 0.06]} c="#efeae0" r={0.4} rad={0.04} />
        <mesh position={[0, 0.08, 0.02]}><planeGeometry args={[0.3, 0.2]} /><meshStandardMaterial map={T.off} emissive="#ffffff" emissiveMap={T.off} emissiveIntensity={0.3} /></mesh>
        <Box p={[0, -0.16, 0.02]} s={[0.12, 0.05, 0.03]} c="#d9dde2" />
      </group>
      <Sachi p={withHands(PZ.seiza, (q: any) => { q.manoD = { ...q.manoD, p: [-0.12, -0.25, 0.32] }; q.manoI = { ...q.manoI, p: [0.12, -0.25, 0.32] }; })} t={tt} x={-0.1} z={-0.45} rotY={0} s={S} expr="feliz" />
      <Yutampo p={[-0.1, 0.5, -0.12]} s={1.25} cover={1} glow={0.35} knit={K.red} />
      <Box p={[0.05, 0.3, 0.25]} s={[1.5, 0.08, 0.8]} c="#b8483a" map={K.red} r={1} rad={0.04} />
      <Box p={[0.05, 0.16, 0.25]} s={[1.56, 0.26, 0.86]} c="#b8483a" map={K.red} r={1} rad={0.06} />
      <Box p={[0.05, 0.37, 0.25]} s={[1.3, 0.04, 0.7]} c="#7a4e2c" r={0.5} />
      <Cyl p={[-0.45, 0.43, 0.4]} r={0.16} r2={0.11} h={0.08} c="#6b4a2e" />
      {[[-0.5, 0.48, 0.38], [-0.4, 0.48, 0.42], [-0.45, 0.53, 0.36], [-0.38, 0.47, 0.33]].map((q, i) => <mesh key={i} position={q as V}><sphereGeometry args={[0.055, 18, 14]} /><meshStandardMaterial color="#f08a24" roughness={0.55} /></mesh>)}
      <Cyl p={[0.42, 0.44, 0.42]} r={0.07} r2={0.055} h={0.1} c="#f3eee4" /><Cyl p={[0.42, 0.49, 0.42]} r={0.062} h={0.005} c="#9bb06a" />
      <Steam p={[0.42, 0.5, 0.42]} t={tt} k={0.35} n={5} />
    </>} />; };
