// plo4a v3 (ronda 3, tope) — antes v2 (ronda 2 del evaluador) · EL INODORO QUE DESCARGA DÉBIL NO ESTÁ TAPADO · componentes únicos 3D.
// Lecciones de plo4c aplicadas: cámara fija y cercana (fit={false}) con margen calculado (medio alto ≈ 0.372·d, medio ancho ≈ 0.662·d),
// CERO rótulos (el objeto lo dice), los objetos ENTRAN (nada aparece de golpe), sombra de contacto, fondo oscuro detrás del vidrio,
// toda animación termina antes de tt≈4.2 (Stage comprime los héroes sin items) y en los de items cada momento dura ≥0.7 s.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, phys, RED, Stage, VER } from "./ckit";
import { ctex, Estudio, fall, lathe, M, RBox, rn } from "./estudio3d";
import { Chorro } from "./kit3d";
import { AGUA, Cubeta, Gota, Linterna, tuboGeo } from "./kitplo";
import { Bote, BordeAgujeros, Cadena, Calendario, Espejito, Esponja, Inodoro, Vaso } from "./kitbano";

type C = React.FC<{ t: number; h: H }>;
type V3 = [number, number, number];
const P = Math.PI, P2 = P / 2;
const rel = (h: H, i: number) => (h.items?.[i]?.a ?? h.at + 99) - h.at;
const IN = (tt: number, a: number) => phys(tt, a, 7, 0.45);
const CACHE = new Map<string, any>();
const memo = <T,>(k: string, f: () => T): T => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const AT = (h: H, i: number, step = 1.1, a0 = 0.6) => rel(h, i) > 90 ? a0 + i * step : rel(h, i);
const SARRO = "#ece5cf", OCRE = "#8a5a2b", OCRE2 = "#5e3b1c", AMBAR = "#d9a441";
const LOZA = (o = 1) => <meshPhysicalMaterial color="#f7f6f1" roughness={0.12} clearcoat={1} transparent={o < 1} opacity={o} side={THREE.DoubleSide} depthWrite={o >= 1} />;
const CINTA = () => <meshStandardMaterial color="#c3c7cc" roughness={0.3} metalness={0.75} side={THREE.DoubleSide} />;
const VINAGRE = (o = 0.6, c = AMBAR) => <meshPhysicalMaterial color={c} roughness={0.04} clearcoat={1} transparent opacity={o} depthWrite={false} />;
const GLOW = (c: string, o = 1) => <meshBasicMaterial color={c} transparent opacity={o} toneMapped={false} depthWrite={false} />;
// ---------- escenografía común ----------
const sombraTex = () => ctex("p4a:sombra", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(0,0,0,0.8)"); gr.addColorStop(0.45, "rgba(0,0,0,0.4)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const Sombra: React.FC<{ p: V3; r: number; o?: number; sx?: number }> = ({ p, r, o = 0.8, sx = 1 }) =>
  <mesh position={p} rotation={[-P2, 0, 0]} scale={[sx, 1, 1]} renderOrder={2}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={sombraTex()} transparent opacity={o} depthWrite={false} toneMapped={false} /></mesh>;
const azulejo = (rx = 6, ry = 4) => { const t = ctex(`p4a:az${rx}x${ry}`, 512, 512, (g) => {
  g.fillStyle = "#a9a39a"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const v = 232 + ((i * 7 + j * 13) % 9); g.fillStyle = `rgb(${v},${v - 3},${v - 8})`; g.fillRect(i * 128 + 4, j * 128 + 4, 120, 120); } });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); return t; };
const Pared: React.FC<{ z?: number; y?: number; w?: number; hh?: number; dim?: number }> = ({ z = -0.7, y = 0.4, w = 4.4, hh = 3.2, dim = 0.55 }) =>
  <mesh position={[0, y, z]} receiveShadow><planeGeometry args={[w, hh]} /><meshStandardMaterial map={azulejo(9, 6.5)} color={col("#000000", "#ffffff", dim)} roughness={0.32} /></mesh>;
const Piso: React.FC<{ y: number; dim?: number }> = ({ y, dim = 0.75 }) =>
  <mesh position={[0, y, 0]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[4.4, 3.2]} /><meshStandardMaterial map={azulejo(9, 6.5)} color={col("#000000", "#ffffff", dim)} roughness={0.4} /></mesh>;
const Fondo: React.FC<{ z?: number; c?: string }> = ({ z = -0.9, c = "#11161c" }) =>
  <mesh position={[0, 0, z]}><planeGeometry args={[6, 4]} /><meshBasicMaterial color={c} toneMapped={false} /></mesh>;
const halo = () => ctex("p4a:halo", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(255,248,220,0.95)"); gr.addColorStop(0.3, "rgba(255,240,200,0.35)"); gr.addColorStop(1, "rgba(255,240,200,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const Halo: React.FC<{ p: V3; r: number; c?: string; o?: number }> = ({ p, r, c = "#fff3c0", o = 1 }) =>
  <mesh position={p} renderOrder={5}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={halo()} color={c} transparent opacity={o} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} /></mesh>;
// haz/cilindro orientado entre dos puntos (luz, chorro grueso)
const Haz: React.FC<{ a: V3; b: V3; r0: number; r1: number; c?: string; o?: number; add?: boolean }> = ({ a, b, r0, r1, c = "#fff2b0", o = 0.4, add = true }) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = Math.max(0.001, d.length());
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()), m = A.clone().add(B).multiplyScalar(0.5);
  return <mesh position={[m.x, m.y, m.z]} quaternion={q}><cylinderGeometry args={[r1, r0, L, 28, 1, true]} /><meshBasicMaterial color={c} transparent opacity={o} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} /></mesh>;
};
// tambores mecánicos (contador de rodillos)
const tambor = () => ctex("p4a:tambor", 1024, 256, (g) => {
  g.fillStyle = "#f3ecd8"; g.fillRect(0, 0, 1024, 256); g.fillStyle = "#16130f"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 92px Inter, Arial, sans-serif";
  for (let n = 0; n <= 10; n++) { g.save(); g.translate(n * 102.4, 128); g.rotate(P2); g.scale(1.9, 1); g.fillText(String(n % 10), 0, 6); g.restore(); }
  g.fillStyle = "rgba(0,0,0,.16)"; for (let n = 0; n < 10; n++) g.fillRect(n * 102.4 + 50, 0, 3, 256);
});
const letra = (txt: string, fg = "#f3ecd8", bg = "#2a2522", size = 170) => ctex("p4a:le" + txt + fg + bg, 256, 256, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, 256, 256); g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `900 ${size}px Inter, Arial, sans-serif`; g.fillText(txt, 128, 140); });
const Tambores: React.FC<{ p: V3; rot?: V3; val: number; n: number; s?: number; sufijo?: string; prefijo?: string; caja?: boolean }> = ({ p, rot, val, n, s = 1, sufijo, prefijo, caja = true }) => {
  const pos = (k: number) => { const m = Math.pow(10, k), v = val / m; if (k === 0) return v; const low = val % m; return Math.floor(v) + cl(low - (m - 1)); };
  const W = n * 0.2 + (sufijo ? 0.18 : 0) + (prefijo ? 0.18 : 0), x0 = -W / 2 + (prefijo ? 0.18 : 0) + 0.1;
  return <group position={p} rotation={rot} scale={s}>
    {caja && <RBox s={[W + 0.08, 0.44, 0.26]} r={0.03} p={[0, 0, -0.06]}><meshStandardMaterial color="#2a2522" roughness={0.55} metalness={0.2} /></RBox>}
    {Array.from({ length: n }, (_, i) => <group key={i} position={[x0 + i * 0.2, 0, 0]} rotation={[2 * P * pos(n - 1 - i) / 10, 0, 0]}>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.17, 0.17, 0.16, 48]} /><meshStandardMaterial map={tambor()} roughness={0.45} /></mesh></group>)}
    <mesh position={[0, 0.17, 0.16]}><boxGeometry args={[W + 0.08, 0.1, 0.04]} /><meshStandardMaterial color="#2a2522" roughness={0.5} metalness={0.3} /></mesh>
    <mesh position={[0, -0.17, 0.16]}><boxGeometry args={[W + 0.08, 0.1, 0.04]} /><meshStandardMaterial color="#2a2522" roughness={0.5} metalness={0.3} /></mesh>
    {sufijo && <mesh position={[W / 2 - 0.08, 0, 0.181]}><planeGeometry args={[0.16, 0.2]} /><meshBasicMaterial map={letra(sufijo)} toneMapped={false} /></mesh>}
    {prefijo && <mesh position={[-W / 2 + 0.08, 0, 0.181]}><planeGeometry args={[0.16, 0.2]} /><meshBasicMaterial map={letra(prefijo)} toneMapped={false} /></mesh>}
  </group>;
};
// piedra rugosa (ruido por posición: sin grietas)
const rocaGeo = () => memo("p4a:roca", () => { const g = new THREE.IcosahedronGeometry(1, 3), p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), f = 1 + 0.16 * Math.sin(x * 5 + y * 3) * Math.cos(z * 4 + x * 2) + 0.07 * Math.sin(y * 13 + z * 9) + 0.04 * Math.sin(x * 23 - z * 17);
    p.setXYZ(i, x * f, y * f * 0.8, z * f); }
  g.computeVertexNormals(); return g; });
// perfil de la taza (radio interior por altura)
const PB: [number, number][] = [[0.06, -0.32], [0.18, -0.26], [0.3, -0.1], [0.36, 0.08], [0.38, 0.16]];
const rb = (y: number) => { if (y <= PB[0][1]) return PB[0][0]; for (let i = 1; i < PB.length; i++) if (y <= PB[i][1]) { const [r0, y0] = PB[i - 1], [r1, y1] = PB[i]; return lerp(r0, r1, (y - y0) / (y1 - y0)); } return PB[PB.length - 1][0]; };
const tazaMitad = () => memo("p4a:tazaM", () => new THREE.LatheGeometry(PB.map(([r, y]) => new THREE.Vector2(r, y)), 56, P2, P));
const aguaCorte = (L: number) => { const k = Math.round(L * 300); return memo("p4a:agC" + k, () => { const y0 = PB[0][1], Lr = k / 300, n = 14;
  const back = new THREE.LatheGeometry([new THREE.Vector2(0.001, y0 + 0.004), ...Array.from({ length: n + 1 }, (_, i) => { const y = lerp(y0 + 0.004, Lr, i / n); return new THREE.Vector2(Math.max(0.002, rb(y) - 0.008), y); }), new THREE.Vector2(0.001, Lr)], 48, P2, P);
  const sh = new THREE.Shape(); sh.moveTo(-rb(y0) + 0.008, y0 + 0.004);
  for (let i = 0; i <= n; i++) { const y = lerp(y0 + 0.004, Lr, i / n); sh.lineTo(-(rb(y) - 0.008), y); }
  for (let i = n; i >= 0; i--) { const y = lerp(y0 + 0.004, Lr, i / n); sh.lineTo(rb(y) - 0.008, y); }
  return { back, front: new THREE.ShapeGeometry(sh) }; }); };
const BordeTaza: React.FC = () => <>{[-1, 1].map((sd) => <mesh key={sd} geometry={memo("p4a:bt" + sd, () => tuboGeo(PB.map(([r, y]) => [sd * (r + 0.012), y, 0] as V3), 0.016, 40, 10))}><meshPhysicalMaterial color="#f7f6f1" roughness={0.2} clearcoat={1} /></mesh>)}</>;
// anillo grueso del borde (toro)
const Aro: React.FC<{ r?: number; tube?: number; vidrio?: boolean; children?: React.ReactNode }> = ({ r = 0.5, tube = 0.07, vidrio, children }) =>
  <group>
    <mesh rotation={[P2, 0, 0]} castShadow receiveShadow><torusGeometry args={[r, tube, 28, 120]} />{vidrio
      ? <meshPhysicalMaterial color="#dff1f6" roughness={0.02} clearcoat={1} transparent opacity={0.28} ior={1.45} side={THREE.DoubleSide} depthWrite={false} envMapIntensity={2} />
      : <meshPhysicalMaterial color="#f7f6f1" roughness={0.14} clearcoat={1} />}</mesh>
    {children}
  </group>;
