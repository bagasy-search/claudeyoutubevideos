// cuca29a · vuelta 2 del EVALUADOR: los 8 componentes que eran vector plano pasan a bodegón 3D (estudio3d).
// Cada uno: OBJETO reconocible sin leer, llegada de a uno con peso, momento wow en la palabra clave, un solo rótulo.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, Head, lerp, MZ, phys, RED, Stage, Tag, TX } from "./ckit";
import { ctex, Estudio, fall, Frijol, lathe, M, papel, RBox, rn, Vapor, Yute } from "./estudio3d";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI;

// ── 13 · DOS COSTALES de yute frente a frente: cada uno vacía su montoncito; con el hervor uno se infla y se abre, el otro queda duro y brilla
const costalGeo = lathe([[0, 0], [0.38, 0.02], [0.52, 0.22], [0.56, 0.6], [0.5, 0.92], [0.3, 1.08], [0.17, 1.13], [0.21, 1.2], [0.27, 1.27]]);
const Costal: React.FC<{ x: number; y: number; label: string; rot?: number }> = ({ x, y, label, rot = 0 }) => (
  <group position={[x, y, 0]} rotation={[0, rot, 0]}>
    <mesh geometry={costalGeo} castShadow receiveShadow scale={[1, 1, 0.82]}><Yute /></mesh>
    <mesh position={[0, 1.13, 0]} rotation={[P / 2, 0, 0]} castShadow><torusGeometry args={[0.19, 0.035, 8, 24]} /><meshStandardMaterial color="#5a3a1c" roughness={0.9} /></mesh>
    <mesh position={[0, 0.6, 0.47]} rotation={[0, 0, 0.05]}><planeGeometry args={[0.62, 0.34]} /><meshStandardMaterial map={papel("cos" + label, [label], { size: 150 })} roughness={0.9} /></mesh>
  </group>
);
const H3Costales: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const hv = eio(tt, 3.0, 5.2);
  return <>
    <Estudio t={tt} cam={[0, 2.0, 4.8]} look={[0, 0.55, 0]}>
      <Costal x={-1.15} y={fall(tt, 0.2, 2.2)} label="2025" rot={0.25} />
      <Costal x={1.15} y={fall(tt, 0.55, 2.2)} label="2026" rot={-0.25} />
      {Array.from({ length: 36 }, (_, i) => {
        const side = i % 2 ? 1 : -1, nuevo = side > 0, j = Math.floor(i / 2), at = 1.4 + j * 0.05 + (nuevo ? 0.25 : 0);
        const px = side * (0.42 + (rn(i, 1) - 0.5) * 0.5), pz = 0.75 + (rn(i, 2) - 0.5) * 0.4, py = 0.05 + (j % 4) * 0.035 + fall(tt, at, 1.0);
        const bump = !nuevo && hv > 0.4 ? Math.abs(Math.sin((tt - 3.6) * 9 + i)) * 0.05 * (1 - hv * 0.6) : 0;
        return tt < at - 0.4 ? null : <Frijol key={i} p={[px + side * 0.1, py + bump, pz]} rot={[rn(i, 3) * 3, rn(i, 4) * 6, 0]} s={0.05} hinchado={nuevo ? hv : 0} c={nuevo ? "#7a3322" : "#4a1c14"} />;
      })}
      {hv > 0.05 && <Vapor t={tt} p={[0.55, 0.1, 0.75]} o={0.3 * hv} h={0.9} />}
    </Estudio>
    <Head tt={tt} kick="TRUCO 13" title="NUNCA MEZCLAR COSTALES" />
    <Tag tt={tt} at={4.4} x={600} y={930} txt="SIGUE DURO" col={RED} size={40} />
    <Tag tt={tt} at={4.7} x={1320} y={930} txt="YA SE DESHACE" col={MZ} size={40} />
  </>;
}}</Stage>;

