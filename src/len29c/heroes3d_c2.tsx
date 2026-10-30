// len29c · 2ª vuelta en 3D real (kit h3d): espina, girar y subir, cuatro tirones, veinte tiras, gancho, vaso, tapones, placa, rebalse, puerta.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, RED, H } from "./hkit";
import { Hair, M, RBox, Scene3D, cl, curve, eio, lerp, phys, rn, tex, tubeG } from "./h3d";

const PI = Math.PI;
const sub = (pts: number[][], u: number, n = 30) => { const c = curve(pts), o: number[][] = []; for (let i = 0; i <= n; i++) { const p = c.getPointAt(Math.max(0.002, u) * i / n); o.push([p.x, p.y, p.z]); } return o; };
// la tira plástica con dientes (esqueleto de pez): largo L, dientes visibles hasta "k" (0..1)
const Strip: React.FC<{ L?: number; k?: number; col?: string; op?: number; w?: number }> = ({ L = 0.4, k = 1, col = "#e9f3f7", op = 0.75, w = 0.016 }) => {
  const n = Math.round(L / 0.022);
  return <group>
    <mesh position={[0, -L * k / 2, 0]} castShadow><boxGeometry args={[w, Math.max(0.001, L * k), 0.0025]} />{M.plastic({ col, op })}</mesh>
    {Array.from({ length: n }, (_, i) => { const y = -0.02 - i * 0.022; if (-y > L * k) return null; return [-1, 1].map((s) => <mesh key={i + "_" + s} position={[s * (w / 2 + 0.006), y + 0.004, 0]} rotation={[0, 0, s * -0.75]}><boxGeometry args={[0.014, 0.003, 0.0022]} />{M.plastic({ col, op })}</mesh>); })}
    <mesh position={[0, 0.012, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.014, 0.0035, 8, 24]} />{M.plastic({ col, op })}</mesh>
  </group>;
};
const tubTex = () => tex.text("c_tub", 256, 256, (g) => { g.fillStyle = "#f4f1ea"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(160,150,130,${0.04 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 2, 2); } });

