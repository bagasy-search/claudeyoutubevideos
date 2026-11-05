// plo4h v3 (tras EVAL r2) · EL TINACO Y SU BAJADA (la presión es la altura) · componentes únicos 3D (ninguno repite mecanismo de plo29a-e, plo4a/b/c/e ni entre sí).
// Lecciones aplicadas desde el arranque: cámara fija y cercana (fit={false}) con margen, CERO rótulos (el objeto lo dice), los objetos ENTRAN,
// sombra de contacto, fondo oscuro detrás del vidrio, animación terminada antes de tt≈4.2; en los de items cada momento dura ≥0.7 s.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, phys, RED, Stage, VER } from "./ckit";
import { ctex, Estudio, lathe, M, RBox, rn } from "./estudio3d";
import { AGUA, tuboGeo } from "./kitplo";

type C = React.FC<{ t: number; h: H }>;
type V3 = [number, number, number];
const P = Math.PI, P2 = P / 2;
const rel = (h: H, i: number) => (h.items?.[i]?.a ?? h.at + 99) - h.at;
const IN = (tt: number, a: number) => phys(tt, a, 7, 0.45);
const AT = (h: H, i: number, step = 1.1, a0 = 0.6) => rel(h, i) > 90 ? a0 + i * step : rel(h, i);
const CACHE = new Map<string, any>();
const memo = <T,>(k: string, f: () => T): T => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const AMBAR = "#f2a93b", AZUL = "#3f9ee0", PVC = "#ecebe4";
const GLOW = (c: string, o = 1) => <meshBasicMaterial color={c} transparent opacity={o} toneMapped={false} depthWrite={false} />;
const VIDRIO = (o = 0.28) => <meshPhysicalMaterial color="#e3f1f5" roughness={0.03} clearcoat={1} transparent opacity={o} side={THREE.DoubleSide} depthWrite={false} />;
const PVCM = () => <meshPhysicalMaterial color={PVC} roughness={0.35} clearcoat={0.4} />;
// ---------- escenografía de azotea ----------
const sombraTex = () => ctex("p4h:sombra", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(0,0,0,0.8)"); gr.addColorStop(0.45, "rgba(0,0,0,0.4)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const Sombra: React.FC<{ p: V3; r: number; o?: number; sx?: number }> = ({ p, r, o = 0.75, sx = 1 }) =>
  <mesh position={p} rotation={[-P2, 0, 0]} scale={[sx, 1, 1]} renderOrder={2}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={sombraTex()} transparent opacity={o} depthWrite={false} toneMapped={false} /></mesh>;
const cieloTex = () => ctex("p4h:cielo", 64, 512, (g) => { const gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, "#2d5f8f"); gr.addColorStop(0.6, "#6f9fc4"); gr.addColorStop(1, "#c7d9e4"); g.fillStyle = gr; g.fillRect(0, 0, 64, 512); });
const Cielo: React.FC<{ z?: number; dim?: number }> = ({ z = -1.2, dim = 1 }) =>
  <mesh position={[0, 0.6, z]}><planeGeometry args={[8, 5]} /><meshBasicMaterial map={cieloTex()} color={col("#000000", "#ffffff", dim)} toneMapped={false} /></mesh>;
const losaTex = () => { const t = ctex("p4h:losa", 512, 512, (g) => { g.fillStyle = "#8e8a84"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) { const v = 110 + Math.floor(rn(i, 1) * 60); g.fillStyle = `rgba(${v},${v - 3},${v - 7},0.5)`; g.fillRect(rn(i, 2) * 512, rn(i, 3) * 512, 2 + rn(i, 4) * 3, 2 + rn(i, 5) * 3); }
  g.strokeStyle = "rgba(60,58,55,0.5)"; g.lineWidth = 3; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * 128, 0); g.lineTo(k * 128, 512); g.stroke(); g.beginPath(); g.moveTo(0, k * 128); g.lineTo(512, k * 128); g.stroke(); } });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 3); return t; };
const Losa: React.FC<{ y: number; dim?: number }> = ({ y, dim = 0.8 }) =>
  <mesh position={[0, y, 0]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[6, 4]} /><meshStandardMaterial map={losaTex()} color={col("#000000", "#ffffff", dim)} roughness={0.95} /></mesh>;
const Fondo: React.FC<{ z?: number; c?: string }> = ({ z = -0.9, c = "#11161c" }) =>
  <mesh position={[0, 0, z]}><planeGeometry args={[7, 5]} /><meshBasicMaterial color={c} toneMapped={false} /></mesh>;
const halo = () => ctex("p4h:halo", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(255,248,220,0.95)"); gr.addColorStop(0.3, "rgba(255,240,200,0.35)"); gr.addColorStop(1, "rgba(255,240,200,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const Halo: React.FC<{ p: V3; r: number; c?: string; o?: number }> = ({ p, r, c = "#fff3c0", o = 1 }) =>
  <mesh position={p} renderOrder={5}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={halo()} color={c} transparent opacity={o} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} /></mesh>;
const Caño: React.FC<{ a: V3; b: V3; r?: number; vidrio?: boolean; c?: string }> = ({ a, b, r = 0.03, vidrio, c }) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = Math.max(0.001, d.length());
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()), m = A.clone().add(B).multiplyScalar(0.5);
  return <mesh position={[m.x, m.y, m.z]} quaternion={q} castShadow><cylinderGeometry args={[r, r, L, 24, 1, !!vidrio]} />{vidrio ? VIDRIO(0.3) : c ? <meshStandardMaterial color={c} roughness={0.4} /> : PVCM()}</mesh>;
};
// tinaco negro con aros; «x» lo vuelve de vidrio y deja ver el agua
const Tinaco: React.FC<{ p?: V3; s?: number; r?: number; hh?: number; nivel?: number; x?: number; tapa?: number }> = ({ p, s = 1, r = 0.3, hh = 0.62, nivel = 0.85, x = 0, tapa = 0 }) => {
  const wl = 0.03 + (hh - 0.06) * nivel;
  return <group position={p} scale={s}>
    <mesh position={[0, hh / 2, 0]} castShadow><cylinderGeometry args={[r, r * 1.04, hh, 48, 1, x > 0.02]} /><meshPhysicalMaterial color="#1d1f22" roughness={0.55} clearcoat={0.3} transparent={x > 0.01} opacity={1 - 0.78 * x} depthWrite={x < 0.5} side={THREE.DoubleSide} /></mesh>
    {[0.14, 0.28, 0.42].map((y, i) => <mesh key={i} position={[0, y * hh / 0.62, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[r * 1.012, 0.008, 6, 48]} /><meshStandardMaterial color="#111" roughness={0.6} transparent={x > 0.01} opacity={1 - 0.7 * x} /></mesh>)}
    <mesh position={[0, hh + 0.02, 0]}><cylinderGeometry args={[r * 0.98, r, 0.05, 48]} /><meshStandardMaterial color="#1a1c1f" roughness={0.6} transparent={x > 0.01} opacity={1 - 0.6 * x} /></mesh>
    <group position={[0, hh + 0.06 + tapa * 0.12, tapa * 0.2]} rotation={[tapa * 0.7, 0, 0]}><mesh><cylinderGeometry args={[r * 0.45, r * 0.48, 0.05, 32]} /><meshStandardMaterial color="#141517" roughness={0.6} /></mesh></group>
    {(x > 0.02 || tapa > 0.3) && <>
      <mesh position={[0, wl / 2 + 0.015, 0]}><cylinderGeometry args={[r - 0.012, r - 0.012, Math.max(0.005, wl - 0.03), 40]} />{AGUA(0.55, "#4f9fd8")}</mesh>
      <mesh position={[0, wl, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[r - 0.012, 40]} /><meshPhysicalMaterial color="#9fd0ee" transparent opacity={0.7} roughness={0.02} /></mesh>
    </>}
  </group>;
};
// manómetro: carátula con escala, aguja que gira con v/max
const dialTex = (max: number) => ctex("p4h:dial" + max, 512, 512, (g) => {
  g.fillStyle = "#f4f1e8"; g.beginPath(); g.arc(256, 256, 250, 0, 2 * P); g.fill(); g.strokeStyle = "#1a1a1a"; g.lineWidth = 10; g.stroke();
  g.fillStyle = "#1a1a1a"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "800 46px Inter, Arial, sans-serif";
  for (let i = 0; i <= 20; i++) { const a = (-225 + i * 13.5) * P / 180, r0 = i % 5 ? 196 : 176; g.lineWidth = i % 5 ? 4 : 9; g.beginPath(); g.moveTo(256 + Math.cos(a) * r0, 256 + Math.sin(a) * r0); g.lineTo(256 + Math.cos(a) * 226, 256 + Math.sin(a) * 226); g.stroke();
    if (i % 5 === 0) g.fillText((max * i / 20).toFixed(max < 2 ? 2 : 1).replace(/0$/, ""), 256 + Math.cos(a) * 132, 256 + Math.sin(a) * 132); }
  g.fillStyle = "#c0392b"; g.beginPath(); g.arc(256, 256, 250, (-225 + 270 * 0.8) * P / 180, (45) * P / 180); g.arc(256, 256, 228, 45 * P / 180, (-225 + 270 * 0.8) * P / 180, true); g.fill(); });
const Manometro: React.FC<{ p: V3; s?: number; v: number; max?: number; rot?: V3 }> = ({ p, s = 1, v, max = 1, rot }) => <group position={p} scale={s} rotation={rot}>
  <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.05, 48]} />{M.cromo()}</mesh>
  <mesh position={[0, 0, 0.026]}><circleGeometry args={[0.118, 48]} /><meshBasicMaterial map={dialTex(max)} toneMapped={false} /></mesh>
  <group position={[0, 0, 0.03]} rotation={[0, 0, -(-225 + 270 * cl(v / max)) * P / 180 - P]}><mesh position={[0.045, 0, 0]}><boxGeometry args={[0.1, 0.008, 0.004]} />{GLOW(RED)}</mesh></group>
  <mesh position={[0, 0, 0.034]}><circleGeometry args={[0.012, 16]} /><meshBasicMaterial color="#222" /></mesh>
  <mesh position={[0, 0, 0.03]}><circleGeometry args={[0.119, 48]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.12} roughness={0} clearcoat={1} /></mesh>
  <mesh position={[0, -0.16, 0]}><cylinderGeometry args={[0.02, 0.02, 0.08, 12]} /><meshStandardMaterial color="#b98a3e" metalness={0.7} roughness={0.3} /></mesh>
</group>;
// contador de rodillos
const tambor = () => ctex("p4h:tambor", 1024, 256, (g) => {
  g.fillStyle = "#f3ecd8"; g.fillRect(0, 0, 1024, 256); g.fillStyle = "#16130f"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 92px Inter, Arial, sans-serif";
  for (let n = 0; n <= 10; n++) { g.save(); g.translate(n * 102.4, 128); g.rotate(P2); g.scale(1.9, 1); g.fillText(String(n % 10), 0, 6); g.restore(); }
  g.fillStyle = "rgba(0,0,0,.16)"; for (let n = 0; n < 10; n++) g.fillRect(n * 102.4 + 50, 0, 3, 256); });
