// gary11k · piezas 3D del kit anti-saqueo (las comparten los componentes únicos k1/k2/k3). Render SÓLO en el farm.
import React from "react";
import * as THREE from "three";
import { M, RBox, tubeG } from "./h3d";
import { PI, Txt3 } from "./gk";

export type V = [number, number, number];
export const z1 = (k: number) => Math.max(0.001, k);
export const AMB = "#ffb547", GRN = "#6fe39a", RED = "#ff4a3d", INK = "#0e1013", CRM = "#f7f4ee", YEL = "#ffd23a", BLU = "#5fb2e6";
const WH = "#f1efe8", DK = "#2b2d31";

// ondas de sonido de una sirena: anillos que se abren (k = volumen 0..1)
export const Waves: React.FC<{ tt: number; k: number; p?: V; r?: V; s?: number; col?: string }> = ({ tt, k, p = [0, 0, 0], r = [0, 0, 0], s = 1, col = YEL }) =>
  <group position={p} rotation={r} scale={s}>{[0, 1, 2, 3].map((i) => { const ph = (tt * 1.7 + i / 4) % 1; return <mesh key={i} scale={z1(0.06 + 0.5 * ph)}><torusGeometry args={[1, 0.025, 8, 56, PI * 0.9]} /><meshBasicMaterial color={col} transparent opacity={0.9 * k * (1 - ph)} depthWrite={false} toneMapped={false} /></mesh>; })}
    <pointLight intensity={2.2 * k} distance={1.2} color={RED} /></group>;
// LED rojo
export const Led: React.FC<{ on: number; p: V; r?: number; col?: string }> = ({ on, p, r = 0.008, col = RED }) =>
  <mesh position={p}><sphereGeometry args={[r, 12, 10]} /><meshStandardMaterial color="#300" emissive={col} emissiveIntensity={0.05 + 4 * on} toneMapped={false} /></mesh>;
// sensor infrarrojo de pared (caja blanca con la lente redonda facetada)
export const Pir: React.FC<{ p?: V; r?: V; s?: number; on?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, on = 0 }) => <group position={p} rotation={r} scale={s}>
  <RBox s={[0.16, 0.22, 0.09]} r={0.02}>{M.plastic({ col: WH })}</RBox>
  <mesh position={[0, 0.02, 0.05]} scale={[1, 1, 0.6]}><sphereGeometry args={[0.055, 16, 12, 0, PI * 2, 0, PI / 2]} />{M.glass({ op: 0.75, col: "#f7f7f2" })}</mesh>
  <Led on={on} p={[0.05, -0.08, 0.047]} />
</group>;
// alarma de puerta/ventana: cuerpo con sirena + imán (gap = separación)
export const DoorAl: React.FC<{ p?: V; r?: V; s?: number; gap?: number; on?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, gap = 0, on = 0 }) => <group position={p} rotation={r} scale={s}>
  <RBox s={[0.07, 0.2, 0.035]} r={0.012}>{M.plastic({ col: WH })}</RBox>
  {[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.05 - i * 0.02, 0.018]}><boxGeometry args={[0.035, 0.006, 0.004]} /><meshStandardMaterial color="#b8b5ad" /></mesh>)}
  <Led on={on} p={[0, -0.06, 0.019]} r={0.006} />
  <RBox s={[0.03, 0.14, 0.03]} p={[0.06 + gap, 0, 0]} r={0.01}>{M.plastic({ col: WH })}</RBox>
</group>;
// el control de 4 botones (candado, candado abierto, casa, SOS); lit = índice del botón encendido
export const Fob: React.FC<{ p?: V; r?: V; s?: number; lit?: number; sos?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, lit = -1, sos = 0 }) => <group position={p} rotation={r} scale={s}>
  <RBox s={[0.14, 0.24, 0.03]} r={0.03}>{M.plastic({ col: WH })}</RBox>
  {[[-0.033, 0.045], [0.033, 0.045], [-0.033, -0.03], [0.033, -0.03]].map(([x, y], i) => <RBox key={i} s={[0.052, 0.058, 0.014]} p={[x, y, 0.017]} r={0.008}>
    <meshStandardMaterial color={i === 3 ? "#4a4c50" : "#5a5c60"} emissive={i === 3 ? RED : AMB} emissiveIntensity={(lit === i ? 1.6 : 0) + (i === 3 ? 2.4 * sos : 0)} toneMapped={false} /></RBox>)}
  {(["ARM", "OFF", "HOME", "SOS"] as const).map((l, i) => <Txt3 key={l} txt={l} w={0.045} h={0.016} col="#f4f4f4" p={[i % 2 ? 0.033 : -0.033, i < 2 ? 0.045 : -0.03, 0.026]} />)}
  <mesh position={[0, 0.115, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.018, 0.005, 8, 20]} />{M.steel()}</mesh>
