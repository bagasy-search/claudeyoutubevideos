// dur29b · segunda versión del bloque C/D (bala, mito, gérmenes, torreta, traje, paracaídas, pateador, Messines, laguna, la regla
// del tiempo, las ocho puertas y «todo lo demás»): objetos grandes, un solo mecanismo, sin carteles para leer.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex, tubeG } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, EnSitio, Plate, fallY, latheG, pop, rockT } from "./kb";
import { Casco } from "./v3a";
import { Stickman } from "../stickman3d";

type UP = { d: number; p: any };
const PI = Math.PI;
const CLAY = [112, 118, 124];
const fem = (k: string) => latheG(k, [[0.0, -0.36], [0.055, -0.35], [0.065, -0.3], [0.035, -0.22], [0.03, 0], [0.034, 0.22], [0.055, 0.3], [0.06, 0.34], [0.0, 0.37]], 32);

// ---- BalaPlomo · el fémur sobre su soporte; la bala de plomo llega en cámara lenta, se aplasta como un hongo y el hueso se abre en
// esquirlas blancas ----
const BalaPlomo: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aI = Math.min(sec(p, "pegar", 1.6), D - 1.6);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[-1.0, 2.2, 1.8]}
    cam={{ at: [-0.05, 0.28, 0], az: [-0.5, -0.3], el: [0.26, 0.2], r: [1.2, 1.0], fov: 32 }}>{(tt) => {
    const fly = cl((tt - 0.2) / Math.max(0.2, aI - 0.2)), hit = eio(tt, aI, aI + 0.3), sh = eio(tt, aI, aI + 1.6), gap = 0.06 * sh;
    const bx = lerp(-1.1, -0.05, fly) + 0.03 * hit;
    return <>
      {/* el soporte y el fémur, partido en dos mitades que se separan */}
      {[-1, 1].map((s) => <group key={s} position={[0, 0, s * 0.22]}><mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.02, 0.03, 0.28, 12]} />{M.wood({ base: [90, 60, 34] })}</mesh><RBox s={[0.1, 0.02, 0.06]} r={0.005} p={[0, 0.28, 0]}>{M.wood({ base: [90, 60, 34] })}</RBox></group>)}
      {[-1, 1].map((s) => <group key={"h" + s} position={[0.02 * sh, 0.32 - 0.04 * sh * (s > 0 ? 1 : 0.5), s * gap]} rotation={[PI / 2, s * 0.15 * sh, 0]}>
        <mesh geometry={fem("fem")} scale={[1.1, 1, 1.1]}><meshStandardMaterial color="#e8dec6" roughness={0.75} /></mesh></group>)}
      <group position={[bx, 0.32, 0]} rotation={[0, 0, -PI / 2]} scale={[1.4 * (1 + 1.4 * hit), 1.4 * (1 - 0.55 * hit), 1.4 * (1 + 1.4 * hit)]}>
        <mesh geometry={latheG("minie", [[0.0, 0.07], [0.012, 0.06], [0.022, 0.035], [0.025, 0.0], [0.025, -0.03], [0.02, -0.035], [0.0, -0.035]], 28)}><meshStandardMaterial color="#7a7e84" metalness={0.6} roughness={0.55} /></mesh>
      </group>
      <mesh position={[(bx - 1.1) / 2, 0.32, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, Math.max(0.01, bx + 1.1), 6]} /><meshBasicMaterial color="#e8e0d0" transparent opacity={0.25 * (1 - hit)} depthWrite={false} /></mesh>
      {Array.from({ length: 22 }, (_, i) => { const a = (rn(i, 1) - 0.5) * 2.2, sp = 0.25 + rn(i, 2) * 0.45, x = 0.03 + Math.cos(a) * sp * sh, y = 0.32 + Math.sin(a) * sp * sh - 0.35 * sh * sh, z = (rn(i, 3) - 0.5) * 0.5 * sh;
        return <mesh key={i} position={[x, Math.max(0.02, y), z]} rotation={[rn(i, 4) * 6 * sh, rn(i, 5) * 6 * sh, 0]} visible={tt > aI}><tetrahedronGeometry args={[0.012 + 0.012 * rn(i, 6), 0]} /><meshStandardMaterial color="#f0e8d4" roughness={0.6} /></mesh>; })}
      <pointLight position={[0, 0.5, 0.3]} intensity={1.2 * eio(tt, aI, aI + 0.1) * (1 - eio(tt, aI + 0.2, aI + 0.9))} distance={1.2} color="#fff0d8" />
    </>;
  }}</U3>;
};

// ---- MitoVuelta · un panel de dos caras: la mano con el whisky y el palo mordido; gira 180° con inercia y aparece la máscara de éter
// con el trapo y el frasco de cloroformo ----
const MitoVuelta: React.FC<UP> = ({ d, p }) => {
  const aR = sec(p, "realidad", 2.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" key1={[-1.0, 2.4, 1.8]}
    cam={{ at: [0, 0.62, 0], az: [-0.22, 0.14], el: [0.08, 0.05], r: [1.6, 1.4], fov: 34 }}>{(tt) => {
    const k = cl((tt - aR + 0.3) / 0.9), rot = PI * (k <= 0 ? 0 : k >= 1 ? 1 : 1 + Math.exp(-k * 6) * Math.sin(k * 9) * -0.35 - (1 - k) * (1 - k) * 0.65 * 0 - (k < 0.4 ? (1 - eio(k, 0, 0.4)) : 0));
    return <>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.06, 0.14, 0.1, 20]} />{M.brass({ col: "#8a6a30" })}</mesh>
      <group position={[0, 0.52, 0]} rotation={[0, rot, 0]}>
        <RBox s={[0.9, 0.8, 0.06]} r={0.015}><meshStandardMaterial map={tex.wood(2, 2, [86, 54, 28])} roughness={0.7} /></RBox>
        <group position={[0, 0, 0.035]}>
          {/* la mano que ofrece la botella */}
          <group position={[-0.16, -0.05, 0.08]}>
            <mesh geometry={latheG("whisky2", [[0.0, -0.18], [0.07, -0.18], [0.075, 0.05], [0.03, 0.12], [0.026, 0.19], [0.0, 0.19]], 28)}><meshPhysicalMaterial color="#c88a3a" roughness={0.1} transparent opacity={0.8} clearcoat={1} /></mesh>
            <mesh position={[0.0, -0.03, 0.06]} scale={[1.3, 0.8, 0.7]}><sphereGeometry args={[0.07, 16, 12]} /><meshStandardMaterial color="#e0c0a0" roughness={0.7} /></mesh>
            <mesh position={[-0.13, -0.05, 0.05]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.045, 0.05, 0.16, 14]} /><meshStandardMaterial color="#6a3a22" roughness={0.9} /></mesh>
          </group>
          {/* el palo mordido */}
          <group position={[0.2, -0.08, 0.05]} rotation={[0, 0, 0.3]}>
            <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.022, 0.022, 0.26, 12]} />{M.wood({ base: [150, 110, 66] })}</mesh>
            {[-0.02, 0.0, 0.02].map((x, i) => <mesh key={i} position={[x, 0.02, 0.0]}><boxGeometry args={[0.008, 0.01, 0.05]} /><meshStandardMaterial color="#5a3a1a" /></mesh>)}
          </group>
          <Plate k="mito2" txt="MITO" w={0.36} h={0.12} p={[0, 0.3, 0.01]} mat="brass" font={90} />
        </group>
        <group position={[0, 0, -0.035]} rotation={[0, PI, 0]}>
          {/* la máscara de éter con el trapo */}
          <group position={[-0.15, -0.04, 0.08]}>
            <mesh rotation={[-PI / 2, 0, 0]} scale={[1, 1.25, 1]}><sphereGeometry args={[0.1, 24, 14, 0, 2 * PI, 0, PI / 2]} />{M.steel({ col: "#a8acb0" })}</mesh>
            <mesh position={[0, 0, 0.02]} scale={[1.1, 1.35, 0.4]}><sphereGeometry args={[0.1, 20, 12]} /><meshStandardMaterial color="#efe8da" roughness={1} /></mesh>
          </group>
          <mesh position={[0.18, -0.05, 0.07]} geometry={latheG("clorof2", [[0.0, -0.14], [0.065, -0.14], [0.07, 0.05], [0.03, 0.1], [0.03, 0.14], [0.0, 0.14]], 28)}><meshPhysicalMaterial color="#5a2e10" roughness={0.1} transparent opacity={0.85} clearcoat={1} /></mesh>
          <Plate k="real2" txt="CLOROFORMO" w={0.52} h={0.12} p={[0, 0.3, 0.01]} mat="brass" font={80} />
        </group>
      </group>
      <spotLight position={[0, 2.0, 1.2]} angle={0.3} penumbra={0.6} intensity={10} distance={4} color="#ffe8c8" />
    </>;
  }}</U3>;
};

