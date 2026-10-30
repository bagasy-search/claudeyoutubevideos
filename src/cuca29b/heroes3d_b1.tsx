// cuca29b · NIXTAMAL · componentes únicos en bodegón 3D (estudio3d + kit3d, mismo lenguaje que cuca29a).
// Regla: el OBJETO cuenta la idea sin leer; cada cosa llega de a una con peso en su palabra; un rótulo como mucho.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, Head, img, lerp, MZ, phys, RED, Stage, Tag, TX } from "./ckit";
import { ctex, Estudio, fall, lathe, M, papel, RBox, rn, V3, Vapor, Yute, humoTex } from "./estudio3d";
import { Chorro, Cuchara, Foto3D, Llama, Mano, Olla, Onda } from "./kit3d";

export type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;
const ent = (tt: number, a: number) => cl(phys(tt, a, 6, 0.5));

// ---------- utilería del maíz ----------
const granoGeo = (() => { const g = new THREE.SphereGeometry(1, 16, 12); const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setX(i, p.getX(i) * (1 - 0.28 * Math.max(0, -y))); p.setZ(i, p.getZ(i) * 0.62); } g.computeVertexNormals(); return g; })();
export const COL = { blanco: "#efe6c8", amarillo: "#e9b33a", azul: "#3a3f78", gris: "#8a8576", nixta: "#f0c24a" };
export const Grano: React.FC<{ p: V3; s?: number; rot?: V3; c?: string; brillo?: number; glow?: number }> = ({ p, s = 0.06, rot = [0, 0, 0], c = COL.blanco, brillo = 0.6, glow = 0 }) => (
  <mesh position={p} rotation={rot} scale={[s, s * 1.15, s]} geometry={granoGeo} castShadow>
    <meshPhysicalMaterial color={c} roughness={0.35} clearcoat={brillo} emissive="#ffcf70" emissiveIntensity={glow} />
  </mesh>);
export const tortTex = () => ctex("tortilla", 512, 512, (g) => {
  const gr = g.createRadialGradient(256, 256, 20, 256, 256, 256); gr.addColorStop(0, "#efdcaa"); gr.addColorStop(1, "#d9bd7c"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 70; i++) { const r = 4 + rn(i, 3) * 16; g.fillStyle = `rgba(${90 + rn(i, 4) * 40},${55 + rn(i, 5) * 30},20,${0.25 + rn(i, 6) * 0.4})`; g.beginPath(); g.ellipse(40 + rn(i, 1) * 432, 40 + rn(i, 2) * 432, r, r * 0.7, rn(i, 7) * 3, 0, 7); g.fill(); }
});
export const Tortilla: React.FC<{ p?: V3; rot?: V3; s?: number; infla?: number }> = ({ p, rot, s = 1, infla = 0 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh castShadow receiveShadow scale={[1, 1 + 14 * infla, 1]}><cylinderGeometry args={[0.5, 0.5, 0.018, 48]} /><meshStandardMaterial map={tortTex()} roughness={0.85} /></mesh>
  </group>);
export const Comal: React.FC<{ p?: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}><mesh castShadow receiveShadow geometry={lathe([[0, 0.05], [0.9, 0.03], [1.05, 0.08], [1.08, 0.1]], 64)}><meshStandardMaterial color="#2a2522" roughness={0.55} metalness={0.5} side={THREE.DoubleSide} /></mesh></group>);
const Masa: React.FC<{ p: V3; s?: number; grumo?: number; c?: string }> = ({ p, s = 0.3, grumo = 0, c = "#e7d7a6" }) => (
  <mesh position={p} scale={[s, s * 0.8, s]} castShadow><icosahedronGeometry args={[1, grumo > 0.5 ? 1 : 4]} /><meshStandardMaterial color={c} roughness={0.92} flatShading={grumo > 0.5} /></mesh>);
const jarroGeo = lathe([[0, 0], [0.28, 0], [0.34, 0.15], [0.33, 0.45], [0.27, 0.62], [0.3, 0.7]]);
const vasoGeo = lathe([[0, 0], [0.3, 0], [0.33, 0.85], [0.335, 0.86]]);

// ── 1 · MAZORCA: la mazorca 3D gira sobre la mesa y se desgrana: los granos criollos caen con peso en la batea de barro
const H3Mazorca: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const rot = tt * 0.7, desg = eio(tt, 1.2, 5.2);
  const N = 96;
  return <>
    <Estudio t={tt} cam={[0, 1.8, 3.8]} look={[0, 0.55, 0]} orbit={0.15}>
      <group position={[-0.35, 1.0 + 0.04 * Math.sin(tt * 1.3), 0]} rotation={[0, rot, 0.25]}>
        <mesh><cylinderGeometry args={[0.16, 0.13, 1.5, 16]} /><meshStandardMaterial color="#d8c08a" roughness={0.9} /></mesh>
        {Array.from({ length: N }, (_, i) => { const row = i % 12, col = Math.floor(i / 12), a = (row / 12) * 6.28 + (col % 2) * 0.26, y = -0.62 + col * 0.165;
          const k = cl((desg * N - (N - 1 - i) * 0.85) / 4); if (k > 0.98) return null;
          return <Grano key={i} p={[Math.cos(a) * (0.2 + k * 0.3), y - k * 1.2, Math.sin(a) * (0.2 + k * 0.3)]} rot={[0, -a, P2]} s={0.075} c={COL.blanco} />; })}
      </group>
      <mesh position={[0.55, 0.06, 0.35]} geometry={lathe([[0, 0], [0.5, 0], [0.75, 0.16], [0.8, 0.22]])} castShadow receiveShadow>{M.barro("#8f4a28")}</mesh>
      {Array.from({ length: 60 }, (_, i) => { const at = 1.5 + i * 0.06; if (tt < at - 0.3) return null; const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.55;
        return <Grano key={"c" + i} p={[0.55 + Math.cos(a) * r, 0.1 + (i % 4) * 0.035 + fall(tt, at, 1.1), 0.35 + Math.sin(a) * r * 0.8]} rot={[rn(i, 3) * 3, rn(i, 4) * 6, rn(i, 5)]} s={0.07} c={COL.blanco} />; })}
    </Estudio>
    <Head tt={tt} kick="TRUCO 1" title="CRIOLLO, SECO, QUE SUENE" />
    <Tag tt={tt} at={6.1} x={1350} y={300} txt="MAÍZ CRIOLLO" col={MZ} size={48} />
  </>;
}}</Stage>;

