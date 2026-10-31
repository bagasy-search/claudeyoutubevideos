// dur29b · tercera vuelta del bloque A (cascos, asiento, peso, falange, empujón, casco corintio) y de los tres flojos del bloque B
// (arcilla, estacas, asedio): versiones más simples, con siluetas que se reconocen sin leer.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex, tubeG } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, Horse, Plate, fallY, latheG, pop, rockT } from "./kb";
import { Escudo } from "./v3e";
import { Stickman } from "../stickman3d";

type UP = { d: number; p: any };
const PI = Math.PI;
const EARTH = [128, 96, 66];
const DARK = <meshBasicMaterial color="#070504" />;

// ---- ocho cascos de ocho guerras, con la silueta que cualquiera reconoce (unidad: ~0,25 de alto) ----
export const Casco8: React.FC<{ i: number; heat?: number }> = ({ i, heat = 0 }) => {
  const bron = <meshStandardMaterial color={new THREE.Color("#b08a40").lerp(new THREE.Color("#c0381c"), 0.75 * heat)} metalness={1} roughness={0.3} emissive="#ff3a10" emissiveIntensity={0.35 * heat} />;
  const st = M.steel({ col: "#8a8f94" });
  if (i === 0) return <group>{/* corintio: cúpula, carrilleras, ranuras en T y cresta de crin */}
    <mesh position={[0, 0.14, 0]} scale={[1, 1.15, 1.18]}><sphereGeometry args={[0.09, 36, 20, 0, 2 * PI, 0, PI * 0.55]} />{bron}</mesh>
    <mesh position={[0, 0.08, 0]} scale={[1, 1, 1.18]}><cylinderGeometry args={[0.09, 0.098, 0.12, 36, 1, true]} />{bron}</mesh>
    <mesh position={[0, 0.02, -0.07]} rotation={[0.5, 0, 0]} scale={[1, 0.5, 1]}><cylinderGeometry args={[0.09, 0.105, 0.04, 30, 1, true, PI * 0.6, PI * 0.8]} />{bron}</mesh>
    {[-1, 1].map((s) => <mesh key={s} position={[s * 0.035, 0.125, 0.104]} rotation={[0, s * 0.35, 0]}><boxGeometry args={[0.05, 0.016, 0.01]} />{DARK}</mesh>)}
    <mesh position={[0, 0.06, 0.107]}><boxGeometry args={[0.022, 0.09, 0.01]} />{DARK}</mesh>
    <mesh position={[0, 0.1, 0.108]}><boxGeometry args={[0.014, 0.05, 0.012]} />{bron}</mesh>
    <RBox s={[0.022, 0.03, 0.16]} r={0.006} p={[0, 0.25, -0.005]}>{M.brass({ col: "#8a6a30" })}</RBox>
    <RBox s={[0.03, 0.07, 0.24]} r={0.02} p={[0, 0.3, -0.02]}><meshStandardMaterial color="#9a2a1c" roughness={0.95} /></RBox></group>;
  if (i === 1) return <group>{/* romano: cúpula, cubrenuca ancho, carrilleras y cresta transversal */}
    <mesh position={[0, 0.1, 0]} scale={[1, 1.05, 1.1]}><sphereGeometry args={[0.09, 32, 18, 0, 2 * PI, 0, PI / 2]} />{st}</mesh>
    <mesh position={[0, 0.1, -0.02]} rotation={[-0.35, 0, 0]}><cylinderGeometry args={[0.1, 0.14, 0.04, 30, 1, true, PI * 0.65, PI * 0.7]} />{st}</mesh>
    {[-1, 1].map((s) => <RBox key={s} s={[0.012, 0.09, 0.07]} r={0.01} p={[s * 0.088, 0.06, 0.04]}>{M.brass({ col: "#b08a40" })}</RBox>)}
    <RBox s={[0.17, 0.016, 0.02]} r={0.006} p={[0, 0.115, 0.098]}>{M.brass({ col: "#b08a40" })}</RBox>
    <RBox s={[0.26, 0.06, 0.03]} r={0.02} p={[0, 0.215, 0]}><meshStandardMaterial color="#b82a1c" roughness={0.95} /></RBox></group>;
  if (i === 2) return <group>{/* vikingo: cono con bandas y nasal */}
    <mesh position={[0, 0.1, 0]} geometry={latheG("vik", [[0.092, 0], [0.094, 0.05], [0.08, 0.11], [0.04, 0.17], [0.0, 0.2]], 32)}>{st}</mesh>
    {[0, PI / 2].map((a, k) => <mesh key={k} position={[0, 0.2, 0]} rotation={[0, a, 0]}><torusGeometry args={[0.09, 0.006, 6, 30, PI]} />{M.brass({ col: "#9a7a3a" })}</mesh>)}
    <mesh position={[0, 0.1, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.093, 0.008, 6, 36]} />{M.brass({ col: "#9a7a3a" })}</mesh>
    <RBox s={[0.02, 0.08, 0.012]} r={0.004} p={[0, 0.06, 0.097]}>{st}</RBox></group>;
  if (i === 3) return <group>{/* yelmo medieval: cubo de techo plano, visor en cruz y agujeros */}
    <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.09, 0.1, 0.22, 28]} />{st}</mesh>
    <mesh position={[0, 0.222, 0]}><cylinderGeometry args={[0.088, 0.09, 0.008, 28]} />{st}</mesh>
    <mesh position={[0, 0.14, 0.098]}><boxGeometry args={[0.15, 0.014, 0.01]} />{DARK}</mesh>
    <RBox s={[0.022, 0.16, 0.01]} r={0.004} p={[0, 0.11, 0.1]}>{M.brass({ col: "#b08a40" })}</RBox>
    {Array.from({ length: 6 }, (_, k) => <mesh key={k} position={[0.03 + (k % 2) * 0.02, 0.06 + Math.floor(k / 2) * 0.02, 0.096]}><circleGeometry args={[0.005, 8]} />{DARK}</mesh>)}</group>;
  if (i === 4) return <group>{/* chacó napoleónico: tubo alto que se ensancha, placa, visera y pompón */}
    <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.1, 0.085, 0.24, 28]} /><meshStandardMaterial color="#141418" roughness={0.6} /></mesh>
    <mesh position={[0, 0.242, 0]}><cylinderGeometry args={[0.101, 0.101, 0.01, 28]} />{M.brass()}</mesh>
    <mesh position={[0, 0.14, 0.094]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.06, 0.06, 0.008]} />{M.brass()}</mesh>
    <mesh position={[0, 0.01, 0.08]} rotation={[0.35, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.006, 24, 1, false, -PI / 2, PI]} /><meshStandardMaterial color="#0c0c0e" roughness={0.2} /></mesh>
    <mesh position={[0, 0.29, 0.03]}><sphereGeometry args={[0.03, 16, 12]} /><meshStandardMaterial color="#c8302a" roughness={0.95} /></mesh></group>;
  if (i === 5) return <group>{/* Brodie de la Primera Guerra: plato hondo con ala ancha */}
    <mesh position={[0, 0.03, 0]} scale={[1, 0.85, 1]}><sphereGeometry args={[0.085, 30, 16, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial color="#6a6a48" metalness={0.4} roughness={0.6} /></mesh>
    <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.15, 0.155, 0.008, 40]} /><meshStandardMaterial color="#6a6a48" metalness={0.4} roughness={0.6} /></mesh>
    <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.008, 8, 6]} /><meshStandardMaterial color="#4a4a34" /></mesh></group>;
  if (i === 6) return <group>{/* Stahlhelm: cúpula con faldón que se abre abajo */}
    <mesh position={[0, 0.0, 0]} geometry={latheG("stahl", [[0.125, 0.0], [0.11, 0.03], [0.1, 0.06], [0.1, 0.11], [0.08, 0.17], [0.0, 0.2]], 36)}><meshStandardMaterial color="#4e5650" metalness={0.45} roughness={0.55} side={THREE.DoubleSide} /></mesh>
    {[-1, 1].map((s) => <mesh key={s} position={[s * 0.1, 0.1, 0]}><sphereGeometry args={[0.009, 8, 6]} /><meshStandardMaterial color="#3a403a" /></mesh>)}</group>;
  return <group>{/* M1 con red y banda */}
    <mesh position={[0, 0.03, 0]} scale={[1, 1.05, 1.1]}><sphereGeometry args={[0.1, 32, 18, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial color="#4a5a34" roughness={0.85} /></mesh>
    <mesh position={[0, 0.06, 0]} rotation={[PI / 2, 0, 0]} scale={[1, 1.1, 1]}><torusGeometry args={[0.097, 0.012, 8, 36]} /><meshStandardMaterial color="#2a2a22" roughness={0.9} /></mesh>
    <mesh position={[0, 0.03, 0]} scale={[1, 1, 1.1]}><cylinderGeometry args={[0.11, 0.112, 0.008, 36]} /><meshStandardMaterial color="#4a5a34" roughness={0.85} /></mesh>
    {[-0.04, 0.03].map((x, k) => <RBox key={k} s={[0.012, 0.06, 0.004]} r={0.002} p={[x, 0.1, 0.1]} rot={[-0.5, 0, 0.3]}><meshStandardMaterial color="#d8d0b0" /></RBox>)}</group>;
};

// ---- OchoCascos · ocho pedestales en arco; cada uno sube con su casco y se le prende el foco ----
const OchoCascos: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, sp = Math.min(0.42, Math.max(0.2, (D * 0.55 - 0.3) / 8));
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-1.0, 2.6, 2.0]} backDim={0.15}
    cam={{ at: [0, 0.42, 0.0], az: [-0.04, 0.04], el: [0.3, 0.26], r: [2.6, 2.45], fov: 36 }}>{(tt) => <>
    {Array.from({ length: 8 }, (_, i) => { const a = (i - 3.5) * 0.17, R = 1.6, x = Math.sin(a) * R, z = -Math.cos(a) * R + 1.4, t0 = 0.3 + i * sp, up = eio(tt, t0 - 0.3, t0 + 0.1), lit = eio(tt, t0 + 0.15, t0 + 0.5);
      return <group key={i} position={[x, 0, z]} rotation={[0, -a, 0]}>
        <mesh position={[0, 0.1 * up, 0]} scale={[1, Math.max(0.001, up), 1]}><cylinderGeometry args={[0.13, 0.15, 0.2, 28]} /><meshStandardMaterial map={dirtT([150, 140, 126])} roughness={0.9} /></mesh>
        <group position={[0, 0.2 * up + 0.004 + fallY(tt, t0, 0.7), 0]} visible={tt > t0 - 0.25}><group scale={2.05}><Casco8 i={i} /></group></group>
        <spotLight position={[0, 1.8, 0.7]} angle={0.16} penumbra={0.6} intensity={9 * lit} distance={2.6} color="#ffe0b0" />
      </group>; })}
  </>}</U3>;
};

