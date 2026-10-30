// plo29a · FREGADERO 25 AÑOS SIN TAPARSE · componentes únicos 3D (uno por idea del guion; ninguno se repite en la tanda).
// v2 (evaluador vuelta 1): cada uno = OBJETO reconocible sin leer + el MECANISMO visible (líquido, granos, grieta, espuma) + cambio claro entre el medio y la salida.
// Línea de tiempo de los héroes sin ítems: tt 0 → ~4,8 (el Stage estira la animación a todo el héroe). Nada aparece de golpe: cae, se desliza o crece con resorte.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, phys, RED, Stage, Tag, VER } from "./ckit";
import { ctex, Estudio, fall, lathe, M, papel, RBox, rn, V3, Vapor } from "./estudio3d";
import { Chorro, Mano, Onda } from "./kit3d";
import { ACERO, AGUA, Botella, CanoCorte, Canilla, Copa, Cubeta, Espatula, Frasco, Gota, GOMA, GRASA, Granos, Guante, Linterna, Nido, PVC, Rejilla, Reloj, Sarten, Sifon, Sonda, Tarja, Taza, Tetera, Tubo, tuboGeo } from "./kitplo";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;
const rel = (h: H, i: number) => (h.items?.[i]?.a ?? h.at + 99) - h.at; // segundo (relativo) en que se nombra el ítem i
const IN = (tt: number, a: number) => phys(tt, a, 7, 0.45);
const CACHE = new Map<string, unknown>();
const memo = <T,>(k: string, f: () => T): T => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k) as T; };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const AZUL = "#4f9fd0";

// ── utilería propia de este video ─────────────────────────────────────────
const calavera = (bg: string) => ctex("calav" + bg, 512, 512, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, 512, 512);
  g.strokeStyle = "#111"; g.lineWidth = 38; g.lineCap = "round";
  g.beginPath(); g.moveTo(120, 330); g.lineTo(392, 450); g.moveTo(392, 330); g.lineTo(120, 450); g.stroke();
  g.fillStyle = "#111"; g.beginPath(); g.arc(256, 210, 130, 0, 7); g.fill(); g.fillRect(186, 280, 140, 90);
  g.fillStyle = bg; g.beginPath(); g.arc(205, 205, 38, 0, 7); g.arc(307, 205, 38, 0, 7); g.fill();
  g.beginPath(); g.moveTo(256, 250); g.lineTo(236, 290); g.lineTo(276, 290); g.fill();
});
const peligro = () => ctex("peligro", 512, 512, (g) => {
  g.fillStyle = "#f6f7f8"; g.fillRect(0, 0, 512, 512);
  g.save(); g.translate(256, 256); g.rotate(P / 4); g.fillStyle = "#f2c230"; g.fillRect(-150, -150, 300, 300); g.lineWidth = 22; g.strokeStyle = "#111"; g.strokeRect(-150, -150, 300, 300); g.restore();
  g.fillStyle = "#111"; g.fillRect(236, 140, 40, 160); g.beginPath(); g.arc(256, 350, 26, 0, 7); g.fill();
});
const hexGeo = memo("hexnut", () => { const s = new THREE.Shape(); for (let i = 0; i <= 6; i++) { const a = i / 6 * 2 * P; (i ? s.lineTo : s.moveTo).call(s, Math.cos(a) * 0.3, Math.sin(a) * 0.3); }
  const hole = new THREE.Path(); hole.absarc(0, 0, 0.17, 0, 2 * P, true); s.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 }); g.center(); return g; });
const Tuerca: React.FC<{ p?: V3; rot?: V3; s?: number; c?: string; e?: number }> = ({ p, rot, s = 1, c = "#eef1f3", e = 0 }) =>
  <mesh geometry={hexGeo} position={p} rotation={rot} scale={s} castShadow><meshPhysicalMaterial color={c} emissive={c} emissiveIntensity={e} roughness={0.32} clearcoat={0.6} /></mesh>;
const Cepillo: React.FC<{ p?: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.35, 0]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.7, 8]} />{M.cromo()}</mesh>
  {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[0, -0.02 + i * 0.022, 0]} rotation={[0, i * 0.7, 0]}><cylinderGeometry args={[0.065 - 0.002 * Math.abs(i - 7), 0.065 - 0.002 * Math.abs(i - 7), 0.012, 14]} /><meshStandardMaterial color={i % 2 ? "#f4f1ea" : "#e3ddd0"} roughness={0.95} /></mesh>)}
  <mesh position={[0, 0.78, 0]} castShadow><capsuleGeometry args={[0.03, 0.12, 6, 10]} /><meshStandardMaterial color="#2d6fd0" roughness={0.5} /></mesh>
</group>;
const latoTex = () => ctex("latatun", 1024, 128, (g) => { g.fillStyle = "#1f5a9c"; g.fillRect(0, 0, 1024, 128); g.fillStyle = "#f6f7f8"; g.fillRect(0, 54, 1024, 20);
  for (let i = 0; i < 4; i++) { const x = 120 + i * 256; g.fillStyle = "#f2c230"; g.beginPath(); g.ellipse(x, 64, 70, 30, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(x + 60, 64); g.lineTo(x + 110, 30); g.lineTo(x + 110, 98); g.fill(); g.fillStyle = "#111"; g.beginPath(); g.arc(x - 40, 56, 7, 0, 7); g.fill(); } });
const Lata: React.FC<{ p?: V3; rot?: V3; s?: number; tapa?: number; aceite?: number }> = ({ p, rot, s = 1, tapa = 1, aceite = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh castShadow><cylinderGeometry args={[0.24, 0.24, 0.13, 40, 1, true]} /><meshStandardMaterial map={latoTex()} roughness={0.4} metalness={0.3} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, -0.065, 0]} rotation={[P2, 0, 0]}><circleGeometry args={[0.24, 40]} />{M.cromo("#c9c3b4")}</mesh>
  {aceite > 0.02 && <mesh position={[0, -0.06 + 0.11 * aceite, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.235, 40]} /><meshPhysicalMaterial color="#d8a83a" roughness={0.05} clearcoat={1} emissive="#8a5a10" emissiveIntensity={0.2} /></mesh>}
  {[0.065, -0.065].map((y, i) => <mesh key={i} position={[0, y, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.24, 0.008, 6, 40]} />{M.cromo("#c9c3b4")}</mesh>)}
  <group position={[0, 0.065, -0.24]} rotation={[-1.9 * tapa, 0, 0]}><mesh position={[0, 0, 0.235]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.235, 40]} />{M.cromo("#d6d1c4")}</mesh></group>
</group>;
const relojArena = memo("arenaG", () => lathe([[0.01, -0.3], [0.16, -0.28], [0.17, -0.18], [0.1, -0.06], [0.025, 0], [0.1, 0.06], [0.17, 0.18], [0.16, 0.28], [0.01, 0.3]], 40));
const Arena: React.FC<{ p?: V3; s?: number; k: number; t: number }> = ({ p, s = 1, k, t }) => <group position={p} scale={s}>
  <mesh geometry={relojArena}>{M.vidrio()}</mesh>
  <mesh position={[0, 0.06 + 0.1 * (1 - k), 0]} scale={[1 - 0.6 * k, 1 - k + 0.01, 1 - 0.6 * k]}><coneGeometry args={[0.14, 0.2, 28]} /><meshStandardMaterial color="#e2b86a" roughness={0.9} /></mesh>
  <mesh position={[0, -0.28 + 0.1 * k, 0]} scale={[0.5 + 0.5 * k, k + 0.01, 0.5 + 0.5 * k]}><coneGeometry args={[0.15, 0.2, 28]} /><meshStandardMaterial color="#e2b86a" roughness={0.9} /></mesh>
  <mesh position={[0, -0.13, 0]} scale={[1, 0.98 + 0.02 * Math.sin(t * 9), 1]}><cylinderGeometry args={[0.006, 0.006, 0.26, 6]} /><meshStandardMaterial color="#e2b86a" /></mesh>
  {[0.32, -0.32].map((y, i) => <mesh key={i} position={[0, y, 0]} castShadow><cylinderGeometry args={[0.22, 0.22, 0.04, 32]} />{M.madera("#8a5a32")}</mesh>)}
  {[0, 1, 2].map((i) => <mesh key={"c" + i} position={[Math.cos(i * 2.1) * 0.19, 0, Math.sin(i * 2.1) * 0.19]}><cylinderGeometry args={[0.012, 0.012, 0.64, 8]} />{M.madera("#8a5a32")}</mesh>)}
</group>;
const Cuchara: React.FC<{ p?: V3; rot?: V3; s?: number; carga?: number }> = ({ p, rot, s = 1, carga = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0.3, 0.02, 0]} rotation={[0, 0, -0.12]} castShadow><boxGeometry args={[0.5, 0.012, 0.045]} />{M.cromo()}</mesh>
  <mesh scale={[1.25, 0.45, 0.9]} castShadow><sphereGeometry args={[0.07, 24, 14, 0, 2 * P, P2, P2]} /><meshStandardMaterial color="#d8dade" roughness={0.18} metalness={1} side={THREE.DoubleSide} /></mesh>
  {carga > 0.02 && <mesh position={[0, 0.005, 0]} scale={[0.075 * carga, 0.04 * carga, 0.055 * carga]}><sphereGeometry args={[1, 14, 10]} />{GRASA()}</mesh>}
</group>;
const Gafas: React.FC<{ p?: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  {[-1, 1].map((k) => <group key={k} position={[k * 0.17, 0, 0]}>
    <mesh scale={[1.15, 0.85, 1]}><torusGeometry args={[0.14, 0.022, 10, 40]} /><meshStandardMaterial color="#2a2d30" roughness={0.4} /></mesh>
    <mesh scale={[1.15, 0.85, 1]}><circleGeometry args={[0.14, 40]} /><meshPhysicalMaterial color="#cfe9ff" roughness={0.02} transparent opacity={0.48} clearcoat={1} envMapIntensity={2.4} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[k * 0.17, 0.02, -0.18]} rotation={[0, k * 0.15, 0]}><boxGeometry args={[0.02, 0.03, 0.36]} /><meshStandardMaterial color="#2a2d30" roughness={0.4} /></mesh>
  </group>)}
  <mesh position={[0, 0.03, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.04, 0.014, 8, 16, P]} /><meshStandardMaterial color="#2a2d30" roughness={0.4} /></mesh>
  <mesh position={[0, 0.13, 0]}><boxGeometry args={[0.72, 0.04, 0.03]} /><meshStandardMaterial color="#2a2d30" roughness={0.4} /></mesh>
</group>;
const Paloma: React.FC<{ p?: V3; rot?: V3; s?: number; ala?: number }> = ({ p, rot, s = 1, ala = 0 }) => <group position={p} rotation={rot} scale={s}>
  <mesh scale={[0.2, 0.12, 0.12]} castShadow><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#8d939b" roughness={0.7} /></mesh>
  <mesh position={[0.18, 0.1, 0]} castShadow><sphereGeometry args={[0.075, 16, 12]} /><meshStandardMaterial color="#7d848c" roughness={0.6} /></mesh>
  <mesh position={[0.135, 0.04, 0]} scale={[0.6, 0.6, 1.05]}><sphereGeometry args={[0.08, 14, 10]} /><meshStandardMaterial color="#6e8f7a" roughness={0.3} metalness={0.4} /></mesh>
  <mesh position={[0.27, 0.09, 0]} rotation={[0, 0, -P2]}><coneGeometry args={[0.018, 0.06, 8]} /><meshStandardMaterial color="#e2a04a" /></mesh>
  {[-1, 1].map((k) => <mesh key={k} position={[0.19, 0.12, k * 0.04]}><sphereGeometry args={[0.012, 8, 6]} /><meshBasicMaterial color="#d8532a" /></mesh>)}
  <mesh position={[-0.24, 0.0, 0]} rotation={[0, 0, 0.25]} scale={[0.14, 0.02, 0.07]}><boxGeometry /><meshStandardMaterial color="#5f656c" /></mesh>
  {[-1, 1].map((k) => <group key={"a" + k} position={[0, 0.06, k * 0.08]} rotation={[k * (0.3 + 1.1 * ala), 0, 0]}>
    <mesh position={[-0.03, 0, k * 0.13]} scale={[0.17, 0.012, 0.13]}><boxGeometry /><meshStandardMaterial color="#9aa1a8" roughness={0.7} /></mesh></group>)}
  {[-1, 1].map((k) => <mesh key={"p" + k} position={[0.02, -0.15, k * 0.04]}><cylinderGeometry args={[0.008, 0.008, 0.08, 6]} /><meshStandardMaterial color="#d8532a" /></mesh>)}
</group>;
const AguaPlana: React.FC<{ y: number; w: number; d: number; c?: string; o?: number }> = ({ y, w, d, c = AZUL, o = 0.75 }) =>
  <mesh position={[0, y, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[w, d]} /><meshPhysicalMaterial color={c} roughness={0.04} clearcoat={1} transparent opacity={o} envMapIntensity={1.6} depthWrite={false} /></mesh>;

// 1 · LA GRASA SE CUAJA A LOS 30 CM: caño en corte; los goterones ámbar calientes corren con vapor… y donde el caño se enfría (anillos de escarcha) se vuelven blancos y se pegan a la pared hasta formar costra
const ACuaja: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const frio = eio(tt, 0.4, 1.4), capa = 0.72 * eio(tt, 1.4, 4.6);
  return <Estudio t={tt} cam={[0.25, 0.72, 1.85]} look={[0.05, 0.4, 0]} orbit={0.1} mesa={false}>
    <CanoCorte p={[0, 0.42, 0]} L={2.5} r={0.24} capa={capa} x0={0.12} x1={1.2} c="#f6f1e2" />
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0.18 + i * 0.15, 0.42, 0]} rotation={[0, P2, 0]} scale={frio + 0.001}><torusGeometry args={[0.25, 0.008, 6, 40]} /><meshStandardMaterial color="#cfeeff" emissive="#7fc8ff" emissiveIntensity={0.6} roughness={0.3} /></mesh>)}
    {/* río de grasa caliente: una cinta ámbar gruesa por el piso del caño que avanza y se frena en el frío */}
    {(() => { const xe = lerp(-1.0, 0.15, eio(tt, 0.1, 1.6)); return <mesh position={[(-1.2 + xe) / 2, 0.42 - 0.19, -0.02]} rotation={[0, 0, P2]} scale={[1, (xe + 1.2) / 0.65, 1]}><capsuleGeometry args={[0.05, 0.55, 8, 16]} /><meshPhysicalMaterial color="#e39a24" roughness={0.06} clearcoat={1} transmission={0.25} emissive="#b0601a" emissiveIntensity={0.45} /></mesh>; })()}
    {Array.from({ length: 46 }, (_, i) => { const a = 0.1 + i * 0.09; if (tt < a) return null;
      const x0 = -1.2 + (tt - a) * 0.95, stop = 0.15 + rn(i, 1) * 0.95, pega = x0 >= stop, x = Math.min(x0, stop), f = cl((x - 0.05) / 0.3);
      const th = pega ? -P2 + (rn(i, 2) - 0.5) * 2.6 : -P2, rr = 0.2 - 0.1 * capa * f;
      return <mesh key={"g" + i} position={[x, 0.42 + Math.sin(th) * rr, -Math.abs(Math.cos(th)) * rr]} scale={pega ? [0.075, 0.05, 0.065] : [0.095, 0.045, 0.07]}><sphereGeometry args={[1, 14, 10]} />
        <meshPhysicalMaterial color={col("#e3a12c", "#fbf7ec", f)} roughness={0.06 + 0.7 * f} clearcoat={1 - f} emissive="#b0601a" emissiveIntensity={0.45 * (1 - f)} /></mesh>; })}
    <Vapor t={tt} p={[-0.6, 0.3, 0]} o={0.35 * (1 - eio(tt, 3, 4.6))} h={0.5} s={0.16} n={8} />
    <Vapor t={tt} p={[-0.95, 0.3, 0]} o={0.3} h={0.6} s={0.18} n={10} />
    <pointLight position={[-0.9, 0.7, 0.6]} intensity={3} distance={2.2} color="#ffb060" />
    <pointLight position={[0.8, 0.8, 0.6]} intensity={0.01 + 3 * frio} distance={2.2} color="#8fd0ff" />
    {/* cinta métrica de 30 cm sobre el tramo caliente */}
    <mesh position={[-0.45, 0.68, 0.05]}><boxGeometry args={[1.2 * eio(tt, 0.2, 1.2) + 0.001, 0.012, 0.07]} /><meshStandardMaterial color="#f2c230" roughness={0.5} /></mesh>
    {Array.from({ length: 13 }, (_, i) => <mesh key={"m" + i} position={[-1.05 + i * 0.1, 0.688, 0.05]} visible={-1.05 + i * 0.1 < -1.05 + 1.2 * eio(tt, 0.2, 1.2)}><boxGeometry args={[0.006, 0.004, i % 5 ? 0.03 : 0.06]} /><meshBasicMaterial color="#222" /></mesh>)}
  </Estudio>;
}}</Stage>;

