// sk8pa · componentes ÚNICOS del video del arroz frío (uno por minuto; ver D:/rtmp/premium8n_sachiko_COMPONENTES.md).
// Maqueta sobre la mesada (hk.tsx). Cada uno = UNA idea con un objeto que se entiende sin leer. Nada de random sin semilla ni escala 0.
import React, { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { F, Hero, C, lerp, pop, Pop, Ink, cardTex, Coin, Pan, Bowl, Dial, Ring, Sticks, Sachi, PZ, cl, eio, orbita, Box, Cyl, V } from "./hk";

const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const RICE = "#e9e3d3", GOLD = "#e0a53a", SOY = "#3a2212", YOLK = "#f4b81f", RED = "#d9392b";

const Grain: React.FC<{ p: V; s?: number; c?: string; rot?: V; e?: string; ei?: number; sq?: number }> = ({ p, s = 1, c = RICE, rot = [0, 0, 0], e = "#000000", ei = 0, sq = 1 }) =>
  <mesh position={p} rotation={rot} scale={[s * (2 - sq), s * 1.9, s * sq]} castShadow><sphereGeometry args={[0.05, 18, 12]} /><meshPhysicalMaterial color={c} roughness={0.42} clearcoat={0.25} emissive={e} emissiveIntensity={ei} /></mesh>;
const MP = Array.from({ length: 210 }, (_, i) => { const y = 0.06 + 0.92 * ((i + 0.5) / 210), R = Math.sqrt(1 - y * y), a = i * 2.39996; return { x: R * Math.cos(a), y, z: R * Math.sin(a), r: [rnd(i) * 6, rnd(i + 3) * 6, rnd(i + 7) * 6] as V }; });
const Mound: React.FC<{ p: V; r?: number; y?: number; c?: string; e?: string; ei?: number }> = ({ p, r = 0.3, y = 0.7, c = RICE, e = "#000000", ei = 0 }) => {
  const geo = useMemo(() => new THREE.SphereGeometry(0.05, 10, 7), []), mat = useMemo(() => new THREE.MeshPhysicalMaterial({ roughness: 0.42, clearcoat: 0.2 }), []);
  mat.color.set(c); mat.emissive.set(e); mat.emissiveIntensity = ei; const g = 0.21 / r;
  return <group position={p} scale={[r, r * y, r]}>
    <mesh scale={0.965} castShadow><sphereGeometry args={[1, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={col(c, "#6b6152", 0.22)} roughness={0.8} emissive={e} emissiveIntensity={ei} /></mesh>
    {MP.map((m, i) => <mesh key={i} geometry={geo} material={mat} position={[m.x, m.y, m.z]} rotation={m.r} scale={[g, g * 2.1, g]} />)}
  </group>; };
let _soft: THREE.Texture | null = null;
const softTex = () => { if (_soft) return _soft; const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d")!, g = x.createRadialGradient(64, 64, 2, 64, 64, 63); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.45, "rgba(255,255,255,.42)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 128, 128); _soft = new THREE.CanvasTexture(c); return _soft; };
// puntos: GTAOPass oculta Points/Lines (un plano o sprite transparente deja un recuadro en la pasada AO)
const Puff: React.FC<{ p: V; r: number; c?: string; op?: number }> = ({ p, r, c = "#efeae0", op = 0.5 }) => { const cam = useThree((x) => x.camera) as THREE.PerspectiveCamera; const size = (2 * r) / Math.tan((cam.fov * Math.PI) / 360); const geo = useMemo(() => new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3)), []); return <points position={p} geometry={geo} renderOrder={5}><pointsMaterial map={softTex()} color={c} size={size} sizeAttenuation transparent opacity={op} depthWrite={false} toneMapped={false} /></points>; };
const Steam: React.FC<{ p: V; t: number; k?: number; n?: number; s?: number }> = ({ p, t, k = 1, n = 6, s = 1 }) => k < 0.02 ? null : <>{Array.from({ length: n }, (_, i) => { const u = (t * 0.33 + i / n) % 1; return <Puff key={i} p={[p[0] + 0.05 * s * (1 + 2 * u) * Math.sin(i * 2.4 + t * 0.7), p[1] + u * 0.72 * s, p[2] + 0.05 * s * Math.cos(i * 1.7 + t * 0.5)]} r={(0.07 + 0.17 * u) * s} op={0.3 * k * Math.sin(Math.PI * u)} />; })}</>;
const halfGeo = (sg: number) => { const R = 0.24, h = new THREE.Shape(); h.moveTo(0, R); h.lineTo(sg * R * 0.92, -R * 0.62); h.lineTo(0, -R * 0.62); h.closePath(); return new THREE.ExtrudeGeometry(h, { depth: 0.09, bevelEnabled: true, bevelSize: 0.022, bevelThickness: 0.022, bevelSegments: 4 }); };
const triGeo = () => { const s = new THREE.Shape(); const R = 0.2, n = 3; for (let i = 0; i < n; i++) { const a = Math.PI / 2 + (i * 2 * Math.PI) / n, x = R * Math.cos(a), y = R * Math.sin(a); if (i === 0) s.moveTo(x, y); else s.lineTo(x, y); } s.closePath(); const g = new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.04, bevelSegments: 6, curveSegments: 12 }); g.center(); return g; };
const Tri: React.FC<{ p: V; s?: number; rot?: V; c?: string }> = ({ p, s = 1, rot = [0, 0, 0], c = "#d9a35a" }) => { const g = useMemo(triGeo, []); return <mesh geometry={g} position={p} rotation={rot} scale={s} castShadow><meshPhysicalMaterial color={c} roughness={0.55} clearcoat={0.3} /></mesh>; };
const Plate: React.FC<{ p: V; r?: number; c?: string }> = ({ p, r = 0.42, c = "#d9d4c7" }) => <Cyl p={[p[0], p[1] + 0.012, p[2]]} r={r} r2={r * 0.82} h={0.024} c={c} rough={0.3} />;
const Glow: React.FC<{ p: V; r: number; c?: string; op?: number }> = ({ p, r, c = "#ffd77a", op = 0.9 }) => <mesh position={p}><sphereGeometry args={[r, 18, 12]} /><meshBasicMaterial color={c} transparent opacity={op} toneMapped={false} /></mesh>;
const Halo: React.FC<{ p: V; r: number }> = ({ p, r }) => <><Glow p={p} r={r * 0.5} c="#ffc53a" op={1} /><Puff p={p} r={r * 3.2} c="#ffb52a" op={0.85} /></>;
const Drop: React.FC<{ p: V; s?: number; c?: string; op?: number }> = ({ p, s = 1, c = "#9fd4ff", op = 0.8 }) => <mesh position={p} scale={[s, s * 1.3, s]}><sphereGeometry args={[0.022, 12, 10]} /><meshStandardMaterial color={c} transparent opacity={op} roughness={0.05} /></mesh>;
const Lacquer: React.FC<{ w?: number; d?: number }> = ({ w = 1.5, d = 0.9 }) => <Box p={[0, 0.03, 0]} s={[w, 0.05, d]} c="#7a1a14" r={0.25} rad={0.02} />;
const GRAINS = (n: number, r: number, y = 0.1) => Array.from({ length: n }, (_, i) => ({ x: r * Math.sqrt(rnd(i) * 0.95) * Math.cos(i * 2.4), z: r * Math.sqrt(rnd(i) * 0.95) * Math.sin(i * 2.4), y, a: rnd(i + 9) * 6 }));

// 0:37 · SIETE DIOSES: un grano gigante sobre laca; siete luces salen de a una y le dan la vuelta
const gods: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.2, 0.42, 1.05], [0, 0.26, 0]), C([-0.25, 0.5, 0.95], [0, 0.26, 0]), 12)} set={{ warm: 0.5, spotK: 0.4 }}
  scene={(tt) => <><Lacquer /><Grain p={[0, 0.26, 0]} s={2.6} rot={[0, 0, 0.2 + 0.03 * tt]} />
    {Array.from({ length: 7 }, (_, i) => { const k = pop(tt, 0.8 + i * 0.75); if (k < 0.04) return null; const a = i * 0.9 + tt * 0.55, R = 0.46 * Math.min(1.1, k); return <Halo key={i} p={[R * Math.cos(a), 0.28 + 0.14 * Math.sin(a * 2 + i), R * Math.sin(a)]} r={0.03 + 0.006 * (i % 3)} />; })}</>}
  over={(tt) => <Ink tt={tt} at={1.2} txt="SEVEN GODS IN ONE GRAIN" />} />;

