// gary04 · componentes únicos 4/4 (min 17-21 + repaso)
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, fall, tubeG } from "./h3d";
import { PI, Txt3, cl, eio, lerp, phys, pop } from "./gk";
import { House, Snow, Spark } from "./gh1";
import { Roller } from "./gh2";

type V = [number, number, number];
const Shadow: React.FC<{ p: V; r: number; op?: number; s?: number }> = ({ p, r, op = 0.45, s = 1 }) => <mesh position={p} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, s)}><circleGeometry args={[r, 32]} /><meshBasicMaterial color="#000" transparent opacity={op} depthWrite={false} /></mesh>;

// 17:12 · LA VELA Y LA CORTINA: la vela entra deslizándose; la cortina de tela ondulada se mueve hacia la llama y se chamusca; una linterna cae con rebote y llena todo de luz fría
export const HCandle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" bg="#100c09" warm={0.5}
  cam={{ at: [0.04, 0.4, 0], az: [-0.26, -0.02], el: [0.12, 0.08], r: [1.22, 1.1], fov: 30 }} lamp={[0, 0.8, 0.5]}>{(tt) => {
  const slide = cl(phys(tt, 0.3, 5, 0.6)), swap = eio(tt, 2.5, 2.9), cx = lerp(-0.6, 0.06, slide), lean = eio(tt, 0.6, 1.5), scorch = eio(tt, 1.0, 2.4), fl = 0.9 + 0.1 * Math.sin(tt * 11);
  const ly = 0.22 + Math.abs(fall(tt, 3.0, 0.7, 9, 0.2)), cold = cl((tt - 3.6) / 0.25);
  return <>
    {/* la cortina: muchos pliegues finos de tela que ondulan; los cercanos a la llama se acercan; la quemadura negra sube desde el ruedo con borde encendido */}
    {Array.from({ length: 10 }, (_, i) => { const z = -0.08 + 0.02 * Math.sin(tt * 1.6 + i * 0.9) + (i < 4 ? 0.1 * lean * (1 - i / 4) : 0), burn = scorch * Math.max(0, 1 - Math.abs(i * 0.038 - 0.06) / 0.16) * (0.8 + 0.25 * Math.sin(i * 2.3));
      const tilt = i < 5 ? -0.14 * lean * (1 - i / 5) : 0;
      return <group key={i} position={[0.0 + i * 0.038 + 0.84 * tilt, 0, z]} rotation={[0, 0.15 * Math.sin(tt * 1.3 + i * 0.7), tilt]}>
        <mesh position={[0, 0.46, 0]}><cylinderGeometry args={[0.021, 0.021, 0.76, 14, 1, true, -PI / 2, PI]} /><meshStandardMaterial color={i % 2 ? "#7a1e22" : "#8e262a"} side={2} roughness={0.85} /></mesh>
        <mesh position={[0, 0.08 + 0.17 * burn, 0.002]} scale={[1, Math.max(0.001, burn), 1]}><cylinderGeometry args={[0.0215, 0.0215, 0.34, 14, 1, true, -PI / 2, PI]} /><meshStandardMaterial color="#2a1208" side={2} roughness={1} transparent opacity={0.8} /></mesh>
        <mesh position={[0, 0.08 + 0.25 * burn, 0.0025]} scale={[1, Math.max(0.001, burn * 1.5), 1]}><cylinderGeometry args={[0.0218, 0.0218, 0.34, 14, 1, true, -PI / 2, PI]} /><meshStandardMaterial color="#3a1a0a" side={2} roughness={1} transparent opacity={0.35} depthWrite={false} /></mesh>
        <mesh position={[0, 0.08 + 0.34 * burn, 0.003]} rotation={[PI / 2, 0, 0]} scale={burn > 0.02 ? 1 : 0.001}><torusGeometry args={[0.021, 0.006, 6, 14, PI]} />{M.glow({ col: "#ff7a2a", op: 0.95 * (1 - 0.6 * swap) })}</mesh>
      </group>; })}
    <mesh position={[0.17, 0.85, -0.08]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.44, 10]} />{M.brass()}</mesh>
    <RBox s={[0.9, 0.04, 0.42]} p={[-0.12, 0.2, 0.04]} r={0.01}>{M.wood({ base: [110, 72, 44] })}</RBox>
    {[[-0.52, -0.12], [0.28, -0.12], [-0.52, 0.2], [0.28, 0.2]].map(([x, z]) => <mesh key={x + "," + z} position={[x, 0.09, z]}><boxGeometry args={[0.03, 0.18, 0.03]} />{M.wood({ base: [96, 62, 38] })}</mesh>)}
    {/* la vela entra deslizando por la mesa y sale por el mismo lado */}
    <group position={[cx - 0.12, 0.22, 0.04]} scale={1.5}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.022, 0.024, 0.12, 20]} />{M.matte({ col: "#f2ead8" })}</mesh>
      <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.045, 0.05, 0.006, 24]} />{M.brass()}</mesh>
      <mesh position={[0.01 * lean, 0.15, 0]} rotation={[0, 0, -0.35 * lean]} scale={[1, Math.max(0.001, fl * (1 - swap)), 1]}><coneGeometry args={[0.014, 0.05, 14]} />{M.glow({ col: "#ffb040" })}</mesh>
    </group>
    <pointLight position={[cx - 0.1, 0.4, 0.05]} intensity={1.6 * (1 - swap)} distance={0.9} color="#ff9a3a" />
    {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 0.6 + i / 10) % 1; return <mesh key={i} position={[0.03 + Math.sin(i * 2) * 0.03, 0.3 + ph * 0.45, -0.03]}><sphereGeometry args={[0.012 + ph * 0.035, 8, 6]} /><meshBasicMaterial color="#2a2522" transparent opacity={0.4 * scorch * (1 - swap) * (1 - ph)} depthWrite={false} /></mesh>; })}
    {/* la linterna baja desde arriba del cuadro, rebota dos veces y su luz fría manda */}
    <Shadow p={[-0.2, 0.222, 0.1]} r={0.08} s={cl((tt - 3.0) / 0.4)} />
    {/* hilo de humo de la vela recién apagada */}
    {Array.from({ length: 30 }, (_, i) => { const ph = (tt * 0.35 + i / 30) % 1; return <mesh key={"ws" + i} position={[cx - 0.12 + 0.025 * Math.sin(ph * 7 + tt * 1.5) * ph, 0.45 + ph * 0.4, 0.04]}><sphereGeometry args={[0.007 + ph * 0.02, 10, 8]} /><meshBasicMaterial color="#b8b2aa" transparent opacity={0.22 * swap * (1 - ph)} depthWrite={false} /></mesh>; })}
    <group position={[-0.2, ly, 0.1]} scale={1.35} visible={tt > 2.98}>
      <mesh position={[0, 0.025, 0]}><cylinderGeometry args={[0.05, 0.055, 0.05, 24]} />{M.plastic({ col: "#f2b21b" })}</mesh>
      <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.04, 0.04, 0.08, 24]} /><meshStandardMaterial color="#9fb0c0" emissive="#e8f2ff" emissiveIntensity={0.9 * cold} toneMapped={false} /></mesh>
      <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.045, 0.05, 0.02, 24]} />{M.plastic({ col: "#f2b21b" })}</mesh>
      <mesh position={[0, 0.17, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.03, 0.004, 8, 20, PI]} />{M.steel()}</mesh>
    </group>
    <pointLight position={[0.1, 0.95, 0.65]} intensity={1.6 * cold} distance={2.4} color="#bcd4ff" />
  </>;
}}</Scene3D>;

