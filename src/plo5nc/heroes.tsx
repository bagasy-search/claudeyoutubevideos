// heroes plo5nc r1 · la unión de PVC sin rosca ni pegamento
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

// 1 · DOMINGO 8 DE LA NOCHE: el reloj corre a las 8; la cortina metálica de la ferretería baja; adelante el tubo partido escupe agua y el charco crece
const NDomingo: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#0e1116">{(tt) => {
  const k = lerp(0.35, 0.667, eio(tt, 0.3, 1.8)), baja = eio(tt, 1.6, 3.2), ch = eio(tt, 0.6, 1.0);
  return <Estudio t={tt} cam={[0.1, 0.42, 1.5]} look={[0, 0.35, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#0f1318" /><Piso />
    <Reloj p={[-0.5, 0.72, -0.5]} s={0.6 * S0(tt, 0.1)} k={k} />
    <group position={[0.35, 0, -0.55]}>
      <mesh position={[0, 0.45, 0]}><planeGeometry args={[0.7, 0.8]} /><meshBasicMaterial color="#1a1612" /></mesh>
      <mesh position={[0, 0.45, 0.02]}><planeGeometry args={[0.6, 0.6]} /><meshBasicMaterial color={col("#ffd98a", "#2a241c", baja)} toneMapped={false} /></mesh>
      <group position={[0, 0.75, 0.04]}>{Array.from({ length: 10 }, (_, i) => i / 10 < baja ? <mesh key={i} position={[0, -i * 0.06, 0]}><boxGeometry args={[0.62, 0.052, 0.012]} />{GALV()}</mesh> : null)}</group></group>
    <group position={[0, 0.08, 0.25]} scale={S0(tt, 0.3)}>
      <TX x0={-0.6} x1={-0.03} r={0.035} /><TX x0={0.03} x1={0.6} r={0.035} />
      <Chorro a={[-0.01, 0.0, 0]} t={tt} k={ch} v={[0.1, 1.4, 0.4]} n={24} r={0.011} />
      <Chorro a={[0.01, 0.0, 0]} t={tt + 0.3} k={ch} v={[-0.1, 1.2, 0.5]} n={18} r={0.01} /></group>
    <mesh position={[0, 0.004, 0.3]} rotation={[-P2, 0, 0]} scale={[1 + 1.5 * ch * eio(tt, 0.8, 4), 1, 1]}><circleGeometry args={[0.18, 32]} />{AGUA(0.5)}</mesh>
  </Estudio>;
}}</Stage>;

// 2 · LAS DOS MEDIDAS: tabla con dos agujeros; el de media cae en el chico (y se prende la llave), el de tres cuartos en el grande (y se prende el tinaco)
const NMedidas: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#12161b">{(tt) => {
  const a = eio(tt, 0.5, 1.6), b = eio(tt, 1.6, 2.7), ok1 = eio(tt, 1.5, 1.9), ok2 = eio(tt, 2.6, 3.0);
  return <Estudio t={tt} cam={[0.0, 0.6, 1.25]} look={[0, 0.2, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} /><Piso5 />
    <group scale={S0(tt, 0.15)}><RBox s={[0.9, 0.06, 0.4]} r={0.01} p={[0, 0.03, 0]}><meshStandardMaterial map={tablasTex()} roughness={0.7} /></RBox>
      <mesh position={[-0.2, 0.062, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.042, 32]} /><meshBasicMaterial color="#0b0b0c" /></mesh>
      <mesh position={[0.2, 0.062, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.058, 32]} /><meshBasicMaterial color="#0b0b0c" /></mesh></group>
    <mesh position={[-0.2, lerp(0.9, 0.2, a), 0]}><cylinderGeometry args={[0.04, 0.04, 0.3, 32]} />{PVCB()}</mesh>
    <mesh position={[0.2, lerp(0.9, 0.2, b), 0]}><cylinderGeometry args={[0.055, 0.055, 0.3, 32]} />{PVCB()}</mesh>
    <Anillo p={[-0.2, 0.066, 0]} r={0.06 + 0.04 * ok1} o={ok1 * 0.9} c={VER} />
    <Anillo p={[0.2, 0.066, 0]} r={0.08 + 0.04 * ok2} o={ok2 * 0.9} c={AZUL} />
    <group position={[-0.25, 0.55, -0.15]} scale={SC(ok1)}><Grifo p={[0, 0, 0]} s={0.8} /></group>
    <group position={[0.24, 0.45, -0.15]} scale={SC(ok2) * 0.45}><Tinaco p={[0, 0, 0]} /></group>
  </Estudio>;
}}</Stage>;

// 3 · SÓLO AGUA FRÍA: del tinaco baja el tubo azul con palomita; del calentador sale el rojo y se cruza
const NFria: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#10151b">{(tt) => {
  const az = eio(tt, 0.5, 1.6), rj = eio(tt, 1.7, 2.8), ok = eio(tt, 1.5, 1.9), no = eio(tt, 2.8, 3.2);
  return <Estudio t={tt} cam={[0, 0.45, 1.6]} look={[0, 0.35, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} /><Piso />
    <group position={[-0.45, 0.45, -0.2]} scale={0.7 * S0(tt, 0.15)}><Tinaco p={[0, 0, 0]} /></group>
    <Calentador p={[0.45, 0, -0.2]} s={0.8 * S0(tt, 0.3)} glow={rj} gc={RED} />
    <Caño a={[-0.45, 0.45, -0.2]} b={[-0.45, 0.06, -0.2]} r={0.025} mat={PVCB()} /><Caño a={[-0.45, 0.06, -0.2]} b={[-0.1, 0.06, 0.1]} r={0.025} mat={PVCB()} />
    <Llena a={[-0.45, 0.45, -0.2]} b={[-0.45, 0.06, -0.2]} k={az} r={0.027} c={AZUL} o={0.6} />
    <Caño a={[0.45, 0.6, -0.2]} b={[0.1, 0.6, 0.1]} r={0.025} mat={PVCB()} />
    <Llena a={[0.45, 0.6, -0.2]} b={[0.1, 0.6, 0.1]} k={rj} r={0.027} c={RED} o={0.6} />
    <Palomita p={[-0.1, 0.25, 0.15]} s={0.25} k={ok} /><Cruz p={[0.1, 0.75, 0.15]} s={0.22} k={no} />
  </Estudio>;
}}</Stage>;

