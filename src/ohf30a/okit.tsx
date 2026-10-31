// ohf30 · piezas 3D compartidas por los componentes del minuto (heroes_*): radiador con MAPA DE CALOR por columna y altura,
// manómetro con su esfera dibujada, llave de purga de bronce, taza, trapo, caño, rótulo de cinta de pintor DENTRO de la escena.
// (los componentes son distintos entre sí: esto es sólo el material de taller con el que se arman)
import React from "react";
import * as THREE from "three";
import { M, RBox, tex, rn } from "./h3d";

const PI = Math.PI;
export type V3 = [number, number, number];
// frío azul acero → hierro → naranja vivo (calor que se ve)
const C_COLD = new THREE.Color("#5b86c9"), C_IRON = new THREE.Color("#a59d8a"), C_HOT = new THREE.Color("#ff7a2e");
export const heatCol = (k: number) => k < 0.5 ? C_COLD.clone().lerp(C_IRON, k * 2) : C_IRON.clone().lerp(C_HOT, (k - 0.5) * 2);

// radiador de HIERRO FUNDIDO de verdad (r2, 30-oct, crítica «cajas naranja/azul»): n secciones, cada una con dos columnas
// redondeadas (torno con muchos anillos), cabezales arriba/abajo, niples entre secciones, patas, válvula de entrada con volante
// y purgador de bronce. El calor se ve EN el hierro: color por vértice (frío = acero azulado, tibio = hierro, caliente = brasa)
// + un brillo aditivo sólo donde quema. heat(i, y01) igual que antes (0 frío, .5 tibio, 1 caliente).
const ironNoise = () => tex.text("ironN", 256, 256, (g) => {
  g.fillStyle = "#808080"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) { const v = 90 + rn(i, 7) * 90; g.fillStyle = `rgba(${v},${v},${v},.55)`; const r = 0.6 + rn(i, 8) * 1.8; g.beginPath(); g.arc(rn(i, 5) * 256, rn(i, 6) * 256, r, 0, 6.3); g.fill(); }
});
const colProfile = (r: number, L: number, n = 22) => {
  const pts: THREE.Vector2[] = [];
  for (let k = 0; k <= 6; k++) { const a = -PI / 2 + (k / 6) * (PI / 2); pts.push(new THREE.Vector2(Math.max(0.0001, Math.cos(a) * r), r + Math.sin(a) * r)); }
  for (let k = 1; k < n; k++) { const y = r + (L * k) / n, u = k / n; const rip = 1 - 0.06 * Math.exp(-((u - 0.12) ** 2) / 0.0015) - 0.06 * Math.exp(-((u - 0.88) ** 2) / 0.0015); pts.push(new THREE.Vector2(r * rip, y)); }
  for (let k = 0; k <= 6; k++) { const a = (k / 6) * (PI / 2); pts.push(new THREE.Vector2(Math.max(0.0001, Math.cos(a) * r), r + L + Math.sin(a) * r)); }
  return pts;
};
const CC = new THREE.Color("#7389a6"), CI = new THREE.Color("#a6a298"), CH = new THREE.Color("#94503a"), GH = new THREE.Color("#ff5a14");
const ironCol = (k: number, out: THREE.Color, paint?: THREE.Color) => { const mid = paint ?? CI; return k < 0.5 ? out.copy(CC).lerp(mid, k * 2) : out.copy(mid).lerp(CH, (k - 0.5) * 2); };
export const IronRad: React.FC<{ n?: number; w?: number; h?: number; heat: (i: number, y: number) => number; p?: V3; ry?: number; glow?: number; paint?: string; valve?: boolean; bleed?: boolean; feet?: boolean }> = ({ n = 9, w = 0.05, h = 0.5, heat, p = [0, 0, 0], ry = 0, glow = 1, paint, valve = true, bleed = true, feet = true }) => {
  const pitch = w * 1.12, L = n * pitch, x0 = -L / 2 + pitch / 2, r = w * 0.37, zc = w * 0.4, y0 = 0.07, Hc = Math.max(0.05, h - 0.02);
  const geo = React.useMemo(() => {
    const base = new THREE.LatheGeometry(colProfile(r, Hc - 2 * r), 18);
    const mk = () => { const g = base.clone(); g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3), 3)); return g; };
    return { cols: Array.from({ length: n * 2 }, mk), glows: Array.from({ length: n * 2 }, mk), base };
  }, [n, r, Hc]);
  React.useEffect(() => () => { geo.cols.forEach((g) => g.dispose()); geo.glows.forEach((g) => g.dispose()); geo.base.dispose(); }, [geo]);
  const pc = paint ? new THREE.Color(paint) : undefined, tmp = new THREE.Color();
  for (let i = 0; i < n; i++) for (let s = 0; s < 2; s++) {
    const g = geo.cols[i * 2 + s], gg = geo.glows[i * 2 + s], pos = g.attributes.position as THREE.BufferAttribute, ca = g.attributes.color as THREE.BufferAttribute, ga = gg.attributes.color as THREE.BufferAttribute;
    let ly = -1, lk = 0;
    for (let v = 0; v < pos.count; v++) {
      const y = pos.getY(v); if (y !== ly) { ly = y; lk = Math.max(0, Math.min(1, heat(i, y / Hc))); }
      ironCol(lk, tmp, pc); ca.setXYZ(v, tmp.r, tmp.g, tmp.b);
      const e = Math.max(0, lk - 0.55) * 2.2 * glow * 0.55; ga.setXYZ(v, GH.r * e, GH.g * e, GH.b * e);
    }
    ca.needsUpdate = true; ga.needsUpdate = true;
  }
  const hubCol = (i: number, y: number) => ironCol(Math.max(0, Math.min(1, heat(i, y))), new THREE.Color(), pc);
  const nrm = ironNoise();
  return <group position={p} rotation={[0, ry, 0]}>
    {Array.from({ length: n }, (_, i) => <group key={i} position={[x0 + i * pitch, y0, 0]}>
      {[-1, 1].map((s, k) => <React.Fragment key={s}>
        <mesh geometry={geo.cols[i * 2 + k]} position={[0, 0, s * zc]} castShadow receiveShadow><meshStandardMaterial vertexColors metalness={0.55} roughness={0.52} bumpMap={nrm} bumpScale={0.6} roughnessMap={nrm} /></mesh>
        <mesh geometry={geo.glows[i * 2 + k]} position={[0, 0, s * zc]}><meshBasicMaterial vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
      </React.Fragment>)}
      {/* cabezales: el lazo redondeado que une las dos columnas arriba y abajo */}
      {[r * 0.9, Hc - r * 0.9].map((y, j) => <mesh key={j} position={[0, y, 0]} rotation={[PI / 2, 0, 0]} castShadow><capsuleGeometry args={[r * 0.92, zc * 2, 4, 14]} /><meshStandardMaterial color={hubCol(i, j)} metalness={0.55} roughness={0.52} bumpMap={nrm} bumpScale={0.6} /></mesh>)}
      {/* niples hacia la sección siguiente */}
      {i < n - 1 && [r * 0.9, Hc - r * 0.9].map((y, j) => <mesh key={"n" + j} position={[pitch / 2, y, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[r * 0.62, r * 0.62, pitch, 14]} /><meshStandardMaterial color={hubCol(i, j)} metalness={0.5} roughness={0.55} /></mesh>)}
    </group>)}
    {/* patas en las secciones de las puntas */}
    {feet && [0, n - 1].map((i) => <group key={i} position={[x0 + i * pitch, 0, 0]}>
      <RBox s={[w * 0.9, y0 + r, zc * 2 + r * 2.2]} p={[0, (y0 + r) / 2, 0]} r={w * 0.2}><meshStandardMaterial color="#5f5a52" metalness={0.5} roughness={0.6} /></RBox>
    </group>)}
    {/* válvula de entrada (abajo a la izquierda) con su volante, y purgador de bronce arriba a la derecha */}
    {valve && <group position={[-L / 2 - w * 0.55, y0 + r * 0.9, 0]}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[r * 0.75, r * 0.75, w * 0.9, 16]} />{M.brass({ col: "#b8892e" })}</mesh>
      <mesh position={[-w * 0.5, 0, 0]} castShadow><sphereGeometry args={[r * 1.25, 18, 14]} />{M.brass({ col: "#c39a45" })}</mesh>
      <mesh position={[-w * 0.5, r * 1.6, 0]}><cylinderGeometry args={[r * 0.3, r * 0.3, r * 1.6, 10]} />{M.brass()}</mesh>
      <group position={[-w * 0.5, r * 2.5, 0]}><mesh rotation={[PI / 2, 0, 0]} castShadow><torusGeometry args={[r * 1.3, r * 0.22, 10, 28]} /><meshStandardMaterial color="#3a2a22" roughness={0.4} /></mesh>
        {[0, 1].map((k) => <mesh key={k} rotation={[0, k * PI / 2, 0]}><boxGeometry args={[r * 2.6, r * 0.2, r * 0.2]} /><meshStandardMaterial color="#3a2a22" roughness={0.4} /></mesh>)}</group>
      <mesh position={[-w * 0.5, -(y0 + r * 0.9) / 2 - r, 0]}><cylinderGeometry args={[r * 0.7, r * 0.7, y0 + r * 0.9, 14]} /><meshStandardMaterial color="#6d655a" metalness={0.6} roughness={0.45} /></mesh>
    </group>}
    {bleed && <group position={[L / 2 + w * 0.12, y0 + Hc - r * 0.9, 0]}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[r * 0.55, r * 0.55, w * 0.35, 14]} />{M.brass({ col: "#b8892e" })}</mesh>
      <mesh position={[w * 0.2, 0, 0]}><boxGeometry args={[w * 0.12, r * 0.4, r * 0.4]} />{M.brass()}</mesh>
    </group>}
  </group>;
};
// compatibilidad: todos los componentes que usaban RadH ahora reciben el radiador de hierro fundido
export const RadH: React.FC<{ n?: number; w?: number; h?: number; heat: (i: number, y: number) => number; p?: V3; ry?: number; seg?: number; glow?: number; paint?: string; valve?: boolean; bleed?: boolean }> = ({ seg: _s, ...q }) => <IronRad {...q} />;