// ── 2 · CUBETA EN CORTE: el maíz baja al fondo; los granos vanos (grises, picados) suben y se van por el borde con la basurita
const vanoGeo = (() => { const g = new THREE.IcosahedronGeometry(1, 1); const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const k = 0.8 + 0.3 * rn(i, 9); p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 1.1, p.getZ(i) * k * 0.6); } g.computeVertexNormals(); return g; })();
const Colador: React.FC<{ p: V3 }> = ({ p }) => <group position={p}>
  <mesh geometry={lathe([[0, 0], [0.3, 0.02], [0.46, 0.2], [0.5, 0.24]], 32)} castShadow><meshStandardMaterial color="#3a3a3c" metalness={0.8} roughness={0.35} wireframe /></mesh>
  <mesh geometry={lathe([[0, 0], [0.3, 0.02], [0.46, 0.2], [0.5, 0.24]], 32)}><meshStandardMaterial color="#6a6a6e" metalness={0.6} roughness={0.5} transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0.5, 0.24, 0]}><torusGeometry args={[0.04, 0.012, 6, 12]} />{M.cromo()}</mesh></group>;
const H3Cubeta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const sube = eio(tt, 0.8, 3.2), tilt = 0.14 * eio(tt, 3.8, 4.4) * (1 - eio(tt, 6.6, 7.3));
  return <>
    <Estudio t={tt} cam={[0.2, 1.5, 3.9 - 0.06 * tt]} look={[0.45, 0.65, 0]} orbit={0.05}>
      <group rotation={[0, 0, -tilt]}>
        <mesh geometry={lathe([[0, 0], [0.62, 0], [0.8, 1.3], [0.82, 1.32]], 48)} castShadow receiveShadow>{M.vidrio()}</mesh>
        <mesh position={[0, 0.58, 0]}><cylinderGeometry args={[0.76, 0.62, 1.12, 48]} />{M.liquido("#5f8fa6", 0.38)}</mesh>
        {Array.from({ length: 80 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.55;
          return <Grano key={i} p={[Math.cos(a) * r, 0.06 + (i % 5) * 0.06 + fall(tt, 0.1 + i * 0.008, 1.4), Math.sin(a) * r]} rot={[rn(i, 3) * 3, rn(i, 4) * 6, 0]} s={0.075} c="#f6ecc8" brillo={0.9} />; })}
      </group>
      {Array.from({ length: 22 }, (_, i) => { const a = rn(i, 7) * 6.28, r = 0.12 + rn(i, 8) * 0.45, at = 3.9 + i * 0.09, k = eio(tt, at, at + 1.1);
        const x0 = Math.cos(a) * r, y0 = lerp(0.25, 1.1 + 0.02 * Math.sin(tt * 3 + i), sube), z0 = Math.sin(a) * r * 0.6;
        const x = lerp(x0, 1.55 + (rn(i, 2) - 0.5) * 0.4, k), y = lerp(y0, 0.12 + (i % 3) * 0.05, k) + 0.6 * Math.sin(k * P), z = lerp(z0, (rn(i, 3) - 0.5) * 0.3, k);
        return i % 3 === 2
          ? <mesh key={"p" + i} position={[x, y, z]} rotation={[rn(i, 4) * 3, tt * 0.3 + i, P2 * 0.8]}><cylinderGeometry args={[0.012, 0.012, 0.42, 6]} /><meshStandardMaterial color="#c9a24a" roughness={0.8} /></mesh>
          : <mesh key={"v" + i} position={[x, y, z]} rotation={[tt * 0.4 + i, i, 0.5]} scale={0.085} geometry={vanoGeo} castShadow><meshStandardMaterial color="#4b4740" roughness={1} flatShading /></mesh>; })}
      <Colador p={[1.55, 0.02, 0]} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 2" title="LO QUE FLOTA SE TIRA" />
  </>;
}}</Stage>;

// ── 3 · LA RECETA EN LA MESA: llega el kilo de maíz, la jarra de 3 litros y la cuchara; un cuchillo RASA la cal y el sobrante cae
const jarra3Tex = () => ctex("jarra3l", 256, 512, (g) => { g.clearRect(0, 0, 256, 512); g.strokeStyle = "#c0392b"; g.lineWidth = 8;
  [120, 250, 380].forEach((y, i) => { g.beginPath(); g.moveTo(20, y); g.lineTo(i === 0 ? 150 : 100, y); g.stroke(); });
  g.fillStyle = "#c0392b"; g.font = "900 72px Montserrat, Arial"; g.fillText("3 L", 160, 140); });
