// header
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, phys, RED, Stage, Tag, VER } from "./ckit";
import { ctex, Estudio, M, RBox, rn } from "./estudio3d";
import { AGUA, Reloj } from "./kitplo";
import { Inodoro } from "./kitbano";

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
const ruido = (k: string, base: string, spots: string[], n = 3000, sz = 4) => ctex("p4g:" + k, 512, 512, (g) => { g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < n; i++) { g.fillStyle = spots[i % spots.length]; g.globalAlpha = 0.2 + 0.45 * rn(i, 7); const r = 1 + rn(i, 4) * sz; g.beginPath(); g.arc(rn(i, 2) * 512, rn(i, 3) * 512, r, 0, 2 * P); g.fill(); } g.globalAlpha = 1; });
const sarroTex = () => ruido("sarro", SARRO, ["#f6f1e2", "#d6ccb2", "#c9bc9c", "#fffaf0"], 6000, 3);
const oxidoTex = () => ruido("oxido", OXIDO, ["#7a3a1c", "#c46a34", "#5a2a14", "#d08a4a"], 6000, 4);
const sombraTex = () => ctex("p4g:sombra", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(0,0,0,0.8)"); gr.addColorStop(0.45, "rgba(0,0,0,0.4)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const halo = () => ctex("p4g:halo", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
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

// ================= plo4g · EL TUBO QUE NADIE PONE (ventilación del drenaje) · 25 componentes únicos =================
const GAS = "#8a9a3a", PIEL = "#d9a07a";
const Azul2: React.FC<{ z?: number }> = ({ z = -0.7 }) => <mesh position={[0, 0.6, z]}><planeGeometry args={[6, 2.6]} /><meshStandardMaterial map={ctex("PFXazu", 512, 256, (g) => { for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) { g.fillStyle = (r + c) % 2 ? "#e6ecee" : "#d9e1e4"; g.fillRect(c * 64, r * 64, 64, 64); } g.strokeStyle = "#a9b3b7"; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, 256); g.stroke(); } for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(0, i * 64); g.lineTo(512, i * 64); g.stroke(); } })} roughness={0.4} /></mesh>;
const PisoAz: React.FC<{ y?: number }> = ({ y = 0 }) => <mesh position={[0, y, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[6, 3]} /><meshStandardMaterial map={ctex("PFXpisoaz", 512, 512, (g) => { for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { g.fillStyle = (r + c) % 2 ? "#cfd3d1" : "#c3c8c6"; g.fillRect(c * 64, r * 64, 64, 64); } g.strokeStyle = "#8e9593"; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, 512); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(512, i * 64); g.stroke(); } })} roughness={0.5} /></mesh>;
// trampa en U transparente: R radio de la curva, Hh alto de las patas, w nivel del agua (0 = fondo de la curva... Hh = lleno); r grosor
const uPts = (R: number, H0: number, H1: number, w0: number, w1: number) => { const pts: THREE.Vector3[] = [];
  const lo = (w: number) => w; // nivel en cada pata
  if (lo(w0) > 0) for (let i = 0; i <= 8; i++) pts.push(new THREE.Vector3(-R, lerp(Math.min(w0, H0), 0, i / 8), 0));
  const a0 = w0 >= 0 ? 0 : Math.asin(Math.min(1, -w0 / R)), a1 = w1 >= 0 ? 0 : Math.asin(Math.min(1, -w1 / R));
  for (let i = 0; i <= 24; i++) { const th = lerp(P + a0, 2 * P - a1, i / 24); pts.push(new THREE.Vector3(R * Math.cos(th), R * Math.sin(th), 0)); }
  if (w1 > 0) for (let i = 0; i <= 8; i++) pts.push(new THREE.Vector3(R, lerp(0, Math.min(w1, H1), i / 8), 0));
  return pts; };
const uGeo = (k: string, R: number, H0: number, H1: number, w0: number, w1: number, r: number) => memo(`PFXu${k}:${R}:${H0}:${H1}:${w0.toFixed(2)}:${w1.toFixed(2)}:${r}`, () => {
  const pts = uPts(R, H0, H1, w0, w1); if (pts.length < 2) return null; return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, r, 16, false); });
const TrampaU: React.FC<{ p?: V3; s?: number; R?: number; H?: number; w?: number; w2?: number; r?: number; c?: string; rot?: V3; pvc?: boolean }> = ({ p, s = 1, R = 0.16, H = 0.32, w = 0.18, w2, r = 0.06, c = AZUL, rot, pvc }) => {
  const g = uGeo("t", R, H, H, H, H, r), wg = w > -R * 0.98 ? uGeo("w", R, H, H, Math.round(w * 100) / 100, Math.round((w2 ?? w) * 100) / 100, r * 0.86) : null;
  return <group position={p} scale={s} rotation={rot}>
    {g && <mesh geometry={g}>{pvc ? PVCM() : VIDRIO(0.28)}</mesh>}
    {wg && <mesh geometry={wg}>{LIQ(c, 0.85)}</mesh>}</group>;
};
// humo del drenaje: bolitas verdosas que suben de a desde p; se frenan en y=tope (si tope definido)
const Humo: React.FC<{ p: V3; t: number; k: number; hh?: number; tope?: number; w?: number; c?: string; n?: number }> = ({ p, t, k, hh = 0.5, tope, w = 0.08, c = GAS, n = 22 }) => k <= 0.01 ? null : <group position={p}>
  {Array.from({ length: n }, (_, i) => { const q = (t * 0.32 + rn(i, 1)) % 1, y = Math.min(q * hh, tope ?? 99), sp = 1 + 1.6 * q; return <mesh key={i} position={[(rn(i, 2) - 0.5) * w * sp + 0.02 * Math.sin(t * 2.4 + i), y, (rn(i, 3) - 0.5) * w]} scale={[(0.03 + 0.05 * q) * k * (0.8 + 0.5 * rn(i, 4)), (0.026 + 0.04 * q) * k, (0.03 + 0.05 * q) * k]}><sphereGeometry args={[1, 12, 10]} />{GLOW(c, 0.32 * (1 - q * 0.75))}</mesh>; })}</group>;
// aire que entra: flechitas (conos) que bajan por un tubo vertical
const Aire: React.FC<{ a: V3; b: V3; t: number; k: number; n?: number; c?: string }> = ({ a, b, t, k, n = 6, c = "#e6f4ff" }) => k <= 0.01 ? null : <>
  {Array.from({ length: n }, (_, i) => { const q = (t * 0.8 + i / n) % 1; const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), qq = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
    return <mesh key={i} position={[lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q)]} quaternion={qq}><coneGeometry args={[0.036, 0.08, 12]} />{GLOW(c, 0.85 * k * Math.sin(q * P))}</mesh>; })}</>;
const Dedo: React.FC<{ p: V3; s?: number; rot?: V3 }> = ({ p, s = 1, rot }) => { const sk = <meshStandardMaterial color={PIEL} roughness={0.55} />; return <group position={p} scale={s} rotation={rot}>
  <mesh scale={[1, 0.9, 1]}><sphereGeometry args={[0.03, 22, 16]} />{sk}</mesh>
  <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.031, 0.03, 0.1, 24]} />{sk}</mesh>
  <mesh position={[0, 0.1, 0]} scale={[1.1, 0.7, 1.06]}><sphereGeometry args={[0.032, 20, 14]} />{sk}</mesh>
  <mesh position={[0, 0.1, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.0335, 0.0022, 6, 28]} /><meshStandardMaterial color="#b9805f" roughness={0.7} /></mesh>
  <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.034, 0.033, 0.12, 24]} />{sk}</mesh>
  <mesh position={[0, 0.22, 0]} scale={[1.12, 0.7, 1.08]}><sphereGeometry args={[0.035, 20, 14]} />{sk}</mesh>
  <mesh position={[0, 0.22, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.037, 0.0024, 6, 28]} /><meshStandardMaterial color="#b9805f" roughness={0.7} /></mesh>
  <mesh position={[0, 0.31, 0]}><cylinderGeometry args={[0.038, 0.036, 0.18, 24]} />{sk}</mesh>
  <mesh position={[0, 0.032, 0.024]} rotation={[-0.12, 0, 0]} scale={[1, 1.45, 0.32]}><sphereGeometry args={[0.02, 18, 12]} /><meshStandardMaterial color="#f3dbcf" roughness={0.2} /></mesh>
</group>; };
// lavabo de pedestal simple (taza con agua lvl 0..1)
const Lavabo: React.FC<{ p: V3; s?: number; lvl?: number; ola?: number }> = ({ p, s = 1, lvl = 0, ola = 0 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.06, 0.09, 0.6, 24]} /><meshStandardMaterial color="#f2f0ea" roughness={0.3} /></mesh>
  <mesh position={[0, 0.66, 0]} scale={[1.3, 0.55, 1]}><sphereGeometry args={[0.2, 32, 16, 0, 2 * P, P2, P2]} /><meshStandardMaterial color="#f4f2ec" roughness={0.25} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.66, 0]} rotation={[P2, 0, 0]} scale={[1.3, 1, 1]}><torusGeometry args={[0.2, 0.018, 10, 40]} /><meshStandardMaterial color="#f8f6f0" roughness={0.25} /></mesh>
  {lvl > 0.01 && <mesh position={[0, 0.66 - 0.1 * (1 - lvl), 0]} rotation={[-P2, 0, 0]} scale={[1.3, 1, 1]}><circleGeometry args={[0.19 * Math.sqrt(1 - Math.pow(1 - lvl, 2)) + 0.02, 32]} />{LIQ(AZUL, 0.7)}</mesh>}
  {ola > 0.01 && [0, 1].map((j) => <Anillo key={j} p={[0, 0.62, 0]} r={0.05 + 0.15 * ((ola * 2 + j * 0.5) % 1)} o={0.8 * (1 - ((ola * 2 + j * 0.5) % 1))} c="#ffffff" />)}
