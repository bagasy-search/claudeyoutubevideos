// plo4b v2 · TU CALENTADOR NO NECESITA PURGA · reescrito tras EVAL r1 (prom 4.7): CERO rótulos, objetos reales con textura (chaqueta del tanque con costura,
// válvula de alivio con resorte, ánodo rugoso, espirales, llama en capas, balanza de verdad), todo ENTRA (nada aparece entero), cámara fija y cercana
// (fit={false}) con margen, sombra de contacto, y el momento clave de la idea pasa ANTES de tt≈4.2.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, phys, RED, Stage, VER } from "./ckit";
import { ctex, Estudio, M, RBox, rn } from "./estudio3d";
import { AGUA } from "./kitplo";

type C = React.FC<{ t: number; h: H }>;
type V3 = [number, number, number];
const P = Math.PI, P2 = P / 2;
const rel = (h: H, i: number) => (h.items?.[i]?.a ?? h.at + 99) - h.at;
const IN = (tt: number, a: number) => phys(tt, a, 7, 0.45);
const AT = (h: H, i: number, step = 1.1, a0 = 0.6) => rel(h, i) > 90 ? a0 + i * step : rel(h, i);
const CACHE = new Map<string, any>();
const memo = <T,>(k: string, f: () => T): T => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const AMBAR = "#f2a93b", FRIA = "#3f9ee0", CAL = "#e2763a";
const GLOW = (c: string, o = 1) => <meshBasicMaterial color={c} transparent opacity={o} toneMapped={false} depthWrite={false} />;
const VIDRIO = (o = 0.26) => <meshPhysicalMaterial color="#e3f1f5" roughness={0.03} clearcoat={1} transparent opacity={o} side={THREE.DoubleSide} depthWrite={false} />;
const BRONCE = () => <meshStandardMaterial color="#c08f45" metalness={0.85} roughness={0.28} />;
const COBRE = () => <meshStandardMaterial color="#c4693a" metalness={0.8} roughness={0.3} />;
// ---------- texturas ----------
const ruido = (k: string, base: string, spots: string[], n = 3000, sz = 4) => ctex("p4b2:" + k, 512, 512, (g) => { g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < n; i++) { g.fillStyle = spots[i % spots.length]; g.globalAlpha = 0.25 + 0.5 * rn(i, 7); const r = 1 + rn(i, 4) * sz; g.beginPath(); g.arc(rn(i, 2) * 512, rn(i, 3) * 512, r, 0, 2 * P); g.fill(); } g.globalAlpha = 1; });
const chaqueta = () => ctex("p4b2:chaq", 512, 512, (g) => { const gr = g.createLinearGradient(0, 0, 512, 0);
  gr.addColorStop(0, "#c9c6bd"); gr.addColorStop(0.35, "#f4f2ec"); gr.addColorStop(0.55, "#fbfaf6"); gr.addColorStop(1, "#bdb9b0"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  g.fillStyle = "rgba(0,0,0,0.18)"; g.fillRect(0, 60, 512, 5); g.fillRect(0, 450, 512, 5); g.fillStyle = "rgba(255,255,255,0.5)"; g.fillRect(0, 66, 512, 2); g.fillRect(0, 456, 512, 2); });
const oxido = () => ruido("oxi", "#7a3a1a", ["#b5652b", "#5a2810", "#d08a3f", "#3e1c0b"], 4200, 6);
const magnesio = () => ruido("mg", "#9a9fa4", ["#c7cbcf", "#6d7276", "#b4b8bc", "#83888c"], 5000, 3);
const costra = () => ruido("cos", "#bfae88", ["#d9cba6", "#8f7e5c", "#e6dcc0", "#a69470"], 5000, 5);
const piel = (k: number) => ruido("piel" + k, ["#e8b49a", "#d98e78", "#f1d9a4"][k], [["#f2c7b0", "#cf9a82"], ["#c97a66", "#e7a28d"], ["#f7e6bb", "#e3c98c"]][k], 1500, 6);
const sombraTex = () => ctex("p4b2:sombra", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(0,0,0,0.8)"); gr.addColorStop(0.45, "rgba(0,0,0,0.4)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const Sombra: React.FC<{ p: V3; r: number; o?: number; sx?: number }> = ({ p, r, o = 0.75, sx = 1 }) =>
  <mesh position={p} rotation={[-P2, 0, 0]} scale={[sx, 1, 1]} renderOrder={2}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={sombraTex()} transparent opacity={o} depthWrite={false} toneMapped={false} /></mesh>;
const Fondo: React.FC<{ z?: number; c?: string }> = ({ z = -0.9, c = "#141a20" }) =>
  <mesh position={[0, 0.3, z]}><planeGeometry args={[7, 5]} /><meshBasicMaterial color={c} toneMapped={false} /></mesh>;
const Piso: React.FC<{ y?: number; c?: string }> = ({ y = 0, c = "#4a4440" }) =>
  <mesh position={[0, y, 0]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[6, 4]} /><meshStandardMaterial map={ruido("piso" + c, c, ["#5a534e", "#3b3632"], 2500, 3)} roughness={0.95} /></mesh>;
const halo = () => ctex("p4b2:halo", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(255,248,220,0.95)"); gr.addColorStop(0.3, "rgba(255,240,200,0.35)"); gr.addColorStop(1, "rgba(255,240,200,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const Halo: React.FC<{ p: V3; r: number; c?: string; o?: number }> = ({ p, r, c = "#fff3c0", o = 1 }) => r <= 0.001 || o <= 0.01 ? null :
  <mesh position={p} renderOrder={5}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={halo()} color={c} transparent opacity={o} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} /></mesh>;
const Caño: React.FC<{ a: V3; b: V3; r?: number; mat?: React.ReactNode }> = ({ a, b, r = 0.03, mat }) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = Math.max(0.001, d.length());
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()), m = A.clone().add(B).multiplyScalar(0.5);
  return <mesh position={[m.x, m.y, m.z]} quaternion={q} castShadow><cylinderGeometry args={[r, r, L, 20]} />{mat ?? COBRE()}</mesh>;
};
const Burbuja: React.FC<{ p: V3; r: number; c?: string; o?: number }> = ({ p, r, c = "#ffffff", o = 0.75 }) => r <= 0.0005 ? null :
  <mesh position={p} scale={r}><sphereGeometry args={[1, 18, 14]} /><meshPhysicalMaterial color={c} transparent opacity={o} roughness={0} clearcoat={1} /></mesh>;
const Anillo: React.FC<{ p: V3; r: number; o: number; c?: string; rot?: V3 }> = ({ p, r, o, c = "#ffffff", rot = [-P2, 0, 0] }) => o <= 0.01 ? null :
  <mesh position={p} rotation={rot} scale={r}><ringGeometry args={[0.85, 1, 48]} /><meshBasicMaterial color={c} transparent opacity={o} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>;
const helice = (k: string, R: number, alto: number, vueltas: number, r: number) => memo("p4b2:hx" + k, () => {
  class Hx extends THREE.Curve<THREE.Vector3> { getPoint(u: number) { const a = u * vueltas * 2 * P; return new THREE.Vector3(Math.cos(a) * R, u * alto, Math.sin(a) * R); } }
  return new THREE.TubeGeometry(new Hx(), 240, r, 8, false); });
const Espiral: React.FC<{ k: string; R: number; alto: number; v: number; r: number; children: React.ReactNode }> = ({ k, R, alto, v, r, children }) =>
  <mesh geometry={helice(k, R, alto, v, r)}>{children}</mesh>;
const tambor = () => ctex("p4b2:tambor", 1024, 256, (g) => {
  g.fillStyle = "#f3ecd8"; g.fillRect(0, 0, 1024, 256); g.fillStyle = "#16130f"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 92px Inter, Arial, sans-serif";
  for (let n = 0; n <= 10; n++) { g.save(); g.translate(n * 102.4, 128); g.rotate(P2); g.scale(1.9, 1); g.fillText(String(n % 10), 0, 6); g.restore(); } });
const Tambores: React.FC<{ p: V3; rot?: V3; val: number; n: number; s?: number }> = ({ p, rot, val, n, s = 1 }) => {
  const pos = (k: number) => { const m = Math.pow(10, k), v = val / m; if (k === 0) return v; const low = val % m; return Math.floor(v) + cl(low - (m - 1)); };
  const W = n * 0.2, x0 = -W / 2 + 0.1;
  return <group position={p} rotation={rot} scale={s}>
    {Array.from({ length: n }, (_, i) => <group key={i} position={[x0 + i * 0.2, 0, 0]} rotation={[2 * P * pos(n - 1 - i) / 10, 0, 0]}>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.17, 0.17, 0.16, 48]} /><meshStandardMaterial map={tambor()} roughness={0.45} /></mesh></group>)}
    {[0.17, -0.17].map((y, i) => <mesh key={i} position={[0, y, 0.16]}><boxGeometry args={[W + 0.08, 0.1, 0.04]} /><meshStandardMaterial color="#2a2522" roughness={0.5} metalness={0.3} /></mesh>)}
  </group>;
};
// ---------- piezas ----------
const Calentador: React.FC<{ p?: V3; s?: number; corte?: boolean }> = ({ p, s = 1, corte }) => <group position={p} scale={s}>
  <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.28, 0.28, 0.9, 48, 1, !!corte, corte ? P2 : 0, corte ? P : 2 * P]} /><meshPhysicalMaterial map={chaqueta()} roughness={0.35} clearcoat={0.5} side={THREE.DoubleSide} /></mesh>
  {!corte && <mesh position={[0, 0.95, 0]} scale={[1, 0.28, 1]}><sphereGeometry args={[0.28, 40, 16, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color="#efede6" roughness={0.3} clearcoat={0.6} /></mesh>}
  <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.285, 0.29, 0.08, 48]} /><meshStandardMaterial color="#3a3a3c" roughness={0.6} /></mesh>
  {!corte && <><Caño a={[-0.1, 0.98, 0]} b={[-0.1, 1.18, 0]} r={0.02} /><Caño a={[0.1, 0.98, 0]} b={[0.1, 1.18, 0]} r={0.02} />
    <mesh position={[-0.1, 1.14, 0]}><cylinderGeometry args={[0.03, 0.03, 0.03, 16]} /><meshStandardMaterial color={FRIA} /></mesh>
    <mesh position={[0.1, 1.14, 0]}><cylinderGeometry args={[0.03, 0.03, 0.03, 16]} /><meshStandardMaterial color={RED} /></mesh>
    <group position={[0.29, 0.82, 0]}><mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.025, 0.025, 0.06, 14]} />{BRONCE()}</mesh><Caño a={[0.03, 0, 0]} b={[0.03, -0.55, 0]} r={0.013} /></group>
    <RBox s={[0.16, 0.1, 0.02]} r={0.01} p={[0, 0.15, 0.275]}><meshStandardMaterial color="#2a2a2c" roughness={0.6} /></RBox></>}
</group>;
const Valvula: React.FC<{ p?: V3; s?: number; rot?: V3; disco?: number; resorte?: number }> = ({ p, s = 1, rot, disco = 0, resorte = 1 }) => <group position={p} scale={s} rotation={rot}>
  <mesh><cylinderGeometry args={[0.07, 0.08, 0.16, 6]} />{BRONCE()}</mesh>
  <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.045, 0.05, 0.1, 24, 1, true]} />{VIDRIO(0.35)}</mesh>
  <mesh position={[0, 0.08 + 0.02 * disco, 0]}><cylinderGeometry args={[0.04, 0.04, 0.012, 24]} />{BRONCE()}</mesh>
  <group position={[0, 0.085 + 0.02 * disco, 0]} scale={[1, resorte, 1]}><Espiral k="res" R={0.03} alto={0.09} v={6} r={0.004}><meshStandardMaterial color="#c9ccd0" metalness={1} roughness={0.2} /></Espiral></group>
  <mesh position={[0, 0.19, 0]}><cylinderGeometry args={[0.05, 0.05, 0.02, 24]} />{BRONCE()}</mesh>
  <group position={[0.02, 0.21, 0]} rotation={[0, 0, -0.3 - 0.6 * disco]}><mesh position={[0.06, 0, 0]}><boxGeometry args={[0.12, 0.012, 0.02]} />{BRONCE()}</mesh></group>
  <mesh position={[0.11, -0.02, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.03, 0.03, 0.08, 16]} />{BRONCE()}</mesh>
