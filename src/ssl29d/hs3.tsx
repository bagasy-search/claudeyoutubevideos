// ssl29d · secar la ropa SIN SECADORA en invierno: componentes únicos en 3D. Cada uno = UNA idea con un objeto que se entiende sin leer,
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
const Glow: React.FC<{ p: V; r: number; k: number; c?: string; op?: number }> = ({ p, r, k, c = "#ff9a3c", op = 0.3 }) =>
  <pointLight position={p} color={c} intensity={1.6 * op * cl(k)} distance={r * 5} decay={2} />;
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
const Wallp: React.FC<{ p: V; w: number; h: number; c?: string }> = ({ p, w, h, c = "#e8dcc4" }) => <group>
  <Box p={[p[0], p[1] + h / 2, p[2]]} s={[w, h, 0.08]} c={c} r={0.95} />
  <Box p={[p[0], p[1] + 0.3, p[2] + 0.045]} s={[w, 0.6, 0.02]} c="#a8825a" r={0.7} />
  {Array.from({ length: Math.floor(w / 0.16) }, (_, i) => <Box key={i} p={[p[0] - w / 2 + 0.08 + i * 0.16, p[1] + 0.3, p[2] + 0.057]} s={[0.006, 0.58, 0.004]} c="#8a6642" cast={false} />)}
  <Box p={[p[0], p[1] + 0.62, p[2] + 0.06]} s={[w, 0.04, 0.04]} c="#7a5634" />
  <Box p={[p[0], p[1] + h - 0.05, p[2] + 0.05]} s={[w, 0.06, 0.03]} c="#d6c7a8" />
</group>;
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

// ---------------- piezas del lavadero (ssl29d) ----------------
const pinC = "#c9a06a";
// broche de madera
const Pin: React.FC<{ p: V; rotZ?: number }> = ({ p, rotZ = 0 }) => <Box p={p} s={[0.02, 0.075, 0.024]} c={pinC} r={0.7} rad={0.006} rot={[0, 0, rotZ]} />;
// percha: gancho de alambre + hombros
const Hanger: React.FC<{ p: V; w?: number; c?: string }> = ({ p, w = 0.38, c = "#e9e4da" }) => <group position={p}>
  <mesh position={[0, 0.075, 0]}><torusGeometry args={[0.032, 0.006, 8, 18, Math.PI * 1.25]} /><meshStandardMaterial color="#9aa0a8" metalness={0.7} roughness={0.3} /></mesh>
  <Cyl p={[0, 0.03, 0]} r={0.006} h={0.06} c="#9aa0a8" m={0.7} />
  {[-1, 1].map((k) => <Box key={k} p={[k * w / 4, -0.01, 0]} s={[w / 2 + 0.03, 0.018, 0.018]} c={c} rot={[0, 0, -k * 0.32]} />)}
</group>;
// camisa colgada de su percha (wr = arrugas 0-1, len = cuánto la estira el peso)
const Shirt: React.FC<{ p: V; c: string; wr?: number; rotY?: number; rotZ?: number; s?: number; hang?: boolean; len?: number; sl?: number }> = ({ p, c, wr = 0, rotY = 0, rotZ = 0, s = 1, hang = true, len = 1, sl = 0 }) =>
  <group position={p} rotation={[0, rotY, rotZ]} scale={s}>
    {hang && <Hanger p={[0, 0.02, 0]} />}
    <Box p={[0, -0.25 * len, 0]} s={[0.36, 0.48 * len, 0.045]} c={c} r={0.92} rad={0.02} />
    {[-1, 1].map((k) => <Box key={k} p={[k * 0.235, -0.15 - 0.05 * sl, 0]} s={[0.11, 0.27 + 0.1 * sl, 0.042]} c={c} r={0.92} rot={[0, 0, k * (0.42 - 0.3 * sl)]} rad={0.02} />)}
    <Box p={[0, -0.015, 0.025]} s={[0.15, 0.05, 0.012]} c="#f7f4ee" />
    <Box p={[0, -0.26 * len, 0.025]} s={[0.012, 0.44 * len, 0.004]} c="#00000030" />
    {wr > 0.02 && [[-0.1, -0.18, 0.5], [0.08, -0.3, -0.6], [-0.05, -0.38, 0.9], [0.11, -0.12, -1.0], [-0.12, -0.42, -0.3]].map(([x, y, r], i) => <Box key={"w" + i} p={[x, y * len, 0.026]} s={[0.16 * wr, 0.012, 0.004]} c="#00000055" rot={[0, 0, r]} />)}
  </group>;
// toalla/paño colgado de una cuerda: panel de adelante largo, de atrás corto, franja abajo; sway = vaivén del viento
const Cloth: React.FC<{ p: V; w: number; h: number; c: string; band?: string; sway?: number; puff?: number; wet?: number }> = ({ p, w, h, c, band = "#ffffff", sway = 0, puff = 0, wet = 0 }) =>
  <group position={p} rotation={[sway, 0, 0]}>
    <Box p={[0, -h / 2, 0.012 + puff * 0.02]} s={[w, h, 0.016 + puff * 0.05]} c={c} r={0.98} rad={0.008 + puff * 0.02} />
    <Box p={[0, -h * 0.3, -0.012 - puff * 0.02]} s={[w, h * 0.6, 0.016 + puff * 0.05]} c={c} r={0.98} rad={0.008 + puff * 0.02} />
    <Box p={[0, -h + 0.06, 0.022 + puff * 0.045]} s={[w, 0.03, 0.004]} c={band} />
    {wet > 0.02 && <Box p={[0, -h * 0.62, 0.024 + puff * 0.045]} s={[w * 0.98, h * 0.7, 0.004]} c="#3d6f9a" op={0.35 * wet} />}
    <Pin p={[-w / 2 + 0.05, 0.0, 0.02]} /><Pin p={[w / 2 - 0.05, 0.0, 0.02]} />
  </group>;
// media colgada de un broche
const HSock: React.FC<{ p: V; c: string; rotZ?: number; s?: number }> = ({ p, c, rotZ = 0, s = 1 }) => <group position={p} rotation={[0, 0, rotZ]} scale={s}>
  <Pin p={[0, 0.02, 0.012]} />
  <Box p={[0, -0.1, 0]} s={[0.065, 0.2, 0.032]} c={c} r={0.95} rad={0.012} />
  <Box p={[0.03, -0.215, 0]} s={[0.12, 0.055, 0.032]} c={c} r={0.95} rad={0.018} />
  <Box p={[0, 0.005, 0]} s={[0.067, 0.025, 0.034]} c="#ffffff" />
</group>;
// jean colgado de la cintura, cabeza abajo; pk = bolsillos afuera (0-1); inv = del revés
const Jeans: React.FC<{ p: V; inv?: number; pk?: number; s?: number; rotZ?: number }> = ({ p, inv = 0, pk = 0, s = 1, rotZ = 0 }) => { const c = inv > 0.5 ? "#9db2c9" : "#3d5a80";
  return <group position={p} scale={s} rotation={[0, 0, rotZ]}>
    <Box p={[0, -0.03, 0]} s={[0.36, 0.06, 0.06]} c={inv > 0.5 ? "#c9d3de" : "#2f4866"} />
    {[-1, 1].map((k) => <Box key={k} p={[k * 0.09, -0.42, 0]} s={[0.16, 0.74, 0.05]} c={c} r={0.9} rad={0.015} />)}
    {[-1, 1].map((k) => <Box key={"s" + k} p={[k * 0.17, -0.42, 0.027]} s={[0.006, 0.7, 0.004]} c="#e0a64a" />)}
    {pk > 0.02 && [-1, 1].map((k) => <Box key={"p" + k} p={[k * 0.15, -0.12 + 0.12 * pk, 0.06 + 0.07 * pk]} s={[0.17, 0.3 * pk + 0.01, 0.02]} c="#fbf8f1" r={0.95} rad={0.008} rot={[-0.9 * pk, 0, k * 0.2]} />)}
    {pk > 0.02 && [-1, 1].map((k) => <Box key={"r" + k} p={[k * 0.15, -0.13, 0.04 + 0.02 * pk]} s={[0.18, 0.035, 0.03]} c="#2f4866" r={0.9} rad={0.01} />)}
    {pk > 0.02 && [-1, 1].map((k) => <Box key={"c" + k} p={[k * 0.15, -0.13, 0.057 + 0.02 * pk]} s={[0.16, 0.005, 0.003]} c="#e0a64a" />)}
    <Pin p={[-0.15, 0.01, 0.03]} /><Pin p={[0.15, 0.01, 0.03]} />
  </group>; };
// palo horizontal (barral, caña) a lo largo de x
const Rod: React.FC<{ p: V; w: number; r?: number; c?: string; m?: number }> = ({ p, w, r = 0.018, c = "#c9ced4", m = 0.7 }) => <Cyl p={p} r={r} h={w} c={c} m={m} rough={0.3} rot={[0, 0, Math.PI / 2]} />;
// lavarropas de carga frontal: ang = giro del tambor, door = puerta abierta 0-1, fill = cuánta ropa adentro
const DRUM = ["#c0392b", "#f2c14e", "#3d5a80", "#7a8f6a", "#e7d4ae", "#b8483a", "#9db2c9"];
const Washer: React.FC<{ p: V; ang?: number; door?: number; fill?: number; c?: string; glow?: number; light?: number; dryer?: boolean }> = ({ p, ang = 0, door = 0, fill = 0.6, c = "#f3f2ee", glow = 0, light = 0, dryer }) =>
  <group position={p}>
    <Box p={[0, 0.43, 0]} s={[0.62, 0.86, 0.6]} c={c} r={0.35} rad={0.05} e="#ffd27a" ei={0.25 * glow} />
    <Box p={[0, 0.79, 0.302]} s={[0.58, 0.1, 0.01]} c={dryer ? "#5d6470" : "#d9dde2"} />
    <Cyl p={[0.2, 0.79, 0.31]} r={0.035} h={0.02} c="#b9bec6" m={0.6} rot={[Math.PI / 2, 0, 0]} />
    <mesh position={[-0.18, 0.79, 0.309]}><circleGeometry args={[0.014, 16]} /><meshBasicMaterial color={light > 0.5 ? "#7dff8a" : "#55606a"} toneMapped={false} /></mesh>
    <group position={[0, 0.4, 0.302]}>
      <mesh position={[0, 0, -0.005]}><circleGeometry args={[0.2, 40]} /><meshStandardMaterial color="#20262c" /></mesh>
      <group rotation={[0, 0, ang]}>{Array.from({ length: Math.round(3 + 6 * fill) }, (_, i) => { const a = i * 2.4, r = 0.05 + 0.1 * ((i * 37) % 10) / 10; return <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r - 0.06 * (1 - fill), 0]} scale={[1.2, 0.8, 0.4]}><sphereGeometry args={[0.055 + 0.03 * fill, 12, 10]} /><meshStandardMaterial color={DRUM[i % DRUM.length]} roughness={0.95} /></mesh>; })}</group>
      <group position={[-0.2, 0, 0.02]} rotation={[0, -door * 1.9, 0]}>
        <mesh position={[0.2, 0, 0.012]}><torusGeometry args={[0.2, 0.03, 12, 40]} /><meshStandardMaterial color="#d6dbe1" metalness={0.75} roughness={0.25} /></mesh>
        <mesh position={[0.2, 0, 0.015]}><circleGeometry args={[0.18, 40]} /><meshStandardMaterial color="#a8c4d6" transparent opacity={0.35} roughness={0.05} /></mesh>
      </group>
    </group>
  </group>;
// canasto de mimbre con ropa
const Basket: React.FC<{ p: V; full?: number }> = ({ p, full = 1 }) => <group position={p}>
  <Cyl p={[0, 0.12, 0]} r={0.26} r2={0.21} h={0.24} c="#b98a52" rough={0.9} />
  <mesh position={[0, 0.245, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.26, 0.018, 8, 32]} /><meshStandardMaterial color="#8a6236" /></mesh>
  {full > 0.05 && [0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[Math.cos(i * 1.3) * 0.12, 0.2 + 0.06 * full, Math.sin(i * 1.3) * 0.12]} scale={[1, 0.6, 1]}><sphereGeometry args={[0.1 * Math.max(0.3, full), 14, 10]} /><meshStandardMaterial color={DRUM[i]} roughness={0.95} /></mesh>)}
</group>;
// gotas que caen desde un punto
const Drops: React.FC<{ a: V; t: number; k: number; n?: number; len?: number; w?: number; c?: string }> = ({ a, t, k, n = 6, len = 0.5, w = 0.3, c = "#6fa8d6" }) => k < 0.02 ? null :
  <>{Array.from({ length: n }, (_, i) => { const u = (t * 1.3 + i * 0.37) % 1; return <mesh key={i} position={[a[0] + ((i * 0.618) % 1 - 0.5) * w, a[1] - u * u * len, a[2]]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.014, 10, 8]} /><meshStandardMaterial color={c} transparent opacity={0.9 * cl(k) * (1 - u)} roughness={0.1} /></mesh>; })}</>;
// olor agrio: rulos verdes que suben
const Stink: React.FC<{ p: V; t: number; k: number; n?: number }> = ({ p, t, k, n = 6 }) => k < 0.02 ? null :
  <group position={p}>{Array.from({ length: n }, (_, i) => { const u = (t * 0.4 + i / n) % 1; return <mesh key={i} position={[0.08 * Math.sin(u * 8 + i * 2), u * 0.55, 0.05 * Math.cos(u * 7 + i)]}><torusGeometry args={[0.03 + 0.03 * u, 0.008, 6, 16]} /><meshBasicMaterial color="#8fbf3a" transparent opacity={0.8 * cl(k) * Math.sin(Math.PI * u)} toneMapped={false} /></mesh>; })}</group>;
// sol de invierno (bola cálida con halo)
const Sun: React.FC<{ p: V; r?: number; k?: number; c?: string }> = ({ p, r = 0.22, k = 1, c = "#ffcf6a" }) => <group position={p}>
  <mesh><sphereGeometry args={[r, 32, 20]} /><meshBasicMaterial color={c} toneMapped={false} /></mesh>
  <Glow p={[0, 0, 0]} r={r * 1.9} k={k} c={c} op={0.3} />
</group>;
// haz de sol que entra por la ventana
const Beam: React.FC<{ p: V; s: V; rot: V; k: number; c?: string }> = () => null;
// extractor de baño en la pared: rejilla + aspas que giran
const Fan: React.FC<{ p: V; ang: number; on?: number }> = ({ p, ang, on = 0 }) => <group position={p}>
  <Box p={[0, 0, 0]} s={[0.36, 0.36, 0.05]} c="#eef0f2" r={0.4} rad={0.02} />
  <mesh position={[0, 0, 0.028]}><circleGeometry args={[0.15, 32]} /><meshStandardMaterial color="#3a4048" /></mesh>
  <group position={[0, 0, 0.034]} rotation={[0, 0, ang]}>{[0, 1, 2, 3].map((i) => <Box key={i} p={[Math.cos(i * Math.PI / 2) * 0.07, Math.sin(i * Math.PI / 2) * 0.07, 0]} s={[0.12, 0.04, 0.006]} c="#dfe3e8" rot={[0, 0, i * Math.PI / 2]} />)}</group>
  <mesh position={[0.13, -0.13, 0.03]}><circleGeometry args={[0.012, 12]} /><meshBasicMaterial color={on > 0.5 ? "#7dff8a" : "#55606a"} toneMapped={false} /></mesh>
