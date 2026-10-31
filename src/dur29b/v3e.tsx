// dur29b · segunda versión de los componentes que el director creativo bajó de 8: objetos grandes que se entienden sin leer,
// cámara cerca, un solo mecanismo por idea. Reemplazan a los de v3a/v3b vía OVR (uniq.tsx).
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex, tubeG } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, Horse, Plate, fallY, latheG, pop, rockT } from "./kb";
import { Casco } from "./v3a";
import { Stickman } from "../stickman3d";

type UP = { d: number; p: any };
const PI = Math.PI;
const EARTH = [128, 96, 66];

// ---- OchoCascos · la cámara recorre el estante; cada casco cae cuando la cámara llega y se le prende su luz ----
const OchoCascos: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aO = sec(p, "ocho", 0.3), span = Math.max(2.4, D - aO - 1.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-1.0, 2.4, 2.0]}
    cam={{ at: [-1.0, 0.42, 0], at1: [1.0, 0.42, 0], az: [-0.24, 0.2], el: [0.16, 0.12], r: [1.3, 1.15], fov: 34 }}>{(tt) => <>
    <RBox s={[3.2, 0.05, 0.42]} r={0.01} p={[0, 0.24, 0]}><meshStandardMaterial map={tex.wood(4, 1, [96, 60, 32])} roughness={0.7} /></RBox>
    <RBox s={[3.2, 0.8, 0.04]} r={0.01} p={[0, 0.6, -0.21]}><meshStandardMaterial map={tex.wood(4, 1, [64, 40, 22])} roughness={0.8} /></RBox>
    {Array.from({ length: 8 }, (_, i) => { const x = -1.26 + i * 0.36, a = aO + 0.15 + i * span / 8, lit = eio(tt, a + 0.2, a + 0.7);
      return <group key={i}>
        <mesh position={[x, 0.3, 0]}><cylinderGeometry args={[0.11, 0.13, 0.07, 28]} /><meshStandardMaterial map={dirtT([150, 140, 126])} roughness={0.9} /></mesh>
        <mesh position={[x, 0.337, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.115, 0.16, 40]} />{M.glow({ col: "#ffcf80", op: 0.55 * lit })}</mesh>
        <pointLight position={[x, 0.85, 0.35]} intensity={0.9 * lit} distance={1.1} color="#ffd8a0" />
        <group position={[x, 0.335 + fallY(tt, a, 1.0), 0]} visible={tt > a - 0.25}><group scale={1.4}><Casco i={i} /></group></group>
      </group>; })}
  </>}</U3>;
};

// ---- AsientoApodo · el asiento de metal llena el cuadro; la etiqueta cae y queda colgada del respaldo ----
const AsientoApodo: React.FC<UP> = ({ d, p }) => {
  const aA = sec(p, "apodo", 1.6);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[0.4, 3.0, 0.6]}
    cam={{ at: [0, 0.58, 0], az: [-0.42, -0.2], el: [0.16, 0.1], r: [1.15, 0.95], fov: 34 }}>{(tt) => {
    const sw = 0.12 * Math.sin(tt * 2 * PI * 0.5) * Math.exp(-0.6 * Math.max(0, tt - aA - 0.4));
    return <>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.06, 0.1, 0.1, 24]} />{M.steel({ col: "#6a6e72" })}</mesh>
      <mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.025, 0.025, 0.4, 12]} />{M.steel({ col: "#7a7e82" })}</mesh>
      <RBox s={[0.36, 0.04, 0.3]} r={0.012} p={[0, 0.48, 0]}><meshStandardMaterial color="#4a4e50" metalness={0.6} roughness={0.45} /></RBox>
      <RBox s={[0.34, 0.06, 0.26]} r={0.03} p={[0, 0.52, 0.01]}><meshStandardMaterial color="#5a3a22" roughness={0.8} /></RBox>
      <RBox s={[0.36, 0.38, 0.035]} r={0.012} p={[0, 0.68, -0.15]} rot={[-0.12, 0, 0]}><meshStandardMaterial color="#4a4e50" metalness={0.6} roughness={0.45} /></RBox>
      {/* remaches del respaldo */}
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-0.15 + (i % 4) * 0.1, 0.52 + Math.floor(i / 4) * 0.32, -0.125 - Math.floor(i / 4) * 0.04]}><sphereGeometry args={[0.008, 8, 6]} />{M.steel()}</mesh>)}
      {/* las dos ametralladoras delante del asiento */}
      {[-0.26, 0.26].map((x, i) => <group key={i} position={[x, 0.58, 0.12]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.4, 14]} /><meshStandardMaterial color="#2a2c2e" metalness={0.7} roughness={0.4} /></mesh>
        <RBox s={[0.06, 0.08, 0.16]} r={0.01} p={[0, 0, -0.22]}><meshStandardMaterial color="#26282a" metalness={0.6} roughness={0.5} /></RBox></group>)}
      <Plate k="siete2" txt="7" w={0.1} h={0.1} p={[0, 0.06, 0.105]} mat="brass" font={96} />
      {/* la etiqueta cae del techo y queda colgada del respaldo */}
      <group position={[0, 0.72 + fallY(tt, aA, 0.7), -0.11]} rotation={[-0.12, 0, sw]} visible={tt > aA - 0.3}>
        <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.002, 0.002, 0.12, 6]} /><meshStandardMaterial color="#d8d0c0" /></mesh>
        <Plate k="apodo2" txt="¿APODO?" w={0.4} h={0.15} p={[0, 0, 0.012]} font={84} />
      </group>
      <spotLight position={[0, 2.4, 0.8]} angle={0.3} penumbra={0.7} intensity={20} distance={4} color="#dfe6f0" />
    </>;
  }}</U3>;
};