</group>;
const Remate: React.FC<{ p: V3; s?: number; plano?: boolean }> = ({ p, s = 1, plano }) => <group position={p} scale={s}>
  {plano ? <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.05, 0.05, 0.02, 24]} />{PVCM("#9aa0a4")}</mesh>
    : <><mesh position={[0, 0.06, 0]} scale={[1, 0.6, 1]}><sphereGeometry args={[0.07, 24, 12, 0, 2 * P, 0, P2]} />{PVCM()}</mesh><Caño a={[0, 0, 0]} b={[0, 0.05, 0]} r={0.04} mat={PVCM("#d8d6cf")} /></>}</group>;
const Lata: React.FC<{ p: V3; s?: number; rot?: V3 }> = ({ p, s = 1, rot }) => <group position={p} scale={s} rotation={rot}>
  <mesh><cylinderGeometry args={[0.045, 0.045, 0.1, 24]} /><meshStandardMaterial color="#9aa0a4" metalness={0.7} roughness={0.5} /></mesh>
  <mesh position={[0, 0.0, 0.0]}><cylinderGeometry args={[0.046, 0.046, 0.05, 24, 1, true]} /><meshStandardMaterial color="#b3402a" roughness={0.5} side={THREE.DoubleSide} /></mesh></group>;
const Hoja: React.FC<{ p: V3; r: V3; s?: number }> = ({ p, r, s = 1 }) => <mesh position={p} rotation={r} scale={[0.038 * s, 0.012 * s, 0.022 * s]}><sphereGeometry args={[1, 14, 8, 0, 2 * P, 0, 0.9]} /><meshStandardMaterial color="#8a6a2a" roughness={0.8} side={THREE.DoubleSide} /></mesh>;

// 1 · GLU GLU: el inodoro descarga y en el lavabo de al lado (trampa en rayos X) el agua se sacude y suben burbujas; anillos de sonido salen del desagüe
const HGlu: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#12161b">{(tt) => {
  const fl = eio(tt, 0.6, 1.1) * (1 - eio(tt, 3.6, 4.2)), pul = cl((tt - 0.9) / 0.9), glu = tt > 1.6 && tt < 4.4 ? 1 : 0, w = 0.16 - 0.07 * fl + 0.04 * Math.sin(tt * 14) * glu;
  return <Estudio t={tt} cam={[0.15, 0.5, 1.5]} look={[0.15, 0.36, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azul2 z={-0.7} /><PisoAz />
    <group scale={S0(tt, 0.3)}><Inodoro p={[-0.5, 0, -0.1]} s={0.85} remolino={fl} t={tt} /></group>
    <group scale={S0(tt, 0.4)}>
      <Caño a={[-0.5, 0.05, 0.12]} b={[0.678, 0.05, 0.12]} r={0.05} mat={VIDRIO(0.3)} />
      <Caño a={[0.678, 0.05, 0.12]} b={[0.678, 0.2, 0.12]} r={0.04} mat={VIDRIO(0.3)} />
    </group>
    {pul > 0 && pul < 1 && [0, 1, 2].map((j) => <Anillo key={j} p={[lerp(-0.45, 0.67, cl(pul * 1.15 - j * 0.08)), 0.05, 0.12]} r={0.075} o={0.95 * (1 - pul * 0.6)} c="#ffffff" rot={[0, P2, 0]} w={0.7} />)}
    {pul > 0 && pul < 1 && <Halo p={[lerp(-0.45, 0.67, cl(pul * 1.15)), 0.05, 0.16]} r={0.16} c={AZUL} o={0.55} />}
    <group scale={S0(tt, 0.45)}>
      <Lavabo p={[0.55, 0, -0.1]} s={1.1} lvl={0} ola={glu ? (tt % 1) : 0} />
      <TrampaU p={[0.55, 0.32, 0.12]} s={0.8} w={w} />
      <Burbujas p={[0.55 + 0.128, 0.32, 0.12]} t={tt} k={glu} w={0.04} hh={0.42} n={16} s={0.026} />
    </group>
    {glu > 0 && [0, 1].map((j) => { const q = ((tt - 1.6) * 0.9 + j * 0.5) % 1; return <Anillo key={"o" + j} p={[0.55, 0.74 + 0.25 * q, -0.05]} r={0.06 + 0.16 * q} o={0.9 * (1 - q)} c="#ffffff" rot={[0, 0, 0]} w={0.75} />; })}
    <Halo p={[0.55, 0.62, 0.1]} r={0.3 * glu} c={RED} o={0.35} />
  </Estudio>;
}}</Stage>;

// 2 · LE FALTA UN TUBO: la red del baño (inodoro, lavabo, regadera) completa salvo un hueco vertical que late ámbar; el tubo que falta sube y encaja (verde)
const HFalta: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#0d1116">{(tt) => {
  const late = tt < 2.4 ? 0.5 + 0.5 * Math.sin(tt * 7) : 0, sube = eio(tt, 2.3, 3.2), bote = tt > 3.2 ? Math.sin(cl((tt - 3.2) / 0.35) * P) * 0.05 : 0, ok = eio(tt, 3.2, 3.6);
  return <Estudio t={tt} cam={[0, 0.48, 1.6]} look={[0, 0.45, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#0d1116" /><PisoAz y={0} />
    <group scale={S0(tt, 0.3)}>
      <Inodoro p={[-0.55, 0, -0.1]} s={0.55} /><Sombra p={[-0.55, 0.002, -0.1]} r={0.25} />
      <Lavabo p={[0.0, 0, -0.12]} s={0.75} /><Sombra p={[0.0, 0.002, -0.12]} r={0.16} />
      <Caño a={[-0.95, 0.1, 0.14]} b={[0.8, 0.1, 0.14]} r={0.06} mat={PVCM()} />
      <Caño a={[-0.55, 0.1, 0.14]} b={[-0.55, 0.24, 0.14]} r={0.05} mat={PVCM()} />
      <Caño a={[0.0, 0.1, 0.14]} b={[0.0, 0.34, 0.14]} r={0.03} mat={PVCM()} />
    </group>
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0.45, 0.2 + i * 0.1, 0.14]}><cylinderGeometry args={[0.052, 0.052, 0.06, 20]} />{GLOW("#ffb52e", 0.9 * late)}</mesh>)}
    <Halo p={[0.45, 0.55, 0.18]} r={0.42 * late} c="#ffb52e" o={0.45} />
    <group position={[0.45, lerp(-1.0, 0, sube) + bote, 0.14]}><Caño a={[0, 0.12, 0]} b={[0, 1.0, 0]} r={0.05} mat={PVCM()} /></group>
    {ok > 0.01 && <mesh position={[0.45, 0.6, 0.14]}><cylinderGeometry args={[0.058, 0.058, 0.86, 20, 1, true]} />{GLOW(VER, 0.3 * ok)}</mesh>}
    <Sombra p={[0.45, 0.003, 0.14]} r={0.09 * sube + 0.001} />
    <Halo p={[0.45, 0.13, 0.2]} r={0.35 * ok * (1 - eio(tt, 3.6, 4.1))} c="#ffffff" o={0.6} />
    <Halo p={[0.45, 0.6, 0.18]} r={0.5 * ok} c={VER} o={0.4} />
    <Tag tt={tt} at={0.5} x={1370} y={110} txt="FALTA" size={72} />
  </Estudio>;
}}</Stage>;

// 3 · LA ÚNICA PUERTA: corte de la casa: arriba el baño iluminado, abajo la cloaca oscura de la calle; entre los dos, sólo el tapón de agua azul de la trampa, que se enciende
const HPuerta: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#0c0f13">{(tt) => {
  const on = eio(tt, 1.2, 1.8);
  return <Estudio t={tt} cam={[0, 0.2, 2.1]} look={[0, 0.18, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#0c0f13" />
    <group scale={S0(tt, 0.3)}>
      <mesh position={[0, 0.82, -0.3]}><planeGeometry args={[2.6, 0.45]} /><meshStandardMaterial color="#efe6d6" roughness={0.5} /></mesh>
      <Inodoro p={[-0.6, 0.63, -0.2]} s={0.25} /><Lavabo p={[0.6, 0.63, -0.2]} s={0.33} />
      <Halo p={[0, 0.9, -0.25]} r={0.7} c="#ffd9a8" o={0.3} />
      <mesh position={[0, 0.6, -0.2]}><boxGeometry args={[2.6, 0.06, 0.6]} /><meshStandardMaterial color="#9aa0a0" roughness={0.8} /></mesh>
      <mesh position={[0, -0.45, -0.3]}><planeGeometry args={[2.6, 0.5]} /><meshStandardMaterial map={ruido("tierra", "#3e2c1c", ["#2a1d12", "#5a4028", "#4a3320"], 5000, 4)} roughness={1} /></mesh>
      <Caño a={[-1.3, -0.5, -0.1]} b={[1.3, -0.5, -0.1]} r={0.12} mat={<meshStandardMaterial color="#2a2c2e" roughness={0.7} />} />
      <Caño a={[-0.146, 0.58, 0]} b={[-0.146, 0.29, 0]} r={0.05} mat={VIDRIO(0.35)} />
      <TrampaU p={[0, 0.0, 0]} s={0.91} w={0.2} c={col("#4f9be0", "#7fd0ff", on)} />
      <Caño a={[0.146, 0.29, 0]} b={[0.42, 0.29, 0]} r={0.05} mat={VIDRIO(0.35)} />
      <Caño a={[0.42, 0.29, 0]} b={[0.42, -0.42, 0]} r={0.05} mat={VIDRIO(0.35)} />
      <Humo p={[0.42, -0.45, 0]} t={tt} k={1} hh={0.75} tope={0.72} w={0.05} />
      <Humo p={[0.146, 0.2, 0]} t={tt + 0.4} k={1} hh={0.07} w={0.04} n={10} />
    </group>
    <Halo p={[0, 0.0, 0.12]} r={0.42 * on} c="#7fd0ff" o={0.55} />
    <Tag tt={tt} at={1.5} x={960} y={1000} txt="AGUA" size={64} />
  </Estudio>;
}}</Stage>;

