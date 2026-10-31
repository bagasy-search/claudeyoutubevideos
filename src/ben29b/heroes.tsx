// ben29b · «sin amasar»: los componentes únicos del minuto (ninguno repite mecanismo de ben29a ni entre sí).
// Regla: el OBJETO cuenta la idea sin leer; llegan de a uno con resorte; cámara curva (Estudio orbita); ≤5 palabras por rótulo,
// los rótulos van DENTRO de la escena (madera, papel, esfera), nunca flotando ni arriba a la izquierda.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, img, lerp, phys, Stage } from "./ckit";
import { ctex, Estudio, fall, lathe, M, papel, RBox, rn, V3, Vapor, Yute } from "./estudio3d";
import { Chorro, Cuchara, Foto3D, Mano } from "./kit3d";
import { Bol, corteza, Frasco, Hogaza, Masa, P, P2, Reloj } from "./kitpan";

type C = React.FC<{ t: number; h: H }>;
const ent = (tt: number, a: number) => cl(phys(tt, a, 6, 0.5)); // llegada con resorte
const sp = (tt: number, a: number) => phys(tt, a, 6, 0.45);       // resorte con rebote (puede pasar de 1)
const IT = (h: H) => (h.items ?? []) as { a: number; tx: string }[];
const cartel = (key: string, tx: string, o: { w?: number; h?: number; bg?: string; ink?: string; size?: number } = {}) =>
  papel("b_" + key, [tx], { w: o.w ?? 512, h: o.h ?? 192, size: o.size ?? 120, bg: o.bg, ink: o.ink, font: `900 ${o.size ?? 120}px Georgia, serif` });
const Placa: React.FC<{ p: V3; rot?: V3; w: number; h: number; tex: THREE.Texture; k?: number }> = ({ p, rot, w, h, tex, k = 1 }) => (
  <group position={p} rotation={rot} scale={0.001 + k}>
    <RBox s={[w + 0.06, h + 0.06, 0.04]} r={0.015}>{M.madera("#5a3a22")}</RBox>
    <mesh position={[0, 0, 0.022]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={tex} roughness={0.85} /></mesh>
  </group>);
const MASA = "#efdcb4";
const masaMat = (c = MASA, r = 0.6) => <meshPhysicalMaterial color={c} roughness={r} sheen={0.8} sheenColor="#fff1d6" clearcoat={0.15} />;

// ── 1 · SELLO (CTA1): el sello de madera del panadero baja sobre la masa y deja grabado el botón rojo con su campanita
const selloTex = () => ctex("b_sello", 512, 256, (g) => {
  g.fillStyle = "#9a6a3a";
  g.beginPath(); g.moveTo(206, 175); g.quadraticCurveTo(206, 70, 256, 62); g.quadraticCurveTo(306, 70, 306, 175); g.closePath(); g.fill(); g.fillRect(194, 170, 124, 14); g.beginPath(); g.arc(256, 192, 13, 0, 7); g.fill(); g.fillRect(251, 48, 10, 16);
});
const H1Sello: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const down = eio(tt, 0.8, 1.5) * (1 - eio(tt, 2.0, 2.9)), mark = cl((tt - 1.45) / 0.3), ring = Math.sin(cl((tt - 3.0) / 2.2) * P * 6) * (1 - cl((tt - 3.0) / 2.2));
  return <Estudio t={tt} cam={[0.2, 1.55, 2.3]} look={[0, 0.25, 0]} orbit={0.1}>
    <mesh position={[0, 0.07, 0]} scale={[1, 1 - 0.12 * down, 1]} castShadow receiveShadow><cylinderGeometry args={[0.72, 0.76, 0.14, 64]} />{masaMat()}</mesh>
    <mesh position={[0, 0.142, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.95, 0.48]} /><meshStandardMaterial map={selloTex()} transparent opacity={mark * 0.92} roughness={0.9} depthWrite={false} /></mesh>
    <group position={[0, lerp(1.25, 0.2, down), 0]}>
      <RBox s={[1.0, 0.1, 0.55]} r={0.03}>{M.madera("#6a4428")}</RBox>
      <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.07, 0.1, 0.5, 20]} />{M.madera("#8a5a32")}</mesh>
      <mesh position={[0, 0.6, 0]} castShadow><sphereGeometry args={[0.13, 24, 16]} />{M.madera("#8a5a32")}</mesh>
    </group>
    {/* la campanita de bronce cuelga de la perilla del sello y suena cuando queda la marca */}
    <group position={[0.85, 0.95, -0.2]} rotation={[0, 0, 0.35 * ring]} scale={ent(tt, 2.8) + 0.001}>
      <mesh position={[0, -0.1, 0]} geometry={campGeo} castShadow>{M.cromo("#c9a24a")}</mesh>
      <mesh position={[0, -0.27, 0]}><sphereGeometry args={[0.035, 12, 10]} />{M.cromo("#8a6a2a")}</mesh>
    </group>
  </Estudio>;
}}</Stage>;
const campGeo = lathe([[0.001, 0.12], [0.05, 0.11], [0.08, 0.02], [0.13, -0.12], [0.15, -0.15], [0.001, -0.15]], 32);

// ── 2 · FICHERO: el reloj de fichar de la fábrica; la tarjeta entra, «chac», sale sellada y la aguja corre: la fábrica cobra por hora
const tarjeta = (n: number) => papel("b_tarj" + n, ["IN  7:00", n > 0 ? "8:00" : " ", n > 1 ? "9:00" : " ", n > 2 ? "10:00" : " "], { w: 256, h: 420, size: 46, rule: true });
const H2Fichero: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const ins = eio(tt, 0.6, 1.3), n = Math.min(3, Math.floor(cl((tt - 1.4) / 3.6) * 3.99)), hit = Math.max(0, Math.sin(cl((tt - 1.4) % 1.2 / 0.25) * P)) * (tt > 1.4 ? 1 : 0);
  return <Estudio t={tt} cam={[0.4, 1.25, 2.6]} look={[0, 0.85, 0]} orbit={0.1}>
    <RBox p={[0, 0.85, 0]} s={[0.9, 1.4, 0.45]} r={0.06}><meshPhysicalMaterial color="#4f6a5a" roughness={0.4} metalness={0.3} clearcoat={0.6} /></RBox>
    <Reloj p={[0, 1.25, 0.24]} s={0.62} h={7 + tt * 0.8} />
    <mesh position={[0, 0.62, 0.23]}><boxGeometry args={[0.36, 0.04, 0.02]} /><meshStandardMaterial color="#111" /></mesh>
    <mesh position={[0.32, 0.62 - 0.05 * hit, 0.25]}><boxGeometry args={[0.08, 0.16, 0.08]} />{M.cromo()}</mesh>
    <group position={[0, lerp(0.95, 0.42, ins) + 0.04 * hit, 0.27]} rotation={[0, 0, 0]}>
      <mesh><planeGeometry args={[0.3, 0.5]} /><meshStandardMaterial map={tarjeta(n)} roughness={0.9} side={THREE.DoubleSide} /></mesh>
    </group>
    <Placa p={[0, 0.06, 0.55]} rot={[-0.6, 0, 0]} w={0.6} h={0.16} tex={cartel("hora", "PAID BY THE HOUR", { size: 70 })} k={ent(tt, 2.4)} />
  </Estudio>;
}}</Stage>;

// ── 3 · MÁQUINA vs NOCHE: la amasadora roja tiembla, ruge y se desarma tuerca por tuerca; la luna sube sobre la artesa tapada y no se rompe
const H3Maquina: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#141826">{(tt) => {
  const shake = (tt < 4 ? 1 : 0) * 0.02 * Math.sin(tt * 9) , brk = eio(tt, 4.0, 5.0), moon = eio(tt, 1.0, 5.5);
  return <Estudio t={tt} cam={[0, 1.25, 2.7]} look={[0, 0.6, 0]} orbit={0.08}>
    <group position={[-0.75 + shake, 0, 0]} rotation={[0, 0.3, -0.25 * brk]} scale={1.5}>
      <RBox p={[0, 0.3, 0]} s={[0.55, 0.6, 0.5]} r={0.08}><meshPhysicalMaterial color="#5f7a6a" roughness={0.4} clearcoat={0.5} /></RBox>
      <mesh position={[0, 0.72, 0.05]}><cylinderGeometry args={[0.3, 0.24, 0.3, 32, 1, true]} />{M.cromo()}</mesh>
      <group position={[0, 1.0, -0.15]} rotation={[0.4 + 0.5 * brk, 0, 0]}><RBox p={[0, 0, 0.2]} s={[0.16, 0.14, 0.6]} r={0.05}><meshPhysicalMaterial color="#5f7a6a" roughness={0.4} clearcoat={0.5} /></RBox></group>
      <mesh position={[0, 0.82, 0.25]} rotation={[0, tt * 6 * (1 - brk), 0]}><torusGeometry args={[0.1, 0.015, 8, 24, P * 1.5]} />{M.cromo()}</mesh>
    </group>
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.85 + (rn(i, 1) - 0.5) * 0.7, 0.03 + fall(tt, 4.1 + i * 0.12, 0.6 + rn(i, 2) * 0.5), 0.3 + (rn(i, 3) - 0.5) * 0.5]} rotation={[rn(i, 4) * 3, 0, rn(i, 5) * 3]} visible={false}><cylinderGeometry args={[0.03, 0.03, 0.03, 6]} />{M.cromo("#9a9a9a")}</mesh>)}
    {/* la artesa tapada con sacos y la luna que sube */}
    <group position={[0.85, 0, 0]}>
      <RBox p={[0, 0.2, 0]} s={[0.9, 0.36, 0.5]} r={0.03}>{M.madera("#6a4428")}</RBox>
      <mesh position={[0, 0.4, 0]} scale={[1, 0.25, 1]}><sphereGeometry args={[0.5, 24, 12, 0, 2 * P, 0, P2]} /><Yute /></mesh>
    </group>
    <group position={[0.85 + 0.3 * (1 - moon), 0.9 + 0.9 * moon, -0.6]}>
      <mesh><sphereGeometry args={[0.2, 32, 24]} /><meshStandardMaterial color="#f4f0e0" emissive="#f4ecd0" emissiveIntensity={0.9 * moon} toneMapped={false} /></mesh>
      <pointLight intensity={2.5 * moon} distance={3} color="#cfd8ff" />
    </group>
  </Estudio>;
}}</Stage>;

