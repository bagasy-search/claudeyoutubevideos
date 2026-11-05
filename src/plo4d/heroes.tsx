// heroes plo4d r3
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

// ================= plo4d · DESTAPAR UNA TUBERÍA TAPADA CON SARRO · 25 componentes únicos (r2) =================
// r2: el Stage comprime el tiempo del hijo a ≤4,4 s: TODA línea de tiempo cierra antes de tt=4,2. Cámaras más cerca, todo apoyado en algo.
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

// 1 · EL AGUA ESTÁ AHÍ ARRIBA Y NO BAJA: tinaco sobre su base, en rayos X lleno; el agua baja por el tubo y choca con un tapón blanco que late rojo; la llave suelta una gota gorda
const HNoBaja: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#10141a">{(tt) => {
  const baja = eio(tt, 0.6, 1.6), late = tt > 1.6 ? 0.5 + 0.5 * Math.sin(tt * 6) : 0, gota = ((tt - 1.8) * 0.55) % 1;
  return <Estudio t={tt} cam={[-0.02, 0.52, 1.4]} look={[-0.04, 0.47, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#11161c" />
    <Piso c="#3d3a37" y={0} />
    <group scale={S0(tt, 0.2)}>
      {[[-0.72, -0.2], [-0.2, -0.2], [-0.72, 0.2], [-0.2, 0.2]].map(([x, z], i) => <mesh key={i} position={[x, 0.3, z]} castShadow><boxGeometry args={[0.04, 0.6, 0.04]} />{GALV()}</mesh>)}
      <mesh position={[-0.46, 0.61, 0]} castShadow><boxGeometry args={[0.62, 0.03, 0.48]} />{GALV()}</mesh>
      <Tinaco p={[-0.46, 0.63, 0]} s={0.62} x={1} lvl={0.92} />
    </group>
    <group scale={S0(tt, 0.4)}>
      <Caño a={[-0.3, 0.68, 0.1]} b={[-0.3, 0.42, 0.1]} r={0.034} mat={VIDRIO(0.35)} />
      <Caño a={[-0.3, 0.42, 0.1]} b={[0.42, 0.42, 0.1]} r={0.034} mat={VIDRIO(0.35)} />
      <Caño a={[0.42, 0.42, 0.1]} b={[0.42, 0.22, 0.1]} r={0.034} mat={VIDRIO(0.35)} />
      <Llena a={[-0.3, 0.68, 0.1]} b={[-0.3, 0.42, 0.1]} k={1} r={0.03} />
      <Llena a={[-0.3, 0.42, 0.1]} b={[0.42, 0.42, 0.1]} k={0.55 * baja} r={0.03} />
      <mesh position={[0.1, 0.42, 0.1]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.033, 0.033, 0.09, 24]} /><meshStandardMaterial map={sarroTex()} roughness={0.95} emissive={RED} emissiveIntensity={0.5 * late} /></mesh>
      <Halo p={[0.1, 0.42, 0.16]} r={0.3 * late + 0.01} c={RED} o={0.55} />
      <Grifo p={[0.42, 0.04, 0.1]} s={0.75} />
      {tt > 1.8 && <Gota p={[0.52, 0.17 - gota * 0.17, 0.1]} s={0.022 + 0.012 * Math.min(1, gota * 3)} />}
    </group>
    <Sombra p={[-0.46, 0.002, 0]} r={0.42} />
  </Estudio>;
}}</Stage>;

// 2 · DEL TAMAÑO DE UN LÁPIZ: la boca del tubo de frente; la costra la cierra hasta un agujerito; un lápiz llega en perspectiva y su punta calza con destello
const HLapiz: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#0e1114">{(tt) => {
  const k = eio(tt, 0.4, 2.0), lx = eio(tt, 2.2, 3.3), ok = eio(tt, 3.3, 3.6), gota = ((tt - 0.8) * 0.5) % 1;
  return <Estudio t={tt} cam={[0.32, 0.16, 1.15]} look={[0.02, -0.02, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azulejo z={-0.9} />
    <Mostrador y={-0.36} />
    <Sombra p={[0, -0.358, -0.25]} r={0.4} sx={1.6} o={0.5} />
    <group scale={S0(tt, 0.15)}><Boca p={[0, 0, 0]} R={0.34} k={0.92 * k} L={0.6} oxido={0.3} /></group>
    <Gota p={[0.02, -0.36 - gota * 0.25, 0.05]} s={0.018} />
    <group position={[lerp(0.45, 0.012, lx), lerp(0.3, 0.0, lx), lerp(0.7, 0.1, lx)]} rotation={[0, lerp(-1.3, -0.9, lx), 0.12 * (1 - lx)]} scale={(0.0001 + eio(tt, 2.0, 2.3)) * 0.8}>
      <mesh position={[0.34, 0, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.026, 0.026, 0.56, 6]} /><meshStandardMaterial color="#f2c230" roughness={0.5} /></mesh>
      <mesh position={[0.035, 0, 0]} rotation={[0, 0, P2]}><coneGeometry args={[0.026, 0.07, 6]} /><meshStandardMaterial color="#e8c9a0" roughness={0.7} /></mesh>
      <mesh position={[0.004, 0, 0]} rotation={[0, 0, P2]}><coneGeometry args={[0.009, 0.014, 8]} /><meshStandardMaterial color="#222" /></mesh>
      <mesh position={[0.64, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.028, 0.028, 0.05, 12]} />{M.cromo("#c8b070")}</mesh>
      <mesh position={[0.68, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.027, 0.027, 0.05, 12]} /><meshStandardMaterial color="#e88" /></mesh>
    </group>
    <Anillo p={[0, 0, 0.03]} r={0.05 + 0.03 * ok} o={0.95 * ok} c={RED} rot={[0, 0, 0]} />
    <Halo p={[0, 0, 0.06]} r={0.3 * ok} c="#fff1c0" o={0.7 * ok} />
  </Estudio>;
}}</Stage>;

// 3 · LA CUBETA Y EL RELOJ: chorro de la llave a la cubeta en corte, el nivel sube con la aguja; al llenarse el reloj se congela y brilla dorado
const HCubeta: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#12161b">{(tt) => {
  const k = cl((tt - 0.5) / 2.9), lleno = eio(tt, 3.4, 3.7), pul = lleno * (0.75 + 0.25 * Math.sin(tt * 7));
  return <Estudio t={tt} cam={[0.12, 0.4, 1.2]} look={[0.12, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azulejo z={-0.55} />
    <Mostrador />
    <group scale={S0(tt, 0.2)}><Grifo p={[-0.36, 0.0, -0.22]} s={1.25} /></group>
    <group scale={S0(tt, 0.35)}><Cubeta p={[-0.16, 0.0, 0.02]} s={1.0} lvl={k} corte /></group>
    <Chorro a={[-0.16, 0.42, 0.02]} t={tt} k={k < 1 && tt > 0.3 ? 1.4 : 0} n={36} r={0.026} />
    <group position={[0.4, 0.26, 0.08]} rotation={[-0.12, -0.35, 0]} scale={S0(tt, 0.5)}><Reloj s={0.62} k={k} /></group>
    <Halo p={[0.4, 0.26, 0.16]} r={0.12 + 0.18 * k + 0.12 * pul} c="#ffcf5a" o={0.25 + 0.35 * pul} />
    <Sombra p={[-0.16, 0.002, 0.02]} r={0.26} /><Sombra p={[0.4, 0.002, 0.08]} r={0.2} />
  </Estudio>;
}}</Stage>;

// 4 · LA AGUJA: medidor de caudal con números; la aguja sube al verde (8) y CAE al rojo (1,4) y tiembla; la aguja fantasma verde queda fija en 8
const caudalTex = () => ctex("PFXcaudal2", 512, 512, (g) => { g.fillStyle = "#f4f1e8"; g.beginPath(); g.arc(256, 256, 250, 0, 2 * P); g.fill(); g.lineWidth = 46;
  ([["#c0392b", -225, -171], ["#e8b23a", -171, -63], ["#3aa860", -63, 45]] as [string, number, number][]).forEach(([c, a, b]) => { g.strokeStyle = c; g.beginPath(); g.arc(256, 256, 196, a * P / 180, b * P / 180); g.stroke(); });
  g.fillStyle = "#222"; g.font = "bold 44px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 0; i <= 10; i++) { const a = (-225 + 27 * i) * P / 180; g.save(); g.translate(256 + Math.cos(a) * 150, 256 + Math.sin(a) * 150); g.rotate(a); g.fillRect(-14, -4, 28, 8); g.restore();
    if (i % 2 === 0) g.fillText(String(i), 256 + Math.cos(a) * 108, 256 + Math.sin(a) * 108); }
  g.font = "bold 34px sans-serif"; g.fillText("L/min", 256, 360); });