// 4 · EL SELLO: la trampa en U grande, de frente; el agua entra y queda en la curva; una regla de dos rayas marca su alto (de cinco a diez)
const HSello: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#10141a">{(tt) => {
  const llena = eio(tt, 0.6, 1.8), reg = eio(tt, 1.6, 2.2), w = lerp(-0.16, 0.1, llena);
  return <Estudio t={tt} cam={[0.04, 0.04, 1.3]} look={[0.04, 0.02, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azul2 z={-0.6} />
    <group scale={S0(tt, 0.3)}><TrampaU p={[0, -0.05, 0]} s={1} R={0.18} H={0.3} w={w} r={0.07} /></group>
    <Chorro a={[-0.18, 0.5, 0]} t={tt} k={tt > 0.4 && tt < 1.9 ? 1 : 0} n={20} r={0.016} />
    {reg > 0.01 && <group position={[0.26, -0.05, 0.08]}>
      <mesh position={[0, (-0.25 + 0.1) / 2, 0]} scale={[1, reg, 1]}><boxGeometry args={[0.014, 0.35, 0.01]} />{GLOW("#ffffff", 0.9)}</mesh>
      <mesh position={[-0.12, 0.1, 0]} scale={[reg, 1, 1]}><boxGeometry args={[0.3, 0.014, 0.008]} />{GLOW(VER, 0.9)}</mesh>
      <mesh position={[-0.12, -0.25, 0]} scale={[reg, 1, 1]}><boxGeometry args={[0.3, 0.014, 0.008]} />{GLOW(VER, 0.9)}</mesh></group>}
    <Halo p={[0, -0.18, 0.1]} r={0.3 * reg} c={AZUL} o={0.4} />
  </Estudio>;
}}</Stage>;

// 5 · EL GAS NO PASA: el humo verdoso sube por la trampa y choca contra el agua; luego el agua baja, el sello se abre y el humo pasa (rojo)
const HGas: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#0f1216">{(tt) => {
  const baja = eio(tt, 1.8, 2.6), w = lerp(0.1, -0.17, baja), pasa = baja > 0.9;
  return <Estudio t={tt} cam={[0, 0.05, 1.3]} look={[0, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#11151a" />
    <group scale={S0(tt, 0.3)}><TrampaU p={[0, -0.05, 0]} s={1} R={0.18} H={0.32} w={w} r={0.07} /></group>
    <Humo p={[0.18, -0.05, 0]} t={tt} k={tt > 0.6 ? 1 : 0} hh={pasa ? 0.4 : 0.3} tope={pasa ? undefined : 0.1 + 0.0} w={0.08} n={30} />
    {pasa && <Humo p={[-0.18, -0.02, 0]} t={tt + 0.3} k={1} hh={0.38} w={0.06} c={RED} n={18} />}
    <Halo p={[0, 0.1, 0.1]} r={0.35 * (pasa ? 1 : 0)} c={RED} o={0.35} />
    <Halo p={[0.18, 0.05, 0.1]} r={0.2 * (1 - baja) * eio(tt, 0.8, 1.4)} c={AZUL} o={0.35} />
  </Estudio>;
}}</Stage>;

// 6 · LOS TRES CALIBRES: las bocas del inodoro (4"), la regadera (2") y el lavabo (1½") de frente, cada una de su tamaño real relativo
const HCalibres: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#10141a">{(tt) => {
  const R = [0.24, 0.12, 0.09], X = [-0.48, 0.1, 0.5];
  return <Estudio t={tt} cam={[0.35, 0.35, 1.5]} look={[0, -0.02, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-1.0} c="#11161c" /><PisoAz y={-0.24} />
    {R.map((r, i) => <group key={i} scale={S0(tt, 0.3 + i * 0.5)}>
      <Boca p={[X[i], -0.24 + r, 0]} R={r} k={0} mat={PVCM()} L={0.5} rot={[0, 0, 0]} />
      <Sombra p={[X[i], -0.238, -0.1]} r={r * 1.3} sx={1.4} />
    </group>)}
    <group scale={S0(tt, 2.0)}><mesh position={[0.82, -0.234, 0.18]}><cylinderGeometry args={[0.06, 0.06, 0.012, 40]} /><meshStandardMaterial color="#d4a83a" metalness={0.85} roughness={0.3} /></mesh></group>
    {["4\"", "2\"", "1½\""].map((txt, i) => <Tag key={"t" + i} tt={tt} at={1.0 + i * 0.5} x={[560, 1000, 1330][i]} y={170} txt={txt} size={84} />)}
  </Estudio>;
}}</Stage>;

// 7 · LA PENDIENTE: un tramo largo con su nivel; plano el agua se estanca, muy parado el agua se adelanta y deja los sólidos; con la caída justa todo corre junto (verde)
const HPendiente: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#12161b">{(tt) => {
  const Y = [0.42, 0.06, -0.3], A = [0.0, 0.22, 0.06], ON = [0.3, 1.1, 1.9];
  const bola = (k: number | string, x: number) => <mesh key={k} position={[x, -0.035, 0]} scale={0.035}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#6a4a2a" roughness={0.8} /></mesh>;
  return <Estudio t={tt} cam={[0, 0.06, 1.75]} look={[0, 0.06, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#12171c" />
    {Y.map((y, i) => { const q = cl((tt - ON[i] - 0.3) / 1.4), fin = eio(tt, ON[i] + 1.7, ON[i] + 2.0);
      return <group key={i} position={[0.15, y, 0]} rotation={[0, 0, -A[i]]} scale={S0(tt, ON[i])}>
        <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.07, 0.07, 1.3, 32, 1, true]} />{VIDRIO(0.3)}</mesh>
        {i === 0 && <><mesh position={[-0.2, -0.035, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.035, 0.035, 0.7, 20]} />{LIQ(AZUL, 0.8)}</mesh>{[0, 1, 2].map((j) => bola(j, -0.35 + j * 0.1))}</>}
        {i === 1 && <><mesh position={[lerp(-0.6, 0.6, cl(q * 1.6)), -0.04, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.03, 0.03, 0.3, 20]} />{LIQ(AZUL, 0.8)}</mesh>{[0, 1, 2].map((j) => bola(j, lerp(-0.6, -0.25, cl(q)) + j * 0.08))}</>}
        {i === 2 && <group position={[lerp(-0.6, 0.5, cl(q)), 0, 0]}><mesh position={[0, -0.035, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.035, 0.035, 0.34, 20]} />{LIQ(AZUL, 0.8)}</mesh>{[0, 1, 2].map((j) => bola(j, -0.09 + j * 0.09))}</group>}
        <mesh position={[0.72, 0, 0]}><sphereGeometry args={[0.035, 16, 12]} />{GLOW(i === 2 ? VER : RED, 0.95 * fin)}</mesh>
        <Halo p={[0.72, 0, 0.05]} r={0.12 * fin} c={i === 2 ? VER : RED} o={0.45} />
      </group>; })}
    <Tag tt={tt} at={0.6} x={260} y={240} txt="PLANO" size={64} />
    <Tag tt={tt} at={1.4} x={260} y={540} txt="MUY PARADO" size={64} />
    <Tag tt={tt} at={2.2} x={260} y={840} txt="JUSTO" size={64} />
  </Estudio>;
}}</Stage>;

// 8 · EL POPOTE: el popote en el vaso; el dedo tapa la punta, el popote sube con el agua adentro sin caer; el dedo se levanta y el agua cae de golpe
const HPopote: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#12161b">{(tt) => {
  const tapa = eio(tt, 0.6, 1.0), sube = eio(tt, 1.2, 2.0), suelta = eio(tt, 3.0, 3.2), cae = cl((tt - 3.1) / 0.5), spl = cl((tt - 3.3) / 0.7);
  const yS = 0.12 + 0.18 * sube, agua = suelta > 0.5 ? 1 - cae : 1;
  const rayas = ctex("PFXrayas", 64, 64, (g) => { g.fillStyle = "#f6f6f2"; g.fillRect(0, 0, 64, 64); g.fillStyle = "#d03a2a"; for (let i = 0; i < 4; i++) g.fillRect(0, i * 16, 64, 7); });
  return <Estudio t={tt} cam={[0, 0.42, 1.35]} look={[0, 0.4, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azul2 z={-0.6} />
    <mesh rotation={[-P2, 0, 0]}><planeGeometry args={[4, 2]} /><meshStandardMaterial color="#e9e6df" roughness={0.4} /></mesh>
    <group scale={S0(tt, 0.3)}>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.09, 0.08, 0.22, 36, 1, true]} />{VIDRIO(0.25)}</mesh>
      <mesh position={[0, 0.075, 0]}><cylinderGeometry args={[0.087, 0.08, 0.15, 36]} />{LIQ(AZUL, 0.55)}</mesh>
    </group>
    <group position={[0.01, yS, 0]} scale={S0(tt, 0.4)}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.02, 0.02, 0.34, 20, 1, true]} /><meshStandardMaterial map={rayas} transparent opacity={0.8} roughness={0.3} side={THREE.DoubleSide} /></mesh>
      {agua > 0.01 && <mesh position={[0, -0.04 + 0.08 * agua + (1 - agua) * -0.04, 0]}><cylinderGeometry args={[0.017, 0.017, 0.16 * agua, 14]} />{LIQ(AZUL, 0.9)}</mesh>}
    </group>
    <Dedo p={[0.01, yS + 0.32 + lerp(0.15, 0, tapa) + 0.12 * suelta, 0]} s={1} />
    {cae > 0 && cae < 1 && <Chorro a={[0.01, yS - 0.05, 0]} t={tt} k={1} n={16} r={0.016} />}
    {spl > 0 && spl < 1 && [0, 1].map((j) => <Anillo key={j} p={[0.01, 0.152, 0]} r={0.02 + 0.09 * cl(spl * 1.4 - j * 0.3)} o={0.9 * (1 - spl)} c="#ffffff" w={0.7} />)}
    {spl > 0 && spl < 1 && Array.from({ length: 8 }, (_, i) => { const an = i / 8 * 2 * P; return <mesh key={"g" + i} position={[0.01 + Math.cos(an) * 0.07 * spl, 0.155 + 0.12 * Math.sin(spl * P), Math.sin(an) * 0.07 * spl]} scale={0.009}><sphereGeometry args={[1, 10, 8]} />{LIQ(AZUL, 0.9)}</mesh>; })}
    <Sombra p={[0, 0.002, 0]} r={0.14} />
  </Estudio>;
}}</Stage>;

