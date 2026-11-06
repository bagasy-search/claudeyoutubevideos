// kitplo · utilería 3D de plomería compartida por los 5 videos de Claudio (tanda plo29). Va dentro de <Estudio>.
// Todo por código (cero imágenes generadas): sifón con rayos X, tarja, frasco, espátula, sartén, rejilla, canilla, sonda,
// copa, cubeta, taza, tetera, termómetro, botella, guante, linterna, nido, reloj. Render SÓLO en el farm.
import React, { useMemo } from "react";
import * as THREE from "three";
import { rbox } from "./fx3d";
import { cl, ctex, lathe, M, papel, rn, V3 } from "./estudio3d";

const P = Math.PI, P2 = P / 2;
export const PVC = (o = 1, c = "#eef1f3", e = 0) => <meshPhysicalMaterial color={c} emissive={c} emissiveIntensity={e} roughness={0.32} clearcoat={0.6} transparent={o < 1} opacity={o} depthWrite={o >= 1} side={THREE.DoubleSide} />;
export const ACERO = () => <meshStandardMaterial color="#c9cdd2" roughness={0.32} metalness={0.95} envMapIntensity={1.3} />;
export const GOMA = (c = "#b8322a") => <meshStandardMaterial color={c} roughness={0.55} />;
export const GRASA = (o = 1) => <meshStandardMaterial color="#f1ead2" roughness={0.75} transparent={o < 1} opacity={o} />;
export const AGUA = (o = 0.62, c = "#7fb6d8") => <meshPhysicalMaterial color={c} roughness={0.05} transmission={0} transparent opacity={o} clearcoat={1} depthWrite={false} />;

// tubo que sigue una curva (puntos) — base de sifones, caños y sondas
export const tuboGeo = (pts: V3[], r: number, seg = 80, rs = 20, closed = false) =>
  new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), closed, "centripetal"), seg, r, rs, closed);
export const Tubo: React.FC<{ pts: V3[]; r?: number; o?: number; children?: React.ReactNode }> = ({ pts, r = 0.06, o = 1, children }) => {
  const g = useMemo(() => tuboGeo(pts, r), [JSON.stringify(pts), r]);
  return <mesh geometry={g} castShadow={o >= 1} receiveShadow>{children ?? PVC(o)}</mesh>;
};

// ── SIFÓN en U (PVC): cola que baja, curva, brazo a la pared. x = rayos X (se vuelve vidrio y se ve adentro)
//    agua = nivel del sello (0..1), tapon = masa de grasa en la curva (0..1), tc = color del tapón, nut = giro de tuercas
const SIF: V3[] = [[0, 0.62, 0], [0, 0.3, 0], [0, 0.12, 0], [0.06, 0.0, 0], [0.2, -0.02, 0], [0.32, 0.06, 0], [0.36, 0.2, 0], [0.4, 0.3, 0], [0.62, 0.32, 0], [0.95, 0.32, 0]];
export const Sifon: React.FC<{ p?: V3; rot?: V3; s?: number; x?: number; agua?: number; tapon?: number; tc?: string; nut?: number; baja?: number }> =
  ({ p, rot, s = 1, x = 0, agua = 1, tapon = 0, tc = "#e9e0c4", nut = 0, baja = 0 }) => {
  const g = useMemo(() => tuboGeo(SIF.slice(1, 8), 0.062), []);
  const cola = useMemo(() => tuboGeo([[0, 0.62, 0], [0, 0.3, 0]], 0.058, 4), []);
  const brazo = useMemo(() => tuboGeo([[0.4, 0.3, 0], [0.62, 0.32, 0], [0.95, 0.32, 0]], 0.062, 12), []);
  const sello = useMemo(() => tuboGeo([[0, 0.14, 0], [0.04, 0.02, 0], [0.2, -0.01, 0], [0.31, 0.06, 0], [0.34, 0.15, 0]], 0.05, 40), []);
  const o = 1 - 0.7 * x, xc = new THREE.Color("#eef1f3").lerp(new THREE.Color("#8fd0ff"), x).getStyle(), xe = 0.35 * x;
  return <group position={p} rotation={rot} scale={s}>
    <group position={[0, -baja, 0]}>
      <mesh geometry={g} castShadow={x < 0.5}>{PVC(o, xc, xe)}</mesh>
      {agua > 0.02 && <mesh geometry={sello} scale={[1, 1, 0.9 * agua]}>{AGUA(0.55 * x + 0.05)}</mesh>}
      {tapon > 0.01 && <group position={[0.17, 0.0, 0]}>{Array.from({ length: 9 }, (_, i) =>
        <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.16, (rn(i, 2) - 0.5) * 0.05, (rn(i, 3) - 0.5) * 0.05]} scale={0.035 + 0.03 * tapon * rn(i, 4)}>
          <sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color={tc} roughness={0.8} /></mesh>)}</group>}
      {/* tuercas grandes: la de arriba y la del brazo */}
      {[[0, 0.16, 0, 0], [0.4, 0.3, 0, 1]].map(([a, b, c, k], i) =>
        <mesh key={i} position={[a, b, c]} rotation={k ? [0, 0, P2 + nut] : [0, nut, 0]} castShadow><cylinderGeometry args={[0.085, 0.085, 0.07, 6 * 4]} />
          <meshPhysicalMaterial color={xc} emissive={xc} emissiveIntensity={xe} roughness={0.4} transparent={x > 0} opacity={1 - 0.55 * x} depthWrite={x < 0.5} /></mesh>)}
    </group>
    <mesh geometry={cola} castShadow={x < 0.5}>{PVC(1 - 0.5 * x, xc, xe)}</mesh>
    <mesh geometry={brazo} castShadow={x < 0.5}>{PVC(1 - 0.5 * x, xc, xe)}</mesh>
  </group>;
};

