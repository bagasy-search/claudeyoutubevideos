// dur29d · bloque B (1940 soldadoras Liberty, TopCinco del siglo, 1950 mineros de uranio, ranking, 1960 pilotos de prueba):
// un mecanismo por componente, objetos grandes, sin carteles para leer. Luces siempre montadas (rampa), escala mínima > 0.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, fallY, latheG, pop } from "./kb";
import { Stickman } from "../stickman3d";
import { PI, sm } from "./c3k";

type UP = { d: number; p: any };
const HULL = "#5a6066";

// ---------- piezas ----------
const Sparks: React.FC<{ tt: number; p: number[]; n?: number; spread?: number; fall?: number; op?: number }> = ({ tt, p, n = 30, spread = 0.25, fall = 0.6, op = 1 }) => <group position={p as any}>
  {Array.from({ length: n }, (_, i) => { const ph = (tt * 1.1 + rn(i, 1)) % 1, a = rn(i, 2) * 2 * PI, v = spread * (0.4 + rn(i, 3));
    return <mesh key={i} position={[Math.cos(a) * v * ph, -fall * ph * ph + 0.12 * ph, Math.sin(a) * v * ph]} scale={sm(op * (1 - ph))}>
      <sphereGeometry args={[0.006, 6, 4]} />{M.glow({ col: ph < 0.4 ? "#fff2c0" : "#ff9a30" })}</mesh>; })}
</group>;
// costilla del casco: un arco en U visto de frente
const Rib: React.FC<{ z: number; s?: number; col?: string }> = ({ z, s = 1, col = HULL }) =>
  <mesh position={[0, 0.55, z]} rotation={[0, 0, PI]} scale={[s, s, 1]}><torusGeometry args={[0.55, 0.018, 6, 28, PI]} /><meshStandardMaterial color={col} metalness={0.6} roughness={0.5} /></mesh>;
const Vial: React.FC<{ p?: number[]; s?: number; glow?: number }> = ({ p = [0, 0, 0], s = 1, glow = 0 }) => <group position={p as any} scale={sm(s)}>
  <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.025, 0.025, 0.12, 20]} />{M.glass()}</mesh>
  <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.021, 0.021, 0.07, 20]} /><meshStandardMaterial color="#c8d050" emissive="#b8e040" emissiveIntensity={0.3 + glow} transparent opacity={0.7} /></mesh>
  <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.02, 0.02, 0.025, 16]} /><meshStandardMaterial color="#3a2a1a" /></mesh>
</group>;
const Watch: React.FC<{ p?: number[]; s?: number; tt: number }> = ({ p = [0, 0, 0], s = 1, tt }) => <group position={p as any} scale={sm(s)} rotation={[PI / 2 - 0.3, 0, 0]}>
  <mesh><cylinderGeometry args={[0.06, 0.06, 0.018, 32]} />{M.chrome()}</mesh>
  <mesh position={[0, 0.0095, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.052, 32]} /><meshStandardMaterial color="#f4f0e6" /></mesh>
  <group position={[0, 0.011, 0]} rotation={[0, -tt * 2, 0]}><RBox s={[0.004, 0.002, 0.045]} r={0.001} p={[0, 0, -0.02]}><meshStandardMaterial color="#c8281e" /></RBox></group>
  <mesh position={[0, 0, -0.07]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 0.02, 10]} />{M.chrome()}</mesh>
