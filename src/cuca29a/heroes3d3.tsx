// cuca29a · vuelta 3 del EVALUADOR sobre los 8 primeros en 3D: odómetro y calendario REDISEÑADOS (se estancaron),
// los otros 6 con el cambio concreto que pidió (objeto más grande y de cerca, el vapor/chorro que faltaba, sin carteles).
import React from "react";
import * as THREE from "three";
import { cl, eio, H, Head, lerp, MZ, phys, Stage, Tag } from "./ckit";
import { ctex, Estudio, fall, Frijol, lathe, M, papel, RBox, rn, V3, Vapor, Yute } from "./estudio3d";
import { Chorro, Olla, Onda, Plato } from "./kit3d";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;

// ── 13 · COSTALES v3: los costales quedan atrás; adelante, de cerca, dos tazones de vidrio: el frijol de 2025 sigue entero y duro, el de 2026 se abre
const costalGeo = lathe([[0, 0], [0.38, 0.02], [0.52, 0.22], [0.56, 0.6], [0.5, 0.92], [0.3, 1.08], [0.17, 1.13], [0.21, 1.2], [0.27, 1.27]]);
const tazonGeo = lathe([[0, 0], [0.3, 0], [0.5, 0.12], [0.6, 0.3], [0.62, 0.34]]);
const H3Costales: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const hv = eio(tt, 2.6, 5.0);
  return <>
    <Estudio t={tt} cam={[0, 1.55, 3.0]} look={[0, 0.3, 0.2]} orbit={0.12}>
      {[-1, 1].map((s, i) => <group key={s} position={[s * 1.25, fall(tt, 0.1 + i * 0.25, 1.6), -1.0]} rotation={[0, -s * 0.3, 0]}>
        <mesh geometry={costalGeo} castShadow receiveShadow scale={[1, 1, 0.82]}><Yute /></mesh>
        <mesh position={[0, 0.62, 0.47]}><planeGeometry args={[0.62, 0.34]} /><meshStandardMaterial map={papel("cos" + i, [i ? "2026" : "2025"], { size: 150 })} roughness={0.9} /></mesh></group>)}
      {[-1, 1].map((s, i) => { const nuevo = i === 1; return <group key={"t" + s} position={[s * 0.68, 0, 0.45]}>
        <mesh geometry={tazonGeo} castShadow receiveShadow>{M.vidrio()}</mesh>
        {Array.from({ length: 18 }, (_, j) => { const a = rn(j + i * 50, 1) * 6.28, r = Math.sqrt(rn(j + i * 50, 2)) * 0.36, at = 0.9 + j * 0.05 + i * 0.3;
          const bump = !nuevo && hv > 0.3 ? Math.abs(Math.sin((tt - 3) * 8 + j)) * 0.04 : 0;
          return tt < at - 0.35 ? null : <Frijol key={j} p={[Math.cos(a) * r, 0.07 + (j % 3) * 0.06 + fall(tt, at, 0.9) + bump, Math.sin(a) * r]} rot={[rn(j, 3) * 3, rn(j, 4) * 6, 0]} s={0.085}
            hinchado={nuevo ? hv : -0.15} c={nuevo ? "#7a3322" : "#3e160f"} />; })}
        {nuevo && <mesh position={[0, 0.05 + 0.12 * hv, 0]}><cylinderGeometry args={[0.45, 0.32, 0.12 * hv + 0.001, 32]} />{M.liquido("#7a4a34", 0.85 * hv)}</mesh>}
      </group>; })}
      <Vapor t={tt} p={[0.68, 0.3, 0.45]} o={0.38 * hv} h={1.0} s={0.3} spread={0.4} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 13" title="NUNCA MEZCLAR COSTALES" />
  </>;
}}</Stage>;

