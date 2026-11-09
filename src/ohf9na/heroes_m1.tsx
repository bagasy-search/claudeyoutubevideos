// ohf9na · componentes de la primera mitad: el kit, la palabra del título, el test, la línea de 10 pies, la rutina.
import React from "react";
import { H } from "./hkit";
import { CShadow, M, RBox, cl, eio, lerp, phys, rn } from "./h3d";
import { Bubbles, FlowPath, Hand, Rag, Tape } from "./okit";
import { Bottle, Dial, Envelope, Jug, Patch, Petri, PI, Plate, Slab, Swab, Tag, W3, Word } from "./moldkit";

type C = React.FC<{ t: number; h: H }>;
const K = (tt: number, a: number) => phys(tt, a, 8, 0.45);
const R = (tt: number, a: number) => cl((tt - a) / 0.5);

// 0:39 · TRES MINUTOS DE MANOS: cinco objetos entran a la bandeja, cada uno con su número
export const HTray: C = ({ t, h }) => <W3 t={t} h={h} mode="drop" wall="plaster" cam={{ at: [0, 0.12, 0], az: [-0.3, 0.1], el: [0.62, 0.8], r: [1.75, 1.45], fov: 32 }}>{(tt) => {
  const f = (i: number) => phys(tt, 0.4 + i * 0.8, 7, 0.5), xs = [-0.56, -0.28, 0, 0.28, 0.56];
  return <>
    <Slab s={[1.56, 0.03, 0.74]} p={[0, 0.015, 0]} col="#2c2a27" />
    <group position={[xs[0], 0.04, (1 - f(0)) * -1.6]} rotation={[PI / 2, 0, 0.1]}><Swab p={[0, -0.3, 0]} s={1.4} /></group>
    <Bottle p={[xs[1], 0.03, (1 - f(1)) * -1.6]} s={0.85} />
    <group position={[xs[2], 0.05, (1 - f(2)) * -1.6]}><Rag s={[0.2, 0.05, 0.16]} /></group>
    <group position={[xs[3], 0.05, (1 - f(3)) * -1.6]} rotation={[-PI / 2, 0, 0]}><Dial id="trayd" v={0.05} p={[0, 0, 0.02]} r={0.105} marks={60} /></group>
    <group position={[xs[4], 0.108, (1 - f(4)) * -1.6]} rotation={[0, 0, PI / 2]}>
      <mesh castShadow><cylinderGeometry args={[0.078, 0.078, 0.21, 30]} />{M.plastic({ col: "#17171a" })}</mesh>
      <mesh><cylinderGeometry args={[0.081, 0.081, 0.035, 30]} />{M.matte({ col: "#c9b36a" })}</mesh>
    </group>
    {[0, 1, 2, 3, 4].map((i) => <Tape key={i} txt={String(i + 1)} col="#b3261e" p={[xs[i], 0.034, 0.3]} rot={[-PI / 2, 0, 0]} w={0.1} k={K(tt, 0.7 + i * 0.8)} rev={R(tt, 0.7 + i * 0.8)} />)}
  </>;
}}</W3>;

// 1:14 · EL NÚMERO: un sello cae sobre un pedazo de yeso y deja un 10
export const HStamp10: C = ({ t, h }) => <W3 t={t} h={h} mode="wipe" floor="wood" wall="paper" cam={{ at: [0, 0.14, 0.08], az: [0.28, -0.1], el: [0.6, 0.85], r: [1.6, 1.36], fov: 32 }}>{(tt) => {
  const d = eio(tt, 0.5, 1.4), hit = tt > 1.4, up = eio(tt, 2, 2.9);
  return <>
    <Slab s={[0.9, 0.05, 0.7]} p={[0, 0.03, 0]} col="#b8c8a8" />
    {hit && <Word txt="10" p={[0, 0.057, -0.06]} rot={[-PI / 2, 0, 0]} w={0.55} col="#7a1c15" k={K(tt, 1.4)} />}
    <group position={[0, lerp(1, 0.12, d) + up * 0.9, -0.06]}><Slab s={[0.5, 0.1, 0.4]} p={[0, 0, 0]} col="#3a2a1a" /><mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.05, 0.06, 0.3, 20]} />{M.wood({ base: [120, 78, 44] })}</mesh></group>
    <Tape txt="SQUARE FEET" col="#b3261e" p={[0.08, 0.06, 0.25]} rot={[-PI / 2, 0, -0.03]} w={0.5} k={K(tt, 2.5)} rev={R(tt, 2.5)} />
  </>;
}}</W3>;

