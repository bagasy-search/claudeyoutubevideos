// ohf8pe · componentes únicos 25-38: aspiradora y huevos, trapo mojado, ola de calor, cárcel con cierre, puertitas de masilla, vidrio molido, montón y película, vaso trampa, el hueco de 14 días, ocho semanas, bañera, dúplex, grapas del sofá, marco, sesenta noches
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Tape } from "./okit";
import { Bug, PI, SlickCup, Specks, Steam, faceTex, quilt, sv, walk } from "./bkit";

// ---- UNA MENOS, CIEN HUEVOS MENOS: el tubo se la lleva y el abanico de huevos se apaga ----
export const HVacFan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[0.4, 2.3, 2]}
  cam={{ at: [-0.2, 0.36, 0], az: [0.26, -0.14], el: [0.42, 0.34], r: [2.5, 2.25], fov: 32 }}>{(tt) => { const n = eio(tt, 0.5, 1.5), su = eio(tt, 1.7, 2.4), off = eio(tt, 2.8, 5.6);
  return <>
    <RBox s={[3.2, 0.1, 1.5]} p={[0, -0.04, 0]} r={0.02}>{quilt("vfq")}</RBox>
    {su < 1 && <Bug p={[lerp(-0.72, -0.72, su), lerp(0.012, 0.32, su), 0]} s={sv(2.2 * (1 - su * 0.8))} rz={su * 1.4} ry={0.3} />}
    <group position={[-0.72, lerp(1.1, 0.42, n), 0]} rotation={[0, 0, -0.08]}>
      <RBox s={[0.26, 0.5, 0.06]} p={[0, 0.2, 0]} r={0.018}>{M.matte({ col: "#3a3f46" })}</RBox>
      <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.07, 0.09, 0.6, 22]} />{M.matte({ col: "#2a2e33" })}</mesh>
    </group>
    {Array.from({ length: 110 }, (_, i) => { const a = -0.82 + (i / 110) * 1.64, R = 0.75 + rn(i, 101) * 0.8, g = 1 - cl(off * 1.4 - rn(i, 102) * 0.4), k = phys(tt, 0.5 + rn(i, 103) * 1, 8, 0.5); return <mesh key={i} position={[-0.72 + Math.cos(a) * R, 0.03, Math.sin(a) * R * 0.46]} scale={[sv(k * g), sv(k * g), sv(k * g * 1.5)]}><sphereGeometry args={[0.018, 12, 9]} /><meshPhysicalMaterial color="#fbf6e6" roughness={0.3} clearcoat={0.6} /></mesh>; })}
    <Tape txt="HUNDREDS NEVER LAID" p={[0.1, 0.78, 0.2]} w={0.92} k={phys(tt, 3.8, 8, 0.45)} rev={cl((tt - 3.8) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- EL TRAPO MOJADO: pintura de plomo; un paso lo levanta, sin una nube ----
export const HWetWipe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[0.6, 2.2, 2.1]}
  cam={{ at: [0.05, 0.36, 0.1], az: [-0.22, 0.14], el: [0.34, 0.26], r: [1.7, 1.52], fov: 32 }}>{(tt) => { const X = lerp(-1.0, 1.05, eio(tt, 1.0, 4.3));
  return <>
    <RBox s={[3.6, 1.3, 0.06]} p={[0, 0.65, -0.3]} r={0.005}><meshStandardMaterial color="#d7ceb5" roughness={0.9} /></RBox>
    <RBox s={[3.6, 0.32, 0.06]} p={[0, 0.2, -0.24]} r={0.012}><meshStandardMaterial color="#efeadb" roughness={0.6} /></RBox>
    {Array.from({ length: 30 }, (_, i) => { const x = -1.5 + (i / 30) * 3; return <mesh key={i} position={[x + rn(i, 111) * 0.08, 0.1 + rn(i, 112) * 0.22, -0.205]} rotation={[0, 0, rn(i, 113) * 3]} scale={[1, 0.6, 0.2]}><sphereGeometry args={[0.03 + rn(i, 114) * 0.024, 7, 5]} /><meshStandardMaterial color="#bfb79d" roughness={1} /></mesh>; })}
    {Array.from({ length: 34 }, (_, i) => { const x = -1.4 + rn(i, 115) * 2.8, g = x > X - 0.15 ? 1 : 0.001, z = 0.02 + rn(i, 116) * 0.18; return <mesh key={i} position={[x, 0.047, z]} rotation={[0, rn(i, 117) * 3, 0]} scale={[g, 0.2 * g, 0.7 * g]}><sphereGeometry args={[0.03 + rn(i, 118) * 0.022, 7, 5]} /><meshStandardMaterial color="#eae4d3" roughness={1} /></mesh>; })}
    <group position={[X, 0.06, 0.1]} rotation={[0, 0.1, 0]}>
      <mesh scale={[1.25, 0.42, 1]} castShadow><sphereGeometry args={[0.15, 26, 18]} /><meshStandardMaterial color="#8ea9b8" roughness={0.42} metalness={0.1} /></mesh>
    </group>
    <Tape txt="WIPE WET. NO DUST." col="#b3261e" p={[0, 0.7, 0.1]} w={0.9} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- LA OLA DE CALOR: en corte de la costura el color baja despacio hasta el fondo ----
export const HHeatSeam: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[0.3, 2.1, 2.2]}
  cam={{ at: [0, 0.56, 0], az: [0.16, -0.1], el: [0.08, 0.05], r: [1.6, 1.44], fov: 32 }}>{(tt) => { const g = eio(tt, 1.2, 4.8), dead = eio(tt, 4.0, 5.0), N = 12;
  return <>
    <Steam tt={tt} p={[0, 0.96, 0.1]} n={18} w={0.2} h={0.5} />
    <mesh position={[0, 1.26, 0.1]} rotation={[PI, 0, 0]} castShadow><cylinderGeometry args={[0.1, 0.05, 0.34, 24]} />{M.matte({ col: "#4f5a63" })}</mesh>
    {[-1, 1].map((s) => <group key={s}>{Array.from({ length: N }, (_, i) => { const y = 0.93 - (i / N) * 0.84, k = cl(g * 1.5 - i / N); return <RBox key={i} s={[0.9, 0.078, 0.8]} p={[s * 0.53, y, 0]} r={0.002}><meshStandardMaterial color={`rgb(${Math.round(lerp(237, 225, k))},${Math.round(lerp(231, 112, k))},${Math.round(lerp(216, 54, k))})`} roughness={0.95} /></RBox>; })}</group>)}
    <RBox s={[0.16, 0.86, 0.02]} p={[0, 0.5, -0.3]} r={0.002}><meshStandardMaterial color="#17110d" /></RBox>
    {[0.82, 0.5, 0.2].map((y, i) => <Bug key={y} p={[0, y, -0.2]} rz={-PI / 2} s={1.6} dead={cl(g * 1.5 - i * 0.3 - 0.45)} run={0} />)}
    <Tape txt="SLOWER THAN YOU THINK" p={[0.05, 0.3, 0.56]} w={1.0} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- LA CÁRCEL: la funda se cierra; las de adentro chocan y no salen ----
export const HZipJail: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[0.5, 2.5, 1.9]}
  cam={{ at: [0, 0.34, 0], az: [-0.3, 0.14], el: [0.38, 0.28], r: [2.15, 1.94], fov: 32 }}>{(tt) => { const z = eio(tt, 0.6, 3.1), X = lerp(-0.96, 0.96, z), tp = eio(tt, 4.0, 4.7);
  return <>
    <RBox s={[1.92, 0.42, 1.06]} p={[0, 0.26, 0]} r={0.05}>{quilt("zjq")}</RBox>
    <RBox s={[2.06, 0.5, 1.2]} p={[0, 0.27, 0]} r={0.08}><meshPhysicalMaterial color="#eef2f4" transparent opacity={0.3} roughness={0.2} depthWrite={false} side={2} /></RBox>
    {Array.from({ length: 40 }, (_, i) => { const x = -1 + i * 0.05, on = x < X; return <RBox key={i} s={[0.03, 0.014, 0.04]} p={[x, 0.53, 0.45 + (on ? 0 : 0.034 * (i % 2 ? 1 : -1))]} r={0.002}>{M.steel({ col: "#7e8388" })}</RBox>; })}
    <RBox s={[0.1, 0.04, 0.08]} p={[X, 0.55, 0.45]} r={0.008}>{M.chrome()}</RBox>
    {Array.from({ length: 7 }, (_, i) => { const a = tt * (0.7 + rn(i, 121) * 0.6) + rn(i, 122) * 6, bx = 0.92 * Math.sin(a), bz = 0.5 * Math.sin(a * 1.31 + i), ry = Math.atan2(-Math.cos(a * 1.31 + i) * 0.65, Math.cos(a)); return <Bug key={i} p={[bx, 0.475, bz]} ry={ry} s={1.6} run={tt + i} />; })}
    <RBox s={[0.26, 0.012, 0.12]} p={[0.96, 0.58, 0.45]} rot={[0, 0.1, 0]} r={0.002}><meshStandardMaterial color="#c8b37b" transparent opacity={tp} roughness={0.6} /></RBox>
    <Tape txt="ZIP IT. 18 MONTHS." p={[0, 0.8, 0.1]} w={0.96} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- SIN HABITACIONES: rendijas como puertitas; la boquilla pasa y las cierra ----
export const HCaulkDoors: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[-0.3, 2.2, 2.1]}
  cam={{ at: [0.04, 0.42, 0.1], az: [0.3, -0.14], el: [0.22, 0.16], r: [1.9, 1.7], fov: 32 }}>{(tt) => { const X = lerp(-1.25, 1.2, eio(tt, 0.8, 5.0));
  return <>
    <RBox s={[3.4, 1.3, 0.06]} p={[0, 0.66, -0.2]} r={0.005}><meshStandardMaterial color="#d3cab2" roughness={0.9} /></RBox>
    <RBox s={[3.4, 0.36, 0.1]} p={[0, 0.23, -0.14]} r={0.012}><meshStandardMaterial color="#efeadb" roughness={0.55} /></RBox>
    {Array.from({ length: 6 }, (_, i) => { const x = -1.0 + i * 0.4, c = X > x + 0.02 ? phys(tt, 0.8 + 4.2 * ((x + 1.25) / 2.45), 8, 0.6) : 0; return <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, 0.27, -0.086]}><planeGeometry args={[0.12, 0.2]} /><meshBasicMaterial color="#090706" /></mesh>
      {c > 0.03 && <mesh position={[0, 0.27, -0.082]} scale={[sv(c), sv(c), 0.3]}><boxGeometry args={[0.15, 0.23, 0.04]} /><meshStandardMaterial color="#f7f4ec" roughness={0.38} /></mesh>}
      {i % 2 === 0 && c < 0.1 && <Bug p={[0, 0.2, -0.078]} rz={PI / 2} s={1} />}
    </group>; })}
    <group position={[X, 0.27, 0.32]} rotation={[0.95, 0, 0]}>
      <mesh position={[0, 0.16, 0]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.46, 26]} /><meshStandardMaterial color="#e7e2d5" roughness={0.5} /></mesh>
      <mesh position={[0, -0.18, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.05, 0.26, 18]} /><meshStandardMaterial color="#f3f0e6" roughness={0.45} /></mesh>
    </group>
    <Tape txt="NO CRACK, NO BEDROOM" p={[0, 0.76, 0.1]} w={0.98} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- VIDRIO MOLIDO: visto de muy cerca, cruza cristales; la cera se raspa y se seca ----
export const HGlassWalk: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" key1={[0.4, 2, 2]}
  cam={{ at: [0, 0.14, 0], az: [0.32, -0.2], el: [0.22, 0.16], r: [1.05, 0.92], fov: 32 }}>{(tt) => { const u = eio(tt, 0.4, 5.2), dr = eio(tt, 2.4, 5.2);
  return <>
    <RBox s={[3.2, 0.06, 1.6]} p={[0, -0.03, 0]} r={0.01}><meshStandardMaterial color="#39322b" roughness={1} /></RBox>
    {Array.from({ length: 150 }, (_, i) => { const r = 0.016 + rn(i, 131) * 0.03; return <mesh key={i} position={[(rn(i, 132) - 0.5) * 2.6, r * 0.5, (rn(i, 133) - 0.5) * 1.2]} rotation={[rn(i, 134) * 3, rn(i, 135) * 3, rn(i, 136) * 3]} castShadow><octahedronGeometry args={[r, 0]} /><meshPhysicalMaterial color="#f2f4f4" roughness={0.12} transmission={0} metalness={0.1} clearcoat={1} flatShading /></mesh>; })}
    <Bug p={[lerp(-0.6, 0.2, u), 0.036, 0.05]} s={2.6} dead={dr * 0.55} run={tt * (1 - dr * 0.6)} />
    {Array.from({ length: 12 }, (_, i) => { const v = cl((tt - 2.2 - i * 0.22) / 1.4), x = lerp(-0.6, 0.2, u) - 0.05 + rn(i, 137) * 0.16; return v > 0 && v < 1 ? <mesh key={i} position={[x, 0.18 + v * 0.3, 0.05 + (rn(i, 138) - 0.5) * 0.2]}><sphereGeometry args={[0.012, 10, 8]} /><meshPhysicalMaterial color="#cdeafa" roughness={0.06} clearcoat={1} transparent opacity={1 - v} /></mesh> : null; })}
    <Tape txt="BROKEN GLASS TO A BUG" p={[0, 0.3, 0.1]} w={0.5} k={phys(tt, 1.6, 8, 0.45)} rev={cl((tt - 1.6) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- MONTÓN Y PELÍCULA: rodea la montaña; a la película fina la cruza sin darse cuenta ----
const ROUND: [number, number][] = [[-1.3, 0.28], [-1.0, 0.3], [-0.72, 0.56], [-0.42, 0.3], [-0.12, 0.28]];
export const HPileFilm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[-0.5, 2.4, 1.7]}
  cam={{ at: [0, 0.12, 0.1], az: [-0.16, 0.14], el: [0.56, 0.44], r: [2.7, 2.45], fov: 32 }}>{(tt) => { const u = cl((tt - 0.6) / 2.2), w = walk(ROUND, u), v = eio(tt, 2.9, 5.0);
  return <>
    <mesh position={[-0.72, 0.17, 0.18]} castShadow><coneGeometry args={[0.3, 0.3, 40]} /><meshStandardMaterial color="#efece4" roughness={1} /></mesh>
    <mesh position={[0.62, 0.0475, 0.2]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.48, 56]} /><meshStandardMaterial color="#f4f1e9" transparent opacity={0.3} roughness={1} /></mesh>
    <Bug p={[u < 1 ? w.x : lerp(-0.12, 1.25, v), 0.046, u < 1 ? w.z : 0.26]} ry={u < 1 ? w.ry : 0} s={2} run={tt} dead={cl((v - 0.6) * 1.2) * 0.4} />
    <Tape txt="A PILE? WALKS AROUND" col="#b3261e" p={[-0.5, 0.56, 0.1]} w={0.76} k={phys(tt, 1.7, 8, 0.45)} rev={cl((tt - 1.7) / 0.6)} />
    <Tape txt="A FILM." p={[0.62, 0.42, 0.2]} w={0.34} k={phys(tt, 4.2, 8, 0.45)} rev={cl((tt - 4.2) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- EL VASO TRAMPA: en corte: la que sube cae al foso; la que baja, al anillo de adentro ----
export const HMoatCup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[0.4, 2.3, 2]}
  cam={{ at: [0, 0.42, 0], az: [0.18, -0.12], el: [0.12, 0.08], r: [2.25, 2.05], fov: 32 }}>{(tt) => { const a = eio(tt, 0.5, 2.4), b = eio(tt, 2.4, 2.9), c = eio(tt, 3.1, 4.3), d = eio(tt, 4.3, 4.8), ax = lerp(1.1, 0.58, a), ay = lerp(0.05, 0.54, a) - lerp(0, 0.42, b);
  const wall = (x: number, H: number) => <RBox s={[0.022, H, 0.5]} p={[x, 0.05 + H / 2, 0]} r={0.004}><meshPhysicalMaterial color="#e4edf0" transparent opacity={0.6} roughness={0.1} clearcoat={1} depthWrite={false} /></RBox>;
  return <>
    <RBox s={[1.4, 0.02, 0.5]} p={[0, 0.06, 0]} r={0.004}><meshPhysicalMaterial color="#e4edf0" transparent opacity={0.55} roughness={0.1} depthWrite={false} /></RBox>
    {wall(-0.58, 0.5)}{wall(0.58, 0.5)}{wall(-0.28, 0.42)}{wall(0.28, 0.42)}
    <RBox s={[0.42, 1.3, 0.42]} p={[0, 0.82, 0]} r={0.012}>{M.wood({ rx: 1, ry: 3, base: [124, 86, 54] })}</RBox>
    <Bug p={[ax + (b > 0 ? 0 - 0.13 * b : 0), ay, 0.16]} rz={lerp(PI / 2, 0, b)} ry={PI} s={1.8} run={a < 1 ? tt : 0} />
    <Bug p={[lerp(0.24, 0.2, c), lerp(1.06, 0.16, c * c) - lerp(0, 0.09, d), 0.24]} rz={lerp(-PI / 2, 0, d)} s={1.8} run={c < 1 ? tt : 0} />
    <Tape txt="COMING IN" p={[0.62, 0.76, 0.28]} w={0.42} k={phys(tt, 1.7, 8, 0.45)} rev={cl((tt - 1.7) / 0.5)} />
    <Tape txt="LEAVING" col="#b3261e" p={[-0.52, 0.76, 0.28]} w={0.36} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- EL HUECO: regla de días: los huevos eclosionan y aún no ponen; la ronda cae justo ahí ----
export const HGapRuler: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="wood" key1={[0.3, 2.2, 2.3]}
  cam={{ at: [0, 0.74, 0], az: [-0.12, 0.1], el: [0.06, 0.04], r: [2.45, 2.22], fov: 32 }}>{(tt) => { const X = (d: number) => -1.1 + d * 0.058, a = eio(tt, 0.6, 1.8), b = eio(tt, 1.8, 3.0), k = phys(tt, 3.3, 7, 0.5);
  return <>
    <RBox s={[2.5, 0.14, 0.04]} p={[0.12, 0.54, 0.02]} r={0.008}><meshStandardMaterial map={tex.text("gpr", 1024, 64, (g) => { g.fillStyle = "#e4c67f"; g.fillRect(0, 0, 1024, 64); g.fillStyle = "#2a2119"; for (let i = 0; i < 43; i++) g.fillRect(i * 24.4, 0, 3, i % 7 === 0 ? 48 : 22); })} roughness={0.7} /></RBox>
    <RBox s={[X(10) - X(0), 0.2, 0.03]} p={[(X(10) + X(0)) / 2, 0.88, 0.02]} r={0.01}><meshStandardMaterial color="#efe6cf" transparent opacity={a} roughness={0.8} /></RBox>
    <RBox s={Math.abs(X(38) - X(19)) * 1 > 0 ? [X(38) - X(19), 0.2, 0.03] : [1, 1, 1]} p={[(X(38) + X(19)) / 2, 0.88, 0.02]} r={0.01}><meshStandardMaterial color="#b56a4a" transparent opacity={b} roughness={0.8} /></RBox>
    <mesh position={[X(14.5), 1.0, 0.0]}><planeGeometry args={[0.52, 1.1]} /><meshBasicMaterial color="#ffd86b" transparent opacity={0.3 * k} /></mesh>
    <group position={[X(14.5), lerp(1.7, 0.54, k), 0.08]}><mesh rotation={[0, 0, PI]}><coneGeometry args={[0.07, 0.2, 20]} /><meshBasicMaterial color="#b3261e" /></mesh></group>
    <Tape txt="EGGS HATCH" p={[(X(10) + X(0)) / 2, 1.18, 0.08]} w={0.46} k={phys(tt, 1.0, 8, 0.45)} rev={cl((tt - 1) / 0.5)} />
    <Tape txt="START LAYING" p={[(X(38) + X(19)) / 2, 1.18, 0.08]} w={0.56} k={phys(tt, 2.2, 8, 0.45)} rev={cl((tt - 2.2) / 0.5)} />
    <Tape txt="DAY 14" col="#b3261e" p={[X(14.5), 0.26, 0.1]} w={0.3} k={phys(tt, 3.7, 8, 0.45)} rev={cl((tt - 3.7) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- OCHO SEMANAS: ocho casilleros; un bicho en la 4 borra todo; recién después, ocho ceros ----
export const HEightZeros: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="wood" key1={[-0.3, 2.2, 2.3]}
  cam={{ at: [0, 0.82, 0], az: [0.12, -0.1], el: [0.05, 0.03], r: [2.1, 1.9], fov: 32 }}>{(tt) => { const reset = eio(tt, 2.4, 2.8);
  return <>
    <RBox s={[2.2, 1.2, 0.04]} p={[0, 0.8, 0]} r={0.008}><meshStandardMaterial color="#2c3a33" roughness={0.92} /></RBox>
    {Array.from({ length: 8 }, (_, i) => { const c = i % 4, r = i < 4 ? 0 : 1, X = -0.72 + c * 0.48, Y = 1.1 - r * 0.58, k1 = i < 4 ? phys(tt, 0.5 + i * 0.4, 8, 0.45) * (1 - reset) : 0, k2 = phys(tt, 3.0 + i * 0.32, 8, 0.45), v = i === 3 ? "1" : "0";
      return <group key={i} position={[X, Y, 0.03]}>
        <mesh position={[0, 0, 0.002]}><planeGeometry args={[0.4, 0.48]} /><meshBasicMaterial color="#35463d" /></mesh>
        {k1 > 0.02 && <mesh position={[0, 0, 0.012]} scale={sv(k1)}><planeGeometry args={[0.32, 0.4]} /><meshBasicMaterial map={faceTex(`ez${i}${v}`, v, "#35463d", i === 3 ? "#ff8a5c" : "#efece2", 180)} /></mesh>}
        {k2 > 0.02 && <mesh position={[0, 0, 0.018]} scale={sv(k2)}><planeGeometry args={[0.32, 0.4]} /><meshBasicMaterial map={faceTex(`ez2${i}`, "0", "#35463d", "#efece2", 180)} /></mesh>}
      </group>; })}
    <Tape txt="8 WEEKS OF ZERO" p={[0, 0.17, 0.08]} w={0.82} k={phys(tt, 5.4, 8, 0.45)} rev={cl((tt - 5.4) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- LA BAÑERA: la pared lisa; la chinche trepa, resbala y queda en el fondo ----
export const HTubSlide: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="tile" key1={[0.5, 2.2, 2]}
  cam={{ at: [0, 0.52, 0], az: [0.14, -0.1], el: [0.12, 0.08], r: [1.8, 1.62], fov: 32 }}>{(tt) => { const up = (a: number) => cl((tt - a) / 1.0) * (tt - a < 1 ? 1 : Math.max(0, 1 - (tt - a - 1) * 2.8));
  const P = Math.max(0, tt - 0.5) % 1.7, cli = P < 1 ? P : Math.max(0, 1 - (P - 1) * 2.8), phi = lerp(0.3, 1.2, cli), bx = 0.68 * Math.sin(phi), by = 0.76 - 0.68 * Math.cos(phi);
  return <>
    <mesh position={[0, 0.76, -0.4]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.7, 0.7, 1.9, 70, 1, true, -PI / 2, PI]} /><meshPhysicalMaterial color="#f7f6f1" roughness={0.1} clearcoat={1} side={2} /></mesh>
    <Bug p={[bx, by, 0.1]} rz={phi} s={2.2} run={P < 1 ? tt : 0} />
    <Bug p={[-0.3, 0.135, 0.1]} s={2.2} rz={-0.45} run={tt * 0.3} />
    <Tape txt="NO GRIP" p={[0, 0.86, 0.1]} w={0.46} k={phys(tt, 2.5, 8, 0.45)} rev={cl((tt - 2.5) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- EL DÚPLEX: casa partida en dos; aunque limpies la tuya, cruzan la pared ----
export const HDuplex: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[0.4, 2.6, 2]}
  cam={{ at: [0, 0.6, 0], az: [0.2, -0.16], el: [0.16, 0.12], r: [2.6, 2.34], fov: 32 }}>{(tt) => { const glow = eio(tt, 2.6, 4.0);
  return <>
    <RBox s={[2.5, 1.2, 0.06]} p={[0, 0.64, -0.5]} r={0.005}><meshStandardMaterial color="#d7ceb5" roughness={0.9} /></RBox>
    <RBox s={[0.06, 1.2, 1.0]} p={[-1.22, 0.64, 0]} r={0.005}><meshStandardMaterial color="#d7ceb5" roughness={0.9} /></RBox>
    <RBox s={[0.06, 1.2, 1.0]} p={[1.22, 0.64, 0]} r={0.005}><meshStandardMaterial color="#d7ceb5" roughness={0.9} /></RBox>
    <RBox s={[0.1, 1.2, 1.0]} p={[0, 0.64, 0]} r={0.005}><meshStandardMaterial color="#c8bfa6" roughness={0.9} /></RBox>
    <mesh position={[0, 1.42, 0]} rotation={[0, PI / 4, 0]} scale={[1.5, 0.42, 0.6]} castShadow><coneGeometry args={[1.25, 0.8, 4]} /><meshStandardMaterial color="#6a3a2a" roughness={0.85} /></mesh>
    <mesh position={[-0.62, 0.08, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.46, 40]} /><meshBasicMaterial color="#88b06b" transparent opacity={0.34 * glow + 0.04} depthWrite={false} /></mesh>
    {Array.from({ length: 8 }, (_, i) => { const u = cl((tt - 0.8 - i * 0.42) / 2.5), x = lerp(0.82 - i * 0.04, -0.72 + i * 0.05, u), z = 0.42 - i * 0.04; return <Bug key={i} p={[x, 0.06 + Math.sin(u * PI) * (Math.abs(x) < 0.08 ? 0 : 0), z]} ry={PI} s={1.7} run={tt + i} />; })}
    <Tape txt="THE WHOLE BUILDING" p={[0, 1.02, 0.5]} w={0.88} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- LAS GRAPAS: sofá dado vuelta; el destornillador salta grapas y la tela negra cuelga ----
export const HCouchStaples: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[0.4, 2.4, 2.1]}
  cam={{ at: [0.05, 0.56, 0], az: [-0.3, 0.1], el: [0.66, 0.5], r: [2.3, 2.05], fov: 32 }}>{(tt) => { const X = lerp(-0.66, 0.62, eio(tt, 0.8, 3.6)), fold = eio(tt, 3.6, 4.5);
  return <>
    <RBox s={[1.9, 0.5, 0.96]} p={[0, 0.3, 0]} r={0.05}><meshStandardMaterial color="#6f5a4a" roughness={0.95} /></RBox>
    <RBox s={[1.72, 0.012, 0.82]} p={[0, 0.553, 0]} r={0.002}>{M.wood({ rx: 3, ry: 2, base: [186, 150, 106] })}</RBox>
    <Specks id={141} n={34} w={1.5} d={0.2} p={[0, 0.558, 0.14]} k={fold} size={0.02} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <Bug key={i} p={[-0.6 + i * 0.2, 0.558, 0.1 + rn(i, 142) * 0.1]} ry={rn(i, 143) * 6} s={sv(1.4 * fold)} run={tt} />)}
    <group position={[0, 0.5605, -0.41]} rotation={[-fold * 2.0, 0, 0]}><RBox s={[1.72, 0.008, 0.82]} p={[0, 0.006, 0.41]} r={0.002}><meshStandardMaterial color="#17171a" roughness={1} /></RBox></group>
    {Array.from({ length: 12 }, (_, i) => { const x = -0.8 + i * 0.145, gone = X > x; return <mesh key={i} position={[x, 0.572 + (gone ? 0.06 : 0), 0.4]} rotation={[0, 0, gone ? 1 : 0]}><boxGeometry args={[0.06, 0.008, 0.01]} />{M.chrome()}</mesh>; })}
    <group position={[X, 0.68, 0.48]} rotation={[-0.8, 0, 0]}><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.011, 0.011, 0.32, 10]} />{M.chrome()}</mesh><mesh position={[0, 0.34, 0]} castShadow><cylinderGeometry args={[0.038, 0.034, 0.22, 18]} />{M.matte({ col: "#b3261e" })}</mesh></group>
    <Tape txt="UNDER THE BLACK CLOTH" p={[0, 0.94, 0.1]} w={0.96} k={phys(tt, 3.8, 8, 0.45)} rev={cl((tt - 3.8) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- EL CUADRO: gira sobre su clavo; atrás, papel marrón y puntos ----
export const HFrameBack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" key1={[0.4, 2.1, 2.3]}
  cam={{ at: [0, 0.82, 0], az: [0.16, -0.12], el: [0.06, 0.04], r: [2.15, 1.95], fov: 32 }}>{(tt) => { const a = eio(tt, 1.2, 2.6) * PI, sp = eio(tt, 2.6, 3.7);
  return <>
    <group position={[0, 0.82, 0.14]} rotation={[0, a, 0]}>
      <RBox s={[0.86, 1.06, 0.05]} r={0.008}>{M.wood({ rx: 1, ry: 2, base: [122, 88, 52] })}</RBox>
      <mesh position={[0, 0, 0.0275]}><planeGeometry args={[0.72, 0.92]} /><meshStandardMaterial color="#b5b89d" roughness={0.85} /></mesh>
      <mesh position={[0, 0.06, 0.0285]}><circleGeometry args={[0.15, 32]} /><meshStandardMaterial color="#e6d8ac" roughness={0.85} /></mesh>
      <mesh position={[0, -0.34, 0.0285]}><planeGeometry args={[0.72, 0.24]} /><meshStandardMaterial color="#798562" roughness={0.9} /></mesh>
      <mesh position={[0, 0, -0.0275]} rotation={[0, PI, 0]}><planeGeometry args={[0.76, 0.96]} /><meshStandardMaterial color="#a57e4f" roughness={0.9} /></mesh>
      <group position={[0, -0.3, -0.03]} rotation={[-PI / 2, 0, 0]} scale={[1, 1, 1]}><Specks id={151} n={Math.round(sp * 46) + 1} w={0.62} d={0.28} size={0.016} /></group>
    </group>
    <Bug p={[-0.26, 0.56, 0.12]} rz={PI / 2} s={sv(1.5 * sp)} run={tt} />
    <Tape txt="THEIR FAVORITE PLACE" p={[0.06, 0.42, 0.24]} w={0.78} k={phys(tt, 3.5, 8, 0.45)} rev={cl((tt - 3.5) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- SESENTA NOCHES: sesenta velitas en la ventana; una por noche, ninguna falta ----
export const HSixtyNights: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" key1={[0.2, 2, 2.4]}
  cam={{ at: [0, 0.78, 0], az: [-0.12, 0.1], el: [0.05, 0.03], r: [2.75, 2.5], fov: 32 }}>{(tt) => { const u = cl((tt - 0.5) / 4.2) * 60;
  return <>
    <RBox s={[2.5, 1.5, 0.04]} p={[0, 0.8, -0.04]} r={0.008}><meshStandardMaterial color="#141a26" roughness={0.8} /></RBox>
    {Array.from({ length: 60 }, (_, i) => { const c = i % 12, r = Math.floor(i / 12), on = u > i, X = -0.99 + c * 0.18, Y = 1.3 - r * 0.25, k = phys(tt, 0.5 + i * 0.07, 9, 0.5); return <group key={i} position={[X, Y, 0.02]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.012, 24]} /><meshStandardMaterial color={on ? "#a68a57" : "#2a2c35"} roughness={0.6} /></mesh>
      <mesh position={[0, 0, 0.014]} scale={[sv(on ? k : 0.001), sv(on ? k : 0.001), 1]}><circleGeometry args={[0.045, 18]} /><meshBasicMaterial color="#ffd27a" /></mesh>
    </group>; })}
    <Tape txt="60 NIGHTS. EMPTY CUPS." p={[0, 0.02, 0.16]} w={1.08} k={phys(tt, 4.6, 8, 0.45)} rev={cl((tt - 4.6) / 0.6)} />
  </>;
}}</Scene3D>;