// ── 14 · OLLA EXPRÉS v3: olla en CORTE (se ve el agua hasta 2/3 con el frijol), manómetro grande al frente que sube, válvula que sisea un chorro de vapor
const dialTex = () => ctex("dial3", 512, 512, (g) => {
  g.fillStyle = "#f4f1ea"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill();
  const arc = (a0: number, a1: number, c: string) => { g.strokeStyle = c; g.lineWidth = 50; g.beginPath(); g.arc(256, 256, 186, a0, a1); g.stroke(); };
  arc(P * 0.75, P * 1.75, "#d9d4c8"); arc(P * 1.75, P * 2.05, "#3f9a4a"); arc(P * 2.05, P * 2.25, "#c0392b");
  g.strokeStyle = "#333"; g.lineWidth = 8; for (let i = 0; i <= 10; i++) { const a = P * 0.75 + (i / 10) * P * 1.5; g.beginPath(); g.moveTo(256 + Math.cos(a) * 150, 256 + Math.sin(a) * 150); g.lineTo(256 + Math.cos(a) * 120, 256 + Math.sin(a) * 120); g.stroke(); }
  g.strokeStyle = "#8a857c"; g.lineWidth = 16; g.beginPath(); g.arc(256, 256, 244, 0, 7); g.stroke();
});
const corteGeo = new THREE.LatheGeometry([[0, 0], [0.66, 0], [0.7, 0.04], [0.7, 0.74], [0.73, 0.78]].map(([r, y]) => new THREE.Vector2(r, y)), 48, P2 * 0.5, P * 1.5);
const tapaGeo = new THREE.LatheGeometry([[0.74, 0], [0.7, 0.06], [0.5, 0.14], [0.2, 0.18], [0.001, 0.18]].map(([r, y]) => new THREE.Vector2(r, y)), 48, P2 * 0.5, P * 1.5);
const H3Manometro: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const n = phys(tt, 1.6, 3.2, 0.32), ang = lerp(P * 0.75, P * 1.92, cl(n)) + 0.03 * Math.sin(tt * 18) * cl(tt - 3.0);
  const silba = cl((tt - 3.0) * 2), ring = cl((tt - 1.0) * 1.8), lvl = eio(tt, 0.4, 1.4);
  return <>
    <Estudio t={tt} cam={[0.35, 1.7, 3.7]} look={[0.2, 0.75, 0]} orbit={0.14}>
      <group position={[-0.35, 0, 0]} rotation={[0, -0.5, 0]}>
        <mesh position={[0, 0.03 + 0.25 * lvl, 0]}><cylinderGeometry args={[0.69, 0.69, 0.5 * lvl + 0.001, 48, 1, false, P2 * 0.5, P * 1.5]} />{M.liquido("#b9a07a", 0.8)}</mesh>
        {Array.from({ length: 34 }, (_, i) => { const a = P2 * 0.5 + rn(i, 1) * P * 1.5, r = Math.sqrt(rn(i, 2)) * 0.6; return <Frijol key={i} p={[Math.sin(a) * r, 0.06 + (i % 4) * 0.06, Math.cos(a) * r]} rot={[rn(i, 3), rn(i, 4) * 6, 0]} s={0.06} hinchado={0.3} />; })}
        <mesh geometry={corteGeo} castShadow receiveShadow>{M.cromo()}</mesh>
        <mesh geometry={tapaGeo} position={[0, 0.78, 0]} castShadow>{M.cromo("#c9ccd1")}</mesh>
        {/* raya de los 2/3: anillo dorado por adentro que se enciende */}
        <mesh position={[0, 0.53, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.69, 0.016, 8, 64, P * 1.5]} /><meshStandardMaterial color="#ffc04a" emissive="#ffb030" emissiveIntensity={2 * ring} /></mesh>
        <group position={[0.18, 0.98, 0.1]} rotation={[0.3 * silba * Math.sin(tt * 26), 0, 0.3 * silba * Math.cos(tt * 23)]}>
          <mesh position={[0, 0.08, 0]} castShadow><cylinderGeometry args={[0.06, 0.07, 0.16, 16]} />{M.cromo("#8a8d93")}</mesh></group>
        {/* chorro de vapor que sisea */}
        {Array.from({ length: 22 }, (_, i) => { const per = 0.9, k = ((tt * 1.6 + i / 22) % per) / per; return <sprite key={i} position={[0.18 + k * 0.35, 1.15 + k * 1.3, 0.1 + k * 0.1]} scale={[0.08 + k * 0.6, 0.08 + k * 0.6, 1]}>
          <spriteMaterial color="#ffffff" transparent opacity={0.55 * silba * (1 - k)} depthWrite={false} /></sprite>; })}
      </group>
      {/* manómetro grande, al frente */}
      <group position={[0.95, 0.95, 0.55]} rotation={[-0.12, -0.25, 0]} scale={1.7}>
        <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.08, 48]} />{M.cromo()}</mesh>
        <mesh position={[0, 0, 0.041]}><circleGeometry args={[0.27, 48]} /><meshStandardMaterial map={dialTex()} roughness={0.5} /></mesh>
        <mesh position={[0, 0, 0.06]} rotation={[0, 0, -ang + P2]}><boxGeometry args={[0.022, 0.44, 0.01]} /><meshStandardMaterial color="#c0392b" roughness={0.4} /></mesh>
        <mesh position={[0, 0, 0.065]}><circleGeometry args={[0.03, 20]} /><meshStandardMaterial color="#222" /></mesh>
        <mesh position={[0, 0.03, 0.07]}><circleGeometry args={[0.27, 48]} />{M.vidrio()}</mesh>
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 14" title="LA OLLA EXPRÉS, SIN MIEDO" />
    <Tag tt={tt} at={1.6} x={560} y={560} txt="HASTA 2/3" col={MZ} size={50} />
  </>;
}}</Stage>;

