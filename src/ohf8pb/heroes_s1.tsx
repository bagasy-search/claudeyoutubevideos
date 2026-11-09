// ohf8pb · componentes 1-17: el dedo, las causas, los 4 daños, la prueba, los materiales, la limpieza y el agua
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { FlowPath, Hand, Tape } from "./okit";
import { Board, Boot, CONC, Conc, Hammer, PI, Rule, Slab, Wedge, Y0, Yard } from "./slabkit";

type P = { t: number; h: H };
const SEC = { at: [0, 0.52, 0], az: [-0.14, 0.12], el: [0.07, 0.11], r: [2.05, 1.92], fov: 32 };
const SKY = { floor: "none" as const, wall: "none" as const, bg: "#b9cbd8", key1: [-1.4, 3, 2.6] };
const Crack: React.FC<{ a: number[]; b: number[]; w?: number; y?: number }> = ({ a, b, w = 0.012, y = Y0 + 0.024 }) => { const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz); return <RBox s={[l, 0.002, w]} p={[(a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2]} rot={[0, -Math.atan2(dz, dx), 0]} r={0.0005} shadow={false}><meshBasicMaterial color="#1b1916" /></RBox>; };

// 0:40 · EL DEDO: la bota da contra el escalón; la rampa nace; la bota pasa
export const HToeInch: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...SKY} cam={SEC}>{(tt) => {
  const r = eio(tt, 2.9, 4.1), hit = tt < 2.2 ? lerp(-0.95, -0.24, eio(tt, 0.3, 2.0)) : lerp(-0.24, -0.34, cl((tt - 2.2) * 2)), x = tt < 4.2 ? hit : lerp(-0.34, 0.75, eio(tt, 4.2, 6.2)), lift = tt > 4.2 ? 0.075 * cl((x + 0.34) / 0.75) : 0.0;
  return <><Yard />
    <Slab w={1.5} p={[-0.8, Y0 - 0.08, 0.03]} k="a" />
    <Slab w={1.5} p={[0.76, Y0 - 0.0, 0.03]} k="b" />
    <Wedge l={0.72 * cl(r + 0.001)} h0={0.0008} h1={0.078 * r} p={[-0.73 + 0.72 * (1 - r), Y0 + 0.02, 0.03]} />
    <Boot p={[x, Y0 + 0.02 + lift, 0.03]} rot={[0, 0, tt < 2.3 ? 0 : tt < 4 ? 0.16 * (1 - cl((tt - 3.6) * 2)) : 0]} s={0.86} />
    <Tape txt="ONE INCH" col="#b3261e" p={[0.05, Y0 + 0.38, 0.2]} w={0.3} k={phys(tt, 1.4, 8, 0.45)} rev={cl(tt - 1.4)} />
    <Tape txt="NOTHING TO FIND" col="#1f7a3a" p={[-0.3, Y0 + 0.5, 0.2]} w={0.5} k={phys(tt, 5.2, 8, 0.45)} rev={cl((tt - 5.2) / 0.5)} />
  </>;
}}</Scene3D>;

// 1:40 · CUÁL DE LOS CUATRO: cuatro baldosas de vereda se levantan de a una, cada una con su daño
export const HFour: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...SKY} cam={{ at: [0, Y0 + 0.02, 0.12], az: [-0.12, 0.1], el: [0.84, 0.92], r: [3.2, 3.05], fov: 32 }}>{(tt) => {
  const xs = [-1.05, -0.35, 0.35, 1.05], lb = ["HAIRLINE", "OPEN CRACK", "HIGH SIDE", "BROKEN EDGE"];
  return <><Yard cut={false} />
    {xs.map((x, i) => { const k = phys(tt, 0.7 + i * 0.75, 7, 0.5), y = Y0 + 0.02 + 0.13 * cl(k), tl = 0.26 * cl(k); return <group key={i} position={[x, y, 0.02]} rotation={[tl, 0, 0]}>
      {i === 2 ? <><Slab w={0.3} d={0.9} p={[-0.16, 0, 0]} k="c" h={0.08} /><Slab w={0.3} d={0.9} p={[0.16, 0.036, 0]} k="d" h={0.08} /></> : i === 3 ? <><Slab w={0.62} d={0.72} p={[0, 0, 0.09]} k="e" h={0.08} />{[[0.14, -0.33], [-0.1, -0.35], [0.26, -0.28], [-0.25, -0.31]].map(([a, b], j) => <RBox key={j} s={[0.08 + j * 0.018, 0.06, 0.05 + j * 0.014]} p={[a, -0.012, b]} rot={[0.2 * j, j, 0.3]} r={0.014}><Conc k="r" /></RBox>)}</> : <Slab w={0.62} d={0.9} p={[0, 0, 0]} k={"fg"[i]} h={0.08} />}
      {i === 0 && <><Crack a={[-0.28, -0.1]} b={[0.02, 0.1]} w={0.004} y={0.042} /><Crack a={[0.02, 0.1]} b={[0.27, 0.05]} w={0.004} y={0.042} /></>}
      {i === 1 && <><Crack a={[-0.3, 0.2]} b={[-0.06, -0.06]} w={0.034} y={0.042} /><Crack a={[-0.06, -0.06]} b={[0.3, -0.22]} w={0.034} y={0.042} /></>}
      <Tape txt={lb[i]} col={i === 0 ? "#1f7a3a" : "#b3261e"} p={[0, 0.06, 0.34]} rot={[-PI / 2 + 0.2, 0, 0]} w={0.46} k={cl(k)} rev={cl(k)} />
      <Tape txt={String(i + 1)} p={[-0.2, 0.06, -0.3]} rot={[-PI / 2 + 0.2, 0, 0]} w={0.11} k={cl(k)} rev={1} />
    </group>; })}
  </>;
}}</Scene3D>;

