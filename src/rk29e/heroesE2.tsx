// rk29e · componentes 3D 17-31 (29-oct). Cada uno UNA vez en la tanda (D:/rtmp/rk29_COMPONENTES.md).
import React from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { Studio, RB, Mat, sm, spr, c01, rnd, type V3 } from "./studio3d";
import { cam, Room, Bed3, Dresser3, ShoeBox3, Stack3, Bill3, useBillTex, Wallet3, LockBox3 } from "./bed3d";

type P = { t: number; h: H };

// 17 · las fotos del casamiento: la tapa de la sombrerera vuela y las fotos se desparraman por la alfombra; cae una huella de bota encima
export const E2Photos: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const tex = usePhotoTex(), spill = c01((tt - 1.0) / 1.6), boot = sm(tt, 4.4, 4.9);
  return <Room tt={tt} c={cam([0.3, 1.9, 1.6], [0, 0.0, 0.1])} wall="drywall" z={-1.0} floor="tile">
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}><planeGeometry args={[3, 2.2]} /><meshStandardMaterial color="#8a6a5a" roughness={1} /></mesh>
    <group position={[-0.75, 0, -0.35]} rotation={[0, 0.3, 0]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.26, 0.26, 0.24, 40, 1, true]} /><meshStandardMaterial color="#c8a8a0" roughness={0.85} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.26, 40]} /><meshStandardMaterial color="#b89890" /></mesh>
      <group position={[0.6 * spill, 0.25 + 0.4 * Math.sin(spill * Math.PI), 0.3 * spill]} rotation={[0.9 * spill, 0, 0.5 * spill]}><mesh><cylinderGeometry args={[0.28, 0.28, 0.05, 40]} /><meshStandardMaterial color="#a8887e" roughness={0.85} /></mesh></group>
    </group>
    {[...Array(9)].map((_, i) => { const k = c01((spill - i * 0.07) / 0.6), x = -0.65 + (0.25 + rnd(i) * 1.1) * k, z = -0.3 + (rnd(i, 2) - 0.2) * 0.8 * k, r = rnd(i, 3) * 3 * k;
      return <group key={i} position={[x, 0.006 + i * 0.0015, z]} rotation={[-Math.PI / 2, 0, r]}><mesh><planeGeometry args={[0.24, 0.18]} /><meshStandardMaterial color="#f6f3ec" roughness={0.6} /></mesh><mesh position={[0, 0.008, 0.0005]}><planeGeometry args={[0.2, 0.13]} /><meshStandardMaterial map={tex[i % 3]} roughness={0.5} /></mesh></group>; })}
    {boot > 0 && <mesh position={[0.25, 0.012, 0.05]} rotation={[-Math.PI / 2, 0, 0.4]}><shapeGeometry args={[bootShape()]} /><meshBasicMaterial color="#3a2a22" transparent opacity={0.55 * boot} /></mesh>}
  </Room>;
}}</Stage>;
const bootShape = () => { const s = new THREE.Shape(); s.moveTo(-0.07, -0.16); s.quadraticCurveTo(-0.09, 0.05, -0.05, 0.14); s.quadraticCurveTo(0, 0.18, 0.05, 0.14); s.quadraticCurveTo(0.09, 0.02, 0.06, -0.16); s.quadraticCurveTo(0, -0.2, -0.07, -0.16); return s; };
const usePhotoTex = () => React.useMemo(() => [0, 1, 2].map((k) => {
  const c = document.createElement("canvas"); c.width = 200; c.height = 130; const g = c.getContext("2d")!;
  const gr = g.createLinearGradient(0, 0, 0, 130); gr.addColorStop(0, ["#c8b89a", "#a8b8c8", "#d8c0a0"][k]); gr.addColorStop(1, ["#8a7a5a", "#6a7a6a", "#9a7a5a"][k]); g.fillStyle = gr; g.fillRect(0, 0, 200, 130);
  g.fillStyle = "#f6f3ec"; g.beginPath(); g.ellipse(82, 70, 18, 22, 0, 0, Math.PI * 2); g.fill(); g.fillRect(64, 88, 36, 42);
  g.fillStyle = "#2a2a2e"; g.beginPath(); g.ellipse(122, 66, 16, 20, 0, 0, Math.PI * 2); g.fill(); g.fillRect(106, 84, 32, 46);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}), []);

