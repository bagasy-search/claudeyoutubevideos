// sk8pb · componentes ÚNICOS del video de la tabla de cortar (uno por minuto; ver D:/rtmp/premium8n_sachiko_COMPONENTES.md).
// Maqueta sobre la mesada (hk.tsx). Cada uno = UNA idea con un objeto que se entiende sin leer. Nada de random sin semilla ni escala 0.
import React, { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { F, Hero, C, lerp, pop, Pop, Ink, cardTex, Pan, Bowl, Ring, Sachi, PZ, cl, eio, orbita, Box, Cyl, V } from "./hk";

const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const PI = Math.PI, MOLD = "#17140f", WATER = "#9fd4ff", SALT = "#f6f4ee";

let _soft: THREE.Texture | null = null;
const softTex = () => { if (_soft) return _soft; const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d")!, g = x.createRadialGradient(64, 64, 2, 64, 64, 63); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.45, "rgba(255,255,255,.42)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 128, 128); _soft = new THREE.CanvasTexture(c); return _soft; };
// puntos: GTAOPass oculta Points/Lines (un plano o sprite transparente deja un recuadro en la pasada AO)
const Puff: React.FC<{ p: V; r: number; c?: string; op?: number }> = ({ p, r, c = "#efeae0", op = 0.5 }) => { const cam = useThree((x) => x.camera) as THREE.PerspectiveCamera; const size = (2 * r) / Math.tan((cam.fov * PI) / 360); const geo = useMemo(() => new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3)), []); return <points position={p} geometry={geo} renderOrder={5}><pointsMaterial map={softTex()} color={c} size={size} sizeAttenuation transparent opacity={op} depthWrite={false} toneMapped={false} /></points>; };
const Steam: React.FC<{ p: V; t: number; k?: number; n?: number; s?: number }> = ({ p, t, k = 1, n = 6, s = 1 }) => k < 0.02 ? null : <>{Array.from({ length: n }, (_, i) => { const u = (t * 0.33 + i / n) % 1; return <Puff key={i} p={[p[0] + 0.05 * s * (1 + 2 * u) * Math.sin(i * 2.4 + t * 0.7), p[1] + u * 0.72 * s, p[2] + 0.05 * s * Math.cos(i * 1.7 + t * 0.5)]} r={(0.07 + 0.17 * u) * s} op={0.3 * k * Math.sin(PI * u)} />; })}</>;
const Drop: React.FC<{ p: V; s?: number; c?: string; op?: number }> = ({ p, s = 1, c = WATER, op = 0.85 }) => <mesh position={p} scale={[s, s * 1.3, s]}><sphereGeometry args={[0.022, 12, 10]} /><meshStandardMaterial color={c} transparent opacity={op} roughness={0.05} /></mesh>;
const Disc: React.FC<{ p: V; r: number; c: string; ry?: number; rough?: number; m?: number }> = ({ p, r, c, ry = 1, rough = 0.5, m = 0 }) => <mesh position={p} rotation={[-PI / 2, 0, 0]} scale={[1, ry, 1]}><circleGeometry args={[r, 28]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} /></mesh>;

// madera dibujada: vetas largas, y si es vieja, cortes de cuchillo
const WT = new Map<string, THREE.Texture>();
const woodT = (kind: string) => { const hit = WT.get(kind); if (hit) return hit;
  const P: Record<string, [string, string]> = { maple: ["#d9ac72", "#9c6c3a"], old: ["#a87b4c", "#5c3d20"], white: ["#f1dcb6", "#c9a878"], pale: ["#d8c7a8", "#a8957a"], rich: ["#9a5f2c", "#512c10"] };
  const [b, l] = P[kind] ?? P.maple, cv = document.createElement("canvas"); cv.width = 768; cv.height = 480; const g = cv.getContext("2d")!;
  g.fillStyle = b; g.fillRect(0, 0, 768, 480);
  for (let i = 0; i < 90; i++) { const y = rnd(i) * 480, a = 3 + rnd(i + 2) * 7; g.strokeStyle = l; g.globalAlpha = 0.12 + rnd(i + 5) * 0.3; g.lineWidth = 0.8 + rnd(i + 4) * 2.2; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= 768; x += 32) g.lineTo(x, y + a * Math.sin(x * 0.012 + i)); g.stroke(); }
  if (kind === "old") { g.strokeStyle = "#3a2612"; for (let i = 0; i < 46; i++) { g.globalAlpha = 0.3 + rnd(i + 8) * 0.45; g.lineWidth = 1 + rnd(i + 3) * 1.6; const x = rnd(i + 11) * 700, y = rnd(i + 13) * 440, a = rnd(i + 15) * 6.3, n = 60 + rnd(i) * 150; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * n, y + Math.sin(a) * n); g.stroke(); } }
  g.globalAlpha = 1; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; WT.set(kind, t); return t; };
const Board: React.FC<{ p: V; rot?: V; w?: number; d?: number; h?: number; kind?: string; under?: string; c?: string; children?: React.ReactNode }> = ({ p, rot = [0, 0, 0], w = 1.3, d = 0.8, h = 0.06, kind = "maple", under, c = "#b98a55", children }) => <group position={p} rotation={rot}>
  <Box p={[0, 0, 0]} s={[w, h, d]} c={c} r={0.65} rad={Math.min(0.012, h * 0.3)} cast />
  <mesh position={[0, h / 2 + 0.005, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[w - 0.03, d - 0.03]} /><meshStandardMaterial map={woodT(kind)} roughness={0.62} /></mesh>
  <mesh position={[0, -h / 2 - 0.005, 0]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[w - 0.03, d - 0.03]} /><meshStandardMaterial map={woodT(under ?? kind)} roughness={0.62} /></mesh>
  {children}</group>;
// colonia de moho: seis manchas chiquitas alrededor; face=-1 = en la cara de abajo
const Colony: React.FC<{ x: number; z: number; y: number; k: number; s?: number; i?: number; face?: 1 | -1; c?: string }> = ({ x, z, y, k, s = 1, i = 0, face = 1, c = MOLD }) => k < 0.04 ? null : <>{Array.from({ length: 6 }, (_, j) => { const a = j * 1.05 + i, R = j === 0 ? 0 : 0.028 * s * k * (0.7 + rnd(i + j)); return <mesh key={j} position={[x + R * Math.cos(a), y + 0.0015 * j * face, z + R * Math.sin(a)]} rotation={[-(face * PI) / 2, 0, 0]}><circleGeometry args={[(0.012 + 0.02 * rnd(i * 3 + j)) * s * k, 12]} /><meshStandardMaterial color={c} roughness={1} /></mesh>; })}</>;
const SPOTS = (n: number, w = 1.3, d = 0.8) => Array.from({ length: n }, (_, i) => { const cx = i % 2 ? 1 : -1, cz = i % 4 < 2 ? 1 : -1, near = i % 5 !== 4, R = near ? 0.05 + rnd(i) * 0.3 : 0; return { x: near ? cx * (w / 2 - 0.08 - R * rnd(i + 2)) : (rnd(i + 1) - 0.5) * w * 0.8, z: near ? cz * (d / 2 - 0.08 - R * rnd(i + 4)) : (rnd(i + 3) - 0.5) * d * 0.8, s: 0.6 + rnd(i + 6) * 1.2 }; });
const Hair: React.FC<{ n: number; pts: (i: number) => { p: V; r: V }; len: (i: number) => number; c?: string }> = ({ n, pts, len, c = "#a9bd9c" }) => { const g = useMemo(() => new THREE.CylinderGeometry(0.0035, 0.006, 1, 5).translate(0, 0.5, 0), []), m = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 1 }), []); m.color.set(c); return <>{Array.from({ length: n }, (_, i) => { const a = pts(i), l = Math.max(0.002, len(i)); return <mesh key={i} geometry={g} material={m} position={a.p} rotation={a.r} scale={[1, l, 1]} />; })}</>; };
const Lemon: React.FC<{ p: V; s?: number; rot?: V }> = ({ p, s = 1, rot = [0, 0, 0] }) => <group position={p} rotation={rot} scale={s}><mesh castShadow><sphereGeometry args={[0.16, 28, 16, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#f0c419" roughness={0.45} /></mesh><mesh rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.155, 28]} /><meshStandardMaterial color="#f6e27a" roughness={0.35} side={THREE.DoubleSide} /></mesh></group>;
const Tag: React.FC<{ p: V; rot?: V; txt: string; w?: number; bg?: string; fg?: string }> = ({ p, rot = [0, 0, 0], txt, w = 0.34, bg = "#fff6dd", fg = "#7a1a14" }) => { const m = useMemo(() => cardTex([txt], { bg, fg, h: 200 }), [txt, bg, fg]); return <mesh position={p} rotation={rot}><planeGeometry args={[w, w * 0.39]} /><meshBasicMaterial map={m} toneMapped={false} /></mesh>; };
const Salt: React.FC<{ p: V; s?: number; rot?: V; c?: string }> = ({ p, s = 1, rot = [0, 0, 0], c = SALT }) => <mesh position={p} rotation={rot} scale={s}><boxGeometry args={[0.03, 0.03, 0.03]} /><meshPhysicalMaterial color={c} roughness={0.25} clearcoat={0.5} /></mesh>;
const Counter: React.FC<{ c?: string }> = ({ c = "#8b6a48" }) => <Box p={[0, 0.012, 0]} s={[3, 0.024, 1.9]} c={c} r={0.7} rad={0.01} />;
const Wall: React.FC<{ c?: string; z?: number }> = ({ c = "#e7ddc9", z = -0.75 }) => <Box p={[0, 0.8, z]} s={[3.6, 1.8, 0.05]} c={c} r={0.9} />;

// 0:05 · DALE VUELTA: la tabla impecable gira y la cara de abajo florece de manchas negras
const underside: F = ({ t, h }) => { const D = h.out - h.at, S = SPOTS(30); return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.25, 1.05, 1.55], [0, 0.18, 0]), C([-0.22, 0.72, 1.02], [0.1, 0.18, 0.1]), D)} set={{ warm: 0.35 }}
  scene={(tt) => { const f = eio(tt, 1, 2.7); return <><Counter /><group position={[0, 0.17 + 0.2 * Math.sin(PI * f), 0]} rotation={[PI * f, 0, 0.03]}><Board p={[0, 0, 0]} kind="maple" />{S.map((s, i) => <Colony key={i} x={s.x} z={s.z} y={-0.0365} s={s.s} i={i} face={-1} k={cl((tt - 3 - i * 0.14) * 1.8)} />)}</group></>; }}
  over={(tt) => <Ink tt={tt} at={2.6} txt="THE SIDE YOU NEVER SEE" />} />; };