// 9 · SIN AIRE NO BAJA: un tubo vertical grande; con la punta abierta el agua baja y el aire entra por arriba (flechas); con la punta tapada el agua se frena a los tirones
const HCae: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  return <Estudio t={tt} cam={[0, 0.38, 1.55]} look={[0, 0.34, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azul2 z={-0.6} />
    <mesh position={[0, -0.02, 0]}><boxGeometry args={[2.4, 0.04, 0.7]} /><meshStandardMaterial map={ruido("madera", "#6a4a2c", ["#4a321c", "#7e5a38", "#5a3e24"], 4000, 6)} roughness={0.8} /></mesh>
    {[-0.36, 0.36].map((x, i) => { const sel = i === 1, pulso = Math.sin(tt * 5) > 0.35 ? 1 : 0;
      const q = sel ? 0.12 * eio(tt, 0.6, 1.0) + 0.18 * Math.floor(cl((tt - 1.0) / 2.6) * 4) / 4 : eio(tt, 0.6, 3.4), fluye = tt > 0.6 && q < 0.98 ? (sel ? pulso : 1) : 0;
      const sq = sel ? 1 - 0.14 * eio(tt, 1.2, 2.4) - 0.03 * Math.sin(tt * 5) * (tt > 1.2 ? 1 : 0) : 1;
      return <group key={i} position={[x, 0, 0]} scale={S0(tt, 0.3 + i * 0.12)}>
        <Caño a={[0.17, 0, -0.08]} b={[0.17, 0.68, -0.08]} r={0.012} mat={<meshStandardMaterial color="#5a5f64" metalness={0.6} roughness={0.4} />} />
        <Caño a={[0.17, 0.62, -0.08]} b={[0.0, 0.62, -0.02]} r={0.01} mat={<meshStandardMaterial color="#5a5f64" metalness={0.6} roughness={0.4} />} />
        <group scale={[sq, 1, 1]}>
          <mesh position={[0, 0.62, 0]}><cylinderGeometry args={[0.1, 0.1, 0.32, 36, 1, true]} />{VIDRIO(0.3)}</mesh>
          <mesh position={[0, 0.78, 0]}><cylinderGeometry args={[0.1, 0.1, 0.01, 36]} />{VIDRIO(0.4)}</mesh>
          <mesh position={[0, 0.44, 0]}><cylinderGeometry args={[0.03, 0.1, 0.06, 36, 1, true]} />{VIDRIO(0.3)}</mesh>
          {q < 0.99 && <mesh position={[0, 0.46 + 0.15 * (1 - q), 0]}><cylinderGeometry args={[0.094, 0.094, Math.max(0.01, 0.3 * (1 - q)), 32]} />{LIQ(AZUL, 0.8)}</mesh>}
        </group>
        <mesh position={[0, 0.405, 0]}><cylinderGeometry args={[0.03, 0.03, 0.03, 24, 1, true]} />{VIDRIO(0.4)}</mesh>
        <Chorro a={[0, 0.39, 0]} t={tt} k={fluye} n={sel ? 8 : 20} r={sel ? 0.012 : 0.02} />
        {!sel && <Burbujas p={[0, 0.47, 0]} t={tt} k={fluye} w={0.06} hh={0.28 * (1 - q)} n={14} s={0.016} />}
        <Cubeta p={[0, 0, 0]} s={0.75} lvl={0.15 + 0.6 * q} />
        <Halo p={[0, 0.6, 0.1]} r={0.3 * eio(tt, 3.0, 3.4)} c={sel ? RED : VER} o={0.35} />
      </group>; })}
    <Tag tt={tt} at={0.8} x={620} y={110} txt="CON AIRE" size={64} />
    <Tag tt={tt} at={1.2} x={1300} y={110} txt="SIN AIRE" size={64} />
  </Estudio>;
}}</Stage>;

// 10 · EL PISTÓN: la descarga del inodoro baja por el tubo grueso como un émbolo; detrás queda un vacío rojo que chupa la trampa del lavabo (su agua baja)
const HPiston: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#10141a">{(tt) => {
  const q = eio(tt, 0.7, 3.0), xs = lerp(-0.55, 0.55, q), vac = eio(tt, 1.2, 1.8) * (1 - eio(tt, 3.4, 4.0)), w = lerp(0.1, -0.06, eio(tt, 1.4, 2.8));
  return <Estudio t={tt} cam={[0, 0.36, 1.7]} look={[0, 0.28, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azul2 z={-0.6} /><PisoAz y={-0.12} />
    <group scale={S0(tt, 0.3)}>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.11, 0.11, 1.45, 36, 1, true]} />{VIDRIO(0.3)}</mesh>
      <mesh position={[xs, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.105, 0.105, 0.3, 36]} />{LIQ(AZUL, 0.85)}</mesh>
      {[-0.15, 0.15].map((d, j) => <mesh key={j} position={[xs + d, 0, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.1, 0.013, 10, 36]} /><meshStandardMaterial color="#1e2224" roughness={0.6} /></mesh>)}
      {vac > 0.01 && <mesh position={[(xs - 0.15 - 0.72) / 2, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.1, 0.1, Math.max(0.01, xs - 0.15 + 0.72), 36]} />{GLOW(RED, 0.22 * vac)}</mesh>}
      <Burbujas p={[(xs - 0.15 - 0.72) / 2, -0.06, 0]} t={tt} k={vac} w={Math.max(0.05, xs - 0.15 + 0.72) * 0.8} hh={0.1} n={18} s={0.012} c={RED} />
      <Caño a={[-0.35, 0.11, 0]} b={[-0.35, 0.4, 0]} r={0.035} mat={VIDRIO(0.35)} />
      <TrampaU p={[-0.206, 0.52, 0]} s={0.9} w={w} />
    </group>
    <Halo p={[-0.26, 0.52, 0.1]} r={0.28 * vac} c={RED} o={0.4} />
  </Estudio>;
}}</Stage>;

// 11 · CADA DESCARGA SE LLEVA UN POCO: el nivel de la trampa baja un escalón con cada pulso (cuatro descargas); al cuarto queda bajo el sello y el olor pasa
const HPierde: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#10141a">{(tt) => {
  const T0 = (i: number) => 0.7 + i * 0.85, n = Array.from({ length: 4 }, (_, i) => eio(tt, T0(i), T0(i) + 0.3)).reduce((a, b) => a + b, 0), w = 0.1 - 0.065 * n, pasa = n > 3.9;
  return <Estudio t={tt} cam={[0.12, 0.05, 1.3]} look={[0.12, 0.02, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azul2 z={-0.6} />
    <group scale={S0(tt, 0.3)}>
      <TrampaU p={[0, -0.05, 0]} s={1} R={0.18} H={0.32} w={w} r={0.07} />
      <Caño a={[0.18, 0.27, 0]} b={[0.62, 0.27, 0]} r={0.05} mat={VIDRIO(0.3)} />
    </group>
    {Array.from({ length: 5 }, (_, i) => { const lv = -0.05 + 0.1 - 0.065 * i, hit = i === 0 ? 1 : eio(tt, T0(i - 1) + 0.2, T0(i - 1) + 0.35); return <mesh key={"r" + i} position={[0.29, lv, 0.02]}><boxGeometry args={[0.06, 0.009, 0.008]} />{GLOW(i === 4 ? RED : "#ffffff", 0.35 + 0.6 * hit)}</mesh>; })}
    {Array.from({ length: 4 }, (_, i) => { const k = cl((tt - T0(i)) / 0.55); return k > 0 && k < 1 ? <mesh key={"d" + i} position={[lerp(0.18, 0.62, k), 0.27 - 0.02 * Math.sin(k * P), 0]} scale={[0.04, 0.03, 0.03]}><sphereGeometry args={[1, 16, 12]} />{LIQ(AZUL, 0.9)}</mesh> : null; })}
    {pasa && <Humo p={[0.18, -0.1, 0]} t={tt} k={1} hh={0.6} w={0.05} c={RED} n={18} />}
    {Array.from({ length: 4 }, (_, i) => { const k = eio(tt, T0(i), T0(i) + 0.2) * (1 - eio(tt, T0(i) + 0.2, T0(i) + 0.6)); return <Anillo key={i} p={[-0.18, 0.2, 0]} r={0.06 + 0.1 * k} o={0.8 * k} c="#ffffff" />; })}
  </Estudio>;
}}</Stage>;

