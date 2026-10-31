// ohf30c · kit de la ventana guillotina vieja (double hung) en 3D: marco, jambas, junquillo, listón separador, dos hojas,
// riel de encuentro, cierre de leva, roldanas, y las rendijas que brillan con el frío. Más las piezas de burlete (V, felpa,
// burlete de bulbo, masilla en cordón), el sahumerio y su humo. Nada se exporta con prefijo H (body_gen sólo mapea los H…).
import React from "react";
import * as THREE from "three";
import { M, RBox, eio, lerp, tubeG } from "./h3d";

const PI = Math.PI;
type V3 = [number, number, number];
export const OW = 0.46, OH = 0.8, FR = 0.05, SR = 0.034, SD = 0.03;
const paint = (c = "#ece5d6") => <meshStandardMaterial color={c} roughness={0.55} />;

// una hoja: dos travesaños, dos montantes y el vidrio (viejo, con un leve tinte)
export const Sash: React.FC<{ h: number; w?: number; col?: string; pane?: number; wavy?: number }> = ({ h, w = OW - 0.012, col, pane = 0.09, wavy = 0 }) => <>
  <RBox s={[w, SR, SD]} p={[0, SR / 2, 0]} r={0.003}>{paint(col)}</RBox>
  <RBox s={[w, SR, SD]} p={[0, h - SR / 2, 0]} r={0.003}>{paint(col)}</RBox>
  <RBox s={[SR, h, SD]} p={[-w / 2 + SR / 2, h / 2, 0]} r={0.003}>{paint(col)}</RBox>
  <RBox s={[SR, h, SD]} p={[w / 2 - SR / 2, h / 2, 0]} r={0.003}>{paint(col)}</RBox>
  <mesh position={[0, h / 2, 0]}><planeGeometry args={[w - 2 * SR, h - 2 * SR, 8, 8]} />{M.glass({ op: pane, col: wavy > 0 ? "#dff3e6" : "#e9f6ff" })}</mesh>
</>;

