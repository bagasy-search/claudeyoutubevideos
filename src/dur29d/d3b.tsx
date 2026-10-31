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
        <group position={[x, y === 0.85 ? 0.36 : 0, z]}><Stickman escala={0.11} rotY={x < 0 ? 70 : -70} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={i + 2} contacto={0.3} colorContacto="#0a0a0c" color="#4a5a6a" /></group>
        <mesh position={[x + (x < 0 ? 0.09 : -0.09), (y === 0.85 ? 0.36 : 0) + 0.2, z]}><sphereGeometry args={[0.012, 10, 8]} />{M.glow({ col: "#cfe4ff" })}</mesh>
        <pointLight position={[x + (x < 0 ? 0.1 : -0.1), (y === 0.85 ? 0.36 : 0) + 0.22, z + 0.05]} intensity={2.2 * fl} distance={1.0} color="#8ab8ff" />
        <Sparks tt={tt + i * 0.3} p={[x + (x < 0 ? 0.09 : -0.09), (y === 0.85 ? 0.36 : 0) + 0.2, z]} n={22} spread={0.15} fall={0.5} />
      </group>; })}
    {/* lluvia de chispas desde la cubierta */}
    {Array.from({ length: 60 }, (_, i) => { const ph = (tt * 0.9 + rn(i, 1)) % 1; return <mesh key={"r" + i} position={[(rn(i, 2) - 0.5) * 0.9, 1.05 - ph * 1.05, 0.4 - rn(i, 3) * 2.2]} scale={sm(1 - ph * 0.6)}>
      <boxGeometry args={[0.004, 0.03, 0.004]} />{M.glow({ col: "#ffb040", op: 0.85 })}</mesh>; })}
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
        {[-1, 1].map((s) => <mesh key={s} position={[0, 0.2, s * 0.2]} scale={[sm(plates), 1, 1]} rotation={[s * 0.25, 0, 0]}><boxGeometry args={[L, 0.3, 0.012]} /><meshStandardMaterial color="#6a7480" metalness={0.5} roughness={0.5} /></mesh>)}
        <group scale={[1, 1, 1]} visible={deck > 0.01}>
          <mesh position={[0, 0.34, 0]} scale={[sm(deck), 1, 1]}><boxGeometry args={[L, 0.015, 0.44]} /><meshStandardMaterial color="#7a6a5a" roughness={0.8} /></mesh>
          <RBox s={[0.22, 0.16 * deck + 0.001, 0.3]} r={0.01} p={[0.25, 0.42, 0]}><meshStandardMaterial color="#e8e4dc" roughness={0.6} /></RBox>
          <mesh position={[0.25, 0.56, 0]} scale={[1, sm(deck), 1]}><cylinderGeometry args={[0.04, 0.045, 0.14, 16]} /><meshStandardMaterial color="#2a2a2a" /></mesh>
        </group>
        {ribs > 0 && slide < 0.1 && <Sparks tt={tt} p={[-L / 2 + Math.min(13, ribs) * 0.128, 0.3, 0.22]} n={20} spread={0.12} />}
      </group>
      {/* las dos grúas de la grada */}
      {[-1, 1].map((s) => <group key={s} position={[s * 0.8, 0, -0.5]}>
        <mesh position={[0, 0.7, 0]}><boxGeometry args={[0.05, 1.4, 0.05]} /><meshStandardMaterial color="#c8a040" metalness={0.4} roughness={0.6} /></mesh>
        <group position={[0, 1.4, 0]} rotation={[0, s * 0.4 + 0.3 * Math.sin(tt * 0.5 + s), 0]}><mesh position={[0, 0, 0.4]}><boxGeometry args={[0.04, 0.04, 0.9]} /><meshStandardMaterial color="#c8a040" metalness={0.4} roughness={0.6} /></mesh></group>
      </group>)}
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
      </group>
      {/* el arco en el centro */}
      <mesh position={[0, 0.06, -0.25]}><sphereGeometry args={[0.02, 12, 10]} />{M.glow({ col: "#e0f0ff" })}</mesh>
      <pointLight position={[0, 0.12, -0.2]} intensity={3.5 * fl} distance={1.6} color="#a8c8ff" />
      <Sparks tt={tt} p={[0, 0.06, -0.25]} n={26} spread={0.2} fall={0.3} />
      <Watch tt={tt * (1 + 4 * eio(tt, aQ, aQ + 0.5))} p={[0, 0.03, 0.32]} s={1.3} />
    </>;
  }}</U3>;
};

