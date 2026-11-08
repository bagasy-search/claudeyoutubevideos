// sk8pd · el caldo de 30 centavos: 25 componentes únicos, uno por idea (registro en D:/rtmp/premium8n_sachiko_COMPONENTES.md).
import React, { useMemo } from "react";
import * as THREE from "three";
import { F, Hero, C, lerp, pop, Pop, Ink, cardTex, Steam, Ring, cl, eio, orbita, Box, Cyl, AMB, V } from "./hk";
import { mk } from "./casa3d";
import { Board, Spoon, WSpoon, Hand, Drop, Pot, Glass, Dish, Kombu, Flake, Waft, Nest, Burner, col, rnd, BROTH, KOMBU, WOOD, STEEL, PINKF } from "./hpk";

const RED = "#ff8a7a", GRN = "#bfe08a";
const FOIL = "#c9ced6";
const Packet: React.FC<{ p: V; rot?: V; s?: number; torn?: number }> = ({ p, rot = [0, 0, 0], s = 1, torn = 0 }) =>
  <group position={p} rotation={rot} scale={s}>
    <Box p={[0, 0, 0]} s={[0.2, 0.3, 0.035]} c={FOIL} m={0.9} r={0.28} rad={0.012} />
    <Box p={[0, 0.02, 0.019]} s={[0.17, 0.14, 0.002]} c="#c8322a" r={0.4} rad={0.001} />
    <group position={[0, 0.16 + 0.1 * torn, 0]} rotation={[0, 0, -0.9 * torn]}><Box p={[0.3 * torn, 0, 0]} s={[0.2, 0.03, 0.035]} c={FOIL} m={0.9} r={0.28} rad={0.006} /></group>
  </group>;

// 0:10 · EL SOBRECITO: se rasga la punta, el polvo cae en el tazón y el olor sube
export const P_silver: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.1, 0.84, 1.95], [0, 0.42, 0]), C([-0.28, 0.78, 1.72], [0, 0.42, 0]), 7)}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.4, warm: 0.5 }}
  scene={(tt) => { const torn = eio(tt, 1.1, 1.7), tilt = eio(tt, 1.9, 2.5), fl = eio(tt, 2.5, 2.8) * (1 - eio(tt, 4.8, 5.2)), sm = eio(tt, 3.6, 5.2), pile = eio(tt, 2.6, 4.8);
    return <>
      <Board w={1.4} d={0.8} />
      <Dish p={[-0.05, 0.06, 0]} s={1.5} fill="#e7d6a0" />
      <mesh position={[-0.05, 0.27, 0]}><coneGeometry args={[0.04 + 0.1 * pile, 0.015 + 0.06 * pile, 28]} /><meshStandardMaterial color="#d59a3e" roughness={0.9} /></mesh>
      <Packet p={[0.3 - 0.2 * tilt, 0.62 + 0.04 * Math.sin(tt * 2), 0]} rot={[0, -0.25, 2.5 * tilt]} s={1.5} torn={torn} />
      {fl > 0.02 && Array.from({ length: 34 }, (_, i) => { const u = (tt * 1.5 + i / 34) % 1; return <mesh key={i} position={[-0.05 + 0.03 * Math.sin(i * 3), 0.62 - 0.36 * u, 0.03 * Math.cos(i * 5)]}><sphereGeometry args={[0.006, 6, 5]} /><meshStandardMaterial color="#d59a3e" /></mesh>; })}
      <Waft p={[-0.05, 0.3, 0]} t={tt} k={sm} s={1.5} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={0.8} txt="A LITTLE SILVER ENVELOPE" col={AMB} />} />;

// 0:36 · EL ROPERO: se abren dos puertas y adentro entra entera la cocina de Osaka
export const P_closet: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.0, 0.8, 2.3], [0, 0.62, 0]), C([0.3, 0.75, 1.75], [0, 0.6, 0]), 8)}
  set={{ spot: [0, 0.3, 0] as V, spotK: 0.3, warm: 0.6 }}
  scene={(tt) => { const op = eio(tt, 0.7, 2.1), li = eio(tt, 1.2, 2.6);
    return <>
      <Box p={[0, 0.72, -0.28]} s={[0.9, 1.4, 0.03]} c="#d9c3a0" r={0.8} />
      <Box p={[-0.45, 0.72, -0.08]} s={[0.04, 1.42, 0.42]} c="#8a5d35" r={0.6} /><Box p={[0.45, 0.72, -0.08]} s={[0.04, 1.42, 0.42]} c="#8a5d35" r={0.6} />
      <Box p={[0, 1.44, -0.08]} s={[0.94, 0.04, 0.42]} c="#8a5d35" r={0.6} /><Box p={[0, 0.04, -0.08]} s={[0.94, 0.06, 0.42]} c="#8a5d35" r={0.6} />
      <Box p={[0, 0.42, -0.06]} s={[0.84, 0.34, 0.34]} c="#a8743a" r={0.6} rad={0.006} />
      <Box p={[0, 0.6, -0.06]} s={[0.86, 0.025, 0.36]} c="#e8e2d6" r={0.35} rad={0.004} />
      <Burner p={[-0.18, 0.6, -0.06]} s={0.55} t={tt} flame={li} />
      <Pot p={[-0.18, 0.66, -0.06]} s={0.42} lvl={0.7} />
      <Steam p={[-0.18, 0.84, -0.06]} t={tt} k={li} s={0.35} />
      <Dish p={[0.2, 0.61, -0.03]} s={0.42} />
      <Box p={[0, 1.08, -0.2]} s={[0.84, 0.022, 0.14]} c="#8a5d35" r={0.6} />
      {[-0.28, -0.08, 0.14, 0.3].map((x, i) => <Cyl key={i} p={[x, 1.17, -0.2]} r={0.045 - 0.006 * (i % 2)} h={0.16 - 0.03 * (i % 2)} c={["#7a4f2c", "#d8c8a0", "#3f5a4a", "#a03c2a"][i]} rough={0.5} />)}
      <pointLight position={[0, 1.1, 0.2]} intensity={2.4 * li} distance={2} color="#ffd9a0" />
      <group position={[-0.44, 0.74, 0.14]} rotation={[0, -2.15 * op, 0]}><Box p={[0.22, 0, 0]} s={[0.44, 1.38, 0.025]} c="#b98a58" r={0.6} rad={0.006} /><Cyl p={[0.38, 0, 0.03]} r={0.016} h={0.02} c="#2a2018" rot={[Math.PI / 2, 0, 0]} /></group>
      <group position={[0.44, 0.74, 0.14]} rotation={[0, 2.15 * op, 0]}><Box p={[-0.22, 0, 0]} s={[0.44, 1.38, 0.025]} c="#b98a58" r={0.6} rad={0.006} /><Cyl p={[-0.38, 0, 0.03]} r={0.016} h={0.02} c="#2a2018" rot={[Math.PI / 2, 0, 0]} /></group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.5} txt="KITCHEN SIZE OF A CLOSET" col={AMB} />} />;