// ── 4 · ENCASTRE: la bandeja tallada con tres huecos; caen en su lugar el saco de harina, la jarra de agua y el platito de sal
const H4Encastre: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const X = [-0.55, 0, 0.55];
  return <Estudio t={tt} cam={[0, 1.55, 2.2]} look={[0, 0.2, 0]} orbit={0.1}>
    <RBox p={[0, 0.06, 0]} s={[1.7, 0.12, 0.7]} r={0.05}>{M.madera("#8a5a32")}</RBox>
    {X.map((x, i) => <mesh key={i} position={[x, 0.121, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.2, 40]} /><meshStandardMaterial color="#3a2414" roughness={1} /></mesh>)}
    <group position={[X[0], 0.12 + fall(tt, 0.5, 1.4), 0]}>
      <RBox p={[0, 0.17, 0]} s={[0.3, 0.34, 0.22]} r={0.05}><meshStandardMaterial color="#f3ece0" roughness={0.95} /></RBox>
      <mesh position={[0, 0.38, 0]}><coneGeometry args={[0.1, 0.12, 12]} /><meshStandardMaterial color="#f3ece0" roughness={0.95} /></mesh>
    </group>
    <mesh position={[X[1], 0.12 + fall(tt, 1.4, 1.4), 0]} geometry={jarroB} castShadow>{M.barro("#a8602c")}</mesh>
    <group position={[X[2], 0.12 + fall(tt, 2.3, 1.4), 0]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.17, 0.12, 0.06, 32]} />{M.madera("#c49a6a")}</mesh>
      <mesh position={[0, 0.09, 0]}><coneGeometry args={[0.12, 0.08, 24]} /><meshStandardMaterial color="#fbfbf7" roughness={0.6} /></mesh>
    </group>
    {["FLOUR", "WATER", "SALT"].map((w, i) => <Placa key={w} p={[X[i], 0.07, 0.37]} w={0.34} h={0.09} tex={cartel("enc" + i, w, { size: 100 })} k={ent(tt, 1.0 + i * 0.9)} />)}
  </Estudio>;
}}</Stage>;
const jarroB = lathe([[0.001, 0], [0.13, 0], [0.17, 0.12], [0.15, 0.3], [0.1, 0.38], [0.12, 0.44], [0.001, 0.44]], 32);

// ── 5 · JARRA 360: el chorro frío de la canilla llena la jarra medidora hasta la raya roja de 360
const H5Jarra: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const pour = cl((tt - 0.6) / 0.3) * (1 - cl((tt - 3.8) / 0.3)), lvl = lerp(0.02, 0.62, eio(tt, 0.7, 3.9));
  return <Estudio t={tt} cam={[0.3, 1.1, 2.6]} look={[0, 0.8, 0]} orbit={0.1}>
    <mesh position={[0, 0.45, 0]} geometry={jarraM}>{M.vidrio()}</mesh>
    <mesh position={[0, 0.03 + lvl / 2, 0]}><cylinderGeometry args={[0.3, 0.27, lvl, 40]} />{M.liquido("#bfe2f2", 0.45)}</mesh>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, 0.12 + i * 0.12, 0.3]}><boxGeometry args={[i === 5 ? 0.16 : 0.08, 0.008, 0.005]} /><meshBasicMaterial color={i === 5 ? "#c0281c" : "#5a6a70"} /></mesh>)}
    <Placa p={[0.42, 0.78, 0.2]} rot={[0, -0.3, 0]} w={0.3} h={0.11} tex={cartel("360", "360 g", { size: 110, ink: "#8a2f24" })} k={ent(tt, 3.6)} />
    <group position={[0, 1.55, 0]}><mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />{M.cromo("#c9a24a")}</mesh>
      <mesh position={[0.25, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.3, 16]} />{M.cromo("#c9a24a")}</mesh>
      <mesh position={[-0.2, -0.1, 0]}><cylinderGeometry args={[0.035, 0.035, 0.15, 16]} />{M.cromo("#c9a24a")}</mesh></group>
    {pour > 0.02 && <Chorro a={[-0.2, 1.38, 0]} b={[-0.05, 0.08 + lvl, 0]} r={0.025} c="#d8f0fa" o={0.75 * pour} t={tt} />}
  </Estudio>;
}}</Stage>;
const jarraM = lathe([[0.001, -0.45], [0.3, -0.45], [0.33, -0.42], [0.34, 0.3], [0.36, 0.36]], 40);

// ── 6 · PANQUEQUE: dos bollos iguales; a uno le cae la sal y queda en pie; el otro, sin sal, se desparrama como un panqueque
const H6Panqueque: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const slump = eio(tt, 2.6, 4.6);
  return <Estudio t={tt} cam={[0, 1.2, 2.5]} look={[0, 0.25, 0]} orbit={0.1}>
    <RBox p={[0, 0.03, 0]} s={[2.0, 0.06, 0.9]} r={0.03}>{M.madera("#9a6a3a")}</RBox>
    <Masa p={[-0.5, 0.06, 0]} r={0.36} rise={1 - 0.15 * slump} t={tt} bub={0.3} />
    <mesh position={[0.5, 0.06, 0]} scale={[0.36 * lerp(1, 1.7, slump), 0.36 * lerp(0.8, 0.14, slump), 0.36 * lerp(1, 1.6, slump)]} castShadow><sphereGeometry args={[1, 40, 20, 0, 2 * P, 0, P2]} />{masaMat("#f0dfba", 0.5)}</mesh>
    {Array.from({ length: 16 }, (_, i) => { const a = 0.6 + i * 0.07; return <mesh key={i} position={[-0.5 + (rn(i, 1) - 0.5) * 0.3, 0.38 + fall(tt, a, 0.9), (rn(i, 2) - 0.5) * 0.3]} scale={0.012} visible={tt > a && tt < a + 0.9}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#ffffff" /></mesh>; })}
    <mesh position={[-0.5, 1.35, 0]} rotation={[0, 0, P * 0.9]} visible={tt < 2.2}><cylinderGeometry args={[0.07, 0.08, 0.22, 20]} /><meshPhysicalMaterial color="#f4f4f0" roughness={0.2} clearcoat={1} /></mesh>
    <Placa p={[-0.5, 0.1, 0.52]} rot={[-0.5, 0, 0]} w={0.42} h={0.11} tex={cartel("sal", "SALT", { size: 100, ink: "#3a6a2a" })} k={ent(tt, 1.8)} />
    <Placa p={[0.5, 0.1, 0.52]} rot={[-0.5, 0, 0]} w={0.42} h={0.11} tex={cartel("nosal", "NO SALT", { size: 100, ink: "#8a2f24" })} k={ent(tt, 3.2)} />
  </Estudio>;
}}</Stage>;

// ── 7 · UN CUARTO: la cucharita llena de levadura se parte en cuatro gajos; tres se van y queda uno solo
const H7Cuarto: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const cut = eio(tt, 0.8, 1.5), go = eio(tt, 2.0, 3.4);
  return <Estudio t={tt} cam={[0.1, 1.05, 1.15]} look={[0, 0.08, 0]} orbit={0.08} fov={32}>
    <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.36, 0.3, 0.04, 48]} /><meshPhysicalMaterial color="#f6f2ea" roughness={0.25} clearcoat={0.8} /></mesh>
    <mesh position={[0, 0.041, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.3, 0.315, 48]} /><meshBasicMaterial color="#3a5a8a" /></mesh>
    {[0, 1, 2, 3].map((i) => { const a = i * P2 + P / 4, out = i < 3 ? go : 0, d = 0.025 * cut + 0.55 * out;
      return <group key={i} position={[Math.cos(a) * d, 0.045 + 0.15 * Math.sin(out * P), Math.sin(a) * d]} rotation={[0, -a + P / 4, 0]} scale={1 - 0.6 * out}>
        <mesh><cylinderGeometry args={[0.13, 0.14, 0.05, 16, 1, false, 0, P2]} /><meshStandardMaterial color="#c9a86a" roughness={1} transparent opacity={1 - 0.95 * out} /></mesh>
        {Array.from({ length: 10 }, (_, j) => <mesh key={j} position={[Math.sin(0.15 + rn(j + i * 10, 1) * 1.3) * 0.1 * rn(j, 2), 0.03, Math.cos(0.15 + rn(j + i * 10, 1) * 1.3) * 0.1 * rn(j, 2)]} scale={0.007}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#b89056" roughness={1} transparent opacity={1 - out} /></mesh>)}
      </group>; })}
    <Cuchara p={[0.55, 0.03, 0.05]} rot={[0, 0.9, 0]} s={0.9} mat="cromo" />
    <Placa p={[0, 0.06, 0.45]} rot={[-0.7, 0, 0]} w={0.36} h={0.12} tex={cartel("1g", "1 GRAM", { size: 100 })} k={ent(tt, 3.2)} />
  </Estudio>;
}}</Stage>;

