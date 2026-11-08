// sk8pc · componentes ÚNICOS del video del bife barato (uno por minuto; ver D:/rtmp/premium8n_sachiko_COMPONENTES.md).
// Maqueta sobre la mesada (hk.tsx). Cada uno = UNA idea con un objeto que se entiende sin leer. Nada de random sin semilla ni escala 0.
import React, { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { F, Hero, C, lerp, pop, Pop, Ink, cardTex, Pan, Bowl, Ring, Sticks, cl, eio, orbita, Box, Cyl, V } from "./hk";

const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const PI = Math.PI, BEEF = "#962f2a", FAT = "#f3e4d6", ONION = "#f4efd9", WATER = "#9fd4ff", SNOW = "#d2cdbb";

let _soft: THREE.Texture | null = null;
const softTex = () => { if (_soft) return _soft; const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d")!, g = x.createRadialGradient(64, 64, 2, 64, 64, 63); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.45, "rgba(255,255,255,.42)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 128, 128); _soft = new THREE.CanvasTexture(c); return _soft; };
// puntos: GTAOPass oculta Points/Lines (un plano o sprite transparente deja un recuadro en la pasada AO)
const Puff: React.FC<{ p: V; r: number; c?: string; op?: number }> = ({ p, r, c = "#efeae0", op = 0.5 }) => { const cam = useThree((x) => x.camera) as THREE.PerspectiveCamera; const size = (2 * r) / Math.tan((cam.fov * PI) / 360); const geo = useMemo(() => new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3)), []); return <points position={p} geometry={geo} renderOrder={5}><pointsMaterial map={softTex()} color={c} size={size} sizeAttenuation transparent opacity={op} depthWrite={false} toneMapped={false} /></points>; };
const Steam: React.FC<{ p: V; t: number; k?: number; n?: number; s?: number }> = ({ p, t, k = 1, n = 6, s = 1 }) => k < 0.02 ? null : <>{Array.from({ length: n }, (_, i) => { const u = (t * 0.33 + i / n) % 1; return <Puff key={i} p={[p[0] + 0.05 * s * (1 + 2 * u) * Math.sin(i * 2.4 + t * 0.7), p[1] + u * 0.72 * s, p[2] + 0.05 * s * Math.cos(i * 1.7 + t * 0.5)]} r={(0.07 + 0.17 * u) * s} op={0.3 * k * Math.sin(PI * u)} />; })}</>;
const Drop: React.FC<{ p: V; s?: number; c?: string; op?: number }> = ({ p, s = 1, c = WATER, op = 0.85 }) => <mesh position={p} scale={[s, s * 1.3, s]}><sphereGeometry args={[0.022, 12, 10]} /><meshStandardMaterial color={c} transparent opacity={op} roughness={0.05} /></mesh>;
const Disc: React.FC<{ p: V; r: number; c: string; ry?: number; rough?: number; m?: number }> = ({ p, r, c, ry = 1, rough = 0.5, m = 0 }) => <mesh position={p} rotation={[-PI / 2, 0, 0]} scale={[1, ry, 1]}><circleGeometry args={[r, 28]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} /></mesh>;
const Counter: React.FC<{ c?: string }> = ({ c = "#8b6a48" }) => <Box p={[0, 0.012, 0]} s={[3, 0.024, 1.9]} c={c} r={0.7} rad={0.01} />;
const Wall: React.FC<{ c?: string; z?: number }> = ({ c = "#e7ddc9", z = -0.75 }) => <Box p={[0, 0.8, z]} s={[3.6, 1.8, 0.05]} c={c} r={0.9} />;
const CBoard: React.FC<{ p?: V; w?: number; d?: number }> = ({ p = [0, 0.05, 0], w = 1.5, d = 1 }) => <Box p={p} s={[w, 0.05, d]} c="#c79a62" r={0.65} rad={0.012} cast />;

