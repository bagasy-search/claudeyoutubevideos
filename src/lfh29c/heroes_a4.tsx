// lfh29c · componentes únicos 22-28 (media taza de bórax a la noche, el limón con sal en la olla de cobre, el cuaderno de gastos, la pila de frascos de tienda contra los billetes, diez años que hacen una heladera, la caja de madera con manija, de arriba para abajo).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Bottle, Lemon, Rag, SodaBox } from "./ck";
import { Coin } from "./bk";

const PI = Math.PI;

// ---- 12:53 · MEDIA TAZA DE BÓRAX A LA NOCHE: el farol encendido, la taza medidora vuelca el polvo en la tina de pañales y se hunde en nube ----
export const HBorax: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#0f1218" key1={[-0.8, 1.2, 1.0]} warm={0.55} lamp={[-0.28, 0.32, 0.1]}
  cam={{ at: [0, 0.12, 0], az: [0.2, 0.05], el: [0.42, 0.34], r: [0.74, 0.64], fov: 30 }}>{(tt) => {
  const tip = eio(tt, 0.5, 1.6), cloud = eio(tt, 1.2, 3.6);
  return <>
    {/* farol de querosén encendido */}
    <group position={[-0.28, 0, -0.05]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.04, 0.045, 0.06, 24]} /><meshStandardMaterial color="#a8322a" metalness={0.4} roughness={0.4} /></mesh>
      <mesh position={[0, 0.11, 0]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.04, 24, 16]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.1, 0]} scale={[1, 1.8 + 0.15 * Math.sin(tt * 3), 1]}><sphereGeometry args={[0.01, 12, 8]} />{M.glow({ col: "#ffb347" })}</mesh>
      <mesh position={[0, 0.2, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.03, 0.003, 6, 20, PI]} />{M.steel()}</mesh>
    </group>
    {/* la tina galvanizada con pañales blancos en remojo */}
    <mesh position={[0.06, 0.07, 0]}><cylinderGeometry args={[0.17, 0.15, 0.14, 48, 1, true]} />{M.steel({ col: "#a9b0b6", side: THREE.DoubleSide })}</mesh>
    <mesh position={[0.06, 0.12, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.165, 48]} />{M.water({ op: 0.55, col: "#bcd0dc" })}</mesh>
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0.06 + Math.cos(i * 1.3) * 0.07, 0.105 + 0.004 * Math.sin(tt + i), Math.sin(i * 1.3) * 0.07]} rotation={[-PI / 2 + 0.2 * rn(i, 2), 0, i]}><planeGeometry args={[0.09, 0.07]} /><meshStandardMaterial color="#fbfaf5" roughness={0.95} side={THREE.DoubleSide} /></mesh>)}
    {/* nube de bórax que se hunde y se abre en el agua */}
    {Array.from({ length: 24 }, (_, i) => { const k = cl(cloud * 1.4 - rn(i, 2) * 0.4); return <mesh key={"c" + i} visible={k > 0.02 && k < 0.98} position={[0.04 + (rn(i, 3) - 0.5) * 0.1 * (1 + k), 0.13 - 0.04 * k, (rn(i, 4) - 0.5) * 0.1 * (1 + k)]}><sphereGeometry args={[0.012 + 0.012 * k, 10, 8]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.55 * (1 - k)} depthWrite={false} /></mesh>; })}
    {/* la taza medidora de lata con la raya de la mitad */}
    <group visible={tt < 2.4} position={[0.12, 0.26, 0]} rotation={[0, 0, 2.0 * tip]}>
      <mesh><cylinderGeometry args={[0.04, 0.036, 0.07, 28, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.0, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.0385, 0.002, 6, 28]} /><meshStandardMaterial color="#2a2622" /></mesh>
      <mesh visible={tip < 0.5} position={[0, -0.018, 0]}><cylinderGeometry args={[0.036, 0.036, 0.034, 28]} /><meshStandardMaterial color="#fbfaf5" roughness={1} /></mesh>
      <RBox s={[0.008, 0.05, 0.016]} p={[0.046, 0, 0]} r={0.003}>{M.steel()}</RBox>
    </group>
    {Array.from({ length: 40 }, (_, i) => { const u = cl((tt - 0.9 - i * 0.015) / 0.35); return <mesh key={"p" + i} visible={u > 0 && u < 1} position={[0.06 + (rn(i, 5) - 0.5) * 0.03, lerp(0.24, 0.12, u), (rn(i, 6) - 0.5) * 0.03]}><boxGeometry args={[0.004, 0.004, 0.004]} /><meshStandardMaterial color="#ffffff" /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 13:24 · LIMÓN CON SAL EN EL COBRE: el medio limón se hunde en el platito de sal y frota la base negra de la olla, que vuelve a brillar rosada ----
export const HCopperpot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#1b1714" key1={[-0.5, 1.6, 1.2]}
  cam={{ at: [0, 0.05, 0], az: [0.3, 0.15], el: [0.5, 0.42], r: [0.62, 0.54], fov: 30 }}>{(tt) => {
  const dip = eio(tt, 0.3, 0.9) * (1 - eio(tt, 1.0, 1.5)), go = eio(tt, 1.5, 2.0), rub = eio(tt, 2.0, 5.2), salted = tt > 0.9;
  const lx = lerp(0.24, -0.06 + Math.cos(rub * PI * 5) * 0.05, go), lz = lerp(0.1, Math.sin(rub * PI * 5) * 0.05, go), ly = lerp(0.04 - 0.02 * dip, 0.075, go);
  return <>
    <RBox s={[0.8, 0.02, 0.5]} p={[0, -0.01, 0]} r={0.004}>{M.wood({ base: [128, 86, 50] })}</RBox>
    {/* la olla de cobre dada vuelta: la base renegrida, que se limpia en anillos */}
    <group position={[-0.06, 0, 0]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.12, 0.12, 0.06, 48]} /><meshStandardMaterial color="#c8743a" metalness={1} roughness={0.25} /></mesh>
      <mesh position={[0, 0.0605, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.12, 48]} /><meshStandardMaterial color="#e89a62" metalness={1} roughness={0.15} /></mesh>
      {Array.from({ length: 60 }, (_, i) => { const a = i * 2.4, r = 0.115 * Math.sqrt((i + 0.5) / 60), x = Math.cos(a) * r, z = Math.sin(a) * r, ord = (Math.atan2(z, x) + PI) / (PI * 2) * 0.2 + r / 0.115 * 0.8;
        return <mesh key={i} visible={ord > rub * 1.05} position={[x, 0.0612, z]} rotation={[-PI / 2, 0, a]}><circleGeometry args={[0.022, 9]} /><meshStandardMaterial color={rn(i, 2) > 0.5 ? "#2e2620" : "#3e3026"} roughness={0.9} /></mesh>; })}
      <mesh position={[0, 0.03, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.36, 16]} />{M.brass({ col: "#b8642a" })}</mesh>
    </group>
    {/* el platito de sal */}
    <group position={[0.24, 0, 0.1]}>
      <mesh position={[0, 0.012, 0]}><cylinderGeometry args={[0.07, 0.05, 0.024, 36, 1, true]} />{M.porcelain({ col: "#f4f1ea", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.016, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.065, 36]} /><meshStandardMaterial map={tex.text("saltbed", 128, 128, (g) => { g.fillStyle = "#f6f6f2"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 300; i++) { g.fillStyle = rn(i, 2) > 0.5 ? "#ffffff" : "#dcdcd6"; g.fillRect(rn(i, 3) * 128, rn(i, 4) * 128, 3, 3); } })} roughness={0.6} /></mesh>
    </group>
    {/* el medio limón, cara cortada hacia abajo */}
    <group position={[lx, ly, lz]} rotation={[PI, rub * 6, 0]}><Lemon s={1.1} salt={salted ? 1 : 0} /></group>
  </>;
}}</Scene3D>;

// ---- 13:56 · CADA CENTAVO ANOTADO: el cuaderno de tapa dura se abre, el lápiz escribe renglón por renglón y la suma queda abajo ----
const ROWS = [["Vinegar, 1 gal.", ".35"], ["Baking soda", ".10"], ["Bar soap", ".08"], ["Salt", ".06"], ["Borax", ".25"]];
export const HLedger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#1c1814" lamp={[0.0, 0.4, 0.3]}
  cam={{ at: [0, 0.01, 0.01], az: [0.0, 0.08], el: [1.05, 0.95], r: [0.62, 0.54], fov: 30 }}>{(tt) => {
  const open = eio(tt, 0.2, 0.9), w = cl((tt - 1.0) / 3.4) * ROWS.length, line = Math.min(ROWS.length - 1, Math.floor(w)), sum = eio(tt, 4.5, 5.2);
  const page = tex.text("ledg" + Math.floor(w * 4) + (sum > 0.5 ? "s" : ""), 512, 512, (g) => { g.fillStyle = "#f3ead2"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "#9cb6d0"; g.lineWidth = 2; for (let y = 60; y < 512; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); } g.strokeStyle = "#d07a7a"; g.beginPath(); g.moveTo(380, 0); g.lineTo(380, 512); g.stroke();
    g.fillStyle = "#2a2622"; g.font = "italic 700 40px Georgia"; ROWS.forEach(([a, b], i) => { const k = cl(w - i); if (k <= 0) return; g.fillText(a.slice(0, Math.ceil(a.length * Math.min(1, k * 1.4))), 20, 112 + i * 64); if (k > 0.75) g.fillText(b, 400, 112 + i * 64); });
    if (sum > 0.5) { g.fillRect(380, 420, 120, 4); g.font = "italic 800 46px Georgia"; g.fillText(".84", 400, 470); } });
  return <>
    {/* el cuaderno: tapa de cuero que se abre, dos páginas */}
    <RBox s={[0.5, 0.02, 0.34]} p={[0, 0.01, 0]} r={0.008}><meshStandardMaterial color="#5a2a18" roughness={0.7} /></RBox>
    <mesh position={[0.12, 0.021, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.235, 0.32]} /><meshStandardMaterial map={page} roughness={0.9} /></mesh>
    <group position={[0, 0.021, 0]} rotation={[0, 0, PI * (1 - open)]}>
      <mesh position={[-0.12, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.235, 0.32]} /><meshStandardMaterial color="#f3ead2" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <mesh position={[-0.12, -0.002, 0]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[0.245, 0.33]} /><meshStandardMaterial color="#5a2a18" roughness={0.7} side={THREE.DoubleSide} /></mesh>
    </group>
    {/* el lápiz sigue el renglón */}
    <group visible={tt > 0.9 && tt < 5.3} position={[0.03 + 0.14 * (w - line) + 0.01 * Math.sin(tt * 20), 0.04, -0.12 + line * 0.04 + (sum > 0.1 ? 0.04 : 0)]} rotation={[0.5, 0.3, -0.6]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.005, 0.005, 0.12, 6]} /><meshStandardMaterial color="#e8b52a" roughness={0.5} /></mesh>
      <mesh position={[0, -0.006, 0]}><coneGeometry args={[0.005, 0.014, 6]} /><meshStandardMaterial color="#e9cfa2" /></mesh>
    </group>
    {/* el centavo que cae sobre la hoja */}
    <group position={[-0.12, 0.025 + 0.3 * (1 - phys(tt, 1.6, 7, 0.4)), 0.05]} rotation={[0.1, 0, 0]}><Coin col="#b8733a" r={0.02} /></group>
  </>;
}}</Scene3D>;

