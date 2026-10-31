// lfh29a · componentes únicos 28-32 (la lana de acero en el agujero del caño, la hoja que amarillea, la pizca contra el campo, la pava sobre el hormiguero, la caja verde en su pedestal).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Ant, BoraxBox, Powder, Roach } from "./lf";

const PI = Math.PI;

// ---- 20:34 · LANA DE ACERO EN LOS AGUJEROS: el hueco alrededor del caño bajo la pileta; un ovillo de lana de acero entra y lo tapa; la cucaracha se frena ----
export const HSteelwool: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#3a2c20" key1={[-0.5, 0.9, 1.2]}
  cam={{ at: [-0.03, 0.0, 0], az: [0.7, 0.5], el: [0.3, 0.22], r: [0.48, 0.4], fov: 30 }}>{(tt) => {
  const push = eio(tt, 1.4, 3.4), fin = eio(tt, 0.9, 1.5) * (1 - eio(tt, 3.8, 4.6));
  return <>
    {/* pared con el agujero alrededor del caño */}
    <mesh position={[0, 0, -0.01]}><ringGeometry args={[0.055, 0.6, 48]} /><meshStandardMaterial color="#e6cba2" roughness={0.9} /></mesh>
    <mesh position={[0, 0, -0.03]}><circleGeometry args={[0.055, 40]} /><meshBasicMaterial color="#050403" /></mesh>
    <mesh rotation={[PI / 2, 0, 0]} position={[0, 0, 0.1]}><cylinderGeometry args={[0.022, 0.022, 0.3, 24]} />{M.chrome()}</mesh>
    {/* ovillo de hebras finas que entra al hueco */}
    <group position={[0.02, 0, lerp(0.16, -0.005, push)]} scale={lerp(0.7, 1, push)}>
      {Array.from({ length: 14 }, (_, i) => { const pts = Array.from({ length: 7 }, (_, j) => { const a = j * 1.3 + i, r = 0.035 + 0.012 * rn(i * 7 + j, 2); return [Math.cos(a) * r, Math.sin(a * 1.3 + i) * r * 0.9, (rn(i * 7 + j, 3) - 0.5) * 0.03]; });
        return <mesh key={i} geometry={tubeG("sw" + i, pts, 0.0012, 60, 5)}><meshStandardMaterial color="#9da2a6" metalness={0.9} roughness={0.35} /></mesh>; })}
    </group>
    {/* el dedo índice que empuja el ovillo adentro del hueco */}
    <group position={[0.05, 0.01, lerp(0.16, -0.005, push) + 0.09 + 0.12 * (1 - fin)]} rotation={[PI / 2 - 0.2, 0, 0]}>
      <mesh><capsuleGeometry args={[0.013, 0.09, 10, 18]} /><meshStandardMaterial color="#e2a98a" roughness={0.55} /></mesh>
      {/* nudillos y dorso de la mano, para que se lea como un dedo y no una salchicha */}
      <mesh position={[0, 0.07, 0.004]} scale={[1.25, 0.9, 1]}><sphereGeometry args={[0.016, 16, 12]} /><meshStandardMaterial color="#dca184" roughness={0.6} /></mesh>
      <mesh position={[0.025, 0.11, 0.012]} scale={[1.9, 1.1, 0.8]}><sphereGeometry args={[0.03, 20, 14]} /><meshStandardMaterial color="#dca184" roughness={0.6} /></mesh>
      <mesh position={[0.03, 0.06, -0.012]} rotation={[0.3, 0, -0.2]}><capsuleGeometry args={[0.012, 0.06, 8, 14]} /><meshStandardMaterial color="#dca184" roughness={0.6} /></mesh>
      <mesh position={[0, -0.05, -0.011]} rotation={[0.3, 0, 0]} scale={[1, 1.3, 0.35]}><sphereGeometry args={[0.009, 16, 10]} /><meshPhysicalMaterial color="#f3d6c6" roughness={0.2} clearcoat={0.8} /></mesh>
    </group>
    {/* la cucaracha que asoma del borde y se queda */}
    {/* cucaracha grande por la pared: viene hacia el hueco, choca con la lana y se vuelve */}
    <group position={[0, 0, 0.004]} rotation={[PI / 2, 0, 0]}><Roach p={[lerp(-0.17, -0.072, eio(tt, 2.4, 3.9)) - 0.07 * eio(tt, 4.4, 5.4), 0, lerp(-0.05, -0.012, eio(tt, 2.4, 3.9))]} yaw={tt > 4.3 ? PI + 0.4 : 0.35} ph={tt * 2} s={1.4} /></group>
  </>;
}}</Scene3D>;
const RoachLite: React.FC<{ tt: number }> = ({ tt }) => <group scale={0.05}>
  <mesh position={[0, 0.16, 0]} scale={[0.7, 0.16, 0.36]}><sphereGeometry args={[1, 16, 10]} /><meshPhysicalMaterial color="#5a2f14" roughness={0.25} clearcoat={1} /></mesh>
  {[-1, 1].map((s) => <mesh key={s} position={[1.0, 0.2, s * 0.22]} rotation={[s * 0.5, 0, -1.45 + 0.15 * Math.sin(tt * 8 + s)]}><cylinderGeometry args={[0.01, 0.006, 1.0, 4]} /><meshStandardMaterial color="#3a1e0c" /></mesh>)}