// ---- AsientoApodo · el asiento blindado bajo un foco cenital; a los 0,4 s cae la tabla tallada «¿APODO?» y queda colgada de dos
// cadenas del respaldo, balanceándose ----
const AsientoApodo: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aT = Math.min(Math.max(1.2, sec(p, "apodo", 2.5)), D - 1.6);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[0.4, 3.0, 0.6]} backDim={0.08}
    cam={{ at: [0, 0.66, 0], az: [-0.75, 0.3], el: [0.2, 0.1], r: [1.9, 1.6], fov: 34 }}>{(tt) => {
    const sw = 0.1 * Math.sin((tt - aT) * 2 * PI * 0.55) * Math.exp(-0.7 * Math.max(0, tt - aT - 0.5)), red = eio(tt, aT + 0.3, aT + 0.9);
    return <>
      {/* el artillero, encogido en el asiento */}
      <group position={[0, 0.5, 0.02]}><Stickman escala={0.13} rotY={0} guion={[{ t: 0, accion: "sentarse", expr: "nervioso" }, { t: aT + 0.2, accion: "asustarse", expr: "asustado" }] as any} semilla={7} contacto={0} /></group>
      <pointLight position={[0, 1.1, 0.5]} intensity={2.2 * red} distance={2} color="#ff3a20" />
      <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.38, 40]} /><meshBasicMaterial color="#000" transparent opacity={0.45} depthWrite={false} /></mesh>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.08, 0.13, 0.1, 24]} />{M.steel({ col: "#5a5e62" })}</mesh>
      <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.03, 0.03, 0.38, 12]} />{M.steel({ col: "#7a7e82" })}</mesh>
      {/* el asiento de cubo con almohadón de cuero */}
      <mesh position={[0, 0.5, 0]} rotation={[0, PI, 0]}><cylinderGeometry args={[0.2, 0.18, 0.08, 32, 1, true, -PI * 0.55, PI * 1.1]} /><meshStandardMaterial color="#4a5048" metalness={0.6} roughness={0.45} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.47, 0]}><cylinderGeometry args={[0.19, 0.18, 0.03, 32]} /><meshStandardMaterial color="#4a5048" metalness={0.6} roughness={0.45} /></mesh>
      <mesh position={[0, 0.5, 0.01]} scale={[1, 0.25, 0.9]}><sphereGeometry args={[0.17, 24, 12]} /><meshStandardMaterial color="#5a3a22" roughness={0.75} /></mesh>
      <mesh position={[0, 0.72, -0.15]} rotation={[-0.12, PI, 0]}><cylinderGeometry args={[0.21, 0.2, 0.4, 32, 1, true, -PI * 0.4, PI * 0.8]} /><meshStandardMaterial color="#4a5048" metalness={0.6} roughness={0.45} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 7 }, (_, i) => { const a = -0.9 + i * 0.3; return <mesh key={i} position={[Math.sin(a) * 0.2, 0.9, -0.15 - Math.cos(a) * 0.2 + 0.2]}><sphereGeometry args={[0.009, 8, 6]} />{M.steel()}</mesh>; })}
      {/* las ametralladoras, a los costados y atrás */}
      {[-0.34, 0.34].map((x, i) => <group key={i} position={[x, 0.62, -0.05]} rotation={[0, i ? -0.15 : 0.15, 0]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.5, 14]} /><meshStandardMaterial color="#26282a" metalness={0.7} roughness={0.4} /></mesh>
        <RBox s={[0.07, 0.09, 0.18]} r={0.01} p={[0, 0, -0.26]}><meshStandardMaterial color="#22242a" metalness={0.6} roughness={0.5} /></RBox></group>)}
      <Plate k="siete3" txt="7" w={0.12} h={0.12} p={[0, 0.06, 0.135]} mat="brass" font={96} />
      {/* la tabla tallada, colgada de dos cadenas */}
      <group position={[0, 1.0 + fallY(tt, aT, 0.8), -0.06]} rotation={[-0.08, 0, sw]} visible={tt > aT - 0.25}>
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.2, 0.1, 0]}><cylinderGeometry args={[0.004, 0.004, 0.2, 6]} />{M.steel({ col: "#9a9ea2" })}</mesh>)}
        <Plate k="apodo3" txt="¿APODO?" w={0.6} h={0.2} p={[0, -0.02, 0.012]} mat="wood" font={92} />
      </group>
      <spotLight position={[0, 2.6, 0.4]} angle={0.28} penumbra={0.5} intensity={26} distance={4} color="#e6ecf4" />
    </>;
  }}</U3>;
};