// ── 14 · OLLA EXPRÉS cromada: la aguja del manómetro sube con rebote al verde, la válvula baila y echa vapor; el anillo de 2/3 se enciende
const dial = () => ctex("dial", 512, 512, (g) => {
  g.fillStyle = "#f4f1ea"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill();
  const arc = (a0: number, a1: number, c: string) => { g.strokeStyle = c; g.lineWidth = 46; g.beginPath(); g.arc(256, 256, 190, a0, a1); g.stroke(); };
  arc(P * 0.75, P * 1.75, "#d9d4c8"); arc(P * 1.75, P * 2.05, "#3f9a4a"); arc(P * 2.05, P * 2.25, "#c0392b");
  g.strokeStyle = "#333"; g.lineWidth = 6; for (let i = 0; i <= 10; i++) { const a = P * 0.75 + (i / 10) * P * 1.5; g.beginPath(); g.moveTo(256 + Math.cos(a) * 150, 256 + Math.sin(a) * 150); g.lineTo(256 + Math.cos(a) * 125, 256 + Math.sin(a) * 125); g.stroke(); }
  g.strokeStyle = "#8a857c"; g.lineWidth = 14; g.beginPath(); g.arc(256, 256, 246, 0, 7); g.stroke();
});
const ollaExpGeo = lathe([[0, 0], [0.66, 0], [0.7, 0.04], [0.7, 0.74], [0.73, 0.78]]);
const tapaGeo = lathe([[0.74, 0], [0.7, 0.06], [0.5, 0.14], [0.2, 0.18], [0, 0.18]]);
const H3Manometro: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const n = phys(tt, 1.2, 3.2, 0.32), ang = lerp(P * 0.75, P * 1.92, cl(n)) + 0.03 * Math.sin(tt * 18) * cl(tt - 2.6);
  const silba = cl((tt - 2.6) * 2), ring = cl((tt - 3.6) * 1.8);
  return <>
    <Estudio t={tt} cam={[0.3, 2.3, 4.4]} look={[0.1, 0.75, 0]} orbit={0.18}>
      <group position={[0, fall(tt, 0.15, 1.6), 0]}>
        <mesh geometry={ollaExpGeo} castShadow receiveShadow>{M.cromo()}</mesh>
        <mesh geometry={tapaGeo} position={[0, 0.78, 0]} castShadow>{M.cromo("#c9ccd1")}</mesh>
        {[-1, 1].map((s) => <RBox key={s} p={[s * 0.95, 0.82, 0]} s={[0.5, 0.07, 0.12]} r={0.03}><meshStandardMaterial color="#141210" roughness={0.5} /></RBox>)}
        {/* válvula que baila */}
        <group position={[0.15, 0.98, 0]} rotation={[0.25 * silba * Math.sin(tt * 26), 0, 0.25 * silba * Math.cos(tt * 23)]}>
          <mesh position={[0, 0.07, 0]} castShadow><cylinderGeometry args={[0.05, 0.06, 0.14, 16]} />{M.cromo("#9a9da3")}</mesh>
        </group>
        {silba > 0 && <Vapor t={tt} p={[0.15, 1.1, 0]} o={0.42 * silba} h={1.3} s={0.3} spread={0.08} n={16} />}
        {/* manómetro de frente, sobre la tapa */}
        <group position={[-0.25, 1.18, 0.12]} rotation={[-0.35, 0.12, 0]}>
          <mesh rotation={[P / 2, 0, 0]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.08, 40]} />{M.cromo()}</mesh>
          <mesh position={[0, 0, 0.041]}><circleGeometry args={[0.27, 48]} /><meshStandardMaterial map={dial()} roughness={0.5} /></mesh>
          <mesh position={[0, 0, 0.06]} rotation={[0, 0, -ang + P / 2]}><boxGeometry args={[0.022, 0.42, 0.01]} /><meshStandardMaterial color="#c0392b" roughness={0.4} /></mesh>
          <mesh position={[0, 0, 0.065]}><circleGeometry args={[0.03, 20]} /><meshStandardMaterial color="#222" /></mesh>
          <mesh position={[0, -0.15, -0.15]} rotation={[0.6, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.3, 10]} />{M.cromo()}</mesh>
        </group>
        {/* anillo de los 2/3 */}
        <mesh position={[0, 0.5, 0]} rotation={[P / 2, 0, 0]} scale={[1 + 0.15 * (1 - ring), 1 + 0.15 * (1 - ring), 1]}><torusGeometry args={[0.74, 0.02, 10, 64]} /><meshStandardMaterial color="#ffc04a" emissive="#ffb030" emissiveIntensity={2.2 * ring} transparent opacity={ring} /></mesh>
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 14" title="LA OLLA EXPRÉS, SIN MIEDO" />
    <Tag tt={tt} at={3.9} x={1500} y={640} txt="HASTA 2/3" col={MZ} size={54} />
  </>;
}}</Stage>;

