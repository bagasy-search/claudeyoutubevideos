// dur29b · vuelta 3 del EVALUADOR (tope): versiones SIMPLES de los 17 que no llegaron a 8. Regla de cada una: UN objeto grande,
// entero dentro del cuadro con aire alrededor, sombra de contacto, un solo mecanismo, nada de texto. Reemplazan vía OVR (uniq.tsx).
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Horse, fallY, latheG, pop } from "./kb";
import { Casco } from "./v3a";
import { Obj5 } from "./v3f";
import { Stickman } from "../stickman3d";

type UP = { d: number; p: any };
const PI = Math.PI;
const sm = (v: number) => Math.max(0.001, v);

// ---------- piezas ----------
export const Sh: React.FC<{ p: number[]; r: number; sx?: number; op?: number }> = ({ p, r, sx = 1, op = 0.45 }) =>
  <mesh position={[p[0], p[1] + 0.002, p[2]]} rotation={[-PI / 2, 0, 0]} scale={[sx, 1, 1]}><circleGeometry args={[r, 32]} /><meshBasicMaterial color="#000" transparent opacity={op} depthWrite={false} /></mesh>;
// polvo: una corona de bolitas que se abre y se apaga desde el instante a
export const Polvo: React.FC<{ tt: number; a: number; p: number[]; s?: number; col?: string }> = ({ tt, a, p, s = 1, col = "#c8b090" }) => {
  const k = cl((tt - a) / 0.9); if (tt < a || k >= 1) return null;
  return <group position={p as any}>{Array.from({ length: 10 }, (_, i) => { const an = i / 10 * 2 * PI + rn(i, 2);
    return <mesh key={i} position={[Math.cos(an) * 0.09 * s * k, 0.02 + 0.05 * s * k * rn(i, 3), Math.sin(an) * 0.06 * s * k]} scale={sm(0.02 * s * (0.5 + k))}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={col} transparent opacity={0.55 * (1 - k)} depthWrite={false} /></mesh>; })}</group>;
};
export const Escudo: React.FC<{ r?: number }> = ({ r = 0.2 }) => <group>
  <mesh rotation={[PI / 2, 0, 0]} geometry={latheG("escudo_i" + r, [[0, 0.03], [r * 0.6, 0.026], [r * 0.95, 0.012], [r, 0], [r * 0.97, -0.006], [0, 0.0]], 40)}>{M.brass({ col: "#b8862e" })}</mesh>
  <mesh position={[0, 0, 0.032]}><sphereGeometry args={[r * 0.14, 16, 10]} />{M.brass({ col: "#d8a84a" })}</mesh>
</group>;
export const Reloj: React.FC<{ k: number; s?: number }> = ({ k, s = 1 }) => <group scale={s}>
  {[0, 0.36].map((y, i) => <RBox key={i} s={[0.2, 0.025, 0.2]} r={0.008} p={[0, y, 0]}>{M.wood({ base: [110, 70, 38] })}</RBox>)}
  {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <mesh key={i} position={[x * 0.085, 0.18, z * 0.085]}><cylinderGeometry args={[0.008, 0.008, 0.34, 8]} />{M.wood({ base: [110, 70, 38] })}</mesh>)}
  <mesh position={[0, 0.18, 0]} geometry={latheG("relojarena_i", [[0.002, -0.16], [0.07, -0.15], [0.075, -0.08], [0.012, -0.005], [0.012, 0.005], [0.075, 0.08], [0.07, 0.15], [0.002, 0.16]], 32)}>{M.glass({ op: 0.25 })}</mesh>
  <mesh position={[0, 0.27 - 0.05 * k, 0]}><coneGeometry args={[0.06 * (1 - 0.7 * k) + 0.005, sm(0.08 * (1 - k)), 24]} /><meshStandardMaterial color="#d8b070" roughness={0.9} /></mesh>
  <mesh position={[0, 0.04 + 0.04 * k, 0]}><coneGeometry args={[0.065, sm(0.08 * k), 24]} /><meshStandardMaterial color="#d8b070" roughness={0.9} /></mesh>
  <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.002, 0.002, 0.1, 6]} /><meshStandardMaterial color="#d8b070" transparent opacity={k < 0.98 ? 0.9 : 0} /></mesh>
</group>;

// ---- ArcillaEscucha · el tazón de agua entero en primer plano junto a la pared de arcilla; al «escuchando» el agua hace anillos,
// cada golpe del otro lado uno más; el soldado arrodillado con la oreja en la pared, detrás ----
const ArcillaEscucha: React.FC<UP> = ({ d, p }) => {
  const aE = sec(p, "escuchando", 3);
  return <U3 d={d} bg={p.bg} ground={[150, 112, 76]} mode="iris" key1={[-0.8, 2.2, 1.6]}
    cam={{ at: [0.04, 0.2, 0.0], az: [-0.32, -0.18], el: [0.3, 0.26], r: [1.2, 1.08], fov: 34 }}>{(tt) => <>
    <mesh position={[0.36, 0.3, -0.1]}><boxGeometry args={[0.16, 0.6, 1.3]} /><meshStandardMaterial map={dirtT([150, 104, 70])} roughness={1} /></mesh>
    <group position={[0.2, 0, -0.22]}><Stickman escala={0.15} rotY={80} guion={[{ t: 0, accion: "sentarse", expr: "pensativo" }, { t: aE, accion: "sentarse", expr: "asustado" }] as any} semilla={71} contacto={0} /></group>
    <Sh p={[0.2, 0, -0.22]} r={0.12} />
    <group position={[0, 0, 0.12]}>
      <mesh geometry={latheG("tazon_i", [[0, 0], [0.12, 0.0], [0.16, 0.05], [0.17, 0.09], [0.16, 0.092], [0.15, 0.055], [0.11, 0.012], [0, 0.012]], 40)}>{M.wood({ base: [120, 78, 44] })}</mesh>
      <mesh position={[0, 0.07, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.152, 40]} />{M.water({ op: 0.75, col: "#4a7a8a" })}</mesh>
      {Array.from({ length: 4 }, (_, i) => { const a0 = Math.min(aE, 0.5), k = ((tt - a0 - i * 0.25) % 1 + 1) % 1, on = tt > a0 + i * 0.25 ? 1 : 0;
        return <mesh key={i} position={[0, 0.072, 0]} rotation={[-PI / 2, 0, 0]} scale={sm(0.1 + 0.9 * k)}><ringGeometry args={[0.14, 0.15, 40]} /><meshBasicMaterial color="#e8f4f8" transparent opacity={0.7 * (1 - k) * on} depthWrite={false} /></mesh>; })}
      <Sh p={[0, 0, 0]} r={0.19} />
    </group>
    <spotLight position={[-0.4, 1.4, 0.8]} angle={0.4} penumbra={0.7} intensity={7} distance={3} color="#ffe2b8" />
  </>}</U3>;
};