// 1:44 · EL BARCO: mar de olas por filas, el barco con el kombu baja de la nieve hacia los faroles de Osaka
export const P_ships: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.0, 0.85, 2.7], [0, 0.42, -0.2]), C([0.3, 0.72, 2.4], [0.1, 0.42, -0.2]), 9)}
  set={{ spot: [0, 0, 0] as V, spotK: 0, warm: 0.3, back: false, bg: "#b8ccd9" }}
  scene={(tt) => { const k = eio(tt, 0.3, 7.2), x = lerp(-1.25, 1.05, k), bob = 0.022 * Math.sin(tt * 1.6), lan = eio(tt, 4.6, 6.4);
    return <>
      <Box p={[0, 0.06, -0.3]} s={[5.4, 0.08, 2.8]} c="#2f6a8f" r={0.3} />
      {Array.from({ length: 6 }, (_, r) => Array.from({ length: 9 }, (_, i) => <mesh key={r + "-" + i} position={[-2.2 + i * 0.55 + (r % 2) * 0.26 + 0.05 * Math.sin(tt * 0.9 + r), 0.11 + 0.016 * Math.sin(tt * 1.5 + i + r), 0.72 - r * 0.42]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.035, 0.34, 6, 10]} /><meshStandardMaterial color={r % 2 ? "#4a8fb5" : "#3d7ea3"} roughness={0.25} /></mesh>))}
      {[-1.9, -1.35, -2.25].map((mx, i) => <group key={i} position={[mx, 0.1, -1.1 + i * 0.12]}><mesh position={[0, 0.34 + i * 0.05, 0]}><coneGeometry args={[0.46, 0.7 + i * 0.1, 5]} /><meshStandardMaterial color="#6d7f8f" roughness={0.9} /></mesh><mesh position={[0, 0.58 + i * 0.09, 0]}><coneGeometry args={[0.19, 0.27, 5]} /><meshStandardMaterial color="#fbfcff" roughness={0.7} /></mesh></group>)}
      <group position={[1.65, 0.1, -0.9]}><Box p={[0, 0.2, 0]} s={[0.8, 0.34, 0.4]} c="#6a4a30" r={0.8} /><mesh position={[0, 0.48, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.66, 0.26, 4]} /><meshStandardMaterial color="#3a3030" roughness={0.7} /></mesh>
        {[-0.25, 0.25].map((lx, i) => <mesh key={i} position={[lx, 0.3, 0.23]}><sphereGeometry args={[0.05, 14, 10]} /><meshStandardMaterial color="#ff5a3a" emissive="#ff5a3a" emissiveIntensity={0.25 + 1.3 * lan} /></mesh>)}<pointLight position={[0, 0.32, 0.5]} intensity={1.6 * lan} distance={1.8} color="#ff9a5a" /></group>
      <group position={[x, 0.16 + bob, 0.15]} rotation={[0, 0, 0.03 * Math.sin(tt * 1.1)]}>
        <Box p={[0, 0.08, 0]} s={[0.66, 0.13, 0.22]} c="#7a5230" r={0.7} rad={0.03} />
        <mesh position={[0.4, 0.09, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.1, 0.22, 4]} /><meshStandardMaterial color="#7a5230" roughness={0.7} /></mesh>
        <Cyl p={[-0.02, 0.42, 0]} r={0.013} h={0.56} c="#4a2f1c" />
        <mesh position={[-0.02, 0.46, 0.02]}><boxGeometry args={[0.34, 0.38, 0.012, 6, 1]} /><meshStandardMaterial color="#f4ecd9" roughness={0.8} /></mesh>
        {[-0.22, -0.11, 0.12, 0.23].map((bx, i) => <group key={i} position={[bx, 0.19, 0]}><Box p={[0, 0, 0]} s={[0.08, 0.075, 0.15]} c={KOMBU} r={0.7} rad={0.01} /><Box p={[0, 0, 0]} s={[0.012, 0.08, 0.152]} c="#d7c38c" r={0.7} /></group>)}
      </group>
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.2} txt="FROM THE COLD NORTH" col="#ffffff" />} />;

// 1:56 · LAS HOJAS: caen tres láminas rígidas de a una y el polvo blanco destella
export const P_powder: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([-0.22, 0.75, 0.95], [0, 0.08, 0]), C([0.2, 0.55, 0.78], [0.02, 0.08, 0]), 9)}
  set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.5 }}
  scene={(tt) => { const g = eio(tt, 3.6, 5.2);
    return <>
      <Board w={1.4} d={0.9} c="#c49a68" />
      {[0, 1, 2].map((i) => { const k = pop(tt, 0.4 + i * 0.8); return k < 0.02 ? null : <group key={i} position={[0.03 * (i - 1), 0.065 + i * 0.022 + (1 - Math.min(1, k)) * 0.5, -0.03 * (i - 1)]} rotation={[0, 0.16 * (i - 1), 0]}><Kombu p={[0, 0, 0]} w={0.82} d={0.36} wave={0.009} /></group>; })}
      {Array.from({ length: 34 }, (_, i) => { const f = Math.max(0, Math.sin(tt * 1.1 + i * 2.1)); return <mesh key={i} position={[(rnd(i) - 0.5) * 0.72, 0.125, (rnd(i + 3) - 0.5) * 0.28]} scale={0.25 + 0.75 * g * f}><sphereGeometry args={[0.007, 8, 6]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>; })}
      <pointLight position={[0, 0.5, 0.3]} intensity={0.9 * g} distance={1.4} color="#fff4dc" />
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.8} txt="WHITE POWDER · KEEP IT" col={AMB} />} />;

// 2:28 · LA MEDIDA: una hoja baja y se calza exacta sobre la mano abierta; un marco de luz la mide
export const P_hand: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.1, 0.85, 0.92], [0, 0.13, 0]), C([-0.18, 0.78, 0.84], [0, 0.13, 0]), 6)}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.45, warm: 0.6 }}
  scene={(tt) => { const dn = eio(tt, 0.7, 2.0), fr = eio(tt, 2.2, 3.1);
    return <>
      <Board w={1.2} d={0.8} />
      <Hand p={[-0.05, 0.1, 0]} s={2.1} />
      <Kombu p={[0.05, lerp(0.75, 0.16, dn), 0]} w={0.42} d={0.29} wave={0.006} />
      {[[0.05, -0.16, 0.44, 0.012], [0.05, 0.16, 0.44, 0.012], [-0.17, 0, 0.012, 0.32], [0.27, 0, 0.012, 0.32]].map(([x, z, w, d], i) => <mesh key={i} position={[x, 0.195, z]} rotation={[-Math.PI / 2, 0, 0]} scale={Math.max(0.05, fr)}><planeGeometry args={[w, d]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.95 * fr} toneMapped={false} depthWrite={false} /></mesh>)}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.5} txt="YOUR OPEN HAND" col={AMB} />} />;

// 2:44 · LA BOLSITA: el kombu cuelga de un hilo con etiqueta y se moja como té; el agua hierve y no se tiñe
export const P_teabag: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.25, 0.72, 1.7], [0, 0.44, 0]), C([-0.2, 0.68, 1.55], [0, 0.44, 0]), 8)}
  set={{ spot: [0, 0.2, 0] as V, spotK: 0.55, warm: 0.45, back: false, bg: "#2a2018" }}
  scene={(tt) => { const y = 0.42 + 0.13 * Math.sin(tt * 2.1) * eio(tt, 0.8, 1.6), ty = 0.84 - 0.15 * eio(tt, 0, 0.9);
    const tag = useMemo(() => cardTex(["TEA?"], { bg: "#fbf3df", fg: "#8a1f1f", w: 200, h: 130 }), []);
    return <>
      <Board w={1.2} d={0.8} />
      <Glass p={[0, 0.05, 0]} r={0.24} h={0.36} water="#9a6414" lvl={0.78} op={0.85}>
        {Array.from({ length: 14 }, (_, i) => { const u = (tt * 1.2 + i / 14) % 1; return <mesh key={i} position={[(rnd(i) - 0.5) * 0.34, 0.05 + u * 0.26, (rnd(i + 2) - 0.5) * 0.34]}><sphereGeometry args={[0.009 + 0.005 * rnd(i + 4), 8, 6]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.8} /></mesh>; })}
      </Glass>
      <group position={[0, y, 0]}><Kombu p={[0, -0.13, 0]} rot={[Math.PI / 2, 0, 0]} w={0.15} d={0.26} wave={0.005} /></group>
      <Cyl p={[0.0, (y + ty) / 2, 0]} r={0.002} h={Math.max(0.02, ty - y)} c="#efe6d0" rough={0.9} />
      <mesh position={[0.07, ty - 0.02, 0.01]}><planeGeometry args={[0.14, 0.09]} /><meshStandardMaterial map={tag} roughness={0.7} side={THREE.DoubleSide} /></mesh>
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.6} txt="NOT A TEA BAG" col={RED} />} />;

