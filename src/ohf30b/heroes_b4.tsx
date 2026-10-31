// ohf30b · componentes únicos 22-28: el colgador oxidado y el bajo, la abrazadera nueva, el respiradero maestro,
// la trampa de vapor, el caño pelado que pierde calor, el presostato que baja y la campana sobre la válvula de seguridad.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { Drop, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Big, Env, Gauge, Pipe, Puffs, Shock, dialTex } from "./okit";

const PI = Math.PI;
// caño que cuelga con una curva: y(x) = base + pendiente·x − sag·campana(x)
const SagPipe: React.FC<{ sag: number; slope?: number; y0?: number; r?: number; col?: string }> = ({ sag, slope = 0.03, y0 = 0.4, r = 0.026, col = "#5d5a55" }) => {
  const y = (x: number) => y0 - slope * x - sag * Math.exp(-(x * x) / 0.05);
  return <>{Array.from({ length: 26 }, (_, i) => { const x0 = -0.62 + i * 0.048, x1 = x0 + 0.048;
    return <mesh key={i} position={[(x0 + x1) / 2, (y(x0) + y(x1)) / 2, 0]} rotation={[0, 0, Math.atan2(y(x1) - y(x0), 0.048) + PI / 2]}><cylinderGeometry args={[r, r, 0.05, 20]} />{M.steel({ col })}</mesh>; })}</>;
};
const joists = <>{[-0.5, -0.15, 0.2, 0.55].map((x) => <RBox key={x} s={[0.05, 0.1, 0.6]} p={[x, 0.64, 0]} r={0.004}>{M.wood({ base: [120, 85, 55] })}</RBox>)}<RBox s={[1.4, 0.02, 0.6]} p={[0, 0.7, 0]} r={0.003}>{M.wood({ base: [110, 78, 50] })}</RBox></>;

// ---- 14:46 · EL COLGADOR OXIDADO: luz rasante de sótano; el del medio se corta, el caño se vence, gotea y el agua se junta en el bajo ----
export const HSag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#241c16" warm={1.2} key1={[-1.2, 1.1, 0.9]} lamp={[-0.5, 0.5, 0.4]}
  cam={{ at: [0, 0.38, 0], at1: [0.0, 0.3, 0], az: [-0.22, 0.12], el: [0.02, 0.06], r: [1.25, 1.05], fov: 34 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "A RUSTED HANGER LETS GO…"], [3.7, "A LOW SPOT = A PUDDLE = A BANG", "#b3261e"]]} y={960} />}>{(tt) => {
  const brk = phys(tt, 2.75, 5, 0.55), pool = eio(tt, 3.4, 5.0), bang = 4.7, sx = tt > bang && tt < bang + 0.3 ? 0.01 * Math.sin((tt - bang) * 80) : 0;
  const sag = 0.17 * brk, hx = 0.02, cut = eio(tt, 2.6, 2.75);
  return <>
    <Env kind="concrete" z={-0.35} y={0.4} floor="concrete" fy={-0.02} rim={[0.7, 0.5, 0.2]} rimI={2.4} />
    {joists}
    <group position={[sx, 0, 0]}><SagPipe sag={sag} /></group>
    {/* colgadores: los de las puntas firmes; el del medio, oxidado, tiembla, se corta y cae */}
    {[-0.5, 0.55].map((x) => <mesh key={x} position={[x, 0.53, 0]}><boxGeometry args={[0.012, 0.18, 0.012]} />{M.steel({ col: "#7a7a72" })}</mesh>)}
    <mesh position={[hx, 0.53, 0]} visible={cut < 1}><boxGeometry args={[0.012, 0.18, 0.012]} /><meshStandardMaterial color="#8a4a22" roughness={0.9} emissive="#ff4a1a" emissiveIntensity={0.8 * cut} /></mesh>
    <group position={[hx + 0.01 * Math.sin(tt * 30) * (1 - cut) * eio(tt, 1.6, 2.2), 0.6 - (tt > 2.75 ? 0.9 * (tt - 2.75) ** 2 : 0), 0]} rotation={[0, 0, tt > 2.75 ? 2.5 * (tt - 2.75) : 0]} visible={tt < 3.5}>
      <mesh position={[0, -0.04, 0]}><boxGeometry args={[0.012, 0.09, 0.012]} /><meshStandardMaterial color="#8a4a22" roughness={0.9} /></mesh></group>
    {/* corte del caño en el bajo: el agua adentro, y el charco que crece en el piso */}
    <mesh position={[0.0, 0.4 - sag - 0.012, 0.0]} scale={[1, Math.max(0.01, pool), 1]}><boxGeometry args={[0.3, 0.03, 0.034]} />{M.water({ op: 0.9 })}</mesh>
    {[3.6, 3.9, 4.2, 4.5, 4.8, 5.1, 5.4].map((a, i) => <Drop key={i} tt={tt} a={a} b={a + 0.4} x={0.02 * (i % 2)} y0={0.4 - 0.17 - 0.03} y1={-0.01} z={0.03} r={0.008} />)}
    <mesh position={[0.01, -0.012, 0.03]} rotation={[-PI / 2, 0, 0]} scale={[1, 0.6, 1]}><circleGeometry args={[0.02 + 0.13 * pool, 40]} />{M.water({ op: 0.75 })}</mesh>
    <Shock tt={tt} a={bang} p={[0, 0.22, 0.06]} r={0.14} col="#ff8a3a" />
    <Shock tt={tt} a={bang + 0.15} p={[0, 0.22, 0.06]} r={0.22} />
  </>;
}}</Scene3D>;