const H3Balanza: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const kilo = ent(tt, 0.4), jar = ent(tt, 1.4), cuch = ent(tt, 2.6), rasa = eio(tt, 4.4, 5.6);
  return <>
    <Estudio t={tt} cam={[0.1, 1.15, 3.1 - 0.05 * tt]} look={[0.1, 0.42, 0]} orbit={0.05}>
      <group position={[-1.25, lerp(1.2, 0, kilo), -0.1]}>
        <mesh geometry={lathe([[0, 0], [0.5, 0], [0.62, 0.1], [0.65, 0.13]])} castShadow receiveShadow>{M.barro("#8f4a28")}</mesh>
        {Array.from({ length: 90 }, (_, i) => { const a = rn(i, 1) * 6.28, lev = i % 8, r = Math.sqrt(rn(i, 2)) * 0.5 * (1 - lev / 9);
          return <Grano key={i} p={[Math.cos(a) * r, 0.1 + lev * 0.05, Math.sin(a) * r]} rot={[rn(i, 3) * 3, rn(i, 4) * 6, 0]} s={0.075} />; })}
      </group>
      <group position={[-0.05, lerp(1.4, 0, jar), -0.35]}>
        <mesh geometry={lathe([[0, 0], [0.36, 0], [0.4, 0.5], [0.36, 1.0], [0.4, 1.06]])} castShadow>{M.vidrio()}</mesh>
        <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.37, 0.35, 0.86, 32]} />{M.liquido("#9fd0e0", 0.5)}</mesh>
        <mesh position={[0, 0.5, 0.405]}><planeGeometry args={[0.4, 0.8]} /><meshBasicMaterial map={jarra3Tex()} transparent /></mesh>
      </group>
      <group position={[0.95, 0.02 + lerp(1.0, 0, cuch), 0.35]} rotation={[0, -0.35, 0]}>
        <mesh position={[0, 0.15, 0]} scale={[0.34, 0.19, 0.24]}><sphereGeometry args={[1, 32, 16, 0, 2 * P, P2, P2]} /><meshStandardMaterial color="#d8dadc" metalness={0.85} roughness={0.22} side={THREE.DoubleSide} /></mesh>
        <RBox p={[-0.75, 0.2, 0]} rot={[0, 0, 0.12]} s={[0.95, 0.03, 0.08]} r={0.012}><meshStandardMaterial color="#d8dadc" metalness={0.85} roughness={0.22} /></RBox>
        <mesh position={[0, 0.15, 0]} scale={[0.33, 0.012 + 0.16 * (1 - rasa), 0.23]}><sphereGeometry args={[1, 28, 12, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#fbfaf6" roughness={1} /></mesh>
        <group position={[lerp(0.75, -0.55, rasa), 0.17, 0]} visible={tt > 3.6}>
          <RBox p={[0, 0, 0]} s={[0.07, 0.012, 0.75]} r={0.004}>{M.cromo()}</RBox>
          <RBox p={[0, 0, 0.55]} s={[0.07, 0.05, 0.36]} r={0.02}>{M.madera("#6a4024")}</RBox>
        </group>
        {Array.from({ length: 16 }, (_, i) => { const at = 4.6 + i * 0.06, k = cl((tt - at) * 1.6); return k > 0 ? <mesh key={i} position={[lerp(0.3, -0.35, i / 15), 0.24 - k * k * 0.22, (rn(i, 2) - 0.5) * 0.4 + (i % 2 ? 0.26 : -0.26)]} scale={0.025}><sphereGeometry args={[1, 6, 6]} /><meshStandardMaterial color="#fbfaf6" /></mesh> : null; })}
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 3" title="LA CAL SE MIDE" />
  </>;
}}</Stage>;

// ── 4 · BOLSA DE CAL: la bolsa de cal apagada gira al frente y su etiqueta se enciende; la de construcción se hunde con sello rojo
const bolsaTex = (k: string, l: string[], bg: string, ink: string) => papel("bolsa" + k, l, { w: 512, h: 640, bg, ink, size: 92, font: `900 92px Montserrat, Arial, sans-serif` });
const sacoGeo = (() => { const g = new THREE.BoxGeometry(0.9, 1.35, 0.42, 14, 20, 6); const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), u = (y + 0.675) / 1.35;
    const bul = 1 + 0.14 * Math.sin(Math.min(1, u * 1.15) * P), top = u > 0.86 ? 1 - ((u - 0.86) / 0.14) * 0.92 : 1;
    const n = 0.016 * Math.sin(x * 23 + y * 17) * Math.cos(y * 29 - z * 11) + 0.009 * Math.sin(y * 61 + x * 9) + 0.006 * Math.cos(x * 71 - y * 37);
    p.setXYZ(i, x * bul + n * 0.6, y + n * 0.4, (z * bul + n) * top); }
  g.computeVertexNormals(); return g; })();
const sacoTex = (k: string, l: string[], ink: string) => ctex("saco" + k, 512, 512, (g) => { g.clearRect(0, 0, 512, 512); g.fillStyle = ink; g.textAlign = "center";
  g.font = "900 120px Montserrat, Arial"; g.fillText(l[0], 256, 230); g.font = "800 64px Montserrat, Arial"; g.fillText(l[1], 256, 320);
  g.strokeStyle = ink; g.lineWidth = 6; g.strokeRect(70, 110, 372, 250); });
const Saco: React.FC<{ c: string; k: string; l: string[]; ink: string }> = ({ c, k, l, ink }) => <group>
  <mesh position={[0, 0.675, 0]} geometry={sacoGeo} castShadow receiveShadow><meshStandardMaterial color={c} roughness={0.95} /></mesh>
  <RBox p={[0, 1.36, 0]} s={[0.96, 0.08, 0.06]} r={0.02}><meshStandardMaterial color={c} roughness={0.95} /></RBox>
  {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.42 + i * 0.077, 1.36, 0.035]}><boxGeometry args={[0.03, 0.012, 0.005]} /><meshStandardMaterial color="#5a4630" /></mesh>)}
  <mesh position={[0, 0.72, 0.26]}><planeGeometry args={[0.72, 0.72]} /><meshStandardMaterial map={sacoTex(k, l, ink)} transparent roughness={0.95} /></mesh></group>;
const H3BolsaCal: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const b1 = ent(tt, 0.3), b2 = ent(tt, 1.0), gira = eio(tt, 2.0, 3.4), luz = cl((tt - 3.2) * 2), cae = eio(tt, 4.6, 5.4), polvo = cl((tt - 5.3) * 1.2);
  const rebote = cae >= 1 ? 0.06 * Math.exp(-(tt - 5.4) * 6) * Math.sin((tt - 5.4) * 30) : 0;
  return <>
    <Estudio t={tt} cam={[0.1, 1.25, 3.9 - 0.06 * tt]} look={[0.1, 0.7, 0]} orbit={0.05}>
      <group position={[-0.7, lerp(2, 0, b1), 0.15]} rotation={[0, lerp(P, -0.12, gira) + 0.06 * Math.sin(tt * 0.6), 0]}>
        <Saco c="#c9a878" k="a" l={["CAL", "APAGADA"]} ink="#2a5a2e" />
      </group>
      <sprite position={[-0.7, 0.8, -0.2]} scale={[2.0 * luz + 0.01, 2.2 * luz + 0.01, 1]}><spriteMaterial map={humoTex()} color="#ffe2a0" transparent opacity={0.5 * luz} depthWrite={false} /></sprite>
      <group position={[0.85, 0, -0.35]} rotation={[-(P2 - 0.08) * cae + rebote, -0.2, 0]}>
        <group position={[0, lerp(2, 0, b2), 0]}><Saco c="#8f8d86" k="b" l={["CAL", "VIVA"]} ink="#2a2a2a" /></group>
      </group>
      {polvo > 0 && <Vapor t={tt - 5.3} p={[0.85, 0.1, -1.0]} o={0.5 * (1 - 0.6 * polvo)} h={0.7} s={0.45} spread={0.6} n={14} />}
      <pointLight position={[-0.7, 1.0, 1.0]} intensity={0.01 + 3 * luz} distance={2.5} color="#ffe2a0" />
    </Estudio>
    <Head tt={tt} kick="TRUCO 4" title="CUÁL CAL, Y CUÁL JAMÁS" />
  </>;
}}</Stage>;

