// so29 · KIT de los componentes únicos de la COCINA (sirve a los 5 videos de la tanda so29).
// Es una maqueta sobre la mesada: tapa de madera barnizada como piso, azulejos blancos al fondo, luz de ventana de costado,
// y Blanquito-Sachiko (arcilla blanca con moño) chiquita al lado de los objetos gigantes. Cada objeto se entiende sin leer;
// la palabra va DENTRO de la escena (cartel/tarjeta 3D) o abajo al centro con tinta, nunca arriba a la izquierda.
// Luces SIEMPRE montadas; lo que aparece entra con resorte y nunca con escala 0 (se monta recién cuando k > 0.02).
import React, { useMemo } from "react";
import * as THREE from "three";
import { H, Stage, cl, phys, eio, AMB, TX } from "./hkit";
import { Set3D, Sachi, PZ, secuencia, sv, orbita, Box, Cyl, Cam3, V } from "./set3d";
import { mk } from "./casa3d";
import { Pose } from "./s3d/rig";
import { POSES } from "./s3d/acciones";

export { cl, phys, eio, sv, orbita, Sachi, PZ, secuencia, Box, Cyl, POSES, AMB };
export type { H, Cam3, V, Pose };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const it = (h: H, i: number, d = 99) => h.items?.[i]?.at ?? d;
export const S = 0.25;                                   // escala de Blanquito
export const C = (p: V, l: V, fov = 32): Cam3 => ({ p, l, fov });
export const pop = (tt: number, a: number, w = 6.5, z = 0.42) => phys(tt, a, w, z);   // resorte con peso
// algo que aparece: escala por resorte pero montado sólo cuando ya existe (nunca escala 0 con bloom = rectángulo negro)
export const Pop: React.FC<{ k: number; p: V; s?: number; rot?: V; children: React.ReactNode }> = ({ k, p, s = 1, rot, children }) =>
  k < 0.02 ? null : <group position={[p[0], p[1] + (1 - Math.min(1, k)) * 0.35, p[2]]} rotation={rot} scale={s * Math.max(0.05, k)}>{children}</group>;

// palabra grande con contorno de tinta, abajo al centro (se lee en el celular)
export const Ink: React.FC<{ tt: number; at: number; txt: string; col?: string; x?: number; y?: number; size?: number }> = ({ tt, at, txt, col = TX, x = 960, y = 930, size = 84 }) => {
  const s = phys(tt, at, 7, 0.45); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -40}px) scale(${0.8 + 0.2 * s})`, opacity: cl(s * 2), fontWeight: 900, fontSize: size * 1.12, letterSpacing: 2, color: col, whiteSpace: "nowrap",
    WebkitTextStroke: `${Math.max(6, size * 0.13)}px #2a1d12`, paintOrder: "stroke fill", textShadow: "0 8px 26px rgba(40,25,10,.45)" } as React.CSSProperties}>{txt}</div>;
};

