// lch29c · componentes únicos 8-14 (dos capas, el carbón que se deshace, la grasa que se derrite, la pileta, la espuma, el detergente, vinagre vs bicarbonato).
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Blob, Bottle, Boil, Burner, Charcoal, Crumb, Filter, Hood, Kettle, Pot, SodaBox, Spoon, Vapor } from "./hood";

const PI = Math.PI;

// ---- 4:40 · LAS DOS CAPAS: la campana se abre en despiece: adelante la malla, atrás el carbón; la malla va al agua, el carbón a la basura ----
export const HTwoLayers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark" bg="#121110"
  cam={{ at: [0, 0.38, 0.05], az: [0.6, 0.45], el: [0.05, 0.12], r: [1.15, 1.0], fov: 32 }} key1={[-0.4, 1.2, 1.2]}>{(tt) => {
  const ex = eio(tt, 0.5, 2.0), go = eio(tt, 3.0, 4.4);
  return <>
    <group position={[0, 0.6, 0]}><Hood /></group>
    <group position={[lerp(0, -0.38, go), 0.59 - 0.2 * ex - 0.3 * go, 0.05 + 0.2 * ex]}><Filter dirt={0.6} /></group>
    <group position={[lerp(0, 0.4, go), 0.59 - 0.06 * ex - 0.3 * go, -0.08]}><Charcoal /></group>
    {/* destinos: la olla a la izquierda, el tacho a la derecha */}
    <group position={[-0.38, 0, 0.05]} scale={go > 0.01 ? 1 : 0.001}><Pot level={0.7} /></group>
    {go > 0.01 && <group position={[0.42, 0, -0.06]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.13, 0.11, 0.24, 32, 1, true]} /><meshStandardMaterial color="#5b6e5a" roughness={0.6} side={2} /></mesh>
      <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.11, 0.11, 0.006, 32]} /><meshStandardMaterial color="#5b6e5a" /></mesh>
    </group>}
  </>;
}}</Scene3D>;

// ---- 5:20 · SE DESHIZO EN LAS MANOS: el carbón entra a la pileta, se ablanda y se desarma en migas negras; el agua se pone negra ----
export const HCrumble: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#121110"
  cam={{ at: [0, 0.02, 0], az: [0.2, 0.1], el: [0.75, 0.85], r: [0.8, 0.68], fov: 32 }}>{(tt) => {
  const dip = eio(tt, 0.4, 1.4), br = eio(tt, 1.8, 4.2), ink = eio(tt, 1.6, 4.6);
  return <>
    {/* la pileta de loza */}
    <RBox s={[0.7, 0.04, 0.5]} p={[0, -0.12, 0]} r={0.02}>{M.porcelain()}</RBox>
    {[[0, 0.27, 0.74, 0.04], [0, -0.27, 0.74, 0.04]].map(([x, z, w, d], i) => <RBox key={i} s={[w, 0.2, d]} p={[x, -0.02, z]} r={0.015}>{M.porcelain()}</RBox>)}
    {[-0.37, 0.37].map((x, i) => <RBox key={i} s={[0.04, 0.2, 0.5]} p={[x, -0.02, 0]} r={0.015}>{M.porcelain()}</RBox>)}
    <mesh position={[0, 0.03, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.7, 0.5]} /><meshPhysicalMaterial color={`rgb(${Math.round(lerp(170, 22, ink))},${Math.round(lerp(205, 22, ink))},${Math.round(lerp(225, 24, ink))})`} roughness={0.3} transparent opacity={lerp(0.45, 0.92, ink)} /></mesh>
    {/* el almohadón entero, después en pedazos que se separan y se hunden */}
    {br < 0.02 ? <group position={[0, lerp(0.2, 0.03, dip), 0]} rotation={[-0.1, 0, 0.05]}><Charcoal /></group>
      : Array.from({ length: 70 }, (_, i) => { const dx = (rn(i, 7) - 0.5) * 0.33, dz = (rn(i, 8) - 0.5) * 0.21;
        return <group key={i} position={[dx * (1 + 0.6 * br) + (rn(i, 2) - 0.5) * 0.06 * br, 0.03 - 0.05 * br * rn(i, 3), dz * (1 + 0.6 * br) + (rn(i, 4) - 0.5) * 0.06 * br]}>
          <Crumb i={i} s={lerp(0.03, 0.008 + 0.014 * rn(i, 9), br)} /></group>; })}
    {/* nubes de tinta negra que salen del carbón */}
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[(rn(i, 20) - 0.5) * 0.4 * ink, 0.032, (rn(i, 21) - 0.5) * 0.3 * ink]} rotation={[-PI / 2, 0, 0]} scale={0.02 + 0.12 * ink * rn(i, 22)}><circleGeometry args={[1, 24]} /><meshBasicMaterial color="#0d0d0e" transparent opacity={0.35 * ink} depthWrite={false} /></mesh>)}
  </>;
}}</Scene3D>;

