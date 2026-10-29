// rk29b · VUELTA FINAL (29-oct). Tras 3 vueltas del EVALUADOR sin llegar a 8, cada pieza se reemplaza por algo MÁS SIMPLE e impecable
// (EVALUADOR.md: «simple y perfecto le gana a ambicioso con un error»): UN objeto grande y entero en cuadro, pared y piso claros,
// llega con peso en la palabra clave, cámara fija con curva lenta, texto sólo de 1-2 palabras grandes sobre placa.
import React from "react";
import { H, Stage } from "./hkit";
import { Studio, Wall3, Fob3, Car3, RB, Mat, sm, spr, c01, rnd, type V3 } from "./studio3d";
import { AMB, RED, GRN, useTxt, Lock3, Door3, Phone3, Person3, Hand3, Screw3, Sofa3, Thread, Hourglass3 } from "./lock3d";

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
  <Studio tt={tt} floor={floor} warm={warm} night={night} photo={0} keys={c}><Wall3 p={[0, 1.7, z]} s={[12, 3.8, 0.1]} kind={wall} />{children}</Studio>;
// placa con 1-2 palabras grandes
const Plate: React.FC<{ p: V3; w: number; h: number; txt: string[]; bg?: string; fg?: string; size?: number; rot?: V3; op?: number }> = ({ p, w, h, txt, bg = "#f6f3ec", fg = "#22252b", size = 120, rot, op }) => {
  const m = useTxt(txt, 1024, Math.round(1024 * h / w), bg, fg, size, "Arial Black");
  if (op !== undefined && op < 0.01) return null;
  return <group position={p} rotation={rot}><RB p={[0, 0, -0.012]} s={[w + 0.03, h + 0.03, 0.02]} rad={0.008} c="#2a2c31" r={0.5} op={op} /><mesh><planeGeometry args={[w, h]} /><meshBasicMaterial map={m} transparent={op !== undefined} opacity={op ?? 1} /></mesh></group>;
};
const drop = (tt: number, a: number, hgt = 1.2) => (1 - spr(tt, a, 8, 0.5)) * hgt; // altura que falta para apoyar (cae y rebota)

// 1 · toda la noche: reloj de mesa de luz grande que salta hora por hora de 11 PM a 5 AM; el teléfono duerme al lado
export const S01: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const hrs = ["11:00 PM", "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM"], i = Math.min(6, Math.floor(c01((tt - 0.6) / 6) * 7));
  const m = useTxt([hrs[i]], 1024, 340, "#101114", "#ff5a3a", 165, "Arial Black");
  return <Room tt={tt} c={cam([0, 1.0, 2.4], [0, 0.75, 0])} wall="wood" night={0.6} warm={0.7}>
    <RB p={[0, 0.3, 0]} s={[1.9, 0.6, 0.7]} rad={0.03} c="#6a4a32" r={0.6} />
    <group position={[-0.25, 0.9 - drop(tt, 0.2, 0.6), 0]}><RB s={[1.05, 0.42, 0.3]} rad={0.06} c="#1a1b1f" r={0.4} /><mesh position={[0, 0, 0.152]}><planeGeometry args={[0.96, 0.32]} /><meshBasicMaterial map={m} toneMapped={false} /></mesh></group>
    <Phone3 p={[0.62, 0.62, 0.05]} rot={[0, -0.4, 0]} s={1.3} on={0.08} />
  </Room>;
}}</Stage>;

// 2 · radar: aro en el piso frente a la puerta; el teléfono entra deslizando y la puerta se abre
export const S02: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const slide = sm(tt, 1.0, 3.0), inside = slide > 0.85 ? 1 : 0, open = sm(tt, 3.4, 4.6);
  return <Room tt={tt} c={cam([0.5, 1.5, 4.0], [0, 0.65, 0.3])} wall="brick" floor="concrete" z={-0.15}>
    <Door3 p={[0, 0, -0.08]} open={open} led={inside} ledCol={GRN} />
    <mesh position={[0, 0.012, 0.9]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.8, 0.86, 96]} /><meshBasicMaterial color={inside ? GRN : AMB} toneMapped={false} /></mesh>
    <Phone3 p={[1.7 - 1.6 * slide, 0.03, 0.95]} rot={[0, 0.5 - 0.5 * slide, 0]} s={2.0} on={1} col="#9fc4ff" />
  </Room>;
}}</Stage>;

// 3 · fantasmas: la puerta abierta y cuatro siluetas de vidrio la cruzan de a una
export const S03: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  return <Room tt={tt} c={cam([1.6, 1.4, 3.6], [0, 0.95, 0])} wall="drywall" z={-0.15}>
    <Door3 p={[0, 0, -0.08]} open={0.85} />
    {[0, 1, 2, 3].map((i) => { const k = c01((tt - 0.5 - i * 1.3) / 2.2); return k > 0 && k < 1 ? <Person3 key={i} p={[2.0 - 2.0 * k, 0, 1.4 - 1.6 * k]} yaw={-Math.PI / 2 - 0.6} s={0.95} col={["#a8c8ff", "#ffd29f", "#c8f0d8", "#f0c8e0"][i]} op={0.55 * Math.sin(Math.PI * k) + 0.05} step={Math.sin(tt * 7 + i)} /> : null; })}
  </Room>;
}}</Stage>;

// 4 · el anuncio: la cerradura late ondas y lo oyen el teléfono, el auto y la llave del auto (cada uno se enciende al llegar la onda)
export const S04: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const k = (tt * 0.7) % 1, on = (d: number) => (tt > 1 + d ? 1 : 0);
  return <Room tt={tt} c={cam([0, 1.3, 3.4], [0, 0.7, 0])} wall="brick" floor="concrete">
    <Lock3 p={[0, 1.15, -0.65]} s={1.4} led={0.5 + 0.5 * Math.sin(tt * 4.4)} />
    {[0, 1, 2].map((i) => { const f = (k + i / 3) % 1; return <mesh key={i} position={[0, 1.15, -0.6]} scale={0.3 + 2.4 * f}><torusGeometry args={[1, 0.012 / (0.3 + 2.4 * f) + 0.004, 8, 96]} /><meshBasicMaterial color={AMB} transparent opacity={0.5 * (1 - f)} toneMapped={false} /></mesh>; })}
    <Phone3 p={[-1.3, 0.35, 0.3]} rot={[1.2, 0.5, 0]} s={1.6} on={on(0.5)} />
    <Car3 p={[1.45, 0, 0.0]} rot={[0, -0.7, 0]} s={0.55} head={on(1.0)} />
    <Fob3 p={[-0.5, 0.06, 0.8]} rot={[0, 0.4, 0]} s={1.0} led={on(1.5)} />
  </Room>;
}}</Stage>;

// 5 · creer: el teléfono sigue lejos en la mesa de luz, pero la aguja del medidor de la cerradura salta a CERCA
export const S05: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const ang = 1.25 - 2.5 * spr(tt, 2.0, 7, 0.35);
  return <Room tt={tt} c={cam([0, 1.05, 2.9], [0, 0.85, 0])} wall="drywall">
    <group position={[0.35, 0.95, -0.7]} scale={1.55}>
      <RB p={[0, 0.15, -0.03]} s={[1.32, 0.78, 0.04]} rad={0.04} c="#2a2c31" r={0.5} />
      <mesh><circleGeometry args={[0.6, 64, 0, Math.PI]} /><meshStandardMaterial color="#f6f3ec" roughness={0.7} /></mesh>
      <mesh position={[0, 0, 0.004]}><ringGeometry args={[0.44, 0.56, 48, 1, 0, Math.PI / 2.2]} /><meshBasicMaterial color="#c62a22" /></mesh>
      <mesh position={[0, 0, 0.004]}><ringGeometry args={[0.44, 0.56, 48, 1, Math.PI - Math.PI / 2.2, Math.PI / 2.2]} /><meshBasicMaterial color="#9aa0a8" /></mesh>
      <Plate p={[-0.4, -0.12, 0.01]} w={0.38} h={0.15} txt={["FAR"]} size={200} />
      <Plate p={[0.4, -0.12, 0.01]} w={0.38} h={0.15} txt={["NEAR"]} fg="#c62a22" size={190} />
      <group position={[0, 0, 0.03]} rotation={[0, 0, ang]}><RB p={[0, 0.25, 0]} s={[0.035, 0.5, 0.02]} rad={0.01} c="#22252b" r={0.4} /></group>
      <mesh position={[0, 0, 0.045]}><circleGeometry args={[0.05, 24]} /><meshStandardMaterial color="#2a2c31" /></mesh>
    </group>
    <RB p={[-1.0, 0.28, 0.1]} s={[0.6, 0.56, 0.5]} rad={0.03} c="#6a4a32" r={0.6} />
    <Phone3 p={[-1.0, 0.58, 0.1]} rot={[0, 0.3, 0]} s={1.3} on={0.15} />
  </Room>;
}}</Stage>;