</group>;

// ---- 21:26 · LAS HOJAS DE ABAJO SE PUSIERON AMARILLAS: una planta de tomate; las hojas de abajo pasan de verde a amarillo, de a una, desde el suelo ----
export const HYellowleaf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#7d8f72" key1={[-1, 1.8, 1.2]}
  cam={{ at: [0, 0.2, 0], at1: [0, 0.14, 0], az: [-0.4, 0.25], el: [0.15, 0.22], r: [0.78, 0.62], fov: 30 }}>{(tt) => {
  const LV = Array.from({ length: 10 }, (_, i) => ({ y: 0.05 + i * 0.036, a: i * 2.4, s: 1.45 - i * 0.06 }));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.6, 40]} /><meshStandardMaterial color="#4a3422" roughness={1} /></mesh>
    {/* granitos blancos en la tierra */}
    <Powder n={120} w={0.4} d={0.4} y={0.002} r={0.002} />
    <mesh position={[0, 0.24, 0]}><cylinderGeometry args={[0.008, 0.012, 0.48, 10]} /><meshStandardMaterial color="#5c8a3a" roughness={0.7} /></mesh>
    <mesh position={[0.04, 0.3, 0]}><cylinderGeometry args={[0.005, 0.005, 0.62, 8]} />{M.wood({ base: [150, 110, 70] })}</mesh>
    {LV.map((l, i) => { const k = i < 5 ? eio(tt, 0.8 + i * 0.6, 1.6 + i * 0.6) : 0; const col = new THREE.Color("#3f8a2e").lerp(new THREE.Color("#e3c23a"), k).getStyle();
      return <group key={i} position={[0, l.y, 0]} rotation={[0, l.a, -0.5 - 0.5 * k]}>
        <group scale={l.s}>
          <mesh position={[0.06, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0022, 0.003, 0.12, 6]} /><meshStandardMaterial color={col} roughness={0.6} /></mesh>
          {[[0.125, 0, 0, 1], [0.085, 0.022, 0.6, 0.85], [0.085, -0.022, -0.6, 0.85], [0.04, 0.02, 0.8, 0.7], [0.04, -0.02, -0.8, 0.7]].map(([x, z, a, sc], j) => <group key={j} position={[x, 0.002, z]} rotation={[0, -a, 0]}>
            <mesh scale={[0.026 * sc, 0.003, 0.014 * sc]}><sphereGeometry args={[1, 14, 8]} /><meshStandardMaterial color={col} roughness={0.55} /></mesh>
            {Array.from({ length: 6 }, (_, q) => <mesh key={q} position={[(-0.018 + q * 0.0072) * sc, 0.0005, (q % 2 ? 1 : -1) * 0.0125 * sc]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.0032 * sc, 3]} /><meshStandardMaterial color={col} roughness={0.55} side={2} /></mesh>)}
          </group>)}
        </group>
      </group>; })}
    {/* tomate verde arriba */}
    <mesh position={[0.06, 0.3, 0.03]}><sphereGeometry args={[0.025, 20, 14]} /><meshPhysicalMaterial color="#7cb342" roughness={0.3} clearcoat={0.6} /></mesh>
  </>;
}}</Scene3D>;