// 2:30 · APRETADO SÍ, DOBLADO NO: una rueda aplasta y no pasa nada; se va la tierra y la losa se parte al medio
export const HBend: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...SKY} cam={SEC}>{(tt) => {
  const drop = eio(tt, 3.4, 4.3), snap = cl((tt - 4.9) * 4), rot = 0.012 * drop + 0.13 * snap, wx = lerp(-1.4, 0.0, eio(tt, 0.3, 1.8)), wy = Y0 + 0.32 - 0.006 * cl(tt - 1.8) - 0.1 * snap;
  return <><Yard />
    <mesh position={[0, Y0 - 0.32, 0.36]}><planeGeometry args={[1.1 * drop + 0.001, 0.26 * drop + 0.001]} /><meshBasicMaterial color="#3a2617" toneMapped={false} /></mesh>
    <group position={[-0.8, Y0 - 0.08, 0.03]}><group position={[0.8, 0, 0]} rotation={[0, 0, -rot]}><Slab w={0.8} p={[-0.4, 0, 0]} k="a" /></group></group>
    <group position={[0.8, Y0 - 0.08, 0.03]}><group position={[-0.8, 0, 0]} rotation={[0, 0, rot]}><Slab w={0.8} p={[0.4, 0, 0]} k="a" /></group></group>
    <Slab w={0.8} p={[-1.3, Y0 - 0.08, 0.03]} k="b" /><Slab w={0.8} p={[1.3, Y0 - 0.08, 0.03]} k="b" />
    <group position={[wx, wy, 0.03]} rotation={[0, 0, -wx * 2.6]}><mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.2, 40]} /><meshStandardMaterial color="#1b1b1c" roughness={0.8} /></mesh><mesh position={[0, 0, 0.102]}><circleGeometry args={[0.15, 32]} />{M.steel({ col: "#a9afb3" })}</mesh>{[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[0.1 * Math.cos(i * 1.256), 0.1 * Math.sin(i * 1.256), 0.106]}><circleGeometry args={[0.018, 12]} /><meshBasicMaterial color="#3a3d40" /></mesh>)}</group>
    <Tape txt="SQUEEZED: FINE" col="#1f7a3a" p={[-0.5, Y0 + 0.74, 0.2]} w={0.5} k={phys(tt, 2.0, 8, 0.45)} rev={cl((tt - 2) * 2)} />
    <Tape txt="BENT: BROKEN" col="#b3261e" p={[0.34, Y0 + 0.44, 0.2]} w={0.46} k={phys(tt, 5.0, 8, 0.45)} rev={cl((tt - 5) * 2)} />
  </>;
}}</Scene3D>;

// 3:20 · COMO UNA CARTA: entra el agua, se hace hielo, levanta la losa; se derrite y baja torcida; cuenta sesenta inviernos
export const HCard: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="blinds" {...SKY} cam={SEC}>{(tt) => {
  const ice = eio(tt, 2.0, 3.6) * (1 - eio(tt, 4.9, 6.0)), water = cl((tt - 0.5) * 1.1) * (1 - eio(tt, 2.0, 2.6)), lift = 0.17 * ice, kept = 0.02 * eio(tt, 4.9, 6.0), y = Y0 - 0.08 + lift + kept;
  const n = Math.round(lerp(1, 60, eio(tt, 5.7, 7.5)));
  return <><Yard />
    <RBox s={[1.1, Math.max(0.004, 0.02 + lift * 0.96), 0.02]} p={[0.08, Y0 - 0.18 + (0.02 + lift * 0.96) / 2 - 0.01, 0.34]} r={0.002} shadow={false}><meshPhysicalMaterial color="#d3ecfb" roughness={0.12} clearcoat={1} transparent opacity={0.92} /></RBox>
    <FlowPath tt={tt} pts={[[-1.2, Y0 + 0.03, 0.36], [-0.78, Y0 - 0.1, 0.36], [-0.6, Y0 - 0.18, 0.36], [0.6, Y0 - 0.18, 0.36]]} n={18} k={water} r={0.02} v={0.5} col="#6ab2e4" />
    <Slab w={0.76} p={[-1.0, Y0 - 0.08, 0.03]} k="a" />
    <Slab w={1.32} p={[0.08, y, 0.03]} rot={[0, 0, 0.09 * ice + 0.016 * eio(tt, 4.9, 6.0)]} k="b" />
    <Slab w={0.76} p={[1.14, Y0 - 0.08, 0.03]} k="c" />
    <group position={[0.08, Y0 + 0.2 + lift * 1.15, 0.28]} rotation={[0, 0, 0.09 * ice]}><RBox s={[0.28, 0.4, 0.004]} p={[0, 0.2, 0]} r={0.008}><meshStandardMaterial color="#f5f1e6" roughness={0.45} /></RBox><RBox s={[0.1, 0.13, 0.003]} p={[0, 0.2, 0.004]} r={0.002} shadow={false}><meshBasicMaterial color="#b3261e" /></RBox></group>
    <Tape txt="ICE LIFTS IT" col="#1f5ea8" p={[-0.58, Y0 + 0.42, 0.2]} w={0.4} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) * 2)} />
    <Tape txt={`${n} WINTERS`} col="#b3261e" p={[0.52, Y0 + 0.38, 0.2]} w={0.42} k={phys(tt, 5.6, 8, 0.45)} rev={cl((tt - 5.6) * 2)} />
  </>;
}}</Scene3D>;

