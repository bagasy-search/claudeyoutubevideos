// dur29e · bloque A (gancho de Kimberley, Europa · Wieliczka, África · Kimberley, Asia · perlas de Baréin):
// un mecanismo por componente, objetos grandes y enteros, sombra de contacto, sin carteles para leer. Luces siempre montadas (rampa).
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, fallY, latheG, pop } from "./kb";
import { Stickman } from "../stickman3d";
import { PI, sm, Coin, Lantern } from "./c3k";

type UP = { d: number; p: any };

// ---------- piezas ----------
export const Sh: React.FC<{ p: number[]; r: number; sx?: number; op?: number }> = ({ p, r, sx = 1, op = 0.45 }) =>
  <mesh position={[p[0], p[1] + 0.002, p[2]]} rotation={[-PI / 2, 0, 0]} scale={[sx, 1, 1]}><circleGeometry args={[r, 32]} /><meshBasicMaterial color="#000" transparent opacity={op} depthWrite={false} /></mesh>;
// barra entre dos puntos (cables, sogas, varas)
const UPV = new THREE.Vector3(0, 1, 0);
export const Seg: React.FC<{ a: number[]; b: number[]; r?: number; children: React.ReactNode }> = ({ a, b, r = 0.003, children }) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = Math.max(0.001, d.length());
  const q = new THREE.Quaternion().setFromUnitVectors(UPV, d.normalize());
  return <mesh position={A.clone().add(B).multiplyScalar(0.5)} quaternion={q}><cylinderGeometry args={[r, r, L, 6]} />{children}</mesh>;
};
export const Polvo: React.FC<{ tt: number; a: number; p: number[]; s?: number; col?: string }> = ({ tt, a, p, s = 1, col = "#c8b090" }) => {
  const k = cl((tt - a) / 0.9); if (tt < a || k >= 1) return null;
  return <group position={p as any}>{Array.from({ length: 10 }, (_, i) => { const an = i / 10 * 2 * PI + rn(i, 2);
    return <mesh key={i} position={[Math.cos(an) * 0.09 * s * k, 0.02 + 0.05 * s * k * rn(i, 3), Math.sin(an) * 0.06 * s * k]} scale={sm(0.02 * s * (0.5 + k))}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={col} transparent opacity={0.55 * (1 - k)} depthWrite={false} /></mesh>; })}</group>;
};
export const Balde: React.FC<{ s?: number; full?: number; col?: string }> = ({ s = 1, full = 1, col = "#5a6a7a" }) => <group scale={s}>
  <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.045, 0.035, 0.08, 18, 1, true]} />{M.wood({ base: [120, 84, 50] })}</mesh>
  <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.035, 18]} />{M.wood({ base: [100, 70, 40] })}</mesh>
  <mesh position={[0, 0.075, 0]} scale={[1, sm(full), 1]}><sphereGeometry args={[0.043, 16, 8, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial color={col} roughness={1} /></mesh>
  <mesh position={[0, 0.08, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.046, 0.003, 6, 20, PI]} />{M.steel({ col: "#6a6e72" })}</mesh>
</group>;
// un pozo redondo visto en corte: borde, paredes en terrazas, fondo
const Pozo: React.FC<{ r: number; h: number; col?: number[]; k?: string }> = ({ r, h, col = [150, 100, 64], k = "pz" }) => <group>
  <mesh geometry={latheG(k + r + h, [[r * 0.25, -h], [r * 0.4, -h * 0.82], [r * 0.55, -h * 0.6], [r * 0.7, -h * 0.4], [r * 0.85, -h * 0.18], [r, 0]], 48)}>
    <meshStandardMaterial map={dirtT(col)} roughness={1} side={THREE.BackSide} /></mesh>
  <mesh position={[0, -h + 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[r * 0.25, 32]} /><meshStandardMaterial map={dirtT([90, 104, 120])} roughness={1} /></mesh>
  <mesh rotation={[-PI / 2, 0, 0]}><ringGeometry args={[r, r * 2.4, 48]} /><meshStandardMaterial map={dirtT(col)} roughness={1} /></mesh>
</group>;

// ======================= GANCHO · KIMBERLEY =======================

// ---- GranAgujeroSogas · el agujero redondo hecho a mano; desde el borde se tienden los cables uno a uno como una telaraña;
// en «baldes» los baldes empiezan a subir y bajar, y uno trae al muñeco colgado ----
const GranAgujeroSogas: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "cables", 1.4), aB = sec(p, "baldes", 3.0), N = 22;
  return <U3 d={d} bg={p.bg} ground={null} sky="#c8b89a" mode="iris" key1={[-1.2, 3, 1.4]}
    cam={{ at: [0, -0.25, 0], az: [-0.3, 0.1], el: [0.75, 0.62], r: [2.1, 1.75], fov: 36 }}>{(tt) => <>
    <Pozo r={0.9} h={0.7} k="ag" />
    {Array.from({ length: N }, (_, i) => { const an = i / N * 2 * PI, a = aC + i * 0.06, k = eio(tt, a, a + 0.4), top = [Math.cos(an) * 0.92, 0.12, Math.sin(an) * 0.92], bot = [Math.cos(an + 0.4) * 0.2, -0.68, Math.sin(an + 0.4) * 0.2];
      const end = [lerp(top[0], bot[0], k), lerp(top[1], bot[1], k), lerp(top[2], bot[2], k)], u = tt > aB ? ((tt - aB) * 0.18 + rn(i, 3)) % 1 : 0.5, bu = [lerp(bot[0], top[0], u), lerp(bot[1], top[1], u) - 0.06, lerp(bot[2], top[2], u)];
      return <group key={i}>
        <mesh position={top as any}><boxGeometry args={[0.03, 0.12, 0.03]} />{M.wood({ base: [120, 84, 50] })}</mesh>
        <Seg a={top} b={end} r={0.0025}><meshStandardMaterial color="#3a3028" /></Seg>
        {i % 2 === 0 && tt > aB - 0.2 && <group position={bu as any}><Balde s={0.7} col="#6a7a8a" /></group>}
      </group>; })}
    {/* el balde del muñeco: cuelga del cable principal y baja */}
    <group position={[0.1, lerp(0.05, -0.32, eio(tt, 0.2, aB + 1.5)), 0.25]}>
      <Seg a={[0, 0.1, 0]} b={[0, 0.5, 0]} r={0.003}><meshStandardMaterial color="#3a3028" /></Seg>
      <Balde s={1.6} full={0} /><group position={[0, 0.03, 0]}><Stickman escala={0.06} rotY={20} guion={[{ t: 0, accion: "asustarse", expr: "espantado" }] as any} semilla={101} contacto={0} /></group>
    </group>
    {Array.from({ length: 14 }, (_, i) => { const an = rn(i, 5) * 2 * PI, r = 0.05 + 0.15 * rn(i, 6); return <group key={i} position={[Math.cos(an) * r, -0.7, Math.sin(an) * r]}><Stickman escala={0.03} rotY={rn(i, 7) * 360} guion={[{ t: 0, accion: "empujar", expr: "decidido" }] as any} semilla={110 + i} contacto={0} /></group>; })}
    <directionalLight position={[1.5, 3, 1]} intensity={1.5} color="#ffe8c8" />
  </>}</U3>;
};

// ---- SieteGlobo · el globo de mesa gira; en cada continente que se nombra se clava un alfiler rojo con un golpe de luz ----
const CONT = [["europa", 0.9, 0.3], ["africa", 0.15, 0.35], ["asia", 0.6, 1.4], ["norte", 0.75, -1.6], ["sur", -0.25, -1.0], ["oceania", -0.45, 2.4], ["antartida", -1.25, 0.0]] as const;
const SieteGlobo: React.FC<UP> = ({ d, p }) => {
  const at = CONT.map(([k], i) => sec(p, k as string, 0.6 + i * 0.7));
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" key1={[-0.8, 2.4, 1.6]}
    cam={{ at: [0, 0.38, 0], az: [-0.2, -0.05], el: [0.12, 0.1], r: [1.15, 1.0], fov: 34 }}>{(tt) => {
    const cur = at.filter((a) => tt > a).length - 1, target = cur >= 0 ? -CONT[cur][2] : 0, rot = lerp(-0.6 + tt * 0.25, target, cur >= 0 ? 0.85 : 0);
    return <>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.12, 0.14, 0.04, 32]} />{M.wood({ base: [110, 70, 38] })}</mesh>
      <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.015, 0.02, 0.2, 12]} />{M.brass()}</mesh>
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0.4]}><torusGeometry args={[0.25, 0.008, 8, 48, PI * 1.2]} />{M.brass()}</mesh>
      <group position={[0, 0.4, 0]} rotation={[0, 0, 0.4]}><group rotation={[0, rot, 0]}>
        <mesh><sphereGeometry args={[0.22, 48, 32]} /><meshStandardMaterial color="#d8c89a" roughness={0.7} /></mesh>
        {CONT.map(([, la, lo], i) => <group key={i} rotation={[0, lo, 0]}><group rotation={[0, 0, la]}>
          <mesh position={[0.218, 0, 0]} rotation={[0, 0, PI / 2]} scale={[0.8, 0.12, 0.6]}><sphereGeometry args={[0.07, 16, 10]} /><meshStandardMaterial color={i === 6 ? "#f2f6f8" : "#7a8a5a"} roughness={0.9} /></mesh>
          <group position={[0.22 + 0.05 * (1 - cl((tt - at[i]) * 4)) + 0.03, 0, 0]} visible={tt > at[i] - 0.1}>
            <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.002, 0.002, 0.06, 6]} />{M.steel()}</mesh>
            <mesh position={[0.03, 0, 0]}><sphereGeometry args={[0.01, 12, 8]} /><meshStandardMaterial color="#c8201a" emissive="#ff2010" emissiveIntensity={i === cur ? 1.2 : 0.2} /></mesh></group>
        </group></group>)}
      </group></group>
      <Sh p={[0, 0, 0]} r={0.16} />
      <spotLight position={[0.4, 1.6, 0.9]} angle={0.4} penumbra={0.7} intensity={9} distance={3} color="#ffe6c0" />
    </>;
  }}</U3>;
};

