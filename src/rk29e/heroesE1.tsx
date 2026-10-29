// rk29e · componentes 3D 1-16 (29-oct, dormitorio / dónde guardar la plata). Cada uno UNA vez en la tanda (D:/rtmp/rk29_COMPONENTES.md).
// Vara EVALUADOR: objeto grande y entero, movimiento durante TODA la pieza, nada cortado por el borde, texto mínimo.
import React from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { Studio, RB, Mat, Rings3, sm, spr, c01, rnd, type V3 } from "./studio3d";
import { cam, Room, Bed3, Dresser3, Night3, Sock3, ShoeBox3, Closet3, Coat3, Stack3, Bill3, useBillTex } from "./bed3d";

type P = { t: number; h: H };
const flick = (tt: number) => 0.92 + 0.05 * Math.sin(tt * 2 * Math.PI * 1.3) + 0.03 * Math.sin(tt * 2 * Math.PI * 0.7 + 1); // ≤2 Hz

// 1 · ocho minutos: una vela con 8 anillos pintados; arde y cada anillo que se consume cae como una moneda de cera
export const E1Candle8: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const burn = c01((tt - 0.8) / 6.4), H0 = 0.9, hh = H0 * (1 - 0.82 * burn), f = flick(tt);
  return <Room tt={tt} c={cam([0.25, 1.05, 2.3], [0, 0.78, 0])} wall="wood" z={-0.9} warm={0.55} night={0.55}>
    <RB p={[0, 0.2, 0]} s={[1.6, 0.4, 0.9]} rad={0.03} c="#5e412a" r={0.5} />
    <mesh position={[0, 0.41, 0]}><cylinderGeometry args={[0.2, 0.22, 0.02, 40]} /><Mat c="#c9a25a" m={0.9} r={0.3} /></mesh>
    <mesh position={[0, 0.42 + hh / 2, 0]} castShadow><cylinderGeometry args={[0.1, 0.1, hh, 40]} /><meshStandardMaterial color="#f3ead6" roughness={0.6} emissive="#ffb070" emissiveIntensity={0.08} /></mesh>
    {[...Array(8)].map((_, i) => { const y = H0 * (1 - 0.82 * (i + 1) / 8); if (y > hh + 0.001) return null; return <mesh key={i} position={[0, 0.42 + y, 0]}><torusGeometry args={[0.104, 0.012, 10, 40]} /><meshStandardMaterial color="#b22a22" roughness={0.5} /></mesh>; })}
    {[...Array(8)].map((_, i) => { const at = 0.8 + 6.4 * (8 - i) / 8, k = c01((tt - at) / 0.9); if (k <= 0 || i === 0) return null; const x = 0.3 + 0.12 * (i % 3), z = 0.15 - 0.08 * (i % 2);
      return <mesh key={i} position={[x * k, 0.42 + Math.max(0.006, H0 * (1 - 0.82 * i / 8) * (1 - k * k)), z * k]} rotation={[Math.PI / 2 * k, 0, 0]}><cylinderGeometry args={[0.065, 0.065, 0.016, 24]} /><meshStandardMaterial color="#b22a22" roughness={0.5} /></mesh>; })}
    <group position={[0, 0.42 + hh + 0.01, 0]}>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.004, 0.004, 0.04, 6]} /><meshBasicMaterial color="#1a1410" /></mesh>
      <mesh position={[0, 0.075, 0]} scale={[1, f, 1]}><coneGeometry args={[0.028, 0.11, 16]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} /></mesh>
      <mesh position={[0, 0.06, 0]} scale={[1, f, 1]}><coneGeometry args={[0.014, 0.05, 12]} /><meshBasicMaterial color="#fff6dc" toneMapped={false} /></mesh>
    </group>
    <pointLight position={[0, 0.42 + hh + 0.12, 0.05]} intensity={2.2 * f} distance={3.2} color="#ffb766" />
  </Room>;
}}</Stage>;

// 2 · la cama la mañana después: tres cajones salen de la cómoda, giran boca abajo sobre la cama y todo cae en una pila
export const E1Dumpbed: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const bill = useBillTex();
  return <Room tt={tt} c={cam([1.9, 2.2, 2.6], [0, 0.5, 0])} wall="drywall" z={-1.3}>
    <Bed3 p={[0, 0, 0]} quilt="#7a8aa2" />
    {[0, 1, 2].map((i) => { const at = 0.6 + i * 1.5, k = sm(tt, at, at + 0.9), fl = sm(tt, at + 0.7, at + 1.2), x = -0.4 + i * 0.4;
      return <group key={i} position={[x - 2.2 * (1 - k), 0.9 + 0.5 * k - 0.2 * fl, 0.3 * i - 0.2]} rotation={[Math.PI * fl, 0.2 * i, 0]} >
        <RB p={[0, 0, 0]} s={[0.6, 0.18, 0.4]} rad={0.012} c="#8a6444" r={0.5} />
      </group>; })}
    {[...Array(14)].map((_, j) => { const i = j % 3, at = 0.6 + i * 1.5 + 1.05 + rnd(j) * 0.25, k = c01((tt - at) / 0.5), x = -0.4 + i * 0.4 + (rnd(j, 2) - 0.5) * 0.45, z = 0.3 * i - 0.2 + (rnd(j, 3) - 0.5) * 0.35;
      if (tt < at) return null; const y = 0.66 + (0.55 - 0.55 * k * k) + 0.04 * (j % 3);
      return j % 4 === 0 ? <Bill3 key={j} p={[x, y + 0.02, z]} rot={[0, rnd(j, 4) * 3, 0]} tex={bill} s={1.2} />
        : j % 4 === 1 ? <Sock3 key={j} p={[x, y, z]} rot={[0, rnd(j, 5) * 3, 0.3]} s={0.75} col={["#8a7a64", "#4a5a6e", "#c9c2b0"][j % 3]} />
        : <RB key={j} p={[x, y, z]} rot={[0, rnd(j, 6) * 3, 0]} s={[0.22, 0.05, 0.16]} rad={0.02} c={["#e8e2d6", "#9a6a8a", "#5a7a6a", "#d8c8a8"][j % 4]} r={0.95} />; })}
  </Room>;
}}</Stage>;