// ── 5 · EL JARRO: la cucharada de cal cae en el agua tibia, la nube blanca gira con la cuchara y se asienta; recién ahí va a la olla
const H3VasoCal: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const vierte = eio(tt, 1.0, 1.9), nube = cl((tt - 1.9) / 1.0), gira = tt > 6.9 ? (tt - 6.9) : 0, turbio = 0.3 + 0.55 * cl((tt - 2.2) / 1.5);
  return <>
    <Estudio t={tt} cam={[0, 1.4, 3.3]} look={[0, 0.6, 0]} orbit={0.12}>
      <group position={[0, 0, 0.2]}>
        <mesh geometry={vasoGeo} scale={[1.6, 1.3, 1.6]} castShadow>{M.vidrio()}</mesh>
        <mesh position={[0, 0.5, 0]} scale={[1.6, 1, 1.6]}><cylinderGeometry args={[0.31, 0.3, 0.95, 40]} /><meshPhysicalMaterial color={new THREE.Color("#cfe6ee").lerp(new THREE.Color("#f6f4ee"), turbio)} transparent opacity={0.35 + 0.35 * turbio} roughness={0.2} /></mesh>
        {Array.from({ length: 26 }, (_, i) => { const a = rn(i, 1) * 6.28 + tt * (0.6 + gira * 1.4), r = 0.06 + rn(i, 2) * 0.36 * nube, y = 0.95 - nube * (0.2 + rn(i, 3) * 0.55);
          return <sprite key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]} scale={[0.25 + 0.2 * nube, 0.25 + 0.2 * nube, 1]}><spriteMaterial map={humoTex()} color="#ffffff" transparent opacity={0.35 * nube} depthWrite={false} /></sprite>; })}
        <group position={[0.15 + 0.12 * Math.cos(gira * 5), lerp(1.9, 1.15, cl(tt - 6.6)), 0.12 * Math.sin(gira * 5)]} rotation={[0.3, 0, 0.2]}><mesh><cylinderGeometry args={[0.035, 0.04, 1.4, 10]} />{M.madera("#a06a3c")}</mesh></group>
      </group>
      <group position={[0.9, 1.7 - 0.3 * vierte, 0.2]} rotation={[0, 0, 0.3 + 1.3 * vierte]}><Cuchara p={[0, 0, 0]} rot={[0, P2, 0]} s={1.2} mat="cromo" /></group>
      {vierte > 0.6 && tt < 2.4 && <Chorro a={[0.55, 1.5, 0.2]} b={[0.1, 1.05, 0.2]} r={0.03} c="#ffffff" o={0.8} />}
    </Estudio>
    <Head tt={tt} kick="TRUCO 5" title="LA CAL SE DESHACE APARTE" />
    <Tag tt={tt} at={5.2} x={1400} y={760} txt="1 LITRO TIBIO" col={MZ} size={46} />
  </>;
}}</Stage>;

// ── 6 · DUELO DE OLLAS: hierven lado a lado; la de aluminio se mancha de gris por dentro, la de peltre sigue limpia y brilla
const H3Aluminio: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const man = eio(tt, 0.4, 3.0), brillo = cl((tt - 3.4) * 1.5);
  return <>
    <Estudio t={tt} cam={[0, 2.3, 3.7]} look={[0, 0.4, 0]} orbit={0.1}>
      {[-1, 1].map((s) => { const alu = s < 0; return <group key={s} position={[s * 0.95, 0, 0]}>
        <Olla mat="peltre" s={1} nivel={0.62} caldo={alu ? "#b9b29a" : "#e7c45a"} t={tt} hervor={0.7}>
          {alu && <mesh geometry={lathe([[0, 0], [0.5, 0], [0.62, 0.12], [0.68, 0.42], [0.64, 0.7], [0.6, 0.76], [0.66, 0.8]])} scale={1.003}><meshStandardMaterial color={new THREE.Color("#d9dce0").lerp(new THREE.Color("#5c5d5b"), 0.75 * man)} roughness={0.25 + 0.5 * man} metalness={1 - 0.6 * man} side={THREE.DoubleSide} /></mesh>}
        </Olla>
        {Array.from({ length: 14 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.48; return <Grano key={i} p={[Math.cos(a) * r, 0.47 + 0.02 * Math.sin(tt * 6 + i), Math.sin(a) * r]} rot={[rn(i, 3), rn(i, 4) * 6, 0]} s={0.05} c={alu ? new THREE.Color(COL.amarillo).lerp(new THREE.Color("#6b6a62"), 0.6 * man).getStyle() : COL.nixta} />; })}
        <Llama p={[0, -0.02, 0]} f={0.6} t={tt} r={0.42} />
        <Vapor t={tt} p={[0, 0.6, 0]} o={0.22} />
      </group>; })}
      <pointLight position={[1.0, 1.4, 0.9]} intensity={0.01 + 4 * brillo} distance={2.2} color="#fff0d0" />
    </Estudio>
    <Head tt={tt} kick="TRUCO 6" title="NUNCA EN OLLA DE ALUMINIO" />
    <Tag tt={tt} at={1.0} x={640} y={900} txt="ALUMINIO" col={RED} size={46} />
    <Tag tt={tt} at={3.6} x={1290} y={900} txt="PELTRE" col={MZ} size={46} />
  </>;
}}</Stage>;

