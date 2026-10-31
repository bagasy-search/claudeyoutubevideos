// lfh29a · componentes únicos 22-27 (la mesa de herramientas, el marcador que escribe el frasco, las migas que invitan, la panera que se cierra, la masilla que tapa la rendija, la tarjeta en la puerta de la alacena).
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Ant, BoraxBox, Glove, Jar, Powder, SugarBowl } from "./lf";

const PI = Math.PI;

// ---- 14:53 · TODO LO QUE HACE FALTA: guantes, caja, frasco, azúcar, algodones, tapas y pincel llegan de a uno a la mesa, cada uno con su peso ----
export const HToolset: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none"
  cam={{ at: [0, 0.05, 0.03], az: [-0.25, 0.2], el: [0.9, 0.78], r: [1.1, 0.98], fov: 30 }}>{(tt) => {
  const P = (i: number) => phys(tt, 0.2 + i * 0.55, 8, 0.35), Y = (i: number, h0 = 0.5) => (1 - P(i)) * h0;
  return <>
    <group position={[-0.42, Y(0), -0.12]} rotation={[0, 0.4, 0]}><BoraxBox s={0.8} /></group>
    <group position={[-0.15, Y(1), -0.14]}><Jar r={0.05} h={0.12} lid={1} /></group>
    {/* bolsa de azúcar de papel */}
    <group position={[0.12, Y(2), -0.14]}><RBox s={[0.12, 0.16, 0.07]} p={[0, 0.08, 0]} r={0.02}><meshStandardMaterial map={tex.text("sug", 256, 256, (g) => { g.fillStyle = "#f4f1ea"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#2d5d9a"; g.font = "900 54px Georgia"; g.textAlign = "center"; g.fillText("SUGAR", 128, 140); })} roughness={0.9} /></RBox></group>
    {/* algodones */}
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0.38 + (i % 3) * 0.035, 0.016 + Y(3, 0.4), -0.12 + Math.floor(i / 3) * 0.035]}><icosahedronGeometry args={[0.016, 2]} /><meshPhysicalMaterial color="#fbf8f1" roughness={1} sheen={1} sheenColor="#ffffff" /></mesh>)}
    <group position={[-0.34, 0.02 + Y(4, 0.4), 0.2]} rotation={[-PI / 2 + 0.2, 0, 0.5]}><Glove /></group>
    {/* tapas de frascos viejas */}
    {[0, 1, 2].map((i) => <mesh key={i} position={[-0.02 + i * 0.08, 0.005 + Y(5, 0.4), 0.2]}><cylinderGeometry args={[0.03, 0.03, 0.01, 28]} />{M.steel({ col: "#d8cfb8" })}</mesh>)}
    {/* pincel seco */}
    <group position={[0.3, 0.01 + Y(6, 0.4), 0.2]} rotation={[0, 0.6, PI / 2]}>
      <mesh><cylinderGeometry args={[0.006, 0.006, 0.16, 10]} />{M.wood({ base: [196, 150, 96] })}</mesh>
      <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.009, 0.007, 0.03, 12]} />{M.steel()}</mesh>
      <mesh position={[0, 0.12, 0]}><coneGeometry args={[0.009, 0.035, 12]} /><meshStandardMaterial color="#c9a46a" roughness={1} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 15:13 · ESCRIBILO EN EL FRASCO: un marcador negro escribe sobre la cinta de papel; la tinta aparece letra por letra ----
const LABEL = "ANT BAIT · POISON";
export const HLabel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile"
  cam={{ at: [0, 0.08, 0.05], az: [0.2, -0.1], el: [0.12, 0.08], r: [0.42, 0.34], fov: 28 }}>{(tt) => {
  const k = eio(tt, 0.6, 4.4), n = Math.floor(k * LABEL.length);
  const tx = tex.text("lab" + n, 1024, 128, (g) => { g.fillStyle = "#efe2bf"; g.fillRect(0, 0, 1024, 128); g.fillStyle = "#151311"; g.font = "700 72px 'Comic Sans MS', cursive"; g.fillText(LABEL.slice(0, n), 30, 92); });
  const tipx = -0.1 + 0.18 * k;
  return <>
    <Jar r={0.07} h={0.17} lv={0.65} liq="#efe6cc" />
    {/* cinta de papel envuelta */}
    <mesh position={[0, 0.085, 0]}><cylinderGeometry args={[0.0712, 0.0712, 0.03, 48, 1, true, -0.85, 1.7]} /><meshStandardMaterial map={tx} roughness={0.85} side={2} /></mesh>
    {/* marcador */}
    <group position={[tipx, 0.085 + 0.006 * Math.sin(tt * 18), 0.074 + 0.01 * (1 - cl(tt * 3))]} rotation={[0.9, 0, -0.5]}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.009, 0.009, 0.12, 20]} /><meshStandardMaterial color="#1b1b1b" roughness={0.4} /></mesh>
      <mesh position={[0, 0.005, 0]}><coneGeometry args={[0.006, 0.014, 12]} /><meshStandardMaterial color="#0c0c0c" /></mesh>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.0095, 0.0095, 0.03, 20]} /><meshStandardMaterial color="#f2f2f2" roughness={0.4} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 16:50 · LA ALFOMBRA DE BIENVENIDA: migas y un plato sucio en la mesada; las hormigas convergen; pasa el trapo y se dispersan ----