</group>;
const Anodo: React.FC<{ p?: V3; rot?: V3; L?: number; grosor?: number; come?: number; s?: number }> = ({ p, rot, L = 0.8, grosor = 1, come = 0, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, L / 2 + 0.04, 0]}><cylinderGeometry args={[0.045, 0.045, 0.06, 6]} /><meshStandardMaterial color="#9fa4a8" metalness={0.9} roughness={0.25} /></mesh>
  <mesh><cylinderGeometry args={[0.006, 0.006, L, 8]} /><meshStandardMaterial color="#d0d3d6" metalness={1} roughness={0.2} /></mesh>
  <mesh position={[0, L * come / 2, 0]} scale={[grosor, 1, grosor]}><cylinderGeometry args={[0.024, 0.024, L * (1 - come), 18]} /><meshStandardMaterial map={magnesio()} bumpMap={magnesio()} bumpScale={2} roughness={0.85} metalness={0.3} /></mesh>
</group>;
const manoTex = () => ctex("p4b2:mano", 512, 512, (g) => { g.fillStyle = "#f4f1e8"; g.beginPath(); g.arc(256, 256, 250, 0, 2 * P); g.fill(); g.lineWidth = 34;
  ([["#3aa860", -225, -105], ["#e8b23a", -105, -15], ["#c0392b", -15, 45]] as [string, number, number][]).forEach(([c, a, b]) => { g.strokeStyle = c; g.beginPath(); g.arc(256, 256, 205, a * P / 180, b * P / 180); g.stroke(); });
  g.strokeStyle = "#1a1a1a"; for (let i = 0; i <= 20; i++) { const a = (-225 + i * 13.5) * P / 180; g.lineWidth = i % 5 ? 3 : 8; g.beginPath(); g.moveTo(256 + Math.cos(a) * 170, 256 + Math.sin(a) * 170); g.lineTo(256 + Math.cos(a) * 230, 256 + Math.sin(a) * 230); g.stroke(); } });
const Manometro: React.FC<{ p: V3; s?: number; v: number }> = ({ p, s = 1, v }) => <group position={p} scale={s}>
  <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.05, 48]} />{M.cromo()}</mesh>
  <mesh position={[0, 0, 0.026]}><circleGeometry args={[0.118, 48]} /><meshBasicMaterial map={manoTex()} toneMapped={false} /></mesh>
  <group position={[0, 0, 0.03]} rotation={[0, 0, -(-225 + 270 * cl(v)) * P / 180 - P]}><mesh position={[0.045, 0, 0]}><boxGeometry args={[0.1, 0.008, 0.004]} /><meshBasicMaterial color="#111" /></mesh></group>
  <mesh position={[0, 0, 0.034]}><circleGeometry args={[0.012, 16]} /><meshBasicMaterial color="#222" /></mesh>
</group>;
const Llama: React.FC<{ p: V3; s?: number; k?: number; t: number }> = ({ p, s = 1, k = 1, t }) => k <= 0.01 ? null : <group position={p} scale={[s * k, s * k * (1 + 0.08 * Math.sin(t * 23)), s * k]}>
  <mesh position={[0, 0.05, 0]}><coneGeometry args={[0.035, 0.12, 16]} />{GLOW("#ffb347", 0.55)}</mesh>
  <mesh position={[0, 0.035, 0]}><coneGeometry args={[0.022, 0.08, 16]} />{GLOW("#3f7cff", 0.9)}</mesh>
  <Halo p={[0, 0.05, 0.02]} r={0.12} c="#ffb347" o={0.6} />
</group>;
const Grifo: React.FC<{ p: V3; c: string; gira?: number }> = ({ p, c, gira = 0 }) => <group position={p}>
  <mesh><cylinderGeometry args={[0.035, 0.04, 0.12, 20]} />{M.cromo()}</mesh>
  <mesh position={[0, 0.03, 0.08]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.16, 16]} />{M.cromo()}</mesh>
  <mesh position={[0, 0, 0.16]}><cylinderGeometry args={[0.022, 0.026, 0.06, 16]} />{M.cromo()}</mesh>
  <group position={[0, 0.09, 0]} rotation={[0, gira * P2, 0]}><mesh><boxGeometry args={[0.13, 0.02, 0.03]} />{M.cromo()}</mesh><mesh position={[0, 0.015, 0]}><cylinderGeometry args={[0.018, 0.018, 0.012, 16]} /><meshStandardMaterial color={c} /></mesh></group>
</group>;
const Vaso: React.FC<{ p: V3; nivel: number; c?: string }> = ({ p, nivel, c = "#a9d4ee" }) => <group position={p}>
  <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.055, 0.045, 0.14, 32, 1, true]} />{VIDRIO(0.3)}</mesh>
  <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.045, 0.045, 0.006, 32]} />{VIDRIO(0.4)}</mesh>
  {nivel > 0.01 && <mesh position={[0, 0.005 + 0.065 * nivel, 0]}><cylinderGeometry args={[0.05, 0.044, 0.13 * nivel, 32]} />{AGUA(0.7, c)}</mesh>}
</group>;
const Chorro: React.FC<{ a: V3; t: number; k: number; v?: V3; n?: number; c?: string; r?: number }> = ({ a, t, k, v = [0, 0, 0], n = 22, c = "#9fd4f4", r = 0.01 }) => k <= 0.01 ? null : <>
  {Array.from({ length: n }, (_, i) => { const q = (t * 1.6 + i / n) % 1, s = q * 0.5; return <mesh key={i} position={[a[0] + v[0] * s, a[1] + v[1] * s - 2.2 * s * s, a[2] + v[2] * s]} scale={[r * k, r * k * 1.5, r * k]}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.9, c)}</mesh>; })}</>;
const perillaTex = () => ctex("p4b2:peri", 512, 512, (g) => { g.fillStyle = "#1f2226"; g.beginPath(); g.arc(256, 256, 250, 0, 2 * P); g.fill();
  g.fillStyle = "#e8e4da"; g.font = "800 54px Inter, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
  ([["40", -210], ["52", -150], ["60", -90], ["70", -30], ["80", 30]] as [string, number][]).forEach(([s, a]) => { const r = a * P / 180; g.fillText(s, 256 + Math.cos(r) * 175, 256 + Math.sin(r) * 175); });
  for (let i = 0; i < 40; i++) { const r = (-230 + i * 7) * P / 180; g.fillRect(256 + Math.cos(r) * 225, 256 + Math.sin(r) * 225, 4, 4); } });

// 1 · LA PURGA NO ESTÁ EN LA LISTA: seis piezas reales giran alrededor del calentador y se encienden de a una; baja una manguera verde (la purga),
// no tiene lugar en el anillo, se pone roja y se hunde por el piso
const HMentira: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#12171d">{(tt) => {
  const rot = tt * 0.35, man = cl((tt - 1.9) / 0.7), roja = eio(tt, 2.6, 3.0), hunde = eio(tt, 3.0, 4.0);
  const pieza = (i: number) => { if (i === 0) return <Valvula s={0.7} />; if (i === 1) return <Anodo s={0.45} />;
    if (i === 2) return <Espiral k="m3" R={0.04} alto={0.14} v={5} r={0.008}><meshStandardMaterial color="#b0b4b8" metalness={0.9} roughness={0.3} /></Espiral>;
    if (i === 3) return <group><Caño a={[0, -0.05, 0]} b={[0, 0.06, 0]} r={0.008} /><Llama p={[0, 0.04, 0]} s={0.8} t={tt} /></group>;
    if (i === 4) return <group><RBox s={[0.12, 0.12, 0.05]} r={0.01}><meshStandardMaterial color="#9ea3a8" metalness={0.7} roughness={0.35} /></RBox><mesh position={[0, 0, 0.04]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.03, 18]} /><meshStandardMaterial color={RED} /></mesh></group>;
    return <group><mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.03, 32]} /><meshStandardMaterial color="#202226" /></mesh><mesh position={[0, 0.035, 0.016]}><boxGeometry args={[0.012, 0.03, 0.005]} /><meshBasicMaterial color="#fff" /></mesh></group>; };
  return <Estudio t={tt} cam={[0.0, 0.62, 2.05]} look={[0, 0.5, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-1.0} />
    <Piso />
    <Calentador p={[0, lerp(-1.2, 0, cl(IN(tt, 0.3))), 0]} s={0.75} />
    <Sombra p={[0, 0.003, 0]} r={0.35} />
    {Array.from({ length: 6 }, (_, i) => { const a = rot + i / 6 * 2 * P, on = eio(tt, 0.4 + i * 0.22, 0.6 + i * 0.22), e = cl(IN(tt, 0.15 + i * 0.08));
      return <group key={i} position={[Math.cos(a) * 0.72, 0.42 + 0.06 * Math.sin(a * 2), Math.sin(a) * 0.35]} scale={0.0001 + e * 1.7}>
        {pieza(i)}<Halo p={[0, 0, 0.06]} r={0.16 * on} c="#ffd36a" o={0.55} /></group>; })}
    {man > 0 && <group position={[0.0, lerp(1.6, 1.12, eio(man, 0, 1)) - hunde * 1.4, 0.35]} rotation={[P2 * 0.8, 0, 0]}>
      {[0, 1, 2, 3].map((j) => <mesh key={j} position={[0, 0, j * 0.022]}><torusGeometry args={[0.12 - j * 0.004, 0.014, 10, 40]} /><meshStandardMaterial color={col("#2e8b3e", "#c0392b", roja)} roughness={0.5} /></mesh>)}
      <mesh position={[0.12, 0, 0.04]}><cylinderGeometry args={[0.02, 0.02, 0.05, 12]} />{BRONCE()}</mesh></group>}
    <Halo p={[0, 1.12 - hunde * 1.4, 0.45]} r={0.35 * roja * (1 - hunde)} c={RED} o={0.6} />
    {hunde > 0.02 && hunde < 0.98 && <Anillo p={[0, 0.005, 0.35]} r={0.15 + 0.35 * hunde} o={0.7 * (1 - hunde)} c={RED} />}
  </Estudio>;
}}</Stage>;