const vinTex = () => tex.text("vin", 128, 170, (g) => { g.fillStyle = "#fbf6e8"; g.fillRect(0, 0, 128, 170); g.fillStyle = "#8a1f1a"; g.fillRect(0, 0, 128, 34); g.fillStyle = "#3a2a14"; g.font = "bold 26px Georgia"; g.fillText("WHITE", 22, 80); g.fillText("VINEGAR", 4, 116); });

// ---- 5:50 · LA GRASA ES GRASA Y SE DERRITE: corte de la malla: los grumos marrones entre las capas se vuelven gotas y caen al agua hirviendo ----
export const HFatMelt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#14110d" key1={[-0.8, 0.6, 1.2]}
  cam={{ at: [0, 0.12, 0], az: [0.05, 0.02], el: [0.12, 0.16], r: [0.62, 0.55], fov: 30 }}>{(tt) => {
  const melt = eio(tt, 1.0, 3.8);
  return <>
    {/* tres capas de malla vistas de canto */}
    {[0.16, 0.2, 0.24].map((y, i) => <group key={i} position={[0, y, 0]}>
      {Array.from({ length: 26 }, (_, j) => <mesh key={j} position={[-0.25 + j * 0.02, 0, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.0028, 0.0028, 0.12, 8]} />{M.steel()}</mesh>)}
    </group>)}
    {/* los grumos de grasa vieja que se achican y gotean */}
    {Array.from({ length: 14 }, (_, i) => { const x = -0.22 + i * 0.034, y = [0.18, 0.22, 0.2][i % 3], s = 0.016 * (1 - 0.8 * melt) + 0.004;
      const ph = cl((tt - 1.2 - rn(i, 2) * 2.2) / 1.0);
      return <group key={i}>
        <group position={[x, y, 0]} scale={[1.4, 1, 1]}><Blob s={s} col="#7a4c1c" /></group>
        {ph > 0 && ph < 1 && <mesh position={[x, y - 0.17 * ph * ph, 0]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.006, 10, 8]} />{M.grease({ col: "#d6a24a" })}</mesh>}
      </group>; })}
    {/* el agua hirviendo abajo */}
    <mesh position={[0, 0.0, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.7, 0.3]} /><meshPhysicalMaterial color="#b8d4e2" roughness={0.05} transparent opacity={0.7} clearcoat={1} /></mesh>
    <Boil tt={tt} k={1} r={0.3} y={0.0} n={30} />
    <Vapor tt={tt} k={1} p={[0, 0.02, 0]} spread={0.4} h={0.3} />
  </>;
}}</Scene3D>;

// ---- 6:25 · EN LA PILETA: el filtro acostado con el tapón puesto; la pava lo tapa de agua hirviendo ----
export const HSinkPour: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#121110" key1={[-0.6, 1.4, 1.0]}
  cam={{ at: [0, 0.0, 0], az: [-0.3, -0.15], el: [0.62, 0.7], r: [0.95, 0.82], fov: 32 }}>{(tt) => {
  const tilt = eio(tt, 0.6, 1.3), fill = eio(tt, 1.2, 4.6);
  return <>
    <RBox s={[0.7, 0.04, 0.5]} p={[0, -0.12, 0]} r={0.02}>{M.porcelain()}</RBox>
    {[[0, 0.27], [0, -0.27]].map(([x, z], i) => <RBox key={i} s={[0.74, 0.22, 0.04]} p={[x, -0.01, z]} r={0.015}>{M.porcelain()}</RBox>)}
    {[-0.37, 0.37].map((x, i) => <RBox key={i} s={[0.04, 0.22, 0.5]} p={[x, -0.01, 0]} r={0.015}>{M.porcelain()}</RBox>)}
    <mesh position={[0.2, -0.098, 0.15]}><cylinderGeometry args={[0.025, 0.025, 0.01, 24]} />{M.rubber({ col: "#2a2a2a" })}</mesh>
    <group position={[0, -0.09, -0.02]}><Filter dirt={0.7} /></group>
    {fill > 0 && <mesh position={[0, lerp(-0.098, -0.04, fill), 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.7, 0.5]} />{M.water({ op: 0.5 })}</mesh>}
    {/* la pava inclinada y su chorro */}
    <group position={[-0.25, 0.2, 0.05]} rotation={[0, 0, -0.9 * tilt]}><Kettle /></group>
    {tilt > 0.9 && fill < 0.98 && Array.from({ length: 16 }, (_, i) => { const ph = (tt * 2.4 + i / 16) % 1; return <mesh key={i} position={[-0.13 + 0.06 * ph, 0.2 - 0.27 * ph * ph, 0.05]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.009, 10, 8]} />{M.water({ op: 0.85 })}</mesh>; })}
    <Vapor tt={tt} k={fill} p={[0, -0.05, 0]} spread={0.5} />
  </>;
}}</Scene3D>;