// bife: contorno orgánico, marmolado dibujado, grosor real
let _mt: THREE.Texture | null = null;
const marble = () => { if (_mt) return _mt; const cv = document.createElement("canvas"); cv.width = cv.height = 512; const g = cv.getContext("2d")!; g.fillStyle = "#a8322d"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(90,20,18,${0.1 + rnd(i) * 0.2})`; g.beginPath(); g.ellipse(rnd(i + 1) * 512, rnd(i + 2) * 512, 40 + rnd(i + 3) * 80, 16 + rnd(i + 4) * 30, rnd(i + 5) * 3, 0, 6.3); g.fill(); } g.strokeStyle = FAT; g.lineCap = "round"; for (let i = 0; i < 42; i++) { g.globalAlpha = 0.45 + rnd(i + 7) * 0.5; g.lineWidth = 1.2 + rnd(i + 9) * 4; let x = rnd(i + 11) * 512, y = rnd(i + 13) * 512, a = rnd(i + 15) * 6.3; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 7; k++) { a += (rnd(i * 3 + k) - 0.5) * 1.3; x += Math.cos(a) * 26; y += Math.sin(a) * 26; g.lineTo(x, y); } g.stroke(); } g.globalAlpha = 1; _mt = new THREE.CanvasTexture(cv); _mt.colorSpace = THREE.SRGBColorSpace; _mt.wrapS = _mt.wrapT = THREE.RepeatWrapping; _mt.anisotropy = 8; return _mt; };
const steakGeo = () => { const s = new THREE.Shape(); for (let i = 0; i <= 64; i++) { const a = (i / 64) * PI * 2, R = 1 + 0.07 * Math.sin(a * 3 + 0.8) + 0.05 * Math.sin(a * 5 + 2), x = 0.56 * R * Math.cos(a), y = 0.36 * R * Math.sin(a); if (i === 0) s.moveTo(x, y); else s.lineTo(x, y); } const g = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelSize: 0.022, bevelThickness: 0.022, bevelSegments: 4, curveSegments: 8 }); g.rotateX(-PI / 2); g.translate(0, 0.022, 0); return g; };
const Steak: React.FC<{ p: V; s?: number; h?: number; rot?: V; tint?: string; rough?: number }> = ({ p, s = 1, h = 1, rot = [0, 0, 0], tint = "#ffffff", rough = 0.45 }) => { const g = useMemo(steakGeo, []); return <mesh geometry={g} position={p} rotation={rot} scale={[s, h * s, s]} castShadow><meshPhysicalMaterial map={marble()} color={tint} roughness={rough} clearcoat={0.25} /></mesh>; };
const Rope: React.FC<{ p: V; L: number; r?: number; c?: string; rot?: V }> = ({ p, L, r = 0.055, c = BEEF, rot = [0, 0, PI / 2] }) => <Cyl p={p} r={r} h={L} rot={rot} c={c} rough={0.55} />;
const Band: React.FC<{ p: V; r: number; c?: string; w?: number; arc?: number }> = ({ p, r, c = FAT, w = 0.012, arc = PI * 2 }) => <mesh position={p} rotation={[0, PI / 2, 0]}><torusGeometry args={[r, w, 10, 32, arc]} /><meshStandardMaterial color={c} roughness={0.4} /></mesh>;
const GL = (n: number, r: number) => Array.from({ length: n }, (_, i) => ({ x: r * Math.sqrt(rnd(i) * 0.96) * Math.cos(i * 2.4), z: r * Math.sqrt(rnd(i) * 0.96) * Math.sin(i * 2.4), a: rnd(i + 9) * 6 }));
const OnionHalf: React.FC<{ p: V; s?: number; rot?: V }> = ({ p, s = 1, rot = [0, 0, 0] }) => <group position={p} rotation={rot} scale={s}><mesh castShadow><sphereGeometry args={[0.2, 30, 16, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#d9b878" roughness={0.45} /></mesh><mesh rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.2, 36]} /><meshStandardMaterial color={ONION} roughness={0.5} side={THREE.DoubleSide} /></mesh>{[0.05, 0.095, 0.14, 0.18].map((r, i) => <mesh key={i} position={[0, -0.002, 0]} rotation={[PI / 2, 0, 0]}><ringGeometry args={[r, r + 0.006, 36]} /><meshStandardMaterial color="#cbbf8c" side={THREE.DoubleSide} /></mesh>)}</group>;
const SodaBox: React.FC<{ p: V; rot?: V; s?: number }> = ({ p, rot = [0, 0, 0], s = 1 }) => { const m = useMemo(() => cardTex(["BAKING", "SODA"], { bg: "#fbf8f1", fg: "#26303a", h: 320 }), []); return <group position={p} rotation={rot} scale={s}><Box p={[0, 0, 0]} s={[0.3, 0.42, 0.14]} c="#fbf8f1" r={0.7} rad={0.012} cast /><mesh position={[0, 0.03, 0.073]}><planeGeometry args={[0.28, 0.2]} /><meshBasicMaterial map={m} toneMapped={false} /></mesh></group>; };
const Pile: React.FC<{ p: V; r: number; h: number; c?: string }> = ({ p, r, h, c = SNOW }) => <mesh position={p} scale={[r, Math.max(0.004, h), r]} castShadow><sphereGeometry args={[1, 30, 18, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color={c} roughness={0.95} /></mesh>;

// 0:24 · DA MEDIA VUELTA Y ES JABÓN: el bocado gira en el aire y su otra cara es una barra con burbujas
const soapbite: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.2, 0.62, 1.25], [0, 0.34, 0]), C([-0.2, 0.55, 1.05], [0, 0.34, 0]), D)} set={{ warm: 0.35 }}
  scene={(tt) => { const f = eio(tt, 3, 4.3), bub = cl(tt - 4); return <><Counter c="#d9cdb6" /><Disc p={[0, 0.026, 0]} r={0.42} c="#efece4" rough={0.3} />
    <group position={[0, 0.34 + 0.025 * Math.sin(tt * 2), 0]} rotation={[0, PI * f, 0]}>{f < 0.5 ? <Steak p={[0, -0.02, 0]} s={0.42} rot={[PI / 2.3, 0, 0]} /> : <group rotation={[0, PI, 0]}><Box p={[0, 0, 0]} s={[0.5, 0.3, 0.17]} c="#f0e9d0" r={0.25} rad={0.05} cast /></group>}</group>
    {bub > 0 && Array.from({ length: 16 }, (_, i) => { const u = (tt * 0.32 + i / 16) % 1; return <mesh key={i} position={[0.32 * Math.cos(i * 2.2) * (1 + u), 0.2 + 0.7 * u, 0.2 * Math.sin(i * 2.2)]} scale={Math.max(0.2, bub)}><sphereGeometry args={[0.018 + 0.03 * rnd(i), 14, 12]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.55} roughness={0.02} clearcoat={1} /></mesh>; })}</>; }}
  over={(tt) => <Ink tt={tt} at={4.3} txt="A BAR OF SOAP" />} />; };

// 0:54 · CUATRO DIENTES: una encía con sólo cuatro dientes y aun así el bife cede
const fourteeth: F = ({ t, h }) => { const D = h.out - h.at, slots = [-0.75, -0.2, 0.34, 0.86]; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 0.72, 1.5], [0, 0.2, 0]), C([-0.1, 0.8, 1.32], [0, 0.2, 0]), D)} set={{ warm: 0.5 }}
  scene={(tt) => { const close = 0.5 + 0.5 * Math.sin(tt * 2.1 - 1.5), pres = eio(tt, 3.2, 3.9) * close; return <><Counter />
    {Array.from({ length: 24 }, (_, i) => { const a = PI * (i / 23), x = -0.7 * Math.cos(a), z = -0.4 * Math.sin(a) + 0.2; return <mesh key={i} position={[x, 0.07, z]} scale={[1, 0.7, 1]}><sphereGeometry args={[0.09, 16, 12]} /><meshStandardMaterial color="#d57b76" roughness={0.45} /></mesh>; })}
    {slots.map((s, i) => { const a = PI * ((s + 1) / 2), k = pop(tt, 0.7 + i * 0.5); return <Pop key={i} k={Math.max(0.05, k)} p={[-0.7 * Math.cos(a), 0.15, -0.4 * Math.sin(a) + 0.2]}><Box p={[0, 0.06, 0]} s={[0.12, 0.19, 0.1]} c="#efe7cf" r={0.25} rad={0.035} /></Pop>; })}
    <Steak p={[0, 0.45 - 0.17 * pres, 0.06]} s={0.3} h={lerp(1.2, 0.3, pres)} /></>; }}
  over={(tt) => <Ink tt={tt} at={1.2} txt="FOUR TEETH LEFT" />} />; };

// 1:29 · EL HONGO DE TRES DÓLARES: un maitake que se arma pétalo por pétalo
const maitake: F = ({ t, h }) => { const D = h.out - h.at, N = 34; return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.3, 0.7, 1.25], [0, 0.28, 0]), C([-0.25, 0.6, 1.1], [0, 0.3, 0]), D)} set={{ warm: 0.45 }}
  scene={(tt) => <><Counter c="#d9cdb6" />{Array.from({ length: N }, (_, i) => { const k = pop(tt, 0.6 + (i * (D - 3)) / N), u = i / N, a = i * 2.4, R = 0.38 * Math.sqrt(1 - u), y = 0.08 + 0.42 * u; return k > 0.05 ? <group key={i} position={[R * Math.cos(a), y, R * Math.sin(a)]} rotation={[0, -a + PI / 2, 0]} scale={Math.max(0.1, k)}><mesh rotation={[0.55, 0, 0]} scale={[1, 0.13, 0.74]}><sphereGeometry args={[0.14, 18, 10]} /><meshStandardMaterial color={col("#7a5a3c", "#3c2c20", rnd(i))} roughness={0.85} /></mesh></group> : null; })}
    <Cyl p={[0, 0.13, 0]} r={0.14} r2={0.1} h={0.25} c="#e0d6bd" rough={0.85} /></>}
  over={(tt) => <Ink tt={tt} at={2} txt="A $3 MUSHROOM" />} />; };

// 2:01 · LAS PROTEÍNAS: al calor se aprietan en un puño; con el polvo no pueden juntarse
const squeeze: F = ({ t, h }) => { const D = h.out - h.at, Pts = useMemo(() => Array.from({ length: 26 }, (_, i) => { const a = i * 2.4, e = Math.acos(1 - (2 * (i + 0.5)) / 26); return [Math.sin(e) * Math.cos(a), Math.cos(e), Math.sin(e) * Math.sin(a)] as V; }), []); return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.15, 0.6, 2.1], [0, 0.42, 0]), C([-0.15, 0.55, 1.95], [0, 0.42, 0]), D)} set={{ warm: 0.3 }}
  scene={(tt) => { const k = eio(tt, 2.2, 4.8); return <><Counter />{[0, 1].map((n) => { const x = n ? 0.58 : -0.58, R = n ? lerp(0.3, 0.42, k) : lerp(0.3, 0.12, k), shake = n ? 0 : Math.sin(tt * 22) * 0.008 * k; return <group key={n} position={[x + shake, 0.46, 0]}>{Pts.map((p, i) => <mesh key={i} position={[p[0] * R, p[1] * R, p[2] * R]}><sphereGeometry args={[0.052, 14, 12]} /><meshStandardMaterial color={n ? "#c98d82" : col("#c98d82", "#7a2a22", k)} roughness={0.42} /></mesh>)}{n === 1 && Array.from({ length: 22 }, (_, i) => <mesh key={"s" + i} position={[Pts[i % 26][0] * R * 0.62, Pts[i % 26][1] * R * 0.62, Pts[i % 26][2] * R * 0.62]}><boxGeometry args={[0.022, 0.022, 0.022]} /><meshStandardMaterial color="#ffffff" /></mesh>)}</group>; })}</>; }}
  over={(tt) => <>{<Ink tt={tt} at={2.4} x={470} size={66} txt="HEAT SQUEEZES" col="#ff9a8a" />}{<Ink tt={tt} at={3.6} x={1450} size={66} txt="SODA BLOCKS IT" col="#ffffff" />}</>} />; };

// 2:37 · CÁSCARA BLANDA, CENTRO DURO: corte del bife: el borde tiembla como esponja; el centro no se entera
const mushy: F = ({ t, h }) => { const D = h.out - h.at, T = useMemo(() => {
  const mk = () => { const c = document.createElement("canvas"); c.width = 1024; c.height = 256; return c; };
  const a = mk(), g = a.getContext("2d")!; g.fillStyle = "#a02e29"; g.fillRect(0, 0, 1024, 256);
  for (let i = 0; i < 90; i++) { let y = 8 + i * 2.8 + rnd(i) * 3; g.strokeStyle = i % 3 ? "#7c211e" : "#c8574f"; g.lineWidth = 0.8 + rnd(i + 7) * 1.6; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= 1024; x += 48) g.lineTo(x, y + 3.5 * Math.sin(x * 0.012 + i * 0.7)); g.stroke(); }
  const b = mk(), q = b.getContext("2d")!; q.fillStyle = "#b08660"; q.fillRect(0, 0, 1024, 256);
  for (let i = 0; i < 520; i++) { q.fillStyle = i % 4 ? "#8b6442" : "#c9a37c"; q.beginPath(); q.ellipse(rnd(i) * 1024, rnd(i + 900) * 256, 2 + rnd(i + 5) * 6, 1.5 + rnd(i + 8) * 4, rnd(i + 3) * 3, 0, PI * 2); q.fill(); }
  q.globalCompositeOperation = "destination-out"; q.translate(512, 128); q.scale(1, 0.3); const rg = q.createRadialGradient(0, 0, 200, 0, 0, 390); rg.addColorStop(0, "rgba(0,0,0,1)"); rg.addColorStop(1, "rgba(0,0,0,0)"); q.fillStyle = rg; q.beginPath(); q.arc(0, 0, 400, 0, PI * 2); q.fill();
  return [new THREE.CanvasTexture(a), new THREE.CanvasTexture(b)].map((x) => { x.colorSpace = THREE.SRGBColorSpace; return x; }); }, []);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.1, 0.5, 1.45], [0, 0.22, 0]), C([-0.1, 0.42, 1.25], [0, 0.22, 0]), D)} set={{ warm: 0.3 }}
  scene={(tt) => { const k = eio(tt, 1, 4), wob = 1 + 0.045 * k * Math.sin(tt * 7); return <><Counter c="#7f6244" /><group position={[0, 0.03, 0]} scale={[wob, 1 / wob, 1]}><Box p={[0, 0.2, 0]} s={[1.5, 0.36, 0.42]} c={col(BEEF, "#b08660", k)} r={0.95} rad={0.08} />
    {Array.from({ length: 40 }, (_, i) => <Disc key={i} p={[(rnd(i) - 0.5) * 1.4, 0.383, (rnd(i + 3) - 0.5) * 0.38]} r={0.012 + 0.016 * rnd(i + 5)} c={col("#80241f", "#8f6a42", k)} />)}
    <mesh position={[0, 0.2, 0.2115]}><planeGeometry args={[1.36, 0.3]} /><meshStandardMaterial map={T[0]} roughness={0.6} /></mesh>
    <mesh position={[0, 0.2, 0.2135]}><planeGeometry args={[1.36, 0.3]} /><meshStandardMaterial map={T[1]} roughness={0.9} transparent opacity={k} depthWrite={false} /></mesh></group></>; }}
  over={(tt) => <>{<Ink tt={tt} at={1.8} txt="SOFT LIKE A WET SPONGE" size={74} />}{tt > 5 && <Ink tt={tt} at={5} y={130} txt="STILL CHEWY INSIDE" col="#ff9a8a" size={70} />}</>} />; };

// 3:07 · LAS SOGAS: el músculo es un manojo de sogas atadas con fajas blancas que se aprietan
const ropes: F = ({ t, h }) => { const D = h.out - h.at, Y = [[0, 0.4], [0.11, 0.48], [-0.11, 0.48], [0.11, 0.32], [-0.11, 0.32], [0, 0.56], [0, 0.24]]; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.7, 0.75, 1.75], [0, 0.4, 0]), C([-0.5, 0.6, 1.55], [0, 0.4, 0]), D)} set={{ warm: 0.4 }}
  scene={(tt) => { const k = eio(tt, 3.6, 5.6); return <><Counter />{Y.map(([z, y], i) => <Rope key={i} p={[0, 0.4 + (y - 0.4) * (1 - 0.14 * k), z * (1 - 0.14 * k)]} L={2.05} r={0.066} c={col("#9b3530", "#7f2823", rnd(i))} />)}{[-0.7, -0.25, 0.22, 0.68].map((x, i) => { const q = pop(tt, 2.2 + i * 0.4); return q > 0.05 ? <Band key={i} p={[x, 0.4, 0]} r={lerp(0.27, 0.235, k)} w={0.03} /> : null; })}</>; }}
  over={(tt) => <Ink tt={tt} at={1.3} txt="LONG ROPES OF MUSCLE" />} />; };

// 3:39 · EL TELÓN: se abre y aparece el cantante, una montaña en un foco; las notas salen
const opera: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.25, 1.05, 3.7], [0.08, 0.92, 0]), C([-0.1, 1.02, 3.15], [0.08, 0.95, 0]), D)} set={{ warm: 0.1, spotK: 0.3, bg: "#20130f" }}
  scene={(tt) => { const op = eio(tt, 0.6, 2.2); return <><Box p={[0, 0.06, 0]} s={[3.4, 0.12, 1.4]} c="#6b4426" r={0.5} /><Box p={[0, 1, -0.65]} s={[3.6, 2, 0.05]} c="#1a0f0c" r={1} /><Disc p={[0, 0.125, 0.1]} r={0.66} ry={0.8} c="#f7e0a8" rough={0.7} />
    {[-1, 1].map((sg) => Array.from({ length: 8 }, (_, i) => <Cyl key={sg + "" + i} p={[sg * (0.34 + i * 0.16 + op * 0.55), 1.05, 0.45 + 0.02 * (i % 2)]} r={0.1} h={1.9} c={i % 2 ? "#a32a2a" : "#8a1f22"} rough={0.75} />))}
    <mesh position={[0, 0.72, 0.05]} scale={[0.42, 0.6, 0.34]} castShadow><sphereGeometry args={[1, 28, 20]} /><meshStandardMaterial color="#21201f" roughness={0.6} /></mesh><mesh position={[0, 1.36, 0.08]} castShadow><sphereGeometry args={[0.17, 24, 18]} /><meshStandardMaterial color="#d8b89a" roughness={0.5} /></mesh><Box p={[0, 1.08, 0.32]} s={[0.1, 0.16, 0.02]} c="#c9c2b0" r={0.5} /><Box p={[0, 1.17, 0.31]} s={[0.17, 0.05, 0.02]} c="#7c1d20" r={0.5} /><Cyl p={[0.62, 0.42, 0.42]} r={0.27} h={0.6} c="#7a4a2c" rough={0.7} /><Disc p={[0.62, 0.725, 0.42]} r={0.2} c="#c9c2b0" rough={0.3} /><Steak p={[0.62, 0.735, 0.42]} s={0.28} h={0.7} tint="#6d4630" />
    {Array.from({ length: 10 }, (_, i) => { const u = (tt * 0.22 + i / 10) % 1; return op > 0.6 ? <group key={i} position={[(i % 2 ? 1 : -1) * (0.25 + u * 0.8), 1.25 + 0.65 * u, 0.3]}><mesh scale={[1.25, 0.9, 1]}><sphereGeometry args={[0.03, 14, 10]} /><meshStandardMaterial color="#f4c64a" emissive="#c48a18" emissiveIntensity={Math.sin(PI * u)} /></mesh><Box p={[0.034, 0.08, 0]} s={[0.01, 0.16, 0.01]} c="#f4c64a" /></group> : null; })}</>; }}
  over={(tt) => <Ink tt={tt} at={2.8} txt="A VERY LARGE APPETITE" />} />; };

// 4:13 · LA RECETA DEL CHEF: el mazo aplana, la nieve de cebolla lo cubre todo
const pound: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.3, 0.9, 1.4], [0, 0.1, 0]), C([-0.2, 0.82, 1.2], [0, 0.1, 0]), D)} set={{ warm: 0.5 }}
  scene={(tt) => { const hits = Math.min(3, Math.floor(cl((tt - 0.8) / 2.5) * 3)), ph = ((tt - 0.8) / (2.5 / 3)) % 1, up = tt < 3.3 && tt > 0.8 ? Math.abs(Math.sin(ph * PI)) : 1, fl = (hits + (tt < 3.3 && tt > 0.8 ? ph : 0)) / 3, sn = eio(tt, 3.8, D - 1); return <><Counter /><CBoard />
    <Steak p={[0, 0.076, 0]} s={lerp(0.62, 0.92, fl)} h={lerp(1.9, 0.45, fl)} />
    <group position={[0, 0.2 + 0.42 * up + (tt > 3.3 ? cl(tt - 3.3) * 1.2 : 0), 0]}><Cyl p={[0, 0, 0]} r={0.17} h={0.13} c="#b6b8bd" m={0.8} rough={0.32} /><Cyl p={[0, 0.3, 0]} r={0.035} h={0.5} c="#8e6236" rough={0.6} /></group>
    {sn > 0 && <Pile p={[0, 0.115, 0]} r={0.62 * Math.sqrt(sn)} h={0.1 * sn} />}
    {Array.from({ length: 70 }, (_, i) => { const u = (tt * 0.8 + rnd(i)) % 1; return sn > 0.02 && sn < 0.98 ? <mesh key={i} position={[(rnd(i + 1) - 0.5) * 1.1, 1.1 - u, (rnd(i + 2) - 0.5) * 0.7]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color={SNOW} /></mesh> : null; })}</>; }}
  over={(tt) => <Ink tt={tt} at={3.8} txt="BURIED IN ONION" />} />; };

// 4:50 · LA VITRINA: las lindas se apagan; un foco baja al último estante
const vitrine: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.2, 0.75, 2.05], [0, 0.62, 0]), C([-0.1, 0.45, 1.55], [0, 0.3, 0]), D)} set={{ warm: 0.25, spotK: 0.5 }}
  scene={(tt) => { const k = eio(tt, 3, 5), row = (y: number, n: number, pretty: boolean) => Array.from({ length: n }, (_, i) => <group key={i} position={[-0.87 + (i * 1.74) / (n - 1), y, 0]}><Box p={[0, 0, 0]} s={[0.42, 0.03, 0.3]} c="#f0efe9" r={0.5} rad={0.008} /><Steak p={[0, 0.012, 0]} s={0.31} h={0.8} tint={pretty ? col("#ffffff", "#4d4b4b", k) : col("#776461", "#ffffff", k)} /></group>); return <><Box p={[0, 0.65, -0.42]} s={[2.6, 1.4, 0.05]} c="#d9d7cf" r={0.6} />
    {[1.08, 0.66, 0.24].map((y, i) => <Box key={i} p={[0, y - 0.03, 0]} s={[2.4, 0.024, 0.6]} c="#c8c9c7" m={0.3} r={0.35} />)}{row(1.08, 4, true)}{row(0.66, 4, true)}{row(0.24, 4, false)}
    <Puff p={[-0.3, 0.42, 0.25]} r={0.55} c="#ffd77a" op={0.55 * k} /><Ring p={[-0.29, 0.27, 0]} r={0.27} k={k} col="#ffc53a" /></>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="THE BOTTOM SHELF" />} />; };

// 5:33 · EL APIO: un manojo verde se corta en rodajas y cada pedazo queda corto
const celery: F = ({ t, h }) => { const D = h.out - h.at, Z = [-0.14, -0.05, 0.04, 0.13, -0.09, 0.09, 0]; return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.65, 0.85, 1.4], [0, 0.14, 0]), C([0.25, 0.8, 1.15], [0, 0.14, 0]), D)} set={{ warm: 0.4 }}
  scene={(tt) => { const k = eio(tt, 2.2, D - 2), n = Math.floor(k * 9), kx = -0.72 + (k * 9 * 1.4) / 9; return <><Counter /><CBoard />
    {Array.from({ length: 10 }, (_, s) => { const cut = s < n, x = -0.72 + 0.14 + s * 0.14; return <group key={s} position={[x + (cut ? -0.03 + 0.05 * s * cl(k * 2) * 0 : 0), 0, cut ? (s % 2 ? 1 : -1) * 0.05 : 0]} rotation={[cut ? (s % 2 ? 0.25 : -0.25) : 0, 0, 0]}>{Z.map((z, i) => <Cyl key={i} p={[0, 0.12 + (i > 3 ? 0.075 : 0) + (i === 6 ? 0.075 : 0), z]} r={0.043} h={0.128} rot={[0, 0, PI / 2]} c={i % 2 ? "#a8cf72" : "#8fbd5d"} rough={0.42} />)}</group>; })}
    {k > 0 && k < 1 && <group position={[kx, 0.45 - 0.2 * Math.abs(Math.sin(tt * 8)), 0]}><Box p={[0, 0, 0]} s={[0.012, 0.3, 0.72]} c="#d7dce0" m={0.9} r={0.2} /><Box p={[0, 0.2, 0.52]} s={[0.03, 0.08, 0.34]} c="#2a2a2a" r={0.5} /></group>}</>; }}
  over={(tt) => <Ink tt={tt} at={2.6} txt="SHORT PIECES" />} />; };

// 5:49 · UN CUARTO DE VUELTA: las líneas corren con el cuchillo; un giro y lo cruzan
const quarter: F = ({ t, h }) => { const D = h.out - h.at, m = useMemo(() => { const cv = document.createElement("canvas"); cv.width = cv.height = 512; const g = cv.getContext("2d")!; g.fillStyle = "#a8322d"; g.fillRect(0, 0, 512, 512); g.strokeStyle = FAT; g.lineWidth = 7; g.globalAlpha = 0.85; for (let y = 24; y < 512; y += 44) { g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= 512; x += 32) g.lineTo(x, y + 5 * Math.sin(x * 0.04 + y)); g.stroke(); } const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; }, []);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 1.7, 0.72], [0, 0.05, 0.03]), C([0.08, 1.58, 0.62], [0, 0.05, 0.03]), D)} set={{ warm: 0.4 }}
    scene={(tt) => { const f = eio(tt, 3.6, 5.2), kz = eio(tt, 6, 7.4); return <><Counter /><CBoard w={1.6} d={1.2} />
      <group position={[0, 0.082, 0]} rotation={[0, -(PI / 2) * f, 0]}><mesh rotation={[-PI / 2, 0, 0]} castShadow><circleGeometry args={[0.46, 48]} /><meshStandardMaterial map={m} roughness={0.42} /></mesh></group>
      <group position={[0, 0.13 + 0.15 * (1 - cl(tt - 1)), lerp(0.62, -0.6, kz)]}><Box p={[0.5, 0, 0]} s={[0.92, 0.012, 0.09]} c="#d7dce0" m={0.9} r={0.2} /><Box p={[1.15, 0, 0]} s={[0.44, 0.04, 0.09]} c="#2a2a2a" r={0.5} /></group></>; }}
    over={(tt) => <Ink tt={tt} at={3.4} txt="SHE SAID NOTHING" />} />; };

// 6:26 · EL MAZO DE PINCHOS: cada golpe abre agujeros y el jugo se escapa
const spikes: F = ({ t, h }) => { const D = h.out - h.at, H = [[-0.26, -0.1], [0, 0.1], [0.26, -0.08]]; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 1.0, 1.25], [0, 0.1, 0]), C([-0.15, 0.9, 1.05], [0, 0.1, 0]), D)} set={{ warm: 0.35 }}
  scene={(tt) => { const seg = 1.45, i0 = Math.min(2, Math.floor(Math.max(0, tt - 0.7) / seg)), ph = cl((tt - 0.7 - i0 * seg) / seg), dn = Math.sin(ph * PI), [hx, hz] = H[i0]; return <><Counter /><CBoard />
    <Steak p={[0, 0.076, 0]} s={1.05} h={1.3} />
    {H.map(([x, z], n) => { const a = 0.7 + n * seg + seg / 2, k = cl((tt - a) * 2.4); return k > 0 ? <group key={n}>{Array.from({ length: 16 }, (_, j) => <Disc key={j} p={[x + ((j % 4) - 1.5) * 0.045, 0.2, z + (Math.floor(j / 4) - 1.5) * 0.045]} r={0.012} c="#2a0a08" />)}{Array.from({ length: 8 }, (_, j) => { const u = cl((tt - a - j * 0.06) * 0.9), an = j * 0.8; return u > 0 && u < 1 ? <Drop key={"d" + j} c="#b1221a" s={1.3} p={[x + Math.cos(an) * 0.28 * u, 0.22 + 0.28 * Math.sin(PI * u), z + Math.sin(an) * 0.22 * u]} /> : null; })}<Disc p={[x, 0.206, z]} r={0.12 * k} ry={0.8} c="#8e1c15" rough={0.08} /></group> : null; })}
    <group position={[hx, 0.26 + 0.42 * (1 - dn), hz]}><Box p={[0, 0.03, 0]} s={[0.2, 0.05, 0.2]} c="#b6b8bd" m={0.85} r={0.3} />{Array.from({ length: 16 }, (_, j) => <mesh key={j} position={[((j % 4) - 1.5) * 0.045, -0.015, (Math.floor(j / 4) - 1.5) * 0.045]} rotation={[PI, 0, 0]}><coneGeometry args={[0.014, 0.06, 8]} /><meshStandardMaterial color="#c6c8cc" metalness={0.8} roughness={0.3} /></mesh>)}<Cyl p={[0.0, 0.32, 0]} r={0.032} h={0.55} c="#6d4a2c" rough={0.6} /></group></>; }}
  over={(tt) => <Ink tt={tt} at={1.6} txt="THE JUICE ESCAPES" col="#ff9a8a" />} />; };

// 6:50 · DEL CENTRO AL BORDE: la olla pesada recorre en anillos y el bife crece como masa
const dough: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.2, 1.25, 1.1], [0, 0.08, 0]), C([-0.15, 1.15, 0.92], [0, 0.08, 0]), D)} set={{ warm: 0.45 }}
  scene={(tt) => { const k = eio(tt, 0.8, D - 1.6), a = tt * 4.2, R = 0.42 * k; return <><Counter /><CBoard w={1.8} d={1.25} />
    <Steak p={[0, 0.076, 0]} s={lerp(0.68, 1.26, k)} h={lerp(1.8, 0.45, k)} />
    <mesh position={[0, 0.142, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.001, 0.001]} /><meshBasicMaterial color="#ffffff" /></mesh>
    <group position={[R * 1.3 * Math.cos(a), 0.28 + 0.035 * Math.sin(a * 2), R * 0.7 * Math.sin(a)]}><Cyl p={[0, 0, 0]} r={0.2} h={0.24} c="#44413d" m={0.6} rough={0.38} /><Cyl p={[0.33, 0.06, 0]} r={0.018} h={0.3} rot={[0, 0, PI / 2]} c="#2a2826" rough={0.5} /></group>
    {[0.5, 0.75, 1].map((f, i) => <Ring key={i} p={[0, 0.15, 0]} r={0.55 * f} k={cl(k * 3 - i) * (1 - k * 0.4)} col="#ffe2a0" />)}</>; }}
  over={(tt) => <Ink tt={tt} at={2.2} txt="LIKE PIZZA DOUGH" />} />; };

// 7:08 · LAS FAJAS SALTAN: las bandas blancas se abren de a una y las sogas se relajan
const snap: F = ({ t, h }) => { const D = h.out - h.at, Y = [[0, 0], [0.09, 0.08], [-0.09, 0.08], [0.09, -0.08], [-0.09, -0.08]]; return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.3, 0.92, 2.2], [0, 0.46, 0]), C([-0.3, 0.84, 1.95], [0, 0.5, 0]), D)} set={{ warm: 0.4 }}
  scene={(tt) => <><Counter />{Y.map(([z, y], i) => { const k = eio(tt, 2.2, 5.5); return <Rope key={i} p={[0, 0.34 + y * (1 + 1.1 * k), z * (1 + 1.5 * k)]} L={1.9} r={0.072} c={col("#7f2823", "#c0584e", k)} />; })}
    {[-0.66, -0.22, 0.22, 0.66].map((x, i) => { const a = 1.2 + i * 0.8, k = eio(tt, a, a + 0.35); return <group key={i} position={[x, 0.34 + 0.55 * k * k, k * 0.2]} rotation={[0, 0, k * (i % 2 ? 0.5 : -0.5)]}><Band p={[0, 0, 0]} r={0.2 + 0.08 * k} arc={PI * 2 * (1 - 0.45 * k)} w={0.024} /></group>; })}</>}
  over={(tt) => <Ink tt={tt} at={4} txt="THE WHITE STUFF LETS GO" size={74} />} />; };

// 7:59 · NIEVE MOJADA: la media cebolla sube y baja por el rallador y abajo crece la nevada
const wetsnow: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.65, 0.7, 1.35], [0, 0.32, 0]), C([0.3, 0.62, 1.15], [0, 0.3, 0]), D)} set={{ warm: 0.4 }}
  scene={(tt) => { const s = Math.sin(tt * 5), k = eio(tt, 0.8, D - 1.4); return <><Counter /><Bowl p={[0, 0.024, 0.1]} s={2.1} c="#c8cfd6" />
    <Pile p={[0, 0.16, 0.1]} r={lerp(0.1, 0.33, k)} h={lerp(0.02, 0.19, k)} />
    {GL(46, 0.32).map((g, i) => Math.floor(k * 46) > i ? <mesh key={i} position={[g.x, 0.17 + 0.17 * Math.sqrt(Math.max(0, 1 - (g.x * g.x + g.z * g.z) / 0.12)) * k, 0.1 + g.z]}><sphereGeometry args={[0.018, 8, 6]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={0.7} /></mesh> : null)}
    <group position={[0.08, 0.62, -0.08]} rotation={[-0.42, 0, 0]}><Box p={[0, 0, 0]} s={[0.46, 0.58, 0.012]} c="#c8cdd2" m={0.85} r={0.25} />{Array.from({ length: 60 }, (_, i) => <Disc key={i} p={[((i % 10) - 4.5) * 0.04, 0.008 - 0.0, ((Math.floor(i / 10) - 2.5) * 0.08)]} r={0.008} c="#3a3f45" />)}<group position={[0, 0.035 + 0.13 * 0, 0.03 + 0.14 * s]}><OnionHalf p={[0, 0, 0]} s={0.82} rot={[-PI, 0, 0]} /></group></group>
    {Array.from({ length: 18 }, (_, i) => { const u = (tt * 1.3 + rnd(i)) % 1; return <mesh key={i} position={[0.05 + (rnd(i) - 0.5) * 0.2, 0.42 - 0.26 * u, 0.04 + (rnd(i + 2) - 0.5) * 0.12]}><sphereGeometry args={[0.01, 8, 6]} /><meshStandardMaterial color={SNOW} /></mesh>; })}</>; }}
  over={(tt) => <Ink tt={tt} at={2} txt="WET SNOW" />} />; };

// 8:21 · CELDAS: un panal de celdas con perlas; pasa la cuchilla y se revientan
const cells: F = ({ t, h }) => { const D = h.out - h.at, H = useMemo(() => { const a: [number, number][] = []; for (let r = -3; r <= 3; r++) for (let c = -5; c <= 5; c++) a.push([c * 0.215 + (r % 2 ? 0.107 : 0), r * 0.185]); return a; }, []); return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.1, 1.55, 0.78], [0, 0.05, 0.05]), C([-0.1, 1.4, 0.7], [0, 0.05, 0.05]), D)} set={{ warm: 0.3 }}
  scene={(tt) => { const bx = lerp(-1.5, 1.5, eio(tt, 1.7, D - 2)); return <><Box p={[0, 0.012, 0]} s={[3, 0.024, 1.9]} c="#d8c98a" r={0.5} />
    {H.map(([x, z], i) => { const burst = cl((bx - x) * 3); return <group key={i} position={[x, 0.024, z]}>{burst < 1 && <mesh rotation={[-PI / 2, 0, PI / 6]}><ringGeometry args={[0.092, 0.105, 6]} /><meshStandardMaterial color="#f7f0cb" roughness={0.4} /></mesh>}{burst < 0.5 && <mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.078, 16, 12]} /><meshPhysicalMaterial color="#eedf9c" transparent opacity={0.45} roughness={0.05} /></mesh>}
      {Array.from({ length: 5 }, (_, j) => { const u = cl(burst * 1.3 - 0.1), R = 0.03 + u * (0.11 + 0.1 * rnd(i + j)), a = j * 1.25 + i; return <mesh key={j} position={[R * Math.cos(a), 0.04 + 0.02 * j, R * Math.sin(a)]}><sphereGeometry args={[0.014, 8, 6]} /><meshStandardMaterial color="#fff2a8" emissive="#e0b43c" emissiveIntensity={burst * 0.9} /></mesh>; })}</group>; })}
    <Box p={[bx, 0.2, 0]} s={[0.05, 0.3, 1.5]} c="#c8cdd2" m={0.9} r={0.22} /></>; }}
  over={(tt) => <Ink tt={tt} at={2.2} txt="EVERY CELL OPENS" />} />; };

// 8:31 · LOS OBREROS: bolitas diminutas muerden la soga y la dejan llena de huecos
const workers: F = ({ t, h }) => { const D = h.out - h.at, N = 18; return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.2, 0.58, 1.15], [0, 0.3, 0]), C([-0.2, 0.5, 0.95], [0, 0.3, 0]), D)} set={{ warm: 0.35 }}
  scene={(tt) => <><Counter />{Array.from({ length: 34 }, (_, i) => { const x = -0.99 + (i + 0.5) * 0.058, bit = cl((tt - 2 - rnd(i) * (D - 4)) * 2.2) * (rnd(i + 4) > 0.42 ? 1 : 0), R = 0.11 * (1 - 0.72 * bit); return <Cyl key={i} p={[x, 0.3, 0]} r={R} h={0.054} rot={[0, 0, PI / 2]} c={col("#9b3530", "#d0776a", bit)} rough={0.55} />; })}
    {Array.from({ length: N }, (_, i) => { const k = pop(tt, 0.7 + i * 0.09), u = (tt * 0.09 + i / N) % 1, x = -0.95 + 1.9 * u, a = i * 2.4 + tt * 3, chew = 1 + 0.2 * Math.sin(tt * 18 + i); return k > 0.05 ? <group key={i} position={[x, 0.3 + 0.17 * Math.sin(a), 0.17 * Math.cos(a)]} scale={Math.max(0.1, k) * chew}><mesh><sphereGeometry args={[0.042, 16, 12]} /><meshStandardMaterial color="#ffe37a" roughness={0.3} emissive="#b78a10" emissiveIntensity={0.35} /></mesh></group> : null; })}</>}
  over={(tt) => <Ink tt={tt} at={1.3} txt="THEY NIBBLE THE PROTEIN" size={74} />} />; };

// 9:04 · A LA CAMA EN LA NIEVE: cebolla abajo, bife, frazada de cebolla y la puerta de la heladera
const bed: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.3, 0.8, 1.45], [0, 0.18, 0]), C([-0.15, 0.68, 1.2], [0, 0.18, 0]), D)} set={{ warm: 0.3 }}
  scene={(tt) => { const a = eio(tt, 0.6, 2.6), s = eio(tt, 3, 4.6), b = eio(tt, 5, 7.4), d = eio(tt, D - 3.4, D - 2.1); return <><Counter c="#7f6244" /><Disc p={[0, 0.026, 0]} r={0.68} c="#3f5a6e" rough={0.3} /><Pile p={[0, 0.026, 0]} r={0.6 * Math.sqrt(a + 0.05)} h={0.05 * a} />
    <Steak p={[0, lerp(0.8, 0.07, s), 0]} s={0.88} h={0.7} rot={[(1 - s) * 0.3, 0, 0]} />
    {b > 0.02 && <Pile p={[0, 0.125, 0]} r={0.56 * Math.sqrt(b)} h={0.085 * b} />}
    <group position={[-1.5, 0, 1.0]} rotation={[0, (PI / 2) * (1 - d) + 0.0, 0]}><Box p={[1.5, 0.9, 0]} s={[3, 1.8, 0.09]} c="#e8ebec" r={0.35} rad={0.02} op={Math.max(0.02, cl(d * 2))} /></group></>; }}
  over={(tt) => <Ink tt={tt} at={5.2} txt="TO BED IN THE SNOW" />} />; };

// 9:22 · TODA LA NOCHE: el bife ablandado de más se chorrea sobre el plato mientras cruza la luna
const overnight: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.2, 0.68, 1.55], [0, 0.3, 0]), C([-0.15, 0.6, 1.35], [0, 0.3, 0]), D)} set={{ warm: 0.08, spotK: 0.35 }}
  scene={(tt) => { const k = eio(tt, 0.8, D - 2), a = PI * k, wob = 1 + 0.025 * Math.sin(tt * 6) * k; return <><Counter c="#6a5a48" /><Box p={[0, 0.8, -0.7]} s={[3.6, 1.8, 0.05]} c="#1d2a3e" r={0.9} />
    {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[-1.7 + rnd(i) * 3.4, 0.7 + rnd(i + 3) * 1, -0.66]}><sphereGeometry args={[0.009, 6, 6]} /><meshBasicMaterial color="#fff6d9" /></mesh>)}
    <mesh position={[-1.35 * Math.cos(a), 0.65 + 0.85 * Math.sin(a), -0.64]}><sphereGeometry args={[0.12, 20, 14]} /><meshBasicMaterial color="#f0ecd6" toneMapped={false} /></mesh>
    <Disc p={[0, 0.026, 0]} r={0.68} c="#efece4" rough={0.3} /><Disc p={[0, 0.0285, 0]} r={Math.max(0.05, 0.62 * k)} c="#a5625a" rough={0.15} />
    <Steak p={[0, 0.03, 0]} s={lerp(0.9, 1.13, k) * wob} h={lerp(1.2, 0.3, k)} tint={col("#ffffff", "#d1a092", k)} rough={lerp(0.45, 0.15, k)} /></>; }}
  over={(tt) => <>{<Ink tt={tt} at={1} txt="30 MINUTES" col="#bfe6ff" />}{tt > D * 0.62 && <Ink tt={tt} at={D * 0.62} y={130} txt="NOT OVERNIGHT" col="#ff9a8a" />}</>} />; };

// 10:28 · LEJOS DE VOS: el bife cae alejándose, la cortina de aceite salta para el otro lado y las pinzas no lo tocan
const away: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.8, 0.78, 1.3], [0, 0.14, 0]), C([0.45, 0.68, 1.12], [0, 0.14, 0]), D)} set={{ warm: 0.6 }}
  scene={(tt) => { const l = eio(tt, 0.7, 1.8), hv = eio(tt, 3.4, 4.2) * (1 - eio(tt, D - 2.6, D - 1.8)), bk = eio(tt, 5, 5.6); return <><Counter c="#4d4640" /><Pan p={[0, 0.024, 0]} s={1.9} heat={1} />
    <group position={[0, lerp(0.42, 0.175, l), lerp(0.5, 0, l)]} rotation={[lerp(0.75, 0, l), 0, 0]}><Steak p={[0, 0, 0]} s={0.82} h={0.7} tint={col("#ffffff", "#7e4d32", eio(tt, 2, D - 1))} /></group>
    {l > 0.9 && Array.from({ length: 18 }, (_, i) => { const u = cl((tt - 1.8 - i * 0.03) * 1.5), a = -PI * (0.12 + 0.76 * rnd(i)); return u > 0 && u < 1 ? <Drop key={i} c="#e8c25a" s={0.8} p={[Math.cos(a) * 0.55 * u, 0.18 + 0.55 * Math.sin(PI * u), Math.sin(a) * 0.55 * u]} /> : null; })}
    <group position={[0.2, 0.42 + 0.3 * bk + 0.4 * (1 - hv), 0.28]} rotation={[0.5, 0.5, 0]}><Box p={[0, 0, 0.14]} s={[0.022, 0.018, 0.55]} c="#b6bcc1" m={0.85} r={0.25} rot={[0, 0.07, 0]} /><Box p={[0.05, 0, 0.14]} s={[0.022, 0.018, 0.55]} c="#b6bcc1" m={0.85} r={0.25} rot={[0, -0.07, 0]} /></group>
    <Steam p={[0, 0.2, 0]} t={tt} k={l} n={7} s={1.1} /></>; }}
  over={(tt) => <Ink tt={tt} at={3.6} txt="DO NOT TOUCH IT" />} />; };

// 10:44 · ENTRA POR EL COSTADO: la sonda se mete de lado y el mercurio sube hasta 145
const probe: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.2, 0.72, 2.0], [0.06, 0.3, 0]), C([-0.05, 0.66, 1.72], [0.08, 0.32, 0]), D)} set={{ warm: 0.35 }}
  scene={(tt) => { const i = eio(tt, 0.8, 2), k = eio(tt, 2.4, D - 2.4); return <><Counter /><Disc p={[-0.28, 0.026, 0]} r={0.65} c="#efece4" rough={0.3} /><Steak p={[-0.28, 0.035, 0]} s={0.92} h={0.9} tint="#845a3e" />
    <group position={[lerp(1.05, 0.44, i), 0.095, 0]}><Box p={[0.32, 0, 0]} s={[0.92, 0.012, 0.012]} c="#c8cdd2" m={0.9} r={0.22} /></group>
    <group position={[lerp(1.38, 0.82, i), 0.46, 0]}><Cyl p={[0, 0.1, 0]} r={0.045} h={0.88} c="#e9edef" rough={0.1} op={0.5} /><mesh position={[0, -0.36, 0]}><sphereGeometry args={[0.06, 16, 12]} /><meshStandardMaterial color="#d11f1f" /></mesh><Cyl p={[0, -0.32 + 0.33 * k, 0]} r={0.022} h={Math.max(0.01, 0.75 * k)} c="#d11f1f" rough={0.3} />{[0, 1, 2, 3, 4, 5].map((n) => <Box key={n} p={[0.052, -0.2 + n * 0.11, 0.0]} s={[0.03, 0.006, 0.006]} c="#3a3f45" />)}</group></>; }}
  over={(tt) => <Ink tt={tt} at={D - 3.2} x={960} txt="145°F · REST 3 MIN" col="#ffcf55" />} />; };

// 11:20 · EL JUGO VUELVE: corte del bife: las gotas apretadas en el centro se reparten hasta las puntas
const restjuice: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 0.45, 1.45], [0, 0.22, 0]), C([-0.1, 0.4, 1.3], [0, 0.22, 0]), D)} set={{ warm: 0.45 }}
  scene={(tt) => { const k = eio(tt, 2, D - 2); return <><Counter /><Box p={[0, 0.21, 0]} s={[1.65, 0.34, 0.5]} c="#7e4d32" r={0.8} rad={0.07} /><Box p={[0, 0.21, 0.246]} s={[1.5, 0.26, 0.012]} c="#c56863" r={0.5} rad={0.004} />
    {Array.from({ length: 44 }, (_, i) => { const tx = (rnd(i) - 0.5) * 1.4, ty = (rnd(i + 2) - 0.5) * 0.2, x = lerp(tx * 0.16, tx, k), y = lerp(ty * 0.5, ty, k); return <mesh key={i} position={[x, 0.21 + y, 0.262]} scale={[1, 1.3, 0.4]}><sphereGeometry args={[0.026, 12, 10]} /><meshPhysicalMaterial color="#b0151b" roughness={0.05} clearcoat={1} /></mesh>; })}
    <Steam p={[0, 0.4, 0]} t={tt} k={1 - k * 0.6} n={4} s={0.7} /></>; }}
  over={(tt) => <Ink tt={tt} at={2.4} txt="THREE MINUTES. DON'T CUT." />} />; };

// 11:33 · EL FONDO DE LA SARTÉN: la manteca derrite y levanta los puntitos dorados
const fond: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.15, 1.3, 0.85], [0, 0.08, 0]), C([-0.1, 1.15, 0.72], [0, 0.08, 0]), D)} set={{ warm: 0.6 }}
  scene={(tt) => { const m = eio(tt, 2.4, D - 1.5), bx = lerp(0.05, 0, m); return <><Counter c="#4d4640" /><Pan p={[0, 0.024, 0]} s={1.95} heat={0.5} />
    <Disc p={[0, 0.195, 0]} r={Math.max(0.02, 0.72 * m)} c="#e2b04a" rough={0.08} />
    {GL(80, 0.7).map((g, i) => <mesh key={i} position={[g.x, 0.2 + 0.028 * m * Math.sin(tt * 3 + i), g.z]} rotation={[g.a, g.a, 0]}><dodecahedronGeometry args={[0.011 + 0.014 * rnd(i)]} /><meshStandardMaterial color="#5e2f12" roughness={0.55} emissive="#c47a2a" emissiveIntensity={m * 0.55} /></mesh>)}
    <Box p={[bx, 0.23, 0]} s={[Math.max(0.05, 0.24 * (1 - m)), Math.max(0.02, 0.12 * (1 - m * 0.9)), Math.max(0.05, 0.16 * (1 - m))]} c="#f2d26a" r={0.35} rad={0.012} /></>; }}
  over={(tt) => <Ink tt={tt} at={1} txt="DON'T WASH IT" col="#ffcf55" />} />; };

// 12:06 · COMO TORTA: el cuchillo baja sin apoyar fuerza y la feta se recuesta
const cake: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.42, 0.58, 1.15], [0, 0.18, 0]), C([0.05, 0.5, 0.95], [0, 0.18, 0]), D)} set={{ warm: 0.55 }}
  scene={(tt) => { const a = eio(tt, 1, 2.1), f = eio(tt, 2.4, 3.2); return <><Counter /><Disc p={[0, 0.026, 0]} r={0.66} c="#efece4" rough={0.3} /><group position={[-0.1, 0.13, 0]}><Box p={[0, 0, 0]} s={[0.78, 0.17, 0.46]} c="#80492d" r={0.8} rad={0.05} /><Box p={[0.392, 0, 0]} s={[0.012, 0.13, 0.4]} c="#c66b65" r={0.5} /></group>
    <group position={[0.43, 0.05, 0]} rotation={[0, 0, -f * 1.15]}><group position={[0, 0.08, 0]}><Box p={[-0.01, 0, 0]} s={[0.1, 0.17, 0.46]} c="#80492d" r={0.8} rad={0.045} /><Box p={[0.043, 0, 0]} s={[0.012, 0.13, 0.4]} c="#d0726c" r={0.5} /></group></group>
    <Disc p={[0.65, 0.028, 0]} r={0.05 + 0.1 * f} c="#5b2f12" rough={0.1} />
    <group position={[0.3, lerp(0.62, 0.26, a), 0]} rotation={[0, 0, 0]}><Box p={[0, 0, 0]} s={[0.012, 0.32, 0.72]} c="#d7dce0" m={0.9} r={0.2} /><Box p={[0, 0.2, 0.52]} s={[0.03, 0.08, 0.34]} c="#2a2a2a" r={0.5} /></group></>; }}
  over={(tt) => <Ink tt={tt} at={2.6} txt="A PIECE OF CAKE" />} />; };

// 12:42 · EL ARROZ QUE LE CRECE PELUSA: granos con pelusa blanca que se multiplica
const koji: F = ({ t, h }) => { const D = h.out - h.at, gh = useMemo(() => new THREE.CylinderGeometry(0.0012, 0.003, 1, 5).translate(0, 0.5, 0), []); return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.2, 0.42, 0.72], [0, 0.17, 0]), C([-0.15, 0.36, 0.6], [0, 0.17, 0]), D)} set={{ warm: 0.3 }}
  scene={(tt) => { const k = eio(tt, 0.9, D - 2); return <><Counter c="#3e3a35" />{Array.from({ length: 9 }, (_, i) => { const x = -0.34 + (i % 3) * 0.34, z = -0.16 + Math.floor(i / 3) * 0.17, a = i * 1.4; return <group key={i} position={[x, 0.15 + 0.02 * rnd(i), z]} rotation={[0, a, 1.4]}><mesh scale={[1, 1.95, 1]} castShadow><sphereGeometry args={[0.065, 18, 14]} /><meshPhysicalMaterial color="#efe6d2" roughness={0.4} clearcoat={0.2} /></mesh>{Array.from({ length: 44 }, (_, j) => { const e = (j * 2.4) % 6.28, v = rnd(j + i) * PI; const nx = Math.sin(v) * Math.cos(e), ny = Math.cos(v), nz = Math.sin(v) * Math.sin(e), L = 0.012 + 0.09 * k * rnd(j * 3); return <mesh key={j} geometry={gh} position={[nx * 0.062, ny * 0.122, nz * 0.062]} rotation={[nz * 1.5, 0, -nx * 1.5]} scale={[1, Math.max(0.002, L), 1]}><meshStandardMaterial color="#fbfaf2" roughness={1} /></mesh>; })}</group>; })}</>; }}
  over={(tt) => <Ink tt={tt} at={1.2} txt="A HELPFUL MOLD" />} />; };

// 13:30 · LA PERA: un poco rallada abajo y el bife se relaja un poquito, con la cucharita medida
const pear: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.25, 0.78, 1.25], [0, 0.18, 0]), C([-0.1, 0.65, 1.05], [0, 0.18, 0]), D)} set={{ warm: 0.45 }}
  scene={(tt) => { const s = eio(tt, 1.2, 3), sp = eio(tt, 3.2, 4), dp = cl((tt - 4) * 1.8); return <><Counter c="#d9cdb6" /><group position={[0.62, 0.024, -0.08]}><mesh position={[0, 0.17, 0]} scale={[1, 1.08, 1]} castShadow><sphereGeometry args={[0.17, 24, 16]} /><meshStandardMaterial color="#c9c24d" roughness={0.45} /></mesh><mesh position={[0, 0.37, 0]} scale={[0.74, 1, 0.74]}><sphereGeometry args={[0.1, 20, 14]} /><meshStandardMaterial color="#c9c24d" roughness={0.45} /></mesh><Cyl p={[0, 0.5, 0]} r={0.01} h={0.1} c="#5e3d1d" rough={0.8} /></group>
    <Steak p={[-0.28, 0.03, 0]} s={0.9} h={lerp(1.3, 0.75, s)} />{dp > 0 && <Pile p={[-0.28, 0.13, 0]} r={0.22 * dp} h={0.03 * dp} c="#efe8a8" />}
    <group position={[lerp(0.3, -0.26, sp), 0.48 - 0.1 * sp, 0]} rotation={[0, 0, 0.5 * dp]}><mesh scale={[1, 0.4, 0.7]}><sphereGeometry args={[0.075, 20, 12, 0, PI * 2, PI / 2, PI / 2]} /><meshStandardMaterial color="#c8cdd2" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} /></mesh><Box p={[0.3, 0.02, 0]} s={[0.46, 0.01, 0.024]} c="#c8cdd2" m={0.9} r={0.2} /></group></>; }}
  over={(tt) => <Ink tt={tt} at={3.6} txt="JUST A LITTLE" />} />; };

// 13:56 · EL KIWI: media fruta sobre el bife y el borde se empieza a desarmar en menos de una hora
const kiwi: F = ({ t, h }) => { const D = h.out - h.at, seeds = useMemo(() => Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * PI * 2; return { a, r: 0.055 + rnd(i) * 0.03 }; }), []); return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 1.05, 1.1], [0, 0.1, 0]), C([-0.12, 0.92, 0.95], [0, 0.1, 0]), D)} set={{ warm: 0.4 }}
  scene={(tt) => { const pl = eio(tt, 0.7, 1.8), k = eio(tt, 2.2, D - 1.5); return <><Counter c="#d9cdb6" />
    <Steak p={[0, 0.03, 0]} s={1.08} h={1.0} tint={col("#ffffff", "#dcae9f", k)} />
    {Array.from({ length: 70 }, (_, i) => { const a = i * 0.0898, u = k * 1.05 - rnd(i) * 0.6; if (u <= 0) return null; const R = 0.6 + 0.08 * Math.sin(a * 3 + 0.8), x = R * Math.cos(a) * 0.98, z = R * 0.64 * Math.sin(a) * 0.98 + 0.0; return <mesh key={i} position={[x * (1 + u * 0.12), 0.05, z * (1 + u * 0.12)]} scale={[1, Math.max(0.15, 0.55 - u * 0.3), 1]}><sphereGeometry args={[0.035 + 0.03 * rnd(i + 4), 12, 10]} /><meshStandardMaterial color={col("#b35a50", "#d6b09a", u)} roughness={0.6} /></mesh>; })}
    <group position={[0, lerp(0.75, 0.25, pl), 0]} rotation={[0, tt * 0.2, 0]}><mesh rotation={[PI, 0, 0]} castShadow><sphereGeometry args={[0.2, 30, 16, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#8a6a3a" roughness={0.9} /></mesh><Disc p={[0, 0.002, 0]} r={0.194} c="#8abf3a" rough={0.2} /><Disc p={[0, 0.0035, 0]} r={0.05} c="#e8efb4" rough={0.3} />{seeds.map((s, i) => <mesh key={i} position={[s.r * Math.cos(s.a), 0.006, s.r * Math.sin(s.a)]} rotation={[-PI / 2, 0, s.a]} scale={[0.5, 1, 1]}><circleGeometry args={[0.008, 10]} /><meshBasicMaterial color="#141310" /></mesh>)}</group></>; }}
  over={(tt) => <Ink tt={tt} at={2.4} txt="MUSH IN UNDER AN HOUR" col="#ff9a8a" size={74} />} />; };

// 14:35 · TRES EN LA SARTÉN: apretados, el agua sube entre ellos y se están hirviendo
const crowded: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.15, 1.25, 1.0], [0, 0.08, 0]), C([-0.12, 1.1, 0.82], [0, 0.08, 0]), D)} set={{ warm: 0.45 }}
  scene={(tt) => { const k = eio(tt, 1.2, D - 2); return <><Counter c="#4d4640" /><Pan p={[0, 0.024, 0]} s={1.95} heat={lerp(1, 0.08, k)} />
    {[[-0.28, -0.26, 0.35], [0.3, -0.16, -0.5], [0, 0.32, 0.1]].map(([x, z, r], i) => <Steak key={i} p={[x, 0.2, z]} s={0.62} h={0.95} rot={[0, r, 0]} tint={col("#ffffff", "#b6948b", k)} />)}
    {k > 0.02 && <Disc p={[0, 0.214, 0]} r={0.72 * Math.sqrt(k)} c="#9f8373" rough={0.05} />}
    {Array.from({ length: 28 }, (_, i) => { const u = (tt * 0.9 + rnd(i)) % 1, a = i * 2.4, R = 0.1 + 0.6 * rnd(i + 2); return k > 0.25 ? <mesh key={i} position={[R * Math.cos(a), 0.225 + 0.02 * u, R * Math.sin(a)]} scale={0.4 + u}><sphereGeometry args={[0.022, 12, 10]} /><meshPhysicalMaterial color="#f7f2e2" transparent opacity={(1 - u) * 0.85} roughness={0.04} /></mesh> : null; })}
    <Steam p={[0, 0.26, 0]} t={tt} k={k} n={9} s={1.6} /></>; }}
  over={(tt) => <Ink tt={tt} at={2.6} txt="BOILING YOUR DINNER" />} />; };

// 15:10 · LA INUNDACIÓN: el corte apurado y el jugo cruza el plato mientras el bife se seca
const flood: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 1.2, 0.95], [0, 0.06, 0]), C([-0.1, 1.05, 0.8], [0, 0.06, 0]), D)} set={{ warm: 0.4 }}
  scene={(tt) => { const k = eio(tt, 1.0, D - 1.8); return <><Counter /><Disc p={[0, 0.026, 0]} r={0.86} c="#efece4" rough={0.3} /><Disc p={[0, 0.029, 0]} r={Math.max(0.05, 0.82 * k)} c="#8e1c15" rough={0.06} />
    <Steak p={[-0.27, 0.03 + 0.012, 0]} s={0.66} h={lerp(1.3, 0.7, k)} tint={col("#7d4a30", "#5e3d2e", k)} /><group position={[0.28, 0.04, 0]}><Steak p={[0, 0, 0]} s={0.66} h={lerp(1.3, 0.7, k)} tint={col("#a05840", "#7c5a4a", k)} /></group></>; }}
  over={(tt) => <Ink tt={tt} at={2.2} txt="A DRY STEAK IN A PUDDLE" size={74} />} />; };

// 15:41 · LA CENA SEGÚN EL CARTEL: tablillas que dan vuelta con la hora y la mesa se va armando
const flaps: F = ({ t, h }) => { const D = h.out - h.at, T = ["5:40", "6:00", "6:05"], M = useMemo(() => T.map((x) => cardTex([x], { bg: "#1f1d1b", fg: "#f6efdb", h: 300, w: 512 })), []); return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.15, 1.05, 2.45], [0, 0.6, -0.1]), C([-0.15, 0.96, 2.2], [0, 0.6, -0.1]), D)} set={{ warm: 0.5 }}
  scene={(tt) => { const a = [0.8, D * 0.36, D * 0.66], idx = tt > a[2] ? 2 : tt > a[1] ? 1 : 0, fp = cl((tt - a[idx]) * 2.2); return <><Counter /><Wall /><group position={[0, 0.98, -0.7]} rotation={[lerp(idx ? PI / 2 : PI / 2, 0, fp), 0, 0]}><mesh><planeGeometry args={[0.95, 0.55]} /><meshBasicMaterial map={M[idx]} toneMapped={false} /></mesh></group>
    <Pop k={Math.max(0.05, pop(tt, a[0] + 0.6))} p={[-0.62, 0.024, 0.2]}><Cyl p={[0, 0.13, 0]} r={0.22} r2={0.2} h={0.26} c="#3f3d3a" m={0.55} rough={0.4} /><Cyl p={[0, 0.27, 0]} r={0.23} h={0.03} c="#3f3d3a" m={0.55} rough={0.4} /><Steam p={[0, 0.3, 0]} t={tt} n={4} s={0.8} /></Pop>
    <Pop k={Math.max(0.05, pop(tt, a[1] + 0.6))} p={[0, 0.024, 0.28]}><Pan p={[0, 0, 0]} s={1} heat={0.9} /><Steak p={[0, 0.1, 0]} s={0.55} h={0.8} tint="#a26a4a" /><Steam p={[0, 0.16, 0]} t={tt + 2} n={4} s={0.8} /></Pop>
    <Pop k={Math.max(0.05, pop(tt, a[2] + 0.6))} p={[0.66, 0.024, 0.2]}><Disc p={[0, 0.006, 0]} r={0.3} c="#efece4" rough={0.3} /><Steak p={[0, 0.012, 0]} s={0.42} h={0.8} tint="#7e4d32" /></Pop></>; }}
  over={(tt) => <Ink tt={tt} at={D - 2.4} txt="ONE PAN" />} />; };

// 15:59 · LA CAJA CONTRA LA CEBOLLA: la cebolla sale rodando de la canasta y saca la caja de la mesa
const basket: F = ({ t, h }) => { const D = h.out - h.at, roll = 4.3; return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.25, 0.68, 2.0], [0.05, 0.3, 0]), C([-0.2, 0.62, 1.82], [0.05, 0.3, 0]), D)} set={{ warm: 0.55 }}
  scene={(tt) => { const u = eio(tt, roll, roll + 1.1), oX = lerp(-0.52, 0.42, u), hit = cl((tt - roll - 1.0) * 1.7), bx = 0.58 + hit * 0.82, by = 0.36 - hit * hit * 0.9; return <><Counter /><Wall />
    <group position={[-0.78, 0.02, 0]}><Cyl p={[0, 0.16, 0]} r={0.32} r2={0.25} h={0.28} c="#a9794a" rough={0.9} />{[0.06, 0.13, 0.2, 0.27].map((y, i) => <mesh key={i} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.28 + y * 0.14, 0.011, 8, 40]} /><meshStandardMaterial color="#8b5f35" roughness={0.9} /></mesh>)}<mesh position={[0.02, 0.33, 0]} castShadow><sphereGeometry args={[0.18, 22, 16]} /><meshStandardMaterial color="#c79b4a" roughness={0.4} /></mesh></group>
    <group position={[oX, 0.2, 0]} rotation={[0, 0, -u * 7]}><mesh castShadow scale={[1, 0.92, 1]}><sphereGeometry args={[0.175, 24, 18]} /><meshStandardMaterial color="#c8a050" roughness={0.42} /></mesh><Box p={[0, 0.17, 0]} s={[0.018, 0.08, 0.018]} c="#8b6a2d" r={0.8} /></group>
    {by > -0.2 && <SodaBox p={[bx, Math.max(0.22, by), 0]} rot={[0, -0.2, -hit * 1.5]} s={1.1} />}</>; }}
  over={(tt) => <Ink tt={tt} at={1.2} txt="AN ONION IN THE BASKET" size={74} />} />; };

// 17:22 · AL AIRE SE PONE ROJO: se despega el film y el morado se enciende
const purple: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.2, 1.1, 1.05], [0, 0.08, 0]), C([-0.12, 1.0, 0.85], [0, 0.08, 0]), D)} set={{ warm: 0.25 }}
  scene={(tt) => { const f = eio(tt, 1.5, 3.3), k = eio(tt, 3, D - 1.5); return <><Counter /><Box p={[0, 0.05, 0]} s={[1.5, 0.07, 1.05]} c="#efeeea" r={0.4} rad={0.02} />
    <Steak p={[0, 0.082, 0]} s={1.06} h={1.05} tint={col("#7a4f88", "#ffffff", k)} />
    <group position={[-0.74, 0.17, 0]} rotation={[0, 0, f * 1.9]}><mesh position={[0.72, 0, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.44, 1]} /><meshPhysicalMaterial color="#eef7fb" transparent opacity={0.28} roughness={0.08} /></mesh></group></>; }}
  over={(tt) => <>{<Ink tt={tt} at={0.8} txt="PURPLE IS FINE" col="#d7b3ef" />}{tt > 4.2 && <Ink tt={tt} at={4.2} y={130} txt="IT JUST NEEDS AIR" col="#ffb0a3" size={72} />}</>} />; };

// 17:49 · DE CEBOLLA A POLVO: se arruga, se encoge y termina en un tarrito; los obreros no sobreviven
const powder: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.15, 0.55, 1.25], [0, 0.26, 0]), C([-0.15, 0.5, 1.05], [0, 0.26, 0]), D)} set={{ warm: 0.6 }}
  scene={(tt) => { const k = eio(tt, 0.9, 5.2), dust = eio(tt, 4.8, 6.4); return <><Counter c="#d9cdb6" /><group position={[-0.28, 0.024 + lerp(0.22, 0.05, k), 0]} scale={[lerp(1, 0.35, k), lerp(1, 0.22, k) * (1 + 0.04 * Math.sin(tt * 9) * k), lerp(1, 0.35, k)]}><mesh castShadow><sphereGeometry args={[0.22, 28, 20]} /><meshStandardMaterial color={col("#c9a050", "#7a5a2e", k)} roughness={lerp(0.4, 1, k)} /></mesh></group>
    {Array.from({ length: 12 }, (_, i) => { const u = (tt * 0.5 + i / 12) % 1; return k < 0.9 ? <Drop key={i} s={0.8} op={(1 - k) * Math.sin(PI * u)} p={[-0.28 + 0.2 * Math.cos(i * 2.4), 0.3 + 0.55 * u, 0.2 * Math.sin(i * 2.4)]} /> : null; })}
    <Cyl p={[0.42, 0.21, 0]} r={0.14} h={0.38} c="#efeae0" rough={0.15} op={0.34} /><Cyl p={[0.42, 0.04 + 0.135 * dust, 0]} r={0.128} h={Math.max(0.01, 0.27 * dust)} c="#cdbb8a" rough={1} /><Cyl p={[0.42, 0.42, 0]} r={0.145} h={0.05} c="#b74a2c" rough={0.45} />
    {Array.from({ length: 30 }, (_, i) => { const u = cl((tt - 4.6 - i * 0.04) / 0.8); return u > 0 && u < 1 ? <mesh key={i} position={[lerp(-0.28, 0.42, u), 0.12 + 0.48 * Math.sin(PI * u), (rnd(i) - 0.5) * 0.1]}><sphereGeometry args={[0.008, 6, 6]} /><meshStandardMaterial color="#cdbb8a" /></mesh> : null; })}</>; }}
  over={(tt) => <Ink tt={tt} at={3} txt="THE WORKERS DON'T SURVIVE" size={74} />} />; };

// 18:22 · EL LÁPIZ: un lápiz al lado de la feta y las dos alturas se igualan
const pencil: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.35, 0.3, 1.05], [0.1, 0.1, 0]), C([0.1, 0.22, 0.8], [0.1, 0.09, 0]), D)} set={{ warm: 0.5 }}
  scene={(tt) => { const k = pop(tt, 1.4), h0 = 0.054; return <><Counter /><CBoard p={[0.05, 0.05, 0]} /><Steak p={[-0.05, 0.076, 0]} s={0.88} h={0.65} />
    <group position={[0.1, 0.076 + 0.027, 0.42]} rotation={[0, 0, PI / 2]} scale={Math.max(0.1, k)}><Cyl p={[0, 0, 0]} r={h0 / 2} h={1} c="#f2c31b" rough={0.45} seg={6} /><mesh position={[0, 0.54, 0]}><coneGeometry args={[h0 / 2, 0.09, 12]} /><meshStandardMaterial color="#e3c090" roughness={0.6} /></mesh><Cyl p={[0, -0.52, 0]} r={h0 / 2} h={0.05} c="#d68f8a" rough={0.5} /></group></>; }}
  over={(tt) => <Ink tt={tt} at={2.4} txt="THIS THICK" />} />; };

// 19:31 · EL FLAN QUE NO CUAJA: dos tazas se inclinan; una aguanta y la otra se derrama
const custard: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 0.65, 1.55], [0, 0.26, 0]), C([-0.12, 0.6, 1.4], [0, 0.26, 0]), D)} set={{ warm: 0.5 }}
  scene={(tt) => { const tilt = eio(tt, 3.2, 4.6) * 0.72, sp = cl((tt - 4.4) / 1.8), Cup: React.FC<{ x: number; set: boolean }> = ({ x, set }) => <group position={[x, 0.024, 0]} rotation={[0, 0, tilt]}><Cyl p={[0, 0.15, 0]} r={0.2} r2={0.16} h={0.3} c="#2f3f5a" rough={0.2} /><Disc p={[0, 0.302, 0]} r={0.178} c={set ? "#ecd28a" : "#e9cf7a"} rough={set ? 0.55 : 0.05} /></group>; return <><Counter c="#d9cdb6" /><Cup x={-0.44} set /><Cup x={0.44} set={false} />
    {Array.from({ length: 22 }, (_, i) => { const u = cl(sp * 1.6 - i * 0.04); return u > 0 ? <Drop key={i} c="#e9cf7a" s={1.6} op={1} p={[0.44 + 0.2 + 0.05 * u, 0.26 - 0.2 * u * u, -0.06 + 0.006 * i]} /> : null; })}<Disc p={[0.74, 0.027, 0]} r={Math.max(0.02, 0.28 * sp)} ry={0.8} c="#e9cf7a" rough={0.05} />
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[0.44 + 0.08 * Math.cos(i * 2), 0.335, 0.08 * Math.sin(i * 2)]} scale={[1.4, 0.3, 0.9]}><sphereGeometry args={[0.02, 8, 6]} /><meshStandardMaterial color="#574030" /></mesh>).slice(0, tt < 3.2 ? 12 : 0)}</>; }}
  over={(tt) => <>{<Ink tt={tt} at={1.2} x={510} txt="SET" />}{<Ink tt={tt} at={1.8} x={1400} txt="+ MAITAKE" col="#ffcf55" />}</>} />; };

// 20:03 · COMO PAPEL MOJADO: las pinzas levantan el bife y se deshace en tiras
const wetpaper: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.25, 0.92, 2.25], [0, 0.46, 0]), C([-0.1, 0.86, 2.0], [0, 0.48, 0]), D)} set={{ warm: 0.3 }}
  scene={(tt) => { const up = eio(tt, 2.1, 3.4), fall = cl(tt - 3.3), n = 9; return <><Counter /><Disc p={[0, 0.026, 0]} r={0.62} c="#efece4" rough={0.3} />
    {Array.from({ length: n }, (_, i) => { const x = -0.4 + (i * 0.8) / (n - 1), a = 3.3 + rnd(i) * 1.8, f = cl((tt - a) / 0.75), y = lerp(0.05, 0.6, up) * (1 - f * f) + 0.04 * f - 0.05 * Math.abs(x) * up, sw = Math.sin(tt * 3 + i) * 0.025 * up; return <group key={i} position={[x + sw, y, (rnd(i + 3) - 0.5) * f * 0.3]} rotation={[0, 0, (i % 2 ? 0.4 : -0.4) * up * (1 - f * 0.5) + f * rnd(i)]}><Box p={[0, 0, 0]} s={[0.085, lerp(0.05, 0.3, up * (1 - f)), 0.34]} c={col("#a63a33", "#b2776b", 0.4 + rnd(i) * 0.4)} r={0.5} rad={0.018} /></group>; })}
    <group position={[0, lerp(1.0, 0.82, up) + (1 - cl(tt - 1)) * 0.5, 0]}><Box p={[-0.05, 0, 0]} s={[0.02, 0.5, 0.05]} c="#b6bcc1" m={0.85} r={0.25} rot={[0, 0, 0.1]} /><Box p={[0.05, 0, 0]} s={[0.02, 0.5, 0.05]} c="#b6bcc1" m={0.85} r={0.25} rot={[0, 0, -0.1]} /></group></>; }}
  over={(tt) => <Ink tt={tt} at={3.8} txt="LIKE WET PAPER" />} />; };

// 21:19 · UNA SOLA VEZ: los palitos alzan una feta tierna y la mesa queda quieta; lo que sigue es la mirada
const onenod: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.2, 0.8, 1.85], [0, 0.34, 0]), C([-0.05, 0.76, 1.55], [0, 0.38, 0]), D)} set={{ warm: 0.65, spotK: 0.42 }}
  scene={(tt) => { const up = eio(tt, 1, 3.4), nod = eio(tt, D - 4, D - 3.5) * (1 - eio(tt, D - 3.5, D - 3)); return <><Counter c="#4a3e30" /><Disc p={[0, 0.026, 0]} r={0.56} c="#efece4" rough={0.3} /><Steak p={[0.04, 0.03, 0.02]} s={0.54} h={0.65} tint="#7e4d32" /><Bowl p={[-0.78, 0.024, 0.16]} s={1.15} />
    <group position={[0.04, lerp(0.09, 0.62, up) - 0.05 * nod, 0.05]} rotation={[0.1, 0, 0]}><Box p={[0, -0.06, 0]} s={[0.2, 0.15, 0.022]} c="#83493a" r={0.5} rad={0.009} /><Box p={[0, -0.135, 0]} s={[0.15, 0.04, 0.02]} c="#83493a" r={0.5} rad={0.009} /></group>
    <Sticks p={[0.13, lerp(0.1, 0.58, up) - 0.05 * nod, 0.05]} rot={[0.02, 0, 0.3]} s={1.2} />
    <Steam p={[0.04, 0.2, 0.05]} t={tt} n={4} s={0.7} k={0.6} /></>; }}
  over={(tt) => <Ink tt={tt} at={D - 3.2} txt="HE NODDED. ONCE." />} />; };

// CUADRO 0 = la miniatura sin texto: bife marmolado enorme, caja de bicarbonato a la derecha, polvo en la tabla
export const Cover0: React.FC = () => <Hero t={0.5} h={{ k: "c0", at: -5, out: 99 }} mode="iris" cam={() => C([0, 0.68, 1.42], [0.05, 0.16, 0])} set={{ warm: 0.55 }}
  scene={() => <><Counter c="#6b4a2c" /><CBoard w={2} d={1.2} /><Steak p={[-0.2, 0.076, 0.03]} s={1.32} h={1.5} />
    {Array.from({ length: 90 }, (_, i) => <mesh key={i} position={[0.45 + rnd(i) * 0.4, 0.08, (rnd(i + 2) - 0.5) * 0.7]}><sphereGeometry args={[0.007 + 0.006 * rnd(i + 4), 8, 6]} /><meshStandardMaterial color="#ffffff" /></mesh>)}<SodaBox p={[0.78, 0.31, -0.08]} rot={[0, -0.22, 0]} s={1.15} /></>} />;

export const HC: Record<string, F> = { soapbite, fourteeth, maitake, squeeze, mushy, ropes, opera, pound, vitrine, celery, quarter, spikes, dough, snap, wetsnow, cells, workers, bed, overnight, away, probe, restjuice, fond, cake, koji, pear, kiwi, crowded, flood, flaps, basket, purple, powder, pencil, custard, wetpaper, onenod };