// ── TARJA de acero (una cubeta): agua = nivel 0..1, nata = película de grasa arriba, remolino 0..1
export const Tarja: React.FC<{ p?: V3; rot?: V3; w?: number; d?: number; h?: number; agua?: number; nata?: number; remolino?: number; t?: number; ac?: string; children?: React.ReactNode }> =
  ({ p, rot, w = 1.1, d = 0.75, h = 0.36, agua = 0, nata = 0, remolino = 0, t = 0, ac = "#8a8f7a", children }) => {
  const th = 0.025;
  return <group position={p} rotation={rot}>
    {/* mesada alrededor (marco con el hueco de la tarja: nunca una losa que la tape) */}
    {[[0, -(d / 2 + 0.12), w + 0.5, 0.24], [0, d / 2 + 0.1, w + 0.5, 0.2], [-(w / 2 + 0.125), 0, 0.25, d], [w / 2 + 0.125, 0, 0.25, d]].map(([x, z, a, c], i) =>
      <mesh key={"m" + i} geometry={rbox(a, 0.05, c, 0.012)} position={[x, h, z]} receiveShadow castShadow><meshStandardMaterial color="#d9d3c6" roughness={0.5} /></mesh>)}
    <mesh position={[0, 0, 0]} receiveShadow><boxGeometry args={[w, th, d]} />{ACERO()}</mesh>
    {[[0, h / 2, -d / 2, w, h, th], [0, h / 2, d / 2, w, h, th], [-w / 2, h / 2, 0, th, h, d], [w / 2, h / 2, 0, th, h, d]].map(([x, y, z, a, b, c], i) =>
      <mesh key={i} position={[x, y, z]} castShadow receiveShadow><boxGeometry args={[a, b, c]} />{ACERO()}</mesh>)}
    <mesh position={[0, th / 2 + 0.002, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.05, 0.075, 32]} />{M.cromo("#9aa0a6")}</mesh>
    <mesh position={[0, th / 2 + 0.001, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.05, 24]} /><meshBasicMaterial color="#0b0b0b" /></mesh>
    {agua > 0.01 && <mesh position={[0, th / 2 + (h - 0.04) * agua / 2, 0]}><boxGeometry args={[w - 0.05, (h - 0.04) * agua, d - 0.05]} />{AGUA(0.7, ac)}</mesh>}
    {nata > 0.01 && agua > 0.01 && Array.from({ length: 22 }, (_, i) =>
      <mesh key={i} position={[(rn(i, 5) - 0.5) * (w - 0.15), th / 2 + (h - 0.04) * agua + 0.003, (rn(i, 6) - 0.5) * (d - 0.15)]} rotation={[-P2, 0, 0]} scale={(0.04 + 0.07 * rn(i, 7)) * nata}>
        <circleGeometry args={[1, 18]} /><meshPhysicalMaterial color="#f4e9b8" roughness={0.15} clearcoat={1} transparent opacity={0.8} /></mesh>)}
    {remolino > 0.01 && Array.from({ length: 3 }, (_, i) => {
      const k = ((t * 0.8 + i / 3) % 1);
      return <mesh key={"r" + i} position={[0, th / 2 + Math.max(0.01, (h - 0.04) * agua) + 0.004, 0]} rotation={[-P2, 0, t * 4 + i * 2]} scale={0.32 * (1 - k) + 0.02}>
        <ringGeometry args={[0.8, 1, 40, 1, 0, P * 1.2]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.35 * remolino * k} depthWrite={false} /></mesh>; })}
    {children}
  </group>;
};