// esfera de manómetro dibujada: rango 0..max, banda verde [g0,g1], rótulo de unidades
export const dialTex = (key: string, max: number, g0: number, g1: number, unit = "PSI", red?: number, face: "cream" | "white" | "black" | "aged" = "cream") => tex.text("dial" + key + face, 512, 512, (g) => {
  const ink = face === "black" ? "#f2efe6" : "#1d1d1d";
  g.fillStyle = face === "white" ? "#fbfbf8" : face === "black" ? "#16171a" : face === "aged" ? "#e6d6b0" : "#f4efe2"; g.beginPath(); g.arc(256, 256, 250, 0, PI * 2); g.fill();
  if (face === "aged") for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(120,80,30,${0.06 * rn(i, 2)})`; g.beginPath(); g.arc(256 + (rn(i, 3) - 0.5) * 460, 256 + (rn(i, 4) - 0.5) * 460, 2 + 8 * rn(i, 5), 0, 6.3); g.fill(); }
  const ang = (v: number) => PI * 0.75 + (v / max) * PI * 1.5;
  const band = (a: number, b: number, col: string) => { g.strokeStyle = col; g.lineWidth = 34; g.beginPath(); g.arc(256, 256, 196, ang(a), ang(b)); g.stroke(); };
  band(g0, g1, "#3f9a52"); if (red !== undefined) band(red, max, "#c8322a");
  g.strokeStyle = ink; g.fillStyle = ink; g.textAlign = "center"; g.textBaseline = "middle";
  const step = max <= 4 ? 0.5 : max <= 40 ? 5 : max <= 100 ? 10 : 50;
  for (let v = 0; v <= max + 1e-6; v += step / 5) {
    const a = ang(v), big = Math.abs(v / step - Math.round(v / step)) < 1e-6, r0 = big ? 160 : 176;
    g.lineWidth = big ? 6 : 2; g.beginPath(); g.moveTo(256 + Math.cos(a) * r0, 256 + Math.sin(a) * r0); g.lineTo(256 + Math.cos(a) * 214, 256 + Math.sin(a) * 214); g.stroke();
    if (big) { g.font = "700 38px Arial"; g.fillText(String(Math.round(v * 10) / 10), 256 + Math.cos(a) * 124, 256 + Math.sin(a) * 124); }
  }
  g.font = "900 40px Arial"; g.fillText(unit, 256, 352);
  g.lineWidth = 10; g.strokeStyle = face === "black" ? "#555" : "#2a2a2a"; g.beginPath(); g.arc(256, 256, 246, 0, PI * 2); g.stroke();
});
// manómetro: caja (bronce por defecto; look = "chrome" | "black" | "iron" para que no sean todos iguales), vidrio, aguja (v en las unidades del dial)
export const Gauge: React.FC<{ v: number; max: number; tx: THREE.Texture; p?: V3; r?: number; rot?: V3; look?: "brass" | "chrome" | "black" | "iron" | "enamel"; needle?: string }> = ({ v, max, tx, p = [0, 0, 0], r = 0.12, rot = [0, 0, 0], look = "brass", needle = "#b3261e" }) => {
  const a = -(PI * 0.75 + (Math.max(0, Math.min(max * 1.04, v)) / max) * PI * 1.5);
  const caseM = look === "chrome" ? M.chrome({ col: "#e4e8ec" }) : look === "black" ? <meshPhysicalMaterial color="#1b1c1f" roughness={0.35} clearcoat={0.8} /> : look === "iron" ? <meshStandardMaterial color="#3d3f42" metalness={0.7} roughness={0.5} /> : look === "enamel" ? <meshPhysicalMaterial color="#1f4a3a" roughness={0.3} clearcoat={1} clearcoatRoughness={0.15} /> : M.brass();
  return <group position={p} rotation={rot}>
    <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[r * 1.12, r * 1.12, r * 0.35, 48]} />{caseM}</mesh>
    <mesh position={[0, 0, r * 0.18]}><torusGeometry args={[r * 1.06, r * 0.07, 12, 48]} />{look === "enamel" ? M.brass({ col: "#c99a45" }) : caseM}</mesh>
    <mesh position={[0, 0, r * 0.18]}><circleGeometry args={[r, 48]} /><meshStandardMaterial map={tx} roughness={0.6} /></mesh>
    <group position={[0, 0, r * 0.2]} rotation={[0, 0, a]}>
      <mesh position={[r * 0.38, 0, 0]}><boxGeometry args={[r * 0.82, r * 0.035, 0.004]} /><meshStandardMaterial color={needle} /></mesh>
      <mesh position={[-r * 0.1, 0, 0]}><boxGeometry args={[r * 0.2, r * 0.06, 0.004]} /><meshStandardMaterial color={needle} /></mesh>
    </group>
    <mesh position={[0, 0, r * 0.215]}><cylinderGeometry args={[r * 0.07, r * 0.07, 0.006, 16]} />{look === "brass" ? M.brass() : M.chrome()}</mesh>
    <mesh position={[0, 0, r * 0.24]}><circleGeometry args={[r * 1.02, 48]} />{M.glass({ op: 0.14 })}</mesh>
  </group>;
};

// llave de purga de bronce (la cruz con el agujero cuadrado), apuntando en +x
export const BleedKey: React.FC<{ p?: V3; rot?: V3; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0.03, 0, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.009, 0.009, 0.06, 20]} />{M.brass()}</mesh>
  <mesh position={[0.061, 0, 0]}><boxGeometry args={[0.003, 0.007, 0.007]} /><meshStandardMaterial color="#1a1206" /></mesh>
  <mesh position={[-0.012, 0, 0]} castShadow><boxGeometry args={[0.014, 0.07, 0.012]} />{M.brass({ col: "#cf9c42" })}</mesh>
  {[-1, 1].map((k) => <mesh key={k} position={[-0.012, k * 0.035, 0]}><sphereGeometry args={[0.009, 14, 10]} />{M.brass({ col: "#cf9c42" })}</mesh>)}
</group>;

// taza esmaltada blanca con filete azul (para el agua de la purga); fill 0..1, col del agua
export const Cup: React.FC<{ p?: V3; fill?: number; col?: string; s?: number }> = ({ p = [0, 0, 0], fill = 0, col = "#9fc4dc", s = 1 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.04, 0]} castShadow receiveShadow><cylinderGeometry args={[0.042, 0.036, 0.08, 32, 1, true]} />{M.porcelain({ side: THREE.DoubleSide })}</mesh>
  <mesh position={[0, 0.079, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.042, 0.003, 8, 40]} /><meshStandardMaterial color="#2f5fa8" /></mesh>
  <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.036, 0.036, 0.004, 32]} />{M.porcelain()}</mesh>
  <mesh position={[0.05, 0.045, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.016, 0.004, 8, 20, PI]} />{M.porcelain()}</mesh>
  {fill > 0.01 && <mesh position={[0, 0.004 + 0.035 * fill, 0]} scale={[1, Math.max(0.01, fill), 1]}><cylinderGeometry args={[0.039, 0.036, 0.07, 32]} />{M.water({ col, op: 0.85 })}</mesh>}
</group>;

// trapo doblado (algodón a cuadros)
const ragTex = () => tex.text("rag", 128, 128, (g) => { g.fillStyle = "#e9e1cf"; g.fillRect(0, 0, 128, 128); g.fillStyle = "rgba(170,60,50,.45)"; for (let i = 0; i < 128; i += 16) { g.fillRect(i, 0, 6, 128); g.fillRect(0, i, 128, 6); } });
export const Rag: React.FC<{ p?: V3; rot?: V3; s?: V3 }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = [0.14, 0.02, 0.1] }) => <RBox s={s} p={p} rot={rot} r={0.008}><meshStandardMaterial map={ragTex()} roughness={0.95} /></RBox>;

// caño recto de a hasta b
export const Pipe: React.FC<{ a: V3; b: V3; r?: number; col?: string; em?: string; emI?: number }> = ({ a, b, r = 0.02, col = "#55585b", em = "#000", emI = 0 }) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = d.length(), mid = A.clone().add(B).multiplyScalar(0.5);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return <mesh position={mid} quaternion={q} castShadow receiveShadow><cylinderGeometry args={[r, r, L, 20]} /><meshStandardMaterial color={col} metalness={0.7} roughness={0.4} emissive={em} emissiveIntensity={emI} /></mesh>;
};

// rótulo de cinta de pintor con marcador, plano dentro de la escena (≤5 palabras)
// rev 0..1 = el marcador va escribiendo (12 pasos cacheados)
// ancho real del texto con la fuente del marcador (antes se estimaba por letra y los textos largos se salían de la cinta)
const _tw: Record<string, number> = {};
const tapeW = (txt: string) => {
  if (_tw[txt] == null) { const g = document.createElement("canvas").getContext("2d")!; g.font = "700 62px 'Permanent Marker', 'Comic Sans MS', cursive"; _tw[txt] = Math.max(txt.length * 41, g.measureText(txt).width); }
  return _tw[txt];
};
export const Tape: React.FC<{ txt: string; p?: V3; rot?: V3; w?: number; k?: number; col?: string; rev?: number }> = ({ txt, p = [0, 0, 0], rot = [0, 0, 0], w = 0.3, k = 1, col = "#1c2a3a", rev = 1 }) => {
  const W = Math.round(80 + tapeW(txt)), q = Math.round(Math.max(0, Math.min(1, rev)) * 12);
  const tx = tex.text("tape" + txt + col + q, W, 96, (g) => {
    g.fillStyle = "#efe0b0"; g.fillRect(0, 0, W, 96); for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(150,120,60,${0.06 * rn(i, 9)})`; g.fillRect(rn(i, 3) * W, rn(i, 4) * 96, 6, 3); }
    g.save(); g.beginPath(); g.rect(0, 0, 32 + (W - 32) * q / 12, 96); g.clip();
    g.fillStyle = col; g.font = "700 62px 'Permanent Marker', 'Comic Sans MS', cursive"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, W / 2, 52); g.restore();
  });
  const hgt = w * 96 / W;
  return <group position={p} rotation={rot} scale={[Math.max(0.001, k), Math.max(0.001, k), 1]}>
    <mesh castShadow><planeGeometry args={[w, hgt]} /><meshStandardMaterial map={tx} roughness={0.85} side={THREE.DoubleSide} /></mesh>
  </group>;
};