// 6 · mayo 2022: el sello de goma baja con peso sobre el informe y deja FOOLED en rojo
export const S06: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const down = sm(tt, 1.4, 1.8) * (1 - sm(tt, 2.4, 3.0)), mark = tt > 1.8 ? 1 : 0;
  return <Room tt={tt} c={cam([0, 1.9, 1.5], [0, 0.45, -0.1])} wall="wood">
    <RB p={[0, 0.4, 0]} s={[1.8, 0.06, 1.0]} rad={0.01} c="#7a4a2a" r={0.6} />
    <RB p={[0, 0.44, 0]} s={[0.8, 0.008, 0.6]} rad={0.003} c="#fbfaf6" r={0.9} />
    {[...Array(5)].map((_, i) => <RB key={i} p={[0, 0.446, -0.22 + i * 0.05]} s={[0.6, 0.002, 0.012]} rad={0.001} c="#c8c4bc" r={0.9} />)}
    <Plate p={[0, 0.448, 0.12]} rot={[-Math.PI / 2, 0, 0]} w={0.56} h={0.16} txt={["FOOLED"]} bg="#fbfaf6" fg="#c62a22" size={190} op={mark} />
    <Plate p={[-0.62, 0.62, -0.3]} rot={[-0.4, 0.3, 0]} w={0.36} h={0.3} txt={["MAY", "2022"]} size={150} />
    <group position={[0.15, 0.5 + 0.45 * (1 - down), 0.12]}><RB s={[0.58, 0.06, 0.2]} rad={0.01} c="#3a2a1e" r={0.6} /><RB p={[0, 0.12, 0]} s={[0.1, 0.2, 0.1]} rad={0.03} c="#6a4a32" r={0.5} /><mesh position={[0, 0.27, 0]}><sphereGeometry args={[0.09, 24, 24]} /><Mat c="#c62a22" r={0.4} /></mesh></group>
  </Room>;
}}</Stage>;

// 7 · 30 segundos: reloj de arena grande; cuando cae el último grano, la palanca de la pared baja
export const S07: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const k = c01((tt - 0.6) / 5), lev = sm(tt, 5.7, 6.1);
  return <Room tt={tt} c={cam([0, 1.0, 2.3], [0.15, 0.75, 0])} wall="drywall">
    <Hourglass3 p={[-0.35, 0, 0]} s={1.55} k={k} />
    <group position={[0.75, 1.0, -0.7]}><RB s={[0.3, 0.5, 0.06]} rad={0.03} c="#3a3d44" r={0.5} /><group position={[0, 0, 0.04]} rotation={[0.7 - 1.4 * lev, 0, 0]}><RB p={[0, 0.16, 0.02]} s={[0.07, 0.32, 0.07]} rad={0.03} c="#c62a22" r={0.4} /></group></group>
  </Room>;
}}</Stage>;

// 8 · ocho pies: cinta métrica amarilla del sillón a la puerta; el hijo se da vuelta y la puerta se abre
export const S08: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const tape = sm(tt, 0.6, 2.2), roll = sm(tt, 3.0, 3.6), open = sm(tt, 3.8, 5.0);
  return <Room tt={tt} c={cam([0.2, 2.4, 3.6], [0.2, 0.5, 0])} wall="drywall" z={-0.2}>
    <Sofa3 p={[-1.3, 0, 0.6]} rot={[0, Math.PI / 2, 0]} s={1.0} />
    <Person3 p={[-1.3, 0.35, 0.6]} yaw={Math.PI / 2 + roll * 0.9} s={0.8} sit={1} col="#4a6a8a" />
    <Door3 p={[1.2, 0, -0.12]} open={open} />
    <RB p={[-0.9 + 1.0 * tape, 0.02, 0.9]} s={[2.0 * tape + 0.01, 0.006, 0.08]} rad={0.002} c="#f2c230" r={0.5} />
    <Plate p={[0.1, 0.25, 1.0]} rot={[-0.4, 0, 0]} w={0.6} h={0.25} txt={["8 FT"]} bg="#f2c230" size={200} op={sm(tt, 1.8, 2.2)} />
  </Room>;
}}</Stage>;

// 9 · once veces: once fichas rojas caen de a una y se apilan en una torre al pie del reloj de pared
export const S09: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const n = Math.min(11, Math.floor(c01((tt - 0.5) / 5.5) * 12));
  return <Room tt={tt} c={cam([0, 1.2, 2.6], [0, 0.85, 0])} wall="brick">
    <group position={[-0.5, 1.25, -0.72]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.42, 0.42, 0.06, 64]} /><Mat c="#2a2c31" r={0.4} /></mesh><mesh position={[0, 0, 0.032]}><circleGeometry args={[0.38, 64]} /><meshStandardMaterial color="#f6f3ec" /></mesh>{[...Array(12)].map((_, j) => <RB key={j} p={[Math.sin(j / 12 * Math.PI * 2) * 0.31, Math.cos(j / 12 * Math.PI * 2) * 0.31, 0.04]} rot={[0, 0, -j / 12 * Math.PI * 2]} s={[0.025, 0.08, 0.01]} rad={0.004} c="#22252b" r={0.5} />)}<group position={[0, 0, 0.05]} rotation={[0, 0, -Math.PI * 2 * 5 / 12 * c01((tt - 0.5) / 5.5)]}><RB p={[0, 0.12, 0]} s={[0.03, 0.24, 0.01]} rad={0.005} c="#c62a22" r={0.4} /></group></group>
    <RB p={[0.45, 0.3, 0]} s={[0.6, 0.6, 0.5]} rad={0.02} c="#6a4a32" r={0.6} />
    {[...Array(11)].map((_, i) => i < n ? <mesh key={i} position={[0.45, 0.63 + i * 0.055 + (i === n - 1 ? drop(tt, 0.5 + (i + 1) * 0.5, 0.4) : 0), 0]}><cylinderGeometry args={[0.17, 0.17, 0.05, 40]} /><Mat c="#c62a22" r={0.45} /></mesh> : null)}
    <Plate p={[1.15, 0.95, -0.3]} w={0.5} h={0.4} txt={[`${n}`]} bg="#101114" fg="#ff5a3a" size={300} op={n > 0 ? 1 : 0} />
  </Room>;
}}</Stage>;

// 10 · tres teléfonos parados en atriles: el dedo apaga uno, otro y otro (la pantalla ámbar se apaga)
export const S10: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const off = (i: number) => sm(tt, 1.2 + i * 1.3, 1.5 + i * 1.3);
  const fx = tt < 1.2 ? -0.75 : tt < 2.5 ? -0.75 : tt < 3.8 ? 0 : 0.75;
  return <Room tt={tt} c={cam([0, 1.2, 2.5], [0, 0.75, 0])} wall="drywall">
    <RB p={[0, 0.3, 0]} s={[2.4, 0.6, 0.7]} rad={0.02} c="#7a4a2a" r={0.6} />
    {[-0.75, 0, 0.75].map((x, i) => <group key={i} position={[x, 0.95, 0]} rotation={[Math.PI / 2 - 0.25, 0, 0]}><Phone3 s={1.35} on={1 - off(i)} col={AMB} /></group>)}
    <Hand3 p={[fx, 1.0, 0.45 - 0.12 * Math.abs(Math.sin(Math.PI * c01((tt - 1.0) / 1.3)))]} rot={[0.2, 0, 0]} s={1.4} />
  </Room>;
}}</Stage>;