// 1:48 · LA PROMESA: un sobre lacrado baja al estante y se queda cerrado
export const HEnvelope: C = ({ t, h }) => <W3 t={t} h={h} mode="split" floor="wood" wall="brick" cam={{ at: [0, 0.82, 0], az: [-0.2, 0.15], el: [0.04, 0.1], r: [1.5, 1.2], fov: 32 }}>{(tt) => {
  const d = phys(tt, 0.4, 6, 0.55);
  return <>
    <Slab s={[1.8, 0.04, 0.4]} p={[0, 0.6, -0.15]} col="#6d4a2a" />
    <Envelope p={[0, lerp(1.7, 0.83, d), -0.2]} rot={[0.05, 0, 0.03]} s={1.05} />
    <Tape txt="LATER" col="#b3261e" p={[0.34, 1.06, -0.1]} rot={[0, 0, 0.1]} w={0.26} k={K(tt, 2.2)} rev={R(tt, 2.2)} />
  </>;
}}</W3>;

// 1:58 · LA PALABRA DEL TÍTULO: la placa sube y le estampan una interrogación
export const HKillPlate: C = ({ t, h }) => <W3 t={t} h={h} mode="iris" floor="wood" wall="brick" cam={{ at: [0, 0.6, 0], az: [0.14, -0.08], el: [0.04, 0.08], r: [1.62, 1.44], fov: 32 }}>{(tt) => {
  const u = phys(tt, 0.2, 6, 0.6);
  return <>
    <Plate mate txt="KILL" p={[-0.2, lerp(-0.4, 0.62, u), 0]} w={0.92} />
    {tt > 1.3 && <Word txt="?" p={[0.47, 0.62, 0.06]} w={1} rot={[0, 0, -0.12]} col="#d3362b" k={K(tt, 1.3)} />}
  </>;
}}</W3>;

// 2:41 · EL NOMBRE LARGO: el portaobjetos entra bajo la lente de bronce
export const HSlide: C = ({ t, h }) => <W3 t={t} h={h} mode="drop" wall="paper" floor="wood" cam={{ at: [0, 0.34, 0.12], az: [-0.42, -0.18], el: [0.4, 0.5], r: [2.3, 2.02], fov: 30 }}>{(tt) => {
  const s = phys(tt, 0.3, 6, 0.6);
  return <>
    <Slab s={[0.58, 0.04, 0.46]} p={[0, 0.02, -0.05]} col="#1c1c1c" />
    <Slab s={[0.42, 0.02, 0.32]} p={[0, 0.19, 0.03]} col="#2c2c2c" />
    <mesh position={[0, 0.11, -0.2]} castShadow><cylinderGeometry args={[0.03, 0.04, 0.16, 20]} />{M.matte({ col: "#1c1c1c" })}</mesh>
    <RBox s={[0.07, 0.56, 0.07]} p={[0, 0.42, -0.2]} r={0.02}>{M.matte({ col: "#222" })}</RBox>
    <RBox s={[0.1, 0.07, 0.3]} p={[0, 0.68, -0.08]} r={0.02}>{M.matte({ col: "#222" })}</RBox>
    <mesh position={[0, 0.56, 0.03]} castShadow><cylinderGeometry args={[0.06, 0.06, 0.32, 30]} />{M.brass()}</mesh>
    <mesh position={[0, 0.76, 0.03]} castShadow><cylinderGeometry args={[0.042, 0.05, 0.1, 26]} />{M.matte({ col: "#141414" })}</mesh>
    <mesh position={[0, 0.34, 0.03]} castShadow><cylinderGeometry args={[0.052, 0.03, 0.12, 24]} />{M.chrome()}</mesh>
    <group position={[lerp(1.1, 0, s), 0.208, 0.03]}><RBox s={[0.5, 0.01, 0.18]} r={0.002}>{M.glass({ op: 0.5 })}</RBox><Patch p={[0, 0.007, 0]} rot={[-PI / 2, 0, 0]} w={0.15} /></group>
    <Word txt="Stachybotrys" p={[0, 0.03, 0.46]} rot={[-1.05, 0, 0]} w={0.8} font="italic 700 96px Georgia, serif" k={K(tt, 1.2)} />
  </>;
}}</W3>;