// 0:46 · EL ZAPATO PELUDO: un zapato en el placard al que le crece pelo verde
const fur: F = ({ t, h }) => { const D = h.out - h.at, P = (i: number) => { const u = rnd(i), v = rnd(i + 40), a = v * PI; const toe = u < 0.36, x = toe ? 0.2 + 0.11 * Math.cos(a) : -0.28 + 0.46 * (u - 0.36) / 0.64, y = toe ? 0.1 + 0.11 * Math.sin(a) : 0.085 + 0.19 * Math.sin(a), z = (toe ? 0.11 : 0.115) * Math.cos(i * 2.1 + a); return { p: [x, y, z] as V, r: [(z / 0.12) * 0.9, 0, (rnd(i + 3) - 0.5) * 0.9 - (toe ? 0.7 * Math.cos(a) : 0)] as V }; };
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.4, 0.42, 1.2], [0, 0.2, 0]), C([-0.1, 0.34, 0.86], [0.03, 0.17, 0]), D)} set={{ warm: 0.25, spotK: 0.55 }}
    scene={(tt) => { const k = eio(tt, 0.8, D - 1.2); return <><Box p={[0, 0.012, 0]} s={[3, 0.024, 1.6]} c="#4a3423" r={0.8} /><Box p={[0, 0.8, -0.5]} s={[3.2, 1.7, 0.05]} c="#3a2a1f" r={0.9} />
      <Box p={[-0.03, 0.04, 0]} s={[0.72, 0.05, 0.26]} c="#2a2019" r={0.7} rad={0.02} /><Box p={[-0.1, 0.17, 0]} s={[0.46, 0.2, 0.22]} c={col("#6d4a2c", "#5d6a4c", k)} r={0.6} rad={0.07} /><mesh position={[0.2, 0.1, 0]} scale={[1, 0.8, 0.95]} castShadow><sphereGeometry args={[0.125, 24, 16]} /><meshStandardMaterial color={col("#6d4a2c", "#5d6a4c", k)} roughness={0.6} /></mesh>
      <Hair n={230} pts={P} len={(i) => (0.012 + 0.05 * rnd(i + 8)) * cl(k * 1.3 - 0.3 * rnd(i + 2))} /></>; }}
    over={(tt) => <Ink tt={tt} at={2.4} txt="SHOES GROW FUR" />} />; };

// 2:17 · EL BANCO DE TRES PATAS: comida, agua y tiempo sostienen al moho; se sacan las patas y se viene abajo
const stool: F = ({ t, h }) => { const D = h.out - h.at, a0 = h.items?.[0]?.at ?? 3, a1 = h.items?.[1]?.at ?? 4.6, a2 = h.items?.[2]?.at ?? 6.2, L: [number, number, string][] = [[-0.26, 0.08, "FOOD"], [0.26, 0.08, "WATER"], [0, -0.2, "TIME"]], fur2 = (i: number) => { const a = i * 2.4, e = Math.acos(1 - 1.7 * rnd(i)); return { p: [0.21 * Math.sin(e) * Math.cos(a), 0.21 * Math.cos(e), 0.21 * Math.sin(e) * Math.sin(a)] as V, r: [e * Math.sin(a), 0, -e * Math.cos(a)] as V }; };
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.25, 0.8, 1.9], [0, 0.42, 0]), C([-0.25, 0.7, 1.75], [0, 0.4, 0]), D)} set={{ warm: 0.4 }}
    scene={(tt) => { const fall = eio(tt, a2 + 0.25, a2 + 0.8), tilt = 0.09 * cl((tt - a0) * 3) + 0.18 * cl((tt - a1) * 3); return <><Counter /><Wall />
      {L.map(([x, z, txt], i) => { const a = [a0, a1, a2][i], k = eio(tt, a, a + 0.5); return <group key={i} position={[x + (x >= 0 ? 1 : -1) * k * 1.3 * (i === 2 ? 0 : 1), 0.33, z + (i === 2 ? k * 1.1 : 0)]} rotation={[0, 0, (x > 0 ? -1 : 1) * k * 0.6]}><Cyl p={[0, 0, 0]} r={0.035} h={0.62} c="#a06a35" rough={0.6} /><Tag p={[0, -0.05, 0.05]} txt={txt} /></group>; })}
      <group position={[0, 0.66 - 0.56 * fall, 0]} rotation={[0.1 * tilt, 0, tilt * (1 - fall) + fall * 0.09]}><Cyl p={[0, 0, 0]} r={0.36} h={0.07} c="#b67c42" rough={0.6} />
        <group position={[0, 0.03, 0]} scale={[Math.max(0.35, 1 - fall * 0.6), Math.max(0.2, 1 - fall * 0.8), Math.max(0.35, 1 - fall * 0.6)]}><mesh position={[0, 0, 0]}><sphereGeometry args={[0.21, 24, 16]} /><meshStandardMaterial color={MOLD} roughness={1} /></mesh><Hair n={150} pts={fur2} len={(i) => 0.03 + 0.045 * rnd(i)} c="#2d3a2a" /></group></group>
      {fall > 0.6 && Array.from({ length: 14 }, (_, i) => { const u = cl(tt - a2 - 0.6); return <Puff key={i} p={[Math.cos(i * 2.4) * (0.15 + 0.7 * u), 0.14 + 0.1 * rnd(i) + 0.2 * u, Math.sin(i * 2.4) * (0.1 + 0.35 * u)]} r={0.12 + 0.1 * u} c="#6b6459" op={0.5 * (1 - u)} />; })}</>; }} />; };

// 2:48 · DOS ESPONJAS: el café se traga a la seca hasta el fondo; en la mojada se queda arriba y se va
const sponge: F = ({ t, h }) => { const D = h.out - h.at, Sp: React.FC<{ x: number; y: number; dry: boolean; tt: number }> = ({ x, dry, tt }) => { const k = eio(tt, dry ? 1.5 : 4.4, (dry ? 1.5 : 4.4) + 2.4), y0 = 0.2, H = 0.3; return <group position={[x, 0, 0]}>
    <Box p={[0, y0, 0]} s={[0.56, H, 0.42]} c={dry ? "#e7c75a" : "#c9a53a"} r={0.95} rad={0.03} />
    {dry && k > 0.02 && <Box p={[0, y0 + H / 2 + 0.004 - (H * k) / 2, 0]} s={[0.568, Math.max(0.01, H * k), 0.428]} c="#5a3518" r={0.9} rad={0.02} />}
    {!dry && <>{k > 0.02 && <Disc p={[0, y0 + H / 2 + 0.006, 0]} r={0.17 * cl(k * 2.2)} ry={0.8} c="#4a2a12" rough={0.08} />}{Array.from({ length: 6 }, (_, i) => { const u = cl((tt - 6.4 - i * 0.25) * 0.8); return u > 0 && u < 1 ? <Drop key={i} c="#4a2a12" s={1.2} p={[0.3 * (i % 2 ? 1 : -1), y0 + 0.14 - 0.3 * u, -0.16 + 0.06 * i]} /> : null; })}</>}
    {Array.from({ length: 22 }, (_, i) => <Disc key={i} p={[(rnd(i) - 0.5) * 0.48, y0 + H / 2 + 0.0035, (rnd(i + 3) - 0.5) * 0.36]} r={0.008 + rnd(i + 5) * 0.012} c={dry ? "#b08a2a" : "#8a6c22"} />)}
    {[0, 1, 2, 3, 4, 5].map((i) => { const a = dry ? 0.9 : 3.8, u = ((tt - a - i * 0.07) * 2.6); return u > 0 && u < 1 ? <Drop key={i} c="#4a2a12" s={1.6} p={[0, 1.15 - 0.8 * u, 0]} /> : null; })}</group>; };
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.2, 0.85, 1.75], [0, 0.22, 0]), C([-0.2, 0.75, 1.6], [0, 0.22, 0]), D)} set={{ warm: 0.35 }}
    scene={(tt) => <><Counter c="#d5c8ac" /><Sp x={-0.42} y={0} dry tt={tt} /><Sp x={0.42} y={0} dry={false} tt={tt} /></>}
    over={(tt) => <>{<Ink tt={tt} at={2.2} x={560} txt="DRY DRINKS" />}{<Ink tt={tt} at={5.2} x={1380} txt="WET REFUSES" col="#9fe0ff" />}</>} />; };

// 3:43 · LA CLARA: un charco transparente en la sartén se vuelve blanco desde el borde; al lado, la misma película se cuece sobre la tabla
const eggwhite: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.2, 1.15, 1.25], [0.05, 0.05, 0]), C([-0.1, 1.0, 1.05], [0.05, 0.05, 0]), D)} set={{ warm: 0.2 }}
  scene={(tt) => { const k = eio(tt, 1, 5); return <><Counter c="#6d5238" /><Pan p={[-0.5, 0.024, 0]} s={1.15} heat={0.25} />
    <mesh position={[-0.5, 0.135, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.3, 36]} /><meshPhysicalMaterial color={col("#b9c0b4", "#d8d4c6", k)} transparent opacity={0.35 + 0.65 * k} roughness={lerp(0.05, 0.55, k)} /></mesh><Disc p={[-0.5, 0.139, 0]} r={0.09} c="#f0b020" rough={0.2} />
    <Board p={[0.58, 0.06, 0]} w={0.86} d={0.72} kind="old" />
    <mesh position={[0.58, 0.1, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.29, 36]} /><meshPhysicalMaterial color={col("#caa", "#d6ccb8", eio(tt, 3.2, 6.8))} transparent opacity={0.25 + 0.75 * eio(tt, 3.2, 6.8)} roughness={0.5} /></mesh>
    <Steam p={[-0.5, 0.14, 0]} t={tt} n={5} s={0.9} /><Steam p={[0.58, 0.1, 0]} t={tt + 1} k={eio(tt, 3.2, 5)} n={4} s={0.8} /></>; }}
  over={(tt) => <Ink tt={tt} at={3.6} txt="COOKED INTO THE WOOD" />} />; };