// ── 16 · SARTÉN DE HIERRO: cae la manteca, se derrite en un charco brillante que humea; cae la cebolla; cae el frijol y se levanta el vapor
const sartenGeo = lathe([[0, 0], [0.86, 0], [0.98, 0.16], [1.02, 0.2]]);
const H3Capas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const mel = eio(tt, 1.0, 2.4), cb = tt - 2.6, fr = eio(tt, 4.0, 4.9);
  return <>
    <Estudio t={tt} cam={[0, 2.9, 3.6]} look={[0, 0.15, 0.1]} orbit={0.25}>
      <mesh geometry={sartenGeo} castShadow receiveShadow><meshStandardMaterial color="#1c1a19" roughness={0.42} metalness={0.65} side={THREE.DoubleSide} /></mesh>
      <RBox p={[1.55, 0.17, 0]} s={[1.1, 0.07, 0.16]} r={0.03}><meshStandardMaterial color="#1c1a19" roughness={0.5} metalness={0.6} /></RBox>
      {/* manteca: barra que cae y se vuelve charco */}
      {mel < 0.98 && <RBox p={[0, lerp(0.12, 0.03, mel) + fall(tt, 0.3, 1.3), 0]} s={[0.42, lerp(0.22, 0.02, mel), 0.3]} r={0.04}><meshPhysicalMaterial color="#f4ecd2" roughness={0.35} clearcoat={0.5} /></RBox>}
      <mesh position={[0, 0.03, 0]} scale={[lerp(0.2, 0.86, mel), 1, lerp(0.2, 0.86, mel)]}><cylinderGeometry args={[1, 1, 0.012, 48]} /><meshPhysicalMaterial color="#e8c46a" roughness={0.05} clearcoat={1} transparent opacity={0.85 * mel} /></mesh>
      {mel > 0.5 && <Vapor t={tt} p={[0, 0.05, 0]} o={0.22 * mel * (1 - fr * 0.3)} h={0.9} s={0.3} spread={0.9} n={10} />}
      {/* cebolla en cubitos, de a uno */}
      {Array.from({ length: 22 }, (_, i) => { const at = 2.6 + i * 0.035, x = (rn(i, 1) - 0.5) * 1.1, z = (rn(i, 2) - 0.5) * 1.1, gold = eio(tt, at + 0.6, at + 2.2);
        return cb < i * 0.035 - 0.3 ? null : <RBox key={i} p={[x, 0.06 + fall(tt, at, 1.1) + fr * 0.06, z]} s={[0.07, 0.04, 0.07]} r={0.012} rot={[0, rn(i, 3) * 3, 0]}>
          <meshPhysicalMaterial color={new THREE.Color("#f2efe4").lerp(new THREE.Color("#d9a45a"), gold)} roughness={0.2} transmission={0.2} transparent opacity={0.92} /></RBox>; })}
      {/* el frijol con su caldo */}
      <mesh position={[0, 0.03 + 0.05 * fr, 0]} scale={[0.86 * fr + 0.001, 1, 0.86 * fr + 0.001]}><cylinderGeometry args={[1, 1, 0.07, 48]} />{M.liquido("#4a2218", 0.95)}</mesh>
      {Array.from({ length: 40 }, (_, i) => { const at = 4.0 + i * 0.02, a = rn(i, 5) * 6.28, r = Math.sqrt(rn(i, 6)) * 0.75;
        return tt < at - 0.3 ? null : <Frijol key={i} p={[Math.cos(a) * r, 0.11 + fall(tt, at, 1.0), Math.sin(a) * r]} rot={[rn(i, 7) * 3, rn(i, 8) * 6, 0]} s={0.045} c="#5a2418" hinchado={0.5} />; })}
      {fr > 0.1 && <Vapor t={tt} p={[0, 0.12, 0]} o={0.45 * fr} h={1.4} s={0.45} spread={1.0} n={16} />}
    </Estudio>
    <Head tt={tt} kick="TRUCO 16" title="PRIMERO LA MANTECA, BIEN CALIENTE" />
    <Tag tt={tt} at={4.5} x={960} y={950} txt="QUE CHILLE AL ENTRAR" col={MZ} size={46} />
  </>;
}}</Stage>;

