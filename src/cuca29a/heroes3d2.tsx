// cuca29a · vuelta 2 (resto): los 21 componentes que quedaban en vector plano pasan a bodegón 3D (estudio3d + kit3d).
// Regla de la vuelta 1: el OBJETO cuenta la idea sin leer, cada cosa llega de a una con peso, un solo rótulo como mucho.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, Head, img, lerp, MZ, phys, RED, Stage, Tag, TX } from "./ckit";
import { ctex, Estudio, fall, Frijol, lathe, M, papel, RBox, rn, V3, Vapor, humoTex } from "./estudio3d";
import { Chorro, Cuchara, Foto3D, Llama, Mano, Olla, Onda, Plato } from "./kit3d";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;
const ent = (tt: number, a: number) => cl(phys(tt, a, 6, 0.5)); // llegada con resorte

// ── 1 · LUPA: dos montoncitos frente a frente; la lupa viaja y agranda lo que mira: uno brilla, el otro es mate y arrugado
const Mate: React.FC<{ p: V3; rot: V3; s: number }> = ({ p, rot, s }) => (
  <mesh position={p} rotation={rot} scale={[s * 1.35, s * 0.62, s * 0.85]} castShadow><dodecahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#6d6258" roughness={1} flatShading /></mesh>);
const H3Lupa: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const lx = tt < 4.2 ? lerp(-2.2, -0.85, eio(tt, 1.4, 2.6)) : lerp(-0.85, 0.85, eio(tt, 4.2, 5.4));
  const zoom = (x: number) => 1 + 1.9 * cl(1 - Math.abs(x - lx) / 0.42) ** 1.2 * cl(tt - 1.6);
  return <>
    <Estudio t={tt} cam={[0, 1.45, 2.55]} look={[0, 0.12, 0.3]} orbit={0.1} fov={32}>
      {Array.from({ length: 28 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.36, x = -0.85 + Math.cos(a) * r, at = 0.2 + i * 0.025;
        return <Frijol key={"b" + i} p={[x, 0.04 + (i % 3) * 0.04 + fall(tt, at, 1.2), 0.3 + Math.sin(a) * r]} rot={[rn(i, 3), rn(i, 4) * 6, 0]} s={0.072 * zoom(x)} c="#a3301c" />; })}
      {Array.from({ length: 28 }, (_, i) => { const a = rn(i, 5) * 6.28, r = Math.sqrt(rn(i, 6)) * 0.36, x = 0.85 + Math.cos(a) * r, at = 0.45 + i * 0.025;
        return <Mate key={"m" + i} p={[x, 0.035 + (i % 3) * 0.035 + fall(tt, at, 1.2), 0.3 + Math.sin(a) * r]} rot={[rn(i, 7), rn(i, 8) * 6, rn(i, 9)]} s={0.066 * zoom(x)} />; })}
      {/* destello que recorre el montón bueno: luz siempre montada */}
      <pointLight position={[-0.85 + 0.4 * Math.sin(tt * 1.3), 0.7, 0.8]} intensity={6 * cl(tt - 2.2) * (1 - cl(tt - 4.4))} distance={2.4} color="#fff2d8" />
      <group position={[lx, 0.62, 0.55]} rotation={[-0.55, 0, 0.12 * Math.sin(tt * 0.9)]}>
        <mesh rotation={[P2, 0, 0]} castShadow><torusGeometry args={[0.42, 0.035, 12, 48]} />{M.cromo("#c9a64a")}</mesh>
        <mesh rotation={[P2, 0, 0]} scale={[1, 0.12, 1]}><sphereGeometry args={[0.41, 48, 24]} /><meshPhysicalMaterial color="#ffffff" roughness={0} transmission={1} thickness={0.35} ior={1.45} transparent opacity={0.35} clearcoat={1} envMapIntensity={2} depthWrite={false} /></mesh>
        <pointLight position={[0, -0.25, 0.2]} intensity={1.2 * cl(tt - 1.6)} distance={1.2} color="#fff6e6" />
        <mesh position={[0.52, 0, 0.36]} rotation={[P2, 0, -0.95]} castShadow><cylinderGeometry args={[0.045, 0.055, 0.6, 14]} />{M.madera("#5a3218")}</mesh>
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 1" title="EL FRIJOL SE ESCOGE BRILLANTE" />
    <Tag tt={tt} at={2.9} x={640} y={960} txt="BRILLA" col={MZ} size={46} />
    <Tag tt={tt} at={5.6} x={1280} y={960} txt="OPACO = VIEJO" col={RED} size={46} />
  </>;
}}</Stage>;

// ── 2 · CHAROLA: el frijol se riega en la charola de peltre; una piedrita gris se enciende y la mano la pinza y la levanta a cámara
const Piedra: React.FC<{ p: V3; s?: number; glow?: number }> = ({ p, s = 0.06, glow = 0 }) => (<group position={p}>
  <mesh scale={[s * 1.2, s * 0.8, s]} castShadow><dodecahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#d9d2c2" roughness={0.85} flatShading emissive="#ffcf70" emissiveIntensity={glow} /></mesh>
  <sprite scale={[s * 7, s * 7, 1]}><spriteMaterial map={humoTex()} color="#ffd27a" transparent opacity={0.55 * glow} depthWrite={false} /></sprite></group>);
const H3Charola: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const glow = 0.6 * cl((tt - 1.8) * 2) * (0.7 + 0.3 * Math.sin(tt * 6));
  const hand = eio(tt, 2.4, 3.4), pin = eio(tt, 3.4, 3.8), lift = eio(tt, 3.9, 5.2);
  const hp: V3 = [lerp(1.8, 0.42, hand) + lift * 0.2, lerp(1.6, 0.32, hand) + lift * 0.95, lerp(-0.6, 0.6, hand) + lift * 0.9];
  return <>
    <Estudio t={tt} cam={[0.35, 1.75, 2.35]} look={[0.3, 0.15, 0.3]} orbit={0.1}>
      <group position={[0, fall(tt, 0.05, 1.2), 0]}>
        <RBox p={[0, 0.03, 0.15]} s={[2.6, 0.04, 1.6]} r={0.02}><meshPhysicalMaterial color="#33465c" roughness={0.3} clearcoat={1} /></RBox>
        {[[0, 0.07, -0.65, 2.6, 0.1, 0.05], [0, 0.07, 0.95, 2.6, 0.1, 0.05], [-1.3, 0.07, 0.15, 0.05, 0.1, 1.6], [1.3, 0.07, 0.15, 0.05, 0.1, 1.6]].map((b, i) =>
          <RBox key={i} p={[b[0], b[1], b[2]]} s={[b[3], b[4], b[5]]} r={0.02}><meshPhysicalMaterial color="#2c4a6e" roughness={0.25} clearcoat={1} /></RBox>)}
      </group>
      {Array.from({ length: 70 }, (_, i) => { const at = 0.4 + i * 0.012; return <Frijol key={i} p={[(rn(i, 1) - 0.5) * 2.3, 0.1 + fall(tt, at, 1.4), 0.15 + (rn(i, 2) - 0.5) * 1.4]} rot={[0, rn(i, 3) * 6, 0]} s={0.07} c="#7a2a1e" />; })}
      <Piedra p={[-0.7, 0.1, 0.5]} glow={glow * 0.6} />
      <Piedra p={[0.75, 0.1, -0.2]} glow={glow * 0.6} />
      <Piedra p={pin > 0.9 ? [hp[0], hp[1] - 0.1, hp[2] - 0.42] : [0.42, 0.13, 0.24]} s={0.13} glow={0.5 + glow} />
      <pointLight position={[0.42, 0.6, 0.5]} intensity={2.5 * glow} distance={1.4} color="#ffd27a" />
      <Mano p={hp} rot={[0.25, -0.3, 0]} pinza={pin} s={1.1} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 2" title="SE LIMPIA EN CHAROLA" />
    <Tag tt={tt} at={5.0} x={1420} y={300} txt="UNA PIEDRITA = UN DIENTE" col={MZ} size={44} />
  </>;
}}</Stage>;