// 11 · las palabras peligrosas: cinco placas apiladas; un haz de luz baja y cada una se prende en rojo
export const S11: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const W = ["AUTO", "PROXIMITY", "TOUCH TO OPEN", "HANDS-FREE", "GEOFENCE"], y = 1.7 - c01((tt - 0.8) / 5) * 1.3;
  return <Room tt={tt} c={cam([0, 1.05, 2.6], [0, 1.05, 0])} wall="drywall">
    {W.map((w, i) => { const py = 1.6 - i * 0.26, hit = y < py + 0.05 ? 1 : 0; return <Plate key={i} p={[0, py, -0.7]} w={1.5} h={0.2} txt={[w]} bg={hit ? "#c62a22" : "#ece7dc"} fg={hit ? "#ffffff" : "#6a6c70"} size={w.length > 9 ? 88 : 120} />; })}
    <mesh position={[0, y, -0.66]}><planeGeometry args={[1.7, 0.06]} /><meshBasicMaterial color="#fff1d0" transparent opacity={0.55} toneMapped={false} /></mesh>
  </Room>;
}}</Stage>;

// 12 · el raro: cuatro teléfonos desde arriba; tres oscuros, uno sigue rojo y un hilo rojo lo une al pestillo
export const S12: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const off = (i: number) => sm(tt, 0.8 + i * 0.6, 1.1 + i * 0.6), th = c01((tt - 3.0) / 1.6);
  return <Room tt={tt} c={[{ t: 0, p: [0, 2.6, 1.0], l: [0, 0.35, -0.2], fov: 40 }, { t: 12, p: [0.15, 2.85, 1.15], l: [0, 0.35, -0.2], fov: 40, arc: 0.02 }]} wall="wood" z={-1.2}>
    <RB p={[0, 0.3, 0]} s={[2.2, 0.06, 1.2]} rad={0.01} c="#7a4a2a" r={0.6} />
    {[-0.75, -0.25, 0.25, 0.75].map((x, i) => <Phone3 key={i} p={[x, 0.35, 0.15]} s={1.15} on={i === 3 ? 1 : 1 - off(i)} col={i === 3 ? RED : AMB} />)}
    <Lock3 p={[0.2, 0.36, -0.42]} rot={[-Math.PI / 2, 0, 0]} s={0.9} bolt={th > 0.99 ? 0 : 1} led={1} ledCol={RED} />
    <Thread a={[0.75, 0.37, 0.1]} b={[0.2, 0.37, -0.32]} lift={0.25} k={th} col={RED} r={0.014} />
  </Room>;
}}</Stage>;

// 13 · el dial del auto-lock: perilla grande; el puntero gira hasta la zona verde y la puerta se cierra sola
export const S13: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const ang = 2.2 - 2.2 * spr(tt, 0.8, 6, 0.5) * 0.62, shut = sm(tt, 2.6, 3.6);
  const face = useTxt(["30 s       3 min"], 1024, 256, "#00000000", "#22252b", 110, "Arial Black");
  return <Room tt={tt} c={cam([0.1, 1.15, 3.4], [0.05, 1.0, 0])} wall="drywall" z={-0.2}>
    <Door3 p={[0.75, 0, -0.12]} open={0.7 * (1 - shut)} bolt={sm(tt, 3.6, 3.9)} />
    <group position={[-0.65, 1.0, -0.1]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.5, 0.5, 0.05, 64]} /><Mat c="#f6f3ec" r={0.6} /></mesh>
      <mesh position={[0, 0, 0.027]}><ringGeometry args={[0.36, 0.47, 64, 1, 0.6, 1.0]} /><meshBasicMaterial color="#3a9a5a" /></mesh>
      <mesh position={[0, 0.6, 0.03]}><planeGeometry args={[1.1, 0.27]} /><meshBasicMaterial map={face} transparent /></mesh>
      <group position={[0, 0, 0.06]} rotation={[0, 0, ang]}><RB s={[0.16, 0.16, 0.08]} rad={0.07} c="#2a2c31" r={0.4} /><RB p={[0, 0.25, 0]} s={[0.04, 0.38, 0.03]} rad={0.012} c="#c62a22" r={0.4} /></group>
    </group>
  </Room>;
}}</Stage>;

// 14 · cartel verde de ruta: llega desde el fondo de la ruta y frena centrado: LEE'S SUMMIT · 2019
export const S14: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const z = -9 + 8.4 * (1 - Math.exp(-1.1 * Math.max(0, tt - 0.2)));
  return <Studio tt={tt} floor="none" warm={0.95} photo={0} bg="#9fb6c8" keys={cam([0, 1.3, 2.4], [0, 1.25, -1.5], 42)}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -6]}><planeGeometry args={[40, 30]} /><Mat c="#7a8a5a" r={0.9} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -6]}><planeGeometry args={[3.2, 30]} /><Mat c="#3a3c40" r={0.9} /></mesh>
    {[...Array(10)].map((_, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 2 - ((i * 2.4 + tt * 6) % 24)]}><planeGeometry args={[0.1, 1.0]} /><meshBasicMaterial color="#f2f0e8" /></mesh>)}
    <group position={[0, 0, z]}>
      {[-1.0, 1.0].map((x, i) => <mesh key={i} position={[x, 1.0, 0]}><cylinderGeometry args={[0.05, 0.05, 2.0, 12]} /><Mat c="#9aa0a8" m={0.8} r={0.3} /></mesh>)}
      <Plate p={[0, 1.65, 0.06]} w={2.2} h={0.9} txt={["LEE'S SUMMIT", "2019"]} bg="#1f6a3a" fg="#ffffff" size={105} />
    </group>
  </Studio>;
}}</Stage>;

// 15 · el pestillo pega en el marco: vista de canto, la puerta no cerró del todo y el bolt choca contra la madera
export const S15: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const out = sm(tt, 1.5, 1.8), hit = tt > 1.8 ? Math.exp(-(tt - 1.8) * 6) * Math.sin((tt - 1.8) * 40) : 0;
  return <Room tt={tt} c={cam([0, 1.05, 1.6], [0, 1.0, 0])} wall="drywall" z={-0.9}>
    <group position={[0.45 + 0.01 * hit, 0, 0]}><RB p={[0, 1.0, 0]} s={[0.35, 2.0, 0.5]} rad={0.01} c="#e8dcc6" r={0.7} /><RB p={[-0.17, 1.0, 0.0]} s={[0.02, 0.2, 0.12]} rad={0.002} c="#c9a23a" m={0.9} r={0.3} /><RB p={[-0.176, 1.0, 0.0]} s={[0.012, 0.06, 0.05]} rad={0.002} c="#1a1a1a" r={0.9} /></group>
    <group position={[-0.5, 0, 0.1]}><RB p={[0, 1.0, 0]} s={[0.7, 2.0, 0.12]} rad={0.01} c="#7a2a24" r={0.55} /><RB p={[0.35 + 0.22 * out, 1.0, 0]} s={[0.24, 0.06, 0.05]} rad={0.012} c="#d8b04a" m={0.9} r={0.3} /></group>
  </Room>;
}}</Stage>;

// 16 · la balanza: la cerradura cara de un lado, el tronco de pino del otro; la viga se inclina hacia la madera
export const S16: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const tilt = 0.28 * spr(tt, 2.2, 5, 0.3) * (tt > 2.2 ? 1 : 0), lockIn = drop(tt, 0.4, 0.7), logIn = drop(tt, 1.6, 0.9);
  const L = (sd: number) => [sd * 0.75 * Math.cos(tilt), -sd * 0.75 * Math.sin(tilt)];
  const [lx, ly] = L(-1), [rx, ry] = L(1);
  return <Room tt={tt} c={cam([0, 1.2, 2.7], [0, 0.95, 0])} wall="drywall">
    <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.05, 0.12, 1.2, 20]} /><Mat c="#3a3d44" m={0.7} r={0.35} /></mesh>
    <group position={[0, 1.2, 0]} rotation={[0, 0, -tilt]}><RB s={[1.6, 0.05, 0.08]} rad={0.015} c="#c9a23a" m={0.9} r={0.3} /></group>
    <group position={[lx, 1.2 + ly - 0.25, 0]}><mesh><cylinderGeometry args={[0.28, 0.24, 0.04, 40]} /><Mat c="#c9a23a" m={0.9} r={0.3} /></mesh><Lock3 p={[0, 0.2 + lockIn, 0]} s={0.9} led={0.6} /></group>
    <group position={[rx, 1.2 + ry - 0.25, 0]}><mesh><cylinderGeometry args={[0.28, 0.24, 0.04, 40]} /><Mat c="#c9a23a" m={0.9} r={0.3} /></mesh><mesh position={[0, 0.12 + logIn, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.1, 0.1, 0.5, 24]} /><Mat c="#d8b884" r={0.85} /></mesh></group>
  </Room>;
}}</Stage>;