// 2:59 · SEIS NEGROS: seis cajas de Petri, todas negras, ninguna es la misma
export const HDishes: C = ({ t, h }) => <W3 t={t} h={h} mode="wipe" wall="plaster" floor="wood" cam={{ at: [0, 0, 0.25], az: [0.06, -0.04], el: [1.3, 1.42], r: [2.3, 2.1], fov: 30 }}>{(tt) => <>
  {[0, 1, 2, 3, 4, 5].map((i) => { const f = eio(tt, 0.04 + i * 0.08, 0.42 + i * 0.08); return <Petri key={i} p={[-0.54 + (i % 3) * 0.54, 0.02 + (1 - f) * 0.7, 0.02 + (i > 2 ? 0.48 : 0)]} ry={(1 - f) * 5} s={1.4} seed={[3, 17, 29, 43, 59, 71][i]} base={["#070707", "#1d3a22", "#1b1b42", "#3e2a12", "#10353d", "#34143a"][i]} />; })}
  {tt > 1.1 && <Word txt="?" p={[0, 0.3, 0.25]} rot={[-1.36, 0, 0]} w={0.46} col="#d3362b" k={K(tt, 1.1)} />}
</>}</W3>;

// 4:14 · LO QUE NO ES MOHO: tres muestras giran y muestran qué son
const Swatch: React.FC<{ x: number; tt: number; a: number; txt: string; col: string; base: string }> = ({ x, tt, a, txt, col, base }) => { const f = eio(tt, a, a + 0.7); return <group position={[x, 0.55, 0]} rotation={[0, f * PI, 0]}>
  <Slab s={[0.42, 0.56, 0.012]} col="#28241f" /><Patch p={[0, 0, 0.008]} w={0.34} seed={5} />
  <group rotation={[0, PI, 0]}><Slab s={[0.42, 0.56, 0.012]} p={[0, 0, 0.002]} col={col} /><Patch p={[0, 0.07, 0.0095]} w={0.38} seed={x > 0 ? 12 : x < 0 ? 14 : 16} base={base} /><Tape txt={txt} col="#1c2a3a" p={[0, -0.2, 0.012]} w={0.32} /></group>
</group>; };
export const HSwatch: C = ({ t, h }) => <W3 t={t} h={h} mode="split" wall="plaster">{(tt) => <>
  <Swatch x={-0.5} tt={tt} a={0.6} txt="SOOT" col="#bdb7a9" base="#3b3b3d" /><Swatch x={0} tt={tt} a={1.3} txt="DIRT" col="#c6b491" base="#6f5a3c" /><Swatch x={0.5} tt={tt} a={2} txt="PASTE" col="#d8c28e" base="#a58642" />
  <FlowPath tt={tt} pts={[[-1, 0.92, 0.1], [0, 0.98, 0.14], [1, 0.9, 0.1]]} k={eio(tt, 0.4, 1.4)} col="#9fd2ff" />
</>}</W3>;

// 4:39 · 90 SEGUNDOS: la gota de lejía en dos manchas; una se aclara, la otra no
export const HDab: C = ({ t, h }) => <W3 t={t} h={h} mode="iris" cam={{ at: [0, 0.62, -0.4], az: [0.14, -0.08], el: [0.05, 0.1], r: [1.95, 1.75], fov: 32 }}>{(tt) => { const p = eio(tt, 0.7, 2.2); return <>
  <Patch p={[-0.3, 0.52, -0.49]} w={0.42} seed={7} /><Patch p={[-0.3, 0.52, -0.485]} w={0.15} seed={8} base="#d9d2bb" op={p} />
  <Patch p={[0.32, 0.52, -0.49]} w={0.46} seed={13} base="#6f5a3c" />
  <Dial id={"dab" + Math.round(p * 30)} v={p * 0.25} p={[0, 0.98, -0.4]} r={0.13} green={[0, 0.25]} marks={60} />
  <Tape txt="MOLD" col="#b3261e" p={[-0.3, 0.22, -0.46]} w={0.2} k={K(tt, 1.6)} rev={R(tt, 1.6)} /><Tape txt="DIRT" p={[0.32, 0.22, -0.46]} w={0.2} k={K(tt, 1.9)} rev={R(tt, 1.9)} />
</>; }}</W3>;