const Aguja: React.FC<{ v: number; c?: string; o?: number; z?: number }> = ({ v, c = "#111", o = 1, z = 0.03 }) =>
  <group position={[0, 0, z]} rotation={[0, 0, -(-225 + 270 * cl(v / 10)) * P / 180 - P]}><mesh position={[0.16, 0, 0]}><boxGeometry args={[0.33, 0.026, 0.008]} />{c === "#111" ? <meshBasicMaterial color={c} /> : GLOW(c, o)}</mesh></group>;
const HAguja: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#10141a">{(tt) => {
  const sube = eio(tt, 0.5, 1.3), cae = eio(tt, 1.7, 2.1), v = lerp(0, 8, sube) - (8 - 1.4) * cae + 0.5 * bote(tt, 2.1) * (tt > 2.1 ? 1 : 0), costra = eio(tt, 1.6, 2.2);
  const fan = eio(tt, 2.2, 2.8), late = tt > 2.2 ? 0.5 + 0.5 * Math.sin(tt * 6) : 0;
  return <Estudio t={tt} cam={[0, -0.1, 1.55]} look={[0, -0.12, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azulejo z={-0.6} />
    <group scale={S0(tt, 0.3)}><Caño a={[-0.9, -0.62, 0]} b={[0.9, -0.62, 0]} r={0.07} mat={VIDRIO(0.35)} /><Caño a={[0, -0.55, 0]} b={[0, -0.44, 0]} r={0.03} mat={M.cromo()} />
      <Llena a={[-0.9, -0.62, 0]} b={[0.9, -0.62, 0]} k={1} r={0.065} />
      {costra > 0.01 && <mesh position={[0, -0.62, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.068, 0.068, 1.8, 32, 1, true]} /><meshStandardMaterial map={sarroTex()} roughness={0.95} transparent opacity={0.85 * costra} side={THREE.DoubleSide} /></mesh>}
      {costra > 0.01 && <mesh position={[0, -0.62, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.068 * (1 - 0.6 * costra), 0.068 * (1 - 0.6 * costra), 1.8, 32]} />{AGUA(0.9)}</mesh>}</group>
    <group scale={S0(tt, 0.2)} rotation={[0.06, -0.1, 0]}>
      <mesh rotation={[P2, 0, 0]} position={[0, 0, -0.04]}><cylinderGeometry args={[0.46, 0.46, 0.08, 64]} />{M.cromo()}</mesh>
      <mesh position={[0, 0, 0.002]}><circleGeometry args={[0.42, 64]} /><meshBasicMaterial map={caudalTex()} toneMapped={false} /></mesh>
      <Aguja v={v} z={0.03} />
      <mesh position={[0, 0, 0.04]}><circleGeometry args={[0.03, 20]} /><meshBasicMaterial color="#222" /></mesh>
    </group>
    <Halo p={[-0.28, -0.14, 0.1]} r={0.26 * late} c={RED} o={0.55} />
    <Halo p={[0.24, 0.14, 0.1]} r={0.16 * sube * (1 - cae)} c={VER} o={0.45} />
  </Estudio>;
}}</Stage>;

// 5 · SI TODAS DAN POCO: la red de la casa contra la pared; cada llave late y suelta una gota fallida, una tras otra; al final una onda roja recorre el TRONCO
const HTodas: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#10141a">{(tt) => {
  const xs = [-0.5, -0.17, 0.16, 0.49], tr = eio(tt, 2.6, 3.4), late = tt > 3.4 ? 0.65 + 0.35 * Math.sin(tt * 6) : 1;
  return <Estudio t={tt} cam={[0, 0.46, 1.38]} look={[0, 0.42, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azulejo z={-0.2} />
    <Piso c="#3d3a37" />
    <group scale={S0(tt, 0.2)}>
      <Caño a={[-0.7, 0.62, 0]} b={[0.62, 0.62, 0]} r={0.032} mat={GALV()} />
      <Caño a={[-0.7, 0.62, 0]} b={[-0.7, 0.86, 0]} r={0.032} mat={GALV()} />
      <Llena a={[-0.7, 0.62, 0]} b={[0.62, 0.62, 0]} k={tr} c={RED} r={0.038} o={0.75 * late} />
      <Halo p={[lerp(-0.7, 0.62, tr), 0.62, 0.06]} r={0.24 * (tr > 0.01 && tr < 0.99 ? 1 : 0)} c={RED} o={0.7} />
      {tr > 0.01 && tr < 0.99 && <mesh position={[lerp(-0.7, 0.62, tr), 0.62, 0]}><sphereGeometry args={[0.05, 20, 14]} />{GLOW(RED, 0.9)}</mesh>}
      {xs.map((x, i) => { const a0 = 0.5 + i * 0.45, on = eio(tt, a0, a0 + 0.25), q = cl((tt - a0) / 0.9); return <group key={i}>
        <Caño a={[x, 0.62, 0]} b={[x, 0.24, 0]} r={0.024} mat={GALV()} />
        <Grifo p={[x - 0.08, 0.05, 0]} s={0.6} />
        {q > 0 && q < 1 && <Gota p={[x + 0.02, 0.17 - Math.max(0, q - 0.4) * 0.28, 0.02]} s={0.016 + 0.014 * Math.min(1, q * 2.5)} />}
        <Halo p={[x, 0.22, 0.08]} r={0.13 * on * (0.7 + 0.3 * Math.sin(tt * 5 + i))} c={RED} o={0.5} />
      </group>; })}
    </group>
  </Estudio>;
}}</Stage>;

// 6 · EL AIREADOR: la llave entera; el aireador se desenrosca, baja y se inclina HACIA CÁMARA mostrando la redecita tapada de granitos que caen al lavabo
const HAireador: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#12161b">{(tt) => {
  const gira = eio(tt, 0.3, 1.2), baja = eio(tt, 1.1, 1.6), incl = eio(tt, 1.6, 2.2), cae = cl((tt - 2.1) / 1.6);
  return <Estudio t={tt} cam={[0.08, 0.06, 0.95]} look={[0.04, -0.02, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azulejo z={-0.45} />
    <mesh position={[0, -0.32, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#e9e6df" roughness={0.3} /></mesh>
    <mesh position={[0.06, -0.24, 0.1]}><cylinderGeometry args={[0.3, 0.22, 0.16, 48, 1, true]} /><meshStandardMaterial color="#5f666c" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.06, -0.315, 0.1]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.22, 48]} /><meshStandardMaterial color="#3e4448" metalness={0.6} roughness={0.4} /></mesh>
    <mesh position={[0.06, -0.312, 0.1]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.02, 0.035, 24]} /><meshStandardMaterial color="#222" /></mesh>
    <group scale={S0(tt, 0.2)}>
      <Caño a={[-0.42, 0.3, 0]} b={[0, 0.3, 0]} r={0.055} mat={M.cromo()} />
      <mesh position={[0, 0.245, 0]}><torusGeometry args={[0.055, 0.055, 16, 24, P2]} />{M.cromo()}</mesh>
      <Caño a={[0.055, 0.245, 0]} b={[0.055, 0.17, 0]} r={0.055} mat={M.cromo()} />
    </group>
    <group position={[0.055, 0.14 - 0.2 * baja, 0.12 * incl]} rotation={[-incl * 0.75, gira * P * 4, 0]} scale={S0(tt, 0.3) * 1.7}>
      <mesh castShadow><cylinderGeometry args={[0.058, 0.058, 0.055, 32, 1, true]} />{M.cromo("#c8ccd0")}</mesh>
      <mesh position={[0, -0.028, 0]} rotation={[P2, 0, 0]}><circleGeometry args={[0.055, 32]} /><meshStandardMaterial color="#8d949a" metalness={0.6} roughness={0.5} wireframe /></mesh>
      <mesh position={[0, -0.029, 0]} rotation={[P2, 0, 0]}><circleGeometry args={[0.05, 32]} /><meshStandardMaterial map={sarroTex()} roughness={0.95} transparent opacity={0.85} /></mesh>
      {Array.from({ length: 16 }, (_, i) => <Grano key={i} p={[(rn(i, 1) - 0.5) * 0.08, -0.032, (rn(i, 2) - 0.5) * 0.08]} s={0.007 + 0.005 * rn(i, 3)} r={[rn(i, 4) * 3, rn(i, 5) * 3, 0]} />)}
    </group>
    {cae > 0 && Array.from({ length: 14 }, (_, i) => { const q = cl(cae * 1.6 - rn(i, 4) * 0.6); return q > 0 ? <Grano key={i} p={[0.055 + (rn(i, 5) - 0.5) * 0.14, lerp(-0.1, -0.3, Math.min(1, q * 1.3)), 0.12 + (rn(i, 6) - 0.5) * 0.1]} s={0.016} c="#fbf7ea" r={[q * 4, q * 3, 0]} /> : null; })}
    <Halo p={[0.055, -0.05, 0.16]} r={0.17 * incl} c="#fff3c0" o={0.4} />
  </Estudio>;
}}</Stage>;

