// rk29c · VUELTA 2 (29-oct). Las quejas de la vuelta 1 fueron siempre las mismas: algo cortado por el borde, escena oscura, objeto chico,
// aparece de golpe. Cada pieza se rehace SIMPLE: UN mecanismo grande y entero en cuadro, pared y piso claros, llega con peso en la
// palabra clave, cámara fija con curva lenta; texto sólo 1-2 palabras grandes sobre placa.
import React from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { Studio, Wall3, Fob3, Car3, Thief3, RB, Mat, sm, spr, c01, rnd, type V3 } from "./studio3d";
import { useTxt, Person3, Hand3 } from "./lock3d";
import { Safe3, GDoor3, Peg3, Dolly3, Can3, Heater3, Box3 } from "./garage3d";
import { Bar3, Sledge3, Grinder3, House3 } from "./heroes3b";
import { Bike3, Gen3 } from "./heroes3c";

type P = { t: number; h: H };
type WK = "brick" | "wood" | "drywall";
type FL = "wood" | "concrete" | "tile" | "paper" | "none";
const cam = (p: V3, l: V3, fov = 42): any[] => {
  // entrada: la cámara llega planeando desde más atrás y de costado en 1,5 s (el arranque nunca queda quieto); después deriva lenta y retrocede apenas (compensa el empuje de salida de Cam)
  const d: V3 = [(p[0] - l[0]) * 1.08, (p[1] - l[1]) * 1.08, (p[2] - l[2]) * 1.08];
  p = [l[0] + d[0], l[1] + d[1], l[2] + d[2]];
  return [{ t: 0, p: [l[0] + d[0] * 1.22 - 0.35, l[1] + d[1] * 1.12, l[2] + d[2] * 1.22], l, fov }, { t: 1.5, p, l, fov }, { t: 12, p: [p[0] + 0.18, p[1] + 0.02, p[2] + 0.12], l, fov, arc: 0.03 }];
};
const Room: React.FC<{ tt: number; c: any[]; wall?: WK; floor?: FL; z?: number; warm?: number; night?: number; children: React.ReactNode }> = ({ tt, c, wall = "drywall", floor = "concrete", z = -0.8, warm = 0.95, night = 0, children }) =>
  <Studio tt={tt} floor={floor} warm={warm} night={night} photo={0} keys={c}><Wall3 p={[0, 1.7, z]} s={[14, 3.8, 0.1]} kind={wall} />{children}</Studio>;
const Plate: React.FC<{ p: V3; w: number; h: number; txt: string[]; bg?: string; fg?: string; size?: number; rot?: V3; op?: number }> = ({ p, w, h, txt, bg = "#f6f3ec", fg = "#22252b", size = 120, rot, op }) => {
  const m = useTxt(txt, 1024, Math.round(1024 * h / w), bg, fg, size, "Arial Black");
  return <group position={p} rotation={rot}><RB p={[0, 0, -0.012]} s={[w + 0.03, h + 0.03, 0.02]} rad={0.008} c="#2a2c31" r={0.5} /><mesh><planeGeometry args={[w, h]} /><meshBasicMaterial map={m} transparent={op !== undefined} opacity={op ?? 1} /></mesh></group>;
};
const drop = (tt: number, a: number, hgt = 1.2) => (1 - spr(tt, a, 8, 0.5)) * hgt;
const Cut: React.FC<{ p?: V3; w?: number; d?: number; h?: number }> = ({ p = [0, 0, 0], w = 2.4, d = 0.8, h = 0.5 }) => <group position={p}>
  <RB p={[0, -h / 2, 0]} s={[w, h, d]} rad={0.01} c="#a8a59c" r={0.95} />
  {[...Array(46)].map((_, i) => <mesh key={i} position={[(rnd(i) - 0.5) * w * 0.94, -h * (0.08 + 0.84 * rnd(i, 2)), d / 2 + 0.003]}><circleGeometry args={[0.012 + 0.022 * rnd(i, 3), 7]} /><meshBasicMaterial color={rnd(i, 4) > 0.5 ? "#7d796e" : "#c4c0b4"} /></mesh>)}
</group>;
const Key: React.FC<{ p?: V3; rot?: V3; s?: number; c?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, c = "#d8b04a" }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.12, 0]}><torusGeometry args={[0.05, 0.016, 10, 28]} /><Mat c={c} m={1} r={0.25} /></mesh>
  <RB p={[0, -0.03, 0]} s={[0.035, 0.2, 0.014]} rad={0.004} c={c} m={1} r={0.25} />
  {[0, 1].map((j) => <RB key={j} p={[0.03, -0.1 + j * 0.05, 0]} s={[0.035, 0.025, 0.014]} rad={0.003} c={c} m={1} r={0.25} />)}
</group>;
const Pad: React.FC<{ p?: V3; s?: number; col?: string; sh?: number }> = ({ p = [0, 0, 0], s = 1, col = "#c9a23a", sh = 1 }) => <group position={p} scale={s}><RB s={[0.5, 0.42, 0.18]} rad={0.05} c={col} m={0.9} r={0.25} /><mesh position={[0, 0.21 + 0.08 * (1 - sh), 0]}><torusGeometry args={[0.16, 0.035, 12, 32, Math.PI]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh></group>;

// 1 · la losa: a la izquierda la caja cae sobre tablas finas que se parten con astillas; a la derecha queda hundida en el concreto con cuatro pernos de cromo
export const C01: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const fA = c01((tt - 0.7) / 0.5), brk = sm(tt, 1.2, 1.6), fB = c01((tt - 2.2) / 0.5), glow = sm(tt, 3.0, 3.8);
  const yA = fA < 1 ? 1.2 * (1 - fA * fA) : -0.28 * brk;
  return <Room tt={tt} c={cam([0, 1.05, 3.7], [0, 0.35, 0])} wall="drywall" floor="none">
    <group position={[-1.0, 0.25, 0]}>
      {[-0.65, 0.65].map((x, i) => <RB key={i} p={[x, -0.25, 0]} s={[0.12, 0.5, 0.8]} rad={0.01} c="#8a6a4a" r={0.7} />)}
      {[-2, -1, 1, 2].map((i) => <RB key={i} p={[i * 0.27 + (i > 0 ? -0.12 : 0.12), 0.015, 0]} s={[0.26, 0.03, 0.8]} rad={0.004} c="#c89a5a" r={0.7} />)}
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.02, 0.015, 0]} rotation={[0, 0, -sd * 0.9 * brk]}><RB p={[sd * 0.14, 0, 0]} s={[0.27, 0.03, 0.8]} rad={0.004} c="#c89a5a" r={0.7} /></group>)}
      {brk > 0 && brk < 1 && [...Array(10)].map((_, i) => <RB key={i} p={[(rnd(i) - 0.5) * 0.5 + (rnd(i, 2) - 0.5) * 0.6 * brk, 0.05 + 0.5 * brk * rnd(i, 3) - 0.6 * brk * brk, (rnd(i, 4) - 0.5) * 0.6]} rot={[rnd(i, 5) * 6 * brk, 0, rnd(i, 6) * 6 * brk]} s={[0.1, 0.012, 0.02]} rad={0.002} c="#d8aa6a" r={0.7} />)}
      {tt >= 0.7 && <Safe3 p={[0, 0.03 + yA, 0]} s={0.75} rot={[0, 0, 0.18 * brk]} />}
    </group>
    <group position={[1.0, 0.35, 0]}>
      <Cut w={1.6} d={0.9} h={0.7} />
      {tt >= 2.2 && <Safe3 p={[0, -0.14 + (fB < 1 ? 1.2 * (1 - fB * fB) : 0), 0]} s={0.75} />}
      {fB >= 1 && [-0.38, -0.13, 0.13, 0.38].map((x, i) => <group key={i} position={[x, 0, 0.455]}>
        <mesh position={[0, -0.28, 0]}><cylinderGeometry args={[0.035, 0.035, 0.42, 14]} /><meshStandardMaterial color="#e8ecf0" metalness={1} roughness={0.15} emissive="#ffb257" emissiveIntensity={0.9 * glow} /></mesh>
        <mesh position={[0, -0.28, -0.004]}><planeGeometry args={[0.09, 0.46]} /><meshBasicMaterial color="#3a3630" /></mesh>
      </group>)}
    </group>
  </Room>;
}}</Stage>;

// 2 · el portón baja detrás de él: desde adentro, el vano con la calle de tarde se achica y la luz del piso queda en una raya; él se da vuelta a mirar
const Street: React.FC<{ p: V3; w: number; hh: number }> = ({ p, w, hh }) => {
  const tex = React.useMemo(() => {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 820; const g = c.getContext("2d")!;
    const gr = g.createLinearGradient(0, 0, 0, 820); gr.addColorStop(0, "#ffe9b0"); gr.addColorStop(0.6, "#ffc45e"); gr.addColorStop(1, "#f0a848"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 820);
    g.fillStyle = "#7a5a44"; g.fillRect(560, 330, 330, 260); g.beginPath(); g.moveTo(530, 335); g.lineTo(725, 210); g.lineTo(920, 335); g.fill();
    g.fillStyle = "#ffe08a"; g.fillRect(610, 400, 70, 60); g.fillRect(770, 400, 70, 60);
    g.fillStyle = "#5a7a3a"; g.beginPath(); g.arc(250, 470, 120, 0, Math.PI * 2); g.fill(); g.fillStyle = "#4a3a2a"; g.fillRect(238, 470, 24, 130);
    g.fillStyle = "#c9b08a"; g.fillRect(0, 590, 1024, 230); g.fillStyle = "#b39a76"; g.fillRect(380, 590, 260, 230);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, []);
  return <mesh position={p}><planeGeometry args={[w, hh]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>;
};
export const C02: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const up = 1 - sm(tt, 0.9, 4.2), turn = sm(tt, 2.4, 3.6), o = Math.min(1, up * 1.2);
  const d = 0.06 + 2.3 * o;
  return <Room tt={tt} c={cam([0.3, 1.2, 5.6], [0, 1.05, 0])} wall="drywall" z={-0.4} night={0.6}>
    <Street p={[0, 1.13, -0.33]} w={2.8} hh={2.26} />
    {[-1, 1].map((sd) => <RB key={sd} p={[sd * 1.44, 1.2, -0.12]} s={[0.07, 2.35, 0.1]} rad={0.01} c="#8a8f96" m={0.8} r={0.35} />)}
    <GDoor3 p={[0, 0, -0.2]} up={up} />
    <mesh position={[0.1, 0.006, -0.12 + d / 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.7, d]} /><meshBasicMaterial color="#ffcf70" transparent opacity={0.55} toneMapped={false} /></mesh>
    <Thief3 p={[0.7, 0, 1.5]} yaw={Math.PI * turn} />
  </Room>;
}}</Stage>;

// 3 · el ojo del ladrón: una linterna barre el tablero y cada herramienta se prende con su sombra; frena sobre el bulto tapado con lona
const beam = (F: V3, S: V3) => {
  const d = new THREE.Vector3(F[0] - S[0], F[1] - S[1], F[2] - S[2]), len = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  return { len, q, mid: [(F[0] + S[0]) / 2, (F[1] + S[1]) / 2, (F[2] + S[2]) / 2] as V3 };
};
export const C03: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const sw = sm(tt, 0.6, 4.0), jump = sm(tt, 4.2, 4.9);
  const S: V3 = [-1.25 + 1.75 * sw + (1.35 - 0.5) * jump, 1.35 - 0.85 * jump, -0.34 + 0.75 * jump];
  const F: V3 = [1.9, 1.75, 1.5], b = beam(F, S);
  const lit = [0, 1, 2, 3, 4, 5].filter((i) => [-0.6, -0.15, 0.3, 0.65, -0.55, 0.2][i] - 0.3 < S[0] - 0.05 || jump > 0);
  return <Room tt={tt} c={cam([0, 1.25, 3.8], [0.2, 1.0, 0])} wall="drywall" z={-0.45} night={0.75}>
    <Peg3 p={[-0.3, 1.35, -0.38]} lit={lit} />
    <RB p={[-0.3, 0.45, -0.1]} s={[2.0, 0.08, 0.6]} rad={0.01} c="#7a5a3a" r={0.7} />
    <pointLight position={[S[0], S[1] + 0.1, S[2] + 0.45]} intensity={2.4} distance={1.6} color="#fff2c8" />
    <mesh position={b.mid} quaternion={b.q}><coneGeometry args={[0.32, b.len, 32, 1, true]} /><meshBasicMaterial color="#fff2c0" transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
    <group position={F} quaternion={b.q}><mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.045, 0.06, 0.28, 18]} /><Mat c="#2a2c31" m={0.6} r={0.4} /></mesh><mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.065, 0.065, 0.04, 18]} /><meshBasicMaterial color="#fff8e0" toneMapped={false} /></mesh></group>
    <group position={[1.35, 0, 0.4]}>
      <mesh position={[0, 0.42, 0]}><sphereGeometry args={[0.45, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} /><Mat c="#3a5a8a" r={0.9} e="#fff2c8" ei={0.35 * jump} /></mesh>
      <mesh position={[0, 0.21, 0]}><cylinderGeometry args={[0.45, 0.5, 0.42, 32]} /><Mat c="#3a5a8a" r={0.9} e="#fff2c8" ei={0.35 * jump} /></mesh>
      {[...Array(6)].map((_, i) => <mesh key={i} position={[Math.cos(i) * 0.47, 0.2, Math.sin(i) * 0.47]} rotation={[0, -i, 0.15]}><cylinderGeometry args={[0.02, 0.03, 0.4, 6]} /><Mat c="#2e4a72" r={0.9} /></mesh>)}
    </group>
  </Room>;
}}</Stage>;

