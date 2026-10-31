// ohf30b · componentes únicos 8-14: el piso que se hunde, el nivel torpedo, el cuarto de pulgada, la barreta,
// «nunca la punta de la válvula», el agua que se embalsa y la manija que abre hasta el tope.
// r2b (30-oct): mensaje grande Big (entero, centrado), acción entre el 45 % y el 85 %; «se embalsa» pasa a ser la VÁLVULA en corte
// (compuerta a media altura, el agua contenida) en vez de otro radiador sobre madera; nivel torpedo en primer plano con burbuja que viaja.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, tex } from "./h3d";
import { Big, Env, Pipe, Puffs, RadH, Wheel } from "./okit";
import { Drop as Drop3 } from "./h3d";

const PI = Math.PI;

// radiador de vidrio (para ver el agua adentro): caja transparente con columnas marcadas y un charco que se mueve
// ---- 6:13 · LA CASA SE ASIENTA: en primer plano el radiador de vidrio; el piso se hunde del lado del respiradero y el agua corre a la punta equivocada ----
export const HSettle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#2a2420" warm={1.1} key1={[-0.8, 1.8, 1.3]}
  cam={{ at: [0.02, 0.17, 0.04], az: [-0.3, -0.12], el: [0.32, 0.26], r: [1.2, 1.05], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "THE HOUSE SETTLES…"], [3.4, "…AND THE WATER RUNS THE WRONG WAY", "#b3261e"]]} />}>{(tt) => {
  const sag = eio(tt, 2.7, 4.0), tilt = -0.12 * sag, flow = eio(tt, 3.0, 4.9);
  return <>
    <Env kind="plaster" col="#7d6b58" z={-0.5} y={0.5} rim={[0.6, 0.6, -0.2]} />
    {/* la viga de abajo con la grieta que se abre */}
    <RBox s={[1.4, 0.1, 0.3]} p={[0, -0.09, 0]} r={0.004}>{M.wood({ base: [110, 78, 50] })}</RBox>
    <mesh position={[0.3, -0.06, 0.151]} rotation={[0, 0, 0.4]}><planeGeometry args={[0.006, 0.08 * sag]} /><meshBasicMaterial color="#1a0d06" /></mesh>
    <group rotation={[0, 0, tilt]}>
      <RBox s={[1.1, 0.03, 0.4]} p={[0, -0.015, 0]} r={0.004}>{M.wood({ base: [140, 96, 60] })}</RBox>
      {/* radiador de verdad: caliente; al inclinarse, el agua fría se junta en la punta baja (la del respiradero) */}
      <RadH n={10} w={0.05} h={0.34} p={[0, 0, 0]} heat={(i, y) => 0.88 - 0.8 * flow * cl((i - 3.5) / 5) * (y < 0.25 + 0.5 * flow ? 1 : 0.3)} />
      <mesh position={[0.25, 0.43, 0.0]}><cylinderGeometry args={[0.022, 0.022, 0.06, 20]} />{M.chrome()}</mesh>
      <RBox s={[0.08, 0.07, 0.08]} p={[-0.36, 0.08, 0]} r={0.01}>{M.brass({ col: "#b48a3c" })}</RBox>
      <Pipe a={[-0.36, 0.05, 0]} b={[-0.36, -0.2, 0]} r={0.022} />
      {/* nivel de burbuja arriba del radiador: la burbuja se va al lado alto */}
      <group position={[-0.05, 0.43, 0.03]}>
        <RBox s={[0.36, 0.035, 0.035]} r={0.004}><meshPhysicalMaterial color="#e3b21c" roughness={0.35} clearcoat={0.6} /></RBox>
        <mesh position={[0, 0, 0.018]}><planeGeometry args={[0.1, 0.022]} /><meshStandardMaterial color="#c8e85a" emissive="#9ccf2a" emissiveIntensity={0.35} roughness={0.2} /></mesh>
        {[-0.016, 0.016].map((x) => <mesh key={x} position={[x, 0, 0.019]}><planeGeometry args={[0.0025, 0.024]} /><meshBasicMaterial color="#1a1a1a" /></mesh>)}
        <mesh position={[-0.038 * sag, 0, 0.021]} scale={[1.6, 1, 0.4]}><sphereGeometry args={[0.008, 16, 12]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} transmission={0.3} /></mesh>
      </group>
      {/* bolita de cromo en el piso: rueda hacia la punta baja */}
      {(() => { const x = lerp(-0.42, 0.44, eio(tt, 2.9, 5.0)); return <mesh position={[x, 0.025, 0.16]} rotation={[0, 0, -x / 0.025]} castShadow><sphereGeometry args={[0.025, 28, 20]} />{M.chrome()}</mesh>; })()}
    </group>
  </>;
}}</Scene3D>;

