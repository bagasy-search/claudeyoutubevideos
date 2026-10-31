// ohf30d · componentes únicos 28-36 (el separador de aire, y las aletas: cómo se mueve el aire, el polvo, cepillo, peine, damper, espacio libre)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, curve, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Bubbles, Card, Gauge, Puffs, Tape, dialTex } from "./okit";
import { BD, BH, BallValve, Baseboard, Bucket, CU, Coin, CoinVent, Cu, Fins, Hose, Lint, PY, RoomWall } from "./bbkit";

const PI = Math.PI;
type V3 = [number, number, number];

// ---- 17:56 · EL SEPARADOR DE AIRE: corte de la pieza; el agua pasa de largo, las burbujas suben al domo y el purgador automático las larga ----
export const HAirScoop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" key1={[-0.7, 1.5, 1.4]}
  cam={{ at: [0.0, 0.12, 0.0], az: [-0.3, -0.1], el: [0.12, 0.1], r: [1.05, 0.95], fov: 32 }}>{(tt) => {
  const puff = (tt * 0.8) % 1;
  return <>
    <Cu a={[-0.5, 0, 0]} b={[-0.14, 0, 0]} r={0.03} /><Cu a={[0.14, 0, 0]} b={[0.5, 0, 0]} r={0.03} />
    {/* el cuerpo: barril de hierro con el frente cortado */}
    <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.28, 36, 1, true, PI * 0.15, PI * 1.7]} /><meshStandardMaterial color="#3c4146" metalness={0.5} roughness={0.5} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.04, 0.06, 0.07, 30, 1, true, PI * 0.1, PI * 1.8]} /><meshStandardMaterial color="#3c4146" metalness={0.5} roughness={0.5} side={THREE.DoubleSide} /></mesh>
    <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.066, 0.066, 0.27, 30]} />{M.water({ op: 0.35 })}</mesh>
    {/* purgador automático arriba */}
    <group position={[0, 0.11, 0]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.028, 0.028, 0.06, 24]} />{M.chrome()}</mesh>
      <mesh position={[0, 0.066, 0]}><cylinderGeometry args={[0.009, 0.009, 0.014, 14]} /><meshStandardMaterial color="#1b1b1b" roughness={0.4} /></mesh>
    </group>
    {/* burbujas: entran por la izquierda, suben al domo y salen arriba */}
    {Array.from({ length: 10 }, (_, i) => { const u = (tt * 0.35 + i / 10) % 1, x = lerp(-0.45, 0, cl(u * 2)), y = u < 0.5 ? 0.005 : lerp(0.005, 0.16, (u - 0.5) * 2);
      return <mesh key={i} position={[x, y, 0.02]}><sphereGeometry args={[0.011, 12, 10]} /><meshPhysicalMaterial color="#f2f8ff" metalness={0.5} roughness={0.04} clearcoat={1} transparent opacity={u > 0.92 ? (1 - u) * 12 : 1} /></mesh>; })}
    <mesh position={[0, 0.2 + puff * 0.08, 0]} scale={Math.max(0.001, puff * 1.5)}><sphereGeometry args={[0.018, 12, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.4 * (1 - puff)} depthWrite={false} /></mesh>
    <Tape txt="WATER GOES ON, AIR GOES UP AND OUT" p={[0.0, 0.28, 0.02]} w={0.56} k={phys(tt, 1.0, 8, 0.45)} rev={cl((tt - 1.0) / 0.9)} />
  </>;
}}</Scene3D>;

