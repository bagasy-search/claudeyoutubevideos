// plo4c v3 (4-nov, ronda 3: rótulos fuera, encuadres con margen, gota del repaso visible) — antes v2 (ronda 2 del evaluador) · POR QUÉ TU LLAVE GOTEA AUNQUE LA CIERRES FUERTE · componentes únicos 3D.
// Lección de la ronda 1 (notas 3-7): protagonistas a escala real junto a objetos grandes + AutoFit = todo diminuto y cortado.
// v2: cámara fija y cercana (fit={false}), el protagonista ocupa ≥40 % del cuadro, superficie con sombra de contacto,
// los elementos llegan de a uno y TODA animación termina antes de tt≈4.2 (Stage comprime el tiempo de los héroes sin items a ~4.4).
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, MZ, phys, RED, Stage, Tag, VER } from "./ckit";
import { ctex, Estudio, fall, lathe, M, RBox, rn, Vapor } from "./estudio3d";
import { Chorro } from "./kit3d";
import { AGUA, Cubeta, Gota, tuboGeo } from "./kitplo";
import { Calendario, LlavePaso, Vaso } from "./kitbano";

type C = React.FC<{ t: number; h: H }>;
type V3 = [number, number, number];
const P = Math.PI, P2 = P / 2;
const rel = (h: H, i: number) => (h.items?.[i]?.a ?? h.at + 99) - h.at;
const IN = (tt: number, a: number) => phys(tt, a, 7, 0.45);
const CACHE = new Map<string, any>();
const memo = <T,>(k: string, f: () => T): T => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const AT = (h: H, i: number, step = 1.1, a0 = 0.6) => rel(h, i) > 90 ? a0 + i * step : rel(h, i);
const BRONCE = "#c9933e", HULE = "#262422", HULEV = "#5a5148", SARRO = "#e9e4d2", CERA = "#f3f1ea";
const bronce = () => <meshStandardMaterial color={BRONCE} roughness={0.32} metalness={0.9} />;
const hule = (c = HULE) => <meshStandardMaterial color={c} roughness={0.7} />;
const cera = () => <meshPhysicalMaterial color={CERA} roughness={0.15} clearcoat={1} />;
const placa = (key: string, txt: string, fg = "#2a1c12", bg = "#efe4c8", size = 150) => ctex("pl4c:" + key, 256, 256, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, 256, 256); g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = `800 ${size}px Inter, Arial, sans-serif`; g.fillText(txt, 128, 136);
});
const cartel = (key: string, txt: string, w = 512, hh = 160, fg = "#2a1c12", bg = "#efe4c8", size = 96) => ctex("c4c:ct" + key, w, hh, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, hh); g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = `900 ${size}px Inter, Arial, sans-serif`; g.fillText(txt, w / 2, hh / 2 + size * 0.06);
});
// ---------- piezas de escenografía comunes (sombra de contacto, azulejo, ruido, trapo) ----------
const sombraTex = () => ctex("c4c:sombra", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(0,0,0,0.8)"); gr.addColorStop(0.45, "rgba(0,0,0,0.4)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const Sombra: React.FC<{ p: V3; r: number; o?: number; sx?: number }> = ({ p, r, o = 0.8, sx = 1 }) =>
  <mesh position={p} rotation={[-P2, 0, 0]} scale={[sx, 1, 1]} renderOrder={2}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={sombraTex()} transparent opacity={o} depthWrite={false} toneMapped={false} /></mesh>;
const azulejo = (rx = 6, ry = 4) => { const t = ctex(`c4c:az${rx}x${ry}`, 512, 512, (g) => {
  g.fillStyle = "#a9a39a"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const v = 232 + ((i * 7 + j * 13) % 9); g.fillStyle = `rgb(${v},${v - 3},${v - 8})`; g.fillRect(i * 128 + 4, j * 128 + 4, 120, 120); } });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); return t; };
const Pared: React.FC<{ z?: number; y?: number; w?: number; hh?: number; rx?: number; ry?: number; dim?: number }> = ({ z = -0.6, y = 0.1, w = 3.4, hh = 2.2, rx = 7, ry = 4.5, dim = 0.6 }) =>
  <mesh position={[0, y, z]} receiveShadow><planeGeometry args={[w, hh]} /><meshStandardMaterial map={azulejo(rx, ry)} color={col("#000000", "#ffffff", dim)} roughness={0.32} /></mesh>;
const Piso: React.FC<{ y: number; dim?: number; rx?: number }> = ({ y, dim = 0.8, rx = 7 }) =>
  <mesh position={[0, y, 0]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[3.4, 2.4]} /><meshStandardMaterial map={azulejo(rx, rx * 0.7)} color={col("#000000", "#ffffff", dim)} roughness={0.4} /></mesh>;
const ruido = (key: string, cols: string[], n = 2600, s = 3) => { const t = ctex("c4c:rd" + key, 256, 256, (g) => {
  g.fillStyle = cols[0]; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < n; i++) { g.fillStyle = cols[1 + (i % (cols.length - 1))]; g.beginPath(); g.arc(rn(i, 1) * 256, rn(i, 2) * 256, 0.5 + rn(i, 9) * s, 0, 2 * P); g.fill(); } });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
const trapoGeo = (w: number, d: number) => memo(`c4c:trapo${w}x${d}`, () => { const g = new THREE.PlaneGeometry(w, d, 40, 24), p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, 0.012 * Math.sin(x * 21 + Math.sin(y * 9) * 1.5) + 0.006 * Math.sin(y * 31 + x * 5)); }
  g.computeVertexNormals(); return g; });
const Trapo: React.FC<{ p: V3; w: number; d: number; rot?: number; s?: number }> = ({ p, w, d, rot = 0, s = 1 }) =>
  <mesh position={p} rotation={[-P2, 0, rot]} scale={s} geometry={trapoGeo(w, d)} receiveShadow castShadow><meshStandardMaterial map={ruido("tela", ["#e6dbc3", "#d4c7aa", "#f2eadb"], 3200, 1.4)} roughness={0.95} side={THREE.DoubleSide} /></mesh>;
const halo = () => ctex("c4c:halo", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(255,248,220,0.9)"); gr.addColorStop(0.25, "rgba(255,240,200,0.35)"); gr.addColorStop(1, "rgba(255,240,200,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const Luna: React.FC<{ p: V3; r?: number }> = ({ p, r = 0.07 }) => <group position={p}>
  <mesh><sphereGeometry args={[r, 32, 24]} /><meshBasicMaterial color="#f6f0d8" toneMapped={false} /></mesh>
  {[0.2, 0.45, -0.3].map((a, i) => <mesh key={i} position={[Math.cos(a * 7) * r * 0.45, Math.sin(a * 5) * r * 0.45, r * 0.9]}><circleGeometry args={[r * 0.18, 16]} /><meshBasicMaterial color="#d9d2b8" toneMapped={false} /></mesh>)}
  <mesh position={[0, 0, -0.01]}><planeGeometry args={[r * 9, r * 9]} /><meshBasicMaterial map={halo()} transparent depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} /></mesh>
</group>;
// flecha curva (giro) en el plano horizontal: arco + punta
const FlechaGiro: React.FC<{ p: V3; r: number; a0?: number; len?: number; c?: string; o?: number; sentido?: 1 | -1 }> = ({ p, r, a0 = 0, len = 1.5 * P, c = MZ, o = 1, sentido = -1 }) => {
  const fin = a0 + sentido * len;
  return <group position={p} rotation={[-P2, 0, 0]}>
    <mesh rotation={[0, 0, sentido > 0 ? a0 : fin]}><torusGeometry args={[r, r * 0.06, 8, 48, len]} /><meshBasicMaterial color={c} transparent opacity={o} toneMapped={false} /></mesh>
    <mesh position={[Math.cos(fin) * r, Math.sin(fin) * r, 0]} rotation={[0, 0, fin + (sentido > 0 ? 0 : P)]}><coneGeometry args={[r * 0.16, r * 0.34, 12]} /><meshBasicMaterial color={c} transparent opacity={o} toneMapped={false} /></mesh>
  </group>;
};
// llave de rueda en corte: cuerpo cromado (mitad de atrás), vástago con rosca que baja "b" (0 arriba, 1 apoya), empaque aplastado "ap"
const LlaveCorte: React.FC<{ p?: V3; s?: number; b?: number; ap?: number; giro?: number }> = ({ p, s = 1, b = 1, ap = 0, giro = 0 }) => {
  const y = lerp(0.12, 0, b);
  return <group position={p} scale={s}>
    <mesh><cylinderGeometry args={[0.16, 0.16, 0.5, 48, 1, true, P2, P]} />{M.cromo("#cfd3d8")}</mesh>
    <mesh position={[0, 0, -0.001]}><planeGeometry args={[0.32, 0.5]} /><meshStandardMaterial color="#3a3f45" roughness={0.6} metalness={0.4} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, -0.32, 0]}><cylinderGeometry args={[0.07, 0.07, 0.18, 32, 1, true, P2, P]} />{M.cromo("#cfd3d8")}</mesh>
    <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[0.075, 0.09, 0.04, 40]} />{bronce()}</mesh>
    <mesh position={[0, -0.2, 0.0]}><cylinderGeometry args={[0.03, 0.03, 0.042, 24]} /><meshStandardMaterial color="#111" /></mesh>
    <group position={[0, y, 0]} rotation={[0, giro, 0]}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.05, 0.05, 0.36, 32]} />{bronce()}</mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0, 0.0 + i * 0.03, 0]}><torusGeometry args={[0.052, 0.006, 6, 32]} />{bronce()}</mesh>)}
      <mesh position={[0, -0.152 + 0.012 * ap, 0]} scale={[1 + 0.55 * ap, 1 - 0.6 * ap, 1 + 0.55 * ap]}><cylinderGeometry args={[0.062, 0.062, 0.05, 36]} />{hule(col(HULE, HULEV, ap))}</mesh>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.13, 0.13, 0.05, 6]} />{M.cromo()}</mesh>
    </group>
  </group>;
};
// pico cromado
const Pico: React.FC<{ p?: V3; s?: number; rot?: V3 }> = ({ p, s = 1, rot }) => {
  const g = memo("pico4c", () => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[0, 0, 0], [0, 0.3, 0], [0.06, 0.4, 0], [0.24, 0.4, 0], [0.32, 0.32, 0]].map((v) => new THREE.Vector3(...(v as V3)))), 40, 0.035, 16, false));
  return <group position={p} scale={s} rotation={rot}>
    <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.08, 0.1, 0.06, 32]} />{M.cromo()}</mesh>
    <mesh geometry={g} castShadow>{M.cromo()}</mesh>
  </group>;
};
// arandela de hule (protagonista de media pieza)
const Arandela: React.FC<{ p?: V3; s?: number; c?: string; ap?: number; rot?: V3 }> = ({ p, s = 1, c = HULE, ap = 0, rot = [-P2, 0, 0] }) =>
  <mesh position={p} rotation={rot} scale={[s * (1 + 0.3 * ap), s * (1 + 0.3 * ap), s * (1 - 0.5 * ap)]} castShadow><torusGeometry args={[0.05, 0.024, 16, 40]} /><meshStandardMaterial color={c} roughness={0.62} /></mesh>;

