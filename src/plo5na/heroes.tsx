// heroes plo5na r1
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, phys, RED, Stage, Tag, VER } from "./ckit";
import { ctex, Estudio, M, RBox, rn } from "./estudio3d";
import { AGUA, Linterna, tuboGeo } from "./kitplo";

type C = React.FC<{ t: number; h: H }>;
type V3 = [number, number, number];
const P = Math.PI, P2 = P / 2;
const rel = (h: H, i: number) => (h.items?.[i]?.a ?? h.at + 99) - h.at;
const IN = (tt: number, a: number) => phys(tt, a, 7, 0.45);
const AT = (h: H, i: number, step = 1.1, a0 = 0.6) => rel(h, i) > 90 ? a0 + i * step : rel(h, i);
const CACHE = new Map<string, any>();
const memo = <T,>(k: string, f: () => T): T => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const VIN = "#e8b84a", AZUL = "#4f9be0", SARRO = "#e9e1cc", OXIDO = "#a5532a";
const GLOW = (c: string, o = 1) => <meshBasicMaterial color={c} transparent opacity={o} toneMapped={false} depthWrite={false} />;
const VIDRIO = (o = 0.22) => <meshPhysicalMaterial color="#e3f1f5" roughness={0.03} clearcoat={1} transparent opacity={o} side={THREE.DoubleSide} depthWrite={false} />;
const BRONCE = () => <meshStandardMaterial color="#b98a3e" metalness={0.85} roughness={0.3} />;
const COBRE = () => <meshStandardMaterial color="#c4693a" metalness={0.8} roughness={0.3} />;
const GALV = () => <meshStandardMaterial color="#8d949a" metalness={0.7} roughness={0.45} />;
const PVCM = (c = "#ecebe4") => <meshPhysicalMaterial color={c} roughness={0.35} clearcoat={0.4} />;
const LIQ = (c: string, o = 0.75) => <meshPhysicalMaterial color={c} roughness={0.08} transparent opacity={o} clearcoat={1} depthWrite={false} />;
// entra desde el 60% y crece suave ~1 s: nunca aparece entero en el primer cuadro ni diminuto
const S0 = (tt: number, a = 0.3) => lerp(0.6, 1, eio(tt, a - 0.3, a + 0.8)) * (tt < a - 0.35 ? 0.0001 : 1);
// ---------- texturas ----------
const ruido = (k: string, base: string, spots: string[], n = 3000, sz = 4) => ctex("p4d:" + k, 512, 512, (g) => { g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < n; i++) { g.fillStyle = spots[i % spots.length]; g.globalAlpha = 0.2 + 0.45 * rn(i, 7); const r = 1 + rn(i, 4) * sz; g.beginPath(); g.arc(rn(i, 2) * 512, rn(i, 3) * 512, r, 0, 2 * P); g.fill(); } g.globalAlpha = 1; });
const sarroTex = () => ruido("sarro", SARRO, ["#f6f1e2", "#d6ccb2", "#c9bc9c", "#fffaf0"], 6000, 3);
const oxidoTex = () => ruido("oxido", OXIDO, ["#7a3a1c", "#c46a34", "#5a2a14", "#d08a4a"], 6000, 4);
const sombraTex = () => ctex("p4d:sombra", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(0,0,0,0.8)"); gr.addColorStop(0.45, "rgba(0,0,0,0.4)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const halo = () => ctex("p4d:halo", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(255,248,220,0.95)"); gr.addColorStop(0.3, "rgba(255,240,200,0.35)"); gr.addColorStop(1, "rgba(255,240,200,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const Sombra: React.FC<{ p: V3; r: number; o?: number; sx?: number }> = ({ p, r, o = 0.75, sx = 1 }) =>
  <mesh position={p} rotation={[-P2, 0, 0]} scale={[sx, 1, 1]} renderOrder={2}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={sombraTex()} transparent opacity={o} depthWrite={false} toneMapped={false} /></mesh>;
const Halo: React.FC<{ p: V3; r: number; c?: string; o?: number }> = ({ p, r, c = "#fff3c0", o = 1 }) => r <= 0.001 || o <= 0.01 ? null :
  <mesh position={p} renderOrder={5}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={halo()} color={c} transparent opacity={o} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} /></mesh>;
const Fondo: React.FC<{ z?: number; c?: string }> = ({ z = -0.9, c = "#141a20" }) => <mesh position={[0, 0.3, z]}><planeGeometry args={[8, 5]} /><meshBasicMaterial color={c} toneMapped={false} /></mesh>;
const Piso: React.FC<{ y?: number; c?: string }> = ({ y = 0, c = "#4a4440" }) =>
  <mesh position={[0, y, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[7, 5]} /><meshStandardMaterial map={ruido("piso" + c, c, ["#5a534e", "#3b3632", "#6a625a"], 2500, 3)} roughness={0.95} /></mesh>;
const Caño: React.FC<{ a: V3; b: V3; r?: number; mat?: React.ReactNode }> = ({ a, b, r = 0.03, mat }) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = Math.max(0.001, d.length());
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()), m = A.clone().add(B).multiplyScalar(0.5);
  return <mesh position={[m.x, m.y, m.z]} quaternion={q}><cylinderGeometry args={[r, r, L, 20]} />{mat ?? COBRE()}</mesh>;
};
// tramo lleno parcialmente: de a hacia b, el líquido ocupa la fracción k
const Llena: React.FC<{ a: V3; b: V3; k: number; r?: number; c?: string; o?: number }> = ({ a, b, k, r = 0.024, c = AZUL, o = 0.9 }) => k <= 0.01 ? null :
  <Caño a={a} b={[lerp(a[0], b[0], cl(k)), lerp(a[1], b[1], cl(k)), lerp(a[2], b[2], cl(k))]} r={r} mat={GLOW(c, o)} />;
const Anillo: React.FC<{ p: V3; r: number; o: number; c?: string; rot?: V3; w?: number }> = ({ p, r, o, c = "#ffffff", rot = [-P2, 0, 0], w = 0.85 }) => o <= 0.01 ? null :
  <mesh position={p} rotation={rot} scale={r}><ringGeometry args={[w, 1, 48]} /><meshBasicMaterial color={c} transparent opacity={o} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>;
const Chorro: React.FC<{ a: V3; t: number; k: number; v?: V3; n?: number; c?: string; r?: number }> = ({ a, t, k, v = [0, 0, 0], n = 22, c = "#9fd4f4", r = 0.01 }) => k <= 0.01 ? null : <>
  {Array.from({ length: n }, (_, i) => { const q = (t * 1.6 + i / n) % 1, s = q * 0.5; return <mesh key={i} position={[a[0] + v[0] * s, a[1] + v[1] * s - 2.2 * s * s, a[2] + v[2] * s]} scale={[r * k, r * k * 1.5, r * k]}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.9, c)}</mesh>; })}</>;
const Burbujas: React.FC<{ p: V3; t: number; k: number; w?: number; hh?: number; n?: number; s?: number; c?: string }> = ({ p, t, k, w = 0.1, hh = 0.3, n = 18, s = 0.008, c = "#ffffff" }) => k <= 0.01 ? null : <group position={p}>
  {Array.from({ length: n }, (_, i) => { const q = (t * (0.4 + 0.3 * rn(i, 2)) + rn(i, 1)) % 1; return <mesh key={i} position={[(rn(i, 3) - 0.5) * w + 0.01 * Math.sin(t * 5 + i), q * hh, (rn(i, 4) - 0.5) * w]} scale={s * (0.6 + rn(i, 5)) * k}><sphereGeometry args={[1, 8, 6]} />{GLOW(c, 0.7 * (1 - q))}</mesh>; })}</group>;
const Cruz: React.FC<{ p: V3; s: number; k: number; c?: string; rot?: V3 }> = ({ p, s, k, c = RED, rot = [0, 0, 0] }) => k <= 0.01 ? null : <group position={p} rotation={rot}>
  {[1, -1].map((sd) => <mesh key={sd} rotation={[0, 0, sd * P / 4]} scale={[k, 1, 1]}><boxGeometry args={[s, s * 0.14, 0.01]} />{GLOW(c, 0.92)}</mesh>)}</group>;
const Palomita: React.FC<{ p: V3; s: number; k: number; c?: string }> = ({ p, s, k, c = VER }) => k <= 0.01 ? null : <group position={p} scale={s}>
  <mesh position={[-0.18, -0.05, 0]} rotation={[0, 0, -P / 4]} scale={[cl(k * 2), 1, 1]}><boxGeometry args={[0.32, 0.08, 0.01]} />{GLOW(c, 0.95)}</mesh>
  <mesh position={[0.12, 0.1, 0]} rotation={[0, 0, P / 3.6]} scale={[cl(k * 2 - 1), 1, 1]}><boxGeometry args={[0.6, 0.08, 0.01]} />{GLOW(c, 0.95)}</mesh></group>;
// barra que crece desde abajo (sin rótulos: la altura es el dato)
const Barra: React.FC<{ p: V3; v: number; c: string; w?: number; hmax?: number }> = ({ p, v, c, w = 0.12, hmax = 0.6 }) => <group position={p}>
  <mesh position={[0, hmax / 2, -0.01]}><boxGeometry args={[w * 1.15, hmax, 0.01]} /><meshBasicMaterial color="#000" transparent opacity={0.25} /></mesh>
  {v > 0.005 && <mesh position={[0, hmax * v / 2, 0]}><boxGeometry args={[w, hmax * v, w * 0.6]} /><meshStandardMaterial color={c} roughness={0.4} emissive={c} emissiveIntensity={0.25} /></mesh>}</group>;
// manija de válvula de esfera: ang 0 = abierta (en línea con el tubo), P2 = cerrada
const Valvula: React.FC<{ p: V3; ang: number; s?: number; rot?: V3; c?: string }> = ({ p, ang, s = 1, rot, c = "#c4281c" }) => <group position={p} scale={s} rotation={rot}>
  <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.055, 0.055, 0.12, 6]} />{BRONCE()}</mesh>
  <mesh><sphereGeometry args={[0.05, 20, 14]} />{BRONCE()}</mesh>
  <Caño a={[0, 0.04, 0]} b={[0, 0.08, 0]} r={0.012} mat={BRONCE()} />
  <group position={[0, 0.085, 0]} rotation={[0, ang, 0]}><RBox s={[0.16, 0.02, 0.035]} r={0.008} p={[0.06, 0, 0]}><meshStandardMaterial color={c} roughness={0.45} /></RBox></group></group>;
// llave de cocina (cuello de ganso) con la boca en +x
const Grifo: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.045, 0.055, 0.06, 32]} />{M.cromo()}</mesh>
  <Caño a={[0, 0.05, 0]} b={[0, 0.3, 0]} r={0.022} mat={M.cromo()} />
  <mesh position={[0.07, 0.3, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.07, 0.022, 12, 24, P]} />{M.cromo()}</mesh>
  <Caño a={[0.14, 0.3, 0]} b={[0.14, 0.24, 0]} r={0.022} mat={M.cromo()} />
  <RBox s={[0.03, 0.12, 0.03]} r={0.01} p={[-0.05, 0.12, 0]}>{M.cromo()}</RBox></group>;
