// dur29b · componentes únicos en 3D, bloque A: el túnel que escucha, los ocho cascos, el asiento con apodo, el peso del hoplita,
// la pared de escudos, el empujón, el casco que hierve, «con él o sobre él», el arco de 75 kg, los huesos y la cerca de estacas.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex, tubeG } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, EnSitio, Horse, Plate, fallY, latheG, pop, rockT } from "./kb";
import { Stickman } from "../stickman3d";

type UP = { d: number; p: any };
const PI = Math.PI;
const CLAY = [112, 118, 124];

// ---- ArcillaEscucha · «del otro lado de la arcilla hay alguien cavando otro túnel… y te está escuchando»: corte de la arcilla con
// tus dos túneles; el del enemigo avanza hacia el tuyo y cada raspado manda anillos por la tierra ----
export const ArcillaEscucha3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aO = sec(p, "otro", 1.2), aE = Math.min(sec(p, "escuchando", 3), D - 1);
  return <U3 d={d} bg={p.bg} ground={null} mode="iris" key1={[-1.2, 2.2, 2.4]} backZ={-1.2}
    cam={{ at: [0.1, 0.5, 0], az: [-0.18, 0.1], el: [0.08, 0.04], r: [2.6, 2.3], fov: 36 }}>{(tt) => {
    const ex = lerp(1.55, 0.62, eio(tt, aO, D - 0.4)), lis = eio(tt, aE, aE + 0.6);
    return <>
      {/* el bloque de arcilla cortado: detrás y abajo del corte */}
      <mesh position={[0, 0.5, -0.32]}><boxGeometry args={[3.6, 1.6, 0.5]} /><meshStandardMaterial map={rockT("arcilla", CLAY, 3, 2)} roughness={0.95} /></mesh>
      <mesh position={[0, -0.33, 0]}><boxGeometry args={[3.6, 0.06, 1.2]} /><meshStandardMaterial map={rockT("arcpiso", CLAY.map((v) => v * 0.8), 3, 1)} roughness={1} /></mesh>
      {/* tu túnel: hueco oscuro con marcos de madera, la cruz inclinada y tú acostado */}
      <mesh position={[-0.75, 0.32, -0.06]}><boxGeometry args={[1.3, 0.34, 0.02]} /><meshStandardMaterial color="#14110e" roughness={1} /></mesh>
      {[-1.3, -1.0, -0.7, -0.4, -0.12].map((x, i) => <group key={i} position={[x, 0.32, -0.02]}>
        <RBox s={[0.03, 0.34, 0.03]} p={[0, 0, 0]}>{M.wood({ base: [120, 84, 50] })}</RBox>
        <RBox s={[0.1, 0.03, 0.03]} p={[0, 0.17, 0]}>{M.wood({ base: [120, 84, 50] })}</RBox></group>)}
      <group position={[-0.72, 0.2, 0.02]} rotation={[0, 0, 0.12]}>
        <RBox s={[0.62, 0.025, 0.09]} r={0.004}>{M.wood({ base: [146, 104, 62] })}</RBox>
        <group position={[-0.3, 0.035, 0]} rotation={[0, 0, -PI / 2]}><Stickman escala={0.085} rotY={0} guion={[{ t: 0, accion: "quieto", expr: "nervioso" }, { t: aE, accion: "asustarse", expr: "asustado" }]} semilla={2} contacto={0} /></group>
      </group>
      <mesh position={[-0.45, 0.46, 0.02]}><sphereGeometry args={[0.018, 12, 10]} />{M.glow({ col: "#ffd27a" })}</mesh>
      <pointLight position={[-0.45, 0.42, 0.12]} intensity={0.9} distance={1.4} color="#ffc070" />
      {/* el túnel del enemigo: avanza desde la derecha */}
      <mesh position={[(ex + 1.75) / 2, 0.36, -0.06]}><boxGeometry args={[Math.max(0.01, 1.75 - ex), 0.3, 0.02]} /><meshStandardMaterial color="#0e0c0a" roughness={1} /></mesh>
      <group position={[ex + 0.08, 0.22, 0.0]}><Stickman escala={0.075} rotY={-90} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={9} contacto={0} color="#5a5048" /></group>
      {/* los anillos: cada raspado viaja por la arcilla hacia ti */}
      {Array.from({ length: 4 }, (_, i) => { const ph = ((tt * 0.7 + i / 4) % 1), r = 0.05 + ph * 1.1;
        return <mesh key={i} position={[ex, 0.36, 0.02]}><ringGeometry args={[r, r + 0.012, 64]} /><meshBasicMaterial color={lis > 0.5 ? "#ff8a5a" : "#e8d8b0"} transparent opacity={(1 - ph) * 0.55 * cl(tt - aO + 0.5)} depthWrite={false} toneMapped={false} /></mesh>; })}
      {/* la distancia que queda, grabada en una tablita clavada en la arcilla */}
      <Plate k="arcdist" txt="POCOS METROS" w={0.5} h={0.1} p={[0.05, 0.78, -0.05]} />
    </>;
  }}</U3>;
};