// ======================= EUROPA · WIELICZKA =======================

// ---- ParedSal · la galería de sal a la luz de una vela: en «piso», «techo» y «paredes» brillan los cristales de cada superficie ----
const ParedSal: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "piso", 1.0), aT = sec(p, "techo", 1.6), aW = sec(p, "paredes", 2.2);
  return <U3 d={d} bg={p.bg} ground={null} sky="#0a0806" mode="iris" key1={[-0.6, 2, 1.4]} backDim={0.4}
    cam={{ at: [0, 0.02, 0], az: [-0.3, -0.12], el: [0.12, 0.08], r: [1.55, 1.35], fov: 36 }}>{(tt) => {
    const k = [eio(tt, aP, aP + 0.6), eio(tt, aT, aT + 0.6), eio(tt, aW, aW + 0.6)];
    return <>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.42, 0.42, 2.4, 40, 1, true, PI * 0.775, PI * 1.45]} /><meshStandardMaterial map={dirtT([190, 186, 178])} side={THREE.BackSide} roughness={0.7} /></mesh>
      <mesh position={[0, -0.37, 0]}><boxGeometry args={[2.4, 0.02, 0.4]} /><meshStandardMaterial map={dirtT([200, 196, 188])} roughness={0.6} /></mesh>
      {[0, 1, 2].map((sd) => <group key={sd}>{Array.from({ length: 22 }, (_, i) => { const x = -1.0 + rn(i + sd * 40, 1) * 2.0, y = -0.1 + rn(i, 5) * 0.35;
          const pos = sd === 0 ? [x, -0.355, -0.18 + rn(i, 2) * 0.36] : sd === 1 ? [x, 0.37, -0.1 + rn(i, 4) * 0.2] : [x, y, -Math.sqrt(Math.max(0, 0.38 * 0.38 - y * y))];
          return <mesh key={i} position={pos as any} rotation={[rn(i, 9) * 3, rn(i, 10) * 3, 0]} scale={sm(0.6 + 0.6 * k[sd])}><octahedronGeometry args={[0.018 + 0.014 * rn(i, 11), 0]} /><meshStandardMaterial color="#f4f2ee" emissive="#ffe6c0" emissiveIntensity={0.05 + 0.7 * k[sd]} roughness={0.2} /></mesh>; })}</group>)}
      <group position={[0.05, -0.36, 0.08]}><Stickman escala={0.2} rotY={30} guion={[{ t: 0, accion: "parado", expr: "decidido" }, { t: aP, accion: "senalar", expr: "sorprendido" }] as any} semilla={60} contacto={0} color="#6a5a48" /></group>
      <Lantern p={[0.24, -0.36, 0.14]} s={1.1} on={0.8} />
      <pointLight position={[0.2, -0.1, 0.25]} intensity={1.4} distance={1.6} color="#ffc078" />
      <pointLight position={[0, 0.2, 0.4]} intensity={0.0001 + 0.6 * (k[0] + k[1] + k[2]) / 3} distance={2} color="#ffe6c0" />
    </>;
  }}</U3>;
};