// 1 · EL ODÓMETRO DE LA GOTA: tambores 3D que giran y caen exactos en 20 → 600 → 7.000; tres placas (día/mes/año) se encienden al pasar
const tambor = () => ctex("c4c:tambor", 1024, 256, (g) => {
  g.fillStyle = "#f3ecd8"; g.fillRect(0, 0, 1024, 256); g.fillStyle = "#16130f"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 92px Inter, Arial, sans-serif";
  for (let n = 0; n <= 10; n++) { g.save(); g.translate(n * 102.4, 128); g.rotate(P2); g.scale(1.9, 1); g.fillText(String(n % 10), 0, 6); g.restore(); }
  g.fillStyle = "rgba(0,0,0,.16)"; for (let n = 0; n < 10; n++) g.fillRect(n * 102.4 + 50, 0, 3, 256);
});
const COdometro: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const a = eio(tt, 0.4, 1.5), b = eio(tt, 1.6, 2.2), c = eio(tt, 2.3, 3.1);
  const val = c > 0 ? lerp(600, 7000, c) : b > 0 ? lerp(20, 600, b) : lerp(0, 20, a);
  const lit = [tt > 1.5, tt > 2.2, tt > 3.1], lvl = 0.12 + 0.8 * (a * 0.2 + b * 0.3 + c * 0.5);
  const pos = (p: number) => { const v = val / Math.pow(10, p); if (p === 0) return v; const low = val % Math.pow(10, p), m = Math.pow(10, p); return Math.floor(v) + cl(low - (m - 1)); };
  return <Estudio t={tt} cam={[0.0, 0.14, 1.38]} look={[0.0, 0.03, 0]} orbit={0.012} mesa={false} fit={false}>
    <Pared z={-0.75} dim={0.45} />
    <Piso y={-0.36} dim={0.7} />
    <Pico p={[-0.8, -0.1, -0.05]} s={1.0} />
    <Gota p={[-0.48, -0.14, -0.05]} k={(tt * 1.15) % 1} h={0.34} />
    <Cubeta p={[-0.48, -0.36, -0.05]} s={0.48} nivel={lvl} agua="#8fc0dc" c="#2f6fb0" />
    <Sombra p={[-0.48, -0.358, -0.05]} r={0.2} />
    <group position={[0.3, 0.12, 0]}>
      <RBox s={[0.86, 0.44, 0.26]} r={0.03} p={[0, 0, -0.06]}><meshStandardMaterial color="#2a2522" roughness={0.55} metalness={0.2} /></RBox>
      {[0, 1, 2, 3].map((i) => <group key={i} position={[-0.3 + i * 0.2, 0, 0]} rotation={[2 * P * pos(3 - i) / 10, 0, 0]}>
        <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.17, 0.17, 0.16, 48]} /><meshStandardMaterial map={tambor()} roughness={0.45} /></mesh>
      </group>)}
      <mesh position={[0, 0.16, 0.16]}><boxGeometry args={[0.86, 0.12, 0.04]} /><meshStandardMaterial color="#2a2522" roughness={0.5} metalness={0.3} /></mesh>
      <mesh position={[0, -0.16, 0.16]}><boxGeometry args={[0.86, 0.12, 0.04]} /><meshStandardMaterial color="#2a2522" roughness={0.5} metalness={0.3} /></mesh>
      {[-0.4, -0.1, 0.1, 0.4].map((x, i) => <mesh key={i} position={[x + (i === 0 ? -0.0 : 0), 0, 0.16]}><boxGeometry args={[i === 0 || i === 3 ? 0.06 : 0.04, 0.22, 0.04]} /><meshStandardMaterial color="#2a2522" roughness={0.5} metalness={0.3} /></mesh>)}
      <mesh position={[0.1, -0.07, 0.185]}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#2a2522" /></mesh>
      {["20 L · DÍA", "600 L · MES", "7.000 L · AÑO"].map((s, i) => <group key={i} position={[-0.29 + i * 0.29, -0.33, 0.12]}>
        <mesh><planeGeometry args={[0.28, 0.1]} /><meshBasicMaterial map={cartel("odo" + i, s, 512, 160, "#1c1916", "#f2ead6", 74)} color={lit[i] ? (i === 2 ? "#ffd2c8" : "#ffffff") : "#5d5852"} toneMapped={false} /></mesh>
        {lit[i] && <mesh position={[0, 0, -0.002]}><planeGeometry args={[0.3, 0.12]} /><meshBasicMaterial color={i === 2 ? RED : MZ} toneMapped={false} /></mesh>}
      </group>)}
    </group>
  </Estudio>;
}}</Stage>;

// 2 · LA FUERZA QUE APLASTA: corte grande de la llave; la flecha de giro empuja, el vástago baja y el empaque se achata y ensancha; la gota se escapa por el costado
const CAplasta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const b = eio(tt, 0.3, 1.4), ap = eio(tt, 1.5, 3.4), giro = b * 5 + ap * 2.5, lk = ((tt - 2.6) * 0.9) % 1;
  return <Estudio t={tt} cam={[0.0, 0.02, 1.42]} look={[0, 0.0, 0]} orbit={0.012} mesa={false} fit={false}>
    <Pared z={-0.5} dim={0.35} /><group position={[0, -0.12, 0]}>
    <LlaveCorte p={[0, 0.12, 0]} s={1.35} b={b} ap={ap} giro={giro} />
    <mesh position={[0, -0.31, 0]}><cylinderGeometry args={[0.085, 0.085, 0.24, 24, 1, false, P2, P]} />{AGUA(0.55, "#5aa6dc")}</mesh>
    <FlechaGiro p={[0, 0.2, 0.05]} r={0.2} a0={giro * 0.3} c={RED} o={0.85 * cl(tt * 2)} />
    {[-1, 1].map((sd) => [0, 1].map((j) => <mesh key={sd + "" + j} position={[sd * (0.06 + 0.05 * j), 0.03 - 0.05 * ap, 0.12]} rotation={[0, 0, P]} scale={cl(ap * 1.6 - j * 0.3)}><coneGeometry args={[0.018, 0.06, 10]} /><meshBasicMaterial color={RED} toneMapped={false} /></mesh>))}
    {ap > 0.6 && <mesh position={[lerp(0.06, 0.16, cl(lk * 2)) * (1 + 0.3 * ap), lerp(-0.145, -0.08, cl(lk * 2)) - cl(lk * 2 - 1) * 0.1, 0.1]} scale={[0.016, 0.022, 0.016]}><sphereGeometry args={[1, 14, 10]} />{AGUA(0.95, "#6fbaf0")}</mesh>}
    </group>
  </Estudio>;
}}</Stage>;

// 3 · MENOS QUE UN CAFÉ: balanza de bronce; llega la taza de espresso humeante a la izquierda, la arandela a la derecha — el café pesa más y baja con rebote
const tazaCafeGeo = () => memo("c4c:tazacafe", () => lathe([[0, 0], [0.05, 0], [0.065, 0.015], [0.075, 0.08], [0.078, 0.1], [0.074, 0.1], [0.068, 0.02], [0.0, 0.012]], 48));
const CCafe: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const inC = IN(tt, 0.25), inA = IN(tt, 0.7), k = eio(tt, 1.1, 1.9), sp = tt > 1.9 ? Math.exp(-(tt - 1.9) * 2.4) * Math.sin((tt - 1.9) * 10) * 0.07 : 0, ang = 0.2 * k + sp;
  return <Estudio t={tt} cam={[0.0, 0.25, 1.32]} look={[0, 0.05, 0]} orbit={0.012} mesa={false} fit={false}>
    <Pared z={-0.6} dim={0.4} />
    <Piso y={-0.42} dim={0.7} />
    <mesh position={[0, -0.05, 0]} castShadow><cylinderGeometry args={[0.025, 0.05, 0.74, 20]} />{bronce()}</mesh>
    <mesh position={[0, -0.41, 0]} castShadow><cylinderGeometry args={[0.16, 0.18, 0.03, 40]} />{bronce()}</mesh>
    <group position={[0, 0.32, 0]} rotation={[0, 0, ang]}>
      <mesh rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.012, 0.012, 1.0, 12]} />{bronce()}</mesh>
      <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.04, 16]} />{bronce()}</mesh>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.48, 0, 0]} rotation={[0, 0, -ang]}>
        {[-1, 1].map((q) => <mesh key={q} position={[q * 0.07, -0.14, 0]} rotation={[0, 0, -q * 0.25]}><cylinderGeometry args={[0.0025, 0.0025, 0.29, 6]} />{bronce()}</mesh>)}
        <mesh position={[0, -0.28, 0]} castShadow receiveShadow><cylinderGeometry args={[0.16, 0.12, 0.018, 40]} />{bronce()}</mesh>
        {sd < 0 ? <group position={[0, -0.27 + (1 - inC) * 0.5, 0]} scale={inC + 0.0001}>
          <mesh position={[0, 0.006, 0]} castShadow><cylinderGeometry args={[0.11, 0.1, 0.012, 40]} /><meshPhysicalMaterial color="#f6f1e6" clearcoat={1} roughness={0.2} /></mesh>
          <mesh geometry={tazaCafeGeo()} position={[0, 0.012, 0]} castShadow><meshPhysicalMaterial color="#f8f4ea" clearcoat={1} roughness={0.15} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0.088, 0.066, 0]}><torusGeometry args={[0.024, 0.008, 10, 24]} /><meshPhysicalMaterial color="#f8f4ea" clearcoat={1} roughness={0.15} /></mesh>
          <mesh position={[0, 0.1, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.072, 36]} /><meshPhysicalMaterial color="#2b170c" clearcoat={1} roughness={0.1} /></mesh>
          <mesh position={[0.01, 0.1005, 0.01]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.035, 0.06, 36]} /><meshStandardMaterial color="#9a6a3c" transparent opacity={0.55} /></mesh>
          <Vapor t={tt} p={[0, 0.12, 0]} n={9} h={0.26} o={0.38} s={0.07} spread={0.04} />
        </group> : <group position={[0, -0.24 + (1 - inA) * 0.5, 0]} scale={inA + 0.0001}>
          <Arandela s={1.25} />
          <Sombra p={[0, -0.028, 0]} r={0.1} o={0.6} />
        </group>}
      </group>)}
    </group>
  </Estudio>;
}}</Stage>;