// ---- OchoCascos · «Hoy te mandan a ocho guerras distintas»: un estante largo; caen de a uno ocho cascos, del bronce griego al de
// acero de 1917, cada uno con su año grabado ----
const CASCOS = ["480 a.C.", "1415", "1630", "1812", "1854", "1863", "1943", "1917"];
export const Casco: React.FC<{ i: number }> = ({ i }) => {
  const bron = M.brass({ col: "#a8823a" }), st = M.steel({ col: "#8a8f94" }), lea = <meshStandardMaterial color="#5a3a22" roughness={0.75} />;
  if (i === 0) return <group><mesh position={[0, 0.1, 0]} scale={[1, 1.25, 1.1]}><sphereGeometry args={[0.09, 32, 20, 0, 2 * PI, 0, PI * 0.62]} />{bron}</mesh>
    {[-1, 1].map((s) => <mesh key={s} position={[s * 0.045, 0.03, 0.06]} rotation={[0, s * 0.4, 0]}><boxGeometry args={[0.04, 0.09, 0.01]} />{bron}</mesh>)}
    <mesh position={[0, 0.235, -0.02]} rotation={[0, PI / 2, 0]} scale={[1, 0.6, 0.25]}><torusGeometry args={[0.09, 0.03, 10, 30, PI]} /><meshStandardMaterial color="#8a2a1c" roughness={0.9} /></mesh></group>;
  if (i === 1) return <group><mesh position={[0, 0.08, 0]}><sphereGeometry args={[0.085, 28, 16, 0, 2 * PI, 0, PI / 2]} />{st}</mesh><mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.15, 0.15, 0.008, 36]} />{st}</mesh></group>;
  if (i === 2) return <group><mesh position={[0, 0.07, 0]} scale={[0.9, 1.4, 1.2]}><sphereGeometry args={[0.08, 28, 16, 0, 2 * PI, 0, PI / 2]} />{st}</mesh><mesh position={[0, 0.07, 0]} rotation={[PI / 2, 0, 0]} scale={[1, 1.5, 1]}><torusGeometry args={[0.09, 0.01, 8, 30]} />{st}</mesh><mesh position={[0, 0.15, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.05, 0.012, 8, 24, PI]} />{st}</mesh></group>;
  if (i === 3) return <group><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.085, 0.075, 0.2, 28]} /><meshStandardMaterial color="#1c2238" roughness={0.6} /></mesh><mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.087, 0.087, 0.012, 28]} />{M.brass()}</mesh><mesh position={[0, 0.01, 0.06]} rotation={[0.4, 0, 0]}><boxGeometry args={[0.15, 0.008, 0.06]} /><meshStandardMaterial color="#111" roughness={0.3} /></mesh><mesh position={[0, 0.222, 0.0]}><sphereGeometry args={[0.024, 12, 10]} /><meshStandardMaterial color="#c43a2a" roughness={0.9} /></mesh></group>;
  if (i === 4) return <group><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.08, 0.085, 0.11, 28]} /><meshStandardMaterial color="#2a2a30" roughness={0.7} /></mesh><mesh position={[0, 0.005, 0.07]} rotation={[0.3, 0, 0]}><boxGeometry args={[0.14, 0.006, 0.05]} /><meshStandardMaterial color="#111" roughness={0.3} /></mesh></group>;
  if (i === 5) return <group rotation={[0, 0, 0]}><mesh position={[0, 0.07, 0]} rotation={[0.25, 0, 0]}><cylinderGeometry args={[0.065, 0.085, 0.13, 28]} /><meshStandardMaterial color="#3a4660" roughness={0.75} /></mesh><mesh position={[0, 0.008, 0.075]} rotation={[0.25, 0, 0]}><boxGeometry args={[0.13, 0.006, 0.055]} /><meshStandardMaterial color="#111" roughness={0.3} /></mesh></group>;
  if (i === 6) return <group><mesh position={[0, 0.07, 0]} scale={[1, 1.1, 1.15]}><sphereGeometry args={[0.085, 28, 16, 0, 2 * PI, 0, PI * 0.6]} />{lea}</mesh>{[-1, 1].map((s) => <mesh key={s} position={[s * 0.04, 0.1, 0.08]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.028, 0.028, 0.02, 20]} />{M.glass({ op: 0.5, col: "#b8c8d0" })}</mesh>)}<mesh position={[0, 0.1, 0.075]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.12, 8]} /><meshStandardMaterial color="#222" /></mesh></group>;
  return <group><mesh position={[0, 0.045, 0]} scale={[1, 0.6, 1]}><sphereGeometry args={[0.09, 28, 16, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial color="#5a6248" metalness={0.5} roughness={0.5} /></mesh><mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.15, 0.15, 0.008, 36]} /><meshStandardMaterial color="#5a6248" metalness={0.5} roughness={0.5} /></mesh></group>;
};
export const OchoCascos3D: React.FC<UP> = ({ d, p }) => {
  const aO = sec(p, "ocho", 0.3);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-1.0, 2.4, 2.0]}
    cam={{ at: [0, 0.46, 0], az: [-0.08, 0.06], el: [0.2, 0.15], r: [2.8, 2.55], fov: 36 }}>{(tt) => <>
    <RBox s={[3.0, 0.05, 0.42]} r={0.01} p={[0, 0.24, 0]}><meshStandardMaterial map={tex.wood(4, 1, [96, 60, 32])} roughness={0.7} /></RBox>
    <RBox s={[3.0, 0.7, 0.04]} r={0.01} p={[0, 0.55, -0.21]}><meshStandardMaterial map={tex.wood(4, 1, [70, 44, 24])} roughness={0.8} /></RBox>
    {CASCOS.map((y, i) => { const x = -1.26 + i * 0.36, a = aO + 0.1 + i * 0.28;
      return <group key={i}>
        <mesh position={[x, 0.3, 0]}><cylinderGeometry args={[0.1, 0.12, 0.07, 28]} /><meshStandardMaterial map={dirtT([150, 140, 126])} roughness={0.9} /></mesh>
        <group position={[x, 0.335 + fallY(tt, a, 1.0), 0]} visible={tt > a - 0.25}><group scale={1.35}><Casco i={i} /></group></group>
        <group position={[x, 0.265, 0]}>
        <Plate k={"casco" + i} txt={y} w={0.3} h={0.085} p={[0, -0.005, 0.215]} rot={[-0.2, 0, 0]} /></group>
      </group>; })}
  </>}</U3>;
};

