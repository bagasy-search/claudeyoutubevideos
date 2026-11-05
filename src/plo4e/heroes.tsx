// plo4e v2 · ¿TIENES UNA FUGA OCULTA? · reescrito tras EVAL r1 (prom 5.0): CERO rótulos; paredes en CORTE 3D con capas (yeso con textura, ladrillo, hueco),
// medidor de bronce con vidrio y estrellita que GIRA con aspas grandes, manchas de humedad orgánicas con borde oscuro, todo ENTRA (nada aparece entero),
// cámara cercana y fija (fit={false}) con margen, sombra de contacto, y el momento clave antes de tt≈4.
// Protagonista: el MÉTODO de detección — medidor con todo cerrado, la llave general que parte la casa, el colorante, el papel, la oreja en la varilla.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, phys, RED, Stage, VER } from "./ckit";
import { ctex, Estudio, M, RBox, rn } from "./estudio3d";
import { AGUA, Reloj } from "./kitplo";
import { Inodoro, LlavePaso } from "./kitbano";

type C = React.FC<{ t: number; h: H }>;
type V3 = [number, number, number];
const P = Math.PI, P2 = P / 2;
const rel = (h: H, i: number) => (h.items?.[i]?.a ?? h.at + 99) - h.at;
const IN = (tt: number, a: number) => phys(tt, a, 7, 0.45);
const AT = (h: H, i: number, step = 1.1, a0 = 0.6) => rel(h, i) > 90 ? a0 + i * step : rel(h, i);
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const AZUL = "#2f6fe0", TINTA = "#1d4fd8", YESO = "#e9e2d2";
const GLOW = (c: string, o = 1) => <meshBasicMaterial color={c} transparent opacity={o} toneMapped={false} depthWrite={false} />;
const VIDRIO = (o = 0.26) => <meshPhysicalMaterial color="#e3f1f5" roughness={0.03} clearcoat={1} transparent opacity={o} side={THREE.DoubleSide} depthWrite={false} />;
const BRONCE = () => <meshStandardMaterial color="#b98a3e" metalness={0.85} roughness={0.3} />;
const COBRE = () => <meshStandardMaterial color="#c4693a" metalness={0.8} roughness={0.3} />;
// ---------- texturas ----------
const ruido = (k: string, base: string, spots: string[], n = 3000, sz = 4) => ctex("p4e2:" + k, 512, 512, (g) => { g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < n; i++) { g.fillStyle = spots[i % spots.length]; g.globalAlpha = 0.2 + 0.45 * rn(i, 7); const r = 1 + rn(i, 4) * sz; g.beginPath(); g.arc(rn(i, 2) * 512, rn(i, 3) * 512, r, 0, 2 * P); g.fill(); } g.globalAlpha = 1; });
const yeso = () => ruido("yeso", YESO, ["#f4efe3", "#d9d0bd", "#efe8d8", "#cfc5b0"], 5000, 3);
const ladrillo = () => ctex("p4e2:ladr", 512, 256, (g) => { for (let r = 0; r < 8; r++) for (let c = 0; c < 9; c++) { const x = c * 64 + (r % 2) * 32 - 32;
  g.fillStyle = ["#a8553a", "#b8643f", "#9a4c33", "#c06c48"][(r * 3 + c) % 4]; g.fillRect(x, r * 32, 64, 32);
  for (let i = 0; i < 30; i++) { g.fillStyle = "rgba(0,0,0,0.12)"; g.fillRect(x + rn(i + c * 31, r) * 60, r * 32 + rn(i, c + r) * 30, 2, 2); } }
  g.strokeStyle = "#d9cdb8"; g.lineWidth = 5; for (let r = 0; r <= 8; r++) { g.beginPath(); g.moveTo(0, r * 32); g.lineTo(512, r * 32); g.stroke();
    for (let c = 0; c < 10; c++) { const x = c * 64 + (r % 2) * 32; g.beginPath(); g.moveTo(x, r * 32); g.lineTo(x, r * 32 + 32); g.stroke(); } } });
const tierra = () => ruido("tierra", "#5e4128", ["#7a5636", "#3f2a18", "#8a6a48", "#4a3320"], 5000, 4);
const azulejo = () => ctex("p4e2:azu", 512, 512, (g) => { for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { g.fillStyle = (r + c) % 2 ? "#e9eef0" : "#dde5e8"; g.fillRect(c * 128, r * 128, 128, 128);
  const gr = g.createLinearGradient(c * 128, r * 128, c * 128 + 128, r * 128 + 128); gr.addColorStop(0, "rgba(255,255,255,0.5)"); gr.addColorStop(0.5, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(c * 128, r * 128, 128, 128); }
  g.strokeStyle = "#a9b3b7"; g.lineWidth = 4; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 128, 0); g.lineTo(i * 128, 512); g.stroke(); g.beginPath(); g.moveTo(0, i * 128); g.lineTo(512, i * 128); g.stroke(); } });
const manchaTex = () => ctex("p4e2:mancha", 512, 512, (g) => { g.clearRect(0, 0, 512, 512);
  for (let i = 0; i < 26; i++) { const a = rn(i, 1) * 2 * P, r = 60 + rn(i, 2) * 120, x = 256 + Math.cos(a) * r * 0.55, y = 256 + Math.sin(a) * r * 0.55, R = 70 + rn(i, 3) * 70;
    const gr = g.createRadialGradient(x, y, 0, x, y, R); gr.addColorStop(0, "rgba(120,96,60,0.55)"); gr.addColorStop(0.75, "rgba(110,86,52,0.4)"); gr.addColorStop(0.92, "rgba(70,52,30,0.75)"); gr.addColorStop(1, "rgba(70,52,30,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, R, 0, 2 * P); g.fill(); } });
const sombraTex = () => ctex("p4e2:sombra", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(0,0,0,0.8)"); gr.addColorStop(0.45, "rgba(0,0,0,0.4)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const halo = () => ctex("p4e2:halo", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(255,248,220,0.95)"); gr.addColorStop(0.3, "rgba(255,240,200,0.35)"); gr.addColorStop(1, "rgba(255,240,200,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const Sombra: React.FC<{ p: V3; r: number; o?: number; sx?: number }> = ({ p, r, o = 0.75, sx = 1 }) =>
  <mesh position={p} rotation={[-P2, 0, 0]} scale={[sx, 1, 1]} renderOrder={2}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={sombraTex()} transparent opacity={o} depthWrite={false} toneMapped={false} /></mesh>;
const Halo: React.FC<{ p: V3; r: number; c?: string; o?: number }> = ({ p, r, c = "#fff3c0", o = 1 }) => r <= 0.001 || o <= 0.01 ? null :
  <mesh position={p} renderOrder={5}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={halo()} color={c} transparent opacity={o} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} /></mesh>;
const Fondo: React.FC<{ z?: number; c?: string }> = ({ z = -0.9, c = "#141a20" }) => <mesh position={[0, 0.3, z]}><planeGeometry args={[8, 5]} /><meshBasicMaterial color={c} toneMapped={false} /></mesh>;
const Piso: React.FC<{ y?: number; c?: string }> = ({ y = 0, c = "#4a4440" }) =>
  <mesh position={[0, y, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[7, 5]} /><meshStandardMaterial map={ruido("piso" + c, c, ["#5a534e", "#3b3632"], 2500, 3)} roughness={0.95} /></mesh>;
const Caño: React.FC<{ a: V3; b: V3; r?: number; mat?: React.ReactNode }> = ({ a, b, r = 0.03, mat }) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = Math.max(0.001, d.length());
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()), m = A.clone().add(B).multiplyScalar(0.5);
  return <mesh position={[m.x, m.y, m.z]} quaternion={q}><cylinderGeometry args={[r, r, L, 20]} />{mat ?? COBRE()}</mesh>;
};
const Anillo: React.FC<{ p: V3; r: number; o: number; c?: string; rot?: V3; w?: number }> = ({ p, r, o, c = "#ffffff", rot = [-P2, 0, 0], w = 0.85 }) => o <= 0.01 ? null :
  <mesh position={p} rotation={rot} scale={r}><ringGeometry args={[w, 1, 48]} /><meshBasicMaterial color={c} transparent opacity={o} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>;
const Toro: React.FC<{ p: V3; r: number; o: number; c?: string; rot?: V3 }> = ({ p, r, o, c = "#ffffff", rot = [0, 0, 0] }) => o <= 0.01 ? null :
  <mesh position={p} rotation={rot}><torusGeometry args={[r, 0.008 + r * 0.04, 8, 48]} />{GLOW(c, o)}</mesh>;
const Chorro: React.FC<{ a: V3; t: number; k: number; v?: V3; n?: number; c?: string; r?: number }> = ({ a, t, k, v = [0, 0, 0], n = 22, c = "#9fd4f4", r = 0.01 }) => k <= 0.01 ? null : <>
  {Array.from({ length: n }, (_, i) => { const q = (t * 1.6 + i / n) % 1, s = q * 0.5; return <mesh key={i} position={[a[0] + v[0] * s, a[1] + v[1] * s - 2.2 * s * s, a[2] + v[2] * s]} scale={[r * k, r * k * 1.5, r * k]}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.9, c)}</mesh>; })}</>;
const GotaC: React.FC<{ p: V3; s?: number; c?: string }> = ({ p, s = 0.02, c = "#9fd4f4" }) => <group position={p} scale={s}>
  <mesh><sphereGeometry args={[1, 16, 12]} />{AGUA(0.92, c)}</mesh><mesh position={[0, 1.1, 0]}><coneGeometry args={[0.7, 1.3, 16]} />{AGUA(0.92, c)}</mesh>
  <mesh position={[-0.3, 0.3, 0.75]} scale={0.25}><sphereGeometry args={[1, 8, 6]} />{GLOW("#ffffff", 0.9)}</mesh></group>;
// ---------- medidor: caja de bronce, vidrio, rodillos y la estrellita roja de aspas grandes ----------
const tambor = () => ctex("p4e2:tambor", 1024, 256, (g) => { g.fillStyle = "#151515"; g.fillRect(0, 0, 1024, 256); g.fillStyle = "#f3ecd8"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 92px Inter, Arial, sans-serif";
  for (let n = 0; n <= 10; n++) { g.save(); g.translate(n * 102.4, 128); g.rotate(P2); g.scale(1.9, 1); g.fillText(String(n % 10), 0, 6); g.restore(); } });
const Rodillos: React.FC<{ p: V3; val: number; n: number; s?: number }> = ({ p, val, n, s = 1 }) => {
  const pos = (k: number) => { const m = Math.pow(10, k), v = val / m; if (k === 0) return v; return Math.floor(v) + cl((val % m) - (m - 1)); };
  return <group position={p} scale={s}>{Array.from({ length: n }, (_, i) => <group key={i} position={[(-n / 2 + 0.5 + i) * 0.2, 0, 0]} rotation={[2 * P * pos(n - 1 - i) / 10, 0, 0]}>
    <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.17, 0.17, 0.16, 40]} /><meshStandardMaterial map={tambor()} roughness={0.45} /></mesh></group>)}</group>;
};
const caraTex = () => ctex("p4e2:cara", 512, 512, (g) => { g.fillStyle = "#f4f1e8"; g.beginPath(); g.arc(256, 256, 250, 0, 2 * P); g.fill();
  g.strokeStyle = "#1a1a1a"; for (let i = 0; i < 60; i++) { const a = i / 60 * 2 * P; g.lineWidth = i % 5 ? 3 : 7; g.beginPath(); g.moveTo(256 + Math.cos(a) * 205, 256 + Math.sin(a) * 205); g.lineTo(256 + Math.cos(a) * 240, 256 + Math.sin(a) * 240); g.stroke(); }
  g.fillStyle = "#1a1a1a"; g.fillRect(150, 300, 212, 70); });
const Estrella: React.FC<{ p: V3; s?: number; rot: number; c?: string; forma?: number }> = ({ p, s = 1, rot, c = "#d62a1e", forma = 5 }) => { const n = Math.max(3, Math.round(forma));
  return <group position={p} rotation={[0, 0, rot]} scale={s}>
    {Array.from({ length: n }, (_, i) => <group key={i} rotation={[0, 0, i / n * 2 * P]}><mesh position={[0, 0.045, 0]}><coneGeometry args={[0.022, 0.09, 3]} /><meshStandardMaterial color={c} roughness={0.35} emissive={c} emissiveIntensity={0.25} /></mesh></group>)}
    <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.012, 16]} /><meshStandardMaterial color="#e8e4da" /></mesh>
  </group>; };