// 18 · el sobre pegado abajo: el cajón sale, gira boca abajo en el aire y el sobre pegado con cinta queda mirando a la cámara
export const E2Tapeunder: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const out = sm(tt, 0.5, 1.6), flip = sm(tt, 1.8, 3.2), glow = sm(tt, 3.2, 3.8);
  return <Room tt={tt} c={cam([0.2, 1.2, 2.3], [0, 0.85, 0.3])} wall="drywall" z={-0.7}>
    <Dresser3 p={[0, 0, -0.2]} open={[0, 0, 0]} />
    <group position={[0, 0.88 - 0.0 + 0.35 * flip, -0.2 + 0.25 + 0.55 * out]} rotation={[Math.PI * flip, 0, 0.1 * flip]}>
      <RB p={[0, 0, 0]} s={[1.1, 0.28, 0.5]} rad={0.015} c="#8a6444" r={0.5} />
      <RB p={[0, -0.135, 0]} s={[1.04, 0.012, 0.46]} rad={0.003} c="#b8936a" r={0.8} />
      <group position={[0.05, -0.145, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}><planeGeometry args={[0.42, 0.26]} /><meshStandardMaterial color="#f2ead6" roughness={0.9} side={THREE.DoubleSide} emissive="#ffe6b0" emissiveIntensity={0.25 * glow} /></mesh>
        {[[-0.2, 0.1], [0.2, 0.1], [-0.2, -0.1], [0.2, -0.1]].map(([x, y], i) => <mesh key={i} position={[x, y, -0.002]} rotation={[0, 0, i % 2 ? 0.7 : -0.7]}><planeGeometry args={[0.12, 0.035]} /><meshStandardMaterial color="#e8dca0" transparent opacity={0.8} side={THREE.DoubleSide} /></mesh>)}
      </group>
    </group>
  </Room>;
}}</Stage>;

// 19 · el cuarto dado vuelta: todo el dormitorio gira 180°; lo suelto cae al techo, lo atornillado (la cajita) se queda en su lugar
export const E2Flipped: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const rot = sm(tt, 1.0, 3.4), fall = c01((tt - 2.4) / 1.4), bill = useBillTex();
  const loose: [V3, string][] = [[[-0.5, 0.72, 0.1], "#e8e2d6"], [[0.35, 0.72, 0.2], "#9a6a8a"], [[0.6, 0.08, 0.3], "#5a7a6a"], [[-0.8, 0.08, 0.2], "#d8c8a8"], [[0.1, 0.72, -0.1], "#4a5a6e"]];
  return <Studio tt={tt} floor="none" warm={0.85} photo={0} keys={cam([0.2, 0.9, 3.4], [0, 0.9, 0])}>
    <group position={[0, 0.9, 0]} rotation={[0, 0, Math.PI * rot]}><group position={[0, -0.9, 0]}>
      <RB p={[0, 0.0, 0]} s={[2.6, 0.04, 1.4]} rad={0.01} c="#a8916f" r={0.85} />
      <RB p={[0, 1.8, 0]} s={[2.6, 0.04, 1.4]} rad={0.01} c="#ece6da" r={0.9} />
      <RB p={[0, 0.9, -0.7]} s={[2.6, 1.8, 0.04]} rad={0.01} c="#d8d0c2" r={0.9} />
      <Bed3 p={[-0.3, 0.02, -0.1]} s={0.42} />
      <LockBox3 p={[0.85, 0.02, -0.4]} s={0.7} bolts={1} />
      {loose.map(([p, c], i) => { const g = fall, y = p[1] + (1.75 - 2 * p[1] - 0.03) * g * g * (1 + 0.0 * i); return <RB key={i} p={[p[0], Math.min(1.75, y), p[2]]} rot={[0, i, Math.PI * g * 0.9]} s={[0.2, 0.06, 0.15]} rad={0.02} c={c} r={0.95} />; })}
      <Bill3 p={[-0.2, Math.min(1.77, 0.75 + 1.0 * fall * fall), 0.25]} rot={[0, 1, 0]} tex={bill} />
    </group></group>
  </Studio>;
}}</Stage>;

