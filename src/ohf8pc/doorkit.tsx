// ohf8pc · piezas del pie de la puerta: hoja de roble con paneles, marco, umbral gastado, burletes, bisagra, tornillo, papel, corriente fría.
import React from "react";
import { M, RBox, cl, tex, rn } from "./h3d";
import { FlowPath, V3 } from "./okit";

export const PI = Math.PI;
export const OAK: [number, number, number] = [132, 88, 48];
export const DW = 0.92, DH = 2.03, DT = 0.045;

// hoja de roble: p = centro del borde inferior; pivota sobre la bisagra (izquierda) con rot
export const Leaf: React.FC<{ w?: number; h?: number; t?: number; p?: number[]; swing?: number; sag?: number; base?: [number, number, number] }> = ({ w = DW, h = DH, t = DT, p = [0, 0.03, 0], swing = 0, sag = 0, base = OAK }) => <group position={[p[0] - w / 2, p[1], p[2]] as V3} rotation={[0, swing, 0]}>
  <group rotation={[0, 0, -sag]}>
    <RBox s={[w, h, t]} p={[w / 2, h / 2, 0]} r={0.006}>{M.wood({ base })}</RBox>
    {[[0.25, 0.42], [0.75, 0.42], [0.25, 1.32], [0.75, 1.32]].map(([x, y], i) => <group key={i}>
      <RBox s={[w * 0.36, y > 1 ? 0.92 : 0.62, 0.006]} p={[w * x, y, t / 2 + 0.001]} r={0.002}>{M.wood({ base: [base[0] - 26, base[1] - 20, base[2] - 12] })}</RBox>
      <RBox s={[w * 0.28, y > 1 ? 0.8 : 0.5, 0.012]} p={[w * x, y, t / 2 + 0.006]} r={0.004}>{M.wood({ base: [base[0] + 10, base[1] + 6, base[2] + 2] })}</RBox>
    </group>)}
    <mesh position={[w - 0.08, 1.0, t / 2 + 0.03]}><sphereGeometry args={[0.032, 20, 16]} />{M.brass()}</mesh>
  </group>
</group>;

// marco blanco alrededor de la abertura
export const Frame: React.FC<{ w?: number; h?: number; z?: number; col?: string }> = ({ w = DW, h = DH, z = 0, col = "#ece6d6" }) => <group>
  {[-1, 1].map((s) => <RBox key={s} s={[0.13, h + 0.2, 0.05]} p={[s * (w / 2 + 0.065), (h + 0.2) / 2, z + 0.03]} r={0.008}><meshStandardMaterial color={col} roughness={0.55} /></RBox>)}
  <RBox s={[w + 0.3, 0.14, 0.05]} p={[0, h + 0.14, z + 0.03]} r={0.008}><meshStandardMaterial color={col} roughness={0.55} /></RBox>
</group>;

// umbral de roble gastado: scoop = cuánto se hunde en el medio (metros reales ×), n tablitas
export const Saddle: React.FC<{ w?: number; d?: number; h?: number; scoop?: number; p?: number[]; base?: [number, number, number] }> = ({ w = DW + 0.06, d = 0.13, h = 0.05, scoop = 0, p = [0, 0, 0], base = [150, 106, 62] }) => { const n = 30; return <group position={p as V3}>{Array.from({ length: n }, (_, i) => { const u = (i + 0.5) / n, y = Math.max(0.004, h - scoop * Math.sin(u * PI) ** 2); return <RBox key={i} s={[w / n + 0.0012, y, d]} p={[-w / 2 + u * w, y / 2, 0]} r={0.0015}>{M.wood({ base })}</RBox>; })}</group>; };

// luz bajo la puerta: tira con alto por punto
export const Light: React.FC<{ w?: number; a: number; b: number; c?: number; y?: number; z?: number; k?: number }> = ({ w = DW, a, b, c, y = 0.054, z = 0.03, k = 1 }) => { const n = 26, mid = c ?? (a + b) / 2; return <group>{Array.from({ length: n }, (_, i) => { const u = (i + 0.5) / n, ht = (u < 0.5 ? a + (mid - a) * u * 2 : mid + (b - mid) * (u - 0.5) * 2) * k; return ht > 0.0012 ? <mesh key={i} position={[-w / 2 + u * w, y + ht / 2, z]}><planeGeometry args={[w / n + 0.002, ht]} /><meshBasicMaterial color="#ffe6b4" toneMapped={false} /></mesh> : null; })}</group>; };

// burlete atornillado: tira de aluminio con aleta o cepillo
export const Sweep: React.FC<{ w?: number; p?: number[]; kind?: "vinyl" | "brush"; bend?: number; col?: string }> = ({ w = DW - 0.02, p = [0, 0, 0], kind = "vinyl", bend = 0.2, col = "#c5c8c6" }) => <group position={p as V3}>
  <RBox s={[w, 0.05, 0.008]} r={0.002}>{M.steel({ col })}</RBox>
  {[-0.36, -0.12, 0.12, 0.36].map((x) => <group key={x}><RBox s={[0.05, 0.012, 0.0015]} p={[x * w, 0.004, 0.0048]} r={0.0006} shadow={false}><meshBasicMaterial color="#3f4242" /></RBox></group>)}
  {kind === "vinyl"
    ? <group position={[0, -0.025, 0]} rotation={[bend, 0, 0]}><RBox s={[w, 0.05, 0.005]} p={[0, -0.025, 0]} r={0.002}>{M.rubber({ col: "#2a292c" })}</RBox></group>
    : Array.from({ length: 60 }, (_, i) => <RBox key={i} s={[0.003, 0.052, 0.003]} p={[-w / 2 + (i + 0.5) * w / 60, -0.05, 0.002 * Math.sin(i * 1.7)]} rot={[0.12 * Math.sin(i * 2.3), 0, 0.14 * Math.sin(i * 1.1)]} r={0.0006} shadow={false}><meshStandardMaterial color="#2c2a28" roughness={0.8} /></RBox>)}