// 2 · LA VÁLVULA DE DOÑA LUPE: la valvulita de plástico enorme en primer plano; ocho anillos de sarro la envuelven uno por año (rodillo 0→8);
// al girar la perilla se raja, asoma una gota por la grieta y se vuelve chorro
const HLupe: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#13181e">{(tt) => {
  const anos = eio(tt, 0.3, 2.0) * 8, gira = eio(tt, 2.1, 2.6), raja = eio(tt, 2.55, 2.75), chorro = eio(tt, 2.9, 3.8);
  return <Estudio t={tt} cam={[0.15, 0.22, 1.25]} look={[0.05, 0.12, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <mesh position={[-0.6, 0.12, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.32, 0.32, 0.6, 48]} /><meshPhysicalMaterial map={chaqueta()} roughness={0.4} clearcoat={0.4} /></mesh>
    <group position={[0, 0.12, 0]} scale={0.0001 + cl(IN(tt, 0.3))}>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.07, 0.07, 0.3, 6]} /><meshPhysicalMaterial color="#ecebe4" roughness={0.45} clearcoat={0.3} /></mesh>
      <mesh position={[0.17, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.055, 0.08, 24]} /><meshPhysicalMaterial color="#ecebe4" roughness={0.45} /></mesh>
      {Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[0.14 + j * 0.012, 0, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.054, 0.004, 4, 24]} /><meshStandardMaterial color="#d8d6cf" /></mesh>)}
      <group position={[0, 0.08, 0]} rotation={[0, gira * P2 * 1.2, 0]}><mesh><cylinderGeometry args={[0.035, 0.035, 0.05, 20]} /><meshStandardMaterial color="#1d1f22" /></mesh><mesh position={[0, 0.03, 0]}><boxGeometry args={[0.16, 0.025, 0.03]} /><meshStandardMaterial color="#1d1f22" /></mesh></group>
      {Array.from({ length: 8 }, (_, i) => { const g = cl(anos - i); return g > 0.01 && <mesh key={i} position={[-0.12 + i * 0.033, 0, 0]} rotation={[0, 0, P2]} scale={[1 + 0.25 * g, 1, 1 + 0.25 * g]}><cylinderGeometry args={[0.072 + 0.004 * i * g, 0.072 + 0.004 * i * g, 0.026, 24]} /><meshStandardMaterial map={costra()} bumpMap={costra()} bumpScale={3} color={col("#f2ead4", "#c8b48a", i / 8)} roughness={0.95} /></mesh>; })}
      {raja > 0.01 && [0, 1, 2, 3].map((j) => <mesh key={j} position={[0.17 + (j - 1.5) * 0.012, (j % 2 ? 0.01 : -0.01), 0.056]} rotation={[0, 0, (j % 2 ? 0.7 : -0.7)]} scale={[raja, 1, 1]}><boxGeometry args={[0.016, 0.004, 0.003]} /><meshBasicMaterial color="#1a1208" /></mesh>)}
      {raja > 0.5 && chorro < 0.2 && <mesh position={[0.17, -0.03 - 0.03 * eio(tt, 2.7, 2.9), 0.058]} scale={[0.012, 0.016, 0.012]}><sphereGeometry args={[1, 12, 10]} />{AGUA(0.9, "#9fd4f4")}</mesh>}
    </group>
    <Chorro a={[0.17, 0.09, 0.06]} v={[0.2, -0.1, 0.3]} t={tt} k={chorro} n={26} r={0.011} />
    <Halo p={[0.17, 0.1, 0.1]} r={0.2 * raja} c={RED} o={0.55} />
    <Tambores p={[0.05, 0.52, -0.2]} val={anos} n={1} s={0.5} />
  </Estudio>;
}}</Stage>;

// 3 · EL CANALITO: el fondo del tanque desde arriba con una cama densa de piedritas de sarro; al abrir la válvula el agua talla un surco angosto hasta la salida
const PIED = Array.from({ length: 520 }, (_, i) => { const a = rn(i, 1) * 2 * P, r = 0.5 * Math.sqrt(rn(i, 2)); return [Math.cos(a) * r, Math.sin(a) * r, 0.012 + 0.012 * rn(i, 3), rn(i, 4)] as [number, number, number, number]; });
const HCanal: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#111519">{(tt) => {
  const abre = eio(tt, 0.6, 1.0), talla = eio(tt, 1.0, 3.4);
  return <Estudio t={tt} cam={[0.0, 1.35, 0.55]} look={[0, 0, 0.02]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, -0.02, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.56, 64]} /><meshStandardMaterial color="#3a3a3c" metalness={0.6} roughness={0.5} /></mesh>
    <mesh position={[0, 0.02, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.56, 0.03, 12, 64]} />{M.cromo("#9aa0a6")}</mesh>
    {PIED.map(([x, z, r, k], i) => { const s = Math.abs(z) < 0.04 && x > 0.5 - talla * 0.5, q = s ? cl((talla - (0.5 - x) / 0.5 * 0.95) * 4) : 0;
      return q < 0.99 && <mesh key={i} position={[x + q * 0.4, r, z]} scale={[r * 1.4 * (1 - q), r, r * (1 - q)]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={col("#cbbd99", "#e9e0c6", k)} roughness={0.9} /></mesh>; })}
    {talla > 0.01 && <mesh position={[0.5 - talla * 0.25, 0.002, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[talla * 0.5, 0.07]} />{AGUA(0.75, FRIA)}</mesh>}
    {talla > 0.01 && Array.from({ length: 18 }, (_, i) => { const q = (tt * 0.9 + i / 18) % 1, x = lerp(0.5 - talla * 0.5, 0.62, q); return <mesh key={"w" + i} position={[x, 0.012, (rn(i, 5) - 0.5) * 0.04]} scale={0.008}><sphereGeometry args={[1, 6, 4]} />{GLOW("#cfeaff", 0.9)}</mesh>; })}
    <group position={[0.62, 0.02, 0]}><mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.05, 0.12, 20]} />{BRONCE()}</mesh>
      <group position={[0, 0.07, 0]} rotation={[0, abre * P2, 0]}><mesh><boxGeometry args={[0.14, 0.02, 0.03]} /><meshStandardMaterial color="#1d1f22" /></mesh></group></group>
    <Halo p={[0.1, 0.05, 0]} r={0.6 * eio(tt, 3.4, 3.9)} c="#ffd36a" o={0.18} />
  </Estudio>;
}}</Stage>;

// 4 · SESENTA GRADOS: un bloque de piel en corte (3 capas con textura) entra; el termómetro sube a 60; cae una gota caliente y en tres segundos
// (rodillo 0→3) las capas se ponen rojas una por una de arriba hacia abajo
const HSesenta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#15121a">{(tt) => {
  const ent = cl(IN(tt, 0.3)), termo = eio(tt, 0.4, 1.4), gota = cl((tt - 1.4) / 0.35), seg = eio(tt, 1.8, 3.8) * 3;
  const capa = (i: number) => eio(tt, 1.9 + i * 0.6, 2.4 + i * 0.6);
  return <Estudio t={tt} cam={[0.05, 0.3, 1.45]} look={[0.05, 0.18, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#17141b" />
    <group position={[lerp(-1.4, -0.15, ent), 0, 0]}>
      {[0, 1, 2].map((i) => { const hh = [0.05, 0.11, 0.14][i], y = [0.31, 0.23, 0.105][i]; return <RBox key={i} s={[0.7, hh, 0.4]} r={0.008} p={[0, y, 0]}>
        <meshStandardMaterial map={piel(i)} bumpMap={piel(i)} bumpScale={2} color={col("#ffffff", "#ff5a3c", capa(i))} roughness={0.7} emissive={col("#000000", "#7a1a0a", capa(i))} /></RBox>; })}
      <Sombra p={[0, 0.002, 0]} r={0.42} sx={1.2} o={0.6} />
    </group>
    {gota > 0 && gota < 1 && <mesh position={[-0.15, lerp(0.9, 0.36, gota * gota), 0.05]} scale={[0.025, 0.035, 0.025]}><sphereGeometry args={[1, 14, 10]} />{AGUA(0.9, "#ff9a6a")}</mesh>}
    {gota >= 1 && <Anillo p={[-0.15, 0.338, 0.05]} r={0.04 + 0.12 * cl((tt - 1.75) / 0.5)} o={0.8 * (1 - cl((tt - 1.75) / 0.5))} c="#ffb38a" />}
    <group position={[0.42, 0.05, 0]}>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.025, 0.025, 0.55, 20]} />{VIDRIO(0.35)}</mesh>
      <mesh position={[0, 0.02, 0]}><sphereGeometry args={[0.04, 20, 16]} />{GLOW(RED)}</mesh>
      <mesh position={[0, 0.04 + 0.24 * termo, 0]}><cylinderGeometry args={[0.012, 0.012, 0.48 * termo + 0.01, 12]} />{GLOW(RED)}</mesh>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0.03, 0.06 + i * 0.08, 0]}><boxGeometry args={[i % 2 ? 0.015 : 0.03, 0.004, 0.004]} /><meshBasicMaterial color="#e8e4da" /></mesh>)}
      <Halo p={[0, 0.04 + 0.48 * termo, 0.04]} r={0.12 * termo} c={RED} o={0.6} />
    </group>
    <Tambores p={[0.42, 0.5, -0.1]} val={Math.min(3, seg)} n={1} s={0.55} />
  </Estudio>;
}}</Stage>;