// ---- OchoCascos · ocho pedestales en arco; cada casco baja de a uno con rebote y sombra; la cámara se abre para verlos todos ----
const OchoCascos: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, span = Math.max(2.4, D - 1.4);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-1.0, 2.6, 2.0]}
    cam={{ at: [0, 0.3, 0], az: [-0.08, 0.08], el: [0.16, 0.14], r: [1.6, 1.5], fov: 34 }}>{(tt) => <>
    {Array.from({ length: 8 }, (_, i) => { const an = 0, x = (i - 3.5) * 0.25, z = 0.25, a = 0.3 + i * span / 8;
      return <group key={i} position={[x, 0, z - 0.25]} rotation={[0, -an, 0]}>
        <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.09, 0.11, 0.2, 28]} /><meshStandardMaterial map={dirtT([150, 140, 126])} roughness={0.9} /></mesh>
        <Sh p={[0, 0.2, 0]} r={0.08} op={0.5 * cl((tt - a) * 3)} />
        <group position={[0, 0.205 + fallY(tt, a, 0.7), 0]} visible={tt > a - 0.3}><group scale={2.3}><Casco i={i} /></group></group>
        <pointLight position={[0, 0.7, 0.35]} intensity={0.0001 + 0.8 * eio(tt, a + 0.1, a + 0.6)} distance={0.9} color="#fff0e0" />
      </group>; })}
  </>}</U3>;
};

// ---- AsientoApodo · el muñeco sentado en un banco de piedra; al lado la losa: al decir «apodo» un cincel la golpea y salen
// las marcas de a una con polvo (la losa queda grabada, sin letras que leer) ----
const AsientoApodo: React.FC<UP> = ({ d, p }) => {
  const aA = sec(p, "apodo", 2.5);
  return <U3 d={d} bg={p.bg} ground={[140, 128, 112]} mode="iris" key1={[-0.6, 2.4, 1.8]}
    cam={{ at: [0.12, 0.28, 0], az: [-0.22, -0.08], el: [0.16, 0.12], r: [1.35, 1.2], fov: 34 }}>{(tt) => {
    const hit = (j: number) => 0.35 + j * 0.3, tap = Math.abs(Math.sin(Math.max(0, tt - 0.3) * PI / 0.3));
    return <>
      <RBox s={[0.3, 0.14, 0.2]} r={0.015} p={[-0.2, 0.07, 0]}><meshStandardMaterial map={dirtT([160, 150, 136])} roughness={0.95} /></RBox>
      <Sh p={[-0.2, 0, 0]} r={0.2} sx={1.1} />
      <group position={[-0.2, 0.14, 0]}><Stickman escala={0.14} rotY={20} guion={[{ t: 0, accion: "sentarse", expr: "nervioso" }, { t: aA + 1.2, accion: "sentarse", expr: "sorprendido" }] as any} semilla={72} contacto={0} /></group>
      <RBox s={[0.34, 0.5, 0.08]} r={0.02} p={[0.36, 0.25, -0.05]} rot={[0, -0.3, 0]}><meshStandardMaterial map={dirtT([172, 164, 150])} roughness={0.95} /></RBox>
      <Sh p={[0.36, 0, -0.05]} r={0.2} sx={1.2} />
      <group position={[0.36, 0.25, -0.05]} rotation={[0, -0.3, 0]}>
        {Array.from({ length: 5 }, (_, j) => <mesh key={j} position={[-0.1 + j * 0.05, 0.05 + (j % 2) * 0.03, 0.042]} rotation={[0, 0, 0.5 - j * 0.25]} scale={[1, sm(eio(tt, hit(j), hit(j) + 0.15)), 1]}><boxGeometry args={[0.036, 0.24, 0.01]} /><meshStandardMaterial color="#3a342e" roughness={1} /></mesh>)}
        {Array.from({ length: 5 }, (_, j) => <Polvo key={j} tt={tt} a={hit(j)} p={[-0.1 + j * 0.05, 0.05, 0.05]} s={0.5} col="#d8d0c0" />)}
        <group position={[lerp(-0.1, 0.1, cl((tt - 0.35) / 1.5)), 0.1, 0.12]} rotation={[0, 0, -0.6]} scale={1.8} visible={tt < Math.max(aA, 2.2) + 1.0}>
          <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 0.12, 8]} />{M.steel()}</mesh>
          <group position={[0.06 + 0.04 * tap, 0.02, 0.06]}><RBox s={[0.06, 0.035, 0.035]} r={0.006}>{M.steel({ col: "#7a7e82" })}</RBox><mesh position={[0.04, -0.04, 0]} rotation={[0, 0, 0.6]}><cylinderGeometry args={[0.006, 0.006, 0.1, 8]} />{M.wood()}</mesh></group>
        </group>
      </group>
      <spotLight position={[0.2, 1.8, 1.0]} angle={0.4} penumbra={0.7} intensity={8} distance={3.5} color="#ffe6c8" />
    </>;
  }}</U3>;
};

// ---- ConElSobreEl · el escudo apoyado en el suelo con el soldado acostado encima; polvo al apoyarlo; los cuatro se arrodillan ----
const ConElSobreEl: React.FC<UP> = ({ d, p }) => {
  const aS = sec(p, "sobre", 1.8);
  return <U3 d={d} bg={p.bg} ground={[176, 150, 110]} mode="iris" key1={[-1.2, 2.6, 1.8]}
    cam={{ at: [0.0, 0.08, 0], az: [-0.62, -0.28], el: [0.5, 0.56], r: [1.18, 1.02], fov: 34 }}>{(tt) => {
    const down = eio(tt, aS - 0.6, aS);
    return <>
      <group position={[0, lerp(0.2, 0.03, down), 0]} rotation={[-PI / 2, 0, 0]}><group scale={[1.6, 1, 1]}><Escudo r={0.2} /></group></group>
      <Sh p={[0, 0, 0]} r={0.24} sx={1.55} op={0.25 + 0.3 * down} />
      <Polvo tt={tt} a={aS} p={[0, 0, 0]} s={2.2} />
      <group position={[-0.16, lerp(0.2, 0.06, down) + 0.0, 0]} rotation={[0, 0, -PI / 2]}><Stickman escala={0.12} rotY={0} guion={[{ t: 0, accion: "quieto", expr: "dormido" }] as any} semilla={61} contacto={0} /></group>
      {[[-0.26, -0.3, 1], [0.26, -0.3, 1], [-0.26, 0.3, -1], [0.26, 0.3, -1]].map(([x, z, s], i) => <group key={i} position={[x, 0, z]}>
        <Stickman escala={0.12} rotY={s > 0 ? 0 : 180} guion={[{ t: 0, accion: "parado", expr: "triste" }, { t: aS + 0.3 + i * 0.12, accion: "cabizbajo", expr: "triste" }] as any} semilla={62 + i} contacto={0} />
        <Sh p={[0, 0, 0]} r={0.06} /></group>)}
      <spotLight position={[0.3, 2.2, 0.9]} angle={0.4} penumbra={0.7} intensity={9} distance={4} color="#ffe2b8" />
    </>;
  }}</U3>;
};

