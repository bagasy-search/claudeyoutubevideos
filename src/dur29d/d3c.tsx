// dur29d · bloque C (1970 buzos de saturación del Mar del Norte, 1980 Chernóbil, tablero final y cierre):
// un mecanismo por componente, objetos grandes, sin carteles para leer. Luces siempre montadas (rampa), escala mínima > 0.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, pop } from "./kb";
import { Stickman } from "../stickman3d";
import { PI, sm } from "./c3k";

type UP = { d: number; p: any };
const SEA = "#0c2a3a";

// ---------- piezas ----------
const Burbujas: React.FC<{ tt: number; p: number[]; n?: number; h?: number; sp?: number; op?: number }> = ({ tt, p, n = 10, h = 0.6, sp = 0.3, op = 0.5 }) => <group position={p as any}>
  {Array.from({ length: n }, (_, i) => { const ph = (tt * sp + i / n) % 1; return <mesh key={i} position={[Math.sin(ph * 9 + i) * 0.02, ph * h, Math.cos(ph * 7 + i) * 0.02]} scale={sm(0.006 + 0.008 * rn(i, 3))}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#d8f0ff" transparent opacity={op * (1 - ph)} depthWrite={false} /></mesh>; })}
</group>;
const Casco: React.FC<{ p?: number[]; s?: number; luz?: number }> = ({ p = [0, 0, 0], s = 1, luz = 1 }) => <group position={p as any} scale={sm(s)}>
  <mesh><sphereGeometry args={[0.05, 18, 14]} />{M.steel({ col: "#d8c040" })}</mesh>
  <mesh position={[0, 0, 0.042]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.028, 0.028, 0.012, 20]} />{M.glass({ op: 0.5 })}</mesh>
  <mesh position={[0, 0.05, 0.02]}><boxGeometry args={[0.02, 0.014, 0.02]} /><meshBasicMaterial color="#fff6d0" toneMapped={false} /></mesh>
  <spotLight position={[0, 0.05, 0.03]} angle={0.45} penumbra={0.7} intensity={3 * luz} distance={1.2} color="#e8f4ff" />
</group>;
// cronómetro de bolsillo: aro de bronce, esfera clara, sector rojo que barre la fracción k
const Crono: React.FC<{ k: number; r?: number; col?: string; p?: number[]; rot?: number[] }> = ({ k, r = 0.12, col = "#c8302a", p = [0, 0, 0], rot = [0, 0, 0] }) => <group position={p as any} rotation={rot as any}>
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[r, r, 0.025, 40]} />{M.brass({ col: "#b88a3a" })}</mesh>
  <mesh position={[0, r + 0.02, 0]}><cylinderGeometry args={[0.014, 0.014, 0.03, 12]} />{M.brass({ col: "#b88a3a" })}</mesh>
  <mesh position={[0, 0, 0.013]}><circleGeometry args={[r * 0.9, 40]} /><meshStandardMaterial color="#f2ece0" /></mesh>
  <mesh position={[0, 0, 0.015]} rotation={[0, 0, PI / 2]} scale={[-1, 1, 1]}><circleGeometry args={[r * 0.86, 40, 0, Math.max(0.001, 2 * PI * cl(k))]} /><meshBasicMaterial color={col} transparent opacity={0.8} /></mesh>
  {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i * PI / 6) * r * 0.8, Math.cos(i * PI / 6) * r * 0.8, 0.017]}><boxGeometry args={[r * 0.04, r * 0.12, 0.002]} /><meshBasicMaterial color="#2a1a10" /></mesh>)}
  <group position={[0, 0, 0.02]} rotation={[0, 0, -2 * PI * cl(k)]}><mesh position={[0, r * 0.38, 0]}><boxGeometry args={[r * 0.05, r * 0.8, 0.003]} /><meshBasicMaterial color="#1a1410" /></mesh></group>
</group>;

// ---------- 1970 · Mar del Norte ----------

// ---- CamaraLiteras · el tubo de metal en la cubierta del barco, cortado al medio como una lata: literas, mesita, ventanita redonda; el buzo
// habla y le salen burbujitas agudas; en «helio» el aire de adentro se tiñe y la aguja del manómetro sube ----
const CamaraLiteras: React.FC<UP> = ({ d, p }) => {
  const aH = sec(p, "helio", 2.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" sky="#0e1418" key1={[-1, 2.4, 1.8]}
    cam={{ at: [0, 0.3, 0], az: [-0.35, -0.15], el: [0.18, 0.12], r: [1.35, 1.1], fov: 34 }}>{(tt) => {
    const he = eio(tt, aH, aH + 1.0);
    return <>
      <mesh position={[0, 0.3, -0.02]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.3, 0.3, 1.3, 40, 1, true, PI, PI]} />{M.steel({ col: "#7a8288" })}</mesh>
      <mesh position={[0, 0.3, -0.02]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.285, 0.285, 1.28, 40, 1, true, PI, PI]} /><meshStandardMaterial color="#7a8278" roughness={0.9} side={THREE.BackSide} /></mesh>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.65, 0.3, -0.02]} rotation={[0, k * PI / 2, 0]}><circleGeometry args={[0.3, 40, 0, PI]} />{M.steel({ col: "#6a7278" })}</mesh>)}
      <mesh position={[0.66, 0.36, 0.0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.07, 0.014, 10, 28]} />{M.brass({ col: "#b8902a" })}</mesh>
      <mesh position={[0.655, 0.36, 0.0]} rotation={[0, -PI / 2, 0]}><circleGeometry args={[0.065, 28]} /><meshBasicMaterial color="#4a7a9a" toneMapped={false} /></mesh>
      {[0.12, 0.34].map((y, i) => <group key={i} position={[-0.3, y, -0.1]}><RBox s={[0.55, 0.03, 0.16]} r={0.01}>{M.steel({ col: "#5a6066" })}</RBox>
        <RBox s={[0.5, 0.03, 0.14]} r={0.012} p={[0, 0.03, 0]}><meshStandardMaterial color={i ? "#3a5a7a" : "#7a3a2a"} roughness={0.9} /></RBox></group>)}
      <RBox s={[0.16, 0.02, 0.12]} r={0.006} p={[0.3, 0.2, -0.05]}>{M.wood({ base: [130, 92, 54] })}</RBox>
      <mesh position={[0.3, 0.1, -0.05]}><cylinderGeometry args={[0.01, 0.01, 0.18, 8]} />{M.steel()}</mesh>
      <mesh position={[0.3, 0.24, -0.05]}><cylinderGeometry args={[0.02, 0.018, 0.05, 14]} /><meshStandardMaterial color="#f2eee4" /></mesh>
      <group position={[0.1, 0.03, 0.05]}><Stickman escala={0.13} rotY={-20} guion={[{ t: 0, accion: "explicar", expr: "hablando" }, { t: aH + 0.6, accion: "reir", expr: "risa_apretada" }]} semilla={91} contacto={0.2} color="#e8e4dc" /></group>
      <Burbujas tt={tt} p={[0.13, 0.27, 0.1]} n={12} h={0.25} sp={0.8} op={0.3 + 0.5 * he} />
      <mesh position={[0, 0.3, -0.02]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.28, 0.28, 1.26, 32]} /><meshBasicMaterial color="#9ad8ff" transparent opacity={0.1 * he} depthWrite={false} /></mesh>
      <group position={[-0.45, 0.48, 0.02]}><Crono k={0.15 + 0.6 * he} r={0.07} col="#3a9ad8" /></group>
      <pointLight position={[0, 0.5, 0.25]} intensity={0.9} distance={1.6} color="#fff0d8" />
      <pointLight position={[0, 0.3, 0.2]} intensity={0.7 * he} distance={1.2} color="#9ad8ff" />
    </>;
  }}</U3>;
};