// cubeta roja de 10 litros con nivel de agua lvl 0..1 (c = color del líquido)
const Cubeta: React.FC<{ p: V3; s?: number; lvl?: number; c?: string; corte?: boolean; metal?: boolean }> = ({ p, s = 1, lvl = 0, c = AZUL, corte, metal }) => <group position={p} scale={s}>
  <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.17, 0.13, 0.3, 40, 1, true]} />{corte ? VIDRIO(0.3) : metal ? <meshStandardMaterial color="#8a8e90" metalness={0.75} roughness={0.5} side={THREE.DoubleSide} /> : <meshStandardMaterial color="#c4281c" roughness={0.45} side={THREE.DoubleSide} />}</mesh>
  <mesh position={[0, 0.001, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.13, 40]} /><meshStandardMaterial color={metal ? "#6a6e70" : "#9a1e14"} /></mesh>
  <mesh position={[0, 0.3, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.17, 0.008, 8, 40]} />{metal ? GALV() : <meshStandardMaterial color="#a8200f" />}</mesh>
  <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.17, 0.005, 6, 32, P]} /><meshStandardMaterial color="#555" /></mesh>
  {lvl > 0.01 && <mesh position={[0, 0.3 * cl(lvl) / 2 + 0.002, 0]}><cylinderGeometry args={[lerp(0.13, 0.17, cl(lvl)) - 0.004, 0.126, 0.3 * cl(lvl), 40]} />{LIQ(c, corte ? 0.8 : 0.9)}</mesh>}</group>;
// tubo en corte visto de frente (eje Z hacia cámara): anillo de metal + costra de sarro que lo cierra (k 0 limpio → 1 tapado)
const Boca: React.FC<{ p: V3; R?: number; k: number; mat?: React.ReactNode; oxido?: number; L?: number; rot?: V3 }> = ({ p, R = 0.25, k, mat, oxido = 0, L = 0.5, rot = [0, 0, 0] }) => {
  const ri = lerp(R * 0.86, R * 0.07, cl(k));
  return <group position={p} rotation={rot}>
    <mesh position={[0, 0, -L / 2]} rotation={[P2, 0, 0]}><cylinderGeometry args={[R, R, L, 48, 1, true]} />{mat ?? GALV()}</mesh>
    <mesh><ringGeometry args={[R * 0.86, R, 48]} />{mat ?? GALV()}</mesh>
    {k > 0.01 && <mesh position={[0, 0, 0.002]}><ringGeometry args={[ri, R * 0.86, 48]} /><meshStandardMaterial map={oxido > 0.5 ? oxidoTex() : sarroTex()} roughness={0.95} /></mesh>}
    <mesh position={[0, 0, -L * 0.9]}><circleGeometry args={[R * 0.86, 32]} /><meshBasicMaterial color="#0b0b0c" /></mesh></group>;
};
const Tinaco: React.FC<{ p: V3; s?: number; x?: number; lvl?: number; c?: string }> = ({ p, s = 1, x = 0, lvl = 0.8, c = AZUL }) => <group position={p} scale={s}>
  <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.26, 0.24, 0.6, 40, 1, true]} />{x > 0.5 ? VIDRIO(0.25) : <meshStandardMaterial color="#1d1f22" roughness={0.6} side={THREE.DoubleSide} />}</mesh>
  <mesh position={[0, 0.62, 0]}><cylinderGeometry args={[0.12, 0.26, 0.06, 40]} />{x > 0.5 ? VIDRIO(0.3) : <meshStandardMaterial color="#26282c" roughness={0.6} />}</mesh>
  <mesh position={[0, 0.66, 0]}><cylinderGeometry args={[0.11, 0.11, 0.03, 32]} /><meshStandardMaterial color="#2c2e33" /></mesh>
  {x > 0.5 && lvl > 0.01 && <mesh position={[0, 0.3 * lvl, 0]}><cylinderGeometry args={[0.24, 0.24, 0.6 * lvl, 40]} />{LIQ(c, 0.75)}</mesh>}</group>;
const Calentador: React.FC<{ p: V3; s?: number; glow?: number; gc?: string }> = ({ p, s = 1, glow = 0, gc = VER }) => <group position={p} scale={s}>
  <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.2, 0.2, 0.7, 40]} /><meshStandardMaterial color="#eeeeea" roughness={0.35} /></mesh>
  <mesh position={[0, 0.71, 0]}><cylinderGeometry args={[0.16, 0.2, 0.04, 40]} /><meshStandardMaterial color="#d9d9d4" roughness={0.4} /></mesh>
  <RBox s={[0.12, 0.08, 0.03]} r={0.01} p={[0, 0.12, 0.2]}><meshStandardMaterial color="#3a3d42" /></RBox>
  <mesh position={[0, 0.12, 0.218]}><circleGeometry args={[0.018, 16]} />{GLOW(glow > 0.5 ? gc : "#552", 1)}</mesh>
  {glow > 0.01 && <Halo p={[0, 0.4, 0.25]} r={0.45 * glow} c={gc} o={0.35} />}</group>;

const Mostrador: React.FC<{ y?: number; w?: number }> = ({ y = 0, w = 6 }) => <mesh position={[0, y, 0]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[w, 3]} /><meshStandardMaterial map={ruido("granito", "#3b3a38", ["#55524e", "#2a2928", "#6b6862", "#1e1d1c"], 7000, 2)} roughness={0.5} /></mesh>;
const Madera: React.FC<{ y?: number }> = ({ y = 0 }) => <mesh position={[0, y, 0]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[6, 3]} /><meshStandardMaterial map={ruido("madera", "#6a4a2c", ["#4a321c", "#7e5a38", "#5a3e24"], 4000, 6)} roughness={0.8} /></mesh>;
const Azulejo: React.FC<{ z?: number }> = ({ z = -0.7 }) => <mesh position={[0, 0.6, z]}><planeGeometry args={[6, 2.4]} /><meshStandardMaterial map={ctex("PFXazu", 512, 256, (g) => { for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) { g.fillStyle = (r + c) % 2 ? "#cfd8d4" : "#c2ccc8"; g.fillRect(c * 64, r * 64, 64, 64); } g.strokeStyle = "#9aa39f"; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, 256); g.stroke(); } for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(0, i * 64); g.lineTo(512, i * 64); g.stroke(); } })} roughness={0.4} /></mesh>;
const piedraGeo = (k: string, r: number) => memo("PFXpie" + k, () => { const g = new THREE.IcosahedronGeometry(r, 5), a = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < a.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(a, i), n = 1 + 0.2 * Math.sin(v.x * 7) * Math.cos(v.y * 6) + 0.08 * Math.sin(v.z * 23 + v.x * 17) + 0.04 * Math.sin(v.y * 61) * Math.cos(v.z * 57); v.multiplyScalar(n); a.setXYZ(i, v.x, v.y, v.z); }
  g.computeVertexNormals(); return g; });
const Piedra: React.FC<{ p: V3; s: number; k?: string; ox?: boolean }> = ({ p, s, k = "a", ox }) => s <= 0.002 ? null : <mesh position={p} scale={s} castShadow><primitive object={piedraGeo(k, 1)} attach="geometry" /><meshStandardMaterial map={ox ? oxidoTex() : sarroTex()} roughness={0.95} /></mesh>;
const Gota: React.FC<{ p: V3; s?: number; c?: string }> = ({ p, s = 0.022, c }) => <mesh position={p} scale={[s, s * 1.35, s]}><sphereGeometry args={[1, 16, 12]} />{c ? <meshStandardMaterial color={c} roughness={0.15} metalness={0.1} /> : AGUA(0.95)}</mesh>;
const Grano: React.FC<{ p: V3; s: number; r?: V3; c?: string }> = ({ p, s, r = [0, 0, 0], c = "#f1ead8" }) => <mesh position={p} rotation={r} scale={[s, s * 0.7, s * 0.9]} castShadow><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={c === "#f1ead8" ? 0 : 0.25} roughness={0.9} /></mesh>;
const bote = (tt: number, a: number) => { const q = tt - a; return q < 0 ? 1 : q > 0.7 ? 0 : Math.abs(Math.cos(q * 9)) * Math.exp(-q * 6); };

// ================= plo5na · LOS 36 MEJORES TRUCOS DE PLOMERÍA · 28 componentes únicos 3D =================
// Regla: el Stage comprime el tiempo del hijo a ≤4,4 s → toda línea de tiempo cierra antes de tt≈4,2. Cámara cerca, todo apoyado, sin rótulos.
const SC = (k: number) => Math.max(0.0001, k);
const txtTex = (k: string, s: string, o: { w?: number; h?: number; bg?: string; c?: string; f?: number } = {}) => ctex("p5a:t" + k, o.w ?? 512, o.h ?? 256, (g) => {
  const W = o.w ?? 512, Hh = o.h ?? 256; if (o.bg) { g.fillStyle = o.bg; g.fillRect(0, 0, W, Hh); } g.fillStyle = o.c ?? "#16130f"; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = `900 ${o.f ?? 130}px Inter, Arial, sans-serif`; g.fillText(s, W / 2, Hh / 2 + 6); });
const Texto: React.FC<{ k: string; s: string; p: V3; w: number; h: number; bg?: string; c?: string; f?: number; o?: number; rot?: V3 }> = ({ k, s, p, w, h, bg, c, f, o = 1, rot }) => o <= 0.01 ? null :
  <mesh position={p} rotation={rot}><planeGeometry args={[w, h]} /><meshBasicMaterial map={txtTex(k, s, { w: 512, h: Math.round(512 * h / w), bg, c, f })} transparent opacity={o} toneMapped={false} depthWrite={false} /></mesh>;
const Flecha: React.FC<{ p: V3; k: number; c?: string; rot?: V3; s?: number }> = ({ p, k, c = VER, rot = [0, 0, 0], s = 1 }) => k <= 0.01 ? null : <group position={p} rotation={rot} scale={s * (0.6 + 0.4 * k)}>
  <mesh position={[0, -0.06, 0]}><boxGeometry args={[0.035, 0.14, 0.01]} />{GLOW(c, 0.9 * k)}</mesh>
  <mesh position={[0, 0.04, 0]}><coneGeometry args={[0.06, 0.08, 3]} />{GLOW(c, 0.9 * k)}</mesh></group>;
const Arco: React.FC<{ p: V3; r: number; a0: number; a: number; c?: string; o?: number; w?: number; rot?: V3 }> = ({ p, r, a0, a, c = VER, o = 0.95, w = 0.02, rot = [0, 0, 0] }) => Math.abs(a) <= 0.01 ? null :
  <mesh position={p} rotation={rot}><ringGeometry args={[r - w, r, 64, 1, a0, a]} /><meshBasicMaterial color={c} transparent opacity={o} side={THREE.DoubleSide} toneMapped={false} depthWrite={false} /></mesh>;
const Hex: React.FC<{ p: V3; r?: number; L?: number; rot?: V3; mat?: React.ReactNode }> = ({ p, r = 0.07, L = 0.06, rot = [0, 0, P2], mat }) =>
  <mesh position={p} rotation={rot}><cylinderGeometry args={[r, r, L, 6]} />{mat ?? M.cromo()}</mesh>;
