// ssl29e · la gimnasia de radio de la madre (Radio Taiso, 10 minutos cada mañana): componentes únicos en 3D. Cada uno = UNA idea con un objeto
// que se entiende sin leer, en el set de la casa de Sachiko con Blanquito-Sachiko haciendo el movimiento que ella cuenta.
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
import { armsUp, swing as swingP, sideBend, wings as wingsP, fold, sitTwist, head as headP, circle, lieLong } from "./mv";

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

// ================= componentes de ssl29e =================
const MOR = { floor: "tatami" as const, warm: 0.6 };
const WOOD = { floor: "wood" as const, warm: 0.55 };
const ANK = 0.09;
const loop = (tt: number, per: number) => 0.5 - 0.5 * Math.cos((tt / per) * Math.PI * 2);
// radio de madera de los años 30: caja, parlante de tela, dial ámbar
const Radio: React.FC<{ p: V; s?: number; glow?: number; rotY?: number }> = ({ p, s = 1, glow = 0, rotY = 0 }) => <group position={p} scale={s} rotation={[0, rotY, 0]}>
  <Box p={[0, 0.2, 0]} s={[0.46, 0.4, 0.24]} c="#6b4226" r={0.45} rad={0.05} />
  <Cyl p={[-0.08, 0.22, 0.121]} r={0.12} h={0.01} c="#d8c39a" rough={1} rot={[Math.PI / 2, 0, 0]} />
  {[-0.06, 0, 0.06].map((y, i) => <Box key={i} p={[-0.08, 0.22 + y, 0.128]} s={[0.22, 0.008, 0.004]} c="#6b4226" />)}
  <Cyl p={[0.14, 0.27, 0.121]} r={0.05} h={0.012} c="#f3c46a" e="#ffb347" ei={0.3 + 0.9 * glow} rot={[Math.PI / 2, 0, 0]} />
  {[0.1, 0.18].map((x, i) => <Cyl key={i} p={[x, 0.11, 0.125]} r={0.025} h={0.03} c="#2a1d12" rot={[Math.PI / 2, 0, 0]} />)}
</group>;
// nota musical que sube y se desvanece
const Note: React.FC<{ p: V; k: number; c?: string }> = ({ p, k, c = "#2a1d12" }) => k < 0.02 || k > 0.98 ? null : <group position={[p[0] + 0.08 * Math.sin(k * 6), p[1] + 0.5 * k, p[2]]}>
  <mesh scale={[1.25, 0.9, 0.6]}><sphereGeometry args={[0.03, 14, 10]} /><meshStandardMaterial color={c} transparent opacity={Math.sin(Math.PI * k)} /></mesh>
  <Box p={[0.03, 0.07, 0]} s={[0.008, 0.14, 0.008]} c={c} op={Math.sin(Math.PI * k)} /></group>;
// placa con número que cae con resorte
const NumPlate: React.FC<{ tt: number; at: number; p: V; map: THREE.Texture; w?: number; h?: number; glow?: number }> = ({ tt, at, p, map, w = 0.34, h = 0.24, glow = 0 }) => { const d = drop(tt, at, 0.6);
  return d.on ? <group position={[p[0], p[1] + d.y, p[2]]} rotation={[0, 0, 0.25 * (1 - Math.min(1, d.s))]}><Sign p={[0, 0, 0]} w={w} h={h} map={map} glow={glow} /></group> : null; };
// árbol: tronco + copa que se mece (sway en radianes); blossom = flores de ciruelo
const Tree: React.FC<{ p: V; sway?: number; s?: number; c?: string; blossom?: number; thin?: boolean }> = ({ p, sway = 0, s = 1, c = "#5f8a4a", blossom = 0, thin }) => <group position={p} scale={s}>
  <group rotation={[0, 0, sway]}>
    <Cyl p={[0, 0.5, 0]} r={thin ? 0.03 : 0.05} r2={thin ? 0.045 : 0.08} h={1.0} c="#6b4a2c" rough={0.9} />
    {[[0, 1.15, 0, 0.36], [-0.22, 1.0, 0.05, 0.26], [0.24, 1.02, -0.04, 0.27], [0.05, 1.38, 0.02, 0.24]].map(([x, y, z, r], i) =>
      <mesh key={i} position={[x, y, z]} castShadow><sphereGeometry args={[r, 22, 16]} /><meshStandardMaterial color={c} roughness={0.85} /></mesh>)}
    {blossom > 0.02 && [[0.2, 1.3, 0.25], [-0.25, 1.15, 0.25], [0.05, 1.5, 0.2], [0.33, 1.05, 0.15], [-0.1, 0.95, 0.3], [0.15, 1.2, 0.33], [-0.3, 1.32, 0.05], [0.0, 1.1, 0.36]].map((q, i) =>
      <mesh key={"b" + i} position={q as V} scale={0.3 + 0.7 * cl(blossom * 1.6 - i * 0.08)}><sphereGeometry args={[0.06, 14, 10]} /><meshStandardMaterial color="#f4b6c8" roughness={0.6} emissive="#ff9ab8" emissiveIntensity={0.15} /></mesh>)}
  </group></group>;
// sauce: tronco fino con lianas que cuelgan y se doblan con el viento
const Willow: React.FC<{ p: V; bend: number; t: number }> = ({ p, bend, t }) => <group position={p}>
  <group rotation={[0, 0, -0.35 * bend]}>
    <Cyl p={[0, 0.55, 0]} r={0.035} r2={0.06} h={1.1} c="#6b4a2c" rough={0.9} />
    <mesh position={[0, 1.15, 0]} scale={[1, 0.6, 1]}><sphereGeometry args={[0.28, 20, 14]} /><meshStandardMaterial color="#7fa35a" roughness={0.85} /></mesh>
    {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2, sw = 0.25 * bend + 0.05 * Math.sin(t * 3 + i); return <group key={i} position={[Math.cos(a) * 0.22, 1.1, Math.sin(a) * 0.22]} rotation={[0, 0, -sw]}>
      <Cyl p={[0, -0.32, 0]} r={0.012} h={0.64} c="#8fb565" /></group>; })}
  </group></group>;
// engranaje: disco con dientes
const Gear: React.FC<{ p: V; r: number; ang: number; c: string; m?: number; n?: number; rough?: number }> = ({ p, r, ang, c, m = 0.6, n = 12, rough = 0.4 }) => <group position={p} rotation={[0, 0, ang]}>
  <Cyl p={[0, 0, 0]} r={r} h={0.08} c={c} m={m} rough={rough} rot={[Math.PI / 2, 0, 0]} />
  <Cyl p={[0, 0, 0.01]} r={r * 0.25} h={0.1} c="#2a2420" rot={[Math.PI / 2, 0, 0]} />
  {Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return <Box key={i} p={[Math.cos(a) * (r + 0.03), Math.sin(a) * (r + 0.03), 0]} s={[0.07, 0.06, 0.08]} c={c} m={m} r={rough} rot={[0, 0, a]} rad={0.01} />; })}