// ── 8 · CADENA: la masa de ayer viene de la de anteayer: una fila de bollitos en platos con su año se pierde hacia atrás en el tiempo
const H8Cadena: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const zz = eio(tt, 0.4, 6.5) * 4.2, N = 12;
  return <Estudio t={tt} cam={[0.6, 0.8, 2.0]} look={[0, 0.25, -1.4]} orbit={0.04}>
    <group position={[0, 0, zz - 0.2]}>
      {Array.from({ length: N }, (_, i) => { const k = ent(tt, 0.2 + i * 0.12);
        return <group key={i} position={[0.12 * Math.sin(i * 0.9), 0, -i * 0.7]} scale={0.001 + k}>
          <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.22, 0.18, 0.04, 32]} /><meshStandardMaterial color="#efe6d2" roughness={0.4} /></mesh>
          <Masa p={[0, 0.04, 0]} r={0.15} rise={0.7} c={new THREE.Color("#efdcb4").lerp(new THREE.Color("#c9b490"), i / N).getStyle()} bub={0.5} />
          <mesh position={[0, 0.03, 0.26]} rotation={[-0.9, 0, 0]}><planeGeometry args={[0.28, 0.1]} /><meshStandardMaterial map={cartel("yr" + i, String(1975 - i * 3), { w: 256, h: 96, size: 80 })} roughness={0.9} /></mesh>
          {i < N - 1 && <mesh position={[-0.06 * Math.sin(i), 0.06, -0.35]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.5, 6]} />{masaMat()}</mesh>}
        </group>; })}
    </group>
  </Estudio>;
}}</Stage>;

// ── 9 · PERILLA: el timer de cocina se gira a 2 minutos, vuelve solo y suena; al lado, la masa desgreñada en el bol
const timerTex = () => ctex("b_timer", 512, 512, (g) => { g.fillStyle = "#fbf6e8"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill(); g.fillStyle = "#2a1c12"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "700 46px Georgia, serif";
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 2 * P - P2; g.fillText(String(i * 5), 256 + Math.cos(a) * 195, 256 + Math.sin(a) * 195); }
  for (let i = 0; i < 60; i++) { const a = (i / 60) * 2 * P; g.fillRect(256 + Math.cos(a) * 230 - 2, 256 + Math.sin(a) * 230 - 2, 4, i % 5 ? 6 : 14); }
  g.fillStyle = "#c0281c"; g.beginPath(); g.arc(256 + Math.cos(-P2 + (2 / 60) * 2 * P) * 140, 256 + Math.sin(-P2 + (2 / 60) * 2 * P) * 140, 16, 0, 7); g.fill(); });
const H9Perilla: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const set = eio(tt, 0.6, 1.4), back = cl((tt - 1.5) / 3.2), rot = (2 / 60) * 2 * P * set * (1 - back), ring = tt > 4.7 ? Math.sin(tt * 40) * 0.03 * (1 - cl((tt - 4.7) / 1)) : 0;
  return <Estudio t={tt} cam={[0.2, 0.95, 2.1]} look={[0, 0.35, 0]} orbit={0.1}>
    <group position={[-0.45, 0, 0]} rotation={[0, 0, ring]}>
      <mesh position={[0, 0.22, 0]} scale={[1, 0.8, 1]}><sphereGeometry args={[0.32, 40, 24, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color="#f4f1ea" roughness={0.3} clearcoat={1} /></mesh>
      <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.32, 0.33, 0.24, 48]} /><meshPhysicalMaterial color="#d8382a" roughness={0.3} clearcoat={1} /></mesh>
      <mesh position={[0, 0.03, 0.33]} rotation={[0, 0, rot]}><circleGeometry args={[0.13, 48]} /><meshStandardMaterial map={timerTex()} roughness={0.6} /></mesh>
      <mesh position={[0, 0.17, 0.3]}><coneGeometry args={[0.02, 0.05, 3]} /><meshBasicMaterial color="#1a1410" /></mesh>
    </group>
    <Bol p={[0.45, 0, 0]} s={0.55}><Masa p={[0, 0.06, 0]} r={0.55} rise={0.35} rough={0.9} t={tt} bub={0} /></Bol>
    <Placa p={[-0.45, 0.06, 0.55]} rot={[-0.6, 0, 0]} w={0.48} h={0.12} tex={cartel("2min", "2 MINUTES", { size: 100 })} k={ent(tt, 1.3)} />
  </Estudio>;
}}</Stage>;

// ── 10 · ESTACIÓN: la ventana pasa de nieve a primavera a verano; el termómetro sube y la masa del bol crece cada vez más rápido
const H10Estacion: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const s = eio(tt, 0.8, 2.2) + eio(tt, 3.6, 5.0), st = Math.min(2, Math.round(s)), sky = ["#b8c8dc", "#cfe0b8", "#ffd27a"];
  const col = new THREE.Color(sky[0]).lerp(new THREE.Color(sky[1]), cl(s)).lerp(new THREE.Color(sky[2]), cl(s - 1));
  return <Estudio t={tt} cam={[0.2, 1.1, 2.6]} look={[0, 0.7, -0.3]} orbit={0.08}>
    <group position={[0, 1.05, -0.7]}>
      <RBox s={[1.3, 1.0, 0.08]} r={0.03}>{M.madera("#e8e0cc")}</RBox>
      <mesh position={[0, 0, 0.045]}><planeGeometry args={[1.14, 0.84]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>
      {[0].map((i) => <group key={i}><mesh position={[0, 0, 0.06]}><boxGeometry args={[0.04, 0.84, 0.03]} />{M.madera("#e8e0cc")}</mesh><mesh position={[0, 0, 0.06]}><boxGeometry args={[1.14, 0.04, 0.03]} />{M.madera("#e8e0cc")}</mesh></group>)}
      {Array.from({ length: 14 }, (_, i) => { const y = 0.4 - ((tt * 0.25 + rn(i, 1)) % 1) * 0.8; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 1.0, y, 0.05]} scale={0.012} visible={s < 0.7}><circleGeometry args={[1, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={1 - s} /></mesh>; })}
      <mesh position={[0.35, 0.22, 0.05]} visible={s > 1.4}><circleGeometry args={[0.12, 32]} /><meshBasicMaterial color="#fff2b0" toneMapped={false} transparent opacity={cl((s - 1.4) * 2)} /></mesh>
    </group>
    <group position={[0.9, 0.95, -0.3]}>
      <RBox s={[0.16, 0.9, 0.04]} r={0.02}>{M.madera("#f1ead8")}</RBox>
      <mesh position={[0, -0.36 + (0.1 + 0.3 * s) / 2, 0.03]}><boxGeometry args={[0.025, 0.1 + 0.3 * s, 0.01]} /><meshBasicMaterial color="#d0302a" toneMapped={false} /></mesh>
      <mesh position={[0, -0.38, 0.03]}><sphereGeometry args={[0.035, 12, 10]} /><meshBasicMaterial color="#d0302a" toneMapped={false} /></mesh>
    </group>
    <Bol p={[-0.2, 0, 0.2]} s={0.6}><Masa p={[0, 0.06, 0]} r={0.55} rise={0.25 + 0.15 * s + 0.4 * cl((tt - 1) / 6) * (0.5 + s)} t={tt} /></Bol>
    {[0, 1, 2].map((i) => <Placa key={i} p={[0.55, 0.07, 0.5]} rot={[-0.6, 0, 0]} w={0.4} h={0.12} tex={cartel("hs" + i, ["20 HOURS", "16 HOURS", "11 HOURS"][i], { size: 90 })} k={i === st ? ent(tt, [0.4, 2.0, 4.6][i]) : 0} />)}
  </Estudio>;
}}</Stage>;

// ── 11 · AROMA: de la masa crecida suben, hechos de vapor ámbar, una manzana y un chop de cerveza
const ambar = (o: number) => <meshPhysicalMaterial color="#f0b860" emissive="#a86010" emissiveIntensity={0.35} roughness={0.1} transmission={0.4} transparent opacity={o} clearcoat={1} depthWrite={false} />;
const H11Aroma: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false} tone="#2a1a0c">{(tt) => {
  const a = eio(tt, 1.0, 4.0), b = eio(tt, 2.0, 5.0);
  return <Estudio t={tt} cam={[0, 1.1, 2.5]} look={[0, 0.75, 0]} orbit={0.1}>
    <Bol p={[0, 0, 0]} s={0.65}><Masa p={[0, 0.06, 0]} r={0.55} rise={1} t={tt} /></Bol>
    <Vapor t={tt} p={[0, 0.4, 0]} o={0.3} h={1.1} s={0.35} spread={0.3} n={12} />
    <group position={[-0.35 - 0.15 * a, 0.45 + 0.75 * a, 0]} rotation={[0, tt * 0.6, 0.2 * Math.sin(tt)]} scale={0.001 + 1.7 * a}>
      <mesh scale={[1, 0.9, 1]}><sphereGeometry args={[0.16, 32, 24]} />{ambar(0.75)}</mesh>
      <mesh position={[0, 0.16, 0]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.008, 0.01, 0.07, 6]} />{M.madera("#5a3a22")}</mesh>
      <mesh position={[0.05, 0.17, 0]} rotation={[0, 0, -0.8]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.04, 12, 8]} /><meshStandardMaterial color="#6a9a3a" roughness={0.6} /></mesh>
    </group>
    <group position={[0.35 + 0.15 * b, 0.45 + 0.8 * b, 0]} rotation={[0, -tt * 0.5, -0.15 * Math.sin(tt)]} scale={0.001 + 1.6 * b}>
      <mesh><cylinderGeometry args={[0.12, 0.11, 0.3, 32, 1, true]} />{ambar(0.6)}</mesh>
      <mesh position={[0, 0.17, 0]}><sphereGeometry args={[0.13, 24, 12, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#fffaf0" roughness={0.9} transparent opacity={0.85} /></mesh>
      <mesh position={[0.14, 0, 0]}><torusGeometry args={[0.07, 0.015, 8, 20, P]} />{ambar(0.6)}</mesh>
    </group>
  </Estudio>;
}}</Stage>;