// ---- CercaEstacas · tres hileras de estacas inclinadas hacia el enemigo; se clavan una a una con polvo; al «caballos» uno llega y frena ----
const CercaEstacas: React.FC<UP> = ({ d, p }) => {
  const aE = sec(p, "estaca", 0.5), aC = sec(p, "caballos", 2.6), D = d / 30, sp = Math.max(0.08, (aC - aE - 0.2) / 15);
  return <U3 d={d} bg={p.bg} ground={[120, 112, 70]} mode="iris" key1={[-1.2, 2.4, 1.6]}
    cam={{ at: [0.08, 0.18, 0], az: [-0.62, -0.5], el: [0.22, 0.18], r: [1.85, 1.75], fov: 34 }}>{(tt) => {
    const run = eio(tt, aC, Math.min(D - 0.4, aC + 1.6)), rear = Math.sin(PI * eio(tt, aC + 1.3, aC + 2.2));
    return <>
      {Array.from({ length: 15 }, (_, i) => { const row = Math.floor(i / 5), x = -0.1 + row * 0.12, z = -0.4 + (i % 5) * 0.2 + row * 0.07, a = aE + i * sp;
        return <group key={i} position={[x, -0.45 * (1 - eio(tt, a, a + 0.18)), z]} visible={tt > a - 0.05}>
          <group rotation={[0, 0, -0.55]}><mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.01, 0.03, 0.44, 10]} />{M.wood({ base: [140, 100, 60] })}</mesh></group>
          <mesh position={[0, 0, 0]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.05, 14, 8]} /><meshStandardMaterial color="#6a5232" roughness={1} /></mesh>
          <Polvo tt={tt} a={a + 0.12} p={[0, 0.02, 0]} s={2.0} />
        </group>; })}
      <group position={[lerp(1.6, 0.6, run), 0, 0]} rotation={[0, PI, rear * 0.4]}><Horse tt={tt} col="#6a4a32" gallop={1 - run * 0.9} s={1.1} /></group>
      <Sh p={[lerp(1.6, 0.6, run), 0, 0]} r={0.16} sx={1.6} />
      <spotLight position={[0.2, 2.4, 1.2]} angle={0.45} penumbra={0.7} intensity={8} distance={4} color="#ffe6c0" />
    </>;
  }}</U3>;
};

// ---- TamborArvejas · el tambor en el suelo, de cerca; con cada golpe de abajo las arvejas saltan en parábola y rebotan;
// el cuenco de agua de al lado tiembla con el mismo golpe ----
const TamborArvejas: React.FC<UP> = ({ d, p }) => {
  const aS = Math.min(sec(p, "saltaban", 2.4), 0.4), B = 0.7;
  return <U3 d={d} bg={p.bg} ground={[136, 100, 66]} mode="iris" key1={[-0.6, 2.2, 1.4]}
    cam={{ at: [0.04, 0.12, 0], az: [-0.3, -0.18], el: [0.42, 0.36], r: [1.05, 0.95], fov: 34 }}>{(tt) => {
    const ph = Math.max(0, tt - aS) / B, cyc = ph % 1, on = tt > aS ? 1 : 0, hop = on * 4 * cyc * (1 - cyc) * Math.exp(-0.15 * Math.floor(ph));
    return <>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.16, 0.16, 0.14, 40]} /><meshStandardMaterial color="#8a3a22" roughness={0.6} /></mesh>
      <mesh position={[0, 0.141, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.158, 40]} /><meshStandardMaterial color="#e8dcc0" roughness={0.8} /></mesh>
      {[0.01, 0.13].map((y, i) => <mesh key={i} position={[0, y, 0]}><torusGeometry args={[0.162, 0.008, 8, 40]} />{M.brass({ col: "#a87a30" })}</mesh>)}
      <Sh p={[0, 0, 0]} r={0.2} />
      {Array.from({ length: 7 }, (_, i) => { const a = rn(i, 1) * 2 * PI, r = 0.03 + 0.09 * rn(i, 2);
        return <mesh key={i} position={[Math.cos(a) * r, 0.175 + hop * (0.14 + 0.08 * rn(i, 3)), Math.sin(a) * r]}><sphereGeometry args={[0.038, 14, 10]} /><meshStandardMaterial color="#5a9a3a" roughness={0.5} /></mesh>; })}
      <group position={[0.32, 0, 0.12]}>
        <mesh geometry={latheG("cuenco_i", [[0, 0], [0.07, 0], [0.1, 0.04], [0.105, 0.06], [0.095, 0.06], [0.085, 0.04], [0.06, 0.008], [0, 0.008]], 32)}>{M.porcelain({ col: "#d8ccb8" })}</mesh>
        <mesh position={[0, 0.045, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.088, 32]} />{M.water({ op: 0.7, col: "#4a7a8a" })}</mesh>
        <mesh position={[0, 0.047, 0]} rotation={[-PI / 2, 0, 0]} scale={sm(0.2 + 0.8 * cyc)}><ringGeometry args={[0.08, 0.087, 32]} /><meshBasicMaterial color="#e8f4f8" transparent opacity={0.7 * on * (1 - cyc)} depthWrite={false} /></mesh>
        <Sh p={[0, 0, 0]} r={0.11} />
      </group>
      <spotLight position={[-0.3, 1.4, 0.6]} angle={0.4} penumbra={0.7} intensity={7} distance={3} color="#ffe2b8" />
    </>;
  }}</U3>;
};

