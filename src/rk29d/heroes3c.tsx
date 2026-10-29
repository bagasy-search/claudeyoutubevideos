// rk29d · componentes 3D 31-45 (29-oct). Cada uno UNA vez en toda la tanda (registro D:/rtmp/rk29_COMPONENTES.md).
// Vara EVALUADOR: un objeto grande y entero en cuadro, pared/piso claros, llega con peso en la palabra clave, texto sólo 1-2 palabras sobre placa.
import React from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { Studio, Wall3, Fob3, Pouch3, Rings3, RB, Mat, sm, spr, c01, type V3 } from "./studio3d";
import { AMB, useTxt, Person3, Thread } from "./lock3d";
import { Truck3, Wheel3, Home3 } from "./truck3d";

type P = { t: number; h: H };
type WK = "brick" | "wood" | "drywall";
type FL = "wood" | "concrete" | "tile" | "paper" | "none";
const cam = (p: V3, l: V3, fov = 42): any[] => {
  // entrada: la cámara llega planeando desde más atrás y de costado en 1,5 s (el arranque nunca queda quieto); después deriva lenta y retrocede apenas (compensa el empuje de salida de Cam)
  const d: V3 = [(p[0] - l[0]) * 1.08, (p[1] - l[1]) * 1.08, (p[2] - l[2]) * 1.08];
  p = [l[0] + d[0], l[1] + d[1], l[2] + d[2]];
  return [{ t: 0, p: [l[0] + d[0] * 1.22 - 0.35, l[1] + d[1] * 1.12, l[2] + d[2] * 1.22], l, fov }, { t: 1.5, p, l, fov }, { t: 12, p: [p[0] + 0.18, p[1] + 0.02, p[2] + 0.12], l, fov, arc: 0.03 }];
};
const Room: React.FC<{ tt: number; c: any[]; wall?: WK; floor?: FL; z?: number; warm?: number; night?: number; children: React.ReactNode }> = ({ tt, c, wall = "drywall", floor = "wood", z = -0.8, warm = 0.9, night = 0, children }) =>
  <Studio tt={tt} floor={floor} warm={warm} night={night} photo={0} keys={c}><Wall3 p={[0, 1.7, z]} s={[14, 3.8, 0.1]} kind={wall} />{children}</Studio>;
const Plate: React.FC<{ p: V3; w: number; h: number; txt: string[]; bg?: string; fg?: string; size?: number; rot?: V3; op?: number }> = ({ p, w, h, txt, bg = "#f6f3ec", fg = "#22252b", size = 120, rot, op }) => {
  const m = useTxt(txt, 1024, Math.round(1024 * h / w), bg, fg, size, "Arial Black");
  return <group position={p} rotation={rot}><RB p={[0, 0, -0.012]} s={[w + 0.03, h + 0.03, 0.02]} rad={0.008} c="#2a2c31" r={0.5} /><mesh><planeGeometry args={[w, h]} /><meshBasicMaterial map={m} transparent={op !== undefined} opacity={op ?? 1} /></mesh></group>;
};
const drop = (tt: number, a: number, hgt = 1.2) => (1 - spr(tt, a, 8, 0.5)) * hgt;
// esfera de reloj con marcas y aguja (sin números chicos)
const Dial: React.FC<{ p: V3; r: number; k: number; col?: string; s?: number }> = ({ p, r, k, col = "#c62a22" }) => <group position={p}>
  <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[r + 0.05, r + 0.05, 0.08, 64]} /><Mat c="#2a2c31" r={0.4} m={0.4} /></mesh>
  <mesh position={[0, 0, 0.042]}><circleGeometry args={[r, 64]} /><meshStandardMaterial color="#f6f3ec" roughness={0.7} /></mesh>
  <mesh position={[0, 0, 0.044]}><circleGeometry args={[r * 0.97, 64, Math.PI / 2 - Math.PI * 2 * k, Math.PI * 2 * k]} /><meshStandardMaterial color={col} roughness={0.6} transparent opacity={0.28} /></mesh>
  {[...Array(12)].map((_, j) => <RB key={j} p={[Math.sin(j / 12 * Math.PI * 2) * r * 0.82, Math.cos(j / 12 * Math.PI * 2) * r * 0.82, 0.05]} rot={[0, 0, -j / 12 * Math.PI * 2]} s={[r * 0.06, r * 0.2, 0.01]} rad={0.004} c="#22252b" r={0.5} />)}
  <group position={[0, 0, 0.06]} rotation={[0, 0, -Math.PI * 2 * k]}><RB p={[0, r * 0.38, 0]} s={[r * 0.07, r * 0.8, 0.012]} rad={0.006} c={col} r={0.4} /></group>
  <mesh position={[0, 0, 0.07]}><circleGeometry args={[r * 0.08, 24]} /><meshStandardMaterial color="#22252b" /></mesh>