// 5 · OLOR A GAS: esquina de un cuarto con nube amarillo-verdosa; el cerillo que se acerca se apaga solo (halo rojo), el interruptor no se toca (halo rojo);
// las dos hojas de la ventana se abren de par en par y la nube sale por ahí
const HGas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false} tone="#12161b">{(tt) => {
  const nube = eio(tt, 0.1, 0.9), ceri = eio(tt, 0.7, 1.3), apaga = eio(tt, 1.3, 1.6), abre = eio(tt, 1.9, 2.6), sale = eio(tt, 2.4, 4.0);
  return <Estudio t={tt} cam={[0.35, 0.55, 1.75]} look={[-0.05, 0.5, -0.3]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, 0.6, -0.8]}><planeGeometry args={[3, 1.6]} /><meshStandardMaterial color="#d6cdb8" roughness={0.9} /></mesh>
    <mesh position={[-0.9, 0.6, 0]} rotation={[0, P2, 0]}><planeGeometry args={[1.8, 1.6]} /><meshStandardMaterial color="#cbc1aa" roughness={0.9} /></mesh>
    <Piso y={-0.2} c="#6b5a48" />
    <group position={[0.0, 0.7, -0.79]}>
      <mesh position={[0, 0, -0.02]}><planeGeometry args={[0.62, 0.52]} /><meshBasicMaterial color="#9fd0f0" toneMapped={false} /></mesh>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.3, 0, 0]} rotation={[0, -sd * abre * 1.3, 0]}>
        <group position={[-sd * 0.15, 0, 0]}><RBox s={[0.3, 0.5, 0.02]} r={0.004}><meshStandardMaterial color="#f2efe6" /></RBox>
          <mesh position={[0, 0, 0.012]}><planeGeometry args={[0.24, 0.44]} />{VIDRIO(0.4)}</mesh></group></group>)}
    </group>
    <group position={[-0.88, 0.62, 0.15]} rotation={[0, P2, 0]}><RBox s={[0.1, 0.15, 0.02]} r={0.01}><meshStandardMaterial color="#f4f2ec" /></RBox>
      <mesh position={[0, 0.02, 0.015]}><boxGeometry args={[0.025, 0.045, 0.02]} /><meshStandardMaterial color="#e8e4da" /></mesh></group>
    <Halo p={[-0.85, 0.62, 0.15]} r={0.14 * apaga} c={RED} o={0.7} />
    <group position={[lerp(0.6, 0.15, ceri), 0.45, 0.35]} rotation={[0, 0, 0.5]} scale={2.2}>
      <mesh><boxGeometry args={[0.012, 0.16, 0.012]} />{M.madera("#d9b98a")}</mesh>
      <mesh position={[0, 0.085, 0]}><sphereGeometry args={[0.014, 12, 10]} /><meshStandardMaterial color={col("#b0301c", "#2a2420", apaga)} /></mesh>
      <Llama p={[0, 0.09, 0]} s={0.7} k={ceri * (1 - apaga)} t={tt} />
      {apaga > 0.3 && Array.from({ length: 4 }, (_, j) => { const q = ((tt - 1.4) * 0.8 + j / 4) % 1; return <mesh key={j} position={[0.01 * Math.sin(q * 9), 0.1 + q * 0.2, 0]} scale={0.012 + q * 0.02}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#888" transparent opacity={0.35 * (1 - q)} /></mesh>; })}
    </group>
    <Halo p={[0.12, 0.6, 0.38]} r={0.16 * apaga} c={RED} o={0.7} />
    {Array.from({ length: 40 }, (_, i) => { const bx = (rn(i, 1) - 0.5) * 1.5, by = 0.2 + rn(i, 2) * 0.8, bz = -0.6 + rn(i, 3) * 0.9, q = cl(sale * 1.3 - rn(i, 4) * 0.3);
      const x = lerp(bx, (rn(i, 5) - 0.5) * 0.5, q), y = lerp(by, 0.7 + (rn(i, 6) - 0.5) * 0.3, q), z = lerp(bz, -1.1, q * q);
      return <mesh key={i} position={[x + 0.03 * Math.sin(tt + i), y, z]} scale={(0.1 + 0.08 * rn(i, 7)) * nube + 0.0001}><sphereGeometry args={[1, 12, 10]} /><meshBasicMaterial color="#c8d26a" transparent opacity={0.12 * (1 - q * 0.6)} depthWrite={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 6 · EL DISCO QUE SALTA: el termostato de seguridad en corte; el disco bimetálico se calienta (naranja), se da vuelta de golpe y empuja el botón rojo afuera;
// con el aparato apagado, un dedo lo vuelve a meter
const HReset: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#13171c">{(tt) => {
  const calor = eio(tt, 0.5, 1.9), salto = eio(tt, 1.9, 2.05), vuelve = eio(tt, 3.2, 3.45), boton = salto - vuelve, dedo = eio(tt, 2.7, 3.3) * (1 - eio(tt, 3.6, 4.1));
  const ACERO = <meshStandardMaterial color="#a9aeb3" metalness={0.85} roughness={0.35} />;
  return <Estudio t={tt} cam={[0.2, 0.2, 0.85]} look={[0, 0.13, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.5} />
    <group position={[0, 0.15, 0]} scale={0.0001 + cl(IN(tt, 0.3))}>
      <mesh position={[0, 0, -0.06]}><boxGeometry args={[0.42, 0.32, 0.02]} />{ACERO}</mesh>
      {[-0.2, 0.2].map((x, i) => <mesh key={i} position={[x, 0, 0]}><boxGeometry args={[0.02, 0.32, 0.12]} />{ACERO}</mesh>)}
      {[0.15, -0.15].map((y, i) => <mesh key={"h" + i} position={[0, y, 0]}><boxGeometry args={[0.42, 0.02, 0.12]} />{ACERO}</mesh>)}
      <mesh position={[0, -0.08, -0.02]} scale={[1, 0.3 - 0.6 * salto, 1]}><sphereGeometry args={[0.14, 32, 12, 0, 2 * P, 0, P2 * 0.6]} /><meshStandardMaterial color={col("#b8bcc0", "#ff7a2a", calor)} metalness={0.8} roughness={0.3} emissive={col("#000000", "#8a2a00", calor)} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.02 + 0.04 * salto, -0.02]}><cylinderGeometry args={[0.008, 0.008, 0.08, 10]} />{M.cromo()}</mesh>
      {[-0.06, 0.06].map((x, j) => <mesh key={j} position={[x, 0.08, 0]}><boxGeometry args={[0.07, 0.01, 0.04]} />{COBRE()}</mesh>)}
      <mesh position={[0, 0.08 + 0.02 * salto, 0]}><boxGeometry args={[0.06, 0.008, 0.04]} />{COBRE()}</mesh>
      <mesh position={[0, 0.1, 0.06 + 0.06 * boton]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.08, 24]} /><meshStandardMaterial color="#d62a1e" roughness={0.35} emissive="#5a0a05" /></mesh>
      <Halo p={[0, 0.1, 0.14]} r={0.18 * salto * (1 - vuelve)} c={RED} o={0.6} />
      {salto > 0 && salto < 1 && <Anillo p={[0, -0.08, 0.02]} r={0.15} o={0.8} rot={[0, 0, 0]} />}
      <Halo p={[0, -0.08, 0.04]} r={0.2 * calor * (1 - salto)} c="#ff8a3a" o={0.5} />
    </group>
    <group position={[lerp(0.5, 0.06, dedo), lerp(0.4, 0.13, dedo), lerp(0.5, 0.26, dedo)]} rotation={[-P2 * 0.95, 0, 0.9]} scale={0.6}>
      <mesh><capsuleGeometry args={[0.04, 0.22, 8, 16]} /><meshStandardMaterial color="#d9a587" roughness={0.6} /></mesh>
      <mesh position={[0, 0.13, 0.025]} scale={[0.8, 0.5, 0.3]}><sphereGeometry args={[0.04, 12, 10]} /><meshStandardMaterial color="#f0d4c4" roughness={0.3} /></mesh></group>
    <Halo p={[0, 0.25, 0.25]} r={0.22 * eio(tt, 3.3, 3.5) * (1 - eio(tt, 3.8, 4.2))} c={VER} o={0.6} />
  </Estudio>;
}}</Stage>;

// 7 · EL GUARDIÁN DEL GAS: el piloto con su llama azul abrazando la punta del termopar (al rojo); el gas corre por el caño; la llama se apaga,
// la punta se enfría a gris, el émbolo de la válvula cae y el gas se corta en seco
const HTermopar: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#0f1216">{(tt) => {
  const llama = 1 - eio(tt, 2.0, 2.3), frio = eio(tt, 2.2, 3.0), cae = eio(tt, 2.9, 3.15), gas = 1 - cae;
  return <Estudio t={tt} cam={[-0.12, 0.2, 0.78]} look={[-0.15, 0.14, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.5} c="#101317" />
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <Caño a={[-0.7, 0.05, 0]} b={[0.05, 0.05, 0]} r={0.022} mat={M.cromo("#a8adb2")} />
      <Caño a={[0.05, 0.05, 0]} b={[0.05, 0.2, 0]} r={0.012} />
      <mesh position={[0.05, 0.22, 0]}><cylinderGeometry args={[0.02, 0.014, 0.04, 16]} />{M.cromo("#8f959a")}</mesh>
      <Llama p={[0.05, 0.23, 0]} s={2.8} k={llama} t={tt} />
      <Caño a={[0.3, -0.05, 0]} b={[0.11, 0.26, 0]} r={0.01} mat={COBRE()} />
      <mesh position={[0.1, 0.27, 0]}><sphereGeometry args={[0.014, 14, 10]} /><meshStandardMaterial color={col("#ff5a1a", "#8a8f94", frio)} emissive={col("#ff3a0a", "#000000", frio)} emissiveIntensity={1.5} /></mesh>
      <Halo p={[0.1, 0.27, 0.03]} r={0.1 * (1 - frio)} c="#ff6a2a" o={0.8} />
      <group position={[-0.4, 0.05, 0]}>
        <mesh><boxGeometry args={[0.18, 0.2, 0.12]} /><meshStandardMaterial color="#c08f45" metalness={0.8} roughness={0.3} transparent opacity={0.35} /></mesh>
        <mesh position={[0, 0.03 - 0.06 * cae, 0]}><cylinderGeometry args={[0.03, 0.03, 0.06, 18]} />{M.cromo()}</mesh>
        <group position={[0, 0.06 - 0.03 * cae, 0]} scale={[1, 1 + 0.6 * cae, 1]}><Espiral k="tp" R={0.02} alto={0.05} v={5} r={0.003}><meshStandardMaterial color="#c9ccd0" metalness={1} roughness={0.2} /></Espiral></group>
        <Halo p={[0, 0, 0.08]} r={0.16 * cae} c={RED} o={0.6} />
      </group>
      {gas > 0.02 && Array.from({ length: 22 }, (_, i) => { const q = (tt * 0.8 + i / 22) % 1, x = lerp(-0.7, 0.05, Math.min(1, q * 1.3)), y = q * 1.3 > 1 ? 0.05 + (q * 1.3 - 1) * 0.5 : 0.05;
        return x < -0.4 || gas > 0.98 ? <mesh key={i} position={[x, Math.min(0.2, y), 0]} scale={0.009 * (x < -0.4 ? 1 : gas)}><sphereGeometry args={[1, 6, 4]} />{GLOW("#ffe08a", 0.8)}</mesh> : null; })}
    </group>
  </Estudio>;
}}</Stage>;

// 8 · LAS DOS RESISTENCIAS: el tanque cortado con agua en franjas; dos espirales entran por el costado; la de abajo se pone al rojo y el agua se vuelve
// naranja de abajo hacia arriba; la de arriba apenas entibia; la de abajo se apaga y la mitad baja vuelve a azul
const HResist: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#111519">{(tt) => {
  const enc = eio(tt, 0.5, 0.9), sube = eio(tt, 0.8, 2.2), apaga = eio(tt, 2.5, 2.8), enfria = eio(tt, 2.7, 3.9), N = 14;
  return <Estudio t={tt} cam={[0.0, 0.55, 1.6]} look={[0, 0.48, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Piso />
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <Calentador corte />
      {Array.from({ length: N }, (_, i) => { const u = (i + 0.5) / N, cal = cl(sube * 1.4 - u) * (u < 0.5 ? 1 - enfria : 1) * 0.95 + (u > 0.6 ? 0.3 * enc : 0);
        return <mesh key={i} position={[0, 0.06 + u * 0.88, 0]}><planeGeometry args={[0.54, 0.88 / N + 0.002]} /><meshBasicMaterial color={col("#3f8fd0", CAL, cal)} transparent opacity={0.8} toneMapped={false} /></mesh>; })}
      {[0.22, 0.72].map((y, i) => { const on = i === 0 ? enc * (1 - apaga) : 0.35 * enc;
        return <group key={i} position={[-0.27, y, 0.04]} rotation={[0, 0, -P2]}>
          <Espiral k={"r" + i} R={0.035} alto={0.36} v={7} r={0.009}><meshStandardMaterial color={col("#9aa0a6", "#ff5a1a", on)} emissive={col("#000000", "#ff3a0a", on)} emissiveIntensity={1.6} metalness={0.7} roughness={0.35} /></Espiral>
          <Halo p={[0, 0.18, 0.05]} r={0.22 * on} c="#ff7a2a" o={0.6} /></group>; })}
      <Halo p={[-0.1, 0.22, 0.1]} r={0.2 * apaga} c={FRIA} o={0.5} />
    </group>
    <Sombra p={[0, 0.003, 0]} r={0.36} />
  </Estudio>;
}}</Stage>;

// 9 · LA MEZCLA: tanque en corte con el tubo de inmersión partido (el pedazo caído en el fondo); el agua fría sale por el muñón de arriba y se cruza
// con la caliente en la salida: el vaso se llena de agua tibia
const HMezcla: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#111519">{(tt) => {
  const run = eio(tt, 0.5, 0.9), vaso = eio(tt, 1.6, 3.8);
  const PEX = <meshPhysicalMaterial color="#f4f2ec" roughness={0.4} />;
  return <Estudio t={tt} cam={[0.25, 0.68, 2.05]} look={[0.15, 0.62, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Piso />
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <Calentador corte />
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0, 0.06 + (i + 0.5) * 0.088, 0]}><planeGeometry args={[0.54, 0.09]} /><meshBasicMaterial color={col("#4a8fcc", CAL, 0.25 + i * 0.07)} transparent opacity={0.65} toneMapped={false} /></mesh>)}
      <Caño a={[-0.1, 1.2, 0.03]} b={[-0.1, 0.84, 0.03]} r={0.016} mat={PEX} />
      {[0, 1, 2].map((j) => <mesh key={j} position={[-0.1 + (j - 1) * 0.01, 0.835 - (j % 2) * 0.012, 0.03]} rotation={[0, 0, j * 0.6]}><coneGeometry args={[0.008, 0.025, 4]} />{PEX}</mesh>)}
      <group position={[0.02, 0.1, 0.05]} rotation={[0, 0, 1.35]}><Caño a={[0, -0.25, 0]} b={[0, 0.25, 0]} r={0.016} mat={PEX} /></group>
      <Halo p={[-0.1, 0.83, 0.08]} r={0.16 * run} c={RED} o={0.5} />
      <Caño a={[0.1, 0.95, 0.03]} b={[0.1, 1.2, 0.03]} r={0.018} />
      <Caño a={[0.1, 1.2, 0.03]} b={[0.55, 1.2, 0.03]} r={0.018} />
      <Caño a={[0.55, 1.2, 0.03]} b={[0.55, 0.4, 0.03]} r={0.018} />
      {run > 0.01 && Array.from({ length: 30 }, (_, i) => { const q = (tt * 0.55 + i / 30) % 1, fria = i % 2 === 0;
        let p: V3; if (q < 0.25) p = fria ? [-0.1, lerp(1.2, 0.84, q / 0.25), 0.05] : [lerp(-0.2, 0.1, q / 0.25), lerp(0.55, 0.92, q / 0.25), 0.05];
        else if (q < 0.4) p = fria ? [lerp(-0.1, 0.1, (q - 0.25) / 0.15), lerp(0.84, 0.95, (q - 0.25) / 0.15), 0.05] : [0.1, 0.95, 0.05];
        else if (q < 0.6) p = [0.1, lerp(0.95, 1.2, (q - 0.4) / 0.2), 0.05]; else if (q < 0.78) p = [lerp(0.1, 0.55, (q - 0.6) / 0.18), 1.2, 0.05]; else p = [0.55, lerp(1.2, 0.42, (q - 0.78) / 0.22), 0.05];
        const mix = cl((q - 0.38) * 5); return <mesh key={i} position={p} scale={0.014 * run}><sphereGeometry args={[1, 8, 6]} />{GLOW(col(fria ? FRIA : CAL, "#c9a37a", mix), 0.95)}</mesh>; })}
      <Vaso p={[0.55, 0.0, 0.03]} nivel={vaso} c="#d9b48a" />
      <Halo p={[0.55, 0.12, 0.1]} r={0.18 * eio(tt, 3.2, 3.8)} c={AMBAR} o={0.6} />
    </group>
  </Estudio>;
}}</Stage>;

