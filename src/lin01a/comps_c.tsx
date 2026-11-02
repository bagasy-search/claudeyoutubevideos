// lin01a · LOTE B (cont.): cartera (11:24) · capas (13:26). Mismas reglas: objeto físico con material real y sombra de
// contacto, el clip del momento hundido detrás (Stage), cámara en curva, todo dentro del cuadro, golpe en la palabra exacta.
import React from "react";
import * as THREE from "three";
import { Stage, at } from "./base";
import { Esc, M, RBox, camA, canv, cl, extr, fabricTex, geo, handCard, leatherRough, lerp, printTex, rn, spr, Blob, Sombra } from "./k3d";
import type { Fi } from "./valija";

// cae desde arriba a su lugar (resorte) en el instante t0; antes no existe
export const Caida: React.FC<{ t: number; t0: number; p: [number, number, number]; r?: [number, number, number]; h?: number; sc?: number; children: React.ReactNode }> = ({ t, t0, p, r = [0, 0, 0], h = 0.42, sc = 1.5, children }) => {
  if (t < t0 - 0.3) return null;
  const k = Math.max(0, 1 - spr(t, t0 - 0.28, 1.15, 1.5));
  return <group position={[p[0], p[1] + k * h, p[2]]} rotation={[r[0] + 0.6 * k, r[1] + 0.8 * k, r[2]]} scale={sc}>{children}</group>;
};
const halo = () => canv("halo", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 4, 128, 128, 128); gr.addColorStop(0, "rgba(255,190,110,1)"); gr.addColorStop(0.4, "rgba(255,130,50,.45)"); gr.addColorStop(1, "rgba(255,90,20,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });

// ═════════ CARTERA: un tote de cuero en corte (frente bajo) donde cae, palabra por palabra, todo lo que va en la mano.
// En «suitcase» entra una valija chica con su etiqueta «PHX»; en «Denver» la tacha una raya roja y aparece «DEN»;
// en «and the suitcase» la valija se va hacia el fondo: lo que importa quedó en la cartera. ═════════
const cueroTex = () => canv("toteGrano2", 512, 512, (g) => {
  g.fillStyle = "#74391a"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 16000; i++) { g.fillStyle = rn(i, 1) > 0.5 ? `rgba(255,200,150,${0.06 * rn(i, 2)})` : `rgba(30,12,4,${0.15 * rn(i, 2)})`; g.beginPath(); g.arc(rn(i, 3) * 512, rn(i, 4) * 512, 0.7 + 1.8 * rn(i, 5), 0, 6.3); g.fill(); }
}, [2, 2]);
const Cuero: React.FC = () => <meshPhysicalMaterial map={cueroTex()} roughnessMap={leatherRough()} roughness={0.55} clearcoat={0.45} clearcoatRoughness={0.35} />;
const Canto: React.FC = () => <meshStandardMaterial color="#a8744a" roughness={0.85} />;
// costura: pespunte crema punteado sobre una tira fina
const costuraTex = () => canv("pespunte", 256, 16, (g) => { g.clearRect(0, 0, 256, 16); g.fillStyle = "#efd9b0"; for (let x = 4; x < 256; x += 16) g.fillRect(x, 5, 9, 6); }, [14, 1]);
const Costura: React.FC<{ p: [number, number, number]; w: number; rot?: [number, number, number] }> = ({ p, w, rot = [0, 0, 0] }) => <mesh position={p} rotation={rot}><planeGeometry args={[w, 0.006]} /><meshStandardMaterial map={costuraTex()} transparent alphaTest={0.4} roughness={0.8} /></mesh>;
// costado: trapecio con el corte en diagonal (frente bajo → atrás alto)
const LADO = [[-0.135, 0], [0.135, 0], [0.135, 0.075], [-0.105, 0.32], [-0.135, 0.32]];
const Tote: React.FC = () => <group>
  <RBox s={[0.66, 0.03, 0.28]} r={0.014} p={[0, 0.015, 0]}><Cuero /></RBox>
  <RBox s={[0.64, 0.34, 0.022]} r={0.01} p={[0, 0.17, -0.125]}><Cuero /></RBox>
  {[-0.315, 0.315].map((x) => <group key={x}>
    <mesh position={[x, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow geometry={extr("toteLado", LADO, 0.016, 0.003)}><Cuero /></mesh>
    {/* el canto del corte, más claro: se lee que la cartera está abierta en corte */}
    <mesh position={[x, 0.1975, 0.015]} rotation={[0.79, 0, 0]}><boxGeometry args={[0.017, 0.004, 0.345]} /><Canto /></mesh>
  </group>)}
  <RBox s={[0.64, 0.075, 0.022]} r={0.01} p={[0, 0.0375, 0.125]}><Cuero /></RBox>
  <mesh position={[0, 0.0765, 0.125]}><boxGeometry args={[0.62, 0.003, 0.018]} /><Canto /></mesh>
  <Costura p={[0, 0.062, 0.1365]} w={0.6} />
  <Costura p={[0, 0.322, -0.1135]} w={0.6} />
  <Costura p={[0, 0.04, -0.1135]} w={0.6} />
  {/* manijas: medio toroide de cuero sobre la pared de atrás */}
  {[-0.14, 0.14].map((x) => <mesh key={x} position={[x, 0.34, -0.125]} castShadow><torusGeometry args={[0.07, 0.011, 14, 48, Math.PI]} /><Cuero /></mesh>)}
  {[-0.21, -0.07, 0.07, 0.21].map((x) => <mesh key={x} position={[x, 0.335, -0.113]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.009, 0.009, 0.004, 20]} />{M.brass()}</mesh>)}
  {/* patas de bronce */}
  {[[-0.29, 0.11], [0.29, 0.11], [-0.29, -0.11], [0.29, -0.11]].map(([x, z], i) => <mesh key={i} position={[x, -0.002, z]}><sphereGeometry args={[0.009, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />{M.brass()}</mesh>)}
</group>;
const Frasco: React.FC<{ tag?: number }> = ({ tag = 0 }) => <group>
  <mesh position={[0, 0.045, 0]} castShadow><cylinderGeometry args={[0.027, 0.027, 0.09, 32]} /><meshPhysicalMaterial color="#c0661a" roughness={0.12} transmission={0.55} thickness={0.03} clearcoat={1} /></mesh>
  <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.029, 0.029, 0.022, 32]} />{M.porcelain()}</mesh>
  <mesh position={[0, 0.045, 0.0275]}><planeGeometry args={[0.04, 0.045]} /><meshStandardMaterial color="#f3eee2" roughness={0.9} /></mesh>
  {tag > 0.01 && <mesh position={[0, 0.052, 0.034]} rotation={[0, 0, -0.12 + 0.06 * Math.sin(tag * 9)]} scale={tag}><planeGeometry args={[0.072, 0.036]} /><meshStandardMaterial map={printTex("dias3", 256, 128, "#f5e7b8", [["+2 DAYS", 16, 66, 50, "#b3261e", "900"]])} roughness={0.85} side={THREE.DoubleSide} /></mesh>}
</group>;
export const Lentes: React.FC = () => <group>
  {[-0.026, 0.026].map((x) => <group key={x} position={[x, 0.006, 0]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.021, 0.0028, 10, 40]} /><meshStandardMaterial color="#2b1d16" roughness={0.35} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.02, 32]} /><meshPhysicalMaterial color="#eef6ff" roughness={0.02} transparent opacity={0.3} clearcoat={1} /></mesh>
  </group>)}
  <mesh position={[0, 0.008, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.002, 0.002, 0.012, 8]} /><meshStandardMaterial color="#2b1d16" /></mesh>
  {[-0.047, 0.047].map((x) => <mesh key={x} position={[x, 0.006, -0.04]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.002, 0.002, 0.08, 8]} /><meshStandardMaterial color="#2b1d16" /></mesh>)}