// 4:05 · EL GATO DE AUTO: engorda la raíz y empuja la losa; a la par, un gato real sube una losa igual
const Jack: React.FC<{ p: number[]; h: number }> = ({ p, h }) => { const w = 0.46, l = Math.hypot(w / 2, h / 2), a = Math.atan2(h / 2, w / 2); return <group position={p as [number, number, number]}>
  <RBox s={[0.52, 0.03, 0.18]} p={[0, 0.015, 0]} r={0.006}>{M.steel({ col: "#a33527" })}</RBox>
  {[[-1, 1], [1, 1]].map(([s], i) => <group key={i}><RBox s={[l, 0.03, 0.06]} p={[s * w / 4, h / 4 + 0.03, 0]} rot={[0, 0, s * a]} r={0.006}>{M.steel({ col: "#b43a2b" })}</RBox><RBox s={[l, 0.03, 0.06]} p={[s * w / 4, (3 * h) / 4 + 0.03, 0]} rot={[0, 0, -s * a]} r={0.006}>{M.steel({ col: "#b43a2b" })}</RBox></group>)}
  <mesh position={[0, h / 2 + 0.03, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, w + 0.3, 12]} />{M.steel({ col: "#c8ccd0" })}</mesh>
  <RBox s={[0.16, 0.03, 0.16]} p={[0, h + 0.045, 0]} r={0.006}>{M.steel({ col: "#a33527" })}</RBox>
</group>; };
export const HJack: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" {...SKY} cam={{ ...SEC, at: [0.1, 0.78, 0], r: [2.85, 2.72] }}>{(tt) => {
  const g = eio(tt, 0.7, 4.8), R = lerp(0.03, 0.17, g), lift = 0.19 * g, tilt = 0.14 * g;
  return <><Yard />
    <mesh position={[-0.42, Y0 - 0.34 + R * 0.3, 0.34]} rotation={[0, 0.0, 0]}><cylinderGeometry args={[R, R, 0.1, 30]} /><meshStandardMaterial color="#6d4a2e" roughness={0.85} /></mesh>
    <mesh position={[-0.42, Y0 - 0.34 + R * 0.3, 0.4]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[R, R, 0.1, 30]} /><meshStandardMaterial color="#7c5835" roughness={0.85} /></mesh>
    <group position={[-0.95, Y0 - 0.08, 0.03]} rotation={[0, 0, tilt * 0.7]}><Slab w={1.2} p={[0.55, 0.0, 0]} k="a" /></group>
    <Slab w={0.5} p={[-1.4, Y0 - 0.08, 0.03]} k="b" />
    <Jack p={[0.88, Y0 + 0.02, 0.03]} h={0.1 + 0.3 * g} />
    <Slab w={0.6} p={[0.88, Y0 + 0.02 + 0.1 + 0.3 * g + 0.17, 0.03]} d={0.5} h={0.14} k="c" />
    <Tape txt="ROOT" col="#b3261e" p={[-0.42, Y0 - 0.1, 0.46]} w={0.2} k={phys(tt, 1.0, 8, 0.45)} rev={cl(tt - 1)} />
    <Tape txt="LIKE A CAR JACK" col="#1c2a3a" p={[0.46, Y0 + 0.88, 0.2]} w={0.5} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) * 2)} />
  </>;
}}</Scene3D>;

// 4:30 · SIN SUELO: cada lluvia lleva tierra; la punta queda en el aire; pisa y se quiebra
export const HWashout: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...SKY} cam={SEC}>{(tt) => {
  const e = eio(tt, 0.5, 4.6), snap = cl((tt - 5.3) * 5), rot = 0.2 * snap;
  return <><Yard />
    <mesh position={[0.82, Y0 - 0.33 - 0.17 * (1 - e) + 0.0, 0.36]}><planeGeometry args={[1.2, Math.max(0.002, 0.44 * e)]} /><meshBasicMaterial color="#22170f" toneMapped={false} /></mesh>
    <FlowPath tt={tt} pts={[[1.22, Y0 + 0.4, 0.37], [1.18, Y0 + 0.02, 0.37], [0.9, Y0 - 0.24, 0.37], [0.4, Y0 - 0.36, 0.37], [-0.4, Y0 - 0.45, 0.37]]} n={22} k={cl(tt * 0.9)} r={0.017} v={0.55} col="#7db8df" />
    <FlowPath tt={tt + 0.5} pts={[[0.6, Y0 - 0.24, 0.372], [0.1, Y0 - 0.4, 0.372], [-0.7, Y0 - 0.48, 0.372]]} n={12} k={e} r={0.012} v={0.3} col="#8a6a48" />
    <Slab w={0.6} p={[-0.95, Y0 - 0.08, 0.03]} k="a" />
    <group position={[-0.65, Y0 - 0.08, 0.03]}><group position={[0.7, 0, 0]} rotation={[0, 0, -rot]}><Slab w={0.7} p={[0.35, 0, 0]} k="b" /></group><Slab w={0.7} p={[0.35, 0, 0]} k="b" /></group>
    <RBox s={[0.13, 1.1, 0.1]} p={[1.28, Y0 + 0.95, 0.15]} r={0.015}>{M.steel({ col: "#cfd2cc" })}</RBox>
    <Boot p={[0.42, Y0 + 0.02 - 0.2 * snap + lerp(0.6, 0, eio(tt, 4.4, 5.3)), 0.03]} s={0.8} />
    <Tape txt="SITTING ON NOTHING" col="#b3261e" p={[-0.5, Y0 + 0.48, 0.2]} w={0.6} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) * 2)} />
  </>;
}}</Scene3D>;