// ---- 7:25 · DE A UNA CUCHARADA: una cuchara = espuma que sube y baja; media taza de golpe = la espuma rebalsa sobre la cocina ----
export const HFoamOver: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark" bg="#14110d"
  cam={{ at: [0, 0.18, 0], az: [0.2, 0.05], el: [0.22, 0.26], r: [1.15, 1.0], fov: 32 }}>{(tt) => {
  const sp = eio(tt, 0.3, 0.9), f1 = Math.sin(cl((tt - 0.9) / 1.6) * PI), dump = eio(tt, 2.6, 3.1), f2 = eio(tt, 3.0, 4.4);
  const foam = (x: number, k: number, over: number) => <group position={[x, 0, 0]}>
    {Array.from({ length: 40 }, (_, i) => { const a = rn(i, 2) * PI * 2, rr = Math.sqrt(rn(i, 3)) * (0.14 + 0.05 * over), y = 0.15 + 0.08 * k * rn(i, 4) - (rr > 0.15 ? 0.12 * over * rn(i, 5) : 0);
      return k > 0.02 && <mesh key={i} position={[Math.cos(a) * rr, y, Math.sin(a) * rr]} scale={0.6 + k}><sphereGeometry args={[0.018, 12, 10]} /><meshStandardMaterial color="#fbfbf6" roughness={0.6} /></mesh>; })}
  </group>;
  return <>
    <group position={[0, -0.04, 0]}><Burner on={1} /></group>
    {[-0.2, 0.2].map((x, i) => <group key={i} position={[x, 0, 0]} scale={0.85}><Pot level={0.75} water="#cfe2ea" /><Boil tt={tt} k={1} y={0.15} /></group>)}
    {foam(-0.2, 0.7 * f1, 0)}
    {foam(0.2, 1.4 * f2, f2)}
    <group position={[-0.2 + 0.03, 0.32 - 0.1 * sp + 0.12 * eio(tt, 1.0, 1.4), 0]} rotation={[0, 0, -0.5 * sp]}><Spoon load={1 - eio(tt, 0.8, 1.0)} /></group>
    {/* la caja entera que se vuelca en la otra */}
    <group position={[0.28, 0.42, 0]} rotation={[0, 0, 1.8 * dump]} scale={dump > 0.01 ? 1 : 0.001}><SodaBox /></group>
  </>;
}}</Scene3D>;

