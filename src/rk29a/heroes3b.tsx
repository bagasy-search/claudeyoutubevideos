// rk29a · 2º bloque de componentes 3D (tras EVALUADOR r2, 29-oct). Cada uno UNA vez en toda la tanda.
import React, { useMemo } from "react";
import * as THREE from "three";
import { H, Stage, Tag, TX } from "./hkit";
import { Studio, Fob3, Car3, Rings3, Wall3, Drawer3, RB, sm, spr, c01, rnd } from "./studio3d";

type P = { t: number; h: H };
const AMB = "#ffb257", RED = "#ff5a4a";

// 6 · el rectángulo vacío: el auto se va de la entrada y deja el concreto limpio, más claro, con la mancha de aceite brillando bajo la farola
export const H3Empty: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const go = sm(tt, 0.8, 3.4), lamp = 0.4 + 0.6 * sm(tt, 3.0, 4.5);
  return <>
    <Studio tt={tt} floor="concrete" night={0.8} kl={[-2, 5, 2]} keys={[{ t: 0, p: [2.6, 2.6, 4.2], l: [0, 0.2, 0], fov: 34 }, { t: 9, p: [1.0, 3.6, 2.6], l: [0, 0, 0.1], arc: 0.06 }]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} receiveShadow><planeGeometry args={[1.3, 2.6]} /><meshStandardMaterial color="#8f8c86" roughness={0.9} /></mesh>
      {[[0.1, 0.2, 0.32, 0.7], [0.28, 0.05, 0.16, 0.8], [-0.06, 0.38, 0.13, 0.9]].map(([x, z, r, sy], i) => <mesh key={i} rotation={[-Math.PI / 2, 0, i * 0.7]} position={[x, 0.007 + i * 0.0005, z]} scale={[1, sy, 1]}><circleGeometry args={[r, 40]} /><meshStandardMaterial color="#17130f" roughness={0.06} metalness={0.45} /></mesh>)}
      <Car3 p={[0, 0.002, -7 * go * go]} col="#9a3a30" brake={go > 0.02 && go < 0.6 ? 1 : 0} />
      <RB p={[-1.6, 1.6, -1.2]} s={[0.08, 3.2, 0.08]} rad={0.02} c="#2b2d33" m={0.6} r={0.4} />
      <mesh position={[-1.35, 3.15, -1.0]}><sphereGeometry args={[0.1, 16, 16]} /><meshBasicMaterial color="#ffe0a8" toneMapped={false} /></mesh>
      <spotLight position={[-1.35, 3.1, -1.0]} angle={0.75} penumbra={0.6} intensity={14 * lamp} distance={9} color="#ffd9a0" />
    </Studio>
  </>;
}}</Stage>;

// 7 · Broken Arrow, Oklahoma: mapa de papel en relieve sobre la mesa, chinches que caen con rebote y la de Broken Arrow late
const OK: [number, number][] = [[-103, 37], [-94.62, 37], [-94.43, 35.4], [-94.48, 33.64], [-95.5, 33.9], [-96.5, 33.8], [-97.2, 33.75], [-98.1, 34.1], [-99.2, 34.4], [-100, 34.56], [-100, 36.5], [-103, 36.5]];
const gx = (lon: number) => (lon + 98.7) * 0.45, gz = (lat: number) => -(lat - 35.4) * 0.45;
const Pin3: React.FC<{ x: number; z: number; k: number; col: string; s?: number }> = ({ x, z, k, col, s = 1 }) => (
  <group position={[x, 0.09 + 1.6 * (1 - k), z]} scale={s}>
    <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.008, 0.004, 0.24, 8]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.3} /></mesh>
    <mesh position={[0, 0.26, 0]} castShadow><sphereGeometry args={[0.06, 24, 24]} /><meshStandardMaterial color={col} roughness={0.3} /></mesh>
  </group>
);
export const H3OkMap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const geo = useMemo(() => {
    const sh = new THREE.Shape(OK.map(([a, b]) => new THREE.Vector2(gx(a), -gz(b))));
    return new THREE.ExtrudeGeometry(sh, { depth: 0.08, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 });
  }, []);
  const rise = spr(tt, 0.1, 5, 0.6), pins: [number, number, number, string, number][] = [[-95.99, 36.15, 1.4, AMB, 2.2], [-97.48, 35.65, 2.0, AMB, 2.2], [-96.8, 34.6, 2.6, AMB, 2.2], [-95.79, 36.05, 3.3, RED, 3.6]];
  return <>
    <Studio tt={tt} floor="wood" keys={[{ t: 0, p: [0, 5.6, 3.2], l: [0, 0, -0.2], fov: 36 }, { t: 9, p: [1.6, 2.4, 1.6], l: [gx(-95.79), 0, gz(36.05)], arc: 0.08 }]}>
            <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, rise]} castShadow receiveShadow><meshStandardMaterial color="#c9b98f" roughness={0.9} /></mesh>
      {pins.map(([lo, la, a, c, s], i) => <Pin3 key={i} x={gx(lo)} z={gz(la)} k={c01(spr(tt, a, 9, 0.45))} col={c} s={s} />)}
      {tt > 3.8 && <Rings3 p={[gx(-95.79), 0.1, gz(36.05)]} k={(tt - 3.8) * 0.7} n={2} r={0.7} col={RED} />}
    </Studio>
    <Tag tt={tt} at={3.6} x={1300} y={300} txt="BROKEN ARROW" col={TX} size={56} />
  </>;
}}</Stage>;