// ---- CuerdaTirones · el túnel cortado al medio; un minero en cada punta de la cuerda; el tirón viaja como una onda de uno al otro ----
const CuerdaTirones: React.FC<UP> = ({ d, p }) => {
  const a0 = sec(p, "tirones", 0.8), N = 110;
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[-0.4, 2.0, 1.4]}
    cam={{ at: [0, 0.18, 0], az: [-0.1, 0.08], el: [0.12, 0.1], r: [1.2, 1.05], fov: 34 }}>{(tt) => {
    const pulse = (x: number) => { let y = 0; for (let k = 0; k < 12; k++) { const c = -0.6 + 1.2 * cl((tt - a0 + 0.6 - k * 0.75) / 0.7) * (k % 2 ? -1 : 1) + (k % 2 ? 1.2 : 0), on = tt > a0 - 0.6 + k * 0.75 && tt < a0 - 0.6 + k * 0.75 + 0.72 ? 1 : 0; y += on * 0.1 * Math.exp(-((x - c) ** 2) / 0.008); } return y; };
    return <>
      <mesh position={[0, 0.3, -0.05]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.36, 0.36, 1.7, 40, 1, true, PI, PI]} /><meshStandardMaterial map={dirtT([110, 84, 58])} roughness={1} side={THREE.BackSide} /></mesh>
      <mesh position={[0, -0.005, 0.1]}><boxGeometry args={[1.7, 0.01, 0.4]} /><meshStandardMaterial map={dirtT([100, 76, 52])} roughness={1} /></mesh>
      {[0, 1].map((i) => <group key={i} position={[i ? 0.64 : -0.64, 0, 0.05]}><Stickman escala={0.17} rotY={i ? -90 : 90} guion={[{ t: 0, accion: "empujar", expr: "nervioso" }, { t: a0 + (i ? 0.9 : 2.0), accion: "empujar", expr: "decidido" }] as any} semilla={73 + i} contacto={0} />
        <Sh p={[0, 0, 0]} r={0.07} /></group>)}
      {Array.from({ length: N }, (_, j) => { const x = -0.6 + 1.2 * j / (N - 1); return <mesh key={j} position={[x, 0.17 + pulse(x), 0.05]}><sphereGeometry args={[0.032, 8, 6]} /><meshStandardMaterial color="#ecd09a" emissive="#5a4020" emissiveIntensity={0.35} roughness={0.85} /></mesh>; })}
      <pointLight position={[0, 0.5, 0.4]} intensity={1.6} distance={1.8} color="#ffcf88" />
      <spotLight position={[0, 1.6, 1.2]} angle={0.5} penumbra={0.7} intensity={5} distance={3} color="#ffe6c0" />
    </>;
  }}</U3>;
};

// ---- TamborOrdenes · el tambor en primer plano a la izquierda; a la derecha cinco soldados grandes: con cada golpe giran juntos ----
const TamborOrdenes: React.FC<UP> = ({ d, p }) => {
  const aR = sec(p, "radio", 0.4), B = 0.8;
  return <U3 d={d} bg={p.bg} ground={[150, 132, 100]} mode="iris" key1={[-1.0, 2.4, 1.6]}
    cam={{ at: [0.1, 0.2, 0], az: [-0.3, -0.2], el: [0.14, 0.12], r: [1.5, 1.35], fov: 34 }}>{(tt) => {
    const ph = Math.max(0, tt - aR) / B, cyc = ph % 1, n = Math.floor(ph), stick = Math.abs(Math.sin(cyc * PI));
    return <>
      <group position={[-0.32, 0, 0.15]}>
        <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.13, 0.13, 0.2, 36]} /><meshStandardMaterial color="#2a4a7a" roughness={0.6} /></mesh>
        <mesh position={[0, 0.261, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.128, 36]} /><meshStandardMaterial color="#efe6d0" /></mesh>
        {[0.07, 0.25].map((y, i) => <mesh key={i} position={[0, y, 0]}><torusGeometry args={[0.132, 0.007, 8, 36]} />{M.brass()}</mesh>)}
        <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.02, 0.05, 0.06, 12]} />{M.wood()}</mesh>
        {[-1, 1].map((s, i) => <group key={i} position={[s * 0.05, 0.27, 0.02]} rotation={[0.3 + 0.7 * (i ? 1 - stick : stick), 0, s * 0.2]}><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.005, 0.007, 0.15, 8]} />{M.wood({ base: [180, 140, 90] })}</mesh></group>)}
        <Sh p={[0, 0, 0]} r={0.16} />
      </group>
      {Array.from({ length: 5 }, (_, i) => <group key={i} position={[0.0 + i * 0.16, 0, -0.1 + i * 0.03]}>
        <Stickman escala={0.13} rotY={lerp(-75, 75, (n % 2) ? 1 - eio(cyc, 0, 0.25) : eio(cyc, 0, 0.25)) * (tt > aR ? 1 : 0)} guion={[{ t: 0, accion: "parado", expr: "decidido" }] as any} semilla={80 + i} contacto={0} color="#c83a2a" />
        <Sh p={[0, 0, 0]} r={0.06} /></group>)}
      <spotLight position={[0, 2.4, 1.2]} angle={0.45} penumbra={0.7} intensity={8} distance={4} color="#ffe6c0" />
    </>;
  }}</U3>;
};