</group>;
// flor (tulipán / campanilla) que abre k
const Bloom: React.FC<{ p: V; k: number; c?: string; s?: number; stem?: number }> = ({ p, k, c = "#e0486a", s = 1, stem = 0.35 }) => <group position={p} scale={s}>
  <Cyl p={[0, stem / 2, 0]} r={0.012} h={stem} c="#4f7f3a" />
  <mesh position={[0.05, stem * 0.45, 0]} rotation={[0, 0, -0.8]} scale={[0.05, 0.015, 0.025]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#5f8a4a" /></mesh>
  {[0, 1, 2, 3, 4].map((i) => { const a = (i / 5) * Math.PI * 2; return <group key={i} position={[0, stem, 0]} rotation={[0, a, 0]}><group rotation={[0.15 + 0.95 * k, 0, 0]}>
    <mesh position={[0, 0.06, 0.02]} scale={[0.045, 0.08, 0.018]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={c} roughness={0.5} side={THREE.DoubleSide} /></mesh></group></group>; })}
  <mesh position={[0, stem + 0.02, 0]}><sphereGeometry args={[0.025, 12, 10]} /><meshStandardMaterial color="#f3c46a" emissive="#ffb347" emissiveIntensity={0.3 * k} /></mesh>
</group>;
const Pot: React.FC<{ p: V; c?: string; s?: number }> = ({ p, c = "#b5523b", s = 1 }) => <group position={p} scale={s}><Cyl p={[0, 0.07, 0]} r={0.08} r2={0.06} h={0.14} c={c} /><Cyl p={[0, 0.135, 0]} r={0.072} h={0.01} c="#4a3426" rough={1} /></group>;
// globo de diálogo 3D con texto
const Balloon: React.FC<{ p: V; map: THREE.Texture; s?: number; op?: number }> = ({ p, map, s = 1, op = 1 }) => <group position={p} scale={s}>
  <Box p={[0, 0, 0]} s={[0.9, 0.34, 0.06]} c="#ffffff" r={0.6} rad={0.12} op={op} />
  <mesh position={[-0.25, -0.22, 0]} rotation={[0, 0, 0.5]}><coneGeometry args={[0.07, 0.16, 3]} /><meshStandardMaterial color="#ffffff" transparent opacity={op} /></mesh>
  <mesh position={[0, 0, 0.032]}><planeGeometry args={[0.84, 0.3]} /><meshBasicMaterial map={map} transparent opacity={op} toneMapped={false} /></mesh></group>;
// silla de oficina con rueditas
const Swivel: React.FC<{ p: V; rotY?: number; tilt?: number }> = ({ p, rotY = 0, tilt = 0 }) => <group position={p} rotation={[0, rotY, tilt]}>
  <Box p={[0, 0.46, 0]} s={[0.44, 0.08, 0.42]} c="#2b2f36" r={0.6} rad={0.04} />
  <Box p={[0, 0.78, -0.2]} s={[0.42, 0.52, 0.06]} c="#2b2f36" r={0.6} rad={0.05} />
  <Cyl p={[0, 0.27, 0]} r={0.025} h={0.36} c="#9aa0a6" m={0.8} rough={0.3} />
  {[0, 1, 2, 3, 4].map((i) => { const a = (i / 5) * Math.PI * 2; return <group key={i}><Box p={[Math.cos(a) * 0.14, 0.08, Math.sin(a) * 0.14]} s={[0.28, 0.025, 0.04]} c="#3a3f46" rot={[0, -a, 0]} />
    <mesh position={[Math.cos(a) * 0.27, 0.035, Math.sin(a) * 0.27]}><sphereGeometry args={[0.035, 12, 10]} /><meshStandardMaterial color="#111" /></mesh></group>; })}
</group>;
// bastón
const Cane: React.FC<{ p: V; rotZ?: number; rotY?: number }> = ({ p, rotZ = 0, rotY = 0 }) => <group position={p} rotation={[0, rotY, rotZ]}>
  <Cyl p={[0, 0.42, 0]} r={0.014} h={0.84} c="#5a3a22" rough={0.5} />
  <mesh position={[0.06, 0.84, 0]}><torusGeometry args={[0.06, 0.014, 8, 20, Math.PI]} /><meshStandardMaterial color="#5a3a22" roughness={0.5} /></mesh></group>;
// cruz roja de "no" y tilde verde
const NoX: React.FC<{ p: V; k: number; s?: number }> = ({ p, k, s = 1 }) => k < 0.02 ? null : <group position={p} scale={s * (0.6 + 0.4 * k)}>
  {[1, -1].map((d) => <Box key={d} p={[0, 0, 0]} s={[0.5 * k, 0.07, 0.03]} c="#c0392b" rot={[0, 0, d * 0.78]} e="#ff4433" ei={0.3} />)}</group>;
const Check: React.FC<{ p: V; k: number; s?: number }> = ({ p, k, s = 1 }) => k < 0.02 ? null : <group position={p} scale={s * (0.6 + 0.4 * k)}>
  <Box p={[-0.08, -0.04, 0]} s={[0.18, 0.06, 0.03]} c="#3fa45a" rot={[0, 0, -0.8]} e="#5ad17a" ei={0.3} /><Box p={[0.09, 0.05, 0]} s={[0.34 * k, 0.06, 0.03]} c="#3fa45a" rot={[0, 0, 0.9]} e="#5ad17a" ei={0.3} /></group>;
// marco de foto parado que se cae boca abajo (fall 0→1)
const Frame: React.FC<{ p: V; fall: number; c?: string; children?: React.ReactNode; w?: number; h?: number }> = ({ p, fall, c = "#8a5a34", children, w = 0.36, h = 0.46 }) => <group position={p} rotation={[-1.45 * fall, 0, 0]}>
  <Box p={[0, h / 2, 0]} s={[w, h, 0.04]} c={c} r={0.5} />
  <Box p={[0, h / 2, 0.022]} s={[w - 0.06, h - 0.06, 0.005]} c="#f3ead8" r={0.9} />
  <group position={[0, 0.05, 0.03]}>{children}</group></group>;
const useLabE = () => useMemo(() => ({ n: ["1", "2", "3", "4"].map((s) => lab(s, "#fbf7ee", "#2a1d12", 160, 120, 96)),
  jp: ["ICHI", "NI", "SAN", "SHI"].map((s) => lab(s, "#c0392b", "#ffffff", 220, 120, 70)),
  gm: lab("GOOD MORNING!", "", "#2a1d12", 512, 180, 64),
  card: txt(512, 360, (g) => { g.fillStyle = "#fbf7ee"; g.fillRect(0, 0, 512, 360); g.strokeStyle = "#c9a24e"; g.lineWidth = 6;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) g.strokeRect(24 + c * 80, 76 + r * 92, 68, 80); g.fillStyle = "#2a1d12"; g.font = "bold 40px Georgia, serif"; g.textAlign = "center"; g.fillText("SUMMER MORNINGS", 256, 48); }),
  news: txt(320, 200, (g) => { g.fillStyle = "#1b2a4a"; g.fillRect(0, 0, 320, 200); g.fillStyle = "#c0392b"; g.fillRect(0, 140, 320, 42); g.fillStyle = "#fff"; g.fillRect(20, 152, 200, 16); g.fillStyle = "#9db2c9"; g.beginPath(); g.arc(160, 80, 40, 0, 7); g.fill(); }),
  ver: lab("1965", "#e7d4ae", "#5a3a22", 200, 90, 54) }), []);
const S2 = S * 0.62;
// caminar en el lugar: pies que suben alternados
const walkFeet = (q: any, ph: number) => { q.pieD = pie([-0.18, ANK + 0.06 * Math.max(0, Math.sin(ph)), 0.12 * Math.sin(ph)], -8, { polo: [-0.2, 0, 1] }); q.pieI = pie([0.18, ANK + 0.06 * Math.max(0, -Math.sin(ph)), -0.12 * Math.sin(ph)], 8, { polo: [0.2, 0, 1] }); };

// ---- piezas de la vuelta 2 ----
// rastro dorado: bolitas que siguen una lista de puntos (más gruesas las recientes)
const Trail: React.FC<{ pts: V[]; r?: number; c?: string }> = ({ pts, r = 0.022, c = "#ffcf6a" }) => <>{pts.map((q, i) =>
  <mesh key={i} position={q}><sphereGeometry args={[r * (0.45 + 0.55 * (i + 1) / pts.length), 10, 8]} /><meshStandardMaterial color={c} emissive="#ffb347" emissiveIntensity={1.3} transparent opacity={0.35 + 0.6 * (i + 1) / pts.length} /></mesh>)}</>;
// hojitas que vuelan con el viento (u = fase 0..1 de cada una)
const Leaves: React.FC<{ a: V; b: V; t: number; k: number; n?: number; c?: string }> = ({ a, b, t, k, n = 10, c = "#7fa35a" }) => k < 0.02 ? null : <>{Array.from({ length: n }, (_, i) => {
  const u = ((t * 0.35 + i / n) % 1); const p: V = [lerp(a[0], b[0], u), lerp(a[1], b[1], u) + 0.12 * Math.sin(u * 9 + i), lerp(a[2], b[2], u) + 0.1 * Math.sin(i * 1.7)];
  return <mesh key={i} position={p} rotation={[t * 3 + i, t * 2 + i * 0.7, 0]} scale={[0.04, 0.008, 0.025]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color={i % 3 ? c : "#c9a24e"} transparent opacity={k * Math.sin(Math.PI * u)} /></mesh>; })}</>;
// cono de luz (rayo volumétrico) entre dos alturas
const Ray: React.FC<{ p: V; rot?: V; len: number; r: number; k: number; c?: string }> = ({ p, rot = [0, 0, 0], len, r, k, c = "#ffe2a0" }) => k < 0.02 ? null :
  <group position={p} rotation={rot}><mesh position={[0, -len / 2, 0]}><cylinderGeometry args={[r * 0.35, r, len, 24, 1, true]} /><meshBasicMaterial color={c} transparent opacity={0.22 * k} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh></group>;
// mochila escolar roja (randoseru)
const Satchel: React.FC<{ p: V; s?: number }> = ({ p, s = 1 }) => <group position={p} scale={s}><Box p={[0, 0, 0]} s={[0.16, 0.2, 0.09]} c="#c0392b" r={0.35} rad={0.03} /><Box p={[0, 0.06, 0.047]} s={[0.17, 0.1, 0.01]} c="#a52f23" r={0.35} rad={0.02} /><Box p={[0, 0.03, 0.054]} s={[0.03, 0.02, 0.006]} c="#c9a24e" m={0.7} /></group>;
// casco de obra
const Helmet: React.FC<{ p: V; s?: number }> = ({ p, s = 1 }) => <group position={p} scale={s}><mesh><sphereGeometry args={[0.13, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#f2c14e" roughness={0.4} /></mesh><Cyl p={[0, 0.004, 0]} r={0.16} h={0.012} c="#f2c14e" /></group>;
// bloque 3D con número (cara frontal con textura)
const Block: React.FC<{ p: V; map: THREE.Texture; s?: number; glow?: number; rot?: V; c?: string }> = ({ p, map, s = 1, glow = 0, rot = [0, 0, 0], c = "#c0392b" }) => <group position={p} scale={s} rotation={rot}>
  <Box p={[0, 0, 0]} s={[0.3, 0.3, 0.16]} c={c} r={0.4} rad={0.03} e="#ff8a5a" ei={0.5 * glow} />
  <mesh position={[0, 0, 0.081]}><planeGeometry args={[0.27, 0.27]} /><meshBasicMaterial map={map} toneMapped={false} /></mesh></group>;
const kanji = (k: string, r: string) => txt(256, 256, (g) => { g.fillStyle = "#c0392b"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "bold 150px serif"; g.fillText(k, 128, 110); g.font = "bold 40px Georgia, serif"; g.fillText(r, 128, 222); });
const useLabE2 = () => useMemo(() => ({ kj: [["一", "ICHI"], ["二", "NI"], ["三", "SAN"], ["四", "SHI"]].map(([k, r]) => kanji(k, r)),
  num: ["1", "2", "3", "4"].map((s) => txt(256, 256, (g) => { g.fillStyle = "#f6efe2"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#2a1d12"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "bold 190px Georgia, serif"; g.fillText(s, 128, 140); })),
  tape: txt(1024, 64, (g) => { g.fillStyle = "#f2c14e"; g.fillRect(0, 0, 1024, 64); g.fillStyle = "#2a1d12"; for (let i = 0; i <= 100; i++) { const x = 6 + i * 10.1; g.fillRect(x, 0, 2, i % 10 ? (i % 5 ? 16 : 26) : 34); if (i % 10 === 0 && i < 100) { g.font = "bold 22px Arial"; g.fillText(String(i), x + 4, 58); } } }) }), []);
const OUT = { floor: "none" as const, wall: false, bg: "#cfe3f2" };
const Grass: React.FC<{ w?: number; d?: number; c?: string }> = ({ w = 8, d = 8, c = "#9bbf6a" }) => <Box p={[0, -0.01, 0]} s={[w, 0.02, d]} c={c} r={1} rad={0} cast={false} />;

// 0:03 · espalda de puerta vieja: la puerta de madera cruje entreabierta (polvo en la bisagra) y ella encorvada con la mano en la espalda;
// se estira, la puerta se abre suave y un rayo de sol entra por la rendija hasta el piso
export const G_olddoor: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.9, 1.15, 3.1], [-0.05, 0.85, -0.4]), C([0.2, 1.1, 3.2], [-0.05, 0.85, -0.4]), 9)}
    set={(tt: number) => ({ ...MOR, warm: 0.5 + 0.3 * sv(tt, 5, 7), spot: [-0.3, 0, -0.2] as V, spotK: 0.3 + 0.5 * sv(tt, 5.0, 7.0) })}
    scene={(tt) => { const cr = tt < 4.2 ? 0.1 + 0.07 * Math.abs(Math.sin(tt * 2.2)) : 0.1 * (1 - sv(tt, 4.2, 5.0)), open = sv(tt, 5.0, 7.2), up = sv(tt, 4.2, 6.4);
      const back = withHands(PZ.slump, (q: any) => { q.manoD = { ...q.manoD, p: [-0.3, -0.55, -0.35] }; });
      const p = mezclar(back, armsUp(1, 0.4), up), dust = tt < 4.2 ? Math.abs(Math.sin(tt * 2.2)) : 0;
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.8} h={2.4} />
        <Door p={[-0.6, 0, -0.84]} open={cr + 1.25 * open} c="#7b5534" />
        <Ray p={[-0.62, 1.9, -0.7]} rot={[0.75, 0, 0.25]} len={2.4} r={0.4} k={Math.min(1, open * 1.6)} />
        <mesh position={[-0.42, 0.012, -0.2]} rotation={[-Math.PI / 2, 0, -0.35]}><planeGeometry args={[0.5 * open + 0.02, 1.5]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.6 * open} toneMapped={false} depthWrite={false} /></mesh>
        <Glow p={[-0.35, 0.02, 0.2]} r={0.5} k={open} c="#ffd27a" op={0.35} />
        {[0, 1, 2, 3].map((i) => { const u = ((tt * 0.8 + i * 0.25) % 1); return <mesh key={i} position={[-0.98 + 0.05 * i, 1.6 - 0.2 * u, -0.78 + 0.1 * u]}><sphereGeometry args={[0.012 + 0.01 * u, 8, 6]} /><meshStandardMaterial color="#cbb89a" transparent opacity={dust * (1 - u) * 0.8} /></mesh>; })}
        <Sachi p={p} t={tt} x={0.45} z={-0.05} rotY={-25} s={S} expr={up > 0.5 ? "feliz" : "nervioso"} />
      </>; }} />;

// 0:26 · nunca necesitó bastón: lo suelta, el bastón cae con peso y rebota en primer plano, y ella camina derecha hacia nosotros
export const G_nocane: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.5, 1.0, 3.0], [0.0, 0.8, -0.2]), C([-0.3, 1.0, 3.1], [0.0, 0.8, -0.2]), 6)}
    set={(tt: number) => ({ ...WOOD, spot: [0, 0, 0.2] as V, spotK: 0.5 })}
    scene={(tt) => { const let_ = sv(tt, 0.7, 1.1), fs = phys(tt, 1.0, 9, 0.35), fall = Math.min(1.08, fs), walk = eio(tt, 1.9, 5.0), ph = Math.max(0, tt - 1.9) * 7;
      const st = withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-0.42, lerp(-0.85, -1.2, let_), lerp(0.3, 0.05, let_)] }; if (walk > 0.01 && walk < 0.99) walkFeet(q, ph); });
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.8} h={2.3} />
        <Win p={[0.95, 1.3, -0.85]} w={0.9} h={0.8} sky="#cfe3f2" />
        <group position={[-0.36, 0, -0.05]} rotation={[0, -Math.PI / 2 + 0.3, 0]}><group rotation={[0, 0, (-Math.PI / 2 + 0.05) * fall]}><Cyl p={[0, 0.45, 0]} r={0.032} h={0.9} c="#b07a42" rough={0.45} /><mesh position={[0.09, 0.9, 0]}><torusGeometry args={[0.09, 0.032, 10, 24, Math.PI]} /><meshStandardMaterial color="#b07a42" roughness={0.45} /></mesh><Cyl p={[0, 0.02, 0]} r={0.038} h={0.04} c="#2a1d12" /></group></group>
        <Glow p={[-0.3, 0.03, 0.5]} r={0.25} k={tt > 1.25 && tt < 1.7 ? 1 - (tt - 1.25) / 0.45 : 0} c="#fff2d0" op={0.7} />
        <Sachi p={st} t={tt} x={lerp(-0.05, 0.35, walk)} z={lerp(-0.2, 0.75, walk)} rotY={walk > 0.01 && walk < 0.99 ? 15 : 0} s={S} expr={fall > 0.5 ? "carcajada" : "decidido"} />
      </>; }}
    over={(tt) => <Big tt={tt} at={2.0} txt="NO CANE" y={150} />} />;