// ---- CaballoRueda · en la cámara subterránea el caballo da vueltas al malacate; arriba, el agujerito de luz se va apagando ----
const CaballoRueda: React.FC<UP> = ({ d, p }) => {
  const aL = sec(p, "luz", 2.5);
  return <U3 d={d} bg={p.bg} ground={[150, 148, 140]} sky="#0a0806" mode="iris" key1={[-0.6, 2.2, 1.4]}
    cam={{ at: [0, 0.2, 0], az: [-0.45, -0.25], el: [0.3, 0.25], r: [1.5, 1.3], fov: 34 }}>{(tt) => {
    const an = tt * 0.5, light = 1 - 0.85 * eio(tt, aL, aL + 1.5);
    return <>
      <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.03, 0.04, 0.5, 14]} />{M.wood({ base: [110, 76, 44] })}</mesh>
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.12, 0.12, 0.05, 24]} />{M.wood({ base: [110, 76, 44] })}</mesh>
      <group rotation={[0, an, 0]}>
        <RBox s={[0.85, 0.025, 0.025]} r={0.008} p={[0.4, 0.3, 0]}>{M.wood({ base: [130, 92, 54] })}</RBox>
        <group position={[0.75, 0, 0]} rotation={[0, -PI / 2, 0]}>
          <group scale={0.55}>{/* caballo simple: cuerpo, cuello, cabeza, patas que se mueven */}
            <mesh position={[0, 0.42, 0]} scale={[1, 0.8, 1.7]}><sphereGeometry args={[0.13, 20, 14]} /><meshStandardMaterial color="#7a5a3a" roughness={0.8} /></mesh>
            <mesh position={[0, 0.56, 0.2]} rotation={[0.6, 0, 0]}><cylinderGeometry args={[0.05, 0.07, 0.22, 12]} /><meshStandardMaterial color="#7a5a3a" roughness={0.8} /></mesh>
            <mesh position={[0, 0.64, 0.3]} rotation={[1.3, 0, 0]} scale={[0.8, 1, 0.7]}><capsuleGeometry args={[0.04, 0.1, 6, 12]} /><meshStandardMaterial color="#7a5a3a" roughness={0.8} /></mesh>
            {[[-0.06, 0.15], [0.06, 0.15], [-0.06, -0.15], [0.06, -0.15]].map(([x, z], i) => <group key={i} position={[x, 0.36, z]} rotation={[0.35 * Math.sin(tt * 4 + i * PI / 2), 0, 0]}><mesh position={[0, -0.17, 0]}><cylinderGeometry args={[0.018, 0.015, 0.34, 8]} /><meshStandardMaterial color="#6a4a2e" /></mesh></group>)}
          </group>
        </group>
      </group>
      <Sh p={[0, 0, 0]} r={0.85} op={0.2} />
      <mesh position={[0, 2.2, -0.3]}><cylinderGeometry args={[0.06, 0.25, 3.6, 16, 1, true]} /><meshBasicMaterial color="#fff2d8" transparent opacity={0.12 * light} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      <spotLight position={[0, 3.5, -0.3]} angle={0.2} penumbra={0.5} intensity={14 * light} distance={5} color="#fff2d8" />
      <pointLight position={[0.6, 0.5, 0.6]} intensity={1.2} distance={2} color="#ffb870" />
    </>;
  }}</U3>;
};

// ---- GasTecho · la galería cortada al medio: el metano (una capa azul) se junta arriba y baja; el penitente avanza pegado al piso ----
const GasTecho: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "metano", 1.0), aE = sec(p, "explota", 3.0), D = d / 30;
  return <U3 d={d} bg={p.bg} ground={null} sky="#0a0806" mode="iris" key1={[0, 2, 1.4]}
    cam={{ at: [0, 0.28, 0], az: [-0.06, 0.06], el: [0.08, 0.06], r: [1.45, 1.3], fov: 34 }}>{(tt) => {
    const gas = eio(tt, aM, aE), flash = Math.exp(-Math.max(0, tt - aE) * 3) * (tt > aE ? 1 : 0), crawl = eio(tt, 0.2, D - 0.3);
    return <>
      <mesh position={[0, 0.3, -0.05]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.4, 0.4, 1.8, 40, 1, true, PI, PI]} /><meshStandardMaterial map={dirtT([150, 150, 146])} roughness={0.7} side={THREE.BackSide} /></mesh>
      <mesh position={[0, -0.005, 0.15]}><boxGeometry args={[1.8, 0.01, 0.4]} /><meshStandardMaterial map={dirtT([140, 138, 132])} roughness={1} /></mesh>
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[(i - 2) * 0.32 + 0.05 * Math.sin(tt * 0.8 + i), 0.66 - 0.18 * gas - 0.02 * i % 2, 0.05]} scale={[1, sm(0.5 + gas), 1]}>
        <sphereGeometry args={[0.24, 20, 12]} /><meshBasicMaterial color="#5a9ad8" transparent opacity={0.22 * gas} depthWrite={false} /></mesh>)}
      <group position={[lerp(-0.6, 0.1, crawl), 0.03, 0.12]} rotation={[0, 0, PI / 2]}><Stickman escala={0.11} rotY={-90} guion={[{ t: 0, accion: "quieto", expr: "nervioso" }] as any} semilla={102} contacto={0} color="#6a5038" /></group>
      <Sh p={[lerp(-0.6, 0.1, crawl), 0, 0.12]} r={0.1} sx={2} />
      <pointLight position={[0, 0.55, 0.1]} intensity={4 * flash} distance={2} color="#ff9a3a" />
      <pointLight position={[0.4, 0.2, 0.4]} intensity={1.0} distance={1.6} color="#ffc078" />
    </>;
  }}</U3>;
};

// ---- LlamaTecho · el penitente acostado levanta la vara; la antorcha toca el techo y una sábana de fuego corre por arriba ----
const LlamaTecho: React.FC<UP> = ({ d, p }) => {
  const aV = sec(p, "vara", 0.6), aQ = sec(p, "quemar", 1.8);
  return <U3 d={d} bg={p.bg} ground={null} sky="#0a0806" mode="iris" key1={[0, 2, 1.4]}
    cam={{ at: [0, 0.28, 0], az: [-0.4, -0.3], el: [0.1, 0.08], r: [1.3, 1.15], fov: 34 }}>{(tt) => {
    const up = eio(tt, aV, aV + 1.0), run = eio(tt, aQ, aQ + 1.6), fl = 0.85 + 0.15 * Math.sin(tt * 2 * PI * 1.8);
    return <>
      <mesh position={[0, 0.3, -0.05]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.4, 0.4, 1.8, 40, 1, true, PI, PI]} /><meshStandardMaterial map={dirtT([150, 150, 146])} roughness={0.7} side={THREE.BackSide} /></mesh>
      <mesh position={[0, -0.005, 0.15]}><boxGeometry args={[1.8, 0.01, 0.4]} /><meshStandardMaterial map={dirtT([140, 138, 132])} roughness={1} /></mesh>
      <group position={[-0.35, 0.03, 0.12]} rotation={[0, 0, PI / 2]}><Stickman escala={0.11} rotY={-90} guion={[{ t: 0, accion: "quieto", expr: "decidido" }] as any} semilla={103} contacto={0} color="#5a4a38" /></group>
      <group position={[-0.25, 0.05, 0.12]} rotation={[0, 0, lerp(-1.3, -0.35, up)]}>
        <mesh position={[0, 0.32, 0]}><cylinderGeometry args={[0.005, 0.006, 0.64, 8]} />{M.wood({ base: [130, 92, 54] })}</mesh>
        <mesh position={[0, 0.66, 0]} scale={[1, fl, 1]}><coneGeometry args={[0.02, 0.07, 10]} />{M.glow({ col: "#ffb050" })}</mesh>
      </group>
      {Array.from({ length: 18 }, (_, i) => { const x = -0.05 + i * 0.05, on = cl((run * 1.0 - i / 18) * 6);
        return <mesh key={i} position={[x, 0.66 - 0.02 * Math.sin(i), 0.05]} scale={[1, sm(on * fl * (0.7 + 0.3 * rn(i, 2))), 1]} rotation={[PI, 0, 0]}><coneGeometry args={[0.05, 0.12, 10]} />{M.glow({ col: i % 3 ? "#ff9a3a" : "#5aa0ff", op: 0.8 })}</mesh>; })}
      <pointLight position={[0.3, 0.55, 0.15]} intensity={4 * run * fl} distance={2} color="#ff9a3a" />
      <pointLight position={[-0.2, 0.4, 0.2]} intensity={1.2} distance={1.4} color="#ffc078" />
    </>;
  }}</U3>;
};