export type Gaps = { rail?: number; side?: number; bot?: number; top?: number };
export const GAPC = "#8fd6ff";
// ventana completa. y=0 es el antepecho (sill), y=OH la cabeza (head). z=0 el plano del marco; el cuarto está hacia +z.
export const OldWin: React.FC<{
  p?: V3; s?: number; lo?: number; hi?: number; tilt?: number; lock?: number; gap?: Gaps; gapCol?: string; sky?: string;
  pulley?: boolean; bead?: number; noTop?: boolean; children?: React.ReactNode; trim?: boolean; ex?: number;
}> = ({ p = [0, 0, 0], s = 1, lo = 0, hi = 0, tilt = 0, lock = 1, gap = {}, gapCol = GAPC, sky = "#16233a", pulley = true, bead = 0, noTop = false, children, trim = true, ex = 0 }) => {
  const sh = OH / 2 + 0.012, yLo = lo * (OH / 2 - 0.03), yHi = OH / 2 - 0.012 - hi * (OH / 2 - 0.03);
  const G = (v?: number) => Math.max(0, Math.min(1, v ?? 0));
  return <group position={p} scale={s}>
    {/* afuera: la noche (o el día) detrás del vidrio */}
    <mesh position={[0, OH / 2, -0.16]}><planeGeometry args={[OW + 0.6, OH + 0.6]} /><meshBasicMaterial color={sky} toneMapped={false} /></mesh>
    {/* marco: jambas, cabeza, antepecho y contramarco del lado del cuarto */}
    {[-1, 1].map((k) => <RBox key={k} s={[FR, OH + FR, 0.12]} p={[k * (OW / 2 + FR / 2), OH / 2 + FR / 2 - 0.01, 0]} r={0.004}>{paint("#e2dac9")}</RBox>)}
    <RBox s={[OW + 2 * FR, FR, 0.12]} p={[0, OH + FR / 2, 0]} r={0.004}>{paint("#e2dac9")}</RBox>
    <RBox s={[OW + 2 * FR + 0.1, 0.026, 0.19]} p={[0, -0.013, 0.04]} r={0.006}>{paint("#ddd3bf")}</RBox>
    {trim && <>
      {[-1, 1].map((k) => <RBox key={k} s={[0.07, OH + 0.16, 0.02]} p={[k * (OW / 2 + FR + 0.035), OH / 2 + 0.04, 0.07]} r={0.004}>{paint("#efe8da")}</RBox>)}
      <RBox s={[OW + 2 * FR + 0.2, 0.08, 0.025]} p={[0, OH + FR + 0.04, 0.07]} r={0.005}>{paint("#efe8da")}</RBox>
    </>}
    {/* junquillos (stops) del lado del cuarto y listón separador (parting bead) entre las dos guías */}
    {[-1, 1].map((k) => <RBox key={"st" + k} s={[0.014, OH, 0.016]} p={[k * (OW / 2 - 0.007), OH / 2, 0.052]} r={0.002}>{paint("#e8e0cf")}</RBox>)}
    {[-1, 1].map((k) => <group key={"pb" + k} position={[k * (OW / 2 - 0.006 + bead * 0.012 * Math.sin(k)), OH / 2, 0]} rotation={[0, 0, bead * 0.03 * k]}>
      <RBox s={[0.012, OH, 0.012]} r={0.002}>{paint("#d9cfba")}</RBox></group>)}
    {/* roldanas arriba de cada jamba */}
    {pulley && [-1, 1].map((k) => <group key={"pu" + k} position={[k * (OW / 2 + 0.001), OH - 0.07, -0.022]} rotation={[0, k * PI / 2, 0]}>
      <RBox s={[0.03, 0.07, 0.004]} r={0.002}>{M.brass({ col: "#8a6a32" })}</RBox>
      <mesh position={[0, 0, 0.004]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.004, 20]} />{M.steel({ col: "#4a4640" })}</mesh></group>)}
    {/* hoja de arriba (atrás) y hoja de abajo (adelante), con su inclinación si el cordón se cortó */}
    {!noTop && <group position={[0, yHi + ex * 0.06, -0.022 - ex * 0.16]}><Sash h={sh} /></group>}
    <group position={[tilt * 0.4, yLo - ex * 0.03, 0.022 + ex * 0.2]} rotation={[0, 0, tilt]}>
      <Sash h={sh} />
      {/* cierre de leva sobre el travesaño de encuentro */}
      <group position={[0, sh + 0.004, 0.0]}>
        <RBox s={[0.05, 0.008, 0.024]} r={0.003}>{M.brass()}</RBox>
        <group rotation={[0, -lock * PI * 0.85, 0]} position={[0.012, 0.008, 0]}><RBox s={[0.05, 0.006, 0.012]} p={[-0.02, 0, 0]} r={0.003}>{M.brass()}</RBox>
          <mesh position={[-0.046, 0.006, 0]}><sphereGeometry args={[0.007, 14, 10]} />{M.brass()}</mesh></group>
      </group>
    </group>
    {/* rendijas: líneas de luz fría que sólo se ven si hay rendija */}
    {G(gap.rail) > 0.01 && <mesh position={[0, OH / 2 + 0.012, 0.04]}><boxGeometry args={[OW - 0.03, 0.004 + 0.012 * G(gap.rail), 0.008]} />{M.glow({ col: gapCol, op: G(gap.rail) })}</mesh>}
    {G(gap.side) > 0.01 && [-1, 1].map((k) => <mesh key={"gs" + k} position={[k * (OW / 2 - 0.017), OH / 2, 0.042]}><boxGeometry args={[0.004 + 0.008 * G(gap.side), OH - 0.04, 0.004]} />{M.glow({ col: gapCol, op: G(gap.side) })}</mesh>)}
    {G(gap.bot) > 0.01 && <mesh position={[0, 0.004, 0.042]}><boxGeometry args={[OW - 0.03, 0.004 + 0.016 * G(gap.bot), 0.006]} />{M.glow({ col: gapCol, op: G(gap.bot) })}</mesh>}
    {G(gap.top) > 0.01 && <mesh position={[0, OH - 0.003, -0.02]}><boxGeometry args={[OW - 0.03, 0.004 + 0.006 * G(gap.top), 0.04]} />{M.glow({ col: gapCol, op: G(gap.top) })}</mesh>}
    {children}
  </group>;
};

