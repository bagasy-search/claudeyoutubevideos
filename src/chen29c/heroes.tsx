// chen29c · «Lo que Compra un Jubilado de Rancho con $100 en el Tianguis»: componentes 3D únicos (1 por minuto, ninguno
// repetido en la tanda chen29). Cada uno = un objeto que se entiende sin leer, sobre la foto del momento desenfocada (Stage),
// con física de resorte y cámara curva (Estudio). Palabras sólo DENTRO de la escena (papel, etiqueta), ≤5. Render SÓLO en el farm.
// v2 (29-oct): rehechos según la vuelta 1 del evaluador (objetos grandes y reconocibles, sombras de contacto, contadores de rodillos).
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, phys, Stage } from "./ckit";
import { ctex, Estudio, fall, Frijol, lathe, M, papel, RBox, rn, V3, Vapor, Yute } from "./estudio3d";
import { Chorro, Mano, Olla, Plato } from "./kit3d";
import { Billete, Moneda, Pila, Sobre } from "./kit29";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;
const sz = (k: number) => Math.max(0.001, k);
const dur = (h: H) => Math.max(3, h.out - h.at);
const Etq: React.FC<{ p: V3; rot?: V3; txt: string[]; w?: number; h?: number; bg?: string; ink?: string; size?: number; s?: number }> = ({ p, rot = [-0.5, 0, 0], txt, w = 0.7, h = 0.3, bg = "#f1ead6", ink = "#2a1c12", size, s = 1 }) =>
  <mesh position={p} rotation={rot} scale={Math.max(0.001, s)} castShadow><planeGeometry args={[w, h]} /><meshStandardMaterial map={papel("e" + txt.join("|") + bg + ink, txt, { w: 512, h: Math.round(512 * h / w), bg, ink, size: size ?? Math.min(110, Math.round(512 * h / w / (txt.length + 0.4))) })} roughness={0.9} side={THREE.DoubleSide} /></mesh>;
const esfGeo = new THREE.SphereGeometry(1, 28, 18);
const hojaGeo = new THREE.SphereGeometry(1, 12, 8);
const tortGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.012, 40);
const Tortilla: React.FC<{ p: V3; rot?: V3; c?: string; s?: number }> = ({ p, rot, c = "#e8cf8c", s = 1 }) => <mesh position={p} rotation={rot} scale={s} geometry={tortGeo} castShadow receiveShadow><meshStandardMaterial color={c} roughness={0.85} /></mesh>;
const Jito: React.FC<{ p: V3; s?: number; c?: string; mate?: number }> = ({ p, s = 0.07, c = "#c8321e", mate = 0 }) => <group position={p}>
  <mesh scale={[s, s * 0.86, s]} geometry={esfGeo} castShadow><meshPhysicalMaterial color={c} roughness={0.2 + 0.7 * mate} clearcoat={0.9 * (1 - mate)} /></mesh>
  <mesh position={[0, s * 0.85, 0]} rotation={[-P2, 0, 0]} scale={s * 0.5}><circleGeometry args={[1, 5]} /><meshStandardMaterial color="#3f6a2a" side={THREE.DoubleSide} /></mesh></group>;
const Verdolaga: React.FC<{ p: V3; s?: number; rot?: V3; n?: number }> = ({ p, s = 1, rot, n = 9 }) => <group position={p} rotation={rot} scale={s}>
  {Array.from({ length: n }, (_, i) => <group key={i} rotation={[0, i * 0.7, 0.18 + rn(i, 3) * 0.25]}>
    <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.008, 0.01, 0.36, 6]} /><meshStandardMaterial color="#9a4a3a" /></mesh>
    {[0, 1, 2, 3].map((j) => <mesh key={j} position={[0.025 * (j % 2 ? 1 : -1), 0.2 + j * 0.05, 0]} scale={[0.032, 0.012, 0.024]} geometry={hojaGeo}><meshPhysicalMaterial color="#4f8a3a" clearcoat={0.6} roughness={0.3} /></mesh>)}</group>)}</group>;
// plátano de verdad: tubo de 5 caras (las aristas de la cáscara) que se afina en las puntas, con su rabito
const platCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.3, 0.12, 0), new THREE.Vector3(-0.15, 0.02, 0), new THREE.Vector3(0.05, 0.0, 0), new THREE.Vector3(0.22, 0.05, 0), new THREE.Vector3(0.32, 0.16, 0)]);
const platGeo = (() => { const N = 48, g = new THREE.TubeGeometry(platCurve, N, 1, 5, false), pa = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i <= N; i++) { const c = platCurve.getPointAt(i / N), r = 0.062 * Math.pow(Math.sin(P * (0.03 + 0.94 * i / N)), 0.6);
    for (let j = 0; j <= 5; j++) { const k = i * 6 + j; v.set(pa.getX(k), pa.getY(k), pa.getZ(k)).sub(c).normalize().multiplyScalar(r).add(c); pa.setXYZ(k, v.x, v.y, v.z); } }
  g.computeVertexNormals(); return g; })();
const Platano: React.FC<{ p: V3; rot?: V3; manchas?: number; c?: string; s?: number }> = ({ p, rot, manchas = 0, c = "#e8c83a", s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh geometry={platGeo} castShadow><meshStandardMaterial color={c} roughness={0.45} flatShading /></mesh>
  <mesh position={[0.34, 0.2, 0]} rotation={[0, 0, -0.7]}><cylinderGeometry args={[0.012, 0.016, 0.08, 6]} /><meshStandardMaterial color="#5a6a2a" /></mesh>
  <mesh position={[-0.305, 0.125, 0]} scale={0.014} geometry={esfGeo}><meshStandardMaterial color="#2a1a10" /></mesh>
  {Array.from({ length: 22 }, (_, i) => { const k = i / 22, pt = platCurve.getPointAt(0.12 + 0.76 * k), a = rn(i, 7) * 2.4 - 1.2; return <mesh key={i} position={[pt.x, pt.y + Math.cos(a) * 0.058, pt.z + Math.sin(a) * 0.058]} scale={[0.001 + 0.011 * phys(manchas * 22 - i, 0, 7, 0.4), 0.004, 0.001 + 0.009 * phys(manchas * 22 - i, 0, 7, 0.4)]} rotation={[a, 0, 0]} geometry={esfGeo}><meshStandardMaterial color="#2a1a10" roughness={0.6} /></mesh>; })}</group>;
// sombra de contacto (disco radial suave)
const sombraTex = () => ctex("sombraR", 128, 128, (g) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, "rgba(0,0,0,.6)"); r.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });
const Sombra: React.FC<{ p: V3; r: number; o?: number }> = ({ p, r, o = 1 }) => <mesh position={[p[0], 0.004, p[2]]} rotation={[-P2, 0, 0]}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={sombraTex()} transparent opacity={o} depthWrite={false} /></mesh>;
// piso de piedra/tierra que se funde con la foto (sin borde)
const fadeTex = () => ctex("fadeR", 256, 256, (g) => { const r = g.createRadialGradient(128, 128, 30, 128, 128, 128); r.addColorStop(0, "#fff"); r.addColorStop(1, "#000"); g.fillStyle = r; g.fillRect(0, 0, 256, 256); });
const Empedrado: React.FC<{ n?: number; w?: number; d?: number; c?: string[] }> = ({ n = 110, w = 4.4, d = 2.6, c = ["#6a5e52", "#7a6c5e", "#5a4e44", "#857565"] }) => <>
  {Array.from({ length: n }, (_, i) => { const x = (rn(i, 1) - 0.5) * w, z = (rn(i, 2) - 0.5) * d, fade = 1 - cl((Math.hypot(x / (w / 2), z / (d / 2)) - 0.65) / 0.35);
    return fade > 0.02 ? <mesh key={i} position={[x, 0.0, z]} rotation={[rn(i, 3) * 0.3, rn(i, 4) * 6, rn(i, 5) * 0.3]} scale={[0.11 * fade + 0.03, 0.035, 0.09 * fade + 0.03]} receiveShadow castShadow><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={c[i % c.length]} roughness={0.92} /></mesh> : null; })}
  <mesh rotation={[-P2, 0, 0]} position={[0, -0.01, 0]} receiveShadow><planeGeometry args={[w * 1.1, d * 1.1]} /><meshStandardMaterial color="#5a4a3c" alphaMap={fadeTex()} transparent depthWrite={false} roughness={1} /></mesh></>;
const cazGeo = lathe([[0, 0], [0.16, 0], [0.24, 0.1], [0.26, 0.14], [0.235, 0.135], [0.2, 0.09], [0.13, 0.02], [0, 0.02]], 32);
const Cazuela: React.FC<{ p: V3; s?: number; children?: React.ReactNode }> = ({ p, s = 1, children }) => <group position={p} scale={s}>
  <mesh geometry={cazGeo} castShadow receiveShadow><meshStandardMaterial color="#9a4f2c" roughness={0.6} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.022, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.14, 24]} /><meshStandardMaterial color="#4a2414" roughness={0.8} /></mesh>
  {[-1, 1].map((k) => <mesh key={k} position={[k * 0.27, 0.11, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.03, 0.012, 6, 12, P]} /><meshStandardMaterial color="#8a4424" roughness={0.6} /></mesh>)}{children}</group>;
// monedero de manta bordado, abierto
const monGeo = lathe([[0, 0], [0.22, 0.01], [0.32, 0.12], [0.31, 0.26], [0.24, 0.36], [0.26, 0.4]], 40);
const mantaTex = () => ctex("manta", 256, 256, (g) => { g.fillStyle = "#efe7d4"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(120,100,70,.18)"; for (let i = 0; i < 256; i += 4) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); } });
const Monedero: React.FC<{ p: V3; s?: number; c?: string }> = ({ p, s = 1, c }) => <group position={p} scale={s}>
  <mesh geometry={monGeo} castShadow receiveShadow><meshStandardMaterial map={mantaTex()} color={c ?? "#ffffff"} roughness={0.95} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.03, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.22, 28]} /><meshStandardMaterial color="#5a4a36" roughness={1} /></mesh>
  {Array.from({ length: 8 }, (_, i) => { const a = i / 8 * P * 2; return <group key={i} position={[Math.cos(a) * 0.318, 0.2, Math.sin(a) * 0.318]}>
    {Array.from({ length: 5 }, (_, j) => <mesh key={j} position={[Math.cos(j * 1.26) * 0.022 * Math.sin(a + P2), Math.sin(j * 1.26) * 0.022, Math.cos(j * 1.26) * 0.022 * -Math.cos(a + P2)]} scale={0.013} geometry={esfGeo}><meshStandardMaterial color={["#c0392b", "#2e86c1", "#d4ac0d", "#28b463"][i % 4]} roughness={0.7} /></mesh>)}</group>; })}
  <mesh position={[0, 0.4, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.26, 0.012, 6, 36]} /><meshStandardMaterial color="#b8322a" roughness={0.7} /></mesh></group>;
// bolsa de plástico arrugada y translúcida, con asas
const bolsaGeo = (() => { const g = new THREE.IcosahedronGeometry(1, 4), pa = g.attributes.position;
  for (let i = 0; i < pa.count; i++) { let x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i); const n = 1 + 0.07 * Math.sin(x * 9 + 1) * Math.sin(y * 11) * Math.sin(z * 7 + 2) + 0.035 * Math.sin(x * 23 + y * 19);
    const tap = y > 0.3 ? 1 - (y - 0.3) * 0.55 : 1; pa.setXYZ(i, x * n * tap, y * n, z * n * tap); }
  g.computeVertexNormals(); return g; })();
const Bolsa: React.FC<{ p: V3; s?: number; o?: number; c?: string; asas?: boolean }> = ({ p, s = 1, o = 0.45, c = "#f4f4f0", asas = true }) => <group position={p} scale={s}>
  <mesh scale={[0.3, 0.38, 0.22]} geometry={bolsaGeo} castShadow><meshPhysicalMaterial color={c} transparent opacity={o} roughness={0.25} clearcoat={0.6} side={THREE.DoubleSide} depthWrite={false} /></mesh>
  {asas && [-1, 1].map((k) => <mesh key={k} position={[k * 0.1, 0.42, 0]}><torusGeometry args={[0.08, 0.012, 6, 18]} /><meshPhysicalMaterial color={c} transparent opacity={Math.min(1, o + 0.25)} roughness={0.3} /></mesh>)}</group>;
const cuadrosTex = (c: string) => ctex("cuad" + c, 256, 256, (g) => { g.fillStyle = "#f4efe4"; g.fillRect(0, 0, 256, 256); g.fillStyle = c; g.globalAlpha = 0.55; for (let i = 0; i < 8; i++) { g.fillRect(i * 32, 0, 16, 256); g.fillRect(0, i * 32, 256, 16); } });
// contador de rodillos (paletas que voltean)
const digTex = (d: number) => ctex("dig" + d, 128, 180, (g) => { g.fillStyle = "#1c1814"; g.fillRect(0, 0, 128, 180); g.fillStyle = "#f4ead2"; g.font = "900 140px Montserrat, Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(d), 64, 96);
  g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(0, 88, 128, 4); });
const Paleta: React.FC<{ p: V3; v: number }> = ({ p, v }) => { const d = ((Math.floor(v) % 10) + 10) % 10, f = v - Math.floor(v), W = 0.2, Hh = 0.28;
  return <group position={p}>
    <RBox p={[0, 0, -0.03]} s={[W + 0.04, Hh + 0.04, 0.04]} r={0.01}>{M.hierro()}</RBox>
    <mesh><planeGeometry args={[W, Hh]} /><meshStandardMaterial map={digTex((d + 1) % 10)} roughness={0.5} /></mesh>
    <group position={[0, 0, 0.004]}><group rotation={[f * P, 0, 0]}><mesh><planeGeometry args={[W, Hh]} /><meshStandardMaterial map={digTex(d)} roughness={0.5} /></mesh></group></group>
  </group>; };
const Contador: React.FC<{ p: V3; v: number; n?: number; s?: number; rot?: V3; marco?: string }> = ({ p, v, n = 3, s = 1, rot, marco = "#5a3a22" }) => <group position={p} rotation={rot} scale={s}>
  <RBox p={[0, 0, -0.07]} s={[n * 0.25 + 0.08, 0.4, 0.1]} r={0.03}><meshStandardMaterial color={marco} roughness={0.6} /></RBox>
  {Array.from({ length: n }, (_, i) => { const k = n - 1 - i, b = Math.pow(10, k), lo = v % b, f = k === 0 ? v % 1 : (lo > b - 1 ? lo - (b - 1) : 0);
    return <Paleta key={i} p={[(i - (n - 1) / 2) * 0.25, 0, 0]} v={Math.floor(v / b) + f} />; })}</group>;
