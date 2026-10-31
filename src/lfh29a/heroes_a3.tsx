// lfh29a · componentes únicos 15-21 (la arveja y la bolita, el mapa de calor de la cocina, la primera nevada, el motor de la heladera, el témpano bajo la mesada, salar las papas, dos vueltas en dos semanas).
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Ant, BoraxBox, Powder, Roach } from "./lf";

const PI = Math.PI;

// ---- 9:07 · DEL TAMAÑO DE UNA ARVEJA: una arveja verde y una bolita de masa blanca ruedan hasta quedar juntas sobre una regla de madera ----
export const HPea: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none"
  cam={{ at: [0, 0.03, 0.02], az: [-0.3, 0.12], el: [0.3, 0.26], r: [0.46, 0.38], fov: 28 }}>{(tt) => {
  const a = eio(tt, 0.3, 1.8), b = eio(tt, 1.3, 2.9), fin = eio(tt, 3.0, 4.2);
  const rulerTx = tex.text("ruler2", 1024, 128, (g) => { g.fillStyle = "#e8cc96"; g.fillRect(0, 0, 1024, 128); g.fillStyle = "#3a2a18"; for (let i = 0; i <= 64; i++) { g.fillRect(i * 16, 0, 3, i % 8 === 0 ? 60 : i % 4 === 0 ? 40 : 24); } g.font = "700 34px Georgia"; for (let i = 0; i <= 8; i++) g.fillText(String(i), i * 128 + 8, 104); });
  return <group scale={6}>
    <RBox s={[0.34, 0.004, 0.04]} p={[0, 0.002, -0.03]} r={0.001}><meshStandardMaterial map={rulerTx} roughness={0.7} /></RBox>
    {/* la arveja (verde brillante) y la bolita de masa de bórax (blanca, mate, granulosa) ruedan hasta quedar juntas */}
    <mesh position={[lerp(-0.2, -0.007, a), 0.0047, 0.004]} rotation={[0, 0, -lerp(0, 25, a)]} castShadow><sphereGeometry args={[0.0047, 32, 20]} /><meshPhysicalMaterial color="#6fae3a" roughness={0.25} clearcoat={0.8} /></mesh>
    <mesh position={[lerp(0.2, 0.007, b), 0.0047, 0.004]} rotation={[0, 0, lerp(0, 25, b)]} castShadow><icosahedronGeometry args={[0.0048, 3]} /><meshStandardMaterial color="#f3ecd9" roughness={0.95} /></mesh>
    {/* la yema de un dedo que se acerca por atrás y se apoya al lado, para la escala */}
    <group position={[0.03, 0.0085, 0.035 + 0.06 * (1 - fin)]} rotation={[0, -0.5, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><capsuleGeometry args={[0.0085, 0.05, 10, 20]} /><meshPhysicalMaterial color="#e2a98a" roughness={0.55} sheen={0.4} /></mesh>
      <mesh position={[0, 0.0066, -0.022]} rotation={[-PI / 2 + 0.12, 0, 0]} scale={[1, 1.3, 1]}><circleGeometry args={[0.0058, 24]} /><meshPhysicalMaterial color="#f3d4c4" roughness={0.2} clearcoat={0.8} /></mesh>
    </group>
  </group>;
}}</Scene3D>;

// ---- 9:23 · OSCURO, TIBIO Y HÚMEDO: la cocina vista desde arriba como maqueta; bajo la pileta, detrás de la heladera y bajo la cocina se encienden manchas de calor ----
export const HHotspots: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="none" bg="#101114"
  cam={{ at: [0, 0, -0.08], az: [0.15, -0.05], el: [1.28, 1.18], r: [1.7, 1.5], fov: 30 }}
>{(tt) => {
  const SP = [[-0.38, -0.25, 1.0], [0.0, -0.3, 2.0], [0.38, -0.25, 3.0]];
  return <>
    {/* paredes bajas de maqueta, como una casa de muñecas sin techo */}
    {[[0, 0.05, -0.45, 1.3, 0.1, 0.02], [-0.64, 0.05, -0.05, 0.02, 0.1, 0.82], [0.64, 0.05, -0.05, 0.02, 0.1, 0.82]].map(([x, y, z, w, hh, d], i) => <RBox key={i} s={[w, hh, d]} p={[x, y, z]} r={0.004}><meshStandardMaterial color="#d9cdb6" roughness={0.8} /></RBox>)}
    {/* mesada en L, heladera, cocina */}
    <RBox s={[1.1, 0.14, 0.22]} p={[0, 0.07, -0.3]} r={0.01}><meshStandardMaterial color="#e9e1cf" roughness={0.6} /></RBox>
    <RBox s={[0.24, 0.5, 0.24]} p={[0, 0.25, -0.31]} r={0.02}>{M.porcelain()}</RBox>
    <RBox s={[0.24, 0.16, 0.22]} p={[0.38, 0.08, -0.3]} r={0.01}><meshStandardMaterial color="#2a2a2a" roughness={0.4} /></RBox>
    <mesh position={[-0.38, 0.141, -0.3]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.18, 0.13]} />{M.steel()}</mesh>
    {[[0.33, -0.34], [0.43, -0.34], [0.33, -0.26], [0.43, -0.26]].map(([x, z], i) => <mesh key={i} position={[x, 0.162, z]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.02, 0.028, 24]} />{M.steel()}</mesh>)}
    {SP.map(([x, z, a], i) => { const k = eio(tt, a, a + 0.8), pul = 0.85 + 0.15 * Math.sin(tt * 4 + i); return <group key={i}>
      <mesh position={[x, 0.004, z + 0.13]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.01, k * pul)}><circleGeometry args={[0.14, 40]} /><meshBasicMaterial color="#ff7a2a" transparent opacity={0.35 * k} toneMapped={false} depthWrite={false} /></mesh>
      <mesh position={[x, 0.005, z + 0.13]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.01, k * pul * 0.5)}><circleGeometry args={[0.14, 40]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.5 * k} toneMapped={false} depthWrite={false} /></mesh>
      {k > 0.5 && Array.from({ length: 3 }, (_, j) => <Roach key={j} p={[x + (rn(i * 3 + j, 2) - 0.5) * 0.16, 0.003, z + 0.1 + rn(i * 3 + j, 3) * 0.08]} yaw={rn(i * 3 + j, 4) * 6 + tt * 0.3} ph={tt * 2 + j} s={2.6} />)}
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 10:46 · LA PRIMERA NEVADA: un parche de pasto; cae un polvito blanco que se apoya en las hojas y el verde sigue viéndose ----
export const HFirstsnow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#7c8ea0" key1={[-1, 1.6, 1.2]}
  cam={{ at: [0, 0.045, 0], az: [-0.4, 0.2], el: [0.22, 0.18], r: [0.42, 0.34], fov: 30 }}>{(tt) => <>
    <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.6, 48]} /><meshStandardMaterial color="#4a3a28" roughness={1} /></mesh>
    {/* cada hoja de pasto se va empolvando desde la punta: el blanco se apoya en el filo y el verde sigue abajo */}
    {Array.from({ length: 420 }, (_, i) => { const x = (rn(i, 2) - 0.5) * 0.8, z = (rn(i, 3) - 0.5) * 0.8; if (Math.hypot(x, z) > 0.46) return null; const hh = 0.045 + 0.045 * rn(i, 4), k = cl((tt - 0.6 - rn(i, 14) * 3.2) / 1.4);
      return <group key={i} position={[x, 0, z]} rotation={[(rn(i, 5) - 0.5) * 0.5, rn(i, 6) * 3, (rn(i, 7) - 0.5) * 0.5]}>
        <mesh position={[0, hh / 2, 0]}><coneGeometry args={[0.0032, hh, 3]} /><meshStandardMaterial color={`hsl(${95 + rn(i, 8) * 20},50%,${30 + rn(i, 9) * 14}%)`} roughness={0.8} /></mesh>
        <mesh visible={k > 0.02} position={[0, hh * (1 - 0.18 * k), 0]} scale={[1, Math.max(0.05, k), 1]}><coneGeometry args={[0.0016, hh * 0.36, 3]} /><meshStandardMaterial color="#fbfbf7" roughness={0.9} emissive="#ffffff" emissiveIntensity={0.08} /></mesh>
      </group>; })}
    {/* polvito fino que todavía cae */}
    {Array.from({ length: 90 }, (_, i) => { const k = (tt * 0.35 + rn(i, 15)) % 1; return <mesh key={"f" + i} position={[(rn(i, 12) - 0.5) * 0.5 + 0.01 * Math.sin(tt + i), lerp(0.3, 0.04, k), (rn(i, 13) - 0.5) * 0.5]}><icosahedronGeometry args={[0.0012, 0]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8 * Math.sin(k * PI)} /></mesh>; })}
  </>}</Scene3D>;

// ---- 11:21 · DONDE ESTÁ EL MOTOR: detrás de la heladera, el compresor late tibio; las cucarachas se juntan a su alrededor; cae el polvito ----
export const HMotor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="tile"
  cam={{ at: [0.03, 0.08, -0.16], az: [0.6, 0.35], el: [0.3, 0.36], r: [0.62, 0.5], fov: 30 }}>{(tt) => {
  const hum = 0.6 + 0.4 * Math.sin(tt * 6), dust = eio(tt, 3.0, 4.6);
  return <>
    {/* parte de atrás de la heladera: rejilla de serpentín */}
    <group position={[0, 0.5, -0.35]}>
      <mesh><boxGeometry args={[0.6, 1.0, 0.04]} /><meshStandardMaterial color="#cfc9bd" roughness={0.6} /></mesh>
      {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[0, -0.32 + i * 0.05, 0.03]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.005, 0.005, 0.5, 8]} /><meshStandardMaterial color="#20201f" metalness={0.6} roughness={0.4} /></mesh>)}
    </group>
    {/* compresor: campana negra sobre su placa con patas de goma, caños de cobre y el serpentín en zigzag */}
    <RBox s={[0.22, 0.012, 0.17]} p={[0, 0.006, -0.18]} r={0.003}>{M.steel({ col: "#5d6166" })}</RBox>
    {[[-0.09, -0.07], [0.09, -0.07], [-0.09, 0.07], [0.09, 0.07]].map(([x, z], i) => <mesh key={i} position={[x, 0.018, -0.18 + z]}><cylinderGeometry args={[0.012, 0.014, 0.014, 14]} />{M.rubber({ col: "#222" })}</mesh>)}
    <group position={[0, 0.012 + 0.0015 * Math.sin(tt * 40), -0.18]}>
      <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.065, 0.07, 0.07, 40]} /><meshStandardMaterial color="#1c1d1f" roughness={0.45} metalness={0.6} emissive="#ff6a22" emissiveIntensity={0.03 * hum} /></mesh>
      <mesh position={[0, 0.08, 0]} scale={[1, 0.55, 1]}><sphereGeometry args={[0.065, 40, 16, 0, 6.3, 0, PI / 2]} /><meshStandardMaterial color="#1c1d1f" roughness={0.45} metalness={0.6} /></mesh>
      <RBox s={[0.04, 0.03, 0.02]} p={[0.04, 0.05, 0.065]} r={0.004}><meshStandardMaterial color="#2c2d30" roughness={0.6} /></RBox>
      <mesh position={[0.03, 0.12, 0]} rotation={[0, 0, -0.3]}><cylinderGeometry args={[0.005, 0.005, 0.06, 10]} />{M.brass({ col: "#c06a3c" })}</mesh>
      <mesh position={[-0.03, 0.12, 0]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.005, 0.005, 0.06, 10]} />{M.brass({ col: "#c06a3c" })}</mesh>
    </group>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0.17, 0.03 + i * 0.022, -0.27]} rotation={[0, 0, PI / 2 + (i % 2 ? 0.25 : -0.25)]}><cylinderGeometry args={[0.004, 0.004, 0.09, 8]} />{M.brass({ col: "#c06a3c" })}</mesh>)}
    {/* calor que sube */}
    {Array.from({ length: 14 }, (_, i) => { const k = (tt * 0.4 + i / 14) % 1; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.12, 0.13 + k * 0.25, -0.18]}><sphereGeometry args={[0.01 + 0.02 * k, 10, 8]} /><meshBasicMaterial color="#ffb070" transparent opacity={0.12 * (1 - k)} depthWrite={false} /></mesh>; })}
    {Array.from({ length: 7 }, (_, i) => { const a = i * 0.9 + tt * 0.25, r = 0.13 + 0.03 * rn(i, 2); return <Roach key={i} p={[Math.cos(a) * r, 0.002, -0.18 + Math.sin(a) * r * 0.7]} yaw={-a - PI / 2} ph={tt * 2 + i} s={1.4} />; })}
    {/* el velo de polvo que cae alrededor del motor */}
    <group position={[0, 0, -0.12]}><Powder n={300} w={0.4} d={0.25} r={0.0018} op={(i) => cl(dust * 1.4 - rn(i, 9) * 0.4)} /></group>
  </>;
}}</Scene3D>;

