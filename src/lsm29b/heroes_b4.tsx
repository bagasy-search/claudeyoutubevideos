// lsm29b · componentes únicos 19-24 (las credenciales del turno noche, el libro de cuentas, la fuente devuelta, la soga con las cinco señales, el camino, el puré).
import React from "react";
import * as THREE from "three";
import { AMB, H, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Steam, Table, paperTex } from "./tg";
import { Book, Mug, Sky, House } from "./pg";

const PI = Math.PI;

// ---- 13:08 · ANTES DEL TURNO NOCHE: bajo la luz amarilla del garaje, dos credenciales de enfermera caen juntas sobre el capó y entre las dos se abre la Biblita ----
const badge = (name: string) => tex.text("badge" + name, 256, 360, (g) => {
  g.fillStyle = "#f7f7f4"; g.fillRect(0, 0, 256, 360); g.fillStyle = "#2c6e8a"; g.fillRect(0, 0, 256, 70);
  g.fillStyle = "#fff"; g.font = "900 30px Georgia"; g.textAlign = "center"; g.fillText("MERCY · RN", 128, 46);
  g.fillStyle = "#c9d3d8"; g.fillRect(68, 96, 120, 140); g.fillStyle = "#8a9aa3"; g.beginPath(); g.arc(128, 150, 32, 0, 6.3); g.fill(); g.fillRect(84, 190, 88, 46);
  g.fillStyle = "#1e2a30"; g.font = "800 34px Georgia"; g.fillText(name, 128, 290); g.font = "600 20px Georgia"; g.fillText("NIGHT SHIFT", 128, 326);
});
export const HNursebadges: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none" bg="#1a1c20" warm={0.85} key1={[0.2, 2.2, 0.6]}
  cam={{ at: [0, 0.6, 0.04], at1: [0.0, 0.6, 0.05], az: [-0.2, 0.08], el: [0.95, 0.88], r: [1.05, 0.92], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={1010} txt="BEFORE THE NIGHT SHIFT" col={AMB} size={40} />}>{(tt) => {
  const a = phys(tt, 0.4, 8, 0.4), b = phys(tt, 0.9, 8, 0.4), open = eio(tt, 2.2, 3.4), lamp = 0.8 + 0.05 * Math.sin(tt * 1.2);
  const page = paperTex("pbib", ["Where two or three", "are gathered together", "in my name ..."], { w: 512, h: 360, bg: "#f1e8d0", ink: "#2a2420", font: "italic 700" });
  return <>
    {/* el capó del auto (azul oscuro) y el pilar de hormigón */}
    <RBox s={[1.2, 0.04, 0.8]} r={0.03} p={[0, 0.58, 0]}><meshPhysicalMaterial color="#2c4056" roughness={0.5} clearcoat={0.2} metalness={0.2} /></RBox>
    <RBox s={[0.3, 2.2, 0.3]} r={0.01} p={[-0.85, 1.1, -0.6]}><meshStandardMaterial color="#8d8b86" roughness={0.95} /></RBox>
    <mesh position={[-0.7, 1.0, -0.449]}><planeGeometry args={[0.1, 0.2]} /><meshStandardMaterial map={paperTex("lvl", ["P3"], { w: 128, h: 256, bg: "#f2c94a", ink: "#1a1a1a", font: "900" })} roughness={0.7} /></mesh>
    <pointLight position={[-0.3, 1.6, 0.5]} intensity={1.3 * lamp} distance={3} decay={2} color="#ffc070" />
    {/* el parabrisas al fondo del capó */}
    <mesh position={[0, 0.78, -0.42]} rotation={[-0.9, 0, 0]}><planeGeometry args={[1.1, 0.45]} />{M.glass({ op: 0.15 })}</mesh>
    {/* las dos credenciales con su cinta */}
    {[{ k: a, x: -0.27, n: "JENNA", r: 0.1 }, { k: b, x: 0.27, n: "MARIA", r: -0.08 }].map((c, i) => <group key={i} position={[c.x, 0.602 + (1 - cl(c.k)) * 0.4, -0.02]} rotation={[-PI / 2, 0, c.r]}>
      <mesh castShadow><planeGeometry args={[0.22, 0.31]} /><meshStandardMaterial map={badge(c.n)} roughness={0.4} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.235, -0.001]}><planeGeometry args={[0.03, 0.16]} /><meshStandardMaterial color={i ? "#7a3a8a" : "#2f5fa8"} roughness={0.7} side={THREE.DoubleSide} /></mesh>
    </group>)}
    {/* la Biblia de bolsillo que se abre entre las dos */}
    <group position={[0, 0.6, 0.1]} rotation={[0, 0.05, 0]} scale={1.3}><Book w={0.11} h={0.16} th={0.02} col="#2a1a14" gold={false} open={open} page={page} /></group>
  </>;
}}</Scene3D>;

