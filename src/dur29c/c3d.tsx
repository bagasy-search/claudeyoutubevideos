// dur29c · bloque D (vuelta 3 del EVALUADOR): cinco componentes nuevos para los minutos que quedaron sin uno al pasar a foto los
// estancados. Regla: un objeto grande y centrado, entero en cuadro, movimiento desde el primer cuadro, luces siempre montadas.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Stickman } from "../stickman3d";
import { Lantern, PI, sm, brickT } from "./c3k";

type UP = { d: number; p: any };

// ---- OlorEscudo · el tosher en el túnel con el farol; el olor sube del agua como cintas verdes que lo rodean y forman un anillo;
// en «protegía» los puntitos oscuros (las enfermedades) llegan y rebotan contra el anillo ----
const OlorEscudo: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "protegia", 1.6);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" sky="#0e0c08" key1={[-0.8, 2.2, 1.4]}
    cam={{ at: [0, 0.3, 0], az: [-0.3, -0.12], el: [0.16, 0.14], r: [1.35, 1.2], fov: 34 }}>{(tt) => {
    const ring = eio(tt, 0.3, aP);
    return <>
      <mesh position={[0, 0.45, -0.25]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.6, 0.6, 2.4, 40, 1, true, PI, PI]} /><meshStandardMaterial map={brickT([92, 64, 46], 8, 3)} roughness={0.95} side={THREE.BackSide} /></mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.4, 1.4]} /><meshStandardMaterial color="#3a3222" roughness={0.9} metalness={0} /></mesh>
      <group position={[0, 0.0, 0.05]}><Stickman escala={0.16} rotY={-20} guion={[{ t: 0, accion: "respira", expr: "neutral" }, { t: aP, accion: "manos_cadera", expr: "sonrisa_picara" }]} semilla={21} contacto={0} color="#7a6a52" /></group>
      <Lantern p={[0.17, 0.2, 0.12]} s={0.9} on={0.8} />
      {Array.from({ length: 5 }, (_, j) => Array.from({ length: 10 }, (_, i) => { const u = (tt * 0.25 + i / 10 + j * 0.2) % 1, an = u * 2 * PI * 1.2 + j * 1.3, r = lerp(0.12, 0.26, ring) + 0.02 * Math.sin(tt + j);
        return <mesh key={j * 10 + i} position={[Math.cos(an) * r, 0.04 + 0.42 * u, 0.05 + Math.sin(an) * r]} scale={sm(0.036 * (0.4 + 0.6 * Math.sin(PI * u)))}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#9ac850" transparent opacity={0.42} depthWrite={false} /></mesh>; }))}
      {Array.from({ length: 10 }, (_, i) => { const a0 = aP - 0.6 + i * 0.25, k = cl((tt - a0) / 0.7), an = rn(i, 1) * 2 * PI, rr = 0.75 - 0.47 * Math.min(1, k * 1.4) + 0.25 * Math.max(0, k - 0.7);
        return <mesh key={"g" + i} position={[Math.cos(an) * rr, 0.15 + rn(i, 2) * 0.25, 0.05 + Math.sin(an) * rr]} visible={tt > a0} scale={sm(1 - Math.max(0, k - 0.7) * 2)}><icosahedronGeometry args={[0.022, 0]} /><meshStandardMaterial color="#2a1e2a" emissive="#5a2a4a" emissiveIntensity={0.4} flatShading /></mesh>; })}
      <pointLight position={[0.17, 0.4, 0.3]} intensity={1.3} distance={1.4} color="#ffc070" />
      <hemisphereLight args={["#8a7a5a", "#1a1408", 0.5]} />
    </>;
  }}</U3>;
};

// ---- BurbujaVidrio · la caña de metal larguísima cruza el cuadro; en la punta la bola de vidrio al rojo gira y se infla de a poco,
// con el aire que llega por la caña como un anillo de luz ----
const BurbujaVidrio: React.FC<UP> = ({ d, p }) => {
  const aB = sec(p, "bola", 1.2), D = d / 30;
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" sky="#0d0806" key1={[-0.6, 2, 1.4]}
    cam={{ at: [0.18, 0.4, 0], az: [-0.45, -0.08], el: [0.14, 0.08], r: [1.1, 1.0], fov: 32 }}>{(tt) => {
    const inf = Math.sqrt(cl((tt - aB) / Math.max(0.5, D - 0.3 - aB))), rot = tt * 2 * PI * 0.43, R = 0.08 + 0.04 * inf, puff = (tt * 0.8) % 1;
    return <>
      <group position={[-0.35, 0.4, 0]} rotation={[rot, 0, 0]}>
        <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.016, 0.016, 1.1, 12]} />{M.steel({ col: "#8a8680" })}</mesh>
        {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.4 + i * 0.16, 0.017, 0]}><boxGeometry args={[0.03, 0.006, 0.008]} /><meshStandardMaterial color="#3a2a1a" /></mesh>)}
      </group>
      <mesh position={[-0.82, 0.4, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.024, 0.024, 0.16, 12]} />{M.wood({ base: [90, 60, 36] })}</mesh>
      <mesh position={[lerp(-0.85, 0.15, puff), 0.4, 0]} rotation={[0, PI / 2, 0]} visible={tt > aB}><torusGeometry args={[0.02, 0.004, 6, 16]} /><meshBasicMaterial color="#ffd8a0" transparent opacity={0.6 * (1 - puff)} /></mesh>
      <group position={[0.2 + R * 0.8, 0.4, 0]} rotation={[rot, 0, 0]}>
        <mesh scale={[1.15, 1, 1]}><sphereGeometry args={[R, 32, 24]} /><meshPhysicalMaterial color="#d0782c" emissive="#c84a10" emissiveIntensity={lerp(0.3, 0.06, inf)} roughness={0.1} transparent opacity={lerp(0.97, 0.82, inf)} clearcoat={1} /></mesh>
        <mesh scale={[1.15 * (0.25 + 0.65 * inf), 0.25 + 0.65 * inf, 0.25 + 0.65 * inf]}><sphereGeometry args={[R, 24, 18]} /><meshPhysicalMaterial color="#e8d8c0" transparent opacity={0.2 + 0.15 * inf} roughness={0.02} clearcoat={1} depthWrite={false} /></mesh>
        <mesh position={[-R * 0.3, R * 0.45, R * 0.6]} scale={sm(0.5 + 0.5 * inf)}><sphereGeometry args={[R * 0.12, 12, 8]} /><meshBasicMaterial color="#fff6e8" transparent opacity={0.7} /></mesh>
      </group>
      <pointLight position={[0.35, 0.42, -0.7]} intensity={0.9} distance={1.5} color="#ff8a30" />
      <RBox s={[0.55, 0.04, 0.12]} r={0.01} p={[-0.45, 0.35, 0]}>{M.wood({ base: [80, 56, 34] })}</RBox>
      <mesh position={[-0.45, 0.17, 0]}><boxGeometry args={[0.04, 0.34, 0.04]} />{M.wood({ base: [70, 48, 30] })}</mesh>
      <pointLight position={[0.3, 0.45, 0.25]} intensity={0.8} distance={1.3} color="#ff8a30" />
      <pointLight position={[-0.2, 0.8, 0.6]} intensity={0.7} distance={2} color="#e8eef8" />
      <hemisphereLight args={["#8a6a4a", "#1a0e06", 0.4]} />
    </>;
  }}</U3>;
};

