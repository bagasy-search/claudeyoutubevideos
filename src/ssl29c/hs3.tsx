// ssl29c · la forma de PARARSE: componentes únicos en 3D. Cada uno = UNA idea con un objeto que se entiende sin leer,
// en el set de la casa de Sachiko con Blanquito-Sachiko haciendo lo que ella cuenta.
// La palabra va dentro de la escena y grande; nada arriba a la izquierda. Luces siempre montadas; lo que aparece se monta
// (nunca escala 0). Ninguno se repite en la tanda ssl29.
import React, { useMemo } from "react";
import * as THREE from "three";
import { H, Stage, cl, phys, eio, AMB, GRN, ICE, RED, TX, img } from "./hkit";
import { Set3D, Sachi, PZ, secuencia, sv, orbita, Box, Cyl, Cam3, V } from "./set3d";
import { mk, Zabuton, useCasaTex } from "./casa3d";
import { useTextures } from "./fx3d";
import { mezclar, Pose, resolver, pie } from "./s3d/rig";
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
// dónde queda una mano (punta) de una pose en el mundo, con la rotación del cuerpo (grados)
const handOf = (p: Pose, d: "I" | "D", x = 0, z = 0, rotY = 0, s = S): V => { const e = resolver(p); const m = (d === "I" ? e.manoI : e.manoD).muneca; const a = rotY * Math.PI / 180, c = Math.cos(a), n = Math.sin(a); return [x + (m.x * c + m.z * n) * s, m.y * s, z + (-m.x * n + m.z * c) * s]; };
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


// ===================== ssl29c · PARARSE: piezas propias =====================
// una pierna arriba (k 0→1), puntas de pie (la figura sube), mano apoyada en un punto (espacio pecho)
const oneLeg = (k: number, base: Pose = PZ.stand): Pose => withHands(base, (q: any) => { q.pieD = pie([-0.16, 0.09 + 0.3 * k, 0.1 * k], -12, { polo: [-0.2, 0, 1], pitch: 18 * k }); });
const handD = (p: Pose, pt: V): Pose => withHands(p, (q: any) => { q.manoD = { ...q.manoD, p: pt }; });
const handI = (p: Pose, pt: V): Pose => withHands(p, (q: any) => { q.manoI = { ...q.manoI, p: pt }; });
const headTurn = (p: Pose, x: number, y: number): Pose => withHands(p, (q: any) => { q.cabeza = { ...(q.cabeza || {}), x: ((q.cabeza && q.cabeza.x) || 0) + x, y: ((q.cabeza && q.cabeza.y) || 0) + y }; });
const tiltBody = (p: Pose, z: number): Pose => withHands(p, (q: any) => { q.torso = { ...(q.torso || {}), z: ((q.torso && q.torso.z) || 0) + z }; });
// la mesada de la cocina con la pileta (fondo de casi todas las escenas de pie)
const Counter: React.FC<{ p: V; w?: number; sink?: boolean }> = ({ p, w = 1.4, sink = true }) => <group position={p}>
  <Box p={[0, 0.42, 0]} s={[w, 0.84, 0.55]} c="#e9e1d2" r={0.6} rad={0.02} />
  <Box p={[0, 0.86, 0]} s={[w + 0.06, 0.05, 0.6]} c="#b98a5a" r={0.45} rad={0.015} />
  {[-w / 4, w / 4].map((x, i) => <Box key={i} p={[x, 0.5, 0.28]} s={[w / 2 - 0.08, 0.6, 0.02]} c="#efe8db" r={0.55} rad={0.01} />)}
  {sink && <><Box p={[0.15, 0.88, 0]} s={[0.46, 0.02, 0.34]} c="#c9ced4" m={0.6} r={0.25} /><Cyl p={[0.15, 0.98, -0.2]} r={0.018} h={0.2} c="#c9ced4" m={0.8} rough={0.2} /><Box p={[0.15, 1.08, -0.13]} s={[0.03, 0.03, 0.15]} c="#c9ced4" m={0.8} r={0.2} /></>}
</group>;
const Chair: React.FC<{ p: V; rotY?: number; arms?: number; c?: string; glow?: number }> = ({ p, rotY = 0, arms = 0, c = "#8a5a34", glow = 0 }) => <group position={p} rotation={[0, rotY * Math.PI / 180, 0]}>
  <Box p={[0, 0.45, 0]} s={[0.46, 0.05, 0.44]} c={c} r={0.55} e="#ffb347" ei={0.25 * glow} />
  {[[-0.2, -0.19], [0.2, -0.19], [-0.2, 0.19], [0.2, 0.19]].map(([x, z], i) => <Box key={i} p={[x, 0.22, z]} s={[0.04, 0.44, 0.04]} c={c} r={0.6} />)}
  <Box p={[0, 0.78, -0.2]} s={[0.46, 0.5, 0.04]} c={c} r={0.55} e="#ffb347" ei={0.2 * glow} />
  {arms > 0.01 && [-0.23, 0.23].map((x, i) => <group key={i} position={[x, 0.66 - 0.5 * (1 - arms), 0]}><Box p={[0, 0, 0]} s={[0.05, 0.04, 0.4]} c={c} op={arms} /><Box p={[0, -0.1, 0.17]} s={[0.04, 0.2, 0.04]} c={c} op={arms} /></group>)}
</group>;
const Bird: React.FC<{ p: V; flap: number; rotY?: number }> = ({ p, flap, rotY = 0 }) => <group position={p} rotation={[0, rotY, 0]}>
  <mesh scale={[1.25, 0.9, 0.9]}><sphereGeometry args={[0.06, 20, 14]} /><meshStandardMaterial color="#7a5a3c" roughness={0.7} /></mesh>
  <mesh position={[0.07, 0.035, 0]}><sphereGeometry args={[0.035, 16, 12]} /><meshStandardMaterial color="#7a5a3c" roughness={0.7} /></mesh>
  <mesh position={[0.1, 0.03, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.012, 0.035, 10]} /><meshStandardMaterial color="#e2a23a" /></mesh>
  <mesh position={[0.065, 0.035, 0]}><sphereGeometry args={[0.04, 14, 10]} /><meshStandardMaterial color="#d9653b" roughness={0.6} /></mesh>
  {[-1, 1].map((k) => <Box key={k} p={[-0.01, 0.02, k * 0.05]} s={[0.09, 0.012, 0.05]} c="#5d4129" rot={[k * (0.25 + 0.9 * flap), 0, 0]} />)}
  <Box p={[-0.085, 0.01, 0]} s={[0.06, 0.01, 0.04]} c="#5d4129" rot={[0, 0, 0.3]} />
</group>;
const Potato: React.FC<{ p: V; s?: number; glow?: number }> = ({ p, s = 1, glow = 0 }) => <mesh position={p} scale={[0.09 * s, 0.13 * s, 0.085 * s]}><sphereGeometry args={[1, 24, 18]} /><meshStandardMaterial color="#b98d55" roughness={0.9} emissive="#ffb347" emissiveIntensity={0.3 * glow} /></mesh>;
const Towel: React.FC<{ p: V; fold: number; c?: string }> = ({ p, fold, c = "#f4f1ea" }) => { const a = cl(fold * 2), b = cl(fold * 2 - 1);
  return <group position={p}>
    <Box p={[0, 0.012 + 0.03 * b, 0]} s={[0.4, 0.02 + 0.04 * b, 0.3]} c={c} r={1} rad={0.01} />
    {b < 0.99 && <group position={[0.2, 0.02, 0]} rotation={[0, 0, Math.PI * b]}><Box p={[0.2, 0, 0]} s={[0.4, 0.02, 0.3]} c={c} r={1} rad={0.01} /></group>}
    {a < 0.99 && <group position={[0, 0.02, 0.15]} rotation={[-Math.PI * a, 0, 0]}><Box p={[0, 0, 0.15]} s={[0.4, 0.02, 0.3]} c={c} r={1} rad={0.01} /></group>}
    {[0, 1, 2].map((i) => <Box key={i} p={[-0.12 + i * 0.12, 0.025 + 0.06 * b, 0.155]} s={[0.05, 0.005, 0.005]} c="#9bb4c9" />)}
  </group>; };
const Level: React.FC<{ p: V; ang: number; s?: number }> = ({ p, ang, s = 1 }) => { const off = Math.max(-0.11, Math.min(0.11, ang * 0.9)), ok = Math.abs(ang) < 0.03;
  return <group position={p} rotation={[0, 0, ang]} scale={s}>
    <Box p={[0, 0, 0]} s={[0.36, 0.06, 0.06]} c="#e2b23a" r={0.4} rad={0.01} />
    <Cyl p={[0, 0.0, 0.032]} r={0.022} h={0.13} c="#c8f0b0" op={0.7} rot={[0, 0, Math.PI / 2]} />
    <mesh position={[off, 0, 0.04]}><sphereGeometry args={[0.014, 12, 10]} /><meshStandardMaterial color={ok ? GRN : "#ffffff"} emissive={ok ? GRN : "#ffffff"} emissiveIntensity={0.6} /></mesh>
  </group>; };
const Dots: React.FC<{ p: V; n: number; k: number; gap?: number; c?: string }> = ({ p, n, k, gap = 0.13, c = "#ffcf6a" }) => <group position={p}>
  {Array.from({ length: n }, (_, i) => { const on = cl(k * n - i); return <mesh key={i} position={[(i - (n - 1) / 2) * gap, 0, 0]} scale={0.6 + 0.4 * on}><sphereGeometry args={[0.035, 16, 12]} /><meshStandardMaterial color={on > 0.5 ? c : "#cfc6b6"} emissive={c} emissiveIntensity={0.9 * on} toneMapped={on < 0.5} /></mesh>; })}
</group>;
const Door: React.FC<{ p: V; open?: number; c?: string }> = ({ p, open = 0, c = "#8a5a34" }) => <group position={p}>
  <Box p={[0, 1.0, -0.02]} s={[0.96, 2.04, 0.04]} c="#efe8db" />
  <group position={[-0.42, 0, 0]} rotation={[0, -open * 1.4, 0]}><Box p={[0.42, 1.0, 0.02]} s={[0.84, 1.95, 0.05]} c={c} r={0.6} /><Cyl p={[0.76, 0.95, 0.06]} r={0.025} h={0.06} c="#d9b25a" m={0.8} rot={[Math.PI / 2, 0, 0]} /></group>
</group>;
const Veg: React.FC<{ p: V; c: string; s?: number; long?: boolean }> = ({ p, c, s = 1, long }) => <mesh position={p} scale={long ? [0.05 * s, 0.05 * s, 0.16 * s] : [0.07 * s, 0.065 * s, 0.07 * s]}><sphereGeometry args={[1, 18, 14]} /><meshStandardMaterial color={c} roughness={0.55} /></mesh>;

// 0:10 · «te das vuelta muy rápido»: el teléfono rojo grande suena en primer plano con ondas; ella gira de golpe y TODO el mundo (piso, pared, cocina) se inclina
// sobre un pivote a sus pies, las tazas se deslizan; su mano se clava en el borde de la pileta (halo) y todo vuelve con un rebote de resorte
export const G_tilt: F = ({ t, h }) => { const tl = 1.5, gr = 3.7;
  return <Hero d={1.3} ly={0.2} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.9, 1.25, 2.6], [0.0, 0.85, -0.35]), C([0.7, 1.2, 2.7], [0.0, 0.85, -0.35]), 8)}
    set={(tt: number) => ({ floor: "none", wall: false, bg: "#e6dccb", spot: [0, 0, -0.3] as V, spotK: 0.5 })}
    scene={(tt) => { const ring = sv(tt, 0.2, 0.4) * (1 - sv(tt, tl + 0.2, tl + 0.5)), turn = eio(tt, tl - 0.25, tl + 0.2), back = phys(tt, gr, 4, 0.35);
      const tilt = 0.3 * sv(tt, tl, tl + 0.5) * (tt < gr ? 1 : Math.max(-0.25, 1 - back)), grab = sv(tt, gr - 0.4, gr), slide = 0.35 * sv(tt, tl, tl + 1.0);
      const hp = handOf(handI(PZ.stand, [0.62, -0.5, 0.42]), "I", 0.15, 0.1, -160 + 180 * turn);
      return <group position={[0.15, 0, 0.1]} rotation={[0, 0, tilt]}><group position={[-0.15, 0, -0.1]}>
        <Box p={[0, -0.03, -1]} s={[10, 0.06, 10]} c="#d8cf9a" r={0.9} />
        {Array.from({ length: 12 }, (_, i) => <Box key={i} p={[-3 + i * 0.55, 0.002, -1]} s={[0.012, 0.004, 10]} c="#3b4a63" />)}
        <Wallp p={[0, 0, -0.75]} w={10} h={4} />
        <Counter p={[-0.25, 0, -0.45]} w={1.6} />
        <group position={[0.32, 0.9, -0.3]} scale={1.8}><Box p={[0, 0.04, 0]} s={[0.2, 0.08, 0.14]} c="#c0392b" r={0.35} rad={0.02} /><Box p={[0, 0.1, 0]} s={[0.22, 0.03, 0.06]} c="#a52e22" r={0.35} rad={0.015} rot={[0, 0, ring > 0.5 ? 0.15 * Math.sin(tt * 22) : 0]} />
          {[0, 1].map((i) => { const u = (tt * 1.8 + i * 0.5) % 1; return <mesh key={i} position={[0, 0.1, 0]} scale={0.6 + 1.6 * u}><torusGeometry args={[0.14, 0.008, 8, 40]} /><meshBasicMaterial color={RED} transparent opacity={0.8 * ring * (1 - u)} toneMapped={false} /></mesh>; })}</group>
        {[-0.85, -0.6].map((x, i) => <group key={i} position={[x + slide * (1.3 + i * 0.6), 0.97, -0.3]} rotation={[0, 0, -0.4 * slide]}><Cyl p={[0, 0, 0]} r={0.075} r2={0.06} h={0.16} c={i ? "#9bb06a" : "#f3eee4"} /></group>)}
        <Sachi p={handI(PZ.stand, [lerp(0.4, 0.62, grab), lerp(-1.2, -0.5, grab), lerp(0.1, 0.42, grab)])} t={tt} x={0.15} z={0.1} rotY={-160 + 180 * turn} s={S} expr={tt > tl && tt < gr + 0.8 ? "sorprendido" : "feliz"} />
        <Glow p={hp} r={0.12} k={grab * (1 - sv(tt, gr + 1.6, gr + 2.2))} c="#9be3a0" op={0.7} />
      </group></group>; }} />; };