// ---- 15:42 · LA ABRAZADERA NUEVA: entra atornillada a la viga y sube el caño hasta la línea de pendiente ----
export const HNewStrap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#3a3833" warm={1.35} key1={[-0.6, 1.4, 1.2]} lamp={[0.25, 0.5, 0.25]}
  cam={{ at: [0.0, 0.44, 0], az: [0.28, -0.08], el: [0.02, 0.06], r: [1.3, 1.15], fov: 34 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "A NEW HANGER…"], [3.1, "…PULLS THE PIPE BACK TO THE SLOPE", "#1f6a3a"]]} y={960} />}>{(tt) => {
  const screw = eio(tt, 0.8, 2.0), lift = eio(tt, 2.9, 4.4), SG = 0.15, py = 0.4 - 0.03 * 0.02 - SG * (1 - lift) * Math.exp(-(0.02 ** 2) / 0.05);
  const ok = eio(tt, 4.3, 4.7), top = 0.59, drop = lift < 0.05;
  return <>
    {joists}
    <mesh position={[0, 0.5, -0.45]}><planeGeometry args={[3, 1.6]} /><meshStandardMaterial map={tex.brick(5, 3, "#8a5a44")} roughness={0.9} /></mesh>
    {/* foco pelado del sótano, colgando */}
    <Pipe a={[0.25, 0.64, 0.25]} b={[0.25, 0.55, 0.25]} r={0.003} col="#222" />
    <mesh position={[0.25, 0.52, 0.25]}><sphereGeometry args={[0.022, 16, 12]} />{M.glow({ col: "#fff1c8" })}</mesh>
    <SagPipe sag={SG * (1 - lift)} />
    {/* antes: el agua juntada en el bajo gotea; después: corre por adentro hacia la caldera (izquierda) */}
    {drop && [0.3, 0.75, 1.2, 1.65, 2.1, 2.55].map((a, k) => { const u = cl((tt - a) / 0.5); return <mesh key={k} visible={u > 0 && u < 1} position={[0.0, py - 0.03 - 0.4 * u * u, 0.0]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.008, 12, 10]} />{M.water({ op: 0.9 })}</mesh>; })}
    {Array.from({ length: 5 }, (_, k) => { const u = (tt * 0.55 + k / 5) % 1, x = lerp(0.5, -0.6, u); return <mesh key={k} position={[x, 0.4 - 0.03 * x + 0.03, 0.03]} rotation={[0, 0, PI / 2]}><coneGeometry args={[0.012, 0.03, 10]} /><meshBasicMaterial color="#6fc0ff" toneMapped={false} transparent opacity={0.9 * ok * Math.sin(PI * u)} /></mesh>; })}
    {/* línea de pendiente buscada: punteada mientras está vencido, sólida cuando el caño la alcanza */}
    {Array.from({ length: 14 }, (_, k) => { const x = -0.6 + k * 0.09; return <mesh key={k} position={[x, 0.4 - 0.03 * x + 0.035, 0.04]}><boxGeometry args={[lerp(0.04, 0.092, ok), 0.003 + 0.002 * ok, 0.002]} /><meshBasicMaterial color={ok > 0.5 ? "#5fd17a" : "#e9e2cf"} toneMapped={false} transparent opacity={eio(tt, 0.2, 0.6)} /></mesh>; })}
    {/* la abrazadera: varilla roscada desde la viga hasta el caño, U de chapa abajo; la tuerca gira y sube el caño */}
    <group position={[0.02, 0, 0]} visible={screw > 0.01}>
      <mesh position={[0, (top + py) / 2 + 0.015 + 0.25 * (1 - screw), 0]} scale={[1, Math.max(0.01, (top - py - 0.03) / 0.1), 1]}><cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />{M.steel({ col: "#9aa0a6" })}</mesh>
      <group position={[0, py + 0.0 + 0.25 * (1 - screw), 0]} rotation={[0, PI / 2, 0]}><mesh rotation={[0, 0, PI]}><torusGeometry args={[0.031, 0.006, 8, 24, PI]} />{M.steel()}</mesh></group>
      <mesh position={[0, py + 0.045 + 0.25 * (1 - screw), 0]} rotation={[0, (screw + lift) * 14, 0]}><cylinderGeometry args={[0.012, 0.012, 0.012, 6]} />{M.brass()}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 16:40 · EL RESPIRADERO MAESTRO: al final del caño grande, antes de que baje; uno grande al lado de uno de radiador ----
export const HMainVent: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#262420" key1={[-0.6, 1.6, 1.4]}
  cam={{ at: [0.0, 0.48, 0], az: [-0.35, 0.15], el: [0.12, 0.12], r: [1.25, 1.1], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "RADIATOR VENT: SMALL"], [3.1, "MAIN VENT: BIG, AT THE END", "#b3261e"]]} />}>{(tt) => {
  const k = eio(tt, 3.0, 3.6), ks = eio(tt, 0.4, 1.0) * (1 - eio(tt, 2.8, 3.2));
  return <>
    <Env kind="concrete" z={-0.4} y={0.5} rim={[0.6, 0.8, -0.1]} rimI={2.6} />
    <Pipe a={[-0.6, 0.3, 0]} b={[0.3, 0.3, 0]} r={0.035} col="#5d5a55" />
    <Pipe a={[0.3, 0.3, 0]} b={[0.3, -0.1, 0]} r={0.035} col="#5d5a55" />
    {/* el grande: cuerpo de fundición con sombrero */}
    <group position={[0.15, 0.335, 0]} scale={Math.max(0.001, phys(tt, 0.2, 8, 0.45))}>
      <Pipe a={[0, 0, 0]} b={[0, 0.06, 0]} r={0.012} col="#8a8f94" />
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.05, 0.055, 0.1, 28]} />{M.chrome({ col: "#c9ced3" })}</mesh>
      <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.02, 0.05, 0.03, 28]} />{M.chrome({ col: "#c9ced3" })}</mesh>
    </group>
    <Puffs tt={tt} n={18} a={[0.15, 0.53, 0]} b={[0.3, 0.95, 0]} r={0.035} col="#eef6ff" op={0.8 * k} v={1.1} />
    <Puffs tt={tt} n={6} a={[-0.25, 0.44, 0]} b={[-0.22, 0.56, 0]} r={0.008} col="#eef6ff" op={0.7 * ks} v={0.8} />
    {/* uno de radiador, chiquito, para comparar */}
    <group position={[-0.25, 0.36, 0]} scale={0.6}>
      <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.03, 0.03, 0.08, 24]} />{M.chrome()}</mesh>
      <mesh position={[0, 0.12, 0]}><sphereGeometry args={[0.03, 24, 12, 0, PI * 2, 0, PI / 2]} />{M.chrome()}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 17:25 · LA TRAMPA DE VAPOR, EN CORTE: el fuelle deja pasar el agua y se cierra con el vapor… hasta que se rompe ----