const tablasTex = () => ctex("p5a:tablas", 1024, 512, (g) => { const cs = ["#7a5434", "#6b4729", "#86603c", "#5f3f24"]; for (let i = 0; i < 8; i++) { g.fillStyle = cs[i % 4]; g.fillRect(0, i * 64, 1024, 64); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(0, i * 64, 1024, 3); for (let k = 0; k < 30; k++) { g.fillStyle = `rgba(40,25,12,${0.08 + 0.1 * rn(i * 31 + k, 2)})`; g.fillRect(0, i * 64 + 6 + rn(i * 31 + k, 3) * 54, 1024, 1 + rn(k, 4) * 2); } g.fillStyle = "rgba(0,0,0,.4)"; g.fillRect((i * 389) % 1024, i * 64, 3, 64); } });
const Piso5: React.FC<{ y?: number }> = ({ y = 0 }) => <mesh position={[0, y, 0]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[6, 3]} /><meshStandardMaterial map={tablasTex()} roughness={0.7} /></mesh>;
const PVCB = () => PVCM("#eceae2");
const shake = (tt: number, a: number, b: number, amp = 0.01) => tt > a && tt < b ? amp * Math.sin(tt * 70) * (1 - (tt - a) / (b - a)) : 0;
// llave de perico estilizada: quijada abierta hacia +x en el origen, mango hacia -x
const Perico: React.FC<{ p: V3; rot?: V3; s?: number; c?: string }> = ({ p, rot, s = 1, c = "#9aa0a6" }) => <group position={p} rotation={rot} scale={s}>
  <RBox s={[0.5, 0.06, 0.03]} r={0.012} p={[-0.32, 0, 0]}><meshStandardMaterial color={c} metalness={0.85} roughness={0.35} /></RBox>
  <RBox s={[0.1, 0.035, 0.035]} r={0.01} p={[0.0, 0.07, 0]}><meshStandardMaterial color={c} metalness={0.85} roughness={0.35} /></RBox>
  <RBox s={[0.1, 0.035, 0.035]} r={0.01} p={[0.0, -0.07, 0]}><meshStandardMaterial color={c} metalness={0.85} roughness={0.35} /></RBox>
  <RBox s={[0.06, 0.18, 0.04]} r={0.012} p={[-0.06, 0, 0]}><meshStandardMaterial color={c} metalness={0.85} roughness={0.35} /></RBox></group>;
const Burbuja5: React.FC<{ p: V3; r: number; o?: number }> = ({ p, r, o = 0.8 }) => r <= 0.001 ? null :
  <mesh position={p} scale={r}><sphereGeometry args={[1, 16, 12]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={o} roughness={0} clearcoat={1} depthWrite={false} /></mesh>;

// 1 · EL CONTADOR DE LOS 36: dos fichas de reloj de estación sobre la mesa de trabajo; el número corre de 00 a 36 con la hoja que cae como persiana; caja de herramientas detrás; al llegar, halo dorado
const NContador: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#14110d">{(tt) => {
  const v = Math.round(36 * eio(tt, 0.6, 3.3)), fin = eio(tt, 3.3, 3.7), f = (tt * 36 / 2.7) % 1, gira = tt > 0.6 && tt < 3.3 ? f : 0;
  const ficha = (x: number, d: string, k: string, gg: number) => <group position={[x, 0.27, 0.05]}>
    <RBox s={[0.26, 0.36, 0.05]} r={0.02} p={[0, 0, -0.03]}><meshStandardMaterial color="#1c1b1a" roughness={0.5} /></RBox>
    <Texto k={k + d} s={d} p={[0, 0.0, 0.0]} w={0.24} h={0.33} bg="#f3ecd8" f={300} />
    <mesh position={[0, 0.0, 0.002]}><boxGeometry args={[0.25, 0.006, 0.004]} /><meshBasicMaterial color="#1c1b1a" /></mesh>
    {gg > 0.02 && gg < 0.98 && <group position={[0, 0, 0.012]} rotation={[-P * gg, 0, 0]}><mesh position={[0, 0.083, 0]}><planeGeometry args={[0.24, 0.165]} /><meshStandardMaterial color="#e6dcc2" side={THREE.DoubleSide} /></mesh></group>}</group>;
  const s2 = String(v).padStart(2, "0");
  return <Estudio t={tt} cam={[0.05, 0.36, 1.05]} look={[0, 0.24, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#16120e" /><Piso5 />
    <group position={[-0.5, 0, -0.3]} scale={S0(tt, 0.2)}><RBox s={[0.45, 0.24, 0.26]} r={0.02} p={[0, 0.12, 0]}><meshStandardMaterial color="#b72a1f" roughness={0.45} metalness={0.3} /></RBox>
      <RBox s={[0.12, 0.03, 0.04]} r={0.01} p={[0, 0.28, 0]}>{M.hierro()}</RBox></group>
    <group scale={S0(tt, 0.3)}>{ficha(-0.14, s2[0], "cd", v % 10 === 9 ? gira : 0)}{ficha(0.14, s2[1], "cu", gira)}
      <RBox s={[0.62, 0.05, 0.2]} r={0.015} p={[0, 0.06, 0.02]}>{M.hierro()}</RBox>
      {[-0.14, 0.14].map((x, i) => <mesh key={i} position={[x, 0.08, 0.02]}><boxGeometry args={[0.03, 0.04, 0.03]} />{M.hierro()}</mesh>)}</group>
    <Perico p={[0.48, 0.02, 0.15]} rot={[-P2, 0, 0.5]} s={0.8 * S0(tt, 0.5)} />
    <Halo p={[0, 0.27, 0.2]} r={0.45 * fin} c="#ffcf5a" o={0.5} />
    <Sombra p={[0, 0.002, 0.05]} r={0.3} sx={1.6} />
  </Estudio>;
}}</Stage>;

// 2 · LA SUCCIÓN AL REVÉS: fregadero en corte con el tubo de vidrio; la bola de grasa y arroz está atorada abajo; la manguera de la aspiradora pegada a la coladera
// la jala hacia ARRIBA (por donde entró) y la bola viaja por la manguera; flecha verde hacia arriba
const NAspira: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#10151a">{(tt) => {
  const on = eio(tt, 0.9, 1.3), u = eio(tt, 1.4, 3.4), cp = memo("p5a:asp", () => new THREE.CatmullRomCurve3([[0, -0.55, 0], [0, -0.1, 0], [0, 0.12, 0], [0.12, 0.35, 0], [0.42, 0.45, 0], [0.7, 0.3, 0]].map((q) => new THREE.Vector3(...(q as V3)))));
  const b = cp.getPointAt(0.0001 + 0.9998 * u), hose = memo("p5a:hose", () => tuboGeo([[0, 0.06, 0], [0, 0.18, 0], [0.12, 0.35, 0], [0.42, 0.45, 0], [0.7, 0.3, 0], [0.9, 0.05, 0]], 0.05, 60, 16));
  return <Estudio t={tt} cam={[0.25, 0.05, 1.7]} look={[0.18, -0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} />
    <mesh position={[0, 0.02, 0]}><boxGeometry args={[1.0, 0.02, 0.5]} />{M.cromo("#bfc3c7")}</mesh>
    <mesh position={[0, -0.32, 0]}><cylinderGeometry args={[0.07, 0.07, 0.66, 28, 1, true]} />{VIDRIO(0.3)}</mesh>
    <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.09, 0.07, 0.06, 28]} />{M.cromo()}</mesh>
    <group scale={S0(tt, 0.5)}><mesh geometry={hose}><meshStandardMaterial color="#1f2124" roughness={0.6} transparent opacity={0.55} /></mesh>
      <mesh position={[0.95, -0.1, 0]}><cylinderGeometry args={[0.2, 0.22, 0.34, 28]} /><meshStandardMaterial color="#e2b62c" roughness={0.45} /></mesh></group>
    <group position={[b.x, b.y, b.z]}>{Array.from({ length: 9 }, (_, i) => <Grano key={i} p={[(rn(i, 1) - 0.5) * 0.07, (rn(i, 2) - 0.5) * 0.07, (rn(i, 3) - 0.5) * 0.05]} s={0.012} />)}
      <mesh scale={0.055}><dodecahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#d8cfb2" roughness={0.85} /></mesh></group>
    <Flecha p={[-0.2, -0.2, 0.05]} k={on} s={1.3} />
    <Halo p={[0, -0.45, 0.05]} r={0.2 * (1 - u) * on} c={RED} o={0.4} />
    <Halo p={[b.x, b.y, 0.06]} r={0.12 * on} c="#ffd36a" o={0.5} />
  </Estudio>;
}}</Stage>;

// 3 · LA MEDIA ATRAPA EL ANILLO: la boca de la manguera vista de cerca con la media de nylon tensa y la liga; abajo, en el tubo de vidrio,
// el anillo dorado sube girando y se queda pegado a la tela (afuera del tanque); halo dorado
const NMedia: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#12161b">{(tt) => {
  const u = eio(tt, 0.8, 2.8), pega = eio(tt, 2.7, 3.1), y = lerp(-0.45, 0.07, u);
  return <Estudio t={tt} cam={[0.3, 0.05, 1.05]} look={[0, -0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <group scale={S0(tt, 0.2)}><mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.1, 0.1, 0.5, 32]} /><meshStandardMaterial color="#1f2124" roughness={0.55} /></mesh>
      <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.106, 32, 16, 0, 2 * P, P2, P2]} /><meshStandardMaterial color="#d9b48c" roughness={0.9} transparent opacity={0.75} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.16, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.104, 0.01, 8, 32]} /><meshStandardMaterial color="#b8322a" roughness={0.5} /></mesh></group>
    <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.13, 0.13, 0.5, 32, 1, true]} />{VIDRIO(0.25)}</mesh>
    <group position={[0, y + 0.0, 0.02]} rotation={[lerp(0.2, P2, pega) + 2 * P * u, 0.4, 0]} scale={S0(tt, 0.4)}><mesh><torusGeometry args={[0.045, 0.012, 14, 36]} />{M.cromo("#e8c35a")}</mesh></group>
    <Halo p={[0, y, 0.1]} r={0.08 + 0.16 * pega} c="#ffd36a" o={0.45 + 0.3 * pega} />
    <Flecha p={[0.22, -0.2, 0]} k={eio(tt, 0.7, 1.0) * (1 - pega)} c="#ffd36a" />
  </Estudio>;
}}</Stage>;

// 4 · EL IMÁN EN EL HILO: hueco oscuro detrás del mueble; el imán de neodimio baja colgado del hilo de pescar, el tornillo del piso salta y se pega
const NIman: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#0f1216">{(tt) => {
  const baja = eio(tt, 0.5, 2.2), sube = eio(tt, 2.9, 3.9), my = lerp(0.6, 0.12, baja) + 0.42 * sube, salta = eio(tt, 2.2, 2.45), sy = lerp(0.015, my - 0.05, salta);
  return <Estudio t={tt} cam={[0.2, 0.3, 1.05]} look={[0, 0.2, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.4} c="#0d0f12" />
    <mesh position={[-0.35, 0.4, 0]}><boxGeometry args={[0.05, 1.0, 0.6]} /><meshStandardMaterial color="#6a4a2c" roughness={0.8} /></mesh>
    <mesh position={[0.3, 0.4, -0.05]}><boxGeometry args={[0.04, 1.0, 0.5]} /><meshStandardMaterial color="#e9e5da" roughness={0.6} /></mesh>
    <mesh position={[0, 0, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.2, 1]} /><meshStandardMaterial color="#3a3532" roughness={0.9} /></mesh>
    <Caño a={[0, my + 0.02, 0]} b={[0, 1.2, 0]} r={0.002} mat={GLOW("#dfe8ee", 0.8)} />
    <mesh position={[0, my, 0]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.03, 32]} />{M.cromo("#cfd3d8")}</mesh>
    <group position={[0.0, sy, 0.0]} rotation={[0, 0, lerp(P2, 0, salta)]}><mesh><cylinderGeometry args={[0.006, 0.006, 0.07, 10]} />{M.cromo("#9aa0a6")}</mesh>
      <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[0.014, 0.014, 0.008, 16]} />{M.cromo("#9aa0a6")}</mesh></group>
    <Halo p={[0, my - 0.03, 0.06]} r={0.18 * salta} c="#9fe0ff" o={0.5} />
    <Linterna p={[0.25, 0.75, 0.25]} rot={[0.9, 0.5, 0]} on={1} />
  </Estudio>;
}}</Stage>;