</group>;
const Llaves: React.FC = () => <group>
  <mesh position={[0, 0.003, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.016, 0.0022, 10, 40]} />{M.chrome()}</mesh>
  {[0.4, -0.5].map((a, i) => <group key={i} rotation={[0, a, 0]}><RBox s={[0.05, 0.003, 0.014]} r={0.001} p={[0.038, 0.003, 0]}>{M.brass()}</RBox><mesh position={[0.016, 0.003, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.011, 0.011, 0.003, 24]} />{M.brass()}</mesh></group>)}
</group>;
const Valijita: React.FC<{ s: number }> = ({ s }) => {
  const k = s < 1 ? 0 : s < 2 ? 1 : 2;
  const tagT = printTex("tag" + k, 256, 150, "#f4efe4", [[k === 2 ? "DEN" : "PHX", 30, 78, 84, k === 2 ? "#b3261e" : "#1d2430", "900"]], (g) => {
    g.fillStyle = "#1d2a4a"; g.fillRect(0, 0, 256, 18); g.fillRect(0, 132, 256, 18);
    if (k === 2) { g.globalAlpha = 0.35; g.font = "900 40px Montserrat, Arial"; g.fillStyle = "#1d2430"; g.fillText("PHX", 160, 78); g.globalAlpha = 1; g.strokeStyle = "#c62a22"; g.lineWidth = 9; g.beginPath(); g.moveTo(150, 92); g.lineTo(240, 64); g.stroke(); }
    if (k === 1) { g.strokeStyle = "#c62a22"; g.lineWidth = 12; g.beginPath(); g.moveTo(22, 104); g.lineTo(226, 52); g.stroke(); }
  });
  return <group>
    <RBox s={[0.24, 0.32, 0.12]} r={0.03} p={[0, 0.17, 0]}>{M.plastic({ col: "#1f2c4c" })}</RBox>
    {[-0.07, 0, 0.07].map((x) => <mesh key={x} position={[x, 0.17, 0.061]}><boxGeometry args={[0.012, 0.28, 0.004]} />{M.plastic({ col: "#2b3a60" })}</mesh>)}
    <RBox s={[0.1, 0.02, 0.025]} r={0.008} p={[0, 0.34, 0]}>{M.rubber({ col: "#15181d" })}</RBox>
    {[-0.08, 0.08].map((x) => <mesh key={x} position={[x, 0.012, 0.04]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.012, 20]} />{M.rubber({ col: "#15181d" })}</mesh>)}
    {/* la etiqueta colgando de la manija, al frente */}
    <mesh position={[0.04, 0.27, 0.07]} rotation={[0, 0, 0.08]}><planeGeometry args={[0.11, 0.065]} /><meshStandardMaterial map={tagT} roughness={0.85} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.025, 0.315, 0.066]} rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.0015, 0.0015, 0.05, 6]} /><meshStandardMaterial color="#c9b98a" /></mesh>
  </group>;
};
export const Cartera: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!;
  const T = { med: wow, dias: at("two extra", a), id: at("ID", a), len: at("reading glasses", a) + 0.3, car: at("charger", a), pen: at("pen", a), snk: at("snack", a), shw: at("shawl", a), key: at("keys", a), suit: at("suitcase", a), den: at("Denver", a), out: at("and the suitcase", a) + 0.15 };
  const inK = spr(t, a - 0.1, 0.8, 1.5), slide = 1 - spr(t, T.suit - 0.3, 0.9, 1.5), leave = cl((t - T.out) / 0.9);
  const sState = t < T.den ? 0 : t < T.den + 0.7 ? 1 : 2;
  const cam = camA(t, a, b, { p: [-0.42, 0.9, 1.3], l: [-0.06, 0.15, 0], fov: 34 }, { p: [0.42, 0.66, 1.18], l: [-0.08, 0.14, 0], fov: 34 });
  return <Stage t={t} a={a} b={b} dim={0.66} tint="#f1dcc0">
    <Esc cam={cam} key1={[-1.0, 2.0, 1.3]} warm={1.1} cool={0.9}>
      <Sombra w={2.6} d={1.6} o={0.38} y={-0.001} />
      <group position={[0.08, 0, -1.6 * (1 - inK)]}>
        <Blob w={0.9} d={0.45} o={0.55} />
        <Tote />
        <Caida t={t} t0={T.med} p={[-0.245, 0.03, -0.05]}><Frasco /></Caida>
        <Caida t={t} t0={T.med + 0.12} p={[-0.155, 0.03, -0.06]} r={[0, 0.5, 0]}><Frasco /></Caida>
        <Caida t={t} t0={T.med + 0.24} p={[-0.2, 0.03, 0.05]} r={[0, 0, 0]} h={0.5}><Frasco tag={spr(t, T.dias - 0.1, 1, 1.6)} /></Caida>
        <Caida t={t} t0={T.id} p={[0.05, 0.075, -0.1]} r={[1.2, 0.08, 0]}>
          <RBox s={[0.086, 0.003, 0.054]} r={0.002} p={[0, 0.0015, 0]}>{M.plastic({ col: "#dfe7ee" })}</RBox>
          <mesh position={[0, 0.0035, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.082, 0.05]} /><meshStandardMaterial map={printTex("idc", 256, 160, "#dfe7ee", [["ID", 128, 70, 64, "#1d2a4a", "900"]], (g) => { g.fillStyle = "#9aa9b8"; g.fillRect(18, 30, 86, 104); g.fillStyle = "#1d2a4a"; g.fillRect(128, 112, 108, 8); g.fillRect(128, 128, 80, 8); })} roughness={0.4} /></mesh>
        </Caida>
        <Caida t={t} t0={T.shw} p={[0.04, 0.03, -0.02]} sc={1.1}><RBox s={[0.17, 0.05, 0.1]} r={0.02} p={[0, 0.025, 0]}><meshStandardMaterial map={fabricTex("lana", [0.6, 0.6])} color="#c9a7a0" roughness={0.95} /></RBox></Caida>
        <Caida t={t} t0={T.len} p={[0.03, 0.09, -0.015]} r={[0, -0.2, 0]}><Lentes /></Caida>
        <Caida t={t} t0={T.car} p={[0.17, 0.03, 0.055]}>
          <RBox s={[0.036, 0.028, 0.036]} r={0.005} p={[0, 0.014, 0]}>{M.porcelain()}</RBox>
          <mesh position={[0.035, 0.004, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.024, 0.0028, 8, 40]} />{M.porcelain()}</mesh>
        </Caida>
        <Caida t={t} t0={T.pen} p={[0.0, 0.036, 0.09]} r={[0, 0.08, 0]} sc={1.1}><mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.005, 0.005, 0.13, 16]} />{M.plastic({ col: "#1d2a4a" })}</mesh></Caida>
        <Caida t={t} t0={T.snk} p={[0.22, 0.03, -0.065]} r={[0, -0.25, 0]}><RBox s={[0.1, 0.016, 0.036]} r={0.006} p={[0, 0.008, 0]}>{M.plastic({ col: "#c9772e" })}</RBox></Caida>
        <Caida t={t} t0={T.key} p={[0.245, 0.03, 0.065]} sc={1.3} r={[0, 0.6, 0]}><Llaves /></Caida>
      </group>
      {/* la valija que se pierde */}
      {t > T.suit - 0.35 && leave < 1 && <group position={[-0.62 - 0.9 * slide - 0.3 * leave * leave, 0, -2.2 * leave * leave]} rotation={[0, 0.25 + 0.6 * leave, 0]}>
        <Blob w={0.46} d={0.28} o={0.75 * (1 - leave)} />
        <Valijita s={sState} />
      </group>}
    </Esc>
  </Stage>;
};