// ---- ManosGermenes · el balde de agua turbia en primer plano; la sierra entra al balde, sale y entra en el paciente; los puntos
// verdes saltan de herida en herida y el agua se pone cada vez más verde ----
const ManosGermenes: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, per = Math.max(0.9, (D - 0.8) / 3);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" key1={[-1.2, 2.6, 1.8]}
    cam={{ at: [0.05, 0.25, 0], az: [-0.3, -0.12], el: [0.3, 0.24], r: [1.65, 1.45], fov: 34 }}>{(tt) => {
    const k = Math.max(0, tt - 0.4) / per, cur = Math.min(2, Math.floor(k)), fr = k - Math.floor(k);
    const BX = -0.55, cot = (i: number) => -0.05 + i * 0.42;
    // en cada período: balde (0-0.35) → paciente cur (0.5-1)
    const m = eio(fr, 0.3, 0.55), sx = k >= 3 ? cot(2) : lerp(BX, cot(cur), m), dip = fr < 0.3 ? Math.sin(fr / 0.3 * PI) : 0, cut = fr > 0.6 ? Math.sin((fr - 0.6) / 0.4 * PI) : 0;
    const sy = 0.42 - 0.2 * dip - 0.14 * cut + 0.08 * Math.sin(m * PI), green = cl(k / 3);
    const load = (n: number) => Math.min(40, Math.floor(8 * Math.pow(1.7, n)));
    return <>
      {/* el balde grande */}
      <group position={[BX, 0, 0.15]}>
        <mesh geometry={latheG("baldeG2", [[0.0, 0], [0.14, 0], [0.17, 0.26], [0.16, 0.26], [0.13, 0.01], [0.0, 0.01]], 32)}>{M.wood({ base: [120, 84, 50] })}</mesh>
        {[0.06, 0.2].map((y, i) => <mesh key={i} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.15 + y * 0.1, 0.006, 6, 32]} />{M.steel({ col: "#4a4a4a" })}</mesh>)}
        <mesh position={[0, 0.22, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.16, 32]} /><meshStandardMaterial color={new THREE.Color("#6a5a3a").lerp(new THREE.Color("#4a7a2a"), green)} roughness={0.2} /></mesh>
        {Array.from({ length: Math.floor(30 * green) }, (_, j) => <mesh key={j} position={[(rn(j, 1) - 0.5) * 0.24, 0.222, (rn(j, 2) - 0.5) * 0.24]}><sphereGeometry args={[0.008, 6, 6]} /><meshBasicMaterial color="#8af05a" toneMapped={false} /></mesh>)}
      </group>
      {Array.from({ length: 3 }, (_, i) => { const x = cot(i), inf = i <= cur ? eio(tt, 0.4 + (i + 0.75) * per, 0.4 + (i + 1) * per) : 0;
        return <group key={i} position={[x, 0, -0.1]}>
          {[-1, 1].map((s) => <mesh key={s} position={[0, 0.2, s * 0.17]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.01, 0.01, 0.36, 8]} />{M.wood({ base: [120, 84, 50] })}</mesh>)}
          <RBox s={[0.34, 0.01, 0.32]} r={0.003} p={[0, 0.205, 0]}><meshStandardMaterial color="#c8bc9a" roughness={1} /></RBox>
          {[[-0.15, -0.12], [0.15, -0.12], [-0.15, 0.12], [0.15, 0.12]].map(([lx, lz], j) => <mesh key={j} position={[lx, 0.1, lz]}><cylinderGeometry args={[0.008, 0.008, 0.2, 6]} />{M.wood({ base: [120, 84, 50] })}</mesh>)}
          <mesh position={[0, 0.24, 0]} rotation={[0, PI / 2, 0]} scale={[1, 0.45, 1]}><capsuleGeometry args={[0.06, 0.18, 6, 10]} /><meshStandardMaterial color="#8a7e6a" roughness={1} /></mesh>
          <mesh position={[0.03, 0.262, 0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.025, 16]} /><meshStandardMaterial color="#8a2a1c" roughness={0.6} /></mesh>
          {Array.from({ length: load(i) }, (_, j) => <mesh key={j} position={[(rn(j + i * 50, 1) - 0.5) * 0.26, 0.27, (rn(j + i * 50, 2) - 0.5) * 0.22]} scale={Math.max(0.001, inf)}><sphereGeometry args={[0.009, 8, 6]} /><meshBasicMaterial color="#8af05a" transparent opacity={0.9} toneMapped={false} /></mesh>)}
        </group>; })}
      {/* la sierra */}
      <group position={[sx, sy, -0.02]} rotation={[0, 0, -0.35]}>
        <RBox s={[0.3, 0.06, 0.005]} r={0.002}>{M.steel({ col: "#a8acb0" })}</RBox>
        <RBox s={[0.09, 0.07, 0.035]} r={0.012} p={[-0.19, 0.0, 0]}>{M.wood({ base: [90, 56, 30] })}</RBox>
        {/* la mano y el brazo del cirujano, con la manga sucia */}
        <mesh position={[-0.2, 0.02, 0.03]} scale={[1.2, 0.9, 1]}><sphereGeometry args={[0.04, 14, 10]} /><meshStandardMaterial color="#d8b090" roughness={0.7} /></mesh>
        <mesh position={[-0.33, 0.14, 0.03]} rotation={[0, 0, 0.75]}><capsuleGeometry args={[0.035, 0.26, 6, 12]} /><meshStandardMaterial color="#d8b090" roughness={0.7} /></mesh>
        <mesh position={[-0.5, 0.3, 0.03]} rotation={[0, 0, 0.75]}><capsuleGeometry args={[0.05, 0.2, 6, 12]} /><meshStandardMaterial color="#8a7a62" roughness={0.95} /></mesh>
        {Array.from({ length: load(Math.min(3, Math.floor(k + 0.5))) }, (_, j) => <mesh key={j} position={[(rn(j, 7) - 0.5) * 0.28, (rn(j, 8) - 0.5) * 0.06, 0.005]}><sphereGeometry args={[0.007, 6, 6]} /><meshBasicMaterial color="#8af05a" toneMapped={false} /></mesh>)}
      </group>
      <pointLight position={[0, 1.0, 0.6]} intensity={1.0} distance={2.4} color="#ffe0b0" />
    </>;
  }}</U3>;
};

