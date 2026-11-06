// heroes plo5nd r4 · limpiar el fondo del tinaco sin vaciarlo: el sifón
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


// ================= plo5nd · LIMPIAR EL FONDO DEL TINACO SIN VACIARLO (SIFÓN) · 19 componentes únicos 3D =================
// Regla: el Stage comprime el tiempo del hijo a ≤4,4 s → toda línea de tiempo cierra antes de tt≈4,2. Cámara cerca, todo apoyado, sin rótulos.
const LODO = "#4a3220", LODOC = "#7a5432", LIMPIA = "#5fa8d3";
const lodoTex = () => ruido("d5lodo", LODO, ["#5a4228", "#7e6040", "#4a3420", "#8a6c48"], 5000, 3);
// tinaco en corte: cuerpo de vidrio, agua al nivel lvl, capa de lodo de espesor ld (0..1 = 0..9 cm), salida lateral a la altura hs
const TinC: React.FC<{ p: V3; s?: number; lvl?: number; ld?: number; turb?: number; hs?: number; sal?: boolean }> = ({ p, s = 1, lvl = 0.85, ld = 0.3, turb = 0, hs = 0.09, sal = true }) => <group position={p} scale={s}>
  <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.26, 0.25, 0.6, 48, 1, true]} />{VIDRIO(0.2)}</mesh>
  <mesh position={[0, 0.004, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.25, 48]} /><meshStandardMaterial color="#1d1f22" roughness={0.6} /></mesh>
  {ld > 0.005 && <mesh position={[0, 0.006 + 0.045 * ld, 0]}><cylinderGeometry args={[0.245, 0.245, 0.09 * ld, 48]} /><meshStandardMaterial map={lodoTex()} color="#b08050" roughness={1} /></mesh>}
  <mesh position={[0, (0.6 * lvl + 0.09 * ld + 0.012) / 2, 0]}><cylinderGeometry args={[0.24, 0.24, Math.max(0.01, 0.6 * lvl - 0.09 * ld - 0.012), 48]} />{LIQ(col(LIMPIA, LODOC, turb), 0.5 + 0.35 * turb)}</mesh>
  <mesh position={[0, 0.6 * lvl + 0.006, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.24, 48]} />{LIQ(col("#a9d6ea", LODOC, turb), 0.6)}</mesh>
  {sal && <Caño a={[0.25, hs, 0]} b={[0.42, hs, 0]} r={0.018} mat={PVCM()} />}</group>;
// manguera transparente como tubo: pts, color del líquido c, cuánto se llenó k
const Mang: React.FC<{ pts: V3[]; c?: string; o?: number; r?: number }> = ({ pts, c, o = 0.8, r = 0.016 }) => {
  const g = memo("d5m" + pts.map((q) => q.join(",")).join("|") + r, () => tuboGeo(pts, r, 90, 14));
  return <>
    <mesh geometry={g}>{VIDRIO(0.3)}</mesh>
    {c && <mesh geometry={memo("d5mi" + pts.map((q) => q.join(",")).join("|") + r, () => tuboGeo(pts, r * 0.78, 90, 12))}>{LIQ(c, o)}</mesh>}</>;
};

// 1 · LODO QUE SALE: tinaco en corte lleno; la punta del tubo baja al lodo; la manguera se pone café y la cubeta se llena de chocolate
const DLodo: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#10151a">{(tt) => {
  const baja = eio(tt, 0.4, 1.3), sale = eio(tt, 1.5, 3.8), ld = lerp(0.55, 0.3, sale);
  const pts: V3[] = [[-0.12, lerp(0.7, 0.04, baja), 0], [-0.12, 0.75, 0], [0.1, 0.85, 0], [0.32, 0.7, 0], [0.42, 0.25, 0.05], [0.5, 0.2, 0.1]];
  return <Estudio t={tt} cam={[0.2, 0.55, 1.3]} look={[0.12, 0.26, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <TinC p={[-0.15, 0, 0]} s={1.05} lvl={0.95} ld={ld} sal={false} />
    <Caño a={[-0.27, lerp(0.75, 0.05, baja), 0]} b={[-0.27, lerp(1.35, 0.7, baja), 0]} r={0.016} mat={PVCM()} />
    {baja > 0.98 && <Mang pts={pts} c={sale > 0.02 ? LODOC : undefined} o={0.9} />}
    <Cubeta p={[0.55, 0, 0.12]} s={0.85} lvl={0.85 * sale} c={LODO} corte />
    <Chorro a={[0.5, 0.2, 0.1]} t={tt} k={sale * (1 - eio(tt, 3.9, 4.1))} v={[0.02, -0.15, 0]} n={14} r={0.009} c={LODOC} />
  </Estudio>;
}}</Stage>;