// 20 · el oído en la ventana: faros de un auto barren la pared del dormitorio de noche y la silueta en la puerta se congela
export const E2Headlights: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const sw = c01((tt - 1.0) / 3.2), sw2 = c01((tt - 5.0) / 3.0), x = -2.2 + 4.4 * sw, x2 = -2.2 + 4.4 * sw2;
  return <Studio tt={tt} floor="wood" night={0.92} warm={0.5} photo={0} bg="#0c0e14" keys={cam([0.2, 1.3, 3.0], [0, 1.0, -0.6])}>
    <RB p={[0, 1.6, -1.0]} s={[6, 3.2, 0.1]} rad={0.01} c="#b8b4ac" r={0.9} />
    <RB p={[-0.9, 1.4, -0.94]} s={[0.9, 0.8, 0.04]} rad={0.01} c="#22283a" r={0.2} />
    {[-1, 1].map((sd) => <RB key={sd} p={[-0.9 + sd * 0.47, 1.4, -0.92]} s={[0.05, 0.9, 0.04]} rad={0.01} c="#e8e2d6" r={0.8} />)}
    {[0, 1].map((k) => { const xx = k ? x2 : x, on = (k ? sw2 : sw) > 0 && (k ? sw2 : sw) < 1; return on && <mesh key={k} position={[xx, 1.35, -0.94]}><planeGeometry args={[0.9, 1.1]} /><meshBasicMaterial color="#fff2d0" transparent opacity={0.28 * Math.sin((k ? sw2 : sw) * Math.PI)} toneMapped={false} /></mesh>; })}
    <spotLight position={[x, 1.5, 2.0]} target-position={[x * 0.6, 1.2, -1]} angle={0.35} penumbra={0.8} intensity={sw > 0 && sw < 1 ? 26 * Math.sin(sw * Math.PI) : 0} distance={6} color="#fff2d0" />
    <group position={[0.9, 0, -0.4]}>
      <RB p={[0, 0.55, 0]} s={[0.22, 0.6, 0.16]} rad={0.07} c="#1a1c22" r={0.8} />
      <mesh position={[0, 0.98, 0]}><sphereGeometry args={[0.1, 20, 16]} /><meshStandardMaterial color="#1a1c22" roughness={0.8} /></mesh>
      {[-1, 1].map((sd) => <RB key={sd} p={[sd * 0.06, 0.13, 0]} s={[0.08, 0.26, 0.1]} rad={0.03} c="#1a1c22" r={0.8} />)}
      <group position={[0, 0.98, 0]} rotation={[0, -0.6 * Math.max(sm(tt, 1.2, 1.6) * (1 - sm(tt, 4.2, 4.6)), sm(tt, 5.2, 5.6))]}><mesh position={[-0.09, 0, 0]}><sphereGeometry args={[0.03, 12, 10]} /><meshStandardMaterial color="#2a2c31" /></mesh></group>
    </group>
  </Studio>;
}}</Stage>;

// 21 · aburrido, pesado y dividido: tres pedestales; una caja gris sin gracia, un yunque que hunde su base y una torta que se parte en tres
export const E2Trio: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const a = spr(tt, 0.6, 7, 0.5), b = spr(tt, 1.6, 7, 0.45), c = spr(tt, 2.6, 7, 0.5), cut = sm(tt, 3.4, 4.4), sink = 0.04 * c01((tt - 2.0) / 0.3);
  const Ped = ({ x, ch, y0 = 0 }: { x: number; ch: React.ReactNode; y0?: number }) => <group position={[x, 0, 0]}><RB p={[0, 0.22 - y0, 0]} s={[0.55, 0.44, 0.55]} rad={0.02} c="#e8e2d6" r={0.8} />{ch}</group>;
  return <Room tt={tt} c={cam([0, 1.25, 2.9], [0, 0.55, 0])} wall="drywall" z={-0.8}>
    <Ped x={-0.8} ch={<RB p={[0, 0.44 + 0.13 + 0.8 * (1 - a), 0]} s={[0.36, 0.26, 0.3]} rad={0.01} c="#8a8a84" r={0.95} />} />
    <Ped x={0} y0={sink} ch={<group position={[0, 0.44 - sink + 0.8 * (1 - b), 0]}>
      <RB p={[0, 0.04, 0]} s={[0.22, 0.08, 0.2]} rad={0.01} c="#2a2c31" m={0.8} r={0.35} />
      <RB p={[0, 0.12, 0]} s={[0.12, 0.08, 0.14]} rad={0.01} c="#2a2c31" m={0.8} r={0.35} />
      <RB p={[0.02, 0.2, 0]} s={[0.42, 0.1, 0.18]} rad={0.015} c="#3a3c42" m={0.85} r={0.3} />
      <mesh position={[0.26, 0.2, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.06, 0.16, 4]} /><Mat c="#3a3c42" m={0.85} r={0.3} /></mesh>
    </group>} />
    <Ped x={0.8} ch={<group position={[0, 0.44 + 0.8 * (1 - c), 0]}>
      {[0, 1, 2].map((i) => { const a0 = i * Math.PI * 2 / 3, mid = a0 + Math.PI / 3; return <group key={i} position={[Math.cos(mid) * 0.07 * cut, 0, -Math.sin(mid) * 0.07 * cut]}>
        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.2, 0.2, 0.12, 40, 1, false, a0 + Math.PI / 2, Math.PI * 2 / 3]} /><meshStandardMaterial color={["#d8b04a", "#e8c890", "#c98a4a"][i]} roughness={0.7} side={THREE.DoubleSide} /></mesh>
      </group>; })}
    </group>} />
  </Room>;
}}</Stage>;