// 10 · LA PRUEBA DE LA NARIZ: dos llaves de cromo (manija azul y roja) con su vaso; la fría: agua limpia, nada sube; la caliente: suben hilos verdosos
// que se enroscan hacia la cámara
const HOlfato: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#12161b">{(tt) => {
  const f = eio(tt, 0.4, 0.8), vf = eio(tt, 0.7, 1.6), c = eio(tt, 1.6, 2.0), vc = eio(tt, 1.9, 2.8), olor = eio(tt, 2.3, 3.4);
  const ll: [number, string, number, number][] = [[-0.25, FRIA, f, vf], [0.25, RED, c, vc]];
  return <Estudio t={tt} cam={[0.0, 0.22, 1.05]} look={[0, 0.18, 0]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, 0.3, -0.2]}><planeGeometry args={[2.5, 1.5]} /><meshStandardMaterial map={ruido("azul", "#e8eef2", ["#d4dde3", "#f6f8fa"], 1200, 10)} roughness={0.5} /></mesh>
    <mesh position={[0, -0.02, 0]}><boxGeometry args={[1.4, 0.04, 0.6]} /><meshStandardMaterial color="#f4f3ef" roughness={0.3} /></mesh>
    {ll.map(([x, cc, g, v], i) => <group key={i} position={[x, 0, 0]} scale={0.0001 + cl(IN(tt, 0.05 + i * 0.1))}>
      <Grifo p={[0, 0.42, -0.14]} c={cc} gira={g} />
      <Chorro a={[0, 0.39, 0.02]} t={tt} k={g * (1 - cl((v - 0.95) * 20))} n={12} r={0.008} />
      <Vaso p={[0, 0.0, 0.03]} nivel={v} c={i ? "#bcd6c8" : "#a9d4ee"} />
      <Sombra p={[0, 0.001, 0.03]} r={0.08} />
    </group>)}
    {olor > 0.01 && Array.from({ length: 4 }, (_, j) => { const pts = Array.from({ length: 30 }, (_, k) => { const u = k / 29, a = u * 7 + j * 1.6 + tt * 2;
      return [0.25 + Math.sin(a) * 0.03 * (1 + u * 2) + u * (j - 1.5) * 0.05, 0.14 + u * 0.45 * olor, 0.03 + u * 0.25 * olor + Math.cos(a) * 0.02] as V3; });
      return <group key={j}>{pts.slice(1).map((b, k) => k / 29 < olor && <Caño key={k} a={pts[k]} b={b} r={0.005 * (1 - k / 40)} mat={GLOW("#9bc74a", 0.55)} />)}</group>; })}
    <Halo p={[0.25, 0.4, 0.15]} r={0.25 * olor} c="#9bc74a" o={0.45} />
    <Halo p={[-0.25, 0.3, 0.1]} r={0.15 * eio(tt, 1.0, 1.4)} c={VER} o={0.35} />
  </Estudio>;
}}</Stage>;

// 11 · LAS BACTERIAS DEL ÁNODO: el ánodo de magnesio enorme y rugoso; bacterias verdes en cápsula nadan y se pegan; de cada una sube un rosario de burbujas amarillas
const HBacteria: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#0f1514">{(tt) => <Estudio t={tt} cam={[0.0, 0.3, 1.05]} look={[0, 0.3, 0]} orbit={0.012} mesa={false} fit={false}>
  <Fondo z={-0.5} c="#0f1a1c" />
  <mesh position={[0, 0.3, -0.2]}><planeGeometry args={[3, 2]} />{AGUA(0.35, "#2f6f86")}</mesh>
  <Anodo p={[0, lerp(1.3, 0.3, cl(IN(tt, 0.3))), 0]} L={0.9} grosor={2.4} />
  {Array.from({ length: 16 }, (_, i) => { const pega = 0.6 + i * 0.13, q = eio(tt, pega - 0.6, pega), a = rn(i, 1) * 2 * P, y = rn(i, 2) * 0.6;
    const tx = Math.cos(a) * 0.065, tz = Math.sin(a) * 0.065, sx = Math.cos(a) * 0.6, sz = Math.sin(a) * 0.3 + 0.2;
    const p: V3 = [lerp(sx, tx, q) + (1 - q) * 0.02 * Math.sin(tt * 8 + i), y + (1 - q) * 0.1 * Math.sin(tt * 2 + i), lerp(sz, tz, q)];
    const bub = cl((tt - pega - 0.1) / 0.3);
    return <group key={i}>
      <mesh position={p} rotation={[0, -a, P2 + 0.3 * Math.sin(tt * 6 + i) * (1 - q)]}><capsuleGeometry args={[0.012, 0.03, 6, 10]} /><meshStandardMaterial color="#6bbf4a" emissive="#2a5a1a" emissiveIntensity={0.5} roughness={0.4} /></mesh>
      {bub > 0 && Array.from({ length: 4 }, (_, j) => { const qq = (tt * 0.7 + j / 4 + i * 0.13) % 1; return <Burbuja key={j} p={[p[0] * 1.3 + 0.01 * Math.sin(qq * 12), p[1] + qq * 0.55, p[2] * 1.3]} r={(0.008 + 0.012 * qq) * bub} c="#f2d34a" o={0.7} />; })}
    </group>; })}
  <Halo p={[0, 0.65, 0.1]} r={0.4 * eio(tt, 2.0, 3.0)} c="#f2d34a" o={0.25} />
</Estudio>}</Stage>;

// 12 · LAS PALOMITAS: el fondo del tanque en corte con la llama abajo y la costra rugosa encima; una burbuja de vapor crece bajo la costra, revienta y la placa
// SALTA con anillos de onda — tres veces
const HPalomitas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#12100e">{(tt) => {
  const pops = [1.1, 2.2, 3.3], salto = pops.reduce((s, p) => s + (tt > p ? Math.max(0, Math.sin(cl((tt - p) / 0.3) * P)) : 0), 0);
  const bub = pops.reduce((s, p) => s + (tt < p && tt > p - 0.9 ? cl((tt - (p - 0.9)) / 0.9) : 0), 0);
  return <Estudio t={tt} cam={[0.0, 0.3, 1.1]} look={[0, 0.08, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.5} c="#141210" />
    <mesh position={[0, 0.25, -0.15]}><planeGeometry args={[3, 1]} />{AGUA(0.45, "#3a78a8")}</mesh>
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <mesh position={[0, -0.03, 0]}><boxGeometry args={[1.2, 0.04, 0.4]} /><meshStandardMaterial color="#4a4d52" metalness={0.8} roughness={0.4} /></mesh>
      {[-0.3, 0, 0.3].map((x, i) => <Llama key={i} p={[x, -0.2, 0]} s={1.5} t={tt + i} />)}
      <mesh position={[0, 0.025 + 0.06 * salto, 0]} rotation={[0, 0, 0.04 * salto]}><boxGeometry args={[0.6, 0.05, 0.3]} /><meshStandardMaterial map={costra()} bumpMap={costra()} bumpScale={4} roughness={0.95} /></mesh>
      {[-0.5, 0.45].map((x, i) => <mesh key={i} position={[x, 0.02, 0]}><boxGeometry args={[0.3, 0.04, 0.3]} /><meshStandardMaterial map={costra()} bumpMap={costra()} bumpScale={4} roughness={0.95} /></mesh>)}
      <Burbuja p={[0, 0.012, 0.1]} r={0.02 + 0.04 * bub} o={0.8} />
      {pops.map((p, i) => { const q = cl((tt - p) / 0.6); return q > 0 && q < 1 && <group key={i}>
        <Anillo p={[0, 0.06, 0.05]} r={0.1 + 0.5 * q} o={0.8 * (1 - q)} rot={[0, 0, 0]} c="#ffe2a8" />
        <Anillo p={[0, 0.06, 0.05]} r={0.05 + 0.35 * q} o={0.6 * (1 - q)} rot={[0, 0, 0]} />
        {Array.from({ length: 8 }, (_, j) => <mesh key={j} position={[(rn(j + i * 9, 1) - 0.5) * 0.4 * q, 0.06 + q * 0.25 - q * q * 0.3, 0.05]} scale={0.008}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#d9cba6" /></mesh>)}
      </group>; })}
    </group>
  </Estudio>;
}}</Stage>;

// 13 · EL ÓXIDO QUE AVANZA: trozo de pared del tanque en corte con tres capas distintas (esmalte brillante, acero gris, aislante amarillo) y el hueco del ánodo vacío;
// manchas de óxido rugoso nacen y se agrandan comiéndose el esmalte
const HOxido: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#13110f">{(tt) => {
  const ox = eio(tt, 0.8, 3.8), spots: V3[] = [[-0.18, 0.05, 0.6], [0.12, -0.06, 0.9], [0.25, 0.1, 1.3], [-0.05, 0.12, 1.6], [-0.28, -0.1, 1.9]];
  return <Estudio t={tt} cam={[0.35, 0.55, 1.05]} look={[0, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#16120f" />
    <group rotation={[-0.35, 0, 0]} scale={0.0001 + cl(IN(tt, 0.3))}>
      <mesh position={[0, -0.05, 0]}><boxGeometry args={[0.8, 0.06, 0.5]} /><meshStandardMaterial map={ruido("ais", "#e3c25a", ["#f0d47a", "#c9a640"], 2000, 4)} roughness={0.95} /></mesh>
      <mesh position={[0, -0.005, 0]}><boxGeometry args={[0.8, 0.03, 0.5]} /><meshStandardMaterial color="#7d8388" metalness={0.8} roughness={0.35} /></mesh>
      <mesh position={[0, 0.018, 0]}><boxGeometry args={[0.8, 0.016, 0.5]} /><meshPhysicalMaterial color="#f7f6f1" roughness={0.12} clearcoat={1} /></mesh>
      {spots.map(([x, z, a], i) => { const g = cl((tt - a) / 1.6) * ox; return g > 0.01 && <group key={i}>
        <mesh position={[x, 0.028, z]} rotation={[-P2, 0, rn(i, 2) * 3]}><circleGeometry args={[0.035 + 0.1 * g, 24]} /><meshStandardMaterial map={oxido()} bumpMap={oxido()} bumpScale={4} roughness={1} /></mesh>
        <mesh position={[x, 0.0275, z]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.035 + 0.1 * g, 0.045 + 0.1 * g, 28]} /><meshStandardMaterial color="#c9a07a" roughness={0.8} /></mesh></group>; })}
      <mesh position={[0.4, -0.005, 0]}><boxGeometry args={[0.003, 0.03, 0.5]} /><meshStandardMaterial map={oxido()} color={col("#7d8388", "#ffffff", ox)} roughness={0.9} /></mesh>
      <mesh position={[-0.2, 0.03, -0.18]}><cylinderGeometry args={[0.04, 0.04, 0.02, 6]} />{M.cromo("#8a8f94")}</mesh>
      <mesh position={[-0.2, 0.041, -0.18]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.025, 20]} /><meshBasicMaterial color="#0a0a0a" /></mesh>
      <Halo p={[-0.2, 0.08, -0.18]} r={0.12 * eio(tt, 0.3, 0.7)} c={RED} o={0.6} />
    </group>
  </Estudio>;
}}</Stage>;