// ---- PesoHoplita · una báscula de plataforma con su reloj; las piezas caen de a una, separadas, y la aguja y el contador suben
// con cada una ----
const PesoHoplita: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aK = Math.min(sec(p, "pesa", 0.6), D - 3.4), st = Math.max(0.45, Math.min(0.75, (D - aK - 1.4) / 5));
  const ts = [0, 1, 2, 3, 4].map((i) => aK + 0.2 + i * st), W = [3, 8, 7, 2, 4];
  const kg = (tt: number) => W.reduce((s, w, i) => s + w * cl((tt - ts[i] - 0.25) / 0.25), 0) + 3 * eio(tt, ts[4] + 0.5, ts[4] + 1.2);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="drop" key1={[-1.2, 2.4, 1.8]}
    cam={{ at: [0, 0.5, 0], az: [-0.14, 0.04], el: [0.16, 0.12], r: [2.05, 1.85], fov: 34 }}
    over={(tt) => <Drums v={Math.round(kg(tt))} n={2} x={1330} y={260} s={1.3} unit="kg" />}>{(tt) => {
    const k = cl(kg(tt) / 30), sink = 0.025 * k;
    return <>
      {/* la báscula */}
      <RBox s={[1.5, 0.08, 0.6]} r={0.02} p={[0, 0.05, 0]}><meshStandardMaterial color="#2e3236" metalness={0.6} roughness={0.5} /></RBox>
      <RBox s={[1.46, 0.03, 0.56]} r={0.01} p={[0, 0.105 - sink, 0]}><meshStandardMaterial map={tex.wood(4, 1, [120, 84, 50])} roughness={0.8} /></RBox>
      <mesh position={[0.6, 0.45, -0.32]}><cylinderGeometry args={[0.025, 0.03, 0.7, 12]} />{M.steel({ col: "#4a4e52" })}</mesh>
      <group position={[0.6, 0.86, -0.3]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.04, 48]} />{M.brass()}</mesh>
        <mesh position={[0, 0, 0.021]}><circleGeometry args={[0.18, 48]} /><meshStandardMaterial color="#f0e8d6" roughness={0.8} /></mesh>
        {Array.from({ length: 13 }, (_, i) => { const a = PI * 0.75 - i * PI * 1.5 / 12; return <mesh key={i} position={[Math.cos(a) * 0.15, Math.sin(a) * 0.15, 0.023]} rotation={[0, 0, a]}><planeGeometry args={[i % 3 ? 0.02 : 0.04, 0.005]} /><meshBasicMaterial color="#2a1a10" /></mesh>; })}
        <group position={[0, 0, 0.028]} rotation={[0, 0, PI * 0.75 - PI * 1.5 * k - PI / 2]}><RBox s={[0.008, 0.15, 0.004]} r={0.002} p={[0, 0.07, 0]}><meshStandardMaterial color="#b8281e" /></RBox></group>
      </group>
      <group position={[0, 0.12 - sink, 0]}>
        {/* casco */}
        <group position={[-0.52, fallY(tt, ts[0], 1.0), 0.02]} visible={tt > ts[0] - 0.3}><group scale={1.5}><Casco8 i={0} /></group></group>
        {/* coraza */}
        <group position={[-0.22, fallY(tt, ts[1], 1.0), 0.0]} visible={tt > ts[1] - 0.3}>
          <mesh geometry={latheG("coraza3", [[0.0, 0], [0.11, 0.0], [0.13, 0.08], [0.12, 0.2], [0.08, 0.25], [0, 0.25]], 36)} scale={[1, 1, 0.65]}>{M.brass({ col: "#b89040" })}</mesh>
          {[-1, 1].map((s) => <mesh key={s} position={[s * 0.05, 0.17, 0.075]} scale={[1, 0.7, 0.4]}><sphereGeometry args={[0.05, 16, 10]} />{M.brass({ col: "#c8a050" })}</mesh>)}</group>
        {/* escudo de pie */}
        <group position={[0.12, 0.26 + fallY(tt, ts[2], 1.0), -0.12]} rotation={[-0.15, 0, 0]} visible={tt > ts[2] - 0.3}><Escudo r={0.26} /></group>
        {/* grebas */}
        {[-1, 1].map((s) => <group key={s} position={[0.42 + s * 0.06, 0.1 + fallY(tt, ts[3], 1.0), 0.04]} visible={tt > ts[3] - 0.3}>
          <mesh geometry={latheG("greba", [[0.032, -0.1], [0.04, -0.05], [0.044, 0.03], [0.036, 0.1]], 24)}>{M.brass({ col: "#b08a3a" })}</mesh></group>)}
        {/* la lanza, gruesa, acostada adelante */}
        <group position={[0.0, 0.03 + fallY(tt, ts[4], 1.0), 0.22]} rotation={[0, 0, PI / 2]} visible={tt > ts[4] - 0.3}>
          <mesh><cylinderGeometry args={[0.02, 0.022, 1.3, 12]} /><meshStandardMaterial map={tex.wood(1, 4, [130, 90, 52])} roughness={0.7} /></mesh>
          <mesh position={[0, 0.71, 0]}><coneGeometry args={[0.04, 0.15, 4]} />{M.steel({ col: "#c8ccd0" })}</mesh>
          <mesh position={[0, -0.68, 0]}><coneGeometry args={[0.024, 0.07, 8]} />{M.brass()}</mesh></group>
      </group>
      <spotLight position={[0, 2.4, 0.9]} angle={0.4} penumbra={0.6} intensity={14} distance={4} color="#ffe6c0" />
    </>;
  }}</U3>;
};