// 5:05 · MITAD DEL TRABAJO: el caño vuelca sobre la losa; la extensión gira y el agua se va al jardín
export const HExtension: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...SKY} cam={{ at: [0.1, Y0 + 0.1, -0.35], az: [-0.5, -0.15], el: [0.42, 0.34], r: [2.6, 2.46], fov: 32 }}>{(tt) => {
  const a = eio(tt, 2.1, 3.5), r = lerp(0.1, -1.05, a);
  return <><Yard cut={false} />
    <Slab w={3.6} d={0.9} p={[0, Y0 - 0.08, 0.5]} k="a" />
    <mesh position={[0, Y0 + 1.2, -1.1]}><planeGeometry args={[6, 2.4]} /><meshStandardMaterial map={undefined} color="#d9d2c0" roughness={0.85} /></mesh>
    <RBox s={[0.12, 1.5, 0.09]} p={[-0.7, Y0 + 0.82, -0.98]} r={0.015}>{M.steel({ col: "#c8cbc4" })}</RBox>
    <group position={[-0.7, Y0 + 0.08, -0.92]} rotation={[0, r, 0]}><RBox s={[0.12, 0.09, 1.3]} p={[0, 0, 0.62]} rot={[0.06, 0, 0]} r={0.015}>{M.steel({ col: "#c8cbc4" })}</RBox></group>
    <FlowPath tt={tt} pts={[[-0.7, Y0 + 0.08, -0.5], [-0.7, Y0 + 0.04, 0], [-0.7, Y0 + 0.03, 0.4], [-0.9, Y0 + 0.03, 0.8]]} n={18} k={1 - a} r={0.026} v={0.6} col="#7db8df" />
    <FlowPath tt={tt} pts={[[-0.7, Y0 + 0.08, -0.92], [0.0, Y0 + 0.06, -0.45], [0.7, Y0 + 0.04, -0.2], [1.7, Y0 + 0.02, -0.1]]} n={18} k={a} r={0.026} v={0.6} col="#7db8df" />
    <Tape txt="HALF THE PROBLEM" col="#1f7a3a" p={[0.7, Y0 + 0.42, -0.1]} w={0.56} k={phys(tt, 3.8, 8, 0.45)} rev={cl((tt - 3.8) * 2)} />
  </>;
}}</Scene3D>;

// 5:55 · NI SE SIENTE: una silla de ruedas cruza la junta y la línea que dibuja su eje queda plana
export const HWheel: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...SKY} cam={{ at: [0, 0.6, 0], az: [-0.18, 0.1], el: [0.05, 0.1], r: [2.1, 1.98], fov: 32 }}>{(tt) => {
  const x = lerp(-1.25, 1.15, eio(tt, 0.5, 5.4)), R = 0.26, fh = (u: number) => u < -0.52 ? 0 : u > 0.26 ? 0.078 : 0.078 * ((u + 0.52) / 0.78), wy = Y0 + 0.02 + R + fh(x), N = 26, trace = Array.from({ length: N }, (_, i) => -1.25 + (i * (x + 1.25)) / (N - 1));
  return <><Yard />
    <Slab w={1.6} p={[-0.95, Y0 - 0.08, 0.03]} k="a" /><Slab w={1.5} p={[0.8, Y0 - 0.0, 0.03]} k="b" />
    <Wedge l={0.78} h0={0.0008} h1={0.078} p={[-0.52, Y0 + 0.02, 0.03]} />
    <group position={[x, wy, 0.2]} rotation={[0, 0, -x / R]}><mesh castShadow><torusGeometry args={[R - 0.03, 0.03, 16, 60]} /><meshStandardMaterial color="#1c1c1e" roughness={0.75} /></mesh>{Array.from({ length: 8 }, (_, i) => <RBox key={i} s={[R * 2 - 0.04, 0.005, 0.005]} rot={[0, 0, (i * PI) / 8]} r={0.001}>{M.steel({ col: "#c7ccd0" })}</RBox>)}<mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.04, 20]} />{M.steel({ col: "#7d8388" })}</mesh></group>
    {trace.map((u, i) => <mesh key={i} position={[u, Y0 + 0.02 + R + fh(u), 0.26]}><sphereGeometry args={[0.009, 10, 8]} /><meshBasicMaterial color="#1f7a3a" toneMapped={false} /></mesh>)}
    <Tape txt="NEVER FEEL IT" col="#1f7a3a" p={[0.1, Y0 + 0.82, 0.16]} w={0.46} k={phys(tt, 4.4, 8, 0.45)} rev={cl((tt - 4.4) * 2)} />
  </>;
}}</Scene3D>;

// 7:15 · LA REGLA DICE QUÉ TRABAJO ES: reglón sobre el lado alto, regla en el hueco y tres zonas que se encienden
export const HStraight: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" {...SKY} cam={{ at: [-0.08, Y0 + 0.17, 0.2], az: [-0.32, -0.08], el: [0.1, 0.13], r: [1.15, 1.07], fov: 30 }}>{(tt) => {
  const b = phys(tt, 0.5, 8, 0.45), r = eio(tt, 1.5, 2.3), zs = [["FEATHER IT", "#3b8f55", 2.4], ["LAYERS", "#c98a23", 3.2], ["OTHER JOB", "#b3261e", 4.0]] as [string, string, number][];
  return <><Yard />
    <Slab w={1.4} p={[-0.9, Y0 - 0.16, 0.03]} k="a" /><Slab w={1.6} p={[0.8, Y0 - 0.0, 0.03]} k="b" />
    <Board l={1.45} p={[0.1 - 0.12 * (1 - cl(b)), Y0 + 0.02 + 0.08 / 2 + 0.25 * (1 - cl(b)), 0.08]} />
    <group position={[-0.32, Y0 - 0.06 + 0.33 * r - 0.33, 0.1]}><RBox s={[0.04, 0.7, 0.006]} p={[0, 0.34, 0]} r={0.001}><meshStandardMaterial color="#efe6c8" roughness={0.45} /></RBox>{Array.from({ length: 13 }, (_, i) => <RBox key={i} s={[i % 4 === 0 ? 0.03 : 0.016, 0.002, 0.002]} p={[-0.006, 0.02 + i * 0.052, 0.004]} r={0.0005} shadow={false}><meshBasicMaterial color="#141414" /></RBox>)}</group>
    {zs.map(([x, c, at], i) => { const k = cl((tt - at) * 2.5); return <group key={i}><RBox s={[0.018, 0.1, 0.004]} p={[-0.286, Y0 - 0.03 + 0.11 * i, 0.105]} r={0.001} shadow={false}><meshBasicMaterial color={k > 0 ? c : "#c7bfa4"} toneMapped={false} /></RBox><Tape txt={x} col={c} p={[0.02 + i * 0.01, Y0 + 0.27 + 0.13 * i, 0.26]} w={0.36} k={phys(tt, at, 8, 0.45)} rev={k} /></group>; })}
  </>;
}}</Scene3D>;