// ---- 13:56 · EL LIBRO DE CUENTAS: cada favor se anota como depósito y vuelve como retiro; la tinta corre sola ----
const LED: [string, string, number][] = [["MAR 3", "CASSEROLE", 1], ["MAR 21", "\"REMEMBER IT?\"", -1], ["APR 9", "RIDE TO AMES", 1], ["APR 16", "CIRCLE", -1], ["MAY 7", "CIRCLE", -1], ["MAY 28", "CIRCLE", -1]];
const ledgerTex = (n: number, part: number) => tex.text("ledg" + n + "_" + Math.round(part * 10), 1024, 1400, (g) => {
  g.fillStyle = "#eef0e0"; g.fillRect(0, 0, 1024, 1400);
  g.strokeStyle = "#9cc0a0"; g.lineWidth = 3; for (let y = 230; y < 1400; y += 180) { g.beginPath(); g.moveTo(30, y); g.lineTo(994, y); g.stroke(); }
  g.strokeStyle = "#c0504a"; g.lineWidth = 5; [300, 660].forEach((x) => { g.beginPath(); g.moveTo(x, 40); g.lineTo(x, 1380); g.stroke(); });
  g.font = "900 64px Georgia"; g.textAlign = "center"; g.fillStyle = "#2e7a3e"; g.fillText("DEPOSITS", 480, 150); g.fillStyle = "#b0322a"; g.fillText("WITHDRAWALS", 840, 150);
  LED.slice(0, n).forEach(([d, w, k], i) => {
    const y = 330 + i * 180, show = i === n - 1 ? part : 1;
    g.save(); g.beginPath(); g.rect(0, y - 110, 40 + 990 * show, 160); g.clip();
    g.textAlign = "left"; g.fillStyle = "#1e2a4a"; g.font = "800 52px Georgia"; g.fillText(d, 50, y);
    g.textAlign = "center"; g.font = "900 58px Georgia"; g.fillStyle = k > 0 ? "#2e7a3e" : "#b0322a"; g.fillText((k > 0 ? "+ " : "− ") + w, k > 0 ? 480 : 840, y);
    g.restore();
  });
});
export const HLedger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" warm={0.75}
  cam={{ at: [0.0, 0.78, 0.02], at1: [0.02, 0.78, 0.06], az: [-0.05, 0.05], el: [1.25, 1.3], r: [1.08, 0.98], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="EVERY KINDNESS, A DEPOSIT" col={AMB} size={38} />}>{(tt) => {
  const n = Math.min(LED.length, Math.max(1, Math.floor((tt - 0.4) / 0.6) + 1)), part = cl(((tt - 0.4) - (n - 1) * 0.6) / 0.5);
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.3} d={0.9} /></group>
    {/* el libro abierto, grande, con las dos columnas */}
    <RBox s={[0.56, 0.02, 0.42]} r={0.01} p={[0, 0.77, 0.02]}><meshStandardMaterial color="#2a3a2a" roughness={0.7} /></RBox>
    <mesh position={[0, 0.781, 0.02]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.28, 0.38]} /><meshStandardMaterial map={ledgerTex(n, tt < 0.4 ? 0 : part)} roughness={0.85} /></mesh>
    <mesh position={[-0.21, 0.781, 0.02]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.13, 0.38]} /><meshStandardMaterial color="#eef0e0" roughness={0.85} /></mesh>
    {/* la lapicera que corre con la tinta */}
    {tt < 4.3 && <group position={[lerp(-0.12, 0.13, part), 0.81, -0.12 + (n - 1) * 0.049]} rotation={[0.9, 0.4, 0.6]}><mesh><cylinderGeometry args={[0.007, 0.005, 0.14, 12]} /><meshPhysicalMaterial color="#1a3a2a" roughness={0.2} clearcoat={1} /></mesh></group>}
  </>;
}}</Scene3D>;

