// len29c · 2ª vuelta en 3D real (kit h3d): tambor, alfombra, agua dura, un año, acrílico, bolsa, rutina, coladero, cinco segundos, afuera.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, RED, H } from "./hkit";
import { Hair, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";

const PI = Math.PI;
const Cross: React.FC<{ r?: number; y?: number }> = ({ r = 0.07, y = 0 }) => <group position={[0, y, 0]}>
  <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[r, 0.007, 12, 56]} />{M.chrome()}</mesh>
  {[0, PI / 2].map((a) => <mesh key={a} rotation={[0, a, 0]}><boxGeometry args={[r * 2, 0.008, 0.009]} />{M.chrome()}</mesh>)}
</group>;
const Tuft: React.FC<{ id: string; s?: number }> = ({ id, s = 1 }) => <group scale={s}>
  <mesh><sphereGeometry args={[0.02, 16, 12]} />{M.grease({ col: "#5e4a38" })}</mesh>
  {[0, 1, 2].map((i) => <Hair key={i} id={id + i} n={12} spread={0.022} r={0.0013} pts={[[-0.03, 0.01, 0], [0, -0.015, 0.015 * (i - 1)], [0.03, 0.01, -0.01], [0.01, 0.03, 0.01]]} />)}
</group>;

// ---- 12:56 · LA LATA DEL FONDO: una trampa de tambor de vidrio en corte; un anillo, una moneda, un soldadito y la arena bajan, se asientan y levantan una nube ----
export const HDrumCan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark"
  cam={{ at: [0, 0.16, 0], az: [-0.25, 0.18], el: [0.2, 0.14], r: [1.0, 0.85], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="A DRUM TRAP" col={AMB} />}>{(tt) => {
  const R = 0.17, Hh = 0.22, objs = [0.7, 1.5, 2.3, 3.1], sand = eio(tt, 0.5, 4.5);
  const land = (a: number) => { const k = cl((tt - a) / 0.9); return { k, y: lerp(Hh - 0.03, 0.035, 1 - Math.pow(1 - k, 2.2)), wob: Math.sin(tt * 5 + a) * 0.15 * (1 - k) }; };
  return <>
    {/* el tambor: cilindro de vidrio grueso con tapa de bronce y dos caños a los lados */}
    <mesh position={[0, Hh / 2, 0]}><cylinderGeometry args={[R, R, Hh, 64, 1, true]} />{M.glass({ op: 0.2, side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, Hh / 2, 0]}><cylinderGeometry args={[R - 0.006, R - 0.006, Hh - 0.01, 56]} />{M.water({ op: 0.22, col: "#9ab8a8" })}</mesh>
    <mesh position={[0, Hh + 0.008, 0]}><cylinderGeometry args={[R + 0.012, R + 0.012, 0.016, 64]} />{M.brass({ col: "#b8873a" })}</mesh>
    <mesh position={[0, 0.004, 0]}><cylinderGeometry args={[R + 0.008, R + 0.008, 0.008, 64]} />{M.brass({ col: "#9a7030" })}</mesh>
    {[-1, 1].map((s) => <mesh key={s} position={[s * (R + 0.1), Hh - 0.05, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.025, 0.025, 0.2, 24]} />{M.pvc({ col: "#cfcabd" })}</mesh>)}
    {/* la arena que se acumula en el fondo */}
    <mesh position={[0, 0.008 + 0.014 * sand, 0]} scale={[1, 0.001 + sand, 1]}><cylinderGeometry args={[R - 0.008, R - 0.008, 0.028, 48]} />{M.matte({ col: "#b9a27a" })}</mesh>
    {/* los objetos que caen uno a uno, se mecen al bajar y se asientan */}
    {objs.map((a, i) => { const { k, y, wob } = land(a); if (tt < a) return null; const x = [-0.07, 0.06, -0.01, 0.08][i], z = [0.03, -0.04, 0.06, 0.05][i];
      return <group key={i} position={[x, y + 0.028 * sand * (k >= 1 ? 1 : 0), z]} rotation={[wob, i, wob * 0.6]}>
        {i === 0 && <mesh rotation={[PI / 2 - 0.2, 0, 0]} castShadow><torusGeometry args={[0.022, 0.006, 12, 32]} />{M.brass({ col: "#e2b44a" })}</mesh>}
        {i === 1 && <mesh rotation={[0.1, 0, 0]} castShadow><cylinderGeometry args={[0.024, 0.024, 0.004, 32]} />{M.chrome({ col: "#c9ced3" })}</mesh>}
        {i === 2 && <group rotation={[0, 0, PI / 2 - 0.15]}>
          <mesh castShadow><capsuleGeometry args={[0.012, 0.03, 6, 12]} />{M.plastic({ col: "#5a6e3a" })}</mesh>
          <mesh position={[0, 0.03, 0]}><sphereGeometry args={[0.011, 14, 10]} />{M.plastic({ col: "#5a6e3a" })}</mesh>
        </group>}
        {i === 3 && <Tuft id="dc" s={1.2} />}
      </group>; })}
    {/* la nube de polvo cuando cada uno toca el fondo */}
    {objs.map((a, i) => { const k = cl((tt - a - 0.9) / 1.0); return k > 0 && k < 1 ? Array.from({ length: 6 }, (_, j) => <mesh key={i + "_" + j} position={[[-0.07, 0.06, -0.01, 0.08][i] + Math.cos(j) * 0.05 * k, 0.05 + 0.03 * k, [0.03, -0.04, 0.06, 0.05][i] + Math.sin(j) * 0.05 * k]}><sphereGeometry args={[0.012 + 0.02 * k, 10, 8]} /><meshBasicMaterial color="#d8c8a2" transparent opacity={0.35 * (1 - k)} depthWrite={false} /></mesh>) : null; })}
  </>;
}}</Scene3D>;

// ---- 13:41 · BAJO LA ALFOMBRA: la alfombrita del baño se levanta desde una punta y se curva; abajo, la tapa de bronce con su aro y sus tornillos que brillan ----
const matTex = () => tex.text("c_mat", 256, 256, (g) => { g.fillStyle = "#4a6e8a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 2400; i++) { g.fillStyle = `rgba(${200 + 55 * rn(i, 2)},${210 + 40 * rn(i, 3)},230,${0.12 * rn(i, 4)})`; g.fillRect(rn(i, 5) * 256, rn(i, 6) * 256, 2, 3); } g.strokeStyle = "rgba(240,240,250,.5)"; g.lineWidth = 8; g.strokeRect(14, 14, 228, 228); });
export const HUnderTheMat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile"
  cam={{ at: [0, 0.03, -0.06], az: [0.25, -0.1], el: [0.7, 0.58], r: [1.08, 0.92], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="NOBODY LIFTED THE MAT" col={AMB} />}>{(tt) => {
  const lift = eio(tt, 0.5, 2.0), shine = cl((tt - 2.2) / 0.5) * (0.7 + 0.3 * Math.sin(tt * 5));
  const W = 0.5, D = 0.36, n = 24;
  // la alfombra: una tira de segmentos que se enrolla hacia atrás desde el borde de adelante
  const segs = Array.from({ length: n }, (_, i) => i);
  return <>
    {/* la tapa de bronce olvidada */}
    <group position={[0, 0.003, 0]}>
      <mesh><cylinderGeometry args={[0.075, 0.075, 0.006, 56]} />{M.brass({ col: "#b8873a" })}</mesh>
      <mesh position={[0, 0.004, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.005, 10, 56]} />{M.brass({ col: "#d4a24a" })}</mesh>
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[Math.cos(i * PI / 2 + PI / 4) * 0.05, 0.005, Math.sin(i * PI / 2 + PI / 4) * 0.05]}><cylinderGeometry args={[0.007, 0.007, 0.004, 16]} />{M.chrome({ em: "#ffffff", emI: 0.4 * shine })}</mesh>)}
      <pointLight position={[0, 0.08, 0.05]} intensity={0.22 * shine} distance={0.3} color="#ffd38a" />
    </group>
    {segs.map((i) => { const u = i / n, start = 1 - lift * 1.1, k = cl((u - start) / 0.25), d = D / n;
      const z = D / 2 - u * D, a = k * PI * 0.9, R = 0.04;
      const zz = k > 0 ? D / 2 - start * D - Math.sin(a) * R * (1 + u) : z, yy = k > 0 ? 0.008 + (1 - Math.cos(a)) * R * (1 + u) : 0.008;
      return <mesh key={i} position={[0, yy, -zz]} rotation={[-a, 0, 0]} castShadow receiveShadow><boxGeometry args={[W, 0.012, d * 1.08]} /><meshStandardMaterial map={matTex()} roughness={0.95} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 14:13 · AGUA DURA: caño en corte; por arriba entran dos chorros, cristales de mineral blancos y burbujas de jabón; donde se tocan forman una costra gris que crece en la pared ----
export const HHardWater: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark"
  cam={{ at: [0, 0.1, 0], az: [0.2, -0.1], el: [0.1, 0.06], r: [1.05, 0.9], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="A SCUM LIKE GLUE" col={AMB} />}>{(tt) => {
  const crust = eio(tt, 1.8, 6.0);
  return <>
    {/* el caño horizontal de vidrio, abierto hacia cámara */}
    <mesh position={[0, 0.1, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.09, 0.09, 0.9, 56, 1, true, -PI / 2, PI * 1.2]} />{M.glass({ op: 0.2, side: THREE.DoubleSide })}</mesh>
    {[-0.25, 0.25].map((x) => <mesh key={x} position={[x, 0.3, 0]}><cylinderGeometry args={[0.022, 0.022, 0.3, 20, 1, true]} />{M.glass({ op: 0.22, side: THREE.DoubleSide })}</mesh>)}
    {/* chorro izquierdo: cristales blancos que caen girando */}
    {Array.from({ length: 14 }, (_, i) => { const k = ((tt * 0.55 + i / 14) % 1), y = lerp(0.45, 0.04, k), x = lerp(-0.25, -0.05 + 0.1 * rn(i, 2), cl((k - 0.5) * 2)); return <mesh key={"c" + i} position={[x, y, 0.02 * (rn(i, 3) - 0.5)]} rotation={[k * 6, k * 4, 0]}><octahedronGeometry args={[0.009 + 0.004 * rn(i, 4)]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} clearcoat={1} emissive="#cfe8ff" emissiveIntensity={0.35} /></mesh>; })}
    {/* chorro derecho: burbujas de jabón */}
    {Array.from({ length: 14 }, (_, i) => { const k = ((tt * 0.5 + i / 14 + 0.3) % 1), y = lerp(0.45, 0.06, k), x = lerp(0.25, 0.05 - 0.1 * rn(i, 5), cl((k - 0.5) * 2)); return <mesh key={"b" + i} position={[x, y, 0.02 * (rn(i, 6) - 0.5)]}><sphereGeometry args={[0.011 + 0.006 * rn(i, 7), 14, 10]} /><meshPhysicalMaterial color="#e9f3ff" roughness={0} transparent opacity={0.55} iridescence={1} clearcoat={1} depthWrite={false} /></mesh>; })}
    {/* la costra: grumos grises que se pegan al fondo y a la pared del caño y van cerrando */}
    {Array.from({ length: 40 }, (_, i) => { const a = -PI / 2 + (rn(i, 8) - 0.5) * 2.2, x = (rn(i, 9) - 0.5) * 0.36, on = cl(crust * 40 - i); if (on <= 0) return null; const r = 0.082;
      return <mesh key={"k" + i} position={[x, 0.1 + Math.sin(a) * r, Math.cos(a) * r * 0.6]} scale={[1.4, 0.6, 1.2].map((v) => v * on) as [number, number, number]}><sphereGeometry args={[0.016 + 0.01 * rn(i, 10), 12, 10]} />{M.matte({ col: i % 3 ? "#8c8a82" : "#a8a59a" })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 15:15 · UN AÑO DE PELO: alrededor del desagüe, doce marcas como un reloj; cada marca que se prende suelta un mechón que cae en el centro; la bola crece mes a mes ----
export const HHairYear: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="none"
  cam={{ at: [0, 0.03, 0], az: [0.1, -0.2], el: [1.0, 0.82], r: [0.85, 0.68], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="ONE YEAR IN THE DRAIN" col={AMB} />}>{(tt) => {
  const m = (i: number) => 0.4 + i * 0.5, got = Array.from({ length: 12 }, (_, i) => cl((tt - m(i) - 0.4) / 0.25)).reduce((a, b) => a + b, 0);
  return <>
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 40]} />{M.matte({ col: "#0b0c0e" })}</mesh>
    <Cross r={0.07} y={0.005} />
    {/* las doce marcas del año, en círculo */}
    {Array.from({ length: 12 }, (_, i) => { const a = -PI / 2 + i * PI / 6, on = cl((tt - m(i)) / 0.2); return <mesh key={i} position={[Math.cos(a) * 0.26, 0.003, Math.sin(a) * 0.26]} rotation={[-PI / 2, 0, -a]}><boxGeometry args={[0.05, 0.012, 0.004]} />{on > 0 ? M.glow({ col: AMB, op: 0.4 + 0.6 * on }) : M.matte({ col: "#5a564f" })}</mesh>; })}
    {/* cada mechón viaja desde su marca al centro */}
    {Array.from({ length: 12 }, (_, i) => { const a = -PI / 2 + i * PI / 6, k = eio(tt, m(i), m(i) + 0.45); return k > 0 && k < 1 ? <group key={"t" + i} position={[Math.cos(a) * 0.24 * (1 - k), 0.02 + 0.08 * Math.sin(PI * k), Math.sin(a) * 0.24 * (1 - k)]}><Tuft id={"hy" + (i % 3)} s={0.7} /></group> : null; })}
    {/* la bola del centro, cada vez más grande */}
    {got > 0.05 && <group position={[0, 0.02 + 0.004 * got, 0]} scale={0.6 + 0.16 * got}><Tuft id="hyb" s={1} /></group>}
  </>;
}}</Scene3D>;

// ---- 16:02 · EL CALOR Y EL ACRÍLICO: una cacerola roja con vapor vierte agua hirviendo sobre la placa de acrílico de la ducha; la placa se comba y le aparecen grietas blancas ----
export const HAcrylicHeat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="tile"
  cam={{ at: [0, 0.12, 0], az: [-0.3, 0.15], el: [0.36, 0.26], r: [1.05, 0.9], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="NO BOILING WATER" col={RED} />}>{(tt) => {
  const tilt = eio(tt, 0.5, 1.3) * (1 - eio(tt, 4.4, 5.0)), pour = tilt > 0.7 ? 1 : 0, warp = eio(tt, 1.6, 4.6), crack = cl((tt - 3.2) / 2.0);
  const geo = React.useMemo(() => new THREE.PlaneGeometry(0.6, 0.4, 40, 28), []);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), d = Math.hypot(x - 0.02, y); pos.setZ(i, 0.04 * warp * Math.exp(-d * d * 30) + 0.006 * warp * Math.sin(d * 50) * Math.exp(-d * 6)); }
  pos.needsUpdate = true; geo.computeVertexNormals();
  const cracks = [[0.02, 0, 0.1, 0.06], [0.02, 0, -0.09, 0.08], [0.02, 0, 0.0, -0.12], [0.02, 0, 0.14, -0.06], [0.02, 0, -0.12, -0.05]];
  return <>
    {/* la placa de acrílico blanca translúcida, combándose */}
    <mesh geometry={geo} position={[0, 0.02, 0]} rotation={[-PI / 2, 0, 0]} ><meshPhysicalMaterial color="#f4f2ec" roughness={0.2} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
    {/* las grietas: rayas blancas que se abren desde el centro */}
    {cracks.map((c, i) => { const k = cl(crack * 1.4 - i * 0.12); if (k <= 0) return null; const ex = lerp(c[0], c[2], k), ez = lerp(c[1], c[3], k), L = Math.hypot(ex - c[0], ez - c[1]);
      return <mesh key={i} position={[(c[0] + ex) / 2, 0.02 + 0.03 * warp + 0.004, -(c[1] + ez) / 2]} rotation={[0, Math.atan2(ez - c[1], ex - c[0]), 0]}><boxGeometry args={[Math.max(0.001, L), 0.003, 0.004]} />{M.matte({ col: "#6a6a70" })}</mesh>; })}
    {/* la cacerola esmaltada roja */}
    <group position={[-0.2, 0.24, 0]} rotation={[0, 0, -1.1 * tilt]}>
      <mesh castShadow><cylinderGeometry args={[0.08, 0.07, 0.09, 40, 1, true]} />{M.plastic({ col: "#b8241e", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, -0.045, 0]}><cylinderGeometry args={[0.07, 0.07, 0.004, 40]} />{M.plastic({ col: "#9a1e18" })}</mesh>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.075, 0.075, 0.003, 40]} />{M.water({ op: 0.6 })}</mesh>
      <mesh position={[-0.15, 0.02, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.009, 0.009, 0.14, 16]} />{M.matte({ col: "#1c1c1e" })}</mesh>
    </group>
    {pour > 0 && <mesh geometry={tubeG("ac_pour", [[-0.12, 0.27, 0], [-0.06, 0.2, 0], [0.0, 0.09, 0], [0.02, 0.025, 0]], 0.009, 30, 10)}>{M.water({ op: 0.75, emI: 0.4 })}</mesh>}
    {/* vapor */}
    {Array.from({ length: 12 }, (_, i) => { const k = ((tt * 0.5 + i / 12) % 1); return tilt > 0.3 || warp > 0.1 ? <mesh key={i} position={[0.02 + 0.06 * Math.sin(i * 2 + tt), 0.05 + 0.32 * k, 0.04 * Math.cos(i)]} scale={0.5 + 1.6 * k}><sphereGeometry args={[0.025, 12, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.12 * (1 - k)} depthWrite={false} /></mesh> : null; })}
  </>;
}}</Scene3D>;

// ---- 17:40 · MOSTRAR LA BOLSA: la bolsa con cierre gira hacia cámara con la mata adentro, que se mece; tres siluetas de la familia dan un paso atrás ----
export const HShowBag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.8}
  cam={{ at: [0, 0.3, 0], az: [-0.15, 0.12], el: [0.08, 0.06], r: [1.35, 1.15], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="SHOW THEM THE BAG" col={AMB} />}>{(tt) => {
  const spin = eio(tt, 0.4, 1.8), sw = Math.sin(tt * 3.2) * 0.12, back = eio(tt, 2.6, 3.6);
  return <>
    {/* la bolsa: plástico transparente con cierre azul, colgando de dos dedos */}
    <group position={[0, 0.36, 0.25]} rotation={[0, (1 - spin) * PI, sw]}>
      <mesh position={[0, -0.09, 0]}><boxGeometry args={[0.2, 0.18, 0.03]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} transparent opacity={0.22} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh position={[0, 0.0, 0]}><boxGeometry args={[0.2, 0.012, 0.034]} />{M.plastic({ col: "#3a6ac2" })}</mesh>
      <group position={[0, -0.12, 0]} rotation={[0, 0, -sw * 0.6]}><Tuft id="sb" s={2.2} /></group>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.012, 0.03, 0]} castShadow><capsuleGeometry args={[0.012, 0.05, 6, 12]} />{M.matte({ col: "#d4a283" })}</mesh>)}
    </group>
    {/* las tres siluetas de la familia, oscuras, que retroceden */}
    {[-0.36, 0.0, 0.36].map((x, i) => { const s = [1, 0.72, 0.92][i]; return <group key={i} position={[x, 0, -0.5 - 0.22 * back * (1 + 0.2 * i)]} scale={s} rotation={[0, 0, -0.08 * back * (i - 1)]}>
      <mesh position={[0, 0.3, 0]} castShadow><capsuleGeometry args={[0.07, 0.3, 8, 16]} />{M.matte({ col: "#2a2c30" })}</mesh>
      <mesh position={[0, 0.58, 0]} castShadow><sphereGeometry args={[0.06, 24, 16]} />{M.matte({ col: "#2a2c30" })}</mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.1, 0.34 + 0.06 * back, 0.02 + 0.04 * back]} rotation={[-0.6 * back, 0, sd * (0.25 + 0.5 * back)]}><capsuleGeometry args={[0.022, 0.2, 6, 12]} />{M.matte({ col: "#2a2c30" })}</mesh>)}
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 17:59 · LA RUTINA: sobre una toalla, cuatro herramientas en fila; la cámara se desliza y cada una se enciende y hace su gesto al pasar ----
export const HRoutine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#12100e"
  cam={{ at: [-0.2, 0.04, 0], at1: [0.2, 0.04, 0], az: [-0.2, 0.2], el: [0.5, 0.42], r: [1.28, 1.2], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THE WHOLE ROUTINE" col={AMB} />}>{(tt) => {
  const act = (i: number) => cl((tt - 0.8 - i * 1.6) / 0.4) * (1 - cl((tt - 2.2 - i * 1.6) / 0.4)), X = [-0.36, -0.12, 0.12, 0.36];
  return <>
    <RBox s={[1.0, 0.012, 0.3]} r={0.006} p={[0, 0.006, 0]}>{M.matte({ col: "#e8e2d4" })}</RBox>
    {[0, 1, 2, 3, 4, 5].map((i) => <mesh key={i} position={[-0.45 + i * 0.18, 0.0125, 0.13]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.09, 0.012]} />{M.matte({ col: "#4a7ab8" })}</mesh>)}
    {/* 1 · el destornillador: gira */}
    <group position={[X[0], 0.03, 0]} rotation={[0, act(0) * tt * 6, PI / 2]}>
      <mesh castShadow><cylinderGeometry args={[0.016, 0.016, 0.09, 20]} />{M.plastic({ col: "#e0b02a" })}</mesh>
      <mesh position={[0, -0.09, 0]}><cylinderGeometry args={[0.004, 0.004, 0.1, 10]} />{M.steel()}</mesh>
    </group>
    {/* 2 · la tira: se dobla y vuelve */}
    <group position={[X[1], 0.016 + 0.05 * act(1), 0.0]} rotation={[-PI / 2 + 0.6 * act(1), 0, 0.3]}>
      <mesh castShadow><boxGeometry args={[0.014, 0.22, 0.0025]} />{M.plastic({ col: "#1d1e20" })}</mesh>
      {Array.from({ length: 8 }, (_, j) => [-1, 1].map((s) => <mesh key={j + "_" + s} position={[s * 0.011, -0.09 + j * 0.024, 0]} rotation={[0, 0, s * -0.75]}><boxGeometry args={[0.012, 0.003, 0.0022]} />{M.plastic({ col: "#1d1e20" })}</mesh>))}
    </group>
    {/* 3 · el ganchito: se levanta y engancha el aire */}
    <group position={[X[2], 0.02 + 0.06 * act(2), 0]} rotation={[0, 0, PI / 2 - 0.8 * act(2)]}>
      <mesh castShadow><cylinderGeometry args={[0.008, 0.008, 0.07, 16]} />{M.plastic({ col: RED })}</mesh>
      <mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.0018, 0.0018, 0.1, 8]} />{M.steel()}</mesh>
    </group>
    {/* 4 · el coladero: rebota y brilla */}
    <group position={[X[3], 0.018 + 0.05 * Math.abs(Math.sin(PI * act(3))), 0]}>
      <mesh castShadow><cylinderGeometry args={[0.055, 0.05, 0.012, 40]} />{M.steel({ col: "#cfd4d8" })}</mesh>
      {Array.from({ length: 12 }, (_, j) => <mesh key={j} position={[Math.cos(j * PI / 6) * 0.033, 0.0065, Math.sin(j * PI / 6) * 0.033]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.005, 10]} />{M.matte({ col: "#111" })}</mesh>)}
    </group>
    {/* la luz que acompaña a la herramienta activa */}
    {X.map((x, i) => <pointLight key={i} position={[x, 0.2, 0.12]} intensity={0.3 * act(i)} distance={0.35} color="#ffd9a0" />)}
  </>;
}}</Scene3D>;

// ---- 18:50 · EL COLADERO: de costado, en corte; un disco de acero con agujeros sobre la boca del desagüe; el chorro cae, el agua pasa por los agujeros y un mechón grueso queda arriba ----
export const HCatcherSieve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark"
  cam={{ at: [0, 0.02, 0], az: [0.15, -0.1], el: [0.22, 0.14], r: [0.72, 0.6], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="A HAIR CATCHER" col={AMB} />}>{(tt) => {
  const hair = cl(phys(tt, 2.0, 7, 0.45)), on = tt > 0.4 && tt < 6.4;
  return <>
    {/* el piso de la ducha en corte y el caño que baja */}
    {[-1, 1].map((s) => <mesh key={s} position={[s * 0.3, -0.01, 0]}><boxGeometry args={[0.44, 0.02, 0.4]} />{M.matte({ col: "#dcd7cc" })}</mesh>)}
    <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[0.075, 0.075, 0.36, 48, 1, true, -PI / 2, PI * 1.3]} />{M.glass({ op: 0.2, side: THREE.DoubleSide })}</mesh>
    {/* el disco con agujeros (cúpula baja) */}
    <mesh position={[0, 0.004, 0]} scale={[1, 0.18, 1]}><sphereGeometry args={[0.1, 48, 16, 0, 2 * PI, 0, PI / 2]} />{M.steel({ col: "#cfd4d8", side: THREE.DoubleSide })}</mesh>
    {Array.from({ length: 18 }, (_, i) => { const a = i * 2.4, r = 0.025 + 0.055 * Math.sqrt((i + 0.5) / 18); return <mesh key={i} position={[Math.cos(a) * r, 0.004 + 0.018 * Math.sqrt(1 - (r / 0.1) ** 2), Math.sin(a) * r]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.005, 10]} />{M.matte({ col: "#0a0a0b" })}</mesh>; })}
    {/* el chorro de arriba y las gotas que salen por debajo de los agujeros */}
    {on && <mesh position={[0.01, 0.25, 0]}><cylinderGeometry args={[0.008, 0.006, 0.44, 16, 1, true]} />{M.water({ op: 0.65, emI: 0.6 })}</mesh>}
    {on && Array.from({ length: 10 }, (_, i) => { const k = ((tt * 1.4 + i / 10) % 1), a = i * 1.9, r = 0.03 + 0.04 * rn(i, 2); return <mesh key={"d" + i} position={[Math.cos(a) * r, -0.01 - 0.3 * k * k, Math.sin(a) * r]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.006, 10, 8]} />{M.water({ op: 0.85, emI: 0.5 })}</mesh>; })}
    {/* el mechón grueso que cae y queda arriba del disco */}
    <group position={[0, 0.03 + 0.3 * (1 - hair), 0]}><Tuft id="cs" s={1.5} /></group>
  </>;
}}</Scene3D>;

// ---- 19:22 · CINCO SEGUNDOS: un cronómetro de cocina gira cinco clics; mientras, una mano levanta el mechón del coladero y lo tira; suena la campanita ----
export const HFiveSec: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="tile"
  cam={{ at: [0.06, 0.08, 0], az: [-0.2, 0.12], el: [0.36, 0.28], r: [0.92, 0.8], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="FIVE SECONDS" col={AMB} />}>{(tt) => {
  const tick = Math.min(5, Math.floor(cl((tt - 0.6) / 5) * 5.01)), ring = cl((tt - 5.6) / 0.15) * (1 - cl((tt - 6.4) / 0.4));
  const grab = eio(tt, 1.4, 2.4), take = eio(tt, 2.6, 4.2), shake = ring * 0.08 * Math.sin(tt * 60);
  return <>
    {/* el coladero en el piso con el mechón */}
    <group position={[-0.16, 0.004, 0.06]}>
      <mesh><cylinderGeometry args={[0.06, 0.055, 0.008, 40]} />{M.steel({ col: "#cfd4d8" })}</mesh>
      <group position={[-0.32 * take, 0.02 + 0.1 * take, 0.0 + 0.06 * take]}><Tuft id="fs" s={1.2} /></group>
    </group>
    {/* la mano que baja, pinza el mechón y se lo lleva */}
    <group position={[-0.16 - 0.32 * take, lerp(0.3, 0.06, grab) + 0.1 * take, 0.06 + 0.06 * take]} rotation={[0.2, 0.2, 0]}>
      <RBox s={[0.08, 0.09, 0.028]} r={0.012} p={[0, 0.07, 0]}>{M.matte({ col: "#d8a888" })}</RBox>
      {[-0.012, 0.012].map((x, i) => <mesh key={i} position={[x * (1.6 - grab), 0.0, 0]} castShadow><capsuleGeometry args={[0.009, 0.05, 6, 12]} />{M.matte({ col: "#d4a283" })}</mesh>)}
    </group>
    {/* el cronómetro de cocina: tomate rojo con dial blanco que gira de a clic */}
    <group position={[0.2, 0.07, -0.02]} rotation={[0, -0.4, shake]}>
      <mesh castShadow scale={[1, 0.85, 1]}><sphereGeometry args={[0.075, 40, 28]} />{M.plastic({ col: "#d0261c" })}</mesh>
      <mesh position={[0, 0.062, 0]}><cylinderGeometry args={[0.012, 0.012, 0.012, 16]} />{M.plastic({ col: "#2a6a2a" })}</mesh>
      <group position={[0, 0, 0.066]} rotation={[0, 0, -tick * (PI / 6)]}>
        <mesh><cylinderGeometry args={[0.04, 0.04, 0.012, 40]} />{M.porcelain()}</mesh>
        {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i * PI / 6) * 0.03, 0.0065, Math.cos(i * PI / 6) * 0.03]} rotation={[0, -i * PI / 6, 0]}><boxGeometry args={[0.002, 0.001, 0.008]} />{M.matte({ col: "#222" })}</mesh>)}
      </group>
      <mesh position={[0, 0.045, 0.07]}><coneGeometry args={[0.006, 0.014, 3]} />{M.matte({ col: "#222" })}</mesh>
      <pointLight position={[0, 0.05, 0.15]} intensity={0.1 * ring} distance={0.3} color="#ffd38a" />
    </group>
    {/* las ondas de la campanita */}
    {ring > 0 && [0, 1, 2].map((i) => { const k = ((tt * 1.4 + i / 3) % 1); return <mesh key={i} position={[0.2, 0.08, 0.06]} rotation={[0, -0.4, 0]}><ringGeometry args={[0.09 + 0.12 * k, 0.096 + 0.12 * k, 48]} />{M.glow({ col: AMB, op: 0.22 * (1 - k) * ring })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 20:00 · AFUERA, NO ABAJO: la cruz vista desde arriba con el mechón colgando hacia el caño; un gancho baja, lo engancha y lo saca para arriba, hacia la cámara ----
export const HOutNotDown: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="none"
  cam={{ at: [0, 0.06, 0], at1: [0, 0.14, 0], az: [0.15, -0.1], el: [0.5, 0.4], r: [0.95, 0.88], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="OUT · NOT DOWN" col={AMB} />}>{(tt) => {
  const hk = eio(tt, 0.6, 1.8), pull = eio(tt, 2.4, 4.6), y = lerp(-0.08, 0.16, pull);
  return <>
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 40]} />{M.matte({ col: "#0b0c0e" })}</mesh>
    <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.07, 0.07, 0.24, 40, 1, true]} />{M.matte({ col: "#141516", side: THREE.DoubleSide })}</mesh>
    <Cross r={0.07} y={0.005} />
    {/* el mechón: cuelga de la barra y sube con el gancho */}
    <group position={[0.01, pull > 0 ? y : -0.04 + 0.004 * Math.sin(tt * 2), 0.0]}>
      <Tuft id="ond" s={1.4} />
      <Hair id="ond_l" n={20} spread={0.012} r={0.0013} pts={[[0, 0.05, 0], [0.01, 0.0, 0.01], [-0.01, -0.06, 0.0], [0.005, -0.1, 0.01]]} />
    </group>
    {/* el gancho de alambre con mango rojo */}
    <group position={[0.012, lerp(0.5, 0.0, hk) + (pull > 0 ? y + 0.04 : 0), 0.0]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.0022, 0.0022, 0.24, 8]} />{M.steel()}</mesh>
      <mesh position={[0.008, 0.0, 0]} rotation={[0, 0, PI]}><torusGeometry args={[0.008, 0.0022, 8, 20, PI]} />{M.steel()}</mesh>
      <mesh position={[0, 0.26, 0]}><cylinderGeometry args={[0.01, 0.01, 0.06, 16]} />{M.plastic({ col: RED })}</mesh>
    </group>
    {/* gotas que caen del mechón al subir */}
    {[0, 1, 2, 3].map((j) => { const k = cl((tt - 3.0 - j * 0.35) / 0.5); return k > 0 && k < 1 ? <mesh key={j} position={[0.01 + 0.012 * (j - 1.5), lerp(0.2, 0.0, k * k) + 0.0, 0.01]}><sphereGeometry args={[0.005, 10, 8]} />{M.water({ op: 0.9 })}</mesh> : null; })}
  </>;
}}</Scene3D>;