</group>;
const Cap: React.FC<{ p?: number[]; s?: number; col?: string }> = ({ p = [0, 0, 0], s = 1, col = "#5a4a3a" }) => <group position={p as any} scale={sm(s)}>
  <mesh scale={[1, 0.6, 1]}><sphereGeometry args={[0.06, 20, 10, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial color={col} roughness={0.95} /></mesh>
  <RBox s={[0.07, 0.006, 0.05]} r={0.003} p={[0, 0.002, 0.07]}><meshStandardMaterial color={col} roughness={0.95} /></RBox>
</group>;

// ---- CascoChispas · dentro del casco a medio armar: las costillas de acero, la lluvia de chispas que cae desde arriba, tres
// soldadoras con la luz azul que late en la cara de la máscara; la cámara avanza por el pasillo del casco ----
const CascoChispas: React.FC<UP> = ({ d, p }) => {
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#0e1014" key1={[-0.8, 2.4, 1.6]} backDim={0.2}
    cam={{ at: [0, 0.35, -0.2], at1: [0, 0.35, -0.8], az: [-0.12, 0.1], el: [0.08, 0.06], r: [1.6, 1.25], fov: 40 }}>{(tt) => <>
    {Array.from({ length: 9 }, (_, i) => <Rib key={i} z={0.8 - i * 0.32} />)}
    <mesh position={[0, 0.0, -0.4]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.2, 3.2]} /><meshStandardMaterial map={dirtT([84, 88, 92])} metalness={0.4} roughness={0.6} /></mesh>
    {/* planchas puestas sólo en la mitad de atrás */}
    {Array.from({ length: 5 }, (_, i) => [-1, 1].map((s) => <mesh key={i + "_" + s} position={[s * 0.5, 0.3, -0.7 - i * 0.32]} rotation={[0, 0, s * 0.35]}><boxGeometry args={[0.02, 0.5, 0.31]} /><meshStandardMaterial color="#6a7076" metalness={0.5} roughness={0.55} /></mesh>))}
    {[[-0.32, -0.2, 0.4], [0.3, -0.6, 0.2], [-0.15, -1.2, 0.85]].map(([x, z, y], i) => { const fl = 0.8 + 0.2 * Math.sin(tt * 2 * PI * 1.6 + i * 2);
      return <group key={i}>
        <group position={[x, y === 0.85 ? 0.36 : 0, z]}><Stickman escala={0.13} rotY={x < 0 ? 70 : -70} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={i + 2} contacto={0.3} colorContacto="#0a0a0c" color="#4a5a6a" /></group>
        <mesh position={[x + (x < 0 ? 0.09 : -0.09), (y === 0.85 ? 0.36 : 0) + 0.2, z]}><sphereGeometry args={[0.012, 10, 8]} />{M.glow({ col: "#cfe4ff" })}</mesh>
        <pointLight position={[x + (x < 0 ? 0.1 : -0.1), (y === 0.85 ? 0.36 : 0) + 0.22, z + 0.05]} intensity={2.2 * fl} distance={1.0} color="#8ab8ff" />
        <Sparks tt={tt + i * 0.3} p={[x + (x < 0 ? 0.09 : -0.09), (y === 0.85 ? 0.36 : 0) + 0.2, z]} n={40} spread={0.24} fall={0.5} />
      </group>; })}
    {/* lluvia de chispas desde la cubierta */}
    {Array.from({ length: 110 }, (_, i) => { const ph = (tt * 0.9 + rn(i, 1)) % 1; return <mesh key={"r" + i} position={[(rn(i, 2) - 0.5) * 0.9, 1.05 - ph * 1.05, 0.4 - rn(i, 3) * 2.2]} scale={sm(1 - ph * 0.6)}>
      <boxGeometry args={[0.008, 0.06, 0.008]} />{M.glow({ col: "#ffb040", op: 0.95 })}</mesh>; })}
    <hemisphereLight args={["#9ab0d0", "#2a2420", 0.7]} />
  </>}</U3>;
};

// ---- CuatroDias · el barco Liberty se arma solo en la grada: la quilla, las costillas, las planchas, la cubierta, las grúas; el
// contador de días va del 1 al 4 y en «botan» el barco se desliza al agua ----
const CuatroDias: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aB = Math.min(sec(p, "botan", D - 2.0), D - 1.4), B = Math.max(1.0, aB - 0.6);
  const day = (tt: number) => Math.min(4, 1 + Math.floor(cl(tt / B) * 4));
  return <U3 d={d} bg={p.bg} ground={null} mode="drop" sky="#8aa0b4" key1={[-1.4, 3.0, 1.6]}
    cam={{ at: [0, 0.3, 0], az: [-0.75, -0.45], el: [0.24, 0.18], r: [2.4, 2.2], fov: 36 }}
    over={(tt) => <Drums v={day(tt)} n={1} x={1560} y={110} s={1.2} unit="días" />}>{(tt) => {
    const k = cl(tt / B), slide = eio(tt, aB, aB + 1.2), L = 1.8;
    const ribs = Math.floor(k * 4 * 7), plates = cl((k - 0.35) / 0.4), deck = cl((k - 0.7) / 0.25);
    return <>
      <mesh position={[0, -0.05, -0.2]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 3]} /><meshStandardMaterial map={dirtT([120, 116, 108])} roughness={0.9} /></mesh>
      <mesh position={[0, -0.04, 1.6]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 1.6]} /><meshStandardMaterial color="#3a5468" roughness={0.15} metalness={0.3} /></mesh>
      <group position={[0, -0.25 * slide, 1.3 * slide]} rotation={[0.08 * slide * (1 - slide) * 4, PI / 2, 0]}>
        <RBox s={[L, 0.03, 0.06]} r={0.01} p={[0, 0.02, 0]}><meshStandardMaterial color={HULL} metalness={0.6} roughness={0.5} /></RBox>
        {Array.from({ length: 14 }, (_, i) => <group key={i} visible={i < ribs} position={[-L / 2 + 0.06 + i * 0.128, 0.22, 0]} rotation={[0, PI / 2, 0]} scale={[0.4, 0.4, 1]}>
          <mesh rotation={[0, 0, PI]} position={[0, 0.3, 0]}><torusGeometry args={[0.55, 0.03, 6, 20, PI]} /><meshStandardMaterial color={HULL} metalness={0.6} roughness={0.5} /></mesh></group>)}
        {[-1, 1].map((s) => <mesh key={s} position={[0, 0.2, s * 0.2]} scale={[sm(plates), 1, 1]} rotation={[s * 0.25, 0, 0]}><boxGeometry args={[L, 0.3, 0.012]} /><meshStandardMaterial color="#a8442e" metalness={0.3} roughness={0.6} /></mesh>)}
        <group scale={[1, 1, 1]} visible={deck > 0.01}>
          <mesh position={[0, 0.34, 0]} scale={[sm(deck), 1, 1]}><boxGeometry args={[L, 0.015, 0.44]} /><meshStandardMaterial color="#7a6a5a" roughness={0.8} /></mesh>
          <RBox s={[0.22, 0.16 * deck + 0.001, 0.3]} r={0.01} p={[0.25, 0.42, 0]}><meshStandardMaterial color="#e8e4dc" roughness={0.6} /></RBox>
          <mesh position={[0.25, 0.56, 0]} scale={[1, sm(deck), 1]}><cylinderGeometry args={[0.04, 0.045, 0.14, 16]} /><meshStandardMaterial color="#2a2a2a" /></mesh>
        </group>
        {ribs > 0 && slide < 0.1 && <Sparks tt={tt} p={[-L / 2 + Math.min(13, ribs) * 0.128, 0.3, 0.22]} n={20} spread={0.12} />}
      </group>
      {/* las dos grúas de la grada */}
      {[-1, 1].map((s) => <group key={s} position={[s * 1.05, 0, -0.35]}>
        <mesh position={[0, 0.6, 0]}><boxGeometry args={[0.09, 1.2, 0.09]} /><meshStandardMaterial color="#e0a830" metalness={0.3} roughness={0.5} /></mesh>
        <group position={[0, 1.2, 0]} rotation={[0, s * 0.9 + 0.3 * Math.sin(tt * 0.5 + s), 0]}>
          <mesh position={[0, 0, 0.35]}><boxGeometry args={[0.07, 0.07, 0.95]} /><meshStandardMaterial color="#e0a830" metalness={0.3} roughness={0.5} /></mesh>
          <mesh position={[0, -0.25, 0.75]}><cylinderGeometry args={[0.004, 0.004, 0.5, 4]} /><meshStandardMaterial color="#222" /></mesh>
          <RBox s={[0.14, 0.03, 0.08]} r={0.004} p={[0, -0.52, 0.75]}><meshStandardMaterial color="#a8442e" roughness={0.6} /></RBox>
        </group>
      </group>)}
      {Array.from({ length: 5 }, (_, i) => <RBox key={"g" + i} s={[0.7, 0.45 + rn(i, 1) * 0.3, 0.5]} r={0.01} p={[-1.6 + i * 0.8, 0.25, -1.6]}><meshStandardMaterial color={i % 2 ? "#8a7a66" : "#6a6a70"} roughness={0.8} /></RBox>)}
      {[[-0.5, 0.45], [0.1, 0.5], [0.6, 0.42]].map(([x, z], i) => <group key={"w" + i} position={[x, -0.05, z]}><Stickman escala={0.13} rotY={180 + (i - 1) * 30} guion={[{ t: 0, accion: i === 1 ? "cargar_caja" : "empujar", expr: "decidido" }]} semilla={60 + i} contacto={0.2} colorContacto="#2a2620" color="#4a5a6a" /></group>)}
      <hemisphereLight args={["#c8d8f0", "#5a5048", 0.8]} />
      <pointLight position={[0, 0.6, 0.4]} intensity={0.6 + 0.8 * (1 - slide)} distance={2} color="#9ac0ff" />
    </>;
  }}</U3>;
};

// ---- PielLuz · dos antebrazos bajo el arco azul: uno tapado con la manga gruesa y el guante, el otro arremangado; la luz pega
// fuerte y la piel desnuda se va poniendo roja en minutos (el reloj al lado corre); el tapado sigue igual ----
const PielLuz: React.FC<UP> = ({ d, p }) => {
  const aQ = sec(p, "quema", 1.4);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-1.0, 2.4, 1.6]} backDim={0.15}
    cam={{ at: [0, 0.18, 0], az: [-0.2, 0.15], el: [0.4, 0.34], r: [1.15, 1.0], fov: 34 }}>{(tt) => {
    const burn = eio(tt, aQ, aQ + 3.0), fl = 0.85 + 0.15 * Math.sin(tt * 2 * PI * 1.4);
    const skin = new THREE.Color("#e0b090").lerp(new THREE.Color("#d0503a"), burn);
    return <>
      <RBox s={[1.6, 0.04, 0.9]} r={0.01} p={[0, -0.02, 0]}><meshStandardMaterial color="#4a4e52" metalness={0.6} roughness={0.5} /></RBox>
      {/* brazo tapado */}
      <group position={[-0.3, 0.05, 0.05]} rotation={[0, 0.3, PI / 2]}>
        <mesh><cylinderGeometry args={[0.055, 0.06, 0.5, 20]} /><meshStandardMaterial color="#3a4a5a" roughness={1} /></mesh>
        <mesh position={[0, -0.3, 0]} scale={[1.1, 0.9, 1]}><sphereGeometry args={[0.07, 18, 14]} /><meshStandardMaterial color="#8a6a44" roughness={0.9} /></mesh>
      </group>
      {/* brazo arremangado */}
      <group position={[0.3, 0.05, 0.05]} rotation={[0, -0.3, -PI / 2]}>
        <mesh position={[0, -0.18, 0]}><cylinderGeometry args={[0.065, 0.065, 0.14, 20]} /><meshStandardMaterial color="#3a4a5a" roughness={1} /></mesh>
        <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.04, 0.048, 0.36, 20]} /><meshStandardMaterial color={skin} roughness={0.6} /></mesh>
        <mesh position={[0, 0.27, 0]} scale={[1.2, 0.8, 0.6]}><sphereGeometry args={[0.05, 16, 12]} /><meshStandardMaterial color={skin} roughness={0.6} /></mesh>
        {Array.from({ length: 9 }, (_, i) => { const an = rn(i, 1) * PI - PI / 2, y = -0.06 + rn(i, 2) * 0.24; return <mesh key={i} position={[Math.sin(an) * 0.045, y, Math.cos(an) * 0.045]} scale={[sm(cl(burn * 1.6 - rn(i, 3) * 0.6)), sm(cl(burn * 1.6 - rn(i, 3) * 0.6)) * 1.4, 0.4]}>
          <sphereGeometry args={[0.016, 10, 8]} /><meshStandardMaterial color="#9a1e14" roughness={0.4} /></mesh>; })}
      </group>
      {/* el arco en el centro */}
      <mesh position={[0, 0.06, -0.12]}><sphereGeometry args={[0.03, 12, 10]} />{M.glow({ col: "#e0f0ff" })}</mesh>
      <pointLight position={[0, 0.12, -0.2]} intensity={3.5 * fl} distance={1.6} color="#a8c8ff" />
      <Sparks tt={tt} p={[0, 0.06, -0.12]} n={36} spread={0.24} fall={0.3} />
      <Watch tt={tt * (1 + 4 * eio(tt, aQ, aQ + 0.5))} p={[0.62, 0.03, 0.32]} s={1.1} />
    </>;
  }}</U3>;
};