// 1:14 · LA TAZA QUE SE VACÍA: el café baja y por cada sorbo aparece una cena
const coffee: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 0.75, 1.75], [0, 0.2, 0]), C([0.25, 0.7, 1.6], [0, 0.2, 0]), 12)} set={{ warm: 0.4 }}
  scene={(tt) => { const k = 1 - eio(tt, 1, 8); return <><Box p={[0, 0.012, 0.1]} s={[2.5, 0.024, 1]} c="#c9955a" r={0.7} rad={0.01} />
    <group position={[-0.72, 0.024, -0.05]}><Cyl p={[0, 0.25, 0]} r={0.2} r2={0.17} h={0.5} c="#eef3f5" rough={0.05} op={0.16} /><Cyl p={[0, 0.03 + 0.21 * k, 0]} r={0.17} r2={0.165} h={0.03 + 0.42 * k} c="#3a2212" rough={0.2} /></group>
    {Array.from({ length: 10 }, (_, i) => { const u = pop(tt, 1.1 + i * 0.68); const x = -0.42 + 0.27 * (i % 5), z = i < 5 ? -0.2 : 0.3; return <Pop key={i} k={u} p={[x, 0.024, z]}><Bowl p={[0, 0, 0]} s={0.48} c={i % 2 ? "#2c4a8a" : "#a13a2a"} /></Pop>; })}</>; }}
  over={(tt) => <Ink tt={tt} at={2.2} txt="TEN DINNERS · ONE COFFEE" />} />;

// 2:02 · LAS HORAS SOBRE LA MESADA: el reloj gira y el arroz se va llenando de puntos que despiertan
const germ: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 0.7, 1.6], [0, 0.3, 0]), C([-0.2, 0.62, 1.35], [0, 0.26, 0]), D)} set={{ warm: 0.65 }}
  scene={(tt) => { const k = eio(tt, 0.6, D - 2); return <>
    <Cyl p={[-0.1, 0.12, 0]} r={0.46} r2={0.42} h={0.24} c="#b7bcc2" m={0.7} rough={0.3} /><Mound p={[-0.1, 0.235, 0]} r={0.42} y={0.55} />
    <Dial p={[0.62, 0.42, -0.35]} ang={k * Math.PI * 7} s={0.46} rotY={-0.25} />
    {GRAINS(60, 0.36).slice(0, Math.floor(k * 60)).map((g, i) => { const R = Math.hypot(g.x, g.z), y = 0.238 + 0.55 * Math.sqrt(Math.max(0, 0.42 * 0.42 - R * R)); return <Glow key={i} p={[g.x - 0.1, y, g.z]} r={0.012 + 0.012 * cl(k * 2 - rnd(i))} c="#7aff5a" />; })}</>; }}
  over={(tt) => <><Ink tt={tt} at={1} txt="WARM FOR HOURS" />{tt > D * 0.62 && <Ink tt={tt} at={D * 0.62} y={120} txt="REHEATING WON'T FIX IT" col="#ff8a7a" size={70} />}</>} />; };

// 2:18 · APLASTAR EL CALOR: el montículo humeante se aplasta en lámina y el vapor se escapa de golpe, el color pasa de rojo a azul
const flat: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.3, 0.95, 1.95], [0, 0.1, 0]), C([-0.3, 1.05, 1.8], [0, 0.1, 0]), 11)} set={{ warm: 0.3 }}
  scene={(tt) => { const k = eio(tt, 1.2, 3.8), c = eio(tt, 3, 8); return <><Box p={[0, 0.03, 0]} s={[1.9, 0.04, 1.2]} c="#c5cbd1" m={0.75} r={0.28} rad={0.01} />
    <Mound p={[0, 0.05, 0]} r={lerp(0.34, 0.66, k)} y={lerp(1.15, 0.1, k)} c={col("#f2c9a0", "#d8e4ee", c)} e={col("#ff5a2a", "#000000", c)} ei={0.5 * (1 - c)} />
    <Steam p={[0, 0.1, 0]} t={tt} k={1 - c * 0.95} n={9} s={1.6 + k} /></>; }}
  over={(tt) => <Ink tt={tt} at={2.8} txt="FLAT LETS THE HEAT OUT" />} />;

// 3:07 · DESDE EL PUENTE: el brasero, y una cinta de humo de soja que viaja hasta el puentecito
const bridge: F = ({ t, h }) => { const pts = useMemo(() => new THREE.CatmullRomCurve3([new THREE.Vector3(-1.05, 0.5, 0), new THREE.Vector3(-0.5, 0.95, -0.15), new THREE.Vector3(0.2, 0.7, 0.05), new THREE.Vector3(0.82, 0.7, -0.05)]), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 0.95, 3.0], [0, 0.42, 0]), C([0.35, 0.88, 2.8], [0.05, 0.42, 0]), 13)} set={{ warm: 0.55, bg: "#d9d2c4" }}
    scene={(tt) => <>
      <Box p={[-1.05, 0.14, 0]} s={[0.6, 0.28, 0.42]} c="#4a3220" r={0.7} rad={0.02} /><Box p={[-1.05, 0.29, 0]} s={[0.54, 0.02, 0.36]} c="#ff6a24" e="#ff5a1a" ei={0.9 + 0.2 * Math.sin(tt * 2)} r={0.7} rad={0.005} />
      {[-0.14, 0, 0.14].map((x, i) => <Tri key={i} p={[-1.05 + x, 0.36, 0]} s={0.42} rot={[Math.PI / 2, 0, 0]} />)}
      <group position={[0.82, 0, 0]}><mesh rotation={[0, 0, 0]} position={[0, 0.1, 0]}><torusGeometry args={[0.56, 0.05, 12, 40, Math.PI]} /><meshStandardMaterial color="#b13a2a" roughness={0.5} /></mesh><mesh position={[0, 0.1, 0.16]}><torusGeometry args={[0.56, 0.03, 10, 40, Math.PI]} /><meshStandardMaterial color="#b13a2a" roughness={0.5} /></mesh></group>
      <group position={[-0.62, 0.02, 0.22]}><Sachi p={PZ.stand} t={tt} rotY={-60} s={0.22} expr="feliz" /></group>
      {Array.from({ length: 34 }, (_, i) => { const u = (tt * 0.14 + i / 34) % 1, reach = eio(tt, 0.4, 5); if (u > reach) return null; const p = pts.getPoint(u); return <Puff key={i} p={[p.x, p.y + 0.03 * Math.sin(i + tt), p.z]} r={0.1 + 0.13 * u} c="#7d5a38" op={0.72 * Math.sin(Math.PI * cl(u / reach))} />; })}</>}
    over={(tt) => <Ink tt={tt} at={1.8} txt="YOU COULD SMELL IT FROM THE BRIDGE" size={66} />} />; };

// 3:40 · NO LO TOQUES: los palitos pinchan, pinchan… y al tercer toque el triángulo se parte
const poke: F = ({ t, h }) => { const hL = useMemo(() => halfGeo(-1), []), hR = useMemo(() => halfGeo(1), []); return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.25, 0.8, 1.15], [0, 0.1, 0]), C([-0.2, 0.72, 1.05], [0, 0.1, 0]), 11)} set={{ warm: 0.5 }}
  scene={(tt) => { const hits = [1.5, 3.1, 4.7], cur = hits.reduce((a, x, i) => (tt > x ? i + 1 : a), 0), near = Math.min(...hits.map((x) => Math.abs(tt - x))), dn = Math.max(0, 1 - near * 5), sp = pop(tt, 4.75, 8, 0.5); const open = tt > 4.72 ? 0.17 * sp : 0, wob = Math.sin(tt * 40) * 0.03 * Math.max(0, 1 - near * 4);
    return <><Pan p={[0, 0, 0]} s={1.15} heat={0.5} />
      <mesh geometry={hL} position={[-open, 0.13, 0.04]} rotation={[-Math.PI / 2, 0, wob + open]} castShadow><meshPhysicalMaterial color="#d9b070" roughness={0.6} clearcoat={0.2} /></mesh>
      <mesh geometry={hR} position={[open, 0.13, 0.04]} rotation={[-Math.PI / 2, 0, -wob - open]} castShadow><meshPhysicalMaterial color="#d9b070" roughness={0.6} clearcoat={0.2} /></mesh>
      {cur >= 3 && GRAINS(14, 0.3, 0.12).map((g, i) => <Grain key={i} p={[g.x, 0.11, g.z + 0.05]} s={0.4} rot={[g.a, 0, 1.4]} />)}
      <Sticks p={[0.05, 0.5 - 0.2 * dn, 0]} rot={[0.25, 0, -0.5]} s={1.25} /></>; }}
  over={(tt) => <Ink tt={tt} at={1.1} txt={tt > 4.8 ? "AND IT FALLS APART" : "THEY TOUCH IT"} col={tt > 4.8 ? "#ff8a7a" : undefined} />} />; };