// ---- CampanaBaja · corte del mar: el barco arriba, la campana amarilla baja colgada del cable a través del agua cada vez más oscura hasta
// la tubería del fondo; el contador de profundidad gira hasta 100 m; en «fondo» se prende la luz de la campana ----
const CampanaBaja: React.FC<UP> = ({ d, p }) => {
  const aF = sec(p, "fondo", d / 30 - 1.2);
  return <U3 over={(tt) => <Drums v={Math.round(100 * eio(tt, 0.3, aF))} n={3} x={1450} y={120} s={1.1} unit="m" op={1} />} d={d} bg={p.bg} ground={null} mode="wipe" sky="#04121a" key1={[-1, 2.6, 1.6]}
    cam={{ at: [0, 0.82, 0], at1: [0, -0.05, 0], az: [-0.12, -0.05], el: [0.05, 0.04], r: [1.95, 1.55], fov: 36 }}>{(tt) => {
    const k = eio(tt, 0.3, aF), y = lerp(0.85, -0.25, k), on = eio(tt, aF, aF + 0.4);
    return <>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, 0.9 - i * 0.26, -0.3]}><planeGeometry args={[4, 0.27]} /><meshBasicMaterial color={new THREE.Color("#2a6a8a").lerp(new THREE.Color("#020608"), i / 5)} /></mesh>)}
      {Array.from({ length: 5 }, (_, i) => <mesh key={"l" + i} position={[0, 0.77 - i * 0.26, -0.29]}><planeGeometry args={[4, 0.006]} /><meshBasicMaterial color="#5a9ab8" transparent opacity={0.35} /></mesh>)}
      <mesh position={[0, 1.04, -0.29]}><planeGeometry args={[4, 0.02]} /><meshBasicMaterial color="#8ac8e8" toneMapped={false} /></mesh>
      <group position={[0, 1.08, 0]}>
        <RBox s={[1.2, 0.1, 0.3]} r={0.03}><meshStandardMaterial color="#c83a2a" /></RBox>
        <RBox s={[0.3, 0.16, 0.22]} r={0.02} p={[-0.3, 0.12, 0]}><meshStandardMaterial color="#e8e4dc" /></RBox>
        <mesh position={[0.2, 0.25, 0]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />{M.steel({ col: "#d8c040" })}</mesh></group>
      <mesh position={[0, (1.3 + y) / 2, 0]}><cylinderGeometry args={[0.008, 0.008, Math.max(0.01, 1.3 - y), 8]} />{M.steel({ col: "#b8b8b0" })}</mesh>
      <group position={[0, y, 0]}>
        <mesh><sphereGeometry args={[0.1, 24, 18]} /><meshStandardMaterial color="#e8c020" metalness={0.4} roughness={0.4} /></mesh>
        <mesh position={[0, 0, 0.09]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.02, 18]} /><meshStandardMaterial color="#fff6d0" emissive="#ffe0a0" emissiveIntensity={0.2 + 2 * on} /></mesh>
        <pointLight position={[0, -0.05, 0.2]} intensity={0.4 + 2.5 * on} distance={1.0} color="#d8f0ff" />
        <Burbujas tt={tt} p={[0.04, 0.1, 0]} n={8} h={0.4} sp={0.5} op={0.45} /></group>
      <mesh position={[0, -0.42, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.05, 0.05, 3, 20]} />{M.steel({ col: "#4a5056" })}</mesh>
      <mesh position={[0, -0.5, -0.1]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[4, 1]} /><meshStandardMaterial map={dirtT([60, 56, 48])} /></mesh>
    </>;
  }}</U3>;
};