// ---- FondoCasco · el corte del casco como una U enorme: arriba aire y luz; en el fondo, agachada en el hueco entre costillas, la
// soldadora; el humo del metal se junta abajo y no sale; el reloj de media hora corre ----
const FondoCasco: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "media", 2.0);
  return <U3 d={d} bg={p.bg} ground={null} mode="drop" sky="#1a1c20" key1={[-0.8, 2.6, 1.4]} backDim={0.2}
    cam={{ at: [0, 0.3, 0], at1: [0, 0.12, 0], az: [-0.1, 0.12], el: [0.3, 0.4], r: [1.7, 1.35], fov: 36 }}
    over={(tt) => <Drums v={Math.min(30, Math.floor(Math.max(0, tt - aM) * 6))} n={2} x={1500} y={110} s={1.1} unit="min" op={eio(tt, aM - 0.2, aM + 0.3)} />}>{(tt) => {
    const smoke = cl(tt / 6), fl = 0.8 + 0.2 * Math.sin(tt * 2 * PI * 1.5);
    return <>
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, PI]}><torusGeometry args={[0.6, 0.05, 10, 40, PI]} /><meshStandardMaterial color={HULL} metalness={0.6} roughness={0.5} /></mesh>
      <mesh position={[0, 0.6, -0.12]} rotation={[0, 0, PI]}><cylinderGeometry args={[0.62, 0.62, 0.02, 40, 1, false, -PI / 2, PI]} /><meshStandardMaterial color="#4a5056" metalness={0.5} roughness={0.6} side={THREE.DoubleSide} /></mesh>
      <group position={[0.02, 0.02, 0.0]}><Stickman escala={0.1} rotY={60} guion={[{ t: 0, accion: "sentarse", expr: "decidido" }]} semilla={5} contacto={0.2} colorContacto="#0a0a0c" color="#4a5a6a" /></group>
      <mesh position={[0.1, 0.06, 0.02]}><sphereGeometry args={[0.012, 10, 8]} />{M.glow({ col: "#cfe4ff" })}</mesh>
      <pointLight position={[0.1, 0.1, 0.1]} intensity={2.4 * fl} distance={0.9} color="#8ab8ff" />
      <Sparks tt={tt} p={[0.1, 0.06, 0.02]} n={20} spread={0.12} fall={0.15} />
      {/* el humo que se acumula en el fondo de la U */}
      {Array.from({ length: 26 }, (_, i) => { const ph = (tt * 0.12 + rn(i, 1)) % 1; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.7 * (0.4 + smoke), 0.05 + ph * 0.25 * (0.5 + smoke), (rn(i, 3) - 0.5) * 0.1]} scale={0.6 + rn(i, 4) + smoke}>
        <sphereGeometry args={[0.07, 10, 8]} /><meshBasicMaterial color="#8a8e7a" transparent opacity={0.12 + 0.18 * smoke} depthWrite={false} /></mesh>; })}
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
    cam={{ at: [0, 0.3, 0], az: [-0.2, 0.2], el: [0.2, 0.16], r: [2.2, 1.95], fov: 36 }}>{(tt) => <>
    {K.map((a, i) => { const x = (i - 2) * 0.42, z = -Math.abs(i - 2) * 0.1, on = eio(tt, a, a + 0.5), up = pop(tt, a);
      return <group key={i} position={[x, 0, z]}>
        <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.15, 0.17, 0.2, 32]} /><meshStandardMaterial color="#2a2624" roughness={0.5} metalness={0.2} /></mesh>
        <mesh position={[0, 0.201, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.13, 0.15, 32]} /><meshStandardMaterial color="#c8a050" emissive="#ffb040" emissiveIntensity={0.1 + 0.9 * on} /></mesh>
        <group position={[0, 0.21 + 0.03 * Math.sin(tt * 1.4 + i) * on, 0]} scale={Math.max(0.001, up) * 1.6} rotation={[0, tt * 0.4, 0]}>
          {i === 0 && <group position={[0, 0.05, 0]}><RBox s={[0.2, 0.012, 0.06]} r={0.002} p={[0, 0.045, 0]}><meshStandardMaterial color="#8a4a2a" metalness={0.5} roughness={0.6} /></RBox><RBox s={[0.2, 0.012, 0.06]} r={0.002} p={[0, -0.045, 0]}><meshStandardMaterial color="#8a4a2a" metalness={0.5} roughness={0.6} /></RBox><RBox s={[0.2, 0.09, 0.012]} r={0.002}><meshStandardMaterial color="#8a4a2a" metalness={0.5} roughness={0.6} /></RBox></group>}
          {i === 1 && <mesh position={[0, 0.05, 0]}><dodecahedronGeometry args={[0.06, 0]} /><meshStandardMaterial color="#141416" metalness={0.55} roughness={0.25} flatShading /></mesh>}
          {i === 2 && <Watch tt={tt} p={[0, 0.06, 0]} s={1} />}
          {i === 3 && <Cap p={[0, 0.0, 0]} s={1.1} />}
          {i === 4 && <Vial p={[0, 0, 0]} s={1.2} glow={0.8 * on * (0.7 + 0.3 * Math.sin(tt * 2 * PI * 0.8))} />}
        </group>
        <spotLight position={[x * 0.6, 1.6, 0.8]} angle={0.18} penumbra={0.6} intensity={0.5 + 9 * on} distance={2.6} color={i === 4 ? "#d8f080" : "#ffe0b0"} />
      </group>; })}
  </>}</U3>;
};

