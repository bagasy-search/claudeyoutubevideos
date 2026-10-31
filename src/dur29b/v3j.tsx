// dur29b · vuelta 7 del EVALUADOR: rediseño de los 6 que no pasaban de 7 tras varias vueltas (cada uno ocupa un minuto sin otro
// componente). Regla: un objeto grande y centrado, nada se va del cuadro, movimiento desde el primer cuadro, sin locomoción del Stickman.
import React from "react";
import { M, RBox, cl, eio, lerp, rn } from "./h3d";
import { U3, sec } from "./k3";
import { latheG } from "./kb";
import { Escudo } from "./v3e";
import { Casco } from "./v3a";
import { Polvo, Reloj, Sh } from "./v3i";
import { Stickman } from "../stickman3d";

type UP = { d: number; p: any };
const PI = Math.PI;
const sm = (v: number) => Math.max(0.001, v);
// caída con peso: entra desde h arriba, golpea y rebota una vez
const drop = (tt: number, a: number, h = 0.3) => { const k = cl((tt - a) / 0.32); return k < 1 ? h * (1 - k * k) : 0.025 * Math.max(0, Math.sin(PI * cl((tt - a - 0.32) / 0.22))); };

// ---- ConElSobreEl · el escudo de bronce grande parado de frente, girando lento con su brillo; en «sobre» se acuesta como camilla,
// el caído queda encima y dos compañeros lo levantan del suelo ----
const ConElSobreEl: React.FC<UP> = ({ d, p }) => {
  const aS = sec(p, "sobre", 1.8);
  return <U3 d={d} bg={p.bg} ground={[176, 150, 110]} mode="iris" key1={[-1.2, 2.6, 1.8]}
    cam={{ at: [0, 0.2, 0], az: [-0.35, -0.2], el: [0.26, 0.32], r: [1.45, 1.35], fov: 34 }}>{(tt) => {
    const lay = eio(tt, aS - 0.5, aS + 0.3), lift = eio(tt, aS + 0.8, aS + 1.8), spin = (1 - lay) * 0.5 * Math.sin(tt * 0.9);
    const y = lerp(0.34, 0.12, lay) + 0.14 * lift;
    return <>
      <group position={[0, y, 0]} rotation={[-PI / 2 * lay, spin, 0]}><group rotation={[PI / 2, 0, 0]} scale={1.6}><Escudo r={0.2} /></group></group>
      <Sh p={[0, 0, 0]} r={0.3} sx={1.2} op={0.3 + 0.2 * lay} />
      <Polvo tt={tt} a={aS + 0.3} p={[0, 0, 0]} s={2.0} />
      <group position={[-0.14, y + 0.04, 0]} rotation={[0, 0, -PI / 2]} scale={sm(eio(tt, aS, aS + 0.3))}><Stickman escala={0.12} rotY={0} guion={[{ t: 0, accion: "quieto", expr: "dormido" }] as any} semilla={61} contacto={0} /></group>
      {[-1, 1].map((s, i) => <group key={i} position={[s * 0.42, 0, 0.05]}>
        <Stickman escala={0.14} rotY={s > 0 ? -90 : 90} guion={[{ t: 0, accion: "parado", expr: "triste" }, { t: aS + 0.6, accion: "cargar_caja", expr: "decidido" }] as any} semilla={62 + i} contacto={0} color="#8a3a2a" />
        <Sh p={[0, 0, 0]} r={0.07} /></group>)}
      <spotLight position={[0.3, 2.2, 1.2]} angle={0.45} penumbra={0.7} intensity={10} distance={4} color="#ffe2b8" />
      <hemisphereLight args={["#e8dcc8", "#4a3a2a", 0.6]} />
    </>;
  }}</U3>;
};