// 3 · a cuatro pies: la cámara viaja desde la pila revuelta hasta la caja que nadie tocó, que se enciende tibia
export const E1Laser4: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const bill = useBillTex(), glow = sm(tt, 4.0, 5.2);
  return <Studio tt={tt} floor="wood" warm={0.8} photo={0} keys={[{ t: 0, p: [-1.3, 0.9, 1.6], l: [-1.2, 0.2, 0], fov: 42 }, { t: 1.2, p: [-1.2, 0.85, 1.5], l: [-1.15, 0.2, 0], fov: 42 }, { t: 4.2, p: [1.0, 0.62, 0.95], l: [1.1, 0.2, 0], fov: 42 }, { t: 10, p: [1.05, 0.58, 0.85], l: [1.1, 0.2, 0], fov: 42, arc: 0.03 }]}>
    <RB p={[0, 1.6, -0.7]} s={[8, 3.2, 0.1]} rad={0.01} c="#d8d0c2" r={0.9} />
    {[...Array(16)].map((_, j) => <RB key={j} p={[-1.25 + (rnd(j) - 0.5) * 0.8, 0.03 + (j % 4) * 0.045, (rnd(j, 2) - 0.5) * 0.6]} rot={[0, rnd(j, 3) * 3, (rnd(j, 4) - 0.5) * 0.4]} s={[0.25, 0.05, 0.18]} rad={0.02} c={["#e8e2d6", "#9a6a8a", "#5a7a6a", "#d8c8a8", "#4a5a6e"][j % 5]} r={0.95} />)}
    <RB p={[-1.3, 0.12, 0.25]} rot={[0.4, 0.5, 0.2]} s={[0.55, 0.16, 0.38]} rad={0.012} c="#8a6444" r={0.5} />
    <group position={[1.1, 0, 0]}>
      <RB p={[0, 0.13, 0]} s={[0.46, 0.26, 0.34]} rad={0.02} c="#4a5058" m={0.7} r={0.35} />
      <RB p={[0, 0.2, 0.172]} s={[0.12, 0.08, 0.01]} rad={0.006} c="#c9ced4" m={0.9} r={0.25} />
      <Stack3 p={[0.02, 0.26, 0]} tex={bill} n={10} s={0.9} />
      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.45, 48]} /><meshBasicMaterial color="#ffcf8a" transparent opacity={0.35 * glow} toneMapped={false} /></mesh>
      <pointLight position={[0, 0.7, 0.4]} intensity={1.8 * glow} distance={2.2} color="#ffd9a0" />
    </group>
  </Studio>;
}}</Stage>;

// 4 · el señuelo: un pato de madera pintado flota en el agua, se mece y deja anillos; la cámara lo rodea
export const E1Duck: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const bob = 0.012 * Math.sin(tt * 2.4), rock = 0.08 * Math.sin(tt * 1.6), arrive = 1 - spr(tt, 0.3, 6, 0.5);
  return <Studio tt={tt} floor="none" warm={0.85} photo={0} bg="#2a3a44" keys={[{ t: 0, p: [1.0, 0.6, 1.0], l: [0, 0.12, 0], fov: 40 }, { t: 5, p: [0.15, 0.5, 1.2], l: [0, 0.12, 0], fov: 40 }, { t: 10, p: [-0.8, 0.55, 0.95], l: [0, 0.12, 0], fov: 40, arc: 0.05 }]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[6, 64]} /><meshStandardMaterial color="#2e4a58" roughness={0.8} metalness={0} /></mesh>
    {[0, 1, 2].map((i) => <Rings3 key={i} p={[0, 0.005, 0]} k={((tt * 0.35 + i / 3) % 1)} n={1} r={1.4} col="#bcd4de" rot={[-Math.PI / 2, 0, 0]} op={0.45 * (1 - ((tt * 0.35 + i / 3) % 1))} />)}
    <group position={[0, 0.06 + bob + 0.4 * arrive, 0]} rotation={[0, 0.4, rock]}>
      <mesh scale={[1.5, 0.62, 0.78]} castShadow><sphereGeometry args={[0.22, 40, 28]} /><meshStandardMaterial color="#6a4a30" roughness={0.5} /></mesh>
      <mesh position={[0, 0.07, 0]} scale={[1.2, 0.35, 0.62]}><sphereGeometry args={[0.22, 32, 20]} /><meshStandardMaterial color="#8a8a82" roughness={0.5} /></mesh>
      <mesh position={[0.26, 0.17, 0]} castShadow><sphereGeometry args={[0.095, 28, 20]} /><meshStandardMaterial color="#1e5a3a" roughness={0.35} /></mesh>
      <mesh position={[0.26, 0.09, 0]}><torusGeometry args={[0.07, 0.012, 8, 24]} /><meshStandardMaterial color="#f2efe6" roughness={0.6} /></mesh>
      <mesh position={[0.37, 0.15, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1, 1, 0.45]}><coneGeometry args={[0.04, 0.1, 16]} /><meshStandardMaterial color="#d8b04a" roughness={0.5} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[0.3, 0.2, sd * 0.07]}><sphereGeometry args={[0.012, 10, 10]} /><meshStandardMaterial color="#111" roughness={0.2} /></mesh>)}
      <mesh position={[-0.33, 0.05, 0]} rotation={[0, 0, 0.5]} scale={[1, 0.5, 0.6]}><coneGeometry args={[0.07, 0.16, 16]} /><meshStandardMaterial color="#2a2a2e" roughness={0.6} /></mesh>
    </group>
  </Studio>;
}}</Stage>;