// ---- MinaAmarilla · el túnel angosto entra en la meseta roja; adentro, a la luz de una sola lámpara, el minero con el taladro y el
// polvo amarillo que flota y no sale; afuera el compresor late ----
const MinaAmarilla: React.FC<UP> = ({ d, p }) => {
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#c8a07a" key1={[-1.2, 2.8, 1.6]}
    cam={{ at: [0, 0.25, 0], at1: [0, 0.2, -0.6], az: [-0.1, 0.0], el: [0.12, 0.06], r: [2.1, 1.2], fov: 38 }}>{(tt) => <>
    <mesh position={[0, -0.02, 0.6]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 3]} /><meshStandardMaterial map={dirtT([176, 112, 74])} roughness={1} /></mesh>
    <mesh position={[0, 0.7, -0.9]}><boxGeometry args={[4, 1.5, 1.4]} /><meshStandardMaterial map={dirtT([160, 86, 56])} roughness={1} /></mesh>
    {/* la boca del túnel con el marco de madera */}
    <mesh position={[0, 0.2, -0.19]}><planeGeometry args={[0.36, 0.42]} /><meshBasicMaterial color="#120a06" /></mesh>
    {[-0.19, 0.19].map((x, i) => <RBox key={i} s={[0.04, 0.46, 0.05]} r={0.004} p={[x, 0.22, -0.17]}>{M.wood({ base: [110, 80, 50] })}</RBox>)}
    <RBox s={[0.46, 0.05, 0.06]} r={0.004} p={[0, 0.45, -0.17]}>{M.wood({ base: [110, 80, 50] })}</RBox>
    {/* adentro: el corredor visto a través */}
    <group position={[0, 0, -0.75]}>
      <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.34, 0.4, 1.1]} /><meshStandardMaterial color="#5a3424" roughness={1} side={THREE.BackSide} /></mesh>
      <group position={[0, 0, -0.25]}><Stickman escala={0.11} rotY={180} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={7} contacto={0.2} colorContacto="#2a1a10" color="#7a6a50" /></group>
      <mesh position={[0, 0.36, 0.1]}><sphereGeometry args={[0.012, 10, 8]} />{M.glow({ col: "#ffd27a" })}</mesh>
      <pointLight position={[0, 0.34, 0.1]} intensity={1.3} distance={0.9} color="#ffc070" />
      {Array.from({ length: 40 }, (_, i) => { const ph = (tt * 0.05 + rn(i, 1)) % 1; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.3, 0.05 + rn(i, 3) * 0.33 + 0.02 * Math.sin(tt + i), 0.4 - ph * 0.9]}>
        <sphereGeometry args={[0.006 + rn(i, 4) * 0.006, 6, 4]} /><meshBasicMaterial color="#e8d050" transparent opacity={0.55} depthWrite={false} /></mesh>; })}
    </group>
    {/* el compresor afuera */}
    <group position={[0.6, 0, 0.2]} scale={[1, 1 + 0.015 * Math.sin(tt * 2 * PI * 1.2), 1]}>
      <RBox s={[0.3, 0.18, 0.18]} r={0.02} p={[0, 0.12, 0]}><meshStandardMaterial color="#a83a2a" roughness={0.6} metalness={0.3} /></RBox>
      {[-0.1, 0.1].map((x, i) => <mesh key={i} position={[x, 0.03, 0.1]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.035, 0.035, 0.02, 14]} /><meshStandardMaterial color="#1a1a1a" /></mesh>)}
    </group>
    <mesh geometry={undefined} position={[0.3, 0.02, 0.0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.6, 6]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
    <directionalLight position={[2, 3, 2]} intensity={1.6} color="#fff0d8" />
  </>}</U3>;
};