// ---- CapillaSal · la capilla tallada en sal: en «altares», «lámparas» y «estatuas» se prende cada parte, de a una ----
const CapillaSal: React.FC<UP> = ({ d, p }) => {
  const aA = sec(p, "altares", 0.8), aL = sec(p, "lamparas", 1.5), aS = sec(p, "estatuas", 2.2);
  const salt = <meshStandardMaterial color="#cfccc4" roughness={0.45} />;
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" sky="#0a0806" mode="iris" key1={[0, 2.4, 1.6]}
    cam={{ at: [0, 0.4, -0.3], az: [-0.12, 0.12], el: [0.12, 0.1], r: [1.6, 1.35], fov: 36 }}>{(tt) => {
    const kA = eio(tt, aA, aA + 0.6), kL = eio(tt, aL, aL + 0.8), kS = eio(tt, aS, aS + 0.6);
    return <>
      <mesh position={[0, 0.5, -0.8]}><boxGeometry args={[2.4, 1.2, 0.05]} /><meshStandardMaterial map={dirtT([170, 168, 160])} roughness={0.6} /></mesh>
      <group position={[0, 0, -0.55]}><RBox s={[0.5, 0.22, 0.2]} r={0.02} p={[0, 0.11, 0]}>{salt}</RBox><RBox s={[0.3, 0.4, 0.06]} r={0.02} p={[0, 0.42, -0.08]}>{salt}</RBox>
        <mesh position={[0, 0.4, -0.04]}><boxGeometry args={[0.02, 0.2, 0.01]} /><meshStandardMaterial color="#efe8d8" emissive="#ffe6b0" emissiveIntensity={kA} /></mesh>
        <mesh position={[0, 0.45, -0.04]}><boxGeometry args={[0.12, 0.02, 0.01]} /><meshStandardMaterial color="#efe8d8" emissive="#ffe6b0" emissiveIntensity={kA} /></mesh></group>
      {[-0.55, 0.55].map((x, i) => <group key={i} position={[x, 0.8, -0.3]}>
        <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.003, 0.003, 0.4, 6]} />{M.steel()}</mesh>
        {Array.from({ length: 8 }, (_, j) => <mesh key={j} position={[Math.cos(j * PI / 4) * 0.1, 0, Math.sin(j * PI / 4) * 0.1]}><octahedronGeometry args={[0.025, 0]} /><meshStandardMaterial color="#f4f2ee" emissive="#ffd890" emissiveIntensity={1.6 * kL} roughness={0.2} /></mesh>)}
        <pointLight position={[0, -0.05, 0]} intensity={1.6 * kL} distance={1.4} color="#ffd890" /></group>)}
      {[-0.4, 0.4].map((x, i) => <group key={i} position={[x, 0, -0.45]} scale={sm(pop(tt, aS + i * 0.2))}>
        <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.07, 0.08, 0.1, 20]} />{salt}</mesh>
        <mesh position={[0, 0.2, 0]} scale={[0.7, 1.6, 0.6]}><capsuleGeometry args={[0.05, 0.1, 6, 12]} />{salt}</mesh>
        <mesh position={[0, 0.34, 0]}><sphereGeometry args={[0.04, 16, 12]} />{salt}</mesh>
        <spotLight position={[0, 0.8, 0.4]} angle={0.3} penumbra={0.6} intensity={4 * kS} distance={1.5} color="#ffe6c0" /></group>)}
      <pointLight position={[0, 0.6, 0.4]} intensity={0.8} distance={2.4} color="#ffd8a0" />
    </>;
  }}</U3>;
};

// ======================= ÁFRICA · KIMBERLEY =======================

// torno que cambia de forma cada cuadro (se libera la geometría vieja)
const LatheDyn: React.FC<{ P: number[][]; children: React.ReactNode }> = ({ P, children }) => {
  const g = React.useMemo(() => new THREE.LatheGeometry(P.map(([r, y]) => new THREE.Vector2(r, y)), 48), [P.map((v) => v.join(",")).join(";")]);
  React.useEffect(() => () => g.dispose(), [g]);
  return <mesh geometry={g}>{children}</mesh>;
};

// ---- ColinaAgujero · la colina con diamantes se va comiendo: colina → pozo → agujero gigante, con los diggers como hormigas ----
const ColinaAgujero: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "colina", 0.6), aP = sec(p, "pozo", 2.0), aA = sec(p, "agujero", 3.2);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" sky="#c8b89a" mode="iris" key1={[-1.2, 3, 1.4]} backDim={0.35}
    cam={{ at: [0, 0.32, 0], az: [-0.34, -0.12], el: [0.22, 0.16], r: [2.3, 2.05], fov: 34 }}>{(tt) => {
    const k1 = eio(tt, aC + 0.4, aP + 0.4), k2 = eio(tt, aP + 0.2, aA + 1.4);
    return <>
      {Array.from({ length: 19 }, (_, i) => { const x = -0.9 + i * 0.1, u = x / 0.9, hill = 0.3 * Math.max(0, 1 - 1.5 * u * u), pit = 0.42 * Math.max(0, 1 - 1.6 * u * u), h = Math.max(0.06, 0.5 + hill * (1 - k1) - pit * k2);
        return <group key={i}>
          <mesh position={[x, h / 2, 0]}><boxGeometry args={[0.1, h, 0.6]} /><meshStandardMaterial map={dirtT([150 - (i % 3) * 6, 108, 70])} roughness={1} /></mesh>
          <mesh position={[x, h - 0.015, 0]}><boxGeometry args={[0.1, 0.03, 0.602]} /><meshStandardMaterial map={dirtT([176, 140, 96])} roughness={1} /></mesh>
          {i % 3 === 1 ? <group position={[x, h, 0.12]} scale={sm(pop(tt, aC + i * 0.05))}><Stickman escala={0.07} rotY={i < 9 ? 70 : -70} guion={[{ t: 0, accion: "empujar", expr: "decidido" }] as any} semilla={120 + i} contacto={0} color="#5a4a3a" /></group> : null}
        </group>; })}
      <directionalLight position={[1.5, 3, 2]} intensity={1.8} color="#ffe8c8" />
      <hemisphereLight args={["#e8dcc8", "#3a2a1a", 0.6]} />
    </>;
  }}</U3>;
};

