// chen29b · «Lo que Siembra un Jubilado de Rancho con $500 en su Patio»: componentes 3D únicos (1 por minuto, ninguno
// repetido en la tanda chen29). Cada uno = un objeto que se entiende sin leer, sobre la foto del momento desenfocada (Stage),
// con física de resorte y cámara curva (Estudio). Palabras sólo DENTRO de la escena (papel, etiqueta), ≤5. Render SÓLO en el farm.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, phys, Stage } from "./ckit";
import { ctex, Estudio, fall, lathe, M, papel, RBox, rn, V3, Vapor, Yute } from "./estudio3d";
import { Mano, Plato } from "./kit3d";
import { Billete, Moneda, Pila } from "./kit29";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;
const Etq: React.FC<{ p: V3; rot?: V3; txt: string[]; w?: number; h?: number; bg?: string; ink?: string; size?: number }> = ({ p, rot = [-0.5, 0, 0], txt, w = 0.7, h = 0.3, bg = "#f1ead6", ink = "#2a1c12", size }) =>
  <mesh position={p} rotation={rot} castShadow><planeGeometry args={[w, h]} /><meshStandardMaterial map={papel("e" + txt.join("|") + bg + ink, txt, { w: 512, h: Math.round(512 * h / w), bg, ink, size: size ?? Math.min(110, Math.round(512 * h / w / (txt.length + 0.4))) })} roughness={0.9} side={THREE.DoubleSide} /></mesh>;