// ── 16 · CAPAS v3: vista de arriba de la sartén: la manteca se derrite y chisporrotea, caen aros de cebolla que se doran, después el frijol entero con su brillo
const sartenGeo = lathe([[0, 0], [0.86, 0], [0.98, 0.16], [1.02, 0.2]]);
const H3Capas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const mel = eio(tt, 0.9, 2.2), fr = tt - 4.0;
  return <>
    <Estudio t={tt} cam={[0, 3.3, 1.5]} look={[0, 0, 0.05]} orbit={0.2}>
      <mesh geometry={sartenGeo} castShadow receiveShadow><meshStandardMaterial color="#1c1a19" roughness={0.42} metalness={0.65} side={THREE.DoubleSide} /></mesh>
      <RBox p={[1.55, 0.17, 0]} s={[1.1, 0.07, 0.16]} r={0.03}><meshStandardMaterial color="#1c1a19" roughness={0.5} metalness={0.6} /></RBox>
      {mel < 0.98 && <RBox p={[0, lerp(0.12, 0.03, mel) + fall(tt, 0.2, 1.3), 0]} s={[0.42, lerp(0.22, 0.02, mel), 0.3]} r={0.04}><meshPhysicalMaterial color="#f4ecd2" roughness={0.35} clearcoat={0.5} /></RBox>}
      <mesh position={[0, 0.025, 0]} scale={[lerp(0.2, 0.86, mel), 1, lerp(0.2, 0.86, mel)]}><cylinderGeometry args={[1, 1, 0.01, 48]} /><meshPhysicalMaterial color="#e8c46a" roughness={0.04} clearcoat={1} transparent opacity={0.8 * mel} /></mesh>
      {/* chisporroteo: gotitas que saltan */}
      {Array.from({ length: 14 }, (_, i) => { const k = ((tt * 1.8 + rn(i, 1)) % 1); return <mesh key={"c" + i} position={[(rn(i, 2) - 0.5) * 1.4, 0.03 + Math.sin(k * P) * 0.25 * mel, (rn(i, 3) - 0.5) * 1.4]} scale={0.001 + 0.012 * mel}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#fff0c0" toneMapped={false} /></mesh>; })}
      {/* aros de cebolla: translúcidos, se doran */}
      {Array.from({ length: 9 }, (_, i) => { const at = 2.3 + i * 0.12, gold = eio(tt, at + 0.4, at + 2.0), a = rn(i, 4) * 6.28, r = 0.15 + rn(i, 5) * 0.5;
        return tt < at - 0.3 ? null : <mesh key={"o" + i} position={[Math.cos(a) * r, 0.05 + fall(tt, at, 1.0), Math.sin(a) * r]} rotation={[P2 + (rn(i, 6) - 0.5) * 0.3, 0, 0]} castShadow>
          <torusGeometry args={[0.1 + rn(i, 7) * 0.06, 0.022, 10, 28]} /><meshPhysicalMaterial color={new THREE.Color("#f4f1e8").lerp(new THREE.Color("#c98a3a"), gold)} roughness={0.2} transmission={0.35 * (1 - gold)} transparent opacity={0.92} clearcoat={0.6} /></mesh>; })}
      {Array.from({ length: 34 }, (_, i) => { const at = 4.0 + i * 0.03, a = rn(i, 8) * 6.28, r = Math.sqrt(rn(i, 9)) * 0.72;
        return tt < at - 0.3 ? null : <Frijol key={"f" + i} p={[Math.cos(a) * r, 0.08 + fall(tt, at, 1.1), Math.sin(a) * r]} rot={[rn(i, 10) * 3, rn(i, 11) * 6, 0]} s={0.07} c="#5e2216" hinchado={0.45} />; })}
      <Vapor t={tt} p={[0, 0.1, 0]} o={0.2 * mel + 0.35 * cl(fr)} h={1.4} s={0.45} spread={1.0} n={14} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 16" title="PRIMERO LA MANTECA, BIEN CALIENTE" />
  </>;
}}</Stage>;

// ── 19 · FRASCO v3: la cazuela se inclina y vierte el caldo ámbar en el frasco (salpica y sube), la tapa gira y la etiqueta se pega
const frascoGeo = lathe([[0, 0], [0.4, 0], [0.44, 0.05], [0.45, 0.8], [0.38, 0.92], [0.36, 1.02], [0.37, 1.06]]);
const caldoGeo = lathe([[0, 0], [0.39, 0], [0.42, 0.04], [0.425, 1]]);
const H3Frasco: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const tilt = eio(tt, 0.9, 1.7) * (1 - eio(tt, 4.0, 4.7)), pour = cl((tt - 1.5) * 4) * (1 - cl((tt - 4.0) * 4)), lvl = eio(tt, 1.6, 4.0);
  const tapa = eio(tt, 4.6, 5.3), et = phys(tt, 5.4, 7, 0.4);
  return <>
    <Estudio t={tt} cam={[0.2, 1.8, 4.0]} look={[0, 0.9, 0]} orbit={0.14}>
      <group position={[0.45, fall(tt, 0.05, 1.3), 0]}>
        <mesh geometry={caldoGeo} scale={[1, Math.max(0.001, lvl * 0.78), 1]} position={[0, 0.02, 0]}>{M.liquido("#b9782e", 0.88)}</mesh>
        <mesh geometry={frascoGeo} castShadow receiveShadow>{M.vidrio()}</mesh>
        <mesh position={[0, lerp(1.9, 1.08, tapa), 0]} rotation={[0, -tapa * 7, 0]} castShadow visible={tapa > 0.01}><cylinderGeometry args={[0.39, 0.39, 0.1, 40]} />{M.cromo("#c8a84a")}</mesh>
        <mesh position={[0, 0.5, 0.455]} scale={[lerp(1.4, 1, cl(et)), lerp(1.4, 1, cl(et)), 1]} rotation={[0, 0, -0.04]} visible={et > 0.01}>
          <planeGeometry args={[0.6, 0.3]} /><meshStandardMaterial map={papel("caldo3", ["CALDO", "lunes"], { size: 88, bg: "#efe2b4" })} roughness={0.9} /></mesh>
        <Onda p={[0, 0.06 + 0.62 * lvl, 0]} t={tt} a={1.7} r={0.4} /><Onda p={[0, 0.06 + 0.62 * lvl, 0]} t={tt} a={2.6} r={0.4} /><Onda p={[0, 0.06 + 0.62 * lvl, 0]} t={tt} a={3.4} r={0.4} />
        {pour > 0.05 && Array.from({ length: 10 }, (_, i) => { const k = (tt * 3 + rn(i, 1)) % 1; return <mesh key={i} position={[Math.cos(i) * k * 0.25, 0.06 + 0.62 * lvl + Math.sin(k * P) * 0.18, Math.sin(i) * k * 0.25]} scale={0.02 * (1 - k)}><sphereGeometry args={[1, 8, 6]} />{M.liquido("#c98a3a")}</mesh>; })}
      </group>
      <group position={[-0.5, 1.55, 0]} rotation={[0, 0, -tilt * 1.15]}>
        <Olla p={[-0.55, -0.62, 0]} s={0.75} nivel={0.7 * (1 - lvl * 0.7)} caldo="#9a5a24" t={tt} />
      </group>
      {pour > 0.01 && <Chorro a={[-0.05, 1.5, 0]} b={[0.45, 0.08 + 0.62 * lvl, 0]} r={0.045 * pour} c="#c98a3a" o={0.92} />}
      <Vapor t={tt} p={[0.45, 1.0, 0]} o={0.3 * (1 - tapa)} h={0.8} s={0.28} spread={0.25} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 19" title="EL CALDO SE GUARDA APARTE" />
  </>;
}}</Stage>;