// ── 3 · TRES DEDOS: olla de vidrio, el frijol en el fondo; tres dedos se apoyan afuera, sobre el frijol, y el agua sube hasta el tercero
const H3TresDedos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const fin = ent(tt, 1.3), lvl = eio(tt, 2.6, 5.0), hit = cl((tt - 5.0) * 3) * (1 - cl((tt - 6.4) * 2));
  return <>
    <Estudio t={tt} cam={[-0.5, 1.2, 2.7]} look={[-0.4, 0.6, 0]} orbit={0.08}>
      <Olla mat="vidrio" s={1.3} p={[0, fall(tt, 0.1, 0.4), 0]} nivel={0.52 * lvl} caldo="#bfe3ef" frijol={46} fc="#6a2a1c" hinchado={0.7 * eio(tt, 5.0, 7.0)} t={tt} />
      {lvl > 0.02 && lvl < 0.98 && <Chorro t={tt} a={[0.25, 1.75, 0]} b={[0.25, 0.03 + 0.52 * lvl * 0.96, 0]} r={0.055} c="#e4f4fa" o={0.55} />}
      <group position={[lerp(-2.3, -0.98, fin), 0, 0.25]}>
        <RBox p={[-0.12, 0.47, 0]} s={[0.14, 0.42, 0.34]} r={0.06}><meshPhysicalMaterial color="#b8785a" roughness={0.55} sheen={0.6} sheenColor="#ffcfb0" /></RBox>
        <mesh position={[-1.05, 0.5, 0]} rotation={[0, 0, P2 - 0.08]} castShadow><cylinderGeometry args={[0.15, 0.2, 1.5, 20]} /><meshPhysicalMaterial color="#a86e52" roughness={0.6} sheen={0.5} sheenColor="#ffcfb0" /></mesh>
        <mesh position={[-1.75, 0.55, 0]} rotation={[0, 0, P2 - 0.08]}><cylinderGeometry args={[0.23, 0.23, 0.4, 20]} /><meshStandardMaterial color="#2b3a5e" roughness={0.9} /></mesh>
        {[0, 1, 2].map((i) => <group key={i} position={[0.07, 0.34 + i * 0.095, 0]}>
          <mesh rotation={[0, 0, P2]} castShadow><capsuleGeometry args={[0.042, 0.2, 6, 10]} /><meshPhysicalMaterial color="#b8785a" roughness={0.55} sheen={0.6} sheenColor="#ffcfb0" emissive="#ffb050" emissiveIntensity={i === 2 ? hit * 0.5 : 0} /></mesh>
          <mesh position={[0.06, 0, 0.0]} rotation={[0, 0, P2]}><torusGeometry args={[0.044, 0.005, 6, 16]} /><meshStandardMaterial color="#8a5a40" roughness={0.8} /></mesh>
          <mesh position={[0.15, 0, 0.03]} rotation={[0, 0.3, 0]} scale={[1.2, 0.8, 1]}><circleGeometry args={[0.03, 14]} /><meshPhysicalMaterial color="#e6b7a2" clearcoat={1} roughness={0.2} /></mesh>
          {i === 2 && <mesh position={[-0.02, 0, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.048, 0.012, 10, 24]} />{M.cromo("#e0b84a")}</mesh>}
        </group>)}
      </group>
      <mesh position={[0, 0.53, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.81, 0.012 + 0.01 * hit, 8, 64]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.9 * cl((tt - 4.6) * 2)} toneMapped={false} /></mesh>
    </Estudio>
    <Head tt={tt} kick="TRUCO 3" title="AGUA: TRES DEDOS ARRIBA" />
  </>;
}}</Stage>;

// ── 4 · CHORRO: la olla del remojo se vuelca sobre la coladera (agua turbia afuera), y la jarra le pone agua nueva, clarita
const coladeraGeo = new THREE.SphereGeometry(0.5, 24, 12, 0, 2 * P, P2, P2);
const jarraGeo = lathe([[0, 0], [0.22, 0], [0.26, 0.3], [0.22, 0.55], [0.24, 0.62]]);
const H3Chorro: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const tilt = eio(tt, 1.2, 2.2) * (1 - eio(tt, 4.2, 4.9)), out = cl((tt - 2.0) * 3) * (1 - cl((tt - 4.1) * 4)), col = eio(tt, 2.3, 4.2);
  const jar = eio(tt, 4.6, 5.3) * (1 - eio(tt, 6.6, 7.2)), pour = cl((tt - 5.2) * 3) * (1 - cl((tt - 6.5) * 4)), lvl = eio(tt, 5.3, 6.6);
  return <>
    <Estudio t={tt} cam={[0.25, 1.35, 3.7]} look={[0.2, 0.6, 0]} orbit={0.08}>
      <group position={[-0.08, 0.8, 0]} rotation={[0, 0, -tilt * 1.7]}>
        <Olla p={[-0.66, -0.8, 0]} nivel={tilt > 0.3 ? 0.6 * (1 - col) : lvl > 0 ? 0.6 * lvl : 0.6} caldo={lvl > 0 ? "#c8e2ea" : "#8a6a4c"} frijol={tilt > 0.3 || lvl > 0 ? 0 : 34} t={tt} />
      </group>
      {out > 0.01 && <Chorro t={tt} a={[0.0, 0.85, 0]} b={[1.1, 0.3, 0]} r={0.12 * out} c="#8a6236" o={0.95} />}
      {Array.from({ length: 10 }, (_, i) => <mesh key={"esp" + i} position={[1.15 + (rn(i, 7) - 0.5) * 0.5, 0.12, (rn(i, 8) - 0.5) * 0.4]} scale={0.04 * out * (0.6 + rn(i, 9))}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#efe6d6" roughness={0.4} /></mesh>)}
      <mesh position={[1.15, 0.06, 0]}><cylinderGeometry args={[0.55, 0.5, 0.12, 32]} /><meshPhysicalMaterial color="#e8e4da" roughness={0.25} clearcoat={1} /></mesh>
      <group position={[1.15, 0.5, 0]}>
        <mesh geometry={coladeraGeo} rotation={[P, 0, 0]} position={[0, 0, 0]}><meshStandardMaterial color="#c8ccd2" metalness={0.9} roughness={0.3} wireframe /></mesh>
        <mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.5, 0.02, 8, 40]} />{M.cromo()}</mesh>
        {Array.from({ length: 34 }, (_, i) => { const k = cl((col - i / 40) * 3), a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.32;
          return <Frijol key={i} p={[Math.cos(a) * r, -0.38 + (i % 4) * 0.05 + (1 - k) * 0.6, Math.sin(a) * r]} rot={[rn(i, 3), rn(i, 4) * 6, 0]} s={k > 0 ? 0.05 : 0.0001} hinchado={0.4} />; })}
        <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.18, 0.22, 0.04, 20]} />{M.cromo()}</mesh>
      </group>
      <group position={[lerp(-2.6, -1.2, jar), 1.55 + 0.1 * jar, 0]} rotation={[0, 0, -pour * 1.1]}>
        <mesh geometry={jarraGeo} castShadow>{M.vidrio()}</mesh>
        <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.235, 0.2, 0.4 * (1 - lvl * 0.7), 24]} />{M.liquido("#cfe8f0", 0.5)}</mesh>
        <mesh position={[-0.27, 0.35, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.13, 0.025, 8, 20, P]} />{M.vidrio()}</mesh>
      </group>
      {pour > 0.01 && <Chorro t={tt} a={[-0.95, 1.6, 0]} b={[-0.74, 0.35, 0]} r={0.085 * pour} c="#d8f2ff" o={0.6} />}
    </Estudio>
    <Head tt={tt} kick="TRUCO 4" title="EL AGUA DEL REMOJO SE TIRA" />
  </>;
}}</Stage>;

// ── 5 · PERILLA: la perilla grande gira y la corona de gas crece con ella: hervor fuerte; después vuelve y la olla queda en un hervor quieto
const H3Perilla: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const up = phys(tt, 0.8, 4, 0.45), dn = eio(tt, 4.0, 5.0), ang = lerp(0, 2.4, cl(up)) * (1 - dn * 0.72), f = ang / 2.4;
  return <>
    <Estudio t={tt} cam={[0.75, 1.25, 2.9]} look={[0.25, 0.45, 0.3]} orbit={0.08} mesa={false}>
      <RBox p={[0, -0.06, 0]} s={[4.2, 0.12, 2.4]} r={0.04}><meshPhysicalMaterial color="#141414" roughness={0.35} clearcoat={0.8} /></RBox>
      <Llama p={[-0.3, 0.02, -0.1]} f={f} t={tt} r={0.36} />
      <group position={[-0.3, 0.12, -0.1]}><Olla mat="vidrio" nivel={0.7} caldo="#b07a50" frijol={30} hervor={0.6 + 2.4 * f} t={tt} s={0.95} /></group>
      <Vapor t={tt} p={[-0.3, 0.9, -0.1]} o={0.15 + 0.35 * f} h={1.2 + f} s={0.35} spread={0.5} n={14} />
      <group position={[0.95, 0.25, 1.15]} rotation={[-P2 + 0.55, 0, 0]} scale={2.4}>
        <mesh castShadow><cylinderGeometry args={[0.26, 0.28, 0.16, 40]} />{M.cromo("#e8e8ea")}</mesh>
        <group rotation={[0, -ang, 0]}><RBox p={[0, 0.11, 0]} s={[0.08, 0.08, 0.46]} r={0.03}><meshStandardMaterial color="#1a1a1a" roughness={0.4} /></RBox>
          <mesh position={[0, 0.16, -0.18]}><sphereGeometry args={[0.05, 12, 8]} /><meshBasicMaterial color="#ff5a3a" toneMapped={false} /></mesh></group>
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 5" title="LUMBRE FUERTE AL PRINCIPIO" />
  </>;
}}</Stage>;

