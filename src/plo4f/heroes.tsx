// plo4f v2 (tras EVAL r1) · EL 92% PONE MAL LA CINTA DE TEFLÓN · componentes únicos 3D (ninguno repite mecanismo de plo29a-e ni de plo4a/b/c/e/h).
// Lecciones de las vueltas anteriores aplicadas desde el arranque: cámara fija, cercana y con margen (nada cortado por el borde), CERO rótulos,
// todo ENTRA a partir de tt=0.3 (nunca entero en el primer cuadro), sombra de contacto, objeto protagonista grande, momento clave antes de tt≈4.
// Protagonista: la ROSCA de bronce con sus hilos en espiral y la CINTA blanca que se enrolla a favor (verde) o al revés (rojo).
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
const AMBAR = "#f2a93b", ROSA = "#f2a6b8", AMAR = "#f2d23a", PVC = "#ecebe4";
const GLOW = (c: string, o = 1) => <meshBasicMaterial color={c} transparent opacity={o} toneMapped={false} depthWrite={false} />;
const BRONCE = (c = "#c49a4a") => <meshStandardMaterial color={c} metalness={0.85} roughness={0.28} />;
const PVCM = () => <meshPhysicalMaterial color={PVC} roughness={0.35} clearcoat={0.4} />;
// v2: nunca diminuto — entra desde el 60% de su tamaño y crece suave durante ~1 s (el r1 «aparecía de golpe»)
const S0 = (tt: number, a = 0.3) => lerp(0.6, 1, eio(tt, a - 0.3, a + 0.8)) * (tt < a - 0.35 ? 0.0001 : 1);
// ---------- escenografía: la mesa de trabajo del cuarto de servicio ----------
const madera = () => ctex("p4f:mesa", 512, 512, (g) => { g.fillStyle = "#7a5434"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(${60 + rn(i, 1) * 40},${36 + rn(i, 2) * 20},${20},0.35)`; g.lineWidth = 1 + rn(i, 3) * 3; g.beginPath(); const y = rn(i, 4) * 512; g.moveTo(0, y); g.bezierCurveTo(170, y + 10 * Math.sin(i), 340, y - 12, 512, y + 6); g.stroke(); }
  for (let i = 0; i < 6; i++) { g.fillStyle = "rgba(40,24,12,0.35)"; g.beginPath(); g.ellipse(rn(i, 5) * 512, rn(i, 6) * 512, 14, 6, 0, 0, 2 * P); g.fill(); } });
const Mesa: React.FC<{ y?: number }> = ({ y = 0 }) => <mesh position={[0, y, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[5, 3]} /><meshStandardMaterial map={madera()} roughness={0.8} /></mesh>;
const Fondo: React.FC<{ z?: number; c?: string }> = ({ z = -0.9, c = "#151a20" }) => <mesh position={[0, 0.4, z]}><planeGeometry args={[7, 5]} /><meshBasicMaterial color={c} toneMapped={false} /></mesh>;
const sombraTex = () => ctex("p4f:sombra", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(0,0,0,0.8)"); gr.addColorStop(0.45, "rgba(0,0,0,0.4)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const Sombra: React.FC<{ p: V3; r: number; o?: number; sx?: number }> = ({ p, r, o = 0.7, sx = 1 }) =>
  <mesh position={p} rotation={[-P2, 0, 0]} scale={[sx, 1, 1]} renderOrder={2}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={sombraTex()} transparent opacity={o} depthWrite={false} toneMapped={false} /></mesh>;
const halo = () => ctex("p4f:halo", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(255,248,220,0.95)"); gr.addColorStop(0.3, "rgba(255,240,200,0.35)"); gr.addColorStop(1, "rgba(255,240,200,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const Halo: React.FC<{ p: V3; r: number; c?: string; o?: number }> = ({ p, r, c = "#fff3c0", o = 1 }) => r <= 0.001 || o <= 0.01 ? null :
  <mesh position={p} renderOrder={5}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={halo()} color={c} transparent opacity={o} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} /></mesh>;
const Caño: React.FC<{ a: V3; b: V3; r?: number; mat?: React.ReactNode }> = ({ a, b, r = 0.03, mat }) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = Math.max(0.001, d.length());
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()), m = A.clone().add(B).multiplyScalar(0.5);
  return <mesh position={[m.x, m.y, m.z]} quaternion={q}><cylinderGeometry args={[r, r, L, 24]} />{mat ?? BRONCE()}</mesh>;
};
const Anillo: React.FC<{ p: V3; r: number; o: number; c?: string; rot?: V3 }> = ({ p, r, o, c = "#ffffff", rot = [-P2, 0, 0] }) => o <= 0.01 ? null :
  <mesh position={p} rotation={rot} scale={r}><ringGeometry args={[0.84, 1, 44]} /><meshBasicMaterial color={c} transparent opacity={o} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>;
const Gota: React.FC<{ p: V3; s?: number; c?: string }> = ({ p, s = 0.02, c = "#9fd4f4" }) => <group position={p} scale={s}>
  <mesh><sphereGeometry args={[1, 16, 12]} />{AGUA(0.92, c)}</mesh><mesh position={[0, 1.1, 0]}><coneGeometry args={[0.7, 1.3, 16]} />{AGUA(0.92, c)}</mesh>
  <mesh position={[-0.3, 0.3, 0.75]} scale={0.25}><sphereGeometry args={[1, 8, 6]} />{GLOW("#ffffff", 0.9)}</mesh></group>;
// ---------- la rosca: helicoide (los hilos) sobre un cuerpo de bronce; eje Y, la punta arriba ----------
class Helice extends THREE.Curve<THREE.Vector3> {
  constructor(private R: number, private L: number, private n: number) { super(); }
  getPoint(u: number, o = new THREE.Vector3()) { const a = u * this.n * 2 * P; return o.set(Math.cos(a) * this.R, u * this.L, Math.sin(a) * this.R); }
}
const hiloGeo = (R: number, L: number, n: number, r: number) => memo(`p4f:hel${R}:${L}:${n}:${r}`, () => new THREE.TubeGeometry(new Helice(R, L, n), Math.round(n * 40), r, 8, false));
// Rosca: L largo, R radio; «roto» marca un hilo aplastado en rojo; «brillo» el primer hilo libre en verde
const Rosca: React.FC<{ p?: V3; rot?: V3; s?: number; L?: number; R?: number; n?: number; roto?: number; libre?: number; plastico?: boolean }> = ({ p, rot, s = 1, L = 0.34, R = 0.1, n = 9, roto = 0, libre = 0, plastico }) => {
  const mat = plastico ? PVCM() : BRONCE();
  return <group position={p} rotation={rot} scale={s}>
    <mesh position={[0, L / 2, 0]}><cylinderGeometry args={[R * 0.86, R * 0.86, L, 40]} />{mat}</mesh>
    <mesh><primitive object={hiloGeo(R * 0.9, L - 0.02, n, R * 0.13)} attach="geometry" />{mat}</mesh>
    <mesh position={[0, L + 0.003, 0]}><cylinderGeometry args={[R * 0.7, R * 0.86, 0.01, 40]} />{mat}</mesh>
    <mesh position={[0, L, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[R * 0.55, R * 0.7, 40]} /><meshStandardMaterial color="#2a2018" side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, -0.06, 0]}><cylinderGeometry args={[R * 1.45, R * 1.45, 0.12, 6]} />{mat}</mesh>
    {roto > 0.01 && <mesh position={[R * 0.95, L * 0.55, 0]}><boxGeometry args={[0.03, 0.025, R * 0.9]} />{GLOW(RED, roto)}</mesh>}
    {libre > 0.01 && <mesh position={[0, L - 0.03, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[R * 0.95, 0.008, 8, 40]} />{GLOW(VER, libre)}</mesh>}
  </group>;
};
// Cinta enrollada: bandas abiertas que se suman de la base o del 2º hilo; «floja» la separa del hilo (venda); «tensa» la vuelve translúcida (se ven los hilos)
const Cinta: React.FC<{ R?: number; L?: number; k: number; desde?: number; floja?: number; tensa?: number; vueltas?: number; c?: string; arruga?: number }> = ({ R = 0.1, L = 0.34, k, desde = 0.06, floja = 0, tensa = 0.6, vueltas = 7, c = "#f6f5f0", arruga = 0 }) => {
  const N = Math.max(1, Math.round(vueltas)), top = L - desde, h = top / N * 1.6, nk = Math.ceil(k * N);
  return <>{Array.from({ length: nk }, (_, i) => { const y = top - (i + 0.5) * top / N, last = i === nk - 1 ? (k * N - (nk - 1)) : 1;
    const rr = R * (1.0 + 0.02 * i / N + 0.35 * floja * (0.6 + 0.4 * Math.sin(i * 2.1))) + 0.004, wob = arruga * 0.04 * Math.sin(i * 3.3);
    return <mesh key={i} position={[wob, y + arruga * 0.02 * Math.sin(i * 1.7), 0]} rotation={[arruga * 0.4 * Math.sin(i * 2.7), 0, arruga * 0.3 * Math.cos(i * 1.9)]}>
      <cylinderGeometry args={[rr, rr, h, 40, 1, true, 0, 2 * P * cl(last) + 0.001]} />
      <meshPhysicalMaterial color={c} roughness={0.55} transparent opacity={lerp(0.96, 0.62, tensa)} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>; })}</>;
};
const Rollo: React.FC<{ p: V3; s?: number; rot?: V3; c?: string; giro?: number }> = ({ p, s = 1, rot, c = "#f6f5f0", giro = 0 }) => <group position={p} scale={s} rotation={rot}>
  <group rotation={[0, giro, 0]}>
    <mesh><cylinderGeometry args={[0.07, 0.07, 0.035, 40, 1, true]} /><meshStandardMaterial color={c} roughness={0.6} side={THREE.DoubleSide} /></mesh>
    {[1, -1].map((sd) => <mesh key={sd} position={[0, sd * 0.0176, 0]} rotation={[sd * -P2, 0, 0]}><ringGeometry args={[0.035, 0.07, 40]} /><meshStandardMaterial color={col(c, "#d8d6cc", 0.3)} roughness={0.7} side={THREE.DoubleSide} /></mesh>)}
    <mesh><cylinderGeometry args={[0.035, 0.035, 0.036, 32, 1, true]} /><meshStandardMaterial color="#e3dccb" side={THREE.DoubleSide} /></mesh>
  </group></group>;
// flecha curva (sentido de giro) alrededor del eje Y: dir 1 = agujas del reloj mirando la punta desde arriba
const FlechaGiro: React.FC<{ p: V3; r: number; dir?: number; c?: string; o?: number; rot?: V3; k?: number }> = ({ p, r, dir = 1, c = VER, o = 1, rot = [0, 0, 0], k = 1 }) => o <= 0.01 ? null : <group position={p} rotation={rot}>
  <group rotation={[P2, 0, 0]} scale={[dir, 1, 1]}>
    <mesh><torusGeometry args={[r, r * 0.07, 8, 40, P * 1.4 * cl(k) + 0.01]} />{GLOW(c, o)}</mesh>
    <mesh position={[Math.cos(P * 1.4 * cl(k)) * r, Math.sin(P * 1.4 * cl(k)) * r, 0]} rotation={[0, 0, P * 1.4 * cl(k)]}><coneGeometry args={[r * 0.2, r * 0.36, 12]} />{GLOW(c, o)}</mesh>
  </group></group>;
// hembra: cople hexagonal con hueco
const Hembra: React.FC<{ p: V3; rot?: V3; s?: number; R?: number; plastico?: boolean; raja?: number }> = ({ p, rot, s = 1, R = 0.1, plastico, raja = 0 }) => <group position={p} rotation={rot} scale={s}>
  <mesh><cylinderGeometry args={[R * 1.6, R * 1.6, 0.2, 6, 1, true]} />{plastico ? PVCM() : BRONCE("#b8893e")}</mesh>
  {[1, -1].map((sd) => <mesh key={sd} position={[0, sd * 0.1, 0]} rotation={[sd * -P2, 0, 0]}><ringGeometry args={[R * 1.02, R * 1.6, 6]} />{plastico ? PVCM() : BRONCE("#b8893e")}</mesh>)}
  <mesh><cylinderGeometry args={[R * 1.02, R * 1.02, 0.2, 32, 1, true]} /><meshStandardMaterial color="#3a2e20" side={THREE.BackSide} /></mesh>
  {raja > 0.01 && <mesh position={[R * 1.45, 0.1 - 0.1 * raja, R * 0.5]} rotation={[0, P / 6, 0.15]}><boxGeometry args={[0.016, 0.2 * raja, 0.022]} />{GLOW("#2a0a06", 1)}</mesh>}
  {raja > 0.01 && <mesh position={[R * 1.47, 0.1 - 0.1 * raja, R * 0.5]} rotation={[0, P / 6, 0.15]}><boxGeometry args={[0.028, 0.2 * raja + 0.01, 0.012]} />{GLOW(RED, 0.6 * raja)}</mesh>}
</group>;
// llave grande (v2: el r1 «parecía un clavito»): mango grueso con empuñadura roja, cabeza que abraza la pieza
const Llave: React.FC<{ p: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <RBox s={[0.62, 0.1, 0.05]} r={0.02} p={[0.42, 0, 0]}>{M.cromo("#b4bac0")}</RBox>
  <RBox s={[0.3, 0.12, 0.065]} r={0.03} p={[0.6, 0, 0]}><meshStandardMaterial color="#c0392b" roughness={0.5} /></RBox>
  <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.05, 40, 1, false, P * 0.55, P * 0.9]} />{M.cromo("#b4bac0")}</mesh>
  <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.05, 40, 1, false, P * 1.55, P * 0.9]} />{M.cromo("#b4bac0")}</mesh></group>;
const Papel: React.FC<{ p: V3; rot?: V3; moja?: number; s?: number }> = ({ p, rot, moja = 0, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh><planeGeometry args={[0.24, 0.3, 8, 8]} /><meshStandardMaterial map={ctex("p4f:papel", 256, 320, (g) => { g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, 256, 320); g.strokeStyle = "rgba(0,0,0,0.05)"; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(rn(i, 1) * 256, rn(i, 2) * 320, 12, 0, 2 * P); g.stroke(); } })} roughness={0.95} side={THREE.DoubleSide} /></mesh>
  {moja > 0.01 && <mesh position={[0, 0.02, 0.002]} scale={[moja, moja * 1.2, 1]}><circleGeometry args={[0.11, 32]} /><meshBasicMaterial color="#2f6fb8" transparent opacity={0.85} depthWrite={false} /></mesh>}
</group>;
const Cruz: React.FC<{ p: V3; s: number; k: number; c?: string; rot?: V3 }> = ({ p, s, k, c = RED, rot = [0, 0, 0] }) => k <= 0.01 ? null : <group position={p} rotation={rot}>
  {[1, -1].map((sd) => <mesh key={sd} rotation={[0, 0, sd * P / 4]} scale={[k, 1, 1]}><boxGeometry args={[s, s * 0.14, 0.01]} />{GLOW(c, 0.92)}</mesh>)}</group>;

// 1 · DOS UNIONES, UNA DIFERENCIA: dos niples iguales con su cople; la cinta de la izquierda va al revés (flecha roja) y gotea; la derecha a favor (verde), seca
const HDos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#14110e">{(tt) => {
  const fl = eio(tt, 1.0, 1.6), gota = (tt * 0.8) % 1, on = eio(tt, 2.0, 2.4);
  return <Estudio t={tt} cam={[0.0, 0.42, 1.55]} look={[0, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#17130f" />
    <Mesa />
    {[-0.36, 0.36].map((x, i) => <group key={i} position={[x, 0.12, 0]} scale={S0(tt, 0.3 + i * 0.12)}>
      <Rosca L={0.3} />
      <Cinta k={1} vueltas={5} arruga={i === 0 ? 0.8 : 0} tensa={i === 0 ? 0.2 : 0.7} />
      <Hembra p={[0, 0.34, 0]} />
      <FlechaGiro p={[0, 0.5, 0]} r={0.13} dir={i === 0 ? -1 : 1} c={i === 0 ? RED : VER} o={fl} k={fl} />
      {i === 0 && tt > 1.6 && <Gota p={[0.1, 0.18 - gota * 0.25, 0.1]} s={0.022} />}
      {i === 0 && <Anillo p={[0.1, -0.115, 0.1]} r={0.05 + 0.06 * gota} o={tt > 1.6 ? 0.7 * (1 - gota) : 0} />}
      <Halo p={[0, 0.3, 0.2]} r={0.32 * on} c={i === 0 ? RED : VER} o={0.35} />
    </group>)}
    <Sombra p={[-0.36, 0.003, 0]} r={0.25} /><Sombra p={[0.36, 0.003, 0]} r={0.25} />
  </Estudio>;
}}</Stage>;

// 2 · DE CADA CIEN: cien coples en una cuadrícula sobre la mesa; caen de a filas y 92 se encienden rojos uno tras otro, quedan 8 verdes
const HNoventa: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#14110e">{(tt) => {
  const rojo = cl((tt - 1.3) / 2.2) * 92, orden = (i: number) => Math.floor(rn(i, 7) * 1000);
  const idx = memo("p4f:orden", () => Array.from({ length: 100 }, (_, i) => i).sort((a, b) => orden(a) - orden(b)));
  const rank = memo("p4f:rank", () => { const r: number[] = []; idx.forEach((v, j) => { r[v] = j; }); return r; });
  return <Estudio t={tt} cam={[0.0, 1.35, 1.25]} look={[0, 0, 0.05]} orbit={0.01} mesa={false} fit={false}>
    <Mesa />
    {Array.from({ length: 100 }, (_, i) => { const r = Math.floor(i / 10), c = i % 10, d = cl(IN(tt, 0.3 + r * 0.07)), red = rank[i] < rojo ? cl(rojo - rank[i]) : 0;
      return <group key={i} position={[-0.63 + c * 0.14, lerp(0.6, 0.035, d), -0.55 + r * 0.12]}>
        <mesh><cylinderGeometry args={[0.045, 0.045, 0.07, 6]} /><meshStandardMaterial color={col("#c49a4a", rank[i] < 92 ? "#d6362c" : "#3cc46a", rank[i] < 92 ? red : eio(tt, 3.5, 3.9))} metalness={0.6} roughness={0.35} emissive={col("#000000", rank[i] < 92 ? "#5a0a06" : "#0a5a20", rank[i] < 92 ? red : eio(tt, 3.5, 3.9))} /></mesh>
        <mesh position={[0, 0.036, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.028, 20]} /><meshBasicMaterial color="#2a2018" /></mesh>
      </group>; })}
    <Halo p={[0, 0.2, 0.2]} r={0.9 * eio(tt, 3.5, 4.0)} c={RED} o={0.18} />
  </Estudio>;
}}</Stage>;

// 3 · EL CAMINITO EN ESPIRAL: macho y hembra en corte, uno dentro del otro; entre los hilos queda un hueco en espiral por donde viaja el agua (puntos azules);
// la cinta entra en el hueco y lo rellena: los puntos se frenan
const HEspiral: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#10161e">{(tt) => {
  const llena = eio(tt, 2.2, 3.4), cp = memo("p4f:esp", () => new Helice(0.115, 0.42, 6));
  return <Estudio t={tt} cam={[0.55, 0.5, 1.25]} look={[0, 0.22, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Mesa />
    <group position={[0, 0.06, 0]} scale={S0(tt)}>
      <Rosca L={0.44} R={0.11} n={6} />
      <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.2, 0.2, 0.44, 40, 1, true, P * 0.5, P * 1.5]} /><meshStandardMaterial color="#b8893e" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} /></mesh>
      {[0, 1].map((sd) => <mesh key={sd} position={[0, 0.22, 0]} rotation={[0, P * 0.5 + sd * P * 1.5, 0]}><planeGeometry args={[0.001, 0.44]} /></mesh>)}
      <mesh position={[0, 0.22, 0]} rotation={[0, P * 0.5, 0]}><boxGeometry args={[0.001, 0.44, 0.0]} /></mesh>
      {Array.from({ length: 2 }, (_, sd) => <mesh key={"c" + sd} position={[sd ? 0 : 0, 0.22, sd ? -0.155 : 0]} rotation={[0, sd ? 0 : P2, 0]}><planeGeometry args={[0.09, 0.44]} /><meshStandardMaterial color="#8a6430" metalness={0.5} roughness={0.5} side={THREE.DoubleSide} /></mesh>)}
      {llena > 0.01 && <mesh><primitive object={hiloGeo(0.118, 0.42, 6, 0.012 * llena + 0.001)} attach="geometry" /><meshPhysicalMaterial color="#f6f5f0" roughness={0.6} /></mesh>}
      {Array.from({ length: 26 }, (_, i) => { const u = ((tt * 0.16 * (1 - llena * 0.95)) + i / 26) % 1, v = cp.getPoint(u); const a = Math.atan2(v.z, v.x); const vis = !(a > P * 0.5 - P && a < 0) ;
        return vis && <mesh key={i} position={[v.x * 1.04, v.y + 0.02, v.z * 1.04]} scale={0.011}><sphereGeometry args={[1, 8, 6]} />{GLOW("#5fb0ff", 0.95 * (1 - llena * 0.8))}</mesh>; })}
      <Halo p={[0.12, 0.3, 0.12]} r={0.25 * (1 - llena)} c="#5fb0ff" o={0.4 * eio(tt, 0.8, 1.2)} />
      <Halo p={[0.12, 0.3, 0.12]} r={0.25 * llena} c={VER} o={0.4} />
    </group>
    <Sombra p={[0, 0.003, 0]} r={0.3} />
  </Estudio>;
}}</Stage>;

// 4 · LUBRICA, ENTRA MÁS HONDO: dos niples iguales; cada cople baja girando con el mismo número de vueltas; el de la cinta baja más (regla de profundidad al lado)
const HHondo: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#14110e">{(tt) => {
  const g = eio(tt, 0.9, 3.0);
  return <Estudio t={tt} cam={[0.0, 0.42, 1.5]} look={[0, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#17130f" />
    <Mesa />
    {[-0.33, 0.33].map((x, i) => { const baja = g * (i ? 0.2 : 0.11); return <group key={i} position={[x, 0.12, 0]} scale={S0(tt, 0.3 + i * 0.1)}>
      <Rosca L={0.32} />
      {i === 1 && <Cinta k={1} vueltas={4} tensa={0.8} />}
      <Hembra p={[0, 0.42 - baja, 0]} rot={[0, g * 6 * P, 0]} />
      <mesh position={[0.24, 0.2, 0]}><boxGeometry args={[0.02, 0.4, 0.01]} /><meshBasicMaterial color="#f2c230" toneMapped={false} /></mesh>
      {Array.from({ length: 9 }, (_, j) => <mesh key={j} position={[0.225, 0.02 + j * 0.045, 0.006]}><boxGeometry args={[0.02, 0.004, 0.002]} /><meshBasicMaterial color="#1a1a1a" /></mesh>)}
      <mesh position={[0.21, 0.32 - baja, 0.01]}><boxGeometry args={[0.06, 0.008, 0.01]} />{GLOW(i ? VER : AMBAR)}</mesh>
      <Halo p={[0.22, 0.32 - baja, 0.05]} r={0.1 * eio(tt, 3.0, 3.4)} c={i ? VER : AMBAR} o={0.7} />
    </group>; })}
    <Sombra p={[-0.33, 0.003, 0]} r={0.25} /><Sombra p={[0.33, 0.003, 0]} r={0.25} />
  </Estudio>;
}}</Stage>;

// 5 · NO COMO UNA VENDA: la misma rosca dos veces; a la izquierda la cinta floja, abultada como venda (la cámara se acerca: no toca los hilos);
// a la derecha la cinta se hunde en los hilos y se ve la espiral a través
const HVenda: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false} tone="#10161e">{(tt) => {
  const k = eio(tt, 0.5, 1.8), asienta = eio(tt, 2.2, 3.4);
  return <Estudio t={tt} cam={[0.0, 0.4, 1.35]} look={[0, 0.26, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Mesa />
    {[-0.3, 0.3].map((x, i) => <group key={i} position={[x, 0.12, 0]} rotation={[0, tt * 0.4, 0]} scale={S0(tt, 0.3 + i * 0.1)}>
      <Rosca L={0.34} R={0.11} />
      <Cinta R={0.11} k={k} vueltas={6} floja={i === 0 ? 1.3 : 1.0 * (1 - asienta)} tensa={i === 0 ? 0.0 : asienta} c={i === 0 ? "#e9e3d2" : "#f6f5f0"} arruga={i === 0 ? 0.35 : 0} />
      {i === 0 && Array.from({ length: 8 }, (_, j) => <mesh key={j} position={[Math.cos(j * 0.8) * 0.17, 0.08 + j * 0.03, Math.sin(j * 0.8) * 0.17]} rotation={[j, j * 0.7, 0.6]} scale={[0.03, 0.002, 0.012]}><boxGeometry /><meshStandardMaterial color="#e9e3d2" /></mesh>)}
    </group>)}
    <Halo p={[-0.3, 0.3, 0.2]} r={0.3 * eio(tt, 2.0, 2.4)} c={RED} o={0.35} />
    <Halo p={[0.3, 0.3, 0.2]} r={0.3 * asienta} c={VER} o={0.35} />
    <Sombra p={[-0.3, 0.003, 0]} r={0.25} /><Sombra p={[0.3, 0.003, 0]} r={0.25} />
  </Estudio>;
}}</Stage>;

// 6 · ROSCA LIMPIA: rosca vieja con cinta deshilachada y sarro; un cepillo de alambre va y viene, los hilachos salen volando; un trapo la pasa y queda brillante
const HLimpia: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#14110e">{(tt) => {
  const cep = eio(tt, 0.6, 2.4), trapo = eio(tt, 2.4, 3.4), brillo = eio(tt, 3.2, 3.8), x = Math.sin(tt * 14) * 0.08 * (cep > 0 && cep < 1 ? 1 : 0);
  return <Estudio t={tt} cam={[0.1, 0.4, 1.25]} look={[0, 0.26, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#17130f" />
    <Mesa />
    <group position={[-0.05, 0.12, 0]} scale={S0(tt)}>
      <Rosca L={0.34} R={0.11} />
      {cep < 0.95 && <Cinta R={0.11} k={1 - cep * 0.9} vueltas={6} floja={0.5} tensa={0} c="#d9d2bf" arruga={0.6} />}
      {cep < 0.9 && Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[Math.cos(i) * 0.118, 0.04 + rn(i, 1) * 0.28, Math.sin(i) * 0.118]} scale={0.008 + 0.006 * rn(i, 2)}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#e8e0c8" /></mesh>)}
      <Halo p={[0, 0.2, 0.15]} r={0.3 * brillo} c="#fff1c0" o={0.6} />
    </group>
    {cep > 0.01 && cep < 1 && <group position={[0.15 + x, 0.3, 0.12]} rotation={[0, 0, P2]}>
      <RBox s={[0.06, 0.32, 0.05]} r={0.01} p={[0, -0.12, 0]}>{M.madera("#8a5a32")}</RBox>
      {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[0.035, -0.02 - (i % 8) * 0.012, -0.015 + Math.floor(i / 8) * 0.015]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.0015, 0.0015, 0.04, 4]} />{M.cromo()}</mesh>)}
    </group>}
    {cep > 0.05 && cep < 1 && Array.from({ length: 10 }, (_, i) => { const q = ((tt * 1.3) + i / 10) % 1; return <mesh key={"v" + i} position={[0.12 + q * 0.4, 0.3 + q * 0.25 - q * q * 0.5, 0.1 + rn(i, 3) * 0.1]} rotation={[q * 6, i, q * 4]} scale={[0.02, 0.003, 0.008]}><boxGeometry /><meshStandardMaterial color="#efe9d8" /></mesh>; })}
    {trapo > 0.01 && trapo < 1 && <mesh position={[-0.05 + Math.sin(tt * 9) * 0.04, 0.28, 0.13]} rotation={[0.2, 0.3, 0.4]} scale={[1, 1, 0.3]}><sphereGeometry args={[0.09, 14, 10]} /><meshStandardMaterial color="#c9452e" roughness={0.95} /></mesh>}
    <Sombra p={[-0.05, 0.003, 0]} r={0.25} />
  </Estudio>;
}}</Stage>;

// 7 · MIRA LOS HILOS DE CERCA: la rosca gira lenta; una lupa grande pasa por los hilos y en el aumento aparece un hilo aplastado que se enciende rojo
const HLupa: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#10161e">{(tt) => {
  const lx = lerp(-0.2, 0.08, eio(tt, 0.6, 2.2)), roto = eio(tt, 2.2, 2.6);
  return <Estudio t={tt} cam={[0.05, 0.36, 1.15]} look={[0, 0.26, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Mesa />
    <group position={[-0.08, 0.12, 0]} rotation={[0, -0.5 + 0.3 * eio(tt, 0.3, 2.2), 0]} scale={S0(tt)}><Rosca L={0.34} R={0.11} roto={roto} /></group>
    {/* v2: dentro del lente, un trozo de la misma rosca AUMENTADO ×2.4 con el hilo aplastado en rojo */}
    <group position={[lx, 0.3, 0.215]} scale={S0(tt, 0.5)}>
      <group rotation={[0, 0, -P2]} position={[-0.09, 0, 0]} scale={2.4}><Rosca L={0.075} R={0.035} n={3} roto={roto} /></group>
    </group>
    <group position={[lx, 0.3, 0.2]} scale={S0(tt, 0.5)}>
      <mesh><torusGeometry args={[0.11, 0.014, 12, 48]} /><meshStandardMaterial color="#1f1f1f" roughness={0.4} /></mesh>
      <mesh><circleGeometry args={[0.105, 40]} /><meshPhysicalMaterial color="#e3f1f5" transmission={0.9} thickness={0.05} roughness={0.0} transparent opacity={0.3} /></mesh>
      <mesh position={[0.12, -0.12, 0]} rotation={[0, 0, P / 4]}><cylinderGeometry args={[0.016, 0.02, 0.16, 16]} />{M.madera("#6b4a2e")}</mesh>
    </group>
    <Halo p={[0.03, 0.31, 0.15]} r={0.18 * roto} c={RED} o={0.8} />
    <Sombra p={[-0.08, 0.003, 0]} r={0.25} />
  </Estudio>;
}}</Stage>;

// 8 · A FAVOR DE LAS AGUJAS: la rosca de frente con la punta hacia la cámara, delante de un reloj de pared; el rollo da vueltas en el sentido de las agujas y la cinta crece
const relojTex = () => ctex("p4f:reloj", 512, 512, (g) => { g.fillStyle = "#f4f1e8"; g.beginPath(); g.arc(256, 256, 250, 0, 2 * P); g.fill(); g.strokeStyle = "#1a1a1a"; g.lineWidth = 12; g.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * 2 * P; g.lineWidth = 10; g.beginPath(); g.moveTo(256 + Math.cos(a) * 200, 256 + Math.sin(a) * 200); g.lineTo(256 + Math.cos(a) * 235, 256 + Math.sin(a) * 235); g.stroke(); } });
const HReloj: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#10161e">{(tt) => {
  const w = eio(tt, 1.0, 3.6), a = -w * 4 * 2 * P;
  return <Estudio t={tt} cam={[0.0, 0.3, 1.3]} look={[0, 0.3, 0]} orbit={0.0} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <group position={[0, 0.3, -0.35]} scale={S0(tt)}>
      <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.42, 0.42, 0.04, 64]} /><meshStandardMaterial color="#2a2522" /></mesh>
      <mesh position={[0, 0, 0.021]}><circleGeometry args={[0.4, 64]} /><meshBasicMaterial map={relojTex()} toneMapped={false} /></mesh>
      <group position={[0, 0, 0.03]} rotation={[0, 0, a * 0.25]}><mesh position={[0, 0.15, 0]}><boxGeometry args={[0.02, 0.3, 0.006]} /><meshBasicMaterial color="#c0392b" /></mesh></group>
    </group>
    <group position={[0, 0.3, 0]} rotation={[P2, 0, 0]} scale={S0(tt, 0.4)}>
      <Rosca L={0.3} R={0.1} />
      <Cinta k={w} vueltas={5} tensa={0.7} />
      <group rotation={[0, a, 0]}><Rollo p={[0.2, 0.2, 0]} s={1.2} rot={[0, 0, 0]} giro={-a * 3} /><Caño a={[0.1, 0.2, 0]} b={[0.13, 0.2, 0]} r={0.017} mat={<meshStandardMaterial color="#f6f5f0" side={THREE.DoubleSide} />} /></group>
    </group>
    <FlechaGiro p={[0, 0.3, 0.12]} r={0.3} dir={-1} rot={[-P2, 0, 0]} c={VER} o={eio(tt, 0.8, 1.2)} k={w} />
  </Estudio>;
}}</Stage>;

// 9 · LA HEMBRA LA ARRUGA: cinta al revés; el cople baja girando y la cinta se va levantando, arrugada, y sale para afuera como un moño
const HArruga: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#14110e">{(tt) => {
  const g = eio(tt, 0.8, 3.2);
  return <Estudio t={tt} cam={[0.15, 0.42, 1.38]} look={[0, 0.3, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#17130f" />
    <Mesa />
    <group position={[0, 0.1, 0]} scale={S0(tt)}>
      <Rosca L={0.34} R={0.11} />
      <Cinta R={0.11} k={1 - 0.5 * g} vueltas={6} tensa={0.3} arruga={g} />
      <Hembra p={[0, 0.44 - 0.18 * g, 0]} rot={[0, g * 5 * P, 0]} R={0.11} />
      {/* v2: el moño es UNA tira gruesa que se levanta y se enrosca hacia afuera */}
      {g > 0.1 && Array.from({ length: 14 }, (_, i) => { const q = cl(g * 1.3 - 0.15), u = i / 13, a = u * P * 1.6 * q;
        return <mesh key={i} position={[0.12 + Math.sin(a) * 0.12 * q, 0.27 - 0.18 * g + (1 - Math.cos(a)) * 0.08 * q, 0.04]} rotation={[0, 0, -a]} scale={[0.026, 0.008, 0.07]}><boxGeometry /><meshStandardMaterial color="#f2f0e8" roughness={0.6} /></mesh>; })}
      <FlechaGiro p={[0, 0.58 - 0.2 * g, 0]} r={0.15} dir={1} c="#ffffff" o={0.6 * eio(tt, 0.6, 1.0)} k={g * 3} />
      <Halo p={[0.2, 0.25 - 0.2 * g, 0.1]} r={0.2 * eio(tt, 2.0, 2.6)} c={RED} o={0.8} />
    </group>
    <Sombra p={[0, 0.003, 0]} r={0.25} />
  </Estudio>;
}}</Stage>;

// 10 · LA REGLA DE LA MANO: una mano sostiene el rollo; el rollo gira para el mismo lado que la flecha de la pieza; las dos flechas se encienden verdes juntas
const Mano: React.FC<{ p: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <RBox s={[0.16, 0.2, 0.06]} r={0.03} p={[0, -0.12, 0]}><meshStandardMaterial color="#d9a587" roughness={0.6} /></RBox>
  {[-0.05, -0.017, 0.017, 0.05].map((x, i) => <group key={i} position={[x, -0.01, 0.02]} rotation={[-1.2, 0, 0]}><mesh position={[0, 0.04, 0]}><capsuleGeometry args={[0.016, 0.06, 6, 12]} /><meshStandardMaterial color="#d9a587" roughness={0.6} /></mesh></group>)}
  <group position={[0.09, -0.08, 0.03]} rotation={[0, 0, -0.8]}><mesh position={[0, 0.04, 0]}><capsuleGeometry args={[0.018, 0.06, 6, 12]} /><meshStandardMaterial color="#d9a587" roughness={0.6} /></mesh></group>
</group>;
const HMano: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#14110e">{(tt) => {
  const gir = eio(tt, 1.0, 3.4), sync = eio(tt, 2.4, 2.8);
  return <Estudio t={tt} cam={[0.0, 0.42, 1.45]} look={[0, 0.3, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#17130f" />
    <Mesa />
    <group position={[-0.32, 0.12, 0]} scale={S0(tt)}><Rosca L={0.3} rot={[0, -gir * 4 * P, 0]} /><group position={[0, 0.42, 0]} rotation={[0, -gir * 4 * P, 0]}><FlechaGiro p={[0, 0, 0]} r={0.17} dir={1} c={col("#ffffff", VER, sync)} o={0.95} k={1} /></group></group>
    <group position={[0.32, 0.32, 0.05]} scale={S0(tt, 0.45)}>
      <Rollo p={[0, 0.06, 0]} s={1.8} giro={-gir * 4 * P} />
      <Mano p={[0, 0, 0.06]} s={1.3} />
      <group position={[0, 0.06, 0]} rotation={[0, -gir * 4 * P, 0]}><FlechaGiro p={[0, 0, 0]} r={0.2} dir={1} c={col("#ffffff", VER, sync)} o={0.95} k={1} /></group>
    </group>
    <Halo p={[0, 0.5, 0.1]} r={0.5 * sync} c={VER} o={0.3} />
    <Sombra p={[-0.32, 0.003, 0]} r={0.22} />
  </Estudio>;
}}</Stage>;

// 11 · EL PRIMER HILO LIBRE: primer plano de la punta; el primer hilo se enciende verde y queda libre; la cinta arranca en el segundo y avanza hacia la base
const HHilo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#10161e">{(tt) => {
  const libre = eio(tt, 0.6, 1.0), k = eio(tt, 1.4, 3.6);
  return <Estudio t={tt} cam={[0.25, 0.48, 0.95]} look={[0, 0.3, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Mesa />
    <group position={[0, 0.1, 0]} scale={S0(tt)}>
      <Rosca L={0.36} R={0.12} libre={libre} />
      <Cinta R={0.12} L={0.36} desde={0.075} k={k} vueltas={6} tensa={0.7} />
      <Rollo p={[0.2, 0.36 - 0.075 - k * 0.27, 0.05]} s={1.1} rot={[0, 0, 0]} giro={-tt * 6} />
      <Halo p={[0, 0.34, 0.15]} r={0.2 * libre} c={VER} o={0.5} />
    </group>
    <Sombra p={[0, 0.003, 0]} r={0.26} />
  </Estudio>;
}}</Stage>;

// 12 · LOS PEDACITOS VIAJAN: tubo de vidrio que termina en un aireador; trocitos de cinta viajan con el agua y se atoran en la malla; el chorro se adelgaza
const HAireador: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#10161e">{(tt) => {
  const tapa = eio(tt, 0.8, 3.2), chorro = 1 - 0.8 * tapa;
  return <Estudio t={tt} cam={[0.12, 0.33, 1.02]} look={[0.12, 0.3, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <group scale={S0(tt)}>
      {[-0.03, -0.015, 0, 0.015, 0.03].map((d, j) => <group key={"m" + j}><mesh position={[0.32 + d, 0.242, 0]}><boxGeometry args={[0.003, 0.002, 0.09]} />{M.cromo()}</mesh><mesh position={[0.32, 0.242, d]}><boxGeometry args={[0.09, 0.002, 0.003]} />{M.cromo()}</mesh></group>)}
      <mesh position={[-0.2, 0.42, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.045, 0.045, 0.9, 32, 1, true]} /><meshPhysicalMaterial color="#e3f1f5" transparent opacity={0.3} roughness={0.03} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh position={[-0.2, 0.42, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.038, 0.038, 0.9, 24]} />{AGUA(0.5, "#4f9fd8")}</mesh>
      <Caño a={[0.25, 0.42, 0]} b={[0.32, 0.42, 0]} r={0.05} mat={M.cromo()} />
      <Caño a={[0.32, 0.42, 0]} b={[0.32, 0.3, 0]} r={0.05} mat={M.cromo()} />
      <mesh position={[0.32, 0.27, 0]}><cylinderGeometry args={[0.055, 0.055, 0.05, 32]} />{M.cromo()}</mesh>
      <mesh position={[0.32, 0.244, 0]} rotation={[P2, 0, 0]}><circleGeometry args={[0.045, 32]} /><meshStandardMaterial color={col("#9aa0a6", "#efe9d8", tapa)} roughness={0.6} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 10 }, (_, i) => { const q = ((tt * 0.35) + i / 10) % 1, pegado = i < tapa * 10; const p: V3 = pegado ? [0.32 + (rn(i, 1) - 0.5) * 0.06, 0.25, (rn(i, 2) - 0.5) * 0.06] : q < 0.75 ? [lerp(-0.65, 0.3, q / 0.75), 0.42, 0] : [0.32, lerp(0.42, 0.26, (q - 0.75) / 0.25), 0];
        return <mesh key={i} position={p} rotation={[i, i * 2, tt * 3]} scale={[0.05, 0.008, 0.03]}><boxGeometry /><meshStandardMaterial color="#f6f5f0" emissive="#777" /></mesh>; })}
      {Array.from({ length: 24 }, (_, i) => { const q = (tt * 1.5 + i / 24) % 1; return <mesh key={"c" + i} position={[0.32 + (rn(i, 1) - 0.5) * 0.05 * chorro, 0.24 - q * 0.3, (rn(i, 2) - 0.5) * 0.05 * chorro]} scale={[0.007 * chorro + 0.002, 0.014, 0.007 * chorro + 0.002]}><sphereGeometry args={[1, 6, 4]} />{AGUA(0.9, "#9fd4f4")}</mesh>; })}
      <Halo p={[0.32, 0.25, 0.08]} r={0.15 * tapa} c={RED} o={0.6} />
    </group>
  </Estudio>;
}}</Stage>;

// 13 · ESTIRADA: la cinta sale del rollo, se estira (el rollo se aleja) y se vuelve translúcida; a través de ella aparecen los hilos de la rosca
const HTension: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#10161e">{(tt) => {
  const tensa = eio(tt, 1.0, 3.0), k = eio(tt, 0.5, 2.6);
  return <Estudio t={tt} cam={[0.15, 0.4, 1.05]} look={[0, 0.27, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Mesa />
    <group position={[-0.05, 0.1, 0]} rotation={[0, tt * 0.8, 0]} scale={S0(tt)}>
      <Rosca L={0.36} R={0.12} />
      <Cinta R={0.12} L={0.36} k={k} vueltas={6} tensa={tensa} floja={0.3 * (1 - tensa)} />
    </group>
    <Rollo p={[0.2 + 0.12 * tensa, 0.3, 0.1]} s={1.2} giro={-tt * 5} />
    <mesh position={[0.07 + 0.06 * tensa, 0.3, 0.1]}><boxGeometry args={[0.13 + 0.12 * tensa, 0.035, 0.002]} /><meshPhysicalMaterial color="#f6f5f0" transparent opacity={lerp(0.9, 0.55, tensa)} /></mesh>
    <Halo p={[-0.05, 0.28, 0.15]} r={0.3 * eio(tt, 3.0, 3.5)} c={VER} o={0.45} />
    <Sombra p={[-0.05, 0.003, 0]} r={0.26} />
  </Estudio>;
}}</Stage>;

// 14 · COMO LAS TEJAS: un techito de tejas se arma de a una pisando la mitad de la anterior; las tejas se curvan y se vuelven la cinta sobre la rosca
const HTejas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false} tone="#14110e">{(tt) => {
  const morph = eio(tt, 2.3, 3.2);
  return <Estudio t={tt} cam={[0.0, 0.45, 1.45]} look={[0, 0.27, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#17130f" />
    <Mesa />
    {/* v2: el techito queda armado a la izquierda (no desaparece) y la rosca con su cinta aparece a la derecha con las mismas medias vueltas */}
    <group position={[-0.32, 0.02, 0]} scale={0.85}>
      <RBox s={[0.9, 0.03, 0.34]} r={0.01} p={[0.0, 0.2, -0.02]} rot={[0, 0, -0.22]}>{M.madera("#6b4a2e")}</RBox>
      {Array.from({ length: 7 }, (_, i) => { const d = eio(tt, 0.3 + i * 0.25, 0.6 + i * 0.25); return d > 0.01 && <group key={i} position={[-0.36 + i * 0.12, 0.33 - i * 0.026 + lerp(0.15, 0, d), 0]} rotation={[0, 0, -0.22]}>
        <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.3, 24, 1, true, 0, P]} /><meshStandardMaterial color={i % 2 ? "#b8643f" : "#a8553a"} roughness={0.8} side={THREE.DoubleSide} /></mesh></group>; })}
    </group>
    <group position={[0.36, 0.1, 0]} scale={lerp(0.6, 1, morph) * (morph > 0.01 ? 1 : 0.0001)}>
      <Rosca L={0.34} R={0.11} />
      <Cinta R={0.11} k={1} vueltas={6} tensa={0.65} />
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, 0.28 - i * 0.047, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.116, 0.003, 4, 40]} />{GLOW(VER, 0.7 * morph)}</mesh>)}
    </group>
    <Sombra p={[0, 0.003, 0]} r={0.3} />
  </Estudio>;
}}</Stage>;

// 15 · TRES A CINCO VUELTAS: dos roscas; a la izquierda la cinta se sigue sumando hasta veinte vueltas y engorda (roja); a la derecha se para en cuatro (verde);
// un contador de vueltas sube en cada una
const tamborTex = () => ctex("p4f:tambor", 1024, 256, (g) => { g.fillStyle = "#f3ecd8"; g.fillRect(0, 0, 1024, 256); g.fillStyle = "#16130f"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 92px Inter, Arial, sans-serif";
  for (let n = 0; n <= 10; n++) { g.save(); g.translate(n * 102.4, 128); g.rotate(P2); g.scale(1.9, 1); g.fillText(String(n % 10), 0, 6); g.restore(); } });
const Tambores: React.FC<{ p: V3; val: number; n: number; s?: number }> = ({ p, val, n, s = 1 }) => {
  const pos = (k: number) => { const m = Math.pow(10, k), v = val / m; if (k === 0) return v; return Math.floor(v) + cl((val % m) - (m - 1)); };
  return <group position={p} scale={s}>{Array.from({ length: n }, (_, i) => <group key={i} position={[(-n / 2 + 0.5 + i) * 0.2, 0, 0]} rotation={[2 * P * pos(n - 1 - i) / 10, 0, 0]}>
    <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.17, 0.17, 0.16, 40]} /><meshStandardMaterial map={tamborTex()} roughness={0.45} /></mesh></group>)}
    {[0.17, -0.17].map((y, i) => <mesh key={i} position={[0, y, 0.16]}><boxGeometry args={[n * 0.2 + 0.08, 0.1, 0.04]} /><meshStandardMaterial color="#2a2522" /></mesh>)}</group>;
};
const HVueltas: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#10161e">{(tt) => {
  const vI = cl((tt - 0.6) / 3.0) * 20, vD = Math.min(4, cl((tt - 0.6) / 3.0) * 20);
  return <Estudio t={tt} cam={[0.0, 0.5, 1.55]} look={[0, 0.32, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Mesa />
    {[[-0.33, vI, RED], [0.33, vD, VER]].map(([x, v, c], i) => <group key={i} position={[x as number, 0.12, 0]} scale={S0(tt, 0.3 + i * 0.1)}>
      <Rosca L={0.3} />
      <Cinta k={1} vueltas={Math.max(1, Math.min(6, v as number))} floja={i === 0 ? cl(((v as number) - 5) / 15) * 1.2 : 0} tensa={i ? 0.7 : 0.3} c={i === 0 ? col("#f6f5f0", "#f4d0cc", cl(((v as number) - 5) / 15)) : "#f6f5f0"} />
      <Tambores p={[0, 0.6, 0]} val={v as number} n={2} s={0.38} />
      <Halo p={[0, 0.25, 0.2]} r={0.28 * eio(tt, 3.4, 3.8)} c={c as string} o={0.4} />
    </group>)}
    <Sombra p={[-0.33, 0.003, 0]} r={0.24} /><Sombra p={[0.33, 0.003, 0]} r={0.24} />
  </Estudio>;
}}</Stage>;

// 16 · LA CUÑA: el cople de plástico baja sobre la rosca con cinta de más; se queda a mitad, se hincha y se raja: la grieta crece y aparece una gota
const HCuna: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#10161e">{(tt) => {
  const g = eio(tt, 0.7, 2.2), raja = eio(tt, 2.3, 3.2), gota = cl((tt - 3.1) / 0.9);
  return <Estudio t={tt} cam={[0.18, 0.44, 1.32]} look={[0, 0.32, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Mesa />
    <group position={[0, 0.12, 0]} scale={S0(tt)}>
      <Rosca L={0.32} R={0.11} />
      <Cinta R={0.11} L={0.32} k={1} vueltas={6} floja={0.7} tensa={0.1} />
      <Hembra p={[0, 0.44 - 0.12 * g, 0]} rot={[0, g * 3 * P, 0]} R={0.11} plastico raja={raja} s={1 + 0.04 * raja} />
      {gota > 0 && <Gota p={[0.18, 0.3 - gota * 0.25, 0.08]} s={0.032} />}
      <Halo p={[0.18, 0.34, 0.1]} r={0.2 * raja} c={RED} o={0.7} />
    </group>
    <Sombra p={[0, 0.003, 0]} r={0.26} />
  </Estudio>;
}}</Stage>;

// 17 · TRES COLORES: tres rollos caen a la mesa (blanco, rosa, amarillo); cada uno salta a su rosca: blanco a la de agua, rosa a la rosca vieja, amarillo al tubo de gas;
// el blanco intenta ir al gas y una cruz roja lo frena
const HColores: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#14110e">{(tt) => {
  const cols = ["#f6f5f0", ROSA, AMAR], xs = [-0.45, 0, 0.45], salto = [eio(tt, 1.0, 1.5), eio(tt, 1.6, 2.1), eio(tt, 2.2, 2.7)], cruz = eio(tt, 3.0, 3.3);
  return <Estudio t={tt} cam={[0.0, 0.55, 1.6]} look={[0, 0.28, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#17130f" />
    <Mesa />
    {xs.map((x, i) => <group key={i} position={[x, 0.12, -0.15]} scale={S0(tt, 0.3 + i * 0.08)}>
      <Rosca L={0.28} R={0.1} />
      {i === 1 && Array.from({ length: 12 }, (_, j) => <mesh key={j} position={[Math.cos(j) * 0.1, 0.05 + rn(j, 1) * 0.2, Math.sin(j) * 0.1]} scale={0.012}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#5a6a3a" /></mesh>)}
      {i === 2 && <mesh position={[0, -0.16, 0]}><cylinderGeometry args={[0.07, 0.07, 0.1, 24]} /><meshStandardMaterial color={AMAR} roughness={0.5} /></mesh>}
      <Cinta k={salto[i]} vueltas={i === 1 ? 3 : 4} c={cols[i]} tensa={0.6} />
    </group>)}
    {xs.map((x, i) => { const d = cl(IN(tt, 0.35 + i * 0.1)), s = salto[i]; return s < 0.98 && <Rollo key={"r" + i} p={[lerp(x, x + 0.18, s), lerp(lerp(0.8, 0.04, d), 0.35, Math.sin(s * P)), lerp(0.3, -0.05, s)]} s={1.6} rot={[P2 * (1 - s), 0, 0]} c={cols[i]} />; })}
    {cruz > 0.01 && <Rollo p={[0.3, 0.3, 0.1]} s={1.5} rot={[P2, 0, 0]} c="#f6f5f0" />}
    <Cruz p={[0.3, 0.3, 0.16]} s={0.2} k={cruz} />
    <Halo p={[0.45, 0.3, 0.0]} r={0.25 * eio(tt, 2.7, 3.0)} c={AMAR} o={0.4} />
  </Estudio>;
}}</Stage>;

// 18 · LA PASTA: un pincel pasa una capa gris sobre la cinta de una rosca de metal (verde); en la de plástico, la pasta equivocada abre grietas finas (rojo)
const HPasta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#14110e">{(tt) => {
  const capa = eio(tt, 0.7, 1.9), mal = eio(tt, 2.3, 3.5);
  return <Estudio t={tt} cam={[0.0, 0.42, 1.45]} look={[0, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#17130f" />
    <Mesa />
    <group position={[-0.32, 0.12, 0]} scale={S0(tt)}>
      <Rosca L={0.3} />
      <Cinta k={1} vueltas={4} tensa={0.7} />
      <mesh position={[0, 0.3 - 0.13 * capa, 0]}><cylinderGeometry args={[0.112, 0.112, 0.26 * capa + 0.001, 40, 1, true]} /><meshStandardMaterial color="#6b7076" roughness={0.4} metalness={0.2} transparent opacity={0.85} side={THREE.DoubleSide} /></mesh>
      <group position={[0.16, 0.3 - 0.24 * capa, 0.05]} rotation={[0, 0, 0.6]}><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.012, 0.012, 0.2, 10]} />{M.madera("#8a5a32")}</mesh><mesh><cylinderGeometry args={[0.02, 0.012, 0.04, 12]} /><meshStandardMaterial color="#3a3f45" /></mesh></group>
      <Halo p={[0, 0.2, 0.15]} r={0.25 * eio(tt, 1.9, 2.3)} c={VER} o={0.45} />
    </group>
    <group position={[0.32, 0.12, 0]} scale={S0(tt, 0.45)}>
      <Rosca L={0.3} plastico />
      <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.105, 0.105, 0.26 * mal + 0.001, 40, 1, true]} /><meshStandardMaterial color="#a33b2a" transparent opacity={0.55} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 5 }, (_, j) => <mesh key={j} position={[Math.cos(j * 1.3) * 0.105, 0.08 + j * 0.04, Math.sin(j * 1.3) * 0.105]} rotation={[0, -j * 1.3, 0.4]} scale={[1, mal + 0.001, 1]}><boxGeometry args={[0.004, 0.1, 0.004]} />{GLOW("#2a0a06")}</mesh>)}
      <Halo p={[0, 0.2, 0.15]} r={0.25 * mal} c={RED} o={0.5} />
    </group>
    <Sombra p={[-0.32, 0.003, 0]} r={0.22} /><Sombra p={[0.32, 0.003, 0]} r={0.22} />
  </Estudio>;
}}</Stage>;

// 19 · SELLA EL EMPAQUE: tuerca de manguera en corte con su arandela de hule; con teflón en la rosca la tuerca queda alta, hay luz entre la arandela y la boca: gotea;
// la cinta se va, la tuerca baja, aprieta la arandela y la gota desaparece
const HEmpaque: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#10161e">{(tt) => {
  const quita = eio(tt, 1.8, 2.6), baja = eio(tt, 2.6, 3.4), hueco = 0.03 * (1 - baja), gota = (tt * 0.9) % 1;
  return <Estudio t={tt} cam={[0.25, 0.32, 1.1]} look={[0, 0.22, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Mesa />
    <group position={[0, 0.08, 0]} scale={S0(tt)}>
      <Rosca L={0.22} R={0.1} n={6} />
      {quita < 0.98 && <group scale={[1, 1, 1]} position={[0.4 * quita, 0.1 * quita, 0]}><Cinta R={0.1} L={0.22} k={1} vueltas={4} tensa={0.5} desde={0.02} /></group>}
      <group position={[0, 0.27 + hueco, 0]}>
        <mesh><cylinderGeometry args={[0.16, 0.16, 0.12, 6, 1, true, P * 0.25, P * 1.5]} />{M.cromo()}</mesh>
        <mesh position={[0, 0.06, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.03, 0.16, 6, 1, P * 0.25, P * 1.5]} />{M.cromo()}</mesh>
        <mesh position={[0, 0.04, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.07, 0.016 * (1 - 0.3 * baja), 12, 40, P * 1.5]} /><meshStandardMaterial color="#1f1f1f" roughness={0.8} /></mesh>
        <Caño a={[0, 0.06, 0]} b={[0, 0.3, 0]} r={0.035} mat={<meshStandardMaterial color="#3a3f45" roughness={0.6} />} />
      </group>
      {baja < 0.5 && <Gota p={[0.08, 0.24 - gota * 0.28, 0.12]} s={0.018} />}
      <Halo p={[0.07, 0.25 + hueco, 0.12]} r={0.15 * (1 - baja) * eio(tt, 0.6, 1.0)} c={RED} o={0.7} />
      <Halo p={[0.07, 0.3, 0.12]} r={0.2 * eio(tt, 3.4, 3.8)} c={VER} o={0.5} />
    </group>
    <Sombra p={[0, 0.003, 0]} r={0.25} />
  </Estudio>;
}}</Stage>;

// 20 · EL SIFÓN: debajo del fregadero, la tuerca grande de plástico baja girando a mano sobre su empaque cónico, que se asienta y brilla verde; un rollo de teflón se aleja tachado
const HSifon: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#10161e">{(tt) => {
  const g = eio(tt, 0.8, 2.6), ok = eio(tt, 2.6, 3.0);
  return <Estudio t={tt} cam={[0.2, 0.3, 1.4]} look={[0, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#151a20" />
    <group scale={S0(tt)}>
      <Caño a={[0, 0.75, 0]} b={[0, 0.35, 0]} r={0.035} mat={PVCM()} />
      <mesh position={[0, 0.34, 0]}><coneGeometry args={[0.055, 0.05, 32, 1, true]} /><meshStandardMaterial color={col("#e8e4d8", "#3cc46a", ok)} roughness={0.6} side={THREE.DoubleSide} emissive={col("#000000", "#0a5a20", ok)} /></mesh>
      <group position={[0, 0.32 + 0.12 * (1 - g), 0]} rotation={[0, g * 4 * P, 0]}>
        <mesh><cylinderGeometry args={[0.075, 0.075, 0.07, 24, 1, true]} />{PVCM()}</mesh>
        {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[Math.cos(i / 16 * 2 * P) * 0.077, 0, Math.sin(i / 16 * 2 * P) * 0.077]}><boxGeometry args={[0.008, 0.06, 0.008]} />{PVCM()}</mesh>)}
      </group>
      <Caño a={[0, 0.3, 0]} b={[0, 0.08, 0]} r={0.045} mat={PVCM()} />
      <mesh position={[0.1, 0.08, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.1, 0.045, 16, 32, P]} />{PVCM()}</mesh>
      <Caño a={[0.2, 0.08, 0]} b={[0.2, 0.24, 0]} r={0.045} mat={PVCM()} />
      <Mano p={[0.12, 0.38 + 0.1 * (1 - g), 0.08]} rot={[0, 0, P2]} s={0.9} />
    </group>
    <Rollo p={[lerp(-0.3, -0.55, ok), 0.35, 0.1]} s={1.5} rot={[P2, 0, 0]} />
    <Cruz p={[lerp(-0.3, -0.55, ok), 0.35, 0.16]} s={0.2} k={eio(tt, 2.8, 3.1)} />
    <Halo p={[0, 0.34, 0.1]} r={0.2 * ok} c={VER} o={0.5} />
  </Estudio>;
}}</Stage>;

// 21 · EL APRIETE: dos uniones; la llave gira sobre la de metal una vuelta y media (contador 1,5, verde); sobre la de plástico sólo un cuarto: si sigue, se raja (rojo)
const HApriete: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#14110e">{(tt) => {
  const gM = eio(tt, 0.6, 2.4), gP = eio(tt, 2.0, 2.8), pasa = eio(tt, 3.0, 3.6);
  return <Estudio t={tt} cam={[0.0, 0.6, 1.5]} look={[0, 0.25, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#17130f" />
    <Mesa />
    <group position={[-0.35, 0.12, 0]} scale={S0(tt)}>
      <Rosca L={0.26} /><Hembra p={[0, 0.3, 0]} rot={[0, -gM * 3 * P, 0]} />
      <group position={[0, 0.3, 0]} rotation={[0, -gM * 3 * P, 0]}><Llave p={[0, 0.0, 0]} rot={[P2, 0, 0]} s={0.95} /></group>
      <Halo p={[0, 0.3, 0.15]} r={0.25 * eio(tt, 2.4, 2.8)} c={VER} o={0.5} />
    </group>
    <group position={[0.35, 0.12, 0]} scale={S0(tt, 0.45)}>
      <Rosca L={0.26} /><Hembra p={[0, 0.3, 0]} rot={[0, -(gP * 0.5 + pasa * 0.6) * P, 0]} plastico raja={pasa} />
      <group position={[0, 0.3, 0]} rotation={[0, -(gP * 0.5 + pasa * 0.6) * P, 0]}><Llave p={[0, 0.0, 0]} rot={[P2, 0, 0]} s={0.95} /></group>
      <Halo p={[0, 0.3, 0.15]} r={0.25 * pasa} c={RED} o={0.6} />
    </group>
    <Sombra p={[-0.35, 0.003, 0]} r={0.22} /><Sombra p={[0.35, 0.003, 0]} r={0.22} />
  </Estudio>;
}}</Stage>;

// 22 · NO VUELVAS ATRÁS: la unión apretada; la llave retrocede un poquito (flecha roja hacia atrás) y la cinta se despega de los hilos dejando luz: aparece la gota
const HAtras: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#10161e">{(tt) => {
  const atras = eio(tt, 1.2, 1.8), despega = eio(tt, 1.8, 2.8), gota = cl((tt - 2.8) / 0.9);
  return <Estudio t={tt} cam={[0.15, 0.45, 1.2]} look={[0, 0.27, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Mesa />
    <group position={[0, 0.12, 0]} scale={S0(tt)}>
      <Rosca L={0.3} R={0.11} />
      <Cinta R={0.11} L={0.3} k={1} vueltas={5} floja={0.4 * despega} tensa={0.7} />
      <Hembra p={[0, 0.34 + 0.03 * atras, 0]} rot={[0, atras * 0.5, 0]} R={0.11} />
      <group position={[0, 0.34 + 0.03 * atras, 0]} rotation={[0, atras * 0.5, 0]}><Llave p={[0, 0, 0]} rot={[P2, 0, 0]} s={0.95} /></group>
      <FlechaGiro p={[0, 0.48, 0]} r={0.15} dir={-1} c={RED} o={eio(tt, 1.0, 1.3)} k={atras} />
      {gota > 0 && <Gota p={[0.14, 0.24 - gota * 0.25, 0.08]} s={0.02} />}
      <Halo p={[0.12, 0.25, 0.1]} r={0.18 * despega} c={RED} o={0.6} />
    </group>
    <Sombra p={[0, 0.003, 0]} r={0.26} />
  </Estudio>;
}}</Stage>;

// 23 · LA PRUEBA DEL PAPEL: las dos uniones con agua; una hoja de papel de cocina pasa por debajo de cada una: la de la cinta al revés sale con mancha azul, la otra seca
const HPapel: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#14110e">{(tt) => {
  const p1 = eio(tt, 0.8, 1.6), p2 = eio(tt, 2.0, 2.8);
  return <Estudio t={tt} cam={[0.0, 0.4, 1.5]} look={[0, 0.3, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#17130f" />
    <Caño a={[-0.8, 0.62, -0.05]} b={[0.8, 0.62, -0.05]} r={0.03} mat={M.cromo("#a8adb2")} />
    {[-0.33, 0.33].map((x, i) => { const p = i ? p2 : p1; return <group key={i} position={[x, 0, 0]} scale={S0(tt, 0.3 + i * 0.1)}>
      <Caño a={[0, 0.62, -0.05]} b={[0, 0.5, -0.05]} r={0.03} mat={M.cromo("#a8adb2")} />
      <group position={[0, 0.5, -0.05]} rotation={[P, 0, 0]}><Rosca L={0.2} R={0.08} n={5} /></group>
      <Hembra p={[0, 0.33, -0.05]} R={0.08} />
      {i === 0 && <Gota p={[0.07, 0.24, 0.0]} s={0.018} />}
      <Papel p={[lerp(0.35, 0.0, p), 0.18 + 0.05 * Math.sin(p * P), 0.05]} rot={[-0.3, 0, 0]} moja={i === 0 ? eio(tt, 1.4, 1.9) : 0} />
      <Halo p={[0, 0.2, 0.15]} r={0.25 * (i ? eio(tt, 2.8, 3.2) : eio(tt, 1.6, 2.0))} c={i ? VER : RED} o={0.4} />
    </group>; })}
  </Estudio>;
}}</Stage>;

// 24 · LOS CINCO ERRORES (items): cinco roscas en fila sobre la mesa desde el arranque; con cada error la suya muestra la falla y se le estampa una cruz roja
const Error5: React.FC<{ i: number; tt: number; k: number }> = ({ i, tt, k }) => {
  if (i === 0) return <><Rosca L={0.24} R={0.08} n={6} /><Cinta R={0.08} L={0.24} k={1} vueltas={4} arruga={k} tensa={0.3} /></>;
  if (i === 1) return <><Rosca L={0.24} R={0.08} n={6} /><Cinta R={0.08} L={0.24} k={1} vueltas={4} desde={0} tensa={0.4} />{k > 0.01 && Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[(rn(j, 1) - 0.5) * 0.15, 0.26 + k * 0.1 + j * 0.02, 0]} rotation={[j, j, tt]} scale={[0.02, 0.003, 0.01]}><boxGeometry /><meshStandardMaterial color="#f6f5f0" /></mesh>)}</>;
  if (i === 2) return <><Rosca L={0.24} R={0.08} n={6} /><Cinta R={0.08} L={0.24} k={1} vueltas={6} floja={0.6 + 0.6 * k} tensa={0} /></>;
  if (i === 3) return <><Rosca L={0.2} R={0.08} n={5} /><Cinta R={0.08} L={0.2} k={1} vueltas={3} tensa={0.5} desde={0.02} /><mesh position={[0, 0.25 + 0.03 * k, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.06, 0.014, 10, 32]} /><meshStandardMaterial color="#1f1f1f" /></mesh></>;
  return <><Rosca L={0.24} R={0.08} n={6} /><Hembra p={[0, 0.26, 0]} R={0.08} rot={[0, k * 0.6, 0]} /><FlechaGiro p={[0, 0.4, 0]} r={0.1} dir={-1} c={RED} o={k} k={k} /></>;
};
const HErrores: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#14110e">{(tt) => {
  const a = [0, 1, 2, 3, 4].map((i) => AT(h, i, 1.3));
  return <Estudio t={tt} cam={[0.0, 0.5, 1.75]} look={[0, 0.2, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#17130f" />
    <Mesa />
    {[0, 1, 2, 3, 4].map((i) => { const x = -0.64 + i * 0.32, k = eio(tt, a[i], a[i] + 0.5), st = eio(tt, a[i] + 0.5, a[i] + 0.75);
      return <group key={i}>
        <group position={[x, 0.1, 0]} scale={S0(tt, 0.3 + i * 0.07)}><Error5 i={i} tt={tt} k={k} /></group>
        <Cruz p={[x, 0.25, 0.15]} s={0.22} k={st} />
        <Halo p={[x, 0.25, 0.17]} r={0.22} c={RED} o={st > 0 && st < 1 ? 1 - st : 0} />
        <Sombra p={[x, 0.003, 0]} r={0.18} o={0.6} />
      </group>; })}
  </Estudio>;
}}</Stage>;

// 25 · EL REPASO (items): una rosca grande al centro; con cada idea se suma una vuelta de cinta a favor y un anillo dorado se enciende en su hilo
const HRecap: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#10161e">{(tt) => {
  const a = Array.from({ length: 8 }, (_, i) => AT(h, i, 0.55, 0.5)), on = (i: number) => eio(tt, a[i], a[i] + 0.35), n = a.reduce((s, _, i) => s + on(i), 0);
  return <Estudio t={tt} cam={[0.2, 0.55, 1.3]} look={[0, 0.32, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-0.8} />
    <Mesa />
    <group position={[0, 0.1, 0]} rotation={[0, tt * 0.3, 0]} scale={S0(tt)}>
      <Rosca L={0.5} R={0.14} n={10} />
      <Cinta R={0.14} L={0.5} k={n / 8} vueltas={8} tensa={0.7} />
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0, 0.44 - i * 0.055, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.16, 0.008, 8, 40]} /><meshStandardMaterial color={col("#6b6f74", "#ffcf5a", on(i))} metalness={0.6} roughness={0.3} emissive={col("#000000", "#b07a10", on(i))} /></mesh>)}
    </group>
    <Halo p={[0, 0.35, 0.2]} r={0.4 * eio(tt, a[7] + 0.3, a[7] + 0.8)} c="#ffd36a" o={0.4} />
    <Sombra p={[0, 0.003, 0]} r={0.3} />
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  f_dos: HDos, f_noventa: HNoventa, f_espiral: HEspiral, f_hondo: HHondo, f_venda: HVenda, f_limpia: HLimpia, f_lupa: HLupa, f_reloj: HReloj,
  f_arruga: HArruga, f_mano: HMano, f_hilo: HHilo, f_aireador: HAireador, f_tension: HTension, f_tejas: HTejas, f_vueltas: HVueltas, f_cuna: HCuna,
  f_colores: HColores, f_pasta: HPasta, f_empaque: HEmpaque, f_sifon: HSifon, f_apriete: HApriete, f_atras: HAtras, f_papel: HPapel, f_errores: HErrores, f_recap: HRecap,
};