// burbujas/partículas que suben (aire en el agua): n, caja, velocidad
export const Bubbles: React.FC<{ tt: number; n: number; box: [number, number, number]; p?: V3; v?: number; r?: number; col?: string; op?: number }> = ({ tt, n, box, p = [0, 0, 0], v = 0.12, r = 0.006, col = "#eaf6ff", op = 0.8 }) => <group position={p}>
  {Array.from({ length: n }, (_, i) => { const y = ((rn(i, 2) * box[1] + tt * v * (0.6 + rn(i, 3))) % box[1]);
    return <mesh key={i} position={[(rn(i, 4) - 0.5) * box[0] + 0.004 * Math.sin(tt * 3 + i), y, (rn(i, 5) - 0.5) * box[2]]}><sphereGeometry args={[r * (0.6 + rn(i, 6)), 10, 8]} /><meshPhysicalMaterial color={col} transparent opacity={op} roughness={0.05} clearcoat={1} /></mesh>; })}
</group>;

// rueda de válvula (manija redonda con rayos), gira en su eje y
export const Wheel: React.FC<{ p?: V3; a?: number; r?: number; col?: string }> = ({ p = [0, 0, 0], a = 0, r = 0.05, col = "#1d1d1d" }) => <group position={p} rotation={[0, a, 0]}>
  <mesh rotation={[PI / 2, 0, 0]} castShadow><torusGeometry args={[r, r * 0.16, 12, 36]} /><meshStandardMaterial color={col} roughness={0.35} /></mesh>
  {[0, 1, 2].map((i) => <mesh key={i} rotation={[0, (i * PI) / 3, 0]}><boxGeometry args={[r * 2, r * 0.12, r * 0.12]} /><meshStandardMaterial color={col} roughness={0.35} /></mesh>)}
  <mesh><cylinderGeometry args={[r * 0.25, r * 0.25, r * 0.4, 16]} />{M.brass()}</mesh>