// 2 · DE CAFÉ A TRANSPARENTE: tres cubetas en corte, de frente y de cerca; la manguera pasa de una a otra y el agua que cae va de chocolate a turbia a clara; palomita sobre la clara
const DCubeta: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#11151a">{(tt) => {
  const cs = [LODO, "#9a7a52", "#6fb6de"], src = tt < 1.5 ? 0 : tt < 2.6 ? 1 : 2;
  return <Estudio t={tt} cam={[0, 1.0, 0.85]} look={[0, 0.12, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} /><Piso />
    {cs.map((c, i) => { const a = 0.4 + i * 1.1, k = eio(tt, a, a + 0.9); return <group key={i}>
      <Cubeta p={[-0.4 + i * 0.4, 0, 0]} s={1.05} lvl={0.85 * k} c={c} />
      <Chorro a={[-0.4 + i * 0.4, 0.5, 0]} t={tt} k={eio(tt, a - 0.1, a) * (1 - eio(tt, a + 0.9, a + 1.0))} v={[0, -0.12, 0]} n={14} r={0.012} c={c} /></group>; })}
    <Caño a={[-0.4 + src * 0.4, 0.52, 0]} b={[-0.4 + src * 0.4, 0.62, -0.05]} r={0.014} mat={<meshPhysicalMaterial color={cs[src]} roughness={0.1} transparent opacity={0.85} />} />
    <Palomita p={[0.4, 0.5, 0.08]} s={0.22} k={eio(tt, 3.5, 4.0)} />
  </Estudio>;
}}</Stage>;
// 3 · EL SIFÓN: diagrama 3D; tinaco alto en su base, manguera en arco hasta la cubeta abajo; partículas viajan solas por la manguera
const DSifon: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#10141a">{(tt) => {
  const k = eio(tt, 0.6, 1.4), pts: V3[] = [[-0.3, 0.42, 0], [-0.3, 0.98, 0], [-0.05, 1.05, 0], [0.12, 0.9, 0], [0.2, 0.3, 0], [0.42, 0.2, 0]];
  const curva = new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q)));
  return <Estudio t={tt} cam={[0.1, 0.7, 1.6]} look={[0.02, 0.48, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <RBox s={[0.5, 0.4, 0.5]} r={0.02} p={[-0.38, 0.2, 0]}><meshStandardMaterial color="#8d8a84" roughness={0.95} /></RBox>
    <TinC p={[-0.38, 0.4, 0]} s={0.85} lvl={0.9} ld={0.25} sal={false} />
    <Mang pts={pts} c={k > 0.02 ? "#7fb6d8" : undefined} o={0.85} />
    <Cubeta p={[0.5, 0, 0]} s={0.75} lvl={0.6 * eio(tt, 1.4, 4)} />
    {k > 0.5 && Array.from({ length: 10 }, (_, i) => { const u = (tt * 0.45 + i / 10) % 1; const v = curva.getPoint(u); return <Particula key={i} p={[v.x, v.y, v.z + 0.02]} r={0.022} c="#d8f2ff" />; })}
    <mesh position={[0.1, 0.4, 0.05]}><boxGeometry args={[1.25, 0.004, 0.004]} />{GLOW("#ffffff", 0.35 * k)}</mesh>
    <mesh position={[0.1, 0.2, 0.05]}><boxGeometry args={[1.25, 0.004, 0.004]} />{GLOW(VER, 0.6 * k)}</mesh>
  </Estudio>;
}}</Stage>;

// 4 · UNA CAPA POR SEMANA: un vaso alto de corte; caen granitos y se apilan capas finas (cada capa un tono), el contador de semanas corre hasta 52
const DCapas: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#0f1418">{(tt) => {
  const k = eio(tt, 0.4, 3.8), n = Math.floor(k * 12);
  return <Estudio t={tt} cam={[0, 0.42, 1.15]} look={[0, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} /><Piso />
    <mesh position={[-0.12, 0.28, 0]}><cylinderGeometry args={[0.2, 0.2, 0.56, 48, 1, true]} />{VIDRIO(0.22)}</mesh>
    <mesh position={[-0.12, 0.28, 0]}><cylinderGeometry args={[0.195, 0.195, 0.55, 48]} />{LIQ(LIMPIA, 0.25)}</mesh>
    {Array.from({ length: n }, (_, i) => <mesh key={i} position={[-0.12, 0.008 + i * 0.012, 0]}><cylinderGeometry args={[0.196, 0.196, 0.011, 48]} /><meshStandardMaterial color={col("#5a4228", "#9a7a52", (i % 3) / 2)} roughness={1} /></mesh>)}
    {Array.from({ length: 16 }, (_, i) => { const q = (tt * 0.5 + rn(i, 1)) % 1; return <Grano key={i} p={[-0.12 + (rn(i, 2) - 0.5) * 0.3, lerp(0.54, 0.02 + n * 0.012, q), (rn(i, 3) - 0.5) * 0.2]} s={0.006} c="#8a6a44" />; })}
    <Num n={Math.max(1, Math.round(k * 52))} p={[0.32, 0.36, 0]} s={0.13} />
    <Barra p={[0.32, 0, 0]} v={k} c={LODOC} w={0.08} hmax={0.26} />
  </Estudio>;
}}</Stage>;