// ── 6 · DUELO: dos ollas de vidrio; a una le cae agua hirviendo (el frijol se infla y aclara), a la otra agua con hielo (se arruga y oscurece)
const H3Duelo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const pour = cl((tt - 1.0) * 3) * (1 - cl((tt - 2.6) * 3)), eff = eio(tt, 2.4, 5.2);
  return <>
    <Estudio t={tt} cam={[0, 1.35, 3.4]} look={[0, 0.5, 0]} orbit={0.08}>
      <Llama p={[-0.95, -0.02, 0]} f={1} t={tt} r={0.42} />
      <pointLight position={[-1.6, 1.2, 1.2]} intensity={5} distance={4} color="#ff9a50" />
      <pointLight position={[1.6, 1.2, 1.2]} intensity={5} distance={4} color="#6aaaff" />
      <Olla mat="vidrio" p={[-0.95, 0, 0]} s={0.95} nivel={0.6} caldo="#d9963f" frijol={26} fs={0.08} hinchado={1.6 * eff} fc="#9a4028" t={tt} hervor={0.6 + eff} />
      <Olla mat="vidrio" p={[0.95, 0, 0]} s={0.95} nivel={0.6} caldo="#8cc8f0" frijol={26} fs={0.08} hinchado={-0.7 * eff} fc={eff > 0.5 ? "#2a1418" : "#4d3a40"} t={tt} />
      {pour > 0.01 && <Chorro t={tt} a={[-0.95, 2.1, 0]} b={[-0.95, 0.62, 0]} r={0.05 * pour} c="#e8b07a" o={0.6} />}
      {pour > 0.01 && <Chorro t={tt} a={[0.95, 2.1, 0]} b={[0.95, 0.62, 0]} r={0.05 * pour} c="#d8f0f8" o={0.6} />}
      {Array.from({ length: 6 }, (_, i) => { const y = 0.6 + fall(tt, 1.2 + i * 0.15, 1.4) + 0.02 * Math.sin(tt * 2 + i);
        return <RBox key={i} p={[0.95 + (rn(i, 1) - 0.5) * 0.6, y, (rn(i, 2) - 0.5) * 0.5]} s={[0.34, 0.34, 0.34]} r={0.05} rot={[rn(i, 3), rn(i, 4), 0]}><meshPhysicalMaterial color="#e4f6ff" roughness={0.12} transmission={0.5} thickness={0.2} transparent opacity={0.85} clearcoat={1} /></RBox>; })}
      <Vapor t={tt} p={[-0.95, 0.65, 0]} o={0.45 + 0.4 * eff} h={1.6} s={0.45} spread={0.5} n={20} />
      <Vapor t={tt * 0.5} p={[0.95, 0.4, 0.2]} o={0.12 * eff} h={0.3} s={0.5} spread={0.9} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 6" title="SI LE FALTA AGUA: SIEMPRE CALIENTE" />
    <Tag tt={tt} at={4.6} x={650} y={960} txt="SE ABLANDA" col={MZ} size={44} />
    <Tag tt={tt} at={5.0} x={1270} y={960} txt="SE ENDURECE" col="#8fc4ff" size={44} />
  </>;
}}</Stage>;

// ── 7 · CUCHARA: una pizca entre dos dedos sobre la olla: los granitos blancos caen en cámara lenta y el caldo burbujea fino; la cucharita queda vacía al lado
const H3Cuchara: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const hand = eio(tt, 0.9, 2.0), drop = cl((tt - 2.4) / 2.6), fizz = cl((tt - 3.4) * 1.5);
  const hp: V3 = [lerp(1.8, 0.18, hand), lerp(2.2, 1.55, hand), lerp(-0.3, 0.1, hand)];
  return <>
    <Estudio t={tt} cam={[0.5, 1.75, 2.75]} look={[0.2, 1.0, 0]} orbit={0.08}>
      <Olla p={[0, 0, 0]} nivel={0.75} caldo="#4a2218" frijol={30} t={tt} hervor={0.2} />
      {Array.from({ length: 40 }, (_, i) => { const k = drop * 1.8 - i * 0.022; if (k <= 0 || k > 1) return null;
        return <mesh key={i} position={[hp[0] + (rn(i, 1) - 0.5) * 0.14 * k, hp[1] - 0.15 - k * 0.82, hp[2] - 0.38 + (rn(i, 2) - 0.5) * 0.14 * k]} rotation={[rn(i, 3) * 3, rn(i, 4) * 3, 0]} scale={0.036} castShadow><boxGeometry /><meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1} emissive="#ffffff" emissiveIntensity={0.6} /></mesh>; })}
      {[3.0, 3.4, 3.8, 4.2].map((a, i) => <Onda key={"o" + i} p={[0.18 + (rn(i, 5) - 0.5) * 0.2, 0.58, -0.28 + (rn(i, 6) - 0.5) * 0.2]} t={tt} a={a} r={0.3} />)}
      {Array.from({ length: 16 }, (_, i) => { const k = (tt * 2.2 + rn(i, 3)) % 1; return <mesh key={"f" + i} position={[(rn(i, 4) - 0.5) * 0.5, 0.58, (rn(i, 5) - 0.5) * 0.5]} scale={0.001 + 0.022 * fizz * Math.sin(k * P)}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#f4e8d8" transparent opacity={0.8} /></mesh>; })}
      <Onda p={[0.18, 0.58, -0.28]} t={tt} a={3.0} r={0.35} />
      <Mano p={hp} rot={[0.5, -0.4, 0]} pinza={0.85} dedos={2} s={1.1} />
      <Cuchara p={[0.9, 0.05, 0.55]} rot={[0, 0.9, 0]} s={0.9} mat="cromo" />
    </Estudio>
    <Head tt={tt} kick="TRUCO 7" title="BICARBONATO: SÓLO UNA PIZCA" />
  </>;
}}</Stage>;

// ── 8 · SOPLIDO: primer plano del frijol en la cuchara de palo; el soplido le pega y la cáscara se abre y se enrosca: ya está
const H3Soplido: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const puff = cl((tt - 2.4) / 1.2), open = phys(tt, 3.2, 5, 0.55);
  return <>
    <Estudio t={tt} cam={[0.1, 1.25, 2.3]} look={[0, 0.82, 0]} orbit={0.1} fov={30}>
      <group position={[0, 0.72 + fall(tt, 0.2, 0.8) * 0.4, 0]} rotation={[0.15, -0.35, 0]}>
        <Cuchara p={[0, 0, 0]} s={1.9} />
        <group position={[0, 0.08, 0]} scale={0.24}>
          <mesh scale={[1.45, 0.75, 0.9]}><sphereGeometry args={[0.92, 24, 16]} /><meshStandardMaterial color="#e8d2b0" roughness={0.7} /></mesh>
          <mesh scale={[1.5, 0.8, 0.95]}><sphereGeometry args={[1, 32, 20, 0.35 + 1.6 * cl(open), 2 * P - 0.35 - 1.6 * cl(open)]} /><meshPhysicalMaterial color="#7a2c1e" roughness={0.3} clearcoat={0.7} side={THREE.DoubleSide} /></mesh>
          {/* la tira de cáscara: cinta que se levanta y se enrosca */}
          <mesh position={[1.35, 0.25 * cl(open), 0]} rotation={[0, 0, 0.4 - 1.2 * cl(open)]} scale={[1, 1, 0.35]}><torusGeometry args={[0.32, 0.07, 10, 32, 0.01 + 4.2 * cl(open)]} /><meshPhysicalMaterial color="#7a2c1e" roughness={0.3} clearcoat={0.7} side={THREE.DoubleSide} /></mesh>
        </group>
      </group>
      {Array.from({ length: 30 }, (_, i) => { const k = puff * 1.6 - i * 0.025; if (k <= 0 || k >= 1) return null;
        return <sprite key={i} position={[-1.3 + k * 1.6, 0.9 + (rn(i, 1) - 0.5) * 0.22 + 0.05 * Math.sin(k * 9 + i), (rn(i, 2) - 0.5) * 0.25]} scale={[0.34 + k * 0.4, 0.22 + k * 0.14, 1]}><spriteMaterial map={humoTex()} color="#cfe9ff" transparent opacity={0.9 * Math.sin(k * P)} depthWrite={false} /></sprite>; })}
      {Array.from({ length: 12 }, (_, i) => { const k = puff * 1.5 - i * 0.04; if (k <= 0 || k >= 1) return null;
        return <mesh key={"g" + i} position={[-1.2 + k * 1.5, 0.92 + (rn(i, 6) - 0.5) * 0.2, (rn(i, 7) - 0.5) * 0.2]} scale={0.012}><sphereGeometry args={[1, 8, 6]} /><meshPhysicalMaterial color="#eaf6fa" roughness={0} clearcoat={1} transparent opacity={0.8} /></mesh>; })}
      <Vapor t={tt} p={[0, 0.85, 0]} o={0.25} h={0.7} s={0.18} spread={0.1} n={8} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 8" title="LA PRUEBA DEL SOPLIDO" />
    <Tag tt={tt} at={4.2} x={1450} y={820} txt="¡YA ESTÁ!" col={MZ} size={58} hand />
  </>;
}}</Stage>;