// ---- 14:41 · CIENTO CINCUENTA POR AÑO: la góndola de frascos de colores aparece de golpe y al lado la pila de billetes sube hasta 150 ----
export const HTwostacks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#1e1a16" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.16, 0], az: [-0.2, 0.12], el: [0.2, 0.16], r: [0.95, 0.84], fov: 30 }}>{(tt) => {
  const n = 150 * eio(tt, 1.6, 4.6), bills = Math.floor(n / 150 * 30);
  const COL = ["#2fa8d8", "#e8462a", "#f2c81e", "#6ac04a", "#c84ab8", "#2a6fd8", "#f27a1e", "#1eb89a"];
  return <>
    {/* los frascos de tienda: tres estantes de colores */}
    {Array.from({ length: 18 }, (_, i) => { const k = phys(tt, 0.2 + i * 0.07, 8, 0.45), row = Math.floor(i / 6); return <group key={i} position={[-0.38 + (i % 6) * 0.07, row * 0.13 + 0.25 * (1 - k), 0]} scale={Math.max(0.001, k) * 0.8}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.028, 0.03, 0.12, 20]} /><meshPhysicalMaterial color={COL[(i * 3) % 8]} roughness={0.25} clearcoat={0.8} /></mesh>
      <RBox s={[0.02, 0.04, 0.03]} p={[0, 0.135, 0]} r={0.004}>{M.plastic({ col: "#f4f4f4" })}</RBox>
      <RBox s={[0.03, 0.008, 0.008]} p={[0.016, 0.15, 0]} r={0.002}>{M.plastic({ col: "#f4f4f4" })}</RBox>
    </group>; })}
    {[0, 0.13, 0.26].map((y) => <RBox key={y} s={[0.46, 0.012, 0.1]} p={[-0.2, y - 0.006 + (y ? 0 : 0.006), 0]} r={0.003}>{M.wood({ base: [160, 116, 70] })}</RBox>)}
    {/* la pila de billetes que sube */}
    {Array.from({ length: bills }, (_, i) => <RBox key={"b" + i} s={[0.15, 0.007, 0.07]} p={[0.22 + 0.004 * Math.sin(i * 2.3), 0.0035 + i * 0.0075, 0.004 * Math.cos(i * 1.7)]} rot={[0, 0.06 * Math.sin(i), 0]} r={0.001}><meshStandardMaterial map={tex.text("bill2", 256, 128, (g) => { g.fillStyle = "#a9c08f"; g.fillRect(0, 0, 256, 128); g.strokeStyle = "#4d6b3a"; g.lineWidth = 6; g.strokeRect(10, 10, 236, 108); g.fillStyle = "#4d6b3a"; g.beginPath(); g.ellipse(128, 64, 30, 38, 0, 0, 6.3); g.fill(); })} roughness={0.9} /></RBox>)}
    {/* el contador al pie */}
    <RBox s={[0.16, 0.07, 0.03]} p={[0.22, 0.035, 0.1]} r={0.006}>{M.wood({ base: [120, 80, 46] })}</RBox>
    {[0, 1, 2].map((d) => <DigitDrum key={d} v={d === 0 ? Math.floor(n / 100) : d === 1 ? Math.floor(n / 10) % 10 : n % 10} p={[0.18 + d * 0.04, 0.045, 0.12]} r={0.022} w={0.034} />)}
  </>;
}}</Scene3D>;