// ---- PesoHoplita · la cámara mira el platillo; cada pieza cae a su lugar (escudo parado atrás, casco, coraza, grebas, lanza
// cruzada) y la balanza baja con cada una ----
export const Escudo: React.FC<{ r?: number }> = ({ r = 0.2 }) => <group>
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[r, r, 0.03, 48]} />{M.brass({ col: "#c89848" })}</mesh>
  <mesh position={[0, 0, 0.016]}><ringGeometry args={[r * 0.55, r * 0.72, 48]} /><meshStandardMaterial color="#8a2a1c" roughness={0.8} /></mesh>
  <mesh position={[0, 0, 0.016]}><torusGeometry args={[r * 0.96, r * 0.06, 10, 48]} />{M.brass({ col: "#e8c070" })}</mesh>
  <mesh position={[0, 0, 0.02]} scale={[1, 1, 0.5]}><sphereGeometry args={[r * 0.22, 20, 12]} />{M.brass({ col: "#e8c070" })}</mesh>
  {Array.from({ length: 12 }, (_, i) => { const a = i * PI / 6; return <mesh key={i} position={[Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85, 0.02]}><sphereGeometry args={[r * 0.03, 8, 6]} />{M.steel({ col: "#d0c8b0" })}</mesh>; })}
</group>;
const PesoHoplita: React.FC<UP> = ({ d, p }) => {
  const aK = sec(p, "kilos", 2.6), ts = [0.3, 0.75, 1.2, 1.6, 2.0].map((x) => Math.min(x * aK / 2.6, aK));
  const W = [3, 8, 2, 3, 9];
  const kg = (tt: number) => W.reduce((s, w, i) => s + w * cl((tt - ts[i] - 0.2) / 0.3), 0) + 5 * eio(tt, aK, aK + 0.8);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="drop" key1={[-1.2, 2.4, 1.6]}
    cam={{ at: [-0.4, 0.68, 0], az: [-0.18, 0.02], el: [0.12, 0.08], r: [1.75, 1.55], fov: 34 }}
    over={(tt) => <Drums v={Math.round(kg(tt))} n={2} x={1330} y={260} s={1.3} unit="kg" />}>{(tt) => {
    const tilt = -0.3 * cl(kg(tt) / 30);
    const pan = (x: number) => [x * Math.cos(tilt), 0.86 + x * Math.sin(tilt)];
    const [lx, ly] = pan(-0.55), [rx, ry] = pan(0.55);
    return <>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.16, 0.2, 0.04, 32]} />{M.brass({ col: "#9a7434" })}</mesh>
      <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.022, 0.028, 0.85, 16]} />{M.brass()}</mesh>
      <group position={[0, 0.88, 0]} rotation={[0, 0, tilt]}><RBox s={[1.18, 0.035, 0.035]} r={0.01}>{M.brass()}</RBox></group>
      {[[lx, ly, 0], [rx, ry, 1]].map(([x, y, k]) => <group key={k} position={[x, y - 0.32, 0]}>
        {[0, 1, 2].map((j) => { const a = j * 2 * PI / 3; return <mesh key={j} position={[Math.cos(a) * 0.14, 0.16, Math.sin(a) * 0.14]} rotation={[Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4]}><cylinderGeometry args={[0.002, 0.002, 0.34, 4]} /><meshStandardMaterial color="#bba070" /></mesh>; })}
        <mesh><cylinderGeometry args={[0.32, 0.27, 0.025, 40]} />{M.brass({ col: "#b88c40" })}</mesh>
      </group>)}
      <mesh position={[rx, ry - 0.25, 0]} scale={[1, 0.8, 1]}><sphereGeometry args={[0.12, 20, 14]} /><meshStandardMaterial color="#8a7a5a" roughness={1} /></mesh>
      <group position={[lx, ly - 0.305, 0]}>
        {/* escudo, parado atrás */}
        <group position={[0, 0.2 + fallY(tt, ts[4], 1.2), -0.17]} rotation={[-0.22, 0, 0]} visible={tt > ts[4] - 0.3}><Escudo r={0.2} /></group>
        {/* coraza a la derecha */}
        <group position={[0.14, 0.0 + fallY(tt, ts[1], 1.2), 0.0]} visible={tt > ts[1] - 0.3}><mesh geometry={latheG("coraza2", [[0.0, 0], [0.08, 0.0], [0.09, 0.07], [0.075, 0.15], [0.045, 0.17], [0, 0.17]], 32)} scale={[1, 1, 0.7]}>{M.brass({ col: "#b89040" })}</mesh></group>
        {/* casco con cresta a la izquierda */}
        <group position={[-0.14, 0.0 + fallY(tt, ts[0], 1.2), 0.02]} visible={tt > ts[0] - 0.3}><group scale={1.25}><Casco i={0} /></group></group>
        {/* grebas adelante */}
        {[-1, 1].map((s) => <group key={s} position={[0.02 + s * 0.06, 0.03 + fallY(tt, ts[2], 1.2), 0.15]} rotation={[0, 0.3, PI / 2]} visible={tt > ts[2] - 0.3}><mesh><cylinderGeometry args={[0.03, 0.036, 0.16, 18, 1, true]} />{M.brass({ col: "#b08a3a" })}</mesh></group>)}
        {/* la lanza, gruesa, cruzada sobre todo */}
        <group position={[0.05, 0.12 + fallY(tt, ts[3], 1.2), 0.08]} rotation={[0, 0.25, PI / 2 - 0.08]} visible={tt > ts[3] - 0.3}>
          <mesh><cylinderGeometry args={[0.018, 0.02, 1.2, 12]} /><meshStandardMaterial map={tex.wood(1, 4, [130, 90, 52])} roughness={0.7} /></mesh>
          <mesh position={[0, 0.66, 0]}><coneGeometry args={[0.035, 0.14, 4]} />{M.steel({ col: "#c8ccd0" })}</mesh>
          <mesh position={[0, -0.63, 0]}><coneGeometry args={[0.022, 0.07, 8]} />{M.brass()}</mesh></group>
      </group>
    </>;
  }}</U3>;
};