// ---- FalangeEscudos · el rojo está en la fila desde el primer cuadro; a los 0,5 s se le cae el escudo y por el hueco entra la
// lanza enemiga ----
const FalangeEscudos: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aF = 0.5, aS = Math.min(aF + 0.9, D - 1.4);
  return <U3 d={d} bg={p.bg} ground={[176, 150, 110]} mode="wipe" key1={[-1.6, 2.6, 2.0]}
    cam={{ at: [0, 0.34, 0], at1: [0, 0.3, 0.1], az: [-0.55, -0.22], el: [0.14, 0.08], r: [1.75, 1.25], fov: 34 }}>{(tt) => {
    const fall = eio(tt, aF, aF + 0.5), sp = eio(tt, aS, aS + 0.7);
    return <>
      <spotLight position={[0, 1.6, 0.6]} angle={0.14} penumbra={0.5} intensity={12} distance={3} color="#ffd8b0" />
      {Array.from({ length: 7 }, (_, i) => { const x = -0.9 + i * 0.3, mid = i === 3;
        return <group key={i} position={[x, 0, 0]}>
          <Stickman escala={0.12} rotY={0} guion={[{ t: 0, accion: "idle", expr: "decidido" }, ...(mid ? [{ t: aF + 0.3, accion: "asustarse", expr: "asustado" }] : [])] as any} semilla={20 + i} contacto={0.4} colorContacto="#2a1a10" color={mid ? "#c8442a" : undefined} />
          <group position={mid ? [-0.08, lerp(0.2, 0.03, fall), lerp(0.09, 0.32, fall)] : [-0.08, 0.2, 0.09]} rotation={[mid ? -PI / 2 * fall : 0, 0.05, 0]}><Escudo r={0.17} /></group>
          <mesh position={[0.05, 0.42, 0.06]}><cylinderGeometry args={[0.009, 0.009, 0.7, 6]} /><meshStandardMaterial map={tex.wood(1, 4, [120, 84, 50])} /></mesh>
          <mesh position={[0.05, 0.79, 0.06]}><coneGeometry args={[0.016, 0.05, 8]} />{M.steel()}</mesh>
        </group>; })}
      <pointLight position={[0, 0.3, 0.45]} intensity={1.2 * fall} distance={1.0} color="#ff6a4a" />
      {/* la lanza enemiga, gruesa, entra por el hueco */}
      <group position={[0.0, 0.27, 1.6 - 1.32 * sp]} rotation={[PI / 2, 0, 0]} visible={sp > 0.01}>
        <mesh><cylinderGeometry args={[0.016, 0.016, 1.3, 8]} /><meshStandardMaterial map={tex.wood(1, 4, [100, 70, 40])} /></mesh>
        <mesh position={[0, -0.7, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.035, 0.13, 4]} />{M.steel({ col: "#d0d4d8" })}</mesh>
      </group>
    </>;
  }}</U3>;
};