// 17 · la patada: una bota golpea; el pestillo queda entero y lo que vuela es la madera del marco
export const S17: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const kick = sm(tt, 1.4, 1.7), hit = c01((tt - 1.7) / 1.6);
  return <Room tt={tt} c={cam([0.1, 1.05, 1.8], [0.1, 0.95, 0])} wall="drywall" z={-0.9}>
    <RB p={[0.55, 1.0, 0]} s={[0.35, 2.0, 0.5]} rad={0.01} c="#e8dcc6" r={0.7} />
    <RB p={[-0.25, 1.0, 0.0]} s={[0.9, 2.0, 0.12]} rad={0.01} c="#7a2a24" r={0.55} />
    <RB p={[0.28, 1.0, 0]} s={[0.2, 0.06, 0.05]} rad={0.012} c="#d8b04a" m={0.9} r={0.3} />
    {[...Array(9)].map((_, i) => <RB key={i} p={[0.38 + hit * (0.3 + 0.5 * rnd(i)), 1.0 + (rnd(i, 2) - 0.5) * 0.3 + hit * (0.5 * rnd(i, 3)) - 1.6 * hit * hit, 0.1 + hit * 0.6 * rnd(i, 4)]} rot={[hit * 6 * rnd(i, 5), hit * 4, hit * 5 * rnd(i, 6)]} s={[0.02, 0.18 + 0.12 * rnd(i, 7), 0.03]} rad={0.004} c="#e2d2b4" r={0.8} />)}
    <group position={[-0.9 + 0.5 * kick, 0.7, 0.45]} rotation={[0, 0, -0.2]}>
      <RB p={[0, 0, 0]} s={[0.5, 0.18, 0.22]} rad={0.06} c="#4a3426" r={0.7} /><RB p={[-0.12, 0.35, 0]} s={[0.2, 0.6, 0.2]} rad={0.06} c="#4a3426" r={0.7} /><RB p={[0.02, -0.11, 0]} s={[0.54, 0.05, 0.24]} rad={0.02} c="#1a1a1a" r={0.9} />
    </group>
  </Room>;
}}</Stage>;

// 18 · el cerradero desarmado: la placa se separa del marco y salen los dos tornillos cortitos; al lado baja uno de 3"
export const S18: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const ex = sm(tt, 0.8, 2.0), big = drop(tt, 2.8, 0.9);
  return <Room tt={tt} c={cam([0, 1.05, 1.9], [0.15, 1.0, 0])} wall="drywall" z={-0.9}>
    <RB p={[-0.25, 1.0, -0.2]} s={[0.4, 2.0, 0.3]} rad={0.01} c="#e8dcc6" r={0.7} />
    <RB p={[-0.25, 1.0, -0.04 + 0.25 * ex]} s={[0.2, 0.5, 0.02]} rad={0.01} c="#c9a23a" m={0.9} r={0.3} />
    {[0.82, 1.18].map((y, i) => <Screw3 key={i} p={[-0.25, y, 0.05 + 0.55 * ex]} rot={[Math.PI / 2, 0, 0]} L={0.12} spin={ex * 12} />)}
    <Screw3 p={[0.55, 1.0 + big, 0.1]} rot={[0, 0, 0]} L={0.5} c="#7ec08a" />
  </Room>;
}}</Stage>;

// 19 · el tornillo largo: corte del marco (moldura, hueco, montante); el de 3" gira, atraviesa y muerde la madera de la casa
export const S19: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const go = sm(tt, 1.0, 4.2);
  return <Room tt={tt} c={cam([0, 1.5, 1.9], [0, 0.95, 0])} wall="drywall" z={-1.0}>
    <RB p={[-0.35, 1.0, -0.2]} s={[0.12, 1.8, 0.4]} rad={0.004} c="#efe9dd" r={0.6} />
    <RB p={[0.3, 1.0, -0.2]} s={[0.55, 1.8, 0.4]} rad={0.004} c="#c89a5a" r={0.75} />
    {[...Array(6)].map((_, i) => <RB key={i} p={[0.08 + i * 0.09, 1.0, -0.0]} s={[0.006, 1.8, 0.002]} rad={0.001} c="#9a6a3a" r={0.9} />)}
    <group position={[-0.95 + 0.7 * go, 1.0, -0.2]} scale={2.6}><Screw3 rot={[0, 0, Math.PI / 2]} L={0.33} spin={go * 30} /></group>
  </Room>;
}}</Stage>;

// 20 · huellas: teclado metálico grande con luz rasante; cuatro botones se ponen brillosos de a uno
export const S20: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const worn = [1, 5, 6, 10];
  return <Room tt={tt} c={cam([0.2, 1.1, 1.5], [0, 1.0, -0.4])} wall="brick" z={-0.55}>
    <group position={[0, 1.0, -0.45]}>
      <RB s={[0.7, 1.0, 0.06]} rad={0.04} c="#8a8f96" m={0.85} r={0.35} />
      {[...Array(12)].map((_, i) => { const x = -0.2 + (i % 3) * 0.2, y = 0.33 - Math.floor(i / 3) * 0.21, w = worn.indexOf(i), g = w >= 0 ? sm(tt, 1.0 + w * 0.8, 1.6 + w * 0.8) : 0; return <RB key={i} p={[x, y, 0.045]} s={[0.15, 0.15, 0.04]} rad={0.03} c={g > 0.5 ? "#e8e0c8" : "#6a6e74"} m={0.9} r={0.5 - 0.4 * g} />; })}
    </group>
    <spotLight position={[-1.6, 1.0, 0.1]} angle={0.4} penumbra={0.4} intensity={14} distance={4} color="#ffd9a0" />
  </Room>;
}}</Stage>;

// 21 · los códigos malos: torta, chapa 4025, almanaque y 1-2-3-4 caen de a uno al tacho
export const S21: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const f = (i: number) => c01((tt - 0.8 - i * 1.1) / 0.8), shake = [0, 1, 2, 3].reduce((a, i) => a + (tt > 1.6 + i * 1.1 ? Math.exp(-(tt - 1.6 - i * 1.1) * 8) : 0), 0);
  const Fall: React.FC<{ i: number; children: React.ReactNode }> = ({ i, children }) => { const k = f(i), end = 0.6 + i * 0.12; return k <= 0 ? null : <group position={[-0.9 + 0.9 * k + (i % 2 ? 0.06 : -0.06) * k, 1.45 + 0.25 * Math.sin(Math.PI * k) - (1.45 - end) * k * k, 0.04 * i]} rotation={[0, 0, (1 - k) * 2 + (i % 2 ? 0.2 : -0.2) * k]}>{children}</group>; };
  return <Room tt={tt} c={cam([0, 1.3, 2.9], [0, 0.75, 0])} wall="drywall">
    <group rotation={[0, 0, 0.03 * shake * Math.sin(tt * 50)]}><mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.38, 0.32, 0.7, 40, 1, true]} /><Mat c="#5a5c60" m={0.6} r={0.4} /></mesh><mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.32, 0.32, 0.01, 40]} /><Mat c="#3a3c40" r={0.6} /></mesh></group>
    <Fall i={0}><mesh><cylinderGeometry args={[0.18, 0.18, 0.14, 32]} /><Mat c="#f2d8e0" r={0.6} /></mesh><mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.012, 0.012, 0.1, 8]} /><Mat c="#ffd29f" r={0.4} /></mesh></Fall>
    <Fall i={1}><Plate p={[0, 0, 0]} w={0.42} h={0.18} txt={["4025"]} bg="#1e2a36" fg="#ffffff" size={260} /></Fall>
    <Fall i={2}><Plate p={[0, 0, 0]} w={0.3} h={0.3} txt={["1958"]} bg="#f6f3ec" fg="#c62a22" size={240} /></Fall>
    <Fall i={3}><Plate p={[0, 0, 0]} w={0.42} h={0.18} txt={["1234"]} bg="#f6f3ec" fg="#22252b" size={260} /></Fall>
  </Room>;
}}</Stage>;