// 5:36 · LA LÍNEA: los mosaicos suben por la pared hasta tres por tres
export const HTiles: C = ({ t, h }) => <W3 t={t} h={h} mode="drop" wall="plaster" cam={{ at: [0, 0.72, -0.3], az: [-0.2, 0.16], el: [0.03, 0.09], r: [1.98, 1.76], fov: 34 }}>{(tt) => {
  const n = 9; return <>
    {Array.from({ length: n }, (_, i) => { const f = phys(tt, 0.5 + i * 0.32, 8, 0.5), c = i % 3, r = Math.floor(i / 3); return <Slab key={i} s={[0.28, 0.28, 0.012]} p={[-0.42 + c * 0.3, 0.36 + r * 0.3, lerp(0.8, -0.48, f)]} col={rn(i, 4) > 0.5 ? "#c6583e" : "#ba4c35"} op={0.9} />; })}
    <Tape txt="3 FT" col="#b3261e" p={[-0.12, 1.22, -0.46]} w={0.3} k={K(tt, 3.6)} rev={R(tt, 3.6)} />
    <Tape txt="3 FT" col="#b3261e" p={[-0.74, 0.66, -0.46]} rot={[0, 0, PI / 2]} w={0.3} k={K(tt, 4.1)} rev={R(tt, 4.1)} />
    <Tape txt="BIGGER? STOP" p={[0.62, 0.74, -0.46]} rot={[0, 0, -0.05]} w={0.5} k={K(tt, 5.4)} rev={R(tt, 5.4)} />
  </>;
}}</W3>;

// 6:07 · CUATRO EXCEPCIONES: cuatro carteles cuelgan de un clavo
export const HStops: C = ({ t, h }) => <W3 t={t} h={h} mode="split" wall="plaster">{(tt) => <>
  {["FLOOD", "DUCTS", "SICK", "SOFT"].map((s, i) => { const f = phys(tt, 0.3 + i * 0.5, 4, 0.22); return <group key={i} position={[-0.69 + i * 0.46, 1.06, -0.44]} rotation={[0, 0, (1 - f) * (i % 2 ? 0.9 : -0.9)]}><Tag p={[0, -0.34, 0]} col="#c23b2e" w={0.4} h={0.5}><Tape txt={s} p={[0, 0, 0.008]} w={0.34} /></Tag></group>; })}
</>}</W3>;

// 8:20 · LA BOLSA: se abre con una ráfaga y las esporas siguen el camino
export const HBagTrail: C = ({ t, h }) => <W3 t={t} h={h} mode="wipe" wall="plaster" cam={{ at: [0, 0.1, 0], az: [0.1, -0.1], el: [0.95, 1.14], r: [1.95, 1.65], fov: 32 }}>{(tt) => <>
  <group position={[-0.44, 0, 0.05]}>
    <mesh position={[0, 0.15, 0]} scale={[1.15, 0.95, 1.05]} castShadow><sphereGeometry args={[0.19, 30, 30]} />{M.matte({ col: "#1b1b1f" })}</mesh>
    <mesh position={[0.11, 0.1, 0.1]} castShadow><sphereGeometry args={[0.11, 22, 22]} />{M.matte({ col: "#1b1b1f" })}</mesh>
    <mesh position={[-0.12, 0.1, -0.09]} castShadow><sphereGeometry args={[0.12, 22, 22]} />{M.matte({ col: "#1b1b1f" })}</mesh>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = i / 7 * PI * 2; return <Slab key={i} s={[0.14, 0.006, 0.009]} p={[Math.cos(a) * 0.1, 0.305, Math.sin(a) * 0.1]} rot={[0, -a, -0.38]} col="#5a5a64" />; })}
    <mesh position={[0, 0.345, 0]}><sphereGeometry args={[0.03, 16, 16]} />{M.plastic({ col: "#2b2b30" })}</mesh>
    {[-1, 1].map((q) => <mesh key={q} position={[q * 0.06, 0.375, 0.01]} rotation={[0, 0, -q * 1.05]}><coneGeometry args={[0.035, 0.11, 8]} />{M.plastic({ col: "#17171a" })}</mesh>)}
    <Slab s={[0.13, 0.014, 0.034]} p={[0.2, 0.2, 0.03]} rot={[0, 0.3, -0.45]} col="#6a5e4b" />
  </group>
  <Bubbles tt={tt} n={Math.round(eio(tt, 0.4, 1.4) * 30)} box={[0.7, 0.05, 0.3]} p={[0, 0.08, 0.05]} v={0.02} r={0.007} col="#29241d" op={0.85} />
  <FlowPath tt={tt} pts={[[-0.24, 0.18, 0.08], [-0.05, 0.05, 0.2], [0.25, 0.05, -0.15], [0.85, 0.05, 0.1]]} k={eio(tt, 0.6, 2.8)} col="#29241d" r={0.012} />
  <Tape txt="BEDROOM" p={[-0.68, 0.01, -0.4]} rot={[-PI / 2, 0, 0]} w={0.32} /><Tape txt="HALL" p={[0.05, 0.01, -0.4]} rot={[-PI / 2, 0, 0]} w={0.22} /><Tape txt="STAIRS" p={[0.8, 0.01, -0.4]} rot={[-PI / 2, 0, 0]} w={0.28} />