// 4 · una docena de veces: el portón sube y baja; el contador mecánico de al lado llega a 12
export const C04: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const cyc = c01((tt - 0.4) / 6) * 12, n = Math.min(12, Math.floor(cyc + 0.5)), up = 0.5 - 0.5 * Math.cos(cyc * Math.PI * 2);
  return <Room tt={tt} c={cam([0.6, 1.4, 6.0], [0.6, 1.2, 0])} wall="brick" z={-0.4}>
    <GDoor3 p={[-0.6, 0, -0.2]} up={up * 0.8} w={2.4} />
    <group position={[2.6, 1.3, 0]}><RB s={[1.1, 0.8, 0.3]} rad={0.04} c="#22252b" r={0.4} /><Plate p={[0, 0, 0.16]} w={0.95} h={0.65} txt={[`${n}`]} bg="#101114" fg="#ffb257" size={520} /></group>
  </Room>;
}}</Stage>;

// 5 · las ventanitas son un cuadro: un marco dorado tallado crece en la pared de galería y adentro la caja fuerte queda iluminada como un óleo
export const C05: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const f = spr(tt, 0.8, 6, 0.6), lt = sm(tt, 1.6, 2.6);
  return <Room tt={tt} c={cam([0, 1.4, 3.3], [0, 1.35, 0])} wall="wood" z={-0.5} night={0.55}>
    <RB p={[0, 1.4, -0.42]} s={[1.5, 1.1, 0.04]} rad={0.004} c="#1a1714" r={0.9} />
    <RB p={[0, 0.98, -0.25]} s={[1.3, 0.04, 0.34]} rad={0.004} c="#3a2a1e" r={0.8} />
    <Safe3 p={[0, 1.0, -0.25]} s={0.6} />
    <pointLight position={[0, 1.85, 0.15]} intensity={4 * lt} distance={1.6} color="#ffd29f" />
    <group position={[0, 1.4, -0.2]} scale={[Math.max(0.001, f), Math.max(0.001, f), 1]}>
      {[[0, 0.62, 1.74, 0.16], [0, -0.62, 1.74, 0.16], [-0.83, 0, 0.16, 1.4], [0.83, 0, 0.16, 1.4]].map(([x, y, w, hh], i) => <RB key={i} p={[x, y, 0.06]} s={[w, hh, 0.12]} rad={0.04} c="#d8a830" m={1} r={0.3} />)}
      {[[0, 0.52, 1.56, 0.04], [0, -0.52, 1.56, 0.04], [-0.73, 0, 0.04, 1.08], [0.73, 0, 0.04, 1.08]].map(([x, y, w, hh], i) => <RB key={i} p={[x, y, 0.1]} s={[w, hh, 0.05]} rad={0.015} c="#b8862a" m={1} r={0.35} />)}
      {[[-0.83, 0.62], [0.83, 0.62], [-0.83, -0.62], [0.83, -0.62], [0, 0.66]].map(([x, y], i) => <mesh key={i} position={[x, y, 0.13]}><sphereGeometry args={[0.07, 20, 14]} /><Mat c="#e8bc48" m={1} r={0.25} /></mesh>)}
      {[...Array(14)].map((_, i) => <mesh key={i} position={[-0.7 + i * 0.108, 0.62, 0.125]}><torusGeometry args={[0.03, 0.01, 6, 14]} /><Mat c="#e8bc48" m={1} r={0.3} /></mesh>)}
    </group>
    <group position={[0, 2.25, 0.05]} rotation={[0.6, 0, 0]}><RB s={[0.5, 0.05, 0.08]} rad={0.02} c="#22252b" m={0.8} r={0.3} /><mesh position={[0, -0.03, 0.02]}><boxGeometry args={[0.44, 0.01, 0.03]} /><meshBasicMaterial color="#fff2c8" toneMapped={false} /></mesh></group>
    <RB p={[1.15, 1.05, -0.43]} s={[0.26, 0.16, 0.02]} rad={0.005} c="#f2efe6" r={0.8} op={lt} />
  </Room>;
}}</Stage>;

// 6 · el cono de vista: desde la puerta entra un cono de luz; la caja está adentro, se corre a la esquina ciega y su brillo se apaga
export const C06: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const mv = sm(tt, 2.0, 3.8), F: V3 = [0.3, 1.1, -1.9], S: V3 = [0.3, 0.0, 1.0], b = beam(F, S);
  return <Room tt={tt} c={[{ t: 0, p: [0.2, 3.3, 3.6], l: [-0.2, 0.2, -0.6], fov: 44 }, { t: 12, p: [0.35, 3.2, 3.5], l: [-0.2, 0.2, -0.6], fov: 44, arc: 0.02 }]} wall="drywall" z={-2.0} night={0.6}>
    <RB p={[-2.2, 0.6, -0.5]} s={[0.1, 1.2, 3.0]} rad={0.01} c="#e8e4da" r={0.8} />
    <mesh position={[0.3, 1.0, -1.93]}><planeGeometry args={[0.9, 2.0]} /><meshBasicMaterial color="#fff0c8" toneMapped={false} /></mesh>
    <mesh position={[0.3, 0.01, -0.3]} rotation={[-Math.PI / 2, 0, 0]}><shapeGeometry args={[(() => { const s = new THREE.Shape(); s.moveTo(-0.45, 1.6); s.lineTo(-1.4, -1.6); s.lineTo(1.4, -1.6); s.lineTo(0.45, 1.6); s.lineTo(-0.45, 1.6); return s; })()]} /><meshBasicMaterial color="#ffe08a" transparent opacity={0.35} toneMapped={false} /></mesh>
    <mesh position={b.mid} quaternion={b.q}><coneGeometry args={[1.25, b.len, 40, 1, true]} /><meshBasicMaterial color="#fff2c0" transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
    <group position={[0.3 - 1.95 * mv, 0, 0.1 - 1.6 * mv]}><Safe3 s={0.75} col={mv > 0.7 ? "#2a2c31" : "#55606c"} />
      <mesh position={[0, 0.4, 0]}><boxGeometry args={[0.56, 0.78, 0.5]} /><meshBasicMaterial color="#ffe08a" transparent opacity={0.12 * (1 - mv)} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh></group>
  </Room>;
}}</Stage>;

// 7 · film esmerilado: la caja se ve nítida detrás de la ventana; una lámina lechosa baja vidrio por vidrio y la caja queda en sombra
export const C07: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const W = 1.5, Hh = 1.3, pw = W / 2 - 0.08, ph = Hh / 2 - 0.08;
  return <Room tt={tt} c={cam([0.15, 1.15, 2.7], [0, 1.1, 0])} wall="drywall" z={-2.6}>
    <RB p={[0, 0.3, -1.3]} s={[1.1, 0.6, 0.8]} rad={0.02} c="#6a4a32" r={0.7} />
    <Safe3 p={[0, 0.6, -1.3]} s={0.85} />
    <group position={[0, 0, 0]}>
      <RB p={[-1.85, 1.3, 0]} s={[2.2, 2.6, 0.16]} rad={0.01} c="#a8553f" r={0.9} />
      <RB p={[1.85, 1.3, 0]} s={[2.2, 2.6, 0.16]} rad={0.01} c="#a8553f" r={0.9} />
      <RB p={[0, 0.25, 0]} s={[1.5, 0.5, 0.16]} rad={0.01} c="#a8553f" r={0.9} />
      <RB p={[0, 2.25, 0]} s={[1.5, 0.7, 0.16]} rad={0.01} c="#a8553f" r={0.9} />
    </group>
    <group position={[0, 1.15, 0.02]}>
      {[[0, 0.62, 1.56, 0.08], [0, -0.62, 1.56, 0.08], [-0.76, 0, 0.08, 1.32], [0.76, 0, 0.08, 1.32], [0, 0, 0.06, 1.2], [0, 0, 1.5, 0.06]].map(([x, y, w, hh], i) => <RB key={i} p={[x, y, 0.02]} s={[w, hh, 0.09]} rad={0.01} c="#f2f0ea" r={0.6} />)}
      {[0, 1, 2, 3].map((i) => {
        const f = sm(tt, 0.9 + i * 0.7, 1.6 + i * 0.7), cx = (i % 2 ? 1 : -1) * (pw / 2 + 0.04), cy = (i < 2 ? 1 : -1) * (ph / 2 + 0.04), fh = ph * f;
        return <group key={i} position={[cx, cy + ph / 2, 0.04]}>
          {f > 0.001 && <mesh position={[0, -fh / 2, 0]}><planeGeometry args={[pw, fh]} /><meshStandardMaterial color="#f4f6f8" transparent opacity={0.86} roughness={1} /></mesh>}
          {f > 0.001 && f < 0.999 && <mesh position={[0, -fh, 0.015]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.022, 0.022, pw, 20]} /><meshStandardMaterial color="#ffffff" roughness={0.6} /></mesh>}
        </group>;
      })}
    </group>
  </Room>;
}}</Stage>;

// 8 · dos hombres y un carrito: entre los dos inclinan el carrito con la caja; la aguja de la balanza marca 400
export const C08: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const tilt = sm(tt, 1.2, 2.4) * 0.45, ang = 1.2 - 2.0 * spr(tt, 2.2, 6, 0.4) * 0.85;
  return <Room tt={tt} c={cam([0, 1.3, 4.6], [0, 0.95, 0])} wall="drywall" z={-1.0}>
    <group><Dolly3 p={[0, 0, 0]} tilt={tilt} /><group position={[0, 0.12, 0]} rotation={[-tilt, 0, 0]}><Safe3 p={[0, -0.06, 0.15]} s={0.7} /></group></group>
    <Person3 p={[-0.9, 0, -0.2]} yaw={0.6} s={1.0} col="#3a5a7a" arm={0.6} /><Person3 p={[0.9, 0, -0.2]} yaw={-0.6} s={1.0} col="#7a4a3a" arm={0.6} />
    <group position={[1.9, 1.2, -0.6]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.42, 0.42, 0.08, 48]} /><Mat c="#f6f3ec" r={0.6} /></mesh><Plate p={[0, -0.18, 0.045]} w={0.4} h={0.14} txt={["400 LB"]} size={150} /><group position={[0, 0, 0.06]} rotation={[0, 0, ang]}><RB p={[0, 0.17, 0]} s={[0.03, 0.34, 0.02]} rad={0.01} c="#c62a22" r={0.4} /></group></group>
  </Room>;
}}</Stage>;