// 4 · LA NOCHE DE DOÑA ROSA: ventana nocturna; la luna con halo cruza detrás del marco, la gota cae con anillos y el agua sube con menisco hasta media cubeta
const CRosa: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#0b1424">{(tt) => {
  const k = eio(tt, 0.2, 4.2), nivel = 0.1 + 0.4 * k, per = 0.62, dk = (tt % per) / per, yAgua = -0.44 + 0.45 * nivel * 0.72, n = Math.floor(tt / per);
  return <Estudio t={tt} cam={[0.0, 0.3, 1.5]} look={[0, 0.06, 0]} orbit={0.012} mesa={false} fit={false}>
    <mesh position={[0, 0.3, -0.85]}><planeGeometry args={[1.6, 1.0]} /><meshBasicMaterial color="#0f2140" toneMapped={false} /></mesh>
    {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.3, 0.05 + rn(i, 2) * 0.7, -0.84]}><circleGeometry args={[0.003 + 0.003 * rn(i, 3), 6]} /><meshBasicMaterial color="#dfe8ff" toneMapped={false} /></mesh>)}
    <Luna p={[lerp(-0.55, 0.55, k), 0.46 + 0.12 * Math.sin(k * P), -0.8]} r={0.11} />
    {[[0, 0.82, 2.2, 0.35], [0, -0.12, 2.2, 0.35], [-0.86, 0.35, 0.5, 1.3], [0.86, 0.35, 0.5, 1.3]].map(([x, y, w, hh], i) => <mesh key={i} position={[x, y, -0.7]}><planeGeometry args={[w, hh]} /><meshStandardMaterial color="#1d2a3c" roughness={0.9} /></mesh>)}
    {[[0, 0.35, 0.03, 0.95], [0, 0.35, 1.25, 0.03], [-0.61, 0.35, 0.04, 0.95], [0.61, 0.35, 0.04, 0.95], [0, -0.12, 1.26, 0.05], [0, 0.82, 1.26, 0.05]].map(([x, y, w, hh], i) => <mesh key={i} position={[x, y, -0.68]}><boxGeometry args={[w, hh, 0.04]} /><meshStandardMaterial color="#e8e2d2" roughness={0.6} /></mesh>)}
    <pointLight position={[0.2, 0.6, -0.2]} intensity={3.5} distance={3} color="#86a8ff" />
    <Piso y={-0.44} dim={0.35} />
    <Pico p={[-0.33, -0.02, -0.05]} s={1.0} />
    <Gota p={[-0.01, yAgua, -0.05]} k={dk} h={0.32 - (yAgua + 0.44) * 0.5} c="#bfe2ff" />
    <Cubeta p={[-0.01, -0.44, -0.05]} s={0.72} nivel={nivel} agua="#3d8fe0" c="#c8c2b4" />
    <mesh position={[-0.01, yAgua + 0.002, -0.05]} rotation={[-P2, 0, 0]}><ringGeometry args={[(0.26 + 0.07 * nivel) * 0.72 - 0.012, (0.26 + 0.07 * nivel) * 0.72, 48]} /><meshBasicMaterial color="#dff0ff" transparent opacity={0.8} toneMapped={false} /></mesh>
    {[0, 1].map((j) => { const q = cl(((tt - (n - j) * per) - per * 0.95) / 0.9); return q > 0 && q < 1 ? <mesh key={j} position={[-0.01, yAgua + 0.003, -0.05]} rotation={[-P2, 0, 0]} scale={0.02 + q * 0.17}><ringGeometry args={[0.9, 1, 40]} /><meshBasicMaterial color="#e6f4ff" transparent opacity={0.7 * (1 - q)} toneMapped={false} /></mesh> : null; })}
    <Sombra p={[-0.01, -0.438, -0.05]} r={0.28} o={0.7} />
  </Estudio>;
}}</Stage>;

// 5 · LA CUENTA DEL VASO: el vaso grande se llena con un chorro fino; se clona cinco veces en arco (pop, pop…) y los seis vuelcan en cascada dentro de una jarra «1 HORA»
const jarraGeo = () => memo("c4c:jarra", () => lathe([[0, 0], [0.15, 0], [0.16, 0.02], [0.165, 0.3], [0.17, 0.32]], 48));
const CVaso: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const a = eio(tt, 0.2, 1.4), m = eio(tt, 1.5, 1.9), jar = eio(tt, 2.4, 2.9), jl = eio(tt, 2.9, 4.1);
  const slot = (i: number): V3 => [-0.6 + i * 0.24, 0.2 + 0.07 * Math.cos(((i - 2.5) / 2.5) * P2), 0];
  return <Estudio t={tt} cam={[0.0, 0.1, 1.58]} look={[0, 0.02, 0]} orbit={0.012} mesa={false} fit={false}>
    <Pared z={-0.6} dim={0.14} />
    <Piso y={-0.42} dim={0.7} />
    {tt < 1.5 && <Chorro a={[0, 0.6, 0]} b={[0, lerp(-0.3, -0.05, a), 0]} r={0.006} c="#a8d4ee" o={0.85 * (1 - eio(tt, 1.25, 1.45))} />}
    {Array.from({ length: 6 }, (_, i) => { const s0 = slot(i), on = i === 0 ? 1 : IN(tt, 1.9 + (i - 1) * 0.12), pour = eio(tt, 2.95 + i * 0.12, 3.35 + i * 0.12), back = eio(tt, 3.9, 4.3);
      const pos: V3 = i === 0 ? [lerp(0, s0[0], m), lerp(-0.42, s0[1], m), 0] : s0, sc = i === 0 ? lerp(2.0, 1.15, m) : 1.15 * on;
      const tilt = (s0[0] < 0 ? -1 : 1) * 1.6 * pour * (1 - back), lip: V3 = [pos[0] + (s0[0] < 0 ? 0.08 : -0.08), pos[1] + 0.16, 0];
      return <group key={i}>
        <group position={pos} scale={sc + 0.0001} rotation={[0, 0, tilt]}><Vaso lleno={i === 0 ? 0.6 * a * (1 - pour) + 0.02 : 0.6 * (1 - pour) + 0.02} /></group>
        {pour > 0.05 && pour < 0.98 && <Chorro a={lip} b={[0, -0.12, 0.02]} r={0.008} c="#a8d4ee" o={0.8} />}
      </group>; })}
    <group position={[0, lerp(-0.9, -0.42, jar), 0.05]}>
      <mesh geometry={jarraGeo()} castShadow>{M.vidrio()}</mesh>
      {jl > 0.01 && <mesh position={[0, 0.15 * jl + 0.01, 0]}><cylinderGeometry args={[0.155, 0.148, 0.3 * jl, 40]} />{AGUA(0.6, "#8fc4e6")}</mesh>}
      {[0.08, 0.16, 0.24].map((y, i) => <mesh key={i} position={[0.06, y, 0.163]}><boxGeometry args={[0.05, 0.004, 0.002]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>)}
      <mesh position={[-0.03, 0.2, 0.166]}><planeGeometry args={[0.16, 0.06]} /><meshBasicMaterial map={cartel("1hora", "1 HORA", 512, 192, "#ffffff", "#000000", 120)} transparent opacity={0.9 * jar} alphaMap={cartel("1horaA", "1 HORA", 512, 192, "#ffffff", "#000000", 120)} toneMapped={false} /></mesh>
      <Sombra p={[0, 0.002, 0]} r={0.24} o={0.6 * jar} />
    </group>
  </Estudio>;
}}</Stage>;

// 6 · LA PIEZA QUE TAPA: corte transparente; la columna de agua azul empuja con flechas que se aplastan contra el empaque; al subir el vástago el chorro atraviesa
const CCorte: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const up = eio(tt, 2.0, 2.6), s = 1.45, yS = 0.15 - 0.2 * s;
  return <Estudio t={tt} cam={[0.0, 0.0, 1.58]} look={[0, 0.0, 0]} orbit={0.012} mesa={false} fit={false}>
    <Pared z={-0.5} dim={0.3} /><group position={[0, -0.12, 0]}>
    <LlaveCorte p={[0, 0.15, 0]} s={s} b={1 - up} />
    <mesh position={[0, -0.31, 0]}><cylinderGeometry args={[0.095, 0.095, 0.26, 28]} />{AGUA(0.5, "#3f8fd0")}</mesh>
    {Array.from({ length: 46 }, (_, i) => { const q = (tt * 0.8 + rn(i, 2)) % 1, x = (rn(i, 4) - 0.5) * 0.16, top = up > 0.4 ? 0.06 : yS - 0.02;
      let y = lerp(-0.45, top, q), xx = x; if (up > 0.4 && y > yS) { xx = x * 0.4 + (y - yS) * 1.6; } if (up <= 0.4) y = Math.min(y, yS - 0.025 - rn(i, 7) * 0.04);
      return <mesh key={i} position={[xx, y, 0.03]} scale={0.012}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#9ad4ff" toneMapped={false} /></mesh>; })}
    {[-0.05, 0, 0.05].map((x, i) => <group key={i} position={[x, yS - 0.07, 0.1]} scale={[1, up > 0.4 ? 1.4 : 0.55 + 0.1 * Math.sin(tt * 8 + i), 1]}>
      <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.006, 0.006, 0.07, 8]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
      <mesh position={[0, 0.025, 0]}><coneGeometry args={[0.016, 0.03, 10]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
    </group>)}
    {up > 0.4 && <><Chorro a={[0, yS - 0.02, 0.02]} b={[0, 0.02, 0.02]} r={0.03} c="#6fb8f0" o={0.75} /><Chorro a={[0, 0.02, 0.02]} b={[0.32, 0.06, 0.02]} r={0.026} c="#6fb8f0" o={0.75} /></>}
    </group>
  </Estudio>;
}}</Stage>;

// 7 · TRES LLAVES EN LA MESA GIRATORIA: cruz, cuarto de vuelta y palanca; la nombrada gira al frente, sube y su manija dibuja su recorrido con tinta (sin rótulos)
const CTres: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const ats = [0, 1, 2].map((i) => AT(h, i, 1.6)), act = ats.filter((a) => tt >= a).length - 1;
  const rot = -[1, 2].reduce((s, i) => s + eio(tt, ats[i] - 0.2, ats[i] + 0.8) * (2 * P / 3), 0);
  return <Estudio t={tt} cam={[0.0, 0.55, 1.45]} look={[0, 0.24, 0.12]} orbit={0.01} mesa={false} fit={false}>
    <Pared z={-0.7} dim={0.4} />
    <Piso y={-0.06} dim={0.6} />
    <mesh position={[0, -0.03, 0]} castShadow receiveShadow><cylinderGeometry args={[0.55, 0.57, 0.05, 72]} />{M.madera("#7a5232")}</mesh>
    <Sombra p={[0, -0.057, 0]} r={0.7} o={0.7} />
    <group rotation={[0, rot, 0]}>
      {[0, 1, 2].map((i) => { const a = i * 2 * P / 3, me = act === i, on = me ? IN(tt, ats[i]) : 0, lt = me ? tt - ats[i] : 0;
        const wheel = lt * 2.6, quarter = P2 * (0.5 - 0.5 * Math.cos(lt * 1.8)), lever = 0.35 * Math.sin(lt * 1.6);
        return <group key={i} position={[Math.sin(a) * 0.32, 0.0 + 0.09 * on, Math.cos(a) * 0.32]} rotation={[0, a - P2 * 0.35, 0]}>
          <Pico s={0.95} />
          <Sombra p={[0, 0.001 - 0.09 * on, 0]} r={0.12} o={0.6} />
          {i === 0 && <group position={[0, 0.44, 0]} rotation={[0, wheel, 0]}>
            <mesh castShadow><cylinderGeometry args={[0.022, 0.022, 0.06, 16]} />{M.cromo()}</mesh>
            {[0, 1].map((q) => <mesh key={q} position={[0, 0.03, 0]} rotation={[0, q * P2, P2]} castShadow><capsuleGeometry args={[0.014, 0.18, 6, 12]} />{M.cromo()}</mesh>)}
            {[0, 1, 2, 3].map((q) => <mesh key={q} position={[Math.cos(q * P2) * 0.105, 0.03, Math.sin(q * P2) * 0.105]}><sphereGeometry args={[0.02, 14, 10]} /><meshStandardMaterial color="#c0392b" roughness={0.4} /></mesh>)}
          </group>}
          {i === 1 && <group position={[0, 0.44, 0]} rotation={[0, -quarter, 0]}>
            <mesh castShadow><cylinderGeometry args={[0.035, 0.035, 0.05, 20]} />{M.cromo()}</mesh>
            <mesh position={[0.08, 0.02, 0]} castShadow><boxGeometry args={[0.16, 0.025, 0.04]} />{M.cromo()}</mesh>
            <mesh position={[0, 0.03, 0.04]}><sphereGeometry args={[0.008, 8, 6]} /><meshStandardMaterial color="#2a5d9f" /></mesh>
          </group>}
          {i === 2 && <group position={[0, 0.42, 0]}>
            <mesh castShadow><cylinderGeometry args={[0.05, 0.06, 0.08, 24]} />{M.cromo()}</mesh>
            <group position={[0, 0.04, 0]} rotation={[0, 0, 0.35 + lever]}><mesh position={[-0.1, 0, 0]} rotation={[0, 0, P2]} castShadow><capsuleGeometry args={[0.014, 0.18, 6, 12]} />{M.cromo()}</mesh></group>
          </group>}
          {me && i < 2 && <mesh position={[0, 0.5, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.13, 0.145, 64, 1, 0, i === 0 ? Math.min(2 * P - 0.01, (wheel % (2 * P)) + 0.01) : Math.max(0.01, quarter)]} /><meshBasicMaterial color={MZ} transparent opacity={on} side={THREE.DoubleSide} toneMapped={false} /></mesh>}
          {me && i === 0 && [0, 1, 2].map((q) => <mesh key={q} position={[-0.06 + q * 0.06, 0.58, 0]}><sphereGeometry args={[0.014, 12, 8]} /><meshBasicMaterial color={Math.floor(wheel / (2 * P)) > q ? MZ : "#4a4440"} toneMapped={false} /></mesh>)}
          {me && i === 2 && <mesh position={[0, 0.46, 0]}><ringGeometry args={[0.2, 0.215, 40, 1, P - 0.05, 0.85]} /><meshBasicMaterial color={MZ} transparent opacity={on} side={THREE.DoubleSide} toneMapped={false} /></mesh>}
        </group>; })}
    </group>
  </Estudio>;
}}</Stage>;