// 22 · el pulso: una línea de monitor late; cuando el lugar "ingenioso" emociona hay picos rojos (lo encuentra), cuando aburre queda plana y verde
export const E2Heartline: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const calm = sm(tt, 4.2, 5.0), N = 120, head = (tt * 0.45) % 1;
  const pts = React.useMemo(() => new Float32Array(N * 3), []);
  for (let i = 0; i < N; i++) { const u = i / (N - 1), ph = (u * 6) % 1, spike = ph > 0.45 && ph < 0.55 ? Math.sin((ph - 0.45) / 0.1 * Math.PI) * (1 - calm) : 0;
    pts[i * 3] = -1.1 + 2.2 * u; pts[i * 3 + 1] = 0.9 + 0.38 * spike - 0.1 * (ph > 0.55 && ph < 0.6 ? 1 - calm : 0); pts[i * 3 + 2] = 0.02; }
  const col = new THREE.Color("#ff5a4a").lerp(new THREE.Color("#6fe39a"), calm);
  return <Room tt={tt} c={cam([0.2, 0.95, 2.1], [0.2, 0.8, 0])} wall="drywall" z={-0.7} night={0.2}>
    <RB p={[0, 0.88, -0.05]} s={[2.6, 1.1, 0.1]} rad={0.05} c="#22252b" r={0.4} />
    <mesh position={[0, 0.88, 0.005]}><planeGeometry args={[2.4, 0.95]} /><meshBasicMaterial color="#0c1410" /></mesh>
    {[...Array(9)].map((_, i) => <mesh key={i} position={[-1.2 + i * 0.3, 0.88, 0.008]}><planeGeometry args={[0.004, 0.95]} /><meshBasicMaterial color="#1e2e24" /></mesh>)}
    {[...Array(N - 1)].map((_, i) => { const x0 = pts[i * 3], y0 = pts[i * 3 + 1], x1 = pts[i * 3 + 3], y1 = pts[i * 3 + 4], L = Math.hypot(x1 - x0, y1 - y0);
      return <mesh key={i} position={[(x0 + x1) / 2, (y0 + y1) / 2, 0.02]} rotation={[0, 0, Math.atan2(y1 - y0, x1 - x0)]}><boxGeometry args={[L + 0.006, 0.022, 0.01]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>; })}
    <mesh position={[-1.1 + 2.2 * head, 0.9, 0.03]}><sphereGeometry args={[0.045, 16, 16]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>
    <group position={[1.55, 0.25, 0.25]}><ShoeBox3 s={1.4} col={calm > 0.5 ? "#8a8a84" : "#d8b48a"} lidCol={calm > 0.5 ? "#7a7a74" : "#c49a6a"} /></group>
  </Room>;
}}</Stage>;

// 23 · lo que saltea: la linterna recorre la aspiradora, la caja de impuestos con polvo y la bolsa de ropa; los rayos de polvo flotan y el haz sigue de largo
export const E2Dusty: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const sweep = c01((tt - 0.8) / 6.5), bx = -1.4 + 2.8 * sweep;
  return <Studio tt={tt} floor="wood" night={0.75} warm={0.6} photo={0} keys={cam([0.1, 1.15, 2.7], [0, 0.4, 0])}>
    <RB p={[0, 1.6, -0.7]} s={[6, 3.2, 0.1]} rad={0.01} c="#a8a49c" r={0.9} />
    <group position={[-0.95, 0, -0.1]}>
      <RB p={[0, 0.16, 0]} s={[0.32, 0.3, 0.42]} rad={0.08} c="#5a6a8a" r={0.5} />
      <mesh position={[0, 0.65, -0.12]} rotation={[0.25, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.9, 10]} /><Mat c="#9aa0a8" m={0.9} r={0.3} /></mesh>
      <RB p={[0, 1.1, -0.24]} s={[0.12, 0.05, 0.05]} rad={0.02} c="#22252b" r={0.5} />
    </group>
    <group position={[0, 0, 0]}><RB p={[0, 0.17, 0]} s={[0.5, 0.34, 0.36]} rad={0.01} c="#b89a76" r={0.95} /><RB p={[0, 0.345, 0]} s={[0.52, 0.02, 0.38]} rad={0.004} c="#a88a66" r={0.95} />
      {[...Array(6)].map((_, i) => <RB key={i} p={[-0.18 + i * 0.07, 0.36, 0]} s={[0.02, 0.003, 0.3]} rad={0.001} c="#d8d0c0" r={1} op={0.5} />)}</group>
    <group position={[0.95, 0, 0]}><mesh position={[0, 0.25, 0]} scale={[1, 1.2, 0.8]}><sphereGeometry args={[0.28, 28, 20]} /><meshStandardMaterial color="#2a2c31" roughness={0.35} metalness={0.1} /></mesh><mesh position={[0, 0.58, 0]}><coneGeometry args={[0.06, 0.12, 12]} /><meshStandardMaterial color="#2a2c31" roughness={0.35} /></mesh></group>
    {[...Array(26)].map((_, i) => { const x = -1.4 + rnd(i) * 2.8, y = 0.2 + ((tt * 0.06 + rnd(i, 2)) % 1) * 1.1, near = Math.exp(-Math.pow((x - bx) / 0.35, 2)); return <mesh key={i} position={[x, y, 0.3 + rnd(i, 3) * 0.3]}><sphereGeometry args={[0.006, 6, 6]} /><meshBasicMaterial color="#fff2d0" transparent opacity={0.15 + 0.8 * near} toneMapped={false} /></mesh>; })}
    <spotLight position={[bx * 0.5, 1.4, 2.0]} target-position={[bx, 0.3, 0]} angle={0.22} penumbra={0.5} intensity={30} distance={6} color="#fff2d0" />
    <mesh position={[bx, 0.006, 0.2]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.3, 32]} /><meshBasicMaterial color="#fff2d0" transparent opacity={0.2} toneMapped={false} /></mesh>
  </Studio>;
}}</Stage>;