// 4:29 · LA CARA QUE NO MIRÁS: el jugo se derrama, se junta debajo y al levantar la tabla aparece el charco
const puddle: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.8, 0.5, 1.5], [0.15, 0.16, 0]), C([0.45, 0.38, 1.3], [0.25, 0.14, 0]), D)} set={{ warm: 0.4 }}
  scene={(tt) => { const a = eio(tt, 0.6, 2.6), b = eio(tt, 2.6, 4.2), lift = eio(tt, 5, 6.4), JUICE = "#8e2318"; return <><Counter c="#cfc6b6" />
    <Disc p={[0.15, 0.0265, 0.05]} r={lerp(0.04, 0.52, b)} ry={0.72} c={JUICE} rough={0.08} />
    <group position={[-0.65 + 0.65, 0.09 + 0.26 * lift, 0]} rotation={[0, 0, -0.42 * lift]}><Board p={[0, 0, 0]} kind="old" />
      <Disc p={[-0.25, 0.0375, 0]} r={lerp(0.05, 0.3, a)} ry={0.7} c={JUICE} rough={0.08} />
      <mesh position={[lerp(-0.25, 0.42, a), 0.0375, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[Math.max(0.02, 0.75 * a), 0.12]} /><meshStandardMaterial color={JUICE} roughness={0.08} /></mesh>
      {lift > 0.05 && Array.from({ length: 22 }, (_, i) => <Colony key={i} x={(rnd(i) - 0.5) * 1.1} z={(rnd(i + 4) - 0.5) * 0.65} y={-0.0375} face={-1} i={i} k={cl(lift * 2 - rnd(i + 8))} c="#3a1610" />)}</group>
    {[0, 1, 2, 3].map((i) => { const u = (tt * 1.4 + i * 0.25) % 1; return b < 0.9 && a > 0.4 ? <Drop key={i} c={JUICE} s={1.3} p={[0.66, 0.09 - 0.07 * u, -0.12 + i * 0.08]} /> : null; })}</>; }}
  over={(tt) => <Ink tt={tt} at={5.2} txt="THE BOTTOM DRINKS IT" />} />; };

// 5:03 · LLUEVE SAL: los cristales rebotan en la madera mojada y medio limón los arrastra dejando estela clara
const saltrain: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.3, 1.15, 1.2], [0, 0.05, 0.03]), C([-0.1, 1.2, 0.95], [0, 0.05, 0.03]), D)} set={{ warm: 0.42 }}
  scene={(tt) => { const w = eio(tt, 4.4, D - 1.2), lx = lerp(-0.62, 0.58, w), lz = 0.17 * Math.sin(w * PI * 5); return <><Counter />
    <Board p={[0, 0.06, 0]} kind="old" />
    <mesh position={[(lx - 0.62) / 2, 0.0965, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[Math.max(0.02, lx + 0.62), 0.74]} /><meshStandardMaterial map={woodT("maple")} roughness={0.28} /></mesh>
    {Array.from({ length: 150 }, (_, i) => { const a = 0.5 + rnd(i) * 3, u = cl((tt - a) / 0.42), bx = (rnd(i + 1) - 0.5) * 1.18, bz = (rnd(i + 2) - 0.5) * 0.7; if (u <= 0 || (tt > 4.4 && bx < lx - 0.1)) return null; const b = u < 1 ? 0 : Math.max(0, 0.02 * Math.sin(cl((tt - a - 0.42) * 6) * PI)); return <Salt key={i} p={[bx, 0.106 + (1 - u * u) * 1 + b, bz]} s={0.65 + 0.5 * rnd(i + 4)} rot={[rnd(i) * 6, rnd(i + 2) * 6, u * 4]} />; })}
    <Lemon p={[lx, 0.1 + 0.16 * cl(tt - 3.9), lz]} s={1.15} rot={[PI, 0, 0.3 * Math.sin(tt * 4)]} /></>; }}
  over={(tt) => <Ink tt={tt} at={1.1} txt="THE $1 BOX" />} />; };

// 5:21 · ADENTRO DEL CORTE: corte transversal: valles de cuchillo con mugre; los cristales bajan, raspan y la mugre sube
const valley: F = ({ t, h }) => { const D = h.out - h.at, geo = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-1.5, -0.5); s.lineTo(-1.5, 0.4); [-1, -0.3, 0.45, 1.15].forEach((x, i) => { const w = 0.14 + 0.03 * i; s.lineTo(x - w, 0.4); s.lineTo(x, 0.05 + 0.03 * i); s.lineTo(x + w, 0.4); }); s.lineTo(1.5, 0.4); s.lineTo(1.5, -0.5); s.closePath(); return new THREE.ExtrudeGeometry(s, { depth: 0.5, bevelEnabled: false }); }, []), X = [-1, -0.3, 0.45, 1.15];
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.15, 0.55, 2.35], [0, 0.32, 0]), C([-0.15, 0.48, 2.15], [0, 0.3, 0]), D)} set={{ warm: 0.3 }}
    scene={(tt) => { const push = eio(tt, 3.6, 5), up = eio(tt, 4.6, 7.4); return <><mesh geometry={geo} position={[0, 0, -0.3]} castShadow><meshStandardMaterial color="#c79a62" roughness={0.75} map={woodT("maple")} /></mesh>
      {X.map((x, i) => <group key={i}>{Array.from({ length: 11 }, (_, j) => { const rise = up * (1.1 + 0.4 * rnd(i * 7 + j)), jx = (rnd(j + i) - 0.5) * 0.08 * (1 + 2 * up); return <mesh key={j} position={[x + jx + (rise > 0.1 ? 0.2 * rise : 0), 0.12 + i * 0.03 + 0.02 * j + rise, 0.2 - 0.03 * j]} rotation={[j, i, j * 2]}><dodecahedronGeometry args={[0.028 + 0.012 * rnd(j)]} /><meshStandardMaterial color="#2a1c10" roughness={1} /></mesh>; })}
        {Array.from({ length: 4 }, (_, j) => { const a = 1 + i * 0.3 + j * 0.28, u = eio(tt, a, a + 0.5), ey = 0.2 + j * 0.05 + 0.12 * Math.abs(Math.sin((tt - 3.6) * 7 + j)) * push; return <Salt key={j} s={3.2 + rnd(j) * 0.9} rot={[j, u * 3 + push * tt * 2, i]} p={[x + (j - 1.5) * 0.045 * (1 + push), lerp(1.5, ey, u), 0.18 - j * 0.04]} />; })}</group>)}</>; }}
    over={(tt) => <Ink tt={tt} at={2.4} txt="TINY SANDPAPER" />} />; };

// 5:55 · PAN POR ARRIBA, CEPILLO POR ABAJO: la hogaza da media vuelta y su panza es la tawashi
const tawashi: F = ({ t, h }) => { const D = h.out - h.at, P = (i: number) => { const a = (i * 2.4) % PI, x = -0.3 + 0.6 * rnd(i); const R = Math.sqrt(Math.max(0.1, 1 - (x / 0.34) ** 2)); return { p: [x, -0.02 - 0.09 * Math.sin(a) * R, 0.15 * Math.cos(a) * R] as V, r: [PI + Math.cos(a) * 1.25, 0, (x / 0.34) * 0.6 + (rnd(i + 2) - 0.5) * 0.2] as V }; };
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.1, 0.5, 1.25], [0, 0.24, 0]), C([-0.1, 0.42, 1.05], [0, 0.26, 0]), D)} set={{ warm: 0.45 }}
    scene={(tt) => { const f = eio(tt, 2.6, 4.1); return <><Counter c="#d9cdb6" /><group position={[0, 0.29 + 0.14 * Math.sin(PI * f), 0]} rotation={[PI * f, 0.25 * Math.sin(tt * 0.6), 0]}>
      <mesh position={[0, 0.04, 0]} scale={[0.36, 0.13, 0.17]} castShadow><sphereGeometry args={[1, 32, 18, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#c88a40" roughness={0.75} /></mesh><Cyl p={[0, 0.02, 0]} r={0.15} r2={0.15} h={0.05} c="#e7c992" rough={0.9} rot={[0, 0, PI / 2]} />
      <Box p={[0, 0, 0]} s={[0.62, 0.05, 0.3]} c="#d9b98a" r={0.9} rad={0.02} /><Hair n={320} pts={P} len={(i) => 0.11 + 0.03 * rnd(i)} c="#6a4a26" /></group></>; }}
    over={(tt) => <>{<Ink tt={tt} at={1} txt="A LITTLE LOAF?" />}{tt > 4.6 && <Ink tt={tt} at={4.6} y={130} txt="A $3 BRUSH" col="#ffcf55" />}</>} />; };

// 6:32 · A FAVOR DE LA VETA: el cepillo baja por el surco y empuja todo hasta que se cae por el borde
const withgrain: F = ({ t, h }) => { const D = h.out - h.at, Z = [-0.27, -0.16, -0.05, 0.06, 0.17, 0.28]; return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([1.35, 0.72, 0.95], [0.28, 0.05, 0]), C([1.15, 0.62, 0.62], [0.42, 0.05, 0]), D)} set={{ warm: 0.35 }}
  scene={(tt) => { const k = eio(tt, 0.9, D - 2); const bx = lerp(-0.68, 0.72, k); return <><Counter /><Board p={[0, 0.07, 0]} kind="maple" />
    {Z.map((z, i) => <group key={i}><Box p={[0, 0.103, z]} s={[1.3, 0.008, 0.034]} c="#5a3a1c" r={0.95} />
      {Array.from({ length: 9 }, (_, j) => { const x0 = -0.5 + j * 0.13 + rnd(i * 3 + j) * 0.05, pushed = bx + 0.13 + 0.012 * j > x0, x = pushed ? Math.max(x0, bx + 0.13 + 0.012 * j) : x0, off = x > 0.65, y = off ? 0.11 - (x - 0.65) * 3.2 : 0.114; return y > 0.03 ? <mesh key={j} position={[Math.min(x, 0.84), y, z + (rnd(j) - 0.5) * 0.015]}><dodecahedronGeometry args={[0.015]} /><meshStandardMaterial color="#231708" roughness={1} /></mesh> : null; })}</group>)}
    <group position={[bx, 0.21, 0]}><Box p={[0, 0.03, 0]} s={[0.24, 0.07, 0.68]} c="#b4874f" r={0.7} rad={0.02} />{Array.from({ length: 32 }, (_, i) => <Cyl key={i} p={[(i % 4) * 0.05 - 0.075, -0.05, -0.31 + Math.floor(i / 4) * 0.088]} r={0.012} h={0.1} c="#5e4222" rough={1} />)}</group></>; }}
  over={(tt) => <Ink tt={tt} at={1.5} txt="DOWN THE VALLEY, OUT THE END" size={72} />} />; };