// ── 19 · FRASCO DE VIDRIO: el caldo cae por el embudo con vapor, sube el nivel, la tapa se enrosca y la etiqueta de cinta se pega
const frascoGeo = lathe([[0, 0], [0.4, 0], [0.44, 0.05], [0.45, 0.8], [0.38, 0.92], [0.36, 1.02], [0.37, 1.06]]);
const caldoGeo = lathe([[0, 0], [0.39, 0], [0.42, 0.04], [0.425, 1]]);
const embudoGeo = lathe([[0.05, 0], [0.05, 0.22], [0.42, 0.62]], 32);
const H3Frasco: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const lvl = eio(tt, 1.2, 4.0), pour = cl((tt - 1.0) * 4) * (1 - cl((tt - 4.0) * 4)), emb = cl(phys(tt, 0.7, 5, 0.5)) * (1 - eio(tt, 4.1, 4.6));
  const tapa = eio(tt, 4.5, 5.2), et = phys(tt, 5.3, 7, 0.4);
  return <>
    <Estudio t={tt} cam={[0, 1.7, 4.0]} look={[0, 0.85, 0]} orbit={0.2}>
      <group position={[0, fall(tt, 0.1, 1.4), 0]}>
        <mesh geometry={caldoGeo} scale={[1, Math.max(0.001, lvl * 0.78), 1]} position={[0, 0.02, 0]}>{M.liquido("#b9782e", 0.88)}</mesh>
        <mesh geometry={frascoGeo} castShadow receiveShadow>{M.vidrio()}</mesh>
        {/* tapa de rosca: baja girando */}
        <mesh position={[0, lerp(1.9, 1.08, tapa), 0]} rotation={[0, -tapa * 7, 0]} castShadow><cylinderGeometry args={[0.39, 0.39, 0.1, 40]} />{M.cromo("#c8a84a")}</mesh>
        {/* etiqueta de cinta que se pega con un golpe */}
        <mesh position={[0, 0.5, 0.455]} scale={[lerp(1.4, 1, cl(et)), lerp(1.4, 1, cl(et)), 1]} rotation={[0, 0, -0.04]}>
          <planeGeometry args={[0.6, 0.3]} /><meshStandardMaterial map={papel("caldo", ["CALDO", "lunes"], { size: 88, bg: "#efe2b4" })} transparent opacity={cl(et * 3)} roughness={0.9} /></mesh>
      </group>
      {emb > 0.01 && <mesh geometry={embudoGeo} position={[0, 1.05 + (1 - emb) * 1.2, 0]} castShadow>{M.cromo("#b8bcc2")}</mesh>}
      {pour > 0.01 && <mesh position={[0, 1.35 - 0.62 * (0.3 + lvl * 0.7) / 2 + 0.3, 0]} scale={[pour, 1, pour]}><cylinderGeometry args={[0.035, 0.03, 1.6 - lvl * 0.6, 12]} />{M.liquido("#c98a3a", 0.9)}</mesh>}
      {lvl > 0.2 && <Vapor t={tt} p={[0, 1.05, 0]} o={0.3 * (1 - tapa)} h={0.8} s={0.28} spread={0.25} />}
    </Estudio>
    <Head tt={tt} kick="TRUCO 19" title="EL CALDO SE GUARDA APARTE" />
  </>;
}}</Stage>;