// ---- ParcelasColumnas · el tablero: cuadraditos de tierra que bajan cada uno a su ritmo y quedan como columnas; en «caminos» se ven
// las pasarelas entre columnas y se derrumban ----
const ParcelasColumnas: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "parcelas", 0.5), aW = sec(p, "caminos", 3.0), G = 7;
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[-1.0, 2.8, 1.4]}
    cam={{ at: [0, -0.15, 0], az: [-0.5, -0.3], el: [0.6, 0.5], r: [1.9, 1.7], fov: 34 }}>{(tt) => <>
    {Array.from({ length: G * G }, (_, i) => { const x = (i % G - (G - 1) / 2) * 0.16, z = (Math.floor(i / G) - (G - 1) / 2) * 0.16, dep = 0.1 + 0.5 * rn(i, 1), k = eio(tt, aP + rn(i, 2) * 0.8, aP + 1.5 + rn(i, 3) * 1.5), top = -dep * k;
      return <group key={i}><mesh position={[x, (top - 0.65) / 2, z]} scale={[1, sm(top + 0.65), 1]}><boxGeometry args={[0.14, 1, 0.14]} /><meshStandardMaterial map={dirtT([150 - 30 * k, 110 - 10 * k, 80 + 30 * k])} roughness={1} /></mesh></group>; })}
    {Array.from({ length: 6 }, (_, i) => { const fall = eio(tt, aW + 0.8 + i * 0.2, aW + 1.3 + i * 0.2); return <RBox key={i} s={[0.03, 0.01, 0.95]} r={0.002} p={[(i - 2.5) * 0.16, -0.05 - 0.5 * fall, 0]} rot={[0, 0, fall * 0.8]}>{M.wood({ base: [150, 110, 70] })}</RBox>; })}
    <directionalLight position={[1.5, 3, 1]} intensity={1.6} color="#ffe8c8" />
  </>}</U3>;
};

// ---- TierraAzulBalde · el pico baja sobre la tierra azul; los terrones saltan al balde; el balde lleno sube por el cable ----
const TierraAzulBalde: React.FC<UP> = ({ d, p }) => {
  const aA = sec(p, "azul", 0.6), aS = sec(p, "suben", 2.8);
  return <U3 d={d} bg={p.bg} ground={[96, 108, 124]} mode="iris" key1={[-0.6, 2.2, 1.4]}
    cam={{ at: [0.05, 0.15, 0], az: [-0.35, -0.2], el: [0.24, 0.2], r: [1.0, 0.9], fov: 34 }}>{(tt) => {
    const cyc = Math.max(0, tt - aA) % 0.8 / 0.8, sw = tt > aA && tt < aS ? (cyc < 0.6 ? cyc / 0.6 : 1 - (cyc - 0.6) / 0.4) : 0, full = cl((tt - aA) / Math.max(0.5, aS - aA)), up = eio(tt, aS, aS + 1.4);
    return <>
      <mesh position={[0, 0.02, -0.1]} scale={[1, 0.3, 1]}><sphereGeometry args={[0.3, 24, 12, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial map={dirtT([84, 98, 116])} roughness={1} /></mesh>
      <group position={[-0.12, 0.3, 0.05]} rotation={[0, 0, lerp(0.9, -0.4, sw)]}>
        <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.008, 0.008, 0.3, 8]} />{M.wood()}</mesh>
        <mesh position={[0, -0.28, 0]} rotation={[0, 0, PI / 2]}><coneGeometry args={[0.012, 0.18, 8]} />{M.steel({ col: "#6a6e72" })}</mesh>
      </group>
      {Array.from({ length: 6 }, (_, i) => { const a = aA + 0.5 + i * 0.8, k = cl((tt - a) / 0.5); return tt > a && tt < aS ? <mesh key={i} position={[lerp(-0.1, 0.2, k), 0.06 + 0.12 * 4 * k * (1 - k), lerp(0, 0.1, k)]}><dodecahedronGeometry args={[0.018, 0]} /><meshStandardMaterial color="#5a6a80" roughness={1} /></mesh> : null; })}
      <group position={[0.2, up * 0.9, 0.1]}><Balde s={1.6} full={full} col="#5a6a80" /><Seg a={[0, 0.14, 0]} b={[0, 1.2, 0]} r={0.003}><meshStandardMaterial color="#3a3028" /></Seg></group>
      <Sh p={[0.2, 0, 0.1]} r={0.08} op={0.45 * (1 - up)} />
      <spotLight position={[0.2, 2, 1]} angle={0.4} penumbra={0.6} intensity={8} distance={3} color="#ffe8c8" />
    </>;
  }}</U3>;
};

// ---- PeligrosTres · el corte del agujero: en «cortaban» un cable se suelta y el balde cae; en «derrumbaban» se cae una pared;
// en «llovía» sube el agua barrosa ----
const PeligrosTres: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "cortaban", 0.5), aD = sec(p, "derrumbaban", 1.8), aL = sec(p, "llovia", 3.2);
  return <U3 d={d} bg={p.bg} ground={null} sky="#c8b89a" mode="iris" key1={[-1.2, 3, 1.4]}
    cam={{ at: [0, -0.3, 0], az: [-0.1, 0.05], el: [0.12, 0.1], r: [1.7, 1.55], fov: 34 }}>{(tt) => {
    const drop = cl((tt - aC) / 0.6), wall = eio(tt, aD, aD + 0.8), water = eio(tt, aL, aL + 2.5);
    return <>
      <mesh position={[0, -0.35, -0.25]}><boxGeometry args={[1.6, 0.7, 0.04]} /><meshStandardMaterial map={dirtT([150, 110, 76])} roughness={1} /></mesh>
      <mesh position={[-0.75, -0.35, 0]}><boxGeometry args={[0.1, 0.7, 0.5]} /><meshStandardMaterial map={dirtT([160, 116, 80])} roughness={1} /></mesh>
      <mesh position={[0, -0.7, 0]}><boxGeometry args={[1.6, 0.02, 0.5]} /><meshStandardMaterial map={dirtT([90, 104, 120])} roughness={1} /></mesh>
      <Seg a={[-0.3, 0.05, 0]} b={[-0.3, tt > aC ? -0.05 : -0.3, 0]} r={0.003}><meshStandardMaterial color="#3a3028" /></Seg>
      <group position={[-0.3, lerp(-0.36, -0.69, drop * drop), 0]} rotation={[0, 0, drop * 1.2]}><Balde s={1.3} /></group>
      <Polvo tt={tt} a={aC + 0.6} p={[-0.3, -0.69, 0]} s={1.2} />
      <group position={[0.68 - 0.15 * wall, -0.35 - 0.2 * wall, 0]} rotation={[0, 0, wall * 1.0]}><mesh><boxGeometry args={[0.16, 0.7, 0.5]} /><meshStandardMaterial map={dirtT([160, 116, 80])} roughness={1} /></mesh></group>
      <Polvo tt={tt} a={aD + 0.7} p={[0.45, -0.69, 0]} s={2} />
      <mesh position={[0, -0.69 + 0.25 * water, 0.02]}><boxGeometry args={[1.45, sm(0.5 * water), 0.46]} />{M.water({ op: 0.7, col: "#7a6a4a" })}</mesh>
      {Array.from({ length: 30 }, (_, i) => { const y = 0.3 - ((tt * 1.6 + rn(i, 1)) % 1) * 1.0; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 1.4, y, (rn(i, 3) - 0.5) * 0.4]} visible={tt > aL}><cylinderGeometry args={[0.002, 0.002, 0.05, 4]} /><meshBasicMaterial color="#cfe0f0" transparent opacity={0.6} /></mesh>; })}
      <directionalLight position={[1.5, 3, 1.5]} intensity={1.5} color="#ffe8c8" />
    </>;
  }}</U3>;
};