// ---- Othismos · de costado y bajo: dos filas que se empujan; tú, rojo, en el medio, te aplastas entre los dos bandos; polvo en
// los pies ----
const Othismos: React.FC<UP> = ({ d, p }) => {
  const aS = sec(p, "sandwich", sec(p, "medio", 2.0));
  return <U3 d={d} bg={p.bg} ground={[170, 146, 108]} mode="wipe" key1={[-1.2, 2.8, 1.8]}
    cam={{ at: [0, 0.16, 0], az: [0.0, 0.0], el: [0.16, 0.1], r: [1.6, 1.15], fov: 34 }}>{(tt) => {
    const sq = eio(tt, aS - 0.3, aS + 0.5), push = 0.015 * Math.sin(tt * 2 * PI * 0.9);
    const L = [-0.12, -0.34, -0.56, -0.78, -1.0], Rr = [0.12, 0.34, 0.56, 0.78, 1.0];
    return <>
      {L.map((x0, i) => { const you = i === 0, x = x0 + push + (i > 0 ? 0.035 * sq * (1 - i * 0.1) : 0);
        return <group key={"l" + i} position={[x, 0, 0]} scale={you ? [1 - 0.28 * sq, 1 + 0.05 * sq, 1] : 1}>
          <Stickman escala={0.12} rotY={90} guion={[{ t: 0, accion: "empujar", expr: you ? "asustado" : "enojado" }]} semilla={50 + i} contacto={you ? 0.9 : 0.3}
            colorContacto={you ? "#d8a03a" : "#2a1a10"} color={you ? "#c8442a" : undefined} /></group>; })}
      {Rr.map((x0, i) => <group key={"r" + i} position={[x0 - push - (i > 0 ? 0.03 * sq : 0.02 * sq), 0, 0]}>
        <Stickman escala={0.12} rotY={-90} guion={[{ t: 0, accion: "empujar", expr: "enojado" }]} semilla={70 + i} contacto={0.3} colorContacto="#2a1a10" color="#6a625a" /></group>)}
      {Array.from({ length: 12 }, (_, i) => { const ph = (tt * 0.7 + rn(i, 1)) % 1; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.9, 0.02 + ph * 0.1, 0.05 + (rn(i, 3) - 0.5) * 0.2]} scale={0.5 + ph}>
        <sphereGeometry args={[0.035, 10, 8]} /><meshStandardMaterial color="#b8a080" roughness={1} transparent opacity={0.45 * (1 - ph)} depthWrite={false} /></mesh>; })}
      <spotLight position={[-0.12, 1.6, 0.4]} angle={0.16} penumbra={0.6} intensity={6 + 10 * sq} distance={3} color="#ffd8a0" />
    </>;
  }}</U3>;
};