// ---- FiebreGeiger · la meseta de arriba con decenas de bocas de mina que se abren de a una; en primer plano el contador Geiger:
// la aguja salta y las bocas se multiplican en «miles» ----
const FiebreGeiger: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "miles", 1.6);
  return <U3 d={d} bg={p.bg} ground={[176, 112, 74]} mode="drop" sky="#d8b088" key1={[-1.4, 3.0, 1.6]}
    cam={{ at: [0, 0.2, 0], az: [-0.35, -0.1], el: [0.5, 0.42], r: [2.6, 2.3], fov: 38 }}>{(tt) => {
    const needle = -0.9 + 1.5 * eio(tt, 0.4, 1.2) + 0.12 * Math.sin(tt * 2 * PI * 1.8) * eio(tt, 1.0, 1.4);
    return <>
      {[[-1.1, -1.2, 0.5], [0.7, -1.4, 0.4], [1.6, -0.6, 0.3], [-1.8, -0.4, 0.35]].map(([x, z, h], i) => <mesh key={i} position={[x, h / 2, z]}><boxGeometry args={[0.9, h, 0.7]} /><meshStandardMaterial map={dirtT([170, 92, 60])} roughness={1} /></mesh>)}
      {Array.from({ length: 40 }, (_, i) => { const a = aM + i * 0.06 - (i < 6 ? aM - 0.3 - i * 0.2 : 0); const x = (rn(i, 1) - 0.5) * 3.4, z = -0.2 - rn(i, 2) * 1.2;
        return <group key={i} position={[x, 0.001, z]} scale={pop(tt, a)}>
          <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.04, 14]} /><meshBasicMaterial color="#1a0e08" /></mesh>
          <mesh position={[0.05, 0.015, 0]}><dodecahedronGeometry args={[0.025, 0]} /><meshStandardMaterial color="#d8c060" roughness={0.9} flatShading /></mesh>
        </group>; })}
      {/* el contador en primer plano */}
      <group position={[0.35, 0.05, 0.75]} rotation={[-0.5, -0.3, 0]}>
        <RBox s={[0.36, 0.1, 0.24]} r={0.02}><meshStandardMaterial color="#5a5a46" roughness={0.6} metalness={0.2} /></RBox>
        <mesh position={[0, 0.051, -0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.09, 32, 0, PI]} /><meshStandardMaterial color="#f0e8d0" /></mesh>
        <group position={[0, 0.053, -0.02]} rotation={[-PI / 2, 0, 0]}><group rotation={[0, 0, -needle]}><RBox s={[0.004, 0.085, 0.002]} r={0.001} p={[0, 0.04, 0]}><meshStandardMaterial color="#c8281e" /></RBox></group></group>
        <mesh position={[0.24, 0.0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.018, 0.018, 0.2, 14]} />{M.steel({ col: "#9a9e90" })}</mesh>
      </group>
      <directionalLight position={[2, 3, 2]} intensity={1.6} color="#fff0d8" />
    </>;
  }}</U3>;
};