// 3:36 · LA CABEZA DEL ALFILER: fondo de la olla, burbujitas que nacen por el borde y un alfiler que se les compara
export const P_pinhead: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.0, 0.92, 1.0], [0.04, 0.08, 0.1]), C([0.34, 0.42, 0.72], [0.3, 0.08, 0.36]), 9)}
  set={{ spot: [0.2, 0, 0.1] as V, spotK: 0.55, warm: 0.4, back: false, bg: "#2a2018" }}
  scene={(tt) => { const pin = eio(tt, 3.3, 5.0);
    return <>
      <Cyl p={[0, 0.05, 0]} r={0.62} h={0.04} c="#a2a8ae" m={0.85} rough={0.34} />
      <Kombu p={[-0.14, 0.085, -0.05]} rot={[0, 0, 0.3]} w={0.5} d={0.26} wave={0.008} />
      {Array.from({ length: 60 }, (_, i) => { const a = i * 0.52, R = 0.58 - 0.05 * rnd(i), k = pop(tt, 0.2 + rnd(i + 2) * 3.0, 8, 0.5); return <Pop key={i} k={k} p={[R * Math.cos(a), 0.078, R * Math.sin(a)]}><mesh><sphereGeometry args={[0.0085 + 0.0035 * rnd(i + 1), 10, 8]} /><meshPhysicalMaterial color="#ffffff" roughness={0.02} transparent opacity={0.8} clearcoat={1} /></mesh></Pop>; })}
      <group position={[lerp(0.75, 0.34, pin), 0.095, 0.38]} rotation={[0, 0.3, 0]}><Cyl p={[0.13, 0, 0]} r={0.0028} h={0.26} c={STEEL} m={0.95} rough={0.12} rot={[0, 0, Math.PI / 2]} /><mesh><sphereGeometry args={[0.012, 16, 12]} /><meshStandardMaterial color="#d63a3a" roughness={0.3} /></mesh></group>
      <Ring p={[0.335, 0.078, 0.37]} r={0.045} k={eio(tt, 5.0, 5.8)} col="#ffd27a" />
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.0} txt="THE HEAD OF A PIN" col={AMB} />} />;

// 3:56 · LA SOGA MOJADA: rollo de soga que gotea y larga un olor verdoso
export const P_rope: F = ({ t, h }) => {
  const geo = useMemo(() => { const pts: THREE.Vector3[] = []; for (let i = 0; i < 230; i++) { const a = i * 0.14, R = 0.16 + 0.045 * Math.sin(i * 0.05); pts.push(new THREE.Vector3(R * Math.cos(a), 0.018 + i * 0.0011, R * Math.sin(a))); } return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 420, 0.022, 10, false); }, []);
  const tex = useMemo(() => { const m = mk(64, 64, (g) => { g.fillStyle = "#7c6f50"; g.fillRect(0, 0, 64, 64); g.strokeStyle = "#5a4f38"; g.lineWidth = 7; for (let x = -64; x < 128; x += 15) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 64, 64); g.stroke(); } }); m.wrapS = m.wrapT = THREE.RepeatWrapping; m.repeat.set(170, 2); return m; }, []);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.1, 0.68, 1.1], [0, 0.18, 0]), C([-0.3, 0.56, 0.98], [0, 0.18, 0]), 8)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.2 }}
    scene={(tt) => <>
      <Board w={1.3} d={0.9} c="#a68260" />
      <group position={[0, 0.05, 0]}><mesh geometry={geo} castShadow><meshStandardMaterial map={tex} roughness={0.42} /></mesh></group>
      {[0, 1, 2, 3].map((i) => { const u = (tt * 0.6 + i * 0.25) % 1, a = i * 1.6; return <Drop key={i} p={[0.23 * Math.cos(a), 0.25 - 0.19 * u * u, 0.23 * Math.sin(a) + 0.02]} c="#b9bda0" s={1.1} op={Math.sin(Math.PI * u)} />; })}
      <Waft p={[0, 0.34, 0]} t={tt} k={eio(tt, 0.8, 2.6)} col="#9bb36a" s={1.1} />
    </>}
    over={(tt) => <Ink tt={tt} at={2.2} txt="LIKE A WET ROPE" col={GRN} />} />;
};

// 5:14 · LA CAJA CON CUCHILLA: el bonito va y viene sobre la caja; el cajoncito se abre lleno de virutas rosadas
export const P_plane: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.42, 0.58, 1.05], [0, 0.17, 0.04]), C([-0.1, 0.54, 1.14], [0, 0.17, 0.04]), 9)}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.35, warm: 0.6 }}
  scene={(tt) => { const go = eio(tt, 0.6, 1.4) * (1 - 0.6 * eio(tt, 6.6, 7.4)), x = 0.14 * Math.sin(tt * 3.8) * go, dr = eio(tt, 3.2, 4.6);
    return <>
      <Board w={1.5} d={0.9} c="#c49a68" />
      <Box p={[0, 0.15, 0]} s={[0.68, 0.2, 0.34]} c="#9c6a3a" r={0.6} rad={0.008} />
      <Box p={[0, 0.255, 0]} s={[0.72, 0.018, 0.36]} c="#b98a58" r={0.55} rad={0.005} />
      <Box p={[0, 0.266, 0]} s={[0.05, 0.004, 0.3]} c={STEEL} m={0.95} r={0.14} />
      <group position={[0, 0.15, 0.17 + 0.2 * dr]}><Box p={[0, 0, -0.1]} s={[0.54, 0.11, 0.24]} c="#7a5230" r={0.6} rad={0.005} /><Cyl p={[0, 0, 0.03]} r={0.022} h={0.03} c="#2c2018" rot={[Math.PI / 2, 0, 0]} />
        {Array.from({ length: Math.round(dr * 36) + 1 }, (_, i) => <Flake key={i} s={1} p={[(rnd(i) - 0.5) * 0.44, 0.05 + 0.04 * rnd(i + 1), -0.08 + (rnd(i + 2) - 0.5) * 0.16]} rot={[rnd(i + 3) * 3, i, rnd(i + 4) * 3]} />)}</group>
      <mesh position={[x, 0.34, 0]} scale={[1.9, 0.55, 0.62]} castShadow><sphereGeometry args={[0.14, 28, 18]} /><meshStandardMaterial color="#4a3020" roughness={0.75} /></mesh>
      <Hand p={[x + 0.27, 0.4, 0.02]} rot={[0, Math.PI, 0.25]} s={1.05} />
    </>; }}
  over={(tt) => <Ink tt={tt} at={1.4} txt="A BOX WITH A BLADE" col={AMB} />} />;

