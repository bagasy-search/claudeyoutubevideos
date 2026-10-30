// lhh29a · componentes únicos 17-24 (kit h3d): la chinche en el zapato, la cerca de tablas rectas, la nieve hasta la baranda,
// la bañera segura, la esponja de las diez veces, la palangana a los rosales, el precio de la sal perfumada y la sartén que se oxida.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn, tubeG, DigitDrum } from "./h3d";

const PI = Math.PI;
const lathe = (pts: number[][], seg = 64) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);

// ---- 10:18 · COMO PISAR UNA CHINCHE: el zapato negro de los domingos; una chinche de bronce cae punta arriba adentro y el zapato se aprieta: latido rojo ----
export const HTack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark"
  cam={{ at: [0, 0.05, 0], az: [-0.8, -0.4], el: [0.55, 0.42], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="LIKE WALKING ON A TACK" col={RED} />}>{(tt) => {
  const fall = phys(tt, 0.5, 7, 0.4), press = [2.4, 3.6, 4.8].map((a) => Math.max(0, Math.sin(cl((tt - a) / 0.5) * PI))), sq = Math.max(...press);
  return <>
    {/* zapato bajo de domingo: suela, empeine redondeado y taco */}
    <group scale={[1, 1 - 0.08 * sq, 1]}>
      <RBox s={[0.27, 0.012, 0.1]} p={[0, 0.006, 0]} r={0.03}><meshPhysicalMaterial color="#1a1412" roughness={0.6} /></RBox>
      <mesh position={[0.03, 0.03, 0]} scale={[1.45, 0.55, 0.92]}><sphereGeometry args={[0.07, 40, 20, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color="#121214" roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} side={THREE.DoubleSide} /></mesh>
      <RBox s={[0.1, 0.05, 0.088]} p={[-0.085, 0.03, 0]} r={0.02}><meshPhysicalMaterial color="#121214" roughness={0.18} clearcoat={1} /></RBox>
      {/* boca abierta del zapato, forro claro */}
      <mesh position={[-0.05, 0.057, 0]} rotation={[-PI / 2, 0, 0]} scale={[1.5, 1, 1]}><circleGeometry args={[0.035, 32]} /><meshStandardMaterial color="#b49a7c" roughness={0.9} /></mesh>
      <RBox s={[0.05, 0.035, 0.07]} p={[-0.13, -0.004, 0]} r={0.006}><meshPhysicalMaterial color="#1a1412" roughness={0.5} /></RBox>
    </group>
    {/* la chinche de bronce cae en la boca del zapato */}
    <group position={[-0.05, 0.062 + (1 - cl(fall)) * 0.3, 0]} rotation={[0, tt, 0]}>
      <mesh><cylinderGeometry args={[0.016, 0.016, 0.003, 32]} />{M.brass()}</mesh>
      <mesh position={[0, 0.012, 0]}><coneGeometry args={[0.0025, 0.022, 10]} />{M.chrome()}</mesh>
    </group>
    {/* latidos rojos en la punta del dedo gordo cada vez que pisa */}
    {press.map((p, i) => p > 0 && <mesh key={i} position={[0.12, 0.045, 0]} rotation={[0, PI / 2, 0]}><ringGeometry args={[0.02 + 0.06 * p, 0.026 + 0.06 * p, 40]} />{M.glow({ col: RED, op: 0.55 * p })}</mesh>)}
    <pointLight position={[0.12, 0.06, 0.05]} color="#ff4a3a" intensity={1.1 * sq} distance={0.5} />
  </>;
}}</Scene3D>;

// ---- 11:00 · RECTO DE LADO A LADO: dos tablas frente a frente; la de la izquierda ya cortada en diagonal, astillada; el serrucho baja sobre la de la derecha y la corta recta y limpia ----
export const HFenceBoard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark"
  cam={{ at: [0, 0.17, 0], az: [-0.32, 0.22], el: [0.2, 0.16], r: [0.85, 0.72], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="STRAIGHT ACROSS" col={GRN} />}>{(tt) => {
  const saw = cl((tt - 1.4) / 2.4), drop = eio(tt, 3.8, 4.4), shine = eio(tt, 4.4, 5.0) * (1 - eio(tt, 5.6, 6.4));
  const k1 = phys(tt, 0.1, 7, 0.5), k2 = phys(tt, 0.35, 7, 0.5);
  // tabla parada; el corte diagonal astillado se arma con una cuña que falta
  const jag = Array.from({ length: 9 }, (_, i) => [-0.055 + i * 0.0137, 0.26 + i * 0.012 + (i % 2 ? 0.012 : -0.006)]);
  return <>
    {/* izquierda: corte en diagonal, borde serrucho y astillas sueltas */}
    <group position={[-0.2, (1 - cl(k1)) * -0.3, 0]}>
      <RBox s={[0.11, 0.25, 0.022]} p={[0, 0.125, 0]} r={0.003}>{M.wood({ base: [214, 186, 140], rx: 1, ry: 1 })}</RBox>
      {jag.slice(0, -1).map(([x, y], i) => <mesh key={i} position={[x + 0.007, (y + 0.25) / 2, 0]}><boxGeometry args={[0.0138, y - 0.25, 0.022]} />{M.wood({ base: [214, 186, 140], rx: 1, ry: 1 })}</mesh>)}
      {[0, 1, 2, 3, 4].map((i) => <mesh key={"s" + i} position={[-0.05 + i * 0.03, 0.004, 0.05 + 0.015 * i]} rotation={[0, i, PI / 2]}><boxGeometry args={[0.006, 0.045, 0.005]} />{M.wood({ base: [214, 186, 140], rx: 1, ry: 1 })}</mesh>)}
    </group>
    {/* derecha: la tabla entera, el serrucho la corta de frente a fondo y el sobrante cae */}
    <group position={[0.2, (1 - cl(k2)) * -0.3, 0]}>
      <RBox s={[0.11, 0.27, 0.022]} p={[0, 0.135, 0]} r={0.003}>{M.wood({ base: [214, 186, 140], rx: 1, ry: 1 })}</RBox>
      <group position={[0, 0.3 - 0.02 * drop, 0.04 * drop]} rotation={[0.9 * drop, 0, 0.4 * drop]}>
        <RBox s={[0.11, 0.06, 0.022]} r={0.003}>{M.wood({ base: [214, 186, 140], rx: 1, ry: 1 })}</RBox>
      </group>
      {/* la línea de lápiz y el borde que brilla recto */}
      <mesh position={[0, 0.27, 0.012]}><boxGeometry args={[0.112, 0.0018, 0.001]} />{shine > 0 ? M.glow({ col: GRN, op: 0.4 + 0.6 * shine }) : <meshBasicMaterial color="#3a3a3a" />}</mesh>
      {/* el serrucho: hoja con dientes que va y viene mientras avanza */}
      {saw < 1 && <group position={[0.012 * Math.sin(tt * 26), 0.272 + 0.01 * (1 - cl(saw * 10)), 0.08 - 0.12 * saw]} rotation={[0, PI / 2, 0]} scale={1.7}>
        <mesh position={[0, 0.03, 0]}><boxGeometry args={[0.22, 0.06, 0.0015]} />{M.steel()}</mesh>
        {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[-0.105 + i * 0.01, 0.0, 0]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.005, 0.005, 0.0015]} />{M.steel()}</mesh>)}
        <RBox s={[0.06, 0.05, 0.018]} p={[0.13, 0.04, 0]} r={0.008}>{M.wood({ base: [150, 80, 40], rx: 1, ry: 1 })}</RBox>
      </group>}
      {/* aserrín */}
      {saw > 0 && saw < 1 && Array.from({ length: 12 }, (_, i) => { const f = ((tt * 2 + i / 12) % 1); return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.08, 0.27 - f * 0.27, 0.02 + rn(i, 3) * 0.04]}><boxGeometry args={[0.002, 0.002, 0.002]} /><meshStandardMaterial color="#e7cfa0" /></mesh>; })}
    </group>
  </>;
}}</Scene3D>;