// ---- NoTeSientes · noche de nieve: la fogata detrás se va apagando; el rojo se sienta, la nieve lo cubre y se vuelve blanco ----
const NoTeSientes: React.FC<UP> = ({ d, p }) => {
  const aS = sec(p, "sentaba", 0.8), aL = sec(p, "levantaba", 2.6), D = d / 30;
  return <U3 d={d} bg={p.bg} ground={[210, 214, 220]} sky="#0a0e18" mode="iris" key1={[-0.6, 1.8, 1.4]}
    cam={{ at: [0, 0.2, 0], az: [-0.18, -0.08], el: [0.16, 0.12], r: [1.35, 1.22], fov: 34 }}>{(tt) => {
    const cold = eio(tt, aS + 0.3, D - 0.3), fire = 1 - 0.85 * eio(tt, aS, D - 0.5), fl = 0.85 + 0.15 * Math.sin(tt * 2 * PI * 1.6);
    return <>
      <group position={[0.05, 0, -0.45]} scale={1.7}>
        {[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.03, 0]} rotation={[0, i * PI / 3, PI / 2]}><cylinderGeometry args={[0.018, 0.018, 0.22, 8]} />{M.wood({ base: [70, 46, 30] })}</mesh>)}
        <mesh position={[0, 0.1, 0]} scale={[1, sm(fire * fl), 1]}><coneGeometry args={[0.07, 0.18, 16]} />{M.glow({ col: "#ff9a3a", op: 0.85 })}</mesh>
        <pointLight position={[0, 0.2, 0.1]} intensity={2.4 * fire * fl} distance={1.6} color="#ff9a4a" />
      </group>
      <group position={[-0.12, 0, 0]}><Stickman escala={0.14} rotY={15} guion={[{ t: 0, accion: "temblando", expr: "nervioso" }, { t: aS, accion: "sentarse", expr: "dormido" }] as any} semilla={90} contacto={0}
        color={"#" + new THREE.Color("#c8302a").lerp(new THREE.Color("#eef2f6"), cold).getHexString()} /></group>
      <Sh p={[-0.12, 0, 0]} r={0.09} />
      <group position={[0.24, 0, 0.05]}><Stickman escala={0.14} rotY={-25} guion={[{ t: 0, accion: "temblando", expr: "nervioso" }, { t: aL, accion: "senalar", expr: "asustado" }] as any} semilla={91} contacto={0} color="#5a6a4a" /></group>
      <Sh p={[0.24, 0, 0.05]} r={0.08} />
      {Array.from({ length: 60 }, (_, i) => { const y = 0.9 - ((tt * (0.12 + 0.05 * rn(i, 2)) + rn(i, 1)) % 1) * 0.95; return <mesh key={i} position={[(rn(i, 3) - 0.5) * 1.4, y, (rn(i, 4) - 0.5) * 0.9]}><sphereGeometry args={[0.005, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>; })}
      <directionalLight position={[1, 2, 1.5]} intensity={0.5} color="#9ab0e0" />
    </>;
  }}</U3>;
};

// ---- TopCinco · un solo pedestal en el centro: el objeto del número que se dice llega y el anterior se va por la izquierda ----
const T5 = ["cinco", "cuatro", "tres", "dos", "uno"];
const TopCinco: React.FC<UP> = ({ d, p }) => {
  const at = T5.map((k, i) => sec(p, k, 0.4 + i * 1.4));
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-0.8, 2.6, 2.0]}
    cam={{ at: [0, 0.3, 0], az: [-0.16, 0.08], el: [0.2, 0.18], r: [1.45, 1.35], fov: 34 }}>{(tt) => <>
    <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.2, 0.23, 0.12, 40]} /><meshStandardMaterial map={dirtT([150, 142, 128])} roughness={0.95} /></mesh>
    <Sh p={[0, 0, 0]} r={0.28} />
    {at.map((a, i) => { const nx = i < 4 ? at[i + 1] : 1e9, out = eio(tt, nx - 0.1, nx + 0.5);
      return <group key={i} position={[-1.4 * out, 0.12 + fallY(tt, a, 0.8), 0]} visible={tt > a - 0.3 && out < 0.99}>
        <Sh p={[0, 0, 0]} r={0.16} op={0.5} /><group scale={1.45}><Obj5 i={i} tt={tt} on={eio(tt, a + 0.3, a + 1.2)} /></group></group>; })}
    <spotLight position={[0, 2.2, 0.8]} angle={0.3} penumbra={0.6} intensity={16} distance={3.5} color="#ffe8c0" />
  </>}</U3>;
};

// ---- TodoLoDemas · la mesa de campaña; llegan de a uno el saco, la olla y el balde; al «limpiar» el muñeco friega la olla con espuma ----
const TodoLoDemas: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "cargar", 0.4), aM = sec(p, "comida", 2.0), aB = sec(p, "baldes", 3.4), aL = sec(p, "limpiar", 4.8);
  return <U3 d={d} bg={p.bg} ground={[140, 112, 80]} mode="iris" key1={[-0.8, 2.4, 1.6]}
    cam={{ at: [0.05, 0.22, 0], az: [-0.3, -0.18], el: [0.2, 0.16], r: [1.35, 1.2], fov: 34 }}>{(tt) => {
    const aF = aM + 0.8, rub = tt > aF ? Math.sin(tt * 2 * PI * 1.5) : 0, foam = eio(tt, aF, aF + 1.0);
    return <>
      <RBox s={[0.8, 0.03, 0.4]} r={0.01} p={[0, 0.22, 0]}>{M.wood({ base: [130, 92, 54] })}</RBox>
      {[[-0.36, -0.16], [0.36, -0.16], [-0.36, 0.16], [0.36, 0.16]].map(([x, z], i) => <mesh key={i} position={[x, 0.11, z]}><cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />{M.wood({ base: [110, 76, 44] })}</mesh>)}
      <Sh p={[0, 0, 0]} r={0.42} sx={1.1} op={0.35} />
      <group position={[-0.26, 0.235 + fallY(tt, aC, 0.6), -0.05]} visible={tt > aC - 0.3}><RBox s={[0.14, 0.16, 0.1]} r={0.04} p={[0, 0.08, 0]}><meshStandardMaterial color="#b89a6a" roughness={1} /></RBox></group>
      <group position={[0.02, 0.235 + fallY(tt, aM, 0.6), 0.02]} scale={1.8} visible={tt > aM - 0.3}>
        <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.09, 0.08, 0.1, 28, 1, true]} />{M.steel({ col: "#5a5e62", side: THREE.DoubleSide } as any)}</mesh>
        <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.08, 28]} />{M.steel({ col: "#4a4e52" })}</mesh>
        {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.16, 0.1 + rn(i, 2) * 0.04, (rn(i, 3) - 0.5) * 0.16]} scale={sm(0.025 * foam * (0.6 + rn(i, 4)))}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.9} /></mesh>)}
      </group>
      <group position={[0.26, 0.235 + fallY(tt, aB, 0.6), -0.06]} visible={tt > aB - 0.3}><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.07, 0.055, 0.14, 24, 1, true]} />{M.wood({ base: [120, 84, 50] })}</mesh>
        <mesh position={[0, 0.11, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.066, 24]} />{M.water({ op: 0.7 })}</mesh></group>
      <group position={[0.02, 0, -0.34]}><Stickman escala={0.15} rotY={0} guion={[{ t: 0, accion: "parado", expr: "aburrido" }, { t: aM + 0.8, accion: "empujar", expr: "decidido" }] as any} semilla={92} contacto={0} /></group>
      <Sh p={[0.02, 0, -0.34]} r={0.08} />
      <group position={[0.02 + 0.06 * rub, 0.44, 0.0]} visible={tt > aF}><RBox s={[0.06, 0.02, 0.04]} r={0.008}><meshStandardMaterial color="#d8c8a0" roughness={1} /></RBox></group>
      <spotLight position={[0.2, 2.2, 1.0]} angle={0.4} penumbra={0.7} intensity={9} distance={4} color="#ffe6c0" />
    </>;
  }}</U3>;
};