export const HSteamTrap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#20232a" key1={[-0.6, 1.5, 1.3]}
  cam={{ at: [0.0, 0.22, 0], az: [-0.3, 0.16], el: [0.12, 0.1], r: [0.9, 0.8], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "WATER THROUGH, STEAM STOPPED…"], [3.5, "FAILED TRAP: STEAM IN THE RETURN", "#b3261e"]]} />}>{(tt) => {
  const st = eio(tt, 2.0, 2.6), close = st * (1 - eio(tt, 3.3, 3.6)), fail = eio(tt, 3.3, 3.6), L = 0.05 + 0.045 * close;
  return <>
    <mesh position={[0, 0.5, -0.3]}><planeGeometry args={[3, 2]} /><meshStandardMaterial map={tex.concrete(4, 3)} roughness={0.9} /></mesh>
    {/* entrada desde el radiador (corte de vidrio) */}
    <mesh position={[-0.3, 0.27, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.42, 22, 1, true]} />{M.glass({ op: 0.18 })}</mesh>
    {/* el cuerpo de la trampa: vidrio con tapa hexagonal y base de bronce */}
    <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.08, 0.08, 0.18, 32, 1, true]} />{M.glass({ op: 0.16 })}</mesh>
    <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.085, 0.085, 0.04, 6]} />{M.brass({ col: "#c39a4c" })}</mesh>
    <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.085, 0.07, 0.03, 32]} />{M.brass({ col: "#b48a3c" })}</mesh>
    <mesh position={[0, 0.17, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.018, 0.005, 10, 24]} />{M.brass()}</mesh>
    {/* el fuelle: anillos de cobre que se estiran con el vapor; roto, queda corto y al rojo */}
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0, 0.335 - (i + 0.5) * L / 7, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.036, 0.007, 10, 28]} /><meshStandardMaterial color="#c8743c" metalness={0.85} roughness={0.3} emissive="#ff2a1a" emissiveIntensity={0.9 * fail} /></mesh>)}
    <mesh position={[0, 0.335 - L - 0.012, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.02, 0.03, 20]} />{M.brass()}</mesh>
    {/* salida al retorno */}
    <Pipe a={[0, 0.135, 0]} b={[0, 0.06, 0]} r={0.022} col="#55585b" />
    <Pipe a={[0, 0.06, 0]} b={[0.55, 0.06, 0]} r={0.022} col="#55585b" />
    {/* agua (azul) que pasa; vapor (blanco) que llega; con la trampa rota el vapor se va al retorno */}
    <Puffs tt={tt} n={7} a={[-0.5, 0.255, 0.0]} b={[-0.05, 0.255, 0.0]} r={0.01} col="#3f93e0" op={0.95 * (1 - st * 0.7)} v={0.5} wob={0.002} />
    <Puffs tt={tt} n={8} a={[-0.5, 0.28, 0]} b={[-0.06, 0.28, 0]} r={0.016} op={0.8 * st} v={0.7} />
    <Puffs tt={tt} n={6} a={[0, 0.2, 0.0]} b={[0, 0.07, 0.0]} r={0.009} col="#3f93e0" op={0.95 * (1 - close)} v={0.8} wob={0.002} />
    <Puffs tt={tt} n={10} a={[0.02, 0.06, 0.03]} b={[0.55, 0.06, 0.03]} r={0.016} op={0.85 * fail} v={1.1} />
    <Shock tt={tt} a={3.35} p={[0, 0.3, 0.09]} r={0.07} col="#ff6a3a" />
  </>;
}}</Scene3D>;