// ---- RadonPulmon · el túnel cerrado de costado, cortado como una maqueta: un gas apenas visible se junta en el techo y baja; el
// minero respira y en su pecho transparente los pulmones se llenan de puntitos que se quedan ----
const RadonPulmon: React.FC<UP> = ({ d, p }) => {
  const aR = sec(p, "radon", 1.4);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-1.0, 2.4, 1.6]} backDim={0.2}
    cam={{ at: [0, 0.3, 0], at1: [0.15, 0.4, 0], az: [-0.1, 0.05], el: [0.08, 0.06], r: [1.6, 1.05], fov: 36 }}>{(tt) => {
    const gas = eio(tt, aR, aR + 2.0), breath = 0.5 + 0.5 * Math.sin(tt * 2 * PI * 0.35), fill = cl((tt - aR - 0.6) / 3);
    return <>
      <mesh position={[0, 0.3, -0.2]}><boxGeometry args={[2.0, 0.7, 0.05]} /><meshStandardMaterial map={dirtT([110, 66, 46])} roughness={1} /></mesh>
      <mesh position={[0, -0.02, 0]}><boxGeometry args={[2.0, 0.04, 0.5]} /><meshStandardMaterial map={dirtT([120, 76, 52])} roughness={1} /></mesh>
      <mesh position={[0, 0.66, 0]}><boxGeometry args={[2.0, 0.04, 0.5]} /><meshStandardMaterial map={dirtT([110, 66, 46])} roughness={1} /></mesh>
      <mesh position={[-1.0, 0.32, 0]}><boxGeometry args={[0.04, 0.7, 0.5]} /><meshStandardMaterial map={dirtT([100, 60, 40])} roughness={1} /></mesh>
      {Array.from({ length: 70 }, (_, i) => { const y = 0.62 - rn(i, 2) * 0.55 * gas; return <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.9 + 0.03 * Math.sin(tt * 0.6 + i), y, (rn(i, 3) - 0.5) * 0.4]}>
        <sphereGeometry args={[0.012, 6, 4]} /><meshBasicMaterial color="#b8f070" transparent opacity={0.08 + 0.35 * gas} depthWrite={false} /></mesh>; })}
      <group position={[0.15, 0.02, 0.05]}><Stickman escala={0.13} rotY={-60} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={8} contacto={0.2} colorContacto="#1a0e08" color="#7a6a50" /></group>
      {/* el pecho transparente con los pulmones, al costado, grande */}
      <group position={[0.6, 0.32, 0.1]} scale={1 + 0.06 * breath}>
        <mesh scale={[1, 1.2, 0.6]}><sphereGeometry args={[0.16, 24, 18]} />{M.glass({ op: 0.18 })}</mesh>
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.06, 0, 0]} scale={[0.8, 1.3, 0.7]}><sphereGeometry args={[0.07, 20, 14]} /><meshStandardMaterial color="#d88a80" roughness={0.7} transparent opacity={0.9} /></mesh>)}
        {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[(i % 2 ? 1 : -1) * (0.03 + rn(i, 1) * 0.05), (rn(i, 2) - 0.5) * 0.16, 0.05]} scale={sm(cl(fill * 30 - i))}>
          <sphereGeometry args={[0.006, 6, 4]} /><meshBasicMaterial color="#c8f070" /></mesh>)}
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
    cam={{ at: [0.1, 0.2, 0], az: [-0.55, -0.35], el: [0.18, 0.14], r: [1.8, 1.6], fov: 36 }}>{(tt) => {
    const w = eio(tt, aA, aA + 1.4);
    return <>
      <mesh position={[0, -0.02, 0.6]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 3]} /><meshStandardMaterial map={dirtT([180, 116, 76])} roughness={1} /></mesh>
      <mesh position={[-0.6, 0.5, -0.5]}><boxGeometry args={[1.4, 1.0, 1.0]} /><meshStandardMaterial map={dirtT([160, 86, 56])} roughness={1} /></mesh>
      <mesh position={[-0.35, 0.18, 0.01]}><planeGeometry args={[0.3, 0.36]} /><meshBasicMaterial color="#120a06" /></mesh>
      {/* los de adentro en la penumbra */}
      {[-0.45, -0.28].map((x, i) => <group key={i} position={[x, 0, -0.08]}><Stickman escala={0.09} rotY={20} guion={[{ t: 0, accion: "sentarse", expr: "neutral" }]} semilla={20 + i} contacto={0} color="#5a4a3a" /></group>)}
      {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[-0.35 + (rn(i, 1) - 0.5) * 0.26, 0.05 + rn(i, 2) * 0.3, -0.05 + 0.02 * Math.sin(tt + i)]}><sphereGeometry args={[0.006, 6, 4]} /><meshBasicMaterial color="#e8d050" transparent opacity={0.6} depthWrite={false} /></mesh>)}
      <pointLight position={[-0.35, 0.3, 0.0]} intensity={0.5} distance={0.5} color="#ffc070" />
      {/* el veterano sale */}
      <group position={[lerp(-0.32, 0.45, w), 0, lerp(0.0, 0.35, w)]}>
        <Stickman escala={0.12} rotY={w < 0.99 ? 70 : 200} guion={[{ t: 0, accion: "idle", expr: "decidido" }, { t: aA, accion: "caminar", expr: "decidido" }, { t: aA + 1.4, accion: "sentarse", expr: "feliz" }] as any} semilla={23} contacto={0.3} colorContacto="#5a3a24" color="#e8e4dc" />
        <RBox s={[0.08, 0.05, 0.04]} r={0.008} p={[0.05, w > 0.98 ? 0.1 : 0.12, 0.05]}><meshStandardMaterial color="#8a8e92" metalness={0.6} roughness={0.4} /></RBox>
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
    over={(tt) => <Drums v={yr(tt)} n={4} x={1400} y={110} s={1.05} />}>{(tt) => {
    const k = eio(tt, 0.3, R), col = new THREE.Color("#c89a6a").lerp(new THREE.Color("#8a8a86"), k);
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
    cam={{ at: [0, 0.55, 0], az: [-0.15, 0.15], el: [0.06, 0.08], r: [2.1, 1.9], fov: 36 }}>{(tt) => <>
    <RBox s={[2.6, 0.06, 0.08]} r={0.01} p={[0, 1.05, 0]}><meshStandardMaterial color="#5a3a24" roughness={0.8} /></RBox>
    {aK.map((a, i) => { const x = (i - 2.5) * 0.4, on = eio(tt, a, a + 0.3) * (1 - eio(tt, a + life[i], a + life[i] + 0.4)), sw = 0.05 * Math.sin(tt * 1.3 + i);
      return <group key={i} position={[x, 1.02, 0]} rotation={[0, 0, sw]}>
        <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.002, 0.002, 0.24, 4]} /><meshStandardMaterial color="#222" /></mesh>
        <group position={[0, -0.3, 0]}>
          <mesh geometry={latheG("lampMina29d", [[0, 0.12], [0.03, 0.12], [0.05, 0.09], [0.05, 0.02], [0.035, 0], [0, 0]], 24)}>{M.brass({ col: "#b8904a" })}</mesh>
          <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.042, 0.042, 0.07, 20]} />{M.glass({ op: 0.4 })}</mesh>
          <mesh position={[0, 0.055, 0]} scale={[1, 1 + 0.15 * Math.sin(tt * 2 * PI * 1.2 + i), 1]}><coneGeometry args={[0.012, 0.04, 10]} /><meshBasicMaterial color={i === 5 ? "#d8f070" : "#ffb040"} transparent opacity={Math.max(0.0, on)} toneMapped={false} /></mesh>
          <pointLight position={[0, 0.06, 0.05]} intensity={0.0001 + 1.6 * on} distance={0.8} color={i === 5 ? "#c8f070" : "#ffa040"} />
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
    cam={{ at: [0, 0.4, -0.3], az: [-0.04, 0.04], el: [0.12, 0.1], r: [0.95, 0.85], fov: 40 }}
    over={(tt) => <Drums v={alt(tt)} n={3} x={1440} y={110} s={1.05} unit="km" />}>{(tt) => {
    const k = eio(tt, 0.2, aN + 0.4), skyC = new THREE.Color("#5a9ad8").lerp(new THREE.Color("#04060c"), k), shake = 0.003 * Math.sin(tt * 37);
    return <group position={[shake, shake * 0.6, 0]}>
      {/* el vidrio: un plano con el cielo, la Tierra que asoma abajo */}
      <mesh position={[0, 0.55, -0.7]}><planeGeometry args={[1.6, 0.9]} /><meshBasicMaterial color={skyC} /></mesh>
      <mesh position={[0, 0.05 - 0.18 * k, -0.69]}><circleGeometry args={[2.2, 64, 0, PI]} /><meshBasicMaterial color={new THREE.Color("#c8d8e8").lerp(new THREE.Color("#3a6aa8"), k)} /></mesh>
      <mesh position={[0, 0.05 - 0.18 * k + 0.0, -0.695]}><circleGeometry args={[2.24, 64, 0, PI]} /><meshBasicMaterial color="#9ad0ff" transparent opacity={0.5 * k} /></mesh>
      {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.5, 0.5 + rn(i, 2) * 0.4, -0.68]}><circleGeometry args={[0.003, 6]} /><meshBasicMaterial color="#fff" transparent opacity={cl((k - 0.6) * 3)} /></mesh>)}
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
    cam={{ at: [0, 0.6, 0], at1: [0.5, 0.75, 0], az: [-0.5, -0.25], el: [0.05, 0.02], r: [1.9, 2.1], fov: 38 }}>{(tt) => {
    const dt = Math.max(0, tt - aS), drop = Math.min(0.25, 0.6 * dt * dt), go = cl((dt - 0.5) / 1.5), x = 1.2 * go * go * 2, y = -drop + 0.6 * go * go;
    const fire = cl((dt - 0.45) * 4);
    return <>
      {/* las nubes muy abajo */}
      {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 8, -1.4 - rn(i, 2) * 0.4, (rn(i, 3) - 0.5) * 6]} scale={[1.5 + rn(i, 4) * 2, 0.3, 1 + rn(i, 5)]}><sphereGeometry args={[0.3, 12, 8]} /><meshStandardMaterial color="#f4f6f8" roughness={1} /></mesh>)}
      {/* el ala del bombardero */}
      <group position={[-0.2 - 0.05 * tt, 1.0, -0.1]}>
        <RBox s={[1.4, 0.04, 0.4]} r={0.02} rot={[0, 0.3, 0]}><meshStandardMaterial color="#c8ccd0" metalness={0.7} roughness={0.35} /></RBox>
        <mesh position={[-0.2, -0.06, 0.1]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.05, 0.05, 0.3, 16]} /><meshStandardMaterial color="#9a9ea2" metalness={0.7} roughness={0.35} /></mesh>
        <mesh position={[0.3, -0.06, 0]}><boxGeometry args={[0.04, 0.12, 0.04]} /><meshStandardMaterial color="#5a5e62" /></mesh>
      </group>
      {/* el X-15 */}
      <group position={[0.3 + x - 0.05 * Math.min(tt, aS), 0.8 + y, -0.02]} rotation={[0, 0, 0.25 * go]}>
        <mesh rotation={[0, 0, -PI / 2]}><capsuleGeometry args={[0.035, 0.42, 8, 16]} /><meshStandardMaterial color="#141416" metalness={0.5} roughness={0.35} /></mesh>
        <mesh position={[0.27, 0, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.035, 0.1, 16]} /><meshStandardMaterial color="#141416" metalness={0.5} roughness={0.35} /></mesh>
        <RBox s={[0.12, 0.006, 0.2]} r={0.003} p={[-0.02, -0.01, 0]}><meshStandardMaterial color="#141416" metalness={0.5} roughness={0.35} /></RBox>
        <RBox s={[0.1, 0.12, 0.006]} r={0.003} p={[-0.2, 0.06, 0]}><meshStandardMaterial color="#141416" metalness={0.5} roughness={0.35} /></RBox>
        <mesh position={[-0.3, 0, 0]} rotation={[0, 0, PI / 2]} scale={[1, sm(fire), 1]}><coneGeometry args={[0.03, 0.22, 14]} /><meshBasicMaterial color="#ffd8a0" transparent opacity={0.9} toneMapped={false} /></mesh>
        <pointLight position={[-0.35, 0, 0]} intensity={0.0001 + 2.5 * fire} distance={1.0} color="#ffb060" />
      </group>
      {Array.from({ length: 24 }, (_, i) => { const u = i / 24, gg = cl(go - u * 0.6); return <mesh key={"t" + i} position={[0.3 + 2.4 * gg * gg - 0.06 * aS, 0.8 - 0.25 + 0.6 * gg * gg, -0.02]} scale={sm(fire * (u < go ? 1 : 0) * (0.6 + u))}>
        <sphereGeometry args={[0.03, 8, 6]} /><meshBasicMaterial color="#f4f6f8" transparent opacity={0.5} depthWrite={false} /></mesh>; })}
      <directionalLight position={[2, 3, 1]} intensity={1.8} color="#fff4e0" />
    </>;
  }}</U3>;
};

