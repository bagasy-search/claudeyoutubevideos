// rk29e · componentes 3D 32-46 (29-oct). Cada uno UNA vez en la tanda (D:/rtmp/rk29_COMPONENTES.md).
import React from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { Studio, RB, Mat, Thief3, sm, spr, c01, rnd, type V3 } from "./studio3d";
import { cam, Room, Plate, Dresser3, Night3, Sock3, ShoeBox3, Stack3, Bill3, useBillTex, Wallet3, LockBox3 } from "./bed3d";

type P = { t: number; h: H };

// 32 · la imagen en la cabeza: sobre la cabeza del ladrón flota una burbuja 3D con cajón+billetera+reloj; el cajón real se abre igual, la toma y se va
export const E3Picture: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const bub = spr(tt, 0.4, 7, 0.5), op = sm(tt, 2.4, 3.2), grab = sm(tt, 3.6, 4.4), leave = sm(tt, 4.8, 7.0);
  return <Room tt={tt} c={cam([0.4, 1.5, 3.0], [0.1, 1.0, 0])} wall="drywall" z={-1.0}>
    <Dresser3 p={[0.55, 0, -0.5]} s={0.85} open={[0, op, 0]} inDrawer={[null, grab < 0.5 ? <Wallet3 s={1.2} p={[0, 0.02, 0]} /> : null, null]} />
    <group position={[-0.35 - 0.8 * leave, 0, 0.05]}><Thief3 yaw={Math.PI / 2 * (1 - 2 * sm(tt, 4.6, 5.0))} step={leave > 0 ? tt * 5 : 0} reach={grab * (1 - leave)} /></group>
    {bub > 0.01 && <group position={[-0.35 - 1.6 * leave, 1.95, 0.05]} scale={bub * (1 - sm(tt, 4.4, 4.9))}>
      <mesh><sphereGeometry args={[0.36, 32, 24]} /><meshPhysicalMaterial color="#f6f8fa" transmission={0.7} roughness={0.05} transparent opacity={0.5} /></mesh>
      {[0, 1].map((i) => <mesh key={i} position={[0.1 + i * 0.12, -0.42 - i * 0.1, 0]}><sphereGeometry args={[0.05 - i * 0.015, 16, 12]} /><meshPhysicalMaterial color="#f6f8fa" transmission={0.7} roughness={0.05} transparent opacity={0.5} /></mesh>)}
      <group rotation={[0.2, tt * 0.6, 0]}>
        <RB p={[0, -0.08, 0]} s={[0.26, 0.1, 0.16]} rad={0.01} c="#8a6444" r={0.6} />
        <group position={[-0.06, 0.06, 0]}><Wallet3 s={0.7} col="#2a2c31" /></group>
        <mesh position={[0.1, 0.08, 0.02]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.04, 0.008, 8, 24]} /><Mat c="#d8b04a" m={1} r={0.25} /></mesh>
      </group>
    </group>}
  </Room>;
}}</Stage>;

// 33 · el señuelo vacío por dentro: la billetera señuelo se abre; licencia, tarjeta de crédito y carnet salen volando hacia afuera y quedan sólo dos billetes
export const E3Reject: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const bill = useBillTex(), op = sm(tt, 0.6, 1.4), fly = (i: number) => sm(tt, 1.6 + i * 0.6, 2.6 + i * 0.6);
  const cards: [string, number][] = [["#2a5aa0", -1], ["#c62a22", 1], ["#d8c8a0", -0.4]];
  return <Room tt={tt} c={cam([0.05, 0.88, 0.85], [0, 0.44, 0])} wall="wood" z={-0.8} warm={0.8}>
    <RB p={[0, 0.2, 0]} s={[1.6, 0.4, 0.8]} rad={0.03} c="#5e412a" r={0.45} />
    <group position={[0, 0.4, 0]}>
      <Wallet3 s={2.0} open={op} col="#8a5a34" worn={1} />
      {[0, 1].map((j) => <Bill3 key={j} p={[0.07, 0.06 + 0.004 * j, 0.02 * j]} rot={[0, 0.1 + 0.2 * j, 0]} tex={bill} s={0.9} />)}
      {cards.map(([c, sd], i) => { const k = fly(i); return <RB key={i} p={[-0.2 + sd * 1.3 * k, 0.06 + 0.5 * Math.sin(k * Math.PI) + 0.006 * i, 0.4 * k]} rot={[k * 3 * sd, k * 2, 0]} s={[0.17, 0.004, 0.11]} rad={0.008} c={c} r={0.4} op={1 - sm(tt, 2.4 + i * 0.6, 2.7 + i * 0.6)} />; })}
    </group>
  </Room>;
}}</Stage>;