// 2 · EL FRASCO DE LA GRASA: la espátula raspa la sartén tibia en tres pasadas curvas; cada pasada suelta un bloque blanco que vuela al frasco; el nivel sube por tandas y la tapa cae
const AFrasco: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const st = [0.5, 1.4, 2.3], sw = st.map((a) => eio(tt, a, a + 0.75)), i = Math.max(0, st.filter((a) => tt >= a).length - 1);
  const s = i % 2 ? 1 - sw[i] : sw[i], ang = lerp(-1.3, 0.9, s);
  const caidos = st.filter((a) => tt > a + 1.25).length, lleno = 0.12 + 0.18 * caidos + 0.18 * cl((tt - (st[Math.min(2, caidos)] + 0.85)) / 0.4) * (caidos < 3 ? 1 : 0);
  return <Estudio t={tt} cam={[0.15, 1.45, 2.75]} look={[0.08, 0.36, 0]} orbit={0.1}>
    <Sarten p={[-0.45, fall(tt, 0.0, 0.9), 0.05]} rot={[0, 0.2, 0.12]} s={1.05} film={0.7 - 0.2 * caidos} grumos={1 - 0.3 * caidos} />
    <Espatula p={[-0.45 + Math.cos(ang) * 0.3, 0.16 + 0.06 * Math.sin(s * P) + fall(tt, 0.2, 0.9), 0.05 + Math.sin(ang) * 0.3]} rot={[-1.25, -ang, -0.4]} />
    <Frasco p={[0.6, fall(tt, 0.15, 1.2), 0.15]} s={1.25} lleno={lleno} tapa={phys(tt, 3.6, 9, 0.5)} />
    {st.map((a, j) => { const k = cl((tt - (a + 0.75)) / 0.5); if (k <= 0 || k >= 1) return null;
      return <mesh key={j} position={[lerp(-0.15, 0.6, k), 0.3 + 0.55 * Math.sin(k * P) - 0.1 * k + 0.05 * Math.abs(Math.sin(k * 9)) * k, 0.15]} rotation={[k * 4, k * 3, 0]} scale={[0.07, 0.045, 0.06]}><dodecahedronGeometry args={[1, 1]} />{GRASA()}</mesh>; })}
  </Estudio>;
}}</Stage>;

// 3 · LA PELÍCULA QUE NADIE VE: la sartén brilla con su película (se refleja la ventana); una servilleta arrugada la barre y deja un camino mate; al final la servilleta se levanta amarilla
const APelicula: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const w = eio(tt, 1.0, 3.2), sx = lerp(-0.75, 0.75, w), sube = eio(tt, 3.4, 4.6);
  const serv = memo("servG", () => { const g = new THREE.PlaneGeometry(0.42, 0.42, 14, 14), pa = g.attributes.position;
    for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), y = pa.getY(i); pa.setZ(i, 0.025 * Math.sin(x * 38 + y * 11) + 0.02 * Math.cos(y * 45 - x * 7) + 0.03 * (x * x + y * y) * 6); }
    g.computeVertexNormals(); return g; });
  return <Estudio t={tt} cam={[0.0, 1.55, 1.5]} look={[0, 0.08, 0]} orbit={0.08}>
    <Sarten p={[0, fall(tt, 0.0, 0.9), 0]} s={1.35} />
    {Array.from({ length: 12 }, (_, j) => { const x = -0.55 + (j + 0.5) * (1.1 / 12), hh = 2 * Math.sqrt(Math.max(0, 0.58 * 0.58 - x * x)), lim = x < sx - 0.15;
      return <mesh key={j} position={[x, 0.012, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.1 / 12 + 0.002, hh]} /><meshPhysicalMaterial color={lim ? "#1b1a19" : "#f0c24a"} roughness={lim ? 0.9 : 0.02} clearcoat={lim ? 0 : 1} envMapIntensity={lim ? 0.1 : 2.4} emissive={lim ? "#000" : "#6a4a08"} emissiveIntensity={lim ? 0 : 0.35} transparent opacity={lim ? 0.85 : 0.8} depthWrite={false} /></mesh>; })}
    {/* reflejo de la ventana en la película: se borra donde pasó la servilleta */}
    {[[-0.18, -0.12], [0.06, -0.12], [-0.18, 0.1], [0.06, 0.1]].map(([x, z], j) => <mesh key={"v" + j} position={[x + 0.05, 0.016, z]} rotation={[-P2, 0, 0.2]} visible={x + 0.05 > sx - 0.1}><planeGeometry args={[0.2, 0.18]} /><meshBasicMaterial color="#fff6dc" transparent opacity={0.85} toneMapped={false} depthWrite={false} /></mesh>)}
    <group position={[sx, 0.05 + 0.55 * sube, 0.05 + 0.45 * sube]} rotation={[-P2 + 1.5 * sube, 0, 0.4 * Math.sin(tt * 2) * (1 - sube)]}>
      <mesh geometry={serv} castShadow><meshStandardMaterial color="#fbfaf6" roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0, -0.02]} rotation={[P, 0, 0]} scale={[0.3 * cl(w * 1.3) + 0.001, 0.26 * cl(w * 1.3) + 0.001, 1]}><circleGeometry args={[0.5, 24]} /><meshStandardMaterial color="#d9a21c" roughness={0.6} transparent opacity={0.92} /></mesh>
    </group>
    <pointLight position={[0.6, 1.2, 0.8]} intensity={3.5 * (1 - w) + 0.3} distance={3} color="#fff0c0" />
  </Estudio>;
}}</Stage>;

// 4 · REJILLA FINA vs AGUJERO GRANDE: llueve arroz sobre dos desagües; por el agujero grande los granos se hunden y desaparecen; en la rejilla fina se apilan en un montículo que crece
const ARejilla: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const mont = eio(tt, 0.9, 4.4);
  return <Estudio t={tt} cam={[0.0, 0.7, 1.75]} look={[0, 0.0, 0]} orbit={0.1}>
    <mesh position={[0, -0.02, 0]} receiveShadow><boxGeometry args={[2.6, 0.04, 1.4]} />{ACERO()}</mesh>
    {[-1, 1].map((k) => <group key={k} position={[k * 0.62, 0, 0]}>
      <mesh position={[0, 0.003, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.3, 0.4, 48]} />{M.cromo("#b9bec4")}</mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.3, 32]} /><meshBasicMaterial color="#060606" /></mesh>
      {k > 0 ? <Rejilla p={[0, 0.012 + 0.8 * (1 - phys(tt, 0.1 + (k + 1) * 0.12, 6, 0.5)), 0]} fina /> : <mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.3, 0.3, 0.2, 32, 1, true]} /><meshStandardMaterial color="#141414" side={THREE.BackSide} /></mesh>}
    </group>)}
    <mesh position={[0.62, 0.012, 0]} scale={[mont, mont * 0.55 + 0.001, mont]}><coneGeometry args={[0.24, 0.2, 40]} /><meshStandardMaterial color="#efe9d6" roughness={0.85} /></mesh>
    {Array.from({ length: 70 }, (_, i) => { const k = i % 2 ? 1 : -1, a = 0.25 + (i / 70) * 3.6, x = k * 0.62 + (rn(i, 1) - 0.5) * 0.4, z = (rn(i, 2) - 0.5) * 0.4;
      const r = Math.hypot(x - k * 0.62, z), suelo = k > 0 ? 0.03 + 0.11 * mont * Math.max(0, 1 - r / (0.24 * Math.max(0.2, mont))) : -0.5;
      const y = Math.max(suelo, 1.1 - 4.9 * Math.max(0, tt - a) ** 2); if (tt < a || (k < 0 && y <= -0.08)) return null;
      return <mesh key={i} position={[x, y, z]} rotation={[rn(i, 3) * 6, rn(i, 5) * 3, rn(i, 4) * 6]} scale={[0.016, 0.042, 0.016]}><capsuleGeometry args={[1, 1, 4, 6]} /><meshStandardMaterial color="#f6f2e4" roughness={0.6} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 5 · EL PUÑADO DE GOLPE: la rejilla llena se levanta y todo lo que juntó cae junto por la cola del sifón (en rayos X); se clava en la curva y el agua se frena y sube por el caño
const APunado: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const sube = eio(tt, 0.8, 1.4), cae = cl((tt - 1.4) / 0.55), tapa = phys(tt, 1.95, 9, 0.35), nivel = eio(tt, 2.3, 4.4);
  return <Estudio t={tt} cam={[0.5, 0.5, 2.75]} look={[0.25, 0.1, 0]} orbit={0.08} mesa={false}>
    <Sifon p={[-0.2, -0.45, 0]} s={1.55} x={1} tapon={cl(tapa)} tc="#8a7d62" />
    <mesh position={[-0.2, 0.52, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.1, 0.36, 40]} />{M.cromo("#b9bec4")}</mesh>
    <Rejilla p={[-0.2 + 0.32 * sube, 0.55 + 0.12 * sube, 0.1 * sube]} rot={[0, 0, 0.75 * sube]} lleno={1 - cae} />
    {cae > 0 && cae < 1 && <group position={[-0.2, lerp(0.6, -0.42, cae * cae), 0]} scale={[1, 1 + 1.5 * cae, 1]}>
      {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.08, (rn(i, 2) - 0.5) * 0.08, (rn(i, 3) - 0.5) * 0.06]} scale={0.038 + 0.02 * rn(i, 4)}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={["#f4f0e2", "#2a1a10", "#8a7d62"][i % 3]} roughness={0.8} /></mesh>)}</group>}
    <mesh position={[-0.2, -0.25 + 0.38 * nivel, 0]} scale={[1, nivel + 0.001, 1]}><cylinderGeometry args={[0.075, 0.075, 0.76, 20]} />{AGUA(0.85, AZUL)}</mesh>
    {tapa > 0.05 && <Onda p={[0.06, -0.42, 0.05]} t={tt} a={1.95} r={0.25} />}
  </Estudio>;
}}</Stage>;

// 6 · CALIENTE NO ES HIRVIENDO: el termómetro de vidrio sube a la franja verde (agua de la llave); la tetera vierte hirviendo, la columna llega al rojo y el sifón de PVC se ablanda y se dobla como cera
const ATermo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const v = 0.12 + 0.42 * phys(tt, 0.3, 4, 0.55) + 0.46 * eio(tt, 2.0, 2.9), vierte = eio(tt, 1.7, 2.1) * (1 - eio(tt, 4.2, 4.6)), blanda = eio(tt, 2.8, 4.6);
  return <Estudio t={tt} cam={[0.1, 0.75, 3.15]} look={[0.05, 0.5, 0]} orbit={0.08}>
    <group position={[-0.95, -0.05 + fall(tt, 0.0, 1.0), 0]} scale={0.9}>
      <mesh position={[0, 0.65, 0]}><cylinderGeometry args={[0.055, 0.055, 1.3, 24]} />{M.vidrio()}</mesh>
      <mesh position={[0, 0, 0]} castShadow><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color={col("#3fae6a", "#e8432e", (v - 0.55) * 2.5)} roughness={0.2} /></mesh>
      <mesh position={[0, 0.05 + 0.6 * v, 0]} scale={[1, v, 1]}><cylinderGeometry args={[0.03, 0.03, 1.2, 14]} /><meshStandardMaterial color={col("#3fae6a", "#e8432e", (v - 0.55) * 2.5)} emissive={col("#3fae6a", "#e8432e", (v - 0.55) * 2.5)} emissiveIntensity={0.3} /></mesh>
      <mesh position={[0, 0.28 + 0.21, -0.06]}><boxGeometry args={[0.2, 0.42, 0.01]} /><meshStandardMaterial color="#7fc7a0" /></mesh>
      <mesh position={[0, 1.08 + 0.1, -0.06]}><boxGeometry args={[0.2, 0.2, 0.01]} /><meshStandardMaterial color="#e8432e" /></mesh>
    </group>
    <group position={[0.85, 1.05 + fall(tt, 1.2, 1.2), 0]} rotation={[0, P, 0.95 * vierte]}><Tetera s={0.7} /></group>
    {vierte > 0.5 && <Chorro a={[0.45, 0.98, 0]} b={[0.05, 0.42, 0]} r={0.04} c="#e6f4fb" o={0.85} />}
    <group position={[-0.05, -0.05 + fall(tt, 0.1, 1.2), 0]} scale={[1 + 0.12 * blanda, 1 - 0.18 * blanda, 1]}>
      <group position={[0.2, 0.35, 0]} rotation={[0, 0, -0.55 * blanda]}><group position={[-0.2, -0.35, 0]}><Sifon s={0.85} x={0} agua={0} /></group></group>
    </group>
    {Array.from({ length: 5 }, (_, i) => <mesh key={"d" + i} position={[0.0 + i * 0.06, 0.12 - 0.25 * blanda * (i / 4), 0.12]} scale={[0.025, 0.04 * blanda + 0.001, 0.025]}><sphereGeometry args={[1, 10, 8]} />{PVC()}</mesh>)}
    <Vapor t={tt} p={[0.1, 0.45, 0]} o={0.6 * vierte} h={1.0} s={0.3} n={16} />
  </Estudio>;
}}</Stage>;