// 0:55 · desde 1928: la radio vieja late con la música (se infla en cada pulso), salen notas grandes, y bloques 1-2-3-4 caen de a uno con peso; ella levanta los brazos al compás
export const G_radio1928: F = ({ t, h }) => { const L = useLabE2();
  return <Hero d={1.4} ly={0.0} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.6, 1.1, 2.9], [0.0, 0.85, -0.4]), C([-0.3, 1.1, 2.9], [0.0, 0.85, -0.4]), 7)}
    set={(tt: number) => ({ ...MOR, spot: [-0.3, 0, -0.4] as V, spotK: 0.55 })}
    scene={(tt) => { const B = 0.9, ph = Math.max(0, tt - 1.6) / B, pulse = tt > 1.6 ? Math.pow(1 - (ph % 1), 3) : 0, up = tt > 1.6 ? loop(tt - 1.6, 2 * B) : 0;
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.8} h={2.3} />
        <Table p={[-0.55, 0, -0.45]} w={0.8} d={0.45} h={0.42} />
        <Radio p={[-0.55, 0.42, -0.45]} s={1.35 * (1 + 0.14 * pulse)} glow={0.5 + 0.5 * pulse} rotY={0.3} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <group key={i} scale={2.1}><Note p={[(-0.62 + 0.09 * (i % 3)) / 2.1, 1.05 / 2.1, -0.3 / 2.1]} k={(Math.max(0, tt - 0.5) * 0.4 + i / 5) % 1} c={i % 2 ? "#2a1d12" : "#b5523b"} /></group>)}
        {[0, 1, 2, 3].map((i) => { const d = drop(tt, 1.6 + i * B, 0.9); return d.on && <group key={i} position={[-0.95 + i * 0.36, 1.2 + d.y, -0.55]} rotation={[0, 0.2, 0.3 * (1 - Math.min(1, d.s))]}>
          <Block p={[0, 0, 0]} map={L.num[i]} s={1.0} glow={Math.floor(ph) % 4 === i ? pulse : 0} c="#e7d4ae" /></group>; })}
        <Sachi p={armsUp(0.25 + 0.75 * up, 0.3 * up)} t={tt} x={0.6} z={-0.05} rotY={-25} s={S} expr="feliz" />
      </>; }} />; };

// 1:09 · chicos en la escuela (mochila roja), obreros en la fábrica (casco amarillo), abuelos en el parque (bastón): tres dioramas grandes;
// los tres levantan los brazos en el mismo instante y un pulso de luz corre por los tres
export const G_threerows: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.3, 1.1, 2.35], [0, 0.8, -0.6]), C([-0.3, 1.1, 2.35], [0, 0.8, -0.6]), 8.5)}
    set={(tt: number) => ({ floor: "wood" as const, warm: 0.5, spot: [0, 0, -0.5] as V, spotK: 0.4 })}
    scene={(tt) => { const up = tt > 2.4 ? loop(tt - 2.4, 2.0) : 0, beam = tt > 2.4 ? ((tt - 2.4) / 2.0) % 1 : -1;
      const fig = (x: number) => beam >= 0 ? Math.exp(-Math.pow(((x + 1.2) / 2.4 - beam) * 6, 2)) : 0;
      return <>
        <Wallp p={[0, 0, -1.3]} w={4.6} h={2.6} c="#dfe8ee" />
        {/* escuela: techo rojo, pizarrón, reloj */}
        <group position={[-0.95, 0, -0.95]}><Box p={[0, 0.6, 0]} s={[0.85, 1.2, 0.3]} c="#e9d9b8" r={0.8} /><Box p={[0, 1.25, 0]} s={[0.92, 0.1, 0.36]} c="#9b3b2c" /><Cyl p={[0, 1.02, 0.16]} r={0.09} h={0.02} c="#f6f1e7" rot={[Math.PI / 2, 0, 0]} />
          <Box p={[0, 0.62, 0.16]} s={[0.6, 0.3, 0.01]} c="#2f4a3a" />{[-0.2, 0.2].map((x, i) => <Box key={i} p={[x, 0.98, 0.16]} s={[0.14, 0.14, 0.01]} c="#9cc3e6" />)}</group>
        {/* fábrica: techo serrucho, chimenea con humo, engranaje */}
        <group position={[0, 0, -0.95]}><Box p={[0, 0.45, 0]} s={[0.85, 0.9, 0.3]} c="#b9bec4" r={0.8} />{[-0.28, 0, 0.28].map((x, i) => <mesh key={i} position={[x, 0.96, 0]} rotation={[0, 0, 0.6]}><boxGeometry args={[0.24, 0.12, 0.3]} /><meshStandardMaterial color="#8f969e" /></mesh>)}
          <Cyl p={[0.32, 1.25, -0.05]} r={0.05} h={0.7} c="#7c838b" /><Steam p={[0.32, 1.62, -0.05]} t={tt} k={1} n={5} /><Gear p={[-0.15, 0.55, 0.17]} r={0.12} ang={tt * 1.2} c="#c9a24e" n={10} /></group>
        {/* parque: árbol y banco */}
        <group position={[0.95, 0, -0.95]}><Tree p={[0.15, 0, 0]} s={0.75} /><Box p={[-0.15, 0.2, 0.05]} s={[0.4, 0.04, 0.14]} c="#8a5a34" />{[-0.32, 0.02].map((x, i) => <Box key={i} p={[x, 0.1, 0.05]} s={[0.03, 0.2, 0.12]} c="#6b4a2c" />)}</group>
        <group><Sachi p={armsUp(up)} t={tt} x={-0.95} z={-0.3} s={S * 0.68} expr="carcajada" color="#f4e7d0" /><Satchel p={[-0.95, 0.68, -0.38]} s={1.1} /></group>
        <group><Sachi p={armsUp(up)} t={tt} x={0} z={-0.3} s={S * 0.9} expr="decidido" /><Helmet p={headOf(armsUp(up), 0, -0.3, S * 0.9).map((v, i) => v + (i === 1 ? 0.08 : 0)) as V} /></group>
        <group><Sachi p={armsUp(up * 0.85)} t={tt} x={0.95} z={-0.3} s={S * 0.9} expr="feliz" color="#ebe5dc" /><Cane p={[1.2, 0, -0.25]} rotZ={0.15} /></group>
        {[-0.95, 0, 0.95].map((x, i) => <Glow key={i} p={[x, 0.7, -0.3]} r={0.45} k={fig(x)} c={AMB} op={0.35} />)}
      </>; }} />;

// 2:05 · sin rueditas: la silla de oficina se desliza sola y se va rodando (ruedas girando, se tambalea); la silla de madera queda firme con su sombra y ella se sienta
export const G_nowheels: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([1.2, 1.15, 2.8], [-0.1, 0.65, -0.3]), C([0.6, 1.15, 3.0], [-0.1, 0.65, -0.3]), 5)}
    set={(tt: number) => ({ ...WOOD, spot: [0.35, 0, -0.3] as V, spotK: 0.3 + 0.5 * sv(tt, 2.0, 2.8) })}
    scene={(tt) => { const roll = eio(tt, 0.6, 3.0), glow = sv(tt, 2.0, 2.8), sit = sv(tt, 2.6, 3.6), walk = sv(tt, 1.6, 2.6);
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.8} h={2.3} />
        <Swivel p={[-0.35 - 3.6 * roll, 0, -0.25 + 0.3 * roll]} rotY={4 * roll} tilt={0.18 * Math.sin(tt * 10) * Math.sin(Math.PI * roll)} />
        <Chair p={[0.45, 0, -0.3]} glow={glow} />
        <Glow p={[0.45, 0.02, -0.3]} r={0.45} k={glow} c={AMB} op={0.3} />
        <Sachi p={mezclar(withHands(PZ.stand, (q: any) => { if (walk > 0.01 && walk < 0.99) walkFeet(q, tt * 7.5); }), chairSit, sit)} t={tt} x={lerp(1.2, 0.45, walk)} z={lerp(0.2, -0.3, Math.max(walk * 0.5, sit))} rotY={sit > 0.3 ? 0 : -80} s={S} expr={sit > 0.5 ? "feliz" : "decidido"} />
      </>; }} />;

// 3:05 · hacerse larga: acostada, los brazos se van por arriba de la cabeza; una cinta métrica amarilla gruesa se desenrolla de la mano a los pies y los números corren
export const G_longline: F = ({ t, h }) => { const L = useLabE2();
  return <Hero d={1.4} ly={0.0} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.5, 1.05, 1.7], [0.05, 0.2, -0.05]), C([-0.2, 1.0, 1.8], [0.05, 0.2, -0.05]), 9)}
    set={(tt: number) => ({ ...MOR, spot: [0, 0, 0] as V, spotK: 0.5 })}
    scene={(tt) => { const k = sv(tt, 0.8, 2.6) * (1 - 0.3 * sv(tt, 6.8, 8.2)), tape = eio(tt, 2.2, 4.6), p = lieLong(k, PZ.lying);
      const a = handOf(p, "D", 0.1, -0.05), b = toeOf(p, "D", 0.1, -0.05), dx = b[0] - a[0], dz = b[2] - a[2], len = Math.hypot(dx, dz), ang = Math.atan2(-dz, dx);
      tape > 0 && (L.tape.repeat.set(tape, 1), L.tape.offset.set(0, 0));
      return <>
        <Futon p={[0, 0, -0.05]} rotY={Math.PI / 2} qk={0} pillow={false} />
        <Sachi p={p} t={tt} x={0.1} z={-0.05} s={S} expr={k > 0.5 ? "feliz" : "neutral"} />
        {tape > 0.01 && <group position={[a[0], 0.24, a[2] + 0.2]} rotation={[0, ang, 0]}>
          <mesh position={[len * tape / 2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[len * tape, 0.2]} /><meshStandardMaterial map={L.tape} roughness={0.5} /></mesh>
          <Box p={[0, 0.03, 0]} s={[0.09, 0.08, 0.09]} c="#c9a24e" r={0.3} m={0.5} rad={0.02} />
          <Box p={[len * tape, 0.01, 0]} s={[0.01, 0.03, 0.075]} c="#9aa0a6" m={0.8} /></group>}
      </>; }}
    over={(tt) => <Big tt={tt} at={2.6} txt="MAKE YOURSELF LONG" y={150} size={72} />} />; };

// 4:31 · mirá tus manos, inspirá: de perfil frente a la ventana, sube en puntas de pie con los brazos arriba; un sol grande sube y entra un rayo que proyecta su sombra en la pared
export const G_tiptoe: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([1.1, 0.95, 2.6], [-0.1, 1.0, -0.35]), C([0.7, 0.9, 2.8], [-0.1, 1.0, -0.35]), 8)}
    set={(tt: number) => ({ ...MOR, warm: 0.55 + 0.35 * sv(tt, 1, 6), spot: [0, 0, -0.2] as V, spotK: 0.3 + 0.5 * sv(tt, 1, 5) })}
    scene={(tt) => { const up = sv(tt, 0.4, 2.4), toe = sv(tt, 1.8, 3.2) * (1 - sv(tt, 6.2, 7.4)), sun = eio(tt, 0.3, 5.5);
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.8} h={2.6} />
        <Win p={[-0.55, 1.4, -0.86]} w={1.1} h={1.1} sky="#f6dca6" />
        <Sun p={[-0.55, 0.9 + 0.7 * sun, -0.84]} r={0.48} k={1} />
        <Ray p={[-0.55, 1.6, -0.8]} rot={[-0.6, 0, -0.5]} len={2.2} r={0.5} k={sun} />
        <Glow p={[0.1, 0.02, 0.2]} r={0.6} k={sun} c="#ffd27a" op={0.3} />
        <Sachi p={armsUp(up, toe)} t={tt} x={0.2} z={-0.15} rotY={-25} s={S} expr={toe > 0.5 ? "carcajada" : "feliz"} />
      </>; }}
    over={(tt) => <Big tt={tt} at={1.2} txt="BREATHE IN" col={AMB} y={150} />} />;