</group>;
// la cuña de puerta con sirena (gris oscuro, con el interruptor arriba)
export const Wedge: React.FC<{ p?: V; r?: V; s?: number; on?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, on = 0 }) => <group position={p} rotation={r} scale={s}>
  <mesh rotation={[0, 0, 0]} position={[0, 0.045, 0]}><extrudeGeometry args={[(() => { const sh = new THREE.Shape(); sh.moveTo(-0.13, -0.045); sh.lineTo(0.13, -0.045); sh.lineTo(0.13, 0.045); sh.lineTo(-0.13, -0.03); sh.lineTo(-0.13, -0.045); return sh; })(), { depth: 0.1, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006 }]} />{M.rubber({ col: "#34363a" })}</mesh>
  <RBox s={[0.06, 0.02, 0.05]} p={[0.07, 0.098, 0.05]} r={0.006}>{M.plastic({ col: "#1d1e21" })}</RBox>
  <Led on={on} p={[0.1, 0.11, 0.05]} r={0.007} />
</group>;
// el tripwire: cuerpo con el pin y el hilo (pull = cuánto salió el pin)
export const Trip: React.FC<{ p?: V; r?: V; s?: number; pull?: number; on?: number; len?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, pull = 0, on = 0, len = 0.8 }) => <group position={p} rotation={r} scale={s}>
  <RBox s={[0.12, 0.17, 0.07]} r={0.015}>{M.plastic({ col: DK })}</RBox>
  <Led on={on} p={[0, 0.05, 0.037]} />
  <mesh position={[0.07 + 0.16 * pull, -0.02, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.07, 10]} />{M.steel()}</mesh>
  <mesh position={[0.1 + 0.16 * pull + len / 2, -0.02, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0025, 0.0025, len, 6]} /><meshBasicMaterial color="#f4f0e0" toneMapped={false} /></mesh>
</group>;
// la valija negra (op = tapa abierta 0..1) con piezas en la goma
export const Case: React.FC<{ p?: V; r?: V; s?: number; op?: number; lift?: number; arm?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, op = 0, lift = 0, arm = 0 }) => <group position={p} rotation={r} scale={s}>
  <RBox s={[0.7, 0.13, 0.46]} p={[0, 0.065, 0]} r={0.03}>{M.plastic({ col: "#15161a" })}</RBox>
  <mesh position={[0, 0.131, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.64, 0.4]} /><meshStandardMaterial color="#5a5d62" roughness={1} /></mesh>
  <group position={[0, 0.14 + 0.12 * lift, 0]}>
    <Pir p={[-0.24, 0.02, -0.08]} r={[-PI / 2, 0, 0]} s={0.6} on={arm} /><Pir p={[-0.13, 0.02, -0.08]} r={[-PI / 2, 0, 0]} s={0.6} on={arm} />
    {[0, 1, 2, 3].map((i) => <DoorAl key={i} p={[-0.02 + i * 0.075, 0.015, -0.08]} r={[-PI / 2, 0, 0]} s={0.6} on={arm} />)}
    <Fob p={[-0.24, 0.012, 0.1]} r={[-PI / 2, 0, 0]} s={0.55} /><Fob p={[-0.16, 0.012, 0.1]} r={[-PI / 2, 0, 0]} s={0.55} />
    <Wedge p={[0.03, -0.03, 0.06]} s={0.7} on={arm} />
    <Trip p={[0.23, 0.02, 0.1]} r={[-PI / 2, 0, 0]} s={0.6} len={0.001} on={arm} />
  </group>
  <group position={[0, 0.13, -0.23]} rotation={[-1.85 * op, 0, 0]}>
    <RBox s={[0.7, 0.07, 0.46]} p={[0, 0.035, 0.23]} r={0.03}>{M.plastic({ col: "#18191d" })}</RBox>
    <mesh position={[0, -0.001, 0.23]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[0.64, 0.4]} /><meshStandardMaterial color="#4a4d52" roughness={1} side={THREE.DoubleSide} /></mesh>
  </group>
  {[-0.2, 0.2].map((x) => <RBox key={x} s={[0.06, 0.03, 0.02]} p={[x, 0.09, 0.235]} r={0.006}>{M.steel({ col: "#9aa0a6" })}</RBox>)}
  <mesh geometry={tubeG("cs_h" + Math.round(s * 100), [[-0.1, 0.1, 0.23], [-0.08, 0.1, 0.3], [0.08, 0.1, 0.3], [0.1, 0.1, 0.23]], 0.014, 24, 8)}>{M.plastic({ col: "#111" })}</mesh>