// 17:39 · EL ALARGUE FINO: la estufa con resistencias; el brillo naranja avanza por el cable como una mecha, sale humo y el enchufe se derrite; el rodillo marca 1500 W
export const HThinCord: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" bg="#0e0c0b"
  cam={{ at: [-0.04, 0.2, 0.04], az: [0.25, 0.05], el: [0.36, 0.3], r: [1.38, 1.24], fov: 30 }} lamp={[0, 0.7, 0.4]}>{(tt) => {
  const fuse = eio(tt, 0.8, 3.0), smoke = cl((tt - 2.2) / 0.6), melt = eio(tt, 3.1, 4.1), sl = lerp(-0.6, 0, cl(phys(tt, 0.15, 6, 0.55)));
  const pts: V[] = [[-0.36, 0.03, -0.06], [-0.2, 0.012, 0.08], [0.0, 0.012, 0.14], [0.18, 0.012, 0.06], [0.3, 0.03, -0.05]];
  const N = 16, seg = (u: number): V => { const f = u * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), r = f - i; return [lerp(pts[i][0], pts[i + 1][0], r), lerp(pts[i][1], pts[i + 1][1], r), lerp(pts[i][2], pts[i + 1][2], r)]; };
  const tip = seg(cl(fuse));
  return <>
    <group position={[-0.44 + sl, 0, -0.1]} rotation={[0, 0.4, 0]}>
      <mesh position={[0, 0.16, -0.01]} scale={[1, 1, 0.42]}><cylinderGeometry args={[0.15, 0.16, 0.32, 40]} />{M.plastic({ col: "#b9b4aa" })}</mesh>
      <mesh position={[0, 0.15, 0.051]}><planeGeometry args={[0.2, 0.22]} />{M.matte({ col: "#2a2420" })}</mesh>
      {[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.08 + i * 0.07, 0.056]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.016, 0.016, 0.19, 16]} /><meshStandardMaterial color="#3a2a20" emissive="#ff5a10" emissiveIntensity={1.8} toneMapped={false} /></mesh>)}
      {Array.from({ length: 6 }, (_, i) => <mesh key={"g" + i} position={[-0.09 + i * 0.036, 0.15, 0.07]}><boxGeometry args={[0.004, 0.22, 0.004]} />{M.steel()}</mesh>)}
      <pointLight position={[0, 0.16, 0.2]} intensity={1.0} distance={0.8} color="#ff8a3a" />
      <group position={[0, 0.36, 0.07]}><RBox s={[0.22, 0.08, 0.02]} p={[0, 0, -0.012]} r={0.008}>{M.matte({ col: "#141516" })}</RBox><Roller v={245 + 1255 * eio(tt, 0.2, 1.0)} p={[0, 0, 0]} w={0.2} h={0.065} col="#ffb07a" suf=" W" /></group>
    </group>
    <mesh geometry={tubeG("thin", pts, 0.006, 60, 8)}><meshStandardMaterial color="#e8e2d4" roughness={0.6} /></mesh>
    {/* la mecha: tramos que se encienden de la estufa hacia el enchufe */}
    {fuse > 0.03 && <mesh geometry={tubeG("thinh" + Math.round(fuse * 30), Array.from({ length: 12 }, (_, i) => seg(i / 11 * Math.round(fuse * 30) / 30)), 0.0075, 40, 8)}><meshStandardMaterial color="#c8301a" emissive="#ff2a08" emissiveIntensity={1.3} toneMapped={false} /></mesh>}
    {Array.from({ length: N }, (_, i) => { const u = (i + 0.5) / N, on = cl((fuse - u) / 0.12); return <mesh key={i} position={seg(u)} scale={on > 0 ? 1 : 0.001}><sphereGeometry args={[0.0085, 10, 8]} /><meshStandardMaterial color={u < 0.5 ? "#ff8a2a" : "#e02a10"} emissive={u < 0.33 ? "#ff9a2a" : u < 0.66 ? "#ff5a10" : "#ff1a08"} emissiveIntensity={1.4 * on} toneMapped={false} /></mesh>; })}
    <mesh position={tip} scale={fuse > 0 && fuse < 1 ? 1 : 0.001}><sphereGeometry args={[0.02, 12, 10]} />{M.glow({ col: "#ffd060" })}</mesh>
    <pointLight position={[tip[0], tip[1] + 0.08, tip[2]]} intensity={1.2 * cl(fuse * 4)} distance={0.6} color="#ff5a2a" />
    <group position={[0.34, 0.025, -0.06]} scale={[1 + 0.3 * melt, 1 - 0.6 * melt, 1 + 0.2 * melt]}>
      <RBox s={[0.12, 0.04, 0.07]} r={0.012}><meshStandardMaterial color={melt > 0.3 ? "#4a3a30" : "#ece8de"} roughness={0.7} /></RBox>
    </group>
    {Array.from({ length: 5 }, (_, i) => <mesh key={"d" + i} position={[0.3 + i * 0.02, 0.003, -0.02 + (i % 2) * 0.02]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, melt * (0.6 + 0.1 * i))}><circleGeometry args={[0.014, 12]} /><meshStandardMaterial color="#3a2e28" /></mesh>)}
    <Spark p={[0.3, 0.06, -0.04]} k={(tt - 3.0) / 0.5} s={1.4} />
    {Array.from({ length: 40 }, (_, i) => { const ph = (tt * 0.5 + i / 40) % 1, q = seg(0.3 + (i % 7) * 0.1); return <mesh key={i} position={[q[0] + Math.sin(i * 1.7 + ph * 4) * 0.03 * ph, 0.03 + ph * 0.42, q[2] + Math.cos(i * 2.3) * 0.02 * ph]}><sphereGeometry args={[0.008 + ph * 0.022, 10, 8]} /><meshStandardMaterial color={i % 3 ? "#7a7672" : "#9a9690"} transparent opacity={0.3 * smoke * (1 - ph)} depthWrite={false} roughness={1} /></mesh>; })}
    {/* la gota de plástico derretido que cuelga del enchufe */}
    <mesh position={[0.37, 0.02 - 0.012 * melt, -0.02]} scale={[1, 1 + 1.4 * melt, 1].map((v) => Math.max(0.001, v * melt)) as V}><sphereGeometry args={[0.012, 12, 10]} /><meshStandardMaterial color="#4a3a30" roughness={0.4} /></mesh>
  </>;
}}</Scene3D>;