// 5:36 · SE HUNDEN: virutas sobre el agua, se ponen pesadas y bajan de a una mientras el caldo se oscurece
export const P_sink: F = ({ t, h }) => <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.12, 0.5, 1.62], [0, 0.32, 0]), C([-0.28, 0.54, 1.48], [0, 0.32, 0]), 10)}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.55, warm: 0.45, back: false, bg: "#2a2018" }}
  scene={(tt) => { const am = eio(tt, 1.0, 7.8);
    return <>
      <Board w={1.2} d={0.9} />
      <Glass p={[0, 0.05, 0]} r={0.36} h={0.52} water={col("#b8a04e", "#8a4e10", am)} lvl={0.82} op={0.88}>
        {Array.from({ length: 34 }, (_, i) => { const st = 0.6 + rnd(i + 8) * 6.2, k = eio(tt, st, st + 2.2), a = i * 2.4, R = 0.28 * Math.sqrt(rnd(i + 1)); return <Flake key={i} s={0.9} p={[R * Math.cos(a) + 0.015 * Math.sin(tt + i), lerp(0.46, 0.05 + 0.02 * rnd(i + 9), k), R * Math.sin(a)]} rot={[rnd(i) * 3 + 0.3 * tt * (1 - k), i, rnd(i + 2) * 3]} />; })}
      </Glass>
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.2} txt="HEAVY, THEN THEY SINK" col={AMB} />} />;

// 6:43 · QUE GOTEE: la tela atada a la cuchara de madera cuelga sobre el tazón; una gota por vez y su anillo
export const P_drip: F = ({ t, h }) => <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([-0.12, 0.88, 1.62], [0, 0.46, 0]), C([0.22, 0.8, 1.46], [0, 0.46, 0]), 9)}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.45, warm: 0.65 }}
  scene={(tt) => { const P = 1.5, u = (tt % P) / P, fall = cl((u - 0.35) / 0.32), rp = cl((u - 0.68) / 0.32);
    return <>
      <Board w={1.4} d={0.9} />
      <Dish p={[0, 0.06, 0]} s={1.45} fill="#d5a34a" />
      <Box p={[0, 0.78, 0]} s={[1.02, 0.03, 0.05]} c="#a8703c" r={0.6} rad={0.012} />
      {[-0.46, 0.46].map((x) => <Cyl key={x} p={[x, 0.42, 0]} r={0.018} h={0.74} c="#7a5230" rough={0.7} />)}
      <mesh position={[0, 0.6, 0]} scale={[1, 0.95 + 0.03 * Math.sin(tt * 0.9), 1]} castShadow><sphereGeometry args={[0.14, 28, 20]} /><meshStandardMaterial color="#efe6d2" roughness={0.95} /></mesh>
      <mesh position={[0, 0.74, 0]}><coneGeometry args={[0.06, 0.1, 12]} /><meshStandardMaterial color="#efe6d2" roughness={0.95} /></mesh>
      <mesh position={[0, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.03, 0.006, 8, 18]} /><meshStandardMaterial color="#b8a074" roughness={0.9} /></mesh>
      <Drop p={[0, lerp(0.46, 0.28, fall * fall), 0]} c="#c8862e" s={1.1} op={u < 0.68 ? 0.95 : 0.02} />
      <mesh position={[0, 0.285, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.3 + 2.4 * rp}><ringGeometry args={[0.05, 0.057, 42]} /><meshBasicMaterial color="#fff0c0" transparent opacity={0.8 * (1 - rp) * (u > 0.68 ? 1 : 0)} depthWrite={false} toneMapped={false} /></mesh>
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.4} txt="SHE LET IT DRIP" col={AMB} />} />;

// 7:13 · UNA CUCHARADA: la mano retuerce la tela, cae una gota gris y la nube tapa todo el tazón claro
export const P_lastspoon: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.12, 1.12, 1.26], [0, 0.36, 0]), C([-0.18, 1.04, 1.14], [0, 0.36, 0]), 7)}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.45, warm: 0.45 }}
  scene={(tt) => { const tw = eio(tt, 0.3, 1.7), fall = eio(tt, 1.6, 2.2), cl1 = eio(tt, 2.2, 5.4);
    return <>
      <Board w={1.2} d={0.9} />
      <Dish p={[0, 0.06, 0]} s={1.6} fill={col("#d9aa42", "#7f7666", cl1)} />
      <group position={[0, 0.62 - 0.02 * tw, 0]} rotation={[0, tw * 5, 0]} scale={[1 - 0.32 * tw, 1 + 0.5 * tw, 1 - 0.32 * tw]}><mesh castShadow><sphereGeometry args={[0.12, 24, 18]} /><meshStandardMaterial color="#d8cdb6" roughness={0.95} /></mesh>{[0, 1, 2, 3, 4].map((i) => <mesh key={i} rotation={[0.25 * i - 0.5, i, 0.4]}><torusGeometry args={[0.121, 0.004, 6, 28]} /><meshStandardMaterial color="#9d9078" /></mesh>)}</group>
      <Hand p={[0.24, 0.62, 0]} rot={[0, Math.PI, 0]} s={1.15} curl={0.5 + 0.5 * tw} /><Hand p={[-0.24, 0.62, 0.02]} s={1.15} curl={0.5 + 0.5 * tw} />
      <Drop p={[0, lerp(0.48, 0.3, fall * fall), 0]} c="#79705c" s={1.25} op={fall < 0.98 ? 0.95 : 0.02} />
      {Array.from({ length: 16 }, (_, i) => { const k = eio(tt, 2.2 + i * 0.12, 5.0), a = i * 1.9, R = 0.28 * k * Math.sqrt(rnd(i + 2)); return <mesh key={i} position={[R * Math.cos(a), 0.3, R * Math.sin(a)]} rotation={[-Math.PI / 2, 0, 0]} scale={Math.max(0.05, k)}><circleGeometry args={[0.07 + 0.04 * rnd(i), 24]} /><meshStandardMaterial color="#6f6658" transparent opacity={0.34 * k} depthWrite={false} /></mesh>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.7} txt="ONE SPOON. THE WHOLE POT." col={RED} />} />;

// 8:23 · SE MULTIPLICA: la pieza del kombu y la del bonito se calzan; sus dos llamas chicas se vuelven una torre
export const P_lock: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.05, 0.7, 1.56], [0, 0.44, 0]), C([-0.26, 0.64, 1.36], [0, 0.46, 0]), 8)}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.55, warm: 0.25, back: false, bg: "#231a12" }}
  scene={(tt) => { const j = eio(tt, 0.6, 2.2), snap = pop(tt, 2.2, 7, 0.32), up = eio(tt, 2.5, 5.0), xa = lerp(-0.52, -0.09, j), xb = lerp(0.52, 0.09, j);
    const lt = (x: number, H: number, c: string, op: number, r = 0.09) => <mesh position={[x, 0.15 + H / 2, 0]}><cylinderGeometry args={[r, r * 1.35, H, 32, 1, true]} /><meshBasicMaterial color={c} transparent opacity={op} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} /></mesh>;
    return <>
      <Board w={1.6} d={0.8} c="#8a6a4a" />
      <group position={[xa, 0.105, 0]}><Box p={[0, 0, 0]} s={[0.18, 0.11, 0.18]} c={KOMBU} r={0.65} rad={0.012} /></group>
      <group position={[xb, 0.105, 0]}><Box p={[0, 0, 0]} s={[0.18, 0.11, 0.18]} c={PINKF} r={0.6} rad={0.012} /></group>
      {j < 0.98 ? <>{lt(xa, 0.24, "#7fd19a", 0.7)}{lt(xb, 0.24, "#ffb18e", 0.7)}</> : <>{lt(0, 0.24 + 1.0 * up, "#ffd27a", 0.75, 0.13)}{lt(0, 0.2 + 0.8 * up, "#fff2c8", 0.65, 0.06)}</>}
      <Ring p={[0, 0.056, 0]} r={0.2 + 0.32 * up} k={snap * (1 - 0.6 * up)} col="#ffd27a" />
      <pointLight position={[0, 0.7, 0.4]} intensity={2.4 * up} distance={2.4} color="#ffd9a0" />
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.9} txt="IT MULTIPLIES" col={AMB} size={110} />} />;