// 14 · LA VÁLVULA QUE SALVA: la válvula de alivio grande con su resorte a la vista y el manómetro; la presión sube a rojo, el resorte se comprime, el disco
// se levanta y sale vapor por el tubo de descarga; la aguja baja visiblemente hasta el verde
const HPresion: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const sube = eio(tt, 0.3, 2.0), abre = eio(tt, 2.0, 2.2) * (1 - eio(tt, 3.4, 3.7)), baja = eio(tt, 2.2, 3.5), v = 0.25 + 0.7 * sube - 0.6 * baja;
  return <Estudio t={tt} cam={[0.0, 0.28, 1.1]} look={[0, 0.2, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.5} />
    <mesh position={[-0.75, 0.0, -0.1]}><cylinderGeometry args={[0.4, 0.4, 1.0, 48]} /><meshPhysicalMaterial map={chaqueta()} roughness={0.4} /></mesh>
    <Valvula p={[-0.15, 0.12, 0]} s={2.0} disco={abre} resorte={1 - 0.35 * abre} />
    <Caño a={[0.08, 0.08, 0]} b={[0.2, 0.08, 0]} r={0.022} />
    <Caño a={[0.2, 0.08, 0]} b={[0.2, -0.3, 0]} r={0.022} />
    {abre > 0.02 && Array.from({ length: 22 }, (_, i) => { const q = (tt * 1.4 + i / 22) % 1; return <mesh key={i} position={[0.2 + (rn(i, 1) - 0.5) * 0.12 * q, -0.32 - q * 0.25, (rn(i, 2) - 0.5) * 0.1 * q]} scale={(0.02 + 0.06 * q) * abre}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.5 * (1 - q)} depthWrite={false} /></mesh>; })}
    <Manometro p={[0.48, 0.25, 0]} s={1.5} v={v} />
    <Halo p={[0.48, 0.25, 0.08]} r={0.3 * cl((v - 0.8) * 5)} c={RED} o={0.6} />
    <Halo p={[0.48, 0.25, 0.08]} r={0.3 * eio(tt, 3.2, 3.6)} c={VER} o={0.5} />
  </Estudio>;
}}</Stage>;

// 15 · NUNCA SE TAPA: el tubo de descarga con un tapón de goma roja amarrado con alambre grueso; el tapón se infla y tiembla, el alambre se corta en dos,
// el tapón sale disparado y el agua sale libre (verde)
const HTapon: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false} tone="#12161b">{(tt) => {
  const infla = eio(tt, 0.5, 2.0), corta = cl((tt - 2.1) / 0.6), libre = eio(tt, 2.3, 2.7);
  const tiem = corta > 0 ? 0 : infla * 0.006 * Math.sin(tt * 60);
  return <Estudio t={tt} cam={[0.3, 0.22, 0.95]} look={[0.05, 0.12, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.5} />
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <Caño a={[-0.7, 0.12, 0]} b={[0.0, 0.12, 0]} r={0.035} />
      <mesh position={[0.0, 0.12, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.036, 0.006, 8, 24]} />{COBRE()}</mesh>
      <group position={[0.03 + tiem + corta * 0.9, 0.12 + corta * 0.2 - corta * corta * 0.6, 0]} rotation={[0, 0, -P2 + corta * 6]} scale={[1 + 0.3 * infla, 1, 1 + 0.3 * infla]}>
        <mesh><cylinderGeometry args={[0.042, 0.036, 0.06, 24]} /><meshStandardMaterial color="#c4281c" roughness={0.6} /></mesh></group>
      {corta <= 0 ? <>
        {[0, 1, 2].map((j) => <mesh key={j} position={[0.01 + j * 0.008, 0.12, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.043 + 0.012 * infla, 0.004, 8, 32]} />{M.cromo("#e6e8ea")}</mesh>)}
        <Caño a={[0.02, 0.12, 0.05]} b={[-0.15, 0.12 + 0.02 * Math.sin(tt * 40) * infla, 0.04]} r={0.004} mat={M.cromo("#e6e8ea")} />
        <Halo p={[0.02, 0.12, 0.08]} r={0.15 * infla} c={RED} o={0.4 + 0.2 * Math.sin(tt * 15)} /></> :
        [-1, 1].map((sd) => <mesh key={sd} position={[0.02 + sd * 0.05 * corta, 0.12 + sd * 0.04 * corta - corta * 0.2, 0.04]} rotation={[0, 0, sd * corta * 4]}><torusGeometry args={[0.05, 0.004, 8, 24, P]} />{M.cromo("#e6e8ea")}</mesh>)}
      {corta > 0 && corta < 0.4 && <Halo p={[0.03, 0.12, 0.06]} r={0.3} o={1 - corta * 2.5} />}
      <Chorro a={[0.04, 0.12, 0]} v={[0.9, 0.1, 0.1]} t={tt} k={libre} n={26} r={0.012} />
      <Halo p={[0.25, 0.08, 0.06]} r={0.28 * eio(tt, 2.8, 3.3)} c={VER} o={0.5} />
    </group>
  </Estudio>;
}}</Stage>;

// 16 · EL QUE SE DEJA COMER: balanza de platillos de bronce: magnesio rugoso contra acero brillante; las partículas del agua van TODAS al magnesio, que se adelgaza;
// su platillo sube al perder peso; el acero sigue brillando
const HSacrificio: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#12161b">{(tt) => {
  const come = eio(tt, 0.8, 3.6), tilt = -0.28 * come;
  const brazo = (sd: number): V3 => [sd * 0.4 * Math.cos(tilt), 0.62 + sd * 0.4 * Math.sin(tilt), 0];
  const pan = (sd: number): V3 => { const b = brazo(sd); return [b[0], b[1] - 0.26, 0]; };
  return <Estudio t={tt} cam={[0.0, 0.5, 1.6]} look={[0, 0.42, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} />
    <mesh rotation={[-P2, 0, 0]}><planeGeometry args={[4, 3]} />{M.madera("#5e3d24")}</mesh>
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.14, 0.17, 0.04, 32]} />{BRONCE()}</mesh>
      <mesh position={[0, 0.33, 0]}><cylinderGeometry args={[0.015, 0.02, 0.6, 16]} />{BRONCE()}</mesh>
      <mesh position={[0, 0.66, 0]}><coneGeometry args={[0.03, 0.06, 4]} />{BRONCE()}</mesh>
      <mesh position={[0, 0.62, 0]} rotation={[0, 0, tilt]}><boxGeometry args={[0.85, 0.02, 0.025]} />{BRONCE()}</mesh>
      {[-1, 1].map((sd) => { const pp = pan(sd), b = brazo(sd); return <group key={sd}>
        {[-1, 1].map((k) => <Caño key={k} a={b} b={[pp[0] + k * 0.1, pp[1], 0]} r={0.003} mat={BRONCE()} />)}
        <mesh position={pp}><cylinderGeometry args={[0.13, 0.11, 0.015, 32]} />{BRONCE()}</mesh></group>; })}
      <group position={[pan(-1)[0], pan(-1)[1] + 0.05, 0]}><mesh scale={[1 - 0.6 * come, 1 - 0.3 * come, 1 - 0.6 * come]}><boxGeometry args={[0.16, 0.08, 0.1]} /><meshStandardMaterial map={magnesio()} bumpMap={magnesio()} bumpScale={4} color={col("#ffffff", "#c9b9a0", come)} roughness={0.9} /></mesh></group>
      <group position={[pan(1)[0], pan(1)[1] + 0.045, 0]}><mesh><boxGeometry args={[0.15, 0.07, 0.09]} /><meshStandardMaterial color="#c9ced3" metalness={1} roughness={0.12} /></mesh>
        {[0, 1, 2].map((j) => { const q = (tt * 0.8 + j / 3) % 1; return <Halo key={j} p={[(rn(j, 1) - 0.5) * 0.12, 0.03, 0.06]} r={0.04 * Math.sin(q * P)} o={0.9} />; })}</group>
      {come > 0.01 && Array.from({ length: 26 }, (_, i) => { const q = (tt * 0.5 + i / 26) % 1, sx = (rn(i, 1) - 0.5) * 1.2, sy = 0.2 + rn(i, 2) * 0.6, tgt = pan(-1);
        return <mesh key={i} position={[lerp(sx, tgt[0], q), lerp(sy, tgt[1] + 0.05, q), lerp(0.25, 0, q)]} scale={0.011 * (1 - q * 0.6)}><sphereGeometry args={[1, 6, 4]} />{GLOW("#6fb8ff", 0.9)}</mesh>; })}
    </group>
  </Estudio>;
}}</Stage>;

// 17 · LOS QUINCE CENTÍMETROS: el ánodo usado acostado de lado a lado; en un tramo asoma el alambre de acero; la cinta métrica se desliza por debajo
// y el tramo pelado se marca en rojo pasando la marca de 15
const regla = () => ctex("p4b2:regla", 1024, 64, (g) => { g.fillStyle = "#f2c230"; g.fillRect(0, 0, 1024, 64); g.fillStyle = "#1a1a1a"; g.font = "800 26px Inter, Arial, sans-serif"; g.textAlign = "center";
  for (let c = 0; c <= 40; c++) { const x = 12 + c * 25; g.fillRect(x, 0, 2, c % 5 ? 14 : 26); if (c % 5 === 0) g.fillText(String(c), x, 54); } });