// 0:54 · su madre vendía verduras en el mercado: los cajones caen de a uno con rebote, se despliega el toldo rayado, ella detrás del mostrador; entran saltando los tres chicos
export const G_vegmarket: F = ({ t, h }) => { const kids = it(h, 0, 3.5);
  return <Hero d={1.3} ly={0.15} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.6, 1.2, 2.7], [0, 0.6, -0.3]), C([-0.5, 1.15, 2.7], [0, 0.6, -0.3]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.2] as V, spotK: 0.6, warm: 0.6 })}
    scene={(tt) => { const aw = eio(tt, 1.6, 2.4);
      const VEGS: [string, boolean][] = [["#e2662f", false], ["#7da23a", false], ["#7b3e78", true], ["#f2d04a", false], ["#c43a2e", false], ["#e8e4d8", true]];
      return <>
        <Box p={[0, 0.2, 0.2]} s={[1.75, 0.4, 0.5]} c="#7a4e2c" r={0.7} />
        {[-0.56, 0, 0.56].map((x, i) => { const d = drop(tt, 0.5 + i * 0.3, 0.9); return d.on ? <group key={i} position={[x, d.y, 0.2]}><Box p={[0, 0.53, 0]} s={[0.52, 0.26, 0.44]} c="#b98a5a" r={0.8} />
            {[0, 1, 2, 3].map((j) => { const v = VEGS[(i * 2 + j) % 6]; return <Veg key={j} p={[-0.13 + (j % 2) * 0.26, 0.72 + 0.02 * (j >> 1), -0.1 + (j >> 1) * 0.18]} c={v[0]} long={v[1]} s={1.4} />; })}</group> : null; })}
        {aw > 0.01 && <group position={[0, 1.6, -0.1]}>{Array.from({ length: 7 }, (_, i) => <Box key={i} p={[-0.81 + i * 0.27, 0, 0.35 * aw - 0.35]} s={[0.27, 0.05, 0.7 * aw + 0.01]} c={i % 2 ? "#f3eee4" : "#c0392b"} rot={[0.25, 0, 0]} />)}</group>}
        {[-0.85, 0.85].map((x, i) => <Cyl key={i} p={[x, 0.8, -0.3]} r={0.025} h={1.6} c="#7a4e2c" />)}
        <Sachi p={handD(handI(PZ.stand, [0.4, -0.75, 0.4]), [-0.4, -0.75, 0.4])} t={tt} x={0} z={-0.4} s={S} expr="feliz" />
        {[-1.05, -1.4, 1.15].map((x, i) => { const u = eio(tt, kids + i * 0.4, kids + i * 0.4 + 0.7); return u > 0.01 ? <group key={i} position={[lerp(x * 1.8, x, u), 0.25 * Math.sin(Math.PI * u), 0.25]}><Sachi p={PZ.stand} t={tt + i} s={S * (0.5 + 0.08 * i)} rotY={x < 0 ? 25 : -25} expr="feliz" color="#efe6d8" /></group> : null; })}
      </>; }} />; };


// 1:48 · la mano siempre cerca, lista para agarrar: una ranura de luz dorada en el borde de la mesada y su mano flotando a dos dedos, con un halo;
// se marea (la cabeza da vueltas, el cuerpo se balancea) y se deja caer, segura, en la silla bien visible a su lado
export const G_handready: F = ({ t, h }) => { const dz = it(h, 0, 4.0);
  return <Hero d={1.15} ly={0.1} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.15, 1.1, 2.55], [0.15, 0.75, -0.35]), C([-0.1, 1.1, 2.55], [0.15, 0.75, -0.35]), 8)}
    set={(tt: number) => ({ spot: [0.2, 0, -0.3] as V, spotK: 0.6 })}
    scene={(tt) => { const dzz = sv(tt, dz - 1.2, dz - 0.6) * (1 - sv(tt, dz + 0.9, dz + 1.3)), sway = Math.sin(tt * 3.2) * 9 * dzz, sit = eio(tt, dz, dz + 1.0), gap = sv(tt, 0.4, 1.0), hover = 0.03 * Math.sin(tt * 2.5);
      const pz = handI(tiltBody(mezclar(PZ.stand, chairSit, sit), sway), [lerp(0.5, 0.45, sit), lerp(-0.62 + hover, -1.0, sit), lerp(0.42, 0.1, sit)]);
      const hp = handOf(pz, "I", -0.15, -0.2, 0);
      return <>
        <Wallp p={[0, 0, -0.95]} w={4} h={2.2} />
        <Counter p={[0.75, 0, -0.35]} w={0.9} sink={false} />
        <Chair p={[-0.15, 0, -0.45]} glow={sv(tt, dz, dz + 0.4) * (1 - sv(tt, dz + 2.0, dz + 2.6))} />
        <Sachi p={withHands(pz, (q: any) => { q.cabeza = { ...(q.cabeza || {}), z: 12 * Math.sin(tt * 4.5) * dzz, x: (q.cabeza?.x || 0) + 6 * dzz }; })} t={tt} x={-0.15} z={-0.2} rotY={0} s={S} expr={dzz > 0.4 ? "confundido" : "feliz"} />
        {false && [0, 1, 2].map((i) => { const a = tt * 4 + i * 2.1, hd = headOf(PZ.stand, -0.15, -0.2); return <mesh key={i} position={[hd[0] + 0.16 * Math.cos(a), hd[1] + 0.2, hd[2] + 0.16 * Math.sin(a)]}><sphereGeometry args={[0.025, 10, 8]} /><meshStandardMaterial color="#ffd27a" emissive="#ffb347" emissiveIntensity={1} transparent opacity={dzz} toneMapped={false} /></mesh>; })}
        <Box p={[0.3, 0.89, -0.2]} s={[0.05, 0.02, 0.62]} c="#ffe08a" e="#ffd27a" ei={2.6 * gap} op={gap * (1 - 0.7 * sit)} />
        <Glow p={[0.29, 0.9, -0.2]} r={0.16} k={gap * (1 - sit)} c="#ffd27a" op={0.55} />
        <mesh position={hp} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.006, 8, 32]} /><meshStandardMaterial color="#ffe08a" emissive="#ffd27a" emissiveIntensity={1.2} transparent opacity={gap * (1 - sit)} toneMapped={false} /></mesh>
      </>; }} />; };

// 2:36 · el ejercicio de la radio NHK: la radio vieja en su banquito late con anillos de sonido; ella con la mano en el respaldo de la silla sube la rodilla
// a noventa grados y el pie queda en el aire (la sombra del pie se separa del piso)
export const G_radioleg: F = ({ t, h }) => { const rd = it(h, 0, 3.0);
  return <Hero d={1.0} ly={0.05} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.75, 0.85, 2.3], [0.0, 0.7, -0.3]), C([0.45, 0.85, 2.4], [0.0, 0.7, -0.3]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.3] as V, spotK: 0.6 })}
    scene={(tt) => { const leg = sv(tt, 0.6, 1.4) * (0.5 - 0.5 * Math.cos((tt - 0.6) * 1.9)), on = sv(tt, 0.2, 0.6), beat = 0.5 + 0.5 * Math.sin(tt * 6);
      return <>
        <Wallp p={[0, 0, -0.95]} w={4} h={2.2} />
        <Chair p={[0.0, 0, -0.55]} />
        <Box p={[0.55, 0.25, -0.45]} s={[0.4, 0.5, 0.34]} c="#7a4e2c" r={0.6} />
        <group position={[0.55, 0.5, -0.45]} scale={1 + 0.04 * beat * on}>
          <Box p={[0, 0.15, 0]} s={[0.42, 0.28, 0.2]} c="#8a5a34" r={0.4} rad={0.04} />
          <Cyl p={[-0.09, 0.15, 0.1]} r={0.08} h={0.02} c="#d8c7a2" rot={[Math.PI / 2, 0, 0]} />
          <Cyl p={[0.12, 0.18, 0.1]} r={0.035} h={0.03} c="#d9b25a" m={0.7} rot={[Math.PI / 2, 0, 0]} e="#ffb347" ei={0.6 * on} />
          {[0, 1, 2].map((i) => { const u = (tt * 0.7 + i / 3) % 1; return <mesh key={i} position={[-0.09, 0.15, 0.12]} scale={0.3 + 1.5 * u}><torusGeometry args={[0.3, 0.016, 8, 48]} /><meshBasicMaterial color="#ffb347" transparent opacity={0.8 * on * (1 - u)} toneMapped={false} /></mesh>; })}
        </group>
        <Sachi p={withHands(chairSit, (q: any) => { const f = q.pieI.p; q.pieI = { ...q.pieI, p: [f[0], f[1] + 0.5 * leg, f[2] + 0.12 * leg] }; })} t={tt} x={0} z={-0.3} s={S} expr="feliz" />
        
      </>; }} />; };

// 3:11 · «como un pájaro en una rama»: un pájaro naranja grande entra volando en arco desde afuera del cuadro y se posa con rebote en una rama al lado de su mano;
// ella en un pie con la mano sobre la rama; rama, brazo y cuerpo se mecen con el mismo péndulo
export const G_birdbranch: F = ({ t, h }) =>
  <Hero d={1.35} ly={0.2} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.6, 1.2, 2.3], [0.25, 0.95, -0.3]), C([0.35, 1.2, 2.4], [0.25, 0.95, -0.3]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.3] as V, spotK: 0.6 })}
    scene={(tt) => { const fl = eio(tt, 0.5, 2.8), land = phys(tt, 2.8, 5, 0.3), sw = Math.sin(tt * 1.6) * sv(tt, 3.0, 3.8), dip = tt > 2.8 ? -0.06 * Math.max(0, 1.2 - land) : 0;
      const hp0 = handOf(handI(oneLeg(1.2), [0.62, -0.42, 0.28]), "I", 0, 0.08, -15), BR: V = [hp0[0] - 0.1, hp0[1] + 0.02, hp0[2] - 0.05], bx = lerp(2.2, BR[0] + 0.12, fl), by = lerp(1.9, BR[1] + 0.09, fl) + 0.35 * Math.sin(Math.PI * fl) + (tt > 2.8 ? dip : 0);
      return <group rotation={[0, 0, 0.04 * sw]}>
        <Wallp p={[0, 0, -0.85]} w={4} h={2.4} />
        <Win p={[0.75, 1.35, -0.8]} w={1.0} h={0.8} />
        <Counter p={[-0.25, 0, -0.5]} />
        <group position={BR} rotation={[0, 0, 0.08 + dip * 2 + 0.03 * sw]}><Cyl p={[0.15, 0, 0]} r={0.03} h={0.7} c="#6b4a2e" rot={[0, 0, Math.PI / 2]} />
          {[0.35, 0.45].map((x, i) => <mesh key={i} position={[x, 0.04 * (i ? -1 : 1), 0]}><sphereGeometry args={[0.09, 14, 10]} /><meshStandardMaterial color="#6f9a4a" roughness={0.8} /></mesh>)}</group>
        <group scale={2.2} position={[bx, by, lerp(-0.6, BR[2], fl)]}><Bird p={[0, 0, 0]} flap={tt > 2.8 ? 0 : 0.5 + 0.5 * Math.sin(tt * 26)} rotY={Math.PI} /></group>
        <Sachi p={handI(oneLeg(sv(tt, 0.2, 0.8) * 1.2), [0.62, -0.42, 0.28])} t={tt} x={0.0} z={0.08} rotY={-15} s={S} expr="feliz" />
      </group>; }} />;

// 3:40 · empezó con 5 segundos a los 80 y a los dos meses aguantaba un minuto: el cronómetro gigante barre de 5 a 60 mientras una torre de discos dorados crece disco a disco;
// al minuto el teléfono vibra en la mesita
export const G_fivetosixty: F = ({ t, h }) => { const two = it(h, 0, 3.5), ph = it(h, 1, 6.5);
  return <Hero d={1.3} ly={0.15} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.45, 1.15, 2.6], [0.25, 0.75, -0.3]), C([-0.25, 1.15, 2.6], [0.25, 0.75, -0.3]), 9)}
    set={(tt: number) => ({ spot: [0.4, 0, -0.3] as V, spotK: 0.6 })}
    scene={(tt) => { const g = eio(tt, 0.8, two + 1.0), n = Math.max(1, Math.round(1 + 11 * g)), ring = sv(tt, ph - 0.2, ph) * (1 - sv(tt, ph + 1.4, ph + 1.8));
      return <>
        <Wallp p={[0, 0, -0.85]} w={4} h={2.2} />
        <Dial p={[0.35, 1.45, -0.78]} ang={(5 + 55 * g) / 60 * Math.PI * 2} sweep={(5 + 55 * g) / 60} s={0.75} />
        <Sachi p={handI(oneLeg(0.9), [0.5, -0.6, 0.3])} t={tt} x={-0.45} z={-0.3} rotY={15} s={S} expr={n >= 12 ? "feliz" : "neutral"} />
        <Chair p={[-0.05, 0, -0.45]} rotY={-90} />
        {Array.from({ length: n }, (_, i) => { const k = i === n - 1 ? phys(tt, 0.8 + (two + 0.2) * i / 11, 6, 0.4) : 1; return <Cyl key={i} p={[0.4, 0.07 + i * 0.062 + 0.3 * (1 - Math.min(1, k)), -0.3]} r={0.16} h={0.05} c={i === 11 ? "#e2b23a" : i % 2 ? "#e9c88a" : "#d9a85a"} rough={0.35} m={0.3} e="#ffb347" ei={i === n - 1 ? 0.5 : 0.05} />; })}
        <Table p={[0.95, 0, -0.35]} w={0.45} d={0.4} h={0.45} />
        <group position={[0.95, 0.47, -0.3]} rotation={[0, ring > 0.3 ? 0.15 * Math.sin(tt * 30) : 0, 0]}><Box p={[0, 0.01, 0]} s={[0.12, 0.02, 0.22]} c="#2b2f36" r={0.3} rad={0.01} /><Box p={[0, 0.022, 0]} s={[0.1, 0.004, 0.18]} c="#9be3a0" e="#9be3a0" ei={0.8 * ring} /></group>
        <Ring p={[0.95, 0.5, -0.3]} r={0.16 + 0.08 * ((tt * 2.4) % 1)} k={ring} col={GRN} />
      </>; }} />; };