const Brillo: React.FC<{ p: V3; k: number; r?: number; c?: string }> = ({ p, k, r = 0.4, c = "#fff0c0" }) => <mesh position={p} scale={0.001 + r * k}><sphereGeometry args={[1, 20, 14]} /><meshBasicMaterial color={c} transparent opacity={0.35 * Math.sin(cl(k) * P)} depthWrite={false} toneMapped={false} /></mesh>;

// v6: plátano redondo y liso (10 lados, sección casi pentagonal), estrella de azúcar, bolsa de manta con cordón, empedrado continuo
const platGeo2 = (() => { const N = 60, R = 10, g = new THREE.TubeGeometry(platCurve, N, 1, R, false), pa = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i <= N; i++) { const c = platCurve.getPointAt(i / N), r0 = 0.07 * Math.pow(Math.sin(P * (0.03 + 0.94 * i / N)), 0.55);
    for (let j = 0; j <= R; j++) { const k = i * (R + 1) + j, r = r0 * (1 + 0.06 * Math.cos(j / R * P * 2 * 5)); v.set(pa.getX(k), pa.getY(k), pa.getZ(k)).sub(c).normalize().multiplyScalar(r).add(c); pa.setXYZ(k, v.x, v.y, v.z); } }
  g.computeVertexNormals(); return g; })();
const estrellaTex = () => ctex("estrellaC", 128, 128, (g) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, "rgba(255,240,180,1)"); r.addColorStop(0.25, "rgba(255,210,90,.6)"); r.addColorStop(1, "rgba(255,200,80,0)"); g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  g.fillStyle = "rgba(255,248,220,1)"; g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? 10 : 62; g.lineTo(64 + Math.cos(a) * rr, 64 + Math.sin(a) * rr); } g.closePath(); g.fill(); });
const bolsaMGeo = lathe([[0, 0], [0.2, 0.01], [0.29, 0.08], [0.31, 0.2], [0.25, 0.3], [0.16, 0.355], [0.15, 0.37], [0.2, 0.43], [0.22, 0.45]], 40);
const BolsaManta: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => <group position={p} scale={s}>
  <mesh geometry={bolsaMGeo} castShadow receiveShadow><meshStandardMaterial map={mantaTex()} color="#f2e6cc" roughness={0.95} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.36, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.158, 0.012, 8, 36]} /><meshStandardMaterial color="#b8322a" roughness={0.7} /></mesh>
  {[-1, 1].map((k) => <mesh key={k} position={[0.17, 0.33 - 0.05 * (k + 1), 0.04 * k]} rotation={[0, 0, 0.3 * k]}><cylinderGeometry args={[0.008, 0.008, 0.12, 6]} /><meshStandardMaterial color="#b8322a" roughness={0.7} /></mesh>)}
  {Array.from({ length: 10 }, (_, i) => { const a = i / 10 * P * 2; return <mesh key={i} position={[Math.cos(a) * 0.3, 0.17, Math.sin(a) * 0.3]} scale={0.016} geometry={esfGeo}><meshStandardMaterial color={["#c0392b", "#2e86c1", "#d4ac0d", "#28b463"][i % 4]} roughness={0.7} /></mesh>; })}
  <mesh position={[0, 0.06, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.26, 28]} /><meshStandardMaterial color="#4a3a2a" roughness={1} /></mesh></group>;
const piedraGeo = (() => { const g = new THREE.SphereGeometry(1, 10, 6); g.scale(1, 0.32, 1); return g; })();
const EmpedradoC: React.FC = () => <>{Array.from({ length: 24 * 15 }, (_, i) => { const cx = i % 24, cz = Math.floor(i / 24), x = -2.6 + cx * 0.225 + (cz % 2) * 0.11 + (rn(i, 1) - 0.5) * 0.04, z = -1.9 + cz * 0.2 + (rn(i, 2) - 0.5) * 0.04;
  return <mesh key={i} geometry={piedraGeo} position={[x, 0.0, z]} rotation={[0, rn(i, 3) * 6, 0]} scale={[0.1 + 0.015 * rn(i, 4), 0.07, 0.085 + 0.012 * rn(i, 5)]} receiveShadow><meshStandardMaterial color={["#7a6c5e", "#6a5e52", "#857565", "#5f5348"][i % 4]} roughness={0.92} /></mesh>; })}
  <mesh rotation={[-P2, 0, 0]} position={[0, -0.005, 0]} receiveShadow><planeGeometry args={[6, 4]} /><meshStandardMaterial color="#3e352c" roughness={1} /></mesh></>;
const horaTex = (n: string) => ctex("hora" + n, 128, 128, (g) => { g.fillStyle = "#cfc3ae"; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); g.strokeStyle = "#5a4a3a"; g.lineWidth = 5; g.stroke(); g.fillStyle = "#3a2a1c"; g.font = "900 70px Montserrat, Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(n, 64, 68); });
// ── 1 · LA CUENTA (0:09): el sobre del mandado se abre en bisagra; sale UN billete de $100 y caen 12 cazuelas vacías alrededor
const H1Cuenta: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const D = dur(h), sol = phys(tt, 0.25, 3.2, 0.55), sale = eio(tt, 0.9, 1.9), para = phys(tt, 1.7, 5, 0.5);
  return <Estudio t={tt} cam={[0, 1.55, 2.85]} look={[0, 0.25, -0.25]} orbit={0.06}>
    <Sobre p={[0, 0.02, 0.4]} txt="mandado" solapa={cl(sol)} s={1.05} />
    <Sombra p={[0, 0, 0.4]} r={0.55} o={0.6} />
    <group position={[0, 0.04 + 0.32 * cl(para), 0.4 + lerp(0, 0.18, sale)]} rotation={[-P2 + 1.15 * cl(para), 0, 0]}><Billete v="100" s={0.95 * (0.5 + 0.5 * sale)} /></group>
    {Array.from({ length: 12 }, (_, i) => { const fila = Math.floor(i / 6), x = -1.25 + (i % 6) * 0.5 + fila * 0.25, z = fila ? -0.35 : -0.85, at = 1.2 + i * Math.min(0.22, (D - 2.2) / 12);
      return <group key={i}><Cazuela p={[x, fall(tt, at, 1.0), z]} s={tt < at ? 0.001 : 0.72} /><Sombra p={[x, 0, z]} r={0.24} o={tt < at ? 0 : 0.75} /></group>; })}
  </Estudio>;
}}</Stage>;

// ── 2 · 100 SE VUELVEN 200 (0:39): el billete de $100 sobre el cajón; el sol cruza su arco y del billete sale su gemelo; el contador pasa de 100 a 200
const H2Doscientos: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const D = dur(h), sol = eio(tt, 0.05, D - 0.4), t0 = 0.42 * D, gem = phys(tt, t0, 4.5, 0.55), sa = lerp(-1, 1, sol);
  const sp: V3 = [sa * 1.15, 1.32 + 0.22 * Math.cos(sa * P2), -1.4], sc = new THREE.Color("#fff2b0").lerp(new THREE.Color("#ff9a50"), Math.abs(sa));
  const tab = <meshStandardMaterial color="#b08a58" roughness={0.8} />;
  return <Estudio t={tt} cam={[0, 1.0, 2.7]} look={[0, 0.62, 0]} orbit={0.06}>
    <mesh position={sp}><sphereGeometry args={[0.13, 24, 16]} /><meshBasicMaterial color={sc} toneMapped={false} /></mesh>
    <mesh position={sp}><sphereGeometry args={[0.24, 24, 16]} /><meshBasicMaterial color={sc} transparent opacity={0.22} depthWrite={false} toneMapped={false} /></mesh>
    <directionalLight position={[sp[0] * 2, 3, 0.5]} intensity={1.2} color={sc} />
    <group position={[0, 0, -0.15]}>
      <RBox p={[0, 0.03, 0]} s={[1.3, 0.04, 0.7]} r={0.008}>{tab}</RBox>
      {[0.1, 0.27].map((y, j) => <group key={j}>
        <RBox p={[0, y, 0.33]} s={[1.3, 0.11, 0.025]} r={0.006}>{tab}</RBox><RBox p={[0, y, -0.33]} s={[1.3, 0.11, 0.025]} r={0.006}>{tab}</RBox>
        <RBox p={[-0.64, y, 0]} s={[0.025, 0.11, 0.7]} r={0.006}>{tab}</RBox><RBox p={[0.64, y, 0]} s={[0.025, 0.11, 0.7]} r={0.006}>{tab}</RBox></group>)}
      {Array.from({ length: 22 }, (_, i) => <Jito key={i} p={[-0.52 + (i % 6) * 0.105 + (Math.floor(i / 6) % 2) * 0.05, 0.36 + Math.floor(i / 6) * 0.045, -0.24 + Math.floor(i / 6) * 0.13 + rn(i, 3) * 0.03]} s={0.065} />)}
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0.2 + (i % 3) * 0.14, 0.38 + Math.floor(i / 3) * 0.05, -0.15 + Math.floor(i / 3) * 0.2]} rotation={[0, 0.4 + i, P2]} castShadow><capsuleGeometry args={[0.04, 0.16, 6, 12]} /><meshPhysicalMaterial color="#3f6a24" clearcoat={0.5} roughness={0.4} /></mesh>)}
    </group>
    <group position={[lerp(0, 0.36, cl(gem)), 0.21, 0.32 - 0.03 * (1 - cl(gem))]} rotation={[-0.12, 0, 0]}><Billete v="100" s={1.05} /></group>
    <group position={[lerp(0, -0.36, cl(gem)), 0.21, 0.34]} rotation={[-0.12, 0, 0]}><Billete v="100" s={1.05} /></group>
    <Brillo p={[0, 0.25, 0.4]} k={eio(tt, t0, t0 + 0.6)} r={0.55} />
    <Sombra p={[0, 0, 0.36]} r={0.75} o={0.5} />
    <Contador p={[0, 1.12, -0.35]} v={100 + 100 * eio(tt, t0, t0 + 0.5)} s={0.95} />
  </Estudio>;
}}</Stage>;

// ── 3 · CAMBIO EL BILLETE (2:40): el billete de $100 cae y revienta en 20 monedas que rebotan y se juntan dentro del monedero de manta
const H3Cambio: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const R = 0.65, n = 18, bx = 0.3, bz = 0.2, cae = cl(tt / R), k1 = tt - R;
  const MX = -0.42, MZ = -0.08, tj = (i: number) => 1.25 + i * 0.09;
  return <Estudio t={tt} cam={[0.05, 1.05, 1.45]} look={[-0.05, 0.18, 0]} orbit={0.06}>
    <BolsaManta p={[MX, 0, MZ]} s={1.05} />
    <Sombra p={[MX, 0, MZ]} r={0.42} />
    {Array.from({ length: n }, (_, i) => { if (tt < tj(i) + 0.42) return null; const a = rn(i, 6) * 6.28, r = Math.sqrt(rn(i, 7)) * 0.12, lay = Math.floor(i / 6);
      return <Moneda key={"in" + i} p={[MX + Math.cos(a) * r, 0.36 + lay * 0.02 + rn(i, 8) * 0.01, MZ + Math.sin(a) * r]} rot={[rn(i, 9) * 0.5, rn(i, 10) * 6, rn(i, 11) * 0.5]} s={1.5} oro={i % 5 !== 0} />; })}
    {tt < R + 0.04 && <group position={[bx, lerp(1.0, 0.025, cae * cae), bz]} rotation={[-P2 + 0.5 * (1 - cae), tt * 1.8, Math.sin(tt * 7) * 0.35 * (1 - cae)]}><Billete v="100" s={1.3} /></group>}
    {tt < R && <Sombra p={[bx, 0, bz]} r={0.25 + 0.15 * cae} o={0.3 + 0.6 * cae} />}
    <Brillo p={[bx, 0.06, bz]} k={k1 > 0 ? Math.sin(cl(k1 / 0.35) * P) : 0} r={0.42} />
    <pointLight position={[bx, 0.35, bz + 0.2]} intensity={0.01 + (k1 > 0 ? 4 * Math.sin(cl(k1 / 0.35) * P) : 0)} distance={1.6} color="#ffe2a0" />
    {k1 > 0 && Array.from({ length: n }, (_, i) => {
      const a = i * 2.4 + 0.3, rr = 0.14 + 0.22 * rn(i, 1), out = Math.min(1, k1 / 0.35);
      const gx = bx + Math.cos(a) * rr * out, gz = bz + Math.sin(a) * rr * 0.7 * out, gy = 0.018 + Math.abs(Math.sin(k1 * 8 + i)) * 0.3 * Math.exp(-k1 * 3.5);
      const k2 = cl((tt - tj(i)) / 0.42); if (k2 >= 1) return null;
      const x = lerp(gx, MX + (rn(i, 3) - 0.5) * 0.1, k2), z = lerp(gz, MZ + (rn(i, 4) - 0.5) * 0.08, k2), y = lerp(gy, 0.42, k2) + Math.sin(k2 * P) * 0.32;
      return <group key={i}><Moneda p={[x, y, z]} rot={[k1 * 7 + i, i, k2 * 9]} s={1.6} oro={i % 5 !== 0} />{k2 === 0 && <Sombra p={[x, 0, z]} r={0.07} o={0.7} />}</group>; })}
  </Estudio>;
}}</Stage>;