// ---- 11:57 · LA PUNTA DEL TÉMPANO: arriba de la mesada se ven cuatro hormigas; la cámara baja por el corte del piso y aparece el hormiguero entero ----
export const HIceberg: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#2c241b" key1={[-0.6, 1.4, 1.4]}
  cam={{ at: [0, 0.1, 0], at1: [0, -0.38, 0], az: [0.15, 0.05], el: [0.12, 0.02], r: [0.9, 1.15], fov: 32 }}>{(tt) => <>
    {/* la cocina arriba: zócalo, mueble bajo con puertitas y pared de azulejos */}
    <mesh position={[0, 0.35, -0.16]}><planeGeometry args={[1.8, 0.7]} /><meshStandardMaterial map={tex.tile(12, 4)} roughness={0.35} /></mesh>
    <RBox s={[1.5, 0.3, 0.12]} p={[0, 0.15, -0.09]} r={0.008}>{M.wood({ base: [190, 160, 118] })}</RBox>
    {[-0.5, -0.17, 0.17, 0.5].map((x) => <mesh key={x} position={[x, 0.24, -0.028]}><sphereGeometry args={[0.008, 10, 8]} />{M.brass()}</mesh>)}
    <RBox s={[1.6, 0.04, 0.3]} p={[0, -0.02, 0]} r={0.004}><meshStandardMaterial map={tex.tile(10, 2)} roughness={0.35} /></RBox>
    {Array.from({ length: 4 }, (_, i) => <Ant key={i} p={[-0.15 + i * 0.1, 0.001, 0.05 + 0.03 * Math.sin(i * 2)]} yaw={i * 1.2 + tt * 0.3} ph={tt * 3 + i} s={2.2} />)}
    {/* debajo: tierra con un hormiguero de verdad, túneles que unen cámaras llenas */}
    <mesh position={[0, -0.55, -0.1]}><boxGeometry args={[1.6, 1.02, 0.04]} /><meshStandardMaterial color="#7a5a3a" roughness={1} /></mesh>
    {NEST.slice(1).map(([x, y], i) => { const [x0, y0] = NEST[i], L = Math.hypot(x - x0, y - y0); return <mesh key={"t" + i} position={[(x + x0) / 2, (y + y0) / 2, -0.079]} rotation={[0, 0, Math.atan2(y - y0, x - x0)]}><planeGeometry args={[L, 0.03]} /><meshStandardMaterial color="#4a3220" /></mesh>; })}
    {NEST.map(([x, y], i) => <group key={i}>
      <mesh position={[x, y, -0.078]} scale={[1.6, 0.7, 1]}><circleGeometry args={[0.06 + 0.02 * rn(i, 6), 28]} /><meshStandardMaterial color="#4a3220" emissive="#ffb35a" emissiveIntensity={0.08} /></mesh>
      {Array.from({ length: 6 }, (_, j) => { const a = rn(i * 8 + j, 3) * 6.3, r = rn(i * 8 + j, 4) * 0.05; return <group key={j} position={[x + Math.cos(a) * r * 1.5, y + Math.sin(a) * r * 0.5, -0.07]} rotation={[PI / 2, 0, 0]}><Ant yaw={a + tt * (rn(j, 5) - 0.5)} ph={tt * 3 + j} s={1.8} /></group>; })}
      {i % 2 === 0 && Array.from({ length: 5 }, (_, j) => <mesh key={"e" + j} position={[x + 0.05 + j * 0.008, y - 0.02, -0.07]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.005, 10, 8]} /><meshStandardMaterial color="#f4efe0" /></mesh>)}
    </group>)}
  </>}</Scene3D>;