// ---- MangueraUmbilical · el buzo en el fondo negro con la luz del casco; la manguera serpentea hasta la campana. Por dentro viajan tres
// pulsos: en «aire» uno celeste, en «calefaccion» uno naranja, en «telefono» uno blanco; en «manguera» la cámara sigue la manguera ----
const HPTS = Array.from({ length: 24 }, (_, i) => { const u = i / 23; return new THREE.Vector3(lerp(-0.7, 0.35, u), 0.05 + Math.sin(u * PI) * 0.35 + Math.sin(u * 9) * 0.04, Math.sin(u * 6) * 0.12); });
const HCURVE = new THREE.CatmullRomCurve3(HPTS);
const MangueraUmbilical: React.FC<UP> = ({ d, p }) => {
  const aA = sec(p, "aire", 1.5), aC = sec(p, "calefaccion", 2.5), aT = sec(p, "telefono", 3.5);
  const tube = React.useMemo(() => new THREE.TubeGeometry(HCURVE, 80, 0.026, 12, false), []);
  return <U3 d={d} bg={p.bg} ground={null} floor="none" mode="wipe" sky="#02080c" key1={[-1, 2.2, 1.6]}
    cam={{ at: [-0.1, 0.2, 0], az: [-0.25, 0.1], el: [0.15, 0.1], r: [1.3, 1.15], fov: 34 }}>{(tt) => {
    const pulse = (a: number, col: string, k: string) => { const u = cl((tt - a) / 1.4); return <mesh key={k} position={HCURVE.getPoint(1 - u)} scale={sm(u > 0 && u < 1 ? 1 : 0.001)}><sphereGeometry args={[0.05, 16, 12]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>; };
    return <>
      <mesh position={[0, -0.02, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial map={dirtT([40, 44, 40])} roughness={1} /></mesh>
      <mesh position={[-0.75, 0.15, -0.05]}><sphereGeometry args={[0.16, 24, 18]} /><meshStandardMaterial color="#e8c020" metalness={0.4} roughness={0.4} /></mesh>
      <pointLight position={[-0.75, 0.15, 0.2]} intensity={1.2} distance={0.9} color="#fff0c0" />
      <mesh geometry={tube}><meshStandardMaterial color="#c89a2a" roughness={0.55} /></mesh>
      {pulse(aA, "#5ac8ff", "a")}{pulse(aC, "#ff8a30", "c")}{pulse(aT, "#ffffff", "t")}
      <group position={[0.4, 0, 0.0]}><Stickman escala={0.14} rotY={-60} guion={[{ t: 0, accion: "tipear", expr: "decidido" }]} semilla={93} contacto={0} color="#2a2a2a" />
        <Casco p={[0.0, 0.3, 0.02]} s={1.2} /></group>
      <mesh position={[0.6, 0.06, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.06, 0.06, 0.8, 20]} />{M.steel({ col: "#4a5056" })}</mesh>
      <Burbujas tt={tt} p={[0.41, 0.36, 0.05]} n={10} h={0.7} sp={0.35} op={0.45} />
      <pointLight position={[0.3, 0.3, 0.25]} intensity={0.4 + 1.5 * eio(tt, aC, aC + 0.4) * (1 - eio(tt, aT, aT + 0.6))} distance={0.8} color="#ff8a30" />
    </>;
  }}</U3>;
};

// ---- EscotillaDias · la escotilla de la cámara se cierra y gira el volante; en la pared cuelga un almanaque que pierde hojas de a una
// (cuatro días); en «dias» la cuenta corre y el buzo mira por la ventanita ----
const EscotillaDias: React.FC<UP> = ({ d, p }) => {
  const aD = sec(p, "dias", 1.5);
  return <U3 over={(tt) => <Drums v={Math.min(4, Math.floor(eio(tt, aD, aD + 3.0) * 4.999))} n={1} x={1500} y={130} s={1.3} unit="días" op={eio(tt, aD - 0.2, aD + 0.2)} />} d={d} bg={p.bg} ground={null} floor="dark" mode="drop" sky="#0c1216" key1={[-1, 2.4, 1.6]}
    cam={{ at: [0, 0.35, 0], az: [-0.2, 0.05], el: [0.1, 0.08], r: [1.15, 1.0], fov: 34 }}>{(tt) => {
    const shut = eio(tt, 0.2, 1.0), spin = eio(tt, 0.8, 1.8) * 2 * PI;
    return <>
      <RBox s={[1.4, 0.9, 0.06]} r={0.02} p={[0, 0.45, -0.2]}>{M.steel({ col: "#6a7278" })}</RBox>
      <group position={[-0.25, 0.42, -0.16]}>
        <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.2, 0.045, 14, 40]} />{M.steel({ col: "#4a5056" })}</mesh>
        {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[Math.cos(i * PI / 8) * 0.27, Math.sin(i * PI / 8) * 0.27, 0]}><sphereGeometry args={[0.012, 8, 6]} />{M.steel({ col: "#8a9298" })}</mesh>)}
        <group position={[-0.2, 0, 0]} rotation={[0, -lerp(1.4, 0, shut), 0]}><group position={[0.2, 0, 0.02]}>
          <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.19, 0.19, 0.04, 36]} />{M.steel({ col: "#7a8288" })}</mesh>
          <mesh position={[0.06, 0.05, 0.022]}><circleGeometry args={[0.045, 24]} /><meshBasicMaterial color="#4a7a9a" toneMapped={false} /></mesh>
          <group position={[0, -0.04, 0.05]} rotation={[0, 0, spin]}><mesh><torusGeometry args={[0.07, 0.008, 8, 24]} />{M.steel({ col: "#c83a2a" })}</mesh>
            {[0, 1, 2].map((i) => <mesh key={i} rotation={[0, 0, (i * PI) / 3]}><boxGeometry args={[0.14, 0.008, 0.008]} />{M.steel({ col: "#c83a2a" })}</mesh>)}</group>
        </group></group></group>
      <group position={[0.36, 0.48, -0.14]} scale={1.35}>
        <RBox s={[0.3, 0.36, 0.02]} r={0.01}><meshStandardMaterial color="#e8e2d4" /></RBox>
        <RBox s={[0.3, 0.06, 0.025]} r={0.01} p={[0, 0.16, 0.003]}><meshStandardMaterial color="#c83a2a" /></RBox>
        {[0, 1, 2, 3].map((i) => { const f = eio(tt, aD + i * 0.75, aD + i * 0.75 + 1.1); return <group key={i} position={[(rn(i, 3) - 0.5) * 0.3 * f, 0.13 - f * 0.47, 0.015 + (3 - i) * 0.002 + f * 0.25]} rotation={[f * 1.45, 0, f * (rn(i, 2) - 0.5) * 2]}>
          <mesh position={[0, -0.13, 0]}><planeGeometry args={[0.28, 0.26]} /><meshStandardMaterial color="#f6f2e8" side={THREE.DoubleSide} /></mesh>
          {Array.from({ length: 12 }, (_, j) => <mesh key={j} position={[-0.1 + (j % 4) * 0.066, -0.06 - Math.floor(j / 4) * 0.07, 0.001]}><boxGeometry args={[0.04, 0.04, 0.001]} /><meshBasicMaterial color={j === 5 ? "#c83a2a" : "#c8c0b0"} /></mesh>)}</group>; })}
      </group>
      <pointLight position={[0, 0.6, 0.6]} intensity={1.8} distance={2} color="#f0f4ff" />
    </>;
  }}</U3>;
};

// ---------- 1980 · Chernóbil ----------

