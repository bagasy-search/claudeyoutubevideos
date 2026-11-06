// heroes plo5nb r1 · el ánodo de sacrificio: el secreto de 30 minutos del calentador
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, phys, RED, Stage, Tag, VER } from "./ckit";
import { ctex, Estudio, M, papel, RBox, rn } from "./estudio3d";
import { AGUA, Linterna, Reloj, Termometro, tuboGeo } from "./kitplo";

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
const ruido = (k: string, base: string, spots: string[], n = 3000, sz = 4) => ctex("p4c5:" + k, 512, 512, (g) => { g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < n; i++) { g.fillStyle = spots[i % spots.length]; g.globalAlpha = 0.2 + 0.45 * rn(i, 7); const r = 1 + rn(i, 4) * sz; g.beginPath(); g.arc(rn(i, 2) * 512, rn(i, 3) * 512, r, 0, 2 * P); g.fill(); } g.globalAlpha = 1; });
const sarroTex = () => ruido("sarro", SARRO, ["#f6f1e2", "#d6ccb2", "#c9bc9c", "#fffaf0"], 6000, 3);
const oxidoTex = () => ruido("oxido", OXIDO, ["#7a3a1c", "#c46a34", "#5a2a14", "#d08a4a"], 6000, 4);
const sombraTex = () => ctex("p4c5:sombra", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(0,0,0,0.8)"); gr.addColorStop(0.45, "rgba(0,0,0,0.4)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const halo = () => ctex("p4c5:halo", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
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
const txtTex = (k: string, s: string, o: { w?: number; h?: number; bg?: string; c?: string; f?: number } = {}) => ctex("p5c:t" + k, o.w ?? 512, o.h ?? 256, (g) => {
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
const tablasTex = () => ctex("p5c:tablas", 1024, 512, (g) => { const cs = ["#7a5434", "#6b4729", "#86603c", "#5f3f24"]; for (let i = 0; i < 8; i++) { g.fillStyle = cs[i % 4]; g.fillRect(0, i * 64, 1024, 64); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(0, i * 64, 1024, 3); for (let k = 0; k < 30; k++) { g.fillStyle = `rgba(40,25,12,${0.08 + 0.1 * rn(i * 31 + k, 2)})`; g.fillRect(0, i * 64 + 6 + rn(i * 31 + k, 3) * 54, 1024, 1 + rn(k, 4) * 2); } g.fillStyle = "rgba(0,0,0,.4)"; g.fillRect((i * 389) % 1024, i * 64, 3, 64); } });
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


// ================= plo5nc · LA UNIÓN DE PVC SIN ROSCA NI PEGAMENTO · 23 componentes únicos 3D =================
// Regla: el Stage comprime el tiempo del hijo a ≤4,4 s → toda línea de tiempo cierra antes de tt≈4,2. Cámara cerca, todo apoyado, sin rótulos.
const CAL = "#e8894a", CAFE = "#7a4a22";
// tubo acostado en X desde x0 hasta x1
const TX: React.FC<{ x0: number; x1: number; y?: number; z?: number; r?: number; c?: string; e?: number; open?: boolean }> = ({ x0, x1, y = 0, z = 0, r = 0.05, c = "#eceae2", e = 0, open }) =>
  <mesh position={[(x0 + x1) / 2, y, z]} rotation={[0, 0, P2]}><cylinderGeometry args={[r, r, Math.max(0.001, x1 - x0), 36, 1, !!open]} /><meshPhysicalMaterial color={c} emissive={c} emissiveIntensity={e} roughness={0.35} clearcoat={0.4} side={THREE.DoubleSide} /></mesh>;
const Tapa: React.FC<{ x: number; y?: number; r?: number; ri?: number; c?: string }> = ({ x, y = 0, r = 0.05, ri = 0.042, c = "#f4f2ea" }) =>
  <mesh position={[x + 0.0005, y, 0]} rotation={[0, P2, 0]}><ringGeometry args={[ri, r, 36]} /><meshStandardMaterial color={c} side={THREE.DoubleSide} /></mesh>;
// llama suave (≤2 Hz): tres conos aditivos que respiran lento
const Llama: React.FC<{ p: V3; t: number; k: number; s?: number }> = ({ p, t, k, s = 1 }) => k <= 0.01 ? null : <group position={p} scale={s * k}>
  {[0, 1, 2].map((i) => <mesh key={i} position={[(i - 1) * 0.025, 0.05 + 0.01 * Math.sin(t * 2 * P * 1.5 + i), 0]} scale={[1, 1 + 0.12 * Math.sin(t * 2 * P * 1.2 + i * 2), 1]}><coneGeometry args={[0.03 - 0.006 * Math.abs(i - 1), 0.13 - 0.03 * Math.abs(i - 1), 16]} /><meshBasicMaterial color={i === 1 ? "#ffd27a" : "#ff8a2a"} transparent opacity={0.85} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>)}
  <Halo p={[0, 0.08, 0.02]} r={0.16} c="#ff9a40" o={0.45} /></group>;
// humo/vapor propio: esferas que suben y se abren
const Humo: React.FC<{ p: V3; t: number; k: number; n?: number; c?: string; h?: number }> = ({ p, t, k, n = 10, c = "#9a9a9a", h = 0.45 }) => k <= 0.01 ? null : <group position={p}>
  {Array.from({ length: n }, (_, i) => { const q = (t * 0.35 + i / n) % 1; return <mesh key={i} position={[0.05 * Math.sin(i * 2.3 + t * 0.8) * (0.3 + q), q * h, 0.03 * Math.cos(i * 1.7)]} scale={0.02 + 0.06 * q}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color={c} transparent opacity={0.35 * k * (1 - q)} depthWrite={false} /></mesh>; })}</group>;
const Olla: React.FC<{ p: V3; t: number; lvl?: number; hierve?: number; s?: number }> = ({ p, t, lvl = 0.7, hierve = 1, s = 1 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.2, 0.18, 0.24, 40, 1, true]} /><meshStandardMaterial color="#9aa0a6" metalness={0.85} roughness={0.35} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.001, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.18, 40]} /><meshStandardMaterial color="#6a6e72" metalness={0.7} /></mesh>
  {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.23, 0.2, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.03, 0.008, 8, 16, P]} />{M.hierro()}</mesh>)}
  <mesh position={[0, 0.24 * lvl / 2, 0]}><cylinderGeometry args={[0.192, 0.18, 0.24 * lvl, 40]} />{LIQ("#7fb6d8", 0.75)}</mesh>
  <Burbujas p={[0, 0.03, 0]} t={t} k={hierve} w={0.3} hh={0.24 * lvl - 0.03} n={24} s={0.01} />
  <Humo p={[0, 0.24, 0]} t={t} k={hierve * 0.6} n={8} c="#e8eef2" h={0.4} /></group>;