// 9 · la volcaron sobre la manta, la deslizaron y subió la rampa al camión: cámara de costado que la acompaña
const Lying: React.FC<{ s: number }> = ({ s }) => <group position={[-0.5 * s, 0.35 * s, 0]} rotation={[0, 0, -Math.PI / 2]}><Safe3 s={s} /></group>;
export const C09: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const s = 0.8, tip = sm(tt, 0.6, 1.5), slide = sm(tt, 1.7, 2.9), ramp = sm(tt, 3.1, 4.6), bed = sm(tt, 4.7, 5.6);
  const a = Math.atan2(0.62, 0.95), L = Math.hypot(0.62, 0.95), foot: V3 = [0.3, 0, 0];
  const P1 = [foot[0] + 0.4 * Math.cos(a), 0.4 * Math.sin(a)], P2 = [foot[0] + (L - 0.4) * Math.cos(a), (L - 0.4) * Math.sin(a)];
  let body: React.ReactNode;
  if (tip < 1) body = <group position={[-1.5 + 0.35 * s, 0.03, 0]} rotation={[0, 0, -Math.PI / 2 * tip]}><Safe3 p={[-0.35 * s, 0, 0]} s={s} /></group>;
  else if (ramp <= 0) body = <group position={[-0.82 + 0.72 * slide, 0.03, 0]}><Lying s={s} /></group>;
  else if (bed <= 0) { const u = ramp, w = sm(u, 0, 0.18), x = -0.1 + (P1[0] + 0.1) * w + (P2[0] - P1[0]) * u, y = P1[1] * w + (P2[1] - P1[1]) * u; body = <group position={[x, y + 0.03, 0]} rotation={[0, 0, a * w]}><Lying s={s} /></group>; }
  else body = <group position={[P2[0] + (1.95 - P2[0]) * bed, P2[1] + (0.65 - P2[1]) * sm(bed, 0, 0.3), 0]} rotation={[0, 0, a * (1 - sm(bed, 0, 0.3))]}><Lying s={s} /></group>;
  return <Room tt={tt} c={[{ t: 0, p: [-0.9, 1.15, 3.1], l: [-0.9, 0.5, 0], fov: 42 }, { t: 2.6, p: [-0.3, 1.15, 3.1], l: [-0.3, 0.5, 0], fov: 42 }, { t: 5.6, p: [1.0, 1.35, 3.3], l: [1.0, 0.7, 0], fov: 42 }, { t: 12, p: [1.15, 1.37, 3.35], l: [1.0, 0.7, 0], fov: 42 }]} wall="drywall" z={-1.0}>
    <RB p={[-1.0, 0.012, 0]} s={[2.0, 0.024, 1.0]} rad={0.006} c="#3a5a9a" r={0.95} />
    {[...Array(9)].map((_, i) => <mesh key={i} position={[-1.9 + rnd(i) * 1.8, 0.026, (rnd(i, 2) - 0.5) * 0.6]} rotation={[Math.PI / 2, 0, rnd(i, 3) - 0.5]}><cylinderGeometry args={[0.014, 0.014, 0.5 + 0.4 * rnd(i, 4), 8]} /><Mat c="#335290" r={0.95} /></mesh>)}
    <mesh position={[foot[0] + L / 2 * Math.cos(a), L / 2 * Math.sin(a), 0]} rotation={[0, 0, a]}><boxGeometry args={[L, 0.03, 0.8]} /><Mat c="#9aa0a8" m={0.8} r={0.35} /></mesh>
    <group position={[2.2, 0, 0]}><RB p={[0, 0.3, 0]} s={[1.9, 0.6, 1.3]} rad={0.03} c="#8a2a22" r={0.4} m={0.3} /><RB p={[0, 0.62, 0]} s={[1.85, 0.04, 1.2]} rad={0.01} c="#2a2c31" r={0.8} />
      {[-0.55, 0.55].map((x, i) => <mesh key={i} position={[x, 0.0, 0.66]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.14, 24]} /><Mat c="#1a1a1a" r={0.8} /></mesh>)}</group>
    {body}
  </Room>;
}}</Stage>;

// 10 · una caja con manijas: le brotan dos manijas de cromo con resorte y la cinta se la lleva rodando fuera de cuadro
export const C10: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const hd = spr(tt, 1.0, 7, 0.45), go = sm(tt, 2.8, 5.6), x = 3.0 * go;
  return <Room tt={tt} c={cam([0.2, 1.2, 3.4], [0.2, 0.7, 0])} wall="drywall" z={-1.0}>
    <RB p={[0.6, 0.18, 0]} s={[4.6, 0.12, 0.9]} rad={0.03} c="#2a2c31" r={0.7} />
    {[...Array(15)].map((_, i) => <mesh key={i} position={[-1.6 + i * 0.32, 0.11, 0.47]} rotation={[0, 0, -go * 18]}><cylinderGeometry args={[0.05, 0.05, 0.04, 16]} /><Mat c="#9aa0a8" m={0.9} r={0.3} /></mesh>)}
    {[-1.5, 2.7].map((xx, i) => <RB key={i} p={[xx, 0.08, 0]} s={[0.12, 0.16, 1.0]} rad={0.02} c="#d8a030" r={0.5} />)}
    <group position={[x, 0.24, 0]}>
      <Safe3 s={0.95} />
      {[-1, 1].map((sd) => <group key={sd} position={[sd * (0.33 + 0.07 * hd), 0.62, 0]} scale={Math.max(0.001, hd)}>
        <mesh rotation={[0, sd > 0 ? 0 : Math.PI, Math.PI / 2]}><torusGeometry args={[0.13, 0.026, 12, 32, Math.PI]} /><Mat c="#e8ecf0" m={1} r={0.12} /></mesh>
        <RB p={[-sd * 0.02, 0.13, 0]} s={[0.06, 0.06, 0.08]} rad={0.015} c="#c9ced4" m={1} r={0.2} />
        <RB p={[-sd * 0.02, -0.13, 0]} s={[0.06, 0.06, 0.08]} rad={0.015} c="#c9ced4" m={1} r={0.2} />
      </group>)}
    </group>
  </Room>;
}}</Stage>;

// 11 · el tope de la póliza: un vidrio baja a la altura del tope; lo que sobresale de cada pila se pone rojo y se cae
export const C11: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const lid = sm(tt, 1.0, 2.0), cap = 0.45, f = c01((tt - 2.2) / 1.2), hs = [0.8, 0.6, 1.0, 0.5];
  return <Room tt={tt} c={cam([0, 1.3, 2.8], [0, 0.75, 0])} wall="drywall" floor="wood">
    <RB p={[0, 0.3, 0]} s={[2.2, 0.6, 0.8]} rad={0.02} c="#6a4a32" r={0.6} />
    {hs.map((hh, i) => { const x = -0.75 + i * 0.5, below = Math.min(hh, cap), over = Math.max(0, hh - cap); return <group key={i}>
      <RB p={[x, 0.6 + below / 2, 0]} s={[0.36, below, 0.2]} rad={0.01} c="#6a9a5a" r={0.8} />
      {over > 0 && <RB p={[x + 0.6 * f, 0.6 + cap + over / 2 + 0.3 * Math.sin(Math.PI * f) - 0.8 * f * f, 0.3 * f]} rot={[0, 0, -1.2 * f]} s={[0.36, over, 0.2]} rad={0.01} c={lid > 0.9 ? "#c62a22" : "#6a9a5a"} r={0.8} />}
    </group>; })}
    <mesh position={[0, 0.6 + cap + 0.6 * (1 - lid) + 0.01, 0]}><boxGeometry args={[2.1, 0.02, 0.5]} /><meshPhysicalMaterial color="#e8f2ff" transparent opacity={0.45} roughness={0.05} /></mesh>
    <Plate p={[1.25, 1.1 + 0.6 * (1 - lid), -0.1]} w={0.6} h={0.2} txt={["$1,500"]} size={150} op={lid} />
  </Room>;
}}</Stage>;

// 12 · la foto con fecha: la cámara de fotos sobre la mesa de la cocina dispara y la polaroid sale hacia nosotros con la fecha
export const C12: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const shot = sm(tt, 1.4, 1.6) * (1 - sm(tt, 1.6, 1.9)), out = sm(tt, 2.0, 3.6);
  return <Room tt={tt} c={cam([0, 1.3, 2.4], [0, 0.9, 0])} wall="wood" floor="wood">
    <RB p={[0, 0.4, -0.2]} s={[1.8, 0.06, 0.9]} rad={0.01} c="#b8885a" r={0.6} />
    <Safe3 p={[-0.45, 0.43, -0.35]} s={0.45} /><RB p={[0.35, 0.45, -0.3]} s={[0.4, 0.03, 0.3]} rad={0.004} c="#f6f3ec" r={0.9} />
    <group position={[0, 1.15, 0.2]}><RB s={[0.5, 0.32, 0.2]} rad={0.04} c="#22252b" r={0.4} /><mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.11, 0.06 + 0.02 * shot, 32]} /><Mat c="#3a3d44" m={0.6} r={0.3} /></mesh></group>
    <group position={[0, 0.95 - 0.1 * out, 0.3 + 1.0 * out]} rotation={[-0.2, 0, 0.1 * out]} scale={0.6 + 0.4 * out}><RB s={[0.42, 0.5, 0.01]} rad={0.004} c="#fbfaf6" r={0.9} /><Plate p={[0, -0.18, 0.008]} w={0.36} h={0.1} txt={["MAR 12 2025"]} bg="#fbfaf6" fg="#2a3a8a" size={130} /><RB p={[0, 0.04, 0.007]} s={[0.36, 0.32, 0.002]} rad={0.001} c="#5a6070" r={0.6} /></group>
  </Room>;
}}</Stage>;

// 13 · la esquina baja: el piso inclinado; las gotas ruedan todas hacia la esquina de la caja y el charco crece
export const C13: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const pud = c01((tt - 2.0) / 3.5);
  return <Room tt={tt} c={cam([0.4, 2.6, 3.4], [0.4, 0.3, -0.3])} wall="drywall" z={-1.4}>
    <group rotation={[0.06, 0, -0.08]}>
      <RB p={[0, 0.03, 0]} s={[3.2, 0.06, 2.4]} rad={0.01} c="#a8a59c" r={0.95} />
      <Safe3 p={[1.15, 0.06, -0.75]} s={0.7} />
      <mesh position={[1.15, 0.065, -0.5]} rotation={[-Math.PI / 2, 0, 0]} scale={0.2 + 0.9 * pud}><circleGeometry args={[0.6, 40]} /><meshStandardMaterial color="#6a9ac8" transparent opacity={0.6} roughness={0.05} metalness={0.2} /></mesh>
      {[...Array(14)].map((_, i) => { const k = ((tt * 0.35 + rnd(i)) % 1), sx = -1.4 + rnd(i, 2) * 1.2, sz = 0.9 - rnd(i, 3) * 0.6; return <mesh key={i} position={[sx + (1.15 - sx) * k, 0.09, sz + (-0.5 - sz) * k]}><sphereGeometry args={[0.035, 12, 12]} /><meshStandardMaterial color="#8ab8e8" roughness={0.05} metalness={0.1} /></mesh>; })}
    </group>
  </Room>;
}}</Stage>;

// 14 · la pared de la caja es una esponja: corte de la puerta en sándwich con relleno gris poroso; gotas salen hacia adentro y mojan un papel
export const C14: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const wet = sm(tt, 2.6, 5.5);
  return <Room tt={tt} c={[{ t: 0, p: [0, 1.1, 2.6], l: [0, 0.95, 0], fov: 42 }, { t: 2.2, p: [0.05, 1.08, 2.5], l: [0.05, 0.92, 0], fov: 42 }, { t: 6, p: [0.45, 0.95, 1.5], l: [0.45, 0.72, 0], fov: 40 }, { t: 12, p: [0.5, 0.95, 1.4], l: [0.45, 0.72, 0], fov: 40 }]} wall="drywall" z={-0.9}>
    <RB p={[-0.42, 1.0, 0]} s={[0.07, 1.4, 0.6]} rad={0.008} c="#3d4148" m={0.65} r={0.35} />
    <RB p={[0.0, 1.0, 0]} s={[0.07, 1.4, 0.6]} rad={0.008} c="#3d4148" m={0.65} r={0.35} />
    <group position={[-0.5, 1.1, 0]}><mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.14, 0.15, 0.06, 40]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh></group>
    {[...Array(150)].map((_, i) => <mesh key={i} position={[-0.36 + rnd(i) * 0.3, 0.33 + rnd(i, 2) * 1.34, (rnd(i, 5) - 0.5) * 0.5 + 0.05]}><sphereGeometry args={[0.03 + 0.035 * rnd(i, 3), 10, 8]} /><Mat c={rnd(i, 4) > 0.5 ? "#8a8e94" : "#a9adb3"} r={1} /></mesh>)}
    {[...Array(7)].map((_, i) => { const st = 1.0 + i * 0.55, k = c01((tt - st) / 1.4), y = 1.35 - rnd(i, 2) * 0.35 - 0.62 * k * k; return k > 0 && k < 1 ? <mesh key={i} position={[0.045 + (k > 0.25 ? 0.12 * (k - 0.25) : 0), y, 0.1 + (rnd(i) - 0.5) * 0.3]}><sphereGeometry args={[0.024, 14, 12]} /><meshStandardMaterial color="#9ac4f0" roughness={0.05} metalness={0.1} /></mesh> : null; })}
    <RB p={[0.42, 0.62, 0]} s={[0.7, 0.04, 0.55]} rad={0.004} c="#5a4a3a" r={0.8} />
    {[0, 1, 2].map((i) => <RB key={i} p={[0.42, 0.66 + i * 0.022, 0]} s={[0.56, 0.018, 0.42]} rad={0.003} c="#fbfaf6" r={0.9} />)}
    <mesh position={[0.2, 0.712, 0.08]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.02 + 0.12 * wet, 32]} /><meshStandardMaterial color="#b8b09a" roughness={0.4} transparent opacity={0.85 * c01(wet * 3)} /></mesh>
  </Room>;
}}</Stage>;

