// chen29d · «Lo que Nadie Te Dice del Invierno en un Rancho de Michoacán»: componentes 3D únicos (1 por minuto, ninguno
// repetido en la tanda chen29). v2 (29-oct, vuelta 1 del evaluador): el objeto clave GRANDE y cerca, la acción arranca en el
// primer medio segundo, frío = cintas/volutas azules con cuerpo (no puntitos), calor = resplandor que llena, sin carteles chicos.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, phys, Stage } from "./ckit";
import { ctex, Estudio, fall, lathe, M, papel, RBox, rn, V3, Yute } from "./estudio3d";
import { Chorro, Mano, Olla } from "./kit3d";
import { Moneda } from "./kit29";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;
const FRIO = "#7fb8e8", CALOR = "#ff8a3a";
const esfGeo = new THREE.SphereGeometry(1, 20, 14);
const sombraTexD = () => ctex("sombraRD", 128, 128, (g) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, "rgba(0,0,0,.6)"); r.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });
const SombraD: React.FC<{ p: V3; r: number; o?: number }> = ({ p, r, o = 1 }) => <mesh position={[p[0], (p[1] ?? 0) + 0.004, p[2]]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={sombraTexD()} transparent opacity={o} depthWrite={false} /></mesh>;
// pie descalzo: planta, talón, cinco dedos y tobillo
const Pie: React.FC<{ p: V3; rot?: V3; c: THREE.Color | string; s?: number }> = ({ p, rot, c, s = 1 }) => { const m = <meshStandardMaterial color={c} roughness={0.6} />;
  return <group position={p} rotation={rot} scale={s}>
    <mesh position={[0, 0.045, 0]} scale={[0.1, 0.05, 0.2]} geometry={esfGeo} castShadow>{m}</mesh>
    <mesh position={[0, 0.05, -0.15]} scale={[0.08, 0.06, 0.08]} geometry={esfGeo} castShadow>{m}</mesh>
    {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[-0.06 + i * 0.03, 0.03, 0.2 - Math.abs(i - 0.6) * 0.012]} scale={[0.016 + (i === 0 ? 0.008 : 0) - i * 0.0015, 0.018, 0.022]} geometry={esfGeo} castShadow>{m}</mesh>)}
    <mesh position={[0, 0.2, -0.12]} castShadow><cylinderGeometry args={[0.06, 0.07, 0.3, 16]} />{m}</mesh></group>; };
const dur = (h: H) => Math.max(3, h.out - h.at);
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k));
// letrero grande dentro de la escena (≤5 palabras, legible en celular)
const Etq: React.FC<{ p: V3; rot?: V3; txt: string[]; w?: number; h?: number; bg?: string; ink?: string }> = ({ p, rot = [-0.35, 0, 0], txt, w = 0.7, h = 0.3, bg = "#f1ead6", ink = "#2a1c12" }) =>
  <mesh position={p} rotation={rot} castShadow><planeGeometry args={[w, h]} /><meshStandardMaterial map={papel("e" + txt.join("|") + bg, txt, { w: 512, h: Math.round(512 * h / w), bg, ink, size: Math.min(150, Math.round(512 * h / w / (txt.length + 0.25))) })} roughness={0.9} side={THREE.DoubleSide} /></mesh>;