// ---- TamborArvejas · el tambor de cerca: el mazo lo golpea desde abajo y cada arveja salta alto, a su ritmo, con su sombra;
// en el cuenco de al lado el agua hace anillos con cada golpe ----
const TamborArvejas: React.FC<UP> = ({ d, p }) => {
  const aS = Math.min(sec(p, "saltaban", 2.4), 0.3), B = 0.6;
  return <U3 d={d} bg={p.bg} ground={[136, 100, 66]} mode="iris" key1={[-0.6, 2.2, 1.4]}
    cam={{ at: [0.08, 0.2, 0], az: [-0.32, -0.16], el: [0.32, 0.28], r: [0.92, 0.84], fov: 34 }}>{(tt) => {
    const ph = Math.max(0, tt - aS) / B, cyc = ph % 1, on = tt > aS ? 1 : 0, hit = on * Math.max(0, 1 - cyc * 4);
    return <>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.16, 0.16, 0.14, 40]} /><meshStandardMaterial color="#8a3a22" roughness={0.6} /></mesh>
      <mesh position={[0, 0.141, 0]} rotation={[-PI / 2, 0, 0]} scale={[1, 1, 1 - 0.03 * hit]}><circleGeometry args={[0.158, 40]} /><meshStandardMaterial color="#e8dcc0" roughness={0.8} /></mesh>
      {[0.01, 0.13].map((y, i) => <mesh key={i} position={[0, y, 0]}><torusGeometry args={[0.162, 0.008, 8, 40]} />{M.brass({ col: "#a87a30" })}</mesh>)}
      <group position={[-0.2, 0.08, 0.06]} rotation={[0, 0, -0.9 + 0.5 * hit]}><mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.007, 0.009, 0.18, 8]} />{M.wood({ base: [170, 130, 80] })}</mesh>
        <mesh position={[0, 0.17, 0]}><sphereGeometry args={[0.025, 12, 10]} /><meshStandardMaterial color="#d8ccb0" roughness={0.9} /></mesh></group>
      <Sh p={[0, 0, 0]} r={0.2} />
      {Array.from({ length: 9 }, (_, i) => { const a = rn(i, 1) * 2 * PI, r = 0.03 + 0.1 * rn(i, 2), c = (ph + rn(i, 3) * 0.5) % 1, h = on * 4 * c * (1 - c) * (0.2 + 0.12 * rn(i, 4));
        return <group key={i}>
          <mesh position={[Math.cos(a) * r, 0.176 + h, Math.sin(a) * r]}><sphereGeometry args={[0.03, 14, 10]} /><meshStandardMaterial color="#6aae42" roughness={0.45} /></mesh>
          <mesh position={[Math.cos(a) * r, 0.143, Math.sin(a) * r]} rotation={[-PI / 2, 0, 0]} scale={sm(1 - 2.5 * h)}><circleGeometry args={[0.028, 16]} /><meshBasicMaterial color="#000" transparent opacity={0.35} depthWrite={false} /></mesh>
        </group>; })}
      <group position={[0.36, 0, 0.1]}>
        <mesh geometry={latheG("cuenco_j", [[0, 0], [0.07, 0], [0.1, 0.04], [0.105, 0.06], [0.095, 0.06], [0.085, 0.04], [0.06, 0.008], [0, 0.008]], 32)}>{M.porcelain({ col: "#d8ccb8" })}</mesh>
        <mesh position={[0, 0.045, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.088, 32]} />{M.water({ op: 0.75, col: "#4a7a8a" })}</mesh>
        {[0, 0.33, 0.66].map((o, j) => { const c = (cyc + o) % 1; return <mesh key={j} position={[0, 0.047, 0]} rotation={[-PI / 2, 0, 0]} scale={sm(0.1 + 0.9 * c)}><ringGeometry args={[0.078, 0.086, 32]} /><meshBasicMaterial color="#f0f8fc" transparent opacity={0.8 * on * (1 - c)} depthWrite={false} /></mesh>; })}
        <Sh p={[0, 0, 0]} r={0.11} />
      </group>
      <spotLight position={[-0.3, 1.4, 0.6]} angle={0.4} penumbra={0.7} intensity={8} distance={3} color="#ffe2b8" />
      <hemisphereLight args={["#e8dcc8", "#3a2a1a", 0.5]} />
    </>;
  }}</U3>;
};