// 34 · la bóveda que no se quema: el banco en miniatura con columnas; afuera cae lluvia, una llamita se apaga contra la puerta y la silueta no puede sacar nada
export const E3Vault: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const door = 1 - sm(tt, 0.5, 1.5), rain = c01((tt - 1.8) / 2.0), fire = c01((tt - 4.0) / 1.6), f = 0.9 + 0.1 * Math.sin(tt * 2 * Math.PI * 1.4);
  return <Studio tt={tt} floor="concrete" warm={0.8} photo={0} keys={cam([0.6, 1.25, 3.6], [0.3, 0.75, 0])}>
    <RB p={[0, 0.08, 0]} s={[1.8, 0.16, 1.0]} rad={0.01} c="#d8d4cc" r={0.85} />
    {[-0.6, -0.2, 0.2, 0.6].map((x, i) => <mesh key={i} position={[x, 0.65, 0.35]}><cylinderGeometry args={[0.06, 0.07, 1.0, 20]} /><meshStandardMaterial color="#ece8e0" roughness={0.7} /></mesh>)}
    <RB p={[0, 0.65, -0.1]} s={[1.6, 1.0, 0.7]} rad={0.01} c="#e2ddd4" r={0.8} />
    <mesh position={[0, 1.32, 0.0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[1.2, 0.36, 4]} /><meshStandardMaterial color="#d2ccc2" roughness={0.75} /></mesh>
    <group position={[0, 0.55, 0.26]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.24, 0.24, 0.05, 40]} /><Mat c="#9aa0a8" m={0.95} r={0.25} /></mesh>
      <group rotation={[0, 0, tt * 0.8 * door]}>{[0, 1, 2, 3, 4, 5].map((i) => <RB key={i} p={[Math.cos(i) * 0.12, Math.sin(i) * 0.12, 0.035]} s={[0.025, 0.08, 0.02]} rot={[0, 0, i]} rad={0.008} c="#c9ced4" m={1} r={0.2} />)}</group>
    </group>
    {rain > 0 && [...Array(30)].map((_, i) => { const y = 2.2 - ((tt * 1.4 + rnd(i)) % 1) * 2.1; return <mesh key={i} position={[-1.4 + rnd(i, 2) * 2.8, y, 0.6 + rnd(i, 3) * 0.6]} scale={[1, 4, 1]}><sphereGeometry args={[0.008, 6, 6]} /><meshBasicMaterial color="#8fc8e8" transparent opacity={0.6 * Math.min(1, rain * 3) * (1 - fire)} /></mesh>; })}
    {fire > 0 && fire < 1 && <group position={[0.75, 0.25, 0.6]}><mesh scale={[1, f * (1 - fire), 1]}><coneGeometry args={[0.07, 0.25, 16]} /><meshBasicMaterial color="#ffb257" toneMapped={false} /></mesh><pointLight intensity={1.5 * (1 - fire)} distance={1.5} color="#ffb257" /></group>}
    <group position={[-1.15, 0, 0.7]}><Thief3 yaw={Math.PI / 2 - 0.3 * Math.sin(tt * 1.2)} reach={0.5 + 0.4 * Math.sin(tt * 2)} s={0.75} /></group>
  </Studio>;
}}</Stage>;

// 35 · el paraguas chico: la póliza abre un paraguas sobre la casa; cubre la casa entera pero la pila de plata queda afuera mojándose
export const E3Umbrella: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const bill = useBillTex(), open = spr(tt, 0.8, 7, 0.5), rain = c01((tt - 1.6) / 1.0);
  return <Studio tt={tt} floor="paper" warm={0.85} photo={0} keys={cam([0.2, 1.6, 3.2], [0, 0.8, 0])}>
    <group position={[-0.25, 0, 0]}>
      <RB p={[0, 0.3, 0]} s={[0.8, 0.6, 0.6]} rad={0.01} c="#e8dcc8" r={0.85} />
      <mesh position={[0, 0.78, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.66, 0.38, 4]} /><meshStandardMaterial color="#8a3a2a" roughness={0.7} /></mesh>
      <RB p={[0, 0.18, 0.305]} s={[0.16, 0.3, 0.02]} rad={0.005} c="#5a3a2a" r={0.6} />
      <group position={[0, 1.0, 0]}>
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.012, 0.012, 1.0, 10]} /><Mat c="#2a2c31" m={0.6} r={0.35} /></mesh>
        <mesh position={[0, 1.0, 0]} scale={[open, 0.5 + 0.5 * open, open]}><sphereGeometry args={[0.85, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2.6]} /><meshStandardMaterial color="#2a5aa0" roughness={0.6} side={THREE.DoubleSide} /></mesh>
      </group>
    </group>
    <group position={[1.0, 0, 0.3]}><Stack3 tex={bill} n={14} s={1.2} /></group>
    {rain > 0 && [...Array(40)].map((_, i) => { const x = -1.3 + rnd(i) * 2.8, under = Math.abs(x + 0.25) < 0.8 * open; const yTop = under ? 1.9 : 2.6, y = yTop - ((tt * 1.3 + rnd(i, 2)) % 1) * (yTop - 0.05); return (under && y < 1.9) ? null : <mesh key={i} position={[x, y, 0.1 + rnd(i, 3) * 0.5]} scale={[1, 4, 1]}><sphereGeometry args={[0.009, 6, 6]} /><meshBasicMaterial color="#6fa8d8" transparent opacity={0.7 * rain} /></mesh>; })}
    {rain > 0 && [...Array(5)].map((_, i) => <mesh key={"s" + i} position={[0.85 + i * 0.07, 0.006, 0.45 + rnd(i) * 0.1]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.04 + 0.03 * c01(tt - 2 - i * 0.3), 16]} /><meshStandardMaterial color="#6fa8d8" roughness={0.05} transparent opacity={0.5} /></mesh>)}
  </Studio>;
}}</Stage>;