// ── FRASCO de vidrio con tapa; lleno = nivel 0..1 de grasa blanca (o de lo que sea)
const frascoGeo = lathe([[0, 0], [0.2, 0], [0.22, 0.03], [0.22, 0.42], [0.18, 0.47], [0.16, 0.5]]);
export const Frasco: React.FC<{ p?: V3; rot?: V3; s?: number; lleno?: number; c?: string; tapa?: number; etiqueta?: string }> = ({ p, rot, s = 1, lleno = 0, c = "#efe6c9", tapa = 1, etiqueta }) => (
  <group position={p} rotation={rot} scale={s}>
    {lleno > 0.01 && <mesh position={[0, 0.02 + 0.2 * lleno, 0]}><cylinderGeometry args={[0.2, 0.2, 0.4 * lleno, 32]} /><meshStandardMaterial color={c} roughness={0.7} /></mesh>}
    <mesh geometry={frascoGeo} castShadow>{M.vidrio()}</mesh>
    <mesh position={[0, 0.53 + 0.4 * (1 - tapa), 0.25 * (1 - tapa)]} rotation={[0.6 * (1 - tapa), 0, 0]} castShadow><cylinderGeometry args={[0.175, 0.175, 0.06, 32]} /><meshStandardMaterial color="#c8a02a" roughness={0.35} metalness={0.7} /></mesh>
    {etiqueta && <mesh position={[0, 0.24, 0.222]}><planeGeometry args={[0.3, 0.16]} /><meshStandardMaterial map={papel("fr" + etiqueta, [etiqueta], { size: 92 })} roughness={0.9} transparent opacity={0.96} /></mesh>}
  </group>
);

// ── ESPÁTULA de silicona (la hoja en el origen, mango hacia +y)
export const Espatula: React.FC<{ p?: V3; rot?: V3; s?: number; c?: string }> = ({ p, rot, s = 1, c = "#e8432e" }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={rbox(0.2, 0.26, 0.025, 0.03)} castShadow><meshStandardMaterial color={c} roughness={0.5} /></mesh>
    <mesh position={[0, 0.42, 0]} castShadow><cylinderGeometry args={[0.022, 0.026, 0.6, 12]} /><meshStandardMaterial color="#f3f0ea" roughness={0.4} /></mesh>
  </group>
);

// ── SARTÉN con película de grasa (film 0..1 brillo amarillo) y restos (grumos blancos)
const sartenGeo = lathe([[0, 0], [0.42, 0], [0.5, 0.03], [0.55, 0.12], [0.56, 0.13]]);
export const Sarten: React.FC<{ p?: V3; rot?: V3; s?: number; film?: number; grumos?: number }> = ({ p, rot, s = 1, film = 0, grumos = 0 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={sartenGeo} castShadow><meshStandardMaterial color="#1d1d1f" roughness={0.42} metalness={0.5} side={THREE.DoubleSide} shadowSide={THREE.BackSide} /></mesh>
    <mesh position={[0, 0.004, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.43, 48]} /><meshStandardMaterial color="#232326" roughness={0.55} metalness={0.3} /></mesh>
    <mesh position={[0.95, 0.09, 0]} rotation={[0, 0, P2 - 0.12]} castShadow><cylinderGeometry args={[0.035, 0.04, 0.8, 10]} /><meshStandardMaterial color="#111" roughness={0.6} /></mesh>
    {film > 0.01 && <mesh position={[0, 0.006, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.44, 40]} /><meshPhysicalMaterial color="#e8c35a" roughness={0.05} clearcoat={1} transparent opacity={0.55 * film} depthWrite={false} /></mesh>}
    {Array.from({ length: Math.round(14 * grumos) }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.6, 0.02, (rn(i, 2) - 0.5) * 0.6]} scale={[0.04 + 0.03 * rn(i, 3), 0.015, 0.035]}><sphereGeometry args={[1, 10, 8]} />{GRASA()}</mesh>)}
  </group>
);