const NEST = [[-0.05, -0.12], [-0.38, -0.3], [0.3, -0.28], [-0.12, -0.5], [0.42, -0.6], [-0.5, -0.72], [0.1, -0.82]];

// ---- 12:26 · COMO SALAR PAPAS: la caja se sacude sobre la alfombra trenzada y deja una lluvia pareja de granitos ----
export const HSalting: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none"
  cam={{ at: [0, 0.06, 0], az: [-0.2, 0.25], el: [0.62, 0.55], r: [1.15, 1.0], fov: 30 }}>{(tt) => {
  const x = lerp(-0.25, 0.25, eio(tt, 0.6, 4.8)), shake = Math.sin(tt * 22) * 0.02;
  const rug = tex.text("rug2", 512, 512, (g) => { g.fillStyle = "#8c6a44"; g.fillRect(0, 0, 512, 512); const C = ["#7a5a3a", "#94744c", "#86663f"]; for (let r = 0; r < 12; r++) { g.strokeStyle = C[r % 3]; g.lineWidth = 22; g.beginPath(); g.arc(256, 256, 250 - r * 21, 0, 6.3); g.stroke(); } g.strokeStyle = "#5e4630"; g.lineWidth = 10; g.beginPath(); g.arc(256, 256, 250, 0, 6.3); g.stroke(); });
  return <>
    <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]} scale={[1, 0.76, 1]}><circleGeometry args={[0.36, 64]} /><meshStandardMaterial map={rug} roughness={1} /></mesh>
    <Powder n={420} w={0.6} d={0.4} y={0.006} r={0.003} op={(i) => (lerp(-0.3, 0.3, rn(i, 11)) < x - 0.02 ? 1 : 0)} />
    <group position={[x + shake, 0.15, 0]} rotation={[0, 0, -2.3 + shake * 4]}><group position={[0, -0.12, 0]}><BoraxBox s={0.6} open={1} /></group></group>
    {/* granitos en el aire */}
    {Array.from({ length: 30 }, (_, i) => { const k = (tt * 2 + rn(i, 2)) % 1; return <mesh key={i} position={[x + (rn(i, 3) - 0.5) * 0.06, 0.12 - k * 0.11, (rn(i, 4) - 0.5) * 0.06]}><icosahedronGeometry args={[0.0032, 0]} /><meshStandardMaterial color="#fbfaf4" /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 13:13 · DOS VUELTAS, DOS SEMANAS APART: una tira de 14 días; el polvito cae el día 1, los huevos revientan al medio, y cae otra vez el día 14 ----
export const HTworounds: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none"
  cam={{ at: [0, 0, 0.0], az: [0, 0.08], el: [0.85, 0.75], r: [0.95, 0.86], fov: 30 }}>{(tt) => {
  const cur = eio(tt, 0.4, 4.6) * 13, X = (i: number) => -0.29 + (i % 7) * 0.097, Z = (i: number) => (i < 7 ? -0.075 : 0.075);
  return <>
    {/* dos semanas en dos filas de siete fichas grandes */}
    {Array.from({ length: 14 }, (_, i) => { const on = cur >= i - 0.2; return <group key={i} position={[X(i), 0, Z(i)]}>
      <RBox s={[0.088, 0.012, 0.13]} p={[0, 0.006, 0]} r={0.004}><meshStandardMaterial map={tex.text("d" + (i + 1), 128, 192, (g) => { g.fillStyle = i === 0 || i === 13 ? "#e9d9a8" : "#f1ead9"; g.fillRect(0, 0, 128, 192); g.fillStyle = "#3a2e22"; g.font = "900 72px Georgia"; g.textAlign = "center"; g.fillText(String(i + 1), 64, 74); })} roughness={0.9} /></RBox>
      <mesh visible={on} position={[0, 0.0125, -0.05]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.036, 32]} />{M.glow({ col: "#ffcf7a", op: 0.7 })}</mesh>
    </group>; })}
    {/* polvo en el día 1 y en el día 14 */}
    {[0, 13].map((d, j) => { const k = eio(tt, j ? 4.3 : 0.5, j ? 4.9 : 1.1); return <group key={d} position={[X(d), 0.013, Z(d) + 0.02]}><Powder n={90} w={0.075} d={0.07} r={0.0035} op={() => k} /></group>; })}
    {/* huevos en los días 6-9 que revientan y salen pulgas */}
    {[5, 6, 7, 8].map((d, j) => { const hatch = eio(tt, 2.0 + j * 0.25, 2.5 + j * 0.25); return <group key={d} position={[X(d), 0.014, Z(d) + 0.025]}>
      <mesh scale={[1, 1.4 - 0.4 * hatch, 1]}><sphereGeometry args={[0.011, 14, 10]} /><meshStandardMaterial color="#f4efe2" transparent opacity={1 - 0.6 * hatch} /></mesh>
      <mesh visible={hatch > 0.3} position={[0.016 * hatch, 0.035 * Math.abs(Math.sin(tt * 6 + j)) * hatch, 0.012]} scale={[1.3, 1, 0.8]}><sphereGeometry args={[0.007, 10, 8]} /><meshStandardMaterial color="#3a2414" roughness={0.3} /></mesh>
    </group>; })}
  </>;
}}</Scene3D>;