// ---- FalangeEscudos · la pared de escudos; enseguida uno se cae y deja al de atrás desnudo; la cámara se mete en el hueco y entra
// la lanza enemiga ----
const FalangeEscudos: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aF = 0.5, aH = Math.max(1.4, Math.min(sec(p, "agujero", 2.4), D - 1.6));
  return <U3 d={d} bg={p.bg} ground={[176, 150, 110]} mode="drop" key1={[-1.6, 2.6, 2.0]}
    cam={{ at: [0, 0.3, 0], at1: [0, 0.32, 0.05], az: [-0.3, -0.06], el: [0.12, 0.08], r: [1.7, 0.95], fov: 34 }}>{(tt) => {
    const fall = eio(tt, aF, aF + 0.5), sp = eio(tt, aH, aH + 0.8), gap = eio(tt, aF + 0.2, aF + 0.7);
    return <>
      {Array.from({ length: 7 }, (_, i) => { const x = -0.9 + i * 0.3, mid = i === 3;
        return <group key={i} position={[x, 0, 0]}>
          <Stickman escala={0.12} rotY={0} guion={[{ t: 0, accion: "idle", expr: "decidido" }, ...(mid ? [{ t: aF + 0.3, accion: "asustarse", expr: "asustado" }] : [])] as any} semilla={20 + i} contacto={0.4} colorContacto="#2a1a10" color={mid ? "#c8442a" : undefined} />
          <group position={mid ? [-0.08, lerp(0.2, 0.03, fall), lerp(0.09, 0.32, fall)] : [-0.08, 0.2, 0.09]} rotation={[mid ? -PI / 2 * fall : 0, 0.05, 0]}><Escudo r={0.17} /></group>
          <mesh position={[0.05, 0.42, 0.06]}><cylinderGeometry args={[0.007, 0.007, 0.7, 6]} /><meshStandardMaterial map={tex.wood(1, 4, [120, 84, 50])} /></mesh>
          <mesh position={[0.05, 0.79, 0.06]}><coneGeometry args={[0.014, 0.05, 8]} />{M.steel()}</mesh>
        </group>; })}
      <mesh position={[0.0, 0.22, 0.13]}><planeGeometry args={[0.2, 0.36]} /><meshBasicMaterial color="#e0442a" transparent opacity={0.25 * gap * (0.75 + 0.25 * Math.sin(tt * 2 * PI * 0.8))} depthWrite={false} toneMapped={false} /></mesh>
      <pointLight position={[0, 0.3, 0.4]} intensity={1.4 * gap} distance={1.2} color="#ff5a3a" />
      <group position={[0.0, 0.26, 1.5 - 1.25 * sp]} rotation={[PI / 2, 0, 0]} visible={sp > 0.01}>
        <mesh><cylinderGeometry args={[0.012, 0.012, 1.2, 8]} /><meshStandardMaterial map={tex.wood(1, 4, [100, 70, 40])} /></mesh>
        <mesh position={[0, -0.65, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.028, 0.11, 4]} />{M.steel({ col: "#c8ccd0" })}</mesh>
      </group>
    </>;
  }}</U3>;
};

// ---- Othismos · la cámara empuja hasta ti (rojo, con luz) mientras las filas de atrás te aplastan ----
const Othismos: React.FC<UP> = ({ d, p }) => {
  const aS = sec(p, "medio", 2.0);
  return <U3 d={d} bg={p.bg} ground={[170, 146, 108]} mode="iris" key1={[-1.2, 2.8, 1.8]}
    cam={{ at: [-0.05, 0.22, 0], at1: [-0.13, 0.22, 0], az: [-0.3, -0.08], el: [0.2, 0.1], r: [1.9, 0.9], fov: 34 }}>{(tt) => {
    const sq = eio(tt, aS, aS + 0.6), push = 0.02 * Math.sin(tt * 2 * PI * 0.9);
    return <>
      {[-1, 1].map((side) => Array.from({ length: 12 }, (_, i) => { const row = Math.floor(i / 3), col = i % 3, x = side * (0.12 + row * 0.2) + side * push - (side === -1 && row > 0 ? 0.03 * sq : 0), z = -0.3 + col * 0.3;
        const you = side === -1 && row === 0 && col === 1;
        return <group key={side + "_" + i} position={[x, 0, z]} scale={you ? [1 - 0.18 * sq, 1, 1] : 1}>
          <Stickman escala={0.11} rotY={side === -1 ? 90 : -90} guion={[{ t: 0, accion: "empujar", expr: you ? "asustado" : "enojado" }]} semilla={50 + i + (side > 0 ? 20 : 0)} contacto={you ? 0.9 : 0.3}
            colorContacto={you ? "#d8a03a" : "#2a1a10"} color={you ? "#c8442a" : side > 0 ? "#6a625a" : undefined} />
        </group>; }))}
      <mesh position={[-0.12, 0.004, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.13, 40]} />{M.glow({ col: "#f0b84a", op: 0.25 + 0.35 * sq })}</mesh>
      <spotLight position={[-0.12, 1.6, 0.3]} angle={0.18} penumbra={0.6} intensity={6 + 8 * sq} distance={3} color="#ffd8a0" />
    </>;
  }}</U3>;
};