// 4:50 · le dice buenos días al día: afuera, en la puerta de su casita, levanta el brazo y saluda; un globo «GOOD MORNING» viaja en arco hasta la casa del vecino y su ventana se enciende
export const G_goodmorning: F = ({ t, h }) => { const gm = useMemo(() => txt(1024, 256, (g) => { g.fillStyle = "#fffaf0"; g.fillRect(0, 0, 1024, 256); g.fillStyle = "#c0392b"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "bold 128px Georgia, serif"; g.fillText("GOOD MORNING!", 512, 136); }), []);
  return <Hero d={1.4} ly={0.0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.2, 1.35, 3.6], [0.1, 0.85, -0.5]), C([-0.3, 1.35, 3.6], [0.1, 0.85, -0.5]), 9)}
    set={(tt: number) => ({ ...OUT, warm: 0.7, spot: [0, 0, -0.3] as V, spotK: 0.4 })}
    scene={(tt) => { const wave = tt > 1.0 && tt < 4.0 ? Math.sin((tt - 1.0) * 8) : 0, arm = sv(tt, 0.8, 1.2) * (1 - sv(tt, 4.2, 4.8)), fly = eio(tt, 1.4, 5.2), lit = sv(tt, 4.9, 5.8);
      return <>
        <Grass />
        <group rotation={[0, Math.PI, 0]}><House p={[1.0, 0, 0.9]} s={1.2} /></group>
        <group rotation={[0, Math.PI, 0]}><House p={[-1.15, 0, 1.0]} s={1.2} glow={lit} /></group>
        <Glow p={[1.15, 0.6, -0.75]} r={0.9} k={lit} c={AMB} op={0.6} />
        <Sun p={[0.1, 2.0, -2.2]} r={0.25} k={1} />
        {fly > 0.01 && fly < 0.97 && <group position={[lerp(-0.35, 1.05, fly), 1.5 + 0.35 * Math.sin(Math.PI * fly), lerp(-0.1, -0.6, fly)]} rotation={[0, 0, 0.12 * Math.sin(tt * 3)]} scale={(0.5 + 0.5 * Math.min(1, fly * 5)) * (1 - sv(fly, 0.85, 0.97))}><Box p={[0, 0, -0.025]} s={[1.0, 0.27, 0.04]} c="#c0392b" r={0.5} rad={0.04} /><mesh><planeGeometry args={[0.96, 0.235]} /><meshBasicMaterial map={gm} toneMapped={false} /></mesh></group>}
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-0.35 + 0.12 * wave * arm, lerp(-1.25, 0.75, arm), 0.15] }; })} t={tt} x={-0.55} z={-0.15} rotY={15} s={S} expr="carcajada" />
      </>; }} />; };

// 5:18 · los brazos van y vienen como péndulo con las rodillas blanditas; a su lado, la nena que fue, con la mochila roja, hace lo mismo en espejo; un rastro dorado marca el arco de la mano
export const G_swing: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([2.6, 1.05, 1.1], [0, 0.75, -0.15]), C([2.7, 1.05, 0.3], [0, 0.75, -0.15]), 8.5)}
    set={(tt: number) => ({ ...WOOD, spot: [0, 0, -0.2] as V, spotK: 0.5 })}
    scene={(tt) => { const sw = (u: number) => 1.25 * Math.sin(u * Math.PI * 1.1) * sv(u, 0.3, 1.0), s = sw(tt), b = 0.5 + 0.5 * Math.cos(tt * Math.PI * 2.2), girl = sv(tt, 1.6, 2.6);
      const tr = Array.from({ length: 14 }, (_, i) => handOf(swingP(sw(tt - i * 0.045), b), "D", 0.0, 0.25, 90));
      return <>
        <Wallp p={[0, 0, -1.0]} w={4} h={2.3} />
        <Trail pts={tr.reverse()} r={0.045} />
        <Sachi p={swingP(s, b * 0.8)} t={tt} x={0.0} z={0.25} rotY={90} s={S} expr="feliz" />
        <group position={[0, 0, (1 - girl) * -0.6]}><Sachi p={swingP(s, b * 0.8)} t={tt} x={0.35} z={-0.35} rotY={90} s={S * 0.78} expr="carcajada" color="#f6ead6" />
          <Satchel p={[0.35 - 0.11, 0.8 * 0.68 / 0.68 * 0.86, -0.35]} s={1.0} /></group>
      </>; }}
    over={(tt) => <Big tt={tt} at={1.0} txt="SWING" y={150} />} />;

// 5:54 · como sentarse en un banquito altísimo: de perfil, un taburete alto (a la altura de su cadera) justo detrás; ella baja la cola hasta rozar el asiento y vuelve a subir, dos veces
export const G_tallstool: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 0.95, 2.7], [-0.15, 0.78, 0.0]), C([0.45, 0.95, 2.6], [-0.15, 0.78, 0.0]), 7)}
    set={(tt: number) => ({ ...WOOD, spot: [0, 0, 0] as V, spotK: 0.5 })}
    scene={(tt) => { const b = tt > 1.0 ? loop(tt - 1.0, 2.6) : 0, st = sv(tt, 0.1, 0.9), touch = b > 0.85 ? (b - 0.85) / 0.15 : 0;
      return <>
        <Wallp p={[0, 0, -1.0]} w={4} h={2.3} />
        <group position={[-0.24, 0, 0.0]} scale={[1.4, (0.7 + 0.3 * st) * 0.85, 1.4]}>
          <Cyl p={[0, 0.6, 0]} r={0.15} h={0.05} c="#8a5a34" e="#ffb347" ei={0.5 * touch} />{[[0.1, 0.1], [-0.1, 0.1], [0.1, -0.1], [-0.1, -0.1]].map(([x, z], i) => <Cyl key={i} p={[x * 1.2, 0.29, z * 1.2]} r={0.016} h={0.58} c="#6b4a2c" rot={[z * 0.2, 0, -x * 0.2]} />)}
          <Box p={[0, 0.22, 0]} s={[0.26, 0.02, 0.02]} c="#6b4a2c" /></group>
        <Sachi p={mezclar(PZ.stand, PZ.squat, 0.85 * b)} t={tt} x={0.0} z={0.0} rotY={90} s={S} expr="decidido" />
      </>; }} />;

// 6:13 · error 1, estirar en frío: ella tironea un caramelo celeste helado (escarcha) y se parte con astillas; después uno tibio, ámbar, se estira en un hilo largo que cuelga y no se corta
export const G_taffy: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.35, 1.05, 1.9], [0.0, 0.95, -0.15]), C([-0.25, 1.05, 1.95], [0.0, 0.95, -0.15]), 6)}
    set={(tt: number) => ({ ...WOOD, spot: [0, 0, -0.1] as V, spotK: 0.6 })}
    scene={(tt) => { const pull = eio(tt, 0.5, 1.5), gap = eio(tt, 1.5, 1.9), cold = 1 - sv(tt, 2.6, 3.0), warm = eio(tt, 3.2, 5.4);
      const hd = lerp(0.12, 0.2, pull) + 0.12 * gap * cold + 0.32 * warm;
      const p = withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-hd / S * 0.95, -0.35, 0.55] }; q.manoI = { ...q.manoI, p: [hd / S * 0.95, -0.35, 0.55] }; });
      const L = handOf(p, "I", 0, -0.35), R = handOf(p, "D", 0, -0.35), y0 = (L[1] + R[1]) / 2;
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.8} h={2.3} />
        <Sachi p={p} t={tt} x={0} z={-0.35} s={S} expr={cold > 0.5 ? (gap > 0.5 ? "sorprendido" : "decidido") : "feliz"} />
        {cold > 0.02 && <>
          <Box p={[R[0] + 0.07 - 0.0, y0, R[2]]} s={[0.24 + 0.04 * pull, 0.1, 0.1]} c="#9fd3f5" r={0.1} rad={0.03} e="#bfe0f5" ei={0.4} rot={[0, 0, -0.35 * gap]} op={cold} />
          <Box p={[L[0] - 0.07, y0, L[2]]} s={[0.24 + 0.04 * pull, 0.1, 0.1]} c="#9fd3f5" r={0.1} rad={0.03} e="#bfe0f5" ei={0.4} rot={[0, 0, 0.35 * gap]} op={cold} />
          {gap > 0.01 && [0, 1, 2, 3, 4, 5, 6].map((i) => <Box key={i} p={[(i - 3) * 0.04 + 0.08 * gap * (i - 3), y0 + 0.08 * gap * Math.sin(i * 2) - 0.25 * gap * gap, R[2] + 0.02 * i]} s={[0.03, 0.03, 0.03]} c="#e8f6ff" rot={[i, i * 2, 0]} op={cold} />)}
          <Glow p={[0, y0, R[2] + 0.02]} r={0.25} k={gap * (1 - sv(tt, 1.9, 2.4))} c="#ffffff" op={0.9} /></>}
        {warm > 0.01 && <group>{Array.from({ length: 24 }, (_, i) => { const u = i / 23, x = lerp(R[0], L[0], u), sag = 0.28 * warm * Math.sin(Math.PI * u); return <mesh key={i} position={[x, y0 - sag, R[2]]}><sphereGeometry args={[0.055 - 0.025 * warm * Math.sin(Math.PI * u), 12, 10]} /><meshStandardMaterial color="#e8a14e" roughness={0.25} emissive="#ffb347" emissiveIntensity={0.25} /></mesh>; })}</group>}
      </>; }} />;

// 6:30 · error 2, rebotar: la pelota roja rebota fuerte con sombra y, a mitad de salto, se congela en el aire; ella sostiene la flexión quieta junto a un reloj de arena grande que corre
export const G_bounce: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.7, 1.05, 2.4], [0.0, 0.55, -0.2]), C([0.1, 1.05, 2.5], [0.0, 0.55, -0.2]), 6.5)}
    set={(tt: number) => ({ ...MOR, spot: [0, 0, -0.2] as V, spotK: 0.5 })}
    scene={(tt) => { const fr = Math.min(tt, 1.87), by = Math.abs(Math.sin(fr * 4.2)) * 0.6, frozen = sv(tt, 1.87, 2.1), hold = sv(tt, 2.1, 2.9);
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.8} h={2.3} />
        <mesh position={[-0.5, 0.2 + by, 0.1]} castShadow scale={[1 + 0.15 * (1 - Math.min(1, by * 8)) * (1 - frozen), 1 - 0.15 * (1 - Math.min(1, by * 8)) * (1 - frozen), 1]}><sphereGeometry args={[0.2, 28, 20]} /><meshStandardMaterial color="#c0392b" roughness={0.35} emissive="#9cc3e6" emissiveIntensity={0.4 * frozen} /></mesh>
        <mesh position={[-0.5, 0.2 + by, 0.1]}><sphereGeometry args={[0.27, 24, 16]} /><meshStandardMaterial color="#cfe8ff" transparent opacity={0.35 * frozen} roughness={0.05} /></mesh>
        <mesh position={[-0.5, 0.003, 0.1]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.22 * (1 - 0.6 * by), 24]} /><meshBasicMaterial color="#000" transparent opacity={0.25} /></mesh>
        <Sachi p={fold(0.6 + 0.15 * Math.abs(Math.sin(fr * 4.2)) * (1 - hold))} t={tt} x={0.15} z={-0.15} rotY={-70} s={S} expr={hold > 0.5 ? "feliz" : "nervioso"} />
        <Hourglass p={[0.85, 0, 0.15]} k={eio(tt, 2.3, 6.4)} glow={hold} s={1.25} />
      </>; }} />;