// 8 · LA SUELA DEL ZAPATO: una suela de goma real (dibujo, canto) sobre el asiento de bronce; el vástago la aprieta, se abomba, cada apretón le abre una grieta y al final se desprende un trozo
const suelaGeo = () => memo("c4c:suela", () => { const s = new THREE.Shape();
  s.moveTo(-0.33, 0); s.bezierCurveTo(-0.35, 0.09, -0.21, 0.11, -0.12, 0.08); s.bezierCurveTo(-0.02, 0.05, 0.08, 0.11, 0.22, 0.105);
  s.bezierCurveTo(0.37, 0.1, 0.39, -0.1, 0.22, -0.105); s.bezierCurveTo(0.08, -0.11, -0.02, -0.06, -0.12, -0.08); s.bezierCurveTo(-0.21, -0.11, -0.35, -0.09, -0.33, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3, curveSegments: 28 }); g.rotateX(-P2); return g; });
const CSuela: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const st = [0.3, 1.15, 2.0, 2.85], n = st.filter((a) => tt >= a + 0.35).length, cur = st.findIndex((a) => tt >= a && tt < a + 0.7);
  const push = cur >= 0 ? Math.sin(((tt - st[cur]) / 0.7) * P) : 0, def = n / 4, br = tt > 3.75, fk = fall(tt, 3.75, 0.25);
  return <Estudio t={tt} cam={[0.18, 0.36, 0.86]} look={[0.0, 0.0, 0]} orbit={0.012} mesa={false} fit={false}>
    <Pared z={-0.6} dim={0.35} />
    <Piso y={-0.3} dim={0.55} />
    <RBox p={[0, -0.04, 0]} s={[0.86, 0.06, 0.34]} r={0.012}>{bronce()}</RBox>
    <mesh position={[0, -0.18, 0]}><cylinderGeometry args={[0.07, 0.09, 0.22, 24]} />{bronce()}</mesh>
    <Sombra p={[0, -0.298, 0]} r={0.5} sx={1.4} o={0.7} />
    <group position={[0, -0.01, 0]} scale={[1 + 0.06 * push + 0.03 * def, 1 - 0.32 * push - 0.1 * def, 1 + 0.08 * push + 0.03 * def]}>
      <mesh geometry={suelaGeo()} castShadow receiveShadow><meshStandardMaterial map={ruido("goma", ["#2b2826", "#1d1b19", "#3a3633"], 3000, 1.2)} roughness={0.85} /></mesh>
      {Array.from({ length: 13 }, (_, i) => <mesh key={i} position={[-0.27 + i * 0.045, 0.012, 0.0]}><boxGeometry args={[0.012, 0.012, 0.18 - Math.abs(i - 6) * 0.006]} /><meshStandardMaterial color="#141210" roughness={0.9} /></mesh>)}
      {[-0.22, -0.06, 0.08, 0.2].map((x, i) => <group key={i} position={[x, 0.032, 0.088 + (i === 1 ? -0.015 : 0)]} scale={[1, cl((n - i) * 1.3 + (cur === i ? push * 0.3 : 0)), 1]}>
        <mesh rotation={[0, 0, 0.25]}><boxGeometry args={[0.006, 0.05, 0.012]} /><meshBasicMaterial color="#f2efe8" toneMapped={false} /></mesh>
        <mesh position={[0.006, -0.018, 0]} rotation={[0, 0, -0.35]}><boxGeometry args={[0.005, 0.03, 0.012]} /><meshBasicMaterial color="#f2efe8" toneMapped={false} /></mesh>
      </group>)}
    </group>
    {!br ? <mesh position={[0.31, 0.02, 0.0]} castShadow><boxGeometry args={[0.06, 0.05, 0.1]} /><meshStandardMaterial color="#2b2826" roughness={0.85} /></mesh>
      : <mesh position={[0.31 + (tt - 3.75) * 0.25, -0.27 + fk, 0.06]} rotation={[0, 0.6, (tt - 3.75) * 4]} castShadow><boxGeometry args={[0.06, 0.05, 0.1]} /><meshStandardMaterial color="#2b2826" roughness={0.85} /></mesh>}
    <group position={[0, 0.32 - 0.07 * push - 0.012 * def, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.07, 0.07, 0.42, 32]} />{bronce()}</mesh>
      <mesh position={[0, -0.215, 0]}><cylinderGeometry args={[0.085, 0.085, 0.015, 32]} />{bronce()}</mesh>
    </group>
  </Estudio>;
}}</Stage>;

// 9 · EL GRANITO QUE RAYA: dos discos de cerámica pulida; el de arriba gira y un grano de sarro brillante atrapado dibuja un surco hacia el borde: por él asoma un hilo de agua y gotea
const espiral = (a: number) => { const pts: V3[] = []; const N = Math.max(2, Math.ceil(a * 12)); for (let i = 0; i <= N; i++) { const q = (i / N) * a, r = lerp(0.07, 0.235, q / 4.2); pts.push([Math.cos(q) * r, 0, -Math.sin(q) * r]); } return pts; };
const CRaya: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const a = eio(tt, 0.4, 3.0) * 4.2, w = eio(tt, 3.0, 3.8), rg = lerp(0.07, 0.235, a / 4.2), dk = ((tt - 3.3) * 1.4) % 1;
  const sur = espiral(a), g = memo("c4c:surco" + a.toFixed(2), () => tuboGeo(sur, 0.007, 64, 8)), ga = memo("c4c:agua" + (a * w).toFixed(2), () => tuboGeo(espiral(Math.max(0.05, a * w)), 0.0055, 64, 8));
  return <Estudio t={tt} cam={[0.0, 0.6, 0.62]} look={[0, -0.02, 0]} orbit={0.012} mesa={false} fit={false}>
    <Piso y={-0.07} dim={0.55} />
    <Sombra p={[0, -0.068, 0]} r={0.34} o={0.75} />
    <mesh position={[0, -0.04, 0]} castShadow receiveShadow><cylinderGeometry args={[0.26, 0.26, 0.05, 72]} />{cera()}</mesh>
    <mesh position={[0, -0.0145, 0]} geometry={g} scale={[1, 0.25, 1]}><meshStandardMaterial color="#1a1612" roughness={0.9} /></mesh>
    {w > 0.02 && <mesh position={[0, -0.012, 0]} geometry={ga} scale={[1, 0.6, 1]}><meshBasicMaterial color="#5fb4f2" toneMapped={false} /></mesh>}
    {w > 0.9 && <Gota p={[Math.cos(4.2) * 0.25, -0.065, -Math.sin(4.2) * 0.25]} k={dk} h={0.05} c="#7cc4f6" />}
    <group position={[-0.06, 0.03, 0.02]} rotation={[0, a, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.24, 0.24, 0.04, 72]} /><meshPhysicalMaterial color="#efe9dc" roughness={0.12} clearcoat={1} transparent opacity={0.42} depthWrite={false} /></mesh>
      <mesh position={[0, 0.021, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.235, 0.24, 72]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
    </group>
    <mesh position={[Math.cos(a) * rg, -0.0, -Math.sin(a) * rg]} rotation={[tt, tt * 0.7, 0]} castShadow><dodecahedronGeometry args={[0.022]} /><meshPhysicalMaterial color="#8a5a2b" roughness={0.25} clearcoat={1} /></mesh>
  </Estudio>;
}}</Stage>;

// 10 · EL FLUJO QUE SE FRENA: tubo de vidrio con válvula de bola de bronce; la manija roja gira a la derecha, el agua se amontona contra la compuerta y aguas abajo el tubo se vacía
const CFlujo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const g = eio(tt, 0.9, 1.9), tc = 1.7, vel = 0.42, dren = cl((tt - tc) * 0.5);
  return <Estudio t={tt} cam={[0.0, 0.32, 1.05]} look={[0, 0.02, 0]} orbit={0.012} mesa={false} fit={false}>
    <Pared z={-0.55} dim={0.38} />
    <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.068, 0.068, 1.7, 40, 1, true]} />{M.vidrio()}</mesh>
    <mesh position={[-0.47, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.062, 0.062, 0.76, 32]} />{AGUA(0.5, "#5aa6dc")}</mesh>
    {dren < 1 && <mesh position={[lerp(0.47, 0.85, dren) - 0, 0, 0]} rotation={[0, 0, P2]} scale={[1, 1 - dren, 1]}><cylinderGeometry args={[0.062, 0.062, 0.76, 32]} />{AGUA(0.5, "#5aa6dc")}</mesh>}
    {Array.from({ length: 40 }, (_, i) => { const x0 = (rn(i, 3) * 1.6 + vel * Math.min(tt, tc)) % 1.6 - 0.8; let x = x0;
      if (tt > tc) { if (x0 > 0.1) { x = x0 + vel * (tt - tc); if (x > 0.85) return null; } else x = Math.min(x0 + vel * (tt - tc), -0.13 - rn(i, 8) * 0.22); }
      else x = (rn(i, 3) * 1.6 + vel * tt) % 1.6 - 0.8;
      const sq = tt > tc && x < 0 ? 0.6 : 1;
      return <mesh key={i} position={[x, (rn(i, 5) - 0.5) * 0.09, (rn(i, 6) - 0.5) * 0.07]} scale={[0.013 * sq, 0.013, 0.013]}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#bfe4ff" toneMapped={false} /></mesh>; })}
    <group scale={1.35}>
      <mesh castShadow><sphereGeometry args={[0.1, 32, 24]} />{bronce()}</mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.11, 0, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.075, 0.075, 0.05, 6]} />{bronce()}</mesh>)}
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.02, 0.02, 0.05, 12]} />{bronce()}</mesh>
      <group position={[0, 0.15, 0]} rotation={[0, -g * P2, 0]}>
        <mesh position={[0.11, 0.0, 0]} castShadow><boxGeometry args={[0.24, 0.02, 0.045]} /><meshStandardMaterial color="#c8261d" roughness={0.45} /></mesh>
        <mesh><cylinderGeometry args={[0.026, 0.026, 0.025, 6]} />{M.cromo()}</mesh>
      </group>
      <FlechaGiro p={[0, 0.2, 0]} r={0.16} a0={0} len={1.3 * P2} c={VER} o={cl((tt - 0.5) * 3) * (1 - eio(tt, 2.2, 2.6))} sentido={-1} />
    </group>
  </Estudio>;
}}</Stage>;