// ---- el bombardero, en verde oliva para que se lea contra la noche ----
const Bomber: React.FC<{ tt: number }> = ({ tt }) => {
  const skin = <meshStandardMaterial color="#5e6650" metalness={0.45} roughness={0.5} />;
  return <group>
    <mesh rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.11, 1.5, 10, 24]} />{skin}</mesh>
    <RBox s={[0.42, 0.025, 2.6]} r={0.01} p={[0.15, 0.02, 0]}>{skin}</RBox>
    {[-0.9, -0.45, 0.45, 0.9].map((z, i) => <group key={i} position={[0.32, 0.0, z]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.05, 0.06, 0.26, 16]} />{skin}</mesh>
      <group position={[0.15, 0, 0]} rotation={[tt * 2 * PI * 0.35, 0, 0]}>{[0, 1, 2].map((b) => <RBox key={b} s={[0.008, 0.3, 0.03]} r={0.004} rot={[b * 2 * PI / 3, 0, 0]}><meshStandardMaterial color="#111" /></RBox>)}</group>
    </group>)}
    <RBox s={[0.25, 0.02, 0.8]} r={0.01} p={[-0.78, 0.04, 0]}>{skin}</RBox>
    <RBox s={[0.22, 0.3, 0.02]} r={0.01} p={[-0.8, 0.16, 0]}>{skin}</RBox>
    <mesh position={[-0.95, 0.0, 0]}><sphereGeometry args={[0.1, 24, 18]} />{M.glass({ op: 0.18, col: "#b8d0e0" })}</mesh>
    {[-1, 1].map((s) => <mesh key={s} position={[-1.14, 0.0, s * 0.035]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.011, 0.011, 0.32, 8]} /><meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.4} /></mesh>)}
    {/* la tripulación, lejos, en la nariz: cuatro siluetas tras las ventanillas iluminadas */}
    {[0.45, 0.55, 0.65, 0.75].map((x, i) => <mesh key={i} position={[x, 0.07, 0.105]}><planeGeometry args={[0.05, 0.035]} />{M.glow({ col: "#ffd890", op: 0.8 })}</mesh>)}
  </group>;
};

// ---- TorretaCola · de la nariz iluminada (los demás, lejos) la cámara viaja por el fuselaje hasta la burbuja de cola: el artillero
// solo, con las dos ametralladoras y un reflector barriendo el cielo ----
const TorretaCola: React.FC<UP> = ({ d, p }) => {
  return <U3 d={d} bg={p.bg} ground={null} sky="#0a0e18" mode="iris" key1={[0.8, 2.0, 1.2]}
    cam={{ at: [-0.2, 0.62, 0], at1: [-0.92, 0.6, 0], az: [0.55, -0.7], el: [0.22, 0.1], r: [1.5, 0.7], fov: 38 }}>{(tt) => <>
    <group position={[0, 0.6, 0]} rotation={[0, 0, 0.02 * Math.sin(tt * 0.8)]}>
      <Bomber tt={tt} />
      <group position={[-0.95, -0.08, 0]}><Stickman escala={0.075} rotY={-90} guion={[{ t: 0, accion: "quieto", expr: "nervioso" }]} semilla={44} contacto={0} /></group>
      <pointLight position={[-0.95, 0.03, 0.06]} intensity={0.5} distance={0.45} color="#7aa0ff" />
      <pointLight position={[0.6, 0.1, 0.3]} intensity={0.6} distance={0.8} color="#ffd890" />
    </group>
    {/* el reflector que barre */}
    <group position={[-2.5, 0, -2.5]} rotation={[0, 0, -0.5 + 0.35 * Math.sin(tt * 0.6)]}><mesh position={[0, 2.5, 0]}><cylinderGeometry args={[0.02, 0.35, 5, 16, 1, true]} /><meshBasicMaterial color="#c8d8f0" transparent opacity={0.08} depthWrite={false} side={THREE.DoubleSide} /></mesh></group>
    {Array.from({ length: 140 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 12, 1 + rn(i, 2) * 5, -3 - rn(i, 3) * 4]}><sphereGeometry args={[0.012, 6, 6]} /><meshBasicMaterial color="#e8eef8" /></mesh>)}
    <mesh position={[3, 3.5, -6]}><sphereGeometry args={[0.35, 24, 16]} />{M.glow({ col: "#e8eef8", op: 0.9 })}</mesh>
    <directionalLight position={[3, 3.5, 2]} intensity={1.0} color="#9ab0e0" />
  </>}</U3>;
};

// ---- TrajeCalefaccion · el traje lleno de cables naranjas; se apagan de a uno de los pies a la cabeza y la escarcha sube detrás;
// el termómetro de mercurio dentro de la burbuja baja ----
const WIRES = [
  [[-0.04, 0.24, 0.17], [-0.05, 0.22, 0.1], [-0.06, 0.25, 0.04]], [[0.04, 0.24, 0.17], [0.05, 0.22, 0.1], [0.06, 0.25, 0.04]],
  [[-0.05, 0.27, 0.04], [-0.05, 0.33, 0.03], [-0.04, 0.38, 0.03]], [[0.05, 0.27, 0.04], [0.05, 0.33, 0.03], [0.04, 0.38, 0.03]],
  [[-0.1, 0.46, 0.02], [-0.14, 0.4, 0.05], [-0.12, 0.33, 0.09]], [[0.1, 0.46, 0.02], [0.14, 0.4, 0.05], [0.12, 0.33, 0.09]],
  [[-0.06, 0.48, 0.05], [0, 0.46, 0.06], [0.06, 0.48, 0.05]], [[-0.04, 0.42, 0.06], [0, 0.4, 0.065], [0.04, 0.42, 0.06]]] as number[][][];