// ---- 15:17 · DIEZ AÑOS = UNA HELADERA NUEVA: caen diez bolsitas de ahorro, una por año, se juntan y de ahí sale una heladera crema ----
export const HFridgeten: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0, 0.6, 0.4]}
  cam={{ at: [0, 0.2, 0], az: [-0.2, 0.15], el: [0.16, 0.12], r: [1.05, 0.92], fov: 30 }}>{(tt) => {
  const gather = eio(tt, 2.8, 3.6), grow = phys(tt, 3.5, 6, 0.5);
  return <>
    {/* diez sacos de arpillera con monedas, uno por año */}
    {Array.from({ length: 10 }, (_, i) => { const k = phys(tt, 0.2 + i * 0.24, 8, 0.45), x0 = -0.4 + i * 0.09; return <group key={i} visible={gather < 0.98} position={[lerp(x0, 0, gather), 0.03 + 0.3 * (1 - k) + 0.1 * Math.sin(gather * PI), lerp(0.1, 0, gather)]} scale={Math.max(0.001, k * (1 - gather * 0.8))}>
      <mesh scale={[1, 1.1, 1]}><sphereGeometry args={[0.032, 20, 14]} /><meshStandardMaterial color="#b8955a" roughness={1} /></mesh>
      <mesh position={[0, 0.036, 0]}><cylinderGeometry args={[0.008, 0.014, 0.014, 12]} /><meshStandardMaterial color="#9a7a44" roughness={1} /></mesh>
      <mesh position={[0, 0.03, 0.0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.011, 0.002, 6, 16]} /><meshStandardMaterial color="#a8322a" /></mesh>
    </group>; })}
    {/* la heladera crema redondeada con manija cromada */}
    <group position={[0, 0, 0]} scale={[1, Math.max(0.001, grow), 1]}>
      <RBox s={[0.26, 0.5, 0.2]} p={[0, 0.25, -0.04]} r={0.05}><meshPhysicalMaterial color="#f2ead2" roughness={0.25} clearcoat={0.9} /></RBox>
      <mesh position={[0, 0.34, 0.061]}><boxGeometry args={[0.24, 0.003, 0.003]} /><meshStandardMaterial color="#c9bfa6" /></mesh>
      <RBox s={[0.02, 0.1, 0.02]} p={[0.1, 0.4, 0.07]} r={0.008}>{M.chrome()}</RBox>
      <RBox s={[0.02, 0.06, 0.02]} p={[0.1, 0.27, 0.07]} r={0.008}>{M.chrome()}</RBox>
      <mesh position={[0, 0.47, 0.062]}><circleGeometry args={[0.018, 20]} />{M.chrome()}</mesh>
    </group>
    <mesh visible={tt > 3.4 && tt < 4.4} position={[0, 0.25, 0.1]} scale={eio(tt, 3.4, 3.7) * (1 - eio(tt, 3.8, 4.4)) + 0.001}><sphereGeometry args={[0.2, 24, 16]} />{M.glow({ col: "#fff2c8", op: 0.4 })}</mesh>
  </>;
}}</Scene3D>;