// ── REJILLA de acero fina (disco perforado, textura con alfa) con borde; lleno = restos encima 0..1
const mallaTex = (fina: boolean) => ctex("malla" + fina, 256, 256, (g) => {
  g.fillStyle = "#cfd3d8"; g.fillRect(0, 0, 256, 256); g.globalCompositeOperation = "destination-out";
  const st = fina ? 9 : 26, r = fina ? 2.6 : 8;
  for (let y = st / 2; y < 256; y += st) for (let x = st / 2; x < 256; x += st) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
});
export const Rejilla: React.FC<{ p?: V3; rot?: V3; s?: number; fina?: boolean; lleno?: number; c?: string }> = ({ p, rot, s = 1, fina = true, lleno = 0, c = "#f2eee2" }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh rotation={[-P2, 0, 0]}><circleGeometry args={[0.3, 48]} /><meshStandardMaterial map={mallaTex(fina)} alphaTest={0.5} metalness={0.9} roughness={0.3} side={THREE.DoubleSide} /></mesh>
    <mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.3, 0.018, 10, 48]} />{M.cromo()}</mesh>
    {Array.from({ length: Math.round(40 * lleno) }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.25;
      return <mesh key={i} position={[Math.cos(a) * r, 0.015 + (i % 3) * 0.008, Math.sin(a) * r]} rotation={[0, rn(i, 3) * 6, P2]} scale={[0.008, 0.026, 0.008]}><capsuleGeometry args={[1, 1, 4, 6]} /><meshStandardMaterial color={c} roughness={0.6} /></mesh>; })}
  </group>
);

// ── GRANOS sueltos (arroz/fideo/café): n, color y forma
export const Granos: React.FC<{ n: number; c?: string; tipo?: "arroz" | "cafe" | "fideo"; area?: [number, number]; y?: number; t?: number; cae?: number; s?: number }> = ({ n, c = "#f4f0e2", tipo = "arroz", area = [0.6, 0.4], y = 0.02, t = 0, cae = 0, s = 1 }) => (
  <group>{Array.from({ length: n }, (_, i) => {
    const yy = y + Math.max(0, cae * (1.2 - t * 0.9 + rn(i, 9) * 0.6));
    const sc: V3 = tipo === "arroz" ? [0.01 * s, 0.025 * s, 0.01 * s] : tipo === "fideo" ? [0.008 * s, 0.09 * s, 0.008 * s] : [0.009 * s, 0.009 * s, 0.009 * s];
    return <mesh key={i} position={[(rn(i, 1) - 0.5) * area[0], yy, (rn(i, 2) - 0.5) * area[1]]} rotation={[rn(i, 3) * 6, rn(i, 4) * 6, rn(i, 5) * 6]} scale={sc}>
      {tipo === "cafe" ? <dodecahedronGeometry args={[1, 0]} /> : <capsuleGeometry args={[1, 1, 4, 6]} />}<meshStandardMaterial color={c} roughness={0.7} /></mesh>;
  })}</group>
);

// ── CANILLA cromada con chorro (on 0..1) que cae hasta y0; caliente = vapor tenue lo pone el héroe
export const Canilla: React.FC<{ p?: V3; rot?: V3; on?: number; largo?: number; c?: string }> = ({ p, rot, on = 0, largo = 0.7, c = "#bfe0f2" }) => {
  const cuello = useMemo(() => tuboGeo([[0, 0, 0], [0, 0.42, 0], [0.06, 0.52, 0], [0.22, 0.5, 0], [0.3, 0.4, 0]], 0.028, 40), []);
  return <group position={p} rotation={rot}>
    <mesh position={[0, 0.05, 0]} castShadow><cylinderGeometry args={[0.07, 0.08, 0.1, 24]} />{M.cromo()}</mesh>
    <mesh geometry={cuello} castShadow>{M.cromo()}</mesh>
    <mesh position={[-0.12, 0.15, 0]} rotation={[0, 0, -0.4 * on]} castShadow><boxGeometry args={[0.18, 0.025, 0.04]} />{M.cromo()}</mesh>
    <mesh position={[0.3, 0.38 - largo / 2, 0]} scale={[on, 1, on]}><cylinderGeometry args={[0.018, 0.024, largo, 12]} />{AGUA(0.6, c)}</mesh>
  </group>;
};