// 5 · LA CINTA ES LA GUÍA: tubo de PVC acostado; la cinta azul da la vuelta completa, la segueta baja pegada a su orilla, el pedazo se separa con la cara recta (anillo verde)
const NCinta: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#13171c">{(tt) => {
  const env = eio(tt, 0.4, 1.4), corta = eio(tt, 1.6, 3.0), sep = eio(tt, 3.0, 3.6), ok = eio(tt, 3.4, 3.8), X = 0.05;
  return <Estudio t={tt} cam={[0.3, 0.32, 0.95]} look={[0.05, 0.1, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} /><Piso5 y={-0.0} />
    <group position={[0, 0.07, 0]} scale={S0(tt, 0.15)}>
      <mesh position={[-0.35 - 0.0, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.065, 0.065, 0.8, 36]} />{PVCB()}</mesh>
      <group position={[0.2 * sep, 0, 0]}><mesh position={[0.25, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.065, 0.065, 0.4 - 0.0, 36]} />{PVCB()}</mesh>
        <mesh position={[X + 0.0005, 0, 0]} rotation={[0, P2, 0]}><ringGeometry args={[0.052, 0.065, 36]} /><meshStandardMaterial color="#f4f2ea" side={THREE.DoubleSide} /></mesh></group>
      <mesh position={[X - 0.03, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.067, 0.067, 0.06, 36, 1, true, 0, 2 * P * Math.max(0.01, env)]} /><meshStandardMaterial color="#3d7fd6" roughness={0.6} side={THREE.DoubleSide} /></mesh>
    </group>
    <group position={[X, 0.07 + lerp(0.22, 0.0, corta), 0]} rotation={[0, 0, 0.0]} scale={SC(eio(tt, 1.3, 1.6))}>
      <mesh position={[0, 0.0, 0]}><boxGeometry args={[0.004, 0.06, 0.5]} />{M.cromo()}</mesh>
      <mesh position={[0, 0.17, 0]}><boxGeometry args={[0.014, 0.02, 0.56]} /><meshStandardMaterial color="#c4281c" metalness={0.4} roughness={0.4} /></mesh>
      {[-0.27, 0.27].map((z, i) => <mesh key={i} position={[0, 0.09, z]}><boxGeometry args={[0.014, 0.17, 0.02]} /><meshStandardMaterial color="#c4281c" metalness={0.4} roughness={0.4} /></mesh>)}
      <RBox s={[0.03, 0.12, 0.05]} r={0.012} p={[0, 0.05, 0.33]}><meshStandardMaterial color="#1c1b1a" roughness={0.6} /></RBox></group>
    <Anillo p={[X + 0.2 * sep, 0.07, 0]} r={0.09} o={0.9 * ok} c={VER} rot={[0, P2, 0]} />
    <Sombra p={[0, 0.002, 0]} r={0.3} sx={2.2} o={0.5} />
  </Estudio>;
}}</Stage>;

// 6 · LA REBABA BARRE EL PEGAMENTO: dos uniones en corte. Arriba el tubo con rebaba entra y empuja el pegamento al fondo (montoncito rojo);
// abajo el tubo biselado entra y la capa dorada queda pareja en toda la unión (verde)
const NBisel: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const e1 = eio(tt, 0.5, 2.0), e2 = eio(tt, 2.2, 3.7), mal = eio(tt, 1.8, 2.1), bien = eio(tt, 3.5, 3.8);
  const fila = (y: number, e: number, rebaba: boolean, k: number) => <group position={[0, y, 0]}>
    <mesh position={[0.18, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.085, 0.085, 0.36, 36, 1, true]} />{VIDRIO(0.3)}</mesh>
    <mesh position={[0.36, 0, 0]} rotation={[0, P2, 0]}><circleGeometry args={[0.085, 32]} /><meshStandardMaterial color="#d9d6cc" /></mesh>
    {rebaba ? <mesh position={[lerp(0.06, 0.33, e), 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.072, 0.072, lerp(0.24, 0.06, e), 32]} />{GLOW("#e8b84a", 0.75)}</mesh>
      : <mesh position={[0.18, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.074, 0.074, 0.34, 32, 1, true]} />{GLOW("#e8b84a", 0.55)}</mesh>}
    <group position={[lerp(-0.45, 0.0, e), 0, 0]}><mesh position={[-0.05, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.07, rebaba ? 0.07 : 0.062, 0.64, 32]} />{PVCB()}</mesh>
      {rebaba && Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0.27, Math.cos(i * 0.63) * 0.072, Math.sin(i * 0.63) * 0.072]} scale={0.008}><tetrahedronGeometry args={[1]} />{PVCB()}</mesh>)}</group>
    <Halo p={[0.33, 0, 0.1]} r={0.15 * k} c={rebaba ? RED : VER} o={0.5} />
    {rebaba ? <Cruz p={[0.6, 0, 0.05]} s={0.1} k={k} /> : <Palomita p={[0.6, 0, 0.05]} s={0.25} k={k} />}
  </group>;
  return <Estudio t={tt} cam={[0.1, 0.0, 1.55]} look={[0.05, 0, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    {fila(0.2, e1, true, mal)}{fila(-0.2, e2, false, bien)}
  </Estudio>;
}}</Stage>;

// 7 · LA RAYA Y EL CUARTO DE VUELTA: el tubo entra al codo con su raya negra desfasada 90°; gira hasta que las dos rayas se juntan y se encienden en una sola línea verde
const NRaya: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#12161b">{(tt) => {
  const e = eio(tt, 0.4, 1.4), g = eio(tt, 1.6, 3.2), ok = eio(tt, 3.1, 3.4), ang = lerp(P2, 0, g);
  return <Estudio t={tt} cam={[0.15, 0.25, 0.95]} look={[0.05, 0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <group position={[0.2, 0.05, 0]} scale={S0(tt, 0.15)}>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.09, 0.09, 0.22, 36]} />{PVCB()}</mesh>
      <mesh position={[0.11, 0.0, 0]}><sphereGeometry args={[0.09, 24, 16]} />{PVCB()}</mesh>
      <mesh position={[0.11, 0.2, 0]}><cylinderGeometry args={[0.09, 0.09, 0.3, 36]} />{PVCB()}</mesh>
      <mesh position={[-0.02, 0, 0.092]}><boxGeometry args={[0.14, 0.008, 0.004]} />{ok > 0 ? GLOW(col("#111111", VER, ok)) : <meshBasicMaterial color="#111" />}</mesh>
    </group>
    <group position={[lerp(-0.5, 0.09, e), 0.05, 0]} rotation={[ang, 0, 0]}>
      <mesh position={[-0.3, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.075, 0.075, 0.6, 36]} />{PVCB()}</mesh>
      <mesh position={[-0.06, 0, 0.077]}><boxGeometry args={[0.14, 0.008, 0.004]} />{ok > 0 ? GLOW(col("#111111", VER, ok)) : <meshBasicMaterial color="#111" />}</mesh></group>
    <Arco p={[0.09, 0.05, 0.12]} r={0.13} a0={P2} a={-P2 * g + 0.0001} c="#ffcf5a" rot={[0, P2, 0]} o={0.8 * (1 - ok)} />
    <Halo p={[0.09, 0.05, 0.12]} r={0.22 * ok} c={VER} o={0.45} />
  </Estudio>;
}}</Stage>;

// 8 · EL RELOJ DEL CURADO: la unión recién pegada con el reloj de cocina enfrente; el arco ámbar de 15 min se llena, después el verde de 2 horas;
// recién ahí el agua azul corre por el tubo y la unión queda seca
const NCurado: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#12161b">{(tt) => {
  const a1 = eio(tt, 0.5, 1.4), a2 = eio(tt, 1.5, 3.0), agua = eio(tt, 3.0, 3.9);
  return <Estudio t={tt} cam={[0.0, 0.15, 1.2]} look={[0.0, 0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <group position={[0, -0.18, 0]} scale={S0(tt, 0.2)}>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.06, 0.06, 1.2, 32, 1, true]} />{VIDRIO(0.3)}</mesh>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.075, 0.075, 0.18, 32]} />{PVCM("#d9d6cc")}</mesh>
      {agua > 0.01 && <mesh position={[lerp(-0.6, 0, agua), 0, 0]} rotation={[0, 0, P2]} scale={[1, Math.max(0.0001, agua), 1]}><cylinderGeometry args={[0.05, 0.05, 1.2, 20]} />{AGUA(0.85, AZUL)}</mesh>}</group>
    <group position={[0, 0.25, 0]} scale={S0(tt, 0.3)}>
      <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.05, 48]} /><meshStandardMaterial color="#f4f1e8" roughness={0.4} /></mesh>
      <Arco p={[0, 0, 0.03]} r={0.18} a0={P2} a={-2 * P * 0.125 * a1 - 0.0001} c="#f2a93b" w={0.03} />
      <Arco p={[0, 0, 0.031]} r={0.145} a0={P2} a={-2 * P * a2 - 0.0001} c={VER} w={0.03} />
      <group position={[0, 0, 0.035]} rotation={[0, 0, -2 * P * (0.125 * a1 + a2)]}><mesh position={[0, 0.07, 0]}><boxGeometry args={[0.012, 0.14, 0.005]} /><meshBasicMaterial color="#222" /></mesh></group>
    </group>
    <Halo p={[0, -0.18, 0.1]} r={0.22 * agua} c={VER} o={0.35} />
  </Estudio>;
}}</Stage>;

// 9 · PARED GRUESA, PARED DELGADA: dos tubos cortados de frente; la presión empuja desde adentro (flechas); el delgado (sanitario) se raja y escupe, el grueso (hidráulico) aguanta
const NParedes: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const pr = eio(tt, 0.8, 2.4), raja = eio(tt, 2.4, 2.8), ok = eio(tt, 3.0, 3.4), sh = shake(tt, 2.3, 3.2, 0.012);
  const tubo = (x: number, ri: number, malo: boolean) => <group position={[x + (malo ? sh : 0), 0.15, 0]} scale={S0(tt, 0.2)}>
    <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.5, 48, 1, true]} />{PVCB()}</mesh>
    <mesh position={[0, 0, 0.25]}><ringGeometry args={[ri, 0.2, 48]} />{PVCB()}</mesh>
    <mesh position={[0, 0, 0.0]}><circleGeometry args={[ri, 32]} />{GLOW(AZUL, 0.55 + 0.25 * pr)}</mesh>
    {Array.from({ length: 6 }, (_, i) => <Flecha key={i} p={[Math.cos(i * P / 3) * ri * 0.6, Math.sin(i * P / 3) * ri * 0.6, 0.26]} rot={[0, 0, i * P / 3 - P2]} k={pr} c="#9fd4ff" s={0.5} />)}
    {malo && raja > 0.01 && <><mesh position={[0, 0.2 - (0.2 - ri) / 2, 0.255]}><boxGeometry args={[0.012, (0.2 - ri) * 1.05, 0.01]} /><meshBasicMaterial color="#111" /></mesh>
      <Chorro a={[0, 0.2, 0.25]} t={tt} k={raja} v={[0, 1.2, 0.6]} n={16} r={0.014} /></>}
    <Halo p={[0, 0, 0.3]} r={0.32 * (malo ? raja : ok)} c={malo ? RED : VER} o={0.35} />
  </group>;
  return <Estudio t={tt} cam={[0, 0.2, 1.5]} look={[0, 0.12, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />{tubo(-0.32, 0.13, false)}{tubo(0.32, 0.18, true)}
  </Estudio>;
}}</Stage>;

