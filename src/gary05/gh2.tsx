// gary05 · componentes únicos 2/4 (min 5-10).
import React from "react";
import { H, cl, eio, phys } from "./hkit";
import { M, RBox, Scene3D, lerp, rn, tubeG } from "./h3d";
import { PI, Txt3, Mark, PBox, roll } from "./gk";
import { Board, Flame, Furnace, TSwitch } from "./fk";

type V = [number, number, number];
const z1 = (k: number) => Math.max(0.001, k);

// 5:22 · LA PLACA DICE 9, LA PINZA DICE 4.8: una pila de ladrillos de vatios sube hasta 1080 (9 A × 120); la pinza marca
// 4.8 A y todo lo que sobra arriba de 580 se desarma y cae rodando al piso. La diferencia queda tirada a la vista.
export const HRay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#0e0f12"
  cam={{ at: [0, 0.5, 0], az: [-0.45, -0.2], el: [0.14, 0.1], r: [2.0, 1.75], fov: 34 }}>{(tt) => {
  const N = 18, bh = 0.055, keep = 10, crumble = 3.0;  // 18 ladrillos ≈ 1080 W; quedan 10 ≈ 580 W
  return <>
    {Array.from({ length: N }, (_, i) => {
      const at = 0.3 + i * 0.09, row = i, y0 = 0.03 + row * bh + bh / 2, land = phys(tt, at, 10, 0.5), yIn = y0 + (1 - land) * 0.8 * (tt < at + 0.6 ? 1 : 0);
      const off = i >= keep && tt > crumble + (i - keep) * 0.05;
      const k = off ? cl((tt - crumble - (i - keep) * 0.05) / 0.9) : 0, dir = rn(i, 2) > 0.5 ? 1 : -1;
      const x = (i % 2 ? 0.02 : -0.02) + dir * k * (0.3 + 0.4 * rn(i, 4)), y = Math.max(0.03 + bh / 2, yIn - k * k * (y0 + 0.2)), rz = dir * k * (2 + 3 * rn(i, 5));
      return <group key={i} position={[x, tt < at ? 5 : y, (rn(i, 6) - 0.5) * 0.3 * k]} rotation={[0, 0, rz]}>
        <RBox s={[0.42, bh - 0.006, 0.2]} r={0.008}>{M.matte({ col: i >= keep ? "#c8562e" : "#d58a3a" })}</RBox>
      </group>;
    })}
    <Txt3 txt="PLATE  9 A × 120 = 1080 W" w={0.62} h={0.06} col="#f2c21b" p={[0, 0.03 + N * bh + 0.08, 0]} op={cl((tt - 1.9) / 0.3) * (1 - cl((tt - crumble) / 0.3))} />
    <Txt3 txt="CLAMPED  4.8 A = 580 W" w={0.6} h={0.06} col="#6fe39a" glow p={[0, 0.03 + keep * bh + 0.08, 0.02]} op={cl((tt - crumble - 0.6) / 0.3)} />
    {/* la raya de los 580 */}
    <mesh position={[0, 0.03 + keep * bh, 0.11]}><boxGeometry args={[0.6, 0.006, 0.004]} />{M.glow({ col: "#6fe39a", op: cl((tt - crumble) / 0.3) })}</mesh>
  </>;
}}</Scene3D>;