// ---- CascoVision · el corintio de verdad, grande; se pone rojo cereza sin perder la forma, el aire tiembla encima, el termómetro
// sube hasta el borde y las voces de afuera se apagan contra el bronce ----
const CascoVision: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aO = Math.min(sec(p, "olla", 2.0), D - 1.2);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[0.6, 3.0, 1.2]}
    cam={{ at: [0.2, 0.56, 0], az: [-0.42, -0.24], el: [0.14, 0.1], r: [2.35, 2.1], fov: 34 }}>{(tt) => {
    const h = eio(tt, 0.3, aO + 0.6);
    return <>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.22, 0.26, 0.06, 32]} /><meshStandardMaterial map={dirtT([170, 160, 146])} roughness={0.95} /></mesh>
      <group position={[0, 0.06, 0]} scale={2.4}><Casco8 i={0} heat={h} /></group>
      {/* el aire caliente que tiembla */}
      {Array.from({ length: 5 }, (_, i) => { const ph = (tt * 0.5 + i / 5) % 1; return <mesh key={i} position={[0, 0.85 + ph * 0.35, 0.05]} rotation={[0, 0, 0.1 * Math.sin(tt * 5 + i)]} scale={[1 + 0.2 * Math.sin(tt * 4 + i), 1, 1]}>
        <planeGeometry args={[0.32, 0.05]} /><meshBasicMaterial color="#ffd0a0" transparent opacity={0.12 * (1 - ph) * h} depthWrite={false} /></mesh>; })}
      {/* el termómetro grande */}
      <group position={[0.48, 0.06, 0.08]}>
        <mesh position={[0, 0.33, 0]}><cylinderGeometry args={[0.03, 0.03, 0.62, 20]} />{M.glass({ op: 0.12 })}</mesh>
        <mesh position={[0, 0.02, 0]}><sphereGeometry args={[0.055, 20, 16]} /><meshStandardMaterial color="#c0281e" roughness={0.3} emissive="#ff2010" emissiveIntensity={0.4 * h} /></mesh>
        <mesh position={[0, 0.04 + 0.29 * (0.1 + 0.9 * h), 0]}><cylinderGeometry args={[0.021, 0.021, Math.max(0.01, 0.58 * (0.1 + 0.9 * h)), 12]} /><meshStandardMaterial color="#c0281e" emissive="#ff2010" emissiveIntensity={0.5 + 0.8 * h} toneMapped={false} /></mesh>
        {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0.033, 0.1 + i * 0.07, 0]}><boxGeometry args={[0.02, 0.004, 0.004]} /><meshBasicMaterial color="#e8e0d0" /></mesh>)}
      </group>
      {/* las voces de afuera: anillos que llegan al casco y se apagan */}
      {[0, 1, 2].map((i) => { const ph = (tt * 0.45 + i / 3) % 1, x = -1.0 + ph * 0.85; return <mesh key={"o" + i} position={[x, 0.45, 0.05]} rotation={[0, PI / 2, 0]}>
        <ringGeometry args={[0.2 * (1 - ph * 0.5), 0.2 * (1 - ph * 0.5) + 0.01, 40]} /><meshBasicMaterial color="#c89a6a" transparent opacity={0.35 * (1 - ph) * (1 - ph)} depthWrite={false} side={THREE.DoubleSide} /></mesh>; })}
      <directionalLight position={[-1.2, 2.2, -0.5]} intensity={1.2 + 0.8 * h} color="#ffe2a8" />
      <pointLight position={[0, 0.4, 0.4]} intensity={0.9 * h} distance={0.9} color="#ff6a2a" />
    </>;
  }}</U3>;
};

// ---- ArcillaEscucha · cámara pegada al tabique: tú, con la oreja contra la arcilla, y el cuenco de agua grande adelante; del otro
// lado el enemigo golpea y cada golpe hace anillos en el agua ----
const ArcillaEscucha: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aO = sec(p, "otro", 1.2), aE = Math.min(sec(p, "escuchando", 3), D - 1);
  return <U3 d={d} bg={p.bg} ground={null} mode="iris" key1={[-1.0, 2.2, 2.4]} backZ={-1.2}
    cam={{ at: [0.0, 0.3, 0], at1: [0.05, 0.3, 0.05], az: [-0.45, -0.1], el: [0.2, 0.08], r: [1.6, 0.95], fov: 36 }}>{(tt) => {
    const hit = (tt * 1.1) % 1, knock = Math.exp(-hit * 6);
    return <>
      <mesh position={[0, 0.4, -0.32]}><boxGeometry args={[3.0, 1.4, 0.5]} /><meshStandardMaterial map={rockT("arcilla3", EARTH, 3, 2)} roughness={0.95} /></mesh>
      {[[0.1, [150, 116, 78]], [0.6, [110, 84, 58]], [0.8, [160, 128, 86]]].map(([y, c], i) =>
        <mesh key={i} position={[0, y as number, -0.065]}><boxGeometry args={[3.0, 0.05, 0.01]} /><meshStandardMaterial map={rockT("capa3" + i, c as number[], 3, 1)} roughness={1} /></mesh>)}
      {/* los dos túneles y el tabique entre ellos */}
      <mesh position={[-0.6, 0.34, -0.06]}><boxGeometry args={[1.12, 0.36, 0.02]} /><meshStandardMaterial color="#2a1e14" roughness={1} /></mesh>
      <mesh position={[0.68, 0.34, -0.06]}><boxGeometry args={[1.0, 0.36, 0.02]} /><meshStandardMaterial color="#1e1610" roughness={1} /></mesh>
      <RBox s={[0.14, 0.4, 0.2]} r={0.01} p={[0.05, 0.34, 0.0]}><meshStandardMaterial map={rockT("tabique", EARTH.map((v) => v * 1.1), 1, 1)} roughness={0.95} /></RBox>
      {/* tú, acostado, con la oreja en la pared */}
      <group position={[-0.32, 0.2, 0.02]}>
        <RBox s={[0.5, 0.025, 0.1]} r={0.004}>{M.wood({ base: [146, 104, 62] })}</RBox>
        <group position={[0.2, 0.035, 0]} rotation={[0, 0, PI / 2]}><Stickman escala={0.11} rotY={0} guion={[{ t: 0, accion: "quieto", expr: "nervioso" }, { t: aE, accion: "asustarse", expr: "asustado" }] as any} semilla={2} contacto={0} /></group>
      </group>
      {/* el enemigo con la pala, del otro lado */}
      <group position={[0.36, 0.17, 0.0]}><Stickman escala={0.11} rotY={-90} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={9} contacto={0} color="#5a5048" /></group>
      <group position={[0.2 - 0.04 * knock, 0.34, 0.03]} rotation={[0, 0, PI / 2]}>
        <mesh position={[0, -0.09, 0]}><cylinderGeometry args={[0.01, 0.01, 0.18, 8]} /><meshStandardMaterial map={tex.wood(1, 2, [120, 84, 50])} /></mesh>
        <RBox s={[0.07, 0.06, 0.008]} r={0.003} p={[0, 0.02, 0]}>{M.steel({ col: "#b0b4b8" })}</RBox></group>
      {[0, 1].map((k) => { const ph = (hit + k / 2) % 1, r = 0.04 + ph * 0.25; return <mesh key={k} position={[0.05, 0.34, 0.105]}><ringGeometry args={[r, r + 0.008, 48]} /><meshBasicMaterial color="#ffb070" transparent opacity={(1 - ph) * 0.7 * (0.4 + 0.6 * cl(tt - aO))} depthWrite={false} toneMapped={false} /></mesh>; })}
      {/* el cuenco grande, adelante */}
      <group position={[-0.12, 0.0, 0.32]} scale={1.8}>
        <mesh geometry={latheG("cuenco4", [[0, 0], [0.06, 0.0], [0.075, 0.04], [0.08, 0.06], [0.074, 0.06], [0.07, 0.04], [0.055, 0.008], [0, 0.008]], 36)}><meshStandardMaterial color="#9a6038" roughness={0.6} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.048 + 0.003 * knock, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 36]} />{M.water({ col: "#4a7a8a" })}</mesh>
        {[0, 1, 2].map((k) => { const ph = (hit + k / 3) % 1; return <mesh key={k} position={[0, 0.051, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.006 + ph * 0.06, 0.009 + ph * 0.06, 36]} /><meshBasicMaterial color="#e8f6fc" transparent opacity={0.9 * (1 - ph)} depthWrite={false} /></mesh>; })}
      </group>
      <mesh position={[-0.55, 0.47, 0.02]}><sphereGeometry args={[0.018, 12, 10]} />{M.glow({ col: "#ffd27a" })}</mesh>
      <pointLight position={[-0.4, 0.45, 0.3]} intensity={1.1} distance={1.5} color="#ffc070" />
    </>;
  }}</U3>;
};