// 36 · el bote vendido: un bote de pesca en su tráiler se aleja por el camino y el sobre gordo cae en el cajón de arriba de la cómoda, que se cierra
export const E3Boat: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const bill = useBillTex(), away = sm(tt, 0.5, 3.4), env = sm(tt, 3.2, 4.4), close = sm(tt, 4.8, 5.6);
  return <Studio tt={tt} floor="concrete" warm={0.85} photo={0} keys={cam([0.2, 1.4, 3.1], [0.2, 0.55, 0])}>
    <group position={[-1.0 - 1.8 * away, 0, -0.3]} rotation={[0, Math.PI / 2, 0]}>
      <RB p={[0, 0.16, 0]} s={[0.36, 0.04, 1.1]} rad={0.01} c="#3a3c42" m={0.6} r={0.4} />
      {[-0.22, 0.22].map((x, i) => <mesh key={i} position={[x, 0.1, 0.1]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.09, 0.09, 0.06, 20]} /><meshStandardMaterial color="#151515" roughness={0.8} /></mesh>)}
      <group position={[0, 0.33, 0]}>
        <mesh scale={[0.32, 0.22, 0.95]}><sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#e8ecf0" roughness={0.35} metalness={0.2} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.31, 0.94, 1]}><circleGeometry args={[1, 32]} /><meshStandardMaterial color="#2a5aa0" roughness={0.6} /></mesh>
      </group>
    </group>
    <group position={[0.75, 0, 0]}>
      <Dresser3 s={0.9} open={[0.9 * (1 - close), 0, 0]} />
      <group position={[0, 0.9 + 1.0 * (1 - env), 0.25 + 0.2 * (1 - close) * (env > 0.99 ? 1 : 1)]} rotation={[-Math.PI / 2 * 0, 0, 0.2 * (1 - env)]}>
        {close < 0.95 && <><RB s={[0.34, 0.06, 0.2]} rad={0.012} c="#f2ead6" r={0.9} /><Bill3 p={[0.04, 0.035, 0.03]} rot={[0, 0.3, 0]} tex={bill} s={0.6} /></>}
      </group>
    </group>
  </Studio>;
}}</Stage>;

// 37 · lo que pagó la póliza: una torta de ocho mil billetes; el cuchillo baja y la porción que se lleva es finita, el resto queda
export const E3Slice: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const knife = sm(tt, 0.8, 1.8), pull = sm(tt, 2.4, 3.6), A = Math.PI * 2 * 0.028;
  const bill = React.useMemo(() => { const c = document.createElement("canvas"); c.width = 512; c.height = 256; const g = c.getContext("2d")!;
    for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#cfdcc2" : "#b9cba8"; g.fillRect(0, i * 32, 512, 32); g.fillStyle = "#3f6a4a"; g.fillRect(0, i * 32 + 29, 512, 3); for (let j = 0; j < 6; j++) { g.beginPath(); g.ellipse(40 + j * 86, i * 32 + 15, 12, 10, 0, 0, Math.PI * 2); g.fillStyle = "#5d8a68"; g.fill(); } }
    const tx = new THREE.CanvasTexture(c); tx.wrapS = THREE.RepeatWrapping; tx.repeat.set(3, 1); tx.colorSpace = THREE.SRGBColorSpace; return tx; }, []);
  return <Room tt={tt} c={cam([0.3, 1.35, 2.1], [0.12, 0.6, 0])} wall="drywall" z={-0.8} warm={0.85}>
    <RB p={[0, 0.22, 0]} s={[1.6, 0.44, 0.9]} rad={0.02} c="#e8e2d6" r={0.5} />
    <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.42, 0.42, 0.012, 48]} /><meshStandardMaterial color="#f6f3ec" roughness={0.4} /></mesh>
    <group position={[0, 0.46, 0]}>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.36, 0.36, 0.2, 64, 1, false, A, Math.PI * 2 - A]} /><meshStandardMaterial map={bill} roughness={0.7} side={THREE.DoubleSide} /></mesh>
      <group position={[0.32 * pull, 0.2 * Math.sin(pull * Math.PI), 0.25 * pull]}><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.36, 0.36, 0.2, 16, 1, false, 0, A]} /><meshStandardMaterial map={bill} roughness={0.7} side={THREE.DoubleSide} /></mesh></group>
    </group>
    <group position={[0.06, 0.95 - 0.38 * knife, 0.05]} rotation={[0, -0.05, Math.PI / 2]}>
      <RB p={[0, 0.03, 0]} s={[0.34, 0.12, 0.006]} rad={0.003} c="#d8dde2" m={1} r={0.15} />
      <RB p={[0.25, 0.03, 0]} s={[0.16, 0.05, 0.045]} rad={0.018} c="#3a2a1e" r={0.55} />
    </group>
  </Room>;
}}</Stage>;