</>}</W3>;

// 8:48 · EL VENTILADOR: el aire sale; la flecha contra la pared queda tachada
export const HFanOut: C = ({ t, h }) => <W3 t={t} h={h} mode="iris" wall="plaster" cam={{ at: [0, 0.65, -0.1], az: [-0.45, -0.2], el: [0.12, 0.16], r: [2.05, 1.8], fov: 34 }}>{(tt) => { const a = eio(tt, 1.2, 2.2); return <>
  <group position={[0.6, 0.65, -0.47]}>
    <Slab s={[0.78, 0.78, 0.02]} p={[0, 0, -0.016]} col="#ece6d6" /><Slab s={[0.66, 0.66, 0.01]} p={[0, 0, -0.006]} col="#a9cde0" />
    {([[0, 0.31, 0.66, 0.05], [0, -0.31, 0.66, 0.05], [-0.31, 0, 0.05, 0.66], [0.31, 0, 0.05, 0.66]] as number[][]).map((q, i) => <Slab key={i} s={[q[2], q[3], 0.09]} p={[q[0], q[1], 0.03]} col="#2a2a2a" />)}
    {[0, 1, 2, 3, 4].map((i) => <group key={i} position={[0, 0, 0.02]} rotation={[0, 0, tt * 9 + i * PI * 2 / 5]}><group rotation={[0, 0.5, 0]}><Slab s={[0.13, 0.22, 0.006]} p={[0, 0.15, 0]} col="#d8d4c8" /></group></group>)}
    <mesh position={[0, 0, 0.03]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.06, 24]} />{M.matte({ col: "#2a2a2a" })}</mesh>
  </group>
  <FlowPath tt={tt} pts={[[-0.8, 0.65, 0.3], [0, 0.65, 0.1], [0.6, 0.65, -0.3], [0.62, 0.65, -1.4]]} k={eio(tt, 0.5, 2)} col="#2f7fc4" r={0.016} />
  <Tape txt="OUT" col="#1b6e43" p={[0.6, 1.12, -0.45]} w={0.2} k={K(tt, 2)} rev={R(tt, 2)} />
  <Patch p={[-0.86, 0.66, -0.488]} w={0.36} seed={23} />
  <group position={[-0.42, 0.66, -0.44]}><Slab s={[Math.max(0.01, 0.4 * a), 0.05, 0.01]} p={[0.16 - 0.2 * a, 0, 0]} col="#2f7fc4" /><mesh position={[0.16 - 0.4 * a - 0.05, 0, 0]} rotation={[0, 0, PI / 2]} scale={cl(a * 3)}><coneGeometry args={[0.07, 0.13, 3]} />{M.matte({ col: "#2f7fc4" })}</mesh>{tt > 3 && <Word txt="X" p={[-0.05, 0, 0.03]} w={0.6} col="#d3362b" k={K(tt, 3)} />}</group>
  {tt > 3 && <Tape txt="NEVER AT THE WALL" col="#b3261e" p={[-0.42, 1.04, -0.44]} rot={[0, 0, 0.05]} w={0.7} k={K(tt, 3)} rev={R(tt, 3)} />}
</>; }}</W3>;

// 9:22 · SEIS PULGADAS MÁS: el halo discontinuo y la regla
export const HHalo: C = ({ t, h }) => <W3 t={t} h={h} mode="split" cam={{ at: [0.1, 0.52, -0.4], az: [0.2, -0.12], el: [0.04, 0.1], r: [2.05, 1.8], fov: 32 }}>{(tt) => <>
  <Patch p={[0, 0.52, -0.49]} w={0.56} seed={11} />
  {Array.from({ length: 40 }, (_, i) => { const a = i / 40 * PI * 2; return i / 40 < eio(tt, 0.5, 2.3) ? <Slab key={i} s={[0.05, 0.012, 0.004]} p={[Math.cos(a) * 0.5, 0.52 + Math.sin(a) * 0.5, -0.484]} rot={[0, 0, a + PI / 2]} col="#f2c14e" /> : null; })}
  <Slab s={[0.24, 0.08, 0.006]} p={[0.39, 0.52, -0.478]} col="#e7b93f" />
  {[0, 1, 2, 3, 4, 5, 6].map((i) => <Slab key={i} s={[0.005, i % 3 === 0 ? 0.045 : 0.028, 0.003]} p={[0.28 + i * 0.0367, 0.538, -0.473]} col="#1c1c1c" />)}
  <Tape txt='6"' col="#b3261e" p={[0.39, 0.66, -0.46]} w={0.2} k={K(tt, 2.5)} rev={R(tt, 2.5)} />
</>}</W3>;