// ---- 18:02 · CAÑO PELADO: sótano de ladrillo con luz cálida; el caño desnudo transpira y gotea; entra la envoltura gruesa y queda seco. La venda vieja y blanca, ni tocarla ----
export const HBarePipe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#2a1f18" warm={1.2} key1={[-0.9, 1.3, 1.1]} lamp={[-0.3, 0.75, 0.35]}
  cam={{ at: [0.0, 0.24, 0], at1: [0.05, 0.22, 0], az: [-0.3, -0.1], el: [0.1, 0.06], r: [1.05, 0.92], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "BARE PIPE: STEAM TURNS TO WATER", "#b3261e"], [3.4, "OLD WHITE WRAP? DON'T TOUCH IT", "#b3261e"]]} />}>{(tt) => {
  const k = eio(tt, 0.4, 1.4), wrap = eio(tt, 2.8, 4.2), x1 = lerp(0.5, -0.45, wrap), warn = eio(tt, 3.4, 3.8);
  return <>
    <Env kind="brick" col="#7a4632" z={-0.22} y={0.5} rim={[0.6, 0.6, 0.1]} rimI={2.4} />
    {/* bombita de sótano */}
    <mesh position={[-0.3, 0.78, 0.3]}><sphereGeometry args={[0.035, 20, 14]} /><meshBasicMaterial color="#ffd89a" toneMapped={false} /></mesh>
    <group position={[0, 0.4, 0]}>
      <Pipe a={[-0.6, 0, 0]} b={[0.6, 0, 0]} r={0.034} col="#8a5a3a" em="#ff6a1a" emI={0.2 * k} />
      {/* gotitas que se forman sobre el caño (sólo donde está pelado) */}
      {Array.from({ length: 26 }, (_, i) => { const x = -0.58 + i * 0.045 + 0.01 * Math.sin(i * 3), a = (i * 0.37) % 6.28; const on = x < x1 ? 1 : 0;
        return <mesh key={i} position={[x, 0.034 * Math.cos(a) * 0.4 - 0.022, 0.034 * Math.sin(a) * 0.3 + 0.028]} visible={on > 0 && k > 0.05}><sphereGeometry args={[0.0055 * k, 10, 8]} />{M.water({ op: 0.9, col: "#cfe6f7" })}</mesh>; })}
      {[1.2, 1.55, 1.9, 2.25, 2.6, 2.95, 3.3].map((a, i) => { const x = -0.5 + 0.13 * i; return x < x1 - 0.05 ? <Drop key={i} tt={tt} a={a} b={a + 0.4} x={x} y0={-0.035} y1={-0.4} r={0.008} ring={false} /> : null; })}
      {/* la envoltura nueva, gruesa con camisa de aluminio, que avanza desde la derecha */}
      <group position={[(x1 + 0.6) / 2, 0, 0]} scale={[Math.max(0.001, (0.6 - x1) / 1.2), 1, 1]} visible={wrap > 0.005}>
        <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.07, 0.07, 1.2, 36]} /><meshStandardMaterial color="#c9ccd0" metalness={0.7} roughness={0.35} /></mesh>
        {[-0.4, 0, 0.4].map((x) => <mesh key={x} position={[x, 0, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.071, 0.004, 8, 36]} />{M.steel({ col: "#9aa0a6" })}</mesh>)}
      </group>
      <mesh position={[x1, 0, 0]} rotation={[0, PI / 2, 0]} visible={wrap > 0.005 && wrap < 0.995}><ringGeometry args={[0.034, 0.07, 36]} /><meshStandardMaterial color="#f2d36a" roughness={1} side={THREE.DoubleSide} /></mesh>
    </group>
    {/* la venda vieja y blanca, abajo: cinta amarilla y anillo de advertencia */}
    <group position={[0, 0.2, 0.04]}>
      <Pipe a={[-0.6, 0, 0]} b={[0.6, 0, 0]} r={0.03} col="#8a5a3a" />
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.052, 0.052, 0.6, 24]} /><meshStandardMaterial color="#e6e1d6" roughness={1} /></mesh>
      {[-0.2, 0.05, 0.22].map((x) => <mesh key={x} position={[x, 0.0, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.053, 0.004, 6, 24]} /><meshStandardMaterial color="#bfb8a8" roughness={1} /></mesh>)}
      <group position={[0, 0.0, 0.055]} scale={[Math.max(0.001, warn), 1, 1]}><RBox s={[0.62, 0.035, 0.004]} r={0.002}><meshStandardMaterial color="#f2c230" roughness={0.6} /></RBox></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 19:05 · EL PRESOSTATO Y SU MANÓMETRO: la caja gris sobre el rulo, y al lado el reloj de 0-10 PSI; la aguja baja de 8 a 1,5 ----