// ---- BarroPalas · el fondo del cajón: barro brillante, piedras, y tres sandhogs con pala; cada palada levanta un terrón que vuela a
// la pila; las lámparas cuelgan de las vigas de madera de arriba ----
const BarroPalas: React.FC<UP> = ({ d, p }) => {
  const aP = Math.min(sec(p, "palas", 1.2), 0.8);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" sky="#14100c" key1={[-0.8, 2.2, 1.4]}
    cam={{ at: [0.05, 0.24, 0], az: [-0.28, -0.14], el: [0.22, 0.2], r: [1.2, 1.1], fov: 34 }}>{(tt) => <>
      <mesh position={[0, 0.0, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.4, 1.6, 24, 16]} /><meshStandardMaterial map={dirtT([86, 70, 50])} roughness={0.7} metalness={0} /></mesh>
      {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.6, 0.015, (rn(i, 2) - 0.5) * 0.9]} rotation={[rn(i, 3), rn(i, 4), 0]}><icosahedronGeometry args={[0.025 + rn(i, 5) * 0.03, 0]} /><meshStandardMaterial color="#6a6258" roughness={0.9} flatShading /></mesh>)}
      <mesh position={[0.62, 0.05, -0.25]} scale={[1.6, 0.6, 1.2]}><sphereGeometry args={[0.12, 14, 10]} /><meshStandardMaterial map={dirtT([80, 64, 46])} roughness={0.9} /></mesh>
      {Array.from({ length: 5 }, (_, i) => <mesh key={"v" + i} position={[-1.0 + i * 0.5, 0.95, -0.2]}><boxGeometry args={[0.08, 0.08, 1.6]} />{M.wood({ base: [110, 78, 46] })}</mesh>)}
      {[-0.5, 0, 0.5].map((x, i) => <group key={"l" + i}><mesh position={[x, 0.85, 0.1]}><cylinderGeometry args={[0.002, 0.002, 0.14, 4]} />{M.steel()}</mesh><Lantern p={[x, 0.74, 0.1]} s={0.8} on={0.9} /></group>)}
      {[[-0.4, 0.05, 30], [0.0, -0.1, 0], [0.35, 0.1, -30]].map(([x, z, ry], i) => { const c = ((tt - aP) * 0.7 + i * 0.33) % 1, on = tt > aP ? 1 : 0;
        return <group key={i}>
          <group position={[x, 0, z]}><Stickman escala={0.15} rotY={ry + 60} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={50 + i} contacto={0} color="#5a4a3a" /></group>
          <mesh position={[lerp(x + 0.1, 0.62, c), 0.06 + 0.35 * Math.sin(PI * c), lerp(z + 0.08, -0.25, c)]} visible={on > 0 && c > 0.05 && c < 0.95} rotation={[c * 4, c * 3, 0]}><icosahedronGeometry args={[0.03, 0]} /><meshStandardMaterial color="#5a4632" roughness={0.9} flatShading /></mesh>
        </group>; })}
      <pointLight position={[0, 0.7, 0.3]} intensity={2.4} distance={2.2} color="#ffc070" />
      <hemisphereLight args={["#8a7a5a", "#1a1408", 0.55]} />
    </>}</U3>;
};

