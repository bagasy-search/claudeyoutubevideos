// ohf8pf · componentes únicos 17-29: del montacargas de agua a la hendija del placard
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Tape } from "./okit";
import { CutHouse, Dr, Hygro, PI, numTex, sv } from "./sfkit";
import { Steam } from "./heroes_a1";

type P = React.FC<{ t: number; h: H }>;

// ---- EL MONTACARGAS: la gota del sótano sube piso por piso hasta la cama ----
export const HDumbwaiter: P = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[0.4, 3, 3]}
  cam={{ at: [0, 1.02, 0], az: [-0.18, 0.1], el: [0.12, 0.08], r: [3.7, 3.45], fov: 32 }}>{(tt) => { const y = lerp(0.1, 1.0, eio(tt, 0.8, 3.6)), s = eio(tt, 3.6, 4.5);
  return <>
    <CutHouse />
    <RBox s={[0.34, 1.32, 0.03]} p={[0, 0.72, -0.24]} r={0.002}><meshStandardMaterial color="#6e6452" roughness={1} /></RBox>
    <group position={[0, y, 0.0]}><RBox s={[0.3, 0.03, 0.3]} p={[0, 0, 0]} r={0.004}>{M.steel({ col: "#a9adb0" })}</RBox><Dr p={[0, 0.14, 0]} s={sv(5.2 - s * 2.4)} o={0.92} /></group>
    {[-1, 1].map((k) => <mesh key={k} position={[k * 0.14, 0.72, -0.1]}><cylinderGeometry args={[0.006, 0.006, 1.32, 8]} />{M.chrome()}</mesh>)}
    <RBox s={[0.56, 0.1, 0.4]} p={[0.55, 1.0, -0.06]} r={0.03}><meshStandardMaterial color="#f1ece0" roughness={0.9} /></RBox>
    <RBox s={[0.26, 0.06, 0.3]} p={[0.4, 1.08, -0.06]} r={0.02}><meshStandardMaterial color="#f7f4ec" roughness={0.9} /></RBox>
    <mesh position={[0.58, 1.054, -0.06]} rotation={[-PI / 2, 0, 0]} scale={[1.3, 1, 1]}><circleGeometry args={[0.14 * s + 0.001, 28]} /><meshStandardMaterial color="#87a7bd" roughness={1} /></mesh>
    <Tape txt="BASEMENT TO BEDROOM" p={[0, 1.7, 0.5]} w={1.3} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- LA CARA DEL PAPEL: el cuadrado de aluminio se abre como puerta y muestra de qué lado está el agua ----
export const HFoilSides: P = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[0.5, 2.2, 2.3]}
  cam={{ at: [0, 0.6, 0], az: [0.3, -0.14], el: [0.08, 0.05], r: [1.72, 1.56], fov: 32 }}>{(tt) => { const a1 = eio(tt, 0.5, 1.5) * (1 - eio(tt, 2.5, 3.2)), s2 = eio(tt, 3.2, 3.9), ang = a1 * 2.1;
  return <>
    <RBox s={[3.4, 1.8, 0.1]} p={[0, 0.6, -0.1]} r={0.006}><meshStandardMaterial map={tex.counter(3, 3)} color="#a39a8c" roughness={1} /></RBox>
    {Array.from({ length: 38 }, (_, i) => <Dr key={i} p={[-0.34 + rn(i, 11) * 0.68, 0.26 + rn(i, 12) * 0.68, -0.042]} s={sv(0.7 + rn(i, 13) * 0.7)} o={a1 > 0.1 ? 0.9 : 0.0001} />)}
    <group position={[-0.4, 0.6, -0.03]} rotation={[0, -ang, 0]}>
      <RBox s={[0.8, 0.8, 0.008]} p={[0.4, 0, 0]} r={0.002}>{M.steel({ col: "#d7dadc" })}</RBox>
      {Array.from({ length: 34 }, (_, i) => <Dr key={i} p={[0.08 + rn(i, 14) * 0.64, -0.32 + rn(i, 15) * 0.64, 0.012]} s={sv(s2 * (0.7 + rn(i, 16) * 0.7))} o={s2 > 0.05 ? 0.9 : 0.0001} />)}
    </group>
    <Tape txt="BACK WET: OUTSIDE WATER" p={[0.1, 0.98, 0.2]} w={1.0} k={a1 > 0.5 ? phys(tt, 1.0, 8, 0.45) : 0.001} rev={cl((tt - 1.0) / 0.5)} />
    <Tape txt="FRONT WET: ROOM AIR" col="#b3261e" p={[0, 0.38, 0.26]} w={0.92} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- EL TECHO EMBUDO: una pulgada de lluvia baja toda por cuatro caños ----
export const HGallons: P = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[0.5, 3, 2.8]}
  cam={{ at: [0, 0.82, 0], az: [-0.26, 0.14], el: [0.2, 0.15], r: [3.6, 3.3], fov: 32 }}>{(tt) => { const X = [-1.2, -0.4, 0.4, 1.2];
  return <>
    <RBox s={[2.9, 1.3, 0.06]} p={[0, 0.66, -0.52]} r={0.004}><meshStandardMaterial map={tex.wood(1, 8, [214, 206, 188])} roughness={0.85} /></RBox>
    <RBox s={[0.36, 0.5, 0.02]} p={[-0.5, 0.78, -0.48]} r={0.004}><meshStandardMaterial color="#36424a" roughness={0.3} /></RBox>
    <RBox s={[0.36, 0.5, 0.02]} p={[0.5, 0.78, -0.48]} r={0.004}><meshStandardMaterial color="#36424a" roughness={0.3} /></RBox>
    <group position={[0, 1.42, -0.1]} rotation={[0.46, 0, 0]}><RBox s={[2.9, 0.05, 1.1]} r={0.006}><meshStandardMaterial color="#5a4238" roughness={0.95} /></RBox></group>
    <RBox s={[2.9, 0.07, 0.12]} p={[0, 1.15, 0.42]} r={0.008}>{M.steel({ col: "#a9adb0" })}</RBox>
    {X.map((x, i) => <React.Fragment key={i}><mesh position={[x, 0.72, 0.45]}><cylinderGeometry args={[0.06, 0.06, 0.88, 20]} />{M.steel({ col: "#b8bcbf" })}</mesh>
      {Array.from({ length: 8 }, (_, j) => { const v = (tt * 1.3 + j / 8 + i * 0.2) % 1; return <Dr key={j} p={[x, lerp(0.26, 0.03, v * v), 0.45 + v * 0.14]} s={2.4} o={0.9} />; })}
      <mesh position={[x, 0.016, 0.6]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.1 + 0.12 * eio(tt, 0.8, 3.2), 26]} /><meshPhysicalMaterial color="#8fc3e2" transparent opacity={0.6} roughness={0.05} clearcoat={1} depthWrite={false} /></mesh></React.Fragment>)}
    {Array.from({ length: 90 }, (_, i) => { const v = (tt * 1.1 + rn(i, 31)) % 1; return <mesh key={i} position={[(rn(i, 32) - 0.5) * 2.9, lerp(2.5, 1.55, v), -0.1 + (rn(i, 33) - 0.5) * 0.8]}><cylinderGeometry args={[0.003, 0.003, 0.16, 5]} /><meshStandardMaterial color="#a9d4ee" transparent opacity={0.55} /></mesh>; })}
    <Tape txt="ALL DOWN FOUR PIPES" p={[0, 1.0, 0.7]} w={0.98} k={phys(tt, 1.8, 8, 0.45)} rev={cl((tt - 1.8) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- LA PELOTA DE LA PENDIENTE: primero rueda contra el cimiento; con tierra nueva se va ----
export const HSlopeBall: P = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#b9cfdc" key1={[0.4, 2.4, 2]}
  cam={{ at: [0.1, 0.36, 0], az: [-0.1, 0.08], el: [0.1, 0.06], r: [2.0, 1.82], fov: 32 }}>{(tt) => { const f = eio(tt, 2.2, 3.2), slope = lerp(-0.15, 0.15, f), b1 = eio(tt, 0.5, 2.0), b2 = eio(tt, 3.2, 5.0), L = -0.56, x = f < 0.02 ? lerp(0.5, L + 0.1, b1) : lerp(L + 0.1, 1.0, b2), yy = 0.32 + (x - 0.3) * -Math.tan(slope) + 0.085;
  return <>
    <RBox s={[0.3, 1.2, 1.1]} p={[-0.82, 0.6, 0]} r={0.008}><meshStandardMaterial map={tex.counter(2, 3)} color="#8a8478" roughness={1} /></RBox>
    <RBox s={[0.34, 1.0, 1.1]} p={[-0.84, 1.2, 0]} r={0.006}><meshStandardMaterial map={tex.wood(1, 6, [228, 224, 212])} roughness={0.8} /></RBox>
    <group position={[0.4, 0.14, 0]} rotation={[0, 0, -slope]}><RBox s={[2.4, 0.36, 1.1]} r={0.02}><meshStandardMaterial color="#5a4330" roughness={1} /></RBox></group>
    <mesh position={[x, yy, 0.2]} castShadow><sphereGeometry args={[0.085, 24, 18]} /><meshPhysicalMaterial color="#2f86c9" roughness={0.1} clearcoat={1} /></mesh>
    <Tape txt="AWAY FROM THE HOUSE" p={[0.3, 0.74, 0.3]} w={0.86} k={phys(tt, 3.5, 8, 0.45)} rev={cl((tt - 3.5) / 0.6)} />
    <Tape txt="1 INCH PER FOOT" col="#b3261e" p={[0.32, 0.59, 0.3]} w={0.6} k={phys(tt, 4.1, 8, 0.45)} rev={cl((tt - 4.1) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- QUIÉN MOJA EL AIRE: soga, pozo abierto y secadora alimentan la misma nube; cae la tapa ----
export const HWaterGuests: P = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="none" key1={[0.4, 2.5, 2.3]}
  cam={{ at: [0, 0.6, 0], az: [0.16, -0.1], el: [0.14, 0.1], r: [2.5, 2.3], fov: 32 }}>{(tt) => { const lid = phys(tt, 2.8, 7, 0.5);
  return <>
    <RBox s={[3.8, 1.8, 0.05]} p={[0, 0.9, -0.62]} r={0.004}><meshStandardMaterial color="#a39a8c" roughness={1} /></RBox>
    <mesh position={[-0.78, 1.0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.006, 0.006, 1.0, 6]} /><meshStandardMaterial color="#d2c9b0" /></mesh>
    {[-1.08, -0.78, -0.48].map((x, i) => <RBox key={x} s={[0.24, 0.42 - i * 0.06, 0.01]} p={[x, 0.78 + i * 0.03, 0]} r={0.002}><meshStandardMaterial color={["#9db6c8", "#e0cfa8", "#c88e7a"][i]} roughness={1} /></RBox>)}
    {[-1.08, -0.78, -0.48].map((x, i) => Array.from({ length: 4 }, (_, j) => { const v = (tt * 0.8 + j / 4 + i * 0.3) % 1; return <Dr key={`${i}${j}`} p={[x, lerp(0.56, 0.02, v * v), 0]} s={0.7} />; }))}
    <mesh position={[0, 0.01, 0.12]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.32, 40]} /><meshStandardMaterial color="#141a1d" roughness={0.2} /></mesh>
    <mesh position={[0, lerp(2.2, 0.03, lid), 0.12]}><cylinderGeometry args={[0.34, 0.34, 0.03, 40]} /><meshStandardMaterial color="#2c5a3e" roughness={0.6} /></mesh>
    {lid < 0.7 && <Steam tt={tt * 1.2} p={[0, 0.03, 0.12]} n={24} w={0.34} h={0.9} col="#cfe3ef" o={0.32} />}
    <RBox s={[0.5, 0.74, 0.5]} p={[0.9, 0.37, 0]} r={0.02}><meshStandardMaterial color="#efece4" roughness={0.45} /></RBox>
    <mesh position={[0.9, 0.46, 0.255]}><circleGeometry args={[0.16, 36]} /><meshStandardMaterial color="#20262a" roughness={0.2} /></mesh>
    <mesh geometry={tubeG("wgdr", [[0.62, 0.36, 0], [0.5, 0.42, 0.14], [0.42, 0.26, 0.28]], 0.05, 24, 12)}>{M.steel({ col: "#c7ccd0" })}</mesh>
    <Steam tt={tt * 1.3} p={[0.4, 0.22, 0.3]} n={18} w={0.1} h={0.7} dir={[-0.3, 0]} col="#dfeaf0" />
    <Tape txt="WHO'S WETTING THE AIR?" p={[0, 1.08, 0]} w={1.05} k={phys(tt, 1.0, 8, 0.45)} rev={cl((tt - 1.0) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- NO LO TOQUES: el tubo con venda blanca; la tijera se acerca y se frena en seco ----
export const HAsbestosStop: P = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" key1={[0.4, 2.2, 2]}
  cam={{ at: [0, 0.62, 0], az: [-0.22, 0.1], el: [0.14, 0.1], r: [2.2, 2.0], fov: 32 }}>{(tt) => { const x = lerp(1.2, 0.45, phys(tt, 0.7, 3.4, 0.82)), sh = eio(tt, 2.2, 2.5) * Math.sin(tt * 26) * 0.012 * (1 - eio(tt, 2.5, 3.0));
  return <>
    <mesh position={[0, 0.54, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.15, 0.15, 3.2, 28]} /><meshStandardMaterial color="#e8e3d4" roughness={1} /></mesh>
    {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[-1.5 + i * 0.145, 0.54, 0]} rotation={[0, 0, PI / 2 + 0.25]}><torusGeometry args={[0.152, 0.01, 8, 34]} /><meshStandardMaterial color="#cfc9b8" roughness={1} /></mesh>)}
    <group position={[x + sh, 0.86, 0.1]} rotation={[0, 0, 2.1]}>
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, 0.14]}><boxGeometry args={[0.03, 0.34, 0.012]} />{M.chrome()}</mesh>
      <mesh position={[0, 0.12, 0.012]} rotation={[0, 0, -0.14]}><boxGeometry args={[0.03, 0.34, 0.012]} />{M.chrome()}</mesh>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.045, -0.16, 0.006]}><torusGeometry args={[0.05, 0.015, 10, 26]} />{M.matte({ col: "#b3261e" })}</mesh>)}
    </group>
    <mesh position={[-0.4, 0.98, 0.14]}><circleGeometry args={[0.22 * eio(tt, 2.2, 2.7) + 0.001, 8]} /><meshBasicMaterial color="#b3261e" /></mesh>
    <mesh position={[-0.4, 0.98, 0.145]}><planeGeometry args={[0.36, 0.13]} /><meshBasicMaterial map={numTex("STOP", "#b3261e", "#ffffff", 104)} transparent opacity={eio(tt, 2.5, 2.8)} /></mesh>
    <Tape txt="COULD BE ASBESTOS" p={[0, 0.2, 0.22]} w={0.76} k={phys(tt, 3.1, 8, 0.45)} rev={cl((tt - 3.1) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- DOS CUARTOS DESPUÉS DE LA DUCHA: uno baja rápido, el otro se queda ----
export const HFastSlow: P = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="dark" key1={[0.4, 2.4, 2.2]}
  cam={{ at: [0, 0.76, 0], az: [0.14, -0.1], el: [0.08, 0.06], r: [2.7, 2.5], fov: 32 }}>{(tt) => { const a = lerp(80, 45, eio(tt, 0.8, 2.7)), b = lerp(80, 70, eio(tt, 0.8, 3.1)), Tb = (x: number, v: number, c: string) => <group position={[x, 0, 0]}>
    <mesh position={[0, 0.66, 0]}><cylinderGeometry args={[0.21, 0.21, 1.24, 36, 1, true]} /><meshPhysicalMaterial color="#dff0f5" transparent opacity={0.22} side={2} depthWrite={false} roughness={0.06} clearcoat={1} /></mesh>
    <mesh position={[0, 0.05 + 1.2 * (v / 100) / 2, 0]}><cylinderGeometry args={[0.19, 0.19, 1.2 * (v / 100), 34]} /><meshPhysicalMaterial color={c} transparent opacity={0.72} roughness={0.15} clearcoat={0.8} /></mesh>
    <Hygro p={[0, 0.14, 0.3]} s={1.45} val={String(Math.round(v))} /></group>;
  return <>
    {Tb(-0.55, a, "#79b8e1")}
    {Tb(0.55, b, "#c9543f")}
    <Tape txt="HEALTHY" col="#2c6b3c" p={[-0.55, 1.38, 0.2]} w={0.46} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) / 0.5)} />
    <Tape txt="SICK" col="#b3261e" p={[0.55, 1.38, 0.2]} w={0.3} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- JULIO ENTRA: la nube tibia cruza la ventana, toca la piedra fría y se hace gotas ----
export const HJulyWindow: P = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="none" key1={[0.8, 2.4, 2]}
  cam={{ at: [0, 0.74, 0], az: [-0.26, 0.12], el: [0.1, 0.07], r: [2.8, 2.6], fov: 32 }}>{(tt) => { const w = eio(tt, 3.4, 4.6);
  return <>
    <RBox s={[0.14, 1.9, 1.5]} p={[-1.1, 0.95, 0]} r={0.008}><meshStandardMaterial map={tex.counter(3, 4)} color="#8f887a" roughness={1} /></RBox>
    <RBox s={[0.14, 0.7, 1.5]} p={[1.1, 0.35, 0]} r={0.006}><meshStandardMaterial color="#8f887a" roughness={1} /></RBox>
    <RBox s={[0.14, 0.42, 1.5]} p={[1.1, 1.72, 0]} r={0.006}><meshStandardMaterial color="#8f887a" roughness={1} /></RBox>
    <mesh position={[1.22, 1.08, 0]} rotation={[0, -PI / 2, 0]}><planeGeometry args={[1.5, 0.76]} /><meshBasicMaterial color="#ffd891" /></mesh>
    {Array.from({ length: 170 }, (_, i) => { const u = cl(((tt * 0.42 + rn(i, 41)) % 1)), x = lerp(1.08, -0.98, u), k = cl((u - 0.68) / 0.32); return <mesh key={i} position={[x, 0.86 + (rn(i, 42) - 0.5) * 0.56 - u * 0.1, (rn(i, 43) - 0.5) * 1.1]}><sphereGeometry args={[0.012 + rn(i, 44) * 0.02, 10, 8]} /><meshBasicMaterial color={k > 0.4 ? "#bfe2f7" : "#ffd79a"} transparent opacity={0.6 * Math.sin(u * PI)} depthWrite={false} /></mesh>; })}
    {Array.from({ length: 34 }, (_, i) => { const v = (tt * 0.38 + rn(i, 45)) % 1; return <Dr key={i} p={[-1.02, lerp(1.34, 0.14, v * v), (rn(i, 46) - 0.5) * 1.2]} s={0.9 * sv(0.1 + eio(tt, 1.8, 3.2))} o={0.85} />; })}
    <Tape txt="KEEP THEM SHUT IN JULY" col="#b3261e" p={[0, 0.3, 0.42]} w={1.0} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 0.6)} />
    <group position={[0, 0, w * 0]} />
  </>;
}}</Scene3D>;

// ---- EL BALDE LLENO VS. LA MANGUERA: uno se apaga solo, el otro sigue toda la noche ----
export const HDehumHose: P = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="none" key1={[-0.4, 2.4, 2.1]}
  cam={{ at: [0, 0.56, 0], az: [0.16, -0.1], el: [0.2, 0.16], r: [2.6, 2.4], fov: 32 }}>{(tt) => { const fill = eio(tt, 0.4, 2.4), off = eio(tt, 2.4, 2.8), Box = (x: number, led: string) => <group position={[x, 0, 0]}><RBox s={[0.56, 0.84, 0.42]} p={[0, 0.44, 0]} r={0.03}><meshStandardMaterial color="#ebe8df" roughness={0.45} /></RBox>{Array.from({ length: 8 }, (_, i) => <RBox key={i} s={[0.42, 0.012, 0.004]} p={[0, 0.5 + i * 0.04, 0.214]} r={0.001}><meshStandardMaterial color="#8d8a84" /></RBox>)}<mesh position={[0.2, 0.8, 0.216]}><circleGeometry args={[0.022, 16]} /><meshBasicMaterial color={led} /></mesh></group>;
  return <>
    {Box(-0.6, off > 0.5 ? "#c7221a" : "#3ab35a")}
    <RBox s={[0.42, 0.26, 0.04]} p={[-0.6, 0.2, 0.232]} r={0.012}><meshPhysicalMaterial color="#dfeef4" transparent opacity={0.5} roughness={0.1} clearcoat={1} depthWrite={false} /></RBox>
    <RBox s={[0.4, 0.24 * fill + 0.002, 0.03]} p={[-0.6, 0.08 + 0.12 * fill, 0.232]} r={0.004}><meshPhysicalMaterial color="#6fb5e6" transparent opacity={0.8} /></RBox>
    {Box(0.6, "#3ab35a")}
    <mesh geometry={tubeG("dhho", [[0.6, 0.12, 0.22], [0.62, 0.05, 0.48], [0.28, 0.022, 0.5], [0.08, 0.022, 0.4]], 0.018, 40, 10)}>{M.matte({ col: "#2a2c30" })}</mesh>
    <mesh position={[0.06, 0.01, 0.4]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.1, 26]} /><meshStandardMaterial color="#70747a" metalness={0.5} roughness={0.5} /></mesh>
    {Array.from({ length: 6 }, (_, i) => { const v = (tt * 0.9 + i / 6) % 1; return <Dr key={i} p={[lerp(0.6, 0.08, v), 0.05, lerp(0.36, 0.4, v)]} s={0.55} o={0.9} />; })}
    <Tape txt="BUCKET FULL. OFF." col="#b3261e" p={[-0.6, 1.1, 0.2]} w={0.72} k={phys(tt, 2.5, 8, 0.45)} rev={cl((tt - 2.5) / 0.5)} />
    <Tape txt="NEVER STOPS" col="#2c6b3c" p={[0.6, 1.1, 0.2]} w={0.56} k={phys(tt, 3.3, 8, 0.45)} rev={cl((tt - 3.3) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- LA LONA QUE TAPA EL VAPOR: rueda sobre la tierra y atrás ya no sube nada ----
export const HPlasticFloor: P = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#3f352b" key1={[-0.4, 2.2, 2]}
  cam={{ at: [0, 0.36, 0], az: [-0.2, 0.1], el: [0.26, 0.18], r: [2.0, 1.8], fov: 32 }}>{(tt) => { const x = lerp(-1.2, 1.2, eio(tt, 0.5, 5.6));
  return <>
    <RBox s={[3, 0.16, 1.5]} p={[0, -0.02, 0]} r={0.02}><meshStandardMaterial color="#7a5f44" roughness={1} /></RBox>
    {[-0.9, 0.9].map((a) => <RBox key={a} s={[0.12, 0.9, 0.12]} p={[a, 0.45, -0.55]} r={0.01}>{M.wood({ rx: 1, ry: 3, base: [120, 86, 54] })}</RBox>)}
    <RBox s={[3, 0.1, 1.5]} p={[0, 1.08, 0]} r={0.008}>{M.wood({ rx: 4, ry: 1, base: [108, 76, 46] })}</RBox>
    <RBox s={[Math.max(0.001, x + 1.5), 0.012, 1.48]} p={[(x - 1.5) / 2, 0.066, 0]} r={0.002}><meshPhysicalMaterial color="#e7eef0" transparent opacity={0.6} roughness={0.1} clearcoat={1} depthWrite={false} /></RBox>
    <mesh position={[x, 0.12, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 1.5, 24]} /><meshPhysicalMaterial color="#e2ebee" transparent opacity={0.9} roughness={0.2} /></mesh>
    {Array.from({ length: 110 }, (_, i) => { const X = -1.4 + rn(i, 51) * 2.8; if (X < x) return null; const v = (tt * 0.42 + rn(i, 52)) % 1; return <Dr key={i} p={[X, lerp(0.07, 0.9, v), (rn(i, 53) - 0.5) * 1.3]} s={1.3} o={0.85 * Math.sin(v * PI)} />; })}
    <Tape txt="GALLONS A DAY, GONE" p={[0, 0.66, 0.3]} w={0.92} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- QUE RESPIRE EL FUEGO: la rejilla abierta alimenta la llama, el detector en verde ----
export const HFireBreathe: P = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="none" key1={[0.5, 2.4, 2.2]}
  cam={{ at: [0.04, 0.66, 0], az: [0.26, -0.12], el: [0.12, 0.08], r: [2.4, 2.2], fov: 32 }}>{(tt) => { const fl = 1 + Math.sin(tt * 7) * 0.05;
  return <>
    <RBox s={[3.2, 1.8, 0.05]} p={[0, 0.9, -0.48]} r={0.004}><meshStandardMaterial color="#bdb4a0" roughness={1} /></RBox>
    <RBox s={[0.82, 1.1, 0.62]} p={[-0.1, 0.55, -0.12]} r={0.02}>{M.steel({ col: "#7f8589" })}</RBox>
    <mesh position={[-0.1, 0.42, 0.195]}><planeGeometry args={[0.42, 0.28]} /><meshBasicMaterial color="#1b0d04" /></mesh>
    <RBox s={[0.36, 0.022, 0.03]} p={[-0.1, 0.315, 0.2]} r={0.004}>{M.steel({ col: "#7f8589" })}</RBox>
    {Array.from({ length: 9 }, (_, i) => { const x = -0.26 + i * 0.04, f = 1 + Math.sin(tt * 9 + i * 1.7) * 0.14; return <React.Fragment key={i}><mesh position={[x, 0.36 * 1 + 0.008, 0.205]} scale={[1, f, 0.4]}><coneGeometry args={[0.017, 0.085, 10]} /><meshBasicMaterial color="#4a90ff" /></mesh><mesh position={[x, 0.355, 0.214]} scale={[1, f, 0.4]}><coneGeometry args={[0.008, 0.05, 8]} /><meshBasicMaterial color="#cfe5ff" /></mesh></React.Fragment>; })}
    {Array.from({ length: 8 }, (_, i) => <RBox key={i} s={[0.36, 0.016, 0.01]} p={[0.74, 0.3 + i * 0.05, -0.44]} rot={[0.5, 0, 0]} r={0.002}><meshStandardMaterial color="#e6e1d3" roughness={0.6} /></RBox>)}
    {Array.from({ length: 18 }, (_, i) => { const v = (tt * 0.65 + rn(i, 55)) % 1; return <mesh key={i} position={[lerp(0.74, -0.1, v), lerp(0.42 + (rn(i, 56) - 0.5) * 0.3, 0.34, v), lerp(-0.4, 0.14, v)]}><sphereGeometry args={[0.018, 10, 8]} /><meshStandardMaterial color="#cfe6f4" transparent opacity={0.55 * Math.sin(v * PI)} depthWrite={false} /></mesh>; })}
    <group position={[0.68, 1.06, -0.44]}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.13, 0.13, 0.04, 34]} /><meshStandardMaterial color="#f2f0e9" roughness={0.45} /></mesh><mesh position={[0.05, 0, 0.022]}><circleGeometry args={[0.02, 14]} /><meshBasicMaterial color="#3ab35a" /></mesh><mesh position={[-0.03, 0, 0.022]}><planeGeometry args={[0.13, 0.05]} /><meshBasicMaterial map={numTex("CO", "#f2f0e9", "#2a2119", 150)} /></mesh></group>
    <Tape txt="LET THE FIRE BREATHE" p={[-0.1, 1.18, 0.22]} w={0.92} k={phys(tt, 1.6, 8, 0.45)} rev={cl((tt - 1.6) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- LA HENDIJA: las cajas se despegan de la pared y el aire entra por detrás ----
export const HClosetGap: P = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[0.6, 2.4, 1.9]}
  cam={{ at: [0.1, 0.42, -0.1], az: [0.86, 0.7], el: [0.5, 0.42], r: [2.8, 2.5], fov: 32 }}>{(tt) => { const g = eio(tt, 0.7, 2.0);
  return <>
    <RBox s={[2.8, 1.5, 0.06]} p={[0, 0.75, -0.6]} r={0.004}><meshStandardMaterial color="#b8c5cc" roughness={0.9} /></RBox>
    {Array.from({ length: 30 }, (_, i) => <Dr key={i} p={[-1.1 + rn(i, 61) * 2.2, 0.2 + rn(i, 62) * 1.0, -0.56]} s={sv(1 - g)} o={0.8} />)}
    {[[-0.68, 0.26], [0, 0.34], [0.68, 0.28]].map(([x, H], i) => <RBox key={i} s={[0.6, H * 2, 0.5]} p={[x, H + 0.002, lerp(-0.32, -0.08, g)]} r={0.014}><meshStandardMaterial color={["#b98f5e", "#a67d4f", "#c39a68"][i]} roughness={0.9} /></RBox>)}
    {Array.from({ length: 34 }, (_, i) => { const u = ((tt * 0.55 + rn(i, 63)) % 1); return <mesh key={i} position={[lerp(-1.4, 1.4, u), 0.14 + rn(i, 64) * 0.6, -0.46 + (rn(i, 65) - 0.5) * 0.08]} scale={[3.4, 1, 1]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#e7f4fb" transparent opacity={g * 0.75 * Math.sin(u * PI)} depthWrite={false} /></mesh>; })}
    <Tape txt="TWO INCHES OF AIR" p={[0.1, 0.9, 0]} w={0.72} k={phys(tt, 2.3, 8, 0.45)} rev={cl((tt - 2.3) / 0.6)} />
  </>;
}}</Scene3D>;