// 12 · EL TAPÓN DE AGUA: el lavabo lleno se vacía de golpe; el agua baja como un tapón por el tubo vertical y arrastra detrás el agua de su propia trampa (autosifonaje)
const HTapon: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#10141a">{(tt) => {
  const q = eio(tt, 0.6, 2.4), q2 = eio(tt, 1.0, 3.0), w = lerp(0.1, -0.15, eio(tt, 1.6, 3.0)), sorbo = eio(tt, 2.8, 3.1) * (1 - eio(tt, 3.5, 4.1));
  return <Estudio t={tt} cam={[0, 0.08, 1.45]} look={[0, 0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azul2 z={-0.6} /><PisoAz y={-0.32} />
    <group scale={S0(tt, 0.3)}>
      <Lavabo p={[-0.25, -0.32, 0]} s={0.8} lvl={1 - q} ola={q > 0.05 && q < 0.95 ? (tt % 1) : 0} />
      <Caño a={[-0.25, 0.12, 0.12]} b={[-0.25, -0.03, 0.12]} r={0.03} mat={VIDRIO(0.35)} />
      <TrampaU p={[-0.138, -0.25, 0.12]} s={0.7} w={w} />
      <Caño a={[-0.026, -0.026, 0.12]} b={[0.25, -0.026, 0.12]} r={0.03} mat={VIDRIO(0.35)} />
      <mesh position={[0.25, -0.02, 0.12]}><cylinderGeometry args={[0.06, 0.06, 0.86, 32, 1, true]} />{VIDRIO(0.28)}</mesh>
      {q2 > 0.02 && q2 < 0.98 && <mesh position={[0.25, lerp(-0.05, -0.36, q2), 0.12]}><cylinderGeometry args={[0.056, 0.056, 0.2, 28]} />{LIQ(AZUL, 0.88)}</mesh>}
      {q2 > 0.05 && q2 < 0.98 && <mesh position={[0.25, lerp(0.02, -0.24, q2), 0.12]}><cylinderGeometry args={[0.054, 0.054, 0.08, 28]} />{GLOW(RED, 0.3)}</mesh>}
    </group>
    {[0, 1, 2].map((j) => <Anillo key={j} p={[-0.25, 0.21, 0.02]} r={0.05 + 0.18 * ((sorbo * 2 + j * 0.33) % 1)} o={0.8 * sorbo} c={RED} />)}
    <Halo p={[-0.138, -0.3, 0.2]} r={0.25 * eio(tt, 3.0, 3.4)} c={RED} o={0.4} />
    <Tag tt={tt} at={1.2} x={1430} y={720} txt="TAPÓN" size={64} />
  </Estudio>;
}}</Stage>;

// 13 · LAS CINCO SEÑALES (items): cinco miniaturas en fila (lavabo que hace ondas · olor · taza baja · coladera con burbujas · lavabo lento); con cada señal la suya se enciende
const HSenales: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#12161b">{(tt) => {
  const a = Array.from({ length: 5 }, (_, i) => AT(h, i, 1.1, 0.6));
  return <Estudio t={tt} cam={[0, 0.3, 1.5]} look={[0, 0.22, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azul2 z={-0.6} />
    <mesh position={[0, -0.02, 0]}><boxGeometry args={[1.95, 0.04, 0.4]} /><meshStandardMaterial map={ruido("madera", "#6a4a2c", ["#4a321c", "#7e5a38", "#5a3e24"], 4000, 6)} roughness={0.8} /></mesh>
    {Array.from({ length: 5 }, (_, i) => { const x = -0.7 + i * 0.35, on = eio(tt, a[i], a[i] + 0.4);
      return <group key={i} position={[x, 0.04 * on, 0]} scale={S0(tt, 0.2 + i * 0.06) * (1.5 + 0.22 * on)}>
        {i === 0 && <Lavabo p={[0, 0, 0]} s={0.36} lvl={0.5} ola={on > 0.5 ? (tt % 1) : 0} />}
        {i === 1 && <><mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.07, 0.07, 0.16, 28, 1, true]} />{VIDRIO(0.3)}</mesh><mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.07, 0.07, 0.006, 28]} />{VIDRIO(0.4)}</mesh><Humo p={[0, 0.01, 0]} t={tt} k={0.3 + on} hh={0.32} w={0.06} n={16} /></>}
        {i === 2 && <group><mesh position={[0, 0.12, 0]} scale={[1, 0.7, 1]}><sphereGeometry args={[0.12, 28, 14, 0, 2 * P, P2, P2]} /><meshStandardMaterial color="#f4f2ec" side={THREE.DoubleSide} /></mesh>
          <mesh position={[0, 0.12 - 0.03 - 0.04 * on, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.085 - 0.02 * on, 28]} />{LIQ(AZUL, 0.75)}</mesh>
          <mesh position={[0, 0.09, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.08, 0.092, 28]} />{GLOW(RED, 0.9 * on)}</mesh></group>}
        {i === 3 && <><mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.085, 0.085, 0.012, 32]} />{M.cromo()}</mesh>
          {[-0.04, -0.013, 0.013, 0.04].map((z, j) => <mesh key={j} position={[0, 0.013, z]}><boxGeometry args={[0.11, 0.003, 0.012]} /><meshStandardMaterial color="#1a1c1e" /></mesh>)}
          <Burbujas p={[0, 0.015, 0]} t={tt} k={on} w={0.1} hh={0.2} n={16} s={0.016} /></>}
        {i === 4 && <><Lavabo p={[0, 0, 0]} s={0.36} lvl={0.85} /><mesh position={[0, 0.66 * 0.36 - 0.006, 0]} rotation={[-P2, 0, tt * 1.4]}><torusGeometry args={[0.035, 0.004, 6, 24, P * 1.5]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.5 + 0.5 * on} /></mesh></>}
        <Halo p={[0, 0.16, 0.1]} r={0.15 * on} c="#e8b84a" o={0.45} />
      </group>; })}
  </Estudio>;
}}</Stage>;

// 14 · SUBE HASTA LA AZOTEA: la casa en corte; desde el drenaje del baño crece el tubo de ventilación por dentro del muro y asoma sobre el techo; el aire baja y el gas sale arriba
const HAzotea: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#0f1419">{(tt) => {
  const g = eio(tt, 0.7, 2.2), on = eio(tt, 2.2, 2.6);
  const cielo = ctex("PFXcielo", 64, 256, (c) => { const gr = c.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#2f5f98"); gr.addColorStop(1, "#c3dbee"); c.fillStyle = gr; c.fillRect(0, 0, 64, 256); });
  return <Estudio t={tt} cam={[0, 0.72, 2.7]} look={[0, 0.66, 0]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, 1.55, -0.9]}><planeGeometry args={[7, 1.6]} /><meshBasicMaterial map={cielo} toneMapped={false} /></mesh>
    <group scale={S0(tt, 0.3)}>
      <mesh position={[0, 0.5, -0.2]}><boxGeometry args={[2.2, 1.0, 0.08]} /><meshStandardMaterial color="#d9d2c2" roughness={0.9} /></mesh>
      <mesh position={[0, 1.05, -0.05]}><boxGeometry args={[2.4, 0.1, 0.6]} /><meshStandardMaterial color="#8a8378" roughness={0.9} /></mesh>
      <mesh position={[0, -0.03, -0.05]}><boxGeometry args={[2.4, 0.06, 0.6]} /><meshStandardMaterial color="#9aa0a0" roughness={0.9} /></mesh>
      <Caño a={[-0.8, -0.1, 0.1]} b={[0.8, -0.1, 0.1]} r={0.05} mat={PVCM()} />
      <Inodoro p={[-0.45, 0, -0.05]} s={0.34} />
      <Lavabo p={[0.12, 0, -0.08]} s={0.45} />
      <Caño a={[0.45, -0.1, 0.1]} b={[0.45, lerp(-0.1, 1.38, g), 0.1]} r={0.04} mat={PVCM()} />
      <Aire a={[0.45, 1.6, 0.14]} b={[0.45, 0.2, 0.14]} t={tt} k={on} n={9} c="#7fc8ff" />
      <Humo p={[0.45, 1.38, 0.1]} t={tt} k={on} hh={0.32} w={0.07} c={VER} />
    </group>
    <Halo p={[0.45, 1.38, 0.15]} r={0.32 * on} c={VER} o={0.35} />
  </Estudio>;
}}</Stage>;

// 15 · EL DEDO QUE SE LEVANTA: un dedo gigante tapa la boca del tubo de ventilación; el inodoro descarga y el agua se atasca; el dedo se levanta, entra el aire y todo corre (verde)
const HDedo: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#10141a">{(tt) => {
  const lev = eio(tt, 2.2, 2.8), q = tt < 2.4 ? 0.2 * eio(tt, 0.8, 1.4) + 0.03 * Math.sin(tt * 9) * (tt > 1.4 ? 1 : 0) : 0.2 + 0.8 * eio(tt, 2.4, 4.0);
  return <Estudio t={tt} cam={[0, 0.42, 1.95]} look={[0, 0.42, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#11161c" />
    <group scale={S0(tt, 0.3)}>
      <Caño a={[-0.8, 0, 0]} b={[0.8, 0, 0]} r={0.07} mat={VIDRIO(0.3)} />
      <Caño a={[0.3, 0, 0]} b={[0.3, 0.6, 0]} r={0.045} mat={VIDRIO(0.3)} />
      <mesh position={[lerp(-0.75, 0.75, q), 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.066, 0.066, 0.25, 30]} />{LIQ(AZUL, 0.85)}</mesh>
      <Aire a={[0.3, 0.75, 0]} b={[0.3, 0.1, 0]} t={tt} k={lev} n={12} />
    </group>
    <Dedo p={[0.3, 0.645 + 0.22 * lev, 0]} s={1.45} />
    <Sombra p={[0.3, 0.648, 0]} r={0.07 * (1 - lev) + 0.001} o={0.6} />
    <Halo p={[0.3, 0.6, 0.08]} r={0.25 * (1 - lev) * eio(tt, 1.2, 1.6)} c={RED} o={0.4} />
    <Halo p={[0, 0.05, 0.1]} r={0.5 * eio(tt, 3.4, 3.9)} c={VER} o={0.3} />
  </Estudio>;
}}</Stage>;