// 4:18 · HASH BROWNS: cae un banderín a la bola tostada, y se queda ahí temblando
const label: F = ({ t, h }) => { const m = useMemo(() => cardTex(["HASH BROWNS"], { bg: "#fff6dd", fg: "#7a1a14", h: 200 }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 0.55, 1.5], [0, 0.32, 0]), C([-0.15, 0.52, 1.4], [0, 0.32, 0]), 12)} set={{ warm: 0.6 }}
    scene={(tt) => { const k = pop(tt, 2.8, 9, 0.28); const y = lerp(0.9, 0.14, Math.min(1, eio(tt, 2.8, 3.05))), tilt = 0.18 * Math.exp(-(tt - 3) * 1.1) * Math.sin(tt * 18) * (tt > 3 ? 1 : 0); return <>
      <Plate p={[0, 0.0, 0]} /><Tri p={[0, 0.2, 0]} s={0.9} rot={[-0.15, 0.25, 0]} c="#c88d44" />
      {k > 0.02 && <group position={[0.04, y + 0.08, 0.06]} rotation={[0, 0.25, tilt]}><Cyl p={[0, 0.12, 0]} r={0.006} h={0.34} c="#e9dcc2" /><Box p={[0.14, 0.26, 0]} s={[0.3, 0.17, 0.006]} c="#fff" rad={0.003} /><mesh position={[0.14, 0.26, 0.0045]}><planeGeometry args={[0.29, 0.16]} /><meshStandardMaterial map={m} /></mesh></group>}
      {[0, 1, 2].map((i) => <Pop key={i} k={pop(tt, 5.5 + i * 0.35)} p={[0.45 + i * 0.03, 0.03 + i * 0.022, 0.3]}><Coin p={[0, 0, 0]} s={0.9} /></Pop>)}</>; }}
    over={(tt) => <Ink tt={tt} at={5.7} txt="15 CENTS" col="#ffcf55" y={130} />} />; };

// 4:48 · LO SALADO QUE HAYA: el salmón, la ciruela y el alga caen de a uno sobre el bol, justo cuando los nombra
const toppings: F = ({ t, h }) => { const it0 = h.items?.[0]?.at ?? 4, it1 = h.items?.[1]?.at ?? 6, it2 = h.items?.[2]?.at ?? 8;
  const fall = (tt: number, a: number) => 0.85 * (1 - Math.min(1, eio(tt, a, a + 0.42)));
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.15, 1.0, 0.75], [0, 0.1, 0]), C([-0.15, 0.95, 0.7], [0, 0.1, 0]), 14)} set={{ warm: 0.45 }}
    scene={(tt) => <><Bowl p={[0, 0, 0]} s={2.1} c="#254a7a" fill="#cfc8b6" /><Mound p={[0, 0.2, 0]} r={0.34} y={0.42} />
      <Steam p={[0, 0.3, 0]} t={tt} n={5} />
      {tt > it0 && <group position={[-0.14, 0.31 + fall(tt, it0), 0.02]} rotation={[0.1, 0.6, 0.05]}><Box p={[0, 0, 0]} s={[0.2, 0.04, 0.1]} c="#f2894f" r={0.3} rad={0.015} /></group>}
      {tt > it1 && <mesh position={[0.14, 0.33 + fall(tt, it1), -0.04]}><sphereGeometry args={[0.055, 22, 16]} /><meshPhysicalMaterial color="#c12a36" roughness={0.35} clearcoat={0.6} /></mesh>}
      {tt > it2 && [0, 1, 2, 3].map((i) => <Box key={i} p={[0.02 + i * 0.05 - 0.05, 0.34 + fall(tt, it2 + i * 0.1), 0.15 - i * 0.03]} s={[0.1, 0.004, 0.06]} rot={[0.2, i * 0.8, 0.1]} c="#16261c" r={0.5} rad={0.001} />)}</>} />; };

// 5:05 · COMO UNA PIEDRA EN UN ESTANQUE: sube el té alrededor del arroz y salen ondas
const pond: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, 1.15, 0.72], [0, 0.1, 0]), C([0.3, 1.05, 0.8], [0, 0.1, 0]), 12)} set={{ warm: 0.5, spotK: 0.3 }}
  scene={(tt) => { const k = eio(tt, 0.5, 3.4); return <><Bowl p={[0, 0, 0]} s={2.4} c="#3c2b23" fillK={0} /><Mound p={[0, 0.13, 0]} r={0.2} y={0.75} />
    <Cyl p={[0, 0.1 + 0.14 * k, 0]} r={0.2 + 0.25 * k} h={0.01} c="#a89a4a" rough={0.1} op={0.72} />
    {[0, 1, 2, 3].map((i) => { const u = ((tt - 2) * 0.28 + i / 4) % 1; return tt > 2 ? <mesh key={i} position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.2 + 0.24 * u, 0.208 + 0.24 * u, 64]} /><meshBasicMaterial color="#f0f3c8" transparent opacity={0.6 * (1 - u)} depthWrite={false} /></mesh> : null; })}</>; }}
  over={(tt) => <Ink tt={tt} at={2.4} txt="LIKE A STONE IN A POND" />} />;

// 5:53 · LA BOLA QUE LEVANTA LA SARTÉN: la espátula tira y la sartén entera sube pegada al engrudo
const glue: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 0.72, 2.3], [0, 0.5, 0]), C([0.4, 0.66, 2.15], [0, 0.5, 0]), 10)} set={{ warm: 0.35 }}
  scene={(tt) => { const up = eio(tt, 1.6, 4.2), sw = Math.sin(tt * 3) * 0.08 * up; return <group position={[0, 0.3 * up, 0]} rotation={[0, 0, sw]}><Pan p={[0, 0, 0]} s={1.1} heat={0.2} />
    <Mound p={[0, 0.1, 0]} r={0.29} y={0.72} c="#ddd6c4" />
    <group position={[0, 0.5, 0]} rotation={[0, 0, 0.15]}><Box p={[0, -0.08, 0]} s={[0.26, 0.02, 0.22]} c="#c7cbd0" m={0.85} r={0.2} rad={0.008} /><Box p={[0, 0.3, 0]} s={[0.05, 0.75, 0.05]} c="#6b4a2c" rad={0.015} /></group></group>}}
  over={(tt) => <Ink tt={tt} at={2.2} txt="ONE BIG WET LUMP" col="#ff8a7a" />} />;

// 6:26 · EL ABRIGUITO: la yema le pone un tapado amarillo a cada grano; chocan y rebotan sin pegarse
const coat: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 0.42, 1.25], [0, 0.22, 0]), C([0.25, 0.46, 1.15], [0, 0.22, 0]), 11)} set={{ warm: 0.5 }}
  scene={(tt) => <><Lacquer w={2} d={0.8} />{Array.from({ length: 9 }, (_, i) => { const k = eio(tt, 0.9 + i * 0.3, 1.7 + i * 0.3), hit = tt > 5 ? Math.abs(Math.sin((tt - 5) * 3.2)) * Math.exp(-(tt - 5) * 0.55) : 0, x = (i - 4) * (0.145 + 0.05 * hit); return <group key={i} position={[x, 0.22, 0]} rotation={[0, 0, 0.5 + 0.28 * Math.sin(i * 2.1)]}><Grain p={[0, 0, 0]} s={0.82} />{k > 0.02 && <mesh position={[0, -0.08 * (1 - k), 0]} scale={[0.98, Math.max(0.08, 1.75 * k), 0.98]}><sphereGeometry args={[0.05, 20, 14]} /><meshPhysicalMaterial color={YOLK} transparent opacity={0.72} roughness={0.2} clearcoat={0.7} depthWrite={false} /></mesh>}</group>; })}</>}
  over={(tt) => <Ink tt={tt} at={1.4} txt="EACH GRAIN GETS A COAT" col="#ffd76a" />} />;