// 22 · el PIN hablado: cuatro tambores mecánicos giran a 4-8-1-6 y recién ahí la reja se abre
export const S22: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const digs = [4, 8, 1, 6], gate = sm(tt, 5.0, 5.8);
  return <Room tt={tt} c={cam([0, 1.05, 2.2], [0, 1.0, 0])} wall="drywall" z={-0.7}>
    {digs.map((d, i) => { const stop = 1.0 + i * 0.9, a = tt < stop ? tt * 14 : 0, n = tt < stop ? Math.floor(tt * 7 + i * 3) % 10 : d; return <Drum key={i} x={-0.6 + i * 0.4} n={n} wob={a} />; })}
    {[...Array(5)].map((_, i) => <RB key={i} p={[-0.8 + i * 0.4, 1.0 + 1.1 * gate, 0.3]} s={[0.035, 0.9, 0.035]} rad={0.012} c="#3a3d44" m={0.8} r={0.35} />)}
  </Room>;
}}</Stage>;
const Drum: React.FC<{ x: number; n: number; wob: number }> = ({ x, n, wob }) => {
  const m = useTxt([`${n}`], 256, 256, "#f6f3ec", "#22252b", 210, "Arial Black");
  return <group position={[x, 1.0, 0]}><mesh rotation={[wob % (Math.PI * 2), 0, Math.PI / 2]}><cylinderGeometry args={[0.22, 0.22, 0.3, 32]} /><Mat c="#d8d2c4" r={0.6} /></mesh><mesh position={[0, 0, 0.222]}><planeGeometry args={[0.26, 0.26]} /><meshBasicMaterial map={m} /></mesh></group>;
};

// 23 · la llave adentro: corte de la casa; ella afuera en la nieve con la cerradura muerta, la llave en el cajón de la cocina
export const S23: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const dr = sm(tt, 2.4, 3.2);
  return <Room tt={tt} c={cam([0, 1.4, 3.3], [0, 0.8, 0])} wall="brick" night={0.4} z={-0.9}>
    <RB p={[0, 1.0, -0.4]} s={[0.12, 2.0, 1.0]} rad={0.01} c="#e8dcc6" r={0.7} />
    <Lock3 p={[-0.08, 1.05, 0.1]} rot={[0, -Math.PI / 2, 0]} s={0.8} dead />
    <Person3 p={[-0.9, 0, 0.3]} yaw={Math.PI / 2} s={0.95} col="#6a4a5a" />
    {[...Array(40)].map((_, i) => <mesh key={i} position={[-1.9 + rnd(i) * 1.7, 2.2 - ((tt * (0.25 + 0.25 * rnd(i, 2)) + rnd(i, 3)) % 1) * 2.2, -0.3 + rnd(i, 4) * 1.0]}><sphereGeometry args={[0.012, 6, 6]} /><meshBasicMaterial color="#ffffff" /></mesh>)}
    <RB p={[1.0, 0.45, -0.1]} s={[0.9, 0.9, 0.5]} rad={0.02} c="#d8c8a8" r={0.7} />
    <group position={[1.0, 0.7, 0.17 + 0.3 * dr]}><RB s={[0.7, 0.18, 0.04]} rad={0.01} c="#c8b48a" r={0.6} /><RB p={[0, 0.0, -0.15]} s={[0.66, 0.1, 0.3]} rad={0.005} c="#b8a47a" r={0.7} /><group position={[0, 0.08, -0.12]} rotation={[-Math.PI / 2, 0, 0.3]} scale={1.6}><RB s={[0.05, 0.16, 0.012]} rad={0.004} c="#d8b04a" m={1} r={0.25} /><mesh position={[0, 0.11, 0]}><torusGeometry args={[0.04, 0.012, 8, 20]} /><Mat c="#d8b04a" m={1} r={0.25} /></mesh></group></group>
  </Room>;
}}</Stage>;

// 24 · semanas de aviso: seis cerraduras en fila, una por semana; cada LED parpadea ámbar y la última se apaga
export const S24: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  return <Room tt={tt} c={cam([0, 1.0, 2.6], [0, 0.85, 0])} wall="wood" z={-0.6}>
    {[0, 1, 2, 3, 4, 5].map((i) => { const on = tt > 0.6 + i * 0.8, last = i === 5; const led = !on ? 0 : last ? (tt < 6.0 ? 0.5 + 0.5 * Math.sin(tt * 10) : 0) : 0.4 + 0.4 * Math.sin(tt * 8 + i); return <group key={i}><Lock3 p={[-1.25 + i * 0.5, 1.05 + drop(tt, 0.3 + i * 0.12, 0.5), -0.5]} s={0.95} led={led} dead={last && tt > 6.0} /><Plate p={[-1.25 + i * 0.5, 0.5, -0.5]} w={0.44} h={0.18} txt={[`WK ${i + 1}`]} size={220} /></group>; })}
  </Room>;
}}</Stage>;

// 25 · el puente de 9 V: la pila sube hasta los dos puntos de abajo del teclado y el teclado revive de abajo para arriba
export const S25: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const up = sm(tt, 0.8, 2.0), lit = c01((tt - 2.1) / 1.6);
  return <Room tt={tt} c={cam([0.2, 0.75, 1.6], [0, 0.85, -0.3])} wall="brick" z={-0.5}>
    <group position={[0, 1.05, -0.4]}>
      <RB s={[0.5, 0.8, 0.06]} rad={0.04} c="#22252b" m={0.4} r={0.35} />
      {[...Array(12)].map((_, i) => { const row = 3 - Math.floor(i / 3), on = lit * 4 > row ? 1 : 0; return <RB key={i} p={[-0.14 + (i % 3) * 0.14, 0.27 - Math.floor(i / 3) * 0.15, 0.04]} s={[0.1, 0.1, 0.03]} rad={0.02} c={on ? "#ffd29f" : "#3a3d44"} r={0.5} />; })}
      {[-0.06, 0.06].map((x, i) => <mesh key={i} position={[x, -0.41, 0]}><sphereGeometry args={[0.018, 12, 12]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh>)}
    </group>
    <group position={[0, 0.25 + 0.36 * up, -0.4]}><RB s={[0.18, 0.3, 0.1]} rad={0.015} c="#1e3a7a" r={0.4} /><RB p={[0, -0.04, 0.051]} s={[0.18, 0.1, 0.002]} rad={0.001} c="#d8b04a" r={0.4} />{[-0.05, 0.05].map((x, i) => <mesh key={i} position={[x, 0.17, 0]}><cylinderGeometry args={[0.022, 0.022, 0.04, 6]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh>)}</group>
  </Room>;
}}</Stage>;

// 26 · el parche: la cerradura con grieta roja; una luz viaja por el cable y la grieta se cierra
export const S26: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const pk = c01((tt - 0.8) / 2.0), heal = sm(tt, 2.8, 4.2);
  return <Room tt={tt} c={cam([0, 1.05, 2.0], [0, 1.0, 0])} wall="drywall" z={-0.6}>
    <Lock3 p={[0.45, 1.0, -0.4]} s={1.6} crack={1 - heal} led={heal} ledCol={GRN} />
    <RB p={[-0.45, 0.8, -0.45]} s={[1.3, 0.025, 0.025]} rad={0.01} c="#2a2c31" r={0.5} />
    <mesh position={[-1.1 + 1.3 * pk, 0.8, -0.43]}><sphereGeometry args={[0.04 * (pk > 0 && pk < 1 ? 1 : 0), 16, 16]} /><meshBasicMaterial color="#9fe0ff" toneMapped={false} /></mesh>
  </Room>;
}}</Stage>;

// 27 · el rolodex: rueda de tarjetas que gira y pasa al frente PAINTER, DOG WALKER, CLEANER, GUEST
export const S27: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const names = ["PAINTER", "DOG WALKER", "CLEANER", "GUEST"], i = Math.min(3, Math.floor(c01((tt - 0.6) / 5) * 4)), flip = ((tt - 0.6) / 1.25) % 1;
  return <Room tt={tt} c={cam([0, 1.05, 1.9], [0, 0.85, 0])} wall="wood">
    <RB p={[0, 0.3, 0]} s={[1.6, 0.6, 0.7]} rad={0.02} c="#6a4a32" r={0.6} />
    <mesh position={[0, 0.82, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.9, 16]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
    {[...Array(10)].map((_, j) => <group key={j} position={[0, 0.82, 0]} rotation={[-(j / 10) * Math.PI * 2 + tt * 0.6, 0, 0]}><RB p={[0, 0.0, -0.24]} s={[0.7, 0.012, 0.4]} rad={0.004} c="#f2ede2" r={0.9} /></group>)}
    <Plate p={[0, 1.0, 0.56]} rot={[-0.15 + 0.2 * Math.max(0, 1 - flip * 4), 0, 0]} w={0.8} h={0.42} txt={[names[i]]} bg={i === 3 ? "#c62a22" : "#fbfaf6"} fg={i === 3 ? "#ffffff" : "#22252b"} size={130} />
  </Room>;
}}</Stage>;