const Medidor: React.FC<{ p?: V3; s?: number; rot?: V3; giro: number; val?: number; marca?: number; forma?: number }> = ({ p, s = 1, rot, giro, val = 0, marca = 0, forma = 5 }) => <group position={p} scale={s} rotation={rot}>
  <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.3, 0.32, 0.14, 48]} />{BRONCE()}</mesh>
  {[-1, 1].map((sd) => <group key={sd}><mesh position={[sd * 0.4, 0, -0.02]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.06, 0.06, 0.18, 6]} />{BRONCE()}</mesh>
    <Caño a={[sd * 0.49, 0, -0.02]} b={[sd * 1.4, 0, -0.02]} r={0.045} /></group>)}
  <mesh position={[0, 0, 0.071]}><circleGeometry args={[0.26, 48]} /><meshBasicMaterial map={caraTex()} toneMapped={false} /></mesh>
  <Rodillos p={[0, -0.09, 0.07]} val={val} n={4} s={0.32} />
  <Estrella p={[0.0, 0.08, 0.08]} s={1.15} rot={-giro} forma={forma} />
  {giro > 0.01 && <Anillo p={[0, 0.08, 0.079]} r={0.13} o={0.35} c="#ff6a5a" rot={[0, 0, 0]} w={0.92} />}
  {marca > 0.01 && <mesh position={[0.11, 0.17, 0.081]} rotation={[0, 0, -0.5]} scale={[marca, 1, 1]}><planeGeometry args={[0.07, 0.016]} />{GLOW("#b51e14")}</mesh>}
  <mesh position={[0, 0, 0.09]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.27, 0.27, 0.02, 48]} />{VIDRIO(0.18)}</mesh>
  <mesh position={[-0.12, 0.12, 0.101]} rotation={[0, 0, 0.7]}><planeGeometry args={[0.03, 0.22]} />{GLOW("#ffffff", 0.18)}</mesh>
  <mesh position={[0, 0, 0.09]}><torusGeometry args={[0.275, 0.018, 10, 48]} />{BRONCE()}</mesh>
</group>;
const Casa: React.FC<{ p?: V3; s?: number; color?: string }> = ({ p, s = 1, color = "#e6d8bf" }) => <group position={p} scale={s}>
  <RBox s={[0.7, 0.45, 0.5]} r={0.01} p={[0, 0.225, 0]}><meshStandardMaterial map={yeso()} color={color} roughness={0.85} /></RBox>
  <mesh position={[0, 0.58, 0]} rotation={[0, P / 4, 0]} scale={[1.1, 1, 0.78]}><coneGeometry args={[0.55, 0.28, 4]} /><meshStandardMaterial color="#9c3f2a" roughness={0.7} /></mesh>
  <mesh position={[0.12, 0.14, 0.252]}><planeGeometry args={[0.12, 0.22]} /><meshStandardMaterial color="#6b4a2e" /></mesh>
  {[-0.2, 0.2].map((x, i) => <mesh key={i} position={[x - 0.02, 0.3, 0.252]}><planeGeometry args={[0.12, 0.1]} /><meshBasicMaterial color="#ffd98a" toneMapped={false} /></mesh>)}
</group>;
const Mancha: React.FC<{ p: V3; r: number; o?: number; rot?: V3 }> = ({ p, r, o = 1, rot = [0, 0, 0] }) => r <= 0.002 ? null :
  <mesh position={p} rotation={rot} renderOrder={3}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={manchaTex()} transparent opacity={o} depthWrite={false} /></mesh>;
const Destornillador: React.FC<{ p: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.035, 0.03, 0.16, 6]} /><meshStandardMaterial color="#e8b21e" roughness={0.4} /></mesh>
  <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.037, 0.037, 0.03, 6]} /><meshStandardMaterial color="#1f1f1f" /></mesh>
  <mesh position={[0, -0.16, 0]}><cylinderGeometry args={[0.008, 0.008, 0.3, 10]} />{M.cromo()}</mesh>
  <mesh position={[0, -0.315, 0]}><boxGeometry args={[0.018, 0.012, 0.004]} />{M.cromo()}</mesh></group>;
const Oreja: React.FC<{ p: V3; s?: number; rot?: V3 }> = ({ p, s = 1, rot }) => <group position={p} scale={s} rotation={rot}>
  <mesh scale={[0.7, 1, 0.35]}><torusGeometry args={[0.07, 0.025, 12, 32, P * 1.5]} /><meshStandardMaterial color="#d9a587" roughness={0.6} /></mesh>
  <mesh position={[0, -0.075, 0]} scale={[0.8, 1, 0.6]}><sphereGeometry args={[0.03, 16, 12]} /><meshStandardMaterial color="#d9a587" roughness={0.6} /></mesh>
  <mesh position={[0.0, 0, -0.01]} scale={[0.5, 0.7, 0.2]}><sphereGeometry args={[0.06, 16, 12]} /><meshStandardMaterial color="#c48d70" roughness={0.6} /></mesh></group>;
const Gotero: React.FC<{ p: V3; s?: number; c?: string }> = ({ p, s = 1, c = TINTA }) => <group position={p} scale={s}>
  <mesh position={[0, 0.1, 0]}><capsuleGeometry args={[0.025, 0.05, 8, 16]} /><meshStandardMaterial color="#1f1f1f" roughness={0.6} /></mesh>
  <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.018, 0.006, 0.14, 16]} />{VIDRIO(0.45)}</mesh>
  <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.014, 0.005, 0.1, 16]} />{GLOW(c, 0.9)}</mesh></group>;
const MuroCorte: React.FC<{ p?: V3; w?: number; hh?: number; corte?: number }> = ({ p, w = 1.2, hh = 0.9, corte = 1 }) => <group position={p}>
  <mesh position={[0, hh / 2, -0.12]}><boxGeometry args={[w, hh, 0.08]} /><meshStandardMaterial map={ladrillo()} roughness={0.9} /></mesh>
  <mesh position={[-w * 0.275 * corte, hh / 2, 0.02]}><boxGeometry args={[w * (1 - 0.55 * corte), hh, 0.03]} /><meshStandardMaterial map={yeso()} roughness={0.9} /></mesh>
  {corte > 0.01 && <mesh position={[w * (0.5 - 0.55 * corte), hh / 2, 0.036]}><planeGeometry args={[0.012, hh]} /><meshStandardMaterial color="#bfb6a2" /></mesh>}
</group>;
const gaugeTex = () => ctex("p4e2:gauge", 512, 512, (g) => { g.fillStyle = "#f4f1e8"; g.beginPath(); g.arc(256, 256, 250, 0, 2 * P); g.fill(); g.lineWidth = 40;
  ([["#3aa860", -225, -135], ["#e8b23a", -135, -45], ["#c0392b", -45, 45]] as [string, number, number][]).forEach(([c, a, b]) => { g.strokeStyle = c; g.beginPath(); g.arc(256, 256, 200, a * P / 180, b * P / 180); g.stroke(); }); });
const Gauge: React.FC<{ p: V3; s?: number; v: number }> = ({ p, s = 1, v }) => <group position={p} scale={s}>
  <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.05, 48]} />{M.cromo()}</mesh>
  <mesh position={[0, 0, 0.026]}><circleGeometry args={[0.135, 48]} /><meshBasicMaterial map={gaugeTex()} toneMapped={false} /></mesh>
  <group position={[0, 0, 0.032]} rotation={[0, 0, -(-225 + 270 * cl(v)) * P / 180 - P]}><mesh position={[0.05, 0, 0]}><boxGeometry args={[0.11, 0.01, 0.004]} /><meshBasicMaterial color="#111" /></mesh></group>
  <mesh position={[0, 0, 0.036]}><circleGeometry args={[0.014, 16]} /><meshBasicMaterial color="#222" /></mesh>
  <mesh position={[0, 0, 0.04]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.14, 0.14, 0.01, 48]} />{VIDRIO(0.15)}</mesh></group>;