// ---- 14:10 · LA FUENTE DEVUELTA: llega llena, queda vacía, se lava y brilla, se llena de galletitas caseras y sale por la puerta al otro día ----
export const HReturndish: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.8}
  cam={{ at: [0.05, 0.85, 0.0], at1: [0.38, 0.88, 0.0], az: [0.35, 0.1], el: [0.55, 0.4], r: [1.25, 1.75], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="WASHED, AND NEVER EMPTY" col={AMB} size={40} />}>{(tt) => {
  const full = 1 - eio(tt, 0.8, 1.4), wash = eio(tt, 1.5, 2.4), shine = Math.sin(PI * cl((tt - 2.1) / 0.6)), fill = eio(tt, 2.6, 3.6), go = eio(tt, 3.9, 5.0), door = eio(tt, 3.5, 4.1);
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.4} d={0.9} /></group>
    <group position={[lerp(0, 0.55, go), 0.76 + 0.06 * Math.sin(PI * go), lerp(0, -0.04, go)]}>
      <RBox s={[0.3, 0.07, 0.2]} r={0.025} p={[0, 0.035, 0]}>{M.porcelain({ col: "#f5f1e6" })}</RBox>
      <mesh position={[0, 0.071, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.26, 0.16]} /><meshStandardMaterial color={new THREE.Color("#d7d2c6").lerp(new THREE.Color("#fbfaf6"), wash)} roughness={0.15 + 0.3 * (1 - wash)} /></mesh>
      {full > 0.02 && <mesh position={[0, 0.074, 0]} scale={[1, Math.max(0.001, full), 1]}><boxGeometry args={[0.25, 0.02, 0.15]} /><meshStandardMaterial color="#c88a48" roughness={0.5} /></mesh>}
      {/* el brillo de recién lavada */}
      {shine > 0.02 && [-0.1, -0.02, 0.07].map((x) => <mesh key={x} position={[x, 0.09, 0.02 * Math.sin(x * 40)]} scale={[1, 1, 1]}><sphereGeometry args={[0.022, 12, 8]} />{M.glow({ col: "#ffffff", op: shine })}</mesh>)}
      {/* las galletitas que caen adentro */}
      {Array.from({ length: 9 }, (_, i) => { const a = 2.6 + i * 0.1, k = phys(tt, a, 9, 0.4); return tt > a && <mesh key={i} position={[-0.09 + (i % 3) * 0.09, 0.08 + (1 - cl(k)) * 0.3 + 0.01 * Math.floor(i / 3), -0.05 + Math.floor(i / 3) * 0.05]} rotation={[0.2 * rn(i, 2), rn(i, 3), 0.2 * rn(i, 4)]}><cylinderGeometry args={[0.032, 0.032, 0.01, 20]} /><meshStandardMaterial color="#d9a35c" roughness={0.6} /></mesh>; })}
      {/* la tapa con la cinta */}
      {fill > 0.5 && <group position={[0, 0.07 + 0.12 * (1 - eio(tt, 3.5, 3.9)), 0]}><RBox s={[0.3, 0.012, 0.2]} r={0.01}>{M.glass({ op: 0.4 })}</RBox><RBox s={[0.31, 0.014, 0.02]} r={0.004} p={[0, 0.004, 0]}><meshStandardMaterial color="#b8322a" roughness={0.6} /></RBox></group>}
    </group>
    {/* el repasador que lava */}
    <group position={[lerp(-0.4, 0.0, wash) + 0.06 * Math.sin(tt * 8) * (wash > 0 && wash < 1 ? 1 : 0), 0.85 - 0.06 * Math.sin(PI * wash), 0.0]} visible={tt > 1.3 && tt < 2.6}><mesh rotation={[0.2, 0, 0.3]}><boxGeometry args={[0.12, 0.02, 0.09]} /><meshStandardMaterial map={tex.text("rag", 128, 128, (g) => { g.fillStyle = "#f2efe6"; g.fillRect(0, 0, 128, 128); g.fillStyle = "#4f78b0"; for (let i = 0; i < 4; i++) { g.fillRect(i * 32, 0, 8, 128); } })} roughness={0.95} /></mesh></group>
    {/* la puerta de la cocina que se abre a la mañana del otro día */}
    <group position={[0.95, 0, -0.1]}>
      <RBox s={[0.06, 2.1, 0.08]} r={0.01} p={[0, 1.05, -0.42]}>{M.wood({ base: [230, 225, 214] })}</RBox>
      <RBox s={[0.06, 2.1, 0.08]} r={0.01} p={[0, 1.05, 0.42]}>{M.wood({ base: [230, 225, 214] })}</RBox>
      <mesh position={[0.05, 1.0, 0]} rotation={[0, -PI / 2, 0]}><planeGeometry args={[0.8, 2.0]} /><meshBasicMaterial color="#fff4dc" transparent opacity={0.25 + 0.6 * door} toneMapped={false} /></mesh>
      <group position={[0, 0, -0.4]} rotation={[0, -1.4 * door, 0]}><RBox s={[0.04, 2.0, 0.8]} r={0.01} p={[0, 1.0, 0.4]}>{M.wood({ base: [200, 120, 80] })}</RBox></group>
      <pointLight position={[0.2, 1.2, 0]} intensity={0.2 + 1.2 * door} distance={2.2} color="#fff0d0" />
    </group>
    {/* el almanaque: el número de mañana */}
    <mesh position={[-0.5, 1.02, -0.44]}><planeGeometry args={[0.2, 0.24]} /><meshStandardMaterial map={paperTex("tom" + (tt > 3.8 ? 1 : 0), [tt > 3.8 ? "TUE" : "MON", tt > 3.8 ? "15" : "14"], { w: 200, h: 240, ink: "#7a2a22", font: "900" })} roughness={0.8} /></mesh>
  </>;
}}</Scene3D>;