const TrajeCalefaccion: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aF = Math.min(sec(p, "funcionaba", 1.6), D - 2.2), sp = Math.max(0.12, (D - aF - 1.0) / WIRES.length);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" sky="#0a0e18" mode="iris" key1={[0.6, 2.0, 1.6]}
    cam={{ at: [0.05, 0.36, 0], az: [-0.3, -0.12], el: [0.12, 0.08], r: [1.25, 1.05], fov: 34 }}>{(tt) => {
    const heat = (j: number) => 1 - eio(tt, aF + j * sp, aF + j * sp + 0.25), frost = eio(tt, aF + 0.2, D - 0.2), cold = eio(tt, aF, D - 0.3);
    return <>
      <RBox s={[0.26, 0.03, 0.24]} r={0.01} p={[0, 0.2, 0]}><meshStandardMaterial color="#3a3e40" metalness={0.6} roughness={0.5} /></RBox>
      <group position={[0, 0.215, 0]}><Stickman escala={0.15} rotY={0} guion={[{ t: 0, accion: "sentarse", expr: "decidido" }, { t: aF + 0.6, accion: "sentarse", expr: "asustado" }] as any} semilla={45} contacto={0} color={"#" + new THREE.Color("#d8602a").lerp(new THREE.Color("#5a8ac8"), cold).getHexString()} /></group>
      {WIRES.filter((_, j) => j !== 4 && j !== 5).map((pts, j) => <mesh key={j} geometry={tubeG("traje" + j, pts, 0.005, 30, 6)}><meshStandardMaterial color="#3a1a10" emissive="#ff7a2a" emissiveIntensity={1.6 * heat(j)} roughness={0.5} /></mesh>)}
      <pointLight position={[0, 0.4, 0.2]} intensity={0.9 * (1 - cold)} distance={0.8} color="#ff9a5a" />
      <mesh position={[0, 0.32, 0.05]}><sphereGeometry args={[0.4, 40, 24, 0, 2 * PI, 0, PI * 0.7]} />{M.glass({ op: 0.05 + 0.05 * frost, col: "#dfeaf2" })}</mesh>
      {Array.from({ length: 70 }, (_, i) => { const a = rn(i, 1) * 2 * PI, b = PI * 0.7 - rn(i, 2) * PI * 0.12, s = cl((frost * 1.3 - (1 - b / (PI * 0.7)) * 0.9 - rn(i, 3) * 0.3) * 3);
        return <mesh key={i} position={[Math.sin(b) * Math.cos(a) * 0.395, 0.32 + Math.cos(b) * 0.395, 0.05 + Math.sin(b) * Math.sin(a) * 0.395]} scale={Math.max(0.001, s)}><octahedronGeometry args={[0.013, 0]} /><meshStandardMaterial color="#f4fbff" roughness={0.3} /></mesh>; })}
      {/* el termómetro de mercurio */}
      <group position={[0.24, 0.22, 0.12]}>
        <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.014, 0.014, 0.3, 14]} />{M.glass({ op: 0.3 })}</mesh>
        <mesh><sphereGeometry args={[0.024, 14, 10]} /><meshStandardMaterial color="#b8bcc0" metalness={0.9} roughness={0.2} /></mesh>
        <mesh position={[0, 0.01 + 0.13 * (1 - 0.85 * cold), 0]}><cylinderGeometry args={[0.007, 0.007, Math.max(0.01, 0.26 * (1 - 0.85 * cold)), 8]} /><meshStandardMaterial color="#b8bcc0" metalness={0.9} roughness={0.2} /></mesh>
        {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0.016, 0.04 + i * 0.045, 0]}><boxGeometry args={[0.01, 0.003, 0.003]} /><meshBasicMaterial color="#1a2a3a" /></mesh>)}
      </group>
    </>;
  }}</U3>;
};

// ---- ParacaidasPuerta · bien cerca, dentro del fuselaje: en el piso la escotilla redonda de la torreta; el artillero asoma medio
// cuerpo por el agujero y estira el brazo; el paracaídas cuelga del gancho, grande, en primer plano, a un brazo y medio de distancia ----
const ParacaidasPuerta: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "puerta", 1.2);
  return <U3 d={d} bg={p.bg} ground={null} sky="#0a0e18" mode="iris" key1={[0.4, 2.2, 1.8]} backDim={0.2}
    cam={{ at: [0.05, 0.3, 0], az: [0.7, 0.5], el: [0.22, 0.16], r: [1.1, 0.9], fov: 36 }}>{(tt) => {
    const open = eio(tt, 0.2, 0.9), up = eio(tt, 0.4, aP), reach = eio(tt, aP, aP + 0.8), sway = 0.06 * Math.sin(tt * 2 * PI * 0.4);
    return <>
      {/* el piso del fuselaje con el agujero */}
      {[[-0.55, 0.7], [0.55, 0.7]].map(([x, w], k) => <RBox key={k} s={[w, 0.03, 0.9]} r={0.004} p={[x, 0.0, 0]}><meshStandardMaterial color="#4a4e4a" metalness={0.5} roughness={0.6} /></RBox>)}
      {[-1, 1].map((s) => <RBox key={"z" + s} s={[0.4, 0.03, 0.25]} r={0.004} p={[0, 0.0, s * 0.33]}><meshStandardMaterial color="#4a4e4a" metalness={0.5} roughness={0.6} /></RBox>)}
      <mesh position={[0, 0.016, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.17, 0.2, 40]} />{M.steel({ col: "#8a8e8a" })}</mesh>
      <mesh position={[0, -0.4, 0]}><cylinderGeometry args={[0.17, 0.17, 0.8, 32, 1, true]} /><meshStandardMaterial color="#1a1c1e" side={THREE.BackSide} /></mesh>
      <group position={[-0.2, 0.016, 0]} rotation={[0, 0, open * 1.9]}><mesh position={[0.2, 0, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.18, 32]} /><meshStandardMaterial color="#6a6e6a" metalness={0.6} roughness={0.5} side={THREE.DoubleSide} /></mesh></group>
      {/* el artillero sube por la escotilla */}
      <group position={[0, lerp(-0.35, -0.12, up), 0]}><Stickman escala={0.13} rotY={60} guion={[{ t: 0, accion: "idle", expr: "nervioso" }, { t: aP, accion: "senalar", expr: "asustado" }] as any} semilla={46} contacto={0} color="#5a5a3e" /></group>
      {/* el fuselaje curvo detrás */}
      <mesh position={[0, 0.3, -0.45]}><cylinderGeometry args={[0.6, 0.6, 1.8, 32, 1, true, PI * 0.75, PI * 0.5]} /><meshStandardMaterial color="#5a5e5a" metalness={0.5} roughness={0.6} side={THREE.DoubleSide} /></mesh>
      {/* el paracaídas grande en el gancho */}
      <group position={[0.42, 0.62, 0.05]} rotation={[0, -0.5, sway]}>
        <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.004, 0.004, 0.06, 6]} />{M.steel()}</mesh>
        <group position={[0, -0.18, 0]}>
          <RBox s={[0.26, 0.32, 0.12]} r={0.035}><meshStandardMaterial color="#6a6a44" roughness={0.9} /></RBox>
          {[-1, 1].map((s) => <mesh key={s} position={[s * 0.07, 0.0, 0.062]}><boxGeometry args={[0.025, 0.34, 0.004]} /><meshStandardMaterial color="#e8dcc0" /></mesh>)}
          <mesh position={[0, -0.04, 0.066]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.025, 0.006, 8, 16]} />{M.chrome()}</mesh>
        </group>
      </group>
      {/* la distancia entre la mano y la mochila: un hilo de luz que se acorta pero no se cierra */}
      <mesh position={[lerp(0.15, 0.25, reach), 0.42, 0.04]} rotation={[0, 0, 0.4]} scale={[sm2(1 - reach * 0.6), 1, 1]}><boxGeometry args={[0.18, 0.004, 0.004]} />{M.glow({ col: "#ffd890", op: 0.6 * reach })}</mesh>
      <spotLight position={[0.4, 1.4, 0.6]} angle={0.35} penumbra={0.6} intensity={7} distance={2.5} color="#e8e0d0" />
      <pointLight position={[0, -0.1, 0.1]} intensity={0.6} distance={0.6} color="#7aa0ff" />
    </>;
  }}</U3>;
};
const sm2 = (v: number) => Math.max(0.001, v);