// 10:28 · EL TRAPO SUCIO: el rodillo pinta con lo que acaba de sacar
export const HRoller: C = ({ t, h }) => <W3 t={t} h={h} mode="drop" cam={{ at: [0, 0.6, -0.3], az: [-0.2, 0.14], el: [0.04, 0.1], r: [1.7, 1.42], fov: 34 }}>{(tt) => { const k = eio(tt, 0.7, 4.5), x = lerp(-0.72, 0.72, k); return <>
  <Slab s={[Math.max(0.01, k * 1.44), 0.44, 0.004]} p={[-0.72 + k * 0.72, 0.62, -0.49]} col="#6d6b64" op={0.7} />
  {[-0.62, -0.42, -0.22, -0.02, 0.18, 0.38, 0.58].map((q, i) => <Patch key={i} p={[q, 0.62 + (i % 2 ? 0.05 : -0.05), -0.486]} w={0.3} k={cl((x - q + 0.1) / 0.2)} seed={80 + i} />)}
  <group position={[x, 0.62, -0.42]}><mesh castShadow><cylinderGeometry args={[0.06, 0.06, 0.44, 24]} />{M.matte({ col: "#3a3833" })}</mesh>
    {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[Math.sin(i * 2.4 + tt * 3) * 0.061, -0.2 + i * 0.026, Math.cos(i * 2.4 + tt * 3) * 0.061]}><sphereGeometry args={[0.009 + rn(i, 2) * 0.008, 8, 8]} />{M.matte({ col: "#0c0b0a" })}</mesh>)}
    <mesh position={[0.02, -0.42, 0.1]} rotation={[0.3, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.42, 10]} />{M.steel()}</mesh></group>
  <Tape txt="SAME MOLD, THINNER" col="#b3261e" p={[0, 0.2, -0.45]} w={0.8} k={K(tt, 4.6)} rev={R(tt, 4.6)} />
</>; }}</W3>;

// 11:36 · DENTRO DE LA PINTURA: las burbujas entran en los poros
export const HPores: C = ({ t, h }) => <W3 t={t} h={h} mode="iris" floor="wood" wall="plaster" bg="#0d1216" cam={{ at: [0, 0.5, 0], az: [0.14, -0.1], el: [0.05, 0.08], r: [1.85, 1.66], fov: 30 }}>{(tt) => <>
  <Slab s={[1.8, 0.4, 0.4]} p={[0, 0.25, 0]} col="#d7d2c0" />
  {[-0.6, -0.3, 0, 0.3, 0.6].map((x, i) => <React.Fragment key={i}><Slab s={[0.07, 0.3, 0.42]} p={[x, 0.32 - 0.05 * (i % 2), 0]} col="#2a241c" />
    <Bubbles tt={tt + i} n={7} box={[0.04, 0.3, 0.01]} p={[x, 0.32, 0.22]} v={-0.13} r={0.013} col="#6ec0ff" op={1} /></React.Fragment>)}
  <Bubbles tt={tt * 0.8} n={34} box={[1.5, 0.26, 0.2]} p={[0, 0.6, 0.22]} v={-0.12} r={0.016} col="#6ec0ff" op={1} />
  <Tape txt="INTO THE PORES" p={[0, 0.84, 0.1]} w={0.56} k={K(tt, 1.2)} rev={R(tt, 1.2)} />
</>}</W3>;

// 12:15 · LA RAJA: la linterna recorre la unión con el zócalo y lo oscuro se esconde
export const HCrack: C = ({ t, h }) => <W3 t={t} h={h} mode="wipe" cam={{ at: [0, 0.26, -0.34], az: [-0.2, 0.14], el: [0.08, 0.14], r: [1.98, 1.84], fov: 30 }}>{(tt) => { const x = lerp(-0.72, 0.62, eio(tt, 0.2, 2)); return <>
  <Slab s={[3, 0.14, 0.03]} p={[0, 0.07, -0.47]} col="#f3efe4" /><Slab s={[3, 0.012, 0.01]} p={[0, 0.145, -0.451]} col="#0d0c0b" />
  {[-0.55, -0.28, -0.02, 0.24, 0.5].map((q, i) => <Patch key={i} p={[q, 0.2, -0.488]} w={0.3} k={cl((x - q + 0.12) / 0.24)} seed={20 + i} />)}
  <group position={[x, 0.2, -0.16]} rotation={[PI / 2, 0, 0]}><mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.03, 0.032, 0.25, 20]} />{M.rubber({ col: "#20201e" })}</mesh><mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.034, 0.064, 0.09, 26]} />{M.chrome()}</mesh><mesh position={[0, -0.13, 0]}><coneGeometry args={[0.15, 0.34, 28, 1, true]} />{M.glow({ col: "#ffe7ad", op: 0.2 })}</mesh></group>
  <Tape txt="WHERE IT HIDES" col="#b3261e" p={[0, 0.5, -0.45]} w={0.58} k={K(tt, 1)} rev={R(tt, 1)} />