// 3:59 · mirarse a los ojos en el espejo: con la vista al piso (rayo rojo) se tambalea y el nivel bailotea; con la vista en sus propios ojos del reflejo (rayo verde) queda firme
export const G_mirroreyes: F = ({ t, h }) => { const down = it(h, 0, 2.6), fw = it(h, 1, 5.2);
  return <Hero d={1.35} ly={0.1} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([-1.05, 1.15, 1.3], [0.15, 0.85, -0.7]), C([-0.9, 1.15, 1.45], [0.15, 0.85, -0.7]), 9)}
    set={(tt: number) => ({ spot: [0.2, 0, -0.4] as V, spotK: 0.6 })}
    scene={(tt) => { const lk = sv(tt, down - 0.3, down + 0.2) * (1 - sv(tt, fw - 0.3, fw + 0.2)), wob = 8 * Math.sin(tt * 3.0) * lk, up = sv(tt, fw - 0.3, fw + 0.2);
      const pz = withHands(handI(oneLeg(0.8), [0.55, -0.55, 0.35]), (q: any) => { q.cabeza = { ...(q.cabeza || {}), x: 34 * lk }; });
      const X = 0.15, Z = -0.15, MZ = -0.85, hd = headOf(PZ.stand, X, Z), hm: V = [X, hd[1], 2 * MZ - hd[2]];
      return <>
        <Wallp p={[0, 0, -2.4]} w={5} h={2.2} c="#d8cfbf" />
        {[[0, 0.75, 0.9, 0.05], [0, -0.75, 0.9, 0.05], [0.43, 0, 0.05, 1.55], [-0.43, 0, 0.05, 1.55]].map(([x, y, w, hh], i) => <Box key={i} p={[X + x, 1.05 + y, MZ]} s={[w, hh, 0.05]} c="#b98a5a" r={0.4} />)}
        <Box p={[X, 1.05, MZ]} s={[0.82, 1.45, 0.005]} c="#dfeef5" op={0.12} m={0.9} r={0.05} />
        <group position={[X, 0, 2 * MZ - Z]} rotation={[0, 0, -wob * Math.PI / 180]}><Sachi p={pz} t={tt} rotY={0} s={S} expr={lk > 0.5 ? "sorprendido" : "feliz"} /></group>
        <group position={[X, 0, Z]} rotation={[0, 0, wob * Math.PI / 180]}><Sachi p={pz} t={tt} rotY={180} s={S} expr={lk > 0.5 ? "sorprendido" : "feliz"} /></group>
        {lk > 0.05 && <Cord a={[hd[0], hd[1] - 0.04, hd[2] - 0.08]} b={[X, 0.06, Z - 0.35]} w={0.016} c={RED} />}
        {up > 0.05 && <Cord a={[hd[0], hd[1], hd[2] - 0.08]} b={[hm[0], hm[1], MZ + 0.01]} w={0.016 * up} c={GRN} />}
        <Level p={[0.8, 0.95, -0.6]} ang={0.25 * Math.sin(tt * 3.0) * lk} s={1.4} />
        <Box p={[0.8, 0.45, -0.6]} s={[0.3, 0.9, 0.3]} c="#7a4e2c" r={0.6} />
      </>; }} />; };


// 4:22 · «como una dama en la cuerda floja»: las baldosas suben y se estiran hasta ser una soga gruesa entre dos postes; ella cruza de frente a la cámara,
// brazos bien abiertos, con la bolsa de basura grande colgando de una mano
export const G_tightrope: F = ({ t, h }) => { const W = (tt: number) => lerp(-0.6, 0.35, eio(tt, 1.6, 5.6));
  return <Hero d={1.4} ly={0.45} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.45, 0.95, 2.4], [0, 0.85, -0.3]), C([-0.25, 0.95, 2.4], [0, 0.85, -0.3]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.3] as V, spotK: 0.5 })}
    scene={(tt) => { const rope = eio(tt, 0.3, 1.3), wz = W(tt), step = Math.sin(tt * Math.PI * 1.8), RY = 0.06 + 0.32 * rope;
      return <>
        <Wallp p={[0, 0, -1.4]} w={5} h={2.4} />
        {Array.from({ length: 12 }, (_, i) => <Box key={i} p={[0, lerp(0.06, RY, rope), -1.0 + i * 0.16]} s={[lerp(0.17, 0.06, rope), lerp(0.02, 0.06, rope), lerp(0.15, 0.17, rope)]} c={rope > 0.9 ? "#c9a87a" : i % 2 ? "#e9e1d2" : "#c9a87a"} r={0.8} rad={0.02} />)}
        {[-1.1, 0.85].map((z, i) => <group key={i}><Cyl p={[0, (RY + 0.2) / 2, z]} r={0.05} h={RY + 0.2} c="#7a4e2c" /><Cyl p={[0, RY + 0.2, z]} r={0.07} h={0.05} c="#5a3820" /></group>)}
        <group position={[0, RY + 0.015, wz]}>
          <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.95, -0.15 + 0.08 * step, 0.05] }; q.manoD = { ...q.manoD, p: [-0.95, -0.2 - 0.08 * step, 0.05] }; q.pieI = pie([0.0, 0.09 + 0.07 * Math.max(0, step), 0.12], 0, { polo: [0, 0, 1] }); q.pieD = pie([0.0, 0.09 + 0.07 * Math.max(0, -step), -0.12], 0, { polo: [0, 0, 1] }); })} t={tt} rotY={0} s={S} expr="feliz" />
          <group position={[-0.42, 0.62, 0.0]}>
            <Cord a={[0, 0.0, 0]} b={[0, -0.14, 0]} w={0.01} c="#2b2b2e" />
            <mesh position={[0, -0.3, 0]} scale={[1, 1.3, 0.9]}><sphereGeometry args={[0.15, 20, 16]} /><meshStandardMaterial color="#2b2b2e" roughness={0.3} /></mesh>
            <mesh position={[0, -0.13, 0]}><coneGeometry args={[0.05, 0.08, 10]} /><meshStandardMaterial color="#2b2b2e" roughness={0.3} /></mesh>
          </group>
        </group>
      </>; }} />; };

// 5:08 · un puentecito angosto sobre un arroyo: el agua corre con hojitas que pasan bajo la tabla; la tabla cede un poco con cada paso; ella cruza despacio, sin apuro
export const G_bridge: F = ({ t, h }) => { const W = (tt: number) => lerp(-1.0, 1.0, eio(tt, 0.9, 7.5));
  return <Hero d={1.45} ly={0.45} t={t} h={h} mode="drop" cam={(tt) => { const x = W(tt) * 0.5; return orbita(tt, C([x + 0.4, 0.75, 2.2], [x, 0.45, -0.3]), C([x + 0.1, 0.8, 2.3], [x, 0.45, -0.3]), 10); }}
    set={(tt: number) => ({ floor: "none", wall: false, bg: "#cfe0ea", spot: [0, 0, -0.3] as V, spotK: 0.5, warm: 0.5 })}
    scene={(tt) => { const wx = W(tt), step = Math.sin(tt * Math.PI * 1.3), sag = -0.025 * Math.cos(Math.PI * wx / 2.4) * (0.6 + 0.4 * Math.abs(step));
      return <>
        <Box p={[0, 0.0, -0.3]} s={[8, 0.02, 0.9]} c="#4f8fb8" r={0.15} m={0.2} />
        {Array.from({ length: 14 }, (_, i) => { const u = (tt * 0.12 + i / 14) % 1; return <Box key={i} p={[-3 + 6 * u, 0.016, -0.62 + (i % 5) * 0.13]} s={[0.22, 0.004, 0.012]} c="#cfe8f5" op={0.8 * Math.sin(Math.PI * u)} />; })}
        {Array.from({ length: 5 }, (_, i) => { const u = (tt * 0.1 + i / 5) % 1; return <Box key={"l" + i} p={[-3 + 6 * u, 0.02, -0.5 + (i % 3) * 0.2]} s={[0.06, 0.006, 0.04]} c={["#d99a3a", "#c9732e", "#9bb06a"][i % 3]} rot={[0, u * 6, 0]} />; })}
        {[-1, 1].map((k) => <Box key={k} p={[0, 0.06, -0.3 + k * 0.75]} s={[8, 0.12, 0.6]} c="#7d9a4f" r={0.9} />)}
        {[[-2.2, -1.6], [-0.9, -2.1], [0.6, -1.8], [2.0, -2.3], [3.0, -1.5]].map(([x, z], i) => <group key={i} position={[x, 0, z]}><Cyl p={[0, 0.35, 0]} r={0.05} h={0.7} c="#5a3e2a" /><mesh position={[0, 0.95, 0]}><sphereGeometry args={[0.45, 18, 12]} /><meshStandardMaterial color={["#6f9a4a", "#8aae5a", "#d99a3a"][i % 3]} roughness={0.9} /></mesh></group>)}
        <group position={[0, 0.16 + sag, -0.3]}><Box p={[0, 0, 0]} s={[2.4, 0.05, 0.22]} c="#a57a4e" r={0.8} /></group>
        {[-1.2, 1.2].map((x, i) => <Box key={i} p={[x, 0.1, -0.3]} s={[0.1, 0.14, 0.3]} c="#7a4e2c" />)}
        <group position={[wx, 0.18 + sag, -0.3]}><Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.75, -0.6, 0.1] }; q.manoD = { ...q.manoD, p: [-0.75, -0.6, 0.1] }; q.pieI = pie([0.05, 0.09 + 0.06 * Math.max(0, step), 0.1], 0); q.pieD = pie([-0.05, 0.09 + 0.06 * Math.max(0, -step), -0.1], 0); })} t={tt} rotY={90} s={S} expr="feliz" /></group>
      </>; }} />; };


// 5:30 · la silla de madera SIN brazos: la silla gira en su pedestal; los dos brazos se desprenden, caen con rebote y se deshacen en aserrín;
// queda la silla sola y su asiento se entibia con la pátina de 47 años (47 rayitas talladas en el respaldo)
export const G_armlesschair: F = ({ t, h }) => { const yr = it(h, 0, 3.5);
  return <Hero d={1.15} ly={0.15} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.5, 1.15, 2.0], [0, 0.6, -0.3]), C([-0.5, 1.15, 2.0], [0, 0.6, -0.3]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.3] as V, spotK: 0.7 })}
    scene={(tt) => { const off = sv(tt, 1.2, 1.4), fall = cl((tt - 1.3) / 0.9), gone = sv(tt, 2.4, 3.0), pat = sv(tt, yr, yr + 1.0), ped = drop(tt, 0.3, 0.6);
      return <>
        {ped.on && <group position={[0, ped.y, -0.3]} scale={1.35}>
          <Cyl p={[0, 0.03, 0]} r={0.45} h={0.06} c="#d8c7a2" rough={0.4} />
          <group rotation={[0, 0.5 + 0.35 * Math.sin(tt * 0.5), 0]} position={[0, 0.06, 0]}>
            <Chair p={[0, 0, 0]} arms={1 - off} c={pat > 0.5 ? "#9a6438" : "#8a5a34"} glow={pat} />
            {Array.from({ length: 47 }, (_, i) => <Box key={i} p={[-0.19 + (i % 12) * 0.033, 0.62 + Math.floor(i / 12) * 0.075, -0.177]} s={[0.006, 0.05, 0.004]} c="#4a2e18" op={sv(tt, yr + i * 0.02, yr + i * 0.02 + 0.2)} />)}
          </group>
          {off > 0.5 && gone < 0.99 && [-1, 1].map((k, i) => { const y = 0.66 - 0.62 * Math.min(1, fall * fall * 1.2) + 0.04 * Math.abs(Math.sin(fall * 9)) * (fall > 0.8 ? 1 : 0); return <group key={i} position={[k * (0.26 + 0.15 * fall), Math.max(0.04, y), 0.02]} rotation={[0, 0, k * fall * 1.4]}><Box p={[0, 0, 0]} s={[0.05, 0.04, 0.4]} c="#8a5a34" op={1 - gone} /></group>; })}
          {gone > 0.01 && gone < 0.99 && Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(i % 2 ? 1 : -1) * (0.4 + 0.05 * (i % 5)), 0.05 + 0.25 * gone * ((i * 7) % 5) / 5, 0.1 * ((i * 3) % 5 - 2)]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#d9b88a" transparent opacity={1 - gone} /></mesh>)}
        </group>}
        <Glow p={[0, 0.7, -0.3]} r={0.5} k={pat} c="#ffcf8a" op={0.1} />
      </>; }} />; };


