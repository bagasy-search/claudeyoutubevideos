// lhh29d · piezas compartidas de la sal de mesa: granos cúbicos (la sal cristaliza en cubitos), montoncito, chorro, la caja
// azul redonda con pico, sartén de hierro, jarra de café, huevo, plancha, bol, pava, ladrillo, costeleta y adorno de masa.
// No exporta nada que empiece con H (body_gen sólo cuenta los héroes).
import React from "react";
import * as THREE from "three";
import { M, RBox, tex, rn } from "./h3d";

const PI = Math.PI;
export const SERIF = "Georgia, 'Times New Roman', serif";
export const lathe = (pts: number[][], seg = 64) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
const GC = new Map<string, THREE.BufferGeometry>();
export const gk = <T extends THREE.BufferGeometry>(k: string, mk: () => T): T => { const c = GC.get(k) as T | undefined; if (c) return c; const g = mk(); GC.set(k, g); return g; };
export const lg = (k: string, pts: number[][], seg = 64) => gk("lg" + k, () => lathe(pts, seg));
const cl1 = (x: number) => Math.max(0, Math.min(1, x));
type V = number[];
const P3 = (v?: V) => (v ?? [0, 0, 0]) as [number, number, number];

// ---- sal: material de grano (blanco translúcido con brillo) y textura de montón (puntitos que chispean)
export const saltMat = (col = "#fbfcfd", op = 1) => <meshPhysicalMaterial color={col} roughness={0.25} transmission={0.15} thickness={0.002} clearcoat={0.6} transparent={op < 1} opacity={op} />;
export const pileTex = (tint = "#ffffff") => tex.text("pile" + tint, 256, 256, (g) => {
  g.fillStyle = tint; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) { const v = 205 + rn(i, 2) * 50; g.fillStyle = `rgba(${v},${v},${v + 4},.9)`; const s = 1 + rn(i, 3) * 2.5; g.fillRect(rn(i, 4) * 256, rn(i, 5) * 256, s, s); }
  for (let i = 0; i < 160; i++) { g.fillStyle = "rgba(150,160,170,.35)"; g.fillRect(rn(i, 6) * 256, rn(i, 7) * 256, 2, 2); }
});
// montoncito de sal (cono con base redondeada y borde irregular); h = alto, r = radio, tint = color que va tomando (jugo, jarabe)
export const SaltPile: React.FC<{ r?: number; h?: number; p?: V; tint?: string; op?: number }> = ({ r = 0.06, h = 0.03, p, tint = "#ffffff", op = 1 }) => {
  const g = gk(`pile${r}|${h}`, () => { const pts: number[][] = []; for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push([r * (1 - u) * (1 + 0.04 * Math.sin(i * 3)), h * Math.pow(Math.sin((u * PI) / 2), 0.8)]); }
    const geo = lathe(pts.reverse().concat([[r * 1.02, 0]]).reverse(), 48); const pp = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pp.count; i++) { const k = 1 + 0.07 * (rn(i, 9) - 0.5); pp.setXYZ(i, pp.getX(i) * k, pp.getY(i), pp.getZ(i) * k); } geo.computeVertexNormals(); return geo; });
  return <mesh geometry={g} position={P3(p)} castShadow receiveShadow><meshStandardMaterial map={pileTex(tint)} color={tint} roughness={0.55} bumpMap={pileTex()} bumpScale={2} transparent={op < 1} opacity={op} /></mesh>;
};
// granos sueltos (cubitos), sembrados en un disco; n granos, k = cuántos ya cayeron (0..1)
export const Grains: React.FC<{ n?: number; r?: number; p?: V; k?: number; seed?: number; s?: number; col?: string; y?: number }> = ({ n = 60, r = 0.06, p, k = 1, seed = 1, s = 0.0035, col, y = 0 }) =>
  <group position={P3(p)}>{Array.from({ length: n }, (_, i) => { const kk = cl1(k * n - i); if (kk <= 0) return null; const a = rn(i, seed) * 6.28, rr = Math.sqrt(rn(i, seed + 1)) * r;
    return <mesh key={i} position={[Math.cos(a) * rr, y + s / 2 + (1 - kk) * 0.12, Math.sin(a) * rr]} rotation={[rn(i, seed + 2) * 3, rn(i, seed + 3) * 3, 0]} castShadow><boxGeometry args={[s, s, s]} />{saltMat(col)}</mesh>; })}</group>;