</group>;

// 31 · el acero no escucha a la computadora: la tablet del ladrón dice ACCESS OK, el volante quiere girar y la barra amarilla lo frena en seco
export const D3Steelchip: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const ok = tt > 1.4, tryA = tt > 2.6 ? 0.18 * Math.min(1, (tt - 2.6) * 6) - 0.05 * Math.exp(-(tt - 2.75) * 6) * Math.sin((tt - 2.75) * 40) * (tt > 2.75 ? 1 : 0) : 0;
  return <Room tt={tt} c={cam([0.2, 1.15, 2.4], [0.1, 0.95, 0])} wall="drywall" z={-0.9}>
    <RB p={[0, 0.35, -0.3]} s={[2.6, 0.7, 0.9]} rad={0.04} c="#26282d" r={0.55} />
    <Wheel3 p={[-0.45, 1.1, -0.25]} rot={[-0.25, 0, 0]} s={1.35} bar={1} spin={Math.min(tryA, 0.18)} />
    <group position={[0.75, 0.95, -0.2]} rotation={[-0.2, -0.25, 0]}><RB s={[0.62, 0.44, 0.04]} rad={0.03} c="#151619" r={0.4} /><Plate p={[0, 0, 0.022]} w={0.54} h={0.36} txt={ok ? ["ACCESS", "OK"] : ["...", ""]} bg="#0e1a12" fg={ok ? "#6fe39a" : "#4a6a52"} size={150} /></group>
  </Room>;
}}</Stage>;

// 32 · menos que un tanque: el surtidor sube el total hasta $70 y al lado cae la barra amarilla con su etiqueta de $45
export const D3Pumpprice: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const v = Math.round(70 * sm(tt, 0.4, 3.4) * 100) / 100;
  return <Room tt={tt} c={cam([0.2, 1.1, 2.9], [0.1, 0.85, 0])} wall="brick" floor="concrete" z={-0.8}>
    <group position={[-0.6, 0, -0.3]}>
      <RB p={[0, 0.85, 0]} s={[0.75, 1.7, 0.5]} rad={0.05} c="#c62a22" r={0.45} />
      <Plate p={[0, 1.3, 0.26]} w={0.6} h={0.24} txt={[`$${v.toFixed(2)}`]} bg="#101114" fg="#ffb257" size={190} />
      <RB p={[0.42, 0.95, 0.1]} s={[0.08, 0.36, 0.12]} rad={0.03} c="#1a1a1a" r={0.5} />
    </group>
    <group position={[0.75, 0.62 + drop(tt, 3.8, 1.0), 0.05]} rotation={[0, -0.25, 0.04]}><RB s={[0.95, 0.09, 0.09]} rad={0.04} c="#f2c230" r={0.4} /><RB p={[0.42, 0, 0]} s={[0.12, 0.13, 0.13]} rad={0.03} c="#c9ced4" m={1} r={0.3} /></group>
    <RB p={[0.75, 0.29, 0.05]} s={[1.1, 0.58, 0.6]} rad={0.02} c="#7a4a2a" r={0.6} />
    <Plate p={[0.75, 0.95, -0.15]} w={0.46} h={0.22} txt={["$45"]} bg="#f2c230" fg="#22252b" size={240} op={sm(tt, 4.3, 4.7)} />
  </Room>;
}}</Stage>;

// 33 · seis camionetas: la linterna del que elige barre la fila; en la sexta brilla la barra amarilla y la luz se va de largo
export const D3Sixskip: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const sweep = -3.3 + 6.6 * sm(tt, 0.6, 5.2), onSix = Math.exp(-Math.pow((sweep - 2.75) / 0.6, 2));
  return <Studio tt={tt} floor="concrete" night={0.75} warm={0.6} photo={0} keys={cam([0, 3.2, 6.4], [0, 0.4, -0.3], 40)}>
    {[0, 1, 2, 3, 4, 5].map((i) => { const x = -2.75 + i * 1.1, lit = Math.exp(-Math.pow((sweep - x) / 0.55, 2)); return <group key={i}>
      <Truck3 p={[x, 0, -0.4]} s={0.48} col={["#4a5058", "#7a2a22", "#2a3a4e", "#5a5a52", "#3a4a3a", "#6a6a70"][i]} />
      <mesh position={[x, 0.012, 0.0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.55, 32]} /><meshBasicMaterial color="#fff2d0" transparent opacity={0.5 * lit} toneMapped={false} /></mesh>
      {i === 5 && <RB p={[x, 0.46, 0.02]} s={[0.36, 0.05, 0.05]} rad={0.02} c="#f2c230" e="#f2c230" ei={0.2 + 1.4 * onSix} r={0.4} />}
    </group>; })}
  </Studio>;
}}</Stage>;