// ── 9 · ESTANTE: cuatro frascos en la repisa, cada uno con su relojito; las agujas corren a distinto paso y cada frijol «se cuece» cuando le toca
const relojTex = () => ctex("reloj", 256, 256, (g) => {
  g.fillStyle = "#f6f1e4"; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.strokeStyle = "#2a1c12"; g.lineWidth = 8; g.stroke();
  g.lineWidth = 6; for (let i = 0; i < 12; i++) { const a = (i / 12) * 2 * P; g.beginPath(); g.moveTo(128 + Math.cos(a) * 100, 128 + Math.sin(a) * 100); g.lineTo(128 + Math.cos(a) * 84, 128 + Math.sin(a) * 84); g.stroke(); }
});
const frascoGeo = lathe([[0, 0], [0.26, 0], [0.29, 0.04], [0.3, 0.62], [0.24, 0.7], [0.23, 0.78]]);
const FR = [{ c: "#1a1012", n: "NEGRO", d: 5.6 }, { c: "#c9a46a", n: "BAYO", d: 2.4 }, { c: "#b07a5a", n: "PINTO", d: 3.4 }, { c: "#c8909a", n: "FLOR DE MAYO", d: 4.4 }];
const H3Estante: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => <>
  <Estudio t={tt} cam={[0, 1.25, 3.95]} look={[0, 0.85, 0]} orbit={0.08}>
    <RBox p={[0, 0.3, -0.1]} s={[4.0, 0.08, 0.8]} r={0.02}>{M.madera("#6a4428")}</RBox>
    <RBox p={[0, 1.2, -0.55]} s={[4.2, 2.2, 0.06]} r={0.02}>{M.madera("#8a6a4a")}</RBox>
    {FR.map((f, i) => { const x = -1.45 + i * 0.97, k = cl((tt - 1.0) / (f.d - 1.0)), done = phys(tt, f.d, 6, 0.5), up = phys(tt, -0.25 + i * 0.12, 5, 0.42), y = 0.34 - 0.9 * (1 - cl(up)) + 0.05 * (up - cl(up));
        if (up <= 0.001) return null;
      return <group key={i} position={[x, y, 0]}>
        {Array.from({ length: 14 }, (_, j) => <Frijol key={j} p={[(rn(j + i * 40, 1) - 0.5) * 0.3, 0.07 + (j % 5) * 0.1, (rn(j + i * 40, 2) - 0.5) * 0.24]} rot={[rn(j, 3), rn(j, 4) * 6, 0]} s={0.075} c={f.c} hinchado={cl(done) * 0.8} />)}
        <mesh geometry={frascoGeo} castShadow>{M.vidrio()}</mesh>
        <mesh position={[0, 0.82, 0]}><cylinderGeometry args={[0.25, 0.25, 0.08, 28]} />{M.cromo("#b8962e")}</mesh>
        <group position={[0, 1.18 + 0.08 * cl(done), 0.1]} scale={1.75 * (1 + 0.25 * cl(done) * (1 - cl(tt - f.d - 0.6)))}>
          <mesh><circleGeometry args={[0.17, 32]} /><meshStandardMaterial map={relojTex()} roughness={0.6} emissive={cl(done) > 0.5 ? "#ffcf70" : "#000"} emissiveIntensity={0.25 * cl(done)} /></mesh>
          <mesh position={[0, 0, 0.005]} rotation={[0, 0, -k * 2 * P]}><planeGeometry args={[0.026, 0.27]} /><meshBasicMaterial color="#8a2f24" /></mesh>
          <mesh position={[0, 0, 0.004]} rotation={[0, 0, P2]}><ringGeometry args={[0.13, 0.165, 48, 1, 0, 2 * P * k]} /><meshBasicMaterial color={cl(done) > 0.5 ? "#e0a020" : "#c98a3a"} transparent opacity={0.55} /></mesh>
        </group>
        <Vapor t={tt} p={[0, 0.9, 0]} o={0.3 * cl(done) * (1 - cl(tt - f.d - 1.2))} h={0.6} s={0.2} spread={0.1} n={6} />
      </group>; })}
  </Estudio>
  <Head tt={tt} kick="TRUCO 9" title="CADA FRIJOL TIENE SU TIEMPO" />
</>}</Stage>;

// ── 10 · SALERO: dos ollas; a una le cae sal al principio (el frijol queda duro y rebota), a la otra cuando ya se infló: ésa queda suave
const saleroGeo = lathe([[0, 0], [0.16, 0], [0.18, 0.05], [0.18, 0.4], [0.15, 0.46]]);
const Salero: React.FC<{ p: V3; sh: number; t: number }> = ({ p, sh, t }) => (
  <group position={p} rotation={[0, 0, P - 0.5 + 0.25 * sh * Math.sin(t * 22)]}>
    <mesh geometry={saleroGeo} castShadow>{M.vidrio()}</mesh>
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.165, 0.165, 0.3, 20]} /><meshStandardMaterial color="#fbfbfb" roughness={0.9} /></mesh>
    <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.15, 0.16, 0.1, 24]} />{M.cromo()}</mesh>
  </group>);
const Sal: React.FC<{ x: number; t: number; a: number }> = ({ x, t, a }) => <>{Array.from({ length: 44 }, (_, i) => { const k = (t - a) * 1.1 - i * 0.022; if (k <= 0 || k >= 1) return null;
  return <mesh key={i} position={[x + (rn(i, 1) - 0.5) * 0.3 * k, 1.2 - k * 0.65, (rn(i, 2) - 0.5) * 0.3 * k]} rotation={[rn(i, 3) * 3, rn(i, 4) * 3, 0]} scale={0.036} castShadow><boxGeometry /><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.3} /></mesh>; })}</>;
const H3Salero: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
    const soft = eio(tt, 2.0, 4.6);
  return <>
    <Estudio t={tt} cam={[0, 1.75, 3.5]} look={[0, 0.65, 0]} orbit={0.08}>
      <Olla mat="vidrio" p={[-0.95, 0, 0]} s={0.9} nivel={0.6} caldo="#b08a66" frijol={24} fs={0.085} hinchado={-0.35 * soft} fc="#3a1410" t={tt} hervor={0.9} />
      <Olla mat="vidrio" p={[0.95, 0, 0]} s={0.9} nivel={0.6} caldo="#b08a66" frijol={24} fs={0.085} hinchado={1.3 * soft} fc="#9a4028" t={tt} hervor={0.3} />
      <Salero p={[-0.95, 1.35 + 1.5 * (1 - eio(tt, 0.6, 1.3)) + 1.5 * eio(tt, 2.8, 3.4), 0]} sh={tt > 1.4 && tt < 2.6 ? 1 : 0} t={tt} />
      <Salero p={[0.95, 1.35 + 1.5 * (1 - eio(tt, 4.2, 4.9)), 0]} sh={tt > 5.0 && tt < 6.2 ? 1 : 0} t={tt} />
      <Sal x={-0.95} t={tt} a={1.4} /><Sal x={0.95} t={tt} a={5.0} />
      <Vapor t={tt} p={[0.95, 0.6, 0]} o={0.3} h={1.0} s={0.3} spread={0.4} />
      <Vapor t={tt} p={[-0.95, 0.6, 0]} o={0.3} h={1.0} s={0.3} spread={0.4} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 10" title="LA SAL, CUANDO YA ESTÁN SUAVES" />
    <Tag tt={tt} at={2.8} x={640} y={960} txt="SAL ANTES = DUROS" col={RED} size={42} />
    <Tag tt={tt} at={6.0} x={1280} y={960} txt="SAL AL FINAL" col={MZ} size={42} />
  </>;
}}</Stage>;

// ── 11 · ERRORES (bloque): una foto GRANDE por error, parada sobre la mesa; al llegar la siguiente, la anterior cae boca abajo a la pila
const numTex = (n: string, c: string) => papel("num" + n + c, [n], { w: 256, h: 256, size: 190, ink: c, bg: "#f6f1e4", font: "900 190px Georgia, serif" });
const H3Errores: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#2a0f0a" mesa={false}>{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[];
  return <>
    <Estudio t={tt} cam={[0.1, 1.45, 3.9]} look={[0.1, 0.85, 0]} orbit={0.06}>
      {E.map((e, i) => { const ea = i === 0 ? -0.6 : e.a - h.at, nx = E[i + 1] ? E[i + 1].a - h.at : 1e9, k = ent(tt, ea), gone = eio(tt, nx, nx + 0.7);
        if (tt < ea - 0.2) return null;
        const p: V3 = [lerp(0.35, -1.25, gone), lerp(0.95 + (1 - k) * 0.9, 0.03 + i * 0.025, gone), lerp(0.2, -0.1, gone)];
        return <Foto3D key={i} src={img(h.imgs?.[i] ?? h.bg ?? "")} p={p} rot={[lerp(-0.08, -P2, gone), lerp(0, 0.3, gone), (1 - k) * 0.3 + 0.04 * Math.sin(tt + i)]} w={1.9} h={1.2} dim={0.1}>
          <mesh position={[-0.82, 0.5, 0.03]} rotation={[0, 0, 0.12]}><planeGeometry args={[0.42, 0.42]} /><meshStandardMaterial map={numTex(String(i + 1), "#b8281c")} roughness={0.9} /></mesh>
        </Foto3D>; })}
    </Estudio>
    <Head tt={tt} kick="LOS 5 ERRORES" title="LO QUE DEJA EL FRIJOL DURO" col={RED} />
  </>;
}}</Stage>;