</group>;
// bañera
const Tub: React.FC<{ p: V }> = ({ p }) => <group position={p}>
  <Box p={[0, 0.25, 0]} s={[1.5, 0.5, 0.7]} c="#f6f6f3" r={0.25} rad={0.08} />
  <Box p={[0, 0.47, 0]} s={[1.36, 0.06, 0.56]} c="#dfe7ea" r={0.2} />
</group>;
// azulejos (pared de baño)
const Tiles: React.FC<{ p: V; w: number; h: number; c?: string }> = ({ p, w, h, c = "#dfe9ec" }) => <group position={p}>
  <Box p={[0, h / 2, 0]} s={[w, h, 0.06]} c={c} r={0.3} />
  {Array.from({ length: Math.floor(w / 0.25) }, (_, i) => <Box key={"v" + i} p={[-w / 2 + (i + 1) * 0.25, h / 2, 0.032]} s={[0.008, h, 0.004]} c="#b9c6cb" />)}
  {Array.from({ length: Math.floor(h / 0.25) }, (_, i) => <Box key={"h" + i} p={[0, (i + 1) * 0.25, 0.032]} s={[w, 0.008, 0.004]} c="#b9c6cb" />)}
</group>;
// tendedero de pie (dos patas en A y 3 barrales)
const Rack: React.FC<{ p: V; w?: number; h?: number }> = ({ p, w = 1.0, h = 1.05 }) => <group position={p}>
  {[-1, 1].map((k) => <group key={k} position={[k * w / 2, 0, 0]}>{[-1, 1].map((j) => <Cyl key={j} p={[0, h / 2, j * 0.12]} r={0.012} h={h} c="#c9ced4" m={0.7} rot={[j * 0.24, 0, 0]} />)}</group>)}
  {[h, h - 0.02].map((y, i) => <Rod key={i} p={[0, y, i ? 0.1 : -0.1]} w={w} r={0.012} />)}
</group>;
// estufa eléctrica a cuarzo
const Heater: React.FC<{ p: V; k: number }> = ({ p, k }) => <group position={p}>
  <Box p={[0, 0.32, 0]} s={[0.36, 0.6, 0.18]} c="#3a3f46" r={0.4} rad={0.03} />
  {[0, 1, 2].map((i) => <Cyl key={i} p={[0, 0.2 + i * 0.13, 0.08]} r={0.022} h={0.28} c="#ff8a3c" e="#ff5a1c" ei={1.6 * k} rot={[0, 0, Math.PI / 2]} />)}
  <Glow p={[0, 0.33, 0.15]} r={0.35} k={k} c="#ff7a2c" op={0.3} />
</group>;
// monedas apiladas
const Coins: React.FC<{ p: V; n: number; c?: string }> = ({ p, n, c = "#e2b23a" }) => <group position={p}>{Array.from({ length: Math.max(0, Math.round(n)) }, (_, i) => <Cyl key={i} p={[0.004 * Math.sin(i * 2), 0.018 + i * 0.036, 0.004 * Math.cos(i * 3)]} r={0.1} h={0.03} c={c} m={0.8} rough={0.3} />)}</group>;
// barra de una hoja de cuaderno (dibujo de tinta)
const Bar: React.FC<{ p: V; w: number; k: number; c: string }> = ({ p, w, k, c }) => k < 0.02 ? null : <Box p={[p[0] + w * k / 2, p[1], p[2]]} s={[w * k, 0.006, 0.05]} c={c} r={0.9} />;
// sábana colgada en U invertida (sobre respaldos o una puerta)
const Sheet: React.FC<{ p: V; w: number; gap: number; h: number; c?: string; k?: number }> = ({ p, w, gap, h, c = "#f1eee6", k = 1 }) => <group position={p}>
  <Box p={[0, 0, 0]} s={[w, 0.02, gap]} c={c} r={0.98} />
  {[-1, 1].map((j) => <Box key={j} p={[0, -h * k / 2, j * gap / 2]} s={[w, h * k, 0.02]} c={c} r={0.98} />)}
</group>;
// viento/aire que pasa: flechas finitas celestes
const Wind: React.FC<{ a: V; b: V; t: number; k: number; n?: number }> = ({ a, b, t, k, n = 12 }) => <Flow a={a} b={b} t={t} k={k} c="#bfe3ff" n={n} r={0.018} speed={0.45} />;

// rótulos chiquitos dentro de la escena (perilla, cuaderno, botella)
const useLab = () => useMemo(() => ({ low: lab("LOW", "#55606a", "#ffffff", 256, 110, 70), high: lab("HIGH", "#c0392b", "#ffffff", 256, 110, 70),
  sun: lab("☀", "", "#c9a24e", 160, 100, 80), snow: lab("❄", "", "#3d5a80", 160, 100, 80), hang: lab("✿", "", "#5aa05a", 160, 100, 80), vin: lab("VINEGAR", "#ffffff", "#2a2420", 256, 220, 52) }), []);

// ================= componentes de ssl29d =================
const LAU = { floor: "wood" as const, warm: 0.5 };

// 0:03 · la secadora gira hace una hora y escupe la factura: un papel larguísimo le sale por arriba y se enrolla en el piso; pelusa que sale por la ventilación
export const G_tumble: F = ({ t, h }) =>
  <Hero d={1.15} ly={0.3} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.9, 1.2, 2.5], [0, 0.6, -0.3]), C([0.25, 1.2, 2.65], [0, 0.6, -0.3]), 9)}
    set={(tt: number) => ({ ...LAU, spot: [-0.2, 0, -0.3] as V, spotK: 0.6 })}
    scene={(tt) => { const up = eio(tt, 0.6, 2.0), dn = eio(tt, 2.0, 3.6), coil = eio(tt, 3.4, 7.0), inn = eio(tt, 4.4, 5.4), H1 = 0.05 + 0.3 * up;
      return <>
        <Wallp p={[0, 0, -0.75]} w={3.6} h={2.2} />
        <Washer p={[-0.3, Math.sin(tt * 30) * 0.003, -0.35]} ang={tt * 7} dryer c="#ecebe6" fill={0.8} glow={0.4} light={1} />
        {[0, 1, 2, 3, 4].map((i) => { const u = ((tt * 0.5 + i * 0.2) % 1); return <mesh key={i} position={[-0.66 - 0.35 * u, 0.25 + 0.15 * u + 0.05 * Math.sin(u * 9 + i), -0.4 + 0.1 * Math.sin(i)]} scale={0.6 + 1.2 * u}><sphereGeometry args={[0.035, 12, 10]} /><meshStandardMaterial color="#d8d2c6" roughness={1} transparent opacity={0.9 * Math.sin(Math.PI * u)} /></mesh>; })}
        <group position={[-0.3, 0.87, -0.2]}>
          <Box p={[0, 0.0, 0]} s={[0.36, 0.012, 0.03]} c="#2b2f36" />
          <Box p={[0, H1 / 2, 0.01]} s={[0.3, H1, 0.006]} c="#fbf7ee" r={0.9} />
          {dn > 0.01 && <Box p={[0, H1 + 0.003, 0.01 + 0.25 * dn]} s={[0.3, 0.006, 0.5 * dn]} c="#fbf7ee" r={0.9} />}
          {dn > 0.01 && <Box p={[0, H1 - 0.6 * dn, 0.51 * dn + 0.01]} s={[0.3, 1.2 * dn, 0.006]} c="#fbf7ee" r={0.9} />}
          {[0.08, 0.16, 0.24, 0.32].map((y, i) => y < H1 && <Box key={i} p={[0, y, 0.015]} s={[0.2, 0.016, 0.002]} c={i % 2 ? "#c0392b" : "#8a8a8a"} />)}
          {dn > 0.3 && [0.1, 0.25, 0.4, 0.55].map((y, i) => <Box key={"f" + i} p={[0, H1 - y * dn * 1.6, 0.51 * dn + 0.015]} s={[0.2, 0.016, 0.002]} c={i % 2 ? "#c0392b" : "#8a8a8a"} />)}
        </group>
        {coil > 0.01 && <group position={[-0.3, 0, 0.38]}>{Array.from({ length: Math.ceil(7 * coil) }, (_, i) => <mesh key={i} position={[0, 0.1 + 0.01 * i, 0.06 * i]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.07 + 0.012 * i, 0.012, 8, 28]} /><meshStandardMaterial color="#fbf7ee" roughness={0.9} /></mesh>)}<Box p={[0, 0.01, 0.25 * coil]} s={[0.3, 0.008, 0.5 * coil + 0.01]} c="#fbf7ee" r={0.9} /></group>}
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.3, 0.3 * inn, 0.5] }; q.cabeza = { ...(q.cabeza || {}), x: 20 * inn }; })} t={tt} x={lerp(1.5, 0.65, inn)} z={0.0} rotY={-40} s={S} expr={inn > 0.6 ? "sorprendido" : "neutral"} />
      </>; }} />;

// 0:40 · nunca prendió la secadora: el enchufe sale del tomacorriente, una funda de tela le cae encima y una maceta se posa arriba; ella le da dos palmaditas
export const G_nodryer: F = ({ t, h }) =>
  <Hero d={1.01} ly={0.1} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.75, 1.15, 2.4], [-0.1, 0.6, -0.35]), C([-0.1, 1.2, 2.5], [-0.1, 0.6, -0.35]), 8)}
    set={(tt: number) => ({ ...LAU, spot: [-0.2, 0, -0.3] as V, spotK: 0.6 })}
    scene={(tt) => { const un = eio(tt, 0.8, 1.6), cv = drop(tt, 2.4, 0.7), pl = drop(tt, 4.0, 0.6), pat = tt > 5.2 ? Math.abs(Math.sin((tt - 5.2) * 6)) * (tt < 6.6 ? 1 : 0) : 0;
      return <>
        <Wallp p={[0, 0, -0.75]} w={3.6} h={2.2} />
        <Washer p={[-0.25, 0, -0.35]} ang={0} dryer fill={0} c="#ecebe6" />
        <Box p={[0.3, 0.42, -0.7]} s={[0.2, 0.28, 0.03]} c="#f3f2ee" r={0.4} rad={0.02} />
        {[-1, 1].map((k) => <mesh key={k} position={[0.3 + k * 0.04, 0.42, -0.684]}><boxGeometry args={[0.012, 0.04, 0.002]} /><meshBasicMaterial color="#222" /></mesh>)}
        <Cord a={[-0.02, 0.15, -0.6]} b={[0.3 - 0.22 * un, 0.42 - 0.38 * un, -0.64 + 0.3 * un]} w={0.016} c="#2b2f36" />
        <Box p={[0.3 - 0.22 * un, 0.42 - 0.38 * un, -0.64 + 0.3 * un]} s={[0.09, 0.09, 0.1]} c="#2b2f36" r={0.5} rad={0.015} rot={[0, 0, 1.2 * un]} />
        {cv.on && <group position={[-0.25, 0.88 + cv.y, -0.35]}><Box p={[0, 0, 0]} s={[0.66, 0.02, 0.64]} c="#8e6a4a" r={0.95} /><Box p={[0, -0.12, 0.32]} s={[0.66, 0.24, 0.02]} c="#8e6a4a" r={0.95} /><Box p={[0, -0.07, 0.334]} s={[0.66, 0.03, 0.004]} c="#e7d4ae" /></group>}
        {pl.on && <group position={[-0.32, 0.9 + pl.y, -0.4]}><Cyl p={[0, 0.08, 0]} r={0.09} r2={0.07} h={0.16} c="#b5523b" /><mesh position={[0, 0.25, 0]}><sphereGeometry args={[0.13, 18, 14]} /><meshStandardMaterial color="#5f8a4a" roughness={0.8} /></mesh><mesh position={[0.08, 0.34, 0.03]}><sphereGeometry args={[0.07, 14, 10]} /><meshStandardMaterial color="#6e9a55" roughness={0.8} /></mesh></group>}
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-0.45, -0.05 + 0.08 * pat, 0.55] }; })} t={tt} x={0.45} z={-0.05} rotY={-55} s={S} expr={tt > 4.6 ? "carcajada" : "feliz"} />
      </>; }} />;

// 1:13 · la misma casa, la misma calle: dos casitas iguales; sobre la del vecino la pila de monedas sube a 12, sobre la de ella frena en 5 y se pone verde
export const G_halfbill: F = ({ t, h }) =>
  <Hero d={0.97} ly={0.2} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.45, 1.3, 2.9], [0, 0.75, -0.4]), C([-0.35, 1.3, 2.9], [0, 0.75, -0.4]), 9)}
    set={(tt: number) => ({ floor: "wood" as const, warm: 0.55, spot: [0, 0, -0.4] as V, spotK: 0.5 })}
    scene={(tt) => { const g = eio(tt, 1.2, 5.0), a = 1 + 11 * g, b = Math.min(5, 1 + 11 * g), ok = sv(tt, 4.6, 5.4);
      return <>
        <Wallp p={[0, 0, -1.2]} w={4.4} h={2.4} c="#dfe8ee" />
        <House p={[-0.6, 0, -0.55]} s={0.85} />
        <House p={[0.6, 0, -0.55]} s={0.85} glow={0.3 * ok} />
        <Coins p={[-0.6, 0.0, -0.02]} n={a} c="#c9a24e" />
        <Coins p={[0.6, 0.0, -0.02]} n={b} c={ok > 0.5 ? "#9be37a" : "#e2b23a"} />
        <Glow p={[0.6, 0.12, -0.02]} r={0.22} k={ok} c={GRN} op={0.35} />
        <Box p={[0, 0.005, 0.2]} s={[3.2, 0.01, 0.5]} c="#9a9a96" r={0.9} />
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.45, -0.1 + 0.7 * ok, 0.35] }; })} t={tt} x={1.1} z={0.1} rotY={-30} s={S * 0.85} expr={ok > 0.5 ? "carcajada" : "feliz"} />
      </>; }} />;

