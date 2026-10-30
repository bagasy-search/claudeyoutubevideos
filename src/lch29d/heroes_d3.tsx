// lch29d · componentes únicos 15-20 (la toalla que se pone gris vuelta a vuelta, el jugo de uva, el aro que vuelve a subir, el alcohol en el trapo, la tela de prueba bajo el cojín, el ventilador que seca).
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Cushion, Fabric, Fan, Hand, Spot, Towel } from "./sofa";

const PI = Math.PI;

// ---- 9:51 · LA TOALLA SE PONE GRIS RONDA TRAS RONDA: tres toallas caen en fila, cada una con la marca más clara; la mancha del cojín se va apagando ----
export const HGrayTowel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="tile" bg="#16120e" key1={[-0.6, 1.4, 1.2]}
  cam={{ at: [0, 0.02, 0.05], az: [-0.25, 0.1], el: [0.62, 0.7], r: [0.95, 0.85], fov: 32 }}>{(tt) => {
  const kk = [0.5, 1.6, 2.7].map((a) => cl(phys(tt, a, 7, 0.5)));
  return <>
    {/* el cojín, adelante, con la mancha que se apaga */}
    <Cushion w={0.42} d={0.3} h={0.08} p={[0, 0.04, 0.3]} />
    <Spot r={0.07} col="#4a4a46" op={lerp(0.85, 0.2, eio(tt, 0.5, 3.8))} p={[0, 0.081, 0.3]} />
    {kk.map((k, i) => k > 0.01 && <group key={i} position={[(i - 1) * 0.3, 0.004 + 0.25 * (1 - k), -0.05]} rotation={[0, (i - 1) * 0.08, 0]}>
      <Towel w={0.24} d={0.18} marks={[{ x: 0, z: 0, r: 0.06, k: [0.85, 0.5, 0.2][i], col: "#4b4a45" }]} />
    </group>)}
    {/* los numeritos de cada ronda, escritos en cinta de papel */}
    {kk.map((k, i) => k > 0.5 && <RBox key={"c" + i} s={[0.06, 0.002, 0.025]} p={[(i - 1) * 0.3 + 0.08, 0.008, 0.05]} rot={[0, 0.2, 0]} r={0.001}>
      <meshStandardMaterial map={tex.text("ronda" + i, 96, 40, (g) => { g.fillStyle = "#e8d9b0"; g.fillRect(0, 0, 96, 40); g.fillStyle = "#3a2a1a"; g.font = "bold 28px Georgia"; g.textAlign = "center"; g.fillText(String(i + 1), 48, 30); })} /></RBox>)}
  </>;
}}</Scene3D>;

// ---- 10:28 · JUGO DE UVA: el vaso se vuelca, el charco violeta crece; la toalla doblada baja y aprieta; se chupa lo que todavía está mojado ----
export const HGrapeBlot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#14100d" key1={[-0.7, 1.3, 1.3]}
  cam={{ at: [0, 0.04, 0], az: [0.4, 0.3], el: [0.5, 0.58], r: [0.72, 0.62], fov: 30 }}>{(tt) => {
  const tip = eio(tt, 0.2, 0.8), pool = eio(tt, 0.6, 1.8), press = cl(phys(tt, 2.2, 6, 0.5)) * (1 - eio(tt, 3.8, 4.2)), soak = eio(tt, 2.5, 3.8);
  return <>
    <Cushion w={0.7} d={0.5} h={0.1} p={[0, -0.05, 0]} />
    <Spot r={lerp(0.02, 0.12, pool) * lerp(1, 0.7, soak)} col="#5a1f5e" op={lerp(0.9, 0.35, soak)} p={[0.02, 0.0012, 0.02]} />
    {/* el líquido brillante arriba de la tela, que la toalla se lleva */}
    <mesh position={[0.02, 0.003, 0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[lerp(0.01, 0.09, pool), 40]} />{M.water({ col: "#6a2070", op: 0.7 * (1 - soak) })}</mesh>
    {/* el vaso de plástico que se vuelca */}
    <group position={[-0.16, 0.0, -0.08]} rotation={[0, 0.6, -tip * 1.45]}><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.035, 0.028, 0.12, 28, 1, true]} />{M.plastic({ col: "#e9f3ff", op: 0.5, side: 2 })}</mesh>
      {pool < 0.97 && <mesh position={[0, 0.06 - 0.03 * pool, 0]}><cylinderGeometry args={[0.032, 0.028, 0.08 * (1 - pool), 28]} />{M.water({ col: "#6a2070", op: 0.85 })}</mesh>}</group>
    {Array.from({ length: 10 }, (_, i) => { const ph = cl((tt - 0.5 - i * 0.06) / 0.5); return ph > 0 && ph < 1 && <mesh key={i} position={[lerp(-0.12, 0.0, ph), 0.05 * (1 - ph), lerp(-0.07, 0.02, ph)]}><sphereGeometry args={[0.008, 10, 8]} />{M.water({ col: "#6a2070", op: 0.9 })}</mesh>; })}
    {/* la toalla doblada que aprieta, con la mano encima */}
    {tt > 2.0 && <group position={[0.02 + 0.1 * eio(tt, 3.9, 4.6), 0.02 + 0.07 * (1 - press), 0.02 + 0.05 * eio(tt, 3.9, 4.6)]}>
      <Towel w={0.2} d={0.14} marks={[{ x: 0, z: 0, r: 0.07, k: 0.8 * soak, col: "#6a2a6e" }]} />
      <group position={[0, 0.02, -0.02]}><Hand grip={0.1} /></group>
    </group>}
  </>;
}}</Scene3D>;

