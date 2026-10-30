// lhh29e · kit de la maicena: la caja amarilla, el polvo, la alfombra trenzada, la cadenita, el rociador, la salsera, el pollo,
// las tablas del piso, las cartas, el oso, el guante, la bota y la tarta de merengue. Todo geometría y texturas por código.
import React from "react";
import * as THREE from "three";
import { M, RBox, tex, tubeG, rn, lerp } from "./h3d";
import { SERIF, gk, lg } from "./saltkit";

const PI = Math.PI;
type V = [number, number, number];

export const cornTex = () => tex.text("cornbox", 512, 640, (g) => {
  g.fillStyle = "#f2c230"; g.fillRect(0, 0, 512, 640); g.fillStyle = "#1f3f7a"; g.fillRect(0, 60, 512, 150);
  g.fillStyle = "#ffffff"; g.font = "bold 92px " + SERIF; g.textAlign = "center"; g.fillText("CORN", 256, 165);
  g.fillStyle = "#1f3f7a"; g.font = "bold 84px " + SERIF; g.fillText("STARCH", 256, 330);
  g.fillStyle = "#b8322a"; g.font = "bold 40px " + SERIF; g.fillText("PURE · 16 OZ", 256, 420);
  g.strokeStyle = "#1f3f7a"; g.lineWidth = 8; g.beginPath(); for (let i = 0; i < 5; i++) { g.moveTo(170 + i * 42, 560); g.quadraticCurveTo(180 + i * 42, 500, 200 + i * 42, 470); } g.stroke();
});
// caja amarilla de maicena con la tapa que se abre (lid 0..1) y el borde roto
export const CornBox: React.FC<{ p?: V; rot?: V; s?: number; lid?: number; torn?: boolean }> = ({ p, rot, s = 1, lid = 0, torn }) =>
  <group position={p} rotation={rot} scale={s}>
    <RBox s={[0.1, 0.14, 0.05]} p={[0, 0.07, 0]} r={0.003}><meshStandardMaterial map={cornTex()} roughness={0.62} /></RBox>
    <group position={[0, 0.14, -0.025]} rotation={[-lid * 1.9, 0, torn ? 0.12 : 0]}>
      <RBox s={[torn ? 0.06 : 0.1, 0.003, 0.05]} p={[torn ? -0.02 : 0, 0, 0.025]} r={0.001}><meshStandardMaterial color="#f2c230" roughness={0.6} /></RBox></group>
  </group>;

// polvo de maicena: blanco mate, sin brillo (no es sal)
export const powderMat = (col = "#fbfaf6", op = 1) => <meshStandardMaterial color={col} roughness={1} transparent={op < 1} opacity={op} />;
export const Mound: React.FC<{ p?: V; r?: number; h?: number; col?: string; op?: number }> = ({ p, r = 0.06, h = 0.02, col = "#fbfaf6", op = 1 }) =>
  <mesh position={p} geometry={lg("mound" + r + h, Array.from({ length: 13 }, (_, i) => { const u = i / 12; return [r * u, h * (1 - u * u) * (1 - 0.05 * Math.sin(u * 30))]; }).reverse().concat([[0, 0]]).reverse(), 48)}>{powderMat(col, op)}</mesh>;
// nubecita de polvo que se abre y se desvanece (k 0..1)
export const Puff: React.FC<{ p?: V; k: number; n?: number; r?: number; seed?: number }> = ({ p, k, n = 12, r = 0.05, seed = 1 }) => k <= 0 || k >= 1 ? null :
  <group position={p}>{Array.from({ length: n }, (_, i) => { const a = rn(i, seed) * PI * 2, d = r * (0.3 + rn(i, seed + 1)) * k;
    return <mesh key={i} position={[Math.cos(a) * d, 0.01 + k * r * 0.8 * rn(i, seed + 2), Math.sin(a) * d]} scale={0.4 + k * 1.3}><sphereGeometry args={[r * 0.3, 12, 10]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.5 * (1 - k)} depthWrite={false} roughness={1} /></mesh>; })}</group>;