// ---- TamborOrdenes · el tambor de órdenes adelante a la derecha, los palillos golpean; la fila de cinco soldados avanza un paso
// con cada golpe, de izquierda a derecha, sin salir del cuadro ----
const TamborOrdenes: React.FC<UP> = ({ d, p }) => {
  const aR = Math.min(sec(p, "radio", 0.4), 0.6), B = 0.8, D = d / 30;
  return <U3 d={d} bg={p.bg} ground={[150, 132, 100]} mode="iris" key1={[-1.0, 2.4, 1.6]}
    cam={{ at: [0, 0.2, 0], az: [-0.22, -0.1], el: [0.16, 0.14], r: [1.4, 1.3], fov: 34 }}>{(tt) => {
    const ph = Math.max(0, tt - aR) / B, cyc = ph % 1, n = Math.floor(ph), stick = Math.abs(Math.sin(cyc * PI)), beats = Math.max(1, (D - aR) / B);
    const adv = 0.5 * cl((n + eio(cyc, 0, 0.35)) / beats), bob = 0.012 * Math.abs(Math.sin(cyc * PI));
    return <>
      <group position={[0.5, 0, 0.32]}>
        <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.13, 0.13, 0.2, 36]} /><meshStandardMaterial color="#2a4a7a" roughness={0.6} /></mesh>
        <mesh position={[0, 0.261, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.128, 36]} /><meshStandardMaterial color="#efe6d0" /></mesh>
        {[0.07, 0.25].map((y, i) => <mesh key={i} position={[0, y, 0]}><torusGeometry args={[0.132, 0.007, 8, 36]} />{M.brass()}</mesh>)}
        {[-1, 1].map((s, i) => <group key={i} position={[s * 0.05, 0.27, 0.06]} rotation={[0.2 + 0.9 * (i ? 1 - stick : stick), 0, s * 0.2]}><mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.006, 0.008, 0.17, 8]} />{M.wood({ base: [180, 140, 90] })}</mesh></group>)}
        <Sh p={[0, 0, 0]} r={0.16} />
      </group>
      {Array.from({ length: 5 }, (_, i) => { const x = -0.12 - i * 0.15 + adv; return <group key={i} position={[x, bob * ((i + n) % 2 ? 1 : 0.4), -0.08]}>
        <Stickman escala={0.14} rotY={90} guion={[{ t: 0, accion: "parado", expr: "decidido" }] as any} semilla={80 + i} contacto={0} color="#c83a2a" />
        <Sh p={[0, -bob, 0]} r={0.06} /></group>; })}
      <spotLight position={[0, 2.4, 1.2]} angle={0.5} penumbra={0.7} intensity={9} distance={4} color="#ffe6c0" />
      <hemisphereLight args={["#e8dcc8", "#3a2a1a", 0.5]} />
    </>;
  }}</U3>;
};