// 5 · LA SALIDA SE ENTIERRA: corte del tinaco; el lodo sube hasta tocar la salida lateral; el tubo hacia la casa se pone rojo y se llena de café
const DSalida: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#10151a">{(tt) => {
  const k = eio(tt, 0.5, 2.6), ld = lerp(0.2, 1.25, k), toca = eio(tt, 2.4, 2.9);
  return <Estudio t={tt} cam={[0.25, 0.4, 1.3]} look={[0.12, 0.2, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <TinC p={[-0.18, 0, 0]} s={1.1} lvl={0.7} ld={ld} hs={0.1} />
    <mesh position={[0.06, 0.11, 0.02]}><boxGeometry args={[0.5, 0.004, 0.004]} />{GLOW("#ffffff", 0.6 * (1 - toca))}</mesh>
    <Llena a={[0.1, 0.11, 0]} b={[0.42, 0.11, 0]} k={eio(tt, 2.8, 3.8)} r={0.014} c={LODOC} />
    <Caño a={[0.28, 0.11, 0]} b={[0.6, 0.11, 0]} r={0.02} mat={<meshStandardMaterial color={col("#ecebe4", ROJO, toca)} roughness={0.4} />} />
    <Caño a={[0.6, 0.11, 0]} b={[0.6, 0.0, 0.0]} r={0.02} mat={<meshStandardMaterial color={col("#ecebe4", ROJO, toca)} roughness={0.4} />} />
    <Halo p={[0.12, 0.11, 0.06]} r={0.16 * toca} c={ROJO} o={0.55} />
  </Estudio>;
}}</Stage>;

// 6 · EL PALO CON CINTA BLANCA: el palo baja derechito al fondo, se queda, sube; la cinta blanca sale con una franja café; reglita al lado marca los centímetros
const DPalo: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#11151a">{(tt) => {
  const baja = eio(tt, 0.3, 1.2), sube = eio(tt, 1.8, 2.7), y = lerp(lerp(0.75, 0.02, baja), 0.55, sube), marca = sube > 0.01 ? 1 : 0;
  return <Estudio t={tt} cam={[0.0, lerp(0.5, 0.62, sube), lerp(1.35, 0.85, sube)]} look={[-0.15, lerp(0.35, 0.6, sube), 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} /><Piso />
    <TinC p={[-0.2, 0, 0]} s={1.0} lvl={0.85} ld={0.35} sal={false} />
    <group position={[-0.2, y, 0]}>
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.014, 0.014, 1.0, 16]} /><meshStandardMaterial color="#b9945e" roughness={0.7} /></mesh>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.0165, 0.0165, 0.2, 16]} /><meshStandardMaterial color="#f4f2ec" roughness={0.6} /></mesh>
      {marca > 0 && <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.0175, 0.0175, 0.06, 16]} /><meshStandardMaterial map={lodoTex()} color="#b08050" roughness={1} /></mesh>}</group>
    {sube > 0.9 && <group position={[-0.12, 0.55, 0.03]} scale={2.2}>
      <RBox s={[0.035, 0.2, 0.01]} r={0.003} p={[0, 0.1, 0]}><meshStandardMaterial color="#f2d24a" roughness={0.5} /></RBox>
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[-0.008, 0.01 + i * 0.011, 0.006]}><boxGeometry args={[0.018, 0.002, 0.002]} /><meshBasicMaterial color="#1a1a1a" /></mesh>)}
      <Flecha p={[0.05, 0.016, 0.01]} k={eio(tt, 3.0, 3.4)} c={ROJO} rot={[0, 0, P2]} s={0.35} /></group>}
  </Estudio>;
}}</Stage>;