const letra = (txt: string) => ctex("p4h:le" + txt, 256, 256, (g) => { g.fillStyle = "#2a2522"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#f3ecd8"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 150px Inter, Arial, sans-serif"; g.fillText(txt, 128, 140); });
const Tambores: React.FC<{ p: V3; rot?: V3; val: number; n: number; s?: number; sufijo?: string }> = ({ p, rot, val, n, s = 1, sufijo }) => {
  const pos = (k: number) => { const m = Math.pow(10, k), v = val / m; if (k === 0) return v; const low = val % m; return Math.floor(v) + cl(low - (m - 1)); };
  const W = n * 0.2 + (sufijo ? 0.22 : 0), x0 = -W / 2 + 0.1;
  return <group position={p} rotation={rot} scale={s}>
    {Array.from({ length: n }, (_, i) => <group key={i} position={[x0 + i * 0.2, 0, 0]} rotation={[2 * P * pos(n - 1 - i) / 10, 0, 0]}>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.17, 0.17, 0.16, 48]} /><meshStandardMaterial map={tambor()} roughness={0.45} /></mesh></group>)}
    {[0.17, -0.17].map((y, i) => <mesh key={i} position={[0, y, 0.16]}><boxGeometry args={[W + 0.08, 0.1, 0.04]} /><meshStandardMaterial color="#2a2522" roughness={0.5} metalness={0.3} /></mesh>)}
    {sufijo && <mesh position={[W / 2 - 0.1, 0, 0.181]}><planeGeometry args={[0.2, 0.22]} /><meshBasicMaterial map={letra(sufijo)} toneMapped={false} /></mesh>}
  </group>;
};
const Burbuja: React.FC<{ p: V3; r: number; o?: number }> = ({ p, r, o = 0.75 }) => r <= 0.0005 ? null :
  <mesh position={p} scale={r}><sphereGeometry args={[1, 18, 14]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={o} roughness={0} clearcoat={1} ior={1.1} /></mesh>;
const Anillo: React.FC<{ p: V3; r: number; o: number; c?: string; rot?: V3 }> = ({ p, r, o, c = "#ffffff", rot = [-P2, 0, 0] }) => o <= 0.01 ? null :
  <mesh position={p} rotation={rot} scale={r}><ringGeometry args={[0.82, 1, 40]} /><meshBasicMaterial color={c} transparent opacity={o} depthWrite={false} side={THREE.DoubleSide} /></mesh>;
const curva = (k: string, pts: V3[]) => memo("p4h:cv" + k, () => new THREE.CurvePath<THREE.Vector3>().constructor && (() => { const cp = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 1; i < pts.length; i++) cp.add(new THREE.LineCurve3(new THREE.Vector3(...pts[i - 1]), new THREE.Vector3(...pts[i]))); return cp; })());
const enCurva = (cp: THREE.CurvePath<THREE.Vector3>, u: number): V3 => { const v = cp.getPointAt(Math.min(0.9999, Math.max(0, u))); return [v.x, v.y, v.z]; };
const Ruta: React.FC<{ k: string; pts: V3[]; r: number; vidrio?: boolean }> = ({ k, pts, r, vidrio }) => <>
  {pts.slice(1).map((b, i) => <Caño key={i} a={pts[i]} b={b} r={r} vidrio={vidrio} />)}
  {pts.slice(1, -1).map((q, i) => <mesh key={"c" + i} position={q}><sphereGeometry args={[r * 1.25, 18, 12]} />{vidrio ? VIDRIO(0.3) : PVCM()}</mesh>)}
  {void k}
</>;

// 1 · TRES TINACOS, TRES VEREDICTOS: los tres tinacos de la imagen en fila sobre la azotea (bajada directa · con jarro · con muchos codos);
// sobre cada uno se enciende su luz: el de los codos VERDE (verdad), el del jarro ÁMBAR (a medias), el de la bajada directa ROJO que late (la mentira)
const HTres: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const luz = [eio(tt, 2.6, 3.1), eio(tt, 1.6, 2.1), eio(tt, 0.6, 1.1)], cols = [RED, AMBAR, VER];
  return <Estudio t={tt} cam={[0.0, 0.62, 2.55]} look={[0, 0.45, 0]} orbit={0.01} mesa={false} fit={false}>
    <Cielo z={-1.4} dim={0.75} />
    <Losa y={0} dim={0.7} />
    {[-0.82, 0, 0.82].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <group position={[0, lerp(1.6, 0, IN(tt, 0.05 + i * 0.12) > 0 ? cl(IN(tt, 0.05 + i * 0.12)) : 0), 0]}>
        <RBox s={[0.5, 0.18, 0.5]} r={0.01} p={[0, 0.09, 0]}><meshStandardMaterial color="#9a958d" roughness={0.95} /></RBox>
        <Tinaco p={[0, 0.18, 0]} r={0.22} hh={0.5} />
        {i === 0 && <Ruta k="t0" pts={[[0.2, 0.24, 0.06], [0.3, 0.24, 0.06], [0.3, -0.05, 0.06]]} r={0.018} />}
        {i === 1 && <Ruta k="t1" pts={[[0.2, 0.24, 0.06], [0.28, 0.24, 0.06], [0.28, 0.32, 0.06], [0.34, 0.32, 0.06], [0.34, -0.05, 0.06]]} r={0.018} />}
        {i === 1 && <Caño a={[0.28, 0.32, 0.06]} b={[0.28, 0.82, 0.06]} r={0.014} />}
        {i === 2 && <Ruta k="t2" pts={[[0.2, 0.24, 0.06], [0.28, 0.24, 0.06], [0.28, 0.14, 0.06], [0.36, 0.14, 0.06], [0.36, 0.06, 0.16], [0.36, 0.06, 0.26], [0.28, -0.05, 0.26]]} r={0.018} />}
      </group>
      <Sombra p={[0, 0.003, 0]} r={0.36} />
      <mesh position={[0, 1.02, 0.1]} scale={(0.07 + (i === 0 ? 0.012 * Math.sin(tt * 9) : 0)) * luz[i] + 0.0001}><sphereGeometry args={[1, 24, 18]} />{GLOW(cols[i])}</mesh>
      <Halo p={[0, 1.02, 0.12]} r={0.3 * luz[i]} c={cols[i]} o={0.8} />
      <Halo p={[0, 0.4, 0.3]} r={0.55 * luz[i]} c={cols[i]} o={0.18} />
    </group>)}
  </Estudio>;
}}</Stage>;

// 2 · EL AGUA PESA: una columna de vidrio parada sobre una báscula de baño; el agua sube en la columna y la aguja de la báscula gira con el peso
const basTex = () => ctex("p4h:bas", 512, 256, (g) => { g.fillStyle = "#f2efe6"; g.fillRect(0, 0, 512, 256); g.strokeStyle = "#1a1a1a"; g.fillStyle = "#1a1a1a"; g.textAlign = "center"; g.font = "800 34px Inter, Arial, sans-serif";
  for (let i = 0; i <= 40; i++) { const x = 16 + i * 12; g.lineWidth = i % 5 ? 2 : 5; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, i % 5 ? 40 : 70); g.stroke(); if (i % 10 === 0) g.fillText(String(i * 5), x, 110); } });
const HBascula: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#10161e">{(tt) => {
  const k = eio(tt, 0.5, 3.4), H0 = 0.95;
  return <Estudio t={tt} cam={[0.0, 0.55, 1.95]} look={[0, 0.45, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-0.9} c="#121a22" />
    <Losa y={0} dim={0.35} />
    <group scale={IN(tt, 0.05) + 0.0001}>
      <RBox s={[0.62, 0.08, 0.5]} r={0.03} p={[0, 0.04, 0]}><meshPhysicalMaterial color="#e8e6e0" roughness={0.3} clearcoat={0.6} /></RBox>
      <mesh position={[0, 0.06, 0.252]}><planeGeometry args={[0.36, 0.06]} /><meshBasicMaterial color="#1b1f24" /></mesh>
      <mesh position={[(k * 0.75 - 0.5) * -0.34, 0.06, 0.253]}><planeGeometry args={[0.6, 0.05]} /><meshBasicMaterial map={basTex()} toneMapped={false} /></mesh>
      <mesh position={[0, 0.06, 0.256]}><boxGeometry args={[0.006, 0.07, 0.002]} />{GLOW(RED)}</mesh>
      <mesh position={[0, 0.08 + H0 / 2, 0]}><cylinderGeometry args={[0.12, 0.12, H0, 40, 1, true]} />{VIDRIO(0.25)}</mesh>
      <mesh position={[0, 0.085, 0]}><cylinderGeometry args={[0.125, 0.125, 0.012, 40]} />{M.cromo()}</mesh>
      <mesh position={[0, 0.09 + H0 * k / 2, 0]}><cylinderGeometry args={[0.112, 0.112, H0 * k + 0.001, 40]} />{AGUA(0.75, AZUL)}</mesh>
      <mesh position={[0, 0.09 + H0 * k, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.11, 0.005, 8, 40]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.6} /></mesh>
      {k > 0.02 && k < 0.98 && <mesh position={[0, 0.09 + H0 + 0.25, 0]}><cylinderGeometry args={[0.012, 0.012, 0.5 - H0 * k * 0.1, 10]} />{AGUA(0.85, "#7cc4f0")}</mesh>}
      <Halo p={[0, 0.06, 0.3]} r={0.3 * k} c="#ffd36a" o={0.5} />
    </group>
  </Estudio>;
}}</Stage>;

// 3 · UNA DÉCIMA POR METRO: losas de piso que se apilan una por una (10 metros) junto a una cinta amarilla; abajo el manómetro sube 0,1 por piso hasta 1 kilo
const HPisos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const n = Array.from({ length: 10 }, (_, i) => cl((tt - 0.4 - i * 0.3) / 0.25)), v = n.reduce((s, x) => s + x, 0) / 10;
  return <Estudio t={tt} cam={[0.15, 0.62, 2.35]} look={[0.12, 0.6, 0]} orbit={0.01} mesa={false} fit={false}>
    <Cielo z={-1.2} dim={0.6} />
    <Losa y={0} dim={0.65} />
    {n.map((k, i) => k > 0 && <group key={i} position={[-0.3, 0.06 + i * 0.12 + 0.5 * (1 - k) * (1 - k), 0]}>
      <RBox s={[0.6, 0.1, 0.4]} r={0.008}><meshStandardMaterial color={i % 2 ? "#a29d94" : "#b3ada3"} roughness={0.9} /></RBox>
    </group>)}
    <mesh position={[-0.3, 0.06 + 10 * 0.12 + 0.04, 0]} visible={n[9] >= 1}><cylinderGeometry args={[0.13, 0.13, 0.18, 32]} /><meshStandardMaterial color="#1d1f22" roughness={0.6} /></mesh>
    <mesh position={[0.06, 0.6, 0.05]} scale={[1, v + 0.0001, 1]}><boxGeometry args={[0.04, 1.2, 0.006]} /><meshBasicMaterial color="#f2c230" toneMapped={false} /></mesh>
    <Caño a={[0.0, 0.06 + v * 1.2, -0.05]} b={[0.0, 0.18, -0.05]} r={0.016} />
    <Caño a={[0.0, 0.18, -0.05]} b={[0.42, 0.18, -0.05]} r={0.016} />
    <Manometro p={[0.55, 0.38, 0.0]} s={1.9} v={v} max={1} />
    <Sombra p={[-0.3, 0.003, 0]} r={0.45} />
  </Estudio>;
}}</Stage>;