// 16 · LA ALTURA: el tubo asoma de la azotea; aparece una persona tendiendo ropa y el tubo crece hasta pasarle por encima de la cabeza; el gas queda arriba (verde)
const HAltura: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#0f1419">{(tt) => {
  const per = eio(tt, 0.6, 1.2), g = lerp(0.12, 0.74, eio(tt, 1.6, 2.9)), ok = eio(tt, 2.9, 3.3), lin = eio(tt, 1.2, 1.6);
  const cielo = ctex("PFXcielo", 64, 256, (c) => { const gr = c.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#2f5f98"); gr.addColorStop(1, "#c3dbee"); c.fillStyle = gr; c.fillRect(0, 0, 64, 256); });
  return <Estudio t={tt} cam={[0, 0.45, 2.0]} look={[0, 0.4, 0]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, 0.8, -0.8]}><planeGeometry args={[6, 3]} /><meshBasicMaterial map={cielo} toneMapped={false} /></mesh>
    <Piso c="#8a8378" />
    <group scale={S0(tt, 0.3)}>
      <Caño a={[0.35, 0, 0]} b={[0.35, g, 0]} r={0.045} mat={PVCM()} />
      <Remate p={[0.35, g, 0]} s={1} />
      <Humo p={[0.35, g + 0.07, 0]} t={tt} k={1} hh={0.26} w={0.07} c={ok > 0.5 ? GAS : RED} />
      {[-0.85, 0.05].map((x, i) => <Caño key={i} a={[x, 0, -0.1]} b={[x, 0.66, -0.1]} r={0.012} mat={<meshStandardMaterial color="#5a5f64" />} />)}
      <Caño a={[-0.85, 0.64, -0.1]} b={[0.05, 0.64, -0.1]} r={0.004} mat={<meshStandardMaterial color="#eeeeee" />} />
      {[[-0.7, "#d65a4a"], [-0.52, "#4a7ad6"], [-0.12, "#e8c84a"]].map(([x, c], i) => <mesh key={"c" + i} position={[x as number, 0.56 + 0.01 * Math.sin(tt * 2 + i), -0.1]} rotation={[0, 0, 0.04 * Math.sin(tt * 1.5 + i)]}><boxGeometry args={[0.13, 0.15, 0.01]} /><meshStandardMaterial color={c as string} roughness={0.8} side={THREE.DoubleSide} /></mesh>)}
    </group>
    <group position={[-0.3, 0, 0]} scale={0.0001 + per}>
      <mesh position={[0, 0.22, 0]}><capsuleGeometry args={[0.07, 0.25, 8, 16]} /><meshStandardMaterial color="#5a6a8a" roughness={0.7} /></mesh>
      <mesh position={[0, 0.48, 0]}><sphereGeometry args={[0.06, 20, 14]} /><meshStandardMaterial color={PIEL} roughness={0.6} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[0.06 * sd, 0.47, -0.04]} rotation={[-0.3, 0, -0.35 * sd]}><capsuleGeometry args={[0.02, 0.2, 6, 10]} /><meshStandardMaterial color={PIEL} roughness={0.6} /></mesh>)}
    </group>
    {lin > 0.01 && Array.from({ length: 14 }, (_, i) => <mesh key={"l" + i} position={[-0.5 + i * 0.075, 0.55, 0.05]} scale={[lin, 1, 1]}><boxGeometry args={[0.04, 0.008, 0.005]} />{GLOW("#ffffff", 0.85)}</mesh>)}
    <Halo p={[0.35, g + 0.1, 0.05]} r={0.28 * ok} c={VER} o={0.38} />
    <Sombra p={[-0.3, 0.002, 0]} r={0.12 * per + 0.001} />
  </Estudio>;
}}</Stage>;

// 17 · LA DISTANCIA MÁXIMA: la trampa del lavabo y la conexión de la ventilación; la trampa se aleja, la barra que las une se estira y pasa a rojo; vuelve cerca y queda verde
const HDistancia: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#10141a">{(tt) => {
  const lejos = eio(tt, 0.8, 2.0) * (1 - eio(tt, 3.0, 3.9)), x = lerp(-0.2, -0.85, lejos), mal = cl((lejos - 0.6) / 0.2);
  return <Estudio t={tt} cam={[-0.15, 0.3, 1.75]} look={[-0.15, 0.18, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azul2 z={-0.5} />
    <group scale={S0(tt, 0.3)}>
      <Caño a={[-1.1, 0, 0]} b={[0.6, 0, 0]} r={0.04} mat={PVCM()} />
      <Caño a={[0.35, 0, 0]} b={[0.35, 0.75, 0]} r={0.035} mat={PVCM()} />
      <Lavabo p={[x - 0.06, -0.08, -0.2]} s={0.5} />
      <TrampaU p={[x, 0.12, 0]} s={0.5} w={0.1} pvc />
      <mesh position={[(x + 0.35) / 2, -0.1, 0.06]}><boxGeometry args={[Math.abs(0.35 - x), 0.035, 0.008]} /><meshStandardMaterial color={col("#f2c230", RED, mal)} roughness={0.4} emissive={col("#000000", RED, mal)} emissiveIntensity={0.6} /></mesh>
      {Array.from({ length: 12 }, (_, i) => { const xx = x + (0.35 - x) * (i / 11); return <mesh key={"k" + i} position={[xx, -0.09, 0.065]}><boxGeometry args={[0.004, i % 3 === 0 ? 0.03 : 0.015, 0.002]} /><meshBasicMaterial color="#1a1a1a" /></mesh>; })}
    </group>
    <Halo p={[(x + 0.35) / 2, -0.06, 0.1]} r={0.3 * mal} c={RED} o={0.35} />
  </Estudio>;
}}</Stage>;

// 18 · LA MEMBRANA: la válvula de admisión en corte; con el vacío el disco sube y entra aire (flechas); sin vacío el disco cae y el olor que sube se frena abajo
const HMembrana: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#10141a">{(tt) => {
  const vac = eio(tt, 0.6, 1.0) * (1 - eio(tt, 2.4, 2.8)), lift = 0.07 * vac;
  return <Estudio t={tt} cam={[0, 0.1, 0.95]} look={[0, 0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#11161c" />
    <group scale={S0(tt, 0.3)}>
      <Caño a={[0, -0.45, 0]} b={[0, 0.0, 0]} r={0.05} mat={VIDRIO(0.3)} />
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.12, 0.12, 0.24, 32, 1, true, P2, P * 1.4]} /><meshStandardMaterial color="#7a7f84" roughness={0.5} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.13, 0.12, 0.03, 32]} /><meshStandardMaterial color="#6a6f74" roughness={0.5} /></mesh>
      <mesh position={[0, 0.035, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.072, 0.009, 10, 36]} /><meshStandardMaterial color="#3a3f44" roughness={0.4} metalness={0.4} /></mesh>
      {[0, 1, 2, 3].map((j) => <mesh key={j} position={[0.121, 0.13 + j * 0.025, 0.02]}><boxGeometry args={[0.012, 0.008, 0.07]} /><meshStandardMaterial color="#2a2e32" /></mesh>)}
      <mesh position={[0, 0.05 + lift, 0]}><cylinderGeometry args={[0.078, 0.078, 0.022, 32]} /><meshStandardMaterial color="#7a2418" roughness={0.6} /></mesh>
      <Aire a={[0.3, 0.17, 0.02]} b={[0.02, 0.1, 0]} t={tt} k={vac} n={5} c={VER} />
      <Aire a={[0, 0.06, 0]} b={[0, -0.32, 0]} t={tt} k={vac} n={5} c={VER} />
      <Humo p={[0, -0.42, 0]} t={tt} k={tt > 2.6 ? 1 : 0} hh={0.5} tope={0.4} w={0.04} c="#8a6a3a" />
    </group>
    <Halo p={[0, 0.1, 0.12]} r={0.25 * vac} c={VER} o={0.35} />
    <Halo p={[0, 0.0, 0.12]} r={0.2 * eio(tt, 3.3, 3.7)} c={AZUL} o={0.4} />
  </Estudio>;
}}</Stage>;

// 19 · RESUELVE UN APARATO: la válvula deja entrar aire al lavabo (verde) pero el gas de la red no tiene salida y se junta; aparece la ventilación principal en la azotea y el gas sale por ahí
const HLimite: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#10141a">{(tt) => {
  const junta = eio(tt, 0.9, 2.0) * (1 - eio(tt, 3.0, 3.8)), vent = eio(tt, 2.2, 3.4), sale = eio(tt, 3.0, 4.0);
  return <Estudio t={tt} cam={[0.05, 0.5, 1.95]} look={[0.05, 0.42, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azul2 z={-0.6} />
    <group scale={S0(tt, 0.3)}>
      <Caño a={[-0.9, 0, 0]} b={[0.9, 0, 0]} r={0.05} mat={VIDRIO(0.3)} />
      <Lavabo p={[-0.6, 0.0, -0.15]} s={0.62} />
      <Caño a={[-0.6, 0.0, 0]} b={[-0.6, 0.3, 0]} r={0.03} mat={PVCM()} />
      <Caño a={[-0.6, 0.3, 0]} b={[-0.35, 0.3, 0]} r={0.025} mat={PVCM()} />
      <mesh position={[-0.35, 0.36, 0]}><cylinderGeometry args={[0.07, 0.07, 0.12, 24]} /><meshStandardMaterial color="#7a7f84" metalness={0.4} roughness={0.4} /></mesh>
      <Aire a={[-0.35, 0.6, 0]} b={[-0.35, 0.32, 0]} t={tt} k={tt > 0.6 ? 1 : 0} c={VER} n={5} />
      {Array.from({ length: 9 }, (_, i) => { const x0 = -0.1 + i * 0.09, xg = lerp(x0, 0.72, sale), yg = lerp(0, 0.8, cl(sale * 1.3 - i * 0.04)) * (sale > 0.05 ? 1 : 0); return <mesh key={i} position={[sale > 0.05 ? xg : x0, yg + 0.01 * Math.sin(tt * 4 + i), 0]} scale={(0.03 + 0.012 * Math.sin(tt * 5 + i)) * Math.max(junta, sale * (1 - sale) * 3)}><sphereGeometry args={[1, 14, 10]} />{GLOW("#8a6a3a", 0.7)}</mesh>; })}
      <Caño a={[0.72, 0, 0]} b={[0.72, lerp(0, 0.85, vent), 0]} r={0.04} mat={PVCM()} />
      <Humo p={[0.72, 0.85, 0]} t={tt} k={vent > 0.95 ? 1 : 0} hh={0.28} w={0.06} />
    </group>
    <Halo p={[0.3, 0, 0.1]} r={0.38 * junta} c={RED} o={0.35} />
    <Halo p={[0.72, 0.85, 0.08]} r={0.26 * eio(tt, 3.4, 3.8)} c={VER} o={0.38} />
  </Estudio>;
}}</Stage>;