// 1 · EL SISEO EN LA CASA A OSCURAS: muro en corte bajo un haz de linterna; en el hueco el tubo de cobre con una gota; anillos de sonido (toroides) atraviesan el yeso hacia cámara
const HSiseo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#07090c">{(tt) => {
  const luz = eio(tt, 0.1, 0.8), corte = eio(tt, 0.6, 1.5), gota = cl((tt - 1.6) / 1.0);
  return <Estudio t={tt} cam={[0.286, 0.514, 1.711]} look={[0.05, 0.42, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#06080b" />
    <spotLight position={[0.6, 1.2, 1.4]} angle={0.35 * luz + 0.01} penumbra={0.6} intensity={30 * luz} color="#fff2cf" />
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <MuroCorte corte={corte} />
      <Caño a={[-0.6, 0.45, -0.05]} b={[0.6, 0.45, -0.05]} r={0.03} />
      <mesh position={[0.05, 0.45, -0.05]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.036, 0.036, 0.05, 20]} />{BRONCE()}</mesh>
      <GotaC p={[0.06, 0.39 - 0.25 * gota * gota, -0.02]} s={0.016 + 0.006 * (1 - gota)} />
      {[0, 1, 2, 3].map((j) => { const q = ((tt - 0.9) * 0.6 + j / 4) % 1; return tt > 0.9 && <Toro key={j} p={[0.05, 0.45, -0.05 + q * 0.9]} r={0.05 + 0.3 * q} o={0.7 * (1 - q) * corte} c="#cfe6ff" />; })}
      <Halo p={[0.05, 0.45, 0.05]} r={0.25 * corte} c="#9fd4f4" o={0.35} />
    </group>
  </Estudio>;
}}</Stage>;

// 2 · NO ESTÁ EN LA PARED: lupa recorre el yeso y solo ve yeso; la cámara orbita y aparece el inodoro con un anillo azul que pulsa en el piso
const HNoPared: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#12161b">{(tt) => {
  const lupa = eio(tt, 0.3, 1.8), orb = eio(tt, 1.9, 2.9), on = eio(tt, 2.8, 3.2);
  const a = lerp(0, P2 * 0.95, orb), R = 1.6;
  return <Estudio t={tt} cam={[Math.sin(a) * R, 0.55, Math.cos(a) * R]} look={[lerp(0, 0.4, orb), 0.4, lerp(0, 0.1, orb)]} orbit={0} mesa={false} fit={false}>
    <Fondo z={-1.5} />
    <Piso c="#6b5a48" />
    <mesh position={[0, 0.6, -0.3]}><boxGeometry args={[1.6, 1.2, 0.05]} /><meshStandardMaterial map={yeso()} roughness={0.9} /></mesh>
    <Sombra p={[0, 0.003, -0.25]} r={0.6} sx={1.6} o={0.4} />
    <group position={[lerp(-0.5, 0.45, lupa), 0.6 + 0.08 * Math.sin(lupa * 6), -0.2]} scale={0.0001 + cl(IN(tt, 0.2))}>
      <mesh><torusGeometry args={[0.13, 0.016, 12, 48]} /><meshStandardMaterial color="#1f1f1f" roughness={0.4} /></mesh>
      <mesh><circleGeometry args={[0.125, 40]} />{VIDRIO(0.22)}</mesh>
      <mesh position={[0, 0, -0.005]} scale={1.6}><circleGeometry args={[0.07, 40]} /><meshStandardMaterial map={yeso()} roughness={0.9} /></mesh>
      <mesh position={[0.15, -0.15, 0]} rotation={[0, 0, P / 4]}><cylinderGeometry args={[0.018, 0.022, 0.16, 16]} />{M.madera("#6b4a2e")}</mesh>
    </group>
    <group position={[0.65, 0, 0.15]} rotation={[0, -P2, 0]} scale={0.0001 + cl(IN(tt, 1.9))}><Inodoro s={0.5} nivel={0.6} /></group>
    {[0, 1, 2].map((j) => { const q = ((tt - 3.0) * 0.8 + j / 3) % 1; return tt > 3.0 && <Anillo key={j} p={[0.65, 0.006, 0.15]} r={0.2 + 0.35 * q} o={0.8 * (1 - q)} c={AZUL} />; })}
    <Halo p={[0.65, 0.3, 0.3]} r={0.35 * on} c={AZUL} o={0.4} />
  </Estudio>;
}}</Stage>;

// 3 · DOS SEÑALES: dos manchas orgánicas crecen de a una en el yeso; la aguja de un manómetro 3D sube con rebote al amarillo y luego al rojo
const HDos: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#12161b">{(tt) => {
  const m1 = eio(tt, 0.4, 1.6), m2 = eio(tt, 2.0, 3.0), bounce = (a: number) => tt > a ? Math.exp(-(tt - a) * 5) * Math.sin((tt - a) * 22) * 0.05 : 0;
  const v = 0.1 + 0.4 * m1 + 0.4 * m2 + bounce(1.6) + bounce(3.0);
  return <Estudio t={tt} cam={[0.1, 0.459, 1.652]} look={[0.1, 0.4, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <Piso c="#5a4a3c" />
    <mesh position={[-0.15, 0.55, -0.2]} scale={0.0001 + cl(IN(tt, 0.3))}><boxGeometry args={[1.1, 1.1, 0.05]} /><meshStandardMaterial map={yeso()} roughness={0.9} /></mesh>
    <Mancha p={[-0.35, 0.18, -0.17]} r={0.25 * m1} />
    <Mancha p={[0.08, 0.14, -0.17]} r={0.2 * m2} rot={[0, 0, 1.3]} />
    <Halo p={[-0.35, 0.18, -0.12]} r={0.3 * m2} c="#ffb03a" o={0.35} />
    <Halo p={[0.08, 0.14, -0.12]} r={0.25 * m2} c="#ffb03a" o={0.35} />
    <Gauge p={[0.5, 0.55, 0.05]} s={1.6 * cl(IN(tt, 0.4)) + 0.0001} v={v} />
    <Halo p={[0.5, 0.55, 0.15]} r={0.35 * cl((v - 0.75) * 6)} c={RED} o={0.5} />
  </Estudio>;
}}</Stage>;

// 4 · LA ESTRELLITA: cámara pegada a la carátula; el indicador gira sin parar y muta de estrella a triángulo a ruedita dentada
const HEstrella: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#10141a">{(tt) => {
  const forma = tt < 1.6 ? 5 : tt < 2.8 ? 3 : 8, pop = Math.max(tt > 1.6 ? Math.exp(-(tt - 1.6) * 8) : 0, tt > 2.8 ? Math.exp(-(tt - 2.8) * 8) : 0);
  return <Estudio t={tt} cam={[0.059, 0.099, 0.732]} look={[0, 0.04, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.4} />
    <Medidor s={0.0001 + cl(IN(tt, 0.3))} giro={tt * 2.4} val={318 + tt * 0.6} forma={forma} />
    <Halo p={[0, 0.08, 0.12]} r={0.12 + 0.1 * pop} c="#ff6a5a" o={0.55} />
  </Estudio>;
}}</Stage>;

// 5 · TODO CERRADO: regadera, lavadora y tanque se apagan de a uno con su llave: corta el chorro, frena el tambor, el tanque deja de ondular; destello verde en cada uno
const HTodas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false} tone="#12161b">{(tt) => {
  const o = [eio(tt, 0.8, 1.2), eio(tt, 1.7, 2.1), eio(tt, 2.6, 3.0)];
  return <Estudio t={tt} cam={[0.0, 0.514, 2.065]} look={[0, 0.42, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Piso c="#5a5a5e" />
    <group position={[-0.6, 0, 0]} scale={0.0001 + cl(IN(tt, 0.3))}>
      <Caño a={[0, 0, 0]} b={[0, 0.9, 0]} r={0.02} mat={M.cromo()} />
      <mesh position={[0.08, 0.9, 0]} rotation={[0, 0, -0.3]}><cylinderGeometry args={[0.1, 0.05, 0.05, 32]} />{M.cromo()}</mesh>
      <Chorro a={[0.1, 0.86, 0]} t={tt} k={1 - o[0]} n={24} r={0.01} />
      <LlavePaso p={[0, 0.45, 0.06]} s={1.4} giro={o[0]} />
      <Halo p={[0, 0.45, 0.12]} r={0.18 * o[0] * (1 - eio(tt, 1.4, 1.8))} c={VER} o={0.6} />
    </group>
    <group scale={0.0001 + cl(IN(tt, 0.4))}>
      <RBox s={[0.4, 0.45, 0.4]} r={0.03} p={[0, 0.225, 0]}><meshStandardMaterial color="#f2f2ef" roughness={0.35} /></RBox>
      <mesh position={[0, 0.24, 0.201]}><torusGeometry args={[0.13, 0.025, 12, 40]} />{M.cromo()}</mesh>
      <group position={[0, 0.24, 0.195]} rotation={[0, 0, tt * 14 * (1 - o[1])]}>
        <mesh><circleGeometry args={[0.12, 32]} /><meshStandardMaterial color="#3a4048" metalness={0.6} roughness={0.35} /></mesh>
        {Array.from({ length: 3 }, (_, j) => <mesh key={j} rotation={[0, 0, j * 2 * P / 3]} position={[0, 0, 0.002]}><boxGeometry args={[0.02, 0.2, 0.004]} /><meshStandardMaterial color="#c9ced3" /></mesh>)}
      </group>
      <mesh position={[0, 0.24, 0.215]}><circleGeometry args={[0.12, 32]} />{VIDRIO(0.25)}</mesh>
      <Halo p={[0, 0.24, 0.26]} r={0.2 * o[1] * (1 - eio(tt, 2.3, 2.7))} c={VER} o={0.6} />
      <Sombra p={[0, 0.003, 0]} r={0.3} />
    </group>
    <group position={[0.6, 0, 0]} scale={0.0001 + cl(IN(tt, 0.5))}>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.18, 0.18, 0.6, 40, 1, true]} />{VIDRIO(0.3)}</mesh>
      <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.17, 0.17, 0.5, 40]} />{AGUA(0.55, "#6aa8d8")}</mesh>
      {(1 - o[2]) > 0.02 && [0, 1, 2].map((j) => { const q = (tt * 0.9 + j / 3) % 1; return <Anillo key={j} p={[0, 0.501, 0]} r={0.03 + 0.14 * q} o={0.7 * (1 - q) * (1 - o[2])} />; })}
      {(1 - o[2]) > 0.02 && <Chorro a={[0, 0.75, 0]} t={tt} k={1 - o[2]} n={10} r={0.008} />}
      <Halo p={[0, 0.5, 0.2]} r={0.2 * o[2] * (1 - eio(tt, 3.2, 3.6))} c={VER} o={0.6} />
      <Sombra p={[0, 0.003, 0]} r={0.25} />
    </group>
  </Estudio>;
}}</Stage>;