// ---- CascoVision · el casco corintio conserva su forma y enrojece desde adentro; vapor por las ranuras; termómetro entero ----
const CascoVision: React.FC<UP> = ({ d, p }) => {
  const aO = sec(p, "olla", 2.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[0.6, 3.0, 1.2]}
    cam={{ at: [0.12, 0.28, 0], az: [-0.5, -0.22], el: [0.1, 0.06], r: [1.5, 1.3], fov: 34 }}>{(tt) => {
    const h = eio(tt, 0.3, aO + 1.4);
    return <>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.2, 0.24, 0.06, 32]} /><meshStandardMaterial map={dirtT([170, 160, 146])} roughness={0.95} /></mesh>
      <group position={[0, 0.06, 0]}>
        <mesh geometry={latheG("corintio", [[0.13, 0], [0.16, 0.08], [0.17, 0.2], [0.15, 0.3], [0.1, 0.36], [0.0, 0.38]], 48)} scale={[1, 1, 1.15]}>
          <meshStandardMaterial color={new THREE.Color("#b08a40").lerp(new THREE.Color("#b0502a"), h * 0.6)} metalness={1} roughness={0.3} emissive="#ff4a10" emissiveIntensity={0.22 * h} side={THREE.DoubleSide} /></mesh>
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.06, 0.2, 0.18]} rotation={[0, s * 0.3, 0]}><boxGeometry args={[0.07, 0.025, 0.02]} /><meshBasicMaterial color={new THREE.Color("#060403").lerp(new THREE.Color("#ff7a30"), 0.6 * h)} toneMapped={false} /></mesh>)}
        <mesh position={[0, 0.08, 0.19]}><boxGeometry args={[0.03, 0.12, 0.02]} /><meshBasicMaterial color="#060403" /></mesh>
        <mesh position={[0, 0.33, -0.02]} rotation={[0, PI / 2, 0]} scale={[1, 0.7, 0.3]}><torusGeometry args={[0.12, 0.04, 10, 30, PI]} /><meshStandardMaterial color="#8a2a1c" roughness={0.9} /></mesh>
      </group>
      <group position={[0.38, 0.06, 0.05]}>
        <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.022, 0.022, 0.38, 20]} />{M.glass({ op: 0.3 })}</mesh>
        <mesh position={[0, 0.0, 0]}><sphereGeometry args={[0.04, 20, 16]} /><meshStandardMaterial color="#c0281e" roughness={0.3} /></mesh>
        <mesh position={[0, 0.02 + 0.17 * (0.2 + 0.8 * h), 0]}><cylinderGeometry args={[0.011, 0.011, Math.max(0.01, 0.34 * (0.2 + 0.8 * h)), 12]} /><meshStandardMaterial color="#c0281e" roughness={0.3} emissive="#801010" emissiveIntensity={0.3} /></mesh>
      </group>
      {Array.from({ length: 16 }, (_, i) => { const ph = (tt * 0.45 + rn(i, 1)) % 1, s = i % 2 ? 1 : -1; return <mesh key={"v" + i} position={[s * 0.06 + (rn(i, 2) - 0.5) * 0.04, 0.27 + ph * 0.32, 0.24 + ph * 0.05]} scale={0.4 + ph * 1.1}><sphereGeometry args={[0.025, 10, 8]} /><meshBasicMaterial color="#f0ece4" transparent opacity={0.3 * (1 - ph) * cl((h - 0.35) * 2)} depthWrite={false} /></mesh>; })}
      <mesh position={[-1.2, 2.2, -2.0]}><sphereGeometry args={[0.25, 24, 16]} />{M.glow({ col: "#fff0c0" })}</mesh>
      <directionalLight position={[-1.2, 2.2, -0.5]} intensity={1.2 + 0.8 * h} color="#ffe2a8" />
      <pointLight position={[0, 0.25, 0.05]} intensity={0.8 * h} distance={0.6} color="#ff6a2a" />
    </>;
  }}</U3>;
};