// ── 20 · LICUADORA DE VIDRIO: las cuchillas giran, el remolino arrastra los granos y se vuelven crema; se cuela y las cáscaras quedan en la malla
const jarraGeo = lathe([[0, 0], [0.3, 0], [0.34, 0.05], [0.44, 1.05], [0.47, 1.1]]);
const cremaGeo = lathe([[0, 0], [0.3, 0], [0.34, 0.05], [0.43, 1]]);
const H3Licuadora: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const run = cl((tt - 1.0) * 3) * (1 - cl((tt - 3.4) * 3)), cream = eio(tt, 1.6, 3.2), tilt = eio(tt, 3.7, 4.5) * (1 - eio(tt, 6.0, 6.6));
  const flow = cl((tt - 4.4) * 3) * (1 - cl((tt - 5.9) * 3)), bowl = eio(tt, 4.5, 5.9);
  const col = new THREE.Color("#5a2418").lerp(new THREE.Color("#6e3a26"), cream);
  return <>
    <Estudio t={tt} cam={[0.4, 2.0, 4.6]} look={[0.4, 0.8, 0]} orbit={0.15}>
      <group position={[-0.6, 0, 0]}>
        <RBox p={[0, 0.25, 0]} s={[0.8, 0.5, 0.8]} r={0.08}><meshStandardMaterial color="#efe9dc" roughness={0.4} /></RBox>
        <mesh position={[0, 0.25, 0.41]} rotation={[P / 2, 0, tt * 2 * run]}><cylinderGeometry args={[0.08, 0.08, 0.05, 20]} />{M.cromo()}</mesh>
        <group position={[0, 0.5, 0]} rotation={[0, 0, -tilt * 1.25]}>
          <group position={[tilt * 0.2, tilt * 0.55, 0]}>
            <mesh geometry={cremaGeo} position={[0, 0.06, 0]} scale={[1, Math.max(0.001, 0.62 * (1 - bowl * 0.85)), 1]} rotation={[0, tt * 9 * run, 0]}>{M.liquido("#" + col.getHexString(), cream > 0.2 ? 0.96 * cream : 0.01)}</mesh>
            {Array.from({ length: 30 }, (_, i) => { const a = rn(i, 1) * 6.28 + tt * 8 * run, r = 0.08 + rn(i, 2) * 0.25, y = 0.12 + rn(i, 3) * 0.4 + 0.15 * Math.sin(tt * 6 + i) * run;
              return cream > 0.85 ? null : <Frijol key={i} p={[Math.cos(a) * r, y, Math.sin(a) * r]} rot={[a, i, 0]} s={0.045 * (1 - cream * 0.8)} c="#5a2418" />; })}
            <mesh position={[0, 0.07, 0]} rotation={[0, tt * 40 * run, 0]}><boxGeometry args={[0.42, 0.012, 0.06]} />{M.cromo()}</mesh>
            <mesh position={[0, 0.07, 0]} rotation={[0, tt * 40 * run + P / 2, 0.3]}><boxGeometry args={[0.42, 0.012, 0.06]} />{M.cromo()}</mesh>
            <mesh geometry={jarraGeo} castShadow>{M.vidrio()}</mesh>
            <mesh position={[0, 1.13, 0]}><cylinderGeometry args={[0.46, 0.46, 0.06, 32]} /><meshStandardMaterial color="#1a1a1a" roughness={0.5} /></mesh>
          </group>
        </group>
      </group>
      {/* colador de malla sobre el plato hondo */}
      <group position={[1.15, 0, 0.15]}>
        <mesh geometry={lathe([[0, 0], [0.5, 0], [0.62, 0.22], [0.64, 0.26]])} castShadow receiveShadow>{M.barro("#2f5d7a")}</mesh>
        <mesh position={[0, 0.06, 0]} scale={[0.58 * bowl + 0.001, 1, 0.58 * bowl + 0.001]}><cylinderGeometry args={[1, 1, 0.1, 40]} />{M.liquido("#6e3a26", 0.97)}</mesh>
        <mesh position={[0, 0.55, 0]} rotation={[P, 0, 0]}><sphereGeometry args={[0.42, 24, 12, 0, 6.28, 0, P / 2]} /><meshStandardMaterial color="#c8ccd2" metalness={0.9} roughness={0.3} wireframe /></mesh>
        <mesh position={[0, 0.56, 0]} rotation={[P / 2, 0, 0]}><torusGeometry args={[0.42, 0.02, 8, 40]} />{M.cromo()}</mesh>
        {Array.from({ length: 16 }, (_, i) => { const k = eio(tt, 4.7 + i * 0.05, 5.8); const a = rn(i, 4) * 6.28, r = rn(i, 5) * 0.25;
          return k <= 0 ? null : <mesh key={i} position={[Math.cos(a) * r, 0.2 + rn(i, 6) * 0.05, Math.sin(a) * r]} rotation={[rn(i, 7) * 3, 0, 0]} scale={[k, k, k]}><sphereGeometry args={[0.035, 8, 6, 0, 3.4]} /><meshStandardMaterial color="#2a0e08" roughness={0.6} side={THREE.DoubleSide} /></mesh>; })}
      </group>
      {flow > 0.01 && <mesh position={[0.95, 1.05, 0.15]} rotation={[0, 0, 0.25]} scale={[flow, 1, flow]}><cylinderGeometry args={[0.05, 0.04, 0.95, 12]} />{M.liquido("#6e3a26", 0.96)}</mesh>}
    </Estudio>
    <Head tt={tt} kick="TRUCO 20" title="COLADOS, PARA ENFRIJOLADAS" />
    <Tag tt={tt} at={5.4} x={1480} y={950} txt="LISITOS COMO CREMA" col={MZ} size={44} />
  </>;
}}</Stage>;