// alfombra trenzada redonda (espiral de trenza en tres colores)
export const BraidRug: React.FC<{ p?: V; r?: number; spot?: number; cover?: number; dark?: number; clean?: number }> = ({ p, r = 0.3, spot = 0, cover = 0, dark = 0, clean = 0 }) => {
  const cols = ["#6a3b26", "#2c3d5c", "#8c2e26", "#7d6a4a"], rings = 9;
  return <group position={p}>
    {Array.from({ length: rings }, (_, i) => <mesh key={i} position={[0, 0.008, 0]} rotation={[PI / 2, 0, 0]}>
      <torusGeometry args={[r * (i + 0.6) / rings, r / rings * 0.55, 10, 96]} /><meshStandardMaterial color={cols[i % 4]} roughness={0.95} bumpMap={tex.paper(4, 1)} bumpScale={6} /></mesh>)}
    <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[r * 0.08, 32]} /><meshStandardMaterial color="#6a3b26" roughness={0.95} /></mesh>
    {spot > 0 && <mesh position={[r * 0.3, 0.0175, r * 0.1]} rotation={[-PI / 2, 0, 0]} scale={spot * (1 - clean)}><circleGeometry args={[r * 0.2, 40]} />
      <meshPhysicalMaterial color="#1b120a" roughness={0.2} clearcoat={0.8} transparent opacity={0.85} /></mesh>}
    {cover > 0 && <Mound p={[r * 0.3, 0.017, r * 0.1]} r={r * 0.24 * cover} h={0.012 * cover} col={new THREE.Color("#fbfaf6").lerp(new THREE.Color("#c9bea8"), dark).getStyle()} />}
  </group>;
};

// cadenita de oro: eslabones toro alternados a lo largo de una curva
export const Chain: React.FC<{ pts: number[][]; n?: number; r?: number; slide?: number }> = ({ pts, n = 40, r = 0.004, slide = 0 }) => {
  const c = new THREE.CatmullRomCurve3(pts.map((v) => new THREE.Vector3(v[0], v[1], v[2])));
  return <>{Array.from({ length: n }, (_, i) => { const u = (i + 0.5) / n, q = c.getPoint(u), tg = c.getTangent(u), ob = new THREE.Object3D();
    ob.position.copy(q); ob.lookAt(q.clone().add(tg)); ob.rotateZ((i % 2) * PI / 2 + slide * Math.sin(i));
    return <mesh key={i} position={ob.position} quaternion={ob.quaternion}><torusGeometry args={[r, r * 0.28, 8, 16]} />{M.brass({ col: "#e6bd4a" })}</mesh>; })}</>;
};

// rociador de plástico con líquido turbio (fill) y sedimento abajo (sed)
export const Sprayer: React.FC<{ p?: V; rot?: V; s?: number; fill?: number; sed?: number; cloud?: number }> = ({ p, rot, s = 1, fill = 0.8, sed = 0, cloud = 1 }) =>
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={lg("spr", [[0, 0], [0.04, 0], [0.042, 0.01], [0.042, 0.15], [0.03, 0.18], [0.016, 0.19]], 40)}>{M.plastic({ col: "#e8f2f6", op: 0.35 })}</mesh>
    <mesh position={[0, 0.075 * fill, 0]} scale={[1, fill, 1]}><cylinderGeometry args={[0.039, 0.039, 0.15, 40]} />
      <meshStandardMaterial color={new THREE.Color("#dfe9ee").lerp(new THREE.Color("#f8f8f4"), cloud)} transparent opacity={0.35 + 0.4 * cloud} roughness={0.4} /></mesh>
    {sed > 0 && <mesh position={[0, 0.006 * sed, 0]}><cylinderGeometry args={[0.039, 0.039, 0.012 * sed, 40]} />{powderMat()}</mesh>}
    <RBox s={[0.03, 0.04, 0.03]} p={[0, 0.21, 0]} r={0.006}>{M.plastic({ col: "#2a6ab8" })}</RBox>
    <RBox s={[0.012, 0.012, 0.05]} p={[0, 0.225, 0.03]} r={0.004}>{M.plastic({ col: "#2a6ab8" })}</RBox>
    <RBox s={[0.008, 0.04, 0.012]} p={[0, 0.195, 0.025]} rot={[0.3, 0, 0]} r={0.003}>{M.plastic({ col: "#e9e9e9" })}</RBox>
  </group>;