// 34 · dos minutos contra diez: dos cronómetros grandes; el de las camionetas sin barra para en 2, el de la barra sigue hasta 10
export const D3Stopwatch2: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const run = c01((tt - 0.6) / 5.0), a = Math.min(run * 10, 2) / 12, b = run * 10 / 12;
  return <Room tt={tt} c={cam([0, 1.1, 3.0], [0, 1.0, 0])} wall="drywall" z={-0.7}>
    <Dial p={[-0.75, 1.15, -0.55]} r={0.5} k={a} col="#9aa0a8" />
    <Dial p={[0.75, 1.15, -0.55]} r={0.5} k={b} col="#c62a22" />
    <Plate p={[-0.75, 0.42, -0.55]} w={0.6} h={0.22} txt={["2 MIN"]} size={220} />
    <Plate p={[0.75, 0.42, -0.55]} w={0.6} h={0.22} txt={["10 MIN"]} bg="#f2c230" size={210} />
  </Room>;
}}</Stage>;

// 35 · de culata: la camioneta entra marcha atrás hasta la casa y queda con la trompa hacia afuera; arriba se prende el foco del porche
export const D3Noseout: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const back = sm(tt, 0.6, 3.6), lamp = sm(tt, 4.0, 4.4);
  return <Studio tt={tt} floor="concrete" night={0.55} warm={0.7} photo={0} keys={cam([1.4, 1.8, 4.6], [0, 0.6, -0.8], 42)}>
    <Home3 p={[0, 0, -2.6]} s={1.9} lit={1} />
    <RB p={[0.9, 1.75, -1.55]} s={[0.16, 0.12, 0.1]} rad={0.03} c="#2a2c31" r={0.4} />
    <mesh position={[0.9, 1.68, -1.48]}><sphereGeometry args={[0.06, 16, 12]} /><meshStandardMaterial color="#fff4d6" emissive="#ffe2a0" emissiveIntensity={0.1 + 3 * lamp} /></mesh>
    <pointLight position={[0.9, 1.6, -1.3]} intensity={6 * lamp} distance={5} color="#ffe2a0" />
    <Truck3 p={[0.1, 0, 1.6 - 2.3 * back]} rot={[0, 0, 0]} s={0.72} col="#8a2a22" brake={back > 0.02 && back < 0.98 ? 1 : 0} head={back >= 0.98 ? 0.3 : 0} />
  </Studio>;
}}</Stage>;

// 36 · el escenario: el hombre llega a la camioneta, el reflector se prende y queda parado en un círculo de luz, como en un escenario
export const D3Stagelight: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const on = sm(tt, 2.4, 2.6), walk = sm(tt, 0.3, 2.4), back = sm(tt, 3.2, 4.4);
  return <Studio tt={tt} floor="concrete" night={0.85} warm={0.6} photo={0} keys={cam([0.6, 1.6, 4.0], [0, 0.8, 0], 42)}>
    <Wall3 p={[0, 1.7, -1.6]} s={[10, 3.6, 0.1]} kind="brick" />
    <Truck3 p={[1.0, 0, -0.6]} rot={[0, -Math.PI / 2, 0]} s={0.7} col="#3a4a5e" />
    <RB p={[-0.5, 2.3, -1.5]} s={[0.3, 0.16, 0.14]} rad={0.03} c="#2a2c31" r={0.4} />
    <mesh position={[-0.5, 2.26, -1.42]}><boxGeometry args={[0.24, 0.08, 0.02]} /><meshStandardMaterial color="#fff8e6" emissive="#fff2d0" emissiveIntensity={0.05 + 4 * on} /></mesh>
    <spotLight position={[-0.5, 2.25, -1.3]} target-position={[0.1, 0, 0.3]} angle={0.5} penumbra={0.4} intensity={40 * on} distance={8} color="#fff2d0" />
    <mesh position={[0.1, 0.012, 0.3]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.85, 48]} /><meshBasicMaterial color="#fff2d0" transparent opacity={0.45 * on} toneMapped={false} /></mesh>
    <Person3 p={[-2.2 + 2.3 * walk - 0.5 * back, 0, 0.3 + 0.3 * back]} yaw={Math.PI / 2 - 0.6 * back} s={1.0} col="#2a2c31" step={walk < 1 ? tt * 4 : 0} arm={0} />
  </Studio>;
}}</Stage>;