// ---- CuerdasTiempo · el ranking como cinco objetos sobre pedestales que crecen: casco, pala, arco, cuenco y pico; suben de a uno ----
const CuerdasTiempo: React.FC<UP> = ({ d, p }) => {
  const aR = Math.min(sec(p, "ranking", 0.3), 0.2), D = d / 30, sp = Math.max(0.4, (D - aR - 1.6) / 5);
  const Obj = ({ i }: { i: number }) => i === 0 ? <group scale={1.1}><Casco i={1} /></group>
    : i === 1 ? <group rotation={[0, 0, 0.5]}><mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.008, 0.008, 0.24, 8]} />{M.wood()}</mesh><RBox s={[0.08, 0.1, 0.01]} r={0.01} p={[0, 0.02, 0]}>{M.steel({ col: "#7a7e82" })}</RBox></group>
    : i === 2 ? <group position={[0, 0.0, 0]}><mesh><torusGeometry args={[0.11, 0.008, 8, 32, PI]} />{M.wood({ base: [150, 100, 50] })}</mesh><mesh position={[0, 0.0, 0]}><boxGeometry args={[0.22, 0.003, 0.003]} /><meshStandardMaterial color="#efe6d0" /></mesh></group>
    : i === 3 ? <mesh geometry={latheG("cuenco_rk", [[0, 0], [0.06, 0], [0.09, 0.04], [0.092, 0.06], [0.08, 0.06], [0.07, 0.04], [0.05, 0.008], [0, 0.008]], 32)}>{M.wood({ base: [130, 86, 50] })}</mesh>
    : <group rotation={[0, 0, -0.3]}><mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.008, 0.008, 0.24, 8]} />{M.wood()}</mesh><mesh position={[0, 0.24, 0]} rotation={[0, 0, PI / 2]}><coneGeometry args={[0.012, 0.2, 8]} />{M.steel({ col: "#6a6e72" })}</mesh></group>;
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-1.0, 2.6, 2.0]}
    cam={{ at: [0, 0.46, 0], az: [-0.12, 0.08], el: [0.14, 0.12], r: [2.1, 2.0], fov: 34 }}>{(tt) => <>
    {Array.from({ length: 5 }, (_, i) => { const x = -0.56 + i * 0.28, a = aR + 0.3 + i * sp, h = 0.08 + i * 0.07, g = 0.35 + 0.65 * eio(tt, a, a + 0.6);
      return <group key={i} position={[x, 0, 0]}>
        <mesh position={[0, h * g / 2, 0]} scale={[1, sm(g), 1]}><cylinderGeometry args={[0.1, 0.11, h, 28]} /><meshStandardMaterial map={dirtT([150, 142, 128])} roughness={0.95} /></mesh>
        <Sh p={[0, 0, 0]} r={0.13} />
        <group position={[0, h * g + fallY(tt, a + 0.5, 0.5), 0]} visible={tt > a + 0.2}><group scale={1.95}><Obj i={i} /></group></group>
        <pointLight position={[0, 0.8, 0.4]} intensity={0.9 * g} distance={1.0} color="#ffd8a0" />
      </group>; })}
  </>}</U3>;
};

// ---- MitoVuelta · la botella de whisky y la bala sobre la mesa (lo de las películas) se apartan; en «realidad» baja el frasco
// de anestesia con su gotero y cae una gota sobre el paño ----
const MitoVuelta: React.FC<UP> = ({ d, p }) => {
  const aR = sec(p, "realidad", 2.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" key1={[-0.6, 2.2, 1.6]}
    cam={{ at: [0, 0.14, 0], az: [-0.26, -0.14], el: [0.24, 0.2], r: [0.95, 0.85], fov: 34 }}>{(tt) => {
    const away = eio(tt, aR - 0.3, aR + 0.5), drop = cl((tt - aR - 1.0) % 1.2 / 0.6);
    return <>
      <group position={[lerp(-0.12, -0.42, away), 0, lerp(0, -0.12, away)]}>
        <mesh position={[0, 0, 0]} geometry={latheG("whisky_i", [[0, 0], [0.045, 0], [0.048, 0.13], [0.03, 0.16], [0.014, 0.19], [0.014, 0.22], [0, 0.22]], 28)}>{M.glass({ op: 0.5, col: "#c88a3a" })}</mesh>
        <Sh p={[0, 0, 0]} r={0.06} />
        <group position={[0.1, 0.012, 0.05]} rotation={[0, 0.4, PI / 2]}><mesh><cylinderGeometry args={[0.009, 0.009, 0.05, 12]} />{M.brass()}</mesh><mesh position={[0, 0.03, 0]}><sphereGeometry args={[0.009, 12, 8]} />{M.steel({ col: "#8a8e92" })}</mesh></group>
      </group>
      <RBox s={[0.3, 0.004, 0.22]} r={0.002} p={[0.12, 0.002, 0.04]}><meshStandardMaterial color="#efeae0" roughness={0.9} /></RBox>
      <group position={[0.12, 0.03 + fallY(tt, aR, 0.6), 0]} visible={tt > aR - 0.3}>
        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.04, 0.04, 0.12, 24]} />{M.glass({ op: 0.45, col: "#7a5a2a" })}</mesh>
        <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.02, 0.024, 0.03, 16]} /><meshStandardMaterial color="#2a2420" /></mesh>
        <Sh p={[0, -0.03, 0]} r={0.05} />
      </group>
      <group position={[0.22, 0.2, 0.06]} visible={tt > aR + 0.6}>
        <mesh><cylinderGeometry args={[0.006, 0.003, 0.08, 10]} />{M.glass({ op: 0.5 })}</mesh>
        <mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.012, 12, 8]} />{M.rubber({ col: "#3a2a20" })}</mesh>
        <mesh position={[0, -0.05 - 0.14 * drop * drop, 0]} visible={drop < 0.98} scale={[1, 1.3, 1]}><sphereGeometry args={[0.005, 10, 8]} />{M.water({ op: 0.8, col: "#d8e8f0" })}</mesh>
      </group>
      <mesh position={[0.22, 0.006, 0.06]} rotation={[-PI / 2, 0, 0]} scale={sm(eio(tt, aR + 1.6, aR + 3))}><circleGeometry args={[0.03, 24]} /><meshStandardMaterial color="#c8c0b0" transparent opacity={0.6} depthWrite={false} /></mesh>
      <spotLight position={[0.1, 1.6, 0.8]} angle={0.35} penumbra={0.7} intensity={9} distance={3} color="#fff0d8" />
    </>;
  }}</U3>;
};