// ---- ArcillaEscucha · corte de tierra marrón en capas; tu túnel y el del enemigo a la misma altura, separados por una pared fina;
// tú acostado con un cuenco de agua contra la pared: cada golpe del otro lado hace ondas en el agua ----
const ArcillaEscucha: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aO = sec(p, "otro", 1.2), aE = Math.min(sec(p, "escuchando", 3), D - 1);
  return <U3 d={d} bg={p.bg} ground={null} mode="iris" key1={[-1.2, 2.2, 2.4]} backZ={-1.2}
    cam={{ at: [0.0, 0.36, 0], az: [-0.12, 0.06], el: [0.1, 0.06], r: [1.95, 1.7], fov: 36 }}>{(tt) => {
    const ex = lerp(0.95, 0.16, eio(tt, 0.2, aE + 0.4)), hit = (tt * 1.1) % 1, knock = Math.exp(-hit * 6) * cl(tt - 0.3);
    return <>
      <mesh position={[0, 0.4, -0.32]}><boxGeometry args={[3.4, 1.4, 0.5]} /><meshStandardMaterial map={rockT("arcilla2", EARTH, 3, 2)} roughness={0.95} /></mesh>
      {/* las capas del corte */}
      {[[-0.18, [96, 70, 46]], [0.08, [150, 116, 78]], [0.62, [110, 84, 58]], [0.86, [160, 128, 86]], [1.02, [86, 96, 50]]].map(([y, c], i) =>
        <mesh key={i} position={[0, y as number, -0.065]}><boxGeometry args={[3.4, 0.05 + 0.03 * rn(i, 1), 0.01]} /><meshStandardMaterial map={rockT("capa" + i, c as number[], 3, 1)} roughness={1} /></mesh>)}
      {/* tu túnel */}
      <mesh position={[-0.72, 0.34, -0.06]}><boxGeometry args={[1.12, 0.34, 0.02]} /><meshStandardMaterial color="#14110e" roughness={1} /></mesh>
      {[-1.2, -0.92, -0.64, -0.36].map((x, i) => <group key={i} position={[x, 0.34, -0.02]}>
        <RBox s={[0.03, 0.34, 0.03]} p={[0, 0, 0]}>{M.wood({ base: [120, 84, 50] })}</RBox>
        <RBox s={[0.12, 0.03, 0.03]} p={[0, 0.17, 0]}>{M.wood({ base: [120, 84, 50] })}</RBox></group>)}
      <group position={[-0.62, 0.2, 0.02]}>
        <RBox s={[0.56, 0.025, 0.09]} r={0.004}>{M.wood({ base: [146, 104, 62] })}</RBox>
        <group position={[-0.26, 0.035, 0]} rotation={[0, 0, -PI / 2]}><Stickman escala={0.085} rotY={0} guion={[{ t: 0, accion: "quieto", expr: "nervioso" }, { t: aE, accion: "asustarse", expr: "asustado" }] as any} semilla={2} contacto={0} /></group>
      </group>
      {/* el cuenco de agua contra la pared: anillos en la superficie con cada golpe */}
      <group position={[-0.22, 0.2, 0.0]}>
        <mesh geometry={latheG("cuenco", [[0, 0], [0.06, 0.0], [0.075, 0.04], [0.08, 0.06]], 32)}><meshStandardMaterial color="#8a5a34" roughness={0.6} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.05 + 0.006 * knock, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.074, 32]} /><meshStandardMaterial color="#3a5060" metalness={0.3} roughness={0.1} /></mesh>
        {[0, 1, 2].map((k) => { const ph = (hit + k / 3) % 1; return <mesh key={k} position={[0, 0.052, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.01 + ph * 0.06, 0.014 + ph * 0.06, 32]} /><meshBasicMaterial color="#d8eef8" transparent opacity={0.8 * (1 - ph) * cl(tt - aO)} depthWrite={false} /></mesh>; })}
      </group>
      <mesh position={[-0.42, 0.47, 0.02]}><sphereGeometry args={[0.018, 12, 10]} />{M.glow({ col: "#ffd27a" })}</mesh>
      <pointLight position={[-0.42, 0.42, 0.14]} intensity={1.0} distance={1.4} color="#ffc070" />
      {/* el túnel del enemigo, a la misma altura, avanza hasta la pared fina */}
      <mesh position={[(ex + 1.7) / 2, 0.34, -0.06]}><boxGeometry args={[Math.max(0.01, 1.7 - ex), 0.32, 0.02]} /><meshStandardMaterial color="#0e0c0a" roughness={1} /></mesh>
      <group position={[ex + 0.1, 0.2, 0.0]}><Stickman escala={0.08} rotY={-90} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={9} contacto={0} color="#5a5048" /></group>
      {/* la cuchara de zapa del enemigo, golpeando la pared */}
      <group position={[ex + 0.02 - 0.03 * knock, 0.34, -0.02]} rotation={[0, 0, PI / 2]}>
        <mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.008, 0.008, 0.16, 8]} /><meshStandardMaterial map={tex.wood(1, 2, [120, 84, 50])} /></mesh>
        <mesh position={[0, 0.02, 0]}><coneGeometry args={[0.03, 0.06, 4]} />{M.steel({ col: "#b0b4b8" })}</mesh></group>
      {/* el golpe viaja por la pared fina hasta el cuenco */}
      {[0, 1].map((k) => { const ph = (hit + k / 2) % 1, r = 0.04 + ph * 0.42; return <mesh key={k} position={[ex, 0.34, -0.03]}><ringGeometry args={[r, r + 0.01, 48]} /><meshBasicMaterial color="#ffb070" transparent opacity={(1 - ph) * 0.5 * cl(tt - aO)} depthWrite={false} toneMapped={false} /></mesh>; })}
    </>;
  }}</U3>;
};

// ---- ConElSobreEl · un solo escudo grande: primero en el brazo del soldado; en «sobre» gira a horizontal, el soldado queda acostado
// encima y aparecen los cuatro que lo cargan ----
const ConElSobreEl: React.FC<UP> = ({ d, p }) => {
  const aS = sec(p, "sobre", 1.8);
  return <U3 d={d} bg={p.bg} ground={[176, 150, 110]} mode="iris" key1={[-1.2, 2.6, 1.8]}
    cam={{ at: [0.05, 0.24, 0], az: [-0.5, -0.2], el: [0.26, 0.4], r: [1.45, 1.6], fov: 34 }}>{(tt) => {
    const r = eio(tt, aS - 0.1, aS + 0.7), lie = eio(tt, aS - 0.2, aS + 0.5);
    return <>
      {/* el soldado: de pie, se va inclinando hasta quedar acostado sobre el escudo */}
      <group position={[-0.16 * lie, 0.27 * lie, 0]} rotation={[0, 0, -PI / 2 * lie]}>
        <Stickman escala={0.13} rotY={0} guion={[{ t: 0, accion: "idle", expr: "decidido" }, { t: aS, accion: "quieto", expr: "dormido" }] as any} semilla={61} contacto={0.4 * (1 - lie)} colorContacto="#2a1a10" />
      </group>
      {/* el escudo: en el brazo (vertical) → camilla (horizontal) */}
      <group position={[lerp(-0.2, 0.06, r), lerp(0.2, 0.25, r), lerp(0.04, 0, r)]} rotation={[-PI / 2 * r, lerp(-0.9, 0, r), 0]} scale={[1 + 0.4 * r, 1, 1]}><Escudo r={0.19} /></group>
      {/* los cuatro que lo cargan */}
      {[[-0.22, -0.26], [-0.22, 0.26], [0.34, -0.26], [0.34, 0.26]].map(([x, z], i) => <group key={i} position={[x, 0, z]} scale={pop(tt, aS + 0.5 + i * 0.08)}><Stickman escala={0.12} rotY={90} guion={[{ t: 0, accion: "cargar_caja", expr: "triste" }]} semilla={70 + i} contacto={0.3} colorContacto="#2a1a10" /></group>)}
    </>;
  }}</U3>;
};