// 37 · más difícil que los vecinos: tres camionetas iguales; delante de la tuya suben tres vallas, una por vez
export const D3Hurdles: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  return <Studio tt={tt} floor="concrete" warm={0.8} photo={0} keys={cam([0, 2.4, 5.6], [0, 0.45, 0], 40)}>
    <Wall3 p={[0, 1.7, -2.2]} s={[12, 3.6, 0.1]} kind="brick" />
    {[-1.8, 0, 1.8].map((x, i) => <Truck3 key={i} p={[x, 0, -0.7]} s={0.6} col={i === 1 ? "#8a2a22" : "#6a6e74"} />)}
    {[0, 1, 2].map((j) => { const up = spr(tt, 1.2 + j * 1.2, 8, 0.45); return <group key={j} position={[0, 0, 0.35 + j * 0.42]} scale={[1, Math.max(0.001, up), 1]}>
      {[-0.55, 0.55].map((x, q) => <RB key={q} p={[x, 0.25, 0]} s={[0.05, 0.5, 0.05]} rad={0.015} c="#2a2c31" r={0.5} />)}
      <RB p={[0, 0.46, 0]} s={[1.2, 0.1, 0.04]} rad={0.015} c={j % 2 ? "#f6f3ec" : "#f2c230"} r={0.45} />
    </group>; })}
  </Studio>;
}}</Stage>;

// 38 · la vidriera: la caja de la camioneta vista desde la calle es una vidriera iluminada, cada cosa con su etiqueta de precio colgando de un hilo; gira y queda la trompa
const Tag38: React.FC<{ p: V3; txt: string; op: number; sw: number }> = ({ p, txt, op, sw }) => {
  const m = useTxt([txt], 256, 128, "#f6f3ec", "#c62a22", 96, "Arial Black");
  return <group position={p} rotation={[0, 0, sw]}>
    <mesh position={[0, -0.13, 0]}><cylinderGeometry args={[0.003, 0.003, 0.26, 6]} /><meshBasicMaterial color="#2a2c31" transparent opacity={op} /></mesh>
    <mesh position={[0, -0.3, 0]}><planeGeometry args={[0.2, 0.1]} /><meshBasicMaterial map={m} transparent opacity={op} side={THREE.DoubleSide} /></mesh>
  </group>;
};
export const D3Shopwindow: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const turn = sm(tt, 4.2, 6.6), show = 1 - sm(tt, 4.0, 4.6);
  return <Studio tt={tt} floor="concrete" warm={0.85} photo={0} night={0.35} keys={cam([0.2, 1.35, 3.1], [0, 0.7, 0.3], 40)}>
    <Wall3 p={[0, 1.7, -2.4]} s={[12, 3.6, 0.1]} kind="drywall" />
    <group rotation={[0, Math.PI * turn, 0]}><group rotation={[0, Math.PI, 0]}>
      <Truck3 s={0.85} col="#5a6470" />
      <group position={[0, 0.6, -0.47]}>
        <RB p={[-0.22, 0.1, 0.2]} s={[0.3, 0.2, 0.2]} rad={0.02} c="#c62a22" r={0.4} m={0.3} />
        <RB p={[0.2, 0.09, 0.15]} s={[0.26, 0.18, 0.2]} rad={0.03} c="#2a6ab0" r={0.5} />
        {[-0.3, 0.3].map((x, i) => <RB key={i} p={[x * 0.9, 0.25, -0.15]} s={[0.03, 0.03, 0.9]} rad={0.01} c="#c9ced4" m={0.9} r={0.25} />)}
        {[...Array(6)].map((_, i) => <RB key={i} p={[0, 0.25, -0.55 + i * 0.16]} s={[0.54, 0.025, 0.025]} rad={0.008} c="#c9ced4" m={0.9} r={0.25} />)}
        <RB p={[0.05, 0.07, -0.25]} s={[0.36, 0.14, 0.22]} rad={0.02} c="#f2c230" r={0.5} />
      </group>
    </group></group>
    {show > 0.01 && <>
      <RB p={[0, 1.42, 0.55]} s={[1.0, 0.025, 0.025]} rad={0.008} c="#2a2c31" r={0.5} op={show} />
      <Tag38 p={[-0.22, 1.42, 0.62]} txt="$400" op={show} sw={0.08 * Math.sin(tt * 2.2)} />
      <Tag38 p={[0.2, 1.42, 0.62]} txt="$250" op={show} sw={0.08 * Math.sin(tt * 2.2 + 1)} />
      <Tag38 p={[-0.02, 1.42, 0.82]} txt="$900" op={show} sw={0.08 * Math.sin(tt * 2.2 + 2)} />
      <pointLight position={[0, 1.3, 0.6]} intensity={2.6 * show} distance={1.8} color="#ffe2b0" />
    </>}
  </Studio>;
}}</Stage>;