// ── 12 · HOJAS: la hoja de aguacate criollo cae meciéndose a la olla, abre una onda en el caldo y el aroma sube verde
const hojaGeo = (() => { const s = new THREE.Shape(); s.moveTo(0, -0.5); s.bezierCurveTo(0.28, -0.3, 0.26, 0.25, 0, 0.55); s.bezierCurveTo(-0.26, 0.25, -0.28, -0.3, 0, -0.5); return new THREE.ShapeGeometry(s, 24); })();
const hojaTex = () => ctex("hoja", 256, 512, (g) => {
  const gr = g.createLinearGradient(0, 0, 256, 0); gr.addColorStop(0, "#2e5a24"); gr.addColorStop(0.5, "#4f8a36"); gr.addColorStop(1, "#2e5a24"); g.fillStyle = gr; g.fillRect(0, 0, 256, 512);
  g.strokeStyle = "#b8d690"; g.lineWidth = 5; g.beginPath(); g.moveTo(128, 512); g.lineTo(128, 0); g.stroke(); g.lineWidth = 2.5;
  for (let y = 60; y < 480; y += 40) { g.beginPath(); g.moveTo(128, y + 30); g.quadraticCurveTo(170, y + 10, 230, y - 10); g.moveTo(128, y + 30); g.quadraticCurveTo(86, y + 10, 26, y - 10); g.stroke(); }
});
const Hoja: React.FC<{ tt: number; a: number; x: number; ph: number }> = ({ tt, a, x, ph }) => { const k = cl((tt - a) / 2.2), y = lerp(2.4, 0.62, eio(tt, a, a + 2.2));
  return <mesh geometry={hojaGeo} position={[x + 0.35 * Math.sin(tt * 2.4 + ph) * (1 - k), y, 0.1 * Math.cos(tt * 2 + ph)]} rotation={[-P2 + (1 - k) * 0.6 * Math.sin(tt * 3 + ph), 0, ph + (1 - k) * Math.sin(tt * 2.1) * 0.8]} scale={1.25} castShadow>
    <meshPhysicalMaterial map={hojaTex()} roughness={0.35} clearcoat={0.5} side={THREE.DoubleSide} /></mesh>; };
const H3Hojas: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const aroma = cl((tt - 3.6) * 1.2);
  return <>
    <Estudio t={tt} cam={[0.2, 2.1, 3.6]} look={[0, 0.95, 0]} orbit={0.1}>
      <Olla nivel={0.78} caldo="#2a120c" frijol={28} fc="#1a1012" t={tt} hervor={0.3} />
      <group scale={1.3}><Hoja tt={tt} a={0.6} x={-0.12} ph={0.4} /></group><group scale={1.3}><Hoja tt={tt} a={1.5} x={0.18} ph={2.2} /></group>
      <Onda p={[-0.1, 0.6, 0]} t={tt} a={2.8} /><Onda p={[0.18, 0.6, 0]} t={tt} a={3.7} />
      <Vapor t={tt} p={[0, 0.65, 0]} o={0.45 * aroma} h={1.8} s={0.42} spread={0.35} n={18} />
      {Array.from({ length: 14 }, (_, i) => { const per = 2.4, k = ((tt + rn(i, 2) * per) % per) / per; return <sprite key={"v" + i} position={[(rn(i, 4) - 0.5) * 0.3 + 0.1 * Math.sin(tt + i), 0.7 + k * 1.6, (rn(i, 5) - 0.5) * 0.3]} scale={[0.25 + k * 0.4, 0.25 + k * 0.4, 1]}><spriteMaterial map={humoTex()} color="#9ad07a" transparent opacity={0.35 * aroma * Math.sin(k * P)} depthWrite={false} /></sprite>; })}
      <pointLight position={[0, 1.4, 0.6]} intensity={0.01 + 2.2 * aroma} distance={2.5} color="#9ad07a" />
    </Estudio>
    <Head tt={tt} kick="TRUCO 11" title="LA HOJA DE AGUACATE CRIOLLO" />
    <Tag tt={tt} at={4.6} x={1450} y={940} txt="SÓLO PARA EL NEGRO" col={MZ} size={44} />
  </>;
}}</Stage>;

// ── 13 · IDA Y VUELTA: la cebolla y la cabeza de ajo entran enteras a la olla (salpican) y al final salen enteras al plato
const cebTex = () => ctex("ceb2", 256, 128, (g) => { g.fillStyle = "#c98a3a"; g.fillRect(0, 0, 256, 128); g.strokeStyle = "rgba(110,60,20,.5)"; g.lineWidth = 3; for (let x = 0; x < 256; x += 16) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 4, 128); g.stroke(); } });
const Cebolla: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}><mesh scale={[1, 0.9, 1]} castShadow><sphereGeometry args={[0.22, 28, 18]} /><meshStandardMaterial map={cebTex()} roughness={0.35} /></mesh>
    <mesh position={[0, 0.22, 0]}><coneGeometry args={[0.05, 0.1, 10]} /><meshStandardMaterial color="#c9b28a" /></mesh></group>);
const ajoTex = () => ctex("ajo", 128, 256, (g) => { g.fillStyle = "#f4ede0"; g.fillRect(0, 0, 128, 256); g.strokeStyle = "rgba(140,60,150,.55)"; g.lineWidth = 6; for (let x = 8; x < 128; x += 22) { g.beginPath(); g.moveTo(x, 256); g.quadraticCurveTo(x + 6, 128, x, 0); g.stroke(); } });
const Ajo: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>{Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * 6.28; return <mesh key={i} position={[Math.cos(a) * 0.07, 0, Math.sin(a) * 0.07]} rotation={[Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3]} scale={[0.6, 1, 0.6]} castShadow><sphereGeometry args={[0.1, 16, 12]} /><meshStandardMaterial map={ajoTex()} roughness={0.5} /></mesh>; })}
    <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.012, 0.025, 0.08, 8]} /><meshStandardMaterial color="#c9b28a" /></mesh></group>);
const arco = (a: V3, b: V3, k: number, hh = 0.8): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + hh * Math.sin(k * P), lerp(a[2], b[2], k)];
const H3IdaVuelta: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const i1 = eio(tt, 0.8, 1.7), i2 = eio(tt, 1.3, 2.2), o1 = eio(tt, 4.8, 5.8), o2 = eio(tt, 5.2, 6.2), inPot = (k: number, o: number) => k > 0.98 && o < 0.02;
  const cIn: V3 = [-0.15, 0.6, 0], aIn: V3 = [0.2, 0.6, 0.05];
  const cp = o1 > 0 ? arco(cIn, [1.35, 0.15, 0.75], o1) : arco([-1.25, 1.5, 0.3], cIn, i1), ap = o2 > 0 ? arco(aIn, [1.6, 0.12, 0.6], o2) : arco([1.35, 1.5, 0.3], aIn, i2);
  return <>
    <Estudio t={tt} cam={[0, 2.3, 4.0]} look={[0.3, 0.5, 0.1]} orbit={0.15}>
      <Olla nivel={0.72} caldo="#4a2218" frijol={26} t={tt} hervor={0.5} />
      <Plato p={[1.45, 0, 0.7]} s={1.1} />
      <group position={cp}><Cebolla s={1.5} p={[0, inPot(i1, o1) ? -0.1 + 0.02 * Math.sin(tt * 3) : 0.1, 0]} /></group>
      <group position={ap}><Ajo s={1.6} p={[0, inPot(i2, o2) ? -0.08 + 0.02 * Math.sin(tt * 3 + 1) : 0.1, 0]} /></group>
      <Onda p={[-0.15, 0.58, 0]} t={tt} a={1.7} /><Onda p={[0.2, 0.58, 0.05]} t={tt} a={2.2} />
      {[[-0.15, 1.7], [0.2, 2.2]].map(([x, a], j) => Array.from({ length: 12 }, (_, i) => { const k = (tt - a) / 0.7; if (k <= 0 || k >= 1) return null; const ang = rn(i + j * 20, 1) * 6.28, v = 0.25 + 0.35 * rn(i + j * 20, 2);
        return <mesh key={j + "s" + i} position={[x + Math.cos(ang) * v * k, 0.6 + 0.9 * v * Math.sin(k * P), Math.sin(ang) * v * k]} scale={0.03 * (1 - 0.4 * k)}><sphereGeometry args={[1, 10, 8]} />{M.liquido("#6a3420", 0.9)}</mesh>; }))}
      <Vapor t={tt} p={[0, 0.65, 0]} o={0.28} h={1.1} s={0.3} spread={0.4} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 12" title="CEBOLLA Y AJO, ENTEROS" />
    <Tag tt={tt} at={6.0} x={1480} y={980} txt="ENTRAN Y SALEN ENTEROS" col={MZ} size={40} />
  </>;
}}</Stage>;