// ---- TorretaCola · cámara pegada a la burbuja de cristal: adentro el artillero entre sus dos ametralladoras, afuera pasan nubes ----
const TorretaCola: React.FC<UP> = ({ d, p }) => {
  return <U3 d={d} bg={p.bg} ground={null} sky="#2a3a52" mode="iris" key1={[0.6, 2.0, 1.4]}
    cam={{ at: [0, 0.02, 0], az: [-0.25, 0.15], el: [0.1, 0.06], r: [0.9, 0.84], fov: 36 }}>{(tt) => <>
    <mesh><sphereGeometry args={[0.26, 40, 28]} />{M.glass({ op: 0.12, col: "#dfeaf2" })}</mesh>
    {[0, 1, 2].map((i) => <mesh key={i} rotation={[0, i * PI / 3, 0]}><torusGeometry args={[0.262, 0.006, 8, 48]} />{M.steel({ col: "#5a5e62" })}</mesh>)}
    <mesh position={[0, 0, -0.42]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.26, 0.4, 32]} /><meshStandardMaterial color="#5a6a4a" metalness={0.4} roughness={0.6} /></mesh>
    <group position={[0, -0.16, -0.02]}><Stickman escala={0.14} rotY={0} guion={[{ t: 0, accion: "sentarse", expr: "nervioso" }] as any} semilla={44} contacto={0} color="#a8906a" /></group>
    {Array.from({ length: 10 }, (_, i) => { const ph = ((tt * 2 + i * 0.1) % 1); return <mesh key={"c" + i} position={[(i % 2 ? 0.08 : -0.08) + (i % 2 ? 1 : -1) * 0.05 * ph, -0.02 - 0.25 * ph * ph, 0.12]} rotation={[ph * 6, 0, ph * 4]}><cylinderGeometry args={[0.005, 0.005, 0.02, 8]} />{M.brass({ col: "#d8a840" })}</mesh>; })}
    {[-0.08, 0.08].map((x, i) => <group key={i} position={[x, 0.0, 0.1]}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.016, 0.016, 0.34, 12]} /><meshStandardMaterial color="#3a3e42" metalness={0.7} roughness={0.35} /></mesh>
      <mesh position={[0, 0, 0.2]} rotation={[PI / 2, 0, 0]} scale={sm(((tt * 2 + i * 0.5) % 1) < 0.18 ? 1 : 0)}><coneGeometry args={[0.06, 0.16, 10]} />{M.glow({ col: "#ffd070" })}</mesh></group>)}
    <pointLight position={[0, 0, 0.32]} intensity={0.0001 + 1.2 * (((tt * 2) % 1) < 0.18 ? 1 : 0.15)} distance={0.7} color="#ffc060" />
    {Array.from({ length: 9 }, (_, i) => { const x = ((rn(i, 1) * 4 - tt * (0.5 + 0.3 * rn(i, 2))) % 4 + 4) % 4 - 2;
      return <group key={i} position={[x, -0.3 + rn(i, 3) * 0.8, -1.2 - rn(i, 4) * 1.2]}>{[0, 1, 2].map((k) => <mesh key={k} position={[k * 0.12 - 0.12, k === 1 ? 0.04 : 0, 0]}><sphereGeometry args={[0.1 + 0.03 * k, 14, 10]} /><meshStandardMaterial color="#e8ecf2" roughness={1} transparent opacity={0.85} /></mesh>)}</group>; })}
    <pointLight position={[0, 0.15, 0.2]} intensity={0.7} distance={0.8} color="#ffd890" />
    <directionalLight position={[1, 2, 2]} intensity={1.3} color="#e8eef8" />
  </>}</U3>;
};

// ---- TrajeCalefaccion · el traje acolchado colgado de frente, con sus cables rojos encendidos; al «funcionaba» se apagan de los
// pies a la cabeza y la escarcha le crece por los bordes ----
const TrajeCalefaccion: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aF = Math.min(sec(p, "funcionaba", 1.6), D - 2.2);
  const parts = [[0, 0.42, 0.11, 0.2], [-0.15, 0.42, 0.04, 0.2], [0.15, 0.42, 0.04, 0.2], [-0.05, 0.16, 0.05, 0.22], [0.05, 0.16, 0.05, 0.22]];
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" sky="#0a0e18" mode="iris" key1={[0.6, 2.0, 1.6]}
    cam={{ at: [0, 0.45, 0], az: [-0.2, -0.08], el: [0.08, 0.06], r: [1.35, 1.28], fov: 34 }}>{(tt) => {
    const frost = eio(tt, aF + 0.3, D - 0.2);
    return <>
      <mesh position={[0, 0.86, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.34, 8]} />{M.wood({ base: [90, 60, 36] })}</mesh>
      <mesh position={[0, 0.81, 0]}><cylinderGeometry args={[0.004, 0.004, 0.1, 6]} />{M.steel({ col: "#4a4e52" })}</mesh>
      {parts.map(([x, y, r, h], j) => { const off = eio(tt, aF + (4 - Math.min(4, j + (j > 2 ? -1 : 2))) * 0.35, aF + 0.4 + (4 - Math.min(4, j + (j > 2 ? -1 : 2))) * 0.35);
        return <group key={j} position={[x, y, 0]} rotation={[0, 0, j === 1 ? -0.25 : j === 2 ? 0.25 : 0]}>
          <mesh><capsuleGeometry args={[r, h, 8, 20]} /><meshStandardMaterial color="#6a5a3a" roughness={0.95} /></mesh>
          {[-0.3, 0, 0.3].map((k, q) => <mesh key={q} position={[0, k * h, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[r * 1.02, 0.009, 8, 28]} /><meshStandardMaterial color="#4a2418" emissive="#ff3a1a" emissiveIntensity={2.4 * (1 - off)} toneMapped={false} /></mesh>)}
          {Array.from({ length: 10 }, (_, i) => { const an = rn(i + j * 10, 1) * 2 * PI; return <mesh key={i} position={[Math.cos(an) * r, (rn(i + j * 10, 2) - 0.5) * h, Math.sin(an) * r]} scale={sm(frost * (0.6 + rn(i, 3)))}><octahedronGeometry args={[0.02, 0]} /><meshStandardMaterial color="#bfe0ff" emissive="#4a7aa8" emissiveIntensity={0.4} roughness={0.25} /></mesh>; })}
        </group>; })}
      <mesh position={[0, 0.72, 0]}><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color="#6a5a3a" roughness={0.9} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.04, 0.73, 0.088]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.028, 0.028, 0.02, 20]} />{M.chrome({ col: "#9ab0c0" })}</mesh>)}
      <mesh position={[0, 0.73, 0.085]}><boxGeometry args={[0.03, 0.01, 0.01]} />{M.steel()}</mesh>
      <pointLight position={[0, 0.35, 0.3]} intensity={1.2 * (1 - eio(tt, aF, aF + 1.6))} distance={0.9} color="#ff6a3a" />
      <spotLight position={[0.3, 1.8, 1.0]} angle={0.4} penumbra={0.7} intensity={10} distance={3} color="#cfe0f2" />
      <hemisphereLight args={["#b8c8e0", "#2a2a30", 1.0]} />
      <pointLight position={[0.2, 0.6, 0.8]} intensity={1.2} distance={2.2} color="#e8f0ff" />
    </>;
  }}</U3>;
};