// cacerola con líquido (col) y espesor visual (thick 0..1: brillo/opacidad)
export const Pot: React.FC<{ p?: V; s?: number; col?: string; level?: number; thick?: number; children?: React.ReactNode }> = ({ p, s = 1, col = "#7a4a22", level = 0.7, thick = 0.5, children }) =>
  <group position={p} scale={s}>
    <mesh geometry={lg("pot", [[0, 0], [0.09, 0], [0.095, 0.01], [0.095, 0.09], [0.1, 0.095], [0.093, 0.095], [0.088, 0.01], [0, 0.006]], 56)}>{M.steel({ side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.085 * level, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.088, 48]} />
      <meshPhysicalMaterial color={col} roughness={lerp(0.15, 0.45, 1 - thick)} clearcoat={thick} transparent opacity={0.6 + 0.4 * thick} /></mesh>
    <RBox s={[0.12, 0.012, 0.022]} p={[0.15, 0.08, 0]} r={0.006}>{M.rubber({})}</RBox>
    {children}
  </group>;

// presa de pollo (muslo) con rebozado: crisp 0..1 dorado y rugoso; grease = brillo aceitoso
export const drumG = () => gk("drum", () => { const pts: number[][] = []; for (let i = 0; i <= 20; i++) { const u = i / 20; pts.push([0.006 + 0.026 * Math.sin(u * PI) * (u < 0.6 ? 1 : 0.8 + 0.2 * (1 - u)), u * 0.11]); } return new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 32); });
export const Drumstick: React.FC<{ p?: V; rot?: V; s?: number; crisp?: number; grease?: number; raw?: number }> = ({ p, rot, s = 1, crisp = 1, grease = 0, raw = 0 }) =>
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={drumG()}><meshPhysicalMaterial color={new THREE.Color("#f0c6b0").lerp(new THREE.Color("#c98a3a"), (1 - raw) * (0.4 + 0.6 * crisp))} roughness={0.9 - 0.6 * grease}
      clearcoat={grease} bumpMap={tex.paper(2, 3)} bumpScale={6 + 10 * crisp} /></mesh>
    <mesh position={[0, 0.112, 0]}><sphereGeometry args={[0.009, 16, 12]} /><meshStandardMaterial color="#efe6d6" roughness={0.6} /></mesh>
  </group>;

// tablas de piso: n tablas con rendijas; gap = separación, rub = cuánto se rozan (se mueve una)
export const Floorboards: React.FC<{ n?: number; w?: number; len?: number; gap?: number; rub?: number; tt?: number; powder?: number }> = ({ n = 6, w = 0.07, len = 0.6, gap = 0.003, rub = 0, tt = 0, powder = 0 }) =>
  <>{Array.from({ length: n }, (_, i) => { const x = (i - (n - 1) / 2) * (w + gap), dy = i === Math.floor(n / 2) ? rub * 0.004 * Math.sin(tt * 18) : 0;
    return <group key={i}>
      <RBox s={[w, 0.02, len]} p={[x, 0.01 + dy, 0]} r={0.002}>{M.wood({ base: [150 + (i % 3) * 12, 104 + (i % 2) * 8, 62] })}</RBox>
      {powder > 0 && i < n - 1 && <mesh position={[x + w / 2 + gap / 2, 0.0205, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[gap * 1.6, len * powder]} />{powderMat()}</mesh>}
    </group>; })}</>;

// naipe con frente (pinta) y dorso rojo
export const cardFace = (k: string, txt: string, red: boolean) => tex.text("nf" + k, 160, 224, (g) => {
  g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, 160, 224); g.strokeStyle = "#ccc"; g.lineWidth = 3; g.strokeRect(4, 4, 152, 216);
  g.fillStyle = red ? "#c0262a" : "#1a1a1a"; g.font = "bold 46px " + SERIF; g.textAlign = "center"; g.fillText(txt, 80, 130);
});
export const cardBack = () => tex.text("nback", 160, 224, (g) => { g.fillStyle = "#a8262a"; g.fillRect(0, 0, 160, 224); g.strokeStyle = "#f4e6d6"; g.lineWidth = 3;
  for (let i = -224; i < 224; i += 14) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 224, 224); g.stroke(); g.beginPath(); g.moveTo(i + 224, 0); g.lineTo(i, 224); g.stroke(); } g.strokeRect(8, 8, 144, 208); });