// 6:59 · soltá el aire al estirar: plano medio; un globo celeste grande dentro del pecho se infla al inspirar y se vacía mientras sube los brazos, y una nube de vaho sale de la boca a contraluz
export const G_holdbreath: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.5, 1.2, 1.9], [0, 1.0, -0.2]), C([-0.25, 1.2, 1.95], [0, 1.0, -0.2]), 6.5)}
    set={(tt: number) => ({ ...MOR, spot: [0, 0, -0.2] as V, spotK: 0.5 })}
    scene={(tt) => { const inh = sv(tt, 0.3, 2.2), exh = sv(tt, 2.6, 5.0), b = inh * (1 - exh), p = armsUp(exh), hy = headOf(p, 0, -0.1)[1];
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.8} h={2.3} />
        <Win p={[0.75, 1.35, -0.86]} w={0.8} h={0.8} sky="#f6dca6" />
        <Sachi p={p} t={tt} x={0} z={-0.1} s={S} expr={b > 0.6 ? "sorprendido" : "feliz"} />
        <mesh position={[0, hy - 0.5, 0.12]} scale={[0.4 + 1.2 * b, 0.4 + 1.3 * b, 0.4 + 1.0 * b]}><sphereGeometry args={[0.12, 28, 20]} /><meshStandardMaterial color="#2f8fd8" roughness={0.15} transparent opacity={0.88} emissive="#3d9be0" emissiveIntensity={0.5} /></mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => { const u = cl((tt - 2.6 - i * 0.25) / 1.6); return u > 0 && u < 1 && <mesh key={i} position={[0.05 + 0.3 * u, hy - 0.1 + 0.08 * u, 0.12 + 0.35 * u]} scale={1 + 2.4 * u}><sphereGeometry args={[0.06, 14, 10]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.85 * (1 - u)} roughness={1} /></mesh>; })}
      </>; }} />;

// 7:16 · error 5, compararse: tres marcos grandes en la mesa (la señora de la tele, la vecina, la foto de 1965) caen boca abajo de a uno con un golpe;
// queda el espejo grande, con su reflejo, que brilla
export const G_compare: F = ({ t, h }) => { const L = useLabE();
  return <Hero d={1.4} ly={0.0} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([-0.25, 1.0, 1.6], [-0.4, 0.7, -0.5]), C([0.35, 1.1, 2.3], [0.25, 0.85, -0.6]), 8)}
    set={(tt: number) => ({ ...MOR, spot: [0.5, 0, -0.4] as V, spotK: 0.3 + 0.5 * sv(tt, 4.4, 5.4) })}
    scene={(tt) => { const f = [0, 1, 2].map((i) => Math.min(1, phys(tt, 1.4 + i * 0.9, 9, 0.4))), mir = sv(tt, 4.2, 5.2), me = armsUp(0.6 * mir);
      return <>
        <Wallp p={[0, 0, -1.0]} w={3.8} h={2.3} />
        <Table p={[-0.5, 0, -0.55]} w={1.2} d={0.45} h={0.42} />
        <group position={[-0.9, 0.42, -0.55]} rotation={[-1.5 * f[0], 0, 0]}><Box p={[0, 0.22, 0]} s={[0.42, 0.38, 0.22]} c="#2b2f36" r={0.4} rad={0.03} /><Box p={[0, 0.22, 0.111]} s={[0.36, 0.3, 0.004]} c="#9cc3e6" e="#9cc3e6" ei={0.5} />
          <group position={[0, 0.08, 0.12]}><Sachi p={armsUp(1, 1)} t={tt} s={S * 0.2} expr="feliz" color="#fde8e8" /></group></group>
        <Frame p={[-0.46, 0.42, -0.5]} fall={f[1]} w={0.4} h={0.52}><Sachi p={PZ.stand} t={tt} s={S * 0.24} expr="feliz" color="#efe0c8" /></Frame>
        <Frame p={[-0.02, 0.42, -0.5]} fall={f[2]} c="#c9a24e" w={0.4} h={0.52}><Sign p={[0, 0.3, 0.004]} w={0.18} h={0.08} map={L.ver} /><Sachi p={armsUp(1)} t={tt} s={S * 0.24} expr="carcajada" color="#f6efe2" /></Frame>
        <group position={[0.65, 0, -0.75]}><Box p={[0, 0.85, 0]} s={[0.66, 1.6, 0.06]} c="#8a5a34" r={0.5} /><Box p={[0, 0.85, 0.032]} s={[0.58, 1.52, 0.004]} c="#e6eef2" m={0.9} r={0.08} op={0.35} e="#fff2d0" ei={0.25 * mir} /></group>
        <Sachi p={me} t={tt} x={0.65} z={-0.95} rotY={0} s={S} expr={mir > 0.5 ? "feliz" : "pensativo"} />
        <Glow p={[0.65, 0.9, -0.7]} r={0.6} k={mir} c="#fff2d0" op={0.3} />
      </>; }} />; };

// 7:50 · inclinarse como árbol al viento: de frente, cámara baja; ella se inclina bien a un lado y al otro con el brazo por arriba, y el árbol de al lado se curva igual mientras vuelan hojas
export const G_sidebend: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.3, 0.8, 2.4], [0.2, 0.95, -0.4]), C([-0.2, 0.8, 2.4], [0.2, 0.95, -0.4]), 8.5)}
    set={(tt: number) => ({ ...MOR, spot: [0, 0, -0.3] as V, spotK: 0.5 })}
    scene={(tt) => { const k = tt > 0.4 ? Math.sin((tt - 0.4) * Math.PI / 2.8) * sv(tt, 0.4, 1.3) : 0, gust = Math.abs(k);
      return <>
        <Wallp p={[0, 0, -1.0]} w={4.2} h={2.4} c="#e3ecdf" />
        <Shoji p={[0, 1.0, -0.95]} w={2.4} h={1.6} glow={0.3} />
        <Tree p={[0.8, 0, -0.5]} sway={-0.55 * k} s={1.05} />
        <Leaves a={[1.0, 1.4, -0.4]} b={[-1.4, 0.9, 0.5]} t={tt} k={Math.min(1, gust * 2)} n={24} />
        <Sachi p={pose({ torso: { z: 34 * gust * (k >= 0 ? 1 : -1) } } as any, sideBend(gust, k >= 0 ? 1 : -1))} t={tt} x={-0.25} z={-0.1} s={S} expr="feliz" />
      </>; }} />;

// 8:22 · el roble es fuerte pero se quiebra; el sauce se dobla y vuelve: hojas cruzan con el viento, el roble se parte con astillas y su copa cae; el sauce se dobla casi hasta el piso y vuelve
export const G_willow: F = ({ t, h }) =>
  <Hero d={1.05} ly={0.0} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.3, 1.1, 2.7], [0, 0.85, -0.5]), C([-0.3, 1.1, 2.7], [0, 0.85, -0.5]), 8.5)}
    set={(tt: number) => ({ ...OUT, bg: "#c9d6dd", warm: 0.35, spot: [0, 0, -0.5] as V, spotK: 0.35 })}
    scene={(tt) => { const wind = sv(tt, 1.0, 2.0) * (1 - 0.6 * sv(tt, 6.5, 8.0)), brk = Math.min(1.05, phys(tt, 3.2, 6, 0.5)), bend = wind * (0.85 + 0.15 * Math.sin(tt * 2.6));
      return <>
        <Grass c="#8fa66a" />
        <group position={[-0.7, 0, -0.55]}>
          <Cyl p={[0, 0.32, 0]} r={0.1} r2={0.13} h={0.64} c="#5a3a22" rough={0.9} />
          {tt > 3.2 && [0, 1, 2, 3, 4, 5].map((i) => { const u = cl((tt - 3.2) / 0.8); return u < 1 && <Box key={i} p={[0.25 * u * Math.cos(i), 0.64 + 0.3 * u - 0.6 * u * u, 0.2 * u * Math.sin(i * 1.3)]} s={[0.02, 0.06, 0.015]} c="#c9a274" rot={[i, i * 0.6, u * 4]} />; })}
          <group position={[0, 0.64, 0]} rotation={[0, 0, tt > 3.2 ? -1.4 * brk : -0.04 * wind]}>
            <Cyl p={[0, 0.25, 0]} r={0.095} r2={0.1} h={0.5} c="#5a3a22" rough={0.9} />
            {[[0, 0.78, 0, 0.38], [-0.27, 0.62, 0.05, 0.28], [0.28, 0.64, -0.04, 0.29]].map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]} castShadow><sphereGeometry args={[r, 22, 16]} /><meshStandardMaterial color="#3f6b35" roughness={0.85} /></mesh>)}
          </group>
          <Glow p={[0, 0.64, 0.1]} r={0.2} k={tt > 3.2 && tt < 3.9 ? 1 - (tt - 3.2) / 0.7 : 0} c="#fff2d0" op={0.9} />
        </group>
        <group position={[0.75, 0, -0.55]}><group rotation={[0, 0, -1.1 * bend]}><Cyl p={[0, 0.55, 0]} r={0.035} r2={0.06} h={1.1} c="#6b4a2c" rough={0.9} />
          <mesh position={[0, 1.15, 0]} scale={[1, 0.6, 1]}><sphereGeometry args={[0.3, 20, 14]} /><meshStandardMaterial color="#7fa35a" roughness={0.85} /></mesh>
          {Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2, sw = 0.5 * bend + 0.06 * Math.sin(tt * 3 + i); return <group key={i} position={[Math.cos(a) * 0.25, 1.12, Math.sin(a) * 0.25]} rotation={[0, 0, -sw]}><Cyl p={[0, -0.38, 0]} r={0.011} h={0.76} c="#8fb565" /></group>; })}</group></group>
        <Leaves a={[-1.8, 1.3, -0.2]} b={[1.8, 0.9, -0.6]} t={tt} k={wind} n={16} />
      </>; }}
    over={(tt) => tt > 3.2 ? <Big tt={tt} at={3.3} txt="SNAP" col={RED} x={620} y={150} size={70} /> : null} />;

// 8:53 · abrí las alas: de perfil, cuerpo entero; los brazos van atrás y un lápiz grande queda apretado entre los omóplatos; después se da un abrazo
export const G_wings: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([-1.95, 1.2, 0.7], [0, 0.95, 0.2]), C([-1.85, 1.2, 1.15], [0, 0.95, 0.2]), 8.5)}
    set={(tt: number) => ({ ...MOR, spot: [0, 0, 0.2] as V, spotK: 0.5 })}
    scene={(tt) => { const k = sv(tt, 0.6, 2.0) * (1 - sv(tt, 4.8, 5.6)), hug = sv(tt, 5.2, 6.4), pen = sv(tt, 1.6, 2.4) * (1 - sv(tt, 4.6, 5.2)), p = wingsP(k, hug), hd = headOf(p, 0, 0.2);
      return <>
        <Wallp p={[0, 0, -0.8]} w={4.2} h={2.4} />
        <Shoji p={[0, 1.0, -0.75]} w={2.4} h={1.6} glow={0.3} />
        <Sachi p={p} t={tt} x={0} z={0.2} s={S} expr={hug > 0.5 ? "feliz" : "decidido"} />
        {pen > 0.02 && <group position={[hd[0], hd[1] - 0.33, hd[2] - 0.14]} rotation={[0, 0, Math.PI / 2]}><Cyl p={[0, 0, 0]} r={0.05} h={0.55 * pen} c="#c0392b" /><mesh position={[0, 0.275 * pen + 0.045, 0]}><coneGeometry args={[0.05, 0.09, 10]} /><meshStandardMaterial color="#e7c59a" /></mesh>
          <Glow p={[0, 0, 0]} r={0.2} k={k} c={AMB} op={0.5} /></group>}
        <Glow p={[0, hd[1] - 0.4, 0.3]} r={0.35} k={hug} c="#ffb3c6" op={0.35} />
      </>; }} />;