// ── 12 · HELADERA = PAUSA: la puerta se abre, entra el bol, el imán de pausa se ilumina; la masa espera con escarcha y va tomando color
const H12Nevera: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#10161c">{(tt) => {
  const door = eio(tt, 0.3, 1.0) * (1 - eio(tt, 2.4, 3.1)), inn = eio(tt, 1.0, 2.2), frost = cl((tt - 3.2) / 2.5);
  return <Estudio t={tt} cam={[0.6, 1.1, 2.6]} look={[0, 0.7, 0]} orbit={0.08}>
    <RBox p={[0, 0.75, -0.1]} s={[1.0, 1.5, 0.8]} r={0.08}><meshPhysicalMaterial color="#eef1f2" roughness={0.3} clearcoat={0.8} side={THREE.BackSide} /></RBox>
    {[0.45, 0.95].map((y, i) => <mesh key={i} position={[0, y, -0.1]}><boxGeometry args={[0.9, 0.015, 0.7]} />{M.vidrio()}</mesh>)}
    <pointLight position={[0, 1.3, 0.1]} intensity={1.6 * (1 - 0.6 * (1 - door))} distance={1.8} color="#e8f4ff" />
    <group position={[lerp(1.2, 0, inn), 0.46 + 0.4 * (1 - inn), lerp(0.6, -0.1, inn)]}>
      <Bol s={0.45}><Masa p={[0, 0.06, 0]} r={0.55} rise={0.5 + 0.2 * frost} c={new THREE.Color("#efdcb4").lerp(new THREE.Color("#d8bf8e"), frost).getStyle()} t={tt} /></Bol>
      <mesh position={[0, 0.24, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.3, 32]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.35 * frost} roughness={1} depthWrite={false} /></mesh>
    </group>
    <group position={[0.5, 0.75, 0.32]} rotation={[0, -1.9 * door, 0]}>
      <RBox p={[-0.5, 0, 0.03]} s={[1.0, 1.5, 0.06]} r={0.04}><meshPhysicalMaterial color="#eef1f2" roughness={0.3} clearcoat={0.8} /></RBox>
      <group position={[-0.5, 0.25, 0.07]}>
        <mesh><circleGeometry args={[0.13, 40]} /><meshStandardMaterial color="#c0281c" emissive="#ff3020" emissiveIntensity={0.6 * frost} roughness={0.4} /></mesh>
        {[-0.035, 0.035].map((x) => <mesh key={x} position={[x, 0, 0.005]}><planeGeometry args={[0.035, 0.12]} /><meshBasicMaterial color="#fbf3e2" /></mesh>)}
      </group>
    </group>
    <Placa p={[0.9, 0.08, 0.6]} rot={[-0.6, -0.3, 0]} w={0.5} h={0.12} tex={cartel("3d", "UP TO 3 DAYS", { size: 80 })} k={ent(tt, 3.4)} />
  </Estudio>;
}}</Stage>;

// ── 13 · DESPIERTA: tres vueltas de pliegues; con cada una la masa floja se para más alta y redonda; el reloj de bolsillo salta media hora
const H13Despierta: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const s = sp(tt, 0.8) * 0.33 + sp(tt, 2.4) * 0.33 + sp(tt, 4.0) * 0.34, n = tt < 0.8 ? 0 : tt < 2.4 ? 1 : tt < 4.0 ? 2 : 3;
  return <Estudio t={tt} cam={[0.2, 0.95, 2.0]} look={[0, 0.3, 0]} orbit={0.1}>
    <RBox p={[0, 0.03, 0]} s={[1.6, 0.06, 1.0]} r={0.03}>{M.madera("#9a6a3a")}</RBox>
    <mesh position={[-0.15, 0.06, 0]} scale={[0.45 * lerp(1.5, 0.95, s), 0.45 * lerp(0.28, 0.85, s), 0.45 * lerp(1.4, 0.95, s)]} castShadow>
      <sphereGeometry args={[1, 48, 24, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color={MASA} roughness={lerp(0.8, 0.35, s)} sheen={0.8} sheenColor="#fff1d6" clearcoat={0.4 * s} /></mesh>
    {[0.8, 2.4, 4.0].map((a, i) => { const k = Math.sin(cl((tt - a + 0.4) / 0.8) * P); return <Mano key={i} p={[-0.15 + 0.3 * Math.cos(i * 2.1), 0.32 + 0.3 * (1 - k), 0.3 * Math.sin(i * 2.1)]} rot={[-1.3, i * 2.1, 0]} pinza={0.3} s={0.8} />; })}
    <Reloj p={[0.6, 0.22, 0.05]} rot={[-0.4, -0.3, 0]} s={0.36} h={8 + n * 0.5} marco="#b8962e" />
    {[1, 2, 3].map((i) => <Placa key={i} p={[0, 0.07, 0.55]} rot={[-0.6, 0, 0]} w={0.36} h={0.12} tex={cartel("set" + i, "SET " + i, { size: 100 })} k={n === i ? ent(tt, [0.8, 2.4, 4.0][i - 1]) : 0} />)}
  </Estudio>;
}}</Stage>;

// ── 14 · SOBRE: el cuadrado de masa cierra sus cuatro puntas al centro como un sobre y se da vuelta, liso
const triGeo = (() => { const s = new THREE.Shape(); s.moveTo(-0.4, 0); s.lineTo(0.4, 0); s.lineTo(0, 0.38); s.closePath(); return new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 }); })();
const H14Sobre: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const fl = (i: number) => eio(tt, 0.6 + i * 0.7, 1.2 + i * 0.7), flip = eio(tt, 4.0, 4.9);
  return <Estudio t={tt} cam={[0.25, 1.15, 1.55]} look={[0, 0.12, 0]} orbit={0.08} fov={32}>
    <group position={[0, 0.08 + 0.25 * Math.sin(flip * P), 0]} rotation={[flip * P, 0, 0]}>
      <RBox s={[0.8, 0.06, 0.8]} r={0.03}>{masaMat()}</RBox>
      {[0, 1, 2, 3].map((i) => <group key={i} rotation={[0, -i * P2, 0]}><group position={[0, 0.035 + 0.012 * i * fl(i), 0.4]} rotation={[P2 - (P - 0.08) * fl(i), 0, 0]}>
        <mesh geometry={triGeo} rotation={[0, 0, 0]} position={[0, 0, -0.025]} castShadow>{masaMat(i % 2 ? "#eed8ae" : MASA)}</mesh></group></group>)}
    </group>
    {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.6, 0.003, (rn(i, 2) - 0.5) * 1.2]} rotation={[-P2, 0, 0]} scale={0.012 + 0.018 * rn(i, 3)}><circleGeometry args={[1, 8]} /><meshStandardMaterial color="#fbf6ea" transparent opacity={0.35} /></mesh>)}
  </Estudio>;
}}</Stage>;

// ── 15 · CANASTO: el bollo cae en el canasto de mimbre enharinado; el canasto se da vuelta y lo deja con los anillos de harina marcados
const anilloTex = () => ctex("b_anillos", 256, 256, (g) => { g.fillStyle = "#e9d3a6"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(255,252,240,.9)"; for (let r = 14; r < 128; r += 15) { g.lineWidth = 5; g.beginPath(); g.arc(128, 128, r, 0, 7); g.stroke(); } });
const H15Canasto: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const drop = fall(tt, 0.5, 1.2), flip = eio(tt, 2.8, 3.8), lift = eio(tt, 3.9, 4.8), rev = cl((tt - 4.2) / 0.6);
  return <Estudio t={tt} cam={[0.3, 1.25, 2.1]} look={[0, 0.3, 0]} orbit={0.1}>
    <group position={[0, 0.3 + 0.8 * lift, 0]} rotation={[flip * P, 0, 0]}>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0, -0.2 + i * 0.045, 0]}><torusGeometry args={[0.28 + i * 0.03, 0.022, 8, 48]} />{M.madera("#c49a5a")}</mesh>)}
      <mesh position={[0, -0.22, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.28, 40]} />{M.madera("#c49a5a")}</mesh>
      {lift < 0.05 && <Masa p={[0, -0.18 + 0.12 * Math.min(1, drop), 0]} r={0.3} rise={0.8} t={tt} />}
    </group>
    {lift > 0.02 && <group position={[0, 0.0, 0]}>
      <mesh position={[0, 0.0, 0]} scale={[0.33, 0.24, 0.33]} castShadow><sphereGeometry args={[1, 48, 24, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color="#efdcb4" map={anilloTex()} roughness={0.8} transparent opacity={0.4 + 0.6 * rev} /></mesh>
    </group>}
  </Estudio>;
}}</Stage>;

// ── 16 · ESCAPE: el horno de casa con el pan en su nube; la puerta se abre y la nube se escapa: la corteza se apaga y se agrieta
const H16Escape: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#1c120c">{(tt) => {
  const door = eio(tt, 1.6, 2.2) * (1 - eio(tt, 3.6, 4.2)), lost = cl((tt - 1.8) / 1.6);
  return <Estudio t={tt} cam={[0.4, 1.0, 2.6]} look={[0, 0.6, 0]} orbit={0.1}>
    <RBox p={[0, 0.6, -0.1]} s={[1.3, 1.0, 0.9]} r={0.04}><meshStandardMaterial color="#2a2624" roughness={0.6} metalness={0.4} side={THREE.BackSide} /></RBox>
    <pointLight position={[0, 0.95, 0.1]} intensity={1.8} distance={2} color="#ffb070" />
    <Hogaza p={[0, 0.3, -0.1]} s={0.8} bake={0.55 - 0.15 * lost} open={1 - 0.6 * lost} rise={1 - 0.15 * lost} flour={0.2} />
    <Vapor t={tt} p={[0, 0.5, -0.1]} o={0.5 * (1 - lost)} h={0.35} s={0.45} spread={0.45} n={14} />
    <Vapor t={tt} p={[0, 0.7, 0.45 + 0.6 * lost]} o={0.55 * door} h={1.3} s={0.5} spread={0.4} n={14} />
    <group position={[0, 0.12, 0.36]} rotation={[-1.45 * door, 0, 0]}>
      <RBox p={[0, 0.07, 0.02]} s={[1.3, 0.16, 0.05]} r={0.03}>{M.hierro()}</RBox><RBox p={[0, 0.85, 0.02]} s={[1.3, 0.12, 0.05]} r={0.03}>{M.hierro()}</RBox>{[-0.56, 0.56].map((x) => <RBox key={x} p={[x, 0.45, 0.02]} s={[0.18, 0.92, 0.05]} r={0.03}>{M.hierro()}</RBox>)}
      <mesh position={[0, 0.48, 0.05]}><planeGeometry args={[0.9, 0.55]} /><meshPhysicalMaterial color="#ffd0a0" roughness={0.05} transparent opacity={0.18} depthWrite={false} /></mesh>
      <mesh position={[0, 0.82, 0.1]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.025, 0.025, 0.8, 12]} />{M.cromo()}</mesh>
    </group>
    <Placa p={[0.95, 0.08, 0.6]} rot={[-0.6, -0.3, 0]} w={0.5} h={0.12} tex={cartel("cerrada", "KEEP IT CLOSED", { size: 76, ink: "#8a2f24" })} k={ent(tt, 3.8)} />
  </Estudio>;
}}</Stage>;