// 10 · EL HILO QUE MIDE: el hilo da la vuelta al tubo, se desenrolla sobre la regla amarilla y su largo se parte en 3,14 pedazos; uno queda parado como el diámetro: 21 mm
const reglaTex = () => ctex("p5a:regla", 1024, 64, (g) => { g.fillStyle = "#f2c230"; g.fillRect(0, 0, 1024, 64); g.fillStyle = "#1a1a1a"; for (let i = 0; i <= 100; i++) g.fillRect(i * 10.24, 0, 2, i % 10 ? 18 : 34); });
const NHilo: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#13161a">{(tt) => {
  const env = eio(tt, 0.3, 1.0), des = eio(tt, 1.2, 2.3), parte = eio(tt, 2.4, 3.1), dia = eio(tt, 3.1, 3.6), L = 0.66;
  return <Estudio t={tt} cam={[-0.05, 0.5, 0.95]} look={[-0.05, 0.12, 0.05]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} /><Piso5 />
    <group position={[-0.45, 0.0, -0.1]} scale={S0(tt, 0.15)}><mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.105, 0.105, 0.5, 36]} />{PVCB()}</mesh>
      {(1 - des) > 0.01 && <mesh position={[0, 0.3, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.11, 0.008, 8, 48, 2 * P * Math.max(0.01, env * (1 - des))]} /><meshBasicMaterial color="#e0352b" /></mesh>}</group>
    <mesh position={[0.1, 0.005, 0.15]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.9, 0.06]} /><meshStandardMaterial map={reglaTex()} roughness={0.6} /></mesh>
    {Array.from({ length: 3 }, (_, i) => { const seg = L / 3.14, x0 = -0.32 + i * seg * (1 + 0.06 * parte); return des > 0.01 && <mesh key={i} position={[x0 + seg * des / 2, 0.012, 0.15]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.008, 0.008, Math.max(0.001, seg * des - 0.012 * parte), 8]} /><meshBasicMaterial color={i === 0 ? col("#e0352b", VER, parte) : "#e0352b"} /></mesh>; })}
    {dia > 0.01 && <mesh position={[-0.45 + 0.0, 0.25, 0.12]} rotation={[0, 0, P2]} scale={[1, dia, 1]}><cylinderGeometry args={[0.006, 0.006, 0.21, 8]} />{GLOW(VER)}</mesh>}
    <Texto k="21mm" s="21 mm" p={[-0.12, 0.3, 0.1]} w={0.32} h={0.12} c="#f4f1e8" o={dia} />
  </Estudio>;
}}</Stage>;

// 11 · EL TRAPO SALVA EL CROMO: dos tuercas cromadas; la de la izquierda la muerde la llave directo y le quedan rayas negras; la de la derecha con el trapo doblado gira igual y sale brillando
const NTrapo: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#12161b">{(tt) => {
  const g = eio(tt, 0.8, 2.6), raya = eio(tt, 1.6, 2.6), brillo = eio(tt, 2.8, 3.3);
  const lado = (x: number, trapo: boolean) => <group position={[x, 0.15, 0]} scale={S0(tt, 0.2)}>
    <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.03, 0.03, 0.3, 20]} />{M.cromo()}</mesh>
    <group rotation={[0, g * P / 3, 0]}><Hex p={[0, 0, 0]} r={0.09} L={0.1} rot={[0, 0, 0]} />
      {!trapo && raya > 0.01 && Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0.078, -0.03 + i * 0.015, 0.0]} rotation={[0, 0, 0.3]}><boxGeometry args={[0.006, 0.01, 0.07 * raya]} /><meshBasicMaterial color="#1a1a1a" /></mesh>)}</group>
    {trapo && <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.09, 6, 1, true]} /><meshStandardMaterial color="#d8d0bf" roughness={1} side={THREE.DoubleSide} transparent opacity={0.8 * (1 - brillo)} /></mesh>}
    <group rotation={[0, g * P / 3, 0]}><Perico p={[0.12, 0, 0]} rot={[0, 0, 0]} s={0.6} /></group>
    {trapo ? <Halo p={[0.03, 0.03, 0.12]} r={0.2 * brillo} c="#ffffff" o={0.7} /> : <Halo p={[0.05, 0, 0.12]} r={0.16 * raya} c={RED} o={0.35} />}
  </group>;
  return <Estudio t={tt} cam={[0, 0.32, 0.8]} look={[0, 0.12, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azulejo z={-0.5} />{lado(-0.24, false)}{lado(0.24, true)}
  </Estudio>;
}}</Stage>;

// 12 · LA CONTRA-LLAVE: la pared en corte deja ver el codo escondido; con una sola llave la tuerca arrastra el tubo y el codo de adentro se tuerce y late rojo;
// entra la segunda llave sosteniendo la pieza y la tuerca gira sola: el codo queda quieto y verde
const NContra: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#12161b">{(tt) => {
  const g1 = eio(tt, 0.5, 1.8), malo = eio(tt, 1.2, 1.8) * (1 - eio(tt, 2.0, 2.3)), c2 = eio(tt, 2.2, 2.6), g2 = eio(tt, 2.7, 3.8), ok = eio(tt, 3.6, 3.9);
  const torc = 0.35 * g1 * (1 - eio(tt, 2.0, 2.3));
  return <Estudio t={tt} cam={[0.3, 0.18, 0.95]} look={[-0.08, 0.02, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} />
    <mesh position={[-0.35, 0.05, 0]}><boxGeometry args={[0.3, 0.9, 0.5]} /><meshStandardMaterial color="#d8c9ac" roughness={0.9} transparent opacity={0.35} /></mesh>
    <group rotation={[torc, 0, 0]}>
      <Caño a={[-0.36, -0.3, 0]} b={[-0.36, 0.0, 0]} r={0.03} mat={M.cromo("#c4693a")} />
      <mesh position={[-0.36, 0.0, 0]}><sphereGeometry args={[0.04, 20, 14]} />{M.cromo("#c4693a")}</mesh>
      <Caño a={[-0.36, 0.0, 0]} b={[0.05, 0.0, 0]} r={0.03} mat={M.cromo("#c4693a")} /></group>
    <Halo p={[-0.36, 0.0, 0.1]} r={0.2 * malo + 0.18 * ok} c={malo > ok ? RED : VER} o={0.5} />
    <Hex p={[0.05, 0, 0]} r={0.05} L={0.08} mat={BRONCE()} />
    <Hex p={[0.15, 0, 0]} r={0.045} L={0.08} mat={BRONCE()} />
    <group position={[0.15, 0, 0]} rotation={[g1 * 0.8 + g2 * 0.8, 0, 0]}><Perico p={[0, 0.0, 0]} rot={[0, 0, -P2]} s={0.5} /></group>
    <group position={[0.05, 0, 0]} scale={SC(c2)}><Perico p={[0, 0, 0]} rot={[0, 0, P2]} s={0.5} c="#7c8288" /></group>
  </Estudio>;
}}</Stage>;

// 13 · LA STILLSON DEL LADO CORRECTO: al revés resbala sobre el tubo (tiembla y vuelve, raspón rojo); dada vuelta muerde y el tubo gira con ella (flecha verde)
const Stillson: React.FC<{ p: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <RBox s={[0.6, 0.07, 0.04]} r={0.015} p={[-0.38, 0, 0]}><meshStandardMaterial color="#b72a1f" metalness={0.4} roughness={0.45} /></RBox>
  <RBox s={[0.05, 0.22, 0.05]} r={0.012} p={[-0.06, 0.06, 0]}><meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.35} /></RBox>
  <RBox s={[0.14, 0.04, 0.05]} r={0.01} p={[0.0, 0.16, 0]}><meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.35} /></RBox>
  <RBox s={[0.14, 0.04, 0.05]} r={0.01} p={[0.0, -0.08, 0]}><meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.35} /></RBox></group>;
const NStillson: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#12161b">{(tt) => {
  const r1 = tt < 2.0 ? 0.25 * Math.sin(cl((tt - 0.6) / 1.2) * P) : 0, flip = eio(tt, 2.0, 2.4), g = eio(tt, 2.6, 3.8), malo = eio(tt, 1.0, 1.3) * (1 - flip);
  return <Estudio t={tt} cam={[0.7, 0.35, 0.95]} look={[-0.1, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} />
    <group rotation={[0, 0, -g * 0.6]}><mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 1.0, 32]} />{GALV()}</mesh>
      <mesh position={[0.045, 0, 0.1]}><boxGeometry args={[0.01, 0.02, 0.1]} /><meshBasicMaterial color="#555" /></mesh></group>
    <group rotation={[0, flip * P, -r1 - g * 0.6]}><Stillson p={[0.0, 0.0, 0]} s={0.8} /></group>
    <Halo p={[0.05, 0.05, 0.12]} r={0.2 * malo} c={RED} o={0.45} />
    <Arco p={[0, 0, 0.15]} r={0.22} a0={P2} a={-0.6 * g - 0.0001} c={VER} w={0.025} />
  </Estudio>;
}}</Stage>;

// 14 · A MANO HASTA QUE TOPA + UN CUARTO: la tuerca blanca del sifón gira con su anillo de vueltas; topa (golpecito), y un cuarto de vuelta más se enciende verde
const NMano: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#12161b">{(tt) => {
  const v = eio(tt, 0.4, 2.2), tope = tt > 2.2 && tt < 2.5 ? 0.01 * Math.sin((tt - 2.2) * 60) : 0, q = eio(tt, 2.6, 3.4), ok = eio(tt, 3.3, 3.6), ang = 3 * P * v + P2 * q;
  return <Estudio t={tt} cam={[0.0, 0.3, 0.7]} look={[0, 0.1, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.7, 32]} />{PVCB()}</mesh>
    <group position={[0, 0.1 + tope, 0]} rotation={[0, ang, 0]} scale={S0(tt, 0.15)}>
      <mesh><cylinderGeometry args={[0.1, 0.1, 0.09, 40]} /><meshStandardMaterial color="#f2f0ea" roughness={0.4} /></mesh>
      {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[Math.cos(i * P / 8) * 0.101, 0, Math.sin(i * P / 8) * 0.101]} rotation={[0, -i * P / 8, 0]}><boxGeometry args={[0.006, 0.08, 0.012]} /><meshStandardMaterial color="#dcd9d0" /></mesh>)}
      <mesh position={[0.0, 0.0, 0.102]}><boxGeometry args={[0.012, 0.07, 0.004]} />{GLOW(RED)}</mesh></group>
    <Arco p={[0, 0.16, 0]} r={0.16} a0={0} a={2 * P * Math.min(1, v * 1.5) + 0.0001} c="#9fb4c8" o={0.5} rot={[-P2, 0, 0]} />
    <Arco p={[0, 0.17, 0]} r={0.19} a0={0} a={P2 * q + 0.0001} c={VER} rot={[-P2, 0, 0]} w={0.03} />
    <Halo p={[0, 0.1, 0.12]} r={0.25 * ok} c={VER} o={0.4} />
  </Estudio>;
}}</Stage>;