// 5 · la idea ingeniosa se apaga: una lamparita brilla; a su alrededor se prenden pantallitas una por una y cada una le baja la luz
export const E1Bulbfade: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const n = Math.floor(c01((tt - 1.2) / 5.5) * 12), lit = 1 - n / 12 * 0.92;
  return <Room tt={tt} c={cam([0, 0.95, 2.5], [0, 0.85, 0])} wall="drywall" z={-1.0} night={0.6} warm={0.6}>
    <group position={[0, 0.85, 0]}>
      <mesh><sphereGeometry args={[0.24, 40, 30]} /><meshPhysicalMaterial color="#fffaf0" transmission={0.6} roughness={0.1} emissive="#ffd27a" emissiveIntensity={1.6 * lit} transparent opacity={0.9} /></mesh>
      <mesh position={[0, 0.02, 0]}><torusKnotGeometry args={[0.05, 0.006, 64, 6, 2, 5]} /><meshBasicMaterial color={lit > 0.3 ? "#fff0b0" : "#5a5a5a"} toneMapped={false} /></mesh>
      <mesh position={[0, -0.28, 0]}><cylinderGeometry args={[0.09, 0.08, 0.14, 24]} /><Mat c="#b8bcc2" m={0.9} r={0.3} /></mesh>
      <pointLight position={[0, 0, 0.3]} intensity={2.4 * lit} distance={3} color="#ffd27a" />
    </group>
    {[...Array(12)].map((_, i) => { const a = (i / 12) * Math.PI * 2, on = i < n ? sm(tt, 1.2 + i * 0.46, 1.5 + i * 0.46) : 0, r = 0.78;
      return <group key={i} position={[Math.cos(a) * r, 0.85 + Math.sin(a) * r * 0.62, -0.1]} scale={0.6 + 0.4 * on}>
        <RB s={[0.2, 0.13, 0.015]} rad={0.012} c="#1a1c20" r={0.4} />
        <mesh position={[0, 0, 0.009]}><planeGeometry args={[0.18, 0.11]} /><meshBasicMaterial color={on > 0.5 ? "#8fd3ff" : "#22262c"} toneMapped={false} /></mesh>
        {on > 0.5 && <mesh position={[0.005, 0, 0.011]} rotation={[0, 0, -Math.PI / 2]}><circleGeometry args={[0.03, 3]} /><meshBasicMaterial color="#f6f3ec" /></mesh>}
      </group>; })}
  </Room>;
}}</Stage>;

// 6 · el peor lugar: el cajón de arriba se abre y adentro, entre las medias, la media de lana enrollada asoma los billetes
export const E1Sockroll: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const bill = useBillTex(), op = spr(tt, 0.6, 7, 0.55), peek = sm(tt, 2.6, 3.6), warn = sm(tt, 3.8, 4.6) * (0.75 + 0.25 * Math.sin(tt * 2.2));
  const socks = [0, 1, 2, 3, 4].map((i) => <Sock3 key={i} p={[-0.38 + i * 0.19, 0.02, -0.08 + (i % 2) * 0.12]} rot={[0, i, 0.2]} s={0.7} col={["#4a5a6e", "#c9c2b0", "#5a4a3e", "#8a8a82", "#3a3a3e"][i]} />);
  return <Room tt={tt} c={cam([0.25, 1.75, 1.75], [0, 0.85, 0.35])} wall="drywall" z={-0.5}>
    <Dresser3 p={[0, 0, 0]} open={[0.75 * op, 0, 0]} inDrawer={[<group key="d">{socks}
      <group position={[0.12, 0.04, 0.12]}><Sock3 s={1.05} col="#8a7a64" stripe="#b22a22" />
        <group position={[0.03, 0.06 * peek, 0.02]}>{[0, 1, 2].map((j) => <Bill3 key={j} p={[0.02 * j, 0.03 + 0.006 * j, 0]} rot={[0.5, 0.3 + j * 0.15, 0.9]} s={0.55 + 0.25 * peek} tex={bill} />)}</group>
      </group>
      <mesh position={[0.12, 0.002, 0.12]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.18, 32]} /><meshBasicMaterial color="#ff5a4a" transparent opacity={0.3 * warn} toneMapped={false} /></mesh>
    </group>]} />
  </Room>;
}}</Stage>;