// 20 · CONECTADO ACOSTADO: la ventilación sale de costado por debajo del nivel del agua; con cada descarga entra agua sucia y la tapa (rojo); se corrige: sale por arriba y sube vertical (verde)
const HAcostado: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#10141a">{(tt) => {
  const gira = eio(tt, 2.7, 3.5), ok = eio(tt, 3.5, 3.9), llena = (0.55 + 0.45 * Math.sin(tt * 5)) * eio(tt, 0.6, 1.1) * (1 - gira), tap = eio(tt, 1.5, 2.2) * (1 - gira);
  return <Estudio t={tt} cam={[0.65, 0.42, 1.6]} look={[0.1, 0.22, 0.05]} orbit={0.01} mesa={false} fit={false}>
    <Azul2 z={-0.5} />
    <group scale={S0(tt, 0.3)}>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.1, 0.1, 1.6, 36, 1, true]} />{VIDRIO(0.3)}</mesh>
      <mesh position={[0, -0.04, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.06, 0.06, 1.58, 24]} />{LIQ(AZUL, 0.75)}</mesh>
      {[0, 1, 2].map((j) => <mesh key={j} position={[((tt * 0.4 + j / 3) % 1) * 1.4 - 0.7, 0.02 + 0.005 * Math.sin(tt * 6 + j), 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.055, 0.006, 6, 20]} /><meshStandardMaterial color="#6a5a3a" transparent opacity={0.7} /></mesh>)}
      <group position={[0.2, lerp(-0.03, 0.1, gira), lerp(0.1, 0, gira)]} rotation={[lerp(P2, 0, gira), 0, 0]}>
        <mesh position={[0, 0, 0]}><sphereGeometry args={[0.045, 16, 12]} /><meshStandardMaterial color="#5a5f64" metalness={0.5} roughness={0.4} /></mesh>
        <Caño a={[0, 0, 0]} b={[0, 0.6, 0]} r={0.035} mat={VIDRIO(0.35)} />
        <Llena a={[0, 0, 0]} b={[0, 0.6, 0]} k={0.65 * llena} c="#6a5a3a" r={0.032} />
        {tap > 0.05 && <mesh position={[0, 0.39, 0]} scale={[1, tap, 1]}><cylinderGeometry args={[0.033, 0.033, 0.06, 18]} /><meshStandardMaterial color="#4a3a22" roughness={0.9} /></mesh>}
        <Aire a={[0, 0.75, 0]} b={[0, 0.05, 0]} t={tt} k={ok} n={6} />
      </group>
    </group>
    <Halo p={[0.2, 0.0, 0.35]} r={0.28 * (llena + tap) * 0.6} c={RED} o={0.4} />
    <Halo p={[0.2, 0.42, 0.05]} r={0.3 * ok} c={VER} o={0.35} />
  </Estudio>;
}}</Stage>;

// 21 · QUINCE CENTÍMETROS ARRIBA: el lavabo se llena hasta el desborde (línea azul); el tramo horizontal de la ventilación baja y se queda por arriba de esa línea con un hueco que brilla verde
const HQuince: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#10141a">{(tt) => {
  const llena = eio(tt, 0.4, 1.4), des = tt > 1.4 && tt < 2.6 ? 1 : 0, yv = lerp(1.1, 0.88, eio(tt, 1.8, 2.8)), ok = eio(tt, 2.8, 3.2);
  return <Estudio t={tt} cam={[0.15, 0.6, 1.8]} look={[0.15, 0.55, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azul2 z={-0.6} /><PisoAz />
    <group scale={S0(tt, 0.3)}>
      <Lavabo p={[-0.25, 0, 0]} s={1.0} lvl={llena} />
      <mesh position={[0.1, 0.66, -0.1]}><boxGeometry args={[1.5, 0.01, 0.01]} />{GLOW(AZUL, 0.85 * llena)}</mesh>
      <Caño a={[0.45, 0.3, -0.1]} b={[0.45, yv, -0.1]} r={0.032} mat={PVCM()} />
      <Caño a={[0.45, yv, -0.1]} b={[0.95, yv, -0.1]} r={0.032} mat={PVCM()} />
      <Caño a={[0.95, yv, -0.1]} b={[0.95, 1.14, -0.1]} r={0.032} mat={PVCM()} />
    </group>
    {des > 0 && Array.from({ length: 6 }, (_, i) => { const q = ((tt - 1.4) * 1.2 + i / 6) % 1, sd = i % 2 ? 1 : -1; return <mesh key={i} position={[-0.25 + sd * 0.27, 0.66 - 0.66 * q * q, 0.02 * i]} scale={[0.014, 0.02, 0.014]}><sphereGeometry args={[1, 10, 8]} />{LIQ(AZUL, 0.9)}</mesh>; })}
    {ok > 0.01 && <group position={[0.62, 0, -0.06]}>
      <mesh position={[0, (yv + 0.66) / 2, 0]}><boxGeometry args={[0.035, (yv - 0.66) * ok, 0.01]} /><meshStandardMaterial color="#d4a83a" metalness={0.8} roughness={0.3} /></mesh>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0.02, 0.66 + (yv - 0.66) * (i / 5) * ok, 0.006]}><boxGeometry args={[0.02, 0.004, 0.002]} /><meshBasicMaterial color="#2a1e08" /></mesh>)}
      <mesh position={[0.1, (yv + 0.66) / 2, 0.01]}><boxGeometry args={[0.03, (yv - 0.66) * ok, 0.01]} />{GLOW(VER, 0.9)}</mesh></group>}
    <Halo p={[0.7, (yv + 0.66) / 2, 0]} r={0.22 * ok} c={VER} o={0.4} />
    <Tag tt={tt} at={3.0} x={1560} y={330} txt="15 cm" size={72} />
  </Estudio>;
}}</Stage>;

// 22 · LA PRUEBA DEL PLUMÓN: la taza en corte con la raya del plumón en el nivel de la noche; la luna se vuelve sol y el agua amanece por debajo de la raya (rojo)
const plBowl = () => memo("PFXplbowl", () => { const s = new THREE.Shape(); const N = 40;
  for (let i = 0; i <= N; i++) { const a = P + P * i / N; const x = 0.33 * Math.cos(a), y = 0.3 + 0.36 * Math.sin(a); if (i === 0) s.moveTo(x, y); else s.lineTo(x, y); }
  for (let i = N; i >= 0; i--) { const a = P + P * i / N; s.lineTo(0.28 * Math.cos(a), 0.3 + 0.3 * Math.sin(a)); }
  return new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: false }); });
const plAgua = (yl: number) => memo(`PFXplagua:${yl.toFixed(3)}`, () => { const s = new THREE.Shape(), s0 = Math.max(-0.999, (yl - 0.3) / 0.3), a1 = P - Math.asin(s0), a2 = 2 * P + Math.asin(s0), N = 32;
  for (let i = 0; i <= N; i++) { const a = lerp(a1, a2, i / N); const x = 0.278 * Math.cos(a), y = 0.3 + 0.298 * Math.sin(a); if (i === 0) s.moveTo(x, y); else s.lineTo(x, y); }
  s.closePath(); return new THREE.ExtrudeGeometry(s, { depth: 0.13, bevelEnabled: false }); });
const HPlumon: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#0d1117">{(tt) => {
  const raya = eio(tt, 0.3, 1.0), noche = cl((tt - 1.0) / 2.2), baja = eio(tt, 1.4, 3.0), mal = eio(tt, 3.0, 3.4), a = lerp(P * 0.85, P * 0.15, noche), yl = lerp(0.22, 0.13, baja);
  const xl = 0.27, xp = lerp(-xl, xl, raya);
  return <Estudio t={tt} cam={[0, 0.28, 1.2]} look={[0, 0.2, 0]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, 0.5, -0.7]}><planeGeometry args={[6, 3]} /><meshBasicMaterial color={col("#0b1020", "#7f9fc0", noche)} toneMapped={false} /></mesh>
    <mesh position={[Math.cos(a) * 0.65, 0.42 + Math.sin(a) * 0.32, -0.6]}><sphereGeometry args={[0.07, 24, 16]} />{GLOW(col("#e8ecf4", "#ffd35a", noche), 1)}</mesh>
    <Halo p={[Math.cos(a) * 0.65, 0.42 + Math.sin(a) * 0.32, -0.58]} r={0.16} c={col("#c8d4ff", "#ffcf5a", noche)} o={0.4} />
    <group scale={S0(tt, 0.3)}>
      <mesh geometry={plBowl()} position={[0, 0, -0.08]}><meshStandardMaterial color="#f4f2ec" roughness={0.25} /></mesh>
      <mesh geometry={plAgua(yl)} position={[0, 0, -0.065]}>{LIQ(AZUL, 0.75)}</mesh>
      {raya > 0.01 && <mesh position={[(-xl + xp) / 2, 0.22, 0.085]}><boxGeometry args={[Math.max(0.001, xp + xl), 0.014, 0.004]} /><meshBasicMaterial color="#c4281c" /></mesh>}
      {mal > 0.01 && <mesh position={[0, (0.22 + yl) / 2, 0.08]}><boxGeometry args={[0.5, Math.max(0.001, 0.22 - yl), 0.002]} />{GLOW(RED, 0.45 * mal)}</mesh>}
    </group>
    {tt < 1.4 && <group position={[xp, 0.22 + 0.02, 0.1]} rotation={[0, 0, -0.5]}>
      <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.016, 0.016, 0.16, 18]} /><meshStandardMaterial color="#c4281c" roughness={0.4} /></mesh>
      <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.018, 0.018, 0.04, 18]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      <mesh position={[0, 0.0, 0]} rotation={[P, 0, 0]}><coneGeometry args={[0.016, 0.03, 18]} /><meshStandardMaterial color="#e8d8c0" /></mesh></group>}
    <Halo p={[0, 0.18, 0.12]} r={0.3 * mal} c={RED} o={0.4} />
    <Tag tt={tt} at={3.0} x={1500} y={150} txt="MAÑANA" size={64} />
  </Estudio>;
}}</Stage>;