export const Naipe: React.FC<{ p?: V; rot?: V; k?: string; txt?: string; red?: boolean; s?: number; dull?: number }> = ({ p, rot, k = "a", txt = "A♠", red, s = 1, dull = 0 }) =>
  <group position={p} rotation={rot} scale={s}>
    <mesh position={[0, 0, 0.0004]}><planeGeometry args={[0.063, 0.088]} /><meshPhysicalMaterial map={cardFace(k, txt, !!red)} roughness={0.3 + 0.6 * dull} clearcoat={1 - dull} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#d8c8a4"), dull)} /></mesh>
    <mesh rotation={[0, PI, 0]} position={[0, 0, -0.0004]}><planeGeometry args={[0.063, 0.088]} /><meshStandardMaterial map={cardBack()} roughness={0.4} /></mesh>
  </group>;

// osito viejo de peluche (esferas con piel de felpa), clean 0..1 aclara el color
export const Bear: React.FC<{ p?: V; rot?: V; s?: number; clean?: number; dust?: number }> = ({ p, rot, s = 1, clean = 0, dust = 0 }) => {
  const col = new THREE.Color("#5e4330").lerp(new THREE.Color("#9a7552"), clean).getStyle();
  const fur = <meshStandardMaterial color={col} roughness={1} bumpMap={tex.paper(6, 4)} bumpScale={10} />;
  return <group position={p} rotation={rot} scale={s}>
    <mesh position={[0, 0.05, 0]} scale={[1, 1.15, 0.9]}><sphereGeometry args={[0.045, 24, 18]} />{fur}</mesh>
    <mesh position={[0, 0.12, 0]}><sphereGeometry args={[0.036, 24, 18]} />{fur}</mesh>
    <mesh position={[0, 0.112, 0.03]} scale={[1, 0.8, 0.8]}><sphereGeometry args={[0.016, 16, 12]} /><meshStandardMaterial color="#c8a882" roughness={1} /></mesh>
    <mesh position={[0, 0.118, 0.043]}><sphereGeometry args={[0.005, 10, 8]} /><meshStandardMaterial color="#1a1210" roughness={0.3} /></mesh>
    {[-1, 1].map((k) => <group key={k}>
      <mesh position={[k * 0.028, 0.15, 0]}><sphereGeometry args={[0.013, 14, 10]} />{fur}</mesh>
      <mesh position={[k * 0.013, 0.128, 0.032]}><cylinderGeometry args={[0.005, 0.005, 0.003, 12]} /><meshStandardMaterial color="#222" roughness={0.3} /></mesh>
      <mesh position={[k * 0.05, 0.06, 0.01]} rotation={[0, 0, k * 0.6]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.016, 14, 10]} />{fur}</mesh>
      <mesh position={[k * 0.025, 0.012, 0.025]} scale={[1, 0.8, 1.4]}><sphereGeometry args={[0.018, 14, 10]} />{fur}</mesh></group>)}
    {dust > 0 && Array.from({ length: 20 }, (_, i) => <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.1, 0.02 + rn(i, 4) * 0.14, 0.03 + rn(i, 5) * 0.03]}><sphereGeometry args={[0.0025, 6, 5]} />{powderMat("#ffffff", dust)}</mesh>)}
  </group>;
};

// guante de goma amarillo: palma + 4 dedos + pulgar + puño
export const Glove: React.FC<{ p?: V; rot?: V; s?: number; col?: string; inflate?: number }> = ({ p, rot, s = 1, col = "#f2c84a", inflate = 0 }) => {
  const m = <meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.6} />;
  return <group position={p} rotation={rot} scale={s}>
    <RBox s={[0.07, 0.08, 0.02 + 0.01 * inflate]} p={[0, 0.04, 0]} r={0.01}>{m}</RBox>
    {[-0.026, -0.009, 0.009, 0.026].map((x, i) => <mesh key={i} position={[x, 0.1 + (i === 1 || i === 2 ? 0.006 : 0), 0]}><capsuleGeometry args={[0.0075 + 0.002 * inflate, 0.04 - (i === 3 ? 0.008 : 0), 6, 12]} />{m}</mesh>)}
    <mesh position={[0.045, 0.045, 0]} rotation={[0, 0, -0.8]}><capsuleGeometry args={[0.008 + 0.002 * inflate, 0.03, 6, 12]} />{m}</mesh>
    <mesh position={[0, -0.025, 0]}><cylinderGeometry args={[0.04, 0.045, 0.05, 24, 1, true]} /><meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>
  </group>;
};