// ── 17 · CUCHILLO: el pan recién salido humea; el cuchillo baja tentado y el plato del reloj lo frena: una hora
const H17Cuchillo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const tries = Math.max(0, Math.sin(cl((tt - 0.6) / 1.4) * P)) + Math.max(0, Math.sin(cl((tt - 2.4) / 1.4) * P)) * 0.8, dial = eio(tt, 0.8, 5.5);
  return <Estudio t={tt} cam={[0.3, 1.0, 2.2]} look={[0, 0.35, 0]} orbit={0.1}>
    <RBox p={[0, 0.03, 0]} s={[1.3, 0.06, 0.8]} r={0.05}>{M.madera("#9a6a3a")}</RBox>
    <Hogaza p={[-0.1, 0.2, 0]} s={0.85} bake={0.95} open={1} flour={0.3} />
    <Vapor t={tt} p={[-0.1, 0.45, 0]} o={0.4} h={1.0} s={0.4} spread={0.3} n={12} />
    <group position={[-0.1, 0.95 - 0.38 * tries, 0.05]} rotation={[0, 0.2, -0.1 + 0.05 * Math.sin(tt * 3)]}>
      <mesh><boxGeometry args={[0.9, 0.09, 0.008]} />{M.cromo()}</mesh>
      <mesh position={[0.6, 0, 0]}><boxGeometry args={[0.32, 0.07, 0.05]} />{M.madera("#3a2416")}</mesh>
    </group>
    <group position={[0.75, 0.25, 0.1]} rotation={[-0.3, -0.4, 0]}>
      <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.05, 40]} /><meshPhysicalMaterial color="#d8382a" roughness={0.3} clearcoat={1} /></mesh>
      <mesh position={[0, 0, 0.026]}><circleGeometry args={[0.17, 40]} /><meshStandardMaterial color="#fbf6e8" /></mesh>
      <mesh position={[0, 0, 0.03]}><circleGeometry args={[0.15, 40, 0, 2 * P * (1 - dial)]} /><meshStandardMaterial color="#e8c070" /></mesh>
    </group>
    <Placa p={[0.75, 0.07, 0.5]} rot={[-0.6, -0.3, 0]} w={0.42} h={0.12} tex={cartel("1h", "WAIT 1 HOUR", { size: 80 })} k={ent(tt, 1.6)} />
  </Estudio>;
}}</Stage>;

// ── 18 · LOS 5 ERRORES (bloque): la cómoda de cinco cajones; cada error abre su cajón hacia la cámara con la foto adentro y su papelito
const H18Cajones: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false} tone="#2a0f0a">{(tt) => {
  const E = IT(h), cur = Math.max(0, E.reduce((c, e, i) => (t >= e.a ? i : c), 0)), lt = t - (E[cur]?.a ?? h.at), op = eio(lt, 0.0, 0.8);
  return <Estudio t={tt} cam={[0.3, 1.35, 2.7]} look={[0, 0.85, 0.2]} orbit={0.06}>
    <RBox p={[0, 0.8, -0.2]} s={[1.3, 1.6, 0.7]} r={0.03}>{M.madera("#5a3820")}</RBox>
    {Array.from({ length: 5 }, (_, i) => { const y = 1.42 - i * 0.3, on = i === cur, z = on ? 0.55 * op : 0;
      return <group key={i} position={[0, y, 0.16 + z]}>
        <RBox s={[1.18, 0.26, 0.04]} r={0.02}>{M.madera(on ? "#7a5232" : "#6a4428")}</RBox>
        <mesh position={[0, 0, 0.04]}><sphereGeometry args={[0.03, 12, 10]} />{M.cromo("#b8962e")}</mesh>
        <mesh position={[-0.45, 0, 0.025]}><planeGeometry args={[0.13, 0.13]} /><meshStandardMaterial map={cartel("cn" + i, String(i + 1), { w: 128, h: 128, size: 100, ink: "#b8281c" })} /></mesh>
        {on && <group position={[0, 0.08, -0.25]} rotation={[-0.5, 0, 0]}>
          <Foto3D src={img(h.imgs?.[i] ?? h.bg ?? "")} w={0.9} h={0.55} />
          {E[i] && <mesh position={[0, -0.36, 0.02]}><planeGeometry args={[0.9, 0.14]} /><meshStandardMaterial map={papel("b_err" + i, [E[i].tx], { w: 1024, h: 160, size: 100 })} roughness={0.9} /></mesh>}
        </group>}
      </group>; })}
    <pointLight position={[0, 1.6, 1.4]} intensity={2.2} distance={3} color="#ffe0b0" />
  </Estudio>;
}}</Stage>;

