// lsm29b · componentes únicos 25-29 (la libreta de poemas, lo que dejé, setenta-doce-tres-uno, Hazel en la nevada, las siete tazas del porche).
import React from "react";
import * as THREE from "three";
import { AMB, H, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Teacup, paperTex } from "./tg";
import { Peg, Porch, Sky, listTex } from "./pg";

const PI = Math.PI;
const grey = (c: string, k: number) => new THREE.Color(c).lerp(new THREE.Color("#8a8884"), k);

// ---- 17:36 · LA LIBRETA DEL ALFÉIZAR: las hojas de poemas pasan solas con la brisa; se cierra la tapa y la libreta se queda gris ----
const POEM = ["The wind comes in", "across the bean field", "and I hang the wash", "like I hang my hopes —", "one pin at a time."];
export const HPoemnotebook: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="wood" warm={0.8} key1={[-0.4, 2.0, 1.4]}
  cam={{ at: [0, 0.99, -1.38], at1: [0.0, 0.99, -1.4], az: [0.25, 0.05], el: [0.62, 0.5], r: [0.7, 0.58], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="I STOPPED WRITING" col={AMB} size={42} />}>{(tt) => {
  const close = eio(tt, 3.0, 3.8), fade = 0.45 * eio(tt, 3.6, 4.8), n = Math.min(POEM.length, Math.floor(tt / 0.45) + 1);
  return <>
    {/* el alféizar de la ventana de la cocina con su cortina a cuadros */}
    <RBox s={[0.9, 0.04, 0.22]} r={0.006} p={[0, 0.94, -1.45]}>{M.matte({ col: "#f0ece2" })}</RBox>
    <mesh position={[0, 1.3, -1.57]}><planeGeometry args={[0.8, 0.7]} /><meshStandardMaterial color="#a9c3d6" emissive="#cfe0ee" emissiveIntensity={0.5} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[k * 0.34, 1.3, -1.54]}><planeGeometry args={[0.2, 0.72]} /><meshStandardMaterial map={tex.text("ging", 128, 128, (g) => { g.fillStyle = "#f6f1e2"; g.fillRect(0, 0, 128, 128); g.fillStyle = "rgba(230,190,60,.55)"; for (let i = 0; i < 8; i++) { g.fillRect(i * 16, 0, 8, 128); g.fillRect(0, i * 16, 128, 8); } })} roughness={0.9} side={THREE.DoubleSide} /></mesh>)}
    <group position={[0, 0.962, -1.42]} rotation={[0, 0.1, 0]} scale={1.6}>
      {/* el bloque de hojas y la espiral de alambre */}
      <RBox s={[0.3, 0.01, 0.2]} r={0.002} p={[0, -0.004, 0]}><meshStandardMaterial color={grey("#f3ecd8", fade)} roughness={0.9} /></RBox>
      {Array.from({ length: 9 }, (_, i) => <mesh key={"sp" + i} position={[0, 0.004, -0.085 + i * 0.021]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.008, 0.0015, 6, 16]} />{M.steel()}</mesh>)}
      {/* la hoja de la izquierda (tapa adentro) y la de la derecha con el poema */}
      <mesh position={[-0.075, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.15, 0.2]} /><meshStandardMaterial map={listTex("poemL", ["Loretta", "1966 —"], 2, { w: 300, h: 400 })} color={grey("#ffffff", fade)} roughness={0.85} /></mesh>
      <mesh position={[0.075, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.15, 0.2]} /><meshStandardMaterial map={listTex("poemR", POEM, n, { w: 300, h: 400 })} color={grey("#ffffff", fade)} roughness={0.85} /></mesh>
      {/* las hojas que pasa la brisa */}
      {[0, 1, 2, 3].map((i) => { const a = 0.4 + i * 0.6, f = eio(tt, a, a + 0.7); return tt > a && tt < a + 0.75 && <group key={i} rotation={[0, 0, PI * f]}><mesh position={[0.075, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.15, 0.2]} /><meshStandardMaterial color="#f3ecd8" roughness={0.85} side={THREE.DoubleSide} /></mesh></group>; })}
      {/* la tapa azul que se cierra */}
      <group position={[-0.15, 0.004, 0]} rotation={[0, 0, -PI * (1 - close) * 0.98]}>
        <mesh position={[0.15 / 1, 0, 0]}><boxGeometry args={[0.3, 0.005, 0.21]} /><meshPhysicalMaterial color={grey("#2f5fa8", fade)} roughness={0.5} clearcoat={0.3} /></mesh>
        <mesh position={[0.15, -0.003, 0]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[0.16, 0.06]} /><meshStandardMaterial map={paperTex("poemcv", ["POEMS"], { w: 256, h: 96, bg: "#2f5fa8", ink: "#f4ead0", font: "900" })} color={grey("#ffffff", fade)} side={THREE.DoubleSide} /></mesh>
      </group>
    </group>
    <group position={[0.3, 0.97, -1.38]} rotation={[PI / 2, 0, 1.2]}><mesh><cylinderGeometry args={[0.004, 0.004, 0.12, 6]} /><meshStandardMaterial color={grey("#e8b92c", fade)} roughness={0.5} /></mesh></group>
  </>;
}}</Scene3D>;