export const HWelcome: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="tile"
  cam={{ at: [0, 0.02, 0], az: [0.1, -0.15], el: [0.85, 0.75], r: [0.9, 0.8], fov: 30 }}>{(tt) => {
  const wipe = eio(tt, 2.4, 5.0), xr = lerp(-0.34, 0.34, wipe), rag = cl((tt - 1.9) * 2);
  return <>
    {/* plato con restos de dulce */}
    <group position={[0.15, 0, -0.05]}><mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.09, 0.065, 0.012, 40]} />{M.porcelain()}</mesh><mesh position={[0, 0.012, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.088, 0.006, 10, 48]} />{M.porcelain({ col: "#f3efe6" })}</mesh><mesh position={[0, 0.0126, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.078, 0.0015, 6, 48]} /><meshStandardMaterial color="#3b6aa0" /></mesh><mesh position={[0.02, 0.0125, 0.01]} rotation={[-PI / 2, 0, 0]} scale={[1.4, 1, 1]}><circleGeometry args={[0.022, 24]} /><meshPhysicalMaterial color="#9a3a1e" roughness={0.1} clearcoat={1} /></mesh></group>
    {/* migas que el trapo se lleva */}
    {Array.from({ length: 50 }, (_, i) => { const x = (rn(i, 2) - 0.5) * 0.5, z = (rn(i, 3) - 0.5) * 0.3; if (x < xr - 0.04) return null; return <mesh key={i} position={[x, 0.004, z]} rotation={[rn(i, 4) * 3, rn(i, 5) * 3, 0]}><dodecahedronGeometry args={[0.006 + 0.005 * rn(i, 6), 0]} /><meshStandardMaterial color="#a8742e" roughness={0.9} /></mesh>; })}
    {Array.from({ length: 18 }, (_, i) => { const a = rn(i, 7) * 6.3, conv = eio(tt, 0.2, 2.6), scat = wipe; const r = lerp(0.45, 0.08 + rn(i, 8) * 0.05, conv) + scat * 0.5;
      return <Ant key={i} p={[0.1 + Math.cos(a) * r, 0.001, -0.05 + Math.sin(a) * r * 0.7]} yaw={-a + (scat > 0.05 ? 0 : PI)} ph={tt * 3 + i} s={1.5} />; })}
    {/* el trapo húmedo */}
    <group visible={rag > 0 && wipe < 1} position={[xr - 0.02, 0.016 + 0.08 * (1 - rag), 0]} rotation={[0, 0.15 * Math.sin(tt * 5), 0.05 * Math.sin(tt * 9)]}>
      <RBox s={[0.13, 0.028, 0.3]} r={0.012}><meshStandardMaterial map={tex.text("towel", 128, 256, (g) => { g.fillStyle = "#f4efe4"; g.fillRect(0, 0, 128, 256); g.fillStyle = "rgba(178,52,40,.75)"; for (let i = 0; i < 8; i++) { g.fillRect(i * 16, 0, 7, 256); g.fillRect(0, i * 32, 128, 12); } })} roughness={0.95} /></RBox>
      {/* una mano que empuja el trapo */}
      <mesh position={[0, 0.03, 0]} scale={[1.1, 0.55, 1.3]}><sphereGeometry args={[0.045, 20, 14]} /><meshStandardMaterial color="#e0a888" roughness={0.6} /></mesh>
      <mesh position={[-0.11, 0.05, 0.02]} rotation={[0, 0, -1.3]}><capsuleGeometry args={[0.03, 0.15, 8, 14]} /><meshStandardMaterial color="#e0a888" roughness={0.6} /></mesh>
    </group>
    {/* lo limpio brilla atrás del trapo */}
    <mesh position={[(xr - 0.4) / 2, 0.0015, 0]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, xr + 0.4), 1, 1]}><planeGeometry args={[1, 0.32]} /><meshPhysicalMaterial color="#c9c0b0" roughness={0.1} clearcoat={1} transparent opacity={0.35} /></mesh>
  </>;
}}</Scene3D>;