// 7 · EL KIT DE UNA PIZZA: sobre una tabla, caen de a uno con su rebote: la manguera transparente enrollada, el tubo PVC, la cinta, el mecate, la cubeta y la linterna
const DKit: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#10151b">{(tt) => {
  const a = (i: number) => 0.3 + i * 0.5, Y = (i: number) => (1 - cl(phys(tt, a(i), 8, 0.5))) * 0.5, on = (i: number) => tt > a(i) - 0.05;
  return <Estudio t={tt} cam={[0, 0.42, 0.78]} look={[0, 0.06, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <RBox s={[1.2, 0.03, 0.5]} r={0.006} p={[0, 0.015, 0]}><meshStandardMaterial color="#9a7246" roughness={0.75} /></RBox>
    {on(0) && <group position={[-0.42, 0.13 + Y(0), -0.05]}>{[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[0, 0, i * 0.022 - 0.044]}><torusGeometry args={[0.1, 0.011, 10, 48]} />{VIDRIO(0.6)}</mesh>)}</group>}
    {on(1) && <Caño a={[-0.28, 0.05 + Y(1), 0.15]} b={[0.18, 0.05 + Y(1), 0.15]} r={0.018} mat={PVCM()} />}
    {on(2) && <mesh position={[-0.16, 0.06 + Y(2), -0.08]}><torusGeometry args={[0.05, 0.03, 14, 30]} /><meshStandardMaterial color="#f2f0ea" roughness={0.5} /></mesh>}
    {on(3) && <group position={[0.02, 0.04 + Y(3), -0.1]}>{[0, 1, 2].map((i) => <mesh key={i} rotation={[P2, 0, 0]} position={[0, i * 0.01, 0]}><torusGeometry args={[0.05 - i * 0.006, 0.007, 8, 30]} /><meshStandardMaterial color="#c8a76a" roughness={0.95} /></mesh>)}</group>}
    {on(4) && <Cubeta p={[0.3, 0.03 + Y(4), -0.06]} s={0.65} />}
    {on(5) && <Linterna p={[0.42, 0.06 + Y(5), 0.16]} rot={[0, -0.5, P2]} on={0} />}
  </Estudio>;
}}</Stage>;
// 8 · MÁS ABAJO QUE EL FONDO: la línea del fondo del tinaco queda marcada; la punta de salida sube por encima (el chorro se corta, cruz roja) y baja por debajo (corre, verde)
const DAbajo: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#10151a">{(tt) => {
  const arriba = eio(tt, 0.6, 1.2) * (1 - eio(tt, 2.2, 2.8)), yS = lerp(0.12, 0.62, arriba), corre = 1 - eio(tt, 0.9, 1.2) * (1 - eio(tt, 2.6, 2.9));
  const pts: V3[] = [[-0.3, 0.45, 0], [-0.3, 0.98, 0], [-0.05, 1.05, 0], [0.18, 0.9, 0], [0.32, yS + 0.08, 0], [0.4, yS, 0]];
  return <Estudio t={tt} cam={[0.1, 0.62, 1.85]} look={[0, 0.5, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <RBox s={[0.5, 0.4, 0.5]} r={0.02} p={[-0.38, 0.2, 0]}><meshStandardMaterial color="#8d8a84" roughness={0.95} /></RBox>
    <TinC p={[-0.38, 0.4, 0]} s={0.85} lvl={0.9} ld={0.15} sal={false} />
    <mesh position={[0.05, 0.405, 0.03]}><boxGeometry args={[1.1, 0.005, 0.005]} />{GLOW("#ffffff", 0.7)}</mesh>
    <Mang pts={pts} c="#7fb6d8" o={0.85} />
    <Chorro a={[0.4, yS, 0]} t={tt} k={corre} v={[0.05, -0.1, 0]} n={14} r={0.009} />
    <Cubeta p={[0.45, 0, 0]} s={0.7} lvl={0.3 + 0.3 * eio(tt, 2.8, 4)} />
    <Cruz p={[0.52, yS + 0.12, 0.05]} s={0.14} k={eio(tt, 1.2, 1.5) * (1 - eio(tt, 2.2, 2.4))} />
    <Palomita p={[0.55, 0.42, 0.05]} s={0.16} k={eio(tt, 3.0, 3.5)} />
  </Estudio>;
}}</Stage>;