// ---- AsientoApodo · «en la parada siete hay un puesto… le habían puesto un apodo a su propio asiento»: un asiento de metal solo en
// la oscuridad, una placa con el 7 y una etiqueta de cartón que se balancea con el apodo tapado ----
export const AsientoApodo3D: React.FC<UP> = ({ d, p }) => {
  const aA = sec(p, "apodo", 1.6);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[0.4, 3.0, 0.6]}
    cam={{ at: [0, 0.66, 0], az: [-0.5, -0.2], el: [0.18, 0.1], r: [1.5, 1.28], fov: 34 }}>{(tt) => {
    const sw = 0.25 * Math.sin(tt * 2 * PI * 0.45) * Math.exp(-0.15 * Math.max(0, tt - aA));
    return <>
      {/* el asiento: chapa con agujeros, caño, burbuja de plexiglás alrededor */}
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.05, 0.08, 0.1, 20]} />{M.steel({ col: "#6a6e72" })}</mesh>
      <mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.02, 0.02, 0.4, 12]} />{M.steel({ col: "#7a7e82" })}</mesh>
      <RBox s={[0.3, 0.03, 0.26]} r={0.01} p={[0, 0.48, 0]}><meshStandardMaterial color="#4a4e50" metalness={0.6} roughness={0.5} /></RBox>
      <RBox s={[0.3, 0.32, 0.03]} r={0.01} p={[0, 0.64, -0.13]} rot={[-0.12, 0, 0]}><meshStandardMaterial color="#4a4e50" metalness={0.6} roughness={0.5} /></RBox>
      <mesh position={[0, 0.62, 0.05]}><sphereGeometry args={[0.42, 40, 24, 0, 2 * PI, 0, PI * 0.62]} />{M.glass({ op: 0.12 })}</mesh>
      <Plate k="siete" txt="7" w={0.1} h={0.1} p={[0, 0.66, -0.11]} rot={[-0.12, 0, 0]} mat="brass" font={96} />
      {/* la etiqueta colgando de un hilo */}
      <group position={[0.15, 0.82, 0.02]} rotation={[0, 0, sw]}>
        <mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.002, 0.002, 0.16, 6]} /><meshStandardMaterial color="#d8d0c0" /></mesh>
        <group position={[0, -0.2, 0]} scale={pop(tt, aA)}><Plate k="apodo" txt="¿APODO?" w={0.3} h={0.13} p={[0, 0, 0]} /></group>
      </group>
      <spotLight position={[0, 2.4, 0.6]} angle={0.32} penumbra={0.7} intensity={18} distance={4} color="#dfe6f0" />
      {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.0, ((rn(i, 2) + tt * 0.03 * (0.5 + rn(i, 3))) % 1) * 1.4, (rn(i, 4) - 0.5) * 0.8]}><sphereGeometry args={[0.004, 6, 6]} />{M.glow({ col: "#e8e4dc", op: 0.5 })}</mesh>)}
    </>;
  }}</U3>;
};

