// lfh29d · componentes únicos 29-34 (la levadura que espuma en agua tibia de baño de bebé, el amasado con el talón de la mano, el leudado que dobla en el estante tibio, el golpe hueco en la base del pan, el talón caliente con manteca, los panes tapados con el repasador).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Hand } from "./bk";

const PI = Math.PI;
const loafCol = (k: number) => `rgb(${Math.round(lerp(232, 178, k))},${Math.round(lerp(212, 112, k))},${Math.round(lerp(168, 52, k))})`;
// pan de molde: caja redondeada con copete
const Loaf: React.FC<{ b?: number; s?: number }> = ({ b = 1, s = 1 }) => <group scale={s}>
  <RBox s={[0.2, 0.08, 0.1]} p={[0, 0.04, 0]} r={0.02}><meshStandardMaterial color={loafCol(b)} roughness={0.75} /></RBox>
  <mesh position={[0, 0.08, 0]} scale={[1, 0.45, 0.55]}><sphereGeometry args={[0.1, 32, 16, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color={loafCol(b * 1.05)} roughness={0.6} /></mesh>
</group>;
const check = (key: string, col: string) => tex.text("chk" + key, 128, 128, (g) => { g.fillStyle = "#f2ece0"; g.fillRect(0, 0, 128, 128); g.fillStyle = col; g.globalAlpha = 0.55; for (let i = 0; i < 128; i += 32) { g.fillRect(i, 0, 16, 128); g.fillRect(0, i, 128, 16); } });

// ---- 18:50 · HASTA QUE ESPUME: el agua tibia (el termómetro en la zona de baño de bebé), la levadura cae y la espuma sube ----
export const HFoam: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="none" bg="#1a1511" lamp={[0, 0.45, 0.3]}
  cam={{ at: [0, 0.07, 0], az: [0.3, 0.1], el: [0.5, 0.45], r: [0.56, 0.5], fov: 30 }}>{(tt) => {
  const yeast = cl((tt - 0.4) / 1.0), foam = eio(tt, 1.4, 5.0);
  return <>
    {/* el bol de loza con agua tibia */}
    <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.13, 40, 20, 0, PI * 2, PI / 2, PI / 2.3]} />{M.porcelain({ col: "#e8dfcc", side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.045, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.115, 44]} />{M.water({ col: "#d8c8a0", op: 0.55, emI: 0.05 })}</mesh>
    {/* los granitos de levadura cayendo */}
    {Array.from({ length: 40 }, (_, i) => { const u = cl(yeast * 1.3 - rn(i, 2) * 0.3); return <mesh key={i} visible={u > 0 && u < 1} position={[(rn(i, 3) - 0.5) * 0.08, lerp(0.25, 0.05, u), (rn(i, 4) - 0.5) * 0.08]}><sphereGeometry args={[0.0028, 6, 4]} /><meshStandardMaterial color="#b88a52" roughness={0.8} /></mesh>; })}
    {/* la espuma: una capa de burbujas beige que crece desde el centro */}
    {Array.from({ length: 90 }, (_, i) => { const a = i * 2.399, r = 0.11 * Math.sqrt((i + 0.5) / 90), show = foam * 1.2 - r / 0.11;
      return <mesh key={"b" + i} visible={show > 0} position={[Math.cos(a) * r, 0.047 + cl(show) * 0.012 * rn(i, 5), Math.sin(a) * r]}><sphereGeometry args={[0.006 + 0.007 * rn(i, 6) * cl(show), 10, 8]} /><meshPhysicalMaterial color="#e2cc9a" roughness={0.35} clearcoat={0.5} transparent opacity={0.92} /></mesh>; })}
    {/* el termómetro de cocina: la aguja en la franja verde */}
    <group position={[0.2, 0.01, 0.05]} rotation={[-PI / 2 + 0.5, 0, 0.3]}>
      <mesh><cylinderGeometry args={[0.04, 0.04, 0.012, 36]} />{M.steel()}</mesh>
      <mesh position={[0, 0.0065, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.036, 36]} /><meshStandardMaterial map={tex.text("thermo", 128, 128, (g) => { g.fillStyle = "#f4efe2"; g.fillRect(0, 0, 128, 128); g.lineWidth = 12; g.strokeStyle = "#3a8a3a"; g.beginPath(); g.arc(64, 64, 48, -2.0, -1.2); g.stroke(); g.strokeStyle = "#c8281e"; g.beginPath(); g.arc(64, 64, 48, -0.6, 0.4); g.stroke(); })} roughness={0.5} /></mesh>
      <group rotation={[0, lerp(-0.3, 1.25, eio(tt, 0.1, 1.0)), 0]}><mesh position={[0, 0.009, -0.014]}><boxGeometry args={[0.002, 0.002, 0.03]} /><meshStandardMaterial color="#1a1a1a" /></mesh></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 19:21 · EL AMASADO: el bollo en la mesa enharinada; las dos manos empujan con el talón, doblan y giran; la masa pasa de grumosa a lisa ----
export const HKnead: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#1a1510" lamp={[0, 0.5, 0.25]}
  cam={{ at: [0, 0.05, 0], az: [-0.2, 0.15], el: [0.6, 0.52], r: [0.6, 0.52], fov: 30 }}>{(tt) => {
  const cyc = (tt * 0.9) % 1, push = Math.sin(cyc * PI), turn = Math.floor(tt * 0.9) * 0.8 + eio(cyc, 0.75, 1.0) * 0.8, smooth = eio(tt, 0.5, 5.0);
  return <>
    {/* la harina en la mesa */}
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.22, 40]} /><meshStandardMaterial color="#e8e2d4" roughness={1} transparent opacity={0.85} /></mesh>
    {/* la masa: se estira con el empuje y vuelve doblada */}
    <group rotation={[0, turn, 0]}>
      <mesh position={[0, 0.04, -push * 0.03]} scale={[1 - push * 0.15, 0.55 - push * 0.15, 1 + push * 0.5]}><icosahedronGeometry args={[0.08, smooth > 0.6 ? 4 : 2]} /><meshPhysicalMaterial color="#eadcc0" roughness={lerp(0.9, 0.45, smooth)} sheen={smooth} flatShading={smooth < 0.6} /></mesh>
      {/* los grumos de harina que desaparecen */}
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} visible={smooth < 0.7 - i * 0.05} position={[(rn(i, 2) - 0.5) * 0.1, 0.07, (rn(i, 3) - 0.5) * 0.1]}><sphereGeometry args={[0.008, 8, 6]} /><meshStandardMaterial color="#f2eee6" roughness={1} /></mesh>)}
    </group>
    {/* las manos: empujan con el talón hacia adelante */}
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.05, 0.062 - push * 0.012, 0.075 - push * 0.06]} rotation={[0.5 + push * 0.3, sd * 0.25, 0]}><Hand curl={0.25 - push * 0.15} col="#c48a64" /></group>)}
    {/* la bolsa de harina detrás */}
  </>;
}}</Scene3D>;