// 7 · TODA LA NOCHE EN VINAGRE: vaso grande en primer plano con el aireador adentro; la luna cruza y se vuelve sol; la costra blanca se encoge soltando burbujas grandes
const HVaso: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#0d1117">{(tt) => {
  const noche = cl((tt - 0.4) / 3.4), cos = 1 - noche, a = lerp(P * 0.92, P * 0.08, noche);
  return <Estudio t={tt} cam={[0, 0.32, 1.05]} look={[0, 0.26, 0]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, 0.4, -0.72]}><planeGeometry args={[6, 3]} /><meshStandardMaterial color="#3a2f26" roughness={0.9} /></mesh>
    <mesh position={[0, 0.55, -0.7]}><planeGeometry args={[1.5, 0.62]} /><meshBasicMaterial color={col("#0b1020", "#7fa6cc", noche)} toneMapped={false} /></mesh>
    {[[0, 0.87, 1.6, 0.04], [0, 0.23, 1.6, 0.04], [-0.77, 0.55, 0.04, 0.68], [0.77, 0.55, 0.04, 0.68], [0, 0.55, 0.025, 0.62]].map(([x, y, w, hh], i) => <mesh key={"v" + i} position={[x, y, -0.68]}><boxGeometry args={[w, hh, 0.03]} /><meshStandardMaterial color="#e8e2d4" roughness={0.6} /></mesh>)}
    <mesh position={[Math.cos(a) * 0.55, 0.45 + Math.sin(a) * 0.3, -0.69]}><sphereGeometry args={[0.085, 32, 20]} />{GLOW(col("#e8ecf4", "#ffd35a", noche), 1)}</mesh>
    <Halo p={[Math.cos(a) * 0.55, 0.45 + Math.sin(a) * 0.3, -0.66]} r={0.22} c={col("#c8d4ff", "#ffd35a", noche)} o={0.5} />
    <Madera />
    <group scale={S0(tt, 0.2) * 1.7}>
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.12, 0.1, 0.3, 40, 1, true]} />{VIDRIO(0.25)}</mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.1, 40]} />{VIDRIO(0.3)}</mesh>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.115, 0.1, 0.22, 40]} />{LIQ("#f3e7c8", 0.45)}</mesh>
      <group position={[0, 0.08, 0.02]} rotation={[0.75, 0, 0.2]} scale={1.45}>
        <mesh><cylinderGeometry args={[0.05, 0.05, 0.045, 32, 1, true]} />{M.cromo("#c8ccd0")}</mesh>
        <mesh position={[0, -0.023, 0]} rotation={[P2, 0, 0]}><circleGeometry args={[0.048, 24]} /><meshStandardMaterial color="#9aa0a4" metalness={0.6} roughness={0.5} /></mesh>
        {cos > 0.02 && <mesh position={[0, -0.025, 0]} rotation={[P2, 0, 0]} scale={[cos, cos, 1]}><circleGeometry args={[0.047, 24]} /><meshStandardMaterial map={sarroTex()} roughness={0.95} /></mesh>}
        {Array.from({ length: 12 }, (_, i) => rn(i, 7) < cos ? <Grano key={i} p={[(rn(i, 1) - 0.5) * 0.07, -0.032, (rn(i, 2) - 0.5) * 0.07]} s={0.009} c="#fbf7ea" /> : null)}
      </group>
      <Burbujas p={[0, 0.07, 0.02]} t={tt} k={noche > 0.02 && noche < 0.98 ? 1 : 0} w={0.08} hh={0.15} n={20} s={0.008} />
    </group>
    <Sombra p={[0, 0.002, 0]} r={0.26} />
    <Halo p={[0.08, 0.3, 0.2]} r={0.12 * noche} c="#ffe9a0" o={0.35} />
  </Estudio>;
}}</Stage>;

// 8 · TRES TUBOS, TRES COSTRAS: galvanizado, cobre y plástico apoyados en la mesa, cortados de frente; la costra naranja casi cierra el galvanizado, el cobre a medias, el plástico apenas
const HTres: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#0f1216">{(tt) => {
  const k = eio(tt, 0.8, 2.8), r = eio(tt, 2.8, 3.2);
  const T: [number, React.ReactNode, number, number, string][] = [[-0.5, GALV(), 0.86, 1, "GALVANIZADO"], [0, COBRE(), 0.45, 0.3, "COBRE"], [0.5, PVCM("#e8dcc0"), 0.1, 0, "PLÁSTICO"]];
  return <Estudio t={tt} cam={[0, 0.2, 1.3]} look={[0, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-1.0} c="#101418" />
    <Mostrador y={-0.19} />
    {T.map(([x, m, kk, ox], i) => <group key={i} scale={S0(tt, 0.2 + i * 0.15)}>
      <Boca p={[x * 1.05, 0, 0]} R={0.21} k={kk * k} mat={m} oxido={ox} L={0.6} rot={[0.1, -x * 0.25, 0]} />
      <Sombra p={[x, -0.188, -0.1]} r={0.22} sx={1.2} />
      {i === 0 && <Halo p={[x, 0, 0.1]} r={0.3 * r} c={RED} o={0.5} />}
    </group>)}
    {T.map(([x, , , , txt], i) => <Tag key={"t" + i} tt={tt} at={0.4 + i * 0.25} x={960 + x * 1300} y={890} txt={txt} size={58} />)}
  </Estudio>;
}}</Stage>;

// 9 · SESENTA GRADOS: termómetro grueso con un 60 grande; el rojo sube, pasa la marca, el tubo de plástico se dobla, echa vapor y gotea; baja a tibio y el tubo vuelve recto (verde)
const HSesenta: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const sube = eio(tt, 0.5, 1.6) * (1 - eio(tt, 2.9, 3.5)), lv = lerp(0.15, 0.85, sube), malo = cl((lv - 0.6) / 0.15), ok = eio(tt, 3.5, 3.9);
  return <Estudio t={tt} cam={[0.0, 0.4, 1.6]} look={[0.0, 0.38, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#12171c" />
    <Mostrador />
    <group position={[-0.38, 0, 0]} scale={S0(tt, 0.2)}>
      <mesh position={[0, 0.41, -0.04]}><boxGeometry args={[0.2, 0.78, 0.02]} /><meshStandardMaterial color="#efe9da" roughness={0.6} /></mesh>
      <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.06, 0.06, 0.7, 24]} />{VIDRIO(0.35)}</mesh>
      <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.1, 24, 16]} />{GLOW("#d62a1e", 1)}</mesh>
      <mesh position={[0, 0.05 + 0.35 * lv, 0]}><cylinderGeometry args={[0.036, 0.036, 0.7 * lv, 16]} />{GLOW("#d62a1e", 1)}</mesh>
      <mesh position={[0, 0.05 + 0.7 * 0.6, 0.0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.075, 0.01, 8, 32]} />{GLOW("#ffffff", 0.9)}</mesh>
    </group>
    <Tag tt={tt} at={0.4} x={560} y={330} txt="60°" size={64} col="#ffffff" />
    <group position={[0.28, 0.12, 0]} scale={S0(tt, 0.35)}>
      {[0, 1, 2, 3].map((i) => { const x = -0.3 + i * 0.2, y = -0.07 * malo * Math.sin((i + 0.5) / 4 * P); return <mesh key={i} position={[x + 0.1, y, 0]} rotation={[0, 0, P2 + (i < 2 ? -1 : 1) * 0.28 * malo]} castShadow><cylinderGeometry args={[0.045, 0.045, 0.21, 24]} />{PVCM("#e8dcc0")}</mesh>; })}
      <mesh position={[0.1, -0.025, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.056, 0.056, 0.08, 24]} />{PVCM("#ddd0b0")}</mesh>
      {malo > 0.3 && <Gota p={[0.1, -0.09 - ((tt * 1.3) % 1) * 0.09, 0.04]} s={0.016} />}
      <Burbujas p={[0.1, 0.04, 0]} t={tt} k={malo > 0.3 ? 1 : 0} w={0.25} hh={0.35} n={22} s={0.014} c="#cfd6dc" />
      <Halo p={[0.1, 0, 0.08]} r={0.28 * malo} c={RED} o={0.5} />
      <Halo p={[0.1, 0, 0.08]} r={0.24 * ok} c={VER} o={0.45} />
    </group>
    <Sombra p={[-0.38, 0.002, 0]} r={0.16} /><Sombra p={[0.38, 0.002, 0]} r={0.36} sx={1.6} o={0.5} />
  </Estudio>;
}}</Stage>;