// ═════════ CAPAS: una mesita rebatible de avión con un termómetro sin números: el frío de la cabina lo baja a azul.
// Cae el chal doblado (con flecos), después dos medias de lana; en «warm socks» las medias encienden naranja, sube un
// calor ondulado y el termómetro sube a ámbar. «my secret» se escribe a mano en una tarjeta sobre la mesita. ═════════
const Termometro: React.FC<{ lvl: number; warm: number }> = ({ lvl, warm }) => {
  const col = new THREE.Color("#3f9cff").lerp(new THREE.Color("#ff8a2a"), warm), H = 0.26;
  return <group>
    <RBox s={[0.1, 0.022, 0.075]} r={0.009} p={[0, 0.011, 0]}>{M.steel({ col: "#9aa1a8" })}</RBox>
    <mesh position={[0, 0.062, 0]}><sphereGeometry args={[0.038, 40, 28]} /><meshPhysicalMaterial color={col} emissive={col} emissiveIntensity={0.3 + 0.6 * warm} roughness={0.08} clearcoat={1} /></mesh>
    <mesh position={[0, 0.062 + H / 2, 0]}><cylinderGeometry args={[0.026, 0.026, H, 40, 1, true]} /><meshPhysicalMaterial color="#f2f8ff" roughness={0.03} transmission={0.92} thickness={0.01} transparent opacity={0.5} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[0, 0.062 + H, 0]}><sphereGeometry args={[0.026, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#f2f8ff" roughness={0.03} transmission={0.92} thickness={0.01} transparent opacity={0.5} clearcoat={1} depthWrite={false} /></mesh>
    <mesh position={[0, 0.062 + (H * lvl) / 2, 0]}><cylinderGeometry args={[0.011, 0.011, H * lvl, 24]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.35 + 0.7 * warm} roughness={0.3} /></mesh>
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0, 0.1 + i * 0.032, 0.0262]}><boxGeometry args={[i % 2 ? 0.012 : 0.022, 0.0018, 0.001]} /><meshStandardMaterial color="#2a3038" /></mesh>)}
  </group>;
};
const sockTex = () => canv("sockKnit2", 128, 128, (g) => {
  g.fillStyle = "#cdc5b8"; g.fillRect(0, 0, 128, 128);
  for (let x = 0; x < 128; x += 8) for (let y = 0; y < 128; y += 6) { g.strokeStyle = `rgba(110,100,88,${0.3 + 0.15 * rn(x * 3 + y, 1)})`; g.lineWidth = 1.3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 4, y + 5); g.lineTo(x + 8, y); g.stroke(); }
  for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(${rn(i, 1) > 0.5 ? "255,255,255" : "40,30,20"},${0.1 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 128, rn(i, 4) * 128, 1.5, 1.5); }
}, [16, 16]);
// silueta de media con curvas (talón y punta redondos), extruida con bisel blando
const mediaG = () => geo("media3", () => {
  const s = new THREE.Shape();
  s.moveTo(0, 0.18); s.lineTo(0, 0.06); s.quadraticCurveTo(0, 0, 0.05, 0); s.lineTo(0.125, 0); s.quadraticCurveTo(0.168, 0, 0.168, 0.033);
  s.quadraticCurveTo(0.168, 0.066, 0.125, 0.066); s.lineTo(0.09, 0.066); s.quadraticCurveTo(0.072, 0.068, 0.072, 0.09); s.lineTo(0.072, 0.18); s.lineTo(0, 0.18);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.007, bevelSize: 0.007, bevelSegments: 6, curveSegments: 24 });
  g.translate(-0.08, -0.09, -0.004); g.computeVertexNormals(); return g;
});
const Media: React.FC<{ glow: number }> = ({ glow }) => {
  const c = new THREE.Color("#d8d0c4").lerp(new THREE.Color("#f6c08a"), glow);
  return <group rotation={[-Math.PI / 2, 0, 0]}>
    <mesh castShadow receiveShadow geometry={mediaG()}><meshStandardMaterial map={sockTex()} color={c} emissive="#ff7a2a" emissiveIntensity={0.22 * glow} roughness={0.95} /></mesh>
    {[0.062, 0.076].map((y) => <mesh key={y} position={[-0.044, y, 0.0115]}><planeGeometry args={[0.072, 0.006]} /><meshStandardMaterial color="#9b2a22" roughness={0.9} /></mesh>)}
  </group>;
};
// calor que sube: cintas onduladas naranjas
const ondaTex = () => canv("onda", 64, 256, (g) => { g.clearRect(0, 0, 64, 256); g.strokeStyle = "rgba(255,150,70,1)"; g.lineWidth = 6; g.lineCap = "round"; g.beginPath(); for (let y = 250; y > 6; y -= 4) g.lineTo(32 + 16 * Math.sin(y / 22), y); g.stroke(); });
const trenza = () => canv("trenza", 256, 256, (g) => {
  g.fillStyle = "#7a2230"; g.fillRect(0, 0, 256, 256);
  for (let c = 0; c < 8; c++) for (let y = 0; y < 256; y += 14) { const x = c * 32 + 16; g.strokeStyle = "rgba(200,110,120,.28)"; g.lineWidth = 5; g.beginPath(); g.moveTo(x - 11, y); g.quadraticCurveTo(x, y + 10, x + 11, y); g.stroke(); g.strokeStyle = "rgba(40,5,10,.3)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 11, y + 4); g.quadraticCurveTo(x, y + 14, x + 11, y + 4); g.stroke(); }
  for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${rn(i, 1) > 0.5 ? "255,220,220" : "30,0,5"},${0.08 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 1.5, 1.5); }
}, [1.2, 0.8]);
const Chal: React.FC = () => { const mat = () => <meshStandardMaterial map={trenza()} roughness={0.96} />; return <group>
  <RBox s={[0.26, 0.022, 0.17]} r={0.01} p={[0, 0.011, 0]}>{mat()}</RBox>
  <RBox s={[0.255, 0.022, 0.165]} r={0.01} p={[-0.004, 0.032, 0.003]} rot={[0, 0.03, 0]}>{mat()}</RBox>
  <RBox s={[0.25, 0.022, 0.16]} r={0.01} p={[0.003, 0.053, -0.002]} rot={[0, -0.02, 0]}>{mat()}</RBox>
  {/* pliegue redondeado del frente y flecos del extremo */}
  <mesh position={[0, 0.032, 0.083]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.02, 0.23, 6, 16]} />{mat()}</mesh>
  {Array.from({ length: 13 }, (_, i) => <mesh key={i} position={[0.138 + 0.012 * rn(i, 1), 0.006, -0.072 + i * 0.012]} rotation={[0, 0, Math.PI / 2 + 0.1 * (rn(i, 2) - 0.5)]}><cylinderGeometry args={[0.0022, 0.0018, 0.032, 6]} /><meshStandardMaterial color="#8a2a36" roughness={0.95} /></mesh>)}