// ── SONDA: espiral de acero (cable en hélice) con manivela; avance = cuánto salió, giro = vueltas
export const Sonda: React.FC<{ p?: V3; rot?: V3; avance?: number; giro?: number; largo?: number; punta?: string; s?: number }> = ({ p, rot, avance = 0.5, giro = 0, largo = 1.6, punta, s = 1 }) => {
  const L = Math.max(0.05, largo * avance);
  const g = useMemo(() => { const pts: V3[] = []; for (let i = 0; i <= 160; i++) { const k = i / 160, a = k * 90; pts.push([Math.cos(a) * 0.012, Math.sin(a) * 0.012, -k]); } return tuboGeo(pts, 0.005, 320, 6); }, []);
  return <group position={p} rotation={rot} scale={s}>
    {/* tambor con manivela */}
    <group rotation={[0, 0, giro]}>
      <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.22, 0.22, 0.12, 32]} /><meshStandardMaterial color="#d0322a" roughness={0.45} metalness={0.3} /></mesh>
      <mesh position={[0.16, 0, 0.12]} rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.025, 0.025, 0.16, 10]} /><meshStandardMaterial color="#222" /></mesh>
    </group>
    <mesh position={[0, 0, -0.06]} scale={[1, 1, L]} rotation={[0, 0, giro * 3]}>
      <primitive object={g} attach="geometry" />{M.cromo("#b9bec4")}</mesh>
    <mesh position={[0, 0, -0.06 - L]} castShadow><sphereGeometry args={[0.03, 12, 10]} />{M.cromo()}</mesh>
    {punta && <mesh position={[0, 0, -0.1 - L]} scale={[0.07, 0.05, 0.08]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={punta} roughness={0.9} /></mesh>}
  </group>;
};

// ── COPA plana de goma (destapacaños de fregadero) con mango; aplasta 0..1
const copaGeo = lathe([[0, 0.17], [0.12, 0.16], [0.2, 0.1], [0.24, 0.0]]);
export const Copa: React.FC<{ p?: V3; rot?: V3; aplasta?: number; falda?: boolean; s?: number }> = ({ p, rot, aplasta = 0, falda = false, s = 1 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={copaGeo} scale={[1 + 0.18 * aplasta, 1 - 0.45 * aplasta, 1 + 0.18 * aplasta]} castShadow>{GOMA(falda ? "#1b1b1b" : "#c4322a")}</mesh>
    {falda && <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.09, 0.11, 0.08, 20, 1, true]} />{GOMA("#1b1b1b")}</mesh>}
    <mesh position={[0, 0.17 - 0.08 * aplasta + 0.42, 0]} castShadow>{M.madera("#c99a62")}<cylinderGeometry args={[0.03, 0.03, 0.84, 12]} /></mesh>
  </group>
);

// ── CUBETA de plástico con agua sucia (nivel 0..1)
const cubetaGeo = lathe([[0, 0], [0.26, 0], [0.33, 0.45], [0.35, 0.47]]);
export const Cubeta: React.FC<{ p?: V3; rot?: V3; s?: number; nivel?: number; c?: string; agua?: string }> = ({ p, rot, s = 1, nivel = 0, c = "#d6362c", agua = "#6d6a58" }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={cubetaGeo} castShadow receiveShadow><meshStandardMaterial color={c} roughness={0.5} side={THREE.DoubleSide} /></mesh>
    {nivel > 0.01 && <mesh position={[0, 0.45 * nivel, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.26 + 0.07 * nivel, 36]} />{AGUA(0.9, agua)}</mesh>}
    <mesh position={[0, 0.47, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.35, 0.008, 6, 40, P]} /><meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} /></mesh>
  </group>
);