// 1:48 · secar adentro le pone agua al aire: una nube celeste se junta sobre la ropa colgada; ella abre la ventana y la nube sale volando
export const G_breathe: F = ({ t, h }) =>
  <Hero d={1.0} ly={0.15} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.6, 1.3, 2.6], [0.15, 0.95, -0.4]), C([-0.1, 1.3, 2.7], [0.15, 0.95, -0.4]), 9)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.3] as V, spotK: 0.5 })}
    scene={(tt) => { const grow = eio(tt, 0.5, 3.2), op = eio(tt, 3.6, 4.6), out = eio(tt, 4.8, 7.8), dry = eio(tt, 5.0, 8.0);
      const cx = lerp(-0.35, 1.05, out), cy = lerp(1.55, 1.25, out), cz = lerp(-0.45, -1.1, out), cs = (0.35 + 0.65 * grow) * (1 - 0.6 * out);
      return <>
        <Wallp p={[0, 0, -0.85]} w={3.8} h={2.3} />
        <group position={[1.05, 1.25, -0.8]}><Win p={[0, 0, 0]} w={0.8} h={0.75} sky="#cfe3f2" />
          <group position={[-0.4, 0, 0.06]} rotation={[0, -1.5 * op, 0]}><Box p={[0.2, 0, 0]} s={[0.4, 0.72, 0.03]} c="#dfe9ef" op={0.55} /><Box p={[0.2, 0, 0.02]} s={[0.4, 0.72, 0.01]} c="#6b4a2c" op={0} /></group></group>
        <Rack p={[-0.35, 0, -0.35]} w={1.0} />
        {[["#f2c14e", -0.7], ["#7a8f6a", -0.45], ["#ffffff", -0.2], ["#c0392b", 0.05]].map(([c, x], i) => <group key={i}><Cloth p={[x as number, 1.06, -0.45]} w={0.2} h={0.45} c={c as string} wet={1 - dry} />
          <Steam p={[x as number, 1.08, -0.45]} t={tt + i * 0.3} k={(1 - out) * 1.4} n={6} /></group>)}
        <group position={[cx, cy, cz]} scale={cs}>{[[0, 0, 0, 0.2], [-0.2, -0.03, 0.02, 0.15], [0.21, -0.02, 0, 0.16], [-0.1, 0.12, 0, 0.14], [0.1, 0.13, -0.02, 0.15], [0.33, -0.06, 0, 0.11], [-0.32, -0.06, 0, 0.1]].map(([x, y, z, r], i) =>
          <mesh key={i} position={[x, y + 0.01 * Math.sin(tt * 2 + i), z]}><sphereGeometry args={[r, 20, 14]} /><meshStandardMaterial color="#a9cde8" roughness={1} /></mesh>)}</group>
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-0.3, -0.1 + 0.9 * sv(tt, 3.0, 3.6) * (1 - sv(tt, 4.8, 5.4)), 0.6] }; })} t={tt} x={0.7} z={-0.3} rotY={-150 + 110 * sv(tt, 5.0, 6.0)} s={S} expr={out > 0.4 ? "feliz" : "pensativo"} />
      </>; }} />;

// 2:06 · nunca al lado de la estufa: la camisa del tendedero empieza a humear junto a la estufa; ella corre el tendedero y una cinta métrica amarilla marca la distancia
export const G_heatergap: F = ({ t, h }) =>
  <Hero d={1.2} ly={0.25} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.2, 1.1, 2.6], [0.0, 0.6, -0.3]), C([-0.4, 1.15, 2.55], [0.0, 0.6, -0.3]), 7)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.3] as V, spotK: 0.5 })}
    scene={(tt) => { const mv = eio(tt, 2.0, 3.4), smk = sv(tt, 0.4, 1.0) * (1 - sv(tt, 2.6, 3.6)), tape = eio(tt, 3.6, 4.8), rx = -0.35 + 0.85 * mv;
      return <>
        <Wallp p={[0, 0, -0.8]} w={3.6} h={2.2} />
        <Heater p={[-0.8, 0, -0.45]} k={1} />
        <group position={[rx, 0, -0.35]}><Rack p={[0, 0, 0]} w={0.6} h={1.0} /><Shirt p={[-0.12, 0.98, -0.1]} c="#e7d4ae" s={0.9} /><Cloth p={[0.15, 1.0, -0.1]} w={0.22} h={0.4} c="#7a8f6a" /></group>
        {[0, 1].map((j) => <Steam key={j} p={[rx - 0.3 + 0.15 * j, 0.55, -0.42]} t={tt + j * 0.4} k={smk * 1.6} n={9} />)}
        {tape > 0.02 && <><Box p={[-0.62 + 0.425 * mv * tape, 0.02, 0.0]} s={[0.85 * mv * tape, 0.008, 0.05]} c="#f2c14e" r={0.5} />{Array.from({ length: Math.floor(10 * tape) }, (_, i) => <Box key={i} p={[-0.62 + i * 0.085, 0.026, 0.0]} s={[0.006, 0.003, 0.035]} c="#2a2420" />)}<Box p={[-0.64, 0.05, 0.0]} s={[0.07, 0.07, 0.07]} c="#f2c14e" r={0.5} /></>}
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.5, -0.4, 0.4] }; q.manoD = { ...q.manoD, p: [-0.5, -0.4, 0.4] }; })} t={tt} x={rx + 0.65} z={-0.2} rotY={-80} s={S} expr={smk > 0.3 ? "asustado" : "decidido"} />
      </>; }} />;

// 2:55 · centrifugar dos veces: ella aprieta el botón dos veces, el tambor gira y el agua sale por la manguera al balde en dos chorros; el balde se llena
export const G_spintwice: F = ({ t, h }) =>
  <Hero d={1.15} ly={0.3} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.65, 1.0, 2.0], [0.1, 0.5, -0.3]), C([0.05, 1.05, 2.1], [0.1, 0.5, -0.3]), 8)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.3] as V, spotK: 0.55 })}
    scene={(tt) => { const s1 = sv(tt, 0.8, 1.2) * (1 - sv(tt, 3.2, 3.6)), s2 = sv(tt, 4.0, 4.4) * (1 - sv(tt, 6.6, 7.2)), sp = Math.max(s1, s2), fill = 0.5 * eio(tt, 1.2, 3.4) + 0.5 * eio(tt, 4.4, 6.6), press = Math.max(sv(tt, 0.4, 0.7) * (1 - sv(tt, 0.8, 1.0)), sv(tt, 3.6, 3.9) * (1 - sv(tt, 4.0, 4.2)));
      return <>
        <Wallp p={[0, 0, -0.75]} w={3.4} h={2.2} />
        <Washer p={[-0.2, Math.sin(tt * 40) * 0.004 * sp, -0.35]} ang={tt * 2 + 14 * eio(tt, 0.8, 3.4) + 14 * eio(tt, 4.0, 7.0)} fill={0.7} light={sp > 0.2 ? 1 : 0} />
        {sp > 0.05 && Array.from({ length: 8 }, (_, i) => <Box key={i} p={[-0.2 + 0.1 * Math.cos(i * 0.785 + tt * 9), 0.4 + 0.1 * Math.sin(i * 0.785 + tt * 9), -0.03]} s={[0.12, 0.012, 0.003]} c="#ffffff" op={0.5 * sp} rot={[0, 0, i * 0.785 + tt * 9 + 1.57]} cast={false} />)}
        <group position={[0.04, 0.82 - 0.02 * press, -0.12]}><Cyl p={[0, 0, 0]} r={0.06} h={0.05} c="#c0392b" rot={[Math.PI / 2, 0, 0]} e="#ff5a3c" ei={0.6 * press} /></group>
        <Ring p={[0.04, 0.87, -0.12]} r={0.12 + 0.1 * press} k={press} col={AMB} />
        <Cord a={[0.08, 0.15, -0.6]} b={[0.42, 0.5, -0.3]} w={0.03} c="#8a9098" />
        {sp > 0.05 && <Cyl p={[0.48, 0.5 - 0.25 + 0.13 * fill, -0.3]} r={0.022 * sp + 0.004} h={0.5 - 0.26 * fill} c="#7fb6e0" op={0.85} rough={0.05} />}
        <Cyl p={[0.48, 0.15, -0.3]} r={0.17} r2={0.14} h={0.3} c="#5d7fa0" m={0.3} rough={0.4} />
        <Cyl p={[0.48, 0.02 + 0.26 * fill / 2, -0.3]} r={0.15} r2={0.135} h={0.26 * fill + 0.004} c="#7fb6e0" op={0.85} rough={0.05} />
        <Drops a={[0.48, 0.3 + 0.26 * fill, -0.3]} t={tt} k={sp} n={6} len={0.1} w={0.18} />
        {[s1 > 0.1 || tt > 3.4, s2 > 0.1 || tt > 7.0].map((on, i) => <mesh key={i} position={[0.48 + (i - 0.5) * 0.16, 0.66, -0.3]}><sphereGeometry args={[0.055, 16, 12]} /><meshStandardMaterial color={on ? "#5aa05a" : "#c9ccd2"} emissive={on ? "#7dff8a" : "#000000"} emissiveIntensity={on ? 0.8 : 0} /></mesh>)}
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-0.35, 0.05 - 0.05 * press, 0.75] }; })} t={tt} x={-0.75} z={-0.05} rotY={60} s={S} expr={fill > 0.9 ? "carcajada" : "feliz"} />
      </>; }} />;

// 3:11 · un centrifugado más: la perilla gigante gira de LOW a HIGH, el tambor acelera hasta borronearse; sale la toalla y casi no gotea
export const G_highspin: F = ({ t, h }) => { const tH = useLab();
  return <Hero d={1.4} ly={0.3} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.55, 0.95, 1.7], [0.0, 0.55, -0.35]), C([-0.1, 1.0, 1.85], [0.0, 0.55, -0.35]), 9)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.3] as V, spotK: 0.55 })}
    scene={(tt) => { const knob = eio(tt, 0.6, 1.8), sp = eio(tt, 1.6, 3.4) * (1 - eio(tt, 4.6, 5.4)), out = eio(tt, 5.4, 6.6), ang = tt * 3 + 40 * eio(tt, 1.6, 5.0);
      return <>
        <Wallp p={[0, 0, -0.75]} w={3.4} h={2.2} />
        <Washer p={[-0.1, 0, -0.35]} ang={ang} fill={0.8 * (1 - out) + 0.1} light={1} />
        {sp > 0.05 && Array.from({ length: 8 }, (_, i) => <Box key={i} p={[-0.1 + 0.1 * Math.cos(i * 0.785 + tt * 9), 0.4 + 0.1 * Math.sin(i * 0.785 + tt * 9), -0.03]} s={[0.12, 0.012, 0.003]} c="#ffffff" op={0.5 * sp} rot={[0, 0, i * 0.785 + tt * 9 + 1.57]} cast={false} />)}
        <group position={[0.42, 0.95, 0.05]}>
          <Dial p={[0, 0, 0]} ang={-0.9 + 1.8 * knob} s={0.5} c="#f6f1e7" marks={6} sweep={0.5 * knob} />
        </group>
        <group position={[0.15 + 0.3 * out, 0.85 + 0.25 * out, 0.1]}>{out > 0.02 && <Cloth p={[0, 0, 0]} w={0.35} h={0.42} c="#f4f1ea" band="#3d5a80" puff={0.5} />}</group>
        <Drops a={[0.45, 0.62, 0.1]} t={tt} k={out * 0.35} n={2} len={0.5} w={0.2} />
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-0.3, 0.1 + 0.35 * out, 0.65] }; q.manoI = { ...q.manoI, p: [0.25, 0.1 + 0.35 * out, 0.65] }; })} t={tt} x={1.0 + 0.1 * out} z={-0.2} rotY={-50} s={S} expr={out > 0.5 ? "carcajada" : "decidido"} />
      </>; }} />; };

// 4:01 · pan, pan, pan: ella sacude la toalla tres veces; cada sacudón larga un anillo de sonido y las arrugas salen volando
export const G_panpan: F = ({ t, h }) =>
  <Hero d={0.97} ly={0.2} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.25, 1.2, 2.5], [0.0, 0.95, -0.2]), C([-0.35, 1.2, 2.45], [0.0, 0.95, -0.2]), 8)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.2] as V, spotK: 0.6 })}
    scene={(tt) => { const hits = [1.2, 2.6, 4.0], snap = hits.reduce((m, a) => Math.max(m, Math.exp(-Math.pow((tt - a) * 5, 2))), 0), done = sv(tt, 4.2, 5.0), wr = 1 - eio(tt, 1.0, 4.4);
      const pz = withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.32, 0.15 + 0.35 * snap, 0.7] }; q.manoD = { ...q.manoD, p: [-0.32, 0.15 + 0.35 * snap, 0.7] }; });
      const hI = handOf(pz, "I", 0, -0.2), hD = handOf(pz, "D", 0, -0.2);
      return <>
        <Wallp p={[0, 0, -0.8]} w={3.6} h={2.2} />
        <Basket p={[-0.75, 0, -0.25]} />
        <group position={[(hI[0] + hD[0]) / 2, (hI[1] + hD[1]) / 2, hI[2] + 0.05]} rotation={[-0.6 * snap, 0, 0]}>
          <Box p={[0, -0.3, 0]} s={[Math.abs(hI[0] - hD[0]) + 0.08, 0.6, 0.02 + 0.03 * wr]} c="#f4f1ea" r={0.98} rad={0.01} />
          <Box p={[0, -0.54, 0.02]} s={[Math.abs(hI[0] - hD[0]) + 0.08, 0.03, 0.004]} c="#c0392b" />
          {wr > 0.05 && [[-0.1, -0.2, 0.6], [0.08, -0.35, -0.5], [-0.04, -0.45, 1.1]].map(([x, y, r], i) => <Box key={i} p={[x, y, 0.025]} s={[0.2 * wr, 0.014, 0.004]} c="#00000055" rot={[0, 0, r]} />)}
        </group>
        {hits.map((a, i) => { const u = cl((tt - a) / 0.9); return u > 0 && u < 1 ? <Ring key={i} p={[(hI[0] + hD[0]) / 2, hI[1] - 0.3, hI[2]]} r={0.3 + 0.6 * u} k={1 - u} col={AMB} /> : null; })}
        {hits.map((a, i) => { const u = cl((tt - a) / 1.0); return u > 0 && u < 1 ? [0, 1, 2].map((j) => <Box key={i + "-" + j} p={[(hI[0] + hD[0]) / 2 + (j - 1) * 0.25 * (1 + u), hI[1] - 0.4 + 0.5 * u, hI[2] + 0.3 * u]} s={[0.12, 0.012, 0.004]} c="#2a2420" op={1 - u} rot={[0, 0, j + u * 3]} />) : null; })}
        <Sachi p={pz} t={tt} x={0} z={-0.2} rotY={0} s={S} expr={done > 0.5 ? "carcajada" : "decidido"} />
      </>; }} />;