// ── 4 · LA LISTA EN LA CABEZA (3:05): la alacena de cerca; arriba llega lo que ya hay, de a uno; abajo lo que falta brilla como fantasma
const H4Lista: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const hay = (i: number) => 1.08 + fall(tt, 0.15 + i * 0.22, 0.55), vis = (i: number) => tt > 0.15 + i * 0.22 ? 1 : 0.001;
  const falta = (i: number) => Math.max(0.001, phys(tt, 1.3 + i * 0.22, 6, 0.5)), pulso = 0.65 + 0.35 * Math.sin(tt * 2 * P * 0.8);
  const puer = eio(tt, 0, 0.7), z = lerp(3.3, 2.45, eio(tt, 0, 1.4));
  const ghost = <meshBasicMaterial color="#7fe8ff" wireframe transparent opacity={0.9 * pulso} toneMapped={false} />;
  const halo = <meshBasicMaterial color="#7fe8ff" transparent opacity={0.16 * pulso} depthWrite={false} toneMapped={false} />;
  const mad = M.madera("#6e4628");
  return <Estudio t={tt} cam={[0, 0.82, z]} look={[0, 0.76, 0]} orbit={0.05}>
    <RBox p={[0, 0.78, -0.3]} s={[2.1, 1.56, 0.04]} r={0.01}><meshStandardMaterial color="#e2d2b2" roughness={0.95} /></RBox>
    {[-1.07, 1.07].map((x) => <RBox key={x} p={[x, 0.78, 0]} s={[0.06, 1.6, 0.64]} r={0.01}>{mad}</RBox>)}
    {[0.02, 0.45, 1.05, 1.56].map((y, j) => <RBox key={j} p={[0, y, 0]} s={[2.2, 0.05, 0.64]} r={0.01}>{mad}</RBox>)}
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 1.1, 0.78, 0.32]} rotation={[0, sd * (0.1 + 1.45 * puer), 0]}>
      <RBox p={[-sd * 0.53, 0, 0]} s={[1.06, 1.56, 0.04]} r={0.01}>{M.madera("#7a5232")}</RBox>
      <mesh position={[-sd * 0.95, 0, 0.04]}><sphereGeometry args={[0.03, 12, 10]} />{M.cromo("#c9a24a")}</mesh></group>)}
    <group position={[-0.75, hay(0), 0]} scale={vis(0)}><mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.2, 0.2, 0.05, 24]} /><meshStandardMaterial color="#9a7a5a" /></mesh>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[(i % 3 - 1) * 0.1, 0.1 + Math.floor(i / 3) * 0.07, ((i * 7) % 3 - 1) * 0.06]} scale={[0.045, 0.06, 0.045]} geometry={esfGeo} castShadow><meshStandardMaterial color="#e6c9a0" roughness={0.5} /></mesh>)}</group>
    <group position={[-0.25, hay(1), 0]} scale={vis(1)}>{Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[(i % 3 - 1) * 0.09, 0.045 + Math.floor(i / 3) * 0.07, (i % 2) * 0.05]} scale={[0.045, 0.04, 0.04]} geometry={esfGeo} castShadow><meshPhysicalMaterial color="#6aa03a" clearcoat={0.6} roughness={0.35} /></mesh>)}</group>
    <group position={[0.25, hay(2), 0]} scale={vis(2)}><mesh position={[0, 0.15, 0]} castShadow><cylinderGeometry args={[0.15, 0.17, 0.3, 20]} /><Yute /></mesh>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.2, 0.31, (rn(i, 2) - 0.5) * 0.2]} scale={0.022} geometry={esfGeo}><meshStandardMaterial color="#f2c84a" /></mesh>)}</group>
    <group position={[0.72, hay(3), 0]} scale={vis(3)}><mesh position={[0, 0.13, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, 0.26, 20]} />{M.vidrio()}</mesh><mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.072, 0.072, 0.2, 20]} /><meshStandardMaterial color="#c86a2a" /></mesh><mesh position={[0, 0.275, 0]}><cylinderGeometry args={[0.085, 0.085, 0.03, 20]} />{M.cromo("#c9a24a")}</mesh></group>
    <group position={[-0.72, 0.48, 0.05]} scale={1.45 * falta(0)}>{[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.02 + i * 0.025, 0]}><cylinderGeometry args={[0.2, 0.2, 0.012, 24]} />{ghost}</mesh>)}<mesh position={[0, 0.05, 0]} scale={[0.26, 0.12, 0.26]} geometry={esfGeo}>{halo}</mesh></group>
    <group position={[-0.2, 0.48, 0.05]} scale={1.45 * falta(1)}><mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.13, 0.15, 0.28, 12]} />{ghost}</mesh><mesh position={[0, 0.14, 0]} scale={0.2} geometry={esfGeo}>{halo}</mesh></group>
    <group position={[0.3, 0.48, 0.05]} scale={1.45 * falta(2)}><mesh position={[0, 0.1, 0]} scale={[0.1, 0.09, 0.1]} geometry={esfGeo}>{ghost}</mesh><mesh position={[0, 0.1, 0]} scale={0.15} geometry={esfGeo}>{halo}</mesh></group>
    <group position={[0.76, 0.48, 0.05]} scale={1.45 * falta(3)}><mesh position={[0, 0.07, 0]} rotation={[0, 0, P2]}><capsuleGeometry args={[0.05, 0.22, 4, 8]} />{ghost}</mesh><mesh position={[0, 0.07, 0]} scale={[0.2, 0.1, 0.1]} geometry={esfGeo}>{halo}</mesh></group>
    <pointLight position={[0, 0.7, 0.4]} intensity={0.8 + 0.6 * pulso} distance={1.6} color="#7fe8ff" />
  </Estudio>;
}}</Stage>;

// ── 5 · LA TORTILLERÍA (3:40): la máquina saca tortillas por la banda de rodillos; la pila crece en el trapo; las monedas se van y el contador baja a 73
const H5Tortilleria: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const D = dur(h), n = Math.min(14, Math.floor(Math.max(0, tt - 0.15) * 2.6)), paga = eio(tt, 0.8, D - 1.0);
  return <Estudio t={tt} cam={[0.1, 1.5, 2.9]} look={[0.1, 0.45, 0]} orbit={0.1}>
    <RBox p={[-1.0, 0.45, 0]} s={[0.6, 0.9, 0.62]} r={0.04}>{M.cromo("#b8bcc2")}</RBox>
    <RBox p={[-0.69, 0.52, 0]} s={[0.04, 0.06, 0.5]} r={0.01}><meshStandardMaterial color="#1a1a1a" /></RBox>
    <mesh position={[-1.0, 0.75, 0.315]} rotation={[P2, 0, tt * 3]}><cylinderGeometry args={[0.1, 0.1, 0.02, 6]} />{M.hierro()}</mesh>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.6 + i * 0.13, 0.47, 0]} rotation={[P2, tt * 6, 0]}><cylinderGeometry args={[0.03, 0.03, 0.5, 12]} />{M.cromo("#9a9da2")}</mesh>)}
    {[-1, 1].map((z) => <RBox key={z} p={[-0.08, 0.44, z * 0.27]} s={[1.2, 0.08, 0.03]} r={0.01}>{M.hierro()}</RBox>)}
    {Array.from({ length: 3 }, (_, i) => { const k = ((tt * 0.55 + i / 3) % 1); return <Tortilla key={i} p={[lerp(-0.65, 0.45, k), 0.51 - (k > 0.92 ? (k - 0.92) * 4 : 0), 0]} c="#e9d18f" s={0.62} />; })}
    <Vapor t={tt} p={[-0.1, 0.52, 0]} o={0.35} h={0.6} s={0.25} spread={0.5} n={14} />
    <mesh position={[0.72, 0.006, 0.15]} rotation={[-P2, 0, 0.15]} receiveShadow><planeGeometry args={[0.85, 0.85]} /><meshStandardMaterial map={cuadrosTex("#b8322a")} roughness={1} /></mesh>
    {Array.from({ length: n }, (_, i) => <Tortilla key={i} p={[0.72, 0.012 + i * 0.013 + fall(tt, 0.15 + i / 2.6, 0.35), 0.15]} rot={[0, i, 0]} c={i % 2 ? "#e9d18f" : "#dcc07a"} s={0.85} />)}
    <Vapor t={tt} p={[0.72, 0.1 + n * 0.013, 0.15]} o={0.25} h={0.5} s={0.2} n={8} />
    <Monedero p={[1.35, 0, -0.35]} s={0.75} />
    {Array.from({ length: 5 }, (_, j) => { const k = cl(paga * 5 - j); return k > 0 && k < 1 ? <Moneda key={j} p={[lerp(1.35, 2.2, k), 0.35 + Math.sin(k * P) * 0.45, lerp(-0.35, 0.3, k)]} rot={[k * 8, 0, 0]} s={1.3} /> : null; })}
    <Contador p={[1.25, 0.75, -0.6]} v={100 - 27 * paga} s={0.8} rot={[0, -0.3, 0]} />
  </Estudio>;
}}</Stage>;

// ── 6 · LA BOLSA QUE COBRA (4:45): la bolsa del súper se parte en tres tajadas — bolsa, dibujo, camión — y cada tajada suelta su pila de monedas
const H6Granel: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const des = phys(tt, 0.2, 4, 0.6), sep = cl(des);
  const X = [-0.85, 0, 0.85];
  return <Estudio t={tt} cam={[0, 1.3, 2.9]} look={[0, 0.5, 0]} orbit={0.1}>
    {[0, 1, 2].map((j) => <group key={j} position={[lerp(0, X[j], sep), 0.55, 0]} rotation={[0, 0, (j - 1) * -0.15 * sep]}>
      <group scale={Math.max(0.001, 1 - sep)}><mesh scale={[0.3, 0.38, 0.22]} geometry={bolsaGeo}><meshPhysicalMaterial color="#f4f4f0" transparent opacity={0.85} roughness={0.3} side={THREE.DoubleSide} /></mesh></group>
      <group scale={Math.max(0.001, sep)}>
        {j === 0 && <Bolsa p={[0, -0.05, 0]} s={0.9} o={0.55} />}
        {j === 1 && <group rotation={[0, 0, Math.sin(tt * 1.5) * 0.08]}><RBox s={[0.5, 0.5, 0.02]} r={0.01}><meshStandardMaterial color="#ffffff" /></RBox><mesh position={[0, 0, 0.012]}><planeGeometry args={[0.46, 0.46]} /><meshStandardMaterial map={ctex("dib29c2", 256, 256, (g) => { g.fillStyle = "#f4d03f"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#c0392b"; g.beginPath(); g.arc(128, 128, 90, 0, 7); g.fill(); g.fillStyle = "#6b2a1c"; for (let i = 0; i < 12; i++) { g.beginPath(); g.ellipse(80 + (i % 4) * 32, 95 + Math.floor(i / 4) * 34, 13, 8, 0.3, 0, 7); g.fill(); } g.fillStyle = "#28b463"; g.fillRect(0, 220, 256, 36); })} /></mesh></group>}
        {j === 2 && <group scale={0.75}>
          <RBox p={[-0.08, 0.05, 0]} s={[0.46, 0.3, 0.3]} r={0.03}><meshStandardMaterial color="#3f7fb8" roughness={0.4} metalness={0.3} /></RBox>
          <RBox p={[0.24, 0.0, 0]} s={[0.18, 0.22, 0.28]} r={0.03}><meshStandardMaterial color="#e8e4dc" roughness={0.4} /></RBox>
          <mesh position={[0.3, 0.04, 0]}><boxGeometry args={[0.07, 0.1, 0.24]} /><meshPhysicalMaterial color="#9ac8e0" roughness={0.05} clearcoat={1} /></mesh>
          {[-0.2, 0.22].map((x) => [-1, 1].map((z) => <mesh key={x + "" + z} position={[x, -0.13, z * 0.15]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />{M.hierro()}</mesh>))}</group>}
      </group>
      <group scale={1.5}><Pila p={[0, -0.37, 0.25]} n={[4, 7, 10][j]} t={tt} a={0.6 + j * 0.3} dt={0.06} /></group>
    </group>)}
    {[0, 1, 2].map((j) => <Sombra key={j} p={[X[j], 0, 0.38]} r={0.2} o={sep} />)}
  </Estudio>;
}}</Stage>;

// ── 7 · CARNE NO, HUESO (5:47): el hueso carnudo cae a la olla grande con salpicadura; el caldo sube hasta la raya y se sirve en dos tazones: día 1 y día 2
const tazGeo = lathe([[0, 0], [0.12, 0], [0.2, 0.06], [0.24, 0.16], [0.225, 0.16], [0.18, 0.07], [0.1, 0.02], [0, 0.02]], 36);
const numTex = (n: string) => ctex("num" + n, 128, 128, (g) => { g.fillStyle = "#e8dcc0"; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); g.fillStyle = "#7a2a14"; g.font = "900 96px Montserrat, Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(n, 64, 70); });
const H7Hueso: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const D = dur(h), entra = 0.15 + Math.sqrt(1.3 / 4.9), sube = eio(tt, entra, 0.6 * D), sirve = phys(tt, 0.6 * D, 6, 0.5), spl = cl((tt - entra) / 0.6);
  return <Estudio t={tt} cam={[0, 1.55, 2.5]} look={[0, 0.5, 0]} orbit={0.1}>
    <Olla p={[0, 0, -0.1]} nivel={0.2 + 0.55 * sube} caldo="#c08a4a" hervor={sube} t={tt} s={0.85} />
    <mesh position={[0, 0.02 + 0.85 * 0.76 * 0.78, -0.1]} rotation={[P2, 0, 0]}><torusGeometry args={[0.5, 0.01, 6, 48]} /><meshBasicMaterial color="#ffe0a0" toneMapped={false} /></mesh>
    {tt < entra + 0.1 && <group position={[0, 0.5 + fall(tt, 0.15, 1.3) * (tt < entra ? 1 : 0), -0.1]} rotation={[0.3, tt * 0.8, P2 * 0.45]}>
      <mesh castShadow><cylinderGeometry args={[0.07, 0.08, 0.55, 14]} /><meshStandardMaterial color="#efe6d4" roughness={0.6} /></mesh>
      {[-1, 1].map((k) => [-1, 1].map((q) => <mesh key={k + "" + q} position={[q * 0.05, k * 0.3, 0]} scale={[0.08, 0.07, 0.08]} geometry={esfGeo} castShadow><meshStandardMaterial color="#efe6d4" roughness={0.6} /></mesh>))}
      <mesh position={[0.05, 0.02, 0]} scale={[0.12, 0.2, 0.1]} geometry={esfGeo}><meshStandardMaterial color="#a8443a" roughness={0.55} /></mesh></group>}
    {Array.from({ length: 16 }, (_, i) => { if (spl <= 0 || spl >= 1) return null; const a = i * 0.39; return <mesh key={i} position={[Math.cos(a) * 0.5 * spl, 0.6 + Math.sin(spl * P) * 0.4, -0.1 + Math.sin(a) * 0.4 * spl]} scale={0.025 * (1 - spl)} geometry={esfGeo}>{M.liquido("#d8a060", 0.85)}</mesh>; })}
    <Vapor t={tt} p={[0, 0.72, -0.1]} o={0.35 * sube} h={1.0} s={0.3} n={14} />
    {[0, 1].map((i) => { const x = i ? 0.82 : -0.82; return <group key={i} position={[x, 0, 0.45]} scale={Math.max(0.001, sirve)}>
      <mesh geometry={tazGeo} castShadow receiveShadow scale={1.3}><meshPhysicalMaterial color="#e9e2d0" roughness={0.25} clearcoat={0.7} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.17, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.27, 28]} />{M.liquido("#c08a4a")}</mesh>
      <mesh position={[0, 0.11, 0.27]} rotation={[-0.35, 0, 0]}><circleGeometry args={[0.07, 24]} /><meshStandardMaterial map={numTex(String(i + 1))} roughness={0.6} /></mesh>
      <Vapor t={tt + i} p={[0, 0.2, 0]} o={0.25} h={0.5} s={0.15} n={6} /></group>; })}
  </Estudio>;
}}</Stage>;