// 10 · EL CALENTADOR SE CUIDA: el vinagre ámbar viene por el tubo; la manija grande gira 90° y lo frena justo antes; el calentador queda limpio (luz verde)
const HCalent: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#12161b">{(tt) => {
  const ang = lerp(0, P2, eio(tt, 1.1, 1.6)), flujo = eio(tt, 0.4, 1.5), ok = eio(tt, 2.0, 2.6), choca = eio(tt, 1.5, 1.8) * (1 - eio(tt, 2.4, 3.0));
  return <Estudio t={tt} cam={[0.02, 0.62, 1.3]} look={[0.06, 0.58, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#141a20" />
    <Piso c="#45413c" />
    <group scale={S0(tt, 0.2)}><Calentador p={[0.5, 0, 0]} s={0.95} glow={ok} /></group>
    <group scale={S0(tt, 0.35)}>
      <Caño a={[-0.75, 0.82, 0]} b={[0.42, 0.82, 0]} r={0.045} mat={VIDRIO(0.35)} />
      <mesh position={[0.5, 0.62, 0.17]}><sphereGeometry args={[0.022, 16, 12]} />{GLOW(col("#2a3a2e", VER, ok), 1)}</mesh>
      <Halo p={[0.5, 0.62, 0.19]} r={0.08 * ok} c={VER} o={0.7} />
      <Caño a={[0.42, 0.82, 0]} b={[0.42, 0.7, 0]} r={0.03} mat={COBRE()} />
      <Llena a={[-0.75, 0.82, 0]} b={[-0.1, 0.82, 0]} k={flujo} c={VIN} r={0.041} />
      <Valvula p={[0.02, 0.82, 0.04]} ang={ang} s={2.7} />
      <Halo p={[-0.08, 0.82, 0.06]} r={0.2 * choca} c={VIN} o={0.5} />
    </group>
    <Sombra p={[0.5, 0.002, 0]} r={0.3} />
  </Estudio>;
}}</Stage>;

// 11 · EL BYPASS: de cerca, el calentador con sus dos llaves y el puente arriba; se cierran las dos, se abre la del puente (verde) y una bola de ámbar cruza por arriba sin tocar el calentador
const HBypass: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#12161b">{(tt) => {
  const c1 = lerp(0, P2, eio(tt, 0.5, 1.0)), ab = lerp(P2, 0, eio(tt, 1.1, 1.6)), f = eio(tt, 1.7, 3.6);
  const pts: V3[] = [[-0.7, 0.8, 0], [-0.25, 0.8, 0], [-0.25, 1.02, 0], [0.25, 1.02, 0], [0.25, 0.8, 0], [0.7, 0.8, 0]];
  const seg = f * 5, si = Math.min(4, Math.floor(seg)), sq = seg - si, bp: V3 = [lerp(pts[si][0], pts[si + 1][0], sq), lerp(pts[si][1], pts[si + 1][1], sq), 0.0];
  return <Estudio t={tt} cam={[0.0, 0.58, 1.75]} look={[0, 0.52, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#141a20" />
    <Piso c="#45413c" />
    <group scale={S0(tt, 0.2)}><Calentador p={[0, 0, -0.05]} s={0.72} glow={eio(tt, 3.6, 4.0)} /></group>
    <group scale={S0(tt, 0.35)}>
      {pts.slice(0, 5).map((a, i) => <Caño key={i} a={a} b={pts[i + 1]} r={0.026} mat={VIDRIO(0.35)} />)}
      <Caño a={[-0.25, 0.8, 0]} b={[-0.25, 0.64, 0]} r={0.026} />
      <Caño a={[0.25, 0.64, 0]} b={[0.25, 0.8, 0]} r={0.026} />
      <Valvula p={[-0.25, 0.71, 0.02]} ang={c1} s={1.1} rot={[0, 0, P2]} />
      <Valvula p={[0.25, 0.71, 0.02]} ang={c1} s={1.1} rot={[0, 0, P2]} />
      <Valvula p={[0, 1.02, 0.02]} ang={ab} s={1.2} c="#2a8a3e" />
      {f > 0.01 && f < 0.99 && <><mesh position={bp}><sphereGeometry args={[0.055, 24, 16]} />{GLOW("#f0a83a", 1)}</mesh><Halo p={[bp[0], bp[1], 0.05]} r={0.13} c="#ffb84a" o={0.6} /></>}
      <Llena a={[-0.7, 0.8, 0]} b={[-0.25, 0.8, 0]} k={cl(seg)} c={VIN} r={0.022} />
      <Llena a={[-0.25, 0.8, 0]} b={[-0.25, 1.02, 0]} k={cl(seg - 1)} c={VIN} r={0.022} />
      <Llena a={[-0.25, 1.02, 0]} b={[0.25, 1.02, 0]} k={cl(seg - 2)} c={VIN} r={0.022} />
      <Llena a={[0.25, 1.02, 0]} b={[0.25, 0.8, 0]} k={cl(seg - 3)} c={VIN} r={0.022} />
      <Llena a={[0.25, 0.8, 0]} b={[0.7, 0.8, 0]} k={cl(seg - 4)} c={VIN} r={0.022} />
      <Halo p={[0, 1.02, 0.06]} r={0.2 * eio(tt, 1.6, 2.0)} c={VER} o={0.45} />
    </group>
  </Estudio>;
}}</Stage>;

// 12 · HASTA LA ÚLTIMA GOTA: tres llaves grandes de la casa con sus tubos de vidrio; el azul baja de arriba hacia abajo y cada llave suelta su última gota gorda que salpica en el piso
const HVaciar: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#10141a">{(tt) => {
  const v = eio(tt, 0.5, 3.2), xs = [-0.45, 0, 0.45];
  return <Estudio t={tt} cam={[0, 0.34, 1.42]} look={[0, 0.38, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azulejo z={-0.25} />
    <Piso c="#3d3a37" />
    <group scale={S0(tt, 0.2)}>
      <Caño a={[-0.62, 0.82, 0]} b={[0.55, 0.82, 0]} r={0.034} mat={GALV()} />
      <Llena a={[lerp(-0.62, 0.55, cl(v * 2.2)), 0.82, 0]} b={[0.55, 0.82, 0]} k={cl(v * 2.2) < 0.99 ? 1 : 0} r={0.03} />
      {xs.map((x, i) => { const lvl = 1 - cl(v * 1.4 - 0.2 - 0.12 * i), last = cl((tt - 2.4 - i * 0.3) / 0.7), sp = cl((tt - 3.0 - i * 0.3) / 0.4); return <group key={i}>
        <Caño a={[x, 0.82, 0]} b={[x, 0.26, 0]} r={0.028} mat={VIDRIO(0.35)} />
        <Llena a={[x, 0.26, 0]} b={[x, 0.26 + 0.56 * lvl, 0]} k={lvl > 0.01 ? 1 : 0} r={0.025} />
        <Grifo p={[x - 0.09, 0.08, 0]} s={0.72} />
        <Chorro a={[x + 0.01, 0.2, 0]} t={tt + i} k={lvl > 0.05 ? lvl : 0} n={12} r={0.012} />
        {last > 0 && last < 1 && <Gota p={[x + 0.01, 0.19 - last * last * 0.18, 0.04]} s={0.034} />}
        {sp > 0 && sp < 1 && <><mesh position={[x + 0.01, 0.004, 0.04]} rotation={[-P2, 0, 0]} scale={1 + sp * 3}><ringGeometry args={[0.02, 0.034, 24]} />{AGUA(0.9 * (1 - sp))}</mesh>{Array.from({ length: 7 }, (_, j) => { const an = j * 0.9; return <Gota key={j} p={[x + 0.01 + Math.cos(an) * 0.06 * sp, 0.01 + 0.07 * Math.sin(sp * P), 0.04 + Math.sin(an) * 0.06 * sp]} s={0.009} />; })}</>}
        <Halo p={[x, 0.3, 0.08]} r={0.1 * eio(tt, 3.3 + i * 0.2, 3.7 + i * 0.2)} c={VER} o={0.45} />
      </group>; })}
    </group>
  </Estudio>;
}}</Stage>;