// 6 · DIEZ MINUTOS: medidor con la estrellita girando; el reloj sale de detrás y da la vuelta; al cerrarla se estampa una marca de tinta junto a la estrella
const HDiez: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#10141a">{(tt) => {
  const sale = eio(tt, 0.3, 1.0), k = eio(tt, 1.0, 3.0), marca = eio(tt, 3.0, 3.15);
  return <Estudio t={tt} cam={[0.15, 0.089, 1.357]} look={[0.15, 0.03, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.5} />
    <Medidor p={[-0.15, 0, 0]} s={0.0001 + cl(IN(tt, 0.2))} giro={tt * 2.0} val={412 + tt * 0.3} marca={marca} />
    <group position={[lerp(-0.15, 0.48, sale), 0.02, lerp(-0.1, 0.05, sale)]} scale={0.0001 + sale}><Reloj s={0.65} k={k} /></group>
    <Halo p={[-0.04, 0.17, 0.12]} r={0.15 * marca * (1 - eio(tt, 3.4, 3.9))} c="#ff3a2a" o={0.8} />
    <Halo p={[0.48, 0.02, 0.1]} r={0.22 * marca * (1 - eio(tt, 3.4, 3.9))} c="#ffffff" o={0.5} />
  </Estudio>;
}}</Stage>;

// 7 · Y GIRA: tres llaves de paso grandes cerradas al frente; detrás el tubo con una grieta que escupe gotas; la estrellita del medidor gira igual
const HGira: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#10141a">{(tt) => {
  const grieta = eio(tt, 1.0, 1.6), chorro = eio(tt, 1.5, 2.3);
  return <Estudio t={tt} cam={[0.0, 0.342, 1.711]} look={[0, 0.2, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} />
    <Piso c="#4a4440" />
    <Caño a={[-1.2, 0.35, -0.25]} b={[1.2, 0.35, -0.25]} r={0.035} />
    {grieta > 0.01 && <mesh position={[0.1, 0.35, -0.214]} scale={[grieta, 1, 1]}><boxGeometry args={[0.07, 0.006, 0.004]} /><meshBasicMaterial color="#1a0f08" /></mesh>}
    <Chorro a={[0.1, 0.35, -0.2]} v={[0.1, 0.3, 0.6]} t={tt} k={chorro} n={22} r={0.009} />
    <Halo p={[0.1, 0.35, -0.15]} r={0.18 * grieta} c={RED} o={0.45} />
    {[0, 1, 2].map((i) => <group key={i} position={[-0.6 + i * 0.6, 0.05, 0.2]} scale={0.0001 + cl(IN(tt, 0.3 + i * 0.1))}>
      <Caño a={[-0.22, 0.12, 0]} b={[0.22, 0.12, 0]} r={0.025} mat={M.cromo("#a8adb2")} />
      <LlavePaso p={[0, 0.12, 0]} s={2.0} giro={1} />
      <Sombra p={[0, 0.003, 0]} r={0.2} o={0.5} />
    </group>)}
    <Medidor p={[0.75, 0.62, -0.4]} s={0.6 * cl(IN(tt, 0.5)) + 0.0001} giro={tt * 2.4} val={500 + tt * 0.5} />
    <Halo p={[0.75, 0.67, -0.3]} r={0.14 * chorro} c="#ff6a5a" o={0.6} />
  </Estudio>;
}}</Stage>;

// 8 · EL TRAMO DE AFUERA: corte de tierra con piedritas y raíces; casa y cajita del medidor completas; el agua se filtra del tubo y oscurece la tierra; una gota grande señala el punto
const HTramo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#10141a">{(tt) => {
  const filtra = eio(tt, 0.9, 3.2), baja = eio(tt, 0.0, 1.0);
  return <Estudio t={tt} cam={[0.0, lerp(0.55, 0.35, baja), 1.9]} look={[0, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#1a2430" />
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <mesh position={[0, -0.25, 0]}><boxGeometry args={[1.8, 0.5, 0.5]} /><meshStandardMaterial map={tierra()} roughness={1} /></mesh>
      <mesh position={[0, 0.005, 0]}><boxGeometry args={[1.8, 0.02, 0.5]} /><meshStandardMaterial color="#5a8a3a" roughness={0.9} /></mesh>
      {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.7, -0.05 - rn(i, 2) * 0.42, 0.252]} scale={0.01 + 0.015 * rn(i, 3)}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color={col("#8a8a84", "#c9c2b0", rn(i, 4))} /></mesh>)}
      {[-0.6, 0.3].map((x, i) => <Caño key={i} a={[x, 0.0, 0.252]} b={[x + 0.12, -0.18, 0.252]} r={0.006} mat={<meshStandardMaterial color="#8a6a48" />} />)}
      <Caño a={[-0.6, -0.2, 0.2]} b={[0.55, -0.2, 0.2]} r={0.025} />
      <Mancha p={[0.05, -0.22, 0.253]} r={0.3 * filtra} o={0.9} />
      <Casa p={[0.6, 0.01, 0]} s={0.6} />
      <group position={[-0.65, 0.04, 0.05]}><RBox s={[0.22, 0.08, 0.16]} r={0.01}><meshStandardMaterial color="#6c6f73" roughness={0.6} /></RBox>
        <Medidor p={[0, 0.045, 0]} rot={[-P2, 0, 0]} s={0.22} giro={tt * 3} /></group>
      <GotaC p={[0.05, 0.25 + 0.03 * Math.sin(tt * 5), 0.25]} s={0.04 * eio(tt, 1.6, 2.0)} c="#5fb0f0" />
      <Halo p={[0.05, -0.2, 0.3]} r={0.22 * eio(tt, 2.0, 2.6)} c="#5fb0f0" o={0.45} />
    </group>
  </Estudio>;
}}</Stage>;

// 9 · PARTIR LA CASA EN DOS: un plano de luz baja en la llave general; la casa se parte en dos mitades; adentro el agua se detiene, afuera sigue hasta el medidor
const HPartir: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#10141a">{(tt) => {
  const luz = eio(tt, 0.3, 0.9), gira = eio(tt, 0.9, 1.3), abre = eio(tt, 1.3, 2.3);
  return <Estudio t={tt} cam={[0.0, 0.604, 2.065]} look={[0, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Piso c="#4a4440" />
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.18 * abre, 0, 0]}>
        <mesh position={[sd * 0.25, 0.25, 0]}><boxGeometry args={[0.5, 0.5, 0.55]} /><meshStandardMaterial map={yeso()} color="#e6d8bf" roughness={0.85} /></mesh>
        <mesh position={[sd * 0.25, 0.62, 0]} rotation={[0, 0, sd * -0.5]}><boxGeometry args={[0.6, 0.03, 0.62]} /><meshStandardMaterial color="#9c3f2a" roughness={0.7} /></mesh>
        <mesh position={[sd * 0.002, 0.25, 0]} rotation={[0, P2, 0]}><planeGeometry args={[0.55, 0.5]} /><meshStandardMaterial color="#c9b896" side={THREE.DoubleSide} emissive="#ffe9a8" emissiveIntensity={0.3 * abre} /></mesh>
      </group>)}
      <Caño a={[-0.8, 0.06, 0.3]} b={[0.8, 0.06, 0.3]} r={0.022} />
      <LlavePaso p={[0, 0.06, 0.3]} rot={[0, P2, 0]} s={1.5} giro={gira} />
      <Medidor p={[0.9, 0.1, 0.3]} s={0.25} giro={tt * 2.4} />
      {Array.from({ length: 22 }, (_, i) => { const q = (tt * 0.5 + i / 22) % 1, x = lerp(-0.8, 0.8, q); return (x > 0 || gira < 0.5) && <mesh key={i} position={[x, 0.06, 0.33]} scale={0.011}><sphereGeometry args={[1, 6, 4]} />{GLOW("#6fb8ff", 0.95)}</mesh>; })}
      <mesh position={[0, 0.5, 0.3]}><planeGeometry args={[0.02 * luz + 0.0001, 1.0]} />{GLOW("#ffe08a", 0.9 * (1 - abre * 0.6))}</mesh>
      <Halo p={[0, 0.1, 0.35]} r={0.25 * luz} c="#ffe08a" o={0.5} />
    </group>
  </Estudio>;
}}</Stage>;