// ---- CuchilloFilo · la tabla con el bloque de carne, el cuchillo grande y la mano enguantada fría al lado; la piedra afila con chispas;
// en «ti» el cuchillo resbala hacia el guante, el guante se aparta y queda una línea roja en el cuero ----
const CuchilloFilo: React.FC<UP> = ({ d, p }) => {
  const aT = sec(p, "ti", 2.2);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" sky="#14181c" key1={[-0.8, 2.2, 1.4]}
    cam={{ at: [0.1, 0.07, -0.04], at1: [0.26, 0.06, 0.1], az: [-0.66, 0.05], el: [0.46, 0.44], r: [0.8, 1.05], fov: 34 }}>{(tt) => {
    const on = tt < aT - 0.1 ? 1 : 0, st = (tt * 0.93) % 1, tri = 1 - Math.abs(2 * st - 1), sx = on * (0.2 * tri - 0.1), push = on * (st < 0.5 ? 1 : 0.35),
      slip = eio(tt, aT, aT + 0.3), back = eio(tt, aT + 0.25, aT + 0.6), cut = eio(tt, aT + 0.2, aT + 0.45);
    return <>
      <RBox s={[0.9, 0.04, 0.5]} r={0.01} p={[0, 0.02, 0]}>{M.wood({ base: [170, 130, 84] })}</RBox>
      <group position={[lerp(0.1, 0.2, slip) + sx, lerp(0.088, 0.05, slip), lerp(-0.16, 0.12, slip)]} rotation={[0, lerp(0.1, -0.4, slip), lerp(-0.1, 0, slip)]} scale={1.6}>
        <RBox s={[0.34, 0.008, 0.05]} r={0.003} p={[0, 0, -0.016]}>{M.steel({ col: "#7c828a" })}</RBox>
        <RBox s={[0.34, 0.004, 0.03]} r={0.002} p={[0, -0.002, 0.022]} rot={[0.35, 0, 0]}>{M.chrome()}</RBox>
        <RBox s={[0.022, 0.036, 0.07]} r={0.006} p={[-0.17, 0.006, 0]}><meshStandardMaterial color="#c8a860" metalness={0.8} roughness={0.25} /></RBox>
        <RBox s={[0.14, 0.03, 0.035]} r={0.01} p={[-0.25, 0.01, 0]}>{M.wood({ base: [60, 40, 24] })}</RBox>
      </group>
      <group position={[0.05, 0.05, -0.16]} visible={tt < aT}><RBox s={[0.32, 0.05, 0.09]} r={0.01} p={[0, 0, 0]}><meshStandardMaterial color="#2e3036" roughness={0.95} /></RBox>
        {Array.from({ length: 22 }, (_, i) => { const u = (tt * 2.1 + i / 22) % 1; return <mesh key={i} position={[sx * 1.2 + 0.05 + (rn(i, 1) - 0.5) * 0.05 + 0.16 * u * (rn(i, 3) - 0.2), 0.04 + 0.14 * u - 0.13 * u * u, 0.05 + 0.12 * u]} scale={sm((1 - u) * push)}><sphereGeometry args={[0.01, 6, 6]} />{M.glow({ col: "#ffd070" })}</mesh>; })}</group>
      <group position={[lerp(0.3, 0.35, back), 0.06, 0.06]} rotation={[0, -0.4, 0]}>
        <RBox s={[0.13, 0.05, 0.1]} r={0.025} p={[0, 0, 0]}><meshStandardMaterial color="#c8906a" roughness={0.7} /></RBox>
        {[0, 1, 2, 3].map((i) => <RBox key={i} s={[0.07, 0.03, 0.022]} r={0.01} p={[-0.09, 0.0, -0.036 + i * 0.024]}><meshStandardMaterial color="#c8906a" roughness={0.7} /></RBox>)}
        <mesh position={[-0.02, 0.0262, 0]} rotation={[-PI / 2, 0, 0.6]} scale={[sm(cut), 1, 1]}><planeGeometry args={[0.09, 0.008]} /><meshBasicMaterial color="#b81a1a" /></mesh>
      </group>
      <pointLight position={[0.2, 0.5, 0.4]} intensity={1.4} distance={1.5} color="#e8f0ff" />
      <pointLight position={[0.12 + sx, 0.22, 0.08]} intensity={0.3 + 0.4 * tri * on} distance={0.6} color="#ffffff" />
      <pointLight position={[0.1, 0.15, -0.05]} intensity={0.0001 + 1.1 * push} distance={0.5} color="#ffb050" />
      <hemisphereLight args={["#c8d0e0", "#2a2420", 0.55]} />
    </>;
  }}</U3>;
};