// ---- RobotsQuietos · el techo negro sembrado de grafito brillante: tres robots con orugas avanzan; en «circuitos» saltan chispitas y sus
// luces se apagan de a uno; en «quietos» quedan parados y la cámara se acerca al último ----
const RobotsQuietos: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "circuitos", 2.0), aQ = sec(p, "quietos", 3.0);
  return <U3 d={d} bg={p.bg} ground={[50, 48, 46]} mode="wipe" sky="#1a1e1c" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.14, 0], at1: [0.3, 0.12, 0.1], az: [-0.3, -0.2], el: [0.22, 0.15], r: [1.2, 0.85], fov: 34 }}>{(tt) => <>
      {Array.from({ length: 26 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 2, 0.02, (rn(i, 2) - 0.5) * 1.2]} rotation={[rn(i, 3) * 3, rn(i, 4) * 3, 0]}><dodecahedronGeometry args={[0.02 + rn(i, 5) * 0.03, 0]} /><meshStandardMaterial color="#1a1a1c" metalness={0.6} roughness={0.25} flatShading /></mesh>)}
      {[0, 1, 2].map((i) => { const die = eio(tt, aC + i * 0.4, aC + i * 0.4 + 0.3), x = -0.5 + i * 0.4 + Math.min(tt, aC + i * 0.4) * 0.06, ch = tt > aC + i * 0.4 - 0.4 && tt < aC + i * 0.4 + 0.9 ? 1 : 0;
        return <group key={i} position={[x, 0, (i - 1) * 0.25]} rotation={[0, 0.2 * (i - 1), 0]} scale={1.45}>
          {[-1, 1].map((k) => <RBox key={k} s={[0.22, 0.05, 0.04]} r={0.02} p={[0, 0.03, k * 0.06]}><meshStandardMaterial color="#1a1a1a" /></RBox>)}
          <RBox s={[0.18, 0.08, 0.12]} r={0.015} p={[0, 0.1, 0]}><meshStandardMaterial color={["#d8c040", "#5a8a5a", "#e8e4dc"][i]} /></RBox>
          <mesh position={[0.02, 0.18, 0]} rotation={[0, 0, -0.6]}><cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />{M.steel()}</mesh>
          <mesh position={[0.095, 0.11, 0]}><boxGeometry args={[0.01, 0.02, 0.04]} /><meshStandardMaterial color="#fff6d0" emissive="#ffe8a0" emissiveIntensity={2 * (1 - die)} /></mesh>
          <pointLight position={[0.15, 0.11, 0]} intensity={0.8 * (1 - die)} distance={0.5} color="#fff0c0" />
          {Array.from({ length: 12 }, (_, j) => <mesh key={j} position={[(rn(j + i * 9, 1) - 0.5) * 0.2, 0.15 + rn(j, 2) * 0.1 + 0.04 * Math.sin(tt * 7 + j), (rn(j, 3) - 0.5) * 0.14]} scale={sm(ch * 0.016)}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#ffe080" toneMapped={false} /></mesh>)}
        </group>; })}
      <pointLight position={[0.3, 0.6, 0.6]} intensity={1.0 + 0.8 * eio(tt, aQ, aQ + 0.5)} distance={1.8} color="#c8d8c0" />
      <hemisphereLight args={["#a8b8b0", "#2a2826", 0.6]} />
    </>}</U3>;
};

// ---- NoventaSegundos · el techo de costado: a la izquierda la puerta con el oficial y el cronómetro grande; el biorobot sale corriendo,
// paletea un trozo de grafito y lo tira por el borde hacia el reactor que humea; en «noventa» el cronómetro arranca y barre en rojo ----
const NoventaSegundos: React.FC<UP> = ({ d, p }) => {
  const aN = sec(p, "noventa", 1.2), D = d / 30, run = (tt: number) => cl((tt - aN) / Math.max(1, D - aN - 0.4));
  return <U3 d={d} bg={p.bg} ground={[56, 54, 50]} mode="wipe" sky="#1c1e1c" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0.15, 0.3, 0], az: [-0.1, 0.05], el: [0.12, 0.1], r: [1.85, 1.75], fov: 36 }}>{(tt) => {
    const u = run(tt), x = u < 0.45 ? lerp(-0.35, 0.45, u / 0.45) : u < 0.6 ? 0.45 : lerp(0.45, -0.35, (u - 0.6) / 0.4), thr = eio(tt, aN + (D - aN) * 0.5, aN + (D - aN) * 0.58);
    return <>
      <RBox s={[0.2, 0.5, 0.25]} r={0.01} p={[-0.85, 0.25, -0.05]}><meshStandardMaterial map={dirtT([110, 106, 98])} /></RBox>
      <mesh position={[-0.74, 0.2, -0.05]}><planeGeometry args={[0.12, 0.34]} /><meshStandardMaterial color="#c8b080" emissive="#806040" emissiveIntensity={0.6} /></mesh>
      {[[-0.74, 0.38, 0.16, 0.03], [-0.8, 0.2, 0.02, 0.36], [-0.68, 0.2, 0.02, 0.36]].map(([x, y, w, h], i) => <RBox key={i} s={[w, h, 0.03]} r={0.004} p={[x, y, -0.03]}>{M.steel({ col: "#4a4e52" })}</RBox>)}
      <group position={[-0.74, 0, -0.08]}><Stickman escala={0.12} rotY={60} guion={[{ t: 0, accion: "mirar_reloj", expr: "nervioso" }, { t: aN + (D - aN) * 0.7, accion: "senalar", expr: "furioso" }]} semilla={95} contacto={0} color="#5a6a4a" /></group>
      <Crono k={u} r={0.13} p={[-0.42, 0.52, -0.12]} />
      <mesh position={[0.75, 0.0, -0.05]}><boxGeometry args={[0.04, 0.1, 0.9]} /><meshStandardMaterial color="#3a3a38" /></mesh>
      <group position={[1.15, -0.2, -0.2]}>{Array.from({ length: 6 }, (_, i) => <RBox key={i} s={[0.12, 0.3 + rn(i, 1) * 0.3, 0.12]} r={0.01} p={[(rn(i, 2) - 0.5) * 0.4, 0, (rn(i, 3) - 0.5) * 0.4]} rot={[rn(i, 4) * 0.4, 0, rn(i, 5) * 0.4]}><meshStandardMaterial color="#2a2624" /></RBox>)}
        {Array.from({ length: 5 }, (_, j) => { const ph = (tt * 0.2 + j / 5) % 1; return <mesh key={j} position={[ph * 0.15, 0.3 + ph * 0.7, 0]}><sphereGeometry args={[0.1 + ph * 0.18, 10, 8]} /><meshStandardMaterial color="#3a3836" transparent opacity={0.5 * (1 - ph)} depthWrite={false} /></mesh>; })}
        <pointLight position={[0, 0.3, 0.2]} intensity={1.5 + 0.4 * Math.sin(tt * 2 * PI * 0.8)} distance={1.5} color="#ff8a40" /></group>
      <group position={[x, 0, 0.22]}><Stickman escala={0.13} rotY={u < 0.6 ? 90 : -90} guion={[{ t: 0, accion: "idle", expr: "asustado" }, { t: aN, accion: "correr", expr: "decidido" }]} semilla={96} contacto={0} color="#7a7a6a" />
        <group position={[0.08 * (u < 0.6 ? 1 : -1), 0.12, 0]} rotation={[0, 0, (u < 0.6 ? -0.6 : 0.6) - thr * 1.2]}><mesh><cylinderGeometry args={[0.006, 0.006, 0.22, 6]} />{M.wood()}</mesh>
          <mesh position={[0, -0.12, 0]}><boxGeometry args={[0.05, 0.05, 0.008]} />{M.steel()}</mesh></group></group>
      <mesh position={[lerp(0.5, 1.0, thr), 0.15 + Math.sin(thr * PI) * 0.25 - thr * 0.3, 0.05]} visible={tt > aN && thr < 0.99}><dodecahedronGeometry args={[0.035, 0]} /><meshStandardMaterial color="#1a1a1c" metalness={0.6} roughness={0.25} flatShading /></mesh>
    </>;
  }}</U3>;
};