// 10:17 · enrollarse como una flor: de perfil y cerca; ella sube vértebra a vértebra mientras el tulipán grande de la maceta se abre al mismo ritmo
export const G_flower: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.55, 0.85, 2.3], [0.15, 0.7, -0.1]), C([0.0, 0.85, 2.35], [0.15, 0.7, -0.1]), 9)}
    set={(tt: number) => ({ ...MOR, warm: 0.6 + 0.2 * sv(tt, 2, 7), spot: [0.4, 0, -0.1] as V, spotK: 0.5 })}
    scene={(tt) => { const up = sv(tt, 1.2, 6.5), k = 1 - up;
      return <>
        <Wallp p={[0, 0, -0.9]} w={4} h={2.3} />
        <Sachi p={fold(k)} t={tt} x={-0.3} z={-0.15} rotY={70} s={S} expr={up > 0.7 ? "feliz" : "neutral"} />
        <group position={[0.42, 0, 0.25]}><Pot p={[0, 0, 0]} s={2.6} /><Bloom p={[0, 0.34, 0]} k={up} s={2.3} /></group>
        <Glow p={[0.42, 1.05, 0.25]} r={0.35} k={up} c="#ff9ab8" op={0.35} />
      </>; }}
    over={(tt) => <Big tt={tt} at={2.0} txt="ROLL UP SLOWLY" y={150} />} />;

// 11:09 · girar sentada hacia la ventana: cámara por encima de su hombro; gira bien y afuera el ciruelo grande florece y caen pétalos
export const G_lookout: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([-1.3, 1.2, 1.7], [0.25, 0.85, -0.6]), C([-1.0, 1.2, 1.9], [0.25, 0.85, -0.6]), 9.5)}
    set={(tt: number) => ({ ...MOR, spot: [0, 0, -0.3] as V, spotK: 0.5 })}
    scene={(tt) => { const k = sv(tt, 0.8, 2.8) * (1 - sv(tt, 6.4, 8.0)), bl = eio(tt, 2.4, 6.0);
      return <>
        <Wallp p={[0, 0, -0.95]} w={4} h={2.4} />
        <Win p={[0.6, 1.15, -0.9]} w={1.3} h={1.1} sky="#d6ebf7" />
        <Tree p={[0.6, 0.65, -0.86]} s={0.48} c="#6b4a2c" blossom={bl} thin />
        {bl > 0.3 && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const u = ((tt * 0.3 + i / 8) % 1); return <mesh key={i} position={[0.2 + 0.1 * i + 0.1 * Math.sin(u * 8 + i), 1.6 - 1.1 * u, -0.8 + 0.05 * i]} rotation={[tt + i, i, 0]} scale={[0.035, 0.008, 0.028]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#f7a6bf" transparent opacity={bl * Math.sin(Math.PI * u)} /></mesh>; })}
        <Chair p={[-0.2, 0, -0.2]} />
        <Sachi p={sitTwist(k, -1)} t={tt} x={-0.2} z={-0.2} s={S} expr={bl > 0.5 ? "feliz" : "neutral"} />
      </>; }} />;

// 11:58 · la primera hora es del cuerpo: tele grande en primer plano con el noticiero; se apaga (punto blanco), se abre la cortina y ella estira los brazos al sol
export const G_nonews: F = ({ t, h }) => { const L = useLabE();
  return <Hero d={1.4} ly={0.0} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([-0.75, 1.0, 2.2], [0.2, 0.85, -0.5]), C([-0.45, 1.0, 2.3], [0.2, 0.85, -0.5]), 8.5)}
    set={(tt: number) => ({ ...MOR, warm: 0.45 + 0.4 * sv(tt, 3.0, 4.5), spot: [0.3, 0, -0.3] as V, spotK: 0.3 + 0.4 * sv(tt, 3.0, 4.5) })}
    scene={(tt) => { const off = sv(tt, 2.2, 2.6), op = sv(tt, 3.0, 4.0), up = sv(tt, 4.0, 5.6);
      return <>
        <Wallp p={[0, 0, -0.95]} w={4} h={2.4} />
        <group position={[0.4, 1.3, -0.9]}><Win p={[0, 0, 0]} w={1.0} h={0.85} sky="#f6dca6" />
          <Curtain p={[-0.25, 0, 0.06]} w={0.5} h={0.85} c="#9db2c9" k={op} side={-1} /><Curtain p={[0.25, 0, 0.06]} w={0.5} h={0.85} c="#9db2c9" k={op} side={1} /></group>
        <Ray p={[0.4, 1.6, -0.8]} rot={[-0.5, 0, -0.3]} len={2.0} r={0.45} k={op} />
        <Table p={[-0.6, 0, 0.35]} w={0.8} d={0.45} h={0.42} />
        <group position={[-0.6, 0.42, 0.35]} rotation={[0, 0.5, 0]}>
          <Box p={[0, 0.27, 0]} s={[0.7, 0.52, 0.3]} c="#2b2f36" r={0.4} rad={0.04} />
          <mesh position={[0, 0.27, 0.152]} scale={[1, 1 - 0.97 * off, 1]}><planeGeometry args={[0.62, 0.44]} /><meshBasicMaterial map={L.news} toneMapped={false} /></mesh>
          <Glow p={[0, 0.27, 0.16]} r={0.05} k={off * (1 - sv(tt, 2.6, 3.2))} c="#ffffff" op={0.9} />
        </group>
        <Sachi p={armsUp(up, 0.5 * up)} t={tt} x={0.35} z={-0.3} rotY={-10} s={S} expr={up > 0.5 ? "feliz" : "aburrido"} />
      </>; }} />; };

// 12:15 · en los días malos, aunque sea un poquito: siete eslabones de cadena reales; sobre el quinto, una nube de lluvia; brilla menos, pero la cadena no se corta
export const G_skipchain: F = ({ t, h }) =>
  <Hero d={1.3} ly={0.0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.35, 1.05, 2.0], [0, 0.55, -0.3]), C([-0.35, 1.05, 2.0], [0, 0.55, -0.3]), 9)}
    set={(tt: number) => ({ ...WOOD, spot: [0, 0, -0.3] as V, spotK: 0.5 })}
    scene={(tt) => { const lit = (i: number) => sv(tt, 0.5 + i * 0.55, 0.9 + i * 0.55), rain = sv(tt, 2.3, 3.0), small = sv(tt, 3.6, 4.4), hold = sv(tt, 4.6, 5.4);
      return <>
        <Wallp p={[0, 0, -0.9]} w={4} h={2.3} />
        {Array.from({ length: 7 }, (_, i) => { const x = -0.9 + i * 0.3, bad = i === 4, k = lit(i) * (bad ? 0.35 + 0.65 * hold * 0.3 : 1);
          return <group key={i}>
            <group position={[x, 0.6 + 0.03 * Math.sin(tt * 1.5 + i), -0.3]} rotation={[i % 2 ? Math.PI / 2 : 0, 0, 0]}>
              <mesh scale={[1.35, 1, 1]}><torusGeometry args={[0.12, 0.035, 14, 40]} /><meshStandardMaterial color={bad ? "#8c97a3" : brass} metalness={0.8} roughness={0.3} emissive="#ffb347" emissiveIntensity={1.1 * k} /></mesh></group>
            {bad && <group position={[x, 1.05, -0.3]} scale={2.2}>{[[0, 0, 0.13], [-0.12, -0.03, 0.1], [0.12, -0.03, 0.1]].map(([a, b, r], j) => <mesh key={j} position={[a, b, 0]}><sphereGeometry args={[r, 18, 14]} /><meshStandardMaterial color="#8c97a3" roughness={1} transparent opacity={rain} /></mesh>)}
              {rain > 0.1 && [0, 1, 2, 3, 4].map((j) => <Box key={"r" + j} p={[-0.12 + j * 0.06, -0.15 - ((tt * 1.5 + j * 0.27) % 1) * 0.3, 0]} s={[0.01, 0.05, 0.01]} c="#5b8ec9" op={rain} />)}</group>}
          </group>; })}
        <Glow p={[0.3, 0.6, -0.2]} r={0.5} k={hold} c={AMB} op={0.25} />
      </>; }}
    over={(tt) => tt > 4.6 ? <Big tt={tt} at={4.8} txt="STILL COUNTS" y={960} /> : null} />;

// 13:04 · millones a la vez: islas 3D del archipiélago sobre el mar; desde la radio sale una onda y los puntitos se encienden en ola, isla por isla
const JP: [number, number, number, number, number][] = [[0.55, -0.62, 0.22, 0.32, 0.6], [0.2, -0.05, 0.16, 0.62, 0.35], [-0.3, 0.38, 0.12, 0.36, 0.95], [-0.55, 0.52, 0.09, 0.13, 0.3], [-0.65, 0.68, 0.08, 0.2, 0.1]];
const DOTS = Array.from({ length: 160 }, (_, i) => { const isl = JP[i % JP.length]; const a = (i * 2.399) % (Math.PI * 2), r = Math.sqrt(((i * 0.618) % 1)); return [isl[0] + Math.cos(a) * r * isl[2] * 0.85, isl[1] + Math.sin(a) * r * isl[3] * 0.85] as [number, number]; });
export const G_millions: F = ({ t, h }) =>
  <Hero d={1.1} ly={0.0} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.5, 1.55, 2.0], [0.15, 0.0, 0.05]), C([-0.2, 1.5, 2.1], [0.15, 0.0, 0.05]), 9)}
    set={(tt: number) => ({ floor: "none" as const, wall: false, bg: "#2d5d80", warm: 0.4, spot: [0, 0, 0] as V, spotK: 0.3 })}
    scene={(tt) => { const R0: [number, number] = [0.95, 0.6], wave = Math.max(0, tt - 1.6) * 0.75;
      return <>
        <Box p={[0, -0.02, 0]} s={[4.4, 0.04, 3.2]} c="#3f78a3" r={0.2} m={0.2} cast={false} />
        {JP.map(([x, z, w, d, rot], i) => <group key={i} position={[x, 0, z]} rotation={[0, rot, 0]}>
          <mesh scale={[w, 0.06, d]} castShadow><sphereGeometry args={[1, 28, 16]} /><meshStandardMaterial color="#8fb565" roughness={0.9} /></mesh>
          <mesh position={[0, 0.03, 0]} scale={[w * 0.45, 0.07, d * 0.45]}><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#6b8a4a" roughness={0.9} /></mesh>
          <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[w * 1.08, d * 1.08, 1]}><circleGeometry args={[1, 32]} /><meshBasicMaterial color="#e9dcb8" /></mesh></group>)}
        {DOTS.map(([x, z], i) => { const dd = Math.hypot(x - R0[0], z - R0[1]), on = cl((wave - dd) * 6), pulse = on * Math.pow(0.5 + 0.5 * Math.cos((tt - dd) * Math.PI * 2 / 0.9), 3), c = on > 0.5 ? "#ffcf6a" : "#efe6d6";
          return <group key={i} position={[x, 0.06, z]}><Cyl p={[0, 0.03, 0]} r={0.011} h={0.06} c={c} e="#ffb347" ei={on * (0.4 + 1.2 * pulse)} /><mesh position={[0, 0.075, 0]}><sphereGeometry args={[0.013, 8, 6]} /><meshStandardMaterial color={c} emissive="#ffb347" emissiveIntensity={on * (0.4 + 1.2 * pulse)} /></mesh>
            {on > 0.05 && [-1, 1].map((sd) => <Cyl key={sd} p={[sd * 0.014, 0.065 + 0.02 * on, 0]} r={0.004} h={0.04 * on} c={c} rot={[0, 0, -sd * 0.35]} />)}</group>; })}
        {[0, 1, 2].map((j) => { const u = ((Math.max(0, tt - 1.6)) / 2.4 + j / 3) % 1; return tt > 1.6 && <mesh key={"w" + j} position={[R0[0], 0.05, R0[1]]} rotation={[-Math.PI / 2, 0, 0]} scale={0.1 + 2.0 * u}><ringGeometry args={[0.48, 0.5, 64]} /><meshBasicMaterial color="#ffe3a0" transparent opacity={0.55 * (1 - u)} /></mesh>; })}
        <Radio p={[R0[0], 0.0, R0[1]]} s={0.8} rotY={-0.6} glow={sv(tt, 1.0, 1.6)} />
      </>; }} />;