// 38 · la máquina de la garra: una sola caja de premios con TODA la plata; la garra baja, agarra la única pila y se la lleva entera
export const E3Claw: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const bill = useBillTex(), dn = sm(tt, 0.8, 2.0), cl = sm(tt, 2.0, 2.5), up = sm(tt, 2.7, 3.9), over = sm(tt, 4.0, 5.2), drop = sm(tt, 5.3, 5.8);
  const y = 1.55 - 0.65 * dn + 0.65 * up, x = -0.15 + 0.5 * over;
  return <Room tt={tt} c={cam([0.15, 1.1, 2.1], [0, 0.95, 0])} wall="brick" z={-0.9} night={0.35}>
    <RB p={[0, 0.3, 0]} s={[1.1, 0.6, 0.8]} rad={0.03} c="#c62a22" r={0.4} />
    <RB p={[0, 1.85, 0]} s={[1.1, 0.14, 0.8]} rad={0.03} c="#c62a22" r={0.4} />
    {[[-0.53, -0.38], [0.53, -0.38], [-0.53, 0.38], [0.53, 0.38]].map(([x0, z0], i) => <RB key={i} p={[x0, 1.2, z0]} s={[0.04, 1.2, 0.04]} rad={0.01} c="#d8b04a" m={0.8} r={0.3} />)}
    <mesh position={[0, 1.2, 0.4]}><planeGeometry args={[1.06, 1.16]} /><meshPhysicalMaterial color="#e8f2f6" transmission={0.9} roughness={0.03} transparent opacity={0.18} /></mesh>
    <RB p={[0.38, 0.62, 0]} s={[0.24, 0.04, 0.24]} rad={0.01} c="#22252b" r={0.5} />
    <group position={[x, y, 0]} scale={2}>
      <mesh position={[0, (1.78 - y) / 4, 0]}><cylinderGeometry args={[0.006, 0.006, Math.max(0.01, (1.78 - y) / 2), 6]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh>
      <RB p={[0, 0.03, 0]} s={[0.08, 0.06, 0.08]} rad={0.02} c="#c9ced4" m={1} r={0.2} />
      {[0, 1, 2].map((i) => <group key={i} rotation={[0, i * Math.PI * 2 / 3, 0]}><group position={[0.04, 0, 0]} rotation={[0, 0, 0.5 - 0.45 * cl]}><RB p={[0.04, -0.07, 0]} s={[0.012, 0.14, 0.02]} rad={0.005} c="#c9ced4" m={1} r={0.2} /></group></group>)}
      <group position={[0, -0.13 - 0.5 * drop, 0]} visible={cl > 0.9 && drop < 1}><Stack3 tex={bill} n={14} s={0.8} /></group>
    </group>
    {cl < 0.9 && <group position={[-0.15, 0.62, 0]}><Stack3 tex={bill} n={14} s={1.6} /></group>}
  </Room>;
}}</Stage>;

// 39 · cuánto viaja una frase: un avioncito de papel sale de la mesa de café, cruza tres casas del barrio y aterriza junto a un cofre de cedro
export const E3Plane: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const f = c01((tt - 0.6) / 5.2), x = -1.9 + 3.6 * f, y = 0.85 + 0.55 * Math.sin(f * Math.PI) - 0.2 * f, chest = sm(tt, 5.6, 6.6);
  const Home = ({ p, c }: { p: V3; c: string }) => <group position={p}><RB p={[0, 0.22, 0]} s={[0.5, 0.44, 0.4]} rad={0.01} c={c} r={0.85} /><mesh position={[0, 0.58, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.42, 0.28, 4]} /><meshStandardMaterial color="#6a3a2a" roughness={0.7} /></mesh><RB p={[0.1, 0.25, 0.205]} s={[0.1, 0.1, 0.01]} rad={0.003} c="#ffe2a0" e="#ffe2a0" ei={0.5} /></group>;
  return <Studio tt={tt} floor="paper" warm={0.85} photo={0} keys={cam([x * 0.4, 1.45, 3.6], [x * 0.55, 0.6, 0])}>
    <group position={[-1.9, 0, 0.1]}><RB p={[0, 0.3, 0]} s={[0.6, 0.04, 0.4]} rad={0.01} c="#8a6444" r={0.5} />{[[-0.25, -0.15], [0.25, -0.15], [-0.25, 0.15], [0.25, 0.15]].map(([a, b], i) => <RB key={i} p={[a, 0.15, b]} s={[0.04, 0.3, 0.04]} rad={0.01} c="#6a4a30" r={0.6} />)}</group>
    <Home p={[-0.9, 0, -0.6]} c="#e8dcc8" /><Home p={[0, 0, -0.8]} c="#c8d8e0" /><Home p={[0.9, 0, -0.6]} c="#e0d0c0" />
    <group position={[x, y, 0.25]} rotation={[0.15 * Math.sin(tt * 3), 0, -0.25 * Math.cos(f * Math.PI)]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><shapeGeometry args={[planeShape()]} /><meshStandardMaterial color="#f6f3ec" roughness={0.8} side={THREE.DoubleSide} /></mesh>
    </group>
    <group position={[1.75, 0, 0.25]}>
      <RB p={[0, 0.18, 0]} s={[0.6, 0.32, 0.34]} rad={0.02} c="#9a5a3a" r={0.5} />
      <group position={[0, 0.34, -0.17]} rotation={[-0.9 * chest, 0, 0]}><RB p={[0, 0.03, 0.17]} s={[0.62, 0.06, 0.36]} rad={0.02} c="#a8663f" r={0.5} /></group>
      <RB p={[0, 0.27, 0.172]} s={[0.06, 0.05, 0.01]} rad={0.004} c="#d8b04a" m={1} r={0.25} />
    </group>
  </Studio>;
}}</Stage>;
const planeShape = () => { const s = new THREE.Shape(); s.moveTo(0.16, 0); s.lineTo(-0.12, 0.09); s.lineTo(-0.07, 0); s.lineTo(-0.12, -0.09); s.lineTo(0.16, 0); return s; };