// ---- ClayKicker · cámara en los pies: el pateador acostado empuja la pala contra la arcilla; con cada patada saltan los terrones al
// costado, la vela tiembla y el montón de atrás crece ----
const ClayKicker: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "pateas", 1.0);
  return <U3 d={d} bg={p.bg} ground={null} mode="iris" key1={[-0.6, 1.8, 1.8]} backZ={-1.0}
    cam={{ at: [0.5, 0.28, 0], az: [-0.45, -0.25], el: [0.12, 0.08], r: [1.05, 0.9], fov: 36 }}>{(tt) => {
    const ph = Math.max(0, tt - aP * 0.5) * 0.9, cyc = ph % 1, kick = cyc < 0.3 ? eio(cyc, 0, 0.3) : 1 - eio(cyc, 0.3, 0.8), n = Math.floor(ph), hit = Math.exp(-Math.max(0, cyc - 0.3) * 8) * (cyc >= 0.3 ? 1 : 0);
    return <>
      <mesh position={[0, 0.32, -0.3]}><boxGeometry args={[2.6, 0.9, 0.3]} /><meshStandardMaterial map={rockT("klei2", CLAY, 3, 1)} roughness={0.95} /></mesh>
      <mesh position={[0, -0.02, 0]}><boxGeometry args={[2.6, 0.04, 0.6]} /><meshStandardMaterial map={rockT("kleipiso2", CLAY.map((v) => v * 0.8), 3, 1)} roughness={1} /></mesh>
      <mesh position={[0.95, 0.32, 0]}><boxGeometry args={[0.2, 0.9, 0.6]} /><meshStandardMaterial map={rockT("kleifrente2", CLAY.map((v) => v * 1.05), 1, 1)} roughness={0.95} /></mesh>
      {[-0.5, -0.1, 0.3, 0.7].map((x, i) => <group key={i} position={[x, 0, 0]}>{[-1, 1].map((s) => <RBox key={s} s={[0.04, 0.6, 0.04]} p={[0, 0.3, s * 0.27]}>{M.wood({ base: [130, 92, 54] })}</RBox>)}<RBox s={[0.04, 0.04, 0.6]} p={[0, 0.6, 0]}>{M.wood({ base: [130, 92, 54] })}</RBox></group>)}
      <group position={[0.35, 0.12, 0]} rotation={[0, 0, 0.42]}>
        <RBox s={[0.62, 0.025, 0.1]} r={0.004}>{M.wood({ base: [150, 108, 64] })}</RBox>
        <RBox s={[0.025, 0.12, 0.25]} r={0.004} p={[-0.3, -0.06, 0]}>{M.wood({ base: [150, 108, 64] })}</RBox>
        <group position={[-0.28 + 0.03 * kick, 0.03, 0]} rotation={[0, 0, -PI / 2]}><Stickman escala={0.09} rotY={0} guion={[{ t: 0, accion: "quieto", expr: "decidido" }]} semilla={51} contacto={0} /></group>
      </group>
      {/* la pala, grande, entre los pies */}
      <group position={[0.76 + 0.09 * kick, 0.3 + 0.03 * kick, 0]} rotation={[0, 0, -PI / 2 + 0.4]}>
        <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.011, 0.011, 0.26, 8]} />{M.wood({ base: [120, 84, 50] })}</mesh>
        <RBox s={[0.1, 0.13, 0.01]} r={0.003} p={[0, 0.06, 0]}>{M.steel({ col: "#9a9ea2" })}</RBox>
      </group>
      {/* los terrones que saltan al costado con cada patada */}
      {Array.from({ length: 5 }, (_, i) => { const m = cl((cyc - 0.3) / 0.6), a = rn(i + n * 5, 1) * 0.8 + 0.3;
        return <mesh key={i} position={[0.86 - 0.25 * m * Math.cos(a), 0.3 + 0.2 * m * Math.sin(a) - 0.4 * m * m, 0.05 + (rn(i, 2) - 0.5) * 0.3 * m]} rotation={[m * 4, m * 3, 0]} visible={tt > aP * 0.5 && cyc > 0.3}><dodecahedronGeometry args={[0.025 + 0.01 * rn(i, 3), 0]} /><meshStandardMaterial map={rockT("terron2", CLAY, 1, 1)} roughness={0.95} /></mesh>; })}
      {/* el montón que crece */}
      <mesh position={[0.55, 0.0, 0.2]} scale={[1, Math.max(0.001, 0.4 + Math.min(1.2, n * 0.18)), 1]}><sphereGeometry args={[0.1, 18, 12, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial map={rockT("monton", CLAY, 1, 1)} roughness={1} /></mesh>
      {/* la vela que tiembla con cada golpe */}
      <group position={[0.62, 0.0, -0.18]}>
        <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.012, 0.012, 0.1, 10]} /><meshStandardMaterial color="#efe6d2" roughness={0.8} /></mesh>
        <mesh position={[0.01 * hit * Math.sin(tt * 12), 0.115, 0]} scale={[1 - 0.3 * hit, 1 + 0.4 * hit, 1]} rotation={[0, 0, 0.4 * hit]}><coneGeometry args={[0.012, 0.035, 10]} />{M.glow({ col: "#ffd27a" })}</mesh>
        <pointLight position={[0, 0.13, 0.06]} intensity={0.9 - 0.3 * hit} distance={1.2} color="#ffc070" />
      </group>
    </>;
  }}</U3>;
};