// ── 20 · LICUADORA v3: licuadora de verdad (base, perilla, vaso con tapa, aspas que se ven); remolino; después el chorro cruza la coladera y la cáscara queda en la malla
const baseGeo = lathe([[0, 0], [0.5, 0], [0.48, 0.1], [0.36, 0.5], [0.34, 0.56]]);
const vasoGeo = lathe([[0, 0], [0.26, 0], [0.3, 0.05], [0.4, 1.0], [0.42, 1.05]]);
const H3Licuadora: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const run = cl((tt - 1.0) * 3) * (1 - cl((tt - 3.3) * 3)), cream = eio(tt, 1.5, 3.1), tilt = eio(tt, 3.6, 4.4) * (1 - eio(tt, 6.2, 6.8));
  const flow = cl((tt - 4.3) * 3) * (1 - cl((tt - 6.0) * 3)), bowl = eio(tt, 4.4, 6.0), drop = fall(tt, 0.1, 1.5);
  const col = new THREE.Color("#5a2418").lerp(new THREE.Color("#7a4028"), cream);
  return <>
    <Estudio t={tt} cam={[0.35, 1.9, 3.9]} look={[0.3, 0.85, 0]} orbit={0.13}>
      <group position={[-0.65, drop, 0]}>
        <mesh geometry={baseGeo} castShadow receiveShadow><meshPhysicalMaterial color="#d8d2c4" roughness={0.3} clearcoat={0.6} /></mesh>
        <mesh position={[0, 0.28, 0.43]} rotation={[0.35, 0, run * 1.2]}><cylinderGeometry args={[0.09, 0.09, 0.06, 20]} />{M.cromo()}</mesh>
        <group position={[0, 0.56, 0]} rotation={[0, 0, -tilt * 1.25]}>
          <group position={[tilt * 0.2, tilt * 0.55, 0]}>
            <mesh position={[0, 0.06 + 0.32 * (1 - bowl * 0.85) * 0.5, 0]} rotation={[0, tt * 9 * run, 0]}><cylinderGeometry args={[0.34, 0.27, Math.max(0.001, 0.32 * (1 - bowl * 0.85)), 32]} />{M.liquido("#" + col.getHexString(), 0.15 + 0.8 * cream)}</mesh>
            {Array.from({ length: 28 }, (_, i) => { const a = rn(i, 1) * 6.28 + tt * 8 * run, r = 0.06 + rn(i, 2) * 0.24 * (0.6 + 0.4 * Math.sin(tt * 3 + i)), y = 0.12 + rn(i, 3) * 0.45 + 0.18 * Math.sin(tt * 6 + i) * run;
              return cream > 0.85 ? null : <Frijol key={i} p={[Math.cos(a) * r, y, Math.sin(a) * r]} rot={[a, i, 0]} s={0.05 * (1 - cream * 0.8)} c="#5a2418" />; })}
            {[0, 1, 2, 3].map((k) => <mesh key={k} position={[0, 0.09, 0]} rotation={[0.25 * (k % 2 ? 1 : -1), tt * 40 * run + k * P2, 0]}><boxGeometry args={[0.44, 0.012, 0.07]} />{M.cromo()}</mesh>)}
            <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.05, 0.05, 0.06, 16]} />{M.cromo()}</mesh>
            <mesh geometry={vasoGeo} castShadow>{M.vidrio()}</mesh>
            <mesh position={[0.43, 0.6, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.2, 0.035, 8, 20, P]} />{M.vidrio()}</mesh>
            <mesh position={[0, 1.08, 0]}><cylinderGeometry args={[0.44, 0.44, 0.07, 32]} /><meshStandardMaterial color="#1a1a1a" roughness={0.5} /></mesh>
          </group>
        </group>
      </group>
      <group position={[1.05, 0, 0.35]}>
        <mesh geometry={lathe([[0, 0], [0.5, 0], [0.62, 0.22], [0.64, 0.26]])} castShadow receiveShadow>{M.barro("#2f5d7a")}</mesh>
        <mesh position={[0, 0.06, 0]} scale={[0.58 * bowl + 0.001, 1, 0.58 * bowl + 0.001]}><cylinderGeometry args={[1, 1, 0.1, 40]} />{M.liquido("#7a4028", 0.97)}</mesh>
        <mesh position={[0, 0.58, 0]} rotation={[P, 0, 0]}><sphereGeometry args={[0.5, 28, 14, 0, 6.28, 0, P2]} /><meshStandardMaterial color="#c8ccd2" metalness={0.9} roughness={0.3} wireframe /></mesh>
        <mesh position={[0, 0.59, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.5, 0.025, 8, 40]} />{M.cromo()}</mesh>
        {Array.from({ length: 26 }, (_, i) => { const k = eio(tt, 4.6 + i * 0.05, 5.9); const a = rn(i, 4) * 6.28, r = rn(i, 5) * 0.3;
          return <mesh key={i} position={[Math.cos(a) * r, 0.18 + rn(i, 6) * 0.05, Math.sin(a) * r]} rotation={[rn(i, 7) * 3, 0, rn(i, 8)]} scale={0.001 + k}><sphereGeometry args={[0.05, 10, 6, 0, 3.6]} /><meshStandardMaterial color="#2a0e08" roughness={0.6} side={THREE.DoubleSide} /></mesh>; })}
      </group>
      {flow > 0.01 && <Chorro a={[0.5, 1.4, 0.2]} b={[1.05, 0.6, 0.35]} r={0.05 * flow} c="#7a4028" o={0.96} />}
    </Estudio>
    <Head tt={tt} kick="TRUCO 20" title="COLADOS, PARA ENFRIJOLADAS" />
  </>;
}}</Stage>;