</group>; };
export const Capas: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, shw = at("shawl", a), pair = at("pair of socks", a), sec = at("my secret", a);
  const cold = cl((t - a) / 1.6), warm = spr(t, wow - 0.05, 0.9, 1.3), wk = cl(warm), lvl = 0.72 - 0.45 * cold + 0.5 * wk;
  const inK = spr(t, a - 0.1, 0.8, 1.5), card = cl((t - sec + 0.1) / 0.55), cardIn = spr(t, sec - 0.35, 1, 1.5);
  const cam = camA(t, a, b, { p: [-0.3, 0.56, 0.9], l: [0, 0.07, 0], fov: 34 }, { p: [0.18, 0.54, 0.84], l: [0.0, 0.05, 0.02], fov: 34 });
  return <Stage t={t} a={a} b={b} dim={0.6} tint={warm > 0.3 ? "#f4dcc0" : "#d6e4f2"}>
    <Esc cam={cam} key1={[-0.9, 1.9, 1.2]} warm={0.7 + 0.6 * wk} cool={1.3 - 0.5 * wk}>
      <Sombra w={2.4} d={1.6} o={0.38} y={-0.026} />
      <group position={[0, 0, -1.4 * (1 - inK)]}>
        {/* la mesita: plástico gris con canto redondeado y el rebaje del vaso */}
        <RBox s={[0.66, 0.025, 0.4]} r={0.012} p={[0, -0.0125, 0]}><meshPhysicalMaterial color="#62676d" roughness={0.5} clearcoat={0.25} clearcoatRoughness={0.5} /></RBox>
        <mesh position={[0.26, 0.0006, -0.135]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.04, 0.046, 48]} /><meshStandardMaterial color="#4e5257" roughness={0.9} /></mesh>
        <group position={[-0.23, 0, -0.09]}><Blob w={0.2} d={0.15} o={0.55} /><Termometro lvl={lvl} warm={wk} /></group>
        {/* frío: motas blancas que suben alrededor del termómetro */}
        {Array.from({ length: 14 }, (_, i) => { const ph = (t * 0.25 + rn(i, 1)) % 1, o = cold * (1 - cl(warm * 1.5)) * Math.sin(ph * Math.PI) * 0.8; return o > 0.01 && <mesh key={i} position={[-0.23 + (rn(i, 2) - 0.5) * 0.24, 0.04 + ph * 0.32, -0.09 + (rn(i, 3) - 0.5) * 0.16]}><sphereGeometry args={[0.004 + 0.003 * rn(i, 4), 8, 6]} /><meshBasicMaterial color="#e6f3ff" transparent opacity={o} depthWrite={false} /></mesh>; })}
        <Caida t={t} t0={shw} p={[-0.01, 0, -0.06]} r={[0, 0.1, 0]} sc={1}><Blob w={0.34} d={0.24} o={0.5} y={0.001} /><Chal /></Caida>
        {/* el resplandor bajo las medias y el calor que sube, en «warm» */}
        {warm > 0.01 && <mesh position={[0.18, 0.002, 0.08]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.36 * wk, 0.3 * wk]} /><meshBasicMaterial map={halo()} transparent opacity={0.8 * wk} toneMapped={false} depthWrite={false} /></mesh>}
        {warm > 0.05 && [0, 1, 2].map((i) => { const ph = ((t - wow) * 0.6 + i / 3) % 1; return <mesh key={i} position={[0.13 + 0.05 * i, 0.07 + 0.09 * ph, 0.08 - 0.02 * i]} rotation={[0, 0.25, 0]}><planeGeometry args={[0.03, 0.12]} /><meshBasicMaterial map={ondaTex()} transparent opacity={0.6 * wk * Math.sin(ph * Math.PI)} toneMapped={false} depthWrite={false} /></mesh>; })}
        <Caida t={t} t0={pair} p={[0.14, 0.014, 0.075]} r={[0, 0.3, 0]} sc={1}><Blob w={0.22} d={0.22} o={0.4} y={-0.012} /><Media glow={wk} /></Caida>
        <Caida t={t} t0={pair + 0.18} p={[0.215, 0.03, 0.095]} r={[0, -0.2, 0]} sc={1}><Media glow={wk} /></Caida>
        {/* «my secret»: la tarjeta escrita a mano, sobre la mesita adelante a la izquierda */}
        {cardIn > 0.01 && <Blob w={0.26 * cl(cardIn)} d={0.17 * cl(cardIn)} o={0.5 * cl(cardIn)} y={0.0015} />}
        {cardIn > 0.01 && <mesh castShadow position={[-0.15, 0.006 + 0.25 * Math.max(0, 1 - cardIn), 0.11]} rotation={[-Math.PI / 2 + 0.12, 0, 0.06]} scale={lerp(0.6, 1, cl(cardIn))}><planeGeometry args={[0.2, 0.125]} /><meshStandardMaterial map={handCard("my secret", card, 512, 320, { size: 120 })} roughness={0.9} side={THREE.DoubleSide} /></mesh>}
      </group>
    </Esc>
  </Stage>;
};