const Pistola: React.FC<{ p: V3; rot?: V3; on?: number }> = ({ p, rot, on = 1 }) => <group position={p} rotation={rot}>
  <RBox s={[0.26, 0.09, 0.09]} r={0.03} p={[-0.1, 0, 0]}><meshStandardMaterial color="#d7262a" roughness={0.5} /></RBox>
  <RBox s={[0.07, 0.18, 0.07]} r={0.025} p={[-0.16, -0.12, 0]}><meshStandardMaterial color="#222" roughness={0.6} /></RBox>
  <mesh position={[0.07, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.032, 0.04, 0.12, 24]} />{M.cromo("#b8bcc2")}</mesh>
  <Halo p={[0.16, 0, 0.02]} r={0.1 * on} c={CAL} o={0.6} /></group>;
// cople de compresión en X: cuerpo central + tuercas (sep = cuánto se separan) + anillos de hule
const Cople: React.FC<{ p: V3; sep?: number; s?: number; ring?: number }> = ({ p, sep = 0, s = 1, ring = 1 }) => <group position={p} scale={s}>
  <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.07, 0.07, 0.16, 36]} /><meshPhysicalMaterial color="#dcdad2" roughness={0.4} clearcoat={0.3} /></mesh>
  {[-1, 1].map((sd) => <group key={sd} position={[sd * (0.12 + 0.3 * sep), 0, 0]}>
    <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.085, 0.085, 0.08, 8]} /><meshStandardMaterial color="#3b5ea8" roughness={0.45} /></mesh>
    <group position={[-sd * 0.15 * sep, 0, 0]} rotation={[0, P2, 0]} scale={SC(ring)}><mesh><torusGeometry args={[0.055, 0.012, 12, 36]} /><meshStandardMaterial color="#1c1c1c" roughness={0.7} /></mesh></group></group>)}</group>;
const mallaTex = () => ctex("p5c:malla", 128, 128, (g) => { g.fillStyle = "#777"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "#ddd"; g.lineWidth = 2; for (let i = 0; i < 128; i += 8) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 128); g.moveTo(0, i); g.lineTo(128, i); g.stroke(); } });
const reglaTex = () => ctex("p5c:regla", 256, 64, (g) => { g.fillStyle = "#d9b26a"; g.fillRect(0, 0, 256, 64); g.fillStyle = "#3a2a14"; for (let i = 0; i < 26; i++) g.fillRect(i * 10, 0, 2, i % 5 ? 14 : 28); });
const diarioTex = () => ctex("p5c:diario", 512, 384, (q) => { q.fillStyle = "#e9e4d6"; q.fillRect(0, 0, 512, 384); q.fillStyle = "#3a3a3a"; q.fillRect(20, 18, 472, 34); for (let r = 0; r < 18; r++) for (let c = 0; c < 3; c++) { q.fillStyle = "rgba(60,60,60,.55)"; q.fillRect(20 + c * 162, 70 + r * 16, 140 * (0.7 + 0.3 * rn(r * 3 + c, 1)), 6); } });


// ================= plo5nb · EL SECRETO DE 30 MINUTOS DEL CALENTADOR (ÁNODO DE SACRIFICIO) · 23 componentes únicos 3D =================
// Regla: el Stage comprime el tiempo del hijo a ≤4,4 s → toda línea de tiempo cierra antes de tt≈4,2. Cámara cerca, todo apoyado, sin rótulos.
const MG = "#a7abae", ROJO = "#d23a2a";
// calentador de depósito propio: color del tanque, rayos X (x) con nivel de agua, patas para ver el fondo
const Tq: React.FC<{ p: V3; s?: number; c?: string; x?: number; lvl?: number; legs?: boolean; rot?: V3 }> = ({ p, s = 1, c = "#eeeeea", x = 0, lvl = 0, legs, rot }) => <group position={p} scale={s} rotation={rot}>
  <group position={[0, legs ? 0.1 : 0, 0]}>
    <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.2, 0.2, 0.7, 40, 1, x > 0.5]} />{x > 0.5 ? VIDRIO(0.25) : <meshStandardMaterial color={c} roughness={0.35} />}</mesh>
    <mesh position={[0, 0.71, 0]}><cylinderGeometry args={[0.16, 0.2, 0.04, 40]} /><meshStandardMaterial color="#d9d9d4" roughness={0.4} /></mesh>
    {x > 0.5 && lvl > 0.01 && <mesh position={[0, 0.35 * lvl + 0.003, 0]}><cylinderGeometry args={[0.19, 0.19, 0.7 * lvl, 40]} />{LIQ(AZUL, 0.55)}</mesh>}
    <Caño a={[-0.09, 0.72, 0]} b={[-0.09, 0.95, 0]} r={0.017} /><Caño a={[0.09, 0.72, 0]} b={[0.09, 0.95, 0]} r={0.017} /></group>
  {legs && [0, 1, 2].map((i) => <Caño key={i} a={[0.14 * Math.cos(i * 2.1), 0, 0.14 * Math.sin(i * 2.1)]} b={[0.14 * Math.cos(i * 2.1), 0.1, 0.14 * Math.sin(i * 2.1)]} r={0.01} mat={GALV()} />)}</group>;
// el ánodo: cabeza hexagonal arriba, tapón roscado, alambre de acero al centro y la funda de magnesio en 8 tramos (w 1 = sano → 0 = alambre pelón)
const Anodo: React.FC<{ p: V3; L?: number; w?: number; s?: number; rot?: V3; c?: string }> = ({ p, L = 0.6, w = 1, s = 1, rot, c = MG }) => <group position={p} rotation={rot} scale={s}>
  <Hex p={[0, L + 0.03, 0]} r={0.034} L={0.04} rot={[0, 0, 0]} />
  <mesh position={[0, L, 0]}><cylinderGeometry args={[0.028, 0.028, 0.03, 24]} /><meshStandardMaterial color="#c9b58a" metalness={0.8} roughness={0.35} /></mesh>
  <mesh position={[0, L / 2, 0]}><cylinderGeometry args={[0.005, 0.005, L, 8]} />{GALV()}</mesh>
  {Array.from({ length: 8 }, (_, i) => { const loc = Math.min(1, w * (0.8 + 0.45 * rn(i, 3)) - (w < 0.75 ? (1 - w) * 0.6 * rn(i, 5) : 0)), r = 0.026 * loc;
    return r < 0.0065 ? null : <mesh key={i} position={[0, (i + 0.5) * L / 8, 0]}><cylinderGeometry args={[r, r * (0.88 + 0.24 * rn(i, 7)), L / 8 * 0.97, 20]} /><meshStandardMaterial map={ruido("b5mg" + c, c, ["#8d9194", "#c3c6c8", "#7a7d80"], 3000, 3)} roughness={0.8} /></mesh>; })}</group>;