// ---- PesoHoplita · «Todo junto pesa entre veinte y treinta kilos»: una balanza de latón; en el platillo caen el casco, la coraza,
// las grebas, la lanza y el escudo, y los rodillos cuentan los kilos ----
export const PesoHoplita3D: React.FC<UP> = ({ d, p }) => {
  const aK = sec(p, "kilos", 2.6), ts = [0.3, 0.75, 1.2, 1.6, 2.0].map((x) => Math.min(x * aK / 2.6, aK));
  const kg = (tt: number) => [3, 8, 2, 3, 9].reduce((s, w, i) => s + w * cl((tt - ts[i]) / 0.3), 0) + 5 * eio(tt, aK, aK + 0.8);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="drop" key1={[-1.2, 2.4, 1.6]}
    cam={{ at: [-0.1, 0.62, 0], az: [-0.3, 0.1], el: [0.16, 0.1], r: [2.4, 2.1], fov: 34 }}
    over={(tt) => <Drums v={Math.round(kg(tt))} n={2} x={1330} y={140} s={1.3} unit="kg" />}>{(tt) => {
    const tilt = -0.32 * cl(kg(tt) / 30);
    const pan = (x: number) => [x * Math.cos(tilt), 0.86 + x * Math.sin(tilt)];
    const [lx, ly] = pan(-0.5), [rx, ry] = pan(0.5);
    return <>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.16, 0.2, 0.04, 32]} />{M.brass({ col: "#9a7434" })}</mesh>
      <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.02, 0.025, 0.85, 16]} />{M.brass()}</mesh>
      <group position={[0, 0.88, 0]} rotation={[0, 0, tilt]}><RBox s={[1.08, 0.03, 0.03]} r={0.01}>{M.brass()}</RBox></group>
      {[[lx, ly, 0], [rx, ry, 1]].map(([x, y, k]) => <group key={k} position={[x, y - 0.3, 0]}>
        {[0, 1, 2].map((j) => { const a = j * 2 * PI / 3; return <mesh key={j} position={[Math.cos(a) * 0.1, 0.15, Math.sin(a) * 0.1]} rotation={[Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3]}><cylinderGeometry args={[0.002, 0.002, 0.31, 4]} /><meshStandardMaterial color="#bba070" /></mesh>; })}
        <mesh><cylinderGeometry args={[0.22, 0.18, 0.025, 36]} />{M.brass({ col: "#b88c40" })}</mesh>
      </group>)}
      {/* el contrapeso: un saco quieto */}
      <mesh position={[rx, ry - 0.24, 0]} scale={[1, 0.8, 1]}><sphereGeometry args={[0.12, 20, 14]} /><meshStandardMaterial color="#8a7a5a" roughness={1} /></mesh>
      {/* el equipo cae al platillo izquierdo */}
      <group position={[lx, ly - 0.285, 0]}>
        <group position={[0.02, 0.05 + fallY(tt, ts[4], 1.2), 0]} visible={tt > ts[4] - 0.3}><group rotation={[PI / 2 - 0.1, 0, 0]}><mesh><cylinderGeometry args={[0.2, 0.2, 0.03, 40]} />{M.brass({ col: "#c89848" })}</mesh><mesh position={[0, 0.017, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.12, 0.15, 40]} /><meshStandardMaterial color="#8a2a1c" roughness={0.8} side={THREE.DoubleSide} /></mesh><mesh position={[0, 0.02, 0]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.045, 18, 10]} />{M.brass({ col: "#e0b060" })}</mesh></group></group>
        <group position={[-0.04, 0.09 + fallY(tt, ts[1], 1.2), 0]} visible={tt > ts[1] - 0.3}><mesh geometry={latheG("coraza", [[0.0, 0], [0.09, 0.0], [0.1, 0.08], [0.085, 0.16], [0.05, 0.18]], 32)} scale={[1, 1, 0.7]} rotation={[0, 0, PI / 2]}>{M.brass({ col: "#b89040" })}</mesh></group>
        <group position={[0.08, 0.12 + fallY(tt, ts[0], 1.2), 0.04]} visible={tt > ts[0] - 0.3}><group scale={1.0}><Casco i={0} /></group></group>
        {[-1, 1].map((s) => <group key={s} position={[-0.1, 0.04 + fallY(tt, ts[2], 1.2), s * 0.07]} rotation={[0, 0, PI / 2]} visible={tt > ts[2] - 0.3}><mesh><cylinderGeometry args={[0.025, 0.03, 0.14, 16, 1, true]} />{M.brass({ col: "#b08a3a" })}</mesh></group>)}
        <group position={[0, 0.06 + fallY(tt, ts[3], 1.2), -0.12]} rotation={[0, 0.3, PI / 2]} visible={tt > ts[3] - 0.3}><mesh><cylinderGeometry args={[0.012, 0.012, 1.1, 8]} /><meshStandardMaterial map={tex.wood(1, 4, [120, 84, 50])} /></mesh><mesh position={[0, 0.6, 0]}><coneGeometry args={[0.03, 0.12, 10]} />{M.steel()}</mesh></group>
      </group>
    </>;
  }}</U3>;
};