// ── 19 · GLOBO (CTA2): el globo terráqueo gira y en cada país brota un frasquito de masa de la abuela; la pregunta en el pie de madera
const globoTex = () => ctex("b_globo", 1024, 512, (g) => { g.fillStyle = "#3d6a86"; g.fillRect(0, 0, 1024, 512); g.fillStyle = "#c9b27a";
  const L: [number, number, number, number][] = [[230, 150, 120, 80], [280, 330, 70, 110], [520, 140, 90, 60], [560, 280, 80, 110], [720, 150, 170, 80], [820, 360, 70, 45], [180, 90, 60, 30]];
  for (const [x, y, rx, ry] of L) { g.beginPath(); g.ellipse(x, y, rx, ry, 0.3, 0, 7); g.fill(); }
  for (let i = 0; i < 200; i++) { g.fillStyle = `rgba(255,255,255,${0.05 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 1024, rn(i, 3) * 512, 20, 2); } });
const H19Globo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const spin = tt * 0.5;
  const J: [number, number][] = [[0.6, 0.3], [-0.2, 0.5], [2.4, 0.4], [1.6, -0.3], [3.4, 0.2], [-1.2, 0.1], [4.4, -0.5]];
  return <Estudio t={tt} cam={[0, 1.15, 3.0]} look={[0, 0.75, 0]} orbit={0.06}>
    <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.32, 0.38, 0.12, 40]} />{M.madera("#5a3a22")}</mesh>
    <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.03, 0.04, 0.6, 12]} />{M.cromo("#b8962e")}</mesh>
    <mesh position={[0, 0.95, 0]} rotation={[0, 0, 0.4]}><torusGeometry args={[0.6, 0.015, 8, 64, P]} />{M.cromo("#b8962e")}</mesh>
    <group position={[0, 0.95, 0]} rotation={[0, 0, 0.4]}><group rotation={[0, spin, 0]}>
      <mesh castShadow><sphereGeometry args={[0.55, 64, 48]} /><meshPhysicalMaterial map={globoTex()} roughness={0.35} clearcoat={0.8} /></mesh>
      {J.map(([lo, la], i) => { const k = sp(tt, 0.8 + i * 0.55), v = new THREE.Vector3().setFromSphericalCoords(0.56, P2 - la, lo);
        return <group key={i} position={v.toArray() as V3} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize())} scale={0.001 + Math.max(0, k) * 0.26}>
          <Frasco nivel={0.6} c="#cdb48a" />
        </group>; })}
    </group></group>
    <Placa p={[0, 0.1, 0.42]} rot={[-0.4, 0, 0]} w={0.86} h={0.14} tex={cartel("gran", "WHAT DID SHE CALL IT?", { size: 66, w: 900 })} k={ent(tt, 1.2)} />
  </Estudio>;
}}</Stage>;

// ── 20 · CIELO (bloque): la panadería en miniatura bajo un arco de cielo; el sol se pone, la luna cruza y el sol vuelve, una hora por paso
const H20Cielo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} tone="#141826">{(tt) => {
  const E = IT(h), cur = Math.max(0, E.reduce((c, e, i) => (t >= e.a ? i : c), 0)), N = Math.max(1, E.length - 1);
  const pos = E.reduce((s, e, i) => i === 0 ? 0 : s + eio(tt, e.a - h.at - 0.2, e.a - h.at + 0.8), 0) / N, ang = P - pos * P;
  const night = cl(1 - Math.abs(pos - 0.5) * 2.6), x = Math.cos(ang) * 1.25, y = 0.25 + Math.sin(ang) * 1.05, sun = pos < 0.18 || pos > 0.82;
  return <Estudio t={tt} cam={[0, 1.05, 3.0]} look={[0, 0.75, 0]} orbit={0.05}>
    <mesh position={[0, 0.25, -0.3]}><torusGeometry args={[1.25, 0.006, 6, 96, P]} /><meshBasicMaterial color="#ffe6b0" transparent opacity={0.35} /></mesh>
    <group position={[x, y, -0.3]}>
      <mesh><sphereGeometry args={[0.13, 32, 24]} /><meshStandardMaterial color={sun ? "#ffd27a" : "#eef0f8"} emissive={sun ? "#ffb040" : "#dfe6ff"} emissiveIntensity={1.2} toneMapped={false} /></mesh>
      <pointLight intensity={2} distance={4} color={sun ? "#ffc070" : "#b8c8ff"} />
    </group>
    <group position={[0, 0, 0]}>
      <RBox p={[0, 0.25, 0]} s={[0.7, 0.5, 0.5]} r={0.02}><meshStandardMaterial color="#e8dcc0" roughness={0.9} /></RBox>
      <mesh position={[0, 0.62, 0]} rotation={[0, P / 4, 0]}><coneGeometry args={[0.52, 0.28, 4]} /><meshStandardMaterial color="#a8482a" roughness={0.8} /></mesh>
      <RBox p={[0.2, 0.75, 0]} s={[0.1, 0.28, 0.1]} r={0.01}><meshStandardMaterial color="#c8b898" roughness={0.9} /></RBox>
      <mesh position={[0, 0.25, 0.252]}><planeGeometry args={[0.18, 0.18]} /><meshStandardMaterial color="#2a1a10" emissive="#ffb050" emissiveIntensity={0.3 + 2.0 * night} toneMapped={false} /></mesh>
      <Vapor t={tt} p={[0.2, 0.9, 0]} o={0.3 * cl((pos - 0.45) * 4)} h={0.8} s={0.15} spread={0.08} n={8} />
    </group>
    {E.map((e, i) => <Placa key={i} p={[0, 0.07, 0.62]} rot={[-0.6, 0, 0]} w={0.6} h={0.13} tex={cartel("cl" + i, e.tx, { size: 80, w: 640 })} k={i === cur ? ent(tt, e.a - h.at) : 0} />)}
  </Estudio>;
}}</Stage>;

// ── 21 · HIELO 1971: la fuente de la plaza corre; el frío la detiene: los chorros se vuelven carámbanos y el agua del pilón, hielo
const fuenteGeo = lathe([[0.001, 0], [0.85, 0], [0.9, 0.06], [0.9, 0.3], [0.82, 0.3], [0.8, 0.08], [0.001, 0.08]], 64);
const H21Hielo: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} tone="#141c26">{(tt) => {
  const fz = eio(tt, 1.6, 4.0);
  return <Estudio t={tt} cam={[0.3, 1.35, 2.9]} look={[0, 0.5, 0]} orbit={0.1}>
    <mesh geometry={fuenteGeo} castShadow receiveShadow><meshStandardMaterial color="#b8ab94" roughness={0.9} /></mesh>
    <mesh position={[0, 0.26, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.81, 64]} /><meshPhysicalMaterial color={new THREE.Color("#5a8aa0").lerp(new THREE.Color("#e8f2f8"), fz)} roughness={lerp(0.05, 0.5, fz)} clearcoat={1} /></mesh>
    <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.12, 0.16, 0.7, 24]} /><meshStandardMaterial color="#b8ab94" roughness={0.9} /></mesh>
    {[0, 1, 2, 3].map((i) => { const a = i * P2 + 0.4, x = Math.cos(a) * 0.15, z = Math.sin(a) * 0.15, x2 = Math.cos(a) * 0.5, z2 = Math.sin(a) * 0.5;
      return <group key={i}>
        {fz < 0.9 && <Chorro a={[x, 0.85, z]} b={[x2, 0.28, z2]} r={0.02} c="#cfe6f0" o={0.7 * (1 - fz)} t={tt} />}
        <mesh position={[(x + x2) / 2, 0.58, (z + z2) / 2]} rotation={[Math.sin(a) * 0.8, 0, -Math.cos(a) * 0.8]} scale={[1, 0.001 + fz, 1]}><coneGeometry args={[0.035, 0.55, 8]} /><meshPhysicalMaterial color="#e8f6ff" roughness={0.05} transmission={0.7} clearcoat={1} transparent opacity={0.9} /></mesh>
      </group>; })}
    {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * 2 * P; return <mesh key={i} position={[Math.cos(a) * 0.88, 0.3 - 0.1 * fz, Math.sin(a) * 0.88]} scale={[1, 0.001 + fz, 1]} rotation={[P, 0, 0]}><coneGeometry args={[0.02, 0.2, 6]} /><meshPhysicalMaterial color="#e8f6ff" roughness={0.05} transmission={0.7} clearcoat={1} /></mesh>; })}
    <Placa p={[0.9, 0.07, 0.75]} rot={[-0.6, -0.3, 0]} w={0.36} h={0.13} tex={cartel("1971", "1971", { size: 110 })} k={ent(tt, 2.6)} />
  </Estudio>;
}}</Stage>;

// ── 22 · LADRILLOS: la masa duerme fría en la artesa; llegan los ladrillos calientes envueltos en saco, brillan y la masa despierta
const H22Ladrillos: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#1c120c">{(tt) => {
  const warm = cl((tt - 3.2) / 3), B: V3[] = [[-0.75, 0.1, 0], [0.75, 0.1, 0], [0, 0.1, 0.48], [0, 0.1, -0.48], [-0.5, 0.1, 0.42], [0.5, 0.1, -0.42]];
  return <Estudio t={tt} cam={[0.4, 1.3, 2.4]} look={[0, 0.2, 0]} orbit={0.1}>
    <RBox p={[0, 0.16, 0]} s={[1.1, 0.3, 0.6]} r={0.03}>{M.madera("#6a4428")}</RBox>
    <mesh position={[0, 0.3, 0]} scale={[0.5, 0.02 + 0.1 * warm, 0.26]}><sphereGeometry args={[1, 32, 16, 0, 2 * P, 0, P2]} />{masaMat()}</mesh>
    {B.map((b, i) => { const a = 0.5 + i * 0.4, k = ent(tt, a), rot = (i % 2 ? 0 : P2) + (i > 3 ? 0.4 : 0);
      return <group key={i} position={[b[0], 0.08 + 0.7 * (1 - k), b[2]]} rotation={[0, i < 2 ? P2 : rot, 0]}>
        <RBox s={[0.36, 0.14, 0.18]} r={0.02}><meshStandardMaterial color="#b8482a" roughness={0.9} emissive="#ff4a10" emissiveIntensity={0.15 + 0.5 * warm} /></RBox>
        <mesh scale={[1.08, 1.15, 1.2]}><boxGeometry args={[0.36, 0.14, 0.12]} /><Yute /></mesh>
      </group>; })}
    {Array.from({ length: 8 }, (_, i) => { const q = (tt * 0.4 + rn(i, 1)) % 1; return <mesh key={"w" + i} position={[(rn(i, 2) - 0.5) * 1.4, 0.35 + q * 0.5, (rn(i, 3) - 0.5) * 0.8]} scale={[0.2, 0.05, 1]}><planeGeometry args={[1, 1]} /><meshBasicMaterial color="#ffb070" transparent opacity={0.1 * warm * Math.sin(q * P)} depthWrite={false} /></mesh>; })}
    <pointLight position={[0, 0.5, 0.4]} intensity={0.5 + 2 * warm} distance={2.5} color="#ff9a50" />
  </Estudio>;
}}</Stage>;

// ── 23 · ALGODÓN: el pan alto de Teodoro y la hogaza de Aurelio; pasa el día: el de la máquina se vuelve un copo de algodón, la hogaza sigue
const H23Algodon: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const d = eio(tt, 0.8, 5.8), cot = cl((d - 0.35) / 0.4), ph = d < 0.33 ? 0 : d < 0.7 ? 1 : 2;
  return <Estudio t={tt} cam={[0, 1.2, 2.8]} look={[0, 0.55, 0]} orbit={0.08}>
    <mesh position={[Math.cos(P - d * P) * 1.4, 0.4 + Math.sin(P - d * P) * 0.9, -0.6]}><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color="#ffd27a" emissive="#ffb040" emissiveIntensity={1.2} toneMapped={false} /></mesh>
    <RBox p={[0, 0.03, 0]} s={[1.9, 0.06, 0.8]} r={0.03}>{M.madera("#9a6a3a")}</RBox>
    <group position={[-0.5, 0.06, 0]}>
      <RBox p={[0, 0.28, 0]} s={[0.42, 0.5 * (1 - cot) + 0.01, 0.34]} r={0.12}><meshPhysicalMaterial color="#f2e2c0" roughness={0.6} /></RBox>
      {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.3, 0.14 + rn(i, 2) * 0.2, (rn(i, 3) - 0.5) * 0.25]} scale={0.001 + cot * (0.07 + 0.05 * rn(i, 4))}><sphereGeometry args={[1, 16, 12]} /><meshPhysicalMaterial color="#fbfbf8" roughness={1} sheen={1} sheenColor="#ffffff" /></mesh>)}
    </group>
    <Hogaza p={[0.5, 0.2, 0]} s={0.8} bake={0.9} open={1} flour={0.3} />
    {["7 AM", "LUNCH", "NEXT DAY"].map((w, i) => <Placa key={w} p={[0, 0.07, 0.48]} rot={[-0.6, 0, 0]} w={0.46} h={0.12} tex={cartel("al" + i, w, { size: 90 })} k={ph === i ? 1 : 0} />)}
  </Estudio>;
}}</Stage>;

// ── 24 · TAZAS: dos tazas de vidrio; en una la harina cae suelta y aireada, en la otra se aprieta con la cuchara: 120 contra 160
const tazaGeo = lathe([[0.001, 0], [0.2, 0], [0.24, 0.42], [0.25, 0.44]], 40);
const H24Tazas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const f = eio(tt, 0.5, 2.0), press = Math.max(0, Math.sin(cl((tt - 2.2) / 0.6) * P)) + Math.max(0, Math.sin(cl((tt - 2.9) / 0.6) * P)), dens = eio(tt, 2.2, 3.6);
  return <Estudio t={tt} cam={[0, 1.0, 2.1]} look={[0, 0.35, 0]} orbit={0.1}>
    {[-0.45, 0.45].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <mesh geometry={tazaGeo}>{M.vidrio()}</mesh>
      <mesh position={[0, 0.2 * f, 0]} scale={[1, 0.001 + f, 1]}><cylinderGeometry args={[0.235, 0.2, 0.4, 32]} /><meshStandardMaterial color={i ? new THREE.Color("#f7f2e6").lerp(new THREE.Color("#e8dcc4"), dens).getStyle() : "#fbf8f0"} roughness={1} transparent opacity={i ? 0.95 : 0.8} /></mesh>
      {i === 0 && Array.from({ length: 18 }, (_, j) => <mesh key={j} position={[(rn(j, 1) - 0.5) * 0.3, 0.05 + rn(j, 2) * 0.35 * f, (rn(j, 3) - 0.5) * 0.3]} scale={0.015}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#d8d0c0" /></mesh>)}
    </group>)}
    <Cuchara p={[0.45, 0.62 - 0.12 * press, 0]} rot={[0, 0, P2 * 0.95]} s={1.1} />
    <Placa p={[-0.45, 0.07, 0.42]} w={0.36} h={0.12} tex={cartel("120", "120 g", { size: 110 })} k={ent(tt, 2.0)} />
    <Placa p={[0.45, 0.07, 0.42]} w={0.36} h={0.12} tex={cartel("160", "160 g", { size: 110, ink: "#8a2f24" })} k={ent(tt, 3.6)} />
  </Estudio>;
}}</Stage>;

// ── 25 · QUEMADO: corte del horno; la resistencia de abajo pone negra la base del pan; entra una placa debajo y el pan sube un estante
const H25Quemado: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#1c100a">{(tt) => {
  const burn = cl((tt - 0.5) / 2.0) * (1 - 0.3 * eio(tt, 2.8, 3.6)), sheet = eio(tt, 2.6, 3.4), up = eio(tt, 3.8, 4.8);
  return <Estudio t={tt} cam={[0.35, 0.95, 2.5]} look={[0, 0.6, 0]} orbit={0.1}>
    <RBox p={[0, 0.7, -0.1]} s={[1.4, 1.2, 0.9]} r={0.04}><meshStandardMaterial color="#2a2624" roughness={0.6} metalness={0.4} side={THREE.BackSide} /></RBox>
    {[0, 1, 2].map((i) => <mesh key={i} position={[-0.4 + i * 0.4, 0.16, -0.1]} rotation={[P2, 0, 0]}><torusGeometry args={[0.16, 0.012, 8, 32]} /><meshStandardMaterial color="#401810" emissive="#ff3a10" emissiveIntensity={1.8} toneMapped={false} /></mesh>)}
    <group position={[0, 0.42 + 0.3 * up, -0.1]}>
      <mesh><boxGeometry args={[1.2, 0.015, 0.7]} />{M.cromo("#8a8a88")}</mesh>
      <Hogaza p={[0, 0.0, 0]} s={0.7} bake={0.8} open={1} flour={0.2} />
      <mesh position={[0, 0.012, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.36, 40]} /><meshStandardMaterial color="#1a0e08" transparent opacity={0.9 * burn} /></mesh>
    </group>
    <mesh position={[lerp(1.6, 0, sheet), 0.3 + 0.3 * up, -0.1]}><boxGeometry args={[1.2, 0.02, 0.7]} />{M.cromo("#c8ccd0")}</mesh>
    <pointLight position={[0, 0.25, 0.3]} intensity={2.5 * (1 - 0.6 * sheet)} distance={1.6} color="#ff6a30" />
    <Placa p={[0.95, 0.08, 0.6]} rot={[-0.6, -0.3, 0]} w={0.5} h={0.12} tex={cartel("shelf", "ONE SHELF HIGHER", { size: 70 })} k={ent(tt, 4.2)} />
  </Estudio>;
}}</Stage>;

// ── 26 · SOLDADO: el pan chato se infla y se para alto; a su lado, el soldadito de plomo hace el saludo
const H26Soldado: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const up = sp(tt, 1.0), sal = eio(tt, 2.8, 3.4);
  return <Estudio t={tt} cam={[0.2, 0.9, 2.1]} look={[0, 0.45, 0]} orbit={0.1}>
    <RBox p={[0, 0.03, 0]} s={[1.5, 0.06, 0.8]} r={0.03}>{M.madera("#9a6a3a")}</RBox>
    <group position={[-0.25, 0.06, 0]} scale={[lerp(1.35, 0.95, cl(up)), lerp(0.4, 1.25, up), lerp(1.35, 0.95, cl(up))]}><Hogaza p={[0, 0.0, 0]} s={0.8} bake={0.85} open={cl(up)} flour={0.3} /></group>
    <group position={[0.45, 0.06, 0]} scale={ent(tt, 0.4) + 0.001}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.1, 0.1, 0.03, 24]} /><meshStandardMaterial color="#3a5a2a" roughness={0.6} /></mesh>
      {[-0.035, 0.035].map((x) => <mesh key={x} position={[x, 0.17, 0]}><cylinderGeometry args={[0.028, 0.028, 0.2, 12]} /><meshPhysicalMaterial color="#1a2a4a" roughness={0.3} clearcoat={1} /></mesh>)}
      <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.075, 0.07, 0.2, 16]} /><meshPhysicalMaterial color="#b8281c" roughness={0.3} clearcoat={1} /></mesh>
      <mesh position={[0, 0.5, 0]}><sphereGeometry args={[0.055, 16, 12]} /><meshStandardMaterial color="#f0c8a0" roughness={0.5} /></mesh>
      <mesh position={[0, 0.62, 0]}><cylinderGeometry args={[0.05, 0.055, 0.16, 16]} /><meshPhysicalMaterial color="#141414" roughness={0.4} clearcoat={1} /></mesh>
      <mesh position={[-0.09, 0.35, 0]}><cylinderGeometry args={[0.02, 0.02, 0.16, 8]} /><meshPhysicalMaterial color="#b8281c" roughness={0.3} clearcoat={1} /></mesh>
      <group position={[0.08, 0.44, 0]} rotation={[0, 0, lerp(0.1, 2.5, sal)]}><mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.02, 0.02, 0.16, 8]} /><meshPhysicalMaterial color="#b8281c" roughness={0.3} clearcoat={1} /></mesh></group>
    </group>
  </Estudio>;
}}</Stage>;

// ── 27 · ETIQUETAS: la panificadora y la batidora con sus etiquetas de precio colgando bajan al fondo; el bol viejo de 2 dólares sube a la luz
const etiqueta = (k: string, tx: string) => papel("b_et" + k, [tx], { w: 256, h: 160, size: 90, bg: "#f2e8cc", ink: "#8a2f24", font: "900 90px Georgia, serif" });
const H27Etiquetas: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const sink = 0.55 * eio(tt, 3.0, 4.0), bowl = sp(tt, 3.4);
  const Tag = ({ p, k, tx, a }: { p: V3; k: string; tx: string; a: number }) => <group position={p} rotation={[0, 0, 0.25 * Math.sin(tt * 2 + a) * (1 - cl(tt - a - 2))]} scale={ent(tt, a) + 0.001}>
    <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.003, 0.003, 0.24, 4]} /><meshBasicMaterial color="#6a5a4a" /></mesh>
    <mesh position={[0, -0.32, 0]}><planeGeometry args={[0.32, 0.2]} /><meshStandardMaterial map={etiqueta(k, tx)} roughness={0.9} side={THREE.DoubleSide} /></mesh></group>;
  return <Estudio t={tt} cam={[0, 1.2, 3.2]} look={[0, 0.5, 0]} orbit={0.08}>
    <group position={[-0.7, -0.6 * sink, -0.3 * sink]}>
      <RBox p={[0, 0.25, 0]} s={[0.45, 0.42, 0.35]} r={0.06}><meshPhysicalMaterial color="#e8e8ea" roughness={0.3} clearcoat={1} /></RBox>
      <mesh position={[0, 0.465, 0]}><boxGeometry args={[0.25, 0.01, 0.18]} />{M.vidrio()}</mesh>
      <Tag p={[0.24, 0.46, 0.18]} k="150" tx="$150" a={0.6} />
    </group>
    <group position={[0, -0.7 * sink, -0.3 * sink]}>
      <RBox p={[0, 0.06, 0]} s={[0.4, 0.1, 0.3]} r={0.04}><meshPhysicalMaterial color="#5a7aa0" roughness={0.3} clearcoat={1} /></RBox>
      <RBox p={[-0.14, 0.35, 0]} s={[0.12, 0.55, 0.2]} r={0.05}><meshPhysicalMaterial color="#5a7aa0" roughness={0.3} clearcoat={1} /></RBox>
      <RBox p={[0.02, 0.6, 0]} s={[0.42, 0.14, 0.2]} r={0.06}><meshPhysicalMaterial color="#5a7aa0" roughness={0.3} clearcoat={1} /></RBox>
      <mesh position={[0.06, 0.24, 0]}><cylinderGeometry args={[0.15, 0.1, 0.22, 24, 1, true]} />{M.cromo()}</mesh>
      <Tag p={[0.24, 0.6, 0.12]} k="300" tx="$300" a={1.6} />
    </group>
    <group position={[0.7, 0.0 + 0.1 * Math.max(0, bowl), 0.15]} scale={0.001 + Math.max(0, bowl) * 1.0}>
      <Bol />
      <Tag p={[0.45, 0.42, 0.1]} k="2" tx="$2" a={3.8} />
    </group>
    <pointLight position={[0.7, 1.3, 0.6]} intensity={2.5 * ent(tt, 3.4)} distance={2.2} color="#ffd9a0" />
  </Estudio>;
}}</Stage>;

// ── 28 · HUEVO: de la masa se estira y se corta un pedazo del tamaño de un huevo; al lado del huevo, igual; salta a su frasquito
const H28Huevo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const pull = eio(tt, 0.5, 1.6), cut = tt > 1.6, hop = eio(tt, 3.6, 4.6);
  const px = lerp(-0.3, 0.15, pull), pjx = lerp(0.15, 0.62, hop), py = 0.09 + 0.5 * Math.sin(hop * P) + 0.28 * hop;
  return <Estudio t={tt} cam={[0.1, 1.0, 2.0]} look={[0.1, 0.25, 0]} orbit={0.1}>
    <RBox p={[0, 0.03, 0]} s={[1.7, 0.06, 0.8]} r={0.03}>{M.madera("#9a6a3a")}</RBox>
    <Masa p={[-0.45, 0.06, 0]} r={0.36} rise={0.8} t={tt} />
    {!cut && <mesh position={[(-0.3 + px) / 2, 0.14, 0]} rotation={[0, 0, P2]} scale={[1, 0.001 + pull, 1]}><cylinderGeometry args={[0.03, 0.045, 0.45, 12]} />{masaMat()}</mesh>}
    <mesh position={[cut ? pjx : px, cut ? py : 0.12, 0]} scale={[0.1, 0.08, 0.08]} castShadow><sphereGeometry args={[1, 24, 16]} />{masaMat()}</mesh>
    <mesh position={[0.15, 0.12, 0.25]} scale={[0.075, 0.1, 0.075]} rotation={[0, 0, 0.3]} castShadow><sphereGeometry args={[1, 24, 16]} /><meshPhysicalMaterial color="#e8c8a0" roughness={0.5} clearcoat={0.3} /></mesh>
    <Frasco p={[0.62, 0.06, 0]} s={0.42} nivel={0.25 * hop} c="#cdb48a" tapa={tt > 4.8} />
    <Placa p={[0.15, 0.07, 0.48]} rot={[-0.6, 0, 0]} w={0.36} h={0.12} tex={cartel("100g", "100 g", { size: 110 })} k={ent(tt, 2.2)} />
  </Estudio>;
}}</Stage>;

// ── 29 · ANILLOS: la hogaza abierta muestra en la miga anillos como un tronco, uno por año, que se dibujan desde el centro
const anillosTex = (n: number) => ctex("b_tronco" + n, 512, 512, (g) => { g.fillStyle = "#efdcb2"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 220; i++) { const r = 1 + rn(i, 4) ** 3 * 8; g.fillStyle = `rgba(150,110,60,${0.15 + 0.25 * rn(i, 5)})`; g.beginPath(); g.ellipse(rn(i, 1) * 512, rn(i, 2) * 512, r * 1.3, r, 0, 0, 7); g.fill(); }
  for (let k = 1; k <= n; k++) { g.strokeStyle = k % 5 ? "rgba(150,96,44,.55)" : "rgba(120,70,30,.85)"; g.lineWidth = k % 5 ? 2.5 : 4.5; g.beginPath(); g.ellipse(256, 300, k * 6.0, k * 4.8, 0, 0, 7); g.stroke(); } });
const H29Anillos: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const n = Math.round(cl((tt - 0.8) / 4) * 40), open = eio(tt, 0.2, 1.0);
  return <Estudio t={tt} cam={[0.1, 0.95, 2.05]} look={[0.1, 0.15, 0]} orbit={0.06} fov={34}>
    <RBox p={[0, 0.03, 0]} s={[1.6, 0.06, 0.9]} r={0.03}>{M.madera("#9a6a3a")}</RBox>
    <group position={[0, 0.06, -0.05 - 0.25 * open]}>
      <mesh scale={[0.52, 0.42, 1]}><circleGeometry args={[1, 64, 0, P]} /><meshStandardMaterial map={anillosTex(n)} roughness={0.95} /></mesh>
      <mesh scale={[0.52, 0.42, 0.45]} rotation={[0, P, 0]}><sphereGeometry args={[1.005, 48, 24, 0, P, 0, P2]} /><meshPhysicalMaterial color={corteza(0.95)} roughness={0.75} side={THREE.DoubleSide} /></mesh>
    </group>
    <group position={[0.2 + 0.5 * open, 0.06, 0.05 - 0.1 * open]} rotation={[0, -0.9 * open, 0]}><mesh scale={[0.52, 0.42, 0.45]}><sphereGeometry args={[1, 48, 24, 0, P, 0, P2]} /><meshPhysicalMaterial color={corteza(0.95)} roughness={0.75} side={THREE.DoubleSide} /></mesh></group>
    <Placa p={[-0.45, 0.07, 0.4]} rot={[-0.6, 0.2, 0]} w={0.42} h={0.12} tex={cartel("40y", "40 YEARS", { size: 100 })} k={ent(tt, 3.6)} />
  </Estudio>;
}}</Stage>;

// ── 30 · CAMINO (bloque resumen): un sendero de piedras planas en curva; una hogacita salta de piedra en piedra y cada piedra tiene su paso
const H30Camino: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const E = IT(h), N = Math.max(1, E.length), pt = (i: number): V3 => [-1.0 + (i / (N - 1)) * 2.0, 0.04, 0.22 * Math.sin(i * 1.2) - 0.08 * i];
  const cur = Math.max(0, E.reduce((c, e, i) => (t >= e.a ? i : c), 0)), lt = t - (E[cur]?.a ?? h.at), j = eio(lt, 0, 0.6);
  const a = pt(Math.max(0, cur - 1)), b = pt(cur), x = cur === 0 ? b[0] : lerp(a[0], b[0], j), z = cur === 0 ? b[2] : lerp(a[2], b[2], j), y = 0.12 + 0.35 * Math.sin(j * P) * (cur ? 1 : 0);
  const wide = eio(t, (E[N - 1]?.a ?? h.at) + 2.0, (E[N - 1]?.a ?? h.at) + 3.5);
  return <Estudio t={tt} cam={[lerp(x + 0.15, 0, wide), lerp(0.75, 1.25, wide), lerp(z + 1.0, 1.9, wide)]} look={[lerp(x, 0, wide), 0.02, lerp(z - 0.05, -0.3, wide)]} orbit={0.04} fov={36}>
    {E.map((e, i) => { const p = pt(i), k = ent(tt, e.a - h.at - 0.3);
      return <group key={i} position={p} scale={0.001 + (i <= cur ? k : 0.6)}>
        <mesh scale={[1.25, 0.25, 0.95]} castShadow receiveShadow><sphereGeometry args={[0.22, 32, 16, 0, 2 * P, 0, P2]} /><meshStandardMaterial color={i <= cur ? "#a89a84" : "#6a6050"} roughness={0.95} /></mesh>
        <mesh position={[0, 0.1, 0.2]} rotation={[-0.75, 0, 0]}><planeGeometry args={[0.46, 0.14]} /><meshStandardMaterial map={papel("b_cam" + i, [e.tx], { w: 640, h: 196, size: 96, bg: "#e9dfc8" })} transparent opacity={i <= cur ? 1 : 0} roughness={0.9} /></mesh>
      </group>; })}
    <Hogaza p={[x, y, z]} s={0.3} bake={0.9} open={1} flour={0.3} />
  </Estudio>;
}}</Stage>;

// ── 31 · PANECILLOS (lo que viene): del bol saltan doce bollitos dorados, uno tras otro, y caen en fila sobre la placa
const H31Panecillos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  return <Estudio t={tt} cam={[0.2, 1.3, 2.4]} look={[0, 0.3, 0]} orbit={0.1}>
    <mesh position={[0.35, 0.02, 0]}><boxGeometry args={[1.25, 0.03, 0.95]} />{M.cromo("#8a8a88")}</mesh>
    <Bol p={[-0.75, 0, 0]} s={0.5}><Masa p={[0, 0.06, 0]} r={0.55} rise={0.9} t={tt} /></Bol>
    {Array.from({ length: 12 }, (_, i) => { const a = 0.4 + i * 0.32, k = cl((tt - a) / 0.55), tx = 0.35 + ((i % 4) - 1.5) * 0.28, tz = (Math.floor(i / 4) - 1) * 0.28;
      const x = lerp(-0.75, tx, k), z = lerp(0, tz, k), y = 0.25 + Math.sin(k * P) * 0.5 - 0.2 * k;
      return <mesh key={i} position={[x, y, z]} scale={[0.11, 0.08, 0.11]} visible={tt > a} castShadow><sphereGeometry args={[1, 32, 16, 0, 2 * P, 0, P2]} /><meshPhysicalMaterial color={corteza(0.55)} roughness={0.6} clearcoat={0.4} sheen={0.5} sheenColor="#ffe2b0" /></mesh>; })}
    <Placa p={[0.35, 0.06, 0.65]} rot={[-0.6, 0, 0]} w={0.46} h={0.12} tex={cartel("nw", "NEXT WEEK", { size: 96 })} k={ent(tt, 3.2)} />
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  sello: H1Sello, fichero: H2Fichero, maquina: H3Maquina, encastre: H4Encastre, jarra: H5Jarra, panqueque: H6Panqueque, cuarto: H7Cuarto,
  cadena: H8Cadena, perilla: H9Perilla, estacion: H10Estacion, aroma: H11Aroma, nevera: H12Nevera, despierta: H13Despierta, sobre: H14Sobre,
  canasto: H15Canasto, escape: H16Escape, cuchillo: H17Cuchillo, cajones: H18Cajones, globo: H19Globo, cielo: H20Cielo, hielo: H21Hielo,
  ladrillos: H22Ladrillos, algodon: H23Algodon, tazas: H24Tazas, quemado: H25Quemado, soldado: H26Soldado, etiquetas: H27Etiquetas,
  huevo: H28Huevo, anillos: H29Anillos, camino: H30Camino, panecillos: H31Panecillos,
};