// 15 · los círculos mojados: termotanque, lavarropas y pileta largan anillos de agua por el piso; la caja salta a un lugar seco
export const C15: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const hop = sm(tt, 3.2, 4.0);
  const src: V3[] = [[-1.6, 0, -0.4], [-0.4, 0, -0.4], [0.7, 0, -0.4]];
  return <Room tt={tt} c={cam([0.4, 2.3, 4.4], [0.4, 0.5, 0])} wall="drywall" z={-0.9}>
    <Heater3 p={src[0]} s={0.75} />
    <RB p={[-0.4, 0.4, -0.4]} s={[0.7, 0.8, 0.6]} rad={0.04} c="#f2f2f0" r={0.4} />
    <RB p={[0.7, 0.45, -0.4]} s={[0.6, 0.12, 0.5]} rad={0.02} c="#e8e6e0" r={0.4} />
    <mesh position={[0.7, 0.2, -0.4]}><cylinderGeometry args={[0.04, 0.04, 0.4, 10]} /><Mat c="#c9ced4" m={0.8} r={0.3} /></mesh>
    {src.map((s, j) => [0, 1].map((i) => { const f = ((tt * 0.4 + i * 0.5 + j * 0.2) % 1); return <mesh key={j * 2 + i} position={[s[0], 0.01, s[2] + 0.2]} rotation={[-Math.PI / 2, 0, 0]} scale={0.3 + 0.9 * f}><ringGeometry args={[0.95, 1.0, 64]} /><meshBasicMaterial color="#5a9ad8" transparent opacity={0.6 * (1 - f)} /></mesh>; }))}
    <Safe3 p={[0.3 + 1.6 * hop, 0.5 * Math.sin(Math.PI * hop), 0.6]} s={0.55} />
  </Room>;
}}</Stage>;

// 16 · el taller del ladrón: diez herramientas caen una por una en sus ganchos y el tambor del contador gira con cada una
const Digit: React.FC<{ d: string; p: V3; rot: V3 }> = ({ d, p, rot }) => {
  const m = useTxt([d], 256, 256, "#1a1b1f", "#ffb257", 190, "Arial Black");
  return <mesh position={p} rotation={rot}><planeGeometry args={[0.17, 0.17]} /><meshBasicMaterial map={m} /></mesh>;
};
const Drum: React.FC<{ p: V3; v: number }> = ({ p, v }) => <group position={p} rotation={[v * Math.PI * 2 / 10, 0, 0]}>
  <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.255, 0.255, 0.2, 40]} /><Mat c="#1a1b1f" r={0.6} /></mesh>
  {[...Array(10)].map((_, k) => { const a = -k * Math.PI * 2 / 10; return <Digit key={k} d={`${k}`} p={[0, -Math.sin(a) * 0.262, Math.cos(a) * 0.262]} rot={[a, 0, 0]} />; })}
</group>;
export const C16: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const at = (i: number) => 0.6 + i * 0.5;
  const nc = [...Array(10)].reduce((a, _, i) => a + c01((tt - at(i) - 0.25) / 0.3), 0);
  const kinds = [0, 1, 2, 1, 0, 2, 0, 1, 2, 0];
  return <Room tt={tt} c={cam([0.35, 1.3, 3.7], [0.35, 1.25, 0])} wall="drywall" z={-0.65}>
    <RB p={[-0.25, 1.3, -0.56]} s={[2.5, 1.5, 0.04]} rad={0.006} c="#c8a878" r={0.85} />
    {[...Array(84)].map((_, i) => <mesh key={i} position={[-1.42 + (i % 14) * 0.18, 0.66 + Math.floor(i / 14) * 0.25, -0.537]}><circleGeometry args={[0.01, 6]} /><meshBasicMaterial color="#5a4630" /></mesh>)}
    {[...Array(10)].map((_, i) => {
      const x = -1.15 + (i % 5) * 0.45, y = i < 5 ? 1.88 : 1.12, k = kinds[i], on = tt >= at(i);
      return <group key={i}>
        <RB p={[x, y, -0.48]} s={[0.025, 0.025, 0.14]} rad={0.008} c="#c9ced4" m={1} r={0.25} />
        {on && <group position={[x, y + drop(tt, at(i), 1.1), -0.44]} rotation={[0, 0, 0.12 * Math.sin((tt - at(i)) * 9) * Math.exp(-(tt - at(i)) * 3)]}>
          {k === 0 && <Bar3 p={[0, -0.4, 0]} s={0.5} />}
          {k === 1 && <Sledge3 p={[0, -0.42, 0]} s={0.55} />}
          {k === 2 && <Grinder3 p={[0, -0.12, 0]} rot={[0, 0, -0.3]} s={0.75} />}
        </group>}
      </group>;
    })}
    <group position={[1.75, 1.3, -0.2]}>
      <RB p={[0, 0, -0.18]} s={[0.66, 0.7, 0.3]} rad={0.04} c="#3a3d44" r={0.5} m={0.4} />
      <Drum p={[-0.11, 0, 0]} v={Math.floor(nc / 10) + c01(nc - 9)} />
      <Drum p={[0.11, 0, 0]} v={nc} />
    </group>
  </Room>;
}}</Stage>;

// 17 · para un ladrón son llaves: la palanca, la maza y la amoladora se achican y en su lugar crece una llave dorada
export const C17: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const k = (i: number) => sm(tt, 1.2 + i * 1.0, 1.8 + i * 1.0);
  return <Room tt={tt} c={cam([0, 1.2, 3.0], [0, 0.85, 0])} wall="wood" z={-0.7}>
    <RB p={[0, 0.3, 0]} s={[2.4, 0.6, 0.7]} rad={0.02} c="#7a5a3a" r={0.7} />
    {[0, 1, 2].map((i) => { const x = -0.8 + i * 0.8, kk = k(i); return <group key={i} position={[x, 0.85, 0]}>
      <group scale={Math.max(0.001, 1 - kk)}>{i === 0 ? <Bar3 rot={[0, 0, 0.6]} s={0.9} /> : i === 1 ? <Sledge3 rot={[0, 0, 0.4]} s={0.9} /> : <group position={[0, -0.18, 0]}><Grinder3 s={1.3} /></group>}</group>
      <Key s={2.6 * kk + 0.001} rot={[0, 0.3, 0]} />
    </group>; })}
  </Room>;
}}</Stage>;

// 18 · una cadena larga: los eslabones aparecen de a uno enhebrando palanca, escalera y cortapernos; al final cierra el candado
export const C18: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const N = 22, n = c01((tt - 0.6) / 4.2) * N, sh = sm(tt, 5.0, 5.3);
  return <Room tt={tt} c={cam([0, 1.2, 3.4], [0, 0.95, 0])} wall="drywall" z={-0.7}>
    <Bar3 p={[-1.0, 0.95, -0.3]} rot={[0, 0, 1.3]} s={1.0} />
    <group position={[0, 0, -0.45]}>{[-0.25, 0.25].map((x, i) => <RB key={i} p={[x, 1.0, 0]} s={[0.05, 2.0, 0.05]} rad={0.015} c="#c9ced4" m={0.8} r={0.3} />)}{[0.3, 0.7, 1.1, 1.5].map((y, i) => <RB key={i} p={[0, y, 0]} s={[0.5, 0.04, 0.04]} rad={0.012} c="#c9ced4" m={0.8} r={0.3} />)}</group>
    <Sledge3 p={[1.0, 0.9, -0.3]} rot={[0, 0, -0.3]} s={1.0} />
    {[...Array(N)].map((_, i) => i < n ? <mesh key={i} position={[-1.4 + i * 0.13, 0.95 + 0.06 * Math.sin(i * 0.9), -0.15]} rotation={[i % 2 ? Math.PI / 2 : 0, 0, 0]} scale={c01(n - i)}><torusGeometry args={[0.055, 0.016, 8, 20]} /><Mat c="#9aa0a8" m={1} r={0.3} /></mesh> : null)}
    <Pad p={[1.55, 0.85 + drop(tt, 4.6, 0.6), -0.1]} s={0.6} sh={sh} />
  </Room>;
}}</Stage>;

// 19 · cuatro casas grandes: de tres sale volando lo que se llevaron (caja fuerte, generador, caja de herramientas); en la de ella sólo queda una bolsa de tierra pisada en la puerta
const Toolbox3: React.FC<{ s?: number }> = ({ s = 1 }) => <group scale={s}><RB p={[0, 0.14, 0]} s={[0.5, 0.26, 0.24]} rad={0.03} c="#c23a2a" r={0.4} m={0.3} /><RB p={[0, 0.28, 0]} s={[0.52, 0.04, 0.26]} rad={0.01} c="#2a2c31" r={0.5} /><mesh position={[0, 0.34, 0]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.1, 0.014, 8, 20, Math.PI]} /><Mat c="#2a2c31" r={0.4} /></mesh></group>;
export const C19: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const f = (i: number) => sm(tt, 0.9 + i * 0.7, 2.2 + i * 0.7);
  return <Room tt={tt} c={cam([0, 1.55, 6.0], [0, 1.05, 0])} wall="drywall" floor="wood" z={-1.8}>
    {[0, 1, 2, 3].map((i) => { const x = -2.55 + i * 1.7, k = f(i), dx = x + 0.2;
      return <group key={i}><House3 p={[x, 0, -0.6]} s={1.15} col={i === 3 ? "#f0e2c8" : "#e2d8c6"} />
        {i < 3 ? <group position={[dx + 0.25 * k, 0.15 + 1.95 * k + 0.05 * Math.sin(tt * 3 + i) * k, -0.05 + 0.4 * k]} rotation={[0, 0.6 * k, 0.15 * Math.sin(Math.PI * k)]}>
          {i === 0 ? <Safe3 s={0.42} /> : i === 1 ? <Gen3 s={0.7} /> : <Toolbox3 s={0.9} />}
        </group> : <group position={[dx, 0, 0.12]} rotation={[0, 0.25, 0]}>
          <RB p={[0, 0.07, 0]} s={[0.5, 0.14, 0.3]} rad={0.06} c="#6a4a2e" r={0.95} />
          <RB p={[0, 0.142, 0]} s={[0.3, 0.005, 0.18]} rad={0.002} c="#3f7a3a" r={0.8} />
          {[...Array(8)].map((_, j) => <mesh key={j} position={[(rnd(j) - 0.5) * 0.7, 0.004, 0.18 + rnd(j, 2) * 0.25]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.025 + 0.03 * rnd(j, 3), 10]} /><meshBasicMaterial color="#4a3622" /></mesh>)}
        </group>}
      </group>; })}
  </Room>;
}}</Stage>;

// 20 · el camino de vuelta a la camioneta: desde arriba, cada viaje vacía el reloj de arena y prende una ventana de los vecinos
export const C20: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const trips = c01((tt - 0.4) / 6) * 3, k = trips % 1, dir = Math.floor(trips) % 2, x = -1.3 + 2.4 * (dir ? 1 - k : k), lit = Math.min(6, Math.floor(trips * 2));
  return <Room tt={tt} c={[{ t: 0, p: [0, 3.7, 3.6], l: [0, 0.2, -0.4], fov: 42 }, { t: 12, p: [0.2, 3.6, 3.5], l: [0, 0.2, -0.4], fov: 42, arc: 0.02 }]} wall="drywall" floor="concrete" z={-2.6}>
    <House3 p={[-2.05, 0, 0.3]} s={0.75} />
    <Car3 p={[1.75, 0, 0.3]} rot={[0, 0, 0]} s={0.8} col="#3a5a8a" />
    {[0, 1, 2, 3, 4, 5].map((i) => { const on = i < lit; return <group key={i} position={[-2.1 + i * 0.84, 0, -1.9]}>
      <RB p={[0, 0.4, 0]} s={[0.66, 0.8, 0.5]} rad={0.02} c="#d8ccb6" r={0.9} />
      <mesh position={[0, 0.95, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.5, 0.3, 4]} /><Mat c="#6a3a2e" r={0.85} /></mesh>
      <mesh position={[0, 0.46, 0.256]}><planeGeometry args={[0.26, 0.22]} /><meshBasicMaterial color={on ? "#ffd27a" : "#3a4048"} toneMapped={!on} /></mesh>
      {on && <mesh position={[0, 0.46, 0.27]}><circleGeometry args={[0.3, 32]} /><meshBasicMaterial color="#ffcf70" transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>}
    </group>; })}
    <Thief3 p={[x, 0, 0.35]} yaw={dir ? -Math.PI / 2 : Math.PI / 2} step={Math.sin(tt * 9)} s={0.75} />
  </Room>;
}}</Stage>;

// 21 · la caja en la esquina, vista de arriba: cuatro flechas de ataque; entran dos paredes y dos flechas rebotan
export const C21: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const w = sm(tt, 1.6, 2.6), bounce = c01((tt - 2.6) / 1.0);
  const Arr = ({ rot, out }: { rot: number; out: number }) => <group rotation={[0, rot, 0]}><group position={[0, 0.1, 0.95 + out]}><RB p={[0, 0, 0.2]} s={[0.12, 0.06, 0.4]} rad={0.02} c="#c62a22" r={0.5} /><mesh position={[0, 0, -0.06]} rotation={[-Math.PI / 2, 0, 0]}><coneGeometry args={[0.14, 0.2, 3]} /><Mat c="#c62a22" r={0.5} /></mesh></group></group>;
  return <Room tt={tt} c={[{ t: 0, p: [0.4, 4.2, 2.2], l: [0, 0, -0.1], fov: 38 }, { t: 12, p: [0.6, 4.0, 2.0], l: [0, 0, -0.1], arc: 0.02 }]} wall="drywall" z={-2.6}>
    <Safe3 p={[0, 0, 0]} s={0.8} />
    <Arr rot={0} out={0} /><Arr rot={Math.PI / 2} out={0} /><Arr rot={Math.PI} out={1.5 * bounce} /><Arr rot={-Math.PI / 2} out={1.5 * bounce} />
    <RB p={[0, 0.6, -0.4 - 1.2 * (1 - w)]} s={[2.6, 1.2, 0.1]} rad={0.01} c="#e8e4da" r={0.8} />
    <RB p={[-0.38 - 1.2 * (1 - w), 0.6, 0]} s={[0.1, 1.2, 2.6]} rad={0.01} c="#e8e4da" r={0.8} />
  </Room>;
}}</Stage>;