// ---- 15:36 · LA CAJA DE MADERA CON MANIJA: caen adentro, de cada lado, el vinagre, el bicarbonato, el trapo, el cepillo y el jabón ----
export const HTote: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#1d1915" lamp={[0.1, 0.5, 0.3]}
  cam={{ at: [0, 0.1, 0], az: [-0.5, 0.4], el: [0.5, 0.42], r: [0.8, 0.7], fov: 30 }}>{(tt) => {
  const k = [0.3, 0.8, 1.3, 1.8, 2.3].map((a) => phys(tt, a, 7, 0.45));
  return <>
    {/* la caja: cuatro lados, piso, tabique central con la manija redonda */}
    <RBox s={[0.42, 0.012, 0.22]} p={[0, 0.006, 0]} r={0.003}>{M.wood({ base: [178, 132, 80] })}</RBox>
    {[-1, 1].map((sd) => <RBox key={sd} s={[0.42, 0.1, 0.012]} p={[0, 0.05, sd * 0.104]} r={0.003}>{M.wood({ base: [168, 122, 72] })}</RBox>)}
    {[-1, 1].map((sd) => <RBox key={"e" + sd} s={[0.012, 0.1, 0.22]} p={[sd * 0.204, 0.05, 0]} r={0.003}>{M.wood({ base: [158, 112, 64] })}</RBox>)}
    <RBox s={[0.012, 0.2, 0.2]} p={[0, 0.1, 0]} r={0.003}>{M.wood({ base: [168, 122, 72] })}</RBox>
    <mesh position={[0, 0.2, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.2, 16]} />{M.wood({ base: [120, 80, 44] })}</mesh>
    {/* lo que cae adentro */}
    <group position={[-0.14, 0.012 + 0.4 * (1 - k[0]), -0.04]} scale={0.75}><Bottle /></group>
    <group position={[-0.07, 0.012 + 0.4 * (1 - k[1]), 0.04]}><SodaBox /></group>
    <group position={[0.1, 0.03 + 0.4 * (1 - k[2]), -0.04]} rotation={[0, 0.3, 0.2]}><Rag w={0.13} d={0.09} col="#a8322a" key2="tote" /></group>
    <group position={[0.12, 0.04 + 0.4 * (1 - k[3]), 0.05]} rotation={[0, -0.4, 0]}>
      <RBox s={[0.12, 0.025, 0.04]} p={[0, 0, 0]} r={0.01}>{M.wood({ base: [196, 150, 96] })}</RBox>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.045 + (i % 6) * 0.018, -0.02, -0.008 + Math.floor(i / 6) * 0.016]}><cylinderGeometry args={[0.004, 0.004, 0.02, 6]} /><meshStandardMaterial color="#d8c08a" /></mesh>)}
    </group>
    <RBox s={[0.08, 0.035, 0.05]} p={[0.06, 0.03 + 0.4 * (1 - k[4]), 0.06]} rot={[0, 0.5, 0]} r={0.008}><meshStandardMaterial color="#efd36a" roughness={0.45} /></RBox>
  </>;
}}</Scene3D>;