// ---- 7:02 · LA ESPINA DE PESCADO: la tira translúcida se arma sola, columna primero y después cada par de dientes, como el esqueleto de un pez sobre la mesa ----
export const HFishbone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark"
  cam={{ at: [0, 0.01, 0], az: [0.1, -0.12], el: [0.95, 0.8], r: [0.75, 0.58], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="A PLASTIC DRAIN STRIP" col={AMB} />}>{(tt) => {
  const spine = eio(tt, 0.4, 1.4), n = 16, L = 0.5;
  return <group rotation={[-PI / 2, 0, PI / 2]} position={[-L / 2, 0.004, 0]}>
    {/* la columna */}
    <mesh position={[0, -L * spine / 2, 0]} castShadow><boxGeometry args={[0.018, Math.max(0.001, L * spine), 0.003]} />{M.plastic({ col: "#e8f2f6", op: 0.8 })}</mesh>
    {/* los dientes, de a pares, se abren hacia arriba (hacia el mango) */}
    {Array.from({ length: n }, (_, i) => { const k = cl(phys(tt, 1.3 + i * 0.16, 9, 0.4)); if (k <= 0.001) return null; const y = -0.03 - i * 0.028;
      return [-1, 1].map((s) => <mesh key={i + "_" + s} position={[s * (0.009 + 0.008 * k), y + 0.006 * k, 0]} rotation={[0, 0, s * -0.8 * k]} scale={[0.001 + k, 1, 1]}><boxGeometry args={[0.018, 0.0035, 0.0028]} />{M.plastic({ col: "#e8f2f6", op: 0.85 })}</mesh>); })}
    {/* la cabeza: el aro para tirar */}
    <mesh position={[0, 0.016, 0]} rotation={[PI / 2, 0, 0]} scale={0.001 + spine}><torusGeometry args={[0.018, 0.004, 10, 28]} />{M.plastic({ col: "#e8f2f6", op: 0.85 })}</mesh>
    {/* una luz que corre por la columna mostrando la dirección de los dientes */}
    {tt > 4.2 && (() => { const k = cl((tt - 4.2) / 1.2); return <mesh position={[0, -L * k, 0.004]}><sphereGeometry args={[0.01, 14, 10]} />{M.glow({ col: AMB, op: 0.9 * (1 - k * 0.3) })}</mesh>; })()}
  </group>;
}}</Scene3D>;

// ---- 7:20 · GIRAR Y SUBIR: caño en corte; la tira baja, gira (una flecha curva gruesa por cada vuelta) y sube despacio con el pelo enganchado en los dientes ----
export const HTwistPull: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark"
  cam={{ at: [0, -0.16, 0], az: [0.3, 0.15], el: [0.12, 0.08], r: [1.1, 0.98], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="TWIST · THEN PULL SLOW" col={AMB} />}>{(tt) => {
  const down = eio(tt, 0.3, 1.2), spin = eio(tt, 1.4, 3.6), up = eio(tt, 3.9, 6.2), y = lerp(0.1, -0.06, down) + 0.3 * up;
  const turns = Math.min(3, Math.floor(spin * 3.01));
  return <>
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.065, 0.4, 48]} />{M.matte({ col: "#d9d4ca" })}</mesh>
    <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.065, 0.065, 0.5, 48, 1, true]} />{M.glass({ op: 0.18, side: THREE.DoubleSide })}</mesh>
    {/* la mata quieta en el caño hasta que la tira la engancha */}
    <group position={[0, -0.3 + (spin > 0.6 ? 0.3 * up : 0), 0]}>
      {[0, 1, 2, 3].map((i) => <Hair key={i} id={"tw" + i} n={16} spread={0.03} r={0.0014} pts={[[-0.04, 0.02 * i, 0], [0, -0.03, 0.02], [0.04, 0.01, -0.02], [0.02, 0.04, 0.03]]} />)}
      <mesh><sphereGeometry args={[0.032, 20, 14]} />{M.grease({ col: "#6e5a44" })}</mesh>
    </group>
    {/* la tira: la cabeza queda arriba del piso, nunca sobre el título */}
    <group position={[0, y + 0.06, 0]} rotation={[0, spin * 6 * PI, 0]}><Strip L={0.42} col="#1d1e20" op={1} /></group>
    {/* una flecha curva gruesa por vuelta, apiladas */}
    {Array.from({ length: turns }, (_, i) => <group key={i} position={[0, -0.14 + i * 0.045, 0]} rotation={[-PI / 2, 0, i * 0.6]}>
      <mesh><torusGeometry args={[0.12, 0.007, 10, 56, PI * 1.5]} />{M.glow({ col: AMB, op: 0.9 * (1 - up) })}</mesh>
      <mesh position={[0.12, 0, 0]} rotation={[0, 0, PI / 2 + PI]}><coneGeometry args={[0.018, 0.04, 16]} />{M.glow({ col: AMB, op: 0.9 * (1 - up) })}</mesh>
    </group>)}
  </>;
}}</Scene3D>;

// ---- 7:54 · CUATRO TIRONES: cuatro tiras salen del desagüe una tras otra y quedan colgadas en fila: la 1ª con una mata enorme, la 4ª limpia ----
export const HFourPulls: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile"
  cam={{ at: [0, 0.34, -0.1], az: [-0.12, 0.1], el: [0.12, 0.08], r: [1.5, 1.35], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="I ALWAYS SAY FOUR" col={AMB} />}>{(tt) => <>
  <mesh position={[0, 0.002, 0.15]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.06, 40]} />{M.matte({ col: "#0b0c0e" })}</mesh>
  {/* la barra de toallas donde se cuelgan */}
  <mesh position={[0, 0.52, -0.1]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.9, 16]} />{M.chrome()}</mesh>
  {[0, 1, 2, 3].map((i) => { const a = 0.4 + i * 1.2, out = eio(tt, a, a + 0.7), hang = eio(tt, a + 0.7, a + 1.1);
    const x = lerp(0, -0.33 + i * 0.22, hang), y = lerp(0.02, 0.5, out), z = lerp(0.15, -0.1, hang), big = [1.6, 1.0, 0.45, 0][i];
    return tt > a ? <group key={i} position={[x, y, z]} rotation={[0, 0, 0.05 * Math.sin(tt * 3 + i) * hang]}>
      <Strip L={0.32} col="#1d1e20" op={1} />
      {big > 0 && <group position={[0, -0.24, 0.0]} scale={big}>
        <mesh><sphereGeometry args={[0.028, 18, 14]} />{M.grease({ col: "#6e5a44" })}</mesh>
        {[0, 1, 2].map((j) => <Hair key={j} id={"fp" + i + j} n={14} spread={0.03} r={0.0013} pts={[[-0.03, 0.03, 0], [0.0, 0.0, 0.02 * (j - 1)], [0.03, -0.04, 0.01], [-0.01, -0.08, 0]]} />)}
      </group>}
      {i === 3 && hang > 0.9 && <pointLight position={[0, -0.1, 0.12]} intensity={0.4} distance={0.4} color="#dff4ff" />}
    </group> : null; })}