// 18:24 · EL RETORNO: noche de nieve; el generador de tapa naranja enchufado a la pared; un relámpago sale de la casa, prende el medidor, sube al poste y sacude al liniero
export const HBackfeed: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#070b14" warm={0.45}
  cam={{ at: [0.06, 0.38, 0.04], az: [-0.2, 0.05], el: [0.22, 0.18], r: [2.2, 2.08], fov: 30 }} lamp={[0, 1, 0.6]}>{(tt) => {
  const L = [1.0, 1.9, 2.8], bolt = (i: number) => tt < L[i] ? 0 : cl((tt - L[i]) / 0.08) * (0.55 + 0.45 * Math.abs(Math.sin(tt * 37 + i * 2))), meter = Math.max(cl((tt - 1.1) / 0.1), 2 * cl(1 - Math.abs(tt - 0.88) / 0.1)), hit = Math.max(cl(1 - Math.abs(tt - 3.0) / 0.25), cl(1 - Math.abs(tt - 3.9) / 0.25)), shake = hit > 0.2 ? 0.012 * Math.sin(tt * 60) * hit : 0;
  const path: V[] = [[-0.2, 0.36, 0.0], [0.05, 0.6, -0.02], [0.3, 0.72, -0.04], [0.5, 0.78, -0.05]];
  const zz = (key: string, a: V, b: V, n: number, r = 0.022) => { const P: number[][] = []; for (let i = 0; i <= n; i++) { const u = i / n, j = i === 0 || i === n ? 0 : ((i * 7919) % 13 / 13 - 0.5) * 0.08; P.push([lerp(a[0], b[0], u) + j * 0.5, lerp(a[1], b[1], u) + j, lerp(a[2], b[2], u) + 0.01]); } return tubeG(key + r, P, r, n * 4, 6); };
  return <>
    <Snow w={3} d={2} col="#c8d4e2" />
    <mesh position={[0, 0.9, -1.0]}><planeGeometry args={[4, 1.2]} /><meshBasicMaterial color="#14223e" /></mesh>
    <mesh position={[0, 0.3, -0.99]}><planeGeometry args={[4, 0.6]} /><meshBasicMaterial color="#25385c" /></mesh>
    {Array.from({ length: 40 }, (_, i) => <mesh key={"sn" + i} position={[-0.8 + (i * 0.173) % 1.6, 1.0 - ((tt * 0.25 + i / 40) % 1), -0.4 + (i * 0.29) % 0.7]}><sphereGeometry args={[0.005, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>)}
    <House p={[-0.38, 0, -0.05]} lit={0} s={1.6} />
    {/* el medidor en la pared, que se enciende */}
    <group position={[-0.2, 0.28, 0.12]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.035, 0.03, 24]} /><meshStandardMaterial color="#cfe4ff" emissive="#9fd0ff" emissiveIntensity={1.2 * meter} transparent opacity={0.85} /></mesh>
    </group>
    {/* farol de la calle */}
    <mesh position={[-0.75, 0.4, 0.2]}><cylinderGeometry args={[0.01, 0.012, 0.8, 8]} />{M.steel({ col: "#2a2c30" })}</mesh>
    <mesh position={[-0.75, 0.8, 0.2]}><sphereGeometry args={[0.03, 12, 10]} />{M.glow({ col: "#ffd59a" })}</mesh>
    <pointLight position={[-0.75, 0.75, 0.3]} intensity={0.8} distance={1.2} color="#ffd59a" />
    {/* generador con tapa naranja */}
    <group position={[-0.06 + lerp(-0.7, 0, cl(phys(tt, 0.1, 6, 0.55))), 0, 0.2]} scale={2.0}>
      <RBox s={[0.16, 0.09, 0.1]} p={[0, 0.06, 0]} r={0.01}>{M.steel({ col: "#2a2c30" })}</RBox>
      <RBox s={[0.17, 0.035, 0.11]} p={[0, 0.115, 0]} r={0.012}>{M.plastic({ col: "#f07a1a" })}</RBox>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.07, 0.022, 0.055]}><torusGeometry args={[0.022, 0.008, 8, 16]} />{M.rubber()}</mesh>)}
      <mesh position={[0.0, 0.07, 0.051]}><circleGeometry args={[0.022, 16]} />{M.matte({ col: "#111" })}</mesh>
    </group>
    <mesh geometry={tubeG("bfg", [[-0.06, 0.1, 0.16], [-0.16, 0.03, 0.17], [-0.2, 0.28, 0.12]], 0.007, 24, 6)}>{M.rubber({ col: "#f2c21b" })}</mesh>
    <mesh position={[0.52, 0.42, -0.05]}><cylinderGeometry args={[0.018, 0.024, 0.84, 12]} />{M.wood({ base: [90, 64, 44] })}</mesh>
    <mesh position={[0.52, 0.8, -0.05]}><boxGeometry args={[0.24, 0.02, 0.02]} />{M.wood({ base: [90, 64, 44] })}</mesh>
    <mesh geometry={tubeG("bfw", path, 0.004, 40, 6)}>{M.rubber({ col: "#111" })}</mesh>
    {/* los relámpagos: generador → medidor, medidor → línea, línea → liniero */}
    {([["bz0", [-0.06, 0.2, 0.2], [-0.2, 0.28, 0.13], 6, bolt(0)], ["bz1", [-0.2, 0.36, 0.0], [0.3, 0.72, -0.04], 9, bolt(1)], ["bz2", [0.3, 0.72, -0.04], [0.6, 0.7, 0.0], 6, Math.max(bolt(2), hit)]] as [string, V, V, number, number][]).map(([k, a, b, n, v]) => <group key={k} scale={v > 0.05 ? 1 : 0.001}>
      <mesh geometry={zz(k, a, b, n)}>{M.glow({ col: "#fff6c8" })}</mesh>
      <mesh geometry={zz(k, a, b, n, 0.055)}>{M.glow({ col: "#8fc8ff", op: 0.3 * v })}</mesh>
    </group>)}
    <pointLight position={[0.1, 0.6, 0.3]} intensity={2.5 * Math.max(bolt(0), bolt(1), bolt(2))} distance={1.6} color="#fff2c0" />
    {/* el liniero: casco, chaleco, brazos y arnés; se ilumina y se sacude */}
    <group position={[0.58 + shake, 0.6, 0.03]} scale={2.2}>
      <mesh><capsuleGeometry args={[0.03, 0.08, 6, 12]} /><meshStandardMaterial color="#ff8a1a" emissive="#fff2a0" emissiveIntensity={1.2 * hit} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.04, 0.02, 0]} rotation={[0, 0, s * (0.5 + 0.4 * hit)]}><capsuleGeometry args={[0.011, 0.07, 4, 8]} />{M.matte({ col: "#ff8a1a" })}</mesh>)}
      {[-1, 1].map((s) => <mesh key={"l" + s} position={[s * 0.015, -0.1, 0]}><capsuleGeometry args={[0.012, 0.07, 4, 8]} />{M.matte({ col: "#2a3a5a" })}</mesh>)}
      <mesh position={[0, -0.03, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.033, 0.005, 6, 20]} />{M.matte({ col: "#1c1d20" })}</mesh>
      <mesh geometry={tubeG("hrn", [[-0.03, -0.03, 0], [-0.06, -0.02, -0.03], [-0.06, 0.0, -0.05]], 0.003, 10, 5)}>{M.matte({ col: "#1c1d20" })}</mesh>
      <mesh position={[0, 0.09, 0]}><sphereGeometry args={[0.028, 16, 12]} />{M.matte({ col: "#e0b08a" })}</mesh>
      <mesh position={[0, 0.105, 0]}><sphereGeometry args={[0.033, 16, 12, 0, PI * 2, 0, PI / 2]} />{M.plastic({ col: "#f2c21b" })}</mesh>
    </group>
    <Spark p={[0.6, 0.72, 0.0]} k={(tt - 2.85) / 0.5} s={2.2} />
    <Spark p={[-0.2, 0.3, 0.14]} k={(tt - 1.0) / 0.4} s={1.6} />
    <Spark p={[0.3, 0.72, -0.04]} k={(tt - 1.9) / 0.4} s={1.6} />
  </>;
}}</Scene3D>;