// 7 · UN MINUTO CONTADO: la botella se inclina y suelta un hilo verde de lavavajillas al desagüe; abre la canilla caliente (vapor) y el cronómetro sube de atrás y barre el minuto entero con su arco dorado
const AMinuto: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const inc = eio(tt, 0.3, 0.8) * (1 - eio(tt, 1.9, 2.3)), hilo = tt > 0.75 && tt < 2.0, on = eio(tt, 1.9, 2.2), k = eio(tt, 2.1, 4.7), sube = phys(tt, 1.6, 5, 0.55);
  return <Estudio t={tt} cam={[0.15, 1.2, 2.3]} look={[0.15, 0.45, 0]} orbit={0.08}>
    <Tarja p={[-0.25, 0, 0]} w={1.0} agua={0.1 * on} ac="#9cc3d8" />
    <Canilla p={[-0.6, 0.36, -0.3]} on={on} largo={0.62} c="#d9eef8" />
    <Botella p={[0.12, 0.42 + fall(tt, 0.0, 1.0), 0.12]} rot={[0, 0, 2.0 * inc]} s={0.5} c="#3fb07a" />
    {hilo && <Chorro a={[-0.12, 0.56, 0.12]} b={[-0.25, 0.03, 0]} r={0.026} c="#3fd08a" o={0.9} />}
    {on > 0.1 && <Chorro a={[-0.6, 0.62, -0.02]} b={[-0.6, 0.03, -0.02]} r={0.035} c="#e6f4fb" o={0.75} />}
    <Vapor t={tt} p={[-0.45, 0.1, 0]} o={0.6 * on} h={0.9} s={0.26} n={14} />
    <group position={[lerp(-0.25, 0.85, sube), lerp(-0.05, 0.75, sube), -0.1]} rotation={[-0.1, -0.35 * sube, 0]} scale={1.5 * cl(sube) + 0.001}>
      <Reloj k={k} />
      <mesh position={[0, 0, 0.042]}><ringGeometry args={[0.215, 0.245, 64, 1, P2 - k * 2 * P, k * 2 * P + 0.0001]} /><meshBasicMaterial color="#f2b632" toneMapped={false} /></mesh>
    </group>
  </Estudio>;
}}</Stage>;

// 8 · ARENA + PEGAMENTO: en el sifón de vidrio cae una lluvia de café molido (arena) y una cinta de grasa ámbar (pegamento); en la curva se funden en un barro marrón que se oscurece y se agrieta
const ACafe: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const mez = eio(tt, 2.0, 3.4), grieta = eio(tt, 3.5, 4.5), cinta = cl((tt - 0.9) / 0.8) * (1 - cl((tt - 2.1) / 0.3));
  return <Estudio t={tt} cam={[0.25, 0.25, 1.95]} look={[0.0, 0.05, 0]} orbit={0.08} mesa={false}>
    <Sifon p={[-0.3, -0.38, 0]} x={1} s={1.7} tapon={0.35 + 0.65 * mez} tc={col(col("#d9a03a", "#5a4030", mez), "#2e2218", grieta)} />
    {Array.from({ length: 60 }, (_, i) => { const a = 0.2 + i * 0.022; if (tt < a) return null;
      const y0 = 1.1 - 4.9 * (tt - a) ** 2, xr = -0.3 + 0.08 + rn(i, 1) * 0.42, yr = -0.37 + rn(i, 2) * 0.06, y = Math.max(yr, y0), x = y0 > -0.1 ? -0.3 + (rn(i, 3) - 0.5) * 0.06 : lerp(-0.3, xr, cl((-0.1 - y0) / 0.4));
      return <mesh key={i} position={[x, y, (rn(i, 4) - 0.5) * 0.05]} rotation={[rn(i, 5) * 6, rn(i, 6) * 6, 0]} scale={0.03 * (1 - 0.8 * mez) + 0.001}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#2a1a10" roughness={0.8} /></mesh>; })}
    {cinta > 0 && <Chorro a={[-0.3, 1.1, 0.02]} b={[-0.3, lerp(1.1, -0.3, cl((tt - 0.9) / 0.8)), 0.02]} r={0.042} c="#e0a52e" o={0.92} />}
    <mesh position={[-0.02, -0.36, 0.02]} scale={[0.26 * mez + 0.001, 0.1 * mez + 0.001, 0.13 * mez + 0.001]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color={col("#6a4a2e", "#3a2a1c", grieta)} roughness={0.95} /></mesh>
    {Array.from({ length: 10 }, (_, i) => <mesh key={"k" + i} position={[-0.02 + (i - 4.5) * 0.045, -0.3 + 0.03 * Math.sin(i * 2), 0.135]} rotation={[0, 0, 0.7 * Math.sin(i * 3)]} scale={[0.009, 0.12 * grieta + 0.001, 0.006]}><boxGeometry /><meshBasicMaterial color="#120a06" /></mesh>)}
  </Estudio>;
}}</Stage>;

// 9 · SE HINCHA ADENTRO: primer plano de la curva del sifón con el arroz en el agua; atrás la luna con cráteres se hunde y sale el sol con rayos (el cielo pasa de noche a amanecer); los granos se inflan al doble y taponan
const AHincha: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const g = eio(tt, 1.2, 4.2), luna = eio(tt, 0.2, 2.3), sol = eio(tt, 2.2, 4.4);
  return <Estudio t={tt} cam={[0.15, 0.05, 1.45]} look={[0.0, -0.08, 0]} orbit={0.06} mesa={false}>
    <mesh position={[0, 0.3, -1.6]}><planeGeometry args={[6, 3.4]} /><meshBasicMaterial color={col("#1b2747", "#f0a050", sol)} transparent opacity={0.85} /></mesh>
    <group position={[-0.5, lerp(0.35, -0.75, luna), -1.4]} scale={1.3}>
      <mesh><sphereGeometry args={[0.17, 28, 20]} /><meshStandardMaterial color="#e6e9f2" emissive="#b8c4e8" emissiveIntensity={0.5} roughness={0.9} /></mesh>
      {[[0.06, 0.05, 0.05], [-0.07, -0.02, 0.035], [0.02, -0.08, 0.03], [-0.03, 0.09, 0.025]].map(([x, y, r], i) => <mesh key={i} position={[x, y, 0.16]}><circleGeometry args={[r, 18]} /><meshStandardMaterial color="#b9bfcc" /></mesh>)}
    </group>
    <group position={[0.5, lerp(-0.8, 0.3, sol), -1.4]} rotation={[0, 0, tt * 0.3]}>
      <mesh><sphereGeometry args={[0.2, 28, 20]} /><meshBasicMaterial color="#ffc23a" toneMapped={false} /></mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.cos(i / 12 * 2 * P) * 0.32, Math.sin(i / 12 * 2 * P) * 0.32, 0]} rotation={[0, 0, i / 12 * 2 * P - P2]}><coneGeometry args={[0.03, 0.12, 8]} /><meshBasicMaterial color="#ffb02a" toneMapped={false} /></mesh>)}
    </group>
    <Sifon p={[-0.32, -0.35, 0]} x={0.85} s={1.9} agua={1} />
    <group position={[0.0, -0.36, 0]}>{Array.from({ length: 44 }, (_, i) => { const a = rn(i, 1) * 2 - 1, k = cl(g * 1.4 - rn(i, 2) * 0.4);
      return <mesh key={i} position={[a * (0.2 + 0.05 * k), (rn(i, 3) - 0.5) * (0.05 + 0.07 * k), (rn(i, 4) - 0.5) * 0.08]} rotation={[rn(i, 5) * 6, rn(i, 6) * 6, rn(i, 7) * 6]} scale={[0.016 * (1 + 1.6 * k), 0.04 * (1 + 1.1 * k), 0.016 * (1 + 1.6 * k)]}><capsuleGeometry args={[1, 1, 4, 8]} /><meshStandardMaterial color={col("#f6f2e4", "#fffdf6", k)} roughness={0.5} /></mesh>; })}</group>
  </Estudio>;
}}</Stage>;

// 10 · EL CORAZÓN: el sifón se vuelve rayos X; el olor verde de la cloaca viene por el brazo y se frena en el sello de agua azul; en la curva crece el tapón con pelos; abajo diez sifones chicos: en ocho se enciende el tapón
const ASifonX: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const x = eio(tt, 0.2, 1.0), tap = eio(tt, 2.2, 3.4);
  return <Estudio t={tt} cam={[0.15, 0.3, 3.3]} look={[0.05, 0.05, 0]} orbit={0.08} mesa={false}>
    <Sifon p={[-0.6, -0.12, 0]} s={1.45} x={x} agua={1} tapon={tap} tc="#8a7d62" />
    {Array.from({ length: 10 }, (_, i) => { const k = ((tt - 0.9 - i * 0.16) % 1.6) / 1.6; if (tt < 0.9 + i * 0.16) return null; const px = lerp(0.95, 0.0, k);
      return <mesh key={i} position={[px, 0.32 + 0.03 * Math.sin(i + tt * 3), 0]} scale={0.035 + 0.02 * rn(i, 1)}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#9aae3c" emissive="#6a8a1a" emissiveIntensity={0.5} transparent opacity={0.8 * cl((px - 0.05) / 0.35)} depthWrite={false} /></mesh>; })}
    {Array.from({ length: 10 }, (_, i) => <mesh key={"p" + i} position={[-0.33 + 0.02 * i, -0.18 + 0.01 * Math.sin(i), 0.03]} rotation={[rn(i, 1) * 3, rn(i, 2) * 3, 0]} scale={tap + 0.001}><torusGeometry args={[0.07, 0.003, 4, 20, 2.4]} /><meshStandardMaterial color="#1b1410" /></mesh>)}
    {Array.from({ length: 10 }, (_, i) => <group key={"s" + i} position={[-1.15 + i * 0.25, -0.62 + 0.5 * (1 - IN(tt, 3.3 + i * 0.07)), 0.45]} scale={0.21 * IN(tt, 3.3 + i * 0.07) + 0.001}>
      <Sifon x={0.6} tapon={i < 8 ? eio(tt, 3.9 + i * 0.06, 4.2 + i * 0.06) : 0} tc="#e8432e" />
      {i < 8 && <pointLight position={[0.17, 0.1, 0.3]} intensity={2 * eio(tt, 3.9 + i * 0.06, 4.2 + i * 0.06) + 0.01} distance={0.6} color="#ff5a3a" />}
    </group>)}
  </Estudio>;
}}</Stage>;

// 11 · SIETE PASOS: el sifón en acción paso por paso (cubeta debajo, tuercas que giran a mano, baja, cepillo adentro, la gomita en primer plano, sube, agua y linterna) + siete tuercas al frente que se encienden de a una
const ADesarme: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const s = (i: number) => eio(tt, rel(h, i), rel(h, i) + 1.4), on = (i: number) => tt >= rel(h, i) && (i === 6 || tt < rel(h, i + 1));
  const baja = 0.32 * s(2) * (1 - s(5)), cep = on(3) ? Math.sin((tt - rel(h, 3)) * 2.4) : 0, goma = s(4) * (1 - s(5));
  return <Estudio t={tt} cam={[0.25, 1.05, 3.0]} look={[0.1, 0.42, 0]} orbit={0.1}>
    <Cubeta p={[lerp(1.6, 0.12, s(0)), -0.15, 0.05]} nivel={0.25 + 0.35 * s(2)} />
    <Sifon p={[0, 0.5 - baja, 0]} nut={on(1) ? (tt - rel(h, 1)) * 3 : 3 * s(1)} />
    <Mano p={[0.5, 0.8 - baja, 0.25]} rot={[0.4, -0.6, 0.2]} pinza={0.45 + 0.35 * Math.sin(tt * 4) * (on(1) ? 1 : 0)} s={0.55 * s(1) * (1 - s(2)) + 0.001} />
    <group position={[0, 1.15 - baja + 0.25 * cep, 0]} scale={on(3) ? eio(tt, rel(h, 3), rel(h, 3) + 0.6) : 0.001}><Cepillo s={1.1} /></group>
    <group position={[0.3, 0.75, 0.75]} rotation={[0.9 + tt * 0.6 * goma, tt * 0.4, 0]} scale={goma * 2.2 + 0.001}>
      <mesh><torusGeometry args={[0.07, 0.016, 12, 36]} />{GOMA("#1f1f1f")}</mesh></group>
    {on(4) && <pointLight position={[0.3, 1.0, 1.0]} intensity={3 * goma} distance={1.4} color="#ffffff" />}
    {on(6) && <Chorro a={[0, 1.35, 0]} b={[0, 1.12, 0]} r={0.03} c="#bfe0f2" o={0.7} />}
    <Linterna p={[-0.75, 0.85, 0.5]} rot={[-0.2, -0.7, 0]} on={s(6)} />
    {Array.from({ length: 7 }, (_, i) => { const up = phys(tt, rel(h, i), 7, 0.4), x = -1.05 + i * 0.36, y = 0.02 + 0.12 * up, sc = 0.6 + 0.4 * (on(i) ? 1 : 0.7 * cl(up));
      return <group key={i} position={[x, y, 1.0]} scale={sc}>
        {i === 0 && <Cubeta s={0.28} nivel={0.3} />}
        {i === 1 && <Tuerca rot={[P2 - 0.3, 0, 0]} s={0.42} />}
        {i === 2 && <Sifon s={0.22} x={0} />}
        {i === 3 && <Cepillo s={0.4} rot={[0, 0, 0.5]} />}
        {i === 4 && <mesh position={[0, 0.08, 0]} rotation={[0.6, 0, 0]}><torusGeometry args={[0.08, 0.022, 12, 36]} />{GOMA("#1f1f1f")}</mesh>}
        {i === 5 && <Gota p={[0, 0.1, 0]} k={1} h={0.25} />}
        {i === 6 && <Linterna rot={[0, -0.6, 0]} on={on(6) ? 1 : 0} />}
        {on(i) && <pointLight position={[0, 0.5, 0.4]} intensity={2.5} distance={1} color="#fff1d0" />}
      </group>; })}
  </Estudio>;
}}</Stage>;