// 22 · lugar para atacar: con la caja en el medio, cada herramienta se le arrima; la caja se corre a la esquina y ya no entran: chocan con la pared y caen
export const C22: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const k = (i: number) => sm(tt, 0.6 + i * 0.8, 1.2 + i * 0.8), mv = sm(tt, 3.2, 4.2), fall = (i: number) => sm(tt, 4.4 + i * 0.4, 4.8 + i * 0.4);
  const S: V3 = [-1.25 * mv, 0, -1.0 * mv];
  return <Room tt={tt} c={cam([1.0, 1.9, 3.8], [-0.35, 0.4, -0.4])} wall="drywall" z={-1.55}>
    <RB p={[-1.95, 0.75, -0.55]} s={[0.1, 1.5, 2.1]} rad={0.01} c="#e8e4da" r={0.8} />
    <Safe3 p={S} s={0.9} />
    <group position={[S[0] - 0.42 - 1.2 * (1 - k(0)), 0, S[2] + 0.1 + 0.5 * fall(0)]} rotation={[-1.45 * fall(0), 0, -0.3 * (1 - fall(0))]}><Bar3 s={1.0} /></group>
    <group position={[S[0] + 0.1, 0, S[2] - 0.45 - 1.2 * (1 - k(1)) + 0.75 * fall(1)]} rotation={[-0.3 * (1 - fall(1)) - 1.4 * fall(1), 0, 0]}><Sledge3 s={1.0} /></group>
    <group position={[S[0] + 0.55 + 1.4 * (1 - k(2)) + 0.3 * fall(2), 0, S[2] + 0.3]} rotation={[0, -Math.PI / 2, -1.3 * fall(2)]}><Dolly3 s={0.85} /></group>
  </Room>;
}}</Stage>;

// 23 · las marcas: la palanca patina sobre el canto de la puerta, raya el metal y saca chispas; la huella de tiza de la base nunca se corre
export const C23: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const P = 0.9, st = Math.max(0, tt - 0.7), c = Math.floor(st / P), ph = (st % P) / P, n = Math.min(5, c + (ph > 0.6 ? 1 : 0));
  const down = c < 5 ? sm(ph, 0.1, 0.6) : 1, ty = 0.88 - 0.5 * down + 0.08 * (c < 5 ? sm(ph, 0.65, 1) : 0), tx = 0.31;
  const sparks = c < 5 && ph > 0.12 && ph < 0.65;
  return <Room tt={tt} c={cam([1.2, 1.15, 2.1], [0.15, 0.55, 0])} wall="drywall" z={-1.0}>
    <Safe3 p={[0, 0, 0]} s={1.0} />
    {[...Array(5)].map((_, i) => i < n ? <RB key={i} p={[tx - 0.01 + 0.012 * i, 0.62 - i * 0.03, 0.352]} rot={[0, 0, 0.12 * (rnd(i) - 0.5)]} s={[0.012, 0.42, 0.006]} rad={0.002} c="#e8ecf0" m={1} r={0.1} /> : null)}
    <group position={[tx + 0.03, ty, 0.42]} rotation={[0, -0.7, -1.25]}><Bar3 p={[0, -0.86, 0]} s={1.0} /></group>
    {sparks && [...Array(12)].map((_, i) => { const a = (ph * 7 + rnd(i)) % 1; return <mesh key={i} position={[tx + 0.05 + 0.35 * a * rnd(i, 2), ty - 0.05 - 0.3 * a * a + 0.1 * a * (rnd(i, 3) - 0.5), 0.42 + 0.25 * a * rnd(i, 4)]}><sphereGeometry args={[0.008, 6, 6]} /><meshBasicMaterial color="#ffc45a" toneMapped={false} /></mesh>; })}
    {[[0, 0.345, 0.76, 0.03], [0, -0.345, 0.76, 0.03], [0.38, 0, 0.03, 0.72], [-0.38, 0, 0.03, 0.72]].map(([x, z, w, d], i) => <mesh key={i} position={[x, 0.004, z]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w, d]} /><meshBasicMaterial color="#ffffff" /></mesh>)}
    {[...Array(10)].map((_, i) => <mesh key={i} position={[(rnd(i) - 0.5) * 0.9, 0.005, 0.36 + rnd(i, 2) * 0.12]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.008 + 0.01 * rnd(i, 3), 8]} /><meshBasicMaterial color="#f4f4f0" /></mesh>)}
  </Room>;
}}</Stage>;

// 24 · el mueble se arma alrededor: fondo, costados y tapa bajan despacio con peso, y las puertas se cierran sobre la caja
export const C24: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const dr = (a: number) => (1 - spr(tt, a, 3.2, 0.55)) * 1.7, doors = sm(tt, 3.9, 5.2);
  return <Room tt={tt} c={cam([0.45, 1.35, 3.1], [0, 0.62, 0])} wall="wood" z={-0.8}>
    <Safe3 p={[0, 0.03, 0]} s={0.85} />
    <RB p={[0, 0.015, 0]} s={[0.92, 0.03, 0.74]} rad={0.004} c="#b8986a" r={0.8} />
    <RB p={[0, 0.52 + dr(0.5), -0.36]} s={[0.9, 1.0, 0.03]} rad={0.004} c="#b8986a" r={0.8} />
    <RB p={[-0.44, 0.52 + dr(1.3), 0]} s={[0.04, 1.02, 0.74]} rad={0.004} c="#c8a878" r={0.8} />
    <RB p={[0.44, 0.52 + dr(2.0), 0]} s={[0.04, 1.02, 0.74]} rad={0.004} c="#c8a878" r={0.8} />
    <RB p={[0, 1.05 + dr(2.8), 0]} s={[0.94, 0.05, 0.78]} rad={0.006} c="#c8a878" r={0.8} />
    {tt > 3.7 && [-1, 1].map((sd) => <group key={sd} position={[sd * 0.44, 0.52, 0.375]} rotation={[0, sd * (1 - doors) * 1.5, 0]}><RB p={[-sd * 0.22, 0, 0]} s={[0.43, 1.0, 0.025]} rad={0.004} c="#d8b888" r={0.8} /><RB p={[-sd * 0.36, 0, 0.02]} s={[0.02, 0.12, 0.02]} rad={0.005} c="#c9ced4" m={1} r={0.25} /></group>)}
  </Room>;
}}</Stage>;

// 25 · rayos X: desde el piso, el mueble y la caja se vuelven fantasma y cuatro pernos gruesos hundidos en la losa se encienden uno a uno
export const C25: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const g = sm(tt, 0.9, 2.2);
  return <Room tt={tt} c={cam([0.3, 0.4, 2.5], [0, 0.2, 0])} wall="drywall" floor="none" z={-1.2}>
    <Cut p={[0, 0, 0]} w={3.2} d={1.2} h={0.65} />
    <Safe3 p={[0, 0, -0.05]} s={0.9} ghost={g} />
    <RB p={[0, 0.5, -0.05]} s={[0.95, 1.05, 0.8]} rad={0.01} c="#c8a878" r={0.8} op={1 - 0.9 * g} />
    {[-0.48, -0.16, 0.16, 0.48].map((x, i) => { const b = sm(tt, 2.2 + i * 0.55, 2.6 + i * 0.55); return <group key={i} position={[x, 0, 0.64]}>
      <mesh position={[0, -0.22, 0]}><cylinderGeometry args={[0.042, 0.042, 0.56, 16]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.25} emissive="#ffb257" emissiveIntensity={1.6 * b} toneMapped={b < 0.05} /></mesh>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.075, 0.075, 0.05, 6]} /><Mat c="#9aa0a8" m={1} r={0.3} /></mesh>
      <mesh position={[0, -0.22, -0.005]}><planeGeometry args={[0.11, 0.6]} /><meshBasicMaterial color="#3a3630" /></mesh>
    </group>; })}
  </Room>;
}}</Stage>;

// 26 · derecho contra torcido: dos agujeros en corte; tiran de los dos pernos; el torcido sale con un trozo de concreto
export const C26: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const pull = sm(tt, 1.6, 2.6);
  return <Room tt={tt} c={cam([0, 0.75, 2.7], [0, 0.32, 0])} wall="drywall" floor="none" z={-1.0}>
    <Cut p={[0, 0.3, 0]} w={2.2} d={0.8} h={0.8} />
    <group position={[-0.5, 0.3 + 0.01 * Math.sin(tt * 40) * pull, 0.41]}><RB p={[0, -0.25, 0]} s={[0.06, 0.6, 0.02]} rad={0.01} c="#c9ced4" m={1} r={0.25} /><RB p={[0, 0.06, 0]} s={[0.14, 0.06, 0.03]} rad={0.01} c="#9aa0a8" m={1} r={0.3} /></group>
    <group position={[0.5, 0.3 + 0.45 * pull, 0.41]} rotation={[0, 0, 0.35]}><RB p={[0, -0.25, 0]} s={[0.06, 0.6, 0.02]} rad={0.01} c="#c9ced4" m={1} r={0.25} /><RB p={[0, 0.06, 0]} s={[0.14, 0.06, 0.03]} rad={0.01} c="#9aa0a8" m={1} r={0.3} /><mesh position={[0.05, -0.45, 0]}><dodecahedronGeometry args={[0.13 * pull, 0]} /><Mat c="#a8a59c" r={0.95} /></mesh></group>
  </Room>;
}}</Stage>;

// 27 · el polvo: el agujero lleno de polvo; baja la boquilla de la aspiradora y lo chupa; recién ahí baja el ancla y muerde
export const C27: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const vac = sm(tt, 1.0, 1.6) * (1 - sm(tt, 3.2, 3.8)), suck = c01((tt - 1.6) / 1.4), anc = sm(tt, 3.8, 4.8);
  return <Room tt={tt} c={cam([0, 0.9, 2.45], [0, 0.42, 0])} wall="drywall" floor="none" z={-1.0}>
    <Cut p={[0, 0.3, 0]} w={2.0} d={0.8} h={0.8} />
    <RB p={[0, 0.0, 0.41]} s={[0.12, 0.6, 0.004]} rad={0.002} c="#5a5650" r={1} />
    {[...Array(30)].map((_, i) => { const y = -0.25 + rnd(i) * 0.5 + suck * 1.4 * (0.6 + rnd(i, 2)); return y < 0.9 ? <mesh key={i} position={[(rnd(i, 3) - 0.5) * 0.1, y, 0.42]}><circleGeometry args={[0.01 + 0.008 * rnd(i, 4), 6]} /><meshBasicMaterial color="#e2ddd0" /></mesh> : null; })}
    <group position={[0, 0.95 - 0.5 * vac, 0.4]}><mesh><cylinderGeometry args={[0.06, 0.08, 0.5, 20]} /><Mat c="#3a5a9a" r={0.5} /></mesh></group>
    <group position={[0, 0.9 - 0.85 * anc, 0.42]}><RB p={[0, -0.2, 0]} s={[0.05, 0.5, 0.02]} rad={0.01} c="#c9ced4" m={1} r={0.25} />{[-1, 1].map((sd) => <RB key={sd} p={[sd * (0.03 + 0.02 * anc), -0.38, 0]} rot={[0, 0, sd * 0.2 * anc]} s={[0.02, 0.12, 0.02]} rad={0.005} c="#d8b04a" m={1} r={0.3} />)}</group>
  </Room>;
}}</Stage>;