// 8:40 · SUENA O NO SUENA: el martillo golpea; a la izquierda rebota con ondas limpias, a la derecha se muere
const Ring: React.FC<{ p: number[]; k: number; col: string }> = ({ p, k, col }) => k <= 0 || k >= 1 ? null : <mesh position={p as [number, number, number]} rotation={[PI / 2, 0, 0]} scale={0.04 + 0.5 * k}><torusGeometry args={[1, 0.018 / (0.04 + 0.5 * k), 8, 64]} /><meshBasicMaterial color={col} transparent opacity={1 - k} toneMapped={false} depthWrite={false} /></mesh>;
export const HRing: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...SKY} cam={{ at: [0, Y0 + 0.14, 0.05], az: [-0.1, 0.1], el: [0.32, 0.36], r: [1.9, 1.78], fov: 32 }}>{(tt) => {
  const TL = [0.9, 1.7, 2.5], TR = [4.2, 5.0, 5.8];
  const pose = (T: number[]) => { let a = 0.75, y = 0.3; for (const s of T) { const u = tt - s; if (u > -0.2 && u < 0.5) { a = u < 0 ? lerp(0.75, 0.05, (u + 0.2) / 0.2) : lerp(0.05, 0.75, cl(u / 0.3)); y = u < 0 ? lerp(0.3, 0.09, (u + 0.2) / 0.2) : lerp(0.09, 0.3, cl(u / 0.3)); } } return { a, y }; };
  const L = pose(TL), R = (() => { let a = 0.75, y = 0.3; for (const s of TR) { const u = tt - s; if (u > -0.2 && u < 0.7) { a = u < 0 ? lerp(0.75, 0.05, (u + 0.2) / 0.2) : u < 0.5 ? 0.05 : lerp(0.05, 0.75, (u - 0.5) / 0.2); y = u < 0 ? lerp(0.3, 0.09, (u + 0.2) / 0.2) : u < 0.5 ? 0.09 : lerp(0.09, 0.3, (u - 0.5) / 0.2); } } return { a, y }; })();
  return <><Yard cut={false} />
    <Slab w={1.2} d={1} p={[-0.66, Y0 - 0.08, 0.03]} k="a" col={CONC.clean} /><Slab w={1.2} d={1} p={[0.66, Y0 - 0.08, 0.03]} k="b" col={CONC.dark} />
    <Hammer p={[-0.66, Y0 + L.y, 0.03]} rot={[0, 0, -L.a]} />
    <Hammer p={[0.66, Y0 + R.y, 0.03]} rot={[0, 0, R.a]} />
    {TL.flatMap((s) => [0, 0.14, 0.28].map((d) => <Ring key={s + "" + d} p={[-0.66, Y0 + 0.03, 0.03]} k={(tt - s - d) / 0.8} col="#2d7d4a" />))}
    {TR.map((s) => <Ring key={s} p={[0.66, Y0 + 0.03, 0.03]} k={(tt - s) / 2.4 + 0.86} col="#8a4a34" />)}
    <Tape txt="RINGS: GOOD" col="#1f7a3a" p={[-0.56, Y0 + 0.2, 0.46]} rot={[-1.0, 0, 0]} w={0.42} k={phys(tt, 2.9, 8, 0.45)} rev={cl((tt - 2.9) * 2)} />
    <Tape txt="THUDS: BAD" col="#b3261e" p={[0.56, Y0 + 0.2, 0.46]} rot={[-1.0, 0, 0]} w={0.42} k={phys(tt, 6.1, 8, 0.45)} rev={cl((tt - 6.1) * 2)} />
  </>;
}}</Scene3D>;

// 9:30 · ¿SE MUEVE?: el peso va de un pie al otro y la losa cabecea sobre su punto
export const HRockSlab: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...SKY} cam={SEC}>{(tt) => {
  const w = Math.sin(tt * 2.4) * eio(tt, 0.7, 1.7), r = -0.05 * w, gap = 0.012 + 0.02 * Math.abs(w);
  return <><Yard />
    <mesh position={[0, Y0 - 0.2 - gap / 2, 0.36]}><planeGeometry args={[1.3, gap * 2]} /><meshBasicMaterial color="#1b130c" toneMapped={false} /></mesh>
    <Slab w={0.7} p={[-1.1, Y0 - 0.08, 0.03]} k="a" /><Slab w={0.7} p={[1.1, Y0 - 0.08, 0.03]} k="b" />
    <group position={[0, Y0 - 0.08, 0.03]} rotation={[0, 0, r]}>
      <Slab w={1.4} p={[0, 0, 0]} k="c" />
      <group position={[-0.22, 0.1, 0]}><Boot p={[-0.16, 0, 0]} s={0.82} rot={[0, 0, 0.0]} /><Boot p={[0.42, 0, -0.03]} s={0.82} /></group>
    </group>
    <mesh position={[0, Y0 - 0.26, 0.355]} rotation={[0, 0, PI / 4]}><planeGeometry args={[0.06, 0.06]} /><meshBasicMaterial color="#c9b98f" /></mesh>
    <Tape txt="DOES IT CLUNK?" col="#b3261e" p={[0, Y0 + 0.98, 0.14]} w={0.46} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) * 2)} />
  </>;
}}</Scene3D>;