// ---------------- texturas ----------------
export const cardTex = (lines: string[], o: { bg?: string; fg?: string; w?: number; h?: number; font?: string; band?: string } = {}) => {
  const w = o.w ?? 512, h = o.h ?? 320;
  return mk(w, h, (g) => {
    g.fillStyle = o.bg ?? "#fbf8f1"; g.fillRect(0, 0, w, h);
    if (o.band) { g.fillStyle = o.band; g.fillRect(0, 0, w, h * 0.2); }
    g.fillStyle = o.fg ?? "#1e1813"; g.textAlign = "center"; g.textBaseline = "middle";
    const n = lines.length; lines.forEach((l, i) => { const big = i === 0; g.font = `${big ? 900 : 700} ${Math.round((big ? 0.3 : 0.17) * h * (n > 2 ? 0.8 : 1))}px ${o.font ?? "Arial, sans-serif"}`; g.fillText(l, w / 2, h * (o.band ? 0.58 : 0.5) + (i - (n - 1) / 2) * h * (n > 2 ? 0.26 : 0.34)); });
  });
};
export const useKT = () => useMemo(() => ({
  salmon: mk(256, 128, (g) => { g.fillStyle = "#f2894f"; g.fillRect(0, 0, 256, 128); g.strokeStyle = "rgba(255,240,225,.85)"; g.lineWidth = 3; for (let x = -40; x < 300; x += 22) { g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + 22, 64, x - 8, 128); g.stroke(); } }),
  salmonDull: mk(256, 128, (g) => { g.fillStyle = "#c98a6a"; g.fillRect(0, 0, 256, 128); g.strokeStyle = "rgba(225,215,205,.6)"; g.lineWidth = 3; for (let x = -40; x < 300; x += 22) { g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + 22, 64, x - 8, 128); g.stroke(); } }),
  wild: mk(256, 128, (g) => { g.fillStyle = "#d8463a"; g.fillRect(0, 0, 256, 128); g.strokeStyle = "rgba(255,225,215,.55)"; g.lineWidth = 2; for (let x = -40; x < 300; x += 26) { g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + 22, 64, x - 8, 128); g.stroke(); } }),
  ice: mk(256, 256, (g) => { g.fillStyle = "#dfeef5"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(255,255,255,${0.4 + 0.5 * Math.random()})`; g.beginPath(); g.arc(Math.random() * 256, Math.random() * 256, 4 + 10 * Math.random(), 0, 7); g.fill(); } }),
  tiles: mk(256, 256, (g) => { g.fillStyle = "#b9b3a8"; g.fillRect(0, 0, 256, 256); for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { g.fillStyle = "#f3f1ec"; g.fillRect(x * 64 + 2, y * 64 + 2, 60, 60); } }),
  paper: mk(256, 256, (g) => { g.fillStyle = "#efe6d2"; g.fillRect(0, 0, 256, 256); g.fillStyle = "rgba(60,50,40,.55)"; for (let y = 14; y < 256; y += 9) for (let x = 10; x < 246; x += 4) if (Math.random() > 0.35) g.fillRect(x, y, 3, 2); }),
}), []);

// ---------------- la maqueta: mesada + azulejos ----------------
const Back: React.FC<{ glow?: number }> = ({ glow = 0 }) => {
  const T = useKT();
  return <group>
    <mesh position={[0, 1.6, -1.6]}><planeGeometry args={[14, 3.4]} /><meshStandardMaterial map={T.tiles} color="#ffffff" roughness={0.4} emissive="#ffe0b0" emissiveIntensity={0.05 + 0.1 * glow} /></mesh>
    <Box p={[0, 0.03, -1.55]} s={[14, 0.06, 0.04]} c="#7a5634" />
  </group>;
};
export const KSet: React.FC<{ cam: Cam3; children?: React.ReactNode; warm?: number; spot?: V; spotK?: number; back?: boolean; bg?: string }> = ({ cam, children, warm = 0.25, spot = [0, 0, 0], spotK = 0, back = true, bg = "#e9e1d2" }) => {
  return <Set3D cam={cam} floor="wood" wall={false} warm={warm} spot={spot} spotK={spotK} bg={bg}>
    {back && <Back glow={spotK} />}
    {children}
  </Set3D>;
};
const dolly = (c: Cam3, d: number, ly: number): Cam3 => { const l: V = [c.l[0], c.l[1] + ly, c.l[2]]; return { p: [l[0] + (c.p[0] - c.l[0]) * d, l[1] + (c.p[1] - c.l[1]) * d, l[2] + (c.p[2] - c.l[2]) * d], l, fov: c.fov }; };
export const Hero: React.FC<{ t: number; h: H; mode: any; cam: (tt: number) => Cam3; set?: any; scene: (tt: number) => React.ReactNode; over?: (tt: number) => React.ReactNode; d?: number; ly?: number }> = ({ t, h, mode, cam, set = {}, scene, over, d = 1.0, ly = 0 }) =>
  <Stage t={t} h={h} mode={mode} bare>{(tt) => <>
    <KSet cam={dolly(cam(tt), d, ly)} {...(typeof set === "function" ? set(tt) : set)}>{scene(tt)}</KSet>
    {over?.(tt)}
  </>}</Stage>;
export type F = React.FC<{ t: number; h: H }>;

// ---------------- objetos ----------------
// filete de salmón (piel plateada abajo, carne con vetas); dull = viejo y opaco; wild = rojo
export const Fillet: React.FC<{ p: V; s?: number; rotY?: number; kind?: "farm" | "dull" | "wild"; dent?: number; glint?: number }> = ({ p, s = 1, rotY = 0, kind = "farm", dent = 0, glint = 0 }) => {
  const T = useKT(); const map = kind === "dull" ? T.salmonDull : kind === "wild" ? T.wild : T.salmon;
  return <group position={p} rotation={[0, rotY, 0]} scale={s}>
    <Box p={[0, 0.012, 0]} s={[0.72, 0.022, 0.32]} c="#8d939b" r={0.35} m={0.3} rad={0.01} />
    <Box p={[0, 0.05, 0]} s={[0.7, 0.06, 0.3]} c="#ffffff" map={map} r={kind === "dull" ? 0.85 : 0.22} rad={0.02} />
    {dent > 0.01 && <mesh position={[0.05, 0.081, 0.02]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.045, 24]} /><meshStandardMaterial color="#c4683a" transparent opacity={0.8 * dent} roughness={0.5} depthWrite={false} /></mesh>}
    {glint > 0.01 && <mesh position={[-0.35 + 0.7 * cl(glint), 0.082, 0]} rotation={[-Math.PI / 2, 0, 0.5]}><planeGeometry args={[0.06, 0.34]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.7 * Math.sin(Math.PI * cl(glint))} toneMapped={false} depthWrite={false} /></mesh>}
  </group>;
};
// tarjeta clavada en un palito (el cartelito del mostrador)
export const PickCard: React.FC<{ p: V; map: THREE.Texture; s?: number; rotY?: number; tilt?: number }> = ({ p, map, s = 1, rotY = 0, tilt = 0 }) =>
  <group position={p} rotation={[0, rotY, tilt]} scale={s}>
    <Cyl p={[0, 0.12, 0]} r={0.006} h={0.24} c="#f2f2f2" rough={0.4} />
    <Box p={[0, 0.3, 0]} s={[0.36, 0.22, 0.008]} c="#ffffff" r={0.7} rad={0.006} />
    <mesh position={[0, 0.3, 0.0045]}><planeGeometry args={[0.35, 0.21]} /><meshStandardMaterial map={map} roughness={0.7} /></mesh>
  </group>;
// cama de hielo (bandeja de acero con hielo picado)
export const IceTray: React.FC<{ p: V; w?: number; d?: number }> = ({ p, w = 1.8, d = 0.9 }) => {
  const T = useKT();
  return <group position={p}>
    <Box p={[0, 0.04, 0]} s={[w + 0.1, 0.08, d + 0.1]} c="#c9ced3" m={0.85} r={0.25} rad={0.02} />
    <Box p={[0, 0.085, 0]} s={[w, 0.03, d]} c="#ffffff" map={T.ice} r={0.15} rad={0.01} />
  </group>;
};
// cartel parado (tarjeta grande en atril)
export const Sign: React.FC<{ p: V; map: THREE.Texture; w?: number; h?: number; rotY?: number; glow?: number }> = ({ p, map, w = 0.9, h = 0.56, rotY = 0, glow = 0 }) =>
  <group position={p} rotation={[0, rotY, 0]}>
    <Box p={[0, h / 2 + 0.04, -0.02]} s={[w + 0.06, h + 0.06, 0.03]} c="#6b4a2c" r={0.6} rad={0.01} />
    <mesh position={[0, h / 2 + 0.04, 0.0]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={map} roughness={0.75} emissive="#ffffff" emissiveMap={map} emissiveIntensity={0.08 + 0.25 * glow} /></mesh>
    <Box p={[0, 0.02, 0.1]} s={[w * 0.6, 0.04, 0.22]} c="#6b4a2c" r={0.6} rad={0.01} />
  </group>;
// sartén de hierro
export const Pan: React.FC<{ p: V; s?: number; heat?: number }> = ({ p, s = 1, heat = 0 }) =>
  <group position={p} scale={s}>
    <Cyl p={[0, 0.04, 0]} r={0.42} r2={0.38} h={0.08} c="#26272a" rough={0.5} m={0.7} />
    <Cyl p={[0, 0.082, 0]} r={0.38} h={0.004} c={new THREE.Color("#1a1b1d").lerp(new THREE.Color("#3a2416"), heat * 0.3).getStyle()} rough={0.4} m={0.7} />
    <Box p={[0.68, 0.07, 0]} s={[0.55, 0.05, 0.1]} c="#26272a" r={0.5} m={0.7} rad={0.02} />
  </group>;
// bocanadas de vapor (lento, nunca titila)
export const Steam: React.FC<{ p: V; t: number; k?: number; n?: number; s?: number; col?: string }> = ({ p, t, k = 1, n = 6, s = 1, col = "#ffffff" }) => k < 0.02 ? null :
  <group position={p}>{Array.from({ length: n }, (_, i) => { const u = (t * 0.35 + i / n) % 1; return <mesh key={i} position={[0.06 * s * Math.sin(u * 6 + i), u * 0.8 * s, 0.04 * s * Math.cos(u * 5 + i)]}><sphereGeometry args={[(0.05 + u * 0.1) * s, 12, 8]} /><meshStandardMaterial color={col} transparent opacity={0.32 * k * Math.sin(Math.PI * u)} depthWrite={false} /></mesh>; })}</group>;
// anillo de luz sobre la mesada
export const Ring: React.FC<{ p: V; r: number; k: number; col?: string }> = ({ p, r, k, col = "#ffb347" }) =>
  k < 0.02 ? null : <mesh position={p} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[r * 0.8, r, 64]} /><meshBasicMaterial color={col} transparent opacity={0.75 * cl(k)} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} /></mesh>;
// moneda / billete
export const Coin: React.FC<{ p: V; s?: number; rot?: V }> = ({ p, s = 1, rot = [0, 0, 0] }) =>
  <group position={p} rotation={rot} scale={s}><Cyl p={[0, 0, 0]} r={0.09} h={0.018} c="#c9a24a" m={0.85} rough={0.3} /></group>;
export const Bill: React.FC<{ p: V; s?: number; rot?: V }> = ({ p, s = 1, rot = [0, 0, 0] }) =>
  <group position={p} rotation={rot} scale={s}><Box p={[0, 0, 0]} s={[0.42, 0.006, 0.19]} c="#9cb88a" r={0.8} rad={0.003} /><Box p={[0, 0.004, 0]} s={[0.12, 0.004, 0.12]} c="#6f8f5f" r={0.8} rad={0.003} /></group>;
// termómetro de dial gigante
export const Dial: React.FC<{ p: V; ang: number; s?: number; rotY?: number; face?: THREE.Texture; rim?: string }> = ({ p, ang, s = 1, rotY = 0, face, rim = "#c9ccd2" }) =>
  <group position={p} rotation={[0, rotY, 0]} scale={s}>
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.5, 0.5, 0.12, 64]} /><meshStandardMaterial color={rim} metalness={0.7} roughness={0.25} /></mesh>
    <mesh position={[0, 0, 0.062]}><circleGeometry args={[0.44, 64]} /><meshStandardMaterial color="#f6f1e7" map={face} roughness={0.6} /></mesh>
    <group position={[0, 0, 0.075]} rotation={[0, 0, -ang]}><Box p={[0, 0.17, 0]} s={[0.03, 0.34, 0.01]} c="#c0392b" cast={false} /></group>
    <Cyl p={[0, 0, 0.08]} r={0.03} h={0.01} c="#222" rot={[Math.PI / 2, 0, 0]} />
  </group>;
// cuenco
export const Bowl: React.FC<{ p: V; s?: number; c?: string; fill?: string; fillK?: number }> = ({ p, s = 1, c = "#2c4a8a", fill = "#fbfaf5", fillK = 1 }) =>
  <group position={p} scale={s}>
    <mesh position={[0, 0.12, 0]} rotation={[Math.PI, 0, 0]} castShadow><sphereGeometry args={[0.22, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={c} roughness={0.3} side={THREE.DoubleSide} /></mesh>
    {fillK > 0.02 && <mesh position={[0, 0.06 + 0.05 * fillK, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.2 * Math.sqrt(0.6 + 0.4 * fillK), 32]} /><meshStandardMaterial color={fill} roughness={0.6} /></mesh>}
  </group>;
// palitos
export const Sticks: React.FC<{ p: V; rot?: V; s?: number }> = ({ p, rot = [0, 0, 0], s = 1 }) =>
  <group position={p} rotation={rot} scale={s}>{[-0.02, 0.02].map((x) => <Cyl key={x} p={[x, 0, 0]} r={0.008} r2={0.004} h={0.5} c="#8a5d35" rot={[Math.PI / 2, 0, 0]} />)}</group>;
// pez entero estilizado (cuerpo + cola + aleta), con el collar resaltable
export const Fish: React.FC<{ p: V; s?: number; rotY?: number; collar?: number; lift?: number }> = ({ p, s = 1, rotY = 0, collar = 0, lift = 0 }) =>
  <group position={p} rotation={[0, rotY, 0]} scale={s}>
    <mesh position={[0, 0.18, 0]} scale={[1.6, 0.5, 0.32]} castShadow><sphereGeometry args={[0.35, 40, 24]} /><meshStandardMaterial color="#aab4bd" metalness={0.15} roughness={0.6} /></mesh>
    <mesh position={[0.02, 0.12, 0]} scale={[1.5, 0.28, 0.31]}><sphereGeometry args={[0.35, 32, 16]} /><meshStandardMaterial color="#f2a585" roughness={0.35} /></mesh>
    <mesh position={[0, 0.28, 0]} scale={[1.45, 0.28, 0.22]}><sphereGeometry args={[0.35, 32, 16]} /><meshStandardMaterial color="#3d5266" metalness={0.15} roughness={0.55} /></mesh>
    <mesh position={[-0.68, 0.18, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.15]}><coneGeometry args={[0.18, 0.3, 3]} /><meshStandardMaterial color="#7a8a99" metalness={0.05} roughness={0.55} /></mesh>
    <mesh position={[0.5, 0.2, 0.1]}><sphereGeometry args={[0.035, 16, 10]} /><meshStandardMaterial color="#111" /></mesh>
    {/* el collar: la media luna detrás de la cabeza, con la aleta */}
    <group position={[0.3, 0.18 + 0.35 * lift, 0.02 + 0.25 * lift]} rotation={[0, 0, -0.2 * lift]}>
      <mesh scale={[0.35, 0.8, 0.36]}><sphereGeometry args={[0.24, 24, 16, 0, Math.PI]} /><meshStandardMaterial color={new THREE.Color("#9fb0bf").lerp(new THREE.Color("#f2894f"), collar).getStyle()} metalness={0.05} roughness={0.5} emissive="#ff8a3d" emissiveIntensity={0.35 * collar} /></mesh>
      <mesh position={[0, -0.1, 0.09]} rotation={[0.4, 0, -0.6]} scale={[1, 1, 0.1]}><coneGeometry args={[0.07, 0.18, 3]} /><meshStandardMaterial color="#7d8fa0" /></mesh>
    </group>
  </group>;
// heladera/freezer cortado (caja con frente abierto)
export const Freezer: React.FC<{ p: V; s?: number; frost?: number; c?: string }> = ({ p, s = 1, frost = 0, c = "#ecebe7" }) =>
  <group position={p} scale={s}>
    <Box p={[0, 0.02, 0]} s={[0.9, 0.04, 0.7]} c={c} r={0.3} rad={0.01} /><Box p={[0, 0.98, 0]} s={[0.9, 0.04, 0.7]} c={c} r={0.3} rad={0.01} />
    {[-1, 1].map((k) => <Box key={k} p={[k * 0.43, 0.5, 0]} s={[0.04, 1.0, 0.7]} c={c} r={0.3} rad={0.01} />)}
    <Box p={[0, 0.5, -0.33]} s={[0.9, 1.0, 0.04]} c="#dceaf3" r={0.5} rad={0.01} e="#cfe9ff" ei={0.08 + 0.2 * frost} />
    {frost > 0.02 && [0, 1, 2, 3, 4, 5].map((i) => <mesh key={i} position={[-0.3 + 0.12 * i, 0.94 - 0.03 * (i % 2), -0.1]}><coneGeometry args={[0.025, 0.08 + 0.1 * frost, 6]} /><meshStandardMaterial color="#f4fbff" transparent opacity={0.85 * frost} roughness={0.2} /></mesh>)}
  </group>;