// ---- 17:04 · LA PANERA: la tapa de persiana se cierra sobre el pan; dos hormigas llegan, tocan la madera y se dan vuelta ----
export const HBreadbox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile"
  cam={{ at: [0, 0.08, 0.12], az: [0.45, 0.25], el: [0.32, 0.26], r: [1.0, 0.85], fov: 30 }}>{(tt) => {
  const close = eio(tt, 1.6, 3.0);
  return <>
    {/* caja de madera de frente abierto: piso, techo, fondo y costados */}
    <RBox s={[0.36, 0.015, 0.22]} p={[0, 0.0075, 0]} r={0.004}>{M.wood({ base: [150, 100, 58] })}</RBox>
    <RBox s={[0.36, 0.015, 0.22]} p={[0, 0.2, 0]} r={0.004}>{M.wood({ base: [150, 100, 58] })}</RBox>
    <RBox s={[0.36, 0.2, 0.015]} p={[0, 0.1, -0.105]} r={0.004}>{M.wood({ base: [130, 86, 48] })}</RBox>
    {[-0.175, 0.175].map((x) => <RBox key={x} s={[0.015, 0.2, 0.22]} p={[x, 0.1, 0]} r={0.004}>{M.wood({ base: [140, 92, 52] })}</RBox>)}
    {/* la tapa de tablitas que baja desde arriba y cierra el frente */}
    <group position={[0, 0.2, 0.11]} rotation={[-PI / 2 + (PI / 2) * close, 0, 0]}>
      {Array.from({ length: 8 }, (_, i) => <RBox key={i} s={[0.34, 0.022, 0.012]} p={[0, -0.012 - i * 0.024, 0.006]} r={0.004}>{M.wood({ base: [176, 122, 72] })}</RBox>)}
      <mesh position={[0, -0.18, 0.02]}><sphereGeometry args={[0.01, 12, 10]} />{M.brass()}</mesh>
    </group>
    {/* el pan adentro */}
    <mesh position={[0, 0.06, 0]} scale={[1.8, 0.9, 0.9]}><sphereGeometry args={[0.055, 24, 16]} /><meshStandardMaterial color="#c88a44" roughness={0.8} /></mesh>
    {[0, 1].map((i) => { const u = cl((tt - 2.9 - i * 0.3) / 1.1), back = cl((tt - 4.3 - i * 0.3) / 1.1); const z = lerp(0.36, 0.15, u) + back * 0.25; return <Ant key={i} p={[-0.05 + i * 0.1, 0.001, z]} yaw={back > 0 ? -PI / 2 : PI / 2} ph={tt * 3 + i} s={2.4} />; })}
  </>;
}}</Scene3D>;

// ---- 18:08 · LA RENDIJA QUE YA NO ESTÁ: la pistola de masilla corre un cordón blanco por la grieta del zócalo; la hormiga llega y no encuentra por dónde ----
export const HCaulk: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none"
  cam={{ at: [0.02, 0.04, 0.05], az: [0.55, 0.35], el: [0.55, 0.45], r: [0.66, 0.54], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.5, 3.4), x = lerp(-0.25, 0.25, k), ant = cl((tt - 3.6) / 1.5);
  return <>
    <RBox s={[0.7, 0.3, 0.02]} p={[0, 0.15, -0.02]} r={0.002}><meshStandardMaterial color="#e8e1d2" roughness={0.7} /></RBox>
    <RBox s={[0.7, 0.07, 0.02]} p={[0, 0.035, 0.0]} r={0.004}>{M.wood({ base: [96, 62, 38] })}</RBox>
    {/* la grieta oscura */}
    <mesh position={[0, 0.002, 0.012]}><boxGeometry args={[0.6, 0.004, 0.004]} /><meshBasicMaterial color="#050505" /></mesh>
    {/* cordón de masilla */}
    <mesh position={[(x - 0.25) / 2 - 0.0, 0.003, 0.012]} rotation={[0, 0, PI / 2]} scale={[1, Math.max(0.001, x + 0.25), 1]}><capsuleGeometry args={[0.005, 1, 4, 10]} />{M.porcelain()}</mesh>
    <group position={[x + 0.02, 0.05, 0.05]} rotation={[0.5, 0, 0.9]}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.02, 0.02, 0.12, 20]} />{M.plastic({ col: "#f2f0ea" })}</mesh>
      <mesh position={[0, 0.0, 0]}><coneGeometry args={[0.008, 0.04, 14]} />{M.plastic({ col: "#f2f0ea" })}</mesh>
      <mesh position={[0, 0.14, 0]}><boxGeometry args={[0.05, 0.03, 0.02]} />{M.steel({ col: "#c23a2a" })}</mesh>
    </group>
    <Ant p={[0.12, 0.001, lerp(0.2, 0.03, ant) + 0.02 * Math.sin(tt * 3) * (ant >= 1 ? 1 : 0)]} yaw={ant >= 1 ? PI / 2 + Math.sin(tt * 2) : PI / 2} ph={tt * 3} s={2.0} />
  </>;
}}</Scene3D>;

