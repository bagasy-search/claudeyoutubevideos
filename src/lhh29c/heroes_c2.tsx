// lhh29c · componentes únicos 9-16: el catálogo Sears de 1940, la hoja que se dobla cinco veces, las rebabas del filo,
// la tijera que corta tela como en 1940, los doce cubiertos, la burbuja con olor a huevo, el sarro que se muda y la tarde que se vuelve 20 minutos.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn, tubeG } from "./h3d";
import { Foil, FoilBall, FoilSheet, Pie, Shears, Spoon, SERIF } from "./foilkit";

const PI = Math.PI;

// ---- 4:05 · DEL CATÁLOGO SEARS, 1940: el catálogo viejo se abre en la página de tijeras y la tijera de verdad sube del papel ----
const searsPage = () => tex.text("searspg", 512, 680, (g) => {
  g.fillStyle = "#efe3c4"; g.fillRect(0, 0, 512, 680); g.fillStyle = "#3a2a18"; g.font = "bold 38px " + SERIF; g.textAlign = "center"; g.fillText("SEARS, ROEBUCK AND CO.", 256, 56);
  g.font = "italic 24px " + SERIF; g.fillText("Catalog · Fall 1940", 256, 90);
  g.strokeStyle = "#3a2a18"; g.lineWidth = 3; g.strokeRect(70, 130, 372, 250);
  g.lineWidth = 6; g.beginPath(); g.moveTo(130, 330); g.lineTo(390, 180); g.moveTo(130, 180); g.lineTo(390, 330); g.stroke();
  g.beginPath(); g.arc(120, 190, 26, 0, 6.3); g.arc(120, 320, 26, 0, 6.3); g.stroke();
  g.font = "bold 34px " + SERIF; g.fillText("TAILOR'S SHEARS", 256, 430); g.font = "26px " + SERIF; g.fillText("8 in. forged steel · black handles", 256, 468);
  g.fillStyle = "#8a1e18"; g.font = "bold 56px " + SERIF; g.fillText("$1.29", 256, 540);
  g.fillStyle = "rgba(58,42,24,.45)"; for (let i = 0; i < 8; i++) g.fillRect(60, 580 + i * 11, 392 - (i % 3) * 60, 4);
});
export const HSears1940: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.2, 0.55, 0.35]}
  cam={{ at: [0.18, 0.05, 0.03], az: [0.25, 0.05], el: [0.35, 0.28], r: [0.55, 0.48], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="SEARS CATALOG · 1940" col={AMB} />
    </>}>{(tt) => {
  const op = eio(tt, 0.4, 1.6), up = phys(tt, 2.6, 6, 0.5);
  return <>
    <RBox s={[0.25, 0.03, 0.33]} p={[0.125, 0.015, 0]} r={0.006}><meshStandardMaterial color="#a8402e" roughness={0.8} /></RBox>
    <mesh position={[0.125, 0.0305, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.24, 0.32]} /><meshStandardMaterial map={searsPage()} roughness={0.9} /></mesh>
    {/* la tapa se abre hacia la izquierda */}
    <group position={[0, 0.03, 0]} rotation={[0, 0, PI * op]}>
      <RBox s={[0.25, 0.006, 0.33]} p={[0.125, 0.003, 0]} r={0.004}><meshStandardMaterial color="#8a2e20" roughness={0.75} /></RBox>
      <mesh position={[0.125, 0.0065, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.2, 0.08]} /><meshStandardMaterial map={tex.text("searscv", 400, 160, (g) => { g.fillStyle = "#8a2e20"; g.fillRect(0, 0, 400, 160); g.fillStyle = "#f1d9a0"; g.font = "bold 54px " + SERIF; g.textAlign = "center"; g.fillText("SEARS", 200, 80); g.font = "30px " + SERIF; g.fillText("1940", 200, 130); })} roughness={0.8} /></mesh>
    </group>
    {(() => { const cut = eio(tt, 3.4, 5.6); return <>
      <FoilSheet w={0.2 - 0.14 * cut} d={0.06} p={[0.2 - 0.07 * cut, 0.075, 0.05]} crumple={0.05} />
      {cut > 0 && <FoilSheet w={0.14 * cut} d={0.06} p={[0.06 + 0.07 * cut, 0.07 - 0.02 * cut, 0.05 + 0.01 * cut]} rot={[-PI / 2 + 0.15 * cut, 0, 0.1]} crumple={0.08} />}
      {cut > 0.02 && Array.from({ length: 16 }, (_, i) => { const d = ((tt * 0.5 + rn(i, 91)) % 1), zz = 0.05 + (rn(i, 93) - 0.5) * 0.05 + d * 0.16; return <mesh key={"sv" + i} position={[0.13 + (rn(i, 92) - 0.5) * 0.08 - d * 0.05, Math.max(zz < 0.165 ? 0.033 : 0.003, 0.075 - d * 0.14), zz]} rotation={[d * 9 + i, i, d * 6]}><boxGeometry args={[0.032, 0.003, 0.022]} />{M.chrome({})}</mesh>; })}
      {up > 0 && <Shears p={[lerp(0.12, 0.13, cut), 0.06 + 0.03 * cl(up), 0.05]} rot={[-PI / 2 + 0.25, 0, PI]} s={1.4 * cl(up)} open={cut > 0 && cut < 1 ? 0.06 + 0.3 * Math.abs(Math.sin(tt * 5)) : 0.3} />}
    </>; })()}
  </>;
}}</Scene3D>;

// ---- 4:21 · CUATRO O CINCO DOBLECES: la hoja se dobla sobre sí misma cinco veces; la tira engorda y el contador de capas sube 2, 4, 8, 16, 32 ----
export const HLayers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark"
  cam={{ at: [0, 0.05, 0], az: [-0.5, -0.1], el: [0.45, 0.35], r: [0.72, 0.6], fov: 30 }}
  over={(tt) => { const n = Math.min(5, Math.max(0, Math.floor((tt - 0.6) / 1.1 + 0.5)));
    return <><Head tt={tt} kick="" title="FOLD IT FIVE TIMES" col={AMB} />
      <Tag tt={tt} at={0.9} x={960} y={900} txt={`${2 ** n} LAYERS`} col={AMB} size={48} /></>; }}>{(tt) => {
  // cada doblez: la mitad derecha gira sobre la línea del medio y se apoya encima
  const st = (i: number) => eio(tt, 0.6 + i * 1.1, 1.4 + i * 1.1);
  let w = 0.36, d = 0.26; const out: React.ReactNode[] = [];
  let done = 0; for (let i = 0; i < 5; i++) if (st(i) >= 1) done = i + 1;
  for (let i = 0; i < done; i++) { if (i % 2 === 0) w /= 2; else d /= 2; }
  const th = 0.0016 * 2 ** done, f = done < 5 ? st(done) : 0, alongX = done % 2 === 0;
  const hw = alongX ? w / 2 : w, hd = alongX ? d : d / 2;
  out.push(<RBox key="base" s={[hw, th, hd]} p={[alongX ? -w / 4 : 0, th / 2, alongX ? 0 : -d / 4]} r={0.0008}><Foil /></RBox>);
  out.push(<group key="flap" position={[0, th, 0]} rotation={alongX ? [0, 0, PI * f] : [-PI * f, 0, 0]}>
    <RBox s={[hw, th, hd]} p={[alongX ? w / 4 : 0, -th / 2, alongX ? 0 : d / 4]} r={0.0008}><Foil /></RBox></group>);
  return <group scale={2.2} rotation={[0, 0.7 * eio(tt, 5.6, 7.2), 0.3 * eio(tt, 5.8, 7.0)]}><group position={alongX ? [w / 4 * f, 0, 0] : [0, 0, d / 4 * f]}>{out}</group></group>;
}}</Scene3D>;

// ---- 4:41 · LIMPIA LAS REBABAS DEL FILO: macro del filo con dientitos y mugre; la tira de aluminio pasa y lo deja liso, con un brillo que corre ----
export const HBurrs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile" lamp={[0.1, 0.5, 0.3]}
  cam={{ at: [0.04, 0.03, 0], az: [0.35, -0.1], el: [0.26, 0.2], r: [0.46, 0.4], fov: 28 }}
  over={(tt) => <><Head tt={tt} kick="" title="BURRS AND GUNK · GONE" col={ICE} />
    
    </>}>{(tt, u) => {
  const sx = lerp(-0.3, 0.1, eio(u, 0.08, 0.6)), gl = eio(u, 0.64, 0.86);
  return <>
    <group position={[0, 0.02, 0]}>
    <mesh position={[0, -0.02, 0]} rotation={[0, 0, 0]}><boxGeometry args={[0.66, 0.04, 0.012]} />{M.steel({ col: "#d7dbe0" })}</mesh>
    <mesh position={[0, 0.0, 0]} rotation={[PI / 4, 0, 0]}><boxGeometry args={[0.66, 0.006, 0.006]} />{M.chrome({})}</mesh>
    {Array.from({ length: 40 }, (_, i) => { const x = -0.32 + i * 0.0165, f = cl((sx - x) * 7); if (f >= 1) return null;
      return <mesh key={i} position={[x + f * 0.02, 0.006 + 0.004 * rn(i, 2) - f * f * 0.06, 0.002 + f * 0.03]} rotation={[0, 0, (rn(i, 3) - 0.5) * 1.2]}><coneGeometry args={[0.005, 0.02 + 0.014 * rn(i, 4), 4]} />{M.steel({ col: "#a9a39a" })}</mesh>; })}
    {Array.from({ length: 12 }, (_, i) => { const x = -0.3 + rn(i, 5) * 0.6; if (x < sx) return null;
      return <mesh key={i} position={[x, 0.002, 0.007]} scale={[1.6, 0.8, 0.6]}><sphereGeometry args={[0.005, 10, 8]} /><meshStandardMaterial color="#5a4630" roughness={0.9} /></mesh>; })}
    {/* la tira doblada que pasa por el filo */}
    {tt > 0.4 && <FoilBall r={0.035} seed={7} p={[sx - 0.08 * Math.sin(Math.max(0, u - 0.62) * 30), 0.05, 0.01]} rot={[tt * 6, tt * 2, 0]} />}
    </group>
    {gl > 0 && gl < 1 && <><mesh position={[lerp(-0.33, 0.33, gl), 0.022, 0.004]}><sphereGeometry args={[0.007, 16, 12]} />{M.glow({ col: "#dfe8ff", op: 0.6 })}</mesh>
      <mesh position={[lerp(-0.33, 0.33, gl) - 0.08, 0.022, 0.004]}><boxGeometry args={[0.16, 0.003, 0.003]} />{M.glow({ col: "#dfe8ff", op: 0.45 })}</mesh></>}
    {<pointLight position={[lerp(-0.33, 0.33, gl), 0.03, 0.05]} intensity={0} distance={0.15} color="#ffffff" />}
  </>;
}}</Scene3D>;

// ---- 5:11 · CORTAN TELA COMO EN 1940: la tijera de mango negro avanza abriendo y cerrando sobre la tela de cuadritos, que se separa en dos ----
const gingham = () => tex.text("gingham", 256, 256, (g) => {
  g.fillStyle = "#fbf6ee"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 8; i++) { g.fillStyle = "rgba(196,48,42,.45)"; g.fillRect(i * 32, 0, 16, 256); g.fillRect(0, i * 32, 256, 16); }
});
export const HFabric1940: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0.04, 0.03, 0], az: [-0.2, -0.05], el: [0.5, 0.42], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="LIKE THEY DID IN 1940" col={AMB} /></>}>{(tt) => {
  const cut = eio(tt, 0.6, 4.8), x = lerp(-0.22, 0.24, cut), gap = 0.012 * cut;
  const mat = <meshStandardMaterial map={gingham()} roughness={0.95} side={THREE.DoubleSide} />;
  return <>
    {/* dos mitades: la parte cortada (detrás de la tijera) se separa */}
    {[1, -1].map((k) => <group key={k}>
      <mesh position={[(x - 0.25) / 2, 0.002, k * (0.08 + gap)]} rotation={[-PI / 2, 0, k * 0.02 * cut]}><planeGeometry args={[x + 0.25, 0.16]} />{mat}</mesh>
      <mesh position={[(x + 0.3) / 2, 0.002, k * 0.08]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.3 - x, 0.16]} />{mat}</mesh></group>)}
    <FoilSheet w={0.5} d={0.05} p={[0.02, 0.006, 0.0]} crumple={0.01} />
    
    <mesh position={[0.02, 0.0035, 0.008]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.53, 0.072]} /><meshBasicMaterial color="#000" transparent opacity={0.8} depthWrite={false} /></mesh>
    {cut > 0 && <FoilSheet w={Math.max(0.01, x + 0.23)} d={0.022} p={[(x - 0.23) / 2, 0.009, -0.045 - 0.01 * cut]} rot={[0, 0.05 * cut, 0]} crumple={0.08} />}
    <Shears p={[x - 0.03, 0.03, 0]} rot={[0, 0, 0.08]} s={1.6} dull={0.45} open={0.12 + 0.22 * Math.abs(Math.sin(tt * 4.5))} />
  </>;
}}</Scene3D>;