// ── 8 · UN MANOJO, TRES COMIDAS (7:24): el manojo atado de $10 se abre y sus tallos vuelan en arco a tres platos: con huevo, en caldo y en salsa verde
const H8Quelites: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const abre = eio(tt, 0.8, 1.3), X = [-0.85, 0, 0.85], vuela = (j: number) => eio(tt, 1.2 + j * 0.45, 2.0 + j * 0.45);
  return <Estudio t={tt} cam={[0, 1.45, 2.6]} look={[0, 0.3, 0]} orbit={0.1}>
    <group position={[0, 0.02, -0.45]} scale={1.6}>
      {[0, 1, 2].map((j) => { const k = vuela(j); if (k >= 1) return null; return <group key={j} position={[lerp(0, X[j] / 1.6, k) + (j - 1) * 0.05 * abre, Math.sin(k * P) * 0.4, lerp(0, 0.85 / 1.6, k)]} rotation={[0, 0, (j - 1) * 0.3 * abre]}><Verdolaga p={[0, 0, 0]} n={4} s={1 - 0.3 * k} /></group>; })}
      <mesh position={[0, 0.1, 0]} rotation={[P2, 0, 0]} scale={Math.max(0.001, 1 - abre)}><torusGeometry args={[0.05, 0.008, 6, 20]} /><meshStandardMaterial color="#c0392b" /></mesh></group>
    <group position={[0.5, 0.02, -0.55]}><Moneda p={[0, 0.015, 0]} rot={[0, 0, 0]} s={2.6} /></group>
    {X.map((x, j) => { const k = Math.max(0.001, phys(tt, 0.1 + j * 0.12, 6, 0.5)), ll = vuela(j) >= 1 ? phys(tt, 2.0 + j * 0.45, 7, 0.4) : 0; return <group key={j} position={[x, 0, 0.4]} scale={k}>
      <Plato s={0.95}>{j === 0 && <><mesh position={[0, 0.045, 0]} scale={[0.26, 0.018, 0.22]} geometry={esfGeo}><meshStandardMaterial color="#fbf8f0" roughness={0.4} /></mesh><mesh position={[0.02, 0.07, 0]} scale={[0.09, 0.05, 0.09]} geometry={esfGeo}><meshPhysicalMaterial color="#f2b42a" clearcoat={1} roughness={0.15} /></mesh></>}
        {j === 1 && <><mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.38, 0.32, 0.06, 30]} />{M.liquido("#c08a4a")}</mesh><Vapor t={tt} p={[0, 0.08, 0]} o={0.3} h={0.5} s={0.15} n={6} /></>}
        {j === 2 && <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.35, 0.3, 0.04, 30]} /><meshPhysicalMaterial color="#4f7a24" roughness={0.3} clearcoat={0.6} /></mesh>}
        <group scale={Math.max(0.001, ll)}><Verdolaga p={[0.08, 0.06, -0.05]} rot={[P2 * 0.8, 0, 0]} n={4} s={0.8} /></group>
      </Plato></group>; })}
  </Estudio>;
}}</Stage>;

// ── 9 · LA BOLSITA QUE SE ROMPE (7:49): la bolsita colgada se raja por abajo y los jitomates caen y ruedan; la bolsa de manta los aguanta
const H9Bolsita: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const RJ = 1.0, raja = eio(tt, RJ, RJ + 0.3);
  return <Estudio t={tt} cam={[0, 1.1, 2.4]} look={[0, 0.55, 0]} orbit={0.08}>
    <group position={[-0.55, 0.85 + Math.sin(tt * 2) * 0.02, 0]}>
      <Bolsa p={[0, 0, 0]} s={1.25} o={0.42} />
      <mesh position={[0, -0.46, 0.02]} rotation={[-P2 + 0.3, 0, 0]} scale={[Math.max(0.001, raja), Math.max(0.001, raja * 0.7), 1]}><circleGeometry args={[0.14, 9]} /><meshBasicMaterial color="#1a1410" /></mesh>
      {Array.from({ length: 8 }, (_, i) => { const a = i * 0.785; return <mesh key={i} position={[Math.cos(a) * 0.15 * raja, -0.46, Math.sin(a) * 0.11 * raja]} rotation={[0, -a, 0.6 * raja]} scale={Math.max(0.001, raja)}><coneGeometry args={[0.03, 0.08, 3]} /><meshPhysicalMaterial color="#f4f4f0" transparent opacity={0.6} /></mesh>; })}</group>
    {Array.from({ length: 6 }, (_, i) => { const a = RJ + 0.1 + i * 0.1, y0 = 0.62 + (i % 3) * 0.1, gone = tt > a;
      const roll = gone ? cl((tt - a - 0.45) / 1.6) : 0, dx = (rn(i, 1) - 0.25) * 1.3, dz = 0.3 + rn(i, 3) * 0.5;
      return <group key={i}><Jito p={[-0.55 + (i % 3 - 1) * 0.12 + roll * dx, gone ? 0.075 + fall(tt, a, y0 - 0.075) : y0, (rn(i, 2) - 0.5) * 0.1 + roll * dz]} s={0.08} />
        {gone && <Sombra p={[-0.55 + (i % 3 - 1) * 0.12 + roll * dx, 0, (rn(i, 2) - 0.5) * 0.1 + roll * dz]} r={0.1} />}</group>; })}
    <group position={[0.7, 0, 0]}>
      <RBox p={[0, 0.3, 0]} s={[0.5, 0.56, 0.24]} r={0.04}><meshStandardMaterial map={mantaTex()} color="#efe7d4" roughness={0.95} /></RBox>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.252, 0.3, 0]} rotation={[0, 0, 0]}><boxGeometry args={[0.006, 0.54, 0.22]} /><meshStandardMaterial color="#b8a888" /></mesh>)}
      <mesh position={[0, 0.58, 0]}><torusGeometry args={[0.16, 0.018, 8, 24, P]} /><meshStandardMaterial map={mantaTex()} color="#e8dcc0" /></mesh>
      {[0, 1, 2].map((i) => <Jito key={i} p={[(i - 1) * 0.13, 0.6, 0]} s={0.08} />)}
      <Sombra p={[0, 0, 0]} r={0.4} /></group>
  </Estudio>;
}}</Stage>;

// ── 10 · TRES KILOS DE NARANJA (8:16): tres montones de un kilo; la mano se lleva uno y los otros dos se llenan de moho y se hunden, con sus monedas
const H10Naranjas: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const D = dur(h), lleva = eio(tt, 0.6, 1.7), moho = eio(tt, 1.6, D - 0.3), X = [-0.8, 0, 0.8];
  return <Estudio t={tt} cam={[0, 1.2, 2.1]} look={[0, 0.25, 0]} orbit={0.1}>
    {X.map((x, j) => { const ido = j === 0, off: V3 = ido ? [-1.2 * lleva, 0.5 * Math.sin(lleva * P) + 0.4 * lleva, -0.4 * lleva] : [0, 0, 0], hund = ido ? 1 : 1 - 0.3 * moho;
      return <group key={j}>
        <group position={[x + off[0], off[1], off[2] - 0.1]} scale={[1.45, 1.45 * hund, 1.45]}>
          {Array.from({ length: 7 }, (_, i) => { const lay = i < 4 ? 0 : i < 6 ? 1 : 2, q = [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -0.5], [0, 0.5], [0, 0]][i];
            const c = new THREE.Color("#f08a1a").lerp(new THREE.Color("#6a7a5a"), ido ? 0 : moho * (0.4 + 0.6 * rn(i + j * 7, 1)));
            return <mesh key={i} position={[q[0] * 0.1, 0.1 + lay * 0.14, q[1] * 0.1]} scale={0.105} geometry={esfGeo} castShadow><meshPhysicalMaterial color={c} roughness={0.5 + 0.45 * moho * (ido ? 0 : 1)} clearcoat={ido ? 0.5 : 0.5 * (1 - moho)} /></mesh>; })}
          {!ido && Array.from({ length: 14 }, (_, i) => { const a = rn(i + j * 20, 2) * 6.28, e = rn(i + j * 20, 3) * 1.2; return <mesh key={"m" + i} position={[Math.cos(a) * 0.17 * Math.cos(e), 0.12 + Math.sin(e) * 0.2, Math.sin(a) * 0.17 * Math.cos(e)]} scale={0.001 + 0.045 * phys(moho * 14 - i, 0, 6, 0.5)} geometry={esfGeo}><meshStandardMaterial color={i % 2 ? "#cfe0c8" : "#7aa898"} roughness={1} /></mesh>; })}
          {ido && <Mano p={[0, 0.5, -0.05]} rot={[0.4, 0, 0]} pinza={0.5} s={0.65 * Math.max(0.001, phys(tt, 0.3, 6, 0.5))} />}
        </group>
        <Pila p={[x + 0.38 + off[0], off[1], 0.3 + off[2]]} n={5} t={99} a={0} oro={ido || moho < 0.45} />
        {!ido && <Sombra p={[x, 0, -0.1]} r={0.32} />}</group>; })}
  </Estudio>;
}}</Stage>;

// ── 11 · LA SOMBRA DE LA BANCA (9:54): banca de hierro forjado en la plaza empedrada; el sol bajo se mueve y la sombra gira de las doce a las dos
const H11Banca: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const D = dur(h), k = eio(tt, 0.3, D - 0.3), sx = lerp(-1.3, 1.3, k), sy = 1.05 + 0.18 * Math.sin(k * P);
  const ang = lerp(0.35, -0.75, k), L = 1.1;
  return <Estudio t={tt} cam={[0, 1.55, 2.75]} look={[0, 0.35, -0.15]} orbit={0.05} mesa={false}>
    <EmpedradoC />
    <group>{[["12", 0.35], ["2", -0.75]].map(([n, a]) => <mesh key={n as string} position={[Math.sin(a as number + P) * -1.3, 0.03, Math.cos(a as number + P) * -1.3]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.15, 32]} /><meshStandardMaterial map={horaTex(n as string)} roughness={0.9} /></mesh>)}</group>
    <group rotation={[0, ang, 0]}><mesh position={[0, 0.008, L / 2 + 0.1]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.25, L]} /><meshBasicMaterial color="#120c08" transparent opacity={0.55} depthWrite={false} /></mesh></group>
    <group>
      {[-0.12, -0.04, 0.04, 0.12].map((z, i) => <RBox key={i} p={[0, 0.44, z]} s={[1.3, 0.025, 0.05]} r={0.008}>{M.hierro()}</RBox>)}
      {[0.6, 0.72, 0.84].map((y, i) => <RBox key={"r" + i} p={[0, y, -0.2]} s={[1.3, 0.03, 0.02]} r={0.008}>{M.hierro()}</RBox>)}
      {Array.from({ length: 6 }, (_, i) => <mesh key={"v" + i} position={[-0.5 + i * 0.2, 0.72, -0.2]} rotation={[0, P2, 0]}><torusGeometry args={[0.05, 0.01, 8, 20, P * 1.7]} />{M.hierro()}</mesh>)}
      {[-0.6, 0.6].map((x) => <group key={x} position={[x, 0, 0]}>
        <mesh position={[0, 0.22, 0.12]} castShadow><cylinderGeometry args={[0.02, 0.024, 0.44, 8]} />{M.hierro()}</mesh>
        <mesh position={[0, 0.5, -0.17]} castShadow rotation={[0.12, 0, 0]}><cylinderGeometry args={[0.02, 0.024, 1.0, 8]} />{M.hierro()}</mesh>
        <mesh position={[0, 0.56, 0.12]} rotation={[0, P2, 0]} castShadow><torusGeometry args={[0.1, 0.018, 8, 24, P * 1.4]} />{M.hierro()}</mesh>
        <mesh position={[0, 0.12, -0.05]} rotation={[0, P2, 0.5]} castShadow><torusGeometry args={[0.08, 0.016, 8, 20, P * 1.7]} />{M.hierro()}</mesh>
        <mesh position={[0, 0.96, -0.21]} rotation={[0, P2, -0.8]} castShadow><torusGeometry args={[0.07, 0.016, 8, 20, P * 1.7]} />{M.hierro()}</mesh></group>)}
    </group>
    <group position={[sx, sy, -1.4]}>
      <mesh><sphereGeometry args={[0.16, 28, 18]} /><meshBasicMaterial color="#ffc46a" toneMapped={false} /></mesh>
      <sprite scale={[0.7, 0.7, 1]}><spriteMaterial map={estrellaTex()} color="#ffcf80" transparent opacity={0.5} depthWrite={false} toneMapped={false} /></sprite>
    </group>
    <pointLight position={[sx, sy, -1.2]} intensity={1.6} distance={3.5} color="#ffcf90" />
  </Estudio>;
}}</Stage>;