const HMedida: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#13161a">{(tt) => {
  const ent = cl(IN(tt, 0.3)), regl = eio(tt, 0.8, 1.6), marca = eio(tt, 1.8, 3.0), X0 = -0.5, PEL = 0.48;
  return <Estudio t={tt} cam={[0.0, 0.42, 0.95]} look={[0, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, -0.05, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[3, 2]} />{M.madera("#6b4a2e")}</mesh>
    <group position={[lerp(-1.6, 0, ent), 0, 0]}>
      <mesh position={[0.62, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.04, 0.04, 0.06, 6]} /><meshStandardMaterial color="#9fa4a8" metalness={0.9} roughness={0.25} /></mesh>
      <mesh rotation={[0, 0, P2]} position={[0.03, 0, 0]}><cylinderGeometry args={[0.006, 0.006, 1.15, 8]} /><meshStandardMaterial color="#d0d3d6" metalness={1} roughness={0.2} /></mesh>
      <mesh rotation={[0, 0, P2]} position={[X0 + PEL + (0.6 - X0 - PEL) / 2, 0, 0]}><cylinderGeometry args={[0.032, 0.03, 0.6 - X0 - PEL, 18]} /><meshStandardMaterial map={magnesio()} bumpMap={magnesio()} bumpScale={4} roughness={0.85} /></mesh>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[X0 + i * 0.08 + 0.04, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.008 + 0.006 * rn(i, 2), 0.01, 0.03, 10]} /><meshStandardMaterial map={magnesio()} color="#c9b9a0" roughness={0.9} /></mesh>)}
      <Sombra p={[0.05, -0.048, 0]} r={0.12} sx={6} o={0.5} />
    </group>
    <mesh position={[lerp(-1.5, X0 + 0.5, regl), -0.042, 0.075]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.0, 0.06]} /><meshStandardMaterial map={regla()} roughness={0.5} /></mesh>
    {marca > 0.01 && <>
      <mesh position={[X0 + PEL * marca / 2, 0, 0]} scale={[marca, 1, 1]}><boxGeometry args={[PEL, 0.075, 0.075]} /><meshBasicMaterial color={RED} transparent opacity={0.18} depthWrite={false} /></mesh>
      {[0.0375, -0.0375].map((y, i) => <mesh key={i} position={[X0 + PEL * marca / 2, y, 0.038]}><boxGeometry args={[PEL * marca, 0.006, 0.004]} />{GLOW(RED)}</mesh>)}
      <mesh position={[X0 + 0.375, 0, 0.06]}><boxGeometry args={[0.006, 0.14, 0.004]} /><meshBasicMaterial color="#111" /></mesh>
      <Halo p={[X0 + PEL * marca, 0, 0.06]} r={0.12} c={RED} o={0.8 * marca} />
    </>}
  </Estudio>;
}}</Stage>;

// 18 · EL GOLPE DE AGUA: el fondo del tanque en corte con la arenita QUIETA; la palanca se abre de golpe: el agua entra de lado y levanta la arena en remolino
// hacia la salida; se cierra y la arena se asienta; segundo golpe, sale más
const HGolpe: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#111519">{(tt) => {
  const pulso = (a: number) => eio(tt, a, a + 0.15) * (1 - eio(tt, a + 0.9, a + 1.1)), on = Math.max(pulso(1.0), pulso(2.5)), gone = eio(tt, 1.0, 3.5);
  return <Estudio t={tt} cam={[0.0, 0.35, 1.25]} look={[0, 0.18, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <mesh position={[0, 0.3, -0.05]}><cylinderGeometry args={[0.45, 0.45, 0.7, 48, 1, true, P2, P]} /><meshPhysicalMaterial map={chaqueta()} roughness={0.4} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.05, -0.05]}><cylinderGeometry args={[0.45, 0.45, 0.02, 48, 1, false, P2, P]} /><meshStandardMaterial color="#4a4d52" metalness={0.7} roughness={0.4} /></mesh>
      <mesh position={[0, 0.3, 0]}><planeGeometry args={[0.9, 0.7]} />{AGUA(0.35, "#4a8fcc")}</mesh>
      <Caño a={[-0.75, 0.25, 0]} b={[-0.44, 0.25, 0]} r={0.025} />
      <Caño a={[0.44, -0.02, 0]} b={[0.7, -0.02, 0]} r={0.025} mat={BRONCE()} />
      <group position={[0.6, 0.02, 0]} rotation={[0, 0, -on * 1.2]}><mesh position={[0, 0.06, 0]}><boxGeometry args={[0.02, 0.12, 0.02]} /><meshStandardMaterial color="#c0392b" /></mesh></group>
      {on > 0.01 && Array.from({ length: 14 }, (_, i) => { const q = (tt * 1.6 + i / 14) % 1; return <mesh key={i} position={[lerp(-0.44, 0.1, q), 0.25 - q * 0.15, 0.02]} scale={0.012 * on}><sphereGeometry args={[1, 6, 4]} />{GLOW("#cfeaff", 0.9)}</mesh>; })}
      {Array.from({ length: 90 }, (_, i) => { const bx = (rn(i, 1) - 0.5) * 0.8, bz = (rn(i, 2) - 0.6) * 0.3, sale = rn(i, 3) < gone * 0.8, a = tt * 5 + i, rr = 0.1 + 0.15 * rn(i, 4);
        const lift = on * (sale ? 1 : 0.6), q = sale ? cl((tt - 1.0 - rn(i, 5) * 2.4) / 0.6) : 0;
        const x = lerp(bx, Math.cos(a) * rr, lift) + q * 0.7, y = -0.035 + lift * (0.05 + 0.25 * rn(i, 6)), z = lerp(bz, Math.sin(a) * rr * 0.4, lift);
        return q < 1 && <mesh key={i} position={[x, y, z]} scale={0.007 + 0.004 * rn(i, 7)}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color={col("#d9cfb2", "#bfae88", rn(i, 8))} roughness={0.9} /></mesh>; })}
    </group>
  </Estudio>;
}}</Stage>;

// 19 · LA PERILLA BAJA: la perilla grande del termostato gira de 70 a 52; detrás, dos frascos con agua sobre su llama: en el de 70 crecen muchos
// cristales blancos de sarro; en el de 52, apenas unos pocos
const CRIS = Array.from({ length: 40 }, (_, i) => [(rn(i, 1) - 0.5) * 0.12, (rn(i, 2) - 0.5) * 0.12, rn(i, 3)] as V3);
const HTermostato: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#13171c">{(tt) => {
  const gira = eio(tt, 0.4, 1.4), crece = eio(tt, 1.2, 3.8);
  const fr: [number, number, string][] = [[-0.32, 40, "#ff8a3a"], [0.32, 6, "#7cc4f0"]];
  return <Estudio t={tt} cam={[0.0, 0.3, 1.2]} look={[0, 0.2, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <mesh position={[0, -0.02, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#3a3836" roughness={0.9} /></mesh>
    {fr.map(([x, n, c], i) => <group key={i} position={[x, 0, -0.1]} scale={0.0001 + cl(IN(tt, 0.1 + i * 0.1))}>
      <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.1, 0.1, 0.3, 40, 1, true]} />{VIDRIO(0.3)}</mesh>
      <mesh position={[0, 0.315, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.1, 0.008, 8, 40]} />{VIDRIO(0.6)}</mesh>
      <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.095, 0.095, 0.24, 40]} />{AGUA(0.45, c)}</mesh>
      <mesh position={[0, 0.012, 0]}><cylinderGeometry args={[0.1, 0.1, 0.012, 40]} />{VIDRIO(0.5)}</mesh>
      {CRIS.slice(0, n).map(([cx, cz, k], j) => { const g = cl(crece * 1.6 - k * 0.6); return g > 0.01 && <mesh key={j} position={[cx, 0.02 + 0.012 * g, cz]} rotation={[k * 3, k * 5, 0]} scale={0.016 * g * (0.6 + k)}><octahedronGeometry args={[1, 0]} /><meshPhysicalMaterial color="#ffffff" roughness={0.2} clearcoat={1} /></mesh>; })}
      <Llama p={[0, -0.08, 0]} s={1.2} k={i ? 0.5 : 1} t={tt + i} />
    </group>)}
    <group position={[0, 0.2, 0.25]} scale={0.0001 + cl(IN(tt, 0.3))}>
      <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.16, 0.16, 0.03, 48]} /><meshStandardMaterial color="#1f2226" /></mesh>
      <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.16, 48]} /><meshBasicMaterial map={perillaTex()} toneMapped={false} /></mesh>
      <group position={[0, 0, 0.04]} rotation={[0, 0, lerp(30 * P / 180 - P2, 150 * P / 180 - P2, gira)]}>
        <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.09, 0.1, 0.05, 32]} /><meshStandardMaterial color="#2a2d31" roughness={0.4} /></mesh>
        <mesh position={[0, 0.07, 0.03]}><boxGeometry args={[0.02, 0.06, 0.012]} />{GLOW("#ffffff")}</mesh></group>
    </group>
    <Halo p={[0.32, 0.25, 0.0]} r={0.22 * eio(tt, 3.0, 3.6)} c={VER} o={0.5} />
  </Estudio>;
}}</Stage>;

// 20 · EL AGUJERO EN EL CUERPO: el tanque con su costura soldada y una mancha de óxido; por un agujero sale un chorrito que crece en arco;
// llegan una llave, una cinta y un parche, rebotan contra el chorro y caen (halo rojo): no hay pieza que lo arregle
const HPerforado: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#12161b">{(tt) => {
  const ch = eio(tt, 0.5, 1.6), tools = [1.7, 2.3, 2.9];
  return <Estudio t={tt} cam={[0.45, 0.6, 1.6]} look={[0.15, 0.5, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Piso />
    <group scale={0.0001 + cl(IN(tt, 0.3))}>
      <Calentador />
      <mesh position={[0, 0.5, 0.282]}><boxGeometry args={[0.012, 0.85, 0.008]} /><meshStandardMaterial color="#d8d4ca" roughness={0.5} /></mesh>
      <mesh position={[0.005, 0.3, 0.283]}><circleGeometry args={[0.08, 32]} /><meshStandardMaterial map={oxido()} bumpMap={oxido()} bumpScale={3} roughness={1} transparent opacity={0.95} /></mesh>
      <mesh position={[0.01, 0.12, 0.282]}><planeGeometry args={[0.03, 0.3]} /><meshStandardMaterial map={oxido()} transparent opacity={0.6} /></mesh>
      <mesh position={[0.005, 0.3, 0.285]}><circleGeometry args={[0.008, 16]} /><meshBasicMaterial color="#050505" /></mesh>
      <Chorro a={[0.005, 0.3, 0.29]} v={[0.15, 0.2, 0.7 * ch + 0.1]} t={tt} k={ch} n={40} r={0.018} />
      {ch > 0.3 && <mesh position={[0.06, 0.004, 0.55]} rotation={[-P2, 0, 0]} scale={0.18 * ch}><circleGeometry args={[1, 32]} />{AGUA(0.5, "#6a96b6")}</mesh>}
      {tools.map((a, i) => { const q = cl((tt - a) / 0.5), r = cl((tt - a - 0.5) / 0.6);
        const p: V3 = r > 0 ? [0.25 + 0.2 * r, 0.3 + 0.1 * r - 0.5 * r * r, 0.5 + 0.1 * r] : [lerp(0.9, 0.08, q), 0.3, lerp(0.6, 0.38, q)];
        return q > 0 && <group key={i} position={[p[0], Math.max(0.02, p[1]), p[2]]} rotation={[r * 4, i, r * 3]}>
          {i === 0 && <mesh><boxGeometry args={[0.14, 0.02, 0.03]} />{M.cromo()}</mesh>}
          {i === 1 && <mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.035, 0.015, 10, 24]} /><meshStandardMaterial color="#e0e0e0" roughness={0.6} /></mesh>}
          {i === 2 && <mesh><boxGeometry args={[0.07, 0.07, 0.006]} /><meshStandardMaterial color="#4a4a4a" roughness={0.6} /></mesh>}
          <Halo p={[0, 0, 0.03]} r={r > 0 && r < 0.6 ? 0.1 : 0} c={RED} o={0.8} />
        </group>; })}
      <Halo p={[0.005, 0.3, 0.33]} r={0.2 * eio(tt, 3.3, 3.8)} c={RED} o={0.55} />
    </group>
    <Sombra p={[0, 0.003, 0]} r={0.36} />
  </Estudio>;
}}</Stage>;