// 7:03 · LEVANTALA: la tabla acostada se para contra la pared y el aire le da la vuelta por las dos caras
const standup: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([1.55, 0.78, 1.5], [0, 0.42, -0.25]), C([1.2, 0.82, 1.85], [0, 0.42, -0.25]), D)} set={{ warm: 0.3 }}
  scene={(tt) => { const up = eio(tt, 1.2, 2.8), air = eio(tt, 3, 4.2), S = SPOTS(16, 1.3, 0.8); return <><Counter c="#7f6244" /><Wall z={-0.95} c="#b7ab92" />
    <group position={[0, lerp(0.056, 0.03, up), lerp(0, -0.34, up)]} rotation={[lerp(0, -(PI / 2 - 0.2), up), 0, 0]}><group position={[0, lerp(0, 0.4, up), 0]}><Board p={[0, 0, 0]} kind="maple" /><mesh position={[0, -0.0362, 0]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[1.38, 0.88]} /><meshStandardMaterial map={woodT("maple")} roughness={0.6} /></mesh>{S.map((s, i) => <Colony key={i} x={s.x} z={s.z} y={-0.0375} face={-1} i={i} s={s.s} k={1 - eio(tt, 3.4 + i * 0.1, 5.6 + i * 0.1)} />)}</group></group>
    {Array.from({ length: 34 }, (_, i) => { const u = (tt * 0.42 + i / 34) % 1, side = i % 2 ? 1 : -1, x = -1 + 2 * u, y = 0.15 + (i % 6) * 0.11, zc = -0.34 + side * (0.13 + 0.26 * Math.sin(PI * (0.5 + 0.5 * x))); return <Drop key={i} c="#7fc8f5" s={0.95} op={0.95 * air * Math.sin(PI * u)} p={[x, y, zc]} />; })}</>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="AIR ON BOTH FACES" />} />; };

// 7:53 · EL SOL Y LA MEDIA VUELTA: el sol cruza y a la mitad la tabla gira para mostrarle la otra cara
const sunstep: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 0.75, 1.9], [0, 0.42, 0]), C([-0.3, 0.68, 1.75], [0, 0.42, 0]), D)} set={{ warm: 0.75, spotK: 0.55 }}
  scene={(tt) => { const s = eio(tt, 0.5, D - 0.8), a = PI * s, sx = -1.4 * Math.cos(a), sy = 0.5 + 0.95 * Math.sin(a), f = eio(tt, D * 0.42, D * 0.42 + 1.2); return <><Box p={[0, 0.06, 0]} s={[2.8, 0.12, 1.3]} c="#8a7a68" r={0.95} /><Box p={[0, 0.8, -0.72]} s={[3.6, 1.8, 0.05]} c="#cdbf9f" r={0.9} />
    <mesh position={[sx, sy, -0.5]}><sphereGeometry args={[0.13, 24, 16]} /><meshBasicMaterial color="#ffd86a" toneMapped={false} /></mesh><Puff p={[sx, sy, -0.48]} r={0.62} c="#ffcf5a" op={0.75} />
    <group position={[0, 0.51, 0.05]} rotation={[0, PI * f + 0.5 * (s - 0.5), 0]}><Board p={[0, 0, 0]} rot={[PI / 2 - 0.05, 0, 0]} w={1} d={0.72} kind={f < 0.5 ? "maple" : "white"} under={f < 0.5 ? "white" : "maple"} /></group>
    {[0, 1, 2].map((i) => <Ring key={i} p={[0, 0.125, 0.05]} r={0.5 + 0.1 * i} k={cl(s * 3 - i)} col="#ffc53a" />)}</>; }}
  over={(tt) => <>{<Ink tt={tt} at={1.2} x={560} txt="30 MINUTES" />}{tt > D * 0.5 && <Ink tt={tt} at={D * 0.5} x={1380} txt="HALF TURN" col="#ffcf55" />}</>} />; };

// 8:33 · UN DÍA ENTERO: el sol da vueltas de golpe y la tabla se abre con una rajadura que camina
const crack: F = ({ t, h }) => { const D = h.out - h.at, path = [[-0.65, 0.05], [-0.42, -0.05], [-0.2, 0.08], [0.05, -0.04], [0.28, 0.07], [0.5, -0.03], [0.65, 0.04]]; return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.2, 1.3, 1.1], [0, 0.05, 0]), C([-0.1, 1.15, 0.92], [0, 0.05, 0]), D)} set={{ warm: 0.8, spotK: 0.6 }}
  scene={(tt) => { const a = tt * 3.6, k = eio(tt, 1.8, D - 2), sp = eio(tt, D - 2.4, D - 1), N = path.length - 1, n = k * N; return <><Box p={[0, 0.012, 0]} s={[3, 0.024, 1.9]} c="#8a7a68" r={0.95} />
    <mesh position={[1.25 * Math.cos(a), 0.62, -0.5 + 0.42 * Math.sin(a)]}><sphereGeometry args={[0.1, 20, 14]} /><meshBasicMaterial color="#ffc85a" toneMapped={false} /></mesh><Puff p={[1.25 * Math.cos(a), 0.62, -0.5 + 0.42 * Math.sin(a)]} r={0.4} c="#ffbf4a" op={0.7} />
    <group position={[0, 0.07, -0.1 * sp]} rotation={[0.1 * sp, 0, 0]}><Board p={[0, 0, -0.2]} d={0.42} w={1.3} kind="pale" /></group><group position={[0, 0.07, 0.08 * sp]} rotation={[-0.08 * sp, 0, 0]}><Board p={[0, 0, 0.2]} d={0.4} w={1.3} kind="pale" /></group>
    {path.slice(0, N).map((p, i) => { const q = path[i + 1], u = cl(n - i); if (u <= 0) return null; const xa = p[0], za = p[1], xb = lerp(xa, q[0], u), zb = lerp(za, q[1], u), L = Math.hypot(xb - xa, zb - za); return <Box key={i} p={[(xa + xb) / 2, 0.112, (za + zb) / 2 - 0.0]} s={[L + 0.02, 0.01, 0.018]} rot={[0, -Math.atan2(zb - za, xb - xa), 0]} c="#1a1109" r={1} />; })}</>; }}
  over={(tt) => <Ink tt={tt} at={1} txt="NOT ALL DAY" col="#ffcf55" />} />; };

// 8:56 · LA PAVA: el chorro hirviendo baja por una cara de la tabla y la deja brillando
const kettle: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.75, 0.82, 1.75], [0.05, 0.55, 0]), C([0.35, 0.75, 1.55], [0.05, 0.55, 0]), D)} set={{ warm: 0.3 }}
  scene={(tt) => { const p = eio(tt, 1.3, 2), w = eio(tt, 1.8, D - 2); return <><Box p={[0, 0.06, 0]} s={[1.9, 0.12, 1.2]} c="#c1c6cb" m={0.85} r={0.25} rad={0.03} /><Box p={[0, 0.13, 0]} s={[1.5, 0.012, 0.85]} c="#7d838a" m={0.8} r={0.3} />
    <group position={[0, 0.6, -0.12]} rotation={[-0.14, 0, 0]}><Board p={[0, 0, 0]} rot={[PI / 2, 0, 0]} w={0.82} d={0.95} h={0.055} kind="maple" />
      <mesh position={[0, 0.48 - 0.47 * w, 0.0355]}><planeGeometry args={[0.72, Math.max(0.02, 0.94 * w)]} /><meshPhysicalMaterial map={woodT("rich")} roughness={0.08} clearcoat={1} /></mesh></group>
    <group position={[lerp(0.9, 0.42, p), 1.1 + 0.06 * (1 - p), 0.2]} rotation={[0, 0, 0.5 * p]}><Cyl p={[0, 0, 0]} r={0.2} r2={0.26} h={0.3} c="#b0b6bc" m={0.85} rough={0.22} /><Cyl p={[0, 0.17, 0]} r={0.07} r2={0.2} h={0.05} c="#b0b6bc" m={0.85} rough={0.22} /><Cyl p={[-0.29, 0.03, 0]} r={0.022} r2={0.05} h={0.24} c="#b0b6bc" m={0.85} rough={0.22} rot={[0, 0, 1.0]} /></group>
    {p > 0.8 && Array.from({ length: 20 }, (_, i) => { const u = (tt * 2.4 + i / 20) % 1; return <Drop key={i} s={1} op={0.75} p={[lerp(0.14, 0.02, u), lerp(1.08, 0.2, u * u), lerp(0.2, -0.03, cl(u * 2))]} />; })}
    <Steam p={[0.05, 0.75, 0.05]} t={tt} k={p} n={9} s={1.5} /></>; }}
  over={(tt) => <Ink tt={tt} at={2.4} txt="ONE SOLID PIECE ONLY" y={930} />} />; };

// 9:45 · UNA CUCHARADA EN UN GALÓN: una cucharita diminuta frente a un bidón enorme; una gota y el anillo cruza todo
const gallon: F = ({ t, h }) => { const D = h.out - h.at, m = useMemo(() => cardTex(["1 GALLON"], { bg: "#f1ece0", fg: "#2c3a48", h: 200 }), []); return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.4, 1.5, 2.45], [0, 0.72, 0]), C([-0.25, 1.55, 2.15], [0, 0.74, 0]), D)} set={{ warm: 0.3 }}
  scene={(tt) => { const tilt = eio(tt, 2.4, 3.3), drop = cl((tt - 3.4) * 2.2), rr = cl((tt - 3.85) * 0.8); return <><Counter c="#7f6244" /><Wall z={-0.9} c="#b7ab92" />
    <Cyl p={[0, 0.32, 0]} r={0.46} r2={0.36} h={0.6} c="#a9afb5" m={0.7} rough={0.35} />
    <mesh position={[0, 0.62, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.46, 0.018, 10, 48]} /><meshStandardMaterial color="#d4d8dc" metalness={0.8} roughness={0.25} /></mesh>
    <Disc p={[0, 0.624, 0]} r={0.445} c="#5d93ae" rough={0.04} />
    <mesh position={[0, 0.32, 0.425]} rotation={[-0.14, 0, 0]}><planeGeometry args={[0.46, 0.2]} /><meshBasicMaterial map={m} toneMapped={false} /></mesh>
    {rr > 0 && rr < 1 && <mesh position={[0, 0.628, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.43 * rr, 0.43 * rr + 0.012, 48]} /><meshBasicMaterial color="#ffffff" transparent opacity={1 - rr} /></mesh>}
    <group position={[0.02, 1.02, 0.02]} rotation={[0, 0, tilt * 0.9]} scale={1.5}><mesh scale={[1, 0.4, 0.7]}><sphereGeometry args={[0.06, 20, 12, 0, PI * 2, PI / 2, PI / 2]} /><meshStandardMaterial color="#c8cdd2" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} /></mesh><Box p={[0.28, 0.02, 0]} s={[0.46, 0.01, 0.024]} c="#c8cdd2" m={0.9} r={0.2} /></group>
    {drop > 0 && drop < 1 && <Drop s={1.6} c="#f4eea8" p={[0, 1 - 0.38 * drop * drop, 0]} />}</>; }}
  over={(tt) => <Ink tt={tt} at={1.2} y={130} txt="1 SPOON · 1 GALLON" />} />; };