// ---- TensionArco · el arco colgado de la viga; de la cuerda cuelga un dinamómetro y debajo se van sumando sacos de 15 kg: el arco se
// dobla con cada saco hasta 75 ----
const TensionArco: React.FC<UP> = ({ d, p }) => {
  const aK = sec(p, "kilos", 1.4), ts = [0, 1, 2, 3, 4].map((i) => 0.3 + i * Math.max(0.35, (aK + 0.3) / 5));
  const kg = (tt: number) => ts.reduce((s, a) => s + 15 * cl((tt - a - 0.25) / 0.35), 0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" key1={[-1.2, 2.4, 1.6]}
    cam={{ at: [0, 0.72, 0], az: [-0.12, 0.06], el: [0.08, 0.04], r: [2.15, 1.95], fov: 36 }}
    over={(tt) => <Drums v={Math.round(kg(tt))} n={2} x={1330} y={260} s={1.3} unit="kg" />}>{(tt) => {
    const k = kg(tt) / 75, bend = 0.05 + 0.2 * k, pull = 0.1 + 0.32 * k, top = 1.25;
    const bow = Array.from({ length: 13 }, (_, i) => { const u = i / 12 - 0.5; return [u * 1.3 * (1 - 0.12 * k), top - bend * 4 * u * u, 0]; });
    const tip = 0.65 * (1 - 0.12 * k), hy = top - bend - pull;
    return <>
      <RBox s={[1.9, 0.1, 0.12]} r={0.01} p={[0, top + 0.12, -0.02]}><meshStandardMaterial map={tex.wood(3, 1, [100, 66, 36])} roughness={0.7} /></RBox>
      <mesh position={[0, top + 0.04, 0]}><torusGeometry args={[0.04, 0.008, 8, 20]} />{M.steel()}</mesh>
      <mesh geometry={tubeG("arco2_" + Math.round(k * 60), bow, (u) => 0.026 * (1 - 0.6 * Math.abs(u - 0.5) * 2) + 0.007, 40, 10)} castShadow><meshStandardMaterial map={tex.wood(4, 1, [170, 110, 60])} roughness={0.6} /></mesh>
      <mesh geometry={tubeG("cuerda2_" + Math.round(k * 60), [[-tip, top - bend, 0], [0, hy, 0], [tip, top - bend, 0]], 0.004, 24, 6)}><meshStandardMaterial color="#e8dcc0" roughness={0.8} /></mesh>
      {/* el dinamómetro con su aguja */}
      <group position={[0, hy - 0.2, 0]}>
        <mesh><cylinderGeometry args={[0.06, 0.06, 0.32, 24]} />{M.brass()}</mesh>
        <mesh position={[0, 0, 0.061]}><planeGeometry args={[0.07, 0.26]} /><meshStandardMaterial color="#efe6d2" /></mesh>
        {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0.012, 0.11 - i * 0.044, 0.062]}><planeGeometry args={[0.03, 0.004]} /><meshBasicMaterial color="#3a2a1a" /></mesh>)}
        <mesh position={[-0.008, 0.11 - 0.22 * k, 0.064]}><boxGeometry args={[0.06, 0.01, 0.004]} /><meshStandardMaterial color="#c0281e" emissive="#801010" emissiveIntensity={0.4} /></mesh>
        <mesh position={[0, 0.19, 0]}><torusGeometry args={[0.025, 0.006, 8, 20]} />{M.steel()}</mesh>
        <mesh position={[0, -0.2, 0]}><torusGeometry args={[0.025, 0.006, 8, 20]} />{M.steel()}</mesh>
      </group>
      {/* los sacos de 15 kg, uno debajo del otro */}
      {ts.map((a, i) => <group key={i} position={[(i % 2 ? 1 : -1) * 0.07 * (i > 0 ? 1 : 0), hy - 0.5 - i * 0.13 + fallY(tt, a, 0.5), 0]} visible={tt > a - 0.2}>
        <mesh scale={[1, 0.85, 0.9]}><sphereGeometry args={[0.085, 20, 14]} /><meshStandardMaterial map={tex.wood(2, 2, [150, 128, 90])} roughness={1} /></mesh>
        <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.02, 0.03, 0.04, 10]} /><meshStandardMaterial color="#8a7050" roughness={1} /></mesh></group>)}
      <mesh position={[0, hy - 0.5 - 0.26, 0]}><cylinderGeometry args={[0.003, 0.003, 0.62, 6]} /><meshStandardMaterial color="#8a7a5a" /></mesh>
    </>;
  }}</U3>;
};