// 6:22 · ONDA PURA CONTRA ONDA CORTADA: dos rieles; arriba la bolita corre por la onda suave y cae en la placa (verde);
// abajo el riel es de escalones, la bolita va a los tumbos, salta del riel y la placa se pone roja.
export const HSine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" bg="#0b0d11"
  cam={{ at: [0.15, 0.0, 0], az: [-0.18, 0.12], el: [0.12, 0.08], r: [2.1, 1.85], fov: 34 }}>{(tt) => {
  const X0 = -0.75, X1 = 0.45, A = 0.07, f = (x: number) => A * Math.sin((x - X0) * 9);
  const step = (x: number) => A * Math.sign(Math.sin((x - X0) * 9)) * (Math.abs(Math.sin((x - X0) * 9)) > 0.5 ? 1 : 0.4);
  const sm = Array.from({ length: 80 }, (_, i) => { const x = lerp(X0, X1, i / 79); return [x, 0.22 + f(x), 0]; });
  const u = cl((tt - 0.5) / 2.2), xa = lerp(X0, X1, u), inA = u >= 1;
  const ub = cl((tt - 0.5) / 2.0), xb = lerp(X0, lerp(X0, X1, 0.62), ub), off = ub >= 1, fly = cl((tt - 2.5) / 0.9);
  const yb = -0.22 + step(xb) + 0.03 * Math.abs(Math.sin(tt * 18)) * (off ? 0 : 1);
  return <>
    <mesh geometry={tubeG("sinA", sm, 0.008, 160, 8)}>{M.chrome()}</mesh>
    {Array.from({ length: 24 }, (_, i) => { const x0 = lerp(X0, X1, i / 24), x1 = lerp(X0, X1, (i + 1) / 24), y = step((x0 + x1) / 2); return <mesh key={i} position={[(x0 + x1) / 2, -0.22 + y, 0]}><boxGeometry args={[x1 - x0 + 0.002, 0.022, 0.03]} />{M.glow({ col: "#ff9a8a" })}</mesh>; })}
    <Txt3 txt="PURE SINE" w={0.3} h={0.06} col="#6fe39a" glow p={[-0.55, 0.36, 0]} />
    <Txt3 txt="MODIFIED SINE" w={0.36} h={0.06} col="#ff6a5a" glow p={[-0.5, -0.08, 0]} />
    <mesh position={[inA ? X1 + 0.12 : xa, inA ? 0.2 : 0.22 + f(xa) + 0.025, 0]}><sphereGeometry args={[0.022, 24, 16]} />{M.chrome({ col: "#9fe7ff" })}</mesh>
    <mesh position={[off ? xb + fly * 0.35 : xb, off ? yb + 0.25 * Math.sin(PI * fly) - fly * fly * 0.6 : yb + 0.025, off ? fly * 0.3 : 0]}><sphereGeometry args={[0.022, 24, 16]} />{M.chrome({ col: "#ffb0a0" })}</mesh>
    <Board t={tt} on={1} p={[X1 + 0.16, 0.12, 0]} s={1.3} />
    <Board t={tt} on={1} err={cl((tt - 2.6) / 0.3)} p={[X1 + 0.16, -0.32, 0]} s={1.3} />
    <Mark ok k={cl((tt - 2.8) / 0.4)} p={[X1 + 0.38, 0.2, 0.05]} s={0.6} />
    <Mark k={cl((tt - 3.1) / 0.4)} p={[X1 + 0.38, -0.24, 0.05]} s={0.6} />
  </>;
}}</Scene3D>;

// 7:05 · CAPACIDAD = LEÑA: cada tronco del leñero son 250 Wh; ruedan y se apilan; con 4 llegan a la raya de 1000 (MÍNIMO),
// con 8 a la de 2000 (MEJOR); la chapa del leñero dice LFP.
export const HCapacity: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" bg="#0f0e0d"
  cam={{ at: [0.08, 0.32, 0], az: [-0.3, 0.1], el: [0.18, 0.12], r: [1.95, 1.75], fov: 34 }}>{(tt) => {
  const rr = 0.07, pos = (i: number): V => { const row = Math.floor(i / 4), c = i % 4; return [-0.21 + c * 0.14 + (row % 2) * 0.0, 0.08 + rr + row * (rr * 1.75), 0]; };
  const wh = Math.min(8, Math.floor(cl((tt - 0.4) / 3.2) * 8.999)) * 250;
  return <>
    {/* el leñero de hierro */}
    {[-0.32, 0.32].map((x) => <mesh key={x} position={[x, 0.36, 0]}><boxGeometry args={[0.02, 0.72, 0.24]} />{M.matte({ col: "#2a2b2e" })}</mesh>)}
    <mesh position={[0, 0.07, 0]}><boxGeometry args={[0.66, 0.02, 0.24]} />{M.matte({ col: "#2a2b2e" })}</mesh>
    {[[1000, 2, "#f2c21b", "MINIMUM"], [2000, 4, "#6fe39a", "BETTER"]].map(([v, rows, col, lab]) => { const y = 0.08 + (rows as number) * rr * 1.75 + 0.005; return <group key={v as number}>
      <mesh position={[0, y, 0.125]}><boxGeometry args={[0.66, 0.006, 0.004]} />{M.glow({ col: col as string })}</mesh>
      <Txt3 txt={`${v} Wh · ${lab}`} w={0.34} h={0.05} col={col as string} glow p={[0.55, y, 0.12]} /></group>; })}
    {Array.from({ length: 8 }, (_, i) => {
      const at = 0.4 + i * 0.4, k = eio(tt, at, at + 0.45), [x, y, z] = pos(i), land = phys(tt, at + 0.45, 11, 0.5);
      return <group key={i} position={[lerp(-1.1, x, k), y + (1 - k) * 0.05 + (tt > at + 0.45 ? (1 - land) * 0.015 : 0), z]} rotation={[0, 0, -(1 - k) * 6]} visible={tt > at - 0.02}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[rr, rr * 0.95, 0.22, 20]} />{M.wood({ base: [128, 92, 58], rx: 1, ry: 2 })}</mesh>
        <mesh position={[0, 0, 0.111]}><circleGeometry args={[rr * 0.97, 24]} /><meshStandardMaterial color="#d9b483" roughness={0.9} /></mesh>
        <Txt3 txt="250" w={0.08} h={0.04} col="#3a2a18" p={[0, 0, 0.113]} />
      </group>;
    })}
    <Txt3 txt={`${wh} Wh`} w={0.3} h={0.08} col="#ffffff" glow p={[-0.6, 0.62, 0]} />
    <Txt3 txt="LFP" w={0.14} h={0.06} col="#1b1d21" bg="#f2c21b" p={[0, 0.03, 0.125]} />
  </>;
}}</Scene3D>;