// ---- 6:43 · EL NIVEL TORPEDO: en primer plano sobre el radiador; se calza la punta del respiradero y la burbuja viaja hacia ese lado ----
export const HTorpedo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#2a2520" key1={[-0.5, 1.4, 1.1]} warm={1.1}
  cam={{ at: [0.04, 0.52, 0], az: [-0.22, 0.16], el: [0.28, 0.2], r: [0.46, 0.42], fov: 30 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "LAY A LEVEL ON TOP…"], [2.9, "VENT END: A HAIR HIGHER", "#1f6a3a"]]} />}>{(tt) => {
  const land = phys(tt, 0.2, 9, 0.4), up = eio(tt, 2.4, 4.4), bub = lerp(0, 0.036, up) + 0.0015 * Math.sin(tt * 4) * (1 - up);
  return <>
    <mesh position={[0, 0.6, -0.4]}><planeGeometry args={[3, 2]} /><meshStandardMaterial map={tex.plaster("#7a6a55", 3, 2)} roughness={0.9} /></mesh>
    <group rotation={[0, 0, 0.022 * up]} position={[0, 0, -0.02]}>
      <RadH n={9} w={0.045} h={0.44} heat={() => 0.3} />
      {/* el respiradero (punta derecha) para saber qué lado es */}
      <group position={[0.235, 0.33, 0.02]} rotation={[0, 0, -PI / 2]}>
        <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.018, 0.018, 0.05, 20]} />{M.chrome()}</mesh>
        <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.018, 20, 10, 0, PI * 2, 0, PI / 2]} />{M.chrome()}</mesh>
      </group>
      <group position={[0, 0.52 + (1 - cl(land)) * 0.2, 0.0]}>
        <RBox s={[0.3, 0.04, 0.04]} r={0.008}><meshPhysicalMaterial color="#f2c230" roughness={0.35} clearcoat={0.5} /></RBox>
        <RBox s={[0.12, 0.026, 0.006]} p={[0, 0, 0.021]} r={0.003}><meshStandardMaterial color="#222" roughness={0.5} /></RBox>
        <mesh position={[0, 0.0, 0.024]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.011, 0.011, 0.1, 18]} />{M.glass({ op: 0.6, col: "#c8ff7a" })}</mesh>
        <mesh position={[0, 0.0, 0.0245]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0095, 0.0095, 0.098, 18]} /><meshStandardMaterial color="#b9f25a" emissive="#5aa020" emissiveIntensity={0.5} transparent opacity={0.7} /></mesh>
        <mesh position={[bub, 0.003, 0.03]} scale={[2.2, 0.75, 0.6]}><sphereGeometry args={[0.009, 16, 12]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} clearcoat={1} emissive="#ffffff" emissiveIntensity={0.25} /></mesh>
        {[-0.014, 0.014].map((x) => <mesh key={x} position={[x, 0, 0.036]}><boxGeometry args={[0.0018, 0.024, 0.001]} /><meshStandardMaterial color="#111" /></mesh>)}
      </group>
    </group>
    {/* el calce entra bajo la pata del respiradero */}
    <mesh position={[lerp(0.42, 0.24, up), 0.006, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.09, 3]} />{M.wood({ base: [214, 176, 120] })}</mesh>
  </>;
}}</Scene3D>;