// ---- Messines19 · la cresta en corte con 19 cajas de explosivo; se encienden de a una mientras suben las toneladas; al final todas
// a la vez y la cresta se levanta en bloque ----
const Messines19: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aT = sec(p, "toneladas", 0.6), aX = Math.min(Math.max(sec(p, "diecinueve", 2.0), aT + 1.2), D - 2.2);
  const litT = (i: number) => aT + (i + 0.5) * (aX - aT) / 19;
  const tons = (tt: number) => Math.round(450 * Array.from({ length: 19 }, (_, i) => cl((tt - litT(i)) / 0.15)).reduce((a, b) => a + b, 0) / 19);
  return <U3 d={d} bg={p.bg} ground={null} sky="#20222a" mode="drop" key1={[-1.2, 2.4, 2.0]} backZ={-1.6}
    cam={{ at: [0, 0.18, 0], az: [-0.1, 0.06], el: [0.12, 0.08], r: [2.45, 2.2], fov: 36 }}
    over={(tt) => <Drums v={tons(tt)} n={3} x={1180} y={260} s={1.3} unit="t" />}>{(tt) => {
    const W = 3.2, N = 64, lift = eio(tt, aX, aX + 0.6) * (1 - 0.6 * eio(tt, aX + 0.8, aX + 2.0));
    const ridge = (x: number) => 0.28 * Math.exp(-x * x * 1.4);
    const cx = Array.from({ length: 19 }, (_, i) => -1.26 + i * 0.14);
    const heave = (x: number) => 0.22 * lift * Math.exp(-x * x * 0.6) * (1 + 0.15 * Math.sin(x * 20));
    const pos: number[] = []; const idx: number[] = [];
    for (let i = 0; i <= N; i++) { const x = -W / 2 + W * i / N, y = 0.2 + ridge(x) + heave(x); pos.push(x, -0.45, 0, x, y, 0); if (i < N) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const top: number[][] = Array.from({ length: 33 }, (_, i) => { const x = -W / 2 + W * i / 32; return [x, 0.2 + ridge(x) + heave(x) + 0.01, 0.01]; });
    return <>
      <mesh geometry={g}><meshStandardMaterial map={rockT("messines2", [110, 96, 74], 3, 1)} roughness={1} side={THREE.DoubleSide} /></mesh>
      <mesh geometry={tubeG("pasto_m" + Math.round(lift * 40), top, 0.02, 60, 6)}><meshStandardMaterial color="#5a6a3a" roughness={1} /></mesh>
      {[-0.05, -0.28].map((y, i) => <mesh key={i} position={[0, y, 0.005]}><planeGeometry args={[W, 0.03]} /><meshStandardMaterial color={i ? "#5a4a36" : "#8a7458"} roughness={1} /></mesh>)}
      {/* las 19 cajas de explosivo */}
      {cx.map((x, i) => { const on = cl((tt - litT(i)) / 0.15), out = eio(tt, aX + 1.0, aX + 2.0);
        return <group key={i} position={[x, -0.2 + 0.03 * Math.sin(i * 1.7), 0.03]}>
          <RBox s={[0.09, 0.07, 0.05]} r={0.006}><meshStandardMaterial color="#6a4a2a" roughness={0.8} emissive="#ff7a2a" emissiveIntensity={(0.9 * on + 1.2 * lift) * (1 - out)} /></RBox>
        </group>; })}
      <pointLight position={[0, -0.1, 0.6]} intensity={2.6 * lift * (1 - eio(tt, aX + 1.0, aX + 2.0))} distance={3} color="#ff9a4a" />
      {Array.from({ length: 30 }, (_, i) => { const c = cx[i % 19], r = eio(tt, aX, aX + 2.6);
        return <mesh key={i} position={[c + (rn(i, 1) - 0.5) * 0.12, 0.45 + r * (0.25 + 0.55 * rn(i, 2)), (rn(i, 3) - 0.5) * 0.3]} scale={Math.max(0.001, lift * (0.6 + rn(i, 4)))}><sphereGeometry args={[0.08, 12, 10]} /><meshStandardMaterial color="#6a6458" roughness={1} transparent opacity={0.75} depthWrite={false} /></mesh>; })}
      <group position={[1.05, 0.78, 0.25]} rotation={[0, -0.25, 0]} scale={0.8 * pop(tt, 0.3)}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.16, 0.16, 0.03, 40]} />{M.brass()}</mesh>
        <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.145, 40]} /><meshStandardMaterial color="#efe6d2" /></mesh>
        <group position={[0, 0, 0.02]} rotation={[0, 0, -(3 + 10 / 60) / 12 * 2 * PI]}><RBox s={[0.012, 0.08, 0.004]} r={0.002} p={[0, 0.04, 0]}><meshStandardMaterial color="#1e1610" /></RBox></group>
        <group position={[0, 0, 0.022]} rotation={[0, 0, -10 / 60 * 2 * PI]}><RBox s={[0.008, 0.12, 0.004]} r={0.002} p={[0, 0.06, 0]}><meshStandardMaterial color="#1e1610" /></RBox></group>
      </group>
    </>;
  }}</U3>;
};

// ---- LagunaPaz · el cráter se llena; los patos llegan de a uno y chapotean; la cámara baja al campo de al lado, cortado como un pastel,
// donde la mina oxidada sigue enterrada ----
const BOWL = [[0, -0.36], [0.35, -0.33], [0.62, -0.2], [0.82, -0.05], [0.92, 0.03], [1.0, 0.0]];
const rAt = (y: number) => { for (let i = 1; i < BOWL.length; i++) if (y <= BOWL[i][1]) { const [r0, y0] = BOWL[i - 1], [r1, y1] = BOWL[i]; return lerp(r0, r1, (y - y0) / (y1 - y0)); } return 0.92; };
const LagunaPaz: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aP = Math.min(sec(p, "patos", 1.6), D - 3), aM = Math.min(sec(p, "mina", 4.0), D - 1.6);
  return <U3 d={d} bg={p.bg} ground={null} floor="none" mode="iris" key1={[-1.4, 3.0, 1.6]} sky="#b8c4c8"
    cam={{ at: [0.1, -0.08, 0.1], at1: [1.45, -0.12, 0.85], az: [-0.3, 0.1], el: [0.45, 0.14], r: [2.4, 1.2], fov: 36 }}>{(tt) => {
    const fill = eio(tt, 0.1, aP), wy = lerp(-0.34, -0.06, fill), wr = Math.max(0.05, rAt(wy) * 0.98);
    return <>
      <mesh position={[0, 0, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.99, 4.2, 64, 1]} /><meshStandardMaterial map={rockT("pasto2", [96, 118, 64], 6, 6)} roughness={1} /></mesh>
      <mesh geometry={latheG("crater2", BOWL as any, 64)}><meshStandardMaterial map={rockT("barro2", [104, 96, 70], 3, 3)} roughness={1} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, wy, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[wr, 64]} />{M.water({ col: "#4a6a72" })}</mesh>
      {Array.from({ length: 7 }, (_, i) => { const a = PI + (i / 6) * PI + rn(i, 4) * 0.2, r = 1.2 + rn(i, 5) * 0.25;
        return <group key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]}>
          <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.015, 0.02, 0.24, 8]} /><meshStandardMaterial color="#5a4632" roughness={1} /></mesh>
          <mesh position={[0, 0.3, 0]} scale={[1, 1.2, 1]}><sphereGeometry args={[0.1 + rn(i, 6) * 0.05, 14, 10]} /><meshStandardMaterial color={new THREE.Color().setRGB(0.24 + rn(i, 7) * 0.08, 0.36 + rn(i, 8) * 0.08, 0.18)} roughness={1} /></mesh>
        </group>; })}
      {Array.from({ length: 4 }, (_, i) => { const a0 = aP + i * 0.45, land = eio(tt, a0, a0 + 0.5), a = tt * 0.25 + i * 1.6, r = wr * (0.35 + 0.15 * (i % 2)), sp = Math.exp(-Math.max(0, tt - a0 - 0.5) * 3) * (tt > a0 + 0.5 ? 1 : 0);
        return <group key={i}>
          <group position={[Math.cos(a) * r, wy + 0.012 + 0.5 * (1 - land), Math.sin(a) * r]} rotation={[0, -a - PI / 2 * (i % 2 ? -1 : 1), 0]} visible={tt > a0 - 0.2}>
            <mesh scale={[1.4, 0.7, 0.9]}><sphereGeometry args={[0.05, 16, 10]} /><meshStandardMaterial color={i % 2 ? "#6a5a40" : "#8a7a5a"} roughness={0.8} /></mesh>
            <mesh position={[0.055, 0.05, 0]}><sphereGeometry args={[0.026, 12, 8]} /><meshStandardMaterial color={i % 2 ? "#2a5a3a" : "#7a6a4a"} roughness={0.6} /></mesh>
            <mesh position={[0.085, 0.046, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.009, 0.03, 8]} /><meshStandardMaterial color="#c8a040" /></mesh>
          </group>
          <mesh position={[Math.cos(a) * r, wy + 0.004, Math.sin(a) * r]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.05 + 0.15 * (1 - sp), 0.06 + 0.15 * (1 - sp), 32]} /><meshBasicMaterial color="#e8f4f8" transparent opacity={0.7 * sp} depthWrite={false} /></mesh>
        </group>; })}
      {/* el campo de al lado, cortado: la mina oxidada en la tierra */}
      <group position={[1.6, 0, 0.75]}>
        <mesh position={[0, -0.22, -0.2]}><boxGeometry args={[0.9, 0.44, 0.5]} /><meshStandardMaterial map={rockT("campoM", [96, 74, 50], 2, 1)} roughness={1} /></mesh>
        {Array.from({ length: 6 }, (_, i) => <RBox key={i} s={[0.9, 0.05, 0.07]} r={0.02} p={[0, 0.025, -0.4 + i * 0.09]}><meshStandardMaterial color="#6a5232" roughness={1} /></RBox>)}
        <group position={[0.05, -0.2, 0.02]} rotation={[0.25, 0, 0.1]}>
          <mesh><cylinderGeometry args={[0.13, 0.13, 0.07, 32]} /><meshStandardMaterial color="#6a3a1c" metalness={0.5} roughness={0.85} /></mesh>
          <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.025, 0.03, 0.05, 14]} /><meshStandardMaterial color="#4a3a2a" metalness={0.5} roughness={0.7} /></mesh>
          {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[Math.cos(i * 0.63) * 0.12, 0.036, Math.sin(i * 0.63) * 0.12]}><sphereGeometry args={[0.008, 6, 6]} /><meshStandardMaterial color="#3a2a1a" /></mesh>)}
        </group>
        <pointLight position={[0.05, -0.05, 0.4]} intensity={0.9 * eio(tt, aM, aM + 0.6)} distance={0.9} color="#ffb070" />
      </group>
    </>;
  }}</U3>;
};