// 15 · LA MASILLA QUE SE ASOMA: la coladera de acero baja sobre el churro beige; al apretar la tuerca de abajo el churro se aplasta y asoma parejo por todo el borde; un dedo lo recoge
const NMasilla: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#12161b">{(tt) => {
  const baja = eio(tt, 0.5, 1.4), apl = eio(tt, 1.6, 2.8), dedo = eio(tt, 2.9, 3.9);
  return <Estudio t={tt} cam={[0.25, 0.42, 0.9]} look={[0, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} />
    <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.5, 0.5, 0.03, 48, 1, false]} />{M.cromo("#bfc3c7")}</mesh>
    <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.13, 0.13, 0.031, 40]} /><meshBasicMaterial color="#0b0b0c" /></mesh>
    <mesh position={[0, 0.012 + 0.012 * (1 - apl), 0]} rotation={[P2, 0, 0]} scale={[1 + 0.18 * apl, 1 + 0.18 * apl, Math.max(0.2, 1 - 0.7 * apl)]}><torusGeometry args={[0.15, 0.016, 12, 48]} /><meshStandardMaterial color="#d9c49a" roughness={0.9} /></mesh>
    {dedo > 0.01 && <mesh position={[0, 0.012, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.178, 0.008, 8, 48, 2 * P * dedo]} />{GLOW(VER, 0.85)}</mesh>}
    <group position={[0, lerp(0.35, 0.03 - 0.008 * apl, baja), 0]}><mesh><cylinderGeometry args={[0.17, 0.165, 0.02, 48]} />{M.cromo()}</mesh>
      <mesh position={[0, 0.011, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.03, 0.1, 32]} />{M.cromo("#9aa0a6")}</mesh></group>
    <group position={[Math.cos(2 * P * dedo) * 0.19, 0.05, Math.sin(2 * P * dedo) * 0.19]} scale={SC(eio(tt, 2.8, 3.0) * (1 - eio(tt, 3.9, 4.1)))}><mesh rotation={[0.4, 0, 0]}><capsuleGeometry args={[0.03, 0.12, 8, 12]} /><meshStandardMaterial color="#c99a7a" roughness={0.6} /></mesh></group>
  </Estudio>;
}}</Stage>;

// 16 · LOS 5 ERRORES (items): cinco pedestales; con cada error cae su objeto y su pedestal se enciende rojo
const NErrores: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#110d0c">{(tt) => {
  const a = Array.from({ length: 5 }, (_, i) => AT(h, i, 1.2, 0.6));
  return <Estudio t={tt} cam={[0, 0.3, 1.35]} look={[0, 0.24, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#140f0e" /><Piso c="#3a3532" />
    {Array.from({ length: 5 }, (_, i) => { const x = -0.76 + i * 0.38, d = eio(tt, a[i], a[i] + 0.35), on = eio(tt, a[i] + 0.3, a[i] + 0.6), b = d >= 1 ? bote(tt, a[i] + 0.35) : 0, y = lerp(0.6, 0, d) + 0.03 * b;
      return <group key={i} position={[x, 0, 0]}>
        <group scale={S0(tt, 0.2 + i * 0.06)}><mesh position={[0, 0.05, 0]} castShadow><cylinderGeometry args={[0.16, 0.17, 0.1, 32]} /><meshStandardMaterial color="#2a2726" roughness={0.6} /></mesh>
          <mesh position={[0, 0.101, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.15, 32]} />{GLOW(RED, 0.6 * on)}</mesh></group>
        {d > 0.01 && <group position={[0, 0.11 + y, 0]} scale={2.0}>
          {i === 0 && <><Valvula p={[0, 0.04, 0]} ang={0} s={0.5} /><Chorro a={[0.03, 0.05, 0]} t={tt} k={1} v={[0.6, 0.6, 0]} n={10} r={0.008} /></>}
          {i === 1 && <><Hex p={[0, 0.04, 0]} r={0.04} L={0.04} rot={[0, 0, 0]} mat={BRONCE()} /><mesh position={[0.02, 0.06, 0.035]} rotation={[0, 0, 0.6]}><boxGeometry args={[0.004, 0.05, 0.004]} /><meshBasicMaterial color="#111" /></mesh><Perico p={[0.05, 0.04, 0]} s={0.25} /></>}
          {i === 2 && <><Caño a={[-0.08, 0.04, 0]} b={[0, 0.04, 0]} r={0.018} mat={COBRE()} /><Caño a={[0, 0.04, 0]} b={[0.08, 0.04, 0]} r={0.018} mat={GALV()} /><mesh position={[0, 0.04, 0]}><sphereGeometry args={[0.024, 12, 10]} /><meshStandardMaterial map={oxidoTex()} /></mesh></>}
          {i === 3 && <><mesh position={[0, 0.04, 0]} rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.02, 0.02, 0.12, 16]} /><meshStandardMaterial color="#f4f2ea" /></mesh><mesh position={[0.04, 0.1, 0]} rotation={[0, 0, 0.5]}><coneGeometry args={[0.01, 0.04, 12]} /><meshStandardMaterial color="#f4f2ea" /></mesh><Gota p={[-0.04, 0.0, 0.02]} s={0.012} /></>}
          {i === 4 && <><mesh position={[-0.04, 0.05, 0]}><cylinderGeometry args={[0.025, 0.028, 0.1, 16]} /><meshStandardMaterial color="#e6d36a" roughness={0.4} /></mesh><mesh position={[0.04, 0.05, 0]}><cylinderGeometry args={[0.025, 0.028, 0.1, 16]} /><meshStandardMaterial color="#e8eef2" roughness={0.4} /></mesh><Cruz p={[0, 0.06, 0.04]} s={0.07} k={on} /></>}
        </group>}
        <Halo p={[0, 0.2, 0.1]} r={0.16 * on} c={RED} o={0.4} />
        <Sombra p={[0, 0.002, 0]} r={0.2} o={0.5} />
      </group>; })}
  </Estudio>;
}}</Stage>;

// 17 · VASELINA EN EL HULE: dos anillos de hule; el seco se estira al entrar en la ranura y se parte (rojo); el brillante con su capa resbala y asienta (verde)
const NVaselina: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const e = eio(tt, 0.7, 2.2), parte = eio(tt, 1.9, 2.2), ok = eio(tt, 2.3, 2.7), bri = 0.5 + 0.5 * Math.sin(tt * 3);
  const lado = (x: number, seco: boolean) => <group position={[x, 0.1, 0]} scale={S0(tt, 0.2)}>
    <mesh><cylinderGeometry args={[0.07, 0.07, 0.5, 32]} />{M.cromo("#b9bdc2")}</mesh>
    <mesh position={[0, 0.0, 0]}><torusGeometry args={[0.07, 0.006, 8, 40]} /><meshBasicMaterial color="#333" /></mesh>
    <group position={[0, lerp(0.32, 0.0, e), 0]} rotation={[P2, 0, 0]} scale={[1 + 0.25 * Math.sin(e * P) * (seco ? 1 : 0.3), 1 + 0.25 * Math.sin(e * P) * (seco ? 1 : 0.3), 1]}>
      <mesh><torusGeometry args={[0.072, 0.014, 14, 48, seco ? 2 * P - 0.5 * parte : 2 * P]} />{seco ? <meshStandardMaterial color="#1a1a1a" roughness={0.95} /> : <meshPhysicalMaterial color="#1a1a1a" roughness={0.1} clearcoat={1} />}</mesh></group>
    {!seco && <Halo p={[0.05, 0.03, 0.1]} r={0.08 * bri * (1 - ok) + 0.2 * ok} c={seco ? RED : "#ffffff"} o={0.5} />}
    {seco ? <Cruz p={[0, -0.32, 0.05]} s={0.1} k={parte} /> : <Palomita p={[0, -0.32, 0.05]} s={0.22} k={ok} />}
  </group>;
  return <Estudio t={tt} cam={[0, 0.15, 1.15]} look={[0, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />{lado(-0.28, true)}{lado(0.28, false)}
  </Estudio>;
}}</Stage>;

// 18 · LA FECHA DEL FLEXIBLE: flexible trenzado de la llave de paso a la llave; su etiqueta corre los años 1→5; al quinto, aunque se vea bien, aparece la ampolla que late roja
const NFlexible: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#12161b">{(tt) => {
  const an = Math.min(5, 1 + Math.floor(eio(tt, 0.6, 3.0) * 4.999)), bulto = eio(tt, 3.0, 3.6), lat = 0.75 + 0.25 * Math.sin(tt * 9);
  const g = memo("p5a:flex", () => tuboGeo([[0, -0.4, 0], [0.02, -0.15, 0.04], [0.0, 0.1, 0.05], [-0.05, 0.3, 0.0], [0.0, 0.42, 0]], 0.022, 60, 12));
  const trenza = () => ctex("p5a:trenza", 128, 128, (q) => { q.fillStyle = "#9ea4aa"; q.fillRect(0, 0, 128, 128); q.strokeStyle = "#d9dde1"; q.lineWidth = 3; for (let i = -128; i < 256; i += 10) { q.beginPath(); q.moveTo(i, 0); q.lineTo(i + 128, 128); q.stroke(); q.beginPath(); q.moveTo(i + 128, 0); q.lineTo(i, 128); q.stroke(); } });
  return <Estudio t={tt} cam={[0.2, 0.05, 1.05]} look={[0, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azulejo z={-0.3} />
    <group scale={S0(tt, 0.15)}><mesh geometry={g}><meshStandardMaterial map={trenza()} metalness={0.8} roughness={0.35} /></mesh>
      <Valvula p={[0, -0.45, 0]} ang={0} s={0.7} />
      <Hex p={[0, 0.44, 0]} r={0.035} L={0.05} rot={[0, 0, 0]} /></group>
    <mesh position={[0.02, -0.13, 0.06]} scale={SC(bulto) * 0.045}><sphereGeometry args={[1, 18, 14]} /><meshStandardMaterial map={trenza()} metalness={0.8} roughness={0.35} /></mesh>
    <Halo p={[0.02, -0.13, 0.12]} r={0.14 * bulto * lat} c={RED} o={0.55} />
    <group position={[0.15, 0.12, 0.08]} rotation={[0, -0.3, -0.1]}><Texto k={"an" + an} s={"AÑO " + an} p={[0, 0, 0]} w={0.22} h={0.09} bg="#f7f3ea" c={an >= 5 ? "#c0392b" : "#16130f"} f={150} /></group>
    <Caño a={[0.04, 0.12, 0.07]} b={[0.04, 0.12, 0.07]} r={0.003} />
  </Estudio>;
}}</Stage>;

// 19 · LA RONDANITA DE LA MANGUERA: el conector de bronce se abre en despiece; la rondana vieja aplastada y partida sale volando, la nueva entra y asienta; la gota deja de caer
const NRondana: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#12161b">{(tt) => {
  const abre = eio(tt, 0.3, 0.9) * (1 - eio(tt, 3.0, 3.5)), sale = eio(tt, 1.0, 1.8), entra = eio(tt, 1.9, 2.8), seca = eio(tt, 3.3, 3.6), gy = ((tt * 1.3) % 1);
  return <Estudio t={tt} cam={[0.25, 0.15, 0.9]} look={[0, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <group position={[0, 0.0, 0]} rotation={[0, 0, P2]} scale={S0(tt, 0.1)}>
      <group position={[0, 0.12 + 0.18 * abre, 0]}><mesh><cylinderGeometry args={[0.07, 0.07, 0.12, 6]} />{BRONCE()}</mesh><mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.05, 0.05, 0.4, 24]} /><meshStandardMaterial color="#2f7d3a" roughness={0.6} /></mesh></group>
      <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.05, 0.05, 0.22, 24]} />{BRONCE()}</mesh>
    </group>
    <group position={[lerp(0.04, 0.2, sale), lerp(0, 0.45, sale), 0.0]} rotation={[0, P2, 3 * sale]} scale={SC(1 - eio(tt, 1.7, 1.9))}><mesh scale={[1, 1, 0.6]}><torusGeometry args={[0.045, 0.014, 8, 32, 2 * P - 0.4]} /><meshStandardMaterial color="#2a2522" roughness={0.95} /></mesh></group>
    <group position={[lerp(0.04, 0.04, entra), lerp(-0.45, 0, entra), 0.0]} rotation={[0, P2, 0]} scale={SC(entra > 0 ? 1 : 0)}><mesh><torusGeometry args={[0.045, 0.016, 12, 32]} /><meshPhysicalMaterial color="#141414" roughness={0.2} clearcoat={1} /></mesh></group>
    {seca < 0.99 && <Gota p={[0.05, -0.08 - gy * 0.35, 0.03]} s={0.016 * (1 - seca)} />}
    <Halo p={[0.04, 0.0, 0.1]} r={0.2 * seca} c={VER} o={0.45} />
  </Estudio>;
}}</Stage>;