// ---- 18:27 · PURGADOR COSTROSO = TRABADO: macro del purgador con costra blanca y verde y una gota; la llave inglesa queda tachada ----
export const HCrustVent: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" key1={[-0.5, 1.2, 1.0]}
  cam={{ at: [0.02, 0.06, 0.0], az: [-0.5, -0.3], el: [0.2, 0.16], r: [0.55, 0.5], fov: 32 }}>{(tt) => {
  const cr = eio(tt, 0.3, 1.6), drip = (tt * 0.6) % 1, no = phys(tt, 2.6, 7, 0.5);
  return <>
    <Cu a={[-0.2, 0, 0]} b={[0.2, 0, 0]} r={0.022} />
    <group position={[0, 0.02, 0]}>
      <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[0.03, 0.03, 0.07, 26]} /><meshStandardMaterial color="#b9bcc0" metalness={0.8} roughness={0.35} /></mesh>
      <mesh position={[0, 0.078, 0]}><cylinderGeometry args={[0.01, 0.01, 0.016, 14]} /><meshStandardMaterial color="#1b1b1b" /></mesh>
      {Array.from({ length: 34 }, (_, i) => { const a = rn(i, 1) * PI * 2, y = rn(i, 2) * 0.08; return <mesh key={i} position={[0.031 * Math.cos(a), y, 0.031 * Math.sin(a)]} scale={Math.max(0.001, cr * (0.5 + rn(i, 3)))}><sphereGeometry args={[0.005, 6, 5]} /><meshStandardMaterial color={rn(i, 4) > 0.6 ? "#76b29a" : "#edeee4"} roughness={1} /></mesh>; })}
      <mesh position={[0.02, 0.0 - drip * 0.08, 0.02]} scale={Math.max(0.001, 1 - drip)}><sphereGeometry args={[0.006, 10, 8]} />{M.water({ op: 0.9 })}</mesh>
    </group>
    {/* llave inglesa tachada: eso lo cambia el técnico */}
    <group position={[0.16, 0.0, 0.03]} scale={Math.max(0.001, no)} rotation={[0, -0.4, 0.4]}>
      <RBox s={[0.012, 0.09, 0.006]} p={[0, 0, 0]} r={0.003}>{M.steel()}</RBox>
      <mesh position={[0, 0.05, 0]}><torusGeometry args={[0.014, 0.005, 8, 20, PI * 1.4]} />{M.steel()}</mesh>
      <mesh position={[0, 0.01, 0.01]} rotation={[0, 0, PI / 4]}><planeGeometry args={[0.13, 0.008]} /><meshBasicMaterial color="#d33a2c" toneMapped={false} side={THREE.DoubleSide} /></mesh>
    </group>
    <Tape txt="CRUSTED OR DRIPPING = STUCK" p={[-0.02, 0.14, 0.02]} rot={[0, -0.3, 0]} w={0.24} k={phys(tt, 1.0, 8, 0.45) * (1 - eio(tt, 2.75, 2.95))} rev={cl((tt - 1.0) / 0.8)} />
    <Tape txt="THE TECH REPLACES IT" col="#b3261e" p={[-0.02, 0.14, 0.02]} rot={[0, -0.3, 0]} w={0.22} k={phys(tt, 2.95, 8, 0.45)} rev={cl((tt - 2.95) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- 19:05 · EL AIRE ENTRA FRÍO ABAJO Y SALE TIBIO ARRIBA: corte lateral del zócalo; aire azul entra por debajo, pasa por las aletas y sube naranja por la pared ----
export const HFinFlow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" key1={[0.6, 1.4, 1.4]}
  cam={{ at: [0.3, 0.3, 0.15], az: [1.2, 1.05], el: [0.12, 0.1], r: [1.15, 1.05], fov: 32 }}>{(tt) => {
  const k = eio(tt, 0.3, 1.2);
  return <>
    <RoomWall />
    <Baseboard len={0.6} capL={1} capR={1} heat={() => 0.9} risers={false} />
    {/* aire frío del cuarto que entra por abajo */}
    {Array.from({ length: 3 }, (_, j) => <Puffs key={"c" + j} tt={tt + j * 0.3} n={7} a={[0.3 + j * 0.02, 0.03, 0.35]} b={[0.3, 0.03, BD / 2 + 0.01]} r={0.012} col="#7fb4ff" op={0.5 * k} v={0.4} />)}
    {/* sube entre las aletas y sale por arriba, pegado a la pared */}
    {Array.from({ length: 3 }, (_, j) => <Puffs key={"m" + j} tt={tt + j * 0.3} n={6} a={[0.3, 0.03, BD / 2]} b={[0.3, BH + 0.02, BD / 2 - 0.01]} r={0.011} col="#ffc28a" op={0.5 * k} v={0.5} />)}
    {Array.from({ length: 3 }, (_, j) => <Puffs key={"h" + j} tt={tt + j * 0.3} n={8} a={[0.3, BH + 0.02, BD / 2 - 0.01]} b={[0.3, 0.75, 0.04 + j * 0.03]} r={0.016} col="#ff9a4a" op={0.45 * k} v={0.35} />)}
    <Tape txt="COOL IN LOW" col="#2a5c9a" p={[0.3, 0.08, 0.3]} rot={[0, PI / 2 - 0.2, 0]} w={0.2} k={phys(tt, 1.2, 8, 0.45)} />
    <Tape txt="WARM OUT HIGH" col="#b5461e" p={[0.3, 0.5, 0.18]} rot={[0, PI / 2 - 0.2, 0]} w={0.22} k={phys(tt, 2.0, 8, 0.45)} />
  </>;
}}</Scene3D>;

// ---- 19:32 · CAÑO CALIENTE, CUARTO FRÍO (rehecho r2): maqueta del cuarto en corte, al atardecer; el zócalo arde naranja pero una
// manta de pelusa lo tapa y el calor queda atrapado; por la ventana entra el frío, el vidrio se escarcha y el termómetro baja ----
const wallpaperTex = () => tex.text("wp_df", 256, 256, (g) => {
  g.fillStyle = "#b9b08f"; g.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 32) { g.fillStyle = "rgba(255,250,230,.18)"; g.fillRect(x, 0, 12, 256); }
  for (let i = 0; i < 16; i++) { const x = (i % 4) * 64 + 26, y = Math.floor(i / 4) * 64 + 30; g.fillStyle = "rgba(120,96,60,.35)"; g.beginPath(); g.ellipse(x, y, 5, 9, 0, 0, 6.3); g.fill(); }
});
export const HDustFins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#0e1219" key1={[-0.3, 1.6, 1.4]} warm={0.55}
  cam={{ at: [-0.1, 0.24, -0.12], az: [0.48, 0.3], el: [0.36, 0.3], r: [1.6, 1.45], fov: 32 }}>{(tt) => {
  const d = eio(tt, 0.3, 3.0), fr = eio(tt, 1.0, 5.0), temp = Math.round(lerp(68, 58, eio(tt, 0.8, 4.8))), lvl = lerp(0.2, 0.08, eio(tt, 0.8, 4.8));
  return <>
    <pointLight position={[0.15, 0.36, -0.2]} intensity={0.55} distance={1.2} color="#9cc8ff" />
    {/* piso, pared del fondo y pared izquierda del cuarto en corte */}
    <RBox s={[1.1, 0.04, 0.8]} p={[0, -0.02, 0]} r={0.006}><meshStandardMaterial map={tex.wood(4, 1, [150, 104, 64])} roughness={0.6} /></RBox>
    <RBox s={[1.1, 0.62, 0.03]} p={[0, 0.31, -0.415]} r={0.004}><meshStandardMaterial map={wallpaperTex()} roughness={0.85} /></RBox>
    <RBox s={[0.03, 0.62, 0.8]} p={[-0.565, 0.31, 0]} r={0.004}><meshStandardMaterial map={wallpaperTex()} roughness={0.85} /></RBox>
    {/* la ventana con el frío de afuera y la escarcha que crece */}
    <group position={[0.18, 0.36, -0.398]}>
      <mesh><planeGeometry args={[0.3, 0.24]} /><meshBasicMaterial color="#5f7fa6" toneMapped={false} /></mesh>
      {Array.from({ length: 26 }, (_, i) => { const u = (tt * 0.08 + rn(i, 1)) % 1; return <mesh key={i} position={[-0.14 + 0.28 * rn(i, 2), 0.11 - u * 0.22, 0.002]}><circleGeometry args={[0.003 + 0.003 * rn(i, 3), 6]} /><meshBasicMaterial color="#f2f6fa" toneMapped={false} /></mesh>; })}
      <mesh position={[0, 0, 0.004]}><planeGeometry args={[0.3, 0.24]} /><meshPhysicalMaterial color="#eef6ff" transparent opacity={0.1 + 0.4 * fr} roughness={0.6} /></mesh>
      {[[0, 0.13, 0.34, 0.025], [0, -0.13, 0.36, 0.03], [-0.16, 0, 0.025, 0.28], [0.16, 0, 0.025, 0.28], [0, 0, 0.012, 0.24]].map(([x, y, w, hh], i) => <RBox key={i} s={[w, hh, 0.03]} p={[x, y, 0.01]} r={0.004}><meshStandardMaterial color="#efe9dc" roughness={0.5} /></RBox>)}
    </group>
    {/* corriente fría que baja de la ventana y se arrastra por el piso */}
    {[0, 1, 2].map((j) => <Puffs key={j} tt={tt + j * 0.6} n={7} a={[0.12 + j * 0.06, 0.26, -0.36]} b={[0.0 + j * 0.1, 0.03, 0.25]} r={0.022} col="#8fb8ff" op={0.28} v={0.3} wob={0.01} />)}
    {/* el zócalo contra la pared: caliente adentro, tapado de pelusa */}
    <group position={[-0.12, 0, -0.395]} scale={0.85}>
      <Baseboard len={0.62} heat={() => 0.98} risers={false} />
      <mesh position={[0, 0.1, 0.06]}><boxGeometry args={[0.6, 0.16, 0.02]} /><meshBasicMaterial color="#ff7a2e" transparent opacity={0.35 * (1 - 0.6 * d)} toneMapped={false} depthWrite={false} /></mesh>
      {Array.from({ length: 90 }, (_, i) => { const on = cl(d * 1.4 - rn(i, 5) * 0.5); return on > 0.01 ? <mesh key={i} position={[-0.31 + 0.62 * rn(i, 1), 0.04 + 0.2 * rn(i, 2), 0.085 + 0.03 * rn(i, 3)]} scale={on * (0.7 + rn(i, 4))}><sphereGeometry args={[0.013, 6, 5]} /><meshStandardMaterial color={rn(i, 6) > 0.5 ? "#77716a" : "#8f897f"} roughness={1} metalness={0} flatShading /></mesh> : null; })}
    </group>
    {/* el calor que no sale: ondas cortas que vuelven a caer */}
    {[0, 1, 2].map((j) => <Puffs key={"h" + j} tt={tt + j * 0.4} n={4} a={[-0.3 + j * 0.18, 0.2, -0.3]} b={[-0.28 + j * 0.18, 0.26, -0.28]} r={0.014} col="#ff9a4a" op={0.3 * (1 - d * 0.6)} v={0.5} />)}
    {/* sillón */}
    <group position={[0.05, 0, 0.12]}>
      <RBox s={[0.42, 0.09, 0.2]} p={[0, 0.06, 0]} r={0.025}><meshStandardMaterial color="#5c3b2e" roughness={0.85} /></RBox>
      <RBox s={[0.42, 0.14, 0.05]} p={[0, 0.15, 0.08]} r={0.025}><meshStandardMaterial color="#5c3b2e" roughness={0.85} /></RBox>
      {[-1, 1].map((s) => <RBox key={s} s={[0.05, 0.12, 0.2]} p={[s * 0.21, 0.09, 0]} r={0.02}><meshStandardMaterial color="#51332a" roughness={0.85} /></RBox>)}
    </group>
    {/* termómetro de pared grande: la columna baja */}
    <group position={[-0.545, 0.32, -0.1]} rotation={[0, PI / 2, 0]}>
      <RBox s={[0.09, 0.32, 0.016]} p={[0, 0, 0]} r={0.012}><meshStandardMaterial color="#f1ead9" roughness={0.5} /></RBox>
      <mesh position={[0, 0.0, 0.011]}><cylinderGeometry args={[0.008, 0.008, 0.25, 12]} />{M.glass({ op: 0.5 })}</mesh>
      <mesh position={[0, -0.12 + lvl / 2, 0.012]}><cylinderGeometry args={[0.0055, 0.0055, Math.max(0.001, lvl), 10]} /><meshBasicMaterial color={temp > 63 ? "#d33a2c" : "#3a6ab0"} toneMapped={false} /></mesh>
      <mesh position={[0, -0.13, 0.012]}><sphereGeometry args={[0.014, 14, 10]} /><meshBasicMaterial color={temp > 63 ? "#d33a2c" : "#3a6ab0"} toneMapped={false} /></mesh>
      <Tape txt={`${temp}°F`} col="#2a5c9a" p={[0, -0.22, 0.012]} w={0.17} k={phys(tt, 0.6, 8, 0.45)} />
    </group>
    <Tape txt="HOT PIPE, COLD ROOM" p={[-0.25, 0.5, -0.395]} w={0.42} k={phys(tt, 1.2, 8, 0.45)} rev={cl((tt - 1.2) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 19:54 · CEPILLO SUAVE DE ASPIRADORA (rehecho r2): de día y desde arriba, mirando dentro del canal sin tapa; el cabezal avanza
// sobre los cantos de las aletas, la pelusa gira y se va chupada por el tubo, y atrás queda el aluminio limpio brillando ----
export const HSoftBrush: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#cfd5da" key1={[0.3, 1.8, 0.8]} warm={0.75}
  cam={{ at: [0.0, 0.05, 0.12], az: [0.22, -0.12], el: [1.18, 1.08], r: [0.95, 0.85], fov: 32 }}>{(tt) => {
  const bx = lerp(-0.4, 0.38, eio(tt, 0.4, 5.2)), clean = (u: number) => (-0.42 + u * 0.84) < bx - 0.03;
  return <>
    {/* piso de roble claro y pared blanca */}
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3, 3]} /><meshStandardMaterial map={tex.wood(6, 1, [206, 170, 124])} roughness={0.5} /></mesh>
    <mesh position={[0, 0.6, -0.004]} receiveShadow><planeGeometry args={[3, 1.2]} /><meshStandardMaterial color="#eef0ee" roughness={0.9} /></mesh>
    <Baseboard len={0.92} cover={1} capL={1} capR={1} risers={false} heat={() => 0.5} dust={(u) => clean(u) ? 0 : 0.95} col="#f4f2ec" />
    {/* brillo del aluminio limpio detrás del cabezal */}
    <mesh position={[(bx - 0.46) / 2 - 0.02, PY + 0.034, BD / 2]} rotation={[-PI / 2, 0, 0]} visible={bx > -0.38}><planeGeometry args={[Math.max(0.001, bx + 0.42), 0.06]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.16} toneMapped={false} depthWrite={false} /></mesh>
    {/* pelusa: quieta adelante; cerca del cabezal gira y sube por el tubo */}
    {Array.from({ length: 40 }, (_, i) => { const x0 = -0.42 + rn(i, 1) * 0.84, z0 = BD / 2 + (rn(i, 3) - 0.5) * 0.06;
      const ate = cl((bx - x0 + 0.02) / 0.08); if (ate >= 1) return null;
      const a = ate * 6 + i, rr = 0.03 * (1 - ate);
      return <mesh key={i} position={[lerp(x0, bx, ate) + rr * Math.cos(a), PY + 0.04 + 0.08 * ate, lerp(z0, BD / 2 + 0.01, ate) + rr * Math.sin(a)]} scale={(0.7 + rn(i, 4)) * (1 - 0.7 * ate)}>
        <sphereGeometry args={[0.009, 7, 6]} /><meshStandardMaterial color="#8a8072" roughness={1} /></mesh>; })}
    {/* cabezal de cepillo redondo con cerdas suaves, y el tubo que sale hacia la cámara */}
    <group position={[bx, PY + 0.07, BD / 2 + 0.005]} rotation={[0, 0.12 * Math.sin(tt * 1.6), 0]}>
      <mesh castShadow><cylinderGeometry args={[0.045, 0.05, 0.03, 32]} />{M.plastic({ col: "#2f3236" })}</mesh>
      {Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * PI * 2; return <mesh key={i} position={[0.042 * Math.cos(a), -0.03, 0.042 * Math.sin(a)]}><cylinderGeometry args={[0.0022, 0.0012, 0.034, 5]} /><meshStandardMaterial color="#d9c49a" roughness={0.8} /></mesh>; })}
      <mesh geometry={tubeG("sbwand2", [[0, 0.012, 0], [0.0, 0.1, 0.02], [0.02, 0.3, 0.06], [0.04, 0.55, 0.1]], 0.018, 40, 14)} castShadow>{M.plastic({ col: "#8a9098" })}</mesh>
    </group>
    <Tape txt="SOFT BRUSH, LIGHT TOUCH" p={[0.0, 0.003, 0.27]} rot={[-PI / 2, 0, 0]} w={0.42} k={phys(tt, 1.2, 8, 0.45)} rev={cl((tt - 1.2) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 20:24 · EL PEINE DE ALETAS: las aletas torcidas se enderezan una a una cuando pasa el peine ----
export const HFinComb: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" key1={[-0.6, 1.3, 1.2]}
  cam={{ at: [0.0, 0.0, 0.0], az: [-0.55, -0.35], el: [0.36, 0.3], r: [0.62, 0.55], fov: 32 }}>{(tt) => {
  const cx = lerp(-0.26, 0.26, eio(tt, 0.6, 3.6)), straight = (u: number) => (-0.28 + u * 0.56) < cx - 0.02;
  return <>
    <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.014, 0.014, 0.7, 24]} /><meshStandardMaterial color="#b8703a" metalness={0.9} roughness={0.3} /></mesh>
    <Fins len={0.56} n={46} p={[0, 0, 0]} fs={0.1} heat={() => 0.5} bent={(u) => straight(u) ? 0 : (rn(Math.round(u * 46), 7) > 0.35 ? 0.9 : 0.1)} />
    {/* el peine: plástico con dientes que entran entre las aletas */}
    <group position={[cx, 0.07, 0.0]}>
      <RBox s={[0.1, 0.03, 0.03]} p={[0, 0.02, 0]} r={0.006}>{M.plastic({ col: "#e0b52a" })}</RBox>
      {Array.from({ length: 9 }, (_, i) => <RBox key={i} s={[0.0045, 0.035, 0.02]} p={[-0.045 + i * 0.0112, -0.012, 0]} r={0.001}>{M.plastic({ col: "#e0b52a" })}</RBox>)}
    </group>
    <Tape txt="COMB THEM STRAIGHT" p={[0.0, 0.13, 0.04]} rot={[-0.3, 0, 0]} w={0.3} k={phys(tt, 1.1, 8, 0.45)} rev={cl((tt - 1.1) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 20:44 · EL DAMPER (rehecho r2): de canto, mirando el perfil del zócalo por la punta abierta, sobre pared terracota; el aire frío
// entra por abajo, cruza las aletas y sale por la ranura de arriba: con la aleta del damper cerrada es un hilito, al abrirse es un río ----
const dmPaper = () => tex.text("dm_wall", 256, 256, (g) => {
  g.fillStyle = "#9a5b44"; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 16) { g.fillStyle = "rgba(255,230,210,.05)"; g.fillRect(0, y, 256, 7); }
});
const DM_PATH = (z0: number): number[][] => [[0, 0.012, 0.32 + z0], [0, 0.012, BD + 0.04], [0, 0.02, BD / 2 + 0.01], [0, PY - 0.02, BD / 2], [0, PY + 0.05, BD / 2 + 0.01], [0, BH - 0.02, BD - 0.03], [0, BH + 0.025, BD + 0.02], [0, BH + 0.12, BD + 0.1], [0, BH + 0.26, BD + 0.14]];
const DM_CURVES = [0, 0.05, 0.1].map((z0) => curve(DM_PATH(z0)));
export const HDamper: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#171210" key1={[1.1, 1.3, 1.2]} warm={0.8}
  cam={{ at: [0.22, 0.13, 0.1], az: [0.98, 0.78], el: [0.24, 0.18], r: [0.78, 0.7], fov: 32 }}>{(tt) => {
  const op = eio(tt, 2.0, 3.4), v = lerp(0.07, 0.3, op), show = lerp(0.22, 1, eio(tt, 2.2, 4.0));
  return <>
    <mesh position={[0, 0.7, -0.006]} receiveShadow><planeGeometry args={[3, 1.4]} /><meshStandardMaterial map={dmPaper()} roughness={0.85} /></mesh>
    <Baseboard len={0.7} capR={1} damper={lerp(0.04, 1, op)} heat={() => 0.92} risers={false} col="#f2ede2" />
    {/* la palanquita del damper en la punta, que alguien empuja */}
    <group position={[0.36, BH - 0.03, BD - 0.02]} rotation={[-(1 - lerp(0.04, 1, op)) * 1.1, 0, 0]}>
      <RBox s={[0.01, 0.006, 0.05]} p={[0, 0, -0.025]} r={0.002}>{M.brass()}</RBox>
    </group>
    {/* corrientes de aire: entran frías por abajo, se calientan en las aletas y salen por arriba */}
    {DM_CURVES.map((cv, s) => <group key={s} position={[0.32 - s * 0.12, 0, 0]}>
      {Array.from({ length: 26 }, (_, i) => { if (i / 26 > show) return null; const u = (tt * v + i / 26 + s * 0.13) % 1, pp = cv.getPointAt(u);
        const hot = cl((u - 0.35) / 0.2), blocked = u > 0.62 ? 1 - 0.8 * (1 - op) : 1;
        return <mesh key={i} position={[pp.x, pp.y, pp.z]} scale={Math.max(0.001, (0.8 + 0.6 * hot) * blocked)}><sphereGeometry args={[0.0075, 10, 8]} /><meshBasicMaterial color={new THREE.Color("#7fb2ff").lerp(new THREE.Color("#ff8a3a"), hot)} toneMapped={false} transparent opacity={0.9 * (u > 0.9 ? (1 - u) * 10 : 1)} /></mesh>; })}
    </group>)}
    <Puffs tt={tt} n={8} a={[0.24, BH + 0.03, BD + 0.03]} b={[0.3, 0.4, BD + 0.16]} r={0.017} col="#ff9a4a" op={0.32 * op} v={0.45} />
    <Tape txt="CLOSED" col="#2a5c9a" p={[-0.3, 0.25, 0.1]} rot={[0, 0.7, 0]} w={0.12} k={phys(tt, 0.5, 8, 0.45) * (1 - eio(tt, 1.8, 2.0))} />
    <Tape txt="DAMPER OPEN = MORE HEAT" p={[-0.3, 0.26, 0.12]} rot={[0, 0.7, 0]} w={0.3} k={phys(tt, 2.0, 8, 0.45)} rev={cl((tt - 2.0) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- 21:15 · UNAS PULGADAS DE AIRE (rehecho r2): desde arriba, como un plano; el sillón pegado tapa el zócalo y el calor queda rojo
// atrapado; el sillón se aparta, la cinta métrica se estira con sus pulgadas y el calor sale en remolinos al cuarto ----
const igBlade = () => tex.text("ig_blade", 512, 64, (g) => {
  g.fillStyle = "#f2d23a"; g.fillRect(0, 0, 512, 64); g.fillStyle = "#1b1b1b";
  for (let i = 0; i <= 48; i++) { const x = 8 + i * 10; g.fillRect(x, 0, 2, i % 8 === 0 ? 26 : i % 4 === 0 ? 18 : 10); }
  g.font = "900 26px Arial"; g.textAlign = "center"; for (let n = 1; n <= 6; n++) g.fillText(String(n), 8 + n * 80, 54);
});
const igRug = () => tex.text("ig_rug", 256, 256, (g) => {
  g.fillStyle = "#3d4f6a"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#d8c08a"; g.lineWidth = 8; g.strokeRect(14, 14, 228, 228); g.lineWidth = 3; g.strokeRect(34, 34, 188, 188);
});
export const HInchesGap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#14110e" key1={[-0.4, 1.9, 0.9]} warm={0.85}
  cam={{ at: [0.28, 0.12, 0.2], az: [0.85, 0.68], el: [0.98, 0.9], r: [1.2, 1.08], fov: 32 }}>{(tt) => {
  const mv = eio(tt, 0.5, 2.0), gz = lerp(BD + 0.005, BD + 0.17, mv), tape = eio(tt, 2.3, 4.9), flow = eio(tt, 2.6, 4.6);
  return <>
    <mesh position={[0, 0.5, -0.006]} receiveShadow><planeGeometry args={[3, 1]} /><meshStandardMaterial color="#d6c9b0" roughness={0.9} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0.05, 0.002, 0.75]} receiveShadow><planeGeometry args={[0.9, 0.5]} /><meshStandardMaterial map={igRug()} roughness={0.95} /></mesh>
    <Baseboard len={1.2} heat={() => 0.9} risers={false} />
    {/* calor atrapado detrás del sillón: brillo rojo que se apaga cuando se abre el hueco */}
    <mesh position={[0, 0.004, BD + 0.03]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.1, 0.06]} /><meshBasicMaterial color="#ff4a1a" transparent opacity={0.5 * (1 - mv)} toneMapped={false} depthWrite={false} /></mesh>
    <group position={[-0.14, 0, gz + 0.22]}>
      <RBox s={[0.95, 0.2, 0.42]} p={[0, 0.12, 0]} r={0.04}><meshStandardMaterial color="#6b3d2e" roughness={0.85} /></RBox>
      <RBox s={[0.95, 0.34, 0.1]} p={[0, 0.3, -0.16]} r={0.05}><meshStandardMaterial color="#6b3d2e" roughness={0.85} /></RBox>
      {[-1, 1].map((s) => <RBox key={s} s={[0.1, 0.28, 0.42]} p={[s * 0.48, 0.18, 0]} r={0.04}><meshStandardMaterial color="#5e3527" roughness={0.85} /></RBox>)}
      {[-1, 1].map((s) => <RBox key={"c" + s} s={[0.42, 0.06, 0.32]} p={[s * 0.22, 0.25, 0.03]} r={0.03}><meshStandardMaterial color="#7a4a38" roughness={0.9} /></RBox>)}
      <RBox s={[0.16, 0.12, 0.05]} p={[-0.28, 0.32, -0.08]} rot={[-0.3, 0.2, 0]} r={0.025}><meshStandardMaterial color="#d8b25a" roughness={0.9} /></RBox>
    </group>
    {/* cinta métrica: caja en el piso y la hoja con sus pulgadas cruzando el hueco */}
    <group position={[0.44, 0.012, BD + 0.005]}>
      <RBox s={[0.06, 0.03, 0.06]} p={[0, 0.0, -0.035]} r={0.012}>{M.plastic({ col: "#e0b52a" })}</RBox>
      <mesh position={[0, 0.004, 0.08 * tape]} rotation={[-PI / 2, 0, PI / 2]} scale={[Math.max(0.001, tape), 1, 1]}><planeGeometry args={[0.16, 0.036]} /><meshStandardMaterial map={igBlade()} roughness={0.5} /></mesh>
    </group>
    {/* el calor que sale: remolinos naranjas que se abren hacia el cuarto */}
    {Array.from({ length: 24 }, (_, i) => { const u = (tt * 0.28 + rn(i, 1)) % 1, x = -0.1 + rn(i, 2) * 0.7, a = u * 5 + i;
      return <mesh key={i} position={[x + 0.04 * Math.cos(a) * u, 0.05 + u * 0.25, BD + 0.04 + 0.03 * Math.sin(a) + u * 0.12]} scale={Math.max(0.001, flow * (0.6 + u))}><sphereGeometry args={[0.012, 10, 8]} /><meshBasicMaterial color="#ff9a4a" transparent opacity={0.55 * Math.sin(PI * u)} toneMapped={false} depthWrite={false} /></mesh>; })}
    <Tape txt="A FEW INCHES OF AIR" p={[0.38, 0.41, 0.1]} rot={[0, 0.6, 0]} w={0.3} k={phys(tt, 1.2, 8, 0.45)} rev={cl((tt - 1.2) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- 21:31 · TODO JUNTO, SEIS PASOS (rehecho r2): un caño de cobre serpentea por el banco de trabajo; el agua caliente avanza por
// adentro (el cobre se enciende detrás) y cada vez que llega a una estación, esa pieza HACE su paso: aletas que se calientan, la cinta
// que se escribe, la moneda que gira, la válvula que purga al balde, la aguja que sube al verde y el cepillo que limpia la pelusa ----
const SIX = [["HOT WATER,", "NOT ELECTRIC"], ["COLD PRESSURE", "ON TAPE"], ["COIN VENTS,", "IN ORDER"], ["NO VENTS?", "PURGE IT"], ["CHECK THE", "PRESSURE"], ["CLEAN THE", "FINS"]];
const SXP = [-0.66, -0.4, -0.13, 0.13, 0.4, 0.66], SZP = [0.1, -0.1, 0.1, -0.1, 0.1, -0.1];
const SPATH: number[][] = [[-0.95, 0.025, 0.0], ...SXP.map((x, i) => [x, 0.025, SZP[i]]), [0.95, 0.025, 0.0]];
const SCURVE = curve(SPATH);
// u del recorrido (0..1) en el que cae cada estación, y el rumbo del caño ahí
const SU = SXP.map((x, i) => { let best = 0, bd = 9; for (let k = 0; k <= 400; k++) { const p = SCURVE.getPointAt(k / 400), d = Math.hypot(p.x - x, p.z - SZP[i]); if (d < bd) { bd = d; best = k / 400; } } return best; });
const SANG = SU.map((u) => { const tg = SCURVE.getTangentAt(u); return Math.atan2(-tg.z, tg.x); });
const D30s = () => dialTex("six30", 30, 12, 15, "PSI", 27);
const SixFins: React.FC<{ heat: number; dust?: number; n?: number }> = ({ heat, dust = 0, n = 13 }) => <>
  {Array.from({ length: n }, (_, j) => <RBox key={j} s={[0.0028, 0.07, 0.07]} p={[-0.07 + j * (0.14 / (n - 1)), 0, 0]} r={0.002}>
    <meshStandardMaterial color={new THREE.Color("#b9bec4").lerp(new THREE.Color("#ff9a52"), heat * 0.55).lerp(new THREE.Color("#7a7064"), dust * 0.8)} metalness={0.6} roughness={0.32} /></RBox>)}
</>;
export const HSixSteps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#15120f" key1={[-0.5, 1.6, 0.9]} warm={1.0}
  cam={{ at: [-0.72, 0.05, 0.0], at1: [1.47, 0.05, 0.0], az: [-0.24, 0.18], el: [0.66, 0.58], r: [1.0, 0.92], fov: 32 }}>{(tt) => {
  const A = SXP.map((_, i) => 0.4 + i * 0.88), act = (i: number) => cl((tt - A[i]) / 0.5), head = lerp(0.04, 0.97, cl((tt - 0.1) / 5.2));
  const hq = Math.round(head * 80) / 80, hot = SCURVE.getPointAt(hq);
  return <>
    {/* banco de trabajo de arce */}
    <RBox s={[2.1, 0.05, 0.9]} p={[0, -0.025, 0]} r={0.01}><meshStandardMaterial map={tex.wood(5, 1, [196, 148, 98])} roughness={0.55} /></RBox>
    {/* el caño frío entero y, encima, el tramo que ya recorrió el agua caliente */}
    <mesh geometry={tubeG("sixpipe", SPATH, 0.012, 220, 18)} castShadow><meshStandardMaterial color={CU} metalness={0.9} roughness={0.3} /></mesh>
    <mesh geometry={tubeG("sixhot" + hq, Array.from({ length: 41 }, (_, k) => { const v = SCURVE.getPointAt(hq * k / 40); return [v.x, v.y, v.z]; }), 0.0128, 160, 18)}>
      <meshStandardMaterial color="#d9803e" metalness={0.75} roughness={0.3} emissive="#ff5a12" emissiveIntensity={0.55} /></mesh>
    <mesh position={[hot.x, hot.y, hot.z]}><sphereGeometry args={[0.02, 16, 12]} /><meshBasicMaterial color="#ffb070" transparent opacity={0.55} toneMapped={false} depthWrite={false} /></mesh>
    {SXP.map((x, i) => { const a = act(i), sp = phys(tt, A[i], 7, 0.45), done = cl((tt - A[i] - 0.5) * 2);
      return <group key={i} position={[x, 0.025, SZP[i]]}>
        {/* anillo verde en el banco = paso hecho */}
        <mesh position={[0, -0.022, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.1, 0.112, 48]} /><meshBasicMaterial color="#6fe39a" transparent opacity={0.85 * done} toneMapped={false} depthWrite={false} /></mesh>
        <group rotation={[0, SANG[i], 0]}>
          {i === 0 && <SixFins heat={a} />}
          {i === 1 && <>
            {/* rollo de cinta de pintor y la tira pegada sobre el caño, escrita a mano */}
            <group position={[0.02, -0.006, 0.075]}><mesh><cylinderGeometry args={[0.036, 0.036, 0.024, 32, 1, true]} /><meshStandardMaterial color="#e8d79a" roughness={0.8} side={THREE.DoubleSide} /></mesh>
              <mesh position={[0, 0.0125, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.022, 0.036, 32]} /><meshStandardMaterial color="#d8c47e" roughness={0.8} /></mesh>
              <mesh><cylinderGeometry args={[0.022, 0.022, 0.024, 24, 1, true]} /><meshStandardMaterial color="#9b7a4c" roughness={0.9} side={THREE.DoubleSide} /></mesh></group>
            <Tape txt="12 PSI COLD" p={[0, 0.014, 0.0]} rot={[-PI / 2, 0, 0]} w={0.14} k={1} rev={cl((tt - A[i]) / 0.7)} />
          </>}
          {i === 2 && <><CoinVent p={[0, 0.012, 0]} s={2.2} a={PI / 2 * eio(tt, A[i] + 0.1, A[i] + 0.7)} />
            <group position={[0, 0.072, 0]} rotation={[0, PI / 2 * eio(tt, A[i] + 0.1, A[i] + 0.7), 0]}><Coin rot={[PI / 2, 0, 0]} s={2.2} /></group>
            <Puffs tt={tt} n={5} a={[0.02, 0.04, 0]} b={[0.06, 0.14, 0.02]} r={0.01} col="#ffffff" op={0.5 * a * (1 - done * 0.7)} v={1.1} /></>}
          {i === 3 && <><BallValve p={[0, 0.0, 0]} open={a} s={1.3} />
            <Hose id="sixh" pts={[[0.0, -0.02, 0.03], [0.02, -0.02, 0.07], [0.07, -0.01, 0.1], [0.1, 0.03, 0.12]]} r={0.007} />
            <Bucket p={[0.12, -0.025, 0.14]} s={0.36} />
            <Bubbles tt={tt} n={Math.round(8 * a) + 1} box={[0.05, 0.04, 0.05]} p={[0.12, 0.01, 0.14]} v={0.08} r={0.004} op={0.85 * a} /></>}
          {i === 4 && <><Cu a={[0, 0, 0]} b={[0, 0.08, 0]} r={0.008} />
            <group rotation={[0, -SANG[i], 0]}><Gauge v={lerp(0, 12.5, eio(tt, A[i], A[i] + 0.9))} max={30} tx={D30s()} p={[0, 0.12, 0]} r={0.05} rot={[-0.35, -0.25, 0]} /></group></>}
          {i === 5 && <><SixFins heat={0.4} dust={1 - eio(tt, A[i] + 0.1, A[i] + 1.0)} />
            <Lint len={0.14 * (1 - eio(tt, A[i] + 0.1, A[i] + 1.0)) + 0.001} k={1 - eio(tt, A[i] + 0.1, A[i] + 1.0)} p={[0.07 - 0.07 * (1 - eio(tt, A[i] + 0.1, A[i] + 1.0)), 0, 0]} seed={6} />
            {/* cepillo de aspiradora que barre */}
            <group position={[lerp(-0.1, 0.1, eio(tt, A[i] + 0.1, A[i] + 1.0)), 0.06, 0]} rotation={[0, 0, 0.06 * Math.sin(tt * 7)]} scale={Math.max(0.001, sp)}>
              <RBox s={[0.05, 0.022, 0.06]} p={[0, 0.012, 0]} r={0.006}>{M.plastic({ col: "#33363b" })}</RBox>
              {Array.from({ length: 14 }, (_, j) => <mesh key={j} position={[-0.02 + (j % 7) * 0.0066, -0.006, -0.015 + Math.floor(j / 7) * 0.03]}><cylinderGeometry args={[0.0016, 0.001, 0.022, 5]} /><meshStandardMaterial color="#c8b48a" roughness={0.8} /></mesh>)}
              <mesh geometry={tubeG("sixwand", [[0, 0.02, 0], [0.01, 0.08, 0.03], [0.03, 0.16, 0.09]], 0.011, 24, 10)}>{M.plastic({ col: "#6b6f75" })}</mesh>
            </group></>}
        </group>
        {/* el rótulo del paso activo flota sobre su estación y se va cuando entra el siguiente */}
        <Tape txt={`${i + 1}. ${SIX[i][0]} ${SIX[i][1]}`} p={[0, 0.2 + (i === 4 ? 0.04 : 0), 0.04]} rot={[-0.45, 0, 0]} w={0.3}
          k={phys(tt, A[i] + 0.05, 8, 0.45) * (i < 5 ? 1 - eio(tt, A[i] + 0.8, A[i] + 1.0) : 1)} />
      </group>; })}
  </>;
}}</Scene3D>;