// ---- TiraTiempo · el reloj de arena chiquito (las ocho paradas, menos de dos horas) contra la pila de calendarios de los años reales,
// que sigue creciendo hasta salirse del cuadro ----
const TiraTiempo: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aA = Math.min(sec(p, "años", 2.6), D - 1.6);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" key1={[-1.2, 2.6, 2.0]}
    cam={{ at: [0, 0.34, 0], at1: [0.05, 0.5, 0], az: [-0.16, 0.08], el: [0.12, 0.1], r: [1.95, 2.35], fov: 36 }}>{(tt) => {
    const sand = eio(tt, 0.3, aA), grow = eio(tt, aA, D - 0.2);
    return <>
      {/* el reloj de arena: ocho granos grandes, uno por parada */}
      <group position={[-0.42, 0, 0.05]} scale={1.7}>
        {[0.005, 0.31].map((y, i) => <mesh key={i} position={[0, y, 0]}><cylinderGeometry args={[0.1, 0.1, 0.02, 24]} />{M.wood({ base: [110, 72, 40] })}</mesh>)}
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.085, 0.16, 0]}><cylinderGeometry args={[0.008, 0.008, 0.3, 8]} />{M.wood({ base: [110, 72, 40] })}</mesh>)}
        <mesh position={[0, 0.16, 0]} geometry={latheG("reloj", [[0, -0.14], [0.07, -0.13], [0.075, -0.06], [0.012, 0], [0.075, 0.06], [0.07, 0.13], [0, 0.14]], 28)}>{M.glass({ op: 0.25 })}</mesh>
        <mesh position={[0, 0.27 - 0.08 * sand, 0]} scale={[1, Math.max(0.001, 1 - sand), 1]}><coneGeometry args={[0.055, 0.08, 20]} /><meshStandardMaterial color="#d8b878" roughness={0.9} /></mesh>
        <mesh position={[0, 0.04 + 0.03 * sand, 0]} scale={[1, Math.max(0.001, sand), 1]}><coneGeometry args={[0.06, 0.07, 20]} /><meshStandardMaterial color="#d8b878" roughness={0.9} /></mesh>
        <Plate k="dosh3" txt="2 HORAS" w={0.24} h={0.075} p={[0, 0.05, 0.12]} rot={[-0.3, 0, 0]} mat="brass" font={80} />
      </group>
      {/* la pila de calendarios: hojas que caen una sobre otra */}
      <group position={[0.35, 0, 0]}>
        {Array.from({ length: 24 }, (_, i) => { const a = aA + i * (D - aA - 0.4) / 24, on = cl((tt - a) / 0.2);
          return <group key={i} position={[(rn(i, 1) - 0.5) * 0.02, 0.022 + i * 0.04 + 0.3 * (1 - on), 0]} rotation={[0, (rn(i, 2) - 0.5) * 0.15, 0]} visible={tt > a - 0.05}>
            <RBox s={[0.3, 0.036, 0.22]} r={0.004}><meshStandardMaterial color={i % 2 ? "#efe8da" : "#e4dccb"} roughness={0.95} /></RBox>
            <mesh position={[0, 0.0, 0.111]}><planeGeometry args={[0.28, 0.006]} /><meshBasicMaterial color="#c0281e" /></mesh></group>; })}
        <group position={[0.3, 0, 0.12]} scale={pop(tt, aA + 0.2)}><Plate k="anios2" txt="AÑOS" w={0.28} h={0.1} p={[0, 0.12, 0]} rot={[-0.3, 0, 0]} mat="brass" font={84} /></group>
      </group>
      <pointLight position={[0.35, 1.2 + 1.2 * grow, 0.6]} intensity={1.2} distance={2.5} color="#ffe0b0" />
    </>;
  }}</U3>;
};

// ---- OchoPuertas · ocho puertas en arco, cada casco sobre su dintel; la cámara se acerca y sólo una se abre con luz cálida ----
const OchoPuertas: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aQ = Math.min(sec(p, "guerra", 1.2), D - 1.8);
  return <U3 d={d} bg={p.bg} ground={[120, 100, 80]} mode="iris" key1={[-1.0, 2.8, 1.6]}
    cam={{ at: [0, 0.4, 0.2], at1: [0.0, 0.36, -0.55], az: [0.0, 0.0], el: [0.16, 0.06], r: [2.3, 1.3], fov: 38 }}>{(tt) => {
    const open = eio(tt, aQ, aQ + 0.9);
    return <>
      {Array.from({ length: 8 }, (_, i) => { const a = (i - 3.5) * 0.24, R = 1.3, sel = i === 3;
        return <group key={i} position={[Math.sin(a) * R, 0, -Math.cos(a) * R + 0.3]} rotation={[0, -a, 0]}>
          {[-1, 1].map((s) => <RBox key={s} s={[0.07, 0.55, 0.1]} r={0.01} p={[s * 0.17, 0.275, 0]}><meshStandardMaterial map={dirtT([170, 160, 142])} roughness={0.95} /></RBox>)}
          <RBox s={[0.42, 0.08, 0.12]} r={0.01} p={[0, 0.59, 0]}><meshStandardMaterial map={dirtT([170, 160, 142])} roughness={0.95} /></RBox>
          <mesh position={[0, 0.28, -0.03]}><planeGeometry args={[0.28, 0.56]} />{sel ? M.glow({ col: "#ffcf80", op: 0.85 * open }) : <meshBasicMaterial color="#0c0907" />}</mesh>
          {/* la hoja de la puerta: sólo la elegida gira */}
          <group position={[-0.14, 0.0, 0.0]} rotation={[0, sel ? -1.6 * open : 0, 0]}><RBox s={[0.28, 0.54, 0.025]} r={0.006} p={[0.14, 0.27, 0]}><meshStandardMaterial map={tex.wood(1, 2, [96, 62, 34])} roughness={0.8} /></RBox></group>
          <group position={[0, 0.63, 0.0]} scale={1.15}><Casco i={i} /></group>
        </group>; })}
      <pointLight position={[0, 0.4, -1.2]} intensity={2.4 * open} distance={2.2} color="#ffcf80" />
      <pointLight position={[0, 1.2, 0.6]} intensity={0.9} distance={3} color="#ffe0c0" />
    </>;
  }}</U3>;
};