const Num: React.FC<{ n: number | string; p: V3; s?: number; c?: string; o?: number }> = ({ n, p, s = 0.16, c = "#f4f1e8", o = 1 }) => <Texto k={"b5n" + n + c} s={String(n)} p={p} w={s * 2} h={s} c={c} f={200} o={o} />;
const Particula: React.FC<{ p: V3; r?: number; c?: string }> = ({ p, r = 0.014, c = "#8fd0ff" }) => <mesh position={p} scale={r}><sphereGeometry args={[1, 10, 8]} />{GLOW(c, 0.9)}</mesh>;

// 1 · NUEVE CONTRA VEINTIDÓS: dos calentadores iguales; los contadores de años corren juntos; el de la izquierda se clava en 9, se pone rojo y suelta su charco; el otro sigue hasta 22 en verde
const BDos: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#10151b">{(tt) => {
  const yl = Math.round(lerp(0, 9, eio(tt, 0.4, 1.9))), yr = Math.round(lerp(0, 22, eio(tt, 0.4, 3.4))), mu = eio(tt, 1.9, 2.4);
  return <Estudio t={tt} cam={[0, 0.62, 1.75]} look={[0, 0.42, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <Tq p={[-0.38, 0, 0]} s={0.85 * S0(tt, 0.1)} c={col("#eeeeea", "#a5532a", mu * 0.6)} /><Tq p={[0.38, 0, 0]} s={0.85 * S0(tt, 0.15)} />
    <Num n={yl} p={[-0.38, 0.95, 0.1]} c={mu > 0.5 ? "#ff8a7a" : "#f4f1e8"} /><Num n={yr} p={[0.38, 0.95, 0.1]} c={tt > 3.4 ? "#8ef0a0" : "#f4f1e8"} />
    <mesh position={[-0.38, 0.004, 0.22]} rotation={[-P2, 0, 0]} scale={SC(mu)}><circleGeometry args={[0.26, 32]} />{AGUA(0.55, "#b07a4a")}</mesh>
    <Halo p={[-0.38, 0.4, 0.2]} r={0.4 * mu} c={ROJO} o={0.35} /><Halo p={[0.38, 0.4, 0.2]} r={0.45 * eio(tt, 3.2, 3.7)} c={VER} o={0.35} />
  </Estudio>;
}}</Stage>;

// 2 · LA PIEZA DE MEDIA HORA: la varilla vieja sube y sale del calentador; la nueva baja y entra; alrededor, un reloj de luz llena sólo media vuelta
const BReloj30: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#11151a">{(tt) => {
  const sale = eio(tt, 0.5, 1.6), entra = eio(tt, 1.9, 3.0), arc = eio(tt, 0.4, 3.2);
  return <Estudio t={tt} cam={[0.0, 0.75, 1.7]} look={[0, 0.6, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <Tq p={[0, 0, 0]} s={0.9} x={1} lvl={0.85} />
    <group position={[0, 0, 0]}>{sale < 0.999 && <Anodo p={[0.0 + 0.5 * eio(tt, 1.4, 1.9), 0.06 + 0.7 * sale, 0]} L={0.58} w={0.2} s={1} />}
      <Anodo p={[0, lerp(0.85, 0.06, entra), 0]} L={0.58} w={1} s={SC(eio(tt, 1.7, 1.9))} /></group>
    <Arco p={[0, 0.62, -0.3]} r={0.55} a0={P2} a={-2 * P} c="#ffffff" o={0.08} w={0.025} />
    <Arco p={[0, 0.62, -0.3]} r={0.55} a0={P2} a={-P * arc} c={VER} o={0.9} w={0.025} />
  </Estudio>;
}}</Stage>;

// 3 · EL DOBLE: dos líneas de vida del tanque; la de arriba (sin cambiar nada) crece y se corta en 10 con cruz; la de abajo recibe un ánodo nuevo cada 3 años y llega a 20
const BDoble: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#10141a">{(tt) => {
  const a = eio(tt, 0.4, 1.8), b = eio(tt, 0.6, 3.6), X0 = -0.7, U = 0.065;
  return <Estudio t={tt} cam={[0, 0.5, 1.6]} look={[0, 0.32, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} /><Piso5 />
    <RBox s={[Math.max(0.001, 10 * U * a), 0.06, 0.06]} r={0.02} p={[X0 + 5 * U * a, 0.55, 0]}><meshStandardMaterial color={col("#cfd3d6", ROJO, eio(tt, 1.8, 2.1))} roughness={0.5} /></RBox>
    <Cruz p={[X0 + 10 * U + 0.06, 0.55, 0.05]} s={0.12} k={eio(tt, 1.8, 2.1)} />
    <RBox s={[Math.max(0.001, 20 * U * b), 0.06, 0.06]} r={0.02} p={[X0 + 10 * U * b, 0.25, 0]}><meshStandardMaterial color={VER} roughness={0.5} emissive={VER} emissiveIntensity={0.25} /></RBox>
    {[3, 6, 9, 12, 15, 18].map((y, i) => { const on = cl((20 * b - y) * 2); return <group key={y} position={[X0 + y * U, 0.31, 0]} scale={SC(on) * 0.3}><Anodo p={[0, 0, 0]} L={0.5} /></group>; })}
    <Num n={10} p={[X0 + 10 * U, 0.68, 0]} s={0.09} o={a} /><Num n={20} p={[X0 + 20 * U, 0.4, 0]} s={0.09} c="#8ef0a0" o={eio(tt, 3.4, 3.7)} />
  </Estudio>;
}}</Stage>;

// 4 · LO QUE SE CAMBIA Y LO QUE NO: quemador, piloto y termostato salen del calentador hacia la derecha con palomita; el tanque se queda y se pone rojo
const BTanque: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#11151a">{(tt) => {
  const s = [0, 1, 2].map((i) => eio(tt, 0.5 + i * 0.6, 1.1 + i * 0.6)), rojo = eio(tt, 2.6, 3.3);
  return <Estudio t={tt} cam={[0.15, 0.6, 1.7]} look={[0.15, 0.38, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <Tq p={[-0.3, 0, 0]} s={0.9} c={col("#eeeeea", ROJO, rojo)} />
    <Halo p={[-0.3, 0.4, 0.2]} r={0.5 * rojo} c={ROJO} o={0.35} />
    <group position={[lerp(-0.3, 0.3, s[0]), lerp(0.08, 0.15, s[0]), lerp(0.18, 0.15, s[0])]}><RBox s={[0.16, 0.05, 0.12]} r={0.01}>{GALV()}</RBox><Llama p={[0, 0.02, 0]} t={tt} k={0.5} s={0.6} /></group>
    <group position={[lerp(-0.3, 0.55, s[1]), lerp(0.12, 0.42, s[1]), 0.18]}><Caño a={[0, -0.08, 0]} b={[0, 0.08, 0]} r={0.008} mat={COBRE()} /><Llama p={[0, 0.08, 0]} t={tt} k={0.35} s={0.5} /></group>
    <group position={[lerp(-0.3, 0.8, s[2]), lerp(0.22, 0.15, s[2]), 0.18]}><mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.03, 32]} /><meshStandardMaterial color="#c4281c" roughness={0.45} /></mesh></group>
    {[0, 1, 2].map((i) => <Palomita key={i} p={[[0.3, 0.55, 0.8][i], [0.32, 0.62, 0.32][i], 0.2]} s={0.12} k={eio(tt, 1.1 + i * 0.6, 1.4 + i * 0.6)} />)}
  </Estudio>;
}}</Stage>;