// 28 · la prueba: dos manos con guantes agarran la caja por arriba y tiran; la caja ni se mueve y en el corte del piso los pernos se ponen al rojo
export const C28: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const pull = sm(tt, 1.0, 1.6) * (1 - sm(tt, 4.4, 4.9)), jit = pull * Math.sin(tt * 26) * 0.006, glow = sm(tt, 1.5, 3.0) * (1 - 0.6 * sm(tt, 4.4, 5.2));
  return <Room tt={tt} c={cam([-0.5, 0.85, 2.6], [0, 0.35, 0])} wall="drywall" floor="none" z={-1.0}>
    <Cut p={[0, 0, 0]} w={2.6} d={1.2} h={0.6} />
    <Safe3 p={[jit, 0, 0]} s={0.85} />
    {[-0.24, 0.24].map((x, i) => <group key={i} position={[x, 0, 0.62]}>
      <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.03, 0.03, 0.48, 14]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.25} emissive="#ff6a2a" emissiveIntensity={2.2 * glow} toneMapped={glow < 0.05} /></mesh>
      <mesh position={[0, -0.25, -0.006]}><planeGeometry args={[0.09, 0.52]} /><meshBasicMaterial color="#3a3630" /></mesh>
      {[0, 1, 2].map((k) => <mesh key={k} position={[0, -0.1 - k * 0.12, 0.004]}><ringGeometry args={[0.05 + 0.02 * k, 0.055 + 0.02 * k, 20]} /><meshBasicMaterial color="#ff8a3a" transparent opacity={0.5 * glow} toneMapped={false} /></mesh>)}
    </group>)}
    {[-1, 1].map((sd) => <Hand3 key={sd} p={[sd * 0.3, 0.98 + 0.03 * pull, 0.05]} rot={[-Math.PI / 2, 0, sd * 0.45]} s={1.25} skin="#c8903e" sleeve="#3a3d44" />)}
  </Room>;
}}</Stage>;

// 29 · taquito de plástico contra perno de expansión: una mano tira de cada uno; el taquito salta pelado, el de acero queda con la cuña abierta
export const C29: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const pop = spr(tt, 1.6, 6, 0.5), strain = sm(tt, 1.2, 1.5) * (1 - sm(tt, 3.2, 3.6)) * Math.sin(tt * 34) * 0.008;
  return <Room tt={tt} c={cam([0, 0.85, 2.4], [0, 0.4, 0])} wall="drywall" floor="none" z={-1.0}>
    <Cut p={[0, 0.3, 0]} w={2.4} d={0.8} h={0.7} />
    {[-0.5, 0.5].map((x, i) => <mesh key={i} position={[x, 0.08, 0.403]}><planeGeometry args={[0.12, 0.44]} /><meshBasicMaterial color="#2a2826" /></mesh>)}
    <group position={[-0.5, 0.12 + 0.7 * pop, 0.43]} rotation={[0, 0, 0.5 * pop]}>
      <mesh><cylinderGeometry args={[0.045, 0.038, 0.38, 14]} /><meshStandardMaterial color="#eef3f7" roughness={0.3} transparent opacity={0.75} /></mesh>
      {[0, 1, 2, 3].map((k) => <mesh key={k} position={[0, -0.12 + k * 0.08, 0]}><torusGeometry args={[0.046, 0.006, 6, 18]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.8} /></mesh>)}
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.06, 0.06, 0.02, 20]} /><Mat c="#c9ced4" m={1} r={0.3} /></mesh>
    </group>
    <Hand3 p={[-0.5, 0.42 + 0.7 * pop, 0.43]} rot={[-Math.PI / 2, 0, 0.5 * pop]} s={1.1} />
    <group position={[0.5, 0.12 + strain, 0.43]}>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.022, 0.022, 0.46, 12]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
      <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.055, 0.055, 0.04, 6]} /><Mat c="#9aa0a8" m={1} r={0.3} /></mesh>
      <mesh position={[0, -0.16, 0]}><cylinderGeometry args={[0.022, 0.05, 0.1, 14]} /><Mat c="#b8bec6" m={1} r={0.25} /></mesh>
      {[-1, 1].map((sd) => <RB key={sd} p={[sd * 0.04, -0.12, 0]} rot={[0, 0, sd * 0.22]} s={[0.016, 0.16, 0.05]} rad={0.004} c="#d8dde2" m={1} r={0.2} />)}
    </group>
    <Hand3 p={[0.5, 0.42 + strain, 0.43]} rot={[-Math.PI / 2, 0, 0]} s={1.1} />
  </Room>;
}}</Stage>;

// 30 · el borde: un agujero a dos dedos del canto; al apretar la tuerca grande se abre una grieta y el triángulo de concreto cae con el perno adentro; el del centro queda firme
const SLAB30 = (() => { const q = new THREE.Shape(); q.moveTo(-1.2, -0.3); q.lineTo(0.6, -0.3); q.lineTo(0.6, -0.08); q.lineTo(0.24, 0.3); q.lineTo(-1.2, 0.3); q.lineTo(-1.2, -0.3); return q; })();
const WEDGE30 = (() => { const q = new THREE.Shape(); q.moveTo(0, 0); q.lineTo(0, 0.38); q.lineTo(-0.36, 0.38); q.lineTo(0, 0); return q; })();
export const C30: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const nut = sm(tt, 0.7, 2.0), crk = sm(tt, 1.6, 2.4), f = c01((tt - 2.5) / 0.9);
  const slab = SLAB30, wedge = WEDGE30;
  const L = Math.hypot(0.36, 0.38), A = Math.atan2(0.38, -0.36);
  return <Room tt={tt} c={cam([-0.1, 0.65, 2.3], [-0.15, 0.1, 0])} wall="drywall" floor="none" z={-1.2}>
    <mesh position={[0, 0, -0.4]}><extrudeGeometry args={[slab, { depth: 0.8, bevelEnabled: false }]} /><Mat c="#a8a59c" r={0.95} /></mesh>
    {[...Array(40)].map((_, i) => <mesh key={i} position={[-1.15 + rnd(i) * 1.35, -0.27 + rnd(i, 2) * 0.52, 0.402]}><circleGeometry args={[0.012 + 0.02 * rnd(i, 3), 7]} /><meshBasicMaterial color={rnd(i, 4) > 0.5 ? "#7d796e" : "#c4c0b4"} /></mesh>)}
    <group position={[0.6 + 0.45 * f, -0.08 - 0.2 * f * f, 0.1 * f]} rotation={[0, 0, -0.55 * f]}>
      <mesh position={[0, 0, -0.4]}><extrudeGeometry args={[wedge, { depth: 0.8, bevelEnabled: false }]} /><Mat c="#a8a59c" r={0.95} /></mesh>
      <group position={[-0.12, 0.38, 0.1]}>
        <mesh position={[0, 0.03, 0]} rotation={[0, nut * 5, 0]}><cylinderGeometry args={[0.085, 0.085, 0.06, 6]} /><Mat c="#9aa0a8" m={1} r={0.3} /></mesh>
        <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.025, 0.025, 0.36, 12]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
      </group>
    </group>
    {f <= 0 && <mesh position={[0.6 + Math.cos(A) * L * crk / 2, -0.08 + Math.sin(A) * L * crk / 2, 0.403]} rotation={[0, 0, A]}><planeGeometry args={[L * crk, 0.014]} /><meshBasicMaterial color="#2a2622" /></mesh>}
    <group position={[-0.55, 0.3, 0.1]}>
      <mesh position={[0, 0.03, 0]} rotation={[0, nut * 5, 0]}><cylinderGeometry args={[0.085, 0.085, 0.06, 6]} /><Mat c="#9aa0a8" m={1} r={0.3} /></mesh>
    </group>
  </Room>;
}}</Stage>;

// 31 · cables tensados: la losa en corte con dos cables que vibran; la broca baja y frena justo encima de uno
export const C31: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const dn = Math.min(sm(tt, 1.0, 2.6), 0.78), stop = tt > 2.6 ? Math.exp(-(tt - 2.6) * 6) * Math.sin((tt - 2.6) * 40) : 0;
  return <Room tt={tt} c={cam([0, 0.8, 2.3], [0, 0.25, 0])} wall="drywall" floor="none" z={-1.0}>
    <Cut p={[0, 0.3, 0]} w={2.4} d={0.8} h={0.7} />
    {[-0.12, -0.42].map((y, i) => <mesh key={i} position={[0, 0.3 + y + 0.006 * Math.sin(tt * 30 + i), 0.41]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.03, 0.03, 2.3, 16]} /><Mat c="#c62a22" m={0.6} r={0.35} /></mesh>)}
    <group position={[0.2, 1.3 - dn * 1.2 + 0.01 * stop, 0.41]}><RB p={[0, 0.3, 0]} s={[0.3, 0.35, 0.25]} rad={0.04} c="#d8a030" r={0.4} /><mesh position={[0, -0.05, 0]} rotation={[0, tt * 20, 0]}><cylinderGeometry args={[0.02, 0.02, 0.4, 10]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh></group>
  </Room>;
}}</Stage>;

// 32 · el armado de Carl, desarmado en el aire: las cuatro piezas flotan separadas y bajan a armarse de a una
export const C32: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const k = (i: number) => sm(tt, 1.0 + i * 0.9, 1.6 + i * 0.9);
  return <Room tt={tt} c={cam([0.8, 1.4, 3.6], [0, 0.9, 0])} wall="drywall" z={-1.0}>
    <Safe3 p={[0, 0, 0]} s={0.8} bolts={1} />
    <RB p={[0, 0.45 + 1.4 * (1 - k(0)), 0]} s={[0.75, 0.9, 0.7]} rad={0.01} c="#8a8e94" r={0.85} op={0.97} />
    <group position={[1.6 * (1 - k(1)), 0, 0.6]}><RB p={[0, 0.3, 0]} s={[0.8, 0.5, 0.4]} rad={0.03} c="#c62a22" m={0.4} r={0.4} />{[-0.3, 0.3].map((x, i) => <mesh key={i} position={[x, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.04, 0.04, 0.04, 12]} /><Mat c="#1a1a1a" r={0.8} /></mesh>)}</group>
    {[0, 1, 2].map((i) => <Can3 key={i} p={[-0.2 + i * 0.2, 0.9 + 1.6 * (1 - k(2 + (i > 0 ? 1 : 0))), 0]} s={1.0} />)}
  </Room>;
}}</Stage>;

// 33 · cómo entra Carl: el carro rueda un pie, las latas se levantan, la tapa se abre y asoma el dial
export const C33: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const roll = sm(tt, 0.8, 2.0), cans = sm(tt, 2.2, 3.0), lid = sm(tt, 3.2, 4.2);
  return <Room tt={tt} c={cam([0.4, 1.5, 3.2], [0, 0.8, 0])} wall="drywall" z={-1.0}>
    <group position={[0, 0, 0]}><RB p={[0, 0.45, 0]} s={[0.75, 0.9, 0.7]} rad={0.01} c="#8a8e94" r={0.85} /><group position={[0, 0.9, -0.35]} rotation={[-1.6 * lid, 0, 0]}><RB p={[0, 0.02, 0.35]} s={[0.76, 0.04, 0.71]} rad={0.01} c="#8a8e94" r={0.85} /></group><Safe3 p={[0, 0.0, 0]} s={0.75} /></group>
    {[0, 1, 2].map((i) => <Can3 key={i} p={[-0.2 + i * 0.2 + 1.0 * cans, 0.92 + 0.3 * Math.sin(Math.PI * cans), 0]} s={1.0} />)}
    <group position={[-0.9 * roll, 0, 0.65]}><RB p={[0, 0.3, 0]} s={[0.8, 0.5, 0.4]} rad={0.03} c="#c62a22" m={0.4} r={0.4} />{[-0.3, 0.3].map((x, i) => <mesh key={i} position={[x, 0.04, 0.15]} rotation={[roll * 8, 0, Math.PI / 2]}><cylinderGeometry args={[0.04, 0.04, 0.04, 12]} /><Mat c="#1a1a1a" r={0.8} /></mesh>)}</group>
  </Room>;
}}</Stage>;

// 34 · el recorrido del ladrón visto de arriba: pasa por el carro, se lleva las herramientas y sigue de largo a 18" de la caja
export const C34: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const k = c01((tt - 0.5) / 5), x = -2.0 + 4.0 * k, grab = k > 0.35 ? 1 : 0;
  return <Room tt={tt} c={[{ t: 0, p: [0, 4.4, 2.4], l: [0, 0, -0.2], fov: 40 }, { t: 12, p: [0.2, 4.2, 2.2], l: [0, 0, -0.2], arc: 0.02 }]} wall="drywall" z={-2.6}>
    <RB p={[-0.4, 0.25, -0.5]} s={[0.8, 0.5, 0.4]} rad={0.03} c="#c62a22" m={0.4} r={0.4} />
    {grab === 0 && [0, 1].map((i) => <RB key={i} p={[-0.55 + i * 0.3, 0.52, -0.5]} s={[0.22, 0.04, 0.08]} rad={0.01} c="#c9ced4" m={0.8} r={0.3} />)}
    <RB p={[0.85, 0.45, -0.5]} s={[0.75, 0.9, 0.7]} rad={0.01} c="#8a8e94" r={0.85} />
    <RB p={[0.225, 0.01, -0.5]} s={[0.46, 0.01, 0.08]} rad={0.002} c="#f2c230" r={0.5} />
    <Plate p={[0.225, 0.02, -0.25]} rot={[-Math.PI / 2, 0, 0]} w={0.5} h={0.2} txt={['18"']} bg="#f2c230" size={260} />
    <Thief3 p={[x, 0, 0.25]} yaw={Math.PI / 2} step={Math.sin(tt * 9)} reach={grab && k < 0.45 ? 1 : 0} s={0.6} />
  </Room>;
}}</Stage>;