// ---- TodoLoDemas · la mesa de campaña de frente y el muñeco al costado (nunca tapado): carga el saco, llega la olla grande y el
// balde; desde la olla friega con el cepillo y la espuma queda adentro ----
const TodoLoDemas: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "cargar", 0.4), aM = sec(p, "comida", 2.0), aB = sec(p, "baldes", 3.4);
  return <U3 d={d} bg={p.bg} ground={[140, 112, 80]} mode="iris" key1={[-0.8, 2.4, 1.6]}
    cam={{ at: [0.08, 0.26, 0], az: [-0.22, -0.12], el: [0.2, 0.16], r: [1.2, 1.1], fov: 34 }}>{(tt) => {
    const aF = aM + 0.4, rub = tt > aF ? Math.sin(tt * 2 * PI * 1.5) : 0, foam = eio(tt, aF, aF + 0.8);
    return <>
      <RBox s={[0.7, 0.03, 0.36]} r={0.01} p={[0, 0.22, 0]}>{M.wood({ base: [130, 92, 54] })}</RBox>
      {[[-0.31, -0.14], [0.31, -0.14], [-0.31, 0.14], [0.31, 0.14]].map(([x, z], i) => <mesh key={i} position={[x, 0.11, z]}><cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />{M.wood({ base: [110, 76, 44] })}</mesh>)}
      <Sh p={[0, 0, 0]} r={0.38} sx={1.1} op={0.35} />
      <group position={[-0.24, 0.235 + drop(tt, aC), -0.04]} visible={tt > aC - 0.05}><RBox s={[0.14, 0.16, 0.1]} r={0.04} p={[0, 0.08, 0]}><meshStandardMaterial color="#b89a6a" roughness={1} /></RBox></group>
      <group position={[0, 0.235 + drop(tt, aM), 0.02]} scale={2.3} visible={tt > aM - 0.05}>
        <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.09, 0.08, 0.1, 28, 1, true]} />{M.steel({ col: "#6a6e72" })}</mesh>
        <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.08, 28]} />{M.steel({ col: "#4a4e52" })}</mesh>
        {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.12, 0.085 + rn(i, 2) * 0.015, (rn(i, 3) - 0.5) * 0.12]} scale={sm(0.016 * foam * (0.6 + rn(i, 4)))}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#ffffff" roughness={0.3} /></mesh>)}
        <group position={[0.03 * rub, 0.1, 0.01 * rub]} visible={tt > aF}><RBox s={[0.06, 0.018, 0.035]} r={0.006}><meshStandardMaterial color="#c8a060" roughness={1} /></RBox>
          <mesh position={[0, 0.02, 0]}><boxGeometry args={[0.05, 0.02, 0.025]} /><meshStandardMaterial color="#5a3a20" /></mesh></group>
      </group>
      <group position={[0.24, 0.235 + drop(tt, aB), -0.05]} visible={tt > aB - 0.05}><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.07, 0.055, 0.14, 24, 1, true]} />{M.wood({ base: [120, 84, 50] })}</mesh>
        <mesh position={[0, 0.11, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.066, 24]} />{M.water({ op: 0.7 })}</mesh></group>
      <group position={[0.5, 0, 0.05]}><Stickman escala={0.16} rotY={-70} guion={[{ t: 0, accion: "cargar_caja", expr: "decidido" }, { t: aM, accion: "empujar", expr: "decidido" }] as any} semilla={92} contacto={0} /></group>
      <Sh p={[0.5, 0, 0.05]} r={0.08} />
      <spotLight position={[0.2, 2.2, 1.0]} angle={0.42} penumbra={0.7} intensity={10} distance={4} color="#ffe6c0" />
      <hemisphereLight args={["#e8dcc8", "#3a2a1a", 0.5]} />
    </>;
  }}</U3>;
};

// ---- CuerdasTiempo · el ranking como cinco objetos grandes sobre un tablón: casco, pala, arco, cuenco y pico; el casco ya está,
// los demás caen de a uno con peso y polvo, cada uno bajo su luz ----
const CuerdasTiempo: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, sp = Math.max(0.5, (D - 1.4) / 5);
  const Obj = ({ i }: { i: number }) => i === 0 ? <group scale={1.1}><Casco i={1} /></group>
    : i === 1 ? <group rotation={[0, 0, 0.5]}><mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />{M.wood()}</mesh><RBox s={[0.08, 0.1, 0.01]} r={0.01} p={[0, 0.0, 0]}>{M.steel({ col: "#8a8e92" })}</RBox></group>
    : i === 2 ? <group position={[0, 0.11, 0]}><mesh><torusGeometry args={[0.1, 0.008, 8, 32, PI]} />{M.wood({ base: [150, 100, 50] })}</mesh><mesh><boxGeometry args={[0.2, 0.003, 0.003]} /><meshStandardMaterial color="#efe6d0" /></mesh></group>
    : i === 3 ? <mesh geometry={latheG("cuenco_rj", [[0, 0], [0.06, 0], [0.09, 0.04], [0.092, 0.06], [0.08, 0.06], [0.07, 0.04], [0.05, 0.008], [0, 0.008]], 32)}>{M.wood({ base: [150, 100, 60] })}</mesh>
    : <group rotation={[0, 0, -0.25]}><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />{M.wood()}</mesh><mesh position={[0, 0.2, 0]} rotation={[0, 0, PI / 2]}><coneGeometry args={[0.012, 0.18, 8]} />{M.steel({ col: "#7a7e82" })}</mesh></group>;
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" key1={[-1.0, 2.6, 2.0]}
    cam={{ at: [0, 0.32, 0], az: [-0.14, 0.06], el: [0.16, 0.14], r: [1.65, 1.55], fov: 34 }}>{(tt) => <>
    <RBox s={[1.65, 0.05, 0.34]} r={0.01} p={[0, 0.16, 0]}>{M.wood({ base: [150, 106, 62] })}</RBox>
    {[-0.75, 0.75].map((x) => <RBox key={x} s={[0.06, 0.14, 0.3]} r={0.01} p={[x, 0.07, 0]}>{M.wood({ base: [120, 84, 48] })}</RBox>)}
    <Sh p={[0, 0, 0]} r={0.5} sx={1.9} op={0.3} />
    {Array.from({ length: 5 }, (_, i) => { const x = -0.6 + i * 0.3, a = i === 0 ? -1 : 0.2 + i * sp;
      return <group key={i}>
        <group position={[x, 0.185 + drop(tt, a, 0.28), 0]} visible={tt > a - 0.05}><group scale={1.6}><Obj i={i} /></group></group>
        <Polvo tt={tt} a={a + 0.32} p={[x, 0.19, 0]} s={0.9} />
        <pointLight position={[x, 0.8, 0.4]} intensity={0.0001 + 1.1 * eio(tt, a, a + 0.4)} distance={1.0} color="#ffd8a0" />
      </group>; })}
    <hemisphereLight args={["#e8dcc8", "#3a2a1a", 0.65]} />
  </>}</U3>;
};