// 5 · EL ESMALTE SE RAJA: un trozo de pared del tanque (acero gris + esmalte azul brillante); el termómetro sube y baja tres veces y en cada vuelta se dibuja una grieta; al final asoma el óxido
const BVidrio: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#0f1418">{(tt) => {
  const ciclo = 0.5 + 0.5 * Math.sin((tt - 0.3) * 2 * P / 1.1 - P2), ox = eio(tt, 3.3, 4.0);
  const G = [[-0.25, 0.04, 0.4, 0.3], [0.05, -0.06, 0.45, -0.4], [0.2, 0.08, 0.35, 0.9]];
  return <Estudio t={tt} cam={[0, 0.85, 0.95]} look={[0, 0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.9} />
    <group scale={S0(tt, 0.1)}>
      <RBox s={[1.0, 0.1, 0.5]} r={0.01} p={[0, -0.06, 0]}>{GALV()}</RBox>
      <mesh position={[0, 0.0, 0]}><boxGeometry args={[1.0, 0.02, 0.5]} /><meshPhysicalMaterial color="#5f86b8" roughness={0.3} clearcoat={0.4} /></mesh>
      {G.map(([x, z, L, r], i) => { const k = eio(tt, 0.9 + i * 1.1, 1.3 + i * 1.1); return k <= 0.01 ? null : <mesh key={i} position={[x, 0.0115, z]} rotation={[0, r, 0]}><boxGeometry args={[L * k, 0.002, 0.006]} /><meshBasicMaterial color="#0d1218" /></mesh>; })}
      {G.map(([x, z], i) => <mesh key={"o" + i} position={[x, 0.012, z]} rotation={[-P2, 0, 0]} scale={SC(ox)}><circleGeometry args={[0.05, 20]} /><meshStandardMaterial map={oxidoTex()} roughness={0.95} /></mesh>)}</group>
    <Termometro p={[0.62, 0.05, 0]} s={0.7} v={ciclo} />
  </Estudio>;
}}</Stage>;

// 6 · NO AVISA: la lucecita de aviso del calentador se queda apagada todo el tiempo; abajo se forma una gota, cae y el charco se abre
const BGota: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#10151a">{(tt) => {
  const g = eio(tt, 0.6, 1.6), cae = eio(tt, 1.6, 2.0), ch = eio(tt, 2.0, 3.8);
  return <Estudio t={tt} cam={[0.18, 0.14, 0.6]} look={[0.06, 0.1, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <Tq p={[0, 0, -0.1]} s={0.9} legs />
    <mesh position={[0.0, 0.3, 0.09]}><sphereGeometry args={[0.022, 16, 12]} /><meshStandardMaterial color="#3a2a28" roughness={0.3} /></mesh>
    {cae < 0.99 && <Gota p={[0.1, lerp(0.09, 0.01, cae), 0.05]} s={0.03 + 0.025 * g} />}
    <mesh position={[0.1, 0.004, 0.05]} rotation={[-P2, 0, 0]} scale={SC(ch)}><circleGeometry args={[0.3, 32]} />{AGUA(0.6, "#9a7a5a")}</mesh>
  </Estudio>;
}}</Stage>;

// 7 · EL GUARDAESPALDAS: el bloque de acero detrás de un escudo de magnesio; el agua (partículas) pega en el escudo que se va gastando; cuando se acaba, pega en el acero y aparece el óxido
const BGuarda: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#10151a">{(tt) => {
  const vida = 1 - eio(tt, 0.6, 2.6), ox = eio(tt, 2.8, 4.0);
  return <Estudio t={tt} cam={[0.2, 0.5, 1.4]} look={[0, 0.3, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <RBox s={[0.36, 0.4, 0.36]} r={0.02} p={[0.25, 0.2, 0]}><meshStandardMaterial color={col("#9aa0a6", OXIDO, ox)} metalness={lerp(0.8, 0.2, ox)} roughness={lerp(0.35, 0.9, ox)} /></RBox>
    {vida > 0.03 && <RBox s={[0.05, 0.4 * vida, 0.42 * vida]} r={0.01} p={[0.0, 0.2 * vida + 0.005, 0]}><meshStandardMaterial map={ruido("b5mg" + MG, MG, ["#8d9194", "#c3c6c8", "#7a7d80"], 3000, 3)} roughness={0.85} /></RBox>}
    {Array.from({ length: 14 }, (_, i) => { const q = (tt * 0.9 + i / 14) % 1, xt = vida > 0.03 ? -0.03 : 0.06; return tt < 0.4 ? null : <Particula key={i} p={[lerp(-0.75, xt, q), 0.08 + 0.3 * rn(i, 2), (rn(i, 3) - 0.5) * 0.3]} c={vida > 0.03 ? "#8fd0ff" : "#ff9a6a"} />; })}
    <Halo p={[0.25, 0.25, 0.2]} r={0.35 * ox} c={ROJO} o={0.3} />
  </Estudio>;
}}</Stage>;

// 8 · SE QUEDA PELÓN: el ánodo grande parado; el contador de años avanza del 1 al 7 y la funda de magnesio se va comiendo hasta dejar el alambre de acero
const BPelon: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#11151a">{(tt) => {
  const k = eio(tt, 0.4, 3.4), yr = Math.max(1, Math.round(lerp(1, 7, k)));
  return <Estudio t={tt} cam={[0.0, 0.45, 1.25]} look={[0, 0.38, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} /><Piso5 />
    <Anodo p={[-0.1, 0.02, 0]} L={0.66} w={lerp(1, 0.04, k)} s={1.05 * S0(tt, 0.1)} />
    <Num n={yr} p={[0.32, 0.5, 0]} s={0.2} c={k > 0.85 ? "#ff8a7a" : "#f4f1e8"} />
    <Halo p={[-0.1, 0.35, 0.1]} r={0.4 * eio(tt, 3.3, 3.8)} c={ROJO} o={0.3} />
  </Estudio>;
}}</Stage>;