// ── 21 · CALENDARIO v3 (rediseño): el tazón tapado entra al refri; en el calendario de pared una pluma encierra 1, 2, 3, 4 y tacha el 5
const calTex = (n: number) => ctex("cal" + n, 768, 560, (g) => {
  g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, 768, 560); g.fillStyle = "#8a2f24"; g.fillRect(0, 0, 768, 110);
  g.fillStyle = "#f6f1e4"; g.font = "900 70px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("OCTUBRE", 384, 58);
  g.fillStyle = "#2a1c12"; g.font = "900 110px Georgia, serif";
  for (let d = 1; d <= 6; d++) { const x = 128 + ((d - 1) % 3) * 256, y = 215 + Math.floor((d - 1) / 3) * 220; g.fillText(String(d), x, y);
    if (d <= 4 && n >= d) { g.strokeStyle = "#1f5fa8"; g.lineWidth = 11; g.beginPath(); g.ellipse(x, y, 92, 80, -0.1, 0.2, 6.6); g.stroke(); }
    if (d === 5 && n >= 5) { g.strokeStyle = "#c0392b"; g.lineWidth = 16; g.beginPath(); g.moveTo(x - 80, y - 75); g.lineTo(x + 80, y + 75); g.moveTo(x + 80, y - 75); g.lineTo(x - 80, y + 75); g.stroke(); } }
  g.strokeStyle = "rgba(0,0,0,.15)"; g.lineWidth = 3; for (let i = 1; i < 3; i++) { g.beginPath(); g.moveTo(i * 256, 110); g.lineTo(i * 256, 560); g.stroke(); } g.beginPath(); g.moveTo(0, 325); g.lineTo(768, 325); g.stroke();
});
const H3Calendario: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const marks = [2.0, 2.8, 3.6, 4.4, 5.4], n = marks.filter((m) => tt > m).length, door = eio(tt, 0.3, 1.0) * (1 - eio(tt, 1.9, 2.4)), slide = eio(tt, 0.9, 1.7);
  const pen = n < 5 ? n : 4, px = -0.45 + 0.45 * (pen % 3), py = 0.116 - 0.393 * Math.floor(pen / 3);
  return <>
    <Estudio t={tt} cam={[0.1, 1.5, 4.2]} look={[0.1, 1.05, 0]} orbit={0.1}>
      <RBox p={[-0.95, 1.0, -0.4]} s={[1.3, 2.1, 0.8]} r={0.08}><meshStandardMaterial color="#eef0ee" roughness={0.3} /></RBox>
      <mesh position={[-0.95, 1.0, 0.005]}><planeGeometry args={[1.16, 1.96]} /><meshStandardMaterial color="#cfe2ee" emissive="#bfe4ff" emissiveIntensity={0.6 * door} /></mesh>
      <group position={[-1.6, 1.0, 0.02]} rotation={[0, -door * 1.7, 0]}><RBox p={[0.65, 0, 0]} s={[1.3, 2.1, 0.08]} r={0.06}><meshStandardMaterial color="#e8eceb" roughness={0.3} /></RBox>
        <RBox p={[1.15, 0, 0.07]} s={[0.05, 0.7, 0.06]} r={0.02}>{M.cromo()}</RBox></group>
      <group position={[lerp(0.4, -0.95, slide), lerp(0.02, 0.55, slide), lerp(0.8, -0.2, slide)]} visible={door > 0.05 || slide < 0.99}>
        <mesh geometry={lathe([[0, 0], [0.2, 0], [0.3, 0.12], [0.32, 0.2]])} castShadow><meshStandardMaterial color="#e8dcc4" roughness={0.4} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.29, 0.22, 0.1, 24]} />{M.liquido("#5a2a1a")}</mesh>
        <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.33, 0.33, 0.02, 28]} />{M.vidrio()}</mesh>
      </group>
      <group position={[0.7, 1.2, -0.5]} scale={1.35}>
        <RBox p={[0, 0, -0.02]} s={[1.42, 1.06, 0.02]} r={0.01}><meshStandardMaterial color="#c9a06a" /></RBox>
        <mesh><planeGeometry args={[1.36, 1.0]} /><meshStandardMaterial map={calTex(n)} roughness={0.85} /></mesh>
        <group position={[px - 0.18, py + 0.21 + 0.04 * Math.sin(tt * 12) * (tt > 1.8 ? 1 : 0), 0.12]} rotation={[0, 0, 0.7]} visible={tt > 1.6}>
          <mesh castShadow><cylinderGeometry args={[0.03, 0.03, 0.5, 12]} /><meshStandardMaterial color={n >= 4 ? "#c0392b" : "#1f5fa8"} roughness={0.4} /></mesh>
          <mesh position={[0, -0.28, 0]}><coneGeometry args={[0.03, 0.07, 12]} /><meshStandardMaterial color="#222" /></mesh></group>
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 21" title="EN EL REFRI: 3 O 4 DÍAS" />
  </>;
}}</Stage>;