// 4:37 · el secreto de las toallas blandas: en la cuerda, una toalla dura como cartón (sin sacudir) y una esponjosa (sacudida); ella aprieta la blanda y se hunde, una pluma cae encima
export const G_softtowel: F = ({ t, h }) =>
  <Hero d={0.92} ly={0.2} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.35, 1.25, 2.3], [0.0, 1.0, -0.4]), C([-0.3, 1.25, 2.3], [0.0, 1.0, -0.4]), 8)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.4] as V, spotK: 0.55 })}
    scene={(tt) => { const press = sv(tt, 2.4, 3.0) * (1 - sv(tt, 3.8, 4.4)), fe = eio(tt, 4.2, 6.6), bad = sv(tt, 0.6, 1.4);
      return <>
        <Wallp p={[0, 0, -0.85]} w={3.4} h={2.3} />
        <Cord a={[-1.0, 1.4, -0.55]} b={[1.0, 1.4, -0.55]} w={0.008} c="#d9d2c4" />
        <group position={[-0.4, 1.4, -0.55]}><Box p={[0, -0.28, 0.0]} s={[0.42, 0.56, 0.03]} c="#c9b28a" r={0.6} rad={0.002} rot={[0, 0, 0.04]} /><Box p={[0, -0.0, 0.0]} s={[0.44, 0.03, 0.04]} c="#b39a72" /><Pin p={[-0.16, 0, 0.03]} /><Pin p={[0.16, 0, 0.03]} />
          {bad > 0.05 && [-0.12, 0.0, 0.12].map((x, i) => <Box key={i} p={[x, -0.3, 0.018]} s={[0.006, 0.45, 0.003]} c="#8a7350" op={bad} />)}</group>
        <group position={[0.4, 1.4, -0.55 - 0.06 * press]} scale={[1 + 0.08 * press, 1 - 0.12 * press, 1 - 0.6 * press]}><Cloth p={[0, 0, 0]} w={0.44} h={0.58} c="#f6f2ea" band="#7a8f6a" puff={1} /></group>
        <group position={[0.4 + 0.12 * Math.sin(tt * 2.2), lerp(1.95, 1.43, fe), -0.42]} rotation={[0, 0, 0.6 * Math.sin(tt * 2.2)]}>
          <Box p={[0, 0, 0]} s={[0.012, 0.13, 0.004]} c="#e8e2d6" /><mesh scale={[0.04, 0.07, 0.006]}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color="#ffffff" roughness={0.9} /></mesh></group>
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.45, 0.45 + 0.1 * press, 0.35 + 0.15 * press] }; })} t={tt} x={0.85} z={-0.3} rotY={-40} s={S} expr={tt > 3.4 ? "enamorado" : "feliz"} />
      </>; }} />;

// 5:11 · el «pulpo»: una percha redonda con cara de pulpito baja y se cuelga del gancho junto a la ventana; sus 20 patitas-broche se balancean y las medias se cuelgan de a una
export const G_octopus: F = ({ t, h }) =>
  <Hero d={0.97} ly={0.25} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.4, 1.4, 1.8], [0.1, 1.25, -0.6]), C([-0.2, 1.4, 1.85], [0.1, 1.25, -0.6]), 9)}
    set={(tt: number) => ({ ...LAU, warm: 0.6, spot: [0.1, 0, -0.5] as V, spotK: 0.5 })}
    scene={(tt) => { const dn = phys(tt, 0.4, 5, 0.35), y = 1.62 + 0.8 * (1 - Math.min(1.1, dn)), sw = 0.25 * Math.sin(tt * 3.2) * Math.exp(-Math.max(0, tt - 1) * 0.6), N = 20, socks = Math.floor(12 * eio(tt, 2.6, 7.6));
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.6} h={2.4} />
        <Win p={[-0.75, 1.3, -0.85]} w={0.8} h={0.9} sky="#f6dca6" />
        <Beam p={[-0.4, 0.9, -0.3]} s={[0.6, 1.6, 0.05]} rot={[0.9, 0.3, 0.2]} k={1} />
        <Box p={[0.1, 2.08, -0.86]} s={[0.04, 0.04, 0.06]} c="#8a6236" />
        <Cord a={[0.1, 2.06, -0.82]} b={[0.1, y + 0.16, -0.65]} w={0.006} c="#9aa0a8" />
        <group position={[0.1, y, -0.65]} rotation={[sw * 0.3, 0, sw * 0.2]}>
          <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#e88a8a" roughness={0.6} /></mesh>
          {[-1, 1].map((k) => <mesh key={k} position={[k * 0.035, 0.11, 0.085]}><sphereGeometry args={[0.014, 10, 8]} /><meshBasicMaterial color="#2a2420" /></mesh>)}
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.32, 0.014, 10, 48]} /><meshStandardMaterial color="#e88a8a" roughness={0.5} /></mesh>
          {Array.from({ length: N }, (_, i) => { const a = (i / N) * Math.PI * 2, x = Math.cos(a) * 0.32, z = Math.sin(a) * 0.32, s2 = Math.sin(tt * 4 + i) * 0.08 * Math.exp(-Math.max(0, tt - 1.2) * 0.5);
            return <group key={i} position={[x, 0, z]} rotation={[s2, 0, s2]}><Cyl p={[0, -0.05, 0]} r={0.004} h={0.1} c="#e88a8a" /><Pin p={[0, -0.12, 0]} />{i < socks && i % 2 === 0 && <HSock p={[0, -0.16, 0]} c={DRUM[(i / 2) % DRUM.length]} s={0.8} />}{i < socks && i % 2 === 1 && <Box p={[0, -0.22, 0]} s={[0.12, 0.16, 0.012]} c={["#f3efe6", "#e7d4ae", "#9db2c9"][i % 3]} />}</group>; })}
        </group>
        <Sachi p={withHands(PZ.stand, (q: any) => { const r = Math.sin(tt * 4.5) * 0.12 * (socks > 0 && socks < 12 ? 1 : 0); q.manoD = { ...q.manoD, p: [-0.25, 0.55 + r, 0.55] }; })} t={tt} x={0.75} z={-0.3} rotY={-50} s={S} expr="feliz" />
      </>; }} />;

// 6:02 · una media, un broche, con espacio: las medias amontonadas que se tocan (gotean y quedan azules) se separan a distancias iguales y el aire pasa entre ellas
export const G_sockspace: F = ({ t, h }) =>
  <Hero d={0.95} ly={0.0} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.25, 1.4, 1.75], [0.0, 1.15, -0.5]), C([-0.25, 1.4, 1.75], [0.0, 1.15, -0.5]), 7)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.5] as V, spotK: 0.5 })}
    scene={(tt) => { return <>
        <Wallp p={[0, 0, -0.9]} w={3.4} h={2.4} />
        <Cord a={[-1.0, 1.5, -0.55]} b={[1.0, 1.5, -0.55]} w={0.01} c="#d9d2c4" />
        {Array.from({ length: 6 }, (_, i) => { const k = phys(tt, 1.2 + i * 0.35, 6, 0.45), x = lerp(-0.3 + i * 0.1, -0.8 + i * 0.32, Math.min(1.05, k)); return <group key={i}><HSock p={[x, 1.48, -0.55]} c={DRUM[i]} s={1.7} rotZ={0.05 * Math.sin(tt * 2 + i)} />
          {k < 0.5 && <Box p={[x, 1.2, -0.52]} s={[0.1, 0.32, 0.004]} c="#2f5f8a" op={0.5 * (1 - 2 * k)} />}</group>; })}
        <Drops a={[-0.05, 1.05, -0.55]} t={tt} k={1 - eio(tt, 1.2, 3.0)} n={8} len={0.8} w={0.35} />
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.2, 0.55 - 0.2 * eio(tt, 1.2, 3.4), 0.55] }; })} t={tt} x={1.15} z={-0.4} rotY={-50} s={S} expr={tt > 3.6 ? "feliz" : "pensativo"} />
      </>; }} />;

// 6:20 · el arco: lo largo afuera, lo corto al medio; las piezas se acomodan solas y una línea dorada dibuja la sonrisa al revés por abajo
export const G_arch: F = ({ t, h }) =>
  <Hero d={1.01} ly={0.25} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.2, 1.3, 2.5], [0.0, 1.05, -0.5]), C([-0.2, 1.3, 2.5], [0.0, 1.05, -0.5]), 9)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.5] as V, spotK: 0.5 })}
    scene={(tt) => { const so = eio(tt, 1.0, 3.6), arc = eio(tt, 3.8, 5.4), air = sv(tt, 5.4, 6.2);
      const H0 = [0.85, 0.6, 0.35, 0.22, 0.2, 0.22, 0.35, 0.6, 0.85], mix = [0.35, 0.85, 0.2, 0.6, 0.22, 0.85, 0.22, 0.35, 0.6];
      const cols = ["#3d5a80", "#e7d4ae", "#c0392b", "#7a8f6a", "#f2c14e", "#7a8f6a", "#c0392b", "#e7d4ae", "#3d5a80"];
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.6} h={2.4} />
        <Rod p={[0, 1.6, -0.55]} w={2.0} r={0.02} c="#a87a4a" m={0} />
        {H0.map((hh, i) => { const L = lerp(mix[i], hh, so); return <Cloth key={i} p={[-0.88 + i * 0.22, 1.6, -0.55]} w={0.19} h={L} c={cols[i]} />; })}
        {arc > 0.02 && Array.from({ length: Math.floor(48 * arc) }, (_, i) => { const u = i / 47, x = -0.88 + u * 1.76, yy = 1.6 - lerp(0.85, 0.2, Math.sin(Math.PI * u)) - 0.05; return <mesh key={i} position={[x, yy, -0.5]}><sphereGeometry args={[0.032, 12, 10]} /><meshBasicMaterial color="#ffcf6a" toneMapped={false} /></mesh>; })}
        <Wind a={[0, 0.5, -0.4]} b={[0, 1.5, -0.55]} t={tt} k={air} n={8} />
        <Wind a={[0.1, 1.45, -0.5]} b={[0.9, 1.5, -0.3]} t={tt + 0.5} k={air} n={6} />
        <Wind a={[-0.1, 1.45, -0.5]} b={[-0.9, 1.5, -0.3]} t={tt + 0.2} k={air} n={6} />
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.35, 0.1, 0.4] }; })} t={tt} x={1.25} z={-0.2} rotY={-50} s={S} expr={arc > 0.5 ? "carcajada" : "feliz"} />
      </>; }} />;

// 7:28 · el baño es el cuarto de secado: las camisas en sus perchas se deslizan por el barral de la cortina, con espacio; el pulpo al final; el extractor arranca y el vapor sube hacia él
export const G_showerrod: F = ({ t, h }) =>
  <Hero d={1.01} ly={0.2} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.4, 1.4, 2.6], [0.0, 1.0, -0.5]), C([-0.35, 1.4, 2.6], [0.0, 1.0, -0.5]), 7)}
    set={(tt: number) => ({ floor: "none" as const, warm: 0.45, bg: "#d9e2e6", spot: [0, 0, -0.4] as V, spotK: 0.5 })}
    scene={(tt) => { const n = [0.6, 1.4, 2.2, 3.0], fon = sv(tt, 3.6, 4.0), fang = tt * 2 + 30 * eio(tt, 3.6, 7);
      return <>
        <Box p={[0, 0.0, -0.3]} s={[4, 0.02, 3]} c="#e9edef" r={0.4} />
        <Tiles p={[0, 0, -0.95]} w={3.0} h={2.3} />
        <Tub p={[0, -0.25, -0.75]} />
        <Rod p={[0, 1.75, -0.4]} w={1.6} r={0.015} />
        <Fan p={[0.85, 2.05, -0.9]} ang={fang} on={fon} />
        {n.map((a, i) => { const k = eio(tt, a, a + 0.8); return <Shirt key={i} p={[lerp(-0.85, -0.6 + i * 0.32, k), 1.69, -0.4]} c={["#f7f4ee", "#9db2c9", "#e7d4ae", "#b8483a"][i]} s={0.85} rotY={0.05} />; })}
        {tt > 4.2 && <group position={[0.62, 1.55 + 0.3 * (1 - Math.min(1, phys(tt, 4.2, 6, 0.4))), -0.4]} scale={0.85}><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.32, 0.02, 8, 32]} /><meshStandardMaterial color="#e88a8a" /></mesh>{[0, 1, 2, 3, 4, 5].map((i) => <HSock key={i} p={[Math.cos(i) * 0.3, -0.05, Math.sin(i) * 0.3]} c={DRUM[i]} />)}</group>}
        <Flow a={[0, 0.8, -0.4]} b={[0.85, 2.0, -0.85]} t={tt} k={fon} c="#ffffff" n={14} r={0.035} speed={0.35} />
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-0.25, 0.6, 0.45] }; })} t={tt} x={-1.0} z={0.15} rotY={50} s={S} expr="feliz" />
      </>; }} />;

// 7:56 · la caña de bambú de su madre (1955): baño chiquito de madera, la caña cae de pared a pared y se llena: la camisa del padre, la blusa del colegio, los shorts del hermano
export const G_bamboopole: F = ({ t, h }) =>
  <Hero d={0.97} ly={0.2} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.3, 1.35, 2.3], [0.0, 1.05, -0.45]), C([-0.3, 1.35, 2.35], [0.0, 1.05, -0.45]), 9)}
    set={(tt: number) => ({ floor: "wood" as const, warm: 0.85, bg: "#cdbb9c", spot: [0, 0, -0.4] as V, spotK: 0.6 })}
    scene={(tt) => { const pole = drop(tt, 0.6, 0.8), a1 = phys(tt, 2.2, 6, 0.4), a2 = phys(tt, 3.4, 6, 0.4), a3 = phys(tt, 4.6, 6, 0.4);
      return <>
        <Box p={[0, 1.15, -0.9]} s={[1.9, 2.3, 0.06]} c="#b89a72" r={0.9} />
        {[-1, 1].map((k) => <Box key={k} p={[k * 0.95, 1.15, -0.4]} s={[0.06, 2.3, 1.0]} c="#a88a62" r={0.9} />)}
        <Cyl p={[0.55, 0.32, -0.55]} r={0.32} h={0.62} c="#8a6a48" rough={0.8} />
        {pole.on && <group position={[0, 1.75 + pole.y, -0.45]}><Rod p={[0, 0, 0]} w={1.86} r={0.028} c="#9bb06a" m={0} />{[-0.6, -0.2, 0.2, 0.6].map((x, i) => <Cyl key={i} p={[x, 0, 0]} r={0.032} h={0.02} c="#7f9455" rot={[0, 0, Math.PI / 2]} />)}</group>}
        {a1 > 0.02 && <Shirt p={[-0.5, 1.72 + 0.4 * (1 - Math.min(1, a1)), -0.45]} c="#e9e4da" s={1.0} wr={0.4} />}
        {a2 > 0.02 && <Shirt p={[0.0, 1.72 + 0.4 * (1 - Math.min(1, a2)), -0.45]} c="#f7f4ee" s={0.75} />}
        {a2 > 0.02 && <Box p={[0.0, 1.6 + 0.4 * (1 - Math.min(1, a2)), -0.42]} s={[0.22, 0.03, 0.01]} c="#2e3d63" />}
        {a3 > 0.02 && <group position={[0.42, 1.75 + 0.4 * (1 - Math.min(1, a3)), -0.45]}><Pin p={[-0.08, 0, 0.02]} /><Pin p={[0.08, 0, 0.02]} /><Box p={[0, -0.08, 0]} s={[0.26, 0.14, 0.04]} c="#3d5a80" />{[-1, 1].map((k) => <Box key={k} p={[k * 0.07, -0.2, 0]} s={[0.12, 0.12, 0.04]} c="#3d5a80" />)}</group>}
        <Steam p={[0.55, 0.62, -0.55]} t={tt} k={0.8} n={8} />
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.3, 0.7, 0.4] }; q.manoD = { ...q.manoD, p: [-0.3, 0.7, 0.4] }; })} t={tt} x={-0.7} z={-0.25} rotY={25} s={S} expr="feliz" />
      </>; }} />;