// ── TAZA de café (cerámica) con contenido (polvo blanco = bicarbonato)
const tazaGeo = lathe([[0, 0], [0.11, 0], [0.13, 0.03], [0.15, 0.2], [0.155, 0.21]]);
export const Taza: React.FC<{ p?: V3; rot?: V3; s?: number; lleno?: number; c?: string; cuerpo?: string }> = ({ p, rot, s = 1, lleno = 0, c = "#fbfbf8", cuerpo = "#2a4a6e" }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={tazaGeo} castShadow><meshPhysicalMaterial color={cuerpo} roughness={0.25} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.17, 0.11, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.05, 0.015, 8, 20]} /><meshPhysicalMaterial color={cuerpo} roughness={0.25} /></mesh>
    {lleno > 0.01 && <mesh position={[0, 0.02 + 0.17 * lleno, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.11 + 0.035 * lleno, 28]} /><meshStandardMaterial color={c} roughness={0.95} /></mesh>}
  </group>
);

// ── TETERA de acero con vapor (lo pone el héroe con <Vapor>)
const teteraGeo = lathe([[0, 0], [0.3, 0], [0.34, 0.06], [0.33, 0.28], [0.22, 0.4], [0.08, 0.44]]);
export const Tetera: React.FC<{ p?: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={teteraGeo} castShadow>{M.cromo("#d3d6da")}</mesh>
    <mesh position={[0.36, 0.22, 0]} rotation={[0, 0, -0.9]} castShadow><cylinderGeometry args={[0.03, 0.06, 0.3, 14]} />{M.cromo("#c8cbd0")}</mesh>
    <mesh position={[0, 0.5, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.2, 0.025, 8, 24, P]} /><meshStandardMaterial color="#1c1c1c" roughness={0.5} /></mesh>
  </group>
);

// ── TERMÓMETRO de aguja (dial redondo + vástago); v = 0..1 en la escala 0-100 °C
const dialT = () => ctex("dialT", 512, 512, (g) => {
  g.fillStyle = "#f6f4ee"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill();
  const arc = (a0: number, a1: number, c: string) => { g.strokeStyle = c; g.lineWidth = 40; g.beginPath(); g.arc(256, 256, 190, a0, a1); g.stroke(); };
  arc(P * 0.75, P * 1.65, "#7fc7a0"); arc(P * 1.65, P * 2.25, "#e8432e");
  g.fillStyle = "#222"; g.font = "700 54px Arial"; g.textAlign = "center"; g.fillText("°C", 256, 360);
  g.font = "700 40px Arial"; [["0", 0.75], ["60", 1.65], ["100", 2.25]].forEach(([s, a]) => { const an = P * (a as number); g.fillText(s as string, 256 + Math.cos(an) * 120, 256 + Math.sin(an) * 120 + 14); });
});
export const Termometro: React.FC<{ p?: V3; rot?: V3; s?: number; v: number }> = ({ p, rot, s = 1, v }) => {
  const ang = P * 0.75 + cl(v) * P * 1.5;
  return <group position={p} rotation={rot} scale={s}>
    <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.06, 40]} />{M.cromo()}</mesh>
    <mesh position={[0, 0, 0.031]}><circleGeometry args={[0.27, 48]} /><meshStandardMaterial map={dialT()} roughness={0.5} /></mesh>
    <mesh position={[0, 0, 0.045]} rotation={[0, 0, -ang + P2]}><boxGeometry args={[0.02, 0.42, 0.01]} /><meshStandardMaterial color="#c0392b" /></mesh>
    <mesh position={[0, -0.6, -0.02]} castShadow><cylinderGeometry args={[0.015, 0.012, 0.9, 10]} />{M.cromo()}</mesh>
  </group>;
};