// ---- CableZumbido · el cable tenso vibra; en «agudo» la vibración se acelera y los hilos se van cortando de a uno ----
const CableZumbido: React.FC<UP> = ({ d, p }) => {
  const aZ = sec(p, "zumbaba", 0.5), aG = sec(p, "agudo", 2.4), N = 7, D = d / 30;
  return <U3 d={d} bg={p.bg} ground={null} sky="#c8b89a" mode="iris" key1={[-0.6, 2.4, 1.6]}
    cam={{ at: [0, 0.3, 0], az: [-0.25, -0.12], el: [0.1, 0.08], r: [0.9, 0.75], fov: 34 }}>{(tt) => {
    const f = tt > aG ? 1.9 : 0.9, amp = 0.012 * eio(tt, aZ, aZ + 0.5);
    return <>
      <mesh position={[-0.6, 0.3, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.03, 28]} />{M.wood({ base: [120, 84, 50] })}</mesh>
      {Array.from({ length: N }, (_, j) => { const an = j / N * 2 * PI, cut = j < Math.floor(eio(tt, aG + 0.4, D - 0.2) * 5), oy = Math.cos(an) * 0.007, oz = Math.sin(an) * 0.007;
        return <group key={j}>{Array.from({ length: 30 }, (_, i) => { const x = -0.6 + i * 0.04, env = Math.sin(PI * i / 29), vib = amp * env * Math.sin(tt * 2 * PI * f + i * 0.3);
          if (cut && Math.abs(x) < 0.04) return null;
          const curl = cut ? (x > 0 ? 1 : -1) * Math.max(0, 0.04 - Math.abs(x) + 0.08) * 0.6 : 0;
          return <mesh key={i} position={[x, 0.3 + oy + vib + curl * 0.3, oz]}><sphereGeometry args={[0.005, 6, 4]} />{M.steel({ col: "#8a8e92" })}</mesh>; })}</group>; })}
      {[0, 1, 2].map((i) => { const k = ((tt - aZ) * f * 0.7 + i / 3) % 1; return <mesh key={i} position={[0, 0.3, 0]} rotation={[0, PI / 2, 0]} scale={sm(0.4 + 1.6 * k)} visible={tt > aZ}><ringGeometry args={[0.05, 0.054, 32]} /><meshBasicMaterial color={tt > aG ? "#ff6a3a" : "#ffe6b0"} transparent opacity={0.5 * (1 - k)} depthWrite={false} side={THREE.DoubleSide} /></mesh>; })}
      <spotLight position={[0, 1.6, 0.8]} angle={0.4} penumbra={0.7} intensity={8} distance={3} color="#ffe8c8" />
    </>;
  }}</U3>;
};

// ---- BaldesArriba · desde el fondo, mirando para arriba: el cielo cruzado de cables y cien baldes llenos pasando sobre tu cabeza ----
const BaldesArriba: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "miras", 0.5);
  return <U3 d={d} bg={p.bg} ground={null} sky="#d8c8a8" mode="iris" key1={[0, 3, 0.4]}
    cam={{ at: [0, 1.2, -0.2], az: [-0.05, 0.05], el: [-0.9, -1.05], r: [1.1, 1.0], fov: 46 }}>{(tt) => <>
    <mesh position={[0, 1.6, 0]} rotation={[PI / 2, 0, 0]}><circleGeometry args={[2.6, 48]} /><meshBasicMaterial color="#f2e6cc" side={THREE.DoubleSide} /></mesh>
    {Array.from({ length: 12 }, (_, i) => { const an = i / 12 * PI, a = [Math.cos(an) * 1.6, 1.5, Math.sin(an) * 1.6 - 0.2], b = [-Math.cos(an) * 1.6, 1.5, -Math.sin(an) * 1.6 - 0.2];
      return <group key={i}><Seg a={a} b={b} r={0.004}><meshStandardMaterial color="#2a2420" /></Seg>
        {Array.from({ length: 5 }, (_, j) => { const u = ((tt - aM) * 0.08 * (i % 2 ? 1 : -1) + j / 5 + rn(i, 2)) % 1, uu = (u + 1) % 1;
          return <group key={j} position={[lerp(a[0], b[0], uu), 1.42, lerp(a[2], b[2], uu)]} visible={tt > aM - 0.2 + j * 0.15}><Balde s={1.1} col="#6a7a8a" /></group>; })}</group>; })}
    <directionalLight position={[0, 3, 0]} intensity={1.2} color="#fff2d8" />
    <pointLight position={[0, 0.6, 0]} intensity={1.2} distance={2} color="#ffe8c8" />
  </>}</U3>;
};

// ======================= ASIA · PERLAS DE BARÉIN =======================