// ---- CallesPilotos · la calle recta de la base, de noche; a cada lado, de a uno, se van clavando postes de calle (una semana, un
// poste), hasta que la avenida se llena ----
const CallesPilotos: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aS = sec(p, "semana", 1.0), n = 22, step = Math.max(0.1, (D - aS - 0.8) / n);
  return <U3 d={d} bg={p.bg} ground={[150, 130, 100]} mode="drop" sky="#2a3248" key1={[-1.4, 3.0, 1.6]}
    cam={{ at: [0, 0.15, -0.6], az: [-0.12, 0.08], el: [0.16, 0.12], r: [1.9, 1.7], fov: 38 }}>{(tt) => <>
    <mesh position={[0, 0.002, -1.0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.5, 5]} /><meshStandardMaterial color="#2a2a2c" roughness={0.9} /></mesh>
    {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[0, 0.004, 0.8 - i * 0.3]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.02, 0.12]} /><meshBasicMaterial color="#e8d890" /></mesh>)}
    {Array.from({ length: n }, (_, i) => { const a = aS + i * step, s = i % 2 ? 1 : -1, z = 0.6 - Math.floor(i / 2) * 0.32, on = pop(tt, a);
      return <group key={i} position={[s * 0.38, 0, z]} scale={Math.max(0.001, on)}>
        <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.008, 0.008, 0.34, 8]} />{M.steel({ col: "#4a5a4a" })}</mesh>
        <RBox s={[0.16, 0.035, 0.008]} r={0.004} p={[s * -0.06, 0.32, 0]}><meshStandardMaterial color="#2a6a3a" roughness={0.5} /></RBox>
        <RBox s={[0.12, 0.006, 0.009]} r={0.002} p={[s * -0.06, 0.32, 0]}><meshStandardMaterial color="#e8e8e0" roughness={0.5} /></RBox>
      </group>; })}
    {[-1, 1].map((s) => <spotLight key={s} position={[s * 0.6, 1.4, 0.6]} angle={0.5} penumbra={0.8} intensity={4} distance={4} color="#ffe0b0" />)}
    <mesh position={[0, 0.5, -3.2]}><planeGeometry args={[8, 1]} /><meshBasicMaterial color="#c86a3a" transparent opacity={0.35} /></mesh>
  </>}</U3>;
};