// 4 · VACIAR LA LÍNEA: la llave a la salida del tinaco se cierra, el tubo de vidrio se vacía y la llave de abajo suelta lo último en la cubeta
const NVacia: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#10151a">{(tt) => {
  const cierra = eio(tt, 0.5, 1.2), baja = eio(tt, 1.4, 3.4), ab = eio(tt, 1.2, 1.5), ch = ab * (1 - eio(tt, 3.2, 3.7));
  return <Estudio t={tt} cam={[0.2, 0.5, 1.7]} look={[0, 0.45, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} /><Piso />
    <group position={[-0.35, 0.85, -0.1]} scale={0.75}><Tinaco p={[0, 0, 0]} x={1} lvl={0.8} /></group>
    <Caño a={[-0.35, 0.85, -0.1]} b={[-0.35, 0.76, -0.1]} r={0.025} mat={PVCB()} />
    <Valvula p={[-0.35, 0.72, -0.1]} ang={lerp(0, P2, cierra)} rot={[0, 0, P2]} s={0.9} />
    <Caño a={[-0.35, 0.68, -0.1]} b={[-0.35, 0.15, -0.1]} r={0.03} mat={VIDRIO(0.3)} />
    <Caño a={[-0.35, 0.15, -0.1]} b={[0.3, 0.15, -0.1]} r={0.03} mat={VIDRIO(0.3)} />
    <Llena a={[-0.35, 0.68 - 0.53 * baja, -0.1]} b={[-0.35, 0.15, -0.1]} k={1 - 0.98 * eio(tt, 3.2, 3.4)} r={0.026} c={AZUL} o={0.75} />
    <Llena a={[-0.35, 0.15, -0.1]} b={[0.3, 0.15, -0.1]} k={1 - eio(tt, 3.0, 3.5)} r={0.026} c={AZUL} o={0.75} />
    <Valvula p={[0.3, 0.15, -0.1]} ang={lerp(P2, 0, ab)} s={0.8} c="#2a7a3a" />
    <Chorro a={[0.36, 0.12, -0.1]} t={tt} k={ch} v={[0.4, 0, 0.1]} n={18} r={0.01} />
    <Cubeta p={[0.5, 0, -0.05]} s={0.7} lvl={0.15 + 0.4 * baja} />
    <Halo p={[-0.35, 0.72, 0]} r={0.15 * cierra * (1 - baja)} c={RED} o={0.4} />
  </Estudio>;
}}</Stage>;

// 5 · LA VIRUTA VIAJA: dentro del tubo de vidrio el agua arrastra una viruta blanca rizada hasta el filtro de la llave; la malla se pone roja y el chorro se achica
const NViruta: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#0f1418">{(tt) => {
  const u = eio(tt, 0.6, 2.6), tapa = eio(tt, 2.5, 3.0), x = lerp(-0.6, 0.47, u);
  return <Estudio t={tt} cam={[0.1, 0.25, 1.15]} look={[0.05, 0.1, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <Caño a={[-0.75, 0.1, 0]} b={[0.5, 0.1, 0]} r={0.06} mat={VIDRIO(0.25)} />
    <Llena a={[-0.75, 0.1, 0]} b={[0.49, 0.1, 0]} k={1} r={0.055} c={AZUL} o={0.35} />
    {Array.from({ length: 6 }, (_, i) => <Flecha key={i} p={[-0.6 + ((tt * 0.3 + i / 6) % 1) * 1.0, 0.1, 0.075]} k={0.6} c="#cfe9ff" rot={[0, 0, -P2]} s={0.4} />)}
    <group position={[x, 0.1 + 0.02 * Math.sin(tt * 3), 0.0]} rotation={[tt * 2, tt * 1.4, 0]}><mesh><torusKnotGeometry args={[0.018, 0.004, 48, 6, 2, 3]} /><meshStandardMaterial color="#f6f4ee" roughness={0.5} /></mesh></group>
    <mesh position={[0.505, 0.1, 0]} rotation={[0, P2, 0]}><circleGeometry args={[0.058, 32]} /><meshStandardMaterial map={mallaTex()} color={col("#ffffff", RED, tapa)} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.56, 0.1, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.07, 0.07, 0.08, 32]} />{M.cromo()}</mesh>
    <Chorro a={[0.61, 0.08, 0]} t={tt} k={lerp(1.3, 0.35, tapa)} v={[0.5, 0, 0.1]} n={20} r={0.011} />
    <Halo p={[0.52, 0.1, 0.07]} r={0.16 * tapa} c={RED} o={0.45} />
  </Estudio>;
}}</Stage>;