</group>;

// sello en U deslizado
export const SealU: React.FC<{ w?: number; p?: number[]; fin?: number }> = ({ w = DW - 0.02, p = [0, 0, 0], fin = 1 }) => <group position={p as V3}>
  {[-1, 1].map((s) => <RBox key={s} s={[w, 0.05, 0.004]} p={[0, 0.02, s * (DT / 2 + 0.003)]} r={0.0015}><meshStandardMaterial color="#d2cec3" roughness={0.65} /></RBox>)}
  <RBox s={[w, 0.006, DT + 0.01]} p={[0, -0.005, 0]} r={0.0015}><meshStandardMaterial color="#d2cec3" roughness={0.65} /></RBox>
  {[-0.012, 0.012].map((z) => <RBox key={z} s={[w, 0.022 * fin, 0.0035]} p={[0, -0.018, z]} r={0.001}><meshStandardMaterial color="#c4bfb3" roughness={0.7} /></RBox>)}
</group>;

export const Hinge: React.FC<{ p?: number[]; s?: number }> = ({ p = [0, 0, 0], s = 1 }) => <group position={p as V3} scale={s}>
  <RBox s={[0.08, 0.1, 0.004]} r={0.002}>{M.brass()}</RBox>
  <mesh rotation={[0, 0, 0]}><cylinderGeometry args={[0.009, 0.009, 0.11, 12]} />{M.brass()}</mesh>
  {[[-0.022, 0.03], [-0.022, -0.03], [0.022, 0.03], [0.022, -0.03]].map(([x, y]) => <mesh key={x + "" + y} position={[x, y, 0.003]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.006, 0.006, 0.003, 10]} />{M.steel({})}</mesh>)}
</group>;

// tornillo: L = largo; tip hacia -X
export const Screw: React.FC<{ L?: number; p?: number[]; rot?: number[]; col?: "brass" | "steel" }> = ({ L = 0.14, p = [0, 0, 0], rot = [0, 0, 0], col = "brass" }) => { const mat = col === "brass" ? M.brass() : M.steel({}); return <group position={p as V3} rotation={rot as V3}>
  <mesh rotation={[0, 0, PI / 2]} position={[L / 2, 0, 0]}><cylinderGeometry args={[0.0065, 0.0065, L, 10]} />{mat}</mesh>
  {Array.from({ length: Math.round(L / 0.012) }, (_, i) => <mesh key={i} position={[i * 0.012 + 0.008, 0, 0]} rotation={[0, 0, PI / 2 + 0.2]}><cylinderGeometry args={[0.0095, 0.0095, 0.0025, 10]} />{mat}</mesh>)}
  <mesh position={[L + 0.006, 0, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.015, 0.012, 16]} />{mat}</mesh>
</group>; };

// hoja de papel
export const Paper: React.FC<{ p?: number[]; rot?: number[]; w?: number; d?: number; col?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], w = 0.22, d = 0.28, col = "#f4f1e8" }) => <RBox s={[w, 0.0016, d]} p={p} rot={rot} r={0.0006}><meshStandardMaterial color={col} roughness={0.85} /></RBox>;

// corriente fría: filas de partículas que vienen por el piso
export const Cold: React.FC<{ tt: number; y?: number; x0?: number; x1?: number; z0?: number; z1?: number; k?: number; n?: number }> = ({ tt, y = 0.1, x0 = -0.4, x1 = 0.4, z0 = -0.4, z1 = 1.3, k = 1, n = 11 }) => <>{Array.from({ length: 6 }, (_, i) => { const x = x0 + (x1 - x0) * (i / 5); return <FlowPath key={i} tt={tt + rn(i, 71) * 2} pts={[[x, y + 0.03, z0], [x, y, z0 + (z1 - z0) * 0.3], [x + 0.03, y, z0 + (z1 - z0) * 0.65], [x + 0.07, y - 0.01, z1]]} n={n} k={k} r={0.012} v={0.55} col="#9fd2ee" />; })}</>;

// tablones del piso visibles en corte
export const Joist: React.FC<{ w?: number; p?: number[]; d?: number }> = ({ w = 1.4, p = [0, 0, 0], d = 1.0 }) => <group position={p as V3}>
  <RBox s={[w, 0.05, d]} r={0.004}>{M.wood({ base: [146, 106, 66] })}</RBox>
  <RBox s={[w, 0.3, d]} p={[0, -0.18, 0]} r={0.006}><meshStandardMaterial color="#54463a" roughness={0.95} /></RBox>
</group>;

export { cl, tex };