// ── 15 · QUEMADA: el cucharón pasa el frijol de la olla pegada a la limpia, sin raspar; al final la olla vieja se inclina y deja ver la costra negra
const H3Quemada: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const cyc = cl((tt - 0.8) / 3.9) * 3, ph = cyc % 1, n = Math.floor(cyc), mov = tt > 0.8 && tt < 4.7;
  const L = 1 - cl((tt - 0.8) / 3.9), show = eio(tt, 4.9, 5.7);
  const lp: V3 = mov ? arco([-0.85, 0.45, 0], [0.85, 0.55, 0], ph < 0.15 ? 0 : ph > 0.85 ? 1 : (ph - 0.15) / 0.7, 0.7) : [lerp(-0.85, -2.4, cl(tt - 4.7)), 0.9, 0];
  return <>
    <Estudio t={tt} cam={[0, 2.85, 3.1]} look={[0, 0.3, 0]} orbit={0.08}>
      <group position={[-0.95, 0.3 * show, 0.2 * show]} rotation={[show * 1.05, 0, 0]}>
        <Olla s={0.9} nivel={0.6 * L} caldo="#3e1a10" frijol={Math.round(26 * L)} t={tt} />
        <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[0.46, 0.46, 0.03, 40]} /><meshStandardMaterial color="#0b0806" roughness={1} /></mesh>
        {Array.from({ length: 40 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.42; return <mesh key={i} position={[Math.cos(a) * r, 0.05, Math.sin(a) * r]} scale={[0.06, 0.025, 0.05]} rotation={[0, rn(i, 3) * 6, 0]}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={i % 3 ? "#120c08" : "#2a1810"} roughness={1} flatShading /></mesh>; })}
        <Vapor t={tt} p={[0, 0.1, 0]} o={0.35 * show} h={1.0} s={0.25} spread={0.3} n={8} />
      </group>
      <Vapor t={tt} p={[-0.95, 0.4, 0]} o={0.18} h={0.8} s={0.25} spread={0.3} n={8} />
      <Olla p={[0.95, 0, 0]} s={0.9} nivel={0.1 + 0.6 * (1 - L)} caldo="#4a2218" frijol={Math.round(26 * (1 - L))} t={tt} />
      <group position={lp} rotation={[0, 0, mov && ph > 0.8 ? -1.2 : 0]}>
        <mesh scale={[1, 0.85, 1]} castShadow><sphereGeometry args={[0.24, 28, 14, 0, 2 * P, P2, P2]} /><meshStandardMaterial color="#8a5a32" roughness={0.7} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.24, 0.02, 8, 32]} />{M.madera("#7a4a26")}</mesh>
        <mesh position={[0.36, 0.4, 0]} rotation={[0, 0, -0.75]} castShadow><cylinderGeometry args={[0.035, 0.045, 1.0, 12]} />{M.madera("#6a3c1e")}</mesh>
        {mov && ph > 0.15 && ph < 0.85 && Array.from({ length: 7 }, (_, i) => <Frijol key={i} p={[(rn(i + n * 9, 1) - 0.5) * 0.2, -0.04, (rn(i, 2) - 0.5) * 0.2]} s={0.05} />)}</group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 14" title="SE PASAN DE OLLA, SIN RASPAR" />
    <Tag tt={tt} at={5.6} x={560} y={980} txt="LO QUEMADO SE QUEDA" col={RED} size={42} />
  </>;
}}</Stage>;

// ── 16 · MACHACA: el machacador baja una y otra vez en la cazuela; el frijol se aplasta y el puré sube con su caldo que cae de la jarrita
const jarritoGeo = lathe([[0, 0], [0.12, 0], [0.18, 0.12], [0.16, 0.3], [0.1, 0.36], [0.12, 0.4]]);
const cazGeo = lathe([[0, 0], [0.7, 0], [0.85, 0.12], [0.92, 0.3], [0.96, 0.34]]);
const H3Machaca: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const hits = [1.2, 2.0, 2.8, 3.6, 4.4, 5.2], last = hits.filter((x) => tt > x).length, ph = tt - (hits[last - 1] ?? 0);
  const yMash = tt < 1.2 ? lerp(2.2, 0.75, eio(tt, 0.4, 1.0)) : 0.28 + 0.45 * cl(Math.abs(Math.sin(cl((tt - 1.2) / 0.8) * P * (tt < 5.6 ? 1 : 0)))) + (tt > 5.6 ? eio(tt, 5.6, 6.2) * 0.8 : 0);
  const pure = cl(last / 6), pour = cl((tt - 2.4) * 3) * (1 - cl((tt - 3.6) * 3));
  return <>
    <Estudio t={tt} cam={[0, 2.15, 2.95]} look={[0, 0.3, 0]} orbit={0.1}>
      <mesh geometry={cazGeo} castShadow receiveShadow><meshStandardMaterial color="#c47640" roughness={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.05 + 0.1 * pure, 0]}><cylinderGeometry args={[0.78 + 0.1 * pure, 0.7, 0.06 + 0.18 * pure, 40]} /><meshPhysicalMaterial color="#3a1810" roughness={0.35} clearcoat={0.7} transparent opacity={0.3 + 0.7 * pure} /></mesh>
      {Array.from({ length: 40 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.6, sq = cl(last / 5 - rn(i, 3) * 0.5);
        return sq > 0.95 ? null : <mesh key={i} position={[Math.cos(a) * r, 0.08 + 0.12 * pure, Math.sin(a) * r]} rotation={[0, rn(i, 4) * 6, 0]} scale={[0.075 * (1 + sq), 0.04 * (1 - sq * 0.8), 0.05 * (1 + sq * 0.6)]} castShadow><sphereGeometry args={[1, 14, 10]} /><meshPhysicalMaterial color="#6a2a1c" roughness={0.3} clearcoat={0.6} /></mesh>; })}
      <group position={[0.05, yMash, 0]}>
        <mesh rotation={[P2, 0, 0]} castShadow><torusGeometry args={[0.28, 0.025, 8, 32]} />{M.cromo()}</mesh>
        {[-0.18, -0.06, 0.06, 0.18].map((z) => <mesh key={z} position={[0, 0, z]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.012, 0.012, 0.52, 8]} />{M.cromo()}</mesh>)}
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.02, 0.02, 1.0, 10]} />{M.cromo()}</mesh>
        <mesh position={[0, 1.05, 0]}><capsuleGeometry args={[0.06, 0.25, 6, 12]} />{M.madera("#5a3218")}</mesh>
      </group>
      {Array.from({ length: 8 }, (_, i) => { const k = cl(ph * 3 - i * 0.05); return last > 0 && k < 1 && k > 0 ? <mesh key={"s" + i} position={[Math.cos(i * 0.8) * (0.3 + k * 0.4), 0.2 + Math.sin(k * P) * 0.25, Math.sin(i * 0.8) * (0.3 + k * 0.4)]} scale={0.03 * (1 - k)}><sphereGeometry args={[1, 8, 6]} />{M.liquido("#5a2a1a")}</mesh> : null; })}
      <group position={[-1.05, 1.05 + 0.6 * (1 - eio(tt, 1.9, 2.4)) + 0.6 * eio(tt, 3.7, 4.2), 0.2]} rotation={[0, 0, -1.0 * cl((tt - 2.3) * 3) * (1 - cl((tt - 3.6) * 3))]}>
        <mesh geometry={jarritoGeo} castShadow><meshStandardMaterial color="#9a4f2c" roughness={0.6} side={THREE.DoubleSide} /></mesh>
        <mesh position={[-0.2, 0.2, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.09, 0.025, 8, 16, P]} /><meshStandardMaterial color="#8a4526" roughness={0.65} /></mesh></group>
      {pour > 0.01 && <Chorro t={tt} a={[-0.8, 1.25, 0.2]} b={[-0.4, 0.25, 0.15]} r={0.085 * pour} c="#9a5a34" o={0.95} />}
      {Array.from({ length: 34 }, (_, i) => { const a = rn(i, 21) * 6.28, r = Math.sqrt(rn(i, 22)) * 0.7; return pure < 0.3 ? null : <mesh key={"gr" + i} position={[Math.cos(a) * r, 0.1 + 0.2 * pure, Math.sin(a) * r]} scale={[0.05, 0.022, 0.04].map((v) => v * (0.6 + rn(i, 23)) * pure) as V3}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color={i % 4 ? "#5a2a1a" : "#3a1610"} roughness={0.25} clearcoat={0.8} /></mesh>; })}
      <Vapor t={tt} p={[0, 0.3, 0]} o={0.3} h={1.1} s={0.35} spread={0.7} n={12} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 15" title="MACHACADOS CON SU CALDO" />
  </>;
}}</Stage>;

// ── 17 · INCLINA: la sartén de hierro se inclina y el refrito se despega en una sola pieza, se desliza por el borde y cae al plato
const sartenGeo = lathe([[0, 0], [0.86, 0], [0.98, 0.16], [1.02, 0.2]], 64);
const Refrito: React.FC = () => <>
  <mesh castShadow><cylinderGeometry args={[0.66, 0.7, 0.1, 48]} /><meshPhysicalMaterial color="#4a2216" roughness={0.45} clearcoat={0.6} /></mesh>
  <mesh position={[0, 0.01, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.68, 0.07, 10, 48]} /><meshPhysicalMaterial color="#b8742e" roughness={0.45} clearcoat={0.6} /></mesh>
  {Array.from({ length: 110 }, (_, i) => { const a = rn(i, 31) * 6.28, r = Math.sqrt(rn(i, 32)) * 0.64; return <mesh key={i} position={[Math.cos(a) * r, 0.05, Math.sin(a) * r]} scale={[0.07, 0.03, 0.05].map((v) => v * (0.6 + rn(i, 33))) as V3} rotation={[0, rn(i, 34) * 6, 0]}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color={i % 5 ? "#5a2a1a" : "#8a4a2a"} roughness={0.3} clearcoat={0.9} /></mesh>; })}
</>;
const H3Inclina: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const tilt = eio(tt, 1.6, 3.0) * (1 - eio(tt, 5.4, 6.2)), sl = eio(tt, 3.0, 4.2), land = phys(tt, 4.2, 6, 0.4), baja = fall(tt, 0.05, 0.5);
  const dp: V3 = sl < 1 ? [lerp(0, 0.95, sl), 0.07, 0] : [1.95, 0.16 + 0.02 * (1 - cl(land)), 0.15];
  return <>
    <Estudio t={tt} cam={[0.5, 1.95, 3.35]} look={[0.6, 0.2, 0]} orbit={0.1}>
      <pointLight position={[-2.4, 0.5, 0.5]} intensity={6} distance={6} color="#ffd9a8" />
      <group position={[-0.5, 0.25 + baja, 0]}>
        <group rotation={[0, 0, -tilt * 0.55]}>
          <mesh geometry={sartenGeo} castShadow receiveShadow><meshStandardMaterial color="#1c1a19" roughness={0.42} metalness={0.65} side={THREE.DoubleSide} /></mesh>
          <RBox p={[-1.55, 0.17, 0]} s={[1.1, 0.07, 0.16]} r={0.03}><meshStandardMaterial color="#1c1a19" roughness={0.5} metalness={0.6} /></RBox>
          {sl < 1 && <group position={dp}><Refrito /></group>}
        </group>
      </group>
      <Plato p={[1.45, 0, 0.15]} s={1.8} />
      {sl >= 1 && <group position={dp} scale={[0.92, 1 - 0.3 * (1 - cl(land)) * Math.sin(cl(land) * P), 0.92]}><Refrito /></group>}
      <Vapor t={tt} p={sl >= 1 ? dp : [-0.5, 0.3, 0]} o={0.3} h={0.9} s={0.3} spread={0.5} n={10} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 17" title="HASTA QUE SE DESPEGAN SOLOS" />
  </>;
}}</Stage>;