// 13 · SE DEBILITA: dos tubos de vidrio grandes con luz detrás; al vacío entra el vinagre y queda ámbar fuerte; al lleno de agua entra una gota ámbar que se abre en remolinos y se pierde
const HDiluye: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const e = eio(tt, 0.5, 2.2), pal = eio(tt, 1.6, 3.6), sw = cl((tt - 1.0) / 2.8);
  return <Estudio t={tt} cam={[0, 0.36, 1.05]} look={[0, 0.34, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#12171c" />
    <Tag tt={tt} at={0.8} x={700} y={160} txt="5%" size={64} col="#f0b84a" />
    <Halo p={[0, 0.4, -0.5]} r={0.9} c="#fff2d0" o={0.25} />
    <Mostrador />
    {[-0.28, 0.28].map((x, i) => <group key={i} position={[x, 0, 0]} scale={S0(tt, 0.2 + i * 0.12)}>
      <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[0.12, 0.12, 0.62, 36, 1, true]} />{VIDRIO(0.3)}</mesh>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.13, 0.13, 0.04, 36]} />{GALV()}</mesh>
      {i === 1 && <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[0.114, 0.114, 0.6, 36]} />{LIQ(col("#a8d2ee", "#e2dcc2", pal * 0.5), 0.45)}</mesh>}
      {i === 0 && <mesh position={[0, 0.04 + 0.3 * e, 0]}><cylinderGeometry args={[0.114, 0.114, 0.6 * e, 36]} />{LIQ(VIN, 0.9)}</mesh>}
      {i === 0 && e > 0.01 && e < 0.99 && <Chorro a={[0, 0.7, 0]} t={tt} k={1} c={VIN} n={14} r={0.018} />}
      {i === 1 && sw > 0 && sw < 1 && Array.from({ length: 14 }, (_, j) => { const a = j * 0.9 + sw * 6, rr = 0.02 + 0.08 * sw * rn(j, 1); return <mesh key={j} position={[Math.cos(a) * rr, 0.62 - sw * 0.45 * (0.5 + rn(j, 2)), Math.sin(a) * rr]} scale={0.02 + 0.05 * sw}><sphereGeometry args={[1, 12, 10]} />{LIQ(VIN, 0.6 * (1 - sw))}</mesh>; })}
      <Sombra p={[0, 0.002, 0]} r={0.18} />
    </group>)}
  </Estudio>;
}}</Stage>;

// 14 · LA CUENTA: un tubo largo de 20 tramos sobre la pared que se encienden de a uno con un pulso; adelante, cuatro botellas de un litro grandes se van llenando
const HCuenta: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#12161b">{(tt) => {
  const n = cl((tt - 0.5) / 3.2) * 20;
  return <Estudio t={tt} cam={[0, 0.38, 1.3]} look={[0, 0.33, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azulejo z={-0.35} />
    <Mostrador />
    {Array.from({ length: 20 }, (_, i) => { const on = cl(n - i), pul = on > 0 && on < 1 ? 1 : 0, x = -0.81 + i * 0.085;
      return <group key={i} position={[x, 0.6, -0.12]} scale={S0(tt, 0.15 + i * 0.015)}>
        <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.04, 0.04, 0.078, 16]} />{COBRE()}</mesh>
        {on > 0.01 && <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.043, 0.043, 0.08, 16]} />{GLOW(VIN, 0.35 + 0.4 * on)}</mesh>}
        <mesh position={[0.041, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.046, 0.046, 0.01, 16]} />{GALV()}</mesh>
        <Halo p={[0, 0, 0.05]} r={0.1 * pul} c={VIN} o={0.8} />
      </group>; })}
    {[0, 1, 2, 3].map((j) => { const lv = cl((n - j * 5) / 5); return <group key={j} position={[-0.45 + j * 0.3, 0, 0.1]} scale={S0(tt, 0.35 + j * 0.1)}>
      <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.09, 0.09, 0.32, 28, 1, true]} />{VIDRIO(0.3)}</mesh>
      <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.03, 0.09, 0.08, 24, 1, true]} />{VIDRIO(0.3)}</mesh>
      {lv > 0.01 && <mesh position={[0, 0.16 * lv + 0.003, 0]}><cylinderGeometry args={[0.086, 0.086, 0.32 * lv, 28]} />{LIQ(VIN, 0.88)}</mesh>}
      <Sombra p={[0, 0.002, 0]} r={0.12} />
      <Halo p={[0, 0.18, 0.1]} r={0.14 * (lv > 0.99 ? 1 : 0)} c={VER} o={0.4} /></group>; })}
  </Estudio>;
}}</Stage>;

// 15 · EL EMBUDO EN EL JARRO: el tinaco en la azotea con su jarro de aire (rotulado); el embudo baja a la punta, cae un chorro ámbar grueso y en rayos X el vinagre baja hasta abajo
const HEmbudo: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#10141a">{(tt) => {
  const ey = lerp(0.3, 0, eio(tt, 0.4, 1.1)), ch = tt > 1.2 && tt < 4.2 ? 1 : 0, f = eio(tt, 1.4, 3.8);
  return <Estudio t={tt} cam={[0.1, 0.72, 2.45]} look={[0.0, 0.68, 0]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, 0.8, -0.8]}><planeGeometry args={[6, 3]} /><meshBasicMaterial color="#6f8fb0" toneMapped={false} /></mesh>
    <mesh position={[0, 0.25, -0.75]}><planeGeometry args={[6, 0.5]} /><meshStandardMaterial color="#b9b2a6" roughness={0.9} /></mesh>
    <Piso c="#8a8378" />
    <group scale={S0(tt, 0.2)}><Tinaco p={[-0.4, 0.0, -0.1]} s={0.95} x={1} lvl={0.15 + 0.3 * cl(f * 1.6 - 1)} c={col("#7fb6e0", VIN, cl(f * 1.6 - 1))} /></group>
    <group scale={S0(tt, 0.3)}>
      <Caño a={[-0.4, 0.06, 0.2]} b={[0.3, 0.06, 0.2]} r={0.034} mat={VIDRIO(0.4)} />
      <Caño a={[0.3, 0.06, 0.2]} b={[0.3, 1.02, 0.2]} r={0.034} mat={VIDRIO(0.4)} />
      <Llena a={[0.3, 1.02, 0.2]} b={[0.3, 0.06, 0.2]} k={cl(f * 1.6)} c={VIN} r={0.03} />
      <Llena a={[0.3, 0.06, 0.2]} b={[-0.4, 0.06, 0.2]} k={cl(f * 1.6 - 0.6)} c={VIN} r={0.03} />
      <Halo p={[0.3, lerp(1.02, 0.06, cl(f * 1.6)), 0.26]} r={0.12 * (f > 0.01 && f < 0.6 ? 1 : 0)} c="#ffb84a" o={0.6} />
    </group>
    <Tag tt={tt} at={0.5} x={1330} y={420} txt="JARRO" size={64} />
    <group position={[0.3, 1.1 + ey, 0.2]} scale={S0(tt, 0.4)}>
      <mesh><cylinderGeometry args={[0.13, 0.03, 0.15, 32, 1, true]} /><meshStandardMaterial color="#e6e2d6" roughness={0.5} side={THREE.DoubleSide} /></mesh>
      <Caño a={[0, -0.075, 0]} b={[0, -0.12, 0]} r={0.025} mat={<meshStandardMaterial color="#e6e2d6" />} />
    </group>
    <Chorro a={[0.3, 1.36, 0.2]} t={tt} k={ch} c={VIN} n={24} r={0.022} />
    <Sombra p={[-0.4, 0.002, -0.1]} r={0.38} />
  </Estudio>;
}}</Stage>;

// 16 · EL AIRE ATRAPADO: tubo principal sobre la pared con tres ramas cerradas; el ámbar avanza y en cada rama choca con una burbuja de aire grande y brillante que late roja; el frente rebota
const HAire: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#10141a">{(tt) => {
  const f = eio(tt, 0.4, 1.8), xs = [-0.4, 0.05, 0.5], late = tt > 1.8 ? 0.5 + 0.5 * Math.sin(tt * 6) : 0, reb = tt > 1.8 ? 0.03 * Math.sin((tt - 1.8) * 9) * Math.exp(-(tt - 1.8) * 1.2) : 0;
  return <Estudio t={tt} cam={[0, 0.25, 1.3]} look={[0, 0.18, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azulejo z={-0.15} />
    <Piso c="#3d3a37" y={-0.32} />
    <group scale={S0(tt, 0.2)}>
      <Caño a={[-0.8, 0.42, 0]} b={[0.72, 0.42, 0]} r={0.05} mat={VIDRIO(0.35)} />
      <Llena a={[-0.8, 0.42, 0]} b={[0.72, 0.42, 0]} k={f} c={VIN} r={0.045} />
      {xs.map((x, i) => <group key={i}>
        <Caño a={[x, 0.42, 0]} b={[x, -0.12, 0]} r={0.042} mat={VIDRIO(0.35)} />
        <Llena a={[x, 0.38, 0]} b={[x, -0.12, 0]} k={(0.18 + reb) * f} c={VIN} r={0.038} />
        {f > 0.5 && <><mesh position={[x, 0.15 - reb, 0]} scale={[0.039, 0.1 * (1 - 4 * reb), 0.039]}><sphereGeometry args={[1, 28, 20]} /><meshStandardMaterial color="#eaf4ff" metalness={0.4} roughness={0.04} transparent opacity={0.7} envMapIntensity={1.5} /></mesh>
          <mesh position={[x - 0.012, 0.2, 0.03]} scale={[0.008, 0.03, 0.006]}><sphereGeometry args={[1, 10, 8]} />{GLOW("#ffffff", 0.9)}</mesh></>}
        <Halo p={[x, 0.15, 0.06]} r={0.12 * late} c={RED} o={0.3} />
        <mesh position={[x, 0.38 - (0.18 + reb) * f * 0.5 - 0.02, 0]} scale={[0.038, 0.016, 0.038]}><sphereGeometry args={[1, 16, 10]} />{LIQ(VIN, 0.95)}</mesh>
        <Valvula p={[x, -0.17, 0]} ang={P2} s={0.75} rot={[0, 0, P2]} />
      </group>)}
    </group>
  </Estudio>;
}}</Stage>;