// ---- 11:30 · NIEVE HASTA LA BARANDA: vista de arriba del porche; la nieve sube en capas hasta rozar la baranda mientras dos tambores cuentan 14 días; la pala abre un surco ----
const HSnowRail0: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood"
  cam={{ at: [-0.02, 0.13, 0.12], az: [0.5, -0.12], el: [0.5, 0.36], r: [1.25, 1.0], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="SNOW TO THE PORCH RAIL" col={ICE} />}>{(tt, u) => {
  const snow = eio(u, 0.05, 0.5), day = lerp(1, 14, snow), path = eio(u, 0.5, 0.62), melt = eio(u, 0.8, 0.96), crack = eio(u, 0.72, 0.8);
  const layers = 5, top = 0.265 * snow;
  return <>
    <RBox s={[0.9, 0.03, 0.5]} p={[0, 0.0, 0]} r={0.004}>{M.wood({ base: [150, 130, 110] })}</RBox>
    {[-0.4, -0.13, 0.13, 0.4].map((x, i) => <RBox key={i} s={[0.035, 0.32, 0.035]} p={[x, 0.16, 0.2]} r={0.004}>{M.wood({ base: [120, 86, 60] })}</RBox>)}
    <RBox s={[0.86, 0.025, 0.04]} p={[0, 0.3, 0.2]} r={0.004}>{M.wood({ base: [120, 86, 60] })}</RBox>
    {Array.from({ length: 16 }, (_, i) => <RBox key={i} s={[0.014, 0.25, 0.014]} p={[-0.4 + i * 0.053, 0.15, 0.2]} r={0.002}>{M.wood({ base: [140, 100, 70] })}</RBox>)}
    {/* la nieve en capas (cada día una), con borde blando; el surco de la pala queda abierto */}
    {Array.from({ length: layers }, (_, j) => { const lk = cl(snow * layers - j); const y = 0.015 + (j + 0.5) * (0.265 / layers);
      return <group key={j} visible={lk > 0}>
        {[-1, 1].map((sd) => <mesh key={sd} position={[sd * (0.25 + 0.03 * crack), y, -0.03]} rotation={[0, 0, -sd * 0.06 * crack * (j / layers)]} scale={[1 - 0.12 * melt, Math.max(0.02, lk * (1 - (j >= 2 ? 0.7 * melt : 0))), 1 - 0.1 * melt]}><boxGeometry args={[0.42, 0.265 / layers * 0.92, 0.38]} /><meshPhysicalMaterial color={j % 2 ? "#cfe4f7" : "#b9d6f0"} roughness={0.12} transmission={0.55} thickness={0.25} ior={1.31} clearcoat={1} clearcoatRoughness={0.05} emissive="#4a86c0" emissiveIntensity={0.12 + 0.25 * crack * (1 - melt)} bumpMap={tex.paper(3, 3)} bumpScale={4} /></mesh>)}
      </group>; })}
    {/* la grieta: una línea quebrada que corre a lo largo de la baranda cuando cae la sal, con brillo frío */}
    {Array.from({ length: 18 }, (_, i) => { const k = Math.max(0.001, cl(crack * 18 - i)); const x0 = -0.44 + i * 0.049, a = (rn(i, 51) - 0.5) * 1.2; return <group key={"gr" + i} visible={crack * 18 - i > 0}>
      <mesh position={[x0 + 0.0245 * Math.cos(a), top * (1 - 0.6 * melt) + 0.017, -0.03 + 0.03 * Math.sin(i * 1.7)]} rotation={[0, a, 0]}><boxGeometry args={[0.052 * k, 0.006, 0.006]} /><meshBasicMaterial color="#1c3550" /></mesh>
      <mesh position={[x0 + 0.0245 * Math.cos(a), top * (1 - 0.6 * melt) + 0.02, -0.03 + 0.03 * Math.sin(i * 1.7)]} rotation={[0, a, 0]}><boxGeometry args={[0.052 * k, 0.003, 0.016]} />{M.glow({ col: "#bfe4ff", op: 0.75 * (1 - melt) })}</mesh></group>; })}
    <pointLight position={[0, 0.45, -0.3]} intensity={1.1 * crack * (1 - melt)} distance={0.8} color="#9fd2ff" />
    {/* la pala: entra por el surco y empuja la nieve */}
    <group position={[0, 0.06 + top * (1 - path), 0.3 - 0.5 * path]} rotation={[-0.3, 0, 0]}>
      <mesh position={[0, 0.2, 0.08]} rotation={[0.6, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 0.36, 10]} />{M.wood({ base: [170, 120, 70] })}</mesh>
      <RBox s={[0.12, 0.1, 0.008]} r={0.004}>{M.steel({ col: "#9aa2a8" })}</RBox>
    </group>
    {/* un puñado de sal cae sobre el hielo del escalón y abre charcos oscuros que crecen */}
    {Array.from({ length: 50 }, (_, i) => { const f = cl((u - 0.68 - rn(i, 31) * 0.06) / 0.06); return <mesh key={"sl" + i} visible={f > 0} position={[-0.12 + rn(i, 32) * 0.24 + 0.1 * Math.sin(i), lerp(0.6, 0.27 * (1 - 0.6 * melt), f * f), -0.08 + rn(i, 33) * 0.16]} rotation={[i, i * 2, 0]}><boxGeometry args={[0.024, 0.02, 0.022]} /><meshPhysicalMaterial color={rn(i, 34) > 0.5 ? "#c9b89a" : "#b8a88c"} roughness={0.25} clearcoat={1} /></mesh>; })}
    {[0, 1, 2, 3].map((j) => { const g = melt; return <mesh key={"pd" + j} visible={g > 0} position={[-0.33 + j * 0.22, 0.0162, 0.228]} rotation={[-PI / 2, 0, 0]} scale={[1.5, 0.3, 1]}><circleGeometry args={[0.08 * g + 0.001, 32]} /><meshPhysicalMaterial color="#3b4a58" roughness={0.05} clearcoat={1} transparent opacity={0.85} /></mesh>; })}
    {/* los dos tambores del contador de días, en el poste izquierdo */}
    <RBox s={[0.2, 0.13, 0.06]} p={[-0.3, 0.1, 0.34]} r={0.012}>{M.wood({ base: [110, 74, 44] })}</RBox>
    <DigitDrum v={Math.floor(day / 10) + (Math.floor(day) % 10 === 9 ? day % 1 : 0)} p={[-0.342, 0.1, 0.375]} r={0.05} w={0.07} />
    <DigitDrum v={(day % 10)} p={[-0.258, 0.1, 0.375]} r={0.05} w={0.07} />
    {/* trozos de nieve helada que se desprenden y caen al piso cuando la sal la come */}
    {Array.from({ length: 9 }, (_, i) => { const f = cl((u - 0.78 - rn(i, 41) * 0.1) / 0.08), x = -0.36 + i * 0.09 + (rn(i, 42) - 0.5) * 0.04, zf = 0.36 + rn(i, 43) * 0.12;
      const y = f < 0.6 ? lerp(0.24, 0.035, (f / 0.6) * (f / 0.6)) : 0.035 + 0.025 * Math.sin(PI * (f - 0.6) / 0.4) * 0.5, z = lerp(0.12, zf, f), pd = cl((u - 0.8 - rn(i, 41) * 0.1) / 0.12);
      return <group key={"tz" + i} visible={f > 0}>
        <mesh position={[x, y, z]} rotation={[i * 0.7, i, f * 2.5]}><boxGeometry args={[0.07 + 0.03 * rn(i, 44), 0.05, 0.06]} /><meshPhysicalMaterial color="#cfe4f7" roughness={0.1} transmission={0.6} thickness={0.2} ior={1.31} clearcoat={1} emissive="#4a86c0" emissiveIntensity={0.15} /></mesh>
        {<mesh visible={pd > 0} position={[x, 0.0015, zf]} rotation={[-PI / 2, 0, i]} scale={[1.3, 1, 1]}><circleGeometry args={[0.06 * pd + 0.001, 28]} /><meshPhysicalMaterial color="#2c3a46" roughness={0.03} clearcoat={1} transparent opacity={0.8} /></mesh>}</group>; })}
    {/* copos */}
    {Array.from({ length: 60 }, (_, i) => <mesh key={i} position={[-0.6 + rn(i, 2) * 1.2, 0.7 - ((tt * (0.08 + 0.05 * rn(i, 3)) + rn(i, 4)) % 1) * 0.75, -0.2 + rn(i, 5) * 0.7]}><sphereGeometry args={[0.006 + 0.005 * rn(i, 6), 6, 4]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.9 * (1 - path * 0.7)} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 12:22 · DONDE NOS CAEMOS: el pie mojado entra a la bañera y patina (estela roja); la alfombra de goma se desenrolla debajo y el pie queda firme ----
export const HTubSafe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="tile"
  cam={{ at: [0.0, 0.1, 0], az: [0.3, 0.12], el: [0.95, 0.82], r: [0.95, 0.82], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="WHERE WE FALL" col={AMB} />}>{(tt) => {
  const step1 = eio(tt, 0.3, 1.0), slip = eio(tt, 1.0, 1.5), back = eio(tt, 1.8, 2.4), mat = eio(tt, 2.5, 3.6), step2 = eio(tt, 3.8, 4.5), grip = eio(tt, 4.5, 5.0);
  const tubG = lathe([[0, 0], [0.18, 0], [0.24, 0.12], [0.25, 0.26], [0.27, 0.27], [0.255, 0.28], [0.23, 0.14], [0.17, 0.016], [0, 0.016]], 64);
  const second = tt > 3.7;
  const fx = second ? 0.05 : -0.05 + 0.22 * slip, fy = second ? 0.11 + 0.25 * (1 - step2) : 0.1 + 0.25 * (1 - step1) + 0.3 * back, frot = second ? 0 : -0.35 * slip;
  return <>
    <group position={[0, 0.08, 0]} scale={[2.1, 1, 1]}><mesh geometry={tubG} castShadow receiveShadow>{M.porcelain({ side: THREE.DoubleSide })}</mesh></group>
    {[[-0.38, -0.12], [0.38, -0.12], [-0.38, 0.12], [0.38, 0.12]].map(([x, z], i) => <mesh key={i} position={[x, 0.045, z]}><sphereGeometry args={[0.03, 16, 12]} />{M.brass()}</mesh>)}
    <mesh position={[0, 0.098, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.62, 0.2]} />{M.water({ op: 0.35, col: "#cfe7f2" })}</mesh>
    {/* la alfombra de goma con ventosas se desenrolla */}
    <mesh position={[-0.3 + 0.3 * mat, 0.101, 0]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, mat), 1, 1]}><planeGeometry args={[0.6, 0.2]} /><meshStandardMaterial map={tex.text("tubmat", 256, 96, (g) => { g.fillStyle = "#9ed3c4"; g.fillRect(0, 0, 256, 96); g.fillStyle = "#7ab8a8"; for (let i = 0; i < 16; i++) for (let j = 0; j < 6; j++) { g.beginPath(); g.arc(8 + i * 16, 8 + j * 16, 4, 0, 7); g.fill(); } })} roughness={0.6} /></mesh>
    {mat > 0 && mat < 1 && <mesh position={[-0.3 + 0.6 * mat, 0.11, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.2, 16]} /><meshStandardMaterial color="#86c2b2" roughness={0.6} /></mesh>}
    {/* estela roja donde patina */}
    {!second && slip > 0 && <mesh position={[-0.05 + 0.11 * slip, 0.1, 0]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, slip), 1, 1]}><planeGeometry args={[0.22, 0.05]} />{M.glow({ col: RED, op: 0.5 * (1 - back) })}</mesh>}
    {/* el pie (talón y dedos) */}
    <group position={[fx, fy, 0]} rotation={[0, 0, frot]} scale={1.4}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.028, 0.1, 10, 20]} /><meshPhysicalMaterial color="#e8a98e" roughness={0.5} sheen={0.5} /></mesh>
      {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[0.085, 0.004, -0.024 + i * 0.012]} castShadow><sphereGeometry args={[0.0075 - (i > 0 ? 0.0015 : 0), 10, 8]} /><meshPhysicalMaterial color="#e8a98e" roughness={0.5} /></mesh>)}
      <mesh position={[-0.02, 0.06, 0]} castShadow><cylinderGeometry args={[0.026, 0.03, 0.1, 20]} /><meshPhysicalMaterial color="#e8a98e" roughness={0.5} /></mesh>
    </group>
    {/* el agarre: anillo verde donde apoya firme */}
    {grip > 0 && <mesh position={[0.05, 0.103, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.07 + 0.05 * grip, 0.078 + 0.05 * grip, 48]} />{M.glow({ col: GRN, op: 0.7 * (1 - grip * 0.6) })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 13:09 · ABRIR Y CERRAR DIEZ VECES: la esponja se aplasta y se suelta soltando burbujas; el contador de dos tambores cuenta cada apretón ----
export const HSponge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile"
  cam={{ at: [0.08, 0.12, 0.05], az: [-0.2, 0.12], el: [0.3, 0.34], r: [0.78, 0.68], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="OPEN · CLOSE · TEN TIMES" col={AMB} />}>{(tt) => {
  const ph = tt < 0.8 ? 0 : ((tt - 0.8) % 0.5) / 0.5, done = tt > 5.8, sq = done ? 0 : Math.sin(ph * PI);
  const n = Math.min(10, Math.max(0, (tt - 0.8) / 0.5 + 0.5));
  return <>
    <mesh geometry={lathe([[0, 0], [0.14, 0], [0.19, 0.08], [0.2, 0.085], [0.195, 0.09], [0.13, 0.006], [0, 0.006]])} castShadow receiveShadow>{M.porcelain({ side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.085, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.198, 0.005, 10, 64]} /><meshStandardMaterial color="#2f5fa8" roughness={0.3} /></mesh>
    <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.18, 0.15, 0.003, 48]} />{M.water({ op: 0.55, col: "#a9d6ee" })}</mesh>
    <group position={[0, 0.2, 0]} scale={[1 + 0.25 * sq, 1 - 0.55 * sq, 1 + 0.2 * sq]}>
      <RBox s={[0.17, 0.1, 0.09]} r={0.012}><meshStandardMaterial map={tex.text("sponge", 128, 128, (g) => { g.fillStyle = "#f2c94c"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(150,110,20,${0.35 * rn(i, 2)})`; g.beginPath(); g.arc(rn(i, 3) * 128, rn(i, 4) * 128, 1 + 3 * rn(i, 5), 0, 7); g.fill(); } })} roughness={0.95} /></RBox>
    </group>
    {Array.from({ length: 8 }, (_, i) => { const d = (ph * 1.4 + rn(i, 6) * 0.3) % 1; return !done && tt > 0.8 && <mesh key={i} position={[-0.05 + rn(i, 7) * 0.1, 0.16 - d * 0.1, -0.02 + rn(i, 8) * 0.04]}><sphereGeometry args={[0.005, 8, 6]} />{M.water({ op: 0.85 })}</mesh>; })}
    {/* burbujas que suben del agua en cada apretón */}
    {Array.from({ length: 14 }, (_, i) => { const f = ((tt * 0.8 + rn(i, 9)) % 1); return tt > 0.9 && <mesh key={"b" + i} position={[-0.1 + rn(i, 10) * 0.2 + 0.02 * Math.sin(tt * 3 + i), 0.065 + f * 0.25, -0.08 + rn(i, 11) * 0.16]} scale={0.5 + f}><sphereGeometry args={[0.014, 12, 8]} /><meshPhysicalMaterial color="#ffffff" roughness={0} transmission={0.9} thickness={0.01} iridescence={1} transparent opacity={0.5 * Math.sin(f * PI)} /></mesh>; })}
    {/* contador de dos tambores al costado */}
    <group position={[0.2, 0, 0.17]} scale={1.8}><RBox s={[0.1, 0.07, 0.05]} p={[0, 0.035, 0]} r={0.01}><meshStandardMaterial color="#2b2d31" metalness={0.5} roughness={0.4} /></RBox>
    <DigitDrum v={Math.floor(n / 10) + (Math.floor(n) === 9 ? n % 1 : 0)} p={[-0.02, 0.045, 0.03]} r={0.026} w={0.034} />
    <DigitDrum v={n % 10} p={[0.02, 0.045, 0.03]} r={0.026} w={0.034} /></group>
  </>;
}}</Scene3D>;

// ---- 14:04 · NI UNA GOTA DESPERDICIADA: la palangana se inclina y el agua cae en arco al pie del rosal; la tierra se oscurece y las rosas se abren ----
export const HBasinPour: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark"
  cam={{ at: [0.04, 0.15, 0], az: [-0.45, -0.2], el: [0.28, 0.32], r: [1.3, 1.15], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="NO WATER WASTED" col={GRN} />}>{(tt) => {
  const tilt = eio(tt, 0.6, 1.6), pour = cl((tt - 1.3) / 2.6), bloom = eio(tt, 2.4, 5.0);
  return <>
    <mesh position={[0.25, 0.0, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.35, 40]} /><meshStandardMaterial color="#4a3222" roughness={1} /></mesh>
    {/* tallos con hojas y rosas de pétalos en capas */}
    {Array.from({ length: 6 }, (_, i) => <mesh key={"t" + i} position={[0.2 + rn(i, 6) * 0.14, 0.09 + rn(i, 7) * 0.08, 0.0 + rn(i, 8) * 0.06]}><cylinderGeometry args={[0.004, 0.005, 0.18 + rn(i, 7) * 0.16, 6]} /><meshStandardMaterial color="#3a6a2a" /></mesh>)}
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[0.25 + (rn(i, 2) - 0.5) * 0.22, 0.06 + rn(i, 3) * 0.2, -0.05 + (rn(i, 4) - 0.5) * 0.14]} rotation={[rn(i, 5) * 3, rn(i, 6) * 3, 0]} scale={[1, 0.25, 0.6]}><sphereGeometry args={[0.04, 12, 8]} /><meshStandardMaterial color="#2f6b34" roughness={0.7} /></mesh>)}
    {Array.from({ length: 6 }, (_, i) => { const k = cl(bloom * 1.6 - i * 0.1), px = 0.2 + rn(i, 6) * 0.14, py = 0.17 + rn(i, 7) * 0.16, pz = 0.03 + rn(i, 8) * 0.06;
      return <group key={"r" + i} position={[px, py, pz]} scale={0.4 + 0.6 * k}>
        {[0, 1, 2, 3, 4].map((j) => <mesh key={j} rotation={[-0.4 - 0.5 * k, j * 1.256, 0]} position={[Math.cos(j * 1.256) * 0.008 * k, 0, Math.sin(j * 1.256) * 0.008 * k]} scale={[1, 1, 0.5]}><sphereGeometry args={[0.018, 12, 8, 0, PI]} /><meshPhysicalMaterial color="#e86f92" roughness={0.5} sheen={1} sheenColor="#ffd0dc" side={THREE.DoubleSide} /></mesh>)}
        <mesh><sphereGeometry args={[0.01, 10, 8]} /><meshPhysicalMaterial color="#c94a72" roughness={0.5} /></mesh>
      </group>; })}
    <group position={[-0.2, 0.22, 0]} rotation={[0, 0, -1.1 * tilt]}>
      <mesh geometry={lathe([[0, 0], [0.1, 0], [0.14, 0.05], [0.15, 0.055], [0.145, 0.06], [0.095, 0.006], [0, 0.006]])}>{M.porcelain({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.057, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.148, 0.004, 8, 48]} /><meshStandardMaterial color="#2f5fa8" roughness={0.3} /></mesh>
    </group>
    {pour > 0 && pour < 1 && <mesh geometry={tubeG("pourArc3", [[-0.08, 0.23, 0], [0.02, 0.21, 0], [0.12, 0.12, 0], [0.2, 0.02, 0]], (u) => 0.012 * (1 - u * 0.5))}>{M.water({ op: 0.6 * Math.sin(pour * PI), col: "#9fd0ea" })}</mesh>}
    {pour > 0.2 && <mesh position={[0.2, 0.004, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.05 + 0.12 * cl(pour), 32]} /><meshPhysicalMaterial color="#2a1a10" roughness={0.1} clearcoat={1} transparent opacity={0.85} /></mesh>}
  </>;
}}</Scene3D>;

// ---- 14:18 · TRES VECES EL PRECIO: el frasco violeta con moño y la bolsa simple frente a frente; de cada uno cuelga su etiqueta de papel que llega con peso y se balancea ----
const PriceTag: React.FC<{ txt: string; tt: number; a: number; col: string }> = ({ txt, tt, a, col }) => {
  const k = phys(tt, a, 6, 0.3), sw = Math.sin((tt - a) * 4) * 0.25 * Math.exp(-(tt - a) * 0.8) * (tt > a ? 1 : 0);
  return <group rotation={[0, 0, sw]} position={[0, 0.0 + (1 - cl(k)) * 0.15, 0]}>
    <mesh position={[0, -0.035, 0]}><cylinderGeometry args={[0.0008, 0.0008, 0.07, 4]} /><meshStandardMaterial color="#d8cba8" /></mesh>
    <mesh position={[0, -0.11, 0.001]}><planeGeometry args={[0.16, 0.08]} /><meshStandardMaterial map={tex.text("ptag" + txt, 256, 128, (g) => { g.fillStyle = "#f5ecd6"; g.fillRect(0, 0, 256, 128); g.fillStyle = col; g.font = "900 72px Georgia"; g.textAlign = "center"; g.fillText(txt, 128, 92); g.fillStyle = "#c8b48a"; g.beginPath(); g.arc(18, 64, 8, 0, 7); g.fill(); })} side={THREE.DoubleSide} roughness={0.9} /></mesh>
  </group>;
};
export const HVanilla: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0, -0.02, 0], az: [0.12, -0.12], el: [0.22, 0.28], r: [1.0, 0.9], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="3× THE PRICE · SAME SALT" col={AMB} />}>{(tt) => {
  const j1 = phys(tt, 0.3, 7, 0.45), j2 = phys(tt, 0.7, 7, 0.45), drops = [3.6, 4.2];
  return <>
    {/* izquierda: el frasco violeta perfumado con moño de cinta */}
    <group position={[-0.16, (1 - cl(j1)) * 0.3, 0]}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.05, 0.05, 0.14, 32]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.065, 0]}><cylinderGeometry args={[0.047, 0.047, 0.12, 32]} /><meshPhysicalMaterial color="#b28ad8" roughness={0.5} transparent opacity={0.9} /></mesh>
      <mesh position={[0, 0.145, 0]}><cylinderGeometry args={[0.053, 0.053, 0.014, 32]} />{M.plastic({ col: "#e9d6f4" })}</mesh>
      <mesh position={[0, 0.125, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.051, 0.004, 8, 40]} /><meshStandardMaterial color="#d14a8a" roughness={0.4} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.018, 0.125, 0.055]} rotation={[0, 0, sd * 0.6]} scale={[1.6, 0.9, 0.4]}><sphereGeometry args={[0.012, 12, 8]} /><meshStandardMaterial color="#d14a8a" roughness={0.4} /></mesh>)}
      <group position={[0.055, 0.2, 0.08]}><PriceTag txt="$4.50" tt={tt} a={1.6} col="#b8322a" /></group>
    </group>
    {/* derecha: la bolsa simple de siempre */}
    <group position={[0.16, (1 - cl(j2)) * 0.3, 0]}>
      <RBox s={[0.09, 0.14, 0.055]} p={[0, 0.07, 0]} r={0.006}><meshStandardMaterial map={tex.text("bagEpsomV", 256, 384, (g) => { g.fillStyle = "#efe7d6"; g.fillRect(0, 0, 256, 384); g.fillStyle = "#1f4f8a"; g.fillRect(0, 150, 256, 70); g.fillStyle = "#fff"; g.font = "900 38px Arial"; g.textAlign = "center"; g.fillText("EPSOM", 128, 182); g.font = "700 22px Arial"; g.fillText("SALT", 128, 210); })} roughness={0.85} /></RBox>
      <group position={[-0.045, 0.205, 0.07]}><PriceTag txt="$1.50" tt={tt} a={2.4} col="#2f7a2a" /></group>
    </group>
    {/* la botellita de vainilla: dos gotas en la bolsa simple y huele igual */}
    <group position={[0.33, 0.0, 0.05]} rotation={[0, 0, eio(tt, 3.2, 3.6) * 0.9 * (1 - eio(tt, 5.0, 5.4))]}>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.022, 0.024, 0.1, 24]} /><meshPhysicalMaterial color="#5a2e0c" roughness={0.1} clearcoat={1} transparent opacity={0.85} /></mesh>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.012, 0.012, 0.025, 16]} />{M.plastic({ col: "#1b1b1b" })}</mesh>
    </group>
    {drops.map((a, i) => { const k = cl((tt - a) / 0.5); return k > 0 && k < 1 && <mesh key={i} position={[0.23, 0.14 - k * 0.07, 0.03]}><sphereGeometry args={[0.007, 10, 8]} /><meshPhysicalMaterial color="#6b3a12" roughness={0.05} clearcoat={1} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 14:34 · NUNCA EN LA SARTÉN DE HIERRO: la sal cae en el charco, el óxido naranja crece como mancha viva; el trapo pasa, seca y deja el hierro negro con brillo de aceite ----
export const HSkillet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0.03, 0.03, 0], az: [0.4, 0.1], el: [0.85, 0.7], r: [0.75, 0.62], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="NEVER ON CAST IRON" col={RED} />}>{(tt) => {
  const pud = eio(tt, 0.3, 1.0), salt = cl((tt - 0.6) / 0.6), rust = eio(tt, 1.2, 3.6), wipe = eio(tt, 3.8, 5.4), oil = eio(tt, 5.2, 6.0);
  const rx = lerp(-0.2, 0.2, wipe), cover = (x: number) => x < rx ? 1 : 0;
  return <>
    <mesh geometry={lathe([[0, 0], [0.16, 0], [0.18, 0.04], [0.185, 0.042], [0.172, 0.04], [0.152, 0.008], [0, 0.008]])} castShadow receiveShadow><meshStandardMaterial color="#1c1c1e" metalness={0.6} roughness={0.55 - 0.35 * oil} side={THREE.DoubleSide} /></mesh>
    <RBox s={[0.2, 0.018, 0.04]} p={[0.27, 0.035, 0]} r={0.008}><meshStandardMaterial color="#1c1c1e" metalness={0.6} roughness={0.55} /></RBox>
    {/* la sal cae al charco */}
    {salt > 0 && salt < 1 && Array.from({ length: 16 }, (_, i) => <mesh key={"s" + i} position={[(rn(i, 2) - 0.5) * 0.03, 0.18 - ((tt * 1.5 + rn(i, 3)) % 1) * 0.17, (rn(i, 4) - 0.5) * 0.03]}><boxGeometry args={[0.005, 0.008, 0.005]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1} /></mesh>)}
    {pud > 0 && wipe < 0.5 && <mesh position={[0, 0.0095, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07 * pud, 40]} />{M.water({ op: 0.55 * (1 - rust * 0.7), col: "#cfe7f2" })}</mesh>}
    {/* el óxido: mancha naranja que crece desde el charco; el trapo la va borrando de izquierda a derecha */}
    {rust > 0 && Array.from({ length: 70 }, (_, i) => { const a = rn(i, 2) * PI * 2, d = (0.02 + 0.13 * rust) * Math.sqrt(rn(i, 3)), x = Math.cos(a) * d;
      return cover(x) < 1 && <mesh key={i} position={[x, 0.0102 + i * 0.00001, Math.sin(a) * d]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.012 + 0.016 * rn(i, 4), 10]} /><meshStandardMaterial map={tex.rust()} color={i % 3 ? "#c8662c" : "#8e3f17"} roughness={1} /></mesh>; })}
    {/* el trapo de cocina a cuadros azules */}
    {wipe > 0 && wipe < 1 && <group position={[rx, 0.022, 0.0]} rotation={[0, 0.3 * Math.sin(tt * 8), 0]}>
      <RBox s={[0.09, 0.025, 0.12]} r={0.012}><meshStandardMaterial map={tex.text("rag", 128, 128, (g) => { g.fillStyle = "#f4f4f0"; g.fillRect(0, 0, 128, 128); g.fillStyle = "rgba(47,95,168,.5)"; for (let i = 0; i < 8; i++) { g.fillRect(i * 16, 0, 6, 128); g.fillRect(0, i * 16, 128, 6); } })} roughness={0.95} /></RBox>
    </group>}
    {oil > 0 && <mesh position={[0, 0.0096, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.15, 48]} /><meshPhysicalMaterial color="#2a2a2c" roughness={0.05} clearcoat={1} transparent opacity={0.6 * oil} /></mesh>}
  </>;
}}</Scene3D>;
// el cuadro 20897 sale negro sólo en el farm (NaN del bloom, determinista): esos 3 cuadros se muestrean medio cuadro corridos
export const HSnowRail: React.FC<{ t: number; h: H }> = ({ t, h }) => <HSnowRail0 t={Math.abs(t * 30 - 20897) < 1.5 ? t + 0.5 / 30 : t} h={h} />;