// ---- 21:57 · UNA PIZCA PARA UN CAMPO ENTERO: dos dedos sueltan una pizca blanca sobre una maqueta de campo arado con surcos; los granitos apenas se ven ----
export const HPinch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#b9c7d2" key1={[-1.2, 2.2, 1.2]}
  cam={{ at: [0.0, 0.05, 0], at1: [0.0, 0.03, 0], az: [0.35, 0.15], el: [0.3, 0.42], r: [0.5, 0.75], fov: 30 }}>{(tt) => {
  const lift = eio(tt, 0.6, 1.6), tip = eio(tt, 1.7, 2.5), fall = cl((tt - 2.1) / 0.9), back = eio(tt, 3.6, 4.6);
  // la cuchara «pinch» (la más chica del juego de medidas) sale del aro, vuelca y vuelve; la cuchara sopera queda al lado de escala
  const sx = lerp(0.16, 0.035, lift) + 0.12 * back, sy = lerp(0.012, 0.11, lift) - 0.1 * back, rz = -2.2 * tip * (1 - back);
  const Spoon = ({ r, L, word }: { r: number; L: number; word: string }) => <group>
    <mesh scale={[1, 0.55, 1]}><sphereGeometry args={[r, 28, 14, 0, 6.3, PI / 2, PI / 2]} />{M.steel({ col: "#d9dde0", side: 2 })}</mesh>
    <RBox s={[L, 0.004, r * 0.55]} p={[r + L / 2 - 0.004, 0.002, 0]} r={0.0018}>{M.steel({ col: "#cfd3d6" })}</RBox>
    <mesh position={[r + L * 0.55, 0.0045, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[L * 0.6, r * 0.45]} /><meshBasicMaterial transparent map={tex.text("sp" + word, 256, 64, (g) => { g.fillStyle = "#4a4f53"; g.font = "700 40px Georgia"; g.textAlign = "center"; g.fillText(word, 128, 46); })} /></mesh>
  </group>;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[1.2, 48]} /><meshStandardMaterial color="#5a4330" roughness={1} /></mesh>
    {Array.from({ length: 160 }, (_, i) => { const x = (rn(i, 2) - 0.5) * 1.4, z = (rn(i, 3) - 0.5) * 1.4; return Math.hypot(x, z) < 0.12 ? null : <mesh key={i} position={[x, 0.004, z]}><dodecahedronGeometry args={[0.006 + 0.008 * rn(i, 4), 0]} /><meshStandardMaterial color="#6e5440" roughness={1} /></mesh>; })}
    {/* el plantín de tomate con su montículo */}
    <mesh position={[0, 0, 0]} scale={[1, 0.3, 1]}><sphereGeometry args={[0.06, 24, 12, 0, 6.3, 0, PI / 2]} /><meshStandardMaterial color="#4a3626" roughness={1} /></mesh>
    <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.003, 0.004, 0.09, 8]} /><meshStandardMaterial color="#4f8a2e" /></mesh>
    {[0, 1, 2, 3].map((k) => <mesh key={k} position={[Math.cos(k * 1.7) * 0.02, 0.07 + k * 0.012, Math.sin(k * 1.7) * 0.02]} rotation={[0.6, k * 1.7, 0]} scale={[1, 0.25, 0.6]}><sphereGeometry args={[0.02, 14, 8]} /><meshStandardMaterial color="#5f9a3a" roughness={0.6} /></mesh>)}
    {/* cuchara sopera de escala, quieta */}
    <group position={[-0.17, 0.006, 0.06]} rotation={[0, 0.5, 0]}><Spoon r={0.03} L={0.12} word="1 TBSP" /></group>
    {/* la «pinch» con su montoncito de bórax */}
    <group position={[sx, sy, 0.02]} rotation={[0, 0, rz]}>
      <Spoon r={0.011} L={0.08} word="PINCH" />
      <mesh visible={tip < 0.6} position={[0, 0.002, 0]} scale={[1, 0.6, 1]}><sphereGeometry args={[0.008, 12, 8]} /><meshStandardMaterial color="#fbfaf5" roughness={0.9} /></mesh>
    </group>
    {Array.from({ length: 26 }, (_, i) => { const k = cl(fall * (1 + rn(i, 2) * 0.5)); return k <= 0 ? null : <mesh key={"g" + i} position={[0.03 + (rn(i, 3) - 0.5) * 0.01 + (rn(i, 5) - 0.5) * 0.03 * k, lerp(0.1, 0.012, k), 0.02 + (rn(i, 4) - 0.5) * 0.03 * k]}><icosahedronGeometry args={[0.0022, 0]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.25} /></mesh>; })}
  </>;
}}</Scene3D>;