// ── 18 · RUTINA (bloque): seis fotos caen de a una sobre la mesa en fila con su número; la cámara viaja a la que se está diciendo
const H3Rutina: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), 0), pos = (i: number): V3 => [-1.9 + (i % 3) * 1.9, 0.02, -0.55 + Math.floor(i / 3) * 1.25];
  const prev = pos(Math.max(0, cur - 1)), nw = pos(cur), k = eio(tt, S[cur].a - h.at, S[cur].a - h.at + 1.0), look: V3 = [lerp(prev[0], nw[0], k) * 0.4, 0.2, lerp(prev[2], nw[2], k) * 0.4];
  return <>
    <Estudio t={tt} cam={[look[0] * 0.6, 4.6, look[2] + 4.3]} look={look} orbit={0.05}>
      {S.map((s, i) => { const a = s.a - h.at; if (tt < a - 0.3) return null; const p = pos(i), on = i === cur, lift = on ? 0.12 * eio(tt, a + 0.6, a + 1.2) : 0;
        return <Foto3D key={i} src={img(h.imgs?.[i] ?? h.bg ?? "")} p={[p[0], p[1] + fall(tt, a, 1.8) + lift, p[2]]} rot={[-P2 + 0.25, 0, (rn(i, 1) - 0.5) * 0.14 + (1 - cl(tt - a)) * 0.5]} w={1.55} h={1.0} dim={on ? 0 : 0.35}>
          <mesh position={[-0.7, 0.44, 0.03]} rotation={[0, 0, 0.1]}><planeGeometry args={[0.36, 0.36]} /><meshStandardMaterial map={numTex(String(i + 1), on ? "#b8281c" : "#2a1c12")} roughness={0.9} /></mesh>
        </Foto3D>; })}
    </Estudio>
    <Head tt={tt} kick="LA RUTINA COMPLETA" title="DE LA CHAROLA AL PLATO" />
    <Tag tt={tt} at={S[cur].a - h.at + 0.5} x={960} y={985} txt={S[cur].tx} col={MZ} size={52} hand key={cur} />
  </>;
}}</Stage>;

// ── 19 · CONGELADOR: se abre la puerta con su niebla fría y las bolsitas planas de frijol con caldo caen de a una a las repisas
const escarchaTex = () => ctex("escarcha", 512, 512, (g) => { g.fillStyle = "#e9f3fa"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 900; i++) { g.strokeStyle = `rgba(255,255,255,${0.2 + 0.5 * rn(i, 2)})`; g.lineWidth = 1 + rn(i, 3) * 2; const x = rn(i, 4) * 512, y = rn(i, 5) * 512, a = rn(i, 6) * 6.28, L = 6 + 18 * rn(i, 7); g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); } });
const H3Congelador: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const door = eio(tt, 0.2, 1.1);
  return <>
    <Estudio t={tt} cam={[0.2, 1.25, 3.55]} look={[0, 0.95, 0]} orbit={0.06} mesa={false}>
      <RBox p={[0, 1.0, -0.6]} s={[2.6, 2.3, 0.08]} r={0.03}><meshStandardMaterial color="#f2f6f8" roughness={0.4} /></RBox>
      {[-1.28, 1.28].map((x) => <RBox key={x} p={[x, 1.0, -0.1]} s={[0.08, 2.3, 1.0]} r={0.03}><meshStandardMaterial color="#dfe9f0" roughness={0.4} /></RBox>)}
      {[-0.1, 2.12].map((y) => <RBox key={y} p={[0, y, -0.1]} s={[2.64, 0.1, 1.0]} r={0.03}><meshStandardMaterial color="#f2f6f8" roughness={0.4} /></RBox>)}
      {[0.65, 1.35].map((y) => <RBox key={y} p={[0, y, -0.1]} s={[2.48, 0.03, 0.9]} r={0.01}><meshPhysicalMaterial color="#dfeef6" roughness={0.1} transmission={0.4} transparent opacity={0.7} /></RBox>)}
      <pointLight position={[0, 1.9, 0.2]} intensity={9} distance={4} color="#8fc8ff" />
      <mesh position={[0, 1.0, -0.55]}><planeGeometry args={[2.5, 2.2]} /><meshStandardMaterial map={escarchaTex()} color="#cfe6f6" roughness={0.6} transparent opacity={0.9} /></mesh>
      <group position={[-1.3, 1.0, 0.42]} rotation={[0, -door * 1.35, 0]}><RBox p={[1.3, 0, 0]} s={[2.62, 2.32, 0.1]} r={0.04}><meshStandardMaterial color="#e8eef2" roughness={0.35} /></RBox></group>
      {Array.from({ length: 7 }, (_, i) => { const a = 1.4 + i * 0.6, sh = [0.02, 0.69, 1.39][Math.floor(i / 3) % 3] ?? 1.39, x = -0.8 + (i % 3) * 0.8, y = sh + 0.06 + (i === 6 ? 0.1 : 0) + fall(tt, a, 1.0);
        if (tt < a - 0.4) return null;
        return <group key={i} position={[i === 6 ? 0 : x, y, 0.0]} rotation={[0, (rn(i, 1) - 0.5) * 0.3, 0]} scale={1.15}>
          <RBox p={[0, 0, 0]} s={[0.62, 0.07, 0.5]} r={0.03}>{M.liquido("#4a2218", 0.95)}</RBox>
          {Array.from({ length: 12 }, (_, j) => <Frijol key={j} p={[(rn(j + i * 20, 1) - 0.5) * 0.5, 0.03, (rn(j + i * 20, 2) - 0.5) * 0.38]} rot={[0, rn(j, 3) * 6, 0]} s={0.04} c="#3a1610" />)}
          <mesh position={[0, 0.05, -0.2]}><boxGeometry args={[0.66, 0.012, 0.03]} /><meshStandardMaterial color="#3a7bd5" roughness={0.4} /></mesh>
          
          <mesh position={[0, 0.051, 0.1]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.36, 0.12]} /><meshStandardMaterial map={papel("bol" + i, ["frijol · " + (i + 1)], { size: 70 })} roughness={0.9} /></mesh>
        </group>; })}
      {Array.from({ length: 26 }, (_, i) => { const per = 3.2, k = ((tt + rn(i, 2) * per) % per) / per; return <sprite key={"n" + i} position={[(rn(i, 4) - 0.5) * 2.2, 2.0 - k * 1.9, 0.5 + k * 0.9]} scale={[0.6 + k * 0.9, 0.35 + k * 0.5, 1]}><spriteMaterial map={humoTex()} color="#e6f4ff" transparent opacity={0.38 * door * Math.sin(k * P)} depthWrite={false} /></sprite>; })}
    </Estudio>
    <Head tt={tt} kick="TRUCO 22" title="CONGELADOS, EN PORCIONES CON CALDO" />
  </>;
}}</Stage>;