// 11 · EL IMÁN DEL DESAGÜE: el tornillo (rosca y cabeza, grande) cae, rebota en la porcelana, rueda en espiral atraído por los anillos del desagüe… y el trapo cae doblándose y lo frena
const roscaGeo = () => memo("c4c:rosca", () => { const pts: THREE.Vector3[] = []; for (let i = 0; i <= 200; i++) { const q = i / 200, a = q * 2 * P * 9; pts.push(new THREE.Vector3(Math.cos(a) * 0.013, -0.06 + q * 0.11, Math.sin(a) * 0.013)); }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, 0.0032, 6, false); });
const yBacha = (r: number) => r < 0.3 ? lerp(-0.12, -0.08, cl((r - 0.05) / 0.25)) : lerp(-0.08, 0.02, cl((r - 0.3) / 0.18));
const Tornillo: React.FC<{ p: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh castShadow><cylinderGeometry args={[0.011, 0.008, 0.12, 16]} />{M.cromo("#e8dcc0")}</mesh>
  <mesh geometry={roscaGeo()}>{M.cromo("#e8dcc0")}</mesh>
  <mesh position={[0, 0.066, 0]} castShadow><cylinderGeometry args={[0.028, 0.024, 0.014, 28]} />{M.cromo("#efe4c8")}</mesh>
  <mesh position={[0, 0.074, 0]}><boxGeometry args={[0.04, 0.004, 0.006]} /><meshStandardMaterial color="#5a5040" /></mesh>
</group>;
const CIman: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const y0 = fall(tt, 0.3, 0.32), sp = eio(tt, 1.1, 2.8), ang = 0.5 + sp * 5.2, r = lerp(0.3, 0.115, sp), tr = eio(tt, 2.15, 2.75);
  const x = tt < 1.1 ? 0.3 : Math.cos(ang) * r, z = tt < 1.1 ? 0.05 : Math.sin(ang) * r, rr = Math.hypot(x, z), ys = yBacha(rr) + 0.014 + (tt < 1.1 ? y0 : 0);
  return <Estudio t={tt} cam={[0.0, 0.66, 0.56]} look={[0, -0.07, 0.02]} orbit={0.012} mesa={false} fit={false}>
    <mesh geometry={memo("c4c:bacha", () => lathe([[0.05, -0.12], [0.3, -0.08], [0.48, 0.02], [0.5, 0.05], [0.7, 0.05]], 72))} receiveShadow><meshPhysicalMaterial color="#f7f6f2" clearcoat={1} roughness={0.12} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, -0.119, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.03, 0.05, 40]} />{M.cromo()}</mesh>
    <mesh position={[0, -0.12, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.03, 32]} /><meshStandardMaterial color="#0d0d0d" /></mesh>
    {tr < 0.5 && [0, 1, 2].map((j) => { const q = ((tt * 0.7 + j / 3) % 1); return <mesh key={j} position={[0, -0.118 + 0.01 * (1 - q), 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[lerp(0.32, 0.06, q), lerp(0.325, 0.064, q), 64]} /><meshBasicMaterial color={RED} transparent opacity={0.5 * Math.sin(q * P) * (1 - tr * 2)} toneMapped={false} /></mesh>; })}
    <Trapo p={[0.0, lerp(0.42, -0.1, tr), 0.0]} w={0.34} d={0.3} rot={0.4 + tr * 0.3} s={lerp(0.8, 1, tr)} />
    <Tornillo p={[x, ys + 0.02, z]} s={2.1} rot={[P2, -ang + (tt < 1.1 ? tt * 3 : 0), 0]} />
    <Sombra p={[x, yBacha(rr) + 0.002, z]} r={0.06 + 0.04 * cl(y0 * 3)} o={0.6 * (1 - cl(y0 * 3))} />
  </Estudio>;
}}</Stage>;

// 12 · EL DESPIECE EN FILA: la llave se abre en vista explosionada vertical sobre un hilo de luz y cada pieza baja, una por una, a su lugar numerado sobre el trapo
const CDespiece: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const ex = eio(tt, 0.2, 1.4);
  const pz: React.ReactNode[] = [
    <mesh castShadow><cylinderGeometry args={[0.04, 0.04, 0.016, 28]} /><meshStandardMaterial color="#c0392b" roughness={0.35} /></mesh>,
    <Tornillo p={[0, -0.03, 0]} s={0.75} />,
    <group>{[0, 1].map((q) => <mesh key={q} rotation={[0, q * P2, P2]} castShadow><capsuleGeometry args={[0.018, 0.2, 6, 12]} />{M.cromo()}</mesh>)}<mesh castShadow><cylinderGeometry args={[0.04, 0.04, 0.04, 20]} />{M.cromo()}</mesh></group>,
    <mesh castShadow><sphereGeometry args={[0.1, 36, 16, 0, 2 * P, 0, P2 * 0.8]} />{M.cromo()}</mesh>,
    <mesh castShadow><cylinderGeometry args={[0.07, 0.07, 0.05, 6]} />{bronce()}</mesh>,
    <group><mesh castShadow><cylinderGeometry args={[0.032, 0.032, 0.22, 20]} />{bronce()}</mesh>{Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, -0.02 + i * 0.022, 0]}><torusGeometry args={[0.034, 0.004, 6, 24]} />{bronce()}</mesh>)}<mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.045, 0.045, 0.025, 24]} />{hule()}</mesh></group>,
  ];
  const y0 = [0.3, 0.28, 0.25, 0.18, 0.1, -0.02], yE = (i: number) => 0.5 - i * 0.105;
  return <Estudio t={tt} cam={[0.0, 0.3, 1.3]} look={[0, 0.06, 0]} orbit={0.012} mesa={false} fit={false}>
    <Pared z={-0.6} dim={0.38} />
    <Piso y={-0.21} dim={0.55} />
    <Trapo p={[0, -0.2, 0.05]} w={1.5} d={0.38} />
    <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.003, 0.003, 0.72, 6]} /><meshBasicMaterial color="#ffe8b0" transparent opacity={0.7 * ex * (1 - eio(tt, 3.6, 4.2))} toneMapped={false} /></mesh>
    {pz.map((n, i) => { const a = 1.7 + i * 0.4, m = eio(tt, a, a + 0.45), x = -0.6 + i * 0.24, onN = IN(tt, a + 0.35);
      return <group key={i}>
        <group position={[lerp(0, x, m), lerp(lerp(y0[i], yE(i), ex), -0.15, m), lerp(0, 0.06, m)]} rotation={[i === 5 ? lerp(0, P2, m) : 0, tt * 0.5 * (1 - m), 0]} scale={1.35}>{n}</group>
        {m > 0.95 && <Sombra p={[x, -0.188, 0.06]} r={0.1} o={0.6} />}
        <mesh position={[x, -0.19, 0.22]} rotation={[-P2 * 0.6, 0, 0]} scale={onN + 0.0001}><planeGeometry args={[0.09, 0.09]} /><meshBasicMaterial map={placa("dz" + i, String(i + 1), "#f6f1e4", "#2a2420", 170)} toneMapped={false} /></mesh>
      </group>; })}
  </Estudio>;
}}</Stage>;

// 13 · LA LIJA EN CÍRCULOS: lija de agua con grano y gotas sobre el azulejo; el disco grande gira en círculos levantando polvo con luz rasante y al final muestra su cara con un destello
const CLija: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const a = tt * 3.2, bri = eio(tt, 0.4, 3.2), lift = eio(tt, 3.3, 3.9), sw = cl((tt - 3.7) / 0.5), dx = Math.cos(a) * 0.06 * (1 - lift), dz = Math.sin(a) * 0.06 * (1 - lift);
  return <Estudio t={tt} cam={[0.0, 0.52, 0.62]} look={[0, 0.02, 0]} orbit={0.012} mesa={false} fit={false}>
    <Piso y={-0.02} dim={0.85} rx={9} />
    <pointLight position={[-0.8, 0.12, 0.2]} intensity={4} distance={2.5} color="#ffd9a8" />
    <mesh position={[0, -0.012, 0]} rotation={[-P2, 0, 0.12]} receiveShadow><planeGeometry args={[0.62, 0.5]} /><meshStandardMaterial map={ruido("lija", ["#2a2c2e", "#4a4c4f", "#18191a", "#5a5d60"], 9000, 0.9)} roughness={1} /></mesh>
    {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.55, -0.008, (rn(i, 2) - 0.5) * 0.42]} scale={[0.008 + 0.01 * rn(i, 3), 0.004, 0.008 + 0.01 * rn(i, 3)]}><sphereGeometry args={[1, 12, 8]} />{AGUA(0.85, "#cfe6f4")}</mesh>)}
    {Array.from({ length: 46 }, (_, i) => { const te = i * 0.075, age = tt - te; if (age < 0 || age > 1.3 || te > 3.3) return null; const ae = te * 3.2;
      return <mesh key={i} position={[Math.cos(ae) * 0.06 + Math.cos(ae + 2) * 0.13 + (rn(i, 4) - 0.5) * 0.05, age * 0.12, Math.sin(ae) * 0.06 + Math.sin(ae + 2) * 0.13]} scale={0.006 + 0.012 * age}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#b7b2a6" transparent opacity={0.55 * (1 - age / 1.3)} depthWrite={false} /></mesh>; })}
    <Sombra p={[dx, -0.006, dz]} r={0.2} o={0.6 * (1 - lift)} />
    <group position={[dx, 0.014 + 0.18 * lift, dz + 0.1 * lift]} rotation={[lift * 1.0, -a * (1 - lift), 0]}>
      <mesh castShadow><cylinderGeometry args={[0.15, 0.15, 0.028, 64]} /><meshPhysicalMaterial color={col("#bdb6a4", CERA, bri)} clearcoat={bri} roughness={lerp(0.7, 0.06, bri)} /></mesh>
      <mesh position={[0.05, 0.015, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.07, 0.025]} /><meshStandardMaterial color="#8a8374" transparent opacity={1 - bri} /></mesh>
      {sw > 0 && sw < 1 && <mesh position={[lerp(-0.15, 0.15, sw), 0.0155, 0]} rotation={[-P2, 0, 0.5]}><planeGeometry args={[0.035, 0.34]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85 * Math.sin(sw * P)} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>}
    </group>
  </Estudio>;
}}</Stage>;

// 14 · DECENAS DE CARTUCHOS: muro de 24 cartuchos con estrías distintas; baja el viejo gastado, un escáner ancho barre fila por fila (lo demás se apaga) y enciende el único igual con halo dorado
const Cartucho: React.FC<{ p?: V3; s?: number; hh: number; r: number; n: number; c: string; dim?: number; gast?: number }> = ({ p, s = 1, hh, r, n, c, dim = 0, gast = 0 }) => {
  const k = col(c, "#141210", dim * 0.75);
  return <group position={p} scale={s}>
    <mesh castShadow><cylinderGeometry args={[r, r, hh, 28]} /><meshStandardMaterial color={k} roughness={0.45} metalness={0.35} /></mesh>
    <mesh position={[0, -hh / 2, 0]}><cylinderGeometry args={[r * 1.08, r * 1.08, 0.016, 28]} /><meshStandardMaterial color={col("#ece7dc", "#141210", dim * 0.75)} roughness={0.6} /></mesh>
    <mesh position={[0, hh / 2 + 0.03, 0]}><cylinderGeometry args={[r * 0.42, r * 0.42, 0.06, 20]} /><meshStandardMaterial color={col(BRONCE, "#141210", dim * 0.75)} roughness={0.32} metalness={0.9} /></mesh>
    {Array.from({ length: n }, (_, i) => { const a = (i / n) * 2 * P; return <mesh key={i} position={[Math.cos(a) * r * 0.45, hh / 2 + 0.03, Math.sin(a) * r * 0.45]} rotation={[0, -a, 0]}><boxGeometry args={[0.007, 0.058, 0.006]} /><meshStandardMaterial color={col(BRONCE, "#141210", dim * 0.75)} roughness={0.32} metalness={0.9} /></mesh>; })}
    {gast > 0 && Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[Math.cos(i * 2.1) * r * 1.0, (rn(i, 3) - 0.5) * hh * 0.8, Math.sin(i * 2.1) * r * 1.0]} scale={0.009 * gast}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={SARRO} roughness={0.95} /></mesh>)}
  </group>;
};
const CEstrias: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const hit = 13, dn = eio(tt, 0.1, 0.8), mv = eio(tt, 0.85, 1.25), row = Math.floor((tt - 1.0) / 0.85), sc = cl(((tt - 1.0) % 0.85) / 0.85), found = tt > 3.6;
  const cols = ["#e9e6de", "#b8bcc2", "#2b2b2b", "#d9c48a", "#cfd8de"], sx = lerp(-0.98, 0.98, sc), fly = eio(tt, 3.8, 4.3);
  const spec = (i: number) => ({ hh: 0.13 + 0.06 * rn(i, 1), r: 0.038 + 0.02 * rn(i, 2), n: 8 + Math.floor(rn(i, 3) * 16), c: cols[i % 5] });
  const old = { hh: spec(hit).hh, r: spec(hit).r, n: spec(hit).n, c: "#8f897a" };
  return <Estudio t={tt} cam={[0.0, 0.02, 1.62]} look={[0, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, 0.18, -0.12]} receiveShadow><planeGeometry args={[2.2, 0.9]} /><meshStandardMaterial map={ruido("pegboard", ["#3a3430", "#2a2522"], 900, 2.2)} roughness={0.8} /></mesh>
    {Array.from({ length: 24 }, (_, i) => { const r = Math.floor(i / 8), x = -0.84 + (i % 8) * 0.24, y = 0.42 - r * 0.24, sp = spec(i);
      const active = tt > 1.0 && tt < 3.55 && r === row, near = active && Math.abs(x - sx) < 0.16, dim = found ? (i === hit ? 0 : 0.85) : tt > 1.0 ? (near ? 0 : 0.7) : 0;
      const isHit = i === hit && found, pos: V3 = isHit ? [lerp(x, -0.32, fly), lerp(y, -0.28, fly), lerp(0, 0.35, fly)] : [x, y, 0];
      return <group key={i}>
        <Cartucho p={pos} s={isHit ? lerp(1.15, 1.7, fly) : 1} {...sp} dim={dim} />
        {isHit && <mesh position={pos} rotation={[0, 0, tt * 2]}><torusGeometry args={[0.11 * lerp(1, 1.4, fly), 0.008, 10, 48]} /><meshBasicMaterial color="#ffd257" toneMapped={false} /></mesh>}
      </group>; })}
    {tt > 1.0 && tt < 3.55 && <mesh position={[sx, 0.42 - row * 0.24, 0.12]}><planeGeometry args={[0.26, 0.24]} /><meshBasicMaterial color="#9fd6ff" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>}
    {tt > 1.0 && tt < 3.55 && <mesh position={[sx, 0.42 - row * 0.24, 0.13]}><planeGeometry args={[0.012, 0.24]} /><meshBasicMaterial color="#d8f0ff" toneMapped={false} /></mesh>}
    <Cartucho p={[lerp(0, -0.62, mv), lerp(0.75, -0.26, dn) - 0.0 * mv, lerp(0.45, 0.35, mv)]} s={lerp(2.2, 1.7, mv)} {...old} gast={1} />
  </Estudio>;
}}</Stage>;