// chorro de sal que cae de a granitos desde (x, y0) hasta y1; on = 0..1 caudal
export const Stream: React.FC<{ tt: number; p: V; y1: number; on?: number; n?: number; spread?: number }> = ({ tt, p, y1, on = 1, n = 26, spread = 0.008 }) => {
  if (on <= 0.02) return null; const L = p[1] - y1;
  return <group>{Array.from({ length: n }, (_, i) => { const u = ((tt * 1.6 + i / n) % 1); if (rn(i, 4) > on) return null;
    return <mesh key={i} position={[p[0] + (rn(i, 5) - 0.5) * spread * (1 + u * 2), p[1] - u * u * L, p[2] + (rn(i, 6) - 0.5) * spread * (1 + u * 2)]} rotation={[i, i * 2, 0]}><boxGeometry args={[0.003, 0.003, 0.003]} />{saltMat()}</mesh>; })}</group>;
};

// ---- la caja azul redonda de sal con su pico de metal; tilt = inclinación para verter, spout 0..1 = pico abierto
const boxLabel = () => tex.text("saltbox", 1024, 512, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#1f4fa3"); gr.addColorStop(1, "#173d82"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
  g.fillStyle = "#f3f0e6"; g.fillRect(0, 140, 1024, 200); g.fillStyle = "#1f4fa3"; g.font = "bold 120px " + SERIF; g.textAlign = "center"; g.fillText("TABLE SALT", 512, 280);
  g.fillStyle = "#ffffff"; g.font = "bold 46px " + SERIF; g.fillText("PLAIN · 26 OZ", 512, 420); g.fillStyle = "#d8b24a"; g.fillRect(0, 128, 1024, 10); g.fillRect(0, 342, 1024, 10);
});
export const SaltBox: React.FC<{ p?: V; rot?: V; s?: number; spout?: number }> = ({ p, rot, s = 1, spout = 0 }) =>
  <group position={P3(p)} rotation={P3(rot)} scale={s}>
    <mesh position={[0, 0.07, 0]} castShadow><cylinderGeometry args={[0.045, 0.045, 0.14, 48, 1, true]} /><meshStandardMaterial map={boxLabel()} roughness={0.6} /></mesh>
    <mesh position={[0, 0.1402, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.045, 48]} /><meshStandardMaterial color="#1c4896" roughness={0.6} /></mesh>
    <mesh position={[0, 0.001, 0]} rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.045, 48]} /><meshStandardMaterial color="#173d82" roughness={0.6} /></mesh>
    <group position={[0.028, 0.141, 0]} rotation={[0, 0, spout * 1.1]}><RBox s={[0.022, 0.002, 0.016]} p={[-0.011, 0.001, 0]} r={0.0008}>{M.steel({})}</RBox></group>
  </group>;

// ---- sartén de hierro fundido (negra, con mango y pico); seasoning 0..1 = de gris opaco a negro brillante; rust 0..1
export const Skillet: React.FC<{ p?: V; rot?: V; s?: number; seasoning?: number; rust?: number }> = ({ p, rot, s = 1, seasoning = 1, rust = 0 }) => {
  const c = new THREE.Color("#4a4744").lerp(new THREE.Color("#141312"), seasoning).lerp(new THREE.Color("#8a4a1e"), rust * 0.8);
  const m = <meshPhysicalMaterial color={c} roughness={0.75 - 0.4 * seasoning + 0.2 * rust} metalness={0.5} clearcoat={0.4 * seasoning} map={rust > 0 ? tex.rust() : undefined} side={THREE.DoubleSide} />;
  return <group position={P3(p)} rotation={P3(rot)} scale={s}>
    <mesh geometry={lg("skillet", [[0, 0], [0.12, 0], [0.135, 0.008], [0.145, 0.04], [0.15, 0.042], [0.142, 0.042], [0.132, 0.012], [0.118, 0.006], [0, 0.006]], 72)} castShadow receiveShadow>{m}</mesh>
    <RBox s={[0.17, 0.016, 0.03]} p={[-0.22, 0.032, 0]} rot={[0, 0, 0.12]} r={0.007}>{m}</RBox>
    <mesh position={[-0.29, 0.042, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.011, 0.004, 8, 20]} />{m}</mesh>
  </group>;
};