</group>;
// la lata gris del panel de alarma (op = puerta abierta)
export const AlarmCan: React.FC<{ p?: V; s?: number; op?: number; children?: React.ReactNode }> = ({ p = [0, 0, 0], s = 1, op = 0, children }) => <group position={p} scale={s}>
  <RBox s={[0.5, 0.6, 0.14]} p={[0, 0.3, -0.07]} r={0.01}>{M.steel({ col: "#9aa2aa" })}</RBox>
  <mesh position={[0, 0.3, 0.001]}><planeGeometry args={[0.46, 0.56]} /><meshStandardMaterial color="#3d4248" /></mesh>
  <group position={[-0.25, 0.3, 0.005]} rotation={[0, -1.9 * op, 0]}><RBox s={[0.5, 0.6, 0.015]} p={[0.25, 0, 0]} r={0.006}>{M.steel({ col: "#a4abb2" })}</RBox></group>
  {children}
</group>;
// la batería sellada de 12 V (bulge = hinchada)
export const Bat12: React.FC<{ p?: V; r?: V; s?: number; bulge?: number; lvl?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, bulge = 0, lvl = -1 }) => <group position={p} rotation={r} scale={s}>
  <mesh position={[0, 0.07, 0]} scale={[1 + 0.12 * bulge, 1, 1 + 0.35 * bulge]}><boxGeometry args={[0.2, 0.14, 0.08, 6, 6, 6]} />{M.plastic({ col: "#18191c" })}</mesh>
  {[-1, 1].map((k) => <mesh key={k} position={[k * 0.07, 0.145, 0.0]}><boxGeometry args={[0.02, 0.012, 0.012]} />{M.steel({ col: k > 0 ? "#d24a3a" : "#aaa" })}</mesh>)}
  {lvl >= 0 && <><mesh position={[0, 0.07, 0.042]}><planeGeometry args={[0.16, 0.08]} /><meshBasicMaterial color="#111" /></mesh>
    <mesh position={[-0.08 + 0.08 * lvl, 0.07, 0.043]} scale={[z1(lvl), 1, 1]}><planeGeometry args={[0.16, 0.07]} /><meshBasicMaterial color={lvl > 0.3 ? GRN : RED} toneMapped={false} /></mesh></>}
</group>;
// barra de manteca en su papel
export const Butter: React.FC<{ p?: V; s?: number }> = ({ p = [0, 0, 0], s = 1 }) => <group position={p} scale={s}>
  <RBox s={[0.2, 0.06, 0.06]} p={[0, 0.03, 0]} r={0.008}><meshStandardMaterial color="#f3e7b6" roughness={0.6} /></RBox>
  <mesh position={[0, 0.0305, 0.0305]}><planeGeometry args={[0.12, 0.04]} /><meshStandardMaterial color="#e2c96b" /></mesh>