// ── BOTELLA con etiqueta (plástico de color) — químicos, cloro, refresco
const botellaGeo = lathe([[0, 0], [0.16, 0], [0.17, 0.04], [0.17, 0.5], [0.12, 0.62], [0.05, 0.7], [0.05, 0.78]]);
export const Botella: React.FC<{ p?: V3; rot?: V3; s?: number; c?: string; tx?: string[]; tc?: string; vidrio?: boolean }> = ({ p, rot, s = 1, c = "#f3d54a", tx, tc = "#ffffff", vidrio }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh geometry={botellaGeo} castShadow>{vidrio ? <meshPhysicalMaterial color={c} roughness={0.08} transparent opacity={0.6} clearcoat={1} /> : <meshPhysicalMaterial color={c} roughness={0.35} clearcoat={0.5} />}</mesh>
    <mesh position={[0, 0.82, 0]} castShadow><cylinderGeometry args={[0.06, 0.06, 0.08, 16]} /><meshStandardMaterial color="#222" roughness={0.5} /></mesh>
    {tx && <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.172, 0.172, 0.26, 32, 1, true, -0.9, 1.8]} /><meshStandardMaterial map={papel("bo" + tx.join(), tx, { bg: tc, size: 80, ink: "#111" })} roughness={0.6} /></mesh>}
  </group>
);

// ── GUANTE de hule (largo) y LINTERNA frontal
export const Guante: React.FC<{ p?: V3; rot?: V3; s?: number; c?: string }> = ({ p, rot, s = 1, c = "#f2c230" }) => (
  <group position={p} rotation={rot} scale={s}>
    {/* puño acampanado con borde enrollado, palma plana, cuatro dedos abiertos de largo distinto y pulgar de costado: se lee GUANTE sin rótulo */}
    <mesh position={[0, 0.34, 0]} castShadow geometry={lathe([[0.075, 0], [0.08, 0.12], [0.1, 0.3], [0.125, 0.44], [0.13, 0.46]], 28)}><meshPhysicalMaterial color={c} roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.8, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.13, 0.012, 8, 32]} /><meshPhysicalMaterial color={c} roughness={0.3} /></mesh>
    <mesh position={[0, 0.2, 0]} geometry={rbox(0.2, 0.26, 0.07, 0.03)} castShadow><meshPhysicalMaterial color={c} roughness={0.3} clearcoat={0.6} /></mesh>
    {[[-0.072, 0.13, 0.1], [-0.024, 0.155, 0.03], [0.024, 0.15, -0.03], [0.07, 0.11, -0.1]].map(([x, l, a], i) =>
      <group key={i} position={[x, 0.08, 0]} rotation={[0.15 * (i % 2), 0, a]}>
        <mesh position={[0, -l / 2, 0]} castShadow><capsuleGeometry args={[0.022, l, 6, 10]} /><meshPhysicalMaterial color={c} roughness={0.3} clearcoat={0.6} /></mesh></group>)}
    <group position={[-0.1, 0.2, 0.01]} rotation={[0.2, 0, -0.9]}><mesh position={[0, -0.06, 0]} castShadow><capsuleGeometry args={[0.025, 0.1, 6, 10]} /><meshPhysicalMaterial color={c} roughness={0.3} clearcoat={0.6} /></mesh></group>
  </group>
);
export const Linterna: React.FC<{ p?: V3; rot?: V3; on?: number }> = ({ p, rot, on = 1 }) => (
  <group position={p} rotation={rot}>
    <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.07, 0.06, 0.1, 20]} /><meshStandardMaterial color="#222" roughness={0.4} /></mesh>
    <mesh position={[0, 0, 0.051]}><circleGeometry args={[0.055, 20]} /><meshBasicMaterial color={new THREE.Color("#333").lerp(new THREE.Color("#fff6d8"), on)} toneMapped={false} /></mesh>
    <mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.16, 0.02, 6, 30]} /><meshStandardMaterial color="#2d6fd0" roughness={0.6} /></mesh>
    <pointLight position={[0, 0, 0.25]} intensity={0.01 + 6 * on} distance={3} color="#fff2cc" />
  </group>
);