// 7:39 · LA LLAMA LLEVA CORRIENTE: la varilla del sensor dentro de la llama azul; puntitos de corriente cruzan la llama,
// bajan por el quemador al cable verde de tierra y vuelven a la placa; la aguja de microamperes se levanta.
export const HFlame: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" bg="#07080b"
  cam={{ at: [-0.1, 0.06, 0], az: [-0.25, 0.1], el: [0.14, 0.1], r: [1.4, 1.25], fov: 32 }}>{(tt) => {
  const on = cl((tt - 0.7) / 0.6), loop: number[][] = [[-0.06, 0.12, 0], [-0.06, 0.02, 0], [-0.06, -0.08, 0], [0.1, -0.16, 0.02], [0.35, -0.16, 0.02], [0.42, -0.05, 0], [0.42, 0.14, 0], [0.12, 0.2, 0], [0.0, 0.16, 0]];
  const pt = (u: number): V => { const s = u * (loop.length - 1), i = Math.min(loop.length - 2, Math.floor(s)), f = s - i; return [lerp(loop[i][0], loop[i + 1][0], f), lerp(loop[i][1], loop[i + 1][1], f), lerp(loop[i][2], loop[i + 1][2], f)]; };
  const ua = roll(tt, 1.2, 3.2, 0, 60) / 10;
  return <>
    <mesh position={[-0.06, -0.1, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.035, 0.24, 18]} />{M.steel({ col: "#8a8f94" })}</mesh>
    <Flame k={on} t={tt} s={3.2} p={[-0.06, -0.06, 0]} />
    <pointLight position={[-0.06, 0.05, 0.15]} intensity={2.5 * on} distance={1} color="#6aa0ff" />
    {/* la varilla del sensor metida en la llama */}
    <mesh position={[0.0, 0.08, 0]} rotation={[0, 0, 0.9]}><cylinderGeometry args={[0.004, 0.004, 0.2, 10]} />{M.steel({ col: "#d9dcdf" })}</mesh>
    <mesh position={[0.12, 0.16, 0]}><boxGeometry args={[0.04, 0.03, 0.02]} />{M.porcelain()}</mesh>
    {/* el cable verde de tierra hacia la placa */}
    <mesh geometry={tubeG("flg", loop.slice(2, 6), 0.006, 60, 8)}>{M.rubber({ col: "#2f8a3f" })}</mesh>
    <mesh geometry={tubeG("flw", loop.slice(6), 0.006, 40, 8)}>{M.rubber({ col: "#efece4" })}</mesh>
    {Array.from({ length: 22 }, (_, i) => { const p = pt(((tt * 0.3 + i / 22) % 1)); return <mesh key={i} position={p}><sphereGeometry args={[0.007, 8, 6]} />{M.glow({ col: "#7ad0ff", op: on })}</mesh>; })}
    <Board t={tt} on={1} p={[0.42, 0.0, -0.02]} s={1.2} />
    {/* el microamperímetro de aguja */}
    <group position={[-0.5, 0.08, 0.02]} scale={1.5}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.03, 40]} />{M.plastic({ col: "#e9e7e1" })}</mesh>
      <group position={[0, -0.06, 0.017]} rotation={[0, 0, 1.1 - 2.2 * (ua / 8)]}><mesh position={[0, 0.06, 0]}><boxGeometry args={[0.004, 0.12, 0.003]} />{M.matte({ col: "#c62a22" })}</mesh></group>
      <Txt3 txt={`${ua.toFixed(1)} µA`} w={0.16} h={0.045} col="#1b1d21" p={[0, -0.085, 0.017]} />
    </group>
    <Txt3 txt="FLAME SIGNAL" w={0.36} h={0.07} col="#7ad0ff" glow p={[-0.3, 0.38, 0.02]} op={on} />
    <group>
    </group>
  </>;
}}</Scene3D>;