// ---- 7:11 · UN CUARTO DE PULGADA: primer plano de la pata; la cuña entra, la levanta y la regla grande se pinta hasta 1/4" ----
const qTx = () => tex.text("quarterin", 320, 192, (g) => { g.fillStyle = "#1f6a3a"; g.fillRect(0, 0, 320, 192); g.fillStyle = "#fff"; g.font = "900 120px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("¼″", 160, 100); });
export const HQuarterInch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#2a221c" warm={1.1} key1={[-0.6, 1.4, 1.0]}
  cam={{ at: [-0.08, 0.08, 0.05], az: [-0.42, -0.26], el: [0.12, 0.07], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <Big tt={tt} steps={[[1.0, "A WOOD SHIM UNDER THE FOOT…"], [3.6, "…ABOUT A QUARTER INCH", "#1f6a3a"]]} />}>{(tt) => {
  const slide = eio(tt, 2.75, 4.5), up = 0.024 * eio(tt, 3.6, 4.5);
  return <>
    <Env kind="plaster" col="#6b7d86" z={-0.7} y={0.6} rim={[0.4, 0.4, -0.2]} rimI={2.6} />
    <group position={[0, up, 0]}>
      <RBox s={[0.06, 0.06, 0.12]} p={[0, 0.03, 0]} r={0.01}><meshStandardMaterial color="#7d786b" metalness={0.4} roughness={0.5} /></RBox>
      <RBox s={[0.2, 0.18, 0.09]} p={[0.05, 0.15, 0]} r={0.012}><meshStandardMaterial color="#cfcfc9" metalness={0.8} roughness={0.32} /></RBox>
      {[0, 1, 2].map((i) => <RBox key={i} s={[0.045, 0.2, 0.09]} p={[0.0 + i * 0.05, 0.33, 0]} r={0.012}><meshStandardMaterial color="#cfcfc9" metalness={0.8} roughness={0.32} /></RBox>)}
    </group>
    {/* la cuña: entra empujada desde la izquierda */}
    <mesh position={[lerp(-0.4, -0.02, slide), 0.012, 0.01]} rotation={[PI / 2, 0, -0.06]} scale={[2.0, 1.4, 0.55]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.11, 3]} />{M.wood({ base: [214, 176, 120] })}</mesh>
    {/* la luz bajo la pata: roja antes, verde cuando la cuña la toca */}
    <mesh position={[0, 0.002 + up / 2, 0.062]}><planeGeometry args={[0.06, Math.max(0.0005, up)]} /><meshBasicMaterial color="#5fd17a" toneMapped={false} /></mesh>
    {/* la regla grande parada al lado: la franja verde sube con la pata */}
    <group position={[-0.2, 0.13, 0.12]} rotation={[0, -0.35, 0]} scale={2.2}>
      <RBox s={[0.03, 0.12, 0.004]} r={0.002}>{M.steel()}</RBox>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.007, -0.05 + i * 0.0075, 0.003]}><boxGeometry args={[i % 4 === 0 ? 0.016 : 0.008, 0.0012, 0.001]} /><meshStandardMaterial color="#111" /></mesh>)}
      <mesh position={[0.007, -0.05 + 0.0075 * eio(tt, 3.6, 4.5), 0.0032]} scale={[1, Math.max(0.01, eio(tt, 3.6, 4.5)), 1]}><planeGeometry args={[0.012, 0.015]} /><meshBasicMaterial color="#5fd17a" toneMapped={false} /></mesh>
      <mesh position={[0, -0.05 + 0.015, 0.0034]}><boxGeometry args={[0.034, 0.0018, 0.001]} /><meshBasicMaterial color="#e5332a" toneMapped={false} /></mesh>
      <group position={[0.034, -0.035, 0.004]} scale={Math.max(0.001, phys(tt, 4.2, 8, 0.5))} visible={tt > 4.2}><mesh><planeGeometry args={[0.04, 0.024]} /><meshBasicMaterial map={qTx()} toneMapped={false} /></mesh></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 7:51 · LA BARRETA: primer plano de la pata del respiradero; la barreta sobre un taco la levanta, se abre el hueco y entra la cuña ----