// ---- CercaEstacas · de frente, como un corte: tres filas de troncos gruesos a 45° apuntando al caballo; el caballo entra de lado,
// entero, clava las patas y levanta barro ----
const CercaEstacas: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aE = sec(p, "estaca", 0.5), aC = Math.min(sec(p, "caballos", 2.6), D - 1.6);
  return <U3 d={d} bg={p.bg} ground={[96, 80, 60]} mode="drop" key1={[-1.4, 2.4, 1.8]}
    cam={{ at: [0.3, 0.3, 0], az: [-0.28, 0.1], el: [0.12, 0.08], r: [1.95, 1.7], fov: 34 }}>{(tt) => {
    const run = eio(tt, Math.max(1.4, aC - 4.5), aC + 0.15), stop = eio(tt, aC + 0.05, aC + 0.4), rear = stop * (1 - eio(tt, aC + 1.4, aC + 2.0)), mud = cl((tt - aC) / 1.2);
    return <>
      {Array.from({ length: 18 }, (_, i) => { const row = Math.floor(i / 6), c = i % 6, a = aE + c * 0.08 + row * 0.18, h = cl((tt - a) / 0.25);
        return <group key={i} position={[-0.05 + row * 0.16, 0, -0.45 + c * 0.18 + (row % 2) * 0.09]} rotation={[0, 0, -PI / 4]} visible={tt > a}>
          <mesh position={[0, 0.3 * h, 0]}><cylinderGeometry args={[0.012, 0.055, Math.max(0.01, 0.6 * h), 12]} /><meshStandardMaterial map={tex.wood(1, 3, [150, 110, 64])} roughness={0.7} /></mesh>
          <mesh position={[0, 0.6 * h + 0.02, 0]}><coneGeometry args={[0.012, 0.05, 10]} /><meshStandardMaterial color="#d8c098" roughness={0.6} /></mesh></group>; })}
      {[-0.3, 0, 0.3].map((z, i) => <group key={i} position={[-0.55, 0, z]}><Stickman escala={0.13} rotY={90} guion={[{ t: 0, accion: "idle", expr: "decidido" }, { t: aC - 0.3, accion: "asustarse", expr: "asustado" }] as any} semilla={80 + i} contacto={0.3} colorContacto="#1a120c" /></group>)}
      <group position={[lerp(2.7, 0.82, run), 0, 0.05]} rotation={[0, PI, rear * 0.35]}><Horse tt={tt} col="#6a4a32" gallop={1 - stop * 0.9} s={1.3} /></group>
      {Array.from({ length: 18 }, (_, i) => { const ph = cl(mud * (0.7 + 0.6 * rn(i, 1))); return <mesh key={i} position={[0.78 + (rn(i, 2) - 0.2) * 0.45 * ph, 0.02 + ph * 0.25 * rn(i, 3) - ph * ph * 0.12, (rn(i, 4) - 0.5) * 0.4 * ph]} scale={Math.max(0.001, (0.5 + rn(i, 5)) * (1 - 0.5 * ph))}>
        <dodecahedronGeometry args={[0.028, 0]} /><meshStandardMaterial color="#4a3626" roughness={1} transparent opacity={1 - ph * 0.6} depthWrite={false} /></mesh>; })}
    </>;
  }}</U3>;
};