// 10:15 · EL PLATO: un plato cae y se raja igual que la losa de atrás: ésa se saca
export const HPlate: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...SKY} cam={{ at: [0, Y0 + 0.08, 0.1], az: [-0.2, 0.08], el: [0.62, 0.72], r: [2.0, 1.9], fov: 32 }}>{(tt) => {
  const hit = 1.5, y = tt < hit ? lerp(1.5, 0.04, Math.pow(cl(tt / hit), 2)) : 0.04, sp = cl((tt - hit) * 5), N = 8;
  const fr = 0.34, C0: [number, number] = [-0.6, 0.04], radial = Array.from({ length: 8 }, (_, i) => { const a = (i * 2 * PI) / 8 + rn(i, 51) * 0.5, m = 0.2 + rn(i, 52) * 0.1, e = 0.44 + rn(i, 53) * 0.12, a2 = a + (rn(i, 54) - 0.5) * 0.7; return [[C0[0] + Math.cos(a) * 0.03, C0[1] + Math.sin(a) * 0.03], [C0[0] + Math.cos(a) * m, C0[1] + Math.sin(a) * m], [C0[0] + Math.cos(a2) * e, C0[1] + Math.sin(a2) * e]]; });
  return <><Yard cut={false} />
    <Slab w={1.1} d={1.1} p={[-0.65, Y0 - 0.08, 0]} k="a" />
    {radial.flatMap(([p0, p1, p2], i) => { const k = cl((tt - hit - i * 0.04) * 6), k2 = cl((tt - hit - i * 0.04 - 0.14) * 6); return [<Crack key={"a" + i} a={p0 as [number, number]} b={[lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k)]} w={0.022} />, <Crack key={"b" + i} a={p1 as [number, number]} b={[lerp(p1[0], p2[0], k2), lerp(p1[1], p2[1], k2)]} w={0.014} />]; })}
    <group position={[0.65, Y0 + y, 0]}>{Array.from({ length: N }, (_, i) => { const a = ((i + 0.5) * 2 * PI) / N, d = sp * (0.05 + rn(i, 41) * 0.14); return <group key={i} position={[Math.cos(a) * d, 0, Math.sin(a) * d]}><mesh rotation={[0, PI / 2 - a - PI / N, 0]}><cylinderGeometry args={[fr, fr * 0.72, 0.03, 12, 1, false, 0, (2 * PI) / N * 0.985]} /><meshStandardMaterial color="#d7d1c2" roughness={0.5} /></mesh></group>; })}</group>
    <Tape txt="DROPPED PLATE" col="#1c2a3a" p={[0.55, Y0 + 0.1, 0.5]} rot={[-1.1, 0, 0]} w={0.42} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) * 2)} />
    <Tape txt="TAKE THAT ONE OUT" col="#b3261e" p={[-0.5, Y0 + 0.1, 0.56]} rot={[-1.1, 0, 0]} w={0.5} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) * 2)} />
  </>;
}}</Scene3D>;

// 11:10 · LA RESINA AGARRA: un parche con hilos de resina se ancla; el de mezcla común se despega solo
export const HResin: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="blinds" {...SKY} cam={{ at: [0, Y0 + 0.05, 0.2], az: [-0.14, 0.1], el: [0.08, 0.1], r: [1.45, 1.35], fov: 30 }}>{(tt) => {
  const d = eio(tt, 0.4, 1.2), pull = eio(tt, 2.6, 4.3), liftR = 0.16 * pull + 0.02 * Math.sin(tt * 5) * pull, g = eio(tt, 1.2, 2.5);
  const Strands = (x0: number) => Array.from({ length: 22 }, (_, i) => { const x = x0 - 0.42 + (i * 0.84) / 21 + (rn(i, 51) - 0.5) * 0.02, l = (0.06 + rn(i, 52) * 0.08) * g; return <RBox key={i} s={[0.006, Math.max(0.002, l), 0.006]} p={[x, Y0 - 0.0 - l / 2 + 0.03, 0.37]} rot={[0, 0, (rn(i, 53) - 0.5) * 0.5]} r={0.001} shadow={false}><meshBasicMaterial color="#d6a14a" toneMapped={false} /></RBox>; });
  return <><Yard />
    <Slab w={1.2} p={[-0.68, Y0 - 0.08, 0.03]} k="a" /><Slab w={1.2} p={[0.68, Y0 - 0.08, 0.03]} k="a" />
    {Strands(-0.68)}
    <RBox s={[0.96, 0.08, 0.66]} p={[-0.68, Y0 + lerp(0.5, 0.06, d), 0.03]} r={0.012}><Conc col="#c0bdb3" k="p" /></RBox>
    <RBox s={[0.96, 0.08, 0.66]} p={[0.68, Y0 + lerp(0.5, 0.06, d) + liftR, 0.03]} rot={[0, 0, 0.05 * pull]} r={0.012}><Conc col="#a8a59a" k="q" /></RBox>
    <Tape txt="RESIN HOLDS" col="#1f7a3a" p={[-0.42, Y0 + 0.28, 0.2]} w={0.34} k={phys(tt, 2.5, 8, 0.45)} rev={cl((tt - 2.5) * 2)} />
    <Tape txt="PLAIN MIX LETS GO" col="#b3261e" p={[0.38, Y0 + 0.36, 0.2]} w={0.42} k={phys(tt, 4.2, 8, 0.45)} rev={cl((tt - 4.2) * 2)} />
  </>;
}}</Scene3D>;