// ── 21 · CALENDARIO en la puerta del refri: las hojas se arrancan 1-2-3-4 y caen a la mesa; en el 5, una cruz roja de sello
const H3Calendario: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const rip = [1.2, 2.0, 2.8, 3.6], x5 = phys(tt, 4.4, 7, 0.4);
  return <>
    <Estudio t={tt} cam={[0, 1.6, 4.2]} look={[0, 1.25, -0.4]} orbit={0.14}>
      <RBox p={[0, 1.6, -0.75]} s={[2.4, 3.2, 0.3]} r={0.12}><meshStandardMaterial color="#eef0ee" roughness={0.3} metalness={0.05} /></RBox>
      <RBox p={[1.0, 1.6, -0.52]} s={[0.07, 1.1, 0.1]} r={0.03}>{M.cromo()}</RBox>
      <RBox p={[-0.1, 1.55, -0.57]} s={[1.0, 1.15, 0.06]} r={0.02}><meshStandardMaterial color="#8a2f24" roughness={0.6} /></RBox>
      <mesh position={[-0.1, 2.15, -0.52]}><sphereGeometry args={[0.06, 16, 10]} />{M.cromo("#e0b040")}</mesh>
      {[5, 4, 3, 2, 1].map((d, idx) => { const i = d - 1, r0 = i < 4 ? rip[i] : 99, k = cl(tt - r0), z = -0.535 + (4 - i) * 0.004;
        const fallY = k > 0 ? 1.0 - 0.5 * 9.8 * k * k * 0.25 : 0, spin = k * 2.2;
        if (k > 1.2) return null;
        return <group key={d} position={[-0.1 + k * 0.4 * (i % 2 ? -1 : 1), 2.05 + Math.max(-1.9, fallY - 1.0), z + k * 0.6]} rotation={[-spin * 0.6, spin * 0.3 * (i % 2 ? 1 : -1), spin * 0.2]}>
          <mesh position={[0, -0.5, 0]} castShadow><planeGeometry args={[0.92, 1.0]} /><meshStandardMaterial map={papel("dia" + d, [String(d)], { size: 230, w: 400, h: 420, font: `900 230px Georgia, serif`, ink: d === 5 ? "#8a2f24" : "#2a1c12", bg: "#f6f1e4" })} roughness={0.9} side={THREE.DoubleSide} /></mesh>
        </group>; })}
      {x5 > 0.01 && [1, -1].map((s) => <mesh key={s} position={[-0.1, 1.55, -0.49]} rotation={[0, 0, s * 0.78]} scale={[lerp(1.8, 1, cl(x5)), 1, 1]}><boxGeometry args={[0.95, 0.11, 0.01]} /><meshStandardMaterial color="#c0392b" roughness={0.7} transparent opacity={cl(x5 * 3) * 0.9} /></mesh>)}
    </Estudio>
    <Head tt={tt} kick="TRUCO 21" title="REFRI: 3 O 4 DÍAS" />
  </>;
}}</Stage>;