// ---- FalangeEscudos · «Cada escudo protegía tu lado izquierdo y la mitad del compañero… si uno se iba, se abría un agujero»: la fila
// de escudos superpuestos; el del medio se va y queda el hueco rojo en la pared ----
export const FalangeEscudos3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aH = Math.min(sec(p, "agujero", 2.4), D - 1.8);
  return <U3 d={d} bg={p.bg} ground={[176, 150, 110]} mode="drop" key1={[-1.6, 2.6, 2.0]}
    cam={{ at: [0, 0.28, 0], az: [-0.32, -0.22], el: [0.14, 0.1], r: [1.9, 1.6], fov: 34 }}>{(tt) => {
    const sp = eio(tt, aH + 0.3, aH + 1.0), go = eio(tt, aH - 0.6, aH + 0.4), gap = eio(tt, aH, aH + 0.5);
    return <>
      {Array.from({ length: 7 }, (_, i) => { const x = -0.9 + i * 0.3, mid = i === 3, z = mid ? -0.9 * go : 0;
        return <group key={i} position={[x, 0, z]}>
          <Stickman escala={0.12} rotY={mid && go > 0.05 ? 180 : 0} guion={[{ t: 0, accion: "idle", expr: mid ? "nervioso" : "decidido" }]} semilla={20 + i} contacto={0.4} colorContacto="#2a1a10" />
          {/* el escudo: tapa su izquierda y la mitad del de al lado */}
          <group position={[-0.08, 0.2, 0.09]} rotation={[0, 0.05, 0]}>
            <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.17, 0.17, 0.025, 40]} />{M.brass({ col: "#b08a3e" })}</mesh>
            <mesh position={[0, 0, 0.014]}><ringGeometry args={[0.13, 0.15, 40]} /><meshStandardMaterial color="#7a3a1c" roughness={0.8} /></mesh>
          </group>
          <mesh position={[0.05, 0.42, 0.06]}><cylinderGeometry args={[0.005, 0.005, 0.7, 6]} /><meshStandardMaterial map={tex.wood(1, 4, [120, 84, 50])} /></mesh>
          <mesh position={[0.05, 0.79, 0.06]}><coneGeometry args={[0.012, 0.05, 8]} />{M.steel()}</mesh>
        </group>; })}
      {/* el hueco: luz roja donde estaba el escudo */}
      <mesh position={[0.0, 0.22, 0.12]}><planeGeometry args={[0.2, 0.36]} /><meshBasicMaterial color="#e0442a" transparent opacity={0.35 * gap * (0.75 + 0.25 * Math.sin(tt * 2 * PI * 0.8))} depthWrite={false} toneMapped={false} /></mesh>
      <pointLight position={[0, 0.3, 0.4]} intensity={1.6 * gap} distance={1.2} color="#ff5a3a" />
      {/* la lanza enemiga que entra por el hueco */}
      <group position={[0.0, 0.28, 1.4 - 1.3 * sp]} rotation={[PI / 2, 0, 0]} visible={sp > 0.01}>
        <mesh><cylinderGeometry args={[0.008, 0.008, 1.2, 8]} /><meshStandardMaterial map={tex.wood(1, 4, [100, 70, 40])} /></mesh>
        <mesh position={[0, -0.64, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.02, 0.09, 10]} />{M.steel()}</mesh>
      </group>
    </>;
  }}</U3>;
};

// ---- Othismos · «El empujón… y adivina quién está en el medio del sándwich»: dos bloques que empujan; tú en la primera fila,
// marcado en dorado, te aplastan de los dos lados ----
export const Othismos3D: React.FC<UP> = ({ d, p }) => {
  const aS = sec(p, "medio", 2.0);
  return <U3 d={d} bg={p.bg} ground={[170, 146, 108]} mode="split" key1={[-1.2, 2.8, 1.8]}
    cam={{ at: [-0.1, 0.2, 0], az: [-0.2, 0.1], el: [0.2, 0.14], r: [1.9, 1.6], fov: 34 }}>{(tt) => {
    const sq = eio(tt, aS, aS + 0.6), push = 0.02 * Math.sin(tt * 2 * PI * 0.9);
    return <>
      {[-1, 1].map((side) => Array.from({ length: 12 }, (_, i) => { const row = Math.floor(i / 3), col = i % 3, x = side * (0.12 + row * 0.2) + side * push, z = -0.3 + col * 0.3;
        const you = side === -1 && row === 0 && col === 1;
        return <group key={side + "_" + i} position={[x, 0, z]} scale={you ? [1 - 0.18 * sq, 1, 1] : 1}>
          <Stickman escala={0.11} rotY={side === -1 ? 90 : -90} guion={[{ t: 0, accion: "empujar", expr: you ? "asustado" : "enojado" }]} semilla={50 + i + (side > 0 ? 20 : 0)} contacto={you ? 0.9 : 0.3}
            colorContacto={you ? "#d8a03a" : "#2a1a10"} color={you ? "#c8442a" : side > 0 ? "#6a625a" : undefined} />
        </group>; }))}
      {/* el dorado debajo de ti */}
      <mesh position={[-0.12, 0.004, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.08, 0.1, 40]} />{M.glow({ col: "#f0b84a", op: 0.4 + 0.5 * sq })}</mesh>
    </>;
  }}</U3>;
};