// 12:50 · LA PIEL: el mortero prende en la mugre; la mugre suelta y sale todo en una sola lámina
export const HSkin: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...SKY} cam={{ at: [0, Y0 + 0.05, 0], az: [-0.3, -0.06], el: [0.42, 0.26], r: [1.85, 1.73], fov: 32 }}>{(tt) => {
  const put = eio(tt, 0.3, 1.5), peel = eio(tt, 2.6, 5.2), N = 26, W = 1.8;
  return <><Yard cut={false} />
    <Slab w={2.2} d={1.2} p={[0, Y0 - 0.08, 0]} k="a" col={CONC.clean} />
    {Array.from({ length: N }, (_, i) => { const u = i / (N - 1), R = 0.17, s = (1 - u) * W, reach = peel * W * 1.05, adv = s - reach; if (adv > 0) return <group key={i}><RBox s={[W / N + 0.004, 0.02, 1.0]} p={[-W / 2 + (u * W), Y0 + 0.04, 0]} r={0.002}><Conc col="#7b7566" k="s" /></RBox></group>; const a = Math.min(-adv / R, PI * 1.25), xc = W / 2 - reach; const dx = R * Math.sin(a), dy = R * (1 - Math.cos(a)); return <RBox key={i} s={[W / N + 0.01, 0.02, 1.0]} p={[xc + dx - 0.0, Y0 + 0.04 + dy, 0]} rot={[0, 0, -a]} r={0.002}><Conc col="#7b7566" k="s" /></RBox>; })}
    {put < 1 && <RBox s={[Math.max(0.01, W * put), 0.002, 0.9]} p={[-W / 2 + (W * put) / 2, Y0 + 0.052, 0]} r={0.0006} shadow={false}><meshBasicMaterial color="#b2afa4" /></RBox>}
    <Tape txt="THE SKIN LETS GO" col="#b3261e" p={[-0.1, Y0 + 0.34, -0.3]} w={0.54} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) * 2)} />
  </>;
}}</Scene3D>;

// 13:45 · UN PIE DE DISTANCIA: la lanza se acerca y talla rayas; vuelve a un pie y limpia parejo
export const HFootOff: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" {...SKY} cam={{ at: [0, Y0 + 0.33, 0.05], az: [0.34, 0.18], el: [0.12, 0.17], r: [1.7, 1.6], fov: 32 }}>{(tt) => {
  const y = tt < 2.4 ? lerp(0.62, 0.14, eio(tt, 0.4, 2.0)) : lerp(0.14, 0.62, eio(tt, 3.4, 4.5)), k = cl((0.3 - y) * 7), N = 24, clean = eio(tt, 4.6, 6.4);
  return <><Yard cut={false} />
    <Slab w={1.9} d={1.1} p={[0, Y0 - 0.08, 0.05]} k="a" />
    <RBox s={[Math.max(0.02, 1.6 * clean), 0.002, 0.9]} p={[-0.8 + 0.8 * clean, Y0 + 0.0241, 0.05]} r={0.0006} shadow={false}><meshStandardMaterial color="#c7c4bb" roughness={0.95} /></RBox>
    {[-0.1, 0, 0.1, 0.2].map((x) => <RBox key={x} s={[0.012, 0.002, 0.34 * cl(k * 1.6 + eio(tt, 2.0, 2.4))]} p={[x, Y0 + 0.0245, 0.14]} r={0.0005} shadow={false}><meshBasicMaterial color="#544f45" transparent opacity={1 - clean} /></RBox>)}
    <group position={[0, Y0 + 0.02 + y, 0.14]}><mesh position={[0.34, 0.27, 0]} rotation={[0, 0, -1.05]}><cylinderGeometry args={[0.018, 0.018, 0.72, 16]} />{M.steel({ col: "#4c5157" })}</mesh><RBox s={[0.05, 0.06, 0.04]} p={[0.02, 0.06, 0]} rot={[0, 0, -1.05]} r={0.008}><meshStandardMaterial color="#d3a82a" roughness={0.5} /></RBox>
      {Array.from({ length: N }, (_, i) => { const u = ((tt * 2.2 + rn(i, 61)) % 1), s = (rn(i, 62) - 0.5) * 0.3; return <mesh key={i} position={[s * u * 0.6, 0.06 - y * u, (rn(i, 63) - 0.5) * 0.3 * u]}><sphereGeometry args={[0.009, 8, 6]} /><meshBasicMaterial color="#d7ecfa" toneMapped={false} /></mesh>; })}</group>
    <group position={[-0.34, Y0 + 0.024, 0.14]}><RBox s={[0.05, 0.62, 0.004]} p={[0, 0.31, 0]} r={0.001}><meshStandardMaterial color="#e6c04e" roughness={0.5} /></RBox>{Array.from({ length: 13 }, (_, i) => <RBox key={i} s={[i % 3 === 0 ? 0.034 : 0.02, 0.002, 0.002]} p={[-0.006, 0.02 + i * 0.048, 0.003]} r={0.0005} shadow={false}><meshBasicMaterial color="#141414" /></RBox>)}</group>
    <Tape txt="ONE FOOT OFF" col="#1f7a3a" p={[0.3, Y0 + 0.74, 0.0]} w={0.42} k={phys(tt, 4.6, 8, 0.45)} rev={cl((tt - 4.6) * 2)} />
    <Tape txt="TOO CLOSE CARVES" col="#b3261e" p={[-0.92, Y0 + 0.5, 0.0]} w={0.46} k={phys(tt, 1.7, 8, 0.45)} rev={cl((tt - 1.7) * 2)} />
  </>;
}}</Scene3D>;