// 8:27 · puerta cerrada sin nada = selva: la puerta se cierra, el espejo se empaña y chorrea, aparecen manchas negras en los rincones; se prende el extractor, el vapor se va por él y las manchas se borran
export const G_jungle: F = ({ t, h }) =>
  <Hero d={1.01} ly={0.2} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.5, 1.3, 2.6], [0.0, 1.0, -0.5]), C([-0.3, 1.3, 2.65], [0.0, 1.0, -0.5]), 9)}
    set={(tt: number) => ({ floor: "none" as const, warm: 0.4, bg: "#cfd8dc", spot: [0, 0, -0.4] as V, spotK: 0.45 })}
    scene={(tt) => { const shut = eio(tt, 0.3, 1.2), fog = eio(tt, 1.2, 3.6) * (1 - eio(tt, 5.2, 7.4)), mold = eio(tt, 2.0, 4.0) * (1 - eio(tt, 5.6, 7.6)), fon = sv(tt, 4.4, 4.8), fang = tt + 35 * eio(tt, 4.4, 8.5);
      return <>
        <Box p={[0, 0.0, -0.3]} s={[4, 0.02, 3]} c="#e9edef" r={0.4} />
        <Tiles p={[0, 0, -0.95]} w={3.0} h={2.3} />
        <Door p={[-1.0, 0, -0.9]} open={0.8 * (1 - shut)} c="#c9b28a" />
        <group position={[0.3, 1.35, -0.9]}><Box p={[0, 0, 0]} s={[0.7, 0.55, 0.03]} c="#cfe3ec" m={0.6} r={0.05} /><Box p={[0, 0, 0.02]} s={[0.68, 0.53, 0.004]} c="#ffffff" op={0.85 * fog} />
          {fog > 0.3 && [-0.2, 0.0, 0.18].map((x, i) => <Box key={i} p={[x, -0.1 - 0.1 * ((tt * 0.3 + i * 0.3) % 1), 0.025]} s={[0.012, 0.2, 0.003]} c="#a9c6d6" op={fog} />)}</group>
        {mold > 0.02 && [[-0.3, 1.95], [0.85, 1.85], [0.95, 0.45], [-0.3, 0.45]].map(([x, y], j) => Array.from({ length: 12 }, (_, i) => <mesh key={j + "-" + i} position={[x + (x > 0 ? -1 : 1) * ((i * 0.37) % 1) * 0.35 * mold, y + (y > 1 ? -1 : 1) * ((i * 0.61) % 1) * 0.3 * mold, -0.91]} scale={mold * (0.4 + 0.6 * ((i * 0.29) % 1))}><circleGeometry args={[0.07, 9]} /><meshStandardMaterial color={i % 3 ? "#2b2a26" : "#3d4a32"} roughness={1} transparent opacity={0.85} /></mesh>))}
        {[0, 1, 2].map((i) => <mesh key={i} position={[0, 1.0 + 0.3 * i, -0.6 + 0.2 * i]}><planeGeometry args={[3.2, 0.8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.22 * fog} depthWrite={false} /></mesh>)}
        <Fan p={[0.95, 1.95, -0.9]} ang={fang} on={fon} />
        <Flow a={[0.2, 1.5, -0.5]} b={[0.95, 1.95, -0.85]} t={tt} k={fon * fog + 0.01} c="#ffffff" n={12} r={0.03} speed={0.5} />
        <Shirt p={[-0.2, 1.75, -0.5]} c="#9db2c9" s={0.9} />
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-0.25, 0.6 * sv(tt, 3.8, 4.4) * (1 - sv(tt, 5.0, 5.6)), 0.5] }; })} t={tt} x={0.95} z={0.1} rotY={-40} s={S} expr={tt < 4.4 ? (tt > 2.2 ? "asqueado" : "pensativo") : "feliz"} />
      </>; }} />;

// 9:01 · la ropa se toca: en un solo tendedero todo apretado echa olor agrio; la mitad salta a un segundo tendedero, aparecen los espacios y el olor se corta
export const G_crowded: F = ({ t, h }) =>
  <Hero d={0.95} ly={0.15} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.4, 1.25, 2.6], [0.15, 0.85, -0.35]), C([-0.2, 1.25, 2.65], [0.15, 0.85, -0.35]), 8)}
    set={(tt: number) => ({ ...LAU, spot: [0.1, 0, -0.3] as V, spotK: 0.5 })}
    scene={(tt) => { const r2 = phys(tt, 1.8, 6, 0.4), stink = sv(tt, 0.3, 0.9) * (1 - eio(tt, 4.6, 5.8));
      return <>
        <Wallp p={[0, 0, -0.85]} w={3.8} h={2.3} />
        <Rack p={[-0.5, 0, -0.35]} w={0.9} />
        {r2 > 0.02 && <group position={[0.65, 0, -0.35]} scale={[1, Math.min(1.05, r2), 1]}><Rack p={[0, 0, 0]} w={0.9} /></group>}
        {Array.from({ length: 10 }, (_, i) => { const mine = i % 2 === 1, j = Math.floor(i / 2), u = mine ? eio(tt, 2.6 + j * 0.35, 3.4 + j * 0.35) : eio(tt, 3.0, 4.2), x0 = -0.86 + i * 0.08, xa = -0.86 + j * 0.18, xb = 0.29 + j * 0.18, x = mine ? lerp(x0, xb, u) : lerp(x0, xa, u), y = 1.06 + 0.4 * Math.sin(Math.PI * u) * (mine ? 1 : 0);
          return <Cloth key={i} p={[x, y, -0.45]} w={0.15} h={0.42 + 0.08 * (i % 3)} c={DRUM[i % DRUM.length]} wet={1 - eio(tt, 4.0, 6.5)} />; })}
        <group scale={1.5} position={[-0.5, 0.95, -0.3]}><Stink p={[0, 0, 0]} t={tt} k={stink} n={9} /></group>
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.3, 0.3 * sv(tt, 0.8, 1.4), 0.7] }; q.cabeza = { ...(q.cabeza || {}), x: -10 * stink }; })} t={tt} x={1.3} z={0.0} rotY={-50} s={S} expr={stink > 0.4 ? "asqueado" : "feliz"} />
      </>; }} />;

// 9:52 · lavar de noche: por la ventana la luna, la ropa colgada gotea toda la noche; el cielo se vuelve mañana, sale el sol y la ropa larga vapor y se seca
export const G_nightwash: F = ({ t, h }) =>
  <Hero d={1.01} ly={0.2} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.4, 1.3, 2.6], [0.0, 1.0, -0.5]), C([-0.3, 1.3, 2.6], [0.0, 1.0, -0.5]), 8)}
    set={(tt: number) => { const d = eio(tt, 2.6, 4.4); return { ...LAU, warm: lerp(0.15, 0.7, d), bg: d < 0.5 ? "#3a3f55" : "#d9cdb8", spot: [0, 0, -0.4] as V, spotK: lerp(0.2, 0.6, d) }; }}
    scene={(tt) => { const d = eio(tt, 2.6, 4.4), sk = d < 0.5 ? "#1f2a44" : "#bfe0f6";
      return <>
        <Wallp p={[0, 0, -0.85]} w={3.6} h={2.4} c={d < 0.5 ? "#8a8a9a" : "#ece3d1"} />
        <Win p={[0.2, 1.4, -0.8]} w={1.2} h={0.9} sky={sk} />
        {d < 0.6 && <mesh position={[0.5 - 0.5 * d, 1.6 - 0.4 * d, -0.79]}><circleGeometry args={[0.08, 24]} /><meshBasicMaterial color="#f3f0d8" toneMapped={false} /></mesh>}
        {d > 0.3 && <Sun p={[-0.1 + 0.5 * d, 1.0 + 0.5 * d, -0.79]} r={0.12} k={d} />}
        <Beam p={[0.4, 0.95, -0.4]} s={[0.6, 1.4, 0.05]} rot={[0.8, -0.3, -0.2]} k={d} />
        <Rack p={[-0.3, 0, -0.35]} w={1.0} />
        {[["#f4f1ea", -0.7], ["#3d5a80", -0.45], ["#e7d4ae", -0.2], ["#c0392b", 0.05]].map(([c, x], i) => <Cloth key={i} p={[x as number, 1.06, -0.45]} w={0.2} h={0.48} c={c as string} wet={1 - eio(tt, 4.4, 6.6)} />)}
        <Drops a={[-0.32, 0.56, -0.45]} t={tt} k={1 - d} n={12} len={0.55} w={0.8} />
        <Steam p={[-0.32, 1.1, -0.45]} t={tt} k={d * (1 - eio(tt, 6.0, 7.0))} n={8} />
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.45, 0.3 * d, 0.4] }; })} t={tt} x={1.15} z={0.1} rotY={-40} s={S} expr={d > 0.5 ? "feliz" : "dormido"} />
      </>; }} />;

// 10:07 · lavarropas lleno hasta el tope: la puerta abulta y la ropa asoma; ella saca un cuarto y en el vidrio se prende la marca verde de los tres cuartos
export const G_overload: F = ({ t, h }) =>
  <Hero d={1.25} ly={0.3} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.5, 0.95, 1.75], [0.1, 0.48, -0.35]), C([-0.1, 1.0, 1.8], [0.1, 0.48, -0.35]), 6)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.3] as V, spotK: 0.55 })}
    scene={(tt) => { const pull = eio(tt, 1.6, 3.2), bulge = (1 - pull) * (1 + 0.15 * Math.sin(tt * 5)), ok = sv(tt, 3.4, 4.0);
      return <>
        <Wallp p={[0, 0, -0.75]} w={3.4} h={2.2} />
        <Washer p={[-0.15, 0, -0.35]} ang={0.2 * Math.sin(tt)} fill={1 - 0.45 * pull} light={ok > 0.5 ? 1 : 0} />
        <group position={[-0.15, 0.4, -0.03 + 0.03 * bulge]}>{[[-0.17, 0.12, 0.6, "#3d5a80"], [0.17, -0.08, -0.5, "#c0392b"], [0.0, -0.19, 1.57, "#f2c14e"], [-0.14, -0.14, 2.3, "#7a8f6a"]].map(([x, y, r, c], i) =>
          <Box key={i} p={[(x as number) * (1 + 0.2 * bulge), (y as number) * (1 + 0.2 * bulge), 0.02]} s={[0.09, 0.2 * bulge + 0.01, 0.03]} c={c as string} r={0.95} rad={0.012} rot={[0, 0, r as number]} />)}</group>
        {ok > 0.02 && <mesh position={[-0.15, 0.4, 0.0]}><ringGeometry args={[0.2, 0.235, 48, 1, Math.PI * 1.25, Math.PI * 1.5 * ok]} /><meshBasicMaterial color={GRN} toneMapped={false} /></mesh>}
        {ok > 0.02 && <mesh position={[-0.15 + 0.22 * Math.cos(Math.PI * 1.25 + Math.PI * 1.5 * 0.75), 0.4 + 0.22 * Math.sin(Math.PI * 1.25 + Math.PI * 1.5 * 0.75), 0.01]}><sphereGeometry args={[0.03 * ok, 14, 10]} /><meshBasicMaterial color={GRN} toneMapped={false} /></mesh>}
        <Basket p={[0.55, 0, -0.1]} full={pull} />
        <group position={[lerp(-0.1, 0.55, pull), 0.4 + 0.35 * Math.sin(Math.PI * pull), lerp(0.0, -0.1, pull)]}>{pull > 0.02 && pull < 0.98 && <><Box p={[0, 0, 0]} s={[0.2, 0.12, 0.1]} c="#f2c14e" r={0.95} rad={0.04} /><Box p={[0.08, -0.06, 0.02]} s={[0.07, 0.16, 0.04]} c="#3d5a80" r={0.95} rad={0.02} rot={[0, 0, 0.4]} /></>}</group>
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-0.35, -0.3 + 0.25 * Math.sin(Math.PI * pull), 0.7] }; })} t={tt} x={0.85} z={-0.35} rotY={-70} s={S} expr={ok > 0.5 ? "feliz" : "decidido"} />
      </>; }} />;

// 10:21 · cada camisa en su percha: del canasto sale una bola arrugada, salta a la percha, se abre en el aire y queda colgada lisa; tres más, cada una con su percha
export const G_ownhanger: F = ({ t, h }) =>
  <Hero d={1.01} ly={0.2} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.4, 1.35, 2.5], [0.0, 1.05, -0.45]), C([-0.3, 1.35, 2.5], [0.0, 1.05, -0.45]), 8)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.4] as V, spotK: 0.55 })}
    scene={(tt) => { const st = [0.6, 2.2, 3.6, 5.0];
      return <>
        <Wallp p={[0, 0, -0.85]} w={3.6} h={2.4} />
        <Rod p={[0, 1.78, -0.45]} w={1.8} r={0.016} />
        <Basket p={[-0.95, 0, -0.1]} />
        {st.map((a, i) => { const u = eio(tt, a, a + 1.1), op = sv(tt, a + 0.6, a + 1.2), x = -0.6 + i * 0.42, P0: V = [-0.95, 0.35, -0.1], P1: V = [x, 1.72, -0.45];
          const pos: V = [lerp(P0[0], P1[0], u), lerp(P0[1], P1[1], u) + 0.5 * Math.sin(Math.PI * u), lerp(P0[2], P1[2], u)];
          return u < 0.02 ? null : <group key={i}>{op < 0.95 && <mesh position={pos} scale={(1 - op) * 0.9 + 0.1}><icosahedronGeometry args={[0.17, 1]} /><meshStandardMaterial color={["#f7f4ee", "#9db2c9", "#e7d4ae", "#7a8f6a"][i]} roughness={0.95} /></mesh>}
            {op > 0.05 && <group position={pos} scale={[op, op, op]}><Shirt p={[0, 0, 0]} c={["#f7f4ee", "#9db2c9", "#e7d4ae", "#7a8f6a"][i]} s={0.9} wr={1 - op} /></group>}</group>; })}
        <Sachi p={withHands(PZ.stand, (q: any) => { const r = Math.sin(tt * 3.2); q.manoI = { ...q.manoI, p: [0.35, 0.2 + 0.25 * r, 0.5] }; })} t={tt} x={0.95} z={0.1} rotY={-50} s={S} expr="feliz" />
      </>; }} />;