// 15 · VASELINA vs SILICÓN: dos vástagos en corte con su anillo de hule en el canal; el de vaselina se hincha en cámara lenta y se sale del canal mientras el calendario arranca meses; el de silicón queda igual
const Canal: React.FC<{ p: V3; k: number; s?: number }> = ({ p, k, s = 2.3 }) => {
  const R = lerp(0.062, 0.078, k), tb = lerp(0.012, 0.022, k);
  return <group position={p} scale={s}>
    {[[0.075, 0.09], [-0.075, 0.09]].map(([y, hh], i) => <group key={i} position={[0, y, 0]}>
      <mesh><cylinderGeometry args={[0.07, 0.07, hh, 40, 1, false, P2, P]} />{bronce()}</mesh>
      <mesh position={[0, 0, 0.0005]}><planeGeometry args={[0.14, hh]} /><meshStandardMaterial color="#a8742e" roughness={0.5} metalness={0.6} /></mesh>
    </group>)}
    <mesh><cylinderGeometry args={[0.05, 0.05, 0.06, 40, 1, false, P2, P]} />{bronce()}</mesh>
    <mesh position={[0, 0, 0.0005]}><planeGeometry args={[0.1, 0.06]} /><meshStandardMaterial color="#a8742e" roughness={0.5} metalness={0.6} /></mesh>
    <mesh rotation={[-P2, 0, 0]} scale={[1, 1, 1 + 0.4 * k]}><torusGeometry args={[R, tb, 16, 48, P]} />{hule()}</mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * R, 0, 0.0008]} scale={[1, 1 + 0.4 * k, 1]}><circleGeometry args={[tb, 24]} /><meshStandardMaterial color="#4a4542" roughness={0.8} /></mesh>)}
  </group>;
};
const CHincha: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const k = eio(tt, 0.6, 4.0), mf = k * 2.99, mes = Math.floor(mf), arr = eio(mf - mes, 0.55, 0.95);
  return <Estudio t={tt} cam={[0.0, 0.12, 1.05]} look={[0, 0.02, 0]} orbit={0.01} mesa={false} fit={false}>
    <Pared z={-0.55} dim={0.35} />
    <Piso y={-0.3} dim={0.55} />
    <Canal p={[-0.36, -0.02, 0]} k={k} />
    <Canal p={[0.36, -0.02, 0]} k={0} />
    {[-0.36, 0.36].map((x, i) => <Sombra key={i} p={[x, -0.298, 0]} r={0.22} o={0.6} />)}
    {[-0.36, 0.36].map((x, i) => <mesh key={i} position={[x, -0.29, 0]} castShadow><cylinderGeometry args={[0.2, 0.22, 0.02, 40]} /><meshStandardMaterial color={i === 0 ? "#e8d6a8" : "#dfe6ea"} roughness={0.5} /></mesh>)}
    <Calendario p={[0, 0.18, -0.15]} s={0.42} arranca={arr} dia={String(mes + 1)} mes="MES" />
  </Estudio>;
}}</Stage>;

// 16 · A MANO Y UN CUARTO: la tuerca baja a mano hasta el tope (anillo verde); la llave ajustable real la muerde y gira; un transportador en el piso se llena de verde hasta 90° — al pasarse se pone rojo y vibra, y vuelve
const transportador = () => ctex("c4c:transp", 512, 512, (g) => {
  g.clearRect(0, 0, 512, 512); g.strokeStyle = "rgba(246,241,228,.85)"; g.lineWidth = 4; g.beginPath(); g.arc(256, 256, 236, -P2, 0); g.stroke();
  for (let d = 0; d <= 90; d += 5) { const a = -(d / 180) * P, r0 = d % 45 === 0 ? 196 : d % 15 === 0 ? 212 : 222; g.lineWidth = d % 45 === 0 ? 5 : 3; g.beginPath(); g.moveTo(256 + Math.cos(a) * r0, 256 + Math.sin(a) * r0); g.lineTo(256 + Math.cos(a) * 236, 256 + Math.sin(a) * 236); g.stroke(); }
  g.fillStyle = "rgba(246,241,228,.95)"; g.font = "800 34px Inter, Arial"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("0°", 256 + 170, 256 - 14); g.fillText("45°", 256 + 125, 256 - 125); g.fillText("90°", 256 + 18, 256 - 172);
});
const Ajustable: React.FC<{ boca: number }> = ({ boca }) => <group>
  <RBox p={[0.33, 0, 0]} s={[0.44, 0.026, 0.065]} r={0.012}>{M.cromo("#c4c8ce")}</RBox>
  <mesh position={[0.56, 0, 0]}><cylinderGeometry args={[0.016, 0.016, 0.028, 16]} /><meshStandardMaterial color="#1c1a19" /></mesh>
  <RBox p={[0.08, 0, 0]} s={[0.12, 0.032, 0.2]} r={0.012}>{M.cromo("#d0d4d9")}</RBox>
  <RBox p={[0.0, 0, -0.095]} s={[0.07, 0.032, 0.05]} r={0.01}>{M.cromo("#d0d4d9")}</RBox>
  <RBox p={[0.0, 0, lerp(0.15, 0.095, boca)]} s={[0.07, 0.03, 0.05]} r={0.01}>{M.cromo("#bfc3c8")}</RBox>
  <mesh position={[0.07, -0.02, 0.06]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.014, 0.014, 0.07, 14]} />{M.cromo("#9ea3a9")}</mesh>
  {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0.07, -0.02, 0.03 + i * 0.011]}><torusGeometry args={[0.0145, 0.003, 6, 16]} />{M.cromo("#8a8f95")}</mesh>)}
</group>;
const CCuarto: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const man = eio(tt, 0.2, 1.5), arr = eio(tt, 1.6, 2.1), boca = eio(tt, 2.1, 2.3), q = eio(tt, 2.4, 3.2), over = eio(tt, 3.35, 3.7) * (1 - eio(tt, 3.85, 4.25));
  const phi0 = P2, phi = phi0 - q * P2 - over * 0.55, sh = over > 0.3 ? 0.008 * Math.sin(tt * 70) : 0, nutRot = man * 6 * P + (phi0 - phi);
  return <Estudio t={tt} cam={[0.0, 0.78, 0.66]} look={[0.12, 0.0, -0.06]} orbit={0.01} mesa={false} fit={false}>
    <Piso y={-0.07} dim={0.5} />
    <mesh position={[0, -0.066, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.72, 0.72]} /><meshBasicMaterial map={transportador()} transparent depthWrite={false} toneMapped={false} /></mesh>
    {q > 0.01 && <mesh position={[0, -0.064, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.07, 0.33, 64, 1, phi, phi0 - phi]} /><meshBasicMaterial color={over > 0.1 ? RED : VER} transparent opacity={0.55} side={THREE.DoubleSide} toneMapped={false} depthWrite={false} /></mesh>}
    <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.045, 0.045, 0.1, 24]} />{bronce()}</mesh>
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0, -0.06 + i * 0.012, 0]}><torusGeometry args={[0.046, 0.004, 6, 24]} />{bronce()}</mesh>)}
    <mesh position={[sh, lerp(0.16, 0.0, man), 0]} rotation={[0, -nutRot, 0]} castShadow><cylinderGeometry args={[0.085, 0.085, 0.055, 6]} />{M.cromo("#dfe2e5")}</mesh>
    {man > 0.98 && tt < 2.2 && <mesh position={[0, 0.03, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.1, 0.112, 48]} /><meshBasicMaterial color={VER} toneMapped={false} /></mesh>}
    {arr > 0.01 && <group position={[sh + 0.6 * (1 - arr), 0.0, 0]} rotation={[0, phi, 0]}><Ajustable boca={boca} /></group>}
  </Estudio>;
}}</Stage>;