// burlete en V visto en corte o a lo largo: dos alas plegadas que se abren (open 0 = plano, 1 = V abierta)
export const VStrip: React.FC<{ L: number; open?: number; p?: V3; rot?: V3; col?: string; metal?: boolean; wing?: number; amax?: number }> = ({ L, open = 1, p = [0, 0, 0], rot = [0, 0, 0], col = "#d8a057", metal = true, wing = 0.03, amax = 0.32 }) => {
  const a = lerp(0.02, amax, open);
  const mat = metal ? M.brass({ col }) : M.plastic({ col: "#c9c4b8" });
  return <group position={p} rotation={rot}>
    {[-1, 1].map((k) => <group key={k} rotation={[0, k * a, 0]}><RBox s={[0.0016, L, wing]} p={[0, L / 2, wing / 2]} r={0.0006}>{mat}</RBox></group>)}
    <mesh position={[0, L / 2, 0]}><cylinderGeometry args={[0.0022, 0.0022, L, 10]} />{mat}</mesh>
  </group>;
};

// burlete de bulbo (tubo de goma con su pestaña); squash 0 = redondo, 1 = aplastado
export const Bulb: React.FC<{ L: number; p?: V3; squash?: number; r?: number; col?: string }> = ({ L, p = [0, 0, 0], squash = 0, r = 0.012, col = "#2a2a2c" }) => <group position={p}>
  <mesh rotation={[0, 0, PI / 2]} position={[0, r * (1 - 0.55 * squash), 0]} scale={[1 - 0.55 * squash, 1, 1 + 0.35 * squash]}>
    <cylinderGeometry args={[r, r, L, 24, 1, true]} /><meshStandardMaterial color={col} roughness={0.55} side={THREE.DoubleSide} /></mesh>
  <RBox s={[L, 0.002, r * 1.4]} p={[0, 0.001, -r * 1.1]} r={0.0008}><meshStandardMaterial color={col} roughness={0.6} /></RBox>
</group>;

// felpa (pile): base plana y cerdas cortas y densas
export const Pile: React.FC<{ L: number; p?: V3; rot?: V3; n?: number; hgt?: number; col?: string; bend?: number }> = ({ L, p = [0, 0, 0], rot = [0, 0, 0], n = 70, hgt = 0.012, col = "#3a3a3d", bend = 0 }) => <group position={p} rotation={rot}>
  <RBox s={[L, 0.002, 0.014]} r={0.0008}><meshStandardMaterial color="#202022" roughness={0.6} /></RBox>
  {Array.from({ length: n }, (_, i) => { const x = -L / 2 + (i + 0.5) * L / n; return [-1, 0, 1].map((k) =>
    <mesh key={i + "_" + k} position={[x + bend * hgt * 0.4, 0.001 + hgt / 2, k * 0.004]} rotation={[0, 0, -bend * 0.6]}><boxGeometry args={[0.0018, hgt, 0.0018]} /><meshStandardMaterial color={col} roughness={0.9} /></mesh>); })}
</group>;