// ---- FondoCasco · el corte del casco como una U enorme: arriba aire y luz; en el fondo, agachada en el hueco entre costillas, la
// soldadora; el humo del metal se junta abajo y no sale; el reloj de media hora corre ----
const FondoCasco: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "media", 2.0);
  return <U3 d={d} bg={p.bg} ground={null} mode="drop" sky="#1a1c20" key1={[-0.8, 2.6, 1.4]} backDim={0.2}
    cam={{ at: [0, 0.3, 0], at1: [0, 0.14, 0], az: [-0.1, 0.12], el: [0.28, 0.34], r: [1.45, 1.05], fov: 36 }}
    over={(tt) => <Drums v={Math.min(30, Math.floor(Math.max(0, tt - aM) * 6))} n={2} x={1500} y={110} s={1.1} unit="min" op={eio(tt, aM - 0.2, aM + 0.3)} />}>{(tt) => {
    const smoke = cl(tt / 6), fl = 0.8 + 0.2 * Math.sin(tt * 2 * PI * 1.5);
    return <>
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, PI]}><torusGeometry args={[0.6, 0.05, 10, 40, PI]} /><meshStandardMaterial color={HULL} metalness={0.6} roughness={0.5} /></mesh>
      <mesh position={[0, 0.6, -0.12]} rotation={[0, 0, PI]}><cylinderGeometry args={[0.62, 0.62, 0.02, 40, 1, false, -PI / 2, PI]} /><meshStandardMaterial color="#4a5056" metalness={0.5} roughness={0.6} side={THREE.DoubleSide} /></mesh>
      <group position={[-0.04, 0.0, 0.08]}><Stickman escala={0.16} rotY={50} guion={[{ t: 0, accion: "sentarse", expr: "decidido" }]} semilla={5} contacto={0.2} colorContacto="#0a0a0c" color="#8a9aaa" /></group>
      <mesh position={[0.1, 0.06, 0.02]}><sphereGeometry args={[0.012, 10, 8]} />{M.glow({ col: "#cfe4ff" })}</mesh>
      <pointLight position={[0.1, 0.1, 0.1]} intensity={2.4 * fl} distance={0.9} color="#8ab8ff" />
      <Sparks tt={tt} p={[0.1, 0.06, 0.02]} n={20} spread={0.12} fall={0.15} />
      {/* el humo que se acumula en el fondo de la U */}
      {Array.from({ length: 22 }, (_, i) => { const ph = (tt * 0.12 + rn(i, 1)) % 1, sd = i % 2 ? 1 : -1; return <mesh key={i} position={[sd * (0.22 + rn(i, 2) * 0.3), 0.06 + ph * 0.3 * (0.5 + smoke), -0.1 - rn(i, 3) * 0.08]} scale={0.8 + rn(i, 4) + smoke}>
        <sphereGeometry args={[0.07, 16, 12]} /><meshStandardMaterial color="#9a9c94" roughness={1} transparent opacity={0.1 + 0.25 * smoke} depthWrite={false} /></mesh>; })}
      <hemisphereLight args={["#c8d4e0", "#3a3430", 0.8]} />
      {/* arriba: la luz del día que no llega */}
      <spotLight position={[0, 2.0, 0.6]} angle={0.3} penumbra={0.7} intensity={5} distance={2.0} color="#fff4e0" />
    </>;
  }}</U3>;
};

// ---- TopCincoSiglo · cinco pedestales en arco; en cada número se enciende uno y sube su objeto: la viga (altura), el carbón (polvo),
// el cronómetro (velocidad), la gorrita de chico (edad) y el frasquito que brilla (lo que no se ve) ----
const TopCincoSiglo: React.FC<UP> = ({ d, p }) => {
  const K = ["cinco", "cuatro", "tres", "dos", "uno"].map((k, i) => sec(p, k, 0.8 + i * 1.6));
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[-1.0, 2.6, 1.8]} backDim={0.25}
    cam={{ at: [0, 0.36, 0], az: [-0.12, 0.12], el: [0.18, 0.14], r: [1.75, 1.6], fov: 36 }}>{(tt) => <>
    <hemisphereLight args={["#e8e0d0", "#3a3430", 0.7]} />
    {K.map((a, i) => { const x = (i - 2) * 0.38, z = -Math.abs(i - 2) * 0.1, on = eio(tt, a, a + 0.5), up = pop(tt, a);
      return <group key={i} position={[x, 0, z]}>
        <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.15, 0.17, 0.2, 32]} /><meshStandardMaterial color="#6a5e54" roughness={0.45} metalness={0.2} /></mesh>
        <mesh position={[0, 0.201, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.13, 0.15, 32]} /><meshStandardMaterial color="#c8a050" emissive="#ffb040" emissiveIntensity={0.1 + 0.9 * on} /></mesh>
        <group position={[0, 0.21 + 0.03 * Math.sin(tt * 1.4 + i) * on, 0]} scale={Math.max(0.001, up) * 2.5} rotation={[0, tt * 0.4, 0]}>
          {i === 0 && <group position={[0, 0.05, 0]}><RBox s={[0.2, 0.012, 0.06]} r={0.002} p={[0, 0.045, 0]}><meshStandardMaterial color="#8a4a2a" metalness={0.5} roughness={0.6} /></RBox><RBox s={[0.2, 0.012, 0.06]} r={0.002} p={[0, -0.045, 0]}><meshStandardMaterial color="#8a4a2a" metalness={0.5} roughness={0.6} /></RBox><RBox s={[0.2, 0.09, 0.012]} r={0.002}><meshStandardMaterial color="#8a4a2a" metalness={0.5} roughness={0.6} /></RBox></group>}
          {i === 1 && <mesh position={[0, 0.05, 0]}><dodecahedronGeometry args={[0.06, 0]} /><meshStandardMaterial color="#141416" metalness={0.55} roughness={0.25} flatShading /></mesh>}
          {i === 2 && <Watch tt={tt} p={[0, 0.06, 0]} s={1} />}
          {i === 3 && <Cap p={[0, 0.0, 0]} s={1.1} />}
          {i === 4 && <Vial p={[0, 0, 0]} s={1.2} glow={0.8 * on * (0.7 + 0.3 * Math.sin(tt * 2 * PI * 0.8))} />}
        </group>
        <spotLight position={[x * 0.6, 1.6, 0.8]} angle={0.18} penumbra={0.6} intensity={1.5 + 12 * on} distance={2.6} color={i === 4 ? "#d8f080" : "#ffe0b0"} />
      </group>; })}
  </>}</U3>;
};