// 10 · EL SAPITO: tanque en corte con agua translúcida; el gotero suelta colorante que se dispersa en nubes; la tapa de hule roja se tuerce y escurre un hilo teñido a la taza
const HSapito: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#12161b">{(tt) => {
  const gotas = cl((tt - 0.5) / 1.4) * 10, tuerce = eio(tt, 1.8, 2.4), hilo = eio(tt, 2.3, 3.4);
  return <Estudio t={tt} cam={[0.168, 0.568, 1.593]} look={[0.05, 0.45, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <mesh position={[0, 0.5, -0.05]}><boxGeometry args={[0.8, 0.5, 0.02]} /><meshPhysicalMaterial color="#f4f2ec" roughness={0.2} clearcoat={0.8} /></mesh>
      {[-0.4, 0.4].map((x, i) => <mesh key={i} position={[x, 0.5, 0.08]}><boxGeometry args={[0.02, 0.5, 0.28]} /><meshPhysicalMaterial color="#f4f2ec" roughness={0.2} clearcoat={0.8} /></mesh>)}
      <mesh position={[0, 0.25, 0.08]}><boxGeometry args={[0.82, 0.02, 0.28]} /><meshPhysicalMaterial color="#f4f2ec" roughness={0.2} /></mesh>
      <mesh position={[0, 0.45, 0.07]}><boxGeometry args={[0.76, 0.38, 0.24]} />{AGUA(0.45, col("#8cc4e8", "#3a6fe0", cl(gotas / 10) * 0.5))}</mesh>
      {Array.from({ length: Math.floor(gotas) }, (_, i) => { const a = 0.5 + i * 0.14, q = cl((tt - a) / 1.2);
        return <mesh key={i} position={[-0.1 + (rn(i, 1) - 0.5) * 0.3, 0.6 - q * 0.25, 0.07 + (rn(i, 2) - 0.5) * 0.1]} scale={0.02 + 0.08 * q}><sphereGeometry args={[1, 12, 10]} /><meshBasicMaterial color={TINTA} transparent opacity={0.5 * (1 - q * 0.7)} depthWrite={false} /></mesh>; })}
      {tt > 0.5 && tt < 2.0 && <mesh position={[-0.1, 0.75 - ((tt * 4) % 1) * 0.12, 0.07]} scale={0.012}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color={TINTA} /></mesh>}
      <Gotero p={[-0.1, 0.86 + 0.1 * eio(tt, 2.0, 2.4), 0.07]} s={1.4} />
      <mesh position={[0.15, 0.27, 0.07]}><cylinderGeometry args={[0.06, 0.06, 0.02, 32]} />{M.cromo("#b0b5ba")}</mesh>
      <group position={[0.15, 0.29, 0.07]} rotation={[0, 0, 0.25 * tuerce]}><mesh position={[0.01 * tuerce, 0.005, 0]} scale={[1, 0.45, 1]}><sphereGeometry args={[0.065, 24, 12, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#c4281c" roughness={0.6} /></mesh></group>
      <Caño a={[0.15, 0.25, 0.07]} b={[0.15, 0.05, 0.07]} r={0.02} mat={M.cromo("#b0b5ba")} />
      {hilo > 0.01 && Array.from({ length: 12 }, (_, i) => { const q = (tt * 1.2 + i / 12) % 1; return <mesh key={i} position={[0.15, 0.24 - q * 0.22, 0.095]} scale={[0.005, 0.012, 0.005]}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={TINTA} transparent opacity={0.85 * hilo} /></mesh>; })}
      <Halo p={[0.15, 0.27, 0.14]} r={0.15 * tuerce} c={AZUL} o={0.5} />
    </group>
  </Estudio>;
}}</Stage>;

// 11 · AL TANQUE, NO A LA TAZA: el gotero grande entra por arriba y tiñe el agua del tanque abierto; la taza, aparte, recibe un aro rojo y una X
const HGotas: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#12161b">{(tt) => {
  const gotero = eio(tt, 0.3, 0.9), tinta = eio(tt, 1.0, 2.6), aro = eio(tt, 2.6, 3.3), x = eio(tt, 3.2, 3.6);
  return <Estudio t={tt} cam={[0.227, 0.863, 1.888]} look={[0.05, 0.45, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Piso c="#cfd4d6" />
    <group position={[-0.25, 0, 0]} scale={0.0001 + cl(IN(tt, 0.3))}><Inodoro s={0.75} nivel={0.6} tapa={1} sinTapa corteTq={1} agua={col("#a9cfe0", TINTA, tinta * 0.9)} /></group>
    <group position={[-0.25, lerp(1.6, 1.0, gotero), -0.15]}><Gotero p={[0, 0, 0]} s={2.2} /></group>
    {tt > 0.9 && tt < 2.4 && <mesh position={[-0.25, 0.95 - ((tt * 2.5) % 1) * 0.25, -0.15]} scale={0.018}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color={TINTA} /></mesh>}
    <Anillo p={[0.38, 0.45, 0.25]} r={0.2} o={aro * 0.9} c={RED} rot={[-P2 * 0.6, 0, 0]} />
    {x > 0.01 && [-1, 1].map((sd) => <mesh key={sd} position={[0.38, 0.45, 0.27]} rotation={[-P2 * 0.6, 0, sd * P / 4]} scale={[x, 1, 1]}><planeGeometry args={[0.3, 0.025]} />{GLOW(RED)}</mesh>)}
    <Halo p={[-0.25, 0.85, 0.0]} r={0.3 * tinta * (1 - aro)} c={AZUL} o={0.4} />
  </Estudio>;
}}</Stage>;

// 12 · EL BAÑO OLVIDADO: tres inodoros caen de a uno con rebote; el tercero con telaraña gruesa y polvo; la tinta azul sube en SU taza
const HBanos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#12161b">{(tt) => {
  const tinta = eio(tt, 1.8, 3.4);
  return <Estudio t={tt} cam={[0.0, 0.822, 2.242]} look={[0, 0.35, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.9} />
    <Piso c="#cfd4d6" />
    {[0, 1, 2].map((i) => { const d = cl(IN(tt, 0.2 + i * 0.25)), x = -0.62 + i * 0.62;
      return <group key={i}>
        <group position={[x, lerp(1.4, 0, d), 0]}><Inodoro s={0.55} nivel={0.6} tc={i === 2 ? "#d8d0bd" : "#eae6da"} agua={i === 2 ? col("#a9cfe0", TINTA, tinta) : "#a9cfe0"} /></group>
        <Sombra p={[x, 0.003, 0]} r={0.28 * d + 0.001} o={0.6} />
      </group>; })}
    <group position={[0.62, 0, 0]} scale={eio(tt, 0.9, 1.3) + 0.0001}>
      {Array.from({ length: 7 }, (_, j) => <Caño key={j} a={[0.08, 0.62, -0.2]} b={[0.08 + Math.cos(j * 0.45) * 0.25, 0.62 + Math.sin(j * 0.45) * 0.25, -0.24]} r={0.0025} mat={GLOW("#e8e8e8", 0.85)} />)}
      {[0.06, 0.12, 0.18, 0.24].map((r, j) => <mesh key={"a" + j} position={[0.08, 0.62, -0.22]}><torusGeometry args={[r, 0.002, 4, 20, P / 2 * 0.9]} />{GLOW("#e8e8e8", 0.7)}</mesh>)}
      {Array.from({ length: 50 }, (_, j) => <mesh key={"p" + j} position={[(rn(j, 1) - 0.5) * 0.3, 0.56 + rn(j, 4) * 0.01, (rn(j, 2) - 0.5) * 0.2 - 0.1]} scale={0.004 + 0.004 * rn(j, 3)}><sphereGeometry args={[1, 4, 3]} /><meshStandardMaterial color="#9a9284" /></mesh>)}
    </group>
    <Halo p={[0.62, 0.4, 0.2]} r={0.3 * tinta} c={AZUL} o={0.45} />
  </Estudio>;
}}</Stage>;

// 13 · EL PAPEL VE LO QUE EL DEDO NO: tuerca grande bajo el lavabo; el dedo la toca y nada; la hoja la envuelve y se abre una mancha azul
const HPapel: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#12161b">{(tt) => {
  const dedo = eio(tt, 0.3, 0.9) * (1 - eio(tt, 1.3, 1.7)), papel = eio(tt, 1.7, 2.4), mancha = eio(tt, 2.5, 3.6);
  return <Estudio t={tt} cam={[0.177, 0.138, 1.003]} look={[0, 0.02, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.5} c="#171b20" />
    <mesh position={[0, 0.42, -0.1]}><boxGeometry args={[1.5, 0.05, 0.6]} /><meshPhysicalMaterial color="#f4f2ec" roughness={0.2} clearcoat={0.8} /></mesh>
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <Caño a={[0, 0.4, 0]} b={[0, 0.06, 0]} r={0.025} mat={M.cromo()} />
      <Caño a={[0, -0.06, 0]} b={[0, -0.45, 0]} r={0.025} mat={M.cromo()} />
      <mesh><cylinderGeometry args={[0.07, 0.07, 0.12, 6]} />{M.cromo("#c9ad5a")}</mesh>
      {[1, -1].map((s) => <mesh key={s} position={[0, s * 0.065, 0]}><cylinderGeometry args={[0.05, 0.07, 0.012, 6]} />{M.cromo("#c9ad5a")}</mesh>)}
    </group>
    <group position={[lerp(0.6, 0.11, dedo), 0.02, 0.05]} rotation={[0, 0, P2]}>
      <mesh><capsuleGeometry args={[0.035, 0.22, 8, 16]} /><meshStandardMaterial color="#d9a587" roughness={0.6} /></mesh>
      <mesh position={[0, 0.06, 0]}><torusGeometry args={[0.037, 0.006, 6, 20]} /><meshStandardMaterial color="#c48d70" /></mesh>
      <mesh position={[0, -0.13, 0.02]} scale={[0.8, 0.5, 0.3]}><sphereGeometry args={[0.035, 12, 10]} /><meshStandardMaterial color="#f0d4c4" roughness={0.3} /></mesh>
    </group>
    {papel > 0.01 && <group>
      <mesh rotation={[0, -P2 * 0.4 + (1 - papel) * 1.5, 0]}><cylinderGeometry args={[0.085, 0.085, 0.2, 32, 1, true, 0, P * 1.3 * papel + 0.2]} /><meshStandardMaterial color="#fbfaf6" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      {mancha > 0.01 && <mesh position={[0.0, -0.02, 0.087]} scale={[0.06 * mancha, 0.08 * mancha, 1]}><circleGeometry args={[1, 32]} /><meshBasicMaterial color="#5a6f86" transparent opacity={0.75} depthWrite={false} /></mesh>}
    </group>}
    <Halo p={[0.0, -0.02, 0.15]} r={0.18 * mancha} c={AZUL} o={0.5} />
    <Halo p={[0.11, 0.02, 0.1]} r={0.12 * dedo} c="#ffffff" o={0.3} />
  </Estudio>;
}}</Stage>;

// 14 · LA VÁLVULA DEL CALENTADOR: válvula de alivio con luz cálida; de su tubo cae una gota grande con salpicadura; un corcho rojo viene a taparlo y rebota en arco
const HAlivio: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#14110e">{(tt) => {
  const ven = cl((tt - 1.2) / 0.6), reb = cl((tt - 1.8) / 0.9), gotaT = ((tt * 0.9) % 1);
  const cp: V3 = reb > 0 ? [0.12 - 0.5 * reb, -0.25 + 0.4 * reb - 0.6 * reb * reb, 0.05] : [lerp(-0.7, 0.04, ven), -0.25, 0.05];
  return <Estudio t={tt} cam={[0.177, 0.009, 1.239]} look={[0.0, -0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.5} c="#17130f" />
    <pointLight position={[0.8, 0.3, 0.6]} intensity={3} color="#ffbf7a" />
    <mesh position={[-0.6, 0.2, -0.2]}><cylinderGeometry args={[0.45, 0.45, 1.2, 48]} /><meshPhysicalMaterial color="#efede6" roughness={0.35} /></mesh>
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <group position={[0.0, 0.2, 0]}>
        <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.07, 0.07, 0.2, 6]} />{BRONCE()}</mesh>
        <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.05, 0.06, 0.16, 20]} />{BRONCE()}</mesh>
        <group position={[0.03, 0.22, 0]} rotation={[0, 0, -0.4]}><mesh position={[0.07, 0, 0]}><boxGeometry args={[0.14, 0.014, 0.03]} />{BRONCE()}</mesh></group>
        {Array.from({ length: 5 }, (_, j) => <mesh key={j} position={[-0.11 - j * 0.008, 0, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.072, 0.004, 4, 20]} />{BRONCE()}</mesh>)}
      </group>
      <Caño a={[0.1, 0.2, 0]} b={[0.12, 0.2, 0]} r={0.03} mat={COBRE()} />
      <Caño a={[0.12, 0.2, 0]} b={[0.12, -0.22, 0]} r={0.03} mat={COBRE()} />
      <GotaC p={[0.12, -0.25 - gotaT * 0.25, 0]} s={0.022} />
      {gotaT > 0.85 && <Anillo p={[0.12, -0.5, 0]} r={0.06 + 0.1 * (gotaT - 0.85) * 6} o={0.8} />}
      <mesh position={[0.12, -0.5, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.1, 32]} />{AGUA(0.6, "#6a96b6")}</mesh>
    </group>
    {ven > 0 && <group position={cp} rotation={[0, 0, reb * 5 + P2]}><mesh><cylinderGeometry args={[0.045, 0.035, 0.08, 20]} /><meshStandardMaterial color="#c4281c" roughness={0.6} /></mesh></group>}
    {reb > 0 && reb < 0.5 && <Halo p={[0.12, -0.24, 0.06]} r={0.2} c={RED} o={0.9 * (1 - reb * 2)} />}
    <Halo p={[0.12, -0.3, 0.06]} r={0.2 * eio(tt, 2.8, 3.3)} c={VER} o={0.5} />
  </Estudio>;
}}</Stage>;