// 7 · la tormenta: tres cuartos en corte; cocina y living tranquilos con su lámpara, sobre el dormitorio se arma una nube y todo vuela
export const E1Storm: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const cl = sm(tt, 1.6, 3.0), wind = c01((tt - 3.0) / 4);
  const Box = ({ x, children }: { x: number; children?: React.ReactNode }) => <group position={[x, 0, 0]}>
    <RB p={[0, 0.02, 0]} s={[1.0, 0.04, 0.9]} rad={0.01} c="#b89a76" r={0.8} />
    <RB p={[0, 0.5, -0.43]} s={[1.0, 1.0, 0.04]} rad={0.01} c="#e8e2d6" r={0.9} />
    {children}</group>;
  return <Room tt={tt} c={cam([0, 1.75, 3.6], [0, 0.55, 0])} wall={"" as any} floor="none">
    <Box x={-1.08}><RB p={[-0.25, 0.4, -0.2]} s={[0.35, 0.76, 0.35]} rad={0.03} c="#f2f2ee" r={0.4} m={0.2} /><RB p={[0.2, 0.23, -0.2]} s={[0.5, 0.42, 0.35]} rad={0.02} c="#8a6444" r={0.5} /></Box>
    <Box x={0}><RB p={[0, 0.62, -0.39]} s={[0.55, 0.32, 0.04]} rad={0.01} c="#111216" r={0.3} /><mesh position={[0, 0.62, -0.368]}><planeGeometry args={[0.5, 0.28]} /><meshBasicMaterial color="#3a6a9a" toneMapped={false} /></mesh><RB p={[0, 0.16, 0.05]} s={[0.6, 0.24, 0.3]} rad={0.05} c="#6b5b4b" r={0.9} /></Box>
    <Box x={1.08}><RB p={[0, 0.14, -0.05]} s={[0.66, 0.2, 0.7]} rad={0.04} c="#ece6da" r={0.95} />
      {[...Array(9)].map((_, i) => { const a = tt * (1.2 + rnd(i) * 0.8) + i, r = 0.12 + 0.22 * wind * rnd(i, 2); return <RB key={i} p={[Math.cos(a) * r, 0.3 + 0.35 * wind * rnd(i, 3) + 0.05 * Math.sin(a * 2), Math.sin(a) * r * 0.6]} rot={[a, a * 0.7, 0]} s={[0.1, 0.03, 0.08]} rad={0.01} c={["#e8e2d6", "#9a6a8a", "#5a7a6a", "#d8c8a8"][i % 4]} r={0.95} />; })}
      <group position={[0, 1.25, 0]} scale={0.3 + 0.7 * cl}>{[[-0.18, 0, 0, 0.2], [0.05, 0.06, 0.02, 0.24], [0.26, 0, 0, 0.18], [0.02, -0.06, 0.08, 0.2]].map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]}><sphereGeometry args={[r, 24, 18]} /><meshStandardMaterial color="#4a4e58" roughness={1} transparent opacity={cl} /></mesh>)}</group>
      {cl > 0.5 && [...Array(10)].map((_, i) => { const y = 1.1 - ((tt * 1.4 + rnd(i)) % 1) * 1.0; return <mesh key={i} position={[-0.3 + i * 0.065, y, 0.05 * (i % 3)]}><cylinderGeometry args={[0.004, 0.004, 0.08, 4]} /><meshBasicMaterial color="#9fb6d8" transparent opacity={0.7} /></mesh>; })}
    </Box>
    {[-1.08, 0].map((x, i) => <group key={i} position={[x, 1.25, 0]}><mesh><sphereGeometry args={[0.09, 24, 18]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} /></mesh></group>)}
  </Room>;
}}</Stage>;

// 8 · para él es una caja registradora: una registradora antigua abre su cajón con fuerza y adentro hay medias y ropa interior
export const E1Register: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const op = spr(tt, 2.0, 9, 0.5), keys = [0, 1, 2, 3].map((i) => sm(tt, 0.8 + i * 0.25, 1.0 + i * 0.25) * (1 - sm(tt, 1.2 + i * 0.25, 1.5 + i * 0.25)));
  return <Room tt={tt} c={cam([0.9, 1.35, 2.15], [0, 0.6, 0.15])} wall="wood" z={-0.9}>
    <RB p={[0, 0.2, 0]} s={[1.8, 0.4, 0.9]} rad={0.03} c="#5e412a" r={0.5} />
    <group position={[0, 0.4, 0]}>
      <RB p={[0, 0.12, 0]} s={[0.8, 0.24, 0.62]} rad={0.03} c="#b08a3a" m={0.85} r={0.3} />
      <RB p={[0, 0.38, -0.12]} s={[0.72, 0.3, 0.36]} rad={0.04} c="#c9a25a" m={0.85} r={0.28} />
      {[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => <mesh key={r * 5 + c} position={[-0.24 + c * 0.12, 0.28 + r * 0.045 - (r === 0 ? 0.02 * keys[c % 4] : 0), 0.08 - r * 0.045]} rotation={[Math.PI / 2 - 0.6, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.02, 16]} /><meshStandardMaterial color="#f2efe6" roughness={0.4} /></mesh>))}
      <RB p={[0, 0.62, -0.18]} s={[0.36, 0.14, 0.04]} rad={0.01} c="#22252b" r={0.5} />
      <group position={[0, 0.06, 0.1 + 0.42 * op]}>
        <RB p={[0, 0, 0.21]} s={[0.78, 0.12, 0.03]} rad={0.01} c="#a07a30" m={0.85} r={0.3} />
        <RB p={[0, -0.05, 0]} s={[0.74, 0.015, 0.42]} rad={0.003} c="#2a2c31" r={0.6} />
        {[-0.24, 0, 0.24].map((x, i) => <Sock3 key={i} p={[x, 0.0, 0.02]} s={0.55} rot={[0, i, 0]} col={["#4a5a6e", "#c9c2b0", "#8a7a64"][i]} />)}
        <RB p={[0.12, -0.02, -0.12]} s={[0.2, 0.04, 0.12]} rad={0.015} c="#e8e2d6" r={0.95} />
      </group>
    </group>
  </Room>;
}}</Stage>;