// ---- MinaAmarilla · el túnel angosto entra en la meseta roja; adentro, a la luz de una sola lámpara, el minero con el taladro y el
// polvo amarillo que flota y no sale; afuera el compresor late ----
const MinaAmarilla: React.FC<UP> = ({ d, p }) => {
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#c8a07a" key1={[-1.2, 2.8, 1.6]}
    cam={{ at: [0, 0.24, -0.25], at1: [0, 0.2, -0.95], az: [-0.12, 0.0], el: [0.1, 0.06], r: [1.5, 0.7], fov: 40 }}>{(tt) => {
    const vib = 0.006 * Math.sin(tt * 2 * PI * 9);
    return <>
      <mesh position={[0, -0.02, 0.6]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 3]} /><meshStandardMaterial map={dirtT([176, 112, 74])} roughness={1} /></mesh>
      {/* la meseta: tres bloques alrededor de la boca abierta */}
      {[[-1.1, 0.75, 1.8, 1.5], [1.1, 0.75, 1.8, 1.5], [0, 0.98, 0.4, 1.04]].map(([x, y, w, h], i) => <mesh key={i} position={[x, y, -0.55]}><boxGeometry args={[w, h, 0.7]} /><meshStandardMaterial map={dirtT([160, 86, 56])} roughness={1} /></mesh>)}
      {[-0.2, 0.2].map((x, i) => <RBox key={i} s={[0.05, 0.48, 0.06]} r={0.004} p={[x, 0.23, -0.18]}>{M.wood({ base: [110, 80, 50] })}</RBox>)}
      <RBox s={[0.5, 0.06, 0.07]} r={0.004} p={[0, 0.47, -0.18]}>{M.wood({ base: [110, 80, 50] })}</RBox>
      {/* el corredor: piso, paredes, techo y marcos cada 0,3 */}
      <group position={[0, 0, -0.85]}>
        <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.4, 1.3]} /><meshStandardMaterial map={dirtT([150, 100, 64])} roughness={1} /></mesh>
        {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.2, 0.23, 0]} rotation={[0, -sd * PI / 2, 0]}><planeGeometry args={[1.3, 0.46]} /><meshStandardMaterial map={dirtT([168, 104, 66])} roughness={1} side={THREE.DoubleSide} /></mesh>)}
        <mesh position={[0, 0.46, 0]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[0.4, 1.3]} /><meshStandardMaterial map={dirtT([140, 90, 60])} roughness={1} side={THREE.DoubleSide} /></mesh>
        {[0.35, 0.05, -0.25].map((z, i) => <group key={i} position={[0, 0, z]}>
          {[-0.17, 0.17].map((x) => <RBox key={x} s={[0.03, 0.44, 0.03]} r={0.003} p={[x, 0.22, 0]}>{M.wood({ base: [120, 86, 52] })}</RBox>)}
          <RBox s={[0.38, 0.03, 0.03]} r={0.003} p={[0, 0.44, 0]}>{M.wood({ base: [120, 86, 52] })}</RBox></group>)}
        {/* el frente de roca con las vetas amarillas */}
        <mesh position={[0, 0.23, -0.62]}><planeGeometry args={[0.4, 0.46]} /><meshStandardMaterial map={dirtT([150, 120, 60])} roughness={1} /></mesh>
        {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.32, 0.06 + rn(i, 2) * 0.36, -0.615]} rotation={[0, 0, rn(i, 3) * PI]}><planeGeometry args={[0.08, 0.012]} /><meshStandardMaterial color="#e8d040" emissive="#c8b020" emissiveIntensity={0.4} /></mesh>)}
        {/* el minero con el taladro */}
        <group position={[0.02, 0, -0.3]}><Stickman escala={0.17} rotY={160} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={7} contacto={0.2} colorContacto="#2a1a10" color="#d8c8a8" /></group>
        <group position={[0.02 + vib, 0.17, -0.48]}>
          <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.14, 14]} /><meshStandardMaterial color="#5a5e62" metalness={0.6} roughness={0.4} /></mesh>
          <mesh position={[0, 0, -0.11]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.006, 0.006, 0.1, 8]} />{M.steel()}</mesh>
        </group>
        <Sparks tt={tt} p={[0.02, 0.17, -0.6]} n={16} spread={0.08} fall={0.3} />
        {/* la lámpara colgada */}
        <mesh position={[0, 0.4, -0.05]}><sphereGeometry args={[0.018, 12, 10]} />{M.glow({ col: "#ffd27a" })}</mesh>
        <pointLight position={[0, 0.38, -0.05]} intensity={3.2} distance={1.6} color="#ffc070" />
        <pointLight position={[0, 0.3, 0.6]} intensity={1.2} distance={1.6} color="#ffe0b0" />
        {Array.from({ length: 50 }, (_, i) => { const ph = (tt * 0.05 + rn(i, 1)) % 1; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.34, 0.05 + rn(i, 3) * 0.36 + 0.02 * Math.sin(tt + i), 0.5 - ph * 1.1]}>
          <sphereGeometry args={[0.005 + rn(i, 4) * 0.006, 6, 4]} /><meshBasicMaterial color="#f0dc50" transparent opacity={0.6} depthWrite={false} /></mesh>; })}
      </group>
      <directionalLight position={[2, 3, 2]} intensity={1.6} color="#fff0d8" />
    </>;
  }}</U3>;
};