export const HPryBar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#2a231e" warm={1.1} key1={[-0.6, 1.5, 1.1]}
  cam={{ at: [0.34, 0.06, 0.04], az: [0.6, 0.38], el: [0.1, 0.06], r: [0.62, 0.5], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "SCRAP OF WOOD UNDER THE BAR…"], [3.3, "…LIFT, SLIDE THE SHIM IN", "#1f6a3a"]]} />}>{(tt) => {
  const lift = eio(tt, 2.8, 3.6), a = 0.2 - 0.3 * lift, shim = eio(tt, 3.7, 4.7), gap = 0.06 * lift;
  return <>
    <Env kind="plaster" col="#5f6e5a" z={-0.35} y={0.5} rim={[0.7, 0.5, -0.1]} rimI={2.6} />
    <group position={[-0.04, 0, 0]} rotation={[0, 0, 0.16 * lift]}><group position={[0.2, 0, 0]}><RadH n={9} w={0.045} h={0.42} heat={() => 0.3} /></group></group>
    {/* el hueco bajo la pata, en rojo, hasta que entra la cuña */}
    <mesh position={[0.33, gap / 2, 0.065]}><planeGeometry args={[0.05, Math.max(0.0005, gap)]} /><meshBasicMaterial color="#ff4a2a" toneMapped={false} transparent opacity={cl(lift * 2) * (1 - shim)} /></mesh>
    <RBox s={[0.08, 0.04, 0.09]} p={[0.48, 0.02, 0.0]} r={0.004}>{M.wood({ base: [190, 150, 100] })}</RBox>
    <group position={[0.48, 0.05, 0.0]} rotation={[0, 0, a]}>
      <RBox s={[0.62, 0.022, 0.04]} p={[0.16, 0, 0]} r={0.008}><meshStandardMaterial color="#2c4d7a" metalness={0.6} roughness={0.35} /></RBox>
      <RBox s={[0.1, 0.026, 0.044]} p={[0.42, 0, 0]} r={0.008}><meshStandardMaterial color="#1c1c1c" roughness={0.6} /></RBox>
    </group>
    <mesh position={[0.31, 0.012, lerp(0.28, 0, shim)]} rotation={[PI / 2, 0, PI / 2]} scale={[1, 1, 0.6]}><cylinderGeometry args={[0.04, 0.04, 0.1, 3]} />{M.wood({ base: [214, 176, 120] })}</mesh>
  </>;
}}</Scene3D>;

// ---- 8:21 · NUNCA LA PUNTA DE LA VÁLVULA: si sube ese lado, la unión bajo el piso se raja y gotea; se levanta el otro ----
export const HNotValveEnd: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#262a30" key1={[-0.6, 1.8, 1.4]}
  cam={{ at: [-0.05, 0.1, 0], az: [-0.32, 0.1], el: [0.04, 0.02], r: [1.3, 1.18], fov: 34 }}
  over={(tt) => <Big tt={tt} steps={[[0.8, "NEVER LIFT THE VALVE END", "#b3261e"], [3.7, "ALWAYS LIFT THE VENT END", "#1f6a3a"]]} />}>{(tt) => {
  const bad = eio(tt, 0.6, 1.6) * (1 - eio(tt, 3.0, 3.5)), crack = eio(tt, 1.4, 1.9) * (1 - eio(tt, 3.0, 3.5)), good = eio(tt, 3.6, 4.8);
  return <>
    <Env kind="plaster" col="#4d5a66" z={-0.4} y={0.4} rim={[0.6, 0.6, -0.1]} />
    {/* el piso en corte: tablas arriba, viga y el caño que baja */}
    <RBox s={[1.2, 0.03, 0.4]} p={[0, -0.015, 0]} r={0.004}>{M.wood({ base: [150, 102, 62] })}</RBox>
    <RBox s={[1.2, 0.1, 0.06]} p={[0, -0.08, -0.12]} r={0.004}>{M.wood({ base: [110, 78, 50] })}</RBox>
    <group position={[0, 0.03 * (bad + good), 0]} rotation={[0, 0, -0.06 * bad + 0.05 * good]}><RadH n={9} w={0.045} h={0.4} heat={() => 0.3} /></group>
    <mesh position={[0.24, 0.43 + 0.03 * good, 0.02]} rotation={[0, 0, -PI / 2]}><cylinderGeometry args={[0.016, 0.016, 0.04, 16]} />{M.chrome()}</mesh>
    <RBox s={[0.07, 0.06, 0.07]} p={[-0.3, 0.07 + 0.03 * bad, 0]} r={0.01}>{M.brass({ col: "#b48a3c" })}</RBox>
    <Pipe a={[-0.3, 0.04 + 0.03 * bad, 0]} b={[-0.3, -0.32, 0]} r={0.022} />
    <mesh position={[-0.3, -0.13, 0]}><cylinderGeometry args={[0.032, 0.032, 0.045, 6]} /><meshStandardMaterial color="#6b6f73" metalness={0.7} roughness={0.35} emissive="#ff2a1a" emissiveIntensity={1.6 * crack} /></mesh>
    {crack > 0.05 && <mesh position={[-0.3, -0.13, 0.034]} rotation={[0, 0, 0.6]}><planeGeometry args={[0.005, 0.06 * crack]} /><meshBasicMaterial color="#ff3a22" toneMapped={false} /></mesh>}
    {/* gotas que salen de la unión rajada */}
    {[1.8, 2.15, 2.5, 2.85].map((a, i) => <Drop3 key={i} tt={tt} a={a} b={a + 0.45} x={-0.3 + 0.02 * (i % 2)} y0={-0.15} y1={-0.42} z={0.03} r={0.009} ring={false} />)}
  </>;
}}</Scene3D>;