// ── 7 · DEL BLANCO AL AMARILLO: los granos en la olla de peltre van tomando color; justo en el amarillo arranca el reloj de cocina
const timerTex = () => ctex("timer", 512, 512, (g) => {
  g.fillStyle = "#f4efe2"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill();
  g.strokeStyle = "#2a1c12"; g.lineWidth = 6; for (let i = 0; i < 60; i++) { const a = (i / 60) * 6.283 - P2, r0 = i % 5 ? 220 : 196; g.beginPath(); g.moveTo(256 + Math.cos(a) * r0, 256 + Math.sin(a) * r0); g.lineTo(256 + Math.cos(a) * 236, 256 + Math.sin(a) * 236); g.stroke(); }
  g.fillStyle = "#2a1c12"; g.font = "900 64px Montserrat, Arial"; g.textAlign = "center"; g.textBaseline = "middle"; ["0", "15", "30", "45"].forEach((s, i) => { const a = (i / 4) * 6.283 - P2; g.fillText(s, 256 + Math.cos(a) * 150, 256 + Math.sin(a) * 150); });
});
const H3Muestrario: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const col = eio(tt, 3.6, 6.4), arr = cl(tt - 6.6), tm = ent(tt, 0.8);
  return <>
    <Estudio t={tt} cam={[0, 2.4, 3.4]} look={[0, 0.35, 0.1]} orbit={0.12}>
      <group position={[-0.5, 0, 0]}>
        <Olla mat="peltre" s={1.15} nivel={0.6} caldo={new THREE.Color("#d9e6e6").lerp(new THREE.Color("#e8c25a"), col).getStyle()} t={tt} hervor={cl(tt - 4)} />
        {Array.from({ length: 30 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.55; return <Grano key={i} p={[Math.cos(a) * r, 0.52 + 0.02 * Math.sin(tt * 5 + i), Math.sin(a) * r]} rot={[rn(i, 3), rn(i, 4) * 6, 0]} s={0.06} c={new THREE.Color(COL.blanco).lerp(new THREE.Color(COL.nixta), cl(col * 1.2 - rn(i, 5) * 0.2)).getStyle()} />; })}
        <Llama p={[0, -0.02, 0]} f={0.7} t={tt} r={0.45} />
      </group>
      <group position={[1.15, 0.45 + lerp(1.4, 0, tm), 0.3]} rotation={[-0.25, -0.45, 0]}>
        <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.42, 0.45, 0.22, 48]} /><meshPhysicalMaterial color="#c0392b" roughness={0.3} clearcoat={1} /></mesh>
        <mesh position={[0, 0, 0.115]}><circleGeometry args={[0.38, 48]} /><meshStandardMaterial map={timerTex()} /></mesh>
        <group position={[0, 0, 0.125]} rotation={[0, 0, -arr * 2.6]}><mesh position={[0, 0.15, 0]}><boxGeometry args={[0.025, 0.3, 0.01]} /><meshStandardMaterial color="#1c1a19" /></mesh></group>
      </group>
      <pointLight position={[1.15, 0.6, 1.0]} intensity={0.01 + 3 * arr * (0.7 + 0.3 * Math.sin(tt * 3))} distance={1.8} color="#ffcf70" />
    </Estudio>
    <Head tt={tt} kick="TRUCO 7" title="EN AMARILLO EMPIEZA A CONTAR" />
  </>;
}}</Stage>;

// ── 8 · LA UÑA: macro de un grano tibio; el pulgar lo aprieta y la piel transparente se desprende sola y se levanta
const pielGeo = new THREE.SphereGeometry(1, 28, 16, 0, P, 0, P * 0.55);
const H3Una: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const llega = ent(tt, 1.2), aprieta = eio(tt, 3.2, 3.9) * (1 - eio(tt, 6.2, 6.9)), piel = eio(tt, 4.0, 5.8), sale = eio(tt, 6.3, 7.3);
  const tip: V3 = [lerp(1.5, 0.31, llega) + 0.9 * sale, lerp(0.95, 0.4, llega) - 0.03 * aprieta + 0.5 * sale, 0.04];
  return <>
    <Estudio t={tt} cam={[0.25, 0.95, 1.9 - 0.04 * tt]} look={[0.12, 0.36, 0]} orbit={0.06} fov={30}>
      <mesh position={[0, 0.02, 0]} rotation={[-P2, 0, 0]} receiveShadow><circleGeometry args={[1.4, 48]} /><meshPhysicalMaterial color="#2c4a6e" roughness={0.3} clearcoat={1} /></mesh>
      <group position={[0, 0.34, 0]} rotation={[0, -0.25, 0.12]} scale={[1, 1 - 0.07 * aprieta, 1]}>
        <Grano p={[0, 0, 0]} s={0.29} c={COL.nixta} brillo={0.15} />
        <group position={[-0.06, 0.28, 0]} rotation={[0, 0, 0.8 * piel]}>
          <mesh position={[0.06, -0.28, 0]} scale={[0.305, 0.345, 0.19]} geometry={pielGeo}><meshPhysicalMaterial color="#fff2c8" transparent opacity={0.6} roughness={0.15} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        </group>
        <mesh position={[0.29, 0.05, 0.02]} rotation={[0, 0, 0.3]} visible={aprieta > 0.3 || piel > 0}><boxGeometry args={[0.012, 0.16, 0.012]} /><meshStandardMaterial color="#8a5a1a" /></mesh>
      </group>
      <group position={[tip[0] + 0.36, tip[1], tip[2]]} rotation={[0, 0.2, -P2 + 0.25]}>
        <mesh castShadow><capsuleGeometry args={[0.125, 0.45, 10, 20]} /><meshPhysicalMaterial color="#d49a74" roughness={0.55} sheen={1} sheenColor="#ffd0b0" /></mesh>
        <mesh position={[-0.1, -0.27, 0]} scale={[0.035, 0.12, 0.1]}><sphereGeometry args={[1, 20, 12]} /><meshPhysicalMaterial color="#f6dccc" roughness={0.18} clearcoat={1} /></mesh>
        <mesh position={[0, 0.04, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.127, 0.006, 6, 24]} /><meshStandardMaterial color="#a86a4c" /></mesh>
        <RBox p={[0.06, 0.52, 0]} s={[0.46, 0.4, 0.4]} r={0.15}><meshPhysicalMaterial color="#cf946e" roughness={0.6} sheen={1} sheenColor="#ffd0b0" /></RBox>
      </group>
      <Vapor t={tt} p={[0, 0.5, 0]} o={0.22} h={0.7} s={0.18} n={6} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 8" title="LA PRUEBA DE LA UÑA" />
  </>;
}}</Stage>;