const aroP = (a: number, r = 0.5, y = 0): V3 => [Math.cos(a) * r, y, Math.sin(a) * r];
const curva = (k: string, pts: V3[]) => memo("p4a:cv" + k, () => new THREE.CatmullRomCurve3(pts.map((v) => new THREE.Vector3(...v))));
const muestra = (cur: THREE.CatmullRomCurve3, u0: number, u1: number, n: number) => Array.from({ length: n }, (_, i) => cur.getPointAt(Math.min(0.9999, Math.max(0, lerp(u0, u1, i / (n - 1)))))).map((v) => [v.x, v.y, v.z] as V3);

// 1 · NO ESTÁ TAPADO: inodoro en rayos X sobre fondo oscuro; la salida (el sifón) se enciende VERDE de abajo hacia arriba;
// después el anillo del borde se llena de puntos ROJOS: el problema está arriba
const TRAP: V3[] = [[0, 0.33, 0.06], [0, 0.22, 0.0], [0, 0.2, -0.1], [0, 0.36, -0.16], [0, 0.44, -0.22], [0, 0.32, -0.28], [0, 0.08, -0.3], [0, -0.02, -0.3]];
const ANoTapado: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#0e141a">{(tt) => {
  const a = eio(tt, 0.4, 1.8), b = eio(tt, 2.1, 3.3), pulso = 0.5 + 0.5 * Math.sin(tt * 7), cur = curva("trap", TRAP), ka = Math.round(a * 40);
  return <Estudio t={tt} cam={[1.05, 0.85, 1.85]} look={[0, 0.55, -0.15]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-1.1} c="#0d1319" />
    <Piso y={0} dim={0.25} />
    <group position={[0, lerp(-0.9, 0, eio(tt, 0, 0.45)), 0]}><Inodoro x={0.85} t={tt} /></group>
    <Sombra p={[0, 0.002, -0.1]} r={0.45} />
    {ka > 0 && <mesh geometry={memo("p4a:trapG" + ka, () => tuboGeo(muestra(cur, 1, 1 - ka / 40, 30), 0.055, 60, 14))}>{GLOW(VER, 0.8)}</mesh>}
    {ka > 0 && <Halo p={[0, 0.2 + 0.2 * a, -0.15]} r={0.35 * a} c={VER} o={0.6} />}
    {Array.from({ length: 18 }, (_, i) => { const an = i / 18 * 2 * P, on = cl(b * 18 - i);
      return <mesh key={i} position={[Math.cos(an) * 0.3, 0.6, Math.sin(an) * 0.3]} scale={(0.045 + 0.012 * pulso) * on + 0.0001}><sphereGeometry args={[1, 12, 10]} />{GLOW(RED)}</mesh>; })}
    {Array.from({ length: 18 }, (_, i) => { const an = i / 18 * 2 * P, on = cl(b * 18 - i); return on > 0.01 && <Halo key={"h" + i} p={[Math.cos(an) * 0.3, 0.61, Math.sin(an) * 0.3]} r={0.09 * on} c={RED} o={0.8} />; })}
    {b > 0.02 && <mesh position={[0, 0.6, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.3, 0.012, 8, 72, 2 * P * b]} />{GLOW(RED, 0.75)}</mesh>}
  </Estudio>;
}}</Stage>;

// 2 · EL CONTADOR DE AGUJERITOS: el aro del borde visto desde abajo; 30 agujeros oscuros se abren con el contador de rodillos;
// después 27 se tapan con tapones blancos de sarro (el contador baja) y sólo 3 quedan abiertos, en rojo
const ABIERTOS = [4, 15, 24];
const AContador: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#10161e">{(tt) => {
  const k = eio(tt, 0.3, 2.2), n = Math.min(30, Math.floor(k * 30.99)), cierre = eio(tt, 2.5, 3.9);
  const cerrado = (i: number) => ABIERTOS.includes(i) ? 0 : cl(cierre * 28 - (i % 28));
  const quedan = 30 - Array.from({ length: 30 }, (_, i) => cerrado(i) > 0.5 ? 1 : 0).reduce((x: number, y: number) => x + y, 0);
  return <Estudio t={tt} cam={[0.0, -1.3, 0.98]} look={[0, -0.02, 0]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, 0.25, 0]} rotation={[P2, 0, 0]}><circleGeometry args={[2.5, 32]} /><meshStandardMaterial color="#1a2028" side={THREE.DoubleSide} /></mesh>
    <Aro r={0.52} tube={0.08}>
      {Array.from({ length: 30 }, (_, i) => { const a = i / 30 * 2 * P, on = i < n ? IN(tt, 0.3 + i * 0.063) : 0, c = cerrado(i), roja = ABIERTOS.includes(i) && tt > 3.0;
        return <group key={i} position={aroP(a, 0.52, -0.079)}>
          <mesh rotation={[P2, 0, 0]} scale={on + 0.0001}><circleGeometry args={[0.026, 20]} /><meshBasicMaterial color={roja ? RED : "#120f0d"} side={THREE.DoubleSide} toneMapped={false} /></mesh>
          {roja && <Halo p={[0, -0.01, 0]} r={0.14} c={RED} o={0.7 + 0.3 * Math.sin(tt * 8)} />}
          {c > 0.01 && <mesh position={[0, -0.004 - 0.14 * (1 - c) * (1 - c), 0]} scale={[0.036 * c, 0.02 * c, 0.036 * c]}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color={SARRO} roughness={1} flatShading /></mesh>}
        </group>; })}
    </Aro>
    <Tambores p={[0, -0.06, 0]} rot={[0.94, 0, 0]} val={tt < 2.5 ? n : quedan} n={2} s={0.95 * IN(tt, 0.15) + 0.0001} caja={false} />
  </Estudio>;
}}</Stage>;

// 3 · LAS TRES COMPRAS (items): de noche sale la luna con cráteres; la botella de VINAGRE BLANCO y el rollo de cinta plateada (con su alma de cartón)
// caen a la repisa con rebote y polvito
const etiqueta = (tx: string[], bg: string, ink: string) => ctex("p4a:et" + tx.join() + bg, 512, 256, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, 512, 256); g.fillStyle = ink; g.textAlign = "center"; g.textBaseline = "middle";
  tx.forEach((s, i) => { g.font = `900 ${i ? 58 : 96}px Inter, Arial, sans-serif`; g.fillText(s, 256, 96 + i * 92); }); });
const Luna3D: React.FC<{ p: V3; r: number }> = ({ p, r }) => <group position={p}>
  <mesh><sphereGeometry args={[r, 48, 32]} /><meshStandardMaterial color="#ece7d4" roughness={1} emissive="#51503f" emissiveIntensity={0.5} /></mesh>
  {[[0.3, 0.4, 0.22], [-0.35, 0.1, 0.16], [0.05, -0.4, 0.2], [-0.15, 0.5, 0.1], [0.45, -0.15, 0.12]].map(([x, y, s], i) => { const z = Math.sqrt(Math.max(0, 1 - x * x - y * y));
    return <mesh key={i} position={[x * r, y * r, z * r * 0.985]} scale={[s * r, s * r, s * r * 0.3]}><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#b9b29b" roughness={1} /></mesh>; })}
  <mesh position={[0, 0, -0.05]}><planeGeometry args={[r * 7, r * 7]} /><meshBasicMaterial map={halo()} transparent opacity={0.6} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} /></mesh>
</group>;
const Botellon: React.FC<{ p?: V3; rot?: V3; s?: number; liq?: string; tapa?: string; tx: string[]; bg: string; ink: string; vidrio?: boolean }> = ({ p, rot, s = 1, liq = "#f2ecd8", tapa = "#c0392b", tx, bg, ink, vidrio = true }) =>
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={memo("p4a:bot", () => lathe([[0.001, 0], [0.13, 0], [0.14, 0.02], [0.14, 0.42], [0.12, 0.5], [0.06, 0.58], [0.05, 0.66], [0.001, 0.66]], 40))} castShadow>
      {vidrio ? <meshPhysicalMaterial color="#eef4f2" roughness={0.04} clearcoat={1} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} /> : <meshPhysicalMaterial color={bg} roughness={0.35} clearcoat={0.5} />}</mesh>
    {vidrio && <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.128, 0.128, 0.42, 36]} /><meshPhysicalMaterial color={liq} roughness={0.05} transparent opacity={0.55} clearcoat={1} /></mesh>}
    <mesh position={[0, 0.7, 0]} castShadow><cylinderGeometry args={[0.058, 0.058, 0.08, 20]} /><meshStandardMaterial color={tapa} roughness={0.4} /></mesh>
    <mesh position={[0, 0.24, 0]}><cylinderGeometry args={[0.143, 0.143, 0.22, 40, 1, true, -0.95, 1.9]} /><meshStandardMaterial map={etiqueta(tx, bg, ink)} roughness={0.6} /></mesh>
  </group>;
const RolloCinta: React.FC<{ p?: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh castShadow><cylinderGeometry args={[0.16, 0.16, 0.1, 48, 1, true]} />{CINTA()}</mesh>
  <mesh rotation={[-P2, 0, 0]} position={[0, 0.05, 0]}><ringGeometry args={[0.1, 0.16, 48]} /><meshStandardMaterial color="#9da2a8" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} /></mesh>
  <mesh rotation={[P2, 0, 0]} position={[0, -0.05, 0]}><ringGeometry args={[0.1, 0.16, 48]} /><meshStandardMaterial color="#9da2a8" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} /></mesh>
  <mesh><cylinderGeometry args={[0.1, 0.1, 0.1, 40, 1, true]} /><meshStandardMaterial color="#b88a52" roughness={0.9} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0.17, -0.02, 0.02]} rotation={[0, 0.1, 0]}><planeGeometry args={[0.03, 0.1]} />{CINTA()}</mesh>
</group>;
const Polvo: React.FC<{ p: V3; k: number }> = ({ p, k }) => k <= 0 || k >= 1 ? null : <>{Array.from({ length: 12 }, (_, i) => { const a = i / 12 * 2 * P;
  return <mesh key={i} position={[p[0] + Math.cos(a) * 0.2 * k, p[1] + 0.03 * Math.sin(k * P), p[2] + Math.sin(a) * 0.08 * k]} scale={0.014 * (1 - k)}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#d8cdb4" transparent opacity={0.8 * (1 - k)} /></mesh>; })}</>;
const ACompras: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#0f1a26">{(tt) => {
  const a0 = AT(h, 0, 1.3), a1 = AT(h, 1, 1.3), a2 = AT(h, 2, 1.3), luna = eio(tt, a0, a0 + 0.9);
  const y1 = fall(tt, a1, 0.8), y2 = fall(tt, a2, 0.8), l1 = tt - a1 - 0.4, l2 = tt - a2 - 0.4;
  return <Estudio t={tt} cam={[0.0, 0.2, 1.3]} look={[0, 0.12, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-0.8} c="#0c1622" />
    {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 2.4, 0.1 + rn(i, 2) * 0.8, -0.78]} scale={0.004 + 0.004 * rn(i, 3)}><sphereGeometry args={[1, 6, 4]} />{GLOW("#ffffff", 0.4 + 0.5 * luna)}</mesh>)}
    <Luna3D p={[-0.45, lerp(-0.1, 0.42, luna), -0.5]} r={0.15} />
    <mesh position={[0.1, -0.2, 0]} receiveShadow castShadow><boxGeometry args={[1.5, 0.04, 0.36]} />{M.madera("#7a5232")}</mesh>
    {[-0.5, 0.7].map((x, i) => <mesh key={i} position={[x, -0.28, -0.12]}><boxGeometry args={[0.04, 0.14, 0.08]} />{M.madera("#5e3d24")}</mesh>)}
    <Sombra p={[0.05, -0.178, 0]} r={0.17} o={tt > a1 ? 0.8 * (1 - y1 / 0.8) : 0} />
    <group position={[0.05, -0.18 + y1, 0]} visible={tt > a1 - 0.05} rotation={[0, -0.25, 0]}>
      <Botellon s={0.62} tx={["VINAGRE", "BLANCO 5%"]} bg="#f4efe2" ink="#20406e" liq="#f6f2e2" tapa="#c0392b" />
    </group>
    <Polvo p={[0.05, -0.18, 0.05]} k={l1 / 0.6} />
    <Sombra p={[0.48, -0.178, 0]} r={0.15} o={tt > a2 ? 0.8 * (1 - y2 / 0.8) : 0} />
    <group position={[0.48, -0.13 + y2, 0]} visible={tt > a2 - 0.05}><RolloCinta s={0.95} rot={[0.12, 0.3, 0]} /></group>
    <Polvo p={[0.48, -0.18, 0.05]} k={l2 / 0.6} />
  </Estudio>;
}}</Stage>;