// 4 · LE FALTA ALTURA: corte de una casa de un piso con su tinaco a 2,5 m; una línea punteada marca los 5 m que pide la regadera; un tinaco fantasma sube allá
// y la barra roja del hueco que falta crece entre los dos
// 4 · LE FALTA ALTURA (v3): dos tinacos de vidrio con su regadera abajo; el de la izquierda sobre una base bajita: la regadera apenas gotea (rojo);
// el de la derecha sobre una torre alta: chorro lleno (verde). Después la torre de la izquierda CRECE y su chorro se abre: no estaba descompuesta
const HFalta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const crece = eio(tt, 2.2, 3.4), ok = eio(tt, 3.3, 3.8);
  const set = (x: number, hb: number, pres: number, i: number) => { const top = hb + 0.02, ph = cl(pres);
    return <group key={i} position={[x, 0, 0]} scale={cl(IN(tt, 0.3 + i * 0.15)) + 0.0001}>
      <RBox s={[0.42, hb, 0.42]} r={0.01} p={[0, hb / 2, -0.05]}><meshStandardMaterial map={losaTex()} color="#c9bfae" roughness={0.95} /></RBox>
      <Tinaco p={[0, top, -0.05]} r={0.2} hh={0.42} x={0.85} nivel={0.8} />
      <Caño a={[0.16, top + 0.04, 0.05]} b={[0.16, 0.34, 0.05]} r={0.016} c="#c9ced3" />
      <Caño a={[0.16, 0.34, 0.05]} b={[0.3, 0.34, 0.05]} r={0.016} c="#c9ced3" />
      <mesh position={[0.31, 0.32, 0.05]}><cylinderGeometry args={[0.06, 0.03, 0.04, 24]} />{M.cromo()}</mesh>
      {Array.from({ length: 30 }, (_, j) => { const q = (tt * (0.8 + 1.4 * ph) + j / 30) % 1, a = rn(j, 1) * 2 * P, sp = 0.012 + 0.07 * ph * rn(j, 2);
        return (j < 6 + 24 * ph) && <mesh key={j} position={[0.31 + Math.cos(a) * sp * q * 3, 0.3 - q * 0.3, 0.05 + Math.sin(a) * sp * q * 3]} scale={[0.006 + 0.004 * ph, 0.014, 0.006 + 0.004 * ph]}><sphereGeometry args={[1, 6, 4]} />{AGUA(0.95, "#9fd4f4")}</mesh>; })}
      <mesh position={[0.31, 0.004, 0.05]} rotation={[-P2, 0, 0]} scale={0.05 + 0.12 * ph}><circleGeometry args={[1, 28]} />{AGUA(0.5, "#5d8fb0")}</mesh>
      <Halo p={[0.31, 0.18, 0.15]} r={0.22} c={col(RED, VER, ph > 0.6 ? 1 : 0)} o={0.45 * eio(tt, 1.0, 1.5)} />
      <Sombra p={[0, 0.003, -0.05]} r={0.32} />
    </group>; };
  return <Estudio t={tt} cam={[0.0, 0.6, 2.05]} look={[0.0, 0.55, 0]} orbit={0.01} mesa={false} fit={false}>
    <Cielo z={-1.3} dim={0.7} />
    <Losa y={0} dim={0.6} />
    {set(-0.5, lerp(0.15, 0.55, crece), 0.1 + 0.9 * crece, 0)}
    {set(0.38, 0.55, 1, 1)}
    {crece > 0.01 && crece < 1 && <Anillo p={[-0.5, lerp(0.15, 0.55, crece) + 0.01, -0.05]} r={0.28} o={0.7} c={VER} />}
    <Halo p={[-0.5, 0.75, 0.1]} r={0.4 * ok} c={VER} o={0.35} />
  </Estudio>;
}}</Stage>;

// 5 · GRANDE O CHICO, LA MISMA PRESIÓN: un tinaco de 1.100 L y uno de 400 L en rayos X, a la misma altura y con el agua al mismo nivel;
// de cada uno baja su tubo a un manómetro: las dos agujas suben juntas y se clavan en el mismo número; una línea azul une los dos niveles
const HGrande: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#10161e">{(tt) => {
  const ent = IN(tt, 0.1), v = eio(tt, 1.2, 2.8) * 0.3, lin = eio(tt, 3.0, 3.6);
  return <Estudio t={tt} cam={[0.0, 0.62, 2.3]} look={[0, 0.5, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-1.0} c="#111820" />
    <Losa y={0} dim={0.35} />
    {[[-0.45, 0.34, 0.6], [0.5, 0.17, 0.6]].map(([x, r, hh], i) => <group key={i}>
      <RBox s={[0.8, 0.5, 0.6]} r={0.01} p={[x, 0.25, -0.1]}><meshStandardMaterial color="#8e8a84" roughness={0.9} /></RBox>
      <Tinaco p={[x, 0.5, -0.1]} r={r} hh={hh} x={0.85} nivel={0.8} s={ent + 0.0001} />
      <Caño a={[x + r * 0.6, 0.52, -0.1 + r * 0.6]} b={[x + r * 0.6, 0.3, 0.2]} r={0.016} />
      <Manometro p={[x, 0.24, 0.28]} s={1.1} v={v} max={0.5} />
      <Halo p={[x, 0.24, 0.35]} r={0.25 * lin} c={VER} o={0.6} />
    </group>)}
    {lin > 0.01 && <mesh position={[0.02, 0.5 + 0.03 + 0.54 * 0.8, 0.2]} scale={[lin, 1, 1]}><boxGeometry args={[1.5, 0.012, 0.012]} />{GLOW("#7cc4f0")}</mesh>}
  </Estudio>;
}}</Stage>;

// 6 · EL BARRIL DE PASCAL: un barril de madera con duelas y aros de hierro, con un tubito altísimo; el agua sube por el tubito, el barril se hincha
// y revienta: las duelas salen volando con el agua
// 6 · EL BARRIL DE PASCAL (v3): barril de duelas con un tubo alto (entero en cuadro); una jarra vierte apenas un chorrito arriba, el agua sube por el tubo,
// el barril se hincha, los aros saltan y las duelas se abren como una flor en el piso con el charco: el barril sigue ahí, reventado
const HPascal: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#14110e">{(tt) => {
  const vierte = eio(tt, 0.5, 0.8) * (1 - eio(tt, 2.2, 2.4)), sube = eio(tt, 0.7, 2.4), hin = eio(tt, 1.9, 2.7), boom = eio(tt, 2.7, 3.3), NS = 16, TH = 0.82;
  return <Estudio t={tt} cam={[0.0, 0.62, 1.95]} look={[0, 0.6, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-0.9} c="#17130f" />
    <mesh rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[6, 4]} /><meshStandardMaterial color="#6c665c" roughness={0.95} /></mesh>
    <Sombra p={[0, 0.003, 0]} r={0.42} />
    <group scale={cl(IN(tt, 0.3)) + 0.0001}>
      {Array.from({ length: NS }, (_, i) => { const a = i / NS * 2 * P, r0 = 0.24 * (1 + 0.1 * hin + 0.015 * Math.sin(tt * 40) * hin * (1 - boom));
        return <group key={i} position={[Math.cos(a) * (r0 + boom * 0.12), 0.0, Math.sin(a) * (r0 + boom * 0.12)]} rotation={[0, -a, 0]}>
          <group rotation={[0, 0, -boom * 1.25]}><mesh position={[0, 0.25, 0]} castShadow><boxGeometry args={[0.025, 0.5, 0.096]} />{M.madera(i % 2 ? "#8a5e34" : "#7a5230")}</mesh></group></group>; })}
      {[0.06, 0.25, 0.44].map((y, i) => <mesh key={i} position={[boom * 0.35 * (i - 1), y + boom * (0.25 + i * 0.1) - boom * boom * (0.25 + i * 0.1 + y - 0.02), boom * 0.2]} rotation={[P2 + boom * 1.2 * (i - 1), boom * 0.4, 0]} scale={1 + 0.1 * hin + 0.2 * boom}><torusGeometry args={[0.255, 0.012, 8, 48]} />{M.hierro()}</mesh>)}
      <mesh position={[0, 0.5 + boom * 0.1, 0]} rotation={[boom * 0.6, 0, 0]}><cylinderGeometry args={[0.24, 0.24, 0.02, 40]} />{M.madera("#6b4a2e")}</mesh>
      <group position={[0, boom * 0.1, 0]} rotation={[boom * 0.6, 0, 0]}>
        <mesh position={[0, 0.5 + TH / 2, 0]}><cylinderGeometry args={[0.02, 0.02, TH, 14, 1, true]} />{VIDRIO(0.4)}</mesh>
        <mesh position={[0, 0.5 + TH * sube * (1 - boom) / 2, 0]}><cylinderGeometry args={[0.015, 0.015, TH * sube * (1 - boom) + 0.001, 10]} />{AGUA(0.9, AZUL)}</mesh>
        <mesh position={[0, 0.5 + TH, 0]}><cylinderGeometry args={[0.05, 0.02, 0.06, 20, 1, true]} />{VIDRIO(0.5)}</mesh>
      </group>
      <group position={[0.16, 0.5 + TH + 0.16, 0]} rotation={[0, 0, 0.9 * vierte]} visible={vierte > 0.01}>
        <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.06, 0.05, 0.14, 24]} />{VIDRIO(0.5)}</mesh>
        <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.052, 0.045, 0.08, 20]} />{AGUA(0.7, AZUL)}</mesh>
      </group>
      {vierte > 0.1 && <mesh position={[0.07, 0.5 + TH + 0.08, 0]}><cylinderGeometry args={[0.007, 0.007, 0.12, 8]} />{AGUA(0.9, AZUL)}</mesh>}
      <mesh position={[0, 0.006, 0]} rotation={[-P2, 0, 0]} scale={0.001 + 0.7 * boom}><circleGeometry args={[1, 40]} />{AGUA(0.55, "#5d8fb0")}</mesh>
      {boom > 0 && boom < 1 && Array.from({ length: 30 }, (_, i) => { const a = rn(i, 2) * 2 * P, sp = 0.4 + 0.5 * rn(i, 3);
        return <mesh key={"w" + i} position={[Math.cos(a) * boom * sp, 0.25 + boom * (0.35 * rn(i, 4)) - boom * boom * 0.5, Math.sin(a) * boom * sp]} scale={0.025 * (1 - boom)}><sphereGeometry args={[1, 10, 8]} />{AGUA(0.9, "#9fd4f4")}</mesh>; })}
      <Halo p={[0, 0.3, 0.35]} r={0.9 * boom + 0.001} c="#ffffff" o={0.8 * (1 - boom)} />
      <Halo p={[0.05, 0.5 + TH, 0.1]} r={0.2 * vierte} c="#7cc4f0" o={0.6} />
    </group>
  </Estudio>;
}}</Stage>;