// ── 9 · DOS RELOJES DE ARENA: el grano nuevo (lleno de agua) gasta menos arena que el viejo y seco
const H3RelojPared: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const corre = eio(tt, 0.8, 6.0), corta = cl((tt - 2.6) * 2);
  const Reloj: React.FC<{ x: number; k: number; a: number }> = ({ x, k, a }) => (
    <group position={[x, lerp(1.6, 0, ent(tt, a)), 0]}>
      {[0.05, 1.45].map((y) => <RBox key={y} p={[0, y, 0]} s={[0.7, 0.08, 0.7]} r={0.03}>{M.madera("#6a4024")}</RBox>)}
      {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map(([a2, b], i) => <mesh key={i} position={[a2, 0.75, b]}><cylinderGeometry args={[0.025, 0.025, 1.4, 8]} />{M.madera("#6a4024")}</mesh>)}
      <mesh position={[0, 0.75, 0]} geometry={lathe([[0.001, -0.65], [0.26, -0.6], [0.24, -0.25], [0.04, 0], [0.24, 0.25], [0.26, 0.6], [0.001, 0.65]])} scale={1}>{M.vidrio()}</mesh>
      <mesh position={[0, 0.75 + 0.08, 0]} scale={[1, 1 - k * 0.95, 1]}><coneGeometry args={[0.22, 0.45, 32]} /><meshStandardMaterial color="#e3c48a" roughness={0.95} /></mesh>
      <mesh position={[0, 0.16 + 0.12 * k, 0]} scale={[1, 0.05 + k, 1]}><coneGeometry args={[0.24, 0.3, 32]} /><meshStandardMaterial color="#e3c48a" roughness={0.95} /></mesh>
      {k > 0.02 && k < 0.98 && <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.008, 0.008, 0.45, 6]} /><meshStandardMaterial color="#e3c48a" /></mesh>}
    </group>);
  return <>
    <Estudio t={tt} cam={[0, 1.4, 4.0]} look={[0, 0.75, 0]} orbit={0.12}>
      <Reloj x={-1.0} k={corre * 0.62 * (1 - corta) + corre * 0.62 * corta} a={0.3} />
      <Reloj x={1.0} k={corre} a={0.6} />
      <Grano p={[-1.0, 1.75 + 0.05 * Math.sin(tt * 1.5), 0.2]} s={0.16} c={COL.blanco} brillo={1} glow={0.1} />
      <Grano p={[1.0, 1.75 + 0.05 * Math.sin(tt * 1.5 + 1), 0.2]} s={0.16} c="#d9cfa8" brillo={0} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 9" title="CADA MAÍZ SU TIEMPO" />
    <Tag tt={tt} at={1.2} x={590} y={940} txt="NUEVO: MENOS" col={MZ} size={44} />
    <Tag tt={tt} at={1.8} x={1330} y={940} txt="VIEJO: MÁS" col={TX} size={44} />
  </>;
}}</Stage>;

// ── 10 · TODA LA NOCHE: se apaga la lumbre, la tapa baja con el trapo y el reloj de pared corre de las 6 de la tarde a las 6 de la mañana
const relojTex = () => ctex("relojpared", 512, 512, (g) => {
  g.fillStyle = "#f2ead6"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill(); g.fillStyle = "#2a1c12"; g.font = "700 70px Caveat, cursive"; g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 1; i <= 12; i++) { const a = (i / 12) * 6.283 - P2; g.fillText(String(i), 256 + Math.cos(a) * 196, 256 + Math.sin(a) * 196); }
});
const H3Ventana: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#0f1420">{(tt) => {
  const tapa = eio(tt, 0.3, 1.4), apaga = 1 - eio(tt, 0.2, 1.0), horas = eio(tt, 2.0, 7.4) * 12, noche = cl((tt - 1.8) * 0.6) * (1 - cl((tt - 7.0) * 1.5));
  return <>
    <Estudio t={tt} cam={[0, 1.5, 3.9]} look={[0, 0.9, 0]} orbit={0.1}>
      <Olla mat="barro" s={1.15} p={[-0.6, 0, 0.3]} />
      <group position={[-0.6, 0.93 + lerp(0.8, 0, tapa), 0.3]}><mesh castShadow geometry={lathe([[0.001, 0.12], [0.3, 0.1], [0.7, 0.02], [0.74, 0]])}>{M.barro("#8a4526")}</mesh>
        <mesh position={[0, 0.15, 0]} rotation={[0.2, 0, 0.1]} scale={[0.9, 0.15, 0.6]}><sphereGeometry args={[0.6, 16, 8]} /><meshStandardMaterial color="#c9b48a" roughness={1} /></mesh></group>
      <Llama p={[-0.6, -0.02, 0.3]} f={0.6 * apaga} t={tt} r={0.45} />
      <group position={[0.95, 1.4, -0.4]}>
        <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.62, 0.62, 0.1, 48]} />{M.madera("#5a3218")}</mesh>
        <mesh position={[0, 0, 0.056]}><circleGeometry args={[0.55, 48]} /><meshStandardMaterial map={relojTex()} emissive="#ffe8b0" emissiveIntensity={0.25 * noche} emissiveMap={relojTex()} /></mesh>
        <group position={[0, 0, 0.07]} rotation={[0, 0, -(6 + horas) / 12 * 6.283]}><mesh position={[0, 0.15, 0]}><boxGeometry args={[0.035, 0.3, 0.01]} /><meshStandardMaterial color="#1c1a19" /></mesh></group>
        <group position={[0, 0, 0.075]} rotation={[0, 0, -horas * 6.283]}><mesh position={[0, 0.22, 0]}><boxGeometry args={[0.022, 0.44, 0.01]} /><meshStandardMaterial color="#1c1a19" /></mesh></group>
      </group>
      <pointLight position={[0.95, 1.5, 0.3]} intensity={0.01 + 2 * noche} distance={2} color="#9ab8ff" />
    </Estudio>
    <Head tt={tt} kick="TRUCO 10" title="TODA LA NOCHE, TAPADO" />
    <Tag tt={tt} at={3.3} x={1430} y={880} txt="8 A 12 HORAS" col={MZ} size={50} />
  </>;
}}</Stage>;