// ---- CascoVision · «adentro casi no oyes nada… y el sol lo calienta como una olla»: el casco corintio al sol; el bronce se pone
// al rojo y el termómetro de vidrio sube ----
export const CascoVision3D: React.FC<UP> = ({ d, p }) => {
  const aO = sec(p, "olla", 2.0);
  const temp = (tt: number) => 28 + 30 * eio(tt, 0.3, aO + 1.4);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[0.6, 3.0, 1.2]}
    cam={{ at: [0.1, 0.3, 0], az: [-0.55, -0.2], el: [0.12, 0.06], r: [1.45, 1.2], fov: 34 }}>{(tt) => {
    const h = eio(tt, 0.3, aO + 1.4);
    return <>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.2, 0.24, 0.06, 32]} /><meshStandardMaterial map={dirtT([170, 160, 146])} roughness={0.95} /></mesh>
      <group position={[0, 0.06, 0]}>
        <mesh geometry={latheG("corintio", [[0.13, 0], [0.16, 0.08], [0.17, 0.2], [0.15, 0.3], [0.1, 0.36], [0.0, 0.38]], 48)} scale={[1, 1, 1.15]}>
          <meshStandardMaterial color="#b08a40" metalness={1} roughness={0.3} emissive="#c03a10" emissiveIntensity={0.55 * h} side={THREE.DoubleSide} /></mesh>
        {/* las ranuras de los ojos y la abertura de la boca */}
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.06, 0.2, 0.18]} rotation={[0, s * 0.3, 0]}><boxGeometry args={[0.07, 0.025, 0.02]} /><meshBasicMaterial color="#060403" /></mesh>)}
        <mesh position={[0, 0.08, 0.19]}><boxGeometry args={[0.03, 0.12, 0.02]} /><meshBasicMaterial color="#060403" /></mesh>
        <mesh position={[0, 0.42, -0.02]} rotation={[0, PI / 2, 0]} scale={[1, 0.7, 0.3]}><torusGeometry args={[0.12, 0.04, 10, 30, PI]} /><meshStandardMaterial color="#8a2a1c" roughness={0.9} /></mesh>
      </group>
      {/* el termómetro de vidrio */}
      <group position={[0.42, 0.06, 0.05]}>
        <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.025, 0.025, 0.6, 20]} />{M.glass({ op: 0.3 })}</mesh>
        <mesh position={[0, 0.02, 0]}><sphereGeometry args={[0.045, 20, 16]} /><meshStandardMaterial color="#c0281e" roughness={0.3} /></mesh>
        <mesh position={[0, 0.04 + 0.27 * (0.2 + 0.8 * h), 0]}><cylinderGeometry args={[0.012, 0.012, Math.max(0.01, 0.54 * (0.2 + 0.8 * h)), 12]} /><meshStandardMaterial color="#c0281e" roughness={0.3} emissive="#801010" emissiveIntensity={0.3} /></mesh>
      </group>
      {/* el vapor que sale por las ranuras cuando se calienta */}
      {Array.from({ length: 18 }, (_, i) => { const ph = (tt * 0.45 + rn(i, 1)) % 1; return <mesh key={"v" + i} position={[(rn(i, 2) - 0.5) * 0.16, 0.28 + ph * 0.5, 0.22 + ph * 0.05]} scale={0.5 + ph * 1.4}><sphereGeometry args={[0.03, 10, 8]} /><meshBasicMaterial color="#f0ece4" transparent opacity={0.3 * (1 - ph) * cl((h - 0.35) * 2)} depthWrite={false} /></mesh>; })}
      {/* las voces de afuera: ondas que llegan y se apagan contra el bronce */}
      {[0, 1, 2].map((i) => { const ph = (tt * 0.5 + i / 3) % 1; return <mesh key={"o" + i} position={[-0.95 + ph * 0.7, 0.26, 0.05]} rotation={[0, PI / 2, 0]}><ringGeometry args={[0.18 * (1 - ph * 0.6), 0.19 * (1 - ph * 0.6) + 0.006, 40]} /><meshBasicMaterial color="#e8e0d0" transparent opacity={0.55 * (1 - ph)} depthWrite={false} side={THREE.DoubleSide} /></mesh>; })}
      {/* el sol de verano */}
      <mesh position={[-1.2, 2.2, -2.0]}><sphereGeometry args={[0.25, 24, 16]} />{M.glow({ col: "#fff0c0" })}</mesh>
      <directionalLight position={[-1.2, 2.2, -0.5]} intensity={1.2 + 0.8 * h} color="#ffe2a8" />
    </>;
  }}</U3>;
};