// 4 · LA ALTURA DE LA CINTURA: cinta métrica 3D con números junto a una silueta (marca roja en 1 m, a la cintura);
// la cubeta se inclina desde la cintura y la columna de agua cae con peso: anillo de salpicadura y remolino
const cintaMetrica = () => ctex("p4a:metro", 64, 1024, (g) => {
  g.fillStyle = "#f2c230"; g.fillRect(0, 0, 64, 1024); g.fillStyle = "#1a1a1a"; g.textAlign = "left"; g.textBaseline = "middle"; g.font = "800 22px Inter, Arial, sans-serif";
  for (let c = 0; c <= 100; c++) { const y = 1014 - c * 10; g.fillRect(0, y, c % 10 ? (c % 5 ? 12 : 20) : 30, 2); if (c % 10 === 0 && c > 0) g.fillText(String(c), 32, y + 1); } });
const AAltura: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const sube = eio(tt, 0.2, 1.0), tilt = eio(tt, 1.2, 1.8), pour = cl((tt - 1.6) / 1.3), ola = eio(tt, 2.0, 3.6), marca = eio(tt, 0.6, 1.1);
  const bx = -0.22, by = lerp(0.6, 1.0, sube);
  return <Estudio t={tt} cam={[0.4, 0.72, 2.0]} look={[-0.12, 0.6, 0]} orbit={0.012} mesa={false} fit={false}>
    <Pared z={-0.75} dim={0.5} />
    <Piso y={0} dim={0.7} />
    <Inodoro p={[0.32, 0, -0.05]} t={tt} remolino={ola} nivel={0.25 * Math.sin(ola * P)} />
    <Sombra p={[0.32, 0.002, -0.1]} r={0.42} />
    <group position={[-0.9, 0, 0.05]}>
      <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[0.06, 1.0, 0.006]} /><meshStandardMaterial map={cintaMetrica()} roughness={0.5} /></mesh>
      <mesh position={[0, 0.03, 0.02]} castShadow><boxGeometry args={[0.14, 0.12, 0.12]} /><meshStandardMaterial color="#2b2f36" roughness={0.4} /></mesh>
      <mesh position={[0.12, 1.0, 0.01]} scale={[marca + 0.0001, 1, 1]}><boxGeometry args={[0.24, 0.012, 0.012]} />{GLOW(RED)}</mesh>
    </group>
    <group position={[-0.55, 0, 0.05]}>
      {[-0.09, 0.09].map((x, i) => <mesh key={i} position={[x, 0.45, 0]} castShadow><capsuleGeometry args={[0.065, 0.78, 8, 16]} /><meshStandardMaterial color="#3a414b" roughness={0.7} /></mesh>)}
      <mesh position={[0, 0.94, 0]} castShadow><capsuleGeometry args={[0.15, 0.08, 8, 20]} /><meshStandardMaterial color="#3a414b" roughness={0.7} /></mesh>
      <mesh position={[0, 1.18, 0]} castShadow><cylinderGeometry args={[0.15, 0.16, 0.36, 24]} /><meshStandardMaterial color="#4a525d" roughness={0.7} /></mesh>
      {marca > 0.01 && <mesh position={[0, 1.0, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.165, 0.012, 8, 40, 2 * P * marca]} />{GLOW(RED)}</mesh>}
      <mesh position={[0.2, 1.12, 0.06]} rotation={[0, 0, lerp(0.9, 1.25, sube)]} castShadow><capsuleGeometry args={[0.045, 0.3, 6, 12]} /><meshStandardMaterial color="#4a525d" roughness={0.7} /></mesh>
    </group>
    <group position={[bx, by, 0.1]} rotation={[0, 0, -tilt * 1.75]}><Cubeta s={0.42} nivel={0.85 * (1 - pour)} agua="#8fc0dc" c="#2f6fb0" /></group>
    {pour > 0.02 && pour < 0.98 && <Haz a={[bx + 0.16, by + 0.02, 0.1]} b={[0.32, 0.42, 0.0]} r0={0.05} r1={0.035} c="#a9d4ea" o={0.75} add={false} />}
    <mesh position={[0.32, 0.43, 0.0]} rotation={[-P2, 0, 0]} scale={0.05 + 0.32 * ola}><ringGeometry args={[0.8, 1, 48]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.7 * (1 - ola)} depthWrite={false} /></mesh>
    {ola > 0.02 && ola < 0.9 && Array.from({ length: 10 }, (_, i) => { const a = i / 10 * 2 * P, q = ola;
      return <mesh key={i} position={[0.32 + Math.cos(a) * 0.15 * q, 0.45 + 0.16 * Math.sin(q * P), Math.sin(a) * 0.12 * q]} scale={0.015 * (1 - q)}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.9, "#bfe3f5")}</mesh>; })}
  </Estudio>;
}}</Stage>;

// 5 · EL VEREDICTO EN DOS TAZAS: una cubeta vierte en cada taza; la izquierda (rayos X, tapón visible en el tubo) sube hasta el borde y se queda;
// la derecha hace remolino y se va. Un foco se enciende sobre la de la derecha: la tuya
const AVeredicto: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const tilt = eio(tt, 0.3, 0.9), pour = cl((tt - 0.8) / 1.4), k = eio(tt, 1.0, 2.6), foco = eio(tt, 2.8, 3.5);
  return <Estudio t={tt} cam={[0.0, 0.85, 2.35]} look={[0, 0.55, -0.1]} orbit={0.01} mesa={false} fit={false}>
    <Pared z={-0.8} dim={0.4 - 0.2 * foco} />
    <Piso y={0} dim={0.6 - 0.2 * foco} />
    {[-1, 1].map((sd) => { const x = sd * 0.52;
      return <group key={sd}>
        <Inodoro p={[x, 0, -0.1]} s={0.92} x={sd < 0 ? 0.5 : 0} nivel={sd < 0 ? k : 0} tapon={sd < 0 ? 1 : 0} remolino={sd > 0 ? k * (1 - foco * 0.6) : 0} t={tt} />
        <Sombra p={[x, 0.002, -0.15]} r={0.4} />
        <group position={[x - 0.3, 0.98, 0.0]} rotation={[0, 0, -tilt * 1.5]}><Cubeta s={0.34} nivel={0.8 * (1 - pour)} agua="#8fc0dc" c="#2f6fb0" /></group>
        {pour > 0.02 && pour < 0.98 && <Haz a={[x - 0.17, 0.98, 0.0]} b={[x, 0.42, -0.05]} r0={0.04} r1={0.03} c="#a9d4ea" o={0.7} add={false} />}
      </group>; })}
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.52 + (rn(i, 1) - 0.5) * 0.4, 0.62 + 0.01 * Math.sin(tt * 3 + i), (rn(i, 2) - 0.5) * 0.3 - 0.1]} scale={0.015 * k + 0.0001}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#8a7a5a" roughness={1} /></mesh>)}
    <Haz a={[0.52, 1.75, 0.1]} b={[0.52, 0.0, -0.05]} r0={0.04} r1={0.55} c="#fff3c8" o={0.1 * foco} />
    <Halo p={[0.52, 0.02, 0.1]} r={0.6} o={0.5 * foco} />
  </Estudio>;
}}</Stage>;

// 6 · EL CANAL ESCONDIDO: el borde de vidrio grueso sobre fondo oscuro; el agua entra por el caño de atrás y corre en DOS BRAZOS continuos
// alrededor del anillo hasta encontrarse adelante; entonces cuelgan gotas de cada agujerito y caen
const ACanal: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false} tone="#0c1218">{(tt) => {
  const L = eio(tt, 0.5, 2.4) * P, drip = cl((tt - 2.4) / 0.4);
  return <Estudio t={tt} cam={[0.0, 0.58, 1.2]} look={[0, -0.06, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-1.0} c="#0b1117" />
    <mesh position={[0, -0.55, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.7, 48]} />{AGUA(0.5, "#5d8fb0")}</mesh>
    <Aro r={0.5} tube={0.075} vidrio />
    <mesh position={[0, 0.12, -0.6]} rotation={[0.5, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.36, 28]} /><meshPhysicalMaterial color="#dff1f6" roughness={0.02} clearcoat={1} transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[0, 0.12, -0.6]} rotation={[0.5, 0, 0]} scale={[1, cl(tt / 0.5) + 0.0001, 1]}><cylinderGeometry args={[0.05, 0.05, 0.36, 20]} />{AGUA(0.85, "#3f9ee0")}</mesh>
    {L > 0.01 && [1, -1].map((sd) => <group key={sd} rotation={[P2, 0, 0]}>
      <mesh rotation={[0, 0, sd > 0 ? -P2 : -P2 - L]}><torusGeometry args={[0.5, 0.048, 14, 96, L]} />{AGUA(0.9, "#3f9ee0")}</mesh>
      <mesh position={[Math.cos(-P2 + sd * L) * 0.5, Math.sin(-P2 + sd * L) * 0.5, 0]}><sphereGeometry args={[0.05, 16, 12]} />{AGUA(0.95, "#7cc4f0")}</mesh>
    </group>)}
    {drip > 0 && Array.from({ length: 16 }, (_, i) => { const a = i / 16 * 2 * P + 0.2, q = (tt * 0.9 + rn(i, 2)) % 1, cuelga = q < 0.45, y = cuelga ? -0.08 - 0.02 * (q / 0.45) : -0.1 - 0.42 * Math.pow((q - 0.45) / 0.55, 2);
      const [x, , z] = aroP(a, 0.5); return <mesh key={i} position={[x, y, z]} scale={[0.018 * drip, (cuelga ? 0.018 + 0.02 * q : 0.03) * drip, 0.018 * drip]}><sphereGeometry args={[1, 12, 10]} />{AGUA(0.9, "#9fd4f4")}</mesh>; })}
  </Estudio>;
}}</Stage>;