// 35 · el ojo que tasa: un haz barre la fila; bici, herramientas y generador se agrandan con su precio, las latas quedan grises
export const C35: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const bx = -2.4 + 4.8 * c01((tt - 0.6) / 4.5), xs = [-1.7, -0.6, 0.5, 1.6], price = ["$600", "$900", "$1,100", ""];
  return <Room tt={tt} c={cam([0, 1.5, 5.2], [0, 0.8, 0])} wall="drywall" z={-1.0}>
    {xs.map((x, i) => { const on = bx > x && i < 3 ? 1 : 0, s = 1 + 0.12 * on; return <group key={i} position={[x, 0, 0]} scale={s}>
      {i === 0 ? <Bike3 s={0.8} /> : i === 1 ? <Peg3 p={[0, 0.7, -0.3]} /> : i === 2 ? <Gen3 s={0.8} /> : [0, 1, 2].map((j) => <Can3 key={j} p={[-0.2 + j * 0.2, 0, 0]} s={1.1} />)}
      {i < 3 && <Plate p={[0, 1.55, 0]} w={0.8} h={0.3} txt={[price[i]]} bg="#22252b" fg="#ffb257" size={200} op={on} />}
    </group>; })}
    <mesh position={[bx, 1.0, 0.5]}><planeGeometry args={[0.05, 2.2]} /><meshBasicMaterial color="#fff1d0" transparent opacity={bx < 2.3 ? 0.7 : 0} toneMapped={false} /></mesh>
  </Room>;
}}</Stage>;

// 36 · el foco del ladrón: una linterna en la mano barre el garage a oscuras, se frena en cada cosa y salta por encima del rincón de las latas
export const C36: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const stops = [-1.5, -0.35, 1.55], k = c01((tt - 0.5) / 5) * 3, i = Math.min(2, Math.floor(k)), f = sm(k - i, 0, 0.4);
  const x = i === 0 ? -2.6 + (stops[0] + 2.6) * f : stops[i - 1] + (stops[i] - stops[i - 1]) * f;
  const hop = i === 2 ? Math.sin(Math.PI * f) * 0.9 : 0, S: V3 = [x, 0.45 + hop, 0.1];
  const F: V3 = [1.25, 1.35, 2.2], b = beam(F, S);
  return <Room tt={tt} c={cam([0.1, 1.3, 3.9], [0, 0.55, 0])} wall="drywall" night={0.85} warm={0.5} z={-0.8}>
    <Bike3 p={[-1.5, 0, 0]} s={1.0} /><Gen3 p={[-0.35, 0, 0]} s={1.05} />
    {[0, 1, 2].map((j) => <Can3 key={j} p={[0.42 + j * 0.24, 0, 0.05]} s={1.3} />)}
    <group position={[1.55, 0, 0]}><Toolbox3 s={1.2} /></group>
    <pointLight position={[S[0], S[1] + 0.3, S[2] + 0.6]} intensity={3} distance={1.8} color="#fff2c8" />
    <mesh position={b.mid} quaternion={b.q}><coneGeometry args={[0.42, b.len, 32, 1, true]} /><meshBasicMaterial color="#fff2c0" transparent opacity={0.09} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
    <group position={F} quaternion={b.q}><mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.05, 0.065, 0.3, 18]} /><Mat c="#2a2c31" m={0.6} r={0.4} /></mesh><mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.07, 0.07, 0.04, 18]} /><meshBasicMaterial color="#fff8e0" toneMapped={false} /></mesh>
      <Hand3 p={[0, 0.2, 0.0]} rot={[Math.PI / 2, 0, 0]} s={1.0} /></group>
  </Room>;
}}</Stage>;

// 37 · el garage respira calor y frío: un sol con rayos tiñe la pared de naranja y el mercurio trepa; después la luna escarcha el vidrio y el mercurio cae
export const C37: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const hot = sm(tt, 0.5, 2.4) * (1 - sm(tt, 3.3, 4.6)), cold = sm(tt, 3.6, 5.4), lvl = 0.55 + 0.6 * hot - 0.42 * cold;
  return <Room tt={tt} c={cam([0, 1.2, 3.0], [0, 1.1, 0])} wall="brick" z={-0.6}>
    <mesh position={[0, 1.6, -0.54]}><planeGeometry args={[8, 4]} /><meshBasicMaterial color="#ff8a2a" transparent opacity={0.28 * hot} depthWrite={false} /></mesh>
    <group position={[-1.05, 1.55, -0.45]}>
      <RB p={[0, 0, -0.02]} s={[0.95, 0.95, 0.05]} rad={0.01} c="#f2f0ea" r={0.6} />
      <mesh><planeGeometry args={[0.85, 0.85]} /><meshBasicMaterial color={cold > 0.5 ? "#1c2a48" : "#9ad0ff"} /></mesh>
      <group position={[0, -0.05 + 0.15 * hot, 0.01]} scale={Math.max(0.001, hot)}>
        <mesh><circleGeometry args={[0.17, 40]} /><meshBasicMaterial color="#ffc04a" toneMapped={false} /></mesh>
        {[...Array(12)].map((_, j) => <mesh key={j} position={[Math.cos(j / 12 * Math.PI * 2 + tt * 0.5) * 0.26, Math.sin(j / 12 * Math.PI * 2 + tt * 0.5) * 0.26, 0]} rotation={[0, 0, j / 12 * Math.PI * 2 + tt * 0.5 - Math.PI / 2]}><coneGeometry args={[0.03, 0.09, 3]} /><meshBasicMaterial color="#ffb030" toneMapped={false} /></mesh>)}
      </group>
      <group position={[0.15, 0.2, 0.01]} scale={Math.max(0.001, cold)}><mesh><circleGeometry args={[0.13, 40]} /><meshBasicMaterial color="#eef2ff" /></mesh><mesh position={[0.06, 0.03, 0.002]}><circleGeometry args={[0.11, 40]} /><meshBasicMaterial color="#1c2a48" /></mesh></group>
      {[...Array(18)].map((_, j) => { const a = sm(cold, j / 22, j / 22 + 0.3); return a > 0 ? <mesh key={j} position={[(rnd(j) - 0.5) * 0.8, (rnd(j, 2) - 0.5) * 0.8, 0.02]} rotation={[0, 0, rnd(j, 3) * 3]} scale={a}><circleGeometry args={[0.03 + 0.04 * rnd(j, 4), 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85} /></mesh> : null; })}
      {[[0, 0.44, 0.9, 0.04], [0, -0.44, 0.9, 0.04], [-0.44, 0, 0.04, 0.9], [0.44, 0, 0.04, 0.9], [0, 0, 0.03, 0.85]].map(([x, y, w, hh], j) => <RB key={j} p={[x, y, 0.02]} s={[w, hh, 0.04]} rad={0.005} c="#f2f0ea" r={0.6} />)}
    </group>
    <group position={[0.25, 1.1, -0.42]} scale={1.15}><RB s={[0.3, 1.5, 0.06]} rad={0.05} c="#f6f3ec" r={0.6} /><mesh position={[0, 0.05, 0.04]}><cylinderGeometry args={[0.04, 0.04, 1.3, 16]} /><meshPhysicalMaterial color="#e8f2ff" transparent opacity={0.4} /></mesh><mesh position={[0, -0.6 + lvl / 2, 0.04]}><cylinderGeometry args={[0.028, 0.028, lvl, 16]} /><Mat c="#c62a22" r={0.4} /></mesh><mesh position={[0, -0.68, 0.04]}><sphereGeometry args={[0.07, 16, 16]} /><Mat c="#c62a22" r={0.4} /></mesh>
      {[...Array(9)].map((_, j) => <RB key={j} p={[0.09, -0.5 + j * 0.13, 0.035]} s={[0.05, 0.008, 0.005]} rad={0.002} c="#22252b" r={0.5} />)}</group>
    <Plate p={[1.1, 1.62, -0.45]} w={0.66} h={0.26} txt={["100°F"]} bg="#ff8a2a" fg="#ffffff" size={170} />
    <Plate p={[1.1, 0.72, -0.45]} w={0.66} h={0.26} txt={["0°F"]} bg="#3a6ab8" fg="#ffffff" size={170} />
    <mesh position={[1.1, 1.62, -0.44]}><planeGeometry args={[0.74, 0.34]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.25 * (1 - hot)} /></mesh>
    <mesh position={[1.1, 0.72, -0.44]}><planeGeometry args={[0.74, 0.34]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.25 * (1 - cold)} /></mesh>
  </Room>;
}}</Stage>;

// 38 · el reloj del incendio: llamas alrededor de la caja en corte; adentro el papel aguanta mientras la aguja recorre los minutos
export const C38: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const ang = -c01((tt - 0.6) / 6) * Math.PI * 2, burn = c01((tt - 4.5) / 2);
  return <Room tt={tt} c={cam([0, 1.1, 3.0], [0.3, 0.8, 0])} wall="brick" z={-0.9}>
    <group position={[-0.5, 0, 0]}><RB p={[-0.33, 0.55, 0]} s={[0.06, 1.1, 0.7]} rad={0.01} c="#3d4148" m={0.6} r={0.35} /><RB p={[0.33, 0.55, 0]} s={[0.06, 1.1, 0.7]} rad={0.01} c="#3d4148" m={0.6} r={0.35} /><RB p={[0, 1.08, 0]} s={[0.72, 0.06, 0.7]} rad={0.01} c="#3d4148" m={0.6} r={0.35} /><RB p={[0, 0.03, 0]} s={[0.72, 0.06, 0.7]} rad={0.01} c="#3d4148" m={0.6} r={0.35} /><RB p={[0, 0.55, -0.33]} s={[0.66, 1.0, 0.04]} rad={0.01} c="#2a2c31" r={0.6} />
      <RB p={[0, 0.5, 0]} s={[0.4, 0.5, 0.02]} rad={0.003} c={burn > 0.5 ? "#e8d8b0" : "#fbfaf6"} r={0.9} />
      {[...Array(8)].map((_, i) => { const a = i / 8 * Math.PI * 2, hh = 0.35 + 0.12 * Math.sin(tt * 2 * Math.PI * 1.6 + i); return <mesh key={i} position={[Math.cos(a) * 0.5, hh / 2, Math.sin(a) * 0.45 + 0.05]}><coneGeometry args={[0.1, hh, 12]} /><meshBasicMaterial color={i % 2 ? "#ff8a2a" : "#ffb84a"} toneMapped={false} /></mesh>; })}</group>
    <group position={[0.85, 1.05, -0.4]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.4, 0.4, 0.06, 48]} /><Mat c="#f6f3ec" r={0.6} /></mesh><group position={[0, 0, 0.05]} rotation={[0, 0, ang]}><RB p={[0, 0.16, 0]} s={[0.03, 0.32, 0.02]} rad={0.01} c="#22252b" r={0.4} /></group><Plate p={[0, -0.6, 0]} w={0.6} h={0.2} txt={["30 MIN"]} size={160} /></group>
  </Room>;
}}</Stage>;

// 39 · la base de concreto: el agua sube hasta la cinta roja de la pared; la caja, sobre su base de 4", queda seca
export const C39: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const w = sm(tt, 1.0, 4.0) * 0.08;
  return <Room tt={tt} c={cam([0.3, 1.0, 2.6], [0, 0.35, 0])} wall="drywall" z={-0.7}>
    <RB p={[0, 0.05, 0]} s={[0.9, 0.1, 0.8]} rad={0.01} c="#b4b0a6" r={0.95} />
    <Safe3 p={[0, 0.1, 0]} s={0.8} />
    <RB p={[0, 0.085, -0.645]} s={[4.0, 0.02, 0.012]} rad={0.003} c="#c62a22" r={0.5} />
    <mesh position={[0, 0.005 + w, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[6, 3]} /><meshStandardMaterial color="#4a7aa8" transparent opacity={0.6} roughness={0.4} metalness={0} envMapIntensity={0.3} /></mesh>
    <Plate p={[0.75, 0.25, 0.42]} w={0.36} h={0.18} txt={['4"']} bg="#f2c230" size={260} />
  </Room>;
}}</Stage>;