// 24 · tres pilas: la billetera (este mes), la cajita de acero (la reserva) y una billetera vieja (el señuelo) aterrizan una por una sobre la cama
export const E2Piles3: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const bill = useBillTex(), d = (i: number) => (1 - spr(tt, 0.7 + i * 1.3, 7, 0.5)) * 1.3;
  return <Room tt={tt} c={cam([0.15, 1.75, 2.0], [0, 0.55, 0.2])} wall="wood" z={-1.3}>
    <Bed3 quilt="#5a6a8a" />
    <group position={[-0.45, 0.74 + d(0), 0.3]} rotation={[0, 0.3, 0]}><Wallet3 s={1.6} col="#2a2c31" worn={0} /><Bill3 p={[0.06, 0.05, 0]} tex={bill} s={0.9} /></group>
    <group position={[0.02, 0.7 + d(1), 0.25]}><LockBox3 s={0.75} /></group>
    <group position={[0.48, 0.74 + d(2), 0.3]} rotation={[0, -0.25, 0]}><Wallet3 s={1.6} col="#8a5a34" worn={1} /></group>
  </Room>;
}}</Stage>;

// 25 · la terminal muerta: el posnet del surtidor se apaga, la luz pasa a roja y un billete entra solo por la ranura
export const E2Terminal: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const bill = useBillTex(), dead = sm(tt, 1.2, 1.6), slide = sm(tt, 3.0, 4.6);
  return <Room tt={tt} c={cam([0.3, 1.3, 2.3], [0, 1.08, 0])} wall="brick" z={-0.6} warm={0.8}>
    <RB p={[0, 0.55, -0.2]} s={[0.9, 1.1, 0.5]} rad={0.04} c="#c62a22" r={0.45} />
    <group position={[0, 1.05, 0.08]} rotation={[-0.25, 0, 0]}>
      <RB s={[0.42, 0.62, 0.1]} rad={0.04} c="#2a2c31" r={0.4} />
      <mesh position={[0, 0.14, 0.052]}><planeGeometry args={[0.32, 0.2]} /><meshBasicMaterial color={new THREE.Color("#7fd0a0").lerp(new THREE.Color("#0c0e10"), dead)} toneMapped={false} /></mesh>
      {[...Array(12)].map((_, i) => <RB key={i} p={[-0.1 + (i % 3) * 0.1, -0.05 - Math.floor(i / 3) * 0.055, 0.055]} s={[0.075, 0.04, 0.02]} rad={0.008} c="#4a4e56" r={0.5} />)}
      <mesh position={[0.16, 0.27, 0.055]}><sphereGeometry args={[0.018, 12, 12]} /><meshStandardMaterial color={dead > 0.5 ? "#ff5a4a" : "#6fe39a"} emissive={dead > 0.5 ? "#ff5a4a" : "#6fe39a"} emissiveIntensity={1.2} /></mesh>
      <RB p={[0, 0.33, 0.04]} s={[0.3, 0.02, 0.04]} rad={0.006} c="#111" r={0.5} />
    </group>
    <group position={[0, 1.4 - 0.0 * slide, 0.15 + 0.4 * (1 - slide)]} rotation={[-0.25, 0, 0]}><group position={[0, 0.12 * (1 - slide) - 0.06 * slide, 0]} rotation={[Math.PI / 2, 0, 0]}><Bill3 tex={bill} s={1.1} /></group></group>
  </Room>;
}}</Stage>;