// 39 · lo que cuenta la cabina: la linterna barre el tablero (sobre de correo, credencial colgada, pase del hospital); cada cosa se va y queda vacío
export const D3Cabclues: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const beam = -1.0 + 2.0 * sm(tt, 0.5, 3.0), gone = (i: number) => sm(tt, 3.6 + i * 0.5, 4.1 + i * 0.5);
  const glow = (x: number) => Math.exp(-Math.pow((beam - x) / 0.3, 2));
  return <Room tt={tt} c={cam([0, 1.3, 2.3], [0, 1.0, 0])} wall="drywall" z={-1.0} night={0.6} warm={0.6}>
    <RB p={[0, 0.7, -0.3]} s={[2.6, 0.3, 0.9]} rad={0.06} c="#1e1f24" r={0.6} />
    <RB p={[0, 1.55, -0.75]} s={[2.4, 1.1, 0.02]} rad={0.02} c="#1e2a36" r={0.05} m={0.6} />
    <RB p={[0.0, 1.95, -0.6]} s={[0.36, 0.1, 0.04]} rad={0.02} c="#2a2c31" r={0.3} />
    <group position={[-0.7, 0.88 + 0.6 * gone(0), -0.25 - 0.5 * gone(0)]} rotation={[-1.3, 0, 0.2]}><RB s={[0.5, 0.32, 0.01]} rad={0.004} c="#f2efe6" e="#fff2d0" ei={0.6 * glow(-0.7)} r={0.8} /><RB p={[0.1, 0.05, 0.006]} s={[0.24, 0.04, 0.002]} rad={0.001} c="#6a6c70" r={0.8} /></group>
    <group position={[0.0, 1.62 - 0.0 * gone(1), -0.55 + 0.8 * gone(1)]} rotation={[0, 0, 0.06 * Math.sin(tt * 2)]} scale={1 - gone(1)}><mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.004, 0.004, 0.34, 6]} /><Mat c="#2a6ab0" r={0.5} /></mesh><RB s={[0.16, 0.22, 0.01]} rad={0.01} c="#f6f3ec" e="#fff2d0" ei={0.6 * glow(0.0)} r={0.6} /><RB p={[0, 0.05, 0.006]} s={[0.08, 0.08, 0.002]} rad={0.01} c="#9aa0a8" r={0.6} /></group>
    <group position={[0.7, 0.88 + 0.6 * gone(2), -0.3 - 0.5 * gone(2)]} rotation={[-1.3, 0, -0.15]}><RB s={[0.4, 0.2, 0.01]} rad={0.01} c="#c62a22" e="#ff5a4a" ei={0.4 * glow(0.7)} r={0.6} /><RB p={[0, 0, 0.006]} s={[0.12, 0.12, 0.002]} rad={0.02} c="#f6f3ec" r={0.6} /></group>
    <mesh position={[beam, 1.0, 0.3]} rotation={[-0.4, 0, 0]}><circleGeometry args={[0.35, 32]} /><meshBasicMaterial color="#fff2d0" transparent opacity={0.12 * (1 - sm(tt, 3.0, 3.4))} toneMapped={false} /></mesh>
  </Room>;
}}</Stage>;