</group>;

// ---------- r2 (30-oct): piezas nuevas para los rediseños ----------
const plaidTex = () => tex.text("plaid", 128, 128, (g) => { g.fillStyle = "#6a2a22"; g.fillRect(0, 0, 128, 128); g.fillStyle = "rgba(20,20,30,.55)"; for (let i = 0; i < 128; i += 32) { g.fillRect(i, 0, 12, 128); g.fillRect(0, i, 128, 12); } g.fillStyle = "rgba(230,200,150,.25)"; for (let i = 16; i < 128; i += 32) { g.fillRect(i, 0, 2, 128); g.fillRect(0, i, 128, 2); } });
const skin = () => <meshPhysicalMaterial color="#d79e84" roughness={0.55} sheen={0.6} sheenColor="#ffb39a" clearcoat={0.15} />;
// mano con el índice estirado: el origen es la PUNTA del índice, el dedo sube por +y; el dorso mira a +z (uña visible)
export const Hand: React.FC<{ p?: V3; rot?: V3; s?: number; bend?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, bend = 0 }) => {
  const seg = (a: V3, b: V3, r: number, k: string) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = d.length();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
    return <mesh key={k} position={A.clone().add(B).multiplyScalar(0.5)} quaternion={q} castShadow><capsuleGeometry args={[r, Math.max(0.001, L), 6, 14]} />{skin()}</mesh>; };
  const b = bend * 0.25;
  return <group position={p} rotation={rot} scale={s}>
    {seg([0, 0.006, 0], [0, 0.026, -b * 0.02], 0.0085, "d")}
    <mesh position={[0, 0.014, 0.0065]} rotation={[-0.1, 0, 0]} scale={[1, 1.5, 0.35]}><sphereGeometry args={[0.0062, 14, 10]} /><meshPhysicalMaterial color="#f0cdbd" roughness={0.25} clearcoat={0.8} /></mesh>
    {seg([0, 0.026, -b * 0.02], [0, 0.052, 0], 0.009, "m")}
    {seg([0, 0.052, 0], [0.004, 0.086, -0.004], 0.0098, "p")}
    {/* palma/dorso */}
    <RBox s={[0.086, 0.09, 0.034]} p={[0.034, 0.122, -0.012]} rot={[0.1, 0, -0.08]} r={0.015}>{skin()}</RBox>
    {/* nudillos de los otros tres dedos, doblados hacia la palma */}
    {[0.026, 0.046, 0.064].map((x, i) => <React.Fragment key={i}>
      {seg([x, 0.084, -0.006], [x + 0.002, 0.07, -0.03], 0.0092, "a" + i)}
      {seg([x + 0.002, 0.07, -0.03], [x + 0.002, 0.092, -0.042], 0.0085, "b" + i)}
    </React.Fragment>)}
    {/* pulgar recogido al costado */}
    {seg([-0.008, 0.13, -0.004], [-0.016, 0.1, 0.006], 0.011, "t1")}
    {seg([-0.016, 0.1, 0.006], [-0.01, 0.078, 0.01], 0.0095, "t2")}
    {/* muñeca y puño de camisa a cuadros */}
    {seg([0.036, 0.16, -0.014], [0.04, 0.2, -0.016], 0.024, "w")}
    <mesh position={[0.04, 0.24, -0.016]} castShadow><cylinderGeometry args={[0.033, 0.035, 0.08, 24]} /><meshStandardMaterial map={plaidTex()} roughness={0.9} /></mesh>
  </group>;
};