// ── NIDO de ramitas (torus de palitos) con huevitos
export const Nido: React.FC<{ p?: V3; s?: number; huevos?: number }> = ({ p, s = 1, huevos = 3 }) => (
  <group position={p} scale={s}>
    {Array.from({ length: 70 }, (_, i) => { const a = rn(i, 1) * 6.28, r = 0.17 + rn(i, 2) * 0.07;
      return <mesh key={i} position={[Math.cos(a) * r, 0.03 + rn(i, 3) * 0.08, Math.sin(a) * r]} rotation={[rn(i, 4) * 0.6, -a, P2 + (rn(i, 5) - 0.5)]} scale={[1, 0.6 + rn(i, 6), 1]}>
        <cylinderGeometry args={[0.006, 0.006, 0.18, 4]} /><meshStandardMaterial color={rn(i, 7) > 0.5 ? "#7a5a36" : "#a8865a"} roughness={0.95} /></mesh>; })}
    {Array.from({ length: huevos }, (_, i) => <mesh key={"h" + i} position={[(i - 1) * 0.07, 0.06, (i % 2) * 0.04]} scale={[0.04, 0.05, 0.04]} castShadow><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#efe9df" roughness={0.6} /></mesh>)}
  </group>
);

// ── CRONÓMETRO de bolsillo; k = 0..1 de la vuelta de la aguja
export const Reloj: React.FC<{ p?: V3; rot?: V3; s?: number; k: number }> = ({ p, rot, s = 1, k }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.28, 0.28, 0.07, 40]} />{M.cromo("#d9c46a")}</mesh>
    <mesh position={[0, 0, 0.036]}><circleGeometry args={[0.25, 48]} /><meshStandardMaterial color="#fbf8f0" roughness={0.5} /></mesh>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i / 12 * 6.28) * 0.2, Math.cos(i / 12 * 6.28) * 0.2, 0.04]} rotation={[0, 0, -i / 12 * 6.28]}><boxGeometry args={[0.012, 0.04, 0.005]} /><meshBasicMaterial color="#222" /></mesh>)}
    <mesh position={[0, 0, 0.045]} rotation={[0, 0, -k * 6.28]}><boxGeometry args={[0.012, 0.36, 0.006]} /><meshStandardMaterial color="#c0392b" /></mesh>
    <mesh position={[0, 0.33, 0]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />{M.cromo("#d9c46a")}</mesh>
  </group>
);

// ── GOTA de agua (cae y se aplasta); k = 0..1 de la caída desde h
export const Gota: React.FC<{ p: V3; k: number; h?: number; c?: string }> = ({ p, k, h = 0.6, c = "#9fd0ee" }) => {
  const y = p[1] + h * (1 - k * k), sq = k > 0.95 ? 1.8 : 1;
  return <mesh position={[p[0], y, p[2]]} scale={[0.03 * sq, 0.042 / sq, 0.03 * sq]} visible={k > 0 && k < 1}><sphereGeometry args={[1, 14, 10]} />{AGUA(0.85, c)}</mesh>;
};

// ── CAÑO EN CORTE: se ve la mitad de atrás por dentro (la de adelante no está); capa = grasa pegada 0..1 (desde x0 a x1)
export const CanoCorte: React.FC<{ p?: V3; rot?: V3; L?: number; capa?: number; c?: string; r?: number; x0?: number; x1?: number; tubo?: boolean }> = ({ p, rot, L = 2, capa = 0, c = "#efe4c0", r = 0.22, x0, x1, tubo = true }) => {
  const a = x0 ?? -L / 2, b = x1 ?? L / 2, ri = r - 0.014 - capa * (r - 0.05);
  return <group position={p} rotation={rot}>
    {tubo && <mesh rotation={[0, 0, P2]} castShadow receiveShadow><cylinderGeometry args={[r, r, L, 48, 1, true, P2, P]} /><meshStandardMaterial color="#eef1f3" roughness={0.35} side={THREE.DoubleSide} /></mesh>}
    {tubo && [-1, 1].map((k) => <group key={k} position={[k * L / 2, 0, 0]} rotation={[0, P2, 0]}><mesh rotation={[0, 0, -P2]}><torusGeometry args={[r, 0.012, 8, 48, P]} /><meshStandardMaterial color="#f8f9fa" roughness={0.3} /></mesh></group>)}
    {capa > 0.01 && <group position={[(a + b) / 2, 0, 0]}>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[ri, ri, b - a, 48, 1, true, P2, P]} /><meshStandardMaterial color={c} roughness={0.85} side={THREE.DoubleSide} /></mesh>
      {[-1, 1].map((k) => <mesh key={k} position={[k * (b - a) / 2, 0, 0]} rotation={[0, P2, 0]}><ringGeometry args={[ri, r - 0.012, 48, 1, -P2, P]} /><meshStandardMaterial color={c} roughness={0.85} side={THREE.DoubleSide} /></mesh>)}
    </group>}
  </group>;
};
export { cl, rn };