// 6:22 · «como si te sentaras sobre una torta»: una torta grande con su velita en la silla; ella baja despacísimo; una regla de luz marca la distancia y
// se frena a un dedo de la crema (punto rojo que no llega a tocar); la torta queda entera
export const G_cake: F = ({ t, h }) =>
  <Hero d={1.3} ly={0.15} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([1.0, 0.75, 1.3], [0, 0.6, -0.4]), C([1.15, 0.8, 1.05], [0, 0.6, -0.4]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.4] as V, spotK: 0.7, warm: 0.55 })}
    scene={(tt) => { const sit = 0.8 * eio(tt, 1.4, 4.4), ok = sv(tt, 4.4, 4.8), ck = drop(tt, 0.4, 0.6), gap = lerp(0.55, 0.035, sit / 0.8);
      return <>
        <Wallp p={[0, 0, -1.0]} w={3.6} h={2.2} />
        <Chair p={[0, 0, -0.55]} />
        {ck.on && <group position={[0, 0.48 + ck.y, -0.5]}>
          <Cyl p={[0, 0.07, 0]} r={0.19} h={0.14} c="#f3e4c8" rough={0.7} /><Cyl p={[0, 0.15, 0]} r={0.193} h={0.03} c="#f7f2ea" rough={0.5} />
          <Cyl p={[0, 0.07, 0]} r={0.194} h={0.02} c="#e58fa0" rough={0.5} />
          {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0.16 * Math.cos(i * 0.628), 0.175, 0.16 * Math.sin(i * 0.628)]}><sphereGeometry args={[0.022, 10, 8]} /><meshStandardMaterial color="#fffaf0" /></mesh>)}
          {[[0.06, 0.03], [-0.07, -0.02], [0.0, 0.08]].map(([x, z], i) => <mesh key={"f" + i} position={[x, 0.185, z]}><sphereGeometry args={[0.028, 14, 10]} /><meshStandardMaterial color="#c0392b" roughness={0.3} /></mesh>)}
          <Cyl p={[0, 0.23, -0.06]} r={0.008} h={0.09} c="#9cc3e6" />
          <Flame p={[0, 0.29, -0.06]} k={1} r={0.014} h={0.04} t={tt} />
        </group>}
        <Sachi p={withHands(mezclar(PZ.stand, chairSit, sit), (q: any) => { q.manoI = { ...q.manoI, p: [0.55, -0.4, 0.45] }; q.manoD = { ...q.manoD, p: [-0.55, -0.4, 0.45] }; })} t={tt} x={0} z={-0.3} rotY={0} s={S} expr={ok > 0.5 ? "feliz" : "nervioso"} />
        <Box p={[0.32, 0.67 + gap / 2, -0.45]} s={[0.012, gap, 0.012]} c="#ffe08a" e="#ffd27a" ei={1.1} op={sv(tt, 1.2, 1.6)} />
        {[0, 1].map((k) => <Box key={k} p={[0.32, 0.67 + k * gap, -0.45]} s={[0.06, 0.008, 0.012]} c="#ffe08a" e="#ffd27a" ei={1.1} op={sv(tt, 1.2, 1.6)} />)}
        <mesh position={[0, 0.67 + gap, -0.5]}><sphereGeometry args={[0.022, 12, 10]} /><meshStandardMaterial color={ok > 0.5 ? GRN : RED} emissive={ok > 0.5 ? GRN : RED} emissiveIntensity={0.9} toneMapped={false} /></mesh>
        <Glow p={[0, 0.7, -0.5]} r={0.3} k={ok} c="#9be3a0" op={0.35} />
      </>; }} />;


// 6:51 · puntas de pie mientras hierve la pava: primer plano de la pava silbando (vapor fuerte) y de sus talones; bajo los talones un escalón de luz
// que se enciende con cada subida; seis subidas, seis luces
export const G_kettletoes: F = ({ t, h }) => { const st = it(h, 0, 1.8);
  return <Hero d={1.3} ly={0.15} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([1.2, 0.95, 1.7], [-0.05, 0.6, -0.4]), C([1.0, 0.95, 1.9], [-0.05, 0.6, -0.4]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.3] as V, spotK: 0.6, warm: 0.55 })}
    scene={(tt) => { const run = Math.max(0, tt - st), up = run > 0 ? 0.5 - 0.5 * Math.cos(run * Math.PI * 0.75) : 0, n = Math.min(6, Math.floor((run + 0.6) / 2.67) + (run > 0.6 ? 1 : 0));
      return <>
        <Wallp p={[0, 0, -0.95]} w={3.6} h={2.2} />
        <Counter p={[-0.1, 0, -0.62]} sink={false} />
        <Cyl p={[0.3, 0.885, -0.6]} r={0.13} h={0.01} c="#3b3f46" m={0.5} />
        <Kettle p={[0.3, 0.89, -0.6]} s={1.6} />
        <Steam p={[0.5, 1.22, -0.6]} t={tt} k={0.4 + 0.6 * cl(run / 3)} n={12} />
        <group position={[0, 0.06 * up, 0]}><Sachi p={handD(handI(PZ.stand, [0.42, -0.6, 0.45]), [-0.42, -0.6, 0.45])} t={tt} x={-0.25} z={-0.1} rotY={180} s={S} expr="feliz" /></group>
        <Box p={[-0.25, 0.062, 0.02]} s={[0.4, 0.02, 0.12]} c="#ffe08a" e="#ffd27a" ei={0.9 * up} op={0.25 + 0.6 * up} />
        <group position={[-0.25, 0.07, 0.25]}>{Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[(i - 2.5) * 0.08, 0, 0]}><sphereGeometry args={[0.026, 14, 10]} /><meshStandardMaterial color={i < n ? "#ffcf6a" : "#cfc6b6"} emissive="#ffb347" emissiveIntensity={i < n ? 0.9 : 0} toneMapped={i >= n} /></mesh>)}</group>
      </>; }} />; };


// 7:20 · «papas en las pantorrillas»: dos papas grandes con brotes vuelan desde la mesada y se derriten dentro de las pantorrillas (las pantorrillas quedan encendidas);
// bajo el talón aparece un almohadón de luz que se aplasta y rebota cuando da el paso
export const G_potatocalves: F = ({ t, h }) => { const pt = 5.0;
  return <Hero d={1.55} ly={0.45} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.95, 0.65, 1.5], [0, 0.42, -0.3]), C([0.65, 0.65, 1.6], [0, 0.42, -0.3]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.3] as V, spotK: 0.7, warm: 0.5 })}
    scene={(tt) => { const f1 = eio(tt, 1.0, 2.8), f2 = eio(tt, 1.8, 3.6), melt1 = sv(tt, 2.8, 3.6), melt2 = sv(tt, 3.6, 4.4), step = eio(tt, pt + 0.4, pt + 1.3), sq = phys(tt, pt + 1.3, 6, 0.4);
      const CF: V[] = [[-0.05, 0.3, -0.22], [-0.05, 0.3, -0.38]], FR: V[] = [[0.75, 0.95, -0.55], [0.85, 0.95, -0.4]];
      return <>
        <Wallp p={[0, 0, -1.0]} w={3.6} h={2.2} />
        <Counter p={[0.95, 0, -0.7]} w={0.9} sink={false} />
        <Sachi p={withHands(PZ.stand, (q: any) => { q.pieI = pie([0.12, 0.09 + 0.05 * Math.sin(Math.PI * step), 0.25 * step], 8, { polo: [0.2, 0, 1] }); })} t={tt} x={0} z={-0.3} rotY={90} s={S} expr="feliz" />
        {[0, 1].map((i) => { const f = i ? f2 : f1, m = i ? melt2 : melt1, a = FR[i], b = CF[i]; return m < 0.99 ? <group key={i} position={[lerp(a[0], b[0], f), lerp(a[1], b[1], f) + 0.3 * Math.sin(Math.PI * f), lerp(a[2], b[2], f)]} rotation={[0, 0, 6 * f]} scale={1.5 * (1 - 0.85 * m)}>
          <Potato p={[0, 0, 0]} s={1} glow={m} />{[0, 1, 2].map((j) => <mesh key={j} position={[0.06 * Math.cos(j * 2.1), 0.05, 0.06 * Math.sin(j * 2.1)]} rotation={[0, 0, 0.4 * Math.cos(j * 2.1)]}><cylinderGeometry args={[0.006, 0.01, 0.05, 6]} /><meshStandardMaterial color="#8fb84a" /></mesh>)}</group> : null; })}
        {CF.map((p, i) => <Glow key={i} p={p} r={0.08} k={(i ? melt2 : melt1) * (1 - 0.5 * sv(tt, pt + 2.0, pt + 3.0))} c="#ffb347" op={0.6} />)}
        <group position={[0.06 + 0.25 * step, 0.06, -0.38]} scale={[1, Math.max(0.35, 1 - 0.6 * Math.max(0, 1 - sq)), 1]}>
          <mesh scale={[1, 0.35, 1]}><sphereGeometry args={[0.1, 24, 14]} /><meshStandardMaterial color="#ffe6b0" emissive="#ffd27a" emissiveIntensity={0.7} transparent opacity={sv(tt, pt, pt + 0.4)} toneMapped={false} /></mesh></group>
      </>; }} />; };

// 7:58 · «la pared te dice la verdad»: ella de espaldas a la pared; donde toca la pared queda estampada una mancha de pintura, de a una: talones, cola, hombros, cabeza;
// una regla de luz vertical une las cuatro
export const G_walltruth: F = ({ t, h }) => { const hl = it(h, 0, 4.2);
  return <Hero d={1.45} ly={0.0} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([1.55, 1.0, 0.55], [0, 0.8, -0.7]), C([1.45, 1.05, 0.85], [0, 0.8, -0.7]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.6] as V, spotK: 0.6 })}
    scene={(tt) => { const hy = headOf(PZ.stand)[1], back = eio(tt, 0.6, 1.6), PTS = [0.05, 0.5, 0.8, 0.96], CS = ["#e2662f", "#c0392b", "#3f7fbf", "#7da23a"], aw = sv(tt, 4.6, 5.4);
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.6} h={2.2} />
        <Sachi p={PZ.stand} t={tt} x={0} z={lerp(-0.25, -0.72 + 0.1 * aw, back)} rotY={0} s={S} expr="neutral" />
        {PTS.map((y, i) => { const k = phys(tt, 1.7 + i * 0.55, 6, 0.4); return k > 0.01 ? <mesh key={i} position={[0.0, hy * y, -0.855]} scale={[Math.min(1.15, k) * (i === 1 ? 1.4 : 1), Math.min(1.15, k) * 0.8, 1]}><circleGeometry args={[0.07, 28]} /><meshStandardMaterial color={CS[i]} roughness={0.5} emissive={CS[i]} emissiveIntensity={0.25} /></mesh> : null; })}
        <Box p={[0.0, hy * 0.5, -0.85]} s={[0.012, hy * 0.92 * sv(tt, hl - 0.3, hl + 0.5), 0.006]} c="#ffe08a" e="#ffd27a" ei={1.2} op={sv(tt, hl - 0.3, hl)} />
      </>; }} />; };


// 8:40 · en el pasillo, al lado de las perchas: los abrigos con hombros, mangas y percha cuelgan torcidos y se mecen; ella, al lado, derechita;
// una plomada con pesa brillante baja por su espalda y queda quieta
export const G_coathooks: F = ({ t, h }) =>
  <Hero d={1.3} ly={0.0} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([-1.6, 1.15, 1.2], [0.1, 0.85, -0.65]), C([-1.75, 1.15, 0.9], [0.1, 0.85, -0.65]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.6] as V, spotK: 0.6 })}
    scene={(tt) => { const line = eio(tt, 1.4, 2.6), hy = headOf(PZ.stand)[1], bob = 0.02 * Math.sin(tt * 3) * (1 - sv(tt, 2.6, 3.4));
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.6} h={2.2} />
        <Box p={[0.55, 1.62, -0.84]} s={[0.95, 0.06, 0.05]} c="#7a4e2c" />
        {[0.22, 0.55, 0.88].map((x, i) => { const sw = 0.14 * Math.sin(tt * 1.4 + i * 1.7), C0 = ["#6b7a8f", "#a0523c", "#5d6b4a"][i]; return <group key={i} position={[x, 1.6, -0.76]}><Cyl p={[0, 0, 0.0]} r={0.012} h={0.08} c="#d9b25a" m={0.7} rot={[Math.PI / 2, 0, 0]} />
          <group rotation={[0, 0, sw + 0.12 * (i - 1)]}>
            <Cyl p={[0, -0.08, 0.04]} r={0.008} h={0.26} c="#7a4e2c" rot={[0, 0, Math.PI / 2]} />
            <Box p={[0, -0.12, 0.04]} s={[0.3, 0.06, 0.1]} c={C0} r={0.9} rad={0.03} />
            <Box p={[0, -0.42, 0.04]} s={[0.26, 0.56, 0.1]} c={C0} r={0.9} rad={0.04} />
            {[-1, 1].map((k) => <Box key={k} p={[k * 0.16, -0.36, 0.04]} s={[0.07, 0.46, 0.08]} c={C0} r={0.9} rad={0.03} rot={[0, 0, k * 0.12]} />)}
            {[0, 1, 2].map((j) => <mesh key={j} position={[0, -0.22 - j * 0.13, 0.095]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#d9b25a" metalness={0.7} /></mesh>)}
          </group></group>; })}
        <Sachi p={PZ.stand} t={tt} x={-0.45} z={-0.55} rotY={0} s={S} expr="feliz" />
        <Cord a={[-0.45, hy + 0.12, -0.76]} b={[-0.45 + bob, hy + 0.12 - (hy - 0.05) * line, -0.76]} w={0.006} c="#ffe08a" />
        <mesh position={[-0.45 + bob, hy + 0.08 - (hy - 0.05) * line, -0.76]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.035, 0.08, 18]} /><meshStandardMaterial color="#e2b23a" metalness={0.7} roughness={0.25} emissive="#ffb347" emissiveIntensity={0.8} toneMapped={false} /></mesh>
      </>; }} />;


// 9:39 · chinelas sin talón: cámara a ras del piso; la chinela sin talón (roja) se queda atrás, se da vuelta y se vuelca; la pantufla con talón (verde) va pegada al pie
export const G_slippers: F = ({ t, h }) => { const good = it(h, 0, 4.4);
  return <Hero d={1.15} ly={0.0} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.48, 0.26, 0.95], [0, 0.12, -0.2]), C([0.25, 0.26, 1.0], [0, 0.12, -0.2]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.3] as V, spotK: 0.7 })}
    scene={(tt) => { const a = eio(tt, 1.0, 1.8), b = eio(tt, good, good + 0.8), up = (k: number) => 0.14 * Math.sin(Math.PI * k);
      const X = 0, Z = -0.3;
      const zi = lerp(-0.02, 0.45, a), zd = lerp(-0.02, 0.45, b), slip = sv(tt, 1.3, 2.0), flip = sv(tt, 1.9, 2.5);
      const Slip: React.FC<{ c: string; back: boolean }> = ({ c, back }) => <group>
        <Box p={[0, 0.01, 0.03]} s={[0.08, 0.02, 0.16]} c={c} r={0.7} rad={0.008} />
        <Box p={[0, 0.035, 0.075]} s={[0.084, 0.04, 0.075]} c={c} r={0.9} rad={0.016} />
        {back && <Box p={[0, 0.04, -0.04]} s={[0.084, 0.06, 0.018]} c={c} r={0.9} rad={0.007} />}</group>;
      const pz = withHands(PZ.stand, (q: any) => { q.pieI = pie([0.2, 0.09 + up(a), zi], 0); q.pieD = pie([-0.2, 0.09 + up(b), zd], 0); });
      const t0 = toeOf(PZ.stand, "I", X, Z), tD = toeOf(pz, "D", X, Z);
      return <>
        <Sachi p={pz} t={tt} x={X} z={Z} rotY={0} s={S} expr={slip > 0.5 && tt < good ? "sorprendido" : "feliz"} />
        <group scale={1.9} position={[t0[0] + 0.05 * slip, 0.056 + 0.03 * Math.sin(Math.PI * flip), t0[2] - 0.08 - 0.06 * slip]} rotation={[0, 0.9 * slip, 2.6 * flip]}><Slip c="#c0392b" back={false} /></group>
        <group scale={1.9} position={[tD[0], tD[1] - 0.03, tD[2] - 0.08]}><Slip c="#3f8f4a" back /></group>
        <Glow p={[tD[0], 0.08, tD[2] - 0.05]} r={0.12} k={sv(tt, good + 0.8, good + 1.2)} c="#9be3a0" op={0.5} />
      </>; }} />; };