// 10:08 · LA DE LINDA DESDE 1996: la tabla de plástico se raya sola hasta que el año aparece grabado en los surcos
const linda: F = ({ t, h }) => { const D = h.out - h.at, y = useMemo(() => cardTex(["1996"], { bg: "#c9c4b6", fg: "#4a453b", h: 240 }), []); return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.15, 1.2, 1.05], [0, 0.05, 0]), C([-0.1, 1.05, 0.82], [0, 0.05, 0]), D)} set={{ warm: 0.2 }}
  scene={(tt) => { const k = eio(tt, 0.8, D - 2.4), Y = eio(tt, D - 3.8, D - 2.4); return <><Counter /><Box p={[0, 0.06, 0]} s={[1.3, 0.05, 0.8]} c="#c9c4b6" r={0.42} rad={0.012} />
    <mesh position={[0, 0.0885, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.5, 0.22]} /><meshStandardMaterial map={y} transparent opacity={Y} roughness={0.6} /></mesh>
    {Array.from({ length: 80 }, (_, i) => { const u = cl(k * 1.15 * 80 - i), L = (0.14 + rnd(i) * 0.4) * u; if (u <= 0) return null; const a = (rnd(i + 2) - 0.5) * 2.4; return <Box key={i} p={[(rnd(i + 3) - 0.5) * 1.05, 0.0868, (rnd(i + 4) - 0.5) * 0.62]} s={[Math.max(0.01, L), 0.003, 0.0055]} rot={[0, a, 0]} c={col("#8f8877", "#4f4636", rnd(i + 5))} r={1} />; })}</>; }}
  over={(tt) => <Ink tt={tt} at={1.5} txt="WOOD OR PLASTIC?" />} />; };

// 10:37 · EN LA OSCURIDAD: se va la luz; sólo queda el borde y la muesca que se encuentra con el dedo
const notch: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.75, 0.62, 1.05], [0.42, 0.11, 0.24]), C([0.72, 0.42, 0.82], [0.5, 0.12, 0.3]), D)} set={{ warm: 0.3 }}
  scene={(tt) => { const f = eio(tt, 3.4, 6.6), fx = lerp(-0.25, 0.54, f), glow = eio(tt, 6.4, 7); return <><Counter />
    <Board p={[0, 0.06, 0]} kind="maple" /><Board p={[0.02, 0.12, 0.02]} kind="old" c="#a57a48" />
    <Box p={[0.585, 0.14, 0.34]} s={[0.1, 0.09, 0.1]} rot={[0, 0.78, 0]} c={col("#25180c", "#ffb84a", glow)} e="#ff9a2a" ei={glow * 0.8} r={0.9} />
    <group position={[fx, 0.185, 0.385]}><mesh rotation={[0, 0, 1.25]} scale={[1, 2.6, 1]} castShadow><sphereGeometry args={[0.042, 18, 14]} /><meshStandardMaterial color="#e9bf9f" roughness={0.55} /></mesh></group></>; }}
  over={(tt) => { const dark = eio(tt, 1.7, 3); return <><div style={{ position: "absolute", inset: 0, opacity: dark * 0.96, background: "radial-gradient(circle at 57% 58%, rgba(0,0,0,0) 14%, rgba(0,0,0,.92) 38%, #000 60%)" }} /><Ink tt={tt} at={3.8} txt="FISH. IN THE DARK." col="#ffcf55" /></>; }} />; };

// 11:01 · LA TABLA DE LA CARNE NO ACEPTA NADA MÁS: pan, tomate y hoja vuelan hacia ella y rebotan a la otra
const bounce: F = ({ t, h }) => { const D = h.out - h.at, items = [["#d39a55", 0], ["#d3301f", 1], ["#6ea93f", 2]] as const; return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.15, 1.15, 1.7], [0, 0.15, 0]), C([-0.15, 1.05, 1.5], [0, 0.15, 0]), D)} set={{ warm: 0.45 }}
  scene={(tt) => <><Counter />
    <Board p={[-0.65, 0.06, 0]} w={1} d={0.72} kind="maple" /><Box p={[-1.142, 0.064, 0]} s={[0.022, 0.066, 0.73]} c="#c41e1e" r={0.4} />
    <group position={[-0.65, 0.105, 0]}><mesh scale={[0.3, 0.05, 0.21]} castShadow><sphereGeometry args={[1, 30, 16]} /><meshStandardMaterial color="#a8322c" roughness={0.42} /></mesh></group>
    <Board p={[0.65, 0.06, 0]} w={1} d={0.72} kind="maple" c="#c7a06a" />
    {items.map(([c, i]) => { const a = 1.7 + i * 1.75, u = cl((tt - a) / 0.65), v = cl((tt - a - 0.65) / 0.75); if (u <= 0) return null; const sx = -0.65 + 0.15 * i, sz = -0.12 + 0.12 * i, ex = 0.42 + 0.22 * i, y = v <= 0 ? lerp(1.2, 0.22, u * u) : 0.22 + 0.75 * Math.sin(PI * v) * (1 - 0.8 * v * v) - 0.08 * v, x = v <= 0 ? lerp(-1.35, sx, u) : lerp(sx, ex, v); return <group key={i} position={[x, y, sz]} rotation={[tt * 2 * (1 - v), v, tt * 3 * (1 - v)]}>{i === 0 ? <Box p={[0, 0, 0]} s={[0.2, 0.13, 0.16]} c={c} r={0.8} rad={0.04} /> : i === 1 ? <mesh castShadow><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color={c} roughness={0.3} /></mesh> : <mesh scale={[0.16, 0.02, 0.11]}><sphereGeometry args={[1, 20, 12]} /><meshStandardMaterial color={c} roughness={0.5} /></mesh>}</group>; })}</>}
  over={(tt) => <Ink tt={tt} at={1} txt="RAW MEAT ONLY" col="#ff9a8a" />} />; };

// 11:37 · EL CEPILLADOR: la garlopa empuja, sale una viruta larga en espiral y detrás aparece madera blanca
const planer: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.45, 0.8, 1.55], [0.05, 0.18, 0]), C([-0.1, 0.62, 1.25], [0.2, 0.18, 0]), D)} set={{ warm: 0.5 }}
  scene={(tt) => { const k = eio(tt, 1.1, D - 1.8), px = lerp(-0.72, 0.72, k), N = Math.floor(k * 90); return <><Box p={[0, 0.17, 0]} s={[2.4, 0.3, 0.9]} c="#6b4a2c" r={0.75} rad={0.02} />
    <Board p={[0, 0.355, 0]} kind="white" />
    <mesh position={[(0.65 + px) / 2, 0.392, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[Math.max(0.01, 0.64 - px), 0.77]} /><meshStandardMaterial map={woodT("old")} roughness={0.7} /></mesh>
    <group position={[px, 0.46, 0]}><Box p={[0, 0, 0]} s={[0.42, 0.11, 0.16]} c="#7a4c22" r={0.5} rad={0.02} /><Box p={[-0.02, 0.09, 0]} s={[0.05, 0.14, 0.13]} c="#b7bcc2" m={0.85} r={0.25} />
      {Array.from({ length: N }, (_, i) => { const u = i / 34, a = u * PI * 2.4, R = Math.max(0.04, 0.3 - 0.075 * u); return <Box key={i} p={[-0.02 - R * Math.sin(a) * 0.7, 0.18 + R - R * Math.cos(a), 0]} s={[0.05, 0.005, 0.12]} rot={[0, 0, -a]} c={i % 3 ? "#f0d8ab" : "#e3c48f"} r={0.8} />; })}</group></>; }}
  over={(tt) => <Ink tt={tt} at={D - 4.2} txt="WHITE AS NEW" />} />; };

// 12:46 · SECA COMO GALLETITA: la humedad se escapa de la tabla y se parten las dos, galleta y madera
const cracker: F = ({ t, h }) => { const D = h.out - h.at, sn = D - 3; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 0.9, 1.45], [0, 0.12, 0]), C([-0.2, 0.75, 1.2], [0, 0.12, 0]), D)} set={{ warm: 0.55 }}
  scene={(tt) => { const s = eio(tt, sn, sn + 0.35), k = cl(tt / sn), half = (sg: number) => <group position={[sg * 0.33 + sg * 0.1 * s, 0, 0]} rotation={[0, sg * 0.06 * s, sg * -0.1 * s]}><Board p={[0, 0, 0]} w={0.66} kind={k > 0.6 ? "pale" : "maple"} /></group>; return <><Counter />
    <group position={[0, 0.09, 0]}>{half(-1)}{half(1)}</group>
    {[-1, 1].map((sg) => <group key={sg} position={[sg * 0.085 + sg * 0.05 * s, 0.14, 0]} rotation={[0, 0, sg * -0.22 * s]}><Box p={[0, 0, 0]} s={[0.17, 0.018, 0.3]} c="#e0b878" r={0.9} rad={0.005} /></group>)}
    {Array.from({ length: 34 }, (_, i) => { const u = (tt * 0.26 + i / 34) % 1; return <Drop key={i} s={0.7} op={(1 - k) * 0.85 * Math.sin(PI * u)} p={[(rnd(i) - 0.5) * 1.2, 0.14 + u * 0.8, (rnd(i + 2) - 0.5) * 0.65]} />; })}
    {s > 0.01 && Array.from({ length: 14 }, (_, i) => { const u = cl((tt - sn) * 2); return <Box key={i} p={[Math.cos(i * 2.2) * 0.3 * u * rnd(i), 0.14 + 0.28 * Math.sin(PI * u) * rnd(i + 2), Math.sin(i * 2.2) * 0.25 * u * rnd(i + 1)]} s={[0.018, 0.012, 0.02]} rot={[i, i * 2, 0]} c="#d0a665" r={1} />; })}</>; }}
  over={(tt) => <Ink tt={tt} at={2.2} txt="DRY AS A CRACKER" />} />; };