// ---- TresMilSeiscientos · el techo visto desde arriba: van apareciendo cascos verdes, uno por cada hombre que subió, primero de a uno y
// después a puñados, hasta llenar el techo; en «tres mil» el tambor llega a 3600 y la cámara sube; en «medio millón» todo se aleja ----
const TresMilSeiscientos: React.FC<UP> = ({ d, p }) => {
  const aT = sec(p, "tres mil", 2.0), aM = sec(p, "medio", 4.0);
  const N = 3600;
  const im = React.useMemo(() => {
    const o = new THREE.InstancedMesh(new THREE.SphereGeometry(0.016, 10, 6, 0, 2 * PI, 0, PI / 2), new THREE.MeshStandardMaterial({ color: "#5a9a3a", roughness: 0.45, metalness: 0.1 }), N);
    for (let i = 0; i < N; i++) { const m = new THREE.Matrix4(); const r = Math.sqrt(i / N) * 0.85, a = i * 2.39996; m.setPosition(Math.cos(a) * r * 1.3, 0.004, Math.sin(a) * r * 0.7); o.setMatrixAt(i, m); }
    o.frustumCulled = false; o.count = 1; return o; }, []);
  return <U3 over={(tt) => <Drums v={Math.round(N * eio(tt, 0.4, aT + 0.6))} n={4} x={1330} y={120} s={1.0} op={1} />} d={d} bg={p.bg} ground={[96, 90, 82]} mode="drop" sky="#2a2c2a" key1={[-1, 2.8, 1.6]}
    cam={{ at: [0, 0, 0], az: [0.0, 0.1], el: [0.95, 1.2], r: [0.9, 2.1], fov: 36 }}>{(tt) => {
    im.count = Math.max(1, Math.round(N * Math.pow(eio(tt, 0.4, aT + 0.6), 2)));
    return <>
      <mesh position={[0, 0.0, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.6, 1.6]} /><meshStandardMaterial map={dirtT([92, 88, 80])} roughness={0.9} /></mesh>
      {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 2.4, 0.01, (rn(i, 2) - 0.5) * 1.4]} rotation={[rn(i, 3) * 3, rn(i, 4) * 3, 0]}><dodecahedronGeometry args={[0.02 + rn(i, 5) * 0.03, 0]} /><meshStandardMaterial color="#1a1a1c" metalness={0.6} roughness={0.25} flatShading /></mesh>)}
      <primitive object={im} />
      <hemisphereLight args={["#e0e8d8", "#3a3630", 0.9]} />
      <pointLight position={[0, 1.2, 0.4]} intensity={2.0 + 1.0 * eio(tt, aM, aM + 0.8)} distance={4} color="#f0f4e0" />
    </>;
  }}</U3>;
};