// 6 · EL CEPILLO QUE RAYA: arriba la orilla filosa entra y deja una raya roja por dentro; abajo la punta con bisel entra deslizando y se enciende verde
const NCepillo: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#11161b">{(tt) => {
  const e1 = eio(tt, 0.5, 2.0), e2 = eio(tt, 1.9, 3.3), ok = eio(tt, 3.2, 3.6);
  const carril = (y: number, k: number, bisel: boolean) => <group position={[0, y, 0]}>
    <mesh position={[0.15, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.062, 0.062, 0.5, 36, 1, true, P2, P]} /><meshStandardMaterial color="#eceae2" roughness={0.4} side={THREE.DoubleSide} /></mesh>
    <group position={[lerp(-0.55, 0.05, k), 0, 0]}><TX x0={-0.5} x1={0} r={0.05} />
      {bisel ? <mesh position={[0.012, 0, 0]} rotation={[0, 0, -P2]}><cylinderGeometry args={[0.042, 0.05, 0.025, 36]} />{PVCB()}</mesh> : <Tapa x={0.0} ri={0.044} />}</group>
    {!bisel && k > 0.02 && <mesh position={[-0.1 + 0.25 * k, -0.056, 0.0]}><boxGeometry args={[Math.max(0.001, 0.5 * k), 0.004, 0.012]} />{GLOW(RED, 0.9)}</mesh>}</group>;
  return <Estudio t={tt} cam={[0.05, 0.1, 1.05]} look={[0, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    {carril(0.14, e1, false)}{carril(-0.16, e2, true)}
    <Halo p={[0.1, 0.14, 0.07]} r={0.18 * eio(tt, 1.8, 2.1)} c={RED} o={0.35} />
    <Halo p={[0.1, -0.16, 0.07]} r={0.22 * ok} c={VER} o={0.45} />
  </Estudio>;
}}</Stage>;

// 7 · BLANDO COMO CUERO: la punta del tubo se entibia (ámbar) con el termómetro subiendo; el cono la abre; el frío la vuelve blanca y dura
const NCuero: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#14110e">{(tt) => {
  const cal = eio(tt, 0.4, 1.6) * (1 - eio(tt, 2.8, 3.6)), abre = eio(tt, 1.6, 2.6), baja = eio(tt, 1.3, 2.4), cono = eio(tt, 1.0, 1.3) * (1 - eio(tt, 2.6, 3.0));
  return <Estudio t={tt} cam={[0.25, 0.42, 1.1]} look={[0, 0.3, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#15120e" /><Piso5 />
    <group scale={S0(tt, 0.1)}><mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.05, 0.05, 0.4, 36]} />{PVCM(col("#eceae2", CAL, cal * 0.8))}</mesh>
      <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.05 + 0.014 * abre, 0.05, 0.1, 36, 1, true]} /><meshPhysicalMaterial color={col("#eceae2", CAL, cal)} emissive={CAL} emissiveIntensity={0.3 * cal} roughness={0.35} side={THREE.DoubleSide} /></mesh></group>
    <mesh position={[0, lerp(0.8, 0.52, baja), 0]} rotation={[P, 0, 0]} scale={SC(cono)}><coneGeometry args={[0.07, 0.18, 32]} />{M.cromo()}</mesh>
    <Termometro p={[-0.38, 0.55, -0.1]} s={0.35 * S0(tt, 0.3)} v={0.2 + 0.5 * cal} />
    <Halo p={[0, 0.45, 0.08]} r={0.25 * cal} c={CAL} o={0.4} />
    <Halo p={[0, 0.45, 0.08]} r={0.2 * eio(tt, 3.2, 3.7)} c={AZUL} o={0.45} />
  </Estudio>;
}}</Stage>;

// 8 · LA RAYA DE PROFUNDIDAD: la regla se apoya en la punta, el plumón da la vuelta y deja el anillo negro a 4-5 cm
const NMarca: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#12161b">{(tt) => {
  const reg = eio(tt, 0.4, 1.2), env = eio(tt, 1.4, 3.0), X = 0.18, ang = env * 2 * P;
  return <Estudio t={tt} cam={[0.3, 0.32, 0.9]} look={[0.1, 0.08, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} /><Piso5 />
    <group position={[0, 0.06, 0]} scale={S0(tt, 0.15)}><TX x0={-0.5} x1={0.3} r={0.055} /><Tapa x={0.3} r={0.055} ri={0.047} />
      <mesh position={[X, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.0565, 0.0565, 0.008, 36, 1, true, 0, 2 * P * Math.max(0.01, env)]} /><meshBasicMaterial color="#111" side={THREE.DoubleSide} /></mesh></group>
    <group position={[lerp(0.8, 0.2, reg), 0.12, 0.0]}><RBox s={[0.25, 0.008, 0.05]} r={0.003}><meshStandardMaterial map={reglaTex()} roughness={0.6} /></RBox></group>
    <group position={[X, 0.06 + 0.075 * Math.cos(ang), 0.075 * Math.sin(ang)]} rotation={[ang, 0, 0]} scale={SC(eio(tt, 1.0, 1.4))}>
      <mesh position={[0, 0.075, 0]}><cylinderGeometry args={[0.012, 0.012, 0.13, 16]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      <mesh position={[0, 0.002, 0]} rotation={[P, 0, 0]}><coneGeometry args={[0.012, 0.02, 12]} /><meshStandardMaterial color="#111" /></mesh></group>
    <Halo p={[X, 0.06, 0.09]} r={0.14 * eio(tt, 3.0, 3.4)} c={VER} o={0.45} />
  </Estudio>;
}}</Stage>;