// 28 · los martes: la grilla del mes en baldosas; cada martes se prende ámbar y al final aparece MIKE · 1 PM
export const S28: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  return <Room tt={tt} c={cam([0, 1.1, 3.0], [0, 1.0, 0])} wall="drywall" z={-0.6}>
    {[...Array(28)].map((_, i) => { const c = i % 7, r = Math.floor(i / 7), tue = c === 2, on = tue && tt > 1.2 + r * 0.8; return <RB key={i} p={[-0.9 + c * 0.3, 1.45 - r * 0.3 - drop(tt, 0.2 + i * 0.02, 0.4), -0.5]} s={[0.26, 0.26, 0.05]} rad={0.02} c={on ? AMB : "#ece7dc"} r={0.6} />; })}
    <Plate p={[0, 0.3, -0.3]} w={1.1} h={0.3} txt={["MIKE · 1 PM"]} bg="#22252b" fg="#ffb257" size={140} op={sm(tt, 4.6, 5.2)} />
  </Room>;
}}</Stage>;

// 29 · el código que vence: un boleto colgado de una pinza; llega el día y la parte del código se corta y cae
export const S29: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const fall = c01((tt - 3.0) / 1.2), day = tt > 2.6;
  return <Room tt={tt} c={cam([0, 1.2, 2.0], [0, 1.05, 0])} wall="drywall" z={-0.6}>
    <RB p={[0, 1.75, -0.45]} s={[0.12, 0.08, 0.06]} rad={0.01} c="#c9ced4" m={1} r={0.25} />
    <Plate p={[0, 1.35, -0.45]} w={0.9} h={0.5} txt={[day ? "JUNE 30" : "JUNE 29"]} bg="#f2c230" size={170} />
    <group position={[0, 0.82 - 1.6 * fall * fall, -0.45 + 0.4 * fall]} rotation={[fall * 0.8, 0, fall * 1.2]}><Plate p={[0, 0, 0]} w={0.9} h={0.45} txt={["CODE 7731"]} bg="#f2c230" size={150} /></group>
  </Room>;
}}</Stage>;

// 30 · rayos X a la maceta: una barra de luz baja y la maceta se vuelve transparente; adentro, la llave
export const S30: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const x = sm(tt, 1.0, 2.6);
  return <Room tt={tt} c={cam([0, 1.0, 2.0], [0, 0.55, 0])} wall="brick" floor="concrete">
    <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.42, 0.3, 0.7, 48]} /><meshStandardMaterial color="#b8643a" roughness={0.8} transparent opacity={1 - 0.8 * x} /></mesh>
    <mesh position={[0, 0.66, 0]}><cylinderGeometry args={[0.4, 0.4, 0.04, 40]} /><meshStandardMaterial color="#3a2a1e" roughness={1} transparent opacity={1 - 0.8 * x} /></mesh>
    {[...Array(5)].map((_, i) => <mesh key={i} position={[-0.2 + i * 0.1, 0.85, 0]} rotation={[0, 0, (i - 2) * 0.25]}><capsuleGeometry args={[0.03, 0.3, 4, 8]} /><Mat c="#4a7a3a" r={0.8} /></mesh>)}
    <group position={[0, 0.25, 0]} rotation={[0, tt * 0.8, 0.4]} scale={2.2}><RB s={[0.05, 0.16, 0.012]} rad={0.004} c="#d8b04a" m={1} r={0.25} /><mesh position={[0, 0.11, 0]}><torusGeometry args={[0.04, 0.012, 8, 20]} /><Mat c="#d8b04a" m={1} r={0.25} /></mesh></group>
    <mesh position={[0, 1.0 - 0.9 * x, 0.45]}><planeGeometry args={[1.2, 0.03]} /><meshBasicMaterial color="#9fd8ff" transparent opacity={x < 1 ? 0.8 : 0} toneMapped={false} /></mesh>
  </Room>;
}}</Stage>;

// 31 · dominó: la fila de fichas cae una tras otra; la última empuja la puerta, que se entreabre
export const S31: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const N = 9, open = sm(tt, 0.6 + N * 0.35, 1.2 + N * 0.35) * 0.3;
  return <Room tt={tt} c={cam([0.2, 1.3, 3.2], [0.4, 0.6, 0])} wall="drywall" z={-0.2}>
    {[...Array(N)].map((_, i) => { const k = sm(tt, 0.6 + i * 0.35, 0.95 + i * 0.35); return <group key={i} position={[-1.6 + i * 0.22, 0, 0.6]} rotation={[0, 0, -1.2 * k]}><RB p={[0, 0.2, 0]} s={[0.05, 0.4, 0.2]} rad={0.01} c={i === 0 ? "#c62a22" : "#f6f3ec"} r={0.5} /></group>; })}
    <Door3 p={[0.9, 0, -0.12]} rot={[0, -0.4, 0]} open={open} />
  </Room>;
}}</Stage>;

// 32 · el candado sobre el candado: un candado rojo baja en arco y se cierra sobre el aro del dorado
export const S32: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const k = sm(tt, 1.0, 2.4), snap = sm(tt, 2.4, 2.6);
  const Pad: React.FC<{ s: number; col: string; sh: number }> = ({ s, col, sh }) => <group scale={s}><RB s={[0.5, 0.42, 0.18]} rad={0.05} c={col} m={0.9} r={0.25} /><mesh position={[0, 0.21 + 0.08 * (1 - sh), 0]}><torusGeometry args={[0.16, 0.035, 12, 32, Math.PI]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh><mesh position={[0, 0, 0.092]}><circleGeometry args={[0.04, 16]} /><Mat c="#2a2c31" r={0.5} /></mesh></group>;
  return <Room tt={tt} c={cam([0, 1.1, 2.0], [0, 0.95, 0])} wall="drywall">
    <group position={[0, 0.8, 0]}><Pad s={1.6} col="#c9a23a" sh={1} /></group>
    <group position={[0.9 - 0.9 * k, 1.9 - 0.62 * k + 0.3 * Math.sin(Math.PI * k), 0.05]} rotation={[0, 0, 0.6 * (1 - k)]}><Pad s={0.8} col="#c62a22" sh={snap} /></group>
  </Room>;
}}</Stage>;

// 33 · el router: se da vuelta y la etiqueta de abajo muestra la clave de fábrica, enorme
export const S33: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const fl = sm(tt, 0.8, 2.0);
  return <Room tt={tt} c={cam([0, 1.3, 2.2], [0, 0.85, 0])} wall="drywall">
    <RB p={[0, 0.3, 0]} s={[1.6, 0.6, 0.8]} rad={0.02} c="#6a4a32" r={0.6} />
    <group position={[0, 0.72 + 0.2 * Math.sin(Math.PI * fl), 0]} rotation={[-Math.PI * fl * 0.67, 0, 0]}>
      <RB s={[0.9, 0.12, 0.55]} rad={0.04} c="#ecebe6" r={0.4} />
      {[-0.35, 0.35].map((x, i) => <RB key={i} p={[x, 0.25, -0.24]} s={[0.04, 0.4, 0.04]} rad={0.015} c="#2a2c31" r={0.5} />)}
      <Plate p={[0, -0.075, 0]} rot={[Math.PI / 2, 0, 0]} w={0.8} h={0.42} txt={["admin1234"]} bg="#fbfaf6" size={150} />
    </group>
  </Room>;
}}</Stage>;