// ---- 5:27 · DOCE CUBIERTOS: la mesa de Navidad vista de arriba; doce platos aparecen alrededor con su cuchara y tenedor negros de sarro ----
export const HTwelve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" lamp={[0, 0.8, 0]}
  cam={{ at: [-0.04, 0.03, 0.04], az: [-0.1, 0.12], el: [0.62, 0.52], r: [0.78, 0.68], fov: 32 }}
  over={(tt) => { const n = Math.min(12, Math.max(0, Math.floor((tt - 0.5) / 0.3) + 1));
    return <><Head tt={tt} kick="" title="12 PLACE SETTINGS" col={AMB} />
      {n < 0 && null}
      </>; }}>{(tt) => <>
    <RBox s={[0.95, 0.03, 0.45]} p={[0, 0.015, 0]} r={0.01}><meshStandardMaterial color="#cdbf9f" roughness={0.9} /></RBox>
    <mesh position={[0, 0.031, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.85, 0.12]} /><meshStandardMaterial color="#9c2a24" roughness={0.9} /></mesh>
    <FoilSheet w={0.8} d={0.08} p={[0, 0.033, 0]} crumple={0.06} />
    {Array.from({ length: 12 }, (_, i) => { const k = phys(tt, 0.5 + i * 0.3, 8, 0.45); if (k <= 0) return null;
      const side = i < 6 ? 1 : -1, x = -0.36 + (i % 6) * 0.144, z = side * 0.15;
      return <group key={i} position={[x, 0.032 + (1 - cl(k)) * 0.15, z]} rotation={[0, side > 0 ? 0 : PI, 0]}>
        <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.002, 0]}><circleGeometry args={[0.062, 40]} />{M.porcelain({})}</mesh>
        <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.0025, 0]}><ringGeometry args={[0.052, 0.062, 40]} />{M.porcelain({ col: "#2f5fa8" })}</mesh>
        <mesh rotation={[-PI / 2, 0, 0]} position={[0.004, 0.0005, 0.006]}><circleGeometry args={[0.064, 40]} /><meshBasicMaterial color="#000" transparent opacity={0.3} depthWrite={false} /></mesh>
        <Spoon p={[0.075, 0.003, 0]} rot={[0, PI / 2, 0]} s={0.9} tarnish={1 - eio(tt, 1.0 + i * 0.3, 2.0 + i * 0.3)} />
        <Spoon p={[-0.075, 0.003, 0]} rot={[0, PI / 2, 0]} s={0.9} tarnish={1 - eio(tt, 1.1 + i * 0.3, 2.1 + i * 0.3)} fork /></group>; })}
  </>}</Scene3D>;