// ---- ConElSobreEl · «vuelve con él, o sobre él»: a la izquierda el soldado vuelve con el escudo al brazo; a la derecha el escudo
// es la camilla y cuatro lo cargan ----
export const ConElSobreEl3D: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "con", 0.6), aS = sec(p, "sobre", 1.8);
  return <U3 d={d} bg={p.bg} ground={[176, 150, 110]} mode="split" key1={[-1.2, 2.6, 1.8]}
    cam={{ at: [0, 0.3, 0], az: [-0.2, 0.1], el: [0.16, 0.1], r: [2.4, 2.1], fov: 34 }}>{(tt) => <>
    <group position={[-0.65, 0, 0]} scale={pop(tt, aC)}>
      <Stickman escala={0.14} rotY={20} guion={[{ t: 0, accion: "idle", expr: "decidido" }]} semilla={61} contacto={0.4} colorContacto="#2a1a10" />
      <group position={[-0.1, 0.24, 0.08]} rotation={[0, 0.3, 0]}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.17, 0.17, 0.025, 40]} />{M.brass({ col: "#d0a050" })}</mesh><mesh position={[0, 0, 0.014]}><torusGeometry args={[0.165, 0.012, 10, 48]} />{M.brass({ col: "#e8c070" })}</mesh><mesh position={[0, 0, 0.016]} scale={[1, 1, 0.45]}><sphereGeometry args={[0.04, 20, 12]} />{M.brass({ col: "#e8c070" })}</mesh><mesh position={[0, 0, 0.0135]}><ringGeometry args={[0.08, 0.1, 40]} /><meshStandardMaterial color="#7a2a1c" roughness={0.8} /></mesh></group>
      <Plate k="conel" txt="CON ÉL" w={0.36} h={0.09} p={[0, 0.03, 0.32]} rot={[-0.5, 0, 0]} mat="stone" />
    </group>
    <group position={[0.6, 0, 0]} scale={pop(tt, aS)}>
      {[[-0.22, -0.14], [-0.22, 0.14], [0.22, -0.14], [0.22, 0.14]].map(([x, z], i) => <group key={i} position={[x, 0, z]}><Stickman escala={0.12} rotY={90} guion={[{ t: 0, accion: "cargar_caja", expr: "triste" }]} semilla={70 + i} contacto={0.3} colorContacto="#2a1a10" /></group>)}
      <group position={[0, 0.2, 0]}>
        <mesh scale={[1.4, 1, 1]}><cylinderGeometry args={[0.2, 0.2, 0.025, 40]} />{M.brass({ col: "#a07a30" })}</mesh>
        <group position={[-0.12, 0.03, 0]} rotation={[0, 0, -PI / 2]}><Stickman escala={0.08} rotY={0} guion={[{ t: 0, accion: "quieto", expr: "dormido" as any }]} semilla={79} contacto={0} /></group>
      </group>
      <Plate k="sobreel" txt="SOBRE ÉL" w={0.4} h={0.09} p={[0, 0.03, 0.4]} rot={[-0.5, 0, 0]} mat="stone" />
    </group>
  </>}</U3>;
};

// ---- TensionArco · «una fuerza de unos cuarenta y cinco a setenta y cinco kilos. Cada vez»: el arco largo se tensa contra un
// dinamómetro; los rodillos marcan los kilos y las flechas se apilan, diez por minuto ----
export const TensionArco3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aK = sec(p, "kilos", 1.4);
  const draw = (tt: number) => { const c = (tt - 0.4) % 1.6; return tt < 0.4 ? 0 : c < 1.1 ? eio(c, 0, 1.0) : 1 - eio(c, 1.1, 1.3); };
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" key1={[-1.2, 2.4, 1.6]}
    cam={{ at: [0, 0.75, 0], az: [-0.05, 0.08], el: [0.06, 0.03], r: [2.6, 2.3], fov: 36 }}
    over={(tt) => <Drums v={Math.round(75 * draw(tt) * cl((tt - 0.2) / Math.max(0.5, aK)))} n={2} x={1330} y={140} s={1.3} unit="kg" />}>{(tt) => {
    const k = draw(tt), bend = 0.1 + 0.22 * k, pull = 0.08 + 0.45 * k, n = Math.min(10, Math.floor(Math.max(0, tt - 0.4) / 1.6));
    const bow = Array.from({ length: 13 }, (_, i) => { const u = i / 12 - 0.5; return [-bend * (1 - 4 * u * u), 0.75 + u * 1.3, 0]; });
    return <>
      {/* el arco de tejo: duramen claro, albura oscura */}
      <mesh geometry={tubeG("arco" + Math.round(bend * 200), bow, (u) => 0.022 * (1 - 0.6 * Math.abs(u - 0.5) * 2) + 0.006, 40, 10)} castShadow><meshStandardMaterial map={tex.wood(1, 4, [170, 110, 60])} roughness={0.6} /></mesh>
      {/* la cuerda hasta el gancho del dinamómetro */}
      <mesh geometry={tubeG("cuerda" + Math.round(pull * 200), [[0, 1.4, 0], [pull, 0.75, 0], [0, 0.1, 0]], 0.003, 24, 6)}><meshStandardMaterial color="#e8dcc0" roughness={0.8} /></mesh>
      <group position={[pull + 0.04, 0.75, 0]} rotation={[0, 0, -PI / 2]}>
        <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.035, 0.035, 0.34, 20]} />{M.brass()}</mesh>
        <mesh position={[0, 0.2, 0.036]}><planeGeometry args={[0.02, 0.28]} /><meshStandardMaterial color="#efe6d2" /></mesh>
        <mesh position={[0, 0.06 + 0.26 * k, 0.04]}><boxGeometry args={[0.04, 0.008, 0.004]} /><meshStandardMaterial color="#c0281e" /></mesh>
        <mesh position={[0, 0.41, 0]}><torusGeometry args={[0.03, 0.006, 8, 20]} />{M.steel()}</mesh>
      </group>
      {/* el poste que sostiene el arco */}
      <RBox s={[0.08, 1.5, 0.08]} r={0.01} p={[-0.32, 0.75, -0.08]}><meshStandardMaterial map={tex.wood(1, 3, [110, 72, 40])} roughness={0.7} /></RBox>
      {/* las flechas disparadas se apilan en el canasto */}
      <group position={[-0.9, 0, 0.2]}>
        <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.1, 0.08, 0.3, 24, 1, true]} /><meshStandardMaterial map={tex.wood(3, 1, [150, 110, 60])} side={THREE.DoubleSide} /></mesh>
        {Array.from({ length: 10 }, (_, i) => <group key={i} position={[(rn(i, 1) - 0.5) * 0.1, 0.38, (rn(i, 2) - 0.5) * 0.1]} rotation={[(rn(i, 3) - 0.5) * 0.25, 0, (rn(i, 4) - 0.5) * 0.25]} visible={i < n}>
          <mesh><cylinderGeometry args={[0.004, 0.004, 0.6, 6]} /><meshStandardMaterial color="#c8a070" /></mesh>
          <mesh position={[0, 0.27, 0]}><boxGeometry args={[0.02, 0.06, 0.002]} /><meshStandardMaterial color="#9a9a96" /></mesh></group>)}
      </group>
      {D > 0 && null}
    </>;
  }}</U3>;
};