// ---- FiebreGeiger · la meseta de arriba con decenas de bocas de mina que se abren de a una; en primer plano el contador Geiger:
// la aguja salta y las bocas se multiplican en «miles» ----
const FiebreGeiger: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "miles", 1.6);
  return <U3 d={d} bg={p.bg} ground={[176, 112, 74]} mode="drop" sky="#d8b088" key1={[-1.4, 3.0, 1.6]}
    cam={{ at: [0, 0.15, -0.1], az: [-0.25, -0.1], el: [0.34, 0.3], r: [2.0, 1.8], fov: 38 }}>{(tt) => {
    const hits = Array.from({ length: 30 }, (_, i) => i < 6 ? 0.3 + i * 0.35 : aM + (i - 6) * 0.06);
    const n = hits.filter((a) => tt > a).length;
    const needle = -1.1 + 2.0 * cl(n / 30) + 0.1 * Math.sin(tt * 2 * PI * 1.8) * cl(n / 6);
    return <>
      {hits.map((a, i) => { const x = -1.3 + (i % 6) * 0.5 + (rn(i, 1) - 0.5) * 0.2, z = -1.3 + Math.floor(i / 6) * 0.32 + (rn(i, 2) - 0.5) * 0.1;
        return <group key={i} position={[x, 0, z]} scale={pop(tt, a)}>
          <mesh scale={[1.4, 0.55, 1]}><sphereGeometry args={[0.1, 16, 10, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial color="#9a5a3a" roughness={1} /></mesh>
          <mesh position={[0, 0, 0.1]}><circleGeometry args={[0.05, 16, 0, PI]} /><meshBasicMaterial color="#0a0604" /></mesh>
          <RBox s={[0.12, 0.014, 0.014]} r={0.003} p={[0, 0.055, 0.102]}>{M.wood({ base: [120, 86, 52] })}</RBox>
          <mesh position={[0.12, 0.015, 0.05]}><dodecahedronGeometry args={[0.025, 0]} /><meshStandardMaterial color="#e0c850" roughness={0.9} flatShading /></mesh>
        </group>; })}
      {/* el contador Geiger grande, de frente a la cámara */}
      <group position={[0.55, 0.12, 0.55]} rotation={[0.75, -0.25, 0]} scale={1.8}>
        <RBox s={[0.36, 0.1, 0.24]} r={0.02}><meshStandardMaterial color="#6a6a52" roughness={0.6} metalness={0.2} /></RBox>
        <mesh position={[0, 0.051, -0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.1, 32, 0, PI]} /><meshStandardMaterial color="#f4ecd4" /></mesh>
        {Array.from({ length: 9 }, (_, i) => { const an = PI * i / 8; return <RBox key={i} s={[0.004, 0.016, 0.002]} r={0.001} p={[Math.cos(an) * 0.085, 0.052, -0.02 - Math.sin(an) * 0.085]} rot={[-PI / 2, 0, an - PI / 2]}><meshStandardMaterial color={i > 5 ? "#c8281e" : "#2a2a2a"} /></RBox>; })}
        <group position={[0, 0.054, -0.02]} rotation={[-PI / 2, 0, 0]}><group rotation={[0, 0, -needle]}><RBox s={[0.008, 0.09, 0.003]} r={0.002} p={[0, 0.042, 0]}><meshStandardMaterial color="#c8281e" /></RBox></group></group>
        <mesh position={[0.24, 0.0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.022, 0.022, 0.2, 14]} />{M.steel({ col: "#9a9e90" })}</mesh>
      </group>
      <directionalLight position={[2, 3, 2]} intensity={1.8} color="#fff0d8" />
      <hemisphereLight args={["#f0e0c8", "#6a4a34", 0.5]} />
    </>;
  }}</U3>;
};

// ---- RadonPulmon · el túnel cerrado de costado, cortado como una maqueta: un gas apenas visible se junta en el techo y baja; el
// minero respira y en su pecho transparente los pulmones se llenan de puntitos que se quedan ----
const RadonPulmon: React.FC<UP> = ({ d, p }) => {
  const aR = sec(p, "radon", 1.4);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-1.0, 2.4, 1.6]} backDim={0.2}
    cam={{ at: [0, 0.32, 0], at1: [0.3, 0.36, 0], az: [-0.1, 0.05], el: [0.08, 0.06], r: [1.6, 1.15], fov: 36 }}>{(tt) => {
    const gas = eio(tt, aR, aR + 2.0), breath = 0.5 + 0.5 * Math.sin(tt * 2 * PI * 0.35), fill = cl((tt - aR - 0.6) / 3);
    return <>
      <mesh position={[0, 0.3, -0.2]}><boxGeometry args={[2.0, 0.7, 0.05]} /><meshStandardMaterial map={dirtT([110, 66, 46])} roughness={1} /></mesh>
      <mesh position={[0, -0.02, 0]}><boxGeometry args={[2.0, 0.04, 0.5]} /><meshStandardMaterial map={dirtT([120, 76, 52])} roughness={1} /></mesh>
      <mesh position={[0, 0.66, 0]}><boxGeometry args={[2.0, 0.04, 0.5]} /><meshStandardMaterial map={dirtT([110, 66, 46])} roughness={1} /></mesh>
      <mesh position={[-1.0, 0.32, 0]}><boxGeometry args={[0.04, 0.7, 0.5]} /><meshStandardMaterial map={dirtT([100, 60, 40])} roughness={1} /></mesh>
      {Array.from({ length: 70 }, (_, i) => { const y = 0.62 - rn(i, 2) * 0.55 * gas; return <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.9 + 0.03 * Math.sin(tt * 0.6 + i), y, (rn(i, 3) - 0.5) * 0.4]}>
        <sphereGeometry args={[0.026, 8, 6]} /><meshBasicMaterial color="#a8f060" transparent opacity={0.12 + 0.45 * gas} depthWrite={false} /></mesh>; })}
      <mesh position={[0, 0.64 - (0.02 + 0.5 * gas) / 2, 0]}><boxGeometry args={[1.96, 0.02 + 0.5 * gas, 0.45]} /><meshBasicMaterial color="#9ae050" transparent opacity={0.16} depthWrite={false} /></mesh>
      <group position={[0.15, 0.02, 0.05]}><Stickman escala={0.13} rotY={-60} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={8} contacto={0.2} colorContacto="#1a0e08" color="#7a6a50" /></group>
      {/* el pecho transparente con los pulmones, al costado, grande */}
      <group position={[0.6, 0.32, 0.1]} scale={1 + 0.06 * breath}>
        <mesh scale={[1, 1.2, 0.6]}><sphereGeometry args={[0.16, 24, 18]} />{M.glass({ op: 0.18 })}</mesh>
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.06, 0, 0]} scale={[0.8, 1.3, 0.7]}><sphereGeometry args={[0.07, 20, 14]} /><meshStandardMaterial color="#d88a80" roughness={0.7} transparent opacity={0.9} /></mesh>)}
        {Array.from({ length: 50 }, (_, i) => <mesh key={i} position={[(i % 2 ? 1 : -1) * (0.03 + rn(i, 1) * 0.05), (rn(i, 2) - 0.5) * 0.16, 0.05]} scale={sm(cl(fill * 50 - i))}>
          <sphereGeometry args={[0.011, 6, 4]} /><meshBasicMaterial color="#c8f070" /></mesh>)}
      </group>
      <pointLight position={[0.2, 0.55, 0.3]} intensity={1.2} distance={1.4} color="#ffd090" />
      <pointLight position={[0.6, 0.35, 0.4]} intensity={0.4 + 0.8 * fill} distance={0.7} color="#c8f070" />
    </>;
  }}</U3>;
};

// ---- ComerAfuera · el veterano sale del túnel con la lonchera y se sienta al sol, en una piedra; los nuevos comen adentro, en la
// penumbra con el polvo amarillo ----
const ComerAfuera: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aA = Math.min(sec(p, "afuera", 1.2), D - 2.0);
  return <U3 d={d} bg={p.bg} ground={null} mode="drop" sky="#d8b088" key1={[1.6, 3.0, 1.6]}
    cam={{ at: [0.25, 0.16, 0.2], az: [-0.4, -0.28], el: [0.14, 0.1], r: [1.25, 1.05], fov: 36 }}>{(tt) => {
    const w = eio(tt, aA, aA + 1.4);
    return <>
      <mesh position={[0, -0.02, 0.6]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 3]} /><meshStandardMaterial map={dirtT([180, 116, 76])} roughness={1} /></mesh>
      <mesh position={[-0.6, 0.5, -0.5]}><boxGeometry args={[1.4, 1.0, 1.0]} /><meshStandardMaterial map={dirtT([160, 86, 56])} roughness={1} /></mesh>
      <mesh position={[-0.35, 0.18, 0.01]}><planeGeometry args={[0.3, 0.36]} /><meshStandardMaterial color="#3a2618" roughness={1} /></mesh>
      <mesh position={[1.6, 1.5, -2.2]}><circleGeometry args={[0.22, 32]} />{M.glow({ col: "#fff2c8" })}</mesh>
      {/* los de adentro en la penumbra */}
      {[-0.45, -0.28].map((x, i) => <group key={i} position={[x, 0, -0.08]}><Stickman escala={0.09} rotY={20} guion={[{ t: 0, accion: "sentarse", expr: "neutral" }]} semilla={20 + i} contacto={0} color="#5a4a3a" /></group>)}
      {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[-0.35 + (rn(i, 1) - 0.5) * 0.26, 0.05 + rn(i, 2) * 0.3, -0.05 + 0.02 * Math.sin(tt + i)]}><sphereGeometry args={[0.006, 6, 4]} /><meshBasicMaterial color="#e8d050" transparent opacity={0.6} depthWrite={false} /></mesh>)}
      <pointLight position={[-0.35, 0.3, 0.0]} intensity={0.5} distance={0.5} color="#ffc070" />
      {/* el veterano sale */}
      <group position={[lerp(-0.32, 0.45, w), 0, lerp(0.0, 0.35, w)]}>
        <Stickman escala={0.16} rotY={w < 0.99 ? 70 : 200} guion={[{ t: 0, accion: "idle", expr: "decidido" }, { t: aA, accion: "caminar", expr: "decidido" }, { t: aA + 1.4, accion: "sentarse", expr: "feliz" }] as any} semilla={23} contacto={0.3} colorContacto="#5a3a24" color="#e8e4dc" />
        <RBox s={[0.15, 0.1, 0.08]} r={0.014} p={[0.09, w > 0.98 ? 0.06 : 0.14, 0.07]}><meshStandardMaterial color="#9aa0a6" metalness={0.7} roughness={0.3} /></RBox>
      </group>
      <mesh position={[0.45, 0.04, 0.35]} scale={[1.3, 0.6, 1]}><dodecahedronGeometry args={[0.08, 0]} /><meshStandardMaterial color="#9a6a4a" roughness={1} flatShading /></mesh>
      <directionalLight position={[2, 3, 2]} intensity={2.0} color="#fff0d0" />
    </>;
  }}</U3>;
};