// 9 · las chapas del ejército: dos chapas en su cadenita se mecen sobre la pila, la luz les corre por el borde
export const E1Dogtags: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const sw = 0.32 * Math.sin(tt * 1.7) * Math.exp(-tt * 0.12), lift = sm(tt, 0.4, 1.8);
  const Tag = ({ x, z, r }: { x: number; z: number; r: number }) => <group position={[x, 0, z]} rotation={[0, r, 0]}>
    <RB s={[0.2, 0.32, 0.012]} rad={0.05} c="#c9ced4" m={0.95} r={0.22} />
    {[0, 1, 2, 3].map((i) => <RB key={i} p={[-0.02 + (i % 2) * 0.03, 0.08 - i * 0.05, 0.007]} s={[0.12 - (i % 2) * 0.03, 0.018, 0.004]} rad={0.003} c="#9aa0a8" m={0.9} r={0.35} />)}
    <mesh position={[0, 0.13, 0.007]}><torusGeometry args={[0.014, 0.004, 6, 16]} /><Mat c="#8a9098" m={0.9} r={0.3} /></mesh>
  </group>;
  return <Room tt={tt} c={cam([0.1, 1.15, 1.55], [0, 0.85, 0])} wall="drywall" z={-0.8} warm={0.8}>
    {[...Array(10)].map((_, j) => <RB key={j} p={[(rnd(j) - 0.5) * 1.4, 0.1 + (j % 3) * 0.06, (rnd(j, 2) - 0.5) * 0.6]} rot={[0, rnd(j, 3) * 3, 0]} s={[0.32, 0.07, 0.24]} rad={0.03} c={["#ece6da", "#9a6a8a", "#5a7a6a", "#d8c8a8"][j % 4]} r={0.95} />)}
    <group position={[0, 0.55 + 0.6 * lift, 0]} rotation={[0, 0, sw]}>
      {[...Array(18)].map((_, i) => { const a = (i / 18) * Math.PI; return <mesh key={i} position={[Math.cos(a) * 0.14 - 0.0, -0.06 - Math.sin(a) * 0.32, 0]}><sphereGeometry args={[0.008, 8, 8]} /><Mat c="#b8bcc2" m={0.95} r={0.25} /></mesh>; })}
      <group position={[0, -0.52, 0]}><Tag x={-0.03} z={0} r={0.1} /><Tag x={0.05} z={0.02} r={-0.15 + 0.1 * Math.sin(tt * 2.1)} /></group>
    </group>
    <spotLight position={[1.2, 2.2, 1.4]} angle={0.3} penumbra={0.6} intensity={12} distance={6} color="#fff2d8" />
  </Room>;
}}</Stage>;

// 10 · lo primero que mira: el colchón torcido; una esquina se levanta, se ve el sommier, cae y vuelve a levantarse
export const E1Corner: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const l1 = sm(tt, 1.0, 1.6) * (1 - sm(tt, 2.6, 3.1)), l2 = sm(tt, 4.2, 4.8) * (1 - sm(tt, 6.4, 6.9)), lift = Math.max(l1, l2);
  return <Room tt={tt} c={cam([1.6, 1.4, 2.4], [0, 0.4, 0.4])} wall="drywall" z={-1.3}>
    <Bed3 lift={0.55 * lift} shove={1} quilt="#8a6a5a" />
    <mesh position={[-0.72, 0.39, 1.0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.5, 0.5]} /><meshBasicMaterial color="#ffe6b0" transparent opacity={0.25 * lift} toneMapped={false} /></mesh>
  </Room>;
}}</Stage>;