// ---- HuesosAsimetricos · «El brazo izquierdo, el que sostiene el arco, era más grueso»: dos húmeros en el paño del museo; el
// izquierdo engorda y el calibre de latón mide la diferencia ----
const humero = (k: string) => latheG(k, [[0.0, -0.32], [0.05, -0.31], [0.06, -0.27], [0.035, -0.2], [0.028, 0], [0.032, 0.2], [0.05, 0.27], [0.055, 0.31], [0.0, 0.33]], 32);
export const HuesosAsimetricos3D: React.FC<UP> = ({ d, p }) => {
  const aG = sec(p, "grueso", 1.6);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[-0.8, 2.4, 1.8]}
    cam={{ at: [0, 0.08, 0], az: [-0.1, 0.1], el: [0.75, 0.6], r: [1.6, 1.4], fov: 34 }}>{(tt) => {
    const g = eio(tt, aG, aG + 1.4), cal = lerp(0.06, 0.06 * (1 + 0.45 * g), 1);
    return <>
      <mesh position={[0, 0.005, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.6, 1.1]} /><meshStandardMaterial color="#5a1a1a" roughness={1} /></mesh>
      {[[-0.22, 1 + 0.45 * g, "IZQUIERDO"], [0.22, 1, "DERECHO"]].map(([x, s, t], i) => <group key={i} position={[x as number, 0.05, 0]}>
        <mesh geometry={humero("hum")} rotation={[PI / 2, 0, 0]} scale={[s as number, 1, s as number]}><meshStandardMaterial color="#e6dcc4" roughness={0.75} /></mesh>
        <Plate k={"hueso" + i} txt={t as string} w={0.3} h={0.07} p={[0, -0.03, 0.42]} rot={[-PI / 2, 0, 0]} />
      </group>)}
      {/* el calibre de latón abraza el hueso izquierdo */}
      <group position={[-0.22, 0.06, 0.02]}>
        {[-1, 1].map((s) => <RBox key={s} s={[0.012, 0.03, 0.14]} r={0.003} p={[s * (cal + 0.008), 0.0, 0]}>{M.brass()}</RBox>)}
        <RBox s={[0.34, 0.012, 0.03]} r={0.003} p={[0, 0.02, -0.07]}>{M.brass()}</RBox>
      </group>
    </>;
  }}</U3>;
};

// ---- CercaEstacas · «la clavaban en el suelo, inclinada hacia el enemigo… los caballos no cargan contra eso»: brotan las estacas
// en fila; el caballo llega galopando y se frena delante ----
export const CercaEstacas3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aE = sec(p, "estaca", 0.5), aC = Math.min(sec(p, "caballos", 2.6), D - 1.6);
  return <U3 d={d} bg={p.bg} ground={[96, 80, 60]} mode="drop" key1={[-1.4, 2.4, 1.8]}
    cam={{ at: [0.1, 0.25, 0], az: [-0.75, -0.55], el: [0.2, 0.14], r: [2.4, 2.1], fov: 34 }}>{(tt) => {
    const run = eio(tt, aC - 1.0, aC + 0.3), rear = eio(tt, aC + 0.1, aC + 0.6) * (1 - eio(tt, aC + 1.4, aC + 2.0));
    return <>
      {Array.from({ length: 9 }, (_, i) => { const a = aE + i * 0.12, h = cl((tt - a) / 0.25);
        return <group key={i} position={[0, 0, -0.8 + i * 0.2]} rotation={[0, 0, -0.75]} visible={tt > a}>
          <mesh position={[0, 0.2 * h, 0]}><cylinderGeometry args={[0.0, 0.018, Math.max(0.01, 0.4 * h), 8]} /><meshStandardMaterial map={tex.wood(1, 3, [150, 110, 64])} roughness={0.7} /></mesh></group>; })}
      {/* los arqueros detrás de la cerca */}
      {[-0.5, 0, 0.5].map((z, i) => <group key={i} position={[-0.45, 0, z]}><Stickman escala={0.11} rotY={90} guion={[{ t: 0, accion: "idle", expr: "decidido" }]} semilla={80 + i} contacto={0.3} colorContacto="#1a120c" /></group>)}
      {/* el caballo: entra galopando desde la derecha y se encabrita delante de las puntas */}
      <group position={[lerp(2.2, 0.42, run), 0, 0.05]} rotation={[0, PI, rear * 0.5]}><Horse tt={tt} col="#6a4a32" gallop={run < 1 ? 1 : 0.15} s={1.1} /></group>
    </>;
  }}</U3>;
};