// 34 · lámina en el vidrio: dos ladrillos a la vez; el vidrio común se cae en pedazos, el de lámina queda en telaraña
export const S34: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const fly = sm(tt, 0.8, 1.4), br = c01((tt - 1.4) / 1.4);
  return <Room tt={tt} c={cam([0, 1.1, 2.6], [0, 1.0, 0])} wall="drywall" z={-0.9}>
    {[-0.6, 0.6].map((x, s) => <group key={s} position={[x, 1.05, -0.3]}>
      <RB s={[0.9, 1.1, 0.04]} rad={0.01} c="#5a4a3a" r={0.6} />
      {s === 1 || br === 0 ? <mesh position={[0, 0, 0.025]}><planeGeometry args={[0.8, 1.0]} /><meshPhysicalMaterial color="#d8ecff" transparent opacity={0.45} roughness={0.05} /></mesh> : null}
      {s === 0 && br > 0 && [...Array(12)].map((_, i) => <mesh key={i} position={[-0.3 + (i % 4) * 0.2 + br * (rnd(i) - 0.5) * 0.4, 0.35 - Math.floor(i / 4) * 0.33 - 1.6 * br * br * (0.6 + rnd(i, 2)), 0.03 + br * 0.4 * rnd(i, 3)]} rotation={[br * 4 * rnd(i, 4), br * 3, br * 5]}><planeGeometry args={[0.18, 0.28]} /><meshPhysicalMaterial color="#d8ecff" transparent opacity={0.5} side={2} /></mesh>)}
      {s === 1 && br > 0 && [...Array(10)].map((_, i) => <mesh key={i} position={[0, 0.05, 0.03]} rotation={[0, 0, (i / 10) * Math.PI * 2]}><planeGeometry args={[0.006, 0.4 * Math.min(1, br * 3) * (0.6 + 0.4 * rnd(i))]} /><meshBasicMaterial color="#ffffff" /></mesh>)}
      <RB p={[0, 0.05, 1.4 - 1.35 * fly]} rot={[fly * 3, fly * 2, 0]} s={[0.22, 0.1, 0.12]} rad={0.01} c="#a8462e" r={0.85} />
    </group>)}
  </Room>;
}}</Stage>;

// 35 · el brazo: por el vidrio de al lado entra un brazo largo y llega al pestillo; el pestillo se pone rojo
export const S35: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const r = sm(tt, 1.0, 3.0), touch = r > 0.98;
  return <Room tt={tt} c={cam([0.5, 1.3, 2.6], [0.1, 1.1, 0])} wall="drywall" z={-0.3}>
    <Door3 p={[0.3, 0, -0.2]} led={touch ? 1 : 0} ledCol={RED} />
    <group position={[-0.55, 1.15, -0.2]}><RB s={[0.3, 1.0, 0.06]} rad={0.01} c="#efe9dd" r={0.6} /><mesh position={[0, 0, 0.032]}><planeGeometry args={[0.22, 0.9]} /><meshPhysicalMaterial color="#d8ecff" transparent opacity={0.35} /></mesh></group>
    <Hand3 p={[-0.55 + 0.95 * r, 1.25, -0.05 - 0.5 * (1 - r)]} rot={[0, -Math.PI / 2, 0]} s={1.3} />
  </Room>;
}}</Stage>;

// 36 · el garage: el portón sube y detrás aparece la puerta a la cocina con un pomo viejo, sin cerrojo
export const S36: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const up = sm(tt, 1.0, 3.0);
  return <Room tt={tt} c={cam([0, 1.3, 3.6], [0, 1.0, 0])} wall="drywall" floor="concrete" z={-1.2}>
    <Door3 p={[0, 0, -1.1]} col="#efe9dd" lock={false} knobOld />
    <RB p={[-1.35, 1.1, 0]} s={[0.3, 2.2, 0.3]} rad={0.01} c="#e8dcc6" r={0.7} /><RB p={[1.35, 1.1, 0]} s={[0.3, 2.2, 0.3]} rad={0.01} c="#e8dcc6" r={0.7} />
    {[0, 1, 2, 3].map((i) => <RB key={i} p={[0, 0.27 + i * 0.52 + 2.1 * up, 0]} s={[2.4, 0.5, 0.06]} rad={0.01} c="#f2f0ea" r={0.5} />)}
  </Room>;
}}</Stage>;

// 37 · los grados: podio de tres escalones; la cerradura del 1 arriba, la del 3 abajo
export const S37: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const st = [[0, 0.6, "1"], [-0.62, 0.4, "2"], [0.62, 0.22, "3"]] as const;
  return <Room tt={tt} c={cam([0, 1.3, 2.9], [0, 0.85, 0])} wall="drywall">
    {st.map(([x, hh, n], i) => <group key={i}><RB p={[x, hh / 2, 0]} s={[0.58, hh, 0.6]} rad={0.02} c="#ece7dc" r={0.6} /><Plate p={[x, Math.max(0.11, hh / 2), 0.305]} w={0.3} h={Math.min(0.3, hh - 0.04)} txt={[n]} bg="#ece7dc" fg="#22252b" size={300} /><Lock3 p={[x, hh + 0.36 + drop(tt, 0.6 + i * 0.6, 0.9), 0]} s={1.0} led={i === 0 ? 0.8 : 0.2} /></group>)}
  </Room>;
}}</Stage>;

// 38 · el pasillo de los cinco errores: cinco puertas en fila; se cierran de a una y su LED queda verde
export const S38: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  return <Room tt={tt} c={cam([0, 1.25, 5.0], [0, 1.0, 0])} wall="drywall" z={-0.2}>
    {[0, 1, 2, 3, 4].map((i) => { const c = sm(tt, 0.8 + i * 1.0, 1.2 + i * 1.0); return <group key={i}><Door3 p={[-2.2 + i * 1.1, 0, -0.12]} s={0.9} open={0.75 * (1 - c)} led={c} ledCol={GRN} /><Plate p={[-2.2 + i * 1.1, 2.2, -0.1]} w={0.3} h={0.26} txt={[`${i + 1}`]} size={280} /></group>; })}
  </Room>;
}}</Stage>;

// 39 · la cerradura que se deja ver: la tapa se vuelve vidrio y adentro gira el engranaje y entra y sale el pestillo
export const S39: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const g = sm(tt, 0.8, 2.0), bolt = 0.5 + 0.5 * Math.sin((tt - 2) * 2.4);
  return <Room tt={tt} c={cam([0, 1.05, 1.5], [0, 1.0, 0])} wall="drywall" z={-0.6}>
    <group position={[0, 1.0, -0.2]}>
      <RB s={[0.9, 0.6, 0.25]} rad={0.06} c="#22252b" r={0.3} m={0.4} op={1 - 0.82 * g} />
      <group position={[-0.18, 0, 0]} rotation={[0, 0, tt * 2.4]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.16, 0.16, 0.05, 20]} /><Mat c="#c9a23a" m={0.9} r={0.3} /></mesh>{[...Array(10)].map((_, i) => <RB key={i} p={[Math.cos(i / 10 * Math.PI * 2) * 0.17, Math.sin(i / 10 * Math.PI * 2) * 0.17, 0]} rot={[0, 0, i / 10 * Math.PI * 2]} s={[0.04, 0.04, 0.05]} rad={0.005} c="#c9a23a" m={0.9} r={0.3} />)}</group>
      <RB p={[0.15 + 0.25 * bolt, 0, 0]} s={[0.4, 0.1, 0.08]} rad={0.02} c="#d8b04a" m={0.9} r={0.3} />
      <RB p={[-0.35, 0, 0]} s={[0.12, 0.2, 0.12]} rad={0.03} c="#5a5c60" m={0.6} r={0.4} />
    </group>
  </Room>;
}}</Stage>;

// 40 · la combinación escrita: la perilla gira y al costado está el papelito con la combinación; la caja fuerte se vuelve cartón
export const S40: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const box = sm(tt, 4.0, 5.0), col = box > 0.5 ? "#b8885a" : "#3a3d44";
  return <Room tt={tt} c={cam([0.3, 1.1, 2.3], [0, 0.7, 0])} wall="drywall">
    <RB p={[0, 0.55, 0]} s={[1.0, 1.1 - 0.3 * box, 0.9]} rad={0.03} c={col} m={box > 0.5 ? 0 : 0.7} r={box > 0.5 ? 0.9 : 0.35} />
    {box < 0.5 && <group position={[0, 0.65, 0.46]} rotation={[0, 0, Math.sin(tt * 2) * 2]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.16, 0.16, 0.05, 40]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh><RB p={[0, 0.12, 0.03]} s={[0.02, 0.06, 0.01]} rad={0.004} c="#c62a22" r={0.4} /></group>}
    <Plate p={[0.36, 0.95 - 0.3 * box, 0.455]} w={0.3} h={0.3} txt={["32-17-5"]} bg="#f8e76a" size={150} />
  </Room>;
}}</Stage>;