// ---- HuesosAsimetricos · dos húmeros grandes; un calibre de acero muerde el izquierdo y los rodillos dan los milímetros ----
const humero = (k: string) => latheG(k, [[0.0, -0.32], [0.05, -0.31], [0.06, -0.27], [0.035, -0.2], [0.028, 0], [0.032, 0.2], [0.05, 0.27], [0.055, 0.31], [0.0, 0.33]], 32);
const HuesosAsimetricos: React.FC<UP> = ({ d, p }) => {
  const aG = sec(p, "grueso", 1.6);
  const mm = (tt: number) => Math.round(21 + 9 * eio(tt, aG, aG + 1.4));
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[-0.8, 2.4, 1.8]}
    cam={{ at: [-0.04, 0.06, 0.12], az: [-0.1, 0.05], el: [0.95, 0.85], r: [1.45, 1.3], fov: 34 }}
    over={(tt) => <Drums v={mm(tt)} n={2} x={1330} y={260} s={1.3} unit="mm" />}>{(tt) => {
    const g = eio(tt, aG, aG + 1.4), w = 0.028 * 1.4 * (1 + 0.45 * g), fl = Math.exp(-Math.max(0, tt - aG - 1.4) * 3) * cl((tt - aG - 1.2) * 5);
    return <>
      <mesh position={[0, 0.005, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.6, 1.1]} /><meshStandardMaterial color="#5a1a1a" roughness={1} /></mesh>
      {[[-0.2, 1 + 0.45 * g, "IZQUIERDO"], [0.2, 1, "DERECHO"]].map(([x, s, t], i) => <group key={i} position={[x as number, 0.06, 0]}>
        <mesh geometry={humero("hum2")} rotation={[PI / 2, 0, 0]} scale={[1.4 * (s as number), 1.4, 1.4 * (s as number)]}><meshStandardMaterial color="#e6dcc4" roughness={0.75} emissive="#ffcf80" emissiveIntensity={i === 0 ? 0.25 * fl : 0} /></mesh>
        <Plate k={"hueso2" + i} txt={t as string} w={0.3} h={0.08} p={[0, 0.0, 0.52]} rot={[-PI / 2, 0, 0]} font={72} />
      </group>)}
      {/* el calibre: regla de acero con dos mordazas que abrazan la diáfisis del izquierdo */}
      <group position={[-0.2, 0.07, -0.02]}>
        <RBox s={[0.5, 0.012, 0.05]} r={0.003} p={[0.12, 0.06, -0.2]}>{M.steel({ col: "#c8ccd0" })}</RBox>
        {[-1, 1].map((s) => <RBox key={s} s={[0.016, 0.03, 0.22]} r={0.003} p={[s * (w + 0.01), 0.04, -0.1]}>{M.steel({ col: "#d0d4d8" })}</RBox>)}
        {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.12 + i * 0.04, 0.067, -0.18]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.003, i % 2 ? 0.015 : 0.03]} /><meshBasicMaterial color="#2a2a2a" /></mesh>)}
      </group>
      <pointLight position={[-0.2, 0.5, 0.2]} intensity={1.5 * fl} distance={1.2} color="#ffd8a0" />
    </>;
  }}</U3>;
};

// ---- CercaEstacas · tres filas de estacas gruesas a 45°; el caballo llega galopando y frena en seco con una nube de barro ----
const CercaEstacas: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aE = sec(p, "estaca", 0.5), aC = Math.min(sec(p, "caballos", 2.6), D - 1.6);
  return <U3 d={d} bg={p.bg} ground={[96, 80, 60]} mode="drop" key1={[-1.4, 2.4, 1.8]}
    cam={{ at: [0.4, 0.26, 0], az: [0.55, 0.42], el: [0.08, 0.06], r: [2.0, 1.75], fov: 34 }}>{(tt) => {
    const run = eio(tt, aC - 1.0, aC + 0.15), stop = eio(tt, aC + 0.05, aC + 0.4), rear = stop * (1 - eio(tt, aC + 1.4, aC + 2.0)), dust = cl((tt - aC) / 1.6);
    return <>
      {Array.from({ length: 24 }, (_, i) => { const row = Math.floor(i / 8), c = i % 8, a = aE + c * 0.08 + row * 0.15, h = cl((tt - a) / 0.25);
        return <group key={i} position={[row * 0.13, 0, -0.75 + c * 0.21 + (row % 2) * 0.1]} rotation={[0, 0, -PI / 4]} visible={tt > a}>
          <mesh position={[0, 0.3 * h, 0]}><cylinderGeometry args={[0.0, 0.035, Math.max(0.01, 0.6 * h), 10]} /><meshStandardMaterial map={tex.wood(1, 3, [150, 110, 64])} roughness={0.7} /></mesh></group>; })}
      {[-0.5, 0, 0.5].map((z, i) => <group key={i} position={[-0.6, 0, z]}><Stickman escala={0.1} rotY={90} guion={[{ t: 0, accion: "idle", expr: "decidido" }]} semilla={80 + i} contacto={0.3} colorContacto="#1a120c" /></group>)}
      <group position={[lerp(2.4, 0.78, run), 0, 0.05]} rotation={[0, PI, rear * 0.4]}><Horse tt={tt} col="#6a4a32" gallop={1 - stop * 0.9} s={1.4} /></group>
      {Array.from({ length: 14 }, (_, i) => { const ph = cl(dust * (0.6 + 0.6 * rn(i, 1))); return <mesh key={i} position={[0.75 + (rn(i, 2) - 0.3) * 0.4 * ph, 0.03 + ph * 0.2 * rn(i, 3), (rn(i, 4) - 0.5) * 0.5 * ph]} scale={Math.max(0.001, ph * (0.6 + rn(i, 5)))}>
        <sphereGeometry args={[0.06, 10, 8]} /><meshStandardMaterial color="#6a5440" roughness={1} transparent opacity={0.7 * (1 - ph)} depthWrite={false} /></mesh>; })}
    </>;
  }}</U3>;
};