// ── 24 · CUENTA v3 (rediseño): el kilo de frijol se vacía en la olla; de la olla salen platos servidos que se acomodan en dos filas
//      y un marcador de tarjetas (de las que voltean) cuenta 1…14 con cada plato
const flipTex = (n: number) => papel("flip" + n, [String(n)], { w: 256, h: 256, size: 200, ink: "#f4ead2", bg: "#1c1a18", font: "900 200px Georgia, serif" });
const H3Odometro: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const bag = eio(tt, 0.3, 1.0), tip = eio(tt, 1.0, 1.6), N = 14, at = (i: number) => 1.9 + i * 0.32, n = Array.from({ length: N }, (_, i) => tt > at(i) + 0.3).filter(Boolean).length;
  const fl = cl((tt - (at(n - 1) + 0.3)) * 5);
  const pos = (i: number): V3 => [-1.55 + (i % 7) * 0.52, 0.0, 0.25 + Math.floor(i / 7) * 0.62];
  return <>
    <Estudio t={tt} cam={[0, 2.5, 3.9]} look={[0, 0.35, 0.2]} orbit={0.12}>
      <Olla p={[0, 0, -0.9]} s={0.8} nivel={0.6} frijol={22} t={tt} hervor={0.3} />
      <group position={[lerp(-2.0, -0.35, bag), 1.25, -0.9]} rotation={[0, 0, -tip * 2.2]}>
        <mesh scale={[0.32, 0.42, 0.22]} castShadow><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#e8dcc0" roughness={0.75} /></mesh>
        <mesh position={[0, 0, 0.215]}><planeGeometry args={[0.34, 0.2]} /><meshStandardMaterial map={papel("kg", ["1 kg"], { size: 140 })} roughness={0.9} /></mesh>
      </group>
      {tip > 0.3 && tip < 0.99 && Array.from({ length: 12 }, (_, i) => { const k = (tt * 3 + i / 12) % 1; return <Frijol key={i} p={[-0.25 + k * 0.1, 1.05 - k * 0.6, -0.9]} s={0.05} />; })}
      {Array.from({ length: N }, (_, i) => { const a = at(i); if (tt < a) return null; const k = eio(tt, a, a + 0.45), p = pos(i);
        const q: V3 = [lerp(0, p[0], k), lerp(0.6, 0, k) + Math.sin(k * P) * 0.18, lerp(-0.9, p[2], k)];
        return <Plato key={i} p={q} s={0.55}><mesh position={[0, 0.06, 0]} scale={[1, 0.4, 1]} castShadow><sphereGeometry args={[0.26, 16, 10]} /><meshPhysicalMaterial color="#5a2418" roughness={0.3} clearcoat={0.6} /></mesh></Plato>; })}
      {/* marcador de tarjetas */}
      <group position={[1.75, 0.0, -0.75]}>
        <RBox p={[0, 0.45, 0]} s={[0.7, 0.9, 0.3]} r={0.04}>{M.madera("#3a2a1c")}</RBox>
        <mesh position={[0, 0.5, 0.152]}><planeGeometry args={[0.56, 0.56]} /><meshStandardMaterial map={flipTex(n)} roughness={0.5} /></mesh>
        <group position={[0, 0.5 + 0.28, 0.16]} rotation={[-(1 - fl) * P, 0, 0]} visible={fl < 0.98 && n > 0}>
          <mesh position={[0, -0.28, 0]}><planeGeometry args={[0.56, 0.56]} /><meshStandardMaterial map={flipTex(n)} roughness={0.5} side={THREE.DoubleSide} /></mesh></group>
        <mesh position={[0, 0.5, 0.165]}><boxGeometry args={[0.58, 0.008, 0.01]} /><meshStandardMaterial color="#000" /></mesh>
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 24" title="LA CUENTA: UN KILO RINDE…" />
    <Tag tt={tt} at={at(N - 1) + 0.5} x={1500} y={300} txt="14 PLATOS" col={MZ} size={64} />
  </>;
}}</Stage>;