// ---- TreintaAnios · un calendario de pared en el desierto: las hojas vuelan una tras otra de 1952 a 1990 (los años en un tambor
// grande); el minero envejece en la silla (se encorva, el color se apaga); en «ley» cae un sobre en la mesa ----
const TreintaAnios: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aL = Math.min(sec(p, "ley", D - 1.6), D - 1.0), R = Math.max(1, aL - 0.3);
  const yr = (tt: number) => Math.round(lerp(1952, 1990, eio(tt, 0.3, R)));
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" key1={[-1.0, 2.4, 1.6]} backDim={0.3}
    cam={{ at: [0, 0.35, 0], az: [-0.3, -0.1], el: [0.1, 0.1], r: [1.5, 1.35], fov: 36 }}
    over={(tt) => <Drums v={yr(tt)} n={4} x={1330} y={120} s={1.0} />}>{(tt) => {
    const k = eio(tt, 0.3, R), col = new THREE.Color("#d8a870").lerp(new THREE.Color("#b8aca0"), k);
    return <>
      <RBox s={[2.2, 1.2, 0.04]} r={0.01} p={[0, 0.6, -0.4]}><meshStandardMaterial map={dirtT([200, 180, 150])} roughness={0.95} /></RBox>
      {/* el taco del calendario y las hojas que vuelan */}
      <RBox s={[0.3, 0.38, 0.03]} r={0.006} p={[-0.45, 0.78, -0.36]}><meshStandardMaterial color="#f4eee0" /></RBox>
      {Array.from({ length: 16 }, (_, i) => { const a = 0.3 + i * (R - 0.3) / 16, ph = cl((tt - a) / 0.9); return <mesh key={i} position={[-0.45 + ph * (0.3 + rn(i, 1) * 0.6), 0.78 + ph * (0.2 - rn(i, 2) * 0.5), -0.33 + ph * 0.5]} rotation={[ph * 2, ph * 3 * (rn(i, 3) - 0.5), ph * 2]} visible={ph > 0 && ph < 1}>
        <planeGeometry args={[0.28, 0.36]} /><meshStandardMaterial color="#f8f2e4" side={THREE.DoubleSide} /></mesh>; })}
      <group position={[0.2, 0, 0]}>
        <RBox s={[0.2, 0.02, 0.2]} r={0.004} p={[0, 0.22, 0]}>{M.wood({ base: [120, 84, 50] })}</RBox>
        <RBox s={[0.2, 0.25, 0.02]} r={0.004} p={[0, 0.34, -0.1]}>{M.wood({ base: [120, 84, 50] })}</RBox>
        <group position={[0, 0.0, 0.0]}><Stickman escala={0.14} rotY={-20} guion={[{ t: 0, accion: "sentarse", expr: "neutral" }, { t: R * 0.6, accion: "sentarse", expr: "triste" }] as any} semilla={30} contacto={0} color={`#${col.getHexString()}`} /></group>
      </group>
      <RBox s={[0.4, 0.02, 0.3]} r={0.006} p={[0.65, 0.3, 0.05]}>{M.wood({ base: [140, 100, 60] })}</RBox>
      <group position={[0.65, 0.315 + fallY(tt, aL, 0.5), 0.05]} scale={tt > aL - 0.5 ? 1 : 0.001} rotation={[0, 0.3, 0]}>
        <RBox s={[0.2, 0.008, 0.12]} r={0.002}><meshStandardMaterial color="#e8dcc0" /></RBox></group>
      <pointLight position={[0.4, 0.9, 0.5]} intensity={1.4} distance={2.4} color="#ffe0b0" />
    </>;
  }}</U3>;
};

// ---- RankingSiglo · seis lámparas de mina colgadas de una viga; cada una arde un tiempo distinto (10 min, 5, 1, 8 s, 30 min) y se
// apaga; la sexta, la del uranio, nunca se apaga: sigue sola encendida ----
const RankingSiglo: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aK = ["breaker", "culebra", "pinboy", "remachador", "soldadora", "uranio"].map((k, i) => Math.min(sec(p, k, 0.6 + i * 1.0), D - 1.0));
  const life = [2.4, 1.8, 1.1, 0.4, 2.8, 99];
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="drop" key1={[-1.0, 2.6, 1.8]} backDim={0.2}
    cam={{ at: [0, 0.68, 0], az: [-0.1, 0.1], el: [0.06, 0.08], r: [1.8, 1.65], fov: 36 }}>{(tt) => <>
    <RBox s={[2.6, 0.06, 0.08]} r={0.01} p={[0, 1.05, 0]}><meshStandardMaterial color="#5a3a24" roughness={0.8} /></RBox>
    {aK.map((a, i) => { const x = (i - 2.5) * 0.34, on = eio(tt, a, a + 0.3) * (1 - eio(tt, a + life[i], a + life[i] + 0.4)), fuel = 1 - cl((tt - a) / Math.min(life[i], 30)) * (i === 5 ? 0 : 1), sw = 0.05 * Math.sin(tt * 1.3 + i);
      return <group key={i} position={[x, 1.02, 0]} rotation={[0, 0, sw]}>
        <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.002, 0.002, 0.24, 4]} /><meshStandardMaterial color="#222" /></mesh>
        <group position={[0, -0.32, 0]} scale={1.9}>
          <mesh position={[0, 0.032, 0]} scale={[1, sm(fuel), 1]}><cylinderGeometry args={[0.036, 0.036, 0.03, 16]} /><meshStandardMaterial color="#7a5a20" transparent opacity={0.85} /></mesh>
          <mesh geometry={latheG("lampMina29d", [[0, 0.12], [0.03, 0.12], [0.05, 0.09], [0.05, 0.02], [0.035, 0], [0, 0]], 24)}>{M.brass({ col: "#b8904a" })}</mesh>
          <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.042, 0.042, 0.07, 20]} />{M.glass({ op: 0.4 })}</mesh>
          <mesh position={[0, 0.055, 0]} scale={[0.6 + 0.4 * fuel, (0.5 + 0.5 * fuel) * (1 + 0.15 * Math.sin(tt * 2 * PI * 1.2 + i)), 0.6 + 0.4 * fuel]}><coneGeometry args={[0.016, 0.05, 10]} /><meshBasicMaterial color={i === 5 ? "#d8f070" : "#ffb040"} transparent opacity={Math.max(0.0, on)} toneMapped={false} /></mesh>
          <pointLight position={[0, 0.06, 0.05]} intensity={0.0001 + 2.4 * on} distance={1.2} color={i === 5 ? "#c8f070" : "#ffa040"} />
        </group>
      </group>; })}
    <pointLight position={[0, 1.6, 1.0]} intensity={0.5} distance={3} color="#d8e0f0" />
  </>}</U3>;
};