// 11 · diez segundos: un metrónomo de madera da diez golpes delante de la cama
export const E1Metronome: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const run = c01((tt - 0.6) / 6.0), ang = run > 0 && run < 1 ? 0.42 * Math.sin((tt - 0.6) * Math.PI * 10 / 6.0) : 0, n = Math.min(10, Math.floor(run * 10 + 0.0001));
  return <Room tt={tt} c={cam([0.3, 0.75, 1.85], [0, 0.5, 0])} wall="drywall" z={-1.5}>
    <Bed3 p={[0.2, 0, -1.0]} rot={[0, 0.3, 0]} s={0.8} quilt="#7a8aa2" />
    <RB p={[0, 0.15, 0]} s={[0.9, 0.3, 0.5]} rad={0.02} c="#5e412a" r={0.5} />
    <group position={[0, 0.3, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.06, 0.2, 0.6, 4]} /><meshStandardMaterial color="#7a4a2a" roughness={0.45} /></mesh>
      <RB p={[0, 0.25, 0.115]} rot={[-0.3, 0, 0]} s={[0.16, 0.38, 0.01]} rad={0.004} c="#e8dcc0" r={0.6} />
      <group position={[0, 0.1, 0.14]} rotation={[0, 0, ang]}>
        <RB p={[0, 0.25, 0]} s={[0.012, 0.5, 0.008]} rad={0.003} c="#c9ced4" m={0.95} r={0.25} />
        <RB p={[0, 0.34, 0.006]} s={[0.05, 0.05, 0.02]} rad={0.008} c="#c9a25a" m={0.9} r={0.3} />
      </group>
    </group>
    {[...Array(10)].map((_, i) => <mesh key={i} position={[-0.38 + i * 0.085, 0.31, 0.21]}><sphereGeometry args={[0.018, 12, 12]} /><meshStandardMaterial color={i < n ? "#ffb257" : "#3a3a3e"} emissive={i < n ? "#ffb257" : "#000"} emissiveIntensity={i < n ? 0.7 : 0} /></mesh>)}
  </Room>;
}}</Stage>;

// 12 · al volquete: el colchón entra en arco al contenedor verde y una notita sale volando y baja meciéndose hacia la cámara
export const E1Dumpster: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const k = sm(tt, 0.8, 2.6), note = c01((tt - 2.4) / 4.2), note2 = useNote();
  return <Studio tt={tt} floor="concrete" warm={0.85} photo={0} keys={cam([0.4, 1.6, 3.4], [0, 0.7, 0])}>
    <RB p={[0, 1.6, -1.6]} s={[10, 3.2, 0.1]} rad={0.01} c="#9a8a7a" r={0.9} />
    <group position={[0, 0, -0.4]}>
      <RB p={[0, 0.45, 0]} s={[2.0, 0.9, 1.0]} rad={0.03} c="#2e6a3e" r={0.5} m={0.4} />
      <RB p={[0, 0.88, 0]} s={[1.9, 0.04, 0.9]} rad={0.01} c="#1a2a1e" r={0.8} />
      {[-0.6, 0.6].map((x, i) => <RB key={i} p={[x, 0.45, 0.51]} s={[0.06, 0.8, 0.02]} rad={0.01} c="#24552f" r={0.5} />)}
    </group>
    <group position={[-2.2 + 2.2 * k, 0.9 + 1.1 * Math.sin(k * Math.PI) - 0.25 * k, -0.4]} rotation={[0, 0, 1.2 * (1 - k) - 0.3 * k]}>
      <RB s={[1.3, 0.22, 0.85]} rad={0.08} c="#ece6da" r={0.95} />
      <RB p={[0, 0.115, 0]} s={[1.28, 0.01, 0.83]} rad={0.003} c="#d8cfbf" r={0.95} />
    </group>
    {tt > 2.4 && <group position={[0.1 + 0.35 * Math.sin(note * 6), 1.3 + 0.5 * Math.sin(note * Math.PI) - 0.7 * note, -0.4 + 2.0 * note]} rotation={[0.6 * Math.sin(note * 7), note * 3, 0.5 * Math.sin(note * 5)]}>
      <mesh><planeGeometry args={[0.28, 0.2]} /><meshStandardMaterial map={note2} side={THREE.DoubleSide} roughness={0.9} /></mesh>
    </group>}
  </Studio>;
}}</Stage>;
const useNote = () => React.useMemo(() => {
  const c = document.createElement("canvas"); c.width = 280; c.height = 200; const g = c.getContext("2d")!;
  g.fillStyle = "#f6efd2"; g.fillRect(0, 0, 280, 200); g.strokeStyle = "#9fb6d8"; g.lineWidth = 2; for (let y = 40; y < 200; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(280, y); g.stroke(); }
  g.fillStyle = "#1e3a8a"; g.font = "italic 34px Georgia"; g.fillText("the rest is", 30, 92); g.fillText("in the bed", 50, 140);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}, []);