// 6:44 · DE SIZZLE A RATTLE: los granos saltan más y la onda del sonido cambia de lisa a dentada
const rattle: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.2, 0.78, 1.05], [0, 0.1, 0]), C([-0.2, 0.74, 1.1], [0, 0.1, 0]), D)} set={{ warm: 0.55 }}
  scene={(tt) => { const k = eio(tt, 1, D - 2); return <><Pan p={[0, 0, 0]} s={1.15} heat={0.8} />{GRAINS(70, 0.38).map((g, i) => { const hop = Math.abs(Math.sin(tt * (5 + (i % 4)) + i)) * (0.015 + 0.12 * k); return <Grain key={i} p={[g.x, 0.12 + hop, g.z]} s={0.5} c={col("#efe4c6", YOLK, 0.6)} rot={[g.a, g.a * 2, 1.4 + tt * k]} />; })}
    {Array.from({ length: 9 }, (_, i) => { const u = (tt * 0.5 + i / 9) % 1; return <Drop key={i} p={[0.3 * Math.cos(i * 2.2), 0.14 + u * 0.7, 0.3 * Math.sin(i * 2.2)]} op={0.65 * (1 - k) * (1 - u)} />; })}</>; }}
  over={(tt) => { const k = eio(tt, 1, D - 2), pts = Array.from({ length: 90 }, (_, i) => { const x = 460 + i * 11.2, s = Math.sin(i * 0.28 + tt * 5) * 28 * (1 - k), j = (rnd(i + Math.floor(tt * 15)) - 0.5) * 120 * k; return `${x},${130 + s + j}`; }).join(" "); return <><svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><polyline points={pts} fill="none" stroke={k > 0.5 ? "#ffcf55" : "#9fd4ff"} strokeWidth={7} strokeLinejoin="round" opacity={0.95} /></svg><Ink tt={tt} at={0.8} txt={k > 0.55 ? "DRY RATTLE" : "WET SIZZLE"} /></>; }} />; };

// 7:17 · POR EL BORDE: la soja dibuja un círculo por la pared caliente y sube un anillo de humo
const edge: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.05, 1.3, 0.5], [0, 0.08, 0]), C([0.25, 1.2, 0.55], [0, 0.08, 0]), 10)} set={{ warm: 0.5 }}
  scene={(tt) => { const k = eio(tt, 0.8, 3.6); return <><Pan p={[0, 0, 0]} s={1.25} heat={0.8} /><Mound p={[0, 0.1, 0]} r={0.27} y={0.3} c="#e9c978" />
    {k > 0.02 && <mesh position={[0, 0.112, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.41, 0.46, 72, 1, 0, k * Math.PI * 2]} /><meshStandardMaterial color="#7a4a1e" emissive="#3a1a08" emissiveIntensity={0.5} roughness={0.15} /></mesh>}
    {Array.from({ length: 16 }, (_, i) => { const a = i * 0.3925 * 1, u = (tt * 0.5 + i / 7) % 1, on = cl(k * 16 - i); return <Puff key={i} p={[0.44 * Math.cos(a), 0.14 + u * 0.55, -0.44 * Math.sin(a)]} r={0.06 + 0.1 * u} c="#cfc4b6" op={0.34 * on * (1 - u)} />; })}</>; }}
  over={(tt) => <Ink tt={tt} at={1.3} txt="AROUND THE EDGE" />} />;

// 7:49 · LO QUE QUEDA AL FONDO: tofu, repollo y pollo se van volando y queda el caldo que brilla
const nabe: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.2, 1.05, 1.1], [0, 0.12, 0]), C([-0.2, 1.0, 1.05], [0, 0.12, 0]), 13)} set={{ warm: 0.65, spotK: 0.2 }}
  scene={(tt) => { const gl = eio(tt, 7, 11); return <><Cyl p={[0, 0.11, 0]} r={0.62} r2={0.52} h={0.22} c="#4a3a30" rough={0.4} /><Cyl p={[0, 0.222, 0]} r={0.57} h={0.006} c={col("#d8c8a0", "#ffe4a0", gl)} rough={0.2} e="#ffc968" ei={0.3 * gl} />
    {Array.from({ length: 12 }, (_, i) => { const a = 2.5 + i * 0.32, u = eio(tt, a, a + 1.1); if (u > 0.98) return null; const x = 0.38 * Math.cos(i * 2.4) * Math.sqrt((i + 1) / 12), z = 0.38 * Math.sin(i * 2.4) * Math.sqrt((i + 1) / 12); const c = ["#f4efe2", "#a7c46a", "#e3b98a"][i % 3]; return <Box key={i} p={[x, 0.26 + u * 1.4, z]} s={i % 3 === 1 ? [0.2, 0.02, 0.16] : [0.13, 0.08, 0.13]} c={c} rot={[u * 3, i, u * 2]} r={0.6} rad={0.012} op={1 - u} />; })}
    <Steam p={[0, 0.25, 0]} t={tt} n={6} s={1.5} /></>; }}
  over={(tt) => <Ink tt={tt} at={7.4} txt="THE BEST PART IS LEFT" col="#ffd76a" />} />;