// 8:52 · EL TOMATE: se abre en dos y su centro brilla igual que la hoja de kombu de al lado
export const P_tomato: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.2, 0.64, 1.42], [0.04, 0.2, 0]), C([-0.18, 0.56, 1.25], [0.04, 0.2, 0]), 8)}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.35, warm: 0.55 }}
  scene={(tt) => { const op = eio(tt, 0.7, 2.0), gl = eio(tt, 2.2, 3.6), ln = eio(tt, 3.6, 4.8);
    const half = (dir: number) => <group position={[-0.28 + dir * 0.17 * op, 0.25, 0]} rotation={[0, dir * 0.85 * op, 0]}><mesh rotation={[0, 0, -dir * Math.PI / 2]}><sphereGeometry args={[0.19, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#d8362a" roughness={0.2} clearcoat={0.8} /></mesh><mesh rotation={[0, dir * Math.PI / 2, 0]} position={[-dir * 0.001, 0, 0]}><circleGeometry args={[0.185, 32]} /><meshStandardMaterial color="#ea6a4c" roughness={0.55} side={THREE.DoubleSide} /></mesh>{[0, 1, 2, 3, 4].map((i) => <mesh key={i} rotation={[0, dir * Math.PI / 2, 0]} position={[-dir * 0.004, 0.105 * Math.sin(i * 1.257), 0.105 * Math.cos(i * 1.257)]}><circleGeometry args={[0.03, 16]} /><meshStandardMaterial color="#f2b64a" roughness={0.3} side={THREE.DoubleSide} /></mesh>)}</group>;
    return <>
      <Board w={1.7} d={0.9} />
      {half(-1)}{half(1)}
      <mesh position={[-0.28, 0.25, 0.02]} scale={Math.max(0.1, gl)}><sphereGeometry args={[0.06, 22, 16]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} /></mesh>
      <Kombu p={[0.46, 0.1, 0]} w={0.5} d={0.28} wave={0.007} />
      <mesh position={[0.46, 0.17, 0.0]} scale={Math.max(0.1, gl)}><sphereGeometry args={[0.06, 22, 16]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} /></mesh>
      {Array.from({ length: 20 }, (_, i) => { const u = i / 19; return u > ln ? null : <mesh key={i} position={[lerp(-0.2, 0.38, u), 0.25 - 0.08 * u + 0.12 * Math.sin(Math.PI * u), 0.01]}><sphereGeometry args={[0.009, 8, 6]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} /></mesh>; })}
      <pointLight position={[0.1, 0.45, 0.35]} intensity={1.2 * gl} distance={1.6} color="#ffdca0" />
    </>; }}
  over={(tt) => <Ink tt={tt} at={3.5} txt="THE SAME AS A TOMATO" col={AMB} />} />;

// 9:25 · LA RAYA DEL DÍA: tubo de vidrio con la marca de 2.300; un solo sobre lo llena casi dos tercios
export const P_salt: F = ({ t, h }) => { const top = useMemo(() => cardTex(["2,300 MG", "ALL DAY"], { bg: "#fff4dc", fg: "#3a2a18", w: 300, h: 150 }), []), one = useMemo(() => cardTex(["1 PACKET"], { bg: "#c8322a", fg: "#fff4dc", w: 280, h: 100 }), []);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.1, 0.52, 1.62], [0, 0.44, 0]), C([-0.24, 0.5, 1.46], [0, 0.44, 0]), 10)}
    set={{ spot: [0, 0.2, 0] as V, spotK: 0.55, warm: 0.3, back: false, bg: "#2a2018" }}
    scene={(tt) => { const lvl = eio(tt, 1.6, 5.4) * 0.65, line = pop(tt, 0.5), H = 0.62;
      return <>
        <Board w={1.2} d={0.8} c="#8a6a4a" />
        <Glass p={[0, 0.05, 0]} r={0.11} h={H} water="#f7f7f2" lvl={Math.max(0.02, lvl)} op={0.97} />
        <Packet p={[0.02, 0.92, 0]} rot={[0, 0, 2.9]} s={0.7} torn={1} />
        {lvl < 0.645 && Array.from({ length: 16 }, (_, i) => { const u = (tt * 1.6 + i / 16) % 1, y0 = 0.82, y1 = 0.08 + H * lvl; return <mesh key={i} position={[0.02 * Math.sin(i * 3), lerp(y0, y1, u), 0.02 * Math.cos(i * 5)]}><sphereGeometry args={[0.005, 6, 5]} /><meshStandardMaterial color="#ffffff" /></mesh>; })}
        <Pop k={line} p={[0, 0.08 + H, 0]}><Box p={[0.14, 0, 0]} s={[0.3, 0.008, 0.008]} c="#ff5a4a" r={0.4} cast={false} /><mesh position={[0.46, 0, 0]}><planeGeometry args={[0.36, 0.18]} /><meshBasicMaterial map={top} toneMapped={false} side={THREE.DoubleSide} /></mesh></Pop>
        <Pop k={pop(tt, 5.0)} p={[-0.34, 0.08 + H * 0.65, 0.02]}><mesh><planeGeometry args={[0.36, 0.13]} /><meshBasicMaterial map={one} toneMapped={false} side={THREE.DoubleSide} /></mesh></Pop>
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.2} txt="A WHOLE DAY'S LIMIT" col={RED} />} />;
};