// ---- AsedioCorte · encuadre que muestra todo: el túnel ya empezado pasa por debajo de la muralla, el barril entero con la mecha
// chispeando, y la muralla que vuela en tandas con mucho polvo ----
const AsedioCorte: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aP = sec(p, "polvora", 2.0), aV = Math.min(Math.max(sec(p, "volarla", 3.0), aP + 1.0), D - 1.6);
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" key1={[-1.4, 2.6, 2.2]} backZ={-1.6}
    cam={{ at: [0.15, 0.28, 0], az: [-0.16, 0.04], el: [0.1, 0.1], r: [1.95, 1.85], fov: 36 }}>{(tt) => {
    const dig = eio(tt, 0.0, aV - 0.4), fuse = eio(tt, Math.min(0.3, aP), aV), dust = eio(tt, aV, aV + 1.8);
    const tx = lerp(-0.2, 0.45, dig);
    return <>
      <mesh position={[0, 0.0, -0.2]}><boxGeometry args={[3.6, 0.8, 0.4]} /><meshStandardMaterial map={rockT("asedio3", EARTH, 3, 1)} roughness={1} /></mesh>
      <mesh position={[0, 0.405, -0.2]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3.6, 0.4]} /><meshStandardMaterial color="#6a7a40" roughness={1} /></mesh>
      <mesh position={[(tx - 1.4) / 2, -0.04, 0.005]}><planeGeometry args={[Math.max(0.01, tx + 1.4), 0.24]} /><meshBasicMaterial color="#2a1c12" /></mesh>
      {Array.from({ length: 9 }, (_, i) => { const x = -1.3 + i * 0.2; return <group key={i} visible={x < tx}><RBox s={[0.025, 0.24, 0.02]} p={[x, -0.04, 0.02]}>{M.wood({ base: [130, 92, 54] })}</RBox><RBox s={[0.12, 0.02, 0.02]} p={[x, 0.08, 0.02]}>{M.wood({ base: [130, 92, 54] })}</RBox></group>; })}
      <group position={[tx - 0.06, -0.15, 0.03]} visible={tt < aV}><Stickman escala={0.07} rotY={90} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={5} contacto={0} /></group>
      <group position={[0.42, -0.02, 0.06]} scale={1.6 * pop(tt, 0.1)}>
        <mesh geometry={latheG("barril3", [[0, -0.09], [0.07, -0.09], [0.085, 0], [0.07, 0.09], [0, 0.09]], 28)}>{M.wood({ base: [120, 76, 40] })}</mesh>
        {[-0.06, 0.06].map((y, i) => <mesh key={i} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.08, 0.005, 6, 28]} />{M.steel({ col: "#4a4a4a" })}</mesh>)}
      </group>
      <mesh geometry={tubeG("mecha3", [[0.42, 0.11, 0.08], [0.2, 0.02, 0.08], [-0.2, -0.1, 0.08], [-0.7, -0.1, 0.08]], 0.006, 30, 6)}><meshStandardMaterial color="#5a4028" /></mesh>
      <group position={[lerp(-0.7, 0.42, fuse), lerp(-0.1, 0.11, fuse * fuse), 0.09]} visible={tt < aV}>
        <mesh><sphereGeometry args={[0.022, 12, 10]} />{M.glow({ col: "#ffe08a" })}</mesh>
        {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 2.2 + rn(i, 1)) % 1; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.12 * ph, 0.09 * ph, (rn(i, 3) - 0.5) * 0.06 * ph]}><sphereGeometry args={[0.007, 6, 6]} />{M.glow({ col: "#ffb040", op: 1 - ph })}</mesh>; })}
      </group>
      <pointLight position={[lerp(-0.7, 0.42, fuse), 0.05, 0.25]} intensity={1.0 * (1 - cl((tt - aV) * 3))} distance={0.9} color="#ffb060" />
      {Array.from({ length: 30 }, (_, i) => { const c = i % 10, r = Math.floor(i / 10), x = 0.0 + c * 0.1, y = 0.46 + r * 0.1, near = Math.abs(x - 0.45) < 0.3;
        const a = aV + 0.05 + r * 0.15 + rn(i, 7) * 0.12, k = near ? eio(tt, a, a + 0.9) : 0;
        return <group key={i} position={[x + k * (x - 0.45) * 0.9, y + k * (0.4 + 0.4 * rn(i, 2)) - k * k * 0.3, -0.2 + k * (rn(i, 4) - 0.3) * 0.5]} rotation={[k * (rn(i, 5) - 0.5) * 2, 0, k * (rn(i, 3) - 0.5) * 2]}>
          <RBox s={[0.095, 0.092, 0.16]} r={0.012}><meshStandardMaterial map={rockT("bloque" + (i % 3), [140 - 10 * (i % 3), 128 - 8 * (i % 3), 108], 1, 1)} roughness={0.95} /></RBox></group>; })}
      {[-0.1, 1.0].map((x, i) => <group key={"tw" + i} position={[x, 0.42, -0.2]}><mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.09, 0.1, 0.44, 16]} /><meshStandardMaterial map={rockT("torre", [134, 122, 104], 1, 2)} roughness={0.95} /></mesh><mesh position={[0, 0.5, 0]}><coneGeometry args={[0.11, 0.14, 16]} /><meshStandardMaterial color="#7a3a26" roughness={0.8} /></mesh></group>)}
      {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[0.45 + (rn(i, 1) - 0.5) * 0.6 * (0.5 + dust), 0.42 + dust * (0.1 + 0.8 * rn(i, 2)), -0.15 + (rn(i, 3) - 0.5) * 0.4]} scale={Math.max(0.001, dust * (0.7 + rn(i, 4)))}>
        <sphereGeometry args={[0.1, 12, 10]} /><meshStandardMaterial color="#8a8070" roughness={1} transparent opacity={0.55 * (1 - 0.6 * eio(tt, aV + 1.0, aV + 2.2))} depthWrite={false} /></mesh>)}
      <pointLight position={[0.45, 0.3, 0.4]} intensity={0.8 + 3.0 * eio(tt, aV, aV + 0.15) * (1 - eio(tt, aV + 0.3, aV + 1.3))} distance={2.4} color="#ff9a4a" />
    </>;
  }}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { OchoCascos, AsientoApodo, PesoHoplita, FalangeEscudos, Othismos, CascoVision, ArcillaEscucha, CercaEstacas, AsedioCorte };