// 18:58 · LOS SEIS BIDONES DE NOVIEMBRE: el estante entra deslizándose; las jarras caen de a una con rebote y se llenan de agua; tapas azules y la etiqueta de la fecha
export const HNovember: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark" bg="#0f1012"
  cam={{ at: [0, 0.34, 0], az: [0.15, 0.05], el: [0.16, 0.1], r: [1.65, 1.5], fov: 30 }} lamp={[0, 0.8, 0.5]}>{(tt) => {
  const T = (i: number) => 0.7 + i * 0.6, sx = lerp(-1.2, 0, cl(phys(tt, 0.05, 7, 0.55)));
  return <group position={[sx, 0, 0]}>
    <Shadow p={[0, 0.002, 0.02]} r={0.5} op={0.35} />
    {[0.04, 0.36].map((y) => <RBox key={y} s={[0.86, 0.025, 0.24]} p={[0, y, 0]} r={0.005}>{M.wood({ base: [130, 92, 58] })}</RBox>)}
    {[-0.42, 0.42].map((x) => <mesh key={x} position={[x, 0.33, 0]}><boxGeometry args={[0.025, 0.66, 0.24]} />{M.wood({ base: [110, 76, 46] })}</mesh>)}
    {Array.from({ length: 6 }, (_, i) => { const y = i < 3 ? 0.0525 : 0.3725, x = -0.26 + (i % 3) * 0.26, dy = fall(tt, T(i), 0.5, 10, 0.32), fill = eio(tt, T(i) + 0.3, T(i) + 0.9), wob = Math.sin(tt * 14 + i) * 0.006 * (1 - cl((tt - T(i) - 0.9) / 0.5));
      return <group key={i} position={[x, y + dy, 0]} visible={tt > T(i) - 0.05}>
        <Shadow p={[0, 0.001 - dy, 0]} r={0.075} op={0.4} />
        <RBox s={[0.13, 0.17 + 0.012 * (i % 3), 0.13]} p={[0, 0.085, 0]} r={0.02}>{M.plastic({ col: "#eef2f4", op: 0.3 })}</RBox>
        <mesh position={[0, 0.005 + 0.07 * fill, 0]} scale={[1, Math.max(0.001, fill), 1]} rotation={[wob * 4, 0, wob * 4]}><boxGeometry args={[0.118, 0.14, 0.118]} /><meshStandardMaterial color="#3a8fd8" emissive="#1a5a9a" emissiveIntensity={0.35} transparent opacity={0.75} roughness={0.15} /></mesh>
        {[0, 1].map((k) => { const q = ((tt - T(i) - 0.3) * 1.6 + k / 2) % 1; return <mesh key={"rp" + k} position={[0, 0.006 + 0.14 * fill, 0]} rotation={[-PI / 2, 0, 0]} scale={fill > 0.05 && fill < 0.99 ? 0.3 + q : 0.001}><ringGeometry args={[0.03, 0.036, 24]} />{M.glow({ col: "#bfe6ff", op: 0.6 * (1 - q) })}</mesh>; })}
        <mesh position={[0, 0.185, 0]}><cylinderGeometry args={[0.024, 0.024, 0.03, 16]} />{M.plastic({ col: "#2f74c4" })}</mesh>
        <mesh position={[0.05, 0.13, 0]} rotation={[0, 0, 0.3]}><torusGeometry args={[0.025, 0.007, 8, 16, PI]} />{M.plastic({ col: "#eef2f4", op: 0.6 })}</mesh>
        {/* la etiqueta de cinta con la fecha escrita a mano */}
        <group position={[0, 0.1, 0.067]} rotation={[0, 0, (i % 2 ? 0.05 : -0.04)]}><Txt3 txt={`NOV ${i + 1}`} w={0.1} h={0.04} bg="#f2e2a8" col="#1b2a5a" weight={900} /></group>
      </group>; })}
  </group>;
}}</Scene3D>;