// 15 · EL REBOSE: tanque de vidrio que se llena y desborda por el tubo de rebose; pulsos azules viajan por la línea hasta el medidor, cuya estrella gira cada vez más rápido
const HRebose: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#10141a">{(tt) => {
  const nivel = eio(tt, 0.2, 1.6), sale = eio(tt, 1.5, 1.9);
  return <Estudio t={tt} cam={[0.1, 0.468, 1.888]} look={[0.1, 0.35, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} />
    <Piso />
    <group position={[-0.45, 0, 0]} scale={0.0001 + cl(IN(tt, 0.3))}>
      <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.25, 0.25, 0.8, 48, 1, true]} />{VIDRIO(0.3)}</mesh>
      <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.25, 0.25, 0.01, 48]} />{VIDRIO(0.5)}</mesh>
      <mesh position={[0, 0.01 + 0.36 * nivel, 0]}><cylinderGeometry args={[0.24, 0.24, 0.72 * nivel + 0.001, 48]} />{AGUA(0.6, "#4d9be0")}</mesh>
      <Caño a={[0.12, 0.05, 0]} b={[0.12, 0.72, 0]} r={0.02} mat={<meshStandardMaterial color="#e8e6e0" roughness={0.4} />} />
      {sale > 0.01 && Array.from({ length: 14 }, (_, i) => { const q = (tt * 1.4 + i / 14) % 1; return <mesh key={i} position={[0.12 + 0.01 * Math.sin(i), 0.72 - q * 0.65, 0.0]} scale={[0.008, 0.016, 0.008]}><sphereGeometry args={[1, 6, 4]} />{AGUA(0.95, "#bfe2ff")}</mesh>; })}
      {sale > 0.01 && [0, 1].map((j) => { const q = (tt * 1.1 + j / 2) % 1; return <Anillo key={j} p={[0.12, 0.725, 0]} r={0.025 + 0.04 * q} o={0.8 * (1 - q) * sale} />; })}
      <Sombra p={[0, 0.003, 0]} r={0.32} />
    </group>
    <Caño a={[-0.33, 0.05, 0]} b={[0.45, 0.05, 0]} r={0.018} mat={<meshStandardMaterial color="#f0f0ec" roughness={0.4} />} />
    {sale > 0.01 && Array.from({ length: 6 }, (_, i) => { const q = (tt * 0.8 + i / 6) % 1; return <group key={i}><mesh position={[lerp(-0.33, 0.45, q), 0.05, 0.0]} scale={0.024}><sphereGeometry args={[1, 10, 8]} />{GLOW("#5fb0ff", 0.95)}</mesh>
      <Halo p={[lerp(-0.33, 0.45, q), 0.05, 0.03]} r={0.06} c="#5fb0ff" o={0.6} /></group>; })}
    <Medidor p={[0.62, 0.22, 0]} s={0.6 * cl(IN(tt, 0.5)) + 0.0001} giro={tt * 1.0 + sale * (tt - 1.5) * 6} val={200 + tt} />
    <Halo p={[0.62, 0.27, 0.08]} r={0.15 * sale} c="#ff6a5a" o={0.6} />
  </Estudio>;
}}</Stage>;

// 16 · LA OREJA EN LA VARILLA: tubo grueso con la fuga en un extremo; el destornillador con la oreja se apoya en tres puntos acercándose; los anillos crecen cada vez más
const HOreja: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#10141a">{(tt) => {
  const paso = tt < 1.4 ? 0 : tt < 2.5 ? 1 : 2, xs = [-0.5, -0.05, 0.38], mv = paso === 0 ? 1 : eio(tt, paso === 1 ? 1.4 : 2.5, paso === 1 ? 1.7 : 2.8);
  const x = paso === 0 ? xs[0] : lerp(xs[paso - 1], xs[paso], mv), fuerza = [0.25, 0.55, 1][paso];
  return <Estudio t={tt} cam={[0.0, 0.474, 1.534]} look={[0, 0.12, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} />
    <Piso c="#5a4a3c" />
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <Caño a={[-0.9, 0.06, 0]} b={[0.75, 0.06, 0]} r={0.045} />
      <mesh position={[0.55, 0.06, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.052, 0.052, 0.06, 20]} />{BRONCE()}</mesh>
      <GotaC p={[0.56, 0.0 - ((tt * 0.8) % 1) * 0.05, 0.02]} s={0.018} />
      <mesh position={[0.56, 0.004, 0.05]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.09, 32]} />{AGUA(0.6, "#6a96b6")}</mesh>
    </group>
    <group position={[x, 0.42, 0]} scale={0.0001 + cl(IN(tt, 0.5))}>
      <Destornillador p={[0, 0, 0]} s={1.2} />
      <Oreja p={[0, 0.2, 0.03]} s={1.3} rot={[0, -P2 * 0.4, 0]} />
    </group>
    {[0, 1, 2].map((j) => { const q = (tt * 1.1 + j / 3) % 1; return <Toro key={j} p={[x, 0.08, 0]} r={0.03 + (0.1 + 0.2 * fuerza) * q} o={0.8 * (1 - q) * fuerza} c="#cfe6ff" rot={[P2, 0, 0]} />; })}
    <Halo p={[x, 0.65, 0.05]} r={0.12 + 0.15 * fuerza} c={paso === 2 ? RED : "#cfe6ff"} o={0.35 + 0.3 * fuerza} />
  </Estudio>;
}}</Stage>;

// 17 · EL AGUA VIAJA: muro en corte con el tubo arriba; el agua sale de la unión, corre por afuera del tubo, se mete por el ladrillo y baja; la mancha nace ABAJO, lejos de la fuga
const HViaja: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#10141a">{(tt) => {
  const corre = eio(tt, 0.6, 1.6), baja = eio(tt, 1.4, 2.8), mancha = eio(tt, 2.5, 3.8);
  return <Estudio t={tt} cam={[0.404, 0.514, 1.711]} look={[0.05, 0.42, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <Piso c="#5a4a3c" />
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <MuroCorte corte={1} hh={0.95} />
      <Caño a={[-0.6, 0.82, -0.05]} b={[0.6, 0.82, -0.05]} r={0.035} />
      <mesh position={[-0.35, 0.82, -0.05]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.042, 0.042, 0.05, 20]} />{BRONCE()}</mesh>
      {corre > 0.01 && <mesh position={[-0.35 + 0.125 * corre, 0.785, -0.05]} scale={[0.25 * corre, 1, 1]}><boxGeometry args={[1, 0.008, 0.05]} />{AGUA(0.85, "#9fd4f4")}</mesh>}
      {baja > 0.01 && Array.from({ length: 18 }, (_, i) => { const q = (tt * 0.9 + i / 18) % 1, y = lerp(0.78, 0.12, q * baja); return <mesh key={i} position={[-0.1 + 0.02 * Math.sin(q * 9), y, -0.075]} scale={[0.009, 0.014, 0.009]}><sphereGeometry args={[1, 6, 4]} />{AGUA(0.9, "#9fd4f4")}</mesh>; })}
      {baja > 0.01 && <mesh position={[-0.1, lerp(0.8, 0.45, baja), -0.079]} scale={[1, baja, 1]}><planeGeometry args={[0.04, 0.7]} /><meshBasicMaterial color="#3a1c10" transparent opacity={0.45} depthWrite={false} /></mesh>}
      <Mancha p={[-0.35, 0.15, 0.04]} r={0.28 * mancha} />
      <Halo p={[-0.35, 0.82, 0.05]} r={0.15 * eio(tt, 0.4, 0.8)} c={RED} o={0.5} />
      <Halo p={[-0.35, 0.15, 0.1]} r={0.3 * mancha} c="#ffb03a" o={0.35} />
    </group>
  </Estudio>;
}}</Stage>;