// 20 · LA CINTA DEL SILICÓN: la esquina de azulejo con dos tiras de cinta; el cordón blanco entra parejo entre ellas; las cintas se despegan en ángulo y queda la línea recta
const NSilicon: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const c1 = eio(tt, 0.3, 0.9), sil = eio(tt, 1.0, 2.3), q = eio(tt, 2.5, 3.5), ok = eio(tt, 3.4, 3.8);
  return <Estudio t={tt} cam={[0.1, 0.32, 0.55]} look={[0, 0.04, -0.3]} orbit={0.01} mesa={false} fit={false}>
    <Azulejo z={-0.3} />
    <mesh position={[0, 0, 0.1]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.6, 0.8]} /><meshStandardMaterial color="#f2f0ea" roughness={0.25} /></mesh>
    <group position={[0, 0.07 + 0.25 * q, -0.3 + 0.0005]} rotation={[-0.9 * q, 0, 0]} scale={[Math.max(0.0001, c1), 1, 1]}><mesh><planeGeometry args={[1.5, 0.05]} /><meshStandardMaterial color="#3d7fd6" side={THREE.DoubleSide} /></mesh></group>
    <group position={[0, 0.0015 + 0.12 * q, -0.23 + 0.25 * q]} rotation={[-P2 + 0.9 * q, 0, 0]} scale={[Math.max(0.0001, c1), 1, 1]}><mesh><planeGeometry args={[1.5, 0.05]} /><meshStandardMaterial color="#3d7fd6" side={THREE.DoubleSide} /></mesh></group>
    <mesh position={[lerp(-0.75, 0, sil), 0.012, -0.29]} rotation={[0, 0, P2]} scale={[1, Math.max(0.0001, sil), 1]}><cylinderGeometry args={[0.022, 0.022, 1.5, 16]} /><meshPhysicalMaterial color="#ffffff" roughness={0.15} clearcoat={1} /></mesh>
    <Halo p={[0, 0.03, -0.25]} r={0.5 * ok} c="#ffffff" o={0.35} />
  </Estudio>;
}}</Stage>;

// 21 · LA CAPA DE ACEITE: dos coladeras en corte con su sifón; pasan los días: la de la izquierda se evapora y suben las líneas de olor; la de la derecha, con la capa dorada encima, se queda llena
const NAceite: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const dias = eio(tt, 0.8, 3.3), aceite = eio(tt, 0.3, 0.8), olor = eio(tt, 2.4, 3.0), ok = eio(tt, 3.3, 3.7);
  const U = (x: number, oil: boolean) => { const lvl = oil ? 0.9 : lerp(0.9, 0.1, dias); return <group position={[x, 0, 0]} scale={S0(tt, 0.15)}>
    <mesh position={[0, 0.33, 0]}><boxGeometry args={[0.32, 0.02, 0.32]} />{M.cromo("#9aa0a6")}</mesh>
    {[-0.06, 0.06].map((xx, i) => <mesh key={i} position={[xx, 0.15, 0]}><cylinderGeometry args={[0.045, 0.045, 0.32, 24, 1, true]} />{VIDRIO(0.28)}</mesh>)}
    <mesh position={[0, -0.01, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.06, 0.045, 12, 24, P]} />{VIDRIO(0.28)}</mesh>
    {[-0.06, 0.06].map((xx, i) => <mesh key={"w" + i} position={[xx, 0.0 + 0.15 * lvl, 0]}><cylinderGeometry args={[0.04, 0.04, Math.max(0.001, 0.3 * lvl), 20]} />{AGUA(0.75, AZUL)}</mesh>)}
    {oil && aceite > 0.01 && [-0.06, 0.06].map((xx, i) => <mesh key={"o" + i} position={[xx, 0.3 * lvl + 0.008, 0]}><cylinderGeometry args={[0.041, 0.041, 0.016 * aceite, 20]} />{GLOW("#e8b84a", 0.9)}</mesh>)}
    {!oil && olor > 0.01 && Array.from({ length: 3 }, (_, i) => <mesh key={"s" + i} position={[-0.06 + i * 0.06, 0.45 + 0.08 * Math.sin(tt * 3 + i) + 0.1 * ((tt * 0.6 + i * 0.3) % 1), 0.02]}><torusGeometry args={[0.03, 0.004, 6, 16, P]} />{GLOW("#9bbf5a", 0.7 * olor)}</mesh>)}
    <Halo p={[0, 0.25, 0.12]} r={0.25 * (oil ? ok : olor)} c={oil ? VER : RED} o={0.35} />
  </group>; };
  return <Estudio t={tt} cam={[0, 0.3, 1.3]} look={[0, 0.22, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />{U(-0.3, false)}{U(0.3, true)}
    <Texto k={"dia" + Math.floor(1 + dias * 20)} s={"DÍA " + Math.floor(1 + dias * 20)} p={[0, 0.55, -0.05]} w={0.3} h={0.1} c="#f4f1e8" f={150} />
  </Estudio>;
}}</Stage>;

// 22 · LA MEDIA DE LA LAVADORA: la punta de la manguera de desagüe con la media amarrada; con cada mes la media se infla gris de pelusa, pelos y un clip
const NLavadora: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#12161b">{(tt) => {
  const k = eio(tt, 0.6, 3.4), mes = Math.max(1, Math.ceil(k * 3)), g = memo("p5a:lav", () => tuboGeo([[-0.6, 0.45, 0], [-0.3, 0.42, 0], [-0.05, 0.3, 0], [0.0, 0.1, 0]], 0.04, 50, 14));
  return <Estudio t={tt} cam={[0.1, 0.25, 1.0]} look={[0, 0.1, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <group scale={S0(tt, 0.15)}><mesh geometry={g}><meshStandardMaterial color="#6f7378" roughness={0.6} /></mesh>
      <mesh position={[0, 0.1, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.042, 0.008, 8, 24]} />{M.cromo()}</mesh>
      <mesh position={[0, 0.0 - 0.05 * k, 0]} scale={[1 + 0.6 * k, 1 + 1.4 * k, 1 + 0.6 * k]}><sphereGeometry args={[0.05, 24, 16]} /><meshStandardMaterial color={col("#d9b48c", "#8a8680", k)} roughness={1} transparent opacity={0.9} /></mesh>
      {Array.from({ length: 14 }, (_, i) => k > i / 14 && <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.08 * (1 + k), -0.05 * k + (rn(i, 2) - 0.5) * 0.12 * (1 + k), 0.06 + 0.04 * k]} rotation={[rn(i, 3) * 3, rn(i, 4) * 3, 0]}><boxGeometry args={[0.03, 0.003, 0.003]} /><meshBasicMaterial color="#3a3632" /></mesh>)}
      {k > 0.7 && <mesh position={[0.03, -0.12, 0.09]} rotation={[0, 0, 0.5]}><torusGeometry args={[0.012, 0.002, 6, 16]} />{M.cromo()}</mesh>}</group>
    <Texto k={"mes" + mes} s={"MES " + mes} p={[0.32, 0.35, 0]} w={0.26} h={0.1} bg="#f7f3ea" f={150} />
  </Estudio>;
}}</Stage>;

// 23 · LO QUE DON CHUY NUNCA HACÍA (items): tres cosas sobre la mesa de madera: el medidor con la ruedita, el papel seco bajo la unión, la rondana que regala
const NChuy: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#140f0a">{(tt) => {
  const a = Array.from({ length: 3 }, (_, i) => AT(h, i, 1.4, 0.6)), on = (i: number) => eio(tt, a[i], a[i] + 0.4);
  return <Estudio t={tt} cam={[0, 0.38, 0.95]} look={[0, 0.12, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#1a120b" /><Piso5 />
    <group position={[-0.42, 0, 0]} scale={SC(on(0)) * 1.5}><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.12, 0.12, 0.12, 32]} />{BRONCE()}</mesh>
      <mesh position={[0, 0.121, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.1, 32]} /><meshStandardMaterial color="#f4f1e8" /></mesh>
      <group position={[0, 0.123, 0]} rotation={[0, tt * 4, 0]}><mesh position={[0.03, 0, 0]}><boxGeometry args={[0.06, 0.004, 0.012]} />{GLOW(RED)}</mesh></group></group>
    <group position={[0, 0, 0]} scale={SC(on(1)) * 1.5}><Caño a={[-0.15, 0.12, 0]} b={[0.15, 0.12, 0]} r={0.025} mat={PVCB()} /><mesh position={[0, 0.12, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.032, 0.032, 0.07, 24]} />{PVCB()}</mesh>
      <mesh position={[0, 0.07, 0.0]} rotation={[-P2 + 0.2, 0, 0]}><planeGeometry args={[0.12, 0.08]} /><meshStandardMaterial color="#ffffff" roughness={1} side={THREE.DoubleSide} /></mesh>
      <Palomita p={[0, 0.25, 0.05]} s={0.18} k={eio(tt, a[1] + 0.4, a[1] + 0.8)} /></group>
    <group position={[0.42, 0.04, 0]} scale={SC(on(2)) * 1.6}><mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.05, 0.016, 12, 32]} /><meshStandardMaterial color="#1a1a1a" roughness={0.5} /></mesh>
      <Halo p={[0, 0.05, 0.08]} r={0.18} c="#ffcf5a" o={0.5} /></group>
    <Halo p={[0.05, 0.45, -0.2]} r={0.8} c="#ffb860" o={0.18} />
  </Estudio>;
}}</Stage>;