// 13:02 · LA MADERA TIENE SED: cae el aceite gota a gota y cada gota abre un círculo de color profundo
const oil: F = ({ t, h }) => { const D = h.out - h.at, Pts: [number, number][] = [[-0.34, -0.12], [0.12, 0.14], [0.38, -0.16], [-0.1, -0.2], [-0.42, 0.2], [0.4, 0.18]]; return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.2, 1.3, 1.0], [0, 0.05, 0]), C([-0.15, 1.15, 0.85], [0, 0.05, 0]), D)} set={{ warm: 0.5 }}
  scene={(tt) => <><Counter c="#d9cdb6" /><Board p={[0, 0.06, 0]} kind="pale" />
    {Pts.map(([x, z], i) => { const a = 1.6 + i * 1.15, r = eio(tt, a + 0.3, a + 2.6), u = cl((tt - a) * 3.2); return <group key={i}>{r > 0.01 && <mesh position={[x, 0.0965 + i * 0.0006, z]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[Math.min(0.42, 0.07 + 0.36 * r), 40]} /><meshPhysicalMaterial map={woodT("rich")} roughness={0.22} clearcoat={0.8} /></mesh>}{u > 0 && u < 1 && <Drop c="#e3b53c" s={1.5} op={1} p={[x, 1.2 - 1.1 * u * u, z]} />}</group>; })}</>}
  over={(tt) => <Ink tt={tt} at={2.5} txt="ONCE A MONTH" />} />; };

// 13:37 · LA MADERA TOMA: la tabla en la pileta; el agua le sube adentro como en un termómetro y la hincha
const drink: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.2, 0.8, 1.7], [0, 0.42, 0]), C([-0.2, 0.7, 1.45], [0, 0.42, 0]), D)} set={{ warm: 0.2 }}
  scene={(tt) => { const k = eio(tt, 1.2, D - 2); return <><Box p={[0, 0.06, -0.35]} s={[1.9, 0.12, 0.08]} c="#bfc4c9" m={0.85} r={0.25} /><Box p={[0, 0.06, 0.35]} s={[1.9, 0.12, 0.08]} c="#bfc4c9" m={0.85} r={0.25} /><Box p={[0, 0.008, 0]} s={[1.9, 0.016, 0.8]} c="#a3a9b0" m={0.8} r={0.3} />
    <group position={[0, 0.47, -0.05]} rotation={[-0.1, 0, 0]} scale={[1 + 0.05 * k, 1, 1 + 0.2 * k]}><Board p={[0, 0, 0]} rot={[PI / 2, 0, 0]} w={0.82} d={0.9} kind="maple" />
      <mesh position={[0, -0.45 + 0.4 * k + 0.0, 0.04]}><planeGeometry args={[0.8, Math.max(0.02, 0.8 * k)]} /><meshStandardMaterial map={woodT("old")} color="#6f7f9a" roughness={0.25} /></mesh></group>
    <mesh position={[0, 0.14, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.86, 0.66]} /><meshPhysicalMaterial color="#a9c3cc" transparent opacity={0.75} roughness={0.05} /></mesh></>; }}
  over={(tt) => <Ink tt={tt} at={D - 4} txt="WOOD DRINKS" col="#9fe0ff" y={130} />} />; };

// 13:54 · PAPA FRITA: la tabla sale del lavavajillas y se retuerce en silla de montar
const chip: F = ({ t, h }) => { const D = h.out - h.at, g = useMemo(() => new THREE.BoxGeometry(1.3, 0.06, 0.8, 40, 1, 26), []), o = useMemo(() => (g.attributes.position.array as Float32Array).slice(), [g]);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.9, 0.85, 1.35], [0, 0.26, 0]), C([-0.8, 0.8, 1.45], [0, 0.26, 0]), D)} set={{ warm: 0.3 }}
    scene={(tt) => { const k = eio(tt, 1.8, D - 2.4), p = g.attributes.position as THREE.BufferAttribute; for (let i = 0; i < p.count; i++) { const x = o[i * 3], y = o[i * 3 + 1], z = o[i * 3 + 2]; p.setY(i, y + k * (0.62 * (x * x) - 1.5 * (z * z) + 0.12 * Math.sin(x * 6) * z)); } p.needsUpdate = true; g.computeVertexNormals(); return <><Counter c="#cfd2d0" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <Cyl key={i} p={[-0.9 + i * 0.3, 0.05, 0]} r={0.012} h={0.8} rot={[PI / 2, 0, 0]} c="#b7bcc2" m={0.8} rough={0.3} />)}
      <mesh geometry={g} position={[0, 0.22, 0]} castShadow><meshStandardMaterial map={woodT("maple")} color={col("#ffffff", "#e7c9a0", k)} roughness={0.55} /></mesh>
      <Steam p={[0, 0.3, 0]} t={tt} k={1 - k * 0.7} n={7} s={1.3} /></>; }}
    over={(tt) => <Ink tt={tt} at={D - 3.4} txt="A POTATO CHIP" col="#ffcf55" />} />; };

// 14:23 · EL CAJÓN: se cierra sobre la tabla mojada, se vuelve transparente y en lo oscuro florece el moho
const drawer: F = ({ t, h }) => { const D = h.out - h.at, S = SPOTS(36); return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 2.15, 1.5], [0, 1.02, 0.12]), C([-0.2, 2.0, 1.2], [0, 1.02, 0.1]), D)} set={{ warm: 0.15 }}
  scene={(tt) => { const c = eio(tt, 0.6, 1.9), x = eio(tt, 2.6, 3.6), dz = lerp(0.72, 0, c), S2 = cl(tt - 3.2); return <><Box p={[0, 0.5, -0.05]} s={[1.7, 1, 1.0]} c="#6c4a2c" r={0.75} />
    <group position={[0, 0, dz]}><Box p={[0, 0.98, 0.5]} s={[1.62, 0.36, 0.04]} c="#8b6239" r={0.6} rad={0.012} /><Box p={[-0.8, 1.09, 0]} s={[0.04, 0.14, 1]} c="#6c4a2c" r={0.75} /><Box p={[0.8, 1.09, 0]} s={[0.04, 0.14, 1]} c="#6c4a2c" r={0.75} /><Box p={[0, 1.09, -0.5]} s={[1.62, 0.14, 0.04]} c="#6c4a2c" r={0.75} /><Cyl p={[0, 0.98, 0.54]} r={0.05} h={0.06} rot={[PI / 2, 0, 0]} c="#b7bcc2" m={0.85} rough={0.25} />
      <Box p={[0, 1.04, -0.02]} s={[1.6, 0.04, 1.02]} c="#20150c" r={0.9} /><Board p={[0, 1.092, -0.02]} kind="old" />{S.map((s, i) => <Colony key={i} x={s.x} z={s.z - 0.02} y={1.129} s={s.s * 1.1} i={i} k={cl(S2 * 2.2 - i * 0.075)} />)}
      {Array.from({ length: 10 }, (_, i) => <Drop key={i} s={1} op={1 - S2} p={[(rnd(i) - 0.5) * 1.1, 1.135, (rnd(i + 2) - 0.5) * 0.65]} />)}</group></>; }}
  over={(tt) => <Ink tt={tt} at={3.6} txt="WHAT MOLD PRAYS FOR" />} />; };

// 14:57 · EL RELOJ DE ARENA: noventa segundos caen mientras la tabla gira y pasa de sucia a limpia
const sandglass: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.15, 0.62, 1.8], [0.05, 0.38, 0]), C([-0.15, 0.56, 1.55], [0.05, 0.38, 0]), D)} set={{ warm: 0.45 }}
  scene={(tt) => { const k = eio(tt, 0.6, D - 1); return <><Counter c="#d9cdb6" /><group position={[-0.5, 0, 0]}><Cyl p={[0, 0.045, 0]} r={0.27} h={0.04} c="#7a4c22" rough={0.55} /><Cyl p={[0, 0.77, 0]} r={0.27} h={0.04} c="#7a4c22" rough={0.55} />
      <Cyl p={[0, 0.235, 0]} r={0.022} r2={0.24} h={0.34} c="#dbeaf0" rough={0.05} op={0.32} /><Cyl p={[0, 0.575, 0]} r={0.24} r2={0.022} h={0.34} c="#dbeaf0" rough={0.05} op={0.32} />
      <Cyl p={[0, 0.41 + 0.1 * (1 - k) + 0.02, 0]} r={Math.max(0.02, 0.2 * (1 - k * 0.92))} r2={0.03} h={Math.max(0.01, 0.2 * (1 - k * 0.94))} c="#e0b45f" rough={0.9} />
      <Cyl p={[0, 0.065 + 0.1 * k, 0]} r={0.02} r2={Math.max(0.03, 0.22 * Math.sqrt(k + 0.04))} h={Math.max(0.01, 0.2 * k)} c="#e0b45f" rough={0.9} />{k < 0.98 && <Cyl p={[0, 0.32, 0]} r={0.005} h={0.2} c="#e0b45f" rough={0.9} />}</group>
    <group position={[0.42, 0.13, 0]} rotation={[0.14, tt * 0.75, 0]}><Board p={[0, 0, 0]} w={0.9} d={0.62} kind={k < 0.5 ? "old" : "white"} under={k < 0.5 ? "old" : "white"} /></group></>; }}
  over={(tt) => <Ink tt={tt} at={1.2} txt="90 SECONDS" />} />; };

// 15:59 · FINA COMO UNA REVISTA: sesenta años de cepillo: la tabla pierde capas hasta el grosor de la revista de al lado
const thin: F = ({ t, h }) => { const D = h.out - h.at, m = useMemo(() => cardTex(["WEEKLY"], { bg: "#c8392f", fg: "#fff6dd", h: 240 }), []); return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.7, 0.34, 1.35], [0.1, 0.1, 0]), C([0.4, 0.26, 1.08], [0.28, 0.07, 0]), D)} set={{ warm: 0.65, spotK: 0.45 }}
  scene={(tt) => { const k = eio(tt, 0.9, D - 3.4), n = 8; return <><Counter c="#6b4a2c" /><Board p={[-0.24, 0.024 + (0.012 + 0.2 * (1 - k)) / 2, 0]} w={1.05} d={0.72} h={0.012 + 0.2 * (1 - k)} kind="old" />
    {Array.from({ length: n }, (_, i) => { const a = 0.9 + ((D - 4.3) * i) / n, u = cl((tt - a) / 1.15); if (u <= 0 || u >= 1) return null; return <Box key={i} p={[-0.24 + u * 1.0, 0.03 + 0.2 * (1 - i / n) + u * 0.5, -0.05 + 0.03 * i]} s={[1.05, 0.012, 0.72 * (1 - u * 0.3)]} rot={[u * 0.5, 0, -u * 0.7]} c="#dbc090" r={0.9} op={1 - u * u} />; })}
    <group position={[0.68, 0.033, 0.05]} rotation={[0, -0.18, 0]}><Box p={[0, 0, 0]} s={[0.42, 0.016, 0.56]} c="#f4efe2" r={0.6} /><mesh position={[0, 0.0095, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.41, 0.55]} /><meshStandardMaterial map={m} roughness={0.5} /></mesh></group></>; }}
  over={(tt) => <Ink tt={tt} at={D - 3.2} txt="THIN AS A MAGAZINE" />} />; };