</>}</Scene3D>;

// ---- 8:40 · VEINTE DE UNA: una tira cae sobre el mostrador de madera y se abre en abanico hasta que son veinte, cada una con su rebote y su sombra ----
export const HTwentyStrips: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [0, 0.02, 0.05], az: [0.0, 0.15], el: [0.8, 0.66], r: [0.95, 0.82], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="I WENT BACK FOR TWENTY" col={AMB} />}>{(tt) => <>
  {Array.from({ length: 20 }, (_, i) => { const a = 0.5 + i * 0.12, k = cl(phys(tt, a, 9, 0.38)), fan = eio(tt, a + 0.15, a + 0.7), ang = lerp(0, -1.2 + i * (2.4 / 19), fan);
    return tt > a - 0.3 ? <group key={i} position={[0, 0.003 + i * 0.0026 + 0.25 * (1 - k), 0.2]} rotation={[0, ang, 0]}>
      <group rotation={[-PI / 2, 0, 0]} position={[0, 0, 0]}><Strip L={0.38} col={["#1d1e20", "#24262a", "#e9f3f7"][i % 3]} op={i % 3 === 2 ? 0.8 : 1} /></group>
    </group> : null; })}
</>}</Scene3D>;

// ---- 9:21 · EL CALIBRE DEL GANCHO: caño transparente de cerca; un gancho grueso entra y empuja la mata para abajo; uno finito de un cuarto de pulgada entra al costado, la engancha y la sube ----
export const HHookGauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark"
  cam={{ at: [0, -0.12, 0], at1: [0.0, -0.08, 0], az: [0.25, 0.1], el: [0.1, 0.06], r: [0.95, 0.72], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="A TINY HOOK" col={AMB} />}>{(tt) => {
  const big = eio(tt, 0.4, 1.4) * (1 - eio(tt, 2.0, 2.6)), push = eio(tt, 0.9, 1.6) * 0.06;
  const thin = eio(tt, 2.8, 3.8), grab = eio(tt, 4.0, 5.8), hairY = -0.16 - push + 0.22 * grab;
  const hook = (r: number, col: string) => <>
    <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[r, r, 0.36, 12]} />{M.steel()}</mesh>
    <mesh position={[r * 2.6, 0, 0]} rotation={[0, 0, PI]}><torusGeometry args={[r * 2.6, r, 8, 24, PI]} />{M.steel()}</mesh>
    <mesh position={[0, 0.38, 0]}><cylinderGeometry args={[0.012, 0.012, 0.06, 16]} />{M.plastic({ col })}</mesh>
  </>;
  return <>
    <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[0.07, 0.07, 0.5, 48, 1, true]} />{M.glass({ op: 0.16, side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.05, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.006, 10, 48]} />{M.chrome()}</mesh>
    <group position={[0, hairY, 0]}>
      <mesh><sphereGeometry args={[0.03, 20, 14]} />{M.grease({ col: "#6e5a44" })}</mesh>
      {[0, 1, 2].map((i) => <Hair key={i} id={"hg" + i} n={16} spread={0.03} r={0.0015} pts={[[-0.04, 0.02, 0], [0, -0.02, 0.02 * (i - 1)], [0.04, 0.01, -0.02], [0.02, 0.05, 0.01]]} />)}
    </group>
    {/* el gancho grueso: empuja para abajo y se va */}
    {big > 0.01 && <group position={[-0.012, lerp(0.35, -0.12 - push, big), 0.0]}>{hook(0.009, "#3a3a3a")}</group>}
    {/* el gancho finito: entra por el costado de la mata y la engancha */}
    {thin > 0.01 && <group position={[0.032, lerp(0.35, -0.2, thin) + 0.22 * grab, 0.0]}>{hook(0.0035, RED)}</group>}
    {grab > 0 && grab < 1 && <mesh position={[0.03, hairY - 0.02, 0.0]}><sphereGeometry args={[0.006, 12, 10]} />{M.glow({ col: AMB, op: 0.9 })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 9:34 · EL PELO NO SE DISUELVE: en el borde de la bañera un vaso de vidrio con químico verde burbujea; la mata adentro sigue entera; una salpicadura cae al esmalte y lo deja opaco ----
export const HNoDissolve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="tile"
  cam={{ at: [0, 0.14, -0.1], az: [-0.3, 0.2], el: [0.26, 0.18], r: [0.95, 0.8], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="HAIR DOESN'T DISSOLVE" col={AMB} />}>{(tt) => {
  const fill = eio(tt, 0.4, 1.6), splash = cl((tt - 3.2) / 0.5), spot = cl((tt - 3.7) / 1.2);
  return <>
    {/* el borde ancho de la bañera de porcelana y la tina hacia adentro */}
    <RBox s={[1.2, 0.06, 0.24]} r={0.03} p={[0, -0.03, -0.12]}><meshPhysicalMaterial map={tubTex()} roughness={0.15} clearcoat={1} /></RBox>
    <mesh position={[0, -0.16, 0.25]} rotation={[-0.25, 0, 0]}><planeGeometry args={[1.2, 0.5]} /><meshPhysicalMaterial color="#f2efe8" roughness={0.18} clearcoat={1} /></mesh>
    {/* el vaso con el químico */}
    <group position={[-0.08, 0, -0.12]}>
      <mesh position={[0, 0.08, 0]} castShadow><cylinderGeometry args={[0.055, 0.05, 0.16, 48, 1, true]} />{M.glass({ op: 0.22 })}</mesh>
      <mesh position={[0, 0.001, 0]}><cylinderGeometry args={[0.05, 0.05, 0.003, 40]} />{M.glass({ op: 0.4 })}</mesh>
      {fill > 0 && <mesh position={[0, 0.003 + fill * 0.06, 0]}><cylinderGeometry args={[0.052, 0.049, fill * 0.12, 40]} />{M.water({ col: "#8fd34a", op: 0.55, em: "#2a4a0a", emI: 0.4 })}</mesh>}
      {/* la mata entera adentro, que se mece pero no se achica */}
      <group position={[0, 0.05 + 0.005 * Math.sin(tt * 2), 0]} rotation={[0, tt * 0.3, 0]}>
        <mesh><sphereGeometry args={[0.022, 18, 14]} />{M.grease({ col: "#4a3a2a" })}</mesh>
        {[0, 1, 2].map((i) => <Hair key={i} id={"nd" + i} n={14} spread={0.022} r={0.0012} pts={[[-0.03, 0.02, 0], [0, -0.02, 0.015 * (i - 1)], [0.03, 0.01, -0.01], [0.01, 0.035, 0.01]]} />)}
      </group>
      {/* las burbujas que suben y revientan */}
      {Array.from({ length: 16 }, (_, i) => { const k = ((tt * 0.6 + i / 16) % 1); return fill > 0.6 ? <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.07, 0.01 + k * 0.11, (rn(i, 3) - 0.5) * 0.07]}><sphereGeometry args={[0.003 + 0.004 * rn(i, 4), 10, 8]} />{M.glass({ op: 0.7 * (1 - k * 0.5), col: "#dfffc0" })}</mesh> : null; })}
    </group>
    {/* la salpicadura: una gota salta del vaso y cae sobre el esmalte */}
    {splash > 0 && splash < 1 && <mesh position={[lerp(-0.05, 0.16, splash), 0.13 + 0.08 * Math.sin(PI * splash) - 0.13 * splash, lerp(-0.12, -0.1, splash)]}><sphereGeometry args={[0.008, 14, 10]} />{M.water({ col: "#8fd34a", op: 0.9 })}</mesh>}
    {/* el esmalte se pone opaco y amarillento donde cayó */}
    {spot > 0 && <mesh position={[0.16, 0.0015, -0.1]} rotation={[-PI / 2, 0, 0]} scale={0.001 + spot}><circleGeometry args={[0.03, 32]} /><meshStandardMaterial color="#cfc79a" roughness={0.95} /></mesh>}
  </>;
}}</Scene3D>;

// ---- 9:54 · TRES TAPONES: sobre el borde de la bañera, tres tapones grandes; cada uno hace su gesto: la perilla se tira, el de pie se pisa, la palanca baja ----
export const HStoppers3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="tile"
  cam={{ at: [0, 0.06, -0.1], az: [-0.08, 0.08], el: [0.28, 0.2], r: [1.15, 1.0], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THREE KINDS OF STOPPERS" col={AMB} />}>{(tt) => {
  const g = (i: number) => cl(phys(tt, 0.3 + i * 0.35, 7, 0.45)), act = (i: number) => Math.sin(PI * cl((tt - 2.0 - i * 1.6) / 1.2));
  return <>
    <RBox s={[1.3, 0.06, 0.3]} r={0.03} p={[0, -0.03, -0.1]}><meshPhysicalMaterial map={tubTex()} roughness={0.15} clearcoat={1} /></RBox>
    {[0, 1, 2].map((i) => { const x = (i - 1) * 0.3, a = act(i), s = g(i);
      return <group key={i} position={[x, 0, -0.1]} scale={0.001 + s}>
        <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.06, 0.072, 48]} />{M.chrome()}</mesh>
        {/* la perilla: el tapón sube cuando se la tira */}
        {i === 0 && <group position={[0, 0.012 + 0.05 * a, 0]}>
          <mesh castShadow><cylinderGeometry args={[0.06, 0.058, 0.014, 48]} />{M.chrome()}</mesh>
          <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.012, 0.016, 0.04, 20]} />{M.chrome()}</mesh>
          <mesh position={[0, 0.055, 0]} castShadow><sphereGeometry args={[0.02, 20, 14]} />{M.chrome()}</mesh>
          {a > 0.05 && <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.004, 0.004, 0.06 * a, 10]} />{M.steel()}</mesh>}
        </group>}
        {/* el de pie: una cúpula que baja cuando la pisa un dedo */}
        {i === 1 && <>
          <mesh position={[0, 0.012 - 0.008 * a, 0]} scale={[1, 0.45 - 0.15 * a, 1]} castShadow><sphereGeometry args={[0.06, 32, 16, 0, 2 * PI, 0, PI / 2]} />{M.chrome()}</mesh>
          <mesh position={[0, 0.05 + 0.12 * (1 - a) - 0.01, 0.0]} rotation={[0.3, 0, 0]} scale={[1, 0.7, 1.3]}><sphereGeometry args={[0.022, 20, 14]} />{M.matte({ col: "#d9a184" })}</mesh>
        </>}
        {/* la palanca: el tapón queda adentro, la palanca del costado baja */}
        {i === 2 && <>
          <mesh position={[0, 0.006, 0]} castShadow><cylinderGeometry args={[0.058, 0.058, 0.01, 48]} />{M.chrome()}</mesh>
          {Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[Math.cos(j * PI / 3) * 0.035, 0.0115, Math.sin(j * PI / 3) * 0.035]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.006, 12]} />{M.matte({ col: "#111" })}</mesh>)}
          <group position={[0, 0.12, -0.13]} rotation={[0.9 * a - 0.45, 0, 0]}>
            <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.01, 32]} />{M.chrome()}</mesh>
            <mesh position={[0, 0.0, 0.05]} rotation={[PI / 2, 0, 0]}><boxGeometry args={[0.016, 0.08, 0.008]} />{M.chrome()}</mesh>
          </group>
        </>}
        <pointLight position={[0, 0.12, 0.1]} intensity={0.14 * Math.max(0, a)} distance={0.3} color="#fff1d8" />
      </group>; })}
    <mesh position={[0, 0.15, -0.24]}><planeGeometry args={[1.3, 0.3]} /><meshPhysicalMaterial map={tubTex()} roughness={0.2} /></mesh>
  </>;
}}</Scene3D>;