// 26 · el frasco de galletitas: la tapa salta, aparece la plata del súper, la mano se la lleva y la puerta del fondo se cierra
export const E2Cookiejar: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const bill = useBillTex(), lid = sm(tt, 0.8, 1.4), up = sm(tt, 1.6, 2.6), gone = sm(tt, 3.2, 4.2), door = sm(tt, 4.6, 5.6);
  return <Room tt={tt} c={cam([0.25, 1.3, 2.0], [0, 0.85, 0])} wall="drywall" z={-1.0} warm={0.85}>
    <RB p={[0, 0.42, -0.1]} s={[1.6, 0.84, 0.6]} rad={0.02} c="#f2eee6" r={0.5} />
    <RB p={[0, 0.86, -0.1]} s={[1.66, 0.05, 0.64]} rad={0.012} c="#5a5e66" r={0.3} m={0.3} />
    <group position={[0, 0.885, 0]}>
      <mesh position={[0, 0.17, 0]} castShadow><cylinderGeometry args={[0.17, 0.15, 0.34, 40]} /><meshPhysicalMaterial color="#d8eaf0" transmission={0.5} roughness={0.08} transparent opacity={0.6} /></mesh>
      {[...Array(6)].map((_, i) => <mesh key={i} position={[Math.cos(i) * 0.08, 0.04 + (i % 2) * 0.03, Math.sin(i) * 0.08]} rotation={[0.3 * i, 0, 0]}><cylinderGeometry args={[0.045, 0.045, 0.012, 20]} /><meshStandardMaterial color="#b8864a" roughness={0.8} /></mesh>)}
      <group position={[0.25 * lid, 0.36 + 0.12 * Math.sin(lid * Math.PI), 0]} rotation={[0, 0, -0.8 * lid]}><mesh><cylinderGeometry args={[0.18, 0.18, 0.04, 40]} /><meshStandardMaterial color="#c62a22" roughness={0.45} /></mesh><mesh position={[0, 0.04, 0]}><sphereGeometry args={[0.035, 16, 12]} /><meshStandardMaterial color="#c62a22" roughness={0.45} /></mesh></group>
      <group position={[-0.9 * gone, 0.12 + 0.38 * up + 0.2 * gone, 0.0]} rotation={[0.6, 0.2, 0.3 + gone]}><Stack3 tex={bill} n={5} s={0.85} /></group>
    </group>
    <group position={[1.35, 0, -0.9]}><RB p={[0, 1.0, 0]} s={[0.05, 2.0, 0.05]} rad={0.01} c="#e8e2d6" r={0.8} /><group position={[-0.02, 0, 0]} rotation={[0, -1.3 * (1 - door), 0]}><RB p={[-0.42, 1.0, 0]} s={[0.84, 2.0, 0.05]} rad={0.01} c="#7a5a3a" r={0.6} /></group></group>
  </Room>;
}}</Stage>;

// 27 · los huevos: una canasta llena se vuelca y se rompen todos; al lado, tres canastas con dos huevos cada una, una se vuelca y las otras quedan
export const E2Eggs: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const tip = sm(tt, 1.0, 1.8), tip2 = sm(tt, 4.0, 4.8);
  const Basket = ({ p, n, k }: { p: V3; n: number; k: number }) => <group position={p} rotation={[0, 0, -1.3 * k]}>
    <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.2, 0.15, 0.16, 28, 1, true]} /><meshStandardMaterial color="#a07a4a" roughness={0.95} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.15, 28]} /><meshStandardMaterial color="#8a6a3a" /></mesh>
    <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.19, 0.012, 8, 28, Math.PI]} /><meshStandardMaterial color="#8a6a3a" roughness={0.95} /></mesh>
    {[...Array(n)].map((_, i) => k > 0.6 ? null : <mesh key={i} position={[(i % 3 - 1) * 0.08, 0.1 + Math.floor(i / 3) * 0.06, (i % 2) * 0.05 - 0.02]} scale={[1, 1.3, 1]}><sphereGeometry args={[0.04, 16, 12]} /><meshStandardMaterial color="#f2ead6" roughness={0.6} /></mesh>)}
  </group>;
  const Splat = ({ p, k }: { p: V3; k: number }) => k > 0.6 ? <group position={p}>{[0, 1, 2].map((i) => <mesh key={i} position={[i * 0.12 - 0.12, 0.004, (i % 2) * 0.08]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.07, 20]} /><meshStandardMaterial color="#f2ead6" roughness={0.3} /></mesh>)}{[0, 1, 2].map((i) => <mesh key={"y" + i} position={[i * 0.12 - 0.12, 0.01, (i % 2) * 0.08]}><sphereGeometry args={[0.025, 12, 8]} /><meshStandardMaterial color="#e8a020" roughness={0.3} /></mesh>)}</group> : null;
  return <Room tt={tt} c={cam([0, 1.45, 2.3], [0, 0.35, 0])} wall="wood" z={-0.9}>
    <RB p={[0, 0.2, 0]} s={[2.6, 0.04, 0.9]} rad={0.01} c="#d8c8a8" r={0.7} />
    <group position={[-0.75, 0.22, 0]}><Basket p={[0, 0, 0]} n={6} k={tip} /><Splat p={[0.32, 0, 0.05]} k={tip} /></group>
    {[0.25, 0.65, 1.05].map((x, i) => <group key={i} position={[x, 0.22, 0]}><Basket p={[0, 0, 0]} n={2} k={i === 0 ? tip2 : 0} />{i === 0 && <Splat p={[0.02, 0, 0.25]} k={tip2} />}</group>)}
  </Room>;
}}</Stage>;