// ---- 11:18 · LA MANCHA VUELVE A SUBIR: corte de la espuma; lo que quedó adentro sube por los hilos como mecha mientras se seca y aparece el aro ----
export const HWickRing: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#13100d" key1={[-0.9, 1.1, 1.3]}
  cam={{ at: [0, 0.05, 0], az: [0.0, 0.25], el: [0.12, 0.38], r: [0.6, 0.62], fov: 32 }}>{(tt) => {
  const rise = eio(tt, 0.6, 3.0), ring = eio(tt, 2.2, 3.8);
  return <>
    <RBox s={[0.6, 0.14, 0.2]} p={[0, -0.07, 0]} r={0.004}><meshStandardMaterial color="#e8d27a" roughness={1} /></RBox>
    <RBox s={[0.6, 0.02, 0.2]} p={[0, 0.01, 0]} r={0.003}><Fabric rep={1} /></RBox>
    {/* la mancha escondida en la espuma, un charco marrón que se achica */}
    <mesh position={[0, -0.06, 0.101]} scale={[1, 0.45, 1]}><circleGeometry args={[lerp(0.14, 0.05, rise), 40]} /><meshBasicMaterial color="#7a5226" transparent opacity={0.75} /></mesh>
    {/* los hilos: gotitas que suben en columnas hacia los bordes */}
    {Array.from({ length: 40 }, (_, i) => { const col = (i % 8) - 3.5, x = col * 0.035, ph = (tt * 0.55 + rn(i, 2)) % 1; const edge = Math.abs(col) > 2.4;
      return rise > 0 && <mesh key={i} position={[x * (edge ? 1 : 0.6), lerp(-0.06, 0.012, ph), 0.102]}><circleGeometry args={[0.0035 + (edge ? 0.002 : 0), 8]} /><meshBasicMaterial color="#6b4520" transparent opacity={rise * (1 - ph * 0.4)} /></mesh>; })}
    {/* arriba, vista en el borde: el aro oscuro que aparece al secarse */}
    <mesh position={[0, 0.021, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.1, 0.13, 48]} /><meshBasicMaterial color="#5a3a18" transparent opacity={0.8 * ring} /></mesh>
    <mesh position={[0, 0.0205, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.1, 48]} /><meshBasicMaterial color="#c8a878" transparent opacity={0.25 * ring} /></mesh>
  </>;
}}</Scene3D>;