// 24 · EL GOLPE DE ARIETE: el agua corre por el tubo de vidrio; la llave se cierra de golpe y una ola roja rebota hacia atrás y sacude el tubo;
// entra el amortiguador: la segunda ola se mete en su colchón de aire, que se aprieta, y el tubo queda quieto
const NAriete: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#10151a">{(tt) => {
  const cierra = eio(tt, 0.9, 1.0), ola1 = cl((tt - 1.0) / 0.9), am = eio(tt, 2.0, 2.4), ola2 = cl((tt - 2.6) / 0.6), cush = Math.sin(cl((tt - 3.1) / 0.6) * P), sh = shake(tt, 1.0, 1.9, 0.015);
  return <Estudio t={tt} cam={[0.15, 0.22, 1.0]} look={[0.15, 0.08, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <group position={[0, sh, 0]}>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.06, 0.06, 1.4, 32, 1, true]} />{VIDRIO(0.3)}</mesh>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.05, 1.4, 20]} />{AGUA(0.55, AZUL)}</mesh>
      {tt < 1.0 && Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-0.7 + ((tt * 0.8 + i / 8) % 1) * 1.4, 0.0, 0.06]}><boxGeometry args={[0.06, 0.006, 0.004]} />{GLOW("#cfe8ff", 0.8)}</mesh>)}
      {ola1 > 0 && ola1 < 1 && <mesh position={[0.62 - ola1 * 1.3, 0, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.065, 0.012, 8, 32]} />{GLOW(RED, 1 - ola1 * 0.5)}</mesh>}
      {ola2 > 0 && ola2 < 1 && <mesh position={[0.62 - ola2 * 0.3, 0, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.065, 0.012, 8, 32]} />{GLOW(RED, 0.8)}</mesh>}
      <Valvula p={[0.66, 0, 0]} ang={P2 * cierra} s={0.9} />
      <group position={[0.32, 0.06, 0]} scale={SC(am)}>
        <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.04, 0.04, 0.22, 24, 1, true]} />{VIDRIO(0.35)}</mesh>
        <mesh position={[0, 0.17 - 0.05 * cush, 0]}><cylinderGeometry args={[0.036, 0.036, Math.max(0.01, 0.1 + 0.08 * cush), 20]} />{AGUA(0.6, AZUL)}</mesh>
        <mesh position={[0, 0.2 + 0.0, 0]} scale={[1, 1 - 0.5 * cush, 1]}><sphereGeometry args={[0.034, 16, 12]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.6} roughness={0} /></mesh>
        <mesh position={[0, 0.24, 0]}><cylinderGeometry args={[0.042, 0.042, 0.02, 24]} />{M.cromo()}</mesh></group>
    </group>
    <Halo p={[0.32, 0.25, 0.08]} r={0.2 * cush} c={VER} o={0.45} />
  </Estudio>;
}}</Stage>;

// 25 · EL AIRE SALE POR ARRIBA: la casa en corte con su columna de agua y tres llaves (patio, planta baja, planta alta); las burbujas suben;
// se abre primero la del patio (sale pareja), después la de abajo y al final la de arriba escupe la última burbuja
const NAire: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#10151a">{(tt) => {
  const o = [eio(tt, 0.5, 0.8), eio(tt, 1.6, 1.9), eio(tt, 2.7, 3.0)], ys = [-0.35, 0.05, 0.45], sube = eio(tt, 0.8, 3.4);
  return <Estudio t={tt} cam={[0.15, 0.1, 1.5]} look={[0.1, 0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    {[-0.15, 0.25, 0.65].map((y, i) => <mesh key={i} position={[0.2, y, -0.05]}><boxGeometry args={[1.0, 0.025, 0.3]} /><meshStandardMaterial color="#d8c9ac" roughness={0.9} /></mesh>)}
    <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.035, 0.035, 0.95, 24, 1, true]} />{VIDRIO(0.3)}</mesh>
    {ys.map((y, i) => <group key={i}><Caño a={[0, y, 0]} b={[0.35, y, 0]} r={0.03} mat={VIDRIO(0.3)} /><Valvula p={[0.4, y, 0]} ang={P2 * (1 - o[i])} s={0.55} />
      <Chorro a={[0.45, y - 0.02, 0]} t={tt} k={o[i] * (tt > [0.5, 1.6, 2.7][i] + 0.6 || i === 0 ? 1 : 0.3)} v={[0.4, 0, 0]} n={10} r={0.009} /></group>)}
    {Array.from({ length: 7 }, (_, i) => { const y = lerp(-0.4, 0.6, cl(sube * 1.1 - i * 0.12)); return y < 0.58 && <Burbuja5 key={i} p={[0, y, 0.0]} r={0.02} />; })}
    <Flecha p={[-0.15, 0.1, 0]} k={eio(tt, 0.8, 1.2)} c="#cfe8ff" s={1.2} />
    <Halo p={[0.4, ys[2], 0.08]} r={0.18 * eio(tt, 3.2, 3.6)} c={VER} o={0.45} />
  </Estudio>;
}}</Stage>;

// 26 · EL TUBO CONGELADO: el tubo de afuera cubierto de escarcha desde la llave hasta la pared; la secadora avanza de la llave a la pared con su aire tibio,
// la escarcha se derrite detrás de ella y la llave (abierta desde antes) empieza a gotear
const escarcha = () => ctex("p5a:esc", 256, 256, (g) => { g.fillStyle = "#e8f4fb"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(255,255,255,${0.4 + 0.5 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 2, 2); } });
const NCongelado: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#0f141a">{(tt) => {
  const s = eio(tt, 0.6, 3.4), x = lerp(-0.45, 0.45, s), gy = (tt * 1.5) % 1, gota = eio(tt, 1.6, 2.0);
  return <Estudio t={tt} cam={[0.1, 0.25, 1.2]} look={[0, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0.6, 0.1, 0]}><boxGeometry args={[0.1, 1.0, 0.6]} /><meshStandardMaterial color="#b8a888" roughness={0.9} /></mesh>
    <Fondo z={-0.6} c="#1a2430" />
    <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.04, 0.04, 1.1, 24]} />{COBRE()}</mesh>
    <mesh position={[(x + 0.55) / 2, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.05, Math.max(0.001, 0.55 - x), 24]} /><meshStandardMaterial map={escarcha()} roughness={0.95} /></mesh>
    <Caño a={[-0.55, 0, 0]} b={[-0.55, -0.12, 0]} r={0.025} mat={M.cromo()} />
    {gota > 0.01 && <Gota p={[-0.55, -0.15 - gy * 0.3, 0]} s={0.014} />}
    <group position={[x, 0.2, 0.05]} rotation={[0, 0, -0.3]} scale={S0(tt, 0.4)}>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.06, 0.18, 24]} /><meshStandardMaterial color="#2c4a8a" roughness={0.4} /></mesh>
      <mesh position={[-0.05, -0.1, 0]}><boxGeometry args={[0.04, 0.16, 0.04]} /><meshStandardMaterial color="#2c4a8a" roughness={0.4} /></mesh></group>
    <Halo p={[x, 0.02, 0.08]} r={0.22} c="#ff9a4a" o={0.5 * eio(tt, 0.5, 0.8)} />
  </Estudio>;
}}</Stage>;

// 27 · EL PARCHE DE LA CÁMARA DE BICI: el tubo rajado escupe un chorro; la tira de hule negro da tres vueltas encimadas, las dos abrazaderas se cierran y el chorro se apaga
const NParche: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#10151a">{(tt) => {
  const env = eio(tt, 0.9, 2.2), ab = eio(tt, 2.3, 2.9), ap = eio(tt, 2.9, 3.5), chorro = 1 - eio(tt, 1.6, 3.4), ok = eio(tt, 3.4, 3.8);
  return <Estudio t={tt} cam={[0.1, 0.2, 1.05]} look={[0, 0.03, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.05, 1.2, 32]} />{PVCB()}</mesh>
    <mesh position={[0, 0.05, 0.0]}><boxGeometry args={[0.1, 0.004, 0.012]} /><meshBasicMaterial color="#111" /></mesh>
    <Chorro a={[0, 0.06, 0]} t={tt} k={chorro * 1.4} v={[0.1, 1.5, 0.3]} n={22} r={0.012} />
    {env > 0.01 && <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.054 + 0.006 * env, 0.054 + 0.006 * env, 0.24, 32, 1, true, 0, 2 * P * Math.max(0.01, env)]} /><meshStandardMaterial color="#141414" roughness={0.6} side={THREE.DoubleSide} /></mesh>}
    {[-0.08, 0.08].map((x, i) => <group key={i} position={[x, 0, 0]} scale={SC(ab)}><mesh rotation={[0, P2, 0]} scale={1 - 0.08 * ap}><torusGeometry args={[0.075, 0.008, 8, 36]} />{M.cromo()}</mesh>
      <mesh position={[0, 0.08 - 0.006 * ap, 0]}><boxGeometry args={[0.02, 0.025, 0.03]} />{M.cromo()}</mesh></group>)}
    <Halo p={[0, 0.0, 0.1]} r={0.3 * ok} c={VER} o={0.45} />
  </Estudio>;
}}</Stage>;

// 28 · EL REPASO (items): una repisa con seis piezas grandes (aspiradora · linterna · unión con su raya · llave de perico · gota de aceite · tubo con parche);
// con cada grupo la suya salta con rebote y se enciende verde
const NRecap: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const a = Array.from({ length: 6 }, (_, i) => AT(h, i, 0.55, 0.5));
  return <Estudio t={tt} cam={[0, 0.4, 1.3]} look={[0, 0.3, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#12171c" />
    {[0, 0.4].map((yy, r) => <mesh key={r} position={[0, yy - 0.02, -0.02]} receiveShadow castShadow><boxGeometry args={[1.5, 0.035, 0.36]} /><meshStandardMaterial map={ruido("madera", "#6a4a2c", ["#4a321c", "#7e5a38", "#5a3e24"], 4000, 6)} roughness={0.8} /></mesh>)}
    {Array.from({ length: 6 }, (_, i) => { const x = -0.45 + (i % 3) * 0.45, row = i < 3 ? 0.4 : 0, dq = cl((tt - a[i] + 0.35) / 0.35), on = eio(tt, a[i], a[i] + 0.3), b = dq >= 1 ? bote(tt, a[i]) : 0, y = row + 0.45 * (1 - dq * dq) + 0.05 * b;
      if (dq <= 0) return null;
      return <group key={i} position={[x, y, 0]} scale={1.2}>
        {i === 0 && <><mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.07, 0.08, 0.16, 24]} /><meshStandardMaterial color="#e2b62c" roughness={0.45} /></mesh><Caño a={[0.05, 0.14, 0]} b={[0.14, 0.2, 0]} r={0.015} mat={<meshStandardMaterial color="#1f2124" />} /></>}
        {i === 1 && <group position={[0, 0.05, 0]} scale={0.8}><Linterna p={[0, 0, 0]} rot={[0, 0, P2]} on={1} /></group>}
        {i === 2 && <><Caño a={[-0.12, 0.05, 0]} b={[0.12, 0.05, 0]} r={0.03} mat={PVCB()} /><mesh position={[0.03, 0.05, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.038, 0.038, 0.08, 24]} />{PVCB()}</mesh><mesh position={[0.0, 0.05, 0.039]}><boxGeometry args={[0.08, 0.005, 0.003]} />{GLOW(VER)}</mesh></>}
        {i === 3 && <Perico p={[0.12, 0.02, 0]} rot={[-P2, 0, 0.25]} s={0.55} />}
        {i === 4 && <Gota p={[0, 0.07, 0]} s={0.05} c="#e8b84a" />}
        {i === 5 && <><Caño a={[-0.12, 0.05, 0]} b={[0.12, 0.05, 0]} r={0.025} mat={PVCB()} /><mesh position={[0, 0.05, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.032, 0.032, 0.1, 20]} /><meshStandardMaterial color="#141414" /></mesh></>}
        <Halo p={[0, 0.1, 0.12]} r={0.17 * on} c={VER} o={0.55} />
      </group>; })}
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  n_contador: NContador, n_aspira: NAspira, n_media: NMedia, n_iman: NIman, n_cinta: NCinta, n_bisel: NBisel, n_raya: NRaya, n_curado: NCurado,
  n_paredes: NParedes, n_hilo: NHilo, n_trapo: NTrapo, n_contra: NContra, n_stillson: NStillson, n_mano: NMano, n_masilla: NMasilla, n_errores: NErrores,
  n_vaselina: NVaselina, n_flexible: NFlexible, n_rondana: NRondana, n_silicon: NSilicon, n_aceite: NAceite, n_lavadora: NLavadora, n_chuy: NChuy,
  n_ariete: NAriete, n_aire: NAire, n_congelado: NCongelado, n_parche: NParche, n_recap: NRecap,
};