const Gota: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => <mesh position={p} scale={[0.02 * s, 0.026 * s, 0.02 * s]}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color="#e8f4f8" roughness={0.02} transmission={0.6} transparent opacity={0.7} clearcoat={1} /></mesh>;
// suelo de tierra SIN bordes: textura de tierra con grumos y alfa radial que se funde con la foto (nunca «placa»)
const sueloTex = (c: string) => ctex("suelo" + c, 512, 512, (g) => { g.fillStyle = c; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${i % 2 ? "0,0,0" : "255,230,190"},${0.04 + rn(i, 2) * 0.08})`; g.beginPath(); g.arc(rn(i, 3) * 512, rn(i, 4) * 512, 1 + rn(i, 5) * 5, 0, 7); g.fill(); } });
const fadeTex = () => ctex("sueloFade", 256, 256, (g) => { const r = g.createRadialGradient(128, 128, 40, 128, 128, 128); r.addColorStop(0, "#fff"); r.addColorStop(1, "#000"); g.fillStyle = r; g.fillRect(0, 0, 256, 256); });
const Suelo: React.FC<{ c?: string }> = ({ c = "#6b4a2e" }) => <mesh rotation={[-P2, 0, 0]} position={[0, -0.002, 0]} receiveShadow><circleGeometry args={[3.2, 64]} /><meshStandardMaterial map={sueloTex(c)} alphaMap={fadeTex()} transparent depthWrite={false} roughness={0.95} /></mesh>;

// ---------- piezas del patio (locales a chen29b) ----------
// cubeta de 19 L: plástico abierto, borde y asa de alambre; alto 1 (escala s)
const cubGeo = lathe([[0, 0], [0.34, 0], [0.4, 1.0], [0.43, 1.0], [0.43, 1.04], [0.39, 1.04], [0.33, 0.04], [0.001, 0.04]], 44);
const tierraGeo = new THREE.CircleGeometry(1, 40);
const Cubeta: React.FC<{ p?: V3; s?: number; c?: string; tierra?: number; emis?: string; ei?: number; children?: React.ReactNode }> = ({ p, s = 1, c = "#f2efe8", tierra = 0.9, emis = "#000000", ei = 0, children }) => (
  <group position={p} scale={s}>
    <mesh geometry={cubGeo} castShadow receiveShadow><meshStandardMaterial color={c} roughness={0.45} emissive={emis} emissiveIntensity={ei} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 1.0, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.43, 0.006, 6, 40, P]} /><meshStandardMaterial color="#8a8d90" metalness={0.8} roughness={0.3} /></mesh>
    {tierra > 0 && <mesh position={[0, tierra, 0]} rotation={[-P2, 0, 0]} scale={0.34 + 0.06 * tierra} geometry={tierraGeo} receiveShadow><meshStandardMaterial color="#3a2618" roughness={1} /></mesh>}
    <group position={[0, tierra, 0]}>{children}</group>
  </group>
);
// mata: tallo + hojas en espiral; g = crecimiento 0..1, caida = hojas mustias 0..1
const hojaGeo = new THREE.SphereGeometry(1, 12, 8);
const Mata: React.FC<{ g: number; h?: number; n?: number; c?: string; caida?: number; seed?: number; hs?: number }> = ({ g, h = 0.7, n = 9, c = "#4f8a3a", caida = 0, seed = 1, hs = 1 }) => {
  const gg = cl(g);
  return <group scale={[1, Math.max(0.001, gg), 1]}>
    <mesh position={[0, h / 2, 0]} castShadow><cylinderGeometry args={[0.012, 0.02, h, 8]} /><meshStandardMaterial color="#5c7a32" roughness={0.8} /></mesh>
    {Array.from({ length: n }, (_, i) => { const y = h * (0.2 + 0.8 * i / n), a = i * 2.4 + seed;
      return <group key={i} position={[0, y, 0]} rotation={[0, a, 0.9 + caida * 1.0 + rn(i, seed) * 0.2]}>
        <mesh position={[0.11 * hs, 0, 0]} scale={[0.12 * hs, 0.012, 0.055 * hs]} geometry={hojaGeo} castShadow>
          <meshStandardMaterial color={new THREE.Color(c).lerp(new THREE.Color("#8a7a3a"), caida * 0.7)} roughness={0.7} side={THREE.DoubleSide} /></mesh></group>; })}
  </group>;
};
const esfGeo = new THREE.SphereGeometry(1, 24, 16);
const Jito: React.FC<{ p: V3; s?: number; c?: string }> = ({ p, s = 0.07, c = "#c8321e" }) => <group position={p}>
  <mesh scale={[s, s * 0.86, s]} geometry={esfGeo} castShadow><meshPhysicalMaterial color={c} roughness={0.25} clearcoat={0.8} /></mesh>
  <mesh position={[0, s * 0.85, 0]} rotation={[-P2, 0, 0]} scale={s * 0.5}><circleGeometry args={[1, 5]} /><meshStandardMaterial color="#3f6a2a" side={THREE.DoubleSide} /></mesh></group>;
const Ladrillo: React.FC<{ p: V3; rot?: V3 }> = ({ p, rot }) => <RBox p={p} rot={rot} s={[0.42, 0.13, 0.2]} r={0.012}><meshStandardMaterial color="#a4502e" roughness={0.9} /></RBox>;
const Sobrecito: React.FC<{ p?: V3; rot?: V3; txt: string; c: string }> = ({ p, rot, txt, c }) => <group position={p} rotation={rot}>
  <RBox s={[0.3, 0.42, 0.012]} r={0.006}><meshStandardMaterial map={ctex("sob" + txt + c, 256, 360, (g) => { g.fillStyle = "#f3ead2"; g.fillRect(0, 0, 256, 360); g.fillStyle = c; g.beginPath(); g.arc(128, 150, 78, 0, 7); g.fill(); g.fillStyle = "#3f6a2a"; g.fillRect(118, 52, 20, 40); g.fillStyle = "#2a1c12"; g.font = "bold 38px sans-serif"; g.textAlign = "center"; g.fillText(txt, 128, 300); })} roughness={0.8} /></RBox></group>;

// ── 1 · DOS CAMINOS (0:03): el billete de $500 entre dos caminos: la canasta se llena y a la semana se vacía; la cubeta sigue dando
const H1Caminos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const vac = eio(tt, 3.6, 4.6), bill = phys(tt, 0, 6, 0.5);
  return <Estudio t={tt} cam={[0, 1.6, 3.3]} look={[0, 0.5, 0]} orbit={0.15}>
    <Billete p={[0, 1.2 - 0.2 * bill, 0.3]} rot={[-0.3, 0, Math.sin(tt * 1.5) * 0.1]} v="500" s={1.1 * bill} />
    <group position={[-1.0, 0, 0]}>
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow><cylinderGeometry args={[0.42, 0.32, 0.36, 28, 1, true]} /><Yute /></mesh>
      <mesh position={[0, 0.36, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.42, 0.025, 8, 36]} /><Yute /></mesh>
      {Array.from({ length: 10 }, (_, i) => { const on = phys(tt, 0.15 + i * 0.12, 6, 0.5) * (1 - vac); return <group key={i} scale={Math.max(0.001, on)}>
        {i % 3 === 2 ? <mesh position={[(rn(i, 1) - 0.5) * 0.4, 0.34 + rn(i, 2) * 0.1, (rn(i, 3) - 0.5) * 0.4]} scale={[0.06, 0.06, 0.06]} geometry={esfGeo}><meshStandardMaterial color="#e8dfa8" /></mesh>
          : <Jito p={[(rn(i, 1) - 0.5) * 0.45, 0.36 + rn(i, 2) * 0.1, (rn(i, 3) - 0.5) * 0.45]} c={i % 3 ? "#c8321e" : "#3f8a3a"} />}</group>; })}
      <Etq p={[0, 0.06, 0.62]} txt={["1 semana"]} w={0.62} h={0.22} />
    </group>
    <group position={[1.0, 0, 0]}>
      <Cubeta s={0.6}><Mata g={eio(tt, 0.1, 1.4)} h={0.9} /></Cubeta>
      {Array.from({ length: 5 }, (_, i) => { const k = ((tt - 1.8 - i * 0.6) % 3.0 + 3.0) % 3.0; const on = tt > 1.2 + i * 0.5;
        return on ? <Jito key={i} p={[0.12 * Math.sin(i * 2), 0.55 + 0.35 + 0.15 * (i % 3) - (k > 1.6 ? 0 : 0), 0.12 * Math.cos(i * 2)]} s={0.04 + 0.03 * cl(k / 1.2)} /> : null; })}
      <Etq p={[0, 0.06, 0.62]} txt={["todo el año"]} w={0.7} h={0.22} />
    </group>
    <Suelo />
  </Estudio>;
}}</Stage>;

// ── 2 · EL PATIO (0:37): la basura (llanta, tambo oxidado, botes) se hunde y salen las 12 cubetas, la milpa y el gallinero
const H2Patio: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const fuera = eio(tt, 0.25, 1.3);
  return <Estudio t={tt} cam={[0, 2.3, 3.8]} look={[0, 0.2, 0]} orbit={0.18}>
    <group position={[0, -0.6 * fuera, 0]} scale={Math.max(0.001, 1 - fuera)}>
      <mesh position={[-0.9, 0.12, 0.2]} rotation={[P2, 0, 0]} castShadow><torusGeometry args={[0.3, 0.12, 12, 28]} /><meshStandardMaterial color="#1e1c1b" roughness={0.9} /></mesh>
      <mesh position={[0.5, 0.4, -0.3]} rotation={[0, 0, 0.15]} castShadow><cylinderGeometry args={[0.28, 0.28, 0.8, 24]} /><meshStandardMaterial color="#7a4426" roughness={0.9} metalness={0.4} /></mesh>
      {[0, 1, 2].map((i) => <mesh key={i} position={[0.1 + i * 0.35, 0.08, 0.6]} rotation={[P2, 0, i]} castShadow><cylinderGeometry args={[0.08, 0.08, 0.2, 14]} /><meshStandardMaterial color="#a8a29a" roughness={0.6} metalness={0.5} /></mesh>)}
    </group>
    {Array.from({ length: 12 }, (_, i) => { const r = Math.floor(i / 6), c = i % 6, k = phys(tt, 1.0 + i * 0.12, 6, 0.5);
      return <group key={i} position={[(c - 2.5) * 0.48, 0, -0.1 + r * 0.55]} scale={Math.max(0.001, k)}>
        <Cubeta s={0.36}><Mata g={eio(tt, 2.2 + i * 0.1, 3.4 + i * 0.1)} h={0.9} seed={i} /></Cubeta></group>; })}
    {[0, 1, 2].map((r) => <group key={r} position={[-0.9 + r * 0.25, 0, -1.0]}>{[0, 1, 2, 3, 4].map((j) => <mesh key={j} position={[0, 0.3 * eio(tt, 3.0 + j * 0.1, 4.0), j * 0.0 - 0]} scale={[1, Math.max(0.001, eio(tt, 3.0 + j * 0.1, 4.0)), 1]} castShadow><cylinderGeometry args={[0.012, 0.015, 0.6, 6]} /><meshStandardMaterial color="#6a8a2a" /></mesh>)}</group>)}
    <group position={[1.15, 0, -0.75]} scale={Math.max(0.001, phys(tt, 2.6, 6, 0.5))}>
      <RBox p={[0, 0.25, 0]} s={[0.7, 0.5, 0.5]} r={0.02}><meshStandardMaterial color="#7a5a3a" roughness={0.95} /></RBox>
      <mesh position={[0, 0.58, 0]} rotation={[0, 0, 0]}><boxGeometry args={[0.8, 0.04, 0.6]} /><meshStandardMaterial color="#8a8d90" metalness={0.6} roughness={0.4} /></mesh>
      {[0, 1, 2].map((i) => <Pollita key={i} p={[(i - 1) * 0.28, 0, 0.42]} s={0.9} t={tt} i={i} />)}
    </group>
    <Suelo c={new THREE.Color("#8a6a48").lerp(new THREE.Color("#5e4028"), fuera).getStyle()} />
  </Estudio>;
}}</Stage>;

// ── 3 · LA CUBETA DOCE (0:55): once cubetas en arco con su mata; la doce, tapada con un costal, brilla y las monedas le giran
const H3Doce: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const brillo = eio(tt, 1.4, 2.2);
  return <Estudio t={tt} cam={[0, 1.9, 3.9]} look={[0, 0.35, 0]} orbit={0.16}>
    {Array.from({ length: 11 }, (_, i) => { const a = -1.15 + i * 0.23, k = phys(tt, i * 0.07, 6, 0.5);
      return <group key={i} position={[Math.sin(a) * 1.6, 0, -Math.cos(a) * 1.6 + 0.9]} scale={Math.max(0.001, k)}><Cubeta s={0.3}><Mata g={k} h={0.8} seed={i} /></Cubeta></group>; })}
    <group position={[0, 0, 0.9]} scale={Math.max(0.001, phys(tt, 0.8, 6, 0.45))}>
      <Cubeta s={0.5} ei={0.25 * brillo} emis="#ffcf6a" />
      <mesh position={[0, 0.56, 0]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.25, 24, 12, 0, P * 2, 0, P2]} /><Yute /></mesh>
      <pointLight position={[0, 0.9, 0.4]} intensity={4 * brillo} distance={3} color="#ffcf6a" />
      {Array.from({ length: 8 }, (_, i) => { const a = tt * 1.4 + i * P / 4; return <Moneda key={i} p={[Math.cos(a) * 0.45, 0.45 + 0.1 * Math.sin(a * 2), Math.sin(a) * 0.45]} rot={[P2, 0, a]} s={brillo} />; })}
      <Etq p={[0, 0.25, 0.27]} rot={[0, 0, 0]} txt={["12"]} w={0.26} h={0.2} bg="#ffe08a" />
    </group>
    <Suelo />
  </Estudio>;
}}</Stage>;

// ── 4 · LA CUENTA (2:16): el billete de $500 se parte en tres y cada pedazo vuela a lo suyo: sobrecitos, cubetas, pollitas
const SEM: [string, string][] = [["jitomate", "#c8321e"], ["chile", "#3f8a3a"], ["cilantro", "#6aa04a"], ["calabaza", "#d8b23a"], ["lechuga", "#9ac25a"], ["cebolla", "#e8e0d0"], ["frijol", "#6b2a1c"], ["epazote", "#4a6a2a"]];
const Pollita: React.FC<{ p: V3; s?: number; t: number; i: number }> = ({ p, s = 1, t, i }) => <group position={p} scale={s} rotation={[0, Math.sin(t * 3 + i) * 0.4, 0]}>
  <mesh position={[0, 0.12, 0]} scale={[0.13, 0.11, 0.15]} geometry={esfGeo} castShadow><meshStandardMaterial color="#b0703a" roughness={0.85} /></mesh>
  <mesh position={[0, 0.25 + 0.02 * Math.abs(Math.sin(t * 6 + i)), 0.1]} scale={0.07} geometry={esfGeo} castShadow><meshStandardMaterial color="#b0703a" roughness={0.85} /></mesh>
  <mesh position={[0, 0.25, 0.19]} rotation={[P2, 0, 0]}><coneGeometry args={[0.02, 0.05, 8]} /><meshStandardMaterial color="#e0a030" /></mesh>
  <mesh position={[0, 0.32, 0.1]} scale={[0.01, 0.03, 0.04]} geometry={esfGeo}><meshStandardMaterial color="#c0392b" /></mesh></group>;
const H4Cuenta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const parte = eio(tt, 0.2, 0.8);
  const dest: V3[] = [[-1.2, 0.5, 0.2], [0, 0.5, -0.1], [1.2, 0.5, 0.2]];
  return <Estudio t={tt} cam={[0, 2.0, 3.8]} look={[0, 0.4, 0]} orbit={0.14}>
    {[0, 1, 2].map((j) => { const k = eio(tt, 0.7 + j * 0.25, 1.6 + j * 0.25); const d = dest[j];
      return <group key={j} position={[lerp((j - 1) * 0.25 * parte, d[0], k), lerp(1.3, d[1] + 0.6, k) + Math.sin(k * P) * 0.4, lerp(0.3, d[2], k)]} rotation={[-0.3 - k * 0.6, 0, (j - 1) * 0.2 * parte]} scale={1 - 0.5 * k}>
        <group scale={[1 / 3, 1, 1]} position={[0, 0, 0]}><Billete v="500" s={1.6} /></group></group>; })}
    <group position={[-1.2, 0, 0.2]}>{SEM.map(([n, c], i) => { const k = phys(tt, 1.5 + i * 0.1, 6, 0.5); const a = (i - 3.5) * 0.18;
      return <Sobrecito key={n} p={[Math.sin(a) * 0.5 * k, 0.24 + Math.cos(a) * 0.05, -0.1 + i * 0.01]} rot={[-0.2, 0, -a * k]} txt={n} c={c} />; })}
      <Etq p={[0, 0.05, 0.55]} txt={["$120"]} w={0.5} h={0.24} /></group>
    <group position={[0, 0, -0.1]}>{Array.from({ length: 6 }, (_, i) => <Cubeta key={i} p={[0, i * 0.07 * phys(tt, 1.7 + i * 0.08, 6, 0.5), 0]} s={0.42} tierra={0} />)}
      <Etq p={[0, 0.05, 0.6]} txt={["$120"]} w={0.5} h={0.24} /></group>
    <group position={[1.2, 0, 0.2]}>{[0, 1, 2].map((i) => <Pollita key={i} p={[(i - 1) * 0.3, 0, (i % 2) * 0.15]} s={Math.max(0.001, 1.3 * phys(tt, 1.9 + i * 0.15, 6, 0.5))} t={tt} i={i} />)}
      <Etq p={[0, 0.05, 0.55]} txt={["$270"]} w={0.5} h={0.24} /></group>
  </Estudio>;
}}</Stage>;

// ── 5 · DOS JITOMATES (3:52): partidos a la mitad: el del patio rojo y macizo; el del súper pálido, que gotea agua
const mitadGeo = new THREE.SphereGeometry(1, 32, 20, 0, P * 2, 0, P2);
const Mitad: React.FC<{ p: V3; c: string; pulpa: string; abre: number; flip?: number }> = ({ p, c, pulpa, abre, flip = 1 }) => <group position={p}>
  {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.22 * abre, 0.25, 0]} rotation={[0, 0, sd * (P2 * abre)]}>
    <mesh scale={[0.25, 0.22, 0.25]} rotation={[0, 0, sd < 0 ? 0 : P]} geometry={mitadGeo} castShadow><meshPhysicalMaterial color={c} roughness={0.3} clearcoat={0.7} side={THREE.DoubleSide} /></mesh>
    <mesh rotation={[sd < 0 ? -P2 : P2, 0, 0]} scale={0.245} position={[0, 0, 0]}><circleGeometry args={[1, 32]} /><meshStandardMaterial map={ctex("pulpa" + pulpa, 256, 256, (g) => { g.fillStyle = pulpa; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill(); g.fillStyle = "rgba(255,240,200,.55)"; for (let k = 0; k < 4; k++) { const a = k * P / 2 + 0.4; g.beginPath(); g.ellipse(128 + Math.cos(a) * 60, 128 + Math.sin(a) * 60, 34, 22, a, 0, 7); g.fill(); } g.fillStyle = "#f0e2a8"; for (let k = 0; k < 26; k++) { const a = k * 0.9, r = 50 + (k % 3) * 10; g.beginPath(); g.ellipse(128 + Math.cos(a) * r, 128 + Math.sin(a) * r, 5, 3, a, 0, 7); g.fill(); } })} side={THREE.DoubleSide} /></mesh>
  </group>)}</group>;
const H5Jitomate: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const abre = phys(tt, 0.3, 5, 0.5), gotea = eio(tt, 1.0, 1.6);
  return <Estudio t={tt} cam={[0, 1.5, 2.8]} look={[0, 0.25, 0]} orbit={0.14}>
    <RBox p={[0, 0.02, 0]} s={[2.6, 0.04, 1.0]} r={0.02}>{M.madera("#8a6040")}</RBox>
    <Mitad p={[-0.75, 0.02, 0]} c="#c4261a" pulpa="#b8281c" abre={cl(abre)} />
    <Mitad p={[0.75, 0.02, 0]} c="#e68a6a" pulpa="#f0b49a" abre={cl(abre)} />
    {Array.from({ length: 10 }, (_, i) => { const k = ((tt * 0.9 + i / 10) % 1); return gotea > 0 ? <Gota key={i} p={[0.75 + (rn(i, 2) - 0.5) * 0.5, 0.26 - k * 0.24, 0.1 + (rn(i, 3) - 0.5) * 0.2]} s={gotea * 2.4} /> : null; })}
    <mesh position={[0.75, 0.045, 0.05]} rotation={[-P2, 0, 0]} scale={[0.4 * gotea + 0.001, 0.22 * gotea + 0.001, 1]}><circleGeometry args={[1, 32]} /><meshPhysicalMaterial color="#f4d8cc" transparent opacity={0.5} roughness={0.05} clearcoat={1} /></mesh>
    <Etq p={[-0.75, 0.75, -0.1]} rot={[0, 0, 0]} txt={["mi patio"]} w={0.5} h={0.2} />
    <Etq p={[0.75, 0.75, -0.1]} rot={[0, 0, 0]} txt={["súper"]} w={0.44} h={0.2} bg="#d9d4c8" />
  </Estudio>;
}}</Stage>;

// ── 6 · LA CUBETA POR DENTRO (4:42): corte de la cubeta; caen las capas: 5 hoyos, piedritas, tierra con abono, una mata y el carrizo
const corteGeo = new THREE.LatheGeometry([[0.34, 0], [0.4, 1.0], [0.43, 1.0]].map(([r, y]) => new THREE.Vector2(r, y)), 44, P * 0.1, P * 1.3);
const H6Capas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const pied = cl((tt - 0.15) * 2.5), tie = eio(tt, 0.8, 1.8), mata = phys(tt, 2.0, 6, 0.5), cana = eio(tt, 2.8, 3.3);
  return <Estudio t={tt} cam={[0.2, 1.5, 3.6]} look={[0, 0.8, 0]} orbit={0.14}>
    <group scale={1.15}>
      <mesh geometry={corteGeo} castShadow receiveShadow><meshStandardMaterial color="#f2efe8" roughness={0.45} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.34, 40]} /><meshStandardMaterial color="#e6e2d8" side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 5 }, (_, i) => { const a = i * 1.25; return <mesh key={i} position={[Math.cos(a) * 0.2, 0.006, Math.sin(a) * 0.2]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.03, 16]} /><meshBasicMaterial color="#1a1410" /></mesh>; })}
      {Array.from({ length: 5 }, (_, i) => { const k = ((tt * 0.8 + i / 5) % 1); const a = i * 1.25; return tie > 0.5 ? <Gota key={"g" + i} p={[Math.cos(a) * 0.2, 0.1 - k * 0.12, Math.sin(a) * 0.2]} s={2} /> : null; })}
      {Array.from({ length: 34 }, (_, i) => { const a = rn(i, 1) * 6.28, r = rn(i, 2) * 0.3; const y = 0.03 + (i % 3) * 0.04 + fall(tt, 0.15 + i * 0.02, 0.9);
        return pied * 34 > i ? <mesh key={"p" + i} position={[Math.cos(a) * r, y, Math.sin(a) * r]} scale={0.03 + rn(i, 3) * 0.02} rotation={[i, i * 2, 0]} geometry={esfGeo} castShadow><meshStandardMaterial color={i % 4 ? "#9a8a78" : "#a4502e"} roughness={0.9} /></mesh> : null; })}
      <mesh position={[0, 0.14 + 0.36 * tie, 0]} scale={[1, Math.max(0.001, tie), 1]}><cylinderGeometry args={[0.39, 0.355, 0.72, 40, 1, false, P * 0.1, P * 1.3]} /><meshStandardMaterial color="#3a2618" roughness={1} side={THREE.DoubleSide} /></mesh>
      <group position={[0, 0.86, 0]} scale={Math.max(0.001, mata)}><Mata g={1} h={0.55} n={8} /></group>
      <mesh position={[0.1, 0.86 + 0.5 * cana - 0.5 + 0.5, 0.05]} scale={[1, Math.max(0.001, cana), 1]} castShadow><cylinderGeometry args={[0.012, 0.014, 1.0, 8]} /><meshStandardMaterial color="#c9b27a" roughness={0.7} /></mesh>
    </group>
        <Suelo c="#7a5a3a" />
  </Estudio>;
}}</Stage>;

// ── 7 · LA MATA DE SIETE AÑOS (5:32): la mata de chile en la olla de barro rota; pasan 7 años (hojas de calendario) y sigue dando
const ollaRota = new THREE.LatheGeometry([[0, 0], [0.32, 0], [0.42, 0.18], [0.44, 0.4], [0.38, 0.58], [0.4, 0.62]].map(([x, y]) => new THREE.Vector2(x, y)), 40, 0.9, P * 2 - 0.55);
const SEG = (a: V3, b: V3) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = d.length();
  return { pos: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2] as V3, q: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()), L }; };
const H7Chile: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const fy = (tt - 0.15) / 0.55, anio = Math.min(7, Math.max(1, Math.floor(fy) + 1)), gr = cl(fy / 7);
  return <Estudio t={tt} cam={[0.15, 1.15, 2.7]} look={[0, 0.78, 0]} orbit={0.12}>
    <mesh geometry={ollaRota} castShadow receiveShadow>{M.barro("#a4562e")}</mesh>
    <mesh geometry={ollaRota} scale={[0.96, 1, 0.96]}><meshStandardMaterial color="#5a2a14" roughness={1} side={THREE.BackSide} /></mesh>
    {[[0.12, 0.3, 0.05], [0.2, 0.38, -0.3], [0.27, 0.46, 0.25]].map(([y, a, r], i) => <mesh key={i} position={[Math.sin(0.4 + a) * 0.44, y + 0.12, Math.cos(0.4 + a) * 0.44]} rotation={[0, 0.4 + a, r]}><boxGeometry args={[0.006, 0.14, 0.01]} /><meshBasicMaterial color="#2a120a" /></mesh>)}
    <group position={[0.55, 0.03, 0.45]} rotation={[0.3, 0.7, 1.2]}><mesh><boxGeometry args={[0.2, 0.17, 0.035]} />{M.barro("#a4562e")}</mesh></group>
    <mesh position={[0, 0.55, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.39, 32]} /><meshStandardMaterial color="#3a2618" roughness={1} /></mesh>
    <group position={[0, 0.55, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.012 + 0.02 * gr, 0.02 + 0.03 * gr, 0.6, 10]} /><meshStandardMaterial color={gr > 0.5 ? "#6a5a3a" : "#5c7a32"} roughness={0.9} /></mesh>
      {Array.from({ length: 5 }, (_, i) => { const a = i * 1.26, y = 0.25 + i * 0.07, L = 0.22 + 0.06 * gr; const sg = SEG([0, y, 0], [Math.cos(a) * L, y + 0.12, Math.sin(a) * L]);
        return <mesh key={i} position={sg.pos} quaternion={sg.q}><cylinderGeometry args={[0.006 + 0.008 * gr, 0.01 + 0.01 * gr, sg.L, 6]} /><meshStandardMaterial color="#5c7a32" /></mesh>; })}
      <Mata g={1} h={0.62} n={14} c="#3f7a2a" hs={0.85} />
      {Array.from({ length: 14 }, (_, i) => { const k = phys(tt, 0.3 + i * 0.27, 7, 0.4), a = i * 2.1, y = 0.22 + (i % 5) * 0.08, R = 0.17 + (i % 3) * 0.05;
        return <group key={i} position={[Math.cos(a) * R, y, Math.sin(a) * R]} rotation={[0.15, a, P + 0.25]} scale={Math.max(0.001, k)}>
          <mesh position={[0, 0.06, 0]} scale={[0.026, 0.085, 0.026]} geometry={esfGeo} castShadow><meshPhysicalMaterial color={i % 4 === 3 ? "#2f8a2a" : "#c41e12"} clearcoat={1} roughness={0.15} /></mesh>
          <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.012, 0.008, 0.03, 8]} /><meshStandardMaterial color="#3f6a2a" /></mesh></group>; })}</group>
    <group position={[-0.05, 1.18, -0.75]} scale={1.25}>
      <RBox s={[0.62, 0.56, 0.03]} r={0.01}><meshStandardMaterial color="#8a2a20" roughness={0.8} /></RBox>
      {[-0.18, 0.18].map((x) => <mesh key={x} position={[x, 0.27, 0.03]} rotation={[0, 0, P2]}><torusGeometry args={[0.025, 0.006, 6, 14]} />{M.hierro()}</mesh>)}
      {Array.from({ length: 7 }, (_, i) => { const k = cl(fy - i), on = fy < i + 1; const caeY = k > 0.3 ? -Math.pow(k - 0.3, 2) * 4 : 0;
        return (i === 6 || on || k < 1) ? <group key={i} position={[0, 0.25 + caeY, 0.02 + (7 - i) * 0.002]} rotation={[-k * 1.2, 0, k * 0.5 * (i % 2 ? 1 : -1)]}>
          <mesh position={[0, -0.24, 0]}><planeGeometry args={[0.56, 0.46]} /><meshStandardMaterial map={papel("anio3" + i, [`año ${i + 1}`], { w: 512, h: 420, bg: "#f6f1e4", size: 120, font: "700 120px Arial, sans-serif" })} side={THREE.DoubleSide} /></mesh></group> : null; })}
    </group>
    <Suelo />
  </Estudio>;
}}</Stage>;

// ── 8 · CILANTRO ESCALONADO (6:38): la cubeta vista de arriba, partida en tres; cada tercio crece en relevo y siempre hay uno para cortar
const tercio = (i: number) => new THREE.CircleGeometry(0.4, 24, i * P * 2 / 3 + 0.04, P * 2 / 3 - 0.08);
const TERC = [tercio(0), tercio(1), tercio(2)];
const H8Cilantro: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  return <Estudio t={tt} cam={[0, 2.6, 1.9]} look={[0, 0.7, 0]} orbit={0.15}>
    <Cubeta s={1.0} tierra={0.92}>
      {[0, 1, 2].map((s) => { const fase = ((tt * 0.45 + s / 3 + 0.1) % 1); const alto = 0.05 + 0.4 * fase;
        return <group key={s}>
          <mesh geometry={TERC[s]} rotation={[-P2, 0, 0]} position={[0, 0.002, 0]}><meshStandardMaterial color={["#3a2618", "#40291a", "#36230f"][s]} roughness={1} /></mesh>
          {Array.from({ length: 14 }, (_, i) => { const a = s * P * 2 / 3 + 0.2 + rn(i, s + 1) * (P * 2 / 3 - 0.4), r = 0.08 + rn(i, s + 7) * 0.26;
            return <group key={i} position={[Math.cos(a) * r, 0, -Math.sin(a) * r]}>
              <mesh position={[0, alto / 2, 0]} scale={[1, alto, 1]}><cylinderGeometry args={[0.005, 0.006, 1, 5]} /><meshStandardMaterial color="#5a8a32" /></mesh>
              <mesh position={[0, alto, 0]} scale={[0.035 * (0.4 + fase), 0.01, 0.035 * (0.4 + fase)]} geometry={hojaGeo}><meshStandardMaterial color="#4a9a3a" /></mesh></group>; })}
          <mesh position={[Math.cos(s * P * 2 / 3) * 0.19, 0.04, -Math.sin(s * P * 2 / 3) * 0.19]} rotation={[0, s * P * 2 / 3, 0]} castShadow><boxGeometry args={[0.4, 0.08, 0.02]} />{M.madera("#8a6236")}</mesh>
        </group>; })}
    </Cubeta>
    <Suelo />
  </Estudio>;
}}</Stage>;

// ── 9 · LA RAMITA EN EL VASO (8:01): una ramita de hierbabuena en un vaso con agua; le salen las raíces blancas, día por día
const H9Ramita: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const raiz = eio(tt, 0.2, 4.0);
  return <Estudio t={tt} cam={[0, 1.2, 2.4]} look={[0, 0.45, 0]} orbit={0.12} fov={30}>
    <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.2, 0.17, 0.6, 32, 1, true]} />{M.vidrio()}</mesh>
    <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.19, 0.165, 0.42, 32]} /><meshPhysicalMaterial color="#cfe6ea" transparent opacity={0.3} roughness={0.05} depthWrite={false} /></mesh>
    <group position={[0, 0.15, 0]}>
      <mesh position={[0, 0.4, 0]} castShadow><cylinderGeometry args={[0.012, 0.014, 0.8, 8]} /><meshStandardMaterial color="#4a6a2a" /></mesh>
      {Array.from({ length: 8 }, (_, i) => <group key={i} position={[0, 0.55 + i * 0.05, 0]} rotation={[0, i * 1.6, 0.8]}><mesh position={[0.06, 0, 0]} scale={[0.07, 0.008, 0.04]} geometry={hojaGeo} castShadow><meshStandardMaterial color="#3f8a3a" /></mesh></group>)}
      {Array.from({ length: 9 }, (_, i) => { const a = i * 0.7, L = 0.04 + raiz * (0.12 + rn(i, 2) * 0.1);
        return <mesh key={"r" + i} position={[Math.cos(a) * L * 0.4, 0.05 - L / 2, Math.sin(a) * L * 0.4]} rotation={[Math.sin(a) * 0.5, 0, Math.cos(a) * 0.5]}><cylinderGeometry args={[0.006, 0.009, L, 5]} /><meshStandardMaterial color="#f4f0e2" roughness={0.6} /></mesh>; })}
    </group>
    <pointLight position={[0, 0.2, -0.6]} intensity={3} distance={2} color="#fff4d8" />
    {Array.from({ length: 7 }, (_, i) => <mesh key={"m" + i} position={[0.205, 0.12 + i * 0.05, 0.02]} rotation={[0, P2 * 0.9, 0]} scale={Math.max(0.001, phys(tt, 0.3 + i * 0.5, 7, 0.5))}><planeGeometry args={[0.05, 0.008]} /><meshBasicMaterial color="#3a2a1a" /></mesh>)}
  </Estudio>;
}}</Stage>;

// ── 10 · LA CAL (8:49): dos cubetas al sol; la oscura se pone al rojo y su mata se cae; la otra se pinta de cal y la mata sigue de pie
const H10Cal: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const calor = eio(tt, 0.2, 2.4), pinta = eio(tt, 0.4, 1.8);
  return <Estudio t={tt} cam={[0, 1.7, 3.4]} look={[0, 0.55, 0]} orbit={0.14}>
    <mesh position={[-0.9, 1.9, -1.2]}><sphereGeometry args={[0.3, 24, 16]} /><meshBasicMaterial color="#ffe08a" toneMapped={false} /></mesh>
    <pointLight position={[-1.6, 2.4, -1.0]} intensity={6} distance={7} color="#ffd070" />
    <group position={[-0.65, 0, 0]}><Cubeta s={0.7} c="#2a2a2c" emis="#ff4a1a" ei={0.55 * calor}><Mata g={1} h={0.7} caida={1.6 * calor} /></Cubeta>
      <Vapor t={tt} p={[0, 0.5, 0.25]} o={0.25 * calor} h={0.6} s={0.18} /></group>
    <group position={[0.65, 0, 0]}><Cubeta s={0.7} c="#2a2a2c"><Mata g={1} h={0.7} /></Cubeta>
      <mesh position={[0, 0.36 * pinta, 0]} scale={[1.02, Math.max(0.001, pinta), 1.02]}><cylinderGeometry args={[0.285, 0.24, 0.72, 44, 1, true]} /><meshStandardMaterial color="#f6f4ee" roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <group position={[0.24, 0.72 * pinta, 0.3]} rotation={[0, 0, -0.4]}><mesh castShadow><boxGeometry args={[0.16, 0.06, 0.04]} />{M.madera()}</mesh>
        <mesh position={[0, -0.05, 0]}><boxGeometry args={[0.15, 0.04, 0.035]} /><meshStandardMaterial color="#f2efe8" /></mesh>
        <mesh position={[0.15, 0.1, 0]} rotation={[0, 0, -0.6]} castShadow><cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />{M.madera()}</mesh></group>
    </group>
    <Suelo c="#8a6a48" />
  </Estudio>;
}}</Stage>;

// ── 11 · SEMBRAR DE TODO (9:24): ocho sobrecitos en abanico; zanahoria, brócoli y betabel se caen y se llevan sus monedas
const TODO: [string, string, boolean][] = [["jitomate", "#c8321e", true], ["zanahoria", "#e07a2a", false], ["chile", "#3f8a3a", true], ["brócoli", "#2f6a3a", false], ["cilantro", "#6aa04a", true], ["betabel", "#7a1a3a", false], ["calabaza", "#d8b23a", true], ["frijol", "#6b2a1c", true]];
const H11DeTodo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const cae = cl((tt - 1.2) / 1.0);
  return <Estudio t={tt} cam={[0, 1.6, 3.4]} look={[0, 0.6, 0]} orbit={0.14}>
    {TODO.map(([n, c, ok], i) => { const k = phys(tt, i * 0.08, 6, 0.5), a = (i - 3.5) * 0.17;
      const y = ok ? 0.75 : fall(tt, 1.2 + i * 0.08, 0.75) - (cae > 0.99 ? 0 : 0);
      return <group key={n} position={[Math.sin(a) * 1.6 * k, y, -0.2 + Math.cos(a) * 0.1]} rotation={[ok ? 0 : cae * 1.2, 0, -a * k + (ok ? 0 : cae * 0.8)]} scale={1.3}>
        <Sobrecito txt={n} c={c} />
        {!ok && [0, 1, 2].map((j) => <Moneda key={j} p={[0.05 * (j - 1), -0.3 - cae * (0.3 + j * 0.1), 0.05]} rot={[P2, 0, j]} s={0.8 * (1 - cae * 0.5)} />)}
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 12 · CORTARLA CHIQUITA (10:00): a la izquierda la calabacita que engorda y la mata deja de dar; a la derecha se cortan chiquitas y salen más
const Calab: React.FC<{ p: V3; rot?: V3; L: number }> = ({ p, rot, L }) => <mesh position={p} rotation={rot} scale={[0.045 + L * 0.05, L * 0.22 + 0.04, 0.045 + L * 0.05]} castShadow><capsuleGeometry args={[1, 1, 8, 14]} /><meshPhysicalMaterial color="#4a7a2a" roughness={0.35} clearcoat={0.6} /></mesh>;
const H12Calabacita: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const gorda = eio(tt, 0.15, 3.0), nCort = Math.min(7, Math.floor(Math.max(0, tt - 0.3) * 1.6));
  return <Estudio t={tt} cam={[0, 1.7, 3.6]} look={[0, 0.45, 0]} orbit={0.14}>
    <group position={[-1.05, 0, 0]}><Cubeta s={0.55}><Mata g={1} h={0.4} n={7} hs={2.2} caida={gorda * 0.4} /></Cubeta>
      <Calab p={[0.45 + gorda * 0.15, 0.06 + gorda * 0.06, 0.35]} rot={[0, 0.4, P2]} L={0.3 + gorda * 1.2} /></group>
    <group position={[0.75, 0, 0]}><Cubeta s={0.55}><Mata g={1} h={0.4} n={7} hs={2.2} /></Cubeta>
      {(() => { const ph = ((tt - 0.8) * 1.6) % 1; return <Calab p={[0.2, 0.62, 0.15]} rot={[0.3, 0, 1.2]} L={tt < 0.8 ? 0.2 : 0.15 + 0.2 * ph} />; })()}
      <Plato p={[0.65, 0, 0.3]} s={0.55}>{Array.from({ length: nCort }, (_, i) => <Calab key={i} p={[(i % 3 - 1) * 0.12, 0.05 + Math.floor(i / 3) * 0.06, (rn(i, 2) - 0.5) * 0.1]} rot={[P2, 0, 0.3 * i]} L={0.35} />)}</Plato>
    </group>
    <Suelo />
  </Estudio>;
}}</Stage>;

// ── 13 · LA LECHUGA BAJO EL MOSQUITERO (10:45): bajo el limonero; el pájaro baja en picada y rebota en la tela
const H13Lechuga: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const ciclo = (tt - 0.2) % 2.6, k = cl(ciclo / 0.8), reb = ciclo > 0.8 ? cl((ciclo - 0.8) / 1.0) : 0;
  const bx = lerp(-1.8, 0, k) + reb * 1.6, by = lerp(2.0, 0.95, k) + Math.sin(reb * P) * 0.7 + reb * 0.6, hunde = ciclo > 0.7 && ciclo < 1.1 ? Math.sin((ciclo - 0.7) / 0.4 * P) * 0.06 : 0;
  return <Estudio t={tt} cam={[0, 1.6, 3.2]} look={[0, 0.5, 0]} orbit={0.13}>
    <Cubeta s={0.6}>{Array.from({ length: 12 }, (_, i) => <group key={i} rotation={[0, i * 0.52, 0.3 + (i % 3) * 0.25]}><mesh position={[0.08, 0.06, 0]} scale={[0.14, 0.03, 0.1]} geometry={hojaGeo} castShadow><meshStandardMaterial color={i % 2 ? "#8ac24a" : "#a8d46a"} roughness={0.6} side={THREE.DoubleSide} /></mesh></group>)}</Cubeta>
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <mesh key={i} position={[x * 0.32, 0.5, z * 0.32]} castShadow><cylinderGeometry args={[0.01, 0.01, 1.0, 6]} />{M.madera("#8a6a40")}</mesh>)}
    <mesh position={[0, 0.98 - hunde, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.72, 0.72, 14, 14]} /><meshStandardMaterial color="#f4f4ee" transparent opacity={0.9} wireframe /></mesh>
    <mesh position={[0, 0.98 - hunde * 0.5, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.72, 0.72]} /><meshStandardMaterial color="#e8eae4" transparent opacity={0.18} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    {tt > 0.2 && <group position={[bx, by, 0.1]} rotation={[0, 0, k < 1 ? -0.5 : 0.6]} scale={2.2}>
      <mesh scale={[0.12, 0.08, 0.08]} geometry={esfGeo} castShadow><meshStandardMaterial color="#6a4a32" /></mesh>
      <mesh position={[0.1, 0.05, 0]} scale={0.05} geometry={esfGeo}><meshStandardMaterial color="#6a4a32" /></mesh>
      <mesh position={[0.16, 0.05, 0]} rotation={[0, 0, -P2]}><coneGeometry args={[0.015, 0.05, 6]} /><meshStandardMaterial color="#e0a030" /></mesh>
      <mesh position={[0, 0.04, 0]} rotation={[0.5 * Math.sin(tt * 30), 0, 0]} scale={[0.09, 0.005, 0.12]} geometry={esfGeo}><meshStandardMaterial color="#5a3a22" /></mesh></group>}
    <mesh position={[0.2, 2.0, -0.8]} scale={[1.6, 0.5, 1]} geometry={esfGeo}><meshStandardMaterial color="#3f6a2a" roughness={0.8} /></mesh>
    {[0, 1, 2, 3].map((i) => <mesh key={i} position={[-0.4 + i * 0.35, 1.62 - (i % 2) * 0.12, -0.4]} scale={[0.08, 0.1, 0.08]} geometry={esfGeo} castShadow><meshPhysicalMaterial color="#e8d84a" clearcoat={0.8} roughness={0.3} /></mesh>)}
    <Suelo />
  </Estudio>;
}}</Stage>;

// ── 14 · EL COSTAL DE PAPAS (11:33): el costal de rafia se voltea en el patio y salen rodando las papas
const costalGeo = lathe([[0, 0], [0.3, 0], [0.38, 0.12], [0.39, 0.5], [0.33, 0.7], [0.24, 0.8]], 28);
const Papa: React.FC<{ p: V3; rot: V3; s: number }> = ({ p, rot, s }) => <group position={p} rotation={rot} scale={s}>
  <mesh scale={[1.25, 0.85, 0.95]} geometry={esfGeo} castShadow><meshStandardMaterial color="#a8784a" roughness={0.85} /></mesh>
  {[[0.6, 0.5, 0.5], [-0.5, 0.6, 0.4], [0.1, -0.2, 0.92], [-0.9, -0.1, 0.3]].map(([x, y, z], i) => <mesh key={i} position={[x, y * 0.85, z * 0.95]} scale={0.09} geometry={esfGeo}><meshStandardMaterial color="#5a3a1e" roughness={1} /></mesh>)}</group>;
const H14Costal: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const vuelta = phys(tt, 0.15, 5, 0.5) * 1.45;
  return <Estudio t={tt} cam={[0.4, 0.95, 2.3]} look={[0.1, 0.28, 0.25]} orbit={0.12}>
    <group position={[-0.55, 0, -0.1]} rotation={[0, 0.3, -vuelta]}>
      <mesh castShadow geometry={costalGeo}><Yute /></mesh>
      <mesh position={[0, 0.4, 0.385]} rotation={[0, 0, 0]}><boxGeometry args={[0.012, 0.7, 0.01]} /><meshStandardMaterial color="#5a4024" roughness={1} /></mesh>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0, 0.1 + i * 0.075, 0.39]} rotation={[0, 0, 0.6]}><boxGeometry args={[0.035, 0.006, 0.006]} /><meshStandardMaterial color="#3a2814" /></mesh>)}
      {Array.from({ length: 12 }, (_, i) => <mesh key={"b" + i} position={[Math.cos(i * 0.52) * 0.23, 0.82 + (i % 3) * 0.025, Math.sin(i * 0.52) * 0.23]} rotation={[0.5 * Math.sin(i * 1.7), i * 0.52, 0.4 + 0.3 * Math.cos(i)]} castShadow><boxGeometry args={[0.11, 0.1, 0.02]} /><Yute /></mesh>)}</group>
    {Array.from({ length: 14 }, (_, i) => { const a = 0.55 + i * 0.07, k = cl((tt - a) / 1.4), e = 1 - Math.pow(1 - k, 2.2), x = lerp(-0.05, -0.4 + rn(i, 1) * 1.2, e), z = lerp(0.05, 0.25 + rn(i, 2) * 0.7, e);
      const y = tt < a ? -9 : 0.07 + Math.abs(Math.sin(k * P * 3)) * 0.12 * (1 - k) + Math.max(0, 0.25 * (1 - k * 6));
      return <Papa key={i} p={[x, y, z]} rot={[e * 9 * (0.5 + rn(i, 3)), i, 0]} s={0.075 + rn(i, 4) * 0.03} />; })}
    {Array.from({ length: 16 }, (_, i) => { const a = 0.6 + i * 0.06, u = cl((tt - a) / 0.9); return <sprite key={"p" + i} position={[-0.1 + rn(i, 5) * 0.9, 0.05 + u * 0.18, 0.15 + rn(i, 6) * 0.6]} scale={[0.12 + 0.2 * u, 0.1 + 0.15 * u, 1]}><spriteMaterial color="#8a6a48" transparent opacity={0.45 * Math.sin(u * P)} depthWrite={false} /></sprite>; })}
    <Suelo c="#8a6a48" />
  </Estudio>;
}}</Stage>;

// ── 15 · DIENTE POR DIENTE (12:21): la cabeza de ajo se abre y cada diente vuela a la cubeta, de punta; en el centro brotan
const dienteGeo = lathe([[0, 0], [0.05, 0.02], [0.06, 0.07], [0.035, 0.13], [0.001, 0.17]], 14);
const H15Ajo: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const abre = phys(tt, 0.1, 5, 0.5);
  return <Estudio t={tt} cam={[0.3, 1.8, 2.9]} look={[0.3, 0.75, 0]} orbit={0.14}>
    <Cubeta s={0.9} tierra={0.9} />
    <group position={[0.9, 1.3, 0]} scale={Math.max(0.001, 1 - eio(tt, 0.9, 2.6))}><mesh scale={[0.2, 0.17, 0.2]} geometry={esfGeo} castShadow><meshPhysicalMaterial color="#f4ece0" roughness={0.5} clearcoat={0.3} /></mesh><mesh position={[0, 0.18, 0]}><coneGeometry args={[0.04, 0.12, 10]} /><meshStandardMaterial color="#d8ccb0" /></mesh></group>
    {Array.from({ length: 15 }, (_, i) => { const a0 = i * 0.42, k = eio(tt, 0.3 + i * 0.12, 0.9 + i * 0.12);
      const ring = i < 9 ? 0.25 : 0.12, a1 = i < 9 ? i * P * 2 / 9 : (i - 9) * P * 2 / 6;
      const pIni: V3 = [0.9 + Math.cos(a0) * 0.06 * cl(abre), 1.3, Math.sin(a0) * 0.06 * cl(abre)], pFin: V3 = [Math.cos(a1) * ring, 0.81, Math.sin(a1) * ring];
      const brote = eio(tt, 2.6 + i * 0.12, 3.8 + i * 0.12);
      return <group key={i} position={[lerp(pIni[0], pFin[0], k), lerp(pIni[1], pFin[1], k) + Math.sin(k * P) * 0.5, lerp(pIni[2], pFin[2], k)]} rotation={[0, 0, lerp(0.4 * Math.cos(a0), 0, k) + (1 - k) * k * 8]} scale={1.5}>
        <mesh geometry={dienteGeo} castShadow><meshPhysicalMaterial color="#f2eadc" roughness={0.4} clearcoat={0.4} /></mesh>
        {brote > 0.01 && <mesh position={[0, 0.17 + 0.15 * brote, 0]} scale={[1, Math.max(0.001, brote), 1]}><cylinderGeometry args={[0.006, 0.01, 0.3, 6]} /><meshStandardMaterial color="#6aa04a" /></mesh>}</group>; })}
    <Suelo />
  </Estudio>;
}}</Stage>;

// ── 16 · EL NOPAL (13:10): la penca de canto en la cubeta; le brotan los nopalitos tiernos uno por uno y al lado crece su pila de monedas
const pencaGeo = new THREE.SphereGeometry(1, 28, 18);
const Penca: React.FC<{ p: V3; rot?: V3; s?: number; c?: string; esp?: boolean }> = ({ p, rot, s = 1, c = "#4f8a3a", esp = true }) => <group position={p} rotation={rot} scale={s}>
  <mesh scale={[0.24, 0.32, 0.045]} geometry={pencaGeo} castShadow><meshPhysicalMaterial color={c} roughness={0.45} clearcoat={0.4} /></mesh>
  {esp && Array.from({ length: 16 }, (_, i) => { const a = i * 2.39, r = Math.sqrt((i + 0.5) / 16) * 0.85, x = Math.cos(a) * r * 0.24, y = Math.sin(a) * r * 0.32, z = 0.045 * Math.sqrt(Math.max(0, 1 - r * r)) + 0.002;
    return [1, -1].map((sd) => <group key={i + "" + sd} position={[x, y, z * sd]} rotation={[sd > 0 ? 0 : P, 0, 0]}><mesh scale={0.01} geometry={esfGeo}><meshStandardMaterial color="#d8cfa0" roughness={1} /></mesh>
      {[-0.5, 0, 0.5].map((q) => <mesh key={q} position={[q * 0.012, 0.004, 0.012]} rotation={[P2 - 0.4, 0, q]}><coneGeometry args={[0.0025, 0.035, 4]} /><meshStandardMaterial color="#f4f0dc" /></mesh>)}</group>); })}</group>;
const H16Nopal: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const NP: [V3, number][] = [[[-0.2, 0.62, 0], -0.55], [[0.21, 0.66, 0], 0.5], [[0.0, 0.78, 0], 0.05], [[-0.3, 0.38, 0], -1.05], [[0.3, 0.42, 0], 1.0]];
  const brota = NP.map((_, i) => 0.25 + i * 0.5);
  return <Estudio t={tt} cam={[0.1, 1.1, 2.3]} look={[0.2, 0.55, 0]} orbit={0.12}>
    <group position={[-0.15, 0, 0]}>
      <mesh position={[0, 0.22, 0]} castShadow><cylinderGeometry args={[0.3, 0.28, 0.44, 32, 1, true]} /><meshStandardMaterial color="#a8acb0" metalness={0.75} roughness={0.35} side={THREE.DoubleSide} /></mesh>
      {[0.08, 0.22, 0.36].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.302, 0.01, 8, 40]} /><meshStandardMaterial color="#8a8e92" metalness={0.8} roughness={0.3} /></mesh>)}
      <mesh position={[0, 0.44, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.3, 0.014, 8, 40]} /><meshStandardMaterial color="#b0b4b8" metalness={0.8} roughness={0.25} /></mesh>
      <mesh position={[0, 0.4, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.29, 32]} /><meshStandardMaterial color="#3a2618" roughness={1} /></mesh>
      <Penca p={[0, 0.66, 0]} s={1.45} />
      {NP.map(([p, r], i) => { const k = phys(tt, brota[i], 6, 0.45); return <Penca key={i} p={[p[0] * cl(k), 0.66 + (p[1] - 0.66) * cl(k) * 1.45, 0.01]} rot={[0, 0, r]} s={Math.max(0.001, 0.55 * k)} c="#86c456" esp={false} />; })}</group>
    <group position={[0.62, 0, 0.15]}>
      {Array.from({ length: NP.length * 3 }, (_, j) => { const i = Math.floor(j / 3), a = brota[i] + 0.12 + (j % 3) * 0.08; if (tt < a) return null;
        return <group key={j} position={[0.005 * Math.sin(j * 2), 0.018 + j * 0.034 + fall(tt, a, 0.9), 0]} rotation={[0, j * 0.7, 0]}><mesh castShadow><cylinderGeometry args={[0.09, 0.09, 0.03, 32]} /><meshStandardMaterial color="#d8a838" metalness={0.85} roughness={0.25} /></mesh>
          <mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.09, 0.006, 6, 32]} /><meshStandardMaterial color="#b88a28" metalness={0.85} roughness={0.3} /></mesh></group>; })}</group>
    <Suelo />
  </Estudio>;
}}</Stage>;

// ── 17 · LAS TRES HERMANAS (13:33): sube el maíz, el frijol se trepa en espiral por la caña y la calabaza tapa el suelo
const espiral = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 40 }, (_, i) => new THREE.Vector3(Math.cos(i * 0.6) * 0.06, i * 0.035, Math.sin(i * 0.6) * 0.06))), 120, 0.016, 6);
const H17Milpa: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const maiz = eio(tt, 0.05, 1.4), frij = eio(tt, 0.8, 2.6), cal = eio(tt, 1.6, 3.0);
  return <Estudio t={tt} cam={[0, 1.4, 3.0]} look={[0, 0.7, 0]} orbit={0.18}>
    {[-0.6, 0, 0.6].map((x, j) => <group key={j} position={[x, 0, j === 1 ? -0.2 : 0]}>
      <group scale={[1, Math.max(0.001, maiz), 1]}>
        <mesh position={[0, 0.7, 0]} castShadow><cylinderGeometry args={[0.025, 0.035, 1.4, 8]} /><meshStandardMaterial color="#7a9a3a" roughness={0.7} /></mesh>
        {Array.from({ length: 7 }, (_, i) => <group key={i} position={[0, 0.25 + i * 0.17, 0]} rotation={[0, i * 2.5 + j, 0.9]}><mesh position={[0.2, 0, 0]} scale={[0.25, 0.008, 0.035]} geometry={hojaGeo} castShadow><meshStandardMaterial color="#6a9a3a" side={THREE.DoubleSide} /></mesh></group>)}
        <mesh position={[0.06, 0.9, 0]} rotation={[0, 0, -0.3]} scale={[0.04, 0.12, 0.04]} geometry={esfGeo}><meshStandardMaterial color="#d8c46a" /></mesh>
      </group>
      <mesh geometry={espiral} scale={[1, Math.max(0.001, frij), 1]} castShadow><meshStandardMaterial color="#2a6a1a" /></mesh>
    </group>)}
    <mesh position={[0.15, 0.13 * cal + 0.001, 0.55]} scale={[0.2 * cal + 0.001, 0.14 * cal + 0.001, 0.18 * cal + 0.001]} geometry={esfGeo} castShadow><meshPhysicalMaterial color="#e07a1a" clearcoat={0.6} roughness={0.35} /></mesh>
    {Array.from({ length: 9 }, (_, i) => { const a = i * 0.7, r = 0.35 + (i % 3) * 0.2; return <mesh key={i} position={[Math.cos(a) * r * cal, 0.03, Math.sin(a) * r * cal * 0.6 + 0.2]} rotation={[-P2, 0, a]} scale={[0.2 * cal + 0.001, 0.2 * cal + 0.001, 1]} castShadow><circleGeometry args={[1, 6]} /><meshStandardMaterial color="#4a7a2a" side={THREE.DoubleSide} /></mesh>; })}
    <Suelo />
  </Estudio>;
}}</Stage>;

// ── 18 · QUINCE MINUTOS (14:50): un reloj de pared; la aguja barre un cuarto de hora y alrededor aparecen las seis tareas del patio
const relojTex = () => ctex("reloj29b", 512, 512, (g) => { g.fillStyle = "#f6f1e4"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill(); g.fillStyle = "#2a1c12"; for (let i = 0; i < 12; i++) { const a = i * P / 6; g.fillRect(256 + Math.cos(a) * 210 - 6, 256 + Math.sin(a) * 210 - 6, 12, 12); } });
const H18Rutina: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const barr = eio(tt, 0.1, 5.0), ang = barr * P2;
  const OBJ = (i: number) => { const k = phys(tt, 0.2 + i * 0.8, 6, 0.5), a = -P2 + i * P / 3 + 0.3; const p: V3 = [Math.cos(a) * 1.0, 0.9 - Math.sin(a) * 0.68, 0.2];
    return <group key={i} position={p} scale={Math.max(0.001, 1.9 * k)}>{[
      <group><mesh castShadow><cylinderGeometry args={[0.09, 0.075, 0.16, 24]} />{M.barro("#9a4f2c")}</mesh><Vapor t={tt} p={[0, 0.08, 0]} o={0.25} h={0.3} s={0.1} /></group>,
      <mesh scale={[0.07, 0.09, 0.07]} geometry={esfGeo} castShadow><meshStandardMaterial color="#c89a6a" /></mesh>,
      <Mano p={[0, 0, 0]} rot={[0.4, 0, 0]} s={0.35} />,
      <group rotation={[0, 0, 0.4]}><mesh scale={[0.14, 0.012, 0.07]} geometry={hojaGeo} castShadow><meshStandardMaterial color="#4f8a3a" /></mesh>{[0, 1, 2].map((j) => <mesh key={j} position={[(j - 1) * 0.05, -0.012, 0.01]} scale={0.012} geometry={esfGeo}><meshStandardMaterial color="#9ac23a" /></mesh>)}</group>,
      <Jito p={[0, 0, 0]} s={0.08} />,
      <group>{[0, 1, 2].map((j) => <mesh key={j} position={[(j - 1) * 0.05, 0, j * 0.02]} rotation={[j, j * 2, 0]} scale={[0.06, 0.01, 0.03]} geometry={hojaGeo}><meshStandardMaterial color={["#e0a040", "#c8b090", "#7a5a3a"][j]} /></mesh>)}</group>,
    ][i]}</group>; };
  return <Estudio t={tt} cam={[0, 1.0, 3.6]} look={[0, 0.9, 0]} orbit={0.1}>
    <group position={[0, 0.9, 0]} rotation={[0, 0, (1 - phys(tt, 0, 4, 0.5)) * 1.2]}>
      <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.62, 0.62, 0.06, 48]} />{M.madera("#6a4428")}</mesh>
      <mesh position={[0, 0, 0.032]}><circleGeometry args={[0.56, 48]} /><meshStandardMaterial map={relojTex()} /></mesh>
      <mesh position={[0, 0, 0.034]}><circleGeometry args={[0.5, 48, P2 - ang, ang + 0.001]} /><meshBasicMaterial color="#6aa04a" transparent opacity={0.45} /></mesh>
      <mesh position={[0, 0, 0.04]} rotation={[0, 0, -ang]}><planeGeometry args={[0.025, 0.9]} /><meshBasicMaterial color="#2a1c12" /></mesh>
      <mesh position={[0, 0, 0.045]} rotation={[0, 0, -barr * 0.04]}><planeGeometry args={[0.035, 0.5]} /><meshBasicMaterial color="#2a1c12" /></mesh>
    </group>
    {[0, 1, 2, 3, 4, 5].map(OBJ)}
  </Estudio>;
}}</Stage>;

// ── 19 · EL PULGÓN (15:21): la hoja de jitomate llena de pulgón; la botella rocía agua con jabón y los bichos se caen
const folGeo = (() => { const sh = new THREE.Shape(); const N = 28; for (let i = 0; i <= N; i++) { const a = i / N * P * 2, r = i % 2 ? 0.86 : 1; const x = Math.cos(a) * r * 0.5, y = Math.sin(a) * r * 0.24; i ? sh.lineTo(x, y) : sh.moveTo(x, y); } return new THREE.ShapeGeometry(sh); })();
const H19Jabon: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const incl = eio(tt, 0.05, 0.4), barre = eio(tt, 0.45, 2.4), roc = tt > 0.4 && tt < 2.6, bx = lerp(0.45, -0.75, barre);
  const FOL: [number, number, number][] = [[-0.62, 0, 0], [-0.45, 0.16, 0.6], [-0.45, -0.16, -0.6], [-0.22, 0.19, 0.5], [-0.22, -0.19, -0.5], [0.02, 0.17, 0.45], [0.02, -0.17, -0.45]];
  return <Estudio t={tt} cam={[0.1, 1.25, 2.1]} look={[-0.1, 0.55, 0.1]} orbit={0.1} fov={34}>
    <group position={[0.1, 0.72, 0.1]} rotation={[-P2 + 0.35, 0, 0]}>
      <mesh rotation={[0, 0, P2]} position={[-0.25, 0, 0]}><cylinderGeometry args={[0.012, 0.016, 1.0, 8]} /><meshStandardMaterial color="#5a8a2a" /></mesh>
      {FOL.map(([x, y, r], i) => <group key={i} position={[x, y, 0.004]} rotation={[0, 0, r]} scale={0.62}>
        <mesh geometry={folGeo} castShadow receiveShadow><meshStandardMaterial color="#3f7a2a" roughness={0.55} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0, 0.003]}><boxGeometry args={[0.85, 0.012, 0.002]} /><meshStandardMaterial color="#8ab85a" /></mesh>
        {[-0.2, 0, 0.2].map((vx) => [-1, 1].map((sg) => <mesh key={vx + "" + sg} position={[vx + 0.04, sg * 0.06, 0.003]} rotation={[0, 0, sg * 0.7]}><boxGeometry args={[0.15, 0.006, 0.002]} /><meshStandardMaterial color="#7aa84a" /></mesh>))}</group>)}
      {Array.from({ length: 24 }, (_, i) => { const f = FOL[i % 7], x = f[0] + (rn(i, 1) - 0.5) * 0.3, y = f[1] + (rn(i, 2) - 0.5) * 0.1;
        return (x + 0.1 > bx) ? null : <group key={i} position={[x, y, 0.025]} rotation={[0, 0, rn(i, 3) * 6]}><mesh scale={[0.034, 0.022, 0.02]} geometry={esfGeo}><meshPhysicalMaterial color="#7fd43a" roughness={0.3} clearcoat={0.6} /></mesh>
          <mesh position={[0.03, 0, 0.004]} scale={0.009} geometry={esfGeo}><meshStandardMaterial color="#4a8a1a" /></mesh></group>; })}
      {Array.from({ length: 30 }, (_, i) => { const x = -0.75 + rn(i, 8) * 1.0; return x > bx ? <mesh key={"e" + i} position={[x, (rn(i, 9) - 0.5) * 0.4, 0.02]} scale={0.012 + 0.02 * rn(i, 10)} geometry={esfGeo}><meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.3} transparent opacity={0.85} /></mesh> : null; })}
    </group>
    {Array.from({ length: 24 }, (_, i) => { const f = FOL[i % 7], x0 = 0.1 + f[0] + (rn(i, 1) - 0.5) * 0.3; const t0 = lerp(0.45, 2.4, cl((0.45 - (x0 - 0.1)) / 1.2)); if (x0 - 0.1 + 0.1 <= bx || tt < t0) return null;
      const k = cl((tt - t0) / 0.6); return <mesh key={"c" + i} position={[x0 - 0.1 * k + (rn(i, 4) - 0.5) * 0.2 * k, 0.03 + fall(tt, t0, 0.68), 0.1 + f[1] * 0.9 + 0.25 * k]} rotation={[k * 6, 0, k * 3]} scale={[0.034, 0.022, 0.02]} geometry={esfGeo} castShadow><meshPhysicalMaterial color="#7fd43a" roughness={0.3} /></mesh>; })}
    <group position={[0.85, 0, 0.15]} rotation={[0, 0, 0.55 * incl]}>
      <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.1, 0.11, 0.4, 24]} /><meshPhysicalMaterial color="#f4f6f8" roughness={0.25} clearcoat={0.5} /></mesh>
      <mesh position={[0, 0.16, 0.001]}><cylinderGeometry args={[0.102, 0.112, 0.18, 24]} /><meshStandardMaterial color="#5ab0d8" roughness={0.4} /></mesh>
      <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.04, 0.06, 0.06, 16]} /><meshStandardMaterial color="#2a6aa8" /></mesh>
      <RBox p={[-0.04, 0.5, 0]} s={[0.16, 0.08, 0.06]} r={0.015}><meshStandardMaterial color="#2a6aa8" roughness={0.4} /></RBox>
      <mesh position={[-0.13, 0.5, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.012, 0.018, 0.04, 10]} /><meshStandardMaterial color="#1a3a68" /></mesh>
      <RBox p={[-0.06, 0.41, 0]} s={[0.025, 0.1, 0.035]} r={0.01} rot={[0, 0, 0.3 - 0.25 * (roc ? (Math.sin(tt * 12) > 0 ? 1 : 0) : 0)]}><meshStandardMaterial color="#2a6aa8" /></RBox></group>
    {roc && Array.from({ length: 36 }, (_, i) => { const k = ((tt * 2.2 + i / 36) % 1), a = (rn(i, 4) - 0.5) * 0.7; const ox = 0.62, oy = 0.6;
      return <Gota key={i} p={[ox + (bx + 0.1 - ox) * k, oy + (0.72 - oy) * k + Math.sin(a) * 0.25 * k, 0.15 + Math.cos(a) * 0.0 + (rn(i, 5) - 0.5) * 0.45 * k]} s={0.8 + rn(i, 6)} />; })}
  </Estudio>;
}}</Stage>;

// ── 20 · VERDE Y SECO (15:40): la cubeta de composta transparente; caen capas verdes y secas y lo de abajo se vuelve tierra negra
const H20Composta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const n = Math.min(8, Math.floor(Math.max(0, tt - 0.1) * 2.2) + 1), negro = eio(tt, 2.5, 5.0);
  return <Estudio t={tt} cam={[0, 1.4, 2.8]} look={[0, 0.55, 0]} orbit={0.16}>
    <mesh position={[0, 0.55, 0]}><cylinderGeometry args={[0.45, 0.4, 1.1, 40, 1, true]} />{M.vidrio()}</mesh>
        {Array.from({ length: n + 1 }, (_, i) => { if (i >= n) return null; const verde = i % 2 === 0, y = 0.05 + i * 0.1, k = cl((tt - 0.1) * 2.2 - i + 1);
      const c = new THREE.Color(verde ? "#6a9a3a" : "#b8925a").lerp(new THREE.Color("#2a1c12"), negro * cl(1.6 - i * 0.35));
      return <mesh key={i} position={[0, y + (1 - k) * 0.6, 0]}><cylinderGeometry args={[0.4 + i * 0.006, 0.4 + i * 0.006, 0.095, 36]} /><meshStandardMaterial color={c} roughness={1} /></mesh>; })}
    <Vapor t={tt} p={[0, 0.9, 0]} o={0.15 * negro} h={0.5} s={0.18} />
        <Suelo />
  </Estudio>;
}}</Stage>;

// ── 21 · LAS BOLSAS DE BASURA (17:20): antes, dos bolsas por semana (8 al mes); ahora, una cada dos semanas (2). Cada una se lleva $10
const bolsaGeo = (() => { const g = new THREE.SphereGeometry(1, 36, 26), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = Math.atan2(z, x);
  const top = y > 0.55 ? (y - 0.55) * 1.9 : 0, f = 1 + 0.07 * Math.sin(a * 7 + y * 9) + 0.04 * Math.sin(a * 13 - y * 5) - top * 0.55; p.setXYZ(i, x * f, y * (y < -0.7 ? 0.85 : 1), z * f); } g.computeVertexNormals(); return g; })();
const negro = <meshPhysicalMaterial color="#121212" roughness={0.35} clearcoat={0.9} clearcoatRoughness={0.25} />;
const Bolsa: React.FC<{ p: V3; i: number; sq?: number }> = ({ p, i, sq = 0 }) => <group position={p} rotation={[0, i * 1.3, 0]} scale={[1 + sq, 1 - sq, 1 + sq]}>
  <mesh position={[0, 0.2, 0]} scale={[0.2, 0.22, 0.18]} geometry={bolsaGeo} castShadow>{negro}</mesh>
  <mesh position={[0, 0.43, 0]} scale={[0.035, 0.04, 0.035]} geometry={esfGeo}>{negro}</mesh>
  {[-1, 1].map((k) => <mesh key={k} position={[k * 0.035, 0.48, 0]} rotation={[0, 0, k * 0.6]} scale={[0.022, 0.06, 0.012]} geometry={esfGeo}>{negro}</mesh>)}</group>;
const banquetaTex = () => ctex("banqueta", 512, 512, (g) => { g.fillStyle = "#9a948a"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(${i % 2 ? "0,0,0" : "255,255,255"},${0.03 + rn(i, 2) * 0.05})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 512, 2, 2); } g.strokeStyle = "rgba(40,36,30,.6)"; g.lineWidth = 4; for (let x = 0; x <= 512; x += 170) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 512); g.stroke(); } for (let y = 0; y <= 512; y += 170) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); } });
const Frasco: React.FC<{ p: V3; n: number; t: number; t0: number[] }> = ({ p, n, t, t0 }) => <group position={p}>
  <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.15, 0.15, 0.4, 32, 1, true]} /><meshPhysicalMaterial color="#e8f4f8" roughness={0.05} transmission={0.85} transparent opacity={0.45} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.4, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.15, 0.012, 8, 32]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} clearcoat={1} /></mesh>
  {t0.slice(0, n).map((a, j) => t < a ? null : <mesh key={j} position={[0.02 * Math.sin(j * 2.3), 0.02 + j * 0.03 + fall(t, a, 0.55), 0.02 * Math.cos(j * 1.7)]} rotation={[0.1 * Math.sin(j), j, 0]} castShadow><cylinderGeometry args={[0.07, 0.07, 0.025, 28]} /><meshStandardMaterial color="#c8c8c0" metalness={0.85} roughness={0.3} /></mesh>)}</group>;
const H21Bolsas: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const tA = Array.from({ length: 8 }, (_, i) => 0.1 + i * 0.32), tB = [0.4, 1.9];
  const pos = (i: number): V3 => [(i % 3 - 1) * 0.3 + (Math.floor(i / 3) % 2) * 0.12, Math.floor(i / 3) * 0.33, (i % 2) * 0.08];
  const sq = (a: number) => tt > a + 0.35 ? 0.14 * Math.exp(-(tt - a - 0.35) * 8) * Math.cos((tt - a - 0.35) * 25) : 0;
  return <Estudio t={tt} cam={[0, 1.35, 3.3]} look={[0, 0.5, 0]} orbit={0.12} mesa="sombra">
    <mesh rotation={[-P2, 0, 0]} position={[0, -0.003, 0.2]} receiveShadow><planeGeometry args={[5, 3]} /><meshStandardMaterial map={banquetaTex()} roughness={0.95} /></mesh>
    <group position={[-0.95, 0, -0.1]}>{tA.map((a, i) => tt < a ? null : <Bolsa key={i} p={[pos(i)[0], pos(i)[1] + fall(tt, a, 0.9), pos(i)[2]]} i={i} sq={sq(a)} />)}
      <Frasco p={[0.62, 0, 0.5]} n={8} t={tt} t0={tA.map((a) => a + 0.4)} /></group>
    <group position={[0.65, 0, -0.1]}>{tB.map((a, i) => tt < a ? null : <Bolsa key={i} p={[pos(i)[0], pos(i)[1] + fall(tt, a, 0.9), pos(i)[2]]} i={i + 3} sq={sq(a)} />)}
      <Frasco p={[0.6, 0, 0.5]} n={2} t={tt} t0={tB.map((a) => a + 0.4)} /></group>
    <Etq p={[-0.65, 0.01, 0.95]} rot={[-P2 + 0.35, 0, 0]} txt={["ANTES"]} w={0.5} h={0.2} bg="#f1ead6" size={120} />
    <Etq p={[0.95, 0.01, 0.95]} rot={[-P2 + 0.35, 0, 0]} txt={["AHORA"]} w={0.5} h={0.2} bg="#f1ead6" size={120} />
  </Estudio>;
}}</Stage>;

// ── 22 · LA GRANIZADA (17:56): cae granizo del tamaño de un garbanzo sobre la mata; se le caen las hojas y luego retoña más fuerte
const H22Granizo: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const gr = tt < 2.2, retona = eio(tt, 3.0, 5.0), nub = eio(tt, 2.0, 2.8);
  const HO = Array.from({ length: 10 }, (_, i) => ({ y: 0.12 + i * 0.055, a: i * 2.4, t0: 0.35 + i * 0.17 }));
  return <Estudio t={tt} cam={[0.1, 1.05, 2.3]} look={[0, 0.5, 0]} orbit={0.12}>
    <hemisphereLight args={[0x8a94a8, 0x2a2420, lerp(0.9, 0.15, nub)]} />
    <Cubeta s={0.62}>
      <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.012, 0.018, 0.6, 8]} /><meshStandardMaterial color="#5c7a32" roughness={0.8} /></mesh>
      {HO.map((o, i) => { const k = cl((tt - o.t0) / 1.1); const L = 0.13;
        return <group key={i} position={[Math.cos(o.a) * (0.1 + 0.9 * k), o.y + (k > 0 ? 0.3 * Math.sin(k * P) - k * (o.y + 0.02) : 0), Math.sin(o.a) * (0.1 + 0.9 * k)]} rotation={[k * 7, o.a, 0.9 + k * 5]}>
          <mesh position={[k > 0 ? 0 : L * 0.8, 0, 0]} scale={[L, 0.012, 0.06]} geometry={hojaGeo} castShadow><meshStandardMaterial color={k > 0.6 ? "#7a7a3a" : "#4f8a3a"} roughness={0.7} side={THREE.DoubleSide} /></mesh></group>; })}
      <group scale={[1, Math.max(0.001, retona), 1]}>
        <mesh position={[0.02, 0.32, 0.02]} castShadow><cylinderGeometry args={[0.028, 0.036, 0.64, 10]} /><meshStandardMaterial color="#6aa83a" roughness={0.6} /></mesh>
        {Array.from({ length: 14 }, (_, i) => { const y = 0.1 + i * 0.038, a = i * 2.4 + 1, k = cl(retona * 1.6 - i / 14 * 0.6);
          return <group key={i} position={[0.02, y, 0.02]} rotation={[0, a, 0.8]} scale={Math.max(0.001, k)}><mesh position={[0.15, 0, 0]} scale={[0.16, 0.014, 0.075]} geometry={hojaGeo} castShadow><meshStandardMaterial color="#5ab83a" roughness={0.55} side={THREE.DoubleSide} /></mesh></group>; })}</group>
    </Cubeta>
    {gr && Array.from({ length: 34 }, (_, i) => { const per = 0.7, ph = ((tt + rn(i, 1) * per) % per) / per, x = (rn(i, 2) - 0.5) * 1.8, z = (rn(i, 3) - 0.5) * 1.2;
      const y = ph < 0.7 ? lerp(2.0, 0.035, Math.pow(ph / 0.7, 2)) : 0.035 + Math.sin((ph - 0.7) / 0.3 * P) * 0.12;
      return <mesh key={i} position={[x, y, z]} scale={0.035} geometry={esfGeo} castShadow><meshPhysicalMaterial color="#f4f8fa" roughness={0.02} clearcoat={1} transmission={0.5} transparent opacity={0.9} specularIntensity={1} /></mesh>; })}
    {Array.from({ length: 26 }, (_, i) => <mesh key={"s" + i} position={[(rn(i, 4) - 0.5) * 1.8, 0.022, (rn(i, 5) - 0.5) * 1.2]} scale={0.024 * cl(tt * 0.8 - rn(i, 6) * 0.6) * (1 - retona) + 0.001} geometry={esfGeo}><meshPhysicalMaterial color="#eef4f6" roughness={0.05} clearcoat={1} /></mesh>)}
    <Suelo />
  </Estudio>;
}}</Stage>;

// ── 23 · LOS FRASCOS DE SEMILLA (19:47): cinco frascos se llenan de su semilla, les cae un puñito de ceniza y se cierran
const frGeo = lathe([[0, 0], [0.15, 0], [0.17, 0.03], [0.17, 0.34], [0.13, 0.38], [0.13, 0.42]], 32);
const FR: [string, string][] = [["jitomate", "#e8d8a0"], ["chile", "#f0dca0"], ["calabaza", "#f2ead0"], ["frijol", "#6b2a1c"], ["maíz", "#e0b83a"]];
const H23Frascos: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  return <Estudio t={tt} cam={[0, 1.2, 2.8]} look={[0, 0.25, 0]} orbit={0.14}>
    {FR.map(([n, c], j) => { const x = (j - 2) * 0.48, lv = eio(tt, 0.1 + j * 0.2, 1.3 + j * 0.2), tapa = phys(tt, 2.8 + j * 0.2, 6, 0.5), ceniza = eio(tt, 2.0 + j * 0.1, 2.6 + j * 0.1);
      return <group key={n} position={[x, 0, 0]}>
        <mesh geometry={frGeo} castShadow>{M.vidrio()}</mesh>
        <mesh position={[0, 0.02 + 0.15 * lv, 0]} scale={[1, Math.max(0.001, lv), 1]}><cylinderGeometry args={[0.155, 0.15, 0.3, 28]} /><meshStandardMaterial color={c} roughness={0.8} /></mesh>
        <mesh position={[0, 0.03 + 0.3 * lv, 0]} rotation={[-P2, 0, 0]} scale={0.001 + 0.13 * ceniza}><circleGeometry args={[1, 20]} /><meshStandardMaterial color="#4a4744" roughness={1} /></mesh>
        <mesh position={[0, 0.43 + (1 - cl(tapa)) * 1.6, 0]} rotation={[0, (1 - cl(tapa)) * 6, 0]} castShadow><cylinderGeometry args={[0.145, 0.145, 0.05, 28]} />{M.cromo("#b8a070")}</mesh>
        <Etq p={[0, 0.17, 0.175]} rot={[0, 0, 0]} txt={[n]} w={0.3} h={0.12} bg="#f4e9b8" />
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 24 · EL BALCÓN (20:37): la ventana de un departamento con cuatro cubetas; el sol de la mañana barre y las matas crecen
const H24Balcon: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const sol = eio(tt, 0.1, 3.8);
  return <Estudio t={tt} cam={[0, 1.2, 3.0]} look={[0, 0.9, 0]} orbit={0.12}>
    <RBox p={[0, 0.9, -0.45]} s={[3.4, 2.4, 0.4]} r={0.02}><meshStandardMaterial color="#d8c8a8" roughness={0.9} /></RBox>
    <mesh position={[lerp(-0.9, 0.9, sol), 0.68, 0.05]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.5, 0.42]} /><meshBasicMaterial color="#ffe0a0" transparent opacity={0.35} depthWrite={false} toneMapped={false} /></mesh>
    <mesh position={[0, 1.15, -0.24]}><planeGeometry args={[1.4, 1.0]} /><meshStandardMaterial color="#9ac0d8" emissive="#ffe0a0" emissiveIntensity={0.6 * sol} /></mesh>
    {[[-0.7, 1.15], [0.7, 1.15], [0, 1.65], [0, 0.65]].map(([x, y], i) => <RBox key={i} p={[x, y, -0.22]} s={i < 2 ? [0.06, 1.06, 0.06] : [1.46, 0.06, 0.06]} r={0.01}>{M.madera("#f2efe8")}</RBox>)}
    <RBox p={[0, 0.6, -0.05]} s={[1.7, 0.06, 0.4]} r={0.01}><meshStandardMaterial color="#a4502e" /></RBox>
    {["chile", "cilantro", "cebolla", "hierbabuena"].map((n, i) => <group key={n} position={[(i - 1.5) * 0.4, 0.63, -0.05]}><Cubeta s={0.26}><Mata g={0.35 + 0.65 * cl((sol - i * 0.22) * 3)} h={0.9} seed={i} /></Cubeta></group>)}
    <directionalLight position={[lerp(-3, 1, sol), 2.5, 2]} intensity={1.2 * sol} color="#ffe0a0" />
  </Estudio>;
}}</Stage>;

// ── 25 · LA PAJA GUARDA LA HUMEDAD (21:09): dos cubetas al sol; de la pelona se escapan las gotas; la tapada con paja las guarda
const H25Humedad: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const paja = eio(tt, 0.1, 1.2);
  return <Estudio t={tt} cam={[0, 1.6, 3.2]} look={[0, 0.55, 0]} orbit={0.15}>
    <group position={[-0.7, 0, 0]}><Cubeta s={0.7} tierra={0} /><mesh position={[0, 0.63, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.27, 32]} /><meshStandardMaterial color="#b89a6a" roughness={1} /></mesh>
      {Array.from({ length: 14 }, (_, i) => { const k = ((tt * 0.6 + i / 14) % 1); return <Gota key={i} p={[(rn(i, 1) - 0.5) * 0.4, 0.65 + k * 1.1, (rn(i, 2) - 0.5) * 0.4]} s={2.6 * (1 - k)} />; })}</group>
    <group position={[0.7, 0, 0]}><Cubeta s={0.7} />
      {Array.from({ length: 40 }, (_, i) => { const a = rn(i, 3) * 6.28, r = rn(i, 4) * 0.26; const y = 0.64 + fall(tt, 0.1 + i * 0.02, 0.6) * (1 - paja * 0) + (i % 3) * 0.006;
        return <mesh key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]} rotation={[P2, 0, a]} castShadow><cylinderGeometry args={[0.009, 0.009, 0.24, 4]} /><meshStandardMaterial color="#d8b85a" roughness={0.9} /></mesh>; })}
      {Array.from({ length: 6 }, (_, i) => { const k = ((tt * 0.6 + i / 6) % 1); return <Gota key={"g" + i} p={[(rn(i, 5) - 0.5) * 0.4, 0.66 + Math.sin(k * P) * 0.08, (rn(i, 6) - 0.5) * 0.4]} s={1.1} />; })}</group>
    <mesh position={[0, 2.4, -1.4]}><sphereGeometry args={[0.3, 24, 16]} /><meshBasicMaterial color="#ffe08a" /></mesh>
    <Suelo c="#8a6a48" />
  </Estudio>;
}}</Stage>;

// ── 26 · LOS LADRILLOS (21:30): los ladrillos se apilan de a uno, la cubeta aterriza arriba y la mano la alcanza sin agacharse
const Seg: React.FC<{ a: V3; b: V3; r: number; c: string }> = ({ a, b, r, c }) => { const sg = SEG(a, b);
  return <><mesh position={sg.pos} quaternion={sg.q} castShadow><cylinderGeometry args={[r * 0.9, r, sg.L, 14]} /><meshStandardMaterial color={c} roughness={0.8} /></mesh><mesh position={b} scale={r} geometry={esfGeo}><meshStandardMaterial color={c} roughness={0.8} /></mesh></>; };
const H26Ladrillos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const L = [{ x: -0.22, y: 0.065, r: 0 }, { x: 0.22, y: 0.065, r: 0 }, { x: 0, y: 0.195, r: P2 }, { x: -0.22, y: 0.325, r: 0 }, { x: 0.22, y: 0.325, r: 0 }].map((l, i) => ({ ...l, a: 0.05 + i * 0.28 }));
  const top = 0.39, ta = 1.55, cub = phys(tt, ta, 6, 0.45), sq = tt > ta + 0.2 ? Math.exp(-(tt - ta - 0.2) * 7) * Math.sin((tt - ta - 0.2) * 28) * 0.12 : 0;
  const br = eio(tt, 2.3, 3.2), hand: V3 = [lerp(1.0, 0.36, br), lerp(0.55, top + 0.5, br), 0.15], elbow: V3 = [lerp(1.25, 0.95, br), lerp(0.2, 0.45, br), 0.35], sh: V3 = [1.45, -0.3, 0.5];
  return <Estudio t={tt} cam={[0.3, 1.15, 2.6]} look={[0.15, 0.45, 0]} orbit={0.12} mesa="sombra">
    {L.map((l, i) => { const off = fall(tt, l.a, 0.9); return tt < l.a ? null : <group key={i}>
      <group position={[l.x, l.y + off, 0]} rotation={[0, l.r, 0]}><Ladrillo p={[0, 0, 0]} /></group>
      <mesh position={[l.x, 0.003, 0]} rotation={[-P2, 0, l.r]} scale={[0.25, 0.13, 1]}><circleGeometry args={[1, 24]} /><meshBasicMaterial color="#000" transparent opacity={0.35 * cl(1 - off * 1.5)} depthWrite={false} /></mesh></group>; })}
    <group position={[0, top + (1 - cl(cub)) * 1.0, 0]} scale={[1 + sq, Math.max(0.001, 1 - sq), 1 + sq]}><Cubeta s={0.5}><Mata g={1} h={0.5} /></Cubeta></group>
    <Seg a={sh} b={elbow} r={0.075} c="#6a4a8a" /><Seg a={elbow} b={hand} r={0.06} c="#6a4a8a" />
    <group position={hand}><Mano p={[0, 0, 0]} rot={[0, -P2, 0.3]} s={0.55} pinza={br * 0.6} /></group>
    <Suelo c="#8a6a48" />
  </Estudio>;
}}</Stage>;

// ── 27 · LO QUE DEVUELVE (22:49): el billete de $500 solo, gastado una vez; al lado crecen siete columnas de monedas hasta $6,000 al año
const DEV: [string, number][] = [["jitomate", 4], ["chile", 2], ["cilantro", 3], ["nopal", 7], ["verdura", 6], ["huevo", 30], ["abono", 18]];
const H27Devuelve: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const tot = eio(tt, 3.4, 4.0);
  return <Estudio t={tt} cam={[0.1, 1.35, 2.7]} look={[0.1, 0.35, 0]} orbit={0.15}>
    <Billete p={[-0.95, 0.35, 0.2]} rot={[-0.35, 0.25, 0.05]} v="500" s={1.25} />
    {DEV.map(([n, c], i) => <group key={n} position={[-0.15 + i * 0.26, 0, 0]} scale={0.85}>
      <Pila p={[0, 0, 0]} n={Math.min(14, 4 + Math.round(c / 3))} t={tt} a={0.1 + i * 0.4} dt={0.05} /></group>)}
    <group scale={Math.max(0.001, tot)} position={[0.6, 1.25, 0]}><Etq p={[0, 0, 0]} rot={[0, 0, 0]} txt={["$6,000 al año"]} w={0.9} h={0.24} bg="#f4e9b8" /></group>
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  caminos: H1Caminos, patio: H2Patio, doce: H3Doce, cuenta: H4Cuenta, jitomate: H5Jitomate, capas: H6Capas, chile: H7Chile, cilantro: H8Cilantro,
  ramita: H9Ramita, cal: H10Cal, detodo: H11DeTodo, calabacita: H12Calabacita, lechuga: H13Lechuga, costal: H14Costal, ajo: H15Ajo, nopal: H16Nopal,
  milpa: H17Milpa, rutina: H18Rutina, jabon: H19Jabon, composta: H20Composta, bolsas: H21Bolsas, granizo: H22Granizo, frascos: H23Frascos,
  balcon: H24Balcon, humedad: H25Humedad, ladrillos: H26Ladrillos, devuelve: H27Devuelve,
};