// 17 · DE LA MÁS LEJANA: el tinaco y tres llaves con su cubeta; MAL: se abre la cercana y el ámbar se escapa ahí (las lejanas secas, cubetas vacías);
// BIEN: se abre la lejana, el ámbar recorre todo y las cubetas se llenan de la lejana a la cercana
const HLejana: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#10141a">{(tt) => {
  const f1 = eio(tt, 0.4, 1.2), mal = eio(tt, 1.2, 1.5) * (1 - eio(tt, 2.0, 2.2)), fase2 = tt > 2.2, f2 = eio(tt, 2.3, 3.3), xs = [-0.2, 0.25, 0.7];
  return <Estudio t={tt} cam={[0.08, 0.45, 1.6]} look={[0.08, 0.34, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.5} c="#1b2128" />
    <Piso c="#3d3a37" />
    <group scale={S0(tt, 0.2)}><Tinaco p={[-0.68, 0.0, -0.05]} s={0.62} x={1} lvl={0.4} c={VIN} /></group>
    <group scale={S0(tt, 0.3)}>
      <Caño a={[-0.55, 0.6, 0]} b={[0.82, 0.6, 0]} r={0.03} mat={VIDRIO(0.55)} />
      <Llena a={[-0.55, 0.6, 0]} b={[0.82, 0.6, 0]} k={fase2 ? Math.max(0.33, f2) : 0.33 * f1} c={VIN} r={0.027} />
      {fase2 && f2 > 0.01 && f2 < 0.99 && <Halo p={[lerp(-0.55, 0.82, f2), 0.6, 0.06]} r={0.12} c="#ffb84a" o={0.7} />}
      <Cruz p={[xs[0], 0.42, 0.12]} s={0.16} k={mal} />
      {xs.map((x, i) => { const on = fase2 ? cl(f2 * 3 - i * 0.6) : i === 0 ? f1 : 0, g = fase2 ? eio(tt, 2.8 + (2 - i) * 0.35, 3.1 + (2 - i) * 0.35) : 0;
        const lvl = fase2 ? cl((tt - 2.8 - (2 - i) * 0.35) / 0.9) * 0.7 : i === 0 ? 0.35 * f1 : 0; return <group key={i}>
        <Caño a={[x, 0.6, 0]} b={[x, 0.3, 0]} r={0.024} mat={VIDRIO(0.55)} />
        <Llena a={[x, 0.6, 0]} b={[x, 0.3, 0]} k={on} c={VIN} r={0.021} />
        <Grifo p={[x - 0.08, 0.1, 0]} s={0.62} />
        <Cubeta p={[x + 0.02, 0, 0.04]} s={0.42} lvl={lvl} c={VIN} />
        {(fase2 ? g > 0 && lvl < 0.69 : i === 0 && f1 > 0.1) && <Chorro a={[x + 0.02, 0.23, 0.04]} t={tt + i} k={1} c={VIN} n={10} r={0.01} />}
        <Halo p={[x, 0.2, 0.1]} r={fase2 ? 0.14 * g : i === 0 ? 0.14 * mal : 0} c={fase2 ? VER : RED} o={0.5} />
      </group>; })}
    </group>
  </Estudio>;
}}</Stage>;

// 18 · LA PIEDRA SE DISUELVE: un frasco de vidrio con vinagre sobre la mesa; adentro el trozo de sarro se achica, suelta escamas planas desde temprano y cadenas de burbujas
const HDisuelve: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="iris" mesa={false} tone="#0f0d0a">{(tt) => {
  const k = eio(tt, 0.4, 4.0), s = lerp(0.12, 0.05, k);
  return <Estudio t={tt} cam={[0, 0.24, 0.95]} look={[0, 0.18, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#1a140c" />
    <Madera />
    <group scale={S0(tt, 0.2)}>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.22, 0.22, 0.4, 44, 1, true]} />{VIDRIO(0.22)}</mesh>
      <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.212, 0.212, 0.33, 44]} />{LIQ("#e9d79a", 0.35)}</mesh>
      <mesh position={[0, 0.335, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.0, 0.212, 44]} />{LIQ("#fff2c4", 0.35)}</mesh>
      <group rotation={[0.2, tt * 0.25, 0.1]} position={[0, 0.03 + s * 0.8, 0]}><Piedra p={[0, 0, 0]} s={s} /></group>
    </group>
    <Burbujas p={[0, 0.06 + s, 0]} t={tt} k={tt > 0.3 ? 1 : 0} w={0.08} hh={0.27} n={34} s={0.011} />
    {Array.from({ length: 10 }, (_, i) => { const q = cl((tt - 0.25 - i * 0.24) / 1.3); return q > 0 && q < 1 ? <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.14 + q * 0.08 * (rn(i, 2) - 0.5), 0.1 + s - q * (0.08 + s), 0.03 + (rn(i, 3) - 0.5) * 0.1]} rotation={[q * 5, q * 3, q * 2]} scale={[0.034, 0.006, 0.026]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={SARRO} /></mesh> : null; })}
    {Array.from({ length: 10 }, (_, i) => cl((tt - 0.25 - i * 0.24) / 1.3) >= 1 ? <mesh key={"f" + i} position={[(rn(i, 1) - 0.5) * 0.24, 0.008, (rn(i, 3) - 0.5) * 0.18]} rotation={[-P2, 0, rn(i, 4) * 3]} scale={[0.034, 0.026, 0.006]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={SARRO} /></mesh> : null)}
    <Sombra p={[0, 0.002, 0]} r={0.3} />
    <Halo p={[0.1, 0.3, 0.2]} r={0.25} c="#ffd98a" o={0.2} />
  </Estudio>;
}}</Stage>;

// 19 · NO ABRIR: de cerca, la llave de paso del tinaco sobre su repisa; la manija grande intenta girar y se traba con sacudidas; un candado rojo cae con peso, rebota y la bloquea
const HNoAbrir: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="drop" mesa={false} tone="#12161b">{(tt) => {
  const intenta = tt > 0.4 && tt < 1.6 ? 0.38 * Math.sin((tt - 0.4) * 18) * (1 - (tt - 0.4) / 1.2) : 0, lq = cl((tt - 1.6) / 0.38), lk = lq * lq, b = bote(tt, 1.98), sw = Math.sin(tt * 2.2) * 0.25;
  return <Estudio t={tt} cam={[0.05, 0.12, 0.85]} look={[0.02, 0.06, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azulejo z={-0.3} />
    <mesh position={[0, -0.09, -0.05]} castShadow receiveShadow><boxGeometry args={[1.8, 0.03, 0.3]} /><meshStandardMaterial map={ruido("madera", "#6a4a2c", ["#4a321c", "#7e5a38", "#5a3e24"], 4000, 6)} roughness={0.8} /></mesh>
    <group scale={S0(tt, 0.2)}>
      <Caño a={[-0.8, 0, 0]} b={[0.8, 0, 0]} r={0.04} mat={PVCM()} />
      <Valvula p={[0, 0, 0]} ang={P2 + intenta} s={2.6} />
      <Halo p={[0, 0.08, 0.1]} r={0.14 * Math.abs(intenta) * 2.5} c="#ffd27a" o={0.5} />
      <group position={[0.2, 0.12, 0.02]} rotation={[0, 0, sw]}>
        <Caño a={[0, 0, 0]} b={[0, -0.1, 0]} r={0.002} mat={<meshStandardMaterial color="#c9b88a" />} />
        <mesh position={[0, -0.17, 0]}><planeGeometry args={[0.12, 0.14]} /><meshStandardMaterial color="#fbfaf4" roughness={0.9} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, -0.17, 0.002]}><circleGeometry args={[0.04, 24]} />{GLOW(RED, 0.9)}</mesh>
        <mesh position={[0, -0.17, 0.004]} rotation={[0, 0, 0.7]}><planeGeometry args={[0.07, 0.012]} /><meshBasicMaterial color="#ffffff" /></mesh>
      </group>
    </group>
    {lq > 0.01 && <Sombra p={[-0.03, -0.073, 0.1]} r={0.06 + 0.06 * lk} o={0.6 * lk} />}
    {lq > 0.01 && <group position={[-0.03, lerp(0.75, 0.19, lk) + 0.06 * b, 0.1]} rotation={[0, 0, 0.18 * b]} scale={1.35}>
      <RBox s={[0.14, 0.12, 0.06]} r={0.015} p={[0, 0, 0]}><meshStandardMaterial color="#c4281c" roughness={0.4} /></RBox>
      <mesh position={[0, 0.075, 0]}><torusGeometry args={[0.045, 0.012, 8, 24, P]} />{M.cromo()}</mesh>
    </group>}
    <Halo p={[0, 0.17, 0.12]} r={0.3 * eio(tt, 1.98, 2.3)} c={RED} o={0.4} />
    <Sombra p={[0, -0.074, 0]} r={0.3} sx={2} o={0.5} />
  </Estudio>;
}}</Stage>;