// 9 · EL FLOTADOR AMARRADO: el chorro de entrada cae y revuelve el lodo (agua café); el brazo del flotador sube, el mecate lo amarra al tubo, el chorro se corta y el agua se aclara
const DFlotador: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#11151a">{(tt) => {
  const sube = eio(tt, 1.3, 2.0), entra = 1 - eio(tt, 1.9, 2.2), turb = 0.75 * (1 - eio(tt, 2.4, 3.9)), ang = lerp(0.5, -0.25, sube);
  const bx = 0.12 - 0.2 * Math.cos(ang), by = 0.56 - 0.2 * Math.sin(ang);
  return <Estudio t={tt} cam={[0.1, 0.62, 1.05]} look={[0.02, 0.38, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <TinC p={[0, 0, 0]} s={1.05} lvl={0.82} ld={lerp(0.4, 0.3, turb > 0.3 ? 0 : 1)} turb={turb} sal={false} />
    <Caño a={[0.38, 0.58, 0]} b={[0.12, 0.58, 0]} r={0.013} mat={BRONCE()} />
    <Chorro a={[0.1, 0.57, 0]} t={tt} k={entra} v={[-0.03, -0.25, 0]} n={18} r={0.011} />
    <group position={[0.12, 0.56, 0]} rotation={[0, 0, ang]}>
      <mesh position={[-0.1, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.006, 0.006, 0.2, 8]} />{M.cromo()}</mesh>
      <mesh position={[-0.2, 0, 0]}><sphereGeometry args={[0.05, 24, 16]} /><meshStandardMaterial color="#efe9d0" roughness={0.45} /></mesh></group>
    {sube > 0.9 && <Caño a={[bx, by + 0.04, 0]} b={[0.2, 0.6, 0]} r={0.005} mat={<meshStandardMaterial color="#c8a76a" roughness={0.9} />} />}
    <Burbujas p={[0.05, 0.03, 0]} t={tt} k={turb} w={0.36} hh={0.4} n={26} s={0.013} c={LODOC} />
    <Palomita p={[0.42, 0.75, 0.05]} s={0.16} k={eio(tt, 3.4, 3.9)} />
  </Estudio>;
}}</Stage>;
// 10 · NUNCA CON LA BOCA: la punta de la manguera con una cruz roja grande; después la llave del patio la llena de agua limpia y aparece la palomita
const DBoca: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#14100f">{(tt) => {
  const no = eio(tt, 0.4, 0.8) * (1 - eio(tt, 1.8, 2.1)), llena = eio(tt, 2.3, 3.6);
  const pts: V3[] = [[-0.36, 0.34, 0], [-0.2, 0.3, 0], [0.0, 0.15, 0], [0.2, 0.08, 0], [0.42, 0.06, 0.05]];
  return <Estudio t={tt} cam={[0, 0.4, 1.15]} look={[0, 0.2, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#18120f" /><Piso />
    <Grifo p={[-0.5, 0.05, 0]} s={1.1} />
    <Mang pts={pts} c={llena > 0.02 ? "#9fd4f4" : undefined} o={0.8 * llena + 0.05} r={0.02} />
    <Chorro a={[-0.37, 0.36, 0]} t={tt} k={llena * 0.6} v={[0.1, -0.05, 0]} n={8} r={0.007} />
    <Cruz p={[0.42, 0.2, 0.08]} s={0.3} k={no} />
    <Palomita p={[0.1, 0.36, 0.08]} s={0.2} k={eio(tt, 3.4, 3.9)} />
  </Estudio>;
}}</Stage>;

// 11 · RÁPIDO NO: dos tinacos en corte; a la izquierda el tubo va y viene rápido y el agua se vuelve café (rojo); a la derecha avanza despacio y queda clara (verde)
const DRapido: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#10141a">{(tt) => {
  const k = eio(tt, 0.4, 3.6), xr = Math.sin(tt * 9) * 0.15 * cl(k * 3), xl = lerp(-0.15, 0.15, k);
  return <Estudio t={tt} cam={[0, 0.62, 1.35]} look={[0, 0.3, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} /><Piso />
    <TinC p={[-0.33, 0, 0]} s={0.9} lvl={0.85} ld={0.3} turb={0.85 * k} sal={false} />
    <Caño a={[-0.33 + xr, 0.04, 0]} b={[-0.33 + xr, 0.68, 0]} r={0.012} mat={PVCM()} />
    <Burbujas p={[-0.33, 0.05, 0]} t={tt} k={k} w={0.4} hh={0.45} n={26} s={0.011} c={LODOC} />
    <TinC p={[0.33, 0, 0]} s={0.9} lvl={0.85} ld={0.3 * (1 - k * 0.6)} sal={false} />
    <Caño a={[0.33 + xl, 0.04, 0]} b={[0.33 + xl, 0.68, 0]} r={0.012} mat={PVCM()} />
    <Anillo p={[-0.33, 0.66, 0.25]} r={0.1} o={eio(tt, 3.0, 3.4)} c={ROJO} rot={[0, 0, 0]} />
    <Anillo p={[0.33, 0.66, 0.25]} r={0.1} o={eio(tt, 3.2, 3.6)} c={VER} rot={[0, 0, 0]} />
  </Estudio>;
}}</Stage>;