// 17 · LAS ESCUPIDAS DE AIRE: tubo transparente lleno de agua azul; burbujas grandes la empujan y en el pico cada una revienta en abanico… hasta que el chorro queda parejo
const AIRE: V3[] = [[-0.85, -0.18, 0], [-0.05, -0.18, 0], [0.1, -0.14, 0], [0.15, 0.0, 0], [0.15, 0.2, 0], [0.2, 0.29, 0], [0.32, 0.3, 0], [0.38, 0.24, 0]];
const CAire: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const curva = memo("c4c:airecv", () => new THREE.CatmullRomCurve3(AIRE.map((p) => new THREE.Vector3(...p)), false, "centripetal"));
  const llegan = [0.9, 1.6, 2.3, 2.9], fin = eio(tt, 3.2, 3.5), tip: V3 = [0.385, 0.22, 0];
  return <Estudio t={tt} cam={[0.0, 0.06, 1.12]} look={[-0.05, 0.03, 0]} orbit={0.01} mesa={false} fit={false}>
    <Pared z={-0.5} dim={0.35} />
    <mesh geometry={memo("c4c:airetubo", () => tuboGeo(AIRE, 0.055, 120, 24))}>{M.vidrio()}</mesh>
    <mesh geometry={memo("c4c:aireagua", () => tuboGeo(AIRE, 0.046, 120, 20))}>{AGUA(0.6, "#3a93dc")}</mesh>
    {llegan.map((ta, i) => { const u = 1 - (ta - tt) * 0.42; if (u < 0 || u > 1) return null; const p = curva.getPointAt(u);
      return <mesh key={i} position={[p.x, p.y, p.z + 0.005]} scale={[0.05, 0.04, 0.04]}><sphereGeometry args={[1, 18, 12]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.85} roughness={0} clearcoat={1} /></mesh>; })}
    {llegan.map((ta, i) => { const q = (tt - ta) / 0.5; if (q < 0 || q > 1) return null;
      return <group key={i}>{Array.from({ length: 12 }, (_, j) => { const a = -P2 + (j / 11 - 0.5) * 1.8; return <mesh key={j} position={[tip[0] + Math.cos(a) * 0.22 * q, tip[1] + Math.sin(a) * 0.22 * q - 0.2 * q * q, 0]} scale={0.012 * (1 - q * 0.5)}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.9, "#9fd4f6")}</mesh>; })}
        <mesh position={tip} scale={0.02 + 0.06 * q}><sphereGeometry args={[1, 14, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.5 * (1 - q)} depthWrite={false} toneMapped={false} /></mesh></group>; })}
    {fin < 1 && Array.from({ length: 8 }, (_, i) => { const q = (tt * 2.2 + i / 8) % 1, on = Math.sin(tt * 7 + i * 2) > 0.2 ? 1 : 0; return <mesh key={i} position={[tip[0], tip[1] - q * 0.5, 0]} scale={0.014 * on * (1 - fin) + 0.0001}><sphereGeometry args={[1, 10, 8]} />{AGUA(0.9, "#9fd4f6")}</mesh>; })}
    {fin > 0 && <Chorro a={tip} b={[tip[0], lerp(tip[1], -0.42, fin), 0]} r={0.018} c="#8cc8f0" o={0.85} />}
  </Estudio>;
}}</Stage>;

// 18 · LA BARRETA DE DON ARTURO: la llave general con costra verde y óxido; la barreta hace palanca sobre un taco de madera, una grieta de luz recorre el vástago (zoom)… y se parte: el vástago vuela y el agua sale en abanico con la cámara temblando
const CBarreta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const pr = eio(tt, 0.4, 2.4), cr = eio(tt, 1.2, 2.4), br = tt > 2.55, sp = eio(tt, 2.55, 3.2), fl = cl((tt - 2.55) / 1.4);
  const zm = eio(tt, 1.0, 2.4) * (1 - eio(tt, 2.6, 3.1)), sh = br ? Math.exp(-(tt - 2.55) * 2.5) * 0.02 : 0;
  const cam: V3 = [Math.sin(tt * 60) * sh, lerp(0.28, 0.2, zm) + Math.cos(tt * 53) * sh, lerp(1.25, 0.82, zm)];
  const ox = ruido("oxido", ["#6e5236", "#4f7a5a", "#7d4a2a", "#3e6b54", "#8a6a3a"], 2600, 3.5);
  return <Estudio t={tt} cam={cam} look={[0.05, 0.12, 0]} orbit={0.0} mesa={false} fit={false}>
    <Pared z={-0.6} dim={0.3} />
    <Piso y={-0.2} dim={0.45} />
    <mesh rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.07, 0.07, 1.6, 28]} /><meshStandardMaterial map={ox} roughness={0.85} metalness={0.3} /></mesh>
    <mesh castShadow><sphereGeometry args={[0.14, 32, 24]} /><meshStandardMaterial map={ox} roughness={0.9} metalness={0.25} /></mesh>
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[Math.cos(i * 2.4) * 0.13, Math.sin(i * 1.7) * 0.11, Math.abs(Math.sin(i * 2.4)) * 0.11 + 0.02]} scale={0.02 + 0.015 * rn(i, 2)}><dodecahedronGeometry args={[1]} /><meshStandardMaterial color={i % 2 ? "#5d8a6a" : "#a8c3a0"} roughness={1} /></mesh>)}
    <RBox p={[0.36, -0.13, 0.02]} s={[0.16, 0.1, 0.12]} r={0.01}>{M.madera("#a07040")}</RBox>
    <group position={br ? [0.12 * fl, 0.17 + 0.9 * fl - 1.2 * fl * fl, 0.15 * fl] : [0, 0.17, 0]} rotation={br ? [fl * 5, 0, fl * 7] : [0, 0, 0]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.025, 0.025, 0.12, 12]} /><meshStandardMaterial color="#8a6a3a" metalness={0.6} roughness={0.5} /></mesh>
      <mesh position={[0, 0.1, 0]} rotation={[P2, 0, 0]} castShadow><torusGeometry args={[0.1, 0.016, 10, 32]} /><meshStandardMaterial color="#b0352a" roughness={0.75} /></mesh>
      {[0, 1].map((q) => <mesh key={q} position={[0, 0.1, 0]} rotation={[0, q * P2, P2]}><cylinderGeometry args={[0.008, 0.008, 0.2, 8]} /><meshStandardMaterial color="#b0352a" roughness={0.75} /></mesh>)}
    </group>
    {!br && <group position={[0.0, 0.27, 0.0]} rotation={[0, 0, -0.32 * pr + 0.15]}><mesh position={[0.38, 0, 0.03]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.016, 0.016, 0.8, 12]} />{M.hierro()}</mesh></group>}
    {br && <group position={[0, 0.22, 0]} rotation={[0, 0, -0.55]}><mesh position={[0.38, 0, 0.03]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.016, 0.016, 0.8, 12]} />{M.hierro()}</mesh></group>}
    {cr > 0.02 && !br && <mesh position={[0.026, 0.14 + 0.05 * cr, 0.0]}><boxGeometry args={[0.005, 0.1 * cr, 0.005]} /><meshBasicMaterial color={tt % 0.16 < 0.08 ? "#ffffff" : "#ffe2a0"} toneMapped={false} /></mesh>}
    {br && Array.from({ length: 9 }, (_, i) => { const a = -0.8 + i * 0.2; return <Chorro key={i} a={[0, 0.15, 0]} b={[Math.sin(a) * 0.38 * sp, 0.15 + 0.38 * sp * Math.cos(a), 0.05]} r={0.011} c="#9fd0ee" o={0.8} />; })}
  </Estudio>;
}}</Stage>;

// 19 · EL RELOJ DE BOLSILLO: cada minuto nombrado, la aguja salta y la pieza de ese minuto (3 veces más grande) entra volando en órbita con estela, se acerca a cámara, da una vuelta y se acomoda
const CReloj: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const ats = [0, 1, 2, 3, 4, 5].map((i) => AT(h, i, 1.5)), n = ats.filter((a) => tt >= a).length;
  const ico = (i: number) => [<LlavePaso s={0.85} giro={1} />,
    <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.03, 28]} /><meshStandardMaterial color="#c0392b" roughness={0.35} /></mesh>,
    <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.06, 6]} />{bronce()}</mesh>,
    <Arandela s={1.6} rot={[0, 0, 0]} />,
    <group rotation={[0, 0, 0.6]}><mesh><cylinderGeometry args={[0.035, 0.035, 0.28, 18]} />{bronce()}</mesh><mesh position={[0, -0.15, 0]}><cylinderGeometry args={[0.05, 0.05, 0.03, 20]} />{hule()}</mesh></group>,
    <mesh rotation={[0.3, 0, 0]}><planeGeometry args={[0.2, 0.16]} /><meshStandardMaterial map={papel4c()} side={THREE.DoubleSide} /></mesh>][i];
  const jump = n > 0 ? Math.exp(-(tt - ats[n - 1]) * 6) * Math.sin((tt - ats[n - 1]) * 30) * 0.01 : 0;
  return <Estudio t={tt} cam={[0.0, 0.06, 1.32]} look={[0, 0.03, 0]} orbit={0.01} mesa={false} fit={false}>
    <Pared z={-0.6} dim={0.32} />
    <group position={[0, 0.03, 0]}><Reloj4 k={Math.max(0, n - 1) / 12 + jump} /></group>
    {ats.map((a, i) => { const lt = tt - a; if (lt < 0) return null; const ang = P2 - (i / 6) * 2 * P, slot: V3 = [Math.cos(ang) * 0.6, 0.03 + Math.sin(ang) * 0.34, 0.05];
      const fly = eio(lt, 0, 1.0), near = eio(lt, 1.0, 1.6) * (1 - eio(lt, 2.3, 2.9)), a0 = ang + 2.4 * (1 - fly);
      const orb: V3 = [Math.cos(a0) * lerp(1.1, 0.6, fly), 0.03 + Math.sin(a0) * lerp(0.7, 0.34, fly), 0.05], pos: V3 = [lerp(orb[0], 0.0, near), lerp(orb[1], 0.0, near), lerp(orb[2], 0.5, near)];
      return <group key={i}>
        {fly < 1 && Array.from({ length: 7 }, (_, j) => { const aj = ang + 2.4 * (1 - cl(fly - j * 0.04)); return <mesh key={j} position={[Math.cos(aj) * lerp(1.1, 0.6, fly), 0.03 + Math.sin(aj) * lerp(0.7, 0.34, fly), 0.04]} scale={0.012 * (1 - j / 7)}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color={MZ} transparent opacity={0.8 * (1 - j / 7)} toneMapped={false} /></mesh>; })}
        <group position={pos} scale={lerp(1, 1.5, near)} rotation={[0.3 * (1 - near), tt * 0.5 * (1 - near) + near * 2 * P * eio(lt, 1.6, 2.3), 0]}>{ico(i)}</group>
      </group>; })}
    <Tag tt={tt} at={ats[0]} x={960} y={150} txt={"minuto " + Math.max(0, n - 1)} col={MZ} size={110} />
  </Estudio>;
}}</Stage>;
const papel4c = () => cartel("papel", "✓", 256, 200, "#2e7d32", "#f8f6f0", 150);
const Reloj4: React.FC<{ k: number }> = ({ k }) => <group>
  <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.27, 0.27, 0.06, 56]} />{M.cromo("#d9c46a")}</mesh>
  <mesh position={[0, 0, 0.031]}><circleGeometry args={[0.245, 56]} /><meshStandardMaterial color="#fbf8f0" roughness={0.5} /></mesh>
  {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i / 12 * 2 * P) * 0.205, Math.cos(i / 12 * 2 * P) * 0.205, 0.034]} rotation={[0, 0, -i / 12 * 2 * P]}><boxGeometry args={[i % 3 ? 0.008 : 0.016, i % 3 ? 0.03 : 0.05, 0.004]} /><meshBasicMaterial color="#222" /></mesh>)}
  {[0, 1, 2, 3, 4, 5].map((i) => <mesh key={i} position={[Math.sin(i / 12 * 2 * P) * 0.155, Math.cos(i / 12 * 2 * P) * 0.155, 0.034]}><planeGeometry args={[0.05, 0.05]} /><meshBasicMaterial map={placa("rl" + i, String(i), "#2a2420", "#fbf8f0", 170)} toneMapped={false} /></mesh>)}
  <group position={[0, 0, 0.04]} rotation={[0, 0, -k * 2 * P]}><mesh position={[0, 0.085, 0]}><boxGeometry args={[0.012, 0.19, 0.005]} /><meshStandardMaterial color="#c0392b" /></mesh></group>
  <mesh position={[0, 0, 0.045]}><cylinderGeometry args={[0.014, 0.014, 0.01, 16]} />{M.cromo("#d9c46a")}</mesh>
  <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.07, 16]} />{M.cromo("#d9c46a")}</mesh>
  <mesh position={[0, 0.355, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.04, 0.008, 8, 24]} />{M.cromo("#d9c46a")}</mesh>