// 41 · cada uno su llave: cuatro llaves grandes en ganchos; la de la limpiadora cae en una valija que se cierra y se va
export const S41: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const fall = c01((tt - 1.6) / 0.9), lid = sm(tt, 2.6, 3.2), go = sm(tt, 3.6, 5.0);
  const cols = ["#3a7aca", "#c62a22", "#2a8a4a", "#d8a030"];
  return <Room tt={tt} c={cam([0, 1.1, 2.7], [0, 0.95, 0])} wall="wood" z={-0.6}>
    <RB p={[0, 1.6, -0.52]} s={[2.0, 0.12, 0.04]} rad={0.01} c="#7a4a2a" r={0.6} />
    {cols.map((c, i) => { const isC = i === 2, y = isC ? 1.32 - 1.0 * fall * fall : 1.32, x = -0.75 + i * 0.5 + (isC ? 0.25 * fall : 0); return isC && go > 0.01 ? null : <group key={i} position={[x, y, -0.45]}><mesh position={[0, 0.12, 0]}><torusGeometry args={[0.06, 0.015, 8, 24]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh><RB p={[0, -0.04, 0]} s={[0.06, 0.24, 0.015]} rad={0.005} c="#c9ced4" m={1} r={0.25} /><RB p={[0, -0.25, 0]} s={[0.2, 0.14, 0.01]} rad={0.01} c={c} r={0.6} /></group>; })}
    <group position={[0.5 + 2.5 * go, 0, -0.1]}><RB p={[0, 0.25, 0]} s={[0.6, 0.4, 0.25]} rad={0.04} c="#5a3a2a" r={0.6} /><group position={[0, 0.45, -0.12]} rotation={[-1.4 * (1 - lid), 0, 0]}><RB p={[0, 0.0, 0.12]} s={[0.6, 0.04, 0.25]} rad={0.02} c="#5a3a2a" r={0.6} /></group></group>
  </Room>;
}}</Stage>;

// 42 · la cuña: vista de costado; la puerta empuja, choca con la cuña amarilla y frena en seco; después cae la barra bajo el pomo
export const S42: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const push = tt < 1.6 ? sm(tt, 0.8, 1.6) * 0.32 : 0.32 - 0.04 * Math.exp(-(tt - 1.6) * 5) * Math.sin((tt - 1.6) * 30), bar = sm(tt, 3.0, 3.6);
  return <Room tt={tt} c={cam([2.0, 1.2, 2.0], [0, 0.8, 0])} wall="drywall" z={-1.2}>
    <Door3 p={[0, 0, -0.6]} open={push} lock={false} />
    <mesh position={[0.3, 0.13, 0.2]} rotation={[0, Math.PI / 2, 0]} scale={2.2}><cylinderGeometry args={[0.0, 0.12, 0.3, 3]} /><Mat c="#f2c230" r={0.5} /></mesh>
    <group position={[0.4, 0, 0.5]} rotation={[0.55 * bar - 0.55, 0, 0]}><RB p={[0, 0.5, 0]} s={[0.04, 1.0, 0.04]} rad={0.015} c="#2a2c31" m={0.8} r={0.3} /></group>
  </Room>;
}}</Stage>;

// 43 · la cámara mira, el interruptor cierra: la cámara ilumina la puerta abierta; la mano baja el interruptor y la puerta se cierra
export const S43: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const sw = sm(tt, 2.4, 2.8), shut = sm(tt, 2.8, 3.8);
  return <Room tt={tt} c={cam([0, 1.3, 3.2], [0, 1.0, 0])} wall="drywall" z={-0.2}>
    <Door3 p={[-0.5, 0, -0.12]} open={0.8 * (1 - shut)} bolt={sm(tt, 3.8, 4.1)} />
    <group position={[-1.15, 2.0, -0.05]} rotation={[0.5, 0.6, 0]}><RB s={[0.18, 0.12, 0.26]} rad={0.03} c="#ecebe6" r={0.4} /><mesh position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.03, 20]} /><Mat c="#1a1a1a" r={0.2} /></mesh></group>
    <group position={[0.85, 1.1, -0.1]} scale={1.6}><RB s={[0.3, 0.46, 0.05]} rad={0.03} c="#ecebe6" r={0.5} /><group position={[0, 0, 0.04]} rotation={[0.5 - 1.0 * sw, 0, 0]}><RB p={[0, 0, 0.03]} s={[0.08, 0.16, 0.06]} rad={0.02} c="#d8d2c4" r={0.5} /></group></group>
  </Room>;
}}</Stage>;

// 44 · el dueño: el llavero cae con peso en la bandeja de madera de la entrada, junto a la placa OWNER, y se enciende
export const S44: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const f = c01((tt - 1.0) / 0.9), y = 1.55 - 0.74 * f * f, land = f >= 1 ? Math.exp(-(tt - 1.9) * 7) : 0;
  return <Room tt={tt} c={cam([0, 1.25, 2.1], [0, 0.85, 0])} wall="drywall">
    <RB p={[0, 0.3, 0]} s={[1.6, 0.6, 0.7]} rad={0.02} c="#6a4a32" r={0.6} />
    <RB p={[0, 0.65, 0.05]} s={[0.7, 0.08, 0.45]} rad={0.03} c="#b8844e" r={0.55} />
    <Fob3 p={[0, y + 0.02 * land, 0.05]} rot={[f >= 1 ? -0.3 : 0.4 + f * 1.2, 0, 0]} s={1.1} led={f >= 1 ? 1 : 0} />
    <Plate p={[0, 1.25, -0.72]} w={0.9} h={0.3} txt={["OWNER"]} bg="#22252b" fg="#ffffff" size={220} />
  </Room>;
}}</Stage>;

// 45 · el domingo de 10 minutos: una rueda de diez porciones; se prende una por cada minuto
export const S45: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  // QC 29-oct: la pieza dura ~48 s y antes se llenaba en 6 s → 40 s congelado. Ahora se llena a lo largo de toda la pieza y la rueda gira despacio
  const D = Math.max(8, (h.out ?? 0) - (h.at ?? 0) - 3), n = Math.min(10, Math.floor(c01((tt - 0.5) / D) * 10.99)), spin = tt * 0.12;
  return <Room tt={tt} c={cam([0, 1.1, 2.2], [0, 1.05, 0])} wall="drywall" z={-0.7}>
    <group position={[0, 1.05, 0]} rotation={[0, 0, -spin]}><group position={[0, -1.05, 0]}>{[...Array(10)].map((_, i) => <mesh key={i} position={[0, 1.05, -0.55 + (i < n ? 0.04 : 0)]}><circleGeometry args={[0.62, 32, Math.PI / 2 - (i + 1) * Math.PI / 5 + 0.02, Math.PI / 5 - 0.04]} /><meshStandardMaterial color={i < n ? "#ffb257" : "#d8d2c4"} roughness={0.6} /></mesh>)}</group></group>
    <Plate p={[0, 1.05, -0.48]} w={0.38} h={0.38} txt={[`${n}`]} bg="#22252b" fg="#ffffff" size={300} />
  </Room>;
}}</Stage>;

export const HEROES_3S = {
  nightwatch: S01, radar: S02, ghosts: S03, beacon: S04, believe: S05, paper2022: S06, sandglass: S07, couchplan: S08, clock11: S09, threephones: S10,
  scanner: S11, oddone: S12, autolockdial: S13, citysign: S14, bolthit: S15, pricescale: S16, kick: S17, strikeexplode: S18, deepscrew: S19, smudge: S20,
  badcodes: S21, voicepin: S22, keyinside: S23, warnweeks: S24, jump9v: S25, patch: S26, rolodex: S27, tuesdays: S28, expire: S29, potxray: S30,
  domino: S31, nested: S32, router: S33, filmglass: S34, armreach: S35, garagepanel: S36, grades: S37, hallfive: S38, glasslock: S39, safecombo: S40,
  owncodes: S41, wedge: S42, camvsswitch: S43, owner: S44, sunday10: S45,
};