// 14:35 · NOVENTA SEGUNDOS: el dedo tira gotas: una losa se las toma, la otra las deja arriba como en un auto encerado
export const HFlick: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...SKY} cam={{ at: [0, Y0 + 0.08, 0.12], az: [-0.08, 0.08], el: [0.5, 0.58], r: [1.95, 1.85], fov: 32 }}>{(tt) => {
  const land = [0, 1, 2, 3, 4].map((i) => cl((tt - 1.1 - i * 0.05) * 3)), soak = eio(tt, 1.6, 3.2), f = cl((tt - 0.8) / 0.18);
  const dl = [[-0.74, -0.08], [-0.52, 0.12], [-0.68, 0.22], [-0.42, -0.14], [-0.6, -0.26]], dr = [[0.44, -0.1], [0.66, 0.14], [0.54, 0.26], [0.74, -0.2], [0.38, 0.1]];
  return <><Yard cut={false} />
    <Slab w={1.1} d={1.1} p={[-0.6, Y0 - 0.08, 0.02]} k="a" col={CONC.clean} /><Slab w={1.1} d={1.1} p={[0.6, Y0 - 0.08, 0.02]} k="b" col={CONC.old} gloss />
    {dl.map(([x, z], i) => <group key={i}>
      {land[i] > 0 && <mesh position={[x, Y0 + 0.0246, z]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.022 + 0.06 * soak + rn(i, 71) * 0.03 * soak, 28]} /><meshBasicMaterial color="#403d36" transparent opacity={land[i] * 0.86} depthWrite={false} /></mesh>}
      {land[i] > 0 && soak < 0.97 && <mesh position={[x, Y0 + 0.028, z]} scale={[1, Math.max(0.05, 1 - soak), 1]}><sphereGeometry args={[0.026, 18, 12]} />{M.water({ op: 0.8 })}</mesh>}
      {land[i] <= 0 && f > 0 && <mesh position={[lerp(-0.5, x, cl((tt - 0.86) * 4)), Y0 + 0.5 - 0.36 * cl((tt - 0.86) * 4), lerp(0.3, z, cl((tt - 0.86) * 4))]}><sphereGeometry args={[0.014, 12, 10]} />{M.water({ op: 0.86 })}</mesh>}
    </group>)}
    {dr.map(([x, z], i) => <group key={i}>
      {land[i] > 0 && <mesh position={[x, Y0 + 0.034, z]} scale={[1, 0.62, 1]}><sphereGeometry args={[0.035 + rn(i, 72) * 0.014, 22, 16]} />{M.water({ op: 0.86 })}</mesh>}
      {land[i] <= 0 && f > 0 && <mesh position={[lerp(0.5, x, cl((tt - 0.86) * 4)), Y0 + 0.5 - 0.36 * cl((tt - 0.86) * 4), lerp(0.3, z, cl((tt - 0.86) * 4))]}><sphereGeometry args={[0.014, 12, 10]} />{M.water({ op: 0.86 })}</mesh>}
    </group>)}
    <Hand p={[-0.5, Y0 + 0.5, 0.3]} rot={[-0.8, 0, -1.3]} s={0.8} bend={f > 0 ? 0.1 : 0.85} />
    <Hand p={[0.5, Y0 + 0.5, 0.3]} rot={[-0.8, 0, -1.3]} s={0.8} bend={f > 0 ? 0.1 : 0.85} />
    <Tape txt="IT DRINKS: READY" col="#1f7a3a" p={[-0.42, Y0 + 0.04, 0.46]} rot={[-1.0, 0, 0]} w={0.4} k={phys(tt, 3.3, 8, 0.45)} rev={cl((tt - 3.3) * 2)} />
    <Tape txt="IT BEADS: NOT YET" col="#b3261e" p={[0.42, Y0 + 0.04, 0.46]} rot={[-1.0, 0, 0]} w={0.4} k={phys(tt, 4.1, 8, 0.45)} rev={cl((tt - 4.1) * 2)} />
  </>;
}}</Scene3D>;

// 15:50 · OSCURO, HÚMEDO, SIN BRILLO: tres muestras bajo una lámpara que pasa: seca, charco, y la buena
export const HDamp: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...SKY} cam={{ at: [0, Y0 + 0.02, 0.05], az: [-0.08, 0.14], el: [0.46, 0.5], r: [2.15, 2.05], fov: 32 }}>{(tt) => {
  const xs = [-0.62, 0, 0.62], tag = ["DRY", "SHINY", "DARK AND DAMP"], ok = phys(tt, 3.6, 7, 0.5);
  return <><Yard cut={false} />
    <Slab w={0.64} d={0.84} p={[xs[0], Y0 - 0.08, 0]} k="a" col="#c2bfb5" />
    <Slab w={0.64} d={0.84} p={[xs[1], Y0 - 0.08, 0]} k="b" col="#6f6c63" gloss />
    <Slab w={0.64} d={0.84} p={[xs[2], Y0 - 0.08, 0]} k="c" col="#6b6860" />
    {tag.map((x, i) => <Tape key={i} txt={x} col={i < 2 ? "#b3261e" : "#1f7a3a"} p={[xs[i] * 0.86, Y0 + 0.03, 0.44]} rot={[-1.0, 0, 0]} w={i < 2 ? 0.26 : 0.62} k={phys(tt, 0.7 + i * 1.1, 8, 0.45)} rev={cl((tt - 0.7 - i * 1.1) * 2)} />)}
    {[0, 1].map((i) => <group key={i} position={[xs[i], Y0 + 0.06, -0.05]} scale={Math.max(0.03, cl(phys(tt, 1.4 + i * 1.1, 7, 0.5)))}><group rotation={[-PI / 2 + 0.5, 0, PI / 4]}><RBox s={[0.34, 0.03, 0.012]} r={0.004}><meshStandardMaterial color="#c8281e" roughness={0.5} /></RBox><RBox s={[0.03, 0.34, 0.012]} r={0.004}><meshStandardMaterial color="#c8281e" roughness={0.5} /></RBox></group></group>)}
    <group position={[xs[2], Y0 + 0.06, -0.05]} scale={Math.max(0.03, cl(ok))}><group rotation={[-PI / 2 + 0.5, 0, 0]}><RBox s={[0.1, 0.03, 0.012]} p={[-0.06, -0.03, 0]} rot={[0, 0, -0.8]} r={0.004}><meshStandardMaterial color="#2c8a4c" roughness={0.5} /></RBox><RBox s={[0.26, 0.03, 0.012]} p={[0.07, 0.02, 0]} rot={[0, 0, 0.8]} r={0.004}><meshStandardMaterial color="#2c8a4c" roughness={0.5} /></RBox></group></group>
  </>;
}}</Scene3D>;