// 9:42 · UN YEN: la monedita de aluminio rueda y va encendiendo tres tazones de a uno
export const P_yen: F = ({ t, h }) => { const face = useMemo(() => mk(256, 256, (g) => { g.fillStyle = "#d9dcde"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#6e747a"; g.font = "900 150px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("1", 128, 118); g.font = "800 40px Arial"; g.fillText("YEN", 128, 212); }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.66, 1.92], [0, 0.2, 0]), C([0.32, 0.6, 1.72], [0, 0.2, 0]), 8)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.6 }}
    scene={(tt) => { const k = eio(tt, 0.4, 5.6), x = lerp(-0.85, 0.75, k);
      return <>
        <Board w={2.3} d={0.8} />
        <group position={[x, 0.17, 0.26]} rotation={[0, 0, -k * 15]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.014, 40]} /><meshStandardMaterial color="#d9dcde" metalness={0.75} roughness={0.32} /></mesh><mesh position={[0, 0, 0.008]}><circleGeometry args={[0.115, 40]} /><meshStandardMaterial map={face} roughness={0.5} /></mesh></group>
        {[-0.55, 0, 0.55].map((bx, i) => { const on = eio(tt, 1.6 + i * 1.5, 2.2 + i * 1.5); return <group key={i}><Dish p={[bx, 0.06, -0.08]} s={1.15} fill={col("#ede6cf", i === 2 ? "#e9c56a" : BROTH, on)} /><Steam p={[bx, 0.27, -0.08]} t={tt + i} k={on} s={0.55} /><pointLight position={[bx, 0.55, 0.1]} intensity={0.7 * on} distance={0.9} color="#ffd9a0" /></group>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={3.2} txt="ONE YEN, THREE JOBS" col={AMB} />} />;
};

// 10:28 · EL SOROBAN: el ábaco de madera hace la cuenta verdadera, cuenta por cuenta
export const P_ledger: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([-0.28, 0.82, 1.42], [0, 0.3, 0]), C([0.3, 0.7, 1.3], [0, 0.3, 0]), 12)}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.3, warm: 0.65 }}
  scene={(tt) => <>
    <group position={[0, 0.3, 0]} rotation={[-0.72, 0, 0]}>
      <Box p={[0, 0, -0.018]} s={[1.5, 0.66, 0.024]} c="#6a4628" r={0.6} rad={0.008} />
      {[-0.74, 0.74].map((x) => <Box key={x} p={[x, 0, 0.018]} s={[0.05, 0.7, 0.07]} c="#3e2616" r={0.5} rad={0.012} />)}
      {[-0.33, 0.33, 0.13].map((y, i) => <Box key={y} p={[0, y, 0.018]} s={[1.5, i === 2 ? 0.024 : 0.044, 0.07]} c="#3e2616" r={0.5} rad={0.008} />)}
      {Array.from({ length: 9 }, (_, r) => { const x = -0.6 + r * 0.15; return <group key={r}>
        <Cyl p={[x, 0, 0.018]} r={0.006} h={0.66} c="#c8b070" m={0.6} rough={0.35} />
        {[0, 1, 2, 3, 4].map((b) => { const st = 0.8 + r * 0.8 + b * 0.16, k = b === 0 ? eio(tt, st + 0.35, st + 0.75) : eio(tt, st, st + 0.4), active = (b === 0 ? r % 2 === 0 : b <= 1 + (r * 3) % 4); const y = b === 0 ? lerp(0.28, 0.185, active ? k : 0) : lerp(-0.265 + (b - 1) * 0.078, -0.265 + (b - 1) * 0.078 + 0.11, active ? k : 0); return <mesh key={b} position={[x, y, 0.018]} rotation={[0, 0, 0]} scale={[1, 0.72, 1]}><octahedronGeometry args={[0.058, 2]} /><meshStandardMaterial color={b === 0 ? "#7a2f1f" : "#2f231a"} roughness={0.32} /></mesh>; })}
      </group>; })}
    </group>
    <Box p={[0, 0.08, 0]} s={[1.66, 0.14, 0.5]} c="#c49a68" r={0.7} rad={0.01} />
  </>}
  over={(tt) => <Ink tt={tt} at={1.2} txt="THE REAL ARITHMETIC" col={AMB} />} />;

// 12:40 · LOS TERRONES: cada cubito de sal es 100 mg; mi tazón llega a 7, el sobre a 15
export const P_scale: F = ({ t, h }) => { const a = useMemo(() => cardTex(["MY BOWL", "700 MG"], { bg: "#2e5a2e", fg: "#fff3d6", w: 320, h: 160 }), []), b = useMemo(() => cardTex(["PACKET", "1,500 MG"], { bg: "#8a1f1f", fg: "#fff3d6", w: 320, h: 160 }), []);
  const q = 0.052, tower = (x: number, n: number, tt: number, base: number) => Array.from({ length: n }, (_, i) => { const k = pop(tt, base + i * (x < 0 ? 0.4 : 0.28), 8, 0.5); return <Pop key={i} k={k} p={[x + 0.005 * Math.sin(i * 7), 0.078 + i * (q + 0.002), 0]} rot={[0, 0.12 * Math.sin(i * 3.3), 0]}><Box p={[0, 0, 0]} s={[0.13, q, 0.13]} c="#fbfaf4" r={0.72} rad={0.008} /></Pop>; });
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.08, 0.66, 1.62], [0, 0.4, 0]), C([-0.24, 0.6, 1.46], [0, 0.4, 0]), 9)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.55, warm: 0.45, back: false, bg: "#2a2018" }}
    scene={(tt) => <>
      <Board w={1.5} d={0.8} c="#8a6a4a" />
      {tower(-0.24, 7, tt, 0.4)}{tower(0.24, 15, tt, 0.6)}
      <Pop k={pop(tt, 0.2)} p={[-0.62, 0.3, 0.05]}><mesh><planeGeometry args={[0.36, 0.18]} /><meshBasicMaterial map={a} toneMapped={false} side={THREE.DoubleSide} /></mesh></Pop>
      <Pop k={pop(tt, 0.35)} p={[0.62, 0.3, 0.05]}><mesh><planeGeometry args={[0.36, 0.18]} /><meshBasicMaterial map={b} toneMapped={false} side={THREE.DoubleSide} /></mesh></Pop>
    </>}
    over={(tt) => <Ink tt={tt} at={5.2} txt="LESS THAN HALF" col={GRN} />} />;
};

// 13:14 · LA PILA: una pila de 9 V gigante, la cuchara se acerca y salta un arquito
export const P_battery: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.3, 0.58, 1.5], [0.02, 0.4, 0]), C([-0.14, 0.54, 1.34], [0.02, 0.4, 0]), 7)}
  set={{ spot: [0, 0.2, 0] as V, spotK: 0.3, warm: 0.2, bg: "#d6d1c6" }}
  scene={(tt) => { const app = eio(tt, 0.4, 2.0), sp = eio(tt, 2.0, 2.4), fl = sp * (0.55 + 0.45 * Math.sin(tt * 11));
    const bolt = [[-0.16, 0.55], [-0.12, 0.61], [-0.09, 0.57], [-0.045, 0.635]];
    return <>
      <Board w={1.4} d={0.8} c="#a68260" />
      <group position={[-0.22, 0.31, 0]} scale={0.72}>
        <Box p={[0, -0.04, 0]} s={[0.3, 0.62, 0.17]} c="#242428" m={0.4} r={0.35} rad={0.02} />
        <Box p={[0, 0.14, 0.0]} s={[0.3, 0.24, 0.172]} c="#d7a53b" m={0.5} r={0.3} rad={0.008} />
        <Cyl p={[-0.07, 0.3, 0]} r={0.034} h={0.04} c={STEEL} m={0.95} rough={0.2} /><Cyl p={[0.07, 0.3, 0]} r={0.042} h={0.04} c={STEEL} m={0.95} rough={0.2} />
      </group>
      <Spoon p={[lerp(0.75, 0.08, app), 0.63, 0]} rot={[0, 0, 0.08]} s={2.8} />
      {sp > 0.02 && bolt.slice(1).map((b2, i) => { const a = bolt[i]; const dx = b2[0] - a[0], dy = b2[1] - a[1], L = Math.hypot(dx, dy); return <mesh key={i} position={[(a[0] + b2[0]) / 2, (a[1] + b2[1]) / 2, 0]} rotation={[0, 0, Math.atan2(dy, dx) - Math.PI / 2]}><cylinderGeometry args={[0.007, 0.007, L, 8]} /><meshBasicMaterial color="#8fd0ff" toneMapped={false} transparent opacity={0.55 + 0.45 * fl} /></mesh>; })}
      <pointLight position={[-0.08, 0.66, 0.2]} intensity={1.4 * fl} distance={1.3} color="#cfeaff" />
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.5} txt="LICKING A BATTERY" col={RED} />} />;