// 12 · EN FRANJAS: el fondo redondo del tinaco visto desde arriba, cubierto de lodo en baldosas; la punta del tubo lo recorre en franjas de ida y vuelta y deja atrás el plástico negro limpio
const DFranjas: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#0f1418">{(tt) => {
  const k = eio(tt, 0.3, 3.9) * 5, f = Math.min(4, Math.floor(k)), u = k - f, dir = f % 2 ? -1 : 1;
  const px = -0.4 + f * 0.2, pz = dir > 0 ? lerp(-0.45, 0.45, u) : lerp(0.45, -0.45, u);
  const N = 24, cs = 0.9 / N, cel: React.ReactNode[] = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const x = -0.45 + (i + 0.5) * cs, z = -0.45 + (j + 0.5) * cs; if (x * x + z * z > 0.46 * 0.46) continue;
    const col5 = Math.min(4, Math.floor((x + 0.5) / 0.2)), d = col5 % 2 ? -1 : 1, zz = d > 0 ? (z + 0.45) / 0.9 : (0.45 - z) / 0.9;
    const limpio = col5 < f ? 1 : col5 === f ? cl((u - zz) * 8) : 0; if (limpio >= 1) continue;
    cel.push(<mesh key={i * N + j} position={[x, 0.012 * (1 - limpio), z]} scale={[1 - limpio * 0.6, 1 - limpio, 1 - limpio * 0.6]}><boxGeometry args={[cs * 1.04, 0.02, cs * 1.04]} /><meshStandardMaterial color={col("#5a3c22", "#664629", rn(i * 31 + j, 5))} roughness={1} /></mesh>);
  }
  return <Estudio t={tt} cam={[0, 1.05, 0.62]} look={[0, 0, 0.02]} orbit={0.006} mesa={false} fit={false}>
    <Fondo z={-1.6} />
    <mesh position={[0, -0.01, 0]}><cylinderGeometry args={[0.5, 0.5, 0.02, 64]} /><meshStandardMaterial color="#1b1d20" roughness={0.45} /></mesh>
    <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.52, 0.52, 0.1, 64, 1, true]} /><meshStandardMaterial color="#26282c" roughness={0.6} side={THREE.DoubleSide} /></mesh>
    {cel}
    <mesh position={[0, 0.012, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.43, 0.53, 64]} /><meshStandardMaterial color="#1b1d20" roughness={0.45} /></mesh>
    <Caño a={[px, 0.03, pz]} b={[px, 0.5, pz - 0.1]} r={0.022} mat={PVCM()} />
    <Halo p={[px, 0.03, pz]} r={0.09} c="#cfe9ff" o={0.35} />
  </Estudio>;
}}</Stage>;
// 13 · 40 DE 1100: el cilindro de agua del tinaco entero; sólo una rebanada finita de arriba se despega, viaja y cae en la cubeta; los números 1100 y 40
const DLitros: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#10151a">{(tt) => {
  const sube = eio(tt, 0.9, 1.6), va = eio(tt, 1.6, 2.6), cae = eio(tt, 2.6, 3.1);
  return <Estudio t={tt} cam={[0.05, 0.85, 1.3]} look={[0.05, 0.28, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} /><Piso />
    <mesh position={[-0.25, 0.3, 0]}><cylinderGeometry args={[0.28, 0.28, 0.6, 48]} />{LIQ(LIMPIA, 0.7)}</mesh>
    <mesh position={[-0.25, 0.006, 0]}><cylinderGeometry args={[0.28, 0.28, 0.012, 48]} /><meshStandardMaterial color={LODO} roughness={1} /></mesh>
    <mesh position={[lerp(-0.25, 0.4, va), lerp(0.615, 0.7, sube) - cae * 0.55, 0]} scale={lerp(1, 0.55, va)}><cylinderGeometry args={[0.28, 0.28, 0.022, 48]} />{LIQ(col(LIMPIA, LODOC, va), 0.9)}</mesh>
    <Cubeta p={[0.4, 0, 0]} s={0.8} lvl={0.4 * cae} c={LODOC} />
    <Num n={1100} p={[-0.25, 0.32, 0.3]} s={0.11} o={eio(tt, 0.3, 0.7)} />
    <Num n={Math.round(40 * eio(tt, 1.2, 2.8))} p={[0.4, 0.55, 0.05]} s={0.1} c={VIN} o={eio(tt, 1.0, 1.4)} />
  </Estudio>;
}}</Stage>;
// 14 · REPOSAR UNA HORA: la cubeta en corte con el agua café; los granitos bajan y se juntan al fondo; arriba queda clara y se vierte a la maceta
const DReposo: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#11161b">{(tt) => {
  const k = eio(tt, 0.3, 2.6), vierte = eio(tt, 2.9, 3.4);
  return <Estudio t={tt} cam={[0.1, 0.45, 1.1]} look={[0.05, 0.18, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} /><Piso />
    <group position={[-0.15, 0, 0]} rotation={[0, 0, -0.5 * vierte]}><Cubeta p={[0, 0, 0]} s={1.2} lvl={0.8} c={col(LODOC, "#9cc8de", k)} corte />
      {Array.from({ length: 30 }, (_, i) => <Grano key={i} p={[(rn(i, 2) - 0.5) * 0.25, lerp(0.05 + rn(i, 3) * 0.25, 0.012 + rn(i, 4) * 0.02, k), (rn(i, 5) - 0.5) * 0.15]} s={0.008} c="#6a4c2c" />)}</group>
    <Reloj p={[0.32, 0.42, 0]} s={0.6} k={k} />
    <group position={[0.42, 0, 0.05]}><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.09, 0.07, 0.14, 24]} /><meshStandardMaterial color="#b0603a" roughness={0.8} /></mesh>
      {[0, 1, 2].map((i) => <mesh key={i} position={[(i - 1) * 0.04, 0.17, 0]} rotation={[0, 0, (i - 1) * 0.4]}><sphereGeometry args={[0.045, 12, 10]} /><meshStandardMaterial color="#3f7a3a" roughness={0.7} /></mesh>)}</group>
    <Chorro a={[0.12, 0.33, 0]} t={tt} k={vierte * (1 - eio(tt, 3.9, 4.1))} v={[0.15, -0.05, 0]} n={10} r={0.008} c="#9cc8de" />
  </Estudio>;
}}</Stage>;