// ── 25 · CAJÓN v3: del cajón sale la libreta de tapas de tela con su listón; se abre a cámara entera y la frase se subraya a mano
const H3Cajon: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const op = eio(tt, 0.4, 1.4), up = eio(tt, 1.5, 2.4), cov = eio(tt, 2.5, 3.3), ul = eio(tt, 4.0, 4.9);
  const pag = ctex("libreta3", 1024, 640, (g) => {
    g.fillStyle = "#f3ead2"; g.fillRect(0, 0, 1024, 640); g.strokeStyle = "rgba(80,110,160,.25)"; g.lineWidth = 3; for (let y = 90; y < 640; y += 70) { g.beginPath(); g.moveTo(40, y); g.lineTo(984, y); g.stroke(); }
    g.fillStyle = "#1e2a4a"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `700 64px Caveat, "Segoe Script", cursive`; g.fillText("Los frijoles…", 512, 190);
    g.font = `700 150px Caveat, "Segoe Script", cursive`; g.fillText("un día antes", 512, 380);
  });
  return <>
    <Estudio t={tt} cam={[0, 2.0, 3.6]} look={[0, 0.95, 0.4]} orbit={0.1}>
      <RBox p={[0, 0.6, -0.8]} s={[2.8, 1.2, 1.2]} r={0.05}><meshStandardMaterial color="#6a4428" roughness={0.75} /></RBox>
      <group position={[0, 0.82, -0.8 + op * 0.7]}>
        <RBox p={[0, 0, 0.62]} s={[1.6, 0.34, 0.06]} r={0.03}><meshStandardMaterial color="#8a5a34" roughness={0.7} /></RBox>
        <mesh position={[0, 0, 0.67]}><sphereGeometry args={[0.05, 16, 10]} />{M.cromo("#c9a64a")}</mesh>
      </group>
      <group position={[0, lerp(0.8, 1.12, up), lerp(-0.5, 0.55, up) + op * 0.7 * (1 - up)]} rotation={[lerp(-P2, -0.62, up), 0, 0]}>
        <mesh position={[0, 0, -0.014]} castShadow><boxGeometry args={[1.32, 0.86, 0.024]} /><meshStandardMaterial color="#2f4a5e" roughness={0.95} /></mesh>
        <mesh position={[0, 0, 0.001]}><planeGeometry args={[1.26, 0.8]} /><meshStandardMaterial map={pag} roughness={0.9} /></mesh>
        <mesh position={[-0.49 + 0.49 * ul, -0.16, 0.004]} scale={[Math.max(0.001, ul), 1, 1]}><planeGeometry args={[0.98, 0.022]} /><meshBasicMaterial color="#b8281c" /></mesh>
        <mesh position={[0.48, -0.5, 0.004]} rotation={[0, 0, 0.12]}><planeGeometry args={[0.06, 0.3]} /><meshStandardMaterial color="#b8281c" roughness={0.8} /></mesh>
        <group position={[0, 0.43, 0.016]} rotation={[cov * 2.95, 0, 0]}>
          <mesh position={[0, -0.43, 0]} castShadow><boxGeometry args={[1.32, 0.86, 0.024]} /><meshStandardMaterial color="#2f4a5e" roughness={0.95} /></mesh>
        </group>
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 25" title="LOS FRIJOLES, UN DÍA ANTES" />
  </>;
}}</Stage>;

export const MAP3C: Record<string, C> = { costales: H3Costales, manometro: H3Manometro, capas: H3Capas, frasco: H3Frasco, licuadora: H3Licuadora, calendario: H3Calendario, odometro: H3Odometro, cajon: H3Cajon };