// ---- PiedraPie · el pie del buzo en el borde del barco: en «pinza» aparece la pinza de hueso, en «piedra» se ata la piedra al tobillo ----
const PiedraPie: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "pinza", 0.6), aS = sec(p, "piedra", 1.8);
  return <U3 d={d} bg={p.bg} ground={null} sky="#7ab8e0" mode="iris" key1={[0.6, 3, 1.4]}
    cam={{ at: [0, 0.12, 0], az: [-0.3, -0.15], el: [0.22, 0.18], r: [0.95, 0.85], fov: 34 }}>{(tt) => {
    const tie = eio(tt, aS + 0.4, aS + 1.2);
    return <>
      <RBox s={[1.4, 0.05, 0.3]} r={0.01} p={[0, 0.0, -0.15]}>{M.wood({ base: [140, 100, 60], rx: 4 })}</RBox>
      <mesh position={[0, -0.15, 0.2]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[4, 4]} />{M.water({ op: 0.9, col: "#2a8ab8" })}</mesh>
      <group position={[0.0, 0.03, -0.1]}><Stickman escala={0.15} rotY={0} guion={[{ t: 0, accion: "sentarse", expr: "decidido" }, { t: aS + 1.4, accion: "sentarse", expr: "nervioso" }] as any} semilla={130} contacto={0} color="#8a5a3a" /></group>
      <group position={[-0.2, 0.36 + fallY(tt, aP, 0.4), 0.05]} visible={tt > aP - 0.3}><mesh rotation={[0, 0, PI / 2]}><torusGeometry args={[0.025, 0.006, 8, 20, PI]} /><meshStandardMaterial color="#d8c8a0" roughness={0.5} /></mesh></group>
      <group position={[0.06, lerp(0.02, -0.06, tie), 0.12]} visible={tt > aS - 0.3}>
        <group position={[0, fallY(tt, aS, 0.35), 0]}><mesh scale={[1, 0.7, 0.85]}><dodecahedronGeometry args={[0.05, 1]} /><meshStandardMaterial color="#8a8478" roughness={0.9} /></mesh></group>
        <Seg a={[0, 0.03, 0]} b={[0, 0.03 + 0.12 * tie, 0]} r={0.003}><meshStandardMaterial color="#c8a878" /></Seg></group>
      <spotLight position={[0.5, 2.4, 1]} angle={0.4} penumbra={0.6} intensity={10} distance={4} color="#fff2d8" />
    </>;
  }}</U3>;
};

// ---- BajadaFondo · el buzo cae vertical tirado por la piedra; los metros pasan en el tambor; llega al fondo con las ostras ----
const BajadaFondo: React.FC<UP> = ({ d, p }) => {
  const aF = sec(p, "fondo", 1.6), D = d / 30;
  return <U3 d={d} bg={p.bg} ground={null} sky="#0a3a5a" mode="iris" key1={[0.4, 3, 1]}
    cam={{ at: [0, 0.3, 0], az: [-0.2, -0.1], el: [0.05, 0.05], r: [1.2, 1.05], fov: 36 }}
    over={(tt) => <Drums v={Math.round(lerp(0, 20, eio(tt, 0.2, aF + 0.4)))} n={2} x={1600} y={140} s={1.2} unit="m" op={cl(tt * 2) * (1 - cl((tt - D + 0.8) * 2))} />}>{(tt) => {
    const fall = eio(tt, 0.2, aF + 0.4);
    return <>
      <mesh position={[0, -0.05, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[1.6, 40]} /><meshStandardMaterial color="#c8b890" roughness={1} /></mesh>
      {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.2, -0.04, (rn(i, 2) - 0.5) * 0.8]} rotation={[0, rn(i, 3) * 3, 0]} scale={[1, 0.4, 0.8]}><sphereGeometry args={[0.035, 12, 8]} /><meshStandardMaterial color="#6a6458" roughness={0.9} /></mesh>)}
      <group position={[0, lerp(1.6, 0.03, fall), 0]}>
        <mesh position={[0, -0.04, 0]} scale={[1, 0.7, 0.85]}><dodecahedronGeometry args={[0.04, 1]} /><meshStandardMaterial color="#8a8478" roughness={0.9} /></mesh>
        <group position={[0, 0.0, 0]} rotation={[0, 0, PI]}><group position={[0, -0.32, 0]}><Stickman escala={0.13} rotY={0} guion={[{ t: 0, accion: "quieto", expr: "decidido" }] as any} semilla={131} contacto={0} color="#8a5a3a" /></group></group>
        {Array.from({ length: 6 }, (_, i) => { const k = ((tt * 0.8 + i / 6) % 1); return <mesh key={i} position={[0.03 * Math.sin(i * 2), 0.35 + k * 0.5, 0]}><sphereGeometry args={[0.008 + 0.006 * rn(i, 4), 8, 6]} /><meshBasicMaterial color="#d8f0ff" transparent opacity={0.5 * (1 - k)} depthWrite={false} /></mesh>; })}
      </group>
      <Seg a={[0.05, 2.4, 0]} b={[0.05, lerp(1.9, 0.36, fall), 0]} r={0.003}><meshStandardMaterial color="#c8a878" /></Seg>
      <directionalLight position={[0, 4, 0.5]} intensity={1.2} color="#8ad0f0" />
      <pointLight position={[0, 0.5, 0.5]} intensity={1.0} distance={2} color="#9ad8f0" />
    </>;
  }}</U3>;
};

// ---- CanastaCuerda · en el fondo, la canasta del cuello se llena de ostras; en «cuerda» da dos tirones y sale disparado para arriba ----
const CanastaCuerda: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "canasta", 0.4), aT = sec(p, "cuerda", 2.2), D = d / 30;
  return <U3 d={d} bg={p.bg} ground={null} sky="#0a3a5a" mode="iris" key1={[0.4, 3, 1]}
    cam={{ at: [0, 0.2, 0], az: [-0.3, -0.18], el: [0.1, 0.08], r: [1.0, 0.9], fov: 34 }}>{(tt) => {
    const n = Math.floor(cl((tt - aC) / Math.max(0.5, aT - aC)) * 8), tug = tt > aT && tt < aT + 0.8 ? Math.abs(Math.sin((tt - aT) * 2 * PI * 2.5)) : 0, up = eio(tt, aT + 0.9, Math.min(D - 0.2, aT + 1.8));
    return <>
      <mesh position={[0, -0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[1.4, 40]} /><meshStandardMaterial color="#c8b890" roughness={1} /></mesh>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.9, 0.012, (rn(i, 2) - 0.3) * 0.5]} rotation={[0, rn(i, 3) * 3, 0]} scale={[1, 0.4, 0.8]} visible={i >= n}><sphereGeometry args={[0.035, 12, 8]} /><meshStandardMaterial color="#6a6458" roughness={0.9} /></mesh>)}
      <group position={[0, 1.2 * up * up, 0]}>
        <group position={[0, 0.0, 0]}><Stickman escala={0.14} rotY={10} guion={[{ t: 0, accion: "empujar", expr: "decidido" }, { t: aT, accion: "manos_cabeza", expr: "asustado" }] as any} semilla={132} contacto={0} color="#8a5a3a" /></group>
        <group position={[0.08, 0.16, 0.08]}>
          <mesh geometry={latheG("canasta", [[0.02, 0], [0.05, 0.01], [0.06, 0.06], [0.055, 0.07]], 18)}><meshStandardMaterial color="#b89a68" roughness={1} side={THREE.DoubleSide} wireframe /></mesh>
          {Array.from({ length: n }, (_, i) => <mesh key={i} position={[(rn(i, 5) - 0.5) * 0.05, 0.02 + i * 0.006, (rn(i, 6) - 0.5) * 0.05]} scale={[1, 0.4, 0.8]}><sphereGeometry args={[0.018, 10, 6]} /><meshStandardMaterial color="#6a6458" roughness={0.9} /></mesh>)}
        </group>
      </group>
      <Seg a={[-0.06, 0.3 + 1.2 * up * up - 0.03 * tug, 0]} b={[-0.06, 2.4, 0]} r={0.003}><meshStandardMaterial color="#c8a878" /></Seg>
      <Sh p={[0, 0, 0]} r={0.1} op={0.45 * (1 - up)} />
      <directionalLight position={[0, 4, 0.5]} intensity={1.2} color="#8ad0f0" />
      <pointLight position={[0, 0.5, 0.5]} intensity={1.0} distance={2} color="#9ad8f0" />
    </>;
  }}</U3>;
};