// ── 11 · TIRA DE pH: la tira entra al nejayote y se pinta de violeta; la maceta que lo recibe se marchita
const H3TiraPH: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const baja = eio(tt, 1.6, 2.6) * (1 - eio(tt, 3.6, 4.4)), vio = cl((tt - 2.7) * 1.2), seca = eio(tt, 6.4, 7.4);
  return <>
    <Estudio t={tt} cam={[0, 1.5, 3.8]} look={[0, 0.7, 0]} orbit={0.12}>
      <group position={[-0.6, 0, 0.2]}>
        <mesh geometry={jarroGeo} scale={1.6} castShadow>{M.vidrio()}</mesh>
        <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.5, 0.45, 0.82, 40]} />{M.liquido("#e6c04a", 0.75)}</mesh>
        <group position={[0.05, 1.45 - 0.75 * baja, 0]}>
          <mesh><boxGeometry args={[0.1, 0.9, 0.01]} /><meshStandardMaterial color="#f7f3e8" /></mesh>
          <mesh position={[0, -0.3, 0.006]}><planeGeometry args={[0.1, 0.28]} /><meshStandardMaterial color={new THREE.Color("#f2e6a0").lerp(new THREE.Color("#5b2a86"), vio)} /></mesh>
        </group>
      </group>
      <group position={[0.85, 0, 0]}>
        <mesh geometry={lathe([[0, 0], [0.32, 0], [0.42, 0.55], [0.46, 0.6]])} castShadow receiveShadow>{M.barro("#a65a35")}</mesh>
        <mesh position={[0, 0.56, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.42, 32]} /><meshStandardMaterial color="#3b2a1c" roughness={1} /></mesh>
        {Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * 6.28; return <group key={i} position={[0, 0.6, 0]} rotation={[0, a, 0]}>
          <mesh position={[0, 0.35 - 0.2 * seca, 0.18 + 0.12 * seca]} rotation={[0.4 + 1.2 * seca, 0, 0]} scale={[0.09, 0.35, 0.02]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={new THREE.Color("#3f8a3a").lerp(new THREE.Color("#8a7a3a"), seca)} roughness={0.7} /></mesh></group>; })}
      </group>
      {tt > 6.0 && tt < 7.2 && <Chorro a={[0.15, 1.4, 0.1]} b={[0.8, 0.6, 0]} r={0.035} c="#e6c04a" o={0.85} />}
    </Estudio>
    <Head tt={tt} kick="TRUCO 11" title="EL NEJAYOTE NO VA A LAS PLANTAS" />
    <Tag tt={tt} at={3.0} x={560} y={330} txt="NEJAYOTE" col={MZ} size={46} />
  </>;
}}</Stage>;

// ── 12 · GRANO EN CAPAS: el grano se abre en vista explotada (piel, cuerpo, germen); al lavar, la mitad de la piel se queda pegada
const H3Capas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const exp = eio(tt, 0.4, 2.2) * (1 - eio(tt, 4.4, 5.4)), mitad = eio(tt, 5.4, 6.6), gira = tt * 0.25;
  return <>
    <Estudio t={tt} cam={[0, 1.2, 3.0]} look={[0, 0.7, 0]} orbit={0.1} fov={30}>
      <group position={[0, 0.75, 0]} rotation={[0, gira, 0.15]}>
        <Grano p={[0, 0, 0]} s={0.36} c="#f3e2a8" brillo={0.1} />
        <mesh position={[0.06 - 0.25 * exp, -0.12, 0.08 + 0.1 * exp]} scale={[0.1, 0.16, 0.06]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#e7a64a" roughness={0.5} /></mesh>
        {/* la piel en dos mitades: una se queda pegada al grano, la otra se va al lavar */}
        <mesh scale={[0.385, 0.44, 0.25]} position={[0.55 * exp, 0.1 * exp, 0]}><sphereGeometry args={[1, 24, 16, 0, P]} /><meshPhysicalMaterial color="#f7d36a" transparent opacity={0.42} roughness={0.25} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        <mesh scale={[0.385, 0.44, 0.25]} position={[0.55 * exp + 0.9 * mitad, 0.1 * exp + 0.5 * mitad, 0]} rotation={[0, 0, -0.8 * mitad]}><sphereGeometry args={[1, 24, 16, P, P]} /><meshPhysicalMaterial color="#f7d36a" transparent opacity={0.42 * (1 - mitad)} roughness={0.25} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      </group>
      {Array.from({ length: 16 }, (_, i) => { const k = cl((tt - 5.4 - rn(i, 1) * 0.6) / 1.4); return k > 0 && k < 1 ? <mesh key={i} position={[0.6 + k * (0.4 + rn(i, 2)), 0.9 - k * 0.9, (rn(i, 3) - 0.5) * 0.6]} rotation={[k * 3, i, 0]} scale={[0.05, 0.05, 0.005]}><circleGeometry args={[1, 6]} /><meshStandardMaterial color="#f7d36a" transparent opacity={0.6 * (1 - k)} side={THREE.DoubleSide} /></mesh> : null; })}
    </Estudio>
    <Head tt={tt} kick="TRUCO 12" title="SE FROTA, PERO NO SE PELA TODO" />
    <Tag tt={tt} at={1.4} x={1330} y={380} txt="PIEL" col={MZ} size={44} />
    <Tag tt={tt} at={1.9} x={690} y={700} txt="GERMEN" col={TX} size={40} />
  </>;
}}</Stage>;