// 40 · la llave que no entra: una llave vieja grande va hacia el botón de arranque y choca contra él: no hay dónde meterla
export const D3Nofit: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const go = sm(tt, 0.8, 2.2), bump = tt > 2.2 ? Math.exp(-(tt - 2.2) * 5) * Math.sin((tt - 2.2) * 28) * 0.04 : 0, back = sm(tt, 3.6, 4.4);
  return <Room tt={tt} c={cam([0.5, 1.1, 2.0], [0.0, 1.0, 0])} wall="drywall" z={-0.5}>
    <RB p={[0, 1.0, -0.35]} s={[2.4, 1.2, 0.1]} rad={0.05} c="#1e1f24" r={0.55} />
    <group position={[-0.1, 1.0, -0.28]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.24, 0.24, 0.06, 48]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh><mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.19, 0.19, 0.04, 48]} /><Mat c="#151619" r={0.35} /></mesh><Plate p={[0, 0, 0.06]} w={0.3} h={0.16} txt={["START", "STOP"]} bg="#151619" fg="#ff5a4a" size={170} /></group>
    <group position={[1.3 - 1.12 * go + bump + 0.4 * back, 1.0, 0.0]} rotation={[0, 0, Math.PI / 2]}>
      <mesh position={[0, -0.1, 0]}><torusGeometry args={[0.14, 0.04, 12, 32]} /><Mat c="#c9a24a" m={1} r={0.3} /></mesh>
      <RB p={[0, 0.25, 0]} s={[0.07, 0.5, 0.025]} rad={0.01} c="#c9a24a" m={1} r={0.3} />
      {[0.12, 0.22, 0.32, 0.42].map((y, i) => <RB key={i} p={[0.045, y, 0]} s={[0.04, 0.04, 0.024]} rad={0.004} c="#c9a24a" m={1} r={0.3} />)}
    </group>
  </Room>;
}}</Stage>;

// 41 · el motel: corte del cuarto; la llave en la mesa de luz, una pared finita y la camioneta afuera; un hilo marca 40 FT
export const D3Motelwall: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const k = sm(tt, 1.2, 3.4), pulse = 0.5 + 0.5 * Math.sin(tt * 6);
  return <Studio tt={tt} floor="concrete" night={0.6} warm={0.65} photo={0} keys={cam([0.2, 2.2, 4.6], [0.2, 0.5, -0.3], 42)}>
    <RB p={[-1.4, 0.01, -0.3]} s={[2.0, 0.02, 1.8]} rad={0.004} c="#8a6a52" r={0.85} />
    <RB p={[-0.35, 0.6, -0.3]} s={[0.06, 1.2, 1.8]} rad={0.004} c="#e8e2d6" r={0.8} />
    <RB p={[-1.6, 0.25, -0.6]} s={[0.9, 0.5, 1.2]} rad={0.04} c="#d8d2c4" r={0.8} />
    <RB p={[-0.8, 0.25, -0.9]} s={[0.4, 0.5, 0.4]} rad={0.02} c="#6a4a32" r={0.6} />
    <Fob3 p={[-0.8, 0.53, -0.9]} rot={[-Math.PI / 2, 0, 0.4]} s={0.6} led={pulse > 0.8 ? 1 : 0} />
    <Truck3 p={[1.6, 0, -0.2]} rot={[0, -Math.PI / 2, 0]} s={0.7} col="#4a5260" />
    <Thread a={[-0.8, 0.56, -0.9]} b={[1.5, 0.6, -0.2]} lift={0.5} k={k} col={AMB} r={0.016} />
  </Studio>;
}}</Stage>;

// 42 · el papel de aluminio: la llave envuelta; en el doblez queda una rendija y por ahí se escapan los anillos de señal
export const D3Foilgap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const wrap = sm(tt, 0.5, 1.8), leak = c01((tt - 2.6) / 2.4);
  return <Room tt={tt} c={cam([0.3, 1.25, 2.2], [0.1, 0.8, 0])} wall="wood" z={-0.8}>
    <RB p={[0, 0.3, 0]} s={[2.0, 0.6, 1.0]} rad={0.02} c="#6a4a32" r={0.6} />
    <Fob3 p={[0, 0.68, 0.05]} rot={[-Math.PI / 2 + 0.2, 0, 0.3]} s={1.4} />
    {[-1, 1].map((sd, i) => <group key={i} position={[0, 0.68, 0.05]} rotation={[0, 0.3, 0]}><RB p={[sd * 0.17 * (2 - wrap), 0.06, 0]} rot={[0, 0, sd * 0.08 * (1 - wrap)]} s={[0.36, 0.14 + 0.02 * i, 0.46]} rad={0.05} c="#d8dce2" m={0.85} r={0.32} op={0.15 + 0.85 * wrap} /></group>)}
    <RB p={[0.04, 0.82, 0.05]} rot={[0, 0.3, 0]} s={[0.02, 0.03, 0.4]} rad={0.004} c="#101114" r={0.5} op={wrap} />
    <Rings3 p={[0.04, 0.85, 0.05]} k={leak} n={3} r={1.0} col={AMB} rot={[0, 0.3, 0]} op={leak > 0 ? 1 : 0} />
  </Room>;
}}</Stage>;