// 13:21 · la tarjeta del verano: cerca, un lápiz grande dibuja un sol en cada casillero, mañana tras mañana; al final cae el premio, un lápiz con moño, y brilla
export const G_stampcard: F = ({ t, h }) => { const L = useLabE();
  return <Hero d={1.1} ly={0.0} t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.1, 1.15, 0.65], [0, 0.42, -0.28]), C([-0.1, 1.15, 0.7], [0, 0.42, -0.28]), 8)}
    set={(tt: number) => ({ ...WOOD, warm: 0.45, spot: [0, 0, -0.25] as V, spotK: 0.35 })}
    scene={(tt) => { const n = Math.min(18, Math.floor(Math.max(0, tt - 0.6) * 3.4)), cur = n % 18, prize = drop(tt, 6.0, 0.4);
      const cell = (i: number): V => { const c = i % 6, r = Math.floor(i / 6); return [-0.375 + c * 0.15 + 0.06, 0.427, -0.38 + r * 0.172 + 0.02]; };
      const pc = cell(Math.min(17, cur));
      return <>
        <Table p={[0, 0, -0.25]} w={1.4} d={0.8} h={0.42} c="#8a5a34" />
        <mesh position={[0, 0.423, -0.25]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.96, 0.675]} /><meshStandardMaterial map={L.card} roughness={0.95} /></mesh>
        {Array.from({ length: n }, (_, i) => { const c = cell(i), pop = cl((tt - 0.6 - (i + 1) / 3.4) * 5 + 1); return <group key={i} position={c} scale={0.4 + 0.6 * pop}><Cyl p={[0, 0, 0]} r={0.035} h={0.006} c="#f2a33a" e="#ffb347" ei={0.25} />{[0, 1, 2, 3, 4, 5, 6, 7].map((j) => <Box key={j} p={[Math.cos(j * 0.785) * 0.05, 0, Math.sin(j * 0.785) * 0.05]} s={[0.02, 0.004, 0.007]} c="#f2a33a" rot={[0, -j * 0.785, 0]} />)}</group>; })}
        {tt < 6 && <group position={[pc[0] + 0.03 * Math.cos(tt * 18), 0.52, pc[2] + 0.03 * Math.sin(tt * 18)]} rotation={[0.5, 0, -0.5]}><Cyl p={[0, 0.12, 0]} r={0.016} h={0.26} c="#f2c14e" /><mesh position={[0, -0.03, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.016, 0.05, 10]} /><meshStandardMaterial color="#e7c59a" /></mesh></group>}
        {prize.on && <group position={[0.0, 0.5 + prize.y, -0.12]} rotation={[0, 0.3, 0]} scale={2.6}><Cyl p={[0, 0, 0]} r={0.012} h={0.3} c="#3d5a80" rot={[0, 0, Math.PI / 2]} /><Box p={[0, 0.0, 0]} s={[0.05, 0.05, 0.05]} c="#c0392b" rot={[0.6, 0.6, 0]} rad={0.01} /><Glow p={[0, 0, 0]} r={0.12} k={prize.s} c={AMB} op={0.4} /></group>}
      </>; }}
    over={(tt) => <Big tt={tt} at={1.0} txt="ONE SUN A DAY" y={150} />} />; };

// 14:24 · la madre la vio levantarse como una viejita: la hija se incorpora del futón por etapas, encorvada; la madre señala la radio y la radio se enciende con notas
export const G_whereradio: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.45, 1.15, 2.6], [0.05, 0.6, -0.3]), C([-0.15, 1.15, 2.6], [0.05, 0.6, -0.3]), 8)}
    set={(tt: number) => ({ ...MOR, spot: [0, 0, -0.3] as V, spotK: 0.5 })}
    scene={(tt) => { const r1 = sv(tt, 0.4, 1.3), r2 = sv(tt, 1.5, 2.6), point = sv(tt, 3.0, 3.8), rad = sv(tt, 4.0, 4.6);
      const kid = mezclar(mezclar(PZ.lying, PZ.kneel, r1), PZ.slump, r2);
      return <>
        <Wallp p={[0, 0, -0.95]} w={4} h={2.4} />
        <Futon p={[-0.5, 0, -0.1]} qk={1 - r1} />
        <Sachi p={kid} t={tt} x={-0.5} z={0.0} rotY={20} s={S} expr={r2 > 0.5 ? "bostezo" : "dormido"} />
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoI = { ...q.manoI, p: [0.35, -0.75, 0.05] }; q.manoD = { ...q.manoD, p: [lerp(-0.42, -0.85, point), lerp(-1.27, -0.2, point), lerp(0.05, 0.45, point)] }; })} t={tt} x={0.62} z={-0.3} rotY={-70} s={S * 1.04} expr="decidido" color="#e9e3d8" />
        <Table p={[0.15, 0, -0.75]} w={0.6} d={0.35} h={0.4} />
        <Radio p={[0.15, 0.4, -0.75]} s={1.2} glow={rad} />
        <Glow p={[0.15, 0.6, -0.65]} r={0.4} k={rad} c={AMB} op={0.35} />
        {[0, 1, 2, 3].map((i) => <group key={i} scale={1.5}><Note p={[(0.05 + 0.08 * i) / 1.5, 0.95 / 1.5, -0.65 / 1.5]} k={rad > 0.5 ? ((tt - 4.4) * 0.45 + i / 4) % 1 : 0} c={i % 2 ? "#b5523b" : "#2a1d12"} /></group>)}
      </>; }}
    over={(tt) => <Big tt={tt} at={1.6} txt="LIKE AN OLD WOMAN" y={150} col={TX} size={66} />} />;

// 14:40 · contaba en japonés: madre e hija levantan los brazos juntas y en cada tiempo cae un bloque rojo con el número (一 ICHI, 二 NI…), justo cuando suben los brazos
export const G_ichini: F = ({ t, h }) => { const L = useLabE2();
  return <Hero d={1.4} ly={0.0} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.3, 1.25, 2.55], [0, 1.15, -0.4]), C([-0.3, 1.25, 2.55], [0, 1.15, -0.4]), 9)}
    set={(tt: number) => ({ floor: "wood" as const, warm: 0.6, spot: [0, 0, -0.4] as V, spotK: 0.5 })}
    scene={(tt) => { const B = 1.1, up = tt > 1.2 ? loop(tt - 1.2, B) : 0;
      return <>
        <Wallp p={[0, 0, -0.95]} w={4} h={2.6} c="#f2ead8" />
        <Win p={[0, 1.1, -0.92]} w={1.4} h={0.7} sky="#f6dca6" />
        <Sachi p={armsUp(up)} t={tt} x={-0.35} z={-0.3} s={S * 1.0} expr="feliz" color="#e9e3d8" />
        <Sachi p={armsUp(up)} t={tt} x={0.35} z={-0.15} s={S2} expr="carcajada" />
        {[0, 1, 2, 3].map((i) => { const d = drop(tt, 1.2 + i * B + B / 2 - 0.25, 0.9); return d.on && <Block key={i} p={[-0.84 + i * 0.56, 1.8 + d.y, -0.6]} map={L.kj[i]} s={1.6} glow={cl(1 - (tt - (1.2 + i * B + B / 2)) * 1.5)} rot={[0, 0, 0.3 * (1 - Math.min(1, d.s))]} />; })}
      </>; }} />; };

// 15:45 · un vaso de agua tibia: el vaso grande humea junto al futón; ella lo levanta, toma, y una banda de luz tibia baja por el torso
export const G_warmcup: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.55, 0.9, 1.5], [0.0, 0.45, -0.1]), C([0.05, 0.95, 1.6], [0.0, 0.45, -0.1]), 9)}
    set={(tt: number) => ({ ...MOR, warm: 0.7, spot: [0, 0, -0.1] as V, spotK: 0.6 })}
    scene={(tt) => { const lift = sv(tt, 1.6, 2.8) * (1 - sv(tt, 6.0, 7.0)), sip = sv(tt, 2.8, 3.4), warm = eio(tt, 3.4, 6.0);
      const p = withHands(PZ.seiza, (q: any) => { q.manoD = { ...q.manoD, p: [lerp(-0.3, -0.12, lift), lerp(-0.9, -0.1, lift), lerp(0.4, 0.5, lift)] }; q.cabeza = { ...(q.cabeza || {}), x: -12 * sip * lift }; });
      const hp = handOf(p, "D", 0, 0.05), rest: V = [0.4, 0.03, 0.15], cup: V = [lerp(rest[0], hp[0], lift), lerp(rest[1], hp[1] - 0.05, lift), lerp(rest[2], hp[2] + 0.04, lift)], hy = headOf(p, 0, 0.05)[1];
      return <>
        <Wallp p={[0, 0, -0.95]} w={4} h={2.4} />
        <Futon p={[-0.2, 0, -0.45]} qk={0} />
        <Box p={[0.4, 0.015, 0.15]} s={[0.3, 0.03, 0.22]} c="#6b4a2c" r={0.5} />
        <group position={cup} scale={2.8}><Cyl p={[0, 0.06, 0]} r={0.045} r2={0.04} h={0.12} c="#e9f2f7" op={0.55} rough={0.1} /><Cyl p={[0, 0.045, 0]} r={0.038} h={0.08} c="#f6e6c8" op={0.6} /></group>
        <Steam p={[cup[0], cup[1] + 0.36, cup[2]]} t={tt} k={1 - sip * 0.6} n={6} />
        <Sachi p={p} t={tt} x={0.0} z={0.05} s={S} expr={warm > 0.5 ? "feliz" : "neutral"} />
        <Glow p={[0.0, lerp(hy - 0.2, hy - 0.75, warm), 0.12]} r={0.32} k={Math.sin(Math.PI * warm)} c="#ffb347" op={0.6} />
      </>; }} />;

// 16:42 · no es fuerza, es que se mueva: dos engranajes grandes oxidados y trabados que tiemblan; la aceitera deja caer tres gotas visibles y empiezan a girar, se limpian
export const G_gears: F = ({ t, h }) =>
  <Hero d={1.15} ly={0.0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 0.95, 1.55], [0, 0.7, -0.4]), C([-0.25, 0.95, 1.55], [0, 0.7, -0.4]), 9)}
    set={(tt: number) => ({ ...WOOD, spot: [0, 0, -0.3] as V, spotK: 0.6 })}
    scene={(tt) => { const pour = sv(tt, 1.6, 2.4) * (1 - sv(tt, 4.0, 4.6)), go = eio(tt, 4.0, 6.0), ang = go * (tt - 4.0) * 1.6, jit = tt < 4 ? 0.03 * Math.sin(tt * 40) * (tt % 1 < 0.3 ? 1 : 0) : 0;
      const rust = (c: string) => go > 0.5 ? c : "#8a4b2a";
      return <>
        <Wallp p={[0, 0, -0.75]} w={3.8} h={2.3} c="#e6ddcc" />
        <Gear p={[-0.28, 0.7, -0.5]} r={0.34} ang={ang + jit} c={rust("#c9a24e")} m={go * 0.8} rough={1 - 0.7 * go} />
        <Gear p={[0.32, 0.47, -0.5]} r={0.24} ang={-ang * 1.42 + 0.26 - jit} c={rust("#b0b6bc")} m={go * 0.8} n={9} rough={1 - 0.7 * go} />
        <group position={[-0.05, 1.12, -0.3]} rotation={[0, 0, 0.9 * pour]} scale={1.6}>
          <Cyl p={[0, 0, 0]} r={0.08} r2={0.09} h={0.12} c="#3d5a80" m={0.6} rough={0.3} />
          <Cyl p={[-0.12, 0.02, 0]} r={0.008} r2={0.014} h={0.2} c="#9aa0a6" m={0.8} rough={0.3} rot={[0, 0, 1.2]} />
        </group>
        {[0, 1, 2].map((i) => { const u = cl((tt - 2.2 - i * 0.5) / 0.6); return u > 0 && u < 1 && <mesh key={i} position={[-0.27, 1.0 - 0.26 * u, -0.3]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.048, 12, 10]} /><meshStandardMaterial color="#d9a441" metalness={0.5} roughness={0.1} emissive="#ffb347" emissiveIntensity={0.4} /></mesh>; })}
        {[0, 1, 2].map((i) => { const u = cl((tt - 2.8 - i * 0.5) / 0.5); return u > 0 && u < 1 && <Glow key={"s" + i} p={[-0.3, 0.9, -0.25]} r={0.05 + 0.1 * u} k={1 - u} c="#ffcf6a" op={0.6} />; })}
        <Glow p={[-0.28, 0.7, -0.4]} r={0.45} k={go} c={AMB} op={0.25} />
      </>; }} />;