// 9:55 · de qué agarrarse: su mano se estira hacia cada cosa: la silla con rueditas se va, la puerta se abre, el toallero se dobla (rojo);
// la mesada y la mesa pesada se quedan firmes y se iluminan (verde) cuando la mano las toma
export const G_strongthings: F = ({ t, h }) => { const gd = it(h, 0, 5.0);
  return <Hero d={1.3} ly={0.1} t={t} h={h} mode="drop" cam={(tt) => { const x = lerp(-0.9, 0.7, eio(tt, 0.6, gd + 0.4)); return orbita(tt, C([x + 0.2, 1.3, 2.3], [x, 0.7, -0.5]), C([x - 0.1, 1.3, 2.3], [x, 0.7, -0.5]), 9); }}
    set={(tt: number) => ({ spot: [0, 0, -0.4] as V, spotK: 0.5 })}
    scene={(tt) => { const rc = eio(tt, 1.0, 1.9), dr = eio(tt, 2.0, 2.8), tb = sv(tt, 3.0, 3.6), ok = sv(tt, gd, gd + 0.6), sx = lerp(-0.95, 0.75, eio(tt, 0.6, gd + 0.4));
      const reach: V = tt < 1.9 ? [-1.25 - 0.4 * rc, 0.82, -0.4] : tt < 2.9 ? [-0.25, 1.0, -0.62] : tt < gd ? [0.25, 1.0, -0.78] : [0.95, 0.9, -0.5];
      return <>
        <Wallp p={[0, 0, -0.95]} w={4.6} h={2.2} />
        <group position={[-1.3 - 0.5 * rc, 0, -0.4]} rotation={[0, rc * 1.2, 0]}>
          <Box p={[0, 0.5, 0]} s={[0.42, 0.06, 0.42]} c="#3b3f46" /><Box p={[0, 0.78, -0.19]} s={[0.42, 0.5, 0.05]} c="#3b3f46" /><Cyl p={[0, 0.28, 0]} r={0.03} h={0.42} c="#9aa0a8" m={0.6} />
          {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[0.22 * Math.cos(i * 1.256), 0.06, 0.22 * Math.sin(i * 1.256)]}><sphereGeometry args={[0.035, 12, 10]} /><meshStandardMaterial color="#222" /></mesh>)}
        </group>
        <Door p={[-0.45, 0, -0.9]} open={0.7 * dr} />
        <group position={[0.25, 1.0, -0.88]}><Cyl p={[-0.2, 0, 0.05]} r={0.018} h={0.08} c="#c9ced4" m={0.8} rot={[Math.PI / 2, 0, 0]} /><Cyl p={[0.2, 0, 0.05]} r={0.018} h={0.08} c="#c9ced4" m={0.8} rot={[Math.PI / 2, 0, 0]} />
          <group position={[-0.2, 0, 0.09]} rotation={[0, 0, -0.45 * tb]}><Cyl p={[0.2, 0, 0]} r={0.016} h={0.42} c="#c9ced4" m={0.8} rot={[0, 0, Math.PI / 2]} /><Box p={[0.2, -0.12, 0]} s={[0.3, 0.22, 0.02]} c="#9cc3e6" r={1} /></group></group>
        <Counter p={[1.0, 0, -0.6]} w={0.8} sink={false} />
        <Glow p={[1.0, 0.9, -0.45]} r={0.35} k={ok} c="#9be3a0" op={0.35} />
        <Box p={[1.0, 0.905, -0.6]} s={[0.86, 0.012, 0.6]} c={GRN} e={GRN} ei={0.6 * ok} op={0.55 * ok} />
        <Table p={[0.45, 0, 0.35]} w={0.9} d={0.5} h={0.42} glow={ok} />
        <Sachi p={handI(PZ.stand, [lerp(0.4, 0.75, sv(tt, 0.6, 1.0)), lerp(-1.2, -0.45, sv(tt, 0.6, 1.0)), 0.35])} t={tt} x={sx} z={-0.15} rotY={reach[0] < sx ? -55 : 55} s={S} expr={ok > 0.5 ? "feliz" : "pensativo"} />
        {[[-1.3 - 0.5 * rc, rc], [-0.45, dr], [0.25, tb]].map(([x, k], i) => <mesh key={i} position={[x, 1.55, -0.6]}><sphereGeometry args={[0.04, 14, 10]} /><meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={0.9 * k * (1 - ok)} transparent opacity={k * (1 - ok)} toneMapped={false} /></mesh>)}
      </>; }} />; };


// 10:18 · sentada en el borde de la cama, cuenta lenta hasta 10: un ábaco de diez cuentas se va corriendo de a una; al lado, un termómetro de vidrio
// sube de los pies a la cabeza; recién con la décima cuenta se para
export const G_count10: F = ({ t, h }) =>
  <Hero d={1.25} ly={0.1} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.75, 1.0, 1.85], [0.15, 0.7, -0.5]), C([0.35, 1.0, 1.95], [0.15, 0.7, -0.5]), 9)}
    set={(tt: number) => ({ ...night, spot: [0, 0, -0.4] as V, spotK: 0.6 })}
    scene={(tt) => { const cnt = cl((tt - 0.9) / 4.0), n = Math.floor(cnt * 10 + 0.001), stand = eio(tt, 5.0, 5.8), hd = headOf(chairSit, 0, -0.35);
      return <>
        <Wallp p={[0, 0, -1.5]} w={3.6} h={2.2} c="#d8cfbf" />
        <Box p={[-0.1, 0.19, -0.95]} s={[2.0, 0.3, 1.0]} c="#a57a4e" r={0.7} />
        <Futon p={[-0.1, 0.34, -0.95]} quilt="#6b7fa8" />
        <Sachi p={mezclar(chairSit, PZ.stand, stand)} t={tt} x={-0.2} z={-0.4} rotY={0} s={S} expr="neutral" />
        <group position={[0.55, 0.0, -0.45]}>
          <Box p={[0, 0.25, 0]} s={[0.4, 0.5, 0.35]} c="#7a4e2c" r={0.6} />
          <group position={[0, 0.72, 0]}>
            {[-1, 1].map((k) => <Box key={k} p={[k * 0.31, 0, 0]} s={[0.03, 0.4, 0.04]} c="#6b4a2e" />)}
            {[0.17, -0.17].map((y, i) => <Box key={i} p={[0, y, 0]} s={[0.65, 0.03, 0.04]} c="#6b4a2e" />)}
            <Cyl p={[0, 0, 0]} r={0.006} h={0.6} c="#d9b25a" m={0.7} rot={[0, 0, Math.PI / 2]} />
            {Array.from({ length: 10 }, (_, i) => { const on = i < n, xp = on ? 0.27 - i * 0.045 : -0.27 + (9 - i) * 0.045; return <mesh key={i} position={[on ? -xp : xp, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 0.7, 1]}><sphereGeometry args={[0.024, 14, 10]} /><meshStandardMaterial color={on ? "#ffcf6a" : "#b8483a"} emissive="#ffb347" emissiveIntensity={on ? 0.7 : 0} /></mesh>; })}
          </group>
        </group>
        <group position={[-0.62, 0, -0.42]}>
          <Cyl p={[0, 0.7, 0]} r={0.035} h={1.2} c="#e6f0f5" op={0.35} m={0.2} rough={0.1} />
          <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.06, 18, 14]} /><meshStandardMaterial color="#c0392b" emissive="#c0392b" emissiveIntensity={0.5} /></mesh>
          <Cyl p={[0, 0.12 + 0.55 * cnt, 0]} r={0.016} h={0.04 + 1.1 * cnt} c="#c0392b" e="#c0392b" ei={0.5} />
          {Array.from({ length: 10 }, (_, i) => <Box key={i} p={[0.04, 0.22 + i * 0.11, 0]} s={[0.03, 0.006, 0.01]} c="#6b6b6b" />)}
        </group>
        <Glow p={[-0.2, hd[1], -0.4]} r={0.25} k={stand} c="#9be3a0" op={0.3} />
      </>; }} />;


// 9:40 · «primero los pies, después la cabeza»: la vincha roja marca hacia dónde mira; los pies giran en dos pasos dejando huellas grandes encendidas (1 y 2)
// y una flecha gruesa curva acompaña; recién al final la cabeza (vincha) alcanza al cuerpo
export const G_feetfirst: F = ({ t, h }) => { const T = useMemo(() => ({ n1: numTx(1, "#fff", "#e2662f"), n2: numTx(2, "#fff", "#e2662f") }), []);
  return <Hero d={1.55} ly={0.3} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.5, 1.95, 1.25], [0, 0.4, -0.25], 36), C([0.15, 1.95, 1.3], [0, 0.4, -0.25], 36), 10)}
    set={(tt: number) => ({ spot: [0, 0, -0.2] as V, spotK: 0.6 })}
    scene={(tt) => { const s1 = eio(tt, 0.9, 1.6), s2 = eio(tt, 2.0, 2.7), ry = 45 * s1 + 45 * s2, hy = eio(tt, 3.2, 4.2), hp = withHands(PZ.stand, (q: any) => { q.cabeza = { ...(q.cabeza || {}), y: ry * (1 - hy) }; }), hd = headOf(hp, 0, -0.2);
      const hr = (-ry + ry * (1 - hy)) * Math.PI / 180;
      const FP: React.FC<{ a: number; k: number; c: string }> = ({ a, k, c }) => <group rotation={[0, -a, 0]} position={[0, 0.059, -0.2]}>
        {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.13, 0, 0.36]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.12 * Math.min(1.1, k), 0.24 * Math.min(1.1, k), 1]}><circleGeometry args={[1, 28]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.9} transparent opacity={Math.min(1, k)} toneMapped={false} /></mesh>)}</group>;
      const arc = cl((tt - 0.9) / 1.8), N = 18;
      return <>
        <FP a={0} k={1} c="#9a7a5a" />
        <FP a={Math.PI / 4} k={phys(tt, 1.3, 6, 0.4)} c="#e2662f" />
        <FP a={Math.PI / 2} k={phys(tt, 2.4, 6, 0.4)} c="#e2662f" />
        <Plate p={[0.62, 0.08, 0.15]} s={0.3} map={T.n1} op={sv(tt, 1.3, 1.6)} />
        <Plate p={[0.55, 0.08, -0.7]} s={0.3} map={T.n2} op={sv(tt, 2.4, 2.7)} />
        <Sachi p={hp} t={tt} x={0} z={-0.2} rotY={-ry} s={S} expr="feliz" />
        <mesh position={[hd[0], hd[1] + 0.03, hd[2]]} rotation={[0, hr, 0]}><torusGeometry args={[0.105, 0.018, 10, 36]} /><meshStandardMaterial color="#d8342a" roughness={0.5} /></mesh>
        {Array.from({ length: N }, (_, i) => { const u = i / (N - 1); if (u > arc) return null; const a = -Math.PI / 2 * u; return <mesh key={i} position={[0.55 * Math.sin(a), 0.1, -0.2 + 0.55 * Math.cos(a)]}><sphereGeometry args={[0.035, 10, 8]} /><meshStandardMaterial color={GRN} emissive={GRN} emissiveIntensity={0.9} toneMapped={false} /></mesh>; })}
        {arc > 0.05 && <mesh position={[0.55 * Math.sin(-Math.PI / 2 * arc), 0.1, -0.2 + 0.55 * Math.cos(-Math.PI / 2 * arc)]} rotation={[0, -Math.PI / 2 * arc - Math.PI / 2, Math.PI / 2]}><coneGeometry args={[0.07, 0.14, 16]} /><meshStandardMaterial color={GRN} emissive={GRN} emissiveIntensity={0.9} toneMapped={false} /></mesh>}
      </>; }} />; };

// 11:22 · el cuello y los ojos, amigos: sentada junto a la ventana (silla y pies en cuadro), un farolito de papel cruza por DETRÁS de su hombro;
// la cabeza y el torso giran juntos siguiéndolo, con un hilo de luz de los ojos al farol, y vuelven
export const G_neckeyes: F = ({ t, h }) =>
  <Hero d={1.12} ly={0.0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.35, 1.0, 2.3], [0, 0.6, -0.5]), C([-0.2, 1.0, 2.35], [0, 0.6, -0.5]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.4] as V, spotK: 0.6 })}
    scene={(tt) => { const u = Math.sin(Math.min(1, cl((tt - 0.9) / 4.6)) * Math.PI), a = 70 * u, hd = headOf(chairSit, 0, -0.45);
      const ar = a * Math.PI / 180, lx = -0.55 * Math.sin(ar) + 0.45 * (1 - u), lz = -0.95, ly = hd[1] + 0.12;
      return <>
        <Wallp p={[0, 0, -1.25]} w={3.6} h={2.2} />
        <Win p={[0.75, 1.15, -1.2]} w={0.8} h={0.7} />
        <Cyl p={[-0.2, ly + 0.17, lz]} r={0.008} h={1.6} c="#7a4e2c" rot={[0, 0, Math.PI / 2]} />
        <Chair p={[0, 0, -0.55]} />
        <Sachi p={withHands(chairSit, (q: any) => { q.cabeza = { ...(q.cabeza || {}), y: 0.6 * a }; q.torso = { ...(q.torso || {}), y: 0.4 * a }; })} t={tt} x={0} z={-0.45} s={S} expr="feliz" />
        <group position={[lx, ly, lz]}>
          <Cyl p={[0, 0.12, 0]} r={0.004} h={0.1} c="#5a3820" />
          <mesh scale={[1, 1.25, 1]}><sphereGeometry args={[0.09, 20, 16]} /><meshStandardMaterial color="#ffd8a0" emissive="#ff9a3c" emissiveIntensity={1.1} toneMapped={false} /></mesh>
          {[-1, 1].map((k) => <Cyl key={k} p={[0, k * 0.11, 0]} r={0.05} h={0.015} c="#5a3820" />)}
        </group>
        <Glow p={[lx, ly, lz]} r={0.25} k={1} c="#ffb347" op={0.35} />
        <Cord a={[hd[0], hd[1] + 0.02, hd[2]]} b={[lx, ly, lz]} w={0.01} c="#ffd27a" />
      </>; }} />;