// ---- TiraTiempo · el reloj de arena grande a la izquierda que se vacía; a la derecha los libros de los años caen de a uno con peso
// y arman una pila que nunca sale del cuadro ----
const TiraTiempo: React.FC<UP> = ({ d, p }) => {
  const aA = sec(p, "años", 2.6), D = d / 30, N = 8;
  const col = ["#b83a2a", "#2a4a7a", "#3a6a3a", "#8a5a2a", "#6a2a5a", "#b8862a", "#2a5a6a", "#7a2a2a"];
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" key1={[-0.6, 2.4, 1.8]}
    cam={{ at: [0, 0.3, 0], az: [-0.12, -0.04], el: [0.12, 0.1], r: [1.45, 1.38], fov: 34 }}>{(tt) => {
    const k = eio(tt, 0.3, D - 0.4), t0 = Math.min(aA - 1.0, 0.4), stp = Math.max(0.25, (D - t0 - 0.6) / N);
    return <>
      <group position={[-0.28, 0, 0]}><Reloj k={k} s={2.0} /></group>
      <Sh p={[-0.28, 0, 0]} r={0.24} />
      {Array.from({ length: N }, (_, i) => { const a = t0 + i * stp;
        return <group key={i} position={[0.26 + 0.012 * Math.sin(i * 1.7), 0.03 + i * 0.06 + drop(tt, a, 0.25), 0]} rotation={[0, 0.18 * Math.sin(i * 2.3), 0]} visible={tt > a - 0.05}>
          <RBox s={[0.28, 0.058, 0.2]} r={0.008}><meshStandardMaterial color="#efeae0" roughness={0.9} /></RBox>
          <RBox s={[0.285, 0.06, 0.012]} r={0.004} p={[0, 0, -0.1]}><meshStandardMaterial color={col[i]} roughness={0.7} /></RBox>
          <RBox s={[0.012, 0.06, 0.205]} r={0.004} p={[-0.14, 0, 0]}><meshStandardMaterial color={col[i]} roughness={0.7} /></RBox></group>; })}
      <Sh p={[0.26, 0, 0]} r={0.18} />
      <spotLight position={[0, 2.2, 1.0]} angle={0.42} penumbra={0.7} intensity={10} distance={4} color="#ffe6c0" />
      <hemisphereLight args={["#e8dcc8", "#3a2a1a", 0.55]} />
    </>;
  }}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { ConElSobreEl, TamborArvejas, TamborOrdenes, TodoLoDemas, CuerdasTiempo, TiraTiempo };