// válvula de radiador en escuadra (bronce): entrada abajo, salida a +x hacia el radiador, bonete cromado arriba con el PIN.
// pin 0..1 = cuánto asoma (1 = arriba = abierta); crust 0..1 = costra de óxido/sarro alrededor del pin
export const AngleValve: React.FC<{ p?: V3; pin?: number; crust?: number; crack?: number; out?: number; down?: number }> = ({ p = [0, 0, 0], pin = 1, crust = 0, crack = 0, out = 0.09, down = 0.087 }) => <group position={p}>
  <mesh castShadow><sphereGeometry args={[0.03, 28, 20]} />{M.brass({ col: "#c49a46" })}</mesh>
  <mesh position={[out / 2, 0, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.014, 0.014, out, 20]} />{M.brass({ col: "#b8892e" })}</mesh>
  <mesh position={[0.04, 0, 0]} rotation={[0, 0, PI / 2]} geometry={hexNutG2(0.024, 0.02, 0.012)} castShadow><meshStandardMaterial color="#a8823a" metalness={0.9} roughness={0.4} /></mesh>
  <mesh position={[0, -down / 2, 0]} castShadow><cylinderGeometry args={[0.013, 0.013, down, 18]} /><meshStandardMaterial color="#b87333" metalness={0.85} roughness={0.32} /></mesh>
  <mesh position={[0, -0.036, 0]} geometry={hexNutG2(0.024, 0.02, 0.012)} castShadow><meshStandardMaterial color="#a8823a" metalness={0.9} roughness={0.4} /></mesh>
  {/* bonete cromado con rosca */}
  <mesh position={[0, 0.036, 0]} castShadow><cylinderGeometry args={[0.021, 0.024, 0.018, 28]} />{M.chrome({ col: "#e6e9ec" })}</mesh>
  {Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[0, 0.03 + i * 0.004, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.0232, 0.0011, 6, 32]} />{M.chrome({ col: "#cfd4d8" })}</mesh>)}
  <mesh position={[0, 0.049, 0]}><cylinderGeometry args={[0.0085, 0.0095, 0.008, 18]} />{M.brass({ col: "#9c7a3a" })}</mesh>
  {/* el pin */}
  <mesh position={[0, 0.05 + 0.004 + 0.011 * pin, 0]} castShadow><cylinderGeometry args={[0.0034, 0.0034, 0.022, 14]} />{M.chrome()}</mesh>
  <mesh position={[0, 0.05 + 0.015 + 0.011 * pin, 0]}><sphereGeometry args={[0.0036, 12, 8]} />{M.chrome()}</mesh>
  {/* costra: granitos de óxido y sarro alrededor del pin; con crack se sueltan y caen */}
  {crust > 0.01 && Array.from({ length: 26 }, (_, i) => { const a = (i / 26) * PI * 2 + rn(i, 2), rr = 0.005 + 0.005 * rn(i, 3), f = Math.max(0, Math.min(1, crack * 1.4 - rn(i, 4) * 0.4));
    return <mesh key={i} position={[Math.cos(a) * (rr + f * 0.03), 0.0555 + 0.003 * rn(i, 5) - f * f * 0.09, Math.sin(a) * (rr + f * 0.03)]} rotation={[rn(i, 6) * 3 + f * 6, rn(i, 7) * 3, 0]} scale={Math.max(0.001, crust)}>
      <dodecahedronGeometry args={[0.0024 + 0.0022 * rn(i, 8), 0]} /><meshStandardMaterial color={rn(i, 9) > 0.45 ? "#a5532a" : "#e8e0cc"} roughness={1} /></mesh>; })}