// 8:05 · LA NUBE DE ALMIDÓN: pasa el agua por el colador y abajo se enturbia el bol
const rinse: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.1, 0.75, 1.6], [0, 0.42, 0]), C([0.32, 0.68, 1.5], [0, 0.42, 0]), 11)} set={{ warm: 0.3, bg: "#dfe6e6" }}
  scene={(tt) => { const k = eio(tt, 1, 7); return <>
    <Cyl p={[0, 0.17, 0]} r={0.48} r2={0.36} h={0.34} c="#dfe9ef" rough={0.05} op={0.35} /><Cyl p={[0, 0.03 + 0.1 * k, 0]} r={0.4} r2={0.38} h={0.02 + 0.2 * k} c={col("#d5ebf7", "#f5f2e8", k)} rough={0.2} op={0.45 + 0.45 * k} />
    <group position={[0, 0.58, 0]}><mesh rotation={[Math.PI, 0, 0]}><sphereGeometry args={[0.38, 32, 14, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#b0b6bc" metalness={0.8} roughness={0.3} wireframe /></mesh><Mound p={[0, -0.28, 0]} r={0.27} y={0.75} /></group>
    {Array.from({ length: 22 }, (_, i) => { const u = (tt * 1.1 + i / 22) % 1; return <Drop key={i} p={[0.1 * Math.cos(i * 2.2), 1.5 - u * 0.95, 0.1 * Math.sin(i * 2.2)]} s={0.8} />; })}
    {Array.from({ length: 12 }, (_, i) => { const u = (tt * 0.9 + i / 12) % 1; return <Drop key={"b" + i} p={[0.2 * Math.cos(i * 1.7), 0.22 - u * 0.12 + 0.03, 0.2 * Math.sin(i * 1.7)]} c="#f5f2e8" s={1.1} op={0.7 * (1 - u)} />; })}</>; }}
  over={(tt) => <Ink tt={tt} at={2} txt="THE STARCH WASHES AWAY" />} />;

// 9:13 · CAMBIO UN REINO: el castillito cruza la mesa y el omelette vuelve al otro lado
const kingdom: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.85, 2.55], [0, 0.26, 0]), C([0.25, 0.8, 2.4], [0, 0.26, 0]), 12)} set={{ warm: 0.5 }}
  scene={(tt) => { const k = eio(tt, 3.5, 6.5), arc = Math.sin(Math.PI * k) * 0.2; return <><Box p={[0, 0.012, 0]} s={[2.6, 0.024, 1]} c="#c9955a" r={0.7} rad={0.01} />
    <group position={[lerp(-0.8, 0.8, k), 0.02 + arc, -0.05]}>{[-0.15, 0.15].map((x) => <Cyl key={x} p={[x, 0.26, 0]} r={0.08} h={0.52} c="#bfc0c6" rough={0.8} />)}<Box p={[0, 0.17, 0]} s={[0.34, 0.34, 0.16]} c="#c9cad0" /><mesh position={[-0.15, 0.6, 0]}><coneGeometry args={[0.11, 0.2, 18]} /><meshStandardMaterial color="#b02a2a" /></mesh><mesh position={[0.15, 0.6, 0]}><coneGeometry args={[0.11, 0.2, 18]} /><meshStandardMaterial color="#b02a2a" /></mesh></group>
    <group position={[lerp(0.8, -0.8, k), 0.02 + arc, 0.1]}><Plate p={[0, 0, 0]} r={0.34} /><mesh position={[0, 0.03, 0]} scale={[1.25, 0.62, 0.72]}><sphereGeometry args={[0.2, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#f4c732" roughness={0.42} clearcoat={0.4} /></mesh></group></>; }}
  over={(tt) => <Ink tt={tt} at={1.6} txt="THEY'D TRADE A KINGDOM" />} />;

// 10:03 · ARROPAR: el omelette se desliza sobre la colina roja como una frazada, y aparece una almohadita
const tuck: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.45, 0.55, 1.0], [0, 0.14, 0]), C([0.05, 0.6, 1.05], [0, 0.14, 0]), 12)} set={{ warm: 0.65 }}
  scene={(tt) => { const k = eio(tt, 1, 4.5), pi = pop(tt, 5, 7, 0.4); return <><Plate p={[0, 0, 0]} r={0.52} /><mesh position={[0, 0.03, 0]} scale={[1.35, 0.8, 0.82]}><sphereGeometry args={[0.24, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#c9472e" roughness={0.7} /></mesh>
    <mesh position={[lerp(-0.9, 0.02, k), 0.04, 0]} scale={[1.42, 0.86, 0.9]}><sphereGeometry args={[0.245, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#f7cc38" roughness={0.42} clearcoat={0.5} /></mesh>
    <Pop k={pi} p={[0.38, 0.09, 0]}><Box p={[0, 0, 0]} s={[0.12, 0.05, 0.16]} c="#ffffff" rad={0.022} /></Pop></>; }}
  over={(tt) => <Ink tt={tt} at={1.5} txt="LIKE TUCKING IN A CHILD" />} />;

// 11:06 · NO LO REVUELVAS: la cuchara amaga; los granos se hinchan solos cuando se va
const swell: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 0.62, 1.95], [0, 0.4, 0]), C([0.3, 0.58, 1.85], [0, 0.4, 0]), 11)} set={{ warm: 0.5 }}
  scene={(tt) => { const k = eio(tt, 4, 10), sp = Math.exp(-Math.max(0, tt - 3) * 4) * (0.05 + 0.02 * Math.sin(tt * 8)); const fw = eio(tt, 0.6, 1.8) - eio(tt, 3, 3.8); return <>
    <Cyl p={[0, 0.3, 0]} r={0.46} r2={0.42} h={0.6} c="#d9eaf0" rough={0.05} op={0.3} /><Cyl p={[0, 0.2, 0]} r={0.43} r2={0.405} h={0.36} c="#ece7d4" rough={0.35} op={0.72} />
    {GRAINS(24, 0.34).map((g, i) => <Grain key={i} p={[g.x, 0.12 + (i % 5) * 0.06, g.z]} s={0.55 + 0.65 * k} rot={[g.a, g.a, 1 + g.a]} />)}
    <group position={[0.66 - 0.5 * fw + sp, 0.5, 0]} rotation={[0, 0, -0.35]}><Box p={[0, 0.4, 0]} s={[0.05, 0.85, 0.05]} c="#8a6238" rad={0.015} /><mesh position={[0, -0.08, 0]} scale={[1, 1.3, 0.3]}><sphereGeometry args={[0.1, 20, 14]} /><meshStandardMaterial color="#8a6238" /></mesh></group></>; }}
  over={(tt) => <Ink tt={tt} at={1.2} txt={tt > 4 ? "LET IT SWELL" : "DO NOT STIR"} col={tt > 4 ? "#ffd76a" : "#ff8a7a"} />} />;

// 11:23 · LA BANDERA: cae la ciruela al centro del bol blanco y la cámara baja hasta que el bol ES la bandera
const flag: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="iris" cam={(tt) => C([0, lerp(1.75, 1.07, eio(tt, 2.5, D - 1)), 0.02 + 0.5 * (1 - eio(tt, 0.5, 2.4))], [0, 0.1, 0], 34)} set={{ warm: 0.12 }}
  scene={(tt) => { const f = lerp(1.6, 0.27, Math.min(1, eio(tt, 1, 1.5))); return <><Bowl p={[0, 0, 0]} s={2.2} c="#efe9dc" fillK={1} fill="#fdfbf5" /><mesh position={[0, f, 0]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.11, 32, 22]} /><meshBasicMaterial color="#b81a26" toneMapped={false} /></mesh></>; }}
  over={(tt) => <Ink tt={tt} at={3.2} txt="THE JAPANESE FLAG" col="#ffffff" />} />; };

// 12:13 · MITAD Y MITAD: un vaso baja sólo sobre la mitad izquierda y aplasta; la derecha queda entera
const halfcrush: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 0.7, 1.55], [0, 0.15, 0]), C([0.22, 0.66, 1.45], [0, 0.15, 0]), 10)} set={{ warm: 0.4 }}
  scene={(tt) => { const d = Math.abs(Math.sin(Math.max(0, tt - 1.4) * 1.7)), squ = eio(tt, 1.4, 5); return <><Lacquer w={1.8} d={0.9} />
    {Array.from({ length: 36 }, (_, i) => { const x = -0.68 + (i % 12) * 0.122, z = -0.14 + Math.floor(i / 12) * 0.14, L = x < 0; return <Grain key={i} p={[x, L ? lerp(0.1, 0.08, squ) : 0.11, z]} s={0.72} rot={[Math.PI / 2, 0, rnd(i) * 3]} sq={L ? lerp(1, 0.4, squ) : 1} c={L ? col(RICE, "#efe3c8", squ) : RICE} />; })}
    <Cyl p={[-0.35, 0.1 + 0.2 * d + 0.14, 0]} r={0.26} h={0.28} c="#dbe7ee" rough={0.05} op={0.6} /></>; }}
  over={(tt) => <Ink tt={tt} at={1.6} txt="HALF CRUSHED, HALF WHOLE" />} />;

// 13:03 · ¿UN CORN DOG?: dan vueltas lado a lado, y aparece el cartelito con la pregunta
const corndog: F = ({ t, h }) => { const m = useMemo(() => cardTex(["CORN DOG?"], { bg: "#fff6dd", fg: "#7a1a14", h: 200 }), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.55, 1.4], [0, 0.35, 0]), C([0.2, 0.5, 1.3], [0, 0.35, 0]), 12)} set={{ warm: 0.55 }}
    scene={(tt) => <><Cyl p={[0, 0.03, 0]} r={0.75} h={0.06} c="#6b4a2c" rough={0.5} />
      <group rotation={[0, tt * 0.32, 0]}>
        <group position={[-0.32, 0.06, 0]}><Cyl p={[0, 0.16, 0]} r={0.012} h={0.8} c="#d6c29c" /><mesh position={[0, 0.42, 0]} scale={[0.72, 1.3, 0.42]}><sphereGeometry args={[0.15, 26, 18]} /><meshStandardMaterial color="#8c5a2c" roughness={0.5} /></mesh></group>
        <group position={[0.32, 0.06, 0]}><Cyl p={[0, 0.16, 0]} r={0.012} h={0.8} c="#d6c29c" /><mesh position={[0, 0.42, 0]} scale={[0.72, 1.45, 0.72]}><sphereGeometry args={[0.15, 26, 18]} /><meshStandardMaterial color="#c9893f" roughness={0.65} /></mesh></group></group>
      </>} over={(tt) => <Ink tt={tt} at={2.2} txt="A CORN DOG?" />} />; };