// ── 20 · NUNCA (bloque): un tendedero; cada «nunca» es una foto colgada con pinzas, y un sello rojo le cae encima con un golpe
const selloTex = () => ctex("sello", 256, 256, (g) => { g.strokeStyle = "#c0392b"; g.fillStyle = "#c0392b"; g.lineWidth = 14; g.beginPath(); g.arc(128, 128, 110, 0, 7); g.stroke(); g.lineWidth = 5; g.beginPath(); g.arc(128, 128, 88, 0, 7); g.stroke();
  g.font = "900 62px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("NUNCA", 128, 132); for (let i = 0; i < 160; i++) { g.clearRect(rn(i, 3) * 256, rn(i, 4) * 256, 3 + 4 * rn(i, 5), 2 + 3 * rn(i, 6)); } });
const H3Nunca: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#24140c" mesa={false}>{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[], cur = E.reduce((c, e, i) => (t >= e.a ? i : c), 0), N = E.length;
  const ca = E[cur].a - h.at, curF = lerp(Math.max(0, cur - 1), cur, eio(tt, ca, ca + 0.8)), camX = 0;
  return <>
    <Estudio t={tt} cam={[camX, 1.4, 3.9]} look={[0, 1.05, 0]} orbit={0.08} mesa={false}>
      <mesh position={[0, 1.78, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.008, 0.008, 12, 6]} /><meshStandardMaterial color="#d8c8a8" /></mesh>
      {E.map((e, i) => { const a = e.a - h.at; if (tt < a - 0.3) return null; const k = ent(tt, a), st = cl((tt - a - 0.7) * 6), px = (i - curF) * 2.7;
        return <group key={i} position={[px, 1.78 + (1 - k) * 1.2, 0]} rotation={[0, 0, 0.05 * Math.sin(tt * 1.4 + i)]}>
          <Foto3D src={img(h.imgs?.[i] ?? h.bg ?? "")} p={[0, -0.5, 0]} w={1.2} h={0.8} dim={i === cur ? 0 : 0.35}>
            {st > 0.01 && <mesh position={[0.36, -0.2, 0.03]} rotation={[0, 0, -0.25]}><planeGeometry args={[0.6, 0.6]} /><meshBasicMaterial map={selloTex()} transparent opacity={0.92 * cl(st * 3)} /></mesh>}
            {tt > a + 0.1 && tt < a + 1.4 && <group position={[0.36, -0.2, 0.05 + 0.9 * (1 - cl(eio(tt, a + 0.2, a + 0.7))) + 0.9 * eio(tt, a + 0.85, a + 1.35)]} rotation={[P2, 0, 0]}>
              <mesh castShadow><cylinderGeometry args={[0.24, 0.24, 0.08, 32]} /><meshStandardMaterial color="#8a1f14" roughness={0.7} /></mesh>
              <mesh position={[0, -0.12, 0]} castShadow><cylinderGeometry args={[0.22, 0.22, 0.16, 32]} />{M.madera("#7a5232")}</mesh>
              <mesh position={[0, -0.3, 0]} castShadow><sphereGeometry args={[0.12, 20, 14]} />{M.madera("#5a3218")}</mesh></group>}
          </Foto3D>
          {[-0.45, 0.45].map((dx) => <RBox key={dx} p={[dx, -0.06, 0.03]} s={[0.05, 0.2, 0.04]} r={0.01}>{M.madera("#c9a06a")}</RBox>)}
        </group>; })}
    </Estudio>
    <Head tt={tt} kick={`LO QUE NUNCA HACÍA · ${cur + 1} DE ${N}`} title="MI ABUELA, NUNCA" col={RED} />
  </>;
}}</Stage>;

// ── 21 · RULETA: de una sola olla salen volando siete platos distintos en arco y la rodean
const Comida: React.FC<{ i: number }> = ({ i }) => {
  const tort = <meshStandardMaterial color="#e8cf98" roughness={0.7} />, salsa = "#5a2a1a";
  if (i === 0) return <>{[-0.12, 0, 0.12].map((z) => <mesh key={z} position={[0, 0.08, z]} rotation={[0, 0, P2]} castShadow><capsuleGeometry args={[0.055, 0.36, 6, 12]} />{tort}</mesh>)}<mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.3, 0.3, 0.02, 24]} />{M.liquido(salsa)}</mesh></>;
  if (i === 1) return <><mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.28, 0.18, 0.18, 24, 1, true]} /><meshStandardMaterial color="#c9672c" roughness={0.6} side={THREE.DoubleSide} /></mesh><mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.27, 0.27, 0.01, 24]} />{M.liquido(salsa)}</mesh></>;
  if (i === 2) return <>{[-0.14, 0.14].map((x) => <mesh key={x} position={[x, 0.07, 0]} scale={[1, 0.45, 0.8]} castShadow><sphereGeometry args={[0.15, 16, 10]} /><meshStandardMaterial color="#d9a25a" roughness={0.6} /></mesh>)}</>;
  if (i === 3) return <><mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.025, 28]} /><meshStandardMaterial color="#e0b468" roughness={0.6} /></mesh>{Array.from({ length: 9 }, (_, j) => <mesh key={j} position={[Math.cos(j) * 0.16, 0.08, Math.sin(j) * 0.16]} scale={0.03}><sphereGeometry /><meshStandardMaterial color={j % 2 ? "#3f9a4a" : "#f2efe4"} /></mesh>)}</>;
  if (i === 4) return <><mesh position={[0, 0.07, 0]} scale={[1, 0.5, 1]} castShadow><sphereGeometry args={[0.2, 18, 12]} /><meshPhysicalMaterial color={salsa} clearcoat={0.5} /></mesh>{[0, 2, 4].map((a) => <mesh key={a} position={[Math.cos(a) * 0.26, 0.08, Math.sin(a) * 0.26]} rotation={[-P2 + 0.3, 0, a]}><circleGeometry args={[0.09, 3]} /><meshStandardMaterial color="#e8c070" side={THREE.DoubleSide} /></mesh>)}</>;
  if (i === 5) return <>{[-0.12, 0.12].map((x) => <mesh key={x} position={[x, 0.1, 0]} rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.12, 0.12, 0.3, 16, 1, true, 0, P]} /><meshStandardMaterial color="#e8cf98" side={THREE.DoubleSide} /></mesh>)}</>;
  return <><mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.26, 0.16, 0.16, 24, 1, true]} /><meshStandardMaterial color="#f2efe4" side={THREE.DoubleSide} /></mesh><mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.25, 0.25, 0.01, 24]} />{M.liquido("#7a3a22")}</mesh><mesh position={[0, 0.17, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.04, 0.1, 20]} /><meshBasicMaterial color="#f8f2e6" /></mesh></>;
};
const H3Ruleta: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => <>
  <Estudio t={tt} cam={[0, 2.7, 3.9]} look={[0, 0.25, 0.2]} orbit={0.18}>
    <Olla nivel={0.72} frijol={20} t={tt} hervor={0.4} s={0.85} />
    <Vapor t={tt} p={[0, 0.7, 0]} o={0.3} h={1.2} s={0.3} spread={0.4} />
    {Array.from({ length: 7 }, (_, i) => { const a0 = 0.7 + i * 0.5, k = eio(tt, a0, a0 + 0.9), ang = (i / 7) * 2 * P - P2 + 0.2 * tt * 0.1, R = 1.6;
      if (tt < a0) return null;
      const p = arco([0, 0.7, 0], [Math.cos(ang) * R, 0.02, Math.sin(ang) * R * 0.78], k, 0.9);
      return <Plato key={i} p={p} rot={[(1 - k) * 2, ang, 0]} s={1.4}><Comida i={i} />
        <mesh position={[0, 0.06, 0.4]} rotation={[-P2 + 0.5, 0, 0]}><planeGeometry args={[0.4, 0.25]} /><meshStandardMaterial map={papel("dia" + i, [["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"][i]], { w: 256, h: 160, size: 96 })} roughness={0.9} /></mesh></Plato>; })}
  </Estudio>
  <Head tt={tt} kick="TRUCO 23" title="UNA OLLA, SIETE COMIDAS" />
</>}</Stage>;

// ── 22 · REPASO (bloque): el mazo de los 24: cada foto cae encima de la pila con su número grande y la cámara baja sobre el mazo
const REP = ["fa06", "fa02", "fa03", "fa04", "fao03", "fa05", "fao10", "fa01", "fao09", "fa17", "fa08", "fa07", "fa19", "fa09", "fao04", "fa18", "fa10", "fa11", "fa12", "fa20", "fa13", "fa21", "fao07", "fa16"];
const H3Repaso: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), 0), from = Math.max(0, cur - 2);
  return <>
    <Estudio t={tt} cam={[0.3, 3.5 - 0.01 * cur, 3.3]} look={[0, 0.1 + cur * 0.012, 0]} orbit={0.1}>
      <RBox p={[0, 0.01 + 0.006 * from, 0]} s={[1.72, 0.012 * from + 0.02, 1.12]} r={0.01}><meshStandardMaterial color="#efe6d4" roughness={0.9} /></RBox>
      {S.slice(from, cur + 1).map((s, j) => { const i = from + j, a = s.a - h.at, k = ent(tt, a);
        return <Foto3D key={i} src={img(REP[i % REP.length])} p={[(rn(i, 1) - 0.5) * 0.25 + (1 - k) * 1.6, 0.02 + i * 0.012 + (1 - k) * 1.0, (rn(i, 2) - 0.5) * 0.2]} rot={[-P2, 0, (rn(i, 3) - 0.5) * 0.5 + (1 - k) * 1.2]} w={1.7} h={1.1} dim={i === cur ? 0 : 0.4}>
          {i === cur && <mesh position={[-0.62, 0.36, 0.03]} rotation={[0, 0, 0.1]}><planeGeometry args={[0.52, 0.52]} /><meshStandardMaterial map={numTex(String(i + 1), "#b8281c")} roughness={0.9} /></mesh>}
        </Foto3D>; })}
    </Estudio>
    <Head tt={tt} kick="REPASO RÁPIDO" title={`LOS 24, EN UN ABRIR Y CERRAR`} />
    <Tag tt={tt} at={S[cur].a - h.at + 0.25} x={960} y={985} txt={S[cur].tx} col={MZ} size={56} hand key={cur} />
  </>;
}}</Stage>;

export const MAP3B: Record<string, C> = { lupa: H3Lupa, charola: H3Charola, tresdedos: H3TresDedos, chorro: H3Chorro, perilla: H3Perilla, duelo: H3Duelo, cuchara: H3Cuchara,
  soplido: H3Soplido, estante: H3Estante, salero: H3Salero, errores: H3Errores, hojas: H3Hojas, idavuelta: H3IdaVuelta, quemada: H3Quemada, machaca: H3Machaca,
  inclina: H3Inclina, rutina: H3Rutina, congelador: H3Congelador, nunca: H3Nunca, ruleta: H3Ruleta, repaso: H3Repaso };
void TX; void Frijol;