// 14:11 · LA HARINA: el nido de fideos entra en el caldo y una nube blanca lo vuelve gris
export const P_flour: F = ({ t, h }) => <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.2, 0.56, 1.66], [0, 0.34, 0]), C([-0.22, 0.52, 1.5], [0, 0.34, 0]), 9)}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.55, warm: 0.45, back: false, bg: "#2a2018" }}
  scene={(tt) => { const dn = eio(tt, 0.6, 1.8), cc = eio(tt, 1.5, 6.2);
    return <>
      <Board w={1.2} d={0.9} />
      <Glass p={[0, 0.05, 0]} r={0.38} h={0.5} water={col("#a87412", "#58544c", cc)} lvl={0.78} op={lerp(0.78, 0.95, cc)}>
        <Nest p={[0, lerp(0.8, 0.2, dn), 0]} s={1.65} />
      </Glass>
      {Array.from({ length: 70 }, (_, i) => { const k = eio(tt, 1.6 + i * 0.05, 5.8), a = i * 2.2, R = 0.33 * k * Math.sqrt(rnd(i + 3)); return <mesh key={i} position={[R * Math.cos(a), 0.14 + 0.26 * k * rnd(i + 5), R * Math.sin(a)]} scale={Math.max(0.05, k)}><sphereGeometry args={[0.018 + 0.022 * rnd(i + 1), 10, 8]} /><meshStandardMaterial color="#e9e5da" transparent opacity={0.22 * k} depthWrite={false} /></mesh>; })}
    </>; }}
  over={(tt) => <Ink tt={tt} at={2.7} txt="THICK AND GRAY" col={RED} />} />;

// 14:53 · EL HUEVO: un aro de luz se cierra en 6½ y el huevo se abre con la yema tierna
export const P_egg: F = ({ t, h }) => <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.05, 0.92, 1.12], [0, 0.14, 0]), C([-0.2, 0.84, 1.0], [0, 0.14, 0]), 8)}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.45, warm: 0.65 }}
  scene={(tt) => { const rg = eio(tt, 0.4, 3.4), op = pop(tt, 3.5, 7, 0.5), whole = tt < 3.5;
    const half = (d: number) => <group position={[d * 0.19 * Math.min(1.1, op), 0.135, 0]} rotation={[0.28, 0, d * -0.2]} scale={1.12}>
      <mesh scale={[1, 1.15, 1]}><sphereGeometry args={[0.13, 32, 18, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshPhysicalMaterial color="#fbf6e8" roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}><circleGeometry args={[0.13, 36]} /><meshStandardMaterial color="#fffaf0" roughness={0.45} /></mesh>
      <mesh position={[0, 0.006, 0]} scale={[1, 0.34, 1]}><sphereGeometry args={[0.07, 26, 18]} /><meshPhysicalMaterial color="#ee8f0a" roughness={0.12} clearcoat={1} /></mesh></group>;
    return <>
      <Board w={1.3} d={0.9} c="#c49a68" />
      <Cyl p={[0, 0.06, 0]} r={0.46} h={0.018} c="#f1ebdd" rough={0.35} />
      {whole ? <mesh position={[0, 0.235, 0]} scale={[1, 1.26, 1]} castShadow><sphereGeometry args={[0.14, 36, 24]} /><meshPhysicalMaterial color="#fbf0dd" roughness={0.3} clearcoat={0.6} /></mesh> : <>{half(-1)}{half(1)}</>}
      <mesh position={[0, 0.0725, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}><ringGeometry args={[0.38, 0.43, 96, 1, 0, Math.PI * 2 * Math.max(0.01, rg)]} /><meshBasicMaterial color="#d9661e" toneMapped={false} side={THREE.DoubleSide} /></mesh>
    </>; }}
  over={(tt) => <Ink tt={tt} at={1.3} txt="6½ MINUTES" col={AMB} size={110} />} />;

// 16:49 · LA CARRERA: dos hornallas en sus carriles; el sobre todavía espera el agua y los cubitos ya hierven
export const P_race: F = ({ t, h }) => { const a = useMemo(() => cardTex(["THE PACKET"], { bg: "#8a1f1f", fg: "#fff3d6", w: 320, h: 110 }), []), b = useMemo(() => cardTex(["SUNDAY CUBES"], { bg: "#2e5a2e", fg: "#fff3d6", w: 380, h: 110 }), []);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([-0.18, 1.02, 2.08], [0, 0.2, 0]), C([0.3, 0.9, 1.9], [0, 0.2, 0]), 11)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.4 }}
    scene={(tt) => { const melt = eio(tt, 0.8, 4.0), bub = eio(tt, 3.6, 4.6), wt = eio(tt, 7.5, 9.5);
      return <>
        <Box p={[0, 0.05, 0.02]} s={[1.9, 0.08, 1.0]} c="#efe9dc" r={0.55} rad={0.012} />
        <Box p={[0, 0.095, 0.02]} s={[0.012, 0.012, 1.0]} c="#3a2a18" r={0.6} />
        <group position={[-0.45, 0.08, 0]}><Burner p={[0, 0, 0]} t={tt} /><Pot p={[0, 0.1, 0]} s={0.82} water="#c9dfe6" lvl={0.85} />
          {Array.from({ length: 10 }, (_, i) => { const u = (tt * 1.1 + i / 10) % 1; return wt < 0.02 ? null : <mesh key={i} position={[(rnd(i) - 0.5) * 0.36, 0.33 + 0.012 * Math.sin(u * 6), (rnd(i + 2) - 0.5) * 0.36]} scale={Math.max(0.1, wt)}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#ffffff" /></mesh>; })}
          <Packet p={[0.42, 0.22, 0.22]} rot={[0, 0, 0.14]} s={0.9} /></group>
        <group position={[0.45, 0.08, 0]}><Burner p={[0, 0, 0]} t={tt} /><Pot p={[0, 0.1, 0]} s={0.82} water={BROTH} lvl={0.28 + 0.5 * melt} />
          {[0, 1, 2, 3].map((i) => <group key={i} position={[(i % 2 - 0.5) * 0.17, 0.26 + 0.1 * melt, (i < 2 ? -1 : 1) * 0.09]} scale={Math.max(0.05, 1 - melt)}><Box p={[0, 0, 0]} s={[0.13, 0.1, 0.13]} c="#e3b45b" r={0.15} rad={0.012} /></group>)}
          <Steam p={[0, 0.38, 0]} t={tt} k={bub} s={0.65} />
          {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[(rnd(i) - 0.5) * 0.36, 0.34, (rnd(i + 2) - 0.5) * 0.36]} scale={Math.max(0.1, bub * (0.5 + 0.5 * Math.sin(tt * 1.9 + i)))}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#fff2cf" /></mesh>)}</group>
        <mesh position={[-0.45, 0.14, 0.62]} rotation={[-0.5, 0, 0]}><planeGeometry args={[0.5, 0.17]} /><meshStandardMaterial map={a} roughness={0.7} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0.45, 0.14, 0.62]} rotation={[-0.5, 0, 0]}><planeGeometry args={[0.58, 0.17]} /><meshStandardMaterial map={b} roughness={0.7} side={THREE.DoubleSide} /></mesh>
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.4} txt="WHICH IS REALLY FASTER?" col={AMB} y={120} />} />;
};