// ── 24 · BALANZA + PLATOS: el kilo cae en la báscula, al lado se apilan los platos de a uno y el contador mecánico rueda hasta 14
const digitos = () => ctex("dig", 128, 1280, (g) => {
  g.fillStyle = "#151311"; g.fillRect(0, 0, 128, 1280); g.fillStyle = "#f4ead2"; g.font = "900 110px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 0; i < 10; i++) g.fillText(String(i), 64, 64 + i * 128);
});
const Tambor: React.FC<{ p: [number, number, number]; v: number }> = ({ p, v }) => {
  const tex = digitos(); return <mesh position={p} rotation={[(v / 10) * P * 2, 0, P / 2]}>
    <cylinderGeometry args={[0.2, 0.2, 0.26, 40, 1, true]} /><meshStandardMaterial map={tex} roughness={0.5} /></mesh>;
};
const platoGeo = lathe([[0, 0], [0.3, 0], [0.42, 0.035], [0.46, 0.05]]);
const H3Odometro: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const dip = 0.04 * phys(tt, 0.9, 6, 0.3), N = 14, landed = Array.from({ length: N }, (_, i) => tt > 1.7 + i * 0.22 + 0.35).filter(Boolean).length;
  const roll = lerp(landed > 0 ? landed - 1 : 0, landed, cl((tt - (1.7 + (landed - 1) * 0.22 + 0.35)) * 5));
  return <>
    <Estudio t={tt} cam={[0, 2.0, 4.7]} look={[0, 0.75, 0]} orbit={0.16}>
      {/* báscula antigua */}
      <group position={[-1.2, 0, 0.1]}>
        <RBox p={[0, 0.12, 0]} s={[0.9, 0.24, 0.6]} r={0.06}><meshStandardMaterial color="#7a2e24" roughness={0.45} metalness={0.3} /></RBox>
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.06, 0.08, 0.55, 14]} />{M.cromo("#c9a64a")}</mesh>
        <mesh position={[0, 0.8 - dip, 0]} castShadow receiveShadow><cylinderGeometry args={[0.5, 0.45, 0.04, 40]} />{M.cromo("#d8c27a")}</mesh>
        <group position={[0, 0.82 - dip + fall(tt, 0.4, 1.6), 0]}>
          <mesh geometry={costalGeo} scale={[0.5, 0.42, 0.42]} castShadow><Yute /></mesh>
          <mesh position={[0, 0.25, 0.2]}><planeGeometry args={[0.34, 0.18]} /><meshStandardMaterial map={papel("kilo", ["1 kg"], { size: 130 })} roughness={0.9} /></mesh>
        </group>
      </group>
      {/* pila de platos */}
      {Array.from({ length: N }, (_, i) => { const at = 1.7 + i * 0.22; return tt < at - 0.4 ? null :
        <mesh key={i} geometry={platoGeo} position={[0.55, i * 0.052 + fall(tt, at, 0.9), 0.35]} rotation={[0, i * 0.4, 0]} castShadow receiveShadow><meshPhysicalMaterial color="#f3efe6" roughness={0.18} clearcoat={0.8} /></mesh>; })}
      {/* contador mecánico */}
      <group position={[1.6, 0.42, -0.1]}>
        <RBox p={[0, 0, 0]} s={[0.72, 0.5, 0.42]} r={0.05}><meshStandardMaterial color="#3a2a1c" roughness={0.5} metalness={0.2} /></RBox>
        <Tambor p={[-0.15, 0, 0.12]} v={Math.floor(roll / 10) + cl((roll % 10) - 9) } />
        <Tambor p={[0.15, 0, 0.12]} v={roll % 10} />
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 24" title="LA CUENTA: UN KILO RINDE…" />
    <Tag tt={tt} at={5.2} x={1500} y={300} txt="14 PLATOS" col={MZ} size={64} />
  </>;
}}</Stage>;