// 9 · LA REGLA DE LOS AÑOS: una regla de madera de 0 a 6; el marcador camina hasta el 3 (verde); entra el tanque azul del suavizador y lo empuja de vuelta al 2 (ámbar)
const BRegla: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#12161b">{(tt) => {
  const m = eio(tt, 0.4, 1.6) * 3 - eio(tt, 2.4, 3.2), su = cl(phys(tt, 1.9, 7, 0.45)), U = 0.18;
  return <Estudio t={tt} cam={[0, 0.42, 1.15]} look={[0, 0.14, 0.05]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} /><Piso5 />
    <RBox s={[1.2, 0.03, 0.12]} r={0.006} p={[0, 0.05, 0.1]}><meshStandardMaterial map={reglaTex()} roughness={0.7} /></RBox>
    {[0, 1, 2, 3, 4, 5, 6].map((y) => <Num key={y} n={y} p={[-0.54 + y * U, 0.1, 0.2]} s={0.085} c="#e8e2d0" />)}
    <group position={[-0.54 + m * U, 0.07, 0.1]}><mesh position={[0, 0.1, 0]}><coneGeometry args={[0.035, 0.08, 3]} />{GLOW(tt > 2.4 ? VIN : VER, 0.95)}</mesh><Caño a={[0, 0, 0]} b={[0, 0.06, 0]} r={0.006} mat={GALV()} /></group>
    <group position={[0.1, 0.0, -0.25]} scale={SC(su)}><mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.1, 0.1, 0.5, 32]} /><meshStandardMaterial color="#2a5fae" roughness={0.4} /></mesh><mesh position={[0, 0.53, 0]}><cylinderGeometry args={[0.08, 0.1, 0.06, 32]} /><meshStandardMaterial color="#222" /></mesh></group>
    <Flecha p={[-0.54 + 2.6 * U, 0.35, 0.1]} k={eio(tt, 2.3, 2.6) * (1 - eio(tt, 3.3, 3.6))} c={VIN} rot={[0, 0, P2]} />
  </Estudio>;
}}</Stage>;

// 10 · LAS TRES SEÑALES (items): un huevo del que suben hilos verdes · un vaso de agua café con pedacitos negros · piedritas que saltan sobre el quemador
const BSenales: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const a = [0, 1, 2].map((i) => AT(h, i, 1.0, 0.5));
  return <Estudio t={tt} cam={[0, 0.45, 1.3]} look={[0, 0.2, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} /><Piso5 />
    {[0, 1, 2].map((i) => { const x = -0.45 + i * 0.45, up = cl(phys(tt, a[i] - 0.2, 7, 0.45)), on = eio(tt, a[i], a[i] + 0.4); return <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.14, 0.16, 0.08, 32]} /><meshStandardMaterial color="#2a2e34" roughness={0.6} /></mesh>
      <group position={[0, 0.08, 0]} scale={SC(up)}>
        {i === 0 && <><mesh position={[0, 0.07, 0]} scale={[1, 1.3, 1]}><sphereGeometry args={[0.055, 24, 16]} /><meshStandardMaterial color="#efe6d4" roughness={0.6} /></mesh><Humo p={[0, 0.14, 0]} t={tt} k={on} n={8} c="#b9c94a" h={0.3} /></>}
        {i === 1 && <><mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.055, 0.045, 0.16, 32, 1, true]} />{VIDRIO(0.3)}</mesh><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.05, 0.043, 0.13, 32]} />{LIQ(col("#8fc4e0", "#7a5230", on), 0.85)}</mesh>
          {[0, 1, 2, 3, 4].map((j) => <mesh key={j} position={[(rn(j, 2) - 0.5) * 0.05, 0.012 + 0.01 * rn(j, 3), (rn(j, 4) - 0.5) * 0.05]} scale={0.007 * on + 0.0001}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#111" /></mesh>)}</>}
        {i === 2 && <><RBox s={[0.2, 0.03, 0.14]} r={0.01} p={[0, 0.015, 0]}>{GALV()}</RBox>
          {[0, 1, 2, 3].map((j) => <Piedra key={j} p={[(j - 1.5) * 0.04, 0.045 + 0.04 * on * Math.abs(Math.sin(tt * 2 * P * 1.8 + j * 1.3)), 0]} s={0.014} k={"b5" + j} />)}</>}</group>
      <Halo p={[0, 0.2, 0.15]} r={0.2 * on} c={VIN} o={0.45} /></group>; })}
  </Estudio>;
}}</Stage>;

// 11 · SEIS PUNTAS, NO DOCE: dos cabezas hexagonales; a la izquierda entra el dado de 6 y la cabeza queda filosa (verde); a la derecha el de 12 gira, resbala y la cabeza se redondea (roja)
const BDado: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#10141a">{(tt) => {
  const d6 = eio(tt, 0.4, 1.3), d12 = eio(tt, 1.6, 2.5), gira = eio(tt, 2.5, 3.6), red = eio(tt, 2.8, 3.6);
  return <Estudio t={tt} cam={[0, 0.6, 0.85]} look={[0, 0.12, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <Hex p={[-0.3, 0.04, 0]} r={0.08} L={0.08} rot={[0, 0, 0]} />
    <mesh position={[0.3, 0.04, 0]} rotation={[0, gira * 0.6, 0]}><cylinderGeometry args={[0.08, 0.08, 0.08, red > 0.5 ? 24 : 6]} /><meshStandardMaterial color={col("#d8dade", ROJO, red)} metalness={0.9} roughness={0.25} /></mesh>
    <mesh position={[-0.3, lerp(0.34, 0.1, d6), 0]}><cylinderGeometry args={[0.11, 0.11, 0.14, 6, 1, true]} /><meshStandardMaterial color="#b8bcc2" roughness={0.2} metalness={1} side={2} /></mesh>
    <mesh position={[0.3, lerp(0.34, 0.1, d12), 0]} rotation={[0, gira * 3, 0]}><cylinderGeometry args={[0.11, 0.11, 0.14, 12, 1, true]} /><meshStandardMaterial color="#b8bcc2" roughness={0.2} metalness={1} side={2} /></mesh>
    <Anillo p={[-0.3, 0.004, 0]} r={0.16} o={eio(tt, 1.2, 1.5) * 0.9} c={VER} /><Anillo p={[0.3, 0.004, 0]} r={0.16} o={red * 0.9} c={ROJO} />
  </Estudio>;
}}</Stage>;

// 12 · LA ARTICULADA: el techo bajito sobre el calentador; la varilla recta sube y choca (tiembla, cruz roja); la de eslabones se dobla y entra igual (verde)
const BArticulada: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#10151b">{(tt) => {
  const r1 = eio(tt, 0.4, 1.2), no = eio(tt, 1.2, 1.5), r2 = eio(tt, 2.0, 3.6), x2 = eio(tt, 1.6, 2.0);
  return <Estudio t={tt} cam={[0.2, 0.62, 1.75]} look={[0.08, 0.65, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <mesh position={[0, 1.15, 0]}><boxGeometry args={[2.0, 0.06, 1.0]} /><meshStandardMaterial color="#cfc6b6" roughness={0.9} /></mesh>
    <Tq p={[0, 0, 0]} s={0.9} />
    {x2 < 0.5 && <Anodo p={[0.25 + shake(tt, 1.2, 1.6, 0.02), lerp(0.2, 0.47, r1), 0.15]} L={0.62} />}
    <Cruz p={[0.25, 1.0, 0.2]} s={0.12} k={no * (1 - x2)} />
    {x2 >= 0.5 && [0, 1, 2, 3].map((i) => { const ang = lerp(1.2, 0, cl(r2 * 4 - i)) * (i % 2 ? -1 : 1) * 0.5; return <group key={i} position={[0.02 + 0.12 * cl(1 - r2 * 4 + i) * (i % 2 ? 1 : -1) * 0, lerp(1.08, 0.66, r2) - i * 0.15, 0]} rotation={[0, 0, ang]}>
      <mesh position={[0, -0.07, 0]}><cylinderGeometry args={[0.032, 0.032, 0.13, 16]} /><meshStandardMaterial map={ruido("b5mg" + MG, MG, ["#8d9194", "#c3c6c8", "#7a7d80"], 3000, 3)} roughness={0.8} /></mesh>
      <mesh><sphereGeometry args={[0.012, 10, 8]} />{GALV()}</mesh></group>; })}
    <Halo p={[0, 0.9, 0.2]} r={0.35 * eio(tt, 3.4, 3.8)} c={VER} o={0.4} />
  </Estudio>;
}}</Stage>;