// 12 · A MANO, NO CON PINZA: una pinza de verdad muerde la tuerca de la izquierda: la tuerca se raja en zigzag y saltan astillas; a la derecha la mano gira la otra un cuarto de vuelta y la marca blanca recorre su arco verde
const APinza: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const llega = phys(tt, 0.2, 5, 0.6), muerde = eio(tt, 0.8, 1.8), raja = eio(tt, 1.8, 2.5), cuarto = eio(tt, 2.8, 4.2);
  const zig = memo("zigG2", () => tuboGeo([[-0.33, 0.1, 0.0], [-0.18, 0.1, 0.1], [-0.05, 0.1, -0.08], [0.08, 0.1, 0.09], [0.2, 0.1, -0.06], [0.33, 0.1, 0.03]], 0.022, 40, 6));
  const ab = lerp(0.42, 0.1, muerde);
  return <Estudio t={tt} cam={[0.0, 1.35, 2.75]} look={[0, 0.3, 0]} orbit={0.08}>
    <group position={[-0.65, 0.12, 0]}>
      <Tuerca rot={[P2, 0, 0.2 * muerde]} s={1.1} />
      <mesh geometry={zig} scale={[raja + 0.001, 1, 1]}><meshBasicMaterial color="#5a1a12" /></mesh>
      {Array.from({ length: 12 }, (_, i) => { const k = cl((tt - 2.0) / 0.9), a = rn(i, 1) * 2 * P;
        return k > 0 && k < 1 ? <mesh key={i} position={[Math.cos(a) * (0.2 + 0.6 * k), 0.1 + 0.5 * k - 1.2 * k * k, Math.sin(a) * (0.2 + 0.6 * k)]} rotation={[k * 8, k * 5, 0]} scale={0.035 + 0.025 * rn(i, 2)}><tetrahedronGeometry args={[1]} />{PVC()}</mesh> : null; })}
      <group position={[0, 0.12, lerp(1.4, 0.0, llega)]} rotation={[0, 0, 0]} scale={1.35}>
        {[-1, 1].map((k) => <group key={k} rotation={[0, k * ab, 0]}>
          <mesh position={[0, 0, -0.12]} castShadow><boxGeometry args={[0.07, 0.06, 0.26]} />{M.cromo("#9aa0a6")}</mesh>
          <mesh position={[k * -0.05, 0, 0.4]} rotation={[0, k * 0.12, 0]} castShadow><boxGeometry args={[0.05, 0.05, 0.55]} />{M.cromo("#9aa0a6")}</mesh>
          <mesh position={[k * -0.08, 0, 0.62]} rotation={[P2, 0, 0]} castShadow><capsuleGeometry args={[0.035, 0.32, 6, 10]} />{GOMA("#c4322a")}</mesh>
        </group>)}
        <mesh rotation={[0, 0, 0]} position={[0, 0.04, 0.05]}><cylinderGeometry args={[0.04, 0.04, 0.1, 16]} />{M.cromo()}</mesh>
      </group>
    </group>
    <group position={[0.65, 0.12, 0]}>
      <group rotation={[0, -cuarto * P2, 0]}><Tuerca rot={[P2, 0, 0]} s={1.1} /><mesh position={[0, 0.1, 0.27]}><boxGeometry args={[0.05, 0.01, 0.12]} /><meshBasicMaterial color="#ffffff" /></mesh></group>
      <mesh position={[0, 0.105, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.36, 0.4, 48, 1, -P2, cuarto * P2 + 0.0001]} /><meshBasicMaterial color="#5ad87a" toneMapped={false} /></mesh>
      <Mano p={[0.05, 0.22, 0.3 - 0.1 * llega]} rot={[0.5, cuarto * 1.2, 0]} pinza={0.75} s={0.6} />
    </group>
  </Estudio>;
}}</Stage>;

// 13 · LA SONDA ATRAVIESA LA PARED: pared de ladrillo en corte con el caño adentro; la espiral entra girando (flecha curva en la manivela), aprieta el tapón de pelusa que se comprime… y lo deshace en una nube de partículas
const ASonda: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const av = 0.55 * eio(tt, 0.3, 1.6) + 0.42 * eio(tt, 2.8, 4.4), aprieta = eio(tt, 1.5, 2.6), rompe = cl((tt - 2.7) / 1.6);
  const ladr = () => ctex("ladrillo", 512, 256, (g) => { g.fillStyle = "#3a2c25"; g.fillRect(0, 0, 512, 256); for (let r = 0; r < 8; r++) for (let c = -1; c < 5; c++) { g.fillStyle = ["#7a3e2a", "#6a3424", "#84442c"][(r + c + 3) % 3]; g.fillRect(c * 128 + (r % 2) * 64 + 4, r * 32 + 4, 120, 26); } });
  return <Estudio t={tt} cam={[0.2, 0.7, 2.8]} look={[-0.05, 0.5, 0]} orbit={0.08}>
    <mesh position={[-0.3, 0.5, -0.32]} receiveShadow><boxGeometry args={[3.4, 1.7, 0.1]} /><meshStandardMaterial map={ladr()} roughness={0.9} /></mesh>
    <CanoCorte p={[-0.3, 0.5, -0.1]} L={2.6} r={0.17} />
    <group position={[-0.55, 0.47, -0.12]} scale={[1 - 0.45 * aprieta * (1 - rompe), 1 + 0.15 * aprieta * (1 - rompe), 1]}>
      {Array.from({ length: 40 }, (_, i) => { const d = rompe * (0.5 + rn(i, 5) * 1.6);
        return <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.18 - d, (rn(i, 2) - 0.5) * 0.18 + 0.12 * d * Math.sin(i), (rn(i, 3) - 0.5) * 0.1]} scale={(0.035 + 0.025 * rn(i, 4)) * (1 - 0.6 * rompe)}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={i % 3 ? "#8a826c" : "#5a5246"} roughness={0.95} transparent opacity={1 - 0.7 * rompe} /></mesh>; })}
    </group>
    <Sonda p={[0.95 + (tt > 1.6 && tt < 2.8 ? 0.015 * Math.sin(tt * 40) : 0), 0.48, -0.1]} rot={[0, -P2, 0]} avance={av} giro={tt * 5} largo={2.4} />
    <group position={[0.95, 0.48, -0.1]} rotation={[0, P2, tt * 3]}>
      <mesh><torusGeometry args={[0.32, 0.018, 8, 40, 4.4]} /><meshBasicMaterial color="#f2b632" toneMapped={false} /></mesh>
      <mesh position={[0.32 * Math.cos(4.4), 0.32 * Math.sin(4.4), 0]} rotation={[0, 0, 4.4]}><coneGeometry args={[0.05, 0.1, 12]} /><meshBasicMaterial color="#f2b632" toneMapped={false} /></mesh>
    </group>
  </Estudio>;
}}</Stage>;

// 14 · SI ECHASTE QUÍMICO: los guantes de hule y los lentes caen y rebotan sobre la mesa; un chorro verde salta y se estrella contra el lente: las gotas escurren por el vidrio y no llegan al ojo
const AGafas: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const jet = cl((tt - 2.0) / 0.35), imp = tt > 2.35;
  return <Estudio t={tt} cam={[0.05, 0.95, 2.0]} look={[0.05, 0.35, 0]} orbit={0.08}>
    <Guante p={[-0.75, 0.05 + fall(tt, 0.1, 1.3), 0.05]} rot={[-P2 + 0.05, 0, 0.5]} s={1.1} />
    <Guante p={[-0.35, 0.06 + fall(tt, 0.35, 1.3), 0.25]} rot={[-P2 + 0.05, 0, -0.35]} s={1.1} c="#f0b81e" />
    <Gafas p={[0.5, 0.38 + fall(tt, 0.7, 1.3), 0.25]} rot={[-0.15, -0.2, 0]} s={1.2} />
    {jet > 0 && <Chorro a={[1.4, 1.1, -0.3]} b={[lerp(1.4, 0.55, jet), lerp(1.1, 0.4, jet), lerp(-0.3, 0.27, jet)]} r={0.045 * (1 - cl((tt - 2.6) / 0.4))} c="#b8d84a" o={0.9} />}
    {imp && Array.from({ length: 16 }, (_, i) => { const k = tt - 2.35, rr = rn(i, 1);
      return i < 8 ? <mesh key={i} position={[0.36 + rn(i, 2) * 0.32, 0.47 - Math.min(0.25, k * (0.05 + 0.12 * rr)), 0.31]} scale={[0.028, 0.04 + 0.02 * Math.min(1, k), 0.016]}><sphereGeometry args={[1, 10, 8]} />{AGUA(0.9, "#c8e05a")}</mesh>
        : k < 0.8 ? <mesh key={i} position={[0.55 + Math.cos(i) * k * 0.8, 0.45 + Math.sin(i * 2) * k * 0.6 - 2 * k * k, 0.32 + 0.4 * k]} scale={0.015}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.9, "#c8e05a")}</mesh> : null; })}
  </Estudio>;
}}</Stage>;

// 15 · LA GRASA ESCONDIDA: la lata de atún (etiqueta azul, tapa abierta) entra deslizando, se inclina sobre el frasco y suelta un hilo dorado de aceite; la tarja de al lado queda con su cruz roja; la última gota cae lenta y salpica
const AAtun: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const ent = eio(tt, 0.0, 0.9), inc = eio(tt, 0.9, 1.5), hilo = tt > 1.4 && tt < 3.6, lleno = 0.25 + 0.3 * eio(tt, 1.5, 3.6), gota = cl((tt - 3.75) / 0.8) ** 0.7;
  return <Estudio t={tt} cam={[0.15, 0.95, 1.85]} look={[0.22, 0.5, 0]} orbit={0.08}>
    <group position={[lerp(-1.5, 0.08, ent), 0.92, 0]} rotation={[0, 0, -1.75 * inc]}><Lata s={1.15} aceite={1 - 0.7 * eio(tt, 1.5, 3.6)} /></group>
    {hilo && <Chorro a={[0.3, 0.86, 0]} b={[0.3, 0.06 + 0.44 * lleno, 0]} r={0.032} c="#e6b440" o={0.62} />}
    {gota > 0 && gota < 1 && <mesh position={[0.3, lerp(0.84, 0.08 + 0.44 * lleno, gota * gota), 0]} scale={[0.04, 0.055, 0.04]}><sphereGeometry args={[1, 14, 12]} />{AGUA(0.8, "#e6b440")}</mesh>}
    {gota >= 1 && tt < 5.2 && Array.from({ length: 10 }, (_, i) => { const k = cl((tt - 4.55) / 0.6); return <mesh key={"sp" + i} position={[0.3 + Math.cos(i * 0.63) * 0.16 * k, 0.1 + 0.44 * lleno + 0.18 * Math.sin(k * P) * (0.5 + rn(i, 1)), Math.sin(i * 0.63) * 0.16 * k]} scale={0.016}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.85, "#e6b440")}</mesh>; })}
    <Onda p={[0.3, 0.09 + 0.44 * lleno, 0]} t={tt} a={4.5} r={0.18} />
    <Frasco p={[0.3, fall(tt, 0.2, 1.2), 0]} s={1.1} lleno={lleno} c="#e8c770" tapa={0} />
  </Estudio>;
}}</Stage>;

// 16 · UNA CUCHARADA AL DÍA: cucharas de metal llegan de a una con su bolita de grasa, la vuelcan al frasco de mayonesa y el nivel sube; al lado el contador mecánico corre de 1 a 365
const ACucharadas: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const A = [0.3, 1.0, 1.7, 2.4, 3.1], k = eio(tt, 0.4, 4.4), n = Math.max(1, Math.min(365, Math.round(k * 73) * 5));
  const lleno = 0.08 + A.filter((a) => tt > a + 0.9).length * 0.16;
  const num = ctex("n365_" + n, 512, 200, (g) => { g.clearRect(0, 0, 512, 200); g.fillStyle = "#111"; g.fillRect(0, 0, 512, 200); g.fillStyle = "#ffc23a"; g.font = "900 160px Arial"; g.textAlign = "center"; g.fillText(String(n).padStart(3, "0"), 256, 165); });
  return <Estudio t={tt} cam={[0.0, 1.0, 2.9]} look={[0, 0.62, 0]} orbit={0.08}>
    <group position={[0.45, 0, 0]} scale={[1, cl(phys(tt, 0.0, 5, 0.55)) + 0.001, 1]}><Frasco p={[0, 0, 0]} s={2.0} lleno={lleno} c="#f4eed8" tapa={0} /></group>
    {A.map((a, i) => { const k1 = eio(tt, a - 0.3, a + 0.3), vu = eio(tt, a + 0.3, a + 0.6), va = eio(tt, a + 0.75, a + 1.1), bk = cl((tt - (a + 0.45)) / 0.45);
      return <group key={i}>
        {k1 > 0 && va < 1 && <Cuchara p={[lerp(-0.6, 0.38, k1) - 0.6 * va, 1.12 + 0.2 * va, 0.05]} rot={[vu * 1.6, 0, 0.2]} s={2.0} carga={1 - cl(vu * 2)} />}
        {bk > 0 && bk < 1 && <mesh position={[0.45, lerp(1.1, 0.06 + 0.8 * lleno, bk * bk), 0.05]} scale={[0.13 * (1 - 0.35 * Math.sin(bk * P)), 0.08 * (1 + 1.3 * Math.sin(bk * P)), 0.11 * (1 - 0.35 * Math.sin(bk * P))]}><sphereGeometry args={[1, 14, 10]} />{GRASA()}</mesh>}
      </group>; })}
    <group position={[-0.8, 0.75 + fall(tt, 0.1, 1.0), 0.15]}>
      <RBox s={[1.0, 0.46, 0.24]} r={0.04}>{M.cromo("#8a8f96")}</RBox>
      <mesh position={[0, 0, 0.125]}><planeGeometry args={[0.86, 0.34]} /><meshBasicMaterial map={num} toneMapped={false} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.53, 0, 0]} rotation={[tt * 6, 0, P2]}><cylinderGeometry args={[0.07, 0.07, 0.06, 12]} />{M.cromo()}</mesh>)}
    </group>
  </Estudio>;
}}</Stage>;

// 17 · LA SOSA SE COME EL CODO: el frasco con calavera vuelca al desagüe; dentro del codo en corte la pared se mancha de óxido que avanza, se adelgaza y se abre un agujero: gotea en la cubeta de abajo
const ASosa: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const vu = eio(tt, 0.3, 0.8) * (1 - eio(tt, 1.6, 2.0)), cor = eio(tt, 1.0, 3.2), aguj = eio(tt, 2.9, 3.5);
  return <Estudio t={tt} cam={[lerp(0.15, 0.3, eio(tt, 1.8, 3.6)), lerp(0.3, -0.12, eio(tt, 1.8, 3.6)), lerp(2.35, 1.35, eio(tt, 1.8, 3.6))]} look={[lerp(0.0, 0.25, eio(tt, 1.8, 3.6)), lerp(0.05, -0.2, eio(tt, 1.8, 3.6)), -0.1]} orbit={0.06} mesa={false}>
    <group position={[-0.75, 0.95 + fall(tt, 0.0, 1.0), 0]} rotation={[0, 0, -1.9 * vu]}>
      <mesh geometry={memo("frSosa", () => lathe([[0, 0], [0.15, 0], [0.16, 0.04], [0.16, 0.36], [0.08, 0.44], [0.08, 0.5]], 32))} castShadow><meshPhysicalMaterial color="#f3f0e8" roughness={0.3} clearcoat={0.5} /></mesh>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.162, 0.162, 0.22, 32, 1, true, -1.0, 2.0]} /><meshStandardMaterial map={calavera("#f2c230")} /></mesh>
      <mesh position={[0, 0.53, 0]}><cylinderGeometry args={[0.085, 0.085, 0.07, 16]} /><meshStandardMaterial color="#c0392b" /></mesh>
    </group>
    {vu > 0.6 && <Chorro a={[-0.25, 0.85, 0]} b={[0.0, 0.62, 0]} r={0.016} c="#e9f0b0" o={0.8} />}
    <Tubo pts={[[0, 0.62, -0.1], [0, 0.32, -0.1]]} r={0.07} />
    <CanoCorte p={[0.2, 0.14, -0.1]} L={1.5} r={0.2} />
    {Array.from({ length: 44 }, (_, i) => { const th = -P2 + (rn(i, 1) - 0.5) * 2.4, k = cl(cor * 1.6 - rn(i, 2) * 0.6);
      return <mesh key={i} position={[0.2 + (rn(i, 3) - 0.5) * 1.1, 0.14 + Math.sin(th) * 0.18, -0.1 - Math.abs(Math.cos(th)) * 0.18]} rotation={[th - P2 * 0, 0, 0]} scale={(0.05 + 0.07 * rn(i, 4)) * k + 0.0005}>
        <sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={col("#a8642a", "#3a2410", k)} roughness={1} /></mesh>; })}
    <mesh position={[0.25, -0.045, -0.1]} rotation={[-P2, 0, 0]} scale={aguj * 0.13 + 0.0005}><circleGeometry args={[1, 9]} /><meshBasicMaterial color="#050302" /></mesh>
    {Array.from({ length: 9 }, (_, i) => <mesh key={"f" + i} position={[0.25 + Math.cos(i * 0.7) * 0.13 * aguj, -0.05, -0.1 + Math.sin(i * 0.7) * 0.13 * aguj]} rotation={[0.6, i, 0]} scale={[0.03 * aguj + 0.0005, 0.012, 0.02]}><boxGeometry /><meshStandardMaterial color="#5a3216" roughness={1} /></mesh>)}
    {aguj > 0.5 && <Chorro a={[0.25, -0.06, -0.1]} b={[0.25, -0.95, -0.1]} r={0.035 * cl((aguj - 0.5) * 2)} c="#c9d870" o={0.85} />}
    <Cubeta p={[0.25, -1.05, -0.1]} s={0.85} nivel={0.2 + 0.2 * eio(tt, 3.4, 4.8)} agua="#a8a860" />
  </Estudio>;
}}</Stage>;