let _kg: THREE.LatheGeometry | undefined;
const kettleG = () => _kg ?? (_kg = new THREE.LatheGeometry([[0, 0], [0.08, 0], [0.086, 0.008], [0.086, 0.03], [0.074, 0.06], [0.05, 0.085], [0.032, 0.095], [0.03, 0.105], [0.0, 0.106]].map(([x, y]) => new THREE.Vector2(x, y)), 48));

// ---- 22:48 · AGUA CALIENTE Y PACIENCIA: la pava de chapa se inclina y el chorro humeante cae sobre el hormiguero; las hormigas se desparraman ----
export const HKettle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#24302a" key1={[-1, 1.6, 1.2]}
  cam={{ at: [-0.03, 0.11, 0], az: [0.6, 0.35], el: [0.28, 0.22], r: [0.92, 0.75], fov: 30 }}>{(tt) => {
  const tilt = eio(tt, 0.5, 1.6), pour = tt > 1.6 && tt < 4.8, wet = eio(tt, 1.7, 3.2);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.8, 40]} /><meshStandardMaterial color="#7a5a3a" roughness={1} /></mesh>
    {/* el hormiguero (cono de tierra con su boca) que se oscurece al mojarse */}
    <mesh position={[0, 0.025, 0]}><coneGeometry args={[0.1, 0.05, 32]} /><meshStandardMaterial color={wet > 0.5 ? "#4a321e" : "#9a7048"} roughness={1 - 0.6 * wet} /></mesh>
    <mesh position={[0, 0.051, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.008, 16]} /><meshBasicMaterial color="#120a04" /></mesh>
    {/* pava */}
    <group position={[-0.16, 0.22, 0]} rotation={[0, 0, -0.9 * tilt]}>
      <mesh position={[0, -0.06, 0]} geometry={kettleG()}><meshPhysicalMaterial color="#b8392c" roughness={0.25} clearcoat={1} side={2} /></mesh>
      <mesh position={[0, -0.059, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.078, 0.004, 8, 40]} /><meshStandardMaterial color="#f2efe6" /></mesh>
      <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.012, 0.012, 0.012, 20]} /><meshStandardMaterial color="#1b1b1b" /></mesh>
      <mesh position={[0.085, 0.0, 0]} rotation={[0, 0, -0.95]}><cylinderGeometry args={[0.007, 0.014, 0.085, 14]} />{M.steel({ col: "#b8bec4" })}</mesh>
      <mesh position={[0, 0.07, 0]}><torusGeometry args={[0.05, 0.006, 8, 24, PI]} /><meshStandardMaterial color="#1b1b1b" /></mesh>
    </group>
    {/* chorro y vapor */}
    <mesh visible={pour} geometry={tubeG("kstream", [[-0.05, 0.152, 0], [-0.035, 0.14, 0], [-0.018, 0.11, 0], [-0.006, 0.075, 0], [0, 0.052, 0]], (u) => 0.0055 - 0.0015 * u, 60, 12)}>{M.water({ op: 0.7 })}</mesh>
    {Array.from({ length: 10 }, (_, i) => { const k = (tt * 2 + i / 10) % 1, a = rn(i, 7) * 6.3; return <mesh key={"d" + i} visible={pour} position={[Math.cos(a) * 0.03 * k, 0.052 + 0.02 * Math.sin(k * PI), Math.sin(a) * 0.03 * k]}><sphereGeometry args={[0.003, 8, 6]} />{M.water({ op: 0.6 * (1 - k) })}</mesh>; })}
    {Array.from({ length: 12 }, (_, i) => { const k = (tt * 0.35 + i / 12) % 1; return <mesh key={"s" + i} position={[(rn(i, 2) - 0.5) * 0.1 + 0.03 * k, 0.07 + k * 0.32, (rn(i, 3) - 0.5) * 0.1]}><sphereGeometry args={[0.025 + 0.05 * k, 14, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.07 * Math.sin(k * PI) * wet} depthWrite={false} /></mesh>; })}
    {Array.from({ length: 20 }, (_, i) => { const a = rn(i, 4) * 6.3, r = 0.04 + wet * (0.12 + 0.3 * rn(i, 5)); return <Ant key={i} p={[Math.cos(a) * r, 0.002 + (r < 0.1 ? 0.05 * (1 - r / 0.1) : 0), Math.sin(a) * r]} yaw={-a} ph={tt * 4 + i} s={1.6} />; })}
  </>;
}}</Scene3D>;