// 13 · EL ORDEN DE ANTES (items): tres mandos en fila: la perilla del gas gira a piloto · la llave de agua fría se cierra (azul) · la llave caliente de la casa se abre y suelta su chorro
const BOrden: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#11161b">{(tt) => {
  const a = [0, 1, 2].map((i) => AT(h, i, 1.0, 0.5)), k = a.map((x) => eio(tt, x, x + 0.6));
  return <Estudio t={tt} cam={[0, 0.34, 0.95]} look={[0, 0.27, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#1a1d22" /><Piso />
    <group position={[-0.45, 0.3, 0]}><RBox s={[0.2, 0.2, 0.08]} r={0.02}><meshStandardMaterial color="#3a3d42" /></RBox>
      <group position={[0, 0, 0.05]} rotation={[0, 0, -k[0] * 1.6]}><mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.03, 32]} /><meshStandardMaterial color="#c4281c" /></mesh><RBox s={[0.012, 0.09, 0.012]} r={0.004} p={[0, 0.03, 0.02]}><meshStandardMaterial color="#fff" /></RBox></group>
      <Halo p={[0, 0, 0.1]} r={0.2 * k[0]} c={VER} o={0.4} /></group>
    <group position={[0, 0.3, 0]}><Caño a={[-0.15, 0, 0]} b={[0.15, 0, 0]} r={0.02} /><Valvula p={[0, 0, 0]} ang={k[1] * P2} s={1.2} c="#2a6fd0" /><Halo p={[0, 0, 0.1]} r={0.2 * k[1]} c={AZUL} o={0.4} /></group>
    <group position={[0.42, 0.18, 0]}><Grifo p={[0, 0, 0]} s={0.9} /><Chorro a={[0.13, 0.22, 0]} t={tt} k={k[2]} v={[0, -0.2, 0]} n={18} r={0.009} /><Halo p={[0.05, 0.2, 0.1]} r={0.2 * k[2]} c={VIN} o={0.4} /></group>
  </Estudio>;
}}</Stage>;

// 14 · LA VÁLVULA QUE NO SE TOCA: la válvula de alivio grande con su palanquita; la llave de perico se acerca, sale la cruz roja y se retira; baja una campana de vidrio que la protege
const BAlivio: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#10151a">{(tt) => {
  const va = eio(tt, 0.5, 1.3) * (1 - eio(tt, 1.9, 2.6)), no = eio(tt, 1.2, 1.5) * (1 - eio(tt, 2.4, 2.8)), dome = eio(tt, 2.6, 3.6);
  return <Estudio t={tt} cam={[0, 0.45, 1.05]} look={[0, 0.3, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} /><Piso />
    <group position={[0, 0.3, 0]} scale={S0(tt, 0.1)}>
      <mesh><sphereGeometry args={[0.09, 24, 18]} />{BRONCE()}</mesh>
      <Caño a={[-0.25, 0, 0]} b={[-0.06, 0, 0]} r={0.035} mat={BRONCE()} /><Caño a={[0, -0.06, 0]} b={[0, -0.3, 0]} r={0.03} mat={COBRE()} />
      <Caño a={[0, 0.06, 0]} b={[0, 0.14, 0]} r={0.02} mat={BRONCE()} />
      <RBox s={[0.14, 0.018, 0.03]} r={0.006} p={[0.06, 0.15, 0]}><meshStandardMaterial color="#c4281c" /></RBox></group>
    <Perico p={[lerp(0.9, 0.22, va), 0.32, 0.05]} s={0.6} rot={[0, 0, P]} />
    <Cruz p={[0.12, 0.42, 0.15]} s={0.13} k={no} />
    <mesh position={[0, lerp(1.1, 0.3, dome), 0]} scale={[1, 1, 1]}><sphereGeometry args={[0.26, 32, 16, 0, 2 * P, 0, P2]} />{VIDRIO(0.22)}</mesh>
    <Anillo p={[0, 0.006, 0]} r={0.3} o={eio(tt, 3.4, 3.8) * 0.9} c={VER} />
  </Estudio>;
}}</Stage>;

// 15 · SÓLO UN POQUITO: el tanque en rayos X lleno; la línea verde marca justo debajo del tapón; el agua baja apenas hasta ella mientras la cubeta se llena un poco
const BNivel: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#10151a">{(tt) => {
  const k = eio(tt, 0.8, 3.0);
  return <Estudio t={tt} cam={[0.25, 0.6, 1.6]} look={[0.15, 0.4, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <Tq p={[-0.15, 0, 0]} s={0.95} x={1} lvl={lerp(1, 0.86, k)} />
    <mesh position={[-0.15, 0.95 * 0.6, 0.2]}><boxGeometry args={[0.46, 0.006, 0.006]} />{GLOW(VER, eio(tt, 0.3, 0.7))}</mesh>
    <Caño a={[0.03, 0.06, 0.1]} b={[0.4, 0.06, 0.1]} r={0.012} mat={<meshStandardMaterial color="#2f8a3a" roughness={0.6} />} />
    <Cubeta p={[0.5, 0, 0.1]} s={0.8} lvl={0.45 * k} c="#a87850" />
    <Chorro a={[0.42, 0.18, 0.1]} t={tt} k={eio(tt, 0.8, 1.0) * (1 - eio(tt, 3.0, 3.2))} v={[0.1, -0.1, 0]} n={14} r={0.008} c="#b08a60" />
  </Estudio>;
}}</Stage>;