// 18 · LA CÁMARA TÉRMICA: una cámara térmica 3D recorre el yeso; en su pantalla la pared se ve en colores de calor con la franja azul fría del tubo
const termTex = () => ctex("p4e2:term", 512, 512, (g) => { const gr = g.createLinearGradient(0, 0, 512, 512); gr.addColorStop(0, "#ffcf3a"); gr.addColorStop(0.5, "#ff7a1a"); gr.addColorStop(1, "#c41e5a"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(${200 + rn(i, 1) * 55},${80 + rn(i, 2) * 100},40,0.25)`; g.beginPath(); g.arc(rn(i, 3) * 512, rn(i, 4) * 512, 6 + rn(i, 5) * 20, 0, 2 * P); g.fill(); }
  const b = g.createLinearGradient(0, 230, 0, 330); b.addColorStop(0, "rgba(40,60,230,0)"); b.addColorStop(0.5, "rgba(40,80,240,1)"); b.addColorStop(1, "rgba(40,60,230,0)"); g.fillStyle = b; g.fillRect(0, 220, 512, 120);
  const c = g.createRadialGradient(280, 280, 0, 280, 280, 120); c.addColorStop(0, "rgba(30,60,220,0.95)"); c.addColorStop(1, "rgba(30,60,220,0)"); g.fillStyle = c; g.fillRect(0, 0, 512, 512); });
const HTermica: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#10141a">{(tt) => {
  const x = lerp(-0.45, 0.25, eio(tt, 0.4, 2.6));
  return <Estudio t={tt} cam={[0.0, 0.455, 1.534]} look={[0, 0.42, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <mesh position={[0, 0.45, -0.1]} scale={0.0001 + cl(IN(tt, 0.3))}><boxGeometry args={[1.5, 1.0, 0.04]} /><meshStandardMaterial map={yeso()} roughness={0.9} /></mesh>
    <group position={[x, 0.42, 0.15]} scale={0.0001 + cl(IN(tt, 0.4))}>
      <RBox s={[0.34, 0.26, 0.08]} r={0.02}><meshStandardMaterial color="#2a2d31" roughness={0.5} /></RBox>
      <mesh position={[0, -0.22, 0]}><boxGeometry args={[0.09, 0.22, 0.07]} /><meshStandardMaterial color="#e8b21e" roughness={0.5} /></mesh>
      <mesh position={[0, 0, -0.05]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.03, 20]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 0, 0.041]}><planeGeometry args={[0.3, 0.22]} /><meshBasicMaterial map={termTex()} toneMapped={false} /></mesh>
      <mesh position={[0, 0, 0.042]}><planeGeometry args={[0.012, 0.04]} />{GLOW("#ffffff", 0.9)}</mesh>
      <mesh position={[0, 0, 0.042]}><planeGeometry args={[0.04, 0.012]} />{GLOW("#ffffff", 0.9)}</mesh>
    </group>
    <Sombra p={[x + 0.05, 0.42, -0.075]} r={0.22} o={0.35} />
    <Halo p={[x, 0.42, 0.25]} r={0.25 * eio(tt, 2.6, 3.2)} c={AZUL} o={0.45} />
  </Estudio>;
}}</Stage>;

// 19 · UN CUADRITO, NO MEDIO BAÑO: un recuadro rojo con X cubre medio baño, se encoge a 20 cm; el azulejo se levanta con grosor y deja ver el tubo con su gota
const HCuadrito: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#12161b">{(tt) => {
  const enc = eio(tt, 1.0, 2.0), x = 1 - eio(tt, 0.9, 1.2), lev = eio(tt, 2.3, 3.0), S = lerp(1.2, 0.18, enc);
  const lados: [number, number, number][] = [[S / 2, 0, P2], [-S / 2, 0, P2], [0, S / 2, 0], [0, -S / 2, 0]];
  return <Estudio t={tt} cam={[0.0, 1.475, 1.121]} look={[0, 0, 0.0]} orbit={0.01} mesa={false} fit={false}>
    <mesh rotation={[-P2, 0, 0]} scale={0.0001 + cl(IN(tt, 0.2))}><planeGeometry args={[2.4, 2.0]} /><meshPhysicalMaterial map={azulejo()} roughness={0.2} clearcoat={0.8} /></mesh>
    {tt > 0.3 && lados.map(([px, pz, r], i) => <mesh key={i} position={[px, 0.004, pz]} rotation={[-P2, 0, r]}><planeGeometry args={[S + 0.02, 0.02]} />{GLOW(RED)}</mesh>)}
    {tt > 0.3 && x > 0.01 && [-1, 1].map((sd) => <mesh key={sd} position={[0, 0.005, 0]} rotation={[-P2, 0, sd * P / 4]}><planeGeometry args={[S * 1.35, 0.03]} />{GLOW(RED, x)}</mesh>)}
    {lev > 0.01 && <mesh position={[0, -0.03, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.17, 0.17]} /><meshBasicMaterial color="#120d0a" /></mesh>}
    {lev > 0.01 && <><Caño a={[-0.09, -0.04, 0]} b={[0.09, -0.04, 0]} r={0.018} /><GotaC p={[0.02, -0.065, 0.0]} s={0.012} /><pointLight position={[0, 0.05, 0]} intensity={0.6 * lev} distance={0.4} color="#ffe9b0" /></>}
    <group position={[0.06 * lev, 0.006 + 0.15 * lev, -0.05 * lev]} rotation={[-0.9 * lev, 0, 0.3 * lev]}>
      <mesh><boxGeometry args={[0.17, 0.012, 0.17]} /><meshPhysicalMaterial map={azulejo()} roughness={0.2} clearcoat={0.8} /></mesh></group>
    <Sombra p={[0.06 * lev, 0.002, -0.02]} r={0.12 * lev + 0.001} o={0.5} />
    <Halo p={[0.02, 0.0, 0.05]} r={0.15 * lev} c={AZUL} o={0.4} />
  </Estudio>;
}}</Stage>;

// 20 · LA FRANJA DE PASTO: terreno en corte con el tubo enterrado; justo encima, en línea recta, crece una franja de pasto alto y verde brillante; la humedad sube desde el tubo
const HPasto: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#10141a">{(tt) => {
  const crece = eio(tt, 0.8, 3.0);
  return <Estudio t={tt} cam={[0.295, 0.708, 1.77]} look={[0, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-1.0} c="#1a2430" />
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <mesh position={[0, -0.22, 0]}><boxGeometry args={[1.6, 0.44, 1.0]} /><meshStandardMaterial map={tierra()} roughness={1} /></mesh>
      <mesh position={[0, 0.003, 0]}><boxGeometry args={[1.6, 0.01, 1.0]} /><meshStandardMaterial color="#6f8a3a" roughness={0.95} /></mesh>
      <Caño a={[-0.8, -0.25, 0.1]} b={[0.8, -0.25, 0.1]} r={0.025} />
      {Array.from({ length: 260 }, (_, i) => { const x = (rn(i, 1) - 0.5) * 1.55, z = (rn(i, 2) - 0.5) * 0.95, enLinea = Math.abs(z - 0.1) < 0.08;
        const hh = enLinea ? 0.03 + 0.11 * crece * (0.7 + 0.3 * rn(i, 3)) : 0.025 + 0.01 * rn(i, 3);
        return <mesh key={i} position={[x, 0.008 + hh / 2, z]} rotation={[0.15 * Math.sin(tt * 2 + i), rn(i, 4) * 3, 0.15 * rn(i, 5)]}><coneGeometry args={[0.006, hh, 3]} /><meshStandardMaterial color={enLinea ? col("#8aa046", "#3cc43a", crece) : col("#a59a4a", "#8aa046", rn(i, 6))} roughness={0.8} /></mesh>; })}
      {Array.from({ length: 10 }, (_, i) => { const q = (tt * 0.5 + i / 10) % 1; return <mesh key={"h" + i} position={[-0.6 + i * 0.13, -0.24 + q * 0.23, 0.1]} scale={0.007}><sphereGeometry args={[1, 6, 4]} />{GLOW("#6fb8ff", 0.8 * crece)}</mesh>; })}
      <Halo p={[0, 0.15, 0.2]} r={0.4 * eio(tt, 2.6, 3.4)} c="#6fe05a" o={0.3} />
    </group>
  </Estudio>;
}}</Stage>;

// 21 · LOS CINCO ERRORES (items): repisa fija desde el primer cuadro; cada objeto se posa con sombra y al nombrarlo se vuelca y cae al piso, uno por vez, en fila
const Obj5: React.FC<{ i: number; tt: number }> = ({ i, tt }) => {
  if (i === 0) return <group rotation={[0, 0, 0.3]}><mesh><boxGeometry args={[0.03, 0.18, 0.02]} />{M.cromo("#8a8f94")}</mesh><mesh position={[0, -0.11, 0]}><coneGeometry args={[0.018, 0.04, 4]} />{M.cromo()}</mesh><mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.022, 0.022, 0.05, 12]} /><meshStandardMaterial color="#c4281c" /></mesh></group>;
  if (i === 1) return <group><Medidor s={0.22} giro={tt * 3} /><Chorro a={[0.2, 0.02, 0]} t={tt} k={1} n={6} r={0.006} /></group>;
  if (i === 2) return <group><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.06, 0.07, 0.14, 24]} /><meshStandardMaterial color="#1f2326" roughness={0.6} /></mesh><mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.04, 0.05, 0.02, 24]} /><meshStandardMaterial color="#1f2326" /></mesh></group>;
  if (i === 3) return <group position={[0, -0.04, 0]}><Inodoro s={0.18} nivel={0.6} /></group>;
  return <group><mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.03, 0.03, 0.1, 16]} /><meshStandardMaterial color="#f4f2ec" roughness={0.9} /></mesh><Caño a={[0, 0.0, 0]} b={[0, -0.1, 0]} r={0.005} mat={M.cromo()} /><mesh position={[0, -0.13, 0]}><cylinderGeometry args={[0.01, 0.01, 0.05, 8]} />{M.madera("#8a5a32")}</mesh></group>;
};
const HErrores: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#12161b">{(tt) => {
  const a = [0, 1, 2, 3, 4].map((i) => AT(h, i, 1.2));
  return <Estudio t={tt} cam={[0.0, 0.263, 1.829]} look={[0, 0.18, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <Piso c="#5a4a3c" y={-0.15} />
    <mesh position={[0, 0.4, -0.05]}><boxGeometry args={[1.5, 0.03, 0.25]} />{M.madera("#7a5232")}</mesh>
    {[-0.6, 0.6].map((x, i) => <mesh key={i} position={[x, 0.33, -0.12]}><boxGeometry args={[0.03, 0.12, 0.08]} />{M.madera("#5e3d24")}</mesh>)}
    {[0, 1, 2, 3, 4].map((i) => { const x = -0.6 + i * 0.3, posa = cl(IN(tt, 0.2 + i * 0.08)), cae = cl((tt - a[i]) / 0.5), rebote = cae >= 1 ? Math.abs(Math.sin((tt - a[i] - 0.5) * 10)) * Math.exp(-(tt - a[i] - 0.5) * 5) * 0.06 : 0;
      const y = cae > 0 ? lerp(0.5, -0.07, cae * cae) + rebote : lerp(1.2, 0.5, posa), on = eio(tt, a[i] + 0.4, a[i] + 0.7);
      return <group key={i}>
        <group position={[x, y, 0.02 + 0.15 * cae]} rotation={[0, 0, cae * (i % 2 ? -1.2 : 1.2)]}><Obj5 i={i} tt={tt} /></group>
        <Sombra p={[x, 0.417, -0.02]} r={0.07 * (1 - cae) * posa + 0.001} o={0.5} />
        <Sombra p={[x, -0.147, 0.17]} r={0.1 * cae + 0.001} o={0.5} />
        <Halo p={[x, -0.05, 0.25]} r={0.15 * on} c={RED} o={0.5} />
      </group>; })}
  </Estudio>;
}}</Stage>;

// 22 · LA RUTINA DE CINCO MINUTOS (items): cinco plataformas en fila, todas en cuadro (medidor, gotero, papel, tubo, pared); una ficha amarilla salta de una a otra y cada una se enciende verde
const Parada: React.FC<{ i: number; tt: number }> = ({ i, tt }) => {
  if (i === 0) return <Medidor s={0.18} rot={[-0.3, 0, 0]} giro={tt * 2} p={[0, 0.06, 0]} />;
  if (i === 1) return <Gotero p={[0, 0.08, 0]} s={1.4} />;
  if (i === 2) return <mesh position={[0, 0.07, 0]} rotation={[0, 0.4, 0.1]}><boxGeometry args={[0.12, 0.15, 0.004]} /><meshStandardMaterial color="#fbfaf6" roughness={0.9} /></mesh>;
  if (i === 3) return <group position={[0, 0.06, 0]}><Caño a={[-0.07, 0, 0]} b={[0.07, 0, 0]} r={0.018} /><GotaC p={[0.07, -0.03, 0]} s={0.01} /></group>;
  return <group position={[0, 0.08, 0]}><mesh><boxGeometry args={[0.16, 0.16, 0.02]} /><meshStandardMaterial map={yeso()} /></mesh><Mancha p={[0, -0.04, 0.012]} r={0.05} /></group>;
};
const HRutina: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const a = Array.from({ length: 5 }, (_, i) => AT(h, i, 1.0)), xs = [-0.6, -0.3, 0, 0.3, 0.6];
  let cur = -1; a.forEach((v, i) => { if (tt >= v) cur = i; });
  const salto = cur >= 0 ? cl((tt - a[cur]) / 0.45) : 0, fx = cur < 0 ? -0.9 : lerp(cur === 0 ? -0.9 : xs[cur - 1], xs[cur], salto), fy = 0.14 + Math.sin(salto * P) * 0.18;
  return <Estudio t={tt} cam={[0.0, 0.699, 1.652]} look={[0, 0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Piso c="#3e4a32" />
    {xs.map((x, i) => { const on = cur >= i ? eio(tt, a[i] + 0.35, a[i] + 0.55) : 0; return <group key={i} position={[x, 0, 0]} scale={0.0001 + cl(IN(tt, 0.2 + i * 0.06))}>
      <RBox s={[0.22, 0.03, 0.22]} r={0.01} p={[0, 0.015, 0]}><meshStandardMaterial color={col("#8a8478", "#3cc46a", on)} emissive={col("#000000", "#0a5a20", on)} roughness={0.7} /></RBox>
      <group position={[0, 0.03, 0]} scale={1.3}><Parada i={i} tt={tt} /></group>
      <Halo p={[0, 0.1, 0.12]} r={0.13 * on} c={VER} o={0.5} />
    </group>; })}
    <mesh position={[fx, fy, 0.05]}><cylinderGeometry args={[0.035, 0.035, 0.015, 24]} /><meshStandardMaterial color="#f2c230" metalness={0.5} roughness={0.3} emissive="#6a4a00" /></mesh>
    <Sombra p={[fx, 0.035, 0.05]} r={0.05} o={0.5} />
  </Estudio>;
}}</Stage>;

// 23 · EL MEDIDOR NO MIENTE: la mancha cambia de lugar en el yeso (aparece y se borra en tres sitios) mientras el medidor gira sin parar y sus rodillos suben siempre
const HErnesto: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#12161b">{(tt) => {
  const sitios: V3[] = [[-0.55, 0.2, -0.17], [-0.2, 0.55, -0.17], [-0.45, 0.75, -0.17]], u = Math.max(0, tt - 0.4), fase = Math.min(2, Math.floor(u / 1.2)), q = (u % 1.2) / 1.2;
  return <Estudio t={tt} cam={[0.0, 0.45, 1.77]} look={[0, 0.45, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <Piso c="#5a4a3c" />
    <mesh position={[-0.35, 0.5, -0.2]} scale={0.0001 + cl(IN(tt, 0.3))}><boxGeometry args={[0.9, 1.0, 0.05]} /><meshStandardMaterial map={yeso()} roughness={0.9} /></mesh>
    {tt > 0.4 && <Mancha p={sitios[fase]} r={0.16 * Math.sin(cl(q) * P)} />}
    <Medidor p={[0.4, 0.45, 0]} s={0.75 * cl(IN(tt, 0.4)) + 0.0001} giro={tt * 2.6} val={tt * 3.5} />
    <Halo p={[0.4, 0.51, 0.1]} r={0.18} c="#ff6a5a" o={0.4 + 0.2 * Math.sin(tt * 6)} />
  </Estudio>;
}}</Stage>;

// 24 · LA X DE TIZA: piso oscuro de noche; el reloj marca las 11 apoyado con sombra; se dibuja una X de tiza gruesa; el piso se parte por la X y sale el chorro
const HTiza: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false} tone="#07090c">{(tt) => {
  const x1 = eio(tt, 0.6, 1.2), x2 = eio(tt, 1.2, 1.8), rompe = eio(tt, 2.3, 2.7), chorro = eio(tt, 2.5, 3.0);
  const xs: [number, number][] = [[x1, P / 4], [x2, -P / 4]];
  return <Estudio t={tt} cam={[0.0, 1.053, 1.357]} look={[0, 0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-1.2} c="#06080b" />
    <spotLight position={[0, 1.5, 0.6]} angle={0.5} penumbra={0.7} intensity={18} color="#d8e4ff" />
    <mesh rotation={[-P2, 0, 0]}><planeGeometry args={[3, 2.4]} /><meshStandardMaterial map={ruido("pisoN", "#2e2b29", ["#3a3633", "#24211f"], 3000, 3)} roughness={0.95} /></mesh>
    <group position={[0.55, 0.0, -0.25]} rotation={[-0.25, -0.3, 0]} scale={0.0001 + cl(IN(tt, 0.3))}><group position={[0, 0.2, 0]}><Reloj s={0.65} k={11 / 12} /></group></group>
    <Sombra p={[0.55, 0.002, -0.2]} r={0.25} o={0.6} />
    {rompe < 0.05 && xs.map(([k, r], i) => k > 0.01 && <mesh key={i} position={[0, 0.003, 0]} rotation={[-P2, 0, r]} scale={[k, 1, 1]}><planeGeometry args={[0.4, 0.035]} />{GLOW("#f4f4f0", 0.95)}</mesh>)}
    {rompe < 0.05 && <Halo p={[0, 0.02, 0]} r={0.25 * x2} c="#ffffff" o={0.25} />}
    {rompe > 0.01 && [0, 1, 2, 3].map((j) => { const a = j * P2 + P / 4; return <mesh key={j} position={[Math.cos(a) * (0.08 + 0.12 * rompe), 0.01 + 0.18 * Math.sin(rompe * P) * (0.6 + 0.4 * rn(j, 1)), Math.sin(a) * (0.08 + 0.12 * rompe)]} rotation={[rompe * (rn(j, 2) - 0.5) * 2, j, rompe * (rn(j, 3) - 0.5) * 2]}>
      <boxGeometry args={[0.14, 0.02, 0.14]} /><meshStandardMaterial color="#3a3633" roughness={0.9} /></mesh>; })}
    {rompe > 0.01 && <mesh position={[0, -0.005, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.12 * rompe, 24]} /><meshBasicMaterial color="#0a0806" /></mesh>}
    <Chorro a={[0, 0.0, 0]} v={[0.05, 1.6, 0.05]} t={tt} k={chorro} n={28} r={0.012} />
    <Halo p={[0, 0.2, 0.05]} r={0.3 * chorro} c="#9fd4f4" o={0.4} />
  </Estudio>;
}}</Stage>;

// 25 · EL REPASO (items): el tubo ocupa todo el ancho; ocho llavecitas grandes; con cada idea una manija gira 90°, sale un chorrito y su base se enciende verde
const HRecap: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const a = Array.from({ length: 8 }, (_, i) => AT(h, i, 0.55, 0.5));
  return <Estudio t={tt} cam={[0.0, 0.363, 1.475]} look={[0, 0.08, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <Piso c="#4a4440" y={-0.2} />
    <Caño a={[-1.0, 0.0, 0]} b={[1.0, 0.0, 0]} r={0.04} />
    {Array.from({ length: 8 }, (_, i) => { const x = -0.77 + i * 0.22, g = eio(tt, a[i], a[i] + 0.35), on = eio(tt, a[i] + 0.25, a[i] + 0.5);
      return <group key={i} position={[x, 0, 0]} scale={0.0001 + cl(IN(tt, 0.2 + i * 0.04))}>
        <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.05, 0.08, 6]} />{BRONCE()}</mesh>
        <Caño a={[0, 0.0, 0]} b={[0, 0.1, 0]} r={0.012} mat={BRONCE()} />
        <group position={[0, 0.11, 0]} rotation={[0, g * P2, 0]}><mesh><boxGeometry args={[0.13, 0.018, 0.03]} /><meshStandardMaterial color="#c4281c" roughness={0.4} /></mesh></group>
        <Caño a={[0, -0.04, 0]} b={[0, -0.08, 0.04]} r={0.01} mat={BRONCE()} />
        <Chorro a={[0, -0.09, 0.05]} t={tt + i} k={on} n={8} r={0.006} />
        <mesh position={[0, -0.199, 0.05]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.07, 24]} /><meshBasicMaterial color={VER} transparent opacity={0.45 * on} toneMapped={false} /></mesh>
        <Halo p={[0, 0.12, 0.06]} r={0.1 * on} c={VER} o={0.5} />
      </group>; })}
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  e_siseo: HSiseo, e_nopared: HNoPared, e_dos: HDos, e_estrella: HEstrella, e_todas: HTodas, e_diez: HDiez, e_gira: HGira, e_tramo: HTramo,
  e_partir: HPartir, e_sapito: HSapito, e_gotas: HGotas, e_banos: HBanos, e_papel: HPapel, e_alivio: HAlivio, e_rebose: HRebose, e_oreja: HOreja,
  e_viaja: HViaja, e_termica: HTermica, e_cuadrito: HCuadrito, e_pasto: HPasto, e_errores: HErrores, e_rutina: HRutina, e_ernesto: HErnesto, e_tiza: HTiza, e_recap: HRecap,
};