</>; }}</W3>;

// 12:30 · DIEZ MINUTOS: el reloj de cocina rueda hasta la pared mojada
export const HTimer: C = ({ t, h }) => <W3 t={t} h={h} mode="drop" cam={{ at: [0, 0.3, -0.2], az: [0.28, -0.1], el: [0.14, 0.18], r: [1.4, 1.18], fov: 32 }}>{(tt) => { const r = eio(tt, 0.2, 1.4), v = 10 - cl(tt - 1.4) * 0.1; return <>
  <Patch p={[0.14, 0.36, -0.488]} w={1.05} seed={37} base="#3b4a44" />
  <group position={[lerp(-1.1, 0, r), 0.2, -0.12]} rotation={[0, 0, (1 - r) * 8]}><Dial id={"tm" + Math.round(v * 10)} v={v / 60} p={[0, 0, 0]} r={0.2} red={[0, v / 60]} marks={60} /></group>
  <Tape txt="10 MINUTES" col="#b3261e" p={[0, 0.54, -0.42]} w={0.5} k={K(tt, 1.6)} rev={R(tt, 1.6)} />
  <CShadow p={[0, 0, -0.12]} s={[0.3, 0.08]} o={0.5} />
</>; }}</W3>;

// 13:08 · 24 HORAS: la rueda se pasa de verde a rojo
export const HDayClock: C = ({ t, h }) => <W3 t={t} h={h} mode="iris" wall="plaster" cam={{ at: [0, 0.62, -0.3], az: [-0.14, 0.1], el: [0.03, 0.08], r: [2, 1.8], fov: 32 }}>{(tt) => <>
  <Dial id={"day" + Math.round(eio(tt, 0.15, 1.25) * 30)} v={eio(tt, 0.15, 1.25) * 0.75} p={[0, 0.62, -0.4]} r={0.42} marks={24} green={[0, 0.5]} red={[0.5, 0.75]} />
  <Word txt="24 HOURS" p={[0, 0.74, -0.35]} w={0.42} col="#1c2a3a" />
  <Bubbles tt={tt} n={Math.round(cl((tt - 1) / 0.5) * 26)} box={[0.8, 0.8, 0.1]} p={[0, 0.62, -0.28]} v={0.1} r={0.012} col="#1c1a16" op={0.8} />
</>}</W3>;

export const HJug: C = ({ t, h }) => <W3 t={t} h={h} mode="split" wall="plaster" cam={{ at: [0.3, 0.46, 0], az: [-0.26, 0.2], el: [0.08, 0.12], r: [2.5, 2.2], fov: 32 }}>{(tt) => { const g = eio(tt, 0.5, 2), f = eio(tt, 1.3, 4); return <>
  <Jug s={2.2} p={[0, 0, 0]} ghost={g} />
  <Slab s={[0.5, Math.max(0.01, 0.62 * f), 0.32]} p={[0, 0.03 + 0.31 * f, 0]} col="#7fc0e0" op={0.8} />
  <Slab s={[0.5, 0.05, 0.32]} p={[0, 0.03 + 0.64 * f, 0]} col="#f2d24a" op={f} />
  <Tape txt="MOSTLY WATER" col="#1c2a3a" p={[0.92, 0.3, 0.1]} w={0.56} k={K(tt, 3.4)} rev={R(tt, 3.4)} />
  <Tape txt="THE ACTIVE PART" col="#b3261e" p={[0.92, 0.72, 0.1]} w={0.62} k={K(tt, 4.5)} rev={R(tt, 4.5)} />
</>; }}</W3>;