// ---- 12:04 · EL ALCOHOL VA EN EL TRAPO, NO EN EL SOFÁ: la botella marrón inclina y moja la punta del trapo; el trapo tocando la marca de birome, la tinta pasa al trapo ----
const alcTex = () => tex.text("alc", 256, 200, (g) => { g.fillStyle = "#f4f1e6"; g.fillRect(0, 0, 256, 200); g.fillStyle = "#1f4a8a"; g.fillRect(0, 0, 256, 46); g.fillStyle = "#fff"; g.font = "bold 30px Arial"; g.textAlign = "center"; g.fillText("ISOPROPYL", 128, 34); g.fillStyle = "#1f2a3a"; g.font = "bold 34px Arial"; g.fillText("RUBBING", 128, 100); g.fillText("ALCOHOL", 128, 140); g.font = "20px Arial"; g.fillText("70%", 128, 178); });
export const HAlcoholDab: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#17120e" key1={[-0.7, 1.3, 1.2]}
  cam={{ at: [0, 0.1, 0], az: [0.45, 0.3], el: [0.32, 0.4], r: [0.85, 0.74], fov: 32 }}>{(tt) => {
  const pour = eio(tt, 0.4, 1.2) * (1 - eio(tt, 1.8, 2.3)), dab = Math.max(0, Math.sin((tt - 2.5) * 5)) * cl((tt - 2.5) * 3), gone = eio(tt, 2.6, 4.2);
  return <>
    <Cushion w={0.5} d={0.4} h={0.08} p={[0.12, 0.04, 0.05]} />
    {/* la raya de birome en la tela */}
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[0.06 + i * 0.008, 0.0815, 0.06 + 0.012 * Math.sin(i * 0.8)]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.004, 8]} /><meshBasicMaterial color="#1c2f8a" transparent opacity={1 - gone} /></mesh>)}
    {/* la botella marrón con su etiqueta */}
    <group position={[-0.2, 0.14 + 0.05 * pour, -0.05]} rotation={[0, 0.5, pour * 1.6]}>
      <mesh><cylinderGeometry args={[0.045, 0.045, 0.2, 32]} />{M.plastic({ col: "#5a3214", op: 0.92 })}</mesh>
      <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.0455, 0.0455, 0.11, 32, 1, true]} /><meshStandardMaterial map={alcTex()} side={2} /></mesh>
      <mesh position={[0, 0.115, 0]}><cylinderGeometry args={[0.02, 0.03, 0.03, 20]} />{M.plastic({ col: "#f2f2f2" })}</mesh>
    </group>
    {pour > 0.3 && Array.from({ length: 6 }, (_, i) => { const ph = (tt * 2.5 + i / 6) % 1; return <mesh key={i} position={[-0.08, 0.13 - 0.08 * ph, -0.03]}><sphereGeometry args={[0.005, 8, 6]} />{M.water({ col: "#dfe9f2", op: 0.8 })}</mesh>; })}
    {/* el trapo blanco: primero recibe el alcohol, después toca la tinta */}
    <group position={[lerp(-0.07, 0.1, eio(tt, 2.0, 2.5)), lerp(0.03, 0.09, eio(tt, 2.0, 2.5)) + 0.03 * (1 - dab) * cl(tt - 2.5), lerp(-0.02, 0.06, eio(tt, 2.0, 2.5))]}>
      <group rotation={[PI, 0, 0]}><Towel w={0.12} d={0.09} damp={eio(tt, 0.9, 1.6)} marks={[{ x: 0, z: 0, r: 0.03, k: 0.8 * gone, col: "#2a3a9a" }]} /></group>
      <group position={[0, 0.02, -0.02]}><Hand grip={0.3} /></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 12:38 · ABAJO DEL COJÍN HAY TELA DE PRUEBA: el cojín se levanta y se corre; abajo la base con el mismo floreado; una gotita de prueba y la toalla que se queda blanca ----