// 18 · EL CLORO NUNCA CON NADA: la botella con rombo de peligro y la de vinagre se acercan y se tocan; sube una nube verdosa que avanza hacia la cámara; la ventana de atrás se abre y la nube se va por ella
const ACloro: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const acerca = eio(tt, 0.4, 1.5), nube = cl((tt - 1.5) / 2.0), sep = eio(tt, 3.0, 3.8), abre = eio(tt, 2.9, 3.5), sale = eio(tt, 3.4, 4.8);
  const etq = (map: THREE.Texture) => <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.172, 0.172, 0.3, 32, 1, true, -1.1, 2.2]} /><meshStandardMaterial map={map} roughness={0.6} /></mesh>;
  return <Estudio t={tt} cam={[0.0, 1.0, 2.55]} look={[0, 0.65, -0.2]} orbit={0.06}>
    <group position={[lerp(-0.95, -0.24, acerca) - 0.55 * sep, fall(tt, 0.0, 1.0), 0]} scale={1.6}><Botella c="#f6f7f8" />{etq(peligro())}</group>
    <group position={[lerp(0.95, 0.24, acerca) + 0.55 * sep, fall(tt, 0.15, 1.0), 0]} scale={1.6}><Botella c="#e8b44a" vidrio />{etq(papel("vinagreE2", ["VINAGRE"], { size: 170, bg: "#fff2c0", ink: "#7a3a10" }))}</group>
    {nube > 0 && Array.from({ length: 90 }, (_, i) => { const k = cl(nube * 1.3 - rn(i, 1) * 0.3), a = rn(i, 2) * 2 * P;
      const p0: V3 = [Math.cos(a) * 0.5 * k, 1.0 + 0.6 * k * rn(i, 3), 0.15 + 0.7 * k * rn(i, 4)];
      const p: V3 = [lerp(p0[0], (rn(i, 5) - 0.5) * 0.5, sale), lerp(p0[1], 1.25, sale), lerp(p0[2], -1.6, sale)];
      return <mesh key={i} position={p} scale={(0.2 + 0.26 * rn(i, 6)) * k * (1 + 0.15 * Math.sin(tt * 1.3 + i)) + 0.001}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#cfe25a" emissive="#8aa82a" emissiveIntensity={0.25} transparent opacity={0.13 * (1 - 0.8 * sale)} depthWrite={false} roughness={1} /></mesh>; })}
    <group position={[0, 1.2, -1.5]}>
      {[[0, 0.62, 1.5, 0.08], [0, -0.62, 1.5, 0.08], [-0.75, 0, 0.08, 1.32], [0.75, 0, 0.08, 1.32]].map(([x, y, w, hh], i) => <mesh key={i} position={[x, y, 0]}><boxGeometry args={[w, hh, 0.08]} />{M.madera("#9a6a3a")}</mesh>)}
      {[-1, 1].map((k) => <group key={k} position={[k * 0.71, 0, 0]} rotation={[0, k * -1.6 * abre, 0]}>
        <mesh position={[-k * 0.355, 0, 0]}><boxGeometry args={[0.7, 1.2, 0.02]} />{M.vidrio()}</mesh>
        <mesh position={[-k * 0.355, 0, 0.012]}><boxGeometry args={[0.04, 1.2, 0.03]} />{M.madera("#9a6a3a")}</mesh></group>)}
      <pointLight position={[0, 0, -0.4]} intensity={0.5 + 6 * abre} distance={3.5} color="#fff6e0" />
    </group>
  </Estudio>;
}}</Stage>;

// 19 · CON AGUA EMPUJA AGUA: dos caños de vidrio con su copa arriba; a la izquierda la copa aprieta aire (un resorte que se comprime y burbujas) y el tapón sólo tiembla; a la derecha empuja una columna de agua como un pistón y el tapón sale disparado por abajo
const ACopa: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const bomb = tt > 0.6 ? 0.5 + 0.5 * Math.sin((tt - 0.6) * 6) : 0, dispara = cl((tt - 2.7) / 0.9), resorte = memo("resG", () => tuboGeo(Array.from({ length: 200 }, (_, i) => [Math.cos(i * 0.5) * 0.06, i / 200, Math.sin(i * 0.5) * 0.06] as V3), 0.008, 300, 6));
  return <Estudio t={tt} cam={[0.2, 0.45, 3.05]} look={[0.2, 0.25, 0]} orbit={0.06}>
    {[-1, 1].map((k) => <group key={k} position={[k * 0.6, 0, 0]}>
      <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.11, 0.11, 1.1, 32, 1, true]} />{M.vidrio()}</mesh>
      <Copa p={[0, 1.0 - 0.06 * bomb, 0]} aplasta={bomb * 0.8} s={0.85} />
      {k < 0 && <><mesh geometry={resorte} position={[0, 0.02, 0]} scale={[1, 0.88 - 0.4 * bomb, 1]}>{M.cromo()}</mesh>
        {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.1, 0.1 + ((tt * 0.5 + i / 8) % 1) * 0.8, 0.02]} scale={0.012 + 0.012 * bomb}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.6, "#ffffff")}</mesh>)}
        <mesh position={[0.025 * Math.sin(tt * 40) * bomb, -0.04, 0]} castShadow><sphereGeometry args={[0.14, 20, 14]} /><meshStandardMaterial color="#6a4e30" roughness={0.9} /></mesh></>}
      {k > 0 && <><mesh position={[0, 0.48 - 0.04 * bomb - 0.5 * dispara, 0]}><cylinderGeometry args={[0.1, 0.1, 0.94, 24]} />{AGUA(0.8, AZUL)}</mesh>
        <mesh position={[0, 0.96 - 0.06 * bomb - 0.5 * dispara, 0]}><cylinderGeometry args={[0.105, 0.105, 0.04, 24]} />{M.cromo()}</mesh>
        <mesh position={[0.025 * Math.sin(tt * 40) * bomb * (1 - cl(dispara * 9)) + 0.75 * dispara, -0.04 - 0.75 * dispara * dispara, 0]} scale={[1, 1 + 1.5 * dispara * (1 - dispara), 1]} castShadow><sphereGeometry args={[0.14, 20, 14]} /><meshStandardMaterial color="#6a4e30" roughness={0.9} /></mesh>
        {dispara > 0 && dispara < 1 && [0.12, 0.24, 0.36].map((d, j) => { const q = Math.max(0, dispara - d); return <mesh key={"e" + j} position={[0.75 * q, -0.04 - 0.75 * q * q, 0]} scale={0.12 * (1 - j * 0.25)}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#6a4e30" transparent opacity={0.35 - j * 0.1} depthWrite={false} /></mesh>; })}
        {dispara > 0 && dispara < 1 && Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.cos(i) * 0.4 * dispara, -0.1 - 0.4 * dispara + 0.3 * Math.sin(i * 3) * dispara, Math.sin(i * 2) * 0.3 * dispara]} scale={0.02}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.9, AZUL)}</mesh>)}</>}
    </group>)}
  </Estudio>;
}}</Stage>;

// 20 · TAPA LA OTRA TARJA: tarja doble con agua; empujas con la copa en una y el agua salta en chorro por el desagüe de la otra… hasta que cae un trapo mojado con pliegues encima y la fuerza se queda donde va
const ATrapo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const bomb = tt > 0.4 ? Math.max(0, Math.sin((tt - 0.4) * 5)) : 0, tapado = tt > 2.75, jet = tapado ? 0 : bomb, tr = 1.0 * (1 - phys(tt, 2.3, 6, 0.45));
  const tela = memo("telaG", () => { const g = new THREE.PlaneGeometry(0.62, 0.55, 16, 16), pa = g.attributes.position;
    for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), y = pa.getY(i); pa.setZ(i, 0.03 * Math.sin(x * 22) + 0.015 * Math.sin(y * 30 + x * 8) - 0.12 * (x * x + y * y)); }
    g.computeVertexNormals(); return g; });
  return <Estudio t={tt} cam={[0.0, 1.45, 1.85]} look={[0, 0.2, 0]} orbit={0.08}>
    <Tarja p={[-0.6, 0, 0]} w={1.1} agua={0.4} ac={AZUL} />
    <Tarja p={[0.6, 0, 0]} w={1.1} agua={0.4} ac={AZUL} />
    <Copa p={[-0.6, 0.15, 0]} aplasta={tapado ? 0.5 + 0.5 * Math.sin(tt * 5) : bomb} s={0.9} />
    {jet > 0.05 && Array.from({ length: 22 }, (_, i) => { const u = ((i / 22 + tt * 1.8) % 1); return <mesh key={"ar" + i} position={[0.6 + 0.55 * u, 0.15 + 0.9 * jet * u * (1 - u) * 2.2, 0.3 * u]} scale={0.035 * (1 - 0.5 * u) * jet}><sphereGeometry args={[1, 10, 8]} />{AGUA(0.85, "#cfe9f6")}</mesh>; })}
    <mesh position={[0.6, 0.15 + 0.12 * jet, 0]} scale={[1, jet + 0.001, 1]}><cylinderGeometry args={[0.04, 0.07, 0.25, 14]} />{AGUA(0.85, "#cfe9f6")}</mesh>
    {Array.from({ length: 10 }, (_, i) => { const k = ((tt * 1.4 + i / 10) % 1); return jet > 0.3 ? <mesh key={i} position={[0.6 + Math.cos(i * 2.4) * 0.25 * k, 0.4 + 0.3 * jet * Math.sin(k * P), Math.sin(i * 2.4) * 0.25 * k]} scale={0.018}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.9, "#cfe9f6")}</mesh> : null; })}
    <mesh geometry={tela} position={[0.6, 0.18 + tr, 0]} rotation={[-P2, 0, 0.35]} castShadow><meshStandardMaterial color="#6b7f93" roughness={0.95} side={THREE.DoubleSide} /></mesh>
    {tapado && <Onda p={[0.6, 0.19, 0]} t={tt} a={2.8} r={0.5} />}
  </Estudio>;
}}</Stage>;

// 21 · GLU, GLU, GLU: cámara rasante sobre el agua de la tarja; cada glu es una burbuja grande y transparente que sube del desagüe, crece y revienta con su anillo y sus gotitas; el nivel baja a escalones
const AGorgoteo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const G = [0.5, 1.8, 3.1], lvl = 0.85 - 0.18 * G.reduce((s, a) => s + eio(tt, a + 0.7, a + 1.0), 0), sup = 0.0125 + 0.32 * lvl;
  return <Estudio t={tt} cam={[0.35, 0.58, 1.15]} look={[0, 0.16, 0]} orbit={0.06}>
    <Tarja w={1.2} agua={lvl} ac={AZUL} />
    {G.map((a, i) => { const k = cl((tt - a) / 0.7), b = cl((tt - a - 0.7) / 0.5);
      return <group key={i}>
        {k > 0 && k < 1 && <mesh position={[0.05 * Math.sin(i), 0.03 + (sup - 0.06) * k, 0]} scale={0.06 + 0.15 * k * k}><sphereGeometry args={[1, 28, 20]} /><meshPhysicalMaterial color="#ffffff" roughness={0} transparent opacity={0.35} clearcoat={1} envMapIntensity={2.5} depthWrite={false} /></mesh>}
        <Onda p={[0.05 * Math.sin(i), sup + 0.003, 0]} t={tt} a={a + 0.7} r={0.45} />
        {b > 0 && b < 1 && <mesh position={[0.05 * Math.sin(i), sup + 0.01, 0]} rotation={[P2, 0, 0]} scale={0.2 + 0.35 * b}><torusGeometry args={[1, 0.035, 10, 48]} /><meshPhysicalMaterial color="#ffffff" roughness={0} transparent opacity={0.6 * (1 - b)} clearcoat={1} depthWrite={false} /></mesh>}
        {b > 0 && b < 1 && Array.from({ length: 8 }, (_, j) => <mesh key={j} position={[0.05 * Math.sin(i) + Math.cos(j * 0.8) * 0.15 * b, sup + 0.25 * Math.sin(b * P) * (0.6 + rn(j, 1) * 0.6), Math.sin(j * 0.8) * 0.15 * b]} scale={0.02}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.9, "#e8f4fb")}</mesh>)}
      </group>; })}
  </Estudio>;
}}</Stage>;