// 40 · vendida con las paredes llenas: el cartel de VENDIDA se clava en el jardín y el corte de la pared muestra los sobres todavía adentro
export const E3Sold: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const sign = spr(tt, 0.6, 8, 0.45), cut = sm(tt, 2.2, 3.6), glow = 0.5 + 0.5 * Math.sin(tt * 2.4);
  return <Studio tt={tt} floor="concrete" warm={0.85} photo={0} keys={cam([0.6, 1.4, 3.0], [0.15, 0.6, 0])}>
    <RB p={[0, 0.006, 0.9]} s={[3.6, 0.012, 1.0]} rad={0.003} c="#5a8a3a" r={0.95} />
    <group position={[0.2, 0, -0.3]}>
      <RB p={[0, 0.5, 0]} s={[1.6, 1.0, 0.9]} rad={0.01} c="#e8dcc8" r={0.85} op={1 - 0.0 * cut} />
      <mesh position={[0, 1.22, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1.6, 1, 1.0]}><coneGeometry args={[0.85, 0.45, 4]} /><meshStandardMaterial color="#6a3a2a" roughness={0.7} /></mesh>
      <group position={[0.35, 0.55, 0.452]}>
        <mesh scale={[cut, cut, 1]}><planeGeometry args={[0.6, 0.6]} /><meshStandardMaterial color="#5a4a3a" roughness={0.95} /></mesh>
        {cut > 0.3 && [0.15, -0.15].map((x, i) => <RB key={i} p={[x, 0, 0.005]} s={[0.03, 0.6 * cut, 0.02]} rad={0.004} c="#b8936a" r={0.8} />)}
        {cut > 0.5 && [[-0.05, 0.1], [0.0, -0.12], [0.23, 0.05]].map(([x, y], i) => <RB key={"e" + i} p={[x, y, 0.012]} rot={[0, 0, 0.2 * (i - 1)]} s={[0.14, 0.09, 0.012]} rad={0.004} c="#f2ead6" r={0.9} e="#ffe6b0" ei={0.15 * glow} />)}
      </group>
      <RB p={[-0.4, 0.3, 0.452]} s={[0.24, 0.5, 0.02]} rad={0.004} c="#5a3a2a" r={0.6} />
    </group>
    <group position={[-1.0, 1.4 * (1 - sign), 0.9]} rotation={[0, 0.3, 0]}>
      <RB p={[0, 0.4, 0]} s={[0.04, 0.8, 0.04]} rad={0.01} c="#f6f3ec" r={0.6} />
      <RB p={[0.25, 0.7, 0]} s={[0.5, 0.03, 0.03]} rad={0.008} c="#f6f3ec" r={0.6} />
      <Plate p={[0.25, 0.53, 0.02]} w={0.46} h={0.26} txt={["SOLD"]} bg="#c62a22" fg="#ffffff" size={110} />
    </group>
  </Studio>;
}}</Stage>;