// ---- CieloNegro · desde adentro de la cabina: el panel de relojes abajo, la ventanita; el cielo pasa de azul a negro mientras el
// altímetro sube; en «negro» aparece la curva de la Tierra ----
const CieloNegro: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aN = Math.min(sec(p, "negro", 2.4), D - 1.2);
  const alt = (tt: number) => Math.round(lerp(12, 100, eio(tt, 0.2, aN + 0.4)));
  return <U3 d={d} bg={p.bg} ground={null} mode="iris" sky="#0a0c12" key1={[-0.6, 2.0, 1.6]} backDim={0.1}
    cam={{ at: [0, 0.44, -0.3], az: [-0.04, 0.04], el: [0.16, 0.14], r: [1.1, 1.0], fov: 40 }}
    over={(tt) => <Drums v={alt(tt)} n={3} x={1440} y={110} s={1.05} unit="km" />}>{(tt) => {
    const k = eio(tt, 0.2, aN + 0.4), skyC = new THREE.Color("#5a9ad8").lerp(new THREE.Color("#04060c"), k), shake = 0.003 * Math.sin(tt * 37);
    return <group position={[shake, shake * 0.6, 0]}>
      {/* el vidrio: un plano con el cielo, la Tierra que asoma abajo */}
      <mesh position={[0, 0.55, -0.7]}><planeGeometry args={[1.6, 0.9]} /><meshBasicMaterial color={skyC} /></mesh>
      <mesh position={[0, -0.75 - 0.22 * k, -0.69]}><circleGeometry args={[1.2, 64, 0, PI]} /><meshBasicMaterial color={new THREE.Color("#c8d8e8").lerp(new THREE.Color("#3a6aa8"), k)} /></mesh>
      <mesh position={[0, -0.75 - 0.22 * k, -0.695]}><circleGeometry args={[1.25, 64, 0, PI]} /><meshBasicMaterial color="#9ad0ff" transparent opacity={0.3 + 0.5 * k} /></mesh>
      {Array.from({ length: 60 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.5, 0.55 + rn(i, 2) * 0.42, -0.68]}><circleGeometry args={[0.004 + rn(i, 3) * 0.004, 6]} /><meshBasicMaterial color="#fff" transparent opacity={cl((k - 0.6) * 3)} /></mesh>)}
      {/* el marco de la ventana */}
      {[[0, 1.0, 1.7, 0.12], [0, 0.12, 1.7, 0.14], [-0.8, 0.55, 0.12, 1.0], [0.8, 0.55, 0.12, 1.0], [0, 0.55, 0.04, 0.9]].map(([x, y, w, h], i) => <RBox key={i} s={[w, h, 0.05]} r={0.01} p={[x, y, -0.66]}><meshStandardMaterial color="#1a1c1e" metalness={0.5} roughness={0.5} /></RBox>)}
      {/* el panel de relojes */}
      <RBox s={[1.5, 0.3, 0.2]} r={0.02} p={[0, 0.05, -0.45]} rot={[-0.4, 0, 0]}><meshStandardMaterial color="#202224" metalness={0.3} roughness={0.6} /></RBox>
      {Array.from({ length: 9 }, (_, i) => { const x = (i - 4) * 0.15; return <group key={i} position={[x, 0.1, -0.36]} rotation={[-0.4, 0, 0]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.02, 24]} />{M.chrome({ col: "#8a8e90" })}</mesh>
        <mesh position={[0, 0, 0.011]}><circleGeometry args={[0.042, 24]} /><meshStandardMaterial color="#0e0e10" emissive="#203020" emissiveIntensity={0.3} /></mesh>
        <group position={[0, 0, 0.013]} rotation={[0, 0, -(i * 0.7 + k * (1 + rn(i, 1) * 3) + 0.05 * Math.sin(tt * 3 + i))]}><RBox s={[0.004, 0.036, 0.002]} r={0.001} p={[0, 0.016, 0]}>{M.glow({ col: i === 4 ? "#ff6a40" : "#d8f0c8" })}</RBox></group>
      </group>; })}
      <pointLight position={[0, 0.3, 0.2]} intensity={0.8} distance={1.5} color="#c8d8ff" />
    </group>;
  }}</U3>;
};

// ---- X15Bombardero · el avión cohete negro cuelga bajo el ala del bombardero, muy alto; en «suelta» cae, se enciende el motor y sale
// disparado hacia arriba dejando la estela ----
const X15Bombardero: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aS = Math.min(sec(p, "suelta", 1.6), D - 1.8);
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#4a7ab0" key1={[-1.4, 3.0, 1.6]}
    cam={{ at: [0.1, 0.72, 0], at1: [0.25, 0.75, 0], az: [-0.45, -0.3], el: [0.06, 0.04], r: [1.5, 1.35], fov: 38 }}>{(tt) => {
    const dt = Math.max(0, tt - aS), drop = Math.min(0.12, 0.5 * dt * dt), go = cl((dt - 0.5) / 1.6), g2 = go * go;
    const fire = cl((dt - 0.45) * 4), pitch = 0.35 * go, X = 0.3 + 0.15 * go, Y = 0.8 - drop + 0.2 * go;
    return <>
      {/* las nubes muy abajo, que se alejan */}
      {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 8 - 2.5 * g2, -1.4 - rn(i, 2) * 0.4 - 1.2 * g2, (rn(i, 3) - 0.5) * 6]} scale={[1.5 + rn(i, 4) * 2, 0.3, 1 + rn(i, 5)]}><sphereGeometry args={[0.3, 12, 8]} /><meshStandardMaterial color="#f4f6f8" roughness={1} /></mesh>)}
      {/* el ala del bombardero: queda atrás */}
      <group position={[-0.2 - 0.05 * tt - 1.8 * g2, 1.0 - 0.5 * g2, -0.1]}>
        <RBox s={[1.4, 0.04, 0.4]} r={0.02} rot={[0, 0.3, 0]}><meshStandardMaterial color="#c8ccd0" metalness={0.7} roughness={0.35} /></RBox>
        <mesh position={[-0.2, -0.06, 0.1]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.05, 0.05, 0.3, 16]} /><meshStandardMaterial color="#9a9ea2" metalness={0.7} roughness={0.35} /></mesh>
        <mesh position={[0.3, -0.06, 0]}><boxGeometry args={[0.04, 0.12, 0.04]} /><meshStandardMaterial color="#5a5e62" /></mesh>
      </group>
      {/* el X-15 */}
      <group position={[X - 0.05 * Math.min(tt, aS), Y, -0.02]} rotation={[0, 0, pitch]} scale={1.3}>
        <mesh rotation={[0, 0, -PI / 2]}><capsuleGeometry args={[0.035, 0.42, 8, 16]} /><meshStandardMaterial color="#1e1e22" metalness={0.6} roughness={0.3} /></mesh>
        <mesh position={[0.27, 0, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.035, 0.1, 16]} /><meshStandardMaterial color="#1e1e22" metalness={0.6} roughness={0.3} /></mesh>
        <RBox s={[0.12, 0.006, 0.2]} r={0.003} p={[-0.02, -0.01, 0]}><meshStandardMaterial color="#1e1e22" metalness={0.6} roughness={0.3} /></RBox>
        <RBox s={[0.1, 0.12, 0.006]} r={0.003} p={[-0.2, 0.06, 0]}><meshStandardMaterial color="#1e1e22" metalness={0.6} roughness={0.3} /></RBox>
        <mesh position={[-0.33, 0, 0]} rotation={[0, 0, PI / 2]} scale={[1, sm(fire) * (1 + 0.12 * Math.sin(tt * 2 * PI * 1.8)), 1]}><coneGeometry args={[0.032, 0.26, 14]} /><meshBasicMaterial color="#ffd8a0" transparent opacity={0.9} toneMapped={false} /></mesh>
        <pointLight position={[-0.38, 0, 0]} intensity={0.0001 + 3 * fire} distance={1.2} color="#ffb060" />
      </group>
      {/* la estela sale de la tobera hacia atrás */}
      {Array.from({ length: 26 }, (_, i) => { const u = i / 26, dist = 0.5 + u * 1.8; return <mesh key={"t" + i} position={[X - 0.05 * Math.min(tt, aS) - Math.cos(pitch) * dist, Y - Math.sin(pitch) * dist - 0.15 * u * u, -0.02]} scale={sm(fire * (0.7 + u * 1.6))}>
        <sphereGeometry args={[0.03, 8, 6]} /><meshBasicMaterial color="#f4f6f8" transparent opacity={0.55 * (1 - u * 0.6)} depthWrite={false} /></mesh>; })}
      <directionalLight position={[2, 3, 1]} intensity={1.8} color="#fff4e0" />
      <hemisphereLight args={["#c8dcf0", "#8a9aaa", 0.6]} />
    </>;
  }}</U3>;
};