// 11:56 · la toalla doblada en cuatro: una toalla celeste gruesa baja flotando y se dobla en el aire, en dos y en cuatro, hasta ser un colchoncito alto;
// se apoya en el piso frente a la mesada; ella se sube; los tobillos tiemblan un poco y un aro de luz los rodea
export const G_towel: F = ({ t, h }) =>
  <Hero d={1.45} ly={0.3} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.95, 1.0, 2.2], [0, 0.6, -0.3]), C([0.6, 1.0, 2.3], [0, 0.6, -0.3]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.3] as V, spotK: 0.6 })}
    scene={(tt) => { const f1 = eio(tt, 0.6, 1.4), f2 = eio(tt, 1.5, 2.3), land = eio(tt, 2.3, 2.9), on = eio(tt, 3.1, 3.9), wob = 3 * Math.sin(tt * 5.0) * on, tz = 0.2;
      const w = lerp(0.8, 0.4, f2), d = lerp(0.6, 0.3, f1), hh = 0.035 * (1 + f1) * (1 + f2), ty = lerp(0.75, 0.058 + hh / 2, land);
      return <>
        <Wallp p={[0, 0, -1.0]} w={3.6} h={2.2} />
        <Counter p={[0, 0, -0.68]} sink={false} />
        <group position={[0, ty, tz]} rotation={[0.25 * (1 - land) * Math.sin(tt * 2), 0, 0]}>
          <Box p={[0, 0, 0]} s={[w, hh, d]} c="#8fc6e6" r={0.95} rad={Math.min(0.03, hh / 2.2)} />
          {[-1, 1].map((k) => <Box key={k} p={[k * (w / 2 - 0.05), 0, 0]} s={[0.035, hh + 0.004, d + 0.004]} c="#f4f1ea" r={0.95} />)}
        </group>
        {on > 0.01 ? <group position={[0, (hh - 0.01) * on, 0]} rotation={[0, 0, wob * Math.PI / 180]}><Sachi p={handD(handI(PZ.stand, [0.42, -0.62, 0.42]), [-0.42, -0.62, 0.42])} t={tt} x={0} z={lerp(0.45, tz - 0.05, on)} rotY={180} s={S} expr="feliz" /></group>
          : <Sachi p={PZ.stand} t={tt} x={0} z={0.45} rotY={180} s={S} expr="neutral" />}
        {[0.08, -0.08].map((x, i) => <mesh key={i} position={[x, hh + 0.14, tz - 0.05]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.01, 8, 28]} /><meshStandardMaterial color="#ffe08a" emissive="#ffd27a" emissiveIntensity={1.0} transparent opacity={sv(tt, 4.0, 4.5)} toneMapped={false} /></mesh>)}
      </>; }} />;

// 12:58 · el furoshiki: el paño cuadrado debajo de las verduras levanta sus cuatro puntas de a una y se ata en un moño; ella lo lleva ADELANTE con las dos manos
export const G_furoshiki: F = ({ t, h }) => { const fr = it(h, 0, 4.4);
  return <Hero d={1.2} ly={0.1} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.75, 1.35, 2.1], [0, 0.65, -0.25]), C([-0.6, 1.35, 2.1], [0, 0.65, -0.25]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.3] as V, spotK: 0.6, warm: 0.55 })}
    scene={(tt) => { const tie = eio(tt, 2.6, 3.4), lift = eio(tt, fr - 0.4, fr + 0.6), w = lerp(0.7, 0.16, tie);
      const by = lerp(0.53, 0.78, lift), bz = lerp(-0.1, 0.12, lift);
      return <>
        <Table p={[0, 0, -0.1]} w={1.0} d={0.7} h={0.45} />
        <group position={[0, by, bz]}>
          <Box p={[0, 0.1 * tie, 0]} s={[w, 0.02 + 0.2 * tie, w]} c="#5b86c4" r={0.9} rad={0.02 + 0.08 * tie} />
          {tie < 0.8 && [["#e2662f", -0.13, -0.1], ["#7da23a", 0.12, 0.06], ["#f2d04a", -0.02, 0.14], ["#7b3e78", 0.1, -0.12]].map(([c, x, z], i) => <Veg key={i} p={[(x as number) * (1 - tie), 0.08, (z as number) * (1 - tie)]} c={c as string} s={1.3} />)}
          {[0, 1, 2, 3].map((i) => { const a = i * Math.PI / 2 + Math.PI / 4, k = Math.max(eio(tt, 0.9 + i * 0.4, 1.4 + i * 0.4), tie), r = lerp(w * 0.62, 0.05, tie); return <group key={i} position={[Math.cos(a) * r, 0.02 + 0.25 * k, Math.sin(a) * r]} rotation={[0, -a, 0.9 * k]}><Box p={[0, 0, 0]} s={[0.16, 0.02, 0.16]} c="#5b86c4" r={0.9} /><Box p={[0.03, 0.012, 0]} s={[0.1, 0.004, 0.02]} c="#f3eee4" /></group>; })}
          {tie > 0.7 && <>{[-1, 1].map((k) => <mesh key={k} position={[k * 0.06, 0.3, 0]} scale={[1.4, 0.8, 0.8]}><sphereGeometry args={[0.045, 14, 10]} /><meshStandardMaterial color="#35609e" roughness={0.9} /></mesh>)}<mesh position={[0, 0.3, 0]}><sphereGeometry args={[0.03, 12, 10]} /><meshStandardMaterial color="#2c4f86" /></mesh></>}
        </group>
        <Sachi p={handD(handI(PZ.stand, [0.2, lerp(-1.27, -0.55, lift), lerp(0.05, 0.42, lift)]), [-0.2, lerp(-1.27, -0.55, lift), lerp(0.05, 0.42, lift)])} t={tt} x={0} z={-0.25} s={S} expr="feliz" />
      </>; }} />; };


// 13:46 · la cartera gigante en un hombro: una cartera enorme tira del hombro y el nivel grande apoyado sobre sus hombros se inclina; con una bolsa en cada mano
// se endereza y la burbuja vuelve al centro con un clic de luz
export const G_crookedshoulder: F = ({ t, h }) => { const hi = it(h, 0, 2.6);
  return <Hero d={1.25} ly={0.0} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.25, 1.25, 1.95], [0, 0.85, -0.3]), C([-0.25, 1.25, 1.95], [0, 0.85, -0.3]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.3] as V, spotK: 0.6 })}
    scene={(tt) => { const lean = sv(tt, 1.0, 1.8) * (1 - sv(tt, 5.0, 5.8)), fix = sv(tt, 5.0, 5.8), ang = -0.2 * lean, bd = bodyOf(PZ.stand, 0, -0.3), click = sv(tt, 5.8, 6.0) * (1 - sv(tt, 6.4, 7.0));
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.6} h={2.2} />
        <group rotation={[0, 0, ang * 0.5]}>
          <Sachi p={withHands(tiltBody(PZ.stand, 10 * lean), (q: any) => { q.manoD = { ...q.manoD, p: fix > 0.5 ? [-0.45, -1.2, 0.1] : [-0.3, -0.2, 0.15] }; q.manoI = { ...q.manoI, p: [0.45, -1.2, 0.1] }; })} t={tt} x={0} z={-0.3} s={S} expr={lean > 0.5 ? "triste" : "feliz"} />
          {lean > 0.02 && <><Box p={[-0.3, 0.55, -0.22]} s={[0.42, 0.44, 0.2]} c="#7a2e2a" r={0.45} rad={0.06} op={lean} />
            <Box p={[-0.3, 0.68, -0.115]} s={[0.3, 0.12, 0.01]} c="#5a1e1a" op={lean} /><mesh position={[-0.3, 0.64, -0.11]}><sphereGeometry args={[0.02, 10, 8]} /><meshStandardMaterial color="#d9b25a" metalness={0.8} /></mesh>
            <Cord a={[-0.12, bd.hom[1] - 0.02, -0.3]} b={[-0.3, 0.77, -0.22]} w={0.014} c="#5a1e1a" /></>}
        </group>
        <Level p={[0, bd.hom[1] + 0.06, -0.3]} ang={ang * (1 - fix)} s={1.9} />
        {fix > 0.02 && [-1, 1].map((k) => <group key={k} position={[k * 0.24, 0.2, -0.25]}><Box p={[0, 0, 0]} s={[0.22, 0.26, 0.14]} c="#e7d4ae" r={0.8} rad={0.03} op={fix} /><Veg p={[0.03, 0.15, 0]} c="#7da23a" s={0.9} long /></group>)}
        <Glow p={[0, bd.hom[1] + 0.05, -0.3]} r={0.22} k={click} c="#9be3a0" op={0.6} />
      </>; }} />; };


// 14:07 · nunca alfombras sueltas: ella pisa la alfombrita grande, la alfombrita patina con un surco, ella se tambalea con los brazos en molinete;
// la alfombrita sale volando, cae el tatami grueso con una nube de polvo y ella se para firme encima
export const G_looserug: F = ({ t, h }) => { const tm = it(h, 0, 4.0); const T = useCasaTex();
  return <Hero d={1.45} ly={0.3} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.95, 1.0, 2.2], [0, 0.6, -0.3]), C([-0.5, 1.0, 2.3], [0, 0.6, -0.3]), 9)}
    set={(tt: number) => ({ floor: "wood", spot: [0, 0, -0.3] as V, spotK: 0.6 })}
    scene={(tt) => { const sl = eio(tt, 1.3, 2.1), wb = sv(tt, 1.3, 1.8) * (1 - sv(tt, 4.0, 4.6)), wob = 9 * Math.sin(tt * 4.0) * wb, gone = eio(tt, tm - 0.9, tm - 0.1), tat = drop(tt, tm, 0.9), on = tat.on ? 1 - Math.min(1, tat.y / 0.9) : 0, dust = tat.on ? cl((tt - tm - 0.3) / 1.4) : 0, TH = 0.12;
      const wm = tt * 7;
      return <>
        <Wallp p={[0, 0, -1.0]} w={3.6} h={2.2} />
        {gone < 0.99 && <group position={[0.45 * sl + 0.7 * gone, 0.02 + 0.9 * Math.sin(Math.PI * gone), -0.3 - 0.6 * gone]} rotation={[0, 0.3 * sl + 2 * gone, 0.6 * gone]}>
          <Box p={[0, 0.02, 0]} s={[1.1, 0.025, 0.7]} c="#b8483a" r={1} rad={0.01} />
          {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => <Box key={i} p={[x, 0.034, 0]} s={[0.06, 0.004, 0.66]} c="#7d2a22" r={1} />)}</group>}
        {sl > 0.05 && gone < 0.5 && <Box p={[0.25 * sl - 0.1, 0.02, -0.3]} s={[0.5 * sl, 0.004, 0.03]} c="#4a2e18" op={0.7} />}
        {tat.on && <Box p={[0, TH / 2 + 0.005 + tat.y, -0.3]} s={[1.0, TH, 0.6]} c="#d8cf9a" map={(T as any).tatami} r={0.9} />}
        {tat.on && [-1, 1].map((k) => <Box key={k} p={[0, TH + 0.008 + tat.y, -0.3 + k * 0.27]} s={[1.02, 0.012, 0.06]} c="#2e3d63" />)}
        {dust > 0.01 && dust < 0.99 && Array.from({ length: 26 }, (_, i) => { const a = i * 0.24; return <mesh key={i} position={[0.7 * Math.cos(a) * (0.5 + dust), 0.08 + 0.25 * dust * ((i % 4) + 1) / 4, -0.3 + 0.45 * Math.sin(a) * (0.5 + dust)]} scale={1 + 1.6 * dust}><sphereGeometry args={[0.04, 10, 8]} /><meshStandardMaterial color="#e6dcc6" transparent opacity={0.75 * (1 - dust)} /></mesh>; })}
        <group position={[0.14 * sl * (1 - gone), (TH + 0.01) * on, -0.3]} rotation={[0, 0, wob * Math.PI / 180]}>
          <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.55 + 0.25 * Math.cos(wm) * wb, -0.6 + (0.75 + 0.35 * Math.sin(wm)) * wb, 0.1] }; q.manoD = { ...q.manoD, p: [-0.55 - 0.25 * Math.cos(wm + 1.6) * wb, -0.6 + (0.75 + 0.35 * Math.sin(wm + 1.6)) * wb, 0.1] }; })} t={tt} s={S} expr={wb > 0.1 ? "sorprendido" : "feliz"} />
        </group>
      </>; }} />; };