// ---- TurnoUnaVez · el dosímetro de lápiz gigante en primer plano: la aguja sube hasta la marca roja; en «limite» la puerta del techo se
// cierra con una cruz de cinta y el hombre baja la escalera de espaldas, de una vez para siempre ----
const TurnoUnaVez: React.FC<UP> = ({ d, p }) => {
  const aL = sec(p, "limite", 1.5), aC = sec(p, "casa", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" sky="#101210" key1={[-1, 2.4, 1.6]}
    cam={{ at: [0, 0.35, 0], az: [-0.2, -0.08], el: [0.1, 0.08], r: [1.25, 1.1], fov: 34 }}>{(tt) => {
    const nd = eio(tt, 0.2, aL), op = eio(tt, aL, aL + 0.8), go = eio(tt, aC, aC + 2.2);
    return <>
      <group position={[-0.52, 0.4, 0.3]} rotation={[0, 0.3, 0.1]}>
        <mesh><cylinderGeometry args={[0.04, 0.04, 0.6, 24]} />{M.chrome()}</mesh>
        <mesh position={[0, 0.32, 0]}><cylinderGeometry args={[0.02, 0.04, 0.05, 20]} />{M.steel({ col: "#6a6e72" })}</mesh>
        <mesh position={[0, 0.0, 0.041]}><planeGeometry args={[0.05, 0.4]} /><meshStandardMaterial color="#f2eee0" /></mesh>
        <mesh position={[0, 0.16, 0.042]}><planeGeometry args={[0.05, 0.08]} /><meshBasicMaterial color="#c8302a" /></mesh>
        <mesh position={[0, lerp(-0.18, 0.16, nd), 0.043]}><boxGeometry args={[0.05, 0.006, 0.001]} /><meshBasicMaterial color="#141414" /></mesh>
        <pointLight position={[0, 0.16, 0.2]} intensity={0.0001 + 1.5 * op} distance={0.6} color="#ff3a2a" /></group>
      <RBox s={[0.9, 0.8, 0.05]} r={0.01} p={[0.3, 0.4, -0.3]}><meshStandardMaterial map={dirtT([110, 106, 98])} /></RBox>
      {/* el vano: luz del día detrás */}
      <mesh position={[0.3, 0.26, -0.27]}><planeGeometry args={[0.26, 0.48]} /><meshBasicMaterial color="#f0e8d0" /></mesh>
      <group position={[0.17, 0.26, -0.25]} rotation={[0, -1.35 * op, 0]}>
        <RBox s={[0.26, 0.48, 0.03]} r={0.01} p={[0.13, 0, 0]}>{M.steel({ col: "#5a6a5a" })}</RBox>
        <mesh position={[0.23, 0, 0.02]}><sphereGeometry args={[0.012, 10, 8]} />{M.brass()}</mesh></group>
      <group position={[0.3, 0.02, lerp(0.2, -0.4, go)]}><Stickman escala={0.13} rotY={180} guion={[{ t: 0, accion: "parado", expr: "triste" }, { t: aC, accion: "caminar", expr: "triste" }]} semilla={97} contacto={0} color="#9a9a8a" /></group>
      <spotLight position={[0.3, 0.6, -0.9]} angle={0.5} penumbra={0.6} intensity={0.0001 + 4 * op} distance={2} color="#fff0d8" />
      <pointLight position={[0.2, 0.7, 0.6]} intensity={1.6} distance={2} color="#e0e8d8" />
    </>;
  }}</U3>;
};

// ---- AlasDosCaras · el distintivo de alas de piloto, grande, de bronce, girando despacio sobre terciopelo: de un lado brilla y le llueven
// monedas (el trabajo soñado de hoy); en «momento» da media vuelta y del otro lado está quemado, y la línea de pulso roja se aplana en «vida» ----
const AlasDosCaras: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "momento", 2.5), aV = sec(p, "vida", 4.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" sky="#0c0a0a" key1={[-1, 2.4, 1.6]}
    cam={{ at: [0, 0.35, 0], az: [-0.12, 0.1], el: [0.08, 0.06], r: [1.05, 0.9], fov: 34 }}>{(tt) => {
    const flip = eio(tt, aM, aM + 0.9), flat = eio(tt, aV, aV + 0.8), ry = flip * PI + 0.25 * Math.sin(tt * 0.6);
    const wing = (k: number, burnt: boolean) => <group scale={[k, 1, 1]}>{Array.from({ length: 6 }, (_, i) => <RBox key={i} s={[0.3 - i * 0.035, 0.022, 0.012]} r={0.008} p={[0.2 + (0.3 - i * 0.035) / 2 - 0.02, 0.07 - i * 0.026, 0]} rot={[0, 0, -0.12 - i * 0.04]}>
      {burnt ? <meshStandardMaterial color="#1c1612" roughness={0.9} /> : M.brass({ col: "#d8a84a" })}</RBox>)}</group>;
    return <>
      <RBox s={[1.4, 0.04, 0.6]} r={0.01} p={[0, 0.0, 0]}><meshStandardMaterial color="#3a0e14" roughness={1} /></RBox>
      <group position={[0, 0.38, 0]} rotation={[0, ry, 0]}>
        <group position={[0, 0, 0.008]}>{wing(1, false)}{wing(-1, false)}
          <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.03, 32]} />{M.brass({ col: "#e8b850" })}</mesh></group>
        <group position={[0, 0, -0.008]}>{wing(1, true)}{wing(-1, true)}
          <mesh rotation={[PI / 2, 0, 0]} position={[0, 0, -0.004]}><cylinderGeometry args={[0.071, 0.071, 0.03, 32]} /><meshStandardMaterial color="#1a1412" roughness={0.95} /></mesh>
          <group position={[0, 0, -0.022]} rotation={[0, PI, 0]}>{Array.from({ length: 14 }, (_, i) => { const x = -0.065 + i * 0.01, y = (i === 6 ? 0.04 : i === 7 ? -0.03 : 0) * (1 - flat);
            return <mesh key={i} position={[x, y, 0]}><boxGeometry args={[0.012, 0.004, 0.002]} /><meshBasicMaterial color="#ff2a2a" toneMapped={false} /></mesh>; })}</group></group>
      </group>
      {Array.from({ length: 14 }, (_, i) => { const ph = ((tt * 0.5 + rn(i, 1)) % 1); return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.7, 0.9 - ph * 0.88, (rn(i, 3) - 0.5) * 0.3]} rotation={[ph * 8 + i, ph * 5, 0]} scale={sm(1 - flip)}>
        <cylinderGeometry args={[0.022, 0.022, 0.004, 18]} />{M.brass({ col: "#e8c060" })}</mesh>; })}
      <pointLight position={[0, 0.6, 0.5]} intensity={2.2 * (1 - flip) + 0.6} distance={1.6} color="#ffe0a0" />
      <pointLight position={[0, 0.4, -0.5]} intensity={1.6 * flip} distance={1.4} color="#ff4a3a" />
    </>;
  }}</U3>;
};

// ---------- tablero final y cierre ----------