// ---- AsedioCorte · el barril de pólvora grande en primer plano con la mecha chispeando; arriba la muralla de bloques se desarma
// por tandas y sube una columna de polvo ----
const AsedioCorte: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aP = sec(p, "polvora", 2.0), aV = Math.min(Math.max(sec(p, "volarla", 3.0), aP + 1.0), D - 1.6);
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" key1={[-1.4, 2.6, 2.2]} backZ={-1.6}
    cam={{ at: [0.3, 0.3, 0], at1: [0.42, 0.45, 0], az: [-0.2, 0.06], el: [0.08, 0.1], r: [1.55, 1.75], fov: 36 }}>{(tt) => {
    const dig = eio(tt, 0.2, aP), fuse = eio(tt, aP + 0.2, aV), dust = eio(tt, aV, aV + 1.8);
    const tx = lerp(-1.2, 0.45, dig);
    return <>
      <mesh position={[0, 0.0, -0.2]}><boxGeometry args={[3.6, 0.8, 0.4]} /><meshStandardMaterial map={rockT("asedio2", EARTH, 3, 1)} roughness={1} /></mesh>
      <mesh position={[0, 0.405, -0.2]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3.6, 0.4]} /><meshStandardMaterial color="#6a7a40" roughness={1} /></mesh>
      <mesh position={[(tx - 1.2) / 2, -0.04, 0.005]}><planeGeometry args={[Math.max(0.01, tx + 1.2), 0.22]} /><meshBasicMaterial color="#120d09" /></mesh>
      {Array.from({ length: 8 }, (_, i) => { const x = -1.1 + i * 0.22; return <group key={i} visible={x < tx}><RBox s={[0.025, 0.22, 0.02]} p={[x, -0.04, 0.02]}>{M.wood({ base: [130, 92, 54] })}</RBox></group>; })}
      {/* el barril grande con la mecha */}
      <group position={[0.42, -0.02, 0.06]} scale={1.7 * pop(tt, aP)}>
        <mesh geometry={latheG("barril", [[0, -0.09], [0.07, -0.09], [0.085, 0], [0.07, 0.09], [0, 0.09]], 28)}>{M.wood({ base: [120, 76, 40] })}</mesh>
        {[-0.06, 0.06].map((y, i) => <mesh key={i} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.08, 0.005, 6, 28]} />{M.steel({ col: "#4a4a4a" })}</mesh>)}
      </group>
      <mesh geometry={tubeG("mecha", [[0.42, 0.03, 0.06], [0.2, -0.02, 0.06], [-0.2, -0.1, 0.06], [-0.6, -0.1, 0.06]], 0.004, 30, 6)}><meshStandardMaterial color="#3a2a1a" /></mesh>
      {/* la chispa recorre la mecha hacia el barril */}
      <group position={[lerp(-0.6, 0.42, fuse), lerp(-0.1, 0.03, fuse * fuse), 0.07]} visible={tt > aP + 0.2 && tt < aV}>
        <mesh><sphereGeometry args={[0.012, 10, 8]} />{M.glow({ col: "#ffd27a" })}</mesh>
        {Array.from({ length: 6 }, (_, i) => { const ph = (tt * 2 + rn(i, 1)) % 1; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.06 * ph, 0.05 * ph, (rn(i, 3) - 0.5) * 0.04 * ph]}><sphereGeometry args={[0.004, 6, 6]} />{M.glow({ col: "#ffb040", op: 1 - ph })}</mesh>; })}
      </group>
      <pointLight position={[lerp(-0.6, 0.42, fuse), 0.05, 0.2]} intensity={0.8 * cl((tt - aP - 0.2) * 3) * (1 - cl((tt - aV) * 3))} distance={0.8} color="#ffb060" />
      {/* la muralla: bloques que se desarman por tandas */}
      {Array.from({ length: 30 }, (_, i) => { const c = i % 10, r = Math.floor(i / 10), x = 0.0 + c * 0.1, y = 0.46 + r * 0.1, near = Math.abs(x - 0.45) < 0.26;
        const a = aV + 0.05 + r * 0.18 + rn(i, 7) * 0.15, k = near ? eio(tt, a, a + 0.9) : 0;
        return <group key={i} position={[x + k * (x - 0.45) * 0.8, y + k * (0.35 + 0.35 * rn(i, 2)) - k * k * 0.25, -0.2 + k * (rn(i, 4) - 0.3) * 0.5]} rotation={[k * (rn(i, 5) - 0.5) * 2, 0, k * (rn(i, 3) - 0.5) * 2]}>
          <RBox s={[0.095, 0.092, 0.16]} r={0.012}><meshStandardMaterial map={rockT("bloque" + (i % 3), [140 - 10 * (i % 3), 128 - 8 * (i % 3), 108], 1, 1)} roughness={0.95} /></RBox></group>; })}
      {[-0.08, 1.0].map((x, i) => <group key={"tw" + i} position={[x, 0.42, -0.2]}><mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.09, 0.1, 0.5, 16]} /><meshStandardMaterial map={rockT("torre", [134, 122, 104], 1, 2)} roughness={0.95} /></mesh><mesh position={[0, 0.56, 0]}><coneGeometry args={[0.11, 0.16, 16]} /><meshStandardMaterial color="#7a3a26" roughness={0.8} /></mesh></group>)}
      {/* la columna de polvo */}
      {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[0.45 + (rn(i, 1) - 0.5) * 0.45 * (0.5 + dust), 0.45 + dust * (0.2 + 0.9 * rn(i, 2)), -0.15 + (rn(i, 3) - 0.5) * 0.3]} scale={Math.max(0.001, dust * (0.6 + rn(i, 4)))}>
        <sphereGeometry args={[0.09, 12, 10]} /><meshStandardMaterial color="#8a8070" roughness={1} transparent opacity={0.75 * (1 - 0.6 * eio(tt, aV + 1.2, aV + 2.6))} depthWrite={false} /></mesh>)}
      <pointLight position={[0.45, 0.3, 0.4]} intensity={2.4 * eio(tt, aV, aV + 0.15) * (1 - eio(tt, aV + 0.3, aV + 1.3))} distance={1.8} color="#ff9a4a" />
    </>;
  }}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { OchoCascos, AsientoApodo, PesoHoplita, FalangeEscudos, Othismos, CascoVision, ArcillaEscucha, ConElSobreEl, TensionArco, HuesosAsimetricos, CercaEstacas, AsedioCorte };