// 8 · los lugares de siempre: la cámara recorre la casa y en cada lugar cae una llave con su número (cajón, gancho, cuenco, guantera, mochila)
export const H3Spots: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const st: [number, number][] = [[0.4, -3.2], [7.4, -1.6], [9.8, 0], [13.1, 1.6], [16.6, 3.2]];
  const keys = st.map(([a, x], i) => ({ t: i === 0 ? 0 : a - 0.4, p: [x + 0.4, 1.7, 2.6] as [number, number, number], l: [x, 0.5, 0] as [number, number, number], fov: 34, arc: 0.06 }));
  const drop = (a: number) => c01(spr(tt, a + 0.3, 8, 0.45)), led = (a: number) => tt > a + 0.9 ? (Math.sin(tt * 11) > 0 ? 1 : 0.2) : 0;
  return <>
    <Studio tt={tt} floor="wood" keys={keys}>
      <Wall3 p={[0, 1.2, -0.7]} s={[9, 2.4, 0.12]} kind="drywall" />
      <group position={[-3.2, 0, 0]}><Drawer3 open={0.6 * c01(spr(tt, 0.2, 6, 0.5))}><Fob3 p={[0, 0.25 * (1 - drop(0.4)), 0]} s={0.7} led={led(0.4)} /></Drawer3></group>
      <RB p={[-1.6, 1.3, -0.6]} s={[0.9, 0.14, 0.08]} c="#5a3d24" r={0.7} />
      <Fob3 p={[-1.6, 0.98 + 1.2 * (1 - drop(7.4)), -0.52]} rot={[Math.PI / 2, 0, 0]} s={0.8} led={led(7.4)} />
      <RB p={[0, 0.4, 0]} s={[1.1, 0.8, 0.7]} c="#6b4a2e" r={0.7} />
      <mesh position={[0, 0.88, 0]} castShadow><sphereGeometry args={[0.32, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#c9c2b2" roughness={0.4} side={THREE.DoubleSide} /></mesh>
      <Fob3 p={[0, 0.7 + 1.2 * (1 - drop(9.8)), 0]} s={0.6} led={led(9.8)} />
      <group position={[1.6, 0, 0]}><RB p={[0, 0.45, 0]} s={[1.2, 0.9, 0.8]} c="#2f3338" r={0.4} m={0.3} /><RB p={[0, 0.62, 0.42]} s={[0.8, 0.3, 0.06]} c="#1e2125" r={0.5} /></group>
      <Fob3 p={[1.6, 0.95 + 1.2 * (1 - drop(13.1)), 0.1]} s={0.6} led={led(13.1)} />
      <group position={[3.2, 0, 0]}><RB p={[0, 0.45, 0]} s={[0.8, 0.9, 0.45]} rad={0.15} c="#3f6fb6" r={0.85} /><RB p={[0, 0.6, 0.25]} s={[0.55, 0.35, 0.08]} rad={0.08} c="#335a94" r={0.85} /></group>
      <Fob3 p={[3.2, 0.95 + 1.2 * (1 - drop(16.6)), 0]} s={0.6} led={led(16.6)} />
    </Studio>
    {["JUNK DRAWER", "GARAGE HOOK", "FRONT HALL BOWL", "GLOVE BOX", "BACKPACK"].map((n, i) => tt > st[i][0] + 0.5 && (i === 4 || tt < st[i + 1][0] - 0.2) ? <Tag key={i} tt={tt} at={st[i][0] + 0.5} x={960} y={150} txt={`${i + 1} · ${n}`} col={TX} size={66} /> : null)}
  </>;
}}</Stage>;