// 20 · EL POLVO BLANCO: la cubeta en corte; granitos grandes bajan con peso, rebotan y forman una capa blanca gruesa contra el vidrio; el vinagre se aclara
const HPolvo: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="wipe" mesa={false} tone="#12161b">{(tt) => {
  const capa = eio(tt, 0.6, 3.8), clara = eio(tt, 1.4, 4.0);
  return <Estudio t={tt} cam={[0, 0.22, 0.85]} look={[0, 0.16, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azulejo z={-0.5} />
    <Mostrador />
    <group scale={S0(tt, 0.2)}>
      <Cubeta p={[0, 0, 0]} s={1.3} lvl={0.82} c={col("#c9a24a", "#e8ece4", clara)} corte />
      <Halo p={[0, 0.03 + 0.07 * capa, 0.2]} r={0.2 * capa} c="#ffffff" o={0.3} />
      <mesh position={[0, 0.006 + 0.035 * capa, 0]}><cylinderGeometry args={[0.165 + 0.01 * capa, 0.165, 0.07 * capa + 0.001, 40]} /><meshStandardMaterial map={sarroTex()} roughness={0.95} /></mesh>
      {Array.from({ length: 26 }, (_, i) => { const q = (tt * 0.32 + rn(i, 1)) % 1, y = Math.max(0.02 + 0.07 * capa, 0.34 - q * 0.36), b2 = y <= 0.02 + 0.07 * capa + 0.001 ? 0.01 * Math.abs(Math.sin(q * 30)) : 0;
        return <Grano key={i} p={[(rn(i, 2) - 0.5) * 0.28, y + b2 * 2, (rn(i, 3) - 0.5) * 0.16 + 0.07]} s={0.013 + 0.008 * rn(i, 4)} c="#ffffff" r={[q * 5, q * 3, 0]} />; })}
    </group>
    <Sombra p={[0, 0.002, 0]} r={0.3} />
  </Estudio>;
}}</Stage>;

// 21 · ANTES Y DESPUÉS: dos llaves y dos cubetas en corte; la de antes un hilito y el agua apenas sube; la de después un chorro grueso que la llena y brilla verde
const HAntes: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const k = cl((tt - 0.5) / 2.8), ok = eio(tt, 3.3, 3.7);
  return <Estudio t={tt} cam={[0, 0.36, 1.08]} look={[0, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Azulejo z={-0.5} />
    {k >= 1 && Array.from({ length: 10 }, (_, j) => { const q = ((tt * 1.4 + j * 0.37) % 1), an = j * 0.63; return <Gota key={"s" + j} p={[0.34 + Math.cos(an) * (0.16 + 0.08 * q), 0.36 + 0.08 * Math.sin(q * P) - 0.3 * q * q, 0.02 + Math.sin(an) * (0.16 + 0.08 * q)]} s={0.012} />; })}
    <Mostrador />
    {[-0.34, 0.34].map((x, i) => <group key={i}>
      <group scale={S0(tt, 0.2 + i * 0.12)}><Grifo p={[x - 0.2, 0, -0.2]} s={1.2} /><Cubeta p={[x, 0, 0.02]} s={0.95} lvl={i === 0 ? 0.18 * k : k} corte /></group>
      <Chorro a={[x, 0.42, 0.02]} t={tt + i} k={tt > 0.5 && k < 1 ? (i === 0 ? 0.5 : 1.4) : 0} n={i === 0 ? 10 : 34} r={i === 0 ? 0.006 : 0.02} />
      <Sombra p={[x, 0.002, 0.02]} r={0.24} />
    </group>)}
    <Halo p={[0.34, 0.22, 0.14]} r={0.36 * ok} c={VER} o={0.45} />
    <Halo p={[-0.34, 0.1, 0.14]} r={0.18 * ok} c={RED} o={0.35} />
    <Tag tt={tt} at={0.6} x={620} y={190} txt="ANTES" size={44} />
    <Tag tt={tt} at={0.9} x={1300} y={190} txt="DESPUÉS" size={44} />
  </Estudio>;
}}</Stage>;

// 22 · PODRIDO POR DENTRO: tubo galvanizado abierto a lo largo, grande; por dentro costras de óxido; pasa el vinagre, las costras se desprenden en escamas y en la unión cae una gota roja gorda
const HPodrido: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="diag" mesa={false} tone="#100d0b">{(tt) => {
  const f = eio(tt, 0.3, 1.5), suelta = eio(tt, 1.5, 2.3), gota = ((tt - 2.4) * 0.8) % 1;
  return <Estudio t={tt} cam={[0, 0.3, 1.1]} look={[0, -0.03, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#15110e" />
    <Mostrador y={-0.2} />
    <group scale={S0(tt, 0.2) * 1.55} rotation={[0.22, 0, 0]}>
      <mesh rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.15, 0.15, 1.2, 48, 1, true, P2, P]} />{GALV()}</mesh>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.135, 0.135, 1.2, 48, 1, true, P2, P]} /><meshStandardMaterial map={oxidoTex()} roughness={0.95} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 9 }, (_, i) => { const x = -0.5 + i * 0.12, a = P * (0.7 + 0.6 * rn(i, 2)), drop = suelta * (i % 2); return <Piedra key={i} ox k={"po" + (i % 3)} p={[x, Math.sin(a) * -0.11 - drop * 0.06, Math.cos(a) * -0.11]} s={(0.03 + 0.015 * rn(i, 3)) * (1 - 0.5 * drop)} />; })}
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.185, 0.185, 0.22, 6, 1, true, P2, P]} />{GALV()}</mesh>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.09 + i * 0.036, 0, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.152, 0.007, 6, 32, P]} /><meshStandardMaterial color={col("#6a3a20", "#8d949a", suelta)} /></mesh>)}
      <mesh position={[-0.6 + 0.6 * f, -0.06, -0.02]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.07, 0.07, 1.2 * f + 0.001, 32]} />{LIQ(VIN, 0.7)}</mesh>
      {Array.from({ length: 8 }, (_, i) => { const q = suelta * (0.6 + 0.4 * rn(i, 1)); return q > 0.02 ? <mesh key={i} position={[-0.1 + rn(i, 2) * 0.2, -0.08 - q * 0.08, 0.0]} rotation={[q * 4, q * 3, 0]} scale={[0.04, 0.008, 0.03]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={OXIDO} /></mesh> : null; })}
    </group>
    {tt > 2.4 && <Gota p={[0, -0.12 - Math.max(0, gota - 0.5) * 0.4, 0.2]} s={0.03 + 0.016 * Math.min(1, gota * 2)} c="#9a3a1c" />}
    <Halo p={[0, -0.05, 0.18]} r={0.3 * suelta} c={RED} o={0.45} />
  </Estudio>;
}}</Stage>;