// 17:48 · círculos grandes con los hombros: plano medio del torso; en cada hombro un anillo de luz grueso con un cometa que deja estela mientras los rota
export const G_shoulderroll: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.45, 1.3, 1.1], [0, 1.15, -0.1]), C([-0.3, 1.3, 1.15], [0, 1.15, -0.1]), 8)}
    set={(tt: number) => ({ ...MOR, spot: [0, 0, -0.2] as V, spotK: 0.5 })}
    scene={(tt) => { const on = sv(tt, 0.6, 1.4), a = Math.max(0, tt - 0.8) * 2.4, lift = 0.5 + 0.5 * Math.sin(a);
      const p = withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-0.42, -1.27 + 0.12 * lift * on, 0.05 + 0.08 * Math.cos(a) * on] }; q.manoI = { ...q.manoI, p: [0.42, -1.27 + 0.12 * lift * on, 0.05 + 0.08 * Math.cos(a) * on] }; q.cabeza = { ...(q.cabeza || {}), x: -4 * lift * on }; });
      const hy = headOf(p, 0, -0.1)[1] - 0.3;
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.8} h={2.3} />
        <Shoji p={[0, 1.2, -0.85]} w={2.0} h={1.4} glow={0.25} />
        <Sachi p={p} t={tt} x={0} z={-0.1} s={S} expr="feliz" />
        {[-1, 1].map((d) => <group key={d} position={[d * 0.19, hy, -0.1]} rotation={[0, Math.PI / 2, 0]}>
          <mesh><torusGeometry args={[0.13, 0.024, 12, 56]} /><meshStandardMaterial color="#ffcf6a" emissive="#ffb347" emissiveIntensity={1.0 * on} transparent opacity={on * 0.9} /></mesh>
          {Array.from({ length: 9 }, (_, j) => <mesh key={j} position={[Math.cos(a - j * 0.16) * 0.13, Math.sin(a - j * 0.16) * 0.13, 0]}><sphereGeometry args={[0.048 * (1 - j / 10), 12, 10]} /><meshStandardMaterial color="#fff2d0" emissive="#ffcf6a" emissiveIntensity={1.6 * on} transparent opacity={on * (1 - j / 10)} /></mesh>)}
        </group>)}
      </>; }} />;

// 18:04 · decir que sí y después que no: sentada; la cabeza asiente y una gran tilde verde de luz se dibuja al lado; después gira y una flecha curva rodea su cara de costado
export const G_yesno: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.35, 1.05, 1.5], [0, 0.95, -0.1]), C([-0.25, 1.05, 1.55], [0, 0.95, -0.1]), 8.5)}
    set={(tt: number) => ({ ...MOR, spot: [0, 0, -0.2] as V, spotK: 0.5 })}
    scene={(tt) => { const yes = tt < 4.0 ? Math.sin(tt * 2.4) * sv(tt, 0.4, 1.0) * (1 - sv(tt, 3.4, 4.0)) : 0, no = tt > 4.2 ? Math.sin((tt - 4.2) * 2.0) * sv(tt, 4.2, 4.8) : 0;
      const p = headP(yes * 0.8, no * 0.8, chairSit), hd = headOf(p, 0, -0.1), ck = sv(tt, 0.8, 1.6) * (1 - sv(tt, 3.6, 4.2)), ar = sv(tt, 4.4, 5.4);
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.8} h={2.3} />
        <Sachi p={p} t={tt} x={0} z={-0.1} s={S} expr="feliz" />
        <Chair p={[0, 0, -0.1]} />
        {ck > 0.02 && <group position={[hd[0] - 0.4, hd[1], hd[2] + 0.1]} scale={1.8 * (0.6 + 0.4 * ck)}>
          <Box p={[-0.05, -0.04, 0]} s={[0.035, 0.14 * ck, 0.035]} c={GRN} e={GRN} ei={0.9} rot={[0, 0, 0.75]} rad={0.012} />
          <Box p={[0.06, 0.02, 0]} s={[0.035, 0.28 * cl(ck * 1.5 - 0.3), 0.035]} c={GRN} e={GRN} ei={0.9} rot={[0, 0, -0.55]} rad={0.012} /></group>}
        {ar > 0.02 && <group position={[hd[0] + 0.4, hd[1], hd[2]]} rotation={[0, 0, -0.6]}><mesh><torusGeometry args={[0.21, 0.032, 12, 50, Math.PI * 1.3 * ar]} /><meshStandardMaterial color={AMB} emissive="#ffb347" emissiveIntensity={0.9} /></mesh>
          <mesh position={[0.21 * Math.cos(Math.PI * 1.3 * ar), 0.21 * Math.sin(Math.PI * 1.3 * ar), 0]} rotation={[0, 0, Math.PI * 1.3 * ar]}><coneGeometry args={[0.075, 0.14, 10]} /><meshStandardMaterial color={AMB} emissive="#ffb347" emissiveIntensity={0.9} /></mesh></group>}
      </>; }} />;

// 19:12 · abrir los brazos a los costados y arriba: cerca; un rastro dorado grueso dibuja el gran círculo de sus manos y entra el aire por los costados
export const G_bigcircle: F = ({ t, h }) =>
  <Hero d={1.4} ly={0.0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 1.1, 1.95], [0, 1.0, -0.1]), C([-0.25, 1.1, 1.95], [0, 1.0, -0.1]), 9.5)}
    set={(tt: number) => ({ ...MOR, warm: 0.65, spot: [0, 0, -0.2] as V, spotK: 0.5 })}
    scene={(tt) => { const k = tt < 5.2 ? sv(tt, 0.8, 4.6) : 1 - sv(tt, 5.4, 8.6), air = sv(tt, 1.5, 4.5) * (1 - sv(tt, 5.0, 6.0));
      const trail = Array.from({ length: 30 }, (_, i) => { const kk = (i / 29) * k; return [handOf(circle(kk), "D", 0, -0.1), handOf(circle(kk), "I", 0, -0.1)]; });
      return <>
        <Wallp p={[0, 0, -0.9]} w={3.8} h={2.4} />
        <Shoji p={[0, 1.0, -0.85]} w={2.4} h={1.6} glow={0.45} />
        <Trail pts={trail.map((x) => x[0])} r={0.05} />
        <Trail pts={trail.map((x) => x[1])} r={0.05} />
        <Flow a={[-0.9, 1.3, -0.4]} b={[0, 1.05, -0.05]} t={tt} k={air} c="#bfe3ff" n={12} r={0.016} speed={0.45} />
        <Flow a={[0.9, 1.3, -0.4]} b={[0, 1.05, -0.05]} t={tt + 0.3} k={air} c="#bfe3ff" n={12} r={0.016} speed={0.45} />
        <Sachi p={circle(k)} t={tt} x={0} z={-0.1} s={S} expr={k > 0.6 ? "feliz" : "neutral"} />
      </>; }} />;

// 22:16 · el cuerpo es un jardín: dos canteros grandes enfrentados; el que ella riega florece flor por flor, el de al lado se llena de yuyos altos
export const G_garden: F = ({ t, h }) =>
  <Hero d={1.25} ly={0.0} t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.3, 1.05, 2.0], [0, 0.4, -0.35]), C([-0.25, 1.05, 2.0], [0, 0.4, -0.35]), 5)}
    set={(tt: number) => ({ ...OUT, bg: "#d6e6ef", warm: 0.6, spot: [0, 0, -0.3] as V, spotK: 0.55 })}
    scene={(tt) => { const w = eio(tt, 0.6, 4.2), pour = sv(tt, 0.3, 0.8) * (1 - sv(tt, 4.2, 4.8));
      return <>
        <Grass c="#a7c27a" />
        {[-1, 1].map((d) => <Box key={d} p={[d * 0.5, 0.08, -0.4]} s={[0.85, 0.16, 0.6]} c={d < 0 ? "#6b4a2c" : "#7a6650"} r={1} />)}
        {[0, 1, 2, 3, 4, 5].map((i) => { const g = eio(tt, 0.5 + i * 0.5, 1.4 + i * 0.5); return <Bloom key={i} p={[-0.78 + (i % 3) * 0.28, 0.16, -0.58 + Math.floor(i / 3) * 0.3]} k={g} s={0.5 + 0.6 * g} c={["#e0486a", "#f2c14e", "#9b6bd1"][i % 3]} stem={0.3} />; })}
        {Array.from({ length: 15 }, (_, i) => i).map((i) => <mesh key={"y" + i} position={[0.14 + (i % 5) * 0.18, 0.16 + 0.16 * w, -0.62 + Math.floor(i / 5) * 0.2]} rotation={[0.25 * Math.sin(i), 0, 0.35 * Math.cos(i * 2)]} scale={[1, 0.3 + 2.0 * w, 1]}><coneGeometry args={[0.05, 0.26, 5]} /><meshStandardMaterial color="#5c6b3a" roughness={1} /></mesh>)}
        <group position={[-0.42, 0.8, 0.12]} rotation={[0, 0, 0.6 * pour]} scale={1.5}><Cyl p={[0, 0, 0]} r={0.07} h={0.14} c="#7aa0b8" m={0.5} rough={0.4} /><Cyl p={[0.12, 0.03, 0]} r={0.01} r2={0.018} h={0.18} c="#7aa0b8" m={0.5} rot={[0, 0, -1.1]} /></group>
        {pour > 0.5 && [0, 1, 2, 3, 4].map((i) => { const u = ((tt * 1.8 + i * 0.2) % 1); return <Box key={"d" + i} p={[-0.42 + 0.05 * u, 0.72 - 0.5 * u, -0.1 - 0.05 * i]} s={[0.01, 0.04, 0.01]} c="#5b8ec9" />; })}
        <Sachi p={withHands(PZ.stand, (q: any) => { q.manoD = { ...q.manoD, p: [-0.42, -0.35, 0.45] }; })} t={tt} x={-0.72} z={0.2} rotY={50} s={S} expr="feliz" />
      </>; }} />;

// CUADRO 0 · la miniatura rehecha en código (sin texto ni flecha): ventana soleada, ella en puntas de pie con los brazos arriba riéndose y el bastón tirado en el piso
export const G_cuadro0: F = ({ t, h }) =>
  <Hero d={0.84} ly={0.0} t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 1.05, 2.55], [0.0, 0.95, -0.5], 40), C([0.0, 1.05, 2.55], [0.0, 0.95, -0.5], 40), 12)}
    set={(tt: number) => ({ floor: "tatami" as const, warm: 0.8, spot: [0.1, 0, -0.3] as V, spotK: 0.65 })}
    scene={(tt) => <>
      <Wallp p={[0, 0, -0.95]} w={4} h={2.6} />
      <Win p={[0.0, 1.35, -0.9]} w={1.5} h={1.15} sky="#f6dca6" />
      <Sun p={[0.25, 1.55, -1.05]} r={0.18} k={1} />
      <Glow p={[0.0, 1.3, -0.85]} r={0.8} k={1} c="#ffd27a" op={0.3} />
      <Cane p={[0.55, 0.015, 0.25]} rotZ={-Math.PI / 2 + 0.02} rotY={0.4} />
      <Radio p={[-0.85, 0, -0.6]} s={0.85} rotY={0.4} glow={0.8} />
      <Sachi p={armsUp(1, 1)} t={1.0} x={-0.05} z={0.0} s={S} expr="carcajada" />
    </>} />;