// ---- 16:22 · DE ARRIBA PARA ABAJO: el plumero baja de la repisa alta, el polvo cae y la pared se va limpiando en franjas hasta el piso ----
export const HHighlow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#1e1b18" key1={[-0.6, 1.4, 1.4]}
  cam={{ at: [0, 0.0, 0], az: [0.2, 0.1], el: [0.06, 0.04], r: [1.3, 1.18], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.3, 4.8), y = lerp(0.36, -0.36, k), sx = Math.sin(tt * 7) * 0.2;
  return <>
    {/* pared empapelada con flores chicas, una repisa alta, un cuadro, el zócalo */}
    <mesh position={[0, 0, -0.02]}><planeGeometry args={[1.1, 0.9]} /><meshStandardMaterial map={tex.text("wallpap", 256, 256, (g) => { g.fillStyle = "#e9dcc0"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 40; i++) { const x = (i % 8) * 32 + (Math.floor(i / 8) % 2) * 16, yy = Math.floor(i / 8) * 52 + 20; g.fillStyle = "#c86a6a"; g.beginPath(); g.arc(x, yy, 5, 0, 6.3); g.fill(); g.fillStyle = "#6a8a4a"; g.fillRect(x - 1, yy + 5, 2, 8); } })} roughness={0.9} /></mesh>
    <RBox s={[0.5, 0.02, 0.08]} p={[0, 0.32, 0.02]} r={0.004}>{M.wood({ base: [140, 96, 56] })}</RBox>
    {[-0.15, 0.0, 0.15].map((x, i) => <mesh key={x} position={[x, 0.36, 0.02]}><cylinderGeometry args={[0.025, 0.025, 0.06, 20]} />{M.porcelain({ col: ["#f4f1ea", "#a8c4de", "#e8b0b8"][i] })}</mesh>)}
    <RBox s={[0.2, 0.15, 0.012]} p={[0.25, 0.06, 0.0]} r={0.004}>{M.wood({ base: [110, 72, 40] })}</RBox>
    <mesh position={[0.25, 0.06, 0.007]}><planeGeometry args={[0.17, 0.12]} /><meshStandardMaterial color="#8fb3cf" /></mesh>
    <RBox s={[1.1, 0.06, 0.02]} p={[0, -0.42, 0.0]} r={0.004}>{M.wood({ base: [110, 72, 40] })}</RBox>
    {/* capa de polvo gris: franjas que desaparecen de arriba para abajo */}
    {Array.from({ length: 9 }, (_, i) => { const yy = 0.4 - i * 0.1; return <mesh key={i} visible={y > yy - 0.05} position={[0, yy, 0.03]}><planeGeometry args={[1.1, 0.1]} /><meshStandardMaterial color="#8a857a" transparent opacity={0.42} depthWrite={false} /></mesh>; })}
    {/* el polvo que cae delante */}
    {Array.from({ length: 30 }, (_, i) => { const u = (tt * 0.7 + rn(i, 2)) % 1; return <mesh key={"d" + i} position={[sx + (rn(i, 3) - 0.5) * 0.2, y - u * 0.3, 0.06]}><sphereGeometry args={[0.003, 6, 4]} /><meshBasicMaterial color="#d8d0c0" transparent opacity={0.7 * (1 - u)} /></mesh>; })}
    {/* el plumero de plumas que barre de lado a lado mientras baja */}
    <group position={[sx, y, 0.08]} rotation={[0, 0, 0.4 * Math.cos(tt * 7)]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.007, 0.008, 0.2, 10]} />{M.wood({ base: [120, 80, 44] })}</mesh>
      {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[Math.cos(i * 0.8) * 0.02, -0.01, Math.sin(i * 0.8) * 0.02]} rotation={[Math.sin(i * 0.8) * 0.5, 0, -Math.cos(i * 0.8) * 0.5]} scale={[1, 1, 0.4]}><sphereGeometry args={[0.025, 10, 8]} /><meshStandardMaterial color={i % 2 ? "#3a2a1e" : "#6a4a2e"} roughness={1} /></mesh>)}
    </group>
  </>;
}}</Scene3D>;