// 13 · la mesa de luz como vitrina: se abre el cajón y cada cosa sube y queda flotando bajo su propia luz: anteojos, remedios, linterna, control y la platita
export const E1Museum: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const bill = useBillTex(), op = sm(tt, 0.4, 1.2), up = (i: number) => spr(tt, 1.4 + i * 0.9, 7, 0.55);
  const items: [V3, React.ReactNode][] = [
    [[-0.2, 0, 0], <group><mesh rotation={[Math.PI / 2, 0, 0]} position={[-0.045, 0, 0]}><torusGeometry args={[0.035, 0.006, 8, 24]} /><Mat c="#2a2c31" r={0.3} /></mesh><mesh rotation={[Math.PI / 2, 0, 0]} position={[0.045, 0, 0]}><torusGeometry args={[0.035, 0.006, 8, 24]} /><Mat c="#2a2c31" r={0.3} /></mesh></group>],
    [[-0.07, 0, 0.02], <group><mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.03, 0.03, 0.1, 20]} /><meshStandardMaterial color="#d8822a" transparent opacity={0.85} roughness={0.2} /></mesh><mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.033, 0.033, 0.025, 20]} /><meshStandardMaterial color="#f6f3ec" /></mesh></group>],
    [[0.06, 0, -0.02], <group rotation={[0, 0, Math.PI / 2]}><mesh><cylinderGeometry args={[0.022, 0.022, 0.16, 16]} /><Mat c="#3a3a3e" m={0.6} r={0.4} /></mesh><mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.032, 0.022, 0.03, 16]} /><Mat c="#c9ced4" m={0.9} r={0.25} /></mesh></group>],
    [[0.19, 0, 0.02], <group><RB s={[0.05, 0.02, 0.17]} rad={0.008} c="#22252b" r={0.4} />{[0, 1, 2].map((j) => <mesh key={j} position={[0, 0.012, -0.05 + j * 0.04]}><sphereGeometry args={[0.008, 8, 8]} /><meshStandardMaterial color="#c62a22" /></mesh>)}</group>],
    [[0.0, 0, 0.12], <Bill3 tex={bill} s={0.8} />],
  ];
  return <Room tt={tt} c={cam([0.1, 1.35, 1.55], [0, 0.72, 0.2])} wall="wood" z={-0.6} warm={0.75}>
    <Night3 s={1.15} open={op} lamp={0.6} />
    {items.map(([p, node], i) => { const u = up(i), y = 0.47 * 1.15 + 0.38 * u; return <group key={i} position={[p[0] * 1.15, y, 0.02 + 0.38 * 1.15 * op + p[2] * 1.15]} rotation={[0, 0.5 * Math.sin(tt * 0.8 + i) * u, 0]} scale={1.3}>
      {node}
      {u > 0.1 && <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.06, 24]} /><meshBasicMaterial color="#fff2d0" transparent opacity={0.35 * c01(u)} toneMapped={false} /></mesh>}
    </group>; })}
  </Room>;
}}</Stage>;

// 14 · el joyero se anuncia solo: la tapa se abre, la bailarina sube girando y los anillos brillan como vidriera
export const E1Musicbox: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const op = sm(tt, 0.8, 1.8), up = spr(tt, 1.6, 7, 0.5), spin = tt * 2.2;
  return <Room tt={tt} c={cam([0.5, 1.05, 1.55], [0, 0.55, 0])} wall="drywall" z={-0.8} warm={0.75}>
    <RB p={[0, 0.2, 0]} s={[1.4, 0.4, 0.8]} rad={0.03} c="#5e412a" r={0.45} />
    <group position={[0, 0.4, 0]}>
      <RB p={[0, 0.09, 0]} s={[0.56, 0.18, 0.38]} rad={0.02} c="#7a2a3a" r={0.5} />
      {[[-0.28, 0], [0.28, 0]].map(([x], i) => <RB key={i} p={[x, 0.09, 0]} s={[0.012, 0.19, 0.39]} rad={0.003} c="#c9a25a" m={0.9} r={0.3} />)}
      <RB p={[0, 0.17, 0]} s={[0.5, 0.02, 0.32]} rad={0.004} c="#6a1a2a" r={0.95} />
      {[[-0.15, 0.05], [0.14, 0.07], [0.05, -0.08]].map(([x, z], i) => <mesh key={i} position={[x, 0.2, z]} rotation={[Math.PI / 2 - 0.3, 0, i]}><torusGeometry args={[0.035, 0.009, 10, 28]} /><meshStandardMaterial color={i === 1 ? "#d8dde2" : "#d8b04a"} metalness={1} roughness={0.15} emissive="#ffcf70" emissiveIntensity={0.25 * op} /></mesh>)}
      <group position={[0, 0.18, -0.19]} rotation={[-op * 1.75, 0, 0]}><RB p={[0, 0.0, 0.19]} s={[0.58, 0.05, 0.4]} rad={0.02} c="#7a2a3a" r={0.5} /><mesh position={[0, -0.028, 0.19]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[0.4, 0.26]} /><meshStandardMaterial color="#e8eef6" metalness={1} roughness={0.05} /></mesh></group>
      <group position={[0, 0.18 + 0.2 * up, -0.02]} rotation={[0, spin, 0]} scale={c01(up)}>
        <mesh position={[0, 0.05, 0]}><coneGeometry args={[0.05, 0.08, 20]} /><meshStandardMaterial color="#f2c0c8" roughness={0.6} /></mesh>
        <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.012, 0.016, 0.07, 12]} /><meshStandardMaterial color="#f2c0c8" roughness={0.6} /></mesh>
        <mesh position={[0, 0.17, 0]}><sphereGeometry args={[0.018, 14, 12]} /><meshStandardMaterial color="#f0d8c4" roughness={0.6} /></mesh>
        <mesh position={[0, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.005, 0.005, 0.1, 8]} /><meshStandardMaterial color="#f0d8c4" /></mesh>
      </group>
      <pointLight position={[0, 0.5, 0.2]} intensity={1.6 * op} distance={1.6} color="#ffd9a0" />
    </group>
  </Room>;
}}</Stage>;