// ---- 6:02 · BURBUJEA Y HUELE A HUEVO: la fuente con el aluminio y los cubiertos; suben burbujas y unas cintas amarillas de olor que se mecen ----
export const HFizzEggs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="tile"
  cam={{ at: [0, 0.05, 0], az: [0.3, 0.1], el: [0.5, 0.42], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="FIZZ · A LITTLE EGGY" col={AMB} />
    <Tag tt={tt} at={3.6} x={1440} y={820} txt="THE TARNISH LEAVING" col={GRN} size={40} /></>}>{(tt) => {
  const smell = eio(tt, 1.6, 3.0);
  return <>
    <RBox s={[0.36, 0.006, 0.24]} p={[0, 0.003, 0]} r={0.003}>{M.glass({ op: 0.4 })}</RBox>
    {[[0, 0.035, 0.12, 0.36, 0.006], [0, 0.035, -0.12, 0.36, 0.006], [0.18, 0.035, 0, 0.006, 0.24], [-0.18, 0.035, 0, 0.006, 0.24]].map(([x, y, z, w, d], i) =>
      <RBox key={i} s={[w, 0.07, d]} p={[x, y, z]} r={0.003}>{M.glass({ op: 0.3 })}</RBox>)}
    <FoilSheet w={0.34} d={0.22} p={[0, 0.007, 0]} crumple={0.08} />
    {[0, 1, 2, 3].map((i) => <Spoon key={i} p={[-0.1 + i * 0.065, 0.009, 0.01 * (i % 2)]} rot={[0, PI / 2 + 0.1 * (i - 1.5), 0]} tarnish={0.75 - 0.4 * cl((tt - 1) / 5)} fork={i % 2 === 1} />)}
    <mesh position={[0, 0.045, 0]}><boxGeometry args={[0.35, 0.07, 0.23]} />{M.water({ op: 0.28 })}</mesh>
    {Array.from({ length: 90 }, (_, i) => { const y = ((tt * (0.05 + 0.04 * rn(i, 2)) + rn(i, 3)) % 1) * 0.07;
      return <mesh key={i} position={[-0.15 + rn(i, 4) * 0.3, 0.012 + y, -0.09 + rn(i, 5) * 0.18]}><sphereGeometry args={[0.004 + 0.004 * rn(i, 6), 10, 8]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} transmission={0.4} transparent opacity={0.85} clearcoat={1} /></mesh>; })}
    {smell > 0 && [0, 1, 2].map((k) => { const pts = Array.from({ length: 10 }, (_, i) => [-0.08 + k * 0.08 + Math.sin(i * 0.9 + tt * 2 + k) * 0.025, 0.09 + i * 0.022 * smell, 0]);
      return <mesh key={k} geometry={tubeG(`smell${k}_${Math.floor(tt * 15)}`, pts, 0.0035, 40, 6)}>{M.glow({ col: "#e8d86a", op: 0.55 * smell })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 6:19 · EL SARRO SE MUDA: puntitos negros salen de la cuchara en arco y aterrizan en el aluminio; la cuchara queda de plata y el aluminio, manchado ----
export const HMovedHouse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark"
  cam={{ at: [0, 0.03, 0], az: [-0.35, 0.2], el: [0.35, 0.28], r: [0.48, 0.4], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="SILVER → FOIL" col={ICE} />
    </>}>{(tt) => {
  const mv = cl((tt - 0.7) / 3.6);
  return <>
    <FoilSheet w={0.42} d={0.28} p={[0, 0, 0]} crumple={0.1} />
    {/* la mancha que va quedando en el aluminio */}
    <mesh position={[0.02, 0.002, 0.04]} rotation={[-PI / 2, 0, 0]} scale={[1.6, 1, 1]}><circleGeometry args={[0.06, 40]} /><meshStandardMaterial color="#3b2e22" transparent opacity={0.55 * mv} roughness={0.9} /></mesh>
    <Spoon p={[0, 0.03, -0.02]} rot={[0, 0.3, 0]} s={1.5} tarnish={1 - mv} />
    {Array.from({ length: 36 }, (_, i) => { const a = 0.7 + rn(i, 2) * 3.4, k = cl((tt - a) / 0.6); if (k <= 0 || k >= 1) return null;
      const x0 = -0.08 + rn(i, 3) * 0.16, z0 = -0.03 + rn(i, 4) * 0.03, x1 = -0.06 + rn(i, 5) * 0.16, z1 = 0.0 + rn(i, 6) * 0.09;
      return <mesh key={i} position={[lerp(x0, x1, k), 0.04 + Math.sin(k * PI) * 0.05 - k * 0.035, lerp(z0, z1, k)]}><sphereGeometry args={[0.0028, 8, 6]} /><meshStandardMaterial color="#2a2018" /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 6:37 · UNA TARDE ENTERA → 20 MINUTOS: el reloj marca una tarde entera de pulir; el gajo se achica a veinte minutos y en el lugar libre aparece una tarta ----
export const HAfternoon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.6, 0.3]}
  cam={{ at: [0.2, 0.1, 0], az: [-0.15, 0.15], el: [0.24, 0.2], r: [1.12, 1.0], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="DONE IN 20 MINUTES" col={GRN} />
    <Tag tt={tt} at={0.6} x={960} y={900} txt={tt < 2.6 ? "BY HAND · ALL AFTERNOON" : "FOIL BATH · 20 MIN"} col={tt < 2.6 ? RED : GRN} size={40} />
    </>}>{(tt) => {
  const span = lerp(PI * 2 * (4 / 12), PI * 2 * (20 / 720), eio(tt, 2.0, 3.4)), pie = phys(tt, 4.0, 6, 0.45);
  return <>
    <group position={[-0.12, 0.17, 0]} rotation={[PI / 2, 0, 0]}>
      <mesh><cylinderGeometry args={[0.15, 0.15, 0.02, 64]} />{M.brass({})}</mesh>
      <mesh position={[0, 0.011, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.135, 64]} /><meshStandardMaterial color="#f6efe0" roughness={0.6} /></mesh>
      <mesh position={[0, 0.013, 0]} rotation={[-PI / 2, 0, PI / 2]}><circleGeometry args={[0.125, 64, -span, span]} /><meshStandardMaterial color={tt < 2.6 ? "#d9473a" : "#4fb36a"} transparent opacity={0.8} /></mesh>
      {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.118, 0.014, Math.sin(a) * 0.118]} rotation={[-PI / 2, 0, -a]}><planeGeometry args={[0.016, 0.004]} /><meshStandardMaterial color="#2a221a" /></mesh>; })}
      <mesh position={[0, 0.016, 0]}><cylinderGeometry args={[0.008, 0.008, 0.006, 20]} />{M.brass({})}</mesh>
      <group position={[0, 0.018, 0]} rotation={[0, -tt * 5, 0]}><mesh position={[0.05, 0, 0]}><boxGeometry args={[0.1, 0.003, 0.007]} /><meshStandardMaterial color="#2a221a" /></mesh></group>
      <group position={[0, 0.019, 0]} rotation={[0, -tt * 0.42, 0]}><mesh position={[0.032, 0, 0]}><boxGeometry args={[0.064, 0.004, 0.01]} /><meshStandardMaterial color="#2a221a" /></mesh></group>
    </group>
    {pie > 0 && <group position={[0.22 + (1 - cl(pie)) * 0.4, 0.0, 0.02]} rotation={[0, (tt - 4) * 0.9, 0]} scale={1 + 0.15 * eio(tt, 4.6, 6.2)}><Pie p={[0, 0, 0]} s={1.1} edge={0.45 - 0.3 * eio(tt, 4.6, 6.2)} mid={0.9} fill="#c4682a" /></group>}
  </>;
}}</Scene3D>;