// 7 · DESDE DÓNDE SE MIDE: tinaco en rayos X sobre su base; tres puntos de arranque parpadean: el piso de la azotea (rojo, se apaga), la base (rojo, se apaga)
// y el nivel del agua (verde, se queda); desde ahí baja la cinta métrica amarilla hasta abajo
const metroTex = () => ctex("p4h:metro", 64, 1024, (g) => { g.fillStyle = "#f2c230"; g.fillRect(0, 0, 64, 1024); g.fillStyle = "#1a1a1a";
  for (let c = 0; c <= 100; c++) { const y = 10 + c * 10; g.fillRect(0, y, c % 10 ? (c % 5 ? 12 : 20) : 34, 2); } });
const HCinta: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const p1 = cl(1 - Math.abs(tt - 0.7) / 0.4), p2 = cl(1 - Math.abs(tt - 1.5) / 0.4), ok = eio(tt, 2.0, 2.4), baja = eio(tt, 2.4, 3.8);
  const ROOF = 0.7, B = ROOF + 0.18, WL = B + 0.03 + 0.56 * 0.7, X = 0.38;
  return <Estudio t={tt} cam={[0.2, 0.62, 2.3]} look={[0.05, 0.6, 0]} orbit={0.01} mesa={false} fit={false}>
    <Cielo z={-1.3} dim={0.65} />
    <mesh position={[-0.2, ROOF / 2, -0.2]}><boxGeometry args={[1.6, ROOF, 0.8]} /><meshStandardMaterial color="#d8c9ac" roughness={0.9} /></mesh>
    <mesh position={[-0.2, ROOF + 0.02, -0.2]}><boxGeometry args={[1.7, 0.04, 0.9]} /><meshStandardMaterial map={losaTex()} roughness={0.9} /></mesh>
    <Losa y={0} dim={0.6} />
    <RBox s={[0.5, 0.18, 0.5]} r={0.01} p={[0, ROOF + 0.09, -0.2]}><meshStandardMaterial color="#9a958d" roughness={0.95} /></RBox>
    <Tinaco p={[0, B, -0.2]} r={0.24} hh={0.62} x={0.85} nivel={0.7} />
    {[[ROOF + 0.04, p1, RED], [B, p2, RED], [WL, ok, VER]].map(([y, o, c], i) => (o as number) > 0.01 && <group key={i}>
      <mesh position={[X - 0.12, y as number, -0.2]}><boxGeometry args={[0.28, 0.012, 0.012]} />{GLOW(c as string, o as number)}</mesh>
      <Halo p={[X, y as number, -0.15]} r={0.12} c={c as string} o={o as number} /></group>)}
    {baja > 0.01 && <mesh position={[X, WL - (WL - 0.02) * baja / 2, -0.15]}><boxGeometry args={[0.05, (WL - 0.02) * baja, 0.004]} /><meshStandardMaterial map={metroTex()} roughness={0.5} /></mesh>}
    {baja > 0.01 && <mesh position={[X, WL - (WL - 0.02) * baja, -0.15]}><boxGeometry args={[0.1, 0.03, 0.03]} /><meshStandardMaterial color="#2b2f36" /></mesh>}
  </Estudio>;
}}</Stage>;

// 8 · SE PURGA SOLA: un tramo vertical de tubo transparente lleno de agua; desde abajo entra una burbuja, sube bamboleándose y al llegar
// a la superficie del tinaco revienta con un anillo; después otra, más chica, hace lo mismo
// 8 · SE PURGA SOLA (v3): tubería de vidrio en diagonal que sube desde la losa hasta un tinaco transparente; una burbuja GRANDE entra abajo,
// sube por la diagonal bamboleándose, entra al tinaco, cruza el agua y revienta en la superficie con anillo y salpicaduras. Cámara fija con todo en cuadro
const HPurga: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#0f151c">{(tt) => {
  const A: V3 = [-0.78, 0.08, 0], B: V3 = [0.2, 0.52, 0], TX = 0.42, TB = 0.42, WL = TB + 0.03 + 0.46 * 0.78;
  const b1 = cl((tt - 0.5) / 2.0), b2 = cl((tt - 2.0) / 1.7);
  const bp = (k: number): V3 => k < 0.7 ? [lerp(A[0], B[0], k / 0.7), lerp(A[1], B[1], k / 0.7) + 0.008 * Math.sin(k * 50), 0] : [lerp(B[0] + 0.05, TX, (k - 0.7) / 0.3), lerp(B[1], WL - 0.02, (k - 0.7) / 0.3), 0];
  const pop = (i: number) => cl((tt - (i ? 3.7 : 2.5)) / 0.6);
  return <Estudio t={tt} cam={[-0.12, 0.5, 1.85]} look={[-0.12, 0.47, 0]} orbit={0.01} mesa={false} fit={false}>
    <Cielo z={-1.2} dim={0.55} />
    <Losa y={0} dim={0.6} />
    <group scale={cl(IN(tt, 0.3)) + 0.0001}>
      <RBox s={[0.5, TB, 0.5]} r={0.01} p={[TX, TB / 2, -0.05]}><meshStandardMaterial map={losaTex()} color="#b3ada3" roughness={0.95} /></RBox>
      <Tinaco p={[TX, TB, -0.05]} r={0.23} hh={0.46} x={0.92} nivel={0.78} />
      <mesh position={[A[0], 0.04, 0]}><boxGeometry args={[0.12, 0.08, 0.12]} /><meshStandardMaterial color="#9a958d" /></mesh>
      <Caño a={A} b={B} r={0.045} vidrio />
      <Caño a={A} b={B} r={0.037} c="#3f9ee0" />
      <Caño a={B} b={[TX - 0.2, B[1], 0]} r={0.045} vidrio />
      {[[b1, 0.04], [b2, 0.03]].map(([k, r], i) => <group key={i}>
        {k > 0 && k < 1 && <Burbuja p={bp(k)} r={r * (1 + 0.1 * Math.sin(tt * 18))} o={0.95} />}
        {k > 0 && k < 1 && <Halo p={[bp(k)[0], bp(k)[1], 0.08]} r={0.14} c="#ffffff" o={0.55} />}
        <Anillo p={[TX, WL + 0.003, -0.05]} r={0.05 + 0.18 * pop(i)} o={k >= 1 ? 0.9 * (1 - pop(i)) : 0} />
        {k >= 1 && pop(i) < 0.6 && Array.from({ length: 10 }, (_, j) => { const q = pop(i) / 0.6, a = j / 10 * 2 * P; return <mesh key={j} position={[TX + Math.cos(a) * 0.09 * q, WL + 0.1 * Math.sin(q * P), -0.05 + Math.sin(a) * 0.09 * q]} scale={0.013}><sphereGeometry args={[1, 6, 4]} />{AGUA(0.9, "#cfeaf8")}</mesh>; })}
      </group>)}
      <Halo p={[TX, WL + 0.05, 0.12]} r={0.3 * eio(tt, 3.9, 4.3)} c={VER} o={0.5} />
    </group>
    <Sombra p={[TX, 0.003, -0.05]} r={0.4} />
  </Estudio>;
}}</Stage>;