// ---- jarra de café de vidrio con mango negro; film 0..1 = película marrón por dentro
export const Carafe: React.FC<{ p?: V; rot?: V; s?: number; film?: number }> = ({ p, rot, s = 1, film = 0 }) =>
  <group position={P3(p)} rotation={P3(rot)} scale={s}>
    <mesh geometry={lg("carafe", [[0, 0], [0.07, 0], [0.085, 0.03], [0.088, 0.07], [0.07, 0.12], [0.05, 0.15], [0.052, 0.17]], 64)}>{M.glass({ op: 0.28 })}</mesh>
    {film > 0.02 && <mesh geometry={lg("carafeF", [[0, 0.002], [0.067, 0.002], [0.082, 0.03], [0.085, 0.07], [0.068, 0.118], [0.049, 0.146]], 64)} scale={0.97}><meshStandardMaterial color="#6a3f1c" transparent opacity={0.55 * film} roughness={0.7} side={THREE.DoubleSide} depthWrite={false} /></mesh>}
    <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.056, 0.056, 0.018, 40, 1, true]} /><meshPhysicalMaterial color="#141414" roughness={0.3} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
    <mesh position={[-0.095, 0.1, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.045, 0.009, 12, 32, PI]} /><meshPhysicalMaterial color="#141414" roughness={0.3} clearcoat={0.8} /></mesh>
  </group>;

// ---- huevo (lathe), cáscara blanca o marrón; crack = rajadura dibujada
export const eggG = () => gk("egg", () => { const pts: number[][] = []; for (let i = 0; i <= 24; i++) { const u = i / 24, a = u * PI; pts.push([Math.sin(a) * 0.024 * (1 - 0.18 * Math.cos(a)), -Math.cos(a) * 0.031]); } return lathe(pts, 48); });
export const Egg: React.FC<{ p?: V; rot?: V; s?: number; brown?: boolean; op?: number }> = ({ p, rot, s = 1, brown, op = 1 }) =>
  <mesh geometry={eggG()} position={P3(p)} rotation={P3(rot)} scale={s} castShadow><meshPhysicalMaterial color={brown ? "#d8a878" : "#f6f1e6"} roughness={0.5} clearcoat={0.2} transparent={op < 1} opacity={op} /></mesh>;

// ---- plancha de ropa: suela (forma de proa) cromada, cuerpo crema, manija; film 0..1 = película marrón en la suela
const ironShape = () => { const sh = new THREE.Shape(); sh.moveTo(-0.1, -0.05); sh.lineTo(0.04, -0.05); sh.quadraticCurveTo(0.11, -0.03, 0.13, 0); sh.quadraticCurveTo(0.11, 0.03, 0.04, 0.05); sh.lineTo(-0.1, 0.05); sh.lineTo(-0.1, -0.05); return sh; };
export const ironSoleG = (hgt = 0.012) => gk("ironsole" + hgt, () => new THREE.ExtrudeGeometry(ironShape(), { depth: hgt, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 3 }));
export const Iron: React.FC<{ p?: V; rot?: V; s?: number; film?: number; holes?: boolean }> = ({ p, rot, s = 1, film = 0, holes = true }) => {
  const sole = <meshStandardMaterial color={new THREE.Color("#e9edf0").lerp(new THREE.Color("#7a4a1e"), film * 0.85)} metalness={1 - 0.5 * film} roughness={0.15 + 0.5 * film} />;
  return <group position={P3(p)} rotation={P3(rot)} scale={s}>
    <mesh geometry={ironSoleG()} rotation={[-PI / 2, 0, 0]} castShadow>{sole}</mesh>
    <mesh geometry={ironSoleG(0.04)} rotation={[-PI / 2, 0, 0]} position={[0, 0.016, 0]} scale={[0.92, 0.85, 1]} castShadow>{M.plastic({ col: "#e8dcc4" })}</mesh>
    <RBox s={[0.16, 0.022, 0.03]} p={[-0.01, 0.1, 0]} r={0.01}>{M.plastic({ col: "#3a6ea5" })}</RBox>
    {[-0.07, 0.05].map((x, i) => <RBox key={i} s={[0.018, 0.05, 0.026]} p={[x, 0.075, 0]} r={0.006}>{M.plastic({ col: "#3a6ea5" })}</RBox>)}
    {holes && Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-0.06 + (i % 5) * 0.03, -0.0035, (i < 5 ? -1 : 1) * 0.018]} rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.003, 12]} /><meshBasicMaterial color="#222" /></mesh>)}
  </group>;
};