// ---- 14:44 · LAS CINCO SEÑALES: cinco tarjetas numeradas se cuelgan de la soga de la ropa con broches, una por señal ----
const SIGNS = ["WHO DO THEY TALK ABOUT", "DO THEY ASK YOU", "THE WAITRESS", "HOW THEY LEAVE", "LIGHTER OR HEAVIER"];
const signTex = (i: number, s: string) => tex.text("sgn" + i, 320, 340, (g) => {
  g.fillStyle = "#f4ecd6"; g.fillRect(0, 0, 320, 340); g.strokeStyle = "#c9b48a"; g.lineWidth = 8; g.strokeRect(8, 8, 304, 324);
  g.fillStyle = "#b0322a"; g.font = "900 150px Georgia"; g.textAlign = "center"; g.fillText(String(i + 1), 160, 170);
  g.fillStyle = "#3a2412"; g.font = "900 34px Georgia";
  const ws = s.split(" "), ls: string[] = []; ws.forEach((w) => { const l = ls[ls.length - 1]; if (l && (l + " " + w).length <= 12) ls[ls.length - 1] = l + " " + w; else ls.push(w); });
  ls.forEach((l, k) => g.fillText(l, 160, 230 + k * 42));
});
export const HClothesline: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#9fb8d0" warm={0.6} key1={[-1.2, 2.6, 1.6]}
  cam={{ at: [0, 0.98, 0], at1: [0.03, 0.97, 0], az: [-0.08, 0.06], el: [0.1, 0.08], r: [1.75, 1.6], fov: 34 }}>{(tt) => <>
    <Sky /><hemisphereLight args={["#dfe9f5", "#6f7a4a", 0.6]} />
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[8, 6]} /><meshStandardMaterial color="#6f8a4a" roughness={0.95} /></mesh>
    {/* la pared de tablas de la casa, detrás de la soga */}
    <mesh position={[0, 1.2, -0.9]}><planeGeometry args={[6, 2.4]} /><meshStandardMaterial map={tex.text("siding", 512, 512, (g) => { g.fillStyle = "#ece6d8"; g.fillRect(0, 0, 512, 512); g.fillStyle = "#c9c1ae"; for (let y = 0; y < 512; y += 32) g.fillRect(0, y, 512, 4); })} roughness={0.9} /></mesh>
    <mesh position={[0.9, 1.3, -0.88]}><planeGeometry args={[0.5, 0.6]} /><meshStandardMaterial color="#3e4c5a" roughness={0.2} /></mesh>
    {[-1, 1].map((k) => <group key={k}><RBox s={[0.04, 1.2, 0.04]} r={0.006} p={[k * 0.95, 0.6, 0]}>{M.wood({ base: [120, 90, 60] })}</RBox><RBox s={[0.3, 0.035, 0.035]} r={0.006} p={[k * 0.95, 1.18, 0]}>{M.wood({ base: [120, 90, 60] })}</RBox></group>)}
    <mesh position={[0, 1.15, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.003, 0.003, 1.9, 6]} /><meshStandardMaterial color="#e6e1d4" roughness={0.8} /></mesh>
    {SIGNS.map((s, i) => { const a = 0.4 + i * 0.75, k = phys(tt, a, 7, 0.35), x = -0.68 + i * 0.34, sw = 0.25 * Math.exp(-Math.max(0, tt - a) * 1.6) * Math.sin((tt - a) * 7) + 0.03 * Math.sin(tt * 1.3 + i);
      return tt > a - 0.05 && <group key={i} position={[x, 1.15 + (1 - cl(k)) * 0.35, 0]} rotation={[sw, 0, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow><planeGeometry args={[0.26, 0.28]} /><meshStandardMaterial map={signTex(i, s)} roughness={0.85} side={THREE.DoubleSide} /></mesh>
        {/* el broche de madera */}
        <RBox s={[0.018, 0.06, 0.02]} r={0.004} p={[0, -0.01, 0.006]}>{M.wood({ base: [196, 160, 110] })}</RBox>
      </group>; })}
  </>}</Scene3D>;

// ---- 15:33 · LA SALIDA DEL CAMINO: las luces traseras se alejan por el ripio; en primer plano, las dos tazas que quedaron en la baranda ----
export const HLane: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#121318" warm={0.4} key1={[-1.0, 2.0, 1.6]}
  cam={{ at: [0.1, 0.3, -0.7], at1: [0.08, 0.3, -0.95], az: [0.1, 0.06], el: [0.24, 0.22], r: [1.7, 1.6], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={1010} txt="LIGHTER OR HEAVIER?" col={AMB} size={44} />}>{(tt) => {
  const z = lerp(-0.2, -3.2, eio(tt, 0.3, 4.6)), dust = eio(tt, 0.3, 1.5);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[6, 8]} /><meshStandardMaterial color="#3a3a2a" roughness={0.95} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.002, -1.6]}><planeGeometry args={[0.5, 6]} /><meshStandardMaterial map={tex.counter(1, 8)} color="#9a917c" roughness={0.95} /></mesh>
    {/* el auto que se va: la parte de atrás, las dos luces rojas */}
    <group position={[0, 0, z]}>
      <RBox s={[0.36, 0.14, 0.6]} r={0.04} p={[0, 0.13, 0]}><meshPhysicalMaterial color="#5a4a3a" roughness={0.35} clearcoat={0.7} /></RBox>
      <RBox s={[0.3, 0.1, 0.3]} r={0.04} p={[0, 0.24, 0.02]}><meshPhysicalMaterial color="#5a4a3a" roughness={0.35} clearcoat={0.7} /></RBox>
      {[-1, 1].map((k) => <group key={k}><mesh position={[k * 0.13, 0.16, 0.302]}><boxGeometry args={[0.08, 0.05, 0.006]} />{M.glow({ col: "#ff3a2a", op: 1 })}</mesh>
        <mesh position={[k * 0.13, 0.16, 0.31]}><sphereGeometry args={[0.07, 14, 10]} /><meshBasicMaterial color="#ff4a30" transparent opacity={0.22} depthWrite={false} toneMapped={false} /></mesh></group>)}
      <pointLight position={[0, 0.15, 0.4]} intensity={1.4} distance={1.4} color="#ff3a2a" />
    </group>
    {Array.from({ length: 30 }, (_, i) => { const ph = (tt * 0.5 + rn(i, 2)) % 1; return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.4, 0.05 + 0.2 * ph, z + 0.35 + ph * 0.6]}><sphereGeometry args={[0.03 + 0.05 * ph, 8, 6]} /><meshBasicMaterial color="#b8ad94" transparent opacity={0.12 * (1 - ph) * dust} depthWrite={false} /></mesh>; })}
    {/* en primer plano, la baranda del porche con las dos tazas que quedaron */}
    <group position={[0.36, -0.06, 0.25]}>
      <RBox s={[0.7, 0.05, 0.12]} r={0.008} p={[0, 0.42, 0]}>{M.matte({ col: "#e8e4da" })}</RBox>
      {[0.2, -0.2].map((x) => <RBox key={x} s={[0.05, 0.42, 0.05]} r={0.006} p={[x, 0.2, 0]}>{M.matte({ col: "#e8e4da" })}</RBox>)}
      {[[-0.13, "#e8dcc0", 0], [0.13, "#9fb6c9", 0.6]].map(([x, c, r], i) => <group key={i} position={[x as number, 0.445, 0]} scale={1.25}>
        <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.06, 0.055, 0.006, 32]} /><meshPhysicalMaterial color={c as string} roughness={0.35} clearcoat={0.6} /></mesh>
        <Mug p={[0, 0.006, 0]} ry={r as number} col={c as string} coffee={false} /></group>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 16:23 · «PASÁ LAS PAPAS»: la fuente de puré con su manteca derritiéndose cruza la mesa de mano en mano ----