const TURNOS = [600, 300, 60, 8, 1800, 0, 180, 120, 90];
const KT = ["breaker", "culebra", "pinboy", "remachador", "soldadora", "uranio", "piloto", "buzo", "liquidador"]; // segundos; 0 = el minero que no renuncia (sin fin)
const TCOL = ["#4a4038", "#8a6a3a", "#c8c0b0", "#8a8e92", "#3a6a9a", "#e8c020", "#c8d8e8", "#1a2a3a", "#5a6a4a"];
// ---- TableroFinal · nueve cronómetros de bolsillo colgados de una barra de bronce, uno por década, cada uno con su color; al nombrarse
// cada trabajo su cronómetro baja, se ilumina y barre su tiempo (escala de una hora); el del minero gira sin parar ----
const TableroFinal: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, step = Math.max(0.6, (D - 1.0) / 9.3);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" sky="#0d0b0a" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.55, 0], az: [-0.12, 0.12], el: [0.08, 0.1], r: [1.75, 1.65], fov: 36 }}>{(tt) => <>
      <mesh position={[0, 0.82, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 2.1, 12]} />{M.brass({ col: "#b8902a" })}</mesh>
      {TURNOS.map((s, i) => { const a = Math.min(sec(p, KT[i], 0.3 + i * step), D - 1.0), on = eio(tt, a, a + 0.4), k = s === 0 ? (Math.max(0, tt - a) * 0.6) % 1 : (Math.log10(1 + s) / Math.log10(3601)) * eio(tt, a + 0.3, a + 1.2);
        const x = -0.88 + i * 0.22, drop = 0.18 * pop(tt, a);
        return <group key={i} position={[x, 0.82 - drop, 0.02 * on]}>
          <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.002, 0.002, 0.08 + drop * 2, 4]} />{M.steel()}</mesh>
          <Crono k={tt > a ? k : 0} r={0.085} col={s === 0 ? "#e8c020" : "#c8302a"} p={[0, -0.18 - drop * 0.0, 0]} />
          <mesh position={[0, -0.3, 0.0]}><sphereGeometry args={[0.02, 12, 10]} /><meshStandardMaterial color={TCOL[i]} emissive={TCOL[i]} emissiveIntensity={0.05 + 0.35 * on} /></mesh>
          <pointLight position={[0, -0.18, 0.2]} intensity={0.0001 + 0.6 * on} distance={0.45} color="#ffe8c0" /></group>; })}
      <spotLight position={[0, 1.8, 1.0]} angle={0.6} penumbra={0.6} intensity={2} distance={4} color="#fff0d8" />
    </>}</U3>;
};

// ---- MenosUnaHora · un reloj de pared grande de una hora; los nueve turnos entran como gajos de colores y se suman uno detrás de otro;
// en «hora» la suma se queda corta y el hueco que falta late en negro ----
const MenosUnaHora: React.FC<UP> = ({ d, p }) => {
  const aH = sec(p, "hora", 2.5), tot = TURNOS.reduce((a, b) => a + b, 0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="drop" sky="#0d0b0a" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.45, 0], az: [-0.1, 0.08], el: [0.06, 0.05], r: [1.3, 1.15], fov: 34 }}>{(tt) => {
    let acc = 0;
    return <>
      <group position={[0, 0.45, 0]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.36, 0.36, 0.05, 60]} />{M.wood({ base: [90, 60, 36] })}</mesh>
        <mesh position={[0, 0, 0.026]}><circleGeometry args={[0.33, 60]} /><meshStandardMaterial color="#efe6d2" /></mesh>
        {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i * PI / 6) * 0.3, Math.cos(i * PI / 6) * 0.3, 0.03]}><boxGeometry args={[0.012, 0.035, 0.002]} /><meshBasicMaterial color="#2a1a10" /></mesh>)}
        {TURNOS.map((s, i) => { const v = s === 0 ? 30 : s, g = eio(tt, 0.3 + i * (aH - 0.3) / 9, 0.6 + i * (aH - 0.3) / 9), st = acc; acc += v * g;
          const gs = 1 + 0.3 * (1 - g); return <mesh key={i} position={[0, 0, 0.03 + i * 0.0005 + 0.12 * (1 - g)]} rotation={[0, 0, PI / 2]} scale={[-gs, gs, 1]}><ringGeometry args={[0.12, 0.29, 48, 1, (st / 3600) * 2 * PI, Math.max(0.0005, (v * g / 3600) * 2 * PI)]} /><meshStandardMaterial color={TCOL[i]} emissive={TCOL[i]} emissiveIntensity={0.25} side={THREE.DoubleSide} /></mesh>; })}
        <mesh position={[0, 0, 0.028]} rotation={[0, 0, PI / 2]} scale={[-1, 1, 1]}><ringGeometry args={[0.12, 0.29, 48, 1, ((tot + 30) / 3600) * 2 * PI, 2 * PI * (1 - (tot + 30) / 3600)]} /><meshBasicMaterial color="#141210" transparent opacity={0.15 + 0.5 * eio(tt, aH, aH + 0.4) * (0.6 + 0.4 * Math.sin(tt * 2 * PI * 0.8))} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0, 0.034]}><circleGeometry args={[0.02, 16]} /><meshBasicMaterial color="#1a1410" /></mesh>
      </group>
      <pointLight position={[0, 0.6, 0.7]} intensity={2} distance={2} color="#fff0d8" />
    </>;
  }}</U3>;
};