// 41 · una persona, un sobre: el papel con el mapa de las pilas se dobla, entra al sobre, se lacra y se desliza por la mesa hacia una mano
export const E3Seal: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const fold = sm(tt, 0.6, 1.6), ins = sm(tt, 1.8, 2.8), flap = sm(tt, 2.9, 3.5), wax = spr(tt, 3.6, 9, 0.45), slide = sm(tt, 4.6, 6.0);
  return <Room tt={tt} c={cam([0.65, 1.05, 1.6], [0.7, 0.42, 0])} wall="wood" z={-0.8} warm={0.75}>
    <RB p={[0, 0.2, 0]} s={[1.8, 0.4, 0.9]} rad={0.03} c="#5e412a" r={0.45} />
    <group position={[0.6 * slide, 0.405, 0.08 * slide]}>
      <RB p={[0, 0.006, 0]} s={[0.46, 0.012, 0.28]} rad={0.004} c="#e8dcb8" r={0.9} />
      <group position={[0, 0.013, -0.14]} rotation={[Math.PI * (1 - flap) * 0.9, 0, 0]}><mesh position={[0, 0, 0.07]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.46, 0.14]} /><meshStandardMaterial color="#ddd0a8" side={THREE.DoubleSide} /></mesh></group>
      {wax > 0.01 && <mesh position={[0, 0.02, 0]} scale={[wax, 1, wax]}><cylinderGeometry args={[0.04, 0.045, 0.012, 24]} /><meshStandardMaterial color="#8a1a1a" roughness={0.35} /></mesh>}
      {ins < 1 && <group position={[-0.05, 0.02 + 0.18 * (1 - ins), 0.3 * (1 - ins)]}>
        <group scale={[1 - 0.5 * fold, 1, 1]}><mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.36, 0.24]} /><meshStandardMaterial color="#f6f3ec" side={THREE.DoubleSide} /></mesh>
          {[[-0.1, 0.05], [0.06, -0.06], [0.12, 0.07]].map(([x, z], i) => <mesh key={i} position={[x, 0.002, z]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.015, 0.022, 16]} /><meshBasicMaterial color="#c62a22" /></mesh>)}
          <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0.3]}><planeGeometry args={[0.24, 0.004]} /><meshBasicMaterial color="#5a5a62" /></mesh></group>
      </group>}
    </group>
    <group position={[1.05, 0.44, 0.1]}><RB s={[0.3, 0.08, 0.12]} rad={0.04} c="#d8a888" r={0.7} />{[0, 1, 2, 3].map((i) => <RB key={i} p={[-0.16, 0.0, -0.045 + i * 0.03]} s={[0.1, 0.03, 0.025]} rad={0.012} c="#d8a888" r={0.7} />)}<RB p={[0.25, 0.0, 0]} s={[0.25, 0.1, 0.14]} rad={0.03} c="#4a5a6e" r={0.8} /></group>
  </Room>;
}}</Stage>;

// 42 · las paredes finas: corte del dúplex; del lado de Walt la plata se cuenta, la onda del sonido atraviesa la pared y del otro lado una oreja enorme se pega
export const E3Earwall: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const bill = useBillTex(), ear = spr(tt, 1.6, 7, 0.5), cnt = Math.floor(c01((tt - 0.6) / 4) * 6);
  return <Room tt={tt} c={cam([0.4, 1.15, 2.5], [0.15, 0.72, -0.15])} wall="drywall" z={-1.0}>
    <RB p={[0, 0.8, -0.2]} s={[0.08, 1.6, 1.2]} rad={0.005} c="#d8d0c2" r={0.9} />
    <RB p={[-0.75, 0.38, -0.1]} s={[0.8, 0.04, 0.5]} rad={0.01} c="#8a6444" r={0.5} />
    {[[-1.05, -0.25], [-0.45, -0.25], [-1.05, 0.05], [-0.45, 0.05]].map(([x, z], i) => <RB key={i} p={[x, 0.19, z]} s={[0.04, 0.38, 0.04]} rad={0.01} c="#6a4a30" r={0.6} />)}
    {[...Array(cnt)].map((_, i) => <Bill3 key={i} p={[-0.75 + (i % 3) * 0.05, 0.405 + i * 0.003, -0.1 + (i % 2) * 0.03]} rot={[0, 0.2 * i, 0]} tex={bill} s={0.8} />)}
    {[0, 1, 2].map((i) => { const k = ((tt * 0.6 + i / 3) % 1); return <mesh key={i} position={[-0.6 + 1.1 * k, 0.7, -0.1]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.12 + 0.25 * k, 0.006, 6, 40, Math.PI]} /><meshBasicMaterial color="#e8a020" transparent opacity={0.8 * (1 - k)} toneMapped={false} /></mesh>; })}
    <group position={[0.1 + 0.15 * (1 - ear), 0.8, -0.1]} rotation={[0, -Math.PI / 2, 0]} scale={(0.001 + ear) * 2.2}>
      <mesh scale={[0.6, 1, 0.35]}><torusGeometry args={[0.16, 0.05, 16, 40, Math.PI * 1.6]} /><meshStandardMaterial color="#e0a888" roughness={0.6} /></mesh>
      <mesh position={[0, -0.04, 0]} scale={[0.5, 0.8, 0.3]}><sphereGeometry args={[0.1, 20, 16]} /><meshStandardMaterial color="#d89878" roughness={0.6} /></mesh>
    </group>
  </Room>;
}}</Stage>;