// ---- bol de loza (lathe) con agua opcional; water = altura 0..1
export const Bowl: React.FC<{ p?: V; s?: number; col?: string; water?: number; wcol?: string }> = ({ p, s = 1, col = "#f4efe4", water = 0, wcol = "#9fd0ea" }) =>
  <group position={P3(p)} scale={s}>
    <mesh geometry={lg("bowl", [[0, 0], [0.06, 0], [0.1, 0.03], [0.13, 0.075], [0.136, 0.08], [0.128, 0.08], [0.122, 0.075], [0.093, 0.033], [0.055, 0.006], [0, 0.006]], 64)} castShadow receiveShadow>{M.porcelain({ col, side: THREE.DoubleSide })}</mesh>
    {water > 0 && <mesh position={[0, 0.006 + 0.068 * water, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.058 + 0.066 * water, 64]} />{M.water({ col: wcol, op: 0.7 })}</mesh>}
  </group>;

// ---- pava de chapa esmaltada con pico; tilt para servir
export const Kettle: React.FC<{ p?: V; rot?: V; s?: number; col?: string }> = ({ p, rot, s = 1, col = "#b8322a" }) =>
  <group position={P3(p)} rotation={P3(rot)} scale={s}>
    <mesh geometry={lg("kettle", [[0, 0], [0.09, 0], [0.1, 0.03], [0.095, 0.08], [0.06, 0.12], [0.03, 0.13], [0, 0.135]], 48)} castShadow>{M.porcelain({ col })}</mesh>
    <mesh position={[0.11, 0.07, 0]} rotation={[0, 0, -0.9]}><cylinderGeometry args={[0.008, 0.016, 0.1, 16]} />{M.porcelain({ col })}</mesh>
    <mesh position={[0, 0.15, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.06, 0.005, 8, 24, PI]} />{M.steel({})}</mesh>
  </group>;

// ---- ladrillo rojo viejo
const brickTex = () => tex.text("brick", 256, 128, (g) => { g.fillStyle = "#9c4430"; g.fillRect(0, 0, 256, 128);
  for (let i = 0; i < 700; i++) { const v = rn(i, 1); g.fillStyle = v > 0.5 ? `rgba(60,20,10,${0.2 * rn(i, 2)})` : `rgba(220,140,100,${0.2 * rn(i, 3)})`; g.fillRect(rn(i, 4) * 256, rn(i, 5) * 128, 3, 3); } });
export const Brick: React.FC<{ p?: V; rot?: V; s?: number }> = ({ p, rot, s = 1 }) =>
  <RBox s={[0.2 * s, 0.055 * s, 0.095 * s]} p={p} rot={rot} r={0.006}><meshStandardMaterial map={brickTex()} roughness={0.9} bumpMap={brickTex()} bumpScale={2} /></RBox>;

// ---- costeleta de cerdo (forma con hueso), cook 0..1 = de rosada cruda a dorada; dry 0..1 = gris reseca
const chopShape = () => { const sh = new THREE.Shape(); sh.moveTo(-0.09, -0.02); sh.bezierCurveTo(-0.1, 0.05, -0.02, 0.075, 0.04, 0.06); sh.bezierCurveTo(0.09, 0.05, 0.1, 0.0, 0.08, -0.035);
  sh.bezierCurveTo(0.06, -0.06, 0.0, -0.05, -0.03, -0.05); sh.bezierCurveTo(-0.07, -0.05, -0.085, -0.04, -0.09, -0.02); return sh; };
export const chopG = () => gk("chop", () => new THREE.ExtrudeGeometry(chopShape(), { depth: 0.018, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.005, bevelSegments: 4, curveSegments: 24 }));
export const PorkChop: React.FC<{ p?: V; rot?: V; s?: number; cook?: number; dry?: number; juice?: number }> = ({ p, rot, s = 1, cook = 0, dry = 0, juice = 0 }) => {
  const c = new THREE.Color("#e9a59a").lerp(new THREE.Color("#c4843f"), cook).lerp(new THREE.Color("#8d7a68"), dry * 0.75);
  return <group position={P3(p)} rotation={P3(rot)} scale={s}>
    <mesh geometry={chopG()} rotation={[-PI / 2, 0, 0]} castShadow receiveShadow><meshPhysicalMaterial color={c} roughness={0.55 + 0.3 * dry - 0.3 * juice} clearcoat={0.7 * juice} clearcoatRoughness={0.2} /></mesh>
    <mesh position={[-0.07, 0.013, 0.022]} rotation={[0, 0.6, 0]} scale={[1, 0.4, 0.5]}><sphereGeometry args={[0.022, 20, 12]} /><meshStandardMaterial color="#f4eadb" roughness={0.6} /></mesh>
  </group>;
};