// 15 · CINCO JERINGAS Y MEDIA: la jeringa de 20 ml se llena y se vacía; cada descarga suma un punto al contador hasta 5,5 (110 ml)
const DCloro: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#10151b">{(tt) => {
  const ciclos = eio(tt, 0.3, 3.6) * 5.5, c = ciclos % 1, lleno = c < 0.5 ? c * 2 : (1 - c) * 2;
  return <Estudio t={tt} cam={[0, 0.5, 1.15]} look={[0, 0.3, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} /><Piso />
    <group position={[-0.08, 0.5, 0]} rotation={[0, 0, P2 * 0.75]}>
      <mesh><cylinderGeometry args={[0.035, 0.035, 0.34, 24, 1, true]} />{VIDRIO(0.35)}</mesh>
      <mesh position={[0, -0.17 + 0.17 * lleno, 0]}><cylinderGeometry args={[0.032, 0.032, 0.34 * lleno + 0.001, 24]} />{LIQ("#e9f2d2", 0.7)}</mesh>
      <mesh position={[0, 0.34 * lleno - 0.17 + 0.02, 0]}><cylinderGeometry args={[0.033, 0.033, 0.02, 24]} /><meshStandardMaterial color="#222" /></mesh>
      <mesh position={[0, -0.19, 0]}><coneGeometry args={[0.02, 0.04, 16]} />{VIDRIO(0.5)}</mesh></group>
    <TinC p={[0.22, 0, 0]} s={0.75} lvl={0.85} ld={0} sal={false} />
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.3 + i * 0.07, 0.2, 0.15]}><sphereGeometry args={[0.022, 16, 12]} />{GLOW(i < Math.floor(ciclos) ? VER : "#3a3f45", 0.95)}</mesh>)}
    {ciclos >= 5.49 && <mesh position={[0.05, 0.2, 0.15]} scale={[0.5, 1, 1]}><sphereGeometry args={[0.022, 16, 12]} />{GLOW(VER, 0.95)}</mesh>}
    <Num n={Math.round(ciclos * 20)} p={[-0.13, 0.08, 0.15]} s={0.09} o={eio(tt, 0.4, 0.8)} />
  </Estudio>;
}}</Stage>;

// 16 · TREINTA MINUTOS: el vaso de agua del tinaco espera; el arco del reloj cierra media vuelta; recién ahí el vaso se pone verde y sale la palomita
const DEspera: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#11151a">{(tt) => {
  const k = eio(tt, 0.4, 3.0), ok = eio(tt, 3.0, 3.5);
  return <Estudio t={tt} cam={[0, 0.4, 1.05]} look={[0, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} /><Piso />
    <Arco p={[0, 0.32, 0]} r={0.28} a0={P2} a={-P * k} c={VIN} w={0.035} />
    <Arco p={[0, 0.32, -0.01]} r={0.28} a0={0} a={2 * P} c="#2a2f36" w={0.03} />
    <Num n={Math.round(30 * k)} p={[0, 0.5, 0.02]} s={0.1} c={VIN} />
    <mesh position={[0, 0.17, 0.1]}><cylinderGeometry args={[0.1, 0.085, 0.32, 32, 1, true]} />{VIDRIO(0.35)}</mesh>
    <mesh position={[0, 0.145, 0.1]}><cylinderGeometry args={[0.094, 0.082, 0.26, 32]} />{LIQ(col("#bcd6e2", "#9ee0a8", ok), 0.6)}</mesh>
    <Halo p={[0, 0.15, 0.08]} r={0.2 * ok} c={VER} o={0.45} />
    <Palomita p={[0.2, 0.15, 0.05]} s={0.15} k={ok} />
  </Estudio>;
}}</Stage>;

// 17 · LA TAPA QUE CIERRA: con la tapa chueca entran hojas y polvo al tinaco; la tapa gira, baja y enrosca; las hojas siguientes rebotan encima
const DTapa: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#10151a">{(tt) => {
  const cierra = eio(tt, 1.4, 2.4);
  return <Estudio t={tt} cam={[0.2, 1.05, 1.75]} look={[0, 0.5, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-1.0} c="#2c3a48" /><Piso />
    <Halo p={[0, 0.72, -0.2]} r={0.45} c="#9fc6e6" o={0.25} />
    <Tinaco p={[0, 0, 0]} s={1.0} />
    <group position={[lerp(0.1, 0, cierra), 0.69 + 0.04 * (1 - cierra), lerp(0.08, 0, cierra)]} rotation={[lerp(0.35, 0, cierra), cierra * 3, 0]}>
      <mesh><cylinderGeometry args={[0.12, 0.12, 0.03, 32]} /><meshStandardMaterial color="#26282c" roughness={0.6} /></mesh></group>
    {Array.from({ length: 6 }, (_, i) => { const a = 0.2 + i * 0.6, q = cl((tt - a) / 0.9); if (q <= 0) return null;
      const dentro = a < 1.4, y = dentro ? lerp(1.1, 0.5, q) : lerp(1.1, 0.72, Math.min(1, q * 1.5)) + (q > 0.66 ? (q - 0.66) * 0.4 : 0);
      return <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.1 + (dentro ? 0 : (q - 0.66) * 0.4 * (i % 2 ? 1 : -1)), y, (rn(i, 2) - 0.5) * 0.1]} rotation={[q * 3, q * 2, 0]}><planeGeometry args={[0.08, 0.05]} /><meshStandardMaterial color={["#8a6a2a", "#6a7a2a", "#9a5a2a"][i % 3]} side={THREE.DoubleSide} /></mesh>; })}
    <Anillo p={[0, 0.72, 0]} r={0.14} o={eio(tt, 2.4, 2.8) * 0.9} c={VER} />
  </Estudio>;
}}</Stage>;