// 16:17 · TSUYU: lluvia detrás de la ventana, las paredes sudan y las sandalias se ponen verdes
const tsuyu: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.25, 0.9, 1.85], [0.1, 0.62, -0.25]), C([-0.05, 0.72, 1.05], [0, 0.08, 0.32]), D)} set={{ warm: 0.2, spotK: 0.4 }}
  scene={(tt) => { const k = eio(tt, 3, D - 2.2), sw = eio(tt, 0.8, 5); return <><Box p={[0, 0.012, 0]} s={[3, 0.024, 1.9]} c="#6b5a44" r={0.9} /><Box p={[0, 0.8, -0.62]} s={[3.6, 1.8, 0.05]} c="#b9b39d" r={0.95} />
    <Box p={[0.6, 0.95, -0.585]} s={[1, 0.8, 0.02]} c="#6f8798" r={0.1} />
    {Array.from({ length: 70 }, (_, i) => { const u = (tt * 1.6 + rnd(i)) % 1; return <Box key={i} p={[0.14 + rnd(i + 3) * 0.92, 1.33 - 0.76 * u, -0.57]} s={[0.004, 0.06, 0.004]} c="#dcecf5" r={0.3} />; })}
    {Array.from({ length: 34 }, (_, i) => { const a = rnd(i) * 4, u = cl(((tt - a) % 5) / 5), y = 1.3 - 0.2 * rnd(i + 2) - 0.8 * u * u; return sw > 0.05 ? <Drop key={i} s={1} op={0.8 * sw} p={[-1.3 + 1.28 * rnd(i + 4), y, -0.585]} /> : null; })}
    {[-1, 1].map((sg) => <group key={sg} position={[sg * 0.16, 0.04, 0.35]} rotation={[0, sg * 0.12, 0]}><mesh scale={[0.13, 0.03, 0.3]} castShadow><sphereGeometry args={[1, 24, 14]} /><meshStandardMaterial color={col("#a4845c", "#4e7a3a", k)} roughness={0.9} /></mesh><mesh position={[0, 0.03, -0.08]} rotation={[0, 0, PI / 2]} scale={[1, 1.0, 1.55]}><torusGeometry args={[0.08, 0.012, 8, 24, PI]} /><meshStandardMaterial color="#6b2a24" roughness={0.6} /></mesh></group>)}
    <Hair n={110} pts={(i) => { const sg = i % 2 ? 1 : -1, a = i * 2.4, R = Math.sqrt(rnd(i)); return { p: [sg * 0.16 + 0.11 * R * Math.cos(a), 0.066, 0.35 + 0.27 * R * Math.sin(a)], r: [0, 0, 0] }; }} len={(i) => 0.03 * k * rnd(i + 3)} c="#4f7f3d" /></>; }}
  over={(tt) => <Ink tt={tt} at={1} txt="TSUYU" col="#bfe6ff" y={130} />} />; };

// 16:33 · LA PROCESIÓN: tabla, cubo de arroz, cuchara y tapita salen en fila india al escalón al sol
const proces: F = ({ t, h }) => { const D = h.out - h.at, A = [h.items?.[0]?.at ?? 2.2, h.items?.[1]?.at ?? 3.4, h.items?.[2]?.at ?? 4.6, h.items?.[3]?.at ?? 5.8]; return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.2, 0.92, 1.85], [0, 0.25, 0]), C([-0.2, 0.8, 1.6], [0, 0.25, 0]), D)} set={{ warm: 0.8, spotK: 0.5 }}
  scene={(tt) => <><Box p={[0, 0.07, 0.1]} s={[3, 0.14, 1.2]} c="#a39379" r={0.95} /><Box p={[0, 0.8, -0.72]} s={[3.6, 1.8, 0.05]} c="#cdbf9f" r={0.9} />
    <mesh position={[-0.975, 0.85, -0.67]}><planeGeometry args={[0.72, 1.38]} /><meshBasicMaterial color="#fff0c4" /></mesh>
    <Box p={[-1.375, 0.85, -0.65]} s={[0.07, 1.46, 0.1]} c="#7a5a3a" r={0.7} /><Box p={[-0.575, 0.85, -0.65]} s={[0.07, 1.46, 0.1]} c="#7a5a3a" r={0.7} />
    <group position={[-1.34, 0.85, -0.6]} rotation={[0, -1.75 * eio(tt, 0.3, 3.5), 0]}><Box p={[0.365, 0, 0]} s={[0.73, 1.38, 0.04]} c="#9a7446" r={0.75} map={woodT("maple")} /><mesh position={[0.64, -0.05, 0.045]}><sphereGeometry args={[0.028, 14, 10]} /><meshStandardMaterial color="#6d5a35" metalness={0.5} roughness={0.4} /></mesh></group>
    {A.map((a, i) => { const u = eio(tt, a, a + 0.9), x = lerp(-0.97, -0.72 + i * 0.5, u), z = lerp(-0.45, 0.1, u), k = Math.max(0.05, eio(tt, a, a + 0.3)), y = 0.14 + 0.12 * Math.abs(Math.sin(u * PI * 3)) * (1 - u); return <group key={i} visible={tt >= a} scale={k} position={[x, y, z]}>{i === 0 ? <Board p={[0, 0.03, 0]} w={0.48} d={0.56} kind="maple" /> : i === 1 ? <><Cyl p={[0, 0.1, 0]} r={0.19} h={0.2} c="#c79b5f" rough={0.7} /><Cyl p={[0, 0.05, 0]} r={0.195} h={0.018} c="#7c5a2c" m={0.4} rough={0.5} /><Cyl p={[0, 0.16, 0]} r={0.195} h={0.018} c="#7c5a2c" m={0.4} rough={0.5} /></> : i === 2 ? <group rotation={[0, 0.5, 0]}><Box p={[0.09, 0.02, 0]} s={[0.4, 0.016, 0.045]} c="#b98a55" r={0.7} /><mesh position={[-0.14, 0.03, 0]} scale={[1, 0.3, 0.8]}><sphereGeometry args={[0.08, 18, 12]} /><meshStandardMaterial color="#b98a55" roughness={0.7} /></mesh></group> : <><Cyl p={[0, 0.02, 0]} r={0.15} h={0.04} c="#a87b4c" rough={0.65} /><Cyl p={[0, 0.06, 0]} r={0.03} h={0.04} c="#7a5a30" rough={0.65} /></>}</group>; })}
    <Puff p={[1.25, 1.35, -0.4]} r={0.9} c="#ffd27a" op={0.65} /></>}
  over={(tt) => <Ink tt={tt} at={D - 3.6} txt="EVERYTHING WOOD, OUTSIDE" size={72} />} />; };

// 17:25 · EL VINAGRE SÓLO MOJA LA PUNTA: corte de la madera, raíz de moho profunda; la ola limpia arriba y la raíz sigue
const vinegar: F = ({ t, h }) => { const D = h.out - h.at, B = [[0, 0, -0.32], [0.05, -0.2, -0.55], [-0.08, -0.32, -0.62], [0.13, -0.42, -0.72], [-0.05, -0.52, -0.82]]; return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.12, 0.3, 1.85], [0, 0.12, 0]), C([-0.12, 0.2, 1.65], [0, 0.08, 0]), D)} set={{ warm: 0.25 }}
  scene={(tt) => { const w = eio(tt, 2.8, 5.2); return <><Box p={[0, -0.25, -0.05]} s={[2.6, 1.05, 0.34]} c="#b98a55" r={0.7} map={woodT("maple")} /><Box p={[0, 0.0, 0.115]} s={[2.6 * Math.max(0.01, w), 0.05, 0.016]} c="#e6e8c8" r={0.2} op={0.7} />
    <mesh position={[0, 0.38, 0.12]}><sphereGeometry args={[0.001, 4, 4]} /><meshBasicMaterial color="#000000" /></mesh>
    {[-0.62, 0.05, 0.68].map((x, i) => <group key={i} position={[x, 0.26, 0.14]}>
      <mesh scale={[1 - 0.75 * w, Math.max(0.08, 1 - 0.85 * w), 1]} position={[0, 0.03 - 0.05, 0]}><sphereGeometry args={[0.1, 20, 14]} /><meshStandardMaterial color={MOLD} roughness={1} /></mesh>
      {B.map(([dx, dy, yE], j) => { const L = Math.abs(yE - dy); return <Box key={j} p={[dx, (dy + yE) / 2, 0]} s={[0.017, L, 0.014]} rot={[0, 0, 0.2 * Math.sin(j * 2 + i)]} c={MOLD} r={1} />; })}</group>)}
    <Disc p={[0, 0.27, 0.0]} r={0.001} c="#000000" /></>; }}
  over={(tt) => <>{<Ink tt={tt} at={3} txt="ONLY THE SURFACE" />}{tt > 5.6 && <Ink tt={tt} at={5.6} y={130} txt="THE ROOT STAYS" col="#ff9a8a" size={72} />}</>} />; };

// 18:14 · LA SEMANA: siete tablitas; todas reciben jabón, sólo una recibe la sal
const week: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 1.15, 1.75], [0, 0.05, 0]), C([-0.1, 1.05, 1.55], [0, 0.05, 0]), D)} set={{ warm: 0.45 }}
  scene={(tt) => <><Counter />{Array.from({ length: 7 }, (_, i) => { const a = 0.9 + i * 0.5, k = pop(tt, a), x = -1.17 + i * 0.39, sa = 5.2; return <Pop key={i} k={Math.max(0.05, k)} p={[x, 0.05, 0]}><Board p={[0, 0.03, 0]} w={0.33} d={0.5} h={0.05} kind="maple" />
      {Array.from({ length: 6 }, (_, j) => { const u = pop(tt, a + 0.25 + j * 0.05); return u > 0.05 ? <mesh key={j} position={[(rnd(j + i) - 0.5) * 0.24, 0.078 + 0.015 * j, (rnd(j + i + 9) - 0.5) * 0.36]} scale={u}><sphereGeometry args={[0.025 + 0.01 * rnd(j), 12, 10]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.85} roughness={0.05} /></mesh> : null; })}
      {i === 4 && Array.from({ length: 34 }, (_, j) => { const u = cl((tt - sa - j * 0.03) / 0.3); return u > 0 ? <Salt key={j} s={0.5} rot={[j, j * 2, 0]} p={[(rnd(j) - 0.5) * 0.28, 0.08 + (1 - u * u) * 0.7, (rnd(j + 5) - 0.5) * 0.42]} /> : null; })}</Pop>; })}</>}
  over={(tt) => <>{<Ink tt={tt} at={1.6} txt="SOAP EVERY TIME" />}{tt > 5.2 && <Ink tt={tt} at={5.2} y={130} txt="SALT ONCE A WEEK" col="#ffcf55" />}</>} />; };