// 14:39 · todo entre la cintura y los ojos: ella al lado del estante; una franja de luz barre de su cintura a sus ojos; las cosas de todos los días bajan
// de a una a la franja; la caja de una vez al mes sube arriba
export const G_waisteyes: F = ({ t, h }) => { const hi = it(h, 0, 5.2);
  return <Hero d={1.2} ly={0.0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.45, 1.25, 2.05], [0.15, 1.0, -0.55]), C([-0.2, 1.25, 2.1], [0.15, 1.0, -0.55]), 9)}
    set={(tt: number) => ({ spot: [0.3, 0, -0.6] as V, spotK: 0.6 })}
    scene={(tt) => { const hy = headOf(PZ.stand)[1], y0 = 0.55 * hy, y1 = 0.92 * hy, band = eio(tt, 0.7, 1.5), m1 = eio(tt, 1.7, 2.5), m2 = eio(tt, 2.5, 3.3), m3 = eio(tt, 3.3, 4.1), m4 = eio(tt, hi, hi + 0.9);
      const SH = [0.3, 0.75, 1.15, 1.6, 2.0];
      return <>
        <Wallp p={[0, 0, -0.95]} w={3.6} h={2.4} />
        {SH.map((y, i) => <Box key={i} p={[0.45, y, -0.78]} s={[0.9, 0.03, 0.3]} c="#a57a4e" r={0.6} />)}
        {[0.0, 0.9].map((x, i) => <Box key={i} p={[x, 1.1, -0.78]} s={[0.03, 2.2, 0.3]} c="#8a5a34" />)}
        <Box p={[0.15, (y0 + y1) / 2, -0.6]} s={[1.6, (y1 - y0) * band, 0.02]} c="#ffe08a" e="#ffd27a" ei={0.7} op={0.28 * band} />
        {[y0, y1].map((y, i) => <Box key={i} p={[0.15, y, -0.59]} s={[1.6 * band, 0.008, 0.01]} c="#ffe08a" e="#ffd27a" ei={1.2} op={band} />)}
        <Cyl p={[0.2, lerp(SH[0] + 0.06, SH[1] + 0.06, m1), -0.74]} r={0.06} h={0.12} c="#f3eee4" />
        <Box p={[0.45, lerp(SH[4] + 0.1, SH[2] + 0.1, m2), -0.74]} s={[0.18, 0.2, 0.12]} c="#e7d4ae" r={0.9} />
        <group position={[0.72, lerp(SH[0] + 0.02, SH[2] + 0.02, m3), -0.74]}><Kettle p={[0, 0, 0]} s={0.75} /></group>
        <Box p={[0.62, lerp(SH[1] + 0.07, SH[4] + 0.07, m4), -0.72]} s={[0.22, 0.12, 0.16]} c="#6b7a8f" r={0.5} />
        <Sachi p={handI(PZ.stand, [lerp(0.4, 0.75, sv(tt, 1.6, 2.0)), lerp(-1.2, -0.4, sv(tt, 1.6, 2.0)), 0.3])} t={tt} x={-0.35} z={-0.5} rotY={25} s={S} expr="feliz" />
      </>; }} />; };


// 14:57 · la lucecita del pasillo: pasillo a oscuras; sobre una mesita, una lámpara de aceite grande de los 50 se encoge y se transforma en la lucecita enchufada de hoy;
// un charco tibio de luz bien saturado se estira hasta la puerta del baño y ella camina por él
export const G_nightlight: F = ({ t, h }) => { const ol = 2.6;
  return <Hero d={1.25} ly={0.15} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.45, 1.3, 2.9], [0.2, 0.5, -0.5]), C([-0.1, 1.3, 2.95], [0.2, 0.5, -0.5]), 9)}
    set={(tt: number) => ({ bg: "#2e3140", warm: 0.2, spot: [0, 0, -0.4] as V, spotK: 0.25 })}
    scene={(tt) => { const lamp = sv(tt, 0.5, 1.1), mor = sv(tt, ol - 0.2, ol + 0.6), path = eio(tt, ol + 0.4, ol + 1.6), walk = eio(tt, ol + 1.0, 7.8), tx = -0.6, wall = -0.9;
      const pfx = tx + 0.1, len = 1.95 - pfx;
      return <>
        <Wallp p={[0, 0, -1.0]} w={4.4} h={2.2} c="#5d5f6e" />
        <Door p={[1.55, 0, -0.95]} c="#6b5a48" open={0.3 * path} />
        <Table p={[tx, 0, -0.72]} w={0.45} d={0.35} h={0.55} />
        <group position={[tx, 0.57, -0.72]}>
          {mor < 0.99 && <group scale={2.2 * (1 - mor)}><Cyl p={[0, 0.06, 0]} r={0.07} r2={0.09} h={0.1} c="#9a7a3a" m={0.5} /><Cyl p={[0, 0.15, 0]} r={0.045} h={0.12} c="#e6f0f5" op={0.4} /><Flame p={[0, 0.16, 0]} k={lamp} r={0.025} h={0.07} t={tt} /></group>}
        </group>
        {mor > 0.01 && <group position={[pfx, 0.32, wall + 0.06]} scale={1.6 * mor}><Box p={[0, 0, 0]} s={[0.1, 0.13, 0.04]} c="#f3eee4" /><Box p={[0, 0, 0.025]} s={[0.07, 0.09, 0.01]} c="#ffe8b0" e="#ffcf6a" ei={1.8} /></group>}
        <Glow p={[tx, 0.85, -0.7]} r={0.2} k={lamp * (1 - mor)} c="#ffb347" op={0.25} />
        <Glow p={[pfx, 0.32, wall + 0.14]} r={0.2} k={mor} c="#ffcf8a" op={0.3} />
        <Box p={[pfx + (len * path) / 2, 0.059, -0.45]} s={[0.2 + len * path, 0.004, 0.5]} c="#ffb84d" e="#ff9a2a" ei={1.1} op={0.85 * Math.max(lamp * 0.3, path)} rad={0.05} />
        <Sachi p={withHands(PZ.stand, (q: any) => { const s = Math.sin(tt * Math.PI * 1.6) * (walk > 0.01 && walk < 0.99 ? 1 : 0); q.pieI = pie([0.12, 0.09 + 0.05 * Math.max(0, s), 0.08], 0); q.pieD = pie([-0.12, 0.09 + 0.05 * Math.max(0, -s), -0.08], 0); })} t={tt} x={lerp(-1.1, 1.35, walk)} z={-0.4} rotY={90} s={S} expr="feliz" />
      </>; }} />; };

// 15:34 · el andador es una herramienta: un martillo baja del tablero de herramientas y se convierte en el andador, que rueda hasta ella con su sombra;
// ella se apoya y hace las puntas de pie
export const G_walkertool: F = ({ t, h }) => { const tp = it(h, 0, 3.6);
  return <Hero d={1.25} ly={0.1} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.65, 1.2, 2.0], [0.05, 0.75, -0.45]), C([-0.3, 1.2, 2.1], [0.05, 0.75, -0.45]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.4] as V, spotK: 0.6 })}
    scene={(tt) => { const hm = eio(tt, 0.5, 1.3), mo = sv(tt, 1.2, 1.6), wk = eio(tt, 1.5, 2.6), up = tt > tp ? 0.5 - 0.5 * Math.cos((tt - tp) * Math.PI * 0.8) : 0, wx = lerp(1.1, 0.0, wk);
      return <>
        <Box p={[0.1, 1.2, -0.92]} s={[2.2, 1.1, 0.04]} c="#c9a87a" r={0.8} />
        {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[-0.9 + (i % 10) * 0.22, 0.75 + Math.floor(i / 10) * 0.28, -0.895]}><sphereGeometry args={[0.012, 6, 4]} /><meshStandardMaterial color="#6b4a2e" /></mesh>)}
        {[[-0.7, 1.4, 0.4, "#6b4a2e"], [-0.35, 1.3, 0.3, "#3b3f46"], [0.35, 1.42, 0.45, "#b8483a"]].map(([x, y, l, c], i) => <group key={i} position={[x as number, y as number, -0.88]}><Box p={[0, 0, 0]} s={[0.05, l as number, 0.03]} c={c as string} /><Box p={[0, (l as number) / 2, 0]} s={[0.16, 0.06, 0.04]} c="#9aa0a8" m={0.6} /></group>)}
        {mo < 0.99 && <group position={[lerp(0.75, 0.9, hm), lerp(1.35, 0.6, hm), lerp(-0.88, -0.4, hm)]} rotation={[0, 0, hm * 1.4]} scale={1 - mo}><Box p={[0, 0, 0]} s={[0.05, 0.42, 0.04]} c="#8a5a34" /><Box p={[0, 0.22, 0]} s={[0.2, 0.08, 0.06]} c="#9aa0a8" m={0.7} /></group>}
        {mo > 0.01 && <group position={[wx, 0, -0.2]} scale={mo}>
          <mesh position={[0, 0.058, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.45]} /><meshBasicMaterial color="#000" transparent opacity={0.18} depthWrite={false} /></mesh>
          {[[-0.22, -0.15], [0.22, -0.15], [-0.22, 0.15], [0.22, 0.15]].map(([x, z], i) => <Cyl key={i} p={[x, 0.44, z]} r={0.017} h={0.84} c="#c9ced4" m={0.8} rough={0.2} />)}
          {[-0.22, 0.22].map((x, i) => <Cyl key={i} p={[x, 0.86, 0]} r={0.024} h={0.34} c="#3b3f46" rot={[Math.PI / 2, 0, 0]} />)}
          <Cyl p={[0, 0.86, 0.15]} r={0.016} h={0.44} c="#c9ced4" m={0.8} rot={[0, 0, Math.PI / 2]} />
          {[-0.22, 0.22].map((x, i) => <Cyl key={i} p={[x, 0.05, 0.15]} r={0.045} h={0.03} c="#222" rot={[0, 0, Math.PI / 2]} />)}
          <group position={[0.24, 0.72, -0.12]} rotation={[0, 0, 0.1]}><Box p={[0, 0, 0]} s={[0.035, 0.28, 0.03]} c="#8a5a34" /><Box p={[0, 0.15, 0]} s={[0.14, 0.05, 0.05]} c="#9aa0a8" m={0.7} /></group>
        </group>}
        <group position={[0, 0.06 * up, 0]}><Sachi p={handD(handI(PZ.stand, [0.48, -0.58, 0.42]), [-0.48, -0.58, 0.42])} t={tt} x={0} z={-0.6} rotY={0} s={S} expr="feliz" /></group>
        <Box p={[0, 0.062, -0.6]} s={[0.36, 0.01, 0.16]} c="#ffe08a" e="#ffd27a" ei={0.9 * up} op={0.5 * up} />
      </>; }} />; };


// 16:22 · «nada se inclinó»: la misma cocina del principio; en primer plano un nivel enorme con la burbuja verde encendida clavada en el centro y la línea del horizonte quieta;
// detrás ella gira con los pies primero, se estira a la alacena, se agacha, y nada se mueve
export const G_nothingtilted: F = ({ t, h }) =>
  <Hero d={1.15} ly={0.15} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.3, 1.05, 2.3], [0.05, 0.8, -0.4]), C([0.1, 1.05, 2.35], [0.05, 0.8, -0.4]), 8)}
    set={(tt: number) => ({ spot: [0, 0, -0.3] as V, spotK: 0.5, warm: 0.6 })}
    scene={(tt) => { const turn = eio(tt, 0.8, 2.2), reach = eio(tt, 2.6, 3.4) * (1 - eio(tt, 4.0, 4.6)), bend = eio(tt, 4.6, 5.4) * (1 - eio(tt, 6.2, 7.0)), pulse = 0.5 + 0.5 * Math.sin(tt * 3);
      return <group position={[0, 0, -0.3]}>
        <Wallp p={[0, 0, -0.6]} w={3.6} h={2.2} />
        <Box p={[0, 1.2, -0.55]} s={[3.4, 0.02, 0.01]} c="#ffe08a" e="#ffd27a" ei={1.4} />
        <Counter p={[-0.35, 0, -0.25]} />
        <Box p={[-0.35, 1.45, -0.42]} s={[1.3, 0.45, 0.3]} c="#c9a87a" r={0.7} />
        {[-0.75, -0.6].map((x, i) => <Cyl key={i} p={[x, 0.95, -0.15]} r={0.045} r2={0.04} h={0.1} c={i ? "#9bb06a" : "#f3eee4"} />)}
        <Box p={[0.42, 0.93, -0.15]} s={[0.2, 0.08, 0.14]} c="#c0392b" r={0.35} rad={0.02} />
        <Sachi p={withHands(mezclar(PZ.stand, chairSit, 0.45 * bend), (q: any) => { const s = Math.sin(turn * Math.PI * 2); q.pieI = pie([0.18, 0.09 + 0.05 * Math.max(0, s), 0], 12); q.pieD = pie([-0.18, 0.09 + 0.05 * Math.max(0, -s), 0], -12); q.cabeza = { ...(q.cabeza || {}), y: 30 * (eio(tt, 1.4, 2.4) - turn), x: -15 * reach + 20 * bend }; if (reach > 0.01) q.manoI = { ...q.manoI, p: [lerp(0.42, 0.25, reach), lerp(-1.27, 0.55, reach), lerp(0.05, 0.25, reach)] }; })} t={tt} x={0.2} z={0.15} rotY={lerp(-160, 20, turn) - 50 * reach} s={S} expr="feliz" />
        <group position={[0.05, 0.85, 1.1]}>
          <Level p={[0, 0, 0]} ang={0} s={3.2} />
          <mesh position={[0, 0.0, 0.135]}><sphereGeometry args={[0.05, 16, 12]} /><meshStandardMaterial color="#b8f5a0" emissive={GRN} emissiveIntensity={1.4 + 0.4 * pulse} toneMapped={false} /></mesh>
          <Glow p={[0, 0.0, 0.16]} r={0.07} k={1} c={GRN} op={0.35} />
        </group>
      </group>; }} />;