// ---- CallesPilotos · la calle recta de la base, de noche; a cada lado, de a uno, se van clavando postes de calle (una semana, un
// poste), hasta que la avenida se llena ----
const CallesPilotos: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aS = Math.min(sec(p, "semana", 1.0), 1.2), n = 20, step = Math.max(0.1, (D - aS - 0.8) / n);
  return <U3 d={d} bg={p.bg} ground={[120, 108, 90]} mode="drop" sky="#1e2436" key1={[-1.4, 3.0, 1.6]}
    cam={{ at: [0, 0.22, -0.4], az: [-0.14, 0.06], el: [0.22, 0.18], r: [1.7, 1.55], fov: 38 }}>{(tt) => <>
    <mesh position={[0, 0.002, -1.0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.5, 5]} /><meshStandardMaterial color="#2a2a2c" roughness={0.9} /></mesh>
    {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[0, 0.004, 0.8 - i * 0.3]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.02, 0.12]} /><meshBasicMaterial color="#e8d890" /></mesh>)}
    {Array.from({ length: n }, (_, i) => { const a = aS + i * step, s = i % 2 ? 1 : -1, z = 0.6 - Math.floor(i / 2) * 0.34, on = pop(tt, a), lit = eio(tt, a + 0.2, a + 0.5);
      return <group key={i} position={[s * 0.36, 0, z]}>
        <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]} scale={sm(on)}><circleGeometry args={[0.06, 16]} /><meshBasicMaterial color="#000" transparent opacity={0.4} depthWrite={false} /></mesh>
        <group position={[0, 0.5 * (1 - Math.min(1, on)), 0]} scale={sm(on)}>
          <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.014, 0.018, 0.5, 10]} />{M.steel({ col: "#5a6a5a" })}</mesh>
          <RBox s={[0.24, 0.06, 0.012]} r={0.006} p={[s * -0.09, 0.38, 0]}><meshStandardMaterial color="#2a7a3a" roughness={0.5} /></RBox>
          <RBox s={[0.18, 0.012, 0.014]} r={0.003} p={[s * -0.09, 0.385, 0]}><meshStandardMaterial color="#f0f0e8" roughness={0.5} /></RBox>
          <mesh position={[s * -0.06, 0.5, 0]}><sphereGeometry args={[0.022, 12, 10]} /><meshStandardMaterial color="#fff0c0" emissive="#ffd890" emissiveIntensity={0.2 + 1.8 * lit} /></mesh>
        </group>
      </group>; })}
    {[-1, 1].map((s) => <spotLight key={s} position={[s * 0.6, 1.4, 0.6]} angle={0.55} penumbra={0.8} intensity={5} distance={4} color="#ffe0b0" />)}
    <hemisphereLight args={["#6a7aa0", "#3a3028", 0.6]} />
  </>}</U3>;
};

// ---- PanelMemoria · el veterano sentado frente al panel con los ojos tapados por la mano: va tocando interruptor por interruptor y
// cada uno se enciende sin errar; al final el panel entero queda verde ----
const PanelMemoria: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aM = sec(p, "memoria", 1.0), n = 24, step = Math.max(0.08, (D - aM - 1.0) / n);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-1.0, 2.4, 1.6]} backDim={0.35}
    cam={{ at: [0, 0.4, 0], az: [-0.5, -0.3], el: [0.16, 0.12], r: [1.3, 1.1], fov: 36 }}>{(tt) => {
    const cur = Math.min(n - 1, Math.max(0, Math.floor((tt - aM) / step)));
    return <>
      <RBox s={[1.2, 0.5, 0.06]} r={0.02} p={[0, 0.45, -0.3]} rot={[-0.25, 0, 0]}><meshStandardMaterial color="#26282a" metalness={0.3} roughness={0.6} /></RBox>
      {Array.from({ length: n }, (_, i) => { const x = (i % 8 - 3.5) * 0.12, y = 0.6 - Math.floor(i / 8) * 0.13, on = eio(tt, aM + i * step, aM + i * step + 0.15);
        return <group key={i} position={[x, y, -0.25 + (0.6 - y) * 0.25]} rotation={[-0.25, 0, 0]}>
          <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />{M.chrome({ col: "#7a7e80" })}</mesh>
          <mesh position={[0, 0.02 * (1 - 2 * on), 0.03]} rotation={[0.5 - 1.0 * on, 0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.05, 8]} />{M.chrome()}</mesh>
          <mesh position={[0.035, 0.03, 0.012]}><sphereGeometry args={[0.014, 12, 10]} /><meshStandardMaterial color={on > 0.5 ? "#50ff80" : "#4a1a1a"} emissive={on > 0.5 ? "#40ff70" : "#000"} emissiveIntensity={2.6 * on} toneMapped={false} /></mesh>
        </group>; })}
      <group position={[0.0, 0, 0.35]}><Stickman escala={0.15} rotY={180} guion={[{ t: 0, accion: "sentarse", expr: "decidido" }]} semilla={44} contacto={0} color="#c8ccd0" /></group>
      {/* la mano que toca */}
      {tt > aM && <mesh position={[((cur % 8) - 3.5) * 0.12 + 0.02, 0.6 - Math.floor(cur / 8) * 0.13 - 0.03, -0.18 + (Math.floor(cur / 8) * 0.13) * 0.25]}><sphereGeometry args={[0.03, 14, 10]} /><meshStandardMaterial color="#c8ccd0" roughness={0.6} /></mesh>}
      <pointLight position={[0, 0.5, 0.3]} intensity={0.3 + 1.2 * cl((tt - aM) / (n * step))} distance={1.4} color="#60f090" />
    </>;
  }}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { CascoChispas, CuatroDias, PielLuz, FondoCasco, TopCincoSiglo, MinaAmarilla, FiebreGeiger, RadonPulmon, ComerAfuera, TreintaAnios, RankingSiglo, CieloNegro, X15Bombardero, CallesPilotos, PanelMemoria };