</group>;

// 20 · EL AIREADOR EN VINAGRE: el aireador grande (malla y granitos de cal) en primer plano; cae al frasco «VINAGRE» con salpicadura; la luna cruza detrás (pasa la noche) y los granitos se desprenden en nube de burbujas
const mallaTex = () => ctex("c4c:malla", 256, 256, (g) => { g.clearRect(0, 0, 256, 256); g.strokeStyle = "#cfd3d8"; g.lineWidth = 3; for (let i = 0; i <= 256; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); } });
const frascoGeo4 = () => memo("c4c:frasco", () => lathe([[0, 0], [0.17, 0], [0.18, 0.02], [0.185, 0.36], [0.16, 0.4], [0.13, 0.42], [0.13, 0.46]], 48));
const CAireador: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const dr = eio(tt, 0.9, 1.45), nite = eio(tt, 1.5, 2.0), mo = eio(tt, 1.6, 4.2), dis = eio(tt, 2.0, 4.0), spl = cl((tt - 1.4) / 0.5);
  const ap: V3 = [lerp(-0.05, 0.12, dr), lerp(0.22, -0.3, dr), lerp(0.42, 0.0, dr)];
  return <Estudio t={tt} cam={[0.0, 0.18, 1.12]} look={[0.04, 0.0, 0]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, 0.2, -0.7]}><planeGeometry args={[2.6, 1.6]} /><meshBasicMaterial color={col("#5a4636", "#0e1a30", nite)} toneMapped={false} /></mesh>
    {nite > 0.05 && <Luna p={[lerp(-0.75, 0.75, mo), 0.42 + 0.1 * Math.sin(mo * P), -0.65]} r={0.065} />}
    {nite > 0.05 && <pointLight position={[0.2, 0.5, 0.2]} intensity={2.5 * nite} distance={3} color="#86a8ff" />}
    <Piso y={-0.42} dim={lerp(0.6, 0.3, nite)} />
    <group position={[0.12, -0.42, 0]}>
      <mesh geometry={frascoGeo4()} castShadow>{M.vidrio()}</mesh>
      <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.175, 0.165, 0.3, 40]} />{AGUA(0.45, "#d8a24a")}</mesh>
      <mesh position={[0, 0.2, 0.188]}><planeGeometry args={[0.22, 0.09]} /><meshStandardMaterial map={cartel("vinagre", "VINAGRE", 512, 200, "#7a1f12", "#f3ead2", 110)} roughness={0.8} /></mesh>
      <Sombra p={[0, 0.002, 0]} r={0.26} o={0.6} />
    </group>
    <mesh position={[-0.2, -0.405, 0.12]} rotation={[0.2, 0, 0.1]} castShadow><cylinderGeometry args={[0.135, 0.135, 0.04, 36]} /><meshStandardMaterial color="#c8a02a" roughness={0.35} metalness={0.7} /></mesh>
    <group position={ap} scale={lerp(2.6, 1.3, dr)} rotation={[lerp(1.1, 0.3, dr), tt * 0.4, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.06, 0.06, 0.045, 32, 1, true]} />{M.cromo()}</mesh>
      <mesh position={[0, 0.024, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.06, 0.006, 8, 32]} />{M.cromo()}</mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.058, 32]} /><meshStandardMaterial map={mallaTex()} transparent metalness={0.8} roughness={0.3} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 22 }, (_, i) => { const d = cl((dis - rn(i, 2) * 0.7) * 2.5); return <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.09, 0.014 + d * 0.12, (rn(i, 3) - 0.5) * 0.09]} scale={0.0075 * (1 - d) + 0.0002}><dodecahedronGeometry args={[1]} /><meshStandardMaterial color={SARRO} roughness={0.95} /></mesh>; })}
    </group>
    {spl > 0 && spl < 1 && Array.from({ length: 12 }, (_, j) => { const a = (j / 12) * 2 * P; return <mesh key={j} position={[0.12 + Math.cos(a) * 0.12 * spl, -0.12 + 0.12 * Math.sin(spl * P), Math.sin(a) * 0.12 * spl]} scale={0.01 * (1 - spl)}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.9, "#f0c878")}</mesh>; })}
    {tt > 1.5 && Array.from({ length: 16 }, (_, i) => { const q = (tt * 0.5 + i / 16) % 1; return <mesh key={i} position={[0.12 + (rn(i, 7) - 0.5) * 0.1, -0.3 + q * 0.28, (rn(i, 8) - 0.5) * 0.1]} scale={(0.005 + 0.004 * rn(i, 9)) * nite}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#fff6e0" transparent opacity={0.7 * (1 - q)} toneMapped={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 21 · EL REPASO QUE SE GUARDA: la cámara viaja a cada casillero de una repisa de baño; una gota de vidrio grande cae, se aplasta y se convierte en el objeto del consejo, grande y con sombra
const CRecap: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const n = Math.min(7, h.items?.length ?? 7), ats = Array.from({ length: n }, (_, i) => AT(h, i, 1.2)), X = (i: number) => -0.9 + i * 0.3, YS = -0.2;
  let cx = X(0); for (let i = 1; i < n; i++) cx = lerp(cx, X(i), eio(tt, ats[i] - 0.35, ats[i] + 0.35));
  const ob = (i: number) => [<Cubeta s={0.36} nivel={0.6} c="#2f6fb0" agua="#8fc0dc" />, <Pico s={0.5} />,
    <Arandela s={1.7} c={HULEV} ap={0.7} p={[0, 0.03, 0]} />, <LlavePaso s={0.75} giro={1} p={[0, 0.17, 0]} />,
    <group position={[0, 0.03, 0]}><mesh castShadow><cylinderGeometry args={[0.09, 0.09, 0.025, 48]} />{cera()}</mesh><mesh position={[0.03, 0.03, 0]} castShadow rotation={[0, 0, 0.15]}><cylinderGeometry args={[0.09, 0.09, 0.025, 48]} />{cera()}</mesh></group>,
    <group position={[0, 0.03, 0]}><mesh castShadow><cylinderGeometry args={[0.08, 0.08, 0.05, 6]} />{M.cromo()}</mesh><mesh position={[0, 0.03, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.1, 0.112, 40, 1, 0, P2]} /><meshBasicMaterial color={VER} toneMapped={false} side={THREE.DoubleSide} /></mesh></group>,
    <group position={[0, 0.08, 0]}><mesh rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.5, 20]} /><meshStandardMaterial map={ruido("oxido", ["#6e5236", "#4f7a5a", "#7d4a2a", "#3e6b54", "#8a6a3a"], 2600, 3.5)} roughness={0.9} /></mesh>{[-1, 1].map((q) => <mesh key={q} position={[q * 0.1, 0, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.052, 0.052, 0.05, 6]} /><meshStandardMaterial map={ruido("oxido", ["#6e5236", "#4f7a5a", "#7d4a2a", "#3e6b54", "#8a6a3a"], 2600, 3.5)} roughness={0.85} /></mesh>)}<mesh castShadow><sphereGeometry args={[0.065, 24, 18]} /><meshStandardMaterial map={ruido("oxido", ["#6e5236", "#4f7a5a", "#7d4a2a", "#3e6b54", "#8a6a3a"], 2600, 3.5)} roughness={0.9} /></mesh><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.014, 0.014, 0.12, 12]} /><meshStandardMaterial color="#6e5236" roughness={0.9} /></mesh><group position={[0, 0.16, 0]} rotation={[-0.35, 0, 0]}><mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.075, 0.013, 10, 32]} /><meshStandardMaterial color="#b0352a" roughness={0.75} /></mesh>{[0, 1].map((q) => <mesh key={q} rotation={[0, q * P2, P2]}><cylinderGeometry args={[0.007, 0.007, 0.15, 8]} /><meshStandardMaterial color="#b0352a" roughness={0.75} /></mesh>)}</group></group>][i];
  return <Estudio t={tt} cam={[cx, 0.12, 0.98]} look={[cx, -0.06, 0]} orbit={0.0} mesa={false} fit={false}>
    <mesh position={[0, 0.2, -0.22]} receiveShadow><planeGeometry args={[4.6, 1.6]} /><meshStandardMaterial map={azulejo(13, 4.5)} color="#d8d4cc" roughness={0.3} /></mesh>
    <pointLight position={[cx - 0.7, 0.5, 0.5]} intensity={5} distance={3} color="#ffe2bc" />
    <RBox p={[0, YS - 0.03, 0]} s={[3.4, 0.06, 0.32]} r={0.012}><meshPhysicalMaterial color="#f5f3ee" clearcoat={1} roughness={0.18} /></RBox>
    {ats.map((a, i) => { const x = X(i), lt = tt - a, fallK = cl(lt / 0.7), yd = lerp(0.45, YS + 0.1, fallK * fallK) + (lt < 0 ? 0.02 * Math.sin(tt * 5) : 0), squash = eio(lt, 0.66, 0.82), morph = eio(lt, 0.82, 1.15), on = IN(tt, a + 0.82);
      return <group key={i}>
        {lt > -0.7 && morph < 1 && <mesh position={[x, yd - 0.02 * squash, 0.02]} scale={[0.1 * (1 + 0.6 * squash) * (1 - morph), 0.12 * (1 - 0.5 * squash) * (1 - morph) + 0.0001, 0.1 * (1 + 0.6 * squash) * (1 - morph)]}><sphereGeometry args={[1, 32, 24]} /><meshPhysicalMaterial color="#9fd4ff" roughness={0} clearcoat={1} metalness={0.1} transparent opacity={0.88} ior={1.33} emissive="#2a6aa8" emissiveIntensity={0.35} /></mesh>}
        <group position={[x, YS, 0.02]} scale={on + 0.0001} rotation={[0, 0.5 + (i === n - 1 ? tt * 0.15 : 0), 0]}>{ob(i)}</group>
        {on > 0.1 && <Sombra p={[x, YS + 0.002, 0.02]} r={0.14} o={0.55 * cl(on)} />}
        <mesh position={[x, YS - 0.03, 0.162]}><planeGeometry args={[0.06, 0.04]} /><meshBasicMaterial map={placa("n" + (i + 1), String(i + 1), "#f6f1e4", "#2a2420", 160)} transparent opacity={cl(on)} toneMapped={false} /></mesh>
      </group>; })}
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  c_odometro: COdometro, c_aplasta: CAplasta, c_cafe: CCafe, c_rosa: CRosa, c_vaso: CVaso, c_corte: CCorte, c_tres: CTres, c_suela: CSuela,
  c_raya: CRaya, c_flujo: CFlujo, c_iman: CIman, c_despiece: CDespiece, c_lija: CLija, c_estrias: CEstrias, c_hincha: CHincha, c_cuarto: CCuarto,
  c_aire: CAire, c_barreta: CBarreta, c_reloj: CReloj, c_aireador: CAireador, c_recap: CRecap,
};