// 9 · NADA DE LLAMA: el tubo sobre la llama se pone café en una mancha, sale humo gris; cruz roja
const NLlama: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#120e0c">{(tt) => {
  const f = eio(tt, 0.4, 0.8), q = eio(tt, 0.9, 2.8), no = eio(tt, 2.8, 3.2);
  return <Estudio t={tt} cam={[0.15, 0.3, 0.95]} look={[0, 0.15, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#120f0c" />
    <group position={[0, 0.25, 0]} scale={S0(tt, 0.1)}><TX x0={-0.45} x1={0.45} r={0.05} />
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.0508, 0.0508, 0.08 + 0.12 * q, 36]} /><meshStandardMaterial color={col("#e9e2cf", CAFE, q)} roughness={0.9} transparent opacity={cl(q * 2)} /></mesh></group>
    <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.035, 0.04, 0.08, 20]} /><meshStandardMaterial color="#c4281c" /></mesh>
    <Llama p={[0, 0.08, 0]} t={tt} k={f} s={1.0} />
    <Humo p={[0, 0.3, 0]} t={tt} k={q} n={10} h={0.5} />
    <Cruz p={[0.28, 0.42, 0.1]} s={0.2} k={no} />
  </Estudio>;
}}</Stage>;

// 10 · EL AGUA NO PASA DE CIEN: olla hirviendo con la punta del tubo dentro; el termómetro sube y se clava en 100; el tubo sale blanco
const NOlla: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#12100d">{(tt) => {
  const v = lerp(0.15, 0.67, eio(tt, 0.4, 2.0)), mete = eio(tt, 0.6, 1.4), ok = eio(tt, 3.0, 3.4);
  return <Estudio t={tt} cam={[0.15, 0.5, 1.15]} look={[0, 0.22, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#15120e" /><Mostrador />
    <Olla p={[0, 0.0, 0]} t={tt} s={S0(tt, 0.1)} hierve={eio(tt, 0.3, 1.0)} />
    <mesh position={[0.02, lerp(0.6, 0.32, mete), 0.02]} rotation={[0, 0, 0.12]}><cylinderGeometry args={[0.04, 0.04, 0.42, 32]} />{PVCB()}</mesh>
    <Termometro p={[0.42, 0.5, -0.05]} s={0.35 * S0(tt, 0.3)} v={v + 0.004 * Math.sin(tt * 4)} />
    <Halo p={[0.42, 0.5, 0.05]} r={0.18 * eio(tt, 1.9, 2.3)} c="#ffd36a" o={0.4} />
    <Halo p={[0.02, 0.3, 0.12]} r={0.2 * ok} c={VER} o={0.45} />
  </Estudio>;
}}</Stage>;

// 11 · LA PISTOLA DA LA VUELTA: la pistola de calor gira alrededor de la punta mientras el tubo rota; un anillo naranja crece parejo en toda la vuelta
const NPistola: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#13100d">{(tt) => {
  const g = eio(tt, 0.5, 3.2), ang = g * 4 * P, cal = eio(tt, 0.8, 3.2);
  return <Estudio t={tt} cam={[0.55, 0.25, 0.85]} look={[0.1, 0.12, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#15110d" /><Piso5 />
    <group position={[0, 0.12, 0]} scale={S0(tt, 0.1)}><group rotation={[ang * 0.5, 0, 0]}><TX x0={-0.4} x1={0.3} r={0.05} />
      <mesh position={[0.24, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.0508, 0.0508, 0.1, 36, 1, true, 0, 2 * P * Math.max(0.01, cal)]} /><meshBasicMaterial color={CAL} transparent opacity={0.55} toneMapped={false} side={THREE.DoubleSide} /></mesh>
      <mesh position={[-0.1, 0.051, 0]}><boxGeometry args={[0.05, 0.002, 0.012]} /><meshBasicMaterial color="#1a1a1a" /></mesh></group></group>
    <group position={[0.24, 0.12, 0]} rotation={[ang, 0, 0]}><Pistola p={[0, 0.2, 0]} rot={[0, 0, -P2]} on={eio(tt, 0.3, 0.6)} /></group>
    <Halo p={[0.24, 0.12, 0.1]} r={0.15 * cal} c={CAL} o={0.4} />
  </Estudio>;
}}</Stage>;