// ---- 18:38 · CONTÁ LO QUE DEJASTE: la túnica del coro, el himnario del círculo, la libreta y el tapado rojo se apoyan uno a uno y se apagan; en primavera vuelven a levantarse con su color ----
const THINGS = [{ col: "#6a1e2a", name: "CHOIR" }, { col: "#2f4f6a", name: "CIRCLE" }, { col: "#2f5fa8", name: "POEMS" }, { col: "#c0262a", name: "RED COAT" }];
export const HPutdown: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.8}
  cam={{ at: [0, 0.55, -0.25], at1: [0.0, 0.58, -0.25], az: [0.12, -0.08], el: [0.22, 0.26], r: [1.65, 1.45], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="COUNT WHAT YOU PUT DOWN" col={AMB} size={40} />}>{(tt) => {
  const up = eio(tt, 3.6, 4.6);
  return <>
    {/* el banco largo contra la pared */}
    <RBox s={[1.9, 0.05, 0.36]} r={0.01} p={[0, 0.42, -0.3]}>{M.wood({ base: [130, 86, 50] })}</RBox>
    {[-0.85, 0.85].map((x) => <RBox key={x} s={[0.06, 0.42, 0.32]} r={0.008} p={[x, 0.21, -0.3]}>{M.wood({ base: [116, 76, 44] })}</RBox>)}
    {THINGS.map((th, i) => { const a = 0.4 + i * 0.65, d = phys(tt, a, 7, 0.5), x = -0.5 + i * 0.33, g = cl((tt - a - 0.4) / 0.8) * (1 - up), lift = 0.25 * up * (0.6 + 0.4 * Math.sin(PI * cl((tt - 3.6 - i * 0.08) / 0.9)));
      const c = new THREE.Color(th.col).lerp(new THREE.Color("#3e3c3a"), g);
      return <group key={i} position={[-0.69 + i * 0.46, 0.445 + (1 - cl(d)) * 0.4 + lift, -0.28]} scale={1.6}>
        {i === 0 && <group><mesh position={[0, 0.04, 0]} scale={[1, 0.3, 1]}><boxGeometry args={[0.24, 0.24, 0.24]} /><meshStandardMaterial color={c} roughness={0.85} /></mesh><mesh position={[0, 0.085, 0]}><boxGeometry args={[0.2, 0.012, 0.06]} /><meshStandardMaterial color={grey("#e8d29a", g)} roughness={0.7} /></mesh></group>}
        {i === 1 && <group rotation={[0, 0.3, 0]}><RBox s={[0.15, 0.04, 0.21]} r={0.006} p={[0, 0.02, 0]}><meshStandardMaterial color={c} roughness={0.6} /></RBox><mesh position={[0, 0.041, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.09, 0.04]} /><meshStandardMaterial map={paperTex("hymn", ["HYMNS"], { w: 256, h: 112, bg: "#2f4f6a", ink: "#e0c27a", font: "900" })} color={grey("#ffffff", g)} /></mesh></group>}
        {i === 2 && <group rotation={[0, -0.2, 0]}><RBox s={[0.15, 0.015, 0.2]} r={0.004} p={[0, 0.008, 0]}><meshStandardMaterial color={c} roughness={0.6} /></RBox></group>}
        {i === 3 && <group><mesh position={[0, 0.05, 0]} scale={[1, 0.35, 0.8]}><sphereGeometry args={[0.14, 24, 16]} /><meshStandardMaterial color={c} roughness={0.8} /></mesh>{[-1, 1].map((k) => <mesh key={k} position={[k * 0.03, 0.095, 0.08]}><sphereGeometry args={[0.008, 10, 8]} /><meshStandardMaterial color={grey("#1a1a1a", g)} /></mesh>)}</group>}
        {/* la etiqueta de lo que dejé */}
        <mesh position={[0, -0.016 - lift / 1.6, 0.112]}><planeGeometry args={[0.13, 0.032]} /><meshStandardMaterial map={paperTex("pd" + i, [th.name], { w: 256, h: 64, bg: "#f4ecd6", ink: "#3a2412", font: "900" })} roughness={0.85} /></mesh>
      </group>; })}
    {/* la luz de primavera que entra al final y les devuelve el color */}
    <spotLight position={[-0.6, 1.8, 0.8]} target-position={[0, 0.45, -0.3]} angle={0.6} penumbra={0.8} intensity={0.3 + 6 * up} distance={4} color="#fff2c8" />
    <pointLight position={[0, 0.9, 0.3]} intensity={1.0 * (1 - cl(tt / 3.4)) * (1 - up) + 0.12} distance={2} color="#9aa4b4" />
    {/* el contador en tiza: cuántas cosas dejé */}
    <group position={[0.62, 0.92, -0.6]}><RBox s={[0.26, 0.2, 0.02]} r={0.006}><meshStandardMaterial color="#2a3a2e" roughness={0.9} /></RBox>
      {Array.from({ length: THINGS.filter((_, i) => tt > 0.9 + i * 0.65).length }, (_, i) => <mesh key={i} position={[-0.07 + i * 0.04, 0, 0.012]}><planeGeometry args={[0.008, 0.11]} /><meshBasicMaterial color="#efece4" transparent opacity={0.9 * (1 - up)} /></mesh>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 19:30 · SETENTA, DOCE, TRES, UNO: los anillos de gente se arman de afuera hacia adentro alrededor de una mesita con una sola taza ----
const RINGS = [{ n: 70, r: 0.72, a: 0.3, col: "#c9b48a" }, { n: 12, r: 0.42, a: 1.6, col: "#b8865a" }, { n: 3, r: 0.22, a: 2.6, col: "#a0623a" }, { n: 1, r: 0.09, a: 3.4, col: "#c9952e" }];
export const HCircles70: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" warm={0.75} key1={[-1.0, 2.6, 1.0]}
  cam={{ at: [0, 0.05, 0], at1: [0.0, 0.08, 0.02], az: [0.3, -0.1], el: [0.95, 0.7], r: [2.1, 1.3], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="70 · 12 · 3 · 1" col={AMB} size={46} />}>{(tt) => <>
    {RINGS.map((rg, j) => Array.from({ length: rg.n }, (_, i) => { const a = rg.a + (i / rg.n) * 0.9, k = phys(tt, a, 9, 0.4); if (tt < a) return null; const an = (i / rg.n) * PI * 2 + j * 0.3;
      return <Peg key={j + "-" + i} p={[Math.cos(an) * rg.r, (1 - cl(k)) * 0.2, Math.sin(an) * rg.r]} s={j === 3 ? 1.8 : j === 2 ? 1.5 : j === 1 ? 1.25 : 1} col={rg.col} />; }))}
    {/* el anillo en el piso que marca cada círculo */}
    {RINGS.map((rg, j) => <mesh key={"r" + j} rotation={[-PI / 2, 0, 0]} position={[0, 0.002, 0]}><ringGeometry args={[rg.r - 0.006, rg.r + 0.006, 96]} />{M.glow({ col: "#ffcf7a", op: 0.35 * eio(tt, rg.a, rg.a + 0.6) })}</mesh>)}
    {/* la mesita de la cena con su taza: el de adentro */}
    <group position={[0.14, 0, 0.0]}><RBox s={[0.1, 0.06, 0.1]} r={0.008} p={[0, 0.03, 0]}>{M.wood({ base: [150, 100, 58] })}</RBox><group position={[0, 0.062, 0]} scale={0.5}><Teacup /></group></group>
    <pointLight position={[0, 0.4, 0]} intensity={1.2 * eio(tt, 3.4, 4.0)} distance={0.9} color="#ffcf8a" />
  </>}</Scene3D>;

// ---- 20:43 · CUARENTA MILLAS EN LA NEVADA: los faros de Hazel abren la nieve en la ruta de noche y el cuentakilómetros llega a 40 ----
export const HSnowdrive: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0b0e14" warm={0.3} key1={[-1.0, 2.6, 1.0]}
  cam={{ at: [0, 0.25, -0.6], at1: [0.02, 0.22, -0.5], az: [-0.5, -0.25], el: [0.2, 0.14], r: [1.6, 1.25], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={0.4} x={960} y={1010} txt={Math.min(40, Math.floor(eio(tt, 0.3, 4.4) * 40.99)) + " MILES IN A SNOWSTORM"} col={AMB} size={48} />}>{(tt) => {
  const z = lerp(-3.0, -0.2, eio(tt, 0.2, 4.4)), miles = Math.min(40, Math.floor(eio(tt, 0.3, 4.4) * 40.99)), on = cl(tt / 0.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[6, 8]} /><meshStandardMaterial color="#d9e0e8" roughness={0.9} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.002, -1.5]}><planeGeometry args={[0.7, 7]} /><meshStandardMaterial color="#b6bfc9" roughness={0.9} /></mesh>
    {/* los postes de la línea a la orilla de la ruta */}
    {[0, 1, 2, 3, 4].map((i) => <RBox key={i} s={[0.03, 0.9, 0.03]} r={0.004} p={[0.6, 0.45, 0.4 - i * 1.0]}><meshStandardMaterial color="#3a2e24" roughness={0.9} /></RBox>)}
    {/* el auto de Hazel que viene hacia nosotros */}
    <group position={[0, 0, z]}>
      <RBox s={[0.4, 0.13, 0.66]} r={0.05} p={[0, 0.13, 0]}><meshPhysicalMaterial color="#6a7d6a" roughness={0.35} clearcoat={0.7} /></RBox>
      <RBox s={[0.34, 0.12, 0.32]} r={0.05} p={[0, 0.25, -0.04]}><meshPhysicalMaterial color="#6a7d6a" roughness={0.35} clearcoat={0.7} /></RBox>
      {/* parabrisas, parrilla cromada, paragolpes y ruedas */}
      <mesh position={[0, 0.25, 0.125]} rotation={[-0.5, 0, 0]}><planeGeometry args={[0.3, 0.1]} />{M.glass()}</mesh>
      <RBox s={[0.22, 0.05, 0.01]} r={0.004} p={[0, 0.13, 0.333]}>{M.chrome()}</RBox>
      <RBox s={[0.42, 0.03, 0.03]} r={0.01} p={[0, 0.075, 0.335]}>{M.chrome()}</RBox>
      {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([kx, kz], i) => <mesh key={"w" + i} position={[kx * 0.19, 0.065, kz * 0.22]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.065, 0.065, 0.05, 20]} /><meshStandardMaterial color="#141414" roughness={0.9} /></mesh>)}
      <RBox s={[0.36, 0.012, 0.6]} r={0.01} p={[0, 0.3, -0.02]}><meshStandardMaterial color="#f4f6f8" roughness={0.9} /></RBox>
      {[-1, 1].map((k) => <group key={k}><mesh position={[k * 0.15, 0.14, 0.334]}><circleGeometry args={[0.045, 24]} />{M.glow({ col: "#fff6dc", op: on })}</mesh><mesh position={[k * 0.15, 0.14, 0.336]}><circleGeometry args={[0.1, 24]} />{M.glow({ col: "#fff2c8", op: 0.25 * on })}</mesh></group>)}
      <spotLight position={[0, 0.16, 0.32]} angle={0.5} penumbra={0.7} intensity={9 * on} distance={3} color="#fff3d6" />
      {/* el haz de los faros entre los copos */}
      <mesh position={[0, 0.14, 0.9]} rotation={[PI / 2, 0, 0]}><coneGeometry args={[0.35, 1.2, 24, 1, true]} /><meshBasicMaterial color="#fff6dc" transparent opacity={0.06 * on} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
    </group>
    {/* la nevada */}
    {Array.from({ length: 140 }, (_, i) => { const y = 1.2 - ((tt * 0.22 + rn(i, 2)) % 1) * 1.2; return <mesh key={i} position={[(rn(i, 3) - 0.5) * 2.4 + 0.05 * Math.sin(tt + i), y, (rn(i, 4) - 0.5) * 3 - 0.6]}><sphereGeometry args={[0.006, 6, 4]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85} /></mesh>; })}
    {/* el cuentamillas */}
    <group position={[-0.62, 0.62, -0.1]} rotation={[0, 0.5, 0]} scale={0.5}><RBox s={[0.34, 0.16, 0.04]} r={0.014}><meshStandardMaterial color="#1a1c20" roughness={0.5} /></RBox><DigitDrum v={Math.floor(miles / 10)} p={[-0.06, 0, 0.022]} r={0.06} w={0.08} /><DigitDrum v={miles % 10} p={[0.06, 0, 0.022]} r={0.06} w={0.08} /></group>
  </>;
}}</Scene3D>;

// ---- 21:44 · SIETE EN EL PORCHE: sobre la baranda se apoyan, una por una, siete tazas con platito, cada una con su tarjetita ----
const SEVEN = ["Edith", "Lyle", "Vern", "the Bible man", "Carol", "the bazaar lady", "Bev"];
export const HSevencups: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#16130f" warm={0.8} key1={[-1.0, 2.2, 1.6]}
  cam={{ at: [-0.45, 0.88, -0.05], at1: [0.45, 0.88, -0.05], az: [0.3, 0.15], el: [0.22, 0.18], r: [1.0, 0.9], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="40 YEARS ON THE PORCH" col={AMB} size={40} />}>{(tt) => <>
    <Sky />
    <group position={[0, 0, 0.5]}><Porch w={2.4} d={1.2} yard={false} /></group>
    {SEVEN.map((n, i) => { const a = 0.3 + i * 0.6, k = phys(tt, a, 8, 0.45), x = -0.9 + i * 0.3; return tt > a - 0.05 && <group key={i} position={[x, 0.848 + (1 - cl(k)) * 0.25, -0.07]}>
      <group scale={1.25}><Teacup tt={tt} steam={0.6 * cl((tt - a) / 0.6)} /></group>
      <mesh position={[0, 0.035, 0.075]} rotation={[-0.2, 0, 0]}><planeGeometry args={[0.2, 0.065]} /><meshStandardMaterial map={paperTex("sc2" + i, [n], { w: 480, h: 156, bg: "#f4ecd6", ink: "#3a2412", font: "italic 900" })} roughness={0.85} side={THREE.DoubleSide} /></mesh>
    </group>; })}
    <pointLight position={[0, 1.3, 0.4]} intensity={0.8} distance={2.2} color="#ffd08a" />
  </>}</Scene3D>;