// 9 · LA JOROBA JUNTA EL AIRE: un tubo transparente que baja, sube por encima de un escalón y vuelve a bajar; burbujitas viajan con el agua
// y se van juntando en la joroba hasta formar una burbuja grande que estrecha el paso del agua
const JOR: V3[] = [[-1.0, 0.5, 0], [-0.4, 0.5, 0], [-0.4, 0.14, 0], [-0.15, 0.14, 0], [-0.15, 0.36, 0], [0.25, 0.36, 0], [0.25, 0.0, 0], [0.8, 0.0, 0]];
const HJoroba: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#0f151c">{(tt) => {
  const cp = curva("jor", JOR), big = eio(tt, 0.6, 3.4), stuck = Math.round(big * 12);
  return <Estudio t={tt} cam={[-0.05, 0.3, 1.75]} look={[-0.05, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#111820" />
    <RBox s={[0.34, 0.26, 0.4]} r={0.01} p={[0.05, 0.13 - 0.02, -0.05]}><meshStandardMaterial color="#8e8a84" roughness={0.95} /></RBox>
    <Ruta k="jor" pts={JOR} r={0.045} vidrio />
    {Array.from({ length: 34 }, (_, i) => { const u = (i / 34 + tt * 0.11) % 1, q = enCurva(cp, u), nearH = Math.abs(q[0] - 0.05) < 0.22 && q[1] > 0.3;
      return <mesh key={i} position={[q[0], q[1] - (nearH ? 0.012 * big : 0), q[2]]} scale={nearH ? 0.012 * (1 - 0.5 * big) : 0.016}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#5fb0e8" emissive="#1d5f99" emissiveIntensity={0.4} /></mesh>; })}
    {Array.from({ length: 12 }, (_, i) => { if (i < stuck) return null; const u = cl(((tt * 0.35 + i / 12) % 1) * 0.62); const q = enCurva(cp, u); return u < 0.6 && <Burbuja key={"b" + i} p={[q[0], q[1] + 0.02, q[2]]} r={0.012} />; })}
    <mesh position={[0.05, 0.36 + 0.02, 0]} scale={[0.04 + 0.16 * big, 0.022 + 0.012 * big, 0.034]}><sphereGeometry args={[1, 24, 16]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.8} roughness={0} clearcoat={1} /></mesh>
    <Halo p={[0.05, 0.4, 0.06]} r={0.25 * big} c="#ffffff" o={0.35} />
  </Estudio>;
}}</Stage>;

// 10 · EL JARRO SACA EL AIRE: primer plano de la joroba con su burbuja grande; del punto alto crece un tubo vertical abierto (el jarro);
// la burbuja se escapa hacia arriba en burbujitas por el jarro y sale como soplos por la punta; el agua vuelve a llenar la joroba
const HJarro: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#0f151c">{(tt) => {
  const crece = eio(tt, 0.3, 1.2), sale = eio(tt, 1.3, 3.6), TOPJ = 1.05;
  return <Estudio t={tt} cam={[0.0, 0.55, 1.75]} look={[0, 0.55, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#121a22" />
    <Ruta k="jar" pts={[[-0.8, 0.0, 0], [-0.3, 0.0, 0], [-0.3, 0.2, 0], [0.3, 0.2, 0], [0.3, 0.0, 0], [0.8, 0.0, 0]]} r={0.05} vidrio />
    <mesh position={[0, 0.2, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.042, 0.042, 0.6, 24]} />{AGUA(0.6, AZUL)}</mesh>
    <mesh position={[0, 0.23, 0]} scale={[0.2 * (1 - sale) + 0.001, 0.035 * (1 - sale) + 0.001, 0.04]}><sphereGeometry args={[1, 24, 16]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.85} roughness={0} clearcoat={1} /></mesh>
    <mesh position={[0, 0.2 + (TOPJ - 0.2) * crece / 2, 0]}><cylinderGeometry args={[0.035, 0.035, (TOPJ - 0.2) * crece + 0.001, 24, 1, true]} />{VIDRIO(0.35)}</mesh>
    {crece > 0.98 && <mesh position={[0, TOPJ, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.035, 0.006, 8, 24]} />{PVCM()}</mesh>}
    {sale > 0.01 && Array.from({ length: 14 }, (_, i) => { const q = ((tt - 1.3) * 0.7 + i / 14) % 1; return sale < 0.995 && <Burbuja key={i} p={[0.006 * Math.sin(q * 20 + i), lerp(0.24, TOPJ, q), 0]} r={0.016 * (1 - sale * 0.5)} />; })}
    {sale > 0.01 && sale < 0.99 && [0, 1, 2].map((j) => { const q = ((tt - 1.3) * 1.2 + j / 3) % 1; return <Anillo key={j} p={[0, TOPJ + 0.02 + q * 0.18, 0]} r={0.04 + 0.12 * q} o={0.7 * (1 - q)} rot={[-P2, 0, 0]} />; })}
    <Halo p={[0, TOPJ + 0.05, 0.05]} r={0.25 * sale} c="#ffffff" o={0.4} />
  </Estudio>;
}}</Stage>;

// 11 · VASOS COMUNICANTES: el tinaco en rayos X y el jarro unidos por abajo; el agua queda al MISMO nivel en los dos (línea azul que los une);
// después el jarro se acorta por debajo del nivel del tinaco y el agua brota por su punta como un surtidor
const HVasos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#10161e">{(tt) => {
  const llena = eio(tt, 0.3, 1.6), lin = eio(tt, 1.6, 2.1), baja = eio(tt, 2.3, 2.9), brota = cl((tt - 2.9) / 1.1), WL = 0.3 + 0.5 * llena;
  const topJ = lerp(1.1, 0.6, baja), wJ = Math.min(WL, topJ);
  return <Estudio t={tt} cam={[0.15, 0.6, 2.05]} look={[0.15, 0.55, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#111820" />
    <Losa y={0} dim={0.35} />
    <Tinaco p={[-0.25, 0.25, 0]} r={0.3} hh={0.7} x={0.85} nivel={(WL - 0.28) / 0.64} />
    <RBox s={[0.7, 0.25, 0.7]} r={0.01} p={[-0.25, 0.125, 0]}><meshStandardMaterial color="#8e8a84" roughness={0.9} /></RBox>
    <Caño a={[0.05, 0.3, 0]} b={[0.6, 0.3, 0]} r={0.035} vidrio />
    <mesh position={[0.6, 0.3 + (topJ - 0.3) / 2, 0]}><cylinderGeometry args={[0.035, 0.035, topJ - 0.3, 24, 1, true]} />{VIDRIO(0.35)}</mesh>
    <mesh position={[0.32, 0.3, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.028, 0.028, 0.56, 16]} />{AGUA(0.8, AZUL)}</mesh>
    <mesh position={[0.6, 0.3 + (wJ - 0.3) / 2, 0]}><cylinderGeometry args={[0.028, 0.028, Math.max(0.001, wJ - 0.3), 16]} />{AGUA(0.85, AZUL)}</mesh>
    {lin > 0.01 && baja < 0.5 && <mesh position={[0.18, WL, 0.32]} scale={[lin, 1, 1]}><boxGeometry args={[1.0, 0.01, 0.01]} />{GLOW("#7cc4f0")}</mesh>}
    {brota > 0 && Array.from({ length: 26 }, (_, i) => { const q = (tt * 1.3 + i / 26) % 1, a = rn(i, 1) * 2 * P, sp = 0.15 + 0.1 * rn(i, 2);
      return <mesh key={i} position={[0.6 + Math.cos(a) * sp * q, topJ + 0.28 * q - 0.6 * q * q, Math.sin(a) * sp * q]} scale={0.012 * brota}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.9, "#9fd4f4")}</mesh>; })}
    {brota > 0 && <Halo p={[0.6, topJ + 0.08, 0.05]} r={0.3} c={RED} o={0.6 * brota} />}
  </Estudio>;
}}</Stage>;

// 12 · EL BASTÓN: tres remates de jarro lado a lado; el abierto recto recibe hojitas y tierra que caen adentro; el tapado atrapa el aire (burbuja roja abajo);
// el bastón con la punta hacia abajo: la lluvia resbala por la curva y el aire sale en soplos
const HBaston: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const s = [eio(tt, 0.3, 0.9), eio(tt, 1.3, 1.9), eio(tt, 2.3, 2.9)], Y = 0.62;
  return <Estudio t={tt} cam={[0.0, 0.62, 1.9]} look={[0, 0.55, 0]} orbit={0.01} mesa={false} fit={false}>
    <Cielo z={-1.0} dim={0.55} />
    <Losa y={0} dim={0.6} />
    {[-0.55, 0, 0.55].map((x, i) => <group key={i} position={[x, 0, 0]} scale={IN(tt, 0.05 + i * 0.1) + 0.0001}>
      <Caño a={[0, 0, 0]} b={[0, Y, 0]} r={0.035} />
      <Sombra p={[0, 0.003, 0]} r={0.12} />
      {i === 1 && <mesh position={[0, Y + 0.02, 0]}><cylinderGeometry args={[0.045, 0.045, 0.04, 24]} /><meshStandardMaterial color="#c0392b" roughness={0.4} /></mesh>}
      {i === 2 && <><mesh position={[0.07, Y, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.07, 0.035, 14, 28, P]} />{PVCM()}</mesh><Caño a={[0.14, Y, 0]} b={[0.14, Y - 0.1, 0]} r={0.035} /></>}
    </group>)}
    {s[0] > 0.01 && Array.from({ length: 6 }, (_, j) => { const q = cl((tt - 0.3 - j * 0.12) / 0.6); return q > 0 && <mesh key={j} position={[-0.55 + 0.1 * (rn(j, 1) - 0.5) * (1 - q), lerp(1.15, Y - 0.08, q * q), 0]} rotation={[q * 5, j, q * 3]} scale={[0.03, 0.004, 0.02]}><boxGeometry /><meshStandardMaterial color={j % 2 ? "#6b4a2e" : "#7c8a3a"} /></mesh>; })}
    {s[0] > 0.5 && <Halo p={[-0.55, Y + 0.1, 0.05]} r={0.16} c={RED} o={0.6} />}
    {s[1] > 0.01 && <><mesh position={[0, Y - 0.06, 0.0]} scale={[0.028, 0.04 * s[1], 0.028]}><sphereGeometry args={[1, 16, 12]} /><meshBasicMaterial color={RED} transparent opacity={0.6} /></mesh><Halo p={[0, Y + 0.1, 0.05]} r={0.16} c={RED} o={0.6 * s[1]} /></>}
    {s[2] > 0.01 && Array.from({ length: 8 }, (_, j) => { const q = ((tt - 2.3) * 0.9 + j / 8) % 1, onC = q < 0.5; const x = 0.55 + (onC ? 0.03 + 0.12 * (q / 0.5) : 0.17), y = onC ? Y + 0.25 - 0.18 * (q / 0.5) : Y + 0.07 - 0.9 * (q - 0.5);
      return <mesh key={j} position={[x, y, 0.04]} scale={[0.008, 0.016, 0.008]}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.85, "#bfe3f5")}</mesh>; })}
    {s[2] > 0.01 && [0, 1].map((j) => { const q = ((tt - 2.3) * 1.1 + j / 2) % 1; return <Anillo key={"a" + j} p={[0.69, Y - 0.12 - q * 0.12, 0]} r={0.03 + 0.07 * q} o={0.6 * (1 - q) * s[2]} />; })}
    {s[2] > 0.5 && <Halo p={[0.6, Y + 0.12, 0.05]} r={0.2} c={VER} o={0.7} />}
  </Estudio>;
}}</Stage>;

// 13 · UN CODO = 40 CM DE TUBO: un codo blanco de media pulgada gira al frente; se «desenrolla» en un tubo recto que crece sobre una regla hasta 40 cm,
// mientras el contador de rodillos sube a 40
const HCodo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#13171c">{(tt) => {
  const gira = eio(tt, 0.1, 1.0), des = eio(tt, 1.1, 3.2), L = 1.2 * des;
  return <Estudio t={tt} cam={[0.0, 0.3, 1.8]} look={[0, 0.12, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#151a20" />
    <mesh position={[0, -0.12, 0]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[4, 3]} />{M.madera("#6b4a2e")}</mesh>
    <group position={[-0.62, 0.05, 0]} rotation={[0, gira * 2 * P, 0]} scale={(1 - des) * IN(tt, 0.05) + 0.0001}>
      <mesh rotation={[0, 0, 0]}><torusGeometry args={[0.1, 0.04, 18, 32, P2]} />{PVCM()}</mesh>
      <mesh position={[0.1, -0.04, 0]}><cylinderGeometry args={[0.05, 0.05, 0.08, 24]} />{PVCM()}</mesh>
      <mesh position={[-0.04, 0.1, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.05, 0.08, 24]} />{PVCM()}</mesh>
    </group>
    {des > 0.01 && <Caño a={[-0.62, 0.0, 0]} b={[-0.62 + L, 0.0, 0]} r={0.04} />}
    <mesh position={[0, -0.1, 0.12]}><boxGeometry args={[1.3, 0.01, 0.06]} /><meshBasicMaterial color="#f2c230" toneMapped={false} /></mesh>
    {Array.from({ length: 41 }, (_, i) => <mesh key={i} position={[-0.62 + i * 0.03, -0.094, 0.1 + (i % 10 ? 0 : 0.01)]}><boxGeometry args={[0.004, 0.003, i % 10 ? 0.02 : 0.05]} /><meshBasicMaterial color="#1a1a1a" /></mesh>)}
    {des > 0.98 && <Halo p={[0.58, 0.0, 0.05]} r={0.2} c={VER} o={0.8} />}
    <Tambores p={[0.1, 0.48, -0.1]} val={40 * des} n={2} s={0.75} />
    <Sombra p={[-0.62 + L / 2, -0.118, 0]} r={0.25} sx={Math.max(1, L * 3)} o={0.5} />
  </Estudio>;
}}</Stage>;