// 43 · la lasaña: una fuente de lasaña se corta de costado y cada capa de pasta tiene billetes entre medio; la espátula saca una porción y quedan las otras
export const E3Lasagna: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const bill = useBillTex(), lift = sm(tt, 2.0, 3.4);
  const Block = ({ p, k }: { p: V3; k: number }) => <group position={p}>
    {[0, 1, 2, 3].map((i) => <RB key={i} p={[0, 0.02 + i * 0.05, 0]} s={[0.24, 0.022, 0.28]} rad={0.006} c="#e8c070" r={0.6} />)}
    {[0, 1, 2].map((i) => <group key={"b" + i} position={[0, 0.045 + i * 0.05, 0]}><RB s={[0.24, 0.012, 0.28]} rad={0.004} c={k % 2 ? "#b8402a" : "#c84a30"} r={0.5} /><Bill3 p={[0.0, 0.009, 0.0]} rot={[0, Math.PI / 2 + 0.1 * i, 0]} tex={bill} s={0.55} /></group>)}
    <RB p={[0, 0.215, 0]} s={[0.24, 0.016, 0.28]} rad={0.006} c="#f2d890" r={0.8} />
  </group>;
  return <Room tt={tt} c={cam([0.5, 1.15, 1.5], [0, 0.55, 0])} wall="drywall" z={-0.8} warm={0.9}>
    <RB p={[0, 0.2, 0]} s={[1.6, 0.4, 0.9]} rad={0.02} c="#e8e2d6" r={0.5} />
    <RB p={[0, 0.44, 0]} s={[0.8, 0.08, 0.32]} rad={0.02} c="#f6f3ec" r={0.15} />
    {[-0.25, 0.0].map((x, i) => <Block key={i} p={[x, 0.41, 0]} k={i} />)}
    <group position={[0.25, 0.41 + 0.3 * lift, 0.25 * lift]} rotation={[0, -0.4 * lift, 0]}><Block p={[0, 0, 0]} k={2} /><RB p={[0, -0.006, 0]} s={[0.26, 0.006, 0.3]} rad={0.002} c="#c9ced4" m={1} r={0.2} /><RB p={[0, -0.004, 0.2]} s={[0.2, 0.006, 0.14]} rad={0.003} c="#c9ced4" m={1} r={0.18} /><RB p={[0, 0.02, 0.4]} rot={[-0.25, 0, 0]} s={[0.035, 0.03, 0.26]} rad={0.012} c="#3a2a1e" r={0.6} /></group>
  </Room>;
}}</Stage>;

// 44 · la tormenta de hielo: el barrio se congela, los cables caen, se apagan las ventanas y en el surtidor queda una sola luz con la nota escrita a mano
export const E3Icestorm: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const ice = sm(tt, 0.4, 2.2), snap = sm(tt, 2.4, 2.9), dark = sm(tt, 2.6, 3.2), sign = sm(tt, 3.6, 4.4);
  return <Studio tt={tt} floor="concrete" night={0.35 + 0.45 * dark} warm={0.5} photo={0} bg="#1a2230" keys={cam([0.35, 1.25, 2.6], [0.3, 0.7, 0])}>
    <RB p={[0, 0.006, 0]} s={[4, 0.012, 2.4]} rad={0.003} c="#8fa4b4" r={0.55} op={ice} />
    {[-1.1, 0.0].map((x, i) => <group key={i} position={[x, 0, -0.7]}><RB p={[0, 0.25, 0]} s={[0.6, 0.5, 0.45]} rad={0.01} c="#d8d0c2" r={0.85} /><mesh position={[0, 0.65, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.5, 0.3, 4]} /><meshStandardMaterial color="#e8f0f6" roughness={0.2} /></mesh><RB p={[0.12, 0.28, 0.23]} s={[0.12, 0.12, 0.01]} rad={0.003} c="#ffe2a0" e="#ffe2a0" ei={1.2 * (1 - dark)} /></group>)}
    <group position={[-0.55, 0, -0.2]}>
      <mesh position={[0, 0.7, 0]}><cylinderGeometry args={[0.03, 0.035, 1.4, 10]} /><meshStandardMaterial color="#5a4a3a" roughness={0.9} /></mesh>
      <mesh position={[0.5 - 0.0 * snap, 1.3 - 0.9 * snap, 0]} rotation={[0, 0, -0.1 - 1.1 * snap]}><cylinderGeometry args={[0.006, 0.006, 1.0, 6]} /><meshStandardMaterial color="#9ab8c8" roughness={0.1} /></mesh>
      {[...Array(6)].map((_, i) => <mesh key={i} position={[0.1 + i * 0.12, 1.3 - 0.03 - snap * (0.1 + i * 0.15), 0]}><coneGeometry args={[0.008, 0.06 * ice, 6]} /><meshStandardMaterial color="#e8f6ff" roughness={0.05} transparent opacity={0.8} /></mesh>)}
    </group>
    <group position={[1.05, 0, 0.1]}>
      <RB p={[0, 0.5, 0]} s={[0.5, 1.0, 0.4]} rad={0.04} c="#c62a22" r={0.45} />
      <RB p={[0, 1.05, 0]} s={[0.9, 0.06, 0.7]} rad={0.01} c="#e8e2d6" r={0.6} />
      <pointLight position={[0, 0.85, 0.5]} intensity={0.6} distance={2} color="#ffe2b0" />
      <group position={[0, 0.55, 0.205]} rotation={[0, 0, 0.04]} scale={sign}><Plate p={[0, 0.1, 0.02]} w={0.62} h={0.3} txt={["CASH ONLY"]} bg="#f6f3ec" fg="#22252b" size={150} /></group>
    </group>
    {[...Array(30)].map((_, i) => { const y = 2.2 - ((tt * 0.25 + rnd(i)) % 1) * 2.2; return <mesh key={i} position={[-1.8 + rnd(i, 2) * 3.6 + 0.1 * Math.sin(tt + i), y, 0.2 + rnd(i, 3) * 0.8]}><sphereGeometry args={[0.01, 6, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.7} /></mesh>; })}
  </Studio>;
}}</Stage>;