// 7 · EL ARRANQUE DEL SIFÓN: corte real de la taza y su sifón. Seis estados: reposo → el chorro del borde empuja y el nivel sube →
// el agua trepa la cresta → pasa la cresta y la columna llena la bajada (succión) → la taza se vacía con remolino y trago de aire → vuelve a llenarse
const SIF: V3[] = [[-0.3, -0.34, 0], [-0.12, -0.37, 0], [0.0, -0.27, 0], [0.07, 0.0, 0], [0.18, 0.1, 0], [0.3, 0.02, 0], [0.37, -0.28, 0], [0.4, -0.56, 0]];
const AArranque: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#10161e">{(tt) => {
  const cur = curva("sif", SIF);
  const uL = (L: number) => { for (let u = 0; u <= 0.56; u += 0.01) if (cur.getPointAt(u).y >= L) return u; return 0.56; };
  const jet1 = tt > 0.5 && tt < 1.5, crest = eio(tt, 1.5, 2.1), sif = eio(tt, 2.1, 3.2), refill = eio(tt, 3.5, 4.2);
  const L = tt < 0.5 ? -0.05 : tt < 1.5 ? lerp(-0.05, 0.1, eio(tt, 0.5, 1.5)) : tt < 2.1 ? 0.1 : tt < 3.5 ? lerp(0.1, -0.29, sif) : lerp(-0.29, -0.05, refill);
  const u1 = tt < 1.5 ? uL(L) : tt < 3.2 ? lerp(uL(0.1), 1, crest) : uL(L), ku = Math.round(u1 * 80);
  const ag = aguaCorte(L), flujo = tt > 2.1 && tt < 3.3, trago = eio(tt, 3.1, 3.5);
  return <Estudio t={tt} cam={[0.05, 0.02, 1.45]} look={[0.04, -0.12, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.7} c="#121a22" />
    <group position={[-0.3, 0, 0]}>
      <mesh geometry={tazaMitad()}>{LOZA(0.55)}</mesh>
      <BordeTaza />
      <mesh geometry={ag.back}>{AGUA(0.6, "#4f9fd8")}</mesh>
      <mesh geometry={ag.front} position={[0, 0, 0.001]}>{AGUA(0.85, "#3f8fd0")}</mesh>
      {flujo && Array.from({ length: 3 }, (_, i) => <mesh key={i} position={[0, L + 0.004, 0]} rotation={[-P2, 0, tt * 7 + i * 2.1]}><ringGeometry args={[0.04 + i * 0.07, 0.05 + i * 0.07, 32, 1, 0, 3.6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.6} depthWrite={false} /></mesh>)}
      {(jet1 || (refill > 0.01 && refill < 0.99)) && [-1, 1].map((sd) => <Chorro key={sd} a={[sd * 0.36, 0.14, -0.02]} b={[sd * 0.24, Math.max(L, -0.25), 0]} r={0.012} c="#bfe3f5" o={0.8} />)}
      {trago > 0.01 && trago < 0.99 && <mesh position={[0, lerp(-0.3, -0.05, trago), 0.02]} scale={0.05 * Math.sin(trago * P)}><sphereGeometry args={[1, 16, 12]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.5} roughness={0} clearcoat={1} /></mesh>}
    </group>
    <mesh geometry={memo("p4a:sifT", () => tuboGeo(muestra(cur, 0, 1, 40), 0.075, 80, 18))}>{LOZA(0.3)}</mesh>
    {ku > 0 && <mesh geometry={memo("p4a:sifA" + ku, () => tuboGeo(muestra(cur, 0, ku / 80, 28), 0.062, 60, 14))}>{AGUA(0.9, "#3f8fd0")}</mesh>}
    {flujo && Array.from({ length: 14 }, (_, i) => { const v = cur.getPointAt(((tt - 2.1) * 1.6 + i / 14) % 1); return <mesh key={i} position={[v.x, v.y, v.z + 0.02]} scale={0.014}><sphereGeometry args={[1, 8, 6]} />{GLOW("#ffffff", 0.85)}</mesh>; })}
    {crest > 0.05 && crest < 0.98 && <Halo p={[0.18, 0.1, 0.05]} r={0.16} c="#bfe3f5" o={0.9} />}
  </Estudio>;
}}</Stage>;

// 8 · LOS ANILLOS DEL SARRO: el agujerito en corte, centrado como un tronco cortado; con cada hoja del calendario que se arranca
// crece hacia adentro un anillo de costra ocre y rugosa, y la luz del agujero se achica
const AAnillos: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const hoja = (i: number) => eio(tt, 0.5 + i * 0.85, 0.5 + i * 0.85 + 0.55), n = [0, 1, 2, 3].reduce((s, i) => s + hoja(i), 0), cur = Math.min(3, Math.floor(n));
  const R0 = 0.36, w = 0.06;
  return <Estudio t={tt} cam={[0.28, 0.16, 1.32]} look={[0.12, 0.0, 0]} orbit={0.012} mesa={false} fit={false}>
    <Pared z={-0.5} dim={0.3} />
    <group position={[-0.18, 0, 0]} rotation={[0, 0.25, 0]}>
      <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.6, 0.6, 0.2, 64, 1, true]} /><meshPhysicalMaterial color="#f2f0ea" roughness={0.2} clearcoat={1} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0, 0.1]}><ringGeometry args={[R0, 0.6, 64]} /><meshPhysicalMaterial color="#f7f6f1" clearcoat={1} roughness={0.15} /></mesh>
      <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[R0, R0, 0.2, 64, 1, true]} /><meshStandardMaterial color="#d8d4ca" side={THREE.BackSide} /></mesh>
      {[0, 1, 2, 3].map((i) => { const g = hoja(i), ro = R0 - i * w, ri = ro - w * g;
        return g > 0.01 && <group key={i}>
          <mesh position={[0, 0, 0.1 + 0.004 * i]}><ringGeometry args={[ri, ro, 64]} /><meshStandardMaterial color={col(OCRE, OCRE2, i / 3)} roughness={1} /></mesh>
          {Array.from({ length: 26 }, (_, j) => { const a = j / 26 * 2 * P + i, rr = lerp(ri, ro, rn(j, i + 3));
            return <mesh key={j} position={[Math.cos(a) * rr, Math.sin(a) * rr, 0.1 + 0.004 * i]} scale={[w * 0.35 * g, w * 0.35 * g, 0.012 * g]}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color={col(OCRE, OCRE2, rn(j, 7))} roughness={1} flatShading /></mesh>; })}
          <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[ri, ri, 0.2, 64, 1, true]} /><meshStandardMaterial color={col(OCRE, OCRE2, i / 3)} roughness={1} side={THREE.BackSide} /></mesh>
        </group>; })}
      <mesh position={[0, 0, -0.1]}><circleGeometry args={[R0, 64]} /><meshBasicMaterial color="#0d0b0a" /></mesh>
      <Halo p={[0, 0, -0.09]} r={Math.max(0.02, (R0 - n * w) * 0.9)} c="#bfe3f5" o={0.5} />
    </group>
    <Calendario p={[0.68, 0.05, 0.05]} s={0.62 * IN(tt, 0.1) + 0.0001} rot={[0, -0.25, 0]} arranca={tt < 0.5 ? 0 : (n % 1)} dia={"AÑO " + (cur + 1)} mes="AGUA DURA" />
  </Estudio>;
}}</Stage>;

// 9 · EL RAYO DEL ESPEJITO: el borde visto desde abajo, con su fila de agujeritos; la linterna entra del costado con su cono de luz,
// rebota en el espejito de dentista (con mango) y el reflejo barre la fila: cada agujero que toca se ilumina y muestra si está tapado
const TAPADOS9 = [1, 2, 4, 5, 7];
const ARayo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#0d1218">{(tt) => {
  const ent = eio(tt, 0.2, 0.9), on = eio(tt, 0.9, 1.3), barre = eio(tt, 1.4, 3.9), tx = lerp(-0.8, 0.8, barre);
  const M0: V3 = [-0.05, -0.32, 0.32], L0: V3 = [lerp(1.3, 0.55, ent), -0.42, 0.45], T: V3 = [tx, 0.18, 0.05];
  return <Estudio t={tt} cam={[0.0, -0.45, 1.75]} look={[0, -0.05, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#151b22" />
    <BordeAgujeros p={[0, 0.26, 0]} n={9} sarro={1} tapados={TAPADOS9} t={tt} />
    {Array.from({ length: 9 }, (_, i) => { const x = -0.8 + 1.6 * i / 8, lit = on * cl(1 - Math.abs(x - tx) / 0.14);
      return lit > 0.01 && <Halo key={i} p={[x, 0.18, 0.06]} r={0.12} c={TAPADOS9.includes(i) ? "#fff3c0" : "#9fd4ff"} o={lit} />; })}
    <group position={M0} rotation={[-0.75 + 0.05 * Math.sin(tt), 0.0, -0.25 + 0.5 * barre]}><Espejito s={0.85} /></group>
    <group position={L0} rotation={[0, -1.3, 0.3]}><Linterna on={on} /></group>
    {on > 0.01 && <Haz a={L0} b={M0} r0={0.015} r1={0.035} c="#fff2b0" o={0.5 * on} />}
    {on > 0.01 && <Haz a={M0} b={T} r0={0.02} r1={0.04} c="#fff2b0" o={0.6 * on} />}
  </Estudio>;
}}</Stage>;