// ── 12 · LA BOLSA DE REMATE (11:13): la bolsa de $9 se abre y escupe en cascada jitomates, plátanos, papas y pepinos hasta desbordar
const H12Remate: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ladea = phys(tt, 0.15, 4, 0.55), kinds = ["j", "p", "c", "a"], N = 44;
  const MO: V3 = [-0.05, 0.62, 0.05];
  return <Estudio t={tt} cam={[0.25, 0.85, 2.05]} look={[0.25, 0.32, 0]} orbit={0.08}>
    <group position={[-0.45, 0.5, 0]} rotation={[0, 0.25, -0.75 * cl(ladea)]}>
      <Bolsa p={[0, 0, 0]} s={1.75} o={0.62} c="#f6f4ee" />
      <mesh position={[0, -0.02, 0.4]} rotation={[0, 0, 0]}><planeGeometry args={[0.46, 0.34]} /><meshStandardMaterial map={ctex("rem9", 256, 190, (g) => { g.clearRect(0, 0, 256, 190); g.fillStyle = "#c8201a"; g.font = "900 150px Montserrat, Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("$9", 128, 100); })} transparent roughness={0.5} /></mesh></group>
    <Sombra p={[-0.45, 0, 0]} r={0.45} />
    {Array.from({ length: N }, (_, id) => { const a = 0.45 + id * 0.055; if (tt < a) return null;
      const k = cl((tt - a) / 0.5), kd = kinds[id % 4];
      const ang = rn(id, 1) * P - P2, rad = 0.12 + 0.55 * Math.sqrt(rn(id, 2)) * (0.55 + 0.45 * id / N);
      const x = 0.45 + Math.cos(ang) * rad, z = 0.08 + Math.sin(ang) * rad * 0.6, top = Math.max(0, 0.36 - rad * 0.55) * (0.4 + 0.6 * id / N);
      const base = 0.06 + top, land = a + 0.5;
      const y = k < 1 ? lerp(MO[1], base, k) + Math.sin(k * P) * 0.22 : base + fall(tt, land, 0.07);
      const p: V3 = [lerp(MO[0], x, k), y, lerp(MO[2], z, k)], rot: V3 = [rn(id, 5) * 3 + (1 - k) * 4, rn(id, 6) * 6, 0];
      return <group key={id}>
        {kd === "j" && <Jito p={p} s={0.085} c={rn(id, 4) > 0.3 ? "#c8321e" : "#d85a2a"} />}
        {kd === "c" && <mesh position={p} rotation={[P2, rn(id, 5) * 3, 0]} scale={[0.055, 0.12, 0.055]} castShadow><capsuleGeometry args={[1, 1, 6, 10]} /><meshPhysicalMaterial color="#3f6a24" clearcoat={0.5} roughness={0.4} /></mesh>}
        {kd === "p" && <Platano p={p} rot={rot} manchas={0.3} s={0.75} />}
        {kd === "a" && <mesh position={p} rotation={rot} scale={0.08} geometry={papaGeo} castShadow><meshStandardMaterial color="#a8784a" roughness={0.95} /></mesh>}
        {k >= 1 && top < 0.05 && <Sombra p={[x, 0, z]} r={0.09} o={0.8} />}</group>; })}
    <Sombra p={[0.45, 0, 0.08]} r={0.75} o={eio(tt, 0.6, 2.8)} />
  </Estudio>;
}}</Stage>;

// ── 13 · LAS PINTITAS NEGRAS (11:43): dos plátanos grandes frente a frente; al maduro le brotan las pintitas y de cada una sube un destello de azúcar
const H13Platano: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const D = dur(h), e1 = phys(tt, 0.1, 4, 0.55), e2 = phys(tt, 0.55, 4, 0.55), man = eio(tt, 1.2, D * 0.75);
  const amar = new THREE.Color("#ecd040").lerp(new THREE.Color("#d9a52a"), man).getStyle();
  const spots = Array.from({ length: 16 }, (_, i) => { const k = i / 16, pt = platCurve.getPointAt(0.14 + 0.72 * ((i * 7) % 16) / 16), a = rn(i, 7) * 1.6 - 0.8; return { pt, a, on: cl(man * 16 - i) }; });
  return <Estudio t={tt} cam={[0, 0.95, 1.6]} look={[0, 0.25, 0]} orbit={0.06} fov={34}>
    <group position={[lerp(-1.6, -0.48, cl(e1)), 0.1, -0.05]} rotation={[0.25, 0.2, 0]} scale={1.55}>
      <mesh geometry={platGeo2} castShadow><meshStandardMaterial color="#a2c24e" roughness={0.5} /></mesh>
      <mesh position={[0.34, 0.2, 0]} rotation={[0, 0, -0.7]}><cylinderGeometry args={[0.014, 0.018, 0.09, 8]} /><meshStandardMaterial color="#5a6a2a" /></mesh></group>
    <Sombra p={[lerp(-1.6, -0.48, cl(e1)), 0, -0.05]} r={0.45} o={0.55} />
    <group position={[lerp(1.6, 0.48, cl(e2)), 0.1, -0.05]} rotation={[0.25, -0.2, 0]} scale={1.55}>
      <mesh geometry={platGeo2} castShadow><meshStandardMaterial color={amar} roughness={0.45} /></mesh>
      <mesh position={[0.34, 0.2, 0]} rotation={[0, 0, -0.7]}><cylinderGeometry args={[0.014, 0.018, 0.09, 8]} /><meshStandardMaterial color="#5a4a2a" /></mesh>
      {spots.map(({ pt, a, on }, i) => <mesh key={i} position={[pt.x, pt.y + Math.cos(a) * 0.066, pt.z + Math.sin(a) * 0.066]} rotation={[a, 0, 0]} scale={[sz(0.014 * phys(on, 0, 7, 0.4)), 0.005, sz(0.011 * phys(on, 0, 7, 0.4))]} geometry={esfGeo}><meshStandardMaterial color="#24160c" roughness={0.6} /></mesh>)}
      {spots.map(({ pt, a, on }, i) => { const u = cl(on * 1.0) > 0 ? cl((man * 16 - i) / 3) : 0, op = Math.sin(u * P); return <sprite key={"e" + i} position={[pt.x, pt.y + 0.08 + u * 0.3, pt.z + Math.sin(a) * 0.07 + 0.04]} scale={[sz(0.16 * op), sz(0.16 * op), 1]}><spriteMaterial map={estrellaTex()} transparent opacity={op} depthWrite={false} toneMapped={false} /></sprite>; })}
    </group>
    <Sombra p={[lerp(1.6, 0.48, cl(e2)), 0, -0.05]} r={0.45} o={0.55} />
  </Estudio>;
}}</Stage>;

// ── 14 · LA CUENTA DEL TIANGUIS (11:52): siete bolsitas en arco sueltan sus monedas a la misma alcancía de vidrio; el nivel sube y el contador llega a 100
const COMP: [string, number, string][] = [["tortilla", 26, "#e9d18f"], ["frijol", 19, "#6b2a1c"], ["arroz", 14, "#f4f0e8"], ["hueso", 15, "#efe6d4"], ["quelites", 10, "#4f8a3a"], ["chile", 6, "#c8321e"], ["remate", 9, "#f08a1a"]];
const H14Suma: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const D = dur(h), st = Math.min(0.7, (D - 2) / 7), at = (i: number) => 0.3 + i * st;
  const tot = COMP.reduce((s, [, v], i) => s + v * eio(tt, at(i) + 0.3, at(i) + 0.75), 0) + eio(tt, at(7), at(7) + 0.3);
  return <Estudio t={tt} cam={[0, 1.4, 2.75]} look={[0, 0.45, 0]} orbit={0.1}>
    {COMP.map(([n, v, c], i) => { const a = -1.2 + i * 0.4, x = Math.sin(a) * 1.15, z = -Math.cos(a) * 0.55 - 0.05, tip = eio(tt, at(i), at(i) + 0.25) * (1 - eio(tt, at(i) + 0.7, at(i) + 1));
      return <group key={n}><group position={[x, 0, z]} rotation={[0, -a, 0]}>
        <group rotation={[tip * 0.9, 0, 0]} position={[0, 0, 0]}><Bolsa p={[0, 0.25, 0]} s={0.55} o={0.6} c="#f4efe4" />
          <mesh position={[0, 0.22, 0]} scale={[0.12, 0.1, 0.09]} geometry={esfGeo}><meshStandardMaterial color={c} roughness={0.6} /></mesh></group>
        <Etq p={[0, 0.03, 0.2]} rot={[-P2 + 0.6, 0, 0]} txt={["$" + v]} w={0.2} h={0.11} /></group>
        {Array.from({ length: 4 }, (_, j) => { const k = eio(tt, at(i) + 0.2 + j * 0.08, at(i) + 0.7 + j * 0.08); return k > 0 && k < 1 ? <Moneda key={j} p={[lerp(x, 0, k), 0.4 + Math.sin(k * P) * 0.45 + (1 - k) * 0.0, lerp(z, 0.35, k)]} rot={[k * 9, j, 0]} s={1.2} /> : null; })}</group>; })}
    <group position={[0, 0, 0.35]}>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.22, 0.24, 0.6, 32, 1, true]} />{M.vidrio()}</mesh>
      <mesh position={[0, 0.61, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.22, 0.015, 8, 32]} />{M.cromo("#c9a24a")}</mesh>
      <mesh position={[0, 0.01 + 0.27 * (tot / 100), 0]}><cylinderGeometry args={[0.21, 0.23, Math.max(0.001, 0.54 * tot / 100), 32]} /><meshStandardMaterial color="#d4a83a" metalness={0.8} roughness={0.3} /></mesh>
      {Array.from({ length: 10 }, (_, i) => <Moneda key={i} p={[(rn(i, 1) - 0.5) * 0.25, 0.02 + 0.54 * tot / 100, (rn(i, 2) - 0.5) * 0.25]} rot={[rn(i, 3) * 0.6, i, 0]} s={1} />)}
      <Sombra p={[0, 0, 0]} r={0.35} /></group>
    <Contador p={[0, 1.0, -0.35]} v={Math.min(100, tot)} s={0.85} />
  </Estudio>;
}}</Stage>;

// ── 15 · LA MESA DE LA SEMANA (12:15): cuatro manteles de cuadros, uno por día; en cada uno aterrizan sus tres platos de verdad y el contador llega a 12
const H15Semana: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const D = dur(h), st = Math.min(0.3, (D - 1.3) / 12), MANT = ["#b8322a", "#2e6db8", "#3f8a3a", "#d48a1a"];
  const nOk = Array.from({ length: 12 }, (_, i) => tt > 0.15 + i * st + 0.3).filter(Boolean).length;
  return <Estudio t={tt} cam={[0, 2.05, 2.05]} look={[0, 0.05, 0.05]} orbit={0.08}>
    {["lunes", "martes", "miérc.", "jueves"].map((d, r) => <group key={d} position={[0, 0.003 * r, (r - 1.5) * 0.45]}>
      <mesh rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[2.3, 0.42]} /><meshStandardMaterial map={cuadrosTex(MANT[r])} roughness={1} /></mesh>
      {Array.from({ length: 8 }, (_, f) => <mesh key={f} position={[-1.12 + f * 0.32, 0.002, 0.215]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.02, 0.06]} /><meshStandardMaterial color={MANT[r]} /></mesh>)}
      <Etq p={[-0.88, 0.012, 0]} rot={[-P2, 0, 0]} txt={[d]} w={0.4} h={0.17} bg="#f6f1e4" />
      {[0, 1, 2].map((c) => { const i = r * 3 + c, x = -0.3 + c * 0.47, y = fall(tt, 0.15 + i * st, 0.6);
        return <group key={c} position={[x, 0.01 + (tt < 0.15 + i * st ? 5 : y), 0]}><Plato s={0.42}>
          {c === 0 && Array.from({ length: 12 }, (_, q) => <Frijol key={q} p={[(rn(q + i, 1) - 0.5) * 0.3, 0.06 + (q % 3) * 0.02, (rn(q + i, 2) - 0.5) * 0.3]} rot={[rn(q, 3) * 3, rn(q, 4) * 3, 0]} s={0.06} />)}
          {c === 1 && <mesh position={[0, 0.06, 0]} scale={[0.26, 0.07, 0.26]} geometry={esfGeo}><meshStandardMaterial color="#f6f2ea" roughness={0.95} /></mesh>}
          {c === 2 && <><mesh position={[0, 0.045, 0]} scale={[0.26, 0.018, 0.22]} geometry={esfGeo}><meshStandardMaterial color="#fbf8f0" roughness={0.4} /></mesh><mesh position={[0.02, 0.07, 0]} scale={[0.09, 0.05, 0.09]} geometry={esfGeo}><meshPhysicalMaterial color="#f2b42a" clearcoat={1} roughness={0.15} /></mesh></>}
        </Plato></group>; })}
    </group>)}
    <Contador p={[0.95, 0.35, -0.95]} v={nOk} n={2} s={0.9} rot={[-0.5, -0.2, 0]} />
  </Estudio>;
}}</Stage>;

// ── 16 · EL CUCHILLO DE OTRO (13:53): el cuchillo grande clavado en la charolita picada; del filo se desliza un hilo de monedas a una mano ajena; la zanahoria entera guarda su moneda
const H16Cuchillo: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const D = dur(h), clava = phys(tt, 0.0, 6, 0.45), cobra = eio(tt, 0.4, D - 0.8);
  return <Estudio t={tt} cam={[0, 1.2, 2.2]} look={[-0.1, 0.35, 0]} orbit={0.1}>
    <group position={[-0.45, 0, 0.1]}>
      <RBox p={[0, 0.03, 0]} s={[0.9, 0.06, 0.6]} r={0.025}>{M.madera("#9a7448")}</RBox>
      {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.65, 0.07 + (i % 3) * 0.015, (rn(i, 2) - 0.5) * 0.42]} scale={0.035} rotation={[i, i * 2, 0]} castShadow><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={["#e07a2a", "#5a8a2a", "#e8e0c0", "#c8321e"][i % 4]} roughness={0.5} /></mesh>)}
      <group position={[0.05, 0.1 + 0.8 * (1 - cl(clava)), 0]} rotation={[0, 0.5, 0.12]} scale={1.9}>
        <mesh position={[0, 0.2, 0]} castShadow><boxGeometry args={[0.12, 0.42, 0.012]} />{M.cromo("#d8dce0")}</mesh>
        <mesh position={[0, 0.48, 0]} castShadow><boxGeometry args={[0.1, 0.18, 0.05]} />{M.madera("#3a2a1a")}</mesh>
        {[0.44, 0.52].map((y) => <mesh key={y} position={[0, y, 0.027]}><cylinderGeometry args={[0.008, 0.008, 0.01, 10]} />{M.cromo("#c9a24a")}</mesh>)}</group>
      {Array.from({ length: 6 }, (_, j) => { const k = cl(cobra * 6 - j); return k > 0 && k < 1 ? <Moneda key={j} p={[lerp(0.1, -0.85, k), 0.25 + Math.sin(k * P) * 0.35, lerp(0, -0.4, k)]} rot={[k * 6, 0, k * 3]} s={2.3} /> : null; })}
      <Pila p={[-0.9, 0, -0.35]} n={Math.floor(cobra * 6)} t={99} a={0} />
      <Mano p={[-1.05, 0.22, -0.55]} rot={[0.2, 0.9, 0]} pinza={0.3} s={0.7} /></group>
    <group position={[0.75, 0, 0.15]}>
      <group position={[0, 0.08, 0]} rotation={[0, 0.4, 0]}><mesh rotation={[0, 0, P2]} castShadow><coneGeometry args={[0.075, 0.6, 20]} /><meshPhysicalMaterial color="#e8781e" roughness={0.45} clearcoat={0.4} /></mesh>
        {[-0.03, 0, 0.03].map((z, i) => <mesh key={i} position={[-0.33, 0.02, z]} rotation={[0, 0, P2 + 0.3 * (i - 1)]}><cylinderGeometry args={[0.006, 0.01, 0.16, 6]} /><meshStandardMaterial color="#4f8a3a" /></mesh>)}</group>
      <Moneda p={[0.05, 0.012, 0.25]} s={1.5} /><Sombra p={[0, 0, 0]} r={0.35} /></group>
  </Estudio>;
}}</Stage>;