// 8:08 · TRES INTENTOS Y BLOQUEO: el gas abre, la llama prende, la placa no la ve y la válvula se cierra de un giro;
// pasa tres veces, cada vez marcada en el dial; a la tercera cae colgando la chapa LOCKOUT de su cadenita y se balancea.
export const HFloating: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark" bg="#0b0c10"
  cam={{ at: [0.15, 0.28, 0], az: [-0.35, 0.05], el: [0.12, 0.08], r: [1.85, 1.65], fov: 34 }}>{(tt) => {
  const tries = [0.4, 1.7, 3.0], cyc = (a: number) => cl((tt - a) / 0.25) * (1 - cl((tt - a - 0.8) / 0.15));
  const fl = Math.max(...tries.map(cyc)), lock = tt > 4.1 ? phys(tt, 4.1, 7, 0.18) : 0;
  return <>
    <Furnace t={tt} p={[-0.25, 0, -0.1]} k={{ open: 1, ind: 1, fl, led: 1, err: lock > 0 ? 1 : 0 }} s={0.62} />
    {/* la válvula de gas: la manija gira cerrando cada vez */}
    <group position={[0.22, 0.25, 0.05]}>
      <RBox s={[0.12, 0.09, 0.08]} r={0.01}>{M.brass()}</RBox>
      <group rotation={[0, 0, -PI / 2 * (1 - fl)]} position={[0, 0.08, 0]}><mesh position={[0.05, 0, 0]}><boxGeometry args={[0.12, 0.02, 0.02]} />{M.matte({ col: "#d0382a" })}</mesh></group>
    </group>
    {/* el dial de intentos */}
    {tries.map((a, i) => <group key={i} position={[0.55 + i * 0.13, 0.62, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.02, 28]} />{M.matte({ col: "#1f2125" })}</mesh>
      <Txt3 txt={String(i + 1)} w={0.05} h={0.05} col={tt > a + 0.8 ? "#ff6a5a" : "#8a9099"} glow={tt > a + 0.8} p={[0, 0, 0.012]} />
    </group>)}
    {/* la chapa LOCKOUT colgando de la cadenita */}
    <group position={[0.68, 0.52, 0.02]} rotation={[0, 0, 0.35 * Math.sin(tt * 3.2) * (1 - cl((tt - 4.1) / 2.5)) * (lock > 0 ? 1 : 0)]} visible={tt > 4.08}>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, -0.025 * i * lock, 0]} rotation={[0, i % 2 ? PI / 2 : 0, 0]}><torusGeometry args={[0.01, 0.003, 6, 14]} />{M.steel()}</mesh>)}
      <group position={[0, -0.2 * lock, 0]}><RBox s={[0.3, 0.12, 0.012]} r={0.01}>{M.matte({ col: "#d0382a" })}</RBox>
        <Txt3 txt="LOCKOUT" w={0.26} h={0.07} col="#ffffff" p={[0, 0, 0.008]} /></group>
    </group>
  </>;
}}</Scene3D>;