// ── 25 · EL CAJÓN de la cocina se desliza hacia la cámara, sale la libreta de la abuela, se abre y se escribe «UN DÍA ANTES»
const H3Cajon: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const op = eio(tt, 0.5, 1.6), up = eio(tt, 1.8, 2.7), cov = eio(tt, 2.7, 3.5), wr = eio(tt, 3.5, 4.8);
  return <>
    <Estudio t={tt} cam={[0, 2.2, 4.2]} look={[0, 0.85, 0.2]} orbit={0.15}>
      <RBox p={[0, 0.6, -0.6]} s={[2.8, 1.2, 1.2]} r={0.05}><meshStandardMaterial color="#6a4428" roughness={0.75} /></RBox>
      <group position={[0, 0.82, -0.6 + op * 0.75]}>
        <RBox p={[0, 0, 0.62]} s={[1.6, 0.34, 0.06]} r={0.03}><meshStandardMaterial color="#8a5a34" roughness={0.7} /></RBox>
        <mesh position={[0, 0, 0.67]}><sphereGeometry args={[0.05, 16, 10]} />{M.cromo("#c9a64a")}</mesh>
        <RBox p={[-0.77, 0, 0]} s={[0.04, 0.3, 1.2]} r={0.01}><meshStandardMaterial color="#7a4e2c" /></RBox>
        <RBox p={[0.77, 0, 0]} s={[0.04, 0.3, 1.2]} r={0.01}><meshStandardMaterial color="#7a4e2c" /></RBox>
      </group>
      {/* libreta: sube del cajón, se inclina a cámara y se abre */}
      <group position={[0, lerp(0.86, 1.3, up), lerp(-0.4, 0.75, up) + op * 0.75 * (1 - up)]} rotation={[lerp(-P / 2, -0.55, up), 0, 0]}>
        <mesh position={[0, 0, -0.012]} castShadow><boxGeometry args={[0.9, 0.62, 0.02]} /><meshStandardMaterial color="#3a5a3a" roughness={0.8} /></mesh>
        <mesh position={[0, 0, 0.001]}><planeGeometry args={[0.86, 0.58]} /><meshStandardMaterial map={papel("libreta", ["UN DÍA ANTES"], { w: 640, h: 420, size: 120, rule: true, ink: "#1e2a4a" })} roughness={0.9} /></mesh>
        {/* la tinta «se escribe»: una franja de papel limpio que se corre de izquierda a derecha */}
        {wr < 1 && <mesh position={[-0.43 + 0.86 * wr + 0.43 * (1 - wr), 0, 0.003]} scale={[1 - wr, 1, 1]}><planeGeometry args={[0.86, 0.58]} /><meshStandardMaterial map={papel("libreta0", [""], { w: 640, h: 420, rule: true })} roughness={0.9} /></mesh>}
        <group position={[0, 0.31, 0.012]} rotation={[cov * 2.9, 0, 0]}>
          <mesh position={[0, -0.31, 0]} castShadow><boxGeometry args={[0.9, 0.62, 0.02]} /><meshStandardMaterial color="#3a5a3a" roughness={0.8} /></mesh>
        </group>
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 25" title="LOS FRIJOLES, UN DÍA ANTES" />
  </>;
}}</Stage>;

export const MAP3: Record<string, C> = { costales: H3Costales, manometro: H3Manometro, capas: H3Capas, frasco: H3Frasco, licuadora: H3Licuadora, calendario: H3Calendario, odometro: H3Odometro, cajon: H3Cajon };