// 22 · EL NIDO EN LA VENTILACIÓN: subimos por dentro del tubo de ventilación (hollín, juntas, la luz arriba tapada por ramitas)… salimos al techo de tejas: en la boca, un nido con huevos celestes y la paloma que se asusta y vuela
const ANido: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const sube = eio(tt, 0.1, 2.2), b = eio(tt, 1.9, 2.9), yc = lerp(-0.6, 1.9, sube), vuela = cl((tt - 3.5) / 1.2);
  const hollin = () => ctex("hollin", 256, 512, (g) => { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#d9d6d0"); gr.addColorStop(1, "#4a4540"); g.fillStyle = gr; g.fillRect(0, 0, 256, 512); g.fillStyle = "#2a2622"; for (let y = 40; y < 512; y += 96) g.fillRect(0, y, 256, 10); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(30,25,20,${0.15 + 0.2 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 256, rn(i, 3) * 512, 3, 6); } });
  const teja = () => ctex("tejas", 512, 512, (g) => { g.fillStyle = "#8a3e22"; g.fillRect(0, 0, 512, 512); for (let r = 0; r < 8; r++) for (let c = 0; c < 9; c++) { g.fillStyle = ["#b0532c", "#a24a28", "#bc5e34"][(r + c) % 3]; g.beginPath(); g.ellipse(c * 64 + (r % 2) * 32, r * 64 + 40, 30, 36, 0, 0, P); g.fill(); } });
  const cam: V3 = [lerp(0, 0.75, b), lerp(yc, 3.0, b), lerp(0.05, 1.05, b)], look: V3 = [lerp(0, 0.1, b), lerp(yc + 1.2, 2.62, b), lerp(-0.25, 0, b)];
  return <Estudio t={tt} cam={cam} look={look} orbit={0.04} mesa={false}>
    <mesh position={[0, 1.0, 0]}><cylinderGeometry args={[0.45, 0.45, 3.2, 40, 1, true]} /><meshStandardMaterial map={hollin()} roughness={0.95} side={THREE.DoubleSide} transparent opacity={1 - 0.75 * Math.sin(P * b)} /></mesh>
    <mesh position={[0, 2.6, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.45, 0.03, 8, 40]} />{PVC()}</mesh>
    {[[0, -1.3, 3.2, 1.7], [0, 1.3, 3.2, 1.7], [-1.3, 0, 1.7, 0.9], [1.3, 0, 1.7, 0.9]].map(([x, z, w, d], i) => <mesh key={i} position={[x, 2.35, z]} rotation={[0, 0, 0]} receiveShadow><boxGeometry args={[w, 0.06, d]} /><meshStandardMaterial map={teja()} roughness={0.8} /></mesh>)}
    <pointLight position={[0, 2.9, 0.3]} intensity={4} distance={4} color="#fff2d8" />
    <Nido p={[0, 2.58, 0]} s={1.9} huevos={0} />
    {[[-0.08, 0], [0.06, 0.05], [0.0, -0.08]].map(([x, z], i) => <mesh key={i} position={[x * 1.2, 2.73, z * 1.2]} scale={[0.07, 0.09, 0.07]} castShadow><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#cfe6ee" roughness={0.5} /></mesh>)}
    {vuela > 0 && Array.from({ length: 10 }, (_, i) => <mesh key={"pl" + i} position={[0.45 + (rn(i, 1) - 0.3) * 0.9 * vuela, 2.85 + 0.5 * vuela * rn(i, 2) - 0.3 * vuela * vuela, 0.15 + (rn(i, 3) - 0.5) * 0.6 * vuela]} rotation={[tt * 3 + i, i, tt * 2]} scale={[0.05, 0.012, 0.02]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#d8d8dc" roughness={0.9} /></mesh>)}
    <Paloma p={[0.55 + 1.6 * vuela, 2.82 + 1.2 * vuela * vuela, 0.15 - 0.5 * vuela]} rot={[0, -0.6 + 0.4 * vuela, 0.3 * vuela]} s={1.3} ala={vuela > 0 ? 0.5 + 0.5 * Math.sin(tt * 30) : 0} />
  </Estudio>;
}}</Stage>;

// 23 · LOS CINCO ERRORES: cada error llega grande al centro cuando se nombra (sartén que vierte grasa humeante, canilla fría con escarcha, botella con calavera burbujeando, taza que vuelca posos y arroz, reloj de arena corriendo) con su anillo rojo; los anteriores se van atrás en fila
const AErrores: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const N = 5, cur = Array.from({ length: N }, (_, i) => i).filter((i) => tt >= rel(h, i)).pop() ?? -1;
  const atras = (i: number) => i < N - 1 ? eio(tt, rel(h, i + 1) - 0.4, rel(h, i + 1) + 0.6) : 0;
  const numT = (n: number) => ctex("errN" + n, 256, 256, (g) => { g.clearRect(0, 0, 256, 256); g.fillStyle = "#e8432e"; g.font = "900 220px Arial"; g.textAlign = "center"; g.fillText(String(n), 128, 210); });
  const obj = (i: number, act: number) => [
    <group key={0}><Sarten rot={[0, 0, -0.35 * act]} film={1} /><Vapor t={tt} p={[0, 0.1, 0]} o={0.35} h={0.6} />{act > 0.5 && <Chorro a={[-0.5, 0.0, 0]} b={[-0.55, -0.6, 0]} r={0.02} c="#e0a52e" />}</group>,
    <group key={1}><Canilla on={act} largo={0.42} c="#bfe6ff" />{Array.from({ length: 10 }, (_, j) => <mesh key={j} position={[0.3 + (rn(j, 1) - 0.5) * 0.12, 0.02 + rn(j, 2) * 0.05, (rn(j, 3) - 0.5) * 0.12]} scale={0.02 * act + 0.001}><octahedronGeometry args={[1]} /><meshStandardMaterial color="#e6f6ff" emissive="#8fd0ff" emissiveIntensity={0.5} /></mesh>)}<pointLight position={[0.3, 0.4, 0.4]} intensity={2 * act} distance={1.2} color="#8fd0ff" /></group>,
    <group key={2}><mesh geometry={memo("frSosa2", () => lathe([[0, 0], [0.16, 0], [0.17, 0.04], [0.17, 0.4], [0.08, 0.5], [0.08, 0.56]], 32))} castShadow><meshPhysicalMaterial color="#f3f0e8" roughness={0.3} /></mesh>
      <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.172, 0.172, 0.24, 32, 1, true, -1.0, 2.0]} /><meshStandardMaterial map={calavera("#f2c230")} /></mesh>
      {Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[(rn(j, 1) - 0.5) * 0.1, 0.6 + ((tt * 0.6 + j / 6) % 1) * 0.4, 0]} scale={0.02 * act + 0.001}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#b8e04a" transparent opacity={0.7} /></mesh>)}</group>,
    <group key={3}><Taza p={[0, 0.3, 0]} rot={[0, 0, 1.9 * act]} lleno={1} c="#2a1a10" />{act > 0.6 && <group position={[-0.25, 0, 0]}><Granos n={30} tipo="cafe" c="#2a1a10" area={[0.12, 0.1]} y={0.02} s={1.6} /><Granos n={14} area={[0.14, 0.1]} y={0.03} s={1.3} /></group>}</group>,
    <group key={4}><Arena p={[0, 0.34, 0]} k={act * cl((tt - rel(h, 4)) / 3)} t={tt} /></group>,
  ][i];
  return <Estudio t={tt} cam={[0.0, 1.1, 3.0]} look={[0, 0.42, 0]} orbit={0.06}>
    {Array.from({ length: N }, (_, i) => { const e = IN(tt, rel(h, i)), a = atras(i), on = i === cur;
      return <group key={i} position={[lerp(0, -1.4 + i * 0.7, a), 1.2 * (1 - cl(e)) + 0.05 * a, lerp(0.3, -0.7, a)]} scale={lerp(1.1, 0.55, a) * e + 0.001}>
        {obj(i, on ? eio(tt, rel(h, i) + 0.6, rel(h, i) + 1.4) : 0.3)}
        <mesh position={[0, 0.005, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.4, 0.45, 48]} /><meshBasicMaterial color={on ? "#e8432e" : "#5a5a5a"} toneMapped={false} /></mesh>
      </group>; })}
    {cur >= 0 && <><pointLight position={[0, 1.1, 1.0]} intensity={4} distance={2.4} color="#ff6a4a" />
      <mesh position={[0.95, 0.004, 0.75]} rotation={[-P2, 0, -0.2]} scale={IN(tt, rel(h, cur) + 0.3)}><planeGeometry args={[0.5, 0.5]} /><meshBasicMaterial map={numT(cur + 1)} transparent toneMapped={false} /></mesh></>}
  </Estudio>;
}}</Stage>;

// 24 · EL BAÑO DEL DOMINGO: la taza entra deslizando y vuelca un chorro de polvo blanco con su nube en el desagüe; la tetera vierte agua hirviendo en tres tandas (se encienden tres gotas en el borde); el reloj llena su cuarto de hora
const ADomingo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const ent = eio(tt, 0.0, 0.6), vt = eio(tt, 0.6, 1.0) * (1 - eio(tt, 1.6, 1.9)), T = [1.9, 2.6, 3.3], te = T.map((a) => cl((tt - a) / 0.15) * (1 - cl((tt - a - 0.5) / 0.15))), vierte = Math.max(...te), q = eio(tt, 3.6, 4.6);
  return <Estudio t={tt} cam={[0.0, 1.3, 2.75]} look={[0.0, 0.5, 0]} orbit={0.06}>
    <Tarja w={1.1} agua={0} />
    <Taza p={[lerp(1.2, 0.18, ent), 0.52, 0.05]} rot={[0, 0, 2.0 * vt]} lleno={1 - eio(tt, 0.9, 1.5)} c="#fbfbf8" />
    {vt > 0.6 && Array.from({ length: 30 }, (_, i) => { const k = ((tt * 1.6 + i / 30) % 1); return <mesh key={i} position={[0.03 + (rn(i, 1) - 0.5) * 0.04, 0.48 - 0.46 * k, (rn(i, 2) - 0.5) * 0.04]} scale={0.02}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#ffffff" /></mesh>; })}
    <Vapor t={tt} p={[0, 0.02, 0]} o={0.75 * vt} h={0.5} s={0.24} n={14} />
    <group position={[0.62, 0.78 + fall(tt, 1.2, 1.0), 0]} rotation={[0, P, 0.85 * vierte]}><Tetera s={0.8} /></group>
    {vierte > 0.5 && <Chorro a={[0.3, 0.7, 0]} b={[0.02, 0.03, 0]} r={0.028} c="#d9eef8" o={0.8} />}
    <Vapor t={tt} p={[0.05, 0.05, 0]} o={0.45 * vierte} h={0.7} s={0.22} n={12} />
    {T.map((a, i) => <mesh key={i} position={[-0.25 + i * 0.12, 0.395, 0.42]} scale={[0.03, 0.04, 0.03]}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color={tt > a + 0.5 ? "#4fb0e8" : "#5a5f66"} emissive={tt > a + 0.5 ? "#2f80c0" : "#000"} emissiveIntensity={0.6} /></mesh>)}
    <group position={[-0.85, 0.8 + fall(tt, 0.2, 1.0), 0.05]} rotation={[-0.1, 0.35, 0]} scale={1.2}>
      <Reloj k={q * 0.25} />
      <mesh position={[0, 0, 0.042]}><circleGeometry args={[0.24, 48, P2 - q * P2, q * P2 + 0.0001]} /><meshBasicMaterial color="#4fb0e8" transparent opacity={0.55} toneMapped={false} /></mesh>
    </group>
  </Estudio>;
}}</Stage>;

// 25 · LA ESPUMA SE GASTA ARRIBA: el vinagre cae sobre el bicarbonato y sube un volcán de espuma blanca por encima del borde… en segundos se desinfla y se queda arriba; abajo, en el caño transparente, el tapón de grasa sigue intacto
const AVinagre: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const vierte = tt > 0.2 && tt < 0.9, sube = cl(phys(tt, 0.7, 7, 0.45)), baja = eio(tt, 1.8, 3.0), k = sube * (1 - 0.82 * baja);
  return <Estudio t={tt} cam={[0.3, 1.35, 1.6]} look={[0, 0.0, 0]} orbit={0.05} mesa={false}>
    <Tarja p={[0, 0.3, 0]} w={1.1} />
    <Botella p={[-0.55, 1.05, 0]} rot={[0, 0, -2.2 * eio(tt, 0.0, 0.3) * (1 - eio(tt, 0.9, 1.2))]} s={0.5} c="#eef4f6" vidrio />
    {vierte && <Chorro a={[-0.3, 0.95, 0]} b={[0, 0.33, 0]} r={0.013} c="#f3ead0" o={0.75} />}
    {Array.from({ length: 80 }, (_, i) => { const a = rn(i, 1) * 2 * P, rr = Math.sqrt(rn(i, 2)), R = 0.12 + 0.3 * baja, H2 = 0.65 * k;
      return <mesh key={i} position={[Math.cos(a) * rr * R, 0.33 + (1 - rr) * H2 + rn(i, 3) * 0.05, Math.sin(a) * rr * R]} scale={(0.025 + 0.035 * rn(i, 4)) * (0.4 + 0.6 * sube) * (1 - 0.3 * baja)}><sphereGeometry args={[1, 12, 10]} /><meshPhysicalMaterial color="#fbfaf4" roughness={0.3} clearcoat={0.6} /></mesh>; })}
    <Tubo pts={[[0, 0.31, 0], [0, -0.75, 0]]} r={0.07} o={0.3} />
    <mesh position={[0, -0.42, 0]} castShadow><cylinderGeometry args={[0.066, 0.066, 0.34, 18]} /><meshStandardMaterial color="#efc94a" emissive="#7a5a10" emissiveIntensity={0.25} roughness={0.6} /></mesh>
  </Estudio>;
}}</Stage>;

// 26 · LA CUENTA: balanza de platillos — a la izquierda la tetera y la caja de bicarbonato; a la derecha caen de a uno tres billetes de $100 (la visita del plomero); el brazo se hunde con rebote y sigue oscilando
const ACuenta: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const B = [1.0, 1.7, 2.4], inc = 0.32 * B.reduce((s, a) => s + phys(tt, a + 0.35, 7, 0.1), 0) / 3 + 0.02 * Math.sin(tt * 4) * cl(tt - 1.3) * Math.exp(-0.6 * Math.max(0, tt - 2.8));
  const billete = () => ctex("bill100", 256, 128, (g) => { g.fillStyle = "#8fbf86"; g.fillRect(0, 0, 256, 128); g.strokeStyle = "#3e6a3a"; g.lineWidth = 8; g.strokeRect(8, 8, 240, 112); g.fillStyle = "#24461f"; g.font = "900 64px Arial"; g.textAlign = "center"; g.fillText("$100", 128, 86); g.beginPath(); g.arc(42, 64, 22, 0, 7); g.stroke(); });
  const caja = () => ctex("cajabic", 256, 256, (g) => { g.fillStyle = "#f28a2a"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#ffffff"; g.beginPath(); g.arc(128, 128, 78, 0, 7); g.fill(); g.fillStyle = "#f28a2a"; g.beginPath(); g.arc(128, 128, 52, 0, 7); g.fill(); });
  return <Estudio t={tt} cam={[0.0, 1.15, 3.1]} look={[0, 0.6, 0]} orbit={0.06}>
    <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.04, 0.12, 1.0, 12]} />{M.cromo("#c9a96a")}</mesh>
    <group position={[0, 1.02, 0]} rotation={[0, 0, -inc]}>
      <mesh castShadow><boxGeometry args={[2.0, 0.04, 0.06]} />{M.cromo("#c9a96a")}</mesh>
      {[-1, 1].map((k) => <group key={k} position={[k * 0.95, 0, 0]} rotation={[0, 0, inc]}>
        <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.005, 0.005, 0.6, 4]} />{M.cromo()}</mesh>
        <mesh position={[0, -0.6, 0]} castShadow><cylinderGeometry args={[0.38, 0.32, 0.04, 32]} />{M.cromo("#c9a96a")}</mesh>
        {k < 0 && <><group position={[-0.12, -0.58, 0]}><Tetera s={0.42} /></group><RBox p={[0.18, -0.46, 0.05]} s={[0.16, 0.24, 0.1]} r={0.01}><meshStandardMaterial map={caja()} /></RBox></>}
        {k > 0 && B.map((a, i) => <mesh key={i} position={[0.03 * (i - 1), -0.575 + i * 0.014 + 1.4 * (1 - phys(tt, a, 6, 0.4)), 0.02 * i]} rotation={[-P2, 0, 0.25 * i - 0.2]}><planeGeometry args={[0.9, 0.45]} /><meshStandardMaterial map={billete()} side={THREE.DoubleSide} /></mesh>)}
      </group>)}
    </group>
  </Estudio>;
}}</Stage>;