// 23 · LOS CINCO ERRORES (items): cinco pedestales; con cada error cae su maqueta y su base se enciende roja:
// sin tubo · tapa plana en vez de remate · tubo que muere en el plafón · céspol en S · tubo delgado y lejos
const HErroresG: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#110d0c">{(tt) => {
  const a = Array.from({ length: 5 }, (_, i) => AT(h, i, 1.2, 0.6));
  return <Estudio t={tt} cam={[0, 0.35, 1.4]} look={[0, 0.22, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#140f0e" /><Piso c="#3a3532" />
    {Array.from({ length: 5 }, (_, i) => { const x = -0.72 + i * 0.36, d = eio(tt, a[i], a[i] + 0.25), on = eio(tt, a[i] + 0.3, a[i] + 0.6), y = lerp(0.5, 0, d);
      return <group key={i} position={[x, 0, 0]}>
        <group scale={S0(tt, 0.2 + i * 0.06)}><mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.16, 0.17, 0.08, 32]} /><meshStandardMaterial color="#2a2726" roughness={0.6} /></mesh>
          <mesh position={[0, 0.081, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.15, 32]} />{GLOW(RED, 0.55 * on)}</mesh></group>
        {d > 0.01 && <group position={[0, 0.09 + y, 0]} scale={2.0}>
          {i === 0 && <><mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.03, 0.03, 0.24, 16, 1, true]} /><meshBasicMaterial color="#e8b84a" wireframe transparent opacity={0.5} /></mesh><Cruz p={[0, 0.12, 0.05]} s={0.12} k={on} /></>}
          {i === 1 && <><Caño a={[0, 0, 0]} b={[0, 0.2, 0]} r={0.03} mat={PVCM()} /><Remate p={[0, 0.2, 0]} plano />{[0, 1, 2].map((j) => <Hoja key={j} p={[-0.02 + j * 0.02, 0.215 + 0.004 * j, 0.01 * j]} r={[0.2, j, 0.1]} s={0.7} />)}<Humo p={[0, 0.0, 0]} t={tt} k={on} hh={0.18} tope={0.19} w={0.03} /></>}
          {i === 2 && <><Caño a={[0, 0, 0]} b={[0, 0.16, 0]} r={0.03} mat={PVCM()} /><mesh position={[0, 0.2, 0]}><boxGeometry args={[0.28, 0.03, 0.2]} /><meshStandardMaterial color="#cfc8b8" /></mesh><Humo p={[0, 0.12, 0]} t={tt} k={on} hh={0.1} tope={0.06} w={0.18} n={14} /></>}
          {i === 3 && <><Caño a={[-0.03, 0, 0]} b={[-0.03, 0.12, 0]} r={0.025} mat={PVCM()} /><Humo p={[-0.03, 0.12, 0]} t={tt} k={on} hh={0.14} w={0.03} c={RED} /><TrampaU p={[0.06, 0.02, 0.02]} s={0.18} w={-0.1} pvc rot={[0, 0, P2]} /><Cruz p={[0.06, 0.04, 0.06]} s={0.06} k={on} /></>}
          {i === 4 && <><Caño a={[-0.045, 0, 0]} b={[-0.045, 0.2, 0]} r={0.008} mat={PVCM("#c4281c")} /><Caño a={[0.04, 0, 0]} b={[0.04, 0.2, 0]} r={0.03} mat={PVCM("#3aa05a")} /></>}
        </group>}
        <Halo p={[0, 0.15, 0.1]} r={0.15 * on} c={RED} o={0.4} />
      </group>; })}
  </Estudio>;
}}</Stage>;

// 24 · DON ERNESTO EN LA AZOTEA: el remate del tubo tapado con una lata; la lata sale volando, las hojas escapan y el tubo respira (anillos de aire que entran y salen, verde)
const HErnestoG: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#0f1419">{(tt) => {
  const sale = eio(tt, 1.0, 1.8), resp = tt > 2.0 ? 1 : 0;
  return <Estudio t={tt} cam={[0, 0.45, 1.2]} look={[0, 0.35, 0]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, 0.8, -0.8]}><planeGeometry args={[6, 3]} /><meshBasicMaterial color="#c79a6a" toneMapped={false} /></mesh>
    <Halo p={[0.6, 0.85, -0.7]} r={0.5} c="#ffcf8a" o={0.5} />
    <Piso c="#8a8378" />
    <group scale={S0(tt, 0.3)}>
      <Caño a={[0, 0, 0]} b={[0, 0.42, 0]} r={0.05} mat={PVCM()} />
      <mesh position={[0, 0.42, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.035, 0.05, 32]} />{PVCM()}</mesh>
    </group>
    <Lata p={[0.0 + 0.32 * sale, 0.47 + 0.24 * Math.sin(sale * P) - 0.2 * sale * sale, 0.12 * sale]} rot={[sale * 4, 0, sale * 3]} s={1} />
    {Array.from({ length: 8 }, (_, i) => { const q = cl((tt - 1.2 - i * 0.08) / 1.6); const pp: V3 = [(rn(i, 1) - 0.5) * 0.55 * q + 0.03 * Math.sin(tt * 4 + i) * q, 0.45 + 0.42 * q - 0.36 * q * q, (rn(i, 2) - 0.2) * 0.3 * q]; return q > 0 ? <group key={i}><Hoja p={pp} r={[0.4 * Math.sin(tt * 5 + i) + q * 2, q * 3 + i, 0.5 * Math.sin(tt * 4 + i)]} s={2.2} /><Sombra p={[pp[0], 0.003, pp[2]]} r={0.03} o={0.4 * q} /></group> : null; })}
    <Aire a={[0.08, 0.75, 0]} b={[0.0, 0.3, 0]} t={tt} k={resp} c={VER} n={6} />
    {resp > 0 && [0, 1, 2].map((j) => { const q = ((tt - 2.0) * 0.6 + j / 3) % 1; return <Anillo key={j} p={[0, 0.44 + 0.22 * q, 0]} r={0.06 + 0.12 * q} o={0.9 * (1 - q)} c={VER} w={0.62} />; })}
    <Sombra p={[0, 0.002, 0]} r={0.12} />
  </Estudio>;
}}</Stage>;

// 25 · EL REPASO (items): seis maquetas en la repisa (trampa · popote · inodoro · tubo con remate · válvula · conexión vertical); con cada idea la suya sube y se enciende verde
const HRecapG: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const a = Array.from({ length: 6 }, (_, i) => AT(h, i, 0.7, 0.5));
  return <Estudio t={tt} cam={[0, 0.28, 1.2]} look={[0, 0.13, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#12171c" />
    <mesh position={[0, -0.02, 0]}><boxGeometry args={[1.7, 0.04, 0.35]} /><meshStandardMaterial map={ruido("madera", "#6a4a2c", ["#4a321c", "#7e5a38", "#5a3e24"], 4000, 6)} roughness={0.8} /></mesh>
    {Array.from({ length: 6 }, (_, i) => { const x = -0.6 + i * 0.24, ent = eio(tt, 0.1 + i * 0.1, 0.45 + i * 0.1), bote = Math.sin(cl((tt - 0.45 - i * 0.1) / 0.3) * P) * 0.04 * (tt > 0.45 + i * 0.1 ? 1 : 0), on = eio(tt, a[i], a[i] + 0.3), act = on * (1 - eio(tt, a[i] + 0.6, a[i] + 0.9));
      return <group key={i} position={[x, bote + 0.12 * act, lerp(-0.5, 0, ent)]} scale={(0.0001 + ent) * 1.4}>
        {i === 0 && <TrampaU p={[0, 0.08, 0]} s={0.3} w={0.1} />}
        {i === 1 && <><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.04, 0.035, 0.12, 20, 1, true]} />{VIDRIO(0.3)}</mesh><Caño a={[0.005, 0.03, 0]} b={[0.02, 0.2, 0]} r={0.006} mat={<meshStandardMaterial color="#d03a2a" />} /></>}
        {i === 2 && <Inodoro p={[0, 0, 0]} s={0.18} />}
        {i === 3 && <><Caño a={[0, 0, 0]} b={[0, 0.2, 0]} r={0.02} mat={PVCM()} /><Remate p={[0, 0.2, 0]} s={0.5} /></>}
        {i === 4 && <><mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.04, 0.04, 0.08, 20]} /><meshStandardMaterial color="#7a7f84" metalness={0.4} roughness={0.4} /></mesh><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.045, 0.04, 0.02, 20]} /><meshStandardMaterial color="#5a5f64" /></mesh></>}
        {i === 5 && <><Caño a={[-0.1, 0.02, 0]} b={[0.1, 0.02, 0]} r={0.02} mat={PVCM()} /><Caño a={[0, 0.02, 0]} b={[0, 0.2, 0]} r={0.015} mat={PVCM()} /></>}
        <mesh position={[0, -0.0, 0.0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.1, 28]} />{GLOW(VER, 0.25 * on + 0.7 * act)}</mesh>
        <Halo p={[0, 0.1, 0.1]} r={0.16 * act + 0.06 * on} c={VER} o={0.5} />
      </group>; })}
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  g_glu: HGlu, g_falta: HFalta, g_puerta: HPuerta, g_sello: HSello, g_gas: HGas, g_calibres: HCalibres, g_pendiente: HPendiente, g_popote: HPopote,
  g_cae: HCae, g_piston: HPiston, g_pierde: HPierde, g_tapon: HTapon, g_senales: HSenales, g_azotea: HAzotea, g_dedo: HDedo, g_altura: HAltura,
  g_distancia: HDistancia, g_membrana: HMembrana, g_limite: HLimite, g_acostado: HAcostado, g_quince: HQuince, g_plumon: HPlumon, g_errores: HErroresG, g_ernesto: HErnestoG, g_recap: HRecapG,
};