// 11:41 · Osaka 1955, las 7 de la mañana: balcón de madera, el reloj pasa de 7 a 8, el sol bajo de invierno sale y su madre cuelga la ropa en la caña; el aliento hace nubecitas
export const G_balcony: F = ({ t, h }) =>
  <Hero d={1.01} ly={0.2} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.5, 1.2, 2.6], [0.0, 1.0, -0.6]), C([-0.4, 1.25, 2.65], [0.0, 1.0, -0.6]), 9)}
    set={(tt: number) => ({ floor: "wood" as const, warm: 0.75, bg: "#bfd3e2", wall: false, spot: [0, 0, -0.4] as V, spotK: 0.55 })}
    scene={(tt) => { const hr = eio(tt, 0.5, 5.5), sun = eio(tt, 0.8, 4.0), hang = [2.0, 3.2, 4.4, 5.6].map((a) => phys(tt, a, 6, 0.4));
      return <>
        <Box p={[0, 1.2, -1.6]} s={[5, 2.6, 0.05]} c="#cfe2ef" r={1} />
        <Sun p={[-0.75, 0.6 + 0.9 * sun, -1.45]} r={0.26} k={sun} />
        {[-1.4, -0.9, 1.2, 1.6].map((x, i) => <Box key={i} p={[x, 0.45 + 0.1 * i, -1.5]} s={[0.4, 0.9 + 0.2 * i, 0.3]} c="#9aa6b4" />)}
        <Box p={[0, 0.45, -0.95]} s={[2.4, 0.06, 0.06]} c="#6b4a2c" />
        {Array.from({ length: 17 }, (_, i) => <Box key={i} p={[-1.15 + i * 0.144, 0.24, -0.95]} s={[0.03, 0.44, 0.03]} c="#7a5a3a" />)}
        {[-1.1, 1.1].map((x, i) => <Cyl key={i} p={[x, 0.9, -0.85]} r={0.02} h={1.8} c="#6b4a2c" />)}
        <Rod p={[0, 1.7, -0.85]} w={2.3} r={0.025} c="#9bb06a" m={0} />
        <Dial p={[0.55, 1.95, -1.0]} ang={(7 + hr) / 12 * Math.PI * 2} s={0.55} />
        {hang.map((k, i) => k > 0.02 && <group key={i} position={[-0.75 + i * 0.4, 1.7 + 0.3 * (1 - Math.min(1, k)), -0.85]}>{i % 2 ? <Cloth p={[0, 0, 0]} w={0.3} h={0.5} c={["#f4f1ea", "#e7d4ae", "#9db2c9", "#c0392b"][i]} /> : <Shirt p={[0, 0, 0]} c={["#f7f4ee", "#e7d4ae", "#9db2c9", "#c0392b"][i]} s={0.85} />}</group>)}
        <Steam p={[0.62, 1.3, -0.15]} t={tt} k={0.6} n={4} />
        <Sachi p={withHands(PZ.stand, (q: any) => { const r = Math.sin(tt * 2.6); q.manoI = { ...q.manoI, p: [0.25, 0.75 + 0.15 * r, 0.35] }; q.manoD = { ...q.manoD, p: [-0.25, 0.75 - 0.15 * r, 0.35] }; })} t={tt} x={0.95} z={-0.35} rotY={-110} s={S} expr="feliz" />
      </>; }} />;

// 12:46 · a mediodía se da vuelta todo: el reloj marca las 12, la toalla doblada sobre la soga gira, el jean se pone del revés; la cara húmeda (azul) mira al aire y se seca
export const G_noonturn: F = ({ t, h }) =>
  <Hero d={1.0} ly={0.1} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.15, 1.35, 2.3], [-0.1, 1.25, -0.5]), C([-0.3, 1.35, 2.3], [-0.1, 1.25, -0.5]), 9)}
    set={(tt: number) => ({ ...LAU, warm: 0.7, spot: [0, 0, -0.4] as V, spotK: 0.55 })}
    scene={(tt) => { const tick = eio(tt, 0.4, 3.2), drp = phys(tt, 0.2, 6, 0.4), turn = eio(tt, 3.4, 4.8), dry = eio(tt, 5.0, 8.0), sp = sv(tt, 7.2, 7.8) * (1 - sv(tt, 8.4, 8.9));
      const wetc = dry > 0.5 ? "#7f9cbd" : "#1d2c42";
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.6} h={2.4} />
        <Dial p={[-0.72, 1.45, -0.8]} ang={(10.5 + 1.5 * tick) / 12 * Math.PI * 2} s={0.85} sweep={0.125 * tick} />
        <Cord a={[-0.25, 1.9, -0.5]} b={[1.1, 1.9, -0.5]} w={0.012} c="#d9d2c4" />
        <group position={[0.35, 1.9 + 0.4 * (1 - Math.min(1, drp)), -0.5]} rotation={[0, Math.PI * turn, 0]}>
          <Jeans p={[0, 0, 0.02]} s={1.35} />
          <group position={[0, 0, -0.03]} rotation={[0, Math.PI, 0]} scale={1.35}>
            <Box p={[0, -0.03, 0]} s={[0.36, 0.06, 0.05]} c="#16202f" />
            {[-1, 1].map((k) => <Box key={k} p={[k * 0.09, -0.42, 0]} s={[0.16, 0.74, 0.04]} c={wetc} r={0.9} rad={0.015} />)}
            {[-1, 1].map((k) => <Box key={"w" + k} p={[k * 0.09, -0.3 - 0.2 * dry, 0.022]} s={[0.15, 0.4 * (1 - dry) + 0.01, 0.003]} c="#0f1a28" op={0.6 * (1 - dry)} />)}
          </group>
        </group>
        <Sun p={[1.2, 2.1, -0.85]} r={0.2} k={1} c="#ffc24a" />
        {sp > 0.02 && [0, 1, 2, 3, 4, 5].map((i) => <mesh key={i} position={[0.35 + 0.3 * Math.cos(i * 1.05 + tt), 1.35 + 0.35 * Math.sin(i * 1.7 + tt), -0.3]} rotation={[0, 0, Math.PI / 4]} scale={sp * (0.7 + 0.3 * Math.sin(tt * 3 + i))}><octahedronGeometry args={[0.035, 0]} /><meshBasicMaterial color="#fff4c4" toneMapped={false} /></mesh>)}
        <Sachi p={withHands(PZ.stand, (q: any) => { const g = sv(tt, 2.8, 3.3) * (1 - sv(tt, 4.9, 5.4)); q.manoI = { ...q.manoI, p: [0.4, 0.75 * g, 0.55] }; q.manoD = { ...q.manoD, p: [-0.1, 0.75 * g, 0.55] }; })} t={tt} x={1.0} z={-0.35} rotY={-55} s={S} expr={dry > 0.6 ? "feliz" : "decidido"} />
      </>; }} />;

// 13:35 · apenas termina el lavarropas: dos lavarropas iguales; el de la izquierda queda cerrado y el reloj corre 3 horas (olor agrio adentro); del de la derecha ella saca todo al instante y brilla limpio
export const G_rightaway: F = ({ t, h }) =>
  <Hero d={1.05} ly={0.15} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.3, 1.2, 2.7], [0.1, 0.65, -0.35]), C([-0.3, 1.2, 2.7], [0.1, 0.65, -0.35]), 9)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.3] as V, spotK: 0.55 })}
    scene={(tt) => { const done = sv(tt, 0.6, 1.0), op = eio(tt, 1.4, 2.2), hrs = eio(tt, 1.4, 6.0), stink = sv(tt, 2.6, 4.0), sp = sv(tt, 3.6, 4.4);
      return <>
        <Wallp p={[0, 0, -0.75]} w={3.8} h={2.2} />
        <Washer p={[-0.65, 0, -0.35]} ang={0} fill={0.8} light={done > 0.5 ? 1 : 0} c={stink > 0.5 ? "#e4e6dc" : "#f3f2ee"} />
        <Washer p={[0.25, 0, -0.35]} ang={0} fill={0.8 * (1 - eio(tt, 2.2, 3.6))} door={op} light={done > 0.5 ? 1 : 0} />
        <Dial p={[-0.2, 1.35, -0.65]} ang={hrs * Math.PI * 2 * 3} s={0.55} sweep={hrs * 0.25} />
        <group scale={2} position={[-0.65, 0.8, -0.2]}><Stink p={[0, 0, 0]} t={tt} k={stink} n={8} /></group>
        {[0, 1, 2].map((i) => { const u = eio(tt, 2.2 + i * 0.45, 2.9 + i * 0.45); return u > 0.02 && <group key={i} position={[lerp(0.25, 0.85, u), lerp(0.4, 0.3, u) + 0.35 * Math.sin(Math.PI * u), lerp(0.0, 0.05, u)]} rotation={[0, 0, u * 3]}><Shirt p={[0, 0.1, 0]} c={DRUM[i + 2]} s={0.45} hang={false} /></group>; })}
        <Basket p={[0.85, 0, 0.05]} full={eio(tt, 2.6, 3.8)} />
        {sp > 0.02 && [0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[0.85 + 0.25 * Math.cos(i * 1.26 + tt), 0.45 + 0.12 * Math.sin(i * 2 + tt * 2), 0.05]} rotation={[0, 0, Math.PI / 4]} scale={sp * (0.6 + 0.4 * Math.sin(tt * 3 + i))}><octahedronGeometry args={[0.035, 0]} /><meshBasicMaterial color="#fff4c4" toneMapped={false} /></mesh>)}
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-0.3, -0.3 + 0.25 * Math.sin(Math.PI * eio(tt, 2.2, 3.6)), 0.7] }; })} t={tt} x={0.75} z={0.35} rotY={-60} s={S * 0.92} expr={tt > 3.6 ? "feliz" : "decidido"} />
      </>; }} />;

// 13:55 · el sótano frío y oscuro vs el cuarto luminoso: a la izquierda un cuarto oscuro sin ventana donde la ropa gotea; ella empuja el tendedero hacia la derecha, al cuarto con ventana soleada, y la ropa se seca
export const G_basement: F = ({ t, h }) =>
  <Hero d={1.05} ly={0.15} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.15, 1.25, 3.0], [0.0, 0.8, -0.5]), C([-0.15, 1.25, 3.0], [0.0, 0.8, -0.5]), 9)}
    set={(tt: number) => ({ floor: "wood" as const, warm: 0.5, bg: "#cdc3b2", spot: [0.6, 0, -0.4] as V, spotK: 0.5 })}
    scene={(tt) => { const mv = eio(tt, 2.2, 5.2), x = lerp(-0.75, 0.6, mv), warm = sv(tt, 5.0, 6.4);
      return <>
        <Box p={[-0.7, 1.1, -1.0]} s={[1.4, 2.2, 0.05]} c="#2c323e" />
        <Box p={[-0.7, 0.005, -0.4]} s={[1.4, 0.01, 1.3]} c="#30363f" />
        <Box p={[-1.4, 1.1, -0.4]} s={[0.05, 2.2, 1.3]} c="#262b35" />
        <Box p={[-0.7, 2.2, -0.4]} s={[1.4, 0.05, 1.3]} c="#1f232b" />
        <Box p={[0.0, 0.95, -0.4]} s={[0.06, 1.9, 0.05]} c="#8a6a48" />
        <Box p={[0.7, 1.1, -1.0]} s={[1.4, 2.2, 0.05]} c="#f2e8d4" />
        <Win p={[0.75, 1.25, -0.96]} w={0.75} h={0.7} sky="#f6dca6" />
        <group position={[x, 0, -0.45]}><Rack p={[0, 0, 0]} w={0.55} h={0.95} />{[0, 1, 2].map((i) => <Cloth key={i} p={[-0.18 + i * 0.18, 0.95, -0.05]} w={0.14} h={0.36} c={DRUM[i]} wet={1 - warm} sway={0.05 * Math.sin(tt * 2 + i) * warm} />)}</group>
        <Drops a={[x, 0.55, -0.45]} t={tt} k={1 - mv} n={10} len={0.5} w={0.4} />
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.45, -0.3, 0.55] }; q.manoD = { ...q.manoD, p: [0.25, -0.3, 0.6] }; })} t={tt} x={x - 0.5} z={-0.75} rotY={80} s={S} expr={warm > 0.3 ? "feliz" : "pensativo"} />
      </>; }} />;

// 14:30 · dos ventanas en lados opuestos: casa en corte con nieve afuera; las dos ventanas se abren, el aire cruza en línea recta por la ropa y el reloj marca 10 minutos
export const G_crossbreeze: F = ({ t, h }) =>
  <Hero d={1.0} ly={0.15} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.25, 1.35, 2.7], [0.0, 1.0, -0.5]), C([-0.25, 1.35, 2.7], [0.0, 1.0, -0.5]), 9)}
    set={(tt: number) => ({ ...LAU, bg: "#c9d6e0", warm: 0.4, spot: [0, 0, -0.4] as V, spotK: 0.5 })}
    scene={(tt) => { const o1 = eio(tt, 0.8, 1.6), o2 = eio(tt, 1.8, 2.6), air = sv(tt, 2.6, 3.2), tm = eio(tt, 3.0, 8.0);
      return <>
        <Wallp p={[0, 0, -1.0]} w={3.8} h={2.4} />
        {[-1, 1].map((k) => <group key={k} position={[k * 0.95, 1.25, -0.95]}><Win p={[0, 0, 0]} w={0.6} h={0.7} sky="#dfe9f1" />
          {Array.from({ length: 9 }, (_, i) => { const u = (tt * 0.3 + i * 0.11) % 1; return <mesh key={i} position={[-0.25 + ((i * 0.37) % 1) * 0.5, 0.33 - 0.66 * u, 0.012]}><circleGeometry args={[0.012, 10]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>; })}
          <Box p={[-0.15 * k - 0.0 + 0.3 * k * (k < 0 ? o1 : o2), 0, 0.05]} s={[0.29, 0.68, 0.02]} c="#dfe9ef" op={0.6} /></group>)}
        <Rack p={[0, 0, -0.45]} w={1.0} />
        {[0, 1, 2, 3].map((i) => <Cloth key={i} p={[-0.38 + i * 0.25, 1.06, -0.55]} w={0.2} h={0.45} c={DRUM[i + 1]} sway={(0.35 * Math.sin(tt * 3 + i * 0.7) + 0.2) * air} wet={1 - tm} />)}
        {[0.85, 1.05, 1.3].map((y, i) => <Wind key={i} a={[-0.95, y + 0.1, -0.9]} b={[0.95, y, -0.9]} t={tt + i * 0.2} k={air} n={12} />)}
        <Dial p={[0.0, 1.95, -0.92]} ang={tm * Math.PI * 2 / 6} s={0.4} sweep={tm / 6} />
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-0.3, 0.3, 0.6] }; })} t={tt} x={-1.2} z={-0.2} rotY={45} s={S} expr="feliz" />
      </>; }} />;