// ---- TodoLoDemas · cuatro objetos grandes; el nombrado salta con resorte y se ilumina, los otros quedan en penumbra; el ordenanza va
// de uno a otro ----
const ST = [-0.9, -0.3, 0.3, 0.9];
const TodoLoDemas: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, A = [sec(p, "cargar", 0.4), sec(p, "comida", 2.0), sec(p, "baldes", 3.4), sec(p, "limpiar", 4.8)].map((a) => Math.min(a, D - 1));
  return <U3 d={d} bg={p.bg} ground={null} floor="none" mode="wipe" key1={[-1.2, 2.6, 2.0]} backZ={-1.6} backDim={0.35}
    cam={{ at: [-0.5, 0.48, 0], at1: [0.5, 0.48, 0], az: [-0.22, 0.16], el: [0.12, 0.1], r: [1.5, 1.4], fov: 38 }}>{(tt) => {
    let k = 0; for (let i = 0; i < 4; i++) if (tt >= A[i] - 0.55) k = i;
    const mv = k > 0 ? eio(tt, A[k] - 0.55, A[k] - 0.05) : 1, x = k > 0 ? lerp(ST[k - 1], ST[k], mv) : ST[0] - 0.3 * (1 - eio(tt, 0, A[0]));
    const walking = (k > 0 && mv > 0.02 && mv < 0.98) || tt < A[0] - 0.05;
    const tired = cl((tt - A[0]) / Math.max(1, A[3] - A[0]));
    const act = (i: number) => eio(tt, A[i], A[i] + 0.3) * (i < 3 ? 1 - eio(tt, A[i + 1], A[i + 1] + 0.3) : 1);
    const jump = (i: number) => tt > A[i] ? 0.1 * Math.exp(-(tt - A[i]) * 4) * Math.abs(Math.sin((tt - A[i]) * 9)) : 0;
    const grp = (i: number, el: React.ReactNode) => <group key={i} position={[ST[i], 0.3 + jump(i), 0.14]} scale={1.9 * pop(tt, A[i] - 0.25)}>{el}</group>;
    return <>
      <RBox s={[3.0, 0.06, 1.2]} r={0.006} p={[0, 0.27, -0.1]}><meshStandardMaterial map={tex.wood(6, 2, [120, 92, 60])} roughness={0.9} /></RBox>
      {grp(0, <>{[-0.09, 0.09].map((z) => <mesh key={z} position={[0, 0.05, z]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.5, 10]} />{M.wood({ base: [130, 92, 54] })}</mesh>)}
        <RBox s={[0.4, 0.012, 0.18]} r={0.004} p={[0, 0.05, 0]}><meshStandardMaterial color="#b8a888" roughness={1} /></RBox>
        <mesh position={[0, 0.09, 0]} rotation={[0, 0, PI / 2]} scale={[1, 1, 0.8]}><capsuleGeometry args={[0.05, 0.24, 6, 10]} /><meshStandardMaterial color="#6a6458" roughness={1} /></mesh></>)}
      {grp(1, <><mesh position={[0, 0.06, 0]} geometry={latheG("olla", [[0, 0], [0.09, 0], [0.1, 0.12], [0.095, 0.12], [0, 0.01]], 28)}>{M.steel({ col: "#7a7e82" })}</mesh>
        <mesh position={[0, 0.17, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.09, 24]} /><meshStandardMaterial color="#a8763c" roughness={0.5} /></mesh>
        {[0, 1, 2].map((j) => { const ph = (tt * 0.6 + j / 3) % 1; return <mesh key={j} position={[(j - 1) * 0.03, 0.2 + ph * 0.2, 0]} scale={0.5 + ph}><sphereGeometry args={[0.03, 10, 8]} /><meshBasicMaterial color="#fff" transparent opacity={0.35 * (1 - ph) * act(1)} depthWrite={false} /></mesh>; })}</>)}
      {grp(2, <><mesh position={[0, 0.0, 0]} geometry={latheG("tdlb2", [[0, 0], [0.07, 0], [0.09, 0.16], [0.085, 0.16], [0.065, 0.01], [0, 0.01]], 28)}>{M.wood({ base: [110, 78, 46] })}</mesh>
        <mesh position={[0, 0.14, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.082, 24]} /><meshStandardMaterial color="#e8e4da" roughness={0.6} /></mesh>
        {[0, 1, 2, 3].map((j) => <mesh key={j} position={[(rn(j, 1) - 0.5) * 0.1, 0.15, (rn(j, 2) - 0.5) * 0.1]}><sphereGeometry args={[0.02, 10, 8]} /><meshStandardMaterial color="#f4f2ec" roughness={0.4} /></mesh>)}
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.08, 0.005, 6, 24, PI]} />{M.steel()}</mesh></>)}
      {grp(3, <><mesh position={[0.0, 0.2, 0]} rotation={[0, 0, -0.25]}><cylinderGeometry args={[0.01, 0.01, 0.42, 10]} />{M.wood({ base: [150, 110, 70] })}</mesh>
        <RBox s={[0.14, 0.03, 0.05]} r={0.006} p={[0.05, 0.0, 0]}>{M.wood({ base: [120, 84, 50] })}</RBox>
        {Array.from({ length: 9 }, (_, j) => <mesh key={j} position={[0.0 + j * 0.015, -0.03, 0]}><cylinderGeometry args={[0.003, 0.003, 0.04, 4]} /><meshStandardMaterial color="#c8b88a" /></mesh>)}
        <mesh position={[-0.02, -0.04, 0.08]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.12, 24]} /><meshStandardMaterial color="#6a8aa0" roughness={0.05} transparent opacity={0.5} /></mesh></>)}
      {ST.map((sx, i) => <spotLight key={"l" + i} position={[sx, 1.6, 0.6]} angle={0.2} penumbra={0.6} intensity={4 + 18 * act(i)} distance={3} color="#ffe0b0" />)}
      <group position={[x, 0.3, -0.2]}>
        <group visible={walking}><EnSitio tt={tt} accion="caminar" escala={0.16} rotY={90} expr={tired > 0.5 ? "triste" : "nervioso"} semilla={71} contacto={0.3} /></group>
        <group visible={!walking}><Stickman escala={0.16} rotY={10} guion={[{ t: 0, accion: ["cargar_caja", "idle", "cargar_caja", "empujar"][k], expr: tired > 0.5 ? "triste" : "decidido" }] as any} semilla={71} contacto={0.3} colorContacto="#4a3a2a" /></group>
      </group>
    </>;
  }}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { BalaPlomo, MitoVuelta, ManosGermenes, TorretaCola, TrajeCalefaccion, ParacaidasPuerta, ClayKicker, Messines19, LagunaPaz, TiraTiempo, OchoPuertas, TodoLoDemas };