// 28 · una caja con manija vs una atornillada: la cajita suelta se va hacia la puerta; la otra baja, cuatro pernos entran girando y el piso la sujeta
export const E2Boltin: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const walk = sm(tt, 1.0, 3.2), bolt = c01((tt - 3.6) / 2.4);
  return <Room tt={tt} c={cam([0.3, 1.0, 1.55], [0.2, 0.25, 0])} wall="drywall" z={-1.0}>
    <group position={[-0.6 - 1.4 * walk, 0.05 + 0.35 * Math.min(1, walk * 4) + 0.03 * Math.sin(walk * 20), 0.1]} rotation={[0, 0.5 * walk, 0.08 * Math.sin(walk * 20)]}><LockBox3 s={0.8} /><mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.08, 0.015, 8, 20, Math.PI]} /><Mat c="#c9ced4" m={0.95} r={0.25} /></mesh></group>
    <group position={[0.65, 0, 0.05]}>
      <RB p={[0, 0.006, 0]} s={[0.6, 0.012, 0.45]} rad={0.003} c="#8a7a64" r={0.9} />
      <group position={[0, 0.012 + 0.5 * (1 - spr(tt, 0.8, 7, 0.55)), 0]}><LockBox3 s={0.8} bolts={bolt} /></group>
    </group>
  </Room>;
}}</Stage>;

// 29 · del tamaño de una tostadora: la tostadora gira sobre la mesada, se vuelve de acero y aparece la cajita con su cerradura
export const E2Toaster: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const m = sm(tt, 2.2, 3.4), spin = 0.8 * Math.sin(tt * 0.7), pop = spr(tt, 0.8, 9, 0.45) * (1 - m);
  return <Room tt={tt} c={cam([0.05, 0.85, 1.0], [0, 0.58, 0])} wall="drywall" z={-0.7}>
    <RB p={[0, 0.22, 0]} s={[1.6, 0.44, 0.8]} rad={0.02} c="#e8e2d6" r={0.5} />
    <group position={[0, 0.44, 0]} rotation={[0, spin, 0]}>
      <group scale={1 - m * 0.999}>
        <RB p={[0, 0.13, 0]} s={[0.42, 0.26, 0.24]} rad={0.08} c="#c9ced4" m={0.9} r={0.2} />
        {[-0.06, 0.06].map((z, i) => <RB key={i} p={[0, 0.262, z]} s={[0.3, 0.01, 0.035]} rad={0.004} c="#1a1a1e" r={0.5} />)}
        {[-0.06, 0.06].map((z, i) => <RB key={"b" + i} p={[0, 0.2 + 0.12 * pop, z]} s={[0.24, 0.16, 0.025]} rad={0.02} c="#c8904a" r={0.9} />)}
        <RB p={[0.22, 0.16, 0]} s={[0.02, 0.05, 0.04]} rad={0.006} c="#22252b" r={0.4} />
      </group>
      <group scale={0.001 + m}><LockBox3 p={[0, 0, 0]} s={0.85} /></group>
    </group>
  </Room>;
}}</Stage>;