// ---- 19:43 · ADENTRO DE LA PUERTA: la puerta de la alacena se abre y adentro está la tarjeta de la receta pegada con cinta ----
const CARD = ["ANT BAIT", "1 tbsp borax", "1/2 cup sugar"];
export const HCabinetcard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" bg="#1a1410"
  cam={{ at: [-0.3, 0.42, 0.18], az: [1.05, 1.3], el: [0.08, 0.05], r: [0.75, 0.55], fov: 30 }}>{(tt) => {
  const op = eio(tt, 0.4, 1.8), tape = cl((tt - 2.0) * 2);
  const card = tex.text("card", 512, 340, (g) => { g.fillStyle = "#fbf7ea"; g.fillRect(0, 0, 512, 340); g.strokeStyle = "#9cb8d8"; for (let i = 1; i < 9; i++) { g.beginPath(); g.moveTo(0, 30 + i * 36); g.lineTo(512, 30 + i * 36); g.stroke(); } g.strokeStyle = "#e08a8a"; g.beginPath(); g.moveTo(40, 0); g.lineTo(40, 340); g.stroke(); g.fillStyle = "#1e2a4a"; CARD.forEach((l, i) => { g.font = (i ? "700 50px" : "900 62px") + " 'Comic Sans MS', cursive"; g.fillText(l, 60, 92 + i * 100); }); });
  return <>
    {/* pared de la cocina detrás, con su empapelado */}
    <mesh position={[0, 0.4, -0.31]}><planeGeometry args={[3, 2]} /><meshStandardMaterial map={tex.text("wallp", 256, 256, (g) => { g.fillStyle = "#e9dcc0"; g.fillRect(0, 0, 256, 256); g.fillStyle = "rgba(150,90,70,.35)"; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.beginPath(); g.arc(i * 32 + (j % 2) * 16, j * 32, 4, 0, 6.3); g.fill(); } })} roughness={0.9} /></mesh>
    {/* caja de la alacena */}
    <RBox s={[0.5, 0.6, 0.3]} p={[0, 0.4, -0.15]} r={0.006}>{M.wood({ base: [196, 166, 120] })}</RBox>
    {[0.25, 0.48].map((y) => <group key={y} position={[0, y, -0.02]}>{[-0.15, 0, 0.15].map((x, i) => <mesh key={x} position={[x, 0.06, 0]}><cylinderGeometry args={[0.035, 0.035, 0.11, 24]} /><meshStandardMaterial color={["#b8442e", "#e0b03a", "#4c7a3a"][i]} metalness={0.3} roughness={0.5} /></mesh>)}</group>)}
    {/* la puerta que gira sobre su bisagra izquierda */}
    <group position={[-0.25, 0.4, 0.005]} rotation={[0, -2.0 * op, 0]}>
      <RBox s={[0.5, 0.6, 0.02]} p={[0.25, 0, 0]} r={0.006}>{M.wood({ base: [206, 176, 130] })}</RBox>
      <mesh position={[0.25, 0.02, -0.012]} rotation={[0, PI, 0]}><planeGeometry args={[0.36, 0.24]} /><meshStandardMaterial map={card} roughness={0.85} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[0.25 + s * 0.17, 0.14, -0.013]} rotation={[0, PI, s * 0.6]} scale={[Math.max(0.01, tape), 1, 1]}><planeGeometry args={[0.07, 0.025]} /><meshStandardMaterial color="#f3e8c8" transparent opacity={0.8} /></mesh>)}
      <mesh position={[0.46, 0, 0.02]}><sphereGeometry args={[0.012, 14, 10]} />{M.brass()}</mesh>
    </group>
  </>;
}}</Scene3D>;