// 12 · EL TEFLÓN HACE DE EMPAQUE: en corte, el tubo de adentro recibe 3 vueltas de cinta blanca; la campana se encoge sobre ella; las flechas de agua chocan y se apagan
const NTeflon: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#10151b">{(tt) => {
  const env = eio(tt, 0.4, 1.6), enc = eio(tt, 1.8, 2.8), ok = eio(tt, 3.1, 3.5);
  return <Estudio t={tt} cam={[0.1, 0.25, 1.0]} look={[0, 0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <TX x0={-0.55} x1={0.25} r={0.05} />
    {[0, 1, 2].map((i) => <mesh key={i} position={[0.05 - i * 0.045, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.053, 0.053, 0.042, 36, 1, true, 0, 2 * P * Math.max(0.01, cl(env * 3 - i))]} /><meshStandardMaterial color="#fbfbf8" roughness={0.7} side={THREE.DoubleSide} /></mesh>)}
    <mesh position={[0.15, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[lerp(0.075, 0.058, enc), lerp(0.075, 0.058, enc), 0.32, 36, 1, true, P2, P]} /><meshPhysicalMaterial color="#e6e4dc" roughness={0.4} side={THREE.DoubleSide} /></mesh>
    <TX x0={0.31} x1={0.6} r={0.058} />
    {[0, 1, 2].map((i) => { const x = lerp(0.45, 0.12, ((tt * 0.5 + i / 3) % 1)); return <Flecha key={i} p={[x, 0.0, 0.0]} k={0.8 * (1 - ok)} c={AZUL} rot={[0, 0, P2]} s={0.45} />; })}
    <Halo p={[0.0, 0.0, 0.1]} r={0.2 * ok} c={VER} o={0.45} />
  </Estudio>;
}}</Stage>;

// 13 · HASTA DÓNDE AGUANTA: tres barras de presión (tinaco · calle · bomba) suben contra la línea roja de la campana; la del tinaco queda debajo, las otras la pasan
const NLimites: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#11151a">{(tt) => {
  const v = [0.22, 0.6, 0.95], L = 0.38, a = [0.5, 1.2, 1.9];
  return <Estudio t={tt} cam={[0, 0.45, 1.45]} look={[0, 0.4, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    {v.map((vv, i) => { const k = eio(tt, a[i], a[i] + 0.9), x = -0.4 + i * 0.4, fin = eio(tt, a[i] + 0.9, a[i] + 1.2); return <group key={i}>
      <Barra p={[x, 0.05, 0]} v={vv * k} c={i === 0 ? AZUL : i === 1 ? "#e0a030" : RED} w={0.16} hmax={0.7} />
      {i === 0 ? <group position={[x, 0.85, -0.05]} scale={0.3}><Tinaco p={[0, 0, 0]} /></group> : i === 1 ? <group position={[x, 0.88, -0.05]} scale={0.6}><Valvula p={[0, 0, 0]} ang={0} rot={[0, 0, P2]} /></group> :
        <group position={[x, 0.9, -0.05]}><RBox s={[0.16, 0.1, 0.12]} r={0.02}><meshStandardMaterial color="#2c5aa0" roughness={0.45} /></RBox></group>}
      {i === 0 ? <Palomita p={[x, 0.05 + 0.7 * vv + 0.1, 0.1]} s={0.18} k={fin} /> : <Cruz p={[x, 0.05 + 0.7 * vv * k + 0.08, 0.1]} s={0.14} k={fin} />}</group>; })}
    <mesh position={[0, 0.05 + 0.7 * L, 0.06]} scale={[SC(eio(tt, 0.2, 0.6)), 1, 1]}><boxGeometry args={[1.25, 0.008, 0.005]} />{GLOW(RED, 0.9)}</mesh>
  </Estudio>;
}}</Stage>;

// 14 · LAS TRES PARTES DEL COPLE: el cople se abre en el aire (cuerpo, dos tuercas, dos anillos) y vuelve a cerrarse
const NCople: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#10141a">{(tt) => {
  const sep = eio(tt, 0.5, 1.6) * (1 - eio(tt, 2.8, 3.6)), ok = eio(tt, 3.5, 3.9);
  return <Estudio t={tt} cam={[0.15, 0.35, 1.1]} look={[0, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} /><Piso5 />
    <group rotation={[0, 0.25 * Math.sin(tt * 0.6), 0]}><Cople p={[0, 0.25 + 0.03 * Math.sin(tt * 2), 0]} sep={sep} s={1.3 * S0(tt, 0.15)} ring={eio(tt, 0.8, 1.4)} /></group>
    <Sombra p={[0, 0.003, 0]} r={0.3} sx={1.8} />
    <Halo p={[0, 0.25, 0.14]} r={0.3 * ok} c={VER} o={0.4} />
  </Estudio>;
}}</Stage>;

// 15 · EL HULE SE APLASTA: en corte, la tuerca avanza en cuña y aplasta el anillo contra el tubo hasta llenar el hueco; las gotas se quedan adentro
const NOring: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#0f1418">{(tt) => {
  const ap = eio(tt, 0.8, 2.4), ok = eio(tt, 2.9, 3.3);
  return <Estudio t={tt} cam={[0.0, 0.15, 0.75]} look={[0, 0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.5} />
    <mesh position={[0, -0.12, 0]}><boxGeometry args={[1.0, 0.12, 0.2]} /><meshPhysicalMaterial color="#e9e7df" roughness={0.4} /></mesh>
    <mesh position={[0.1, 0.17, 0]}><boxGeometry args={[0.6, 0.06, 0.2]} /><meshStandardMaterial color="#3b5ea8" roughness={0.45} /></mesh>
    <mesh position={[lerp(0.3, 0.13, ap), 0.075, 0]} rotation={[0, 0, P / 4]}><boxGeometry args={[0.15, 0.15, 0.19]} /><meshStandardMaterial color="#34539a" roughness={0.45} /></mesh>
    <mesh position={[0.0, 0.0, 0]} rotation={[P2, 0, 0]} scale={[1 + 0.45 * ap, 1, 1 - 0.4 * ap]}><cylinderGeometry args={[0.04, 0.04, 0.19, 32]} /><meshStandardMaterial color="#1c1c1c" roughness={0.7} /></mesh>
    {[0, 1, 2].map((i) => <Gota key={i} p={[-0.22 + 0.025 * i, -0.04 + 0.03 * ((tt * 0.6 + i / 3) % 1), 0.11]} s={0.012} />)}
    <Flecha p={[-0.12, 0.0, 0.12]} k={0.9 * (1 - ok)} c={AZUL} rot={[0, 0, -P2]} s={0.5} />
    <Halo p={[0, 0.0, 0.12]} r={0.2 * ok} c={VER} o={0.45} />
  </Estudio>;
}}</Stage>;