// 13:37 · ECHAR EL AGUA: el corte de la galleta, las gotas se escapan hacia arriba y se dora despacio
const chase: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.88, 1.4], [0, 0.14, 0]), C([0.2, 0.82, 1.32], [0, 0.14, 0]), 13)} set={{ warm: 0.35 }}
  scene={(tt) => { const k = eio(tt, 0.6, 11); return <><Box p={[0, 0.03, 0]} s={[1.7, 0.05, 0.8]} c="#26272a" m={0.7} r={0.5} rad={0.01} />
    {[-0.5, -0.25, 0, 0.25, 0.5].map((x, i) => <mesh key={i} position={[x, -0.02, 0.3]}><coneGeometry args={[0.05, 0.1 + 0.02 * Math.sin(tt * 2 + i), 10]} /><meshBasicMaterial color="#6aa8ff" toneMapped={false} /></mesh>)}
    {[-0.54, -0.18, 0.18, 0.54].map((x) => <Box key={x} p={[x, 0.1, 0]} s={[0.3, 0.07 - 0.02 * k, 0.3]} c={col("#ebe3cb", "#c88a36", k)} r={0.7} rad={0.022} />)}
    {Array.from({ length: 28 }, (_, i) => { const u = (tt * 0.4 + rnd(i)) % 1, n = 1 - k * 0.85; return i / 28 < n ? <Drop key={i} p={[-0.6 + rnd(i + 2) * 1.2, 0.18 + u * 0.75, rnd(i + 5) * 0.3 - 0.15]} s={1.4} op={0.75 * (1 - u)} /> : null; })}</>; }}
  over={(tt) => <Ink tt={tt} at={1.3} txt="CHASING OUT THE WATER" />} />;

// 14:09 · VEINTE DE MEDIA TAZA: la tacita se vuelca y sale una espiral de galletas
const twenty: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 1.8, 0.9], [0, 0, 0]), C([0.15, 1.75, 0.85], [0, 0, 0]), 12)} set={{ warm: 0.5 }}
  scene={(tt) => <><Box p={[0, 0.012, 0]} s={[2.6, 0.024, 1.4]} c="#c9955a" r={0.7} rad={0.01} />
    <group position={[-0.7, 0.15, -0.25]} rotation={[0, 0, -eio(tt, 0.6, 1.5) * 1.3]}><Cyl p={[0, 0.06, 0]} r={0.13} r2={0.11} h={0.16} c="#c7cbd0" m={0.85} rough={0.3} /></group>
    {Array.from({ length: 20 }, (_, i) => { const u = pop(tt, 1.3 + i * 0.28, 8, 0.5); const a = i * 0.72, R = 0.1 + 0.02 * i; return <Pop key={i} k={u} p={[0.2 + R * Math.cos(a) * 1.15, 0.04, R * Math.sin(a)]} rot={[0, a, 0]}><Cyl p={[0, 0, 0]} r={0.075} h={0.012} c={col("#d3a356", "#b57a30", rnd(i))} rough={0.65} /></Pop>; })}
    <Pop k={pop(tt, 7.2)} p={[-0.7, 0.04, 0.3]}><Coin p={[0, 0, 0]} s={1.1} /></Pop></>}
  over={(tt) => <Ink tt={tt} at={7.2} txt="20 CRACKERS · 5 CENTS" col="#ffcf55" />} />;

// 14:25 · EL HOTEL DEL PUERTO: el edificio con barcos; se prende UNA ventana
const harbor: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 0.85, 3.1], [0, 0.5, 0]), C([0.4, 0.8, 2.9], [0.05, 0.5, 0]), 12)} set={{ warm: 0.1, bg: "#31405a", back: false }}
  scene={(tt) => { const one = eio(tt, 4, 5.2); return <><Box p={[0, 0.02, 0.9]} s={[5, 0.02, 1.4]} c="#3e6a8a" r={0.15} m={0.2} rad={0.002} /><Box p={[0, 0.55, -0.3]} s={[1.9, 1.05, 0.5]} c="#e4d9c2" r={0.75} />
    {Array.from({ length: 21 }, (_, i) => { const x = -0.8 + (i % 7) * 0.267, y = 0.32 + Math.floor(i / 7) * 0.26, me = i === 10; return <Box key={i} p={[x, y, -0.04]} s={[0.12, 0.15, 0.01]} c={me ? "#ffeeb0" : "#39424f"} e={me ? "#ffd27a" : "#000000"} ei={me ? 2.2 * one : 0} rad={0.002} cast={false} />; })}
    {[[-0.8, -0.05], [0.72, 0.2]].map(([x, z], i) => <group key={i} position={[x, 0.08 + 0.015 * Math.sin(tt * 1.2 + i), 0.9 + z]} rotation={[0, 0, 0.03 * Math.sin(tt + i)]}><Box p={[0, 0, 0]} s={[0.6, 0.1, 0.16]} c="#242a30" rad={0.03} /><Box p={[0, 0.11, 0]} s={[0.28, 0.13, 0.11]} c="#eeeadf" /><Cyl p={[0.05, 0.24, 0]} r={0.03} h={0.18} c="#8f2c2c" /></group>)}</>; }}
  over={(tt) => <Ink tt={tt} at={1.2} txt={tt > 4.5 ? "ONE SICK GUEST" : "YOKOHAMA · 1930"} />} />;