// 14:27 · NUNCA JUNTAS: una compuerta cae entre las botellas
export const HGate: C = ({ t, h }) => <W3 t={t} h={h} mode="drop" wall="brick" cam={{ at: [0, 0.42, 0], az: [0.16, -0.12], el: [0.09, 0.12], r: [1.9, 1.62], fov: 32 }}>{(tt) => { const f = (s: number) => s * eio(tt, 0.4, 1.8) * 0.28, d = phys(tt, 2, 9, 0.35); return <>
  <Jug s={1.2} p={[-0.74 + f(1), 0, 0]} /><Jug s={1.2} p={[0.74 - f(1), 0, 0]} col="#d7c15a" />
  <Slab s={[0.05, 1, 0.5]} p={[0, lerp(1.7, 0.5, d), 0]} col="#7a7770" />
  <Tape txt="BLEACH" p={[-0.5, 0.56, 0.12]} w={0.28} /><Tape txt="AMMONIA" p={[0.5, 0.56, 0.12]} w={0.32} />
  <Tape txt="NEVER" col="#b3261e" p={[0, 0.6, 0.3]} w={0.34} k={K(tt, 2.4)} rev={R(tt, 2.4)} />
</>; }}</W3>;

// 14:50 · LO QUE NO SE VE: arriba se aclara; el agua baja a las raíces
export const HDrywall: C = ({ t, h }) => <W3 t={t} h={h} mode="wipe" floor="wood" wall="brick" bg="#10130f" cam={{ at: [0, 0.58, 0], az: [0.2, -0.14], el: [0.04, 0.1], r: [2.3, 2.1], fov: 30 }}>{(tt) => { const f = eio(tt, 0.7, 1.7), w = eio(tt, 1, 2.4); return <>
  <Slab s={[1.6, 0.1, 0.5]} p={[0, 0.82, 0]} col={f > 0.5 ? "#efeadd" : "#26231f"} />
  <Slab s={[1.6, 0.6, 0.5]} p={[0, 0.45, 0]} col="#d9d3c2" />
  <Slab s={[1.3, Math.max(0.01, 0.5 * w), 0.51]} p={[0, 0.76 - 0.25 * w, 0]} col="#4f91c7" op={0.75} />
  <Patch p={[0, 0.52, 0.262]} w={0.8} seed={44} op={1 - f} />
  {[-0.45, -0.15, 0.15, 0.45].map((x, i) => <Slab key={i} s={[0.03, 0.42 * cl(w * 1.2), 0.52]} p={[x, 0.72 - 0.21 * cl(w * 1.2), 0]} col="#17140f" />)}
  <Tape txt="BLEACH: LOOKS CLEAN" p={[0, 0.98, 0.3]} w={0.7} k={K(tt, 1.4)} rev={R(tt, 1.4)} />
  <Tape txt="ROOTS STILL WET" col="#b3261e" p={[0, 0.24, 0.3]} w={0.62} k={K(tt, 2.2)} rev={R(tt, 2.2)} />
</>; }}</W3>;

// 15:48 · EL LUGAR DE LA LEJÍA: entra en el gancho de azulejo, cae del gancho de yeso
const Hook: React.FC<{ x: number }> = ({ x }) => <mesh position={[x, 0.94, -0.42]} rotation={[0, 0, PI]}><torusGeometry args={[0.05, 0.011, 10, 24, PI]} />{M.steel()}</mesh>;
export const HRack: C = ({ t, h }) => <W3 t={t} h={h} mode="iris" wall="brick" cam={{ at: [0, 0.52, -0.2], az: [-0.2, 0.14], el: [0.04, 0.08], r: [2.2, 2.04], fov: 32 }}>{(tt) => { const d = eio(tt, 2.4, 3.3), y = 0.42 - d * 0.42, z = -0.34 + d * 0.08; return <>
  <Slab s={[0.9, 0.7, 0.02]} p={[-0.48, 0.74, -0.46]} col="#e8e4d8" /><Slab s={[0.9, 0.7, 0.02]} p={[0.48, 0.74, -0.46]} col="#c9c3b2" />
  <Hook x={-0.48} /><Hook x={0.48} />
  <Jug s={1} p={[-0.48, 0.42, -0.34]} /><mesh position={[-0.48, 0.895, -0.4]}><torusGeometry args={[0.04, 0.008, 8, 22]} />{M.plastic({ col: "#2f6fa8" })}</mesh>
  <Jug s={1} p={[0.48, y, z]} /><mesh position={[0.48, y + 0.475, z - 0.06 * (1 - d)]}><torusGeometry args={[0.04, 0.008, 8, 22]} />{M.plastic({ col: "#2f6fa8" })}</mesh>
  <Tape txt="TILE" col="#1b6e43" p={[-0.48, 1.03, -0.42]} w={0.22} /><Tape txt="DRYWALL" col="#b3261e" p={[0.48, 1.03, -0.42]} w={0.34} />
  {tt > 3.3 && <Word txt="X" p={[0.48, 0.66, -0.3]} w={0.34} col="#d3362b" k={K(tt, 3.3)} />}
</>; }}</W3>;

export const HHand = Hand;