</group>;
const HG2 = new Map<string, THREE.BufferGeometry>();
const hexNutG2 = (r: number, h: number, hole: number) => { const k = `${r}|${h}|${hole}`; let g = HG2.get(k); if (g) return g;
  const s = new THREE.Shape(); for (let i = 0; i < 6; i++) { const a = i * PI / 3 + PI / 6; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  const hp = new THREE.Path(); hp.absarc(0, 0, hole, 0, PI * 2, true); s.holes.push(hp);
  g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: h * 0.12, bevelSize: r * 0.06, bevelSegments: 2, curveSegments: 24 }); g.rotateX(-PI / 2); g.translate(0, -h / 2, 0); HG2.set(k, g); return g; };

// gota/puntos de agua caliente que corren por un camino (lista de puntos), k = cuánto caudal (0 = nada)
export const FlowPath: React.FC<{ tt: number; pts: V3[]; n?: number; k: number; col?: string; r?: number; v?: number }> = ({ tt, pts, n = 14, k, col = "#ffb070", r = 0.0045, v = 0.6 }) => {
  if (k <= 0.01) return null;
  const c = new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q)));
  return <>{Array.from({ length: n }, (_, i) => { const u = (tt * v + i / n) % 1, q = c.getPointAt(u);
    return <mesh key={i} position={q} scale={Math.max(0.001, k)}><sphereGeometry args={[r, 10, 8]} /><meshBasicMaterial color={col} toneMapped={false} transparent opacity={0.9} /></mesh>; })}</>;
};