// 16 · MEDIA VUELTA, NO MÁS: arco alrededor de la tuerca: verde hasta "a mano", amarillo la media vuelta con la llave, la zona roja de más queda apagada
const NMediaVuelta: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#11151a">{(tt) => {
  const mano = eio(tt, 0.4, 1.5), media = eio(tt, 1.7, 2.9), ang = mano * 1.6 * P + media * P;
  return <Estudio t={tt} cam={[0.15, 0.05, 1.0]} look={[0, 0, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.5} />
    <TX x0={-0.6} x1={0.6} r={0.04} />
    <mesh rotation={[ang, 0, P2]}><cylinderGeometry args={[0.1, 0.1, 0.1, 8]} /><meshStandardMaterial color="#3b5ea8" roughness={0.45} /></mesh>
    <group position={[0, 0, 0.08]}>
      <Arco p={[0, 0, 0]} r={0.26} a0={P2} a={-1.6 * P * mano} c={VER} w={0.03} />
      <Arco p={[0, 0, 0]} r={0.26} a0={P2 - 1.6 * P} a={-P * media} c="#ffd36a" w={0.03} />
      <Arco p={[0, 0, 0]} r={0.31} a0={P2 - 2.6 * P} a={-0.4 * P} c={RED} w={0.02} o={0.35 + 0.3 * eio(tt, 2.9, 3.3)} /></group>
    <Perico p={[0.0, -0.32, 0.1]} rot={[0, 0, P2 + 0.3 * Math.sin(media * P)]} s={0.7 * SC(eio(tt, 1.5, 1.8))} />
  </Estudio>;
}}</Stage>;

// 17 · LA CORONA DE DIENTES: el tubo entra en la unión rápida (vidrio), los dientitos se doblan y lo muerden; la flecha roja jala y el tubo ni se mueve
const NDientes: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#0f1418">{(tt) => {
  const ent = eio(tt, 0.4, 1.6), jala = eio(tt, 2.0, 2.4) * (1 - eio(tt, 3.2, 3.5)), mord = eio(tt, 1.4, 1.8);
  return <Estudio t={tt} cam={[0.35, 0.25, 0.85]} look={[0.05, 0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <mesh position={[0.15, 0.05, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.075, 0.075, 0.3, 36, 1, true]} />{VIDRIO(0.3)}</mesh>
    <group position={[0.06, 0.05, 0]}>{Array.from({ length: 14 }, (_, i) => { const a = i / 14 * 2 * P; return <mesh key={i} position={[0, 0.063 * Math.cos(a), 0.063 * Math.sin(a)]} rotation={[a, 0, lerp(0.2, -0.6, mord)]}><coneGeometry args={[0.006, 0.02, 6]} />{M.cromo("#c8ccd2")}</mesh>; })}</group>
    <group position={[lerp(-0.4, 0, ent) - 0.004 * jala * Math.sin(tt * 30), 0.05, 0]}><TX x0={-0.5} x1={0.2} r={0.05} /></group>
    <Flecha p={[-0.45, 0.17, 0]} k={jala} c={RED} rot={[0, 0, P2]} s={1.0} />
    <Halo p={[0.06, 0.05, 0.1]} r={0.15 * mord} c="#cfe9ff" o={0.4} />
  </Estudio>;
}}</Stage>;

// 18 · LOS 4 ERRORES (items): repisa con cuatro tramos; con cada error el suyo se marca: mancha café · viruta · tubo a medias · martillazo de agua
const NErrores4: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const a = Array.from({ length: 4 }, (_, i) => AT(h, i, 0.7, 0.5));
  return <Estudio t={tt} cam={[0, 0.26, 0.98]} look={[0, 0.12, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <mesh position={[0, 0.0, 0]}><boxGeometry args={[1.6, 0.03, 0.4]} /><meshStandardMaterial map={tablasTex()} roughness={0.7} /></mesh>
    {Array.from({ length: 4 }, (_, i) => { const x = -0.57 + i * 0.38, on = eio(tt, a[i], a[i] + 0.35), up = cl(phys(tt, a[i] - 0.25, 7, 0.45)); if (up <= 0.001) return null; return <group key={i} position={[x, 0.12 + 0.04 * (1 - up), 0]} scale={up}>
      <TX x0={-0.14} x1={0.14} r={0.04} />
      {i === 0 && <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.0408, 0.0408, 0.1 * on + 0.001, 30]} /><meshStandardMaterial color={CAFE} roughness={0.95} /></mesh>}
      {i === 1 && <group position={[0.15, 0, 0]} scale={SC(on)}><mesh><torusKnotGeometry args={[0.02, 0.005, 48, 6, 2, 3]} /><meshStandardMaterial color="#f6f4ee" /></mesh></group>}
      {i === 2 && <mesh position={[0.1, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.055, 0.055, 0.12, 30]} /><meshStandardMaterial color="#3b5ea8" transparent opacity={0.85} /></mesh>}
      {i === 3 && <Flecha p={[0, 0.12, 0]} k={on} c={AZUL} rot={[0, 0, P]} s={0.7} />}
      <Halo p={[0, 0.0, 0.08]} r={0.17 * on} c={RED} o={0.5} /></group>; })}
  </Estudio>;
}}</Stage>;

// 19 · DOS MANÓMETROS: el del tinaco apenas se mueve, el de la calle sube mucho más
const NManometros: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#10151a">{(tt) => {
  const a = lerp(0.02, 0.14, eio(tt, 0.6, 1.8)), b = lerp(0.02, 0.62, eio(tt, 1.6, 3.0));
  return <Estudio t={tt} cam={[0, 0.5, 1.35]} look={[0, 0.45, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} /><Piso />
    <group position={[-0.32, 0.55, 0]} scale={S0(tt, 0.1)}><Termometro p={[0, 0, 0]} s={0.6} v={a} /></group>
    <group position={[0.32, 0.55, 0]} scale={S0(tt, 0.3)}><Termometro p={[0, 0, 0]} s={0.6} v={b + 0.004 * Math.sin(tt * 5)} /></group>
    <group position={[-0.32, 0.8, -0.35]} scale={0.32 * S0(tt, 0.4)}><Tinaco p={[0, 0, 0]} /></group>
    <group position={[0.32, 0.95, -0.35]} scale={S0(tt, 0.5)}><Valvula p={[0, 0, 0]} ang={0} rot={[0, 0, P2]} s={0.9} /></group>
    <Halo p={[0.32, 0.55, 0.08]} r={0.25 * eio(tt, 2.8, 3.2)} c="#ffd36a" o={0.35} />
  </Estudio>;
}}</Stage>;