// ---- 8:05 · EL DETERGENTE AGARRA LA GRASA: en el agua, cada gota de grasa suelta queda rodeada de burbujitas y ya no vuelve al filtro ----
export const HSoapGrab: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0f1418" key1={[-0.6, 1.0, 1.2]}
  cam={{ at: [0, 0.1, 0], az: [0.1, -0.05], el: [0.05, 0.08], r: [0.6, 0.52], fov: 30 }}>{(tt) => {
  const soap = eio(tt, 0.5, 1.4), grab = eio(tt, 1.6, 3.4), rise = eio(tt, 3.4, 5.2);
  return <>
    {/* el filtro abajo, de canto */}
    <group position={[0, 0.0, 0]} rotation={[0, 0, 0]}><Filter dirt={0.4 * (1 - grab)} w={0.5} d={0.2} /></group>
    {/* el chorrito verde de detergente que baja */}
    {soap > 0 && soap < 1 && <mesh position={[0.15, 0.32 - 0.1 * soap, 0]}><cylinderGeometry args={[0.004, 0.004, 0.2 * soap, 8]} />{M.plastic({ col: "#3fae4a", op: 0.8 })}</mesh>}
    {Array.from({ length: 8 }, (_, i) => { const x = -0.2 + i * 0.057, y = 0.03 + 0.25 * rise * (0.6 + 0.4 * rn(i, 2)) + 0.01 * Math.sin(tt * 2 + i);
      return <group key={i} position={[x, y, (rn(i, 3) - 0.5) * 0.08]}>
        <Blob s={0.014} col="#c99038" />
        {Array.from({ length: 10 }, (_, j) => { const a = (j / 10) * PI * 2 + tt * 0.6; return grab > 0.05 && <mesh key={j} position={[Math.cos(a) * 0.024 * grab, Math.sin(a) * 0.02 * grab, 0.004]}><sphereGeometry args={[0.005, 8, 6]} /><meshPhysicalMaterial color="#e4f7e8" roughness={0.05} transparent opacity={0.75 * grab} clearcoat={1} /></mesh>; })}
      </group>; })}
    <mesh position={[0, 0.15, -0.12]}><planeGeometry args={[0.9, 0.5]} /><meshStandardMaterial color="#7d9db0" transparent opacity={0.35} /></mesh>
  </>;
}}</Scene3D>;

// ---- 8:35 · VINAGRE NO, BICARBONATO SÍ: dos frascos con el mismo grumo de grasa; en el vinagre no pasa nada, en el bicarbonato se deshace ----
export const HVinegarVs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile" bg="#14110d"
  cam={{ at: [0, 0.12, 0], az: [0.0, 0.12], el: [0.2, 0.26], r: [0.9, 0.78], fov: 30 }}>{(tt) => {
  const go = eio(tt, 1.2, 4.6), arrive = phys(tt, 0.2, 8, 0.5);
  const jar = (x: number, col: string, dissolve: boolean, extra: React.ReactNode) => <group position={[x, 0, 0]}>
    <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.09, 0.09, 0.2, 40, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
    <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.086, 0.086, 0.14, 40]} /><meshPhysicalMaterial color={col} roughness={0.05} transparent opacity={0.45} /></mesh>
    {/* el grumo marrón: en uno queda entero, en el otro se rompe y sube */}
    {(dissolve ? Array.from({ length: 9 }, (_, i) => i) : [0]).map((i) => <group key={i} position={[dissolve ? (rn(i, 2) - 0.5) * 0.12 * go : 0, 0.03 + (dissolve ? 0.1 * go * rn(i, 3) : 0), dissolve ? (rn(i, 4) - 0.5) * 0.08 * go : 0]} scale={dissolve ? lerp(1.0, 0.35, go) * (i ? 0.6 : 1) : 1}><Blob s={0.028} col="#6f4416" /></group>)}
    {/* burbujas que suben sólo donde hay bicarbonato */}
    {dissolve && Array.from({ length: 16 }, (_, i) => { const ph = (tt * 0.8 + rn(i, 6)) % 1; return go > 0.05 && <mesh key={i} position={[(rn(i, 7) - 0.5) * 0.14, 0.02 + 0.12 * ph, (rn(i, 8) - 0.5) * 0.1]}><sphereGeometry args={[0.004 + 0.004 * rn(i, 9), 8, 6]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.7} roughness={0} /></mesh>; })}
    <group position={[0, 0, 0.16]}>{extra}</group>
  </group>;
  return <group position={[0, 0.3 * (1 - cl(arrive)), 0]}>
    {jar(-0.16, "#d9c79a", false, <group rotation={[0, 0.3, 0]} scale={0.6}><Bottle col="#f2efe6" h={0.24} />
      <mesh position={[0, 0.1, 0.034]}><planeGeometry args={[0.06, 0.08]} /><meshBasicMaterial map={vinTex()} /></mesh></group>)}
    {jar(0.16, `rgb(${Math.round(lerp(200, 235, go))},${Math.round(lerp(180, 240, go))},${Math.round(lerp(140, 242, go))})`, true, <group rotation={[0, -0.3, 0]} scale={0.6}><SodaBox /></group>)}
  </group>;
}}</Scene3D>;
void Hood;