// 9 · al alcance: cocina en 3D contra la pared de afuera; una franja roja entra desde la pared y enciende cada lugar que toca
export const H3Reach: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const band = sm(tt, 0.8, 3.2), hot = (z: number) => band * 2.2 > z + 0.3;
  const items: [number, number, string][] = [[-1.4, 0.25, "drawer"], [0.2, 0.25, "hook"], [1.5, 1.4, "bowl"]];
  return <>
    <Studio tt={tt} floor="wood" keys={[{ t: 0, p: [0.2, 3.8, 4.2], l: [0, 0.4, 0.4], fov: 36 }, { t: 12, p: [-0.8, 3.2, 3.6], l: [0, 0.4, 0.6], arc: 0.05 }]}>
      <Wall3 p={[0, 0.9, -0.55]} s={[4.6, 1.8, 0.25]} kind="brick" />
      <RB p={[-1.4, 0.45, 0]} s={[1.3, 0.9, 0.8]} c="#e2dcd0" r={0.55} />
      <RB p={[-1.4, 0.62, 0.41]} s={[1.1, 0.24, 0.04]} c="#b98a55" r={0.6} />
      <RB p={[0.2, 1.25, -0.38]} s={[0.7, 0.12, 0.08]} c="#5a3d24" r={0.7} />
      <Fob3 p={[0.2, 0.95, -0.32]} rot={[Math.PI / 2, 0, 0]} s={0.7} led={hot(0.25) ? 1 : 0} />
      <RB p={[1.5, 0.4, 1.4]} s={[1.0, 0.8, 0.7]} c="#6b4a2e" r={0.7} />
      <mesh position={[1.5, 0.86, 1.4]}><sphereGeometry args={[0.28, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#c9c2b2" roughness={0.4} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.6, -0.4 + band * 1.1]}><boxGeometry args={[4.6, 1.2, band * 2.2 + 0.01]} /><meshBasicMaterial color={RED} transparent opacity={0.12} toneMapped={false} depthWrite={false} /></mesh>
      <mesh position={[0, 0.6, -0.4 + band * 2.2]}><planeGeometry args={[4.6, 1.2]} /><meshBasicMaterial color={RED} transparent opacity={0.55} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      {items.map(([x, z], i) => hot(z) && <Rings3 key={i} p={[x, 0.95, z]} k={tt * 0.9 + i * 0.3} n={2} r={0.6} col={RED} />)}
    </Studio>
    <Tag tt={tt} at={3.4} x={960} y={140} txt="ON AN OUTSIDE WALL" col={RED} size={52} />
  </>;
}}</Stage>;

// 10 · un regalo para el ladrón: la llave en el gancho, la cinta roja la envuelve y el moño cae con resorte
export const H3Gift: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const wrap = sm(tt, 1.2, 3.0), bow = c01(spr(tt, 3.3, 9, 0.4));
  return <>
    <Studio tt={tt} floor="wood" keys={[{ t: 0, p: [0.35, 1.15, 1.1], l: [0, 1.08, -0.45], fov: 30 }, { t: 6, p: [-0.2, 1.15, 0.85], l: [0, 1.12, -0.45], arc: 0.06 }]}>
      <Wall3 p={[0, 1.2, -0.62]} s={[3, 2.4, 0.1]} kind="drywall" />
      <RB p={[0, 1.42, -0.54]} s={[1.0, 0.14, 0.06]} c="#5a3d24" r={0.7} />
      <Fob3 p={[0, 1.08, -0.45]} rot={[Math.PI / 2, 0, 0.05 * Math.sin(tt * 2)]} s={1.0} led={0.3 + 0.7 * (Math.sin(tt * 6) > 0 ? 1 : 0)} />
      <mesh position={[0, 1.08, -0.42]} scale={[1, 1, 1]}><boxGeometry args={[0.07, 0.62 * wrap, 0.1]} /><meshStandardMaterial color="#c8202a" roughness={0.35} /></mesh>
      <mesh position={[0, 1.1, -0.42]}><boxGeometry args={[0.36 * wrap, 0.07, 0.1]} /><meshStandardMaterial color="#c8202a" roughness={0.35} /></mesh>
      <group position={[0, 1.4 + 0.5 * (1 - bow), -0.36]} scale={(0.01 + bow) * 1.6}>
        {[-1, 1].map((sx) => <mesh key={sx} position={[sx * 0.08, 0, 0]} rotation={[0, 0, sx * 0.5]} castShadow><torusGeometry args={[0.07, 0.025, 12, 32]} /><meshStandardMaterial color="#e02a34" roughness={0.3} /></mesh>)}
        <mesh castShadow><sphereGeometry args={[0.04, 16, 16]} /><meshStandardMaterial color="#b81c25" roughness={0.3} /></mesh>
      </group>
    </Studio>
    <Tag tt={tt} at={3.6} x={960} y={940} txt="A GIFT TO A THIEF" col={RED} size={60} />
  </>;
}}</Stage>;

export const HEROES_3B: Record<string, React.FC<P>> = { empty: H3Empty, okmap: H3OkMap, spots: H3Spots, reach: H3Reach, gift: H3Gift };
void rnd;