// texturas
const rayas = (k: string, a: string, b: string, n = 6) => ctex("ry" + k, 256, 256, (g) => { g.fillStyle = a; g.fillRect(0, 0, 256, 256); g.fillStyle = b; for (let i = 0; i < n; i++) g.fillRect(0, (i + 0.3) * 256 / n, 256, 256 / n * 0.35); for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(255,255,255,${0.04 + (i % 7) * 0.01})`; g.fillRect((i * 97) % 256, (i * 61) % 256, 2, 1); } });
const tejido = (k: string, c: string) => ctex("tj" + k, 256, 256, (g) => { g.fillStyle = c; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(0,0,0,.22)"; g.lineWidth = 3; for (let x = 0; x < 256; x += 16) for (let y = 0; y < 256; y += 12) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 8, y + 10); g.lineTo(x + 16, y); g.stroke(); } });
const jean = () => ctex("jean", 256, 256, (g) => { g.fillStyle = "#33507a"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(255,255,255,.09)"; g.lineWidth = 1; for (let i = -256; i < 256; i += 5) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 256, 256); g.stroke(); } g.strokeStyle = "#c9913a"; g.setLineDash([8, 6]); g.lineWidth = 3; g.beginPath(); g.moveTo(0, 128); g.lineTo(256, 128); g.stroke(); });
const petateTex = () => ctex("petate2", 256, 256, (g) => { g.fillStyle = "#d4b170"; g.fillRect(0, 0, 256, 256); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { g.fillStyle = (x + y) % 2 ? "#b8924e" : "#e2c486"; g.fillRect(x * 16 + 1, y * 16 + 1, (x + y) % 2 ? 14 : 15, (x + y) % 2 ? 15 : 14); } });
const adobeTex = () => ctex("adobe29d", 512, 512, (g) => { g.fillStyle = "#b58a62"; g.fillRect(0, 0, 512, 512); for (let y = 0; y < 8; y++) for (let x = 0; x < 5; x++) { g.fillStyle = `rgb(${165 + ((x * 7 + y * 13) % 25)},${122 + ((x * 11 + y * 5) % 20)},${88 + ((x + y) % 15)})`; g.fillRect(x * 110 + (y % 2) * 55 - 20, y * 64 + 3, 104, 58); } });
const humoTex = () => ctex("humo29d", 128, 128, (g) => { const r = g.createRadialGradient(64, 64, 4, 64, 64, 62); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.5, "rgba(255,255,255,.45)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });
// volutas con color (frío, humo, calor): sprites que suben y se abren
const Voluta: React.FC<{ t: number; p: V3; c?: string; n?: number; h?: number; o?: number; s?: number; spread?: number; dir?: V3 }> = ({ t, p, c = "#f4efe6", n = 14, h = 1, o = 0.4, s = 0.3, spread = 0.15, dir = [0, 1, 0] }) => <group position={p}>
  {Array.from({ length: n }, (_, i) => { const per = 1.8 + rn(i, 1) * 1.2, k = ((t + rn(i, 2) * per) % per) / per, sc = s * (0.45 + k * 1.7);
    return <sprite key={i} position={[dir[0] * k * h + (rn(i, 4) - 0.5) * spread + Math.sin(t * 1.3 + i) * 0.06 * k, dir[1] * k * h, dir[2] * k * h + (rn(i, 5) - 0.5) * spread]} scale={[sc, sc, 1]}>
      <spriteMaterial map={humoTex()} color={c} transparent opacity={o * Math.sin(k * P)} depthWrite={false} /></sprite>; })}</group>;
// cinta de aire frío: tubo translúcido que avanza por una curva (k = cuánto recorrió) y ondula
const Cinta: React.FC<{ pts: V3[]; k: number; t: number; r?: number; c?: string; o?: number }> = ({ pts, k, t, r = 0.022, c = FRIO, o = 0.55 }) => {
  if (k <= 0.02) return null;
  const cur = new THREE.CatmullRomCurve3(pts.map((q, i) => new THREE.Vector3(q[0], q[1] + Math.sin(t * 3 + i) * 0.015, q[2])));
  const sub = new THREE.CatmullRomCurve3(cur.getPoints(40).slice(0, Math.max(2, Math.round(40 * cl(k)))));
  return <group><mesh geometry={new THREE.TubeGeometry(sub, 40, r, 10)}><meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} transparent opacity={o} depthWrite={false} /></mesh>
    <mesh geometry={new THREE.TubeGeometry(sub, 40, r * 2.2, 10)}><meshBasicMaterial color={c} transparent opacity={o * 0.18} depthWrite={false} /></mesh></group>;
};
const Adobe: React.FC<{ p?: V3; s: V3; rot?: V3; glow?: number; gc?: string }> = ({ p, s, rot, glow = 0, gc = CALOR }) => <RBox p={p} s={s} r={0.02} rot={rot}><meshStandardMaterial map={adobeTex()} roughness={0.95} emissive={gc} emissiveIntensity={glow * 0.55} /></RBox>;
// puerta vieja de tablas con rendijas entre tabla y tabla
const PuertaVieja: React.FC<{ p: V3; abre?: number; w?: number; h?: number }> = ({ p, abre = 0, w = 0.56, h = 1.12 }) => <group position={p}><group rotation={[0, -abre * 1.5, 0]}>
  {Array.from({ length: 5 }, (_, i) => <RBox key={i} p={[w / 10 + i * w / 5, h / 2 + (i % 2) * 0.01, 0]} s={[w / 5 - 0.012, h - 0.02 - (i % 3) * 0.015, 0.045]} r={0.006}>{M.madera(i % 2 ? "#6a4428" : "#5e3c22")}</RBox>)}
  {[0.22, 0.85].map((y) => <RBox key={y} p={[w / 2, y * h, 0.03]} s={[w * 0.95, 0.07, 0.02]} r={0.005}>{M.madera("#4e321c")}</RBox>)}
  <mesh position={[w * 0.85, h * 0.5, 0.05]} scale={0.022} geometry={esfGeo}>{M.hierro()}</mesh></group></group>;
const Brasero: React.FC<{ p: V3; t: number; s?: number; on?: number }> = ({ p, t, s = 1, on = 1 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.14, 0]} castShadow><cylinderGeometry args={[0.2, 0.13, 0.17, 20]} />{M.hierro()}</mesh>
  {[0, 1, 2].map((i) => <mesh key={i} position={[Math.cos(i * 2.1) * 0.11, 0.03, Math.sin(i * 2.1) * 0.11]} rotation={[0, 0, (i - 1) * 0.3]}><cylinderGeometry args={[0.012, 0.012, 0.1, 6]} />{M.hierro()}</mesh>)}
  {Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.24, 0.23 + rn(i, 2) * 0.04, (rn(i, 3) - 0.5) * 0.24]} scale={0.04} geometry={esfGeo}><meshStandardMaterial color="#2a1a12" emissive="#ff4a10" emissiveIntensity={on * (0.7 + 0.4 * Math.sin(t * 2 + i))} /></mesh>)}
  <pointLight position={[0, 0.4, 0]} intensity={on * 1.2} color={CALOR} distance={1.6} /></group>;
const Cama: React.FC<{ p?: V3; rot?: V3; children?: React.ReactNode; s?: number }> = ({ p, rot, children, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <RBox p={[0, 0.2, 0]} s={[1.0, 0.1, 0.6]} r={0.01}>{M.madera("#5a3a22")}</RBox>
  <RBox p={[-0.5, 0.42, 0]} s={[0.05, 0.5, 0.6]} r={0.01}>{M.madera("#5a3a22")}</RBox>
  {[[-0.47, -0.27], [0.47, -0.27], [-0.47, 0.27], [0.47, 0.27]].map(([x, z], i) => <RBox key={i} p={[x, 0.1, z]} s={[0.05, 0.2, 0.05]} r={0.01}>{M.madera("#5a3a22")}</RBox>)}
  <RBox p={[0, 0.3, 0]} s={[0.96, 0.1, 0.56]} r={0.04}><meshStandardMaterial color="#e8e2d4" roughness={0.9} /></RBox>
  <RBox p={[-0.36, 0.38, 0]} s={[0.18, 0.07, 0.4]} r={0.03}><meshStandardMaterial color="#f4f0e6" roughness={0.9} /></RBox>{children}</group>;
const Lana: React.FC<{ p?: V3; s: V3; k: string; a: string; b: string; rot?: V3 }> = ({ p, s, k, a, b, rot }) => <RBox p={p} s={s} r={Math.min(0.02, s[1] / 2)} rot={rot}><meshStandardMaterial map={rayas(k, a, b)} roughness={1} /></RBox>;
const Gallina: React.FC<{ p: V3; ry?: number; pica?: number; glow?: number; t: number; i: number }> = ({ p, ry = 0, pica = 0, glow = 0, t, i }) => { const pl = <meshStandardMaterial color="#8a4a22" roughness={0.85} emissive={CALOR} emissiveIntensity={glow * 0.3} />;
  return <group position={p} rotation={[0, ry, 0]} scale={1.25}>
    <mesh position={[0, 0.13, 0]} scale={[0.13, 0.1, 0.09]} geometry={esfGeo} castShadow>{pl}</mesh>
    {[-1, 1].map((s) => <mesh key={s} position={[-0.01, 0.13, s * 0.075]} rotation={[s * 0.2, 0, -0.3]} scale={[0.09, 0.055, 0.02]} geometry={esfGeo}><meshStandardMaterial color="#6a3416" roughness={0.9} /></mesh>)}
    {Array.from({ length: 5 }, (_, j) => <mesh key={j} position={[-0.13, 0.2 + j * 0.008, (j - 2) * 0.018]} rotation={[(j - 2) * 0.25, 0, 0.9 - j * 0.05]} scale={[0.03, 0.08, 0.008]} geometry={esfGeo}><meshStandardMaterial color={j % 2 ? "#3a1a0a" : "#5a2a12"} roughness={0.8} /></mesh>)}
    <group position={[0.11, 0.2, 0]} rotation={[0, 0, -pica + 0.1 * Math.sin(t * 5 + i)]}><mesh position={[0, 0.03, 0]} scale={[0.05, 0.06, 0.045]} geometry={esfGeo}>{pl}</mesh>
      <mesh position={[0.05, 0.03, 0]} rotation={[0, 0, -P2]}><coneGeometry args={[0.013, 0.035, 6]} /><meshStandardMaterial color="#e0a030" /></mesh>
      {[0, 1, 2].map((j) => <mesh key={j} position={[-0.01 + j * 0.015, 0.09 - Math.abs(j - 1) * 0.01, 0]} scale={[0.01, 0.018, 0.006]} geometry={esfGeo}><meshStandardMaterial color="#c0392b" /></mesh>)}
      <mesh position={[0.035, 0.0, 0]} scale={[0.008, 0.016, 0.005]} geometry={esfGeo}><meshStandardMaterial color="#c0392b" /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[0.025, 0.04, s * 0.04]} scale={0.007} geometry={esfGeo}><meshBasicMaterial color="#111" /></mesh>)}</group>
    {[-1, 1].map((s) => <mesh key={s} position={[0, 0.03, s * 0.035]}><cylinderGeometry args={[0.007, 0.007, 0.07, 6]} /><meshStandardMaterial color="#d8a030" /></mesh>)}</group>; };
const Mazorca: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => <group position={p} scale={s}>{Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[(i - 2.5) * 0.06, 0.03, (i % 2) * 0.03]} rotation={[0, 0, P2]}><capsuleGeometry args={[0.025, 0.12, 4, 10]} /><meshStandardMaterial color="#f0c040" roughness={0.6} /></mesh>)}</group>;
const Vela: React.FC<{ p: V3; t: number; dob?: number; s?: number }> = ({ p, t, dob = 0, s = 1 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.035, 0.038, 0.2, 16]} /><meshStandardMaterial color="#f4efe2" roughness={0.5} /></mesh>
  <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.07, 0.07, 0.012, 20]} />{M.barro("#7a4a2a")}</mesh>
  <group position={[0, 0.21, 0]} rotation={[0, 0, dob]}><mesh position={[0, 0.035, 0]} scale={[0.02, 0.045 + 0.006 * Math.sin(t * 17), 0.02]} geometry={esfGeo}><meshBasicMaterial color="#ffd27a" /></mesh>
    <mesh position={[0, 0.03, 0]} scale={[0.01, 0.022, 0.01]} geometry={esfGeo}><meshBasicMaterial color="#fff6dc" /></mesh></group>
  <pointLight position={[0, 0.3, 0.05]} intensity={0.9} color="#ffb060" distance={1.2} /></group>;

// ── 1 · HIELO EN MICHOACÁN (0:19): la ventana de cerca: cristales de escarcha crecen desde el marco hacia el centro y el termómetro baja a cero
const H1Hielo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const baja = eio(tt, 0, 4.6), esc = eio(tt, 0, 3.4), vaho = 0.5 + 0.5 * Math.sin(tt * 1.7);
  const esq: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  const hielo = <meshPhysicalMaterial color="#f6fcff" emissive="#cfe8ff" emissiveIntensity={0.55} roughness={0.08} clearcoat={1} />;
  return <Estudio t={tt} cam={[0.05, 0.95, 1.5]} look={[0.12, 0.88, 0]} orbit={0.12} fov={36}>
    <Adobe p={[0.2, 0.85, -0.12]} s={[2.2, 1.5, 0.16]} />
    <RBox p={[0.35, 0.9, -0.02]} s={[0.84, 0.84, 0.07]} r={0.01}>{M.madera("#6a4428")}</RBox>
    <mesh position={[0.35, 0.9, 0.02]}><planeGeometry args={[0.72, 0.72]} /><meshPhysicalMaterial color="#16243a" roughness={0.04} clearcoat={1} /></mesh>
    <mesh position={[0.55, 1.08, 0.022]} scale={0.07} geometry={esfGeo}><meshBasicMaterial color="#e8eef8" /></mesh>
    <mesh position={[0.35, 0.9, 0.03]}><planeGeometry args={[0.72, 0.72]} /><meshBasicMaterial color="#dcecf6" transparent opacity={0.06 + 0.16 * esc} depthWrite={false} /></mesh>
    {esq.map(([sx, sy], c) => Array.from({ length: 13 }, (_, i) => { const a0 = Math.atan2(-sy, -sx) + (rn(i + c * 20, 1) - 0.5) * 1.35, L = (0.1 + 0.26 * rn(i + c * 20, 2)) * cl(esc * 1.3 - rn(i + c * 20, 3) * 0.3);
      if (L < 0.005) return null;
      return <group key={c * 20 + i} position={[0.35 + sx * 0.355, 0.9 + sy * 0.355, 0.036]} rotation={[0, 0, a0]}>
        <mesh position={[L / 2, 0, 0]}><boxGeometry args={[L, 0.007, 0.004]} />{hielo}</mesh>
        {[0.3, 0.52, 0.74].map((f) => [-1, 1].map((sg) => { const l = L * 0.32 * (1 - f * 0.6); return <mesh key={f + "" + sg} position={[L * f + Math.cos(sg * 0.75) * l / 2, Math.sin(sg * 0.75) * l / 2, 0]} rotation={[0, 0, sg * 0.75]}><boxGeometry args={[l, 0.004, 0.003]} />{hielo}</mesh>; }))}</group>; }))}
    {Array.from({ length: 5 }, (_, i) => <sprite key={i} position={[0.2 + i * 0.07, 0.75 + rn(i, 7) * 0.2, 0.05]} scale={[0.18 + 0.1 * vaho, 0.12 + 0.06 * vaho, 1]}><spriteMaterial map={humoTex()} color="#eef6ff" transparent opacity={0.16 * (0.4 + 0.6 * vaho)} depthWrite={false} /></sprite>)}
    <group position={[-0.42, 0.9, 0.08]}>
      <RBox s={[0.22, 0.96, 0.05]} r={0.03}><meshStandardMaterial color="#f4efe2" /></RBox>
      <mesh position={[0, 0.02, 0.04]}><cylinderGeometry args={[0.024, 0.024, 0.78, 12]} />{M.vidrio()}</mesh>
      <mesh position={[0, -0.4, 0.04]} scale={0.055} geometry={esfGeo}><meshStandardMaterial color="#d0302a" emissive="#a01a10" emissiveIntensity={0.4} /></mesh>
      <mesh position={[0, -0.37 + lerp(0.62, 0.12, baja) / 2, 0.04]} scale={[1, lerp(0.62, 0.12, baja), 1]}><cylinderGeometry args={[0.014, 0.014, 1, 8]} /><meshStandardMaterial color="#d0302a" emissive="#a01a10" emissiveIntensity={0.4} /></mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0.06, -0.3 + i * 0.09, 0.03]}><boxGeometry args={[0.045, 0.007, 0.002]} /><meshBasicMaterial color="#2a1c12" /></mesh>)}
      <Etq p={[0, -0.6, 0.06]} rot={[0, 0, 0]} txt={[`${Math.max(0, Math.round(lerp(14, -1, baja)))}°`]} w={0.26} h={0.17} bg="#dcecf8" ink="#123a6a" /></group>
    <pointLight position={[0.35, 0.9, 0.5]} intensity={0.5 + 0.4 * esc} color="#bcd8f4" distance={1.6} />
  </Estudio>;
}}</Stage>;

// ── 2 · LAS DIEZ COSAS (0:56): la casita de adobe abierta, azul de frío por dentro; caen diez cosas del invierno de a una y con cada una se entibia
const H2Diez: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const T0 = 0.35, dt = 0.62, n = cl((tt - T0) / (dt * 10)), tib = cl(Math.floor(Math.max(0, tt - T0 - 0.45) / dt + 1) / 10);
  const slot = (i: number): V3 => [(i % 5 - 2) * 0.24, 0, i < 5 ? 0.12 : -0.16];
  const obj = (i: number, el: React.ReactNode) => { const a = T0 + i * dt; if (tt < a) return null; const [x, , z] = slot(i);
    return <group key={i} position={[x, fall(tt, a, 1.1) + 0.02, z]} rotation={[0, (rn(i, 1) - 0.5) * 0.8, 0]}>{el}</group>; };
  return <Estudio t={tt} cam={[0.1, 1.35, 2.15]} look={[0, 0.3, -0.05]} orbit={0.12}>
    <Adobe p={[0, 0.38, -0.42]} s={[1.5, 0.76, 0.1]} glow={tib * 0.7} /><Adobe p={[-0.72, 0.38, -0.1]} s={[0.08, 0.76, 0.66]} glow={tib * 0.7} /><Adobe p={[0.72, 0.38, -0.1]} s={[0.08, 0.76, 0.66]} glow={tib * 0.7} />
    <mesh position={[0, 0.84, -0.12]} rotation={[0.28, 0, 0]}><boxGeometry args={[1.62, 0.04, 0.82]} /><meshStandardMaterial color="#a8442a" roughness={0.8} /></mesh>
    <mesh position={[0, 0.006, -0.1]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.44, 0.66]} /><meshStandardMaterial color={col("#6a86a8", "#c89a68", tib)} roughness={0.95} /></mesh>
    <pointLight position={[0, 0.45, 0.1]} intensity={0.3 + tib * 1.8} color={col(FRIO, CALOR, tib).getStyle()} distance={1.8} />
    {[
      <Lana key="c" p={[0, 0.05, 0]} s={[0.2, 0.09, 0.15]} k="d1" a="#7a2a22" b="#e8c070" />,
      <mesh key="p" position={[0, 0.045, 0]} rotation={[P2, 0, P2]}><cylinderGeometry args={[0.045, 0.045, 0.22, 16]} /><meshStandardMaterial map={petateTex()} roughness={1} /></mesh>,
      <mesh key="g" position={[0, 0.0, 0]} scale={[0.085, 0.075, 0.085]}><sphereGeometry args={[1, 20, 10, 0, P * 2, 0, P2]} /><meshStandardMaterial map={tejido("g2", "#2f5a8a")} roughness={1} /></mesh>,
      <RBox key="l" p={[0, 0.035, 0]} s={[0.18, 0.07, 0.09]} r={0.008}><meshStandardMaterial color="#b0503a" roughness={0.9} /></RBox>,
      <group key="b"><mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.035, 0.035, 0.15, 14]} />{M.vidrio()}</mesh><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.03, 0.03, 0.1, 14]} />{M.liquido("#e8b080", 0.7)}</mesh></group>,
      <Vela key="v" p={[0, 0, 0]} t={tt} s={0.6} />,
      <Olla key="o" s={0.11} mat="barro" nivel={0.6} caldo="#e8d4a8" t={tt} />,
      <mesh key="m" position={[0, 0.03, 0]} rotation={[P2, 0, 0.3]}><torusGeometry args={[0.07, 0.025, 8, 20, P * 1.6]} /><meshStandardMaterial map={jean()} roughness={1} /></mesh>,
      <Lana key="t" p={[0, 0.012, 0]} s={[0.2, 0.024, 0.14]} k="d2" a="#e8d8b8" b="#b0392b" />,
      <group key="f">{[0, 1, 2].map((j) => <mesh key={j} position={[(j - 1) * 0.045, 0.03 + (j === 1 ? 0.04 : 0), 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.022, 0.026, 0.2, 8]} />{M.madera("#6a4428")}</mesh>)}</group>,
    ].map((el, i) => obj(i, el))}
    <Voluta t={tt} p={[0, 0.2, -0.1]} c={col(FRIO, CALOR, tib).getStyle()} n={10} h={0.5} o={0.28} s={0.28} spread={0.8} />
    {n > 0.98 && <Etq p={[0, 0.06, 0.55]} rot={[-0.9, 0, 0]} txt={["10 cosas"]} w={0.5} h={0.17} />}
  </Estudio>;
}}</Stage>;

// ── 3 · $480 EN TRES SEMANAS (2:48): el calentador de cerámica se traga billete tras billete por la ranura; el contador de rodillos sube a $480
const H3Calentador: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const bills = [0.25, 0.85, 1.45], tragados = bills.filter((a) => tt > a + 0.55).length, sem = Math.min(3, Math.floor(Math.max(0, tt - 0.2) / 0.62));
  return <Estudio t={tt} cam={[0.15, 1.05, 2.0]} look={[0.05, 0.55, 0]} orbit={0.1}>
    <group position={[-0.2, 0, 0]}>
      <RBox p={[0, 0.5, 0]} s={[0.64, 0.86, 0.3]} r={0.05}><meshStandardMaterial color="#d8d4cc" metalness={0.35} roughness={0.35} /></RBox>
      {Array.from({ length: 3 }, (_, i) => <RBox key={i} p={[(i - 1) * 0.19, 0.5, 0.155]} s={[0.17, 0.42, 0.02]} r={0.01}><meshStandardMaterial color="#ffb070" emissive="#ff5a10" emissiveIntensity={1 + 0.25 * Math.sin(tt * 5 + i) + tragados * 0.3} /></RBox>)}
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0, 0.3 + i * 0.065, 0.17]}><boxGeometry args={[0.6, 0.008, 0.01]} />{M.cromo("#a8a8a8")}</mesh>)}
      <RBox p={[0, 0.94, 0]} s={[0.36, 0.02, 0.06]} r={0.005}><meshStandardMaterial color="#1a1a1a" /></RBox>
      <mesh position={[0.24, 0.14, 0.16]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.03, 20]} />{M.cromo()}</mesh>
      <group position={[0, 0.16, 0.16]}>
        <RBox s={[0.3, 0.12, 0.03]} r={0.01}><meshStandardMaterial color="#1a1a1a" /></RBox>
        <Etq p={[0, 0, 0.02]} rot={[0, 0, 0]} txt={["$" + [0, 160, 320, 480][tragados]]} w={0.27} h={0.1} bg="#111" ink="#ffd27a" /></group>
      <pointLight position={[0, 0.5, 0.6]} intensity={1.2 + tragados * 0.5} color={CALOR} distance={2.2} />
      {tragados > 0 && <mesh position={[0, 0.95, 0]} scale={0.12 * cl(1 - (tt - bills[tragados - 1] - 0.55) / 0.3) + 0.001} geometry={esfGeo}><meshBasicMaterial color="#ffd27a" transparent opacity={0.6} /></mesh>}
    </group>
    {bills.map((a, j) => { const k = eio(tt, a, a + 0.55); return k > 0 && k < 1 ? <group key={j} position={[lerp(0.75, -0.2, k), lerp(0.7, 0.98, Math.sin(k * P2)) + Math.sin(k * P) * 0.2 - k * k * 0.1, lerp(0.3, 0, k)]} rotation={[lerp(-0.4, -P2, k), 0, lerp(0.5, 0, k)]} scale={lerp(1, 0.55, k)}>
      <mesh><planeGeometry args={[0.32, 0.15]} /><meshStandardMaterial map={papel("b" + j, ["$160"], { w: 256, h: 120, bg: "#c8d8b0", ink: "#2a4a2a" })} side={THREE.DoubleSide} /></mesh></group> : null; })}
    <group position={[0.68, 0.82, -0.15]}>
      <RBox s={[0.36, 0.44, 0.02]} r={0.01}><meshStandardMaterial color="#f4efe2" /></RBox>
      {[0, 1, 2].map((j) => { const k = j < sem ? eio(tt, 0.2 + j * 0.62, 0.62 + j * 0.62) : 0; return k < 0.99 ? <group key={j} position={[0, 0.22 + k * 0.3, 0.015 + (2 - j) * 0.004 + k * 0.2]} rotation={[-k * 1.4, k * 0.6, 0]}>
        <mesh position={[0, -0.21, 0]}><planeGeometry args={[0.34, 0.42]} /><meshStandardMaterial map={papel("sem" + j, ["semana", String(j + 1)], { w: 256, h: 300, bg: "#fbf7ec", ink: "#7a1c12" })} transparent opacity={1 - k} /></mesh></group> : null; })}</group>
  </Estudio>;
}}</Stage>;

// ── 4 · EL GAS QUE NO SE VE (3:21): cuarto oscuro en corte; una niebla gris sube del anafre y lo tapa todo; la puerta se abre y el gas sale en corriente
const H4Monoxido: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const llena = eio(tt, 0, 2.3), abre = eio(tt, 2.4, 3.0), sale = eio(tt, 2.6, 4.4), osc = llena * (1 - 0.7 * sale);
  return <Estudio t={tt} cam={[0.15, 1.15, 2.0]} look={[0.05, 0.42, 0]} orbit={0.1}>
    <Adobe p={[0, 0.6, -0.6]} s={[1.8, 1.2, 0.1]} /><Adobe p={[-0.9, 0.6, 0]} s={[0.1, 1.2, 1.2]} />
    <Adobe p={[0.9, 0.95, 0]} s={[0.1, 0.5, 1.2]} /><Adobe p={[0.9, 0.35, 0.42]} s={[0.1, 0.7, 0.36]} /><Adobe p={[0.9, 0.35, -0.42]} s={[0.1, 0.7, 0.36]} />
    <PuertaVieja p={[0.9, 0, 0.24]} abre={abre} w={0.48} h={0.7} />
    <mesh position={[0.97, 0.35, 0]}><planeGeometry args={[0.02, 0.7]} /><meshBasicMaterial color="#cfe0f0" transparent opacity={0.9 * abre} /></mesh>
    <pointLight position={[1.3, 0.4, 0]} intensity={2.2 * abre} color="#d8e8ff" distance={2.2} />
    <Brasero p={[-0.35, 0, 0.15]} t={tt} s={1.6} />
    <Cama p={[0.25, 0, -0.3]} s={0.6} />
    <pointLight position={[0, 1.0, 0.6]} intensity={lerp(1.4, 0.12, osc)} color="#ffe6c0" distance={3} />
    <Voluta t={tt} p={[-0.35, 0.38, 0.15]} c="#55575c" n={26} h={0.75} o={0.75 * (0.35 + 0.65 * llena) * (1 - 0.5 * sale)} s={lerp(0.22, 0.5, llena)} spread={lerp(0.1, 0.6, llena)} />
    {Array.from({ length: 16 }, (_, i) => <sprite key={i} position={[-0.7 + rn(i, 1) * 1.4, 0.55 + rn(i, 2) * 0.45, -0.45 + rn(i, 3) * 0.8]} scale={[0.7, 0.5, 1]}><spriteMaterial map={humoTex()} color="#45474c" transparent opacity={0.5 * cl(llena * 1.6 - rn(i, 4) * 0.6) * (1 - cl(sale * 1.5 - rn(i, 1) * 0.4))} depthWrite={false} /></sprite>)}
    {Array.from({ length: 18 }, (_, i) => { const u = ((tt * 0.5 + i / 18) % 1); return <sprite key={i} position={[lerp(0.0, 1.5, u), 0.5 + 0.12 * Math.sin(u * 5 + i), 0.0 + (rn(i, 2) - 0.5) * 0.2]} scale={[0.32 + 0.3 * u, 0.24 + 0.2 * u, 1]}><spriteMaterial map={humoTex()} color="#6a6c72" transparent opacity={0.7 * sale * (1 - sale * 0.4) * Math.sin(u * P)} depthWrite={false} /></sprite>; })}
    <mesh position={[0, 0.003, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.8, 1.2]} /><meshStandardMaterial color="#7a7268" roughness={1} /></mesh>
  </Estudio>;
}}</Stage>;

// ── 5 · LA REGLA NÚMERO UNO (4:00): el anafre prendido cruza el umbral con su estela de humo hasta el patio; la puerta se cierra con peso detrás
const H5Anafre: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const sale = eio(tt, 0.3, 3.2), cierra = phys(tt, 3.6, 7, 0.35), cam = eio(tt, 0.3, 3.6);
  return <Estudio t={tt} cam={[0.4, 1.2, 2.2]} look={[0, 0.3, 0]} orbit={0.1}>
    <group position={[0, 0, -cam * 1.1]}>
      <Adobe p={[-0.75, 0.6, 0]} s={[0.9, 1.2, 0.15]} /><Adobe p={[0.75, 0.6, 0]} s={[0.9, 1.2, 0.15]} /><Adobe p={[0, 1.08, 0]} s={[0.6, 0.24, 0.15]} />
      <PuertaVieja p={[-0.3, 0, 0.08]} abre={1 - cierra} w={0.6} h={0.96} />
      <mesh position={[0, 0.003, -0.6]} rotation={[-P2, 0, 0]}><planeGeometry args={[2.4, 1.2]} /><meshStandardMaterial color="#8a7a68" /></mesh>
      <mesh position={[0, 0.002, 0.95]} rotation={[-P2, 0, 0]}><planeGeometry args={[2.6, 1.7]} /><meshStandardMaterial color="#6a7a3a" roughness={1} /></mesh>
      {Array.from({ length: 90 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 2.4, 0.03, 0.25 + rn(i, 2) * 1.5]} rotation={[0, rn(i, 3) * 3, (rn(i, 4) - 0.5) * 0.4]}><boxGeometry args={[0.006, 0.06 + rn(i, 5) * 0.05, 0.003]} /><meshStandardMaterial color={rn(i, 6) > 0.5 ? "#7a9a3a" : "#5a7a2a"} /></mesh>)}
      <group position={[0.95, 0, 1.2]}><mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.04, 0.06, 0.7, 10]} />{M.madera("#5a3a22")}</mesh>
        <mesh position={[0, 0.85, 0]} scale={[0.4, 0.32, 0.4]} geometry={esfGeo}><meshStandardMaterial color="#3e6a2a" roughness={1} /></mesh>
        {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[Math.cos(i) * 0.3, 0.8 + rn(i, 7) * 0.2, Math.sin(i) * 0.3 + 0.1]} scale={0.035} geometry={esfGeo}><meshStandardMaterial color="#e8d040" /></mesh>)}</group>
      <Brasero p={[0, 0, lerp(-0.55, 1.05, sale)]} t={tt} s={1.6} />
      <Voluta t={tt} p={[0, 0.4, lerp(-0.55, 1.05, sale)]} c="#9a9ca0" n={14} h={0.9} o={0.4} s={0.25} spread={0.2} dir={[0, 1, -0.6 * (sale > 0 && sale < 1 ? 1 : 0)]} />
    </group>
  </Estudio>;
}}</Stage>;

// ── 6 · EL ADOBE ES UNA OLLA DE BARRO (4:32): pared y olla del mismo barro; el sol cruza y las dos se ponen al rojo; de noche siguen tibias con halo
const H6Olla: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const sol = eio(tt, 0.1, 2.8), noche = eio(tt, 2.8, 3.8), glow = cl(sol * 1.3) * (1 - 0.3 * noche);
  const sx = lerp(-1.4, 1.4, sol), sy = 0.6 + Math.sin(P * sol) * 1.2 - noche * 0.8;
  return <Estudio t={tt} cam={[0, 1.15, 2.2]} look={[0, 0.45, 0]} orbit={0.12}>
    <mesh position={[sx, sy + 0.3, -1.4]} scale={0.18 * (1 - noche) + 0.001} geometry={esfGeo}><meshBasicMaterial color="#fff0b0" /></mesh>
    <mesh position={[sx, sy + 0.3, -1.45]} scale={0.42 * (1 - noche) + 0.001} geometry={esfGeo}><meshBasicMaterial color="#ffd27a" transparent opacity={0.25} /></mesh>
    <directionalLight position={[sx * 2, sy + 0.4, -0.5]} intensity={2.4 * (1 - noche)} color="#ffcf8a" castShadow />
    <Adobe p={[-0.42, 0.45, 0]} s={[0.7, 0.9, 0.34]} glow={glow} />
    <group position={[0.42, 0, 0.05]}><Olla s={0.62} mat="barro" nivel={0} t={tt} /><mesh position={[0, 0.25, 0]} scale={[0.45, 0.28, 0.45]} geometry={esfGeo}><meshBasicMaterial color={CALOR} transparent opacity={glow * 0.22} depthWrite={false} /></mesh></group>
    <pointLight position={[0.42, 0.35, 0.5]} intensity={glow * 1.4} color={CALOR} distance={1.6} />
    <pointLight position={[-0.42, 0.45, 0.5]} intensity={glow * 1.2} color={CALOR} distance={1.4} />
    <mesh position={[-0.42, 0.45, 0.18]} scale={[0.55, 0.6, 0.1]} geometry={esfGeo}><meshBasicMaterial color={CALOR} transparent opacity={glow * 0.16 * (0.5 + noche)} depthWrite={false} /></mesh>
    <hemisphereLight args={["#3a4a7a", "#1a1a2a", noche * 0.6]} />
  </Estudio>;
}}</Stage>;

// ── 7 · POR LAS RENDIJAS (5:31): la puerta vieja de tablas; el frío se cuela en cintas azules de a una: por abajo, por el marco y por arriba
const H7Rendijas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const k1 = eio(tt, 0.15, 1.6), k2 = eio(tt, 1.4, 2.9), k3 = eio(tt, 2.7, 4.2), fin = eio(tt, 5.8, 6.8);
  return <Estudio t={tt} cam={[0.75, 0.85, 1.75]} look={[0, 0.55, 0]} orbit={0.1}>
    <Adobe p={[-0.68, 0.7, -0.05]} s={[0.8, 1.4, 0.2]} /><Adobe p={[0.68, 0.7, -0.05]} s={[0.8, 1.4, 0.2]} /><Adobe p={[0, 1.3, -0.05]} s={[0.56, 0.2, 0.2]} />
    <PuertaVieja p={[-0.27, 0.025, -0.02]} w={0.54} h={1.15} />
    {Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[-0.27 + 0.108 * (i + 1), 0.6, 0.012]}><planeGeometry args={[0.006, 1.1]} /><meshBasicMaterial color="#ffe6b0" transparent opacity={0.5} /></mesh>)}
    <mesh position={[0, 0.02, 0.2]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.7, 0.5]} /><meshBasicMaterial color="#dcefff" transparent opacity={0.45 * k1} depthWrite={false} /></mesh>
    <Cinta t={tt} k={k1 * (1 - fin)} pts={[[0, 0.02, -0.5], [0, 0.02, -0.02], [0.05, 0.04, 0.3], [0.25, 0.05, 0.6], [0.5, 0.08, 0.9]]} r={0.03} />
    <Cinta t={tt} k={k1 * (1 - fin)} pts={[[-0.15, 0.02, -0.5], [-0.15, 0.02, -0.02], [-0.25, 0.04, 0.35], [-0.2, 0.06, 0.8]]} r={0.022} />
    <Cinta t={tt} k={k2 * (1 - fin)} pts={[[0.29, 0.7, -0.5], [0.29, 0.7, -0.02], [0.35, 0.68, 0.3], [0.6, 0.6, 0.7], [0.9, 0.55, 0.9]]} r={0.022} />
    <Cinta t={tt} k={k3 * (1 - fin)} pts={[[0, 1.2, -0.5], [0, 1.2, -0.02], [0.1, 1.1, 0.3], [0.2, 0.85, 0.7], [0.3, 0.6, 1.0]]} r={0.025} />
  </Estudio>;
}}</Stage>;

// ── 8 · LA CULEBRA DE ARENA (5:43): el embudo vierte arena y el tubo de pantalón se infla de la cola a la cabeza; se arrastra como víbora y sella la puerta
const culCurve = (k: number) => new THREE.CatmullRomCurve3(Array.from({ length: 9 }, (_, i) => new THREE.Vector3(lerp(-0.62, -0.3, k) + i * lerp(0.09, 0.075, k), 0.045, lerp(0.75, 0.08, k) + Math.sin(i * 1.3 + k * 9) * 0.1 * (1 - k))));
const H8Culebra: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const llena = eio(tt, 0.1, 1.4), va = eio(tt, 1.4, 2.8), sella = eio(tt, 2.8, 3.2);
  const cur = culCurve(va);
  return <Estudio t={tt} cam={[0.55, 0.95, 1.9]} look={[0, 0.3, 0.2]} orbit={0.1}>
    <Adobe p={[-0.68, 0.7, -0.05]} s={[0.8, 1.4, 0.2]} /><Adobe p={[0.68, 0.7, -0.05]} s={[0.8, 1.4, 0.2]} />
    <PuertaVieja p={[-0.27, 0.025, -0.02]} w={0.54} h={1.15} />
    {cur.getPoints(16).map((q, i) => { const f = i / 16, lleno = cl(llena * 1.25 - (1 - f) * 0.25 + 0.05), r = 0.02 + 0.03 * lleno;
      return <mesh key={i} position={[q.x, 0.02 + r, q.z]} scale={[0.06, r, r]} geometry={esfGeo} castShadow><meshStandardMaterial map={jean()} roughness={1} /></mesh>; })}
    {(() => { const q = cur.getPoint(1); return <group position={[q.x + 0.03, 0.06, q.z]}>{[-1, 1].map((s) => <mesh key={s} position={[0.02, 0.025, s * 0.02]} scale={0.008} geometry={esfGeo}><meshBasicMaterial color="#111" /></mesh>)}</group>; })()}
    {tt < 1.6 && <><mesh position={[-0.62, 0.55, 0.78]} rotation={[P, 0, 0]}><coneGeometry args={[0.1, 0.18, 20, 1, true]} />{M.cromo("#9a9da2")}</mesh>
      <Chorro a={[-0.62, 0.45, 0.78]} b={[-0.62, 0.08, 0.76]} r={0.012} c="#d8c08a" o={1 - eio(tt, 1.3, 1.5)} />
      <mesh position={[-0.62, 0.63, 0.78]} scale={[0.07, 0.03, 0.07]} geometry={esfGeo}><meshStandardMaterial color="#d8c08a" roughness={1} /></mesh></>}
    <Cinta t={tt} k={1 - sella} pts={[[0, 0.03, -0.4], [0, 0.03, 0], [0.1, 0.05, 0.35], [0.35, 0.07, 0.7]]} r={0.028} />
    {sella > 0.5 && <Voluta t={tt} p={[0, 0.25, 0.4]} c={CALOR} n={8} h={0.4} o={0.25 * sella} s={0.25} spread={0.6} />}
  </Estudio>;
}}</Stage>;

// ── 9 · LA VELA QUE ENCUENTRA EL FRÍO (6:20): la vela grande sube por el marco; donde entra el hilo de aire la flama se dobla y entra la tira de periódico
const H9Vela: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const gap = 0.9, y = lerp(0.55, gap, eio(tt, 0, 1.6)), cerca = Math.exp(-Math.pow((y - gap) / 0.14, 2)), tapa = eio(tt, 2.6, 3.6);
  const dob = 0.85 * cerca * (1 - tapa) + 0.05 * Math.sin(tt * 7), vx = 0.5, fy = y + 0.04;
  return <Estudio t={tt} cam={[0.62, 0.98, 1.05]} look={[0.38, 0.86, 0]} orbit={0.06} fov={36}>
    <RBox p={[0, 0.85, -0.12]} s={[1.8, 1.5, 0.15]} r={0.02}><meshStandardMaterial map={adobeTex()} color="#5a4a40" roughness={0.95} /></RBox>
    <RBox p={[0, 0.85, -0.01]} s={[0.66, 0.86, 0.06]} r={0.01}>{M.madera("#5a3a22")}</RBox>
    <mesh position={[0, 0.85, 0.025]}><planeGeometry args={[0.56, 0.76]} /><meshPhysicalMaterial color="#121c2e" roughness={0.06} clearcoat={1} /></mesh>
    <mesh position={[0.335, gap, 0.035]}><boxGeometry args={[0.016, 0.13, 0.012]} /><meshBasicMaterial color="#050505" /></mesh>
    <Cinta t={tt} k={eio(tt, 0, 0.9) * (1 - tapa)} pts={[[0.33, gap, -0.2], [0.336, gap, 0.04], [0.4, gap + 0.01, 0.1], [vx - 0.02, fy + 0.08, 0.14]]} r={0.012} o={0.6} />
    <group position={[vx, y - 0.42, 0.14]}>
      <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.065, 0.07, 0.4, 24]} /><meshStandardMaterial color="#f2e8d0" roughness={0.45} /></mesh>
      <mesh position={[0, 0.401, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.062, 24]} /><meshStandardMaterial color="#e6d6b0" roughness={0.3} /></mesh>
      {[0, 1, 2].map((i) => <mesh key={i} position={[Math.cos(i * 2) * 0.064, 0.36 - i * 0.05, Math.sin(i * 2) * 0.064]} scale={[0.012, 0.035 + i * 0.01, 0.012]} geometry={esfGeo}><meshStandardMaterial color="#f6eedc" roughness={0.3} /></mesh>)}
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.12, 0.12, 0.02, 24]} />{M.barro("#7a4a2a")}</mesh>
      <mesh position={[0, 0.41, 0]}><cylinderGeometry args={[0.003, 0.003, 0.025, 6]} /><meshBasicMaterial color="#1a1208" /></mesh>
      <group position={[0, 0.42, 0]} rotation={[0, 0, dob]}>
        <mesh position={[0, 0.06, 0]} scale={[0.032, 0.085 + 0.008 * Math.sin(tt * 13), 0.032]} geometry={esfGeo}><meshBasicMaterial color="#ff8a2a" transparent opacity={0.9} /></mesh>
        <mesh position={[0, 0.05, 0]} scale={[0.022, 0.06, 0.022]} geometry={esfGeo}><meshBasicMaterial color="#ffd060" /></mesh>
        <mesh position={[0, 0.03, 0]} scale={[0.011, 0.026, 0.011]} geometry={esfGeo}><meshBasicMaterial color="#fff8e0" /></mesh>
        <sprite position={[0, 0.06, 0]} scale={[0.35, 0.4, 1]}><spriteMaterial map={humoTex()} color="#ff9a40" transparent opacity={0.45} depthWrite={false} /></sprite></group>
      <pointLight position={[-0.05, 0.5, 0.05]} intensity={1.8} color="#ffa050" distance={1.3} /></group>
    <group position={[lerp(0.9, 0.355, eio(tt, 2.6, 3.4)), gap, 0.06]} rotation={[0, 0, 0]}>
      <mesh rotation={[0, eio(tt, 2.6, 3.6) * 3, 0]}><cylinderGeometry args={[0.022, 0.022, 0.15, 16]} /><meshStandardMaterial map={papel("periodico3", ["NOTICIAS", "— — — —", "— — —", "— — — —"], { w: 256, h: 256, bg: "#e6dfca", ink: "#3a3a3a" })} roughness={1} /></mesh>
      <mesh position={[0, 0.076, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.008, 0.022, 16]} /><meshStandardMaterial color="#d8d0b8" side={THREE.DoubleSide} /></mesh></group>
  </Estudio>;
}}</Stage>;

// ── 10 · LA CORTINA DE COBIJA (6:45): de noche las brasas del calor salen por la ventana; la cobija de lana cae del palo con peso y el calor rebota adentro
const H10Cortina: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const cae = eio(tt, 1.1, 1.9), bote = phys(tt, 1.9, 9, 0.25);
  const brasa = (i: number, f: number): V3 => { const x = (rn(i, 2) - 0.5) * 0.5, y = 0.72 + rn(i, 3) * 0.32;
    if (tt < 1.1 + rn(i, 1) * 0.4) return [x, y + 0.05 * f, lerp(0.75, -0.6, f)];
    const g = f < 0.5 ? f * 2 : 2 - f * 2; return [x, y + 0.04 * Math.sin(f * 6), lerp(0.75, 0.2, g)]; };
  return <Estudio t={tt} cam={[0.4, 0.98, 1.5]} look={[0, 0.85, 0.15]} orbit={0.1}>
    <Adobe p={[0, 0.85, -0.1]} s={[1.8, 1.7, 0.15]} />
    <RBox p={[0, 0.88, -0.02]} s={[0.66, 0.66, 0.06]} r={0.01}>{M.madera("#6a4428")}</RBox>
    <mesh position={[0, 0.88, 0.0]}><planeGeometry args={[0.56, 0.56]} /><meshBasicMaterial color="#0a1424" /></mesh>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[(rn(i, 5) - 0.5) * 0.5, 0.65 + rn(i, 6) * 0.5, 0.005]} scale={0.004} geometry={esfGeo}><meshBasicMaterial color="#e8eef8" /></mesh>)}
    <mesh position={[0, 1.27, 0.12]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.025, 0.025, 0.95, 12]} />{M.madera("#8a6a40")}</mesh>
    <mesh position={[0, 1.27, 0.12]} rotation={[0, 0, P2]} scale={[Math.max(0.001, 1 - cae * 0.75), 1, Math.max(0.001, 1 - cae * 0.75)]}><cylinderGeometry args={[0.075, 0.075, 0.82, 20]} /><meshStandardMaterial map={rayas("cort", "#7a2a22", "#c8a060", 5)} roughness={1} /></mesh>
    {Array.from({ length: 8 }, (_, i) => { const L = 0.78 * cl(cae * 1.15 - i * 0.02), x = -0.385 + i * 0.11, ond = 0.035 * Math.sin(i * 1.9) + 0.03 * Math.sin(i * 1.7 + tt * 2) * (1 - bote);
      return <group key={i} position={[x, 1.24, 0.15 + ond]} rotation={[0.2 * (1 - bote) * Math.sin(tt * 3 + i) - 0.05 * (1 - bote), 0, 0]}>
        <mesh position={[0, -L / 2, 0]} scale={[1, Math.max(0.001, L), 1]}><boxGeometry args={[0.114, 1, 0.03]} /><meshStandardMaterial map={rayas("cort", "#7a2a22", "#c8a060", 5)} roughness={1} /></mesh></group>; })}
    {Array.from({ length: 14 }, (_, i) => { const per = 1.3, f = ((tt + rn(i, 1) * per) % per) / per;
      return <group key={i}>{[0, 0.04, 0.08].map((d, j) => { const q = brasa(i, Math.max(0, f - d)); return <mesh key={j} position={q} scale={(0.024 - j * 0.007) * Math.sin(f * P) + 0.001} geometry={esfGeo}><meshBasicMaterial color={j ? "#ff6a20" : "#ffd27a"} transparent opacity={1 - j * 0.3} /></mesh>; })}</group>; })}
    <pointLight position={[0, 0.8, 0.8]} intensity={0.4 + 1.1 * cae} color={CALOR} distance={2} />
  </Estudio>;
}}</Stage>;

// ── 11 · EL PETATE (7:36): el piso de cemento azul de frío con el pie descalzo encima; el petate rueda y se desenrolla con peso y el azul queda abajo
const tejidoTex = () => ctex("petateD", 256, 256, (g) => { for (let y = 0; y < 256; y += 16) for (let x = 0; x < 256; x += 16) { g.fillStyle = ((x + y) / 16) % 2 ? "#c9a46a" : "#a8834e"; g.fillRect(x, y, 16, 16); g.strokeStyle = "rgba(70,45,20,.5)"; g.strokeRect(x + 0.5, y + 0.5, 15, 15); } });
const cantoTex = () => ctex("cantoD", 256, 64, (g) => { const r = g.createLinearGradient(0, 64, 0, 0); r.addColorStop(0, "#5aa8f0"); r.addColorStop(1, "#c8e4ff"); g.fillStyle = r; g.fillRect(0, 0, 256, 64); for (let i = 0; i < 60; i++) { g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect((i * 37) % 256, (i * 23) % 64, 2, 2); } });
const H11Petate: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const D = dur(h), frio = eio(tt, 0.1, 0.3 * D), ro = eio(tt, 0.35 * D, 0.72 * D), L = 1.4 * ro, R0 = 0.11, rr = Math.sqrt(R0 * R0 * (1 - ro) + 0.0004);
  const sube = Math.sin(cl((ro - 0.45) / 0.35) * P) * 0.12, tibio = eio(tt, 0.72 * D, D - 0.2), xr = -0.7 + L;
  return <Estudio t={tt} cam={[0.15, 0.85, 1.75]} look={[0, 0.1, 0.1]} orbit={0.07}>
    <RBox p={[0, -0.06, 0]} s={[1.7, 0.14, 1.0]} r={0.01}><meshStandardMaterial color="#8e8c86" roughness={0.95} /></RBox>
    <mesh position={[0, -0.06, 0.502]}><planeGeometry args={[1.68, 0.13]} /><meshStandardMaterial map={cantoTex()} transparent opacity={0.25 + 0.75 * frio} emissive="#5aa8f0" emissiveIntensity={0.4 * frio} /></mesh>
    <mesh position={[0, 0.012, 0.05]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.6, 0.9]} /><meshBasicMaterial color="#8ac4ff" transparent opacity={0.22 * frio * (1 - 0.6 * ro)} depthWrite={false} /></mesh>
    {L > 0.01 && <mesh position={[-0.7 + L / 2, 0.016, 0.05]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[L, 0.86]} /><meshStandardMaterial map={tejidoTex()} roughness={0.95} /></mesh>}
    {ro < 0.995 && <mesh position={[xr, 0.012 + rr, 0.05]} rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[rr, rr, 0.86, 28]} /><meshStandardMaterial map={tejidoTex()} roughness={0.95} /></mesh>}
    <Pie p={[0.25, 0.012 + sube + (xr > 0.2 ? 0.016 : 0), 0.08]} rot={[0, -0.3, 0]} c={col(col("#e8c2a4", "#a8c4e8", frio).getStyle(), "#f0b48a", tibio)} s={1.5} />
    <SombraD p={[0.25, 0, 0.08]} r={0.28} o={0.7 - sube * 3} />
  </Estudio>;
}}</Stage>;

// ── 12 · LA BUFANDA (8:30): el aire helado baja azul a los pulmones de vidrio; la bufanda de lana se enrolla vuelta por vuelta y el aire llega tibio
const pulmonGeo = lathe([[0.001, 0], [0.12, 0.05], [0.17, 0.2], [0.15, 0.36], [0.08, 0.45], [0.001, 0.47]], 24);
const H12Bufanda: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const buf = eio(tt, 1.4, 3.4), resp = 1 + 0.07 * Math.sin(tt * 3.2), lc = col(FRIO, "#f0a090", eio(tt, 2.6, 4.2));
  return <Estudio t={tt} cam={[0, 0.95, 1.9]} look={[0, 0.7, 0]} orbit={0.12}>
    {[-1, 1].map((s) => <mesh key={s} position={[s * 0.17, 0.2, 0]} rotation={[0, 0, s * 0.12]} scale={[resp, resp, resp]} geometry={pulmonGeo}><meshPhysicalMaterial color={lc} transparent opacity={0.6} roughness={0.15} emissive={lc} emissiveIntensity={0.25} /></mesh>)}
    <mesh position={[0, 0.88, 0]}><cylinderGeometry args={[0.035, 0.035, 0.42, 14]} /><meshPhysicalMaterial color={lc} transparent opacity={0.7} /></mesh>
    {[-1, 1].map((s) => <mesh key={s} position={[s * 0.08, 0.62, 0]} rotation={[0, 0, s * 0.7]}><cylinderGeometry args={[0.022, 0.022, 0.2, 10]} /><meshPhysicalMaterial color={lc} transparent opacity={0.7} /></mesh>)}
    <group position={[0, 0.9, 0]}>{Array.from({ length: 5 }, (_, i) => { const k = cl(buf * 5 - i); return k > 0.01 ? <mesh key={i} position={[0, (i - 2) * 0.045, 0]} rotation={[P2 + 0.1 * Math.sin(i), 0, -k * P * 2]} scale={[1, 1, 1]}>
      <torusGeometry args={[0.075, 0.03, 10, 28, P * 2 * k]} /><meshStandardMaterial map={rayas("buf", "#b0392b", "#e8d8a8", 4)} roughness={1} /></mesh> : null; })}
      {buf > 0.9 && [-1, 1].map((s) => <group key={s} position={[0.08, -0.06, s * 0.03]} rotation={[0, 0, -0.15 + 0.06 * Math.sin(tt * 2 + s)]}><Lana p={[0, -0.18, 0]} s={[0.06, 0.34, 0.015]} k="buf2" a="#b0392b" b="#e8d8a8" /></group>)}</group>
    <Cinta t={tt} k={eio(tt, 0.1, 0.9)} pts={[[0.9, 1.4, 0.3], [0.4, 1.25, 0.15], [0.05, 1.12, 0], [0, 0.95, 0], [0, 0.7, 0]]} r={0.03} c={buf > 0.6 ? CALOR : FRIO} />
  </Estudio>;
}}</Stage>;

// ── 13 · EL MURO TIBIO (9:26): corte de la casa: el calor del fogón entra al muro grueso como una marea naranja y sale tibio del lado de la cama
const H13Muro: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const ola = eio(tt, 0.1, 2.0), sol = eio(tt, 0.1, 3.0);
  return <Estudio t={tt} cam={[0, 1.15, 2.2]} look={[0, 0.5, 0]} orbit={0.1}>
    {Array.from({ length: 6 }, (_, i) => <Adobe key={i} p={[-0.11 + i * 0.044, 0.55, 0]} s={[0.046, 1.1, 1.0]} glow={cl(ola * 7 - i) * (1.1 - i * 0.08)} />)}
    <Adobe p={[0, 0.55, -0.55]} s={[2.4, 1.1, 0.1]} />
    <group position={[-0.65, 0, 0]}><RBox p={[0, 0.25, 0]} s={[0.55, 0.5, 0.45]} r={0.05}><meshStandardMaterial color="#8a5a3a" roughness={0.9} /></RBox>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.32, 0.53, (rn(i, 2) - 0.5) * 0.22]} scale={0.05} geometry={esfGeo}><meshStandardMaterial color="#2a1a12" emissive="#ff5010" emissiveIntensity={1 + 0.3 * Math.sin(tt * 4 + i)} /></mesh>)}
      <Olla p={[0, 0.5, 0]} s={0.28} mat="barro" nivel={0.6} t={tt} hervor={0.4} />
      <pointLight position={[0, 0.7, 0.3]} intensity={1.6} color={CALOR} distance={1.8} /></group>
    <Cama p={[0.65, 0, 0.05]} rot={[0, P2, 0]} s={0.7}><Lana p={[0, 0.38, 0]} s={[0.98, 0.04, 0.6]} k="m13" a="#7a2a22" b="#c8a060" /></Cama>
    <Voluta t={tt} p={[0.6, 0.4, 0.05]} c={CALOR} n={10} h={0.5} o={0.4 * cl(ola * 2 - 1)} s={0.25} spread={0.4} />
    <pointLight position={[0.4, 0.5, 0.2]} intensity={cl(ola * 2 - 1) * 1.2} color={CALOR} distance={1.4} />
    <group position={[0, 1.25, -0.5]} rotation={[0, 0, -sol * P]}><mesh position={[0.9, 0, 0]} scale={0.09} geometry={esfGeo}><meshBasicMaterial color="#ffd27a" /></mesh><mesh position={[-0.9, 0, 0]} scale={0.07} geometry={esfGeo}><meshBasicMaterial color="#e8eef8" /></mesh></group>
  </Estudio>;
}}</Stage>;

// ── 14 · POR DÓNDE SALE EL HUMO (9:46): el humo del fogón sube en columna por el tubo y sale por la ventanita alta; afuera se ve la estela
const H14Humo: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const sube = eio(tt, 0, 0.8);
  return <Estudio t={tt} cam={[-0.1, 1.1, 2.4]} look={[0.15, 0.82, 0]} orbit={0.1} fov={36}>
    <Adobe p={[0.35, 0.52, 0]} s={[0.16, 1.04, 1.1]} /><Adobe p={[0.35, 1.47, 0]} s={[0.16, 0.26, 1.1]} />
    <Adobe p={[0.35, 1.2, 0.36]} s={[0.16, 0.3, 0.38]} /><Adobe p={[0.35, 1.2, -0.36]} s={[0.16, 0.3, 0.38]} />
    {[[1.06, 0, 0.36], [1.34, 0, 0.36]].map(([yy], i) => <RBox key={i} p={[0.35, yy, 0]} s={[0.17, 0.025, 0.36]} r={0.004}>{M.madera("#5a3a22")}</RBox>)}
    {[-1, 1].map((sg) => <RBox key={sg} p={[0.35, 1.2, sg * 0.17]} s={[0.17, 0.3, 0.025]} r={0.004}>{M.madera("#5a3a22")}</RBox>)}
    <RBox p={[-0.4, 0.27, 0]} s={[0.55, 0.54, 0.45]} r={0.05}><meshStandardMaterial map={adobeTex()} roughness={0.9} /></RBox>
    <mesh position={[-0.4, 0.3, 0.226]}><planeGeometry args={[0.22, 0.14]} /><meshBasicMaterial color="#ff7a2a" /></mesh>
    <pointLight position={[-0.4, 0.35, 0.5]} intensity={1.0} color={CALOR} distance={1.5} />
    <Olla p={[-0.5, 0.54, 0]} s={0.28} nivel={0.6} caldo="#6b2a1c" hervor={0.5} t={tt} />
    <mesh position={[-0.22, 0.88, 0]}><cylinderGeometry args={[0.055, 0.055, 0.66, 16]} />{M.hierro()}</mesh>
    <mesh position={[-0.22, 1.2, 0]} scale={0.058} geometry={esfGeo}>{M.hierro()}</mesh>
    <mesh position={[0.17, 1.2, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.055, 0.055, 0.78, 16]} />{M.hierro()}</mesh>
    {Array.from({ length: 30 }, (_, i) => { const u = ((tt * 0.45 + i / 30) % 1), sc = 0.1 + 0.42 * u;
      return <sprite key={i} position={[0.58 + u * 0.75 + Math.sin(tt * 1.2 + i) * 0.03 * u, 1.2 + u * 0.32, (rn(i, 2) - 0.5) * 0.08 * u]} scale={[sc, sc, 1]}><spriteMaterial map={humoTex()} color="#9a9aa2" transparent opacity={0.85 * sube * Math.min(1, (1 - u) * 1.6)} depthWrite={false} /></sprite>; })}
    <Voluta t={tt} p={[-0.5, 0.66, 0]} c="#f4efe6" n={6} h={0.25} o={0.25} s={0.1} />
  </Estudio>;
}}</Stage>;

// ── 15 · LA COBIJA VA ABAJO (10:50): la cama abierta en capas; el colchón brilla azul de frío; la cobija de lana se mete abajo y el azul se apaga
const H15Cobija: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sep = eio(tt, 0.1, 0.8) * (1 - eio(tt, 2.9, 3.6)), entra = eio(tt, 0.8, 2.0), arriba = eio(tt, 2.0, 2.8);
  return <Estudio t={tt} cam={[0.75, 1.05, 1.85]} look={[0, 0.45, 0]} orbit={0.1}>
    <Cama>
      <mesh position={[0, 0.36, 0]} scale={[0.5, 0.06 + 0.04 * (1 - entra), 0.3]} geometry={esfGeo}><meshBasicMaterial color={FRIO} transparent opacity={0.5 * (1 - entra)} depthWrite={false} /></mesh>
      <group position={[0, 0.3 * sep, 0]}>
        <group position={[lerp(1.3, 0, entra), 0, 0]}><Lana p={[0, 0.38, 0]} s={[0.98, 0.05, 0.6]} k="c15a" a="#c8b898" b="#8a6a4a" /></group>
        <group position={[0, 0.05 + 0.1 * sep, 0]}><RBox p={[0, 0.38, 0]} s={[0.98, 0.012, 0.6]} r={0.005}><meshStandardMaterial color="#f4f2ec" roughness={0.9} /></RBox></group>
        {[0, 1].map((i) => <group key={i} position={[0, 0.1 + i * 0.05 + 0.2 * sep * (i + 1) + 0.5 * (1 - arriba), 0]}><Lana p={[0, 0.38, 0]} s={[0.98, 0.04, 0.6]} k={"c15" + i} a={i ? "#7a2a22" : "#2f5a8a"} b="#e8d8a8" /></group>)}
      </group>
    </Cama>
    <Voluta t={tt} p={[0, 0.4, 0]} c={FRIO} n={12} h={0.6} o={0.45 * (1 - entra)} s={0.2} spread={0.7} />
  </Estudio>;
}}</Stage>;

// ── 16 · EL GORRO (11:28): de la cabeza sin gorro sube una columna de calor; el gorro de lana cae con rebote y la columna se corta: el calor queda adentro
const H16Gorro: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const ent = phys(tt, 0, 7, 0.45), y = 0.75 + fall(tt, 1.4, 0.55), puesto = eio(tt, 1.75, 2.3), col0 = 1 - puesto;
  const piel = <meshStandardMaterial color="#c8a070" roughness={0.6} />;
  return <Estudio t={tt} cam={[0, 0.98, 1.6]} look={[0, 0.78, 0]} orbit={0.12}>
    <group scale={Math.max(0.001, 0.4 + 0.6 * ent)} rotation={[0, (1 - ent) * 0.8, 0]}>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.05, 0.12, 0.4, 16]} />{M.madera("#a07a4a")}</mesh>
      <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.05, 0.06, 0.1, 16]} />{piel}</mesh>
      <mesh position={[0, 0.62, 0]} scale={[0.2, 0.24, 0.22]} geometry={esfGeo} castShadow>{piel}</mesh>
      {[-1, 1].map((sg) => <mesh key={sg} position={[sg * 0.2, 0.62, 0]} scale={[0.03, 0.05, 0.03]} geometry={esfGeo}>{piel}</mesh>)}
      <mesh position={[0, 0.6, 0.22]} scale={[0.03, 0.045, 0.04]} geometry={esfGeo}>{piel}</mesh>
      {[-1, 1].map((sg) => <mesh key={"o" + sg} position={[sg * 0.075, 0.66, 0.195]} rotation={[0, 0, sg * 0.1]}><boxGeometry args={[0.05, 0.008, 0.01]} /><meshBasicMaterial color="#3a2414" /></mesh>)}
      <mesh position={[0, 0.53, 0.2]}><boxGeometry args={[0.06, 0.008, 0.01]} /><meshBasicMaterial color="#7a3a24" /></mesh></group>
    <group position={[0, y, 0]} rotation={[0, 0, 0.12 * Math.sin(tt * 8) * Math.exp(-Math.max(0, tt - 1.8) * 3) * (tt > 1.8 ? 1 : 0)]} scale={tt < 1.3 ? 0.001 : 1}>
      <mesh scale={[0.215, 0.2, 0.235]}><sphereGeometry args={[1, 28, 14, 0, P * 2, 0, P2]} /><meshStandardMaterial map={tejido("gorro", "#2f5a8a")} roughness={1} /></mesh>
      <mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.215, 0.032, 10, 32]} /><meshStandardMaterial map={rayas("gor", "#e8d8a8", "#2f5a8a", 3)} roughness={1} /></mesh>
      <mesh position={[0, 0.22, 0]} scale={0.06} geometry={esfGeo}><meshStandardMaterial color="#e8d8a8" roughness={1} /></mesh></group>
    {Array.from({ length: 20 }, (_, i) => { const u = ((tt * 0.6 + i / 20) % 1), hh = 0.55 * col0 + 0.03, sc = (0.1 + 0.2 * u) * (0.3 + 0.7 * col0);
      return <sprite key={i} position={[Math.sin(u * 7 + tt * 2) * 0.05 * u, 0.86 + u * hh, 0]} scale={[sc, sc * 1.3, 1]}><spriteMaterial map={humoTex()} color="#ffb070" transparent opacity={0.6 * Math.sin(u * P) * ent * (0.15 + 0.85 * col0)} depthWrite={false} /></sprite>; })}
    <mesh position={[0, 0.74, 0]} scale={[0.27, 0.21, 0.27]} geometry={esfGeo}><meshBasicMaterial color={CALOR} transparent opacity={0.2 * puesto} depthWrite={false} /></mesh>
    <pointLight position={[0, 0.75, 0.4]} intensity={0.3 + puesto * 0.9} color={CALOR} distance={1.2} />
  </Estudio>;
}}</Stage>;

// ── 17 · LA BOTELLA EN EL CALCETÍN (12:22): el agua tibia llena la botella grande; el calcetín de lana se la traga; entra a la cama y la tibieza sube de los pies
const botGeo = lathe([[0.001, 0], [0.11, 0.0], [0.12, 0.02], [0.12, 0.3], [0.1, 0.36], [0.045, 0.42], [0.04, 0.5], [0.045, 0.51]], 32);
const calceTex = () => ctex("calceD", 256, 256, (g) => { g.fillStyle = "#8a2a24"; g.fillRect(0, 0, 256, 256); for (let y = 0; y < 256; y += 10) for (let x = 0; x < 256; x += 12) { g.fillStyle = (y / 10) % 6 < 2 ? "#e8dcc4" : "rgba(60,10,8,.35)"; g.beginPath(); g.ellipse(x + 6, y + 5, 5, 4, 0.5, 0, 7); g.fill(); } });
const H17Botella: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const D = dur(h), llena = eio(tt, 0.1, 0.32 * D), traga = eio(tt, 0.32 * D, 0.5 * D), va = eio(tt, 0.52 * D, 0.72 * D), tib = eio(tt, 0.7 * D, D - 0.2);
  const bx = lerp(-0.55, 0.62, va), by = lerp(0, 0.2, va), rotz = lerp(0, -P2, va);
  return <Estudio t={tt} cam={[0.05, 1.1, 2.0]} look={[0.05, 0.25, 0]} orbit={0.08}>
    <group position={[0.15, 0, -0.05]}>
      <RBox p={[0.25, 0.1, 0]} s={[1.3, 0.2, 0.8]} r={0.04}><meshStandardMaterial color="#e8e0cc" roughness={0.9} /></RBox>
      <Lana p={[0.4, 0.25, 0]} s={[1.0, 0.07, 0.84]} k="cobD" a="#5a6a8a" b="#3a4a6a" />
      <mesh position={[0.72, 0.29, 0.02]} rotation={[-P2, 0, 0]} scale={Math.max(0.001, 0.08 + 0.55 * tib)}><circleGeometry args={[1, 40]} /><meshBasicMaterial color="#ff9a4a" transparent opacity={0.45 * tib} depthWrite={false} /></mesh>
      <pointLight position={[0.72, 0.5, 0.1]} intensity={0.01 + 2.2 * tib} distance={1.2} color="#ffa060" />
      <RBox p={[-0.38, 0.32, 0]} s={[0.06, 0.45, 0.82]} r={0.02}>{M.madera("#6a4428")}</RBox></group>
    <SombraD p={[0.4, 0, -0.05]} r={0.8} o={0.6} />
    <group position={[bx, by, 0.2 - 0.1 * va]} rotation={[0, 0, rotz]} scale={1 - 0.35 * va}>
      <mesh geometry={botGeo} castShadow><meshPhysicalMaterial color="#e8f4f0" roughness={0.04} transmission={0.6} transparent opacity={0.45} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh position={[0, 0.01 + 0.17 * llena, 0]}><cylinderGeometry args={[0.105, 0.105, Math.max(0.001, 0.34 * llena), 28]} /><meshPhysicalMaterial color="#f0b070" transparent opacity={0.7} roughness={0.1} clearcoat={1} /></mesh>
      <mesh position={[0, 0.53, 0]}><cylinderGeometry args={[0.05, 0.05, 0.05, 16]} /><meshStandardMaterial color="#2a5a9a" roughness={0.5} /></mesh>
      <group position={[0, lerp(0.95, 0.0, traga), 0]} scale={[1, Math.max(0.001, 0.3 + 0.7 * traga), 1]}>
        <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.14, 0.13, 0.6, 28, 1, true]} /><meshStandardMaterial map={calceTex()} roughness={1} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0.08, 0.04, 0]} rotation={[0, 0, P2]} scale={[1, 1, 0.95]}><capsuleGeometry args={[0.12, 0.16, 8, 16]} /><meshStandardMaterial map={calceTex()} roughness={1} /></mesh></group>
      {traga < 0.6 && llena > 0.3 && <Voluta t={tt} p={[0, 0.55, 0]} n={10} h={0.5} o={0.5 * (1 - traga)} s={0.6} />}</group>
    {va < 0.05 && <SombraD p={[bx, 0, 0.2]} r={0.2} o={0.7} />}
  </Estudio>;
}}</Stage>;

// ── 18 · EL LADRILLO DE LA ABUELA (12:35): el ladrillo junto a las brasas pasa de gris a rojo vivo; el trapo rojo cae y se dobla encima en tres capas
const H18Ladrillo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const D = dur(h), cal = eio(tt, 0.15, 0.55 * D), fl = 0.85 + 0.15 * Math.sin(tt * 2 * P * 1.6), T0 = 0.6 * D, cs = Math.min(0.32, (D - T0 - 0.3) / 3);
  return <Estudio t={tt} cam={[0.1, 1.05, 1.6]} look={[0.05, 0.12, 0]} orbit={0.08}>
    <group position={[-0.62, 0, -0.05]}>
      {Array.from({ length: 9 }, (_, i) => { const a = i / 9 * P * 2; return <mesh key={i} position={[Math.cos(a) * 0.3, 0.05, Math.sin(a) * 0.24]} rotation={[rn(i, 1), rn(i, 2) * 3, 0]} scale={[0.09, 0.06, 0.08]} castShadow><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={["#6a625a", "#7a7064", "#5a524a"][i % 3]} roughness={0.95} /></mesh>; })}
      {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.36, 0.04 + rn(i, 4) * 0.04, (rn(i, 5) - 0.5) * 0.28]} rotation={[rn(i, 6) * 3, rn(i, 7) * 3, 0]} scale={0.035 + 0.02 * rn(i, 8)}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#2a1008" emissive="#ff5a14" emissiveIntensity={(0.6 + 0.6 * rn(i, 9)) * fl} roughness={0.9} /></mesh>)}
      <pointLight position={[0, 0.25, 0.05]} intensity={3.2 * fl} distance={1.8} color="#ff7a2a" /></group>
    <SombraD p={[-0.62, 0, -0.05]} r={0.45} o={0.5} />
    {[[-0.12, -0.05], [0.12, 0.06], [0.3, -0.04], [0.02, 0.1], [0.42, 0.08]].map(([x, z], i) => <mesh key={i} position={[0.15 + x, 0.04, z]} rotation={[0, i, 0]} scale={[0.12, 0.05, 0.1]} castShadow receiveShadow><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#6e665c" roughness={0.95} /></mesh>)}
    <RBox p={[0.32, 0.15, 0.02]} s={[0.46, 0.13, 0.22]} r={0.012}><meshStandardMaterial color={col("#8a3a24", "#b8341a", cal)} emissive="#ff3a0a" emissiveIntensity={1.4 * cal * cal * (0.9 + 0.1 * fl)} roughness={0.85} /></RBox>
    {[-0.1, 0.1].map((x, i) => <mesh key={i} position={[0.32 + x, 0.217, 0.02]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.035, 16]} /><meshStandardMaterial color="#3a140a" emissive="#ff2a00" emissiveIntensity={cal} /></mesh>)}
    <pointLight position={[0.32, 0.35, 0.15]} intensity={0.01 + 2.2 * cal * cal} distance={1.0} color="#ff4a1a" />
    {[0, 1, 2].map((j) => { const a = T0 + j * cs, k = cl((tt - a) / 0.3); if (tt < a) return null; const y0 = 0.225 + j * 0.026, side = j % 2 ? -1 : 1;
      const y = k < 1 ? lerp(0.85, y0, k * k) : y0 + fall(tt, a + 0.3, 0.025);
      return <group key={j} position={[0.32, y, 0.02]} rotation={[0, (j - 1) * 0.06, (1 - k) * 0.4 * side]}>
        <RBox s={[0.5 - j * 0.02, 0.014, 0.28]} r={0.006}><meshStandardMaterial color={["#b8241c", "#a81e18", "#c42a20"][j]} roughness={0.95} /></RBox>
        <mesh position={[side * (0.25 - j * 0.01), -0.008, 0]} rotation={[P2, 0, side > 0 ? -P2 : P2]}><cylinderGeometry args={[0.014, 0.014, 0.28, 10, 1, true, 0, P]} /><meshStandardMaterial color="#9a1a14" roughness={0.95} side={THREE.DoubleSide} /></mesh></group>; })}
    <SombraD p={[0.32, 0, 0.02]} r={0.32} o={0.7} />
  </Estudio>;
}}</Stage>;

// ── 19 · EL ATOLE DE CINCO PESOS (13:43): caen de a uno la masa, el chorro de agua, la canela y el piloncillo; la cuchara gira; cinco monedas se apilan
const H19Atole: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ing = (i: number) => fall(tt, 0.2 + i * 0.9, 0.9), cuch = eio(tt, 3.6, 4.2), liq = col("#cfe4f0", "#c89a6a", eio(tt, 0.4, 3.6));
  return <Estudio t={tt} cam={[0.2, 1.25, 1.75]} look={[0.15, 0.35, 0]} orbit={0.1}>
    <Olla p={[0, 0, 0]} s={0.55} mat="barro" nivel={0.25 + 0.5 * eio(tt, 0.4, 2.4)} caldo={liq.getStyle()} hervor={eio(tt, 3.6, 5)} t={tt} />
    {tt < 1.1 && <mesh position={[0, 0.5 + ing(0), 0]} scale={[0.09, 0.07, 0.09]} geometry={esfGeo}><meshStandardMaterial color="#f0e2b8" roughness={0.95} /></mesh>}
    {tt > 1.0 && tt < 2.0 && <Chorro a={[0.05, 1.3, 0]} b={[0.05, 0.4, 0]} r={0.025} c="#cfe4f0" o={0.8} />}
    {tt > 1.9 && tt < 3.0 && <group position={[-0.05, 0.5 + ing(2), 0]} rotation={[0.3, 0, 0.5]}>{[0, 1].map((j) => <mesh key={j} position={[j * 0.04, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.22, 10]} /><meshStandardMaterial color="#8a4a22" roughness={0.9} /></mesh>)}</group>}
    {tt > 2.8 && tt < 3.9 && <mesh position={[0.05, 0.5 + ing(3), 0]} rotation={[P, 0, 0]}><coneGeometry args={[0.07, 0.16, 8]} /><meshStandardMaterial color="#6a3a14" roughness={0.6} /></mesh>}
    <group position={[0, 0.42, 0]} rotation={[0, tt * 3 * cuch, 0]}><mesh position={[0.14, 0.18, 0]} rotation={[0, 0, 0.35]}><cylinderGeometry args={[0.016, 0.016, 0.6, 8]} />{M.madera("#a07a4a")}</mesh>
      <mesh position={[0.06, -0.04, 0]} rotation={[0, 0, 0.35]} scale={[0.04, 0.06, 0.025]} geometry={esfGeo}>{M.madera("#a07a4a")}</mesh></group>
    <Voluta t={tt} p={[0, 0.42, 0]} c="#f4efe6" n={12} h={0.7} o={0.4 * eio(tt, 3.6, 4.6)} s={0.2} />
    {Array.from({ length: 5 }, (_, i) => { const a = 4.6 + i * 0.25; return tt > a ? <Moneda key={i} p={[0.55, fall(tt, a, 0.6) + 0.012 + i * 0.024, 0.15]} rot={[0, i, 0]} s={1.5} /> : null; })}
    {tt > 5.9 && <Etq p={[0.55, 0.32, 0.15]} rot={[0, -0.2, 0]} txt={["$5"]} w={0.2} h={0.14} bg="#f4e0c8" />}
  </Estudio>;
}}</Stage>;

// ── 20 · EL TUBO QUE REVIENTA (14:22): de cerca, el agua corre azul en el tubo, se vuelve hielo blanco, el tubo se hincha y se raja; el costal lo envuelve
const aguaTex = () => ctex("agua20", 256, 64, (g) => { g.fillStyle = "#4a90c8"; g.fillRect(0, 0, 256, 64); g.fillStyle = "rgba(255,255,255,.35)"; for (let i = 0; i < 12; i++) g.fillRect(i * 22, 8 + (i % 3) * 16, 12, 4); });
const H20Tubo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const hielo = eio(tt, 0, 1.5), hincha = eio(tt, 1.2, 2.0), raja = tt > 2.0, env = eio(tt, 2.9, 3.9), tx = aguaTex();
  tx.wrapS = THREE.RepeatWrapping; tx.offset.x = -tt * 0.8;
  return <Estudio t={tt} cam={[0.15, 0.85, 1.35]} look={[0.0, 0.6, 0]} orbit={0.08}>
    <Adobe p={[0, 0.7, -0.22]} s={[2.2, 1.4, 0.15]} />
    <pointLight position={[-1.0, 1.1, 0.7]} intensity={1.6} color="#e8eef8" distance={3} castShadow />
    {[-0.5, 0.5].map((x) => <RBox key={x} p={[x, 0.6, -0.1]} s={[0.05, 0.2, 0.18]} r={0.01}>{M.hierro()}</RBox>)}
    {Array.from({ length: 8 }, (_, i) => { const x = -0.525 + i * 0.15, fr = cl(hielo * 1.8 - i / 8 * 0.8), b = 1 + 0.55 * hincha * Math.exp(-Math.pow((x - 0.08) / 0.16, 2));
      return <group key={i} position={[x, 0.6, 0]} rotation={[0, 0, P2]}>
        <mesh scale={[b, 1, b]}><cylinderGeometry args={[0.075, 0.075, 0.152, 26, 1, true, P, P]} /><meshStandardMaterial color="#e8e4da" roughness={0.45} side={THREE.DoubleSide} /></mesh>
        <mesh scale={[b * 0.9, 1, b * 0.9]}><cylinderGeometry args={[0.07, 0.07, 0.152, 22]} /><meshPhysicalMaterial map={fr > 0.5 ? undefined : tx} color={col("#ffffff", "#f2f8ff", fr)} emissive={col("#0a2a4a", "#b8dcf4", fr)} emissiveIntensity={0.35} roughness={lerp(0.05, 0.4, fr)} clearcoat={fr} /></mesh></group>; })}
    {[-0.6, 0.6].map((x) => <mesh key={x} position={[x, 0.6, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.075, 0.012, 8, 26]} /><meshStandardMaterial color="#d8d4ca" roughness={0.5} /></mesh>)}
    {raja && <mesh position={[0.08, 0.66, 0.1]} rotation={[0, 0, 0.35]}><boxGeometry args={[0.2, 0.012, 0.012]} /><meshBasicMaterial color="#0a0a0a" /></mesh>}
    {raja && Array.from({ length: 18 }, (_, i) => { const k = cl((tt - 2.0 - i * 0.02) / 0.7); return <mesh key={i} position={[0.08 + (rn(i, 1) - 0.5) * 0.25 * (1 + k), 0.68 + k * 0.35 * rn(i, 2) - k * k * 0.3, 0.1 + k * 0.4 * rn(i, 3)]} rotation={[i, i * 2, 0]} scale={0.022 * (1 - k * 0.4)}><octahedronGeometry args={[1, 0]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} clearcoat={1} /></mesh>; })}
    {raja && <Chorro a={[0.08, 0.68, 0.1]} b={[0.22, 0.05, 0.35]} r={0.012} c="#7ac0f0" o={0.7 * (1 - env)} />}
    <mesh position={[-0.6 + 0.6 * env, 0.6, 0]} rotation={[0, 0, P2]} scale={[1, Math.max(0.001, env), 1]}><cylinderGeometry args={[0.13, 0.13, 1.24, 22]} /><Yute /></mesh>
    {[-0.45, 0.0, 0.45].map((x, i) => env > (x + 0.6) / 1.2 ? <mesh key={i} position={[x, 0.6, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.132, 0.008, 6, 26]} /><meshStandardMaterial color="#8a6a3a" roughness={1} /></mesh> : null)}
  </Estudio>;
}}</Stage>;

// ── 21 · LA LLAVE GOTEANDO (15:13): dos llaves grandes en la noche de helada: de la que gotea cae una gota gorda a la cubeta; a la otra le crece un carámbano
const Llave: React.FC<{ p: V3 }> = ({ p }) => { const cur = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.62, 0), new THREE.Vector3(0, 0.78, 0.02), new THREE.Vector3(0, 0.84, 0.14), new THREE.Vector3(0, 0.78, 0.25), new THREE.Vector3(0, 0.7, 0.27)]);
  return <group position={p}>
  <mesh position={[0, 0.31, 0]} castShadow><cylinderGeometry args={[0.04, 0.045, 0.62, 18]} />{M.cromo("#9a9ca0")}</mesh>
  <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.09, 0.1, 0.08, 20]} /><meshStandardMaterial color="#8a8680" roughness={0.9} /></mesh>
  <mesh geometry={new THREE.TubeGeometry(cur, 30, 0.032, 14)}>{M.cromo("#b0b2b6")}</mesh>
  <mesh position={[0, 0.69, 0.27]}><cylinderGeometry args={[0.038, 0.034, 0.03, 16]} />{M.cromo("#b0b2b6")}</mesh>
  <mesh position={[0, 0.66, 0.0]} scale={0.055} geometry={esfGeo}>{M.cromo("#a8aaae")}</mesh>
  <group position={[0, 0.72, -0.02]}><mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.012, 0.012, 0.06, 8]} />{M.cromo("#a8aaae")}</mesh>
    <mesh position={[0, 0.07, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.016, 0.016, 0.2, 10]} /><meshStandardMaterial color="#b03028" roughness={0.4} /></mesh></group></group>; };
const H21Gotea: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const congela = eio(tt, 0, 2.6), cub = eio(tt, 0.1, 3.6), f = (tt / 1.3) % 1, X = 0.38, Z = 0.27;
  const cuelga = f < 0.6, k = cuelga ? f / 0.6 : (f - 0.6) / 0.4, yb = 0.27 + 0.2 * cub;
  const gy = cuelga ? 0.67 - 0.03 * k : lerp(0.64, yb, k * k);
  return <Estudio t={tt} cam={[0, 0.72, 1.7]} look={[0, 0.42, 0.15]} orbit={0.1}>
    <hemisphereLight args={["#4a6aa0", "#101828", 0.5]} />
    <Llave p={[X, 0, 0]} /><Llave p={[-X, 0, 0]} />
    <mesh position={[X, gy, Z]} scale={[0.024, cuelga ? 0.024 + 0.022 * k : 0.034, 0.024]} geometry={esfGeo}><meshPhysicalMaterial color="#cfeaff" roughness={0.02} clearcoat={1} transmission={0.4} /></mesh>
    {f > 0.92 && Array.from({ length: 7 }, (_, i) => { const q = (f - 0.92) * 12; return <mesh key={i} position={[X + Math.cos(i) * 0.06 * q, yb + 0.06 * Math.sin(q * P), Z + Math.sin(i) * 0.06 * q]} scale={0.009} geometry={esfGeo}><meshBasicMaterial color="#cfeaff" /></mesh>; })}
    {f > 0.92 && <mesh position={[X, yb + 0.003, Z]} rotation={[-P2, 0, 0]} scale={0.02 + (f - 0.92) * 1.2}><ringGeometry args={[0.8, 1, 24]} /><meshBasicMaterial color="#e8f6ff" transparent opacity={1 - (f - 0.92) * 12} /></mesh>}
    {[X, -X].map((x, j) => <group key={j} position={[x, 0, Z]}><mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.16, 0.13, 0.3, 26, 1, true]} /><meshStandardMaterial color={j ? "#5a7a9a" : "#d8d4cc"} roughness={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.13, 0.13, 0.01, 26]} /><meshStandardMaterial color="#c8c4bc" /></mesh>
      {j === 0 && <mesh position={[0, 0.01 + (yb - 0.01) / 2, 0]}><cylinderGeometry args={[0.15, 0.13, yb - 0.01, 26]} />{M.liquido("#8ac0e8", 0.6)}</mesh>}
      <mesh position={[0, 0.3, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.16, 0.012, 8, 32]} /><meshStandardMaterial color={col("#d8d4cc", "#f4fbff", j ? congela : 0)} emissive="#cfe8ff" emissiveIntensity={j ? 0.4 * congela : 0} /></mesh></group>)}
    <mesh position={[-X, 0.685 - 0.14 * congela, Z]} rotation={[P, 0, 0]}><coneGeometry args={[0.034, 0.001 + 0.28 * congela, 14]} /><meshPhysicalMaterial color="#f4fbff" roughness={0.05} clearcoat={1} transparent opacity={0.9} emissive="#9ac8e8" emissiveIntensity={0.3} /></mesh>
    <mesh position={[-X, 0.69, Z]} scale={[0.04, 0.012 + 0.02 * congela, 0.04]} geometry={esfGeo}><meshPhysicalMaterial color="#f4fbff" roughness={0.05} clearcoat={1} emissive="#9ac8e8" emissiveIntensity={0.3} /></mesh>
    {Array.from({ length: 14 }, (_, i) => { const a = i / 14 * P * 2; return <mesh key={i} position={[-X + Math.cos(a) * 0.16, 0.31, Z + Math.sin(a) * 0.16]} rotation={[i, i * 2, 0]} scale={0.001 + 0.016 * cl(congela * 1.5 - rn(i, 3) * 0.5)}><octahedronGeometry args={[1, 0]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} clearcoat={1} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 22 · EL TAMBO A TRES CUARTOS (15:37): el tambo lleno se congela, la panza se infla y revienta; el de tres cuartos sólo hace capita y el palo la rompe
const H22Tambo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const hielo = eio(tt, 0.1, 1.6), panza = eio(tt, 0.8, 1.9), rev = tt > 1.9, palo = eio(tt, 2.6, 3.2);
  return <Estudio t={tt} cam={[0, 1.15, 2.2]} look={[0, 0.45, 0]} orbit={0.1}>
    {[-1, 1].map((s) => { const lleno = s < 0, nivel = lleno ? 0.84 : 0.62;
      return <group key={s} position={[s * 0.48, 0, 0]}>
        {Array.from({ length: 6 }, (_, i) => { const y = 0.07 + i * 0.14, b = lleno ? 1 + 0.18 * panza * Math.sin((i + 0.5) / 6 * P) : 1;
          return <mesh key={i} position={[0, y, 0]} scale={[b, 1, b]}><cylinderGeometry args={[0.27, 0.27, 0.14, 30, 1, true]} /><meshPhysicalMaterial color="#3a7ac0" transparent opacity={0.45} roughness={0.25} side={THREE.DoubleSide} /></mesh>; })}
        <mesh position={[0, nivel / 2, 0]} scale={[lleno ? 1 + 0.14 * panza : 1, 1, lleno ? 1 + 0.14 * panza : 1]}><cylinderGeometry args={[0.255, 0.255, nivel, 30]} /><meshPhysicalMaterial color={col("#5aa0d8", "#eef8ff", lleno ? hielo : 0.1)} roughness={lerp(0.05, 0.5, lleno ? hielo : 0)} transparent opacity={0.75} /></mesh>
        {!lleno && <mesh position={[0, nivel + 0.005, 0]}><cylinderGeometry args={[0.26, 0.26, 0.02, 30]} /><meshPhysicalMaterial color="#f4fbff" roughness={0.3} transparent opacity={0.9 * hielo * (1 - palo)} /></mesh>}
        <Etq p={[0, 0.45, 0.33]} rot={[0, 0, 0]} txt={[lleno ? "lleno" : "3/4"]} w={0.28} h={0.13} bg={lleno ? "#f4d8d0" : "#e0f0d8"} />
        {lleno && rev && <mesh position={[0.3, 0.45, 0.05]} rotation={[0, 0, 0.3]}><boxGeometry args={[0.012, 0.42, 0.02]} /><meshBasicMaterial color="#0a0a0a" /></mesh>}
        {lleno && rev && Array.from({ length: 16 }, (_, i) => { const k = cl((tt - 1.9 - i * 0.02) / 0.7); return <mesh key={i} position={[0.3 + k * 0.5 * rn(i, 1), 0.45 + k * 0.4 * (rn(i, 2) - 0.3) - k * k * 0.3, (rn(i, 3) - 0.5) * 0.3 * k]} rotation={[i, i * 2, 0]} scale={0.03}><octahedronGeometry args={[1, 0]} /><meshPhysicalMaterial color="#eef8ff" roughness={0.1} clearcoat={1} /></mesh>; })}
        {!lleno && <><mesh position={[lerp(0.5, 0.05, palo), lerp(1.25, 0.82, palo), 0]} rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.018, 0.018, 0.7, 8]} />{M.madera("#8a6a40")}</mesh>
          {palo > 0.95 && Array.from({ length: 10 }, (_, i) => { const k = cl((tt - 3.2) / 0.6); return <mesh key={i} position={[Math.cos(i) * 0.12 * (1 + k), nivel + Math.sin(k * P) * 0.12, Math.sin(i) * 0.12 * (1 + k)]} rotation={[i, i * 2, 0]} scale={0.04}><boxGeometry args={[1, 0.25, 1]} /><meshPhysicalMaterial color="#eef8ff" roughness={0.1} clearcoat={1} /></mesh>; })}</>}
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 23 · MAÍZ AL ATARDECER (15:52): la mano suelta el puñito de maíz; el sol baja detrás del gallinero y las gallinas se encienden de luz tibia
const H23Gallinas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sol = eio(tt, 0.1, 4.5), suelta = eio(tt, 0.6, 1.0), glow = eio(tt, 1.6, 3.0);
  return <Estudio t={tt} cam={[0, 1.0, 2.0]} look={[0, 0.3, 0]} orbit={0.1}>
    <directionalLight position={[2, lerp(1.2, 0.25, sol), -2]} intensity={2.2} color={col("#ffd080", "#ff5a2a", sol).getStyle()} castShadow />
    <mesh position={[1.1, lerp(1.2, 0.2, sol), -1.8]} scale={0.22} geometry={esfGeo}><meshBasicMaterial color={col("#ffe080", "#ff6a2a", sol)} /></mesh>
    <group position={[0, 0, -0.75]}>
      {[[-0.7, -0.35], [0.7, -0.35], [-0.7, 0.35], [0.7, 0.35]].map(([x, z], i) => <RBox key={i} p={[x, 0.36, z]} s={[0.05, 0.72, 0.05]} r={0.01}>{M.madera("#6a4a2a")}</RBox>)}
      <mesh position={[0, 0.76, 0]} rotation={[0.12, 0, 0]}><boxGeometry args={[1.6, 0.02, 0.86]} /><meshStandardMaterial color="#9a9ca0" metalness={0.6} roughness={0.35} /></mesh>
      <RBox p={[0, 0.36, -0.36]} s={[1.4, 0.72, 0.03]} r={0.005}>{M.madera("#7a5a3a")}</RBox>
      <mesh position={[0, 0.01, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.4, 0.7]} /><meshStandardMaterial color="#d8c078" roughness={1} /></mesh></group>
    <group position={[0.15, lerp(1.05, 1.0, suelta), 0.35]} rotation={[0.4, 0, P]}><Mano p={[0, 0, 0]} pinza={1 - suelta} s={0.75} /></group>
    {Array.from({ length: 34 }, (_, i) => { const a = 0.75 + rn(i, 4) * 0.25; return tt > a ? <mesh key={i} position={[0.15 + (rn(i, 1) - 0.5) * 0.7 * cl((tt - a) * 1.5), fall(tt, a, 0.95) + 0.012, 0.3 + (rn(i, 2) - 0.5) * 0.45 * cl((tt - a) * 1.5)]} scale={0.016} geometry={esfGeo}><meshStandardMaterial color="#f0c040" /></mesh> : null; })}
    {Array.from({ length: 4 }, (_, i) => <Gallina key={i} t={tt} i={i} p={[(i - 1.5) * 0.38, 0, 0.1 + (i % 2) * 0.18]} ry={-P2 + (i % 2 ? 0.5 : -0.5) + 0.3 * Math.sin(tt * 2 + i) * (tt < 1.6 ? 1 : 0)} pica={tt > 1.6 ? Math.max(0, Math.sin(tt * 6 + i)) * 0.8 : 0} glow={glow} />)}
  </Estudio>;
}}</Stage>;

// ── 24 · LA TARDE DE CUATRO A NUEVE (16:44): el reloj de péndulo da cada hora y suelta lo de esa hora: leña, olla, vela, ropa, cobija, brasero
const H24Rutina: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const T = (k: number) => 0.3 + (k - 4) * 1.3, hr = lerp(4, 9, eio(tt, 0.3, T(9) + 0.2)), lado = eio(tt, T(9) + 0.6, T(9) + 1.4);
  const objs: [number, React.ReactNode][] = [
    [4, <group key="4">{[0, 1, 2].map((i) => <mesh key={i} position={[(i - 1) * 0.07, 0.04 + (i === 1 ? 0.06 : 0), 0]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.035, 0.04, 0.3, 8]} />{M.madera("#6a4428")}</mesh>)}</group>],
    [5, <Olla key="5" s={0.2} mat="barro" nivel={0.7} caldo="#f0c040" t={tt} />],
    [6, <Vela key="6" p={[0, 0, 0]} t={tt} s={0.9} />],
    [7, <Lana key="7" p={[0, 0.06, 0]} s={[0.24, 0.12, 0.18]} k="r7" a="#e8e0cc" b="#3a5a8a" />],
    [8, <Lana key="8" p={[0, 0.05, 0]} s={[0.28, 0.1, 0.2]} k="r8" a="#7a2a22" b="#c8a060" />],
    [9, <Brasero key="9" p={[0, 0, 0]} t={tt} s={0.8} />],
  ];
  return <Estudio t={tt} cam={[0, 1.05, 2.2]} look={[0, 0.55, 0]} orbit={0.1}>
    <group position={[lerp(0, -0.85, lado), 0, -0.25]} scale={lerp(1, 0.75, lado)}>
      <RBox p={[0, 0.85, 0]} s={[0.5, 1.2, 0.14]} r={0.03}>{M.madera("#5a3a22")}</RBox>
      <mesh position={[0, 1.15, 0.075]}><circleGeometry args={[0.19, 40]} /><meshStandardMaterial color="#f4efe2" /></mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i / 12 * P * 2) * 0.16, 1.15 + Math.cos(i / 12 * P * 2) * 0.16, 0.08]}><boxGeometry args={[0.01, 0.03, 0.002]} /><meshBasicMaterial color="#2a1c12" /></mesh>)}
      <mesh position={[0, 1.15, 0.085]} rotation={[0, 0, -(hr / 12) * P * 2]}><boxGeometry args={[0.016, 0.2, 0.004]} /><meshBasicMaterial color="#2a1c12" /></mesh>
      <group position={[0, 0.95, 0.08]} rotation={[0, 0, 0.3 * Math.sin(tt * 3.2)]}><mesh position={[0, -0.22, 0]}><boxGeometry args={[0.012, 0.44, 0.01]} />{M.cromo("#c8a040")}</mesh><mesh position={[0, -0.44, 0]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.015, 24]} />{M.cromo("#c8a040")}</mesh></group></group>
    {objs.map(([k, el], i) => { const a = T(k); if (tt < a) return null; const fx = (i - 2.5) * 0.3;
      return <group key={k}><group position={[lerp(0, fx, eio(tt, a, a + 0.6)), fall(tt, a + 0.1, 0.8) + 0.0, lerp(-0.1, 0.35, eio(tt, a, a + 0.6))]}>{el}</group>
        <Etq p={[fx, 0.03, 0.62]} rot={[-1.1, 0, 0]} txt={[String(k)]} w={0.13} h={0.13} bg="#f4e0c8" /></group>; })}
  </Estudio>;
}}</Stage>;

// ── 25 · UNA TAZA O UNA CUBETA (18:25): el mismo calorcito en el cuarto grande y en el chico: el chico se llena de naranja, el grande queda azul
const H25Cuarto: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = eio(tt, 0.3, 4.0);
  const Cuarto: React.FC<{ x: number; w: number; d: number; ok: number; frio: number }> = ({ x, w, d, ok, frio }) => <group position={[x, 0, 0]}>
    <Adobe p={[0, 0.35, -d / 2]} s={[w, 0.7, 0.06]} glow={ok * 0.5} /><Adobe p={[-w / 2, 0.35, 0]} s={[0.06, 0.7, d]} glow={ok * 0.5} /><Adobe p={[w / 2, 0.35, 0]} s={[0.06, 0.7, d]} glow={ok * 0.5} />
    <mesh position={[0, 0.005, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[w, d]} /><meshStandardMaterial color="#9a8a74" /></mesh>
    <Brasero p={[0, 0, 0]} t={tt} s={0.5} />
    <mesh position={[0, 0.34 * ok + 0.01, 0]} scale={[w * 0.48, 0.34 * ok + 0.005, d * 0.48]}><boxGeometry args={[2, 2, 2]} /><meshBasicMaterial color={CALOR} transparent opacity={0.25} depthWrite={false} /></mesh>
    <mesh position={[0, 0.35, 0]} scale={[w * 0.46, 0.33, d * 0.46]} geometry={esfGeo}><meshBasicMaterial color={FRIO} transparent opacity={0.16 * frio} depthWrite={false} /></mesh></group>;
  return <Estudio t={tt} cam={[0, 1.55, 2.2]} look={[0.1, 0.2, 0]} orbit={0.1}>
    <Cuarto x={-0.5} w={1.2} d={1.0} ok={k * 0.12} frio={1} />
    <Cuarto x={0.75} w={0.55} d={0.5} ok={k} frio={1 - k} />
    <Voluta t={tt} p={[-0.5, 0.3, 0.1]} c={FRIO} n={10} h={0.5} o={0.35} s={0.3} spread={0.8} />
    <Etq p={[-0.5, 0.62, -0.46]} rot={[0, 0, 0]} txt={["4°"]} w={0.22} h={0.15} bg="#dcecf8" ink="#123a6a" />
    <Etq p={[0.75, 0.62, -0.21]} rot={[0, 0, 0]} txt={[`${Math.round(lerp(4, 13, k))}°`]} w={0.22} h={0.15} bg="#f4e0c8" ink="#7a1c12" />
  </Estudio>;
}}</Stage>;

// ── 26 · LA LUZ DEL CORREDOR (20:15): dos casitas distintas con el corredor y su alero; se prende un foco, la luz cruza el piso y prende el de la vecina
const triGeo = (w: number, hh: number) => new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(-w / 2, 0), new THREE.Vector2(w / 2, 0), new THREE.Vector2(0, hh)]));
const Casita: React.FC<{ p: V3; w: number; hh: number; puerta: number; ventana?: number; teja?: string }> = ({ p, w, hh, puerta, ventana, teja = "#a8442a" }) => { const a = 0.5, D = 0.55, rl = (w / 2 + 0.12) / Math.cos(a);
  return <group position={p}>
    <Adobe p={[0, hh / 2, 0]} s={[w, hh, D]} />
    <mesh position={[0, hh, D / 2 + 0.001]} geometry={triGeo(w, Math.tan(a) * w / 2)}><meshStandardMaterial map={adobeTex()} roughness={0.95} side={THREE.DoubleSide} /></mesh>
    {[-1, 1].map((sg) => <mesh key={sg} position={[sg * w / 4, hh + Math.tan(a) * w / 4 + 0.02, 0.05]} rotation={[0, 0, -sg * a]}><boxGeometry args={[rl, 0.045, D + 0.3]} /><meshStandardMaterial color={teja} roughness={0.8} /></mesh>)}
    <PuertaVieja p={[-0.11, 0, D / 2 + 0.01]} abre={puerta} w={0.22} h={0.42} />
    <mesh position={[0, 0.21, D / 2 + 0.003]}><planeGeometry args={[0.2, 0.4]} /><meshBasicMaterial color="#ffcf80" transparent opacity={0.9 * cl(puerta * 2)} /></mesh>
    {ventana !== undefined && <group position={[w * 0.28, hh * 0.6, D / 2 + 0.01]}><RBox s={[0.17, 0.15, 0.03]} r={0.005}>{M.madera("#5a3a22")}</RBox>
      <mesh position={[0, 0, 0.017]}><planeGeometry args={[0.13, 0.11]} /><meshStandardMaterial color="#2a2a30" emissive="#ffb050" emissiveIntensity={cl(ventana) * 1.6} /></mesh></group>}</group>; };
const H26Vecina: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const a = phys(tt, 0.4, 9, 0.3), viaja = eio(tt, 0.9, 2.3), b = phys(tt, 2.3, 9, 0.3), alba = eio(tt, 0, 6), pa = eio(tt, 0.9, 1.5), pb = eio(tt, 2.8, 3.4);
  const Foco: React.FC<{ p: V3; on: number }> = ({ p, on }) => <group position={p}><mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.004, 0.004, 0.3, 6]} /><meshBasicMaterial color="#222" /></mesh>
    <mesh position={[0, 0.03, 0]}><coneGeometry args={[0.09, 0.07, 20, 1, true]} /><meshStandardMaterial color="#3a4a3a" roughness={0.6} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, -0.02, 0]} scale={0.045} geometry={esfGeo}><meshStandardMaterial color="#fff0c0" emissive="#ffd27a" emissiveIntensity={cl(on) * 3.5} /></mesh>
    <sprite position={[0, -0.03, 0]} scale={[0.5 * cl(on) + 0.001, 0.5 * cl(on) + 0.001, 1]}><spriteMaterial map={humoTex()} color="#ffd27a" transparent opacity={0.55} depthWrite={false} /></sprite>
    <pointLight position={[0, -0.05, 0.05]} intensity={cl(on) * 2.4} color="#ffd27a" distance={2.4} castShadow /></group>;
  const Vecina: React.FC<{ p: V3; on: number }> = ({ p, on }) => <group position={p} scale={Math.max(0.001, cl(on))}>
    <mesh position={[0, 0.15, 0]}><coneGeometry args={[0.1, 0.3, 18]} /><meshStandardMaterial color="#3a3a5a" roughness={1} /></mesh>
    <mesh position={[0, 0.33, 0]} scale={[0.085, 0.09, 0.07]} geometry={esfGeo}><meshStandardMaterial map={rayas("rebozo", "#5a2a3a", "#8a5a6a", 7)} roughness={1} /></mesh>
    <mesh position={[0, 0.43, 0]} scale={0.045} geometry={esfGeo}><meshStandardMaterial color="#8a6040" /></mesh>
    <mesh position={[0, 0.45, -0.005]} scale={[0.055, 0.05, 0.055]} geometry={esfGeo}><meshStandardMaterial map={rayas("rebozo", "#5a2a3a", "#8a5a6a", 7)} roughness={1} /></mesh></group>;
  return <Estudio t={tt} cam={[0, 0.85, 2.35]} look={[0, 0.45, 0]} orbit={0.1}>
    <hemisphereLight args={[col("#1a2448", "#7a8ab0", alba * 0.7).getStyle(), "#101018", 0.7]} />
    <mesh position={[0, 1.2, -1.2]}><planeGeometry args={[5, 3]} /><meshBasicMaterial color={col("#0e1630", "#4a5a88", alba * 0.8)} /></mesh>
    <Casita p={[-0.58, 0, -0.2]} w={0.8} hh={0.5} puerta={pa} />
    <Casita p={[0.6, 0, -0.2]} w={0.74} hh={0.62} puerta={pb} ventana={b} teja="#8a3a24" />
    <Foco p={[-0.3, 0.72, 0.25]} on={a} /><Foco p={[0.32, 0.82, 0.25]} on={b} />
    <mesh position={[lerp(-0.3, 0.32, viaja), 0.004, 0.3]} rotation={[-P2, 0, 0]} scale={[0.32, 0.2, 1]}><circleGeometry args={[1, 32]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.45 * cl(a)} depthWrite={false} /></mesh>
    <Vecina p={[-0.69, 0, 0.2 + 0.12 * pa]} on={pa} /><Vecina p={[0.49, 0, 0.2 + 0.12 * pb]} on={pb} />
  </Estudio>;
}}</Stage>;

// ── 27 · EL RESUMEN (20:35): la casita en corte se arma pared por pared y entran grandes, de a uno: culebra, cortina, petate, fogón, cama, gorro, botella; se entibia
const H27Resumen: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const wall = (i: number) => Math.max(0.001, phys(tt, 0.05 + i * 0.15, 8, 0.45)), on = (i: number) => Math.max(0.001, phys(tt, 0.6 + i * 0.36, 7, 0.45)), tib = eio(tt, 3.2, 4.6);
  return <Estudio t={tt} cam={[0.1, 1.45, 2.15]} look={[0, 0.3, 0]} orbit={0.12}>
    <group scale={[1, wall(0), 1]}><Adobe p={[0, 0.4, -0.6]} s={[2.0, 0.8, 0.08]} glow={tib * 0.5} /></group>
    <group scale={[1, wall(1), 1]}><Adobe p={[-1.0, 0.4, 0]} s={[0.08, 0.8, 1.2]} glow={tib * 0.5} /></group>
    <group scale={[1, wall(2), 1]}><Adobe p={[1.0, 0.4, 0]} s={[0.08, 0.8, 1.2]} glow={tib * 0.5} /></group>
    <mesh position={[0, 0.005, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[2.0, 1.2]} /><meshStandardMaterial color={col("#7a8aa0", "#b08a64", tib)} /></mesh>
    <group position={[-0.5, 0, 0.5]} scale={on(0)}><mesh position={[0, 0.05, 0]} rotation={[P2, 0, P2]}><cylinderGeometry args={[0.05, 0.05, 0.6, 14]} /><meshStandardMaterial map={jean()} roughness={1} /></mesh></group>
    <group position={[-0.45, 0.42, -0.55]} scale={on(1)}><Lana p={[0, 0, 0]} s={[0.5, 0.45, 0.03]} k="r27" a="#7a2a22" b="#c8a060" /></group>
    <group position={[0.4, 0.012, 0.25]} scale={on(2)}><RBox s={[0.8, 0.02, 0.5]} r={0.005}><meshStandardMaterial map={petateTex()} roughness={1} /></RBox></group>
    <group position={[-0.6, 0, -0.15]} scale={on(3)}><RBox p={[0, 0.17, 0]} s={[0.42, 0.34, 0.32]} r={0.04}><meshStandardMaterial color="#8a5a3a" /></RBox><Olla p={[0, 0.34, 0]} s={0.2} mat="barro" nivel={0.6} t={tt} hervor={0.4} /></group>
    <group position={[0.5, 0, -0.25]} scale={on(4)}><Cama s={0.62} rot={[0, P2 * 0, 0]}><Lana p={[0, 0.38, 0]} s={[0.98, 0.03, 0.6]} k="r27b" a="#c8b898" b="#8a6a4a" /><Lana p={[0, 0.42, 0]} s={[0.98, 0.04, 0.6]} k="r27c" a="#2f5a8a" b="#e8d8a8" /></Cama></group>
    <group position={[0.3, 0.33, -0.25]} scale={on(5)}><mesh scale={[0.09, 0.08, 0.09]}><sphereGeometry args={[1, 20, 10, 0, P * 2, 0, P2]} /><meshStandardMaterial map={tejido("g27", "#2f5a8a")} roughness={1} /></mesh></group>
    <group position={[0.75, 0.33, -0.25]} scale={on(6)} rotation={[0, 0, P2]}><mesh><cylinderGeometry args={[0.05, 0.05, 0.18, 14]} /><meshStandardMaterial map={tejido("c27", "#8a8a7a")} roughness={1} /></mesh></group>
    <pointLight position={[0, 0.6, 0.3]} intensity={tib * 2.0} color={CALOR} distance={2.4} />
    <Voluta t={tt} p={[0, 0.2, 0]} c={col(FRIO, CALOR, tib).getStyle()} n={10} h={0.5} o={0.25} s={0.35} spread={1.4} />
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  hielo: H1Hielo, diez: H2Diez, calentador: H3Calentador, monoxido: H4Monoxido, anafre: H5Anafre, olla: H6Olla, rendijas: H7Rendijas, culebra: H8Culebra,
  vela: H9Vela, cortina: H10Cortina, petate: H11Petate, bufanda: H12Bufanda, muro: H13Muro, humo: H14Humo, cobija: H15Cobija, gorro: H16Gorro,
  botella: H17Botella, ladrillo: H18Ladrillo, atole: H19Atole, tubo: H20Tubo, gotea: H21Gotea, tambo: H22Tambo, gallinas: H23Gallinas,
  rutina: H24Rutina, cuarto: H25Cuarto, vecina: H26Vecina, resumen: H27Resumen,
};