// 9:04 · SIN ENCHUFE: el enchufe entra flotando y recorre el cable del calefactor buscando dónde enchufarse; el cable
// termina atornillado adentro de la caja de metal de la pared (bornes y tornillos); el enchufe se cae.
export const HHardwired: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" bg="#0c0d10"
  cam={{ at: [0.15, 0.25, 0], at1: [0.45, 0.35, 0], az: [-0.3, -0.05], el: [0.1, 0.06], r: [1.4, 1.0], fov: 34 }}>{(tt) => {
  const path: number[][] = [[-0.6, 0.0, 0.05], [-0.2, 0.0, 0.08], [0.2, 0.2, 0.05], [0.45, 0.35, 0.0], [0.6, 0.35, -0.05]];
  const pt = (u: number): V => { const s = u * (path.length - 1), i = Math.min(path.length - 2, Math.floor(s)), f = s - i; return [lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f), lerp(path[i][2], path[i + 1][2], f)]; };
  const u = eio(tt, 0.6, 3.0) * 0.9, p = pt(u), drop = cl((tt - 3.4) / 0.6);
  return <>
    <mesh geometry={tubeG("hwc", path, 0.014, 80, 10)}>{M.rubber({ col: "#2b2c2e" })}</mesh>
    <mesh position={[0.62, 0.35, -0.12]}><planeGeometry args={[1.0, 1.0]} /><meshStandardMaterial color="#8b857a" roughness={0.95} /></mesh>
    <group position={[0.62, 0.35, -0.08]}>
      <RBox s={[0.2, 0.24, 0.07]} r={0.006}>{M.steel({ col: "#9aa2aa" })}</RBox>
      {[-0.05, 0, 0.05].map((x, i) => <group key={i} position={[x, -0.04, 0.04]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.01, 6]} />{M.brass()}</mesh>
        <mesh geometry={tubeG("hwt" + i, [[-0.05 + x * 0.3, 0.1, -0.02], [0, 0.05, 0.0], [0, 0.0, 0.004]], 0.004, 20, 6)}>{M.rubber({ col: ["#141416", "#efece4", "#2f8a3f"][i] })}</mesh>
      </group>)}
      <Txt3 txt="HARDWIRED" w={0.3} h={0.06} col="#f2c21b" glow p={[0, 0.2, 0.05]} op={cl((tt - 3.0) / 0.4)} />
    </group>
    {/* el enchufe que busca */}
    <group position={[p[0], p[1] + 0.09 - drop * drop * 0.9, p[2] + 0.05]} rotation={[0, 0.4 * Math.sin(tt * 2), drop * 1.4]}>
      <RBox s={[0.06, 0.07, 0.045]} r={0.01}>{M.rubber({ col: "#1c1d20" })}</RBox>
      {[-0.014, 0.014].map((x) => <mesh key={x} position={[x, 0.05, 0]}><boxGeometry args={[0.006, 0.035, 0.014]} />{M.brass()}</mesh>)}
    </group>
  </>;
}}</Scene3D>;

// 9:28 · LA LLAVE DE TRANSFERENCIA: dos ríos de energía llegan al calefactor (amarillo de la casa, azul de la batería);
// la palanca baja y una compuerta de acero cae con peso sobre la línea de la casa: lo de atrás no pasa, y no puede volver.
export const HTransfer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" bg="#0c0e12"
  cam={{ at: [-0.25, 0.4, 0], az: [-0.15, 0.1], el: [0.14, 0.1], r: [2.2, 2.0], fov: 34 }}>{(tt) => {
  const lev = eio(tt, 1.6, 2.0), gk = tt < 1.9 ? 0 : cl(phys(tt, 1.9, 9, 0.35));
  const house: number[][] = [[-1.0, 0.55, 0], [-0.4, 0.55, 0], [-0.05, 0.45, 0]], batt: number[][] = [[-1.0, 0.1, 0.1], [-0.4, 0.1, 0.1], [-0.05, 0.35, 0.04]];
  const flowH = 1 - lev, flowB = lev;
  return <>
    <mesh geometry={tubeG("trh", house, 0.016, 40, 8)}>{M.rubber({ col: "#8a7a5a" })}</mesh>
    <mesh geometry={tubeG("trb", batt, 0.016, 40, 8)}>{M.rubber({ col: "#5a6a7a" })}</mesh>
    {Array.from({ length: 14 }, (_, i) => { const u = (tt * 0.6 + i / 14) % 1, x = lerp(-1.0, -0.05, u), blocked = x > -0.52 && gk > 0.5;
      return <mesh key={"h" + i} position={[blocked ? -0.53 : x, x < -0.4 ? 0.55 : lerp(0.55, 0.45, (x + 0.4) / 0.35), 0]}><sphereGeometry args={[0.012, 8, 6]} />{M.glow({ col: "#ffcf4a", op: flowH > 0.05 ? 1 : blocked ? 0.25 : 0 })}</mesh>; })}
    {Array.from({ length: 14 }, (_, i) => { const u = (tt * 0.6 + i / 14) % 1, x = lerp(-1.0, -0.05, u);
      return <mesh key={"b" + i} position={[x, x < -0.4 ? 0.1 : lerp(0.1, 0.35, (x + 0.4) / 0.35), x < -0.4 ? 0.1 : lerp(0.1, 0.04, (x + 0.4) / 0.35)]}><sphereGeometry args={[0.012, 8, 6]} />{M.glow({ col: "#5ab8ff", op: flowB })}</mesh>; })}
    <Txt3 txt="HOUSE" w={0.2} h={0.05} col="#ffcf4a" p={[-0.85, 0.63, 0]} />
    <Txt3 txt="BATTERY" w={0.24} h={0.05} col="#5ab8ff" p={[-0.85, 0.18, 0.1]} />
    <PBox w={0.24} h={0.18} d={0.16} p={[-1.12, 0.0, 0.1]} scr="100%" />
    {/* la compuerta de acero que cae sobre la línea de la casa */}
    <group position={[-0.52, 0.55 + 0.35 * (1 - gk), 0]}>
      <RBox s={[0.03, 0.18, 0.12]} r={0.004}>{M.steel({ col: "#6f757b" })}</RBox>
      {[-1, 1].map((s) => <mesh key={s} position={[0, 0.25, s * 0.07]}><boxGeometry args={[0.04, 0.7, 0.012]} />{M.matte({ col: "#2a2b2e" })}</mesh>)}
    </group>
    <TSwitch lev={lev} p={[0.08, 0.22, 0.02]} s={1.6} />
    <Furnace t={tt} p={[0.5, 0, -0.2]} k={{ open: 1, ind: 1, fl: 1, led: 1, blow: 1 }} s={0.5} />
    <Txt3 txt="CAN'T FEED BACK" w={0.4} h={0.06} col="#6fe39a" glow p={[-0.52, 0.86, 0.16]} op={cl((tt - 2.5) / 0.4)} />
  </>;
}}</Scene3D>;