// 27 · EL KIT DEBAJO DE LA TARJA: la cubeta llega y, de a uno, cuando se nombran, caen adentro la linterna, la copa, la sonda enrollada y los guantes colgando del borde; la sexta cosa, el frasco, aparece al lado de la hornalla
const AKit: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const f = (i: number) => fall(tt, rel(h, i) + 0.15, 1.5), cur = [0, 1, 2, 3, 4, 5].filter((i) => tt >= rel(h, i)).pop() ?? 0;
  const spot: V3[] = [[-0.3, 0.9, 0.6], [-0.2, 0.9, 0.5], [0.15, 0.9, 0.5], [0.1, 0.9, 0.6], [0.35, 0.9, 0.6], [1.0, 0.9, 0.6]];
  return <Estudio t={tt} cam={[0.4, 2.35, 1.25]} look={[0.4, 0.15, 0]} orbit={0.06}>
    <Cubeta p={[0, 0, 0]} s={1.55} c="#d6362c" rot={[0, 0, 0]} />
    <group position={[0, 0.5 * (1 - cl(phys(tt, rel(h, 0), 6, 0.5))), 0]} />
    <Linterna p={[-0.22, 0.32 + f(1), 0.05]} rot={[-1.1, 0.4, 0]} on={1} />
    <Copa p={[0.12, 0.2 + f(2), -0.08]} rot={[0.5, 0, -0.55]} s={0.7} />
    <Sonda p={[-0.05, 0.38 + f(3), 0.12]} rot={[1.2, 0.2, 0]} avance={0.03} s={0.75} />
    <Guante p={[0.42, 0.62 + f(4), 0.2]} rot={[0.2, 0, 2.6]} s={0.75} />
    <Guante p={[0.5, 0.6 + f(4), -0.05]} rot={[0.1, 0, 2.4]} s={0.75} c="#f0b81e" />
    <group position={[1.05, 0, 0.05]} scale={IN(tt, rel(h, 5)) + 0.001}>
      <mesh position={[0, 0.02, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.12, 0.26, 32]} />{M.hierro()}</mesh>
      {Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[0, 0.045, 0]} rotation={[0, i * P / 4, 0]}><boxGeometry args={[0.6, 0.03, 0.03]} />{M.hierro()}</mesh>)}
    </group>
    <Frasco p={[1.05, 0.06 + f(5), 0.05]} s={0.8} lleno={0.45} />
    <pointLight position={spot[cur]} intensity={3} distance={1.6} color="#fff0d0" />
  </Estudio>;
}}</Stage>;

// 28 · EL TAPÓN DE LUCÍA: del sifón inclinado se desliza una masa gris del tamaño de un huevo; las manos la parten en dos y las mitades giran hacia cámara: adentro, en capas, grasa blanca, granos de arroz y puntos de café
const ACaso: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const sale = eio(tt, 0.3, 1.5), parte = eio(tt, 2.2, 3.2), push = eio(tt, 2.4, 4.5);
  const corte = () => ctex("corteTap", 256, 256, (g) => { g.fillStyle = "#6f6a60"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#efe6cc"; g.beginPath(); g.arc(128, 128, 112, 0, 7); g.fill(); g.strokeStyle = "#e2c65a"; g.lineWidth = 18; g.beginPath(); g.arc(128, 128, 96, 0, 7); g.stroke(); g.strokeStyle = "#cbbf9a"; g.lineWidth = 10; g.beginPath(); g.arc(128, 128, 66, 0, 7); g.stroke();
    for (let i = 0; i < 26; i++) { g.save(); g.translate(40 + rn(i, 1) * 176, 40 + rn(i, 2) * 176); g.rotate(rn(i, 3) * 6); g.fillStyle = "#fffdf4"; g.strokeStyle = "#b8ad90"; g.lineWidth = 2; g.beginPath(); g.ellipse(0, 0, 10, 4, 0, 0, 7); g.fill(); g.stroke(); g.restore(); }
    for (let i = 0; i < 70; i++) { g.fillStyle = "#2a1a10"; g.beginPath(); g.arc(30 + rn(i, 4) * 196, 30 + rn(i, 5) * 196, 2 + rn(i, 6) * 3, 0, 7); g.fill(); } });
  const mx = lerp(-0.62, 0, sale), my = lerp(0.62, 0.17, sale * sale);
  return <Estudio t={tt} cam={[0.0, lerp(0.85, 0.55, push), lerp(1.75, 1.15, push)]} look={[0, 0.25, 0]} orbit={0.06}>
    <mesh position={[0, 0.02, 0]} rotation={[-P2, 0, 0]} receiveShadow><circleGeometry args={[0.55, 40]} /><meshStandardMaterial color="#f3efe6" roughness={0.3} /></mesh>
    <group position={[-0.95, 0.85, -0.1]} rotation={[0, 0, -2.3]}><Sifon s={0.9} /></group>
    {[-1, 1].map((k) => <group key={k} position={[mx + k * 0.3 * parte, my + 0.08 * parte, 0]} rotation={[0, k * P2 * parte, 0]} scale={1.35}>
      <mesh scale={[0.16, 0.15, 0.15]} castShadow><sphereGeometry args={[1, 28, 20, k > 0 ? P2 : -P2, P]} /><meshStandardMaterial color="#6f6a60" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <mesh rotation={[0, k > 0 ? -P2 : P2, 0]} scale={[0.155, 0.145, 1]}><circleGeometry args={[1, 32]} /><meshStandardMaterial map={corte()} roughness={0.8} side={THREE.DoubleSide} /></mesh>
    </group>)}
    <Mano p={[-0.45 - 0.2 * parte, 0.3, 0.22]} rot={[0.3, 0.8, -0.3]} pinza={0.5} s={0.6 * eio(tt, 1.4, 2.0) + 0.001} />
    <Mano p={[0.45 + 0.2 * parte, 0.3, 0.22]} rot={[0.3, -0.8, 0.3]} pinza={0.5} s={0.6 * eio(tt, 1.4, 2.0) + 0.001} />
  </Estudio>;
}}</Stage>;