// 17:09 · la fila del banco: postes con cordón, gente esperando; ella pasa el peso de un pie al otro, adelante y atrás, bien visible,
// igual que el arbolito que se mece al lado al mismo compás; los demás se mecen a destiempo
export const G_bankline: F = ({ t, h }) =>
  <Hero d={1.6} ly={0.1} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.6, 1.15, 2.1], [0.2, 0.75, -0.3]), C([0.35, 1.15, 2.2], [0.2, 0.75, -0.3]), 9)}
    set={(tt: number) => ({ spot: [0.2, 0, -0.3] as V, spotK: 0.6 })}
    scene={(tt) => { const sw = Math.sin(tt * 1.3), fb = Math.sin(tt * 0.9 + 1);
      return <>
        <Wallp p={[0, 0, -1.0]} w={4.0} h={2.2} />
        {[-1.2, -0.4, 0.4, 1.2].map((x, i) => <Cyl key={i} p={[x, 0.45, 0.25]} r={0.025} h={0.9} c="#d9b25a" m={0.7} rough={0.3} />)}
        {[[-1.2, -0.4], [-0.4, 0.4], [0.4, 1.2]].map(([a, b], i) => <Cord key={i} a={[a, 0.85, 0.25]} b={[b, 0.85, 0.25]} w={0.018} c="#8e2f24" />)}
        {[-1.45, -0.8, 0.75].map((x, i) => <group key={i} rotation={[0, 0, 0.05 * Math.sin(tt * 1.1 + i * 2.1)]} position={[x, 0, -0.2]}><Sachi p={PZ.stand} t={tt + i} rotY={-90} s={S * (0.95 + 0.05 * i)} color="#8f99a6" expr="neutral" /></group>)}
        <group position={[0, 0, -0.2]} rotation={[0.07 * fb, 0, 0.09 * sw]}><Sachi p={withHands(PZ.stand, (q: any) => { q.pieD = pie([-0.2, 0.09 + 0.08 * Math.max(0, sw), -0.02], -12); q.pieI = pie([0.2, 0.09 + 0.08 * Math.max(0, -sw), 0.02], 12); })} t={tt} rotY={-90} s={S} expr="feliz" /></group>
        <mesh position={[0, 0.058, -0.2]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.18, 0.2, 40]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.6} /></mesh>
        <mesh position={[0.06 * sw, 0.06, -0.2 + 0.05 * fb]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.04, 20]} /><meshBasicMaterial color="#ffb347" /></mesh>
        <group position={[1.45, 0, -0.55]} rotation={[0.07 * fb, 0, 0.09 * sw]}><Cyl p={[0, 0.25, 0]} r={0.12} r2={0.1} h={0.3} c="#b8483a" /><Cyl p={[0, 0.55, 0]} r={0.03} h={0.6} c="#6b4a2e" /><mesh position={[0, 1.05, 0]}><sphereGeometry args={[0.32, 20, 14]} /><meshStandardMaterial color="#6f9a4a" roughness={0.8} /></mesh></group>
      </>; }} />;


// 17:46 · dónde se espera: alrededor de ella suben del piso cuatro pedestales, de a uno: el carrito del súper, el buzón, la parada del colectivo y el microondas;
// un reloj de pared marca la espera
export const G_waitplaces: F = ({ t, h }) => { const bus = it(h, 0, 2.6), mic = it(h, 1, 4.4); const B = useMemo(() => lab("BUS", "#2e5d9e", "#fff", 200, 110, 70), []);
  return <Hero d={1.3} ly={0.15} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.35, 1.35, 2.5], [0, 0.6, -0.45]), C([-0.35, 1.35, 2.5], [0, 0.6, -0.45]), 9)}
    set={(tt: number) => ({ spot: [0, 0, -0.3] as V, spotK: 0.6 })}
    scene={(tt) => { const rise = (at: number) => { const s = phys(tt, at, 6, 0.45); return { on: s > 0.01, y: -0.9 * (1 - Math.min(1, s)) }; };
      const a = rise(0.6), b = rise(1.4), c = rise(bus), d = rise(mic), sw = Math.sin(tt * 1.3);
      return <>
        <Wallp p={[0, 0, -1.25]} w={4.0} h={2.4} />
        <group position={[0, 1.65, -1.2]}><Cyl p={[0, 0, 0]} r={0.16} h={0.03} c="#f6f1e7" rot={[Math.PI / 2, 0, 0]} /><Cyl p={[0, 0, -0.005]} r={0.18} h={0.03} c="#3b3f46" rot={[Math.PI / 2, 0, 0]} />
          <group rotation={[0, 0, -tt * 1.2]}><Box p={[0, 0.06, 0.02]} s={[0.012, 0.12, 0.01]} c="#2b2b2e" /></group><group rotation={[0, 0, -tt * 0.1]}><Box p={[0, 0.04, 0.025]} s={[0.016, 0.08, 0.01]} c="#2b2b2e" /></group></group>
        {a.on && <group position={[-1.1, a.y, -0.45]}><Cyl p={[0, 0.02, 0]} r={0.32} h={0.04} c="#d8c7a2" />
          <Box p={[0, 0.42, 0]} s={[0.42, 0.28, 0.3]} c="#c9ced4" m={0.6} op={0.85} /><Box p={[0, 0.27, 0]} s={[0.4, 0.02, 0.28]} c="#9aa0a8" m={0.7} /><Cyl p={[0.24, 0.62, 0]} r={0.015} h={0.32} c="#c0392b" rot={[Math.PI / 2, 0, 0]} />
          {[[-0.16, -0.12], [0.16, -0.12], [-0.16, 0.12], [0.16, 0.12]].map(([x, z], i) => <Cyl key={i} p={[x, 0.08, z]} r={0.035} h={0.025} c="#222" rot={[0, 0, Math.PI / 2]} />)}
          {[["#e2662f", -0.08], ["#7da23a", 0.08]].map(([cc, x], i) => <Veg key={i} p={[x as number, 0.58, 0]} c={cc as string} s={1.1} />)}</group>}
        {b.on && <group position={[-0.42, b.y, -0.75]}><Cyl p={[0, 0.02, 0]} r={0.3} h={0.04} c="#d8c7a2" /><Cyl p={[0, 0.42, 0]} r={0.15} h={0.78} c="#c0392b" rough={0.4} /><mesh position={[0, 0.82, 0]}><sphereGeometry args={[0.15, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#c0392b" roughness={0.4} /></mesh><Box p={[0, 0.65, 0.14]} s={[0.16, 0.03, 0.02]} c="#222" /></group>}
        {c.on && <group position={[0.42, c.y, -0.75]}><Cyl p={[0, 0.02, 0]} r={0.3} h={0.04} c="#d8c7a2" /><Cyl p={[0, 0.6, 0]} r={0.02} h={1.2} c="#9aa0a8" m={0.6} /><Sign p={[0, 1.12, 0.02]} w={0.32} h={0.18} map={B} glow={0.2} /><Box p={[0.15, 0.25, 0.0]} s={[0.4, 0.04, 0.16]} c="#7a4e2c" /></group>}
        {d.on && <group position={[1.1, d.y, -0.45]}><Cyl p={[0, 0.02, 0]} r={0.32} h={0.04} c="#d8c7a2" /><Box p={[0, 0.25, 0]} s={[0.3, 0.42, 0.3]} c="#7a4e2c" /><Box p={[0, 0.6, 0]} s={[0.46, 0.28, 0.32]} c="#efe8db" r={0.5} /><Box p={[-0.05, 0.6, 0.165]} s={[0.26, 0.18, 0.01]} c="#ffd27a" e="#ffb347" ei={0.6} /><Box p={[0.17, 0.6, 0.165]} s={[0.06, 0.18, 0.01]} c="#3b3f46" /></group>}
        <Sachi p={withHands(PZ.stand, (q: any) => { q.raiz = [q.raiz[0] + 0.03 * sw, q.raiz[1], q.raiz[2]]; q.pieD = pie([-0.2, 0.09 + 0.05 * Math.max(0, sw), -0.02], -12); })} t={tt} x={0} z={0.15} s={S} expr="feliz" />
      </>; }} />; };


// 18:20 · sus 10 minutos del día: un sol grande hace su arco del amanecer a la noche sobre un caminito de piedras; en cada parada se prende
// un farolito saturado (la pileta, la pava, la silla, la pared) y ella va de una a otra
export const G_daypath: F = ({ t, h }) =>
  <Hero d={1.45} ly={0.3} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 1.6, 2.6], [0, 0.45, -0.5]), C([-0.3, 1.6, 2.6], [0, 0.45, -0.5]), 10)}
    set={(tt: number) => ({ spot: [0, 0, -0.4] as V, spotK: 0.5, warm: 0.6 })}
    scene={(tt) => { const pr = eio(tt, 0.8, 6.0), P5 = (u: number): V => [lerp(-1.25, 1.25, u), 0.065, -0.35 - 0.45 * Math.sin(Math.PI * u)];
      const ST = [0.12, 0.38, 0.64, 0.9], sa = Math.PI * (1 - pr), sun: V = [1.6 * Math.cos(sa), 0.55 + 1.0 * Math.sin(sa), -1.3];
      const skyK = Math.sin(Math.PI * pr);
      return <>
        <Wallp p={[0, 0, -1.45]} w={4.4} h={2.6} c={skyK > 0.5 ? "#f2dfb8" : "#d9c9b0"} />
        <mesh position={sun}><sphereGeometry args={[0.2, 28, 20]} /><meshStandardMaterial color={pr < 0.85 ? "#ffcf6a" : "#e6ecf5"} emissive={pr < 0.85 ? "#ffb347" : "#c9d6ea"} emissiveIntensity={0.9} toneMapped={false} /></mesh>
        <Glow p={sun} r={0.45} k={1} c="#ffcf6a" op={0.25} />
        {Array.from({ length: 16 }, (_, i) => { const u = i / 15, p = P5(u); return <Cyl key={i} p={p} r={0.075} h={0.03} c={u <= pr ? "#e9c88a" : "#a99f8e"} rough={0.7} />; })}
        {ST.map((u, i) => { const p = P5(u), on = phys(pr * 10, u * 10 - 0.2, 5, 0.4); return <group key={i} position={[p[0], 0, p[2] - 0.25]}>
          {i === 0 && <Box p={[0, 0.25, 0]} s={[0.28, 0.5, 0.2]} c="#5a4a3a" />}
          {i === 1 && <><Box p={[0, 0.2, 0]} s={[0.3, 0.4, 0.22]} c="#5a4a3a" /><Kettle p={[0, 0.4, 0]} s={0.8} /></>}
          {i === 2 && <Chair p={[0, 0, 0]} c="#5a3820" />}
          {i === 3 && <Box p={[0, 0.45, -0.05]} s={[0.42, 0.9, 0.05]} c="#4a4a52" />}
          {on > 0.01 && <group position={[0.2, 0.75, 0.1]} scale={Math.min(1.15, on)}><Cyl p={[0, 0.14, 0]} r={0.004} h={0.12} c="#5a3820" /><mesh scale={[1, 1.25, 1]}><sphereGeometry args={[0.07, 18, 14]} /><meshStandardMaterial color="#ff8a3c" emissive="#ff6a1c" emissiveIntensity={1.2} toneMapped={false} /></mesh></group>}
          <Glow p={[0.2, 0.75, 0.1]} r={0.25} k={Math.min(1, on)} c="#ff9a3c" op={0.4} /></group>; })}
        <Sachi p={withHands(PZ.stand, (q: any) => { const s = Math.sin(tt * Math.PI * 1.6); q.pieI = pie([0.12, 0.09 + 0.04 * Math.max(0, s), 0.08], 0); q.pieD = pie([-0.12, 0.09 + 0.04 * Math.max(0, -s), -0.08], 0); })} t={tt} x={P5(pr)[0]} z={P5(pr)[2] + 0.12} rotY={90 - 60 * Math.cos(Math.PI * pr)} s={S} expr="feliz" />
      </>; }} />;

// CUADRO 0 · la miniatura rehecha en código (sin texto ni flecha): vereda de Osaka en otoño, cámara baja; ella en un pie,
// riendo, con delantal a cuadros; a la derecha la cerca de madera con el bastón apoyado, sin usar; hojas en el piso mojado
export const G_cuadro0: F = ({ t, h }) =>
  <Hero d={1.0} ly={0.0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([-0.35, 0.22, 2.3], [0.15, 0.72, -0.6], 44), C([-0.45, 0.22, 2.3], [0.15, 0.72, -0.6], 44), 12)}
    set={(tt: number) => ({ floor: "none", wall: false, bg: "#c9ccd0", warm: 0.45, spot: [0, 0, -0.3] as V, spotK: 0.5 })}
    scene={(tt) => <>
      <Box p={[0, 0.005, -3]} s={[14, 0.01, 12]} c="#5d6066" r={0.25} m={0.15} />
      <group position={[0.95, 0, -1.9]} rotation={[0, -0.12, 0]}>
        <Box p={[0, 0.12, -1.6]} s={[0.12, 0.24, 6.6]} c="#8f8a80" r={0.9} />
        {Array.from({ length: 31 }, (_, i) => <Box key={i} p={[0, 1.05, -4.8 + i * 0.21]} s={[0.05, 1.7, 0.2]} c={i % 3 ? "#5e4a38" : "#6b5440"} r={0.85} />)}
        <group position={[-0.1, 0, 1.2]} rotation={[0, 0, -0.12]}><Cyl p={[0, 0.45, 0]} r={0.014} h={0.9} c="#c9ced4" m={0.8} rough={0.2} /><Box p={[0, 0.91, 0.06]} s={[0.03, 0.03, 0.14]} c="#2a2a2e" r={0.4} /><Cyl p={[0, 0.02, 0]} r={0.022} h={0.04} c="#222" /></group>
      </group>
      {[[-1.4, -3.2], [-2.2, -4.2], [-0.4, -4.8]].map(([x, z], i) => <group key={i} position={[x, 0, z]}><Cyl p={[0, 0.5, 0]} r={0.04} h={1.0} c="#5a3e2a" /><mesh position={[0, 1.15, 0]}><sphereGeometry args={[0.42, 20, 14]} /><meshStandardMaterial color={["#c9732e", "#d99a3a", "#b8483a"][i]} roughness={0.9} /></mesh></group>)}
      {Array.from({ length: 40 }, (_, i) => <Box key={i} p={[-1.2 + ((i * 37) % 100) / 40, 0.012, -1.4 + ((i * 53) % 100) / 45]} s={[0.07, 0.004, 0.05]} c={["#c9732e", "#d99a3a", "#9a5a2a", "#b8483a"][i % 4]} rot={[0, i * 0.7, 0]} />)}
      <Sachi p={withHands(oneLeg(0.9), (q: any) => { q.manoI = { ...q.manoI, p: [0.5, -0.3, 0.25] }; q.manoD = { ...q.manoD, p: [-0.45, -0.55, 0.3] }; q.pieD = pie([-0.16, 0.32, 0.28], -12, { polo: [-0.2, 0, 1], pitch: 30 }); })} t={1.0} x={0} z={-0.25} rotY={-8} s={S} expr="carcajada" />
    </>} />;