// 20 · EL PAPEL DETECTOR: bajo la unión, la hoja de periódico; cae una gota y la mancha crece; se cambia la hoja y el reloj da dos vueltas: seca
const NPapel: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#12161b">{(tt) => {
  const g = cl((tt - 0.6) / 0.6), man = eio(tt, 1.2, 1.9) * (1 - eio(tt, 2.1, 2.4)), rel = eio(tt, 2.4, 3.6), ok = eio(tt, 3.5, 3.9);
  return <Estudio t={tt} cam={[0.0, 0.7, 1.0]} look={[0, 0.12, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} /><Piso />
    <mesh position={[0, 0.006, 0.05]} rotation={[-P2, 0, 0.05]}><planeGeometry args={[0.6, 0.45]} /><meshStandardMaterial map={diarioTex()} roughness={0.9} /></mesh>
    <mesh position={[0.02, 0.009, 0.06]} rotation={[-P2, 0, 0]} scale={SC(man)}><circleGeometry args={[0.09, 32]} /><meshBasicMaterial color="#6b6252" transparent opacity={0.65} depthWrite={false} /></mesh>
    <group position={[0, 0.32, 0.05]}><TX x0={-0.5} x1={-0.06} r={0.035} /><Cople p={[0, 0, 0]} s={0.6} /><TX x0={0.06} x1={0.5} r={0.035} /></group>
    {g > 0 && g < 1 && <Gota p={[0.02, 0.28 - 0.27 * g * g, 0.06]} s={0.014} />}
    <Reloj p={[0.42, 0.3, -0.25]} s={0.35 * S0(tt, 2.2)} k={2 * rel} />
    <Palomita p={[0, 0.15, 0.25]} s={0.22} k={ok} />
  </Estudio>;
}}</Stage>;

// 21 · EL SOL TAMBIÉN CALIENTA: en la azotea el sol cruza y la campana de la bajada se pone naranja; entra una funda de tubo partido y la sombra la enfría
const NSol: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#151a22">{(tt) => {
  const s = eio(tt, 0.3, 2.0), cal = s * (1 - eio(tt, 2.6, 3.5)), funda = eio(tt, 2.2, 2.9);
  return <Estudio t={tt} cam={[0.35, 0.55, 1.6]} look={[0, 0.45, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#3c5a78" /><Piso c="#6a625a" />
    <group position={[-0.25, 0.25, -0.2]} scale={0.8 * S0(tt, 0.1)}><Tinaco p={[0, 0, 0]} /></group>
    <Caño a={[-0.05, 0.3, -0.2]} b={[0.5, 0.3, -0.2]} r={0.03} mat={PVCB()} />
    <mesh position={[0.25, 0.3, -0.2]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.036, 0.036, 0.1, 30]} /><meshPhysicalMaterial color={col("#eceae2", CAL, cal)} emissive={CAL} emissiveIntensity={0.4 * cal} roughness={0.4} /></mesh>
    <mesh position={[lerp(0.9, 0.25, funda), 0.3, -0.2]} rotation={[0, 0, P2]} scale={SC(funda)}><cylinderGeometry args={[0.055, 0.055, 0.26, 30, 1, true, -P2, P]} /><meshStandardMaterial color="#f4f4f0" roughness={0.6} side={THREE.DoubleSide} /></mesh>
    <group position={[lerp(-0.7, 0.5, s), 1.05 + 0.1 * Math.sin(s * P), -0.5]}><mesh><sphereGeometry args={[0.08, 24, 16]} />{GLOW("#ffe08a")}</mesh><Halo p={[0, 0, 0.01]} r={0.35} c="#ffd36a" o={0.5} /></group>
    <Halo p={[0.25, 0.3, -0.1]} r={0.2 * cal} c={CAL} o={0.45} />
  </Estudio>;
}}</Stage>;

// 22 · LO QUE DON CHUY NUNCA HACÍA (items): llama tachada · pan y tubo se queman por fuera · la notita para el dueño
const NChuyPan: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#14110d">{(tt) => {
  const a0 = AT(h, 0, 1.0, 0.5), a1 = AT(h, 1, 1.0, 0.5), a2 = AT(h, 2, 1.0, 0.5), q = eio(tt, a1, a1 + 0.8), nota = cl(phys(tt, a2, 7, 0.45));
  return <Estudio t={tt} cam={[0.0, 0.4, 1.2]} look={[0, 0.2, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#17130e" /><Madera />
    <Llama p={[0.0, 0.0, 0.25]} t={tt} k={eio(tt, a0, a0 + 0.4) * (1 - eio(tt, a1 + 0.8, a1 + 1.2))} s={1.2} /><Cruz p={[0, 0.35, 0.3]} s={0.14} k={eio(tt, a0 + 0.3, a0 + 0.6) * (1 - q)} />
    <mesh position={[-0.3, 0.08, 0]} scale={[1.4, 0.8, 0.9]}><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color={col("#d9a45a", "#3a2412", q)} roughness={0.85} /></mesh>
    <group position={[0.3, 0.05, 0]}><TX x0={-0.15} x1={0.15} r={0.045} c={col("#eceae2", CAFE, q)} /></group>
    <group position={[0.0, 0.42, -0.3]} scale={SC(nota)} rotation={[0, 0, 0.05]}><mesh><planeGeometry args={[0.32, 0.22]} /><meshStandardMaterial map={papel("p5c:nota", ["el lunes", "va el cople"], { w: 512, h: 352, size: 120 })} roughness={0.9} /></mesh></group>
    <Halo p={[0.0, 0.42, -0.25]} r={0.25 * nota} c="#ffd36a" o={0.35} />
  </Estudio>;
}}</Stage>;