// 14 · DIEZ CODOS = CUATRO METROS: diez codos caen sobre la azotea en fila; cada uno se estira en su tramo de 40 cm y se suma a una tubería que se alarga
// hasta salirse de la fila; el contador marca los metros: 4
const HCuatro: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const k = (i: number) => eio(tt, 0.9 + i * 0.27, 0.9 + i * 0.27 + 0.25), m = Array.from({ length: 10 }, (_, i) => k(i)).reduce((s, v) => s + v, 0) * 0.4;
  return <Estudio t={tt} cam={[0.0, 1.1, 1.65]} look={[0, 0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Losa y={-0.05} dim={0.7} />
    {Array.from({ length: 10 }, (_, i) => { const x = -0.9 + i * 0.2, y = lerp(0.7, 0, cl(IN(tt, 0.05 + i * 0.06))), e = k(i);
      return <group key={i}>
        {e < 1 && <group position={[x, y + 0.0, 0.25]} rotation={[0, i, 0]} scale={1 - e + 0.0001}><mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.05, 0.022, 12, 24, P2]} />{PVCM()}</mesh></group>}
        {e > 0.01 && <Caño a={[x - 0.1, 0.0, -0.12]} b={[x - 0.1 + 0.2 * e, 0.0, -0.12]} r={0.022} />}
      </group>; })}
    <Halo p={[-1.0 + m * 0.5, 0.02, -0.08]} r={0.12} c={RED} o={m > 0.01 && m < 3.99 ? 0.8 : 0} />
    <Tambores p={[0, 0.42, -0.25]} rot={[-0.4, 0, 0]} val={m} n={1} s={0.8} sufijo="m" />
  </Estudio>;
}}</Stage>;

// 15 · CERRADA, TODOS IGUAL: los tres caminos (directo, con joroba, con codos) bajan del mismo nivel a tres manómetros; con la llave cerrada
// las tres agujas marcan exactamente lo mismo (verde); al abrir, el agua corre y las de la joroba y los codos se caen
const HQuieto: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#10161e">{(tt) => {
  const sube = eio(tt, 0.3, 1.4), igual = eio(tt, 1.4, 1.8), abre = eio(tt, 2.5, 3.3), base = 0.25 * sube;
  const vs = [base - 0.02 * abre, base - 0.08 * abre, base - 0.12 * abre];
  const rutas: V3[][] = [[[-0.6, 0.85, 0], [-0.6, 0.3, 0]], [[0, 0.85, 0], [0, 0.6, 0], [0.12, 0.6, 0], [0.12, 0.72, 0], [0.22, 0.72, 0], [0.22, 0.45, 0], [0, 0.45, 0], [0, 0.3, 0]],
    [[0.6, 0.85, 0], [0.6, 0.75, 0], [0.7, 0.75, 0], [0.7, 0.65, 0], [0.6, 0.65, 0], [0.6, 0.55, 0], [0.7, 0.55, 0], [0.7, 0.45, 0], [0.6, 0.45, 0], [0.6, 0.3, 0]]];
  return <Estudio t={tt} cam={[0.0, 0.55, 2.1]} look={[0.05, 0.5, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#111820" />
    <mesh position={[0.05, 0.9, -0.1]}><boxGeometry args={[1.7, 0.1, 0.2]} /><meshStandardMaterial color="#1d1f22" roughness={0.6} /></mesh>
    <mesh position={[0.05, 0.93, 0.0]}><boxGeometry args={[1.66, 0.04, 0.02]} />{AGUA(0.8, AZUL)}</mesh>
    {rutas.map((r, i) => <group key={i}>
      <Ruta k={"q" + i} pts={r} r={0.022} />
      {abre > 0.01 && Array.from({ length: 10 }, (_, j) => { const cp = curva("q" + i, r), q = enCurva(cp, ((tt - 2.5) * (0.5 - i * 0.12) + j / 10) % 1); return <mesh key={j} position={[q[0], q[1], q[2] + 0.025]} scale={0.012}><sphereGeometry args={[1, 6, 4]} />{GLOW("#9fd4ff", 0.9)}</mesh>; })}
      <Manometro p={[r[r.length - 1][0], 0.14, 0.02]} s={1.15} v={vs[i]} max={0.4} />
      <Halo p={[r[r.length - 1][0], 0.14, 0.1]} r={0.22 * igual * (1 - abre)} c={VER} o={0.7} />
      {i > 0 && <Halo p={[r[r.length - 1][0], 0.14, 0.1]} r={0.22 * abre} c={RED} o={0.5 * i} />}
    </group>)}
  </Estudio>;
}}</Stage>;

// 16 · CINCO VECES MENOS: los dos tubos vistos de punta, el delgado de media y el grueso de una pulgada; dentro del delgado el agua se frota contra la pared
// (chispas rojas de fricción), en el grueso corre tranquila; abajo, la barra de pérdida del grueso se encoge a la quinta parte
const HCinco: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#12161b">{(tt) => {
  const run = eio(tt, 0.3, 0.8), bar = eio(tt, 1.6, 3.4);
  const tubo = (x: number, R: number, chisp: boolean) => <group position={[x, 0.32, 0]} scale={IN(tt, 0.05) + 0.0001}>
    <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[R + 0.03, R + 0.03, 0.5, 48, 1, true]} />{PVCM()}</mesh>
    <mesh position={[0, 0, 0.25]}><ringGeometry args={[R, R + 0.03, 48]} />{PVCM()}</mesh>
    <mesh position={[0, 0, -0.1]}><circleGeometry args={[R, 48]} />{AGUA(0.7, AZUL)}</mesh>
    {Array.from({ length: chisp ? 22 : 30 }, (_, i) => { const a = rn(i, 1) * 2 * P, rr = R * (chisp ? 0.6 + 0.35 * rn(i, 2) : 0.8 * Math.sqrt(rn(i, 2))), z = ((tt * (chisp ? 0.6 : 1.4) + rn(i, 3)) % 1) * 0.4 - 0.1;
      return <mesh key={i} position={[Math.cos(a + (chisp ? tt * 4 : 0)) * rr, Math.sin(a + (chisp ? tt * 4 : 0)) * rr, z]} scale={0.012 * run}><sphereGeometry args={[1, 6, 4]} />{GLOW(chisp && rr > R * 0.8 ? "#ff6a4a" : "#bfe3f5", 0.9)}</mesh>; })}
    {chisp && <Halo p={[0, 0, 0.27]} r={(R + 0.06) * run} c="#ff6a4a" o={0.35 + 0.15 * Math.sin(tt * 10)} />}
  </group>;
  return <Estudio t={tt} cam={[0.0, 0.25, 1.55]} look={[0, 0.18, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#14191f" />
    {tubo(-0.38, 0.08, true)}{tubo(0.38, 0.17, false)}
    {[[-0.38, 1], [0.38, lerp(1, 0.2, bar)]].map(([x, k], i) => <group key={i} position={[x, -0.28, 0.1]}>
      <mesh position={[0, 0, -0.01]}><boxGeometry args={[0.5, 0.06, 0.02]} /><meshStandardMaterial color="#2a2f36" /></mesh>
      <mesh position={[-0.25 + 0.25 * k * run, 0, 0]}><boxGeometry args={[0.5 * k * run + 0.001, 0.05, 0.03]} />{GLOW(i ? VER : RED, 0.9)}</mesh>
    </group>)}
  </Estudio>;
}}</Stage>;