// 19:03 · ARRIBA DEL ESTANTE: la tabla regalada con moño junta polvo durante dos años y se parte sin usarla
const topshelf: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.25, 2.0, 1.15], [0, 1.1, -0.3]), C([-0.15, 1.9, 0.82], [0, 1.1, -0.3]), D)} set={{ warm: 0.4 }}
  scene={(tt) => { const k = eio(tt, 0.8, D - 3), c = eio(tt, D - 3, D - 2.1), dust = k; return <><Box p={[0, 1.1, -0.72]} s={[3.6, 2.2, 0.05]} c="#d9cfbb" r={0.9} /><Box p={[0, 1.02, -0.3]} s={[2.4, 0.05, 0.8]} c="#7a5a3a" r={0.6} rad={0.012} />
    <group position={[0, 1.08, -0.3]}><Board p={[-0.33 - 0.03 * c, 0, 0]} w={0.66} kind={c > 0.1 ? "pale" : "rich"} /><Board p={[0.33 + 0.03 * c, 0, 0]} w={0.66} kind={c > 0.1 ? "pale" : "rich"} />
      <Box p={[0, 0.038, 0]} s={[0.05, 0.006, 0.82]} c="#c8392f" r={0.5} /><Box p={[0, 0.038, 0]} s={[1.34, 0.006, 0.05]} c="#c8392f" r={0.5} /><mesh position={[0, 0.06, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.05, 0.016, 10, 24]} /><meshStandardMaterial color="#c8392f" roughness={0.5} /></mesh>
      {Array.from({ length: 140 }, (_, i) => cl(dust * 1.2 * 140 - i) > 0 ? <Disc key={i} p={[(rnd(i) - 0.5) * 1.26, 0.0375 + 0.0002 * i, (rnd(i + 2) - 0.5) * 0.76]} r={0.012 + 0.02 * rnd(i + 4)} c="#b9b1a2" rough={1} /> : null)}</group>
    {Array.from({ length: 16 }, (_, i) => { const u = (tt * 0.12 + i / 16) % 1; return <Puff key={i} p={[(rnd(i) - 0.5) * 1.8, 1.6 - 0.45 * u, -0.1 + 0.3 * rnd(i + 3)]} r={0.012} c="#fff4d8" op={Math.sin(PI * u) * 0.9} />; })}</>; }}
  over={(tt) => <Ink tt={tt} at={1.5} txt="TWO YEARS DOING NOTHING" size={74} />} />; };

// 19:37 · LA PRUEBA DE LA LIJA: dos tablas gemelas: una mancha se va al pasar la lija, la otra sigue ahí
const spottest: F = ({ t, h }) => { const D = h.out - h.at; const Half: React.FC<{ x: number; tt: number; goes: boolean }> = ({ x, tt, goes }) => { const k = eio(tt, 1.4, D - 3.5), wob = Math.sin(tt * 7) * 0.13 * cl(tt - 1.2) * (1 - cl(tt - (D - 3.2))); return <group position={[x, 0, 0]}><Board p={[0, 0.06, 0]} w={1.02} d={0.82} kind="old" /><group position={[0, 0.0965, 0]}><Colony x={0} z={0} y={0.003} s={4} i={3} k={goes ? Math.max(0.05, 1 - k) : 1} /></group>
    <group position={[wob, 0.16 + (1 - cl(tt - 0.8)) * 0.6 + 0.18 * cl(tt - (D - 3.2)), 0]} rotation={[0, 0, 0]}><Box p={[0, 0, 0]} s={[0.46, 0.09, 0.3]} c="#d8b880" r={0.8} rad={0.02} /><Box p={[0, -0.05, 0]} s={[0.47, 0.012, 0.31]} c="#6a4a30" r={1} /></group></group>; };
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.05, 1.3, 1.25], [0, 0.05, 0.02]), C([-0.05, 1.2, 1.1], [0, 0.05, 0.02]), D)} set={{ warm: 0.35 }}
    scene={(tt) => <><Counter /><Half x={-0.56} tt={tt} goes /><Half x={0.56} tt={tt} goes={false} /></>}
    over={(tt) => <>{tt > D - 3.1 && <Ink tt={tt} at={D - 3.1} x={510} txt="SAVE IT" col="#b8f0a8" />}{tt > D - 2.5 && <Ink tt={tt} at={D - 2.5} x={1400} txt="SAY GOODBYE" col="#ff9a8a" />}</>} />; };

// 20:27 · GRACIAS, TABLA: la tabla vieja en la vereda y ella que se inclina
const thanks: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([1.2, 1.35, 4.1], [0.1, 1.0, 0]), C([0.8, 1.3, 3.6], [0.1, 1.0, 0]), D)} set={{ warm: 0.7, spotK: 0.5 }}
  scene={(tt) => { const b = eio(tt, D - 5.4, D - 4) * (1 - eio(tt, D - 2.4, D - 1.2)); return <><Box p={[0, 0.03, 0]} s={[4, 0.06, 2.4]} c="#9a9488" r={0.95} /><group position={[0.75, 0.44, 0.1]} rotation={[-0.15, -0.3, 0.08]}><Board p={[0, 0, 0]} rot={[PI / 2, 0, 0]} w={0.72} d={0.82} kind="old" /></group>
    <Box p={[1.0, 0.2, -0.3]} s={[0.74, 0.34, 0.5]} c="#6b4a2c" r={0.8} />
    <group position={[-0.5, 0.06, 0.15]} rotation={[0, 0.85, 0]}><group position={[0, 0.0, 0]} rotation={[b * 0.55, 0, 0]}><Sachi p={PZ.stand} t={tt} s={0.55} /></group></group></>; }}
  over={(tt) => <Ink tt={tt} at={D - 4.2} txt="THANK IT FIRST" />} />; };

// 21:19 · UNA SOLA CANILLA: en la oscuridad, una gota por vez cae y su anillo crece hasta llenar la pileta
const tap: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 1.12, 2.1], [0, 0.48, 0]), C([-0.12, 1.0, 1.7], [0, 0.48, 0]), D)} set={{ warm: 0.3, spotK: 0.4 }}
  scene={(tt) => <><Box p={[0, 0.012, 0]} s={[3, 0.024, 1.9]} c="#4a3e30" r={0.95} /><Box p={[0, 0.8, -0.72]} s={[3.6, 1.8, 0.05]} c="#b7ab92" r={0.95} />
    <Cyl p={[0, 0.1, 0]} r={0.55} r2={0.44} h={0.17} c="#34506c" rough={0.3} /><Disc p={[0, 0.187, 0]} r={0.5} c="#8fbdd3" rough={0.04} />
    <Cyl p={[0, 0.5, -0.6]} r={0.03} h={0.9} c="#7d8086" m={0.75} rough={0.35} /><Cyl p={[0, 0.9, -0.33]} r={0.03} h={0.55} rot={[PI / 2, 0, 0]} c="#7d8086" m={0.75} rough={0.35} /><Cyl p={[0, 0.86, -0.06]} r={0.034} h={0.09} c="#7d8086" m={0.75} rough={0.35} />
    {[0, 1, 2, 3, 4].map((i) => { const a = 0.6 + i * 1.6, u = cl((tt - a) / 0.5), r = cl((tt - a - 0.5) / 1.9); return <group key={i}>{u > 0 && u < 1 && <Drop s={1.3} p={[0, 0.8 - 0.63 * u * u, -0.06]} />}{r > 0 && r < 1 && <mesh position={[0, 0.174, -0.06]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.44 * r, 0.44 * r + 0.01, 48]} /><meshBasicMaterial color="#e6f4fb" transparent opacity={1 - r} /></mesh>}</group>; })}</>}
  over={(tt) => <Ink tt={tt} at={2.6} txt="ONE COLD TAP" col="#bfe6ff" />} />; };

// CUADRO 0 = la miniatura sin texto: tabla mitad negra de moho y mitad limpia, medio limón frotando, bol de sal gruesa a la izquierda
export const Cover0: React.FC = () => <Hero t={0.5} h={{ k: "c0", at: -5, out: 99 }} mode="iris" cam={() => C([0, 0.92, 1.25], [0, 0.1, 0.06])} set={{ warm: 0.55 }}
  scene={() => <><Counter c="#6b4a2c" /><Board p={[0.05, 0.06, 0.05]} w={1.25} d={0.82} kind="maple" />
    <mesh position={[-0.27, 0.0965, 0.05]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.79]} /><meshStandardMaterial map={woodT("old")} color="#6a6158" roughness={0.9} /></mesh>
    {Array.from({ length: 70 }, (_, i) => <Colony key={i} x={-0.55 + rnd(i) * 0.55} z={0.05 + (rnd(i + 3) - 0.5) * 0.74} y={0.098} s={1 + rnd(i + 5) * 1.4} i={i} k={1} />)}
    <Bowl p={[-0.9, 0.024, 0.32]} s={1.25} c="#c8cfd6" />{Array.from({ length: 60 }, (_, i) => <Salt key={i} s={0.9} rot={[i, i * 2, i * 3]} p={[-0.9 + 0.2 * Math.sqrt(rnd(i)) * Math.cos(i * 2.4), 0.17 + 0.03 * rnd(i + 2), 0.32 + 0.2 * Math.sqrt(rnd(i)) * Math.sin(i * 2.4)]} />)}
    <Lemon p={[0.05, 0.22, 0.06]} s={1.35} rot={[PI, 0, 0.25]} />{Array.from({ length: 16 }, (_, i) => <Drop key={i} c="#f3e58a" s={0.9} p={[0.05 + (rnd(i) - 0.5) * 0.2, 0.1 + 0.11 * rnd(i + 2), 0.06 + (rnd(i + 4) - 0.5) * 0.2]} />)}</>} />;

export const HC: Record<string, F> = { underside, fur, stool, sponge, eggwhite, puddle, saltrain, valley, tawashi, withgrain, standup, sunstep, crack, kettle, gallon, linda, notch, bounce, planer, cracker, oil, drink, chip, drawer, sandglass, thin, tsuyu, proces, vinegar, week, topshelf, spottest, thanks, tap };