export const HPasspotatoes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.85}
  cam={{ at: [-0.1, 0.82, 0], at1: [0.25, 0.82, 0], az: [0.05, 0.2], el: [0.6, 0.5], r: [1.25, 1.1], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={1010} txt="SHE HAS A HARD LIFE. PASS THE POTATOES." col={AMB} size={32} />}>{(tt) => {
  const pass = eio(tt, 0.6, 3.2), melt = eio(tt, 0.2, 4.5), bx = lerp(-0.5, 0.45, pass), by = 0.76 + 0.05 * Math.sin(PI * pass);
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.6} d={0.9} /></group>
    {[-0.55, -0.15, 0.25, 0.6].map((x, i) => <group key={i} position={[x, 0.76, 0.28]}><mesh position={[0, 0.007, 0]}><cylinderGeometry args={[0.1, 0.08, 0.014, 40]} />{M.porcelain()}</mesh></group>)}
    <group position={[bx, by, 0.02]}>
      <mesh position={[0, 0.045, 0]} castShadow><cylinderGeometry args={[0.13, 0.09, 0.09, 40, 1, true]} />{M.porcelain({ col: "#f3f0e8" })}</mesh>
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.09, 0.09, 0.004, 40]} />{M.porcelain()}</mesh>
      <mesh position={[0, 0.085, 0]} scale={[1, 0.38, 1]}><sphereGeometry args={[0.12, 32, 16]} /><meshStandardMaterial color="#f2ead2" roughness={0.75} /></mesh>
      {/* la manteca que se derrite */}
      <mesh position={[0, 0.128 - 0.01 * melt, 0]} scale={[1 + 0.8 * melt, Math.max(0.15, 1 - 0.8 * melt), 1 + 0.8 * melt]}><boxGeometry args={[0.035, 0.02, 0.035]} /><meshPhysicalMaterial color="#f5d36a" roughness={0.2} clearcoat={1} /></mesh>
      <mesh position={[0, 0.124, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.02 + 0.04 * melt, 24]} /><meshPhysicalMaterial color="#f0c24a" roughness={0.1} clearcoat={1} transparent opacity={0.8} /></mesh>
      <group position={[0.07, 0.1, 0]} rotation={[0, 0, -0.9]}><RBox s={[0.012, 0.16, 0.004]} r={0.002}>{M.steel()}</RBox></group>
      <Steam p={[0, 0.12, 0]} tt={tt} on={1.4} n={20} w={0.12} hgt={0.3} sz={2} />
    </group>
    {/* las manos: tres comensales se pasan la fuente, cada una la suelta cuando la toma la siguiente */}
    {[-0.5, 0.0, 0.45].map((hx, i) => { const grip = eio(cl(1 - Math.abs(bx - hx) / 0.4), 0, 1), sd = i === 0 ? -1 : 1;
      const px = lerp(hx + sd * 0.1, bx + sd * 0.15, grip), py = lerp(0.79, by + 0.075, grip), pz = lerp(-0.36, 0.0, grip);
      return <group key={i} position={[px, py, pz]} rotation={[0, sd * 0.35, 0]}>
        <mesh rotation={[PI / 2 - 0.25, 0, 0]} position={[0, 0.03, -0.17]}><capsuleGeometry args={[0.034, 0.26, 6, 12]} /><meshStandardMaterial color={["#3a5a8a", "#8a3a3a", "#5a6a3a"][i]} roughness={0.9} /></mesh>
        <mesh position={[0, 0, -0.035]}><cylinderGeometry args={[0.038, 0.036, 0.03, 16]} /><meshStandardMaterial color="#f2efe6" roughness={0.8} /></mesh>
        <mesh position={[0, -0.004, 0.0]} scale={[1.15, 0.55, 1.2]}><sphereGeometry args={[0.042, 16, 12]} /><meshStandardMaterial color="#e2b48e" roughness={0.6} /></mesh>
        {[0, 1, 2, 3].map((f) => <mesh key={f} position={[-0.03 + f * 0.02, -0.012, 0.04]} rotation={[PI / 2 + 0.5, 0, 0]}><capsuleGeometry args={[0.0085, 0.03, 4, 8]} /><meshStandardMaterial color="#e2b48e" roughness={0.6} /></mesh>)}
        <mesh position={[sd * -0.04, -0.008, 0.012]} rotation={[0, 0, sd * 1.1]}><capsuleGeometry args={[0.01, 0.028, 4, 8]} /><meshStandardMaterial color="#e2b48e" roughness={0.6} /></mesh>
      </group>; })}
  </>;
}}</Scene3D>;