// 15 · el estante alto: la cámara sube desde el piso del placar hasta el estante; detrás de los pulóveres doblados asoma la caja de zapatos
export const E1Highshelf: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const peek = sm(tt, 3.6, 5.0), sp = sm(tt, 3.4, 4.6);
  return <Studio tt={tt} floor="wood" warm={0.8} photo={0} keys={[{ t: 0, p: [0.3, 0.6, 2.4], l: [0, 0.5, 0], fov: 42 }, { t: 1.2, p: [0.3, 0.75, 2.4], l: [0, 0.8, 0], fov: 42 }, { t: 3.4, p: [0.2, 2.0, 1.7], l: [0, 1.95, 0], fov: 42 }, { t: 10, p: [0.3, 2.02, 1.55], l: [0, 1.95, 0], fov: 42, arc: 0.03 }]}>
    <RB p={[0, 1.6, -0.4]} s={[6, 3.4, 0.1]} rad={0.01} c="#d8d0c2" r={0.9} />
    <Closet3 doors={1 - sm(tt, 0.3, 1.3)}>
      {[-0.45, -0.15, 0.2, 0.5].map((x, i) => <Coat3 key={i} p={[x, 1.7, -0.05]} col={["#4a5a6e", "#8a6a5a", "#5a6a4a", "#9a9a92"][i]} sw={0.02 * Math.sin(tt + i)} />)}
      {[-0.42, 0.42].map((x, i) => <group key={i} position={[x - 0.12 * sp * (i ? -1 : 1), 1.87, 0.1]}>{[0, 1, 2].map((j) => <RB key={j} p={[0, 0.045 + j * 0.085, 0]} s={[0.4, 0.08, 0.3]} rad={0.03} c={["#9a3a32", "#5a6a8a", "#d8c8a8"][(i + j) % 3]} r={0.97} />)}</group>)}
      <ShoeBox3 p={[0, 1.87, -0.12 + 0.12 * peek]} s={1.25} />
      <spotLight position={[0, 2.6, 1.4]} target-position={[0, 1.9, 0]} angle={0.32} penumbra={0.7} intensity={14 * peek} distance={4} color="#fff2d0" />
      {[0, 1].map((i) => <RB key={i} p={[-0.6 + i * 1.1, 0.06, 0.12]} s={[0.22, 0.12, 0.3]} rad={0.04} c="#3a2a22" r={0.6} />)}
    </Closet3>
  </Studio>;
}}</Stage>;

// 16 · la balanza de resorte: tres cajas cuelgan del gancho; la de zapatos estira el resorte, la vacía casi nada, la de plata queda en el medio y se marca
export const E1Springscale: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const bill = useBillTex(), ph = Math.min(2, Math.floor(c01((tt - 0.6) / 6.6) * 3)), local = (tt - 0.6) - ph * 2.2;
  const target = [0.42, 0.06, 0.22][ph], st = target * spr(local, 0.4, 9, 0.35), mark = ph === 2 ? sm(local, 1.2, 1.8) : 0;
  const slide = 1 - sm(local, 0, 0.45);
  return <Room tt={tt} c={cam([0.15, 1.25, 2.8], [0, 1.05, 0])} wall="wood" z={-0.6} warm={0.85}>
    <RB p={[0, 2.05, -0.1]} s={[1.6, 0.06, 0.12]} rad={0.02} c="#5e412a" r={0.5} />
    <RB p={[-0.2, 1.65, -0.08]} s={[0.07, 0.7, 0.04]} rad={0.015} c="#c9a25a" m={0.9} r={0.3} />
    {[0.06, 0.22, 0.42].map((y, i) => <RB key={i} p={[-0.2, 1.88 - y, -0.055]} s={[0.12, 0.012, 0.01]} rad={0.003} c={i === 1 ? "#2a8a4a" : "#22252b"} r={0.5} e={i === 1 ? "#6fe39a" : "#000"} ei={i === 1 ? 1.2 * mark : 0} />)}
    {[...Array(14)].map((_, i) => <mesh key={i} position={[0, 2.0 - (0.06 + i * (0.25 + st) / 14), -0.05]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.045, 0.007, 8, 20]} /><Mat c="#c9ced4" m={0.95} r={0.25} /></mesh>)}
    <RB p={[-0.1, 1.88 - st, -0.05]} s={[0.2, 0.012, 0.012]} rad={0.003} c="#c62a22" r={0.4} />
    <group position={[1.6 * slide, 1.6 - st, -0.05]}>
      <mesh position={[0, 0.07, 0]}><torusGeometry args={[0.035, 0.008, 8, 20, Math.PI]} /><Mat c="#c9ced4" m={0.95} r={0.25} /></mesh>
      <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.006, 0.006, 0.2, 8]} /><Mat c="#9aa0a8" m={0.9} r={0.3} /></mesh>
      <ShoeBox3 p={[0, -0.32, 0]} s={1.5} col={["#d8b48a", "#c8c0b0", "#d8b48a"][ph]} lidCol={["#c49a6a", "#b8ae9a", "#c49a6a"][ph]}>
        {ph === 0 && [0, 1].map((j) => <RB key={j} p={[-0.07 + j * 0.14, 0.2, 0]} s={[0.12, 0.08, 0.2]} rad={0.04} c="#3a2a22" r={0.4} />)}
        {ph === 2 && <Stack3 p={[0, 0.15, 0]} tex={bill} n={8} s={0.8} />}
      </ShoeBox3>
    </group>
  </Room>;
}}</Stage>;

export const HEROES_E1 = { candle8: E1Candle8, dumpbed: E1Dumpbed, laser4: E1Laser4, duck: E1Duck, bulbfade: E1Bulbfade, sockroll: E1Sockroll, storm: E1Storm, register: E1Register, dogtags: E1Dogtags, corner: E1Corner, metronome: E1Metronome, dumpster: E1Dumpster, museum: E1Museum, musicbox: E1Musicbox, highshelf: E1Highshelf, springscale: E1Springscale };