// 15:33 · EL CASAMIENTO: el sándwich y el pastel se encuentran bajo un arco y nace la fuente gratinada
const marriage: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.6, 1.7], [0, 0.32, 0]), C([0.28, 0.56, 1.55], [0, 0.32, 0]), 10)} set={{ warm: 0.65 }}
  scene={(tt) => { const k = eio(tt, 0.8, 4), b = pop(tt, 4.6, 7, 0.4); return <><Box p={[0, 0.012, 0]} s={[2.5, 0.024, 1]} c="#c9955a" r={0.7} rad={0.01} />
    <mesh position={[0, 0, -0.15]}><torusGeometry args={[0.62, 0.035, 12, 48, Math.PI]} /><meshStandardMaterial color="#e8b34a" metalness={0.6} roughness={0.3} /></mesh>
    <group position={[lerp(-1, -0.34, k), 0.05, 0]}><Box p={[0, 0, 0]} s={[0.34, 0.06, 0.34]} c="#d79a4e" rad={0.02} /><Box p={[0, 0.045, 0]} s={[0.32, 0.03, 0.32]} c="#f1c232" rad={0.01} /><Box p={[0, 0.09, 0]} s={[0.34, 0.06, 0.34]} c="#d79a4e" rad={0.02} /></group>
    <group position={[lerp(1, 0.34, k), 0.03, 0]}><Cyl p={[0, 0.07, 0]} r={0.2} r2={0.16} h={0.14} c="#c8893e" /><mesh position={[0, 0.14, 0]} scale={[1, 0.28, 1]}><sphereGeometry args={[0.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#daa050" /></mesh></group>
    <Pop k={b} p={[0, 0.03, 0.3]}><mesh scale={[1.3, 1, 0.82]}><cylinderGeometry args={[0.2, 0.16, 0.1, 28]} /><meshStandardMaterial color="#efe8d8" roughness={0.3} /></mesh><mesh position={[0, 0.055, 0]} scale={[1.2, 0.2, 0.75]}><sphereGeometry args={[0.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#d59a3a" roughness={0.5} /></mesh></Pop></>; }}
  over={(tt) => <Ink tt={tt} at={5} txt="90 CENTS" col="#ffcf55" y={130} />} />;

// 16:06 · GRAVA Y LLUVIA: los granos caen duros, repican; una cuchara de agua y se ablandan
const gravel: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.2, 0.62, 1.05], [0, 0.12, 0]), C([-0.2, 0.58, 1.0], [0, 0.12, 0]), 10)} set={{ warm: 0.4 }}
  scene={(tt) => { const soft = eio(tt, 4.2, 6.5); return <><Plate p={[0, 0, 0]} r={0.55} />
    {GRAINS(48, 0.43).map((g, i) => { const a = 0.2 + i * 0.035, y = tt < a ? 1.2 : 0.06 + Math.abs(Math.sin((tt - a) * 12)) * 0.09 * Math.exp(-(tt - a) * 4); return tt > a - 0.8 ? <Grain key={i} p={[g.x, y + (tt < a ? -(tt - a) * 1.2 : 0), g.z]} s={lerp(0.44, 0.74, soft)} c={col("#cfc7ae", RICE, soft)} rot={[g.a, g.a * 2, 1.4]} /> : null; })}
    {tt > 3.1 && Array.from({ length: 12 }, (_, i) => { const u = eio(tt, 3.2 + i * 0.05, 4.1 + i * 0.05); return u < 0.99 ? <Drop key={i} p={[0.3 * Math.cos(i), 1 - u * 0.9, 0.3 * Math.sin(i)]} s={1.3} /> : null; })}
    <Steam p={[0, 0.1, 0]} t={tt} k={soft} n={7} s={1.3} /></>; }}
  over={(tt) => <Ink tt={tt} at={0.6} txt={tt > 4.6 ? "ONE SPOON OF WATER" : "LIKE GRAVEL"} col={tt > 4.6 ? "#9fd4ff" : "#ff8a7a"} />} />;

// 17:11 · LA LLUVIA DE ADENTRO: se juntan gotas debajo de la tapa y caen encima del arroz
const drops: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.15, 0.72, 1.95], [0, 0.5, 0]), C([-0.15, 0.68, 1.85], [0, 0.5, 0]), 12)} set={{ warm: 0.35 }}
  scene={(tt) => { const w = eio(tt, 3, 11); return <><Cyl p={[0, 0.2, 0]} r={0.5} r2={0.46} h={0.4} c="#c2c7cc" m={0.7} rough={0.3} /><Mound p={[0, 0.39, 0]} r={0.44} y={0.28} c={col(RICE, "#d9d4c0", w)} />
    <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.52, 0.018, 10, 56]} /><meshStandardMaterial color="#5b6168" metalness={0.7} roughness={0.3} /></mesh><Cyl p={[0, 0.96, 0]} r={0.045} h={0.06} c="#2b2b2e" /><mesh position={[0, 0.8, 0]} scale={[1, 0.25, 1]}><sphereGeometry args={[0.52, 40, 14, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#bfd8e8" transparent opacity={0.42} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    {Array.from({ length: 22 }, (_, i) => { const x = 0.42 * Math.sqrt(rnd(i)) * Math.cos(i * 2.4), z = 0.42 * Math.sqrt(rnd(i)) * Math.sin(i * 2.4), per = 2.2 + rnd(i + 4) * 1.5, u = (tt + rnd(i) * per) % per / per; return <group key={i}><Drop p={[x, u < 0.65 ? 0.785 : lerp(0.78, 0.43, (u - 0.65) / 0.35), z]} s={0.35 + (u < 0.65 ? u : 0.65)} /></group>; })}</>; }}
  over={(tt) => <Ink tt={tt} at={1.2} txt="IT RAINS ON YOUR RICE" />} />;

// 17:29 · LA ETIQUETA QUE DA VUELTA: «LEFTOVER» gira y del otro lado dice «TOMORROW'S»
const tomorrow: F = ({ t, h }) => { const a = useMemo(() => cardTex(["LEFTOVER"], { bg: "#ded7c6", fg: "#6a6256", h: 200 }), []), b = useMemo(() => cardTex(["TOMORROW'S"], { bg: "#fff4d6", fg: "#a12a1f", h: 200 }), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.2, 0.62, 2.0], [0, 0.42, 0]), C([-0.2, 0.58, 1.9], [0, 0.42, 0]), 12)} set={{ warm: 0.6 }}
    scene={(tt) => { const f = eio(tt, 3, 4.2) * Math.PI; return <><Cyl p={[0, 0.2, 0]} r={0.36} r2={0.32} h={0.4} c="#2d2a28" rough={0.4} m={0.5} /><Cyl p={[0, 0.42, 0]} r={0.38} h={0.04} c="#3f3a36" rough={0.4} m={0.5} />
      <group position={[0, 0.62, 0.42]} rotation={[0, f, 0.02 * Math.sin(tt * 2)]}><Box p={[0, 0, 0]} s={[0.66, 0.26, 0.012]} c="#fff" rad={0.004} /><mesh position={[0, 0, 0.0075]}><planeGeometry args={[0.64, 0.24]} /><meshBasicMaterial map={a} toneMapped={false} /></mesh><mesh position={[0, 0, -0.0075]} rotation={[0, Math.PI, 0]}><planeGeometry args={[0.64, 0.24]} /><meshBasicMaterial map={b} toneMapped={false} /></mesh></group></>; }} />; };

// 18:00 · LA CAJITA EN EL AUTO: el sol da vueltas sobre el autito y la cajita se pone roja
const hotcar: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.2, 1.0, 2.1], [0, 0.32, 0]), C([-0.25, 0.92, 1.95], [0, 0.32, 0]), 10)} set={{ warm: 0.7, bg: "#ecd9b0" }}
  scene={(tt) => { const k = eio(tt, 0.8, 7), a = Math.PI * (0.15 + 0.7 * k); return <><Glow p={[-0.95 * Math.cos(a), 0.42 * Math.sin(a) + 0.45, -0.5]} r={0.12} c="#ffb52a" />
    <Box p={[0, 0.18, 0]} s={[1.2, 0.2, 0.56]} c="#3a7ab0" r={0.25} m={0.3} rad={0.05} /><Box p={[-0.05, 0.37, 0]} s={[0.66, 0.2, 0.5]} c="#d4e7ef" r={0.08} op={0.42} rad={0.04} />
    {[-0.4, 0.4].flatMap((x) => [-0.29, 0.29].map((z) => <Cyl key={x + "" + z} p={[x, 0.08, z]} r={0.09} h={0.05} c="#1a1a1c" rot={[Math.PI / 2, 0, 0]} />))}
    <Box p={[-0.05, 0.33, 0]} s={[0.18, 0.13, 0.14]} c={col("#f8f6ef", "#e0442f", k)} e="#ff3a1a" ei={0.45 * k} rad={0.01} /><Dial p={[0.74, 0.56, -0.1]} ang={-1.7 + 3.4 * k} s={0.42} rotY={-0.2} /></>; }}
  over={(tt) => <Ink tt={tt} at={1.2} txt="HOT CAR? DO NOT." col="#ff8a7a" />} />;

// 18:18 · RAYOS X: dos boles idénticos; pasa la barra y en uno aparecen los puntos que la nariz no ve
const xray: F = ({ t, h }) => { const D = h.out - h.at; return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 0.8, 1.5], [0, 0.15, 0]), C([0.18, 0.76, 1.4], [0, 0.15, 0]), D)} set={{ warm: 0.2 }}
  scene={(tt) => { const sx = lerp(-1.3, 1.3, eio(tt, 2.2, D - 1.8)); return <>
    {[-0.5, 0.5].map((x) => <group key={x}><Bowl p={[x, 0, 0]} s={1.6} c="#3e4c5e" /><Mound p={[x, 0.15, 0]} r={0.27} y={0.5} /></group>)}
    {GRAINS(26, 0.22).map((g, i) => 0.5 + g.x < sx ? <Glow key={i} p={[0.5 + g.x, 0.155 + 0.5 * Math.sqrt(Math.max(0, 0.0729 - g.x * g.x - g.z * g.z)) + 0.012, g.z]} r={0.024} c="#ff3b2a" /> : null)}
    <Box p={[sx, 0.45, 0]} s={[0.018, 0.9, 1.1]} c="#7ae0ff" e="#7ae0ff" ei={1.4} rad={0.002} op={0.28} cast={false} /></>; }}
  over={(tt) => <Ink tt={tt} at={1} txt="NO SMELL. NO WARNING." />} />; };