// ---- 10:47 · DETRÁS DE LA PLACA: los dos tornillos giran y caen; la placa se inclina hacia cámara; detrás baja la varilla con el resorte forrado de pelo ----
export const HBehindPlate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="tile"
  cam={{ at: [0, 0.32, -1.3], az: [-0.2, 0.15], el: [0.06, 0.04], r: [0.9, 0.72], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="WHAT'S BEHIND THE PLATE" col={AMB} />}>{(tt) => {
  const scr = (i: number) => ({ spin: eio(tt, 0.4 + i * 0.4, 1.4 + i * 0.4), fall: cl((tt - 1.5 - i * 0.4) / 0.5) }), open = eio(tt, 2.4, 3.4), rod = eio(tt, 3.4, 5.2);
  const Z = -1.58, Y = 0.36;
  const spring: number[][] = []; for (let i = 0; i <= 80; i++) { const u = i / 80, a = u * 14 * PI; spring.push([0.02 * Math.cos(a), -u * 0.18, Z + 0.06 + 0.02 * Math.sin(a)]); }
  return <>
    {/* el agujero en la pared detrás de la placa */}
    <mesh position={[0, Y, Z + 0.001]}><circleGeometry args={[0.05, 32]} />{M.matte({ col: "#070708" })}</mesh>
    {/* la placa cromada con la palanca: gira sobre su borde de abajo hacia cámara */}
    <group position={[0, Y - 0.08, Z + 0.006]} rotation={[open * 1.2, 0, 0]}>
      <group position={[0, 0.08, 0]}>
        <RBox s={[0.1, 0.17, 0.008]} r={0.006}>{M.chrome()}</RBox>
        <mesh position={[0, 0.0, 0.01]}><boxGeometry args={[0.012, 0.05, 0.01]} />{M.chrome()}</mesh>
      </group>
    </group>
    {/* los dos tornillos: giran, salen y caen al piso */}
    {[1, -1].map((s, i) => { const { spin, fall } = scr(i); return <group key={s} position={[0, Y + s * 0.06 - 0.6 * fall * fall, Z + 0.012 + 0.02 * spin + 0.2 * fall]} rotation={[PI / 2, spin * 10 + fall * 4, 0]}>
      <mesh><cylinderGeometry args={[0.009, 0.009, 0.004, 20]} />{M.chrome()}</mesh>
      <mesh position={[0, 0.0022, 0]}><boxGeometry args={[0.012, 0.001, 0.002]} />{M.matte({ col: "#222" })}</mesh>
      <mesh position={[0, -0.012, 0]}><cylinderGeometry args={[0.003, 0.003, 0.022, 10]} />{M.steel()}</mesh>
    </group>; })}
    {/* la varilla con el resorte forrado de pelo: baja del agujero hacia afuera */}
    {rod > 0 && <group position={[0, Y + 0.02 - 0.06 * rod, 0.1 * rod]} rotation={[0.5 * rod, 0, 0]}>
      <mesh position={[0, -0.05, Z + 0.06]}><cylinderGeometry args={[0.004, 0.004, 0.2, 10]} />{M.chrome()}</mesh>
      <mesh geometry={tubeG("bp_spring", spring, 0.0028, 300, 6)} castShadow>{M.steel()}</mesh>
      <mesh position={[0, -0.2, Z + 0.06]}><cylinderGeometry args={[0.026, 0.022, 0.03, 24]} />{M.rubber({ col: "#2a2a2a" })}</mesh>
      {[0, 1, 2, 3].map((i) => <Hair key={i} id={"bp" + i} n={16} spread={0.025} r={0.0013} pts={[[0.025, -0.02 - i * 0.04, Z + 0.06], [-0.02, -0.06 - i * 0.04, Z + 0.08], [0.015, -0.1 - i * 0.03, Z + 0.04], [-0.03, -0.16 - i * 0.02, Z + 0.07]]} />)}
    </group>}
  </>;
}}</Scene3D>;

// ---- 11:37 · LA RUTA DEL REBALSE: un lavabo de porcelana en corte; el agua entra por el desagüe y por el agujero de rebalse; dos chorros bajan por caños transparentes y se juntan en el mismo sifón ----
const OV = [[0.0, 0.32, 0], [0.0, 0.1, 0], [0.0, -0.02, 0], [0.04, -0.08, 0], [0.1, -0.08, 0], [0.13, -0.02, 0], [0.13, 0.04, 0], [0.32, 0.04, 0]];
const OF = [[-0.16, 0.42, 0.0], [-0.17, 0.36, 0.0], [-0.12, 0.22, 0.0], [-0.03, 0.14, 0.0], [0.0, 0.12, 0]];
export const HOverflowRoute: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="tile"
  cam={{ at: [0, 0.22, 0], az: [0.0, 0.18], el: [0.1, 0.06], r: [1.3, 1.15], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="TWO WAYS DOWN" col={AMB} />}>{(tt) => {
  const a = eio(tt, 0.6, 2.2), b = eio(tt, 2.0, 3.6), meet = cl((tt - 3.6) / 0.5);
  const dots = (pts: number[][], k: number, col: string, key: string) => Array.from({ length: 14 }, (_, i) => { const u = ((tt * 0.45 + i / 14) % 1) * k; const p = curve(pts).getPointAt(cl(u)); return k > 0.05 ? <mesh key={key + i} position={[p.x, p.y, p.z]}><sphereGeometry args={[0.011, 12, 10]} />{M.water({ col, op: 0.9, emI: 0.5 })}</mesh> : null; });
  return <>
    {/* el lavabo en corte: cuenco de porcelana con el agujero de rebalse arriba */}
    <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.24, 0.05, 0.12, 56, 1, true, 0, PI]} />{M.porcelain({ side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.465, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.24, 0.012, 10, 56, PI]} />{M.porcelain()}</mesh>
    <mesh position={[-0.165, 0.42, 0.005]} rotation={[0, 0, 0]}><circleGeometry args={[0.014, 20]} />{M.matte({ col: "#0a0a0b" })}</mesh>
    <mesh position={[0, 0.39, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.16 * a, 48]} />{M.water({ op: 0.5 })}</mesh>
    {/* los dos caños transparentes y el sifón */}
    <mesh geometry={tubeG("ov_main", OV, 0.026, 120, 24)}>{M.glass({ op: 0.22 })}</mesh>
    <mesh geometry={tubeG("ov_side", OF, 0.014, 60, 16)}>{M.glass({ op: 0.25 })}</mesh>
    {dots(OV, a, "#8fd3ff", "m")}
    {dots(OF, b, "#ffd36a", "s")}
    {/* donde se juntan: un aro de luz */}
    <mesh position={[0.065, -0.08, 0]} rotation={[0, PI / 2, 0]} scale={0.001 + meet}><torusGeometry args={[0.034, 0.004, 10, 40]} />{M.glow({ col: AMB, op: 0.85 })}</mesh>
  </>;
}}</Scene3D>;

// ---- 12:06 · LA PUERTA SECRETA: en la pared del placard, un panel cuadrado atornillado cae sobre su bisagra; adentro, los caños de la bañera, y la linterna los barre ----
export const HSecretDoor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.7}
  cam={{ at: [0, 0.32, -1.2], az: [-0.2, 0.15], el: [0.05, 0.04], r: [0.95, 0.75], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="A LITTLE SQUARE DOOR" col={AMB} />}>{(tt) => {
  const Z = -1.585, Y = 0.3, S = 0.3, scr = cl((tt - 0.4) / 1.0), open = cl(phys(tt, 1.6, 6, 0.5)), sweep = eio(tt, 2.8, 5.6);
  const beamX = lerp(-0.1, 0.1, sweep);
  return <>
    {/* el hueco con los caños de atrás: fondo oscuro, caño de cobre y sifón */}
    <mesh position={[0, Y, Z - 0.1]}><planeGeometry args={[S, S]} />{M.matte({ col: "#14100c" })}</mesh>
    {[-1, 1, 0].map((s, i) => <mesh key={i} position={i < 2 ? [s * S / 2, Y, Z - 0.05] : [0, Y - S / 2, Z - 0.05]} rotation={[0, i < 2 ? PI / 2 : 0, i < 2 ? 0 : 0]}>{i < 2 ? <planeGeometry args={[0.1, S]} /> : <planeGeometry args={[S, 0.1]} />}{M.matte({ col: "#3a2c20", side: THREE.DoubleSide })}</mesh>)}
    <mesh position={[-0.06, Y, Z - 0.07]}><cylinderGeometry args={[0.012, 0.012, S, 16]} />{M.brass({ col: "#c27a4a" })}</mesh>
    <mesh geometry={tubeG("sd_trap", [[0.06, Y + 0.15, Z - 0.06], [0.06, Y - 0.02, Z - 0.06], [0.09, Y - 0.08, Z - 0.06], [0.12, Y - 0.02, Z - 0.06], [0.14, Y - 0.02, Z - 0.06]], 0.018, 60, 16)}>{M.pvc({ col: "#e9e4d8" })}</mesh>
    {/* el haz de la linterna barriendo los caños */}
    {sweep > 0 && <mesh position={[beamX, Y + 0.02, Z - 0.095]}><circleGeometry args={[0.07, 40]} /><meshBasicMaterial color="#fff2cc" transparent opacity={0.16} toneMapped={false} depthWrite={false} /></mesh>}
    <pointLight position={[beamX, Y + 0.02, Z + 0.05]} intensity={0.22 * cl(sweep * 4)} distance={0.35} color="#fff0c8" />
    {/* el marco del agujero en la pared */}
    {[[0, S / 2 + 0.01, S + 0.04, 0.02], [0, -S / 2 - 0.01, S + 0.04, 0.02], [S / 2 + 0.01, 0, 0.02, S], [-S / 2 - 0.01, 0, 0.02, S]].map((b, i) => <RBox key={i} s={[b[2], b[3], 0.012]} r={0.003} p={[b[0], Y + b[1], Z + 0.006]}>{M.wood({ base: [214, 200, 176] })}</RBox>)}
    {/* el panel: cae sobre la bisagra de abajo hacia cámara */}
    <group position={[0, Y - S / 2, Z + 0.012]} rotation={[open * 1.45, 0, 0]}>
      <RBox s={[S, S, 0.012]} r={0.003} p={[0, S / 2, 0]}>{M.wood({ base: [222, 210, 188] })}</RBox>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => <group key={i} position={[sx * (S / 2 - 0.022), S / 2 + sy * (S / 2 - 0.022), 0.008 + 0.012 * scr]} rotation={[PI / 2, scr * 9, 0]}>
        <mesh><cylinderGeometry args={[0.007, 0.007, 0.003, 16]} />{M.chrome()}</mesh>
      </group>)}
    </group>
    {/* la linterna en primer plano, con la mano que la sostiene */}
    {sweep > 0 && <group position={[beamX * 0.4, Y - 0.06, Z + 0.32]} rotation={[0.25, beamX * 1.5, 0]}>
      <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.016, 0.016, 0.12, 20]} />{M.matte({ col: "#1c1d20" })}</mesh>
      <mesh position={[0, 0, -0.07]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.024, 0.017, 0.03, 20]} />{M.chrome()}</mesh>
      <mesh position={[0, 0, -0.086]}><circleGeometry args={[0.022, 20]} />{M.glow({ col: "#fff3d0" })}</mesh>
    </group>}
  </>;
}}</Scene3D>;