// bota de trabajo de cuero (caña + pie + suela)
export const Boot: React.FC<{ p?: V; rot?: V; s?: number; wet?: number }> = ({ p, rot, s = 1, wet = 0 }) => {
  const m = <meshPhysicalMaterial color={new THREE.Color("#7a5232").lerp(new THREE.Color("#3c2616"), wet)} roughness={0.75 - 0.4 * wet} clearcoat={0.3 + 0.5 * wet} bumpMap={tex.paper(3, 3)} bumpScale={4} />;
  return <group position={p} rotation={rot} scale={s}>
    <RBox s={[0.07, 0.12, 0.07]} p={[0, 0.08, -0.02]} r={0.02}>{m}</RBox>
    <RBox s={[0.07, 0.05, 0.14]} p={[0, 0.03, 0.03]} r={0.022}>{m}</RBox>
    <RBox s={[0.075, 0.015, 0.15]} p={[0, 0.0075, 0.03]} r={0.005}><meshStandardMaterial color="#1c1612" roughness={0.9} /></RBox>
    <mesh position={[0, 0.141, -0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.028, 24]} /><meshStandardMaterial color="#120c08" /></mesh>
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0, 0.06 + i * 0.016, 0.0155]}><boxGeometry args={[0.04, 0.002, 0.002]} /><meshStandardMaterial color="#d8c8a0" /></mesh>)}
  </group>;
};

// tarta de limón con merengue: peaks = picos (0..1), gold = dorado, weep = gotitas, gap = merengue despegado del borde
export const meringueG = (k: number) => gk("mer" + k.toFixed(2), () => { const g = new THREE.SphereGeometry(0.105, 64, 24, 0, PI * 2, 0, PI / 2); const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), a = Math.atan2(z, x), r = Math.hypot(x, z);
    const n = Math.max(0, Math.sin(a * 9 + r * 80) * Math.sin(r * 120 + a * 3)); pos.setY(i, y * 0.5 + k * 0.012 * n * (r / 0.105)); }
  g.computeVertexNormals(); return g; });
export const MeringuePie: React.FC<{ p?: V; s?: number; peaks?: number; gold?: number; weep?: number; gap?: number; mer?: number }> = ({ p, s = 1, peaks = 1, gold = 0, weep = 0, gap = 0, mer = 1 }) =>
  <group position={p} scale={s}>
    <mesh geometry={lg("crust", [[0, 0], [0.11, 0], [0.125, 0.03], [0.13, 0.035], [0.118, 0.035], [0.105, 0.012], [0, 0.012]], 64)}><meshStandardMaterial color="#d49a4e" roughness={0.8} bumpMap={tex.paper(5, 2)} bumpScale={5} /></mesh>
    <mesh position={[0, 0.026, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.112, 48]} /><meshPhysicalMaterial color="#f4d44a" roughness={0.3} clearcoat={0.6} /></mesh>
    {mer > 0 && <mesh position={[0, 0.026, 0]} scale={[1 - 0.12 * gap, mer, 1 - 0.12 * gap]} geometry={meringueG(peaks)}>
      <meshPhysicalMaterial color={new THREE.Color("#fffaf0").lerp(new THREE.Color("#e0a656"), gold * 0.55)} roughness={0.55} clearcoat={0.2} /></mesh>}
    {weep > 0 && Array.from({ length: 22 }, (_, i) => { const a = rn(i, 2) * PI * 2, r = 0.02 + rn(i, 3) * 0.07;
      return <mesh key={i} position={[Math.cos(a) * r, 0.026 + 0.045 * (1 - (r / 0.105) ** 2) + 0.004, Math.sin(a) * r]} scale={weep}><sphereGeometry args={[0.0035, 10, 8]} />
        <meshPhysicalMaterial color="#e6b84a" roughness={0.05} clearcoat={1} transmission={0.5} thickness={0.004} /></mesh>; })}
    {weep > 0 && <mesh position={[0, 0.0275, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.1 - 0.012 * weep, 0.112, 48]} />{M.water({ col: "#f2e6a8", op: 0.7 * weep })}</mesh>}
  </group>;

// moneda (centavo de cobre o de plata)
export const Coin: React.FC<{ p?: V; rot?: V; copper?: boolean; s?: number }> = ({ p, rot, copper = true, s = 1 }) =>
  <mesh position={p} rotation={rot} scale={s}><cylinderGeometry args={[0.0095, 0.0095, 0.0015, 28]} />
    {copper ? <meshStandardMaterial color="#b8683a" metalness={0.9} roughness={0.35} /> : M.brass({ col: "#e6bd4a" })}</mesh>;

export { tubeG };