</group>;
// router/modem chato con antenas y luces
export const Router: React.FC<{ p?: V; s?: number; on?: number }> = ({ p = [0, 0, 0], s = 1, on = 1 }) => <group position={p} scale={s}>
  <RBox s={[0.34, 0.05, 0.22]} p={[0, 0.025, 0]} r={0.015}>{M.plastic({ col: "#17181b" })}</RBox>
  {[-0.12, 0.12].map((x) => <mesh key={x} position={[x, 0.12, -0.09]} rotation={[0.15, 0, x]}><cylinderGeometry args={[0.008, 0.01, 0.18, 10]} />{M.plastic({ col: "#17181b" })}</mesh>)}
  {[0, 1, 2, 3, 4].map((i) => <Led key={i} on={on} p={[-0.1 + i * 0.05, 0.03, 0.112]} r={0.006} col={GRN} />)}
</group>;
// cámara Wi-Fi blanca (on = luz de estado)
export const Cam: React.FC<{ p?: V; r?: V; s?: number; on?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, on = 1 }) => <group position={p} rotation={r} scale={s}>
  <RBox s={[0.14, 0.12, 0.2]} p={[0, 0, 0]} r={0.04}>{M.plastic({ col: WH })}</RBox>
  <mesh position={[0, 0, 0.102]}><circleGeometry args={[0.045, 24]} /><meshStandardMaterial color="#111" roughness={0.1} metalness={0.5} /></mesh>
  <mesh position={[0, 0, 0.104]}><circleGeometry args={[0.022, 20]} />{M.glass({ op: 0.9, col: "#30405a" })}</mesh>
  <Led on={on} p={[0.05, 0.045, 0.1]} r={0.006} col={BLU} />
  <mesh position={[0, -0.1, -0.05]}><cylinderGeometry args={[0.012, 0.012, 0.1, 10]} />{M.plastic({ col: WH })}</mesh>
</group>;
// una puerta con marco (open = ángulo 0..1, hacia adentro +)
export const DoorF: React.FC<{ p?: V; r?: V; s?: number; open?: number; col?: string }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, open = 0, col = "#b88a5a" }) => <group position={p} rotation={r} scale={s}>
  {[-0.36, 0.36].map((x) => <mesh key={x} position={[x, 0.9, 0]}><boxGeometry args={[0.05, 1.8, 0.1]} />{M.matte({ col: "#efe9dc" })}</mesh>)}
  <mesh position={[0, 1.82, 0]}><boxGeometry args={[0.77, 0.05, 0.1]} />{M.matte({ col: "#efe9dc" })}</mesh>
  <group position={[-0.33, 0, 0]} rotation={[0, -1.3 * open, 0]}><RBox s={[0.66, 1.76, 0.045]} p={[0.33, 0.89, 0]} r={0.01}>{M.wood({ base: [176, 128, 82] })}</RBox>
    <mesh position={[0.6, 0.9, 0.03]}><sphereGeometry args={[0.025, 12, 10]} />{M.brass()}</mesh></group>
</group>;
// casita de juguete (para mapas): cuerpo + techo
export const MiniHouse: React.FC<{ p?: V; r?: V; s?: number; lit?: number; col?: string }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, lit = 0, col = "#5b6573" }) => <group position={p} rotation={r} scale={s}>
  <mesh position={[0, 0.15, 0]} castShadow><boxGeometry args={[0.36, 0.3, 0.3]} /><meshStandardMaterial color={col} roughness={0.9} /></mesh>
  <mesh position={[0, 0.38, 0]} rotation={[0, PI / 4, 0]} scale={[1, 0.6, 1]} castShadow><coneGeometry args={[0.29, 0.28, 4]} /><meshStandardMaterial color="#3a2c26" roughness={0.9} /></mesh>
  {[-0.08, 0.08].map((x) => <mesh key={x} position={[x, 0.17, 0.151]}><planeGeometry args={[0.07, 0.07]} /><meshStandardMaterial color="#141a24" emissive="#ffc77a" emissiveIntensity={1.6 * lit} toneMapped={false} /></mesh>)}
</group>;
// cartel de texto en 3D con fondo (atajo)
export const Lab: React.FC<{ txt: string; w: number; p: V; col?: string; bg?: string; s?: number; op?: number; r?: V; h?: number; glow?: boolean }> = (q) => <Txt3 h={q.h ?? q.w * 0.16} {...q} />;