// 10:02 · CORDÓN Y ENCHUFE: el enchufe del calefactor salta de la toma muerta, vuela en arco (la cámara lo sigue) y entra
// con un clic en la estación; la pantalla marca los vatios y adentro del calefactor se prende la llama.
export const HCordPlug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark" bg="#0c0e12"
  cam={{ at: [-0.3, 0.35, 0], at1: [0.1, 0.3, 0.05], az: [-0.2, 0.05], el: [0.14, 0.1], r: [2.2, 1.95], fov: 34 }}>{(tt) => {
  const from: V = [-0.4, 0.42, -0.12], to: V = [0.42, 0.2, 0.11], k = eio(tt, 0.9, 2.2), snap = tt > 2.2 ? phys(tt, 2.2, 14, 0.4) : 0, lit = cl((tt - 2.6) / 0.4);
  const p: V = [lerp(from[0], to[0], k), lerp(from[1], to[1], k) + Math.sin(PI * k) * 0.3, lerp(from[2] + 0.04, to[2] + 0.03, k) - 0.02 * snap];
  const w = roll(tt, 2.4, 3.2, 0, 460);
  return <>
    <mesh position={[-0.4, 0.42, -0.17]}><planeGeometry args={[0.32, 0.4]} /><meshStandardMaterial color="#7f7a72" roughness={0.95} /></mesh>
    <RBox s={[0.13, 0.19, 0.02]} p={[-0.4, 0.42, -0.15]} r={0.008}>{M.plastic({ col: "#efece4" })}</RBox>
    <mesh geometry={tubeG("cpc" + Math.round(k * 20), [[-0.76, 0.12, -0.45], [-0.62, 0.012, -0.2], [(p[0] - 0.62) / 2, 0.012, 0.12], [p[0], p[1] - 0.04, p[2]]], 0.012, 60, 8)}>{M.rubber({ col: "#e07a1f" })}</mesh>
    <group position={p} rotation={[0, 0, 0]}><RBox s={[0.05, 0.055, 0.035]} r={0.008}>{M.rubber({ col: "#e07a1f" })}</RBox>
      {[-0.011, 0.011].map((x) => <mesh key={x} position={[x, 0, 0.026]}><boxGeometry args={[0.004, 0.012, 0.025]} />{M.brass()}</mesh>)}</group>
    <PBox w={0.34} h={0.26} d={0.2} p={[0.42, 0, 0]} scr={`${w} W`} on={1} sticker="LFP" />
    <Furnace t={tt} p={[-1.0, 0, -0.55]} k={{ open: 1, ind: lit, fl: lit, led: lit }} s={0.6} />
    <Txt3 txt="ONLY WHERE CODE ALLOWS" w={0.8} h={0.09} col="#f2c21b" glow p={[0.0, 0.78, 0]} op={cl((tt - 3.2) / 0.4)} />
  </>;
}}</Scene3D>;