// 10 · EL ÁBACO: un ábaco de madera de verdad (marco, patas, varillas de metal); por cada agujerito revisado una cuenta corre con peso,
// rebota y queda: las oscuras (abiertos) arriba, las blancas (tapados) abajo; la fila blanca termina el doble de larga
const CERR10 = Array.from({ length: 18 }, (_, i) => rn(i, 5) < 0.66);
const AAbaco: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  return <Estudio t={tt} cam={[0.0, 0.14, 1.38]} look={[0, 0.0, 0]} orbit={0.012} mesa={false} fit={false}>
    <Pared z={-0.6} dim={0.45} />
    <Piso y={-0.4} dim={0.7} />
    <Sombra p={[0, -0.398, 0]} r={0.75} o={0.7} />
    {[-0.66, 0.66].map((x, i) => <group key={i}>
      <mesh position={[x, 0.0, 0]} castShadow><boxGeometry args={[0.07, 0.72, 0.08]} />{M.madera("#6b4a2e")}</mesh>
      <mesh position={[x, -0.38, 0]} castShadow><boxGeometry args={[0.1, 0.04, 0.3]} />{M.madera("#5a3c24")}</mesh>
    </group>)}
    {[0.33, -0.33].map((y, i) => <mesh key={i} position={[0, y, 0]} castShadow><boxGeometry args={[1.39, 0.06, 0.08]} />{M.madera("#7a5232")}</mesh>)}
    {[0.13, -0.13].map((y, r) => <mesh key={r} position={[0, y, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.008, 0.008, 1.3, 10]} />{M.cromo()}</mesh>)}
    {CERR10.map((c, i) => { const antes = CERR10.slice(0, i).filter((x) => x === c).length, despues = CERR10.slice(i + 1).filter((x) => x === c).length;
      const k = IN(tt, 0.3 + i * 0.19), x0 = -0.58 + despues * 0.072, x1 = 0.58 - antes * 0.072;
      return <mesh key={i} position={[lerp(x0, x1, k), c ? -0.13 : 0.13, 0]} rotation={[0, 0, P2]} castShadow><sphereGeometry args={[0.036, 24, 16]} /><meshPhysicalMaterial color={c ? "#f1ece0" : "#2a2420"} roughness={0.35} clearcoat={0.8} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 11 · LOS ESCALONES DEL VASO: la taza en corte con agua azul y su línea de nivel; cada vaso baja, sale cargado y se apila al costado,
// y el nivel baja un escalón (la regla lo marca); al final la esponja absorbe el último charco y se oscurece
const AEscalones: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const N = 5, paso = (i: number) => eio(tt, 0.35 + i * 0.6, 0.35 + i * 0.6 + 0.5), nv = Array.from({ length: N }, (_, i) => paso(i)).reduce((s, v) => s + v, 0);
  const esp = eio(tt, 3.4, 4.1), L = lerp(0.1, -0.24, nv / N) - 0.05 * esp;
  const ag = aguaCorte(Math.max(-0.31, L)), cur = Math.min(N - 1, Math.floor(nv)), fase = paso(cur);
  const vy = fase < 0.5 ? lerp(0.35, L - 0.02, fase * 2) : lerp(L - 0.02, 0.35, fase * 2 - 1), vx = fase < 0.5 ? 0 : lerp(0, 0.6, fase * 2 - 1);
  return <Estudio t={tt} cam={[0.08, 0.1, 1.3]} look={[0.12, -0.04, 0]} orbit={0.01} mesa={false} fit={false}>
    <Pared z={-0.55} dim={0.35} />
    <Piso y={-0.36} dim={0.6} />
    <group position={[-0.08, 0, 0]}>
      <mesh geometry={tazaMitad()}>{LOZA(0.75)}</mesh>
      <BordeTaza />
      {L > -0.31 && <><mesh geometry={ag.back}>{AGUA(0.65, "#3f8fd0")}</mesh><mesh geometry={ag.front} position={[0, 0, 0.001]}>{AGUA(0.88, "#3f8fd0")}</mesh>
        <mesh position={[0, L, 0.003]}><boxGeometry args={[Math.max(0.02, 2 * rb(L) - 0.02), 0.006, 0.002]} />{GLOW("#ffffff", 0.9)}</mesh></>}
      <group position={[-0.5, 0, 0]}>
        <mesh position={[0, -0.08, 0]}><boxGeometry args={[0.03, 0.5, 0.01]} /><meshStandardMaterial color="#f2c230" /></mesh>
        {Array.from({ length: N + 1 }, (_, i) => <mesh key={i} position={[0.03, lerp(0.1, -0.24, i / N), 0]}><boxGeometry args={[0.05, 0.006, 0.012]} /><meshBasicMaterial color="#1a1a1a" /></mesh>)}
        <mesh position={[0.07, L, 0]} rotation={[0, 0, -P2]}><coneGeometry args={[0.025, 0.05, 3]} />{GLOW(RED)}</mesh>
      </group>
    </group>
    {tt > 0.3 && tt < 3.4 && <group position={[-0.08 + vx, vy, 0.02]} rotation={[0, 0, fase > 0.5 ? 0 : 0.3]}><Vaso s={0.8} lleno={fase > 0.5 ? 0.9 : 0} /></group>}
    {Array.from({ length: Math.floor(nv) }, (_, i) => <group key={i} position={[0.55 + (i % 2) * 0.17, -0.36 + Math.floor(i / 2) * 0.17, 0]}><Vaso s={0.8} lleno={0.9} /></group>)}
    {esp > 0.01 && <group position={[-0.08, lerp(0.4, -0.27, Math.min(1, esp * 1.6)), 0.0]}><Esponja s={0.8} moja={esp} /></group>}
  </Estudio>;
}}</Stage>;

// 12 · LA CINTA DA LA VUELTA: el aro completo visto desde abajo con su fila de agujeritos oscuros; cada tira plateada llega tangente,
// un pulgar de luz la aprieta de punta a punta y los agujeros que cubre desaparecen
const ACinta: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#10161e">{(tt) => {
  const NS = 8, seg = 2 * P / NS, k = (i: number) => eio(tt, 0.3 + i * 0.45, 0.3 + i * 0.45 + 0.42);
  return <Estudio t={tt} cam={[0.0, -0.92, 0.78]} look={[0, -0.02, 0]} orbit={0.01} mesa={false} fit={false}>
    <mesh position={[0, 0.25, 0]} rotation={[P2, 0, 0]}><circleGeometry args={[2.5, 32]} /><meshStandardMaterial color="#1a2028" side={THREE.DoubleSide} /></mesh>
    <Aro r={0.52} tube={0.08}>
      {Array.from({ length: 24 }, (_, i) => { const a = (i + 0.5) / 24 * 2 * P; return <mesh key={i} position={aroP(a, 0.52, -0.081)} rotation={[P2, 0, 0]}><circleGeometry args={[0.022, 18]} /><meshBasicMaterial color="#120f0d" side={THREE.DoubleSide} /></mesh>; })}
    </Aro>
    {Array.from({ length: NS }, (_, i) => { const g = k(i), a0 = i * seg + 0.02, arc = (seg - 0.04) * g;
      return g > 0.01 && <group key={i} rotation={[P2, 0, 0]}>
        <mesh rotation={[0, 0, a0]}><torusGeometry args={[0.52, 0.086, 20, 40, arc]} />{CINTA()}</mesh>
      </group>; })}
    {Array.from({ length: NS }, (_, i) => { const g = k(i); if (g <= 0.01 || g >= 0.99) return null; const a = i * seg + 0.02 + (seg - 0.04) * g, [x, , z] = aroP(a, 0.52);
      return <group key={"p" + i}><mesh position={[x, -0.1, z]} scale={0.045}><sphereGeometry args={[1, 16, 12]} />{GLOW("#fff1c8", 0.8)}</mesh><Halo p={[x, -0.11, z]} r={0.12} o={0.8} /></group>; })}
    {Array.from({ length: NS }, (_, i) => { const g = k(i); if (g > 0.05) return null; const a = i * seg + 0.02, sl = eio(tt, 0.3 + i * 0.45 - 0.35, 0.3 + i * 0.45);
      const [x, , z] = aroP(a, 0.52); return sl > 0.01 && <mesh key={"l" + i} position={[x + Math.sin(a) * 0.3 * (1 - sl), -0.1 - 0.15 * (1 - sl), z - Math.cos(a) * 0.3 * (1 - sl)]} rotation={[P2, 0, -a]}><planeGeometry args={[0.06, 0.16]} />{CINTA()}</mesh>; })}
  </Estudio>;
}}</Stage>;

// 13 · SEGUNDOS CONTRA HORAS: dos relojes de arena grandes llenos de vinagre ámbar; sin cinta se vacía entero mientras su contador de rodillos
// llega a 5 s; con cinta casi no baja y su contador gira hasta 8 h
const ASegundos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#14110e">{(tt) => {
  const a = eio(tt, 0.4, 2.4), b = eio(tt, 0.4, 3.9) * 0.12, ca = a * 5, cb = eio(tt, 0.6, 3.9) * 8, ent = IN(tt, 0.1) + 0.0001;
  const reloj = (k: number, x: number, rojo: boolean) => <group position={[x, 0.08, 0]} scale={ent}>
    {[1, -1].map((s) => <mesh key={s} position={[0, s * 0.18, 0]} rotation={[s > 0 ? P : 0, 0, 0]}><coneGeometry args={[0.24, 0.36, 40, 1, true]} /><meshPhysicalMaterial color="#e8f2f4" roughness={0.03} clearcoat={1} transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} /></mesh>)}
    <mesh position={[0, 0.03 + 0.16 * (1 - k), 0]}><cylinderGeometry args={[0.02 + 0.17 * (1 - k), 0.012, 0.3 * (1 - k) + 0.001, 32]} />{VINAGRE(0.9)}</mesh>
    <mesh position={[0, -0.36 + 0.13 * k, 0]}><coneGeometry args={[0.2 * Math.sqrt(k) + 0.001, 0.26 * k + 0.001, 32]} />{VINAGRE(0.9)}</mesh>
    {k > 0.01 && k < 0.99 && <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.006, 0.006, 0.24, 8]} />{VINAGRE(0.9)}</mesh>}
    {[0.39, -0.39].map((y, i) => <mesh key={i} position={[0, y, 0]} castShadow><cylinderGeometry args={[0.28, 0.28, 0.05, 40]} />{M.madera("#6b4a2e")}</mesh>)}
    {[0, 1, 2].map((j) => { const an = j / 3 * 2 * P + 0.5; return <mesh key={j} position={[Math.cos(an) * 0.25, 0, Math.sin(an) * 0.25]}><cylinderGeometry args={[0.014, 0.014, 0.76, 10]} />{M.madera("#5a3c24")}</mesh>; })}
    <Halo p={[0, -0.25, 0.25]} r={0.3} c={rojo ? "#ff9a8a" : "#a8f0b0"} o={0.25} />
  </group>;
  return <Estudio t={tt} cam={[0.0, -0.02, 1.62]} look={[0, -0.06, 0]} orbit={0.01} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#17130f" />
    <Piso y={-0.62} dim={0.35} />
    {reloj(a, -0.46, true)}{reloj(b, 0.46, false)}
    <Tambores p={[-0.46, -0.5, 0.15]} val={ca} n={1} s={0.42} sufijo="s" />
    <Tambores p={[0.46, -0.5, 0.15]} val={cb} n={1} s={0.42} sufijo="h" />
  </Estudio>;
}}</Stage>;

// 14 · LA RUTA DEL REBOSE: cámara alta sobre el tanque y la taza en rayos X; un pulso amarillo grueso con estela baja por el tubo de rebose,
// cruza a la taza y enciende el canal del borde como un anillo que se cierra
const RUTA: V3[] = [[0.08, 1.16, -0.44], [0.08, 0.86, -0.44], [0.07, 0.7, -0.42], [0.0, 0.64, -0.36], [0.0, 0.61, -0.31]];
const ARuta: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false} tone="#0d1218">{(tt) => {
  const cur = curva("ruta", RUTA), k = eio(tt, 0.4, 2.2), r = eio(tt, 2.2, 3.6), kk = Math.round(k * 80), u0 = Math.max(0, kk / 80 - 0.3);
  const head = cur.getPointAt(Math.min(0.999, k));
  return <Estudio t={tt} cam={[0.75, 1.8, 1.5]} look={[0, 0.58, -0.18]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-1.2} c="#0c1117" />
    <Piso y={0} dim={0.22} />
    <Inodoro x={0.85} corteTq={1} t={tt} />
    <mesh position={[0.08, 0.95, -0.44]}><cylinderGeometry args={[0.022, 0.022, 0.42, 16]} /><meshPhysicalMaterial color="#e8f2f4" transparent opacity={0.4} roughness={0.05} /></mesh>
    {kk > 0 && kk < 80 && <><mesh geometry={memo("p4a:rutaS" + kk, () => tuboGeo(muestra(cur, u0, Math.max(u0 + 0.01, kk / 80), 16), 0.045, 40, 12))}>{GLOW("#ffd36a", 0.85)}</mesh>
      <mesh position={[head.x, head.y, head.z]}><sphereGeometry args={[0.07, 16, 12]} />{GLOW("#fff1b0")}</mesh><Halo p={[head.x, head.y, head.z + 0.02]} r={0.26} c="#ffd36a" /></>}
    {r > 0.01 && [1, -1].map((sd) => <group key={sd} position={[0, 0.605, 0]} rotation={[P2, 0, 0]}>
      <mesh rotation={[0, 0, sd > 0 ? -P2 : -P2 - P * r]}><torusGeometry args={[0.31, 0.035, 10, 80, P * r]} />{GLOW("#ffd36a", 0.9)}</mesh>
      <mesh position={[Math.cos(-P2 + sd * P * r) * 0.31, Math.sin(-P2 + sd * P * r) * 0.31, 0]}><sphereGeometry args={[0.04, 14, 10]} />{GLOW("#fff1b0")}</mesh>
    </group>)}
    {r > 0.98 && <Halo p={[0, 0.62, 0]} r={0.6} c="#ffd36a" o={0.4 + 0.2 * Math.sin(tt * 6)} />}
  </Estudio>;
}}</Stage>;