// ── 17 · LAS VERDOLAGAS COMO FLORES (14:33): salta la liga, la tijera corta las puntas, el manojo baja al vaso y la manta húmeda lo envuelve
const H17Vaso: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const D = dur(h), liga = eio(tt, 0.3, 0.8), corta = eio(tt, 0.9, 1.4), entra = eio(tt, 1.6, 2.7), manta = eio(tt, 3.0, Math.min(D - 0.5, 4.3));
  return <Estudio t={tt} cam={[0, 1.0, 1.75]} look={[0, 0.45, 0]} orbit={0.08}>
    <group position={[0.25, 0, 0]}>
      <mesh position={[0, 0.27, 0]} castShadow><cylinderGeometry args={[0.2, 0.17, 0.54, 32, 1, true]} />{M.vidrio()}</mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.17, 32]} />{M.vidrio()}</mesh>
      <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.185, 0.165, 0.32, 32]} /><meshPhysicalMaterial color="#cfe6ea" transparent opacity={0.3} roughness={0.05} depthWrite={false} /></mesh>
      <Sombra p={[0, 0, 0]} r={0.3} /></group>
    <group position={[lerp(-0.45, 0.25, entra), lerp(0.35, 0.1, entra), 0]} rotation={[0, 0, lerp(-P2 * 0.85, 0, entra)]}>
      <Verdolaga p={[0, 0, 0]} s={1.7} n={11} />
      {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[(i - 2) * 0.03, -0.02 - 0.15 * corta, 0.01]} visible={corta < 1} scale={Math.max(0.001, 1 - corta)}><cylinderGeometry args={[0.01, 0.01, 0.06, 6]} /><meshStandardMaterial color="#9a4a3a" /></mesh>)}
      <mesh position={[0, 0.16, 0]} rotation={[P2, 0, 0]} visible={liga < 0.05}><torusGeometry args={[0.07, 0.01, 6, 20]} /><meshStandardMaterial color="#c0392b" /></mesh>
      <mesh position={[0, 0.55, 0]} scale={[1, Math.max(0.001, manta), 1]}><cylinderGeometry args={[0.25, 0.2, 0.5, 32, 1, true, 0, P * 2 * Math.max(0.01, manta)]} /><meshStandardMaterial map={mantaTex()} color="#d8d4c4" roughness={1} transparent opacity={0.92} side={THREE.DoubleSide} /></mesh></group>
    {liga > 0 && liga < 1 && <mesh position={[lerp(-0.45, -0.95, liga), 0.5 + Math.sin(liga * P) * 0.4, 0.1]} rotation={[liga * 8, liga * 4, 0]}><torusGeometry args={[0.07, 0.01, 6, 20]} /><meshStandardMaterial color="#c0392b" /></mesh>}
    <group position={[-0.62, 0.32 + 0.4 * (1 - phys(tt, 0.6, 6, 0.5)), 0.12]} visible={tt < 1.8} rotation={[0, 0, P2 + 0.2]}>
      {[-1, 1].map((sd) => <group key={sd} rotation={[0, 0, sd * (0.35 - 0.33 * corta)]}><mesh position={[0, 0.12, 0]}><boxGeometry args={[0.025, 0.22, 0.006]} />{M.cromo("#d8dce0")}</mesh>
        <mesh position={[sd * 0.04, -0.07, 0]}><torusGeometry args={[0.035, 0.01, 6, 16]} /><meshStandardMaterial color="#c0392b" /></mesh></group>)}</group>
  </Estudio>;
}}</Stage>;

// ── 18 · EL FRÍO LE QUITA EL SABOR (15:06): un jitomate grande brillante en su plato; el otro, dentro del cubo de hielo, se escarcha de afuera hacia adentro y queda pálido y mate
const escarchaTex = () => ctex("escarcha", 256, 256, (g) => { g.clearRect(0, 0, 256, 256); for (let i = 0; i < 400; i++) { const r = rn(i, 9); g.fillStyle = `rgba(255,255,255,${0.3 + 0.6 * r})`; const x = rn(i, 1) * 256, y = rn(i, 2) * 256; g.save(); g.translate(x, y); g.rotate(r * 6); g.fillRect(-6 * r - 1, -0.7, 12 * r + 2, 1.4); g.fillRect(-0.7, -6 * r - 1, 1.4, 12 * r + 2); g.restore(); } });
const H18Frio: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const D = dur(h), frio = eio(tt, 0.4, D - 0.8);
  return <Estudio t={tt} cam={[0, 0.95, 1.8]} look={[0, 0.25, 0]} orbit={0.08}>
    <Plato p={[-0.45, 0.0, 0]} s={0.75}><Jito p={[0, 0.17, 0]} s={0.15} /></Plato>
    <group position={[0.42, 0, 0]}>
      <Jito p={[0, 0.2, 0]} s={0.15} c={new THREE.Color("#c8321e").lerp(new THREE.Color("#d8a898"), frio).getStyle()} mate={frio} />
      <RBox p={[0, 0.21, 0]} s={[0.46, 0.42, 0.42]} r={0.04}><meshPhysicalMaterial color="#dff2fb" transparent opacity={0.22 + 0.25 * frio} roughness={0.05 + 0.5 * frio} transmission={0} clearcoat={1} depthWrite={false} /></RBox>
      {[[0, 0.21, 0.212, 0], [0, 0.21, -0.212, P], [0.232, 0.21, 0, P2], [-0.232, 0.21, 0, -P2], [0, 0.422, 0, 0]].map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]} rotation={i === 4 ? [-P2, 0, 0] : [0, r, 0]} scale={0.001 + frio}><planeGeometry args={[0.42, 0.4]} /><meshBasicMaterial map={escarchaTex()} transparent opacity={0.9 * frio} depthWrite={false} /></mesh>)}
      <Vapor t={tt} p={[0, 0.42, 0]} o={0.35 * frio} h={0.4} s={0.18} n={10} />
      <Sombra p={[0, 0, 0]} r={0.35} /></group>
  </Estudio>;
}}</Stage>;

// ── 19 · LA PAPA Y LA CEBOLLA (15:24): a la izquierda juntas: a la papa le brotan ojos y la cebolla se hunde; a la derecha, separadas por una tabla, quedan sanas
const papaGeo = (() => { const g = new THREE.IcosahedronGeometry(1, 4), pa = g.attributes.position; for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i), n = 1 + 0.06 * Math.sin(x * 5 + y * 3) + 0.03 * Math.sin(z * 9); pa.setXYZ(i, x * n * 1.3, y * n * 0.85, z * n); } g.computeVertexNormals(); return g; })();
const Papa: React.FC<{ p: V3; brote: number; c: string }> = ({ p, brote, c }) => <group position={p}>
  <mesh geometry={papaGeo} scale={0.14} castShadow><meshStandardMaterial color={c} roughness={0.85} /></mesh>
  {Array.from({ length: 6 }, (_, i) => { const a = i * 1.05, e = (rn(i, 2) - 0.5) * 1.2, k = phys(brote * 6 - i, 0, 6, 0.4); return <group key={i} position={[Math.cos(a) * 0.18 * Math.cos(e), Math.sin(e) * 0.12, Math.sin(a) * 0.14 * Math.cos(e)]} rotation={[Math.sin(a) * 0.8, 0, -Math.cos(a) * 0.9]}>
    <mesh position={[0, 0.05 * k, 0]} scale={[1, Math.max(0.001, k), 1]}><cylinderGeometry args={[0.008, 0.014, 0.1, 6]} /><meshStandardMaterial color="#9ac05a" /></mesh>
    <mesh position={[0, 0.1 * k, 0]} scale={0.001 + 0.018 * k} geometry={esfGeo}><meshStandardMaterial color="#b8d878" /></mesh></group>; })}</group>;
const Cebolla: React.FC<{ p: V3; mal: number }> = ({ p, mal }) => <group position={p} scale={[1 + 0.1 * mal, 1 - 0.3 * mal, 1 + 0.1 * mal]}>
  <mesh geometry={lathe([[0, 0], [0.08, 0.01], [0.15, 0.08], [0.14, 0.18], [0.06, 0.27], [0.015, 0.33]], 32)} castShadow><meshPhysicalMaterial color={new THREE.Color("#c88a4a").lerp(new THREE.Color("#5a3a1a"), mal * 0.8)} roughness={0.35 + 0.5 * mal} clearcoat={0.6 * (1 - mal)} /></mesh>
  {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, 0.15, 0]} rotation={[0, i * 0.52, 0]}><torusGeometry args={[0.146, 0.002, 4, 24, P]} /><meshStandardMaterial color="#8a5a2a" /></mesh>)}</group>;
const H19Papa: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const D = dur(h), mal = eio(tt, 0.4, D - 0.8), tabla = phys(tt, 0.15, 6, 0.5);
  return <Estudio t={tt} cam={[0, 0.95, 1.85]} look={[0, 0.18, 0]} orbit={0.08}>
    <Papa p={[-0.68, 0.12, 0]} brote={mal} c={new THREE.Color("#c8a070").lerp(new THREE.Color("#9a8a5a"), mal * 0.5).getStyle()} />
    <Cebolla p={[-0.33, 0, 0.02]} mal={mal} /><Sombra p={[-0.5, 0, 0]} r={0.4} />
    <RBox p={[0, 0.25 * cl(tabla), 0]} s={[0.05, 0.5 * cl(tabla) + 0.001, 0.7]} r={0.01}>{M.madera("#8a6a40")}</RBox>
    <Papa p={[0.33, 0.12, 0]} brote={0} c="#c8a070" /><Cebolla p={[0.72, 0, 0.02]} mal={0} />
    <Sombra p={[0.33, 0, 0]} r={0.22} /><Sombra p={[0.72, 0, 0]} r={0.2} />
  </Estudio>;
}}</Stage>;

// ── 20 · LA SAL AL FINAL (16:00): dos ollas en su leña con una vela de reloj; sal al principio = frijol duro saltando y la vela se acaba; sal al final = frijol blando y media vela
const Vela: React.FC<{ p: V3; alto: number; t: number }> = ({ p, alto, t }) => <group position={p}>
  <mesh position={[0, alto / 2, 0]} castShadow><cylinderGeometry args={[0.035, 0.035, Math.max(0.001, alto), 16]} /><meshStandardMaterial color="#f4ecd8" roughness={0.6} /></mesh>
  <mesh position={[0, alto + 0.035 + 0.006 * Math.sin(t * 11), 0]} scale={[0.018, 0.04, 0.018]} geometry={esfGeo}><meshBasicMaterial color="#ffc860" toneMapped={false} /></mesh>
  <pointLight position={[0, alto + 0.06, 0]} intensity={0.6} distance={0.8} color="#ffb860" />
  <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.06, 0.07, 0.01, 16]} />{M.cromo("#c9a24a")}</mesh></group>;
const H20Sal: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const D = dur(h), k = eio(tt, 0.3, D - 0.6), salI = cl((tt - 0.2) / 0.8), salF = cl((tt - (D - 2.0)) / 0.9);
  return <Estudio t={tt} cam={[0, 1.4, 2.6]} look={[0, 0.45, 0]} orbit={0.1}>
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.72, 0, 0]}>
      <Olla p={[0, 0.17, 0]} nivel={0.6} caldo="#5a2a1a" frijol={18} hinchado={sd > 0 ? k : 0} t={tt * (sd < 0 ? 3 : 1)} hervor={0.7} s={0.55} />
      {sd < 0 && Array.from({ length: 6 }, (_, i) => { const ph = (tt * 2.5 + i * 0.37) % 1; return <Frijol key={i} p={[(rn(i, 1) - 0.5) * 0.3, 0.6 + Math.sin(ph * P) * 0.18, (rn(i, 2) - 0.5) * 0.25]} rot={[ph * 6, i, 0]} s={0.045} c="#4a1a10" />; })}
      {Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[(i - 1.5) * 0.12, 0.05, 0.05]} rotation={[0, 0.3 * (i % 2 ? 1 : -1), P2]} castShadow><cylinderGeometry args={[0.035, 0.04, 0.5, 8]} />{M.madera("#6a4428")}</mesh>)}
      <mesh position={[0, 0.1, 0.05]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.3, 24]} /><meshBasicMaterial color="#ff8a3a" transparent opacity={0.55} toneMapped={false} /></mesh>
      <Vela p={[0.48, 0, 0.25]} alto={sd < 0 ? lerp(0.4, 0.04, k) : lerp(0.4, 0.22, k)} t={tt} />
      {Array.from({ length: 22 }, (_, i) => { const f = sd < 0 ? salI : salF, kk = cl(f * 1.6 - (i % 11) * 0.06); return kk > 0 && kk < 1 ? <mesh key={"s" + i} position={[(rn(i, 1) - 0.5) * 0.3, 1.25 - kk * 0.65, (rn(i, 2) - 0.5) * 0.25]} rotation={[i, i, 0]} scale={0.012}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} /></mesh> : null; })}
    </group>)}
  </Estudio>;
}}</Stage>;

// ── 21 · LA FONDA (16:58): sobre la mesa crece la caja registradora; sus rodillos giran hasta $660 y suena la campanita; el billete de $100 entra chiquito a un lado
const H21Fonda: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const D = dur(h), v = 660 * eio(tt, 0.2, D - 1.6), fin = phys(tt, D - 1.5, 9, 0.3), bil = eio(tt, D - 1.4, D - 0.6), caja = phys(tt, 0.0, 6, 0.5);
  return <Estudio t={tt} cam={[0, 1.15, 2.3]} look={[0, 0.6, 0]} orbit={0.08}>
    <group scale={Math.max(0.001, cl(caja))} position={[-0.2, 0, 0]}>
      <RBox p={[0, 0.25, 0]} s={[1.0, 0.5, 0.7]} r={0.05}><meshStandardMaterial color="#8a2a1e" roughness={0.3} metalness={0.5} /></RBox>
      <RBox p={[0, 0.72, -0.12]} s={[0.92, 0.46, 0.3]} r={0.05}><meshStandardMaterial color="#6a1a12" roughness={0.3} metalness={0.5} /></RBox>
      <Contador p={[0, 0.74, 0.04]} v={v} s={1.3} marco="#2a1410" />
      {Array.from({ length: 12 }, (_, i) => <RBox key={i} p={[-0.3 + (i % 4) * 0.2, 0.52, 0.25 - Math.floor(i / 4) * 0.1]} s={[0.14, 0.04, 0.08]} r={0.02}><meshStandardMaterial color="#e8e0cc" roughness={0.5} /></RBox>)}
      <group position={[0.42, 1.0, -0.1]} rotation={[0, 0, Math.sin(tt * 20) * 0.4 * (fin > 0.01 ? Math.exp(-(tt - (D - 1.5)) * 3) : 0)]}>
        <mesh position={[0, -0.06, 0]}><sphereGeometry args={[0.07, 20, 12, 0, P * 2, 0, P2]} />{M.cromo("#e2c25a")}</mesh>
        <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.06, 8]} />{M.cromo("#c9a24a")}</mesh></group>
      <Sombra p={[0, 0, 0]} r={0.75} /></group>
    {bil > 0 && <Billete p={[lerp(1.6, 0.75, bil), 0.01 + 0.3 * Math.sin(bil * P), 0.25]} rot={[-P2, 0, -0.2]} v="100" s={0.45} />}
  </Estudio>;
}}</Stage>;