// 23 · EL REPASO (items): tres pedestales: la olla (campana del apuro) · el cople (para quedarse) · el papel seco (la prueba); cada uno sube y se enciende
const NRecap5c: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const a = Array.from({ length: 3 }, (_, i) => AT(h, i, 0.9, 0.5));
  return <Estudio t={tt} cam={[0, 0.45, 1.3]} look={[0, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} /><Piso5 />
    {[0, 1, 2].map((i) => { const x = -0.45 + i * 0.45, up = cl(phys(tt, a[i] - 0.2, 7, 0.45)), on = eio(tt, a[i], a[i] + 0.35); return <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.15, 0.17, 0.1, 32]} /><meshStandardMaterial color="#2a2e34" roughness={0.6} /></mesh>
      <group position={[0, 0.1 + 0.12 * (1 - up), 0]} scale={SC(up)}>
        {i === 0 && <Olla p={[0, 0, 0]} t={tt} s={0.6} hierve={on} />}
        {i === 1 && <Cople p={[0, 0.08, 0]} s={0.9} />}
        {i === 2 && <mesh position={[0, 0.012, 0]} rotation={[-P2, 0, 0.2]}><planeGeometry args={[0.24, 0.18]} /><meshStandardMaterial map={diarioTex()} roughness={0.9} /></mesh>}</group>
      <Halo p={[0, 0.2, 0.17]} r={0.2 * on} c={VER} o={0.5} /></group>; })}
  </Estudio>;
}}</Stage>;

// 24 · EL PREMIO: dos uniones en la balanza del tiempo: la campana (naranja, reloj de arena que se vacía = de emergencia) y el cople (verde, se queda)
const NPremio: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#11151a">{(tt) => {
  const a = cl(phys(tt, 0.3, 7, 0.45)), b = cl(phys(tt, 1.4, 7, 0.45)), arena = eio(tt, 0.8, 3.4), ok = eio(tt, 2.4, 2.8), inc = 0.12 * eio(tt, 1.6, 3.0);
  return <Estudio t={tt} cam={[0, 0.45, 1.25]} look={[0, 0.3, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} /><Piso5 />
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.02, 0.03, 0.4, 16]} />{M.hierro()}</mesh>
    <group position={[0, 0.42, 0]} rotation={[0, 0, -inc]}>
      <mesh><boxGeometry args={[1.0, 0.025, 0.06]} />{M.hierro()}</mesh>
      <group position={[-0.4, 0.06, 0]} scale={SC(a)}><TX x0={-0.12} x1={-0.02} r={0.03} /><mesh rotation={[0, 0, P2]} position={[0.01, 0, 0]}><cylinderGeometry args={[0.038, 0.03, 0.06, 30]} /><meshPhysicalMaterial color={col("#eceae2", CAL, 0.6)} roughness={0.4} /></mesh><TX x0={0.04} x1={0.12} r={0.03} />
        <group position={[0, 0.16, 0]}>{[1, -1].map((sd) => <mesh key={sd} position={[0, sd * 0.045, 0]} rotation={[sd > 0 ? P : 0, 0, 0]}><coneGeometry args={[0.04, 0.09, 20, 1, true]} />{VIDRIO(0.35)}</mesh>)}
          <mesh position={[0, 0.045 - 0.04 * arena, 0]} scale={[1 - arena * 0.9 + 0.1, 1 - arena * 0.9 + 0.1, 1 - arena * 0.9 + 0.1]}><coneGeometry args={[0.03, 0.06, 20]} /><meshStandardMaterial color="#e3c27a" /></mesh>
          <mesh position={[0, -0.075 + 0.02 * arena, 0]} scale={SC(arena)}><coneGeometry args={[0.035, 0.04, 20]} /><meshStandardMaterial color="#e3c27a" /></mesh></group>
        <Halo p={[0, 0.0, 0.06]} r={0.15} c={CAL} o={0.3 + 0.15 * Math.sin(tt * 3)} /></group>
      <group position={[0.4, 0.07, 0]} scale={SC(b)}><Cople p={[0, 0, 0]} s={0.55} /><Halo p={[0, 0, 0.08]} r={0.2 * ok} c={VER} o={0.5} /></group></group>
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  n_domingo: NDomingo, n_medidas: NMedidas, n_fria: NFria, n_vacia: NVacia, n_viruta: NViruta, n_cepillo: NCepillo, n_cuero: NCuero, n_marca: NMarca,
  n_llama: NLlama, n_olla: NOlla, n_pistola: NPistola, n_teflon: NTeflon, n_limites: NLimites, n_cople: NCople, n_oring: NOring, n_mediavuelta: NMediaVuelta,
  n_dientes: NDientes, n_errores4: NErrores4, n_manometros: NManometros, n_papel: NPapel, n_sol: NSol, n_chuypan: NChuyPan, n_recap: NRecap5c, n_premio: NPremio,
};