// ---- 24:24 · UNA CAJA VERDE, UN DÓLAR LA LIBRA: la caja gira sobre un pedestal de madera; su etiquetita de precio rueda hasta $1 ----
export const HOnebox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.2, 0.55, 0.35]}
  cam={{ at: [0.03, 0.2, 0], az: [-0.6, 0.5], el: [0.15, 0.2], r: [0.92, 0.72], fov: 30 }}
>{(tt) => {
  const land = phys(tt, 0.2, 7, 0.35), roll = eio(tt, 1.6, 3.2);
  return <>
    <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.16, 0.18, 0.08, 48]} />{M.wood({ base: [110, 70, 40] })}</mesh>
    <mesh position={[0, 0.081, 0]}><cylinderGeometry args={[0.15, 0.15, 0.002, 48]} />{M.brass({ col: "#c9a24a" })}</mesh>
    <group position={[0, 0.082 + (1 - land) * 0.5, 0]} rotation={[0, tt * 0.5, 0]}><BoraxBox s={1.1} /></group>
    {/* etiqueta de precio colgando con su tambor */}
    {/* etiqueta de precio de cartón, grande, que cuelga de un hilo atado a la caja y se da vuelta */}
    <group position={[0.17, 0.2 + (1 - land) * 0.5, 0.12]} rotation={[0, -0.5 + PI * (1 - roll), 0.1 * Math.sin(tt * 1.4)]}>
      <mesh position={[-0.02, 0.07, 0]} rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.001, 0.001, 0.1, 4]} /><meshStandardMaterial color="#c8b48a" /></mesh>
      <RBox s={[0.17, 0.09, 0.004]} r={0.01}><meshStandardMaterial map={tex.text("tag1lb", 512, 272, (g) => { g.fillStyle = "#f4ead0"; g.fillRect(0, 0, 512, 272); g.strokeStyle = "#2f7d4a"; g.lineWidth = 10; g.strokeRect(14, 14, 484, 244); g.fillStyle = "#2f7d4a"; g.font = "900 150px Georgia"; g.textAlign = "center"; g.fillText("$1/lb", 256, 190); })} roughness={0.8} /></RBox>
      <mesh position={[-0.07, 0.03, 0.003]}><ringGeometry args={[0.005, 0.008, 16]} />{M.brass()}</mesh>
    </group>
  </>;
}}</Scene3D>;