// ---- ParacaidasPuerta · desde arriba: la escotilla redonda de la torreta y el paracaídas plegado, más ancho que el agujero;
// lo empujan, baja y se traba en el marco con un golpe ----
const ParacaidasPuerta: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "puerta", 1.2);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" sky="#0a0e18" mode="iris" key1={[0.4, 2.2, 1.6]}
    cam={{ at: [0, 0.05, 0], az: [-0.35, -0.25], el: [0.62, 0.55], r: [1.0, 0.9], fov: 34 }}>{(tt) => {
    const slide = eio(tt, aP, aP + 0.8), jam = tt > aP + 0.8 ? Math.sin((tt - aP - 0.8) * 30) * Math.exp(-(tt - aP - 0.8) * 5) : 0;
    return <>
      {[-1, 1].map((s) => <RBox key={s} s={[0.5, 0.03, 0.9]} r={0.004} p={[s * 0.4, 0, 0]}><meshStandardMaterial color="#4a4e4a" metalness={0.5} roughness={0.6} /></RBox>)}
      {[-1, 1].map((s) => <RBox key={"z" + s} s={[0.3, 0.03, 0.3]} r={0.004} p={[0, 0, s * 0.3]}><meshStandardMaterial color="#4a4e4a" metalness={0.5} roughness={0.6} /></RBox>)}
      <mesh position={[0, 0.016, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.12, 0.15, 40]} />{M.steel({ col: "#9a9e9a" })}</mesh>
      <mesh position={[0, 0.03, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.135, 0.018, 12, 48]} />{M.steel({ col: "#7a7e7a" })}</mesh>
      <group position={[-0.15, 0.03, 0]} rotation={[0, 0, 1.75]}><mesh position={[0.15, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.02, 40]} />{M.steel({ col: "#5a5e5a" })}</mesh>
        <mesh position={[0.15, 0.012, 0]}><cylinderGeometry args={[0.05, 0.05, 0.01, 6]} />{M.steel({ col: "#8a8e8a" })}</mesh></group>
      <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.12, 0.12, 0.6, 32, 1, true]} /><meshStandardMaterial color="#121416" side={THREE.BackSide} /></mesh>
      <group position={[lerp(0.32, 0, slide), 0.02 + lerp(0.1, 0.045, slide) + 0.01 * jam, 0]} rotation={[0, 0.3 * (1 - slide), 0.06 * jam]}>
        <RBox s={[0.32, 0.09, 0.26]} r={0.035}><meshStandardMaterial color="#6a6a44" roughness={0.9} /></RBox>
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.08, 0.047, 0]}><boxGeometry args={[0.025, 0.004, 0.27]} /><meshStandardMaterial color="#e8dcc0" /></mesh>)}
        <mesh position={[0, 0.05, 0.06]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.022, 0.005, 8, 16]} />{M.chrome()}</mesh>
      </group>
      <Sh p={[lerp(0.32, 0, slide), 0.016, 0]} r={0.16} sx={1.2} op={0.4} />
      <spotLight position={[0.3, 1.6, 0.6]} angle={0.4} penumbra={0.6} intensity={8} distance={3} color="#e8e0d0" />
      <pointLight position={[0, -0.25, 0]} intensity={0.6} distance={0.5} color="#7aa0ff" />
    </>;
  }}</U3>;
};

// ---- TiraTiempo · a la izquierda el reloj de arena que se vacía; a la derecha la pila de calendarios crece hoja a hoja, entera ----
const TiraTiempo: React.FC<UP> = ({ d, p }) => {
  const aA = sec(p, "años", 2.6), D = d / 30, N = 10;
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" key1={[-0.6, 2.4, 1.8]}
    cam={{ at: [0, 0.44, 0], az: [-0.12, -0.04], el: [0.12, 0.1], r: [1.85, 1.8], fov: 34 }}>{(tt) => {
    const k = eio(tt, 0.3, D - 0.4);
    return <>
      <group position={[-0.3, 0, 0]}><Reloj k={k} s={1.5} /></group>
      <Sh p={[-0.3, 0, 0]} r={0.2} />
      {Array.from({ length: N }, (_, i) => { const a = aA - 1.2 + i * Math.max(0.1, (D - aA + 0.4) / N);
        return <group key={i} position={[0.24 + 0.01 * Math.sin(i * 1.7), 0.025 + i * 0.05 + fallY(tt, a, 0.5), 0]} rotation={[0, 0.2 * Math.sin(i * 2.3), 0]} visible={tt > a - 0.25}>
          <RBox s={[0.2, 0.045, 0.15]} r={0.006}><meshStandardMaterial color="#efeae0" roughness={0.9} /></RBox>
          <RBox s={[0.2, 0.012, 0.15]} r={0.004} p={[0, 0.02, 0]}><meshStandardMaterial color="#b83a2a" roughness={0.7} /></RBox></group>; })}
      <Sh p={[0.24, 0, 0]} r={0.14} />
      <spotLight position={[0, 2.2, 1.0]} angle={0.4} penumbra={0.7} intensity={9} distance={4} color="#ffe6c0" />
    </>;
  }}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { ArcillaEscucha, OchoCascos, AsientoApodo, ConElSobreEl, CercaEstacas, TamborArvejas, CuerdaTirones, TamborOrdenes, NoTeSientes, TopCinco, TodoLoDemas, CuerdasTiempo, MitoVuelta, TorretaCola, TrajeCalefaccion, ParacaidasPuerta, TiraTiempo };