// ---- 19:40 · HASTA QUE DOBLE: el bol tapado con el repasador en el estante tibio sobre la cocina; el repasador sube hasta la segunda raya del bol ----
export const HRise: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" bg="#1c1611" key1={[-0.6, 1.4, 1.2]} warm={0.85}
  cam={{ at: [0, 0.18, 0], az: [0.2, -0.05], el: [0.1, 0.08], r: [0.7, 0.62], fov: 30 }}>{(tt) => {
  const r = eio(tt, 0.6, 4.8);
  return <>
    {/* el estante sobre la cocina y la cocina abajo */}
    <RBox s={[0.8, 0.025, 0.22]} p={[0, 0.1, 0]} r={0.004}>{M.wood({ base: [150, 106, 66] })}</RBox>
    <RBox s={[0.8, 0.16, 0.3]} p={[0, -0.12, 0.05]} r={0.01}><meshStandardMaterial color="#1e1d1c" metalness={0.5} roughness={0.5} /></RBox>
    {/* el calorcito que sube de la cocina */}
    {Array.from({ length: 8 }, (_, i) => { const u = (tt * 0.45 + i / 8) % 1; return <mesh key={i} position={[(i - 3.5) * 0.09, -0.03 + u * 0.12, 0.08]}><sphereGeometry args={[0.02, 8, 6]} /><meshBasicMaterial color="#ffcf8a" transparent opacity={0.1 * Math.sin(u * PI)} depthWrite={false} /></mesh>; })}
    {/* el bol de loza con dos rayas: el nivel de la masa y el doble */}
    <group position={[0, 0.113, 0]}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.13, 0.09, 0.14, 40, 1, true]} />{M.porcelain({ col: "#2f5577", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.1305, 0.0905, 0.012, 40, 1, true]} /><meshStandardMaterial color="#3d6a9a" roughness={0.4} side={THREE.DoubleSide} /></mesh>
      {/* la masa adentro: el domo sube */}
      <mesh position={[0, 0.07, 0]} scale={[1, lerp(0.35, 1.0, r), 1]}><sphereGeometry args={[0.122, 36, 16, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color="#eadcc0" roughness={0.55} sheen={0.6} /></mesh>
      {/* el repasador a cuadros apoyado sobre la masa */}
      {/* el repasador doblado al costado del bol */}
      <RBox s={[0.16, 0.02, 0.12]} p={[0.26, -0.003, 0.02]} r={0.008}><meshStandardMaterial map={check("rise", "#a8322a")} roughness={0.95} /></RBox>
      {/* la raya del doble en el bol */}
      <mesh position={[0, 0.135, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.128, 0.0026, 6, 48, PI]} /><meshBasicMaterial color="#f2d22a" /></mesh>
    </group>
    {/* el reloj de bolsillo de papá al lado (una hora) */}
    <group position={[0.28, 0.12, 0.02]} rotation={[-1.1, 0, 0]}>
      <mesh><cylinderGeometry args={[0.03, 0.03, 0.01, 30]} />{M.brass()}</mesh>
      <mesh position={[0, 0.0055, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.026, 30]} /><meshStandardMaterial color="#f4efe2" /></mesh>
      <group rotation={[0, -r * PI * 2, 0]}><mesh position={[0, 0.007, -0.01]}><boxGeometry args={[0.002, 0.001, 0.02]} /><meshBasicMaterial color="#1a1a1a" /></mesh></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 20:07 · SUENA HUECO: el pan dado vuelta; el nudillo golpea dos veces la base y salen los anillos del sonido; en el corte, la miga aireada ----
export const HThump: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#18130e" key1={[-0.8, 1.4, 1.2]}
  cam={{ at: [0.04, 0.12, 0], az: [-0.35, -0.15], el: [0.22, 0.18], r: [0.7, 0.62], fov: 30 }}>{(tt) => {
  const flip = eio(tt, 0.2, 1.1), knocks = [1.6, 2.4], kn = knocks.map((a) => Math.exp(-Math.max(0, tt - a) * 6) * (tt > a ? 1 : 0)), rings = knocks.map((a) => cl((tt - a) / 1.1));
  return <>
    {/* el pan: gira hasta quedar boca abajo */}
    <group position={[0, 0.07, 0]} rotation={[0, 0, PI * flip]}>
      <group position={[0, -0.06, 0]}><Loaf b={1} /></group>
    </group>
    {/* la mano con el nudillo: baja y golpea en cada golpe */}
    <group position={[0.02, 0.2 + 0.05 * (1 - Math.max(kn[0], kn[1])), 0.02]} rotation={[PI / 2, 0, 0.2]} visible={flip > 0.9}><Hand curl={1} col="#c48a64" /></group>
    {/* los anillos del sonido hueco */}
    {rings.map((u, i) => u <= 0 || u >= 1 ? null : [0, 1].map((j) => <mesh key={i + "-" + j} position={[0, 0.14, 0]} rotation={[PI / 2, 0, 0]} scale={0.6 + (u + j * 0.25) * 2.4}><torusGeometry args={[0.06, 0.0018, 6, 48]} /><meshBasicMaterial color="#f4e2b8" transparent opacity={0.6 * (1 - u)} depthWrite={false} /></mesh>))}
    {/* la rebanada cortada al costado: la miga con agujeritos */}
    <group position={[0.24, 0.0, 0.06]} rotation={[0, -0.6, 0]}>
      <mesh position={[0, 0.06, 0]} rotation={[0, 0, 0]}><boxGeometry args={[0.012, 0.11, 0.1]} /><meshStandardMaterial color={loafCol(1)} roughness={0.7} /></mesh>
      <mesh position={[0.0065, 0.06, 0]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.09, 0.1]} /><meshStandardMaterial map={tex.text("crumb", 128, 128, (g) => { g.fillStyle = "#efe2c4"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 70; i++) { g.fillStyle = "rgba(170,140,90,.55)"; g.beginPath(); g.ellipse(rn(i, 2) * 128, rn(i, 3) * 128, 2 + 4 * rn(i, 4), 1.5 + 3 * rn(i, 5), rn(i, 6) * 3, 0, 6.3); g.fill(); } })} roughness={0.95} /></mesh>
    </group>
    {/* la rejilla donde se enfría */}
    {Array.from({ length: 9 }, (_, i) => <mesh key={"g" + i} position={[(i - 4) * 0.035, 0.004, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.002, 0.002, 0.24, 6]} />{M.steel()}</mesh>)}
  </>;
}}</Scene3D>;

// ---- 20:28 · EL TALÓN CALIENTE: el cuchillo corta la punta del primer pan recién salido; la punta se separa, le cae la manteca y se derrite ----
export const HHeelbutter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#19140f" lamp={[0.1, 0.45, 0.3]}
  cam={{ at: [0.04, 0.06, 0], az: [0.4, 0.2], el: [0.42, 0.36], r: [0.6, 0.52], fov: 30 }}>{(tt) => {
  const cut = eio(tt, 0.3, 1.5), slide = eio(tt, 1.5, 2.3), butter = phys(tt, 2.4, 8, 0.5), melt = eio(tt, 2.9, 5.2);
  return <>
    <RBox s={[0.5, 0.025, 0.3]} p={[0, 0.012, 0]} r={0.012}>{M.wood({ base: [196, 154, 104] })}</RBox>
    <group position={[-0.04, 0.025, 0]}><Loaf b={1} /></group>
    {/* el talón: se separa y se acuesta mostrando la miga */}
    <group position={[0.075 + slide * 0.09, 0.025 + 0.05 * Math.sin(slide * PI) * 0.4, 0.0]} rotation={[0, 0, -slide * PI / 2]}>
      <RBox s={[0.03, 0.08, 0.1]} p={[0.015, 0.04, 0]} r={0.015}><meshStandardMaterial color={loafCol(1)} roughness={0.75} /></RBox>
      <mesh position={[0, 0.045, 0]} rotation={[0, -PI / 2, 0]}><planeGeometry args={[0.095, 0.085]} /><meshStandardMaterial color="#efe0c0" roughness={0.95} /></mesh>
      {/* la manteca que cae y se derrite en la miga */}
      <group position={[-0.006, 0.045, 0]} rotation={[0, 0, PI / 2]}>
        <RBox s={[0.028 + 0.03 * melt, 0.012 * (1 - melt * 0.8) + 0.002, 0.02 + 0.03 * melt]} p={[0, 0.006 + 0.2 * (1 - butter), 0]} r={0.004}><meshPhysicalMaterial color="#f2d870" roughness={lerp(0.4, 0.1, melt)} clearcoat={melt} /></RBox>
      </group>
    </group>
    {/* el cuchillo de sierra que baja */}
    <group position={[0.07, lerp(0.22, 0.08, cut), 0.0]} rotation={[0, PI / 2, 0]} visible={slide < 0.9}>
      <RBox s={[0.2, 0.03, 0.002]} p={[0, 0, 0]} r={0.001}>{M.steel()}</RBox>
      <RBox s={[0.09, 0.022, 0.014]} p={[0.14, 0.004, 0]} r={0.006}>{M.wood({ base: [80, 50, 30] })}</RBox>
    </group>
    {/* el vapor del pan recién salido */}
    {Array.from({ length: 5 }, (_, i) => { const u = (tt * 0.45 + i / 5) % 1; return <mesh key={i} position={[0.08 + (rn(i, 3) - 0.5) * 0.06, 0.1 + u * 0.18, (rn(i, 4) - 0.5) * 0.06]}><sphereGeometry args={[0.02 + 0.025 * u, 10, 8]} /><meshBasicMaterial color="#e8e2d6" transparent opacity={0.1 * Math.sin(u * PI) * cl(cut * 2)} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 22:19 · HASTA LA PRÓXIMA: los cuatro panes en la mesa; el repasador a cuadros cae despacio y los tapa ----
export const HBreadcloth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#16110c" key1={[-0.7, 1.5, 1.3]} lamp={[0, 0.55, 0.2]}
  cam={{ at: [0, 0.06, 0], az: [-0.3, -0.05], el: [0.35, 0.3], r: [0.85, 0.95], fov: 30 }}>{(tt) => {
  const fall = eio(tt, 0.8, 3.2), drape = phys(tt, 3.0, 5, 0.6);
  return <>
    <RBox s={[0.9, 0.03, 0.5]} p={[0, 0.015, 0]} r={0.008}>{M.wood({ base: [150, 104, 62], rx: 2 })}</RBox>
    {[0, 1, 2, 3].map((i) => <group key={i} position={[((i % 2) - 0.5) * 0.24, 0.03, (Math.floor(i / 2) - 0.5) * 0.14]} rotation={[0, (rn(i, 2) - 0.5) * 0.2, 0]}><Loaf b={0.9 + 0.1 * rn(i, 3)} s={0.95} /></group>)}
    {/* el repasador: baja en el aire con una onda y se acomoda sobre los panes */}
    <mesh position={[0, lerp(0.5, 0.19, fall) - 0.02 * drape, 0]} rotation={[-PI / 2 + Math.sin(tt * 2) * 0.08 * (1 - fall), 0, 0.15]}>
      <planeGeometry args={[0.6, 0.42, 1, 1]} /><meshStandardMaterial map={check("cloth", "#2d5d9a")} roughness={0.95} side={THREE.DoubleSide} transparent opacity={lerp(0.98, 0.94, drape)} />
    </mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.3, lerp(0.5, 0.12, fall), 0]} rotation={[0, 0, sd * lerp(0, 1.25, drape)]} visible={fall > 0.9}><planeGeometry args={[0.14, 0.42]} /><meshStandardMaterial map={check("cloth", "#2d5d9a")} roughness={0.95} side={THREE.DoubleSide} /></mesh>)}
    {/* la lámpara de la cocina: se entibia */}
    <pointLight position={[0.1, 0.6, 0.2]} color="#ffbe6a" intensity={0.6 * (0.6 + 0.4 * drape)} distance={1.4} />
  </>;
}}</Scene3D>;