// 17:59 · LA CUBETERA: siete cuadritos con su día; un solo chorro de domingo los llena de a uno y se escarchan
export const P_week: F = ({ t, h }) => { const days = useMemo(() => ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => cardTex([d], { bg: "#fbf3df", fg: "#3a2a18", w: 140, h: 80 })), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([-0.3, 1.46, 1.72], [0, 0.16, 0.03]), C([0.34, 1.32, 1.56], [0, 0.16, 0.03]), 11)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.35, warm: 0.35 }}
    scene={(tt) => { const px = (i: number) => -0.72 + i * 0.24, st = (i: number) => 0.7 + i * 1.05, cur = Math.min(6, Math.floor(cl((tt - 0.7) / 7.35) * 7)), fr = (i: number) => eio(tt, st(i) + 1.3, st(i) + 2.7);
      return <>
        <Box p={[0, 0.06, 0]} s={[1.86, 0.1, 0.42]} c="#d4dbe0" r={0.3} m={0.3} rad={0.015} />
        {Array.from({ length: 7 }, (_, i) => { const k = eio(tt, st(i), st(i) + 0.9); return <group key={i}>
          <Box p={[px(i), 0.108, 0]} s={[0.2, 0.012, 0.3]} c="#9fa8ae" r={0.4} cast={false} />
          {k > 0.02 && <Box p={[px(i), 0.112 + 0.02 * k, 0]} s={[0.19, 0.04 * k, 0.29]} c={col(BROTH, "#ecd9a8", fr(i))} r={lerp(0.1, 0.65, fr(i))} rad={0.004} cast={false} />}
          <mesh position={[px(i), 0.117, 0.28]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.19, 0.11]} /><meshStandardMaterial map={days[i]} roughness={0.7} side={THREE.DoubleSide} /></mesh></group>; })}
        {tt < 8.5 && <group position={[px(cur), 0.56, -0.02]}><Pot p={[0.08, 0.12, -0.06]} s={0.62} /><Cyl p={[0, -0.21, 0]} r={0.018} h={0.34} c={BROTH} rough={0.15} /></group>}
      </>; }}
    over={(tt) => <Ink tt={tt} at={2.0} txt="ONE SUNDAY POT" col={AMB} />} />;
};

// 19:45 · SIN TAPA: la tapa baja, las burbujitas se esconden; la tapa se va y vuelven a verse
export const P_lid: F = ({ t, h }) => <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.2, 0.96, 1.24], [0, 0.24, 0]), C([-0.26, 0.86, 1.08], [0, 0.24, 0]), 8)}
  set={{ spot: [0, 0.1, 0] as V, spotK: 0.45, warm: 0.55 }}
  scene={(tt) => { const dn = eio(tt, 0.6, 1.8), up = eio(tt, 4.2, 5.6), y = lerp(lerp(1.15, 0.45, dn), 1.3, up), x = lerp(0, 1.0, up), see = 1 - dn + up;
    return <>
      <Burner p={[0, 0.02, 0]} s={1.25} t={tt} flame={0.5} />
      <Pot p={[0, 0.14, 0]} s={1.1} water="#dfd29a" lvl={0.8} />
      <Kombu p={[0, 0.428, 0]} w={0.36} d={0.2} wave={0.006} />
      {Array.from({ length: 36 }, (_, i) => { const a = i * 0.7, R = 0.27 + 0.03 * rnd(i); return <mesh key={i} position={[R * Math.cos(a), 0.432, R * Math.sin(a)]} scale={Math.max(0.1, cl(see) * (0.7 + 0.3 * Math.sin(tt * 1.5 + i)))}><sphereGeometry args={[0.009, 8, 6]} /><meshStandardMaterial color="#ffffff" transparent opacity={cl(see) * 0.9} /></mesh>; })}
      <group position={[x, y, 0]} rotation={[0, 0, -0.55 * up]}><mesh scale={[1, 0.26, 1]}><sphereGeometry args={[0.36, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#b9bec4" metalness={0.8} roughness={0.28} /></mesh><Cyl p={[0, 0.115, 0]} r={0.035} h={0.05} c="#26231f" rough={0.5} /></group>
          </>; }}
  over={(tt) => <Ink tt={tt} at={2.0} txt="A LID HIDES THE MOMENT" col={AMB} />} />;

// 20:17 · EL CRUCE: del jarro de caldo sin sal salen tres caminos de luz a tres platos; el que ya tiene sal no va a ningún lado
export const P_fork: F = ({ t, h }) => { const tx = useMemo(() => ["MONDAY", "WEDNESDAY", "THURSDAY"].map((d) => cardTex([d], { bg: "#fbf3df", fg: "#3a2a18", w: 300, h: 90 })), []);
  const pts: V[] = [[-0.52, 0.06, -0.42], [-0.62, 0.06, 0.0], [-0.52, 0.06, 0.42]];
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.14, 1.72, 1.66], [0.0, 0.1, 0.04]), C([-0.14, 1.58, 1.54], [0.0, 0.1, 0.04]), 9)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.5 }}
    scene={(tt) => <>
      <Board w={2.1} d={1.5} c="#b8905e" />
      <Glass p={[0.62, 0.05, 0]} r={0.16} h={0.4} water={BROTH} lvl={0.75} op={0.8} />
      {[0, 1, 2].map((i) => { const st = 0.5 + i * 1.5, k = eio(tt, st, st + 1.0), q = pop(tt, st + 1.0), [ex, , ez] = pts[i];
        return <group key={i}>
          {Array.from({ length: 30 }, (_, j) => { const u = j / 29; if (u > k) return null; const x = lerp(0.44, ex + 0.26, u), z = ez * (u * u * (3 - 2 * u)); return <mesh key={j} position={[x, 0.056, z]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.016, 12]} /><meshBasicMaterial color="#c8501e" toneMapped={false} /></mesh>; })}
          <Pop k={q} p={[ex, 0.055, ez]}>{i === 0 ? <><Dish p={[0, 0, 0]} s={0.72} fill={BROTH} /><Nest p={[0, 0.13, 0]} s={0.6} /></> : i === 1 ? <><Dish p={[0, 0, 0]} s={0.72} c="#3a4a5a" fill="#b58a42" />{[0, 1, 2].map((j) => <Cyl key={j} p={[-0.06 + j * 0.06, 0.14, 0.03 * j]} r={0.03} h={0.05} c={["#e87a3c", "#f2ead6", "#6a8f4a"][j]} rough={0.5} />)}</> : <><Dish p={[0, 0, 0]} s={0.72} c="#6a3a2a" fill="#f8f3e6" /><mesh position={[0, 0.13, 0]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.13, 20, 12]} /><meshStandardMaterial color="#faf6ea" roughness={0.75} /></mesh></>}
            <mesh position={[-0.02, 0.012, 0.25]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.34, 0.1]} /><meshBasicMaterial map={tx[i]} toneMapped={false} side={THREE.DoubleSide} /></mesh></Pop>
        </group>; })}
    </>}
    over={(tt) => <Ink tt={tt} at={5.4} txt="KEEP IT PLAIN" col={AMB} />} />;
};

export const HP: Record<string, F> = { p_silver: P_silver, p_closet: P_closet, p_ships: P_ships, p_powder: P_powder, p_hand: P_hand, p_teabag: P_teabag, p_pinhead: P_pinhead, p_rope: P_rope, p_plane: P_plane, p_sink: P_sink, p_drip: P_drip, p_lastspoon: P_lastspoon, p_lock: P_lock, p_tomato: P_tomato, p_salt: P_salt, p_yen: P_yen, p_ledger: P_ledger, p_scale: P_scale, p_battery: P_battery, p_flour: P_flour, p_egg: P_egg, p_race: P_race, p_week: P_week, p_lid: P_lid, p_fork: P_fork };