// 14:59 · gotas en el vidrio cada mañana: la ventana se llena de gotitas que crecen y corren; la aguja del higrómetro pasa al rojo; ella levanta el canasto y lo lleva hacia la puerta del baño que se ilumina
export const G_windowdrops: F = ({ t, h }) =>
  <Hero d={0.97} ly={0.15} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.15, 1.3, 2.3], [-0.1, 1.0, -0.5]), C([-0.4, 1.3, 2.35], [-0.1, 1.0, -0.5]), 9)}
    set={(tt: number) => ({ ...LAU, warm: 0.45, spot: [0, 0, -0.4] as V, spotK: 0.45 })}
    scene={(tt) => { const g = eio(tt, 0.4, 3.0), nd = sv(tt, 2.0, 3.6), go = eio(tt, 4.4, 7.6), dg = sv(tt, 4.0, 4.8);
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.6} h={2.4} />
        <Win p={[-0.5, 1.3, -0.85]} w={0.9} h={0.9} sky="#b9c9d6" />
        {Array.from({ length: 40 }, (_, i) => { const x = -0.92 + ((i * 0.37) % 1) * 0.84, y0 = 0.9 + ((i * 0.61) % 1) * 0.82, run = i % 5 === 0 ? ((tt * 0.25 + i * 0.1) % 1) * 0.3 * g : 0;
          return <mesh key={i} position={[x, y0 - run, -0.83]} scale={[1, 1.3, 0.5]}><sphereGeometry args={[0.008 + 0.014 * g * (0.5 + ((i * 0.29) % 1)), 10, 8]} /><meshStandardMaterial color="#e6f2fa" transparent opacity={0.85} roughness={0.05} metalness={0.2} /></mesh>; })}
        <group position={[-1.2, 1.3, -0.85]}><Dial p={[0, 0, 0]} ang={-0.8 + 1.7 * nd} s={0.45} c="#f6f1e7" sweep={0} marks={8} /><mesh position={[0.08, 0.03, 0.066]}><ringGeometry args={[0.1, 0.14, 24, 1, -0.2, 0.9]} /><meshBasicMaterial color="#e05a4a" toneMapped={false} /></mesh></group>
        <Door p={[1.2, 0, -0.85]} open={0.5 * dg} c="#c9b28a" />
        <Glow p={[1.2, 1.0, -0.7]} r={0.5} k={dg} c="#fff0c8" op={0.3} />
        <Basket p={[lerp(0.15, 0.95, go), 0.0 + 0.45 * Math.sin(Math.PI * Math.min(1, go * 1.5)) * (go > 0.02 ? 1 : 0), -0.15]} />
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.3, -0.5 + 0.3 * (go > 0.02 ? 1 : 0), 0.6] }; q.manoD = { ...q.manoD, p: [-0.3, -0.5 + 0.3 * (go > 0.02 ? 1 : 0), 0.6] }; q.cabeza = { ...(q.cabeza || {}), y: 30 * (1 - dg) }; })} t={tt} x={lerp(0.25, 0.75, go)} z={0.1} rotY={lerp(-20, -90, dg)} s={S} expr={nd > 0.5 && go < 0.1 ? "pensativo" : "feliz"} />
      </>; }} />;

// 15:47 · suave como una nube: la toalla en la soga flamea con el viento, se infla y por un momento ES una nube; vuelve a ser toalla esponjosa y ella la abraza
const CLOUD: [number, number, number, number][] = [[0, 0, 0, 0.2], [-0.22, -0.04, 0.02, 0.16], [0.22, -0.03, 0.02, 0.17], [-0.1, 0.12, 0, 0.16], [0.12, 0.13, 0.01, 0.15], [-0.36, -0.08, -0.02, 0.11], [0.37, -0.07, -0.01, 0.12], [0, -0.1, 0.08, 0.15], [-0.18, 0.04, 0.1, 0.12], [0.18, 0.05, 0.1, 0.12], [0.02, 0.22, -0.02, 0.11]];
export const G_cloud: F = ({ t, h }) =>
  <Hero d={1.0} ly={0.15} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.25, 1.3, 2.3], [0.15, 1.2, -0.6]), C([-0.2, 1.3, 2.3], [0.15, 1.2, -0.6]), 9)}
    set={(tt: number) => ({ floor: "wood" as const, wall: false, warm: 0.65, bg: "#bcd7ea", spot: [0, 0, -0.4] as V, spotK: 0.5 })}
    scene={(tt) => { const toC = eio(tt, 2.8, 3.9), back = eio(tt, 5.4, 6.3), cl2 = toC * (1 - back), take = eio(tt, 6.6, 7.6), wind = (1 - take) * (1 - cl2);
      return <>
        <Box p={[0, 1.2, -1.6]} s={[5, 2.6, 0.05]} c="#cfe5f3" r={1} />
        {[-0.85, 0.85].map((x, i) => <Cyl key={i} p={[x, 0.85, -0.7]} r={0.025} h={1.7} c="#8a6a48" />)}
        <Cord a={[-0.85, 1.65, -0.7]} b={[0.85, 1.65, -0.7]} w={0.008} c="#d9d2c4" />
        {take < 0.98 && cl2 < 0.97 && <group position={[0, 1.65, -0.7]} scale={[1 - 0.6 * cl2, 1 - 0.6 * cl2, 1]}><Cloth p={[0, 0, 0]} w={0.6} h={0.66} c="#f8f4ec" band="#e88a8a" puff={back} sway={(0.5 * Math.sin(tt * 3.4) + 0.4) * wind} /></group>}
        {cl2 > 0.03 && <group position={[0, 1.35 + 0.03 * Math.sin(tt * 2), -0.62]} scale={cl2 * 1.5}>{CLOUD.map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]}><sphereGeometry args={[r, 22, 16]} /><meshStandardMaterial color="#ffffff" roughness={1} emissive="#ffffff" emissiveIntensity={0.15} /></mesh>)}</group>}
        {[1.0, 1.3, 1.6].map((y, i) => <Wind key={i} a={[-1.5, y, -0.5]} b={[1.5, y + 0.1, -0.6]} t={tt + i * 0.3} k={wind + cl2 * 0.6} n={8} />)}
        {take > 0.02 && <group position={[lerp(0, 0.42, take), lerp(1.35, 1.1, take), lerp(-0.7, 0.02, take)]}><Box p={[0, 0, 0]} s={[0.4, 0.26, 0.18]} c="#f8f4ec" r={1} rad={0.1} /><Box p={[0, -0.1, 0.09]} s={[0.38, 0.03, 0.01]} c="#e88a8a" /></group>}
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.2, 0.3 + 0.1 * take, 0.5] }; q.manoD = { ...q.manoD, p: [-0.2, 0.3 + 0.1 * take, 0.5] }; })} t={tt} x={0.45} z={-0.1} rotY={-20} s={S} expr={take > 0.4 || cl2 > 0.5 ? "enamorado" : "feliz"} />
      </>; }} />;

// 16:26 · anotá los dos números: cuaderno abierto sobre la mesa; el lápiz dibuja la barra del mes de verano (corta), la del invierno con secadora (larga) y la del mes a su manera (corta, verde)
export const G_notebook: F = ({ t, h }) => { const tN = useLab();
  return <Hero d={1.0} ly={0.0} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.15, 1.35, 0.55], [0.0, 0.44, -0.36]), C([-0.12, 1.4, 0.6], [0.0, 0.44, -0.34]), 8)}
    set={(tt: number) => ({ floor: "wood" as const, warm: 0.65, spot: [0, 0, -0.35] as V, spotK: 0.6 })}
    scene={(tt) => { const b1 = eio(tt, 0.6, 1.6), b2 = eio(tt, 2.0, 3.6), b3 = eio(tt, 4.4, 5.6), pen: V = tt < 2 ? [-0.15 + 0.2 * b1, 0.46, -0.48] : tt < 4.2 ? [-0.15 + 0.5 * b2, 0.46, -0.36] : [-0.15 + 0.22 * b3, 0.46, -0.24];
      return <>
        <Table p={[0, 0, -0.35]} w={1.2} d={0.8} h={0.42} />
        <Box p={[-0.13, 0.435, -0.35]} s={[0.4, 0.012, 0.46]} c="#fbf7ee" r={0.9} rot={[0, 0, 0.03]} />
        <Box p={[0.27, 0.435, -0.35]} s={[0.4, 0.012, 0.46]} c="#fbf7ee" r={0.9} rot={[0, 0, -0.03]} />
        <Box p={[0.07, 0.438, -0.35]} s={[0.01, 0.012, 0.46]} c="#d9cdb8" />
        <Sign p={[-0.26, 0.445, -0.48]} w={0.08} h={0.06} map={tN.sun} rot={[-Math.PI / 2, 0, 0]} />
        <Sign p={[-0.26, 0.445, -0.36]} w={0.08} h={0.06} map={tN.snow} rot={[-Math.PI / 2, 0, 0]} />
        <Sign p={[-0.26, 0.445, -0.24]} w={0.08} h={0.06} map={tN.hang} rot={[-Math.PI / 2, 0, 0]} />
        <Bar p={[-0.2, 0.448, -0.48]} w={0.2} k={b1} c="#c9a24e" />
        <Bar p={[-0.2, 0.448, -0.36]} w={0.52} k={b2} c="#c0392b" />
        <Bar p={[-0.2, 0.448, -0.24]} w={0.22} k={b3} c="#5aa05a" />
        <group position={[pen[0], pen[1] + 0.07, pen[2]]} rotation={[0.5, 0, -0.4]}><Cyl p={[0, 0, 0]} r={0.009} h={0.18} c="#f2c14e" /><Cyl p={[0, -0.095, 0]} r={0.009} r2={0.001} h={0.02} c="#2a2420" /></group>
      </>; }} />; };

// 17:17 · una taza de vinagre blanco: la toalla que huele agrio; la botella vuelca una taza en el cajón del lavarropas; la toalla sale al sol y el olor se corta con un brillo
export const G_vinegar: F = ({ t, h }) => { const tV = useLab();
  return <Hero d={1.0} ly={0.05} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.25, 1.45, 2.45], [0.0, 1.0, -0.3]), C([-0.2, 1.45, 2.5], [0.0, 1.0, -0.3]), 7)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.3] as V, spotK: 0.55 })}
    scene={(tt) => { const drw = eio(tt, 0.4, 1.0), pour = sv(tt, 1.2, 1.7) * (1 - sv(tt, 3.0, 3.4)), shut = eio(tt, 3.4, 3.9), sun = eio(tt, 4.0, 5.0), stink = (1 - eio(tt, 4.4, 5.4));
      return <>
        <Wallp p={[0, 0, -0.75]} w={3.6} h={2.3} />
        <Washer p={[-0.45, 0, -0.35]} ang={tt * 0.8} fill={0.5} light={1} />
        <Box p={[-0.6, 0.79, -0.05 + 0.18 * drw * (1 - shut)]} s={[0.22, 0.07, 0.2]} c="#e2e5e9" r={0.4} />
        <Box p={[-0.6, 0.8, -0.05 + 0.18 * drw * (1 - shut)]} s={[0.18, 0.04, 0.16]} c="#c9d6e0" r={0.2} />
        <group position={[-0.32 - 0.1 * pour, 0.87 + 0.15 * pour, 0.0 + 0.14 * pour]} rotation={[0, 0, 1.9 * pour]} scale={1.4}><Cyl p={[0, 0.12, 0]} r={0.065} h={0.24} c="#f6f6f3" op={0.92} rough={0.1} /><Cyl p={[0, 0.27, 0]} r={0.024} h={0.06} c="#c0392b" /><Sign p={[0, 0.1, 0.067]} w={0.1} h={0.08} map={tV.vin} /></group>
        {pour > 0.3 && <Cyl p={[-0.6, 0.9, 0.14]} r={0.02} h={0.22} c="#d6ecf6" op={0.9} />}
        <group position={[0.3, 1.45, -0.3]}><Cloth p={[0, 0, 0]} w={0.6} h={0.7} c="#f1ebdd" band="#7a8f6a" puff={0.4 + 0.6 * sun} /></group>
        <group scale={1.6} position={[0.3, 0.85, -0.2]}><Stink p={[0, 0, 0]} t={tt} k={stink} n={7} /></group>
        <Sun p={[1.15, 1.95, -0.7]} r={0.14} k={sun} />
        {sun > 0.3 && [0, 1, 2, 3, 4, 5].map((i) => <mesh key={i} position={[0.4 + 0.32 * Math.cos(i * 1.05 + tt), 1.05 + 0.3 * Math.sin(i * 1.7 + tt), -0.2]} rotation={[0, 0, Math.PI / 4]} scale={sun * (0.6 + 0.4 * Math.sin(tt * 3 + i))}><octahedronGeometry args={[0.03, 0]} /><meshBasicMaterial color="#fff4c4" toneMapped={false} /></mesh>)}
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-0.3, 0.35, 0.5] }; })} t={tt} x={0.62} z={-0.25} rotY={-55} s={S} expr={stink > 0.5 && tt > 3.4 ? "asqueado" : "feliz"} />
      </>; }} />; };

// 17:30 · sábanas sobre dos sillas: la sábana se dobla en dos en el aire, cae sobre los respaldos de dos sillas espalda con espalda y queda un túnel por donde pasa el aire
export const G_twochairs: F = ({ t, h }) =>
  <Hero d={0.95} ly={0.1} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([1.2, 1.3, 2.0], [0.0, 0.6, -0.35]), C([0.5, 1.3, 2.3], [0.0, 0.6, -0.35]), 9)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.35] as V, spotK: 0.55 })}
    scene={(tt) => { const fold = eio(tt, 0.8, 2.4), fall = eio(tt, 2.8, 4.2), air = sv(tt, 4.6, 5.4), gap = 0.62;
      return <>
        <Wallp p={[0, 0, -1.1]} w={3.6} h={2.3} />
        <Chair p={[-gap / 2 - 0.02, 0, -0.35]} rotY={-90} c="#8a5a34" />
        <Chair p={[gap / 2 + 0.02, 0, -0.35]} rotY={90} c="#8a5a34" />
        {fall < 0.02 && <group position={[0, 1.45, -0.35]} rotation={[0, 0, 0]}><Box p={[0, 0, 0]} s={[lerp(1.6, 0.85, fold), 0.012, 0.9]} c="#f1eee6" r={0.98} rot={[-1.1 + 0.15 * Math.sin(tt * 2), 0, 0]} /><Box p={[0, -0.0, 0.01]} s={[lerp(1.6, 0.85, fold), 0.03, 0.004]} c="#9db2c9" rot={[-1.1, 0, 0]} /></group>}
        {fall >= 0.02 && <group position={[0, lerp(1.45, 1.05, fall), -0.35]} rotation={[0, Math.PI / 2, 0]}><Sheet p={[0, 0, 0]} w={0.9} gap={gap + 0.12} h={0.7} k={fall} /></group>}
        {[0.55, 0.75].map((y, i) => <Wind key={i} a={[0, y, 0.9]} b={[0, y, -1.0]} t={tt + i * 0.3} k={air} n={12} />)}
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.35, 0.55 * (1 - fall), 0.5] }; q.manoD = { ...q.manoD, p: [-0.35, 0.55 * (1 - fall), 0.5] }; })} t={tt} x={-1.05} z={-0.1} rotY={60} s={S} expr="feliz" />
      </>; }} />;