export const HPressuretrol: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#232a2e" key1={[-0.6, 1.5, 1.4]} warm={1.1}
  cam={{ at: [0.06, 0.32, 0], az: [-0.38, 0.12], el: [0.1, 0.06], r: [0.8, 0.72], fov: 30 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "LOW PRESSURE IS THE WHOLE TRICK…"], [3.6, "½ TO 2 PSI · A TECH SETS IT", "#1f6a3a"]]} />}>{(tt) => {
  const v = lerp(9.2, 1.2, eio(tt, 2.5, 4.9)) + 0.12 * Math.sin(tt * 2) * (1 - eio(tt, 4.6, 5.0));
  return <>
    <mesh position={[0, 0.5, -0.3]}><planeGeometry args={[3, 2]} /><meshStandardMaterial map={tex.plaster("#5a6e64", 3, 2)} roughness={0.9} /></mesh>
    <Pipe a={[-0.35, 0.08, 0]} b={[0.45, 0.08, 0]} r={0.02} col="#4a4d50" />
    {/* presostato: caja gris con tapa, tornillo de ajuste y el rulo debajo */}
    <RBox s={[0.16, 0.2, 0.09]} p={[-0.08, 0.38, 0]} r={0.014}><meshStandardMaterial color="#8d9296" metalness={0.45} roughness={0.45} /></RBox>
    <RBox s={[0.17, 0.03, 0.095]} p={[-0.08, 0.49, 0]} r={0.01}><meshStandardMaterial color="#6f7478" metalness={0.5} roughness={0.4} /></RBox>
    <mesh position={[-0.08, 0.52, 0]}><cylinderGeometry args={[0.012, 0.012, 0.03, 14]} />{M.brass()}</mesh>
    <mesh position={[-0.08, 0.25, 0]}><torusGeometry args={[0.03, 0.005, 8, 36]} />{M.steel({ col: "#b07a4a" })}</mesh>
    <Pipe a={[-0.08, 0.28, 0]} b={[-0.08, 0.3, 0]} r={0.005} col="#b07a4a" />
    <Pipe a={[-0.08, 0.22, 0]} b={[-0.08, 0.08, 0]} r={0.005} col="#b07a4a" />
    {/* el manómetro grande de 0-10 PSI, con su aguja que baja */}
    <Pipe a={[0.2, 0.08, 0]} b={[0.2, 0.22, 0]} r={0.006} col="#b07a4a" />
    <mesh position={[0.2, 0.22, 0]}><cylinderGeometry args={[0.012, 0.012, 0.03, 6]} />{M.brass()}</mesh>
    <Gauge v={v} max={10} tx={dialTex("ptrol10", 10, 0.5, 2, "PSI", 5)} p={[0.2, 0.34, 0.0]} r={0.105} />
  </>;
}}</Scene3D>;