export const HUnderCushion: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" bg="#16110d" key1={[-0.6, 1.4, 1.3]}
  cam={{ at: [-0.05, 0.3, 0.08], az: [0.25, 0.4], el: [0.5, 0.62], r: [1.2, 0.7], fov: 32 }}>{(tt) => {
  const lift = eio(tt, 0.4, 1.6), drop = cl(phys(tt, 2.0, 7, 0.5)), test = eio(tt, 3.0, 3.8);
  return <>
    {/* la base del sofá y el respaldo */}
    <RBox s={[1.0, 0.3, 0.7]} p={[0, 0.15, 0]} r={0.04}><Fabric rep={2} /></RBox>
    <RBox s={[1.0, 0.5, 0.18]} p={[0, 0.5, -0.3]} r={0.06}><Fabric rep={2} /></RBox>
    {/* el cojín que sube, gira y se apoya contra el frente */}
    <group position={[lerp(0, 0.75, lift), 0.36 + 0.3 * Math.sin(lift * PI), lerp(0.05, 0.35, lift)]} rotation={[0, lift * 0.8, lift * 1.2]}><Cushion w={0.5} d={0.55} h={0.13} /></group>
    {/* la gotita de prueba que cae y moja */}
    {drop > 0.01 && drop < 0.98 && <mesh position={[-0.1, 0.5 - 0.19 * drop, 0.1]}><sphereGeometry args={[0.012, 12, 10]} />{M.water({ op: 0.85 })}</mesh>}
    <Spot r={0.04 * cl(drop * 1.2)} col="#8c7a5a" op={0.5} p={[-0.1, 0.302, 0.1]} />
    {/* la toalla que aprieta y sale limpia: no destiñe */}
    {test > 0 && <group position={[-0.1, 0.31 + 0.12 * (1 - test) + 0.05 * eio(tt, 4.2, 4.8), 0.1]}><group rotation={[PI, 0, 0]}><Towel w={0.14} d={0.1} /></group>
      <group position={[0, 0.02, -0.02]}><Hand grip={0.1} /></group></group>}
  </>;
}}</Scene3D>;

// ---- 13:28 · SECAR RÁPIDO: el ventilador arranca; las aspas giran, el aire pasa (hilos de luz) y la mancha húmeda se achica y desaparece ----
export const HFanDry: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" bg="#16110d" key1={[-0.6, 1.3, 1.3]}
  cam={{ at: [0.15, 0.22, 0], az: [0.55, 0.42], el: [0.45, 0.5], r: [1.3, 1.15], fov: 32 }}>{(tt) => {
  const on = eio(tt, 0.3, 1.2), dry = eio(tt, 1.2, 4.2);
  return <>
    <RBox s={[0.7, 0.3, 0.6]} p={[0.35, 0.15, 0]} r={0.04}><Fabric rep={2} /></RBox>
    <Spot r={lerp(0.2, 0.01, dry)} col="#4a3820" op={0.9} p={[0.3, 0.302, 0.0]} />
    <mesh position={[0.3, 0.303, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[lerp(0.1, 0.0, dry), 40]} />{M.water({ col: "#c9d6e0", op: 0.25 * (1 - dry) })}</mesh>
    <group position={[-0.35, 0.0, 0]} rotation={[0, PI / 2 - 0.15, 0]} scale={1.3}><Fan tt={tt} on={on} /></group>
    {/* hilos de aire */}
    {Array.from({ length: 14 }, (_, i) => { const ph = (tt * 0.9 + rn(i, 2)) % 1; return on > 0.3 && <mesh key={i} position={[lerp(-0.2, 0.6, ph), 0.25 + 0.12 * (rn(i, 3) - 0.5) + 0.03 * Math.sin(ph * 9 + i), (rn(i, 4) - 0.5) * 0.4]} rotation={[0, 0, 0]}>
      <boxGeometry args={[0.12, 0.002, 0.002]} />{M.glow({ col: "#dfeaf2", op: 0.35 * on * Math.sin(ph * PI) })}</mesh>; })}
    {/* vapor de la humedad que se va */}
    {Array.from({ length: 8 }, (_, i) => { const ph = (tt * 0.7 + rn(i, 6)) % 1; return dry < 0.9 && <mesh key={"v" + i} position={[0.3 + 0.25 * ph + (rn(i, 7) - 0.5) * 0.1, 0.31 + 0.1 * ph, (rn(i, 8) - 0.5) * 0.1]}><sphereGeometry args={[0.012 + 0.01 * ph, 10, 8]} />{M.glow({ col: "#eef3f6", op: 0.2 * (1 - ph) * (1 - dry) })}</mesh>; })}
  </>;
}}</Scene3D>;
void Hand;