// caldera vieja de hierro con camisa esmaltada: zócalo, panel frontal con persianas, mirilla del piloto (≤2 Hz), placa,
// remaches arriba. children = lo que va montado en el frente (z = d/2). Varía color/tamaño para que no se repita.
const plateTex = (txt: string) => tex.text("plate" + txt, 512, 128, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, "#e9c873"); gr.addColorStop(0.5, "#b8892e"); gr.addColorStop(1, "#8a6420"); g.fillStyle = gr; g.fillRect(0, 0, 512, 128);
  g.strokeStyle = "#6a4a14"; g.lineWidth = 6; g.strokeRect(8, 8, 496, 112); g.fillStyle = "#3a2608"; g.font = "700 46px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 256, 66);
});
export const OldBoiler: React.FC<{ p?: V3; ry?: number; col?: string; s?: V3; plate?: string; tt?: number; pilot?: number; children?: React.ReactNode }> = ({ p = [0, 0, 0], ry = 0, col = "#2f4a5c", s = [0.46, 0.7, 0.36], plate, tt = 0, pilot = 1, children }) => {
  const [w, h, d] = s, fl = (0.75 + 0.25 * Math.sin(tt * PI * 1.7)) * pilot;
  return <group position={p} rotation={[0, ry, 0]}>
    <RBox s={[w + 0.04, 0.06, d + 0.04]} p={[0, 0.03, 0]} r={0.008}><meshStandardMaterial color="#2a2826" metalness={0.5} roughness={0.6} /></RBox>
    <RBox s={[w, h - 0.06, d]} p={[0, 0.06 + (h - 0.06) / 2, 0]} r={0.028}><meshPhysicalMaterial color={col} roughness={0.38} clearcoat={0.6} clearcoatRoughness={0.25} /></RBox>
    <RBox s={[w * 0.82, (h - 0.06) * 0.34, 0.01]} p={[0, 0.06 + (h - 0.06) * 0.22, d / 2 + 0.002]} r={0.01}><meshPhysicalMaterial color={col} roughness={0.45} clearcoat={0.4} /></RBox>
    {Array.from({ length: 6 }, (_, i) => <RBox key={i} s={[w * 0.66, 0.008, 0.008]} p={[-w * 0.05, 0.06 + (h - 0.06) * 0.1 + i * 0.022, d / 2 + 0.009]} r={0.003}><meshStandardMaterial color="#141414" roughness={0.7} /></RBox>)}
    <mesh position={[w * 0.33, 0.06 + (h - 0.06) * 0.22, d / 2 + 0.008]}><circleGeometry args={[0.022, 24]} /><meshBasicMaterial color={new THREE.Color("#ff8a2a").multiplyScalar(Math.max(0.05, fl))} toneMapped={false} /></mesh>
    <mesh position={[w * 0.33, 0.06 + (h - 0.06) * 0.22, d / 2 + 0.009]}><ringGeometry args={[0.022, 0.03, 24]} />{M.brass()}</mesh>
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-w / 2 + 0.03 + i * (w - 0.06) / 7, h - 0.02, d / 2 - 0.004]}><sphereGeometry args={[0.006, 10, 8]} /><meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} /></mesh>)}
    {plate && <mesh position={[0, h - 0.07, d / 2 + 0.003]}><planeGeometry args={[w * 0.5, w * 0.125]} /><meshStandardMaterial map={plateTex(plate)} metalness={0.6} roughness={0.35} /></mesh>}
    <group position={[0, 0, d / 2]}>{children}</group>
  </group>;
};