// 21 · LA RUTINA DEL AÑO (items): el calentador al fondo; adelante una fila de seis objetos reales que suben del piso uno por paso y se encienden dorados
const Estacion: React.FC<{ i: number; tt: number }> = ({ i, tt }) => {
  if (i === 0) return <group rotation={[0, 0, P2 * 0.9]}><mesh><cylinderGeometry args={[0.025, 0.02, 0.14, 18]} /><meshStandardMaterial color="#2a2d31" /></mesh><mesh position={[0, 0.075, 0]}><cylinderGeometry args={[0.032, 0.026, 0.03, 18]} />{M.cromo()}</mesh><Halo p={[0, 0.12, 0]} r={0.08} o={0.8} /></group>;
  if (i === 1) return <group><Caño a={[0, 0.1, 0]} b={[0, -0.05, 0]} r={0.012} /><mesh position={[0, -0.07 - 0.02 * ((tt * 1.2) % 1), 0]} scale={[0.009, 0.013, 0.009]}><sphereGeometry args={[1, 10, 8]} />{AGUA(0.9, "#9fd4f4")}</mesh></group>;
  if (i === 2) return <group scale={0.6}><Grifo p={[-0.08, 0, 0]} c={FRIA} /><Grifo p={[0.08, 0, 0]} c={RED} /></group>;
  if (i === 3) return <group rotation={[0.6, 0, 0]}><mesh><cylinderGeometry args={[0.03, 0.03, 0.025, 24]} />{M.cromo()}</mesh><mesh position={[0, 0.013, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.024, 24]} /><meshStandardMaterial color="#888" wireframe /></mesh></group>;
  if (i === 4) return <group rotation={[P2 * 0.7, 0, 0]}>{[0, 1].map((j) => <mesh key={j} position={[0, 0, j * 0.02]}><torusGeometry args={[0.045, 0.01, 8, 28]} /><meshStandardMaterial color="#2e8b3e" /></mesh>)}</group>;
  return <Anodo s={0.22} />;
};
const HRutina: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const a = Array.from({ length: 6 }, (_, i) => AT(h, i, 0.9));
  return <Estudio t={tt} cam={[0.0, 0.4, 1.4]} look={[0, 0.28, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.9} />
    <Piso />
    <Calentador p={[0, 0, -0.5]} s={0.7} />
    <Sombra p={[0, 0.003, -0.5]} r={0.3} />
    {Array.from({ length: 6 }, (_, i) => { const x = -0.6 + i * 0.24, q = eio(tt, a[i], a[i] + 0.35), on = eio(tt, a[i] + 0.2, a[i] + 0.5);
      return <group key={i} position={[x, 0, 0.15]}>
        <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.09, 0.1, 0.04, 32]} /><meshStandardMaterial color={col("#3a3d42", "#c9a24a", on)} metalness={0.6} roughness={0.35} emissive={col("#000000", "#5a3e08", on)} /></mesh>
        {q > 0.01 && <group position={[0, 0.06 + 0.14 * q, 0]} scale={q * 1.9}><Estacion i={i} tt={tt} /></group>}
        <Halo p={[0, 0.15, 0.05]} r={0.14 * on} c="#ffd36a" o={0.5} />
      </group>; })}
  </Estudio>;
}}</Stage>;

// 22 · LOS CINCO ERRORES (items): repisa de cinco nichos; con cada error cae su objeto y se pone ROJO con una sacudida:
// manguera reventada · válvula con tapón amarrado · perilla al máximo · cerillo en nube de gas · resistencia al rojo sin agua
const Error5: React.FC<{ i: number; tt: number; on: number }> = ({ i, tt, on }) => {
  if (i === 0) return <group rotation={[P2 * 0.7, 0, 0]}>{[0, 1, 2].map((j) => <mesh key={j} position={[0, 0, j * 0.018]}><torusGeometry args={[0.07, 0.012, 8, 32, 2 * P - 0.5 * on]} /><meshStandardMaterial color="#2e8b3e" /></mesh>)}
    <Chorro a={[0.07, 0, 0.02]} v={[0.2, 0.2, 0.2]} t={tt} k={on} n={8} r={0.006} /></group>;
  if (i === 1) return <group><Valvula s={0.7} /><mesh position={[0.11, -0.014, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.028, 0.024, 0.03, 16]} /><meshStandardMaterial color="#c4281c" /></mesh>
    <mesh position={[0.1, -0.014, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.028, 0.003, 6, 20]} />{M.cromo()}</mesh></group>;
  if (i === 2) return <group><mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.08, 0.08, 0.02, 32]} /><meshStandardMaterial color="#1f2226" /></mesh>
    <mesh position={[0, 0, 0.011]}><circleGeometry args={[0.08, 32]} /><meshBasicMaterial map={perillaTex()} toneMapped={false} /></mesh>
    <group position={[0, 0, 0.02]} rotation={[0, 0, -30 * P / 180 - P2]}><mesh position={[0, 0.04, 0]}><boxGeometry args={[0.012, 0.04, 0.006]} />{GLOW(RED)}</mesh></group></group>;
  if (i === 3) return <group><group rotation={[0, 0, 0.4]}><mesh><boxGeometry args={[0.008, 0.11, 0.008]} />{M.madera("#d9b98a")}</mesh><Llama p={[0, 0.06, 0]} s={0.5} t={tt} /></group>
    {Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[(rn(j, 1) - 0.5) * 0.15, (rn(j, 2) - 0.3) * 0.12, (rn(j, 3) - 0.5) * 0.08]} scale={0.04}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#c8d26a" transparent opacity={0.2} depthWrite={false} /></mesh>)}</group>;
  return <group rotation={[0, 0, P2]}><Espiral k="e5" R={0.025} alto={0.14} v={5} r={0.007}><meshStandardMaterial color={col("#9aa0a6", "#ff5a1a", on)} emissive={col("#000000", "#ff3a0a", on)} emissiveIntensity={1.6} /></Espiral></group>;
};
const HErrores: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#12161b">{(tt) => {
  const a = [0, 1, 2, 3, 4].map((i) => AT(h, i, 1.2));
  return <Estudio t={tt} cam={[0.0, 0.1, 1.45]} look={[0, 0.08, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} />
    <mesh position={[0, -0.1, -0.05]}><boxGeometry args={[1.5, 0.03, 0.3]} />{M.madera("#7a5232")}</mesh>
    <mesh position={[0, 0.12, -0.19]}><boxGeometry args={[1.5, 0.5, 0.02]} />{M.madera("#5e3d24")}</mesh>
    {[0, 1, 2, 3, 4, 5].map((i) => <mesh key={i} position={[-0.75 + i * 0.3, 0.12, -0.05]}><boxGeometry args={[0.02, 0.5, 0.3]} />{M.madera("#6b4a2e")}</mesh>)}
    {[0, 1, 2, 3, 4].map((i) => { const x = -0.6 + i * 0.3, d = cl((tt - a[i]) / 0.4), on = eio(tt, a[i] + 0.4, a[i] + 0.7), sh = on * (1 - on) * 4 * 0.15 * Math.sin(tt * 40);
      return d > 0 && <group key={i}>
        <group position={[x + sh * 0.1, lerp(0.8, 0.02, d * d), 0]} rotation={[0, 0, sh]} scale={1.15}><Error5 i={i} tt={tt} on={on} /></group>
        <mesh position={[x, -0.083, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.12, 32]} /><meshBasicMaterial color={RED} transparent opacity={0.35 * on} toneMapped={false} /></mesh>
        <Halo p={[x, 0.05, 0.1]} r={0.18 * on} c={RED} o={0.55} />
      </group>; })}
  </Estudio>;
}}</Stage>;

// 23 · EL REPASO EN EL TABLERO (items): un tablero perforado con ocho siluetas; con cada idea su pieza real vuela a su lugar y se enciende dorada
const Pieza8: React.FC<{ i: number }> = ({ i }) => {
  if (i === 0) return <group rotation={[P2 * 0.7, 0, 0]}><mesh><torusGeometry args={[0.05, 0.011, 8, 28]} /><meshStandardMaterial color="#2e8b3e" /></mesh><mesh rotation={[-P2 * 0.7, 0, 0.78]}><boxGeometry args={[0.13, 0.012, 0.012]} />{GLOW(RED)}</mesh></group>;
  if (i === 1) return <group><mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.02, 0.02, 0.1, 14]} />{BRONCE()}</mesh><mesh position={[0, 0.03, 0]}><boxGeometry args={[0.012, 0.07, 0.02]} /><meshStandardMaterial color="#e2c23a" /></mesh></group>;
  if (i === 2) return <group><RBox s={[0.08, 0.08, 0.03]} r={0.008}><meshStandardMaterial color="#9ea3a8" metalness={0.7} /></RBox><mesh position={[0, 0, 0.025]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.025, 16]} /><meshStandardMaterial color={RED} /></mesh></group>;
  if (i === 3) return <group rotation={[0, 0, P2]} position={[0, -0.05, 0]}><Espiral k="p8" R={0.022} alto={0.1} v={5} r={0.006}><meshStandardMaterial color="#ff7a3a" emissive="#a02a00" /></Espiral></group>;
  if (i === 4) return <Anodo s={0.14} />;
  if (i === 5) return <mesh><boxGeometry args={[0.1, 0.02, 0.06]} /><meshStandardMaterial map={costra()} bumpMap={costra()} bumpScale={3} /></mesh>;
  if (i === 6) return <mesh><boxGeometry args={[0.1, 0.06, 0.008]} /><meshStandardMaterial map={oxido()} bumpMap={oxido()} bumpScale={3} /></mesh>;
  return <Valvula s={0.45} />;
};
const pegTex = () => ctex("p4b2:peg", 512, 256, (g) => { g.fillStyle = "#c9a87a"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#3a2c1c"; for (let x = 8; x < 512; x += 20) for (let y = 8; y < 256; y += 20) { g.beginPath(); g.arc(x, y, 3, 0, 2 * P); g.fill(); } });
const HRecap: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#12161b">{(tt) => {
  const a = Array.from({ length: 8 }, (_, i) => AT(h, i, 0.55, 0.5));
  return <Estudio t={tt} cam={[0.0, 0.25, 1.25]} look={[0, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, 0.25, -0.05]}><boxGeometry args={[1.2, 0.62, 0.02]} /><meshStandardMaterial map={pegTex()} roughness={0.85} /></mesh>
    {Array.from({ length: 8 }, (_, i) => { const x = -0.42 + (i % 4) * 0.28, y = i < 4 ? 0.4 : 0.1, q = eio(tt, a[i], a[i] + 0.35), on = eio(tt, a[i] + 0.3, a[i] + 0.5);
      return <group key={i}>
        <mesh position={[x, y, -0.035]}><circleGeometry args={[0.1, 32]} /><meshBasicMaterial color={col("#8c7350", "#ffcf5a", on)} toneMapped={false} transparent opacity={0.85} /></mesh>
        {q > 0.01 && <group position={[lerp(x * 2.2, x, q), lerp(y - 0.8, y, q), lerp(0.6, 0.02, q)]} rotation={[0, (1 - q) * 3, 0]} scale={1.3}><Pieza8 i={i} /></group>}
        <Halo p={[x, y, 0.06]} r={0.16 * on * (1 - cl((tt - a[i] - 0.5) / 0.6) * 0.6)} c="#ffd36a" o={0.6} />
      </group>; })}
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  b_mentira: HMentira, b_lupe: HLupe, b_canal: HCanal, b_sesenta: HSesenta, b_gas: HGas, b_reset: HReset, b_termopar: HTermopar, b_resist: HResist,
  b_mezcla: HMezcla, b_olfato: HOlfato, b_bacteria: HBacteria, b_palomitas: HPalomitas, b_oxido: HOxido, b_presion: HPresion, b_tapon: HTapon,
  b_sacrificio: HSacrificio, b_medida: HMedida, b_golpe: HGolpe, b_termostato: HTermostato, b_perforado: HPerforado, b_rutina: HRutina, b_errores: HErrores, b_recap: HRecap,
};