// ---- adorno de masa de sal (estrella o ángel extruido), paint 0..1 = pintado
const starShape = () => { const sh = new THREE.Shape(); for (let i = 0; i <= 10; i++) { const a = (i / 10) * PI * 2 + PI / 2, r = i % 2 ? 0.022 : 0.05; i ? sh.lineTo(Math.cos(a) * r, Math.sin(a) * r) : sh.moveTo(Math.cos(a) * r, Math.sin(a) * r); } return sh; };
const angelShape = () => { const sh = new THREE.Shape(); sh.moveTo(0, 0.06); sh.absarc(0, 0.045, 0.014, PI / 2, PI / 2 + PI * 2, false); sh.moveTo(-0.012, 0.03);
  sh.lineTo(-0.055, 0.04); sh.quadraticCurveTo(-0.06, 0.0, -0.02, 0.005); sh.lineTo(-0.035, -0.05); sh.lineTo(0.035, -0.05); sh.lineTo(0.02, 0.005); sh.quadraticCurveTo(0.06, 0.0, 0.055, 0.04); sh.lineTo(0.012, 0.03); return sh; };
export const ornG = (kind: "star" | "angel") => gk("orn" + kind, () => { const g = new THREE.ExtrudeGeometry(kind === "star" ? starShape() : angelShape(), { depth: 0.008, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, bevelSegments: 2 }); g.center(); return g; });
export const Ornament: React.FC<{ kind?: "star" | "angel"; p?: V; rot?: V; s?: number; paint?: number; col?: string; puff?: number }> = ({ kind = "star", p, rot, s = 1, paint = 0, col = "#d8b24a", puff = 0 }) =>
  <mesh geometry={ornG(kind)} position={P3(p)} rotation={P3(rot)} scale={[s, s, s * (1 + puff * 2.2)]} castShadow>
    <meshStandardMaterial color={new THREE.Color("#efe6d2").lerp(new THREE.Color(col), paint)} roughness={0.85} bumpMap={pileTex()} bumpScale={1.5} /></mesh>;

// ---- termómetro de cocina de aguja (pinche + dial)
export const dialFace = (key: string, lo: number, hi: number, mark: number, unit = "°F") => tex.text("dial" + key, 512, 512, (g) => {
  g.fillStyle = "#f6f2e8"; g.beginPath(); g.arc(256, 256, 250, 0, 6.3); g.fill();
  for (let i = 0; i <= 20; i++) { const v = lo + ((hi - lo) * i) / 20, a = PI * 0.75 + (i / 20) * PI * 1.5, big = i % 4 === 0;
    g.strokeStyle = "#2a221a"; g.lineWidth = big ? 7 : 3; g.beginPath(); g.moveTo(256 + Math.cos(a) * 232, 256 + Math.sin(a) * 232); g.lineTo(256 + Math.cos(a) * (big ? 192 : 210), 256 + Math.sin(a) * (big ? 192 : 210)); g.stroke();
    if (big) { g.fillStyle = "#2a221a"; g.font = "bold 40px " + SERIF; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(Math.round(v)), 256 + Math.cos(a) * 150, 256 + Math.sin(a) * 150); } }
  const am = PI * 0.75 + ((mark - lo) / (hi - lo)) * PI * 1.5; g.strokeStyle = "#2f8f4e"; g.lineWidth = 20; g.beginPath(); g.arc(256, 256, 238, am - 0.06, am + 0.06); g.stroke();
  g.fillStyle = "#2a221a"; g.font = "bold 34px " + SERIF; g.textAlign = "center"; g.fillText(unit, 256, 385);
});
export const dialAng = (v: number, lo: number, hi: number) => -(PI * 0.75 + ((v - lo) / (hi - lo)) * PI * 1.5);

// ---- cartelito de papel con texto (para etiquetas dentro de la escena)
export const card = (key: string, w: number, h: number, lines: string[], size: number, fg = "#2a1e12", bg = "#f4ead2") => tex.text(key, w, h, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle";
  lines.forEach((l, i) => { g.font = `bold ${i === 0 ? size : Math.round(size * 0.62)}px ${SERIF}`; g.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * size * 1.05); });
});