// masilla en cordón (rope caulk) a lo largo de un camino; grow 0..1 la va «apretando»
export const RopeCaulk: React.FC<{ id: string; pts: number[][]; grow?: number; r?: number; col?: string }> = ({ id, pts, grow = 1, r = 0.0055, col = "#8f8b85" }) => {
  const n = Math.max(2, Math.round(pts.length * Math.min(1, grow)));
  if (grow <= 0.01) return null;
  return <mesh geometry={tubeG("rc" + id + n, pts.slice(0, n), r, 60, 12)}><meshStandardMaterial color={col} roughness={0.85} /></mesh>;
};

// el sahumerio: varilla, brasa que late y la columna de humo (quieta = recto; filtración = se tuerce hacia la rendija)
export const Incense: React.FC<{ tt: number; p?: V3; pull?: number; dir?: V3; n?: number }> = ({ tt, p = [0, 0, 0], pull = 0, dir = [-1, 0.2, 0], n = 24 }) => <group position={p}>
  <mesh position={[0, -0.09, 0]}><cylinderGeometry args={[0.0018, 0.0018, 0.18, 6]} /><meshStandardMaterial color="#6e3d23" roughness={0.8} /></mesh>
  <mesh position={[0, 0.001, 0]}><sphereGeometry args={[0.0035, 10, 8]} /><meshBasicMaterial color={new THREE.Color("#ff6a2a").multiplyScalar(0.8 + 0.2 * Math.sin(tt * 1.6))} toneMapped={false} /></mesh>
  {Array.from({ length: n }, (_, i) => {
    const u = (tt * 0.45 + i / n) % 1, up = u * 0.22, side = pull * u * u * 0.28;
    const x = dir[0] * side + 0.004 * Math.sin(tt * 2 + i * 1.7) * (1 - pull), y = up * (1 - 0.6 * pull) + dir[1] * side, z = dir[2] * side;
    return <mesh key={i} position={[x, 0.004 + y, z]} scale={0.6 + 2.2 * u}><sphereGeometry args={[0.008, 10, 8]} /><meshBasicMaterial color="#eef1f4" transparent opacity={0.6 * (1 - u)} depthWrite={false} /></mesh>;
  })}
</group>;

// trocito de cinta de pintor azul
export const BlueTape: React.FC<{ p: V3; rot?: V3; k?: number; w?: number }> = ({ p, rot = [0, 0, 0], k = 1, w = 0.035 }) => k <= 0.01 ? null :
  <RBox s={[w * k, 0.016 * k, 0.0015]} p={p} rot={rot} r={0.0006}><meshStandardMaterial color="#3d8bd9" roughness={0.8} /></RBox>;

// aire frío que entra (bocanadas azules de a hacia b)
export const coldIn = (k: number) => Math.max(0, Math.min(1, k));
export { eio };

// ---------- el cuarto de fondo: pared empapelada con una ventana vieja que da luz de día (para sacar objetos del fondo liso) ----------
export const RoomBack: React.FC<{ p?: [number, number, number]; s?: number; mat: React.ReactNode; sky?: string; wx?: number; lit?: number }> = ({ p = [0, 0.25, -0.8], s = 1.3, mat, sky = "#a9c4dc", wx = 0.45, lit = 1.4 }) => {
  const x0 = wx - (OW / 2 + FR) * s, x1 = wx + (OW / 2 + FR) * s, y0 = -FR * s, y1 = (OH + FR) * s, L = -3, R = 3, B = -1.6, T = 2.6;
  const pc = (a: number, b: number, c: number, d: number, k: string) => <RBox key={k} s={[b - a, d - c, 0.02]} p={[(a + b) / 2, (c + d) / 2, 0]} r={0.002} shadow={false}>{mat}</RBox>;
  return <group position={p}>
    {pc(L, x0, B, T, "l")}{pc(x1, R, B, T, "r")}{pc(x0, x1, y1, T, "t")}{pc(x0, x1, B, y0, "b")}
    <OldWin p={[wx, 0, -0.075 * s]} s={s} sky={sky} />
    <pointLight position={[wx, OH * s * 0.6, 0.5]} intensity={lit} distance={3.5} color="#e6efff" />
  </group>;
};