// 30 · dos capas: la plata entra a una bolsa ignífuga con cierre, esa bolsa a una bolsa sellada; después pasan una llamita y unas gotas y no entra nada
export const E2Twolayers: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const bill = useBillTex(), in1 = sm(tt, 0.6, 1.6), zip = sm(tt, 1.6, 2.2), in2 = sm(tt, 2.4, 3.4), seal = sm(tt, 3.4, 3.9), fire = c01((tt - 4.4) / 1.6), rain = c01((tt - 6.2) / 1.6);
  const f = 0.9 + 0.1 * Math.sin(tt * 2 * Math.PI * 1.4);
  return <Room tt={tt} c={cam([0, 0.85, 1.05], [0, 0.52, 0])} wall="drywall" z={-0.7}>
    <RB p={[0, 0.2, 0]} s={[1.6, 0.4, 0.8]} rad={0.02} c="#5e412a" r={0.5} />
    <group position={[0, 0.44, 0]}>
      <group position={[0, 0.35 * (1 - in1), 0]}><Stack3 p={[0, 0.02, 0]} tex={bill} n={8} s={0.95} /></group>
      <group scale={[1, 1, 1]}>
        <RB p={[0, 0.05, 0]} s={[0.42, 0.1, 0.24]} rad={0.04} c="#b89a5a" r={0.85} op={0.25 + 0.75 * in1} />
        <RB p={[-0.21 + 0.42 * zip / 2, 0.1, 0.12]} s={0.42 * zip > 0 ? [0.42 * zip, 0.01, 0.01] : [0.001, 0.01, 0.01]} rad={0.002} c="#c9ced4" m={0.9} r={0.3} />
      </group>
      {in2 > 0 && <RB p={[0, 0.06 + 0.4 * (1 - in2), 0]} s={[0.52, 0.14, 0.32]} rad={0.05} c="#e8f2f6" r={0.05} m={0.1} op={0.35} />}
      {seal > 0 && <RB p={[0, 0.06, 0.17]} s={[0.5 * seal, 0.012, 0.01]} rad={0.003} c="#2a6ab0" r={0.4} />}
    </group>
    {fire > 0 && fire < 1 && <group position={[-0.8 + 0.5 * fire, 0.62, 0.1]}><mesh scale={[1, f, 1]}><coneGeometry args={[0.05, 0.18, 16]} /><meshBasicMaterial color="#ffb257" toneMapped={false} transparent opacity={Math.sin(fire * Math.PI)} /></mesh></group>}
    {fire > 0 && fire < 1 && <pointLight position={[-0.5, 0.7, 0.2]} intensity={1.4 * Math.sin(fire * Math.PI)} distance={1.8} color="#ffb257" />}
    {rain > 0 && rain < 1 && [...Array(10)].map((_, i) => { const y = 1.2 - ((rain * 2.2 + rnd(i)) % 1) * 0.6; return <mesh key={i} position={[-0.25 + i * 0.055, y, 0.02]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.012, 8, 8]} /><meshStandardMaterial color="#8fc8e8" roughness={0.05} /></mesh>; })}
  </Room>;
}}</Stage>;

// 31 · la billetera de Earl: primer plano de la billetera vieja; se abre y se ven 40 en billetes chicos, la tarjeta de la biblioteca y dos tarjetas vencidas
export const E2Wallet: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const bill = useBillTex(), op = sm(tt, 1.0, 2.2), cards = (i: number) => sm(tt, 2.4 + i * 0.5, 3.0 + i * 0.5);
  return <Room tt={tt} c={cam([0.05, 0.85, 0.72], [0.02, 0.42, 0])} wall="wood" z={-0.6} warm={0.75}>
    <RB p={[0, 0.2, 0]} s={[1.4, 0.4, 0.8]} rad={0.03} c="#5e412a" r={0.45} />
    <group position={[0.1, 0.4, 0]} rotation={[0, -0.25, 0]}>
      <Wallet3 s={2.0} open={op} col="#7a4a28" worn={1} />
      {[0, 1].map((j) => <Bill3 key={j} p={[0.06 + 0.02 * j, 0.06 + 0.004 * j, 0.02 * j]} rot={[0, 0.1 + j * 0.15, 0]} tex={bill} s={0.95} />)}
      {[["#d8d0a8", 0], ["#2a5aa0", 1], ["#a02a2a", 2]].map(([c, i]) => { const k = cards(i as number); return <RB key={i as number} p={[-0.25 - 0.1 * k * (i as number), 0.05 + 0.006 * (i as number) + 0.02 * k, -0.06 + 0.07 * k * (i as number)]} rot={[0, 0.3 * k * (i as number), 0]} s={[0.17, 0.004, 0.11]} rad={0.008} c={c as string} r={0.4} />; })}
    </group>
  </Room>;
}}</Stage>;

export const HEROES_E2 = { photos: E2Photos, tapeunder: E2Tapeunder, flipped: E2Flipped, headlights: E2Headlights, trio: E2Trio, heartline: E2Heartline, dusty: E2Dusty, piles3: E2Piles3, terminal: E2Terminal, cookiejar: E2Cookiejar, eggs: E2Eggs, boltin: E2Boltin, toaster: E2Toaster, twolayers: E2Twolayers, wallet: E2Wallet };