// 15 · VINAGRE CONTRA PIEDRA: un charco de vinagre ámbar con menisco brillante sobre pizarra; la piedra caliza rugosa burbujea
// y se achica en escalones, y el charco se va poniendo gris (el ácido se gasta)
const ACaliza: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#121417">{(tt) => {
  const k = eio(tt, 0.4, 3.9), esc = Math.floor(k * 4) / 4 + (k * 4 % 1) * 0.075, s = 0.17 * (1 - 0.75 * k) * (1 - 0.04 * Math.sin(esc * 40));
  return <Estudio t={tt} cam={[0.0, 0.36, 0.82]} look={[0, 0.0, 0]} orbit={0.012} mesa={false} fit={false}>
    <mesh position={[0, -0.02, 0]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#2b2e33" roughness={0.85} /></mesh>
    <mesh position={[0, -0.015, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.42, 64]} />{VINAGRE(0.5, col(AMBAR, "#8d8a82", k))}</mesh>
    <mesh position={[0, -0.016, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.42, 0.008, 8, 96]} /><meshPhysicalMaterial color="#ffffff" roughness={0} clearcoat={1} transparent opacity={0.6} /></mesh>
    <mesh position={[0, -0.02 + s * 0.6, 0]} scale={s} geometry={rocaGeo()} castShadow><meshStandardMaterial color={SARRO} roughness={1} flatShading /></mesh>
    <Sombra p={[0, -0.012, 0]} r={s * 1.6} o={0.6} />
    {Array.from({ length: 36 }, (_, i) => { const q = (tt * (0.9 + rn(i, 4) * 0.6) + rn(i, 3)) % 1, a = rn(i, 1) * 2 * P, rr = s * (0.8 + 0.4 * rn(i, 2));
      return <mesh key={i} position={[Math.cos(a) * rr, -0.01 + q * 0.22, Math.sin(a) * rr]} scale={(0.012 + 0.01 * rn(i, 5)) * (1 - k * 0.6)}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.75 * (1 - q)} roughness={0} clearcoat={1} /></mesh>; })}
    {Array.from({ length: 4 }, (_, i) => { const q = cl((k * 4 - i - 0.9) * 3); return q > 0.01 && q < 0.99 && <mesh key={"c" + i} position={[0, -0.014, 0]} rotation={[-P2, 0, 0]} scale={0.1 + 0.3 * q}><ringGeometry args={[0.9, 1, 48]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.5 * (1 - q)} depthWrite={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 16 · EL VINAGRE SE CANSA: botella de vidrio con vinagre ámbar y su menisco; granos de sarro caen DENTRO, burbujean y se disuelven
// mientras el líquido se enturbia y gris; una jarra vierte la segunda tanda y el ámbar vuelve
const ACansa: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#13110f">{(tt) => {
  const usa = eio(tt, 0.3, 2.4), pour = eio(tt, 2.7, 3.9), tilt = eio(tt, 2.4, 2.8) * (1 - eio(tt, 3.9, 4.2)), f = cl(usa - pour);
  const lv = 0.38 - 0.08 * usa * (1 - pour);
  return <Estudio t={tt} cam={[0.0, 0.14, 1.38]} look={[0.05, 0.08, 0]} orbit={0.012} mesa={false} fit={false}>
    <Fondo z={-0.6} c="#16130f" />
    <mesh position={[0, -0.36, 0]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[3, 2]} />{M.madera("#5e3d24")}</mesh>
    <Sombra p={[0, -0.358, 0]} r={0.22} />
    <mesh geometry={memo("p4a:botC", () => lathe([[0.001, -0.35], [0.16, -0.35], [0.17, -0.33], [0.17, 0.12], [0.13, 0.24], [0.06, 0.32], [0.055, 0.42], [0.001, 0.42]], 48))}><meshPhysicalMaterial color="#eef4f2" roughness={0.03} clearcoat={1} transparent opacity={0.28} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[0, -0.34 + lv / 2, 0]}><cylinderGeometry args={[0.158, 0.158, lv, 40]} />{VINAGRE(0.62 + 0.25 * f, col(AMBAR, "#7d7a74", f))}</mesh>
    <mesh position={[0, -0.34 + lv, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.152, 0.006, 8, 64]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.55} roughness={0} /></mesh>
    {Array.from({ length: 14 }, (_, i) => { const a = 0.3 + i * 0.13, q = cl((tt - a) / 0.5), dis = cl((tt - a - 0.5) / 0.8);
      const x = (rn(i, 1) - 0.5) * 0.18, z = (rn(i, 2) - 0.5) * 0.12, yb = -0.3 + rn(i, 3) * 0.1, y = q < 1 ? lerp(0.55, yb, q * q) : yb;
      return tt > a && dis < 1 && <group key={i}><mesh position={[x, y, z]} scale={0.036 * (1 - dis) + 0.0001}><dodecahedronGeometry args={[1]} /><meshStandardMaterial color={SARRO} roughness={1} flatShading /></mesh>
        {q >= 1 && Array.from({ length: 3 }, (_, j) => { const b = (tt * 1.5 + j / 3) % 1; return <mesh key={j} position={[x + 0.01 * j, y + b * 0.25, z]} scale={0.006 * (1 - dis) + 0.0001}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.7 * (1 - b)} /></mesh>; })}</group>; })}
    <group position={[0.42, 0.5, 0]} rotation={[0, 0, tilt * 1.4]} scale={IN(tt, 2.3) * 0.8 + 0.0001}>
      <mesh geometry={memo("p4a:jarra", () => lathe([[0.001, -0.12], [0.1, -0.12], [0.11, 0.08], [0.12, 0.13], [0.001, 0.13]], 36))}><meshPhysicalMaterial color="#eef4f2" roughness={0.03} transparent opacity={0.35} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.098, 0.098, 0.14 * (1 - pour) + 0.001, 32]} />{VINAGRE(0.85)}</mesh>
      <mesh position={[0.13, 0.0, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.06, 0.012, 8, 24, P]} /><meshPhysicalMaterial color="#eef4f2" transparent opacity={0.5} /></mesh>
    </group>
    {pour > 0.01 && pour < 0.99 && <Haz a={[0.3, 0.55, 0]} b={[0.02, 0.0, 0]} r0={0.018} r1={0.014} c={AMBAR} o={0.85} add={false} />}
  </Estudio>;
}}</Stage>;

// 17 · EL TRAPO QUE ABRAZA EL AGUJERO: la pared de la taza en corte con el agujero del chorro rodeado de una dona de sarro;
// un trapo con pliegues, empapado, baja y la cubre; gotas de vinagre bajan; al levantarlo, la dona se encogió y el agujero respira
const ATrapo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const pose = eio(tt, 0.3, 1.2), dis = eio(tt, 1.4, 3.5), lev = eio(tt, 3.4, 4.1);
  const tg = memo("p4a:trapoG", () => { const g = new THREE.PlaneGeometry(0.46, 0.36, 40, 30), p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, 0.014 * Math.sin(x * 26 + Math.sin(y * 11) * 1.6) + 0.008 * Math.sin(y * 34 + x * 7) - 0.1 * Math.max(0, 1 - (x * x + y * y) / 0.012)); }
    g.computeVertexNormals(); return g; });
  return <Estudio t={tt} cam={[0.0, 0.5, 0.98]} look={[0, -0.04, 0]} orbit={0.012} mesa={false} fit={false}>
    <Pared z={-0.6} dim={0.35} />
    <group rotation={[-0.25, 0, 0]}>
      <mesh position={[0, -0.13, 0]} receiveShadow><boxGeometry args={[1.2, 0.08, 0.7]} />{LOZA()}</mesh>
      <mesh position={[0, -0.13, 0]}><cylinderGeometry args={[0.065, 0.065, 0.082, 32]} /><meshBasicMaterial color="#120f0d" /></mesh>
      {Array.from({ length: 22 }, (_, i) => { const a = i / 22 * 2 * P, rr = 0.1 + 0.02 * rn(i, 1), sz = (0.03 + 0.012 * rn(i, 2)) * (1 - 0.85 * dis);
        return <mesh key={i} position={[Math.cos(a) * rr * (1 - 0.25 * dis), -0.088, Math.sin(a) * rr * (1 - 0.25 * dis)]} scale={[sz, sz * 0.7, sz]}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color={col(SARRO, "#cfc6ae", rn(i, 3))} roughness={1} flatShading /></mesh>; })}
      <mesh position={[0, lerp(0.42, -0.084, pose) + 0.3 * lev, 0]} rotation={[-P2, 0, 0.4]} geometry={tg} castShadow><meshStandardMaterial color={col("#7a6650", "#4e3e2c", pose)} roughness={0.95} side={THREE.DoubleSide} /></mesh>
      {pose > 0.95 && lev < 0.2 && Array.from({ length: 6 }, (_, i) => <Gota key={i} p={[-0.2 + i * 0.08, -0.09, 0.2 + rn(i, 2) * 0.05]} k={(tt * 0.9 + i / 6) % 1} h={0.02} c={AMBAR} />)}
      {dis > 0.05 && lev < 0.5 && Array.from({ length: 10 }, (_, i) => { const q = (tt * 1.2 + rn(i, 4)) % 1, a = rn(i, 5) * 2 * P;
        return <mesh key={"b" + i} position={[Math.cos(a) * 0.1, -0.085 + q * 0.05, Math.sin(a) * 0.1]} scale={0.006}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.7 * (1 - q)} /></mesh>; })}
      {lev > 0.6 && <Halo p={[0, -0.07, 0.02]} r={0.18 * lev} c="#bfe3f5" o={lev} />}
    </group>
  </Estudio>;
}}</Stage>;

// 18 · LA RAYA JUNTA EL DOBLE: cámara macro baja sobre dos placas de porcelana; caen gotas de agua dura: en la lisa resbalan y dejan apenas una huella,
// en la rayada se meten al surco y la costra crece el doble de alta; un contador de rodillos pasa de ×1 a ×2
const ARayas: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const gotas = [0.3, 0.9, 1.5, 2.1, 2.7], gk = (a: number) => cl((tt - a) / 0.35), g = gotas.reduce((s, a) => s + cl((tt - a - 0.35) / 0.4), 0) / gotas.length;
  return <Estudio t={tt} cam={[0.0, 0.42, 1.22]} look={[0, 0.02, 0]} orbit={0} mesa={false} fit={false}>
    <Pared z={-0.6} dim={0.3} />
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.33, -0.06, 0]}>
      <mesh receiveShadow castShadow><boxGeometry args={[0.56, 0.05, 0.5]} />{sd < 0 ? <meshPhysicalMaterial color="#4a5058" roughness={0.15} clearcoat={1} /> : LOZA()}</mesh>
      {sd > 0 && <><mesh position={[0, 0.0255, 0.02]} rotation={[-P2, 0, 0.35]}><planeGeometry args={[0.5, 0.04]} /><meshBasicMaterial color="#3d372f" /></mesh>
        {Array.from({ length: 30 }, (_, i) => { const u = (i / 29 - 0.5) * 0.46, on = cl(g * 1.3 - Math.abs(u) * 0.8), hh = 0.055 * on * (0.7 + 0.5 * rn(i, 2));
          return <mesh key={i} position={[u * Math.cos(0.35), 0.026 + hh / 2, 0.02 - u * Math.sin(0.35)]} scale={[0.022, hh + 0.0005, 0.022]}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color={SARRO} roughness={1} flatShading /></mesh>; })}</>}
      {sd < 0 && Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.3, 0.0262, 0.08 + (rn(i, 4) - 0.5) * 0.2]} rotation={[-P2, 0, 0]} scale={g * 0.9 + 0.0001}><circleGeometry args={[0.012, 14]} /><meshBasicMaterial color="#d9d3c2" /></mesh>)}
      {gotas.map((a, i) => { const k = gk(a), x = (rn(i, sd + 5) - 0.5) * 0.2, slide = cl((tt - a - 0.35) / 0.6);
        return <group key={i}>{k > 0 && k < 1 && <Gota p={[x, 0.03, 0.02]} k={k} h={0.35} c="#cfe8f5" />}
          {sd < 0 && k >= 1 && slide < 1 && <mesh position={[x, 0.034, 0.02 + slide * 0.3]} scale={[0.024, 0.01, 0.03 + 0.02 * slide]}><sphereGeometry args={[1, 14, 10]} />{AGUA(0.8 * (1 - slide), "#cfe8f5")}</mesh>}</group>; })}
    </group>)}
    <Tambores p={[0, 0.34, -0.2]} val={1 + eio(tt, 2.9, 3.6)} n={1} s={0.55 * IN(tt, 0.5) + 0.0001} prefijo="×" />
  </Estudio>;
}}</Stage>;

// 19 · LAS CUATRO CAUSAS EN EL TANQUE (items): tanque en corte; 1 la regla en el agua muestra el nivel 2-3 cm bajo la marca; 2 la cadena floja
// se ilumina; 3 el sapito cierra antes de tiempo, con un reloj de arena que se vacía al lado; 4 un tubo al lavabo con una burbuja: glu glu
const reglaTex = () => ctex("p4a:regla", 64, 512, (g) => { g.fillStyle = "#f2c230"; g.fillRect(0, 0, 64, 512); g.fillStyle = "#1a1a1a";
  for (let c = 0; c <= 25; c++) { const y = 500 - c * 19.5; g.fillRect(0, y, c % 5 ? 14 : 30, 2); } g.fillStyle = "#c0392b"; g.fillRect(0, 500 - 20 * 19.5 - 2, 64, 5); });