// 16 · EL PIE EN LA BASE: vista desde arriba; el maneral gira y se lleva el calentador entero (los tubos se tuercen en rojo); vuelve; entra la bota y ahora sólo gira la cabeza del ánodo (verde)
const BPie: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#11151a">{(tt) => {
  const g1 = eio(tt, 0.4, 1.3) * (1 - eio(tt, 1.6, 2.0)), bota = cl(phys(tt, 2.0, 7, 0.45)), g2 = eio(tt, 2.5, 3.6);
  return <Estudio t={tt} cam={[0.35, 1.05, 1.15]} look={[0, 0.32, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-1.5} /><Piso />
    <group rotation={[0, -g1 * 0.5, 0]}><mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.25, 0.25, 0.6, 40]} /><meshStandardMaterial color="#eeeeea" roughness={0.35} /></mesh>
      <group rotation={[0, -g2 * 1.2, 0]}><Hex p={[0, 0.63, 0]} r={0.04} L={0.04} rot={[0, 0, 0]} /><RBox s={[0.5, 0.025, 0.03]} r={0.008} p={[0.27, 0.68, 0]}>{GALV()}</RBox></group></group>
    {[-1, 1].map((sd) => <Caño key={sd} a={[sd * 0.12, 0.62, -0.1]} b={[sd * 0.12 + sd * 0.5 * g1 * 0.4, 0.62, -0.75]} r={0.02} mat={<meshStandardMaterial color={col("#c4693a", ROJO, g1)} metalness={0.6} roughness={0.35} />} />)}
    <group position={[-0.32, 0.06, 0.18]} scale={SC(bota)}><RBox s={[0.3, 0.12, 0.13]} r={0.04}><meshStandardMaterial color="#3b2a1e" roughness={0.8} /></RBox></group>
    <Anillo p={[0, 0.72, 0]} r={0.12} o={eio(tt, 2.8, 3.2) * 0.9} c={VER} />
  </Estudio>;
}}</Stage>;

// 17 · LO QUE CUENTA LA VARILLA (items): tres varillas acostadas sobre el trapo: gruesa (verde, se vuelve a poner) · delgada con alambre (ámbar, cámbiala) · sólo alambre (roja, hace años)
const BLectura: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const a = [0, 1, 2].map((i) => AT(h, i, 1.0, 0.5)), W = [1, 0.5, 0.06], Cc = [VER, VIN, ROJO];
  return <Estudio t={tt} cam={[0.05, 0.6, 0.62]} look={[0.05, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-1} /><Madera />
    <mesh position={[0, 0.003, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.2, 0.7]} /><meshStandardMaterial color="#c9b78f" roughness={0.95} /></mesh>
    {[0, 1, 2].map((i) => { const up = cl(phys(tt, a[i] - 0.15, 7, 0.45)), on = eio(tt, a[i], a[i] + 0.4); return <group key={i} position={[0.05, 0.03 + 0.05 * on, -0.2 + i * 0.2]} rotation={[0, 0, -P2]} scale={SC(up)}>
      <Anodo p={[0, -0.32, 0]} L={0.6} w={W[i]} />
      <Halo p={[0, 0, 0.05]} r={0.22 * on} c={Cc[i]} o={0.16} /></group>; })}
  </Estudio>;
}}</Stage>;

// 18 · EL TEFLÓN AL DERECHO: el tapón roscado de frente; la cinta blanca da cinco vueltas en el sentido del reloj (la flecha verde las acompaña); al atornillar, la cinta se aprieta en vez de soltarse
const BTeflon: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#10151a">{(tt) => {
  const v = eio(tt, 0.4, 2.4), en = eio(tt, 2.7, 3.8);
  return <Estudio t={tt} cam={[0.0, 0.3, 0.95]} look={[0, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} />
    <group position={[0, 0.25, lerp(0, -0.25, en)]} rotation={[P2, 0, en * 4]}>
      <mesh><cylinderGeometry args={[0.1, 0.1, 0.2, 32]} /><meshStandardMaterial color="#c9b58a" metalness={0.8} roughness={0.35} /></mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0, -0.08 + i * 0.023, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.1, 0.006, 6, 32]} /><meshStandardMaterial color="#a8956a" metalness={0.8} roughness={0.4} /></mesh>)}
      {Array.from({ length: 5 }, (_, i) => { const k = cl(v * 5 - i); return k <= 0.01 ? null : <mesh key={"c" + i} position={[0, -0.06 + i * 0.03, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.107 - 0.004 * en, 0.009, 6, 40, 2 * P * k]} /><meshStandardMaterial color="#f7f7f2" roughness={0.6} /></mesh>; })}</group>
    <Arco p={[0, 0.25, 0.12]} r={0.2} a0={P2} a={-2 * P * v * 0.95} c={VER} o={0.9} w={0.015} />
    <mesh position={[0, 0.25, -0.33]}><ringGeometry args={[0.11, 0.2, 40]} />{GALV()}</mesh>
  </Estudio>;
}}</Stage>;

// 19 · PRIMERO LLENO, DESPUÉS FUEGO: el tanque en rayos X se llena desde abajo; la llave de la casa tose aire y burbujas; cuando el agua llega arriba y el chorro sale parejo, recién se prende la llama
const BLleno: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#10151b">{(tt) => {
  const lv = eio(tt, 0.3, 2.6), parejo = eio(tt, 2.6, 2.9), fuego = eio(tt, 3.0, 3.4), tos = tt > 1.2 && tt < 2.6 ? 0.5 + 0.5 * Math.abs(Math.sin(tt * 2 * P * 1.6)) : parejo;
  return <Estudio t={tt} cam={[0.25, 0.6, 1.6]} look={[0.15, 0.42, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <Tq p={[-0.15, 0, 0]} s={0.95} x={1} lvl={lv} legs />
    <Burbujas p={[-0.15, 0.12, 0]} t={tt} k={1 - parejo} w={0.3} hh={0.6 * lv} n={16} s={0.01} />
    <Llama p={[-0.15, 0.02, 0.0]} t={tt} k={fuego} s={1.1} /><Halo p={[-0.15, 0.1, 0.2]} r={0.3 * fuego} c={VER} o={0.35} />
    <Grifo p={[0.42, 0.45, 0]} s={0.9} /><Chorro a={[0.55, 0.66, 0]} t={tt} k={tt > 1.2 ? tos : 0} v={[0.05, -0.2, 0]} n={tt > 2.6 ? 20 : 8} r={0.009} />
    <Burbujas p={[0.55, 0.4, 0]} t={tt} k={tt > 1.2 ? 1 - parejo : 0} w={0.06} hh={0.2} n={8} s={0.007} />
  </Estudio>;
}}</Stage>;

// 20 · ADIÓS AL OLOR: la varilla de magnesio con hilos amarillo-verdosos que suben; sale por arriba y entra la de aluminio con zinc (más clara, azulada); los hilos se apagan
const BZinc: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#11151a">{(tt) => {
  const sale = eio(tt, 1.0, 2.0), entra = eio(tt, 2.0, 3.0), olor = 1 - eio(tt, 2.4, 3.4);
  return <Estudio t={tt} cam={[0, 0.6, 1.5]} look={[0, 0.48, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <Tq p={[0, 0, 0]} s={0.9} x={1} lvl={0.85} />
    {sale < 0.99 && <Anodo p={[0, 0.06 + 0.9 * sale, 0]} L={0.58} />}
    <Anodo p={[0, lerp(0.95, 0.06, entra), 0]} L={0.58} c="#c9d6e2" s={SC(eio(tt, 1.9, 2.0))} />
    <Humo p={[0, 0.85, 0]} t={tt} k={olor} n={10} c="#b9c94a" h={0.5} />
    <Halo p={[0, 0.5, 0.2]} r={0.4 * eio(tt, 3.2, 3.7)} c={AZUL} o={0.35} />
  </Estudio>;
}}</Stage>;