// ── A · LOS 5 ERRORES: pila de cinco tortillas; en cada «error» una sube, gira hacia cámara y se parte en dos; atrás, la foto de ese error
const partida = (tt: number, a: number) => eio(tt, a + 1.0, a + 1.8);
const MediaTort: React.FC<{ lado: number; sep: number }> = ({ lado, sep }) => (
  <mesh position={[lado * sep * 0.35, -sep * 0.4, 0]} rotation={[0, 0, lado * sep * 0.5]}>
    <cylinderGeometry args={[0.5, 0.5, 0.02, 32, 1, false, lado > 0 ? 0 : P, P]} /><meshStandardMaterial map={tortTex()} roughness={0.85} side={THREE.DoubleSide} /></mesh>);
const H3Errores: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const T = [0.7, 6.7, 11.7, 15.7, 19.5], fotos = (h.imgs ?? ["fb04", "fb05", "fb06", "fb15", "fb16"]);
  const cur = T.filter((a) => tt >= a).length - 1;
  return <>
    <Estudio t={tt} cam={[0, 1.6, 4.2]} look={[0, 0.8, 0]} orbit={0.1}>
      {T.map((a, i) => { const sube = eio(tt, a, a + 0.9), sale = eio(tt, (T[i + 1] ?? 99) - 0.4, (T[i + 1] ?? 99) + 0.3), sep = partida(tt, a);
        const y = 0.05 + (4 - i) * 0.03 + sube * (1.0 - (4 - i) * 0.03), x = sale * -2.6;
        return <group key={i} position={[x - 0.9, y, 0.3 + sale * 0.6]} rotation={[lerp(0, 1.25, sube), 0, sale * 0.6]}>
          {sep < 0.01 ? <Tortilla p={[0, 0, 0]} /> : <><MediaTort lado={1} sep={sep} /><MediaTort lado={-1} sep={sep} /></>}
        </group>; })}
      {T.map((a, i) => { const k = ent(tt, a + 0.4), out = eio(tt, (T[i + 1] ?? 99) - 0.3, (T[i + 1] ?? 99) + 0.4);
        return k > 0.01 && out < 0.99 ? <Foto3D key={"f" + i} src={img(fotos[i % fotos.length])} p={[0.95 + out * 2.5, lerp(-1, 1.0, k), -0.4]} rot={[0, -0.35, 0.04 * Math.sin(tt + i)]} w={1.5} h={1.0} /> : null; })}
    </Estudio>
    <Head tt={tt} kick="LOS 5 ERRORES" title="LA TORTILLA QUEBRADIZA" col={RED} />
    {T.map((a, i) => (cur === i ? <Tag key={i} tt={tt} at={a + 0.2} x={560} y={880} txt={`ERROR ${i + 1}`} col={RED} size={52} /> : null))}
  </>;
}}</Stage>;

// ── 13 · MOLINO DE MANO: el molino de fierro atornillado a la mesa; la manivela gira y la masa sale por la boca, primero gruesa, luego fina
const H3Molino: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const gira = Math.max(0, tt - 1.0) * 3.2, pasada2 = cl((tt - 4.5) * 1.5), sale = cl((tt - 1.4) / 5);
  return <>
    <Estudio t={tt} cam={[0.4, 1.7, 3.6]} look={[0, 0.8, 0]} orbit={0.14}>
      <RBox p={[0, 0.5, 0]} s={[2.4, 0.08, 1.2]} r={0.02}>{M.madera("#6a4024")}</RBox>
      <group position={[-0.2, 0.54, 0]}>
        <mesh position={[0, 0.35, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.22, 0.22, 0.6, 24]} />{M.hierro()}</mesh>
        <mesh position={[0, 0.75, 0]} geometry={lathe([[0.1, 0], [0.18, 0.05], [0.42, 0.45], [0.44, 0.48]])} castShadow>{M.hierro()}</mesh>
        {Array.from({ length: 20 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.3; return <Grano key={i} p={[Math.cos(a) * r, 1.1 - (tt * 0.03 % 0.1), Math.sin(a) * r]} rot={[rn(i, 3), rn(i, 4) * 6, 0]} s={0.05} c={COL.nixta} />; })}
        <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[0.18, 0.5, 0.18]} />{M.hierro()}</mesh>
        <group position={[0.36, 0.35, 0]} rotation={[gira, 0, 0]}>
          <mesh position={[0.02, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />{M.hierro()}</mesh>
          <mesh position={[0.08, 0.22, 0]}><boxGeometry args={[0.04, 0.5, 0.06]} />{M.hierro()}</mesh>
          <mesh position={[0.16, 0.45, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.05, 0.2, 12]} />{M.madera("#8a5a30")}</mesh>
        </group>
      </group>
      <group position={[-0.95, 0.54, 0]}>
        <mesh geometry={lathe([[0, 0], [0.32, 0], [0.42, 0.14]])} castShadow receiveShadow>{M.barro("#8f4a28")}</mesh>
        <Masa p={[0, 0.1 + 0.08 * sale, 0]} s={0.12 + 0.2 * sale} grumo={1 - pasada2} c={pasada2 > 0.5 ? "#ead9a2" : "#e2cc8a"} />
      </group>
      {sale > 0.02 && <mesh position={[-0.6, 0.62, 0]} rotation={[0, 0, 0.9]}><cylinderGeometry args={[0.035, 0.05, 0.4, 10]} /><meshStandardMaterial color="#e2cc8a" roughness={0.95} /></mesh>}
    </Estudio>
    <Head tt={tt} kick="TRUCO 13" title="MOLINO DE MANO: DOS PASADAS" />
    <Tag tt={tt} at={4.6} x={560} y={330} txt="1ª ABIERTA" col={TX} size={42} />
  </>;
}}</Stage>;

export const MAPB1: Record<string, C> = { mazorca: H3Mazorca, cubeta: H3Cubeta, balanza: H3Balanza, bolsacal: H3BolsaCal, vasocal: H3VasoCal, aluminio: H3Aluminio,
  muestrario: H3Muestrario, una: H3Una, relojpared: H3RelojPared, ventanaluna: H3Ventana, tiraph: H3TiraPH, capasgrano: H3Capas, errorestort: H3Errores, molino: H3Molino };
export { granoGeo, Masa, jarroGeo, vasoGeo, ent };