// 17 · LA AVENIDA: vista de arriba; a la izquierda una sola calle angosta donde los coches (luces rojas) se amontonan; a la derecha una avenida ancha
// que después se reparte en cuatro calles y todos fluyen
// 17 · LA AVENIDA (v3): maqueta de ciudad en perspectiva, con edificios; a la izquierda todos salen por UNA calle angosta y los autos se frenan en fila
// con las luces de freno encendidas (rojo); a la derecha una avenida ancha de cuatro carriles que se abre en calles y los autos fluyen rápido (verde)
const asfalto = () => ctex("p4h:asf", 128, 512, (g) => { g.fillStyle = "#2c2e31"; g.fillRect(0, 0, 128, 512); for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(255,255,255,${0.03 + rn(i, 1) * 0.04})`; g.fillRect(rn(i, 2) * 128, rn(i, 3) * 512, 2, 2); } });
const HAvenida: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#14171b">{(tt) => {
  const run = cl(IN(tt, 0.3)), flu = eio(tt, 0.6, 1.2), CC = ["#d6362c", "#3f74c9", "#e8e4d8", "#f2c230", "#3cc46a"];
  const Auto = ({ p, c, freno }: { p: V3; c: string; freno: number }) => <group position={p}>
    <RBox s={[0.07, 0.035, 0.11]} r={0.01} p={[0, 0.02, 0]}><meshStandardMaterial color={c} roughness={0.35} metalness={0.3} /></RBox>
    <RBox s={[0.06, 0.03, 0.06]} r={0.01} p={[0, 0.05, 0.005]}><meshStandardMaterial color="#1c2733" roughness={0.1} /></RBox>
    {[-0.022, 0.022].map((x, j) => <mesh key={j} position={[x, 0.025, 0.056]}><boxGeometry args={[0.016, 0.01, 0.004]} />{GLOW(RED, 0.3 + 0.7 * freno)}</mesh>)}
  </group>;
  return <Estudio t={tt} cam={[0.0, 1.35, 1.25]} look={[0, 0.0, -0.1]} orbit={0.01} mesa={false} fit={false}>
    <mesh rotation={[-P2, 0, 0]} position={[0, -0.01, 0]}><planeGeometry args={[5, 4]} /><meshStandardMaterial color="#4a5a3a" roughness={1} /></mesh>
    <group scale={run + 0.0001}>
      <mesh rotation={[-P2, 0, 0]} position={[-0.5, 0, -0.05]}><planeGeometry args={[0.12, 1.7]} /><meshStandardMaterial map={asfalto()} /></mesh>
      <mesh rotation={[-P2, 0, 0]} position={[0.42, 0, 0.25]}><planeGeometry args={[0.46, 1.1]} /><meshStandardMaterial map={asfalto()} /></mesh>
      {[-0.115, 0, 0.115].map((dx, j) => Array.from({ length: 8 }, (_, k) => <mesh key={j + "_" + k} rotation={[-P2, 0, 0]} position={[0.42 + dx, 0.002, -0.25 + k * 0.13]}><planeGeometry args={[0.008, 0.06]} /><meshBasicMaterial color={j === 1 ? "#f2c230" : "#ffffff"} /></mesh>))}
      {[-0.3, -0.1, 0.1, 0.3].map((dx, j) => <mesh key={j} rotation={[-P2, 0, Math.atan2(dx, 0.6)]} position={[0.42 + dx * 0.5, 0.001, -0.6]}><planeGeometry args={[0.1, 0.72]} /><meshStandardMaterial map={asfalto()} /></mesh>)}
      {Array.from({ length: 22 }, (_, i) => { const xs = [-0.92, -0.75, -0.25, 0.0, 0.85, 1.0][i % 6], z = -0.75 + Math.floor(i / 6) * 0.42 + 0.1 * rn(i, 1), hgt = 0.1 + 0.3 * rn(i, 2);
        return <RBox key={"e" + i} s={[0.13, hgt, 0.15]} r={0.008} p={[xs, hgt / 2, z]}><meshStandardMaterial color={["#c9bfae", "#a8a39b", "#d8c9ac", "#8f9aa6"][i % 4]} roughness={0.85} /></RBox>; })}
      {Array.from({ length: 12 }, (_, i) => { const z = 0.72 - i * 0.125 - 0.004 * Math.sin(tt * 2 + i) ; return <Auto key={i} p={[-0.5, 0, z]} c={CC[i % 5]} freno={0.5 + 0.5 * Math.sin(tt * 7 + i)} />; })}
      {Array.from({ length: 24 }, (_, i) => { const q = (tt * 0.32 * flu + i / 24) % 1, lane = i % 4, dx = [-0.17, -0.057, 0.057, 0.17][lane];
        const z = lerp(0.8, -0.95, q), sp = cl((-0.3 - z) / 0.65), x = 0.42 + dx + dx * 1.6 * sp;
        return <Auto key={"c" + i} p={[x, 0, z]} c={CC[i % 5]} freno={0} />; })}
      <Halo p={[-0.5, 0.08, 0.2]} r={0.4} c={RED} o={0.4 * eio(tt, 1.0, 1.5)} />
      <Halo p={[0.42, 0.08, -0.4]} r={0.55} c={VER} o={0.32 * eio(tt, 1.6, 2.1)} />
    </group>
  </Estudio>;
}}</Stage>;

// 18 · LA LOSA TIENE QUE AGUANTAR: el tinaco lleno baja sobre una losa apoyada en dos muros; la losa se flexiona con el peso mientras el contador
// sube a 1.100 kilos; unos blocks sueltos al costado tiemblan y se ladean
const HLosa: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const baja = eio(tt, 0.3, 1.4), peso = eio(tt, 1.2, 3.2), N = 12, flex = 0.06 * peso;
  return <Estudio t={tt} cam={[0.0, 0.62, 2.2]} look={[0, 0.5, 0]} orbit={0.01} mesa={false} fit={false}>
    <Cielo z={-1.2} dim={0.55} />
    <Losa y={0} dim={0.55} />
    {[-0.6, 0.6].map((x, i) => <RBox key={i} s={[0.12, 0.5, 0.5]} r={0.01} p={[x, 0.25, 0]}><meshStandardMaterial color="#d8c9ac" roughness={0.9} /></RBox>)}
    {Array.from({ length: N }, (_, i) => { const u = (i + 0.5) / N, x = lerp(-0.66, 0.66, u), y = 0.52 - flex * Math.sin(u * P);
      return <mesh key={i} position={[x, y, 0]} rotation={[0, 0, -flex * P * Math.cos(u * P) * 0.9]}><boxGeometry args={[1.32 / N + 0.004, 0.05, 0.5]} /><meshStandardMaterial color={col("#9a958d", "#b8604a", peso * Math.sin(u * P))} roughness={0.9} /></mesh>; })}
    <Tinaco p={[0, lerp(1.6, 0.545 - flex, baja), 0]} r={0.26} hh={0.62} />
    {[0, 1, 2].map((i) => <mesh key={i} position={[0.95, 0.08 + i * 0.15, 0.1]} rotation={[0, 0, 0.12 * peso * Math.sin(tt * 18 + i) * (i + 1) * 0.5]} castShadow><boxGeometry args={[0.24, 0.14, 0.14]} /><meshStandardMaterial color="#a8a39b" roughness={0.95} /></mesh>)}
    <Tambores p={[-0.95, 0.95, 0]} val={1100 * peso} n={4} s={0.42} />
    <Sombra p={[0, 0.003, 0]} r={0.6} sx={1.3} />
  </Estudio>;
}}</Stage>;

// 19 · LA LLAVE A MEDIO ABRIR: llave de compuerta en corte con su volante rojo; la compuerta está bajada a la mitad y el agua pasa apretada;
// el volante gira, la compuerta sube y el chorro de partículas se ensancha y acelera
const HCompuerta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#10161e">{(tt) => {
  const ab = eio(tt, 1.4, 3.2), gate = lerp(0.0, 0.16, ab), hueco = 0.07 + 0.09 * ab;
  return <Estudio t={tt} cam={[0.0, 0.3, 1.55]} look={[0, 0.2, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#111820" />
    <group scale={IN(tt, 0.05) + 0.0001}>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.09, 0.09, 1.4, 32, 1, true, 0, P]} /><meshStandardMaterial color="#b98a3e" metalness={0.7} roughness={0.35} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.02, 0]}><boxGeometry args={[0.26, 0.32, 0.2]} /><meshStandardMaterial color="#a77a34" metalness={0.6} roughness={0.4} transparent opacity={0.35} /></mesh>
      <mesh position={[0, 0.0, 0]}><boxGeometry args={[1.4, 0.16, 0.001]} />{AGUA(0.35, AZUL)}</mesh>
      <mesh position={[0, 0.08 - 0.08 + gate + 0.0, 0.0]}><boxGeometry args={[0.03, 0.16, 0.17]} />{M.hierro()}</mesh>
      <mesh position={[0, 0.25 + gate * 0.6, 0]}><cylinderGeometry args={[0.012, 0.012, 0.3, 12]} />{M.cromo()}</mesh>
      <group position={[0, 0.42 + gate * 0.4, 0]} rotation={[0, ab * 6 * P, 0]}>
        <mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.11, 0.016, 10, 40]} /><meshStandardMaterial color="#c0392b" roughness={0.4} /></mesh>
        {[0, 1, 2].map((i) => <mesh key={i} rotation={[0, i * P / 3, 0]}><boxGeometry args={[0.22, 0.014, 0.014]} /><meshStandardMaterial color="#c0392b" /></mesh>)}
      </group>
      {Array.from({ length: 40 }, (_, i) => { const sp = 0.35 + 0.6 * ab, q = (tt * sp + rn(i, 1)) % 1, x = lerp(-0.7, 0.7, q), near = Math.abs(x) < 0.1;
        const yy = (rn(i, 2) - 0.5) * (near ? hueco * 0.9 : 0.15) + (near ? (0.08 - hueco / 2 - 0.0) * -0.0 + (gate - 0.16) * 0 - (0.16 - (0.16 - (0.16 - gate))) * 0 : 0);
        return <mesh key={i} position={[x, near ? -0.08 + hueco / 2 + (rn(i, 2) - 0.5) * hueco * 0.9 : yy, 0.0]} scale={0.011}><sphereGeometry args={[1, 6, 4]} />{GLOW("#bfe3f5", 0.9)}</mesh>; })}
    </group>
    <Manometro p={[0.55, 0.42, 0]} s={0.9} v={0.1 + 0.3 * ab} max={0.5} />
  </Estudio>;
}}</Stage>;

// 20 · LA BOMBA = 20 METROS DE ALTURA: una bomba azul con su motor; al arrancar, su rotor gira y desde ella crece una columna de vidrio altísima
// con un tinaco arriba que sube hasta 20 m (la casa de un piso queda chiquita al lado); el manómetro de la bomba marca 2
const HEdificio: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const on = eio(tt, 0.3, 0.8), sube = eio(tt, 0.8, 3.2), Hc = 0.1 + 1.2 * sube;
  return <Estudio t={tt} cam={[0.15, 0.68, 2.3]} look={[0.1, 0.62, 0]} orbit={0.01} mesa={false} fit={false}>
    <Cielo z={-1.3} dim={0.7} />
    <Losa y={0} dim={0.6} />
    <RBox s={[0.36, 0.18, 0.3]} r={0.01} p={[0.75, 0.09, 0]}><meshStandardMaterial color="#d8c9ac" roughness={0.9} /></RBox>
    <mesh position={[0.78, 0.24, 0]}><cylinderGeometry args={[0.05, 0.05, 0.1, 20]} /><meshStandardMaterial color="#1d1f22" /></mesh>
    <group position={[-0.35, 0, 0.1]} scale={IN(tt, 0.05) + 0.0001}>
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.26, 32]} /><meshStandardMaterial color="#2f6fe0" roughness={0.35} metalness={0.2} /></mesh>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-0.06 + i * 0.012, 0.12, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.103, 0.004, 4, 32]} /><meshStandardMaterial color="#1f4fa8" /></mesh>)}
      <group position={[0.16, 0.12, 0]} rotation={[tt * 30 * on, 0, 0]}>
        <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />{M.cromo()}</mesh>
        {[0, 1, 2, 3].map((i) => <mesh key={i} rotation={[i * P / 2, 0, 0]} position={[0.025, 0, 0]}><boxGeometry args={[0.01, 0.15, 0.02]} />{M.hierro()}</mesh>)}
      </group>
      <Caño a={[0.2, 0.12, 0]} b={[0.32, 0.12, 0]} r={0.025} />
      <mesh position={[0.32, 0.12 + Hc / 2, 0]}><cylinderGeometry args={[0.025, 0.025, Hc, 16, 1, true]} />{VIDRIO(0.35)}</mesh>
      <mesh position={[0.32, 0.12 + Hc / 2, 0]}><cylinderGeometry args={[0.019, 0.019, Hc, 12]} />{AGUA(0.85, AZUL)}</mesh>
      <Tinaco p={[0.32, 0.12 + Hc, 0]} s={0.4} r={0.24} hh={0.5} />
      <Manometro p={[-0.02, 0.36, 0.0]} s={0.75} v={2 * sube} max={2.5} />
    </group>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0.1, 0.12 + (i + 1) * 0.2, -0.05]} visible={sube * 6 > i + 0.5} scale={[1, 1, 1]}><boxGeometry args={[0.16, 0.006, 0.006]} /><meshBasicMaterial color="#f2c230" toneMapped={false} /></mesh>)}
    <Sombra p={[-0.35, 0.003, 0.1]} r={0.28} />
  </Estudio>;
}}</Stage>;

// 21 · EL JARRO SE VUELVE FUENTE: la bomba empuja el agua hacia la casa; el jarro puesto DESPUÉS de la bomba escupe un surtidor que moja la azotea (rojo);
// el jarro se desliza hasta ANTES de la bomba y el surtidor se apaga (verde)
// 21 · EL JARRO SE VUELVE FUENTE (v3): cámara baja y cerca; la bomba azul grande al centro, la flecha del agua va del tinaco (izquierda) a la casa (derecha);
// el jarro está DESPUÉS de la bomba y escupe un surtidor alto que moja la azotea (rojo); se desliza a ANTES de la bomba y el surtidor se apaga (verde)
const HFuente: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const f = eio(tt, 0.5, 1.0) * (1 - eio(tt, 2.3, 2.6)), mueve = eio(tt, 2.4, 3.3), ok = eio(tt, 3.3, 3.8), jx = lerp(0.4, -0.4, mueve), Y = 0.12, TOPJ = 0.62;
  return <Estudio t={tt} cam={[0.0, 0.42, 1.5]} look={[0, 0.36, 0]} orbit={0.01} mesa={false} fit={false}>
    <Cielo z={-1.2} dim={0.6} />
    <Losa y={0} dim={0.65} />
    <group scale={cl(IN(tt, 0.3)) + 0.0001}>
      <Caño a={[-0.85, Y, 0]} b={[0.85, Y, 0]} r={0.03} />
      <group>
        <mesh position={[0, Y + 0.02, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.14, 0.14, 0.3, 32]} /><meshStandardMaterial color="#2f6fe0" roughness={0.35} metalness={0.2} /></mesh>
        {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.11 + i * 0.022, Y + 0.02, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.143, 0.005, 4, 32]} /><meshStandardMaterial color="#1f4fa8" /></mesh>)}
        <group position={[0.17, Y + 0.02, 0]} rotation={[tt * 25, 0, 0]}><mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.1, 0.1, 0.03, 24]} />{M.cromo()}</mesh>
          {[0, 1, 2, 3].map((i) => <mesh key={i} rotation={[i * P / 2, 0, 0]} position={[0.02, 0, 0]}><boxGeometry args={[0.01, 0.18, 0.025]} />{M.hierro()}</mesh>)}</group>
        <RBox s={[0.34, 0.03, 0.22]} r={0.006} p={[0, 0.015, 0]}><meshStandardMaterial color="#3a3f45" /></RBox>
      </group>
      <Caño a={[jx, Y, 0]} b={[jx, TOPJ, 0]} r={0.025} />
      <mesh position={[jx + 0.05, TOPJ, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.05, 0.025, 10, 20, P]} />{PVCM()}</mesh>
      {f > 0.01 && Array.from({ length: 40 }, (_, i) => { const q = (tt * 1.3 + i / 40) % 1, a = rn(i, 1) * 2 * P, sp = 0.15 + 0.12 * rn(i, 2);
        return <mesh key={i} position={[jx + 0.1 + Math.cos(a) * sp * q, TOPJ + 0.2 * q - 0.75 * q * q, 0.05 + Math.sin(a) * sp * q * 0.6]} scale={0.02 * f}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.95, "#9fd4f4")}</mesh>; })}
      {f > 0.01 && <mesh position={[jx + 0.12, 0.004, 0.05]} rotation={[-P2, 0, 0]} scale={0.3 * f}><circleGeometry args={[1, 32]} />{AGUA(0.5, "#5d8fb0")}</mesh>}
      {[-0.65, -0.3, 0.3, 0.65].map((x, i) => <mesh key={i} position={[x, Y + 0.06, 0.04]} rotation={[0, 0, -P2]}><coneGeometry args={[0.025, 0.06, 12]} />{GLOW("#ffffff", 0.85)}</mesh>)}
      <Halo p={[jx, TOPJ + 0.05, 0.08]} r={0.3} c={RED} o={0.55 * f} />
      <Halo p={[jx, TOPJ, 0.08]} r={0.25} c={VER} o={0.7 * ok} />
    </group>
    <Sombra p={[0, 0.003, 0]} r={0.3} sx={1.4} />
  </Estudio>;
}}</Stage>;

// 22 · LOS CINCO ERRORES (items): una repisa de cinco nichos; con cada error cae a su nicho una maqueta (jarro tapado · jarro bajo que se desborda ·
// regadera de lluvia gigante con un hilito · tinaco sobre blocks que se ladea · bomba con surtidor) y un sello rojo en cruz la tacha
// 22 · LOS CINCO ERRORES (items, v3): cinco maquetas GRANDES en fila sobre la azotea desde el arranque, en gris apagado; con cada error la suya se enciende,
// hace su falla (tapa roja, desborde, hilito, tinaco que se ladea, surtidor) y le cae encima una cruz roja que no la tapa
const Error5: React.FC<{ i: number; tt: number; k: number }> = ({ i, tt, k }) => {
  if (i === 0) return <group><Caño a={[0, -0.12, 0]} b={[0, 0.12, 0]} r={0.03} /><mesh position={[0, 0.13 + 0.15 * (1 - k), 0]}><cylinderGeometry args={[0.042, 0.042, 0.035, 20]} /><meshStandardMaterial color="#c0392b" /></mesh></group>;
  if (i === 1) return <group><Tinaco p={[-0.06, -0.12, 0]} s={0.6} r={0.17} hh={0.38} /><Caño a={[0.09, -0.12, 0]} b={[0.09, 0.0, 0]} r={0.018} />
    {k > 0.05 && Array.from({ length: 8 }, (_, j) => { const q = (tt + j / 8) % 1; return <mesh key={j} position={[0.09 + 0.06 * q, 0.0 + 0.05 * q - 0.13 * q * q, 0]} scale={0.011}><sphereGeometry args={[1, 6, 4]} />{AGUA(0.9, "#9fd4f4")}</mesh>; })}</group>;
  if (i === 2) return <group><Caño a={[0, 0.12, 0]} b={[0, 0.2, 0]} r={0.012} c="#c9ced3" /><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.12, 0.07, 0.03, 32]} />{M.cromo()}</mesh>
    {k > 0.05 && Array.from({ length: 4 }, (_, j) => { const q = (tt * 1.5 + j / 4) % 1; return <mesh key={j} position={[0, 0.08 - q * 0.2, 0]} scale={[0.006, 0.014, 0.006]}><sphereGeometry args={[1, 6, 4]} />{AGUA(0.9, "#9fd4f4")}</mesh>; })}</group>;
  if (i === 3) return <group rotation={[0, 0, 0.18 * k * Math.sin(tt * 5)]}>{[0, 1].map((j) => <mesh key={j} position={[(j - 0.5) * 0.09, -0.1 + j * 0.05, 0]}><boxGeometry args={[0.08, 0.05, 0.07]} /><meshStandardMaterial color="#a8a39b" /></mesh>)}<Tinaco p={[0, -0.04, 0]} s={0.45} r={0.18} hh={0.36} /></group>;
  return <group><mesh position={[-0.04, -0.08, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.06, 0.06, 0.14, 20]} /><meshStandardMaterial color="#2f6fe0" /></mesh><Caño a={[0.06, -0.08, 0]} b={[0.06, 0.08, 0]} r={0.014} />
    {k > 0.05 && Array.from({ length: 10 }, (_, j) => { const q = (tt * 1.4 + j / 10) % 1, a = j * 0.8; return <mesh key={j} position={[0.06 + Math.cos(a) * 0.06 * q, 0.08 + 0.07 * q - 0.15 * q * q, Math.sin(a) * 0.06 * q]} scale={0.009}><sphereGeometry args={[1, 6, 4]} />{AGUA(0.9, "#9fd4f4")}</mesh>; })}</group>;
};
const HErrores: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const a = [0, 1, 2, 3, 4].map((i) => AT(h, i, 1.3));
  return <Estudio t={tt} cam={[0.0, 0.42, 1.75]} look={[0, 0.24, 0]} orbit={0.01} mesa={false} fit={false}>
    <Cielo z={-1.1} dim={0.55} />
    <Losa y={0} dim={0.6} />
    {[0, 1, 2, 3, 4].map((i) => { const x = -0.7 + i * 0.35, k = eio(tt, a[i], a[i] + 0.4), st = eio(tt, a[i] + 0.55, a[i] + 0.8);
      return <group key={i}>
        <group position={[x, 0.2 * 1.45, 0]} scale={1.45 * (cl(IN(tt, 0.3 + i * 0.08)) + 0.0001)}><Error5 i={i} tt={tt} k={k} /></group>
        <mesh position={[x, 0.004, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.15, 32]} /><meshBasicMaterial color={col("#3a3f45", "#c0392b", k)} transparent opacity={0.35 + 0.3 * k} depthWrite={false} /></mesh>
        <Sombra p={[x, 0.003, 0]} r={0.18} o={0.6} />
        {st > 0.01 && [1, -1].map((sd) => <mesh key={sd} position={[x, 0.66, 0.05]} rotation={[0, 0, sd * 0.78]} scale={[st, 1, 1]}><boxGeometry args={[0.16, 0.026, 0.01]} />{GLOW(RED, 0.95)}</mesh>)}
        {st > 0.01 && st < 1 && <Halo p={[x, 0.66, 0.07]} r={0.2} c={RED} o={1 - st} />}
        <Halo p={[x, 0.3, 0.12]} r={0.24 * k * (1 - st * 0.6)} c={RED} o={0.35} />
      </group>; })}
  </Estudio>;
}}</Stage>;

// 23 · EL REPASO EN LA BAJADA (items): el tinaco arriba y su bajada vertical gruesa; ocho abrazaderas a lo largo del tubo; con cada paso del resumen
// el agua baja un tramo más dentro del tubo de vidrio y su abrazadera se enciende dorada
const HRecap: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#10161e">{(tt) => {
  const a = Array.from({ length: 8 }, (_, i) => AT(h, i, 0.55, 0.5)), on = (i: number) => eio(tt, a[i], a[i] + 0.35), n = a.reduce((s, _, i) => s + on(i), 0);
  const TOP = 1.0, BOT = -0.35, y = (i: number) => lerp(TOP - 0.1, BOT + 0.05, (i + 0.5) / 8), wy = lerp(TOP, BOT, n / 8);
  return <Estudio t={tt} cam={[0.55, 0.38, 2.05]} look={[0.05, 0.32, 0]} orbit={0.01} mesa={false} fit={false}>
    <Cielo z={-1.1} dim={0.45} />
    <Tinaco p={[-0.35, TOP - 0.05, 0]} s={0.9} r={0.28} hh={0.5} />
    <Caño a={[-0.1, TOP + 0.02, 0]} b={[0.1, TOP + 0.02, 0]} r={0.035} />
    <mesh position={[0.1, (TOP + BOT) / 2, 0]}><cylinderGeometry args={[0.035, 0.035, TOP - BOT, 24, 1, true]} />{VIDRIO(0.35)}</mesh>
    <mesh position={[0.1, (TOP + wy) / 2, 0]}><cylinderGeometry args={[0.028, 0.028, Math.max(0.001, TOP - wy), 16]} />{AGUA(0.9, AZUL)}</mesh>
    <mesh position={[0.25, (TOP + BOT) / 2, -0.06]}><boxGeometry args={[0.02, TOP - BOT + 0.2, 0.3]} /><meshStandardMaterial color="#d8c9ac" roughness={0.9} /></mesh>
    {Array.from({ length: 8 }, (_, i) => <group key={i} position={[0.1, y(i), 0]}>
      <mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.045, 0.012, 8, 28]} /><meshStandardMaterial color={col("#8b8f94", "#ffcf5a", on(i))} metalness={0.6} roughness={0.3} emissive={col("#000000", "#b07a10", on(i))} /></mesh>
      <mesh position={[0.08, 0, 0]}><boxGeometry args={[0.1, 0.02, 0.02]} />{M.hierro()}</mesh>
      <Halo p={[0.0, 0, 0.08]} r={0.12 * on(i)} c="#ffd36a" o={0.8 * (1 - cl((tt - a[i] - 0.35) / 0.5)) + 0.25} />
    </group>)}
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  h_tres: HTres, h_bascula: HBascula, h_pisos: HPisos, h_falta: HFalta, h_grande: HGrande, h_pascal: HPascal, h_cinta: HCinta, h_purga: HPurga,
  h_joroba: HJoroba, h_jarro: HJarro, h_vasos: HVasos, h_baston: HBaston, h_codo: HCodo, h_cuatro: HCuatro, h_quieto: HQuieto, h_cinco: HCinco,
  h_avenida: HAvenida, h_losa: HLosa, h_compuerta: HCompuerta, h_edificio: HEdificio, h_fuente: HFuente, h_errores: HErrores, h_recap: HRecap,
};