// 23 · LOS CINCO ERRORES (items): cinco pedestales grandes; con cada error cae su maqueta con peso y su base se enciende roja:
// olla hirviendo con vapor · ácido y cloro SEPARADOS por una cruz · calentador con el vinagre entrando · compresor con tanque y manguera · la llave cercana abierta primero
const HErrores: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="blinds" mesa={false} tone="#110d0c">{(tt) => {
  const a = Array.from({ length: 5 }, (_, i) => AT(h, i, 1.2, 0.6));
  return <Estudio t={tt} cam={[0, 0.3, 1.35]} look={[0, 0.24, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#140f0e" />
    <Piso c="#3a3532" />
    {Array.from({ length: 5 }, (_, i) => { const x = -0.76 + i * 0.38, d = eio(tt, a[i], a[i] + 0.35), on = eio(tt, a[i] + 0.3, a[i] + 0.6), b = d >= 1 ? bote(tt, a[i] + 0.35) : 0, y = lerp(0.6, 0, d) + 0.03 * b;
      return <group key={i} position={[x, 0, 0]}>
        <group scale={S0(tt, 0.2 + i * 0.06)}><mesh position={[0, 0.05, 0]} castShadow><cylinderGeometry args={[0.16, 0.17, 0.1, 32]} /><meshStandardMaterial color="#2a2726" roughness={0.6} /></mesh>
          <mesh position={[0, 0.101, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.15, 32]} />{GLOW(RED, 0.6 * on)}</mesh></group>
        {d > 0.01 && <group position={[0, 0.11 + y, 0]} scale={2.1}>
          {i === 0 && <><mesh position={[-0.02, 0.05, 0]} castShadow><cylinderGeometry args={[0.07, 0.065, 0.1, 24]} />{M.cromo("#b0b4b8")}</mesh><Burbujas p={[-0.02, 0.11, 0]} t={tt} k={1} w={0.1} hh={0.18} n={12} s={0.012} c="#f0f0f0" />
            <mesh position={[0.075, 0.02, 0.04]} rotation={[0, 0.4, P2]}><cylinderGeometry args={[0.018, 0.018, 0.14, 16]} />{PVCM("#e8dcc0")}</mesh></>}
          {i === 1 && <><mesh position={[-0.06, 0.07, 0]}><cylinderGeometry args={[0.035, 0.04, 0.14, 20]} /><meshStandardMaterial color="#e6d36a" roughness={0.4} /></mesh>
            <mesh position={[0.06, 0.07, 0]}><cylinderGeometry args={[0.035, 0.04, 0.14, 20]} /><meshStandardMaterial color="#e8eef2" roughness={0.4} /></mesh><Cruz p={[0, 0.08, 0.06]} s={0.09} k={on} /></>}
          {i === 2 && <><Calentador p={[0, 0, 0]} s={0.2} /><Chorro a={[0.0, 0.3, 0.02]} t={tt} k={1} c={VIN} n={8} r={0.008} /></>}
          {i === 3 && <><mesh position={[0, 0.045, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.045, 0.045, 0.16, 20]} /><meshStandardMaterial color="#c4281c" roughness={0.35} metalness={0.3} /></mesh>
            <RBox s={[0.07, 0.06, 0.06]} r={0.01} p={[0, 0.11, 0]}><meshStandardMaterial color="#222" roughness={0.5} /></RBox>
            <mesh position={[0.07, 0.1, 0.04]} rotation={[P2, 0, 0]}><torusGeometry args={[0.035, 0.007, 8, 24]} /><meshStandardMaterial color="#1a1a1a" /></mesh></>}
          {i === 4 && <><Grifo p={[-0.05, 0, 0]} s={0.38} /><Chorro a={[0.0, 0.08, 0]} t={tt} k={1} c={VIN} n={8} r={0.008} /></>}
        </group>}
        <Halo p={[0, 0.2, 0.1]} r={0.16 * on} c={RED} o={0.4} />
        <Sombra p={[0, 0.002, 0]} r={0.2} o={0.5} />
      </group>; })}
  </Estudio>;
}}</Stage>;

// 24 · DON ERNESTO: sobre el mostrador de madera, su cubeta de metal y el reloj de bolsillo abierto parado de frente con luz cálida; la llave llena la cubeta y la aguja barre el minuto
const HErnesto: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="ring" mesa={false} tone="#140f0a">{(tt) => {
  const k = cl((tt - 0.5) / 3.3), fin = eio(tt, 3.8, 4.1);
  return <Estudio t={tt} cam={[0.05, 0.38, 1.15]} look={[0.05, 0.22, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#1a120b" />
    <mesh position={[0, -0.03, 0.15]} receiveShadow castShadow><boxGeometry args={[2.4, 0.06, 1.2]} /><meshStandardMaterial map={ruido("madera", "#6a4a2c", ["#4a321c", "#7e5a38", "#5a3e24"], 4000, 6)} roughness={0.8} /></mesh>
    <group scale={S0(tt, 0.2)}><Grifo p={[-0.42, 0, -0.2]} s={1.2} /><Cubeta p={[-0.2, 0, 0]} s={1.0} lvl={k} metal corte /></group>
    {Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[-0.2 + Math.cos(i * 1.7) * 0.16, 0.08 + i * 0.05, Math.sin(i * 1.7) * 0.16]}><sphereGeometry args={[0.025, 10, 8]} /><meshStandardMaterial color="#6e5a44" roughness={0.9} /></mesh>)}
    <Chorro a={[-0.2, 0.42, 0]} t={tt} k={tt > 0.5 && k < 1 ? 1.1 : 0} n={26} r={0.014} />
    <group position={[0.32, 0.2, 0.12]} rotation={[-0.18, -0.35, 0]} scale={S0(tt, 0.4)}><Reloj s={0.6} k={k} /></group>
    <Halo p={[0.32, 0.2, 0.2]} r={0.3 * fin} c="#ffcf5a" o={0.45} />
    <Halo p={[0.05, 0.45, -0.2]} r={0.8} c="#ffb860" o={0.2} />
    <Sombra p={[-0.2, 0.002, 0]} r={0.26} /><Sombra p={[0.32, 0.002, 0.12]} r={0.16} />
  </Estudio>;
}}</Stage>;

// 25 · EL REPASO (items): una repisa de dos niveles con ocho piezas grandes (cubeta · aireador · tubo · calentador · tinaco · botella · llave · reloj); con cada idea la suya salta con rebote y se enciende verde
const HRecap: C = ({ t, h }) => <Stage t={t} h={h} cam={0} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const a = Array.from({ length: 8 }, (_, i) => AT(h, i, 0.55, 0.5));
  return <Estudio t={tt} cam={[0, 0.4, 1.3]} look={[0, 0.3, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#12171c" />
    {[0, 0.4].map((yy, r) => <mesh key={r} position={[0, yy - 0.02, -0.02]} receiveShadow castShadow><boxGeometry args={[1.7, 0.035, 0.36]} /><meshStandardMaterial map={ruido("madera", "#6a4a2c", ["#4a321c", "#7e5a38", "#5a3e24"], 4000, 6)} roughness={0.8} /></mesh>)}
    {Array.from({ length: 8 }, (_, i) => { const x = -0.6 + (i % 4) * 0.4, row = i < 4 ? 0.4 : 0, dq = cl((tt - a[i] + 0.35) / 0.35), on = eio(tt, a[i], a[i] + 0.3), b = dq >= 1 ? bote(tt, a[i]) : 0, y = row + 0.45 * (1 - dq * dq) + 0.05 * b;
      if (dq <= 0) return null;
      return <group key={i} position={[x, y, 0]} scale={1.25}>
        {i === 0 && <Cubeta p={[0, 0, 0]} s={0.62} lvl={0.6} />}
        {i === 1 && <group position={[0, 0.05, 0]} rotation={[0.5, 0, 0]}><mesh><cylinderGeometry args={[0.07, 0.07, 0.06, 28, 1, true]} />{M.cromo()}</mesh><mesh position={[0, -0.03, 0]} rotation={[P2, 0, 0]}><circleGeometry args={[0.068, 28]} /><meshStandardMaterial map={sarroTex()} /></mesh></group>}
        {i === 2 && <Boca p={[0, 0.1, 0]} R={0.09} k={0.6} mat={GALV()} oxido={1} L={0.2} />}
        {i === 3 && <Calentador p={[0, 0, 0]} s={0.28} />}
        {i === 4 && <Tinaco p={[0, 0, 0]} s={0.3} />}
        {i === 5 && <><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.05, 0.055, 0.2, 20]} />{LIQ("#f3e7c8", 0.8)}</mesh><mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.022, 0.022, 0.04, 14]} /><meshStandardMaterial color="#c4281c" /></mesh></>}
        {i === 6 && <Grifo p={[-0.06, 0, 0]} s={0.55} />}
        {i === 7 && <group position={[0, 0.11, 0]}><Reloj s={0.32} k={on} /></group>}
        <Halo p={[0, 0.1, 0.12]} r={0.17 * on} c={VER} o={0.55} />
      </group>; })}
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  d_nobaja: HNoBaja, d_lapiz: HLapiz, d_cubeta: HCubeta, d_aguja: HAguja, d_todas: HTodas, d_aireador: HAireador, d_vaso: HVaso, d_tres: HTres,
  d_sesenta: HSesenta, d_calent: HCalent, d_bypass: HBypass, d_vaciar: HVaciar, d_diluye: HDiluye, d_cuenta: HCuenta, d_embudo: HEmbudo, d_aire: HAire,
  d_lejana: HLejana, d_disuelve: HDisuelve, d_noabrir: HNoAbrir, d_polvo: HPolvo, d_antes: HAntes, d_podrido: HPodrido, d_errores: HErrores, d_ernesto: HErnesto, d_recap: HRecap,
};