// ---- LluviaVaras · las dos varas del rickshaw entran desde abajo, como si las tuvieras vos en las manos; adelante la calle de Calcuta
// bajo la lluvia caliente: gotas que caen, charcos con anillos y vapor que sube del empedrado ----
const LluviaVaras: React.FC<UP> = ({ d, p }) => {
  const aV = Math.min(sec(p, "varas", 1.0), 0.8);
  return <U3 d={d} bg={p.bg} ground={[70, 66, 62]} mode="wipe" sky="#3a3a3c" key1={[-0.8, 2.4, 1.6]}
    cam={{ at: [-0.08, 0.26, 0], az: [-0.75, -0.6], el: [0.14, 0.12], r: [1.35, 1.25], fov: 36 }}>{(tt) => {
    const lift = eio(tt, aV, aV + 0.6), run = tt * 0.32 * (0.3 + 0.7 * lift), bob = 0.008 * Math.sin(tt * 2 * PI * 1.6) * lift, sc = (x0: number) => ((x0 - run) % 2.4 + 2.4) % 2.4 - 1.2;
    return <>
      {/* el tirador entre las varas */}
      <group position={[0.22, 0, 0]}><Stickman enSitio escala={0.18} rotY={90} guion={[{ t: 0, accion: "caminar", expr: "decidido" }]} semilla={73} contacto={0} color="#2a3a5a" /></group>
      {[-1, 1].map((sd) => <mesh key={sd} position={[-0.06, 0.25 + bob, sd * 0.09]} rotation={[0, 0, PI / 2 - 0.12 + 0.1 * (1 - lift)]}><cylinderGeometry args={[0.012, 0.016, 0.62, 10]} />{M.wood({ base: [130, 92, 54] })}</mesh>)}
      {/* el rickshaw: asiento, capota y dos ruedas que giran */}
      <group position={[-0.42, 0, 0]}>
        <RBox s={[0.26, 0.05, 0.3]} r={0.01} p={[0, 0.33 + bob, 0]}>{M.wood({ base: [110, 40, 30] })}</RBox>
        <RBox s={[0.04, 0.2, 0.3]} r={0.01} p={[-0.12, 0.44 + bob, 0]}>{M.wood({ base: [110, 40, 30] })}</RBox>
        <mesh position={[-0.12, 0.5 + bob, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.3, 20, 1, true, 0, PI]} /><meshStandardMaterial color="#1e1e22" roughness={0.7} side={THREE.DoubleSide} /></mesh>
        {[-1, 1].map((sd) => <group key={sd} position={[0, 0.2, sd * 0.17]} rotation={[0, 0, -run * 5]}>
          <mesh><torusGeometry args={[0.19, 0.012, 8, 32]} /><meshStandardMaterial color="#1a1a1a" roughness={0.6} /></mesh>
          {Array.from({ length: 8 }, (_, k) => <mesh key={k} rotation={[0, 0, (k * PI) / 8]}><boxGeometry args={[0.37, 0.006, 0.006]} />{M.wood({ base: [120, 86, 50] })}</mesh>)}</group>)}
      </group>
      {/* la calle que corre: casas al fondo, charcos con anillos */}
      {Array.from({ length: 8 }, (_, i) => <RBox key={"c" + i} s={[0.28, 0.4 + rn(i, 1) * 0.35, 0.2]} r={0.01} p={[sc(i * 0.3), 0.3, -0.55]}><meshStandardMaterial map={dirtT([150 - i * 6, 120, 96])} roughness={0.9} /></RBox>)}
      {Array.from({ length: 10 }, (_, i) => { const u = (tt * 0.9 + rn(i, 4)) % 1; return <mesh key={"r" + i} position={[sc(rn(i, 5) * 2.4), 0.004, (rn(i, 6) - 0.5) * 0.7]} rotation={[-PI / 2, 0, 0]} scale={sm(0.5 + 1.2 * u)}><ringGeometry args={[0.03, 0.036, 20]} /><meshBasicMaterial color="#e8f0f4" transparent opacity={0.5 * (1 - u)} depthWrite={false} /></mesh>; })}
      {Array.from({ length: 70 }, (_, i) => { const u = (tt * 1.4 + rn(i, 1)) % 1; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 1.8, 1.0 - 1.0 * u, (rn(i, 3) - 0.5) * 1.2]}><boxGeometry args={[0.003, 0.06, 0.003]} /><meshBasicMaterial color="#d8e4ec" transparent opacity={0.55} /></mesh>; })}
      {Array.from({ length: 8 }, (_, i) => { const u = (tt * 0.25 + i / 8) % 1; return <mesh key={"v" + i} position={[sc(rn(i, 7) * 2.4), 0.03 + 0.25 * u, (rn(i, 8) - 0.5) * 0.6]} scale={sm(0.04 + 0.06 * u)}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#e8e8e4" transparent opacity={0.1 * (1 - u)} depthWrite={false} /></mesh>; })}
      <directionalLight position={[0.5, 2, 1]} intensity={1.2} color="#e0e4e8" />
      <hemisphereLight args={["#c8ccd0", "#3a3430", 0.6]} />
    </>;
  }}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { OlorEscudo, BurbujaVidrio, BarroPalas, CuchilloFilo, LluviaVaras };