// 43 · el colador: el seguro deja caer su cheque en un colador grande; las herramientas, las fotos y el cartel del sábado se escurren por los agujeros y sólo queda el cheque
export const D3Sieve: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const items: [string, number, number][] = [["check", 0.8, 0], ["tool", 1.6, -0.25], ["photo", 2.3, 0.22], ["sat", 3.0, 0.02]];
  return <Room tt={tt} c={cam([0, 1.95, 2.7], [0, 0.75, 0])} wall="drywall" z={-1.0}>
    <group position={[0, 1.0, 0]}>
      <mesh rotation={[Math.PI, 0, 0]}><sphereGeometry args={[0.7, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#c9ced4" metalness={0.95} roughness={0.22} side={THREE.DoubleSide} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.7, 0.025, 12, 64]} /><Mat c="#e8ecf0" m={1} r={0.15} /></mesh>
      {[...Array(70)].map((_, i) => { const ph = 0.35 + 1.05 * ((i % 7) / 6), th = (Math.floor(i / 7) / 10) * Math.PI * 2 + (i % 2) * 0.3; return <mesh key={i} position={[Math.sin(ph) * Math.cos(th) * 0.705, -Math.cos(ph) * 0.705, Math.sin(ph) * Math.sin(th) * 0.705]}><sphereGeometry args={[0.022, 8, 8]} /><meshBasicMaterial color="#1a1a1e" /></mesh>; })}
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.78, 0, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.07, 0.015, 8, 20, Math.PI]} /><Mat c="#e8ecf0" m={1} r={0.15} /></mesh>)}
    </group>
    {[0, 1, 2].map((i) => { const a = i * Math.PI * 2 / 3; return <RB key={i} p={[Math.cos(a) * 0.35, 0.2, Math.sin(a) * 0.35]} s={[0.04, 0.42, 0.04]} rad={0.01} c="#9aa0a8" m={0.9} r={0.3} />; })}
    {items.map(([k, at, x], i) => { const f = c01((tt - at) / 0.6), thr = k === "check" ? 0 : sm(tt, at + 0.9, at + 1.7); const y = 2.3 - 1.85 * f * f - 0.45 * thr, sc = 1 - 0.55 * thr;
      if (tt < at) return null;
      return <group key={i} position={[x * (1 + 1.2 * thr), y, 0.05 * i]} rotation={[-Math.PI / 2 + 0.3 * (1 - f), 0, 0.4 * i]} scale={sc}>
        {k === "check" && <Plate p={[0, 0, 0]} w={0.44} h={0.2} txt={["PAY $1,500"]} bg="#cfe8d4" fg="#1e4a2a" size={90} />}
        {k === "tool" && <><RB s={[0.42, 0.05, 0.03]} rad={0.015} c="#c9ced4" /><mesh position={[0.22, 0, 0]}><torusGeometry args={[0.05, 0.02, 8, 16]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh></>}
        {k === "photo" && <><RB s={[0.28, 0.22, 0.01]} rad={0.004} c="#f6f3ec" r={0.7} /><RB p={[0, 0.02, 0.006]} s={[0.22, 0.15, 0.004]} rad={0.002} c="#6a8ab0" r={0.7} /></>}
        {k === "sat" && <Plate p={[0, 0, 0]} w={0.5} h={0.16} txt={["SATURDAY"]} bg="#c62a22" fg="#ffffff" size={90} />}
      </group>; })}
  </Room>;
}}</Stage>;