// 19:41 · EL CAÑO TAPADO: primer plano del caño de escape; la nieve lo va enterrando; el humo no sale, vuelve en volutas y se mete en la cabina, que se pone gris
export const HTailpipe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#141c2c" warm={0.5}
  cam={{ at: [0.3, 0.1, -0.04], az: [0.95, 0.75], el: [0.14, 0.12], r: [0.75, 0.66], fov: 30 }} lamp={[0, 0.8, 0.5]}>{(tt) => {
  const sl = lerp(-0.5, 0, cl(phys(tt, 0.1, 5, 0.6))), step = (i: number) => cl(phys(tt, 0.6 + i * 0.45, 7, 0.5)), mound = (step(0) + step(1) + step(2)) / 3, blocked = cl((tt - 1.8) / 0.4), gray = eio(tt, 2.8, 4.4);
  return <>
    <Snow w={3} d={2} />
    <group position={[sl, 0, 0]}>
      <RBox s={[0.6, 0.12, 0.26]} p={[0, 0.1, 0]} r={0.03}>{M.plastic({ col: "#2f5a8a" })}</RBox>
      <RBox s={[0.34, 0.12, 0.24]} p={[-0.02, 0.21, 0]} r={0.03}><meshStandardMaterial color={gray > 0.5 ? "#5a5c5e" : "#9ec8e8"} transparent opacity={0.35 + 0.5 * gray} roughness={0.2} /></RBox>
      {[[-0.19, 0.13], [0.19, 0.13], [-0.19, -0.13], [0.19, -0.13]].map(([x, z]) => <mesh key={x + "," + z} position={[x, 0.05, z]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.04, 20]} />{M.rubber()}</mesh>)}
      <mesh position={[0.36, 0.06, -0.08]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.16, 24]} />{M.chrome()}</mesh>
      <mesh position={[0.441, 0.06, -0.08]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.025, 0.025, 0.002, 24]} />{M.matte({ col: "#0a0a0a" })}</mesh>
    </group>
    {/* el montículo de nieve frente a la boca sube en tres tramos y tapa la boca casi entera */}
    <mesh position={[0.46 + sl, -0.01, -0.08]} scale={[1, Math.max(0.001, 0.08 * mound / 0.09), 1]}><sphereGeometry args={[0.09, 32, 18, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#f2f6fa" roughness={0.95} /></mesh>
    {Array.from({ length: 30 }, (_, i) => <mesh key={"f" + i} position={[0.1 + (i * 0.137) % 0.6, 0.4 - 0.4 * ((tt * 0.3 + i / 30) % 1), -0.3 + (i * 0.23) % 0.5]}><sphereGeometry args={[0.004, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>)}
    {/* humo: antes de taparse sale libre hacia afuera; después choca con la nieve y vuelve por debajo del auto a la cabina */}
    {Array.from({ length: 16 }, (_, i) => { const ph = (tt * 0.55 + i / 16) % 1, out = 0.45 + 0.05 * ph;
      const fx = lerp(0.45, 0.68, ph), fy = 0.06 + 0.1 * ph;
      const bx = ph < 0.2 ? lerp(0.45, 0.5, ph / 0.2) : lerp(0.5, -0.02, (ph - 0.2) / 0.8), by = ph < 0.2 ? 0.06 : 0.06 + 0.16 * Math.pow((ph - 0.2) / 0.8, 2);
      const x = lerp(fx, bx, blocked), y = lerp(fy, by, blocked) + 0.01 * Math.sin(ph * 9 + i), z = -0.08 + 0.05 * blocked * ph + 0.015 * Math.cos(ph * 7 + i) + 0 * out;
      return <mesh key={i} position={[x, y, z]} scale={tt > 0.6 ? 1 : 0.001}><sphereGeometry args={[0.018 + ph * 0.028, 12, 10]} /><meshStandardMaterial color="#6e6e6a" transparent opacity={0.6 * (1 - ph * 0.5)} depthWrite={false} roughness={1} /></mesh>; })}
  </>;
}}</Scene3D>;

// 20:48 · EL REPASO: el tablero de herramientas; 10 chapitas grandes giran y rebotan de a una, cada una con su objeto en relieve, y se encienden con un destello cálido
const ICO = ["#f2c21b", "#58a8ff", "#c8b08c", "#ffd98a", "#6fc8ff", "#ff8a3a", "#e2352a", "#3fae6a", "#ff9a3a", "#4dff9a"];
const Icon: React.FC<{ i: number; c: string }> = ({ i, c }) => { const m = <meshStandardMaterial color={c} metalness={0.3} roughness={0.35} emissive={c} emissiveIntensity={0.15} />;
  switch (i) {
    case 0: return <mesh><sphereGeometry args={[0.028, 18, 14]} />{m}</mesh>;
    case 1: return <group>{[0, 1, 2].map((k) => <mesh key={k} rotation={[0, 0, k * PI / 3]}><boxGeometry args={[0.07, 0.008, 0.008]} />{m}</mesh>)}</group>;
    case 2: return <mesh><boxGeometry args={[0.06, 0.04, 0.012]} />{m}</mesh>;
    case 3: return <mesh><cylinderGeometry args={[0.012, 0.012, 0.06, 14]} />{m}</mesh>;
    case 4: return <mesh><octahedronGeometry args={[0.032]} />{m}</mesh>;
    case 5: return <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.024, 0.008, 10, 24]} />{m}</mesh>;
    case 6: return <mesh><coneGeometry args={[0.028, 0.055, 18]} />{m}</mesh>;
    case 7: return <mesh><capsuleGeometry args={[0.014, 0.04, 6, 12]} />{m}</mesh>;
    case 8: return <mesh><dodecahedronGeometry args={[0.028]} />{m}</mesh>;
    default: return <mesh><tetrahedronGeometry args={[0.034]} />{m}</mesh>;
  }
};
export const HRecap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="wood" bg="#120e0b" warm={0.7}
  cam={{ at: [0, 0.4, 0], az: [-0.08, 0.06], el: [0.06, 0.04], r: [1.08, 1.0], fov: 30 }} lamp={[0, 0.9, 0.6]}>{(tt) => {
  const N = 6, T = (i: number) => 0.2 + i * 0.8, X = (i: number) => -0.36 + i * 0.144, last = T(N - 1), push = 1 + 0.04 * eio(tt, last + 0.3, last + 1.0), sweep = cl((tt - last - 0.2) / 0.9);
  const Obj = ({ i }: { i: number }) => { switch (i) {
    case 0: return <group><mesh><cylinderGeometry args={[0.022, 0.022, 0.14, 20]} />{M.matte({ col: "#1c1d20" })}</mesh><mesh position={[0, -0.085, 0]}><cylinderGeometry args={[0.032, 0.022, 0.035, 20]} />{M.chrome()}</mesh><mesh position={[0, -0.104, 0]} rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.028, 20]} /><meshStandardMaterial color="#fff" emissive="#fff3c8" emissiveIntensity={1.2} /></mesh></group>;
    case 1: return <group><RBox s={[0.1, 0.13, 0.05]} r={0.012}>{M.plastic({ col: "#2a2c30" })}</RBox><mesh position={[0, 0.02, 0.026]}><planeGeometry args={[0.06, 0.03]} /><meshStandardMaterial color="#062" emissive="#3aff6a" emissiveIntensity={1} /></mesh></group>;
    case 2: return <group><mesh><cylinderGeometry args={[0.032, 0.032, 0.15, 24]} />{M.steel({ col: "#3a6a5a" })}</mesh><mesh position={[0, 0.085, 0]}><cylinderGeometry args={[0.024, 0.03, 0.03, 20]} />{M.plastic({ col: "#1c1d20" })}</mesh></group>;
    case 3: return <group>{[0, 1, 2].map((k) => <RBox key={k} s={[0.12, 0.035, 0.06]} p={[0, -0.04 + k * 0.038, 0]} r={0.015}><meshStandardMaterial color={["#b8241a", "#e8dcc4", "#b8241a"][k]} roughness={0.95} /></RBox>)}</group>;
    case 4: return <group><RBox s={[0.13, 0.09, 0.05]} r={0.015}>{M.plastic({ col: "#d8361f" })}</RBox><mesh position={[-0.03, 0, 0.026]}><circleGeometry args={[0.03, 24]} />{M.matte({ col: "#1c1d20" })}</mesh><mesh position={[0.05, 0.08, 0]} rotation={[0, 0, -0.3]}><cylinderGeometry args={[0.003, 0.004, 0.1, 8]} />{M.chrome()}</mesh></group>;
    default: return <group><RBox s={[0.1, 0.14, 0.08]} r={0.02}>{M.plastic({ col: "#eef2f4", op: 0.5 })}</RBox><mesh position={[0, -0.02, 0]}><boxGeometry args={[0.09, 0.09, 0.07]} /><meshStandardMaterial color="#3a8fd8" transparent opacity={0.75} /></mesh><mesh position={[0, 0.085, 0]}><cylinderGeometry args={[0.018, 0.018, 0.025, 14]} />{M.plastic({ col: "#2f74c4" })}</mesh></group>;
  } };
  return <group position={[0, 0.4 * (1 - push), 0]} scale={push}>
    <RBox s={[1.0, 0.56, 0.02]} p={[0, 0.4, -0.04]} r={0.008}>{M.wood({ base: [176, 140, 98] })}</RBox>
    {Array.from({ length: 60 }, (_, i) => <mesh key={i} position={[-0.46 + (i % 12) * 0.084, 0.16 + Math.floor(i / 12) * 0.12, -0.029]}><circleGeometry args={[0.006, 10]} /><meshBasicMaterial color="#5a4632" /></mesh>)}
    {Array.from({ length: N }, (_, i) => { const x = X(i), k = cl(phys(tt, T(i), 8, 0.4)), sw = tt > T(i) ? 0.35 * Math.exp(-(tt - T(i)) * 1.0) * Math.cos((tt - T(i)) * 7) + 0.03 * Math.sin(tt * 1.7 + i) : 0.35, glow = cl(1 - Math.abs(x - lerp(-0.6, 0.6, sweep)) / 0.12) * (sweep > 0 && sweep < 1 ? 1 : 0);
      return <group key={i}>
        <mesh position={[x + 0.015, 0.41, -0.0295]} scale={[1, 1.3, 1]}><circleGeometry args={[0.07, 24]} /><meshBasicMaterial color="#000" transparent opacity={0.3 * k} depthWrite={false} /></mesh>
        <mesh position={[x, 0.56, -0.02]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.006, 0.006, 0.05, 8]} />{M.steel()}</mesh>
        <group position={[x, 0.56 + 0.2 * (1 - k), 0.0]} rotation={[0, 0, sw]} scale={tt > T(i) - 0.02 ? 1 : 0.001}>
          <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.0025, 0.0025, 0.06, 6]} />{M.steel()}</mesh>
          <group position={[0, -0.14, 0.02]} scale={1.15}><Obj i={i} /></group>
        </group>
        <pointLight position={[x, 0.4, 0.15]} intensity={1.6 * glow} distance={0.35} color="#ffcf8a" />
      </group>; })}
  </group>;
}}</Scene3D>;