// 21 · EL CUADERNO DE DON RAMIRO: el cuaderno abierto con las fechas cada tres años; por cada fecha cae una varilla gastada a la fila; su calentador sigue verde, el del vecino se cambia tres veces
const BCuaderno: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#13110d">{(tt) => {
  const n = Math.floor(lerp(0, 7, eio(tt, 0.5, 3.2)) + 0.001), vc = Math.floor(lerp(1, 3.99, eio(tt, 0.8, 3.2)));
  return <Estudio t={tt} cam={[0, 0.7, 1.35]} look={[0, 0.3, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#17130e" /><Madera />
    <group position={[-0.45, 0.012, 0.15]} rotation={[-P2, 0, 0.1]} scale={S0(tt, 0.1)}><mesh><planeGeometry args={[0.5, 0.36]} /><meshStandardMaterial map={papel("b5:cuad", ["2008  2011", "2014  2017", "2020  2023", "2026"], { w: 512, h: 368, size: 64 })} roughness={0.9} /></mesh></group>
    {Array.from({ length: 7 }, (_, i) => i < n ? <group key={i} position={[-0.6 + i * 0.07, 0.02, -0.15]} rotation={[0, 0, -P2]}><Anodo p={[0, -0.12, 0]} L={0.24} w={0.35} s={0.9} /></group> : null)}
    <Tq p={[0.15, 0, -0.2]} s={0.6} /><Halo p={[0.15, 0.25, -0.05]} r={0.3 * eio(tt, 3.0, 3.5)} c={VER} o={0.3} />
    {[0, 1, 2].map((i) => i < vc ? <Tq key={i} p={[0.55 + i * 0.03, 0, -0.25 + i * 0.12]} s={0.5} c={i < vc - 1 ? "#b06a40" : "#eeeeea"} /> : null)}
    <Num n={vc} p={[0.6, 0.62, -0.1]} s={0.1} c="#ff8a7a" />
  </Estudio>;
}}</Stage>;

// 22 · LO QUE DON CHUY NUNCA HACÍA (items): la aguja del manómetro cae a cero antes de aflojar · el agua sale por la llave y recién se prende el fuego · la varilla vieja se levanta frente al dueño
const BChuy: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#14110d">{(tt) => {
  const a = [0, 1, 2].map((i) => AT(h, i, 1.0, 0.5)), cero = eio(tt, a[0], a[0] + 0.8), agua = eio(tt, a[1], a[1] + 0.4), fu = eio(tt, a[1] + 0.5, a[1] + 0.9), va = cl(phys(tt, a[2], 7, 0.45));
  return <Estudio t={tt} cam={[0, 0.5, 1.35]} look={[0, 0.3, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#17130e" /><Piso5 />
    <group position={[-0.45, 0.35, 0]}><mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.04, 40]} />{M.cromo()}</mesh>
      <mesh position={[0, 0, 0.021]}><circleGeometry args={[0.105, 40]} /><meshStandardMaterial color="#f4f1e8" /></mesh>
      <group position={[0, 0, 0.026]} rotation={[0, 0, lerp(-0.9, 1.1, cero)]}><RBox s={[0.012, 0.09, 0.004]} r={0.003} p={[0, 0.04, 0]}><meshBasicMaterial color={ROJO} /></RBox></group>
      <Caño a={[0, -0.12, 0]} b={[0, -0.35, 0]} r={0.015} mat={BRONCE()} /></group>
    <group position={[0.0, 0.0, 0]}><Grifo p={[-0.05, 0.35, 0]} s={0.8} /><Chorro a={[0.06, 0.53, 0]} t={tt} k={agua} v={[0, -0.2, 0]} n={14} r={0.008} />
      <Llama p={[0.0, 0.0, 0.1]} t={tt} k={fu} s={0.9} /></group>
    <group position={[0.45, lerp(0.0, 0.12, va), 0]} scale={SC(va)}><Anodo p={[0, 0, 0]} L={0.5} w={0.2} /><Halo p={[0, 0.3, 0.1]} r={0.3} c="#ffd36a" o={0.35} /></group>
  </Estudio>;
}}</Stage>;

// 23 · EL REPASO (items): tres pedestales: el trozo de tanque oxidado (el agua se come el acero) · el ánodo con su escudo de luz (el guardaespaldas) · el calendario con el 3 (revisarlo a los tres años)
const BRecap: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const a = [0, 1, 2].map((i) => AT(h, i, 0.9, 0.5));
  return <Estudio t={tt} cam={[0, 0.48, 1.35]} look={[0, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} /><Piso5 />
    {[0, 1, 2].map((i) => { const x = -0.45 + i * 0.45, up = cl(phys(tt, a[i] - 0.2, 7, 0.45)), on = eio(tt, a[i], a[i] + 0.35); return <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.15, 0.17, 0.1, 32]} /><meshStandardMaterial color="#2a2e34" roughness={0.6} /></mesh>
      <group position={[0, 0.1, 0]} scale={SC(up)}>
        {i === 0 && <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.1, 0.1, 0.2, 32, 1, true, 0, P]} /><meshStandardMaterial map={oxidoTex()} roughness={0.9} side={THREE.DoubleSide} /></mesh>}
        {i === 1 && <><Anodo p={[0, 0, 0]} L={0.28} s={1} /><mesh position={[0, 0.15, 0]}><sphereGeometry args={[0.12, 24, 16]} />{GLOW(VER, 0.15 * on)}</mesh></>}
        {i === 2 && <><RBox s={[0.2, 0.22, 0.02]} r={0.01} p={[0, 0.11, 0]}><meshStandardMaterial color="#f4f1e8" /></RBox><Num n={3} p={[0, 0.1, 0.012]} s={0.13} c="#1d1a16" /></>}</group>
      <Halo p={[0, 0.2, 0.17]} r={0.2 * on} c={[ROJO, VER, VIN][i]} o={0.5} /></group>; })}
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  b_dos: BDos, b_reloj30: BReloj30, b_doble: BDoble, b_tanque: BTanque, b_vidrio: BVidrio, b_gota: BGota, b_guarda: BGuarda, b_pelon: BPelon,
  b_regla: BRegla, b_senales: BSenales, b_dado: BDado, b_articulada: BArticulada, b_orden: BOrden, b_alivio: BAlivio, b_nivel: BNivel, b_pie: BPie,
  b_lectura: BLectura, b_teflon: BTeflon, b_lleno: BLleno, b_zinc: BZinc, b_cuaderno: BCuaderno, b_chuy: BChuy, b_recap: BRecap,
};