// 18 · SIETE CENTÍMETROS: el palo de Doña Lupe al lado de la salida del tinaco; la franja café sube hasta 7 y tapa la boca de la salida (roja)
const DLupe: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#14110d">{(tt) => {
  const k = eio(tt, 0.5, 2.8), tapa = eio(tt, 2.2, 2.8);
  return <Estudio t={tt} cam={[0.15, 0.32, 0.95]} look={[0.05, 0.15, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#18140f" /><Piso />
    <TinC p={[-0.12, 0, 0]} s={1.1} lvl={0.6} ld={k * 0.85} hs={0.075} />
    <group position={[0.42, 0, 0.05]}>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.014, 0.014, 0.6, 16]} /><meshStandardMaterial color="#b9945e" roughness={0.7} /></mesh>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.0165, 0.0165, 0.2, 16]} /><meshStandardMaterial color="#f4f2ec" roughness={0.6} /></mesh>
      <mesh position={[0, 0.0005 + 0.0385 * k, 0]}><cylinderGeometry args={[0.0172, 0.0172, 0.077 * k + 0.001, 16]} /><meshStandardMaterial map={lodoTex()} color="#b08050" roughness={1} /></mesh>
      <Num n={Math.max(1, Math.round(7 * k))} p={[0.12, 0.08, 0]} s={0.08} c="#f4e2c0" /></group>
    <Halo p={[0.2, 0.08, 0.05]} r={0.15 * tapa} c={ROJO} o={0.55} />
  </Estudio>;
}}</Stage>;

// 19 · EL REPASO (items): tres pedestales: el vaso con capas de lodo (el agua quieta deja caer) · la manguera llena de agua limpia · la gota de cloro
const DRecap: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const a = [0, 1, 2].map((i) => AT(h, i, 0.9, 0.5));
  return <Estudio t={tt} cam={[0, 0.42, 1.0]} look={[0, 0.2, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} /><Piso />
    {[0, 1, 2].map((i) => { const x = -0.45 + i * 0.45, up = cl(phys(tt, a[i] - 0.2, 7, 0.45)), on = eio(tt, a[i], a[i] + 0.35); return <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.15, 0.17, 0.1, 32]} /><meshStandardMaterial color="#2a2e34" roughness={0.6} /></mesh>
      <group position={[0, 0.1, 0]} scale={SC(up)}>
        {i === 0 && <><mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.07, 0.07, 0.22, 32, 1, true]} />{VIDRIO(0.3)}</mesh>
          {[0, 1, 2, 3].map((j) => <mesh key={j} position={[0, 0.008 + j * 0.014, 0]}><cylinderGeometry args={[0.068, 0.068, 0.013, 32]} /><meshStandardMaterial color={col("#5a4228", "#9a7a52", j / 3)} roughness={1} /></mesh>)}</>}
        {i === 1 && <>{[0, 1, 2].map((j) => <mesh key={j} rotation={[P2, 0, 0]} position={[0, 0.03 + j * 0.03, 0]}><torusGeometry args={[0.09, 0.014, 10, 40]} />{LIQ("#9fd4f4", 0.8)}</mesh>)}</>}
        {i === 2 && <Gota p={[0, 0.1, 0]} s={0.07} c="#e9f2d2" />}</group>
      <Halo p={[0, 0.2, 0.17]} r={0.2 * on} c={[LODOC, AZUL, VER][i]} o={0.5} /></group>; })}
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  d_lodo: DLodo, d_cubeta: DCubeta, d_sifon: DSifon, d_capas: DCapas, d_salida: DSalida, d_palo: DPalo, d_kit: DKit, d_abajo: DAbajo,
  d_flotador: DFlotador, d_boca: DBoca, d_rapido: DRapido, d_franjas: DFranjas, d_litros: DLitros, d_reposo: DReposo, d_cloro: DCloro,
  d_espera: DEspera, d_tapa: DTapa, d_lupe: DLupe, d_recap: DRecap,
};