// 18:34 · el rollo de toalla: el jean sobre la toalla grande, la toalla se enrolla como un sushi y ella camina encima; el agua pasa al rollo (se oscurece) y el jean sale casi seco
export const G_towelroll: F = ({ t, h }) =>
  <Hero d={1.0} ly={0.0} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.15, 1.3, 0.8], [0.0, 0.0, -0.3]), C([-0.15, 1.32, 0.85], [0.0, 0.0, -0.3]), 9)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.3] as V, spotK: 0.6 })}
    scene={(tt) => { const roll = eio(tt, 0.8, 3.4), press = sv(tt, 3.6, 4.0) * (1 - sv(tt, 5.8, 6.2)), pr = eio(tt, 3.6, 5.8), unr = eio(tt, 6.3, 7.6), k = roll * (1 - unr), R = 0.04 + 0.1 * k, L = 1.0 * (1 - k) + 0.02, X1 = 0.5, Lj = Math.max(0, Math.min(0.78, L - 0.1));
      const tc = pr > 0.2 && unr < 0.5 ? "#8fa7bd" : "#efe7d6", rx = X1 - L, sp = sv(tt, 7.4, 7.9);
      return <>
        <mesh position={[rx + 0.05, 0.002, -0.3]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.04 + 0.22 * pr * (1 - unr * 0.5), 32]} /><meshStandardMaterial color="#5f7f9c" transparent opacity={0.55} roughness={0.1} /></mesh>
        <Box p={[X1 - L / 2, 0.008, -0.3]} s={[L, 0.012, 0.6]} c={tc} r={0.98} />
        {Array.from({ length: 3 }, (_, i) => <Box key={i} p={[X1 - L / 2, 0.016, -0.5 + i * 0.2]} s={[L, 0.002, 0.03]} c="#d98a8a" cast={false} />)}
        {Lj > 0.02 && <group position={[X1 - 0.05 - Lj / 2, 0.024, -0.3]}><Box p={[0, 0, -0.09]} s={[Lj, 0.014, 0.17]} c={unr > 0.5 ? "#6a8ab0" : "#2f4866"} r={0.9} rad={0.006} /><Box p={[0, 0, 0.09]} s={[Lj, 0.014, 0.17]} c={unr > 0.5 ? "#6a8ab0" : "#2f4866"} r={0.9} rad={0.006} /><Box p={[Lj / 2 - 0.04, 0.003, 0]} s={[0.08, 0.014, 0.38]} c="#24364f" /><Box p={[0, 0.009, -0.09]} s={[Lj, 0.003, 0.005]} c="#e0a64a" /><Box p={[0, 0.009, 0.09]} s={[Lj, 0.003, 0.005]} c="#e0a64a" /></group>}
        {k > 0.02 && <Cyl p={[rx, R * (1 - 0.25 * press), -0.3]} r={R} h={0.62} c={tc} rot={[Math.PI / 2, 0, 0]} rough={1} />}
        {k > 0.3 && [-0.45, -0.15].map((z, i) => <mesh key={i} position={[rx + 0.02, 2 * R + 0.06 - 0.06 * press + 0.25 * (1 - sv(tt, 3.0, 3.6)), z]} scale={[1, 0.8, 1.2]}><sphereGeometry args={[0.07, 18, 14]} /><meshStandardMaterial color="#f4f1ea" roughness={0.6} /></mesh>)}
        {press > 0.05 && Array.from({ length: 8 }, (_, i) => { const u = (tt * 1.4 + i * 0.29) % 1; return <mesh key={"d" + i} position={[rx + (i % 2 ? 1 : -1) * (R + 0.02), R * (1 - u), -0.55 + i * 0.07]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.022, 10, 8]} /><meshStandardMaterial color="#3d6f9a" transparent opacity={0.9 * (1 - u)} roughness={0.1} /></mesh>; })}
        {sp > 0.02 && [0, 1, 2, 3, 4].map((i) => <mesh key={"s" + i} position={[0.1 + 0.25 * Math.cos(i * 1.3 + tt), 0.12 + 0.06 * i, -0.3 + 0.2 * Math.sin(i * 1.7 + tt)]} rotation={[0, 0, Math.PI / 4]} scale={sp}><octahedronGeometry args={[0.03, 0]} /><meshBasicMaterial color="#fff4c4" toneMapped={false} /></mesh>)}
      </>; }} />;

// 19:09 · bolsillos afuera: el jean colgado cabeza abajo de la cintura; los bolsillos salen hacia afuera con un brillo y la última gota del bolsillo deja de caer
export const G_pockets: F = ({ t, h }) =>
  <Hero d={1.0} ly={0.15} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.35, 1.5, 1.9], [0.15, 1.35, -0.45]), C([-0.2, 1.5, 1.95], [0.15, 1.35, -0.45]), 9)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.4] as V, spotK: 0.55 })}
    scene={(tt) => { const hang = phys(tt, 0.4, 6, 0.4), pk1 = phys(tt, 2.2, 7, 0.4), pk2 = phys(tt, 2.9, 7, 0.4), dry = eio(tt, 3.8, 7.0), pk = Math.min(1, Math.min(pk1, pk2) * 0.5 + Math.max(pk1, pk2) * 0.5);
      return <>
        <Wallp p={[0, 0, -0.85]} w={3.4} h={2.4} />
        <Rod p={[0, 1.95, -0.45]} w={1.6} r={0.016} />
        <group position={[0, 1.92 + 0.3 * (1 - Math.min(1, hang)), -0.45]}><Jeans p={[0, 0, 0]} pk={Math.min(1, pk)} s={1.1} /></group>
        {[-1, 1].map((k) => { const y = -0.4 * ((tt * 1.1 + (k + 1) * 0.3) % 1); return <mesh key={k} position={[k * 0.2, 1.6 + y * (1 - dry) - 0.25 * dry, -0.36]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.022, 12, 10]} /><meshStandardMaterial color="#6fa8d6" transparent opacity={0.95 * (1 - dry)} roughness={0.1} /></mesh>; })}
        {(() => { const f = eio(tt, 3.0, 4.6), y = 1.62 - 0.35 * f, sp = sv(tt, 4.6, 5.0) * (1 - sv(tt, 6.4, 7.0)); return <><mesh position={[0.17, y, -0.36]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.04, 16, 12]} /><meshStandardMaterial color="#5fa0d6" transparent opacity={0.95} roughness={0.05} /></mesh>{sp > 0.02 && <mesh position={[0.17, y + 0.02, -0.3]} rotation={[0, 0, Math.PI / 4]} scale={sp}><octahedronGeometry args={[0.06, 0]} /><meshBasicMaterial color="#fff4c4" toneMapped={false} /></mesh>}</>; })()}
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.3, 0.55 * sv(tt, 1.8, 2.4) * (1 - sv(tt, 3.6, 4.2)), 0.6] }; })} t={tt} x={0.62} z={-0.3} rotY={-45} s={S} expr={pk > 0.5 ? "feliz" : "decidido"} />
      </>; }} />;

// 19:24 · el suéter mojado colgado se estira hasta ser un vestido; el otro, acostado sobre la rejilla, queda con su forma; ella le da forma con las manos
export const G_sweater: F = ({ t, h }) => { const K = useKnit();
  return <Hero d={0.95} ly={0.1} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.35, 1.35, 2.3], [0.0, 0.95, -0.4]), C([-0.3, 1.35, 2.3], [0.0, 0.95, -0.4]), 9)}
    set={(tt: number) => ({ ...LAU, spot: [0, 0, -0.35] as V, spotK: 0.55 })}
    scene={(tt) => { const st = eio(tt, 0.8, 3.6), pat = sv(tt, 4.0, 4.6) * (1 - sv(tt, 6.6, 7.2));
      return <>
        <Wallp p={[0, 0, -0.85]} w={3.6} h={2.4} />
        <Rod p={[-0.5, 1.9, -0.5]} w={0.9} r={0.016} />
        <group position={[-0.5, 1.86, -0.5]}><Hanger p={[0, 0.0, 0]} />
          <Box p={[0, -0.24 - 0.35 * st, 0]} s={[0.4 - 0.08 * st, 0.48 + 0.7 * st, 0.06]} c="#b8483a" map={K.red} r={1} rad={0.02} />
          {[-1, 1].map((k) => <Box key={k} p={[k * (0.25 - 0.03 * st), -0.25 - 0.25 * st, 0]} s={[0.1, 0.38 + 0.5 * st, 0.055]} c="#b8483a" map={K.red} r={1} rot={[0, 0, k * (0.3 - 0.25 * st)]} rad={0.02} />)}
          <Drops a={[0, -0.75 - 0.7 * st, 0]} t={tt} k={0.8} n={4} len={0.3} w={0.3} />
        </group>
        <Table p={[0.5, 0, -0.4]} w={0.9} d={0.6} h={0.55} c="#a8865c" />
        {Array.from({ length: 9 }, (_, i) => <Box key={i} p={[0.14 + i * 0.09, 0.6, -0.4]} s={[0.012, 0.012, 0.56]} c="#c9ced4" m={0.6} />)}
        <group position={[0.5, 0.63, -0.4]}>
          <Box p={[0, 0, 0]} s={[0.4, 0.05, 0.46]} c="#b8483a" map={K.red} r={1} rad={0.02} />
          {[-1, 1].map((k) => <Box key={k} p={[k * 0.29, 0, 0.0]} s={[0.17, 0.045, 0.42]} c="#b8483a" map={K.red} r={1} rot={[0, k * 0.12, 0]} rad={0.02} />)}
        </group>
        <Sachi p={withHands(PZ.stand, (q: any) => { const r = Math.sin(tt * 6) * 0.05 * pat; q.manoI = { ...q.manoI, p: [0.22, -0.35 + r, 0.6] }; q.manoD = { ...q.manoD, p: [-0.22, -0.35 - r, 0.6] }; })} t={tt} x={0.5} z={0.15} rotY={180} s={S * 0.95} expr={st > 0.6 && pat < 0.3 ? "sorprendido" : "feliz"} />
      </>; }} />; };

// 19:59 · su día de lavado: un reloj grande sobre la mesa; la aguja recorre el día y en cada hora se para un objeto chiquito: el lavarropas a las 7, el canasto a las 8, el sol a las 12, la camisa en el ropero a la tarde
export const G_dayclock: F = ({ t, h }) =>
  <Hero d={0.88} ly={0.0} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.3, 1.5, 1.35], [0.0, 0.45, -0.4]), C([-0.3, 1.5, 1.35], [0.0, 0.45, -0.4]), 9)}
    set={(tt: number) => ({ floor: "wood" as const, warm: 0.6, spot: [0, 0, -0.4] as V, spotK: 0.6 })}
    scene={(tt) => { const hr = 7 + 10 * eio(tt, 0.4, 8.2), hs = [7, 8, 12, 16], R = 0.42;
      const at = (hh: number): V => { const a = (hh / 12) * Math.PI * 2; return [Math.sin(a) * R, 0.49, -0.4 - Math.cos(a) * R]; };
      return <>
        <Table p={[0, 0, -0.4]} w={1.4} d={1.1} h={0.42} />
        <Cyl p={[0, 0.44, -0.4]} r={0.55} h={0.04} c="#f6f1e7" />
        <mesh position={[0, 0.462, -0.4]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.53, 0.56, 64]} /><meshStandardMaterial color={brass} metalness={0.7} roughness={0.3} /></mesh>
        {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <Box key={i} p={[Math.sin(a) * 0.5, 0.462, -0.4 - Math.cos(a) * 0.5]} s={[0.015, 0.004, 0.05]} c="#333" rot={[0, -a, 0]} />; })}
        <group position={[0, 0.47, -0.4]} rotation={[0, -(hr / 12) * Math.PI * 2, 0]}><Box p={[0, 0, -0.18]} s={[0.025, 0.01, 0.36]} c="#c0392b" /></group>
        <Cyl p={[0, 0.475, -0.4]} r={0.03} h={0.02} c="#222" />
        {hs.map((hh, i) => { const k = phys(tt, 0.4 + 8.2 * (hh - 7) / 10, 6, 0.4); if (k < 0.02) return null; const p = at(hh); return <group key={i} position={[p[0], p[1], p[2]]} scale={Math.min(1.1, k) * 0.32}>
          {i === 0 && <Washer p={[0, 0, 0]} fill={0.6} light={1} />}
          {i === 1 && <Basket p={[0, 0, 0]} />}
          {i === 2 && <Sun p={[0, 0.4, 0]} r={0.22} k={1} />}
          {i === 3 && <Shirt p={[0, 0.8, 0]} c="#9db2c9" />}</group>; })}
        <Glow p={[at(12)[0], 0.6, at(12)[2]]} r={0.12} k={sv(tt, 4.0, 4.6)} c={AMB} op={0.4} />
      </>; }} />;

// CUADRO 0 · la miniatura rehecha en código (sin texto ni flecha): ella riendo frente a la ventana soleada de invierno, camisas en perchas
// colgando de una caña y el pulpo con medias; a la izquierda la secadora desenchufada con el cable en el piso y una maceta arriba
export const G_cuadro0: F = ({ t, h }) =>
  <Hero d={0.84} ly={0.0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 1.15, 2.55], [0.0, 1.0, -0.5], 40), C([0.0, 1.15, 2.55], [0.0, 1.0, -0.5], 40), 12)}
    set={(tt: number) => ({ floor: "wood" as const, warm: 0.75, spot: [0.1, 0, -0.3] as V, spotK: 0.6 })}
    scene={(tt) => <>
      <Wallp p={[0, 0, -0.95]} w={4} h={2.6} />
      <Win p={[0.45, 1.35, -0.9]} w={1.3} h={1.1} sky="#f6dca6" />
      <Beam p={[0.25, 0.9, -0.4]} s={[0.9, 1.6, 0.05]} rot={[0.8, 0.2, 0.1]} k={1} />
      <Rod p={[0.45, 1.95, -0.6]} w={1.6} r={0.025} c="#9bb06a" m={0} />
      {[["#f7f4ee", -0.05], ["#9db2c9", 0.32], ["#e7d4ae", 0.69]].map(([c, x], i) => <Shirt key={i} p={[x as number, 1.89, -0.6]} c={c as string} s={0.9} />)}
      <group position={[1.12, 1.62, -0.6]} scale={0.6}><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.32, 0.02, 8, 32]} /><meshStandardMaterial color="#e88a8a" /></mesh>{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <HSock key={i} p={[Math.cos(i * 0.8) * 0.3, -0.05, Math.sin(i * 0.8) * 0.3]} c={DRUM[i % DRUM.length]} />)}</group>
      <Washer p={[-0.95, 0, -0.55]} dryer c="#ecebe6" fill={0} />
      <group position={[-1.02, 0.9, -0.6]}><Cyl p={[0, 0.08, 0]} r={0.09} r2={0.07} h={0.16} c="#b5523b" /><mesh position={[0, 0.25, 0]}><sphereGeometry args={[0.13, 18, 14]} /><meshStandardMaterial color="#5f8a4a" roughness={0.8} /></mesh></group>
      <Cord a={[-0.7, 0.15, -0.8]} b={[-0.45, 0.02, -0.2]} w={0.01} c="#2b2f36" />
      <Box p={[-0.43, 0.025, -0.18]} s={[0.05, 0.05, 0.06]} c="#2b2f36" rot={[0, 0, 1.2]} />
      <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.45, 0.35, 0.4] }; q.manoD = { ...q.manoD, p: [-0.4, -0.3, 0.45] }; })} t={1.0} x={-0.15} z={0.05} rotY={10} s={S} expr="carcajada" />
    </>} />;