// ── 22 · LA BOMBA DESCOMPUESTA (17:35): la bomba de hierro escupe agua por la grieta y crece el charco; el monedero le paga al plomero hasta que quedan 4 monedas
const caGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.1, 0.66, 0), new THREE.Vector3(0.28, 0.69, 0), new THREE.Vector3(0.4, 0.6, 0), new THREE.Vector3(0.43, 0.47, 0)]), 24, 0.048, 12, false);
const charcoGeo = (() => { const sh = new THREE.Shape(); for (let i = 0; i <= 64; i++) { const a = i / 64 * P * 2, r = 1 + 0.18 * Math.sin(a * 3 + 1) + 0.1 * Math.sin(a * 7) + 0.06 * Math.sin(a * 13 + 2); i ? sh.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.7) : sh.moveTo(r, 0); } return new THREE.ShapeGeometry(sh); })();
const H22Bomba: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const D = dur(h), ciclo = Math.sin(tt * 4.2), pal = 0.32 * ciclo, flujo = 0.65 + 0.35 * Math.max(0, -ciclo), charco = eio(tt, 0.15, D - 0.3);
  const ox = <meshStandardMaterial color="#6e3c22" roughness={0.88} metalness={0.45} />, osc = <meshStandardMaterial color="#3a2418" roughness={0.7} metalness={0.55} />;
  const PX = -0.5, tip: V3 = [PX + 0.43, 0.43, 0], suelo: V3 = [PX + 0.47, 0.01, 0.02];
  const monedas = Array.from({ length: 9 }, (_, j) => 0.7 + j * 0.42).filter((a) => a < D - 0.4);
  const llegaron = monedas.filter((a) => tt > a + 0.5).length;
  return <Estudio t={tt} cam={[0.15, 1.0, 2.25]} look={[0.1, 0.45, 0]} orbit={0.1}>
    <group position={[PX, 0, 0]}>
      <RBox p={[0, 0.05, 0]} s={[0.5, 0.1, 0.46]} r={0.02}>{ox}</RBox>
      {[[-0.18, -0.16], [0.18, -0.16], [-0.18, 0.16], [0.18, 0.16]].map(([x, z], i) => <mesh key={i} position={[x, 0.105, z]} rotation={[0, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.02, 8]} />{osc}</mesh>)}
      <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.2, 0.23, 0.07, 28]} />{ox}</mesh>
      <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.13, 0.16, 0.7, 28]} />{ox}</mesh>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[Math.cos(i * 1.9) * 0.145, 0.25 + rn(i, 2) * 0.5, Math.sin(i * 1.9) * 0.145]} scale={[0.04 + 0.03 * rn(i, 3), 0.03 + 0.02 * rn(i, 4), 0.012]} rotation={[0, -i * 1.9 + P2, 0]} geometry={esfGeo}><meshStandardMaterial color="#a8562a" roughness={1} /></mesh>)}
      <mesh position={[0, 0.88, 0]}><cylinderGeometry args={[0.165, 0.14, 0.07, 28]} />{ox}</mesh>
      <mesh geometry={caGeo} castShadow>{ox}</mesh>
      {[-1, 1].map((k) => <RBox key={k} p={[0.02, 1.0, k * 0.05]} s={[0.07, 0.2, 0.02]} r={0.008}>{osc}</RBox>)}
      <mesh position={[0.02, 1.06, 0]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.14, 10]} />{M.cromo("#b8a070")}</mesh>
      <group position={[0.02, 1.06, 0]} rotation={[0, 0, 0.25 + pal]}>
        <mesh position={[-0.36, 0, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.024, 0.03, 0.72, 12]} />{osc}</mesh>
        <mesh position={[-0.72, 0, 0]} scale={0.04} geometry={esfGeo}>{osc}</mesh>
        <mesh position={[0.07, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.022, 0.022, 0.14, 10]} />{osc}</mesh></group>
      <mesh position={[0.09, 0.95 - 0.08 * ciclo, 0]}><cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />{M.cromo("#9a9a9a")}</mesh>
    </group>
    <Sombra p={[PX, 0, 0]} r={0.36} />
    <Chorro a={tip} b={suelo} r={0.036 * flujo} c="#7ab8e0" o={0.85} />
    {Array.from({ length: 14 }, (_, i) => { const k = (tt * 1.8 + i / 14) % 1; return <mesh key={i} position={[tip[0] + 0.04 * k + (rn(i, 1) - 0.5) * 0.04, tip[1] - k * 0.42, (rn(i, 2) - 0.5) * 0.05]} scale={0.014 + 0.01 * rn(i, 3)} geometry={esfGeo}><meshPhysicalMaterial color="#9ad0f0" transparent opacity={0.85} roughness={0.05} clearcoat={1} /></mesh>; })}
    {[0, 1].map((j) => { const k = (tt * 1.6 + j * 0.5) % 1; return <mesh key={j} position={[suelo[0], 0.008, suelo[2]]} rotation={[-P2, 0, 0]} scale={0.03 + 0.12 * k}><torusGeometry args={[1, 0.06, 6, 24]} /><meshBasicMaterial color="#d8eefa" transparent opacity={0.6 * (1 - k)} /></mesh>; })}
    <mesh position={[suelo[0] + 0.12, 0.004, 0.14]} rotation={[-P2, 0, 0.3]} scale={[0.12 + 0.42 * charco, 0.12 + 0.42 * charco, 1]} geometry={charcoGeo}><meshPhysicalMaterial color="#4e7e9e" transparent opacity={0.82} roughness={0.04} clearcoat={1} /></mesh>
    <Monedero p={[0.85, 0, -0.05]} s={0.75} c="#9a6038" />
    <Sombra p={[0.85, 0, -0.05]} r={0.3} />
    <group position={[0.55, 0.16, 0.55]} rotation={[0.2, 0.5, 0]}><Mano p={[0, 0, 0]} pinza={0.15} s={0.55} /></group>
    <group position={[0.55, 0.2, 0.48]} scale={1.3}><Pila p={[0, 0, 0]} n={Math.max(0, llegaron)} t={99} a={0} oro /></group>
    {monedas.map((a, j) => { const k = cl((tt - a) / 0.5); return k > 0 && k < 1 ? <Moneda key={j} p={[lerp(0.85, 0.55, k), lerp(0.32, 0.24, k) + Math.sin(k * P) * 0.32, lerp(-0.05, 0.48, k)]} rot={[k * 8, j, 0]} s={1.5} /> : null; })}
  </Estudio>;
}}</Stage>;

// ── 23 · LOS DIEZ PASOS (18:07): diez piedras numeradas en camino al puestito del tianguis; la canasta brinca de una en una y cada piedra se enciende
const H23Pasos: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const D = dur(h), pos = (i: number): V3 => [Math.sin(i * 0.6 - 2.6) * 0.9, 0.05, 1.0 - i * 0.24];
  const s = cl((tt - 0.3) / (D - 1.3)) * 9, i0 = Math.floor(s), f = s - i0, a = pos(i0), b = pos(Math.min(9, i0 + 1));
  return <Estudio t={tt} cam={[0.2, 1.9, 2.6]} look={[0, 0, -0.1]} orbit={0.1}>
    {Array.from({ length: 10 }, (_, i) => { const on = i <= s, q = pos(i), pop = phys(tt, 0.3 + (i / 9) * (D - 1.3), 8, 0.35);
      return <group key={i} position={q}>
        <mesh scale={[0.2, 0.06, 0.15]} geometry={esfGeo} castShadow receiveShadow><meshStandardMaterial color={on ? "#e8d8a8" : "#8a7a68"} emissive="#f4b040" emissiveIntensity={on ? 0.35 : 0} roughness={0.85} /></mesh>
        <mesh position={[0, 0.062, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.09, 24]} /><meshStandardMaterial map={numTex(String(i + 1))} emissive="#ffcf7a" emissiveIntensity={on ? 0.4 : 0} roughness={0.7} /></mesh>
        {on && <Brillo p={[0, 0.08, 0]} k={cl(pop)} r={0.18} c="#ffd27a" />}</group>; })}
    <group position={[pos(9)[0] + 0.1, 0, pos(9)[2] - 0.45]} scale={0.8}>
      <RBox p={[0, 0.15, 0]} s={[0.5, 0.3, 0.3]} r={0.02}>{M.madera("#8a6a40")}</RBox>
      {[-1, 1].map((x) => [-1, 1].map((z) => <mesh key={x + "" + z} position={[x * 0.24, 0.32, z * 0.15]}><cylinderGeometry args={[0.01, 0.01, 0.64, 6]} />{M.madera()}</mesh>))}
      <mesh position={[0, 0.66, 0]} rotation={[0.2, 0, 0]}><boxGeometry args={[0.6, 0.012, 0.45]} /><meshStandardMaterial color="#c0392b" roughness={0.8} /></mesh>
      {Array.from({ length: 6 }, (_, i) => <Jito key={i} p={[(i % 3 - 1) * 0.1, 0.34, (Math.floor(i / 3) - 0.5) * 0.1]} s={0.05} />)}</group>
    <group position={[lerp(a[0], b[0], f), 0.1 + Math.sin(f * P) * 0.3, lerp(a[2], b[2], f)]} scale={[1 + 0.15 * (f < 0.1 ? 1 - f * 10 : 0), 1 - 0.15 * (f < 0.1 ? 1 - f * 10 : 0), 1]}>
      <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.15, 0.11, 0.18, 20, 1, true]} /><Yute /></mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.11, 20]} /><Yute /></mesh>
      <mesh position={[0, 0.2, 0]}><torusGeometry args={[0.12, 0.014, 6, 16, P]} /><Yute /></mesh></group>
    <Sombra p={[lerp(a[0], b[0], f), 0, lerp(a[2], b[2], f)]} r={0.18} o={1 - 0.5 * Math.sin(f * P)} />
  </Estudio>;
}}</Stage>;

// ── 24 · FRIJOL CON TORTILLA (19:11): dos piezas de rompecabezas — tortilla tostadita y frijol negro — se deslizan y encajan con un destello
const pieza = (tab: boolean) => { const s = new THREE.Shape(), W = 0.5, R = 0.13;
  if (tab) { s.moveTo(-W, -W); s.lineTo(W, -W); s.lineTo(W, -R); s.absarc(W, 0, R, -P2, P2, false); s.lineTo(W, W); s.lineTo(-W, W); s.lineTo(-W, -W); }
  else { s.moveTo(-W, -W); s.lineTo(W, -W); s.lineTo(W, W); s.lineTo(-W, W); s.lineTo(-W, R); s.absarc(-W, 0, R, P2, -P2, true); s.lineTo(-W, -W); }
  return new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 3 }); };
const piezaT = pieza(true), piezaF = pieza(false);
const polarGeo = (f: (a: number) => number, dep: number, N = 120) => { const sh = new THREE.Shape(); for (let i = 0; i <= N; i++) { const a = i / N * P * 2, r = f(a); if (i) sh.lineTo(Math.cos(a) * r, Math.sin(a) * r); else sh.moveTo(r, 0); }
  return new THREE.ExtrudeGeometry(sh, { depth: dep, bevelEnabled: true, bevelThickness: dep * 0.5, bevelSize: 0.014, bevelSegments: 3, curveSegments: 4 }); };
const corte = (c: number, rN: number, a: number) => { const s0 = c * Math.sin(a); if (Math.abs(s0) > rN) return null; const q = Math.sqrt(rN * rN - s0 * s0); return [c * Math.cos(a) - q, c * Math.cos(a) + q]; };
const TR = 0.42, BR = 0.3, RN = 0.15;
const tortG = polarGeo((a) => { const k = corte(TR, RN, a); return k && k[0] > 0 && k[0] < TR ? k[0] : TR; }, 0.018);
const frijG = polarGeo((a) => { const k = corte(BR, RN - 0.01, a - P); return k ? Math.max(BR, k[1]) : BR; }, 0.05);
const tortTex = () => { const tx = ctex("tortT", 512, 512, (g) => { const r = g.createRadialGradient(256, 256, 60, 256, 256, 256); r.addColorStop(0, "#ecd596"); r.addColorStop(0.72, "#e0bf76"); r.addColorStop(0.92, "#b98443"); r.addColorStop(1, "#8a5a2a"); g.fillStyle = r; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 70; i++) { const x = 256 + (Math.sin(i * 12.9) * 0.5) * 420, y = 256 + (Math.sin(i * 7.3 + 1) * 0.5) * 420, rr = 5 + 14 * Math.abs(Math.sin(i * 3.1)); g.fillStyle = `rgba(${70 + (i % 3) * 20},40,15,${0.35 + 0.4 * Math.abs(Math.sin(i))})`; g.beginPath(); g.ellipse(x, y, rr, rr * 0.7, i, 0, 7); g.fill(); } });
  tx.repeat.set(1 / (2 * TR), 1 / (2 * TR)); tx.offset.set(0.5, 0.5); return tx; };
const H24Proteina: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const J = 1.6, k = eio(tt, 0.15, J), clic = tt > J ? Math.exp(-(tt - J) * 3.5) : 0, reb = tt > J ? Math.sin((tt - J) * 14) * 0.06 * Math.exp(-(tt - J) * 4) : 0;
  const S = 0.62, Tx = lerp(-1.0, -TR * S, k), Bx = lerp(1.0, BR * S, k), onda = tt > J ? cl((tt - J) / 0.9) : 0;
  return <Estudio t={tt} cam={[0, 1.45, 1.05]} look={[0, 0.0, 0]} orbit={0.05}>
    <group position={[Tx - reb, 0.012, 0]} rotation={[-P2, 0, 0]} scale={S * (1 + reb)}>
      <mesh geometry={tortG} castShadow receiveShadow><meshStandardMaterial map={tortTex()} roughness={0.85} /></mesh></group>
    <group position={[Bx + reb, 0.012, 0]} scale={S}>
      <group rotation={[-P2, 0, 0]}><mesh geometry={frijG} castShadow receiveShadow><meshStandardMaterial color="#1a0d09" roughness={0.85} /></mesh></group>
      <mesh position={[0.02, 0.08, 0]} scale={[0.17, 0.06, 0.15]} geometry={esfGeo} castShadow><meshStandardMaterial color="#2a1610" roughness={0.9} /></mesh>
      {Array.from({ length: 22 }, (_, i) => { const a = rn(i, 1) * P * 2, r = Math.sqrt(rn(i, 2)) * (BR - 0.06);
        return <Frijol key={i} p={[Math.cos(a) * r, 0.075, Math.sin(a) * r]} rot={[rn(i, 4) * 3, rn(i, 5) * 3, 0]} s={0.08} c={i % 3 ? "#16090a" : "#2a1410"} />; })}</group>
    <Sombra p={[Tx, 0, 0]} r={0.32} o={0.6} /><Sombra p={[Bx, 0, 0]} r={0.25} o={0.6} />
    <Brillo p={[0, 0.06, 0]} k={clic} r={0.4} c="#ffffff" />
    <mesh position={[0, 0.03, 0]} rotation={[-P2, 0, 0]} scale={sz(0.1 + 0.9 * onda)}><ringGeometry args={[0.55, 0.6, 64]} /><meshBasicMaterial color="#fff6dc" transparent opacity={0.8 * (1 - onda) * (onda > 0 ? 1 : 0)} depthWrite={false} toneMapped={false} /></mesh>
    <pointLight position={[0, 0.35, 0.2]} intensity={0.01 + 5 * clic} distance={1.6} color="#fff4dc" />
  </Estudio>;
}}</Stage>;