// 29 · CUATRO MITOS: sobre la mesa de madera entra cada mito cuando se nombra (lata de refresco burbujeando, salero que suelta sal gruesa, medio limón que gotea, una tarja chica que «baja bien» con el tapón abajo) y, cuando se desarma, se cae de la mesa girando
const AMitos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const X = [-1.0, -0.33, 0.33, 1.0], cur = [0, 1, 2, 3].filter((i) => tt >= rel(h, i)).pop() ?? -1;
  const lataT = () => ctex("lataRef", 512, 128, (g) => { g.fillStyle = "#c8201e"; g.fillRect(0, 0, 512, 128); g.strokeStyle = "#ffffff"; g.lineWidth = 12; g.beginPath(); for (let x = 0; x <= 512; x += 8) g.lineTo(x, 64 + 26 * Math.sin(x / 40)); g.stroke(); });
  const limonT = () => ctex("limonC", 256, 256, (g) => { g.fillStyle = "#f6e36a"; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill(); g.fillStyle = "#fff6c0"; g.beginPath(); g.arc(128, 128, 104, 0, 7); g.fill(); for (let i = 0; i < 9; i++) { g.save(); g.translate(128, 128); g.rotate(i / 9 * 2 * P); g.fillStyle = "#f2d43a"; g.beginPath(); g.moveTo(8, 0); g.arc(0, 0, 96, -0.28, 0.28); g.closePath(); g.fill(); g.restore(); } });
  return <Estudio t={tt} cam={[0.0, 1.0, 2.35]} look={[0, 0.3, 0]} orbit={0.06}>
    <RBox p={[0, -0.05, 0]} s={[2.9, 0.1, 1.0]} r={0.02}><meshStandardMaterial color="#7a4c28" roughness={0.6} /></RBox>
    <mesh position={[0, 0.001, 0]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[2.9, 1.0]} /><meshStandardMaterial map={ctex("vetaMesa", 1024, 352, (g) => { g.fillStyle = "#8a5a32"; g.fillRect(0, 0, 1024, 352); for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(60,34,16,${0.15 + 0.25 * rn(i, 1)})`; g.lineWidth = 1 + 3 * rn(i, 2); g.beginPath(); const y0 = rn(i, 3) * 352; g.moveTo(0, y0); for (let x = 0; x <= 1024; x += 32) g.lineTo(x, y0 + 8 * Math.sin(x / (60 + 80 * rn(i, 4)) + i)); g.stroke(); } g.fillStyle = "#5a3418"; for (let x = 256; x < 1024; x += 256) g.fillRect(x, 0, 3, 352); })} roughness={0.55} /></mesh>
    {X.map((x, i) => { const e = IN(tt, rel(h, i)), kick = i < 3 ? rel(h, i + 1) - 1.4 : rel(h, 3) + 2.6, c = cl((tt - kick) / 1.0), on = i === cur;
      if (e < 0.001) return null;
      return <group key={i} position={[x, 1.0 * (1 - cl(e)) - 3 * Math.max(0, c - 0.35) ** 2, 0.7 * Math.min(1, c * 1.6)]} rotation={[1.6 * c * c, 0, 0]} scale={1.15 * e}>
        {i === 0 && <><mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.11, 0.11, 0.4, 32]} /><meshStandardMaterial map={lataT()} roughness={0.35} metalness={0.4} /></mesh>
          <mesh position={[0, 0.405, 0]}><cylinderGeometry args={[0.1, 0.11, 0.015, 32]} />{M.cromo()}</mesh>
          {on && Array.from({ length: 8 }, (_, j) => <mesh key={j} position={[(rn(j, 1) - 0.5) * 0.08, 0.42 + ((tt * 0.8 + j / 8) % 1) * 0.3, (rn(j, 2) - 0.5) * 0.08]} scale={0.012}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.7, "#ffffff")}</mesh>)}</>}
        {i === 1 && <><mesh geometry={memo("salero", () => lathe([[0, 0], [0.1, 0], [0.11, 0.05], [0.09, 0.3], [0.07, 0.34]], 32))} castShadow>{M.vidrio()}</mesh>
          <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.095, 0.1, 0.18, 24]} /><meshStandardMaterial color="#f6f6f2" roughness={0.9} /></mesh>
          <mesh position={[0, 0.37, 0]}><sphereGeometry args={[0.075, 20, 12, 0, 2 * P, 0, P2]} />{M.cromo()}</mesh>
          {Array.from({ length: 18 }, (_, j) => <mesh key={j} position={[0.18 + (rn(j, 1) - 0.5) * 0.2, 0.012, (rn(j, 2) - 0.5) * 0.2]} rotation={[rn(j, 3) * 3, rn(j, 4) * 3, 0]} scale={0.014}><boxGeometry /><meshStandardMaterial color="#ffffff" roughness={0.3} /></mesh>)}</>}
        {i === 2 && <><mesh position={[0, 0.0, 0]} castShadow><sphereGeometry args={[0.15, 28, 18, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#e8cf2a" roughness={0.6} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0, 0.002, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.15, 32]} /><meshStandardMaterial map={limonT()} roughness={0.4} /></mesh>
          <Gota p={[0.0, -0.05, 0.2]} k={on ? ((tt * 0.9) % 1) : 0} h={0.25} c="#fff6a0" /></>}
        {i === 3 && <><Tarja p={[0, 0.0, 0]} w={0.55} d={0.4} h={0.18} agua={on ? 0.6 - 0.4 * (((tt - rel(h, 3)) * 0.3) % 1) : 0.4} remolino={on ? 1 : 0} t={tt} ac={AZUL} />
          <Tubo pts={[[0, 0, 0], [0, -0.5, 0]]} r={0.04} o={0.35} /></>}
        {on && <pointLight position={[0, 0.8, 0.6]} intensity={2.5} distance={1.4} color="#fff0d0" />}
      </group>; })}
  </Estudio>;
}}</Stage>;

// 30 · LA PRUEBA DEL RELOJ: dos tarjas con agua azul; la de la izquierda se vacía con remolino en 10 segundos; la de la derecha tarda 30 — cada reloj barre su porción
const APrueba: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const a = 1 - eio(tt, 0.3, 1.4), b = 1 - 0.75 * eio(tt, 0.3, 3.4), ka = eio(tt, 0.3, 1.4) / 6, kb = eio(tt, 0.3, 3.4) / 2;
  return <>
    <Estudio t={tt} cam={[0.0, 1.25, 2.5]} look={[0, 0.42, 0]} orbit={0.04}>
      <Tarja p={[-0.62, 0, 0.1]} w={1.0} agua={0.55 * a} ac="#1677e0" remolino={a > 0.05 ? 1 : 0} t={tt} />
      <Tarja p={[0.62, 0, 0.1]} w={1.0} agua={0.55 * b} ac="#1677e0" remolino={0.4} t={tt * 0.3} />
      {[[-0.62, ka, "#5ad87a"], [0.62, kb, "#e8432e"]].map(([x, k, c], i) => <group key={i} position={[x as number, 0.92, -0.35]} scale={0.95}>
        <Reloj k={k as number} />
        <mesh position={[0, 0, 0.042]}><circleGeometry args={[0.24, 48, P2 - (k as number) * 2 * P, (k as number) * 2 * P + 0.0001]} /><meshBasicMaterial color={c as string} transparent opacity={0.55} toneMapped={false} /></mesh>
        <mesh position={[0, -0.02, 0.05]}><planeGeometry args={[0.34, 0.2]} /><meshBasicMaterial map={ctex("relN" + i, 256, 150, (g) => { g.clearRect(0, 0, 256, 150); g.fillStyle = "#111"; g.font = "900 130px Arial"; g.textAlign = "center"; g.fillText(i ? "30" : "10", 128, 125); })} transparent toneMapped={false} /></mesh>
      </group>)}
    </Estudio>
  </>;
}}</Stage>;

// 31 · EL CALENDARIO DE LA COCINA: un calendario de taco colgado de un clavo en los azulejos, con espiral; cada hoja se arranca girando sobre la espiral y deja ver la siguiente; abajo, sobre la mesada, el objeto de cada frecuencia
const ACalendario: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const N = h.items?.length ?? 5, cur = Array.from({ length: N }, (_, i) => i).filter((i) => tt >= rel(h, i)).pop() ?? 0;
  const azul = () => ctex("azulejo", 512, 512, (g) => { g.fillStyle = "#f4f6f7"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "#cfd6da"; g.lineWidth = 6; for (let i = 0; i <= 512; i += 128) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke(); } });
  const hoja = (i: number) => { const tx = String(h.items?.[i]?.tx ?? ""), w = tx.split(" "), l = w.length > 1 ? [w.slice(0, Math.ceil(w.length / 2)).join(" "), w.slice(Math.ceil(w.length / 2)).join(" ")] : [tx];
    return ctex("calH" + i + tx, 512, 560, (g) => { g.fillStyle = "#fffdf6"; g.fillRect(0, 0, 512, 560); g.fillStyle = "#c0392b"; g.fillRect(0, 0, 512, 110); g.fillStyle = "#1f3a5c"; g.font = "800 92px Arial"; g.textAlign = "center"; l.forEach((s, j) => g.fillText(s, 256, 270 + j * 110 - (l.length - 1) * 50)); }); };
  const obj = (i: number) => [<group key={0}><mesh position={[0, 0.16, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.36, 28]} /><meshStandardMaterial color="#fbfaf6" roughness={0.9} /></mesh><mesh position={[0.181, 0.16, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.045, 0.045, 0.01, 20]} /><meshStandardMaterial color="#b8956a" /></mesh></group>,
    <Tetera key={1} s={0.6} />, <Linterna key={2} p={[0, 0.08, 0]} rot={[-0.2, 0.5, 0]} on={1} />, <Sifon key={3} p={[-0.2, 0.05, 0]} s={0.55} />,
    <group key={4}><mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.24, 0.24, 0.05, 32]} />{M.hierro()}</mesh>{Array.from({ length: 5 }, (_, j) => <mesh key={j} position={[(j - 2) * 0.08, 0.06, 0]}><boxGeometry args={[0.02, 0.012, 0.4]} />{M.cromo("#5a5f66")}</mesh>)}</group>][i];
  return <Estudio t={tt} cam={[0.3, 0.85, 2.6]} look={[0.2, 0.62, 0]} orbit={0.06} mesa={false}>
    <mesh position={[0, 1.0, -0.32]} receiveShadow><planeGeometry args={[4.4, 2.6]} /><meshStandardMaterial map={azul()} roughness={0.3} /></mesh>
    <RBox p={[0.1, -0.02, 0.1]} s={[2.6, 0.08, 0.9]} r={0.02}><meshStandardMaterial color="#d9d3c6" roughness={0.5} /></RBox>
    <mesh position={[-0.35, 1.72, -0.29]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />{M.cromo()}</mesh>
    <group position={[-0.35, 1.0 + 0.6 * (1 - phys(tt, 0.0, 5, 0.5)), -0.27]}>
      <RBox p={[0, 0, 0]} s={[0.92, 1.05, 0.06]} r={0.01}><meshStandardMaterial color="#e9e4d8" /></RBox>
      {Array.from({ length: 9 }, (_, j) => <mesh key={j} position={[-0.36 + j * 0.09, 0.53, 0.035]} rotation={[0, P2, 0]}><torusGeometry args={[0.035, 0.007, 6, 16]} />{M.cromo()}</mesh>)}
      {Array.from({ length: N }, (_, i) => { const arr = i < N - 1 ? eio(tt, rel(h, i + 1) - 0.2, rel(h, i + 1) + 0.7) : 0; if (i < cur - 1 || arr >= 1) return null;
        return <group key={i} position={[0, 0.52 + 0.4 * arr, 0.035 + (N - i) * 0.002 + 0.3 * arr]} rotation={[-2.6 * arr, 0, 0.3 * arr]}>
          <mesh position={[0, -0.5, 0]} castShadow><planeGeometry args={[0.9, 0.98]} /><meshStandardMaterial map={hoja(i)} roughness={0.8} side={THREE.DoubleSide} transparent opacity={1 - cl((arr - 0.7) / 0.3)} /></mesh></group>; })}
    </group>
    {Array.from({ length: N }, (_, i) => { const e = IN(tt, rel(h, i) + 0.3), sal = i < N - 1 ? eio(tt, rel(h, i + 1), rel(h, i + 1) + 0.6) : 0; if (e < 0.001 || sal >= 1) return null;
      return <group key={"o" + i} position={[0.82 + 1.6 * sal, 0.02 + 0.8 * (1 - cl(e)), 0.25]} scale={1.6 * e}>{obj(i)}</group>; })}
  </Estudio>;
}}</Stage>;

// 32 · EL TAPÓN TE DICE CÓMO VIVE LA CASA: tres platitos en primer plano; cada uno cae con su tapón cuando se nombra — grasa blanca cremosa y brillante, gris con arena de café, y un mechón de pelos enredado — y la luz se va al que se nombra
const AErnesto: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const X = [-0.7, 0, 0.7], cur = [0, 1, 2].filter((i) => tt >= rel(h, i)).pop() ?? -1;
  const pelo = memo("pelos", () => Array.from({ length: 34 }, (_, j) => tuboGeo(Array.from({ length: 6 }, (_, q) => [(rn(j, q) - 0.5) * 0.3, 0.1 + q * 0.012 + 0.03 * Math.sin(q + j), (rn(j, q + 7) - 0.5) * 0.24] as V3), 0.0025, 30, 4)));
  return <Estudio t={tt} cam={[0.0, 0.42, 1.38]} look={[0, 0.08, 0]} orbit={0.05}>
    {X.map((x, i) => { const s = IN(tt, rel(h, i)), on = i === cur;
      return <group key={i} position={[x, 0.7 * (1 - cl(s)), 0]} scale={(on ? 1.3 : 1.1) * s + 0.001}>
        <mesh geometry={memo("platito", () => lathe([[0, 0], [0.22, 0], [0.3, 0.035], [0.31, 0.04]], 40))} receiveShadow castShadow><meshPhysicalMaterial color="#f6f3ec" roughness={0.15} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
        {i === 0 && <mesh position={[0, 0.07, 0]} scale={[0.16, 0.08, 0.13]} castShadow><sphereGeometry args={[1, 24, 16]} /><meshPhysicalMaterial color="#f4ecd4" roughness={0.25} clearcoat={1} /></mesh>}
        {i === 1 && <><mesh position={[0, 0.06, 0]} scale={[0.15, 0.07, 0.12]} castShadow><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#6f665a" roughness={0.9} /></mesh><Granos n={40} tipo="cafe" c="#22140c" area={[0.24, 0.18]} y={0.1} s={1.7} /></>}
        {i === 2 && <><mesh position={[0, 0.06, 0]} scale={[0.14, 0.06, 0.11]} castShadow><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#7a7062" roughness={0.9} /></mesh>{pelo.map((g, j) => <mesh key={j} geometry={g}><meshStandardMaterial color={j % 3 ? "#1b1410" : "#4a3020"} roughness={0.6} /></mesh>)}</>}
        {on && <pointLight position={[0, 0.6, 0.5]} intensity={3} distance={1.3} color="#fff0d8" />}
      </group>; })}
  </Estudio>;
}}</Stage>;

// 33 · LA NOTITA ARRIBA DE LA TARJA: una mano baja con el papelito y lo aprieta contra los azulejos; queda pegado con una cinta de colores y la esquina se levanta un poco; después entra el frasco deslizando y se para al lado
const ANota: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const baja = eio(tt, 0.1, 1.0), aprieta = eio(tt, 1.0, 1.3), va = eio(tt, 1.6, 2.4), cinta = eio(tt, 1.3, 1.7), fr = eio(tt, 2.3, 3.4);
  const azul = () => ctex("azulejo", 512, 512, (g) => { g.fillStyle = "#f4f6f7"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "#cfd6da"; g.lineWidth = 6; for (let i = 0; i <= 512; i += 128) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke(); } });
  const washi = () => ctex("washi", 128, 32, (g) => { g.fillStyle = "#f28aa0"; g.fillRect(0, 0, 128, 32); g.fillStyle = "#ffffff"; for (let x = 0; x < 128; x += 16) g.fillRect(x, 0, 6, 32); });
  const ny = lerp(1.9, 1.05, baja);
  return <Estudio t={tt} cam={[0.25, 0.85, 2.05]} look={[0.25, 0.72, 0]} orbit={0.06} mesa={false}>
    <mesh position={[0, 1.0, -0.3]} receiveShadow><planeGeometry args={[4.4, 2.4]} /><meshStandardMaterial map={azul()} roughness={0.3} /></mesh>
    <RBox p={[0.2, -0.02, 0.1]} s={[2.8, 0.08, 0.9]} r={0.02}><meshStandardMaterial color="#d9d3c6" roughness={0.5} /></RBox>
    <group position={[-0.2, ny, -0.28 + 0.04 * (1 - aprieta)]} rotation={[0, 0, -0.06]}>
      <mesh castShadow><planeGeometry args={[0.9, 0.55]} /><meshStandardMaterial map={papel("nota", ["la grasa", "al frasco"], { w: 512, h: 320, size: 100, bg: "#fff6a8" })} roughness={0.9} /></mesh>
      <mesh position={[0.38, -0.21, 0.04 + 0.03 * Math.sin(tt * 2)]} rotation={[0.7 + 0.1 * Math.sin(tt * 2), -0.5, P / 4]}><planeGeometry args={[0.15, 0.15]} /><meshStandardMaterial color="#efe39a" side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.27, 0.004]} rotation={[0, 0, 0.08]} scale={[cinta + 0.001, 1, 1]}><planeGeometry args={[0.34, 0.08]} /><meshStandardMaterial map={washi()} transparent opacity={0.85} /></mesh>
    </group>
    <Mano p={[-0.1 + 0.4 * va, ny + 0.05 + 1.2 * va, -0.12 + 0.2 * va]} rot={[1.4, 0, 0.3]} pinza={0.3} s={0.7} />
    <Frasco p={[lerp(1.9, 0.62, fr), 0.02, 0.2]} s={1.05} lleno={0.35} tapa={1} />
  </Estudio>;
}}</Stage>;

// 34 · EL REPASO EN RUEDA: los doce objetos del video sobre una plataforma giratoria de madera; gira de a un puesto y el nombrado queda adelante, grande y con su foco; los demás quedan chicos y en penumbra
const ARecap: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const N = 12, cur = Array.from({ length: N }, (_, i) => i).filter((i) => tt >= rel(h, i)).pop() ?? 0;
  const rot = Array.from({ length: N - 1 }, (_, i) => eio(tt, rel(h, i + 1) - 0.2, rel(h, i + 1) + 0.6)).reduce((x, y) => x + y, 0) + 0.04 * tt;
  const obj = (i: number) => [<Frasco key={i} lleno={0.6} s={0.8} />, <Rejilla key={i} p={[0, 0.03, 0]} lleno={0.5} s={0.9} />, <group key={i}><Canilla on={1} largo={0.3} /><Vapor t={tt} p={[0.3, 0.1, 0]} o={0.3} h={0.4} s={0.12} /></group>, <Taza key={i} lleno={1} c="#2a1a10" s={1.3} />,
    <group key={i}><RBox p={[0, 0.2, 0]} s={[0.28, 0.4, 0.14]} r={0.03}><meshStandardMaterial color="#f2f0ea" roughness={0.8} /></RBox><Granos n={20} area={[0.3, 0.2]} y={0.01} s={1.4} /></group>,
    <Sifon key={i} p={[-0.2, 0.05, 0]} s={0.7} />, <Sonda key={i} p={[0, 0.25, 0]} avance={0.2} s={0.9} />, <Lata key={i} p={[0, 0.07, 0]} s={0.9} />,
    <group key={i}><Botella c="#f6f7f8" s={0.6} />{[1, -1].map((k) => <mesh key={k} position={[0, 0.3, 0.12]} rotation={[0, 0, k * P / 4]}><boxGeometry args={[0.5, 0.05, 0.02]} /><meshBasicMaterial color="#e8432e" toneMapped={false} /></mesh>)}</group>,
    <Copa key={i} s={0.75} />, <Nido key={i} p={[0, 0.02, 0]} s={1.0} />, <Tetera key={i} s={0.6} />][i];
  return <Estudio t={tt} cam={[0.0, 1.0, 2.85]} look={[0, 0.3, 0.5]} orbit={0.04}>
    <mesh position={[0, -0.03, 0]} receiveShadow castShadow><cylinderGeometry args={[1.3, 1.3, 0.06, 64]} /><meshStandardMaterial color="#9a6c40" roughness={0.55} /></mesh>
    <mesh position={[0, 0.02, 1.62]} rotation={[-0.5, 0, 0]} scale={IN(tt, rel(h, cur)) + 0.001}><planeGeometry args={[0.36, 0.36]} /><meshBasicMaterial map={ctex("recN" + cur, 256, 256, (g) => { g.clearRect(0, 0, 256, 256); g.fillStyle = "#f2c230"; g.font = "900 200px Arial"; g.textAlign = "center"; g.fillText(String(cur + 1), 128, 200); })} transparent toneMapped={false} /></mesh>
    {Array.from({ length: N }, (_, i) => { const a = ((i - rot) / N) * P * 2, on = i === cur, e = IN(tt, 0.1 + i * 0.05);
      return <group key={i} position={[Math.sin(a) * 1.05, on ? 0.04 : 0, Math.cos(a) * 1.05]} scale={(on ? 1.5 : 0.75) * e + 0.001}>{obj(i)}</group>; })}
    <pointLight position={[0, 1.2, 1.6]} intensity={5} distance={1.8} color="#ffe6b8" />
  </Estudio>;
}}</Stage>;

// 35 · TRES VINAGRES: el blanco de cocina (transparente, tapa blanca), el de limpieza (azul, con los guantes apoyados) y el de manzana (ámbar, con su manzana al pie) suben de a uno con resorte y su halo; el cloro queda atrás, lejos, con una cruz de cinta roja
const AVinagres: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const X = [-0.85, 0, 0.85], c = ["#eef4f6", "#3f86d0", "#d89a3a"], s = (i: number) => IN(tt, rel(h, i)), cur = [0, 1, 2].filter((i) => tt >= rel(h, i)).pop() ?? -1;
  return <Estudio t={tt} cam={[0.0, 0.95, 2.45]} look={[0, 0.45, 0]} orbit={0.08}>
    <group position={[0.35, 0, -3.0]} scale={1.25}><Botella c="#f2d43a" />{[1, -1].map((k) => <mesh key={k} position={[0, 0.4, 0.2]} rotation={[0, 0, k * P / 4]}><boxGeometry args={[0.85, 0.09, 0.01]} /><meshStandardMaterial color="#e8432e" /></mesh>)}</group>
    {X.map((x, i) => <group key={i} position={[x, 0.9 * (1 - cl(s(i))), 0]} scale={1.15 * s(i) + 0.001}>
      <Botella vidrio={i !== 1} c={c[i]} />
      <mesh position={[0, 0.84, 0]}><cylinderGeometry args={[0.065, 0.065, 0.09, 16]} /><meshStandardMaterial color={["#ffffff", "#f2c230", "#7a3a10"][i]} /></mesh>
      {i === 1 && <Guante p={[0.3, 0.05, 0.12]} rot={[-P2 + 0.1, 0, 0.6]} s={0.65} />}
      {i === 2 && <group position={[0.3, 0.1, 0.12]}><mesh castShadow><sphereGeometry args={[0.1, 24, 18]} /><meshPhysicalMaterial color="#c8261e" roughness={0.3} clearcoat={0.8} /></mesh><mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.006, 0.006, 0.06, 6]} />{M.madera("#5a3a1a")}</mesh></group>}
      {i === cur && <pointLight position={[0, 0.9, 0.6]} intensity={3} distance={1.6} color={i === 2 ? "#ffc070" : "#bff0d0"} />}
    </group>)}
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  a_cuaja: ACuaja, a_frasco: AFrasco, a_pelicula: APelicula, a_rejilla: ARejilla, a_punado: APunado, a_termo: ATermo, a_minuto: AMinuto, a_cafe: ACafe,
  a_hincha: AHincha, a_sifonx: ASifonX, a_desarme: ADesarme, a_pinza: APinza, a_sonda: ASonda, a_gafas: AGafas, a_atun: AAtun, a_cucharadas: ACucharadas,
  a_sosa: ASosa, a_cloro: ACloro, a_copa: ACopa, a_trapo: ATrapo, a_gorgoteo: AGorgoteo, a_nido: ANido, a_errores: AErrores, a_domingo: ADomingo,
  a_vinagre: AVinagre, a_cuenta: ACuenta, a_kit: AKit, a_caso: ACaso, a_mitos: AMitos, a_prueba: APrueba, a_calendario: ACalendario, a_ernesto: AErnesto,
  a_nota: ANota, a_recap: ARecap, a_vinagres: AVinagres,
};