// ---- 20:14 · MANOS AFUERA: sobre la caldera, la válvula de seguridad escupe vapor; baja una campana de vidrio, se empaña y la deja aislada ----
export const HBellJar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#2a201a" warm={1.15} key1={[-0.5, 1.5, 1.1]}
  cam={{ at: [0, 0.3, 0], at1: [0, 0.26, 0], az: [-0.3, 0.12], el: [0.2, 0.12], r: [0.98, 0.84], fov: 30 }}
  over={(tt) => <Big tt={tt} steps={[[0.8, "THE SAFETY VALVE…"], [3.3, "…NEVER TOUCH IT", "#b3261e"]]} />}>{(tt) => {
  const jar = phys(tt, 2.9, 7, 0.5), fog = eio(tt, 3.3, 5.0), hiss = eio(tt, 0.4, 1.0), lev = 0.25 * Math.sin(tt * 1.9) * hiss * (1 - eio(tt, 2.9, 3.2));
  return <>
    <Env kind="brick" col="#7a4632" z={-0.45} rim={[0.5, 0.7, -0.2]} rimI={2.6} />
    {/* el techo de la caldera: chapa verde remachada */}
    <RBox s={[0.9, 0.08, 0.6]} p={[0, 0.0, 0]} r={0.02}><meshStandardMaterial color="#3d5a4b" metalness={0.45} roughness={0.45} /></RBox>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.4 + i * 0.1, 0.042, 0.27]}><sphereGeometry args={[0.008, 10, 8]} />{M.steel()}</mesh>)}
    <group position={[0, 0.04, 0]} scale={1.5}>
      <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.025, 0.025, 0.08, 18]} />{M.brass()}</mesh>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.04, 0.03, 0.08, 18]} />{M.brass()}</mesh>
      <group position={[0, 0.17, 0]} rotation={[0, 0, -0.3 + lev]}><mesh position={[0.05, 0, 0]}><boxGeometry args={[0.1, 0.008, 0.015]} />{M.brass({ col: "#b8892e" })}</mesh></group>
      <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.012, 0.012, 0.02, 12]} />{M.brass()}</mesh>
      <mesh position={[0.045, 0.12, 0]} rotation={[0, 0, -PI / 2]}><cylinderGeometry args={[0.012, 0.014, 0.03, 12]} />{M.brass()}</mesh>
    </group>
    {/* el vapor sale por la boquita; adentro de la campana queda dando vueltas */}
    <Puffs tt={tt} n={12} a={[0.1, 0.22, 0]} b={[0.32, 0.45, 0.02]} r={0.016} op={0.75 * hiss * (1 - jar)} v={1.1} />
    {Array.from({ length: 5 }, (_, i) => { const a = tt * 0.9 + i * 1.26, rr = 0.1 + 0.04 * rn(i, 2);
      return <mesh key={i} position={[rr * Math.cos(a), 0.12 + 0.3 * rn(i, 3) + 0.03 * Math.sin(tt + i), rr * Math.sin(a)]}><sphereGeometry args={[0.018 + 0.01 * rn(i, 4), 14, 10]} /><meshStandardMaterial color="#f4f6f8" transparent opacity={0.1 * cl(jar) * (0.5 + 0.5 * fog)} depthWrite={false} /></mesh>; })}
    {/* la campana: baja, rebota, se empaña y corren gotas por el vidrio */}
    <group position={[0, 0.04 + (1 - cl(jar)) * 0.7, 0]} scale={[0.85, 0.72, 0.85]}>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.17, 0.17, 0.4, 48, 1, true]} />{M.glass({ op: 0.1 })}</mesh>
      <mesh position={[0, 0.4, 0]}><sphereGeometry args={[0.17, 48, 16, 0, PI * 2, 0, PI / 2]} />{M.glass({ op: 0.1 })}</mesh>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.165, 0.165, 0.4, 48, 1, true]} /><meshStandardMaterial color="#eef2f4" transparent opacity={0.09 * fog} roughness={1} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.4, 0]}><sphereGeometry args={[0.165, 48, 16, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#eef2f4" transparent opacity={0.09 * fog} roughness={1} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.005, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.172, 0.008, 12, 64]} />{M.chrome()}</mesh>
      <mesh position={[0, 0.6, 0]}><sphereGeometry args={[0.03, 16, 12]} />{M.chrome()}</mesh>
      {Array.from({ length: 9 }, (_, i) => { const a = -0.9 + i * 0.22, u = cl(((tt - 3.2 - rn(i, 7) * 1.5) * 0.45)), y = 0.38 - 0.34 * u;
        return <mesh key={i} position={[0.172 * Math.sin(a), y, 0.172 * Math.cos(a)]} scale={[1, 1.6, 1]} visible={u > 0 && u < 1}><sphereGeometry args={[0.006, 10, 8]} />{M.water({ op: 0.9, col: "#cfe6f7" })}</mesh>; })}
    </group>
    <mesh position={[0, 0.042, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.18, 0.2, 64]} /><meshBasicMaterial color="#e5332a" transparent opacity={0.85 * eio(tt, 3.2, 3.5)} toneMapped={false} depthWrite={false} /></mesh>
  </>;
}}</Scene3D>;