// 44 · las buenas noches de 30 segundos: el dial barre medio minuto y se va prendiendo cada paso en la mesa: control, barra, llave, funda
export const D3Goodnight30: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const k = c01((tt - 0.6) / 6.0), lit = (i: number) => k > (i + 1) / 4.5 ? 1 : 0;
  return <Room tt={tt} c={cam([0, 1.5, 2.8], [0, 0.85, 0])} wall="drywall" z={-0.8}>
    <Dial p={[0, 1.45, -0.7]} r={0.38} k={k} col={AMB} />
    <RB p={[0, 0.3, 0]} s={[2.6, 0.6, 0.8]} rad={0.02} c="#7a4a2a" r={0.6} />
    {[-0.9, -0.3, 0.3, 0.9].map((x, i) => <mesh key={i} position={[x, 0.605, 0.05]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.26, 40]} /><meshBasicMaterial color={lit(i) ? "#ffd29f" : "#5a3a24"} transparent opacity={lit(i) ? 0.75 : 0.5} toneMapped={false} /></mesh>)}
    <group position={[-0.9, 0.65, 0.05]}><RB s={[0.22, 0.06, 0.12]} rad={0.02} c="#2a2c31" r={0.4} /><RB p={[0, 0.035, 0]} s={[0.06, 0.01, 0.06]} rad={0.01} c={lit(0) ? "#6fe39a" : "#3a3d44"} r={0.4} /></group>
    <group position={[-0.3, 0.66, 0.05]} rotation={[0, 0.6, 0]}><RB s={[0.48, 0.06, 0.06]} rad={0.025} c="#f2c230" r={0.4} /></group>
    <Fob3 p={[0.3, 0.64, 0.05]} rot={[-Math.PI / 2, 0, 0.3]} s={0.6} />
    <Pouch3 p={[0.9, 0.62, 0.05]} rot={[-Math.PI / 2, 0, -0.2]} s={0.7} open={1 - lit(3)} />
  </Room>;
}}</Stage>;

// 45 · la carrera: dos carriles; el cepillo de dientes avanza despacio y la puerta, con la llave guardándose en la funda, cruza primero la meta
export const D3Brushrace: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const go = c01((tt - 0.6) / 2.8), xb = -1.7 + 1.5 * c01((tt - 0.6) / 6), xd = -1.7 + 3.2 * (1 - (1 - go) * (1 - go)), win = sm(tt, 3.4, 3.8), inP = sm(tt, 0.8, 2.4);
  return <Room tt={tt} c={cam([0.2, 1.5, 3.3], [0.1, 0.35, 0])} wall="drywall" z={-1.2}>
    {[-0.35, 0.35].map((z, i) => <RB key={i} p={[0, 0.01, z]} s={[4.0, 0.02, 0.5]} rad={0.004} c={i ? "#c9a878" : "#b8c4cc"} r={0.8} />)}
    {[...Array(10)].map((_, i) => <RB key={i} p={[1.6 + (i % 2) * 0.05, 0.022, -0.6 + i * 0.12]} s={[0.05, 0.004, 0.12]} rad={0.001} c={i % 2 ? "#151515" : "#f6f3ec"} r={0.6} />)}
    <RB p={[1.6, 0.5, -0.65]} s={[0.04, 1.0, 0.04]} rad={0.01} c="#2a2c31" r={0.5} />
    <group position={[xb, 0.08, -0.35]} rotation={[0, 0, 0.05 * Math.sin(tt * 12)]}>
      <RB p={[0, 0, 0]} s={[0.62, 0.06, 0.06]} rad={0.025} c="#2a6ab0" r={0.35} />
      <RB p={[0.3, 0.06, 0]} s={[0.1, 0.07, 0.05]} rad={0.01} c="#f6f3ec" r={0.8} />
    </group>
    <group position={[xd, 0, 0.35]}>
      <RB p={[0, 0.35, 0]} s={[0.36, 0.7, 0.05]} rad={0.01} c="#5a3a2a" r={0.6} />
      <mesh position={[0.12, 0.35, 0.04]}><sphereGeometry args={[0.025, 12, 12]} /><Mat c="#d8b04a" m={1} r={0.25} /></mesh>
      <group position={[0, 0.82, 0]}><Pouch3 s={0.5} open={1 - inP} col="#6a6a62" />{inP < 0.95 && <Fob3 p={[0, 0.25 * (1 - inP), 0]} s={0.32} />}</group>
    </group>
    {win > 0 && <Rings3 p={[1.6, 0.5, 0.35]} k={win} n={2} r={0.5} col="#2a8a4a" rot={[0, Math.PI / 2, 0]} op={1 - win} />}
  </Room>;
}}</Stage>;

export const HEROES_3C = { steelchip: D3Steelchip, pumpprice: D3Pumpprice, sixskip: D3Sixskip, stopwatch2: D3Stopwatch2, noseout: D3Noseout, stagelight: D3Stagelight, hurdles: D3Hurdles, shopwindow: D3Shopwindow, cabclues: D3Cabclues, nofit: D3Nofit, motelwall: D3Motelwall, foilgap: D3Foilgap, sieve: D3Sieve, goodnight30: D3Goodnight30, brushrace: D3Brushrace };