const VENT: V3[] = [[-0.25, 0.3, -0.35], [-0.5, 0.32, -0.35], [-0.62, 0.55, -0.35], [-0.66, 0.85, -0.3]];
const ACuatro: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const a = [0, 1, 2, 3].map((i) => AT(h, i, 1.4)), on = (i: number) => IN(tt, a[i]) + 0.0001, v = (i: number) => tt > a[i];
  const z4 = cl((tt - a[3]) / 0.8), cam: V3 = [lerp(0.5, 0.25, z4), 1.12, lerp(1.0, 1.35, z4)];
  const sapo = v(2) ? 0.5 + 0.5 * Math.cos(Math.min(P, (tt - a[2]) * 3.5)) : 0, arena = cl((tt - a[2]) / 0.9), cv = curva("vent", VENT);
  const q4 = ((tt - a[3]) * 0.9) % 1, p4 = cv.getPointAt(Math.max(0, Math.min(0.999, q4)));
  return <Estudio t={tt} cam={cam} look={[-0.05, 0.88, -0.4]} orbit={0.01} mesa={false} fit={false}>
    <Pared z={-0.75} dim={0.45} />
    <Inodoro corteTq={1} t={tt} tq={0.72} sapo={sapo} cadena={v(1) ? 0.9 : 0.5} />
    {v(0) && <group position={[-0.2, 0.88, -0.36]} scale={on(0)}>
      <mesh><boxGeometry args={[0.05, 0.4, 0.008]} /><meshStandardMaterial map={reglaTex()} roughness={0.5} /></mesh>
      <mesh position={[0, 0.0, 0.006]}><boxGeometry args={[0.1, 0.006, 0.004]} />{GLOW("#3fa0ff")}</mesh>
      <Halo p={[0, 0.02, 0.02]} r={0.1} c="#9fd4ff" o={0.35} />
    </group>}
    {v(1) && <><Cadena a={[0.16, 1.08, -0.34]} b={[0.02, 0.73, -0.36]} flojo={0.9} n={12} c="#ffd36a" /><Halo p={[0.1, 0.92, -0.3]} r={0.12 * on(1)} c="#ffd36a" o={0.35} /></>}
    {v(2) && <group position={[0.22, 0.78, -0.3]} scale={0.32 * on(2)}>
      {[1, -1].map((s) => <mesh key={s} position={[0, s * 0.12, 0]} rotation={[s > 0 ? P : 0, 0, 0]}><coneGeometry args={[0.15, 0.24, 28, 1, true]} /><meshPhysicalMaterial color="#e8f2f4" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} /></mesh>)}
      <mesh position={[0, 0.03 + 0.1 * (1 - arena), 0]}><cylinderGeometry args={[0.01 + 0.1 * (1 - arena), 0.01, 0.18 * (1 - arena) + 0.001, 20]} /><meshStandardMaterial color="#e2c16e" /></mesh>
      <mesh position={[0, -0.22 + 0.08 * arena, 0]}><coneGeometry args={[0.13 * Math.sqrt(arena) + 0.001, 0.16 * arena + 0.001, 20]} /><meshStandardMaterial color="#e2c16e" /></mesh>
      {[0.26, -0.26].map((y, i) => <mesh key={i} position={[0, y, 0]}><cylinderGeometry args={[0.18, 0.18, 0.03, 24]} />{M.madera()}</mesh>)}
    </group>}
    {v(2) && <Halo p={[0, 0.7, -0.38]} r={0.14} c={RED} o={0.6 * on(2)} />}
    {v(3) && <>
      <mesh geometry={memo("p4a:ventT", () => tuboGeo(VENT, 0.035, 50, 12))}><meshPhysicalMaterial color="#e8f2f4" transparent opacity={0.4} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh position={[-0.7, 0.9, -0.28]}><cylinderGeometry args={[0.2, 0.14, 0.1, 32, 1, true]} /><meshPhysicalMaterial color="#f7f6f1" clearcoat={1} side={THREE.DoubleSide} /></mesh>
      <mesh position={[p4.x, p4.y, p4.z]} scale={0.03 * on(3)}><sphereGeometry args={[1, 14, 10]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.85} roughness={0} clearcoat={1} /></mesh>
      {q4 > 0.85 && <mesh position={[-0.7, 0.92, -0.28]} scale={0.05 + 0.2 * (q4 - 0.85) / 0.15}><ringGeometry args={[0.8, 1, 32]} /><meshBasicMaterial color="#9fd0ee" transparent opacity={0.7} side={THREE.DoubleSide} /></mesh>}
    </>}
  </Estudio>;
}}</Stage>;

// 20 · LOS CINCO ERRORES A LA BASURA (items): destornillador real, botella de cloro con tapa azul, pastilla de cloro, garrafa de ácido con calavera
// y la palanca que se jala 3 veces; al nombrarlo, cada uno cae al bote (la tapa se abre y cierra de golpe) y la tablita suma una muesca
const calavera = () => ctex("p4a:calav", 256, 256, (g) => { g.fillStyle = "#f2c230"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#151515";
  g.beginPath(); g.arc(128, 110, 52, 0, 2 * P); g.fill(); g.fillRect(100, 140, 56, 34);
  g.fillStyle = "#f2c230"; g.beginPath(); g.arc(108, 108, 14, 0, 2 * P); g.arc(148, 108, 14, 0, 2 * P); g.fill(); g.fillRect(112, 160, 6, 14); g.fillRect(126, 160, 6, 14); g.fillRect(140, 160, 6, 14);
  g.strokeStyle = "#151515"; g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); g.moveTo(60, 190); g.lineTo(196, 236); g.moveTo(196, 190); g.lineTo(60, 236); g.stroke(); });
const Destornillador: React.FC = () => <group rotation={[0, 0, 0.7]}>
  <mesh position={[0, -0.12, 0]} castShadow><cylinderGeometry args={[0.034, 0.03, 0.16, 8]} /><meshPhysicalMaterial color="#d6362c" roughness={0.3} clearcoat={0.8} /></mesh>
  {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[Math.cos(i / 8 * 2 * P) * 0.033, -0.12, Math.sin(i / 8 * 2 * P) * 0.033]}><boxGeometry args={[0.006, 0.15, 0.006]} /><meshStandardMaterial color="#a32820" /></mesh>)}
  <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.009, 0.009, 0.22, 12]} />{M.cromo()}</mesh>
  <mesh position={[0, 0.18, 0]} scale={[1, 1, 0.3]}><cylinderGeometry args={[0.004, 0.012, 0.03, 12]} />{M.cromo()}</mesh>
</group>;
const Error5: React.FC<{ i: number }> = ({ i }) => {
  if (i === 0) return <Destornillador />;
  if (i === 1) return <Botellon s={0.5} vidrio={false} bg="#f6f6f2" tapa="#1f6fe0" tx={["CLORO", "BLANQUEADOR"]} ink="#1f6fe0" />;
  if (i === 2) return <group rotation={[0.9, 0, 0]}><mesh castShadow><cylinderGeometry args={[0.09, 0.09, 0.04, 36]} /><meshStandardMaterial color="#f4f6f7" roughness={0.9} /></mesh>
    <mesh position={[0, 0.021, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.03, 0.06, 32]} /><meshStandardMaterial color="#5aa7e6" /></mesh></group>;
  if (i === 3) return <group><mesh castShadow geometry={memo("p4a:garrafa", () => lathe([[0.001, 0], [0.13, 0], [0.14, 0.03], [0.14, 0.26], [0.09, 0.33], [0.05, 0.36], [0.05, 0.4], [0.001, 0.4]], 6))}><meshStandardMaterial color="#f0e6c8" roughness={0.6} /></mesh>
    <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.055, 0.055, 0.05, 16]} /><meshStandardMaterial color="#c0392b" /></mesh>
    <mesh position={[0, 0.16, 0.122]}><planeGeometry args={[0.15, 0.15]} /><meshBasicMaterial map={calavera()} toneMapped={false} /></mesh>
    <mesh position={[0.14, 0.27, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.05, 0.014, 8, 20, P]} /><meshStandardMaterial color="#f0e6c8" /></mesh></group>;
  return <group><mesh position={[0, 0, -0.03]}><boxGeometry args={[0.1, 0.1, 0.04]} />{M.cromo()}</mesh>
    <mesh position={[0.08, 0.0, 0]} rotation={[0, 0, -0.15]}><boxGeometry args={[0.18, 0.03, 0.03]} />{M.cromo()}</mesh>
    {[0, 1, 2].map((j) => <mesh key={j} position={[0.05, 0.0, 0.02]} rotation={[0, 0, 0.4]}><torusGeometry args={[0.12 + j * 0.05, 0.006, 6, 30, 1.0]} />{GLOW(RED, 0.9 - j * 0.2)}</mesh>)}</group>;
};
const AErrores: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const a = [0, 1, 2, 3, 4].map((i) => AT(h, i, 1.3) + 0.3), dn = (i: number) => cl((tt - a[i]) / 0.6);
  const abre = a.some((x) => tt > x - 0.15 && tt < x + 0.55) ? 1 : 0, slam = a.some((x) => tt > x + 0.55 && tt < x + 0.75);
  const n = a.filter((x) => tt > x + 0.6).length;
  return <Estudio t={tt} cam={[0.0, -0.02, 2.0]} look={[0, -0.06, 0]} orbit={0.01} mesa={false} fit={false}>
    <Pared z={-0.65} dim={0.42} />
    <Piso y={-0.5} dim={0.65} />
    <Bote p={[0.1, -0.5, 0]} s={0.62} abre={abre} />
    <Sombra p={[0.1, -0.498, 0]} r={0.25} />
    {slam && Array.from({ length: 8 }, (_, i) => { const an = i / 8 * 2 * P; return <mesh key={i} position={[0.1 + Math.cos(an) * 0.22, -0.13, Math.sin(an) * 0.1]} scale={0.012}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#cfc8b8" /></mesh>; })}
    <group position={[-0.62, -0.28, 0]}>
      <mesh castShadow><boxGeometry args={[0.32, 0.42, 0.03]} />{M.madera("#8a6038")}</mesh>
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-0.1 + i * 0.05, 0.0, 0.017]} rotation={[0, 0, i === 4 ? 1.1 : 0]} scale={[1, i === 4 ? 1.5 : 1, 1]} visible={i < n}><boxGeometry args={[0.014, 0.22, 0.006]} />{GLOW(RED)}</mesh>)}
    </group>
    {[0, 1, 2, 3, 4].map((i) => { const x0 = -0.72 + i * 0.36, d = dn(i), y = lerp(0.32, -0.25, d * d), x = lerp(x0, 0.1, eio(d, 0, 0.6));
      return d < 1 && <group key={i} position={[x, y + (i === 1 || i === 3 ? -0.12 : 0), 0]} rotation={[0, 0.4 * Math.sin(tt + i), d * 1.8]} scale={IN(tt, 0.2 + i * 0.12) * 0.95 + 0.0001}><Error5 i={i} /></group>; })}
  </Estudio>;
}}</Stage>;

// 21 · LA RUEDA DE LOS MESES: una rueda gruesa de madera con los 12 meses grabados gira bajo un indicador; cae una gota de cera roja
// con peso sobre ENERO y otra sobre JULIO (agua dura: cada 6 meses); con agua blanda la segunda se enfría y se cae
const ruedaTex = () => ctex("p4a:rueda", 1024, 1024, (g) => {
  g.fillStyle = "#d9b98a"; g.fillRect(0, 0, 1024, 1024);
  for (let r = 40; r < 520; r += 22) { g.strokeStyle = `rgba(110,70,30,${0.12 + 0.08 * Math.sin(r)})`; g.lineWidth = 3; g.beginPath(); g.arc(512, 512, r, 0, 2 * P); g.stroke(); }
  const M12 = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 78px Inter, Arial, sans-serif";
  M12.forEach((m, i) => { const a = -P2 + i / 12 * 2 * P; g.save(); g.translate(512 + Math.cos(a) * 380, 512 + Math.sin(a) * 380); g.rotate(a + P2);
    g.fillStyle = "rgba(255,240,215,0.6)"; g.fillText(m, 2, 3); g.fillStyle = "#4a2e14"; g.fillText(m, 0, 0); g.restore();
    g.strokeStyle = "#4a2e14"; g.lineWidth = 6; const b = a + P / 12; g.beginPath(); g.moveTo(512 + Math.cos(b) * 300, 512 + Math.sin(b) * 300); g.lineTo(512 + Math.cos(b) * 470, 512 + Math.sin(b) * 470); g.stroke(); }); });