// ---- SombraDebajo · nueve objetos en una vitrina (carbón, barco, bolo, rascacielos, barco Liberty, átomo, avión, barril, flor amarilla);
// detrás, en la pared, la luz proyecta sus sombras; en «debajo» la sombra de cada uno se transforma en la de un obrero ----
const SombraDebajo: React.FC<UP> = ({ d, p }) => {
  const aD = sec(p, "debajo", 3.0);
  const obj = (i: number) => i === 0 ? <mesh><dodecahedronGeometry args={[0.05, 0]} /><meshStandardMaterial color="#141414" metalness={0.5} roughness={0.3} flatShading /></mesh>
    : i === 1 ? <group><RBox s={[0.14, 0.04, 0.05]} r={0.015}><meshStandardMaterial color="#c83a2a" /></RBox><RBox s={[0.04, 0.04, 0.03]} r={0.008} p={[0, 0.04, 0]}><meshStandardMaterial color="#e8e4dc" /></RBox></group>
    : i === 2 ? <mesh position={[0, 0.02, 0]} scale={[1, 2.2, 1]}><sphereGeometry args={[0.03, 16, 12]} /><meshStandardMaterial color="#f6f2ea" /></mesh>
    : i === 3 ? <group>{[0.16, 0.12, 0.08].map((h, j) => <RBox key={j} s={[0.05 - j * 0.012, h, 0.05 - j * 0.012]} r={0.004} p={[0, h / 2 - 0.04 + j * 0.04, 0]}>{M.steel({ col: "#c8ccd0" })}</RBox>)}</group>
    : i === 4 ? <RBox s={[0.15, 0.035, 0.04]} r={0.01}><meshStandardMaterial color="#6a7278" /></RBox>
    : i === 5 ? <group>{[0, 1, 2].map((j) => <mesh key={j} rotation={[j, j * 1.2, 0]}><torusGeometry args={[0.045, 0.004, 6, 24]} /><meshStandardMaterial color="#5ac8ff" emissive="#2a8ad8" emissiveIntensity={0.8} /></mesh>)}<mesh><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#ff6a3a" /></mesh></group>
    : i === 6 ? <group><RBox s={[0.14, 0.02, 0.025]} r={0.008}>{M.chrome()}</RBox><RBox s={[0.03, 0.005, 0.12]} r={0.002}>{M.chrome()}</RBox></group>
    : i === 7 ? <mesh><cylinderGeometry args={[0.035, 0.035, 0.08, 20]} /><meshStandardMaterial color="#2a4a6a" metalness={0.5} roughness={0.4} /></mesh>
    : <group><mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.003, 0.003, 0.08, 6]} /><meshStandardMaterial color="#3a6a2a" /></mesh>{Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[Math.cos(j) * 0.02, 0.025, Math.sin(j) * 0.02]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#e8c020" /></mesh>)}</group>;
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" sky="#0d0b0a" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.36, 0], az: [-0.06, 0.06], el: [0.08, 0.06], r: [1.62, 1.5], fov: 36 }}>{(tt) => <>
      <mesh position={[0, 0.45, -0.35]}><planeGeometry args={[2.4, 1.0]} /><meshStandardMaterial color="#d8ccb4" roughness={1} /></mesh>
      <RBox s={[2.0, 0.03, 0.2]} r={0.01} p={[0, 0.2, 0.05]}>{M.wood({ base: [110, 76, 44] })}</RBox>
      {Array.from({ length: 9 }, (_, i) => { const x = -0.88 + i * 0.22, sw = eio(tt, aD + i * 0.18, aD + i * 0.18 + 1.0), k = pop(tt, 0.2 + i * 0.12);
        return <group key={i}>
          <group position={[x, 0.29, 0.05]} scale={sm(k) * 1.55}>{obj(i)}</group>
          <group position={[x, 0.42, -0.34]} scale={[1, 1, 0.02]}>
            <group scale={sm(1 - sw)}><mesh scale={[2.2, 2.2, 1]}><circleGeometry args={[0.05, 20]} /><meshBasicMaterial color="#2a241c" transparent opacity={0.55} /></mesh></group>
            <group position={[0, -0.18, 0]} scale={sm(sw)}><Stickman escala={0.12} rotY={0} guion={[{ t: 0, accion: ["cargar_caja", "empujar", "cargar_caja", "tipear", "empujar", "cargar_caja", "saludar", "empujar", "correr"][i] as any, expr: "neutral" }]} semilla={100 + i} contacto={0} color="#2a241c" /></group>
          </group></group>; })}
      <spotLight position={[0, 0.5, 1.4]} angle={0.5} penumbra={0.4} intensity={6} distance={4} color="#fff0d8" />
    </>}</U3>;
};

// ---- DecadaAbuelo · cierre: una mesa con una foto vieja enmarcada y nueve fichas de década; el stickman (vos) camina por las fichas;
// en «comentarios» se detiene en una y la levanta; en «suscribete» la campanita de bronce se balancea sobre la mesa ----
const DecadaAbuelo: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "comentarios", 2.0), aS = sec(p, "suscribete", 3.5);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="drop" sky="#0d0b0a" key1={[-1, 2.6, 1.8]}
    cam={{ at: [-0.05, 0.14, 0.05], az: [-0.2, 0.05], el: [0.3, 0.24], r: [1.0, 0.88], fov: 34 }}>{(tt) => {
    const walk = cl(tt / Math.max(1, aC)), pick = eio(tt, aC, aC + 0.6), ring = tt > aS ? Math.sin((tt - aS) * 2 * PI * 1.6) * Math.exp(-(tt - aS) * 1.2) : 0;
    return <>
      <group position={[-0.55, 0.12, -0.25]} rotation={[-0.25, 0.3, 0]}>
        <RBox s={[0.26, 0.32, 0.02]} r={0.01}>{M.wood({ base: [70, 46, 28] })}</RBox>
        <mesh position={[0, 0, 0.011]}><planeGeometry args={[0.2, 0.26]} /><meshStandardMaterial color="#b8a888" /></mesh>
        <group position={[0, -0.1, 0.012]} scale={[1, 1, 0.02]}><Stickman escala={0.09} rotY={0} guion={[{ t: 0, accion: "parado", expr: "neutral" }]} semilla={110} contacto={0} color="#5a4a3a" /></group></group>
      {TCOL.map((c, i) => { const x = -0.4 + i * 0.12, up = i === 4 ? pick : 0; return <mesh key={i} position={[x, 0.012 + up * 0.18, 0.1 - up * 0.02]} rotation={[-PI / 2 + up * 1.2, 0, 0]}><cylinderGeometry args={[0.045, 0.045, 0.012, 28]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.15 + (i === 4 ? 0.8 * pick : 0)} /></mesh>; })}
      <group position={[-0.4 + walk * 4 * 0.12, 0.018 + 0.07 * Math.abs(Math.sin(PI * walk * 4)), 0.1]}><Stickman escala={0.12} rotY={walk < 1 ? 90 : 160} guion={[{ t: 0, accion: "saltar", expr: "feliz" }, { t: aC, accion: "senalar", expr: "feliz" }]} semilla={111} contacto={0} color="#e8e4dc" /></group>
      <group position={[0.5, 0.2, -0.05]} rotation={[0, 0, ring * 0.5]}>
        <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.003, 0.003, 0.04, 4]} />{M.steel()}</mesh>
        <mesh position={[0, -0.03, 0]} rotation={[PI, 0, 0]}><sphereGeometry args={[0.06, 20, 12, 0, 2 * PI, 0, PI / 2]} />{M.brass({ col: "#d8a84a" })}</mesh></group>
      <mesh position={[0.5, 0.1, -0.05]}><cylinderGeometry args={[0.005, 0.005, 0.2, 6]} />{M.wood()}</mesh>
      <pointLight position={[0.5, 0.25, 0.2]} intensity={1.4 * Math.abs(ring)} distance={0.6} color="#ffe0a0" />
      <pointLight position={[0, 0.7, 0.6]} intensity={2.6} distance={2.2} color="#fff0d8" />
      <hemisphereLight args={["#e8dcc8", "#3a2a1a", 0.5]} />
    </>;
  }}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { AlasDosCaras, CamaraLiteras, CampanaBaja, MangueraUmbilical, EscotillaDias, RobotsQuietos, NoventaSegundos, TresMilSeiscientos, TurnoUnaVez, TableroFinal, MenosUnaHora, SombraDebajo, DecadaAbuelo };