// ── 25 · PENA ES TIRAR LA COMIDA (20:09): la verdura vuela al bote; la tapa se cierra de golpe, rebota en la tapa y cambia de rumbo a la canasta
const H25Basura: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const T = 0.9, cierra = phys(tt, T, 12, 0.35);
  return <Estudio t={tt} cam={[0, 1.25, 2.6]} look={[0, 0.45, 0]} orbit={0.1}>
    <group position={[-0.7, 0, 0]}><mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.26, 0.22, 0.6, 28]} />{M.cromo("#7a7d82")}</mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0, 0.3, 0]} rotation={[0, i * P / 4, 0]}><boxGeometry args={[0.535, 0.56, 0.01]} />{M.cromo("#6a6d72")}</mesh>)}
      <group position={[0.27, 0.61, 0]} rotation={[0, 0, lerp(1.6, 0, cl(cierra)) + 0.1 * (1 - cl(cierra))]}><mesh position={[-0.27, 0, 0]} castShadow><cylinderGeometry args={[0.28, 0.28, 0.04, 28]} />{M.cromo("#8a8d92")}</mesh><mesh position={[-0.27, 0.04, 0]}><boxGeometry args={[0.12, 0.03, 0.04]} />{M.hierro()}</mesh></group>
      <Sombra p={[0, 0, 0]} r={0.35} /></group>
    <group position={[0.75, 0, 0]}><mesh position={[0, 0.17, 0]} castShadow><cylinderGeometry args={[0.32, 0.25, 0.32, 24, 1, true]} /><Yute /></mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.25, 24]} /><Yute /></mesh><Sombra p={[0, 0, 0]} r={0.4} /></group>
    {Array.from({ length: 22 }, (_, i) => { const k = (tt * 1.3 + i / 22) % 1, x = lerp(-0.7, 0.75, k), y = 0.68 + Math.sin(k * P) * 0.25, on = tt > T + 0.3;
      return <mesh key={"d" + i} position={[x, y, 0.15]} scale={0.001 + 0.01 * (on ? 1 : 0) * Math.sin(k * P)} geometry={esfGeo}><meshBasicMaterial color="#e8d8b0" transparent opacity={0.7} /></mesh>; })}
    {Array.from({ length: 8 }, (_, i) => { const a = 0.15 + i * 0.12, k = cl((tt - a) / 0.65), golpe = a + 0.65 > T;
      let p: V3;
      if (!golpe || tt < T) p = [lerp(0.2, -0.7, k), lerp(1.35, 0.55, k) + Math.sin(k * P) * 0.25, lerp(0.5, 0, k)];
      else { const ar = Math.min(a + 0.65, Math.max(T, a)), k1 = cl((tt - ar) / 0.8), tg: V3 = [0.75 + (rn(i, 1) - 0.5) * 0.3, 0.22 + (i % 3) * 0.05, (rn(i, 2) - 0.5) * 0.2];
        p = [lerp(-0.7, tg[0], k1), lerp(0.68, tg[1], k1) + Math.sin(k1 * P) * 0.5, lerp(0, tg[2], k1)]; }
      if (tt < a) return null;
      return i % 2 ? <Jito key={i} p={p} s={0.08} /> : <Platano key={i} p={p} rot={[0, i, 0]} manchas={0.4} s={0.6} />; })}
  </Estudio>;
}}</Stage>;

// ── 26 · EL CARRITO (21:09): el carrito de dos ruedas con su canasta de mimbre cruza el empedrado; las ruedas brincan en cada piedra y no se cae nada
const ruedaRayos = Array.from({ length: 8 }, (_, i) => i * P / 4);
const H26Carrito: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const D = dur(h), xa = (q: number) => lerp(-0.95, 0.95, eio(q, 0.0, D)), x = xa(tt), R = 0.17, PX = 0.05;
  const sube = (q: number) => { const d = xa(q) - PX; return Math.abs(d) < 0.16 ? 0.07 * Math.cos((d / 0.16) * P2) : 0; };
  const lift = sube(tt), rebote = sube(tt - 0.12) * 1.5;
  const tubo = M.cromo("#b9bdc2");
  return <Estudio t={tt} cam={[x * 0.85, 0.72, 2.75]} look={[x * 0.85, 0.48, 0]} orbit={0.05}>
    <Empedrado n={170} w={5.2} d={2.4} />
    <mesh position={[PX, 0.03, 0.2]} scale={[0.14, 0.07, 0.12]} geometry={esfGeo} castShadow receiveShadow><meshStandardMaterial color="#8a7a68" roughness={0.9} /></mesh>
    <group position={[x, lift, 0]} rotation={[0, 0, -lift * 1.2]}>
      {[-1, 1].map((z) => <group key={z} position={[0, R, z * 0.2]} rotation={[0, 0, -x / R]}>
        <mesh><torusGeometry args={[R, 0.024, 10, 32]} /><meshStandardMaterial color="#1a1a1a" roughness={0.7} /></mesh>
        {ruedaRayos.map((a) => <mesh key={a} rotation={[0, 0, a]}><boxGeometry args={[R * 2, 0.012, 0.012]} />{tubo}</mesh>)}
        <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />{M.cromo("#c9a24a")}</mesh></group>)}
      <mesh position={[0, R, 0]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.014, 0.014, 0.46, 8]} />{tubo}</mesh>
      <group position={[0, R, 0]} rotation={[0, 0, -0.32]}>
        {[-1, 1].map((z) => <mesh key={z} position={[-0.02, 0.42, z * 0.17]}><cylinderGeometry args={[0.014, 0.014, 0.9, 8]} />{tubo}</mesh>)}
        <mesh position={[-0.02, 0.87, 0]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.016, 0.016, 0.36, 10]} />{tubo}</mesh>
        <mesh position={[-0.02, 0.87, 0]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.026, 0.026, 0.26, 12]} /><meshStandardMaterial color="#1a1a1a" roughness={0.6} /></mesh>
        <RBox p={[0.12, 0.04, 0]} s={[0.26, 0.02, 0.36]} r={0.006}>{tubo}</RBox>
        <group position={[0.12, 0.25 + rebote, 0]}>
          <mesh castShadow><cylinderGeometry args={[0.2, 0.17, 0.38, 24, 1, true]} /><Yute /></mesh>
          {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0, -0.17 + i * 0.085, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.172 + i * 0.007, 0.007, 4, 28]} /><meshStandardMaterial color="#8a6a3a" roughness={0.9} /></mesh>)}
          <mesh position={[0, -0.18, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.17, 24]} /><Yute /></mesh>
          <Jito p={[-0.07, 0.21, 0.06]} s={0.07} /><Jito p={[0.06, 0.2, -0.05]} s={0.065} />
          <group position={[0.0, 0.26, -0.02]}>{Array.from({ length: 8 }, (_, i) => <mesh key={i} rotation={[0.5 * Math.cos(i * 0.8), i * 0.8, 0.5 * Math.sin(i * 0.8)]} position={[0.03 * Math.cos(i * 0.8), 0.01 * i, 0.03 * Math.sin(i * 0.8)]} scale={[0.1 - i * 0.005, 0.035, 0.08]} geometry={hojaGeo} castShadow><meshStandardMaterial color={i % 2 ? "#7ab84a" : "#5f9a36"} roughness={0.6} side={THREE.DoubleSide} /></mesh>)}</group>
        </group></group>
    </group>
    <Sombra p={[x, 0, 0]} r={0.42} />
  </Estudio>;
}}</Stage>;

// ── 27 · EL TIANGUIS EN MINIATURA (21:30): seis puestos con su mercancía y lona con flecos; la canasta brinca de puesto en puesto y cada toldo se enciende
const TOLDO = ["#c0392b", "#d4ac0d", "#28b463", "#af7ac5", "#2e86c1", "#e67e22"];
const Mercancia: React.FC<{ i: number }> = ({ i }) => {
  if (i === 0) return <>{Array.from({ length: 9 }, (_, q) => <Jito key={q} p={[(q % 3 - 1) * 0.09, 0.34 + Math.floor(q / 3) * 0.05, (Math.floor(q / 3) - 1) * 0.04]} s={0.05} />)}</>;
  if (i === 1) return <>{[0, 1, 2].map((q) => <Platano key={q} p={[(q - 1) * 0.1, 0.34, 0]} rot={[0, P2, 0]} s={0.45} />)}</>;
  if (i === 2) return <>{Array.from({ length: 6 }, (_, q) => <mesh key={q} position={[(q % 3 - 1) * 0.1, 0.33 + Math.floor(q / 3) * 0.04, 0]} rotation={[0, 0, P2]} scale={[0.03, 0.08, 0.03]}><capsuleGeometry args={[1, 1, 6, 10]} /><meshStandardMaterial color="#3f6a24" /></mesh>)}</>;
  if (i === 3) return <>{Array.from({ length: 7 }, (_, q) => <group key={q} position={[(q % 4 - 1.5) * 0.08, 0.34, (Math.floor(q / 4) - 0.5) * 0.08]}><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.004, 0.004, 0.12, 4]} /><meshStandardMaterial color="#4f8a3a" /></mesh><mesh position={[0, 0.13, 0]} scale={0.03} geometry={esfGeo}><meshStandardMaterial color={q % 2 ? "#c890e0" : "#f4d0f0"} /></mesh></group>)}</>;
  if (i === 4) return <>{Array.from({ length: 8 }, (_, q) => <mesh key={q} position={[(q % 4 - 1.5) * 0.08, 0.34, (Math.floor(q / 4) - 0.5) * 0.08]} scale={[0.045, 0.035, 0.04]} geometry={esfGeo}><meshStandardMaterial color="#b88a5a" roughness={0.9} /></mesh>)}</>;
  return <>{Array.from({ length: 8 }, (_, q) => <mesh key={q} position={[(q % 4 - 1.5) * 0.08, 0.35 + Math.floor(q / 4) * 0.05, 0]} scale={0.045} geometry={esfGeo}><meshPhysicalMaterial color="#f08a1a" clearcoat={0.5} roughness={0.4} /></mesh>)}</>;
};
const H27Resumen: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const D = dur(h), s = cl((tt - 0.4) / (D - 1.4)) * 5, i0 = Math.floor(s), f = s - i0;
  const sp = (i: number): V3 => { const ang = P * 1.1 - (i / 5) * P * 1.2; return [Math.cos(ang) * 1.05, 0, Math.sin(ang) * -0.55 + 0.05]; };
  const a = sp(i0), b = sp(Math.min(5, i0 + 1));
  return <Estudio t={tt} cam={[0, 1.75, 2.4]} look={[0, 0.3, -0.1]} orbit={0.1}>
    {TOLDO.map((c, i) => { const q = sp(i), k = Math.max(0.001, phys(tt, 0.05 + i * 0.08, 6, 0.5)), land = i <= s ? phys(tt, 0.4 + (i / 5) * (D - 1.4), 8, 0.35) : 0, on = i <= s;
      return <group key={i} position={[q[0], 0, q[2] - 0.25]} rotation={[0, -q[0] * 0.35, 0]} scale={k * (1 + 0.08 * Math.sin(cl(land) * P))}>
        <RBox p={[0, 0.15, 0]} s={[0.42, 0.3, 0.28]} r={0.02}>{M.madera("#8a6a40")}</RBox>
        {[-1, 1].map((x) => [-1, 1].map((z) => <mesh key={x + "" + z} position={[x * 0.21, 0.33, z * 0.14]}><cylinderGeometry args={[0.008, 0.008, 0.66, 6]} />{M.madera()}</mesh>))}
        <mesh position={[0, 0.67, 0]} rotation={[0.25, 0, 0]}><boxGeometry args={[0.52, 0.012, 0.42]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={on ? 0.45 : 0} roughness={0.8} /></mesh>
        {Array.from({ length: 9 }, (_, q) => <mesh key={q} position={[-0.24 + q * 0.06, 0.6, 0.21]} rotation={[0.25, 0, 0]}><coneGeometry args={[0.02, 0.06, 4]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={on ? 0.3 : 0} /></mesh>)}
        <Mercancia i={i} />
        {on && <pointLight position={[0, 0.55, 0.2]} intensity={0.01 + 0.9 * cl(land)} distance={0.9} color="#ffd59a" />}</group>; })}
    <group position={[lerp(a[0], b[0], f), Math.sin(f * P) * 0.35, lerp(a[2], b[2], f) + 0.12]} scale={1.15}>
      <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.15, 0.11, 0.18, 20, 1, true]} /><Yute /></mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.11, 20]} /><Yute /></mesh>
      <mesh position={[0, 0.2, 0]}><torusGeometry args={[0.12, 0.014, 6, 16, P]} /><Yute /></mesh>
      <Jito p={[0.03, 0.2, 0]} s={0.05} /></group>
    <Sombra p={[lerp(a[0], b[0], f), 0, lerp(a[2], b[2], f) + 0.12]} r={0.2} o={1 - 0.5 * Math.sin(f * P)} />
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  cuenta: H1Cuenta, doscientos: H2Doscientos, cambio: H3Cambio, lista: H4Lista, tortilleria: H5Tortilleria, granel: H6Granel, hueso: H7Hueso, quelites: H8Quelites,
  bolsita: H9Bolsita, naranjas: H10Naranjas, banca: H11Banca, remate: H12Remate, platano: H13Platano, suma: H14Suma, semana: H15Semana, cuchillo: H16Cuchillo,
  vaso: H17Vaso, frio: H18Frio, papa: H19Papa, sal: H20Sal, fonda: H21Fonda, bomba: H22Bomba, pasos: H23Pasos, proteina: H24Proteina, basura: H25Basura,
  carrito: H26Carrito, resumen: H27Resumen,
};