// ---- PerlaCultivada · una perla natural sola en su concha; en «Japón» aparece una bandeja de perlas idénticas que se multiplica,
// y en «derrumbó» la concha de la natural se cierra y se apaga ----
const PerlaCultivada: React.FC<UP> = ({ d, p }) => {
  const aJ = sec(p, "japon", 0.6), aD = sec(p, "derrumbo", 2.8);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[-0.8, 2.4, 1.6]}
    cam={{ at: [-0.02, 0.08, 0], az: [-0.2, -0.06], el: [0.3, 0.24], r: [0.85, 0.75], fov: 34 }}>{(tt) => {
    const close = eio(tt, aD, aD + 0.8);
    return <>
      <group position={[-0.24, 0, 0.05]}>
        <mesh scale={[1, 0.3, 0.9]}><sphereGeometry args={[0.1, 24, 12, 0, 2 * PI, PI / 2, PI / 2]} /><meshStandardMaterial color="#7a6e60" roughness={0.6} side={THREE.DoubleSide} /></mesh>
        <group rotation={[0, 0, 0]} position={[0, 0.0, -0.08]}><group rotation={[lerp(-1.3, -0.05, close), 0, 0]}><mesh position={[0, 0, 0.08]} scale={[1, 0.3, 0.9]}><sphereGeometry args={[0.1, 24, 12, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial color="#6a6052" roughness={0.7} side={THREE.DoubleSide} /></mesh></group></group>
        <mesh position={[0, 0.015, 0]} scale={[1, 0.92, 1.05]}><sphereGeometry args={[0.025, 24, 16]} />{M.porcelain({ col: "#f6f0e6" })}</mesh>
        <pointLight position={[0, 0.15, 0.1]} intensity={0.0001 + 0.5 * (1 - close)} distance={0.6} color="#fff6e8" />
        <Sh p={[0, -0.03, 0]} r={0.11} />
      </group>
      <group position={[0.2, 0, 0]}>
        <RBox s={[0.36, 0.02, 0.28]} r={0.006} p={[0, 0.0, 0]}>{M.wood({ base: [90, 50, 30] })}</RBox>
        {Array.from({ length: 48 }, (_, i) => { const a = aJ + 0.3 + i * 0.03; return <mesh key={i} position={[-0.15 + (i % 8) * 0.043, 0.025, -0.11 + Math.floor(i / 8) * 0.043]} scale={sm(pop(tt, a) * 0.018)}><sphereGeometry args={[1, 16, 12]} />{M.porcelain({ col: "#f6f2ea" })}</mesh>; })}
        <Sh p={[0, -0.01, 0]} r={0.22} sx={1.2} />
      </group>
      <spotLight position={[0, 1.8, 0.8]} angle={0.4} penumbra={0.7} intensity={4} distance={3} color="#fff2d8" />
      {Array.from({ length: 8 }, (_, i) => { const c = eio(tt, aD + i * 0.05, aD + 0.6 + i * 0.05); return <Coin key={"c" + i} p={[lerp(-0.04, -0.04 + (rn(i, 1) - 0.5) * 0.3, c), lerp(0.006 + i * 0.012, 0.006, c), lerp(0.17, 0.17 + (rn(i, 2) - 0.2) * 0.2, c)]} r={0.03} />; })}
    </>;
  }}</U3>;
};

// ---- PetroleoTorre · en la arena junto al mar se levanta la torre de madera y en «petróleo» brota el chorro negro ----
const PetroleoTorre: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "petroleo", 1.2);
  return <U3 d={d} bg={p.bg} ground={[210, 190, 150]} sky="#e8d8b0" mode="iris" key1={[-1, 3, 1.4]}
    cam={{ at: [0, 0.4, 0], az: [-0.3, -0.15], el: [0.12, 0.1], r: [1.6, 1.4], fov: 34 }}>{(tt) => {
    const up = eio(tt, 0.2, aP), gush = eio(tt, aP, aP + 0.6);
    return <>
      <group scale={[1, sm(up), 1]}>
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <Seg key={i} a={[x * 0.16, 0, z * 0.16]} b={[x * 0.03, 0.8, z * 0.03]} r={0.008}>{M.wood({ base: [120, 84, 50] })}</Seg>)}
        {[0.2, 0.4, 0.6].map((y, i) => { const w = 0.16 - y * 0.16; return <group key={i}>{[0, 1, 2, 3].map((s) => <RBox key={s} s={[2 * w + 0.02, 0.012, 0.012]} r={0.003} p={[s < 2 ? 0 : (s === 2 ? -w : w), y, s < 2 ? (s ? w : -w) : 0]} rot={[0, s < 2 ? 0 : PI / 2, 0]}>{M.wood({ base: [120, 84, 50] })}</RBox>)}</group>; })}
      </group>
      {Array.from({ length: 24 }, (_, i) => { const k = ((tt - aP) * 0.9 + i / 24) % 1, h = 0.9 * gush; return <mesh key={i} position={[Math.sin(k * 5 + i) * 0.1 * k, k * h * 1.1, Math.cos(k * 4 + i) * 0.1 * k]} scale={sm(gush * (0.03 + 0.04 * k))} visible={tt > aP}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#120c08" roughness={0.2} metalness={0.3} /></mesh>; })}
      <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]} scale={sm(0.2 + gush * Math.min(1, (tt - aP) * 0.3))}><circleGeometry args={[0.4, 32]} /><meshStandardMaterial color="#120c08" roughness={0.15} /></mesh>
      <mesh position={[0, 0.001, -2.2]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[8, 2.5]} />{M.water({ op: 0.9, col: "#3a9ac8" })}</mesh>
      <Sh p={[0, 0, 0]} r={0.22} />
      <directionalLight position={[1.5, 3, 1]} intensity={1.8} color="#fff0d0" />
    </>;
  }}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { GranAgujeroSogas, SieteGlobo, ParedSal, CaballoRueda, GasTecho, LlamaTecho, CapillaSal, ColinaAgujero, ParcelasColumnas, TierraAzulBalde, PeligrosTres, CableZumbido, BaldesArriba, PiedraPie, BajadaFondo, CanastaCuerda, PerlaCultivada, PetroleoTorre };