// 40 · la caja en la vereda es un cartel: el cartón aplastado en primer plano con la caja fuerte impresa; pasan tres autos y cada uno gira el faro hacia ella
const Carton: React.FC<{ p: V3; rot: V3 }> = ({ p, rot }) => {
  const tex = React.useMemo(() => {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 768; const g = c.getContext("2d")!;
    g.fillStyle = "#b8905a"; g.fillRect(0, 0, 1024, 768); g.strokeStyle = "#a07a48"; g.lineWidth = 6; for (let x = 0; x < 1024; x += 36) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 768); g.stroke(); }
    g.fillStyle = "#2f3238"; g.fillRect(330, 130, 360, 470); g.fillStyle = "#454950"; g.fillRect(355, 155, 310, 420);
    g.fillStyle = "#c9ced4"; g.beginPath(); g.arc(510, 330, 70, 0, Math.PI * 2); g.fill(); g.fillStyle = "#454950"; g.beginPath(); g.arc(510, 330, 40, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#c9ced4"; g.fillRect(600, 300, 22, 110);
    g.fillStyle = "#1a1a1a"; g.font = "bold 70px Arial Black"; g.textAlign = "center"; g.fillText("STEELGUARD", 512, 700);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, []);
  return <group position={p} rotation={rot}><RB p={[0, 0, -0.012]} s={[1.3, 0.98, 0.02]} rad={0.004} c="#a07a48" r={0.9} /><mesh><planeGeometry args={[1.28, 0.96]} /><meshStandardMaterial map={tex} roughness={0.95} /></mesh></group>;
};
export const C40: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const car = (i: number) => -3.6 + 7.2 * c01((tt - 0.3 - i * 1.6) / 2.4), near = (x: number) => Math.max(0, 1 - Math.abs(x + 0.2) / 1.2);
  return <Room tt={tt} c={cam([0.7, 0.85, 3.4], [-0.1, 0.55, 0])} wall="brick" z={-2.4} night={0.45}>
    <RB p={[0, 0.005, -0.9]} s={[12, 0.01, 1.6]} rad={0.002} c="#3a3c40" r={0.9} />
    <RB p={[0, 0.06, 0.05]} s={[12, 0.12, 0.3]} rad={0.01} c="#b4b0a6" r={0.9} />
    <group position={[0.75, 0, 0.75]}><mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.28, 0.24, 0.84, 24]} /><Mat c="#2e4a32" r={0.6} /></mesh><mesh position={[0, 0.86, 0]}><cylinderGeometry args={[0.3, 0.3, 0.05, 24]} /><Mat c="#24392a" r={0.6} /></mesh></group>
    <Carton p={[-0.15, 0.52, 0.85]} rot={[-0.12, 0.25, 0.04]} />
    {[0, 1, 2].map((i) => { const x = car(i), n = near(x); return x > -3.5 && x < 3.5 ? <Car3 key={i} p={[x, 0, -0.9]} rot={[0, Math.PI / 2 + 0.45 * n, 0]} s={0.6} col={["#5a6a8a", "#8a3a2a", "#c9ced4"][i]} brake={n > 0.3 ? 1 : 0} head={1} /> : null; })}
  </Room>;
}}</Stage>;

// 41 · cortala en pedazos: la caja de cartón se aplasta, el cúter amarillo marca los cortes y cada baldosa se da vuelta y muestra el lado liso
export const C41: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const flat = sm(tt, 0.7, 1.5), cut = c01((tt - 1.6) / 2.1), fl = (i: number) => sm(tt, 4.0 + i * 0.22, 4.5 + i * 0.22);
  const seg = Math.min(2, Math.floor(cut * 3)), u = cut * 3 - seg;
  const lines: [V3, V3][] = [[[-0.26, 0.335, -0.46], [-0.26, 0.335, 0.46]], [[0.26, 0.335, -0.46], [0.26, 0.335, 0.46]], [[-0.78, 0.335, 0], [0.78, 0.335, 0]]];
  const tip = (j: number, v: number): V3 => { const [a, b] = lines[j]; return [a[0] + (b[0] - a[0]) * v, a[1], a[2] + (b[2] - a[2]) * v]; };
  const T = cut > 0 && cut < 1 ? tip(seg, u) : null;
  return <Room tt={tt} c={[{ t: 0, p: [0, 2.0, 1.9], l: [0, 0.3, -0.05], fov: 42 }, { t: 12, p: [0.15, 1.95, 1.8], l: [0, 0.3, -0.05], fov: 42, arc: 0.02 }]} wall="drywall" floor="concrete" z={-1.6}>
    <RB p={[0, 0.29, 0]} s={[2.1, 0.06, 1.3]} rad={0.01} c="#3a3c40" r={0.8} />
    {flat < 1 && <group position={[0, 0.32, 0]} scale={[1, Math.max(0.02, 1 - flat), 1]}><Box3 p={[0, 0, 0]} s={[1.0, 0.6, 0.6]} /></group>}
    {flat > 0 && [...Array(6)].map((_, i) => { const x = -0.52 + (i % 3) * 0.52, z = -0.23 + Math.floor(i / 3) * 0.46, f = fl(i); return <group key={i} position={[x, 0.33 + 0.18 * Math.sin(Math.PI * f), z]} rotation={[Math.PI * f, 0, 0]} scale={[flat, 1, flat]}>
      <RB s={[0.51, 0.012, 0.45]} rad={0.003} c="#b8905a" r={0.9} />
      <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.22]} /><meshBasicMaterial color="#2f3238" /></mesh>
      <mesh position={[0.02, 0.008, 0.02]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.04, 20]} /><meshBasicMaterial color="#c9ced4" /></mesh>
    </group>; })}
    {[0, 1, 2].map((j) => { const v = j < seg ? 1 : j === seg ? u : 0; if (cut <= 0 || v <= 0 || tt > 4.0) return null; const a = lines[j][0], b = tip(j, v); return <mesh key={j} position={[(a[0] + b[0]) / 2, 0.342, (a[2] + b[2]) / 2]} rotation={[-Math.PI / 2, 0, j === 2 ? 0 : Math.PI / 2]}><planeGeometry args={[Math.hypot(b[0] - a[0], b[2] - a[2]), 0.012]} /><meshBasicMaterial color="#2a2016" /></mesh>; })}
    {T && <group position={[T[0], T[1] + 0.09, T[2]]} rotation={[0, seg === 2 ? 0 : -Math.PI / 2, -0.6]} scale={1.8}><RB s={[0.22, 0.05, 0.05]} rad={0.02} c="#f2c230" r={0.5} /><RB p={[-0.14, -0.02, 0]} s={[0.07, 0.016, 0.008]} rad={0.003} c="#c9ced4" m={1} r={0.2} /></group>}
  </Room>;
}}</Stage>;

// 42 · la cadena del parasol: el control del portón brilla en el auto; vuela un hilo hasta el portón y el portón sube solo
export const C42: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const th = c01((tt - 1.2) / 1.4), up = sm(tt, 2.8, 4.4);
  return <Room tt={tt} c={cam([1.2, 1.8, 6.0], [0.6, 1.0, 0])} wall="brick" z={-0.5}>
    <GDoor3 p={[-0.6, 0, -0.3]} up={up} w={2.4} />
    <Car3 p={[2.4, 0, 1.0]} rot={[0, -0.3, 0]} s={0.8} />
    <Fob3 p={[2.3, 1.05, 1.2]} rot={[1.2, 0, 0]} s={0.5} led={1} />
    <mesh position={[2.3 + (-0.6 - 2.3) * th, 1.05 + 0.8 * Math.sin(Math.PI * th), 1.2 - 1.4 * th]}><sphereGeometry args={[0.06 * (th > 0 && th < 1 ? 1 : 0), 16, 16]} /><meshBasicMaterial color="#ff5a3a" toneMapped={false} /></mesh>
  </Room>;
}}</Stage>;

// 43 · el botón de vacaciones: la mano aprieta LOCK en el panel de la pared; los controles de afuera titilan y el portón no se mueve
export const C43: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const press = sm(tt, 1.0, 1.3) * (1 - sm(tt, 1.6, 1.9)), on = tt > 1.3 ? 1 : 0, blink = (i: number) => (tt > 2.4 + i * 0.6 && Math.sin(tt * 9) > 0 ? 1 : 0);
  return <Room tt={tt} c={cam([0, 1.2, 2.6], [0, 1.0, 0])} wall="drywall" z={-0.5}>
    <group position={[-0.5, 1.15, -0.42]}><RB s={[0.5, 0.7, 0.05]} rad={0.03} c="#ecebe6" r={0.5} /><RB p={[0, -0.05, 0.03 - 0.015 * press]} s={[0.3, 0.3, 0.05]} rad={0.04} c={on ? "#c62a22" : "#9aa0a8"} r={0.4} /><Plate p={[0, 0.25, 0.03]} w={0.36} h={0.12} txt={["LOCK"]} size={170} /></group>
    <Hand3 p={[-0.5, 1.12, -0.05 - 0.08 * press]} rot={[0, Math.PI, 0]} s={1.2} />
    {[0, 1, 2].map((i) => <Fob3 key={i} p={[0.45 + i * 0.35, 0.65 + 0.08 * i, 0.1]} rot={[1.1, 0.2 * i, 0]} s={0.6} led={blink(i)} />)}
  </Room>;
}}</Stage>;

// 44 · nunca la llave al lado del candado: la llave sale volando del clavo, cruza la pared y cae en un libro abierto en otro cuarto
export const C44: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const f = sm(tt, 1.2, 3.0), x = -1.2 + 2.4 * f;
  return <Room tt={tt} c={cam([0, 1.4, 3.6], [0, 0.9, 0])} wall="drywall" z={-0.6}>
    <Pad p={[-1.4, 1.2, -0.45]} s={0.7} />
    <RB p={[-1.05, 1.4, -0.52]} s={[0.05, 0.05, 0.1]} rad={0.01} c="#9aa0a8" m={1} r={0.3} />
    <RB p={[0, 0.9, -0.1]} s={[0.1, 1.8, 0.9]} rad={0.01} c="#e8e4da" r={0.8} op={0.5} />
    <RB p={[1.2, 0.35, -0.1]} s={[0.9, 0.7, 0.6]} rad={0.02} c="#7a5a3a" r={0.7} />
    <group position={[1.2, 0.72, -0.1]}>{[-1, 1].map((sd) => <RB key={sd} p={[sd * 0.17, 0.01, 0]} rot={[0, 0, -sd * 0.12]} s={[0.34, 0.02, 0.44]} rad={0.004} c="#fbfaf6" r={0.9} />)}</group>
    <Key p={[x, 1.25 + 0.6 * Math.sin(Math.PI * f) - 0.45 * f, -0.4 + 0.3 * f]} rot={[0, 0, f * 4]} s={2.4} />
  </Room>;
}}</Stage>;

// 45 · las dos mitades: los papeles se duplican; los originales vuelan a la bóveda del banco, las copias quedan en la caja de casa
export const C45: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const dup = sm(tt, 0.8, 1.6), fly = sm(tt, 2.0, 3.6);
  return <Room tt={tt} c={cam([0, 1.3, 3.8], [0, 0.9, 0])} wall="drywall" z={-0.8}>
    <group position={[-1.5, 1.0, -0.6]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.7, 0.7, 0.2, 48]} /><Mat c="#9aa0a8" m={0.9} r={0.3} /></mesh>{[...Array(6)].map((_, i) => <RB key={i} p={[0, 0, 0.11]} rot={[0, 0, i / 6 * Math.PI]} s={[0.9, 0.05, 0.04]} rad={0.01} c="#c9ced4" m={1} r={0.25} />)}</group>
    <House3 p={[1.5, 0, -0.4]} s={0.9} />
    <Safe3 p={[1.0, 0, 0.5]} s={0.5} open={1} />
    {[0, 1, 2].map((i) => <group key={i}>
      <RB p={[0.0 + (-1.5 - 0.0) * fly, 0.9 + i * 0.12 + 0.6 * Math.sin(Math.PI * fly), 0.4 - 0.9 * fly]} rot={[0.3, 0, 0.1 * i]} s={[0.34, 0.01, 0.44]} rad={0.003} c="#fbfaf6" r={0.9} />
      <RB p={[0.0 + 1.0 * dup * fly, 0.9 + i * 0.12 - 0.5 * fly, 0.4 + 0.1 * fly]} rot={[0.3, 0, -0.1 * i]} s={[0.34 * dup + 0.001, 0.01, 0.44 * dup + 0.001]} rad={0.003} c="#e8e8f8" r={0.9} />
    </group>)}
  </Room>;
}}</Stage>;

export const HEROES_3S = {
  slabcore: C01, doordown: C02, eyescan: C03, dozencycles: C04, picframe: C05, sightcone: C06, frostfilm: C07, twomen: C08, tipslide: C09, handles: C10,
  policycap: C11, tablephoto: C12, lowcorner: C13, sponge: C14, wetrings: C15, workshop: C16, toolkeys: C17, chainloop: C18, fourhouses: C19, truckwalk: C20,
  cornertop: C21, attackroom: C22, gouges: C23, cabwrap: C24, xraybolts: C25, straighthole: C26, dustgrip: C27, pulltest: C28, sleeves: C29, edgespall: C30,
  tendons: C31, carlstack: C32, rollaside: C33, pathpast: C34, valuescan: C35, spotskip: C36, heatswing: C37, firetime: C38, raisedpad: C39, billboard: C40,
  cuttiles: C41, visorchain: C42, vacationbtn: C43, keyhook: C44, bankhome: C45,
};