const Cera: React.FC<{ k: number; a: number; off?: number }> = ({ k, a, off = 0 }) => { if (k <= 0) return null;
  const rr = 0.36, x = -Math.sin(a) * rr, y = Math.cos(a) * rr;
  return k >= 1 ? <group position={[x, y - off * 0.5, 0.082 + off * 0.2]} rotation={[0, 0, a]} scale={[1 - off * 0.3, 1, 1]}>
    <mesh position={[0.012, -0.012, -0.004]} scale={[0.1, 0.1, 1]}><circleGeometry args={[1, 24]} /><meshBasicMaterial color="#000" transparent opacity={0.35} /></mesh>
    <mesh scale={[0.095, 0.095, 0.03]}><sphereGeometry args={[1, 24, 16]} /><meshPhysicalMaterial color={col("#c21f1f", "#8a6a6a", off)} roughness={0.25} clearcoat={0.8} /></mesh>
    {[0, 1, 2, 3, 4].map((j) => <mesh key={j} position={[Math.cos(j * 1.3) * 0.07, Math.sin(j * 1.3) * 0.07, 0]} scale={[0.02, 0.02, 0.01]}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color={col("#c21f1f", "#8a6a6a", off)} roughness={0.25} /></mesh>)}
  </group> : <mesh position={[0, lerp(0.9, rr, k * k), 0.12]} scale={[0.06, 0.08, 0.06]}><sphereGeometry args={[1, 16, 12]} /><meshPhysicalMaterial color="#c21f1f" roughness={0.2} clearcoat={1} /></mesh>; };
const AMeses: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const rot = eio(tt, 1.2, 2.4) * P, d1 = cl((tt - 0.4) / 0.5), d2 = cl((tt - 2.5) / 0.5), cae = eio(tt, 3.4, 4.1);
  return <Estudio t={tt} cam={[0.0, 0.1, 1.62]} look={[0, 0.04, 0]} orbit={0.012} mesa={false} fit={false}>
    <Pared z={-0.4} dim={0.35} />
    <group scale={0.8} position={[lerp(-1.8, 0, eio(tt, 0, 0.4)), 0, 0]}>
      <group rotation={[0, 0, rot + (1 - eio(tt, 0, 0.4)) * 4]}>
        <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.48, 0.48, 0.14, 72]} />{M.madera("#8a5e34")}</mesh>
        <mesh position={[0, 0, 0.0705]}><circleGeometry args={[0.47, 72]} /><meshStandardMaterial map={ruedaTex()} roughness={0.7} /></mesh>
        <mesh position={[0, 0, 0.08]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.02, 24]} />{M.hierro()}</mesh>
        {d1 >= 1 && <Cera k={1} a={0} />}
        {d2 >= 1 && <Cera k={1} a={-P} off={cae} />}
      </group>
      {d1 < 1 && <Cera k={d1} a={0} />}
      {d2 < 1 && <Cera k={d2} a={0} />}
      <mesh position={[0, 0.55, 0.08]} rotation={[0, 0, P]}><coneGeometry args={[0.045, 0.1, 3]} />{M.cromo("#c9933e")}</mesh>
    </group>
  </Estudio>;
}}</Stage>;

// 22 · EL CORAZÓN DEL INODORO: dentro del tanque en corte late un corazón anatómico, opaco, con sus arterias; con cada latido empuja un chorro
// visible a la taza y en el piso una línea de pulso luminosa dibuja el ritmo
const corazonGeo = () => memo("p4a:cor", () => { const g = new THREE.SphereGeometry(1, 48, 36), p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { let x = p.getX(i), y = p.getY(i), z = p.getZ(i); const lob = 1 + 0.25 * Math.max(0, y) * Math.cos(x * 3.2);
    const punta = y < 0 ? 1 - 0.55 * (-y) : 1; x *= punta * lob; z *= punta * 0.8; y = y * 1.15 - (y < 0 ? 0.25 * y * y : 0); p.setXYZ(i, x + 0.15 * y * (y < 0 ? 1 : 0), y, z); }
  g.computeVertexNormals(); return g; });
const ecg = (x: number) => { const ph = ((x + 0.9) / 1.8 * 4) % 1; return ph > 0.42 && ph < 0.46 ? 0.1 * Math.sin((ph - 0.42) / 0.04 * P) : ph > 0.46 && ph < 0.5 ? -0.04 * Math.sin((ph - 0.46) / 0.04 * P) : ph > 0.62 && ph < 0.72 ? 0.02 * Math.sin((ph - 0.62) / 0.1 * P) : 0; };
const ACorazon: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#120e0e">{(tt) => {
  const beats = [0.5, 1.5, 2.5, 3.5], bt = beats.reduce((m, b) => Math.max(m, Math.exp(-Math.pow((tt - b) / 0.09, 2)) + 0.5 * Math.exp(-Math.pow((tt - b - 0.22) / 0.07, 2))), 0);
  const jet = beats.reduce((m, b) => Math.max(m, cl(1 - Math.abs(tt - b - 0.2) / 0.3)), 0), dib = eio(tt, 0.3, 4.0);
  const N = Math.max(2, Math.floor(160 * dib)), pts = Array.from({ length: N }, (_, i) => { const x = -0.9 + 1.8 * i / 159; return [x * 0.75, 1.32 + ecg(x) * 1.8, -0.8] as V3; });
  return <Estudio t={tt} cam={[0.5, 1.05, 1.15]} look={[0, 0.78, -0.3]} orbit={0.012} mesa={false} fit={false}>
    <Pared z={-0.85} dim={0.16} />
    <Piso y={0} dim={0.35} />
    <Inodoro corteTq={1} t={tt} remolino={jet} />
    <Sombra p={[0, 0.002, -0.1]} r={0.45} />
    <group position={[0, 0.9, -0.44]} scale={0.2 * (1 + 0.25 * bt)} rotation={[0.1, 0.3, 0.25]}>
      <mesh geometry={corazonGeo()} castShadow><meshPhysicalMaterial color="#9e1f22" roughness={0.42} clearcoat={0.6} emissive="#3a0606" emissiveIntensity={0.4 + 0.6 * bt} /></mesh>
      <mesh position={[0.25, 1.1, 0]} rotation={[0, 0, -0.4]}><cylinderGeometry args={[0.2, 0.24, 0.6, 20]} /><meshPhysicalMaterial color="#b8302c" roughness={0.4} clearcoat={0.5} /></mesh>
      <mesh position={[-0.3, 1.0, 0.1]} rotation={[0.2, 0, 0.5]}><cylinderGeometry args={[0.15, 0.18, 0.5, 18]} /><meshPhysicalMaterial color="#3b4f8a" roughness={0.45} /></mesh>
      {[0, 1, 2].map((j) => <mesh key={j} position={[-0.2 + j * 0.25, 0.2 - j * 0.3, 0.75]} rotation={[0, 0, 0.6 - j * 0.4]}><torusGeometry args={[0.35, 0.025, 6, 20, 1.6]} /><meshStandardMaterial color="#5e1012" roughness={0.6} /></mesh>)}
    </group>
    <Halo p={[0, 0.9, -0.3]} r={0.3 * (0.5 + bt)} c="#ff6a5a" o={0.5 * bt} />
    {jet > 0.02 && <Haz a={[0, 0.66, -0.36]} b={[0, 0.42, -0.02]} r0={0.05} r1={0.03} c="#9fd3ec" o={0.8 * jet} add={false} />}
    {jet > 0.02 && <mesh position={[0, 0.41, 0]} rotation={[-P2, 0, 0]} scale={0.05 + 0.15 * jet}><ringGeometry args={[0.8, 1, 40]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.6 * jet} depthWrite={false} /></mesh>}
    {N > 2 && <mesh geometry={memo("p4a:ecg" + N, () => tuboGeo(pts, 0.012, Math.max(8, N * 2), 6))}>{GLOW(VER)}</mesh>}
    {N > 2 && <Halo p={[pts[N - 1][0], pts[N - 1][1], -0.79]} r={0.1} c={VER} o={0.9} />}
  </Estudio>;
}}</Stage>;

// 23 · EL REPASO EN EL BORDE (items): el aro grueso del borde visto desde arriba con ocho agujeros grandes tapados de sarro blanco;
// con cada paso del resumen el tapón de uno salta, el agujero queda oscuro y suelta su chorro a la taza (sin placas ni números)
const ARecap: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#10161e">{(tt) => {
  const a = Array.from({ length: 8 }, (_, i) => AT(h, i, 0.55, 0.5)), op = (i: number) => cl((tt - a[i]) / 0.35);
  return <Estudio t={tt} cam={[0.0, 1.45, 0.95]} look={[0, -0.12, 0]} orbit={0.012} mesa={false} fit={false}>
    <mesh position={[0, -0.42, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[1.6, 48]} /><meshStandardMaterial color="#1b232c" /></mesh>
    <mesh position={[0, -0.32, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.42, 48]} />{AGUA(0.8, "#4f9fd8")}</mesh>
    <mesh position={[0, -0.18, 0]}><cylinderGeometry args={[0.5, 0.4, 0.3, 64, 1, true]} /><meshPhysicalMaterial color="#e9e7e0" roughness={0.2} clearcoat={1} side={THREE.DoubleSide} /></mesh>
    <Aro r={0.52} tube={0.09} />
    {Array.from({ length: 8 }, (_, i) => { const an = i / 8 * 2 * P + P / 8, o = op(i), [x, , z] = aroP(an, 0.52, 0), vuelo = cl((tt - a[i]) / 0.7);
      return <group key={i}>
        <mesh position={[x, 0.0905, z]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.03, 0.045, 28]} /><meshStandardMaterial color="#c9c4b6" roughness={0.4} /></mesh>
        <mesh position={[x, 0.0908, z]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.03, 24]} /><meshBasicMaterial color={col("#e9e4d2", "#0f0d0c", o)} /></mesh>
        {vuelo < 1 && <mesh position={[x * (1 + 0.6 * vuelo), 0.1 + 0.3 * Math.sin(vuelo * P) - 0.2 * vuelo * vuelo, z * (1 + 0.6 * vuelo)]} rotation={[vuelo * 5, vuelo * 3, 0]} scale={[0.045, 0.022, 0.045]}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color={SARRO} roughness={1} flatShading /></mesh>}
        {o > 0.6 && Array.from({ length: 6 }, (_, j) => { const q = (tt * 1.4 + j / 6 + i * 0.13) % 1; return <mesh key={"g" + j} position={[x * (1 - 0.55 * q), 0.06 - 0.38 * q * q, z * (1 - 0.55 * q)]} scale={[0.014, 0.022, 0.014]}><sphereGeometry args={[1, 10, 8]} />{AGUA(0.9, "#9fd0ee")}</mesh>; })}
        {o > 0.6 && <mesh position={[x * 0.35, -0.315, z * 0.35]} rotation={[-P2, 0, 0]} scale={0.03 + 0.03 * ((tt * 2 + i * 0.3) % 1)}><ringGeometry args={[0.7, 1, 24]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.6 * (1 - ((tt * 2 + i * 0.3) % 1))} depthWrite={false} /></mesh>}
        {o > 0.01 && o < 1 && <Halo p={[x, 0.11, z]} r={0.14} o={1 - o} />}
      </group>; })}
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  a_notapado: ANoTapado, a_contador: AContador, a_compras: ACompras, a_altura: AAltura, a_veredicto: AVeredicto, a_canal: ACanal, a_arranque: AArranque,
  a_anillos: AAnillos, a_rayo: ARayo, a_abaco: AAbaco, a_escalones: AEscalones, a_cinta: ACinta, a_segundos: ASegundos, a_ruta: ARuta, a_caliza: ACaliza,
  a_cansa: ACansa, a_trapo: ATrapo, a_rayas: ARayas, a_cuatro: ACuatro, a_errores: AErrores, a_meses: AMeses, a_corazon: ACorazon, a_recap: ARecap,
};