// 19:44 · COMO VIDRIO: el caldo opaco se aclara y de golpe la luz le corre encima
const glass: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, 0.9, 0.85], [0, 0.18, 0]), C([0.3, 0.85, 0.8], [0, 0.18, 0]), 10)} set={{ warm: 0.5 }}
  scene={(tt) => { const k = eio(tt, 1.6, 5), g = eio(tt, 5, 7.2); return <><Cyl p={[0, 0.13, 0]} r={0.46} r2={0.42} h={0.26} c="#34373b" m={0.7} rough={0.3} />
    <mesh position={[0, 0.262, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.43, 48]} /><meshPhysicalMaterial color={col("#b9a98f", "#8c5f2d", k)} roughness={lerp(0.85, 0.05, k)} clearcoat={k} clearcoatRoughness={0.05} /></mesh>
    {g > 0.01 && g < 0.99 && <mesh position={[-0.5 + g, 0.266, 0]} rotation={[-Math.PI / 2, 0, 0.5]}><planeGeometry args={[0.1, 0.8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.62 * Math.sin(Math.PI * g)} toneMapped={false} depthWrite={false} /></mesh>}
    {[0, 1, 2].map((i) => <Box key={i} p={[0.17 * Math.cos(i * 2.3), 0.27, 0.17 * Math.sin(i * 2.3)]} s={[0.11, 0.015, 0.05]} c={["#e88b36", "#cfe0a0", "#7a5a44"][i]} rot={[0, i, 0]} rad={0.004} />)}</>; }}
  over={(tt) => <Ink tt={tt} at={2} txt="THICK AND SHINY LIKE GLASS" size={72} />} />;

// 20:00 · LA COSTRA QUE CANTA: cae la salsa, se raja y salen anillos de sonido
const sing: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 0.95, 1.05], [0, 0.1, 0]), C([-0.25, 0.9, 1.0], [0, 0.1, 0]), 11)} set={{ warm: 0.6, spotK: 0.2 }}
  scene={(tt) => { const f = eio(tt, 2.3, 4.4); return <><Plate p={[0, 0, 0]} r={0.62} /><Cyl p={[0, 0.06, 0]} r={0.46} h={0.05} c="#c8892f" rough={0.65} />
    {f > 0.02 && <Cyl p={[0, 0.087, 0]} r={Math.max(0.03, 0.34 * f)} h={0.01} c="#7c4a20" rough={0.05} />}
    {Array.from({ length: 9 }, (_, i) => { const a = i * 0.7; return f > 0.1 ? <Box key={i} p={[(0.2 + 0.1 * f) * Math.cos(a), 0.088, (0.2 + 0.1 * f) * Math.sin(a)]} s={[0.17 * f, 0.004, 0.006]} rot={[0, -a, 0]} c="#3d2412" rad={0.001} cast={false} /> : null; })}
    {[0, 1, 2, 3, 4].map((i) => { const u = ((tt - 2.4) * 0.48 + i / 5) % 1; return tt > 2.4 ? <mesh key={i} position={[0, 0.1 + u * 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.32 + 0.75 * u, 0.335 + 0.75 * u, 64]} /><meshBasicMaterial color="#ffd77a" transparent opacity={0.72 * (1 - u)} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} /></mesh> : null; })}
    <Steam p={[0, 0.1, 0]} t={tt} k={f} n={8} s={1.3} /></>; }}
  over={(tt) => <Ink tt={tt} at={3.1} txt="IT SINGS" col="#ffd76a" />} />;

// 20:50 · EL ESTANTE DE LAS DIEZ: una vitrina con diez platitos que se prenden de a uno
const shelf: F = ({ t, h }) => { const D = h.out - h.at; const Cs = ["#c88d44", "#b7bb6a", "#e9c978", "#fff0cf", "#f7cc38", "#fdfbf5", "#8c5a2c", "#d3a356", "#d59a3a", "#c8892f"];
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 1.75, 1.45], [0, 0, 0.04]), C([0.22, 1.7, 1.38], [0, 0, 0.04]), D)} set={{ warm: 0.3, spotK: 0.2 }}
    scene={(tt) => <><Box p={[0, 0.02, 0.04]} s={[2.9, 0.04, 1.35]} c="#3b2a1e" r={0.55} rad={0.015} />
      {Array.from({ length: 10 }, (_, i) => { const on = i < 4 ? 1 : cl((tt - 0.8 - (i - 4) * (D - 2.5) / 6) * 3), x = -1.08 + (i % 5) * 0.54, z = i < 5 ? -0.26 : 0.34; return <group key={i} position={[x, 0.04, z]}><Bowl p={[0, 0, 0]} s={0.9} c="#2c4a8a" fill={col("#4d4a45", Cs[i], on)} /><Puff p={[0, 0.2, 0]} r={0.26} c="#ffd99a" op={0.42 * on} /></group>; })}</>}
    over={(tt) => <Ink tt={tt} at={D - 2.4} txt="TEN DISHES. ONE LEFTOVER." size={74} />} />; };

// 21:09 · EL ÚLTIMO GRANO: una cuchara rasca el fondo y levanta un solo grano que brilla
const lastgrain: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, lerp(0.85, 0.55, eio(tt, 3, 9)), 1.0], [0, lerp(0.15, 0.5, eio(tt, 3, 9)), 0]), C([-0.2, lerp(0.85, 0.55, eio(tt, 3, 9)), 0.95], [0, lerp(0.15, 0.5, eio(tt, 3, 9)), 0]), 13)} set={{ warm: 0.55, spotK: 0.35 }}
  scene={(tt) => { const up = eio(tt, 3, 8.5); return <><Cyl p={[0, 0.14, 0]} r={0.46} r2={0.42} h={0.28} c="#2d2a28" rough={0.45} m={0.45} />
    <mesh position={[0, 0.282, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.455, 0.022, 10, 56]} /><meshStandardMaterial color="#4a4542" metalness={0.5} roughness={0.35} /></mesh>{GRAINS(9, 0.3).map((g, i) => <Grain key={i} p={[g.x - 0.08, 0.288, g.z]} s={0.42} c="#d7cdb4" rot={[Math.PI / 2, 0, g.a]} />)}<group position={[0.12, 0.34 + up * 0.3, 0]} rotation={[0, 0, 0.3]}><mesh scale={[1, 0.32, 0.75]}><sphereGeometry args={[0.1, 22, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#d5d9dd" metalness={0.95} roughness={0.12} side={THREE.DoubleSide} /></mesh><Box p={[0.32, 0.05, 0]} s={[0.5, 0.012, 0.03]} c="#d5d9dd" m={0.95} r={0.12} rad={0.004} /></group>
    <Grain p={[0.12, 0.35 + up * 0.3, 0]} s={0.5} e="#ffd77a" ei={0.3 + 0.5 * up} />
    <Ring p={[0.12, 0.3 + up * 0.3, 0]} r={0.12 + up * 0.1} k={up * 0.7} /></>; }}
  over={(tt) => <Ink tt={tt} at={7} txt="BE CAREFUL WITH THEM" col="#ffd76a" />} />;

// CUADRO 0: la miniatura sin texto ni flecha — sartén de hierro con triángulos dorados y el bol de arroz adelante, la espátula levantando uno
export const Cover0: React.FC = () => <Hero t={0.5} h={{ k: "c0", at: -5, out: 99 }} mode="iris" cam={() => C([0.2, 0.62, 1.2], [0.12, 0.14, 0])} set={{ warm: 0.65 }}
  scene={() => <><Pan p={[0.3, 0, 0]} s={1.3} heat={0.6} />{[[0.12, 0.05, 0.2], [0.5, -0.1, -0.5], [0.42, 0.25, 0.9]].map(([x, z, r], i) => <Tri key={i} p={[x, 0.17, z]} s={0.72} rot={[Math.PI / 2 - 0.08, 0, r]} c="#d59a3e" />)}
    <Tri p={[0.3, 0.52, 0]} s={0.8} rot={[1.1, 0, 0.3]} c="#c98a36" /><Box p={[0.36, 0.42, 0]} s={[0.3, 0.015, 0.25]} c="#c7cbd0" m={0.9} r={0.2} rad={0.006} /><Box p={[0.75, 0.62, -0.1]} s={[0.6, 0.04, 0.05]} c="#6b4a2c" rot={[0, 0.2, 0.55]} rad={0.015} />
    <Bowl p={[-0.72, 0, 0.25]} s={1.9} c="#c8cfd6" /><Mound p={[-0.72, 0.17, 0.25]} r={0.33} y={0.55} c="#efe4c8" /></>} />;

export const HC: Record<string, F> = { gods, coffee, germ, flat, bridge, poke, label, toppings, pond, glue, coat, rattle, edge, nabe, rinse, kingdom, tuck, swell, flag, halfcrush, corndog, chase, twenty, harbor, marriage, gravel, drops, tomorrow, hotcar, xray, glass, sing, shelf, lastgrain };