// 45 · el resumen en 60 segundos: un reloj de arena gigante da vuelta; mientras cae la arena, pasan en fila la media, el colchón, la mesita, la caja de zapatos y la cajita
export const E3Rewind: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const flip = sm(tt, 0.3, 1.2), sand = c01((tt - 1.2) / 7.5), belt = tt * 0.32;
  const items = (i: number) => { const x = ((i * 0.75 - belt) % 3.75 + 3.75) % 3.75 - 1.9; return x; };
  return <Room tt={tt} c={cam([0, 1.3, 3.2], [0, 0.7, 0])} wall="drywall" z={-1.0}>
    <group position={[0, 1.1, -0.5]} rotation={[0, 0, Math.PI * flip]}>
      {[1, -1].map((sd) => <mesh key={sd} position={[0, sd * 0.25, 0]} rotation={[sd > 0 ? Math.PI : 0, 0, 0]}><coneGeometry args={[0.22, 0.5, 32, 1, true]} /><meshPhysicalMaterial color="#e8f2f6" transmission={0.85} roughness={0.04} transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>)}
      {[1, -1].map((sd) => <RB key={"c" + sd} p={[0, sd * 0.52, 0]} s={[0.5, 0.04, 0.5]} rad={0.015} c="#8a6444" r={0.5} />)}
      <mesh position={[0, flip > 0.5 ? -0.2 - 0.1 * (1 - sand) : 0.3, 0]} scale={[1, 0.4 + 0.6 * (1 - sand), 1]}><coneGeometry args={[0.16 * (1 - sand * 0.5), 0.25, 24]} /><meshStandardMaterial color="#d8b880" roughness={0.95} /></mesh>
    </group>
    <RB p={[0, 0.26, 0.35]} s={[3.8, 0.04, 0.4]} rad={0.01} c="#3a3c42" r={0.5} />
    {[0, 1, 2, 3, 4].map((i) => { const x = items(i); return <group key={i} position={[x, 0.29, 0.35]}>
      {i === 0 && <Sock3 s={0.8} col="#5a7a6a" />}
      {i === 1 && <RB p={[0, 0.06, 0]} s={[0.5, 0.12, 0.32]} rad={0.05} c="#f2eee6" r={0.85} />}
      {i === 2 && <Night3 s={0.38} />}
      {i === 3 && <ShoeBox3 s={1.0} />}
      {i === 4 && <LockBox3 s={0.6} />}
    </group>; })}
  </Room>;
}}</Stage>;

// 46 · el último cajón: el cajón de las medias se abre, la media rellena salta afuera y el cajón queda vacío; se cierra solo
export const E3Lastsock: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const op = sm(tt, 0.2, 0.9), out = sm(tt, 0.9, 1.8), cl = sm(tt, 2.6, 3.4);
  return <Room tt={tt} c={cam([0.2, 1.25, 1.9], [0, 0.75, 0])} wall="drywall" z={-0.7}>
    <Dresser3 p={[0, 0, -0.25]} open={[0.9 * op * (1 - cl), 0, 0]} />
    <group position={[-0.1 - 0.6 * out, 0.92 + 0.5 * Math.sin(out * Math.PI) - 0.9 * out * out, 0.1 + 0.5 * out]} rotation={[0, 0, 2.5 * out]}><Sock3 s={1.4} col="#c8c0b0" stripe="#c62a22" /></group>
  </Room>;
}}</Stage>;

export const HEROES_E3 = { picture: E3Picture, reject: E3Reject, vault: E3Vault, umbrella: E3Umbrella, boat: E3Boat, slice: E3Slice, claw: E3Claw, plane: E3Plane, sold: E3Sold, seal: E3Seal, earwall: E3Earwall, lasagna: E3Lasagna, icestorm: E3Icestorm, rewind: E3Rewind, lastsock: E3Lastsock };