// ---- PanelMemoria · el veterano sentado frente al panel con los ojos tapados por la mano: va tocando interruptor por interruptor y
// cada uno se enciende sin errar; al final el panel entero queda verde ----
const PanelMemoria: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aM = sec(p, "memoria", 1.0), n = 24, step = Math.max(0.08, (D - aM - 1.0) / n);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-1.0, 2.4, 1.6]} backDim={0.2}
    cam={{ at: [0, 0.38, 0], az: [-0.6, -0.35], el: [0.14, 0.1], r: [1.35, 1.15], fov: 36 }}>{(tt) => {
    const cur = Math.min(n - 1, Math.max(0, Math.floor((tt - aM) / step)));
    return <>
      <RBox s={[1.2, 0.5, 0.06]} r={0.02} p={[0, 0.45, -0.3]} rot={[-0.25, 0, 0]}><meshStandardMaterial color="#26282a" metalness={0.3} roughness={0.6} /></RBox>
      {Array.from({ length: n }, (_, i) => { const x = (i % 8 - 3.5) * 0.12, y = 0.6 - Math.floor(i / 8) * 0.13, on = eio(tt, aM + i * step, aM + i * step + 0.15);
        return <group key={i} position={[x, y, -0.25 + (0.6 - y) * 0.25]} rotation={[-0.25, 0, 0]}>
          <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />{M.chrome({ col: "#7a7e80" })}</mesh>
          <mesh position={[0, 0.02 * (1 - 2 * on), 0.03]} rotation={[0.5 - 1.0 * on, 0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.05, 8]} />{M.chrome()}</mesh>
          <mesh position={[0.035, 0.03, 0.012]}><sphereGeometry args={[0.008, 10, 8]} /><meshStandardMaterial color={on > 0.5 ? "#40e070" : "#3a1a1a"} emissive={on > 0.5 ? "#40e070" : "#000"} emissiveIntensity={1.4 * on} /></mesh>
        </group>; })}
      <group position={[0.0, 0, 0.35]}><Stickman escala={0.15} rotY={180} guion={[{ t: 0, accion: "sentarse", expr: "decidido" }]} semilla={44} contacto={0} color="#c8ccd0" /></group>
      {/* la mano que toca */}
      {tt > aM && <mesh position={[((cur % 8) - 3.5) * 0.12 + 0.02, 0.6 - Math.floor(cur / 8) * 0.13 - 0.03, -0.18 + (Math.floor(cur / 8) * 0.13) * 0.25]}><sphereGeometry args={[0.03, 14, 10]} /><meshStandardMaterial color="#c8ccd0" roughness={0.6} /></mesh>}
      <pointLight position={[0, 0.5, 0.3]} intensity={0.3 + 1.2 * cl((tt - aM) / (n * step))} distance={1.4} color="#60f090" />
    </>;
  }}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { CascoChispas, CuatroDias, PielLuz, FondoCasco, TopCincoSiglo, MinaAmarilla, FiebreGeiger, RadonPulmon, ComerAfuera, TreintaAnios, RankingSiglo, CieloNegro, X15Bombardero, CallesPilotos, PanelMemoria };