// ---- 9:10 · EL AGUA SE EMBALSA: la VÁLVULA en corte; la compuerta baja a media altura, el vapor pasa por arriba y el agua queda atrapada ----
export const HBackup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#1d2630" key1={[-0.7, 1.5, 1.3]} warm={1.05}
  cam={{ at: [0.04, 0.2, 0], az: [-0.42, -0.12], el: [0.16, 0.1], r: [0.78, 0.7], fov: 32 }}
  over={(tt) => <Big tt={tt} steps={[[0.9, "VALVE HALF CLOSED…"], [3.0, "…THE WATER CAN'T GET OUT", "#b3261e"]]} />}>{(tt) => {
  const close = eio(tt, 0.6, 2.0), lvl = eio(tt, 2.2, 5.2), R = 0.055;
  return <>
    <mesh position={[0, 0.6, -0.35]}><planeGeometry args={[3, 2]} /><meshStandardMaterial map={tex.plaster("#4b5d6b", 3, 2)} roughness={0.9} /></mesh>
    <mesh position={[0, -0.02, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3, 2]} /><meshStandardMaterial map={tex.concrete(4, 3)} roughness={0.85} /></mesh>
    {/* caño de entrada (corte de vidrio) y el cuerpo de bronce de la válvula con su ventana */}
    <mesh position={[-0.2, 0.16, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[R, R, 0.32, 28, 1, true]} />{M.glass({ op: 0.18 })}</mesh>
    <mesh position={[0.2, 0.16, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[R, R, 0.32, 28, 1, true]} />{M.glass({ op: 0.18 })}</mesh>
    {[-0.075, 0.075].map((x) => <mesh key={x} position={[x, 0.16, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[R + 0.016, R + 0.016, 0.034, 6, 1, true]} />{M.brass({ col: "#c39a4c" })}</mesh>)}
    <mesh position={[0, 0.16, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[R + 0.012, R + 0.012, 0.14, 28, 1, true]} />{M.glass({ op: 0.12 })}</mesh>
    <mesh position={[0, 0.16, -R - 0.01]}><circleGeometry args={[R + 0.01, 28, 0, PI]} />{M.brass({ col: "#a9823c" })}</mesh>
    <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.03, 0.04, 0.06, 24]} />{M.brass({ col: "#c39a4c" })}</mesh>
    <mesh position={[0, 0.33, 0]}><cylinderGeometry args={[0.006, 0.006, 0.08, 10]} />{M.brass()}</mesh>
    <Wheel p={[0, 0.37, 0]} a={close * PI * 2.4} r={0.05} col="#2b2b2b" />
    {/* la compuerta: baja hasta la mitad del caño */}
    <RBox s={[0.012, 0.12, 0.1]} p={[0, 0.16 + 0.12 - 0.07 * close, 0]} r={0.003}>{M.brass({ col: "#b8892e" })}</RBox>
    {/* el radiador (a la derecha, sus primeras columnas) y el agua que sube adentro */}
    <group position={[0.42, 0.0, 0]}>
      {[0, 1, 2].map((i) => <mesh key={i} position={[i * 0.06, 0.3, 0]}><boxGeometry args={[0.05, 0.56, 0.12]} />{M.glass({ op: 0.14 })}</mesh>)}
      <mesh position={[0.06, 0.04 + 0.2 * lvl, 0]} scale={[1, Math.max(0.01, lvl), 1]}><boxGeometry args={[0.17, 0.4, 0.11]} />{M.water({ op: 0.75 })}</mesh>
      {[0, 1, 2].map((i) => <mesh key={i} position={[i * 0.06, 0.58, 0]}><sphereGeometry args={[0.026, 16, 10]} /><meshStandardMaterial color="#cfcfc9" metalness={0.8} roughness={0.32} /></mesh>)}
    </group>
    {/* agua atrapada contra la compuerta (lado del radiador) */}
    <mesh position={[0.2, 0.16 - R + 0.006 + 0.022 * lvl, 0]} scale={[1, Math.max(0.05, lvl), 1]}><boxGeometry args={[0.32, 0.044, 0.08]} />{M.water({ op: 0.85 })}</mesh>
    {/* el vapor pasa por arriba de la compuerta */}
    <Puffs tt={tt} n={9} a={[-0.36, 0.185, 0]} b={[0.4, 0.2, 0]} r={0.014} op={0.75 * eio(tt, 0.3, 1.0)} v={0.6} wob={0.004} />
  </>;
}}</Scene3D>;

// ---- 9:31 · HASTA EL TOPE: la manija gira contra reloj (arco que se llena), toca el tope y vuelve un pelo ----
export const HSpinOpen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#2a2420" warm={1.15} key1={[-0.4, 1.6, 1.2]}
  cam={{ at: [0, 0.24, 0], az: [-0.25, 0.2], el: [0.72, 0.58], r: [0.85, 0.72], fov: 30 }}
  over={(tt) => <Big tt={tt} steps={[[1.0, "ALL THE WAY OPEN…", "#1f6a3a"], [4.5, "…THEN BACK A HAIR"]]} />}>{(tt) => {
  const turn = eio(tt, 0.6, 4.4), back = eio(tt, 4.5, 5.1), a = turn * PI * 3.2 - back * 0.35;
  const arc = Math.max(0.01, (turn * 0.92 - back * 0.06)) * PI * 2;
  return <><Env kind="brick" col="#6e4632" z={-0.3} y={0.4} rim={[0.4, 0.6, -0.1]} rimI={2.6} /><group position={[0, 0.1, 0]}>
    <RBox s={[0.12, 0.08, 0.1]} p={[0, 0, 0]} r={0.015}>{M.brass({ col: "#b48a3c" })}</RBox>
    <Pipe a={[-0.4, 0, 0]} b={[-0.06, 0, 0]} r={0.03} col="#4a4d50" />
    <Pipe a={[0.06, 0, 0]} b={[0.4, 0, 0]} r={0.03} col="#4a4d50" />
    <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.008, 0.008, 0.1, 10]} />{M.brass()}</mesh>
    <Wheel p={[0, 0.13, 0]} a={a} r={0.07} col="#2b2b2b" />
    <mesh position={[0, 0.135, 0]} rotation={[-PI / 2, 0, PI / 2]}><ringGeometry args={[0.095, 0.11, 64, 1, 0, arc]} /><meshBasicMaterial color="#5fd17a" transparent opacity={0.85} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} /></mesh>
  </group></>;
}}</Scene3D>;
